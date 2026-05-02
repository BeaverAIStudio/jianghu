// ════════════════════════════════════════════════════════════════════
//  sect-championship.js  —  门派比武系统
//  B3: 段位赛 + 跨门派武斗大会 + 排行榜 + 赛季奖励
//
//  存档键：
//    wuxia_sect_champ     — 比武大会全局状态
//    wuxia_sect_ranklog   — 阶级晋升日志
// ════════════════════════════════════════════════════════════════════

'use strict';

/* ── 存档 ────────────────────────────────────────────────────────── */
const SC_KEY = 'wuxia_sect_champ';
const SR_KEY = 'wuxia_sect_ranklog';

function _scLoad() {
  try { return JSON.parse(localStorage.getItem(SC_KEY) || '{}'); }
  catch(e) { return {}; }
}
function _scSave(data) {
  localStorage.setItem(SC_KEY, JSON.stringify(data));
}
function _srLoad() {
  try { return JSON.parse(localStorage.getItem(SR_KEY) || '[]'); }
  catch(e) { return []; }
}
function _srSave(arr) {
  localStorage.setItem(SR_KEY, JSON.stringify(arr));
}

/* ── Toast 适配 ──────────────────────────────────────────────────── */
function _scToast(msg, type) {
  if (typeof townToast === 'function') { townToast(msg); return; }
  if (typeof showToast === 'function') { showToast(msg, type); return; }
  console.log('[sect-champ]', msg);
}

/* ── 辅助 ────────────────────────────────────────────────────────── */
function _scGetSect(id) {
  return (typeof SECTS !== 'undefined') ? SECTS.find(s => s.id === id) : null;
}
function _scEdS() {
  return (typeof window !== 'undefined' && window.edS) || {};
}
function _scTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

/* ── 门派比武"将将胡"特殊事件池 ──────────────────────────────────── */
const SC_JIANGHU_EVENTS = {
  darkHorse: {
    id: 'darkHorse',
    chance: 0.05,
    icon: '🐎',
    title: '黑马逆袭',
    desc: '关键时刻，你爆发出超乎寻常的潜力，以弱胜强！',
    effect: (winRate) => ({ winRate: Math.min(winRate + 0.25, 0.95), msg: '🐎 黑马逆袭！胜率大幅提升！' }),
  },
  crowdFavorite: {
    id: 'crowdFavorite',
    chance: 0.04,
    icon: '🎉',
    title: '众望所归',
    desc: '观众为你呐喊助威，士气大振！',
    effect: (reward) => ({ reward: { ...reward, fame: (reward.fame || 0) + 20, contrib: Math.floor(reward.contrib * 1.5) }, msg: '🎉 众望所归！奖励大幅提升！' }),
  },
  hiddenMaster: {
    id: 'hiddenMaster',
    chance: 0.03,
    icon: '👤',
    title: '隐世高人指点',
    desc: '一位神秘前辈暗中指点，让你领悟了新的招式……',
    effect: () => ({ skillBonus: true, msg: '👤 领悟新招式！临时攻击+15%' }),
  },
  sectGlory: {
    id: 'sectGlory',
    chance: 0.02,
    icon: '⭐',
    title: '门派荣光',
    desc: '你的出色表现为门派赢得了无上荣耀！',
    effect: (reward) => ({ reward: { ...reward, sectBonus: true, contrib: reward.contrib * 2 }, msg: '⭐ 门派荣光！贡献翻倍！' }),
  },
};

/* ════════════════════════════════════════════════════════════════════
 *  一、门派内部段位赛
 *  玩家在门派内从弟子→精英→长老→元老逐级挑战
 *  每级需战胜一位"守擂者"才能晋升
 *
 *  晋升条件：
 *    1. 贡献值达到阈值（与 SECT_RANK_CFG 一致）
 *    2. 等级达到要求
 *    3. 击败对应守擂者
 * ════════════════════════════════════════════════════════════════════ */

// 段位挑战配置（每个门派不同）
const SC_RANK_GUARDIANS = {
  // key = sectId, value = { rank: { name, title, reqLv, reqContrib, reward } }
  // 默认在 initRankGuardians 中按门派tier生成
};

function _scInitGuardians() {
  if (typeof SECTS === 'undefined') return;
  SECTS.forEach(sect => {
    if (SC_RANK_GUARDIANS[sect.id]) return; // 已有自定义配置
    const t = sect.tier;
    const names = {
      shaolin:  { elite:'慧空武僧', elder:'玄苦大师', grand:'玄慈方丈' },
      wudang:   { elite:'清虚道长', elder:'纯阳真人', grand:'冲虚道长' },
      xiaoyao:  { elite:'苏星河',   elder:'无崖子',   grand:'天山童姥' },
      riyue:    { elite:'向问天',   elder:'任我行',   grand:'东方不败' },
      huashan:  { elite:'令狐冲',   elder:'风清扬',   grand:'岳怀瑾' },
      mingjiao: { elite:'韦一笑',   elder:'杨逍',     grand:'张无忌' },
      wudu:     { elite:'蓝凤凰',   elder:'何铁手',   grand:'五毒教主' },
      tangmen:  { elite:'唐无影',   elder:'唐百晓',   grand:'唐门门主' },
      taohuadao:{ elite:'曲灵风',   elder:'冯默风',   grand:'黄药师' },
      emei:     { elite:'静玄师太', elder:'灭绝师太', grand:'郭襄祖师' },
      kongtong: { elite:'关明长老', elder:'唐文亮',   grand:'掌门真人' },
      kunlun:   { elite:'何足道',   elder:'班淑娴',   grand:'昆仑掌门' },
      nangong:  { elite:'南宫少主', elder:'南宫老爷', grand:'南宫世家主' },
      tianshan: { elite:'六阳弟子', elder:'折梅手',   grand:'天山长老' },
      shengguang:{ elite:'圣骑士',  elder:'审判官',   grand:'光明祭司' },
    };
    const def = names[sect.id];
    SC_RANK_GUARDIANS[sect.id] = {
      elite: {
        name: (def && def.elite) || '精英长老',
        title: '内门守擂者',
        reqLv: t === 'supreme' ? 25 : (t === 'major' ? 18 : 12),
        reqContrib: (typeof SECT_RANK_CFG !== 'undefined') ? (SECT_RANK_CFG.elite?.minContrib || 80) : 80,
        levelBase: t === 'supreme' ? 35 : (t === 'major' ? 25 : 18),
        reward: { contrib: 30, silver: 100, exp: 200 },
        narrWin: '你击败了内门守擂者，正式晋升为「精英弟子」！',
        narrLose: '你惜败于守擂者……再勤加修炼，下次必能胜出。',
      },
      elder: {
        name: (def && def.elder) || '门派长老',
        title: '长老守擂者',
        reqLv: t === 'supreme' ? 40 : (t === 'major' ? 30 : 20),
        reqContrib: (typeof SECT_RANK_CFG !== 'undefined') ? (SECT_RANK_CFG.elder?.minContrib || 250) : 250,
        levelBase: t === 'supreme' ? 55 : (t === 'major' ? 40 : 28),
        reward: { contrib: 80, silver: 300, exp: 600, fame: 15 },
        narrWin: '你战胜了长老守擂者，被尊为「门派长老」！全门弟子皆刮目相看。',
        narrLose: '长老守擂者的实力深不可测……你败下阵来，但已崭露头角。',
      },
      grand: {
        name: (def && def.grand) || '掌门/元老',
        title: '元老守擂者',
        reqLv: t === 'supreme' ? 60 : (t === 'major' ? 45 : 30),
        reqContrib: (typeof SECT_RANK_CFG !== 'undefined') ? (SECT_RANK_CFG.grand?.minContrib || 600) : 600,
        levelBase: t === 'supreme' ? 75 : (t === 'major' ? 55 : 38),
        reward: { contrib: 200, silver: 800, exp: 1500, fame: 50, title: '门派元老' },
        narrWin: '不可思议！你击败了' + (def?.grand || '元老') + '，被奉为「门派元老」！这一刻，你的名字将刻入门派史册！',
        narrLose: '元老的实力远在你之上……这条路，还很长。',
      },
    };
  });
}

// 初始化
_scInitGuardians();

/**
 * 获取玩家是否可以发起段位挑战
 * @param {string} targetRank - 'elite' | 'elder' | 'grand'
 * @returns {{ can: boolean, reason: string }}
 */
function scCanChallenge(targetRank) {
  const ed = _scEdS();
  if (!ed.sect) return { can: false, reason: '你尚未加入任何门派' };

  const guards = SC_RANK_GUARDIANS[ed.sect];
  if (!guards || !guards[targetRank]) return { can: false, reason: '该门派暂无此段位挑战' };

  const cfg = guards[targetRank];

  // 等级检查
  if ((ed.level || 1) < cfg.reqLv) {
    return { can: false, reason: `需要等级 ≥ Lv${cfg.reqLv}（当前 Lv${ed.level || 1}）` };
  }
  // 贡献检查
  if ((ed.sectContrib || 0) < cfg.reqContrib) {
    return { can: false, reason: `需要贡献 ≥ ${cfg.reqContrib}（当前 ${ed.sectContrib || 0}）` };
  }
  // 当前阶级检查（不能越级挑战）
  const rankOrder = ['disciple', 'elite', 'elder', 'grand'];
  const currentIdx = rankOrder.indexOf(ed.sectRank || 'disciple');
  const targetIdx = rankOrder.indexOf(targetRank);
  if (targetIdx !== currentIdx + 1) {
    if (targetIdx > currentIdx + 1) return { can: false, reason: '需先晋升至前一阶级' };
    return { can: false, reason: '你已是该阶级或更高' };
  }
  // 今日冷却检查
  const state = _scLoad();
  const today = _scTodayStr();
  const todayKey = `rankChallenge_${today}`;
  if ((state[todayKey] || 0) >= 3) {
    return { can: false, reason: '今日挑战次数已用完（每日3次）' };
  }

  return { can: true, reason: '' };
}

/** 检查并触发比武"将将胡"事件 */
function _checkScJianghuEvent(eventType, ...args) {
  const evt = SC_JIANGHU_EVENTS[eventType];
  if (!evt) return null;
  if (Math.random() < evt.chance) {
    return { ...evt, result: evt.effect(...args) };
  }
  return null;
}

/**
 * 执行段位挑战
 * @param {string} targetRank
 */
function scDoRankChallenge(targetRank) {
  const check = scCanChallenge(targetRank);
  if (!check.can) { _scToast('⚠ ' + check.reason); return; }

  const ed = _scEdS();
  const sect = _scGetSect(ed.sect);
  if (!sect) return;

  const cfg = SC_RANK_GUARDIANS[ed.sect][targetRank];
  const tierMult = { supreme: 1.6, major: 1.25, minor: 1.0 }[sect.tier] || 1.1;
  const playerLv = ed.level || 1;
  const npcLv = cfg.levelBase + Math.floor(playerLv * 0.3);
  let winRate = Math.max(0.20, Math.min(0.75,
    0.45 + (playerLv - npcLv) * 0.03 + (ed.sectContrib || 0) * 0.0003
  ));

  // 【将将胡】检查特殊事件
  let jianghuEvent = null;
  let rewardMod = { ...cfg.reward };
  let skillBonus = false;

  // 黑马逆袭 - 提升胜率
  const darkHorseEvt = _checkScJianghuEvent('darkHorse', winRate);
  if (darkHorseEvt) {
    winRate = darkHorseEvt.result.winRate;
    jianghuEvent = darkHorseEvt;
  }

  const won = Math.random() < winRate;

  // 获胜后检查其他事件
  if (won) {
    // 众望所归 - 提升奖励
    const crowdEvt = _checkScJianghuEvent('crowdFavorite', rewardMod);
    if (crowdEvt) {
      rewardMod = crowdEvt.result.reward;
      jianghuEvent = crowdEvt;
    }

    // 隐世高人指点
    const masterEvt = _checkScJianghuEvent('hiddenMaster');
    if (masterEvt) {
      skillBonus = true;
      if (!jianghuEvent) jianghuEvent = masterEvt;
    }

    // 门派荣光
    const gloryEvt = _checkScJianghuEvent('sectGlory', rewardMod);
    if (gloryEvt) {
      rewardMod = gloryEvt.result.reward;
      jianghuEvent = gloryEvt;
    }
  }

  // 消耗挑战次数
  const state = _scLoad();
  const today = _scTodayStr();
  const todayKey = `rankChallenge_${today}`;
  state[todayKey] = (state[todayKey] || 0) + 1;
  _scSave(state);

  // 展示结果
  _scShowRankResult(won, targetRank, cfg, sect, jianghuEvent, rewardMod, skillBonus);
}

/**
 * 段位挑战结果弹窗
 */
function _scShowRankResult(won, targetRank, cfg, sect, jianghuEvent, rewardMod, skillBonus) {
  const oldOverlay = document.getElementById('scRankResultOverlay');
  if (oldOverlay) oldOverlay.remove();

  const el = document.createElement('div');
  el.id = 'scRankResultOverlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);animation:fadeIn .2s ease';

  const rankCfg = (typeof SECT_RANK_CFG !== 'undefined') ? SECT_RANK_CFG[targetRank] : null;
  const rankName = rankCfg ? rankCfg.name : targetRank;
  const rankIcon = rankCfg ? rankCfg.icon : '🏅';

  // 使用修改后的奖励
  const finalReward = rewardMod || cfg.reward;

  el.innerHTML = `
    <div style="width:min(420px,90vw);border-radius:14px;background:linear-gradient(170deg,#1a1520,#140e14);border:1px solid ${won ? (sect.color||'#80e880')+'60' : '#ff606040'};box-shadow:0 0 40px rgba(0,0,0,.6);overflow:hidden">
      <div style="padding:20px 24px 16px;text-align:center">
        <div style="font-size:48px;margin-bottom:12px">${won ? '🏆' : '💫'}</div>
        <div style="font-size:16px;color:${won ? '#f0d090' : '#ff8888'};font-weight:bold;letter-spacing:2px;margin-bottom:8px">
          ${won ? '挑战成功！' : '挑战失败'}
        </div>
        <div style="font-size:13px;color:rgba(200,180,160,.7);line-height:1.8;padding:0 8px">
          ${won ?
            `你击败了「${cfg.name}」（${cfg.title}）<br>正式晋升为 <span style="color:${sect.color};font-weight:bold">${rankIcon} ${rankName}</span>！` :
            `你惜败于「${cfg.name}」（${cfg.title}）<br>再勤加修炼，下次必能胜出。`
          }
        </div>
        ${jianghuEvent ? `
        <div style="margin-top:12px;padding:10px;background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.3);border-radius:8px">
          <div style="font-size:20px;margin-bottom:4px">${jianghuEvent.icon}</div>
          <div style="font-size:13px;color:#ffd700;font-weight:bold">✨ 将将胡 · ${jianghuEvent.title}</div>
          <div style="font-size:11px;color:#e0d0a0;margin-top:4px">${jianghuEvent.desc}</div>
          ${jianghuEvent.result && jianghuEvent.result.msg ? `<div style="font-size:11px;color:#80e880;margin-top:4px">${jianghuEvent.result.msg}</div>` : ''}
        </div>` : ''}
        ${skillBonus ? `
        <div style="margin-top:8px;padding:8px;background:rgba(128,176,255,.08);border:1px solid rgba(128,176,255,.3);border-radius:8px">
          <div style="font-size:11px;color:#80b0ff">👤 领悟新招式！临时攻击+15%</div>
        </div>` : ''}
      </div>
      ${won ? `
      <div style="padding:0 24px 16px">
        <div style="display:flex;justify-content:center;gap:16px;font-size:12px">
          <span style="color:#80e880">⚔ 贡献 +${finalReward.contrib || 0}</span>
          <span style="color:#e0c060">💰 银两 +${finalReward.silver || 0}</span>
          <span style="color:#80b0ff">✨ 经验 +${finalReward.exp || 0}</span>
          ${finalReward.fame ? `<span style="color:#ffaa40">⭐ 声望 +${finalReward.fame}</span>` : ''}
        </div>
        ${(rankCfg && rankCfg.mult > 1) ? `<div style="text-align:center;font-size:11px;color:rgba(200,180,140,.5);margin-top:8px">门派被动加成 ×${rankCfg.mult} 已激活</div>` : ''}
      </div>` : ''}
      <div style="padding:12px 24px 18px;text-align:center">
        <button onclick="document.getElementById('scRankResultOverlay').remove()" style="padding:8px 32px;border-radius:8px;border:1px solid rgba(200,180,140,.3);background:rgba(200,180,140,.08);color:#d0c0a0;font-size:13px;cursor:pointer;letter-spacing:1px">
          确定
        </button>
      </div>
    </div>`;
  document.body.appendChild(el);

  if (won) {
    // 发放奖励（finalReward 已在上方声明）
    const ed = _scEdS();
    ed.sectContrib = (ed.sectContrib || 0) + (finalReward.contrib || 0);
    ed.silver = (ed.silver || 0) + (finalReward.silver || 0);
    // 经验
    if (typeof addPlayerExp === 'function') {
      addPlayerExp(finalReward.exp || 0);
    } else if (ed.exp !== undefined) {
      ed.exp = (ed.exp || 0) + (finalReward.exp || 0);
    }
    // 声望
    if (finalReward.fame && typeof jianghuSave === 'function') {
      // 江湖声望系统
      try {
        if (typeof window.jianghuState !== 'undefined' && window.jianghuState.reputation) {
          window.jianghuState.reputation.fame = (window.jianghuState.reputation.fame || 0) + finalReward.fame;
          if (typeof jianghuSave === 'function') jianghuSave();
        }
      } catch(e) {}
    }
    // 称号
    if (cfg.reward.title && ed.titles) {
      if (!ed.titles.includes(cfg.reward.title)) ed.titles.push(cfg.reward.title);
    }
    // 晋升阶级
    ed.sectRank = targetRank;
    // 存档
    if (typeof saveGameState === 'function') saveGameState();
    try { localStorage.setItem('wuxia_editor', JSON.stringify(ed)); } catch(e) {}

    // 晋升日志
    const log = _srLoad();
    log.unshift({
      time: Date.now(),
      date: _scTodayStr(),
      sect: sect.id,
      sectName: sect.name,
      rank: targetRank,
      rankName: rankName,
      contrib: ed.sectContrib,
    });
    if (log.length > 50) log.length = 50;
    _srSave(log);

    // 刷新UI
    setTimeout(() => {
      if (typeof renderArena === 'function' && typeof currentSectId !== 'undefined') {
        renderArena(_scGetSect(currentSectId));
      }
      if (typeof renderHero === 'function' && typeof currentSectId !== 'undefined') {
        renderHero(_scGetSect(currentSectId));
      }
      if (typeof renderSectsPage === 'function') renderSectsPage();
      if (typeof townRefreshStatus === 'function') townRefreshStatus();
    }, 300);
  }
}

/**
 * 渲染段位挑战面板（嵌入 sect.html 演武场下方）
 */
function scRenderRankChallenge(sectId) {
  const sect = _scGetSect(sectId);
  if (!sect) return '';
  const ed = _scEdS();
  if (ed.sect !== sectId) return '<div style="text-align:center;font-size:12px;color:rgba(200,180,140,.4);padding:20px">⚔️ 加入门派后可参加段位挑战</div>';

  const guards = SC_RANK_GUARDIANS[sectId];
  if (!guards) return '';
  const currentRank = ed.sectRank || 'disciple';
  const rankOrder = ['disciple', 'elite', 'elder', 'grand'];
  const currentIdx = rankOrder.indexOf(currentRank);

  const state = _scLoad();
  const today = _scTodayStr();
  const todayUsed = state[`rankChallenge_${today}`] || 0;
  const todayMax = 3;

  let html = `
    <div style="margin-top:20px;padding:16px;background:rgba(240,200,80,.04);border:1px dashed rgba(240,200,80,.15);border-radius:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13px;color:#e0c060;font-weight:bold">🎖 门派段位赛</span>
        <span style="font-size:11px;color:rgba(200,180,140,.5)">今日挑战 ${todayUsed}/${todayMax}</span>
      </div>`;

  ['elite', 'elder', 'grand'].forEach(rank => {
    const cfg = guards[rank];
    const rankIdx = rankOrder.indexOf(rank);
    const isActive = rankIdx === currentIdx + 1; // 下一个可挑战
    const isDone = rankIdx <= currentIdx;
    const isLocked = rankIdx > currentIdx + 1;
    const check = isActive ? scCanChallenge(rank) : null;

    html += `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:6px;border-radius:8px;background:${isDone ? 'rgba(128,232,128,.06)' : (isActive ? 'rgba(240,200,80,.06)' : 'rgba(255,255,255,.02)')};border:1px solid ${isDone ? 'rgba(128,232,128,.15)' : (isActive ? 'rgba(240,200,80,.2)' : 'rgba(255,255,255,.04)')}">
        <div style="font-size:20px;flex-shrink:0">${isDone ? '✅' : (isActive ? (todayUsed >= todayMax ? '⏳' : '⚔️') : '🔒')}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;color:${isDone ? '#80e880' : (isActive ? '#f0d090' : 'rgba(200,180,140,.4)')};font-weight:bold">${cfg.name} <span style="font-size:10px;font-weight:normal;opacity:.7">（${cfg.title}）</span></div>
          <div style="font-size:10px;color:rgba(180,160,140,.4);margin-top:2px">
            Lv${cfg.reqLv}+ · 贡献${cfg.reqContrib}+ · 奖励 ⚔${cfg.reward.contrib} 💰${cfg.reward.silver}
          </div>
          ${isActive && !check.can ? `<div style="font-size:10px;color:#ff8888;margin-top:2px">${check.reason}</div>` : ''}
          ${isDone ? '<div style="font-size:10px;color:#80e880;margin-top:2px">已通过 ✓</div>' : ''}
        </div>
        ${isActive && check.can ? `
          <button onclick="scDoRankChallenge('${rank}')" style="padding:6px 14px;border-radius:6px;border:1px solid ${sect.color}50;background:${sect.color}15;color:${sect.color};font-size:11px;cursor:pointer;white-space:nowrap;flex-shrink:0">挑战</button>
        ` : ''}
      </div>`;
  });

  html += '</div>';
  return html;
}

/* ════════════════════════════════════════════════════════════════════
 *  二、跨门派武斗大会（赛季制）
 *  每30天一个赛季，玩家可在赛季内参加武斗大会
 *  淘汰赛制：16人（含玩家），4轮决出冠军
 *  赛季奖励根据最终排名发放
 * ════════════════════════════════════════════════════════════════════ */

const SC_SEASON_DAYS = 30;
const SC_TOURNEY_ROUNDS = 4; // 16→8→4→2→1

// 赛季状态
function scGetSeason() {
  const state = _scLoad();
  if (!state.seasonStart) {
    state.seasonStart = Date.now();
    state.seasonNum = 1;
    state.seasonPlayed = false; // 本赛季是否已参赛
    state.seasonResult = null;   // 本赛季结果
    state.seasonBestRank = 99;
    _scSave(state);
  }
  return state;
}

function scSeasonDay() {
  const s = scGetSeason();
  return Math.floor((Date.now() - s.seasonStart) / 86400000);
}

function scSeasonRemaining() {
  return Math.max(0, SC_SEASON_DAYS - scSeasonDay());
}

function scSeasonInfo() {
  const s = scGetSeason();
  const day = scSeasonDay();
  const remaining = scSeasonRemaining();
  const num = s.seasonNum || 1;
  const phase = remaining > 20 ? '报名阶段' : (remaining > 0 ? '激烈角逐中' : '赛季结算');
  const played = s.seasonPlayed || false;
  return { num, day, remaining, phase, played, result: s.seasonResult, bestRank: s.seasonBestRank || 99 };
}

// 检查并推进赛季
function scCheckSeasonTick() {
  const state = _scLoad();
  if (!state.seasonStart) { scGetSeason(); return; }
  const day = Math.floor((Date.now() - state.seasonStart) / 86400000);
  if (day >= SC_SEASON_DAYS) {
    // 新赛季
    state.seasonStart = Date.now();
    state.seasonNum = (state.seasonNum || 0) + 1;
    state.seasonPlayed = false;
    state.seasonResult = null;
    // 保留 bestRank（历史最佳）
    _scSave(state);
    return true; // 赛季已更新
  }
  return false;
}

// 生成参赛选手
function scGenerateContestants() {
  const ed = _scEdS();
  const playerSect = ed.sect || null;
  const playerLv = ed.level || 1;

  // 从各门派随机选15名选手 + 玩家
  const contestants = [];

  // 玩家自己
  contestants.push({
    id: 'player',
    name: ed.name || '少侠',
    sect: playerSect,
    sectName: playerSect ? (_scGetSect(playerSect)?.name || playerSect) : '散人',
    level: playerLv,
    isPlayer: true,
  });

  // 从25门派中随机选（排除玩家自己的门派，这样更有趣）
  const allSects = (typeof SECTS !== 'undefined') ? [...SECTS] : [];
  const otherSects = allSects.filter(s => s.id !== playerSect);
  // 洗牌
  for (let i = otherSects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [otherSects[i], otherSects[j]] = [otherSects[j], otherSects[i]];
  }

  // 每门派1-2名选手，凑满15名
  let count = 1;
  for (const sect of otherSects) {
    if (count >= 16) break;
    const c = {
      id: `npc_${sect.id}_${count}`,
      name: _scRandomContestantName(sect.id, count),
      sect: sect.id,
      sectName: sect.name,
      level: Math.max(5, Math.floor(playerLv * (0.7 + Math.random() * 0.6))),
      tier: sect.tier,
      isPlayer: false,
    };
    contestants.push(c);
    count++;
  }

  return contestants;
}

const SC_CONTESTANT_NAMES = {
  shaolin:  ['慧远','慧定','慧觉','觉远','空闻'],
  wudang:   ['清虚','清风','明月','松溪','冲虚'],
  xiaoyao:  ['苏星河','丁春秋','薛慕华','范百岁','虚竹'],
  riyue:    ['向问天','童百熊','桑三娘','曲洋','任我行'],
  huashan:  ['令狐冲','岳灵珊','林平之','劳德诺','风清扬'],
  mingjiao: ['韦一笑','范遥','殷天正','谢逊','黛绮丝'],
  wudu:     ['蓝凤凰','何铁手','齐御风','葛长老','温青青'],
  tangmen:  ['唐无影','唐百晓','唐暗器','唐千机','唐紫岚'],
  taohuadao:['程英','陆乘风','冯默风','曲灵风','黄蓉'],
  emei:     ['周芷若','丁敏君','纪晓芙','贝锦仪','灭绝师太'],
  kongtong: ['关明','宗维侠','唐文亮','常敬之','耿天霸'],
  kunlun:   ['何足道','班淑娴','西华子','青灵子','昆仑散人'],
  nangong:  ['南宫少爷','南宫婉','南宫飞','南宫博','南宫离'],
  tianshan: ['天山弟子','折梅手','六阳掌','冰魄银针','天山侍女'],
  shengguang:['圣骑士','牧师长老','审判官','圣光使者','光明祭司'],
  diancang: ['点苍剑士','蛊师弟子','南疆行者','苗疆侠客','点苍掌门'],
  xixia:    ['密宗僧人','西域武士','预言者','国师护卫','西夏王子'],
  tianlong: ['罗汉弟子','龙象武士','吐蕃勇士','天龙护法','天龙帮主'],
  xuanming: ['玄冥弟子','寒冰使者','黑衣杀手','鹿杖客','鹤笔翁'],
  haisha:   ['海盗头目','七杀刀客','东海浪人','海沙船长','水贼喽啰'],
  xuegu:    ['血骨卫士','炼血者','死士','血骨长老','血骨门主'],
  lingxiao: ['凌霄弟子','情报探子','剑术高手','阁主亲信','凌霄楼主'],
  qingcheng:['青城弟子','余沧海','侯人英','洪人雄','于人豪'],
  guigu:    ['鬼谷弟子','算命先生','阵法师','谋士','鬼谷门客'],
  tiandibang:['天地帮众','堂主','护法','分舵主','天地帮少主'],
};

function _scRandomContestantName(sectId, idx) {
  const pool = SC_CONTESTANT_NAMES[sectId];
  if (pool && pool.length > 0) {
    return pool[idx % pool.length];
  }
  return '神秘侠客';
}

// 模拟淘汰赛
function scSimulateTourney(contestants) {
  const rounds = [];
  let current = [...contestants];

  for (let r = 0; r < SC_TOURNEY_ROUNDS && current.length > 1; r++) {
    const nextRound = [];
    const matches = [];
    // 洗牌配对
    for (let i = 0; i < current.length - 1; i += 2) {
      const a = current[i];
      const b = current[i + 1];
      let winner;
      if (a.isPlayer || b.isPlayer) {
        // 玩家比赛：基于属性计算胜率
        const player = a.isPlayer ? a : b;
        const opponent = a.isPlayer ? b : a;
        const ed = _scEdS();
        const playerPower = (ed.level || 1) * 10 + (ed.atk || 0) * 3 + (ed.def || 0) * 2 + (ed.hp || 150) * 0.1;
        const oppPower = opponent.level * 10 + (opponent.level * 1.2) * 3;
        const tierBonus = { supreme: 1.3, major: 1.1, minor: 1.0 }[opponent.tier] || 1.0;
        const winRate = Math.max(0.15, Math.min(0.80,
          0.45 + (playerPower - oppPower * tierBonus) * 0.001
        ));
        winner = Math.random() < winRate ? player : opponent;
      } else {
        // NPC vs NPC：级别高的胜率更高
        const diff = a.level - b.level;
        const winRate = 0.5 + diff * 0.04;
        winner = Math.random() < winRate ? a : b;
      }
      matches.push({ a, b, winner });
      nextRound.push(winner);
    }
    rounds.push({ round: r + 1, matches });
    current = nextRound;
  }

  return { rounds, champion: current[0] || null };
}

// 参加武斗大会
function scEnterTourney() {
  scCheckSeasonTick(); // 检查赛季

  const state = _scLoad();
  if (state.seasonPlayed) {
    _scToast('本赛季已参加过武斗大会，下赛季再来！');
    return;
  }

  const ed = _scEdS();
  if (!ed.sect) {
    _scToast('你需要先加入一个门派才能参加武斗大会！');
    return;
  }

  // 检查等级
  if ((ed.level || 1) < 10) {
    _scToast('需要等级 ≥ Lv10 才能参加武斗大会！');
    return;
  }

  // 扣报名费 50银两
  if ((ed.silver || 0) < 50) {
    _scToast('报名费 50 银两不足！');
    return;
  }
  ed.silver = (ed.silver || 0) - 50;
  if (typeof saveGameState === 'function') saveGameState();

  // 生成并模拟
  const contestants = scGenerateContestants();
  const result = scSimulateTourney(contestants);

  // 计算玩家排名
  let playerRank = 16; // 最差16强
  // 倒序查找最后一个包含玩家比赛的轮次，以确定最终排名
  let playerFound = null;
  for (let i = result.rounds.length - 1; i >= 0; i--) {
    const r = result.rounds[i];
    if (r.matches.some(m => m.a.isPlayer || m.b.isPlayer)) {
      playerFound = r;
      break;
    }
  }
  if (playerFound) {
    const playerMatch = playerFound.matches.find(m => m.a.isPlayer || m.b.isPlayer);
    if (playerMatch && playerMatch.winner.isPlayer) {
      // 玩家赢了这轮
      playerRank = Math.max(1, 16 / Math.pow(2, playerFound.round));
    } else {
      // 玩家输了这轮
      playerRank = 16 / Math.pow(2, playerFound.round - 1);
    }
  }
  playerRank = Math.round(playerRank);

  // 存储结果
  state.seasonPlayed = true;
  state.seasonResult = {
    date: _scTodayStr(),
    rank: playerRank,
    rounds: result.rounds.map(r => ({
      round: r.round,
      result: r.matches.map(m => ({
        player: `${m.a.name}(${m.a.sectName || '散人'}) vs ${m.b.name}(${m.b.sectName || '散人'})`,
        winner: m.winner.name + (m.winner.isPlayer ? '（你！）' : ''),
        playerMatch: m.a.isPlayer || m.b.isPlayer,
        playerWon: (m.a.isPlayer || m.b.isPlayer) ? m.winner.isPlayer : null,
      })),
    })),
    champion: result.champion ? result.champion.name + '（' + (result.champion.sectName || '散人') + '）' : '未知',
  };
  if (!state.seasonBestRank || playerRank < state.seasonBestRank) {
    state.seasonBestRank = playerRank;
  }
  _scSave(state);

  // 发放奖励
  const rewards = scGetTourneyRewards(playerRank);
  if (rewards) {
    ed.sectContrib = (ed.sectContrib || 0) + (rewards.contrib || 0);
    ed.silver = (ed.silver || 0) + (rewards.silver || 0);
    if (rewards.exp) {
      if (typeof addPlayerExp === 'function') addPlayerExp(rewards.exp);
      else if (ed.exp !== undefined) ed.exp = (ed.exp || 0) + rewards.exp;
    }
    if (rewards.fame && typeof jianghuSave === 'function') {
      try {
        if (typeof window.jianghuState !== 'undefined' && window.jianghuState.reputation) {
          window.jianghuState.reputation.fame = (window.jianghuState.reputation.fame || 0) + rewards.fame;
          if (typeof jianghuSave === 'function') jianghuSave();
        }
      } catch(e) {}
    }
    if (typeof saveGameState === 'function') saveGameState();
  }

  // 显示结果
  _scShowTourneyResult(result, playerRank, rewards);
}

// 武斗大会奖励表
function scGetTourneyRewards(rank) {
  const table = {
    1:  { contrib: 100, silver: 500, exp: 2000, fame: 50, label: '🏆 武状元' },
    2:  { contrib: 60,  silver: 300, exp: 1200, fame: 30, label: '🥈 亚军' },
    3:  { contrib: 40,  silver: 200, exp: 800,  fame: 20, label: '🥉 季军' },
    4:  { contrib: 25,  silver: 150, exp: 500, fame: 15, label: '四强' },
    5:  { contrib: 20,  silver: 120, exp: 400, fame: 10, label: '八强' },
    8:  { contrib: 15,  silver: 80,  exp: 300, fame: 5,  label: '十六强' },
    9:  { contrib: 10,  silver: 50,  exp: 200, fame: 0,  label: '参赛奖' },
  };
  if (table[rank]) return { ...table[rank] };
  if (rank <= 4) return { ...table[4] };
  if (rank <= 8) return { ...table[5] };
  return { ...table[8] };
}

// 武斗大会结果弹窗
function _scShowTourneyResult(result, playerRank, rewards) {
  const oldOverlay = document.getElementById('scTourneyOverlay');
  if (oldOverlay) oldOverlay.remove();

  const el = document.createElement('div');
  el.id = 'scTourneyOverlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);animation:fadeIn .2s ease;overflow-y:auto;padding:20px';

  const rankLabel = rewards.label || '参赛';
  const rankColor = playerRank <= 3 ? '#ffd700' : (playerRank <= 8 ? '#c0c0c0' : '#cd7f32');

  let roundsHtml = '';
  result.rounds.forEach(round => {
    roundsHtml += `<div style="margin-bottom:8px"><div style="font-size:11px;color:#e0c060;font-weight:bold;margin-bottom:4px">▸ 第${round.round}轮</div>`;
    round.matches.forEach(m => {
      const isPMatch = m.playerMatch;
      const pWon = m.playerWon;
      roundsHtml += `<div style="font-size:11px;padding:3px 8px;border-radius:4px;margin-bottom:2px;${isPMatch ? 'background:rgba(240,200,80,.1);border:1px solid rgba(240,200,80,.2)' : ''}">
        ${m.player} → <span style="color:${isPMatch ? (pWon ? '#80e880' : '#ff8888') : '#a0a0a0'}">${m.winner}</span>
      </div>`;
    });
    roundsHtml += '</div>';
  });

  el.innerHTML = `
    <div style="width:min(480px,92vw);max-height:85vh;overflow-y:auto;border-radius:14px;background:linear-gradient(170deg,#1a1520,#140e14);border:1px solid ${rankColor}40;box-shadow:0 0 40px rgba(0,0,0,.6)">
      <div style="padding:20px 24px 16px;text-align:center">
        <div style="font-size:36px;margin-bottom:8px">${rankLabel.split(' ')[0]}</div>
        <div style="font-size:16px;color:${rankColor};font-weight:bold;letter-spacing:2px">${rankLabel}</div>
        <div style="font-size:12px;color:rgba(200,180,140,.5);margin-top:4px">最终排名：第 ${playerRank} 名</div>
        <div style="font-size:12px;color:rgba(200,180,140,.4);margin-top:2px">冠军：${result.champion}</div>
      </div>

      <div style="padding:0 24px 12px">
        <div style="display:flex;justify-content:center;gap:12px;font-size:12px;margin-bottom:12px">
          <span style="color:#80e880">⚔ 贡献 +${rewards.contrib || 0}</span>
          <span style="color:#e0c060">💰 银两 +${rewards.silver || 0}</span>
          <span style="color:#80b0ff">✨ 经验 +${rewards.exp || 0}</span>
          ${rewards.fame ? `<span style="color:#ffaa40">⭐ 声望 +${rewards.fame}</span>` : ''}
        </div>
      </div>

      <div style="padding:0 24px 16px;max-height:40vh;overflow-y:auto">
        ${roundsHtml}
      </div>

      <div style="padding:12px 24px 18px;text-align:center">
        <button onclick="document.getElementById('scTourneyOverlay').remove()" style="padding:8px 32px;border-radius:8px;border:1px solid rgba(200,180,140,.3);background:rgba(200,180,140,.08);color:#d0c0a0;font-size:13px;cursor:pointer;letter-spacing:1px">
          确定
        </button>
      </div>
    </div>`;
  document.body.appendChild(el);
}

/**
 * 渲染武斗大会面板
 */
function scRenderTourney() {
  scCheckSeasonTick();
  const info = scSeasonInfo();
  const ed = _scEdS();

  let html = `
    <div style="margin-top:16px;padding:16px;background:rgba(255,160,40,.04);border:1px dashed rgba(255,160,40,.15);border-radius:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13px;color:#ffa040;font-weight:bold">🏯 江湖武斗大会</span>
        <span style="font-size:10px;color:rgba(200,180,140,.4)">第${info.num}赛季 · ${info.phase}</span>
      </div>
      <div style="font-size:11px;color:rgba(200,180,140,.5);margin-bottom:12px">
        赛季剩余 <b style="color:#ffa040">${info.remaining}</b> 天 · 报名费 💰50 · 16人淘汰赛
      </div>`;

  if (info.played && info.result) {
    // 已参赛：显示结果
    const rewards = scGetTourneyRewards(info.result.rank);
    html += `
      <div style="padding:10px 12px;background:rgba(255,255,255,.03);border-radius:8px;margin-bottom:8px">
        <div style="font-size:12px;color:#d0c090">
          本赛季战绩：<b style="color:${info.result.rank <= 3 ? '#ffd700' : (info.result.rank <= 8 ? '#c0c0c0' : '#cd7f32')}">第${info.result.rank}名</b> ${rewards.label}
        </div>
        <div style="font-size:10px;color:rgba(180,160,140,.4);margin-top:4px">冠军：${info.result.champion}</div>
      </div>`;
  }

  if (info.played) {
    html += `<div style="text-align:center;font-size:11px;color:rgba(200,180,140,.4)">本赛季已参赛，下赛季再来</div>`;
  } else {
    if (!ed.sect) {
      html += `<div style="text-align:center;font-size:11px;color:rgba(200,180,140,.4)">需加入门派才能参加</div>`;
    } else if ((ed.level || 1) < 10) {
      html += `<div style="text-align:center;font-size:11px;color:rgba(200,180,140,.4)">需等级 ≥ Lv10</div>`;
    } else {
      html += `
        <div style="text-align:center">
          <button onclick="scEnterTourney()" style="padding:10px 28px;border-radius:8px;border:1px solid #ffa04050;background:#ffa04015;color:#ffa040;font-size:13px;cursor:pointer;font-weight:bold;letter-spacing:1px">
            🔥 报名参战（💰50）
          </button>
        </div>`;
    }
  }

  // 历史最佳
  if (info.bestRank < 99) {
    html += `
      <div style="margin-top:8px;text-align:center;font-size:10px;color:rgba(200,180,140,.35)">
        历史最佳：第${info.bestRank}名
      </div>`;
  }

  html += '</div>';
  return html;
}

/* ════════════════════════════════════════════════════════════════════
 *  三、排行榜（门派内）
 *  基于赛季历史数据 + 贡献值生成模拟排行榜
 * ════════════════════════════════════════════════════════════════════ */

function scRenderLeaderboard(sectId) {
  const sect = _scGetSect(sectId);
  if (!sect) return '';

  const ed = _scEdS();
  const playerContrib = ed.sect === sectId ? (ed.sectContrib || 0) : 0;
  const playerRank = ed.sect === sectId ? (ed.sectRank || 'disciple') : '';
  const playerLv = ed.level || 1;

  // 生成模拟排行（玩家 + 随机NPC）
  const rankOrder = ['grand', 'elder', 'elite', 'disciple'];
  const rankLabels = { grand: '👑元老', elder: '🏅长老', elite: '⚔精英', disciple: '📜弟子' };
  const names = SC_CONTESTANT_NAMES[sectId] || ['弟子甲','弟子乙','弟子丙','弟子丁','弟子戊'];

  const entries = [];

  // 玩家自己
  if (ed.sect === sectId) {
    entries.push({
      name: ed.name || '少侠',
      level: playerLv,
      contrib: playerContrib,
      rank: playerRank,
      isPlayer: true,
    });
  }

  // 生成其他NPC
  const usedNames = new Set();
  names.forEach(n => usedNames.add(n));
  for (let i = 0; i < 9; i++) {
    let name;
    do { name = names[Math.floor(Math.random() * names.length)] + (i > 4 ? String(i-4) : ''); }
    while (usedNames.has(name) && usedNames.size < 20);
    usedNames.add(name);

    const npcRank = i < 1 ? 'grand' : (i < 3 ? 'elder' : (i < 6 ? 'elite' : 'disciple'));
    const npcContrib = Math.max(0, playerContrib * (0.3 + Math.random() * 1.5) - Math.random() * 50);
    entries.push({
      name,
      level: Math.max(5, Math.floor(playerLv * (0.5 + Math.random() * 0.8))),
      contrib: Math.floor(npcContrib),
      rank: npcRank,
      isPlayer: false,
    });
  }

  // 按贡献排序
  entries.sort((a, b) => {
    // 先按阶级
    const ra = rankOrder.indexOf(a.rank);
    const rb = rankOrder.indexOf(b.rank);
    if (ra !== rb) return ra - rb;
    return b.contrib - a.contrib;
  });

  let html = `
    <div style="margin-top:16px;padding:16px;background:rgba(128,160,200,.04);border:1px dashed rgba(128,160,200,.15);border-radius:10px">
      <div style="font-size:13px;color:#80b0e0;font-weight:bold;margin-bottom:12px">📊 ${sect.name} · 贡献榜</div>`;

  entries.forEach((entry, idx) => {
    const rankIdx = idx + 1;
    const medal = rankIdx === 1 ? '🥇' : (rankIdx === 2 ? '🥈' : (rankIdx === 3 ? '🥉' : `#${rankIdx}`));
    const style = entry.isPlayer ?
      'background:rgba(240,200,80,.08);border:1px solid rgba(240,200,80,.2)' :
      (idx < 3 ? 'background:rgba(255,255,255,.02)' : '');

    html += `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;margin-bottom:4px;border-radius:6px;${style}">
        <span style="font-size:12px;width:28px;text-align:center;flex-shrink:0;color:${idx < 3 ? '#e0c060' : 'rgba(200,180,140,.4)'}">${medal}</span>
        <span style="flex:1;font-size:11px;color:${entry.isPlayer ? '#f0d090' : 'rgba(200,180,140,.7)'};font-weight:${entry.isPlayer ? 'bold' : 'normal'}">${entry.name}${entry.isPlayer ? '（你）' : ''}</span>
        <span style="font-size:10px;color:rgba(200,180,140,.4)">${rankLabels[entry.rank] || ''}</span>
        <span style="font-size:11px;color:#80e880;min-width:50px;text-align:right">⚔${entry.contrib}</span>
      </div>`;
  });

  html += '</div>';
  return html;
}

/* ════════════════════════════════════════════════════════════════════
 *  四、集成：渲染到 sect.html 演武场Tab底部
 * ════════════════════════════════════════════════════════════════════ */

/**
 * 在 sect.html 的演武场底部追加段位赛 + 武斗大会 + 排行榜
 * 调用时机：renderArena(sect) 完成后
 */
function scEnhanceArena(sectId) {
  const arenaEl = document.getElementById('sectArenaContent');
  if (!arenaEl) return;

  const rankHtml = scRenderRankChallenge(sectId);
  const tourneyHtml = scRenderTourney();
  const boardHtml = scRenderLeaderboard(sectId);

  const container = document.createElement('div');
  container.id = 'scEnhancedArena';
  container.innerHTML = rankHtml + tourneyHtml + boardHtml;
  arenaEl.appendChild(container);
}

/* ════════════════════════════════════════════════════════════════════
 *  五、全局挂载（供 town.html / sect.html 调用）
 * ════════════════════════════════════════════════════════════════════ */

window.scDoRankChallenge = scDoRankChallenge;
window.scEnterTourney = scEnterTourney;
window.scRenderTourney = scRenderTourney;
window.scRenderRankChallenge = scRenderRankChallenge;
window.scRenderLeaderboard = scRenderLeaderboard;
window.scEnhanceArena = scEnhanceArena;
window.scSeasonInfo = scSeasonInfo;
window.scCanChallenge = scCanChallenge;

// 导出对象（供模块化使用）
window.SC = {
  doRankChallenge: scDoRankChallenge,
  enterTourney: scEnterTourney,
  renderTourney: scRenderTourney,
  renderRankChallenge: scRenderRankChallenge,
  renderLeaderboard: scRenderLeaderboard,
  seasonInfo: scSeasonInfo,
  canChallenge: scCanChallenge,
  enhanceArena: scEnhanceArena,
};
