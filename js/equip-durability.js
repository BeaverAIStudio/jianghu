// ════════════════════════════════════════════════════════════
// equip-durability.js — 装备耐久系统
// 规则：耐久耗尽属性归零，修理费与稀有度挂钩，铁匠处修理
// 存储：装备实例 `_dur` 字段（当前耐久），`_maxDur`（最大耐久）
// ════════════════════════════════════════════════════════════

'use strict';

// ── 耐久上限表（按装备品质）────────────────────────────
const DUR_CONFIG = {
  // 稀有度 → { baseMax: 最大耐久, decayPerBattle: 每场基础损耗, costMult: 修理单价倍率 }
  common:    { baseMax: 60,  decayPerBattle: 3,  costPer: 3  },
  uncommon:  { baseMax: 80,  decayPerBattle: 4,  costPer: 5  },
  rare:      { baseMax: 100, decayPerBattle: 5,  costPer: 8  },
  epic:      { baseMax: 120, decayPerBattle: 6,  costPer: 12 },
  legendary: { baseMax: 150, decayPerBattle: 7,  costPer: 18 },
  mythic:    { baseMax: 180, decayPerBattle: 8,  costPer: 25 },
};

// 获取某装备的最大耐久
function getEquipMaxDur(instance) {
  const rarity = instance.rarity || 'common';
  const cfg = DUR_CONFIG[rarity] || DUR_CONFIG.common;
  // 强化等级也略微增加最大耐久
  const enhLv = instance._enhLv || 0;
  return cfg.baseMax + enhLv * 5;
}

// 获取某装备当前耐久（初始化时自动设置）
function getEquipDur(instance) {
  if (instance._dur === undefined || instance._dur === null) {
    // 首次访问，初始化
    instance._dur = getEquipMaxDur(instance);
    return instance._dur;
  }
  return Math.max(0, instance._dur);
}

// 获取某装备耐久百分比（0~1）
function getEquipDurRatio(instance) {
  const max = getEquipMaxDur(instance);
  if (max <= 0) return 1;
  return Math.max(0, Math.min(1, getEquipDur(instance) / max));
}

// 耐久状态标签
function getEquipDurLabel(instance) {
  const ratio = getEquipDurRatio(instance);
  if (ratio <= 0)    return { label: '破损', color: '#dd2222', icon: '💥' };
  if (ratio <= 0.25) return { label: '损坏', color: '#dd4422', icon: '⚠️' };
  if (ratio <= 0.5)  return { label: '磨损', color: '#ddaa33', icon: '🔶' };
  if (ratio <= 0.75) return { label: '尚可', color: '#88bb44', icon: '🔷' };
  return                   { label: '完好', color: '#44cc88', icon: '✨' };
}

// ── 修理费用计算 ─────────────────────────────────────
function calcRepairCost(instance, repairRatio) {
  // repairRatio: 要恢复到多少比例（0~1），默认完全修复到100%
  repairRatio = repairRatio !== undefined ? repairRatio : 1;
  const rarity = instance.rarity || 'common';
  const cfg = DUR_CONFIG[rarity] || DUR_CONFIG.common;
  const maxDur = getEquipMaxDur(instance);
  const currentDur = getEquipDur(instance);
  const targetDur = Math.round(maxDur * repairRatio);
  const durToRepair = Math.max(0, targetDur - currentDur);
  const cost = durToRepair * cfg.costPer;
  return { cost: Math.max(0, cost), durToRepair, targetDur, currentDur, maxDur };
}

// ── 修理装备 ─────────────────────────────────────────
function repairEquipAtBlacksmith(instance, npcId, repairRatio) {
  if (typeof edS === 'undefined') return { ok: false, msg: '玩家状态异常' };
  const { cost, durToRepair } = calcRepairCost(instance, repairRatio);
  if (cost <= 0) return { ok: false, msg: '装备无需修理' };
  const silver = (typeof getSilver === 'function') ? getSilver() : (edS.silver || 0);
  if (silver < cost) return { ok: false, msg: `银两不足（需${cost}两）` };

  // 扣银两
  if (typeof spendSilver === 'function') {
    spendSilver(cost, 'repair');
  } else {
    if (typeof travelPlayerState !== 'undefined') {
      travelPlayerState.silver = Math.max(0, (travelPlayerState.silver || 0) - cost);
    }
    edS.silver = Math.max(0, (edS.silver || 0) - cost);
    if (typeof saveProgress === 'function') saveProgress();
    if (typeof editorSave === 'function') editorSave();
  }


  // 恢复耐久
  const newDur = Math.min(getEquipMaxDur(instance), instance._dur + durToRepair);
  instance._dur = newDur;
  bagSave();

  // NPC好感
  if (typeof changeNpcRel === 'function') {
    changeNpcRel(npcId, 2, '修理装备');
  }

  return { ok: true, cost, newDur, maxDur: getEquipMaxDur(instance) };
}

// ── 批量修理全部装备 ─────────────────────────────────
function repairAllAtBlacksmith(npcId) {
  if (typeof edS === 'undefined' || !edS.bag) return { ok: false, msg: '背包为空' };
  const toRepair = edS.bag.filter(i => i._dur !== undefined && i._dur < getEquipMaxDur(i));
  if (toRepair.length === 0) return { ok: false, msg: '所有装备耐久完好' };

  let totalCost = 0;
  let totalRepaired = 0;
  for (const inst of toRepair) {
    const { cost } = calcRepairCost(inst);
    totalCost += cost;
  }

  const silver = (typeof getSilver === 'function') ? getSilver() : (edS.silver || 0);
  if (silver < totalCost) return { ok: false, msg: `银两不足（需${totalCost}两）` };

  // 扣银两
  if (typeof spendSilver === 'function') {
    spendSilver(totalCost, 'repair_all');
  } else {
    if (typeof travelPlayerState !== 'undefined') {
      travelPlayerState.silver = Math.max(0, (travelPlayerState.silver || 0) - totalCost);
    }
    edS.silver = Math.max(0, (edS.silver || 0) - totalCost);
    if (typeof saveProgress === 'function') saveProgress();
    if (typeof editorSave === 'function') editorSave();
  }

  // 全部修满
  for (const inst of toRepair) {
    inst._dur = getEquipMaxDur(inst);
  }
  bagSave();

  if (typeof changeNpcRel === 'function') {
    changeNpcRel(npcId, 3, '批量修理装备');
  }

  return { ok: true, totalCost, count: toRepair.length };
}

// ── 战斗损耗：每场战斗结算时调用 ────────────────────
// tier: 'func'|'major'|'elite'|'boss'
function degradeEquipOnBattleEnd(tier, isPlayerWin, savePercent) {
  if (typeof edS === 'undefined' || !edS.bag) return;
  const isMajor = tier === 'major' || tier === 'elite';
  const isEliteOrBoss = tier === 'elite' || tier === 'boss';
  let decayMult = isEliteOrBoss ? 2.0 : isMajor ? 1.5 : 1.0;
  // 天赋耐久保护（减少损耗百分比）
  if(savePercent > 0) decayMult *= (1 - savePercent / 100);

  // 找当前穿戴的武器和防具
  const weapon = (edS.weapon && edS.weapon._dur !== undefined) ? edS.weapon : null;
  const armor  = (edS.armor  && edS.armor._dur  !== undefined) ? edS.armor  : null;
  const costume= (edS.costume && edS.costume._dur !== undefined) ? edS.costume: null;
  const accessories = edS.accessories || [];

  const worn = [weapon, armor, costume, ...accessories].filter(Boolean);

  for (const inst of worn) {
    const rarity = inst.rarity || 'common';
    const cfg = DUR_CONFIG[rarity] || DUR_CONFIG.common;
    // 基础损耗 + 随机 0~base
    const decay = Math.round((cfg.decayPerBattle + Math.random() * cfg.decayPerBattle) * decayMult);
    if (inst._dur !== undefined && inst._dur !== null) {
      inst._dur = Math.max(0, inst._dur - decay);
    }
  }

  bagSave();
}

// ── 战斗属性折扣：耐久<50%时属性按比例衰减 ───────────
// 在 battle.js calcFinalStats 中调用，返回耐久折扣系数（0~1）
function getEquipDurMult(instance) {
  if (!instance || instance._dur === undefined || instance._dur === null) return 1;
  const ratio = getEquipDurRatio(instance);
  if (ratio >= 0.5) return 1;
  // 耐久 0%~50% 时：属性在 0%~100% 之间线性衰减
  // ratio=0 → 0；ratio=0.5 → 1
  return Math.max(0, ratio * 2);
}

// ── UI：背包装备耐久显示 ─────────────────────────────
// 生成耐久条HTML（用于背包界面装备项）
function renderEquipDurBar(instance, width = 60) {
  if (instance._dur === undefined && instance._dur !== 0) return '';
  const ratio = getEquipDurRatio(instance);
  const { label, color } = getEquipDurLabel(instance);
  const maxDur = getEquipMaxDur(instance);
  const curDur = getEquipDur(instance);
  const barWidth = Math.round(ratio * width);
  return `
    <div style="display:flex;align-items:center;gap:3px;margin-top:2px;">
      <div style="width:${width}px;height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
        <div style="width:${barWidth}px;height:100%;background:${color};border-radius:3px;transition:width .3s;"></div>
      </div>
      <span style="font-size:9px;color:${color};white-space:nowrap;">${label} ${curDur}/${maxDur}</span>
    </div>
  `;
}

// ── 导出 ─────────────────────────────────────────────
window.getEquipMaxDur     = getEquipMaxDur;
window.getEquipDur        = getEquipDur;
window.getEquipDurRatio   = getEquipDurRatio;
window.getEquipDurLabel   = getEquipDurLabel;
window.calcRepairCost     = calcRepairCost;
window.repairEquipAtBlacksmith  = repairEquipAtBlacksmith;
window.repairAllAtBlacksmith    = repairAllAtBlacksmith;
window.degradeEquipOnBattleEnd   = degradeEquipOnBattleEnd;
window.getEquipDurMult    = getEquipDurMult;
window.renderEquipDurBar  = renderEquipDurBar;
window.DUR_CONFIG         = DUR_CONFIG;
