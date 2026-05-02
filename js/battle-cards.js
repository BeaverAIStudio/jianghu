/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ✦ 战法连击系统 — CardSystem
 *  功法组合式手牌 + 技能系统融合
 *  版本：v1.2 | 日期：2026-04-26
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 平衡性参数
// ═══════════════════════════════════════════════════════════════════════════

const CARD_BALANCE = {
  handLimit: 5,                  // 手牌上限
  drawPerTurn: 1,                // 每回合摸牌数
  initHandSize: 4,              // 初始手牌数
  maxPlayPerTurn: 3,            // 每回合最大出牌数（用户主动选择1~3张）
  secondCardMpMult: 0.7,        // 第2张牌内力消耗倍率
  thirdCardMpMult: 0.5,         // 第3张牌内力消耗倍率
  selectiveSwapCost: 10,        // 定向换牌：每张消耗气势
  fullSwapCost: 30,             // 全换牌消耗气势
  fullSwapMinCd2: true,         // 全换牌保底：至少1张CD≤2
  comboDuration: 2,             // 连环/凝效果持续回合数
  duiziMult: 1.5,               // 对子效果倍率
  huAtkBuff: 0.5,              // 连环攻击加成
  huDefDebuff: 0.3,            // 连环防御削减
  // 藏牌蓄势
  holdDefBonus1: 0.15,          // 第1回合藏牌防御加成
  holdDefBonus2: 0.25,         // 第2回合藏牌防御加成
  // 运势保底
  pityComboThreshold: 3,         // 连续未凑牌型触发保底回合数
  // BOSS封手
  bossSealStartPhase: 2,       // BOSS从哪个阶段开始可以使用封手
  bossSealInterval: 2,          // BOSS封手间隔回合数（阶段2）
  bossSealIntervalPhase3: 1,   // BOSS封手间隔回合数（阶段3）
  // 双层积累池配置
  accumThreshold: 3,            // 小积累池阈值（3个相同学派触发小加成）
  superMultValue: 2.5,         // 听牌后下一张伤害倍率
  bigPoolThreshold: 3,         // 大积累池阈值（3次小加成触发大连加成）
  // 小加成配置（每次小积累池满触发）
  smallBonusAtkMult: 0.15,     // 小加成：攻击提升15%
  smallBonusDefMult: 0.10,     // 小加成：防御提升10%
  smallBonusDuration: 2,       // 小加成持续回合数
  // 大加成配置（麻将规则，大积累池满触发）
  bigBonusAtkMult: 0.50,       // 大加成：攻击提升50%
  bigBonusDefMult: 0.30,       // 大加成：防御提升30%
  bigBonusCritRate: 0.20,      // 大加成：暴击率提升20%
  bigBonusCritMult: 0.25,      // 大加成：暴击伤害提升25%
  bigBonusDuration: 3,         // 大加成持续回合数
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 牌型枚举
// ═══════════════════════════════════════════════════════════════════════════

const CARD_COMBO = {
  JIANGJIANG_HU: { name: '连环', icon: '💥', threshold: '3同系', priority: 5, desc: '攻击+50%，敌防-30%，持续2回合' },
  KEZI:          { name: '凝',   icon: '✦', threshold: '3同技能', priority: 4, desc: '该技能CD归零，立刻再打' },
  SHUNZI:        { name: '势',   icon: '⚡', threshold: '同系3不同', priority: 3, desc: '内力消耗全免' },
  DUIZI:         { name: '对子',   icon: '👫', threshold: '2同技能', priority: 2, desc: '效果×1.5' },
  DANPAI:        { name: '单招',   icon: '',    threshold: '任意1张', priority: 1, desc: '正常效果' },
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 学派配色
// ═══════════════════════════════════════════════════════════════════════════

const SCHOOL_COLORS = {
  '剑系': '#c0c0e0',
  '佛系': '#ffd700',
  '道系': '#80d0ff',
  '力系': '#ff6040',
  '暗系': '#a040c0',
  '毒系': '#40c040',
  '冰系': '#a0e0ff',
  '火系': '#ff8030',
  '雷系': '#ffe040',
  '风系': '#90d090',
  '拳系': '#d09050',
  '通用': '#a0a0a0',
  '散人': '#909090',  // 通用卡进入积势池的标识色
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 花色系统（星月风云）
// ═══════════════════════════════════════════════════════════════════════════
const SUIT_TYPES = {
  star:  { id:'star',  name:'星', symbol:'☽', color:'#b088f9', wild:false },  // 淡紫
  moon:  { id:'moon',  name:'月', symbol:'☁', color:'#f0e68c', wild:false },  // 淡金
  wind:  { id:'wind',  name:'风', symbol:'☀', color:'#87cefa', wild:false },  // 淡蓝
  cloud:  { id:'cloud', name:'云', symbol:'☃', color:'#90ee90', wild:true  },  // 淡绿·万能
};
const SUIT_IDS = ['star', 'moon', 'wind', 'cloud'];

// 熟练度档位 → 花色权重 [星, 月, 风, 云]
// 索引对应 PROF_TIERS 的下标（0=入门 … 5=化境）
const PROF_SUIT_WEIGHTS = [
  // 入门(0):       星,  月,  风,  云
  [ 25, 25, 25, 25 ],
  // 小成(100):     星,  月,  风,  云
  [ 40, 20, 20, 20 ],
  // 大成(500):     星,  月,  风,  云
  [ 55, 15, 15, 15 ],
  // 炉火纯青(1500):星,  月,  风,  云
  [ 65, 10, 10, 15 ],
  // 登峰造极(4000):星,  月,  风,  云
  [ 73,  8,  8, 11 ],
  // 化境(10000):   星,  月,  风,  云
  [ 82,  5,  5,  8 ],
];

/**
 * 根据技能 actionType 和熟练度，按权重随机分配花色
 * @param {string} school - 技能学派
 * @param {string} actionType - quick/heavy/normal/block
 * @param {string} skillName - 技能名称（用于检测治疗/辅助）
 * @returns {string} suitId
 */
function assignSuit(school, actionType, skillName) {
  // 获取熟练度档位
  let profIdx = 0;
  if (typeof getProfTierIndex === 'function') {
    profIdx = getProfTierIndex(school);
  }
  const weights = PROF_SUIT_WEIGHTS[profIdx] || PROF_SUIT_WEIGHTS[0];

  // 根据 actionType 调整主花色倾向
  // 攻击类(quick/heavy/normal) → 星 加权
  // 防御类(block) → 月 加权
  // 功能类(heal/buff) → 风 加权
  const adjusted = [...weights];
  const name = (skillName || '').toLowerCase();
  const isHeal = name.includes('疗') || name.includes('治') || name.includes('回') ||
                 name.includes('heal') || name.includes('cure');
  const isBuff = name.includes('护') || name.includes('防') || name.includes('守') ||
                 name.includes('buff') || name.includes('增益');
  if (actionType === 'block' || isBuff) {
    // 月+15%，星-10%，风-5%
    adjusted[1] += 15; adjusted[0] -= 10; adjusted[2] -= 5;
  } else if (isHeal) {
    // 风+15%，星-5%，月-10%
    adjusted[2] += 15; adjusted[0] -= 5; adjusted[1] -= 10;
  } else {
    // 攻击：星+10%，月-5%，风-5%
    adjusted[0] += 10; adjusted[1] -= 5; adjusted[2] -= 5;
  }
  // 保证非负
  for (let i = 0; i < adjusted.length; i++) adjusted[i] = Math.max(0, adjusted[i]);

  const total = adjusted.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < adjusted.length; i++) {
    r -= adjusted[i];
    if (r <= 0) return SUIT_IDS[i];
  }
  return SUIT_IDS[SUIT_IDS.length - 1];
}

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 稀有度配置
// ═══════════════════════════════════════════════════════════════════════════

const RARITY_CONFIG = {
  common:    { icon: '📘', name: '普通',   effect: null,   border: '#888' },
  rare:      { icon: '📗', name: '精品',   effect: 'glow', border: '#2ecc71' },
  epic:      { icon: '📕', name: '稀有',   effect: 'shimmer', border: '#9b59b6' },
  legend:    { icon: '📙', name: '传说',   effect: 'legend', border: '#e67e22' },
  artifact:  { icon: '🌟', name: '神器',   effect: 'particles', border: '#e74c3c' },
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 手牌系统核心
// ═══════════════════════════════════════════════════════════════════════════

const CardSystem = {
  // ── 状态 ──
  hand: [],                      // 当前手牌 [{uid, skillId, school, name, icon, mpCost, type, cd, rarity, rarityIcon, rarityEffect, ...}]
  handLimit: CARD_BALANCE.handLimit,
  playedThisTurn: 0,            // 本回合已出牌数
  pool: [],                     // 摸牌池（玩家已学技能列表）
  active: false,                // 手牌系统是否激活
  isAnimating: false,           // 是否正在播放动画（防止重复操作）

  // ── 运势系统 ──
  fate: {
    noComboTurns: 0,            // 连续未凑成牌型回合数
    luckBoost: false,           // 运势爆发状态
    pitySchool: null,           // 保底学派
    lianhuanJinJi: 0,         // 连环运势大爆发剩余回合数
  },

  // ── 藏牌蓄势 ──
  holdingBonus: 0,              // 藏牌蓄势防御加成（0/0.15/0.25）
  holdTurns: 0,                 // 连续藏牌回合数
  _heldThisTurn: false,        // 本回合是否藏牌（用于onTurnEnd判断）

  // ── 听牌积累 ──
  _lastPlayedSchool: null,   // 本回合最后出牌的学派（供 onTurnEnd 积累）

  // ── BOSS封印 ──
  sealedCards: [],             // 被封印的手牌 [{uid, sealType, sealTurns}, ...]

  // ── 本场战斗效果 ──
  activeEffects: {
    lianhuanAtkBuff: 0,              // 连环攻击加成（剩余回合）
    lianhuanDefDebuff: 0,             // 连环敌防削减（剩余回合）
    ningFreeze: false,         // 凝冻结
    keziReset: null,           // 凝重置的技能ID
  },

  // ── 双层积累池（按花色分池）──
  smallPoolBySuit: { star: 0, moon: 0, wind: 0, cloud: 0 },  // 小积累池按花色计数
  smallPool: [],               // 兼容旧逻辑（记录本次战斗所有出牌的学派）
  // 大积累池按花色分池：每道花色独立记录小加成的牌型类型
  // 每种牌型: { comboType: 'lianhuan'|'ning'|'shi'|'duizi', suit: 'star'|'moon'|'wind'|'cloud' }
  bigPoolBySuit: { star: [], moon: [], wind: [], cloud: [] },
  // ── 听牌相关（兼容旧逻辑）──
  accumPool: [],               // 积累池（兼容旧代码）
  readySchool: null,            // 当前听牌状态：相同学派或null
  superMultActive: false,      // 听牌超级增幅是否激活（下一张生效）
  superMultUsed: false,         // 本回合是否已使用过超级增幅

  // ── 小连大连加成状态 ──
  smallBonusActive: false,      // 小加成是否激活
  bigBonusActive: false,       // 大加成是否激活
  bigBonusSchool: null,        // 大加成触发的学派

  // ── 选牌状态（定向换牌/组合出牌）──
  selectedCards: [],            // 当前选中的手牌uid列表

  // ── 门派加成（外部注入）──
  sectBonus: null,

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 初始化
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 初始化手牌系统
   * @param {Array} skills - 玩家已学技能列表（LH.skills）
   * @param {Object} options - 可选配置 { sectBonus, handLimit, extraDraw }
   */
  init(skills, options = {}) {
    this.reset();

    if (!skills || skills.length === 0) {
      console.warn('[CardSystem] 玩家无技能，无法激活手牌系统');
      return;
    }

    // ── 刷新门派/建筑/天赋加成（确保使用最新 edS）──
    if (typeof refreshPlayerSectBonus === 'function') {
      refreshPlayerSectBonus();
    }
    // 优先使用 window._playerSectBonus（最新），fallback 到 options.sectBonus
    const extraBonus = window._playerSectBonus || options.sectBonus || null;
    this.sectBonus = extraBonus;

    // ── 过滤普通攻击（不加入手牌池）──
    const battleSkills = skills.filter(s => s && s.type !== 'attack');
    if (battleSkills.length === 0) {
      console.warn('[CardSystem] 玩家无战斗技能（仅普通攻击），手牌系统禁用');
      return;
    }

    // ── 专属卡池注入（声望解锁）──
    if (extraBonus && extraBonus.exclusiveCards) {
      const exclusiveCards = extraBonus.exclusiveCards.map(s =>
        this._skillToCard({ ...s, id: s.id, name: s.name, school: s.school, mpCost: s.mpCost, type: s.type, cd: s.cd, mult: s.mult || 1, hits: s.hits, rarity: s.rarity, desc: s.desc || '' })
      );
      this.pool = battleSkills.map(s => this._skillToCard(s)).concat(exclusiveCards);
    } else {
      this.pool = battleSkills.map(s => this._skillToCard(s));
    }

    // 建筑/天赋加成
    const extraDraw = (extraBonus?.extraDraw || 0) + (extraBonus?.bldBonus?.extraDraw || 0);
    const buildLimit = extraBonus?.bldBonus?.cardLimit || 0;
    const customLimit = options.handLimit || CARD_BALANCE.handLimit;
    this.handLimit = customLimit + extraDraw + buildLimit;

    // 初始摸牌（含天赋起始加成）
    const startBonus = extraBonus?.talentBonus?.startDrawBonus || 0;
    const initCount = Math.min(CARD_BALANCE.initHandSize + startBonus, this.pool.length);
    for (let i = 0; i < initCount; i++) {
      this.hand.push(this._drawOne(true)); // 初始摸牌不触发保底
    }

    this.active = true;
    const sectLabel = extraBonus?.label || '无门派';
    console.log(`[CardSystem] 初始化完成：${this.hand.length}/${this.handLimit} 张手牌，门派加成：${sectLabel}`);
  },

  /**
   * 重置手牌系统（每场战斗开始时调用）
   */
  reset() {
    this.hand = [];
    this.playedThisTurn = 0;
    this.pool = [];
    this.active = false;
    this.isAnimating = false;
    this.selectedCards = [];
    this.fate = {
      noComboTurns: 0,
      luckBoost: false,
      pitySchool: null,
      lianhuanJinJi: 0,
    };
    this.holdingBonus = 0;
    this.holdTurns = 0;
    this._heldThisTurn = false;
    this.sealedCards = [];
    this.activeEffects = {
      lianhuanAtkBuff: 0,
      lianhuanDefDebuff: 0,
      ningFreeze: false,
      ningReset: null,
    };
    // ── 本回合出牌学派（供听牌积累）──
    this._lastPlayedSchool = null;
    // ── 双层积累池（按花色分池）──
    this.smallPoolBySuit = { star: 0, moon: 0, wind: 0, cloud: 0 };
    this.smallPool = [];    // 兼容旧逻辑
    // bigPoolBySuit: 按花色记录每次小加成触发时的牌型类型
    // 每个元素: { comboType: 'lianhuan'|'ning'|'shi'|'duizi', suit: 'star'|'moon'|'wind'|'cloud' }
    this.bigPoolBySuit = { star: [], moon: [], wind: [], cloud: [] };
    // ── 听牌相关（兼容旧逻辑）──
    this.accumPool = [];
    this.readySchool = null;
    this.superMultActive = false;
    this.superMultUsed = false;
    // ── 加成状态 ──
    this.smallBonusActive = false;
    this.bigBonusActive = false;
    this.bigBonusSchool = null;
    this.sectBonus = null;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 摸牌逻辑
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 摸牌（每回合结束调用）
   * @param {number} count - 摸牌数量
   */
  drawCards(count = 1) {
    if (!this.active) return;

    for (let i = 0; i < count; i++) {
      if (this.hand.length >= this.handLimit) break; // 手牌已满

      // 运势保底：强制插入
      if (this.fate.luckBoost && this.fate.pitySchool) {
        const pityCard = this._drawWithPity(this.fate.pitySchool);
        if (pityCard) {
          this.hand.push(pityCard);
          this.hand.sort((a, b) => (SCHOOL_COLORS[a.school] || '#888').localeCompare(SCHOOL_COLORS[b.school] || '#888'));
          continue;
        }
      }

      // 普通摸牌（带权重）
      const card = this._drawOne(false);
      if (card) {
        this.hand.push(card);
      }
    }

    // 排序
    this.hand.sort((a, b) => (SCHOOL_COLORS[a.school] || '#888').localeCompare(SCHOOL_COLORS[b.school] || '#888'));
  },

  /**
   * 从摸牌池抽取一张牌（带权重）
   * @param {boolean} initialDraw - 是否初始摸牌（初始摸牌不走运势）
   */
  _drawOne(initialDraw = false) {
    if (this.pool.length === 0) return null;

    // 计算权重
    const weights = this.pool.map(skill => this._calcDrawWeight(skill, initialDraw));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    if (totalWeight <= 0) {
      // 保底：随机返回一张
      return this._skillToCard(this.pool[Math.floor(Math.random() * this.pool.length)]);
    }

    // 加权随机
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < this.pool.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        return this._skillToCard(this.pool[i]);
      }
    }

    return this._skillToCard(this.pool[this.pool.length - 1]);
  },

  /**
   * 运势保底：从摸牌池中筛选目标学派的牌
   */
  _drawWithPity(targetSchool) {
    // 排除已封印的牌
    const sealedUids = this.sealedCards.map(s => s.uid);
    const available = this.pool.filter(s => {
      if (sealedUids.includes(this._makeUid(s.id))) return false;
      // 检查是否与手牌同学派
      return this.hand.some(c => c.school === s.school && s.school === targetSchool);
    });

    if (available.length > 0) {
      const chosen = available[Math.floor(Math.random() * available.length)];
      return this._skillToCard(chosen);
    }

    // 学派不对，退化到普通摸牌
    return this._drawOne(false);
  },

  /**
   * 计算摸牌权重
   */
  _calcDrawWeight(skill, initialDraw = false) {
    let weight = 1;

    // CD权重
    if (skill.cd <= 2) weight *= 3;
    else if (skill.cd <= 4) weight *= 2;
    else if (skill.cd >= 5) weight *= 1;

    // 稀有度惩罚
    if (skill.rarity === 'legend') weight *= 0.5;
    if (skill.rarity === 'artifact') weight *= 0.3;

    // 门派学派加成（支持综合加权：基础+天赋）
    if (this.sectBonus && this.sectBonus.school === skill.school) {
      const mult = this.sectBonus.schoolWeightMult || 1.5;
      weight *= mult;
    }

    // 武器匹配加成（通过全局函数获取）
    if (typeof checkWepSkillMatch === 'function') {
      const playerId = (typeof LH !== 'undefined') ? LH.id : null;
      if (playerId && checkWepSkillMatch(playerId, skill.school)) {
        weight *= 1.3;
      }
    }

    // 运势大爆发：减少低CD，增加高CD
    if (!initialDraw && this.fate.lianhuanJinJi > 0) {
      if (skill.cd <= 2) weight *= 0.5;
      else if (skill.cd >= 5) weight *= 2.0;
      else if (skill.cd >= 3) weight *= 1.5;
    }

    return weight;
  },

  /**
   * 推断技能的行动类型（快攻/普攻/重击/格挡）
   * 用于选卡出招时决定战斗博弈类型
   */
  _inferActionType(skill) {
    const name = (skill.name || '').toLowerCase();
    const cd = skill.cd || 3;
    const mult = skill.mult || skill.dmgMult || 1;

    // 防守类 → 格挡
    if (skill.def || name.includes('护') || name.includes('防') ||
        name.includes('守') || name.includes('格') || name.includes('盾')) {
      return 'block';
    }
    // 速攻/低冷却/低消耗 → 快攻
    if ((cd <= 2 && mult <= 1.2) || name.includes('快') || name.includes('速') ||
        name.includes('轻') || name.includes('突') || name.includes('刺')) {
      return 'quick';
    }
    // 重击/高冷却/高伤害 → 重击
    if ((cd >= 5 || mult >= 2.0) || name.includes('重') || name.includes('猛') ||
        name.includes('爆') || name.includes('绝') || name.includes('灭')) {
      return 'heavy';
    }
    // 默认普攻
    return 'normal';
  },

  /**
   * 将技能转换为手牌对象
   */
  _skillToCard(skill) {
    const uid = this._makeUid(skill.id);
    const rarity = skill.rarity || 'common';
    const rarityCfg = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
    const actionType = this._inferActionType(skill);

    // ── 花色分配：按熟练度权重随机 ──
    const school = skill.school || '通用';
    const suitId = assignSuit(school, actionType, skill.name);
    const suitCfg = SUIT_TYPES[suitId] || SUIT_TYPES.star;

    return {
      uid,
      id: skill.id,       // execSkill 期望 sk.id
      skillId: skill.id,
      name: skill.name,
      icon: skill.icon || '⚔',
      school,  // ← 关键：积累池渲染需要此字段
      suit: suitId,        // 花色ID
      suitSymbol: suitCfg.symbol,
      suitColor: suitCfg.color,
      suitName: suitCfg.name,
      isWild: suitCfg.wild,
      desc: skill.desc || '',
      mpCost: skill.mpCost || 10,
      type: skill.type || 'damage',
      cd: skill.cd || 3,
      mult: skill.mult || skill.dmgMult || 1,
      rarity,
      rarityIcon: rarityCfg.icon,
      rarityEffect: rarityCfg.effect,
      rarityBorder: rarityCfg.border,
      // ── 战法连击：每张卡携带行动类型 ──
      actionType,
      // 原始技能完整引用
      _skill: skill,
    };
  },

  /**
   * 生成唯一ID
   */
  _makeUid(skillId) {
    return `card_${skillId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 出牌逻辑
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 出牌
   * @param {string} uid - 手牌唯一ID
   * @returns {Object} 出牌结果 { success, combo, effect, skill }
   */
  playCard(uid) {
    if (!this.active || this.isAnimating) return { success: false };

    const cardIndex = this.hand.findIndex(c => c.uid === uid);
    if (cardIndex === -1) return { success: false };

    // 检查是否封印
    const sealed = this.sealedCards.find(s => s.uid === uid);
    if (sealed) {
      if (typeof showToast === 'function') showToast('该手牌被封印，无法使用！');
      return { success: false };
    }

    // 检查出牌次数
    if (this.playedThisTurn >= CARD_BALANCE.maxPlayPerTurn) {
      if (typeof showToast === 'function') showToast(`每回合最多出${CARD_BALANCE.maxPlayPerTurn}张牌！`);
      return { success: false };
    }

    const card = this.hand[cardIndex];

    // 检查内力
    let mpCost = card.mpCost;
    if (this.playedThisTurn === 1) {
      // 第2张牌享受MP折扣
      mpCost = Math.floor(mpCost * CARD_BALANCE.secondCardMpMult);
    }

    // 学派免消耗（势时全部免）
    const comboCheck = this._checkComboBeforePlay();
    if (comboCheck.combo && comboCheck.combo.name === '势') {
      mpCost = 0;
    }

    if (typeof lMp !== 'undefined' && lMp < mpCost) {
      if (typeof showToast === 'function') showToast(`内力不足！需要${mpCost}点`);
      return { success: false };
    }

    // 扣除内力
    if (typeof lMp !== 'undefined') {
      window.lMp = lMp - mpCost;
    }

    // 移除手牌
    this.hand.splice(cardIndex, 1);

    // 将出掉的牌放回摸牌池（允许持续获得手牌）
    this.pool.push(card);

    this.playedThisTurn++;

    // 检测牌型
    const result = this._detectCombo([card]);

    // 凝：重置该技能CD
    if (result.combo && result.combo.name === '凝') {
      const targetId = card.skillId;
      if (typeof cds !== 'undefined' && cds[targetId] !== undefined) {
        cds[targetId] = 0;
      }
      this.activeEffects.keziReset = targetId;
    }

    // 对子：效果×1.5
    let finalSkill = card._skill;
    if (result.combo && result.combo.name === '对子') {
      // 标记对子状态（通过临时buff）
      if (typeof applyTempBuff === 'function') {
        const bonus = this._getDuiziMult();
        applyTempBuff('duizi', '对子加成', bonus, 1);
      }
    }

    // 更新运势追踪
    this._trackFate(result.combo);

    return {
      success: true,
      combo: result.combo,
      effect: result.effect,
      skill: finalSkill,
      actionType: card.actionType,   // ── 战法连击：携带行动类型
      mpCost,
      card,
    };
  },

  /**
   * 出2张牌（组合出牌）
   * @param {string} uid1
   * @param {string} uid2
   * @returns {Object} { success, combo, actionType, cards, totalMpCost }
   */
  playCombo(uid1, uid2) {
    // 先出第1张（主导行动类型）
    const r1 = this.playCard(uid1);
    if (!r1.success) return r1;

    // 再出第2张
    const r2 = this.playCard(uid2);
    if (!r2.success) {
      // 回退第1张
      this.hand.push(r1.card);
      this.hand.sort((a, b) => (SCHOOL_COLORS[a.school] || '#888').localeCompare(SCHOOL_COLORS[b.school] || '#888'));
      if (typeof lMp !== 'undefined') window.lMp = lMp + r1.mpCost;
      this.playedThisTurn--;
      return { success: false, reason: '第2张牌无法出牌' };
    }

    // 检测组合牌型
    const result = this._detectCombo([r1.card, r2.card]);

    return {
      success: true,
      combo: result.combo,
      effect: result.effect,
      // ── 战法连击：第1张卡决定行动类型 ──
      actionType: r1.actionType || 'normal',
      cards: [r1.card, r2.card],
      skills: [r1.skill, r2.skill],
      totalMpCost: r1.mpCost + r2.mpCost,
    };
  },

  /**
   * 出牌前检查当前手牌能否凑成牌型（用于提示）
   */
  _checkComboBeforePlay() {
    return { combo: null, effect: null };
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 手动出牌（用户主动选择1/2/3张 → 确认出牌）
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 预览当前选中的牌将触发的效果（供UI提示）
   * @param {Array} uids - 要预览的牌uid数组（可选，默认selectedCards）
   * @returns {Object} { count, combo, effect, cards, totalMp, mpBreakdown, canPlay, reason }
   */
  previewSelectedCards(uids) {
    const cardUids = uids || this.selectedCards;
    if (cardUids.length === 0) {
      return { count: 0, combo: null, effect: null, cards: [], totalMp: 0, mpBreakdown: [], canPlay: false, reason: '未选中任何手牌' };
    }

    const cards = cardUids
      .map(uid => this.hand.find(c => c.uid === uid))
      .filter(Boolean);

    if (cards.length === 0) {
      return { count: 0, combo: null, effect: null, cards: [], totalMp: 0, mpBreakdown: [], canPlay: false, reason: '选中牌不在手牌中' };
    }

    // 检查封印
    for (const card of cards) {
      const sealed = this.sealedCards.find(s => s.uid === card.uid);
      if (sealed) {
        return { count: cards.length, combo: null, effect: null, cards, totalMp: 0, mpBreakdown: [], canPlay: false, reason: `【${card.name}】被封印` };
      }
    }

    // 检查出牌次数
    if (this.playedThisTurn + cards.length > CARD_BALANCE.maxPlayPerTurn) {
      return {
        count: cards.length, combo: null, effect: null, cards, totalMp: 0, mpBreakdown: [],
        canPlay: false,
        reason: `本回合还能出${CARD_BALANCE.maxPlayPerTurn - this.playedThisTurn}张牌`
      };
    }

    // 计算MP消耗
    const mpBreakdown = cards.map((card, idx) => {
      const base = card.mpCost;
      const played = this.playedThisTurn + idx;
      let cost = base;
      if (played >= 1) cost = Math.floor(base * CARD_BALANCE.secondCardMpMult);
      if (played >= 2) cost = Math.floor(base * CARD_BALANCE.thirdCardMpMult);
      return { card, base, cost };
    });

    const totalMp = mpBreakdown.reduce((sum, m) => sum + m.cost, 0);

    // 势检查（势时3张MP全免）- 预览时不触发实际效果
    const comboResult = this._detectCombo(cards, true);  // isPreview = true
    let adjustedTotalMp = totalMp;
    if (comboResult.combo && comboResult.combo.name === '势') {
      adjustedTotalMp = 0;
    }

    // 检查MP是否足够
    if (typeof lMp !== 'undefined' && lMp < adjustedTotalMp) {
      return {
        count: cards.length, combo: comboResult.combo, effect: comboResult.effect,
        cards, totalMp: adjustedTotalMp, mpBreakdown,
        canPlay: false,
        reason: `内力不足！需要${adjustedTotalMp}点，当前${lMp}点`
      };
    }

    return {
      count: cards.length,
      combo: comboResult.combo,
      effect: comboResult.effect,
      cards,
      totalMp: adjustedTotalMp,
      mpBreakdown,
      canPlay: true,
      reason: null,
    };
  },

  /**
   * 执行选中的牌（1/2/3张确认出牌）
   * @param {Array} uids - 要出的牌uid数组（可选，默认selectedCards）
   * @returns {Object} { success, combo, effect, cards, skills, actionType }
   */
  playSelectedCards(uids) {
    if (!this.active || this.isAnimating) return { success: false };

    const cardUids = uids || this.selectedCards;
    if (cardUids.length === 0) {
      if (typeof showToast === 'function') showToast('请先选择要出的手牌');
      return { success: false };
    }

    // 预览检查
    const preview = this.previewSelectedCards(cardUids);
    console.log('[playSelectedCards] preview:', preview);
    if (!preview.canPlay) {
      if (typeof showToast === 'function') showToast(preview.reason);
      return { success: false };
    }

    // 依次出牌（移除手牌，计数；MP由execSkill统一扣除）
    const playedCards = [];
    const playedSkills = [];

    for (let i = 0; i < cardUids.length; i++) {
      const uid = cardUids[i];
      const cardIndex = this.hand.findIndex(c => c.uid === uid);
      console.log(`[playSelectedCards] uid=${uid} cardIndex=${cardIndex}`);
      if (cardIndex === -1) {
        console.warn('[playSelectedCards] UID不在手牌中，跳过:', uid);
        continue;
      }

      const card = this.hand[cardIndex];
      console.log(`[playSelectedCards] card=${card?.name} skillId=${card?.skillId} mpCost=${card?.mpCost}`);
      playedCards.push(card);
      playedSkills.push(card); // card 本身包含 skillId/_skill 等完整信息

      // 移除手牌
      this.hand.splice(cardIndex, 1);
      this.playedThisTurn++;
    }

    console.log('[playSelectedCards] 最终 playedCards:', playedCards.map(c => c?.name));
    console.log('[playSelectedCards] 最终 playedSkills:', playedSkills.map(c => c?.skillId));

    // 检测牌型
    const comboResult = this._detectCombo(playedCards);

    // 凝效果：CD归零
    if (comboResult.combo && comboResult.combo.name === '凝') {
      const targetId = playedCards[0].skillId;
      if (typeof cds !== 'undefined' && cds[targetId] !== undefined) {
        cds[targetId] = 0;
      }
      this.activeEffects.ningReset = targetId;
    }

    // 对子效果：×1.5
    if (comboResult.combo && comboResult.combo.name === '对子') {
      if (typeof applyTempBuff === 'function') {
        applyTempBuff('duizi', '对子加成', this._getDuiziMult(), 1);
      }
    }

    // 运势追踪
    this._trackFate(comboResult.combo);

    // ── 听牌预检查：基于小积累池预览是否即将触发（用于UI提示）──
    let tingpaiInfo = { tingpaiTriggered: false, school: null, mult: 1.0 };
    if (playedCards.length > 0) {
      const firstCard = playedCards[0];
      const poolSchool = firstCard.school === '通用' ? '散人' : firstCard.school;
      // 检查小池当前状态 + 这张是否即将触发
      const currentSchool = this.smallPool.length > 0 ? this.smallPool[0] : null;
      if (currentSchool === null || currentSchool === poolSchool) {
        const projectedSize = (currentSchool === poolSchool) ? this.smallPool.length + 1 : 1;
        if (projectedSize >= CARD_BALANCE.accumThreshold) {
          tingpaiInfo = {
            tingpaiTriggered: true,
            school: poolSchool,
            mult: CARD_BALANCE.superMultValue,
            isPreview: true  // 标记为预览，实际在 finalizeAccumulation 中触发
          };
        }
      }
    }

    // 清空选中
    this.selectedCards = [];

    const ret = {
      success: true,
      combo: comboResult.combo,
      effect: comboResult.effect,
      cards: playedCards,
      // ★ 修复：skills 返回真正的技能对象（而非卡牌对象），供 execSkill 使用
      skills: playedCards.map(c => c._skill).filter(Boolean),
      // 战法连击/3卡时第1张决定行动类型
      actionType: playedCards[0]?.actionType || 'normal',
      // 听牌加成信息
      tingpai: tingpaiInfo,
    };
    console.log('[playSelectedCards] 返回:', ret);
    console.log('[playSelectedCards] skills:', ret.skills.map(s => s?.name));
    return ret;
  },

  /**
   * 在所有技能执行完毕后，批量积累花色（双层积累池）
   * @param {Array} playedCards - 出的牌数组
   * @returns {Object} { smallBonus: bool, bigBonus: bool, school: string, suit: string }
   */
  finalizeAccumulation(playedCards) {
    if (!playedCards || playedCards.length === 0) return { smallBonus: false, bigBonus: false };

    // 检测当前出牌的牌型类型
    const comboResult = this._detectCombo(playedCards);
    let comboType = 'none';
    if (comboResult?.combo) {
      const name = comboResult.combo.name;
      if (name === '连环') comboType = 'lianhuan';
      else if (name === '凝') comboType = 'ning';
      else if (name === '势') comboType = 'shi';
      else if (name === '对子') comboType = 'duizi';
    }
    console.log(`[finalizeAccumulation] 检测到牌型: ${comboType}`);

    let lastResult = null;
    // 每张出的牌按花色累计，花色满3张触发小加成
    playedCards.forEach(card => {
      if (!card.school) return;
      const poolSchool = card.school === '通用' ? '散人' : card.school;
      const suit = card.suit || 'star';
      lastResult = this._accumulateSchool(poolSchool, suit, comboType);
    });

    // 大连加成特效（不阻塞战斗，只显示UI闪烁）
    if (lastResult?.bigBonus) {
      console.log(`🔥🔥🔥 大连加成触发！${lastResult.school}学派伤害暴涨！`);
      // 触发大连特效（UI闪烁）
      this._triggerBigBonusEffect(lastResult.school, lastResult.bigType);
    } else if (lastResult?.smallBonus) {
      // 小加成特效
      this._triggerSmallBonusEffect(lastResult.school);
    }

    return lastResult || { smallBonus: false, bigBonus: false };
  },

  /**
   * 获取本次出牌的听牌加成（出牌前调用，检查是否立即触发）
   * 按花色判断是否即将触发小加成
   * @param {Array} cards - 出的牌数组
   * @returns {Object} { tingpaiTriggered: bool, school: string, suit: string, mult: number }
   */
  checkTingpaiForCards(cards) {
    if (!cards || cards.length === 0) return { tingpaiTriggered: false, school: null, suit: null, mult: 1.0 };

    // 检查每张即将打出的牌，是否会让某花色达到3
    for (const card of cards) {
      const suit = card.suit || 'star';
      const poolSchool = card.school === '通用' ? '散人' : card.school;
      const currentCount = this.smallPoolBySuit[suit] || 0;

      if (currentCount + 1 >= CARD_BALANCE.accumThreshold && !this.readySchool) {
        return {
          tingpaiTriggered: true,
          school: poolSchool,
          suit,
          mult: CARD_BALANCE.superMultValue,
          isPreview: true,
        };
      }
    }

    return { tingpaiTriggered: false, school: null, suit: null, mult: 1.0 };
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 牌型判定
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 检测牌型
   * @param {Array} cards - 出牌的手牌数组
   * @param {boolean} isPreview - 是否为预览（预览时不触发实际效果）
   * @returns {Object} { combo: CARD_COMBO, effect: Object }
   */
  _detectCombo(cards, isPreview = false) {
    if (!cards || cards.length === 0) return { combo: CARD_COMBO.DANPAI, effect: null };

    // 按优先级从高到低检测
    const checks = [
      () => this._checkLianhuan(cards, isPreview),
      () => this._checkNing(cards, isPreview),
      () => this._checkShi(cards, isPreview),
      () => this._checkDuizi(cards),
    ];

    for (const check of checks) {
      const result = check();
      if (result) return result;
    }

    return { combo: CARD_COMBO.DANPAI, effect: null };
  },

  /**
   * 检测连环（3张同学派且同花色）
   * @param {Array} cards - 出牌的手牌数组
   * @param {boolean} isPreview - 是否为预览（预览时不触发实际效果）
   */
  _checkLianhuan(cards, isPreview = false) {
    if (cards.length < 3) return null;

    // 只统计本次出的牌，不统计手牌中的牌
    const schoolCounts = {};
    cards.forEach(c => {
      schoolCounts[c.school] = (schoolCounts[c.school] || 0) + 1;
    });

    for (const [school, count] of Object.entries(schoolCounts)) {
      if (count >= 3) {
        // ── 同花色检查：3张牌必须同花色（云/混可当作任意花色）──
        const schoolCards = cards.filter(c => c.school === school);
        const suitGroups = {};
        schoolCards.forEach(c => {
          const s = c.isWild ? '__wild__' : (c.suit || 'star');
          if (!suitGroups[s]) suitGroups[s] = [];
          suitGroups[s].push(c);
        });
        // 检查是否存在一个花色（含混）有至少3张
        let sameSuitOk = false;
        for (const [suit, group] of Object.entries(suitGroups)) {
          if (suit === '__wild__') {
            // 3张都是混，直接成立
            sameSuitOk = true; break;
          }
          // 混牌可补足花色：统计非混牌的同花色数量 + 混牌数量
          const normalInSuit = group.filter(c => !c.isWild).length;
          const wildCount = schoolCards.filter(c => c.isWild).length;
          if (normalInSuit + wildCount >= 3) {
            sameSuitOk = true; break;
          }
        }
        if (!sameSuitOk) {
          console.log(`[连环检测] school=${school}，但花色不一致，不触发连环`);
          continue;
        }

        const poolSchool = school === '通用' ? '散人' : school;
        console.log(`[连环检测] school=${school}, poolSchool=${poolSchool}, 连环触发！`);

        // ── 预览时不触发实际效果 ──
        if (isPreview) {
          return {
            combo: CARD_COMBO.JIANGJIANG_HU,
            effect: {
              atkBuff: CARD_BALANCE.huAtkBuff,
              defDebuff: CARD_BALANCE.huDefDebuff,
            },
          };
        }

        // ── 应用连环效果 ──
        this.activeEffects.lianhuanAtkBuff = CARD_BALANCE.comboDuration;
        this.activeEffects.lianhuanDefDebuff = CARD_BALANCE.comboDuration;
        this.fate.lianhuanJinJi = 2;

        // 门派加成：明教火系连环附加灼烧
        if (this.sectBonus && this.sectBonus.huEffect && school === this.sectBonus.school) {
          if (this.sectBonus.huEffect === 'burnAoE') {
            if (typeof applyDot === 'function') applyDot('burn', 0.1, 2);
          }
        }

        // ── 连环时不清空小池，也不触发小加成 ──
        // 连环/凝/势本身已经是"3张凑齐"的牌型，它们激活战斗效果（攻击buff/防御debuff/CD归零等）
        // 小加成由听牌机制（出3张进入积累池）触发，不由连环/凝/势触发
        // 这样大连加成需要3次独立的小加成（每次出1-3张不同学派/技能积累），而非连环直接触发
        // this.smallPool = [];  // ← 移除：连环不清空小池

        // 通知UI刷新（连环效果激活）
        if (typeof updateChainPools === 'function') {
          updateChainPools();
        }

        return {
          combo: CARD_COMBO.JIANGJIANG_HU,
          effect: {
            atkBuff: CARD_BALANCE.huAtkBuff,
            defDebuff: CARD_BALANCE.huDefDebuff,
          },
        };
      }
    }

    return null;
  },

  /**
   * 检测凝（3张同一技能且同花色）
   * @param {Array} cards - 出牌的手牌数组
   * @param {boolean} isPreview - 是否为预览（预览时不触发实际效果）
   */
  _checkNing(cards, isPreview = false) {
    if (cards.length < 3) return null;

    const skillCounts = {};
    cards.forEach(c => {
      skillCounts[c.skillId] = (skillCounts[c.skillId] || 0) + 1;
    });

    for (const [skillId, count] of Object.entries(skillCounts)) {
      if (count >= 3) {
        // ── 同花色检查：3张同技能牌必须同花色（云/混可当作任意花色）──
        const skillCards = cards.filter(c => c.skillId === skillId);
        const suitGroups = {};
        skillCards.forEach(c => {
          const s = c.isWild ? '__wild__' : (c.suit || 'star');
          if (!suitGroups[s]) suitGroups[s] = [];
          suitGroups[s].push(c);
        });
        let sameSuitOk = false;
        for (const [suit, group] of Object.entries(suitGroups)) {
          if (suit === '__wild__') { sameSuitOk = true; break; }
          const wildCount = skillCards.filter(c => c.isWild).length;
          if (group.filter(c => !c.isWild).length + wildCount >= 3) {
            sameSuitOk = true; break;
          }
        }
        if (!sameSuitOk) {
          console.log(`[凝检测] skillId=${skillId}，但花色不一致，不触发凝`);
          continue;
        }

        // ── 预览时不触发实际效果 ──
        if (isPreview) {
          return {
            combo: CARD_COMBO.KEZI,
            effect: {
              resetCd: skillId,
              extra: null,
            },
          };
        }

        // 门派凝效果（统一 ningEffect 字段：stun/poison/burn/freeze）
        if (this.sectBonus && this.sectBonus.ningEffect) {
          const eff = this.sectBonus.ningEffect;
          if (eff === 'stun' || eff === 'freeze') {
            this.activeEffects.ningFreeze = true;
            if (typeof applyStun === 'function') applyStun(eff === 'freeze' ? 1 : 1);
          } else if (eff === 'poison') {
            if (typeof applyDot === 'function') applyDot('poison', 0.05, 3);
          } else if (eff === 'burn') {
            if (typeof applyDot === 'function') applyDot('burn', 0.08, 2);
          }
        }

        // ── 凝时不清空小池，也不触发小加成（与连环同理）──
        // 小加成由听牌机制触发，不由凝/势触发

        return {
          combo: CARD_COMBO.KEZI,
          effect: {
            resetCd: skillId,
            extra: this.activeEffects.ningFreeze ? this.sectBonus?.ningEffect : null,
          },
        };
      }
    }

    return null;
  },

  /**
   * 检测势（同系3张不同技能且同花色）
   * @param {Array} cards - 出牌的手牌数组
   * @param {boolean} isPreview - 是否为预览（预览时不触发实际效果）
   */
  _checkShi(cards, isPreview = false) {
    if (cards.length < 3) return null;

    // 按学派分组
    const schoolCards = {};
    cards.forEach(c => {
      if (!schoolCards[c.school]) schoolCards[c.school] = [];
      schoolCards[c.school].push(c);
    });

    for (const [school, schoolList] of Object.entries(schoolCards)) {
      if (schoolList.length >= 3) {
        const uniqueSkills = new Set(schoolList.map(c => c.skillId));
        if (uniqueSkills.size >= 3) {
          // ── 同花色检查：3张必须同花色（云/混可当作任意花色）──
          const suitGroups = {};
          schoolList.forEach(c => {
            const s = c.isWild ? '__wild__' : (c.suit || 'star');
            if (!suitGroups[s]) suitGroups[s] = [];
            suitGroups[s].push(c);
          });
          let sameSuitOk = false;
          for (const [suit, group] of Object.entries(suitGroups)) {
            if (suit === '__wild__') { sameSuitOk = true; break; }
            const wildCount = schoolList.filter(c => c.isWild).length;
            if (group.filter(c => !c.isWild).length + wildCount >= 3) {
              sameSuitOk = true; break;
            }
          }
          if (!sameSuitOk) {
            console.log(`[势检测] school=${school}，但花色不一致，不触发势`);
            continue;
          }

          // ── 预览时不触发实际效果 ──
          if (isPreview) {
            return {
              combo: CARD_COMBO.SHUNZI,
              effect: { mpFree: true, extraFree: this.sectBonus?.shiExtraFree || 0 },
            };
          }

          // 势效果：内力消耗全免（已在playCard中处理mpCost=0）

          // 门派加成：武当道系势额外免1张MP
          if (this.sectBonus && this.sectBonus.shiExtraFree && school === '道系') {
            // 额外效果标记
          }

          // ── 势时不清空小池，也不触发小加成（与连环/凝同理）──
          // 小加成由听牌机制触发，不由连环/凝/势触发

          return {
            combo: CARD_COMBO.SHUNZI,
            effect: { mpFree: true, extraFree: this.sectBonus?.shiExtraFree || 0 },
          };
        }
      }
    }

    return null;
  },

  /**
   * 检测对子（2张同一技能）
   */
  _checkDuizi(cards) {
    if (cards.length < 2) return null;

    const skillCounts = {};
    cards.forEach(c => {
      skillCounts[c.skillId] = (skillCounts[c.skillId] || 0) + 1;
    });

    for (const [skillId, count] of Object.entries(skillCounts)) {
      if (count >= 2) {
        return {
          combo: CARD_COMBO.DUIZI,
          effect: { mult: this._getDuiziMult() },
        };
      }
    }

    return null;
  },

  /**
   * 获取对子倍率（含门派加成）
   */
  _getDuiziMult() {
    let mult = CARD_BALANCE.duiziMult;

    // 门派加成：华山剑系对子×1.8
    if (this.sectBonus && this.sectBonus.duiziMult) {
      mult = this.sectBonus.duiziMult;
    }

    // 天赋加成（在外部注入）
    if (typeof getCardTalentDuiziMult === 'function') {
      mult += getCardTalentDuiziMult();
    }

    return mult;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 运势追踪
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 追踪运势
   * @param {Object} combo - 触发的牌型（null表示未凑成）
   */
  _trackFate(combo) {
    if (combo && combo.priority >= 2) {
      // 凑成牌型（对子及以上）
      this.fate.noComboTurns = 0;
      this.fate.luckBoost = false;
      this.fate.pitySchool = null;
      this.render();
      return;
    }

    // 未凑成牌型
    this.fate.noComboTurns++;

    if (this.fate.noComboTurns >= CARD_BALANCE.pityComboThreshold && !this.fate.luckBoost) {
      this.triggerLuckBoost();
    }
  },

  /**
   * 触发运势爆发
   */
  triggerLuckBoost() {
    if (this.fate.luckBoost) return;

    this.fate.luckBoost = true;

    // 确定保底学派
    const schools = [...new Set(this.hand.map(c => c.school))];
    if (schools.length > 0) {
      this.fate.pitySchool = schools[Math.floor(Math.random() * schools.length)];
    }

    // 显示运势爆发提示
    if (typeof showToast === 'function') {
      showToast(`🌟 运势爆发！下一张必摸${this.fate.pitySchool}学派！`);
    }
    // 屏幕金光效果
    if (typeof flash === 'function') flash('gold');
    if (typeof playSound === 'function') playSound('skill');

    if (typeof playAudio === 'function') {
      playAudio('buff');
    }

    this.render();
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 换牌
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 定向换牌：丢弃指定手牌，重新摸等量牌
   * @param {Array} uids - 要丢弃的手牌uid数组
   * @returns {boolean} 是否成功
   */
  selectiveSwap(uids) {
    if (!this.active || this.isAnimating) return false;

    const cost = uids.length * CARD_BALANCE.selectiveSwapCost;

    // 检查气势
    if (typeof momentum !== 'undefined' && momentum < cost) {
      if (typeof showToast === 'function') showToast(`气势不足！需要${cost}点`);
      return false;
    }

    // 扣气势
    if (typeof momentum !== 'undefined') {
      window.momentum = momentum - cost;
      if (typeof updateMomentumUI === 'function') updateMomentumUI();
    }

    // 移除指定手牌
    const removed = [];
    uids.forEach(uid => {
      const idx = this.hand.findIndex(c => c.uid === uid);
      if (idx !== -1) {
        removed.push(this.hand.splice(idx, 1)[0]);
      }
    });

    if (removed.length === 0) return false;

    // 摸等量新牌
    removed.forEach(() => {
      const card = this._drawOne(false);
      if (card) this.hand.push(card);
    });

    // 排序
    this.hand.sort((a, b) => (SCHOOL_COLORS[a.school] || '#888').localeCompare(SCHOOL_COLORS[b.school] || '#888'));

    this.render();

    if (typeof showToast === 'function') {
      showToast(`🔄 定向换牌 -${cost}气势`);
    }

    return true;
  },

  /**
   * 全换牌：弃掉所有手牌，重新摸满
   * @returns {boolean} 是否成功
   */
  fullSwap() {
    if (!this.active || this.isAnimating) return false;

    const cost = CARD_BALANCE.fullSwapCost;

    // 检查气势
    if (typeof momentum !== 'undefined' && momentum < cost) {
      if (typeof showToast === 'function') showToast(`气势不足！需要${cost}点`);
      return false;
    }

    // 扣气势
    if (typeof momentum !== 'undefined') {
      window.momentum = momentum - cost;
      if (typeof updateMomentumUI === 'function') updateMomentumUI();
    }

    // 移除所有手牌
    this.hand = [];

    // 摸满手牌
    const count = Math.min(CARD_BALANCE.initHandSize, this.pool.length);
    for (let i = 0; i < count; i++) {
      const card = this._drawOne(false);
      if (card) this.hand.push(card);
    }

    // 全换保底：至少1张CD≤2
    if (CARD_BALANCE.fullSwapMinCd2) {
      const hasLowCd = this.hand.some(c => c.cd <= 2);
      if (!hasLowCd && this.pool.length > 0) {
        const lowCdPool = this.pool.filter(s => s.cd <= 2);
        if (lowCdPool.length > 0) {
          // 替换一张高CD牌
          const highCdIdx = this.hand.findIndex(c => c.cd > 2);
          if (highCdIdx !== -1) {
            const replacement = this._skillToCard(lowCdPool[Math.floor(Math.random() * lowCdPool.length)]);
            this.hand[highCdIdx] = replacement;
          }
        }
      }
    }

    this.render();

    if (typeof showToast === 'function') {
      showToast(`🔄 全换手牌 -${cost}气势`);
    }

    return true;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 藏牌蓄势
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 藏牌蓄势（跳过出牌，防御加成）
   */
  holdAndDefend() {
    if (!this.active) return false;

    // 必须满手牌才能藏牌
    if (this.hand.length < this.handLimit) {
      if (typeof showToast === 'function') showToast('手牌未满，无法藏牌蓄势');
      return false;
    }

    this.holdTurns++;
    this.holdingBonus = this.holdTurns >= 2
      ? CARD_BALANCE.holdDefBonus2
      : CARD_BALANCE.holdDefBonus1;

    if (typeof showToast === 'function') {
      showToast(`🛡 藏牌蓄势！防御+${Math.round(this.holdingBonus * 100)}%`);
    }

    // 标记本回合藏牌（供onTurnEnd判断是否清除加成）
    this._heldThisTurn = true;
    // 跳过本回合出牌
    this.playedThisTurn = CARD_BALANCE.maxPlayPerTurn;

    this.render();
    return true;
  },

  /**
   * 获取当前防御加成（供战斗系统调用）
   */
  getDefBonus() {
    if (this.holdingBonus > 0) {
      // 天赋加成：额外+5%
      let bonus = this.holdingBonus;
      if (typeof getCardTalentHoldBonus === 'function') {
        bonus += getCardTalentHoldBonus();
      }
      return bonus;
    }
    return 0;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ BOSS封手
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 封印手牌
   * @param {string} type - 封印类型：'random'|'school'|'forced'
   * @param {Object} options - 可选参数 { school, count }
   */
  sealCard(type = 'random', options = {}) {
    if (!this.active || this.hand.length === 0) return;

    const sealedUids = this.sealedCards.map(s => s.uid);

    if (type === 'random') {
      // 随机封印1张（排除已封印）
      const available = this.hand.filter(c => !sealedUids.includes(c.uid));
      if (available.length === 0) return;

      // 蓄势状态免疫随机封印
      if (this.holdingBonus > 0) {
        if (typeof showToast === 'function') showToast('🛡 蓄势状态免疫封手！');
        return;
      }

      const target = available[Math.floor(Math.random() * available.length)];
      this.sealedCards.push({
        uid: target.uid,
        sealType: 'random',
        sealTurns: 2,
      });

      if (typeof showToast === 'function') {
        showToast(`🔒 BOSS封印了你的【${target.name}】！`);
      }

    } else if (type === 'school') {
      // 学派封印（封印所有某学派的手牌）

      // 运势爆发免疫学派封印
      if (this.fate.luckBoost) {
        if (typeof showToast === 'function') showToast('🌟 运势爆发！免疫学派封印！');
        return;
      }

      const school = options.school || this.hand[0].school;
      // 唐门/青城暗系免疫封印
      if (this.isSchoolUnsealable(school)) {
        if (typeof showToast === 'function') showToast(`🛡 ${school}学派免疫封印！`);
        return;
      }

      const targets = this.hand.filter(c =>
        !sealedUids.includes(c.uid) &&
        (options.school ? c.school === options.school : true)
      );

      targets.forEach(c => {
        this.sealedCards.push({
          uid: c.uid,
          sealType: 'school',
          sealSchool: school,
          sealTurns: 2,
        });
      });

      if (targets.length > 0 && typeof showToast === 'function') {
        showToast(`🔒 BOSS封印了所有${school}学派手牌！`);
      }

    } else if (type === 'forced') {
      // 强制弃牌（丢弃1张最高CD牌）
      const available = this.hand.filter(c => !sealedUids.includes(c.uid));
      if (available.length === 0) return;

      // 找最高CD
      const highestCd = Math.max(...available.map(c => c.cd));
      const targets = available.filter(c => c.cd === highestCd);
      const target = targets[Math.floor(Math.random() * targets.length)];

      const idx = this.hand.findIndex(c => c.uid === target.uid);
      if (idx !== -1) {
        this.hand.splice(idx, 1);

        // 摸1张新牌
        const newCard = this._drawOne(false);
        if (newCard) this.hand.push(newCard);
      }

      if (typeof showToast === 'function') {
        showToast(`💨 BOSS强制弃掉了你的【${target.name}】！`);
      }
    }

    this.render();
  },

  /**
   * 回合结束：减少封印回合
   */
  tickSeals() {
    this.sealedCards = this.sealedCards.filter(s => {
      s.sealTurns--;
      return s.sealTurns > 0;
    });
  },

  /**
   * 检查某张牌是否被封印
   */
  isCardSealed(uid) {
    return this.sealedCards.some(s => s.uid === uid);
  },

  /**
   * 检查某学派是否不可封印（唐门暗系）
   */
  isSchoolUnsealable(school) {
    return this.sectBonus && this.sectBonus.unsealableSchool === school;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 每回合处理
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 回合结束处理
   */
  onTurnEnd() {
    if (!this.active) return;

    // 重置出牌计数
    this.playedThisTurn = 0;

    // 重置选牌状态（新回合开始时清空选择）
    this.selectedCards = [];

    // 重置本回合追踪字段（积累已由 playSelectedCards 实时完成）
    this._lastPlayedSchool = null;

    // 重置超级增幅使用标记（新回合开始时）
    // 注意：superMultActive 保持（听牌状态跨回合有效）
    this.superMultUsed = false;

    // 运势大爆发倒计时
    if (this.fate.lianhuanJinJi > 0) {
      this.fate.lianhuanJinJi--;
    }

    // 连环效果倒计时
    if (this.activeEffects.lianhuanAtkBuff > 0) {
      this.activeEffects.lianhuanAtkBuff--;
    }
    if (this.activeEffects.lianhuanDefDebuff > 0) {
      this.activeEffects.lianhuanDefDebuff--;
    }

    // 藏牌蓄势重置（使用 _heldThisTurn 标志可靠判断）
    if (this.holdingBonus > 0) {
      if (this._heldThisTurn) {
        // 本回合藏了牌 → 维持加成（防御已用于敌人回合）
        this._heldThisTurn = false; // 重置标志
      } else {
        // 本回合未藏牌 → 清除加成
        this.holdingBonus = 0;
        this.holdTurns = 0;
      }
    } else {
      // 无加成时也重置标志
      this._heldThisTurn = false;
    }

    // 封印回合减少
    this.tickSeals();

    // 凝重置标记清除
    this.activeEffects.ningReset = null;

    // 摸牌
    this.drawCards(CARD_BALANCE.drawPerTurn);

    // 手牌为空时清空听牌状态（允许重新积累）
    if (this.hand.length === 0) {
      this.clearTingpai();
    }

    // 渲染
    this.render();
  },

  /**
   * 获取当前攻击加成（供战斗系统调用）
   */
  getAtkBonus() {
    return this.activeEffects.lianhuanAtkBuff > 0 ? CARD_BALANCE.huAtkBuff : 0;
  },

  /**
   * 获取当前敌方防御削减（供战斗系统调用）
   */
  getEnemyDefDebuff() {
    return this.activeEffects.lianhuanDefDebuff > 0 ? CARD_BALANCE.huDefDebuff : 0;
  },

  /**
   * 触发大连加成特效（UI闪烁，不阻塞战斗）
   * @param {string} school - 学派名
   * @param {string} bigType - 大连类型
   */
  _triggerBigBonusEffect(school, bigType) {
    // 大连特效颜色映射
    const typeColors = {
      'lianhuan_pure': { primary: '#c060ff', secondary: '#ff60ff' },  // 紫-粉
      'ning_pure': { primary: '#60c0ff', secondary: '#00ffff' },      // 蓝-青
      'shi_pure': { primary: '#80ff50', secondary: '#ffff00' },       // 绿-黄
      'duizi_pure': { primary: '#ffc050', secondary: '#ffff80' },      // 金-淡黄
      'jiangjianghu': { primary: '#ffcc60', secondary: '#ffffff' },   // 金-白
      'normal': { primary: '#ff8040', secondary: '#ff4060' },         // 橙-红
    };
    const colors = typeColors[bigType] || typeColors['normal'];

    // 获取大连池UI元素
    const bigPoolWrap = document.getElementById('bigPoolWrap');
    if (bigPoolWrap) {
      // 大连池闪烁特效
      bigPoolWrap.style.transition = 'transform 0.2s, box-shadow 0.2s';
      bigPoolWrap.style.transform = 'scale(1.3)';
      bigPoolWrap.style.boxShadow = `0 0 30px ${colors.primary}, 0 0 60px ${colors.secondary}`;
      bigPoolWrap.style.background = `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`;

      setTimeout(() => {
        bigPoolWrap.style.transform = 'scale(1)';
        bigPoolWrap.style.boxShadow = '';
        bigPoolWrap.style.background = '';
      }, 800);
    }

    // 屏幕边缘闪光
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:9998;
      background:radial-gradient(ellipse at center, ${colors.primary}30 0%, transparent 70%);
      animation:bigBonusFlash 0.8s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    // 添加动画样式（如果不存在）
    if (!document.getElementById('bigBonusFlashStyle')) {
      const style = document.createElement('style');
      style.id = 'bigBonusFlashStyle';
      style.textContent = `
        @keyframes bigBonusFlash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // 播放大连音效（如果存在）
    if (typeof playAudio === 'function') playAudio('mega_buff');
  },

  /**
   * 触发小加成特效（UI脉冲，不阻塞战斗）
   * 脉冲整个积累池区域
   */
  _triggerSmallBonusEffect(school) {
    const wrap = document.getElementById('chainPoolsWrap');
    if (wrap) {
      wrap.style.transition = 'transform 0.15s, box-shadow 0.15s';
      wrap.style.transform = 'scale(1.08)';
      wrap.style.boxShadow = '0 0 18px #ffd700';

      setTimeout(() => {
        wrap.style.transform = 'scale(1)';
        wrap.style.boxShadow = '';
      }, 400);
    }

    // 播放小加成音效（如果存在）
    if (typeof playAudio === 'function') playAudio('buff');
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ UI渲染
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 渲染手牌UI
   */
  render() {
    if (typeof window.renderCardHand === 'function') {
      window.renderCardHand(this);
    }
  },

  /**
   * 获取提示信息
   */
  getHint() {
    if (!this.active) return null;

    const hints = [];

    // 检查手牌提示
    const schoolCounts = {};
    const skillCounts = {};
    this.hand.forEach(c => {
      schoolCounts[c.school] = (schoolCounts[c.school] || 0) + 1;
      skillCounts[c.skillId] = (skillCounts[c.skillId] || 0) + 1;
    });

    // 连环提示
    for (const [school, count] of Object.entries(schoolCounts)) {
      if (count === 2) {
        hints.push(`💥 ${school}系×2 → 差1张连环！`);
      }
    }

    // 凝提示
    for (const [skillId, count] of Object.entries(skillCounts)) {
      if (count === 2) {
        const card = this.hand.find(c => c.skillId === skillId);
        if (card) {
          hints.push(`✦ 【${card.name}】×2 → 差1张凝！`);
        }
      }
    }

    // 势提示
    for (const [school, list] of Object.entries(schoolCounts)) {
      if (list.length === 2) {
        const uniqueCount = new Set(this.hand.filter(c => c.school === school).map(c => c.skillId)).size;
        if (uniqueCount >= 2) {
          hints.push(`⚡ ${school}系 → 差1张势！`);
        }
      }
    }

    // 运势提示
    if (this.fate.luckBoost) {
      hints.push(`🌟 运势爆发中！下一摸必出${this.fate.pitySchool}`);
    }

    // 运势保底倒计时
    if (!this.fate.luckBoost && this.fate.noComboTurns > 0) {
      const remaining = CARD_BALANCE.pityComboThreshold - this.fate.noComboTurns;
      if (remaining <= 2) {
        hints.push(`⚡ 运势蓄力中（还差${remaining}回合）`);
      }
    }

    return hints.length > 0 ? hints : null;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 听牌积累
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 出一张牌后，将该花色加入小积累池并检查双层加成
   * @param {string} school - 出的牌的学派
   * @param {string} suit - 出的牌的花色ID (star/moon/wind/cloud)
   * @param {string} comboType - 触发小加成时的牌型类型: 'lianhuan'|'ning'|'shi'|'duizi'|'none'
   * @returns {Object} 触发结果 { smallBonus: bool, bigBonus: bool, school: string, suit: string }
   */
  _accumulateSchool(school, suit, comboType = 'none') {
    if (!school || !suit) return { smallBonus: false, bigBonus: false };

    this._lastPlayedSchool = school;
    const poolSchool = school === '通用' ? '散人' : school;
    const s = suit || 'star';

    // ── 连环/凝/势：本身是牌型，不计入小池，也不触发小加成 ──
    const threeCardCombos = ['lianhuan', 'ning', 'shi'];
    if (threeCardCombos.includes(comboType)) {
      return { smallBonus: false, bigBonus: false, school: poolSchool, suit: s };
    }

    // ── 按花色计数 ──
    this.smallPoolBySuit[s] = (this.smallPoolBySuit[s] || 0) + 1;

    // 兼容旧逻辑：记录学派
    this.smallPool.push(poolSchool);
    this.accumPool.push(poolSchool);
    if (this.accumPool.length > CARD_BALANCE.accumThreshold * 3) {
      this.accumPool = this.accumPool.slice(-CARD_BALANCE.accumThreshold * 2);
    }

    // ── 检查该花色是否满3 ──
    let smallBonusTriggered = false;
    let bigBonusTriggered = false;
    console.log(`[_accumulateSchool] suit=${s}, count=${this.smallPoolBySuit[s]}, school=${poolSchool}`);
    if (this.smallPoolBySuit[s] >= CARD_BALANCE.accumThreshold) {
      smallBonusTriggered = true;
      console.log(`[_accumulateSchool] 花色${s}满3，触发小加成！`);
      this._triggerSmallBonus(poolSchool, comboType, s);
      // 只清零触发小加成的花色，其他花色保留继续积累
      this.smallPoolBySuit[s] = 0;
      this.smallPool = [];
      this.accumPool = [];

      // ── 检查大连加成（按花色分池）──
      if (this.bigPoolBySuit[s] && this.bigPoolBySuit[s].length >= CARD_BALANCE.bigPoolThreshold) {
        bigBonusTriggered = true;
        this._triggerBigBonus(poolSchool, s);
        this.bigPoolBySuit[s] = [];
      }
    }

    if (smallBonusTriggered) {
      this.readySchool = poolSchool;
      this.superMultActive = true;
    }

    return { smallBonus: smallBonusTriggered, bigBonus: bigBonusTriggered, school: poolSchool, suit: s };
  },

  /**
   * 触发小加成（每次小积累池满3个同学派时）
   * @param {string} school - 触发的学派
   * @param {string} comboType - 触发小加成时的牌型类型: 'lianhuan'|'ning'|'shi'|'duizi'|'none'
   */
  _triggerSmallBonus(school, comboType = 'none', suit = 'star') {
    // ── 分花色小连加成配置 ──
    // 星(☽): 攻击+15%, 防御+10%  月(☁): 攻击+10%, 暴击率+15%
    // 风(☀): 攻击+20%, 防御+5%   云(☃): 防御+15%, 闪避+12%
    const suitBonus = {
      star:  { atk: 0.15, def: 0.10, crit: 0,   critMult: 0,   dodge: 0,    name: '星连' },
      moon:  { atk: 0.10, def: 0,    crit: 0.15, critMult: 0,   dodge: 0,    name: '月连' },
      wind:  { atk: 0.20, def: 0.05, crit: 0,   critMult: 0,   dodge: 0,    name: '风连' },
      cloud: { atk: 0,    def: 0.15, crit: 0,   critMult: 0,   dodge: 0.12, name: '云连' },
    };
    const bonus = suitBonus[suit] || suitBonus['star'];
    const suitName = { star: '星(☽)', moon: '月(☁)', wind: '风(☀)', cloud: '云(☃)' }[suit] || suit;

    // 记录到大池（按花色分池，记录牌型+花色）
    this.bigPoolBySuit[suit].push({ comboType, suit });
    console.log(`[_triggerSmallBonus] school=${school}, comboType=${comboType}, suit=${suit}, 大池=${JSON.stringify(this.bigPoolBySuit)}`);

    // 激活小加成
    this.smallBonusActive = true;

    let bonusDesc = `攻击+${Math.round(bonus.atk*100)}% 防御+${Math.round(bonus.def*100)}%`;
    if (bonus.crit > 0) bonusDesc += ` 暴击+${Math.round(bonus.crit*100)}%`;
    if (bonus.dodge > 0) bonusDesc += ` 闪避+${Math.round(bonus.dodge*100)}%`;
    console.log(`[小加成·${bonus.name}] ${school} ${suitName}小积累池满！${bonusDesc}，持续${CARD_BALANCE.smallBonusDuration}回合`);

    // 通知UI刷新
    if (typeof updateChainPools === 'function') {
      console.log('[_triggerSmallBonus] 调用 updateChainPools');
      updateChainPools();
    }

    // 应用分花色小连加成效果
    if (typeof window.applyTempBuff === 'function') {
      if (bonus.atk > 0)
        window.applyTempBuff('smallChainAtk', `${bonus.name}攻击`, bonus.atk, CARD_BALANCE.smallBonusDuration, 'atk');
      if (bonus.def > 0)
        window.applyTempBuff('smallChainDef', `${bonus.name}防御`, bonus.def, CARD_BALANCE.smallBonusDuration, 'def');
      if (bonus.crit > 0)
        window.applyTempBuff('smallChainCrit', `${bonus.name}暴击`, bonus.crit, CARD_BALANCE.smallBonusDuration, 'crit');
      if (bonus.critMult > 0)
        window.applyTempBuff('smallChainCritM', `${bonus.name}暴伤`, bonus.critMult, CARD_BALANCE.smallBonusDuration, 'critMult');
      if (bonus.dodge > 0) {
        // dodgeBuff 使用现有字段
        window.lSt.dodgeBuff = (window.lSt.dodgeBuff || 0) + bonus.dodge;
        window.lSt.dodgeBuffTurns = CARD_BALANCE.smallBonusDuration;
        if (typeof updateBuffDisplay === 'function') updateBuffDisplay();
      }
    }
  },

  /**
   * 触发大加成（大积累池满3次小加成时，按麻将规则触发）
   * 根据大池中记录的牌型组合，决定大连效果
   * @param {string} school - 触发的学派
   */
  _triggerBigBonus(school, suit) {
    // suit: 'star'|'moon'|'wind'|'cloud'
    const suitNameMap = { star: '星(☽)', moon: '月(☁)', wind: '风(☀)', cloud: '云(☃)' };
    const suitName = suitNameMap[suit] || suit;
    const pool = this.bigPoolBySuit[suit] || [];
    const poolTypes = pool.map(entry => entry.comboType);
    const uniqueTypes = [...new Set(poolTypes)];

    // ── 判定大连胡牌类型 ──
    let bigType = 'normal';
    let bigName = '';
    let bonusText = '';

    if (uniqueTypes.length === 1) {
      // 纯色（3次相同牌型）
      const type = uniqueTypes[0];
      if (type === 'lianhuan') {
        bigType = 'lianhuan_pure';
        bigName = '大连·连环灭';
        bonusText = `
【${bigName}·${school}】
━━━━━━━━━━━━━━━━━━━━
⚔️ 攻击 +${(CARD_BALANCE.bigBonusAtkMult * 100).toFixed(0)}%
💨 追击（额外攻击）
🛡️ 防御穿透 +${(CARD_BALANCE.bigBonusDefMult * 100).toFixed(0)}%
💥 暴击率 +${(CARD_BALANCE.bigBonusCritRate * 100).toFixed(0)}%
━━━━━━━━━━━━━━━━━━━━
持续 ${CARD_BALANCE.bigBonusDuration} 回合
        `.trim();
      } else if (type === 'ning') {
        bigType = 'ning_pure';
        bigName = '大连·凝冻';
        bonusText = `
【${bigName}·${school}】
━━━━━━━━━━━━━━━━━━━━
❄️ 全体冰冻 1 回合
🔄 全体CD归零
💧 冻结增伤 +${(CARD_BALANCE.bigBonusCritMult * 100).toFixed(0)}%
━━━━━━━━━━━━━━━━━━━━
持续 ${CARD_BALANCE.bigBonusDuration} 回合
        `.trim();
      } else if (type === 'shi') {
        bigType = 'shi_pure';
        bigName = '大连·势绝';
        bonusText = `
【${bigName}·${school}】
━━━━━━━━━━━━━━━━━━━━
⚡ 全体内力归零
🎯 额外行动机会
⚔️ 攻击 +${(CARD_BALANCE.bigBonusAtkMult * 100).toFixed(0)}%
━━━━━━━━━━━━━━━━━━━━
持续 ${CARD_BALANCE.bigBonusDuration} 回合
        `.trim();
      } else if (type === 'duizi') {
        bigType = 'duizi_pure';
        bigName = '大连·对子无双';
        bonusText = `
【${bigName}·${school}】
━━━━━━━━━━━━━━━━━━━━
⚔️ 攻击 +${(CARD_BALANCE.bigBonusAtkMult * 100).toFixed(0)}%
💥 暴击率 +${(CARD_BALANCE.bigBonusCritRate * 100).toFixed(0)}%
🔥 暴击伤害 ×${(CARD_BALANCE.bigBonusCritMult).toFixed(1)}
━━━━━━━━━━━━━━━━━━━━
持续 ${CARD_BALANCE.bigBonusDuration} 回合
        `.trim();
      }
    } else {
      // 混搭 = 将将胡！（全效果叠加）
      bigType = 'jiangjianghu';
      bigName = '👑 将将胡！';
      bonusText = `
【${bigName}·${school}】
━━━━━━━━━━━━━━━━━━━━
⚔️ 攻击 +${(CARD_BALANCE.bigBonusAtkMult * 100).toFixed(0)}%
💨 追击（连环效果）
❄️ 全体冰冻（凝效果）
⚡ 全体MP归零（势效果）
💥 暴击率 +${(CARD_BALANCE.bigBonusCritRate * 100).toFixed(0)}%
🔥 暴击伤害 +${(CARD_BALANCE.bigBonusCritMult * 100).toFixed(0)}%
🛡️ 防御 +${(CARD_BALANCE.bigBonusDefMult * 100).toFixed(0)}%
━━━━━━━━━━━━━━━━━━━━
「混搭三色，全效果叠加！」
持续 ${CARD_BALANCE.bigBonusDuration} 回合
      `.trim();
    }

    // ── 激活大连加成 ──
    this.bigBonusActive = true;
    this.bigBonusSchool = school;
    this.bigBonusSuit = suit;

    console.log(`[大连加成] ${bonusText}`);
    // 大连加成激活提示（供battle.js的log使用）
    window._bigBonusActive = { school, bigName, bigType, suit };

    // 通知UI刷新（大连池按花色显示）
    if (typeof updateChainPools === 'function') {
      updateChainPools();
    }
    // 触发大连加成特效（非阻塞UI）
    this._triggerBigBonusEffect(school, bigType);

    // ── 应用大连加成效果 ──
    // 使用 window.applyTempBuff（battle.js 已将其暴露）
    if (typeof window.applyTempBuff === 'function') {
      window.applyTempBuff('bigChain', bigName, CARD_BALANCE.bigBonusAtkMult, CARD_BALANCE.bigBonusDuration, 'atk');
      window.applyTempBuff('bigChainCrit', '大连暴击', CARD_BALANCE.bigBonusCritRate, CARD_BALANCE.bigBonusDuration, 'crit');
      window.applyTempBuff('bigChainCritMult', '大连暴伤', CARD_BALANCE.bigBonusCritMult, CARD_BALANCE.bigBonusDuration, 'critMult');
      window.applyTempBuff('bigChainDef', '大连防御', CARD_BALANCE.bigBonusDefMult, CARD_BALANCE.bigBonusDuration, 'def');
    } else {
      console.warn('[大连加成] applyTempBuff 函数未定义，效果将无法应用！');
    }

    // ── 特殊大连效果（基于牌型） ──
    const pureType = uniqueTypes.length === 1 ? uniqueTypes[0] : null;
    if (typeof window.applyDot === 'function') {
      if (pureType === 'ning') {
        window.applyDot('freeze', 0, 1);
      }
    }
    if (typeof window.applyStun === 'function') {
      if (pureType === 'ning') {
        window.applyStun(1);
      }
    }

    // 记录大连类型（供战斗系统读取应用特殊效果）
    this.bigBonusType = bigType;

    // 清空该花色的大连池（每种花色独立积累）
    this.bigPoolBySuit[suit] = [];
  },

  /**
   * 检测是否达成听牌（积累池中是否有3个相同学派）
   * @returns {Object} { ready: bool, school: string, missing: number }
   */
  _checkTingpai() {
    // 已听牌，直接返回
    if (this.readySchool) {
      return { ready: true, school: this.readySchool, missing: 0 };
    }

    if (!this.accumPool || this.accumPool.length === 0) {
      return { ready: false, school: null, missing: CARD_BALANCE.accumThreshold };
    }

    // 统计各学派出现次数
    const counts = {};
    this.accumPool.forEach(s => { counts[s] = (counts[s] || 0) + 1; });

    for (const [school, count] of Object.entries(counts)) {
      if (count >= CARD_BALANCE.accumThreshold) {
        this.readySchool = school;
        this.superMultActive = true;
        if (typeof showToast === 'function') {
          showToast(`🎯 听牌！${school}系学派准备完毕！下一张伤害×${CARD_BALANCE.superMultValue}！`);
        }
        if (typeof playAudio === 'function') playAudio('buff');
        return { ready: true, school, missing: 0 };
      }
    }

    // 未听牌：找出最接近的那个学派
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const [topSchool, topCount] = sorted[0];
      return {
        ready: false,
        school: topSchool,
        missing: CARD_BALANCE.accumThreshold - topCount,
      };
    }
    return { ready: false, school: null, missing: CARD_BALANCE.accumThreshold };
  },

  /**
   * 获取听牌状态描述（供UI渲染）
   * @returns {Object} { status: 'none'|'accum'|'ready', pools: [], school: string, mult: number, hints: [], schoolCounts: {} }
   */
  getTingpaiStatus() {
    // 已触发听牌（听牌状态）：等待下一张触发
    if (this.readySchool && this.superMultActive) {
      return {
        status: 'ready',
        school: this.readySchool,
        mult: CARD_BALANCE.superMultValue,
        pools: [...this.accumPool],
        hints: [`🎯 听牌！出${this.readySchool}系即触发×${CARD_BALANCE.superMultValue}伤害！`],
        schoolCounts: this._getSchoolCounts(),
      };
    }

    // 积累中
    const tp = this._checkTingpai();
    if (tp.school) {
      return {
        status: 'accum',
        school: tp.school,
        mult: CARD_BALANCE.superMultValue,
        missing: tp.missing,
        pools: [...this.accumPool],
        hints: [`${tp.school}系积累中（差${tp.missing}张触发听牌）`],
        schoolCounts: this._getSchoolCounts(),
      };
    }

    return {
      status: 'none',
      school: null,
      mult: CARD_BALANCE.superMultValue,
      pools: [],
      hints: [],
      schoolCounts: this._getSchoolCounts(),
    };
  },

  /**
   * 获取积累池中学派计数
   * @returns {Object} { schoolName: count, ... }
   */
  _getSchoolCounts() {
    const counts = {};
    (this.accumPool || []).forEach(s => { counts[s] = (counts[s] || 0) + 1; });
    return counts;
  },

  /**
   * 消耗听牌状态（伤害结算后调用）
   * @param {string} school - 本次出牌的学派
   * @returns {boolean} 是否成功消耗
   */
  consumeTingpai(school) {
    if (!this.superMultActive) return false;

    // 听牌生效后，积累池无论触发与否都必须清空（防止残留数据持续显示）
    this.accumPool = [];
    // 听的是"散人"（通用积累池）→ 任意学派都能触发
    if (this.readySchool === '散人' || school === this.readySchool) {
      // 听牌生效！
      this.readySchool = null;
      this.superMultActive = false;
      this.superMultUsed = true;
      // showToast 由调用方 (battle.js execSkill) 负责显示
      return true;
    } else {
      // 学派不匹配，听牌失效
      this.readySchool = null;
      this.superMultActive = false;
      this.superMultUsed = false;
      return false;
    }
  },

  /**
   * 获取当前伤害倍率（供战斗系统调用）
   * ★ 听任意学派都触发：积累散人后出任何学派都能享受听牌加成
   * @param {string} school - 当前出牌的学派
   * @returns {number} 额外倍率
   */
  getSuperMult(school) {
    if (!this.superMultActive) return 1.0;
    // 听的是"散人"（通用积累池）→ 任意学派都能触发
    if (this.readySchool === '散人') return CARD_BALANCE.superMultValue;
    // 听的是特定学派 → 需匹配才能触发
    if (school === this.readySchool) return CARD_BALANCE.superMultValue;
    return 1.0;
  },

  /**
   * 清除听牌状态（战斗结束/重置时调用）
   */
  clearTingpai() {
    this.accumPool = [];
    this.readySchool = null;
    this.superMultActive = false;
    this.superMultUsed = false;
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 特效
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 播放连环宣告动画
   */
  async playLianhuanAnnounce() {
    if (typeof window.showLianhuanAnnounce === 'function') {
      await window.showLianhuanAnnounce();
    }
  },

  /**
   * 播放牌型触发动画
   */
  playComboEffect(combo) {
    if (typeof playAudio === 'function') {
      playAudio('skill');
    }

    if (typeof showToast === 'function') {
      showToast(`${combo.icon} ${combo.name}！${combo.desc}`);
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  ✦ 序列化（存档用，一般不需要）
  // ═══════════════════════════════════════════════════════════════════════

  toJSON() {
    return {
      active: this.active,
      handLimit: this.handLimit,
      fate: this.fate,
      holdingBonus: this.holdingBonus,
      holdTurns: this.holdTurns,
    };
  },

  fromJSON(data) {
    if (!data) return;
    this.active = data.active || false;
    this.handLimit = data.handLimit || CARD_BALANCE.handLimit;
    this.fate = data.fate || this.fate;
    this.holdingBonus = data.holdingBonus || 0;
    this.holdTurns = data.holdTurns || 0;
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 功法连击解析器 — CardComboResolver
//  战法连击：选1/2/3张牌 → 确认出牌 → 根据组合类型触发专属战斗结算
//  3张牌 = 功法连击：凝/势/连环，各有专属战斗动作
//  2张牌 = 对子效果（效果×1.5）
//  1张牌 = 普通技能效果
// ═══════════════════════════════════════════════════════════════════════════

CardSystem.ComboResolver = {
  /**
   * 分析选牌并生成统一战斗结算参数
   * @param {Array} cards - 已选手牌数组（1~3张）
   * @param {Object} cardSystem - CardSystem实例
   * @param {boolean} isPreview - 是否为预览（预览时不触发实际效果）
   * @returns {Object} 战斗结算参数
   */
  resolve(cards, cardSystem, isPreview = false) {
    const count = cards.length;
    const comboResult = cardSystem._detectCombo(cards, isPreview);

    if (count === 3 && comboResult.combo) {
      return this._resolveThreeCards(cards, comboResult, cardSystem, isPreview);
    } else if (count === 2 && comboResult.combo) {
      return this._resolveTwoCards(cards, comboResult, cardSystem, isPreview);
    } else {
      return this._resolveOneCard(cards, cardSystem);
    }
  },

  /**
   * 1张牌 → 普通技能效果
   */
  _resolveOneCard(cards, cardSystem) {
    const card = cards[0];
    return {
      count: 1,
      comboName: null,
      actionType: card.actionType || 'normal',
      primarySkill: card._skill,
      primaryCard: card,
      skills: [card._skill],
      cards: [card],
      damageMult: card.mult || 1,
      mpCost: card.mpCost || 10,
      bonusEffects: [],
      battleAction: 'normal',
      desc: `施展【${card.name}】`,
      hintText: `普通出牌 · ${card.icon}${card.name}`,
      hintClass: 'hint-normal',
    };
  },

  /**
   * 2张牌 → 对子效果（效果×1.5 + 可能有额外特效）
   */
  _resolveTwoCards(cards, comboResult, cardSystem, isPreview = false) {
    const primary = cards[0]; // 第1张决定行动类型
    const duiziMult = cardSystem._getDuiziMult();

    // 计算综合伤害倍率
    let totalDmgMult = 0;
    cards.forEach((c, i) => {
      const mult = i === 0 ? (c.mult || 1) : (c.mult || 1) * duiziMult * 0.8;
      totalDmgMult += mult;
    });

    return {
      count: 2,
      comboName: '对子',
      comboIcon: '👫',
      actionType: primary.actionType || 'normal',
      primarySkill: primary._skill,
      primaryCard: primary,
      skills: cards.map(c => c._skill),
      cards: cards,
      damageMult: totalDmgMult,
      mpCost: cards.reduce((s, c) => s + Math.floor((c.mpCost || 10) * CARD_BALANCE.secondCardMpMult), 0),
      bonusEffects: [
        { type: 'damage_mult', name: '对子加成', value: duiziMult }
      ],
      battleAction: 'duizi',
      desc: `对子连击 · 效果×${duiziMult.toFixed(1)}`,
      hintText: `👫 对子！${primary.icon}${primary.name} + ${cards[1].icon}${cards[1].name}，伤害×${duiziMult.toFixed(1)}`,
      hintClass: 'hint-duizi',
    };
  },

  /**
   * 3张牌 → 功法连击效果
   * 凝（3同技能）：技能CD归零+额外追加攻击
   * 势（同系3不同技能）：三连击+MP全免
   * 连环（同学派）：爆发输出+敌人防御削弱
   */
  _resolveThreeCards(cards, comboResult, cardSystem, isPreview = false) {
    const combo = comboResult.combo;

    if (combo.name === '凝') {
      return this._resolveNing(cards, comboResult, cardSystem, isPreview);
    } else if (combo.name === '势') {
      return this._resolveShi(cards, comboResult, cardSystem, isPreview);
    } else if (combo.name === '连环') {
      return this._resolveLianhuan(cards, comboResult, cardSystem, isPreview);
    } else {
      // 3张散牌
      return this._resolveThreeScattered(cards, cardSystem);
    }
  },

  /**
   * 凝（3张完全相同的技能）
   * 效果：技能CD归零 + 立刻追加一次该技能（免费）
   */
  _resolveNing(cards, comboResult, cardSystem, isPreview = false) {
    const card = cards[0];
    const sectNingEffect = cardSystem.sectBonus?.ningEffect;

    return {
      count: 3,
      comboName: '凝',
      comboIcon: '✦',
      actionType: 'heavy', // 凝=重击型
      primarySkill: card._skill,
      primaryCard: card,
      skills: [card._skill, card._skill], // 主技能+追加
      cards: cards,
      damageMult: (card.mult || 1) * 1.8, // 1.8倍基础伤害（包含追加）
      mpCost: card.mpCost || 10, // 只扣第1张MP
      bonusEffects: [
        { type: 'cd_reset', name: 'CD归零', value: card.skillId },
        { type: 'free_hit', name: '免费追加', value: card.name },
        sectNingEffect ? { type: 'sect_special', name: '门派凝', value: sectNingEffect } : null,
      ].filter(Boolean),
      battleAction: 'ning',
      desc: `凝·三击！${card.icon}${card.name}伤害×1.8，CD归零并追加一次！`,
      hintText: `✦ 凝！三次【${card.name}】！追加免费攻击！${sectNingEffect ? '附加' + sectNingEffect + '效果！' : ''}`,
      hintClass: 'hint-ning',
      extraAction: 'ning_free_hit', // 额外追加一次
    };
  },

  /**
   * 势（同学派3张不同技能）
   * 效果：三连击 + MP全免 + 追加一次追击（追击伤害×0.5）
   */
  _resolveShi(cards, comboResult, cardSystem, isPreview = false) {
    const school = cards[0].school;
    const sectShiExtra = cardSystem.sectBonus?.shiExtraFree;

    // 伤害倍率：3张累加 + 追击×0.5
    const totalMult = cards.reduce((s, c) => s + (c.mult || 1), 0) + 0.5;

    return {
      count: 3,
      comboName: '势',
      comboIcon: '⚡',
      actionType: 'quick', // 势=快攻型
      primarySkill: cards[0]._skill,
      primaryCard: cards[0],
      skills: cards.map(c => c._skill),
      cards: cards,
      damageMult: totalMult,
      mpCost: 0, // 势MP全免
      bonusEffects: [
        { type: 'mp_free', name: '内力全免', value: 0 },
        { type: 'extra_hit', name: '追击', value: '0.5×' },
        sectShiExtra ? { type: 'sect_special', name: '武当势', value: '+1张MP免消耗' } : null,
      ].filter(Boolean),
      battleAction: 'shi',
      desc: `势·三连击！${school}学派三技连发，内力全免，追加追击！`,
      hintText: `⚡ 势！${cards.map(c => c.icon + c.name).join('→')}，内力全免，追加追击！`,
      hintClass: 'hint-shi',
      extraAction: 'shi_followup',
    };
  },

  /**
   * 连环（同学派3张任意技能）
   * 效果：爆发输出 + 敌人防御削弱（持续2回合）
   */
  _resolveLianhuan(cards, comboResult, cardSystem, isPreview = false) {
    const school = cards[0].school;
    const huAtkBuff = CARD_BALANCE.huAtkBuff;
    const huDefDebuff = CARD_BALANCE.huDefDebuff;

    // 伤害倍率：3张×1.5
    const totalMult = cards.reduce((s, c) => s + (c.mult || 1), 0) * 1.5;

    // 门派连环特殊效果
    const sectHuEffect = cardSystem.sectBonus?.huEffect;

    return {
      count: 3,
      comboName: '连环',
      comboIcon: '💥',
      actionType: 'heavy',
      primarySkill: cards[0]._skill,
      primaryCard: cards[0],
      skills: cards.map(c => c._skill),
      cards: cards,
      damageMult: totalMult,
      mpCost: 0, // 连环免MP
      bonusEffects: [
        { type: 'mp_free', name: '内力全免', value: 0 },
        { type: 'atk_buff', name: '攻击提升', value: `+${huAtkBuff * 100}%` },
        { type: 'def_debuff', name: '敌人防削', value: `−${huDefDebuff * 100}%` },
        sectHuEffect ? { type: 'sect_special', name: '门派特效', value: sectHuEffect } : null,
      ].filter(Boolean),
      battleAction: 'lianhuan',
      desc: `💥 连环！${school}学派爆发！伤害×${(totalMult).toFixed(1)}，敌人防御−${huDefDebuff * 100}%，持续2回合！`,
      hintText: `💥 连环！${school}系三牌爆发！伤害×${(totalMult).toFixed(1)}，敌人防御−${huDefDebuff * 100}%！`,
      hintClass: 'hint-lianhuan',
      extraAction: 'lianhuan_buff',
    };
  },

  /**
   * 3张散牌（无组合）
   * 效果：依次释放，但作为"三连击"组合动作有小幅加成
   */
  _resolveThreeScattered(cards, cardSystem) {
    const totalMult = cards.reduce((s, c) => s + (c.mult || 1), 0) * 1.2; // 散牌三连×1.2
    const totalMp = cards.reduce((s, c) => s + Math.floor((c.mpCost || 10) * CARD_BALANCE.thirdCardMpMult), 0);

    return {
      count: 3,
      comboName: '三连击',
      comboIcon: '⚡',
      actionType: cards[0].actionType || 'normal',
      primarySkill: cards[0]._skill,
      primaryCard: cards[0],
      skills: cards.map(c => c._skill),
      cards: cards,
      damageMult: totalMult,
      mpCost: totalMp,
      bonusEffects: [
        { type: 'combo_bonus', name: '三连加成', value: '×1.2' }
      ],
      battleAction: 'triple_combo',
      desc: `⚡三连击！${cards.map(c => c.icon + c.name).join('→')}，伤害×1.2`,
      hintText: `⚡ 三连击！${cards.map(c => c.icon + c.name).join('·')}，组合伤害×1.2`,
      hintClass: 'hint-scatter',
    };
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 自动战斗AI（供自动战斗模式使用）
// ═══════════════════════════════════════════════════════════════════════════

CardSystem.AI = {
  /**
   * 自动选择最优出牌
   * @returns {Object} { action: 'play'|'combo'|'hold'|'skip', cards: [...] }
   */
  chooseBestAction() {
    if (!CardSystem.active) return { action: 'skip', cards: [] };

    const hand = CardSystem.hand;
    if (hand.length === 0) return { action: 'skip', cards: [] };

    // 优先检测连环
    const huResult = CardSystem._detectCombo(hand);
    if (huResult.combo && huResult.combo.name === '连环') {
      const schoolCounts = {};
      hand.forEach(c => {
        schoolCounts[c.school] = (schoolCounts[c.school] || 0) + 1;
      });
      const lhCards = hand.filter(c => {
        const topSchool = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1])[0];
        return c.school === topSchool[0];
      });
      return { action: 'combo', cards: lhCards.slice(0, 3) };
    }

    // 检测凝
    const skillCounts = {};
    hand.forEach(c => {
      skillCounts[c.skillId] = (skillCounts[c.skillId] || 0) + 1;
    });
    for (const [skillId, count] of Object.entries(skillCounts)) {
      if (count >= 3) {
        const ningCards = hand.filter(c => c.skillId === skillId);
        return { action: 'combo', cards: ningCards.slice(0, 3) };
      }
    }

    // 检测势
    const schoolCards = {};
    hand.forEach(c => {
      if (!schoolCards[c.school]) schoolCards[c.school] = [];
      schoolCards[c.school].push(c);
    });
    for (const cards of Object.values(schoolCards)) {
      if (cards.length >= 3) {
        return { action: 'combo', cards: cards.slice(0, 3) };
      }
    }

    // 检测对子
    for (const [skillId, count] of Object.entries(skillCounts)) {
      if (count >= 2) {
        const duiziCards = hand.filter(c => c.skillId === skillId);
        return { action: 'combo', cards: duiziCards.slice(0, 2) };
      }
    }

    // 评估单张出牌
    const playableCards = hand.filter(c => !CardSystem.isCardSealed(c.uid));
    if (playableCards.length > 0) {
      // 优先出高伤害/低MP的牌
      playableCards.sort((a, b) => {
        const scoreA = (a._skill.multiplier || 0) / (a.mpCost || 1);
        const scoreB = (b._skill.multiplier || 0) / (b.mpCost || 1);
        return scoreB - scoreA;
      });

      return { action: 'play', cards: [playableCards[0]] };
    }

    // 考虑藏牌
    if (hand.length >= CardSystem.handLimit && CardSystem.holdingBonus === 0) {
      return { action: 'hold', cards: [] };
    }

    return { action: 'skip', cards: [] };
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 导出
// ═══════════════════════════════════════════════════════════════════════════

// 兼容旧写法
const _CardSystem = CardSystem;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CardSystem;
}
