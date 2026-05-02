// js/sect-card-bonus.js — 门派×手牌系统核心融合
// 功能：12门派专属手牌风格 / 建筑加成注入 / 天赋加成注入 / 声望专属卡
// 依赖：battle-cards.js(CardSystem) / data-sects.js(SECTS)
// ════════════════════════════════════════════════════════════════

// ── 一、门派手牌特权配置 ─────────────────────────────────────────────
// key = 门派id（与 SECTS[].id 对应）
const SECT_CARD_BONUS = {

  // ══ 正道三甲 ══════════════════════════════════════════════════

  shaolin: {
    school: 'buddha',
    pityGuarantee: true,        // 每次摸牌保底1张佛系或通用
    ningEffect: 'stun',          // 凝触发：敌人眩晕1回合
    huBonus: { atk: 0.1, def: 0.05 }, // 连环：攻防双加成
    label: '禅武合一',
    color: '#e8a040',
  },

  wudang: {
    school: 'tao',
    shiExtraFree: 1,           // 势时额外免1张消耗
    freeMpSchool: 'tao',        // 道系顺子额外免MP
    huBonus: { atk: 0, def: 0.08 }, // 连环：纯防御加成
    comboEasy: true,            // 凑牌型难度降低（势检测宽松）
    label: '以柔克刚',
    color: '#60d8d8',
  },

  huashan: {
    school: 'sword',
    duiziMult: 1.8,             // 对子倍率×1.8（默认×1.5）
    criticalBonus: 'sword',    // 剑系牌暴击伤害+15%
    shadowStep: true,          // 出牌附带"虚晃"：敌人下次攻击-10%
    label: '剑道极致',
    color: '#80d8ff',
  },

  // ══ 邪道/中立 ══════════════════════════════════════════════════

  wudu: {
    school: 'poison',
    ningEffect: 'poison',       // 凝触发：附加中毒（每回合掉血）
    poisonStack: true,          // 毒叠层：多次凝加深中毒
    shadowCost: 0.85,           // 暗系牌MP消耗-15%
    label: '五毒共生',
    color: '#80e060',
  },

  tangmen: {
    school: 'shadow',
    unsealableSchool: 'shadow', // 暗系牌免疫BOSS封印
    shadowStep: true,           // 出牌附带虚晃
    critRateBonus: 0.05,        // 暗系牌暴击率+5%
    label: '暗器天下第一',
    color: '#a080c0',
  },

  mingjiao: {
    school: 'fire',
    ningEffect: 'burn',         // 凝触发：附加灼烧
    huEffect: 'burnAoE',         // 连环：全体灼烧2回合
    huBonus: { atk: 0.15, def: 0 }, // 连环：大幅攻击加成
    label: '圣火燃天',
    color: '#ff6020',
  },

  // ══ 中立奇门 ══════════════════════════════════════════════════

  taohua: {
    school: 'music',
    extraDraw: 1,               // 每场战斗开局额外1张手牌
    luckBoost: true,            // 魅力影响运势爆发概率
    comboEasy: true,            // 凑牌型更容易
    label: '聪颖无双',
    color: '#ffaacc',
  },

  xiaoyao: {
    school: 'wind',
    pityThreshold: 2,           // 运势保底阈值2回合（默认3）
    windEscape: true,           // 运势爆发时额外免疫1次伤害
    extraDraw: 1,               // 逍遥开局+1张
    label: '逍遥天地',
    color: '#80f0c0',
  },

  guigu: {
    school: 'fate',
    fatePeek: true,             // 开局可见顶牌1张
    fateRedirect: true,         // 运势爆发时重排手牌顺序
    huBonus: { atk: 0.05, def: 0.05 },
    label: '天人合一',
    color: '#8866cc',
  },

  // ══ 辅助型 ══════════════════════════════════════════════════════

  kunlun: {
    school: 'ice',
    ningEffect: 'freeze',       // 凝触发：冻结敌人1回合
    huBonus: { atk: 0, def: 0.12 }, // 连环：高防御
    defBreakResist: 0.2,         // 敌方防御削减抗性+20%
    label: '金刚剑法',
    color: '#aaddff',
  },

  emei: {
    school: 'holy',
    luckBoost: true,            // 运势爆发概率提升
    comboEasy: true,            // 凑牌型容易
    huBonus: { atk: 0.08, def: 0.08 }, // 连环：攻守均衡
    label: '圣洁峰巅',
    color: '#e8e8ff',
  },

  qingcheng: {
    school: 'shadow',
    shadowCost: 0.80,           // 暗系牌MP消耗-20%（比五毒更狠）
    stealthAttack: true,       // 暗系牌攻击附带偷袭加成
    unsealableSchool: 'shadow',
    label: '青城暗剑',
    color: '#66aa66',
  },
};

// ── 二、建筑手牌效果配置（对应 sect-building.js 的 SECT_BUILDINGS keys）───────
// key 必须与 SECT_BUILDINGS[].id 对齐！
const BUILDING_CARD_EFFECTS = {
  lecture_hall:    { cardLimitBonus:   [0, 1, 2, 3, 3],                     maxLevel: 4 },  // 藏经阁：手牌上限+1~3
  training_ground: { huDamageBonus:   [0, 0.05, 0.10, 0.15, 0.20, 0.25],   maxLevel: 5 },  // 演武场：连环伤害+5%~25%
  alchemy_room:    { swapCostReduce:  [0, 1, 2, 3, 4, 5],                  maxLevel: 5 },  // 炼丹房：换牌省气
  treasury:        { rarityUnlock:    [0, 0, 1, 2, 2, 3],                  maxLevel: 5 },  // 藏宝阁：稀有度解锁
};

// ── 三、门派天赋手牌节点（来自 sect-talent.js 注入）───────────────────
const CARD_TALENT_NODES = [
  { id: 'card_seed',   name: '初窥门径', cost: 100,
    desc: '学派手牌权重×1.2；摸牌时+5%概率见本学派出牌',
    effect: { schoolWeight: 1.2, peekChance: 0.05 } },
  { id: 'card_start',  name: '略知一二', cost: 300,
    desc: '每场战斗初始手牌+1（共5张开局）',
    effect: { startDrawBonus: 1 } },
  { id: 'card_duizi',  name: '渐入佳境', cost: 700,
    desc: '对子效果倍率+0.2（×1.5→×1.7）',
    effect: { duiziMultBonus: 0.2 } },
  { id: 'card_hold',   name: '小有所成', cost: 1400,
    desc: '藏牌蓄势时额外+5%防御（15%→20%，25%→30%）',
    effect: { holdDefBonus: 0.05 } },
  { id: 'card_hu',     name: '融会贯通', cost: 2600,
    desc: '门派学派连环额外+10%伤害',
    effect: { huAtkBonus: 0.10 } },
  { id: 'card_kezi',   name: '登堂入室', cost: 4000,
    desc: '出本学派刻子时，额外触发一次本学派基础效果',
    effect: { keziDouble: true } },
  { id: 'card_master', name: '大成',     cost: 6000,
    desc: '解锁本门绝学手牌（1张专属高威力技能）',
    effect: { unlockExclusive: true } },
];

// ── 四、声望专属卡池（按声望等级解锁）────────────────────────────────
const SECT_REP_UNLOCK = {
  cold:       0,  // 冷淡：无
  friendly:   1,  // 友好：普通卡×2
  allied:     2,  // 亲密盟友：精品卡×2
  sworn:      3,  // 生死之交：稀有卡×1
};

// ── 五、门派专属卡池（各门派独特技能）─────────────────────────────────
const SECT_EXCLUSIVE_CARDS = {

  shaolin: {
    common: [
      { id:'sl_c1', name:'少林罗汉拳', school:'buddha', mpCost:10, type:'damage',
        rarity:'common', cd:2, mult:1.2,
        desc:'佛系基础拳法' },
      { id:'sl_c2', name:'金钟罩', school:'buddha', mpCost:15, type:'buff',
        rarity:'common', cd:3,
        desc:'护体金钟，下回合受伤-25%', effect:{defBuff:0.25,dur:1} },
    ],
    epic: [
      { id:'sl_e1', name:'大力金刚指', school:'buddha', mpCost:22, type:'damage',
        rarity:'epic', cd:3, mult:2.0,
        desc:'佛系刻子时，下一回合攻击必定暴击', effect:{keziCrit:true} },
    ],
    legendary: [
      { id:'sl_l1', name:'易筋经', school:'buddha', mpCost:45, type:'heal',
        rarity:'legendary', cd:5,
        desc:'全队治疗，连环时附加2回合免疫控制', effect:{healMult:1.5,huImmune:true} },
    ],
  },

  wudang: {
    common: [
      { id:'wd_c1', name:'武当长拳', school:'tao', mpCost:10, type:'damage',
        rarity:'common', cd:2, mult:1.1,
        desc:'道系基础拳法' },
      { id:'wd_c2', name:'太极静功', school:'tao', mpCost:15, type:'heal',
        rarity:'common', cd:3,
        desc:'道系治疗，回复自身15%最大气血', effect:{healPct:0.15} },
    ],
    epic: [
      { id:'wd_e1', name:'太极拳法', school:'tao', mpCost:20, type:'damage',
        rarity:'epic', cd:3, mult:1.5,
        desc:'道系顺子时，本回合受伤-30%', effect:{shunziDefBonus:0.30} },
    ],
    legendary: [
      { id:'wd_l1', name:'太极剑阵', school:'tao', mpCost:40, type:'aoe',
        rarity:'legendary', cd:4,
        desc:'全体攻击，附带2回合减速', effect:{aoe:true,slowDur:2} },
    ],
  },

  huashan: {
    common: [
      { id:'hs_c1', name:'华山剑法', school:'sword', mpCost:12, type:'damage',
        rarity:'common', cd:2, mult:1.3,
        desc:'剑系基础剑法' },
      { id:'hs_c2', name:'清风剑式', school:'sword', mpCost:8, type:'buff',
        rarity:'common', cd:2,
        desc:'下回合攻击+15%', effect:{atkBuff:0.15,dur:1} },
    ],
    epic: [
      { id:'hs_e1', name:'夺命连环三仙剑', school:'sword', mpCost:25, type:'damage',
        rarity:'epic', cd:3, mult:0.8, hits:3,
        desc:'连续三剑，附带破防效果', effect:{ignoreDefense:true} },
    ],
    legendary: [
      { id:'hs_l1', name:'独孤九剑', school:'sword', mpCost:35, type:'damage',
        rarity:'legendary', cd:4, mult:3.0,
        desc:'剑系连环时无视敌方防御', effect:{huIgnoreDef:true} },
    ],
  },

  mingjiao: {
    common: [
      { id:'mj_c1', name:'烈焰掌', school:'fire', mpCost:12, type:'damage',
        rarity:'common', cd:2, mult:1.2,
        desc:'附加灼烧1回合', effect:{burn:true} },
      { id:'mj_c2', name:'圣火令', school:'fire', mpCost:18, type:'buff',
        rarity:'common', cd:3,
        desc:'攻击+20%，持续2回合', effect:{atkBuff:0.20,dur:2} },
    ],
    epic: [
      { id:'mj_e1', name:'乾坤大挪移', school:'fire', mpCost:25, type:'damage',
        rarity:'epic', cd:3, mult:2.2,
        desc:'连环时伤害×1.5', effect:{huDmgMult:1.5} },
    ],
    legendary: [
      { id:'mj_l1', name:'圣火令·终极', school:'fire', mpCost:45, type:'aoe',
        rarity:'legendary', cd:5,
        desc:'全体灼烧3回合，伤害爆炸', effect:{aoe:true,burnDur:3,burnPct:0.08} },
    ],
  },

  wudu: {
    common: [
      { id:'wdg_c1', name:'蜈蚣毒爪', school:'poison', mpCost:10, type:'damage',
        rarity:'common', cd:2, mult:1.0,
        desc:'附加中毒2回合', effect:{poison:true,dur:2} },
      { id:'wdg_c2', name:'百毒不侵', school:'poison', mpCost:15, type:'buff',
        rarity:'common', cd:4,
        desc:'免疫中毒1回合', effect:{poisonImmune:true} },
    ],
    epic: [
      { id:'wdg_e1', name:'五毒神掌', school:'poison', mpCost:22, type:'damage',
        rarity:'epic', cd:3, mult:1.8,
        desc:'刻子时中毒叠加两层', effect:{keziPoisonStack:2} },
    ],
    legendary: [
      { id:'wdg_l1', name:'万毒蚀天', school:'poison', mpCost:40, type:'damage',
        rarity:'legendary', cd:4, mult:2.5,
        desc:'全体中毒3回合，可叠加', effect:{aoe:true,poisonDur:3,stack:true} },
    ],
  },

  // 其他门派（可按需扩展，以下为占位模板）
  tangmen:  { common:[], epic:[], legendary:[] },
  taohua:   { common:[], epic:[], legendary:[] },
  xiaoyao:  { common:[], epic:[], legendary:[] },
  guigu:    { common:[], epic:[], legendary:[] },
  kunlun:   { common:[], epic:[], legendary:[] },
  emei:     { common:[], epic:[], legendary:[] },
  qingcheng:{ common:[], epic:[], legendary:[] },
};

// ═══════════════════════════════════════════════════════════════════════
//  六、核心工具函数
// ═══════════════════════════════════════════════════════════════════════

/**
 * 读取玩家当前门派手牌特权
 * @returns {object|null} SECT_CARD_BONUS[sectId] 或 null（无门派/无加成）
 */
function getPlayerSectBonus() {
  if (typeof edS === 'undefined' || !edS.sect) return null;
  return SECT_CARD_BONUS[edS.sect] || null;
}

/**
 * 读取玩家门派建筑加成（需读取 sect-building.js 存档）
 * @returns {object} 建筑手牌效果叠加值
 */
function getBuildingCardBonus() {
  const bonus = {
    cardLimit: 0,
    huDamage: 0,
    swapCostReduce: 0,
    rarityLevel: 0,
    maxPlayBonus: 0,
  };

  try {
    const raw = localStorage.getItem('wuxia_sect_building');
    if (!raw) return bonus;
    const state = JSON.parse(raw);
    const mySect = (typeof edS !== 'undefined') ? edS.sect : null;
    if (!mySect || !state[mySect]) return bonus;

    const bld = state[mySect].buildings || {};
    for (const [key, lvl] of Object.entries(bld)) {
      const cfg = BUILDING_CARD_EFFECTS[key];
      if (!cfg) continue;
      const safeLvl = Math.min(lvl, cfg.maxLevel);
      if (cfg.cardLimitBonus)   bonus.cardLimit      += cfg.cardLimitBonus[safeLvl] || 0;
      if (cfg.huDamageBonus)     bonus.huDamage        += cfg.huDamageBonus[safeLvl] || 0;
      if (cfg.swapCostReduce)   bonus.swapCostReduce  += cfg.swapCostReduce[safeLvl] || 0;
      if (cfg.rarityUnlock)     bonus.rarityLevel     = Math.max(bonus.rarityLevel, cfg.rarityUnlock[safeLvl] || 0);
      if (cfg.maxPlayBonus)     bonus.maxPlayBonus    += cfg.maxPlayBonus[safeLvl] || 0;
    }
  } catch (e) { /* 存档异常，返回空加成 */ }

  return bonus;
}

/**
 * 读取玩家门派天赋手牌节点加成
 * @returns {object} 天赋手牌效果叠加值
 */
function getTalentCardBonus() {
  const bonus = {
    schoolWeight: 1.0,
    startDrawBonus: 0,
    duiziMultBonus: 0,
    holdDefBonus: 0,
    huAtkBonus: 0,
    keziDouble: false,
    unlockExclusive: false,
    unlockedNodeIds: [],
  };

  try {
    const raw = localStorage.getItem('wuxia_sect_talent');
    if (!raw) return bonus;
    const state = JSON.parse(raw);
    const mySect = (typeof edS !== 'undefined') ? edS.sect : null;
    if (!mySect || !state[mySect]) return bonus;

    const nodes = state[mySect].unlockedNodes || [];
    for (const nodeId of nodes) {
      const node = CARD_TALENT_NODES.find(n => n.id === nodeId);
      if (!node) continue;
      bonus.unlockedNodeIds.push(nodeId);
      if (node.effect.schoolWeight)   bonus.schoolWeight    *= node.effect.schoolWeight;
      if (node.effect.startDrawBonus) bonus.startDrawBonus   += node.effect.startDrawBonus;
      if (node.effect.duiziMultBonus) bonus.duiziMultBonus  += node.effect.duiziMultBonus;
      if (node.effect.holdDefBonus)  bonus.holdDefBonus    += node.effect.holdDefBonus;
      if (node.effect.huAtkBonus)     bonus.huAtkBonus      += node.effect.huAtkBonus;
      if (node.effect.keziDouble)     bonus.keziDouble       = true;
      if (node.effect.unlockExclusive) bonus.unlockExclusive = true;
    }
  } catch (e) { /* 存档异常 */ }

  return bonus;
}

/**
 * 综合计算玩家手牌加成（门派+建筑+天赋）
 * @returns {object} 合并后的手牌加成
 */
function getFullCardBonus() {
  const sectBonus     = getPlayerSectBonus() || {};
  const bldBonus      = getBuildingCardBonus();
  const talentBonus   = getTalentCardBonus();
  return { sectBonus, bldBonus, talentBonus };
}

/**
 * 获取玩家门派声望等级（用于解锁专属卡池）
 * @returns {number} 0=冷淡 1=友好 2=亲密盟友 3=生死之交
 */
function getPlayerSectRepLevel() {
  try {
    const raw = localStorage.getItem('wuxia_sect_relations');
    if (!raw) return 0;
    const rel = JSON.parse(raw);
    const mySect = (typeof edS !== 'undefined') ? edS.sect : null;
    if (!mySect || !rel[mySect]) return 0;
    const rep = rel[mySect].reputation || 0;
    // reputation: -100~-20 cold / -19~19 neutral / 20~49 friendly / 50~79 allied / 80~100 sworn
    if (rep >= 80) return 3; // 生死之交
    if (rep >= 50) return 2; // 亲密盟友
    if (rep >= 20) return 1; // 友好
    return 0; // 冷淡
  } catch (e) { return 0; }
}

/**
 * 获取玩家当前可用的门派专属卡（按声望等级筛选）
 * @returns {Array} 可用专属卡列表
 */
function getAvailableExclusiveCards() {
  const sectId = (typeof edS !== 'undefined') ? edS.sect : null;
  if (!sectId || !SECT_EXCLUSIVE_CARDS[sectId]) return [];
  const repLevel = getPlayerSectRepLevel();
  const pool = SECT_EXCLUSIVE_CARDS[sectId];
  const available = [];
  if (repLevel >= 1) available.push(...(pool.common || []));
  if (repLevel >= 2) available.push(...(pool.epic || []));
  if (repLevel >= 3) available.push(...(pool.legendary || []));
  return available;
}

// ═══════════════════════════════════════════════════════════════════════
//  七、CardSystem 集成钩子
//  这些函数由 CardSystem 在初始化时调用
// ═══════════════════════════════════════════════════════════════════════

/**
 * 返回 CardSystem 初始化时的综合加成配置
 * @returns {object} 供 CardSystem.init() 使用
 */
function buildCardSystemBonus() {
  const { sectBonus, bldBonus, talentBonus } = getFullCardBonus();
  const exclusiveCards = getAvailableExclusiveCards();

  // 结拜手牌加成（每位兄弟+1上限，最多3）
  var swornCardBonus = 0;
  try {
    if (typeof swornGetBonuses === 'function') {
      var sworn = swornGetBonuses();
      swornCardBonus = sworn.cardLimitBonus || 0;
    }
  } catch (e) { /* not available */ }

  // 师徒手牌加成（师父在场时学派手牌+10%伤害）
  var masterSchoolBonus = 0;
  try {
    if (typeof getMasterApprenticeBonus === 'function') {
      var ma = getMasterApprenticeBonus(null);
      masterSchoolBonus = ma.masterSchoolBonus || 0;
    }
  } catch (e) { /* not available */ }

  return {
    sectBonus,
    schoolWeight: sectBonus.school || null,
    schoolWeightMult: talentBonus.schoolWeight,
    pityGuarantee: sectBonus.pityGuarantee || false,
    pityThreshold: sectBonus.pityThreshold || 3,
    extraDraw: (sectBonus.extraDraw || 0) + talentBonus.startDrawBonus,
    cardLimitBonus: (bldBonus.cardLimit || 0) + swornCardBonus,
    huDamageBonus: (sectBonus.huBonus?.atk || 0) + (bldBonus.huDamage || 0) + talentBonus.huAtkBonus + masterSchoolBonus,
    huDefBonus: (sectBonus.huBonus?.def || 0),
    holdDefBonus: talentBonus.holdDefBonus,
    duiziMultBonus: talentBonus.duiziMultBonus,
    ningEffect: sectBonus.ningEffect || sectBonus.keziEffect || null,
    keziDouble: talentBonus.keziDouble,
    unsealableSchool: sectBonus.unsealableSchool || null,
    exclusiveCards,
    rarityLevel: bldBonus.rarityLevel,
    maxPlayBonus: bldBonus.maxPlayBonus,
    // 特殊门派效果
    windEscape: sectBonus.windEscape || false,
    luckBoost: sectBonus.luckBoost || false,
    comboEasy: sectBonus.comboEasy || false,
    shadowCostMult: sectBonus.shadowCost || 1.0,
    critRateBonus: sectBonus.critRateBonus || 0,
    critBonusSchool: sectBonus.criticalBonus || null,
    stealthAttack: sectBonus.stealthAttack || false,
    huEffect: sectBonus.huEffect || null,
    label: sectBonus.label || null,
    swornCardBonus,
    masterSchoolBonus,
  };
}

/**
 * 将加成信息暴露到 window（供 battle.html initCardSystem 读取）
 */
window._playerSectBonus = null;
function refreshPlayerSectBonus() {
  window._playerSectBonus = buildCardSystemBonus();
}

// 首次加载时刷新一次
if (typeof document !== 'undefined') {
  refreshPlayerSectBonus();
}
