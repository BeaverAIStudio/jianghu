// ════════════════════════════════════════════════════
//  sect-war.js  门派动态事件 + 阵营战争系统
//  功能：
//    1. 门派动态事件（15类随机事件，每日轮询）
//    2. 门派战争（门派间冲突，分正邪大战+门派私斗）
//    3. 事件影响NPC好感、门派关系、世界事件
//  version: 1
// ════════════════════════════════════════════════════

;(function(){
'use strict';

// ═══════════════════════════════════════════════════
//  一、门派动态事件
// ═══════════════════════════════════════════════════

/**
 * 门派动态事件池
 * type: 事件类型
 * desc: 事件描述模板（{sect}会被替换为门派名）
 * effect: 事件效果
 *   - contrib: 贡献值变化
 *   - relChange: 对特定门派好感变化 { _allies: delta, _enemies: delta, sectId: delta }
 *   - worldEvent: 触发世界事件 { id, tier }
 * duration: 事件持续天数
 */
var SECT_EVENT_POOL = [
  // ── 内部事件 ──
  {
    id: 'se_training_contest',
    type: 'internal',
    name: '门派大比',
    icon: '⚔️',
    desc: '{sect}举办门内大比，弟子们摩拳擦掌，气氛热烈。',
    effect: { contrib: 5, worldEvent: { id: 'we_sect_training', tier: 'small' } },
    duration: 3,
  },
  {
    id: 'se_internal_dispute',
    type: 'internal',
    name: '内部纷争',
    icon: '😤',
    desc: '{sect}内部两派弟子因功法理念不同发生争执，长老出面调解。',
    effect: { contrib: -3, relChange: {} },
    duration: 2,
  },
  {
    id: 'se_treasure_found',
    type: 'internal',
    name: '发现秘宝',
    icon: '💎',
    desc: '{sect}弟子在外出历练时偶然发现一处前人洞府，带回了珍贵宝物。',
    effect: { contrib: 8 },
    duration: 3,
  },
  {
    id: 'se_master_breakthrough',
    type: 'internal',
    name: '掌门突破',
    icon: '✨',
    desc: '{sect}掌门闭关多年终于出关，功力大进，全门上下一片欢腾。',
    effect: { contrib: 10, relChange: {} },
    duration: 5,
  },
  {
    id: 'se_traitor_exposed',
    type: 'internal',
    name: '叛徒暴露',
    icon: '🕵️',
    desc: '{sect}查出一名潜伏多年的内奸，已将其逐出师门，门中人心惶惶。',
    effect: { contrib: -5 },
    duration: 2,
  },
  {
    id: 'se_new_recruit_wave',
    type: 'internal',
    name: '新弟子入门',
    icon: '🎓',
    desc: '{sect}广发英雄帖，新收了一批弟子，门派人气渐旺。',
    effect: { contrib: 3 },
    duration: 3,
  },
  {
    id: 'se_resource_shortage',
    type: 'internal',
    name: '资源匮乏',
    icon: '📉',
    desc: '{sect}所在地区遭遇旱灾，物资紧缺，炼丹房暂时停工。',
    effect: { contrib: -2 },
    duration: 4,
  },
  {
    id: 'se_alliance_diplomacy',
    type: 'internal',
    name: '外交活动',
    icon: '🤝',
    desc: '{sect}派遣使者前往友好门派商议联盟事宜，江湖格局或将生变。',
    effect: { contrib: 5, relChange: { _allies: 5 } },
    duration: 3,
  },
  // ── 外部事件（门派间冲突/合作）──
  {
    id: 'se_border_skirmish',
    type: 'conflict',
    name: '边境摩擦',
    icon: '🗡️',
    desc: '{sect}与敌对门派弟子在边境发生冲突，双方各有伤亡。',
    effect: { contrib: 3, relChange: { _enemies: -10, _allies: 5 } },
    duration: 2,
  },
  {
    id: 'se_intel_leak',
    type: 'conflict',
    name: '情报泄露',
    icon: '📜',
    desc: '{sect}的核心功法被泄露给敌对势力，长老们紧急商议对策。',
    effect: { contrib: -8, relChange: { _enemies: 5 } },
    duration: 3,
  },
  {
    id: 'se_joint_mission',
    type: 'cooperation',
    name: '联合行动',
    icon: '🛡️',
    desc: '{sect}与盟友门派联合清剿一处邪教据点，江湖正义得到伸张。',
    effect: { contrib: 10, relChange: { _allies: 8 } },
    duration: 3,
  },
  {
    id: 'se_trade_route',
    type: 'cooperation',
    name: '贸易往来',
    icon: '📦',
    desc: '{sect}与附近城镇建立新的贸易路线，门派物资更加充裕。',
    effect: { contrib: 5 },
    duration: 5,
  },
  {
    id: 'se_mysterious_visitor',
    type: 'mystery',
    name: '神秘访客',
    icon: '🎭',
    desc: '一位神秘人物造访{sect}，与掌门密谈后匆匆离去，弟子们议论纷纷。',
    effect: { contrib: 2 },
    duration: 2,
  },
  {
    id: 'se_ancient_relic',
    type: 'mystery',
    name: '上古遗物',
    icon: '🏺',
    desc: '{sect}弟子在附近发现一件上古遗物，鉴定后发现可能与门派创始人有关。',
    effect: { contrib: 8 },
    duration: 4,
  },
  {
    id: 'se_natural_disaster',
    type: 'disaster',
    name: '天灾来袭',
    icon: '🌊',
    desc: '{sect}所在地区遭遇山洪暴发，门派弟子投入救灾。',
    effect: { contrib: -5, relChange: { _allies: 5, _enemies: 3 } },
    duration: 5,
  },
];

// ═══════════════════════════════════════════════════════════════════════
//  将将胡：门派战争战术卡系统
// ═══════════════════════════════════════════════════════════════════════

/** 战术卡配置 */
var WAR_TACTICAL_CARDS = {
  reinforce:  { id: 'reinforce', name: '增援卡', icon: '🛡', effect: '本回合防御+20%', cost: 0, type: 'defense' },
  ambush:     { id: 'ambush',    name: '偷袭卡', icon: '🗡', effect: '下一场NPC战斗先手', cost: 1, type: 'tactical' },
  hold:       { id: 'hold',      name: '坚守卡', icon: '🏰', effect: '减少20%伤亡', cost: 1, type: 'defense' },
  rally:      { id: 'rally',     name: '号令卡', icon: '🚩', effect: '全体成员下1回合+10%攻击', cost: 2, type: 'buff' },
  retreat:    { id: 'retreat',   name: '撤退卡', icon: '🏃', effect: '立即终止战争（平局）', cost: 3, type: 'special' },
};

/** 战术卡获取（战争胜利奖励） */
function swAddCardReward(sectId) {
  try {
    var raw = localStorage.getItem('wuxia_owned_cards') || '[]';
    var cards = JSON.parse(raw);
    var exclPool = (typeof getAvailableExclusiveCards === 'function')
      ? getAvailableExclusiveCards() : [];
    if (exclPool.length === 0) return null;
    var card = exclPool[Math.floor(Math.random() * exclPool.length)];
    cards.push({ ...card, source: 'war_reward', timestamp: Date.now() });
    localStorage.setItem('wuxia_owned_cards', JSON.stringify(cards));
    return card;
  } catch (e) { return null; }
}

/** 战术卡激活 */
function swActivateTacticalCard(cardId) {
  var card = WAR_TACTICAL_CARDS[cardId];
  if (!card) return false;
  var buf = JSON.parse(sessionStorage.getItem('wuxia_war_tactical_buf') || '{}');
  buf[cardId] = { active: true, time: Date.now() };
  sessionStorage.setItem('wuxia_war_tactical_buf', JSON.stringify(buf));
  return true;
}

// ═══════════════════════════════════════════════════
//  二、门派战争数据库
// ═══════════════════════════════════════════════════

var SECT_WAR_DB = {
  // ── 正邪大战 ──
  'war_righteous_vs_evil': {
    id: 'war_righteous_vs_evil',
    name: '正邪大战',
    icon: '⚔️',
    desc: '正道联盟与邪道联盟的终极对决！血骨门与日月神教联合进攻中原，少林、武当、峨眉等正道门派紧急集结。',
    type: 'faction',
    stages: [
      {
        id: 'rve_1', name: '前哨战',
        desc: '邪道先锋队已到达沧州，正道弟子紧急前往支援。',
        type: 'kill', targetCount: 10,
        targetEnemyPool: ['xuanming_cultist','blood_bone_soldier','riyue_guardian'],
        reward: { exp:500, silver:100, contrib:20 },
      },
      {
        id: 'rve_2', name: '情报战',
        desc: '需要潜入敌营获取敌方兵力部署图。',
        type: 'collect', targetItem: 'enemy_intel_scroll', targetCount: 3,
        reward: { exp:600, silver:150, contrib:25 },
      },
      {
        id: 'rve_3', name: '攻防战',
        desc: '邪道主力进攻洛阳，守城战一触即发！',
        type: 'dungeon', targetDungeon: 'luoyang_underground_palace',
        reward: { exp:800, silver:200, contrib:35 },
      },
      {
        id: 'rve_4', name: '最终决战',
        desc: '正邪两方高手决战嵩山之巅！',
        type: 'boss', targetEnemy: 'shadow_master',
        reward: { exp:2000, silver:500, contrib:80 },
        warEnd: true,
        outcomes: {
          win:  '正道大胜！邪道势力遭受重创，江湖恢复了一段时期的和平。',
          lose: '邪道暂时得势，正道门派损失惨重，需要时间恢复。',
        },
      },
    ],
    requirements: { minLevel:40, minFame:50, requiredSectAlign: ['righteous','neutral'] },
  },
  // ── 华山 vs 日月神教 ──
  'war_huashan_vs_riyue': {
    id: 'war_huashan_vs_riyue',
    name: '华山论剑·暗流涌动',
    icon: '⛰️',
    desc: '华山论剑大会期间，日月神教暗中派人搅局，意图夺取华山剑法秘籍。',
    type: 'sect',
    stages: [
      {
        id: 'hvr_1', name: '暗探现形',
        desc: '华山弟子在山路上抓获一名可疑人，审问后发现是日月神教的探子。',
        type: 'kill', targetCount: 5,
        targetEnemyPool: ['riyue_guardian','shadow_assassin'],
        reward: { exp:400, silver:80, contrib:15 },
      },
      {
        id: 'hvr_2', name: '剑冢守卫',
        desc: '日月神教精锐偷袭华山剑冢，必须阻止他们！',
        type: 'dungeon', targetDungeon: 'huashan_sword_path',
        reward: { exp:600, silver:150, contrib:25 },
      },
      {
        id: 'hvr_3', name: '剑气对决',
        desc: '日月神教左使亲临华山，与华山掌门正面交锋！',
        type: 'boss', targetEnemy: 'shadow_master',
        reward: { exp:1500, silver:350, contrib:50 },
        warEnd: true,
        outcomes: {
          win:  '华山成功击退日月神教！剑冢安然无恙，华山声望大增。',
          lose: '日月神教趁乱掠走了数本剑谱残卷，华山损失惨重。',
        },
      },
    ],
    requirements: { minLevel:30, minFame:30, requiredSect: ['huashan','wudang','shaolin','emei'] },
  },
  // ── 武当 vs 五毒 ──
  'war_wudang_vs_wudu': {
    id: 'war_wudang_vs_wudu',
    name: '武当除毒行动',
    icon: '☯',
    desc: '五毒教在武当山附近释放毒雾，意图夺取武当太极丹方。',
    type: 'sect',
    stages: [
      {
        id: 'wvw_1', name: '毒雾弥漫',
        desc: '武当山下村庄中了奇毒，需要寻找解药材料。',
        type: 'collect', targetItem: 'detox_herb', targetCount: 5,
        reward: { exp:400, silver:100, contrib:15 },
      },
      {
        id: 'wvw_2', name: '追踪毒源',
        desc: '顺藤摸瓜找到五毒教的临时据点。',
        type: 'kill', targetCount: 8,
        targetEnemyPool: ['five_poison_disciple','five_poison_elder'],
        reward: { exp:600, silver:150, contrib:25 },
      },
      {
        id: 'wvw_3', name: '武当剑阵',
        desc: '五毒教教主亲率精锐来袭，武当真武七截阵迎战！',
        type: 'boss', targetEnemy: 'five_poison_boss',
        reward: { exp:1500, silver:400, contrib:50 },
        warEnd: true,
        outcomes: {
          win:  '武当成功击退五毒教！毒雾消散，太极丹方安然无恙。',
          lose: '五毒教趁乱盗走了数份丹方，武当损失惨重。',
        },
      },
    ],
    requirements: { minLevel:30, minFame:25, requiredSect: ['wudang','shaolin','emei','shengguang'] },
  },
  // ── 唐门 vs 天地帮 ──
  'war_tang_vs_tiandi': {
    id: 'war_tang_vs_tiandi',
    name: '蜀中暗战',
    icon: '🗡️',
    desc: '天地帮势力伸入四川，与唐门在成都周边爆发暗战。',
    type: 'sect',
    stages: [
      {
        id: 'ttd_1', name: '暗器对决',
        desc: '天地帮雇佣刺客潜入唐门，唐门弟子展开反追踪。',
        type: 'kill', targetCount: 6,
        targetEnemyPool: ['hunter_thief','desert_assassin','bandit_veteran'],
        reward: { exp:350, silver:80, contrib:15 },
      },
      {
        id: 'ttd_2', name: '机关迷宫',
        desc: '天地帮闯入唐门机关堡，在迷宫中与唐门弟子周旋。',
        type: 'dungeon', targetDungeon: 'tangmen_mechanism_fort',
        reward: { exp:600, silver:150, contrib:25 },
      },
      {
        id: 'ttd_3', name: '帮主对决',
        desc: '天地帮帮主亲自出马，在成都城外与唐门门主决战。',
        type: 'boss', targetEnemy: 'bandit_chief_cangzhou',
        reward: { exp:1200, silver:300, contrib:45 },
        warEnd: true,
        outcomes: {
          win:  '唐门成功击退天地帮！蜀中恢复了往日的平静。',
          lose: '天地帮在成都站稳脚跟，唐门势力被迫收缩。',
        },
      },
    ],
    requirements: { minLevel:25, minFame:20, requiredSect: ['tangmen','diancang','qingcheng','tianlong'] },
  },

  // ══════════════════════════════════════════════════
  //  新增战争（6场，总计10场）
  // ══════════════════════════════════════════════════

  // ── 逍遥派 vs 玄冥教 ──
  'war_xiaoyao_vs_xuanming': {
    id: 'war_xiaoyao_vs_xuanming',
    name: '灵鹫宫之劫',
    icon: '❄',
    desc: '玄冥教觊觎天山灵鹫宫的北冥神功秘籍，趁逍遥派人手不足之际大举进攻。',
    type: 'sect',
    stages: [
      {
        id: 'xvxm_1', name: '冰谷伏击',
        desc: '玄冥教精锐在灵鹫宫外的冰谷设伏，逍遥弟子需要突围。',
        type: 'kill', targetCount: 8,
        targetEnemyPool: ['xuanming_cultist','dark_cultist','frost_elemental'],
        reward: { exp:400, silver:100, contrib:15 },
      },
      {
        id: 'xvxm_2', name: '藏经阁保卫',
        desc: '玄冥教盗贼潜入灵鹫宫藏经阁偷取秘籍。',
        type: 'dungeon', targetDungeon: 'tianshan_ice_cave',
        reward: { exp:600, silver:150, contrib:25 },
      },
      {
        id: 'xvxm_3', name: '天山之巅',
        desc: '逍遥子重现江湖，与玄冥二老在天山之巅展开决战！',
        type: 'boss', targetEnemy: 'shadow_master',
        reward: { exp:1500, silver:400, contrib:50 },
        warEnd: true,
        outcomes: {
          win:  '逍遥派成功保住了北冥神功！玄冥教溃败而逃。',
          lose: '玄冥教掠走了数本秘籍，逍遥派元气大伤。',
        },
      },
    ],
    requirements: { minLevel:30, minFame:25, requiredSect: ['xiaoyao','taohuadao','tianshan','guigu'] },
  },

  // ── 峨眉 vs 明教 ──
  'war_emei_vs_mingjiao': {
    id: 'war_emei_vs_mingjiao',
    name: '金顶烽火',
    icon: '🌺',
    desc: '明教试图在峨眉山建立据点，峨眉弟子誓死守卫金顶。',
    type: 'sect',
    stages: [
      {
        id: 'evm_1', name: '山道阻击',
        desc: '明教先锋沿山路进攻峨眉金顶，需要拦截。',
        type: 'kill', targetCount: 10,
        targetEnemyPool: ['riyue_guardian','fire_cultist','bandit_veteran'],
        reward: { exp:450, silver:100, contrib:18 },
      },
      {
        id: 'evm_2', name: '烈火焚山',
        desc: '明教法王施展火功，峨眉后山燃起大火，需扑灭。',
        type: 'collect', targetItem: 'item_herb_green', targetCount: 8,
        reward: { exp:500, silver:120, contrib:20 },
      },
      {
        id: 'evm_3', name: '金顶决战',
        desc: '明教四大法王齐聚，峨眉掌门率弟子迎战！',
        type: 'boss', targetEnemy: 'shadow_master',
        reward: { exp:1500, silver:350, contrib:50 },
        warEnd: true,
        outcomes: {
          win:  '峨眉金顶安然无恙！明教退兵千里。',
          lose: '明教占领了峨眉半山，峨眉派损失惨重。',
        },
      },
    ],
    requirements: { minLevel:30, minFame:25, requiredSect: ['emei','shaolin','wudang','shengguang'] },
  },

  // ── 崆峒 vs 天龙帮 ──
  'war_kongtong_vs_tianlong': {
    id: 'war_kongtong_vs_tianlong',
    name: '北地争雄',
    icon: '🌪',
    desc: '天龙帮欲染指崆峒地盘，双方在北地展开激烈争夺。',
    type: 'sect',
    stages: [
      {
        id: 'ktvtl_1', name: '边境冲突',
        desc: '天龙帮先锋队入侵崆峒势力范围。',
        type: 'kill', targetCount: 7,
        targetEnemyPool: ['bandit_foot','bandit_veteran','thunder_cultist'],
        reward: { exp:350, silver:80, contrib:15 },
      },
      {
        id: 'ktvtl_2', name: '龙象逞威',
        desc: '天龙帮龙象十八罗汉出手，崆峒弟子顽强抵抗。',
        type: 'kill', targetCount: 5,
        targetEnemyPool: ['iron_guard','bandit_chief_cangzhou'],
        reward: { exp:500, silver:120, contrib:22 },
      },
      {
        id: 'ktvtl_3', name: '七伤破龙',
        desc: '崆峒五老联手施展七伤拳，与天龙帮主决战北地！',
        type: 'boss', targetEnemy: 'bandit_chief_cangzhou',
        reward: { exp:1200, silver:300, contrib:45 },
        warEnd: true,
        outcomes: {
          win:  '崆峒派成功守住了北地领土！天龙帮铩羽而归。',
          lose: '天龙帮占领了崆峒部分地盘，北地格局大变。',
        },
      },
    ],
    requirements: { minLevel:25, minFame:20, requiredSect: ['kongtong','shaolin','nangong','shengguang'] },
  },

  // ── 血骨门 vs 圣光教 ──
  'war_xuegu_vs_shengguang': {
    id: 'war_xuegu_vs_shengguang',
    name: '正邪对决',
    icon: '⚔️',
    desc: '血骨门在中原大肆作恶，圣光教联合正道弟子前往清剿。',
    type: 'faction',
    stages: [
      {
        id: 'xgsg_1', name: '血池捣毁',
        desc: '血骨门的血池据点需要被捣毁。',
        type: 'dungeon', targetDungeon: 'blood_bone_altar',
        reward: { exp:500, silver:150, contrib:20 },
      },
      {
        id: 'xgsg_2', name: '追杀血骨',
        desc: '血骨门残部四散逃窜，需要追击。',
        type: 'kill', targetCount: 12,
        targetEnemyPool: ['blood_bone_soldier','tomb_zombie','dark_cultist'],
        reward: { exp:600, silver:180, contrib:25 },
      },
      {
        id: 'xgsg_3', name: '圣光审判',
        desc: '血骨门教主做最后抵抗，圣光教发动审判之力！',
        type: 'boss', targetEnemy: 'shadow_master',
        reward: { exp:1800, silver:500, contrib:60 },
        warEnd: true,
        outcomes: {
          win:  '血骨门被彻底铲除！正道大获全胜。',
          lose: '血骨门教主逃脱，日后必有大患。',
        },
      },
    ],
    requirements: { minLevel:35, minFame:30, requiredSectAlign: ['righteous'] },
  },

  // ── 鬼谷门 vs 凌霄阁 ──
  'war_guigu_vs_lingxiao': {
    id: 'war_guigu_vs_lingxiao',
    name: '情报暗战',
    icon: '🔮',
    desc: '鬼谷门与凌霄阁因情报垄断问题爆发暗中较量。',
    type: 'sect',
    stages: [
      {
        id: 'gglx_1', name: '情报争夺',
        desc: '双方为争夺一份关键情报展开较量。',
        type: 'collect', targetItem: 'item_copper_coin', targetCount: 5,
        reward: { exp:300, silver:80, contrib:12 },
      },
      {
        id: 'gglx_2', name: '密探对决',
        desc: '双方的密探在暗中互相刺杀。',
        type: 'kill', targetCount: 6,
        targetEnemyPool: ['shadow_assassin','hunter_thief','night_stalker'],
        reward: { exp:450, silver:120, contrib:18 },
      },
      {
        id: 'gglx_3', name: '天机对凌霄',
        desc: '鬼谷子与凌霄阁主在泰山之巅展开算计对决！',
        type: 'boss', targetEnemy: 'shadow_master',
        reward: { exp:1200, silver:300, contrib:40 },
        warEnd: true,
        outcomes: {
          win:  '鬼谷门赢得了情报霸主地位！',
          lose: '凌霄阁在这场暗战中占了上风。',
        },
      },
    ],
    requirements: { minLevel:25, minFame:20, requiredSect: ['guigu','lingxiao','tangmen','xiaoyao'] },
  },

  // ── 海沙派 vs 南宫世家 ──
  'war_haisha_vs_nangong': {
    id: 'war_haisha_vs_nangong',
    name: '沿海烽烟',
    icon: '⚓',
    desc: '海沙派大举入侵沿海城镇，南宫世家联合正道力量抵御。',
    type: 'sect',
    stages: [
      {
        id: 'hsng_1', name: '海寇登陆',
        desc: '海沙派三千海贼登陆沿海，需阻击。',
        type: 'kill', targetCount: 10,
        targetEnemyPool: ['bandit_foot','pirate_raider','sea_monster'],
        reward: { exp:400, silver:100, contrib:15 },
      },
      {
        id: 'hsng_2', name: '水寨攻防',
        desc: '海沙派龙王寨固若金汤，需要正面攻破。',
        type: 'dungeon', targetDungeon: 'pirate_fortress',
        reward: { exp:600, silver:150, contrib:25 },
      },
      {
        id: 'hsng_3', name: '海上决战',
        desc: '海沙派帮主率领旗舰与南宫世家的水师决战！',
        type: 'boss', targetEnemy: 'bandit_chief_cangzhou',
        reward: { exp:1300, silver:350, contrib:45 },
        warEnd: true,
        outcomes: {
          win:  '南宫世家成功击退海沙派！沿海恢复和平。',
          lose: '海沙派占领了沿海重要城镇。',
        },
      },
    ],
    requirements: { minLevel:25, minFame:20, requiredSect: ['nangong','shaolin','emei','shengguang'] },
  },
};

// ═══════════════════════════════════════════════════
//  三、存档
// ═══════════════════════════════════════════════════

var SW_SAVE_KEY = 'wuxia_sect_war';

// 门派关系动态值存档 key（独立于事件存档）
var SW_REL_SAVE_KEY = 'wuxia_sect_war_relations';

function swLoad(){
  try { return JSON.parse(localStorage.getItem(SW_SAVE_KEY) || '{}'); }
  catch(e){ return {}; }
}
function swSave(data){
  try { localStorage.setItem(SW_SAVE_KEY, JSON.stringify(data)); }
  catch(e){}
}

/** 加载门派关系动态值 { fromId_toId: number } */
function swLoadRelations(){
  try { return JSON.parse(localStorage.getItem(SW_REL_SAVE_KEY) || '{}'); }
  catch(e){ return {}; }
}
function swSaveRelations(data){
  try { localStorage.setItem(SW_REL_SAVE_KEY, JSON.stringify(data)); }
  catch(e){}
}

/** 获取两个门派之间的动态好感值（默认0） */
function swGetRelation(fromId, toId){
  var rels = swLoadRelations();
  return rels[fromId + '_' + toId] || 0;
}

/** 修改两个门派之间的动态好感值 */
function swChangeRelation(fromId, toId, delta){
  if(!delta) return;
  var rels = swLoadRelations();
  var key = fromId + '_' + toId;
  rels[key] = Math.max(-100, Math.min(100, (rels[key] || 0) + delta));
  swSaveRelations(rels);
}

// ═══════════════════════════════════════════════════
//  四、动态事件逻辑
// ═══════════════════════════════════════════════════

function _swTodayStr(){
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function _swCleanExpiredEvents(save){
  if(!save.activeEvents) return;
  var now = Date.now();
  Object.keys(save.activeEvents).forEach(function(key){
    if(save.activeEvents[key].endTime <= now){
      delete save.activeEvents[key];
    }
  });
}

function _swApplyEvent(event, sectId){
  var effect = event.effect || {};
  // 贡献
  if(effect.contrib && typeof edS !== 'undefined'){
    edS.sectContrib = (edS.sectContrib || 0) + effect.contrib;
    if(typeof saveProgress === 'function') saveProgress();
  }
  // 门派关系变化
  if(effect.relChange && Object.keys(effect.relChange).length > 0 && typeof SECTS !== 'undefined'){
    var sect = SECTS.find(function(s){ return s.id === sectId; });
    if(sect && sect.relations){
      var relMessages = [];
      Object.keys(effect.relChange).forEach(function(target){
        var delta = effect.relChange[target];
        if(!delta) return;
        if(target === '_allies' && sect.relations.allies){
          // 影响所有盟友关系
          sect.relations.allies.forEach(function(allyId){
            swChangeRelation(sectId, allyId, delta);
            swChangeRelation(allyId, sectId, delta); // 双向
          });
          relMessages.push('盟友关系' + (delta > 0 ? '+' : '') + delta);
        } else if(target === '_enemies' && sect.relations.enemies){
          // 影响所有敌对关系
          sect.relations.enemies.forEach(function(enemyId){
            swChangeRelation(sectId, enemyId, delta);
            swChangeRelation(enemyId, sectId, delta);
          });
          relMessages.push('敌对关系' + (delta > 0 ? '+' : '') + delta);
        } else if(target === '_rivals' && sect.relations.rivals){
          // 影响所有对头关系
          sect.relations.rivals.forEach(function(rivalId){
            swChangeRelation(sectId, rivalId, delta);
            swChangeRelation(rivalId, sectId, delta);
          });
          relMessages.push('对头关系' + (delta > 0 ? '+' : '') + delta);
        } else {
          // 影响特定门派
          swChangeRelation(sectId, target, delta);
          swChangeRelation(target, sectId, delta);
          var targetSect = SECTS.find(function(s){ return s.id === target; });
          if(targetSect){
            relMessages.push(targetSect.name + (delta > 0 ? '+' : '') + delta);
          }
        }
      });
      if(relMessages.length > 0 && typeof showToast === 'function'){
        showToast('🔗 ' + relMessages.join('，'), 'info');
      }
    }
  }
  // 世界事件
  if(effect.worldEvent && typeof weAddEvent === 'function'){
    weAddEvent(effect.worldEvent.id, effect.worldEvent.tier || 'small', { sectId: sectId });
  }
  // 通知
  if(typeof showToast === 'function'){
    var sign = effect.contrib > 0 ? '+' : '';
    showToast(event.icon + ' ' + event.name + (effect.contrib ? '（贡献' + sign + effect.contrib + '）' : ''), effect.contrib > 0 ? 'ok' : 'warn');
  }
}

/** 每日轮询 */
function swRollDailyEvents(){
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return;

  var save = swLoad();
  var today = _swTodayStr();
  if(save.lastEventRoll === today) return;

  _swCleanExpiredEvents(save);

  var activeCount = Object.keys(save.activeEvents || {}).length;
  if(activeCount >= 3){ save.lastEventRoll = today; swSave(save); return; }

  var rollCount = Math.random() < 0.3 ? 2 : 1;
  var usedIds = new Set(Object.keys(save.activeEvents || {}));

  for(var i = 0; i < rollCount; i++){
    var available = SECT_EVENT_POOL.filter(function(e){ return !usedIds.has(e.id); });
    if(available.length === 0) break;

    var event = available[Math.floor(Math.random() * available.length)];
    var endTime = Date.now() + (event.duration || 3) * 86400000;

    if(!save.activeEvents) save.activeEvents = {};
    save.activeEvents[event.id] = {
      eventId: event.id,
      sectId: ed.sect,
      startTime: Date.now(),
      endTime: endTime,
      applied: false,
    };
    usedIds.add(event.id);
    _swApplyEvent(event, ed.sect);
  }

  save.lastEventRoll = today;
  swSave(save);
}

/** 获取活跃事件 */
function swGetActiveEvents(){
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return [];

  var save = swLoad();
  var now = Date.now();
  var events = [];

  Object.values(save.activeEvents || {}).forEach(function(ae){
    if(ae.endTime > now && ae.sectId === ed.sect){
      var tmpl = SECT_EVENT_POOL.find(function(e){ return e.id === ae.eventId; });
      if(tmpl){
        events.push({
          id: tmpl.id, type: tmpl.type, name: tmpl.name, icon: tmpl.icon,
          desc: tmpl.desc, effect: tmpl.effect,
          endTime: ae.endTime,
          remaining: Math.ceil((ae.endTime - now) / 86400000),
        });
      }
    }
  });
  return events;
}

// ═══════════════════════════════════════════════════
//  五、战争逻辑
// ═══════════════════════════════════════════════════

function swCanJoinWar(warId){
  var war = SECT_WAR_DB[warId];
  if(!war) return { ok:false, msg:'未知战争' };

  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed) return { ok:false, msg:'角色数据异常' };

  var req = war.requirements || {};
  if(ed.level < (req.minLevel || 1)){
    return { ok:false, msg:'需要等级 Lv.' + req.minLevel };
  }

  var save = swLoad();
  var warState = save.activeWars && save.activeWars[warId];
  if(warState && warState.completed){
    return { ok:false, msg:'此战争已结束' };
  }
  if(warState){
    return { ok:false, msg:'战争进行中' };
  }

  if(req.requiredSect && req.requiredSect.length > 0){
    if(!req.requiredSect.includes(ed.sect)){
      return { ok:false, msg:'仅限特定门派弟子参加' };
    }
  }

  if(req.requiredSectAlign && req.requiredSectAlign.length > 0){
    var sect = (typeof SECTS !== 'undefined') ? SECTS.find(function(s){ return s.id === ed.sect; }) : null;
    var align = sect ? sect.alignment : 'neutral';
    if(!req.requiredSectAlign.includes(align)){
      return { ok:false, msg:'仅限特定阵营门派弟子参加' };
    }
  }

  return { ok:true };
}

function swStartWar(warId){
  var check = swCanJoinWar(warId);
  if(!check.ok){
    if(typeof showToast === 'function') showToast(check.msg, 'warn');
    return;
  }

  var save = swLoad();
  if(!save.activeWars) save.activeWars = {};

  save.activeWars[warId] = {
    currentStage: 0, progress: 0,
    completed: false, startedAt: Date.now(),
  };
  swSave(save);

  var war = SECT_WAR_DB[warId];
  if(typeof weAddEvent === 'function'){
    weAddEvent('war_' + warId, 'major', { warId: warId });
  }

  if(typeof showToast === 'function'){
    showToast(war.icon + ' ' + war.name + ' — 战争开始！', 'ok');
  }

  // 刷新面板
  if(typeof renderSectWarPanel === 'function'){
    var sect = (typeof SECTS !== 'undefined') ? SECTS.find(function(s){ return s.id === edS.sect; }) : null;
    if(sect) renderSectWarPanel(sect);
  }
}

function swGetWarStage(warId){
  var war = SECT_WAR_DB[warId];
  if(!war) return null;

  var save = swLoad();
  var ws = save.activeWars && save.activeWars[warId];
  if(!ws) return null;

  var idx = ws.currentStage || 0;
  if(idx >= war.stages.length) return null;

  return {
    war: war, stage: war.stages[idx],
    progress: ws.progress || 0,
    stageNum: idx + 1,
    totalStages: war.stages.length,
  };
}

function swAddWarProgress(warId, amount){
  var save = swLoad();
  var ws = save.activeWars && save.activeWars[warId];
  if(!ws || ws.completed) return null;

  var war = SECT_WAR_DB[warId];
  if(!war) return null;

  var idx = ws.currentStage || 0;
  var stage = war.stages[idx];
  if(!stage) return null;

  // dungeon/boss 类型的阶段通常一次完成（targetCount 为 1 或未定义）
  var isOneShot = (stage.type === 'dungeon' || stage.type === 'boss' || stage.type === 'explore');
  if(isOneShot){
    // 一次性阶段：任何进度增量都直接完成该阶段
    ws.progress = 1;
  } else {
    ws.progress = (ws.progress || 0) + amount;
  }

  var target = stage.targetCount || 1;
  if(ws.progress >= target){
    // 阶段奖励
    if(stage.reward){
      if(stage.reward.exp && typeof gainExp === 'function') gainExp(stage.reward.exp);
      if(stage.reward.silver && typeof addSilver === 'function') addSilver(stage.reward.silver);
      if(stage.reward.contrib && typeof edS !== 'undefined'){
        edS.sectContrib = (edS.sectContrib || 0) + stage.reward.contrib;
        if(typeof saveProgress === 'function') saveProgress();
      }
    }
    ws.currentStage = idx + 1;
    ws.progress = 0;

    if(stage.warEnd || idx + 1 >= war.stages.length){
      ws.completed = true;
      if(!save.warHistory) save.warHistory = [];
      // 记录结果：最终阶段（boss战）的胜负由外部决定，默认记录为 win
      var outcomeKey = ws._outcome || 'win';
      save.warHistory.push({ warId: warId, result: outcomeKey, timestamp: Date.now() });
      swSave(save);
      return { type:'war_complete', war: war, outcome: stage.outcomes ? stage.outcomes[outcomeKey] : '战争结束' };
    }
    swSave(save);
    return { type:'stage_complete', nextStage: war.stages[idx + 1], war: war };
  }

  swSave(save);
  return { type:'progress', progress: ws.progress, target: target };
}

/** 设置战争最终结果（供外部在boss战结束后调用） */
function swSetWarOutcome(warId, outcome){
  if(outcome !== 'win' && outcome !== 'lose') outcome = 'win';
  var save = swLoad();
  var ws = save.activeWars && save.activeWars[warId];
  if(ws && ws.completed){
    ws._outcome = outcome;
    // 战争胜利：奖励1张门派卡
    if(outcome === 'win' && typeof swAddCardReward === 'function'){
      var card = swAddCardReward(edS && edS.sect);
      if(card && typeof showToast === 'function'){
        showToast('👑 战争胜利！获得门派卡【' + card.name + '】！');
      }
    }
    // 更新历史记录
    if(save.warHistory && save.warHistory.length > 0){
      var lastEntry = save.warHistory[save.warHistory.length - 1];
      if(lastEntry.warId === warId){
        lastEntry.result = outcome;
      }
    }
    swSave(save);
  }
}

// ═══════════════════════════════════════════════════
//  六、UI 渲染
// ═══════════════════════════════════════════════════

function renderSectEventsPanel(sect){
  var container = document.getElementById('tab-events');
  if(!container) return;

  var events = swGetActiveEvents();
  var html = '';

  html += '<div style="text-align:center;padding:12px 0 8px">';
  html += '<div style="font-size:18px;font-weight:bold;color:' + (sect.color || '#f0c060') + '">📜 门派动态</div>';
  html += '<div style="font-size:11px;color:var(--text3);margin-top:4px">门派每日随机事件，影响门派贡献与关系</div>';
  html += '</div>';

  if(events.length === 0){
    html += '<div style="text-align:center;padding:30px 0;color:var(--text3);font-size:12px">';
    html += '🌀 今日暂无门派动态<br><span style="font-size:10px;opacity:.5">进入城镇以触发新事件</span></div>';
  } else {
    events.forEach(function(ev){
      var remaining = ev.remaining || 0;
      html += '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:12px;margin:6px 8px">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div style="display:flex;align-items:center;gap:6px">';
      html += '<span style="font-size:18px">' + ev.icon + '</span>';
      html += '<span style="font-weight:bold;font-size:13px">' + ev.name + '</span></div>';
      html += '<span style="font-size:10px;color:var(--text3)">剩余' + remaining + '天</span></div>';
      html += '<div style="font-size:11px;color:var(--text3);margin-top:6px">' + ev.desc.replace(/{sect}/g, sect.name) + '</div>';
      if(ev.effect && ev.effect.contrib){
        var sign = ev.effect.contrib > 0 ? '+' : '';
        html += '<div style="font-size:10px;margin-top:4px;color:' + (ev.effect.contrib > 0 ? '#80e880' : '#ff6060') + '">🏛 贡献 ' + sign + ev.effect.contrib + '</div>';
      }
      html += '</div>';
    });
  }

  html += '<div style="text-align:center;padding:14px 8px;font-size:10px;color:var(--text3);opacity:.5">';
  html += '每日进入城镇自动触发 · 最多同时3个事件 · 过期自动清除</div>';
  container.innerHTML = html;
}

function renderSectWarPanel(sect){
  var container = document.getElementById('tab-war');
  if(!container) return;

  var save = swLoad();
  var html = '';

  html += '<div style="text-align:center;padding:12px 0 8px">';
  html += '<div style="font-size:18px;font-weight:bold;color:' + (sect.color || '#f0c060') + '">⚔️ 阵营战争</div>';
  html += '<div style="font-size:11px;color:var(--text3);margin-top:4px">门派间的战争与冲突，参与可获得大量贡献</div>';
  html += '</div>';

  // 进行中的战争
  var activeWars = Object.keys(save.activeWars || {}).filter(function(wid){ return !save.activeWars[wid].completed; });

  if(activeWars.length > 0){
    activeWars.forEach(function(warId){
      var info = swGetWarStage(warId);
      if(!info) return;
      var war = info.war, stage = info.stage, progress = info.progress;
      var target = stage.targetCount || 1;
      var pct = Math.min(100, Math.round((progress / target) * 100));

      html += '<div style="background:rgba(255,100,100,.06);border:1px solid rgba(255,100,100,.2);border-radius:10px;padding:14px;margin:8px">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div style="display:flex;align-items:center;gap:6px">';
      html += '<span style="font-size:20px">' + war.icon + '</span>';
      html += '<span style="font-weight:bold;font-size:14px;color:#ff8080">' + war.name + '</span></div>';
      html += '<span style="font-size:10px;color:var(--text3)">第' + info.stageNum + '/' + info.totalStages + '阶段</span></div>';
      html += '<div style="font-size:12px;color:var(--text3);margin:8px 0">' + stage.desc + '</div>';
      html += '<div style="background:rgba(0,0,0,.3);border-radius:4px;height:8px;overflow:hidden">';
      html += '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#ff6060,#ff4040);border-radius:4px"></div></div>';
      html += '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-top:4px">';
      html += '<span>' + stage.name + '</span><span>' + progress + '/' + target + '</span></div></div>';
    });
  }

  // 可加入的战争
  var completedWars = (save.warHistory || []).map(function(w){ return w.warId; });
  var availableWars = Object.keys(SECT_WAR_DB).filter(function(wid){
    return !completedWars.includes(wid) && !activeWars.includes(wid);
  });

  if(availableWars.length > 0){
    html += '<div style="font-size:12px;color:var(--text3);padding:10px 8px 4px">可参与的战争：</div>';
    availableWars.forEach(function(warId){
      var war = SECT_WAR_DB[warId];
      var check = swCanJoinWar(warId);
      html += '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px;margin:6px 8px">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div style="display:flex;align-items:center;gap:6px">';
      html += '<span style="font-size:20px">' + war.icon + '</span>';
      html += '<span style="font-weight:bold;font-size:14px">' + war.name + '</span></div>';
      if(!check.ok){
        html += '<span style="font-size:10px;color:#ffaa40;background:#ffaa4018;padding:2px 8px;border-radius:8px">' + check.msg + '</span>';
      } else {
        html += '<span style="font-size:10px;color:#80e880;background:#80e88018;padding:2px 8px;border-radius:8px">可参加</span>';
      }
      html += '</div>';
      html += '<div style="font-size:11px;color:var(--text3);margin:6px 0">' + war.desc + '</div>';
      html += '<div style="font-size:10px;color:rgba(200,180,120,.6);margin:4px 0">';
      html += war.stages.map(function(s,i){ return (i+1)+'.'+s.name; }).join(' → ') + '</div>';
      if(check.ok){
        html += '<button onclick="swStartWar(\'' + warId + '\')" style="margin-top:8px;width:100%;padding:8px 0;border:none;border-radius:6px;background:rgba(255,100,100,.15);color:#ff8080;font-size:13px;cursor:pointer;font-weight:bold">⚔️ 参加战争</button>';
      }
      html += '</div>';
    });
  }

  if(availableWars.length === 0 && activeWars.length === 0){
    html += '<div style="text-align:center;padding:30px 0;color:var(--text3);font-size:12px">';
    html += '🕊️ 当前没有可参与的战争</div>';
  }

  // 历史
  var history = save.warHistory || [];
  if(history.length > 0){
    html += '<div style="font-size:12px;color:var(--text3);padding:10px 8px 4px;border-top:1px solid rgba(255,255,255,.06);margin-top:8px">战争历史：</div>';
    history.slice(-5).reverse().forEach(function(h){
      var war = SECT_WAR_DB[h.warId];
      if(!war) return;
      html += '<div style="font-size:11px;color:var(--text3);padding:4px 8px;display:flex;justify-content:space-between">';
      html += '<span>' + war.icon + ' ' + war.name + '</span><span style="color:#80e880">✅ 胜利</span></div>';
    });
  }

  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════
//  七、导出
// ═══════════════════════════════════════════════════

window.SECT_EVENT_POOL   = SECT_EVENT_POOL;
window.SECT_WAR_DB       = SECT_WAR_DB;
window.swRollDailyEvents = swRollDailyEvents;
window.swGetActiveEvents = swGetActiveEvents;
window.swCanJoinWar      = swCanJoinWar;
window.swStartWar        = swStartWar;
window.swGetWarStage     = swGetWarStage;
window.swAddWarProgress  = swAddWarProgress;
window.swSetWarOutcome   = swSetWarOutcome;
window.swGetRelation     = swGetRelation;
window.swChangeRelation  = swChangeRelation;
window.swLoadRelations   = swLoadRelations;
window.renderSectEventsPanel = renderSectEventsPanel;
window.renderSectWarPanel    = renderSectWarPanel;

})();
