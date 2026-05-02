// level-system.js — 玩家与NPC通用等级/经验/属性成长系统
// 设计原则：NPC的level字段不再只是标签，而是驱动属性的唯一数字；
//           玩家也用同一套公式，通过 edS.level / edS.exp 管理

// ══════════════════════════════════════════════
//  1. 经验曲线：升到第 lv 级需要的总累计经验
// ══════════════════════════════════════════════
// 分段系数（Lv1-20 / 21-60 / 61-100 / 101-120）
// 设计：Lv1-60偏快（新手成长感强）；Lv61-100中等节奏；Lv101-120稳步冲顶
function _expCoeff(lv){
  if(lv <= 20)  return 100;
  if(lv <= 60)  return 120;
  if(lv <= 100) return 130;  // 原150→130，高级段轻微减负
  return 160;                // 原200→160，Lv100+顶级段略减负
}

// 升到第 lv 级需要消耗的经验（单级需求）
function expForLevel(lv){
  if(lv <= 1) return 0;
  return Math.round(_expCoeff(lv) * (lv - 1) * (lv - 1));
}

// 升到第 lv 级需要的累计总经验（从 Lv1 算起）
function totalExpForLevel(lv){
  let total = 0;
  for(let i = 2; i <= lv; i++) total += expForLevel(i);
  return total;
}

// 根据累计经验推算当前等级
function levelFromTotalExp(totalExp){
  let lv = 1;
  while(lv < MAX_LEVEL && totalExpForLevel(lv + 1) <= totalExp) lv++;
  return lv;
}

const MAX_LEVEL = 120;  // 玩家等级上限 Lv120

// ── 预计算查找表（加速运行时查询）──
const _EXP_TABLE = (() => {
  const t = [0, 0]; // index = level, value = totalExp to reach that level
  for(let lv = 2; lv <= MAX_LEVEL; lv++){
    t[lv] = t[lv-1] + expForLevel(lv);
  }
  return t;
})();

// 快速版：升到第 lv 级需要多少总经验
function expNeededForLevel(lv){
  return _EXP_TABLE[Math.min(lv, MAX_LEVEL)] || 0;
}

// 快速版：从总经验反推等级
function calcLevelFromExp(totalExp){
  let lo = 1, hi = MAX_LEVEL;
  while(lo < hi){
    const mid = (lo + hi + 1) >> 1;
    if(_EXP_TABLE[mid] <= totalExp) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// ══════════════════════════════════════════════
//  2. 属性成长公式（玩家/NPC通用）—— "将将胡"随机成长版
// ══════════════════════════════════════════════
// 每升一级的属性增长量（带随机波动，模拟命运无常）
// 设计原则：像麻将凑牌一样，每次升级都是一次"摸牌"，运气好成长高
const LV_GROWTH_BASE = {
  hp:  { min: 2, max: 6, base: 4 },      // 气血：2-6波动，期望4
  atk: { min: 0, max: 2, base: 1 },      // 攻击：0-2波动，期望1
  def: { min: 0, max: 1, base: 0.5 },    // 防御：0-1波动，期望0.5
  mp:  { min: 1, max: 5, base: 3 },      // 内力：1-5波动，期望3
  spd: { min: 0.05, max: 0.25, base: 0.15 }, // 速度：0.05-0.25波动
};

// ═══════════════════════════════════════════════════════════════
//  等级突破"将将胡"系统 - 特殊突破事件
// ═══════════════════════════════════════════════════════════════
const LEVEL_JIANGHU_EVENTS = {
  // 意外突破：额外获得属性加成
  unexpectedBreakthrough: {
    id: 'unexpectedBreakthrough',
    chance: 0.05, // 5%
    icon: '⚡',
    title: '意外突破',
    desc: '你在升级之际突然顿悟，武学境界更上一层楼！',
    effect: () => ({ extraPoints: 3, msg: '⚡ 意外突破！额外获得3点自由属性点！' }),
  },
  // 瓶颈：升级但属性成长降低
  bottleneck: {
    id: 'bottleneck',
    chance: 0.03, // 3%
    icon: '📉',
    title: '遭遇瓶颈',
    desc: '你感觉功力停滞不前，似乎遇到了瓶颈...',
    effect: () => ({ growthPenalty: 0.5, msg: '📉 遭遇瓶颈！本次属性成长-50%，但突破后会有额外奖励！' }),
  },
  // 厚积薄发：连续升级时触发
  accumulatedPower: {
    id: 'accumulatedPower',
    chance: 0.04, // 4%
    icon: '🔥',
    title: '厚积薄发',
    desc: '多日苦修终于爆发，你的实力突飞猛进！',
    effect: () => ({ extraGrowth: 1.5, msg: '🔥 厚积薄发！本次属性成长+50%！' }),
  },
  // 天降机缘：获得特殊奖励
  divineChance: {
    id: 'divineChance',
    chance: 0.02, // 2%
    icon: '✨',
    title: '天降机缘',
    desc: '一道灵光闪过，你仿佛得到了天地的眷顾！',
    effect: () => ({ bonusSilver: 100, msg: '✨ 天降机缘！获得100两银子！' }),
  },
};

// 暴击/闪避不随等级涨，纯靠装备/体型/心志/身法加点

// ── 获取玩家气运（影响成长波动偏向）──
function _getPlayerFateBonus(){
  // 从存档读取气运值（edS.luk 或 edS.originPts?.luk）
  let luk = 0;
  if(typeof edS !== 'undefined'){
    luk = (edS.originPts?.luk || 0) + (edS.primaryPts?.luk || 0);
  }
  // 气运每点提供 3% 偏向高值（最高30%）
  return Math.min(0.3, luk * 0.03);
}

// ── 随机成长核心：像掷骰子一样决定这一级涨多少 ──
function _rollGrowth(statKey, fateBonus = 0){
  const cfg = LV_GROWTH_BASE[statKey];
  if(!cfg) return 0;
  
  // 基础随机（0-1）
  let roll = Math.random();
  
  // 气运修正：让 roll 偏向高值
  // fateBonus=0.3 时，roll 平均从 0.5 提升到 0.65
  roll = Math.min(1, roll + fateBonus * (1 - roll));
  
  // 线性插值到 [min, max]
  const val = cfg.min + roll * (cfg.max - cfg.min);
  
  // 返回整数或保留一位小数
  return statKey === 'spd' ? Math.round(val * 10) / 10 : Math.round(val);
}

// ── 生成从 Lv1 到目标等级的累计成长记录 ──
// 返回对象包含：total（累计值）, history（每级成长数组）
function generateGrowthHistory(targetLevel){
  const history = [];
  const fateBonus = _getPlayerFateBonus();
  
  for(let lv = 2; lv <= targetLevel; lv++){
    history.push({
      lv: lv,
      hp:  _rollGrowth('hp', fateBonus),
      atk: _rollGrowth('atk', fateBonus),
      def: _rollGrowth('def', fateBonus),
      mp:  _rollGrowth('mp', fateBonus),
      spd: _rollGrowth('spd', fateBonus),
    });
  }
  
  const total = history.reduce((acc, h) => ({
    hp: acc.hp + h.hp,
    atk: acc.atk + h.atk,
    def: acc.def + h.def,
    mp: acc.mp + h.mp,
    spd: acc.spd + h.spd,
  }), { hp: 0, atk: 0, def: 0, mp: 0, spd: 0 });
  
  return { total, history };
}

// 获取某等级相对于Lv1的属性加成（纯等级部分，含随机波动）
function getLevelBonus(level){
  const lv = Math.max(1, level);
  if(lv <= 1) return { hp: 0, atk: 0, def: 0, mp: 0, spd: 0 };
  
  // 尝试从存档读取已记录的成长历史（保证同一玩家每次计算一致）
  let growth = null;
  try{
    const saved = localStorage.getItem('wuxia_growth_history');
    if(saved) growth = JSON.parse(saved);
  }catch(e){}
  
  // 如果没有历史记录或等级不够，重新生成
  if(!growth || growth.length < lv - 1){
    const { history } = generateGrowthHistory(lv);
    growth = history;
    try{
      localStorage.setItem('wuxia_growth_history', JSON.stringify(growth));
    }catch(e){}
  }
  
  // 累加到目标等级
  const total = growth.slice(0, lv - 1).reduce((acc, h) => ({
    hp: acc.hp + (h.hp || 0),
    atk: acc.atk + (h.atk || 0),
    def: acc.def + (h.def || 0),
    mp: acc.mp + (h.mp || 0),
    spd: acc.spd + (h.spd || 0),
  }), { hp: 0, atk: 0, def: 0, mp: 0, spd: 0 });
  
  return {
    hp:  Math.round(total.hp),
    atk: Math.round(total.atk),
    def: Math.round(total.def),
    mp:  Math.round(total.mp),
    spd: Math.round(total.spd * 10) / 10,
  };
}

// ══════════════════════════════════════════════
//  3. 战斗经验获取公式
// ══════════════════════════════════════════════
// 基础经验 = 怪物的 baseExp（或目标等级的平方 * 系数作为保底）
// 等级差加成/惩罚：打比自己高的给加成，打比自己低的给惩罚
function calcBattleExp(playerLevel, targetLevel, targetTier, targetBaseExp){
  const tierMult = { func: 1.0, major: 1.8, elite: 3.0 }[targetTier] || 1.0;
  
  // 优先使用怪物定义的基础经验，如果没有则按等级计算保底
  let baseExp;
  if (targetBaseExp && targetBaseExp > 0) {
    baseExp = Math.round(targetBaseExp * tierMult);
  } else {
    // 保底公式：等级平方 * 0.5（比原来低，因为怪物应该有定义exp）
    baseExp = Math.round(targetLevel * targetLevel * 0.5 * tierMult);
  }

  // 等级差：正数=目标更高
  const diff = targetLevel - playerLevel;
  let diffMult;
  if(diff >= 20)      diffMult = 2.0;   // 远强于我，大量经验
  else if(diff >= 10) diffMult = 1.5;
  else if(diff >= 5)  diffMult = 1.2;
  else if(diff >= 3)  diffMult = 1.1;   // 高3级就有小加成
  else if(diff >= 1)  diffMult = 1.05;  // 高1级就有微加成
  else if(diff >= -2) diffMult = 1.0;   // 同级附近（-2到+1）
  else if(diff >= -5) diffMult = 0.7;   // 比我低几级开始惩罚
  else if(diff >= -10)diffMult = 0.4;   // 比我低10级
  else if(diff >= -20)diffMult = 0.2;   // 比我低20级，少量经验
  else               diffMult = 0.1;   // 刷低级怪，几乎没经验

  return Math.max(1, Math.round(baseExp * diffMult));
}

// ══════════════════════════════════════════════
//  4. 玩家等级管理：addPlayerExp / 升级处理
// ══════════════════════════════════════════════

// 给玩家加经验，自动触发升级
function addPlayerExp(amount, sourceDesc){
  console.log('[addPlayerExp] 被调用:', { amount, sourceDesc, edS_defined: typeof edS !== 'undefined' });

  if(!amount || amount <= 0) {
    console.log('[addPlayerExp] 拒绝: 经验值无效', amount);
    return;
  }
  if(typeof edS === 'undefined') {
    console.log('[addPlayerExp] 拒绝: edS 未定义');
    return;
  }

  // 初始化字段（兼容旧存档）
  if(!edS.level) edS.level = 1;
  if(!edS.totalExp) edS.totalExp = 0;

  console.log('[addPlayerExp] 当前状态:', { level: edS.level, totalExp: edS.totalExp, amount });

  if(edS.level >= MAX_LEVEL) {
    console.log('[addPlayerExp] 拒绝: 已满级', edS.level);
    return; // 已满级
  }

  const oldExp = edS.totalExp;
  edS.totalExp += amount;
  console.log('[addPlayerExp] 经验增加:', { oldExp, newExp: edS.totalExp, added: amount });

  const newLevel = calcLevelFromExp(edS.totalExp);
  console.log('[addPlayerExp] 等级检查:', { oldLevel: edS.level, newLevel });

  if(newLevel > edS.level){
    const oldLevel = edS.level;
    edS.level = newLevel;
    _onPlayerLevelUp(oldLevel, newLevel, amount);
  }

  // 保存
  try{
    // 保存到 wuxia_player_progress（旧格式兼容）
    const saved = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    saved.level = edS.level;
    saved.totalExp = edS.totalExp;
    localStorage.setItem('wuxia_player_progress', JSON.stringify(saved));
    console.log('[addPlayerExp] 已保存到 wuxia_player_progress:', { level: saved.level, totalExp: saved.totalExp });

    // 同时保存到 wuxia_player_profile（dungeon.html 使用此格式）
    const profileRaw = localStorage.getItem('wuxia_player_profile');
    if(profileRaw){
      const profile = JSON.parse(profileRaw);
      profile.level = edS.level;
      profile.totalExp = edS.totalExp;
      localStorage.setItem('wuxia_player_profile', JSON.stringify(profile));
      console.log('[addPlayerExp] 已保存到 wuxia_player_profile:', { level: profile.level, totalExp: profile.totalExp });
    } else {
      console.log('[addPlayerExp] wuxia_player_profile 不存在，跳过');
    }

    // 同时保存到 wuxia_editor（town.html 使用此格式）
    const editorRaw = localStorage.getItem('wuxia_editor');
    if(editorRaw){
      const editor = JSON.parse(editorRaw);
      editor.level = edS.level;
      editor.totalExp = edS.totalExp;
      localStorage.setItem('wuxia_editor', JSON.stringify(editor));
      console.log('[addPlayerExp] 已保存到 wuxia_editor:', { level: editor.level, totalExp: editor.totalExp });
    } else {
      console.log('[addPlayerExp] wuxia_editor 不存在，跳过');
    }
  }catch(e){
    console.error('[addPlayerExp] 保存失败:', e);
  }

  // 刷新UI
  console.log('[addPlayerExp] 刷新UI...');
  renderPlayerExpBar();

  if(sourceDesc){
    // 仅在travel页面显示经验提示（武斗场有自己的提示区）
    if(typeof showToast === 'function' && document.getElementById('travelSection')?.style.display !== 'none'){
      showToast(`+${amount} 经验${sourceDesc ? '（'+sourceDesc+'）' : ''}`, 'exp');
    }
  }

  console.log('[addPlayerExp] 完成!');
}

// 升级触发：发放自由加点 + 动画
function _onPlayerLevelUp(oldLv, newLv, gainedExp){
  const levelsGained = newLv - oldLv;

  // ═══════════════════════════════════════════════════════════════
  //  等级突破"将将胡"系统 - 特殊事件检查
  // ═══════════════════════════════════════════════════════════════
  let specialEvent = null;
  let eventEffect = null;
  for (const [key, event] of Object.entries(LEVEL_JIANGHU_EVENTS)) {
    if (Math.random() < event.chance) {
      specialEvent = event;
      eventEffect = event.effect();
      break;
    }
  }

  // ── 发放根骨自由点（每级3点）──
  let newPoints = levelsGained * (typeof POINTS_PER_LEVEL !== 'undefined' ? POINTS_PER_LEVEL : 3);

  // 应用特殊事件效果
  if (specialEvent) {
    if (eventEffect.extraPoints) {
      newPoints += eventEffect.extraPoints;
    }
    if (eventEffect.bonusSilver) {
      if (typeof addSilver === 'function') {
        addSilver(eventEffect.bonusSilver);
      } else if (typeof edS !== 'undefined') {
        edS.silver = (edS.silver || 0) + eventEffect.bonusSilver;
        if (typeof saveProgress === 'function') saveProgress();
        if (typeof editorSave === 'function') editorSave();
      }
    }
  }

  if(typeof edS !== 'undefined'){
    const oldFree = edS.freePoints || 0;
    edS.freePoints = oldFree + newPoints;
    console.log(`[升级] Lv${oldLv}→${newLv} | freePoints: ${oldFree} → ${edS.freePoints} (+${newPoints}点)`);
    // 同步 maxHp/maxMp（随等级成长自动更新）
    if(typeof edStats === 'function'){
      const newStats = edStats();
      const oldMaxHp = edS.maxHp || newStats.hp;
      const oldMaxMp = edS.maxMp || newStats.mp;
      edS.maxHp = newStats.hp;
      edS.maxMp = newStats.mp;
      // 按比例恢复当前值（升级回血）
      edS.hp = Math.min(edS.maxHp, edS.hp + Math.round((edS.maxHp - oldMaxHp) * 0.5 + 10));
      edS.mp = Math.min(edS.maxMp, edS.mp + Math.round((edS.maxMp - oldMaxMp) * 0.5 + 5));
    }
    // 同步存档（primary-stats.js 的 savePrimaryStats 会处理完整存档）
    if(typeof savePrimaryStats === 'function') savePrimaryStats();
  }

  // 升级动画 + 通知（传入特殊事件）
  _showLevelUpEffect(oldLv, newLv, specialEvent, eventEffect);

  // 刷新所有相关UI（确保属性点、经验条等即时更新）
  if(typeof renderPrimaryPanel === 'function') renderPrimaryPanel();
  if(typeof edRefreshPreview === 'function') edRefreshPreview();
  renderPlayerExpBar();
  
  // 更新根骨按钮红点（有剩余点数时显示）
  const tpbRootBone = document.getElementById('tpbRootBone');
  if(tpbRootBone){
    const freePts = edS.freePoints || 0;
    tpbRootBone.classList.toggle('has-points', freePts > 0);
    console.log(`[升级UI] 根骨按钮红点: ${freePts > 0 ? '显示' : '隐藏'} (剩余${freePts}点)`);
  }

  // 弹出根骨加点提示
  setTimeout(() => {
    if(typeof showLevelUpAllocPrompt === 'function') showLevelUpAllocPrompt(newLv);
  }, 800);

  // 旅行系统同步恢复气血/精力（奖励）
  if(typeof travelPlayerState !== 'undefined'){
    travelPlayerState.hp = Math.min(100, travelPlayerState.hp + 20);
    travelPlayerState.energy = Math.min(100, travelPlayerState.energy + 30);
    if(typeof travelSave === 'function') travelSave();
  }

  // ── 情境任务触发：升级（任何场景均需触发，不限于旅行页）──
  if(typeof triggerContextualLevel === 'function'){
    setTimeout(()=>{ try{ triggerContextualLevel(newLv); }catch(e){} }, 300);
  }

  // 检查并自动解锁新功能
  if(typeof checkAndAutoUnlockFeatures === 'function'){
    checkAndAutoUnlockFeatures();
  }
}

// ══════════════════════════════════════════════
//  5. 玩家存档加载（初始化时调用）
// ══════════════════════════════════════════════
function loadPlayerProgress(){
  if(typeof edS === 'undefined') return;
  try{
    const saved = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    edS.level    = saved.level    || 1;
    edS.totalExp = saved.totalExp || 0;
    // 校验一致性
    const calcedLv = calcLevelFromExp(edS.totalExp);
    if(calcedLv !== edS.level) edS.level = calcedLv;
  }catch(e){
    edS.level = 1;
    edS.totalExp = 0;
  }
  // 同步加载根骨加点数据
  if(typeof loadPrimaryStats === 'function') loadPrimaryStats();
}

// ══════════════════════════════════════════════
//  6. edStats() 的等级加成入口（供 editor.js 调用）
// ══════════════════════════════════════════════
// 返回当前玩家等级带来的属性加成（叠加到 edStats 的 base 上）
function getPlayerLevelBonus(){
  const lv = (typeof edS !== 'undefined' ? edS.level : null) || 1;
  return getLevelBonus(lv);
}

// ══════════════════════════════════════════════
//  7. 经验条 UI 渲染
// ══════════════════════════════════════════════
function renderPlayerExpBar(){
  const lvEl  = document.getElementById('playerLevelNum');
  const barEl = document.getElementById('playerExpBar');
  const curEl = document.getElementById('playerExpCur');
  const maxEl = document.getElementById('playerExpMax');
  
  // town.html 使用不同的 ID
  const townLvEl = document.getElementById('tsbLevelBadge');
  const townBarEl = document.getElementById('playerExpBar'); // bar ID 相同
  const townCurEl = document.getElementById('playerExpCur');
  const townMaxEl = document.getElementById('playerExpMax');
  
  if(!barEl && !townBarEl) return; // 两个页面都没有经验条

  const lv       = (typeof edS !== 'undefined' ? edS.level : null) || 1;
  const totalExp = (typeof edS !== 'undefined' ? edS.totalExp : null) || 0;

  if(lv >= MAX_LEVEL){
    if(lvEl) lvEl.textContent = lv;
    if(townLvEl) townLvEl.textContent = 'Lv.' + lv;
    if(barEl) barEl.style.width = '100%';
    if(townBarEl) townBarEl.style.width = '100%';
    if(curEl) curEl.textContent = '满级';
    if(townCurEl) townCurEl.textContent = '满级';
    if(maxEl) maxEl.textContent = '';
    if(townMaxEl) townMaxEl.textContent = '';
    return;
  }

  const expThisLv  = expNeededForLevel(lv);        // 到当前级的累计经验
  const expNextLv  = expNeededForLevel(lv + 1);    // 到下一级的累计经验
  const expIntoLv  = totalExp - expThisLv;          // 本级内已积累
  const expNeedLv  = expNextLv - expThisLv;         // 本级需要
  const pct        = Math.min(100, (expIntoLv / expNeedLv) * 100).toFixed(1);

  // 更新 editor/战斗页面的元素
  if(lvEl) lvEl.textContent = lv;
  if(barEl) barEl.style.width = pct + '%';
  if(curEl) curEl.textContent = expIntoLv.toLocaleString();
  if(maxEl) maxEl.textContent = expNeedLv.toLocaleString();
  
  // 更新 town.html 的元素
  if(townLvEl) townLvEl.textContent = 'Lv.' + lv;
  if(townBarEl) townBarEl.style.width = pct + '%';
  if(townCurEl) townCurEl.textContent = expIntoLv.toLocaleString();
  if(townMaxEl) townMaxEl.textContent = expNeedLv.toLocaleString();
}

// ══════════════════════════════════════════════
//  9. 等级功能解锁节奏系统
// ══════════════════════════════════════════════
const LEVEL_GATES = [
  { lv: 3,  icon: '⌸', name: '投壶',     note: '酒馆城市可游玩',       color: '#e8a070' },
  { lv: 5,  icon: '⚔', name: '擂台挑战',  note: '大城市开放擂台比武',    color: '#e08080' },
  { lv: 8,  icon: '🎲', name: '赌坊',     note: '大城市开放',            color: '#d0c060' },
  { lv: 8,  icon: '🎴', name: '天机阁',   note: '大城市开放翻牌玩法',    color: '#a080e0' },
  { lv: 10, icon: '🛡', name: '护镖任务',  note: '镖局城市可接镖',       color: '#80d0c0' },
  { lv: 15, icon: '🌿', name: '采药玩法',  note: '开放采药小游戏',        color: '#60c080' },
  { lv: 20, icon: '🔨', name: '锻造系统',  note: '铁匠铺开放装备锻造',    color: '#c08040' },
  { lv: 30, icon: '🏅', name: '称号比武',  note: '开封擂台开放',          color: '#ffd060' },
  { lv: 50, icon: '🐉', name: '高级险地',  note: 'Lv50+地下城开放',      color: '#e05050' },
];

// 生成升级弹窗中的解锁提示 HTML
// oldLv → newLv：本次升级解锁什么
// newLv → nextGate：下一级预告
function _getLevelUnlockSection(oldLv, newLv){
  const newlyUnlocked = LEVEL_GATES.filter(g => g.lv > oldLv && g.lv <= newLv);
  const nextGate = LEVEL_GATES.find(g => g.lv > newLv);
  const nextLv  = nextGate ? nextGate.lv : null;
  const toNext  = nextLv ? nextLv - newLv : null;

  let html = '';

  // ── 本次解锁 ──
  if(newlyUnlocked.length > 0){
    html += '<div style="margin:10px 0 0;border-top:1px solid rgba(200,160,80,.1);padding-top:8px;">';
    html += '<div style="font-size:9px;letter-spacing:3px;color:rgba(200,160,80,.45);margin-bottom:5px;">✦ 本次解锁 ✦</div>';
    newlyUnlocked.forEach(g => {
      html += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <span style="font-size:12px">${g.icon}</span>
        <span style="font-size:11px;color:${g.color};font-weight:bold">${g.name}</span>
        <span style="font-size:10px;color:rgba(180,180,160,.5)">${g.note}</span>
      </div>`;
    });
    html += '</div>';
  }

  // ── 下一级预告 ──
  if(nextGate && toNext && toNext <= 5){
    html += `<div style="margin-top:8px;font-size:10px;color:rgba(160,160,140,.4);letter-spacing:1px;">
      再升 <span style="color:rgba(200,160,80,.6)">${toNext}</span> 级解锁：
      <span style="font-size:12px;margin-left:3px">${nextGate.icon}</span>
      <span style="color:rgba(200,180,120,.55)">${nextGate.name}</span>
    </div>`;
  }

  return html;
}

// ── 状态栏持续提示：下一级解锁（供 townRefreshStatus 调用）──
function _getNextUnlockHint(lv){
  const nextGate = LEVEL_GATES.find(g => g.lv > lv);
  if(!nextGate) return ''; // 已满级
  const toNext = nextGate.lv - lv;
  // 超过5级不显示提示
  if(toNext > 5) return '';
  return `<span class="tsbnu-label">再升${toNext}级：</span><span class="tsbnu-name">${nextGate.icon} ${nextGate.name}</span>`;
}
window._getNextUnlockHint = _getNextUnlockHint;

// ══════════════════════════════════════════════
//  8. 升级特效（华丽版）
// ══════════════════════════════════════════════
function _showLevelUpEffect(oldLv, newLv, specialEvent, eventEffect){
  const levelsGained = newLv - oldLv;
  const title = getLevelTitle(newLv);

  // 播放升级音效
  if (typeof playAudio === 'function') playAudio('level_up');

  // 计算属性增长（用于弹窗展示）
  let _hpGain   = levelsGained * LV_GROWTH_BASE.hp.base;
  let _mpGain   = levelsGained * LV_GROWTH_BASE.mp.base;
  let _atkGain  = levelsGained * LV_GROWTH_BASE.atk.base;
  let _defGain  = levelsGained * LV_GROWTH_BASE.def.base;
  let _ptGain   = levelsGained * 3; // 根骨自由点

  // 应用特殊事件效果到显示
  if (specialEvent && eventEffect) {
    if (eventEffect.growthPenalty) {
      _hpGain = Math.floor(_hpGain * eventEffect.growthPenalty);
      _mpGain = Math.floor(_mpGain * eventEffect.growthPenalty);
      _atkGain = Math.floor(_atkGain * eventEffect.growthPenalty);
      _defGain = Math.floor(_defGain * eventEffect.growthPenalty);
    }
    if (eventEffect.extraGrowth) {
      _hpGain = Math.floor(_hpGain * eventEffect.extraGrowth);
      _mpGain = Math.floor(_mpGain * eventEffect.extraGrowth);
      _atkGain = Math.floor(_atkGain * eventEffect.extraGrowth);
      _defGain = Math.floor(_defGain * eventEffect.extraGrowth);
    }
    if (eventEffect.extraPoints) {
      _ptGain += eventEffect.extraPoints;
    }
  }

  // ── 全屏金光爆炸层 ──
  const flashOv = document.createElement('div');
  flashOv.id = 'lvup-flash-ov';
  flashOv.style.cssText = `
    position:fixed;inset:0;z-index:9990;pointer-events:none;
    background:radial-gradient(circle at center, rgba(255,220,80,.6) 0%, rgba(255,150,20,.2) 40%, transparent 75%);
    opacity:0;transition:opacity .15s;
  `;
  document.body.appendChild(flashOv);
  requestAnimationFrame(()=>{
    flashOv.style.opacity = '1';
    setTimeout(()=>{ flashOv.style.opacity = '0'; }, 300);
    setTimeout(()=>{ flashOv.remove(); }, 500);
  });

  // ── 主弹窗 ──
  const ov = document.createElement('div');
  ov.id = 'lvup-modal';
  ov.style.cssText = `
    position:fixed;inset:0;z-index:9995;
    background:rgba(0,0,0,.88);
    display:flex;align-items:center;justify-content:center;
    opacity:0;transition:opacity .3s;
    font-family:'Courier New',monospace;
  `;

  // 等级对应升华称号
  const rankAsciiMap = {
    10:  '  江湖  \n  新秀  ',
    20:  '  小有  \n  名气  ',
    35:  '  闯荡  \n  江湖  ',
    50:  '  名震  \n  一方  ',
    65:  '  一代  \n  高手  ',
    80:  '  绝顶  \n  宗师  ',
    95:  '  天下  \n  无双  ',
    110: '武林至尊',
    120: '天下第一',
  };
  const specialLvLabel = Object.entries(rankAsciiMap)
    .filter(([lv]) => newLv >= Number(lv))
    .pop()?.[1] || '';

  const isRankUp = Object.keys(rankAsciiMap).some(lv => Number(lv) === newLv);

  ov.innerHTML = `
    <div id="lvup-box" style="
      background:linear-gradient(160deg,rgba(25,18,5,.98),rgba(12,8,2,.99));
      border:1px solid rgba(255,200,60,.3);
      border-radius:14px;padding:28px 24px 20px;max-width:340px;width:90%;
      box-shadow:0 0 60px rgba(255,180,0,.2),0 8px 32px rgba(0,0,0,.6);
      text-align:center;
      transform:scale(.4) rotate(-8deg);opacity:0;
      transition:transform .55s cubic-bezier(.175,.885,.32,1.275), opacity .4s;
    ">
      <div style="font-size:11px;letter-spacing:6px;color:rgba(200,160,80,.6);margin-bottom:8px;">— 等级提升 —</div>
      <div id="lvup-num" style="
        font-size:64px;font-weight:bold;letter-spacing:8px;
        color:#ffd060;line-height:1;
        text-shadow:0 0 40px rgba(255,200,80,.8),0 0 80px rgba(255,150,0,.5);
        animation:lvupNumPop .7s cubic-bezier(.175,.885,.32,1.275) .2s both;
      ">${newLv}</div>
      <div style="font-size:15px;color:rgba(220,185,100,.85);letter-spacing:5px;margin:8px 0 4px;">${title}</div>
      ${isRankUp ? `<div style="font-size:11px;letter-spacing:4px;color:rgba(255,200,80,.5);margin-bottom:8px;">✦ 称号晋升 ✦</div>` : ''}
      ${specialEvent ? `
      <div style="margin:10px 0;padding:10px 15px;background:${specialEvent.id === 'bottleneck' ? 'rgba(255,80,80,0.15)' : 'rgba(255,208,96,0.15)'};border:1px solid ${specialEvent.id === 'bottleneck' ? '#ff6060' : '#ffd060'};border-radius:8px;">
        <div style="font-size:10px;color:${specialEvent.id === 'bottleneck' ? '#ff6060' : '#ffd060'};margin-bottom:4px;">
          <span style="border:1px solid ${specialEvent.id === 'bottleneck' ? '#ff6060' : '#ffd060'};padding:1px 6px;border-radius:10px;">将将胡</span>
        </div>
        <div style="font-size:18px;color:${specialEvent.id === 'bottleneck' ? '#ff6060' : '#ffd060'};margin:5px 0;">${specialEvent.icon} ${specialEvent.title}</div>
        <div style="font-size:11px;color:rgba(200,180,120,.8);font-style:italic;">${specialEvent.desc}</div>
        ${eventEffect && eventEffect.msg ? `<div style="font-size:12px;color:${specialEvent.id === 'bottleneck' ? '#ff8080' : '#ffec8b'};margin-top:6px;font-weight:bold;">${eventEffect.msg}</div>` : ''}
      </div>
      ` : ''}
      <div style="width:80%;height:1px;background:rgba(200,160,80,.2);margin:12px auto;"></div>
      <div style="font-size:12px;color:rgba(180,200,180,.8);line-height:2;letter-spacing:2px;">
        <div>❤ 气血上限 <span style="color:#88ee88">+${_hpGain}</span></div>
        <div>💙 内力上限 <span style="color:#88aaff">+${_mpGain}</span></div>
        <div>⚔ 基础攻击 <span style="color:#ffaa44">+${_atkGain}</span></div>
        <div>🛡 基础防御 <span style="color:#44ccff">+${_defGain}</span></div>
        <div>✦ 根骨自由点 <span style="color:#ffd060">+${_ptGain}</span></div>
      </div>
      ${levelsGained > 1 ? `<div style="font-size:10px;color:rgba(200,160,80,.4);margin-top:8px;letter-spacing:2px;">连升 ${levelsGained} 级！</div>` : ''}
      <div style="
        margin:14px 4px 0;
        font-size:11px;
        color:rgba(190,175,140,.5);
        font-style:italic;
        line-height:1.8;
        letter-spacing:1px;
        text-align:left;
        border-top:1px solid rgba(200,160,80,.1);
        padding-top:10px;
      ">${_getLevelUpNarration(newLv)}</div>
      ${_getLevelUnlockSection(oldLv, newLv)}
      <button id="lvup-close-btn" style="
        margin-top:18px;
        background:rgba(200,160,80,.15);
        border:1px solid rgba(200,160,80,.35);
        border-radius:8px;color:rgba(220,185,100,.85);
        padding:9px 32px;font-size:13px;letter-spacing:4px;
        cursor:pointer;transition:background .2s;
      ">踏上新征途</button>
    </div>
  `;
  document.body.appendChild(ov);

  // 动画：弹窗弹出
  requestAnimationFrame(()=>{
    ov.style.opacity = '1';
    const box = document.getElementById('lvup-box');
    if(box){
      requestAnimationFrame(()=>{
        box.style.transform = 'scale(1) rotate(0)';
        box.style.opacity = '1';
      });
    }
  });

  // 粒子雨
  setTimeout(()=>{ _lvupParticleRain(ov); }, 300);

  // 关闭按钮
  setTimeout(()=>{
    const closeBtn = document.getElementById('lvup-close-btn');
    if(closeBtn){
      closeBtn.addEventListener('click', ()=> ov.remove());
    }
    // 5秒自动关闭
    setTimeout(()=>{ if(ov.parentNode) ov.remove(); }, 6000);
  }, 100);

  // CSS keyframes 注入（一次性）
  if(!document.getElementById('lvup-keyframes')){
    const st = document.createElement('style');
    st.id = 'lvup-keyframes';
    st.textContent = `
@keyframes lvupNumPop {
  0%  { transform: scale(.2) rotateY(-90deg); opacity:0; }
  60% { transform: scale(1.25) rotateY(10deg); opacity:1; }
  100%{ transform: scale(1) rotateY(0); opacity:1; }
}
@keyframes lvupRainFall {
  0%  { transform: translateY(-10px) rotate(0); opacity:1; }
  100%{ transform: translateY(110vh) rotate(720deg); opacity:0; }
}
@keyframes lvupFlash {
  0%  { opacity:.8; }
  100%{ opacity:0; transform:scale(1.5); }
}
@keyframes lvupMsg {
  0%  { transform:translate(-50%,-50%) scale(.3); opacity:0; }
  20% { transform:translate(-50%,-50%) scale(1.2); opacity:1; }
  80% { transform:translate(-50%,-50%) scale(1);   opacity:1; }
  100%{ transform:translate(-50%,-50%) scale(.8);  opacity:0; }
}
    `;
    document.head.appendChild(st);
  }

  // 同步刷新经验条
  setTimeout(renderPlayerExpBar, 100);
}

function _lvupParticleRain(container){
  const syms = ['✦','★','◆','🏅','💎','⚡','👑','✸','⬡'];
  const colors = ['#ffd060','#ffaa30','#fff0a0','#ff8c00','#ffe680'];
  for(let i = 0; i < 35; i++){
    setTimeout(()=>{
      const p = document.createElement('div');
      p.style.cssText = `
        position:fixed;
        left:${Math.random()*100}%;
        top:-24px;
        font-size:${12 + Math.random()*12}px;
        color:${colors[Math.floor(Math.random()*colors.length)]};
        pointer-events:none;
        z-index:9996;
        animation:lvupRainFall ${0.9+Math.random()*1.2}s linear forwards;
      `;
      p.textContent = syms[Math.floor(Math.random()*syms.length)];
      document.body.appendChild(p);
      setTimeout(()=>{ if(p.parentNode) p.remove(); }, 2200);
    }, i * 55);
  }
}


// ══════════════════════════════════════════════
//  9. 等级称号（用于UI展示）
// ══════════════════════════════════════════════
const LEVEL_TITLES = [
  { min:1,   label:'初出茅庐' },
  { min:10,  label:'江湖新秀' },
  { min:20,  label:'小有名气' },
  { min:35,  label:'闯荡江湖' },
  { min:50,  label:'名震一方' },
  { min:65,  label:'一代高手' },
  { min:80,  label:'绝顶宗师' },
  { min:95,  label:'天下无双' },
  { min:110, label:'武林至尊' },
  { min:120, label:'天下第一' },
];

function getLevelTitle(level){
  let title = LEVEL_TITLES[0].label;
  for(const t of LEVEL_TITLES){
    if(level >= t.min) title = t.label;
  }
  return title;
}

// ══════════════════════════════════════════════
//  10. 升级叙事独白  _getLevelUpNarration(lv)
//      按等级段随机返回一句浸入感描述
// ══════════════════════════════════════════════
function _getLevelUpNarration(lv){
  const pools = [
    { min:1, max:9, lines:[
      '脚步还有些踉跄，但已经走出了第一步。江湖很长，今天只是个开始。',
      '这条路比想象的难走，但你走了。这件事本身，就已经值得继续。',
      '身上的伤还没好透，但力气大了一点。就这样，一点一点地。',
    ]},
    { min:10, max:19, lines:[
      '你开始在别人眼里有了重量——不多，但已经不是无名之辈了。',
      '打架打得多了，才发现真正让人害怕的，是那种不慌的劲儿。你开始有了。',
      '有人记住了你的名字。江湖上，这是一件大事。',
    ]},
    { min:20, max:34, lines:[
      '闯荡这些日子，你赢过，也输过。但比输赢更重要的是：你没有停。',
      '经历的事越来越多，身上的包袱也越来越重。但脚步却反而稳了。',
      '有时候一个人坐在路边，想想这一路走来，竟然还挺远的。',
    ]},
    { min:35, max:49, lines:[
      '见过太多生死的人，说话开始轻了，但做事重了。你变了，变得更像个江湖人。',
      '高手是什么？是见过绝境还能接着走的人。你已经不止一次了。',
      '这片江湖越来越熟悉，却也越来越知道，自己还不够。',
    ]},
    { min:50, max:64, lines:[
      '名声到了，麻烦也到了。但你已经不是那个见到麻烦就绕路的人了。',
      '越来越多的人认出你，有崇拜，有敌意，有打量。你已经学会不太在意了。',
      '你开始明白：真正的高手，赢的不只是武功，是那一份定力。',
    ]},
    { min:65, max:79, lines:[
      '一代高手的名号，不是打出来的，是熬出来的。你知道这其中有多少代价。',
      '坐到这个位置，才能看清江湖的全貌——比想象中更宽广，也更残酷。',
      '你的对手越来越少了。不是你走错了路，是大多数人走不到这里。',
    ]},
    { min:80, max:94, lines:[
      '宗师。这两个字，曾经只是远方的山头。现在你站在上面，看到的是更远的远方。',
      '多年前，有人告诉你"天外有天"。今天，你终于明白那句话的重量。',
      '这一身功夫，练的不是招式，是那口气——一口不服、不停、不退的气。',
    ]},
    { min:95, max:109, lines:[
      '武林里能与你并肩的人，已经屈指可数。但孤独，从来不是你的理由。',
      '天下无双，这四个字，说出来轻，扛起来重。你懂得。',
      '到了这里，过去那些磨难，居然开始变得值得了。你从没料到会有这一天。',
    ]},
    { min:110, max:999, lines:[
      '武林至尊，天下第一。传说里的名字，现在是你。但你知道，江湖没有终点。',
      '你已经是许多人仰望的那座山。但你自己清楚，山顶的风，只是另一片天地的起点。',
      '这一生，走了多少路，经了多少事，流了多少血——值了。',
    ]},
  ];

  const group = pools.find(g => lv >= g.min && lv <= g.max) || pools[0];
  const lines = group.lines;
  return lines[Math.floor(Math.random() * lines.length)];
}


// ══════════════════════════════════════════════
//  11. 全局经验别名（修复历史遗留的静默失败调用）
//      addExp / giveExp 在全代码库中有11处调用，
//      均重定向到 addPlayerExp
// ══════════════════════════════════════════════

/**
 * 通用加经验函数 —— 等同于 addPlayerExp
 * 调用点：npc-logic.js(npc委托/击杀委托/日常任务/随机任务),
 *         npc-requests.js, crafting.js, city-conquest.js
 */
function addExp(amount){
  if(typeof addPlayerExp === 'function'){
    addPlayerExp(amount, '任务奖励');
  }
}

/**
 * 通用加经验函数 —— 等同于 addPlayerExp
 * 调用点：data-story.js(门派任务链/主线), npc-logic.js(npc常规任务),
 *         city-conquest.js(城市争夺奖励)
 */
function giveExp(amount){
  if(typeof addPlayerExp === 'function'){
    addPlayerExp(amount, '任务奖励');
  }
}
