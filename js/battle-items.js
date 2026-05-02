// battle-items.js — 战斗中使用道具系统
// 功能：战斗中使用背包道具（药品/暗器/特殊物品）
// 依赖: battle.js, data-editor.js (背包数据)
// ════════════════════════════════════════════════════════════════

// ── 战斗可用道具类型 ──
const BATTLE_ITEM_TYPES = {
  // 药品类
  medicine: {
    category: '药品',
    useMsg: (item, effect) => `💊 使用【${item.name}】${effect}`,
    soundType: 'heal',
  },
  // 投掷物/暗器类  
  projectile: {
    category: '暗器',
    useMsg: (item, effect) => `🎯 投出【${item.name}】！${effect}`,
    soundType: 'hit',
  },
  // 特殊辅助类
  support: {
    category: '辅助',
    useMsg: (item, effect) => `✨ 使用【${item.name}】${effect}`,
    soundType: 'skill',
  },
};

// ── 战斗道具效果定义 ──
// 匹配 data-editor.js/data-manuals.js 中的背包物品 name 关键字
const BATTLE_ITEM_EFFECTS = [
  // ─ 药品 ─
  { keywords: ['大还丹','大还', '金创', '仙丹', '回春'], type: 'medicine',
    effect: { healPct: 0.5 }, label: '回复50%气血',
    cd: 2, mpCost: 0 },
  { keywords: ['回血','疗伤','创伤','金疮'], type: 'medicine',
    effect: { healPct: 0.3 }, label: '回复30%气血',
    cd: 1, mpCost: 0 },
  { keywords: ['小还丹', '回复丹', '补血'], type: 'medicine',
    effect: { healPct: 0.2 }, label: '回复20%气血',
    cd: 1, mpCost: 0 },
  { keywords: ['内力丹','聚气丹','灵气','内息','气力丹'], type: 'medicine',
    effect: { mpRestorePct: 0.4 }, label: '恢复40%内力',
    cd: 2, mpCost: 0 },
  { keywords: ['百草','保元','养气'], type: 'medicine',
    effect: { healPct: 0.15, mpRestorePct: 0.15 }, label: '气血和内力各回复15%',
    cd: 1, mpCost: 0 },
  { keywords: ['解毒','驱毒','百解'], type: 'medicine',
    effect: { cleanse: true, healPct: 0.1 }, label: '清除毒素+回复10%气血',
    cd: 1, mpCost: 0 },
  { keywords: ['振奋','兴奋','虎骨'], type: 'medicine',
    effect: { atkBuff: 0.3, buffDur: 3 }, label: '攻击力+30%（3回合）',
    cd: 3, mpCost: 0 },
  { keywords: ['护体','铁骨','金刚'], type: 'medicine',
    effect: { defBuff: 0.4, buffDur: 3 }, label: '防御力+40%（3回合）',
    cd: 3, mpCost: 0 },

  // ─ 暗器/投掷物 ─
  { keywords: ['飞镖','钢镖','银镖'], type: 'projectile',
    effect: { dmgPct: 0.35, ignoreDefense: true }, label: '造成35%攻击力无视防御伤害',
    cd: 0, mpCost: 0, consumable: true }, // consumable=true 每次使用消耗1个
  { keywords: ['毒针','银针','梅花针'], type: 'projectile',
    effect: { dmgPct: 0.2, dotPct: 0.04, dotDur: 4 }, label: '造成伤害并使敌中毒4回合',
    cd: 0, mpCost: 0, consumable: true },
  { keywords: ['袖箭','弩箭','铁箭'], type: 'projectile',
    effect: { dmgPct: 0.5, ignoreDefense: false }, label: '造成50%攻击力伤害',
    cd: 0, mpCost: 0, consumable: true },
  { keywords: ['烟雾','烟尘','迷魂'], type: 'projectile',
    effect: { stunDur: 2, dmgPct: 0.1 }, label: '眩晕敌方2回合（+小量伤害）',
    cd: 3, mpCost: 0, consumable: true },
  { keywords: ['火折','火弹','炸弹'], type: 'projectile',
    effect: { dmgPct: 0.8, ignoreAll: true }, label: '造成80%攻击力无视一切的爆炸伤害',
    cd: 0, mpCost: 0, consumable: true },

  // ─ 特殊辅助 ─
  { keywords: ['定气散','定心','镇静'], type: 'support',
    effect: { clearDebuff: true }, label: '清除所有负面状态',
    cd: 2, mpCost: 0 },
  { keywords: ['气势','势如','破竹'], type: 'support',
    effect: { momentumFill: 80 }, label: '立即增加80点气势',
    cd: 4, mpCost: 0 },
];

// ── 道具战斗使用状态 ──
let battleItemCds = {}; // { itemName: turnsLeft }

// ── 初始化/刷新道具栏 ──
function renderBattleItemBar() {
  const bar = document.getElementById('battleItemBar');
  if (!bar) return;

  // 获取背包中战斗可用道具
  const bag = (typeof edS !== 'undefined' && edS.bag) ? edS.bag : [];
  const usableItems = [];

  bag.forEach(slot => {
    if (!slot || !slot.name) return;
    const effect = _matchBattleItem(slot.name);
    if (effect) {
      usableItems.push({ ...slot, _effect: effect });
    }
  });

  bar.innerHTML = '';
  if (usableItems.length === 0) {
    bar.innerHTML = '<div style="font-size:10px;color:rgba(255,255,255,.3);text-align:center;padding:6px">背包中无可用道具</div>';
    return;
  }

  // 最多显示6个道具
  usableItems.slice(0, 6).forEach(item => {
    const cd = battleItemCds[item.name] || 0;
    const isOnCd = cd > 0;
    const btn = document.createElement('button');
    btn.className = 'battle-item-btn' + (isOnCd ? ' on-cd' : '');
    btn.title = `${item.name}\n效果: ${item._effect.label}${item._effect.cd > 0 ? `\n冷却: ${item._effect.cd}回合` : ''}\n数量: ${item.count || 1}`;
    btn.onclick = () => useBattleItem(item);

    const qty = item.count || 1;
    btn.innerHTML = `
      <span class="bitem-icon">${item.icon || '💊'}</span>
      <span class="bitem-name">${item.name.length > 4 ? item.name.slice(0,4)+'…' : item.name}</span>
      ${qty > 1 ? `<span class="bitem-qty">×${qty}</span>` : ''}
      ${isOnCd ? `<span class="bitem-cd">${cd}</span>` : ''}
    `;
    bar.appendChild(btn);
  });
}

// ── 使用战斗道具 ──
function useBattleItem(item) {
  if (typeof over !== 'undefined' && over) return;

  const effect = item._effect;
  if (!effect) return;

  // 检查冷却
  const cd = battleItemCds[item.name] || 0;
  if (cd > 0) {
    if (typeof log === 'function') log(`⏱ 【${item.name}】冷却中（${cd}回合）`, 'lm');
    return;
  }

  const lEl = document.getElementById('fL');

  // 执行效果
  let effectDesc = '';

  if (effect.effect.healPct) {
    const healAmt = Math.round((LH._maxHpFull || LH.maxHp || 100) * effect.effect.healPct);
    lHp = Math.min(LH._maxHpFull || LH.maxHp, lHp + healAmt);
    window.lHp = lHp;
    effectDesc += `回复 ${healAmt} 气血 `;
    if (lEl) floatDmg(lEl, `+${healAmt}`, 'dh');
    if (typeof flash === 'function') flash('green');
    if (typeof playSound === 'function') playSound('heal');
  }

  if (effect.effect.mpRestorePct) {
    const mpAmt = Math.round((LH._maxMpFull || 150) * effect.effect.mpRestorePct);
    lMp = Math.min(LH._maxMpFull || 150, lMp + mpAmt);
    window.lMp = lMp;
    effectDesc += `恢复 ${mpAmt} 内力 `;
    if (lEl) floatDmg(lEl, `+${mpAmt}💙`, 'dh');
    if (typeof updateMpBars === 'function') updateMpBars();
  }

  if (effect.effect.atkBuff) {
    lSt.atkBuff = (lSt.atkBuff || 0) + effect.effect.atkBuff;
    lSt.atkBuffTurns = effect.effect.buffDur || 3;
    effectDesc += `攻击+${Math.round(effect.effect.atkBuff*100)}%（${effect.effect.buffDur}回合）`;
    if (lEl) floatDmg(lEl, `ATK+${Math.round(effect.effect.atkBuff*100)}%`, 'ls');
  }

  if (effect.effect.defBuff) {
    lSt.defBuff = (lSt.defBuff || 0) + effect.effect.defBuff;
    lSt.defBuffTurns = effect.effect.buffDur || 3;
    effectDesc += `防御+${Math.round(effect.effect.defBuff*100)}%（${effect.effect.buffDur}回合）`;
    if (lEl) floatDmg(lEl, `DEF+${Math.round(effect.effect.defBuff*100)}%`, 'ls');
  }

  if (effect.effect.cleanse) {
    lSt.poison = 0; lSt.stun = 0;
    lSt.atkBuff = Math.max(0, lSt.atkBuff || 0);
    lSt.defBuff = Math.max(0, lSt.defBuff || 0);
    effectDesc += '清除负面状态';
    if (lEl) floatDmg(lEl, '✨净化', 'dh');
  }

  if (effect.effect.clearDebuff) {
    lSt.poison = 0; lSt.stun = 0;
    effectDesc += '清除所有负面状态';
    if (lEl) floatDmg(lEl, '✨清除', 'dh');
  }

  if (effect.effect.momentumFill && typeof changeMomentum === 'function') {
    changeMomentum(effect.effect.momentumFill);
    effectDesc += `气势+${effect.effect.momentumFill}`;
    if (lEl) floatDmg(lEl, `⚡+${effect.effect.momentumFill}`, 'ls');
  }

  // 暗器/投掷物：造成伤害
  if (effect.effect.dmgPct) {
    const totalAtk = LH._stats ? LH._stats.totalAtk : (LH.atk + (LH._wepAtk || 0));
    const rawDmg = Math.round(totalAtk * effect.effect.dmgPct);
    const {dmg, isCrit} = calcDmg(totalAtk, lSt, rSt, {
      mult: effect.effect.dmgPct,
      ignoreDefense: effect.effect.ignoreDefense,
      ignoreAll: effect.effect.ignoreAll,
    });
    const rEl = document.getElementById('fR');
    const {finalDmg} = applyDmg('r', dmg, { ignoreAll: effect.effect.ignoreAll });
    if (rEl) { blink(rEl); floatDmg(rEl, `${item.icon || '🎯'}${finalDmg}`, isCrit ? 'dc' : 'dn'); }
    effectDesc += `造成 ${finalDmg} 伤害`;
    if (typeof flash === 'function') flash('red');
    if (typeof playSound === 'function') playSound('hit');
  }

  // 中毒效果
  if (effect.effect.dotPct) {
    rSt.poison = effect.effect.dotDur || 3;
    rSt.poisonDmg = effect.effect.dotPct;
    const rEl = document.getElementById('fR');
    if (rEl) floatDmg(rEl, '☠中毒', 'dp');
    effectDesc += ` 使敌中毒${effect.effect.dotDur}回合`;
  }

  // 眩晕效果
  if (effect.effect.stunDur) {
    rSt.stun = effect.effect.stunDur;
    const rEl = document.getElementById('fR');
    if (rEl) floatDmg(rEl, `😵眩晕${effect.effect.stunDur}回合`, 'dn');
    effectDesc += ` 眩晕敌方${effect.effect.stunDur}回合`;
  }

  // 消耗道具
  if (effect.consumable) {
    _consumeBattleItem(item);
  }

  // 设置冷却
  if (effect.cd > 0) {
    battleItemCds[item.name] = effect.cd;
  }

  // 打印使用日志
  const typeInfo = BATTLE_ITEM_TYPES[effect.type];
  if (typeof log === 'function') {
    log(typeInfo.useMsg(item, effectDesc), effect.type === 'projectile' ? 'ln' : 'lh');
  }

  if (typeof updateBars === 'function') updateBars();
  if (typeof renderStatus === 'function') renderStatus();
  renderBattleItemBar();

  // 使用道具消耗玩家的"行动"（触发敌方回合）
  // 注意：药品不消耗行动（属于即时效果），但暗器消耗行动
  if (effect.type === 'projectile') {
    if (typeof raidTick === 'function') raidTick();
    if (typeof checkWin === 'function') checkWin();
  }
}

// ── 每回合减少道具冷却 ──
function tickBattleItemCds() {
  Object.keys(battleItemCds).forEach(k => {
    if (battleItemCds[k] > 0) battleItemCds[k]--;
  });
  renderBattleItemBar();
}

// ── 消耗道具 ──
function _consumeBattleItem(item) {
  if (typeof edS === 'undefined' || !edS.bag) return;
  const idx = edS.bag.findIndex(s => s && s.name === item.name);
  if (idx < 0) return;
  if (edS.bag[idx].count > 1) {
    edS.bag[idx].count--;
  } else {
    edS.bag[idx] = null;
  }
  // 保存背包
  if (typeof editorSave === 'function') editorSave();
}

// ── 匹配道具效果 ──
function _matchBattleItem(itemName) {
  if (!itemName) return null;
  for (const eff of BATTLE_ITEM_EFFECTS) {
    for (const kw of eff.keywords) {
      if (itemName.includes(kw)) return eff;
    }
  }
  return null;
}

// ── 注入道具栏CSS ──
(function injectBattleItemCss(){
  const s = document.createElement('style');
  s.textContent = `
    #battleItemBar {
      display: flex;
      gap: 6px;
      justify-content: center;
      flex-wrap: wrap;
      padding: 4px 8px 6px;
      margin-top: 4px;
      background: rgba(20,10,35,.5);
      border: 1px solid rgba(200,150,255,.15);
      border-radius: 10px;
      min-height: 44px;
      align-items: center;
    }
    .battle-item-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 52px;
      min-height: 48px;
      background: rgba(100,60,160,.4);
      border: 1px solid rgba(200,150,255,.4);
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      padding: 4px 3px 3px;
      transition: all .15s;
    }
    .battle-item-btn:active { transform: scale(.93); }
    .battle-item-btn:hover  { border-color: rgba(200,150,255,.8); background: rgba(120,70,200,.5); }
    .battle-item-btn.on-cd  { opacity: .45; cursor: not-allowed; }
    .bitem-icon { font-size: 18px; line-height: 1; }
    .bitem-name { font-size: 8px; color: rgba(255,255,255,.75); text-align: center; margin-top: 2px; line-height: 1.2; max-width: 50px; overflow: hidden; }
    .bitem-qty  { position: absolute; top: 2px; right: 3px; font-size: 9px; color: #ffd060; font-weight: bold; }
    .bitem-cd   { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
                  background: rgba(0,0,0,.6); border-radius: 8px; font-size: 16px; font-weight: bold; color: #aaa; }
    #battleItemToggle {
      font-size: 10px; color: rgba(200,150,255,.6);
      text-align: center; cursor: pointer;
      padding: 3px 8px; letter-spacing: 1px;
      user-select: none;
    }
    #battleItemToggle:hover { color: rgba(200,150,255,.9); }
  `;
  document.head.appendChild(s);
})();

// 全局暴露
window.renderBattleItemBar = renderBattleItemBar;
window.useBattleItem = useBattleItem;
window.tickBattleItemCds = tickBattleItemCds;
