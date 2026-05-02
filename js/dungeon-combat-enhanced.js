// ════════════════════════════════════════════════════
//  dungeon-combat-enhanced.js  地下城战斗增强系统 v1.0
//  功能：环境效果 / 连战系统 / 精英特殊技能 / 战斗统计
// ════════════════════════════════════════════════════

// ── 地下城环境效果配置 ──────────────────────────────
const DUNGEON_ENVIRONMENT_EFFECTS = {
  // 火系主题地下城
  fire: {
    name: '灼热之地',
    desc: '火焰伤害+15%，冰系伤害-10%',
    playerBuff: { fireDmg: 0.15, iceDmg: -0.10 },
    enemyBuff: { fireDmg: 0.20 },
    ambientEffect: 'fire_particles',  // 环境粒子效果
    turnEffect: {
      name: '灼热',
      desc: '每回合损失2%气血',
      damagePct: 0.02,
      type: 'fire',
    },
  },
  // 冰系主题地下城
  ice: {
    name: '极寒之地',
    desc: '冰系伤害+15%，速度-10%',
    playerBuff: { iceDmg: 0.15, spd: -0.10 },
    enemyBuff: { iceDmg: 0.20 },
    ambientEffect: 'snow_particles',
    turnEffect: {
      name: '严寒',
      desc: '每回合有20%概率冰冻',
      freezeChance: 0.20,
      type: 'ice',
    },
  },
  // 毒系主题地下城
  poison: {
    name: '毒瘴之地',
    desc: '毒系伤害+20%，每回合中毒概率+15%',
    playerBuff: { poisonDmg: 0.15 },
    enemyBuff: { poisonDmg: 0.25, poisonChance: 0.15 },
    ambientEffect: 'poison_mist',
    turnEffect: {
      name: '毒瘴',
      desc: '每回合有15%概率中毒',
      poisonChance: 0.15,
      poisonDmg: 0.03,
      type: 'poison',
    },
  },
  // 雷电主题地下城
  thunder: {
    name: '雷暴之地',
    desc: '雷系伤害+20%，暴击率+10%',
    playerBuff: { thunderDmg: 0.20, crit: 0.10 },
    enemyBuff: { thunderDmg: 0.25 },
    ambientEffect: 'lightning_particles',
    turnEffect: {
      name: '雷暴',
      desc: '每回合随机雷击，造成3%伤害',
      damagePct: 0.03,
      type: 'thunder',
    },
  },
  // 黑暗主题地下城
  dark: {
    name: '暗影之地',
    desc: '暗系伤害+20%，命中率-10%',
    playerBuff: { darkDmg: 0.20, hit: -0.10 },
    enemyBuff: { darkDmg: 0.25, dodge: 0.15 },
    ambientEffect: 'dark_mist',
    turnEffect: {
      name: '恐惧',
      desc: '每回合有10%概率恐惧（无法行动）',
      fearChance: 0.10,
      type: 'dark',
    },
  },
  // 神圣主题地下城
  holy: {
    name: '圣光之地',
    desc: '治疗效果+25%，圣系伤害+15%',
    playerBuff: { heal: 0.25, holyDmg: 0.15 },
    enemyBuff: { holyDmg: 0.20 },
    ambientEffect: 'holy_light',
    turnEffect: {
      name: '圣疗',
      desc: '每回合恢复3%气血',
      healPct: 0.03,
      type: 'holy',
    },
  },
  // 水下主题
  underwater: {
    name: '水下环境',
    desc: '速度-20%，火系伤害-30%',
    playerBuff: { spd: -0.20, fireDmg: -0.30 },
    enemyBuff: { spd: -0.10 },
    ambientEffect: 'bubbles',
    turnEffect: {
      name: '窒息',
      desc: '每回合损失1%气血和内力',
      damagePct: 0.01,
      mpDamagePct: 0.01,
      type: 'water',
    },
  },
  // 机关主题
  mechanism: {
    name: '机关重重',
    desc: '陷阱伤害+30%，防御+15%',
    playerBuff: { def: 0.15 },
    enemyBuff: { trapDmg: 0.30 },
    ambientEffect: 'gear_particles',
    turnEffect: null,  // 无回合效果
  },
};

// 地下城主题映射
const DUNGEON_THEME_MAP = {
  'fire': ['dungeon_holy_fire_altar', 'dungeon_volcano_cave', 'dungeon_flame_valley'],
  'ice': ['dungeon_ice_palace', 'dungeon_snow_mountain', 'dungeon_frozen_tomb'],
  'poison': ['dungeon_wudu_valley', 'dungeon_poison_swamp', 'dungeon_toxic_cave'],
  'thunder': ['dungeon_thunder_peak', 'dungeon_lightning_tower'],
  'dark': ['dungeon_xuanming_lair', 'dungeon_xuanming_outer_altar', 'dungeon_blood_bone_hall'],
  'holy': ['dungeon_shaolin_tower', 'dungeon_wudang_cliff'],
  'underwater': ['dungeon_water_dragon_palace', 'dungeon_underwater_ruins'],
  'mechanism': ['dungeon_tangmen_mechanism_fort'],
};

// ── 连战系统 ────────────────────────────────────────
let _consecutiveBattleState = {
  count: 0,           // 连战次数
  rageKept: 0,        // 保留的怒气值
  lastBattleTime: 0,  // 上次战斗时间
  buffs: [],          // 累积的临时buff
};

// 连战配置
const CONSECUTIVE_BATTLE_CONFIG = {
  // 怒气保留比例
  rageKeepPct: 0.5,
  // 连战buff
  buffs: [
    { count: 2, name: '热身', atk: 0.05, desc: '攻击+5%' },
    { count: 3, name: '渐入佳境', atk: 0.08, crit: 0.05, desc: '攻击+8%，暴击+5%' },
    { count: 5, name: '连战连胜', atk: 0.12, crit: 0.08, spd: 0.05, desc: '攻击+12%，暴击+8%，速度+5%' },
    { count: 8, name: '战神附体', atk: 0.20, crit: 0.15, spd: 0.10, desc: '攻击+20%，暴击+15%，速度+10%' },
  ],
  // 连战超时时间（毫秒）
  timeout: 60000,  // 1分钟
};

// 开始连战
function startConsecutiveBattle() {
  const now = Date.now();
  const state = _consecutiveBattleState;
  
  // 检查是否超时重置
  if (now - state.lastBattleTime > CONSECUTIVE_BATTLE_CONFIG.timeout) {
    state.count = 0;
    state.rageKept = 0;
    state.buffs = [];
  }
  
  state.count++;
  state.lastBattleTime = now;
  
  // 计算连战buff
  state.buffs = [];
  for (const buff of CONSECUTIVE_BATTLE_CONFIG.buffs) {
    if (state.count >= buff.count) {
      state.buffs.push(buff);
    }
  }
  
  return state;
}

// 结束连战，保存怒气
function endConsecutiveBattle(rage) {
  const state = _consecutiveBattleState;
  state.rageKept = Math.floor(rage * CONSECUTIVE_BATTLE_CONFIG.rageKeepPct);
  state.lastBattleTime = Date.now();
  return state.rageKept;
}

// 获取连战buff描述
function getConsecutiveBuffDesc() {
  const state = _consecutiveBattleState;
  if (!state || !state.buffs || state.count <= 1) return null;

  // 【修复】空数组保护
  if (state.buffs.length === 0) return null;
  const latestBuff = state.buffs[state.buffs.length - 1];
  if (!latestBuff) return null;

  return {
    count: state.count,
    name: latestBuff.name,
    desc: latestBuff.desc,
    rageKept: state.rageKept,
  };
}

// ── 精英敌人特殊技能系统 ────────────────────────────
const ELITE_SPECIAL_SKILLS = {
  // 精英敌人额外技能
  elite: {
    // 濒死爆发：血量低于30%时攻击+30%
    desperation: {
      name: '濒死爆发',
      desc: '生命低于30%时，攻击大幅提升',
      trigger: 'hp<30%',
      effect: { atk: 0.30 },
      announce: '💢 {name} 陷入绝境，爆发出惊人的力量！',
    },
    // 坚韧：受到致命伤害时保留1血1次
    tenacity: {
      name: '坚韧',
      desc: '受到致命伤害时，保留1点生命（每场战斗1次）',
      trigger: 'fatal',
      effect: 'survive',
      announce: '🛡️ {name} 凭借顽强意志挺过了致命一击！',
    },
    // 狂暴：每损失10%生命，攻击+3%
    berserk: {
      name: '狂暴',
      desc: '生命越低，攻击越高',
      trigger: 'continuous',
      effect: { atkPerHp10: 0.03 },
    },
  },
  
  // BOSS专属技能
  boss: {
    // 召唤：召唤小怪
    summon: {
      name: '召唤援军',
      desc: '召唤小怪协助战斗',
      trigger: 'turn3',
      effect: 'summon',
      announce: '👹 {name} 发出一声长啸，召唤援军！',
    },
    // 护盾：获得护盾
    shield: {
      name: '绝对防御',
      desc: '获得相当于最大生命20%的护盾',
      trigger: 'turn2',
      effect: { shieldPct: 0.20 },
      announce: '🛡️ {name} 展开绝对防御！',
    },
    // 全屏攻击
    aoe: {
      name: '毁灭打击',
      desc: '对所有敌人造成大量伤害',
      trigger: 'hp<50%',
      effect: { dmgMult: 1.5, aoe: true },
      announce: '💥 {name} 释放毁灭性的力量！',
    },
    // 第二阶段
    phase2: {
      name: '形态转变',
      desc: '生命低于50%时转变形态，恢复30%生命，攻击+20%',
      trigger: 'hp<50%',
      effect: { healPct: 0.30, atk: 0.20 },
      announce: '🔥 {name} 转变了形态，变得更加强大！',
    },
  },
};

// 为敌人分配特殊技能
function assignEliteSkills(enemy, tier) {
  if (tier !== 'elite' && tier !== 'boss') return null;
  
  const skillPool = ELITE_SPECIAL_SKILLS[tier];
  const skills = [];
  
  // 随机选择1-2个技能
  const skillKeys = Object.keys(skillPool);
  const count = tier === 'boss' ? 2 : 1;
  
  for (let i = 0; i < count; i++) {
    const key = skillKeys[Math.floor(Math.random() * skillKeys.length)];
    skills.push({
      key,
      ...skillPool[key],
      used: false,
    });
  }
  
  return skills;
}

// ── 战斗统计系统 ────────────────────────────────────
let _dungeonCombatStats = {
  totalBattles: 0,
  wins: 0,
  losses: 0,
  totalDamage: 0,
  totalDamageTaken: 0,
  maxDamage: 0,
  skillsUsed: {},
  elitesKilled: 0,
  bossesKilled: 0,
  fastestWin: Infinity,
  currentStreak: 0,
  maxStreak: 0,
};

// 记录战斗统计
function recordCombatStats(result) {
  const stats = _dungeonCombatStats;
  stats.totalBattles++;
  
  if (result.won) {
    stats.wins++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    
    if (result.enemyTier === 'elite') stats.elitesKilled++;
    if (result.enemyTier === 'boss') stats.bossesKilled++;
    
    if (result.duration) {
      stats.fastestWin = Math.min(stats.fastestWin, result.duration);
    }
  } else {
    stats.losses++;
    stats.currentStreak = 0;
  }
  
  stats.totalDamage += result.damageDealt || 0;
  stats.totalDamageTaken += result.damageTaken || 0;
  stats.maxDamage = Math.max(stats.maxDamage, result.maxDamage || 0);
  
  // 记录技能使用
  if (result.skillsUsed) {
    for (const skill of result.skillsUsed) {
      stats.skillsUsed[skill] = (stats.skillsUsed[skill] || 0) + 1;
    }
  }
}

// 获取战斗统计
function getCombatStats() {
  return { ..._dungeonCombatStats };
}

// 重置统计
function resetCombatStats() {
  _dungeonCombatStats = {
    totalBattles: 0,
    wins: 0,
    losses: 0,
    totalDamage: 0,
    totalDamageTaken: 0,
    maxDamage: 0,
    skillsUsed: {},
    elitesKilled: 0,
    bossesKilled: 0,
    fastestWin: Infinity,
    currentStreak: 0,
    maxStreak: 0,
  };
}

// ── 环境效果应用 ────────────────────────────────────
function applyEnvironmentEffect(dungeonId) {
  // 查找地下城主题
  let theme = null;
  for (const [t, ids] of Object.entries(DUNGEON_THEME_MAP)) {
    if (ids.includes(dungeonId)) {
      theme = t;
      break;
    }
  }
  
  if (!theme) return null;
  
  const effect = DUNGEON_ENVIRONMENT_EFFECTS[theme];
  if (!effect) return null;
  
  return {
    theme,
    ...effect,
  };
}

// ── 增强版战斗启动 ──────────────────────────────────
function startEnhancedDungeonBattle(dungeonId, playerChar, enemyChar, options = {}) {
  // 1. 应用环境效果
  const envEffect = applyEnvironmentEffect(dungeonId);
  if (envEffect && !options.skipEnv) {
    // 应用环境buff到角色
    if (envEffect.playerBuff) {
      playerChar._envBuff = envEffect.playerBuff;
    }
    if (envEffect.enemyBuff) {
      enemyChar._envBuff = envEffect.enemyBuff;
    }
    
    // 显示环境提示
    showToast(`🌍 ${envEffect.name}：${envEffect.desc}`, 3000);
  }
  
  // 2. 应用连战系统
  const consecState = startConsecutiveBattle();
  if (consecState.count > 1) {
    const buffDesc = getConsecutiveBuffDesc();
    if (buffDesc) {
      showToast(`🔥 连战×${buffDesc.count} ${buffDesc.name}！${buffDesc.desc}`, 2500);
    }
    
    // 恢复保留的怒气
    // 【修复】增加 null 检查（lSt 可能为 null 而 typeof 不拦截）
    if (consecState.rageKept > 0 && typeof lSt !== 'undefined' && lSt) {
      lSt.rage = consecState.rageKept;
    }
  }
  
  // 3. 为精英/Boss分配特殊技能
  if (enemyChar.tier === 'elite' || enemyChar.tier === 'boss') {
    enemyChar._specialSkills = assignEliteSkills(enemyChar, enemyChar.tier);
  }
  
  // 4. 启动战斗
  return startWildBattle(playerChar, enemyChar, (won) => {
    // 战斗结束回调
    
    // 保存怒气
    if (typeof lSt !== 'undefined' && lSt.rage) {
      endConsecutiveBattle(lSt.rage);
    }
    
    // 记录统计
    recordCombatStats({
      won,
      enemyTier: enemyChar.tier,
      damageDealt: window._lastBattleDamage || 0,
      damageTaken: window._lastBattleDamageTaken || 0,
    });
    
    // 调用原回调
    if (options.callback) {
      options.callback(won);
    }
  });
}

// ── 导出接口 ────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.DungeonCombatEnhanced = {
    // 环境效果
    ENV_EFFECTS: DUNGEON_ENVIRONMENT_EFFECTS,
    applyEnvironment: applyEnvironmentEffect,
    
    // 连战系统
    startConsecutive: startConsecutiveBattle,
    endConsecutive: endConsecutiveBattle,
    getConsecutiveBuff: getConsecutiveBuffDesc,
    
    // 精英技能
    assignEliteSkills,
    ELITE_SKILLS: ELITE_SPECIAL_SKILLS,
    
    // 战斗统计
    recordStats: recordCombatStats,
    getStats: getCombatStats,
    resetStats: resetCombatStats,
    
    // 增强战斗启动
    startBattle: startEnhancedDungeonBattle,
  };
}
