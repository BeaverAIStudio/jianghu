// ════════════════════════════════════════════════════════════
// karma-system.js — 全局善恶值系统
// 善恶影响：NPC初始态度、NPC打招呼措辞、任务解锁、战斗遭遇
// 存储：edS.karma (-100 ~ +100)
// ════════════════════════════════════════════════════════════

'use strict';

// ── 善恶值常数 ─────────────────────────────────────────
const KARMA_MAX       = 100;   // 行侠仗义（满）
const KARMA_MIN       = -100;  // 恶贯满盈（底）
const KARMA_NEUTRAL   = 0;     // 亦正亦邪

// 善恶档位
const KARMA_BANDS = [
  { min:-100, max:-80,  key:'evil_ultimate', name:'恶贯满盈',  icon:'💀', color:'#cc1111', desc:'江湖公敌，人人得而诛之' },
  { min:-79,  max:-50,  key:'evil_severe',   name:'穷凶极恶',  icon:'👹', color:'#dd4422', desc:'恶名昭著，黑道中人' },
  { min:-49,  max:-20,  key:'evil_light',    name:'作恶多端',  icon:'😈', color:'#ee6633', desc:'江湖宵小，正道所不齿' },
  { min:-19,  max:-1,   key:'evil_minor',    name:'行止不端',  icon:'😐', color:'#ff8855', desc:'小恶不断，难称君子' },
  { min:0,    max:0,    key:'neutral',        name:'亦正亦邪',  icon:'⚖️',  color:'#888888', desc:'无善无恶，随波逐流' },
  { min:1,    max:19,   key:'good_minor',    name:'略有侠气',  icon:'🙂', color:'#88cc55', desc:'小善渐积，侠名初显' },
  { min:20,   max:49,   key:'good_light',    name:'侠肝义胆',  icon:'⚔️', color:'#55cc77', desc:'急公好义，江湖好评' },
  { min:50,   max:79,   key:'good_heavy',    name:'名门正派',  icon:'🗡️', color:'#33cc88', desc:'正道之光，众望所归' },
  { min:80,   max:100,  key:'good_ultimate', name:'一代宗师',  icon:'🌟', color:'#22ddaa', desc:'侠之大者，为国为民' },
];

// ── 善恶值操作 ─────────────────────────────────────────

// 获取当前善恶档位信息
function getKarmaBand(karma) {
  karma = Math.max(KARMA_MIN, Math.min(KARMA_MAX, karma || 0));
  return KARMA_BANDS.find(b => karma >= b.min && karma <= b.max) || KARMA_BANDS[4];
}

// 获取善恶值简称（用于状态栏等）
function getKarmaShortName(karma) {
  const band = getKarmaBand(karma);
  return `${band.icon}${band.name}`;
}

// 获取善恶值完整描述
function getKarmaDesc(karma) {
  const band = getKarmaBand(karma);
  return `${band.icon} ${band.name}：${band.desc}`;
}

// 善恶值增减（统一入口）
function addKarma(delta, reason) {
  if (typeof edS === 'undefined') return;
  const oldKarma = edS.karma || 0;
  const newKarma = Math.max(KARMA_MIN, Math.min(KARMA_MAX, oldKarma + delta));
  edS.karma = newKarma;

  // 同步到 jianghu.js 的 reputation 系统
  if (typeof jianghuState !== 'undefined' && jianghuState.reputation) {
    jianghuState.reputation.alignment = newKarma;
    jianghuSave();
  }

  if (typeof savePrimaryStats === 'function') savePrimaryStats();

  const oldBand = getKarmaBand(oldKarma);
  const newBand = getKarmaBand(newKarma);

  // 档位变化时提示
  if (oldBand.key !== newBand.key && delta !== 0) {
    const improved = newKarma > oldKarma;
    const changeColor = improved ? '#33cc88' : '#dd4422';
    if (typeof showToast === 'function') showToast(`📜 善恶值变化：${oldBand.name} → ${newBand.name}`, 'info');
    _karmaLog(`[善恶] ${oldBand.name}(${oldKarma}) → ${newBand.name}(${newKarma})，原因：${reason}，变化：${delta > 0 ? '+' : ''}${delta}`);
  } else if (Math.abs(delta) >= 5) {
    // 大幅变化但未跨档位
    const improved = delta > 0;
    _karmaLog(`[善恶] ${getKarmaBand(newKarma).name}(${oldKarma}) → ${newKarma}，原因：${reason}，变化：${delta > 0 ? '+' : ''}${delta}`);
  }

  // 更新UI
  if (typeof renderKarmaUI === 'function') renderKarmaUI();
  // 提示系统检查（善恶值变化时）
  if (typeof checkTips === 'function') checkTips();
  return newKarma;
}

// 善恶日志（调试用）
function _karmaLog(msg) {
  console.log(msg);
}

// ── 善恶对NPC初始态度的影响 ─────────────────────────────
// 基础好感：阵营立场决定初始好感
// 善恶修正：善恶值在阵营基础上进一步调节好感
// 最终好感：clamp(-100, 100)

// 阵营基础态度：玩家阵营 → NPC阵营
const FACTION_BASE = {
  // 正道
  righteous: { righteous: 15, neutral: 0, chaotic: -15, evil: -30 },
  // 中立
  neutral:   { righteous: 5,  neutral: 5, chaotic: 0,   evil: -10 },
  // 混乱
  chaotic:   { righteous: -15,neutral: 0, chaotic: 10, evil: 5 },
  // 邪道
  evil:      { righteous: -30,neutral: -10,chaotic: 5, evil: 15 },
};

// 善恶修正系数（×基础分）
// karma:-100 → -0.4，karma:0 → 0，karma:+100 → +0.4
function _karmaFactionMod(karma) {
  return (karma || 0) / 250; // -0.4 ~ +0.4
}

// 获取善恶+阵营综合后的NPC初始好感
// npcFaction: NPC阵营（来自npc数据或npc-data-*.js）
function getKarmaRelationForNpc(npcFaction, playerKarma, playerFaction) {
  playerFaction = playerFaction || edS.sectAlignment || 'neutral';
  npcFaction = npcFaction || 'neutral';

  // 基础好感（阵营）
  const base = FACTION_BASE[playerFaction]?.[npcFaction] ?? 0;

  // 善恶修正
  const karmaMod = Math.round(base * _karmaFactionMod(playerKarma));

  return Math.max(-100, Math.min(100, base + karmaMod));
}

// ── NPC对话时的善恶对话 ────────────────────────────────
// 善恶在NPC打招呼/特殊对话中的体现
// 传入当前NPC的阵营，返回应追加的善恶修饰语
function getKarmaDialogueModifier(npcFaction, karma) {
  const k = karma || 0;
  npcFaction = npcFaction || 'neutral';

  // 获取阵营基础（根据玩家当前阵营读取对应NPC阵营的基础好感）
  const playerFaction = (typeof edS !== 'undefined' && edS?.sectAlignment) || 'neutral';
  const base = (FACTION_BASE[playerFaction]?.[npcFaction]) ?? 0;

  if (k >= 80) {
    // 大善
    if (npcFaction === 'righteous') return '久仰大侠侠名，今日得见，三生有幸！';
    if (npcFaction === 'evil' || npcFaction === 'chaotic') return '哼，伪君子也敢来此？';
  } else if (k >= 50) {
    if (npcFaction === 'righteous') return '少侠气宇轩昂，不愧正道之秀！';
    if (npcFaction === 'evil') return '正道人士？哼，我等可不吃这套。';
    if (npcFaction === 'chaotic') return '哟，正道少侠驾到，有何贵干？';
  } else if (k <= -80) {
    // 大恶
    if (npcFaction === 'evil') return '久闻大名！江湖传闻少侠心狠手辣，今日得见，果然名不虚传！';
    if (npcFaction === 'righteous') return '你这恶贼！今日我便要替天行道！';
    if (npcFaction === 'chaotic') return '嘿，黑道朋友，合作愉快？';
  } else if (k <= -50) {
    if (npcFaction === 'evil') return '恶名在外却也响亮，请坐！';
    if (npcFaction === 'righteous') return '正道不齿与你为伍，你来这里作甚？';
  } else if (k >= 20) {
    if (npcFaction === 'evil') return '正道少侠来此，是要行侠仗义？';
    if (npcFaction === 'righteous') return '少侠侠名渐盛，幸会幸会！';
  } else if (k <= -20) {
    if (npcFaction === 'evil') return '嘿嘿，有意思...';
    if (npcFaction === 'righteous') return '哼，近来江湖风评不佳，少侠请自重。';
  }

  return null; // 无特殊修饰
}

// ── 善恶影响敌人遭遇 ──────────────────────────────────
// 根据善恶值调整野外/地宫遭遇权重
// karma: 当前善恶值
// 返回修正后的遭遇权重表

function getKarmaEncounterModifier(karma) {
  const k = karma || 0;
  return {
    // 善值高 → 更多正道NPC/侠客事件，更少恶道敌人
    righteousChance:  Math.max(0, k / 200),    // +0.5 at karma=100
    // 恶值高 → 更多恶道敌人/黑店
    evilChance:        Math.max(0, -k / 200),   // +0.5 at karma=-100
    // 善值高 → 更少随机劫匪（善人不会主动攻击善值玩家）
    banditAvoidance:   Math.max(0, k / 100),    // at karma=100，100%避免
  };
}

// ── 善恶影响任务可用性 ────────────────────────────────
// 检查某任务是否因善恶值被锁定
// questReq: { karmaMin?: number, karmaMax?: number, karmaBand?: string[] }
function checkKarmaQuestRequirement(questReq) {
  if (!questReq) return { ok: true };
  const k = edS.karma || 0;
  if (questReq.karmaMin !== undefined && k < questReq.karmaMin) {
    return { ok: false, reason: `善恶值不足（需${questReq.karmaMin}，当前${k}）` };
  }
  if (questReq.karmaMax !== undefined && k > questReq.karmaMax) {
    return { ok: false, reason: `善恶值过高（需≤${questReq.karmaMax}，当前${k}）` };
  }
  if (questReq.karmaBand && questReq.karmaBand.length > 0) {
    const band = getKarmaBand(k).key;
    if (!questReq.karmaBand.includes(band)) {
      return { ok: false, reason: `此项任务与你的善恶立场不符` };
    }
  }
  return { ok: true };
}

// ── UI：城镇状态栏善恶显示 ────────────────────────────
function renderKarmaUI() {
  if (typeof edS === 'undefined') return;
  const k = edS.karma || 0;
  const band = getKarmaBand(k);

  const container = document.getElementById('karmaStatusBar');
  if (!container) return;

  // 进度条：中间为0，左负右正
  const pct = ((k - KARMA_MIN) / (KARMA_MAX - KARMA_MIN)) * 100; // 0~100%
  const leftPct = Math.min(50, (Math.max(0, k) / KARMA_MAX) * 50);
  const rightPct = Math.min(50, (Math.max(0, -k) / KARMA_MAX) * 50);

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;font-size:11px;letter-spacing:1px;">
      <span style="color:${band.color};font-size:12px;">${band.icon}</span>
      <div style="flex:1;position:relative;height:10px;background:linear-gradient(90deg,#cc1111 0%,#cc1111 49%,#888 49%,#888 51%,#22ddaa 51%,#22ddaa 100%);border-radius:5px;overflow:hidden;">
        <div style="position:absolute;left:${pct}%;top:0;width:2px;height:100%;background:#fff;transform:translateX(-50%);"></div>
      </div>
      <span style="color:${band.color};font-weight:bold;min-width:60px;text-align:right;">${k > 0 ? '+' : ''}${k}</span>
    </div>
  `;
}

// ── 存档/读取 ────────────────────────────────────────
function loadKarmaState() {
  if (typeof edS !== 'undefined') {
    if (edS.karma === undefined || edS.karma === null) {
      // 首次加载：从 jianghuState 同步（向后兼容已有玩家）
      if (typeof jianghuState !== 'undefined' && jianghuState.reputation?.alignment !== undefined) {
        edS.karma = jianghuState.reputation.alignment;
      } else {
        edS.karma = 0; // 默认亦正亦邪
      }
    }
  }
}

function saveKarmaState() {
  if (typeof edS !== 'undefined' && typeof savePrimaryStats === 'function') {
    savePrimaryStats();
  }
}

// ── 善恶行为常量表 ─────────────────────────────────
// 方便外部模块引用
const KARMA_ACTIONS = {
  // 战斗
  KILL_RIGHTEOUS:    -20,  // 杀害正道人士
  KILL_NEUTRAL:      -5,   // 杀害中立者
  KILL_CHAOTIC:      2,    // 剿灭匪徒（混乱）
  KILL_EVIL:         15,   // 锄强扶弱（邪道）

  // NPC互动
  NPC_CHAT_GOOD:     1,    // 友善交谈
  NPC_CHAT_BAD:     -1,    // 言语冒犯
  NPC_GIFT:          3,    // 赠送礼物
  NPC_HELP:          10,   // 帮助NPC完成任务
  NPC_BETRAY:        -15,  // 背叛NPC
  NPC_KIDNAP:        -25,  // 绑架NPC

  // 城市/奇遇
  CITY_HELP:         5,    // 帮助城市
  CITY_RAID:         -10,  // 劫掠城市
  BANDIT_DEFEAT:     5,    // 击败山贼
  MERCHANT_FAIR:     1,    // 公平交易
  MERCHANT_FRAUD:    -5,   // 欺骗商人

  // 门派
  SECT_HONOR:        3,    // 为门派争光
  SECT_BETRAY:       -20,  // 叛门
};

// ── 导出 ─────────────────────────────────────────────
window.addKarma                    = addKarma;
window.getKarmaBand                = getKarmaBand;
window.getKarmaShortName           = getKarmaShortName;
window.getKarmaDesc                = getKarmaDesc;
window.getKarmaRelationForNpc      = getKarmaRelationForNpc;
window.getKarmaDialogueModifier    = getKarmaDialogueModifier;
window.getKarmaEncounterModifier   = getKarmaEncounterModifier;
window.checkKarmaQuestRequirement  = checkKarmaQuestRequirement;
window.renderKarmaUI               = renderKarmaUI;
window.loadKarmaState              = loadKarmaState;
window.saveKarmaState              = saveKarmaState;
window.KARMA_ACTIONS               = KARMA_ACTIONS;
window.KARMA_BANDS                 = KARMA_BANDS;
