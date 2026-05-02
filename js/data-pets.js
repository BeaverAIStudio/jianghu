/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  宠物系统数据定义 - data-pets.js
 *  江湖将将胡 · 灵宠系统
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物类型定义
// ═══════════════════════════════════════════════════════════════════════════════
const PET_TYPES = {
  // 战斗型 - 攻击/防御高，可参与战斗
  COMBAT: {
    id: 'combat',
    name: '战斗型',
    icon: '⚔️',
    desc: '勇猛善战，可协助主人攻击敌人',
    statGrowth: { atk: 1.5, def: 1.2, hp: 1.0, spd: 0.8, int: 0.5 }
  },
  // 辅助型 - 治疗/BUFF
  SUPPORT: {
    id: 'support',
    name: '辅助型',
    icon: '💚',
    desc: '擅长治疗与增益，是可靠的伙伴',
    statGrowth: { atk: 0.6, def: 0.8, hp: 1.2, spd: 1.0, int: 1.5 }
  },
  // 采集型 - 自动采集资源
  GATHER: {
    id: 'gather',
    name: '采集型',
    icon: '🎒',
    desc: '机敏灵活，擅长寻找各种资源',
    statGrowth: { atk: 0.5, def: 0.6, hp: 0.8, spd: 1.5, int: 1.2 }
  },
  // 特殊型 - 独特能力
  SPECIAL: {
    id: 'special',
    name: '特殊型',
    icon: '✨',
    desc: '拥有独特的神秘能力',
    statGrowth: { atk: 0.8, def: 0.8, hp: 0.8, spd: 1.0, int: 1.3 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物稀有度定义
// ═══════════════════════════════════════════════════════════════════════════════
const PET_RARITY = {
  COMMON: { id: 'common', name: '普通', color: '#9e9e9e', expMod: 1.0, maxLvl: 30 },
  RARE: { id: 'rare', name: '稀有', color: '#4caf50', expMod: 0.9, maxLvl: 40 },
  EPIC: { id: 'epic', name: '史诗', color: '#9c27b0', expMod: 0.8, maxLvl: 50 },
  LEGENDARY: { id: 'legendary', name: '传说', color: '#ff9800', expMod: 0.7, maxLvl: 60 },
  MYTHIC: { id: 'mythic', name: '神话', color: '#f44336', expMod: 0.6, maxLvl: 80 }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物数据库
// ═══════════════════════════════════════════════════════════════════════════════
const PET_DB = {
  // ═══════════════════════════════════════════════════════════════════════════
  //  战斗型宠物
  // ═══════════════════════════════════════════════════════════════════════════
  pet_wolf: {
    id: 'pet_wolf',
    name: '苍狼',
    type: 'COMBAT',
    rarity: 'COMMON',
    desc: '山林中的野狼，经过驯化后成为忠诚的伙伴',
    habitat: 'forest',
    catchRate: 0.4,
    baseStats: { atk: 12, def: 8, hp: 60, spd: 10, int: 5 },
    skills: ['skill_bite', 'skill_howl'],
    ascii: 'wolf',
    food: 'meat'
  },
  pet_tiger: {
    id: 'pet_tiger',
    name: '猛虎',
    type: 'COMBAT',
    rarity: 'RARE',
    desc: '百兽之王，威风凛凛',
    habitat: 'mountain',
    catchRate: 0.25,
    baseStats: { atk: 20, def: 12, hp: 100, spd: 14, int: 8 },
    skills: ['skill_claw', 'skill_roar', 'skill_pounce'],
    ascii: 'tiger',
    food: 'meat'
  },
  pet_bear: {
    id: 'pet_bear',
    name: '棕熊',
    type: 'COMBAT',
    rarity: 'RARE',
    desc: '力大无穷，皮糙肉厚',
    habitat: 'forest',
    catchRate: 0.2,
    baseStats: { atk: 15, def: 20, hp: 120, spd: 6, int: 4 },
    skills: ['skill_slam', 'skill_tough'],
    ascii: 'bear',
    food: 'fish'
  },
  pet_dragon: {
    id: 'pet_dragon',
    name: '小火龙',
    type: 'COMBAT',
    rarity: 'LEGENDARY',
    desc: '传说中的生物幼崽，拥有吐火的能力',
    habitat: 'dungeon',
    catchRate: 0.05,
    baseStats: { atk: 30, def: 18, hp: 150, spd: 12, int: 20 },
    skills: ['skill_fireball', 'skill_dragon_roar', 'skill_wing_gust'],
    ascii: 'dragon',
    food: 'gem'
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  //  辅助型宠物
  // ═══════════════════════════════════════════════════════════════════════════
  pet_rabbit: {
    id: 'pet_rabbit',
    name: '灵兔',
    type: 'SUPPORT',
    rarity: 'COMMON',
    desc: '机灵的兔子，能感知危险',
    habitat: 'grassland',
    catchRate: 0.5,
    baseStats: { atk: 4, def: 4, hp: 30, spd: 18, int: 10 },
    skills: ['skill_heal', 'skill_alert'],
    ascii: 'rabbit',
    food: 'vegetable'
  },
  pet_deer: {
    id: 'pet_deer',
    name: '白鹿',
    type: 'SUPPORT',
    rarity: 'RARE',
    desc: '祥瑞之兽，能带来好运',
    habitat: 'forest',
    catchRate: 0.2,
    baseStats: { atk: 6, def: 8, hp: 60, spd: 16, int: 15 },
    skills: ['skill_bless', 'skill_purify', 'skill_luck'],
    ascii: 'deer',
    food: 'herb'
  },
  pet_fox: {
    id: 'pet_fox',
    name: '灵狐',
    type: 'SUPPORT',
    rarity: 'EPIC',
    desc: '通灵的狐狸，拥有迷惑敌人的能力',
    habitat: 'mountain',
    catchRate: 0.15,
    baseStats: { atk: 10, def: 8, hp: 50, spd: 20, int: 25 },
    skills: ['skill_charm', 'skill_illusion', 'skill_mana_share'],
    ascii: 'fox',
    food: 'meat'
  },
  pet_phoenix: {
    id: 'pet_phoenix',
    name: '雏凤',
    type: 'SUPPORT',
    rarity: 'LEGENDARY',
    desc: '凤凰幼鸟，拥有浴火重生的能力',
    habitat: 'special',
    catchRate: 0.03,
    baseStats: { atk: 18, def: 12, hp: 100, spd: 22, int: 30 },
    skills: ['skill_revive', 'skill_holy_flame', 'skill_nirvana'],
    ascii: 'phoenix',
    food: 'gem'
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  //  采集型宠物
  // ═══════════════════════════════════════════════════════════════════════════
  pet_squirrel: {
    id: 'pet_squirrel',
    name: '松鼠',
    type: 'GATHER',
    rarity: 'COMMON',
    desc: '喜欢收集各种坚果和小物件',
    habitat: 'forest',
    catchRate: 0.6,
    baseStats: { atk: 3, def: 3, hp: 25, spd: 15, int: 12 },
    skills: ['skill_gather', 'skill_search'],
    ascii: 'squirrel',
    food: 'nut'
  },
  pet_mole: {
    id: 'pet_mole',
    name: '穿山甲',
    type: 'GATHER',
    rarity: 'RARE',
    desc: '擅长挖掘，能找到地下的宝藏',
    habitat: 'mountain',
    catchRate: 0.25,
    baseStats: { atk: 8, def: 15, hp: 70, spd: 8, int: 10 },
    skills: ['skill_dig', 'skill_armor', 'skill_treasure'],
    ascii: 'mole',
    food: 'insect'
  },
  pet_monkey: {
    id: 'pet_monkey',
    name: '灵猴',
    type: 'GATHER',
    rarity: 'EPIC',
    desc: '聪明伶俐，能模仿主人的动作',
    habitat: 'forest',
    catchRate: 0.15,
    baseStats: { atk: 12, def: 8, hp: 55, spd: 25, int: 20 },
    skills: ['skill_steal', 'skill_mimic', 'skill_climb'],
    ascii: 'monkey',
    food: 'fruit'
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  //  特殊型宠物
  // ═══════════════════════════════════════════════════════════════════════════
  pet_turtle: {
    id: 'pet_turtle',
    name: '玄龟',
    type: 'SPECIAL',
    rarity: 'RARE',
    desc: '长寿的灵兽，背负神秘符文',
    habitat: 'water',
    catchRate: 0.2,
    baseStats: { atk: 6, def: 25, hp: 150, spd: 3, int: 18 },
    skills: ['skill_shell', 'skill_wisdom', 'skill_longevity'],
    ascii: 'turtle',
    food: 'herb'
  },
  pet_snake: {
    id: 'pet_snake',
    name: '灵蛇',
    type: 'SPECIAL',
    rarity: 'EPIC',
    desc: '神秘的蛇类，拥有剧毒',
    habitat: 'dungeon',
    catchRate: 0.12,
    baseStats: { atk: 18, def: 6, hp: 45, spd: 22, int: 15 },
    skills: ['skill_poison', 'skill_venom_spit', 'skill_shed'],
    ascii: 'snake',
    food: 'meat'
  },
  pet_panda: {
    id: 'pet_panda',
    name: '食铁兽',
    type: 'SPECIAL',
    rarity: 'LEGENDARY',
    desc: '上古异兽，看似憨态可掬，实则力大无穷',
    habitat: 'bamboo',
    catchRate: 0.08,
    baseStats: { atk: 25, def: 20, hp: 200, spd: 8, int: 12 },
    skills: ['skill_rolling', 'skill_iron_eater', 'skill_cuteness'],
    ascii: 'panda',
    food: 'bamboo'
  },
  pet_kirin: {
    id: 'pet_kirin',
    name: '幼麒麟',
    type: 'SPECIAL',
    rarity: 'MYTHIC',
    desc: '瑞兽麒麟的幼崽，祥瑞之兆',
    habitat: 'special',
    catchRate: 0.01,
    baseStats: { atk: 35, def: 25, hp: 180, spd: 20, int: 35 },
    skills: ['skill_holy_light', 'skill_omen', 'skill_miracle'],
    ascii: 'kirin',
    food: 'divine'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物技能定义
// ═══════════════════════════════════════════════════════════════════════════════
const PET_SKILLS = {
  // 战斗技能（cd=冷却回合数）
  skill_bite:        { id:'skill_bite',        name:'撕咬',    icon:'🦷', type:'attack', power:1.2,  cd:2, desc:'用尖牙撕咬敌人' },
  skill_claw:        { id:'skill_claw',        name:'利爪',    icon:'🪓', type:'attack', power:1.3,  cd:2, desc:'用利爪攻击' },
  skill_pounce:      { id:'skill_pounce',      name:'扑击',    icon:'🐾', type:'attack', power:1.5,  cd:3, desc:'猛扑向敌人' },
  skill_slam:        { id:'skill_slam',        name:'重击',    icon:'💥', type:'attack', power:1.4,  cd:3, desc:'用身体猛撞' },
  skill_roar:        { id:'skill_roar',        name:'咆哮',    icon:'🦁', type:'buff',   effect:'atk_up', cd:4, desc:'提升攻击力' },
  skill_howl:        { id:'skill_howl',        name:'嚎叫',    icon:'🐺', type:'dot',    power:0.08, dotDur:4, cd:4, desc:'降低敌人防御并造成持续伤害' },
  skill_fireball:    { id:'skill_fireball',    name:'火球术',  icon:'🔥', type:'magic',  power:2.0,  cd:4, desc:'吐出火球' },
  skill_dragon_roar: { id:'skill_dragon_roar', name:'龙吟',    icon:'🐉', type:'buff',   effect:'all_up', cd:5, desc:'全面提升属性' },
  skill_wing_gust:   { id:'skill_wing_gust',   name:'翼风',    icon:'🌪️', type:'magic',  power:1.6,  cd:3, desc:'扇动翅膀产生风暴' },
  skill_charm:       { id:'skill_charm',       name:'魅惑',    icon:'💋', type:'magic',  power:1.2,  cd:4, desc:'迷惑敌人降低攻击' },
  skill_illusion:    { id:'skill_illusion',    name:'幻术',    icon:'👻', type:'buff',   effect:'dodge_up', cd:4, desc:'制造分身提升闪避' },
  skill_shell:       { id:'skill_shell',       name:'缩壳',    icon:'🐢', type:'buff',   effect:'def_up', cd:4, desc:'缩入壳中大幅提升防御' },
  skill_purify:      { id:'skill_purify',      name:'净化',    icon:'✨', type:'heal',   power:0.3, cd:3, desc:'解除负面状态' },
  skill_shed:        { id:'skill_shed',        name:'蜕皮',    icon:'🐍', type:'heal',   power:0.4, cd:4, desc:'蜕皮恢复大量生命' },
  skill_cuteness:    { id:'skill_cuteness',    name:'卖萌',    icon:'🐼', type:'dot',    power:0.06, dotDur:3, cd:4, desc:'萌化敌人降低攻击' },

  // 辅助技能（治疗/BUFF）
  skill_heal:        { id:'skill_heal',        name:'治疗',    icon:'💚', type:'heal',   power:0.3,  cd:3, desc:'恢复主人生命' },
  skill_bless:       { id:'skill_bless',       name:'祝福',    icon:'🙏', type:'buff',   effect:'atk_up', cd:4, desc:'提升攻击力' },
  skill_luck:        { id:'skill_luck',        name:'幸运',    icon:'🍀', type:'passive', cd:0, desc:'被动提升掉落率' },
  skill_mana_share:  { id:'skill_mana_share',  name:'传功',    icon:'📖', type:'heal',   power:0.2, cd:4, desc:'恢复主人内力' },
  skill_revive:      { id:'skill_revive',      name:'涅槃',    icon:'🔥', type:'revive', cd:8, desc:'复活主人（每场战斗1次）' },
  skill_holy_flame:  { id:'skill_holy_flame',  name:'圣焰',    icon:'⚡', type:'magic',  power:1.8,  cd:4, desc:'神圣火焰攻击' },
  skill_nirvana:     { id:'skill_nirvana',     name:'浴火',    icon:'🌟', type:'heal',   power:0.5,  cd:5, desc:'大量恢复生命' },
  skill_holy_light:  { id:'skill_holy_light',  name:'圣光',    icon:'💫', type:'heal',   power:0.5,  cd:4, desc:'恢复全队生命' },
  skill_iron_eater:  { id:'skill_iron_eater',  name:'食铁',    icon:'⚙️', type:'buff',   effect:'def_up', cd:4, desc:'吃下铁块提升防御' },

  // 采集技能（被动/非战斗，cd=0）
  skill_gather:      { id:'skill_gather',      name:'采集',    icon:'🌿', type:'gather', cd:0, desc:'自动采集资源' },
  skill_search:      { id:'skill_search',      name:'搜寻',    icon:'🔍', type:'find',   cd:0, desc:'发现隐藏物品' },
  skill_dig:         { id:'skill_dig',         name:'挖掘',    icon:'⛏️', type:'gather', cd:0, desc:'挖掘地下资源' },
  skill_treasure:    { id:'skill_treasure',    name:'寻宝',    icon:'💎', type:'find',   cd:0, desc:'发现宝藏位置' },
  skill_steal:       { id:'skill_steal',       name:'妙手',    icon:'🖐️', type:'loot',   cd:0, desc:'战斗后额外掉落' },
  skill_mimic:       { id:'skill_mimic',       name:'模仿',    icon:'🎭', type:'copy',   cd:0, desc:'复制主人的一个技能' },
  skill_climb:       { id:'skill_climb',       name:'攀爬',    icon:'🧗', type:'access', cd:0, desc:'到达高处获取物品' },

  // 特殊被动
  skill_wisdom:      { id:'skill_wisdom',      name:'智慧',    icon:'📚', type:'passive', cd:0, desc:'提升经验获取' },
  skill_longevity:   { id:'skill_longevity',   name:'长寿',    icon:'🌳', type:'passive', cd:0, desc:'提升生命上限' },
  skill_poison:      { id:'skill_poison',      name:'剧毒',    icon:'☠️', type:'dot',    power:0.1,  dotDur:3, cd:3, desc:'使敌人中毒' },
  skill_venom_spit:  { id:'skill_venom_spit',  name:'毒液',    icon:'🐍', type:'dot',    power:0.15, dotDur:3, cd:4, desc:'喷射毒液' },
  skill_omen:        { id:'skill_omen',        name:'预兆',    icon:'🔮', type:'passive', cd:0, desc:'提升闪避率' },
  skill_miracle:     { id:'skill_miracle',     name:'奇迹',    icon:'🌈', type:'special', cd:0, desc:'极低概率触发奇迹效果' },

  // 进化新增技能（已在 PET_EVOLUTIONS 中引用）
  skill_alert:       { id:'skill_alert',       name:'警觉',    icon:'👀', type:'buff',   effect:'dodge_up', cd:4, desc:'提升主人闪避' },
  skill_tough:       { id:'skill_tough',       name:'硬皮',    icon:'🛡️', type:'buff',   effect:'def_up',   cd:4, desc:'大幅提升防御' },

};

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物食物定义
// ═══════════════════════════════════════════════════════════════════════════════
const PET_FOODS = {
  meat: { id: 'meat', name: '鲜肉', icon: '🥩', satiety: 30, happiness: 10, desc: '新鲜的肉类' },
  fish: { id: 'fish', name: '鲜鱼', icon: '🐟', satiety: 25, happiness: 15, desc: '刚捕的鱼' },
  vegetable: { id: 'vegetable', name: '蔬菜', icon: '🥬', satiety: 15, happiness: 5, desc: '新鲜蔬菜' },
  fruit: { id: 'fruit', name: '水果', icon: '🍎', satiety: 20, happiness: 20, desc: '甜美水果' },
  nut: { id: 'nut', name: '坚果', icon: '🥜', satiety: 20, happiness: 15, desc: '香脆坚果' },
  herb: { id: 'herb', name: '草药', icon: '🌿', satiety: 10, happiness: 5, desc: '有益草药' },
  insect: { id: 'insect', name: '虫子', icon: '🐛', satiety: 15, happiness: 10, desc: '蛋白质丰富' },
  bamboo: { id: 'bamboo', name: '竹子', icon: '🎋', satiety: 25, happiness: 25, desc: '鲜嫩竹笋' },
  gem: { id: 'gem', name: '宝石', icon: '💎', satiety: 50, happiness: 50, desc: '珍贵宝石（龙族最爱）' },
  divine: { id: 'divine', name: '仙果', icon: '🍑', satiety: 100, happiness: 100, desc: '天界仙果' }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物道具定义
// ═══════════════════════════════════════════════════════════════════════════════
const PET_ITEMS = {
  item_pet_cage: { id: 'item_pet_cage', name: '捕兽笼', icon: '📦', desc: '用来捕捉野生宠物', price: 50 },
  item_pet_food: { id: 'item_pet_food', name: '宠物口粮', icon: '🍖', desc: '通用宠物食物', price: 10 },
  item_pet_toy: { id: 'item_pet_toy', name: '宠物玩具', icon: '🎾', desc: '增加宠物快乐度', price: 30 },
  item_pet_potion: { id: 'item_pet_potion', name: '灵宠丹', icon: '💊', desc: '恢复宠物生命', price: 50 },
  item_pet_exp_pill: { id: 'item_pet_exp_pill', name: '经验丹', icon: '🧪', desc: '增加宠物经验', price: 100 },
  item_pet_evolve: { id: 'item_pet_evolve', name: '进化石', icon: '🔮', desc: '帮助宠物进化', price: 500 }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物装备定义（护符/战甲/坐骑三大类）
// ═══════════════════════════════════════════════════════════════════════════════
const PET_EQUIP_SLOTS = ['amulet', 'armor', 'mount'];
const PET_EQUIP_NAMES = {
  amulet: { name: '护符', icon: '📿' },
  armor:  { name: '战甲', icon: '🛡️' },
  mount:  { name: '坐骑', icon: '🏇' }
};

const PET_EQUIPS = {
  // ── 护符（主属性加成）────────────────────────────────────────────
  pe_health_charm:    { id:'pe_health_charm',    slot:'amulet', tier:'common',     name:'生命符',    icon:'💚', stats:{ hp:20 },             desc:'气血+20' },
  pe_atk_charm:      { id:'pe_atk_charm',        slot:'amulet', tier:'common',     name:'攻击符',    icon:'⚔️', stats:{ atk:8 },              desc:'攻击+8' },
  pe_def_charm:      { id:'pe_def_charm',        slot:'amulet', tier:'common',     name:'防御符',    icon:'🛡', stats:{ def:8 },              desc:'防御+8' },
  pe_spd_charm:      { id:'pe_spd_charm',        slot:'amulet', tier:'common',     name:'敏捷符',    icon:'⚡', stats:{ spd:5 },              desc:'速度+5' },
  pe_health_charm_r: { id:'pe_health_charm_r',  slot:'amulet', tier:'rare',       name:'精制生命符', icon:'💠', stats:{ hp:50 },             desc:'气血+50' },
  pe_atk_charm_r:    { id:'pe_atk_charm_r',      slot:'amulet', tier:'rare',       name:'精制攻击符', icon:'🔱', stats:{ atk:18 },            desc:'攻击+18' },
  pe_lucky_charm:    { id:'pe_lucky_charm',      slot:'amulet', tier:'epic',       name:'幸运符',    icon:'🍀', stats:{ atk:5, spd:5, int:5 },  desc:'攻击/速度/悟性+5' },
  pe_dragon_charm:   { id:'pe_dragon_charm',     slot:'amulet', tier:'legendary',  name:'龙纹护符',  icon:'🐉', stats:{ atk:30, hp:30 },      desc:'攻击+30 气血+30' },
  // ── 战甲（防御/生命加成）──────────────────────────────────────────
  pe_leather_armor:   { id:'pe_leather_armor',   slot:'armor', tier:'common',     name:'皮甲',      icon:'🤎', stats:{ def:5, hp:15 },        desc:'防御+5 气血+15' },
  pe_iron_armor:      { id:'pe_iron_armor',      slot:'armor', tier:'rare',        name:'铁甲',      icon:'🔩', stats:{ def:12, hp:35 },       desc:'防御+12 气血+35' },
  pe_jade_armor:      { id:'pe_jade_armor',      slot:'armor', tier:'epic',        name:'玉甲',      icon:'💚', stats:{ def:20, hp:60, int:5 }, desc:'防御+20 气血+60 悟性+5' },
  pe_phoenix_armor:   { id:'pe_phoenix_armor',   slot:'armor', tier:'legendary',   name:'凤羽战甲',  icon:'🔥', stats:{ def:30, hp:80 },       desc:'防御+30 气血+80' },
  // ── 坐骑（速度/特殊加成）─────────────────────────────────────────
  pe_horse_mount:     { id:'pe_horse_mount',     slot:'mount', tier:'common',      name:'马匹',      icon:'🐎', stats:{ spd:8 },             desc:'速度+8' },
  pe_eagle_mount:     { id:'pe_eagle_mount',     slot:'mount', tier:'rare',        name:'鹰',        icon:'🦅', stats:{ spd:15, atk:5 },       desc:'速度+15 攻击+5' },
  pe_cloud_mount:     { id:'pe_cloud_mount',     slot:'mount', tier:'epic',        name:'云兽',      icon:'☁️', stats:{ spd:25, int:10 },     desc:'速度+25 悟性+10' },
  pe_kirin_mount:     { id:'pe_kirin_mount',     slot:'mount', tier:'legendary',   name:'麒麟坐骑',  icon:'🦄', stats:{ spd:35, atk:15, hp:50 }, desc:'速度+35 攻击+15 气血+50' },
};

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物进化树（宠物ID → 可进化形态）
//  每只宠物可进化1-2次，每次需要：最低等级 + 进化石数量
// ═══════════════════════════════════════════════════════════════════════════════
const PET_EVOLUTIONS = {
  // ── 战斗型进化链 ────────────────────────────────────────────────
  pet_wolf: {
    evolvedFrom: null,
    evolveTo: {
      pet_wolf_alpha: {
        name: '苍狼（头狼）',
        desc: '狼群之王，统领山林',
        levelReq: 15,
        items: [{ id: 'item_pet_evolve', count: 1 }],
        statsMult: { atk:1.5, def:1.3, hp:1.4, spd:1.2, int:1.0 },
        newSkill: 'skill_howl',
        ascii: 'wolf'
      }
    }
  },
  pet_wolf_alpha: {
    evolvedFrom: 'pet_wolf',
    evolveTo: null
  },
  pet_tiger: {
    evolvedFrom: null,
    evolveTo: {
      pet_tiger_king: {
        name: '猛虎（虎王）',
        desc: '百兽之王，威震山河',
        levelReq: 25,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.6, def:1.4, hp:1.5, spd:1.3, int:1.1 },
        newSkill: 'skill_roar',
        ascii: 'tiger'
      }
    }
  },
  pet_tiger_king: { evolvedFrom:'pet_tiger', evolveTo:null },
  pet_bear: {
    evolvedFrom: null,
    evolveTo: {
      pet_bear_king: {
        name: '棕熊（熊王）',
        desc: '力大无穷，铜墙铁壁',
        levelReq: 25,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.4, def:1.6, hp:1.6, spd:1.0, int:1.0 },
        newSkill: 'skill_tough',
        ascii: 'bear'
      }
    }
  },
  pet_bear_king: { evolvedFrom:'pet_bear', evolveTo:null },
  pet_dragon: {
    evolvedFrom: null,
    evolveTo: {
      pet_dragon_true: {
        name: '火龙',
        desc: '真正的龙族，吐息毁灭',
        levelReq: 40,
        items: [{ id: 'item_pet_evolve', count: 3 }],
        statsMult: { atk:1.8, def:1.5, hp:1.6, spd:1.4, int:1.5 },
        newSkill: 'skill_dragon_roar',
        ascii: 'dragon'
      }
    }
  },
  pet_dragon_true: { evolvedFrom:'pet_dragon', evolveTo:null },
  // ── 辅助型进化链 ────────────────────────────────────────────────
  pet_rabbit: {
    evolvedFrom: null,
    evolveTo: {
      pet_rabbit_sacred: {
        name: '灵兔（仙兔）',
        desc: '月宫玉兔，灵性十足',
        levelReq: 15,
        items: [{ id: 'item_pet_evolve', count: 1 }],
        statsMult: { atk:1.2, def:1.2, hp:1.3, spd:1.5, int:1.4 },
        newSkill: 'skill_alert',
        ascii: 'rabbit'
      }
    }
  },
  pet_rabbit_sacred: { evolvedFrom:'pet_rabbit', evolveTo:null },
  pet_deer: {
    evolvedFrom: null,
    evolveTo: {
      pet_deer_sacred: {
        name: '白鹿（神鹿）',
        desc: '神兽白鹿，祥瑞之兆',
        levelReq: 20,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.3, def:1.3, hp:1.4, spd:1.4, int:1.6 },
        newSkill: 'skill_bless',
        ascii: 'deer'
      }
    }
  },
  pet_deer_sacred: { evolvedFrom:'pet_deer', evolveTo:null },
  pet_fox: {
    evolvedFrom: null,
    evolveTo: {
      pet_fox_celestial: {
        name: '灵狐（妖狐）',
        desc: '九尾灵狐，魅惑众生',
        levelReq: 30,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.4, def:1.3, hp:1.3, spd:1.6, int:1.7 },
        newSkill: 'skill_illusion',
        ascii: 'fox'
      }
    }
  },
  pet_fox_celestial: { evolvedFrom:'pet_fox', evolveTo:null },
  pet_phoenix: {
    evolvedFrom: null,
    evolveTo: {
      pet_phoenix_true: {
        name: '凤凰',
        desc: '浴火重生，永恒之焰',
        levelReq: 45,
        items: [{ id: 'item_pet_evolve', count: 3 }],
        statsMult: { atk:1.6, def:1.4, hp:1.5, spd:1.5, int:1.8 },
        newSkill: 'skill_nirvana',
        ascii: 'phoenix'
      }
    }
  },
  pet_phoenix_true: { evolvedFrom:'pet_phoenix', evolveTo:null },
  // ── 采集型进化链 ────────────────────────────────────────────────
  pet_squirrel: {
    evolvedFrom: null,
    evolveTo: {
      pet_squirrel_master: {
        name: '松鼠（收藏家）',
        desc: '收藏一切珍奇之物',
        levelReq: 15,
        items: [{ id: 'item_pet_evolve', count: 1 }],
        statsMult: { atk:1.2, def:1.2, hp:1.2, spd:1.5, int:1.5 },
        newSkill: 'skill_search',
        ascii: 'squirrel'
      }
    }
  },
  pet_squirrel_master: { evolvedFrom:'pet_squirrel', evolveTo:null },
  pet_mole: {
    evolvedFrom: null,
    evolveTo: {
      pet_mole_king: {
        name: '穿山甲（穴王）',
        desc: '穿山越岭，探宝无数',
        levelReq: 20,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.3, def:1.5, hp:1.4, spd:1.3, int:1.3 },
        newSkill: 'skill_treasure',
        ascii: 'mole'
      }
    }
  },
  pet_mole_king: { evolvedFrom:'pet_mole', evolveTo:null },
  pet_monkey: {
    evolvedFrom: null,
    evolveTo: {
      pet_monkey_sage: {
        name: '灵猴（猴王）',
        desc: '齐天大圣转世',
        levelReq: 30,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.5, def:1.3, hp:1.3, spd:1.6, int:1.5 },
        newSkill: 'skill_mimic',
        ascii: 'monkey'
      }
    }
  },
  pet_monkey_sage: { evolvedFrom:'pet_monkey', evolveTo:null },
  // ── 特殊型进化链 ────────────────────────────────────────────────
  pet_turtle: {
    evolvedFrom: null,
    evolveTo: {
      pet_turtle_immortal: {
        name: '玄龟（灵龟）',
        desc: '千年灵龟，寿与天齐',
        levelReq: 20,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.2, def:1.6, hp:1.7, spd:1.1, int:1.4 },
        newSkill: 'skill_longevity',
        ascii: 'turtle'
      }
    }
  },
  pet_turtle_immortal: { evolvedFrom:'pet_turtle', evolveTo:null },
  pet_snake: {
    evolvedFrom: null,
    evolveTo: {
      pet_snake_boa: {
        name: '灵蛇（巨蟒）',
        desc: '吞象巨蟒，毒冠天下',
        levelReq: 30,
        items: [{ id: 'item_pet_evolve', count: 2 }],
        statsMult: { atk:1.6, def:1.2, hp:1.3, spd:1.5, int:1.3 },
        newSkill: 'skill_venom_spit',
        ascii: 'snake'
      }
    }
  },
  pet_snake_boa: { evolvedFrom:'pet_snake', evolveTo:null },
  pet_panda: {
    evolvedFrom: null,
    evolveTo: {
      pet_panda_true: {
        name: '食铁兽（霸王）',
        desc: '上古异兽，霸气无双',
        levelReq: 35,
        items: [{ id: 'item_pet_evolve', count: 3 }],
        statsMult: { atk:1.7, def:1.6, hp:1.8, spd:1.2, int:1.2 },
        newSkill: 'skill_iron_eater',
        ascii: 'panda'
      }
    }
  },
  pet_panda_true: { evolvedFrom:'pet_panda', evolveTo:null },
  pet_kirin: {
    evolvedFrom: null,
    evolveTo: null  // 神话宠物不再进化
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  经验值表（每级所需经验）
// ═══════════════════════════════════════════════════════════════════════════════
function getPetExpForLevel(level) {
  return Math.floor(100 * Math.pow(1.2, level - 1));
}

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物状态效果
// ═══════════════════════════════════════════════════════════════════════════════
const PET_STATUS = {
  HUNGRY: { id: 'hungry', name: '饥饿', icon: '😰', desc: '需要喂食', effect: 'stats_down' },
  UNHAPPY: { id: 'unhappy', name: '不开心', icon: '😢', desc: '需要玩耍', effect: 'exp_down' },
  TIRED: { id: 'tired', name: '疲惫', icon: '😴', desc: '需要休息', effect: 'no_battle' },
  SICK: { id: 'sick', name: '生病', icon: '🤒', desc: '需要治疗', effect: 'all_down' },
  EXCITED: { id: 'excited', name: '兴奋', icon: '🤩', desc: '状态极佳', effect: 'stats_up' },
  BONDED: { id: 'bonded', name: '亲密', icon: '❤️', desc: '与主人心意相通', effect: 'skill_boost' }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  导出（如果在模块环境中）
// ═══════════════════════════════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PET_TYPES, PET_RARITY, PET_DB, PET_SKILLS, PET_FOODS, PET_ITEMS, getPetExpForLevel, PET_STATUS };
}
