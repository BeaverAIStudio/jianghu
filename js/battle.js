// ══════════════════════════════════════════════════════════════════
//  技能博弈系统辅助函数
// ══════════════════════════════════════════════════════════════════

/**
 * 将学派中文名转换为key
 * @param {string} schoolName - 学派中文名 (如 '剑系', '佛系')
 * @returns {string} 学派key (如 'sword', 'buddha')
 */
function getSchoolKeyByName(schoolName) {
  const map = {
    '剑系': 'sword', '佛系': 'buddha', '道系': 'tao', '力系': 'force',
    '暗系': 'shadow', '毒系': 'poison', '冰系': 'ice', '火系': 'fire',
    '雷系': 'thunder', '风系': 'wind', '圣系': 'holy', '通用': 'common',
    '拳系': 'fist', '奇门系': 'qimen', '琴系': 'music', '命系': 'fate'
  };
  return map[schoolName] || 'common';
}

/**
 * 获取学派中文名
 * @param {string} schoolKey - 学派key
 * @returns {string} 中文名
 */
function getSchoolName(schoolKey) {
  const names = {
    sword: '剑系', buddha: '佛系', tao: '道系', force: '力系',
    shadow: '暗系', poison: '毒系', ice: '冰系', fire: '火系',
    thunder: '雷系', wind: '风系', holy: '圣系', common: '通用',
    fist: '拳系', qimen: '奇门系', music: '琴系', fate: '命系'
  };
  return names[schoolKey] || schoolKey;
}

let _actx = null;
function getACtx(){
  if(!_actx) _actx = new (window.AudioContext||window.webkitAudioContext)();
  if(_actx.state === 'suspended') _actx.resume();
  return _actx;
}
function cleanupBattleAudio(){
  try{
    if(_actx && _actx.state !== 'closed') _actx.close();
  }catch(e){}
  _actx = null;
}
window.cleanupBattleAudio = cleanupBattleAudio;
window.addEventListener('pagehide', cleanupBattleAudio);
window.addEventListener('beforeunload', cleanupBattleAudio);
function playSound(type){
  try{
    const ctx=getACtx();
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    if(type==='hit'){o.frequency.setValueAtTime(320,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(120,ctx.currentTime+.08);g.gain.setValueAtTime(.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12);o.type='sawtooth';}
    else if(type==='heavy'){o.frequency.setValueAtTime(180,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(40,ctx.currentTime+.2);g.gain.setValueAtTime(.5,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.25);o.type='square';}
    else if(type==='skill'){o.frequency.setValueAtTime(600,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(200,ctx.currentTime+.15);g.gain.setValueAtTime(.4,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.2);o.type='sine';}
    else if(type==='shield'){o.frequency.setValueAtTime(800,ctx.currentTime);o.frequency.linearRampToValueAtTime(1200,ctx.currentTime+.1);g.gain.setValueAtTime(.25,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.2);o.type='sine';}
    else if(type==='heal'){o.frequency.setValueAtTime(500,ctx.currentTime);o.frequency.linearRampToValueAtTime(900,ctx.currentTime+.15);g.gain.setValueAtTime(.2,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.25);o.type='sine';}
    else if(type==='ko'){o.frequency.setValueAtTime(300,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(50,ctx.currentTime+.5);g.gain.setValueAtTime(.6,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.6);o.type='sawtooth';}
    // 新增音效类型
    else if(type==='ice'){o.frequency.setValueAtTime(1200,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(400,ctx.currentTime+.18);g.gain.setValueAtTime(.25,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.22);o.type='sine';}
    else if(type==='fire'){o.frequency.setValueAtTime(80,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(600,ctx.currentTime+.05);o.frequency.exponentialRampToValueAtTime(50,ctx.currentTime+.18);g.gain.setValueAtTime(.45,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.25);o.type='sawtooth';}
    else if(type==='thunder'){o.frequency.setValueAtTime(150,ctx.currentTime);o.frequency.setValueAtTime(800,ctx.currentTime+.02);o.frequency.exponentialRampToValueAtTime(60,ctx.currentTime+.2);g.gain.setValueAtTime(.6,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.25);o.type='square';}
    else if(type==='poison'){o.frequency.setValueAtTime(220,ctx.currentTime);o.frequency.linearRampToValueAtTime(180,ctx.currentTime+.3);g.gain.setValueAtTime(.2,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.35);o.type='sawtooth';}
    else if(type==='dark'){o.frequency.setValueAtTime(100,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(30,ctx.currentTime+.3);g.gain.setValueAtTime(.4,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.35);o.type='square';}
    else if(type==='wind'){o.frequency.setValueAtTime(400,ctx.currentTime);o.frequency.linearRampToValueAtTime(700,ctx.currentTime+.1);o.frequency.linearRampToValueAtTime(300,ctx.currentTime+.22);g.gain.setValueAtTime(.22,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.28);o.type='sine';}
    else if(type==='holy'){o.frequency.setValueAtTime(700,ctx.currentTime);o.frequency.linearRampToValueAtTime(1100,ctx.currentTime+.18);g.gain.setValueAtTime(.28,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.28);o.type='sine';}
    else if(type==='rage'){o.frequency.setValueAtTime(250,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(80,ctx.currentTime+.1);o.frequency.exponentialRampToValueAtTime(400,ctx.currentTime+.2);g.gain.setValueAtTime(.55,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.3);o.type='sawtooth';}
    o.start();o.stop(ctx.currentTime+.7);
  }catch(e){}
}


// ════════════════════════════════════════════════
//  战斗状态
// ════════════════════════════════════════════════
function makeState(){return{shield:0,shieldHits:0,shieldAbs:0,poison:0,poisonDmg:0,stun:0,atkBuff:0,defBuff:0,reflect:false,regenPct:0,silence:0,fury:false,furyTurns:0,uncleansable:false,rage:0,block:false,blockNext:false};}
let LH=CHARS[0],RH=CHARS[1];
// 使用 window 对象存储血量，避免被 HTML 元素 ID 覆盖
window.lHp = 0; window.rHp = 0;
window.lMp = 150; window.rMp = 150;   // ← 内力（全局，供 execSkill/tickPoison 访问）
// 同时定义局部变量引用（保持代码兼容性）
let lHp = window.lHp, rHp = window.rHp;
let lMp = window.lMp, rMp = window.rMp;
let lSt=makeState(),rSt=makeState();
window.lSt = lSt; window.rSt = rSt;
let combo=0,cTimer=null;

// ═══════════════════════════════════════════════════════════════
//  大连加成应用函数（由 battle-cards.js 调用）
// ═══════════════════════════════════════════════════════════════

/**
 * 应用大连加成效果到玩家战斗状态
 * @param {string} buffId - buff标识
 * @param {string} name - buff名称（用于日志）
 * @param {number} value - 效果值（如 0.5 表示 50%）
 * @param {number} duration - 持续回合数
 * @param {string} type - buff类型：'atk'|'crit'|'def'|'critMult'
 */
function applyTempBuff(buffId, name, value, duration, type) {
  if (typeof lSt === 'undefined') return;
  
  type = type || 'atk'; // 默认攻击加成
  
  switch(type) {
    case 'atk':
      lSt.atkBuff = (lSt.atkBuff || 0) + value;
      lSt.atkBuffTurns = duration;
      log(`${LH.name} ${name}+${(value*100).toFixed(0)}%！`,'ls');
      break;
    case 'crit':
      lSt._bigBonusCritRate = (lSt._bigBonusCritRate || 0) + value;
      lSt._bigBonusCritRateTurns = duration;
      log(`${LH.name} 暴击率 ${name}+${(value*100).toFixed(0)}%！`,'ls');
      break;
    case 'critMult':
      lSt._bigBonusCritMult = (lSt._bigBonusCritMult || 0) + value;
      lSt._bigBonusCritMultTurns = duration;
      log(`${LH.name} 暴击伤害 ${name}+${(value*100).toFixed(0)}%！`,'ls');
      break;
    case 'def':
      lSt.defBuff = (lSt.defBuff || 0) + value;
      lSt.defBuffTurns = duration;
      log(`${LH.name} 防御 ${name}+${(value*100).toFixed(0)}%！`,'ls');
      break;
  }
  
  console.log(`[applyTempBuff] ${name}: ${value*100}% x ${duration}回合`);
  updateBuffDisplay();
}

// ── Buff 状态显示（玩家状态栏实时刷新）────
function updateBuffDisplay() {
  const el = document.getElementById('lBuffs');
  if (!el || typeof lSt === 'undefined') return;
  const items = [];
  if (lSt.atkBuff && lSt.atkBuffTurns > 0) {
    items.push(`<span class="buff-item atk"><span class="buff-icon">⚔️</span><span class="buff-val">+${Math.round(lSt.atkBuff*100)}%</span><span class="buff-turns">${lSt.atkBuffTurns}t</span></span>`);
  }
  if (lSt.defBuff && lSt.defBuffTurns > 0) {
    items.push(`<span class="buff-item def"><span class="buff-icon">🛡️</span><span class="buff-val">+${Math.round(lSt.defBuff*100)}%</span><span class="buff-turns">${lSt.defBuffTurns}t</span></span>`);
  }
  if (lSt._bigBonusCritRate && lSt._bigBonusCritRateTurns > 0) {
    items.push(`<span class="buff-item crit"><span class="buff-icon">💥</span><span class="buff-val">+${Math.round(lSt._bigBonusCritRate*100)}%</span><span class="buff-turns">${lSt._bigBonusCritRateTurns}t</span></span>`);
  }
  if (lSt._bigBonusCritMult && lSt._bigBonusCritMultTurns > 0) {
    items.push(`<span class="buff-item critMult"><span class="buff-icon">🔥</span><span class="buff-val">+${Math.round(lSt._bigBonusCritMult*100)}%</span><span class="buff-turns">${lSt._bigBonusCritMultTurns}t</span></span>`);
  }
  if (lSt.dodgeBuff && lSt.dodgeBuffTurns > 0) {
    items.push(`<span class="buff-item" style="border-color:rgba(80,255,180,.7);color:#60ffb0;"><span class="buff-icon">💨</span><span class="buff-val">+${Math.round(lSt.dodgeBuff*100)}%</span><span class="buff-turns">${lSt.dodgeBuffTurns}t</span></span>`);
  }
  el.innerHTML = items.length ? items.join('') : '';
}
window.updateBuffDisplay = updateBuffDisplay;

// 暴露到 window
window.applyTempBuff = applyTempBuff;
window.applyDot = function(type, val, turns) {
  if (typeof lSt === 'undefined') return;
  switch(type) {
    case 'freeze':
      lSt.freeze = turns;
      log(`${LH.name} 冻结敌人 ${turns} 回合！`,'lc');
      break;
    case 'poison':
      lSt.poison = (lSt.poison || 0) + val;
      lSt.poisonTurns = turns;
      break;
  }
};
window.applyStun = function(turns) {
  if (typeof lSt === 'undefined') return;
  lSt.stun = (lSt.stun || 0) + turns;
  log(`${RH.name} 陷入冰冻 ${turns} 回合！`,'lc');
};
let over=false;
let dmgL=0,dmgR=0,rounds=0;
let cds={};
let petCds={}; // 宠物技能独立冷却表

// ════════════════════════════════════════════════
//  博弈战斗系统 - 江湖将将胡
//  version: 2
// ════════════════════════════════════════════════
// 气势系统
let momentum = 0; // 0-100
const MOMENTUM_MAX = 100;
const MOMENTUM_BONUS = 20;  // 成功预判获得
const MOMENTUM_PENALTY = 15; // 被预判损失

// 连招链
let actionChain = []; // 记录最近3个行动
const CHAIN_MAX = 3;

// ═══════════════════════════════════════════════════════════════
//  连胜奖励系统
// ═══════════════════════════════════════════════════════════════
const WIN_STREAK = {
  count: 0,                          // 当前连胜数
  best: parseInt(localStorage.getItem('wuxia_win_streak_best') || '0'), // 历史最高
  // 连胜里程碑奖励 { minWin: 需要连胜数, silverMult: 银两倍率, expMult: 经验倍率, bonus: 额外描述 }
  milestones: [
    { minWin: 3,  silverMult: 1.3,  expMult: 1.0, bonus: '',            label: '三连胜' },
    { minWin: 5,  silverMult: 1.5,  expMult: 1.2, bonus: '精力+10',    label: '五连胜' },
    { minWin: 10, silverMult: 2.0,  expMult: 1.5, bonus: '随机材料',   label: '十连胜' },
    { minWin: 15, silverMult: 2.5,  expMult: 1.8, bonus: '功法残页',   label: '十五连胜' },
    { minWin: 20, silverMult: 3.0,  expMult: 2.0, bonus: '稀有物品',   label: '二十连胜' },
    { minWin: 30, silverMult: 4.0,  expMult: 2.5, bonus: '传说碎片',   label: '三十连胜' },
  ],
  /** 获取当前适用的最高里程碑 */
  getActiveMilestone() {
    let active = null;
    for (const m of this.milestones) {
      if (this.count >= m.minWin) active = m;
    }
    return active;
  },
  /** 胜利时调用，返回里程碑信息（如有新里程碑达成） */
  onWin() {
    this.count++;
    const prevBest = this.best;
    if (this.count > this.best) {
      this.best = this.count;
      localStorage.setItem('wuxia_win_streak_best', String(this.best));
    }
    return this.getActiveMilestone();
  },
  /** 战败时调用 */
  onLose() {
    this.count = 0;
  },
  /** 获取连胜信息文本 */
  getInfoText() {
    const ms = this.getActiveMilestone();
    const streakText = this.count > 0 ? `🔥${this.count}连胜` : '';
    const msText = ms ? ` [${ms.label}]` : '';
    return streakText + msText;
  }
};

// 敌方意图
let enemyIntent = null; // 'quick','normal','heavy','block'
let intentAccuracy = 0.7; // 意图提示准确率

// ═══════════════════════════════════════════════════════════════
//  "将将胡"战斗AI系统：每回合随机变化，像麻将摸牌
// ═══════════════════════════════════════════════════════════════
// AI状态
let _aiMood = 'normal';      // 当前心情：normal/agitated/panicked/confident
let _aiMoodTurns = 0;        // 当前心情持续回合
let _aiMistakeChance = 0.05; // 失误概率（基础5%）
let _aiBurstChance = 0.08;   // 爆发概率（基础8%）

// ═══════════════════════════════════════════════════════════════
//  "将将胡"战斗AI扩展：更多心情状态和特殊事件
// ═══════════════════════════════════════════════════════════════
// ── 新增心情状态 ──
const MOOD_EXT = {
  bloodthirsty: { quick: 0.35, normal: 0.25, heavy: 0.35, block: 0.05 }, // 嗜血：疯狂进攻
  cautious:     { quick: 0.15, normal: 0.25, heavy: 0.20, block: 0.40 }, // 谨慎：保守防守
  berserk:      { quick: 0.40, normal: 0.15, heavy: 0.40, block: 0.05 }, // 狂暴：极端进攻
  mocking:      { quick: 0.30, normal: 0.40, heavy: 0.20, block: 0.10 }, // 嘲讽：戏弄对手
  calculating:  { quick: 0.20, normal: 0.30, heavy: 0.30, block: 0.20 }, // 算计：均衡但阴险
};

// ── 心情描述和台词 ──
const MOOD_FLAVOR = {
  normal:    { desc: '气息平稳', color: '#a0a0a0', quotes: ['「来战！"', '「接招！"'] },
  agitated:  { desc: '焦躁不安', color: '#ff8c42', quotes: ['「可恶！"', '「别得意！"', '「看招看招！"'] },
  panicked:  { desc: '惊慌失措', color: '#ff6b6b', quotes: ['「怎么会..."', '「不可能！"', '「该死！"'] },
  confident: { desc: '胸有成竹', color: '#4ecdc4', quotes: ['「不过如此。"', '「结束了。"', '「认输吧！"'] },
  desperate: { desc: '困兽犹斗', color: '#e74c3c', quotes: ['「同归于尽！"', '「死也要拉你垫背！"', '「啊啊啊！"'] },
  bloodthirsty: { desc: '杀意沸腾', color: '#c0392b', quotes: ['「血...我要血！"', '「杀了你！"', '「哈哈哈！"'] },
  cautious:  { desc: '小心翼翼', color: '#95a5a6', quotes: ['「别轻举妄动..."', '「让我看看..."', '「哼，试探一下。"'] },
  berserk:   { desc: '彻底疯狂', color: '#8e44ad', quotes: ['「死吧死吧死吧！"', '「全都毁掉！"', '「吼啊啊啊！"'] },
  mocking:   { desc: '戏谑玩弄', color: '#f39c12', quotes: ['「太慢了~"', '「你就这点本事？"', '「再来再来~"'] },
  calculating: { desc: '暗中算计', color: '#2c3e50', quotes: ['「中计了吧..."', '「一切都在计划中..."', '「你输了。"'] },
};

// ── 特殊战斗事件 ──
const BATTLE_SPECIAL_EVENTS = {
  taunt: {
    id: 'taunt', chance: 0.03, icon: '🗯️', title: '言语挑衅',
    desc: '敌人出言挑衅，试图激怒你',
    effect: () => {
      // 玩家下回合攻击+10%，但防御-10%
      if (typeof lSt !== 'undefined') {
        lSt._tauntBuff = { atk: 0.10, def: -0.10, turns: 1 };
      }
      return { msg: '🗯️ 敌人出言挑衅！你怒火中烧，攻击力+10%，但防御力-10%（1回合）', tone: 'warn' };
    }
  },
  stumble: {
    id: 'stumble', chance: 0.02, icon: '😵', title: '脚下踉跄',
    desc: '敌人突然脚下不稳',
    effect: () => {
      // 敌人下回合无法行动
      if (typeof RH !== 'undefined') {
        RH._stunned = 1;
      }
      return { msg: '😵 敌人脚下踉跄！下回合无法行动！', tone: 'good' };
    }
  },
  weaponGlare: {
    id: 'weaponGlare', chance: 0.02, icon: '✨', title: '兵器反光',
    desc: '阳光照在敌人兵器上，晃了你的眼',
    effect: () => {
      // 玩家下回合命中率-15%
      if (typeof lSt !== 'undefined') {
        lSt._blindPenalty = 0.15;
      }
      return { msg: '✨ 兵器反光晃眼！你下回合命中率-15%', tone: 'bad' };
    }
  },
  secondWind: {
    id: 'secondWind', chance: 0.02, icon: '💨', title: '回光返照',
    desc: '敌人在绝境中爆发出最后的力量',
    condition: () => (typeof rHp !== 'undefined' && typeof RH !== 'undefined' && rHp / (RH.hp || 100) < 0.15),
    effect: () => {
      if (typeof RH !== 'undefined') {
        RH._secondWind = { atk: 0.30, turns: 2 };
      }
      return { msg: '💨 敌人回光返照！攻击力+30%（2回合）', tone: 'warn' };
    }
  },
  terrainAdvantage: {
    id: 'terrainAdvantage', chance: 0.025, icon: '🏔️', title: '地利优势',
    desc: '敌人占据了有利地形',
    effect: () => {
      if (typeof RH !== 'undefined') {
        RH._terrainBonus = { def: 0.20, dodge: 0.10 };
      }
      return { msg: '🏔️ 敌人占据地利！防御+20%，闪避+10%', tone: 'bad' };
    }
  },
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"战斗恶搞事件
  // ═══════════════════════════════════════════════════════════════
  slipOnBanana: {
    id: 'slipOnBanana', chance: 0.015, icon: '🍌', title: '踩到香蕉皮',
    desc: '地上不知道谁扔的香蕉皮...',
    effect: () => {
      if (typeof lSt !== 'undefined') {
        lSt._slipStun = 1;
      }
      return { msg: '🍌 你一脚踩到香蕉皮！滑了一跤，下回合无法行动！（谁扔的？！）', tone: 'bad' };
    }
  },
  suddenItch: {
    id: 'suddenItch', chance: 0.02, icon: '💢', title: '突然痒痒',
    desc: '战斗中突然觉得后背痒痒的',
    effect: () => {
      if (typeof lSt !== 'undefined') {
        lSt._itchPenalty = 0.20; // 命中率下降
      }
      return { msg: '💢 战斗中突然觉得后背痒痒！你忍不住想去挠，命中率-20%（2回合）', tone: 'bad' };
    }
  },
  birdPoop: {
    id: 'birdPoop', chance: 0.008, icon: '💩', title: '天降鸟粪',
    desc: '一只鸟飞过，留下了"礼物"...',
    effect: () => {
      if (typeof RH !== 'undefined') {
        RH._birdPoopDebuff = { def: -0.15, spd: -2 };
      }
      return { msg: '💩 天降鸟粪正中敌人头顶！敌人防御-15%，速度-2（太臭了！）', tone: 'good' };
    }
  },
  pantsFell: {
    id: 'pantsFell', chance: 0.005, icon: '👖', title: '腰带松了',
    desc: '你的腰带突然松了...',
    effect: () => {
      if (typeof lSt !== 'undefined') {
        lSt._pantsFell = { atk: -0.30, def: -0.20 };
      }
      return { msg: '👖 你的腰带突然松了！裤子下滑，你手忙脚乱地提着裤子...攻击-30%，防御-20%（1回合）', tone: 'bad' };
    }
  },
  sneezeAttack: {
    id: 'sneezeAttack', chance: 0.012, icon: '🤧', title: '喷嚏连发',
    desc: '鼻子突然发痒...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.5) {
        // 自己受影响
        if (typeof lSt !== 'undefined') lSt._sneezeSkip = 1;
        return { msg: '🤧 阿嚏！你打了个惊天大喷嚏，这回合没法出手了！', tone: 'bad' };
      } else {
        // 敌人受影响
        if (typeof RH !== 'undefined') RH._sneezeStun = 1;
        return { msg: '🤧 阿嚏！你的喷嚏声如惊雷，把敌人吓得一哆嗦！敌人下回合无法行动！', tone: 'good' };
      }
    }
  },
  suddenPoetry: {
    id: 'suddenPoetry', chance: 0.01, icon: '📜', title: '诗兴大发',
    desc: '战斗中突然灵感涌现...',
    effect: () => {
      const poems = [
        '「十步杀一人，千里不留行！」',
        '「满堂花醉三千客，一剑霜寒十四州！」',
        '「仰天大笑出门去，我辈岂是蓬蒿人！」',
        '「路见不平一声吼，该出手时就出手！」',
      ];
      const poem = poems[Math.floor(Math.random() * poems.length)];
      if (typeof lSt !== 'undefined') {
        lSt._poetryBuff = { atk: 0.15, crit: 0.10 };
      }
      return { msg: `📜 你诗兴大发，吟道：${poem}\n✦ 气势如虹！攻击+15%，暴击率+10%（2回合）`, tone: 'good' };
    }
  },
  muscleCramp: {
    id: 'muscleCramp', chance: 0.015, icon: '🦵', title: '腿抽筋',
    desc: '用力过猛，腿抽筋了...',
    effect: () => {
      if (typeof lSt !== 'undefined') {
        lSt._crampPenalty = { spd: -5, atk: -0.10 };
      }
      return { msg: '🦵 哎呀！腿抽筋了！你疼得龇牙咧嘴...速度-5，攻击-10%（2回合）', tone: 'bad' };
    }
  },
  luckyCoin: {
    id: 'luckyCoin', chance: 0.01, icon: '🪙', title: '捡到铜钱',
    desc: '地上有一枚铜钱在闪闪发光...',
    effect: () => {
      if (typeof lSt !== 'undefined') {
        lSt._luckyCoin = { luk: 10, crit: 0.05 };
      }
      return { msg: '🪙 你弯腰捡起一枚铜钱——是乾隆通宝！运气+10，暴击率+5%（持续到战斗结束）', tone: 'good' };
    }
  },
  enemyFart: {
    id: 'enemyFart', chance: 0.008, icon: '💨', title: '敌人放屁',
    desc: '敌人突然脸色一变...',
    effect: () => {
      if (typeof RH !== 'undefined') {
        RH._fartDebuff = { atk: -0.25 };
      }
      return { msg: '💨 敌人放了一个惊天响屁！臭气熏天，他自己都被熏得攻击-25%（太丢人了！）', tone: 'good' };
    }
  },
  suddenRain: {
    id: 'suddenRain', chance: 0.012, icon: '🌧️', title: '突然下雨',
    desc: '天空不作美，突然下起雨来...',
    effect: () => {
      if (typeof lSt !== 'undefined' && typeof RH !== 'undefined') {
        lSt._rainPenalty = { hit: -0.10 };
        RH._rainPenalty = { hit: -0.10 };
      }
      return { msg: '🌧️ 突然下起大雨！地面湿滑，双方命中率都-10%（这还怎么打？）', tone: 'neutral' };
    }
  },
};

// 心情影响权重表（将将胡版）
// 牌型含义：快攻（压力）/普攻（稳态）/重击（威胁）/格挡（韧性）
const MOOD_WEIGHTS = {
  normal:    { quick: 0.25, normal: 0.35, heavy: 0.25, block: 0.15 },
  agitated:  { quick: 0.47, normal: 0.28, heavy: 0.18, block: 0.07 }, // 焦躁：连环压制
  panicked:  { quick: 0.18, normal: 0.22, heavy: 0.12, block: 0.48 }, // 恐慌：死守待变
  confident: { quick: 0.16, normal: 0.26, heavy: 0.45, block: 0.13 }, // 自信：势不可挡
  desperate: { quick: 0.35, normal: 0.15, heavy: 0.40, block: 0.10 }, // 绝望：玉石俱焚
  bloodthirsty: { quick: 0.38, normal: 0.22, heavy: 0.38, block: 0.02 }, // 嗜血：双倍威胁
  cautious:  { quick: 0.12, normal: 0.25, heavy: 0.15, block: 0.48 }, // 谨慎：铁桶阵
  berserk:   { quick: 0.42, normal: 0.13, heavy: 0.43, block: 0.02 }, // 狂暴：不死不休
  mocking:   { quick: 0.28, normal: 0.42, heavy: 0.20, block: 0.10 }, // 嘲讽：连环普攻
  calculating: { quick: 0.18, normal: 0.28, heavy: 0.32, block: 0.22 }, // 算计：均衡而稳
};

// ── 每回合更新AI心情（像麻将换张）──
function _updateAiMood(){
  // 根据血量变化决定心情
  const hpPct = rHp / (RH.hp || 100);
  const playerHpPct = lHp / (LH.hp || 100);
  
  // 随机波动：即使血量相同，心情也可能不同（命运无常）
  const roll = Math.random();
  
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"心情系统扩展：更多可能性
  // ═══════════════════════════════════════════════════════════════
  if (hpPct < 0.15) {
    // 濒死：可能绝望、恐慌，小概率狂暴
    if (roll < 0.4) _aiMood = 'desperate';
    else if (roll < 0.7) _aiMood = 'panicked';
    else if (roll < 0.85) _aiMood = 'berserk'; // 15%彻底疯狂
    else _aiMood = 'bloodthirsty'; // 15%嗜血
  } else if (hpPct < 0.35) {
    // 重伤：焦躁、恐慌、谨慎、算计
    if (roll < 0.3) _aiMood = 'agitated';
    else if (roll < 0.55) _aiMood = 'panicked';
    else if (roll < 0.75) _aiMood = 'cautious';
    else _aiMood = 'calculating';
  } else if (hpPct < 0.5) {
    // 劣势：焦躁、谨慎、算计
    if (roll < 0.35) _aiMood = 'agitated';
    else if (roll < 0.65) _aiMood = 'cautious';
    else _aiMood = 'calculating';
  } else if (playerHpPct < 0.2) {
    // 玩家濒死：自信、嘲讽、嗜血
    if (roll < 0.5) _aiMood = 'confident';
    else if (roll < 0.8) _aiMood = 'mocking';
    else _aiMood = 'bloodthirsty';
  } else if (playerHpPct < 0.4) {
    // 玩家劣势：自信、嘲讽
    if (roll < 0.6) _aiMood = 'confident';
    else _aiMood = 'mocking';
  } else {
    // 均势：随机心情，更多可能性
    if (roll < 0.08) _aiMood = 'agitated';      // 8%莫名焦躁
    else if (roll < 0.14) _aiMood = 'confident'; // 6%莫名自信
    else if (roll < 0.18) _aiMood = 'cautious';  // 4%莫名谨慎
    else if (roll < 0.21) _aiMood = 'mocking';   // 3%莫名嘲讽
    else if (roll < 0.23) _aiMood = 'bloodthirsty'; // 2%莫名嗜血
    else _aiMood = 'normal';
  }
  
  _aiMoodTurns = 1 + Math.floor(Math.random() * 3); // 持续1-3回合（更不稳定）
  
  // 显示心情变化提示（仅当心情变化时）
  const flavor = MOOD_FLAVOR[_aiMood];
  if (flavor && typeof log === 'function') {
    const quote = flavor.quotes[Math.floor(Math.random() * flavor.quotes.length)];
    log(`${flavor.desc} — ${quote}`, 'lc', flavor.color);
  }
}

// ── 检查特殊战斗事件 ──
function _checkBattleSpecialEvent(){
  for (const key in BATTLE_SPECIAL_EVENTS) {
    const evt = BATTLE_SPECIAL_EVENTS[key];
    // 检查条件
    if (evt.condition && !evt.condition()) continue;
    // 检查概率
    if (Math.random() < evt.chance) {
      const result = evt.effect();
      if (typeof log === 'function') {
        log(`${evt.icon} ${result.msg}`, result.tone === 'good' ? 'ls' : result.tone === 'warn' ? 'lc' : 'lp');
      }
      return evt;
    }
  }
  return null;
}

// ── 检查AI是否"失误"或"爆发"──
function _checkAiMistakeOrBurst(){
  const roll = Math.random();
  if (roll < _aiMistakeChance) return 'mistake';  // 失误：选最差的行动
  if (roll < _aiMistakeChance + _aiBurstChance) return 'burst'; // 爆发：伤害+50%
  return 'normal';
}

// 行动克制关系: [行动] -> 被克制的行动
const COUNTER_RELATION = {
  quick:  'heavy',  // 快攻打断重击
  normal: 'block',  // 普攻破防格挡
  heavy:  'normal', // 重击压制普攻
  block:  'quick'   // 格挡反击快攻
};

// ═══════════════════════════════════════════════════════════════════════════
//  ✦ 麻将牌型克制关系（战法手牌系统）
//  连环(×) > 凝(-) > 势(◎) > 连环(×) — 三轮循环
// ═══════════════════════════════════════════════════════════════════════════

// 牌型类型映射（与 battle-cards.js 中 comboType 一致）
const CARD_COUNTER_TYPES = {
  LIANHUAN: 'lianhuan',  // 连环 (×) — 攻击型
  NING: 'ning',          // 凝 (-)— 控制型
  SHI: 'shi',            // 势 (◎) — 爆发型
  DUIZI: 'duizi',        // 对子 — 无克制关系
  DANPAI: 'danpai',      // 单招 — 无克制关系
};

// 麻将牌型克制关系: { 牌型 } -> 被克制的牌型
const CARD_COMBO_COUNTER = {
  lianhuan: 'ning',  // 连环克制凝（攻击克制控制）
  ning: 'shi',       // 凝克制势（控制克制爆发）
  shi: 'lianhuan',   // 势克制连环（爆发克制攻击）
};

// 牌型名称映射（用于显示）
const CARD_COMBO_NAMES = {
  lianhuan: '连环',
  ning: '凝',
  shi: '势',
  duizi: '对子',
  danpai: '单招',
};

// 牌型图标映射
const CARD_COMBO_ICONS = {
  lianhuan: '💥',
  ning: '✦',
  shi: '⚡',
  duizi: '👫',
  danpai: '⚔',
};

/**
 * 判断麻将牌型克制关系
 * @param {string} myCombo - 我的牌型 ('lianhuan'|'ning'|'shi'|null)
 * @param {string} enemyCombo - 敌方牌型
 * @returns {string} 'win' | 'lose' | 'tie'
 */
function checkCardComboCounter(myCombo, enemyCombo) {
  // 无牌型或相同牌型 → 平手
  if (!myCombo || !enemyCombo || myCombo === enemyCombo) return 'tie';
  // 对子/单招无克制关系 → 平手
  if (myCombo === 'duizi' || myCombo === 'danpai' || enemyCombo === 'duizi' || enemyCombo === 'danpai') return 'tie';

  // 检查克制关系
  if (CARD_COMBO_COUNTER[myCombo] === enemyCombo) return 'win';
  if (CARD_COMBO_COUNTER[enemyCombo] === myCombo) return 'lose';
  return 'tie';
}

/**
 * 获取牌型克制关系的战斗加成
 * @param {string} result - 'win' | 'lose' | 'tie'
 * @returns {Object} { atkMult: number, defMult: number, desc: string }
 */
function getCardCounterBonus(result) {
  if (result === 'win') {
    // 克制成功：伤害+30%，暴击率+15%
    return {
      atkMult: 1.3,
      defMult: 1.0,
      critRateBonus: 0.15,
      critMultBonus: 0.25,
      desc: '牌型克制！伤害+30%，暴击率+15%'
    };
  } else if (result === 'lose') {
    // 被克制：伤害-20%，防御-15%
    return {
      atkMult: 0.8,
      defMult: 0.85,
      critRateBonus: -0.1,
      critMultBonus: 0,
      desc: '被牌型克制！伤害-20%，防御-15%'
    };
  }
  // 平手：无加成
  return {
    atkMult: 1.0,
    defMult: 1.0,
    critRateBonus: 0,
    critMultBonus: 0,
    desc: ''
  };
}

/**
 * 显示牌型克制提示
 * @param {string} result - 'win' | 'lose' | 'tie'
 * @param {string} myCombo - 我的牌型
 * @param {string} enemyCombo - 敌方牌型
 */
function showCardCounterHint(result, myCombo, enemyCombo) {
  if (!result || result === 'tie') return;

  const myName = CARD_COMBO_NAMES[myCombo] || '单招';
  const enemyName = CARD_COMBO_NAMES[enemyCombo] || '单招';
  const myIcon = CARD_COMBO_ICONS[myCombo] || '⚔';
  const enemyIcon = CARD_COMBO_ICONS[enemyCombo] || '⚔';

  const hintText = result === 'win'
    ? `${myIcon}克制${enemyIcon}！${myName}压制${enemyName}！`
    : `${myIcon}被${enemyIcon}克制！${enemyName}压制${myName}！`;

  if (typeof showToast === 'function') {
    showToast(hintText);
  }
  if (typeof playAudio === 'function') {
    playAudio(result === 'win' ? 'counter_win' : 'counter_lose');
  }
}

// 行动属性
const ACTION_STATS = {
  quick:  { dmgMult: 0.6, hitChance: 1.0, canDodge: false, name: '快攻', icon: '⚡' },
  normal: { dmgMult: 1.0, hitChance: 1.0, canDodge: true,  name: '普攻', icon: '⚔' },
  heavy:  { dmgMult: 1.8, hitChance: 1.0, canDodge: true,  name: '重击', icon: '💥' },
  block:  { dmgMult: 0,   hitChance: 0,   canDodge: false, name: '格挡', icon: '🛡' }
};

// 连招奖励（4操作 × 3位 = 64种组合）
const COMBO_BONUSES = {
  // ── 纯攻击类 ──
  'quick-quick-quick':   { name: '疾风三连', bonusDmg: 0.5, mpRestore: 0 },
  'normal-normal-heavy': { name: '蓄力终结', bonusDmg: 0.5, mpRestore: 0 },
  'heavy-heavy-heavy':   { name: '狂暴三连', bonusDmg: 0.8, mpRestore: 0, selfDmg: 0.05 },
  'normal-normal-normal': { name: '连绵掌法', bonusDmg: 0.3, mpRestore: 5 },
  // ── 防守反击类 ──
  'heavy-block-normal':  { name: '以静制动', bonusDmg: 1.0, mpRestore: 10 },
  'block-quick-normal':  { name: '反击连招', bonusDmg: 0.3, mpRestore: 5 },
  'block-block-quick':   { name: '铁壁反击', bonusDmg: 0.6, mpRestore: 8 },
  'block-heavy-quick':   { name: '龟息突袭', bonusDmg: 0.7, mpRestore: 5 },
  'block-normal-heavy':  { name: '以退为进', bonusDmg: 0.5, mpRestore: 8 },
  // ── 灵活走位类 ──
  'quick-normal-quick':  { name: '疾风步',   bonusDmg: 0.3, mpRestore: 5 },
  'quick-heavy-quick':   { name: '雷霆万钧', bonusDmg: 0.6, mpRestore: 0 },
  'quick-block-quick':   { name: '云龙三折', bonusDmg: 0.4, mpRestore: 10 },
  'normal-quick-normal': { name: '虚实结合', bonusDmg: 0.35, mpRestore: 5 },
  'normal-quick-heavy':  { name: '暗藏杀机', bonusDmg: 0.6, mpRestore: 0 },
  'normal-block-quick':  { name: '诱敌深入', bonusDmg: 0.5, mpRestore: 8 },
  // ── 节奏控制类 ──
  'heavy-normal-quick':  { name: '收放自如', bonusDmg: 0.4, mpRestore: 8 },
  'heavy-quick-normal':  { name: '力破千军', bonusDmg: 0.5, mpRestore: 0 },
  'heavy-normal-heavy':  { name: '刚柔并济', bonusDmg: 0.55, mpRestore: 5 },
  'heavy-quick-heavy':   { name: '霸王举鼎', bonusDmg: 0.7, mpRestore: 0, selfDmg: 0.03 },
  // ── 防御大师类 ──
  'block-block-block':   { name: '金钟罩',   bonusDmg: 0.2, mpRestore: 15, healPct: 0.05 },
  'block-quick-block':   { name: '借力打力', bonusDmg: 0.4, mpRestore: 10 },
  'block-normal-block':  { name: '太极推手', bonusDmg: 0.3, mpRestore: 12 },
};

// 意图提示文本（将将胡卡牌版）
const INTENT_HINTS = {
  quick:  { text: '出牌凌厉，似有连环在后', icon: '⚡' },
  normal: { text: '手牌平稳，气势暗中攀升', icon: '⚔' },
  heavy:  { text: '手握重牌，寒气隐隐逼人', icon: '💥' },
  block:  { text: '手中成对，静候破绽之机', icon: '🛡' }
};
// 内力条刷新（模块级，供 resetFight 内的内嵌函数调用）
function updateMpBars(){
  const lMax = (LH&&LH._maxMpFull)||150, rMax = (RH&&RH._maxMpFull)||150;
  ['l','r'].forEach(side=>{
    const bar = document.getElementById(side+'MpBar');
    const num = document.getElementById(side+'MpNum');
    if(!bar) return;
    const cur = side==='l' ? lMp : rMp;
    const max = side==='l' ? lMax : rMax;
    bar.style.width = Math.max(0, cur/max*100)+'%';
    if(num) num.textContent = `${Math.round(cur)}/${max}`;
  });
}

// ════════════════════════════════════════════════
//  博弈系统函数
// ════════════════════════════════════════════════
// 更新气势显示
function updateMomentum(){
  const fill = document.getElementById('momentumFill');
  const num = document.getElementById('momentumNum');
  if(!fill || !num) return;
  fill.style.width = momentum + '%';
  num.textContent = `${momentum}/${MOMENTUM_MAX}`;
  const killBtn = document.getElementById('killMoveBtn');
  if(momentum >= MOMENTUM_MAX){
    fill.classList.add('full');
    if(killBtn && killBtn.style.display === 'none'){
      console.log('[updateMomentum] 气势满！显示必杀按钮');
      log('🔥 气势如虹！将将胡状态激活！可使用【必杀】！','ls');
    }
    if(killBtn) killBtn.style.display = 'flex';
  } else {
    fill.classList.remove('full');
    if(killBtn) killBtn.style.display = 'none';
  }
}

// ════════════════════════════════════════════
// 必杀技：学派专属名称与文案
// ════════════════════════════════════════════
const KILL_MOVE_DATA = {
  sword:   { name:'剑气纵横', desc:'一剑斩出，剑气如长虹贯日！', color:'#60d4ff', sfx:'skill' },
  buddha:  { name:'金刚怒目', desc:'佛光大放，万邪辟易！', color:'#ffd060', sfx:'holy' },
  tao:     { name:'太极归一', desc:'阴阳互化，以柔克刚，天地为证！', color:'#80ffaa', sfx:'wind' },
  force:   { name:'排山倒海', desc:'内力爆发，山河为之震动！', color:'#ff8040', sfx:'heavy' },
  shadow:  { name:'鬼影诛心', desc:'身形消散于黑暗，致命一刺无从防御！', color:'#c040ff', sfx:'dark' },
  poison:  { name:'万毒归宗', desc:'毒雾弥漫，草木皆枯！', color:'#80ff40', sfx:'poison' },
  ice:     { name:'冰封千里', desc:'寒气激发，天地成冰，万物静止！', color:'#80d8ff', sfx:'ice' },
  fire:    { name:'烈焰焚天', desc:'真火迸发，烈焰滔天，灰飞烟灭！', color:'#ff5020', sfx:'fire' },
  thunder: { name:'九天雷降', desc:'引来九天雷霆，轰然落于一点！', color:'#fff060', sfx:'thunder' },
  wind:    { name:'逍遥八荒', desc:'身随风动，无形无迹，四面皆招！', color:'#a0e8ff', sfx:'wind' },
  holy:    { name:'圣光净化', desc:'圣光大盛，万邪遁形，天道昭昭！', color:'#ffffff', sfx:'holy' },
  fist:    { name:'虎啸山河', desc:'双拳合一，力撼山岳！', color:'#ff8080', sfx:'heavy' },
  qimen:   { name:'奇门遁甲', desc:'布局已成，天地同力，一招破万法！', color:'#ffc080', sfx:'skill' },
  music:   { name:'弦动九霄', desc:'琴声激越，音波化为杀机！', color:'#ff80c0', sfx:'holy' },
  fate:    { name:'命运终结', desc:'天命如此，一击定生死！', color:'#c0a0ff', sfx:'skill' },
  common:  { name:'将将胡·绝杀', desc:'气势积满，全力一击！', color:'#ffd060', sfx:'rage' },
};

function getKillMoveData(){
  // 尝试从玩家装备的功法中获取学派
  let school = 'common';
  try{
    if(typeof edS !== 'undefined' && edS.manuals && edS.manuals.length > 0){
      const mid = edS.manuals[0];
      if(typeof MANUAL_DB !== 'undefined' && MANUAL_DB[mid]){
        const schName = MANUAL_DB[mid].school || '';
        const k = getSchoolKeyByName(schName);
        if(k && KILL_MOVE_DATA[k]) school = k;
      }
    }
    // 备选：从技能学派推断
    if(school === 'common' && LH && LH.skills && LH.skills.length > 0){
      const sk = LH.skills[0];
      if(sk && sk.school){
        const k = getSchoolKeyByName(sk.school);
        if(k && KILL_MOVE_DATA[k]) school = k;
      }
    }
  }catch(e){}
  return KILL_MOVE_DATA[school] || KILL_MOVE_DATA.common;
}

// 必杀技全屏特效
function showKillMoveEffect(kmData){
  // 全屏特效层
  let overlay = document.getElementById('killMoveOverlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.id = 'killMoveOverlay';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      z-index:350;pointer-events:none;
      display:flex;align-items:center;justify-content:center;
      flex-direction:column;
    `;
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div id="killMoveBg" style="
      position:absolute;top:0;left:0;width:100%;height:100%;
      background:radial-gradient(ellipse at center, ${kmData.color}33 0%, ${kmData.color}11 40%, transparent 70%);
      animation:killBgPulse .6s ease-out forwards;
    "></div>
    <div style="position:relative;text-align:center;z-index:2;">
      <div style="
        font-size:36px;font-weight:900;letter-spacing:8px;
        color:${kmData.color};
        text-shadow:0 0 20px ${kmData.color},0 0 40px ${kmData.color}80,0 0 80px ${kmData.color}40;
        animation:killNameAppear .4s cubic-bezier(0.2,0,0,1) forwards;
        opacity:0;
      ">${kmData.name}</div>
      <div style="
        margin-top:10px;font-size:13px;color:rgba(255,255,220,.85);letter-spacing:3px;
        animation:killDescAppear .4s .25s ease-out forwards;opacity:0;
      ">${kmData.desc}</div>
    </div>
    <div id="killMoveParticles" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
  `;
  // 粒子动画
  const pEl = document.getElementById('killMoveParticles');
  if(pEl){
    for(let i=0;i<30;i++){
      const p = document.createElement('div');
      const angle = Math.random()*360;
      const dist = 80+Math.random()*160;
      const size = 4+Math.random()*8;
      p.style.cssText = `
        position:absolute;border-radius:50%;
        width:${size}px;height:${size}px;
        background:${kmData.color};
        box-shadow:0 0 ${size*2}px ${kmData.color};
        left:50%;top:50%;
        transform:translate(-50%,-50%);
        animation:killParticle${i%3} .8s ease-out forwards;
        --tx:${Math.cos(angle*Math.PI/180)*dist}px;
        --ty:${Math.sin(angle*Math.PI/180)*dist}px;
      `;
      pEl.appendChild(p);
    }
  }
  // 屏幕震动
  screenShake(true);
  // 0.9秒后移除
  setTimeout(()=>{ overlay.innerHTML=''; }, 900);
}

// 必杀技执行
function doKillMove(){
  console.log('[doKillMove] 被调用！momentum:', momentum, 'over:', over, 'lSt.stun:', lSt?.stun);
  if(over) { console.log('[doKillMove] 战斗已结束，直接返回'); return; }
  if(momentum < MOMENTUM_MAX){
    console.log('[doKillMove] 气势不足:', momentum, '/', MOMENTUM_MAX);
    showToast && showToast('气势不足，无法使出必杀！');
    return;
  }
  if(lSt.stun>0){ log(`${LH.name}处于眩晕状态，无法出手！`,'lm'); return; }
  console.log('[doKillMove] 开始执行必杀！');

  const kmData = getKillMoveData();
  // 消耗气势
  momentum = 0;
  updateMomentum();

  // 全屏特效
  showKillMoveEffect(kmData);
  playSound(kmData.sfx || 'rage');

  // 延迟一点再算伤害，让特效先出
  setTimeout(()=>{
    const lEl = document.getElementById('fL');
    const rEl = document.getElementById('fR');
    // 必杀伤害：2.5x，强制暴击
    const totalAtk = LH._stats ? LH._stats.totalAtk : (LH.atk+(LH._wepAtk||0));
    const {dmg, isCrit} = calcDmg(totalAtk, lSt, rSt, {mult:2.5, forceCrit:true});
    // 直接扣血，applyDamage 不存在
    rHp -= dmg; window.rHp = rHp;
    const finalDmg = dmg;
    floatDmg(rEl, `✦ 必杀 ${finalDmg}`, 'dc');
    flash('red');
    const rFrm = RH.hit||[RH.stand];
    animFighter(rEl, rFrm, RH.stand, RH.color, 'hit');
    log(`✦ ${LH.name} 【${kmData.name}】！${kmData.desc} → ${RH.name} 受到 ${finalDmg} 必杀伤害！`, 'ls');
    // 连击
    addCombo();
    updateBars(); renderStatus();
    raidTick();
    checkWin();
  }, 300);
}

// 改变气势
function changeMomentum(delta){
  momentum = Math.max(0, Math.min(MOMENTUM_MAX, momentum + delta));
  updateMomentum();
}

// ═══════════════════════════════════════════════════════════════
// 敌人出牌揭示动画（对局感）
// ═══════════════════════════════════════════════════════════════
function showEnemyCardReveal(skill) {
  const rEl = document.getElementById('fR');
  if (!rEl || !skill) return;
  const schoolColor = {
    '剑系':'#c0a0ff','佛系':'#ffd700','道系':'#80e0c0',
    '力系':'#ff6040','暗系':'#a040c0','毒系':'#40c040',
    '冰系':'#a0e0ff','火系':'#ff8030','雷系':'#ffe040',
    '风系':'#90d090','圣系':'#ffd090','琴系':'#e090ff',
    '拳系':'#d09050','通用':'#a0a0a0',
  }[skill.school] || '#a0a0a0';

  // 移除旧的
  const old = rEl.querySelector('.enemy-card-reveal');
  if (old) old.remove();

  const div = document.createElement('div');
  div.className = 'enemy-card-reveal';
  div.innerHTML = `
    <div class="ecr-icon" style="color:${schoolColor}">${skill.icon || '⚔'}</div>
    <div class="ecr-name">${skill.name}</div>
    <div class="ecr-school">${skill.school || '通用'}</div>
  `;
  rEl.style.position = 'relative';
  rEl.appendChild(div);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => div.classList.add('show'));
  });
  setTimeout(() => div.remove(), 900);
}

// 生成敌方意图（"将将胡"版：每回合心情变化 + 失误/爆发）
function generateEnemyIntent(){
  const actions = ['quick','normal','heavy','block'];
  
  // ── 1. 更新心情（每回合有概率变化）──
  _aiMoodTurns--;
  if (_aiMoodTurns <= 0 || Math.random() < 0.2) { // 20%概率提前换心情
    _updateAiMood();
  }
  
  // ── 2. 获取心情权重 ──
  const moodWeights = MOOD_WEIGHTS[_aiMood] || MOOD_WEIGHTS.normal;
  let weights = [moodWeights.quick, moodWeights.normal, moodWeights.heavy, moodWeights.block];
  
  // ── 3. 叠加基础风格偏好（弱化影响）──
  const style = RH._aiStyle || 'balanced';
  let styleBias = [0, 0, 0, 0];
  switch(style){
    case 'aggressive': styleBias = [0.08, 0.02, 0.02, -0.12]; break;
    case 'defensive':  styleBias = [-0.05, 0, 0, 0.05]; break;
    case 'berserker':  styleBias = [-0.05, 0, 0.10, -0.05]; break;
    case 'balanced':   styleBias = [0, 0, 0, 0]; break;
    // ── 新增差异化风格 ──
    // 剑客型：多快攻，偶尔重击，几乎不防守
    case 'swordmaster': styleBias = [0.15, 0.05, 0.05, -0.25]; break;
    // 铁桶型：极度保守，频繁格挡，偶尔出击
    case 'ironwall':   styleBias = [-0.15, -0.05, -0.10, 0.30]; break;
    // 疯狗型：近乎随机，攻多守少，不可预测
    case 'wildcard':   styleBias = [0.05, -0.10, 0.15, -0.10]; break;
    // 毒师型：喜欢普攻（配合毒技能），不喜欢重击
    case 'poisoner':   styleBias = [-0.05, 0.15, -0.10, 0]; break;
    // 武当型：均衡且多格挡，擅长以守代攻
    case 'taichi':     styleBias = [-0.05, 0.05, -0.10, 0.10]; break;
    // 少林型：喜欢重击，防御厚实
    case 'shaolin':    styleBias = [-0.05, 0, 0.12, -0.07]; break;
  }
  
  // ── 3b. 血量动态调整：血量低时更激进/绝望 ──
  const rMaxHp = RH._maxHpFull || RH.maxHp || 100;
  const rHpPct = typeof rHp !== 'undefined' ? rHp / rMaxHp : 1.0;
  if (rHpPct < 0.3) {
    // 濒死：更激进，不怕死
    weights[0] += 0.08; // quick
    weights[2] += 0.12; // heavy
    weights[3] -= 0.15; // block
  } else if (rHpPct > 0.8) {
    // 血量充足：适当保守
    weights[3] += 0.05; // block
  }
  
  // 合并权重
  weights = weights.map((w, i) => Math.max(0.05, w + styleBias[i]));
  
  // ── 4. 检查失误/爆发 ──
  const special = _checkAiMistakeOrBurst();
  RH._aiSpecial = special; // 记录本回合特殊状态
  
  if (special === 'mistake') {
    // 失误：选择对玩家最有利的行动（被克制）
    const playerLast = actionChain[actionChain.length - 1] || 'normal';
    const mistakeMap = { quick: 'heavy', normal: 'quick', heavy: 'block', block: 'normal' };
    enemyIntent = mistakeMap[playerLast] || 'normal';
    log(`😰 ${RH.name} 似乎有些慌乱...`, 'lm');
  } else {
    // 正常加权随机
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    let sum = 0;
    for(let i = 0; i < actions.length; i++){
      sum += weights[i];
      if(r <= sum){
        enemyIntent = actions[i];
        break;
      }
    }
  }
  
  // ── 5. 显示意图（有概率不准确；虚晃时完全随机）──
  // 虚晃（feint）状态下意图完全不可信
  if (window._bossFeintActive) {
    const allActions = ['quick','normal','heavy','block'];
    const fake = allActions[Math.floor(Math.random()*allActions.length)];
    const hint = INTENT_HINTS[fake];
    const textEl = document.getElementById('intentText');
    if (textEl) textEl.textContent = `🎭 ${hint.icon} ???`;
    return;
  }
  displayIntent();
}

// 显示意图提示
function displayIntent(){
  const textEl = document.getElementById('intentText');
  if(!textEl) return;
  // 70%概率显示正确意图，30%显示随机其他
  let displayAction;
  if(Math.random() < intentAccuracy){
    displayAction = enemyIntent;
  } else {
    const others = ['quick','normal','heavy','block'].filter(a=>a!==enemyIntent);
    displayAction = others[Math.floor(Math.random()*others.length)];
  }
  const hint = INTENT_HINTS[displayAction];
  textEl.textContent = `${hint.icon} ${hint.text}`;
}

// 添加行动到连招链（纯逻辑记录，UI已移除）
function addToChain(action){
  actionChain.push(action);
  if(actionChain.length > CHAIN_MAX){
    actionChain.shift();
  }
  // 检查连招奖励
  checkComboBonus();
}

// 检查连招奖励
function checkComboBonus(){
  if(actionChain.length < CHAIN_MAX) return null;
  const chainKey = actionChain.join('-');
  const bonus = COMBO_BONUSES[chainKey];
  if(bonus){
    log(`✨ 连招「${bonus.name}」触发！伤害+${Math.round(bonus.bonusDmg*100)}%`,'ls');
    if(bonus.mpRestore > 0){
      lMp = Math.min(LH._maxMpFull||150, lMp + bonus.mpRestore);
      window.lMp = lMp; // 同步到 window 对象
      log(`💙 内力恢复 +${bonus.mpRestore}`,'lm');
      updateMpBars();
    }
    // 自损效果（高伤害连招的代价）
    if(bonus.selfDmg && bonus.selfDmg > 0 && LH._maxHpFull){
      const selfDmgVal = Math.floor((LH._maxHpFull || 200) * bonus.selfDmg);
      lHp = Math.max(1, lHp - selfDmgVal);
      log(`⚠️ 招式凶猛，自身受损 -${selfDmgVal}气血`, 'debuff');
      updateBars();
    }
    // 治疗效果（防御类连招）
    if(bonus.healPct && bonus.healPct > 0 && LH._maxHpFull){
      const healVal = Math.floor((LH._maxHpFull || 200) * bonus.healPct);
      lHp = Math.min(LH._maxHpFull || 200, lHp + healVal);
      log(`💚 气血恢复 +${healVal}`, 'heal');
      updateBars();
    }
    // 高亮连招链
    const links = document.querySelectorAll('.combo-link');
    links.forEach(l=>l.classList.add('bonus'));
    setTimeout(()=>links.forEach(l=>l.classList.remove('bonus')),600);
  }
  return bonus;
}

// ═══════════════════════════════════════════════════════════════
//  ✦ 双层积累池UI更新
// ═══════════════════════════════════════════════════════════════

/**
 * 更新双层积累池UI显示
 */
function updateChainPools() {
  console.log('[updateChainPools] 被调用');
  // 获取CardSystem实例
  const cardSys = window.cardSystem;
  if (!cardSys) {
    console.log('[updateChainPools] cardSystem 不存在');
    return;
  }

  const smallDotsEl = document.getElementById('smallPoolDots');
  const bigDotsEl = document.getElementById('bigPoolDots');
  if (!smallDotsEl || !bigDotsEl) {
    console.log('[updateChainPools] UI元素不存在');
    return;
  }

  // 小积累池：小Pool中的牌数（最多3格），根据学派显示不同颜色
  const smallPool = cardSys.smallPool || [];
  console.log(`[updateChainPools] smallPool.length=${smallPool.length}`);
  const smallDots = smallDotsEl.querySelectorAll('.chain-dot');

  // 学派颜色映射（与 battle-cards.js 中的 SCHOOL_COLORS 一致）
  const schoolColors = {
    '剑系': { fill: 'linear-gradient(135deg, #c0c0e0, #9090b0)', border: '#d0d0ff', glow: 'rgba(192,192,224,.6)', icon: '⚔' },
    '佛系': { fill: 'linear-gradient(135deg, #ffd700, #ffb000)', border: '#ffe040', glow: 'rgba(255,215,0,.6)', icon: '🙏' },
    '道系': { fill: 'linear-gradient(135deg, #80d0ff, #50a0e0)', border: '#a0e0ff', glow: 'rgba(128,208,255,.6)', icon: '☯' },
    '力系': { fill: 'linear-gradient(135deg, #ff6040, #e04020)', border: '#ff7060', glow: 'rgba(255,96,64,.6)', icon: '💪' },
    '暗系': { fill: 'linear-gradient(135deg, #a040c0, #8020a0)', border: '#b060d0', glow: 'rgba(160,64,192,.6)', icon: '🌑' },
    '毒系': { fill: 'linear-gradient(135deg, #40c040, #208020)', border: '#60d060', glow: 'rgba(64,192,64,.6)', icon: '☠' },
    '冰系': { fill: 'linear-gradient(135deg, #a0e0ff, #70c0e0)', border: '#b0f0ff', glow: 'rgba(160,224,255,.6)', icon: '❄' },
    '火系': { fill: 'linear-gradient(135deg, #ff8030, #e06010)', border: '#ff9040', glow: 'rgba(255,128,48,.6)', icon: '🔥' },
    '雷系': { fill: 'linear-gradient(135deg, #ffe040, #e0c020)', border: '#fff060', glow: 'rgba(255,224,64,.6)', icon: '⚡' },
    '风系': { fill: 'linear-gradient(135deg, #90d090, #60a060)', border: '#a0e0a0', glow: 'rgba(144,208,144,.6)', icon: '💨' },
    '拳系': { fill: 'linear-gradient(135deg, #d09050, #b07030)', border: '#e0a060', glow: 'rgba(208,144,80,.6)', icon: '👊' },
    '散人': { fill: 'linear-gradient(135deg, #909090, #606060)', border: '#a0a0a0', glow: 'rgba(144,144,144,.6)', icon: '⚔' },
  };

  smallDots.forEach((dot, i) => {
    const isFilled = i < smallPool.length;
    dot.classList.toggle('filled', isFilled);

    if (isFilled) {
      // 根据当前学派的颜色设置样式
      const school = smallPool[i];
      const schoolStyle = schoolColors[school] || schoolColors['散人'];

      dot.style.background = schoolStyle.fill;
      dot.style.borderColor = schoolStyle.border;
      dot.style.boxShadow = `0 0 10px ${schoolStyle.glow}`;
      dot.title = `${schoolStyle.icon} ${school}学派`;
    } else {
      // 重置为默认样式
      dot.style.background = '';
      dot.style.borderColor = '';
      dot.style.boxShadow = '';
      dot.title = '';
    }
  });

  // 大积累池：根据牌型类型显示不同颜色
  const bigPool = cardSys.bigPool || [];
  const bigPoolCount = Array.isArray(bigPool) ? bigPool.length : 0;
  console.log(`[updateChainPools] bigPool=${JSON.stringify(bigPool)}, count=${bigPoolCount}`);

  // 大池牌型颜色映射
  const comboColors = {
    'lianhuan': { fill: 'linear-gradient(135deg, #c060ff, #9020e0)', border: '#d080ff', glow: 'rgba(192,96,255,.7)', icon: '💥' },
    'ning': { fill: 'linear-gradient(135deg, #60c0ff, #2090e0)', border: '#80d0ff', glow: 'rgba(96,192,255,.7)', icon: '✦' },
    'shi': { fill: 'linear-gradient(135deg, #80ff50, #50c020)', border: '#a0ff70', glow: 'rgba(128,255,80,.7)', icon: '⚡' },
    'duizi': { fill: 'linear-gradient(135deg, #ffc050, #e09020)', border: '#ffd070', glow: 'rgba(255,192,80,.7)', icon: '👫' },
    'none': { fill: 'linear-gradient(135deg, #ff6060, #ff3020)', border: '#ff8080', glow: 'rgba(255,96,48,.6)', icon: '🔥' },
  };

  const bigDots = bigDotsEl.querySelectorAll('.chain-dot-big, .chain-dot');
  bigDots.forEach((dot, i) => {
    const isFilled = i < bigPoolCount;
    dot.classList.toggle('filled', isFilled);

    if (isFilled && Array.isArray(bigPool)) {
      // 根据该位置牌型类型设置颜色
      const comboType = bigPool[i] || 'none';
      const comboStyle = comboColors[comboType] || comboColors['none'];

      dot.style.background = comboStyle.fill;
      dot.style.borderColor = comboStyle.border;
      dot.style.boxShadow = `0 0 12px ${comboStyle.glow}`;
      dot.title = `${comboStyle.icon} ${CARD_COMBO_NAMES[comboType] || '大连'}`;
    } else if (isFilled) {
      // 兼容旧逻辑（数字类型）
      dot.style.background = '';
      dot.style.borderColor = '';
      dot.style.boxShadow = '';
    } else {
      // 重置为默认样式
      dot.style.background = '';
      dot.style.borderColor = '';
      dot.style.boxShadow = '';
      dot.title = '';
    }
  });

  // 大池满时闪烁提示（根据大连类型改变颜色）
  const wrapEl = document.getElementById('chainPoolsWrap');
  if (wrapEl) {
    const isReady = bigPoolCount >= (window.CARD_BALANCE?.bigPoolThreshold || 3);
    wrapEl.classList.toggle('chain-pool-ready', isReady);

    if (isReady && Array.isArray(bigPool)) {
      // 分析大连类型，改变wrapper颜色
      const uniqueTypes = [...new Set(bigPool)];
      if (uniqueTypes.length === 1) {
        const type = uniqueTypes[0];
        if (type === 'lianhuan') {
          wrapEl.style.borderColor = 'rgba(192,96,255,.5)';
          wrapEl.style.boxShadow = '0 0 15px rgba(192,96,255,.4)';
        } else if (type === 'ning') {
          wrapEl.style.borderColor = 'rgba(96,192,255,.5)';
          wrapEl.style.boxShadow = '0 0 15px rgba(96,192,255,.4)';
        } else if (type === 'shi') {
          wrapEl.style.borderColor = 'rgba(128,255,80,.5)';
          wrapEl.style.boxShadow = '0 0 15px rgba(128,255,80,.4)';
        }
      } else {
        // 混搭 = 将将胡
        wrapEl.style.borderColor = 'rgba(255,200,100,.6)';
        wrapEl.style.boxShadow = '0 0 20px rgba(255,180,80,.5)';
      }
    } else {
      wrapEl.style.borderColor = '';
      wrapEl.style.boxShadow = '';
    }
  }
}

/**
 * 显示大连加成特效（已禁用弹窗，保留日志提示）
 * @param {string} school - 学派名
 * @param {string} bonusText - 加成文本
 * @param {string} bigType - 大连类型: 'lianhuan_pure'|'ning_pure'|'shi_pure'|'jiangjianghu'|'normal'
 * @param {string} bigName - 大连名称
 */
function showChainMegaEffect(school, bonusText, bigType = 'normal', bigName = '') {
  // 弹窗已禁用，避免打断战斗节奏
  // 大连加成效果仍会在 battle-cards.js 中正常应用
  console.log(`[大连加成] ${bigName || '大连加成'} 已触发（弹窗已禁用）`);
  return;
}

// 判断克制关系: 返回 'win' | 'lose' | 'tie'
function checkCounter(myAction, enemyAction){
  if(myAction === enemyAction) return 'tie';
  if(COUNTER_RELATION[myAction] === enemyAction) return 'win';
  if(COUNTER_RELATION[enemyAction] === myAction) return 'lose';
  return 'tie';
}

// 显示克制提示
function showCounterHint(result, targetEl){
  const hint = document.createElement('div');
  hint.className = `counter-hint ${result}`;
  hint.textContent = result==='win'?'克制！':result==='lose'?'被克制！':'平手';
  targetEl.style.position = 'relative';
  targetEl.appendChild(hint);
  setTimeout(()=>hint.remove(),1200);
}

// 格挡动作
function pBlock(){
  if(over) return;
  if(lSt.stun>0){ log(`${LH.name}处于眩晕状态！`,'lm'); return; }
  lSt.blockNext = true;
  log(`${LH.name} 摆开架势，准备格挡！`,'ld');
  const lEl=document.getElementById('fL');
  lEl.style.opacity='.6';
  setTimeout(()=>{lEl.style.opacity='1';},400);
  playSound('shield');
  // 执行行动
  doBattleAction('block');
}

function gotoFight(c){
  LH=c;
  RH=CHARS.find(x=>x.id!==c.id)||CHARS[1];
  const allTabs=document.querySelectorAll('.tab');
  const fightTab=[...allTabs].find(t=>t.textContent.includes('武斗场'));
  showPage('fight',fightTab);
  resetFight();
}

// ════════════════════════════════════════════════
//  战斗角色渲染
// ════════════════════════════════════════════════

// 通用：把 parts 索引对象渲染成分部件 HTML（自定义角色和内置门派弟子共用）
function buildPartsHtml(partsIdx, col){
  const p  = partsIdx;
  // 支持直接传字符串（门派弟子）或数字索引（捏脸角色）
  const _s = (arr, v) => typeof v === 'string' ? v : (arr[v]?.v || '');
  const auraStr = _s(ED_PARTS.aura, p.aura);
  const headStr = _s(ED_PARTS.head, p.head);
  const bodyStr = _s(ED_PARTS.body, p.body);
  const legsStr = _s(ED_PARTS.legs, p.legs);
  const armsData = typeof p.arms === 'string'
    ? { lv: p.arms, rv: p.arms }
    : ED_PARTS.arms[p.arms];
  const armL = armsData?.lv ?? '/';
  const armR = armsData?.rv ?? '\\';
  const auraHtml = auraStr ? `<div class="ft-aura" style="color:${col}">${auraStr}</div>` : '';
  return auraHtml
    + `<div class="ft-head" style="color:${col}">${headStr}</div>`
    + `<div class="ft-torso-row"><div class="ft-arm-l" style="color:${col}">${armL}</div><div class="ft-body" style="color:${col}">${bodyStr}</div><div class="ft-arm-r" style="color:${col}">${armR}</div></div>`
    + `<div class="ft-legs" style="color:${col}">${legsStr}</div>`;
}

// 用 parts 索引拼出 stand 文本（群英谱卡片用）
function buildPartsStand(partsIdx){
  const p = partsIdx;
  const _s = (arr, v) => typeof v === 'string' ? v : (arr[v]?.v || '');
  const lines = [];
  const aura = _s(ED_PARTS.aura, p.aura);
  if(aura) lines.push(aura);
  lines.push(_s(ED_PARTS.head, p.head));
  lines.push(_s(ED_PARTS.body, p.body));
  lines.push(_s(ED_PARTS.arms, p.arms));
  lines.push(ED_PARTS.legs[p.legs]?.v || '');
  return lines.filter(l=>l!=='').join('\n');
}

// 为 fL/fR 设置角色显示内容
// 自定义角色（cp_self）和带 parts 字段的内置角色：分部件HTML+动画
// 其余内置角色退回纯文本
function hydrateEdSFromEditorSave(){
  if(typeof edS === 'undefined') return null;
  const raw = localStorage.getItem('wuxia_editor');
  if(!raw) return null;
  try{
    const data = JSON.parse(raw);
    const getterKeys = [];
    const desc = Object.getOwnPropertyDescriptors(edS);
    for(const k of Object.keys(desc)){
      if(typeof desc[k].get === 'function' && typeof desc[k].set !== 'function') getterKeys.push(k);
    }
    for(const [k, v] of Object.entries(data)){
      if(!getterKeys.includes(k)) edS[k] = v;
    }
    return data;
  }catch(e){
    console.warn('[Battle] Failed to hydrate edS from wuxia_editor:', e);
    return null;
  }
}

// ── 默认问号轮廓字符画（用于编辑器未加载/无头像时的战斗形象）──
const _DEFAULT_QUESTION_ASCII =
  ' ╔═══╗ \n' +
  ' ║ ? ║ \n' +
  ' ╚╦═╦╝ \n' +
  '  ║ ║  \n' +
  ' ╔╩═╩╗ \n' +
  ' ║???║ \n' +
  ' ╚═══╝ ';

function buildAsciiFromAvatarState(src){
  if(typeof edBuildStageAscii === 'function'){
    return edBuildStageAscii(src);
  }
  return _DEFAULT_QUESTION_ASCII;
}

// ── 死亡倒地帧生成器（玩家角色专用）─────────────────────
// 将站立姿势转换为倒地姿势：头部朝右，横躺在地
function buildBattleAvatarDownHtml(state, col){
  if(!state || typeof ED_PARTS === 'undefined') return `<div class="ft-body" style="color:${col};white-space:pre"> ╔═══╗\n ║?×?║\n ╚╦═╦╝\n──╩═╩──</div>`;
  const getPart = k => (state.useCustom[k] && state.custom[k]) ? state.custom[k] : (ED_PARTS[k][state.parts[k]]?.v || '');
  const auraStr = getPart('aura');
  const headStr = getPart('head');
  const bodyStr = getPart('body');
  const legsStr = getPart('legs');
  // 倒地姿势：转换头部表情，横向排列身体部件
  const downHead = _downifyHead(headStr);
  const auraHtml = auraStr ? `<div class="ft-aura" style="color:${col};opacity:.3">${auraStr}</div>` : '';
  return auraHtml
    + `<div class="ft-head" style="color:${col}">${downHead}</div>`
    + `<div class="ft-torso-row"><div class="ft-arm-l" style="color:${col}"></div><div class="ft-body-wrap"><div class="ft-body" style="color:${col}">${bodyStr}</div></div><div class="ft-arm-r" style="color:${col}"></div></div>`
    + `<div class="ft-legs" style="color:${col};opacity:.6">${legsStr}</div>`;
}

// 将站立头部表情转换为死亡表情（闭眼/叉眼）
function _downifyHead(headStr){
  if(!headStr) return '  (×_×)';
  // 替换各种眼睛表情为闭眼/叉眼
  return headStr
    .replace(/[Oo][-_][Oo]/g, '(×_×)')
    .replace(/[⊙◉●][-_][⊙◉●]/g, '(×_×)')
    .replace(/[◎○][-_][◎○]/g, '(×_×)')
    .replace(/[◠◡][-_][◠◡]/g, '(×_×)')
    .replace(/[‿][-_][‿]/g, '(×_×)')
    .replace(/[•·][-_][•·]/g, '(×_×)')
    .replace(/[oO][-_][oO]/g, '(×_×)')
    .replace(/[╱╲│][-_][╱╲│]/g, '(×_×)')
    .replace(/▓[-_]▓|░[-_]░|█[-_]█/g, '×_×');
}

// ── 人形敌人通用倒地帧 ────────────────────────────────
function getHumanoidDownFrame(ch){
  // 已有down帧直接返回
  if(ch.down) return ch.down;
  // 根据种族/体型生成通用倒地帧
  const name = ch.name || '';
  const tier = ch.tier || 'func';
  const color = ch.color || '#fff';
  // 通用倒地帧库
  const genericDowns = [
    '  (×_×)\n ╱───╲\n ╱    ╲\n───',
    '  (◎_◎)\n  ╱─╲\n  ╱  ╲\n ────',
    '  (o_o)\n  ╱│╲\n  ╱ ╲\n ───',
    '  (§_§)\n ╱───╲\n  ╱ ╲\n ────',
  ];
  const idx = Math.abs([...name].reduce((a,c) => a + c.charCodeAt(0), 0)) % genericDowns.length;
  return genericDowns[idx];
}


function getBattleAvatarState(ch){
  const source = (ch && ch.parts) || (ch && ch.custom) || (ch && ch.useCustom)
    ? ch
    : (typeof edS !== 'undefined' ? edS : null);
  if(!source) return null;
  const bag = Array.isArray(source.bag) ? source.bag : (typeof edS !== 'undefined' && Array.isArray(edS.bag) ? edS.bag : []);
  const parts = { head:0, body:0, arms:0, legs:0, aura:0, ...(source.parts || {}) };
  const custom = { head:'', body:'', arms:'', legs:'', aura:'', ...(source.custom || {}) };
  const useCustom = { head:false, body:false, arms:false, legs:false, aura:false, ...(source.useCustom || {}) };
  const weaponInstId = source.weaponInstId ?? null;
  let weaponId = source.weaponId ?? null;
  if(!weaponId && weaponInstId){
    const inst = bag.find(i => i && i.instId === weaponInstId);
    weaponId = inst?.templateId || null;
  }
  if(!weaponId && source === edS) weaponId = edS.weaponId || null;

  // ── 服装/防具：与武器同理，解析 costumeInstId → costumeId ──
  const costumeInstId = source.costumeInstId ?? null;
  let costumeId = source.costumeId ?? null;
  if(!costumeId && costumeInstId){
    const inst = bag.find(i => i && i.instId === costumeInstId);
    costumeId = inst?.templateId || null;
  }

  return {
    parts,
    custom,
    useCustom,
    armsLocked: !!source.armsLocked,
    weaponId,
    costumeId,
  };
}

function buildBattleAvatarHtml(state, col){
  if(!state || typeof ED_PARTS === 'undefined') return `<pre style="margin:0;font-family:inherit;color:${col};filter:drop-shadow(0 0 10px ${col});white-space:pre;line-height:1.4;text-align:center">${_DEFAULT_QUESTION_ASCII}</pre>`;
  const getPart = k => (state.useCustom[k] && state.custom[k]) ? state.custom[k] : (ED_PARTS[k][state.parts[k]]?.v || '');
  const auraStr = getPart('aura');
  const headStr = getPart('head');
  const bodyStr = getPart('body');
  const legsStr = getPart('legs');
  let armsStr = getPart('arms');
  let armsIdx = (!state.useCustom.arms) ? state.parts.arms : null;
  if(!state.useCustom.arms && !state.armsLocked && state.weaponId && typeof getWepArmsIdx === 'function'){
    const idx = getWepArmsIdx(state.weaponId);
    if(idx !== null && ED_PARTS.arms[idx]){
      armsIdx = idx;
      armsStr = ED_PARTS.arms[idx].v;
    }
  }
  let armL = '', armR = '';
  if(!state.useCustom.arms && armsIdx !== null){
    const data = ED_PARTS.arms[armsIdx];
    if(data && data.lv !== undefined){
      armL = data.lv;
      armR = data.rv || '';
    }
  }
  if(!armL && !armR){
    const line = (armsStr || '').split('\n')[0];
    const chars = [...line];
    const mid = Math.ceil(chars.length / 2);
    armL = chars.slice(0, mid).join('');
    armR = chars.slice(mid).join('');
  }
  const auraHtml = auraStr ? `<div class="ft-aura" style="color:${col}">${auraStr}</div>` : '';
  return auraHtml
    + `<div class="ft-head" style="color:${col}">${headStr}</div>`
    + `<div class="ft-torso-row"><div class="ft-arm-l" style="color:${col}">${armL}</div><div class="ft-body-wrap"><div class="ft-body" style="color:${col}">${bodyStr}</div></div><div class="ft-arm-r" style="color:${col}">${armR}</div></div>`
    + `<div class="ft-legs" style="color:${col}">${legsStr}</div>`;
}

function buildFighterEl(el, ch, isFlip){
  if(!el) return;
  const baseClass = 'fighter' + (isFlip ? ' flip' : '');

  // 重置可能从上一次战斗残留的样式
  el.style.whiteSpace = '';
  
  if(ch.id === 'cp_self'){
    // 玩家角色：优先使用当前角色存档中的 parts/custom/useCustom，而不是页面默认 edS
    const col = ch.color;
    const avatarState = getBattleAvatarState(ch);
    el.className = baseClass + ' ft-animated entering';
    el.style.color = col;
    el.style.filter = `drop-shadow(0 0 8px ${col})`;
    el.innerHTML = buildBattleAvatarHtml(avatarState, col);
    // 应用头像框CSS（各属性单独设置避免cssText覆盖问题）
    const frameId = (typeof edS !== 'undefined' && edS.equippedFrame) ? edS.equippedFrame : 'frame_none';
    if(typeof FRAME_DB !== 'undefined' && FRAME_DB[frameId] && FRAME_DB[frameId].css){
      const css=FRAME_DB[frameId].css;
      const m=css.match(/([^:]+):([^;]+)/g)||[];
      m.forEach(decl=>{const[p,v]=decl.split(':').map(s=>s.trim());if(p&&v) el.style[p]=v;});
    }
    // 显示称号牌（战斗名下方）
    const titleId = (typeof edS !== 'undefined' && edS.equippedTitlePlate) ? edS.equippedTitlePlate : 'title_none';
    if(typeof TITLE_PLATE_DB !== 'undefined' && TITLE_PLATE_DB[titleId] && TITLE_PLATE_DB[titleId].title){
      const tp = TITLE_PLATE_DB[titleId];
      // 插入称号牌到 fighter 顶部
      const tpEl = document.createElement('div');
      tpEl.className = 'ft-titleplate';
      tpEl.textContent = tp.title;
      tpEl.style.cssText = `text-align:center;font-size:9px;letter-spacing:2px;color:${tp.color};text-shadow:0 0 6px ${tp.color};animation:pvHead 3s ease-in-out infinite;margin-bottom:2px;`;
      el.insertBefore(tpEl, el.firstChild);
    }
  } else if(ch._isNpc && ch._npcId){
    // NPC 战斗角色：用 npc-portraits.js 的部件系统渲染，效果与对话弹窗一致
    // NPC 不翻转（文字字符画镜像后会乱）
    const col = ch.color;
    const npcDef = (typeof NPC_DB !== 'undefined') ? NPC_DB[ch._npcId] : null;
    el.className = 'fighter ft-animated entering';
    el.style.color = col;
    el.style.filter = `drop-shadow(0 0 8px ${col})`;
    if(npcDef && typeof buildNpcPartsHtml === 'function'){
      el.innerHTML = buildNpcPartsHtml(npcDef, col);
    } else {
      // 降级：显示头像文字
      el.className = 'fighter entering';
      el.textContent = npcDef?.avatar || '👤';
      el.style.fontSize = '2.5rem';
    }
  } else if(ch._isEnemy && ch._enemyType === 'beast' && ch.stand){
    // 野兽敌人：优先使用 stand/down 字符画系统（即使有 parts 字段）
    // 野兽的 parts 仅用于其他逻辑，不用于渲染
    const col = ch.color;
    const lines = ch.stand.split('\n');
    let auraStr='', headStr='', bodyStr='', armsStr='', legsStr='';
    if(lines.length >= 5){
      auraStr = lines[0];
      headStr = lines[1];
      bodyStr = lines[2];
      armsStr = lines[3];
      legsStr = lines.slice(4).join('\n');
    } else if(lines.length === 4){
      headStr = lines[0];
      bodyStr = lines[1];
      armsStr = lines[2];
      legsStr = lines[3];
    } else {
      bodyStr = lines.join('\n');
    }
    el.className = 'fighter ft-animated entering';
    el.dataset.isEnemy = '1';
    el.dataset.isBeast = '1';
    el.style.color = col;
    el.style.filter = `drop-shadow(0 0 10px ${col})`;
    const auraHtml = auraStr ? `<div class="ft-aura" style="color:${col}">${auraStr}</div>` : '';
    const fullBody = [bodyStr, armsStr].filter(Boolean).join('\n');
    const titleHtml = ch.title ? `<div class="ft-enemy-title" style="color:${col};text-align:center;font-size:10px;letter-spacing:1px;margin-bottom:2px;text-shadow:0 0 6px ${col};animation:pvHead 3.2s ease-in-out infinite;animation-delay:-.5s;">${ch.title}</div>` : '';
    el.innerHTML = titleHtml
      + auraHtml
      + `<div class="ft-head" style="color:${col}">${headStr}</div>`
      + `<div class="ft-body" style="color:${col};white-space:pre">${fullBody}</div>`
      + `<div class="ft-legs" style="color:${col}">${legsStr}</div>`;
  } else if(ch.parts){
    // 门派弟子/人形敌人（带 parts 字段）：用部件索引渲染，效果与捏脸角色一致
    const col = ch.color;
    el.className = baseClass + ' ft-animated entering';
    el.style.color = col;
    el.style.filter = `drop-shadow(0 0 8px ${col})`;
    const titleHtml = ch._isEnemy && ch.title ? `<div class="ft-enemy-title" style="color:${col};text-align:center;font-size:10px;letter-spacing:1px;margin-bottom:2px;text-shadow:0 0 6px ${col};animation:pvHead 3.2s ease-in-out infinite;animation-delay:-.5s;">${ch.title}</div>` : '';
    el.innerHTML = titleHtml + buildPartsHtml(ch.parts, col);
  } else if(ch._isEnemy && ch.stand){
    // 敌人：按行拆分 stand 字符画，套进 ft-animated 结构复用待机动画
    // 注意：敌人用文字字符画，不加 flip（scaleX(-1) 会镜像汉字/符号）
    const col = ch.color;
    const lines = ch.stand.split('\n');
    // 标准5行格式：aura / head / body / torso / legs
    // 不足5行的往后补，多于5行的合并尾部到legs
    let auraStr='', headStr='', bodyStr='', armsStr='', legsStr='';
    if(lines.length >= 5){
      auraStr = lines[0];
      headStr = lines[1];
      bodyStr = lines[2];
      armsStr = lines[3];
      legsStr = lines.slice(4).join('\n');
    } else if(lines.length === 4){
      headStr = lines[0];
      bodyStr = lines[1];
      armsStr = lines[2];
      legsStr = lines[3];
    } else {
      // 少于4行：直接把所有内容放body
      bodyStr = lines.join('\n');
    }
    // 敌人不继承 flip class，避免字符画镜像
    el.className = 'fighter ft-animated entering';
    el.dataset.isEnemy = '1';
    el.style.color = col;
    el.style.filter = `drop-shadow(0 0 10px ${col})`;
    const auraHtml = auraStr ? `<div class="ft-aura" style="color:${col}">${auraStr}</div>` : '';
    // 敌人stand格式：多行文本，整体放入ft-body保持结构一致
    // 避免拆分导致flex布局异常
    const fullBody = [bodyStr, armsStr].filter(Boolean).join('\n');
    // 生成称号显示（在角色上方，作为ft-animated子元素跟随动画）
    const titleHtml = ch.title ? `<div class="ft-enemy-title" style="color:${col};text-align:center;font-size:10px;letter-spacing:1px;margin-bottom:2px;text-shadow:0 0 6px ${col};animation:pvHead 3.2s ease-in-out infinite;animation-delay:-.5s;">${ch.title}</div>` : '';
    el.innerHTML = titleHtml
      + auraHtml
      + `<div class="ft-head" style="color:${col}">${headStr}</div>`
      + `<div class="ft-body" style="color:${col};white-space:pre">${fullBody}</div>`
      + `<div class="ft-legs" style="color:${col}">${legsStr}</div>`;
  } else {
    // 其他内置角色/无形象敌人：用问号字符画兜底
    el.className = baseClass + ' entering ft-animated';
    el.style.cssText = isFlip ? 'transform:scaleX(-1)' : '';
    const displayStand = ch.stand || _DEFAULT_QUESTION_ASCII;
    el.innerHTML = `<pre style="margin:0;font-family:inherit;color:${ch.color};filter:drop-shadow(0 0 8px ${ch.color});white-space:pre;line-height:1.4;text-align:center">${displayStand}</pre>`;
    el.style.color = ch.color;
    el.style.filter = `drop-shadow(0 0 8px ${ch.color})`;
  }
}

function resetFight(){
  // 战斗DOM不存在时静默返回（index.html没有战斗界面）
  if(!document.getElementById('fL')) return;
  
  // 播放战斗开始音效（首次初始化时）
  if(typeof playSound==='function' && !resetFight._started){
    playSound('battle_start');
    resetFight._started = true;
    // 3秒后允许再次播放开始音效（防止连续reset时重复）
    setTimeout(()=>{resetFight._started=false;}, 3000);
  }
  
  over=false; combo=0;
  if(cTimer){clearTimeout(cTimer);cTimer=null;}
  lSt=makeState(); rSt=makeState();
  window.lSt = lSt; window.rSt = rSt;
  updateBuffDisplay();
  // 先清除上一场的 _maxHpFull，避免 updateBars 用旧值导致血条显示一半
  LH._maxHpFull = null; RH._maxHpFull = null;
  lHp=LH.maxHp; rHp=RH.maxHp;
  // 同步到 window 对象，确保全局可访问
  window.lHp=lHp; window.rHp=rHp;
  cds={};
  LH.skills.forEach(s=>{cds[s.id]=0;});
  RH.skills.forEach(s=>{cds[s.id]=0;});
  // 宠物技能CD初始化
  petCds={};
  if(typeof petGetActive === 'function'){
    const pet = petGetActive();
    if(pet && Array.isArray(pet.skills)){
      pet.skills.forEach(skId=>{ petCds[skId]=0; });
    }
  }
  dmgL=0;dmgR=0;rounds=0;
  
  // ── 战斗道具冷却重置 ──
  if(typeof battleItemCds !== 'undefined') {
    Object.keys(battleItemCds).forEach(k => { battleItemCds[k] = 0; });
  }
  // ── BOSS系统蓄力状态重置 ──
  if(typeof BossSystem !== 'undefined') {
    BossSystem.chargeActive = false;
    BossSystem.chargeTurns = 0;
  }
  
  // ════════════════════════════════════════
  // 初始化博弈系统
  // ════════════════════════════════════════
  momentum = 0;
  actionChain = [];
  enemyIntent = null;
  window._streakSilverMult = 1; // 重置连胜银两倍率
  // 为AI设置随机战斗风格
  const styles = ['aggressive','defensive','berserker','balanced'];
  // 根据 NPC 属性自动分配差异化 AI 风格
  RH._aiStyle = _pickAiStyleForNpc(RH);
  // "将将胡"AI系统初始化
  _aiMood = 'normal';
  _aiMoodTurns = 0;
  RH._aiSpecial = 'normal';
  // 生成第一回合意图
  generateEnemyIntent();
  updateMomentum();
  updateChainPools(); // 双层积累池UI
  const lEl=document.getElementById('fL'),rEl=document.getElementById('fR');
  buildFighterEl(lEl, LH, false);
  buildFighterEl(rEl, RH, false);
  // 同步底部光圈颜色
  const lpEl=document.getElementById('fLplatform'),rpEl=document.getElementById('fRplatform');
  if(lpEl)lpEl.style.color=LH.color;
  if(rpEl)rpEl.style.color=RH.color;
  // 入场动画结束后移除class
  setTimeout(()=>{lEl.classList.remove('entering');rEl.classList.remove('entering');},500);
  updateBars(); renderStatus();
  const lNameEl=document.getElementById('lName');
  const rNameEl=document.getElementById('rName');
  if(lNameEl){
    // 玩家名显示：境界称号 + 名字
    const realmLabel = (typeof getRealmShortName === 'function') ? getRealmShortName() : '';
    lNameEl.textContent = realmLabel ? `${realmLabel}·${LH.name}` : LH.name;
    lNameEl.style.color=LH.color;
  }
  // 敌人显示称号+名称
  if(rNameEl){
    // title格式已经是「称号」Lv5，直接显示 title + name
    const titleText = RH.title ? `${RH.title} ${RH.name}` : RH.name;
    rNameEl.textContent=titleText;
    rNameEl.style.color=RH.color;
  }
  
  document.getElementById('bLog').innerHTML='';
  // lStatus/rStatus 元素在某些页面可能不存在，加 null 检查
  const lStatusEl = document.getElementById('lStatus');
  const rStatusEl = document.getElementById('rStatus');
  if (lStatusEl) lStatusEl.innerHTML='';
  if (rStatusEl) rStatusEl.innerHTML='';
  const comboBarEl = document.getElementById('comboBar');
  if (comboBarEl) comboBarEl.className='combo-bar';
  // 只清除技能插槽，保留基础攻击按钮
  const skillBar = document.getElementById('skillBar');
  if(skillBar) skillBar.querySelectorAll('.skill-slot:not(.basic-atk)').forEach(el => el.remove());
  // ── 武器加成注入 ──
  const lWep=getCharWeapon(LH.id); const rWep=getCharWeapon(RH.id);
  LH._wepAtk=(lWep?lWep.atkBonus:0); RH._wepAtk=(rWep?rWep.atkBonus:0);
  lSt._weaponCritBonus=(lWep?lWep.critBonus:0); rSt._weaponCritBonus=(rWep?rWep.critBonus:0);
  lSt._wepKey=(lWep?lWep.specialKey:''); rSt._wepKey=(rWep?rWep.specialKey:'');
  lSt._sunMoonCount=0; rSt._sunMoonCount=0;
  // ── 服装加成注入 ──
  const lCos=getCharCostume(LH.id); const rCos=getCharCostume(RH.id);
  LH._cosDefBonus=(lCos?lCos.defBonus:0); RH._cosDefBonus=(rCos?rCos.defBonus:0);
  lSt._cosSchoolBonus=(lCos?lCos.schoolBonus:{}); rSt._cosSchoolBonus=(rCos?rCos.schoolBonus:{});
  lSt._cosKey=(lCos?lCos.special:''); rSt._cosKey=(rCos?rCos.special:'');
  // ── 扩展属性注入（气血/内力/暴击/闪避/速度） ──
  // ★ 门派被动加成：仅对玩家侧（cp_self）生效，让门派选择影响战斗手感
  function _getSectBonusFor(ch){
    if(ch.id !== 'cp_self') return {};
    if(typeof getSectPassiveBonus === 'function'){
      return getSectPassiveBonus(edS?.sect || null);
    }
    return {};
  }
  function calcFinalStats(ch, wep, cos){
    const baseCrit = (ch.crit||10) / 100;
    const baseDodge = (ch.dodge||8) / 100;
    const wepCrit = wep ? (wep.critBonus||0) : 0;
    const cosCrit = cos ? (cos.critBonus||0)/100 : 0;
    const wepDodge = wep ? (wep.dodgeBonus||0)/100 : 0;
    const cosDodge = cos ? (cos.dodgeBonus||0)/100 : 0;
    const wepHp   = wep ? (wep.hpBonus||0) : 0;
    const cosHp   = cos ? (cos.hpBonus||0) : 0;
    const cosAtk  = cos ? (cos.atkBonus||0) : 0;
    const wepMp   = wep ? (wep.mpBonus||0) : 0;
    const cosMp   = cos ? (cos.mpBonus||0) : 0;
    const wepSpd  = wep ? (wep.speedBonus||0) : 0;
    const cosSpd  = cos ? (cos.speedBonus||0) : 0;
    // ── 装备耐久折扣（仅玩家 cp_self，耐久<50%时属性衰减）──
    let wepDurMult = 1, cosDurMult = 1;
    if(ch.id === 'cp_self' && typeof getEquipDurMult === 'function'){
      wepDurMult = wep ? getEquipDurMult(wep) : 1;
      cosDurMult = cos ? getEquipDurMult(cos) : 1;
    }
    // ── 饥渴惩罚（仅玩家 cp_self）──
    let hungerMult = 1, thirstMult = 1;
    if(ch.id === 'cp_self' && typeof travelPlayerState !== 'undefined'){
      const food  = travelPlayerState.food  ?? 100;
      const water = travelPlayerState.water ?? 100;
      // 饱食惩罚
      if(food < 10)      { hungerMult = 0.6; }  // 饿死边缘
      else if(food < 30) { hungerMult = 0.85; } // 饥饿
      else if(food < 50) { hungerMult = 0.95; } // 微饿
      // 口渴惩罚
      if(water < 5)       { thirstMult = 0.7; }  // 渴死边缘
      else if(water < 20){ thirstMult = 0.80; } // 脱水
      else if(water < 40){ thirstMult = 0.90; } // 微渴
    }
    // ── 词条加成（仅自定义角色）──
    let affAtk=0,affCrit=0,affHp=0,affDef=0,affMp=0,affDodge=0,affSpd=0;
    // ── 效果类词条收集 ──
    let _equipEffects = {};  // { lifesteal:18, counter:10, burn:12, shield:50, expBoost:10, ... }
    function _collectEquipEffects(affixes){
      if(!affixes || !Array.isArray(affixes)) return;
      affixes.forEach(a=>{
        const s = a.stat;
        // 数值类词条不在这里处理
        if(['atkBonus','critBonus','hpBonus','defBonus','mpBonus','dodgeBonus','speedBonus'].includes(s)) return;
        // 效果类词条：取较大值叠加
        if(!a.isNegative){
          const cur = _equipEffects[s] || 0;
          _equipEffects[s] = Math.max(cur, a.value);
        }
      });
    }
    // ── 强化加成 ──
    let enhAtk=0, enhDef=0, enhHp=0;
    if(ch.id === 'cp_self' && typeof calcEnhBonus === 'function'){
      // 武器强化
      const wepInstId = typeof edS !== 'undefined' ? edS.weaponInstId : null;
      if(wepInstId && Array.isArray(edS.bag)){
        const wInst = edS.bag.find(i=>i.instId===wepInstId);
        if(wInst){ const b=calcEnhBonus(wInst); enhAtk+=b.atk; enhDef+=b.def; enhHp+=b.hp; }
      }
      // 防具强化
      const cosInstId = typeof edS !== 'undefined' ? edS.costumeInstId : null;
      if(cosInstId && Array.isArray(edS.bag)){
        const cInst = edS.bag.find(i=>i.instId===cosInstId);
        if(cInst){ const b=calcEnhBonus(cInst); enhAtk+=b.atk; enhDef+=b.def; enhHp+=b.hp; }
      }
    }
    // ── 出战宠物装备加成（仅玩家生效）──
    let petAtk=0, petDef=0, petHp=0, petSpd=0, petInt=0;
    if(ch.id === 'cp_self' && typeof petGetActive === 'function'){
      const activePet = petGetActive();
      if(activePet && typeof petGetEquipBonus === 'function'){
        const eb = petGetEquipBonus(activePet);
        petAtk = eb.atk || 0;
        petDef = eb.def || 0;
        petHp  = eb.hp  || 0;
        petSpd = eb.spd || 0;
        petInt = eb.int || 0;
      }
    }
    if(wep){
      const wa = getItemAffixes('weapon', wep.id)||[];
      _collectEquipEffects(wa);
      wa.forEach(a=>{
        if(a.stat==='atkBonus')   affAtk  += a.value;
        if(a.stat==='critBonus')  affCrit += a.value/100;
        if(a.stat==='hpBonus')    affHp   += a.value;
        if(a.stat==='defBonus')   affDef  += a.value;
        if(a.stat==='mpBonus')    affMp   += a.value;
        if(a.stat==='dodgeBonus') affDodge+= a.value/100;
        if(a.stat==='speedBonus') affSpd  += a.value;
      });
    }
    if(cos){
      const ca = getItemAffixes('costume', cos.id)||[];
      _collectEquipEffects(ca);
      ca.forEach(a=>{
        if(a.stat==='atkBonus')   affAtk  += a.value;
        if(a.stat==='critBonus')  affCrit += a.value/100;
        if(a.stat==='hpBonus')    affHp   += a.value;
        if(a.stat==='defBonus')   affDef  += a.value;
        if(a.stat==='mpBonus')    affMp   += a.value;
        if(a.stat==='dodgeBonus') affDodge+= a.value/100;
        if(a.stat==='speedBonus') affSpd  += a.value;
      });
    }
    // ── 门派被动加成（仅玩家侧）──
    const sb = _getSectBonusFor(ch);
    const sbHp  = sb.hp || 0;
    const sbAtk = sb.atk || 0;
    const sbDef = sb.def || 0;
    const sbMp  = sb.mp || 0;
    const sbSpd = sb.spd || 0;
    const sbCrit= (sb.crit || 0) / 100;       // 百分比转小数
    const sbDodge=(sb.dodge||0) / 100;
    // ── 门派建筑效果（仅玩家侧，sect-building.js）──
    let bldExpMult = 1, bldBreakthrough = 0;
    if(ch.id === 'cp_self' && typeof sbGetAllEffects === 'function'){
      const bfx = sbGetAllEffects();
      // expBonus: 经验倍率（练功场）
      bldExpMult = bfx.expBonus || 1;
      // breakthroughBonus: 突破概率加成（静修阁）
      bldBreakthrough = bfx.breakthroughBonus || 0;
    }
    // ── 门派天赋效果（仅玩家侧，sect-talent.js）──
    let tHp=0, tAtk=0, tDef=0, tMp=0, tSpd=0, tCrit=0, tDodge=0;
    if(ch.id === 'cp_self' && typeof stGetAllTalentEffects === 'function'){
      const te = stGetAllTalentEffects();
      const ef = te.effects || {};
      tHp    = ef.hp || 0;
      tAtk   = ef.atk || 0;
      tDef   = ef.def || 0;
      tMp    = ef.mp || 0;
      tSpd   = ef.spd || 0;
      tCrit  = (ef.crit || 0) / 100;
      tDodge = (ef.dodge || 0) / 100;
      // 特殊效果暂存（经验/银两倍率等在 checkWin 中使用）
      if(te.specials) window._talentSpecials = te.specials;
    }
    // ── 结义加成（仅玩家侧，sworn-brother.js）──
    let swAtk=0, swDef=0, swCrit=0;
    if(ch.id === 'cp_self' && typeof SW !== 'undefined' && typeof SW.getBonuses === 'function'){
      const swb = SW.getBonuses();
      swAtk  = swb.atkBonus  || 0;   // 固定值攻击加成
      swDef  = swb.defBonus  || 0;   // 固定值防御加成
      swCrit = (swb.critBonus || 0) / 100; // 百分比转小数
    }
    // ── 师徒加成（仅玩家侧，master-apprentice.js）──
    let maAtkMult=1, maDefMult=1;
    if(ch.id === 'cp_self' && typeof MA !== 'undefined' && typeof MA.getMasterApprenticeBonus === 'function'){
      const mab = MA.getMasterApprenticeBonus(RH?._npcId || null);
      maAtkMult = mab.atkMult || 1;  // 师父在场攻击+5%
      maDefMult = mab.defMult || 1;  // 弟子在场防御+3%
    }
    // ── 情缘加成（仅玩家侧，romance.js）──
    let romAtk=0, romDef=0, romHp=0, romCrit=0;
    if(ch.id === 'cp_self' && typeof ROM !== 'undefined' && typeof ROM.getBattleBonus === 'function'){
      const rb = ROM.getBattleBonus();
      if(rb){
        romAtk  = rb.atk  || 0;   // 固定攻击加成（伴侣+1，白首+3）
        romDef  = rb.def  || 0;   // 固定防御加成（伴侣+1，白首+2）
        romHp   = rb.hp   || 0;   // 固定气血加成（伴侣+20，白首+50）
        romCrit = (rb.crit||0)/100;
      }
    }
    // ── 境界加成（仅玩家侧，realm-system.js）──
    let realmBonus = { atk:0, def:0, hp:0, mp:0, dodge:0, crit:0 };
    if(ch.id === 'cp_self' && typeof getRealmAttrBonus === 'function'){
      realmBonus = getRealmAttrBonus();
    }
    return {
      totalCrit:  Math.min(0.75, baseCrit + wepCrit + cosCrit + affCrit + sbCrit + swCrit + romCrit + (realmBonus.crit||0)/100 + tCrit),
      totalDodge: Math.min(0.50, baseDodge + wepDodge + cosDodge + affDodge + (realmBonus.dodge||0)/100 + tDodge),
      totalHp:    ch.maxHp + wepHp + cosHp + affHp + sbHp + romHp + enhHp + petHp + Math.round(realmBonus.hp||0) + tHp,
      totalAtk:   Math.round((ch.atk + (wep?wep.atkBonus:0) * wepDurMult + cosAtk + affAtk + sbAtk + swAtk + romAtk + enhAtk + petAtk + (realmBonus.atk||0) + tAtk) * hungerMult * thirstMult * maAtkMult),
      totalMp:    (ch.maxMp||150) + wepMp + cosMp + affMp + sbMp + petInt + Math.round(realmBonus.mp||0) + tMp,
      totalSpd:   Math.round(((ch.speedN||8)  + wepSpd + cosSpd + affSpd + sbSpd + petSpd + tSpd) * thirstMult),
      totalDef:   Math.round((ch.def + ((wep?wep.defBonus||0:0)) * wepDurMult + ((cos?cos.defBonus||0:0)) * cosDurMult + affDef + sbDef + swDef + romDef + enhDef + petDef + (realmBonus.def||0) + tDef) * hungerMult * maDefMult),
      // 暴露门派加成信息供UI显示
      _sectBonus: Object.keys(sb).filter(k=>!k.startsWith('_')).length ? { ...sb } : null,
      // 宠物装备加成（供UI显示）
      _petEquipBonus: (petAtk||petDef||petHp||petSpd) ? { atk:petAtk, def:petDef, hp:petHp, spd:petSpd } : null,
      // 装备效果类词条（供战斗中使用：吸血/反击/灼烧/护盾等）
      _equipEffects: Object.keys(_equipEffects).length ? _equipEffects : null,
    };
  }
  LH._stats = calcFinalStats(LH, lWep, lCos);
  RH._stats = calcFinalStats(RH, rWep, rCos);
  // ── 根骨五维注入 ──
  // 玩家（cp_self）：取 edS.primaryPts
  // NPC角色对象：若带 _npcInstId 则从 inst.stats.primaryPts 取，否则 null（fallback反推）
  function injectPrimaryPts(ch){
    if(ch.id === 'cp_self' && typeof edS !== 'undefined' && edS.primaryPts){
      ch._primaryPts = edS.primaryPts;
    } else if(ch._npcInstId){
      const _inst = typeof getNpcInst === 'function' ? getNpcInst(ch._npcInstId) : null;
      ch._primaryPts = _inst?.stats?.primaryPts || null;
    } else {
      ch._primaryPts = null; // 走 fallback 反推
    }
  }
  injectPrimaryPts(LH);
  injectPrimaryPts(RH);
  // 保存当前血量比例（在覆盖前）
  const lHpRatio = (typeof lHp === 'number' && LH._maxHpFull) ? (lHp / LH._maxHpFull) : 1;
  const lMpRatio = (typeof lMp === 'number' && LH._maxMpFull) ? (lMp / LH._maxMpFull) : 1;
  // 用综合气血设置最大血量，但保留当前血量比例
  LH._maxHpFull = LH._stats.totalHp; RH._maxHpFull = RH._stats.totalHp;
  lHp = Math.round(LH._stats.totalHp * lHpRatio);
  rHp = RH._stats.totalHp;
  // ── 装备效果类词条：护盾初始化 ──
  if(LH._stats._equipEffects){
    const lShield = LH._stats._equipEffects.shield || 0;
    if(lShield > 0){
      lSt.shield = lShield;
      lSt.shieldHits = 999;
      const lElWrap = document.getElementById('fLwrap');
      if(lElWrap) lElWrap.classList.add('shielded');
      log(`🛡 装备护盾发动！${LH.name} 获得 ${lShield} 点护盾`,'lb');
    }
  }
  if(RH._stats._equipEffects){
    const rShield = RH._stats._equipEffects.shield || 0;
    if(rShield > 0){
      rSt.shield = rShield;
      rSt.shieldHits = 999;
      const rElWrap = document.getElementById('fRwrap');
      if(rElWrap) rElWrap.classList.add('shielded');
      log(`🛡 敌方装备护盾发动！${RH.name} 获得 ${rShield} 点护盾`,'lm');
    }
  }
  // 同步到 window 对象
  window.lHp = lHp; window.rHp = rHp;
  // 综合暴击率注入战斗状态
  lSt._totalCrit = LH._stats.totalCrit; rSt._totalCrit = RH._stats.totalCrit;
  // ── 内力（MP）初始化 ──
  LH._maxMpFull = LH._stats.totalMp; RH._maxMpFull = RH._stats.totalMp;
  lMp = Math.round(LH._stats.totalMp * lMpRatio);
  rMp = RH._stats.totalMp;
  // 同步到 window 对象
  window.lMp = lMp; window.rMp = rMp;
  lSt._totalAtk = LH._stats.totalAtk; rSt._totalAtk = RH._stats.totalAtk;
  updateBars(); // ← totalHp 已就绪，重新渲染血条，修正首次显示一半的问题
  // 渲染属性迷你栏（含内力条）
  function renderStatsMini(elId, ch, st){
    const el=document.getElementById(elId); if(!el) return;
    el.innerHTML = [
      `<span class="fst">⚔${st.totalAtk}</span>`,
      `<span class="fst">🛡${st.totalDef}</span>`,
      `<span class="fst">🎯${Math.round(st.totalCrit*100)}%</span>`,
      `<span class="fst">💨${Math.round(st.totalDodge*100)}%</span>`,
      `<span class="fst" title="内力上限">💙${st.totalMp}</span>`,
      `<span class="fst">⚡${st.totalSpd}</span>`,
    ].join('');
  }
  renderStatsMini('lStatsMini', LH, LH._stats);
  renderStatsMini('rStatsMini', RH, RH._stats);
  // ── 门派加成提示（玩家侧）──
  (function(){
    const el = document.getElementById('sectBonusHint');
    if(!el) return;
    const sb = LH._stats?._sectBonus;
    if(!sb || !Object.keys(sb).length){ el.innerHTML=''; return; }
    const sectId = (typeof edS !== 'undefined') ? (edS.sect||null) : null;
    const sectName = (sectId && typeof SECTS !== 'undefined')
      ? (SECTS.find(s=>s.id===sectId)?.name||sectId) : sectId;
    const desc = sb._desc || '门派加成';
    const parts = [];
    if(sb.atk) parts.push(`⚔+${sb.atk}`);
    if(sb.def) parts.push(`🛡+${sb.def}`);
    if(sb.hp) parts.push(`❤+${sb.hp}`);
    if(sb.mp) parts.push(`💙+${sb.mp}`);
    if(sb.crit) parts.push(`🎯+${sb.crit}%`);
    if(sb.dodge) parts.push(`💨+${sb.dodge}%`);
    if(sb.spd) parts.push(`⚡+${sb.spd}`);
    if(sb.poisonAtk) parts.push(`🐍毒攻+${sb.poisonAtk}%`);
    if(sb.poisonResist) parts.push(`🛡抗毒+${sb.poisonResist}%`);
    if(sb.iceAtk) parts.push(`❄冰攻+${sb.iceAtk}%`);
    if(sb.iceResist) parts.push(`🛡抗冰+${sb.iceResist}%`);
    if(sb.cureBonus) parts.push(`💚疗+${sb.cureBonus}%`);
    if(sb.counterAtk) parts.push(`⚔反+${sb.counterAtk}`);
    el.innerHTML = `<span style="font-size:10px;color:#f0d090;opacity:.8">【${sectName}·${desc}】 ${parts.join(' ')}</span>`;
  })();
  updateMpBars();
  // 战斗场武器浮标（立绘旁）— 已移除（手机端重叠）
  function makeWepFloat(w){ return ''; }
  const fLwep=document.getElementById('fLwep'); if(fLwep) fLwep.innerHTML='';
  const fRwep=document.getElementById('fRwep'); if(fRwep) fRwep.innerHTML='';
  // 血条武器标签 — 已移除
  function makeWepTag(w,align){ return ''; }
  const lTagEl=document.getElementById('lWepTag'); if(lTagEl) lTagEl.innerHTML='';
  const rTagEl=document.getElementById('rWepTag'); if(rTagEl) rTagEl.innerHTML='';
  renderSkillBar();
  renderPetSkillBar(); // 宠物主动技能栏
  log(`⚔ ${LH.name}【${LH.tag}】VS ${RH.name}【${RH.tag}】`,'lx');
  if(lWep && !LH._isEnemy) log(`${LH.name} 持有：${getWepMiniSymbol(lWep.cat)}${lWep.name}（${lWep.type}，+${lWep.atkBonus}攻击）`,'lm');
  if(rWep && !RH._isEnemy) log(`${RH.name} 持有：${getWepMiniSymbol(rWep.cat)}${rWep.name}（${rWep.type}，+${rWep.atkBonus}攻击）`,'lm');
  // 饥渴状态警告
  if(LH.id === 'cp_self' && typeof travelPlayerState !== 'undefined'){
    const food  = travelPlayerState.food  ?? 100;
    const water = travelPlayerState.water ?? 100;
    const warns = [];
    if(food  < 30) warns.push(`🍚饱食${food}`);
    if(water < 20) warns.push(`💧口渴${water}`);
    if(warns.length) log(`⚠ ${warns.join(' ')}，状态不佳！`,'lm');
  }
  // 输出综合属性（含内力）
  const ls=LH._stats, rs=RH._stats;
  if(ls) log(`▸ ${LH.name} 综合属性：气血${ls.totalHp} 攻${ls.totalAtk} 防${ls.totalDef} 暴击${Math.round(ls.totalCrit*100)}% 闪避${Math.round(ls.totalDodge*100)}% 💙内力${ls.totalMp}`,'lm');
  if(rs) log(`▸ ${RH.name} 综合属性：气血${rs.totalHp} 攻${rs.totalAtk} 防${rs.totalDef} 暴击${Math.round(rs.totalCrit*100)}% 闪避${Math.round(rs.totalDodge*100)}% 💙内力${rs.totalMp}`,'lm');
  log(`纯卡牌战斗模式，出牌攻击！`,'lx');
  // ── 开场演出（精英/BOSS/剧情怪显示，普通野外怪跳过；擂台切磋始终播放 arena 风格）──
  const _bm = (typeof battleMode !== 'undefined') ? battleMode : '';
  const enemyTier = RH && (RH._enemyTier || RH.tier);
  const isNormalWildEnemy = enemyTier === 'func' && !window._storyBossName;
  const isArenaMode = _bm === 'arena';
  if(!resetFight._isReset){
    resetFight._isReset = true;
    // 擂台切磋：始终播放入场动画（showBossIntro 内部 isArena 判断会切换为切磋风格）
    // 非切磋：普通野外怪跳过，精英/BOSS/剧情怪播放
    if((isArenaMode || !isNormalWildEnemy) && typeof showBossIntro === 'function'){
      const bossName = window._storyBossName || null;
      showBossIntro(bossName || (RH ? RH.name : null), RH);
      window._storyBossName = null;
    }
  } else {
    resetFight._isReset = false;
  }

  // ── 战法手牌系统初始化 ──
  if (typeof initCardSystem === 'function') {
    initCardSystem();
  }

  // ── 大连加成激活提示 ──
  const bb = window._bigBonusActive;
  if (bb) {
    log(`🔥🔥🔥 ${bb.bigName}激活！${bb.school}学派大连加成持续中！`,'lc');
    window._bigBonusActive = null;
  }
}

function updateBars(){
  const lMax=LH._maxHpFull||LH.maxHp, rMax=RH._maxHpFull||RH.maxHp;
  const lPct=Math.max(0,lHp/lMax*100),rPct=Math.max(0,rHp/rMax*100);
  const lEl=document.getElementById('lHp'),rEl=document.getElementById('rHp');
  if(lEl) lEl.style.width=lPct+'%';
  if(rEl) rEl.style.width=rPct+'%';
  const lcls=lPct<20?'hp-inner hp-l hp-danger':lPct<40?'hp-inner hp-l hp-warn':'hp-inner hp-l';
  const rcls=rPct<20?'hp-inner hp-r hp-danger':rPct<40?'hp-inner hp-r hp-warn':'hp-inner hp-r';
  if(lEl) lEl.className=lcls; 
  if(rEl) rEl.className=rcls;
  const lHpN=document.getElementById('lHpN');
  const rHpN=document.getElementById('rHpN');
  if(lHpN) lHpN.textContent=`${Math.max(0,Math.round(lHp))} / ${lMax}`;
  if(rHpN) rHpN.textContent=`${Math.max(0,Math.round(rHp))} / ${rMax}`;
  updateBuffDisplay();
}

function renderStatus(){
  const render=(el,st,ch)=>{
    if (!el) return; // 防护：元素不存在时静默返回
    let html='';
    if(st.shield>0||st.shieldAbs>0)     html+=`<span class="sti" style="color:#44aaff;border-color:#44aaff44">🛡护盾</span>`;
    if(st.poison>0)                      html+=`<span class="sti" style="color:#88ff44;border-color:#88ff4444">🐍中毒${st.poison}s</span>`;
    if(st.stun>0)                        html+=`<span class="sti" style="color:#ffee44;border-color:#ffee4444">💫眩晕${st.stun}s</span>`;
    if(st.atkBuff>0)                     html+=`<span class="sti" style="color:#ff88ff;border-color:#ff88ff44">⬆攻${Math.round(st.atkBuff*100)}%</span>`;
    if(st.defBuff>0)                     html+=`<span class="sti" style="color:#88ffff;border-color:#88ffff44">⬆防${Math.round(st.defBuff*100)}%</span>`;
    if(st.atkBuff<0)                     html+=`<span class="sti" style="color:#ff8844;border-color:#ff884444">⬇攻${Math.round(-st.atkBuff*100)}%</span>`;
    if(st.defBuff<0)                     html+=`<span class="sti" style="color:#ff8844;border-color:#ff884444">⬇防${Math.round(-st.defBuff*100)}%</span>`;
    if(st.reflect)                       html+=`<span class="sti" style="color:#80ffff;border-color:#80ffff44">🌀反弹</span>`;
    if(st.silence>0)                     html+=`<span class="sti" style="color:#aaaaaa;border-color:#aaaaaa44">🔇沉默${st.silence}s</span>`;
    if(st.fury)                          html+=`<span class="sti" style="color:#ff4020;border-color:#ff402044">🔥狂怒</span>`;
    el.innerHTML=html;
    const fighterEl=ch==='l'?document.getElementById('fL'):document.getElementById('fR');
    if(fighterEl){
      if(st.poison>0) fighterEl.classList.add('poisoned-anim'); else fighterEl.classList.remove('poisoned-anim');
      if(st.shield>0||st.shieldAbs>0) fighterEl.classList.add('shielded'); else fighterEl.classList.remove('shielded');
    }
  };
  render(document.getElementById('lStatus'),lSt,'l');
  render(document.getElementById('rStatus'),rSt,'r');
}

// 防止在战斗页面未加载时 setInterval 疯狂报错
function renderStatusSafe(){
  if(document.getElementById('lStatus')) renderStatus();
}

function screenShake(big=false, duration=0){
  document.body.classList.remove('shake','big-shake');
  void document.body.offsetWidth;
  document.body.classList.add(big?'big-shake':'shake');
  if(duration > 0){
    setTimeout(()=>{
      document.body.classList.remove('shake','big-shake');
    }, duration);
  }
}
function flash(type){
  const el=document.getElementById(type+'Flash');
  el.classList.add('on'); setTimeout(()=>el.classList.remove('on'),120);
}
// 技能大字遮罩已禁用（showSkillBig 屏蔽理由：遮挡战斗视野）
function showSkillBig(){}
function floatDmg(el,text,cls){
  const d=document.createElement('div');
  d.className=`dmg-float ${cls}`;d.textContent=text;
  d.style.left=Math.random()*60+20+'%';d.style.top='30%';
  el.parentElement.appendChild(d);
  setTimeout(()=>d.remove(),1000);
}
function sparks(el,n=8){
  const syms=['✦','★','⚡','◆','✸','⁕'];
  for(let i=0;i<n;i++){
    const s=document.createElement('div');
    s.className='spark';
    s.textContent=syms[Math.floor(Math.random()*syms.length)];
    const ang=Math.random()*Math.PI*2,dist=40+Math.random()*60;
    s.style.setProperty('--dx',Math.cos(ang)*dist+'px');
    s.style.setProperty('--dy',Math.sin(ang)*dist+'px');
    s.style.left=Math.random()*80+10+'%';s.style.top='30%';
    s.style.color=`hsl(${Math.random()*60+20},100%,70%)`;
    el.parentElement.appendChild(s);
    setTimeout(()=>s.remove(),700);
  }
}
// 彩色粒子（指定色调 hueStart~hueEnd）
function sparksColor(el,n,syms,hueStart,hueEnd,dur=700){
  for(let i=0;i<n;i++){
    const s=document.createElement('div');
    s.className='spark';
    s.textContent=syms[Math.floor(Math.random()*syms.length)];
    const ang=Math.random()*Math.PI*2,dist=40+Math.random()*80;
    s.style.setProperty('--dx',Math.cos(ang)*dist+'px');
    s.style.setProperty('--dy',Math.sin(ang)*dist+'px');
    s.style.left=Math.random()*80+10+'%';s.style.top=Math.random()*40+10+'%';
    const hue=hueStart+Math.random()*(hueEnd-hueStart);
    s.style.color=`hsl(${hue},100%,72%)`;
    s.style.fontSize=(10+Math.random()*8)+'px';
    el.parentElement.appendChild(s);
    setTimeout(()=>s.remove(),dur);
  }
}
// 技能类型粒子快捷函数
function sparksIce(el)  { sparksColor(el,14,['❄','✦','◆','❅','⬡'],180,220); }
function sparksFire(el) { sparksColor(el,14,['🔥','★','✸','▲','◆'],0,40); }
function sparksThunder(el){ sparksColor(el,12,['⚡','✦','★','⁕','◈'],45,65); }
function sparksPoison(el){ sparksColor(el,12,['☠','✦','◆','⁕','●'],90,140); }
function sparksDark(el) { sparksColor(el,12,['💀','◆','⬡','●','✦'],260,300); }
function sparksWind(el) { sparksColor(el,14,['～','◆','⁕','✦','≋'],160,200); }
function sparksHoly(el) { sparksColor(el,14,['✦','★','✸','◈','⬡'],40,70,900); }
function sparksBlood(el){ sparksColor(el,12,['💉','★','◆','✦','⁕'],340,360); }
function blink(el){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),280);}
function knockback(el,dir){
  const isCls=el.classList.contains('flip');
  const anim=dir==='l'?(isCls?'kb-l':'kb-l'):'kb-r';
  el.classList.remove('kb-l','kb-r');void el.offsetWidth;
  el.classList.add(anim);setTimeout(()=>el.classList.remove('kb-l','kb-r'),350);
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"暴击伤害波动系统
// ═══════════════════════════════════════════════════════════════
const CRIT_DAMAGE_BASE = 2.2;  // 基础暴击倍率
const CRIT_DAMAGE_MIN = 1.5;   // 最低1.5倍
const CRIT_DAMAGE_MAX = 3.0;   // 最高3倍（天胡！）

// ═══════════════════════════════════════════════════════════════
//  "将将胡"暴击连击系统
// ═══════════════════════════════════════════════════════════════
let _critChainCount = 0;       // 连续暴击计数
let _critChainActive = false;  // 是否激活连击模式

// ═══════════════════════════════════════════════════════════════
//  "将将胡"以弱胜强系统
// ═══════════════════════════════════════════════════════════════
let _underdogBonus = 0;        // 以弱胜强加成（等级差越大，加成越高）

function calcDmg(atk,atkSt,defSt,opts={}){
  let atkVal=atk*(1+(atkSt.atkBuff||0));
  let defVal=opts.ignoreDefense?0:opts.ignoreAll?0:1+(defSt.defBuff||0);
  // 调试：打印buff实际值
  if ((atkSt.atkBuff||0) !== 0 || (defSt.defBuff||0) !== 0) {
    console.log('[calcDmg] atkBuff='+((atkSt.atkBuff||0)*100)+'%, defBuff='+((defSt.defBuff||0)*100)+'%, final: atkVal='+atkVal.toFixed(1)+', defVal='+defVal.toFixed(2));
  }
  let def= opts.ignoreAll?0: (atkSt.fury?Math.max(0,defVal*.7):defVal);
  let dmg=atkVal/(def>.5?def:1)*( opts.mult||1);
  
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"以弱胜强加成
  // ═══════════════════════════════════════════════════════════════
  if(_underdogBonus > 0){
    dmg *= (1 + _underdogBonus);
  }
  
  // 综合暴击率（角色基础 + 武器 + 服装 + 大连加成）
  let totalCrit = atkSt._totalCrit || (atkSt._weaponCritBonus||0) + 0.1;
  // 加上大连加成的暴击率
  totalCrit += (atkSt._bigBonusCritRate || 0);
  const isCrit=opts.forceCrit||(Math.random()<totalCrit);
  if(isCrit){
    // "将将胡"暴击伤害波动：1.5x - 3x
    const critRoll = Math.random();
    let critMult = CRIT_DAMAGE_MIN + critRoll * (CRIT_DAMAGE_MAX - CRIT_DAMAGE_MIN);
    // 气运影响：运气好的玩家暴击伤害偏向高值
    const lukBonus = _getBattleLukBonus(atkSt);
    // 加上大连加成的暴击伤害
    critMult += (atkSt._bigBonusCritMult || 0);
    critMult = Math.min(CRIT_DAMAGE_MAX, critMult + lukBonus);
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"暴击连击系统
    // ═══════════════════════════════════════════════════════════════
    _critChainCount++;
    if(_critChainCount >= 2){
      // 连续2次暴击后，伤害额外增加
      const chainBonus = Math.min(0.5, (_critChainCount - 1) * 0.15); // 最高+50%
      critMult += chainBonus;
      if(_critChainCount === 2) log('🔥 暴击连击！伤害递增！','buff');
      if(_critChainCount === 3) log('💥 三连暴击！势不可挡！','legendary');
      if(_critChainCount >= 4) log(`⚡ ${_critChainCount}连暴击！神挡杀神！`,'legendary');
    }
    
    dmg *= critMult;
    // 记录暴击倍数用于显示
    atkSt._lastCritMult = critMult;
  } else {
    // 未暴击，重置连击
    if(_critChainCount > 0){
      _critChainCount = 0;
      log('连击中断','info');
    }
  }
  dmg=Math.max(1,Math.round(dmg*(0.9+Math.random()*.2)));
  return{dmg,isCrit};
}

// ── 获取战斗中的气运加成 ──
function _getBattleLukBonus(atkSt){
  // 从战斗角色数据读取运气（区分玩家/敌方）
  let luk = 0;
  const isPlayerSide = (atkSt === lSt);
  if(isPlayerSide && typeof edS !== 'undefined'){
    luk = (edS.originPts?.luk || 0) + (edS.primaryPts?.luk || 0);
  }
  // 每点运气提供最高0.05的暴击伤害加成
  return Math.min(0.3, luk * 0.015);
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"闪避系统：濒死时闪避率翻倍（绝境求生）
// ═══════════════════════════════════════════════════════════════
function tryDodge(defSide, isHeavy){
  if(isHeavy) return false; // 重击无法闪避
  const ch = defSide==='l' ? LH : RH;
  const st = defSide==='l' ? lSt : rSt;
  let dodgeRate = (ch._stats ? ch._stats.totalDodge : 0);
  // 宠物技能闪避buff
  dodgeRate += st.dodgeBuff || 0;

  // 濒死闪避翻倍：血量<20%时，闪避率×2（最高不超过50%）
  const hp = defSide==='l' ? lHp : rHp;
  const maxHp = ch._maxHpFull || ch.maxHp || 100;
  if(hp / maxHp < 0.2){
    dodgeRate = Math.min(0.5, dodgeRate * 2);
    st._desperateDodge = true; // 标记本次为绝境闪避
  }
  
  const rolled = Math.random();
  const success = rolled < dodgeRate;
  
  // 绝境闪避成功时显示特殊提示
  if(success && st._desperateDodge){
    log(`💨 绝境求生！${ch.name}在生死关头爆发出惊人的闪避！`, 'ls');
  }
  
  return success;
}

// 施加伤害（带护盾逻辑）
function applyDmg(side,rawDmg,opts={}){
  const st=side==='l'?lSt:rSt;
  const el=document.getElementById(side==='l'?'fL':'fR');
  let dmg=rawDmg;
  let shielded=false;
  if(!opts.ignoreShield&&!opts.ignoreAll){
    if(st.shieldAbs>0){
      const abs=Math.min(st.shieldAbs,dmg);
      st.shieldAbs-=abs; dmg-=abs; shielded=true;
      if(st.shieldAbs<=0){st.shieldAbs=0;el.classList.remove('shielded');}
    } else if(st.shieldHits>0){
      dmg=Math.round(dmg*.4); st.shieldHits--; shielded=true;
      if(st.shieldHits<=0){st.shield=0;st.shieldHits=0;el.classList.remove('shielded');}
    }
  }
  // ── 将将胡：藏牌蓄势防御加成 ──
  const holdDef = window.getCardHoldDefBonus?.();
  if(holdDef && holdDef > 0){ dmg = Math.round(dmg * (1 - holdDef)); }
  // ── 格挡反击蓄势：下次出牌伤害加成 ──
  if(st._bonusDmg && st._bonusDmg > 1){ dmg = Math.round(dmg * st._bonusDmg); st._bonusDmg = 1; }
  if(side==='l'){lHp-=dmg; window.lHp=lHp;} else {rHp-=dmg; window.rHp=rHp;}
  if(side==='l') dmgL+=dmg; else dmgR+=dmg;
  return{finalDmg:dmg,shielded};
}

// ── 核心攻击函数（兼容旧版）──
function doAttack(type='normal'){
  doBattleAction(type);
}

function pa(type){ doBattleAction(type); if(typeof window.trackCardFate === 'function') window.trackCardFate(type); }

// ════════════════════════════════════════════════
//  博弈战斗核心 - doBattleAction
// ════════════════════════════════════════════════
function doBattleAction(actionType){
  if(over) return;
  rounds++;
  const lEl=document.getElementById('fL'),rEl=document.getElementById('fR');
  
  // 眩晕检查
  if(lSt.stun>0){ log(`${LH.name}处于眩晕状态，无法行动！`,'lm'); raidTick(); return; }
  
  // 获取行动属性
  const actStats = ACTION_STATS[actionType];
  if(!actStats) return;
  
  // 添加到连招链
  addToChain(actionType);
  
  // 检查连招奖励
  const comboBonus = checkComboBonus();
  
  // 判断克制关系
  const counterResult = checkCounter(actionType, enemyIntent);
  const rElWrap = document.getElementById('fRwrap');
  
  // 处理格挡
  if(actionType === 'block'){
    lSt.block = true;
    lSt.blockDur = 1;
    // 格挡时增加下回合攻击
    lSt.nextAtkBonus = 0.2;
    showCounterHint(counterResult, lEl);
    
    // 气势变化
    if(counterResult === 'win'){
      changeMomentum(MOMENTUM_BONUS);
      log(`🛡 ${LH.name} 完美格挡！准备反击！`,'ls');
    } else if(counterResult === 'lose'){
      changeMomentum(-MOMENTUM_PENALTY);
      log(`🛡 ${LH.name} 格挡姿态被看破...`,'lc');
    } else {
      log(`🛡 ${LH.name} 摆开防御架势`,'lm');
    }
    
    updateBars(); renderStatus();
    raidTick(); checkWin();
    return;
  }
  
  // 计算伤害倍率
  let dmgMult = actStats.dmgMult;
  
  // 克制关系影响
  let counterText = '';
  if(counterResult === 'win'){
    dmgMult *= 1.5; // 克制增加50%伤害
    counterText = ' [克制!]';
    changeMomentum(MOMENTUM_BONUS);
    showCounterHint('win', rEl);
    log(`⚡ ${LH.name} 的${actStats.name}克制了对手！`,'ls');
  } else if(counterResult === 'lose'){
    dmgMult *= 0.5; // 被克制减少50%伤害
    counterText = ' [被克]';
    changeMomentum(-MOMENTUM_PENALTY);
    showCounterHint('lose', lEl);
    log(`💢 ${LH.name} 的${actStats.name}被对手化解...`,'lc');
  } else {
    showCounterHint('tie', lEl);
  }
  
  // 连招奖励加成
  if(comboBonus){
    dmgMult += comboBonus.bonusDmg;
  }
  
  // 气势满值加成
  let isJiangHu = false;
  if(momentum >= MOMENTUM_MAX){
    dmgMult *= 1.5;
    isJiangHu = true;
    momentum = 0;
    updateMomentum();
    log('🔥 将将胡！气势爆发！','ls');
  }
  
  // 计算伤害
  const totalAtk = LH._stats ? LH._stats.totalAtk : (LH.atk+(LH._wepAtk||0));
  const {dmg,isCrit}=calcDmg(totalAtk,lSt,rSt,{mult:dmgMult,forceCrit:isJiangHu});
  
  // 快攻必中
  if(actionType === 'quick'){
    // 快攻无法被闪避
  }
  
  // 辅助：给wrap加冲刺class
  function doRush(wrapId, dur){
    const w=document.getElementById(wrapId); if(!w) return;
    w.classList.remove('rush-r'); void w.offsetWidth;
    w.classList.add('rush-r'); setTimeout(()=>w.classList.remove('rush-r'), dur);
  }
  
  // 闪避判定（快攻无法闪避）
  if(actStats.canDodge && tryDodge('r', actionType==='heavy')){
    const atkF=LH.attack||[LH.stand];
    const frm=actionType==='heavy'?(LH.heavy||atkF):atkF;
    animFighter(lEl,frm,LH.stand,LH.color,'normal');
    doRush('fLwrap', 460);
    const rFrm=RH.hit||[RH.stand];
    animFighter(rEl,rFrm,RH.stand,RH.color,'dodge');
    floatDmg(rEl,'闪避！','dd');
    log(`${LH.name} ${actStats.name} → ${RH.name} 闪避开来！`,'lm');
    playSound('wind');
    raidTick(); checkWin();
    return;
  }
  
  // 应用伤害
  const {finalDmg,shielded}=applyDmg('r',dmg);
  
  // 冲刺动画
  doRush('fLwrap', 460);
  doRush('fRwrap', 460);
  
  // 攻击帧
  const atkF=LH.attack||[LH.stand];
  const frm=actionType==='heavy'?(LH.heavy||atkF):atkF;
  animFighter(lEl,frm,LH.stand,LH.color,actionType==='heavy'?'heavy':'normal');
  const rFrm=RH.hit||[RH.stand];
  animFighter(rEl,rFrm,RH.stand,RH.color,'hit');
  
  // 碰撞顶点爆发
  setTimeout(()=>{
    blink(rEl); knockback(rEl,'r');
    sparks(rEl,isCrit?14:7);
    if(isCrit||actionType==='heavy'){flash('red');screenShake(actionType==='heavy');} else flash('red');
    playSound(isCrit ? 'crit' : (actionType==='heavy' ? 'heavy' : 'hit'));
    
    let dmgText = isCrit?`暴击! ${finalDmg}`:(shielded?`🛡${finalDmg}`:finalDmg);
    if(isJiangHu) dmgText += '🔥';
    floatDmg(rEl,dmgText,isCrit?'dc':'dn');
    if(isCrit) floatDmg(rEl,'CRIT!','dc');
  }, 161);
  
  // 连击
  addCombo();
  const jiangHuLabel = isJiangHu?'🔥':'';
  const cLabel=isCrit?'💥':'';
  log(`${LH.name} ${actStats.name}${jiangHuLabel}${cLabel}${counterText} → ${RH.name} ${shielded?'（护盾）':''}受到 ${finalDmg} 伤害`,'ln');
  
  // 反伤
  if(rSt.reflectPct>0){
    const rd=Math.round(finalDmg*rSt.reflectPct);
    rHp-=rd; window.rHp=rHp; floatDmg(rEl,`↩${rd}`,'dp'); log(`↩ 反伤 ${rd}`,'lp');
  }
  
  // ── 装备效果类词条触发（玩家攻击命中后）──
  if(LH._stats._equipEffects){
    const eff = LH._stats._equipEffects;
    // 吸血
    if(eff.lifesteal && finalDmg > 0){
      const heal = Math.round(finalDmg * eff.lifesteal / 100);
      if(heal > 0){
        lHp = Math.min(LH._stats.totalHp, lHp + heal);
        window.lHp = lHp;
        floatDmg(lEl, `+${heal}`, 'heal');
        log(`🩸 吸血恢复 ${heal} 气血`, 'lb');
      }
    }
    // 灼烧DOT
    if(eff.burn && Math.random()*100 < eff.burn){
      const burnDmg = eff.burn >= 15 ? 18 : eff.burn >= 8 ? 12 : 8;
      rSt.poison = Math.max(rSt.poison||0, 3);
      rSt.poisonDmg = Math.max(rSt.poisonDmg||0, burnDmg / LH._stats.totalHp);
      rSt._poisonName = rSt._poisonName || '灼烧';
      log(`🔥 灼烧触发！${RH.name} 每回合 -${burnDmg} 气血`, 'lb');
    }
    // 中毒DOT
    if(eff.poisonTick && Math.random()*100 < eff.poisonTick){
      const poisDmg = eff.poisonTick >= 8 ? 10 : 6;
      rSt.poison = Math.max(rSt.poison||0, 3);
      rSt.poisonDmg = Math.max(rSt.poisonDmg||0, poisDmg / LH._stats.totalHp);
      rSt._poisonName = rSt._poisonName || '中毒';
      log(`☠ 中毒触发！${RH.name} 每回合 -${poisDmg} 气血`, 'lb');
    }
    // 冰冻
    if(eff.freeze && Math.random()*100 < eff.freeze){
      rSt.stun = Math.max(rSt.stun||0, 1);
      log(`❄ 冰冻触发！${RH.name} 被冻结1回合`, 'lb');
      playSound('crit');
      flash('cyan');
    }
    // 连击
    if(eff.doubleStrike && Math.random()*100 < eff.doubleStrike){
      const extraDmg = Math.round(LH._stats.totalAtk * 0.5);
      const {finalDmg:ed2} = applyDmg('r', extraDmg);
      setTimeout(()=>{
        floatDmg(rEl, `连击!${ed2}`, 'dc');
        log(`⚡ 连击！追加 ${ed2} 伤害`, 'lb');
        playSound('hit');
      }, 250);
    }
  }
  
  // 清除格挡状态
  lSt.block = false;
  
  updateBars(); renderStatus();
  _tryPlayerExtraHit();
  // ── 结义兄弟战斗增援（sworn-brother.js）──
  if(!over && typeof SW !== 'undefined' && typeof SW.battleAssist === 'function'){
    const assist = SW.battleAssist(RH.name);
    if(assist){
      setTimeout(()=>{
        if(over) return;
        const {finalDmg: assistDmg} = applyDmg('r', assist.damage);
        blink(rEl); sparks(rEl, 8);
        floatDmg(rEl, `🩸${assistDmg}`, 'dc');
        log(assist.flavor, 'ls');
        updateBars(); renderStatus(); checkWin();
      }, 600);
    }
  }
  
  // ── 宠物战斗辅助 ──────────────────────────
  if(!over && typeof petBattleAttack === 'function'){
    const activePet = petGetActive();
    if(activePet && Math.random() < 0.4){ // 40%概率宠物出手
      setTimeout(()=>{
        if(over) return;
        const petResult = petBattleAttack(activePet, RH);
        if(petResult){
          const {finalDmg: petDmg} = applyDmg('r', petResult.damage);
          blink(rEl); sparks(rEl, 5);
          floatDmg(rEl, `🐾${petDmg}`, 'dc');
          log(petResult.msg, 'ls');
          updateBars(); renderStatus(); checkWin();
        }
      }, 800);
    }
  }
  
  raidTick(); checkWin();
}

function pDodge(){
  if(over) return;
  if(lSt.stun>0){ log(`${LH.name}处于眩晕状态！`,'lm'); return; }
  lSt.reflect=true;
  log(`${LH.name} 施展闪避，准备反弹下次攻击！`,'ld');
  const lEl=document.getElementById('fL');
  lEl.style.opacity='.5';
  setTimeout(()=>{lEl.style.opacity='1';},600);
  playSound('shield');
  raidTick();
}

// ── 速度差额外出手系数 ──
// 返回 { extraChance, extraLabel }
// extraChance: 快方获得额外轻击的概率（0=无额外）
function _calcSpdBonus(fastSpd, slowSpd){
  const diff = fastSpd - slowSpd;
  if(diff < 5)  return { extraChance: 0,    extraLabel: '' };
  if(diff < 10) return { extraChance: 0.25, extraLabel: '⚡身法敏捷' };
  if(diff < 18) return { extraChance: 0.45, extraLabel: '⚡疾若流风' };
  return           { extraChance: 0.65, extraLabel: '⚡鬼魅身法' };
}

// AI回合 - 博弈系统
function raidTick(){
  if(over) return;
  setTimeout(()=>{
    if(over) return;
    if(rSt.stun>0){ log(`${RH.name}处于眩晕状态，跳过回合`,'lm'); tickPoison(); return; }
    const rEl=document.getElementById('fR'),lEl=document.getElementById('fL');

    // ── BOSS阶段变化检查 ──
    if (typeof BossSystem !== 'undefined' && BossSystem.active) {
      BossSystem.checkPhaseTransition();
      if (BossSystem.phaseLock) {
        // 阶段过渡动画中，跳过敌人行动
        generateEnemyIntent();
        tickPoison();
        if (typeof tickBattleItemCds === 'function') tickBattleItemCds();
        return;
      }
      // BOSS特殊招式判断（优先于普通AI）
      const bossMove = BossSystem.getBossAction();
      if (bossMove) {
        const executed = BossSystem.executeSpecialMove(bossMove);
        if (executed && bossMove !== 'charge_warn') {
          // 特殊招式执行完毕
          generateEnemyIntent();
          updateBars(); renderStatus(); checkWin();
          tickPoison();
          if (typeof tickBattleItemCds === 'function') tickBattleItemCds();
          return;
        }
        // charge_warn只是预警，继续普通行动
      }
    }

    // ── AI速度差：NPC速度高于玩家时，有概率额外轻击一次 ──
    const rSpd = RH._stats ? RH._stats.totalSpd : (RH.speedN||8);
    const lSpd = LH._stats ? LH._stats.totalSpd : (LH.speedN||8);
    const {extraChance: npcExtraChance, extraLabel: npcExtraLabel} = _calcSpdBonus(rSpd, lSpd);
    const npcGetsExtra = npcExtraChance > 0 && Math.random() < npcExtraChance;

    // AI技能判断
    const avail=RH.skills.filter(s=>cds[s.id]<=0&&rSt.silence<=0);
    let usedSkill=false;
    let usedSkillObj=null;
    if(avail.length&&Math.random()<.35){
      const sk=avail[Math.floor(Math.random()*avail.length)];
      usedSkillObj = sk;
      // 出牌揭示动画
      showEnemyCardReveal(sk);
      execSkill(sk,'r'); usedSkill=true;
    }
    
    if(!usedSkill){
      // ════════════════════════════════════════
      // 博弈系统：AI选择行动
      // ════════════════════════════════════════
      const aiAction = enemyIntent; // AI执行预设的意图
      const actStats = ACTION_STATS[aiAction];
      
      // 处理AI格挡
      if(aiAction === 'block'){
        rSt.block = true;
        rSt.blockDur = 1;
        rSt.nextAtkBonus = 0.2;
        log(`🛡 ${RH.name} 摆开防御架势`,'lm');
        
        // 生成下一回合意图
        generateEnemyIntent();
        updateBars(); renderStatus(); checkWin();
        tickPoison();
        if (typeof tickBattleItemCds === 'function') tickBattleItemCds();
        return;
      }
      
      // 计算伤害倍率
      let dmgMult = actStats.dmgMult;
      let counterText = '';
      
      // "将将胡"爆发效果：伤害+50%
      if(RH._aiSpecial === 'burst'){
        dmgMult *= 1.5;
        counterText = ' [爆发!]';
        log(`🔥 ${RH.name} 爆发出惊人的力量！`, 'lc');
      }
      
      // 判断克制关系（从玩家角度看）
      const counterResult = checkCounter(actionChain[actionChain.length-1] || 'normal', aiAction);
      
      if(counterResult === 'lose'){ // 玩家克制AI
        dmgMult *= 0.5;
        counterText = ' [被克]';
      } else if(counterResult === 'win'){ // AI克制玩家
        dmgMult *= 1.5;
        counterText = ' [克制!]';
      }
      
      // 计算伤害
      const rTotalAtk = RH._stats ? RH._stats.totalAtk : (RH.atk+(RH._wepAtk||0));
      const {dmg,isCrit}=calcDmg(rTotalAtk,rSt,lSt,{mult:dmgMult});
      
      // 处理玩家格挡
      if(lSt.block){
        lSt.block = false;
        const blockResult = checkCounter('block', aiAction);
        if(blockResult === 'win'){
          // 格挡成功，反击
          const counterDmg = Math.round(dmg * 0.5);
          rHp -= counterDmg; window.rHp=rHp;
          floatDmg(rEl,`反击! ${counterDmg}`,'dc');
          log(`🛡 ${LH.name} 格挡反击！${RH.name}受到 ${counterDmg} 伤害`,'ls');
          flash('blue'); playSound('shield');
        } else {
          // 格挡被破
          const {finalDmg} = applyDmg('l', dmg);
          blink(lEl); knockback(lEl,'l');
          floatDmg(lEl,`破防! ${finalDmg}`,'dc');
          log(`💥 ${RH.name} 破防！${LH.name}受到 ${finalDmg} 伤害`,'lc');
          flash('red'); playSound('heavy');
        }
        
        // 生成下一回合意图
        generateEnemyIntent();
        updateBars(); renderStatus(); checkWin();
        tickPoison();
        return;
      }
      
      // 玩家闪避判定（快攻无法闪避）
      if(actStats.canDodge && tryDodge('l', aiAction==='heavy')){
        const _rw=document.getElementById('fRwrap'); if(_rw){_rw.classList.remove('rush-r');void _rw.offsetWidth;_rw.classList.add('rush-r');setTimeout(()=>_rw.classList.remove('rush-r'),460);}
        animFighter(rEl,aiAction==='heavy'?(RH.heavy||RH.attack):RH.attack,RH.stand,RH.color,'normal');
        floatDmg(lEl,'闪避！','dd');
        log(`${RH.name} ${actStats.name} → ${LH.name} 闪避开来！`,'lm');
        playSound('wind');
        
        // 生成下一回合意图
        generateEnemyIntent();
        updateBars(); renderStatus(); checkWin();
        tickPoison();
        return;
      }
      
      // 应用伤害
      const {finalDmg,shielded}=applyDmg('l',dmg);
      
      // 冲刺动画
      const _lw2=document.getElementById('fLwrap'); if(_lw2){_lw2.classList.remove('rush-r');void _lw2.offsetWidth;_lw2.classList.add('rush-r');setTimeout(()=>_lw2.classList.remove('rush-r'),460);}
      const _rw2=document.getElementById('fRwrap'); if(_rw2){_rw2.classList.remove('rush-r');void _rw2.offsetWidth;_rw2.classList.add('rush-r');setTimeout(()=>_rw2.classList.remove('rush-r'),460);}
      animFighter(rEl,aiAction==='heavy'?(RH.heavy||RH.attack):RH.attack,RH.stand,RH.color,aiAction==='heavy'?'heavy':'normal');
      
      // 碰撞顶点爆发
      setTimeout(()=>{
        blink(lEl); knockback(lEl,'l');
        sparks(lEl,isCrit?14:6);
        flash('red'); if(isCrit||aiAction==='heavy') screenShake(aiAction==='heavy');
        playSound(aiAction==='heavy'?'heavy':'hit');
        floatDmg(lEl,isCrit?`暴击! ${finalDmg}`:(shielded?`🛡${finalDmg}`:finalDmg),isCrit?'dc':'dn');
      }, 161);
      
      log(`${RH.name} ${actStats.name}${counterText} → ${LH.name} ${shielded?'（护盾）':''}受到 ${finalDmg} 伤害`,'lc');
      
      // 清除格挡状态
      rSt.block = false;
      if(lSt.reflectPct>0){const rd=Math.round(finalDmg*lSt.reflectPct);rHp-=rd;window.rHp=rHp;floatDmg(rEl,`↩${rd}`,'dp');log(`↩ 反伤 ${rd}`,'lp');}
      updateBars(); renderStatus(); checkWin();
    }

    // ── NPC速度优势：额外轻击 ──
    if(npcGetsExtra && !over){
      setTimeout(()=>{
        if(over) return;
        log(`${npcExtraLabel}！${RH.name} 速度超群，追加一击！`,'lc');
        const rTotalAtk2 = RH._stats ? RH._stats.totalAtk : (RH.atk+(RH._wepAtk||0));
        const {dmg:dmg2,isCrit:ic2}=calcDmg(rTotalAtk2,rSt,lSt,{mult:0.7}); // 额外一击威力70%
        if(!tryDodge('l',false)){
          const {finalDmg:fd2}=applyDmg('l',dmg2);
          blink(lEl); sparks(lEl,5);
          floatDmg(lEl,ic2?`暴击! ${fd2}`:fd2,ic2?'dc':'dn');
          log(`↳ 追击 → ${LH.name} 受到 ${fd2} 伤害`,'lc');
          playSound('hit'); flash('red');
        } else {
          floatDmg(lEl,'闪避！','dd');
          log(`↳ 追击被 ${LH.name} 闪开！`,'lm');
          playSound('wind');
        }
        updateBars(); renderStatus(); checkWin();
      }, 350);
    }

    tickPoison();
  }, 400+Math.random()*300);
}

// ── 玩家速度优势：额外出手（doAttack后调用）──
function _tryPlayerExtraHit(){
  if(over) return;
  const lSpd = LH._stats ? LH._stats.totalSpd : (LH.speedN||8);
  const rSpd = RH._stats ? RH._stats.totalSpd : (RH.speedN||8);
  const {extraChance, extraLabel} = _calcSpdBonus(lSpd, rSpd);
  if(extraChance <= 0 || Math.random() >= extraChance) return;
  const lEl=document.getElementById('fL'), rEl=document.getElementById('fR');
  setTimeout(()=>{
    if(over) return;
    log(`${extraLabel}！${LH.name} 身法出众，追加一击！`,'ls');
    const lTotalAtk = LH._stats ? LH._stats.totalAtk : (LH.atk+(LH._wepAtk||0));
    const {dmg,isCrit}=calcDmg(lTotalAtk,lSt,rSt,{mult:0.7}); // 额外一击威力70%
    if(!tryDodge('r',false)){
      const {finalDmg}=applyDmg('r',dmg);
      blink(rEl); sparks(rEl,6);
      floatDmg(rEl,isCrit?`暴击! ${finalDmg}`:finalDmg,isCrit?'dc':'dn');
      log(`↳ 追击 → ${RH.name} 受到 ${finalDmg} 伤害`,'ls');
      playSound('hit'); flash('red');
    } else {
      floatDmg(rEl,'闪避！','dd');
      log(`↳ 追击被 ${RH.name} 闪开！`,'lm');
      playSound('wind');
    }
    updateBars(); renderStatus(); checkWin();
  }, 280);
}

function tickPoison(){
  ['l','r'].forEach(side=>{
    const st=side==='l'?lSt:rSt;
    const ch=side==='l'?LH:RH;
    const el=document.getElementById(side==='l'?'fL':'fR');
    if(st.poison>0){
      st.poison--;
      const pdmg=Math.round(ch.maxHp*st.poisonDmg);
      if(side==='l'){lHp-=pdmg; window.lHp=lHp;}else{rHp-=pdmg; window.rHp=rHp;}
      floatDmg(el,`🐍-${pdmg}`,'dp');
      if(st.poison<=0){log(`${ch.name}的毒素消退了`,'lm');}
    }
    if(st.stun>0) st.stun=Math.max(0,st.stun-1);
    if(st.atkBuff!==0&&st.atkBuffTurns>0){st.atkBuffTurns--;if(st.atkBuffTurns<=0)st.atkBuff=0;}
    if(st.defBuff!==0&&st.defBuffTurns>0){st.defBuffTurns--;if(st.defBuffTurns<=0)st.defBuff=0;}
    if(st.dodgeBuff!==0&&st.dodgeBuffTurns>0){st.dodgeBuffTurns--;if(st.dodgeBuffTurns<=0)st.dodgeBuff=0;}
    if(st.silence>0) st.silence=Math.max(0,st.silence-1);
    // 大连加成回合递减
    if(st._bigBonusCritRate!==undefined&&st._bigBonusCritRateTurns>0){st._bigBonusCritRateTurns--;if(st._bigBonusCritRateTurns<=0)st._bigBonusCritRate=0;}
    if(st._bigBonusCritMult!==undefined&&st._bigBonusCritMultTurns>0){st._bigBonusCritMultTurns--;if(st._bigBonusCritMultTurns<=0)st._bigBonusCritMult=0;}
    // 绝境反击回合计数器递减
    if(st._desperateMode && st._desperateMode > 0){
      st._desperateMode--;
      if(st._desperateMode <= 0){
        st.atkBuff = Math.max(0, (st.atkBuff||0) - 50);
        log(`${ch.name} 的绝境反击效果消散了`, 'lm');
      }
    }
  });
  updateBuffDisplay();
  // ── 每回合内力自然回复（普通攻击/技能都回蓝）──
  lMp = Math.min(LH._maxMpFull||150, lMp + Math.max(2, Math.round((LH._stats?.totalMp||150)*0.025)));
  rMp = Math.min(RH._maxMpFull||150, rMp + Math.max(2, Math.round((RH._stats?.totalMp||150)*0.025)));
  // 同步到 window 对象
  window.lMp = lMp; window.rMp = rMp;
  updateMpBars();
  
  // ── 每回合减少技能冷却 ──
  if(typeof cds === 'object'){
    Object.keys(cds).forEach(skId=>{
      if(cds[skId]>0){
        cds[skId]--;
        // 更新UI
        const sk = (LH.skills && LH.skills.find(s=>s.id===skId)) || (RH.skills && RH.skills.find(s=>s.id===skId));
        if(sk) updateCooldownUI(sk);
      }
    });
  }
  // ── 宠物技能CD递减 ──
  if(typeof petCds === 'object'){
    const petKeys = Object.keys(petCds);
    petKeys.forEach(skId=>{
      if(petCds[skId] > 0){
        petCds[skId]--;
        updatePetSkillCDUI(skId);
      }
    });
  }

  // ── 战斗道具冷却递减 ──
  if(typeof tickBattleItemCds === 'function') tickBattleItemCds();

  // ── 战法手牌回合结束 ──
  if(typeof onCardSystemTurnEnd === 'function') onCardSystemTurnEnd();

  // ── 重置休息状态（新回合开始）──
  if(typeof resetRestState === 'function') resetRestState();

  updateBars(); renderStatus(); checkWin();
}

function addCombo(){
  combo++;
  if(cTimer) clearTimeout(cTimer);
  // ⚠️ 修复：setTimeout 中的 comboBar 需要 null 检查
  cTimer=setTimeout(()=>{
    combo=0;
    const bar=document.getElementById('comboBar');
    if(bar) bar.classList.remove('on','pop');
  },2500);
  const bar=document.getElementById('comboBar');
  // ⚠️ 修复：bar 为 null 时直接返回
  if(!bar) return;
  if(combo>=3){
    const msgs={3:'3 COMBO！',5:'⚡ 5 COMBO！',7:'🔥 7 COMBO！',10:'💥 10 COMBO！！',15:'👑 15 COMBO！！！'};
    bar.textContent=msgs[combo]||(combo>=15?`🌟 ${combo} COMBO！！！`:`${combo} COMBO`);
    bar.classList.add('on','pop');
    void bar.offsetWidth; bar.style.animation='none'; void bar.offsetWidth; bar.style.animation='';
  }
}
function comboBreak(){
  combo=0;
  // ⚠️ 修复：comboBar 需要 null 检查
  const bar=document.getElementById('comboBar');
  if(bar) bar.classList.remove('on','pop');
}

function checkWin(){
  console.log('[checkWin battle.js] 被调用', { over, lHp, rHp });
  if(over) {
    console.log('[checkWin battle.js] 战斗已结束，返回');
    return;
  }
  if(lHp<=0||rHp<=0){
    console.log('[checkWin battle.js] 检测到战斗结束条件:', { lHp, rHp });
    
    // ═══════════════════════════════════════════════════════════════
    //  战斗"将将胡"系统 - 濒死反击/绝境爆发
    // ═══════════════════════════════════════════════════════════════
    // 玩家濒死（血量<=0）时触发
    if(lHp<=0){
      const luckRoll = Math.random();
      
      // 2%概率：绝境反击（满血复活+攻击翻倍，持续3回合）
      if(luckRoll < 0.02 && !window._desperateCounterUsed){
        window._desperateCounterUsed = true;
        lHp = Math.floor((LH._maxHpFull || LH.maxHp) * 0.3); // 复活30%血量
        lSt.atkBuff = (lSt.atkBuff || 0) + 50; // 攻击+50%
        lSt._desperateMode = 3; // 持续3回合
        log('🔥 绝境反击！你在濒死之际爆发出惊人潜能！','legendary');
        log('💪 气血恢复30%，攻击力+50%，持续3回合！','buff');
        playSound('rage');
        flash('gold');
        updateBars();
        return; // 不结束战斗
      }
      // 3%概率：回光返照（恢复50%血量，立即行动一次）
      else if(luckRoll < 0.05 && !window._lastLightUsed){
        window._lastLightUsed = true;
        lHp = Math.floor((LH._maxHpFull || LH.maxHp) * 0.5);
        log('✨ 回光返照！生死关头，一股暖流涌遍全身！','legendary');
        log('💚 气血恢复50%！','heal');
        playSound('heal');
        flash('green');
        updateBars();
        return; // 不结束战斗
      }
    }
    
    // 敌人濒死时的将将胡
    if(rHp<=0){
      const luckRoll = Math.random();
      
      // 1%概率：敌人临死反扑（玩家受到30%血量伤害）
      if(luckRoll < 0.01){
        const counterDmg = Math.floor((LH._maxHpFull || LH.maxHp) * 0.3);
        lHp = Math.max(1, lHp - counterDmg);
        log(`☠️ ${RH.name}临死反扑！你受到${counterDmg}点伤害！`,'warning');
        playSound('heavy');
        flash('red');
        updateBars();
        // 如果玩家也被反扑致死，则结束战斗
        if(lHp<=0){
          log('💀 与敌人同归于尽...','debuff');
        }
      }
    }
    over=true;
    const winner=lHp>0?LH:RH;
    const loser=lHp>0?RH:LH;
    const loserSide = lHp>0?'R':'L'; // 输家在哪一侧
    const loserEl=document.getElementById(lHp>0?'fR':'fL');
    const isPlayer = loser.id==='cp_self' || (loser.id&&loser.id.startsWith('cc'));
    const isBeast = loserEl.dataset.isBeast === '1' || (loser._isEnemy && loser._enemyType === 'beast');
    const isArenaMode = typeof battleMode !== 'undefined' && battleMode === 'arena';

    // ── 擂台切磋模式：跳过死亡动画，改用友好切磋结局 ──
    // （气血恢复由 patchWinLayerForArena 在战败弹窗弹出时立即处理）
    if(isArenaMode && isPlayer){
      // 无需操作：跳过死亡动画即可，气血恢复见 battle.html patchWinLayerForArena
    } else {
      // ── 普通战斗死亡动画序列 ──────────────────────────
      // 1. 屏幕闪红 + 剧烈震动
      flash('red');
      if(isPlayer){
        // 玩家死亡：更强烈的震动
        screenShake(true, 600);
      } else {
        screenShake(true, 350);
      }

      // 2. 角色倾倒动画（CSS旋转）
      loserEl.classList.add(lHp>0?'fall-r':'fall-l');

      // 3. 延迟显示倒地帧（350ms后）
      setTimeout(()=>{
        // 移除倾倒动画类，避免影响字符画显示
        loserEl.classList.remove('fall-l', 'fall-r');
        loserEl.classList.remove('ft-animated');

        if(isBeast){
          // 野兽怪：碎裂效果
          _playBeastDeathEffect(loserEl, loser);
        } else if(isPlayer){
          // 玩家死亡：使用专用倒地帧
          _showPlayerDownFrame(loserEl, loser);
          // 添加灵魂飘散效果
          setTimeout(()=>_playSoulDepartEffect(loserEl), 200);
        } else {
          // 人形敌人：显示倒地帧
          _showHumanoidDownFrame(loserEl, loser);
          // 添加血迹效果
          setTimeout(()=>_playBloodSplatEffect(loserEl, loser.color), 150);
        }
      }, 350);

      // 4. 血雾/碎片粒子
      if(!isBeast){
        setTimeout(()=>{
          _playDeathParticleBurst(loserEl, isPlayer);
          // 击倒音效
          if(typeof playSound==='function') playSound('ko');
        }, 200);
      } else {
        // 野兽碎裂也播放ko音效
        setTimeout(()=>{
          if(typeof playSound==='function') playSound('ko');
        }, 350);
      }
    }

    // ── 判断玩家是否获胜 ──
    const playerWon = winner.id==='cp_self' || (winner.id&&winner.id.startsWith('cc'));

    // 播放胜利/失败音效
    if(typeof playSound==='function'){
      if(playerWon){
        playSound('battle_victory');
      }else{
        playSound('battle_defeat');
      }
    }

    // ── 战利品掉落（玩家角色获胜时）──
    let lootHtml = '';
    console.log('[checkWin] 检查玩家获胜状态:', { playerWon, winner: winner?.name, winnerId: winner?.id });
    if(playerWon){
      // 战斗经验（所有战斗场景统一在此发放）
      // NPC战斗：来自 npc-combat.js startNpcBattle / startBattleInNewPage
      // 地下城/野外怪：来自 dungeon.js startWildBattle（回调里不再重复发放）
      console.log('[checkWin] 玩家获胜，准备计算经验. loser:', loser?.name, 'level:', loser?.level, 'tier:', loser?.tier);
      console.log('[checkWin] 函数检查:', { calcBattleExp: typeof calcBattleExp, addPlayerExp: typeof addPlayerExp });
      if(typeof calcBattleExp === 'function' && typeof addPlayerExp === 'function'){
        const targetLv  = loser.level || loser.stats?.level || 10;
        const playerLv  = (typeof edS !== 'undefined' ? edS.level : null) || 1;
        const targetTier = loser.tier || 'func';
        const targetBaseExp = loser.exp || loser.baseExp || 0; // 怪物基础经验
        console.log('[checkWin] loser对象:', { name: loser?.name, exp: loser?.exp, level: loser?.level, tier: loser?.tier, _enemyData: loser?._enemyData });
        console.log('[checkWin] 计算经验: playerLv=', playerLv, 'targetLv=', targetLv, 'targetTier=', targetTier, 'targetBaseExp=', targetBaseExp);
        let expGain = calcBattleExp(playerLv, targetLv, targetTier, targetBaseExp);
        console.log('[checkWin] 基础经验:', expGain, '准备调用 addPlayerExp');
        // ── 师徒经验加成（每位师父+8%，上限24%）──
        if(typeof MA !== 'undefined' && typeof MA.getMasterApprenticeBonus === 'function'){
          const mab = MA.getMasterApprenticeBonus(RH?._npcId || null);
          expGain = Math.round(expGain * (mab.expMult || 1));
        }
        // ── 结义经验加成（每级+0.5%）──
        if(typeof SW !== 'undefined' && typeof SW.getBonuses === 'function'){
          const swb = SW.getBonuses();
          const swExpBonus = 1 + (swb.expBonus || 0) / 100;
          expGain = Math.round(expGain * swExpBonus);
        }
        // ── 情缘经验加成（伴侣+3%，白首+5%）──
        if(typeof ROM !== 'undefined' && typeof ROM.getBattleBonus === 'function'){
          const rb = ROM.getBattleBonus();
          if(rb){ const romExpMult = rb.expMult || 1; expGain = Math.round(expGain * romExpMult); }
        }
        // ── 宠物经验加成（辅助型宠物+5%）──
        if(typeof petGetActive === 'function'){
          const activePet = petGetActive();
          if(activePet && activePet.template && activePet.template.type === 'SUPPORT'){
            expGain = Math.round(expGain * 1.05);
            log(`🐾 ${activePet.name} 的祝福让你获得额外经验！`, 'buff');
          }
        }
        // ── 门派建筑经验加成（练功场）──
        if(typeof sbGetEffect === 'function'){
          var bldExpMult = sbGetEffect('training_ground', 'expBonus') || 1;
          if(bldExpMult > 1){
            expGain = Math.round(expGain * bldExpMult);
            log(`🏋️ 练功场加持，经验×${bldExpMult}！`, 'buff');
          }
        }
        // ── 门派天赋经验加成 ──
        var talentSpec = (typeof window !== 'undefined') ? window._talentSpecials : null;
        if(talentSpec && talentSpec.expMult && talentSpec.expMult > 1){
          expGain = Math.round(expGain * talentSpec.expMult);
          log(`🌟 天赋加持，经验×${talentSpec.expMult}！`, 'buff');
        }
        // ── 装备效果类词条：经验加成 ──
        if(LH._stats && LH._stats._equipEffects && LH._stats._equipEffects.expBoost){
          const equipExpMult = 1 + LH._stats._equipEffects.expBoost / 100;
          expGain = Math.round(expGain * equipExpMult);
          log(`📖 装备悟性加持，经验×${equipExpMult}！`, 'buff');
        }
        console.log('[checkWin] 最终经验:', expGain, '准备调用addPlayerExp');
        try {
          addPlayerExp(expGain, `武斗场·${loser.name}`);
          console.log('[checkWin] addPlayerExp 调用完成');
        } catch(e) {
          console.error('[checkWin] addPlayerExp 调用失败:', e);
        }
        // 存储真实经验值供胜利弹窗使用
        window._lastBattleExpGain = expGain;
        log(`📈 获得 ${expGain} 经验值`, 'lk');
        console.log('[checkWin] 经验已添加');

        // ── 连胜奖励系统 ─────────────────────────
        const _streakMs = WIN_STREAK.onWin();
        if (_streakMs) {
          // 经验加成
          if (_streakMs.expMult > 1) {
            const streakExpAdd = Math.round(expGain * (_streakMs.expMult - 1));
            if (streakExpAdd > 0 && typeof addPlayerExp === 'function') {
              addPlayerExp(streakExpAdd, '连胜加成');
              log(`🔥 连胜加成：经验+${streakExpAdd}`, 'ls');
            }
          }
          // 连胜里程碑达成提示
          if (WIN_STREAK.count === _streakMs.minWin) {
            log(`🏆 ${_streakMs.label}达成！银两×${_streakMs.silverMult} 经验×${_streakMs.expMult}${_streakMs.bonus ? ' '+_streakMs.bonus : ''}`, 'lk');
            if (typeof playSound === 'function') playSound('levelup');
            flash('gold');
          }
          // 十连胜以上掉落随机材料
          if (_streakMs.minWin >= 10 && WIN_STREAK.count === _streakMs.minWin) {
            if (typeof edS !== 'undefined' && edS.bag) {
              const _matDrops = [
                { id:'item_iron_ore', name:'铁矿石', icon:'🪨', type:'material' },
                { id:'item_herb_common', name:'草药', icon:'🌿', type:'consumable' },
                { id:'item_wolf_pelt', name:'狼皮', icon:'🐺', type:'material' },
                { id:'item_silver_coin', name:'银锭', icon:'🪙', type:'material' },
                { id:'item_jinchuang', name:'金疮药', icon:'🩹', type:'consumable', effect:{hp:35} },
              ];
              const _mat = _matDrops[Math.floor(Math.random() * _matDrops.length)];
              edS.bag.push({
                instId: 'streak_' + Date.now(),
                type: _mat.type,
                templateId: _mat.id,
                name: _mat.name,
                icon: _mat.icon,
                identified: true,
                affixes: [],
                effect: _mat.effect || undefined
              });
              if (typeof bagSave === 'function') bagSave();
              log(`🎁 连战奖励：获得 ${_mat.icon}${_mat.name}`, 'lk');
            }
          }
          // 十五连胜以上掉落功法残页
          if (_streakMs.minWin >= 15 && WIN_STREAK.count === _streakMs.minWin) {
            if (typeof edS !== 'undefined' && edS.bag) {
              edS.bag.push({
                instId: 'streak_manual_' + Date.now(),
                type: 'collectible',
                templateId: 'item_manual_fragment',
                name: '功法残页',
                icon: '📜',
                identified: true,
                affixes: []
              });
              if (typeof bagSave === 'function') bagSave();
              log(`🎁 连战奖励：获得 📜功法残页`, 'lk');
            }
          }
          // 二十连胜以上掉落稀有物品
          if (_streakMs.minWin >= 20 && WIN_STREAK.count === _streakMs.minWin) {
            const _rareItem = typeof dropRandomEquip === 'function' ? dropRandomEquip('weapon') : null;
            if (_rareItem) {
              if (!edS.bag) edS.bag = [];
              edS.bag.push(_rareItem);
              if (typeof bagSave === 'function') bagSave();
              const _tpl = typeof WEAPONS !== 'undefined' ? WEAPONS.find(function(w){return w.id===_rareItem.templateId;}) : null;
              if (_tpl) log(`🎁 连战奖励：获得 ${_tpl.name}`, 'lk');
            }
          }
          // 存储连胜倍率供银两计算使用
          window._streakSilverMult = _streakMs.silverMult;
        } else {
          window._streakSilverMult = 1;
        }

        // ── 境界真气获取 ───────────────────────
        if(typeof addRealmQi === 'function'){
          try{
            const qiGain = (typeof REALM_QI_SOURCES !== 'undefined')
              ? REALM_QI_SOURCES.battleWin(targetLv, targetTier)
              : Math.round(8 + (targetLv - playerLv) * 2);
            addRealmQi(qiGain, 'battle');
            console.log('[checkWin] 境界真气 +' + qiGain);
          }catch(e){ console.warn('[checkWin] addRealmQi error:', e); }
        }

        // ── 善恶值：击杀阵营敌人 ───────────────────────
        if(typeof addKarma === 'function'){
          const align = loser.alignment || loser._enemyAlignment || 'neutral';
          const tier  = loser.tier || loser._npcTier || 'func';
          // 精英/BOSS按阵营影响更大
          const tierMult = tier === 'boss' ? 2.0 : tier === 'elite' ? 1.5 : 1.0;
          let karmaDelta = 0;
          if(align === 'righteous') karmaDelta = Math.round(-20 * tierMult); // 杀害正道
          else if(align === 'neutral')   karmaDelta = Math.round(-5  * tierMult); // 杀害中立
          else if(align === 'evil')       karmaDelta = Math.round(15  * tierMult); // 锄强扶弱
          else if(align === 'chaotic')   karmaDelta = Math.round(5   * tierMult); // 剿灭匪徒
          if(karmaDelta !== 0){
            // 门派天赋善恶加成
            var talentSpec = window._talentSpecials;
            if(talentSpec && talentSpec.karmaMult > 1){
              karmaDelta = Math.round(karmaDelta * talentSpec.karmaMult);
            }
            addKarma(karmaDelta, `击败${loser.name}`);
            const kIcon = karmaDelta > 0 ? '🌟' : '💀';
            const kLabel = karmaDelta > 0 ? '侠义' : '杀伐';
            log(`${kIcon} ${kLabel}${karmaDelta > 0 ? '+' : ''}${karmaDelta}`, karmaDelta > 0 ? 'buff' : 'debuff');
          }
        }
      }
      // 装备掉落概率（按敌人 tier，仅人形怪掉装备）
      const enemyType = loser._enemyType || loser.type || '';
      const isHumanoid = !['beast','ghost'].includes(enemyType);
      if(isHumanoid){
      const equipDropRates = { func: 0.08, major: 0.18, elite: 0.35 };
      const eqTier = loser.tier || loser._npcTier || 'func';
      const equipDropChance = equipDropRates[eqTier] || 0.25;
      if(Math.random() < equipDropChance){
        // 70%概率掉武器，30%掉服装
        const dropType = Math.random()<0.7 ? 'weapon' : 'costume';
        const lootInst = dropRandomEquip(dropType);
        if(lootInst){
          if(!edS.bag) edS.bag=[];
          edS.bag.push(lootInst);
          bagSave();
          const tpl = dropType==='weapon'
            ? WEAPONS.find(w=>w.id===lootInst.templateId)
            : COSTUMES.find(c=>c.id===lootInst.templateId);
          if(tpl){
            const RC={mythic:'#fff',legendary:'#ffd060',epic:'#c080f0',rare:'#60a8ff',uncommon:'#44cc88',common:'#a0a0a0'};
            const RL={mythic:'神器',legendary:'传说',epic:'史诗',rare:'精良',uncommon:'精品',common:'凡品'};
            const rarColor = RC[tpl.rarity]||'#aaa';
            const rarLabel = RL[tpl.rarity]||'';
            const unidNote = lootInst.identified ? '' : ' <span style="color:rgba(200,160,80,.6);font-size:9px">（未鉴定）</span>';
            lootHtml = `<div style="margin-top:8px;font-size:10px;letter-spacing:1px;color:rgba(180,160,100,.8)">
              🎁 获得掉落：<span style="color:${rarColor}">${rarLabel}</span>
              <span style="color:${tpl.color||'#ffd060'}">${tpl.name}</span>${unidNote}
            </div>`;
            log(`🎁 战利品：【${tpl.name}】[${rarLabel}]${lootInst.identified?'':'（未鉴定，前往捏脸工坊→装备栏鉴定）'}`, 'lk');
          }
        }
      }
      } // /isHumanoid
      // ── 武学秘籍掉落（额外独立判定）──
      if(typeof onBattleWinCheckManual === 'function'){
        const enemyLv = loser._stats ? (loser._stats.level || loser.level || 10) : (loser.level||10);
        const manualTier = loser._npcTier || loser.tier || 'func';
        onBattleWinCheckManual({ _stats:{ level:enemyLv }, _npcTier:manualTier });
      }
      // ── 材料/消耗品掉落（注入合成背包）──
      const dropList = loser.drops || loser._drops || [];
      let matLootLines = [];

      // ── 默认掉落表（敌人未定义 drops 时按类型自动补充）──
      const DEFAULT_DROPS_BY_TYPE = {
        beast: [
          { id:'item_copper_coin', chance:1.0, minQty:3, maxQty:10 },
          { id:'item_wolf_pelt',   chance:0.25, minQty:1, maxQty:1 },
        ],
        bandit: [
          { id:'item_copper_coin',  chance:1.0, minQty:8, maxQty:20 },
          { id:'item_crude_blade',  chance:0.12, minQty:1, maxQty:1 },
          { id:'item_bandit_token', chance:0.08, minQty:1, maxQty:1 },
        ],
        spirit: [
          { id:'item_copper_coin', chance:1.0, minQty:5, maxQty:15 },
          { id:'item_ghost_jade',   chance:0.20, minQty:1, maxQty:1 },
          { id:'item_ghost_bone',   chance:0.15, minQty:1, maxQty:2 },
        ],
        insect: [
          { id:'item_copper_coin', chance:1.0, minQty:2, maxQty:8 },
          { id:'item_venom_sac',   chance:0.22, minQty:1, maxQty:1 },
          { id:'item_snake_scale',  chance:0.18, minQty:1, maxQty:2 },
        ],
        humanoid: [
          { id:'item_copper_coin', chance:1.0, minQty:5, maxQty:18 },
          { id:'item_crude_blade',  chance:0.10, minQty:1, maxQty:1 },
        ],
      };
      // 复用上面第2457行已声明的 enemyType 变量
      const effectiveDropList = dropList.length > 0 ? dropList : (DEFAULT_DROPS_BY_TYPE[enemyType] || DEFAULT_DROPS_BY_TYPE.humanoid);

      // ── 基础银两奖励（所有胜利都给，独立于掉落列表）──
      var silverGained = 0;
      console.log('[掉落调试] === 开始计算掉落 ===');
      console.log('[掉落调试] injectDropToCraftBag 存在:', typeof injectDropToCraftBag !== 'undefined');
      console.log('[掉落调试] addSilver 存在:', typeof addSilver !== 'undefined');
      console.log('[掉落调试] ENEMY_DROP_ITEMS 存在:', typeof ENEMY_DROP_ITEMS !== 'undefined');
      console.log('[掉落调试] DUNGEON_ITEM_DB 存在:', typeof DUNGEON_ITEM_DB !== 'undefined');
      console.log('[掉落调试] loser:', JSON.stringify({name:loser.name, tier:loser.tier, level:loser.level, drops:!!(loser.drops||[]).length}));
      console.log('[掉落调试] enemyType:', enemyType);
      console.log('[掉落调试] effectiveDropList 长度:', effectiveDropList.length, effectiveDropList.map(function(d){return d.id;}));
      
      // 银两计算（不依赖 addSilver 函数）
      var baseSilver = Math.max(2, Math.round((loser.level || 1) * 2 * (1 + Math.random() * 3)));
      var tierMult = { func:1, major:1.8, elite:3, boss:6 };
      var tMult = tierMult[loser.tier || loser._npcTier || 'func'] || 1;
      silverGained = Math.round(baseSilver * tMult);
      // 连胜银两加成
      var streakSilverMult = window._streakSilverMult || 1;
      if (streakSilverMult > 1) {
        silverGained = Math.round(silverGained * streakSilverMult);
      }
      // 门派天赋银两加成
      var talentSpec = window._talentSpecials;
      if(talentSpec && talentSpec.silverMult > 1){
        silverGained = Math.round(silverGained * talentSpec.silverMult);
        log(`🌟 天赋加持，银两×${talentSpec.silverMult}！`, 'buff');
      }
      // 装备效果类词条：银两加成
      if(LH._stats && LH._stats._equipEffects && LH._stats._equipEffects.silverBoost){
        var equipSilverMult = 1 + LH._stats._equipEffects.silverBoost / 100;
        silverGained = Math.round(silverGained * equipSilverMult);
        log(`💰 装备聚财加持，银两×${equipSilverMult}！`, 'buff');
      }
      console.log('[掉落调试] 银两计算: base='+baseSilver+' tMult='+tMult+' talentSilver='+(talentSpec&&talentSpec.silverMult||1)+' → silverGained='+silverGained);
      
      // 发放银两：优先 addSilver > SilverManager > travelPlayerState > edS
      if(silverGained > 0){
        if(typeof addSilver === 'function'){
          addSilver(silverGained);
        } else if(typeof SilverManager !== 'undefined'){
          SilverManager.add(silverGained); if(SilverManager.save) SilverManager.save();
        } else if(typeof travelPlayerState !== 'undefined'){
          travelPlayerState.silver = (travelPlayerState.silver||0) + silverGained; if(typeof travelSave==='function') travelSave();
        } else if(typeof edS !== 'undefined' && edS.hasOwnProperty('silver')){
          edS.silver = (edS.silver||0) + silverGained;
        }
        console.log('[掉落调试] 银两已发放: +'+silverGained);
      }

      if(typeof injectDropToCraftBag === 'function'){
        console.log('[掉落调试] ✅ 进入掉落循环');
        effectiveDropList.forEach(drop=>{
          if(!drop.id) return;
          // ── 银两掉落（无 chance 字段，直接发放）──
          if(drop.id === 'silver'){
            const qty = Number(drop.qty) || 0;
            console.log('[掉落调试] 银两掉落项: qty='+qty);
            if(qty > 0){
              if(typeof addSilver === 'function') addSilver(qty);
              matLootLines.push(`💰银子×${qty}`);
            }
            return;
          }
          // ── 概率掉落（有 chance 字段）──
          if(drop.chance == null) return; // 无 chance 跳过
          var roll = Math.random();
          console.log('[掉落调试] 掉落判定: '+drop.id+' chance='+drop.chance+' roll='+roll.toFixed(3)+' → '+(roll<=drop.chance?'命中':'未中'));
          if(roll <= drop.chance){
            var qty2 = (drop.minQty || 1) + Math.floor(Math.random()*(Math.max(1,(drop.maxQty||1)-(drop.minQty||1)+1)));
            // 多级回查：ENEMY_DROP_ITEMS > DUNGEON_ITEM_DB > CRAFT_MATERIAL_NAMES
            var meta = null;
            if(typeof ENEMY_DROP_ITEMS !== 'undefined' && ENEMY_DROP_ITEMS[drop.id]) meta = ENEMY_DROP_ITEMS[drop.id];
            else if(typeof DUNGEON_ITEM_DB !== 'undefined' && DUNGEON_ITEM_DB[drop.id]) meta = DUNGEON_ITEM_DB[drop.id];
            else if(typeof CRAFT_MATERIAL_NAMES !== 'undefined' && CRAFT_MATERIAL_NAMES[drop.id]) meta = CRAFT_MATERIAL_NAMES[drop.id];
            console.log('[掉落调试] 元数据查询 '+drop.id+':', meta ? (meta.name || meta.id) : '(未找到)');
            injectDropToCraftBag(drop.id, qty2, meta);
            var dIcon = meta ? (meta.icon || '\uD83D\uDD38') : '\uD83D\uDD38';
            var dName = meta ? (meta.name || drop.id) : drop.id;
            matLootLines.push(dIcon+dName+'\u00D7'+qty2);
            console.log('[掉落调试] ✅ 掉落成功: '+dName+' x'+qty2);
          }
        });
      } else {
        console.log('[掉落调试] ❌ injectDropToCraftBag 不存在！所有材料掉落被跳过');
      }
      console.log('[掉落调试] matLootLines:', matLootLines.length, JSON.stringify(matLootLines));
      console.log('[掉落调试] lootHtml 当前值:', lootHtml || '(空)');
      if(matLootLines.length > 0){
        lootHtml += `<div style="margin-top:6px;font-size:10px;color:rgba(160,200,100,.8);letter-spacing:1px;">
          🎒 材料掉落：${matLootLines.join('  ')}
        </div>`;
        matLootLines.forEach(s => log(`🎒 材料：${s}`, 'lk'));
      }
    }

    // ── 成就系统触发 ──
    if(typeof achOnBattleEnd === 'function'){
      // 无伤判定（满血获胜）
      const curHpPct = (typeof window.lHp !== 'undefined' && typeof edS !== 'undefined')
        ? (window.lHp / ((edS.maxHp||100)||1)) : 1;
      if(playerWon && curHpPct >= 0.98) achOnNoDamageWin();
      // 敌人等级判定
      if(playerWon){
        const tier = loser.tier || loser._npcTier || 'func';
        if(tier === 'elite') achOnEliteKill();
        if(tier === 'boss') achOnBossKill();
      }
      achOnBattleEnd(playerWon);

      // ── 装备耐久损耗（无论胜负，每场战斗都损耗）──
      if(typeof degradeEquipOnBattleEnd === 'function'){
        const tier = loser.tier || loser._npcTier || 'func';
        // 门派天赋耐久保护
        var talentSpec = window._talentSpecials;
        var durSave = (talentSpec && talentSpec.durabilitySave > 0) ? talentSpec.durabilitySave : 0;
        degradeEquipOnBattleEnd(tier, playerWon, durSave);
        if(durSave > 0) log(`🛡 天赋加持，耐久损耗减少${durSave}%`, 'buff');
      }
    }

    // ── 城市争夺任务链：击杀检测 ──
    if(playerWon && typeof ccOnKill === 'function'){
      const killedId = loser.id || loser._npcId || '';
      const killedType = loser._enemyType || loser.type || loser.tier || '';
      const currentCity = (typeof travelPlayerState !== 'undefined' && travelPlayerState.currentCity)
        ? travelPlayerState.currentCity
        : (typeof _cityId !== 'undefined' ? _cityId : '');
      ccOnKill(killedId, killedType, currentCity);
    }

    // ── 擂台决斗任务完成检测 ──
    if(playerWon && typeof completeDuelQuest === 'function'){
      completeDuelQuest();
    }

    // ── 门派悬赏进度（击杀悬赏自动计数）──
    if(playerWon && typeof seGetActiveBounties === 'function' && typeof seAddBountyProgress === 'function'){
      var activeBounties = seGetActiveBounties();
      var killedType = loser._enemyType || loser.type || '';
      var killedId = loser.id || loser._npcId || '';
      activeBounties.forEach(function(ab){
        if(ab.bounty.type === 'kill' && ab.bounty.targetPool){
          // 检查击杀的敌人是否在悬赏目标池中
          if(ab.bounty.targetPool.indexOf(killedId) >= 0 || ab.bounty.targetPool.indexOf(killedType) >= 0){
            var result = seAddBountyProgress(ab.bounty.id, 1);
            if(result && result.type === 'complete'){
              var r = result.reward;
              log(`📋 悬赏完成：${result.bounty.icon}${result.bounty.name}！💰${r.silver||0} 🏛+${r.contrib||0} ✨${r.exp||0}`, 'lk');
              if(typeof showToast === 'function') showToast('📋 悬赏完成：' + result.bounty.name, 'ok');
            }
          }
        }
      });
    }

    // ── 宠物战斗结算 ──
    if(typeof petBattleEnd === 'function'){
      petBattleEnd(playerWon);
    }

    // ── 连击条：根据胜负显示不同内容 ──
    const bar=document.getElementById('comboBar');
    if(bar){
      if(playerWon){
        bar.textContent=`🏆 击败 ${loser?.name || '敌人'}！共 ${rounds} 回合`;
        bar.style.color='#ffd700';
        bar.style.textShadow=`0 0 20px #ffd700, 0 0 40px #ffa500, 0 0 60px rgba(255,215,0,.3)`;
      } else {
        bar.textContent=`💀 被 ${winner?.name || '敌人'} 击败...`;
        bar.style.color='#cc4444';
        bar.style.textShadow=`0 0 20px #cc4444, 0 0 40px #881111, 0 0 60px rgba(200,50,50,.3)`;
      }
      bar.style.fontSize='28px';
      bar.classList.add('on','pop');
      void bar.offsetWidth; bar.style.animation='none'; void bar.offsetWidth; bar.style.animation='';
    }

    setTimeout(()=>{
      // ── 胜负演出层（仅获胜时华丽演出，失败时跳过）──
      if(playerWon && typeof showVictoryCinematic === 'function'){
        showVictoryCinematic(winner, loser, rounds, dmgL + dmgR);
      }
      // 延迟显示结算弹窗
      setTimeout(()=>{
        // 清理野兽死亡碎片（如果存在）
        _clearBeastDeathFragments();
        
        var winTitleEl = document.getElementById('winTitle');
        var winSubEl  = document.getElementById('winSub');
        
        if(playerWon){
          // ── 胜利弹窗 ──
          if(winTitleEl) winTitleEl.textContent=`⚔️ 击败 ${loser?.name || '敌人'}`;
          if(winTitleEl) winTitleEl.style.color='#ffd700';
          if(winSubEl) winSubEl.textContent=`${loser?.name || '敌人'} 不敌落败`;
          
          const expGained = window._lastBattleExpGain || loser.exp || Math.round(10 + (loser.level||1) * 5);
          window._lastBattleExpGain = null; // 用完清除
          // 连胜信息
          var streakHtml = '';
          if (WIN_STREAK.count > 1) {
            streakHtml = `<div style="margin-top:6px;font-size:11px;letter-spacing:1px;color:rgba(255,120,50,.9)">🔥 ${WIN_STREAK.count}连胜${WIN_STREAK.best > WIN_STREAK.count ? ' (最高'+WIN_STREAK.best+'连)' : ''}</div>`;
          }
          console.log('[掉落调试] === 弹窗渲染(胜利) === silverGained='+silverGained+' lootHtml='+(lootHtml||'(空)'));
          const expHtml = `<div style="margin-top:6px;font-size:11px;letter-spacing:1px;color:rgba(100,180,255,.9)">✨ 获得经验 +${expGained}</div>`;
          const silverHtml = (typeof silverGained !== 'undefined' && silverGained > 0)
            ? `<div style="font-size:11px;letter-spacing:1px;color:rgba(255,215,100,.9)">💰 获得银两 +${silverGained}</div>`
            : '';
          const lootSectionHtml = lootHtml 
            ? `<div style="margin-top:6px;padding-top:6px;border-top:1px dashed rgba(240,192,96,.15)">${lootHtml}</div>` 
            : '';
          document.getElementById('winData').innerHTML=`共 ${rounds} 回合  ·  总伤害 ${dmgL+dmgR}${expHtml}${silverHtml}${streakHtml}${lootSectionHtml}`;
        } else {
          // ── 战败：重置连胜 ──
          WIN_STREAK.onLose();
          window._streakSilverMult = 1;
          // ── 战败弹窗：不显示经验/银两/掉落 ──
          const isArena = typeof battleMode !== 'undefined' && battleMode === 'arena';
          if(winTitleEl){
            if(isArena){
              winTitleEl.textContent=`🤝 切磋惜败`;
              winTitleEl.style.color='#c0a0e0';
            } else {
              winTitleEl.textContent=`💀 战败`;
              winTitleEl.style.color='#cc4444';
            }
          }
          if(winSubEl){
            if(isArena){
              winSubEl.textContent=`${winner?.name || '对手'} 技高一筹，再接再厉`;
            } else {
              winSubEl.textContent=`你被 ${winner?.name || '敌人'} 击败了`;
            }
          }
          if(isArena){
            document.getElementById('winData').innerHTML=`<div style="padding:12px 0;color:rgba(180,160,220,.7);font-size:12px;letter-spacing:1px">
              共 ${rounds} 回合  ·  点到为止，气血已恢复
            </div>`;
          } else {
            document.getElementById('winData').innerHTML=`<div style="padding:12px 0;color:rgba(200,160,140,.7);font-size:12px;letter-spacing:1px">
              共 ${rounds} 回合  ·  江湖险恶，再接再厉
            </div>`;
          }
        }
        document.getElementById('winLayer').classList.add('on');
      }, playerWon ? 2500 : 1200);
    },800);
  }
}
function closeWin(){document.getElementById('winLayer').classList.remove('on');}

// ── 背包面板渲染 ─────────────────────────────────
function renderBagPanel(){
  const el = document.getElementById('bagPanel');
  if(!el) return;
  const bag = edS.bag||[];
  // 分类：装备实例 / 消耗品
  const equipInsts = bag.filter(i=>i.type==='weapon'||i.type==='costume'||i.type==='accessory');
  const consumables = (typeof consumableBagLoad === 'function') ? consumableBagLoad() : [];

  let html = '';

  // ── 装备列表 ──
  if(equipInsts.length === 0 && consumables.length === 0){
    el.innerHTML = `<div style="text-align:center;padding:24px 0;color:rgba(180,150,80,.4);font-size:11px;letter-spacing:2px">
      背 包 空 空<br><span style="font-size:9px;opacity:.6;margin-top:4px;display:block">在武斗场中以自创角色获胜，可获得装备掉落</span>
    </div>`;
    return;
  }

  const RC={mythic:'#fff',legendary:'#ffd060',epic:'#c080f0',rare:'#60a8ff',uncommon:'#44cc88',common:'#a0a0a0'};
  const RL={mythic:'神器',legendary:'传说',epic:'史诗',rare:'精良',uncommon:'精品',common:'凡品'};

  // ── 装备实例（武器/服装/配饰）──
  equipInsts.forEach(inst=>{
    let tpl = null;
    if(inst.type==='weapon')    tpl = WEAPONS.find(w=>w.id===inst.templateId);
    else if(inst.type==='costume') tpl = COSTUMES.find(c=>c.id===inst.templateId);
    else if(inst.type==='accessory'){
      if(typeof ACCESSORIES !== 'undefined') tpl = ACCESSORIES.find(a=>a.id===inst.templateId);
    }
    if(!tpl) return '';

    const rarColor = RC[tpl.rarity]||'#aaa';
    const rarLabel = RL[tpl.rarity]||'';
    let icon, typeLabel, equipBtn, extraInfo;

    if(inst.type==='accessory'){
      icon = tpl.icon||'🎴';
      typeLabel = '配饰';
      const isEquip = edS.accessoryInstId === inst.instId;
      equipBtn = isEquip
        ? `<div class="bag-action-btn unequip" onclick="bagEquipAccessory(null)">卸下</div>`
        : `<div class="bag-action-btn equip" onclick="bagEquipAccessory('${inst.instId}')">装备</div>`;
      // 配饰显示蛐蛐笼属性
      const cs = tpl.cageStats||{};
      const statParts = [];
      if(cs.staminaRegen > 0) statParts.push(`体力恢复+${cs.staminaRegen}`);
      if(cs.hpRegen > 0)      statParts.push(`血量恢复+${cs.hpRegen}`);
      if(cs.speedBoost > 0)   statParts.push(`蛐蛐攻/防/速+${cs.speedBoost}`);
      extraInfo = statParts.length
        ? `<div style="font-size:9px;color:#80c040;margin-top:2px">🦗 ${statParts.join(' · ')}</div>`
        : '';
    } else {
      icon = inst.type==='weapon' ? getWepMiniSymbol(tpl.cat) : getCosMiniSymbol(tpl);
      typeLabel = inst.type==='weapon' ? '武器' : '服装';
      const isEquip = (inst.type==='weapon' && edS.weaponInstId===inst.instId)
                    || (inst.type==='costume' && edS.costumeInstId===inst.instId);
      equipBtn = isEquip
        ? `<div class="bag-action-btn unequip" onclick="${inst.type==='weapon'?'cpEquipWeapon(null)':'cpEquipCostume(null)'}">卸下</div>`
        : `<div class="bag-action-btn equip" onclick="${inst.type==='weapon'?`cpEquipWeapon('${inst.instId}')`:`cpEquipCostume('${inst.instId}')`}">装备</div>`;
      extraInfo = '';
    }

    const affixHtml = inst.identified && inst.affixes?.length
      ? renderAffixesHtml(inst.affixes, true)
      : '';
    // 强化等级标签
    const enhLvNum = inst._enhLv || 0;
    const enhColor = enhLvNum>=8?'#ffd060':enhLvNum>=5?'#ff8040':enhLvNum>=3?'#80e080':'#80c0a0';
    const enhTag = enhLvNum > 0
      ? `<span style="color:${enhColor};font-size:9px;font-weight:900;margin-left:4px"> +${enhLvNum}</span>`
      : '';
    const equipBadge = (inst.type==='weapon' && edS.weaponInstId===inst.instId)
                     || (inst.type==='costume' && edS.costumeInstId===inst.instId)
                     || (inst.type==='accessory' && edS.accessoryInstId===inst.instId)
      ? `<span style="color:#80ff90;font-size:8px;letter-spacing:1px"> ✓装备中</span>` : '';

    html += `<div class="bag-item${edS.accessoryInstId===inst.instId||edS.weaponInstId===inst.instId||edS.costumeInstId===inst.instId?' equipped':''}" style="--bi-color:${rarColor}">
      <div class="bag-item-icon" style="color:${tpl.color||rarColor};font-family:'Courier New',monospace;font-size:18px;font-weight:900">${icon}</div>
      <div class="bag-item-info">
        <div class="bag-item-name" style="color:${tpl.color||'#e8d090'}">${tpl.name}${enhTag}
          <span style="color:${rarColor};font-size:8px;letter-spacing:1px">【${rarLabel}】</span>
          <span style="color:rgba(140,120,80,.5);font-size:8px">${typeLabel}</span>
          ${equipBadge}
        </div>
        ${extraInfo}
        <div class="bag-item-affixes">${affixHtml}</div>
      </div>
      <div class="bag-item-actions">
        ${!inst.identified&&inst.type!=='accessory'?`<div class="bag-action-btn identify" onclick="identifyInst('${inst.instId}')">鉴定</div>`:''}
        ${equipBtn}
        ${inst.type === 'accessory' && typeof CG !== 'undefined' && CG.squad && CG.squad.length > 0
          ? `<div class="bag-action-btn drop" style="opacity:.4;cursor:not-allowed" title="笼中有蛐蛐，请先移出">丢弃</div>`
          : `<div class="bag-action-btn drop" onclick="bagDropItem('${inst.instId}')">丢弃</div>`}
      </div>
    </div>`;
  });

  // ── 消耗品列表（合成产出的药品/道具）──
  if(consumables.length > 0){
    html += `<div style="font-size:10px;color:rgba(180,150,80,.5);letter-spacing:2px;margin:12px 0 6px 4px;border-top:1px solid rgba(180,150,80,.1);padding-top:10px">🧪 已合成道具</div>`;
    consumables.forEach(item=>{
      html += `<div class="bag-item" style="--bi-color:#60c880">
        <div class="bag-item-icon" style="color:#60c880;font-family:'Courier New',monospace;font-size:18px;font-weight:900">${item.icon||'💊'}</div>
        <div class="bag-item-info">
          <div class="bag-item-name" style="color:#90d890">${item.name}
            <span style="color:rgba(140,120,80,.5);font-size:8px">【消耗品】</span>
          </div>
          <div style="font-size:9px;color:rgba(140,120,80,.6);margin-top:2px">${item.desc||''}</div>
        </div>
        <div class="bag-item-actions">
          <div class="bag-action-btn" style="background:rgba(30,100,40,.4);color:#90ff90" onclick="craftUseItem('${item.id}')">使用</div>
        </div>
      </div>`;
    });
  }

  el.innerHTML = html;
}

// 装备/卸下配饰（蛐蛐笼）
function bagEquipAccessory(instId){
  edS.accessoryInstId = instId || null;
  bagSave();
  renderBagPanel();
  // 同步刷新炼物阁（蛐蛐笼容量）
  if(typeof refreshCageSlots === 'function') refreshCageSlots();
  if(typeof renderCraftPage === 'function') renderCraftPage();
}

/** 丢弃背包物品 */
function bagDropItem(instId){
  const inst = bagFindInst(instId);
  if(!inst) return;
  let tpl = null;
  if(inst.type==='weapon')    tpl = WEAPONS.find(w=>w.id===inst.templateId);
  else if(inst.type==='costume') tpl = COSTUMES.find(c=>c.id===inst.templateId);
  else if(inst.type==='accessory') tpl = (typeof ACCESSORIES !== 'undefined') ? ACCESSORIES.find(a=>a.id===inst.templateId) : null;
  // 蛐蛐笼有蛐蛐时禁止丢弃
  if(inst.type==='accessory' && typeof CG !== 'undefined' && CG.squad && CG.squad.length > 0){
    showToast('🦗 笼中还有蛐蛐，请先将它们移出阵容！');
    return;
  }
  if(!confirm(`确定丢弃【${tpl?.name||'未知装备'}】？此操作不可撤销。`)) return;
  if(edS.weaponInstId===instId) edS.weaponInstId=null;
  if(edS.costumeInstId===instId) edS.costumeInstId=null;
  if(edS.accessoryInstId===instId) edS.accessoryInstId=null;
  bagRemoveInst(instId);
  renderBagPanel();
  cpRefreshWeaponSelector();
  cpRefreshCostumeSelector();
}



// toggleAuto 已移除 - 纯卡牌战斗模式

// ── 技能帧动画 ──
// 自定义角色（ft-animated）使用CSS class驱动；内置角色使用文本帧切换
function animFighter(el, frames, stand, color, atkType){
  if(!el) return;
  
  // 清理该元素上正在进行的动画
  if(el._animTimer) {
    clearInterval(el._animTimer);
    el._animTimer = null;
  }
  if(el._animTimeout) {
    clearTimeout(el._animTimeout);
    el._animTimeout = null;
  }
  // 如果有保存的HTML，先恢复
  if(el._savedHtml !== undefined) {
    el.innerHTML = el._savedHtml;
    el._savedHtml = undefined;
  }
  // 确保基础类名正确
  if(!el.classList.contains('ft-animated')) {
    el.className = 'fighter ft-animated';
  }
  
  // ft-animated 角色
  if(el.classList.contains('ft-animated')){
    // 敌人：有文本帧数据，临时切为文本帧动画，结束后恢复部件结构
    if(el.dataset.isEnemy === '1' && frames && frames.length){
      const dur = atkType==='heavy' ? 680 : 560;
      // 保存部件HTML
      el._savedHtml = el.innerHTML;
      // 切为纯文本模式播放帧
      el.classList.remove('ft-animated');
      el.style.whiteSpace = 'pre';
      let i = 0;
      el._animTimer = setInterval(()=>{
        el.textContent = frames[i % frames.length];
        el.style.color = color;
        el.style.filter = `drop-shadow(0 0 10px ${color})`;
        i++;
        if(i >= frames.length * 2){
          clearInterval(el._animTimer);
          el._animTimer = null;
          // 恢复部件结构 - 清除所有动画类避免姿态异常
          el.className = 'fighter ft-animated';
          el.style.whiteSpace = '';
          if(el._savedHtml !== undefined) {
            el.innerHTML = el._savedHtml;
            el._savedHtml = undefined;
          }
        }
      }, 110);
      // 设置超时保护，确保即使被打断也能恢复
      el._animTimeout = setTimeout(()=>{
        if(el._animTimer) {
          clearInterval(el._animTimer);
          el._animTimer = null;
        }
        el.className = 'fighter ft-animated';
        el.style.whiteSpace = '';
        if(el._savedHtml !== undefined) {
          el.innerHTML = el._savedHtml;
          el._savedHtml = undefined;
        }
      }, dur + 200);
      return;
    }
    // 普通玩家/NPC：用CSS class产生攻击动画，不破坏分部件HTML
    const cls = atkType==='heavy' ? 'pv-heavy' : 'pv-atk';
    el.classList.remove('pv-atk','pv-heavy');
    void el.offsetWidth; // reflow
    el.classList.add(cls);
    setTimeout(()=>{
      el.classList.remove('pv-atk','pv-heavy');
      // 重启各子部件动画
      el.querySelectorAll('.ft-head,.ft-body,.ft-arm-l,.ft-arm-r,.ft-legs,.ft-aura').forEach(sub=>{
        sub.style.animation='none';
        void sub.offsetWidth;
        sub.style.animation='';
      });
    }, atkType==='heavy' ? 680 : 560);
    return;
  }
  // 内置角色：文本帧切换
  if(!frames||!frames.length) return;
  let i=0;
  const t=setInterval(()=>{
    el.textContent=frames[i%frames.length];
    el.style.color=color;
    el.style.filter=`drop-shadow(0 0 8px ${color})`;
    i++;
    if(i>=frames.length*2){clearInterval(t);el.textContent=stand;el.style.color=color;}
  },110);
}

// ── 技能执行 ──
function execSkill(sk,side){
  if(!sk) return;
  const isSelf=(side==='l');
  const atker=isSelf?LH:RH;
  const dfer=isSelf?RH:LH;
  const atkSt=isSelf?lSt:rSt;
  const defSt=isSelf?rSt:lSt;
  const atkEl=document.getElementById(isSelf?'fL':'fR');
  const defEl=document.getElementById(isSelf?'fR':'fL');
  if(atkSt.silence>0){ log(`${atker.name}被沉默，无法使用技能！`,'lm'); return; }
  // 卡牌模式下不检查技能冷却，由卡牌系统管理
  const _cardMode = typeof CardSystem !== 'undefined' && CardSystem.active;
  if(!_cardMode && (cds[sk.id]||0)>0){ log(`技能冷却中！`,'lm'); return; }
  // ── 熟练度：顿悟判断（仅玩家技能）──
  const _isPlayer = isSelf && atker.id === 'cp_self';
  let _enlightened = false;
  if(_isPlayer && typeof tryEnlighten === 'function'){
    _enlightened = tryEnlighten(sk.school);
  }
  // 计算实际CD（含熟练度缩减）
  const _cdReduce = (_isPlayer && typeof getProfCdReduce === 'function') ? getProfCdReduce(sk.school) : 0;
  const _actualCd = _enlightened ? 0 : Math.max(1, Math.round(sk.cd * (1 - _cdReduce)));
  cds[sk.id] = _actualCd;
  if(_enlightened && typeof showEnlightenEffect === 'function'){
    showEnlightenEffect(sk.name, sk.school);
  }
  // ── 武器适配判断 ──
  const wepMatch = checkWepSkillMatch(atker.id, sk.school);
  const wepMult  = WEP_SKILL_MULT[wepMatch] || 1.0;
  const wepTip   = WEP_SKILL_TIP[wepMatch];
  if(wepTip && wepTip.text) log(`${wepTip.icon} ${atker.name}【${sk.school}·${sk.name}】${wepTip.text}`, wepTip.cls);
  // ── 服装系别加成 ──
  const _cosSB = atkSt._cosSchoolBonus || {};
  const cosMult = 1 + (_cosSB[sk.school] || 0);
  // ── 熟练度伤害倍率（仅玩家技能）──
  const profMult = (_isPlayer && typeof getProfMult === 'function') ? getProfMult(sk.school) : 1.0;
  // ── 技能博弈系统：学派克制 ──
  let counterMult = 1.0;
  let counterResult = null;
  let counterText = '';
  // 获取双方学派
  const atkSchoolKey = getSchoolKeyByName(sk.school) || 'common';
  const defSkills = dfer.skills || [];
  // 检查防守方是否有正在生效的学派状态（简化：取对方最后使用的技能学派）
  const defLastSkill = defSkills[0]; // 简化处理，实际可用更复杂的追踪
  const defSchoolKey = defLastSkill ? (getSchoolKeyByName(defLastSkill.school) || 'common') : 'common';
  // 计算博弈关系
  if (typeof checkSkillCounter === 'function' && atkSchoolKey !== defSchoolKey) {
    counterResult = checkSkillCounter(atkSchoolKey, defSchoolKey);
    counterMult = counterResult.multiplier;
    counterText = counterResult.text;
    // 显示博弈提示
    if (counterText) {
      const counterColor = counterResult.result === 'win' ? '#ff6b6b' :
                          counterResult.result === 'lose' ? '#6b9eff' : '#ffd93d';
      log(`⚔️ 【${getSchoolName(atkSchoolKey)}】vs【${getSchoolName(defSchoolKey)}】 ${counterText}`, 'lm');
      // 克制成功时增加气势
      if (counterResult.result === 'win' && typeof changeMomentum === 'function') {
        changeMomentum(10);
      }
      // 被克制时减少气势
      if (counterResult.result === 'lose' && typeof changeMomentum === 'function') {
        changeMomentum(-5);
      }
    }
  }

  // ── 属性差异化 Scaling（根骨五维驱动版）──
  // 优先读取 primaryPts（玩家），NPC用战斗属性反推
  const _atkSt  = atker._stats || {};
  const _defSt  = dfer._stats  || {};
  const _totalAtk   = _atkSt.totalAtk  || (atker.atk + (atker._wepAtk||0));
  const _totalDef   = _atkSt.totalDef  || atker.def || 10;
  const _totalSpd   = _atkSt.totalSpd  || (atker.speedN||8);
  const _totalMp    = _atkSt.totalMp   || (atker.maxMp||150);
  const _totalDodge = _atkSt.totalDodge|| 0;
  const _totalCrit  = _atkSt.totalCrit || 0.10;

  // 读取根骨原始值
  // 玩家：直接从 edS.primaryPts 取
  // NPC ：优先从 inst.stats.primaryPts 取（已按tier专精化），缺失时才反推
  let _pts;
  if(_isPlayer && typeof edS !== 'undefined' && edS.primaryPts){
    _pts = edS.primaryPts;
  } else if(atker._primaryPts){
    // NPC 战斗对象上直接挂载了五维（由 prepareNpcFighter 提前写入）
    _pts = atker._primaryPts;
  } else {
    // fallback：从战斗属性反推（精度较低，仅用于无 inst 的临时NPC）
    _pts = {
      vigor: Math.round(_totalAtk / 1.5 * 0.4),
      tough: Math.round(_totalDef / 1.2 * 0.4),
      swift: Math.round(_totalSpd / 0.35 * 0.3),
      inner: Math.round(_totalMp  / 6   * 0.4),
      will:  Math.round(_totalCrit * 100 / 0.4 * 0.3),
    };
  }
  const _pVigor = _pts.vigor || 0;  // 劲力（影响力系/拳系/火系）
  const _pTough = _pts.tough || 0;  // 体魄（影响佛系/圣系）
  const _pSwift = _pts.swift || 0;  // 身法（影响剑系/风系/暗系/道系）
  const _pInner = _pts.inner || 0;  // 内息（影响毒系/冰系/琴系/奇门）
  const _pWill  = _pts.will  || 0;  // 心志（影响雷系/命系/道系）

  // ── 按系别计算属性加成倍率（statMult）──
  // 设计原则：每个系别绑定1-2个根骨属性，加点越专一，该系加成越高
  // 基础加成范围：0%~60%（低点数）→0%~30%（高点数需合理投入）
  // 上限统一为50%（极限流派build）
  let statMult = 1.0;
  let statTip  = '';
  const sc = sk.school;

  if(sc==='力系'||sc==='拳系'){
    // ★主驱：劲力（力量型核心），次驱：体魄
    // 劲力每5点+4%，体魄每10点+2%，上限50%
    const bonus = Math.min(0.50, _pVigor * 0.008 + _pTough * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `💪劲力加成+${Math.round(bonus*100)}%`;

  } else if(sc==='剑系'){
    // ★主驱：身法（剑走偏锋），次驱：心志（意志一剑）
    // 身法每5点+3.5%，心志每10点+2%，上限50%
    const bonus = Math.min(0.50, _pSwift * 0.007 + _pWill * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `⚔身法+${Math.round(bonus*100)}%`;

  } else if(sc==='道系'){
    // ★主驱：内息（内家心法），次驱：身法（凌波微步）
    // 内息每5点+3%，身法每5点+2%，上限50%
    const bonus = Math.min(0.50, _pInner * 0.006 + _pSwift * 0.005);
    statMult += bonus;
    if(bonus>0.01) statTip = `☯内息+${Math.round(bonus*100)}%`;

  } else if(sc==='佛系'){
    // ★主驱：体魄（金刚不坏），次驱：心志（慈悲之念）
    // 体魄每5点+4%，心志每10点+2%，上限45%
    const bonus = Math.min(0.45, _pTough * 0.008 + _pWill * 0.004);
    statMult += bonus;
    if(bonus>0.01) statTip = `🛡体魄+${Math.round(bonus*100)}%`;

  } else if(sc==='圣系'){
    // ★主驱：心志（圣战信念），次驱：体魄（圣光护体）
    // 心志每5点+4%，体魄每10点+2%，上限50%
    const bonus = Math.min(0.50, _pWill * 0.008 + _pTough * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `✦心志+${Math.round(bonus*100)}%`;

  } else if(sc==='毒系'){
    // ★主驱：内息（毒术运气），次驱：身法（入毒无迹）
    // 内息每5点+3%，身法每5点+2%，上限45%
    const bonus = Math.min(0.45, _pInner * 0.007 + _pSwift * 0.004);
    statMult += bonus;
    if(bonus>0.01) statTip = `🐍内息+${Math.round(bonus*100)}%`;

  } else if(sc==='暗系'){
    // ★主驱：身法（影随人动），次驱：内息（暗劲蓄力）
    // 身法每5点+4%，内息每10点+2%，上限50%
    const bonus = Math.min(0.50, _pSwift * 0.009 + _pInner * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `🌑身法+${Math.round(bonus*100)}%`;

  } else if(sc==='冰系'){
    // ★主驱：内息（寒气内力），次驱：心志（冰心玉壶）
    // 内息每5点+3.5%，心志每10点+2%，上限45%
    const bonus = Math.min(0.45, _pInner * 0.007 + _pWill * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `❄内息+${Math.round(bonus*100)}%`;

  } else if(sc==='火系'){
    // ★主驱：劲力（爆发力），次驱：心志（燃烧意志）
    // 劲力每5点+3.5%，心志每5点+3%，上限50%
    const bonus = Math.min(0.50, _pVigor * 0.007 + _pWill * 0.006);
    statMult += bonus;
    if(bonus>0.01) statTip = `🔥劲力+${Math.round(bonus*100)}%`;

  } else if(sc==='雷系'){
    // ★主驱：心志（雷霆意志），次驱：劲力（劲力震荡）
    // 心志每5点+4%，劲力每10点+2%，上限50%
    const bonus = Math.min(0.50, _pWill * 0.008 + _pVigor * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `⚡心志+${Math.round(bonus*100)}%`;

  } else if(sc==='风系'){
    // ★主驱：身法（如风而行），次驱：内息（气流御风）
    // 身法每5点+4%，内息每10点+2%，上限50%
    const bonus = Math.min(0.50, _pSwift * 0.008 + _pInner * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `💨身法+${Math.round(bonus*100)}%`;

  } else if(sc==='琴系'){
    // ★主驱：内息（音出内力），次驱：心志（心音共鸣）
    // 内息每5点+3%，心志每5点+2.5%，上限45%
    const bonus = Math.min(0.45, _pInner * 0.006 + _pWill * 0.005);
    statMult += bonus;
    if(bonus>0.01) statTip = `🎵内息+${Math.round(bonus*100)}%`;

  } else if(sc==='奇门系'){
    // ★主驱：内息（奇门内功），次驱：身法（布阵奇步）
    // 内息每5点+3%，身法每5点+2.5%，上限45%
    const bonus = Math.min(0.45, _pInner * 0.006 + _pSwift * 0.005);
    statMult += bonus;
    if(bonus>0.01) statTip = `🔮内息+${Math.round(bonus*100)}%`;

  } else if(sc==='命系'){
    // ★主驱：心志（命由心造），次驱：内息（天命玄机）
    // 心志每5点+4%，内息每10点+2%，上限50%
    const bonus = Math.min(0.50, _pWill * 0.008 + _pInner * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `🌟心志+${Math.round(bonus*100)}%`;

  } else if(sc==='通用'){
    // 通用技能：取五维中最高属性，按一半效率计算，上限25%
    const maxPts = Math.max(_pVigor, _pTough, _pSwift, _pInner, _pWill);
    const bonus  = Math.min(0.25, maxPts * 0.003);
    statMult += bonus;
    if(bonus>0.01) statTip = `✧综合+${Math.round(bonus*100)}%`;
  }

  if(statTip && isSelf) log(`  ✦ ${statTip}`, 'lm');

  // ── 内力消耗（MP Cost）──
  // 技能MP消耗 = cd × 4（最少5，最多60），内力不足时伤害-40%但仍可使用
  const _mpCost = sk.mpCost !== undefined ? sk.mpCost : Math.min(60, Math.max(5, Math.round((sk.cd||1) * 4)));
  const _curMp  = isSelf ? lMp : rMp;
  let _mpPenalty = 1.0;
  if(_curMp < _mpCost){
    _mpPenalty = 0.60; // 内力不足，伤害-40%
    log(`💙 ${atker.name}内力不足（${Math.round(_curMp)}/${_mpCost}），技能威力下降！`, 'lm');
  }
  // 扣内力
  if(isSelf){ lMp = Math.max(0, lMp - _mpCost); }
  else       { rMp = Math.max(0, rMp - _mpCost); }
  updateMpBars();
  animFighter(atkEl,sk.frames||[atker.stand],atker.stand,atker.color,'skill');
  showSkillBig(sk.bigText,sk.bigColor||atker.color);
  playSound(sk.sfx||'skill');
  flash('blue'); screenShake(sk.type==='execute'||sk.type==='stun');
  // ── 技能大招电影演出（仅玩家主动使用，且为高CD/特殊类型技能）──
  if(isSelf && typeof showSkillCinematic === 'function'){
    const _isBigSkill = sk.cd >= 4 || sk.type === 'execute' || sk.type === 'stun' || sk.type === 'absorb';
    if(_isBigSkill){
      showSkillCinematic({ side:'l', skillName: sk.name, school: sk.school || '', type: sk.type || '', isCrit: false });
    }
  }
  // 按技能音效类型分发彩色粒子
  ({ice:()=>sparksIce(atkEl),fire:()=>sparksFire(atkEl),thunder:()=>sparksThunder(atkEl),
    poison:()=>sparksPoison(atkEl),dark:()=>sparksDark(atkEl),wind:()=>sparksWind(atkEl),
    holy:()=>sparksHoly(atkEl),rage:()=>sparksFire(atkEl),blood:()=>sparksBlood(atkEl),
    heavy:()=>sparks(atkEl,16),skill:()=>sparks(atkEl,12),hit:()=>sparks(atkEl,8),
    shield:()=>sparksHoly(atkEl),heal:()=>sparksHoly(atkEl),
  }[sk.sfx]||(() => sparks(atkEl,12)))();
  // ── 熟练度积累（仅玩家，技能使用时） ──
  if(_isPlayer && typeof addProficiency === 'function'){
    const _targetLv = (typeof dfer !== 'undefined') ? (dfer.level || dfer._stats?.level || 10) : 10;
    addProficiency(sk.school, calcProfGain(sk, _targetLv));
    // 刷新技能栏显示（熟练度星级可能更新）
    setTimeout(()=>{ if(typeof renderSkillBar === 'function') renderSkillBar(); }, 50);
  }
  // 效果处理
  if(sk.type==='damage'||sk.type==='execute'||sk.type==='stun'){
    // ── 听牌超级增幅：获取加成倍率 ──
    let superMult = 1.0;
    if(isSelf && typeof CardSystem !== 'undefined' && CardSystem.active){
      superMult = CardSystem.getSuperMult(sk.school || '通用');
    }
    const hits=sk.hits||1;
    let totalDmg=0;
    for(let i=0;i<hits;i++){
      const {dmg,isCrit}=calcDmg(
        _totalAtk,   // ✅ 使用综合攻击力（含服装/词条）
        atkSt,defSt,
        {mult:(sk.multiplier||1)*wepMult*cosMult*profMult*statMult*counterMult*_mpPenalty*superMult,
         forceCrit:sk.forceCrit,ignoreDefense:sk.ignoreDefense,ignoreAll:sk.ignoreAll}
      );
      const {finalDmg,shielded}=applyDmg(isSelf?'r':'l',dmg,{ignoreShield:sk.ignoreShield||sk.ignoreAll,ignoreAll:sk.ignoreAll});
      totalDmg+=finalDmg;
      // ── 听牌触发时浮动文字 ──
      const critStr = (isCrit&&hits===1) ? `${sk.name}! ${finalDmg}` : (hits>1 ? finalDmg : finalDmg);
      const dmgClass = (isCrit&&sk.type==='execute') ? 'ds' : isCrit ? 'dc' : 'dn';
      floatDmg(defEl, critStr, dmgClass);
      if(superMult > 1 && typeof window !== 'undefined'){
        window.showTingpaiDmgFloat && window.showTingpaiDmgFloat(defEl, superMult);
      }
    }
    // ── 听牌消费：技能执行完毕后，若为同学校则消耗听牌状态 ──
    if(isSelf && typeof CardSystem !== 'undefined' && CardSystem.active){
      const consumed = CardSystem.consumeTingpai(sk.school || '通用');
      if(consumed && typeof showToast === 'function'){
        showToast(`💥 听牌爆发！${sk.school}系伤害×${CARD_BALANCE.superMultValue}！`);
      }
    }
    // 眩晕
    if(sk.type==='stun'&&(sk.stunChance===undefined||Math.random()<(sk.stunChance||1))){
      defSt.stun=sk.stunDur||2;
      log(`${dfer.name}被眩晕 ${sk.stunDur||2} 秒！`,'ld');
    }
    // 处决加成
    if(sk.type==='execute'&&sk.execBonus){
      const defCurHp=isSelf?rHp:lHp;
      const defMaxHp=dfer.maxHp;
      if(defCurHp/defMaxHp<.3){
        const extra=Math.round(atker.atk*sk.execBonus);
        if(isSelf){rHp-=extra; window.rHp=rHp;} else {lHp-=extra; window.lHp=lHp;}
        totalDmg+=extra;
        floatDmg(defEl,`+${extra}`,'ds');
        log(`处决加成 +${extra}！`,'ls');
      }
    }
    // 自伤
    if(sk.selfDmgPct){
      const sd=Math.round(atker.maxHp*sk.selfDmgPct);
      if(isSelf){lHp-=sd; window.lHp=lHp;} else {rHp-=sd; window.rHp=rHp;}
      floatDmg(atkEl,`-${sd}`,'dn');
    }
    blink(defEl); knockback(defEl,isSelf?'r':'l');
    log(`${atker.name} 【${sk.name}】→ ${hits>1?`${hits}次共`:''} ${totalDmg} 伤害`,'ls');
  }
  if(sk.type==='heal'||(sk.healPct&&sk.type!=='damage')){
    // 治疗量：熟练度+属性缩放（佛/圣/道系额外受 statMult 加成）
    const _healStatMult = (sc==='佛系'||sc==='圣系'||sc==='道系') ? statMult : 1.0;
    const heal=Math.round(atker.maxHp*(sk.healPct||.2) * profMult * _healStatMult);
    if(isSelf){lHp=Math.min(LH._maxHpFull||LH.maxHp,lHp+heal); window.lHp=lHp;} else {rHp=Math.min(RH._maxHpFull||RH.maxHp,rHp+heal); window.rHp=rHp;}
    floatDmg(atkEl,`+${heal}`,'dh'); flash('green');
    log(`${atker.name} 【${sk.name}】回复 ${heal} 气血`,'lh');
    if(sk.cleanse){ atkSt.poison=0; atkSt.stun=0; atkSt.atkBuff=Math.max(0,atkSt.atkBuff); atkSt.defBuff=Math.max(0,atkSt.defBuff); log(`清除负面状态`,'lh'); }
    if(sk.multiplier){ // 治疗+伤害
      const {dmg}=calcDmg(_totalAtk,atkSt,defSt,{mult:sk.multiplier*profMult*statMult*_mpPenalty});
      const {finalDmg}=applyDmg(isSelf?'r':'l',dmg);
      floatDmg(defEl,finalDmg,'dn'); blink(defEl);
      log(`同时对 ${dfer.name} 造成 ${finalDmg} 伤害`,'ln');
    }
  }
  if(sk.type==='shield'){
    atkSt.shield=sk.shieldDur||4;
    atkSt.shieldHits=sk.shieldHits||0;
    atkSt.shieldAbs=sk.shieldAbs||0;
    if(sk.reflectPct) atkSt.reflectPct=sk.reflectPct;
    flash('blue'); playSound('shield');
    log(`${atker.name} 【${sk.name}】获得护盾！`,'ld');
  }
  if(sk.type==='dot'||sk.dotDmg){
    if(!sk.hits){// 纯dot
      const doApply=sk.dotChance===undefined||Math.random()<(sk.dotChance||1);
      if(doApply){
        defSt.poison=sk.dotDur||5; defSt.poisonDmg=sk.dotDmg||.04;
        if(sk.uncleansable) defSt.uncleansable=true;
        floatDmg(defEl,'🐍中毒！','dp');
        log(`${dfer.name}陷入中毒状态！每回合损失 ${Math.round((sk.dotDmg||.04)*100)}% 气血，持续 ${sk.dotDur||5} 回合`,'lp');
      }
    }
  }
  if(sk.type==='buff'){
    if(sk.reflect){ atkSt.reflect=true; log(`${atker.name} 【${sk.name}】准备反弹攻击！`,'ld'); }
    if(sk.atkBuff){ atkSt.atkBuff=(atkSt.atkBuff||0)+sk.atkBuff; atkSt.atkBuffTurns=sk.buffDur||4; log(`${atker.name} 攻击力+${Math.round(sk.atkBuff*100)}%`,'ls'); }
    if(sk.defBuff){ atkSt.defBuff=(atkSt.defBuff||0)+sk.defBuff; atkSt.defBuffTurns=sk.buffDur||4; log(`${atker.name} 防御力+${Math.round(sk.defBuff*100)}%`,'ls'); }
    if(sk.defDebuff){ atkSt.defBuff=(atkSt.defBuff||0)-sk.defDebuff; log(`${atker.name} 防御力-${Math.round(sk.defDebuff*100)}%`,'ln'); }
    if(sk.atkDebuffE){ defSt.atkBuff=(defSt.atkBuff||0)-sk.atkDebuffE; log(`${dfer.name} 攻击力-${Math.round(sk.atkDebuffE*100)}%`,'ln'); }
    if(sk.reflectPct){ atkSt.reflectPct=sk.reflectPct; log(`${atker.name} 获得 ${Math.round(sk.reflectPct*100)}% 反伤！`,'ls'); }
    if(sk.healPct){ const h=Math.round(atker.maxHp*sk.healPct); if(isSelf){lHp=Math.min(LH._maxHpFull||LH.maxHp,lHp+h); window.lHp=lHp;}else{rHp=Math.min(RH._maxHpFull||RH.maxHp,rHp+h); window.rHp=rHp;} floatDmg(atkEl,`+${h}`,'dh'); }
    if(sk.silenceEnemy){ defSt.silence=sk.silenceEnemy; log(`${dfer.name}被沉默 ${sk.silenceEnemy} 秒！`,'ld'); }
    if(sk.atkBuff&&sk.defDebuff){ atkSt.fury=true; atkSt.furyTurns=sk.buffDur||4; log(`${atker.name}陷入狂怒！攻↑防↓`,'lc'); }
  }
  if(sk.type==='debuff'){
    if(sk.multiplier){const {dmg}=calcDmg(_totalAtk,atkSt,defSt,{mult:sk.multiplier*statMult*_mpPenalty});const {finalDmg}=applyDmg(isSelf?'r':'l',dmg);blink(defEl);floatDmg(defEl,finalDmg,'dn');log(`${atker.name} 【${sk.name}】造成 ${finalDmg} 伤害`,'ls');}
    if(sk.atkDebuff){ defSt.atkBuff=(defSt.atkBuff||0)-sk.atkDebuff; defSt.atkBuffTurns=sk.debuffDur||4; log(`${dfer.name} 攻击力-${Math.round(sk.atkDebuff*100)}%`,'ln'); }
    if(sk.defDebuff){ defSt.defBuff=(defSt.defBuff||0)-sk.defDebuff; defSt.defBuffTurns=sk.debuffDur||4; log(`${dfer.name} 防御力-${Math.round(sk.defDebuff*100)}%`,'ln'); }
    if(sk.atkBuff&&sk.target==='enemy'){ defSt.atkBuff=(defSt.atkBuff||0)+sk.atkBuff; defSt.defBuff=(defSt.defBuff||0)-sk.defDebuff; defSt.fury=true; log(`${dfer.name}陷入狂怒（攻↑防↓）！`,'lc'); }
    if(sk.stunDur){ defSt.stun=sk.stunDur; log(`${dfer.name}被眩晕 ${sk.stunDur} 秒！`,'ld'); }
    if(sk.dotDmg&&sk.dotDur){ defSt.poison=sk.dotDur; defSt.poisonDmg=sk.dotDmg; log(`${dfer.name}中毒！`,'lp'); }
  }
  updateBars(); renderStatus();
  startCooldown(sk);
  // ⚠️ CardConfirmPlay 循环内：跳过本次 raidTick，由 CardConfirmPlay 末尾统一触发
  if(isSelf && !window._skipRaidTickInExecSkill) { raidTick(); checkWin(); }
  else if(isSelf) { updateBars(); renderStatus(); /* 已由 CardConfirmPlay 末尾处理 */ }
}

function startCooldown(sk){
  const slot=document.querySelector(`.skill-slot[data-id="${sk.id}"]`);
  if(!slot) return;
  slot.classList.remove('cd-ready-anim');
  slot.classList.add('cd-active');
  const totalCd = sk.cd || 1;
  slot.classList.remove('cd-long','cd-xlong');
  if(totalCd >= 8) slot.classList.add('cd-xlong');
  else if(totalCd >= 5) slot.classList.add('cd-long');
  updateCooldownUI(sk);
}

// 更新技能冷却UI（按回合）
function updateCooldownUI(sk){
  const slot=document.querySelector(`.skill-slot[data-id="${sk.id}"]`);
  if(!slot) return;
  const ring=slot.querySelector('.cd-ring');
  const mask=slot.querySelector('.cd-mask');
  const left=cds[sk.id]||0;
  const totalCd = sk.cd || 1;
  if(mask) mask.textContent = left > 0 ? left : '';
  if(ring){
    const pct = Math.min(360, Math.max(0, (left / totalCd) * 360));
    ring.style.setProperty('--pct', pct + 'deg');
  }
  if(left <= 0){
    if(slot.classList.contains('cd-active')){
      slot.classList.remove('cd-active','cd-long','cd-xlong');
      slot.classList.remove('cd-ready-anim');
      void slot.offsetWidth;
      slot.classList.add('cd-ready-anim');
      slot.addEventListener('animationend', function handler(){
        slot.classList.remove('cd-ready-anim');
        slot.removeEventListener('animationend', handler);
      });
    }
  }
}

function useSkill(idx){
  if(over) return;
  const sk=LH.skills[idx];
  if(sk) execSkill(sk,'l');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物主动技能系统
// ═══════════════════════════════════════════════════════════════════════════════

// 渲染宠物技能栏（根据出战宠物动态显示）
function renderPetSkillBar(){
  const bar=document.getElementById('petSkillBar');
  const btns=document.getElementById('petSkillBtns');
  if(!bar||!btns) return;

  // 检查是否有出战宠物
  const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
  if(!activePet || !Array.isArray(activePet.skills) || activePet.skills.length === 0){
    bar.style.display='none';
    btns.innerHTML='';
    return;
  }

  // 确保 petCds 已初始化该宠物的技能
  activePet.skills.forEach(skId=>{
    if(!(skId in petCds)) petCds[skId]=0;
  });

  bar.style.display='block';

  // 获取出战宠物的技能详情（最多显示3个）
  const displaySkills = activePet.skills.slice(0,3).map(skId=>PET_SKILLS[skId]).filter(Boolean);

  btns.innerHTML = displaySkills.map((sk,i)=>{
    const cdLeft = petCds[sk.id]||0;
    const totalCd = sk.cd || 2;
    const isOnCd = cdLeft > 0;
    const pct = Math.min(360, (cdLeft/totalCd)*360);
    const petEl = activePet;
    return `<div class="pet-skill-slot ${isOnCd?'pet-skill-cd':''}" data-idx="${i}" data-skid="${sk.id}"
      onclick="usePetSkill(${i},'${sk.id}')" title="${sk.name}：${sk.desc}">
      <div class="pet-skill-icon">
        <div style="font-size:14px">${sk.icon||'🐾'}</div>
        <div class="pet-skill-name">${sk.name.length>3?sk.name.slice(0,3):sk.name}</div>
      </div>
      <div class="pet-skill-cd-ring" style="--ppct:${pct}deg"></div>
      <div class="pet-skill-cd-mask">${cdLeft}</div>
    </div>`;
  }).join('');

  // 显示宠物名称
  const labelEl = bar.querySelector('div[style*="letter-spacing"]');
  if(labelEl) labelEl.innerHTML = `🐾 ${activePet.name} 技能`;
}

// 更新单个宠物技能CD的UI
function updatePetSkillCDUI(skId){
  const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
  if(!activePet) return;
  const slot = document.querySelector(`.pet-skill-slot[data-skid="${skId}"]`);
  if(!slot) return;
  const cdLeft = petCds[skId]||0;
  const sk = PET_SKILLS[skId];
  const totalCd = sk ? (sk.cd||2) : 2;
  const pct = Math.min(360, (cdLeft/totalCd)*360);
  const ring = slot.querySelector('.pet-skill-cd-ring');
  const mask = slot.querySelector('.pet-skill-cd-mask');
  if(ring) ring.style.setProperty('--ppct', pct+'deg');
  if(mask) mask.textContent = cdLeft > 0 ? cdLeft : '';
  if(cdLeft <= 0){
    if(slot.classList.contains('pet-skill-cd')){
      slot.classList.remove('pet-skill-cd');
      // 触发就绪动画
      slot.classList.remove('pet-skill-ready');
      void slot.offsetWidth;
      slot.classList.add('pet-skill-ready');
      slot.addEventListener('animationend', function h(){
        slot.classList.remove('pet-skill-ready');
        slot.removeEventListener('animationend', h);
      }, {once:true});
    }
  }
}

// 使用宠物技能（主动释放）
function usePetSkill(idx, skId){
  if(over) return;
  if((petCds[skId]||0) > 0){ log('🐾 宠物技能冷却中！','lm'); return; }
  const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
  if(!activePet) return;
  const sk = PET_SKILLS[skId];
  if(!sk){ log('🐾 未知技能','lm'); return; }

  // 消耗饱食度
  activePet.satiety = Math.max(0, activePet.satiety - 3);

  // 计算技能效果
  const petAtk = activePet.stats.atk;
  const petInt = activePet.stats.int;
  const rEl = document.getElementById('fR');

  let resultMsg = '';
  let petDmg = 0;

  if(sk.type === 'attack' || sk.type === 'magic'){
    // 攻击型技能
    const power = sk.power || 1.2;
    petDmg = Math.floor(petAtk * power * (0.85 + Math.random()*0.3));
    if(rEl && !over){
      const {finalDmg:fd} = applyDmg('r', petDmg);
      blink(rEl); sparks(rEl, 6);
      floatDmg(rEl, `🐾${sk.icon||'⚔️'}${fd}`, 'dc');
    }
    resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！对 ${RH.name} 造成 ${petDmg} 伤害！`;
  } else if(sk.type === 'heal'){
    // 治疗型技能
    const healAmt = Math.floor(petInt * (sk.power||0.3) + LH.maxHp*(sk.power||0.3)*0.5);
    lHp = Math.min(LH._maxHpFull||LH.maxHp, lHp + healAmt);
    window.lHp = lHp;
    const lEl = document.getElementById('fL');
    if(lEl) floatDmg(lEl, `🐾${sk.icon||'💚'}+${healAmt}`, 'dh');
    resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！为 ${LH.name} 回复 ${healAmt} 生命！`;
  } else if(sk.type === 'buff'){
    // BUFF型技能
    if(sk.effect === 'atk_up'){
      lSt.atkBuff=(lSt.atkBuff||0)+0.15; lSt.atkBuffTurns=4;
      resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！${LH.name} 攻击力大幅提升！`;
    } else if(sk.effect === 'def_up'){
      lSt.defBuff=(lSt.defBuff||0)+0.15; lSt.defBuffTurns=4;
      resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！${LH.name} 防御力大幅提升！`;
    } else if(sk.effect === 'all_up'){
      lSt.atkBuff=(lSt.atkBuff||0)+0.1; lSt.defBuff=(lSt.defBuff||0)+0.1;
      lSt.atkBuffTurns=4; lSt.defBuffTurns=4;
      resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！全面属性提升！`;
    } else if(sk.effect === 'dodge_up'){
      lSt.dodgeBuff=(lSt.dodgeBuff||0)+0.12; lSt.dodgeBuffTurns=4;
      resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！${LH.name} 闪避率大幅提升！`;
    } else {
      resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！状态提升！`;
    }
  } else if(sk.type === 'dot'){
    // DOT型
    const dotDmg = Math.floor(petAtk * (sk.power||0.1));
    rSt.poison = Math.max(rSt.poison||0, sk.dotDur||3);
    rSt.poisonDmg = Math.max(rSt.poisonDmg||0, sk.power||0.1);
    petDmg = dotDmg;
    if(rEl && !over){
      const {finalDmg:fd} = applyDmg('r', petDmg);
      blink(rEl); floatDmg(rEl, `🐾${sk.icon||'🐍'}${fd} 中毒!`, 'dp');
    }
    resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！${RH.name} 中毒，每回合损失 ${Math.round((sk.power||0.1)*100)}% 气血！`;
  } else if(sk.type === 'revive'){
    // 复活技能（恢复主人至50%生命）
    const reviveAmt = Math.floor(LH.maxHp * 0.5);
    lHp = Math.min(LH._maxHpFull||LH.maxHp, reviveAmt);
    window.lHp = lHp;
    const lEl = document.getElementById('fL');
    if(lEl){ floatDmg(lEl, `🐾${sk.icon||'🔥'}+${reviveAmt}`, 'dh'); }
    resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】！${LH.name} 浴火重生，恢复 ${reviveAmt} 生命！`;
  } else if(sk.type === 'passive' || sk.type === 'gather' || sk.type === 'find' || sk.type === 'loot' || sk.type === 'copy' || sk.type === 'access' || sk.type === 'special'){
    // 非战斗技能：提示不可在战斗中使用
    resultMsg = `🐾 ${activePet.name} 的【${sk.name}】无法在战斗中使用`;
  } else {
    // 默认攻击
    petDmg = Math.floor(petAtk * 1.0 * (0.85 + Math.random()*0.3));
    if(rEl && !over){
      const {finalDmg:fd} = applyDmg('r', petDmg);
      blink(rEl); sparks(rEl, 5); floatDmg(rEl, `🐾${fd}`, 'dc');
    }
    resultMsg = `🐾 ${activePet.name} 使用【${sk.name}】造成 ${petDmg} 伤害！`;
  }

  // 设置技能CD
  petCds[skId] = sk.cd || 2;
  updatePetSkillCDUI(skId);

  log(resultMsg, 'ls');
  flash('blue'); updateBars(); renderStatus(); renderPetSkillBar();
  // 宠物主动技能不触发自动回合，让玩家继续行动
  raidTick(); checkWin();
}

function renderSkillBar(){
  // ── 将将胡：手牌系统激活时跳过传统技能栏渲染 ──
  if(typeof window.isCardSystemActive === 'function' && window.isCardSystemActive()) {
    const bar=document.getElementById('skillBar');
    if(bar){ bar.innerHTML=''; bar.style.display='none'; }
    return;
  }
  const bar=document.getElementById('skillBar');
  // 保留基础攻击按钮(前3个)，只清除技能插槽
  const basicBtns = bar.querySelectorAll('.basic-atk');
  // 移除所有非基础攻击的插槽
  bar.querySelectorAll('.skill-slot:not(.basic-atk)').forEach(el => el.remove());
  (LH.skills||[]).forEach((sk,i)=>{
    const st=SKT[sk.type]||SKT.damage;
    // 武器适配状态
    const wm = checkWepSkillMatch(LH.id, sk.school);
    const wmStyle = {
      perfect:  'border-color:#ffd060;box-shadow:0 0 10px rgba(255,208,96,.4)',
      match:    'border-color:#80d0ff;box-shadow:0 0 6px rgba(128,208,255,.25)',
      any:      '',
      mismatch: 'border-color:#ff4040;box-shadow:0 0 8px rgba(255,64,64,.2);opacity:.65',
    }[wm]||'';
    const wmBadge = {
      perfect:  `<div class="sk-wep-badge sk-wep-perfect">✨</div>`,
      match:    `<div class="sk-wep-badge sk-wep-match">⚔</div>`,
      any:      '',
      mismatch: `<div class="sk-wep-badge sk-wep-mismatch">⚠</div>`,
    }[wm]||'';
    const wmTip = {
      perfect:  `<div class="tt-wep-match perfect">⚔✨ 趁手神兵 · 伤害+25%</div>`,
      match:    `<div class="tt-wep-match match">⚔ 武器相合 · 伤害+10%</div>`,
      any:      '',
      mismatch: `<div class="tt-wep-match mismatch">⚠ 武器不合 · 伤害-35%</div>`,
    }[wm]||'';
    // ── 熟练度信息（仅自定义角色）──
    let profBadge = '';
    let profTip = '';
    let profCdStr = `${sk.cd}回合`;
    if(LH.id === 'cp_self' && typeof getProfDisplay === 'function'){
      const pd = getProfDisplay(sk.school);
      const starColors = ['#606060','#808060','#a0a040','#c0a020','#ffd060','#a0f8ff'];
      const col = starColors[pd.tierIdx] || '#606060';
      if(pd.tierIdx > 0){
        profBadge = `<div class="sk-prof-badge" style="color:${col}" title="${sk.school}·${pd.tierName}">${pd.tierIdx >= 5 ? '✦' : '★'.repeat(pd.tierIdx)}</div>`;
      }
      const cdR = pd.cdReduce > 0 ? `，CD-${Math.round(pd.cdReduce*100)}%` : '';
      const enlightenStr = pd.enlightenChance > 0 ? `，顿悟${Math.round(pd.enlightenChance*100)}%` : '';
      profTip = `<div class="tt-prof" style="color:${col}">📖 ${sk.school}·${pd.tierName} · ×${pd.mult.toFixed(2)}${cdR}${enlightenStr}</div>`;
      // 显示实际CD
      const actualCd = Math.max(1, Math.round(sk.cd * (1 - pd.cdReduce)));
      profCdStr = pd.cdReduce > 0 ? `${actualCd}回合 <span style="color:#80d0ff;font-size:9px">(−${Math.round(pd.cdReduce*100)}%)</span>` : `${sk.cd}回合`;
    }
    const slot=document.createElement('div');
    slot.className='skill-slot';
    slot.dataset.id=sk.id;
    slot.innerHTML=`
      <div class="skill-icon" style="${wmStyle}">
        ${profBadge}
        <div class="skill-name-sm">${sk.name}</div>
        <div class="cd-ring" style="--pct:0deg"></div>
        <div class="cd-mask">0</div>
      </div>
      <div class="skill-tooltip">
        <div class="tt-name" style="color:${st.color}">${sk.icon} ${sk.name}</div>
        <div class="tt-desc">${sk.desc}</div>
        <div class="tt-cd">冷却：${profCdStr}</div>
        <div class="tt-mp" style="color:#44aaff">💙 内力消耗：${sk.mpCost !== undefined ? sk.mpCost : Math.min(60,Math.max(5,Math.round((sk.cd||1)*4)))}</div>
        <div class="tt-type" style="color:${st.color};border-color:${st.color}55">${st.label}</div>
        <div class="tt-primstat" style="font-size:9px;color:#888;margin-top:3px">${(()=>{
          const _tipMap = {
            '剑系':'⚔ 强化根骨：🌬身法 · 🔥心志',
            '佛系':'⚔ 强化根骨：🏔体魄 · 🔥心志',
            '道系':'⚔ 强化根骨：🌀内息 · 🌬身法',
            '力系':'⚔ 强化根骨：⚡劲力 · 🏔体魄',
            '拳系':'⚔ 强化根骨：⚡劲力 · 🏔体魄',
            '暗系':'⚔ 强化根骨：🌬身法 · 🌀内息',
            '毒系':'⚔ 强化根骨：🌀内息 · 🌬身法',
            '冰系':'⚔ 强化根骨：🌀内息 · 🔥心志',
            '火系':'⚔ 强化根骨：⚡劲力 · 🔥心志',
            '雷系':'⚔ 强化根骨：🔥心志 · ⚡劲力',
            '风系':'⚔ 强化根骨：🌬身法 · 🌀内息',
            '圣系':'⚔ 强化根骨：🔥心志 · 🏔体魄',
            '琴系':'⚔ 强化根骨：🌀内息 · 🔥心志',
            '奇门系':'⚔ 强化根骨：🌀内息 · 🌬身法',
            '命系':'⚔ 强化根骨：🔥心志 · 🌀内息',
            '通用':'⚔ 强化根骨：五维最高属性',
          };
          return _tipMap[sk.school]||'';
        })()}</div>
        ${wmTip}${profTip}
      </div>`;
    slot.onclick=()=>useSkill(i);
    // 手机触摸：长按显示tooltip，快速点击使用技能
    let _ttTimer=null;
    slot.addEventListener('touchstart',e=>{
      _ttTimer=setTimeout(()=>{
        slot.querySelector('.skill-tooltip').style.opacity='1';
        _ttTimer=null;
      },350);
    },{passive:true});
    slot.addEventListener('touchend',e=>{
      if(_ttTimer!==null){ clearTimeout(_ttTimer); _ttTimer=null; }
      else { slot.querySelector('.skill-tooltip').style.opacity='0'; }
    },{passive:true});
    slot.addEventListener('touchmove',()=>{ if(_ttTimer) clearTimeout(_ttTimer); _ttTimer=null; },{passive:true});
    bar.appendChild(slot);
  });
}

function renderPickRow(){
  const row=document.getElementById('pickRow'); row.innerHTML='';
  CHARS.forEach(c=>{
    const ch=document.createElement('div');
    ch.className='pick-chip'+(c.id===LH.id?' sel-l':c.id===RH.id?' sel-r':'');
    ch.style.color=c.color; ch.dataset.id=c.id;
    ch.innerHTML=`${c.name}<span>${c.title}</span>`;
    ch.onclick=()=>{ if(c.id===LH.id){const o=CHARS.filter(x=>x.id!==c.id);RH=o[Math.floor(Math.random()*o.length)];}else{LH=c;} resetFight(); };
    row.appendChild(ch);
  });
}

// ── 选将选项卡切换 ──
let _pickTab = 'hero';
let _enemyFilter = 'all';

function switchPickTab(tab){
  _pickTab = tab;
  document.getElementById('pickPanelHero').style.display = tab==='hero' ? '' : 'none';
  document.getElementById('pickPanelEnemy').style.display = tab==='enemy' ? '' : 'none';
  document.getElementById('pickTabHero').classList.toggle('active', tab==='hero');
  document.getElementById('pickTabEnemy').classList.toggle('active', tab==='enemy');
  if(tab==='enemy'){
    // 确保筛选按钮已初始化
    const fr = document.getElementById('enemyFilterRow');
    if(fr && fr.children.length === 0) initEnemyFilterRow();
    renderEnemyPickRow(_enemyFilter);
  }
}

// ── 将 ENEMY_DB 敌人转为武斗场角色格式 ──
function buildEnemyForFight(enemy){
  const skillObjs = (typeof getSkills === 'function')
    ? getSkills(Array.isArray(enemy.skills) ? enemy.skills.filter(s=>typeof s==='string') : []).map((s,i)=>({...s,key:String(i+1)}))
    : [];
  // 颜色映射
  const typeColor = {
    beast: '#c08040', bandit: '#a07050', evil: '#a040c0',
    assassin: '#8080e0', ghost: '#60e0c0', boss: '#ff6040'
  };
  const tierColor = { func:'#a08060', major:'#ffd060', elite:'#ff8060' };
  const col = tierColor[enemy.tier] || typeColor[enemy.type] || '#c09060';
  // 速度
  const spdN = enemy.spd || 8;
  const spdLabel = spdN>=16?'极快':spdN>=12?'快':spdN>=8?'普通':'慢';
  
  // 人形怪使用捏脸部件系统
  const isHumanoid = ['bandit','evil','assassin','ghost','boss'].includes(enemy.type);
  const parts = isHumanoid ? generateEnemyParts(enemy) : null;
  
  // BOSS/精英怪生成称号
  const title = generateEnemyTitle(enemy);
  
  return {
    id: '_enemy_'+enemy.id,
    name: enemy.name,
    title: title,
    tag: ['func','major','elite'][['func','major','elite'].indexOf(enemy.tier)] || '野外敌人',
    tagColor: col,
    color: col,
    maxHp: enemy.hp,
    atk: enemy.atk,
    def: enemy.def,
    speed: spdLabel,
    speedN: spdN,
    maxMp: enemy.mp || 0,
    crit: enemy.crit || 8,
    dodge: enemy.dodge || 5,
    desc: enemy.desc || '',
    stand: enemy.stand || _DEFAULT_QUESTION_ASCII,
    attack: Array.isArray(enemy.attack) ? enemy.attack : (enemy.attack ? [enemy.attack] : []),
    heavy: Array.isArray(enemy.heavy)   ? enemy.heavy  : (enemy.heavy  ? [enemy.heavy]  : []),
    hit:   Array.isArray(enemy.hit)     ? enemy.hit    : (enemy.hit    ? [enemy.hit]    : []),
    down: enemy.down || _DEFAULT_QUESTION_ASCII,
    parts: parts,  // 人形怪使用捏脸部件，野兽用 stand 文本
    skills: skillObjs,
    _isEnemy: true,
    _enemyTier: enemy.tier,
    _enemyType: enemy.type,
    _enemyLevel: enemy.level,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 根据敌人类型/等级生成称号
// ═══════════════════════════════════════════════════════════════════
function generateEnemyTitle(enemy) {
  const tier = enemy.tier;
  const type = enemy.type;
  const level = enemy.level;
  
  // 精英怪称号池
  const eliteTitles = {
    boss: ['天下无敌', '魔王降世', '血手人屠', '武林至尊', '一代宗师'],
    evil: ['杀气腾腾', '万毒弥漫', '魔气冲天', '血腥屠夫', '邪道巨擘'],
    assassin: ['暗影杀手', '鬼影无踪', '夺命无常', '血衣刺客', '暗夜君王'],
    ghost: ['幽冥鬼王', '阴魂不散', '鬼哭神嚎', '百鬼夜行', '冥界使者'],
    bandit: ['啸聚山林', '打家劫舍', '绿林好汉', '山寨大王', '劫富济贫'],
  };
  
  // 头目怪称号池
  const majorTitles = {
    boss: ['一方霸主', '威震四方', '独步武林', '剑气纵横', '雷霆万钧'],
    evil: ['心狠手辣', '恶贯满盈', '毒辣心肠', '凶神恶煞', '恶名昭彰'],
    assassin: ['来去无踪', '暗箭伤人', '致命一击', '影舞者', '死亡宣告'],
    ghost: ['阴风阵阵', '鬼魅魍魉', '魂魄收割', '幽灵行者', '冥河摆渡'],
    bandit: ['占山为王', '路见不平', '劫财不劫色', '江湖草莽', '绿林豪杰'],
    beast: ['凶猛异常', '野性难驯', '獠牙利爪', '嗜血成性', '山林之王'],
  };
  
  // 普通怪称号池（低阶）
  const funcTitles = {
    boss: ['初出茅庐', '小有名气'],
    evil: ['为非作歹', '心术不正'],
    assassin: ['新手刺客', '暗影学徒'],
    ghost: ['游魂野鬼', '孤魂野鬼'],
    bandit: ['小喽啰', '毛贼', '散兵', '流寇'],
    beast: ['野兽', '猛兽'],
  };
  
  // 根据类型和等级选择称号
  let titlePool;
  if (tier === 'elite') {
    titlePool = eliteTitles[type] || eliteTitles.bandit;
  } else if (tier === 'major') {
    titlePool = majorTitles[type] || majorTitles.bandit;
  } else {
    titlePool = funcTitles[type] || funcTitles.bandit;
  }
  
  // 基于敌人ID哈希选择固定称号
  const hash = enemy.id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  const titleIndex = Math.abs(hash) % titlePool.length;
  const title = titlePool[titleIndex];
  
  return title ? `「${title}」Lv${level}` : (enemy.icon||'⚔') + ' Lv' + level;
}

// ═══════════════════════════════════════════════════════════════════
// 根据敌人类型生成捏脸部件
// ═══════════════════════════════════════════════════════════════════
function generateEnemyParts(enemy) {
  // 基于敌人ID的哈希值，确保同一敌人总是生成相同外观
  const hash = enemy.id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  const rand = (mod) => Math.abs(hash) % mod;
  
  // 根据类型选择部件风格
  const type = enemy.type;
  const tier = enemy.tier;
  
  // 头部选择
  let headIdx = 0;
  if (type === 'boss') headIdx = 11 + rand(4); // 王者盔、龙头、魔王等
  else if (type === 'evil') headIdx = 6 + rand(3); // 骷髅、鬼脸等
  else if (type === 'assassin') headIdx = 9 + rand(2); // 凶相、傲娇
  else headIdx = rand(11); // 普通头部
  
  // 身体选择
  let bodyIdx = 0;
  if (tier === 'elite') bodyIdx = 9 + rand(4); // 锁甲、羽衣、仙气等
  else if (tier === 'major') bodyIdx = 4 + rand(5); // 魁梧、轻盈等
  else bodyIdx = rand(9); // 基础体型
  
  // 武器/手臂选择
  let armsIdx = 0;
  const weaponMap = {
    'wep_uc_spear': 12,    // 长枪
    'wep_long_spear': 12,  // 长枪
    'wep_uc_dao': 2,       // 双刀
    'wep_iron_sword': 1,   // 长剑
    'wep_blood_saber': 1,  // 长剑
    'wep_uc_bow': 4,       // 弓箭
    'wep_poison_fan': 5,   // 折扇
  };
  // 从敌人模板中找武器
  const templateWeapon = enemy._templateWeapon || '';
  if (weaponMap[templateWeapon]) {
    armsIdx = weaponMap[templateWeapon];
  } else {
    // 根据类型默认
    if (type === 'bandit') armsIdx = 2; // 双刀
    else if (type === 'boss') armsIdx = 1; // 长剑
    else armsIdx = rand(10);
  }
  
  // 腿部选择
  let legsIdx = rand(12);
  
  // 气场选择 - 根据类型匹配称号氛围
  // ED_PARTS.aura: 0无 1天下无敌 2南无佛 3道法自然 4杀气腾腾 5剑气纵横 6万毒弥漫 7烈焰 8雷霆 9冰封 10仙云 11血腥 12哈哈 13剑意 14符文 15魔气
  const auraMap = {
    boss: [1, 5, 8, 13],      // 天下无敌、剑气纵横、雷霆、剑意
    evil: [4, 6, 11, 15],     // 杀气腾腾、万毒弥漫、血腥、魔气
    assassin: [4, 11, 14],    // 杀气腾腾、血腥、符文
    ghost: [6, 9, 15],        // 万毒弥漫、冰封、魔气
    bandit: [4, 7, 12],       // 杀气腾腾、烈焰、哈哈
    beast: [4, 7, 8, 11],     // 杀气腾腾、烈焰、雷霆、血腥
  };
  const auraPool = auraMap[type] || [0];
  auraIdx = auraPool[rand(auraPool.length)];
  
  return {
    head: headIdx % ED_PARTS.head.length,
    body: bodyIdx % ED_PARTS.body.length,
    arms: armsIdx % ED_PARTS.arms.length,
    legs: legsIdx % ED_PARTS.legs.length,
    aura: auraIdx % ED_PARTS.aura.length,
  };
}

// ── 敌人选角行 ──
function renderEnemyPickRow(filter){
  _enemyFilter = filter;
  // 更新筛选按钮状态
  document.querySelectorAll('.enemy-filter-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.filter===filter);
  });
  // 筛选敌人
  const row = document.getElementById('enemyPickRow');
  row.innerHTML = '';
  const enemies = Object.values(window.ENEMY_DB||ENEMY_DB||{});
  const filtered = filter==='all' ? enemies : enemies.filter(e=>e.type===filter||e.tier===filter);
  // 按等级排序
  filtered.sort((a,b)=>(a.level||0)-(b.level||0));
  filtered.forEach(enemy=>{
    const eChar = buildEnemyForFight(enemy);
    const isSelected = RH && RH.id === eChar.id;
    const ch = document.createElement('div');
    ch.className = 'pick-chip enemy-chip' + (isSelected?' sel-r':'');
    ch.style.color = eChar.color;
    const tierMark = enemy.tier==='elite'?'<span class="enemy-tier-elite">◆</span>':enemy.tier==='major'?'<span class="enemy-tier-major">★</span>':'';
    ch.innerHTML = `${enemy.icon||'⚔'}${enemy.name}${tierMark}<span class="enemy-lv">Lv${enemy.level}</span>`;
    ch.title = enemy.desc || enemy.name;
    ch.onclick = ()=>{
      RH = eChar;
      // 渲染选中状态
      document.querySelectorAll('#enemyPickRow .pick-chip').forEach(c=>c.classList.remove('sel-r'));
      ch.classList.add('sel-r');
      resetFight();
    };
    row.appendChild(ch);
  });
}

// ── 初始化敌人筛选按钮 ──
function initEnemyFilterRow(){
  const filterRow = document.getElementById('enemyFilterRow');
  if(!filterRow) return;
  const filters = [
    { key:'all',      label:'全 部' },
    { key:'beast',    label:'🐺 猛兽' },
    { key:'bandit',   label:'🗡 盗匪' },
    { key:'evil',     label:'☠ 邪道' },
    { key:'assassin', label:'🌑 刺客' },
    { key:'ghost',    label:'👻 邪灵' },
    { key:'boss',     label:'💀 BOSS' },
    { key:'elite',    label:'◆ 精英' },
  ];
  filterRow.innerHTML = filters.map(f=>
    `<button class="enemy-filter-btn${f.key==='all'?' active':''}" data-filter="${f.key}" onclick="renderEnemyPickRow('${f.key}')">${f.label}</button>`
  ).join('');
}



// 战斗日志关键词高亮映射
const _LOG_HIGHLIGHTS = [
  { re:/💥暴击[！!]?/g,            cls:'lh-crit'   },
  { re:/暴击[！!]?\s*\d+/g,         cls:'lh-crit'   },
  { re:/CRIT[！!]?/g,               cls:'lh-crit'   },
  { re:/⚡[^\s，。！\n]+追击[^\s，。！\n]*/g, cls:'lh-chase' },
  { re:/追击[^\s，。！\n]*/g,        cls:'lh-chase'  },
  { re:/⚡鬼魅身法[！!]?/g,          cls:'lh-chase'  },
  { re:/🌀[^\n]*/g,                 cls:'lh-reflect'},
  { re:/乾坤挪移[！!]?/g,            cls:'lh-reflect'},
  { re:/反弹[！!]?/g,               cls:'lh-reflect'},
  { re:/☠\s*[\d.]+[^\n]*/g,         cls:'lh-poison' },
  { re:/中毒[^\n]*/g,               cls:'lh-poison' },
  { re:/毒\d+/g,                    cls:'lh-poison' },
  { re:/眩晕[^\n]*/g,               cls:'lh-stun'   },
  { re:/闪避[！!]?/g,               cls:'lh-dodge'  },
  { re:/🛡[^\s]+/g,                 cls:'lh-shield' },
  { re:/护盾[^\n]*/g,               cls:'lh-shield' },
  { re:/🩸|气血回复[\d.]+[^\n]*/g,   cls:'lh-heal'   },
  { re:/秘籍发动[！!]?/g,            cls:'lh-manual' },
  { re:/武学[^，。！\n]*发动/g,       cls:'lh-manual' },
  { re:/发动绝技[！!]?/g,            cls:'lh-manual' },
  { re:/胜利[！!]?|落败[！!]?|倒下[！!]?|KO[！!]?/g, cls:'lh-ko' },
];
function _logHighlight(text){
  // 先HTML转义，再用标记替换
  let s = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // 用占位符逐步替换，避免多次匹配叠加
  const spans = [];
  _LOG_HIGHLIGHTS.forEach(({re, cls})=>{
    s = s.replace(re, m=>{
      const idx = spans.length;
      spans.push(`<span class="${cls}">${m}</span>`);
      return `\x00${idx}\x00`;
    });
  });
  // 还原占位符
  s = s.replace(/\x00(\d+)\x00/g, (_,i)=>spans[+i]);
  return s;
}
function log(text,cls){
  const el=document.getElementById('bLog');
  const d=document.createElement('div');
  d.className=`ll ${cls||''}`;
  d.innerHTML=_logHighlight(text);
  el.appendChild(d);el.scrollTop=el.scrollHeight;
}

// 键盘 - 博弈战斗系统快捷键
document.addEventListener('keydown',e=>{
  // ── 将将胡：手牌激活时禁用Q/Z/X/C/1/2/3 ──
  const cardActive = (typeof window.isCardSystemActive === 'function' && window.isCardSystemActive());
  // 纯卡牌战斗模式，不再监听技能快捷键
});
// 使用 requestAnimationFrame 优化状态栏渲染（约每16ms检查一次，但实际只在需要时渲染）
let _lastStatusRender = 0;
const _STATUS_RENDER_INTERVAL = 500; // 最小渲染间隔 500ms
function _statusRenderLoop(){
  if(!over) {
    const now = performance.now();
    if(now - _lastStatusRender >= _STATUS_RENDER_INTERVAL) {
      renderStatusSafe();
      _lastStatusRender = now;
    }
  }
  requestAnimationFrame(_statusRenderLoop);
}
requestAnimationFrame(_statusRenderLoop);

// ════════════════════════════════════════════════
//  战斗场景初始化
// ════════════════════════════════════════════════

/**
 * 从存档创建玩家角色 cp_self
 */
function createPlayerFromSave() {
  // 获取装备槽中的技能（新系统）
  let equippedSkillIds = (typeof getEquippedSkills === 'function')
    ? getEquippedSkills()
    : ['cm01','cm02','cm03']; // 默认3个技能

  // 根据武器限制过滤技能（有武器时才限制，无武器时不过滤）
  if (typeof getWeaponAllowedSchools === 'function' && typeof getSkillSchool === 'function') {
    const hasWeapon = (typeof edS !== 'undefined' && edS.weaponInstId);
    if (hasWeapon) {
      const allowedSchools = getWeaponAllowedSchools();
      equippedSkillIds = equippedSkillIds.filter(id => {
        const skillSchool = getSkillSchool(id);
        return allowedSchools.includes(skillSchool);
      });
    }
    // 无武器时不过滤，使用玩家已装备的所有技能
  }

  // 如果没有可用技能，使用默认通用技能
  if (equippedSkillIds.length === 0) {
    equippedSkillIds = ['cm01', 'cm02', 'cm03']; // 基础通用技能
  }

  // 优先从当前正式角色存档恢复：出身结束后生成的外观、装备与名字都应以 wuxia_editor 为准
  const currentSave = hydrateEdSFromEditorSave();
  if (currentSave) {
    const stats = (typeof edStats === 'function') ? edStats() : {};
    const ascii = buildAsciiFromAvatarState(currentSave);
    // 速度优先用实时计算的，其次存档，最后默认值
    const speedN = stats.spd ?? currentSave.speedN ?? 8;
    return {
      id: 'cp_self',
      name: currentSave.name || '无名侠',
      title: currentSave.title || '江湖客',
      tag: '江湖侠客',
      tagColor: currentSave.color || '#c0a070',
      color: currentSave.color || '#c0a070',
      // 属性优先使用 edStats() 实时计算的值（包含等级成长、根骨加成）
      maxHp: stats.hp ?? currentSave.maxHp ?? 200,
      atk: stats.atk ?? currentSave.atk ?? 30,
      def: stats.def ?? currentSave.def ?? 10,
      crit: stats.crit ?? currentSave.crit ?? 10,
      dodge: stats.dodge ?? currentSave.dodge ?? 5,
      maxMp: stats.mp ?? currentSave.maxMp ?? 100,
      speedN,
      speed: speedN >= 10 ? '极快' : speedN >= 9 ? '快' : speedN >= 8 ? '中' : speedN >= 7 ? '慢' : '极慢',
      desc: '当前存档中的江湖角色',
      stand: ascii,
      attack: [ascii],
      heavy: [ascii],
      hit: [ascii],
      down: ascii,
      parts: { ...(currentSave.parts || {}) },
      custom: { ...(currentSave.custom || {}) },
      useCustom: { ...(currentSave.useCustom || {}) },
      bag: Array.isArray(currentSave.bag) ? JSON.parse(JSON.stringify(currentSave.bag)) : [],
      weaponInstId: currentSave.weaponInstId || null,
      weaponId: currentSave.weaponId || null,
      costumeInstId: currentSave.costumeInstId || null,
      armsLocked: !!currentSave.armsLocked,
      skillIds: equippedSkillIds,
      get skills() { return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
    };
  }

  // 兼容旧的 wuxia_cc 角色存档
  let saved; try{ saved=JSON.parse(localStorage.getItem('wuxia_cc') || '[]'); }catch(e){ saved=[]; }
  if (saved.length > 0) {
    const latest = saved[saved.length - 1];
    return {
      id: 'cp_self',
      name: latest.name || '无名侠',
      title: latest.title || '江湖客',
      tag: '自创英雄',
      tagColor: latest.color || '#c0a070',
      color: latest.color || '#c0a070',
      maxHp: latest.stats?.hp || 200,
      atk: latest.stats?.atk || 30,
      def: latest.stats?.def || 10,
      crit: latest.stats?.crit || 10,
      dodge: latest.stats?.dodge || 5,
      maxMp: latest.stats?.mp || 100,
      speedN: latest.stats?.spd || 8,
      speed: (latest.stats?.spd || 8) >= 10 ? '极快' : (latest.stats?.spd || 8) >= 9 ? '快' : (latest.stats?.spd || 8) >= 8 ? '中' : (latest.stats?.spd || 8) >= 7 ? '慢' : '极慢',
      desc: '玩家亲手捏制的专属角色',
      stand: latest.ascii || buildAsciiFromAvatarState(latest),
      attack: [latest.ascii || buildAsciiFromAvatarState(latest)],
      heavy: [latest.ascii || buildAsciiFromAvatarState(latest)],
      hit: [latest.ascii || buildAsciiFromAvatarState(latest)],
      down: latest.ascii || buildAsciiFromAvatarState(latest),
      parts: { ...(latest.parts || {}) },
      custom: { ...(latest.custom || {}) },
      useCustom: { ...(latest.useCustom || {}) },
      bag: Array.isArray(latest.bag) ? JSON.parse(JSON.stringify(latest.bag)) : [],
      weaponInstId: latest.weaponInstId || null,
      weaponId: latest.weaponId || null,
      costumeInstId: latest.costumeInstId || null,
      armsLocked: !!latest.armsLocked,
      skillIds: equippedSkillIds,
      get skills() { return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
    };
  }
  
  // 尝试从出身系统存档读取角色名称

  const originDataRaw = localStorage.getItem('wuxia_origin_data');
  if (originDataRaw) {
    try {
      const originData = JSON.parse(originDataRaw);
      if (originData && originData.fullName) {
        return {
          id: 'cp_self',
          name: originData.fullName,
          title: originData.background?.title || '江湖客',
          tag: '江湖新秀',
          tagColor: '#c0a070',
          color: '#c0a070',
          maxHp: originData.stats?.hp || 200,
          atk: originData.stats?.atk || 30,
          def: originData.stats?.def || 10,
          crit: originData.stats?.crit || 10,
          dodge: originData.stats?.dodge || 5,
          maxMp: originData.stats?.mp || 100,
          speedN: originData.stats?.spd || 8,
          speed: (originData.stats?.spd || 8) >= 10 ? '极快' : (originData.stats?.spd || 8) >= 9 ? '快' : (originData.stats?.spd || 8) >= 8 ? '中' : (originData.stats?.spd || 8) >= 7 ? '慢' : '极慢',
          desc: `出身${originData.background?.name || '江湖'}的${originData.gender === 'female' ? '女' : '男'}侠`,
          stand: _DEFAULT_QUESTION_ASCII,
          attack: [_DEFAULT_QUESTION_ASCII],
          heavy: [_DEFAULT_QUESTION_ASCII],
          hit: [_DEFAULT_QUESTION_ASCII],
          down: _DEFAULT_QUESTION_ASCII,
          weaponId: null,
          skillIds: equippedSkillIds,
          get skills() { return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
        };
      }
    } catch (e) {
      console.error('[Battle] Failed to parse origin data:', e);
    }
  }

  // 没有存档，创建默认角色
  // 确保 equippedSkillIds 有值
  if (!equippedSkillIds || equippedSkillIds.length === 0) {
    equippedSkillIds = ['cm01', 'cm02', 'cm03'];
  }

  return {
    id: 'cp_self',
    name: '无名侠',
    title: '江湖客',
    tag: '自创英雄',
    tagColor: '#c0a070',
    color: '#c0a070',
    maxHp: 200,
    atk: 30,
    def: 10,
    crit: 10,
    dodge: 5,
    maxMp: 100,
    speedN: 8,
    speed: '中',
    desc: '初入江湖的侠客',
    stand: _DEFAULT_QUESTION_ASCII,
    attack: [_DEFAULT_QUESTION_ASCII],
    heavy: [_DEFAULT_QUESTION_ASCII],
    hit: [_DEFAULT_QUESTION_ASCII],
    down: _DEFAULT_QUESTION_ASCII,
    skillIds: equippedSkillIds, // 使用装备槽技能（已按武器过滤）
    get skills() { return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  };
}

/**
 * 初始化战斗场景
 * - 左边始终加载玩家角色 (cp_self)
 * - 右边根据场景加载：
 *   1. URL参数 ?enemy=xxx 加载指定敌人
 *   2. URL参数 ?npc=xxx 加载指定NPC
 *   3. sessionStorage 中的战斗上下文（完整玩家+敌人数据）
 *   4. 默认加载第一个可用敌人
 */
function initBattleScene() {
  // 尝试从 sessionStorage 读取战斗上下文
  const battleContext = sessionStorage.getItem('battleContext');
  let contextData = null;
  if (battleContext) {
    try {
      contextData = JSON.parse(battleContext);
    } catch (e) {
      console.error('[Battle] Failed to parse battleContext:', e);
    }
  }
  
  // 如果有完整的战斗上下文（来自 startBattleInNewPage），直接使用
  if (contextData && contextData.player && contextData.enemy) {
    // 使用上下文中的玩家数据
    // 优先使用已解析的 skills 数组（来自 battle-test-select.html 等）
    if (contextData.player.skills && Array.isArray(contextData.player.skills) && contextData.player.skills.length > 0) {
      LH = { ...contextData.player }; // 直接使用已有的 skills 数组
    } else {
      // 如果没有 skills，用 skillIds 重建
      LH = {
        ...contextData.player,
        get skills() { 
          const ids = this.skillIds || ['cm01','cm02','cm03'];
          return getSkills(ids).map((s,i)=>({...s,key:String(i+1)})); 
        }
      };
    }
    
    // 使用上下文中的敌人数据 - 确保有title字段
    const enemyData = contextData.enemy;
    // 检查是否需要生成称号（没有title，或title是默认值'敌人'）
    let enemyTitle = enemyData.title;
    if (!enemyTitle || enemyTitle === '敌人') {
      if (enemyData._enemyType) {
        enemyTitle = generateEnemyTitle({
          id: enemyData.id,
          name: enemyData.name,
          type: enemyData._enemyType,
          tier: enemyData._enemyTier,
          level: enemyData._enemyLevel,
          icon: enemyData.icon
        });
      } else {
        enemyTitle = `Lv${enemyData._enemyLevel || 1}`;
      }
    }
    RH = {
      ...enemyData,
      title: enemyTitle,
      get skills() {
        const sks = this._skills || [];
        return sks.map((s,i)=>({...s,key:String(i+1)}));
      }
    };
    RH._skills = enemyData.skills; // 保存原始技能数据
    
    // 保存返回地址
    window._battleReturnUrl = contextData.returnUrl || 'town.html';
    // ── 主线 BOSS 标记 ──
    window._storyBossName = contextData._storyBossName || null;
    
    // 清除战斗上下文（避免刷新时重复使用）
    sessionStorage.removeItem('battleContext');
    
    // 预设置当前血量（让resetFight能正确计算比例）
    if (typeof contextData.player._currentHp === 'number') {
      lHp = contextData.player._currentHp;
      window.lHp = lHp; // 同步到 window 对象
    }
    if (typeof contextData.player._currentMp === 'number') {
      lMp = contextData.player._currentMp;
      window.lMp = lMp; // 同步到 window 对象
    }
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"以弱胜强系统 - 初始化
    // ═══════════════════════════════════════════════════════════════
    _initUnderdogBonus(contextData.player, contextData.enemy);
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"意外援军系统 - 随机触发
    // ═══════════════════════════════════════════════════════════════
    _initReinforcementChance();
    
    // 初始化战斗
    resetFight();
    
    // ── BOSS战斗机制初始化 ──
    if (typeof BossSystem !== 'undefined') {
      const npcTier = contextData.enemy._enemyTier || contextData.enemy.tier || '';
      BossSystem.init(contextData.enemy.id || '', npcTier);
    }
    
    // ── 战斗道具栏初始化 ──
    if (typeof renderBattleItemBar === 'function') {
      setTimeout(renderBattleItemBar, 200);
    }
    
    // 修改结算弹窗的返回按钮
    _setupBattleReturnButton();
    
    return;
  }
  
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"以弱胜强系统 - 初始化（非上下文模式）
  // ═══════════════════════════════════════════════════════════════
  _initUnderdogBonus(null, null);
  
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"意外援军系统 - 随机触发
  // ═══════════════════════════════════════════════════════════════
  _initReinforcementChance();
  
  // 确保玩家角色存在
  let selfChar = CHARS.find(c => c.id === 'cp_self');
  if (!selfChar) {
    // 从存档创建玩家角色
    selfChar = createPlayerFromSave();
    CHARS.push(selfChar);
  }
  
  // 左边始终是玩家
  LH = selfChar;
  
  // 解析 URL 参数
  const params = new URLSearchParams(window.location.search);
  const enemyId = params.get('enemy');
  const npcId = params.get('npc');
  const charId = params.get('hero'); // 兼容旧参数
  
  // 设置右边角色
  const enemyDB = window.ENEMY_DB || ENEMY_DB || {};
  const enemiesList = Object.values(enemyDB);
  if (enemyId && enemiesList.length > 0) {
    // 从 ENEMY_DB 加载指定敌人
    const enemy = enemiesList.find(e => e.id === enemyId);
    if (enemy) {
      RH = buildEnemyForFight(enemy);
    } else {
      console.warn('[Battle] Enemy not found:', enemyId);
      RH = CHARS.find(c => c.id !== 'cp_self') || CHARS[0];
    }
  } else if (npcId && typeof NPC_DATA !== 'undefined') {
    // 从 NPC_DATA 加载指定NPC
    const npc = NPC_DATA.find(n => n.id === npcId);
    if (npc) {
      RH = buildNpcForFight(npc);
    } else {
      console.warn('[Battle] NPC not found:', npcId);
      RH = CHARS.find(c => c.id !== 'cp_self') || CHARS[0];
    }
  } else if (contextData && contextData.enemy) {
    // 从战斗上下文加载敌人（简化版，只有敌人ID）
    if (enemiesList.length > 0) {
      const enemy = enemiesList.find(e => e.id === contextData.enemy.id);
      if (enemy) {
        RH = buildEnemyForFight(enemy);
      } else {
        RH = CHARS.find(c => c.id !== 'cp_self') || CHARS[0];
      }
    } else {
      RH = CHARS.find(c => c.id !== 'cp_self') || CHARS[0];
    }
  } else if (charId && charId !== 'cp_self') {
    // 兼容旧逻辑：加载指定角色
    const char = CHARS.find(c => c.id === charId);
    if (char) {
      RH = char;
    } else {
      RH = CHARS.find(c => c.id !== 'cp_self') || CHARS[0];
    }
  } else {
    // 默认：加载第一个非玩家角色
    RH = CHARS.find(c => c.id !== 'cp_self') || CHARS[0];
  }
  
  // 设置返回地址（兜底默认值），并初始化返回按钮
  window._battleReturnUrl = window._battleReturnUrl || 'town.html';
  _setupBattleReturnButton();
  
  // 初始化战斗
  resetFight();
}

/**
 * 设置战斗结束后的返回按钮
 */
// ═══════════════════════════════════════════════════════════════
//  "将将胡"以弱胜强系统 - 初始化
// ═══════════════════════════════════════════════════════════════
// ── 根据 NPC 信息自动分配 AI 战斗风格 ──
function _pickAiStyleForNpc(npc) {
  if (!npc) return 'balanced';
  const id = (npc.id || '').toLowerCase();
  const rs = (npc._roleStyle || npc.roleStyle || '').toLowerCase();
  const name = (npc.name || '').toLowerCase();

  // 门派/职业关键字匹配
  if (id.includes('shaolin') || rs === 'monk' || name.includes('和尚') || name.includes('僧'))
    return 'shaolin';
  if (id.includes('wudang') || rs === 'taoist' || name.includes('道士') || name.includes('道长'))
    return 'taichi';
  if (id.includes('huashan') || rs === 'swordsman' || name.includes('剑客') || name.includes('剑仙'))
    return 'swordmaster';
  if (id.includes('wudu') || id.includes('poison') || rs === 'poisoner' || name.includes('蛊') || name.includes('毒'))
    return 'poisoner';
  if (id.includes('guard') || id.includes('soldier') || rs === 'fighter' || name.includes('将领') || name.includes('武将'))
    return 'ironwall';
  if (id.includes('bandit') || id.includes('thief') || name.includes('盗') || name.includes('贼') || name.includes('匪'))
    return 'wildcard';
  if (id.includes('assassin') || rs === 'assassin' || name.includes('刺客') || name.includes('杀手'))
    return 'aggressive';
  if (npc.tier === 'elite' || npc._enemyTier === 'elite')
    return 'berserker'; // BOSS默认狂暴风格

  // 随机fallback（4种标准 + 2种新增）
  const pool = ['aggressive','defensive','berserker','balanced','wildcard','swordmaster'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function _initUnderdogBonus(player, enemy){
  _underdogBonus = 0;
  
  if(player && enemy){
    const playerLv = player.level || player._level || 1;
    const enemyLv = enemy.level || enemy._level || enemy._enemyLevel || 1;
    const levelDiff = enemyLv - playerLv;
    
    // 敌人等级高于玩家时，触发以弱胜强加成
    if(levelDiff > 0){
      // 每高1级+3%伤害，最高+30%
      _underdogBonus = Math.min(0.30, levelDiff * 0.03);
      if(_underdogBonus > 0){
        log(`📈 以弱胜强！面对强敌，你的斗志被激发了！（伤害+${Math.round(_underdogBonus*100)}%）`, 'buff');
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"意外援军系统 - 初始化
// ═══════════════════════════════════════════════════════════════
function _initReinforcementChance(){
  window._reinforcementTriggered = false;
  window._reinforcementChance = 0.02; // 2%基础概率
  
  // 检查是否有结义兄弟可以增援
  if(typeof SW !== 'undefined' && typeof SW.getActiveBrothers === 'function'){
    const brothers = SW.getActiveBrothers();
    if(brothers && brothers.length > 0){
      // 每个结义兄弟+1%援军概率
      window._reinforcementChance += brothers.length * 0.01;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"意外援军系统 - 触发检查
// ═══════════════════════════════════════════════════════════════
function _checkReinforcement(){
  if(window._reinforcementTriggered) return false;
  if(lHp > LH.hp * 0.3) return false; // 只有濒死时才可能触发
  
  if(Math.random() < window._reinforcementChance){
    window._reinforcementTriggered = true;
    _triggerReinforcement();
    return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"意外援军系统 - 触发援军
// ═══════════════════════════════════════════════════════════════
function _triggerReinforcement(){
  // 恢复30%血量
  const healAmt = Math.floor(LH.hp * 0.3);
  lHp = Math.min(LH.hp, lHp + healAmt);
  
  // 攻击+20%，持续3回合
  lSt.atkBuff = (lSt.atkBuff || 0) + 20;
  lSt._reinforcementTurns = 3;
  
  log('🆘 意外援军！一位神秘侠客出手相助！', 'legendary');
  log(`💚 气血恢复${healAmt}，攻击力+20%，持续3回合！`, 'heal');
  playSound('holy');
  flash('gold');
  updateBars();
}

function _setupBattleReturnButton() {
  const winLayer = document.getElementById('winLayer');
  if (!winLayer) return;
  
  const observer = new MutationObserver(() => {
    if (winLayer.classList.contains('on')) {
      observer.disconnect();
      const btnWrap = winLayer.querySelector('.win-box > div:last-child');
      if (!btnWrap) return;
      
      const returnUrl = window._battleReturnUrl || 'town.html';
      const playerWon = lHp > 0;
      
      btnWrap.innerHTML = `
        <button class="win-btn" onclick="typeof battleNavigateTo==='function' ? battleNavigateTo('${returnUrl}') : window.location.href='${returnUrl}'">
          ${playerWon ? '🏆 返回城镇' : '💀 返回城镇'}
        </button>`;

      
      // 同步血量到存档
      if (typeof edS !== 'undefined') {
        edS.hp = Math.max(1, Math.round(lHp));
        // 同步到旅行系统的百分比血量
        if (typeof travelPlayerState !== 'undefined') {
          const maxHp = edS.maxHp || 100;
          travelPlayerState.hp = Math.max(1, Math.round((edS.hp / maxHp) * 100));
          if (typeof travelSave === 'function') travelSave();
        }
        if (typeof saveProgress === 'function') saveProgress();
      }
    }
  });
  
  observer.observe(winLayer, { attributes: true, attributeFilter: ['class'] });
}

/**
 * 构建NPC战斗角色
 */
function buildNpcForFight(npc) {
  const tierMult = { elite: 1.55, major: 1.25, func: 1.0 };
  const mult = tierMult[npc.tier] || 1.0;
  const level = npc.level || 10;
  
  // 基础属性计算（与敌人类似）
  const baseHp = 150 + level * 18;
  const baseAtk = 25 + level * 3.5;
  const baseDef = 8 + level * 1.8;
  
  return {
    id: `npc_${npc.id}`,
    name: npc.name,
    title: npc.title || npc.faction || '江湖人士',
    tag: npc.faction || 'NPC',
    tagColor: npc.color || '#c0a070',
    color: npc.color || '#c0a070',
    maxHp: Math.round(baseHp * mult),
    atk: Math.round(baseAtk * mult),
    def: Math.round(baseDef * mult),
    crit: 10 + (npc.tier === 'elite' ? 15 : npc.tier === 'major' ? 8 : 0),
    dodge: 8 + (npc.tier === 'elite' ? 10 : npc.tier === 'major' ? 5 : 0),
    maxMp: 150 + level * 5,
    speedN: 8 + (npc.tier === 'elite' ? 3 : npc.tier === 'major' ? 1 : 0),
    speed: '中',
    desc: npc.bio || npc.desc || '江湖中人',
    // NPC 使用简化形象
    stand: npc.ascii || _DEFAULT_QUESTION_ASCII,
    attack: [npc.ascii || _DEFAULT_QUESTION_ASCII],
    heavy: [npc.ascii || _DEFAULT_QUESTION_ASCII],
    hit: [npc.ascii || _DEFAULT_QUESTION_ASCII],
    down: npc.ascii || _DEFAULT_QUESTION_ASCII,
    _npcId: npc.id,
    _isNpc: true,
    _npcTier: npc.tier || 'func',
    skills: (npc.skills || ['cm01', 'cm02', 'cm03']).map((s, i) => ({ ...getSkills([s])[0], key: String(i + 1) }))
  };
}

// 页面加载时初始化战斗场景（只在 battle.html 里执行，避免 town.html 等页面引入时误触发）
(function(){
  // 只在 URL 是 battle.html 或 ascii-heroes.html（测试页）时才自动初始化
  const _path = window.location.pathname.toLowerCase();
  if (!_path.endsWith('battle.html') && !_path.endsWith('ascii-heroes.html')) return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBattleScene);
  } else {
    initBattleScene();
  }
})();

// ════════════════════════════════════════════════
//  野兽死亡效果 - 元素碎一地
// ════════════════════════════════════════════════
// 清理野兽死亡碎片
function _clearBeastDeathFragments() {
  // 查找所有碎片元素（通过z-index和position特征）
  const fragments = document.querySelectorAll('div[style*="z-index: 998"], div[style*="z-index: 999"]');
  fragments.forEach(frag => {
    frag.style.opacity = '0';
    frag.style.transition = 'opacity 0.3s';
    setTimeout(() => frag.remove(), 350);
  });
}

function _playBeastDeathEffect(loserEl, loser) {
  // 获取元素位置
  const rect = loserEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // 获取野兽的字符画
  const standArt = loser.stand || loser.frames?.[0] || '';
  if (!standArt) {
    loserEl.style.opacity = '0';
    return;
  }
  
  // 将字符画按行分割
  const lines = standArt.split('\n');
  const color = loser.color || '#c08040';
  
  // 创建容器来放置散落的字符
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: ${centerX}px;
    top: ${centerY}px;
    pointer-events: none;
    z-index: 998;
  `;
  document.body.appendChild(container);
  
  // 将每个非空白字符打散散落
  lines.forEach((line, rowIndex) => {
    const chars = line.split('');
    chars.forEach((char, colIndex) => {
      // 跳过空白字符
      if (char === ' ' || char === '\t' || char === '\r') return;
      
      const frag = document.createElement('span');
      frag.textContent = char;
      
      // 随机散落在原位置周围（CSS失效堆叠效果）
      const offsetX = (Math.random() - 0.5) * 80 + (colIndex - line.length / 2) * 3;
      const offsetY = (Math.random() - 0.5) * 60 + rowIndex * 4 + 20;
      const rot = (Math.random() - 0.5) * 90;
      
      frag.style.cssText = `
        position: absolute;
        left: ${offsetX}px;
        top: ${offsetY}px;
        font-size: 14px;
        color: ${color};
        text-shadow: 0 0 4px ${color};
        opacity: 0;
        transition: opacity 0.4s ease;
        transform: rotate(${rot}deg);
        white-space: pre;
      `;
      container.appendChild(frag);
      
      // 淡入显示
      setTimeout(() => {
        frag.style.opacity = '0.85';
      }, Math.random() * 200);
    });
  });
  
  // 隐藏原元素（直接消失，让碎片替代）
  loserEl.style.opacity = '0';
  loserEl.style.transition = 'opacity 0.1s';
}

// ── 玩家死亡倒地帧 ────────────────────────────────────
function _showPlayerDownFrame(loserEl, loser){
  const avatarState = getBattleAvatarState(loser);
  loserEl.innerHTML = buildBattleAvatarDownHtml(avatarState, loser.color);
  loserEl.style.whiteSpace = 'pre';
  loserEl.style.textAlign = 'center';
  loserEl.style.opacity = '0.9';
  loserEl.style.filter = `drop-shadow(0 0 8px ${loser.color}) grayscale(0.3)`;
  loserEl.classList.add('downed');
}

// ── 人形敌人死亡倒地帧 ────────────────────────────────
function _showHumanoidDownFrame(loserEl, loser){
  const downFrame = getHumanoidDownFrame(loser);
  loserEl.textContent = downFrame;
  loserEl.style.color = loser.color;
  loserEl.style.whiteSpace = 'pre';
  loserEl.style.textAlign = 'center';
  loserEl.style.opacity = '0.9';
  loserEl.style.filter = `drop-shadow(0 0 8px ${loser.color}) grayscale(0.3)`;
  loserEl.classList.add('downed');
}

// ── 灵魂飘散特效（玩家死亡专用）────────────────────────
function _playSoulDepartEffect(loserEl){
  const rect = loserEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:${centerX}px;top:${centerY}px;pointer-events:none;z-index:999;`;
  document.body.appendChild(container);

  // 灵魂粒子上升飘散
  const soulSyms = ['✦','☆','◈','✧','◇','★','幽灵','魂'];
  for(let i=0; i<12; i++){
    const p = document.createElement('div');
    p.textContent = soulSyms[Math.floor(Math.random()*soulSyms.length)];
    const angle = (Math.random() - 0.5) * Math.PI; // 向上的扇形
    const dist = 40 + Math.random() * 60;
    const dx = Math.cos(angle) * dist;
    const dy = -Math.abs(Math.sin(angle) * dist) - Math.random() * 30;
    p.style.cssText = `
      position:absolute;
      color:${loserEl.style.color || '#fff'};
      font-size:${12 + Math.random()*8}px;
      text-shadow:0 0 10px currentColor;
      opacity:0;
      transition: all ${0.6 + Math.random()*0.4}s ease-out;
      transform: translate(0, 0);
    `;
    container.appendChild(p);
    setTimeout(()=>{
      p.style.opacity = '0.8';
      p.style.transform = `translate(${dx}px, ${dy}px)`;
      p.style.filter = 'blur(1px)';
    }, i * 50);
    setTimeout(()=>{
      p.style.opacity = '0';
      p.style.transform = `translate(${dx*1.5}px, ${dy-20}px)`;
    }, 600 + i * 50);
    setTimeout(()=>{ if(p.parentNode) p.remove(); }, 1500);
  }
  setTimeout(()=>{ if(container.parentNode) container.remove(); }, 2000);
}

// ── 血迹溅射特效（敌人死亡专用）────────────────────────
function _playBloodSplatEffect(loserEl, color){
  const rect = loserEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:${centerX}px;top:${centerY}px;pointer-events:none;z-index:998;`;
  document.body.appendChild(container);

  // 血迹符号向四周溅射
  const bloodSyms = ['●','◉','◆','💧','♦','•','×'];
  for(let i=0; i<15; i++){
    const p = document.createElement('div');
    p.textContent = bloodSyms[Math.floor(Math.random()*bloodSyms.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 80;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const size = 8 + Math.random() * 10;
    p.style.cssText = `
      position:absolute;
      color:${color};
      font-size:${size}px;
      text-shadow:0 0 4px ${color};
      opacity:0;
      transition: all ${0.3 + Math.random()*0.3}s ease-out;
    `;
    container.appendChild(p);
    setTimeout(()=>{
      p.style.opacity = '0.7';
      p.style.transform = `translate(${dx}px, ${dy}px)`;
    }, Math.random() * 100);
    setTimeout(()=>{
      p.style.opacity = '0';
    }, 400 + Math.random() * 200);
    setTimeout(()=>{ if(p.parentNode) p.remove(); }, 1000);
  }
  setTimeout(()=>{ if(container.parentNode) container.remove(); }, 1200);
}

// ── 死亡粒子爆发 ──────────────────────────────────────
function _playDeathParticleBurst(loserEl, isPlayer){
  const rect = loserEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:${centerX}px;top:${centerY}px;pointer-events:none;z-index:997;`;
  document.body.appendChild(container);

  // 根据是否玩家选择不同颜色
  const burstColor = isPlayer ? '#ff6060' : '#ffaa40';
  const syms = ['✦','★','◆','✸','⚡','◈','⬡','⁕'];

  for(let i=0; i<20; i++){
    const p = document.createElement('div');
    p.textContent = syms[Math.floor(Math.random()*syms.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 100;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const size = 10 + Math.random() * 12;
    const delay = Math.random() * 150;

    p.style.cssText = `
      position:absolute;
      color:${burstColor};
      font-size:${size}px;
      text-shadow:0 0 8px ${burstColor};
      opacity:0;
      transition: all ${0.5 + Math.random()*0.3}s ease-out;
      transition-delay: ${delay}ms;
    `;
    container.appendChild(p);

    setTimeout(()=>{
      p.style.opacity = '1';
      p.style.transform = `translate(${dx}px, ${dy}px) scale(${0.5 + Math.random()*0.5})`;
    }, 50);
    setTimeout(()=>{
      p.style.opacity = '0';
    }, 500 + delay);
    setTimeout(()=>{ if(p.parentNode) p.remove(); }, 1200);
  }
  setTimeout(()=>{ if(container.parentNode) container.remove(); }, 1500);
}

// ════════════════════════════════════════════════
//  🎨 捏脸工坊
// ════════════════════════════════════════════════
