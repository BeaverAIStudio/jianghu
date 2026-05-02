/**
 * minigame-cricket.js — 斗蛐蛐小游戏（v3.0 · 即时对战 · 速度+性格系统）
 * 即时制：速度决定行动频率（ATB条），无回合限制
 * 蛐蛐性格：6种性格影响战斗风格和AI行为
 * 完整博彩概率系统：动态赔率 · 庄家优势 · 冷门爆冷
 */

/* ════════════════════════════════════════
   零、蛐蛐性格系统
   ════════════════════════════════════════ */
/**
 * 6种性格 — 影响战斗行为、技能倾向、临场反应
 * atkBias    技能触发ATK倍率（>1=更倾向攻击）
 * defBias    技能触发DEF倾向
 * skillRate  额外技能触发概率修正
 * rageThreshold  进入愤怒状态的血量阈值（rage时ATK×1.3）
 * passiveBonus 被动加成 { stat, val }
 * desc 性格描述
 */
const CRICKET_PERSONALITIES = {
  fierce:  {
    name:'凶猛', icon:'🔴',
    atkBias:1.4,  defBias:0.7,  skillRate:+0.12,
    rageThreshold:0.5,
    passiveBonus:{ stat:'atk', val:2 },
    desc:'攻击欲望极强，血量越低越疯狂；低血量时暴击率+15%',
    onRage(s, who){ if(who==='player'){ s.playerAtk=Math.round(s.playerAtk*1.3); } else { s.opAtk=Math.round(s.opAtk*1.3); } }
  },
  guardian:{
    name:'守护', icon:'🔵',
    atkBias:0.8,  defBias:1.5,  skillRate:-0.05,
    rageThreshold:0.25,
    passiveBonus:{ stat:'def', val:3 },
    desc:'坚韧防守，受到重击后有概率反弹伤害',
    onHit(dmg){ return Math.random()<0.20 ? Math.floor(dmg*0.3) : 0; } // 返回反弹伤害
  },
  cunning: {
    name:'狡猾', icon:'🟣',
    atkBias:1.0,  defBias:1.0,  skillRate:+0.08,
    rageThreshold:0.35,
    passiveBonus:{ stat:'spd', val:2 },
    desc:'善用时机，暴击时附加眩晕8%；速度加成+2',
    onCrit(s, who){ if(Math.random()<0.08){ if(who==='player') s.opStunned=true; else s.playerStunned=true; return '💫眩晕！'; } return ''; }
  },
  berserk: {
    name:'暴怒', icon:'🟠',
    atkBias:1.6,  defBias:0.5,  skillRate:+0.18,
    rageThreshold:0.6,
    passiveBonus:{ stat:'atk', val:4 },
    desc:'永远处于亢奋，攻击高但防御弱；每次出击后ATK+1（最多累加10次）',
    onAttack(s, who){ const key=who==='player'?'playerBerserkStack':'opBerserkStack'; s[key]=(s[key]||0)+1; if(s[key]<=10){ if(who==='player') s.playerAtk++; else s.opAtk++; } }
  },
  steady:  {
    name:'沉稳', icon:'⚪',
    atkBias:1.0,  defBias:1.2,  skillRate:0,
    rageThreshold:0.20,
    passiveBonus:{ stat:'hp', val:10 },
    desc:'平稳发挥，技能CD缩短1；不会被眩晕效果影响超过1次',
    immuneStunAfter:1
  },
  agile:   {
    name:'灵动', icon:'🟢',
    atkBias:0.9,  defBias:0.9,  skillRate:+0.06,
    rageThreshold:0.40,
    passiveBonus:{ stat:'spd', val:4 },
    desc:'速度最快，行动条恢复速度×1.15；闪避率+8%',
    agileDodge:0.08,
    atbMult:1.15
  },
};

/* ════════════════════════════════════════
   一、蛐蛐品种数据
   ════════════════════════════════════════ */
const CRICKET_BREEDS = [
  // stamina=体力上限(越高越耐斗), regen=恢复力(越高场间回体越快、草药效果越强)
  // ★ 普通级 (rare:1) - 新手友好，容易获得
  { id:'iron_head',    name:'铁头将军', rare:1, atk:12, def:8,  spd:8,  hp:80,  stamina:120, regen:5, personality:'fierce',   skill:'铁头撞击', skillDesc:'猛力一撞，35%概率使对手眩晕', color:'#b8a060' },
  { id:'blue_wings',   name:'青翼侠客', rare:1, atk:9,  def:6,  spd:16, hp:70,  stamina:90,  regen:6, personality:'agile',    skill:'疾风翅斩', skillDesc:'速度越高伤害越大，速度差×1.5额外伤害', color:'#60b8d0' },
  { id:'brown_chopper',name:'褐衣力士', rare:1, atk:11, def:7,  spd:9,  hp:75,  stamina:110, regen:5, personality:'steady',   skill:'重劈', skillDesc:'牺牲速度换取攻击力+3', color:'#8b7355' },
  { id:'green_spring', name:'翠柳郎',   rare:1, atk:8,  def:7,  spd:14, hp:72,  stamina:95,  regen:7, personality:'agile',    skill:'柳丝缠绕', skillDesc:'降低对手速度3点', color:'#7cb342' },
  { id:'red_spike',    name:'赤针尖',   rare:1, atk:13, def:5,  spd:11, hp:68,  stamina:85,  regen:4, personality:'fierce',   skill:'针刺突袭', skillDesc:'高暴击率刺击', color:'#c62828' },
  { id:'gray_pebble',  name:'灰石子',   rare:1, atk:7,  def:11, spd:6,  hp:85,  stamina:130, regen:6, personality:'guardian', skill:'石肤术', skillDesc:'大幅提升防御3回合', color:'#757575' },
  
  // ★★ 稀有级 (rare:2) - 有一定特色
  { id:'fire_ant',     name:'赤焰战神', rare:2, atk:15, def:5,  spd:10, hp:75,  stamina:100, regen:4, personality:'berserk',  skill:'火焰爆牙', skillDesc:'附加灼烧3秒，持续掉血', color:'#e06030' },
  { id:'jade_knight',  name:'翡翠甲士', rare:2, atk:10, def:14, spd:7,  hp:90,  stamina:140, regen:7, personality:'guardian', skill:'玉甲护身', skillDesc:'护盾抵挡下一次攻击',
    regions:['youzhou', 'liaoyang', 'caoyuan', 'yanmen', 'datong', 'shuozhou'], color:'#50c880' },
  { id:'purple_flash', name:'紫电闪',   rare:2, atk:14, def:6,  spd:15, hp:70,  stamina:88,  regen:6, personality:'agile',    skill:'电光石火', skillDesc:'先发制人，首回合必中',
    regions:['songshan', 'luoyang', 'kaifeng', 'anyang'], color:'#7e57c2' },
  { id:'silver_hook',  name:'银钩月',   rare:2, atk:12, def:9,  spd:12, hp:78,  stamina:105, regen:6, personality:'cunning',  skill:'钩镰锁', skillDesc:'降低对手攻击力',
    regions:['xuzhou', 'tongguan', 'zhengzhou', 'wuhan'], color:'#b0bec5' },
  { id:'copper_shield',name:'铜甲卫',   rare:2, atk:9,  def:15, spd:6,  hp:95,  stamina:145, regen:5, personality:'guardian', skill:'铜墙铁壁', skillDesc:'反弹部分伤害',
    regions:['yangzhou', 'suzhou', 'hangzhou', 'nanjing', 'fuzhou'], color:'#d4a574' },
  { id:'crimson_fang', name:'赤牙兽',   rare:2, atk:16, def:4,  spd:13, hp:72,  stamina:92,  regen:5, personality:'berserk',  skill:'嗜血狂攻', skillDesc:'吸血恢复造成伤害的30%',
    regions:['jinyang', 'puzhou', 'jixian'], color:'#d32f2f' },
  
  // ★★★ 珍贵级 (rare:3) - 强力品种
  { id:'shadow_blade', name:'夜影刺客', rare:3, atk:18, def:4,  spd:13, hp:65,  stamina:80,  regen:5, personality:'cunning',  skill:'暗夜偷袭', skillDesc:'40%概率无视防御打出全额伤害',
    regions:['chongqing', 'chengdu', 'yueyang', 'wudu_miao'], color:'#8060d0' },
  { id:'golden_bell',  name:'黄金霸主', rare:3, atk:13, def:10, spd:10, hp:95,  stamina:130, regen:6, personality:'steady',   skill:'金钟震鸣', skillDesc:'封印对手技能，并造成伤害',
    regions:['lanzhou', 'wudu_miao', 'linxia', 'wuwei', 'dali'], color:'#d0a020' },
  { id:'azure_dragon', name:'青龙将',   rare:3, atk:15, def:8,  spd:14, hp:82,  stamina:115, regen:7, personality:'fierce',   skill:'龙吟九天', skillDesc:'震慑对手降低攻防',
    regions:['kaifeng', 'xian', 'luoyang', 'jinyang'], color:'#00838f' },
  { id:'white_tiger',  name:'白虎煞',   rare:3, atk:17, def:7,  spd:12, hp:80,  stamina:108, regen:6, personality:'berserk',  skill:'虎啸山林', skillDesc:'咆哮提升自身攻击',
    regions:['hangzhou', 'suzhou', 'nanjing', 'guangzhou', 'fuzhou'], color:'#f5f5f5' },
  { id:'black_tortoise',name:'玄武盾',  rare:3, atk:10, def:16, spd:5,  hp:100, stamina:155, regen:8, personality:'guardian', skill:'玄甲护体', skillDesc:'大幅减伤并回复生命',
    regions:['xiyu_city', 'tiandibang_fort', 'xuegu_fort'], color:'#263238' },
  { id:'vermilion_bird',name:'朱雀焰',  rare:3, atk:16, def:6,  spd:15, hp:74,  stamina:95,  regen:5, personality:'agile',    skill:'凤舞九天', skillDesc:'连续攻击2-3次',
    regions:['youzhou', 'liaoyang', 'caoyuan', 'yanmen', 'datong'], color:'#ff5722' },
  
  // ★★★★ 史诗级 (rare:4) - 极品难求
  { id:'ice_mandis',   name:'寒冰螳螂', rare:4, atk:20, def:8,  spd:12, hp:85,  stamina:110, regen:5, personality:'cunning',  skill:'冰刃双斩', skillDesc:'双段攻击，附带减速效果',
    regions:['yueyang', 'changsha', 'guangzhou', 'wuhan'], color:'#a0d8e8' },
  { id:'thunder_god',  name:'雷神将',   rare:4, atk:21, def:7,  spd:16, hp:78,  stamina:100, regen:6, personality:'agile',    skill:'雷霆万钧', skillDesc:'高伤害+麻痹效果',
    regions:['caoyuan', 'xiyu_city', 'liaoyang'], color:'#ffd700' },
  { id:'earth_king',   name:'大地君王', rare:4, atk:14, def:18, spd:4,  hp:110, stamina:170, regen:9, personality:'guardian', skill:'地动山摇', skillDesc:'群体震慑，降低敌方属性',
    regions:['caoyuan', 'youzhou', 'yanmen'], color:'#5d4037' },
  { id:'wind_sage',    name:'风行者',   rare:4, atk:17, def:6,  spd:20, hp:72,  stamina:88,  regen:7, personality:'agile',    skill:'风神领域', skillDesc:'速度压制，连续出手',
    regions:['songshan', 'luoyang', 'kaifeng', 'jinyang'], color:'#00bcd4' },
  
  // ★★★★★ 传说级 (rare:5) - 绝世神虫
  { id:'chaos_king',   name:'混沌魔王', rare:5, atk:22, def:12, spd:14, hp:100, stamina:150, regen:8, personality:'berserk',  skill:'乾坤大挪移', skillDesc:'交换双方当前血量',
    regions:['wudu_miao', 'xuegu_fort', 'funiu_mt'], color:'#c840c8' },
  { id:'celestial_emperor', name:'天帝', rare:5, atk:24, def:10, spd:18, hp:95,  stamina:140, regen:9, personality:'steady',   skill:'君临天下', skillDesc:'全面提升属性并恢复生命',
    regions:['xuegu_fort'], color:'#ffd700' },
  { id:'abyss_lord',   name:'深渊领主', rare:5, atk:25, def:8,  spd:16, hp:88,  stamina:135, regen:7, personality:'cunning',  skill:'深渊吞噬', skillDesc:'吞噬对手部分属性',
    regions:['wudang_mt'], color:'#4a148c' },
  { id:'phoenix_reborn', name:'涅槃凤凰', rare:5, atk:20, def:14, spd:15, hp:105, stamina:160, regen:10, personality:'fierce',  skill:'浴火重生', skillDesc:'濒死时满血复活一次',
    regions:['wudang_mt'], color:'#ff6f00' },

  // ═══ 神兽级 (legend:true) - 仅在最偏僻之地出没 ═══
  { id:'south_sea_dragon', name:'南海龙帝', legend:true, rare:6, atk:26, def:16, spd:18, hp:120, stamina:190, regen:12, personality:'agile',    skill:'龙啸沧海',  skillDesc:'三段连击+海浪推拒，每击伤害递增', regions:['guangzhou'],  color:'#006994' },
  { id:'wuzang_demon',     name:'乌斯魔王', legend:true, rare:6, atk:28, def:10, spd:22, hp:110, stamina:170, regen:10, personality:'berserk',  skill:'天葬轮回',  skillDesc:'每次击杀后满血复活并ATK+3（上限3次）', regions:['xiyu_city'], color:'#7b0030' },
  { id:'ice_king',         name:'极北冰帝', legend:true, rare:6, atk:22, def:20, spd:12, hp:130, stamina:210, regen:14, personality:'guardian', skill:'万里冰封',  skillDesc:'冻结全场，双方速度归零2回合', regions:['xuanming_base'], color:'#4fc3f7' },
  { id:'desert_god',       name:'大漠狂神', legend:true, rare:6, atk:30, def:8,  spd:16, hp:100, stamina:155, regen:8,  personality:'fierce',   skill:'沙暴吞天',  skillDesc:'先手即死特效，但HP越低命中率越低', regions:['manhuang'], color:'#d4a017' },
  { id:'fortress_overlord',name:'霸寨天王', legend:true, rare:6, atk:24, def:18, spd:10, hp:125, stamina:200, regen:11, personality:'steady',   skill:'雷霆万钧',  skillDesc:'召唤天雷，每回合额外造成对方最大HP10%的伤害', regions:['tiandibang_fort'], color:'#7e3800' },
  { id:'blood_bone_king',  name:'血骨冥王', legend:true, rare:6, atk:25, def:15, spd:14, hp:115, stamina:180, regen:12, personality:'cunning',  skill:'血咒锁魂',  skillDesc:'诅咒对手：每次行动损失10%当前HP，持续至一方倒下', regions:['xuegu_fort'], color:'#8b0000' },

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"蛐蛐恶搞品种
  // ═══════════════════════════════════════════════════════════════
  // ★ 恶搞级 (rare:1-2) - 搞笑但有一定实力
  { id:'sleepy_head',  name:'瞌睡虫', rare:1, atk:5,  def:15, spd:3,  hp:120, stamina:200, regen:15, personality:'steady',   skill:'睡梦罗汉', skillDesc:'每回合有30%概率睡着回血，但跳过行动', color:'#9e9e9e', desc:'它可能随时睡着，包括战斗的时候' },
  { id:'dancing_queen',name:'舞娘',   rare:2, atk:8,  def:6,  spd:18, hp:60,  stamina:80,  regen:8, personality:'agile',    skill:'魅惑之舞', skillDesc:'跳舞迷惑对手，使其下回合命中率-50%', color:'#ff69b4', desc:'战斗不如跳舞~' },
  { id:'fat_boy',      name:'胖墩墩', rare:1, atk:6,  def:20, spd:2,  hp:150, stamina:250, regen:5, personality:'guardian', skill:'泰山压顶', skillDesc:'用体重压垮对手，但自己也会累', color:'#ffcc80', desc:'它真的很重' },
  { id:'ninja_cricket',name:'忍者蛐', rare:2, atk:14, def:4,  spd:20, hp:55,  stamina:70,  regen:6, personality:'cunning',  skill:'烟雾弹',   skillDesc:'释放烟雾，本回合双方都无法命中', color:'#424242', desc:'你看不见我，我也看不见你' },
  { id:'lucky_star',   name:'幸运星', rare:2, atk:7,  def:7,  spd:10, hp:70,  stamina:90,  regen:7, personality:'steady',   skill:'幸运一击', skillDesc:'10%概率打出10倍伤害，90%概率miss', color:'#ffd700', desc:'运气流玩家首选' },
  { id:'angry_bird',   name:'愤怒蛐', rare:2, atk:18, def:3,  spd:12, hp:50,  stamina:60,  regen:4, personality:'berserk',  skill:'自爆攻击', skillDesc:'牺牲50%HP造成巨大伤害', color:'#d32f2f', desc:'它很生气，后果很严重' },
  { id:'cute_loli',    name:'萌妹子', rare:2, atk:4,  def:8,  spd:14, hp:65,  stamina:85,  regen:10, personality:'agile',   skill:'卖萌攻击', skillDesc:'卖萌使对手不忍心下手，攻击-30%', color:'#f8bbd0', desc:'可爱即正义！' },
  { id:'old_master',   name:'老师傅', rare:2, atk:12, def:12, spd:5,  hp:90,  stamina:120, regen:8, personality:'steady',   skill:'以静制动', skillDesc:'受到攻击时50%概率反击', color:'#795548', desc:'姜还是老的辣' },
  { id:'gambler',      name:'赌狗',   rare:2, atk:10, def:5,  spd:12, hp:60,  stamina:75,  regen:6, personality:'cunning',  skill:'孤注一掷', skillDesc:'50%概率伤害翻倍，50%概率自己受伤', color:'#8e24aa', desc:'搏一搏，单车变摩托' },
  { id:'kung_fu_panda',name:'功夫熊', rare:3, atk:15, def:12, spd:8,  hp:100, stamina:130, regen:9, personality:'fierce',   skill:'神龙摆尾', skillDesc:'传说中的招式，伤害极高', color:'#fff176', desc:'它相信自己是熊猫' },
];

// 字符画：每种蛐蛐5帧（stand/charge/attack/hurt/ko）
const CRICKET_ART = {
  iron_head: {
    stand:  ['  (\\/)  ','  (o o) ','  |||||  '],
    charge: ['  (\\/)  ','  (> <) ','  ||||>  '],
    attack: [' >(\\/)  ','  (> .) ','  |||||  '],
    hurt:   ['  (\\/)  ','  (x x) ','  ||||\\  '],
    ko:     ['  (\\/)  ','  (- -) ','  //\\\\  '],
  },
  blue_wings: {
    stand:  ['  ~\\/~  ','  (o o) ','  |/\\|  '],
    charge: [' ~~\\/~~ ','  (^ ^) ','  |/\\|  '],
    attack: ['  ~\\/>>','  (> .) ','  |/\\|  '],
    hurt:   ['  ~\\/~  ','  (x o) ','  |/\\>  '],
    ko:     ['  ~\\/~  ','  (- -) ','  ////  '],
  },
  fire_ant: {
    stand:  ['  /\\o/\\ ','  (o o) ','  ||||   '],
    charge: ['  /\\*/\\ ','  (> <) ','  ||||   '],
    attack: [' */\\o/\\*','  (*_*) ','  ||||   '],
    hurt:   ['  /\\o/\\ ','  (x x) ','  |\\|/  '],
    ko:     ['  /\\o/\\ ','  (. .) ','  ~~~~  '],
  },
  jade_knight: {
    stand:  ['  [\\/ ] ','  [o o] ','  |=||  '],
    charge: ['  [\\/+] ','  [^ ^] ','  |=||  '],
    attack: [' +[\\/+] ','  [> .] ','  |=||  '],
    hurt:   ['  [\\/!] ','  [x x] ','  |=|/  '],
    ko:     ['  [\\/~] ','  [- -] ','  ~~~~  '],
  },
  shadow_blade: {
    stand:  ['  *\\/  ','  (o o)','  |\\|  '],
    charge: ['  *\\/ *','  (> <)','  |\\|  '],
    attack: [' *(\\/)* ','  (> .)','  |\\|  '],
    hurt:   ['  *\\/  ','  (x x)','  |/|  '],
    ko:     ['  *\\/  ','  (. .)','  ///  '],
  },
  golden_bell: {
    stand:  ['  (O)   ','  (o o) ','  ||||  '],
    charge: ['  (O!)  ','  (^ ^) ','  ||||  '],
    attack: [' !(O)!  ','  (* *) ','  ||||  '],
    hurt:   ['  (O)   ','  (x x) ','  |//|  '],
    ko:     ['  (O)   ','  (. .) ','  ====  '],
  },
  ice_mandis: {
    stand:  ['  /|\\   ','  (o o) ','  ////  '],
    charge: ['  *|*   ','  (> <) ','  ////  '],
    attack: [' */|\\*  ','  (x .) ','  \\\\\\\\  '],
    hurt:   ['  /|\\   ','  (x x) ','  ////  '],
    ko:     ['  /|\\   ','  (. .) ','  ====  '],
  },
  chaos_king: {
    stand:  ['  @\\/@ ','  (@,@) ','  ||||  '],
    charge: ['  @\\/@*','  (@o@) ','  ||||  '],
    attack: [' *@\\/@* ','  (@!@) ','  ||||  '],
    hurt:   ['  @\\/@ ','  (x,x) ','  |//|  '],
    ko:     ['  @\\/@ ','  (-,-) ','  ~~~~  '],
  },
  south_sea_dragon: {
    stand:  ['  ~\\/~ ',' ~(o.o)~ ',' ~/\\~  '],
    charge: ['  ≋\\/≋ ',' ~(>.<)~ ',' ~/\\~  '],
    attack: ['≋≋≋\\/@≋≋','~(>★<)~ ',' ~/\\/~  '],
    hurt:   ['  ~\\/~ ',' ~(x.x)~ ',' ~/\\~  '],
    ko:     ['  ~~~~ ',' ~(·.·)~ ',' ~~~~  '],
  },
  wuzang_demon: {
    stand:  [' ╔⊙\\\/⊙╗',' ║(@,@)║',' ╚══╩══╝'],
    charge: ['╔⊙★\\/★⊙╗','║(@!@)║',' ╚══╩══╝'],
    attack: ['★╔⊙\\/⊙╗★','★║(@!@)║★',' ╚══╩══╝'],
    hurt:   ['╔⊙!\\\/!⊙╗','║(x,x)║','╚══╩══╝'],
    ko:     ['╔⊙~\\/~⊙╗','║(-,-)║','╚═══╩═══╝'],
  },
  ice_king: {
    stand:  ['  /◆\\ ',' ◆(o.o)◆',' ///\\\\  '],
    charge: [' /♦\\ ',' ◆(>.<)◆',' ///\\\\  '],
    attack: ['⚡◆\\\/◆⚡',' ◆(★.★)◆',' ///≋\\\\  '],
    hurt:   [' /◆\\ ',' ◆(x.x)◆',' //×\\\\  '],
    ko:     [' /◆\\ ',' ◆(-.-)◆',' /////\\\\  '],
  },
  desert_god: {
    stand:  ['  ∴\\/∴ ',' ∴(o.o)∴ ','  ≋≋≋≋  '],
    charge: [' ∴★\\/★∴ ',' ∴(>★<)∴ ','  ≋≋≋≋  '],
    attack: ['≋≋∴\\/∴≋≋','∴(★!★)∴','  ≋≋≋≋  '],
    hurt:   ['  ∴\\/∴ ',' ∴(x.x)∴ ','  ≋≋≋≋  '],
    ko:     ['  ∴~\\/~∴ ',' ∴(-.-)∴ ','  ~~~~  '],
  },
  fortress_overlord: {
    stand:  [' ╔⊙\\\/⊙╗',' ║⚡⚡⚡║',' ═══╩═══'],
    charge: ['╔⊙★\\/★⊙╗','║⚡★⚡║',' ═══╩═══'],
    attack: ['⚡╔⊙\\/⊙╗⚡','║⚡★⚡║',' ═══╩═══'],
    hurt:   ['╔⊙!\\\/!⊙╗','║⚡⚡⚡║',' ═══╩═══'],
    ko:     ['╔⊙~\\/~⊙╗','║(-,-)║',' ════╩══'],
  },
  blood_bone_king: {
    stand:  ['  ╳\\/╳ ',' ▓(@,@)▓',' ═══╩═══'],
    charge: ['  ╳★\\/★╳ ',' ▓(@!@)▓',' ═══╩═══'],
    attack: ['▓▓╳\\/╳▓▓','▓▓(@!@)▓▓',' ═══╩═══'],
    hurt:   ['  ╳!\\/!╳ ',' ▓(x,x)▓',' ═══╩═══'],
    ko:     ['  ╳~\\/~╳ ',' ▓(-.-)▓',' ════╩══'],
  },
  // ★ 普通级新增
  brown_chopper: {
    stand:  ['  /\\/\  ','  (o o) ','  |==|  '],
    charge: ['  /\\/\  ','  (> <) ','  |=>|  '],
    attack: ['  /\\/\> ','  (> .) ','  |==|  '],
    hurt:   ['  /\\/\  ','  (x x) ','  |==|  '],
    ko:     ['  /\\/\  ','  (- -) ','  |~~|  '],
  },
  green_spring: {
    stand:  ['  ~\/~~ ','  (o o) ','  \/\/  '],
    charge: [' ~~\/~~ ','  (^ ^) ','  \/\/  '],
    attack: ['  ~\/>> ','  (> .) ','  \/\/  '],
    hurt:   ['  ~\/~~ ','  (x o) ','  \/\>  '],
    ko:     ['  ~\/~~ ','  (- -) ','  \/\/  '],
  },
  red_spike: {
    stand:  ['   ||   ','  (o o) ','  ||||  '],
    charge: ['   ||   ','  (> <) ','  ||>>  '],
    attack: ['   ||>  ','  (> .) ','  ||||  '],
    hurt:   ['   ||   ','  (x x) ','  ||\\  '],
    ko:     ['   ||   ','  (- -) ','  //\\  '],
  },
  gray_pebble: {
    stand:  ['  (oo)  ','  (o o) ','  ||||  '],
    charge: ['  (oo)  ','  (> <) ','  ||>>  '],
    attack: ['  (oo)> ','  (> .) ','  ||||  '],
    hurt:   ['  (oo)  ','  (x x) ','  ||\\  '],
    ko:     ['  (oo)  ','  (- -) ','  ====  '],
  },
  // ★★ 稀有级新增
  purple_flash: {
    stand:  ['  ⚡\/⚡ ','  (o o) ','  ||||  '],
    charge: [' ⚡\/⚡ ','  (^ ^) ','  ||>>  '],
    attack: [' ⚡\/⚡>','  (> .) ','  ||||  '],
    hurt:   ['  ⚡\/⚡ ','  (x x) ','  ||\\  '],
    ko:     ['  ⚡\/⚡ ','  (- -) ','  //\\  '],
  },
  silver_hook: {
    stand:  ['  )\/(  ','  (o o) ','  ||||  '],
    charge: ['  )\/(  ','  (> <) ','  ||>>  '],
    attack: ['  )\/(> ','  (> .) ','  ||||  '],
    hurt:   ['  )\/(  ','  (x x) ','  ||\\  '],
    ko:     ['  )\/(  ','  (- -) ','  ====  '],
  },
  copper_shield: {
    stand:  ['  [##]  ','  [o o] ','  |=||  '],
    charge: ['  [##]  ','  [^ ^] ','  |=>>  '],
    attack: ['  [##]> ','  [> .] ','  |=||  '],
    hurt:   ['  [##]  ','  [x x] ','  |=|/  '],
    ko:     ['  [##]  ','  [- -] ','  |~~|  '],
  },
  crimson_fang: {
    stand:  ['  /\/\  ','  (o o) ','  |vv|  '],
    charge: ['  /\/\  ','  (> <) ','  |vv|  '],
    attack: ['  /\/\> ','  (v v) ','  |vv|  '],
    hurt:   ['  /\/\  ','  (x x) ','  |vv|  '],
    ko:     ['  /\/\  ','  (- -) ','  |~~|  '],
  },
  // ★★★ 珍贵级新增
  azure_dragon: {
    stand:  ['  ◆\/◆ ','  (o o) ','  ||||  '],
    charge: ['  ◆\/◆ ','  (> <) ','  ||>>  '],
    attack: ['  ◆\/◆>','  (> .) ','  ||||  '],
    hurt:   ['  ◆\/◆ ','  (x x) ','  ||\\  '],
    ko:     ['  ◆\/◆ ','  (- -) ','  //\\  '],
  },
  white_tiger: {
    stand:  ['  ◇\/◇ ','  (o o) ','  ||||  '],
    charge: ['  ◇\/◇ ','  (> <) ','  ||>>  '],
    attack: ['  ◇\/◇>','  (> .) ','  ||||  '],
    hurt:   ['  ◇\/◇ ','  (x x) ','  ||\\  '],
    ko:     ['  ◇\/◇ ','  (- -) ','  //\\  '],
  },
  black_tortoise: {
    stand:  ['  ●\/● ','  (o o) ','  ||||  '],
    charge: ['  ●\/● ','  (> <) ','  ||>>  '],
    attack: ['  ●\/●>','  (> .) ','  ||||  '],
    hurt:   ['  ●\/● ','  (x x) ','  ||\\  '],
    ko:     ['  ●\/● ','  (- -) ','  //\\  '],
  },
  vermilion_bird: {
    stand:  ['  ○\/○ ','  (o o) ','  ||||  '],
    charge: ['  ○\/○ ','  (> <) ','  ||>>  '],
    attack: ['  ○\/○>','  (> .) ','  ||||  '],
    hurt:   ['  ○\/○ ','  (x x) ','  ||\\  '],
    ko:     ['  ○\/○ ','  (- -) ','  //\\  '],
  },
  // ★★★★ 史诗级新增
  thunder_god: {
    stand:  ['  ⚡|⚡  ','  (o o) ','  ||||  '],
    charge: [' ⚡⚡⚡⚡ ','  (^ ^) ','  ||>>  '],
    attack: [' ⚡⚡⚡⚡>','  (> .) ','  ||||  '],
    hurt:   ['  ⚡|⚡  ','  (x x) ','  ||\\  '],
    ko:     ['  ⚡|⚡  ','  (- -) ','  //\\  '],
  },
  earth_king: {
    stand:  ['  ▲\/▲ ','  (o o) ','  ||||  '],
    charge: ['  ▲\/▲ ','  (> <) ','  ||>>  '],
    attack: ['  ▲\/▲>','  (> .) ','  ||||  '],
    hurt:   ['  ▲\/▲ ','  (x x) ','  ||\\  '],
    ko:     ['  ▲\/▲ ','  (- -) ','  //\\  '],
  },
  wind_sage: {
    stand:  ['  ~\/~~ ','  (o o) ','  ||||  '],
    charge: [' ~~~\/~~ ','  (^ ^) ','  ||>>  '],
    attack: [' ~~~\/>>','  (> .) ','  ||||  '],
    hurt:   ['  ~\/~~ ','  (x x) ','  ||\\  '],
    ko:     ['  ~\/~~ ','  (- -) ','  //\\  '],
  },
  // ★★★★★ 传说级新增
  celestial_emperor: {
    stand:  ['  ♔\/♔ ','  (o o) ','  ||||  '],
    charge: ['  ♔\/♔ ','  (> <) ','  ||>>  '],
    attack: ['  ♔\/♔>','  (> .) ','  ||||  '],
    hurt:   ['  ♔\/♔ ','  (x x) ','  ||\\  '],
    ko:     ['  ♔\/♔ ','  (- -) ','  //\\  '],
  },
  abyss_lord: {
    stand:  ['  ◉\/◉ ','  (o o) ','  ||||  '],
    charge: ['  ◉\/◉ ','  (> <) ','  ||>>  '],
    attack: ['  ◉\/◉>','  (> .) ','  ||||  '],
    hurt:   ['  ◉\/◉ ','  (x x) ','  ||\\  '],
    ko:     ['  ◉\/◉ ','  (- -) ','  //\\  '],
  },
  phoenix_reborn: {
    stand:  ['  ✦\/✦ ','  (o o) ','  ||||  '],
    charge: [' ✦✦✦✦✦ ','  (^ ^) ','  ||>>  '],
    attack: [' ✦✦✦✦✦>','  (> .) ','  ||||  '],
    hurt:   ['  ✦\/✦ ','  (x x) ','  ||\\  '],
    ko:     ['  ✦\/✦ ','  (- -) ','  //\\  '],
  },
    regions:['dali'],
};

/* ════════════════════════════════════════
   二、擂主池（NPC对手）
   winRate：庄家预估基础胜率（玩家视角）
   ════════════════════════════════════════ */
const CRICKET_OPPONENTS = [
  { id:'op_villager', name:'刘大叔', title:'街头老手', level:1, breedId:'iron_head',  lvBonus:0,  betRange:[5,20],   winRate:0.58 },
  { id:'op_merchant', name:'钱掌柜', title:'赌坊庄家', level:2, breedId:'blue_wings', lvBonus:5,  betRange:[10,50],  winRate:0.52 },
  { id:'op_soldier',  name:'赵班头', title:'官差老兵', level:3, breedId:'jade_knight',lvBonus:10, betRange:[20,100], winRate:0.50 },
  { id:'op_scholar',  name:'陈秀才', title:'书香虫迷', level:4, breedId:'fire_ant',   lvBonus:15, betRange:[30,150], winRate:0.47 },
  { id:'op_boss',     name:'霸王虫',  title:'坊主擂主',level:5, breedId:'golden_bell', lvBonus:25, betRange:[50,300], winRate:0.44 },
  { id:'op_hermit',   name:'虫道人', title:'化外隐士', level:6, breedId:'shadow_blade',lvBonus:30,betRange:[80,500], winRate:0.42 },
  { id:'op_king',     name:'蛐蛐王',  title:'天下第一虫',level:7,breedId:'chaos_king', lvBonus:40,betRange:[200,1000],winRate:0.38},
];

/* ════════════════════════════════════════
   二点五、斗蛐蛐城市配置
   ════════════════════════════════════════ */
const CRICKET_CITIES = [
  'luoyang',    // 洛阳
  'kaifeng',    // 开封
  'xian',       // 长安
  'yangzhou',   // 扬州
  'nanjing',    // 金陵
  'chengdu',    // 成都
  'youzhou',    // 幽州
];

function cityHasCricket(cityId) {
  return CRICKET_CITIES.includes(cityId);
}

/* ════════════════════════════════════════
   三、特殊事件池
   ════════════════════════════════════════ */
const CRICKET_EVENTS = [
  { id:'rain',    name:'忽降小雨', desc:'场地潮湿，双方速度-2',       apply:(s)=>{ s.playerSpd-=2; s.opSpd-=2; } },
  { id:'heat',    name:'骄阳似火', desc:'高温使双方攻击力+3',         apply:(s)=>{ s.playerAtk+=3; s.opAtk+=3; } },
  { id:'wind',    name:'一阵阴风', desc:'对手受到惊吓，防御-4',       apply:(s)=>{ s.opDef-=4; } },
  { id:'cheer',   name:'全场喝彩', desc:'你的蛐蛐受到鼓励，攻击+5',  apply:(s)=>{ s.playerAtk+=5; } },
  { id:'mud',     name:'场地泥泞', desc:'双方防御+3但速度-3',        apply:(s)=>{ s.playerDef+=3; s.opDef+=3; s.playerSpd-=3; s.opSpd-=3; } },
  { id:'honey',   name:'神秘蜂蜜', desc:'你的蛐蛐偷食蜂蜜，恢复15血',apply:(s)=>{ s.playerHp=Math.min(s.playerHpMax,s.playerHp+15); } },
  { id:'noise',   name:'锣鼓喧天', desc:'喧闹声使双方暴击率+8%',     apply:(s)=>{ s.critBonus=(s.critBonus||0)+0.08; } },
  { id:'cold',    name:'寒气袭来', desc:'寒气令双方速度-4，防御+2',   apply:(s)=>{ s.playerSpd-=4; s.opSpd-=4; s.playerDef+=2; s.opDef+=2; } },
];

/* ════════════════════════════════════════
   四、玩家指令池（即时制版 · CD改为毫秒）
   ════════════════════════════════════════ */
const CG_COMMANDS = [
  {
    id: 'encourage',
    icon: '📣',
    name: '大声喝彩',
    desc: '攻击+2~4，持续4秒；有12%概率触发亢奋',
    cooldownMs: 5000,   // 5秒CD
    effect(s){
      const now = performance.now();
      const boost = 2 + Math.floor(Math.random()*3);
      // 若上次喝彩还未消退先还原
      if(s.playerCheerBoost > 0 && s.playerCheerBoostEnd > now){
        s.playerAtk = Math.max(1, s.playerAtk - s.playerCheerBoost);
      }
      s.playerCheerBoost = boost;
      s.playerCheerBoostEnd = now + 4000;
      s.playerAtk += boost;
      const log = [`📣 大声喝彩！${s.playerName}攻击+${boost}（4秒）`];
      if(Math.random() < 0.12){
        s.playerCritBonus = (s.playerCritBonus||0) + 0.15;
        setTimeout(()=>{ if(s.playerCritBonus > 0) s.playerCritBonus = Math.max(0, s.playerCritBonus - 0.15); }, 4000);
        log.push(`🔥 蛐蛐热血上头！暴击率+15%（4秒）`);
      }
      return log;
    }
  },
  {
    id: 'splash',
    icon: '💧',
    name: '泼水提神',
    desc: '泼冷水刺激蛐蛐，回复少量血量',
    cooldownMs: 6000,
    effect(s){
      if(Math.random() < 0.15){
        s.playerSpd = Math.max(1, s.playerSpd - 1);
        return [`💧 泼水不当，${s.playerName}被激怒！速度-1`];
      }
      const heal = 8 + Math.floor(Math.random()*8);
      s.playerHp = Math.min(s.playerHpMax, s.playerHp + heal);
      return [`💧 泼水提神！${s.playerName}恢复 ${heal} 血`];
    }
  },
  {
    id: 'distract',
    icon: '🔔',
    name: '摇铃扰敌',
    desc: '干扰对手，有概率使其攻击下降或眩晕',
    cooldownMs: 6000,
    effect(s){
      const now = performance.now();
      const r = Math.random();
      if(r < 0.20){
        s.opStunned = true;
        return [`🔔 铃声大作！${s.opName}受惊眩晕！`];
      } else if(r < 0.55){
        s.opAtk = Math.max(1, s.opAtk - 3);
        s.opDistractEnd = now + 3000;
        return [`🔔 ${s.opName}受到干扰，攻击-3（3秒）`];
      } else {
        return [`🔔 摇铃无效，对手纹丝不动`];
      }
    }
  },
  {
    id: 'feed',
    icon: '🍬',
    name: '投喂糖粒',
    desc: '偷喂蛐蛐糖粒，有违规风险',
    cooldownMs: 8000,
    effect(s){
      const r = Math.random();
      if(r < 0.50){
        s.playerAtk += 3;
        s.playerDef += 2;
        return [`🍬 糖粒入口！${s.playerName}攻击+3，防御+2`];
      } else if(r < 0.70){
        s.feedPenaltyNext = true;
        return [`⚠️ 裁判注意到异动，投喂未成功！下次CD加长`];
      } else {
        const fine = Math.floor(s.bet * 0.1);
        s.betPenalty = (s.betPenalty||0) + fine;
        return [`🚫 被发现违规！扣除 ${fine} 两保证金！`];
      }
    }
  },
  {
    id: 'taunt',
    icon: '😤',
    name: '口头挑衅',
    desc: '激怒对方蛐蛐，双刃剑',
    cooldownMs: 4000,
    effect(s){
      const now = performance.now();
      if(Math.random() < 0.20){
        s.playerAtk = Math.max(1, s.playerAtk - 2);
        return [`😤 挑衅过度，${s.playerName}也被搅乱心神！攻击-2`];
      }
      s.opAtk += 4;
      s.opDef  = Math.max(1, s.opDef - 3);
      s.opTauntedEnd = now + 5000;
      return [`😤 成功激怒对手！${s.opName}攻击+4但防御-3（5秒后消退）`];
    }
  },
  {
    id: 'strategy',
    icon: '🧠',
    name: '战术指点',
    desc: '缩短技能CD或提升攻防',
    cooldownMs: 6000,
    effect(s){
      const now = performance.now();
      if(s.playerSkillCooldown > now){
        const reduce = (1500 + Math.floor(Math.random()*1000));
        s.playerSkillCooldown = Math.max(now, s.playerSkillCooldown - reduce);
        return [`🧠 战术指点！技能CD缩短 ${(reduce/1000).toFixed(1)} 秒`];
      } else {
        s.playerAtk += 2; s.playerDef += 2;
        return [`🧠 战术完善！攻防各+2`];
      }
    }
  },
  {
    id: 'herb',
    icon: '🌿',
    name: '喂草药汁',
    desc: '单场限一次，回血量取决于蛐蛐恢复力，体力≥30才可用',
    cooldownMs: 999999,
    oneTime: true,
    effect(s){
      // 体力检查：体力低于30%时草药效果大打折扣
      const staminaRatio = s.playerStamina / Math.max(1, s.playerStaminaMax);
      if(staminaRatio < 0.10){
        return [`🌿 蛐蛐体力耗尽，草药无法吸收！`];
      }
      // 回血量 = regen × 2（基础约10~16），体力越低效果越差
      const baseHeal = Math.max(3, Math.floor(s.playerRegen * 2 * staminaRatio));
      s.playerHp = Math.min(s.playerHpMax, s.playerHp + baseHeal);
      // 清除灼烧
      s.playerBurnEnd = 0;
      const msg = staminaRatio < 0.35
        ? `🌿 草药汁效果减弱（体力不足），恢复 ${baseHeal} 血，清除灼烧`
        : `🌿 草药汁奏效！恢复 ${baseHeal} 血，清除灼烧状态`;
      return [msg];
    }
  },
];


/* ════════════════════════════════════════
   五-A、对方AI指令池
   ════════════════════════════════════════ */

/**
 * 对方AI指令池
 */
const CG_AI_COMMANDS = [
  {
    id: 'ai_roar',
    icon: '😤',
    name: '大吼助威',
    weight: 20, urgency: 1.3,
    effect(s){
      const now = performance.now();
      const boost = 2 + Math.floor(Math.random()*3);
      if(s.opRoarBoost > 0 && s.opRoarBoostEnd > now){
        s.opAtk = Math.max(1, s.opAtk - s.opRoarBoost);
      }
      s.opRoarBoost = boost;
      s.opRoarBoostEnd = now + 5000;
      s.opAtk += boost;
      const logs = [`😤 ${s.opMasterName}大声助威！${s.opName}攻击+${boost}（5秒）`];
      if(Math.random() < 0.10){
        s.opCritBonus = (s.opCritBonus||0) + 0.15;
        setTimeout(()=>{ if(s.opCritBonus > 0) s.opCritBonus = Math.max(0, s.opCritBonus - 0.15); }, 5000);
        logs.push(`🔥 ${s.opName}斗志大振！暴击率+15%（5秒）`);
      }
      return logs;
    }
  },
  {
    id: 'ai_splash',
    icon: '💦',
    name: '喷水提气',
    weight: 16, urgency: 2.5,
    effect(s){
      if(Math.random() < 0.12){
        s.opSpd = Math.max(1, s.opSpd - 1);
        return [`💦 ${s.opMasterName}喷水失准，${s.opName}速度-1`];
      }
      const heal = 7 + Math.floor(Math.random()*9);
      s.opHp = Math.min(s.opHpMax, s.opHp + heal);
      return [`💦 ${s.opMasterName}喷水提气！${s.opName}恢复 ${heal} 血`];
    }
  },
  {
    id: 'ai_distract',
    icon: '🪘',
    name: '击鼓扰你',
    weight: 15, urgency: 1.2,
    effect(s){
      const now = performance.now();
      const r = Math.random();
      if(r < 0.18){
        s.playerStunned = true;
        return [`🪘 鼓声震耳！${s.playerName}受惊眩晕！`];
      } else if(r < 0.52){
        s.playerAtk = Math.max(1, s.playerAtk - 3);
        s.playerDistractEnd = now + 3000;
        return [`🪘 ${s.playerName}被鼓声干扰，攻击-3（3秒）`];
      } else {
        return [`🪘 击鼓扰阵，你的蛐蛐纹丝不动`];
      }
    }
  },
  {
    id: 'ai_feed',
    icon: '🥩',
    name: '偷喂肉粒',
    weight: 12, urgency: 1.8,
    effect(s){
      const r = Math.random();
      if(r < 0.45){
        s.opAtk += 3; s.opDef += 2;
        return [`🥩 ${s.opMasterName}偷喂肉粒！${s.opName}攻+3防+2`];
      } else if(r < 0.68){
        s.opFeedPenalty = true;
        return [`⚠️ 裁判盯住了${s.opMasterName}，喂食未成！`];
      } else {
        const fine = Math.floor(s.bet * 0.08);
        s.opBetPenalty = (s.opBetPenalty||0) + fine;
        return [`🚫 ${s.opMasterName}违规喂食被罚款 ${fine} 两！（将从赔金扣除）`];
      }
    }
  },
  {
    id: 'ai_taunt',
    icon: '🫵',
    name: '当场嘲弄',
    weight: 14, urgency: 0.7,
    effect(s){
      const now = performance.now();
      if(Math.random() < 0.22){
        s.opAtk = Math.max(1, s.opAtk - 2);
        s.opTauntedEnd = now + 4000;
        return [`🫵 嘲弄过火，${s.opName}也被波及！攻击-2（4秒）`];
      }
      s.playerTauntedEnd = now + 5000;
      s.playerAtk += 4;
      s.playerDef = Math.max(1, s.playerDef - 3);
      return [`🫵 ${s.opMasterName}当众嘲弄！你的蛐蛐被激怒，攻击+4但防御-3（5秒）`];
    }
  },
  {
    id: 'ai_herb',
    icon: '🧪',
    name: '秘制药水',
    weight: 8, urgency: 4.0,
    oneTime: true,
    effect(s){
      const heal = Math.floor(s.opHpMax * 0.22);
      s.opHp = Math.min(s.opHpMax, s.opHp + heal);
      s.opBurnEnd = 0;
      return [`🧪 ${s.opMasterName}祭出秘制药水！${s.opName}恢复${heal}血，清除灼烧`];
    }
  },
  {
    id: 'ai_pressure',
    icon: '🗣️',
    name: '施压叫阵',
    weight: 10, urgency: 1.1,
    effect(s){
      const now = performance.now();
      const r = Math.random();
      if(r < 0.30){
        s.playerSkillCooldown = Math.max(s.playerSkillCooldown, now) + 1500;
        return [`🗣️ ${s.opMasterName}大声叫阵！${s.playerName}技能CD+1.5秒`];
      } else if(r < 0.55){
        s.playerAtk = Math.max(1, s.playerAtk - 2);
        s.playerPressureEnd = now + 4000;
        return [`🗣️ ${s.opMasterName}施加心理压力！你的蛐蛐攻击-2（4秒）`];
      } else {
        s.opDef += 2;
        return [`🗣️ ${s.opMasterName}叫阵激励己方！${s.opName}防御+2`];
      }
    }
  },
];

/**
 * 各擂主AI性格定义
 * weights: 对各指令id的权重倍率（override）
 * cmdProb: 每回合发指令的基础概率
 * personality: 性格描述
 */
const CG_AI_PERSONALITIES = {
  op_villager:  { cmdProb:0.30, personality:'莽撞', weights:{ ai_roar:2.0, ai_taunt:1.5 } },
  op_merchant:  { cmdProb:0.40, personality:'精明', weights:{ ai_feed:2.5, ai_pressure:1.8, ai_herb:1.5 } },
  op_soldier:   { cmdProb:0.45, personality:'稳健', weights:{ ai_splash:2.0, ai_distract:1.5 } },
  op_scholar:   { cmdProb:0.40, personality:'阴险', weights:{ ai_distract:2.5, ai_pressure:2.0, ai_taunt:1.3 } },
  op_boss:      { cmdProb:0.50, personality:'霸道', weights:{ ai_roar:2.0, ai_feed:2.0, ai_herb:2.5, ai_pressure:1.5 } },
  op_hermit:    { cmdProb:0.55, personality:'神秘', weights:{ ai_herb:3.0, ai_distract:2.0, ai_splash:1.5 } },
  op_king:      { cmdProb:0.65, personality:'至尊', weights:{ ai_feed:2.5, ai_herb:3.5, ai_roar:2.0, ai_pressure:2.0, ai_taunt:2.0 } },
};

/**
 * AI指令决策引擎
 * 返回选中的指令定义，或null（不发指令）
 */
function cgAiDecideCommand(s, now){
  if(!s || s.over) return null;
  const nowMs = now || performance.now();
  const opId = s.opponentRef.id;
  const persona = CG_AI_PERSONALITIES[opId] || { cmdProb:0.35, weights:{} };

  let prob = persona.cmdProb;
  const hpRatio = s.opHp / s.opHpMax;
  if(hpRatio < 0.20) prob = Math.min(0.92, prob * 2.5);
  else if(hpRatio < 0.35) prob = Math.min(0.80, prob * 1.8);
  else if(hpRatio < 0.50) prob = Math.min(0.65, prob * 1.3);
  const playerHpRatio = s.playerHp / s.playerHpMax;
  if(playerHpRatio > hpRatio * 1.5) prob = Math.min(0.85, prob * 1.4);
  if(Math.random() > prob) return null;

  // 过滤：使用时间戳判断CD（>nowMs = 还在CD）
  const available = CG_AI_COMMANDS.filter(c => {
    const cdEnd = s.aiCmdCooldowns[c.id] || 0;
    if(cdEnd >= 999999) return false;  // oneTime used
    if(cdEnd > nowMs)   return false;  // still on cd
    return true;
  });
  if(!available.length) return null;

  const weights = available.map(c => {
    let w = c.weight;
    // 个性权重
    if(persona.weights[c.id]) w *= persona.weights[c.id];
    // 血量紧急度
    if(hpRatio < 0.30) w *= (c.urgency || 1);
    // 技能已有CD时调高战术指令
    return w;
  });
  const total = weights.reduce((a,b)=>a+b,0);
  let rand = Math.random() * total;
  for(let i=0;i<available.length;i++){
    rand -= weights[i];
    if(rand <= 0) return available[i];
  }
  return available[available.length-1];
}

/* ════════════════════════════════════════
   五、博彩赔率系统
   ════════════════════════════════════════ */

/**
 * 计算当前赔率（含庄家优势）
 * 返回 { playerOdds, opOdds, label, trueWinRate, edge }
 * 赔率 = 1:X，玩家投入1两获得X两（含本金）
 */
function cgCalcOdds(playerStats, opStats, op){
  // 基于属性估算真实胜率
  const pPower = playerStats.atk * 1.2 + playerStats.def * 0.8 + playerStats.spd * 0.5 + playerStats.hp * 0.3;
  const oPower = opStats.atk   * 1.2 + opStats.def   * 0.8 + opStats.spd   * 0.5 + opStats.hp   * 0.3;
  let trueRate = pPower / (pPower + oPower);

  // 对手擂主有主场优势 +5%
  trueRate = Math.max(0.08, Math.min(0.92, trueRate - 0.05));

  // 庄家抽水（vig），通常5-12%
  const vig = 0.08;

  // 实际赔付率 = 真实胜率 × (1 - vig)
  const adjRate = trueRate * (1 - vig);

  // 赔率 = 1 / adjRate（按1赔X计算）
  const playerOdds = adjRate > 0 ? (1 / adjRate) : 10;
  // 对手赔率
  const opOdds = (1 - trueRate) > 0 ? (1 / ((1 - trueRate) * (1 - vig))) : 10;

  // 赔率分级标签
  let label = '';
  if(trueRate >= 0.65)       label = '🟢 大热门';
  else if(trueRate >= 0.50)  label = '🔵 略占优势';
  else if(trueRate >= 0.40)  label = '🟡 势均力敌';
  else if(trueRate >= 0.28)  label = '🟠 以弱博强';
  else                       label = '🔴 极大冷门';

  return {
    trueWinRate: trueRate,
    playerOdds:  Math.round(playerOdds * 10) / 10,
    opOdds:      Math.round(opOdds * 10) / 10,
    label,
    edge: Math.round(vig * 100),
  };
}

/**
 * 冷门修正：连败后增加爆冷概率
 * 连败3场+：winRate基础上+5%
 * 连败5场+：+12%
 */
function cgStreakWinRateBonus(){
  const s = CG.stats;
  let streak = 0;
  // 用简单计数（实际实现在stats里记录连败streak）
  streak = s.lossStreak || 0;
  if(streak >= 5) return 0.12;
  if(streak >= 3) return 0.05;
  return 0;
}

/* ════════════════════════════════════════
   六、游戏状态
   ════════════════════════════════════════ */
let CG = {
  collection: [],
  squad: [],          // 出战阵容 UID 列表（最多3只）
  selectedCricket: null,
  battle: null,
  opponentIdx: 0,
  stats: { wins:0, losses:0, totalBet:0, totalEarned:0, winStreak:0, lossStreak:0 },
  // 场次历史（用于概率显示）
  matchHistory: [],
};

// 获取当前角色名，用于区分不同存档的蛐蛐数据
function _cgGetSaveKey(){
  try{
    const profile = JSON.parse(localStorage.getItem('wuxia_player_profile')||'{}');
    const name = profile.name || '无名侠';
    return 'wuxia_cricket_' + name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  }catch(e){
    return 'wuxia_cricket_default';
  }
}

function cgLoad(){
  try{
    const key = _cgGetSaveKey();
    const raw = localStorage.getItem(key);
    if(raw){
      const d = JSON.parse(raw);
      CG.collection   = d.collection   || [];
      CG.squad        = d.squad        || [];
      CG.opponentIdx  = d.opponentIdx  || 0;
      CG.stats        = Object.assign({ wins:0, losses:0, totalBet:0, totalEarned:0, winStreak:0, lossStreak:0 }, d.stats||{});
      CG.matchHistory = d.matchHistory || [];
    } else {
      // 兼容旧数据：如果新key没有，尝试读取旧key并迁移
      const oldRaw = localStorage.getItem('wuxia_cricket');
      if(oldRaw){
        const d = JSON.parse(oldRaw);
        CG.collection   = d.collection   || [];
        CG.squad        = d.squad        || [];
        CG.opponentIdx  = d.opponentIdx  || 0;
        CG.stats        = Object.assign({ wins:0, losses:0, totalBet:0, totalEarned:0, winStreak:0, lossStreak:0 }, d.stats||{});
        CG.matchHistory = d.matchHistory || [];
        // 保存到新key
        cgSave();
      }
    }
  }catch(e){
    console.error('[Cricket] 加载失败:', e);
  }
}

function cgSave(){
  const key = _cgGetSaveKey();
  localStorage.setItem(key, JSON.stringify({
    collection:   CG.collection,
    squad:        CG.squad,          // 出战阵容 UID 列表
    opponentIdx:  CG.opponentIdx,
    stats:        CG.stats,
    matchHistory: CG.matchHistory.slice(-30), // 只保留最近30场
  }));
}

/**
 * 蛐蛐笼容量：统计所有来源的笼子数量
 * 1. 普通背包 (wuxia_inv) — NPC 商店购买
 * 2. 合成背包 (wuxia_craft_bag) — 合成后存放
 * 3. 装备栏配饰 (edS.accessoryInstId) — 合成后转为配饰装备
 * @returns {{ slots: number, cages: Array<{id:string,name:string,qty:number}> }}
 */
function cgGetCageCapacity(){
  const CAGE_ITEM_IDS = [
    { id:'item_cricket_cage_premium', name:'上等斗蛐金笼' },
    { id:'item_cricket_cage_fine',    name:'精制蛐蛐笼' },
    { id:'item_cricket_cage_basic',   name:'竹编蛐蛐罐' },
  ];
  const ACC_IDS = [
    { id:'acc_cricket_premium', name:'上等斗蛐金笼' },
    { id:'acc_cricket_fine',    name:'精制蛐蛐笼' },
    { id:'acc_cricket_basic',   name:'竹编蛐蛐罐' },
  ];

  let totalSlots = 0;
  const cages = {}; // id -> { id, name, qty }

  function addCage(id, name, qty){
    if(qty <= 0) return;
    totalSlots += qty;
    if(!cages[id]) cages[id] = { id, name, qty:0 };
    cages[id].qty += qty;
  }

  // 1. 普通背包 (wuxia_inv)
  try {
    const invRaw = localStorage.getItem('wuxia_inv');
    if(invRaw){
      const inv = JSON.parse(invRaw);
      const items = Array.isArray(inv) ? inv : (inv.items || []);
      for(const c of CAGE_ITEM_IDS){
        const item = items.find(e => e.id === c.id);
        if(item){
          const qty = item.qty || item.quantity || 0;
          addCage(c.id, c.name, qty);
        }
      }
    }
  } catch(e){}

  // 2. 合成背包 (wuxia_craft_bag)
  if(typeof craftBagLoad === 'function'){
    const bag = craftBagLoad();
    for(const c of CAGE_ITEM_IDS){
      const item = bag.find(e => e.id === c.id);
      if(item){
        addCage(c.id, c.name, item.qty || 0);
      }
    }
  }

  // 3. 装备栏配饰 (edS.accessoryInstId) — 通过 bagFindInst 查 templateId
  try {
    if(typeof edS !== 'undefined' && edS.accessoryInstId){
      if(typeof bagFindInst === 'function'){
        const inst = bagFindInst(edS.accessoryInstId);
        if(inst && inst.templateId){
          const acc = ACC_IDS.find(a => a.id === inst.templateId);
          if(acc){
            addCage(acc.id, acc.name, 1);
          }
        }
      }
    }
  } catch(e){}

  return { slots: totalSlots, cages: Object.values(cages) };
}

/* ════════════════════════════════════════
   出战阵容管理（squad）
   ════════════════════════════════════════ */

const SQUAD_MAX = 3;

/**
 * 获取出战阵容中的蛐蛐对象数组
 */
function cgGetSquad(){
  return CG.squad
    .map(uid => CG.collection.find(c => c.uid === uid))
    .filter(Boolean);
}

/** 检查某 UID 是否在阵容中 */
function cgInSquad(uid){
  return CG.squad.includes(uid);
}

/**
 * 加入/移出阵容
 */
function cgToggleSquad(uid){
  if(CG.squad.includes(uid)){
    // 移出
    CG.squad = CG.squad.filter(u => u !== uid);
    if(CG.selectedCricket && CG.selectedCricket.uid === uid){
      CG.selectedCricket = null; // 移出后取消选中
    }
  } else {
    // 加入（上限检查）
    if(CG.squad.length >= SQUAD_MAX){ showToast(`📦 出战阵容已满（最多${SQUAD_MAX}只）`); return false; }
    CG.squad.push(uid);
  }
  cgSave();
  if (typeof playAudio === 'function') playAudio('cricket_squad');
  return true;
}

/**
 * cgRollIndividualValues：生成每只蛐蛐的可见属性个体差异（天赋系统）
 *
 * 设计思路：
 *  - 5个属性（atk/def/spd/stamina/regen）各有一个随机偏移系数
 *  - 普通随机区间：-15% ~ +15%（基础波动）
 *  - 天赋加成：每只蛐蛐额外随机1~2个"天赋属性"（+10%~+20%的额外加成）
 *  - 天赋代价：有天赋的蛐蛐另一个随机属性会有-10%~-15%的弱项
 *  - 极品蛐蛐（5%概率）：天赋属性+20%~+35%，但无弱项（纯强）
 *  - 残次品（5%概率）：全属性 -20%~-5%（纯弱，但稀有反而有收藏价值？）
 *  最终范围：弱项最低约-30%，天赋项最高约+35%，日常约±15%
 */
function cgRollIndividualValues(breed){
  const KEYS = ['atk','def','spd','stamina','regen'];
  const bases = {
    atk: breed.atk, def: breed.def, spd: breed.spd,
    stamina: breed.stamina || 100, regen: breed.regen || 5,
  };

  // 基础波动：每个属性 -15% ~ +15%
  const factors = {};
  KEYS.forEach(k => { factors[k] = (Math.random() * 0.30) - 0.15; });

  // 决定这只蛐蛐的"命运"
  const roll = Math.random();
  if(roll < 0.05){
    // 极品（5%）：1~2个属性 +20%~+35%
    const giftCount = Math.random() < 0.4 ? 2 : 1;
    const shuffled = [...KEYS].sort(()=>Math.random()-0.5);
    for(let i=0; i<giftCount; i++){
      factors[shuffled[i]] += 0.20 + Math.random() * 0.15;
    }
  } else if(roll < 0.10){
    // 残次品（5%）：全属性再 -20%~-5%
    KEYS.forEach(k => { factors[k] -= 0.05 + Math.random() * 0.15; });
  } else {
    // 普通（90%）：1~2个天赋 +10%~+20%，对应1个弱项 -10%~-15%
    const shuffled = [...KEYS].sort(()=>Math.random()-0.5);
    const giftCount = Math.random() < 0.45 ? 2 : 1;
    for(let i=0; i<giftCount; i++){
      factors[shuffled[i]] += 0.10 + Math.random() * 0.10;
    }
    // 弱项：从剩余属性中随机挑1个
    const weakKey = shuffled[giftCount + Math.floor(Math.random()*(KEYS.length - giftCount))];
    factors[weakKey] -= 0.10 + Math.random() * 0.05;
  }

  return {
    atkBonus:     Math.round(factors.atk     * bases.atk),
    defBonus:     Math.round(factors.def     * bases.def),
    spdBonus:     Math.round(factors.spd     * bases.spd),
    staminaBonus: Math.round(factors.stamina * bases.stamina),
    regenBonus:   Math.round(factors.regen   * bases.regen),
  };
}

/**
 * 生成隐藏属性：每只蛐蛐在生成时随机确定，值0~10（整数）
 * 受品种偏向影响（品种偏向表在下方 CG_HIDDEN_BIAS 中定义）
 * hidCrit     — 暴击根骨：额外暴击率，每点+1%（最多+10%）
 * hidTenacity — 韧性：     低血量时减免伤害，每点贡献0.8%（最多-8%受到的伤害）；1/3概率触发「硬撑」效果
 * hidDodge    — 闪避根骨：额外闪避概率，每点+0.8%（最多+8%），与速度差叠加
 * hidCounter  — 反击欲：   被击中后概率立刻回击（每点+1.5%概率，不消耗ATB）
 * hidPressure — 压迫感：   进攻时概率使对手命中率下降3%持续2次，每点+1%触发概率
 * hidLearning — 学习力：   战斗结束后额外经验加成，每点+2%
 */
const CG_HIDDEN_BIAS = {
  // 品种id → { hidCrit, hidTenacity, hidDodge, hidCounter, hidPressure, hidLearning } 偏向均值（0~10）
  // ★ 普通级
  iron_head:    { hidCrit:4, hidTenacity:7, hidDodge:2, hidCounter:5, hidPressure:6, hidLearning:3 },
  blue_wings:   { hidCrit:5, hidTenacity:2, hidDodge:9, hidCounter:4, hidPressure:3, hidLearning:6 },
  brown_chopper:{ hidCrit:5, hidTenacity:6, hidDodge:3, hidCounter:6, hidPressure:5, hidLearning:3 },
  green_spring: { hidCrit:4, hidTenacity:3, hidDodge:8, hidCounter:5, hidPressure:4, hidLearning:5 },
  red_spike:    { hidCrit:7, hidTenacity:4, hidDodge:4, hidCounter:6, hidPressure:5, hidLearning:3 },
  gray_pebble:  { hidCrit:3, hidTenacity:8, hidDodge:2, hidCounter:4, hidPressure:6, hidLearning:4 },
  // ★★ 稀有级
  fire_ant:     { hidCrit:8, hidTenacity:3, hidDodge:3, hidCounter:7, hidPressure:5, hidLearning:4 },
  jade_knight:  { hidCrit:2, hidTenacity:9, hidDodge:2, hidCounter:3, hidPressure:7, hidLearning:4 },
  purple_flash: { hidCrit:6, hidTenacity:3, hidDodge:9, hidCounter:5, hidPressure:4, hidLearning:5 },
  silver_hook:  { hidCrit:5, hidTenacity:4, hidDodge:6, hidCounter:7, hidPressure:5, hidLearning:5 },
  copper_shield:{ hidCrit:3, hidTenacity:9, hidDodge:2, hidCounter:4, hidPressure:7, hidLearning:3 },
  crimson_fang: { hidCrit:8, hidTenacity:3, hidDodge:4, hidCounter:7, hidPressure:5, hidLearning:4 },
  // ★★★ 珍贵级
  shadow_blade: { hidCrit:7, hidTenacity:2, hidDodge:8, hidCounter:8, hidPressure:4, hidLearning:5 },
  golden_bell:  { hidCrit:3, hidTenacity:6, hidDodge:3, hidCounter:4, hidPressure:9, hidLearning:5 },
  azure_dragon: { hidCrit:6, hidTenacity:5, hidDodge:5, hidCounter:6, hidPressure:6, hidLearning:5 },
  white_tiger:  { hidCrit:7, hidTenacity:4, hidDodge:5, hidCounter:7, hidPressure:5, hidLearning:4 },
  black_tortoise:{hidCrit:3, hidTenacity:9, hidDodge:2, hidCounter:3, hidPressure:8, hidLearning:4 },
  vermilion_bird:{hidCrit:7, hidTenacity:3, hidDodge:7, hidCounter:6, hidPressure:5, hidLearning:5 },
  // ★★★★ 史诗级
  ice_mandis:   { hidCrit:7, hidTenacity:4, hidDodge:6, hidCounter:6, hidPressure:5, hidLearning:6 },
  thunder_god:  { hidCrit:8, hidTenacity:3, hidDodge:7, hidCounter:7, hidPressure:6, hidLearning:5 },
  earth_king:   { hidCrit:4, hidTenacity:9, hidDodge:2, hidCounter:5, hidPressure:7, hidLearning:4 },
  wind_sage:    { hidCrit:6, hidTenacity:3, hidDodge:9, hidCounter:6, hidPressure:5, hidLearning:6 },
  // ★★★★★ 传说级
  chaos_king:   { hidCrit:6, hidTenacity:6, hidDodge:6, hidCounter:6, hidPressure:6, hidLearning:7 },
  celestial_emperor:{hidCrit:7, hidTenacity:6, hidDodge:6, hidCounter:6, hidPressure:7, hidLearning:8 },
  abyss_lord:   { hidCrit:8, hidTenacity:5, hidDodge:5, hidCounter:7, hidPressure:6, hidLearning:6 },
  phoenix_reborn:{hidCrit:6, hidTenacity:7, hidDodge:5, hidCounter:5, hidPressure:6, hidLearning:7 },
  // 神兽级 — 全维极高
  south_sea_dragon: {hidCrit:9, hidTenacity:8, hidDodge:9, hidCounter:9, hidPressure:8, hidLearning:9 },
  wuzang_demon:     {hidCrit:10,hidTenacity:6, hidDodge:10,hidCounter:8, hidPressure:9, hidLearning:8 },
  ice_king:         {hidCrit:7, hidTenacity:10,hidDodge:7, hidCounter:10,hidPressure:9, hidLearning:8 },
  desert_god:       {hidCrit:10,hidTenacity:5, hidDodge:9, hidCounter:7, hidPressure:10,hidLearning:7 },
  fortress_overlord:{hidCrit:8, hidTenacity:9, hidDodge:6, hidCounter:9, hidPressure:9, hidLearning:9 },
  blood_bone_king:  {hidCrit:9, hidTenacity:8, hidDodge:8, hidCounter:9, hidPressure:10,hidLearning:9 },
};

function cgRollHiddenAttr(breedId){
  const bias = CG_HIDDEN_BIAS[breedId] || { hidCrit:5, hidTenacity:5, hidDodge:5, hidCounter:5, hidPressure:5, hidLearning:5 };
  // 以品种偏向为中心，±3随机偏移，clamp到0~10
  const roll = (center) => Math.max(0, Math.min(10, center + Math.floor(Math.random()*7) - 3));
  return {
    hidCrit:     roll(bias.hidCrit),
    hidTenacity: roll(bias.hidTenacity),
    hidDodge:    roll(bias.hidDodge),
    hidCounter:  roll(bias.hidCounter),
    hidPressure: roll(bias.hidPressure),
    hidLearning: roll(bias.hidLearning),
  };
}

function cgAddCricket(breedId, customName, notify=true){
  const breed = CRICKET_BREEDS.find(b=>b.id===breedId);
  if(!breed) return;
  const hidden = cgRollHiddenAttr(breedId);
  // 个体差异：非均匀随机，更有天赋感
  // 先确定"天赋方向"——随机1~2个属性大幅偏强/偏弱，其余小幅随机
  const ivRoll = cgRollIndividualValues(breed);
  const cricket = {
    uid:  Date.now() + '_' + Math.random().toString(36).slice(2),
    breedId,
    name: customName || breed.name,
    level: 1,
    exp:   0,
    wins:  0,
    losses:0,
    // 个体天赋差异（由 cgRollIndividualValues 决定，范围 -30%~+35%）
    atkBonus:     ivRoll.atkBonus,
    defBonus:     ivRoll.defBonus,
    spdBonus:     ivRoll.spdBonus,
    staminaBonus: ivRoll.staminaBonus,
    regenBonus:   ivRoll.regenBonus,
    // 隐藏属性（战斗多样性，不对玩家展示）
    ...hidden,
    // 当前体力（满状态）
    currentStamina: null, // null=满，cgGetStats会补全
    // 蛐蛐状态：fresh/tired/injured/excited
    condition: 'fresh',
    conditionTurns: 0,
    // 性格（继承品种默认，可自定义）
    personality: breed.personality || 'steady',
  };
  CG.collection.push(cricket);
  cgSave();
  if(notify) showToast(`🦗 获得新蛐蛐：${cricket.name}！`);
}

/* 计算蛐蛐实际属性（含等级成长+个体差异+状态修正+体力影响） */
function cgGetStats(cricket){
  const breed = CRICKET_BREEDS.find(b=>b.id===cricket.breedId);
  if(!breed) return null;
  const lv = cricket.level;
  let atk = Math.round((breed.atk + cricket.atkBonus) * (1 + (lv-1)*0.08));
  let def = Math.round((breed.def + cricket.defBonus) * (1 + (lv-1)*0.05));
  let spd = Math.round((breed.spd + cricket.spdBonus) * (1 + (lv-1)*0.04));
  let hp  = Math.round(breed.hp * (1 + (lv-1)*0.10));
  const baseHp = hp; // 未受状态影响的基础HP上限，休息按钮和UI显示用此值

  // 体力属性（等级成长较慢）
  const staminaMax = Math.round((breed.stamina + (cricket.staminaBonus||0)) * (1 + (lv-1)*0.03));
  const regen      = Math.max(1, Math.round((breed.regen  + (cricket.regenBonus||0))  * (1 + (lv-1)*0.02)));

  // 初始化当前体力
  if(cricket.currentStamina == null) cricket.currentStamina = staminaMax;
  cricket.currentStamina = Math.min(cricket.currentStamina, staminaMax); // 升级后上限增加

  // 初始化当前HP（带入伤残，不随进入战斗自动回满）
  if(cricket.currentHp == null) cricket.currentHp = hp; // 首次：满血
  cricket.currentHp = Math.min(cricket.currentHp, baseHp);  // 若升级/属性提升，上限跟进

  // 体力比例影响战斗表现（50%体力时最低衰减到 80%）
  const staminaRatio = cricket.currentStamina / staminaMax;
  const staminaPenalty = Math.max(0.80, 0.80 + staminaRatio * 0.20); // 0.80~1.00
  if(staminaRatio < 1.0){
    atk = Math.round(atk * staminaPenalty);
    def = Math.round(def * staminaPenalty);
    spd = Math.round(spd * staminaPenalty);
  }

  // 状态修正（injured 改用 displayHp 叠加，不污染 hp/baseHp）
  let displayHp = null;
  switch(cricket.condition){
    case 'tired':    atk=Math.round(atk*0.85); spd=Math.round(spd*0.85); break;
    case 'injured':  def=Math.round(def*0.80); displayHp=Math.round(baseHp*0.90); break;
    case 'excited':  atk=Math.round(atk*1.10); spd=Math.round(spd*1.05); break;
  }
  const finalHp = displayHp !== null ? displayHp : hp;

  // ── 配饰槽蛐蛐笼加成：攻/防/速各 +speedBoost ──
  if(typeof edS !== 'undefined' && edS.accessoryInstId){
    const accInst = bagFindInst(edS.accessoryInstId);
    if(accInst && accInst.type === 'accessory'){
      const accTpl = (typeof ACCESSORIES !== 'undefined')
        ? ACCESSORIES.find(a=>a.id===accInst.templateId) : null;
      if(accTpl && accTpl.cageStats){
        const sb = accTpl.cageStats.speedBoost || 0;
        if(sb > 0){ atk+=sb; def+=sb; spd+=sb; }
      }
    }
  }

  // ── 隐藏属性（旧蛐蛐如果没有则补默认值）──
  const hidden = cgRollHiddenAttr(cricket.breedId); // 仅用于补全缺失字段的默认参考
  const hidCrit     = cricket.hidCrit     ?? hidden.hidCrit;
  const hidTenacity = cricket.hidTenacity ?? hidden.hidTenacity;
  const hidDodge    = cricket.hidDodge    ?? hidden.hidDodge;
  const hidCounter  = cricket.hidCounter  ?? hidden.hidCounter;
  const hidPressure = cricket.hidPressure ?? hidden.hidPressure;
  const hidLearning = cricket.hidLearning ?? hidden.hidLearning;
  // 惰性写回（旧存档兼容：首次算出后写回）
  if(cricket.hidCrit == null){ cricket.hidCrit=hidCrit; cricket.hidTenacity=hidTenacity; cricket.hidDodge=hidDodge; cricket.hidCounter=hidCounter; cricket.hidPressure=hidPressure; cricket.hidLearning=hidLearning; }

  return {
    atk, def, spd, hp: finalHp,
    hpMax: baseHp,       // 未受状态影响的HP上限，供休息按钮/UI显示用
    staminaMax, regen,
    currentStamina: cricket.currentStamina,
    currentHp: cricket.currentHp,  // 带入上场后的剩余血量
    skill: breed.skill, skillDesc: breed.skillDesc,
    color: breed.color, name: cricket.name, breedId: cricket.breedId,
    personality: cricket.personality || breed.personality || 'steady',
    // 隐藏属性（仅供战斗引擎内部使用）
    hidCrit, hidTenacity, hidDodge, hidCounter, hidPressure, hidLearning,
  };
}

/* 蛐蛐状态标签 */
function cgConditionLabel(condition){
  return { fresh:'⚪正常', tired:'😴疲惫', injured:'🩸受伤', excited:'🔥亢奋' }[condition] || '⚪正常';
}

/* ════════════════════════════════════════
   七、战斗引擎（即时制 ATB 版）
   速度决定行动条填充速率，满了就出击
   ════════════════════════════════════════ */

/**
 * ATB参数
 * ATB_MAX   行动条满值
 * ATB_SPD_DIV  speed / ATB_SPD_DIV = 每ms的ATB增量基准
 */
const ATB_MAX     = 1000;
const ATB_SPD_DIV = 18;

/* 命中率（基于速度差） */
function cgHitChance(atkSpd, defSpd){
  return Math.max(0.55, Math.min(0.97, 0.82 + (atkSpd - defSpd) * 0.015));
}
function cgStartBattle(cricket, opponentIdx, betAmount){
  const op      = CRICKET_OPPONENTS[opponentIdx];
  const opBreed = CRICKET_BREEDS.find(b=>b.id===op.breedId);
  const ps      = cgGetStats(cricket);
  const opLv    = op.level + Math.floor(Math.random()*3);

  // 对手体力：按品种基础值，经历场次越多体力越少（模拟当天已斗过几场）
  const opBattlesThisDay = Math.floor(Math.random() * 3); // 0~2场
  const opStaminaMax = Math.round((opBreed.stamina || 100) * (1 + opLv*0.03));
  const opBaseCost   = Math.round(opStaminaMax * 0.25 * opBattlesThisDay);
  const opStaminaInit= Math.max(Math.round(opStaminaMax * 0.3), opStaminaMax - opBaseCost);
  // 对手体力比例影响属性
  const opStaminaRatio   = opStaminaInit / opStaminaMax;
  const opStaminaPenalty = Math.max(0.80, 0.80 + opStaminaRatio * 0.20);

  const opStats = {
    atk: Math.round((opBreed.atk * (1 + opLv*0.08) + op.lvBonus*0.3) * opStaminaPenalty),
    def: Math.round((opBreed.def * (1 + opLv*0.05) + op.lvBonus*0.15) * opStaminaPenalty),
    spd: Math.round((opBreed.spd * (1 + opLv*0.04) + op.lvBonus*0.1) * opStaminaPenalty),
    hp:  Math.round(opBreed.hp  * (1 + opLv*0.10) + op.lvBonus),
    staminaMax:  opStaminaMax,
    stamina:     opStaminaInit,
    regen:       opBreed.regen || 5,
    skill: opBreed.skill, skillDesc: opBreed.skillDesc,
    color: opBreed.color, name: op.name + '的' + opBreed.name, breedId: opBreed.id,
    personality: opBreed.personality,
  };

  // ═══════════════════════════════════════════════
  // 蛐蛐"将将胡"系统 - 特殊事件
  // ═══════════════════════════════════════════════
  let event = null;
  const luckRoll = Math.random();
  
  // 3%概率：蛐蛐变异（战斗中随机属性暴涨）
  if(luckRoll < 0.03){
    event = { 
      id:'mutation', 
      name:'蛐蛐变异', 
      desc:'你的蛐蛐突然发生变异，全属性临时提升！',
      apply:(s)=>{ 
        s.playerAtk += 5; 
        s.playerDef += 3; 
        s.playerSpd += 3;
        s.mutationActive = true;
      } 
    };
  }
  // 2%概率：意外觉醒（濒死时自动满血复活一次）
  else if(luckRoll < 0.05){
    event = { 
      id:'awakening', 
      name:'意外觉醒', 
      desc:'你的蛐蛐体内沉睡的血脉觉醒了！濒死时会爆发潜能！',
      apply:(s)=>{ 
        s.awakeningReady = true;
      } 
    };
  }
  // 2%概率：天气异变（双方属性随机变化）
  else if(luckRoll < 0.07){
    const weatherEffects = [
      { name:'雷暴天气', desc:'电闪雷鸣，双方攻击+5但防御-2', atk:5, def:-2 },
      { name:'迷雾笼罩', desc:'浓雾弥漫，双方速度-3但闪避+10%', spd:-3, dodge:0.10 },
      { name:'烈日当空', desc:'酷热难耐，双方体力消耗翻倍', staminaCost:2 },
      { name:'寒风刺骨', desc:'寒气逼人，双方攻击-2但暴击+8%', atk:-2, crit:0.08 },
    ];
    const weather = weatherEffects[Math.floor(Math.random() * weatherEffects.length)];
    event = { 
      id:'weather', 
      name:weather.name, 
      desc:weather.desc,
      apply:(s)=>{ 
        if(weather.atk) { s.playerAtk += weather.atk; s.opAtk += weather.atk; }
        if(weather.def) { s.playerDef += weather.def; s.opDef += weather.def; }
        if(weather.spd) { s.playerSpd += weather.spd; s.opSpd += weather.spd; }
        s.weatherEffect = weather;
      } 
    };
  }
  // 1%概率：虫王降临（对手被虫王威压，全属性-10%）
  else if(luckRoll < 0.08){
    event = { 
      id:'king_aura', 
      name:'虫王降临', 
      desc:'你的蛐蛐散发出王霸之气，对手被震慑！',
      apply:(s)=>{ 
        s.opAtk = Math.floor(s.opAtk * 0.9); 
        s.opDef = Math.floor(s.opDef * 0.9); 
        s.opSpd = Math.floor(s.opSpd * 0.9);
        s.kingAuraActive = true;
      } 
    };
  }
  // 原有随机事件（45%概率，如果未触发将将胡事件）
  else if(Math.random() < 0.45){
    event = CRICKET_EVENTS[Math.floor(Math.random()*CRICKET_EVENTS.length)];
  }

  // 计算赔率
  const odds = cgCalcOdds(ps, opStats, op);

  // 连败爆冷加成
  const streakBonus = cgStreakWinRateBonus();
  if(streakBonus > 0) odds.trueWinRate = Math.min(0.85, odds.trueWinRate + streakBonus);

  // 指令冷却表（毫秒时间戳，0=已就绪）
  const cmdCooldowns = {};
  CG_COMMANDS.forEach(c => cmdCooldowns[c.id] = 0);
  const aiCmdCooldowns = {};
  CG_AI_COMMANDS.forEach(c => aiCmdCooldowns[c.id] = 0);

  // 对手主人名（带性格）
  const persona = CG_AI_PERSONALITIES[op.id] || { personality:'普通' };
  const opMasterName = op.name + `（${persona.personality}）`;

  // 性格对象
  const pPersonality = CRICKET_PERSONALITIES[ps.personality] || CRICKET_PERSONALITIES['steady'];
  const oPersonality = CRICKET_PERSONALITIES[opStats.personality] || CRICKET_PERSONALITIES['steady'];
  const pPassive = pPersonality.passiveBonus || {};
  const oPassive = oPersonality.passiveBonus || {};

  const now = performance.now();

  const state = {
    /* 玩家蛐蛐 */
    playerHp:   ps.currentHp + (pPassive.stat==='hp' ?pPassive.val:0),  // 带入战前剩余血量
    playerHpMax:ps.hp        + (pPassive.stat==='hp' ?pPassive.val:0),  // 满血上限
    playerAtk:  ps.atk + (pPassive.stat==='atk'?pPassive.val:0),
    playerDef:  ps.def + (pPassive.stat==='def'?pPassive.val:0),
    playerSpd:  ps.spd + (pPassive.stat==='spd'?pPassive.val:0),
    playerStaminaMax: ps.staminaMax,
    playerStamina:    ps.currentStamina,  // 带入战前剩余体力
    playerRegen:      ps.regen,
    playerSkill: ps.skill, playerSkillDesc: ps.skillDesc,
    playerBreed: cricket.breedId, playerName: cricket.name,
    playerPersonality: ps.personality,
    playerPersonalityDef: pPersonality,
    playerMorale: 5,
    playerCritBonus: 0,
    playerSkillCooldown: 0,   // 技能可用时间戳（0=可用）
    playerShield: false,
    playerStunned: false,
    playerBurnEnd: 0,          // 灼烧结束时间戳
    playerSpeedDebuff: 0,
    playerBerserkStack: 0,
    playerRageActivated: false,
    playerAtb: Math.floor(Math.random()*ATB_MAX*0.3),   // ATB初始进度
    playerAtbMult: pPersonality.atbMult || 1.0,
    /* 临时状态（时间戳） */
    playerCheerBoost: 0, playerCheerBoostEnd: 0,
    playerTauntedEnd: 0,
    playerPressureEnd: 0,
    playerDistractEnd: 0,
    /* 隐藏属性（来自 cgGetStats） */
    playerHidCrit:     ps.hidCrit     || 0,
    playerHidTenacity: ps.hidTenacity || 0,
    playerHidDodge:    ps.hidDodge    || 0,
    playerHidCounter:  ps.hidCounter  || 0,
    playerHidPressure: ps.hidPressure || 0,
    playerHidLearning: ps.hidLearning || 0,
    playerPressureHitCount: 0,   // 压迫感：对手命中率惩罚剩余次数

    /* 对方蛐蛐 */
    opHp:    opStats.hp  + (oPassive.stat==='hp' ?oPassive.val:0),
    opHpMax: opStats.hp  + (oPassive.stat==='hp' ?oPassive.val:0),
    opAtk:   opStats.atk + (oPassive.stat==='atk'?oPassive.val:0),
    opDef:   opStats.def + (oPassive.stat==='def'?oPassive.val:0),
    opSpd:   opStats.spd + (oPassive.stat==='spd'?oPassive.val:0),
    opStaminaMax: opStats.staminaMax,
    opStamina:    opStats.stamina,
    opRegen:      opStats.regen,
    opSkill: opStats.skill, opSkillDesc: opStats.skillDesc,
    opBreed: opStats.breedId, opName: opStats.name, opColor: opStats.color,
    opMasterName,
    opPersonality: opStats.personality,
    opPersonalityDef: oPersonality,
    opCritBonus: 0,
    opSkillCooldown: 0,
    opStunned: false,
    opShield: false,
    opBurnEnd: 0,
    opSpeedDebuff: 0,
    opBerserkStack: 0,
    opRageActivated: false,
    opAtb: Math.floor(Math.random()*ATB_MAX*0.3),
    opAtbMult: oPersonality.atbMult || 1.0,
    opRoarBoost: 0, opRoarBoostEnd: 0,
    opTauntedEnd: 0,
    opDistractEnd: 0,
    opFeedPenalty: false,
    opBetPenalty: 0,
    /* 对手隐藏属性（按品种偏向随机，一次生成） */
    ...(() => {
      const oh = cgRollHiddenAttr(opBreed.id);
      return {
        opHidCrit:     oh.hidCrit,
        opHidTenacity: oh.hidTenacity,
        opHidDodge:    oh.hidDodge,
        opHidCounter:  oh.hidCounter,
        opHidPressure: oh.hidPressure,
        opPressureHitCount: 0,  // 压迫感：玩家命中率惩罚剩余次数
      };
    })(),

    /* 博彩 */
    bet: betAmount,
    odds,
    betPenalty: 0,
    feedPenaltyNext: false,
    critBonus: 0,

    /* 战斗控制 */
    over: false,
    winner: null,
    log: [],
    actionCount: 0,
    event,
    cricket,
    opponentRef: op,
    cmdCooldowns,
    aiCmdCooldowns,
    lastAiCmd: null,

    /* 即时引擎 */
    rtRunning: false,
    rtRafId: null,
    rtLastTick: now,
    rtLastAiCmdTime: now,
    _pendingLogs: [],
  };

  // ── 记录战斗开始时的"基础属性快照"供体力惩罚函数引用 ──
  state._basePlayerAtk = state.playerAtk;
  state._basePlayerDef = state.playerDef;
  state._basePlayerSpd = state.playerSpd;
  state._baseOpAtk     = state.opAtk;
  state._baseOpDef     = state.opDef;
  state._baseOpSpd     = state.opSpd;

  if(event) event.apply(state);

  CG.battle = state;
  return state;
}

function cgCalcDamage(atk, def, crit=false, critBonus=0){
  const base = Math.max(1, atk - Math.floor(def*0.5));
  const variance = 0.8 + Math.random()*0.4;
  const critRate = 0.12 + critBonus;
  const isCrit = crit || Math.random() < critRate;
  return { dmg: Math.round(base * variance * (isCrit ? 1.8 : 1)), isCrit };
}

function cgDoAttack(s, who){
  const now = performance.now();
  const richLogs = [];
  const isPlayer = who === 'player';

  const selfAtk    = isPlayer ? s.playerAtk     : s.opAtk;
  const selfSpd    = isPlayer ? s.playerSpd      : s.opSpd;
  const selfSpdDeb = isPlayer ? s.playerSpeedDebuff : s.opSpeedDebuff;
  const theirDef   = isPlayer ? s.opDef          : s.playerDef;
  const theirSpd   = isPlayer ? s.opSpd          : s.playerSpd;
  const theirSpdD  = isPlayer ? s.opSpeedDebuff  : s.playerSpeedDebuff;
  const selfCritB  = isPlayer ? (s.playerCritBonus||0) : (s.opCritBonus||0);
  const myName     = isPlayer ? s.playerName     : s.opName;
  const personality= isPlayer ? s.playerPersonalityDef : s.opPersonalityDef;

  // 隐藏属性读取
  const selfHidCrit     = isPlayer ? s.playerHidCrit     : s.opHidCrit;
  const selfHidDodge    = isPlayer ? s.playerHidDodge    : s.opHidDodge;
  const selfHidPressure = isPlayer ? s.playerHidPressure : s.opHidPressure;
  const theirHidTenacity= isPlayer ? s.opHidTenacity     : s.playerHidTenacity;
  const theirHidCounter = isPlayer ? s.opHidCounter      : s.playerHidCounter;
  const theirName       = isPlayer ? s.opName            : s.playerName;
  const selfPressureCount= isPlayer ? 'playerPressureHitCount' : 'opPressureHitCount';
  const theirPressureCount= isPlayer ? 'opPressureHitCount' : 'playerPressureHitCount';

  // 眩晕判定
  if(isPlayer ? s.playerStunned : s.opStunned){
    richLogs.push({ txt:`😵 ${myName} 被眩晕，无法行动！`, type:'stun' });
    if(isPlayer) s.playerStunned=false; else s.opStunned=false;
    return richLogs;
  }

  // ── 闪避根骨：额外闪避判定（在性格闪避之后，进攻方攻击之前）──
  const hidDodgeChance = (selfHidDodge || 0) * 0.008; // 每点0.8%
  if(hidDodgeChance > 0 && Math.random() < hidDodgeChance){
    const dodgeEmoji = selfHidDodge >= 8 ? '⚡' : '🌀';
    richLogs.push({ txt:`${dodgeEmoji} ${myName} 凭本能闪开了！`, type:'event' });
    return richLogs;
  }

  // 灵动性格 - 闪避
  if((personality?.agileDodge||0) > 0 && Math.random() < personality.agileDodge){
    richLogs.push({ txt:`🌀 ${myName}身形一闪，躲过！`, type:'event' });
    return richLogs;
  }

  // 技能判定
  const skillCd = isPlayer ? s.playerSkillCooldown : s.opSkillCooldown;
  const skillReady = skillCd <= now;
  const baseSkillRate = 0.22 + (personality?.skillRate||0);
  const hpRatio = isPlayer ? s.playerHp/s.playerHpMax : s.opHp/s.opHpMax;
  const useSkill = skillReady &&
    (Math.random() < baseSkillRate*(personality?.atkBias||1) || (hpRatio < 0.3 && Math.random() < 0.5));

  if(useSkill){
    const skillLogs = cgUseSkill(s, who);
    skillLogs.forEach(l => richLogs.push({ txt:l, type:isPlayer?'skill':'op-skill' }));
    const cdMs = (personality?.name==='沉稳') ? 2500 : 3500;
    if(isPlayer) s.playerSkillCooldown = now + cdMs;
    else         s.opSkillCooldown     = now + cdMs;
    if(personality?.onAttack) personality.onAttack(s, who);
    // ── 压迫感：技能命中也触发压迫 ──
    if((selfHidPressure||0) >= 6 && Math.random() < (selfHidPressure*0.01)){
      s[theirPressureCount] = (s[theirPressureCount]||0) + 2;
    }
    return richLogs;
  }

  // 普通攻击（命中率）
  // 压迫感惩罚：被压迫时命中率-3%（最多叠3层）
  const pressurePenalty = Math.min(3, s[selfPressureCount]||0) * 0.03;
  if(s[selfPressureCount] > 0) s[selfPressureCount]--;
  const hitRate = cgHitChance(selfSpd - selfSpdDeb, theirSpd - theirSpdD) - pressurePenalty;
  if(Math.random() > hitRate){
    richLogs.push({ txt:`💨 ${myName} 攻击失手！`, type:'miss' });
    return richLogs;
  }

  // ── 暴击根骨：额外暴击加成 ──
  const hidCritBonus = (selfHidCrit || 0) * 0.01; // 每点+1%暴击率
  const { dmg, isCrit } = cgCalcDamage(selfAtk, theirDef, false, selfCritB + (s.critBonus||0) + hidCritBonus);
  let actualDmg = dmg;

  // 狡猾性格暴击附加眩晕
  let critExtra = '';
  if(isCrit && personality?.onCrit) critExtra = personality.onCrit(s, who) || '';

  // ── 压迫感：命中后概率给对手施加压迫，下次命中率下降 ──
  if((selfHidPressure||0) > 0 && Math.random() < (selfHidPressure * 0.01)){
    s[theirPressureCount] = (s[theirPressureCount]||0) + 1;
    // 不输出日志，保持隐藏
  }

  if(isPlayer){
    if(s.opShield){
      richLogs.push({ txt:`🛡️ 护盾格挡！`, type:'shield' });
      s.opShield = false; actualDmg = 0;
    } else {
      // 守护性格反弹
      if(s.opPersonalityDef?.onHit){
        const rb = s.opPersonalityDef.onHit(dmg);
        if(rb > 0){ s.playerHp = Math.max(0, s.playerHp - rb); richLogs.push({ txt:`🔄 反弹 ${rb} 伤害！`, type:'event' }); }
      }
      // ── 韧性：低血量减免（对手被打时，韧性高有概率减伤） ──
      if(actualDmg > 0 && (theirHidTenacity||0) > 0){
        const opHpRatio = s.opHp / s.opHpMax;
        if(opHpRatio < 0.40){
          const tenacityChance = theirHidTenacity * 0.033; // 最高~33%概率
          if(Math.random() < tenacityChance){
            const reduction = Math.round(actualDmg * (theirHidTenacity * 0.008));
            actualDmg = Math.max(1, actualDmg - reduction);
          }
        }
      }
      s.opHp = Math.max(0, s.opHp - actualDmg);
      // ── 反击欲：对手被打后概率立即反击（不消耗ATB）──
      if(actualDmg > 0 && (theirHidCounter||0) > 0 && !s.opStunned){
        const counterChance = theirHidCounter * 0.015; // 每点1.5%
        if(Math.random() < counterChance){
          const ctrDmg = Math.max(1, Math.round(s.opAtk * (0.4 + Math.random()*0.3)));
          s.playerHp = Math.max(0, s.playerHp - ctrDmg);
          richLogs.push({ txt:`⚡ ${theirName} 本能反击！${ctrDmg} 点伤害`, type:'op' });
        }
      }
    }
    if(actualDmg>0) richLogs.push({ txt:`🦗 ${myName} ${isCrit?'💥暴击！':''}造成 ${actualDmg} 点伤害${critExtra}`, type:isCrit?'crit':'player', dmg:actualDmg, isCrit, target:'op' });
  } else {
    if(s.playerShield){
      richLogs.push({ txt:`🛡️ 玉甲护身格挡！`, type:'shield' });
      s.playerShield = false; actualDmg = 0;
    } else {
      if(s.playerPersonalityDef?.onHit){
        const rb = s.playerPersonalityDef.onHit(dmg);
        if(rb > 0){ s.opHp = Math.max(0, s.opHp - rb); richLogs.push({ txt:`🔄 反弹 ${rb} 伤害！`, type:'event' }); }
      }
      // ── 韧性：玩家被打时，韧性高有概率减伤 ──
      if(actualDmg > 0 && (theirHidTenacity||0) > 0){
        const playerHpRatio = s.playerHp / s.playerHpMax;
        if(playerHpRatio < 0.40){
          const tenacityChance = theirHidTenacity * 0.033;
          if(Math.random() < tenacityChance){
            const reduction = Math.round(actualDmg * (theirHidTenacity * 0.008));
            actualDmg = Math.max(1, actualDmg - reduction);
            richLogs.push({ txt:`💪 ${theirName} 拼死硬撑，减伤 ${reduction}！`, type:'event' });
          }
        }
      }
      s.playerHp = Math.max(0, s.playerHp - actualDmg);
      // ── 反击欲：玩家被打后概率立即反击 ──
      if(actualDmg > 0 && (theirHidCounter||0) > 0 && !s.playerStunned){
        const counterChance = theirHidCounter * 0.015;
        if(Math.random() < counterChance){
          const ctrDmg = Math.max(1, Math.round(s.playerAtk * (0.4 + Math.random()*0.3)));
          s.opHp = Math.max(0, s.opHp - ctrDmg);
          richLogs.push({ txt:`⚡ ${theirName} 本能反击！${ctrDmg} 点伤害`, type:'player' });
        }
      }
    }
    if(actualDmg>0) richLogs.push({ txt:`🔴 ${myName} ${isCrit?'💥暴击！':''}造成 ${actualDmg} 点伤害${critExtra}`, type:isCrit?'op-crit':'op', dmg:actualDmg, isCrit, target:'player' });
  }

  if(personality?.onAttack) personality.onAttack(s, who);
  s.actionCount++;
  return richLogs;
}

/**
 * 推一条日志到UI
 */
function cgPushLog(s, txt, type){
  const logEl = document.getElementById('cgBattleLog');
  if(!logEl) return;
  const d = document.createElement('div');
  d.className = 'cg-log-line ' + (type||'event');
  d.textContent = txt;
  logEl.appendChild(d);
  // 超过100条删最旧的
  while(logEl.children.length > 100) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
}

/**
 * 即时制主循环（requestAnimationFrame）
 */
function cgRtTick(timestamp){
  const s = CG.battle;
  if(!s || s.over || !s.rtRunning){ if(s) s.rtRunning=false; return; }

  const dt  = Math.min(timestamp - s.rtLastTick, 100);
  s.rtLastTick = timestamp;
  const now = timestamp;

  // ── 清除过期状态 ──
  if(s.playerCheerBoostEnd > 0 && now > s.playerCheerBoostEnd){
    if(s.playerCheerBoost > 0){
      s.playerAtk = Math.max(1, s.playerAtk - s.playerCheerBoost);
      cgPushLog(s, `📣 喝彩效果消退（攻-${s.playerCheerBoost}）`, 'event');
      s.playerCheerBoost = 0;
    }
    s.playerCheerBoostEnd = 0;
  }
  if(s.opRoarBoostEnd > 0 && now > s.opRoarBoostEnd){
    if(s.opRoarBoost > 0){
      s.opAtk = Math.max(1, s.opAtk - s.opRoarBoost);
      cgPushLog(s, `😤 助威消退（攻-${s.opRoarBoost}）`, 'event');
      s.opRoarBoost = 0;
    }
    s.opRoarBoostEnd = 0;
  }
  if(s.playerTauntedEnd > 0 && now > s.playerTauntedEnd){
    s.playerAtk = Math.max(1, s.playerAtk - 4);
    s.playerDef += 3;
    cgPushLog(s, '😤 激怒消退（攻-4防+3）', 'event');
    s.playerTauntedEnd = 0;
  }
  if(s.playerPressureEnd > 0 && now > s.playerPressureEnd){
    s.playerAtk += 2;
    cgPushLog(s, '🗣️ 压力消退（攻+2）', 'event');
    s.playerPressureEnd = 0;
  }
  if(s.playerDistractEnd > 0 && now > s.playerDistractEnd){
    s.playerAtk += 3;
    cgPushLog(s, '🔔 干扰消退（攻+3）', 'event');
    s.playerDistractEnd = 0;
  }
  if(s.opDistractEnd > 0 && now > s.opDistractEnd){
    s.opAtk += 3;
    cgPushLog(s, `🔔 ${s.opName}干扰消退（攻+3）`, 'event');
    s.opDistractEnd = 0;
  }
  if(s.opTauntedEnd > 0 && now > s.opTauntedEnd){
    s.opAtk += 2;
    cgPushLog(s, `🫵 嘲弄自损消退（攻+2）`, 'event');
    s.opTauntedEnd = 0;
  }

  // ── 狂怒激活判定 ──
  if(!s.playerRageActivated){
    const thresh = s.playerPersonalityDef?.rageThreshold || 0;
    if(thresh > 0 && s.playerHp/s.playerHpMax < thresh){
      s.playerRageActivated = true;
      if(s.playerPersonalityDef?.onRage) s.playerPersonalityDef.onRage(s,'player');
      cgPushLog(s, `🔥 ${s.playerName}进入狂怒状态！`, 'event');
    }
  }
  if(!s.opRageActivated){
    const thresh = s.opPersonalityDef?.rageThreshold || 0;
    if(thresh > 0 && s.opHp/s.opHpMax < thresh){
      s.opRageActivated = true;
      if(s.opPersonalityDef?.onRage) s.opPersonalityDef.onRage(s,'opponent');
      cgPushLog(s, `🔥 ${s.opName}进入狂怒状态！`, 'event');
    }
  }

  // ── 灼烧DOT（每800ms跳一次）──
  if(s.playerBurnEnd > 0 && now < s.playerBurnEnd){
    if(!s._lastPlayerBurnTick || now - s._lastPlayerBurnTick > 800){
      s._lastPlayerBurnTick = now;
      s.playerHp = Math.max(0, s.playerHp - 5);
      cgPushLog(s, `🔥 ${s.playerName}灼烧 -5`, 'burn');
    }
  }
  if(s.opBurnEnd > 0 && now < s.opBurnEnd){
    if(!s._lastOpBurnTick || now - s._lastOpBurnTick > 800){
      s._lastOpBurnTick = now;
      s.opHp = Math.max(0, s.opHp - 5);
      cgPushLog(s, `🔥 ${s.opName}灼烧 -5`, 'burn');
    }
  }

  // ── ATB推进 ──
  const pSpdEff = Math.max(1, s.playerSpd - s.playerSpeedDebuff);
  const oSpdEff = Math.max(1, s.opSpd     - s.opSpeedDebuff);
  s.playerAtb = Math.min(ATB_MAX, (s.playerAtb||0) + (pSpdEff/ATB_SPD_DIV)*dt*s.playerAtbMult);
  s.opAtb     = Math.min(ATB_MAX, (s.opAtb||0)     + (oSpdEff/ATB_SPD_DIV)*dt*s.opAtbMult);

  // ── 出击判定 ──
  const pFull = s.playerAtb >= ATB_MAX;
  const oFull = s.opAtb     >= ATB_MAX;

  if(pFull && oFull){
    if(pSpdEff >= oSpdEff){
      cgExecuteAttack(s,'player',now); if(!s.over) cgExecuteAttack(s,'opponent',now);
    } else {
      cgExecuteAttack(s,'opponent',now); if(!s.over) cgExecuteAttack(s,'player',now);
    }
  } else if(pFull){
    cgExecuteAttack(s,'player',now);
  } else if(oFull){
    cgExecuteAttack(s,'opponent',now);
  }

  // ── AI主人指令（每1.5~3s一次）──
  if(!s.over){
    const aiCmdGap = 1500 + Math.random()*1500;
    if(now - s.rtLastAiCmdTime > aiCmdGap){
      s.rtLastAiCmdTime = now;
      const aiCmd = cgAiDecideCommand(s, now);
      if(aiCmd){
        s.lastAiCmd = aiCmd;
        const aiLogs = aiCmd.effect(s);
        aiLogs.forEach(l => cgPushLog(s, l, 'ai-cmd'));
        const aiCdMap = { ai_roar:3000,ai_splash:5000,ai_distract:5000,ai_feed:7000,ai_taunt:4000,ai_herb:999999,ai_pressure:5000 };
        s.aiCmdCooldowns[aiCmd.id] = now + (aiCmd.oneTime ? 999999 : (aiCdMap[aiCmd.id]||5000));
        cgRtUpdateAiCmdUI(s);
      }
    }
  }

  // ── UI刷新（≈120ms一次） ──
  if(!s._lastUiTick || now - s._lastUiTick > 120){
    s._lastUiTick = now;
    cgUpdateBattleUI(s);
    cgUpdateAtbBars(s);
    cgUpdateCmdCooldownsRt(s, now);
  }

  if(s.over){ s.rtRunning=false; setTimeout(()=>cgShowResult(), 600); return; }
  s.rtRafId = requestAnimationFrame(cgRtTick);
}

/**
 * 根据当前体力比例实时调整双方 atk/def/spd
 * 每次出击后调用，保证属性随体力动态变化
 * 使用"基础属性×惩罚系数"模型，避免多次叠加漂移
 */
function cgApplyStaminaPenalty(s){
  // 玩家侧
  const pRatio = s.playerStamina / Math.max(1, s.playerStaminaMax);
  const pMult  = Math.max(0.80, 0.80 + pRatio * 0.20);
  s.playerAtk  = Math.max(1, Math.round(s._basePlayerAtk * pMult));
  s.playerDef  = Math.max(1, Math.round(s._basePlayerDef * pMult));
  s.playerSpd  = Math.max(1, Math.round(s._basePlayerSpd * pMult));
  // 对手侧
  const oRatio = s.opStamina / Math.max(1, s.opStaminaMax);
  const oMult  = Math.max(0.80, 0.80 + oRatio * 0.20);
  s.opAtk      = Math.max(1, Math.round(s._baseOpAtk * oMult));
  s.opDef      = Math.max(1, Math.round(s._baseOpDef * oMult));
  s.opSpd      = Math.max(1, Math.round(s._baseOpSpd * oMult));
}

/** 执行一次出击 */
function cgExecuteAttack(s, who, now){
  if(s.over) return;
  if(who==='player') s.playerAtb=0; else s.opAtb=0;

  const preP = s.playerHp, preO = s.opHp;
  const richLogs = cgDoAttack(s, who);
  if(!richLogs.length) return;

  // ── 每次出击消耗体力（约为体力上限的2~4%），并实时更新属性 ──
  const pStaminaCostPerHit = Math.max(1, Math.round(s.playerStaminaMax * 0.03));
  const oStaminaCostPerHit = Math.max(1, Math.round(s.opStaminaMax     * 0.03));
  if(who === 'player'){
    s.playerStamina = Math.max(0, s.playerStamina - pStaminaCostPerHit);
  } else {
    s.opStamina = Math.max(0, s.opStamina - oStaminaCostPerHit);
  }
  // 重新计算体力惩罚系数并更新atk/def/spd（与cgGetStats逻辑一致）
  cgApplyStaminaPenalty(s);
  if(!richLogs.length) return;

  const dmgToOp     = preO - s.opHp;
  const dmgToPlayer = preP - s.playerHp;
  const isCrit      = richLogs.some(l=>l.isCrit);
  const isShield    = richLogs.some(l=>l.type==='shield');
  const hasSkill    = richLogs.some(l=>l.type==='skill'||l.type==='op-skill');
  const isStun      = richLogs.some(l=>l.type==='stun');
  const isDodge     = richLogs.some(l=>l.type==='dodge');
  const isRebound   = richLogs.some(l=>l.type==='rebound');
  const dmgToTarget = who==='player' ? dmgToOp : dmgToPlayer;

  // 日志追加
  richLogs.forEach(l => cgPushLog(s, l.txt, l.type));

  // 播动画
  cgAnimateAttack(s, who, { dmgToTarget, isCrit, isShield, isStun, isDodge, isRebound, hasSkill, richLogs });

  // 胜负判定
  if(s.playerHp<=0 || s.opHp<=0){
    // ═══════════════════════════════════════════════
    // 蛐蛐"将将胡"系统 - 濒死觉醒
    // ═══════════════════════════════════════════════
    if(s.playerHp<=0 && s.awakeningReady){
      // 意外觉醒：满血复活
      s.awakeningReady = false;
      s.playerHp = Math.floor(s.playerHpMax * 0.5);  // 复活50%血量
      s.playerAtk += 3;  // 觉醒后攻击+3
      s.playerSpd += 2;  // 觉醒后速度+2
      cgPushLog(s, '🔥 意外觉醒！你的蛐蛐在濒死之际爆发出惊人潜能！', 'legendary');
      cgPushLog(s, `💪 潜能爆发！气血恢复50%，攻击+3，速度+2！`, 'event');
      // 播放觉醒特效
      if(typeof SoundFX !== 'undefined') SoundFX.play('cricket_awakening');
      // 继续战斗，不结束
      return;
    }
    
    s.over   = true;
    s.winner = s.playerHp>0?'player':'opponent';
    cgSettleBattle(s);
    const pArt = document.getElementById('cgPlayerArt');
    const oArt = document.getElementById('cgOpArt');
    if(pArt) pArt.textContent = cgArtPre(s.playerBreed, s.winner==='player'?'attack':'ko');
    if(oArt) oArt.textContent = cgArtPre(s.opBreed,     s.winner==='player'?'ko':'attack');
  }
}

/** 刷新ATB条UI */
function cgUpdateAtbBars(s){
  const pBar = document.getElementById('cgPlayerAtbFill');
  const oBar = document.getElementById('cgOpAtbFill');
  if(pBar){
    const pct = Math.min(100, (s.playerAtb||0)/ATB_MAX*100);
    pBar.style.width = pct+'%';
    pBar.style.background = pct>85?'#ffe060':pct>50?'#60c870':'#3080c0';
  }
  if(oBar){
    const pct = Math.min(100, (s.opAtb||0)/ATB_MAX*100);
    oBar.style.width = pct+'%';
    oBar.style.background = pct>85?'#ff6030':pct>50?'#c07040':'#903030';
  }
}

/** 实时刷新指令CD显示 */
function cgUpdateCmdCooldownsRt(s, now){
  CG_COMMANDS.forEach(cmd=>{
    const btn = document.getElementById('cgCmdBtn_'+cmd.id);
    if(!btn) return;
    const cdEnd = s.cmdCooldowns[cmd.id]||0;
    if(cdEnd >= 999999){ btn.disabled=true; return; }
    const rem = Math.max(0, cdEnd - now);
    if(rem > 0){
      const badge = btn.querySelector('.cg-cd-badge');
      if(badge) badge.textContent = (rem/1000).toFixed(1)+'s';
      btn.disabled = true;
      btn.classList.add('on-cd');
    } else if(btn.disabled && cdEnd > 0){
      s.cmdCooldowns[cmd.id] = 0;
      btn.disabled = false;
      btn.classList.remove('on-cd');
      const badge = btn.querySelector('.cg-cd-badge');
      if(badge) badge.textContent = '';
    }
  });
}

/** AI指令发出时更新状态栏 */
function cgRtUpdateAiCmdUI(s){
  const opCmdEl = document.getElementById('cgOpLastCmd');
  if(opCmdEl && s.lastAiCmd){
    opCmdEl.textContent = `${s.lastAiCmd.icon}${s.lastAiCmd.name}`;
    opCmdEl.style.animation='none'; void opCmdEl.offsetWidth;
    opCmdEl.style.animation='cg-master-cmd-pulse 0.6s ease-out';
  }
  const stage = document.getElementById('cgStage');
  if(stage && s.lastAiCmd){
    const badge = document.createElement('div');
    badge.className = 'cg-cmd-fx ai-cmd-fx';
    badge.textContent = (s.lastAiCmd.icon+s.lastAiCmd.name).slice(0,18);
    stage.appendChild(badge);
    setTimeout(()=>badge.remove(), 1200);
    cgPlaySfx('ai_cmd');
  }
}

function cgStartRealTimeFight(s){
  if(s.rtRunning || s.over) return;
  s.rtRunning  = true;
  s.rtLastTick = performance.now();
  s.rtRafId    = requestAnimationFrame(cgRtTick);
}

function cgUseSkill(s, who){
  const breedId = who==='player' ? s.playerBreed : s.opBreed;
  const now = performance.now();
  const logs = [];
  switch(breedId){
    case 'iron_head': {
      const stunTarget = who==='player' ? 'opStunned' : 'playerStunned';
      if(Math.random()<0.35){ s[stunTarget]=true; logs.push(`💫 铁头撞击！对手被眩晕！`); }
      else {
        const atk = who==='player'?s.playerAtk:s.opAtk;
        const def = who==='player'?s.opDef:s.playerDef;
        const { dmg } = cgCalcDamage(atk, def);
        if(who==='player') s.opHp=Math.max(0,s.opHp-dmg);
        else s.playerHp=Math.max(0,s.playerHp-dmg);
        logs.push(`💥 铁头撞击！造成 ${dmg} 点伤害`);
      }
      break;
    }
    case 'blue_wings': {
      const mySpd = who==='player'?s.playerSpd:s.opSpd;
      const theirSpd = who==='player'?s.opSpd:s.playerSpd;
      const spdDiff = Math.max(0, mySpd - theirSpd);
      const atk = who==='player'?s.playerAtk:s.opAtk;
      const def = who==='player'?s.opDef:s.playerDef;
      const { dmg } = cgCalcDamage(atk, def);
      const total = dmg + Math.floor(spdDiff*1.5);
      if(who==='player') s.opHp=Math.max(0,s.opHp-total);
      else s.playerHp=Math.max(0,s.playerHp-total);
      logs.push(`💨 疾风翅斩！速度差加成，造成 ${total} 点伤害`);
      break;
    }
    case 'fire_ant':
      // 灼烧改为持续3秒（时间戳）
      if(who==='player') s.opBurnEnd  = Math.max(s.opBurnEnd||0, now + 3000);
      else               s.playerBurnEnd = Math.max(s.playerBurnEnd||0, now + 3000);
      logs.push(`🔥 火焰爆牙！对手陷入灼烧状态（3秒）`);
      break;
    case 'jade_knight':
      if(who==='player') s.playerShield=true;
      else { const h=Math.round(s.opHpMax*0.08); s.opHp=Math.min(s.opHpMax,s.opHp+h); }
      logs.push(`🛡️ 玉甲护身！格挡下一次攻击`);
      break;
    case 'shadow_blade': {
      const atk = who==='player'?s.playerAtk:s.opAtk;
      const def = Math.random()<0.4 ? 0 : (who==='player'?s.opDef:s.playerDef);
      const { dmg } = cgCalcDamage(atk, def);
      if(who==='player') s.opHp=Math.max(0,s.opHp-dmg);
      else s.playerHp=Math.max(0,s.playerHp-dmg);
      logs.push(def===0?`🗡️ 暗夜偷袭！无视防御！造成 ${dmg} 点伤害`:`🗡️ 暗夜偷袭造成 ${dmg} 点伤害`);
      break;
    }
    case 'golden_bell': {
      // 封印对手技能8秒
      const sealDur = 8000;
      if(who==='player') s.opSkillCooldown  = now + sealDur;
      else               s.playerSkillCooldown = now + sealDur;
      const atk = who==='player'?s.playerAtk:s.opAtk;
      const def = who==='player'?s.opDef:s.playerDef;
      const { dmg } = cgCalcDamage(atk, def);
      if(who==='player') s.opHp=Math.max(0,s.opHp-dmg); else s.playerHp=Math.max(0,s.playerHp-dmg);
      logs.push(`🔔 金钟震鸣！对手技能封印8秒，造成 ${dmg} 点伤害`);
      break;
    }
    case 'ice_mandis': {
      const atk = who==='player'?s.playerAtk:s.opAtk;
      const def = who==='player'?s.opDef:s.playerDef;
      const { dmg:d1 } = cgCalcDamage(atk, def);
      const { dmg:d2 } = cgCalcDamage(atk, def);
      if(who==='player'){ s.opHp=Math.max(0,s.opHp-d1-d2); s.opSpeedDebuff+=3; }
      else { s.playerHp=Math.max(0,s.playerHp-d1-d2); s.playerSpeedDebuff+=3; }
      logs.push(`❄️ 冰刃双斩！两段伤害 ${d1}+${d2}，对手减速3`);
      break;
    }
    case 'chaos_king': {
      const tmpP = s.playerHp, tmpO = s.opHp;
      if(who==='player'){
        s.playerHp = Math.min(s.playerHpMax, tmpO);
        s.opHp     = Math.min(s.opHpMax, tmpP);
      } else {
        s.opHp     = Math.min(s.opHpMax, tmpP);
        s.playerHp = Math.min(s.playerHpMax, tmpO);
      }
      logs.push(`✨ 乾坤大挪移！双方血量互换！`);
      break;
    }
  }
  return logs;
}

function cgSettleBattle(s){
  const won = s.winner === 'player';
  const cricket = s.cricket;

  // 博彩结算（扣除玩家违规罚款，加入对方违规赔偿）
  const penalty  = s.betPenalty  || 0;
  const opPenalty = s.opBetPenalty || 0; // 对方被罚款，归玩家

  if(won){
    CG.stats.wins++;
    CG.stats.winStreak  = (CG.stats.winStreak||0) + 1;
    CG.stats.lossStreak = 0;
    const earn = Math.floor(s.bet * s.odds.playerOdds) - penalty + opPenalty;
    CG.stats.totalEarned += earn;
    cricket.wins++;
    // 学习力加成：每点hidLearning+2%经验（最多+20%）
    const learningMult = 1 + ((cricket.hidLearning||0) * 0.02);
    cricket.exp += Math.round((30 + Math.floor((s.actionCount||0) / 3)) * learningMult);
    // 等级提升
    const expNeeded = cricket.level * 60;
    if(cricket.exp >= expNeeded && cricket.level < 20){
      cricket.level++;
      cricket.exp -= expNeeded;
      s.log.push({ round:s.actionCount, lines:[`🎉 ${cricket.name} 升到 ${cricket.level} 级！`] });
    }
    addSilver(earn, '斗蛐蛐赢得彩金');
    // 冷门爆冷额外奖励
    if(s.odds.trueWinRate < 0.35 && won){
      const bonus = Math.floor(s.bet * 0.5);
      addSilver(bonus, '冷门爆冷！额外奖励');
      s.log.push({ round:s.actionCount, lines:[`🎊 爆冷门！额外奖励 ${bonus} 两！`] });
    }
    // 低概率获得新蛐蛐
    if(Math.random() < 0.08){
      const rarePool = CRICKET_BREEDS.filter(b=>b.rare>=2);
      const newBreed = rarePool[Math.floor(Math.random()*rarePool.length)];
      setTimeout(()=>cgAddCricket(newBreed.id, null, true), 1500);
    }
    if(CG.stats.wins % 3 === 0 && CG.opponentIdx < CRICKET_OPPONENTS.length-1) CG.opponentIdx++;
  } else {
    CG.stats.losses++;
    CG.stats.lossStreak = (CG.stats.lossStreak||0) + 1;
    CG.stats.winStreak  = 0;
    CG.stats.totalBet += s.bet;
    cricket.losses++;
    // 学习力：输了也能获得经验（哪怕失败也在成长）
    const learningMultL = 1 + ((cricket.hidLearning||0) * 0.02);
    cricket.exp += Math.round(10 * learningMultL);
    // 输了但对方有违规罚款时，实际损失减少
    const netLoss = s.bet + penalty - opPenalty;
    spendSilver(Math.max(0, netLoss), '斗蛐蛐失败');
    if(opPenalty > 0){
      s.log.push({ round:s.actionCount, lines:[`⚖️ 对方违规被罚 ${opPenalty} 两，已抵扣部分损失`] });
    }
  }

  // 记录场次历史
  CG.matchHistory.push({ won, opId: s.opponentRef.id, odds: s.odds.playerOdds });

  // ── 体力结算：战斗中已按出击次数实时扣减，直接写回 cricket ──
  // s.playerStamina 是战斗过程中实时消耗后的余量
  cricket.currentStamina = Math.max(0, s.playerStamina);

  // ── HP结算：战斗后剩余血量保留（不自动回血），0血则为1（虽败犹生）──
  cricket.currentHp = Math.max(1, s.playerHp);

  // ── 配饰槽蛐蛐笼加成：每场战斗后自动恢复体力+血量 ──
  if(typeof edS !== 'undefined' && edS.accessoryInstId){
    const accInst = bagFindInst(edS.accessoryInstId);
    if(accInst && accInst.type === 'accessory'){
      const accTpl = (typeof ACCESSORIES !== 'undefined')
        ? ACCESSORIES.find(a=>a.id===accInst.templateId) : null;
      if(accTpl && accTpl.cageStats){
        const stRegen = accTpl.cageStats.staminaRegen || 0;
        const hpRegen = accTpl.cageStats.hpRegen || 0;
        cricket.currentStamina = Math.min(
          cricket.currentStamina + stRegen,
          s.playerStaminaMax || cricket.currentStamina
        );
        cricket.currentHp = Math.min(
          Math.max(1, cricket.currentHp) + hpRegen,
          s.playerHp || cricket.currentHp
        );
      }
    }
  }

  // ── 记录对手战后剩余体力（供再战禁用判断）──
  s.opponentRef._lastBattleStamina    = Math.max(0, s.opStamina);
  s.opponentRef._lastBattleStaminaMax = s.opStaminaMax;

  // ── 更新蛐蛐状态（不恢复HP，保留战斗损伤）──
  const stRatio = cricket.currentStamina / Math.max(1, s.playerStaminaMax);
  if(stRatio <= 0){
    cricket.condition = 'tired';
  } else if(stRatio < 0.30){
    cricket.condition = 'injured';
  } else if(won && Math.random() < 0.3){
    cricket.condition = 'excited';
  } else if(!won && Math.random() < 0.35){
    cricket.condition = 'injured';
  } else {
    cricket.condition = 'fresh';
  }

  cgSave();
}

/* ════════════════════════════════════════
   八、UI 渲染
   ════════════════════════════════════════ */
function openCricketGame(){
  cgLoad();
  const panel = document.getElementById('cricketGamePanel');
  if(panel){ panel.style.display='flex'; cgRenderMain(); return; }

  const el = document.createElement('div');
  el.id = 'cricketGamePanel';
  el.className = 'cricket-panel-overlay';
  el.innerHTML = `
<div class="cricket-panel" id="cricketPanelInner">
  <div class="cg-flash-overlay cg-flash-red"  id="cgFlashRed"></div>
  <div class="cg-flash-overlay cg-flash-blue" id="cgFlashBlue"></div>
  <div class="cricket-header">
    <div class="cricket-title">🦗 斗 蛐 蛐</div>
    <div class="cricket-subtitle">— 群 雄 争 霸 · 蛐 蛐 称 王 —</div>
    <button class="cricket-close" onclick="closeCricketGame()">✕</button>
  </div>
  <div id="cricketBody" class="cricket-body"></div>
</div>`;
  document.body.appendChild(el);
  el.style.display = 'flex';
  el.addEventListener('click', e=>{ if(e.target===el) closeCricketGame(); });
  cgRenderMain();
}

function closeCricketGame(){
  // 若即时战斗进行中，先停止 rAF 循环
  if(CG.battle && CG.battle.rtRafId) cancelAnimationFrame(CG.battle.rtRafId);
  const p = document.getElementById('cricketGamePanel');
  if(p) p.style.display='none';
}

function cgRenderMain(){
  const body = document.getElementById('cricketBody');
  if(!body) return;
  try {
  const stats = CG.stats;
  const rate = stats.wins+stats.losses>0 ? Math.round(stats.wins/(stats.wins+stats.losses)*100) : '--';
  const streak = stats.winStreak > 1 ? `🔥连胜${stats.winStreak}` : (stats.lossStreak > 1 ? `❄️连败${stats.lossStreak}` : '');

  const cage = cgGetCageCapacity();

  // 笼子信息
  const cageInfo = cage.slots > 0
    ? `<span>🧺 笼位 <b style="color:#a0d8a0">${CG.collection.length}/${cage.slots}</b></span>`
    : `<span>🧺 无笼子</span>`;

  // 只显示出战阵容
  const squadList = cgGetSquad();
  let squadHtml;
  if(!squadList.length){
    squadHtml = `<div class="cg-empty" style="padding:24px 16px;text-align:center;">
      <div style="font-size:28px;margin-bottom:6px;">📦</div>
      <div style="font-size:13px;color:#e0c060;font-weight:700;margin-bottom:4px;">尚未编排出战阵容</div>
      <div style="font-size:11px;color:#a09070;line-height:1.7;margin-bottom:12px;">
        点击下方按钮，从收藏中选择蛐蛐编入阵容（最多${SQUAD_MAX}只）
      </div>
      <button onclick="cgOpenSquadPanel()" class="cg-catch-btn" style="
        padding:8px 20px;border-radius:10px;cursor:pointer;
        background:linear-gradient(135deg,#5a9e4a,#3d7a2d);color:#fff;
        border:none;font-size:13px;font-weight:700;box-shadow:0 2px 8px rgba(60,120,40,.4);
      ">⚙️ 编排阵容</button>
    </div>`;
  } else {
    squadHtml = squadList.map((c)=>{
      const breed = CRICKET_BREEDS.find(b=>b.id===c.breedId);
      const st = cgGetStats(c);
      const selected = CG.selectedCricket && CG.selectedCricket.uid===c.uid;
      const art = CRICKET_ART[c.breedId] ? CRICKET_ART[c.breedId].stand : ['  ??  ','  ??  '];
      const stPct  = Math.round(st.currentStamina / st.staminaMax * 100);
      const stColor= stPct > 60 ? '#60d080' : stPct > 30 ? '#d0a020' : '#e05050';
      const curHp  = (c.currentHp != null) ? c.currentHp : st.hpMax;
      const hpPct  = Math.round(curHp / Math.max(1, st.hpMax) * 100);
      const condLabel = cgConditionLabel(c.condition);
      const persId = c.personality || breed.personality || 'steady';
      const pers = CRICKET_PERSONALITIES[persId];
      const persTag = pers ? `<span class="cg-pers-mini" title="${pers.desc}">${pers.icon}${pers.name}</span>` : '';
      return `<div class="cg-cricket-card ${selected?'selected':''}" onclick="cgSelectCricketByUid('${c.uid}')"
        style="flex:1;min-width:0;">
        <div class="cg-cricket-art" style="color:${breed.color}">${art.map(r=>`<div>${r}</div>`).join('')}</div>
        <div class="cg-cricket-info">
          <div class="cg-cricket-name">${c.name} <span class="cg-rare-star">${'★'.repeat(breed.rare)}</span> ${persTag}</div>
          <div style="font-size:10px;color:#a09070">Lv.${c.level} · ${breed.name} · ${condLabel}</div>
          <div style="font-size:10px;color:#b0a880">⚔️${st.atk} 🛡️${st.def} 💨${st.spd}</div>
          <div class="cg-stamina-row" style="margin-top:3px">
            <span class="cg-stamina-label" style="font-size:9px">体</span><div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" style="width:${stPct}%;background:${stColor}"></div></div>
            <span class="cg-stamina-val" style="font-size:9px">${Math.round(stPct)}%</span>
          </div>
          <div class="cg-stamina-row">
            <span class="cg-stamina-label" style="font-size:9px">血</span><div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" style="width:${hpPct}%;background:${hpPct>60?'#e05050':hpPct>30?'#d0a020':'#aa2020'}"></div></div>
            <span class="cg-stamina-val" style="font-size:9px">${Math.round(hpPct)}%</span>
          </div>
          <button onclick="event.stopPropagation();cgToggleSquad('${c.uid}');cgRenderMain()" class="cg-squad-toggle-btn cg-squad-out"
            style="width:100%;margin-top:4px;padding:3px 0;border-radius:6px;cursor:pointer;border:none;font-size:11px;background:rgba(200,100,50,.2);color:#e09040">
            📤 移出阵容
          </button>
        </div>
        ${selected?'<div class="cg-selected-mark">✓ 出战</div>':''}
      </div>`;
    }).join('');
  }

  const opponentsHtml = cgRenderOpponents();

  body.innerHTML = `
<div class="cg-main">
  <div class="cg-stats-bar">
    <span>🏆 胜 <b style="color:#ffe060">${stats.wins}</b></span>
    <span>💀 败 <b style="color:#e06060">${stats.losses}</b></span>
    <span>📊 胜率 <b style="color:#a0d8a0">${rate}%</b></span>
    ${streak?`<span><b style="color:#ffa040">${streak}</b></span>`:''}
    <span>💰 <b style="color:#ffe060">${getSilver()}</b> 两</span>
    ${cageInfo}
    ${CG.selectedCricket ? `<span>⚔️ 出战: <b style="color:#e0c060">${CG.selectedCricket.name}</b></span>` : ''}
  </div>

  <!-- 出战阵容 -->
  <div class="cg-section-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
    <span>⚔️ 出战阵容（${squadList.length}/${SQUAD_MAX}）</span>
    <button onclick="cgOpenSquadPanel()" class="cg-squad-btn" style="
      padding:3px 12px;border-radius:6px;cursor:pointer;
      background:rgba(200,180,100,.15);border:1px solid rgba(200,180,100,.25);
      color:#d0b860;font-size:11px;
    ">⚙️ 编排阵容</button>
  </div>
  <div class="cg-squad-row" id="cgSquadRow" style="display:flex;gap:8px;${squadList.length?'':'padding:16px 0;'}">
    ${squadHtml}
  </div>

  <!-- 对手 -->
  <div class="cg-section-title" style="margin-top:12px;">🎯 选择对手</div>
  <div class="cg-opponent-list">${opponentsHtml}</div>
  ${CG.selectedCricket ? '<div class="cg-tip">💡 已选中「'+CG.selectedCricket.name+'」→ 挑战对手 · 连败有爆冷加成</div>' : '<div class="cg-tip">💡 先从阵容中点击选择出战的蛐蛐 → 再挑战对手</div>'}
</div>`;
  } catch(e) {
    console.error('[Cricket] 渲染失败:', e);
    body.innerHTML = '<div style="color:#e06060;padding:20px;">渲染失败: ' + e.message + '</div>';
  }
}

function cgRenderCollection(){
  if(!CG.collection.length) return `<div class="cg-empty" style="padding:24px 16px;text-align:center;">
  <div style="font-size:36px;margin-bottom:8px;">🦗</div>
  <div style="font-size:15px;color:#e0c060;font-weight:700;margin-bottom:6px;">笼中空空如也</div>
  <div style="font-size:12px;color:#a09070;line-height:1.7;margin-bottom:14px;">
    想斗蛐蛐？先去野外捉几只回来吧！<br>
    🌿 城镇附近草丛、废墟、石缝中常有蛐蛐出没
  </div>
  <button class="cg-catch-btn" onclick="tryOpenCricketCatch()" style="
    padding:8px 20px;border-radius:10px;cursor:pointer;
    background:linear-gradient(135deg,#5a9e4a,#3d7a2d);color:#fff;
    border:none;font-size:13px;font-weight:700;
    box-shadow:0 2px 8px rgba(60,120,40,.4);
    transition:transform .15s,box-shadow .15s;
  ">🌿 去捉蛐蛐</button>
</div>`;
  try {
  return CG.collection.map((c,i)=>{
    const breed = CRICKET_BREEDS.find(b=>b.id===c.breedId);
    const st = cgGetStats(c);
    const selected = CG.selectedCricket && CG.selectedCricket.uid===c.uid;
    const art = CRICKET_ART[c.breedId] ? CRICKET_ART[c.breedId].stand : ['  ??  ','  ??  '];
    const expPct = Math.round(c.exp / (c.level*60) * 100);
    const condLabel = cgConditionLabel(c.condition);
    const persId = c.personality || breed.personality || 'steady';
    const pers = CRICKET_PERSONALITIES[persId];
    const persTag = pers ? `<span class="cg-pers-mini" title="${pers.desc}">${pers.icon}${pers.name}</span>` : '';
    // 体力条
    const stPct  = Math.round(st.currentStamina / st.staminaMax * 100);
    const stColor= stPct > 60 ? '#60d080' : stPct > 30 ? '#d0a020' : '#e05050';
    const stWarn = stPct <= 20 ? ' <span style="color:#e05050;font-size:9px">⚠体力不足</span>' : '';
    // 血量条（带入上场后剩余血量，null时视为满血；hpMax为未受状态影响的上限）
    const curHp  = (c.currentHp != null) ? c.currentHp : st.hpMax;
    const hpPct  = Math.round(curHp / Math.max(1, st.hpMax) * 100);
    const hpColor= hpPct > 60 ? '#e05050' : hpPct > 30 ? '#d0a020' : '#aa2020';
    const hpWarn = hpPct <= 30 ? ' <span style="color:#e05050;font-size:9px">⚠身负重伤</span>' : '';
    const restCost = 3; // 休息需消耗银两
    const needsRest = stPct < 100 || hpPct < 100 || c.condition === 'injured' || c.condition === 'tired';
    const restBtn = needsRest
      ? `<button class="cg-rest-btn" onclick="cgRestCricket(${i},event)" title="喂水休息，消耗${restCost}两，恢复部分体力和血量">💧休息(${restCost}两)</button>`
      : '';
    return `<div class="cg-cricket-card ${selected?'selected':''}" onclick="cgSelectCricket(${i})">
  <div class="cg-cricket-art" style="color:${breed.color}">${art.map(r=>`<div>${r}</div>`).join('')}</div>
  <div class="cg-cricket-info">
    <div class="cg-cricket-name">${c.name} <span class="cg-rare-star">${'★'.repeat(breed.rare)}</span> ${persTag}</div>
    <div class="cg-cricket-lv">Lv.${c.level} · ${breed.name} · <span style="font-size:10px">${condLabel}</span></div>
    <div class="cg-cricket-attrs">⚔️${st.atk} 🛡️${st.def} 💨${st.spd} ❤️${curHp}/${st.hpMax} 💪${st.regen}</div>
    <div class="cg-stamina-row">
      <span class="cg-stamina-label">体力</span>
      <div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" style="width:${stPct}%;background:${stColor}"></div></div>
      <span class="cg-stamina-val">${st.currentStamina}/${st.staminaMax}</span>${stWarn}
    </div>
    <div class="cg-stamina-row">
      <span class="cg-stamina-label">血量</span>
      <div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" style="width:${hpPct}%;background:${hpColor}"></div></div>
      <span class="cg-stamina-val">${curHp}/${st.hpMax}</span>${hpWarn}
    </div>
    <div class="cg-exp-bar-wrap"><div class="cg-exp-bar" style="width:${expPct}%"></div></div>
    <div class="cg-cricket-record" style="display:flex;align-items:center;gap:6px">🏆${c.wins}胜/${c.losses}败 ${restBtn}</div>
  </div>
  ${selected?'<div class="cg-selected-mark">✓ 出战</div>':''}
</div>`;
  }).join('');
  } catch(e) {
    console.error('[Cricket Debug] cgRenderCollection 失败:', e);
    return '<div style="color:#e06060;">渲染蛐蛐列表失败: ' + e.message + '</div>';
  }
}

/**
 * 带阵容按钮的收藏列表 — 每张卡片有「入队/移出」按钮
 * 用于主界面展示，替代独立的编排面板
 */
function cgRenderCollectionWithSquad(){
  if(!CG.collection.length) return `<div class="cg-empty" style="padding:24px 16px;text-align:center;">
  <div style="font-size:36px;margin-bottom:8px;">🦗</div>
  <div style="font-size:15px;color:#e0c060;font-weight:700;margin-bottom:6px;">笼中空空如也</div>
  <div style="font-size:12px;color:#a09070;line-height:1.7;margin-bottom:14px;">
    想斗蛐蛐？先去野外捉几只回来吧！<br>🌿 城镇附近草丛常有蛐蛐出没
  </div>
  <button class="cg-catch-btn" onclick="tryOpenCricketCatch()" style="
    padding:8px 20px;border-radius:10px;cursor:pointer;
    background:linear-gradient(135deg,#5a9e4a,#3d7a2d);color:#fff;
    border:none;font-size:13px;font-weight:700;box-shadow:0 2px 8px rgba(60,120,40,.4);
  ">🌿 去捉蛐蛐</button>
</div>`;
  try {
  const squadList = cgGetSquad();
  return CG.collection.map((c,i)=>{
    const breed = CRICKET_BREEDS.find(b=>b.id===c.breedId);
    const st = cgGetStats(c);
    const selected = CG.selectedCricket && CG.selectedCricket.uid===c.uid;
    const art = CRICKET_ART[c.breedId] ? CRICKET_ART[c.breedId].stand : ['  ??  ','  ??  '];
    const expPct = Math.round(c.exp / (c.level*60) * 100);
    const condLabel = cgConditionLabel(c.condition);
    const persId = c.personality || breed.personality || 'steady';
    const pers = CRICKET_PERSONALITIES[persId];
    const persTag = pers ? `<span class="cg-pers-mini" title="${pers.desc}">${pers.icon}${pers.name}</span>` : '';
    // 体力条
    const stPct  = Math.round(st.currentStamina / st.staminaMax * 100);
    const stColor= stPct > 60 ? '#60d080' : stPct > 30 ? '#d0a020' : '#e05050';
    const stWarn = stPct <= 20 ? ' <span style="color:#e05050;font-size:9px">⚠体力不足</span>' : '';
    // 血量条
    const curHp  = (c.currentHp != null) ? c.currentHp : st.hpMax;
    const hpPct  = Math.round(curHp / Math.max(1, st.hpMax) * 100);
    const hpColor= hpPct > 60 ? '#e05050' : hpPct > 30 ? '#d0a020' : '#aa2020';
    const hpWarn = hpPct <= 30 ? ' <span style="color:#e05050;font-size:9px">⚠身负重伤</span>' : '';
    const restCost = 3;
    const needsRest = stPct < 100 || hpPct < 100 || c.condition === 'injured' || c.condition === 'tired';
    const restBtn = needsRest
      ? `<button class="cg-rest-btn" onclick="cgRestCricket(${i},event)" title="喂水休息，消耗${restCost}两，恢复部分体力和血量">💧休息(${restCost}两)</button>`
      : '';

    // 阵容状态
    const inSquad = cgInSquad(c.uid);
    const fullLocked = !inSquad && CG.squad.length >= SQUAD_MAX;
    const btnText  = inSquad ? '📤 移出' : (fullLocked ? '✖️ 已满' : '📥 入队');
    const btnCls   = inSquad ? 'cg-squad-out' : (fullLocked ? '' : 'cg-squad-in');
    const btnClick = inSquad || !fullLocked
      ? `onclick="cgToggleSquad('${c.uid}');cgRenderMain()"`
      : '';

    return `<div class="cg-cricket-card ${selected?'selected':''}" ${!inSquad&&fullLocked?'style="opacity:.45"':''}>
  <div class="cg-cricket-art" style="color:${breed.color}">${art.map(r=>`<div>${r}</div>`).join('')}</div>
  <div class="cg-cricket-info">
    <div class="cg-cricket-name">${c.name} <span class="cg-rare-star">${'★'.repeat(breed.rare)}</span> ${persTag}</div>
    <div class="cg-cricket-lv">Lv.${c.level} · ${breed.name} · <span style="font-size:10px">${condLabel}</span></div>
    <div class="cg-cricket-attrs">⚔️${st.atk} 🛡️${st.def} 💨${st.spd} ❤️${curHp}/${st.hpMax} 💪${st.regen}</div>
    <div class="cg-stamina-row">
      <span class="cg-stamina-label">体力</span><div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" style="width:${stPct}%;background:${stColor}"></div></div>
      <span class="cg-stamina-val">${st.currentStamina}/${st.staminaMax}</span>${stWarn}
    </div>
    <div class="cg-stamina-row">
      <span class="cg-stamina-label">血量</span><div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" style="width:${hpPct}%;background:${hpColor}"></div></div>
      <span class="cg-stamina-val">${curHp}/${st.hpMax}</span>${hpWarn}
    </div>
    <div class="cg-exp-bar-wrap"><div class="cg-exp-bar" style="width:${expPct}%"></div></div>
    <div class="cg-cricket-record" style="display:flex;align-items:center;gap:6px">🏆${c.wins}胜/${c.losses}败
      <button ${btnClick} ${btnClick?'':disabled} class="cg-squad-toggle-btn ${btnCls}"
        style="margin-left:auto;padding:3px 10px;border-radius:6px;cursor:pointer;border:none;font-size:11px;background:${inSquad?'rgba(200,100,50,.3)':'rgba(60,150,80,.3)'};color:${inSquad?'#e09040':'#60d080'}">
        ${btnText}
      </button>
      ${restBtn}
    </div>
  </div>
  ${selected?'<div class="cg-selected-mark">✓ 出战</div>':''}
</div>`;
  }).join('');
  } catch(e) {
    console.error('[Cricket Debug] cgRenderCollectionWithSquad 失败:', e);
    return '<div style="color:#e06060;">渲染蛐蛐列表失败: ' + e.message + '</div>';
  }
}

function cgRenderOpponents(){
  try {
  // 检查出战蛐蛐体力状态
  const selectedSt = CG.selectedCricket ? cgGetStats(CG.selectedCricket) : null;
  const selectedTired = selectedSt && selectedSt.currentStamina <= 0;

  return CRICKET_OPPONENTS.slice(0, CG.opponentIdx+1).map((op,i)=>{
    const breed = CRICKET_BREEDS.find(b=>b.id===op.breedId);
    // 小游戏默认全解锁：全部对手可挑战，不再显示"未解锁"
    const art = CRICKET_ART[op.breedId] ? CRICKET_ART[op.breedId].stand : ['??','??','??'];
    const btnDisabled = selectedTired;
    const btnLabel = selectedTired ? '💤 力竭中' : '⚔️ 挑战';
    return `<div class="cg-opponent-card">
  <div class="cg-op-art" style="color:${breed.color}">${art.map(r=>`<div>${r}</div>`).join('')}</div>
  <div class="cg-op-info">
    <div class="cg-op-name">${op.name} <span style="opacity:.6;font-size:10px">「${op.title}」</span></div>
    <div class="cg-op-breed" style="color:${breed.color}">${breed.name}</div>
    <div class="cg-op-bet">下注 ${op.betRange[0]} ~ ${op.betRange[1]} 两</div>
  </div>
  <button class="cg-challenge-btn" ${btnDisabled?'disabled':''} onclick="cgOpenBetPanel(${i})">
    ${btnLabel}
  </button>
</div>`;
  }).reverse().join('');
  } catch(e) {
    console.error('[Cricket Debug] cgRenderOpponents 失败:', e);
    return '<div style="color:#e06060;">渲染对手列表失败: ' + e.message + '</div>';
  }
}

function cgSelectCricket(idx){
  CG.selectedCricket = CG.collection[idx];
  cgRenderMain();
}

/** 通过 UID 选择蛐蛐（用于出战阵容卡片点击） */
function cgSelectCricketByUid(uid){
  const c = CG.collection.find(x => x.uid === uid);
  if(c){ CG.selectedCricket = c; cgRenderMain(); }
}

/**
 * 出战阵容设置面板 — 全量收藏列表 + 编入/移出阵容
 * 从主界面「⚙️ 编排阵容」按钮进入
 */
function cgOpenSquadPanel(){
  const body = document.getElementById('cricketBody');
  if(!body) return;

  const cage = cgGetCageCapacity();

  // 收藏列表（带入队/移出按钮）
  let listHtml;
  if(!CG.collection.length){
    listHtml = `<div class="cg-empty" style="padding:24px 16px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">🦗</div>
      <div style="font-size:15px;color:#e0c060;font-weight:700;margin-bottom:6px;">笼中空空如也</div>
      <div style="font-size:12px;color:#a09070;line-height:1.7;margin-bottom:14px;">
        想斗蛐蛐？先去野外捉几只回来吧！<br>🌿 城镇附近草丛常有蛐蛐出没
      </div>
      <button class="cg-catch-btn" onclick="tryOpenCricketCatch()" style="
        padding:8px 20px;border-radius:10px;cursor:pointer;
        background:linear-gradient(135deg,#5a9e4a,#3d7a2d);color:#fff;
        border:none;font-size:13px;font-weight:700;box-shadow:0 2px 8px rgba(60,120,40,.4);
      ">🌿 去捉蛐蛐</button>
    </div>`;
  } else {
    const squadList = cgGetSquad();
    listHtml = CG.collection.map((c)=>{
      const breed = CRICKET_BREEDS.find(b=>b.id===c.breedId);
      const st = cgGetStats(c);
      const inSquad = cgInSquad(c.uid);
      const art = CRICKET_ART[c.breedId] ? CRICKET_ART[c.breedId].stand : ['??','??'];
      const stPct = Math.round(st.currentStamina / st.staminaMax * 100);
      const curHp = (c.currentHp != null) ? c.currentHp : st.hpMax;
      const hpPct = Math.round(curHp / Math.max(1,st.hpMax) * 100);
      const condLabel = cgConditionLabel(c.condition);

      // 阵容已满且不在阵容中
      const fullLocked = !inSquad && CG.squad.length >= SQUAD_MAX;
      const btnText  = inSquad ? '📤 移出' : (fullLocked ? '✖️ 已满' : '📥 入队');
      const btnCls   = inSquad ? 'cg-squad-out' : (fullLocked ? '' : 'cg-squad-in');
      const btnClick = inSquad || !fullLocked
        ? `onclick="cgToggleSquad('${c.uid}');cgOpenSquadPanel()"`
        : '';

      return `<div class="cg-cricket-card ${inSquad?'in-squad':''}" style="${fullLocked&&!inSquad?'opacity:.45':''}">
        <div class="cg-cricket-art" style="color:${breed.color}">${art.map(r=>`<div>${r}</div>`).join('')}</div>
        <div class="cg-cricket-info">
          <div class="cg-cricket-name">${c.name} <span class="cg-rare-star">${'★'.repeat(breed.rare)}</span></div>
          <div class="cg-cricket-lv">Lv.${c.level} · ${breed.name} · ${condLabel}</div>
          <div class="cg-cricket-attrs">⚔️${st.atk} 🛡️${st.def} 💨${st.spd} ❤️${curHp}/${st.hpMax} 🏆${c.wins}胜/${c.losses}败</div>
          <div class="cg-stamina-row">
            <span class="cg-stamina-label">体力</span><div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" style="width:${stPct}%;background:${stPct>60?'#60d080':stPct>30?'#d0a020':'#e05050'}"></div></div>
            <span class="cg-stamina-val">${st.currentStamina}/${st.staminaMax}</span>
          </div>
        </div>
        <button ${btnClick} ${btnClick?'':disabled} class="cg-squad-toggle-btn ${btnCls}"
          style="margin-left:auto;padding:4px 10px;border-radius:6px;cursor:pointer;border:none;font-size:11px;background:${inSquad?'rgba(200,100,50,.3)':'rgba(60,150,80,.3)'};color:${inSquad?'#e09040':'#60d080'}">
          ${btnText}
        </button>
      </div>`;
    }).join('');
  }

  body.innerHTML = `
<div class="cg-main">
  <div class="cg-stats-bar" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap">
    <div>
      <span>💰 <b style="color:#ffe060">${getSilver()}</b> 两</span>
      ${cage.slots > 0
        ? `<span>🧺 笼位 <b style="color:#a0d8a0">${CG.collection.length}/${cage.slots}</b></span>`
        : `<span>🧺 无蛐蛐笼（无法捕捉）</span>`
      }
    </div>
    <button onclick="cgRenderMain()" style="
      padding:4px 12px;border-radius:6px;cursor:pointer;
      background:rgba(180,160,80,.2);border:1px solid rgba(180,160,80,.3);
      color:#d0b860;font-size:11px;
    ">◀ 返回主界面</button>
  </div>

  <div class="cg-section-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <span>⚙️ 出战阵容编排</span>
    <span style="font-weight:400;font-size:11px;color:#a09070">
      （最多 ${SQUAD_MAX} 只 · 当前 ${CG.squad.length}/${SQUAD_MAX}）
    </span>
  </div>

  <div class="cg-cricket-list" id="cgFullList">${listHtml}</div>

  <div class="cg-tip">💡 点击「入队」编入出战阵容 · 找掌柜购买或在合成台制作更多蛐蛐笼</div>
</div>`;
}

/**
 * 从斗蛐蛐面板点击"去捉蛐蛐" — 先关面板再开捕捉界面
 */
function tryOpenCricketCatch(){
  // 关闭斗蛐蛐面板
  closeCricketGame();
  // 打开捕捉界面
  if(typeof openCricketCatchGame === 'function'){
    setTimeout(()=>openCricketCatchGame(), 300);
  } else {
    showToast('🌿 捕捉功能暂未加载');
  }
}

/**
 * 蛐蛐休息恢复体力 + 部分回血
 * 每次消耗 3 两银子，恢复体力 regen × 8（最多40%上限），同时回血 20%最大HP
 */
function cgRestCricket(idx, e){
  if(e) e.stopPropagation();
  const cricket = CG.collection[idx];
  if(!cricket) return;
  const st = cgGetStats(cricket);
  const stFull = st.currentStamina >= st.staminaMax;
  const hpFull = cricket.currentHp != null && cricket.currentHp >= st.hpMax;
  if(stFull && hpFull){ showToast('体力和血量已满，无需休息！'); return; }
  const cost = 3;
  if(getSilver() < cost){ showToast(`银两不足！休息需要 ${cost} 两`); return; }
  spendSilver(cost, '蛐蛐休息');

  // ── 配饰槽蛐蛐笼加成（读取已装备的配饰） ──
  let staminaBonus = 0, hpBonus = 0;
  if(typeof edS !== 'undefined' && edS.accessoryInstId){
    const accInst = bagFindInst(edS.accessoryInstId);
    if(accInst && accInst.type === 'accessory'){
      const accTpl = (typeof ACCESSORIES !== 'undefined')
        ? ACCESSORIES.find(a=>a.id===accInst.templateId) : null;
      if(accTpl && accTpl.cageStats){
        staminaBonus = accTpl.cageStats.staminaRegen || 0;
        hpBonus      = accTpl.cageStats.hpRegen || 0;
      }
    }
  }

  // 恢复体力（基础 + 配饰加成）
  const effectiveRegen = st.regen + staminaBonus;
  const restoreStamina = Math.min(
    Math.floor(st.staminaMax * 0.40),
    effectiveRegen * 8
  );
  cricket.currentStamina = Math.min(st.staminaMax, (cricket.currentStamina||0) + restoreStamina);

  // 同时回血 20%（静养疗伤）+ 配饰血量加成
  if(cricket.currentHp == null) cricket.currentHp = st.hpMax;
  const restoreHp = Math.round(st.hpMax * 0.20) + hpBonus;
  cricket.currentHp = Math.min(st.hpMax, cricket.currentHp + restoreHp);

  // 受伤/疲惫状态在休息后清除（恢复即疗伤）
  if(cricket.currentHp >= st.hpMax && cricket.currentStamina >= st.staminaMax){
    if(cricket.condition === 'injured' || cricket.condition === 'tired'){
      cricket.condition = 'fresh';
    }
  }

  cgSave();
  const bonusHint = staminaBonus || hpBonus
    ? ` | 🧺配饰加成：${staminaBonus?`体力+${staminaBonus}`:''}${hpBonus?` 血量+${hpBonus}`:''}`
    : '';
  showToast(`💧 ${cricket.name} 休息：体力 +${restoreStamina}（${cricket.currentStamina}/${st.staminaMax}），血量 +${restoreHp}（${cricket.currentHp}/${st.hpMax}）${bonusHint}`);
  cgRenderMain();
}

/* ════════════════════════════════════════
   九、下注面板（含赔率展示）
   ════════════════════════════════════════ */
function cgOpenBetPanel(opIdx){
  if(!CG.selectedCricket){ showToast('请先选择出战的蛐蛐！'); return; }
  const op = CRICKET_OPPONENTS[opIdx];
  const silver = getSilver();
  const minBet = op.betRange[0];
  const maxBet = Math.min(op.betRange[1], silver);
  if(silver < minBet){ showToast(`银两不足！至少需要 ${minBet} 两才能下注`); return; }

  // 体力检查：体力耗尽无法上场
  const ps = cgGetStats(CG.selectedCricket);
  if(ps.currentStamina <= 0){
    showToast('你的蛐蛐已力竭，请先让它休息恢复体力！');
    return;
  }

  const defBet = Math.min(minBet*2, maxBet);
  const opBreed = CRICKET_BREEDS.find(b=>b.id===op.breedId);
  const opLv = op.level + 1; // 估算
  const opStats = {
    atk: Math.round(opBreed.atk * (1 + opLv*0.08) + op.lvBonus*0.3),
    def: Math.round(opBreed.def * (1 + opLv*0.05) + op.lvBonus*0.15),
    spd: Math.round(opBreed.spd * (1 + opLv*0.04) + op.lvBonus*0.1),
    hp:  Math.round(opBreed.hp  * (1 + opLv*0.10) + op.lvBonus),
  };
  const odds = cgCalcOdds(ps, opStats, op);
  const streakBonus = cgStreakWinRateBonus();
  const estWin = Math.round((odds.trueWinRate + streakBonus) * 100);
  const potentialWin = Math.round(defBet * odds.playerOdds);

  // 近期战绩参考
  const recent = CG.matchHistory.slice(-10);
  const recentStr = recent.length ? recent.map(m=>m.won?'✅':'❌').join('') : '—';

  const body = document.getElementById('cricketBody');
  body.innerHTML = `
<div class="cg-bet-panel">
  <div class="cg-bp-title">⚔️ 挑战 ${op.name}</div>
  <div class="cg-bp-sub">「${op.title}」· <span style="color:${opBreed.color}">${opBreed.name}</span></div>

  <!-- 赔率板 -->
  <div class="cg-odds-board">
    <div class="cg-odds-row">
      <div class="cg-odds-cell">
        <div class="cg-odds-label">你方赔率</div>
        <div class="cg-odds-value" style="color:#70e090">1 赔 ${odds.playerOdds}</div>
        <div class="cg-odds-rate">估计胜率 ${estWin}%</div>
      </div>
      <div class="cg-odds-vs">VS</div>
      <div class="cg-odds-cell">
        <div class="cg-odds-label">对方赔率</div>
        <div class="cg-odds-value" style="color:${opBreed.color}">1 赔 ${odds.opOdds}</div>
        <div class="cg-odds-rate">庄家抽水 ${odds.edge}%</div>
      </div>
    </div>
    <div class="cg-odds-label-center">${odds.label}</div>
    ${streakBonus>0?`<div style="text-align:center;color:#ffa040;font-size:11px;margin-top:4px">🍀 连败加成：胜率+${Math.round(streakBonus*100)}%</div>`:''}
  </div>

  <!-- 下注 -->
  <div class="cg-bp-desc">你的银两：<b style="color:#ffe060">${silver}</b> 两</div>
  <div class="cg-bp-betrow">
    <span>下注：</span>
    <input type="range" id="cgBetRange" min="${minBet}" max="${maxBet}" value="${defBet}"
      oninput="cgUpdateBetPreview(this.value,${odds.playerOdds})">
    <b id="cgBetVal" style="color:#ffe060;min-width:40px;display:inline-block">${defBet}</b> 两
  </div>
  <div class="cg-bp-info" id="cgBetInfo">赢可得：<b style="color:#ffe060">${potentialWin}</b> 两（1赔${odds.playerOdds}）</div>

  <!-- 近期战绩 -->
  <div style="text-align:center;font-size:11px;color:rgba(180,150,80,.6);margin:6px 0">
    近10场：${recentStr}
  </div>

  <!-- 蛐蛐状态提示 -->
  <div style="text-align:center;font-size:11px;color:rgba(160,200,160,.7);margin-bottom:8px">
    参赛状态：${cgConditionLabel(CG.selectedCricket.condition)}
    ${CG.selectedCricket.condition==='tired'?' · ⚠️疲惫蛐蛐攻速降低':''}
    ${CG.selectedCricket.condition==='injured'?' · ⚠️受伤蛐蛐防御降低':''}
    ${CG.selectedCricket.condition==='excited'?' · ✨亢奋蛐蛐攻速提升':''}
  </div>

  <div class="cg-bp-btns">
    <button class="cg-btn-cancel" onclick="cgRenderMain()">← 返回</button>
    <button class="cg-btn-fight" onclick="cgBeginFight(${opIdx})">🦗 开始对战！</button>
  </div>
</div>`;
}

function cgUpdateBetPreview(val, playerOdds){
  const v = document.getElementById('cgBetVal');
  const info = document.getElementById('cgBetInfo');
  if(v) v.textContent = val;
  if(info){
    const win = Math.round(parseInt(val) * playerOdds);
    info.innerHTML = `赢可得：<b style="color:#ffe060">${win}</b> 两（1赔${playerOdds}）`;
  }
}
window.cgUpdateBetPreview = cgUpdateBetPreview;

function cgBeginFight(opIdx){
  const betEl = document.getElementById('cgBetRange');
  const bet = parseInt(betEl ? betEl.value : CRICKET_OPPONENTS[opIdx].betRange[0]);
  if(!CG.selectedCricket){ showToast('请先选择出战的蛐蛐！'); return; }
  // 检查出战蛐蛐体力
  const selSt = cgGetStats(CG.selectedCricket);
  if(selSt.currentStamina <= 0){ showToast(`${CG.selectedCricket.name} 力竭，先休息一下吧`); return; }
  if(bet > getSilver()){ showToast('银两不足！'); return; }
  const state = cgStartBattle(CG.selectedCricket, opIdx, bet);
  cgRenderBattle(state);
  cgPlayIntro(state);
}

/* ════════════════════════════════════════
   十、战斗场景渲染（即时战斗版 v3.0）
   ════════════════════════════════════════ */
function cgRenderBattle(s){
  const pPers  = s.playerPersonality ? CRICKET_PERSONALITIES[s.playerPersonality] : null;
  const opPers = s.opPersonality     ? CRICKET_PERSONALITIES[s.opPersonality]     : null;
  const pPersTag  = pPers  ? `<span class="cg-pers-tag" title="${pPers.desc}">${pPers.icon}${pPers.name}</span>`  : '';
  const opPersTag = opPers ? `<span class="cg-pers-tag op" title="${opPers.desc}">${opPers.icon}${opPers.name}</span>` : '';

  const body = document.getElementById('cricketBody');
  body.innerHTML = `
<div class="cg-battle-scene">
  ${s.event ? `<div class="cg-event-banner">⚡ 特殊天气：${s.event.name} — ${s.event.desc}</div>` : ''}

  <!-- 血条 + ATB条 -->
  <div class="cg-hp-bars">
    <div class="cg-hp-side">
      <div class="cg-hp-name" style="color:#70e090">${s.playerName} ${pPersTag}</div>
      <div class="cg-hp-bar-wrap"><div class="cg-hp-bar" id="cgPlayerHpBar" style="width:100%"></div></div>
      <div class="cg-hp-num"><span id="cgPlayerHpNum">${s.playerHp}</span>/<span>${s.playerHpMax}</span></div>
      <div class="cg-atb-bar-wrap" title="行动条"><div class="cg-atb-fill" id="cgPlayerAtbFill" style="width:0%"></div></div>
      <div class="cg-stamina-row cg-battle-stamina">
        <span class="cg-stamina-label">体</span>
        <div class="cg-stamina-bar-wrap"><div class="cg-stamina-bar" id="cgPlayerStaminaBar" style="width:${Math.round(s.playerStamina/s.playerStaminaMax*100)}%;background:${s.playerStamina/s.playerStaminaMax>0.5?'#60d080':s.playerStamina/s.playerStaminaMax>0.25?'#d0a020':'#e05050'}"></div></div>
        <span class="cg-stamina-val" id="cgPlayerStaminaNum">${s.playerStamina}/${s.playerStaminaMax}</span>
      </div>
    </div>
    <div class="cg-vs-label">赔率<br><span id="cgLiveOdds" style="font-size:11px;color:#ffe060">1:${s.odds.playerOdds}</span></div>
    <div class="cg-hp-side" style="text-align:right">
      <div class="cg-hp-name" style="color:${s.opColor}">${opPersTag} ${s.opName}</div>
      <div class="cg-hp-bar-wrap"><div class="cg-hp-bar" id="cgOpHpBar" style="width:100%"></div></div>
      <div class="cg-hp-num"><span id="cgOpHpNum">${s.opHp}</span>/<span>${s.opHpMax}</span></div>
      <div class="cg-atb-bar-wrap" title="行动条"><div class="cg-atb-fill op" id="cgOpAtbFill" style="width:0%"></div></div>
    </div>
  </div>

  <!-- 双方主人指令状态栏 -->
  <div class="cg-masters-bar">
    <div class="cg-master-side player-master">
      <span class="cg-master-label">🧑 你</span>
      <span id="cgPlayerLastCmd" class="cg-master-cmd"></span>
    </div>
    <div class="cg-master-mid">主人之争</div>
    <div class="cg-master-side op-master" style="text-align:right">
      <span id="cgOpLastCmd" class="cg-master-cmd"></span>
      <span class="cg-master-label" style="color:${s.opColor}">🤖 ${s.opMasterName}</span>
    </div>
  </div>

  <!-- 战斗舞台 -->
  <div class="cg-stage" id="cgStage">
    <div class="cg-fighter" id="cgPlayerFighter">
      <div class="cg-fighter-wrap" id="cgPlayerWrap">
        <pre class="cg-fighter-art" id="cgPlayerArt" style="color:#70e090">${cgArtPre(s.playerBreed,'stand')}</pre>
      </div>
      <div class="cg-fighter-name">${s.playerName}</div>
      <div class="cg-fighter-skill" id="cgPlayerSkillLabel">技: ${s.playerSkill}</div>
      <div class="cg-fighter-status" id="cgPlayerStatus"></div>
    </div>

    <div class="cg-stage-center">
      <div class="cg-round-num" id="cgRoundNum">⚡ 即时对战</div>
      <div class="cg-stage-deco">⚔️<br>决<br>战<br>擂<br>台</div>
    </div>

    <div class="cg-fighter" id="cgOpFighter">
      <div class="cg-fighter-wrap" id="cgOpWrap">
        <pre class="cg-fighter-art" id="cgOpArt" style="color:${s.opColor}">${cgArtPre(s.opBreed,'stand')}</pre>
      </div>
      <div class="cg-fighter-name">${s.opName}</div>
      <div class="cg-fighter-skill">技: ${s.opSkill}</div>
      <div class="cg-fighter-status" id="cgOpStatus"></div>
    </div>
  </div>

  <!-- 战斗日志 -->
  <div class="cg-battle-log" id="cgBattleLog">
    <div class="cg-log-line event">— 即时对战开始 · 下注 <b style="color:#ffe060">${s.bet}</b> 两 · 赔率 1:${s.odds.playerOdds} —</div>
    <div class="cg-log-line event" style="opacity:.7">⚡ 速度决定出手频率，随时发出指令！</div>
  </div>

  <!-- 指令按钮区 -->
  <div class="cg-cmd-panel" id="cgCmdPanel">
    <div class="cg-cmd-title">📢 场边指令 <span style="font-size:10px;opacity:.6">（各有独立冷却，随时可用）</span></div>
    <div class="cg-cmd-grid" id="cgCmdGrid">${cgRenderCmdButtons(s)}</div>
    <div class="cg-cmd-hint" id="cgCmdHint">蛐蛐即时出击中，随时发出指令…</div>
  </div>
</div>`;
}

/** 渲染指令按钮（即时战斗版：各自独立CD） */
function cgRenderCmdButtons(s){
  const now = performance.now();
  return CG_COMMANDS.map(cmd=>{
    const cdEnd = s.cmdCooldowns[cmd.id] || 0;
    const oneTimeUsed = cdEnd >= 999999;
    if(oneTimeUsed) return `<button id="cgCmdBtn_${cmd.id}" class="cg-cmd-btn used" disabled title="${cmd.desc}">
      ${cmd.icon} ${cmd.name}<br><span style="font-size:9px;opacity:.5">已使用</span></button>`;
    const remaining = Math.max(0, cdEnd - now);
    const onCd = remaining > 0;
    const cdSec = onCd ? Math.ceil(remaining/1000) : 0;
    const cdText = onCd ? `<span class="cg-cd-badge">${cdSec}s</span>` : '';
    return `<button id="cgCmdBtn_${cmd.id}" class="cg-cmd-btn ${onCd?'on-cd':''}"
      ${(onCd||s.over)?'disabled':''}
      onclick="cgIssueCommand('${cmd.id}')"
      title="${cmd.desc}">
      ${cmd.icon} ${cmd.name}${cdText}
    </button>`;
  }).join('');
}

/* ════════════════════════════════════════
   十一、玩家指令（即时战斗版）
   ════════════════════════════════════════ */
/** 玩家发出指令：立即生效，各指令有独立毫秒CD */
function cgIssueCommand(cmdId){
  const s = CG.battle;
  if(!s || s.over) return;
  const cmd = CG_COMMANDS.find(c => c.id === cmdId);
  if(!cmd) return;
  const now = performance.now();
  if((s.cmdCooldowns[cmdId]||0) > now) return;   // 还在CD中

  // 立即执行指令效果
  cmd.effect(s, now);

  // 设置时间戳CD
  s.cmdCooldowns[cmdId] = now + (cmd.cooldownMs || 5000);

  // 更新玩家指令状态栏
  const playerCmdEl = document.getElementById('cgPlayerLastCmd');
  if(playerCmdEl){
    playerCmdEl.textContent = `${cmd.icon}${cmd.name}`;
    playerCmdEl.style.animation = 'none';
    void playerCmdEl.offsetWidth;
    playerCmdEl.style.animation = 'cg-master-cmd-pulse 0.6s ease-out';
  }

  // 立即刷新该按钮进入CD状态
  const btn = document.getElementById(`cgCmdBtn_${cmdId}`);
  if(btn){
    btn.disabled = true;
    btn.classList.add('on-cd');
    const cdSec = Math.ceil((cmd.cooldownMs||5000)/1000);
    btn.innerHTML = `${cmd.icon} ${cmd.name}<span class="cg-cd-badge">${cdSec}s</span>`;
  }

  // 提示
  const hint = document.getElementById('cgCmdHint');
  if(hint) hint.innerHTML = `<span style="color:#ffe060">${cmd.icon} 指令已发出：${cmd.name}</span>`;

  // 场边指令动画特效
  const stage = document.getElementById('cgStage');
  if(stage){
    const badge = document.createElement('div');
    badge.className = 'cg-cmd-fx';
    badge.textContent = `${cmd.icon} ${cmd.name}`;
    stage.appendChild(badge);
    setTimeout(()=>badge.remove(), 1200);
  }

  cgPlaySfx('use_cmd');
}
window.cgIssueCommand = cgIssueCommand;

/* ════════════════════════════════════════
   十二、动画系统（即时战斗版）
   ════════════════════════════════════════ */
/**
 * cgAnimateAttack — 播放单次攻击动画
 * @param {object} s    战斗状态
 * @param {string} who  'player' | 'op'
 * @param {object} opts { dmgToTarget, isCrit, isShield, isStun, hasSkill, isDodge, isRebound, richLogs }
 */
function cgAnimateAttack(s, who, { dmgToTarget=0, isCrit=false, isShield=false, isStun=false,
                                    hasSkill=false, isDodge=false, isRebound=false, richLogs=[] }){
  const isPlayer   = who === 'player';
  const atkBreed   = isPlayer ? s.playerBreed : s.opBreed;
  const defBreed   = isPlayer ? s.opBreed     : s.playerBreed;
  const atkWrapId  = isPlayer ? 'cgPlayerWrap'   : 'cgOpWrap';
  const defWrapId  = isPlayer ? 'cgOpWrap'        : 'cgPlayerWrap';
  const atkArtId   = isPlayer ? 'cgPlayerArt'     : 'cgOpArt';
  const defArtId   = isPlayer ? 'cgOpArt'         : 'cgPlayerArt';
  const atkColor   = isPlayer ? '#70e090'          : s.opColor;
  const defColor   = isPlayer ? s.opColor          : '#70e090';
  const atkFighter = document.getElementById(isPlayer ? 'cgPlayerFighter' : 'cgOpFighter');
  const defFighter = document.getElementById(isPlayer ? 'cgOpFighter'     : 'cgPlayerFighter');
  const atkArt     = CRICKET_ART[atkBreed];
  const defArt     = CRICKET_ART[defBreed];
  const rushDir    = isPlayer ? 'cg-rush-r' : 'cg-rush-l';
  const defDir     = isPlayer ? 'cg-rush-l' : 'cg-rush-r';
  const kbDir      = isPlayer ? 'r' : 'l';

  // AI指令特效（从右侧飘出）
  const hasAiCmd = richLogs.some(l => l.type === 'ai-cmd');
  if(hasAiCmd){
    const stage = document.getElementById('cgStage');
    const aiCmdLog = richLogs.find(l => l.type === 'ai-cmd');
    if(stage && aiCmdLog){
      const badge = document.createElement('div');
      badge.className = 'cg-cmd-fx ai-cmd-fx';
      badge.textContent = aiCmdLog.txt.slice(0,22);
      stage.appendChild(badge);
      setTimeout(()=>badge.remove(), 1200);
    }
    cgPlaySfx('ai_cmd');
  }

  // 冲刺音效
  cgPlaySfx('rush');

  // 出招帧
  const atkFrames = hasSkill
    ? [atkArt.charge, atkArt.attack, atkArt.charge]
    : [atkArt.attack, atkArt.charge];
  cgAnimArt(atkArtId, atkBreed, atkFrames, atkColor, 120);
  cgAnimArt(defArtId, defBreed, [defArt.attack, defArt.charge, defArt.attack], defColor, 120);

  // 冲刺
  cgRushWrap(atkWrapId, rushDir, 480, s);
  cgRushWrap(defWrapId, defDir,  480, s);

  // 碰撞顶点
  setTimeout(()=>{
    if(isDodge){
      cgFloatDmg(defFighter, '💨闪避!', 'op');
      cgPlaySfx('shield');
      return;
    }

    cgImpact(isCrit, hasSkill);
    cgFlash(isCrit ? 'blue' : 'red');
    cgShakePanel(isCrit);
    if(hasSkill){
      cgPlaySfx(cgSkillSfx(atkBreed));
      const breed = CRICKET_BREEDS.find(b=>b.id===atkBreed);
      cgSkillBanner(isPlayer ? s.playerSkill : s.opSkill, breed?.color||'#fff');
    } else {
      cgPlaySfx(isCrit ? 'crit' : 'hit');
    }

    if(dmgToTarget > 0){
      cgAnimArt(defArtId, defBreed, [defArt.hurt, defArt.stand, defArt.hurt], defColor, 100);
      if(isCrit) cgBlinkCrit(defWrapId); else cgBlink(defWrapId);
      cgKnockback(defWrapId, kbDir);
      cgFloatDmg(defFighter, isCrit?`💥暴击 ${dmgToTarget}!`:`-${dmgToTarget}`, isCrit?'crit':'op');
      if(isCrit) cgFloatDmg(defFighter, 'CRIT!', 'crit');
      cgSparksBreed(defFighter, atkBreed, isCrit?14:8, isCrit);
      cgSparks(defFighter, isCrit?8:5, ['✦','★','◆','✸'], isCrit?'#ffe060':'#ff5030', isCrit);
      if(isCrit) cgShakePanel(true);
    }

    if(isShield){
      cgFloatDmg(atkFighter, '🛡️ 格挡', '');
      cgSparks(atkFighter, 5, ['◆','⬡','✦'], '#50c8ff');
      cgPlaySfx('shield');
    }

    // 反弹伤害
    if(isRebound && dmgToTarget > 0){
      const rebDmg = Math.floor(dmgToTarget * 0.3);
      cgFloatDmg(atkFighter, `↩️反弹 -${rebDmg}`, 'miss');
    }

    if(isStun){ cgFloatDmg(defFighter, '😵眩晕!', 'op'); cgPlaySfx('stun'); }
    if(richLogs.some(l=>l.txt && l.txt.includes('烧灼'))){ cgFloatDmg(defFighter, '🔥烧灼!', 'op'); }
    if(richLogs.some(l=>l.txt && l.txt.includes('减速'))){ cgFloatDmg(defFighter, '🧊减速!', 'op'); }
    if(s.opBurnEnd > performance.now() || s.playerBurnEnd > performance.now()) cgPlaySfx('burn');


  }, 168);
}

// 保留旧名兼容（cgRtTick 内部调用）
const cgAnimateRound = (s, opts) => cgAnimateAttack(s, opts.who || 'player', opts);



// cgRushWrap：冲刺class助手，含濒死状态恢复
function cgRushWrap(wrapId, cls, dur, s){
  const el = document.getElementById(wrapId);
  if(!el) return;
  el.classList.remove('cg-rush-r','cg-rush-l','cg-kb-r','cg-kb-l','cg-danger');
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(()=>{
    el.classList.remove(cls);
    if(s.playerHp / s.playerHpMax < 0.25 && wrapId==='cgPlayerWrap') el.classList.add('cg-danger');
    if(s.opHp / s.opHpMax < 0.25 && wrapId==='cgOpWrap') el.classList.add('cg-danger');
  }, dur);
}

/* ════════════════════════════════════════
   十三、入场仪式
   ════════════════════════════════════════ */
function cgPlayIntro(s){
  _cgAnimating = true;

  const pWrap = document.getElementById('cgPlayerWrap');
  const oWrap = document.getElementById('cgOpWrap');
  if(pWrap) pWrap.classList.add('cg-enter-l');
  if(oWrap) oWrap.classList.add('cg-enter-r');

  cgPlaySfx('intro');

  const stage = document.getElementById('cgStage');
  const overlay = document.createElement('div');
  overlay.className = 'cg-intro-overlay';
  overlay.id = 'cgIntroOverlay';
  overlay.innerHTML = `
    <div class="cg-intro-title">— 对 战 开 始 —</div>
    <div class="cg-intro-vs"><span style="color:#70e090">${s.playerName}</span>
      <span style="color:rgba(220,200,80,.6);font-size:16px"> VS </span>
      <span style="color:${s.opColor}">${s.opName}</span>
    </div>
    <div style="font-size:11px;color:rgba(200,180,100,.6);margin-top:8px">赔率 1:${s.odds.playerOdds} · 胜率约${Math.round(s.odds.trueWinRate*100)}%</div>`;
  if(stage){ stage.style.position='relative'; stage.appendChild(overlay); }

  const counts = [
    {t:0,   txt:'3', color:'#ffe060'},
    {t:600, txt:'2', color:'#ff9040'},
    {t:1200,txt:'1', color:'#ff5050'},
    {t:1800,txt:'开打！', color:'#80ff60'},
  ];
  counts.forEach(({t,txt,color})=>{
    setTimeout(()=>{
      const old = document.getElementById('cgCountdownEl');
      if(old) old.remove();
      const lbl = document.createElement('div');
      lbl.id = 'cgCountdownEl';
      lbl.className = 'cg-countdown-label';
      lbl.textContent = txt;
      lbl.style.color = color;
      lbl.style.textShadow = `0 0 20px ${color},0 0 40px ${color}`;
      if(stage) stage.appendChild(lbl);
      setTimeout(()=>lbl.remove(), 580);
      cgPlaySfx(txt==='开打！' ? 'fight' : 'rush');
    }, t);
  });

  setTimeout(()=>{
    const ov = document.getElementById('cgIntroOverlay');
    if(ov) ov.remove();
    if(pWrap) pWrap.classList.remove('cg-enter-l');
    if(oWrap) oWrap.classList.remove('cg-enter-r');
    _cgAnimating = false;
    // 入场结束后启动即时战斗
    cgStartRealTimeFight(s);
  }, 2400);
}

/* ════════════════════════════════════════
   十四、音效系统
   ════════════════════════════════════════ */
let _cgActx = null;
let _cgAudioSessionId = 0;
const _cgAudioTimers = new Set();

function cgScheduleAudio(fn, delay = 0){
  const sessionId = _cgAudioSessionId;
  const timerId = setTimeout(() => {
    _cgAudioTimers.delete(timerId);
    if(sessionId !== _cgAudioSessionId) return;
    try{ fn(); }catch(e){}
  }, delay);
  _cgAudioTimers.add(timerId);
  return timerId;
}

function cgClearAudioTimers(){
  _cgAudioTimers.forEach(timerId => clearTimeout(timerId));
  _cgAudioTimers.clear();
}

function cgGetACtx(){
  if(!_cgActx) _cgActx = new(window.AudioContext||window.webkitAudioContext)();
  if(_cgActx.state === 'suspended') _cgActx.resume();
  return _cgActx;
}
function cleanupCricketAudio(){
  _cgAudioSessionId++;
  cgClearAudioTimers();
  try{
    if(typeof CG !== 'undefined' && CG && CG.battle && CG.battle.rtRafId) cancelAnimationFrame(CG.battle.rtRafId);
    if(_cgActx && _cgActx.state !== 'closed') _cgActx.close();
  }catch(e){}
  _cgActx = null;
}


window.cleanupCricketAudio = cleanupCricketAudio;
window.addEventListener('pagehide', cleanupCricketAudio);
window.addEventListener('beforeunload', cleanupCricketAudio);

function cgTone(opts){

  try{
    const ctx = cgGetACtx();
    const g = ctx.createGain();
    g.connect(ctx.destination);
    g.gain.setValueAtTime(opts.vol||.35, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + (opts.dur||.3));
    const o = ctx.createOscillator();
    o.type = opts.type||'sine';
    o.frequency.setValueAtTime(opts.freq||440, ctx.currentTime);
    if(opts.freqEnd) o.frequency.exponentialRampToValueAtTime(opts.freqEnd, ctx.currentTime+(opts.ramp||opts.dur||.2));
    o.connect(g);
    o.start(ctx.currentTime + (opts.delay||0));
    o.stop(ctx.currentTime + (opts.delay||0) + (opts.dur||.3));
  }catch(e){}
}

function cgNoiseBurst(dur=.08, vol=.25){
  try{
    const ctx = cgGetACtx();
    const buf = ctx.createBuffer(1, ctx.sampleRate*dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+dur);
    src.connect(g); g.connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime+dur);
  }catch(e){}
}

function cgPlaySfx(type){
  try{
    switch(type){
      case 'intro':
        for(let i=0;i<3;i++){
          cgScheduleAudio(()=>{ cgNoiseBurst(.12,.4); cgTone({type:'square',freq:80,freqEnd:40,dur:.14,vol:.3}); }, i*220);
        }
        break;
      case 'fight':
        cgTone({type:'square',freq:880,freqEnd:1200,dur:.1,vol:.3});
        cgScheduleAudio(()=>cgTone({type:'square',freq:1200,freqEnd:1600,dur:.12,vol:.35}), 120);
        cgScheduleAudio(()=>cgTone({type:'sine',freq:2000,freqEnd:1000,dur:.2,vol:.25}), 250);
        break;
      case 'rush':
        cgTone({type:'sawtooth',freq:200,freqEnd:400,dur:.18,vol:.15});
        break;
      case 'hit':
        cgNoiseBurst(.05,.3);
        cgTone({type:'square',freq:300,freqEnd:100,dur:.1,vol:.25});
        break;
      case 'crit':
        cgNoiseBurst(.07,.45);
        cgTone({type:'sawtooth',freq:500,freqEnd:120,dur:.15,vol:.4});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:1200,freqEnd:400,dur:.12,vol:.2}), 50);
        break;
      case 'skill_fire':
        cgNoiseBurst(.1,.3);
        cgTone({type:'sawtooth',freq:180,freqEnd:80,dur:.25,vol:.35});
        cgScheduleAudio(()=>cgTone({type:'sawtooth',freq:300,freqEnd:100,dur:.15,vol:.2}), 80);
        break;
      case 'skill_ice':
        cgTone({type:'sine',freq:1800,freqEnd:2400,dur:.08,vol:.2});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:2400,freqEnd:1000,dur:.15,vol:.25}), 80);
        cgScheduleAudio(()=>{ cgTone({type:'sine',freq:2200,freqEnd:800,dur:.12,vol:.2}); cgNoiseBurst(.05,.15); }, 180);
        break;
      case 'skill_shadow':
        cgTone({type:'sine',freq:80,freqEnd:40,dur:.3,vol:.2});
        cgScheduleAudio(()=>cgNoiseBurst(.04,.3), 80);
        break;
      case 'skill_bell':
        cgTone({type:'sine',freq:1200,freqEnd:600,dur:.5,vol:.3});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:800,freqEnd:400,dur:.4,vol:.2}), 100);
        cgScheduleAudio(()=>cgTone({type:'sine',freq:600,freqEnd:300,dur:.35,vol:.15}), 200);
        break;
      case 'skill_chaos':
        cgTone({type:'sine',freq:200,freqEnd:800,dur:.2,vol:.2});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:800,freqEnd:200,dur:.2,vol:.2}), 180);
        cgScheduleAudio(()=>cgTone({type:'square',freq:440,freqEnd:880,dur:.15,vol:.25}), 380);
        break;
      // 神兽级专属音效
      case 'skill_sea':    // 龙啸沧海
        cgTone({type:'sawtooth',freq:150,freqEnd:600,dur:.3,vol:.25});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:400,freqEnd:800,dur:.25,vol:.2}), 200);
        cgScheduleAudio(()=>cgNoiseBurst(.08,.3), 400);
        break;
      case 'skill_wuzang': // 天葬轮回
        cgTone({type:'square',freq:80,freqEnd:1000,dur:.3,vol:.3});
        cgScheduleAudio(()=>cgTone({type:'sawtooth',freq:600,freqEnd:100,dur:.25,vol:.2}), 280);
        break;
      case 'skill_ice':    // 万里冰封
        cgTone({type:'sine',freq:2000,freqEnd:100,freqDecay:.85,dur:.4,vol:.3});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:1500,freqEnd:80,dur:.35,vol:.2}), 300);
        cgScheduleAudio(()=>cgNoiseBurst(.06,.2), 500);
        break;
      case 'skill_desert': // 沙暴吞天
        cgNoiseBurst(.2,.4);
        cgTone({type:'sawtooth',freq:100,freqEnd:300,dur:.2,vol:.25});
        cgScheduleAudio(()=>cgTone({type:'square',freq:300,freqEnd:100,dur:.2,vol:.25}), 180);
        cgScheduleAudio(()=>cgNoiseBurst(.1,.3), 350);
        break;
      case 'skill_fortress':// 雷霆万钧
        cgTone({type:'square',freq:60,freqEnd:60,dur:.1,vol:.5});
        cgScheduleAudio(()=>cgTone({type:'square',freq:80,freqEnd:80,dur:.08,vol:.5}), 100);
        cgScheduleAudio(()=>cgTone({type:'square',freq:120,freqEnd:120,dur:.05,vol:.6}), 180);
        cgScheduleAudio(()=>cgTone({type:'square',freq:200,freqEnd:200,dur:.15,vol:.4}), 220);
        cgScheduleAudio(()=>cgTone({type:'sawtooth',freq:400,freqEnd:100,dur:.3,vol:.3}), 280);
        break;
      case 'skill_blood':  // 血咒锁魂
        cgTone({type:'sawtooth',freq:80,freqEnd:200,freqDecay:.8,dur:.25,vol:.3});
        cgScheduleAudio(()=>cgTone({type:'square',freq:200,freqEnd:80,dur:.2,vol:.25}), 220);
        cgScheduleAudio(()=>cgTone({type:'sine',freq:300,freqEnd:50,dur:.3,vol:.15}), 400);
        break;
      case 'skill_generic':
        cgTone({type:'square',freq:400,freqEnd:200,dur:.15,vol:.3});
        cgNoiseBurst(.06,.2);
        break;
      case 'shield':
        cgTone({type:'sine',freq:800,freqEnd:1200,dur:.18,vol:.2});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:1200,freqEnd:600,dur:.2,vol:.15}), 100);
        break;
      case 'stun':
        for(let i=0;i<4;i++) cgScheduleAudio(()=>cgTone({type:'sine',freq:600+i*80,dur:.06,vol:.12}), i*70);
        break;
      case 'burn':
        cgNoiseBurst(.04,.12);
        cgTone({type:'sawtooth',freq:200,freqEnd:100,dur:.08,vol:.12});
        break;
      case 'danger':
        cgTone({type:'sine',freq:60,freqEnd:40,dur:.15,vol:.2});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:50,freqEnd:30,dur:.12,vol:.15}), 160);
        break;
      case 'ko':
        cgNoiseBurst(.15,.5);
        cgTone({type:'square',freq:100,freqEnd:20,dur:.3,vol:.4});
        cgScheduleAudio(()=>cgNoiseBurst(.08,.3), 120);
        break;
      case 'victory':
        [523,659,784,1047,1318].forEach((f,i)=>cgScheduleAudio(()=>cgTone({type:'sine',freq:f,dur:.18,vol:.25}), i*110));
        break;
      case 'defeat':
        [440,370,330,220].forEach((f,i)=>cgScheduleAudio(()=>cgTone({type:'sine',freq:f,dur:.22,vol:.2}), i*130));
        break;
      case 'levelup':
        [523,784,1047,1047,784,1047,1318].forEach((f,i)=>cgScheduleAudio(()=>cgTone({type:'sine',freq:f,dur:.15,vol:.25}), i*90));
        break;
      case 'flee':
        cgTone({type:'sawtooth',freq:200,freqEnd:80,dur:.25,vol:.2});
        break;
      // 新：指令发出音效（清脆两声）
      case 'use_cmd':
        cgTone({type:'sine',freq:900,dur:.08,vol:.18});
        cgScheduleAudio(()=>cgTone({type:'sine',freq:1200,dur:.1,vol:.2}), 80);
        break;
      // AI指令音效（低沉两声，与玩家区分）
      case 'ai_cmd':
        cgTone({type:'triangle',freq:400,dur:.1,vol:.15});
        cgScheduleAudio(()=>cgTone({type:'triangle',freq:300,dur:.12,vol:.18}), 90);
        break;
    }
  }catch(e){}
}

function cgSkillSfx(breedId){
  const m = {
    fire_ant:'skill_fire', ice_mandis:'skill_ice', shadow_blade:'skill_shadow',
    golden_bell:'skill_bell', chaos_king:'skill_chaos',
    south_sea_dragon:'skill_sea', wuzang_demon:'skill_wuzang',
    ice_king:'skill_ice_king', desert_god:'skill_desert',
    fortress_overlord:'skill_fortress', blood_bone_king:'skill_blood',
  };
  return m[breedId] || 'skill_generic';
}

/* ════════════════════════════════════════
   十五、动态效果系统
   ════════════════════════════════════════ */
let _cgAnimating = false;

function cgShakePanel(big=false){
  const p = document.getElementById('cricketPanelInner');
  if(!p) return;
  p.classList.remove('cg-panel-shake','cg-panel-shake-big');
  void p.offsetWidth;
  p.classList.add(big ? 'cg-panel-shake-big' : 'cg-panel-shake');
}

function cgFlash(type='red'){
  const el = document.getElementById(type==='red'?'cgFlashRed':'cgFlashBlue');
  if(!el) return;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
}

function cgBlink(wrapId){
  const el = document.getElementById(wrapId);
  if(!el) return;
  el.classList.remove('cg-blink'); void el.offsetWidth;
  el.classList.add('cg-blink');
  setTimeout(()=>el.classList.remove('cg-blink'), 300);
}

function cgKnockback(wrapId, dir){
  const el = document.getElementById(wrapId);
  if(!el) return;
  el.classList.remove('cg-kb-r','cg-kb-l'); void el.offsetWidth;
  el.classList.add(dir==='r'?'cg-kb-r':'cg-kb-l');
  setTimeout(()=>el.classList.remove('cg-kb-r','cg-kb-l'), 360);
}

function cgFloatDmg(fighterEl, text, cls=''){
  if(!fighterEl) return;
  const d = document.createElement('div');
  d.className = 'cg-dmg-float ' + cls;
  d.textContent = text;
  d.style.left = (20 + Math.random()*50) + '%';
  d.style.top  = (15 + Math.random()*20) + '%';
  fighterEl.style.position = 'relative';
  fighterEl.appendChild(d);
  setTimeout(()=>d.remove(), 950);
}

function cgSparks(fighterEl, n=6, syms=['✦','★','◆','✸'], color='#ffe060', big=false){
  if(!fighterEl) return;
  for(let i=0;i<n;i++){
    const s = document.createElement('div');
    s.className = 'cg-spark' + (big?' big':'');
    s.textContent = syms[Math.floor(Math.random()*syms.length)];
    s.style.color = color;
    s.style.left = (5 + Math.random()*90) + '%';
    s.style.top  = (5 + Math.random()*80) + '%';
    const angle = Math.random()*Math.PI*2;
    const dist  = (big?30:20) + Math.random()*(big?60:40);
    s.style.setProperty('--sx', Math.cos(angle)*dist+'px');
    s.style.setProperty('--sy', Math.sin(angle)*dist+'px');
    s.style.animationDuration = (0.4+Math.random()*0.4)+'s';
    fighterEl.style.position = 'relative';
    fighterEl.appendChild(s);
    setTimeout(()=>s.remove(), 800);
  }
}

const CG_BREED_SPARKS = {
  iron_head:   { syms:['🔩','◆','◈','▲','★'],  color:'#c8b860' },
  blue_wings:  { syms:['～','◆','✦','≋','⬡'],  color:'#60c8e8' },
  fire_ant:    { syms:['🔥','★','✸','▲','◆'],  color:'#ff6030' },
  jade_knight: { syms:['◆','⬡','✦','◈','▣'],  color:'#50e890' },
  shadow_blade:{ syms:['💀','◆','⬡','●','✦'],  color:'#9060e0' },
  golden_bell: { syms:['✦','★','◆','✸','⬟'],  color:'#e0c020' },
  ice_mandis:  { syms:['❄','✦','◆','❅','⬡'],  color:'#a0d8f0' },
  chaos_king:  { syms:['⚡','★','✦','◆','✸'],  color:'#d040d0' },
  // 神兽级
  south_sea_dragon: { syms:['🌊','⚡','◆','✦','☼'],  color:'#006994' },
  wuzang_demon:     { syms:['☠','★','✦','◆','⚰'],  color:'#cc0055' },
  ice_king:         { syms:['❄','⚡','◆','✦','❅'],  color:'#00bcd4' },
  desert_god:       { syms:['⚡','★','✦','◆','✸'],  color:'#d4a017' },
  fortress_overlord:{ syms:['⚡','★','✦','◆','☼'],  color:'#cc6600' },
  blood_bone_king:  { syms:['☠','★','✦','◆','🩸'], color:'#cc0000' },
};
function cgSparksBreed(fighterEl, breedId, n=8, big=false){
  const d = CG_BREED_SPARKS[breedId] || { syms:['✦','★','◆'], color:'#ffe060' };
  cgSparks(fighterEl, n, d.syms, d.color, big);
}

function cgImpact(isCrit=false, isHeavy=false){
  const stage = document.getElementById('cgStage');
  if(!stage) return;
  const ring = document.createElement('div');
  ring.className = 'cg-impact-ring' + (isCrit?' crit':(isHeavy?' big':''));
  stage.appendChild(ring);
  setTimeout(()=>ring.remove(), 600);
  setTimeout(()=>{
    const r2 = document.createElement('div');
    r2.className = 'cg-impact-ring2';
    stage.appendChild(r2);
    setTimeout(()=>r2.remove(), 400);
  }, 60);
  const gw = document.createElement('div');
  gw.className = 'cg-ground-wave';
  stage.appendChild(gw);
  setTimeout(()=>gw.remove(), 400);
  stage.classList.remove('cg-stage-thud','cg-stage-thud-big','cg-crit-flash');
  void stage.offsetWidth;
  stage.classList.add(isCrit?'cg-crit-flash':(isHeavy?'cg-stage-thud-big':'cg-stage-thud'));
  setTimeout(()=>stage.classList.remove('cg-stage-thud','cg-stage-thud-big','cg-crit-flash'), 550);
}

function cgBlinkCrit(wrapId){
  const el = document.getElementById(wrapId);
  if(!el) return;
  el.classList.remove('cg-blink','cg-blink-crit'); void el.offsetWidth;
  el.classList.add('cg-blink-crit');
  setTimeout(()=>el.classList.remove('cg-blink-crit'), 400);
}

function cgSkillBanner(text, color){
  const stage = document.getElementById('cgStage');
  if(!stage) return;
  const b = document.createElement('div');
  b.className = 'cg-skill-banner';
  b.textContent = text;
  b.style.color = color;
  b.style.textShadow = `0 0 12px ${color}, 0 0 24px ${color}`;
  stage.appendChild(b);
  setTimeout(()=>b.remove(), 900);
}

function cgAnimArt(artElId, breedId, frames, color, dur=120, onDone){
  const el = document.getElementById(artElId);
  if(!el) return;
  const origColor = el.style.color;
  let i = 0;
  const t = setInterval(()=>{
    if(i >= frames.length * 2){
      clearInterval(t);
      el.style.color = origColor;
      el.textContent = cgArtPre(breedId, 'stand');
      if(onDone) onDone();
      return;
    }
    el.textContent = frames[i % frames.length].join('\n');
    if(color) el.style.color = color;
    i++;
  }, dur);
}

function cgArtPre(breedId, frame){
  const art = CRICKET_ART[breedId] ? CRICKET_ART[breedId][frame] : ['  ??  ','  ??  ','  ??  '];
  return art.join('\n');
}

function cgUpdateDangerState(s){
  const pw = document.getElementById('cgPlayerWrap');
  const ow = document.getElementById('cgOpWrap');
  if(pw){
    if(s.playerHp/s.playerHpMax<0.25) pw.classList.add('cg-danger');
    else pw.classList.remove('cg-danger');
  }
  if(ow){
    if(s.opHp/s.opHpMax<0.25) ow.classList.add('cg-danger');
    else ow.classList.remove('cg-danger');
  }
}

/* ════════════════════════════════════════
   十六、UI更新函数（即时战斗版）
   ════════════════════════════════════════ */
function cgUpdateBattleUI(s){
  if(!s) s = CG.battle;
  if(!s) return;
  const now = performance.now();

  const pPct = Math.max(0, s.playerHp/s.playerHpMax*100);
  const oPct = Math.max(0, s.opHp/s.opHpMax*100);
  const phb = document.getElementById('cgPlayerHpBar');
  const ohb = document.getElementById('cgOpHpBar');
  if(phb){ phb.style.width=pPct+'%'; phb.style.background=pPct>50?'#50c870':pPct>25?'#d0a020':'#e03030'; }
  if(ohb){ ohb.style.width=oPct+'%'; ohb.style.background=oPct>50?'#c04040':oPct>25?'#c06020':'#e03030'; }
  const phn = document.getElementById('cgPlayerHpNum');
  const ohn = document.getElementById('cgOpHpNum');
  if(phn) phn.textContent = s.playerHp;
  if(ohn) ohn.textContent = s.opHp;

  // ── 体力条实时更新 ──
  const pStBar = document.getElementById('cgPlayerStaminaBar');
  const pStNum = document.getElementById('cgPlayerStaminaNum');
  if(pStBar && s.playerStaminaMax > 0){
    const stPct   = Math.max(0, s.playerStamina / s.playerStaminaMax * 100);
    const stColor = stPct > 50 ? '#60d080' : stPct > 25 ? '#d0a020' : '#e05050';
    pStBar.style.width      = stPct + '%';
    pStBar.style.background = stColor;
    if(pStNum) pStNum.textContent = `${Math.round(s.playerStamina)}/${s.playerStaminaMax}`;
  }

  // 行动计数（替代回合）
  const rn = document.getElementById('cgRoundNum');
  if(rn) rn.textContent = `⚡ 第 ${s.actionCount||0} 击`;

  // 实时赔率更新
  const liveOddsEl = document.getElementById('cgLiveOdds');
  if(liveOddsEl){
    const liveWin = (s.playerHp / s.playerHpMax) / ((s.playerHp/s.playerHpMax) + (s.opHp/s.opHpMax));
    const liveOdds = Math.round((1 / Math.max(0.05, liveWin * 0.92)) * 10) / 10;
    liveOddsEl.textContent = `1:${liveOdds}`;
    liveOddsEl.style.color = liveWin > 0.6 ? '#70e090' : liveWin < 0.4 ? '#e07060' : '#ffe060';
  }

  // 状态栏（时间戳版）
  const ps = document.getElementById('cgPlayerStatus');
  const os = document.getElementById('cgOpStatus');
  if(ps) ps.innerHTML = [
    s.playerStunned                     ? '<span style="color:#ffe060">😵眩晕</span>' : '',
    (s.playerBurnEnd||0) > now          ? '<span style="color:#ff6030">🔥灼烧</span>' : '',
    s.playerShield                      ? '<span style="color:#60c8ff">🛡️护盾</span>' : '',
    (s.playerCheerBoostEnd||0) > now    ? '<span style="color:#ffa040">📣亢奋</span>' : '',
    (s.playerDistractEnd||0) > now      ? '<span style="color:#c0a060">🪘干扰</span>' : '',
    (s.playerTauntedEnd||0) > now       ? '<span style="color:#ff8060">😡激怒</span>' : '',
    (s.playerPressureEnd||0) > now      ? '<span style="color:#b0b0e0">🗣️压制</span>' : '',
    s.playerRageActivated               ? `<span style="color:#ff4040">🔥暴走</span>` : '',
    s.playerBerserkStack > 0            ? `<span style="color:#ff6020">⚔️×${s.playerBerserkStack}</span>` : '',
  ].filter(Boolean).join(' ');
  if(os) os.innerHTML = [
    s.opStunned                         ? '<span style="color:#ffe060">😵眩晕</span>' : '',
    (s.opBurnEnd||0) > now              ? '<span style="color:#ff6030">🔥灼烧</span>' : '',
    (s.opCritBoostEnd||0) > now         ? '<span style="color:#ff9060">🔥亢奋</span>' : '',
    (s.opRoarBoostEnd||0) > now         ? '<span style="color:#ffa040">📣助威</span>' : '',
    (s.opTauntedEnd||0) > now           ? '<span style="color:#ffa0a0">😡自损</span>' : '',
    s.opRageActivated                   ? `<span style="color:#ff4040">🔥暴走</span>` : '',
    s.opBerserkStack > 0                ? `<span style="color:#ff6020">⚔️×${s.opBerserkStack}</span>` : '',
  ].filter(Boolean).join(' ');

  // 更新主人指令状态栏（AI端）
  const opCmdEl = document.getElementById('cgOpLastCmd');
  if(opCmdEl && s.lastAiCmd){
    opCmdEl.textContent = `${s.lastAiCmd.icon}${s.lastAiCmd.name}`;
    opCmdEl.style.animation = 'none';
    void opCmdEl.offsetWidth;
    opCmdEl.style.animation = 'cg-master-cmd-pulse 0.6s ease-out';
    s.lastAiCmd = null; // 避免重复闪烁
  }
}

/* ════════════════════════════════════════
   十七、结果展示
   ════════════════════════════════════════ */
function cgShowResult(){
  const s = CG.battle;
  const won = s.winner==='player';

  // ── 成就系统触发 ──
  if(won && typeof achOnCricketWin === 'function') achOnCricketWin(s.odds && s.odds.trueWinRate);

  // ── 任务钩子：斗蛐蛐胜利，检查蛐蛐类任务进度 ──
  if(typeof onCricketQuestCheck === 'function') onCricketQuestCheck(won);

  const pArt = CRICKET_ART[s.playerBreed];
  const oArt = CRICKET_ART[s.opBreed];

  const playerArtEl = document.getElementById('cgPlayerArt');
  const opArtEl     = document.getElementById('cgOpArt');
  if(playerArtEl) playerArtEl.textContent = cgArtPre(s.playerBreed, won?'attack':'ko');
  if(opArtEl)     opArtEl.textContent     = cgArtPre(s.opBreed,     won?'ko':'attack');

  const pFighter = document.getElementById('cgPlayerFighter');
  const opFighter = document.getElementById('cgOpFighter');
  if(won){
    cgFlash('blue');
    cgPlaySfx('victory');
    cgSparks(pFighter, 14, ['🏆','✦','★','◆','✸'], '#ffe060');
    cgSparks(opFighter, 8, ['💀','✦','◆'], '#888');
    // 冷门奖励提示
    if(s.odds.trueWinRate < 0.35){
      setTimeout(()=>{
        const stage = document.getElementById('cgStage');
        if(stage){
          const banner = document.createElement('div');
          banner.className = 'cg-skill-banner';
          banner.textContent = '🎊 冷门爆冷！';
          banner.style.color = '#ffd700';
          banner.style.textShadow = '0 0 20px #ffd700';
          banner.style.fontSize = '22px';
          stage.appendChild(banner);
          setTimeout(()=>banner.remove(), 2000);
        }
      }, 300);
    }
  } else {
    cgFlash('red');
    cgShakePanel(true);
    cgPlaySfx('defeat');
    cgSparks(opFighter, 12, ['🏆','✦','★'], s.opColor);
  }

  const logEl = document.getElementById('cgBattleLog');
  if(logEl){
    const result = document.createElement('div');
    result.className = 'cg-log-result';

    const penalty   = s.betPenalty   || 0;
    const opPenalty = s.opBetPenalty || 0;

    if(won){
      const baseEarn = Math.floor(s.bet * s.odds.playerOdds);
      const netEarn  = baseEarn - penalty + opPenalty;
      const coldBonus = (s.odds.trueWinRate < 0.35) ? Math.floor(s.bet * 0.5) : 0;

      let html = `<b style="color:#ffe060;font-size:15px">🏆 大获全胜！</b><br>`;
      html += `<span style="color:#aaffaa">下注 ${s.bet} 两 × 赔率 ${s.odds.playerOdds} = <b>${baseEarn} 两</b></span>`;
      if(penalty > 0)
        html += `<br><span style="color:#ff8888">⚠️ 你的违规罚款 -${penalty} 两</span>`;
      if(opPenalty > 0)
        html += `<br><span style="color:#88ffcc">⚖️ 对方违规赔偿 +${opPenalty} 两</span>`;
      if(coldBonus > 0)
        html += `<br><span style="color:#ffd700">🎊 冷门爆冷！额外 +${coldBonus} 两</span>`;
      html += `<br><b style="color:#ffe060;font-size:14px">实得：${netEarn + coldBonus} 两白银</b>`;
      result.innerHTML = html;
    } else {
      const netLoss = s.bet + penalty - opPenalty;
      let html = `<b style="color:#e06060;font-size:15px">💀 败北了……</b><br>`;
      html += `<span style="color:#ffaaaa">损失下注 ${s.bet} 两</span>`;
      if(penalty > 0)
        html += `<br><span style="color:#ff8888">⚠️ 违规罚款 ${penalty} 两</span>`;
      if(opPenalty > 0)
        html += `<br><span style="color:#88ffcc">⚖️ 对方违规赔偿抵扣 ${opPenalty} 两</span>`;
      html += `<br><b style="color:#e08080">实际损失：${Math.max(0, netLoss)} 两</b>`;
      result.innerHTML = html;
    }

    // 追加赔率标签
    const oddsTag = s.odds.oddsLabel || '';
    const actCount = s.actionCount || 0;
    if(oddsTag){
      const tag = document.createElement('div');
      tag.style.cssText = 'margin-top:4px;font-size:10px;opacity:.7;color:#c0c0a0';
      tag.textContent = `本场赔率：${oddsTag} | 胜率约${Math.round((s.odds.trueWinRate||0.5)*100)}% | 共出手${actCount}次`;
      result.appendChild(tag);
    }

    logEl.appendChild(result);
    logEl.scrollTop = logEl.scrollHeight;
  }

  // 隐藏指令面板
  const cmdPanel = document.getElementById('cgCmdPanel');
  if(cmdPanel) cmdPanel.style.display = 'none';

  setTimeout(()=>{
    const btns = document.getElementById('cgActionBtns') || (()=>{
      const d = document.createElement('div');
      d.id = 'cgActionBtns';
      d.className = 'cg-action-btns';
      const battleScene = document.querySelector('.cg-battle-scene');
      if(battleScene) battleScene.appendChild(d);
      return d;
    })();

    // 判断双方体力是否允许再战（任一方≤30%则禁止）
    const pStRatio = s.playerStamina / Math.max(1, s.playerStaminaMax);
    const oStRatio = (s.opponentRef._lastBattleStamina || 0) / Math.max(1, s.opponentRef._lastBattleStaminaMax || 1);
    const playerTooTired = pStRatio <= 0.30;
    const opTooTired     = oStRatio <= 0.30;
    const canRematch     = !playerTooTired && !opTooTired;

    let rematchTip = '';
    if(playerTooTired && opTooTired){
      rematchTip = `双方体力不支，无法继续`;
    } else if(playerTooTired){
      rematchTip = `你的蛐蛐身负重伤，需要休息`;
    } else if(opTooTired){
      rematchTip = `对方蛐蛐已力竭，无法应战`;
    }

    const rematchHtml = canRematch
      ? `<button class="cg-btn-fight" onclick="cgOpenBetPanel(${CRICKET_OPPONENTS.indexOf(s.opponentRef)})">⚔️ 再战一场</button>`
      : `<button class="cg-btn-fight" disabled title="${rematchTip}" style="opacity:.45;cursor:not-allowed">⚔️ 再战一场<br><span style="font-size:9px;color:#ff9090">${rematchTip}</span></button>`;

    btns.innerHTML = `
<button class="cg-btn-cancel" onclick="cgRenderMain()">← 返回大厅</button>
${rematchHtml}`;
    btns.style.display = 'flex';
  }, 700);
}

/* 认负（提前结束） */
function cgFlee(){
  const s = CG.battle;
  if(!s || s.over) return;
  // 停止即时战斗 rAF 循环
  if(s.rtRafId) cancelAnimationFrame(s.rtRafId);
  s.rtRunning = false;
  s.over = true;
  s.winner = 'opponent';
  const halfBet = Math.floor(s.bet * 0.5);
  spendSilver(halfBet, '斗蛐蛐中途认负');
  cgPushLog(s, `🏃 认负逃跑，损失 ${halfBet} 两（半注）`, 'event');
  CG.stats.losses++;
  CG.stats.lossStreak = (CG.stats.lossStreak||0)+1;
  CG.stats.winStreak  = 0;
  cgSave();
  cgUpdateBattleUI(s);
  cgShowResult();
}

/* ════════════════════════════════════════
   十八、工具函数
   ════════════════════════════════════════ */
// 银两函数：优先使用 SilverManager / 全局函数，仅在未定义时提供降级方案
// 注意：不再覆盖 game-flow.js 中 SilverManager 已定义的全局函数
if (typeof window.getSilver !== 'function') {
  window.getSilver = function getSilver(){
    if(typeof SilverManager !== 'undefined'){
      return SilverManager.get();
    }
    if(typeof travelPlayerState !== 'undefined' && travelPlayerState.silver !== undefined){
      return travelPlayerState.silver;
    }
    if(typeof edS !== 'undefined' && edS.silver !== undefined){
      return edS.silver;
    }
    return 200;
  };
}
if (typeof window.addSilver !== 'function') {
  window.addSilver = function addSilver(amount, reason){
    if(typeof SilverManager !== 'undefined'){
      SilverManager.add(amount);
      SilverManager.save();
    } else if(typeof travelPlayerState !== 'undefined'){
      travelPlayerState.silver = (travelPlayerState.silver || 0) + amount;
    }
    if(typeof showToast==='function') showToast(`💰 +${amount} 两（${reason}）`);
    const silvEl=document.getElementById('travelSilver');
    if(silvEl) silvEl.textContent=window.getSilver()+'两';
  };
}
if (typeof window.spendSilver !== 'function') {
  window.spendSilver = function spendSilver(amount, reason){
    let ok = true;
    if(typeof SilverManager !== 'undefined'){
      ok = SilverManager.spend(amount);
      SilverManager.save();
    } else if(typeof travelPlayerState !== 'undefined'){
      if((travelPlayerState.silver || 0) < amount) ok = false;
      else travelPlayerState.silver = Math.max(0, (travelPlayerState.silver || 0) - amount);
    }
    const silvEl=document.getElementById('travelSilver');
    if(silvEl) silvEl.textContent = (typeof SilverManager !== 'undefined' ? SilverManager.get() : window.getSilver()) + '两';
    return ok;
  };
}

/* ════════════════════════════════════════
   十九、CSS补丁（指令面板样式注入）
   ════════════════════════════════════════ */
(function injectCricketCssPatch(){
  const style = document.createElement('style');
  style.textContent = `
/* ── ATB 行动条 ── */
.cg-atb-bar-wrap {
  height: 4px;
  background: rgba(40,40,60,.6);
  border-radius: 2px;
  margin-top: 3px;
  overflow: hidden;
  position: relative;
}
.cg-atb-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #4080ff, #60e0ff);
  border-radius: 2px;
  transition: width .05s linear;
}
.cg-atb-fill.op {
  background: linear-gradient(90deg, #e04040, #ff8840);
}
/* ATB 高亮阶段渐变色（由 cgUpdateAtbBars 动态设置 inline style） */

/* ── 性格标签 ── */
.cg-pers-tag {
  display: inline-block;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(60,60,100,.6);
  border: 1px solid rgba(120,120,180,.3);
  color: rgba(200,190,255,.8);
  margin-left: 4px;
  vertical-align: middle;
  cursor: default;
}
.cg-pers-tag.op {
  background: rgba(100,40,40,.6);
  border-color: rgba(200,100,80,.3);
  color: rgba(255,190,170,.8);
}
.cg-pers-mini {
  font-size: 9px;
  padding: 0 3px;
  border-radius: 2px;
  background: rgba(60,60,100,.5);
  color: rgba(200,190,255,.7);
  vertical-align: middle;
}

/* ── 体力条 ── */
.cg-stamina-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
}
.cg-stamina-label {
  font-size: 9px;
  color: rgba(160,220,160,.7);
  flex-shrink: 0;
}
.cg-stamina-bar-wrap {
  flex: 1;
  height: 5px;
  background: rgba(30,50,30,.7);
  border-radius: 3px;
  overflow: hidden;
  min-width: 40px;
}
.cg-stamina-bar {
  height: 100%;
  border-radius: 3px;
  transition: width .4s ease, background .3s;
}
.cg-stamina-val {
  font-size: 9px;
  color: rgba(180,200,180,.7);
  white-space: nowrap;
}
.cg-battle-stamina {
  margin-top: 2px;
}
.cg-rest-btn {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(40,80,40,.8);
  border: 1px solid rgba(80,160,80,.5);
  color: rgba(160,220,160,.9);
  cursor: pointer;
  flex-shrink: 0;
}
.cg-rest-btn:hover { background: rgba(60,110,60,.9); }

/* 指令面板 */
.cg-cmd-panel {
  background: rgba(10,20,10,.85);
  border: 1px solid rgba(80,160,80,.3);
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 6px;
}
.cg-cmd-title {
  color: rgba(160,220,160,.8);
  font-size: 12px;
  margin-bottom: 6px;
  text-align: center;
  letter-spacing: 1px;
}
.cg-cmd-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-bottom: 5px;
}
.cg-cmd-btn {
  background: rgba(20,50,20,.8);
  border: 1px solid rgba(80,160,80,.4);
  border-radius: 5px;
  color: rgba(160,220,160,.9);
  font-size: 10px;
  padding: 5px 3px;
  cursor: pointer;
  transition: all .15s;
  text-align: center;
  line-height: 1.4;
}
.cg-cmd-btn:hover:not(:disabled) {
  background: rgba(40,100,40,.9);
  border-color: rgba(80,200,80,.7);
  transform: translateY(-1px);
}
.cg-cmd-btn:disabled, .cg-cmd-btn.on-cd, .cg-cmd-btn.used {
  opacity: .4;
  cursor: not-allowed;
  transform: none;
}
.cg-cmd-btn.on-cd { border-color: rgba(200,150,40,.3); color: rgba(200,150,80,.5); }
.cg-cmd-hint {
  font-size: 10px;
  color: rgba(180,180,100,.6);
  text-align: center;
}
/* 指令特效横幅 */
.cg-cmd-fx {
  position: absolute;
  top: 8px; left: 50%;
  transform: translateX(-50%);
  background: rgba(255,210,60,.15);
  border: 1px solid rgba(255,210,60,.4);
  border-radius: 4px;
  color: #ffd060;
  font-size: 11px;
  padding: 3px 10px;
  pointer-events: none;
  z-index: 100;
  animation: cg-cmd-fx-anim 1.2s ease-out both;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}
@keyframes cg-cmd-fx-anim {
  0%   { opacity:0; transform:translateX(-50%) translateY(4px); }
  20%  { opacity:1; transform:translateX(-50%) translateY(0); }
  80%  { opacity:1; }
  100% { opacity:0; transform:translateX(-50%) translateY(-10px); }
}
/* 赔率面板 */
.cg-odds-board {
  background: rgba(10,20,30,.9);
  border: 1px solid rgba(60,120,200,.3);
  border-radius: 6px;
  padding: 8px 12px;
  margin: 8px 0;
}
.cg-odds-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cg-odds-cell { text-align: center; flex:1; }
.cg-odds-vs { color: rgba(200,180,80,.5); font-size:13px; padding:0 8px; }
.cg-odds-label { font-size:10px; color:rgba(160,160,180,.6); margin-bottom:3px; }
.cg-odds-value { font-size:18px; font-weight:bold; }
.cg-odds-rate  { font-size:10px; color:rgba(180,180,200,.5); margin-top:2px; }
.cg-odds-label-center {
  text-align: center; margin-top:6px;
  font-size: 12px; letter-spacing:1px;
}
/* 日志指令行 */
.cg-log-line.cmd { color: #ffd060 !important; }
.cg-log-line.ai-cmd { color: #ff8844 !important; }

/* 双方主人状态栏 */
.cg-masters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(10,10,20,.7);
  border: 1px solid rgba(100,80,40,.3);
  border-radius: 6px;
  padding: 4px 10px;
  margin: 4px 0 2px;
  font-size: 10px;
}
.cg-master-side {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
}
.cg-master-side.op-master { justify-content: flex-end; }
.cg-master-label { color: rgba(180,160,100,.7); white-space: nowrap; }
.cg-master-mid {
  color: rgba(150,130,80,.5);
  font-size: 9px;
  letter-spacing: 1px;
  white-space: nowrap;
  padding: 0 8px;
}
.cg-master-cmd {
  color: #ffd060;
  font-size: 10px;
  min-width: 50px;
  display: inline-block;
  text-align: center;
}
.cg-master-side.op-master .cg-master-cmd {
  color: #ff9060;
  text-align: right;
}
@keyframes cg-master-cmd-pulse {
  0%   { opacity:0; transform:scale(.7); }
  40%  { opacity:1; transform:scale(1.1); }
  100% { opacity:1; transform:scale(1); }
}
/* AI指令特效横幅（右侧，橙红） */
.cg-cmd-fx.ai-cmd-fx {
  left: auto;
  right: 8px;
  top: 28px;
  bottom: auto;
  transform: none;
  background: rgba(255,100,40,.18);
  border-color: rgba(255,120,60,.6);
  color: #ff9060;
  text-shadow: 0 0 8px rgba(255,80,0,.6);
}

/* ════════════════════════════════════════
   战斗舞台与动画（town.html兼容补充）
   ════════════════════════════════════════ */
/* 下注面板 */
.cg-bet-panel{padding:8px;}
.cg-bp-title{font-size:16px;color:#e8c060;text-align:center;margin-bottom:4px;letter-spacing:2px;}
.cg-bp-sub{font-size:11px;color:rgba(200,180,100,.5);text-align:center;margin-bottom:12px;}
.cg-bp-desc{font-size:12px;color:rgba(200,200,160,.7);text-align:center;margin-bottom:8px;}
.cg-bp-betrow{
  display:flex;align-items:center;gap:8px;
  background:rgba(20,40,15,.4);border-radius:6px;padding:10px 12px;
  font-size:12px;color:rgba(200,200,160,.8);margin-bottom:8px;
}
.cg-bp-betrow input[type=range]{flex:1;accent-color:#80c040;}
.cg-bp-info{font-size:11px;color:rgba(160,180,100,.5);text-align:center;margin-bottom:8px;}
.cg-bp-btns{display:flex;gap:8px;margin-top:12px;}

/* 战斗舞台 */
.cg-battle-scene{display:flex;flex-direction:column;gap:8px;}
.cg-event-banner{
  text-align:center;padding:7px 10px;font-size:11px;
  background:rgba(180,140,20,.15);border:1px solid rgba(180,140,20,.3);
  border-radius:6px;color:#d8c050;letter-spacing:1px;
  animation:cg-entering .4s ease-out;
}

/* 血条 */
.cg-hp-bars{display:flex;align-items:center;gap:8px;padding:4px 0;}
.cg-hp-side{flex:1;}
.cg-hp-name{font-size:12px;margin-bottom:4px;font-weight:bold;}
.cg-hp-bar-wrap{
  height:10px;background:rgba(20,40,15,.6);border-radius:5px;
  overflow:hidden;margin-bottom:3px;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.5);
}
.cg-hp-bar{height:100%;border-radius:5px;transition:width .4s ease,background .4s ease;background:#50c870;}
.cg-hp-num{font-size:10px;color:rgba(180,200,140,.6);}
.cg-vs-label{font-size:16px;color:rgba(220,200,80,.8);padding:0 6px;font-weight:bold;text-shadow:0 0 8px rgba(220,180,60,.4);}

/* 舞台主区域 */
.cg-stage{
  display:flex;align-items:center;gap:4px;
  background:linear-gradient(180deg,rgba(5,20,8,.8) 0%,rgba(10,30,12,.9) 60%,rgba(5,15,8,.8) 100%);
  border:1px solid rgba(60,120,40,.25);border-radius:10px;
  padding:16px 8px 12px;min-height:140px;position:relative;overflow:hidden;
}
.cg-stage::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:30px;
  background:linear-gradient(0deg,rgba(40,100,20,.15),transparent);pointer-events:none;
}
.cg-stage::before{
  content:'';position:absolute;top:50%;left:50%;width:80px;height:80px;
  transform:translate(-50%,-50%);
  background:radial-gradient(circle,rgba(60,180,60,.04),transparent 70%);
  pointer-events:none;
}

/* 战斗单元 */
.cg-fighter{flex:1;text-align:center;position:relative;}
.cg-fighter-wrap{
  display:inline-block;position:relative;
  animation:cg-fighter-idle 2s ease-in-out infinite;
  transition:filter .2s;
}
.cg-fighter-wrap.cg-blink{animation:cg-blink .28s ease-out,cg-fighter-idle 2s ease-in-out infinite 0.28s;}
.cg-fighter-wrap.cg-blink-crit{animation:cg-blink-crit .38s ease-out,cg-fighter-idle 2s ease-in-out infinite 0.38s;}
.cg-fighter-wrap.cg-kb-r{animation:cg-knockback-r .38s ease-out;}
.cg-fighter-wrap.cg-kb-l{animation:cg-knockback-l .38s ease-out;}
.cg-fighter-wrap.cg-atk-r{animation:cg-knockback-l .35s ease-out;}
.cg-fighter-wrap.cg-atk-l{animation:cg-knockback-r .35s ease-out;}
.cg-fighter-wrap.cg-rush-r{animation:cg-rush-r .48s cubic-bezier(.15,.85,.35,1);}
.cg-fighter-wrap.cg-rush-l{animation:cg-rush-l .48s cubic-bezier(.15,.85,.35,1);}
.cg-fighter-wrap.cg-enter-l{animation:cg-enter-from-left .55s cubic-bezier(.15,.85,.35,1) forwards;}
.cg-fighter-wrap.cg-enter-r{animation:cg-enter-from-right .55s cubic-bezier(.15,.85,.35,1) forwards;}
.cg-fighter-wrap.cg-danger{animation:cg-danger-shake .25s ease-in-out infinite,cg-hp-pulse 1s ease-in-out infinite;}
.cg-fighter-wrap.cg-ko{animation:cg-ko-fall .5s ease-out forwards;filter:saturate(.2) brightness(.6);}
.cg-fighter-wrap.cg-victory{animation:cg-victory-bounce .6s ease-in-out 3;}
.cg-stage.cg-stage-thud{animation:cg-stage-thud .3s ease-out;}
.cg-stage.cg-stage-thud-big{animation:cg-stage-thud .45s ease-out;}
.cg-stage.cg-crit-flash{animation:cg-crit-flash .5s ease-out;}

/* 冲击波环 */
.cg-impact-ring{
  position:absolute;top:50%;left:50%;
  width:60px;height:60px;border-radius:50%;
  border:3px solid rgba(255,200,60,.9);
  pointer-events:none;z-index:20;
  animation:cg-impact-ring .4s ease-out forwards;
}
.cg-impact-ring.big{
  width:80px;height:80px;border-width:4px;
  border-color:rgba(255,120,30,.9);
  animation:cg-impact-ring .5s ease-out forwards;
}
.cg-impact-ring.crit{
  width:90px;height:90px;border-width:5px;
  border-color:rgba(255,255,80,1);
  box-shadow:0 0 12px rgba(255,220,0,.6);
  animation:cg-impact-ring .55s ease-out forwards;
}
.cg-impact-ring2{
  position:absolute;top:50%;left:50%;
  width:40px;height:40px;border-radius:50%;
  border:2px solid rgba(255,255,255,.6);
  pointer-events:none;z-index:19;
  animation:cg-impact-ring2 .3s ease-out forwards;
}

/* 地面震波 */
.cg-ground-wave{
  position:absolute;bottom:8px;left:10%;right:10%;height:3px;
  background:linear-gradient(90deg,transparent,rgba(255,200,60,.6),transparent);
  border-radius:2px;pointer-events:none;z-index:18;
  transform-origin:center;
  animation:cg-ground-wave .35s ease-out forwards;
}

/* 蛐蛐粒子火花 */
.cg-spark{position:absolute;font-size:13px;pointer-events:none;z-index:25;
  animation:cg-spark .6s ease-out forwards;}
.cg-spark.big{font-size:16px;animation-duration:.75s;}

/* 蛐蛐字符画 */
.cg-fighter-art{
  font-family:'Courier New',monospace;
  font-size:18px;line-height:1.6;
  white-space:pre;display:block;
  text-shadow:0 0 8px currentColor;
  margin-bottom:6px;
}
.cg-fighter-name{font-size:11px;color:rgba(200,220,160,.8);margin-bottom:2px;}
.cg-fighter-skill{font-size:9px;color:rgba(160,180,120,.4);}
.cg-fighter-status{font-size:10px;min-height:14px;margin-top:2px;}

/* 中央回合信息 */
.cg-stage-center{flex:0 0 60px;text-align:center;z-index:2;}
.cg-round-num{font-size:12px;color:rgba(200,200,100,.8);margin-bottom:6px;font-weight:bold;}
.cg-stage-deco{font-size:9px;color:rgba(100,150,60,.4);letter-spacing:1px;line-height:1.8;}

/* 技能大字爆发文字 */
.cg-skill-banner{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  font-size:22px;font-weight:bold;letter-spacing:3px;
  pointer-events:none;z-index:20;white-space:nowrap;
  animation:cg-skill-big .8s ease-out forwards;
  text-shadow:0 0 20px currentColor;
}

/* 入场倒计时大字 */
.cg-countdown-label{
  position:absolute;top:50%;left:50%;
  font-size:44px;font-weight:900;letter-spacing:2px;
  pointer-events:none;z-index:50;white-space:nowrap;
  animation:cg-countdown .6s ease-out forwards;
  font-family:'Courier New',monospace;
}

/* 入场仪式遮罩 */
.cg-intro-overlay{
  position:absolute;inset:0;z-index:40;
  background:rgba(5,20,8,.92);border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:8px;
}
.cg-intro-title{font-size:13px;color:rgba(180,220,100,.7);letter-spacing:4px;animation:cg-entering .5s ease-out;}
.cg-intro-vs{font-size:28px;font-weight:bold;color:#ffe060;letter-spacing:4px;
  text-shadow:0 0 20px rgba(255,220,60,.6);animation:cg-entering .5s ease-out .1s both;}

/* 血量危险闪烁 */
.cg-hp-bar.danger{animation:cg-hp-pulse .8s ease-in-out infinite;background:#e03030!important;}

/* 爆炸环 */
.cg-explosion-ring{
  position:absolute;top:50%;left:50%;
  width:50px;height:50px;border-radius:50%;
  border:4px solid rgba(255,140,40,.9);
  pointer-events:none;z-index:25;
  animation:cg-explosion .6s ease-out forwards;
}
.cg-explosion-ring.ko{
  border-color:rgba(255,60,20,.9);width:70px;height:70px;
  box-shadow:0 0 20px rgba(255,60,20,.4);
}

/* KO大字 */
.cg-ko-label{
  position:absolute;font-size:32px;font-weight:900;
  pointer-events:none;z-index:30;letter-spacing:2px;
  animation:cg-result-in .4s ease-out forwards;
  text-shadow:0 0 20px currentColor;
}

/* 胜利/败北结果横幅 */
.cg-result-banner{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  text-align:center;z-index:35;pointer-events:none;
}
.cg-result-banner .cg-result-big{
  font-size:28px;font-weight:900;letter-spacing:4px;display:block;
  animation:cg-result-in .5s ease-out forwards;
  text-shadow:0 0 24px currentColor;
}
.cg-result-banner .cg-result-sub{
  font-size:12px;letter-spacing:2px;display:block;margin-top:4px;
  animation:cg-entering .5s ease-out .2s both;
  opacity:.8;
}

/* 浮动伤害数字 */
.cg-dmg-float{
  position:absolute;font-size:16px;font-weight:bold;
  pointer-events:none;z-index:30;
  animation:cg-float-dmg .9s ease-out forwards;
  font-family:'Courier New',monospace;
  text-shadow:0 2px 6px rgba(0,0,0,.8);
}
.cg-dmg-float.miss{font-size:13px;color:rgba(200,200,160,.7);}
.cg-dmg-float.crit{font-size:20px;color:#ffe060;text-shadow:0 0 12px #ff8000,0 2px 6px rgba(0,0,0,.8);}
.cg-dmg-float.heal{color:#60ff80;font-size:15px;}
.cg-dmg-float.dot {color:#ff6040;font-size:13px;}
.cg-dmg-float.stun{color:#ffe060;font-size:13px;}
.cg-dmg-float.op  {color:#ff6060;}

/* 战斗日志 */
.cg-battle-log{
  background:rgba(4,12,4,.8);border:1px solid rgba(40,90,25,.3);
  border-radius:8px;padding:8px 12px;max-height:120px;overflow-y:auto;font-size:11px;
  box-shadow:inset 0 2px 8px rgba(0,0,0,.4);
}
.cg-battle-log::-webkit-scrollbar{width:2px;}
.cg-battle-log::-webkit-scrollbar-thumb{background:rgba(60,140,40,.4);border-radius:2px;}
.cg-log-round{margin-bottom:5px;animation:cg-entering .3s ease-out;}
.cg-log-round-title{font-size:10px;color:rgba(140,160,60,.5);display:block;margin-bottom:3px;}
.cg-log-line{color:rgba(200,220,160,.75);line-height:1.7;padding-left:6px;border-left:2px solid rgba(60,120,40,.2);}
.cg-log-line.player{border-left-color:rgba(60,200,80,.3);}
.cg-log-line.op{color:rgba(230,160,130,.8);border-left-color:rgba(200,80,60,.3);}
.cg-log-line.event{color:rgba(220,200,80,.8);border-left-color:rgba(200,180,40,.3);}
.cg-log-result{margin-top:8px;text-align:center;padding:8px;animation:cg-result-in .5s ease-out;}

/* 操作按钮 */
.cg-action-btns{display:flex;gap:8px;flex-wrap:wrap;}
.cg-btn-normal,.cg-btn-skill,.cg-btn-flee,.cg-btn-cancel,.cg-btn-fight{
  flex:1;min-width:80px;padding:9px 8px;border-radius:7px;cursor:pointer;font-size:12px;
  border:1px solid;transition:.2s;font-family:inherit;letter-spacing:1px;
}
.cg-btn-normal{background:rgba(25,70,15,.6);border-color:rgba(70,150,35,.4);color:#90e050;}
.cg-btn-normal:hover:not([disabled]){background:rgba(35,90,20,.7);border-color:rgba(90,180,50,.5);}
.cg-btn-skill{background:rgba(50,25,90,.6);border-color:rgba(130,70,190,.4);color:#c090ff;}
.cg-btn-skill:hover:not([disabled]){background:rgba(65,35,115,.7);}
.cg-btn-flee{background:rgba(70,15,15,.5);border-color:rgba(150,50,35,.4);color:#e07050;flex:0 0 auto;}
.cg-btn-flee:hover{background:rgba(90,25,20,.6);}
.cg-btn-cancel{background:rgba(35,35,25,.5);border-color:rgba(110,110,70,.3);color:rgba(200,200,140,.7);}
.cg-btn-cancel:hover{background:rgba(45,45,30,.6);}
.cg-btn-fight{background:linear-gradient(135deg,rgba(160,50,20,.6),rgba(120,35,15,.6));border-color:rgba(200,80,40,.4);color:#ffb080;}
.cg-btn-fight:hover{background:linear-gradient(135deg,rgba(190,65,30,.7),rgba(150,45,20,.7));color:#ffd0a0;}
.cg-btn-normal[disabled],.cg-btn-skill[disabled]{opacity:.4;cursor:not-allowed;}

/* 技能冷却指示 */
.cg-cd-badge{
  display:inline-block;font-size:9px;background:rgba(100,60,180,.5);
  border-radius:3px;padding:1px 4px;margin-left:4px;color:rgba(200,160,255,.8);
}

/* ════════════════════════════════════════
   动画关键帧
   ════════════════════════════════════════ */
@keyframes cg-shake-panel{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes cg-shake-big{0%,100%{transform:translate(0,0)}15%{transform:translate(-8px,-4px)}30%{transform:translate(8px,4px)}45%{transform:translate(-6px,3px)}60%{transform:translate(6px,-3px)}75%{transform:translate(-4px,2px)}90%{transform:translate(4px,-2px)}}
@keyframes cg-blink{0%,100%{filter:brightness(1)}50%{filter:brightness(3.5) saturate(0)}}
@keyframes cg-blink-crit{0%{filter:brightness(1)}30%{filter:brightness(5) saturate(0) hue-rotate(30deg)}70%{filter:brightness(2) saturate(.3)}100%{filter:brightness(1)}}
@keyframes cg-knockback-r{0%{transform:translateX(0)}30%{transform:translateX(22px)}100%{transform:translateX(0)}}
@keyframes cg-knockback-l{0%{transform:translateX(0)}30%{transform:translateX(-22px)}100%{transform:translateX(0)}}
@keyframes cg-impact-ring{0%{transform:translate(-50%,-50%) scale(.1);opacity:1}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}
@keyframes cg-impact-ring2{0%{transform:translate(-50%,-50%) scale(.05);opacity:.8}100%{transform:translate(-50%,-50%) scale(2);opacity:0}}
@keyframes cg-ground-wave{0%{transform:scaleX(0);opacity:.8}100%{transform:scaleX(1);opacity:0}}
@keyframes cg-stage-thud{0%,100%{transform:translateY(0)}25%{transform:translateY(4px)}50%{transform:translateY(-2px)}75%{transform:translateY(2px)}}
@keyframes cg-crit-flash{0%,100%{box-shadow:none}40%{box-shadow:0 0 30px rgba(255,220,0,.6),inset 0 0 20px rgba(255,200,0,.15)}}
@keyframes cg-rush-r{0%{transform:translateX(0) scaleX(1)}35%{transform:translateX(55px) scaleX(1.12)}55%{transform:translateX(58px) scaleX(1.14)}70%{transform:translateX(22px) scaleX(.92)}100%{transform:translateX(0) scaleX(1)}}
@keyframes cg-rush-l{0%{transform:translateX(0) scaleX(1)}35%{transform:translateX(-55px) scaleX(1.12)}55%{transform:translateX(-58px) scaleX(1.14)}70%{transform:translateX(-22px) scaleX(.92)}100%{transform:translateX(0) scaleX(1)}}
@keyframes cg-float-dmg{0%{opacity:1;transform:translateY(0) scale(1)}70%{opacity:.9;transform:translateY(-28px) scale(1.15)}100%{opacity:0;transform:translateY(-46px) scale(.9)}}
@keyframes cg-spark{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(0)}}
@keyframes cg-skill-big{0%{opacity:0;transform:scale(.5)}25%{opacity:1;transform:scale(1.2)}70%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}
@keyframes cg-flash-red{0%,100%{opacity:0}50%{opacity:.45}}
@keyframes cg-flash-blue{0%,100%{opacity:0}50%{opacity:.35}}
@keyframes cg-entering{0%{opacity:0;transform:scale(.7)}100%{opacity:1;transform:scale(1)}}
@keyframes cg-fighter-idle{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes cg-result-in{0%{opacity:0;transform:scale(.6) rotate(-5deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes cg-enter-from-left{0%{opacity:0;transform:translateX(-80px) scale(.6)}60%{opacity:1;transform:translateX(8px) scale(1.08)}100%{transform:translateX(0) scale(1)}}
@keyframes cg-enter-from-right{0%{opacity:0;transform:translateX(80px) scale(.6)}60%{opacity:1;transform:translateX(-8px) scale(1.08)}100%{transform:translateX(0) scale(1)}}
@keyframes cg-countdown{0%{opacity:0;transform:translate(-50%,-50%) scale(2.5)}30%{opacity:1;transform:translate(-50%,-50%) scale(1)}80%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.3)}}
@keyframes cg-danger-shake{0%,100%{transform:translateX(0) translateY(0)}20%{transform:translateX(-2px) translateY(1px)}40%{transform:translateX(2px) translateY(-1px)}60%{transform:translateX(-1px) translateY(1px)}80%{transform:translateX(1px) translateY(-1px)}}
@keyframes cg-ko-fall{0%{opacity:1;transform:rotate(0) scale(1)}40%{opacity:1;transform:rotate(-25deg) scale(1.1) translateY(-8px)}70%{opacity:.8;transform:rotate(85deg) scale(.9) translateY(4px)}100%{opacity:.5;transform:rotate(90deg) scale(.8) translateY(6px)}}
@keyframes cg-victory-bounce{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-16px) scale(1.1)}50%{transform:translateY(-24px) scale(1.15)}75%{transform:translateY(-10px) scale(1.05)}}
@keyframes cg-hp-pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes cg-explosion{0%{transform:translate(-50%,-50%) scale(0);opacity:1}50%{opacity:.8}100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}}

/* ════════════════════════════════════════
   手机适配（≤480px）
   ════════════════════════════════════════ */
@media(max-width:480px){
  /* 面板容器 */
  .cricket-panel{width:98vw;max-height:94vh;border-radius:10px;}
  .cricket-header{padding:10px 12px 8px;}
  .cricket-title{font-size:17px;letter-spacing:4px;}
  .cricket-subtitle{font-size:9px;}
  .cricket-body{padding:8px;}

  /* 统计栏 */
  .cg-stats-bar{gap:6px;padding:5px 8px;font-size:10px;margin-bottom:8px;}

  /* 标题栏 */
  .cg-section-title{font-size:11px;margin:4px 0 6px;}

  /* 蛐蛐卡片 — 主界面 squad 横排变竖排 */
  .cg-squad-row{flex-direction:column;gap:6px !important;}

  /* 蛐蛐卡片通用 */
  .cg-cricket-card{
    padding:6px 8px;gap:6px;
    border-radius:6px;
    font-size:11px;
  }
  .cg-cricket-art{
    font-size:8px;line-height:1.25;min-width:48px;
    transform:scale(0.85);transform-origin:center;
  }
  .cg-cricket-info{min-width:0;flex:1;}
  .cg-cricket-name{font-size:11px;}
  .cg-rare-star{font-size:9px;}
  .cg-cricket-lv,.cg-cricket-attrs,.cg-cricket-record{font-size:9px;}
  .cg-stamina-label{font-size:8px;display:none;}/* 隐藏体力/血量标签，靠颜色区分 */
  .cg-stamina-val,.cg-stamina-bar-wrap{font-size:8px;}
  .cg-stamina-bar-wrap{min-width:28px;height:4px;}
  .cg-stamina-val{display:none;}
  .cg-rest-btn{font-size:8px;padding:1px 3px;}

  /* 入队/移出按钮 */
  .cg-squad-toggle-btn{font-size:9px;padding:2px 8px;}

  /* 对手列表 */
  .cg-opponent-list{gap:4px;}
  .cg-opponent-card{padding:6px 8px;gap:6px;border-radius:6px;}
  .cg-op-art{
    font-size:8px;line-height:1.25;min-width:44px;
    transform:scale(0.85);transform-origin:center;
  }
  .cg-op-name{font-size:11px;}
  .cg-op-breed,.cg-op-bet{font-size:9px;}
  .cg-challenge-btn{padding:5px 8px;font-size:10px;white-space:nowrap;flex-shrink:0;}

  /* 提示文字 */
  .cg-tip{font-size:9px;margin-top:6px;}

  /* 下注面板 */
  .cg-bet-panel{padding:6px;}
  .cg-bp-title{font-size:14px;letter-spacing:1px;}
  .cg-bp-sub,.cg-bp-desc,.cg-bp-info{font-size:10px;}
  .cg-bp-betrow{padding:8px;font-size:11px;gap:6px;}
  .cg-bp-btns{gap:6px;flex-direction:column-reverse;}

  /* 战斗舞台 */
  .cg-battle-scene{gap:6px;}
  .cg-event-banner{padding:5px 8px;font-size:10px;}

  /* 血条 */
  .cg-hp-bars{gap:4px;padding:2px 0;}
  .cg-hp-name{font-size:10px;margin-bottom:2px;}
  .cg-hp-bar-wrap{height:8px;}
  .cg-vs-label{font-size:14px;padding:0 4px;}

  /* 战台 */
  .cg-stage{
    padding:10px 4px 8px;min-height:110px;border-radius:8px;
  }

  /* 角色字符画 */
  .cg-fighter-art{font-size:13px;line-height:1.45;}
  .cg-fighter-name{font-size:10px;margin-bottom:1px;}
  .cg-fighter-skill{font-size:8px;}
  .cg-fighter-status{font-size:9px;}

  /* 回合中央信息 */
  .cg-stage-center{flex:0 0 40px;}
  .cg-round-num{font-size:10px;}
  .cg-stage-deco{font-size:8px;}

  /* 技能大字 */
  .cg-skill-banner{font-size:16px;letter-spacing:2px;}
  .cg-countdown-label{font-size:32px;}

  /* 指令面板 */
  .cg-cmd-panel{padding:6px 8px;margin-top:4px;border-radius:6px;}
  .cg-cmd-title{font-size:10px;margin-bottom:4px;}
  .cg-cmd-grid{grid-template-columns:repeat(4,1fr);gap:3px;margin-bottom:4px;}
  .cg-cmd-btn{font-size:9px;padding:4px 2px;border-radius:4px;}
  .cg-cmd-hint{font-size:9px;}

  /* 双方主人状态栏 */
  .cg-masters-bar{padding:3px 6px;font-size:9px;gap:3px;}
  .cg-master-label{font-size:9px;}
  .cg-master-mid{font-size:8px;padding:0 4px;}
  .cg-master-cmd{font-size:9px;min-width:40px;}

  /* 赔率面板 */
  .cg-odds-board{padding:6px 8px;margin:6px 0;border-radius:5px;}
  .cg-odds-value{font-size:15px;}
  .cg-odds-vs{font-size:11px;padding:0 4px;}
  .cg-odds-label-center{font-size:10px;}

  /* 战斗日志 */
  .cg-battle-log{
    padding:6px 8px;max-height:90px;
    font-size:10px;border-radius:6px;
  }
  .cg-log-round{margin-bottom:3px;}
  .cg-log-round-title{font-size:9px;}
  .cg-log-line{font-size:10px;padding-left:4px;}

  /* 操作按钮 */
  .cg-action-btns{gap:6px;}
  .cg-btn-normal,.cg-btn-skill,.cg-btn-cancel,.cg-btn-fight{
    padding:7px 6px;border-radius:6px;font-size:11px;min-width:60px;
  }
  .cg-btn-flee{font-size:10px;}

  /* 浮动伤害数字 */
  .cg-dmg-float{font-size:14px;}
  .cg-dmg-float.crit{font-size:17px;}
  .cg-dmg-float.miss{font-size:11px;}

  /* KO大字 / 结果横幅 */
  .cg-ko-label{font-size:26px;}
  .cg-result-banner .cg-result-big{font-size:22px;letter-spacing:2px;}
  .cg-result-banner .cg-result-sub{font-size:10px;}

  /* 冲击波环缩小 */
  .cg-impact-ring{width:42px;height:42px;border-width:2px;}
  .cg-impact-ring.big{width:56px;height:56px;border-width:3px;}
  .cg-impact-ring.crit{width:64px;height:64px;border-width:4px;}
  .cg-impact-ring2{width:32px;height:32px;}
  .cg-ground-wave{height:2px;bottom:4px;left:8%;right:8%;}

  /* 粒子火花 */
  .cg-spark{font-size:11px;}
  .cg-spark.big{font-size:13px;}

  /* CD徽章 */
  .cg-cd-badge{font-size:8px;padding:1px 3px;}

  /* 性格标签 */
  .cg-pers-tag{font-size:9px;padding:0 3px;}
  .cg-pers-mini{font-size:8px;padding:0 2px;}

  /* 爆炸环 */
  .cg-explosion-ring{width:38px;height:38px;border-width:3px;}
  .cg-explosion-ring.ko{width:52px;height:52px;}

  /* 入场遮罩 */
  .cg-intro-overlay{border-radius:8px;}
  .cg-intro-title{font-size:11px;}
  .cg-intro-vs{font-size:22px;letter-spacing:2px;}
}

/* 超小屏 ≤360px 二次压缩 */
@media(max-width:360px){
  .cricket-panel{width:100vw;border-radius:0;max-height:100vh;}
  .cricket-header{padding:8px 10px 6px;}
  .cg-cricket-art{transform:scale(0.75);}
  .cg-op-art{transform:scale(0.75);}
  .cg-stage{min-height:95px;padding:8px 2px 6px;}
  .cg-fighter-art{font-size:11px;line-height:1.35;}
  .cg-cmd-grid{grid-template-columns:repeat(4,1fr);gap:2px;}
  .cg-cmd-btn{font-size:8px;padding:3px 1px;}
  .cg-battle-log{max-height:70px;font-size:9px;}
  .cg-hp-name{font-size:9px;}
}
`;
  document.head.appendChild(style);
})();

/* ════════════════════════════════════════
   二十、全局暴露
   ════════════════════════════════════════ */
window.openCricketGame   = openCricketGame;
window.closeCricketGame  = closeCricketGame;
window.cityHasCricket    = cityHasCricket;
window.cgSelectCricket  = cgSelectCricket;
window.cgSelectCricketByUid = cgSelectCricketByUid;
window.cgOpenBetPanel   = cgOpenBetPanel;
window.cgBeginFight     = cgBeginFight;
window.cgFlee           = cgFlee;
window.cgAddCricket     = cgAddCricket;
window.cgRenderMain     = cgRenderMain;
window.cgIssueCommand   = cgIssueCommand;
window.cgUpdateBetPreview = cgUpdateBetPreview;
window.tryOpenCricketCatch = tryOpenCricketCatch;
window.cgToggleSquad    = cgToggleSquad;
window.cgOpenSquadPanel = cgOpenSquadPanel;
window.cgGetCageCapacity= cgGetCageCapacity;
