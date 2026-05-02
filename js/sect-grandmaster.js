// ════════════════════════════════════════════════════════════════════
//  sect-grandmaster.js  —  门派掌门传承系统（B4）
//  掌门职能：接任、治理、镇派之宝、招募、发号施令
//
//  存档键：
//    wuxia_grandmaster   — 掌门传承状态
// ════════════════════════════════════════════════════════════════════

'use strict';

/* ── 存档 ────────────────────────────────────────────────────────── */
const GM_KEY = 'wuxia_grandmaster';

function _gmLoad() {
  try { return JSON.parse(localStorage.getItem(GM_KEY) || '{}'); }
  catch(e) { return {}; }
}
function _gmSave(data) {
  localStorage.setItem(GM_KEY, JSON.stringify(data));
}

/* ── Toast 适配 ──────────────────────────────────────────────────── */
function _gmToast(msg, type) {
  if (typeof townToast === 'function') { townToast(msg); return; }
  if (typeof showToast === 'function') { showToast(msg, type || 'info'); return; }
  console.log('[grandmaster]', msg);
}

/* ── 工具 ────────────────────────────────────────────────────────── */
function _gmEdS() {
  return (typeof window !== 'undefined' && window.edS) || {};
}
function _gmGetSect(id) {
  return (typeof SECTS !== 'undefined') ? SECTS.find(s => s.id === id) : null;
}
function _gmTodayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

/* ════════════════════════════════════════════════════════════════════
 *  掌门传承条件
 *  - 阶级：必须是 grand（元老）
 *  - 等级：tier相关
 *  - 贡献：≥ 800
 *  - 门派声望（江湖事件积累）：≥ 100
 *  - 未有现任掌门（或经过特殊剧情传位）
 * ════════════════════════════════════════════════════════════════════ */

const GM_REQ = {
  supreme: { level: 80, contrib: 1000, fame: 150 },
  major:   { level: 55, contrib: 800,  fame: 100 },
  minor:   { level: 35, contrib: 500,  fame: 60  },
};

/**
 * 检查玩家是否可以接任掌门
 */
function gmCanAssumeLeadership() {
  const ed = _gmEdS();
  if (!ed.sect) return { can: false, reason: '你尚未加入任何门派' };
  if ((ed.sectRank || 'disciple') !== 'grand')
    return { can: false, reason: '需达到「元老」阶级（先完成段位挑战）' };

  const sect = _gmGetSect(ed.sect);
  if (!sect) return { can: false, reason: '门派数据缺失' };

  const req = GM_REQ[sect.tier] || GM_REQ.minor;

  if ((ed.level || 1) < req.level)
    return { can: false, reason: `需要等级 ≥ Lv${req.level}（当前 Lv${ed.level || 1}）` };
  if ((ed.sectContrib || 0) < req.contrib)
    return { can: false, reason: `需要贡献 ≥ ${req.contrib}（当前 ${ed.sectContrib || 0}）` };

  // 江湖声望
  let fame = 0;
  try {
    if (typeof window.jianghuState !== 'undefined' && window.jianghuState.reputation) {
      fame = window.jianghuState.reputation.fame || 0;
    }
  } catch(e) {}
  if (fame < req.fame)
    return { can: false, reason: `需要江湖声望 ≥ ${req.fame}（当前 ${fame}）` };

  // 已经是掌门
  const state = _gmLoad();
  if (state[ed.sect] && state[ed.sect].isLeader && state[ed.sect].leaderId === (ed.id || 'player'))
    return { can: false, reason: '你已是本门掌门' };

  return { can: true, reason: '' };
}

/**
 * 接任掌门仪式
 */
function gmAssumeLeadership() {
  const check = gmCanAssumeLeadership();
  if (!check.can) { _gmToast('⚠ ' + check.reason); return; }

  const ed = _gmEdS();
  const sect = _gmGetSect(ed.sect);
  if (!sect) return;

  _gmShowLeaderCeremony(ed, sect);
}

function _gmShowLeaderCeremony(ed, sect) {
  const old = document.getElementById('gmCeremonyOverlay');
  if (old) old.remove();

  const el = document.createElement('div');
  el.id = 'gmCeremonyOverlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);backdrop-filter:blur(6px)';

  const sColor = sect.color || '#f0c060';
  const playerName = ed.name || '少侠';

  // 选择传承方式
  const ceremonyChoices = _gmGetCeremonyType(sect);

  el.innerHTML = `
    <div style="width:min(460px,92vw);border-radius:16px;background:linear-gradient(170deg,#160c20,#100a18);border:1px solid ${sColor}50;box-shadow:0 0 60px ${sColor}20,0 0 120px rgba(0,0,0,.8);overflow:hidden">

      <!-- 金光粒子背景 -->
      <div style="position:relative;padding:28px 24px 20px;text-align:center;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,${sColor}18 0%,transparent 65%);pointer-events:none"></div>
        <div style="font-size:56px;margin-bottom:10px;position:relative">${sect.icon || '⚔'}</div>
        <div style="font-size:18px;color:${sColor};font-weight:bold;letter-spacing:4px;position:relative">掌门传承</div>
        <div style="font-size:12px;color:rgba(220,200,160,.6);margin-top:6px;letter-spacing:1px;position:relative">
          ${sect.name} · 第${_gmGetGeneration(sect.id)}代
        </div>
      </div>

      <!-- 传承叙事 -->
      <div style="padding:0 24px 16px;font-size:13px;color:rgba(220,200,160,.8);line-height:2;text-align:center;border-top:1px solid ${sColor}15">
        ${ceremonyChoices.narrative}
      </div>

      <!-- 掌门权柄 -->
      <div style="padding:0 20px 16px">
        <div style="font-size:11px;color:rgba(200,180,140,.4);text-align:center;margin-bottom:10px">接任后获得掌门权柄</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">
          ${_gmGetLeaderBenefits(sect).map(b =>
            `<span style="padding:4px 10px;border-radius:20px;background:${sColor}12;border:1px solid ${sColor}25;font-size:11px;color:${sColor}">${b}</span>`
          ).join('')}
        </div>
      </div>

      <!-- 按钮 -->
      <div style="padding:12px 24px 20px;display:flex;gap:10px;justify-content:center">
        <button onclick="gmConfirmLeadership()" style="padding:10px 32px;border-radius:8px;border:1px solid ${sColor}60;background:${sColor}20;color:${sColor};font-size:14px;cursor:pointer;font-weight:bold;letter-spacing:2px">
          ⚔ 接任掌门
        </button>
        <button onclick="document.getElementById('gmCeremonyOverlay').remove()" style="padding:10px 20px;border-radius:8px;border:1px solid rgba(200,180,140,.2);background:rgba(200,180,140,.06);color:rgba(200,180,140,.6);font-size:13px;cursor:pointer">
          稍后再说
        </button>
      </div>
    </div>`;

  document.body.appendChild(el);
}

function _gmGetGeneration(sectId) {
  const state = _gmLoad();
  return (state[sectId] && state[sectId].generation) ? state[sectId].generation + 1 : 1;
}

function _gmGetCeremonyType(sect) {
  const narrs = {
    shaolin:   '方丈将禅杖传于你，全寺僧众齐声颂佛，你成为少林寺新任方丈。',
    wudang:    '真人将太极剑交于你手，晨钟暮鼓中，你接掌武当，继承张真人遗志。',
    xiaoyao:   '无崖子将逍遥功法全数传授，仙乐飘飘间，你成为逍遥派新掌门。',
    riyue:     '五岳旌旗在手，群雄俯首，你以无人能敌的武功登上日月神教教主之位。',
    huashan:   '华山剑法大成，独孤九剑心法尽皆领悟，你执掌华山，独步天下。',
    mingjiao:   '圣火令传至你手，光明顶上，万众拜服，明教教主之位非你莫属。',
    wudu:       '五毒秘法尽在掌握，苗疆精英归心，你继任五毒教教主。',
    tangmen:    '唐门机关图谱传于你，千机百变在指间，你成为新一代唐门门主。',
    taohuadao: '桃花岛上，黄药师将弹指神通倾囊相授，你接掌桃花岛。',
    emei:       '峨眉剑法与九阳神功融汇贯通，诸位师太拜服，你成为峨眉掌门。',
  };
  const def = narrs[sect.id] || `历经艰辛，你终于在${sect.name}中证明了自己，众位长老联名推举，你正式接任掌门之位。`;
  return { narrative: def };
}

function _gmGetLeaderBenefits(sect) {
  const base = ['掌门称号', '门派被动+50%', '每日贡献+10', '发号施令权'];
  const extra = {
    supreme: ['镇派之宝', '传承秘功', '武林盟主竞选资格'],
    major:   ['镇派之宝', '传承秘功'],
    minor:   ['传承秘功'],
  };
  return [...base, ...(extra[sect.tier] || [])];
}

/**
 * 确认接任掌门（真正执行）
 */
function gmConfirmLeadership() {
  const el = document.getElementById('gmCeremonyOverlay');
  if (el) el.remove();

  const ed = _gmEdS();
  const sect = _gmGetSect(ed.sect);
  if (!sect) return;

  // 更新存档
  const state = _gmLoad();
  if (!state[ed.sect]) state[ed.sect] = {};
  state[ed.sect].isLeader = true;
  state[ed.sect].leaderId = ed.id || 'player';
  state[ed.sect].leaderName = ed.name || '少侠';
  state[ed.sect].since = _gmTodayStr();
  state[ed.sect].generation = _gmGetGeneration(ed.sect);
  _gmSave(state);

  // 称号
  ed.sectRank = 'grandmaster';
  if (!ed.titles) ed.titles = [];
  if (!ed.titles.includes('掌门')) ed.titles.push('掌门');
  if (!ed.titles.includes(sect.name + '掌门')) ed.titles.push(sect.name + '掌门');

  // 奖励
  const rewards = { contrib: 300, silver: 2000, exp: 5000, fame: 100 };
  ed.sectContrib = (ed.sectContrib || 0) + rewards.contrib;
  ed.silver = (ed.silver || 0) + rewards.silver;
  if (typeof addPlayerExp === 'function') addPlayerExp(rewards.exp);
  else if (ed.exp !== undefined) ed.exp = (ed.exp || 0) + rewards.exp;
  // 声望
  try {
    if (typeof window.jianghuState !== 'undefined' && window.jianghuState.reputation) {
      window.jianghuState.reputation.fame = (window.jianghuState.reputation.fame || 0) + rewards.fame;
      if (typeof jianghuSave === 'function') jianghuSave();
    }
  } catch(e) {}

  if (typeof saveGameState === 'function') saveGameState();
  // 注意：不再手动 localStorage.setItem，saveGameState 已包含存档逻辑

  // 显示庆典结果
  _gmShowLeaderResult(sect, rewards);

  // 刷新 sect.html
  setTimeout(() => {
    if (typeof renderHero === 'function' && typeof currentSect !== 'undefined') renderHero(currentSect);
    if (typeof renderHall === 'function' && typeof currentSect !== 'undefined') renderHall(currentSect);
  }, 400);
}

function _gmShowLeaderResult(sect, rewards) {
  const old = document.getElementById('gmResultOverlay');
  if (old) old.remove();

  const el = document.createElement('div');
  el.id = 'gmResultOverlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.88);backdrop-filter:blur(6px)';

  const sColor = sect.color || '#f0c060';
  const ed = _gmEdS();

  // 金光粒子动画
  const particles = Array.from({length: 20}, (_, i) => {
    const angle = (i / 20) * 360;
    const dist = 80 + Math.random() * 60;
    const x = Math.cos(angle * Math.PI / 180) * dist;
    const y = Math.sin(angle * Math.PI / 180) * dist;
    return `<div style="position:absolute;width:4px;height:4px;border-radius:50%;background:${sColor};left:50%;top:50%;transform:translate(${x}px,${y}px);animation:gm-spark .8s ease-out ${i * 0.04}s both;opacity:0"></div>`;
  }).join('');

  el.innerHTML = `
    <style>
      @keyframes gm-spark { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(calc(${Math.random()*2-1}*120px),calc(${Math.random()*2-1}*120px));opacity:0} }
      @keyframes gm-title-in { 0%{transform:scale(.6) translateY(20px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
    </style>
    <div style="width:min(420px,90vw);border-radius:16px;background:linear-gradient(170deg,#1a1020,#140c18);border:1px solid ${sColor}60;box-shadow:0 0 80px ${sColor}30;overflow:hidden;position:relative">
      <div style="position:relative;padding:32px 24px 20px;text-align:center">
        ${particles}
        <div style="font-size:64px;margin-bottom:12px;animation:gm-title-in .5s ease">${sect.icon || '👑'}</div>
        <div style="font-size:20px;color:${sColor};font-weight:bold;letter-spacing:5px;animation:gm-title-in .5s ease .1s both">掌门登基</div>
        <div style="font-size:13px;color:rgba(220,200,160,.8);margin-top:10px;line-height:2">
          ${ed.name || '少侠'}，自此你便是<br>
          <b style="color:${sColor};font-size:16px">${sect.name}</b> 第${_gmGetGeneration(sect.id)}代掌门
        </div>
      </div>

      <div style="padding:0 20px 16px">
        <div style="display:flex;justify-content:center;gap:16px;font-size:12px;flex-wrap:wrap">
          <span style="color:#80e880">⚔ 贡献 +${rewards.contrib}</span>
          <span style="color:#e0c060">💰 银两 +${rewards.silver}</span>
          <span style="color:#80b0ff">✨ 经验 +${rewards.exp}</span>
          <span style="color:#ffaa40">⭐ 声望 +${rewards.fame}</span>
        </div>
        <div style="text-align:center;font-size:11px;color:rgba(200,180,140,.5);margin-top:8px">
          新称号：「${sect.name}掌门」已获得
        </div>
      </div>

      <div style="padding:10px 24px 20px;text-align:center">
        <button onclick="document.getElementById('gmResultOverlay').remove()" style="padding:10px 40px;border-radius:8px;border:1px solid ${sColor}50;background:${sColor}18;color:${sColor};font-size:14px;cursor:pointer;letter-spacing:2px;font-weight:bold">
          受命掌派
        </button>
      </div>
    </div>`;

  document.body.appendChild(el);
}

/* ════════════════════════════════════════════════════════════════════
 *  掌门职能面板
 *  - 发号施令（每日任务派发给NPC）
 *  - 镇派之宝（查看/激活）
 *  - 招募令（招募新弟子增加门派规模）
 *  - 传承秘功（掌门专属功法）
 * ════════════════════════════════════════════════════════════════════ */

// 镇派之宝配置
const GM_RELICS = {
  shaolin:   { name:'达摩袈裟', icon:'🪬', desc:'少林千年法衣，持有者每日恢复气血上限×5点内力', bonus: 'hpRegen+5%' },
  wudang:    { name:'太极符印', icon:'☯️',  desc:'武当圣物，悟出阴阳之道，全属性+5%',           bonus: 'all+5%' },
  xiaoyao:   { name:'易筋洗髓经', icon:'📖', desc:'逍遥最高法典，速度+20，内力上限+100',       bonus: 'spd+20,mp+100' },
  riyue:     { name:'葵花宝典', icon:'🌸',  desc:'日月神教至宝，攻击+20%，但每日心智-1',       bonus: 'atk+20%' },
  huashan:   { name:'辟邪剑谱', icon:'⚔',   desc:'华山剑法精要，暴击+15%，暴击伤害+30%',       bonus: 'crit+15%' },
  mingjiao:   { name:'乾坤大挪移心法', icon:'🔥', desc:'明教神功，内力攻击+25%',               bonus: 'matk+25%' },
  wudu:       { name:'万毒经', icon:'🐍',    desc:'五毒教秘典，每次攻击附加剧毒，持续伤害+3/回合',bonus: 'poison+3' },
  tangmen:    { name:'唐门机关总录', icon:'⚙️', desc:'唐门机关秘术，暗器伤害+30%，格挡率+10%', bonus: 'ranged+30%' },
  taohuadao:  { name:'玉箫剑法合谱', icon:'🎵', desc:'桃花岛至宝，魅力+30，伤害随魅力增加',    bonus: 'charm+30' },
  emei:       { name:'峨眉九阳神功', icon:'☀', desc:'峨眉秘典，内力回复速度×2，净化异常状态',  bonus: 'mpRegen×2' },
  kongtong:   { name:'崆峒印', icon:'🗿',    desc:'崆峒五老秘印，防御+15，速度+10',            bonus: 'def+15,spd+10' },
  kunlun:     { name:'昆仑神剑', icon:'🗡',   desc:'昆仑至宝，攻击+15，攻击附加寒冰效果',      bonus: 'atk+15' },
  nangong:    { name:'南宫秘录', icon:'📜',   desc:'南宫世家商业秘典，银两收益+25%',           bonus: 'silver+25%' },
  tianshan:   { name:'天山六阳掌残卷', icon:'❄️', desc:'天山至高心法，降低敌方速度15%',        bonus: 'debuff+15%' },
  shengguang: { name:'光明圣典', icon:'✨',   desc:'光明教至宝，净化所有减益，气血+50',         bonus: 'purify' },
};

// 掌门日令（每日派发任务给门派）
const GM_EDICTS = [
  { id: 'train',    icon: '🏋', name: '广纳英才',  desc: '门派声望+5，贡献+3',    reward: { fame: 5, contrib: 3 } },
  { id: 'patrol',   icon: '🛡', name: '加强戒备',  desc: '防御强化：门派被动防御+10%（持续1天）', reward: { contrib: 5 } },
  { id: 'donate',   icon: '💰', name: '慷慨散财',  desc: '散出100银两，门派声望+15', cost: { silver: 100 }, reward: { fame: 15 } },
  { id: 'recruit',  icon: '📣', name: '广发英雄帖', desc: '大量吸引散人投靠，贡献+10', reward: { contrib: 10, fame: 3 } },
  { id: 'research', icon: '📖', name: '研修功法',  desc: '弟子修炼加速，经验+300',  reward: { exp: 300 } },
  { id: 'reform',   icon: '⚖', name: '整顿门规',  desc: '门派纪律严明，贡献效率+15%（持续3天）', reward: { contrib: 2 } },
  { id: 'banquet',  icon: '🍶', name: '设宴款待',  desc: '款待各路英雄，银两-150，声望+25', cost: { silver: 150 }, reward: { fame: 25 } },
];

/**
 * 检查玩家是否是本门掌门
 */
function gmIsLeader(sectId) {
  if (!sectId) return false;
  const state = _gmLoad();
  return !!(state[sectId] && state[sectId].isLeader);
}

/**
 * 渲染掌门面板（嵌入长老殿底部）
 */
function gmRenderLeaderPanel(sectId) {
  const sect = _gmGetSect(sectId);
  if (!sect) return '';

  const ed = _gmEdS();
  const isLeader = gmIsLeader(sectId);
  const isMySection = ed.sect === sectId;

  // 非本门成员：不显示
  if (!isMySection) return '';

  let html = `<div style="margin-top:20px;padding:16px;background:rgba(240,200,80,.03);border:1px dashed rgba(240,200,80,.12);border-radius:10px" id="gmLeaderPanel">`;
  html += `<div style="font-size:13px;color:#e0c060;font-weight:bold;margin-bottom:14px">👑 掌门之位</div>`;

  if (isLeader) {
    // === 已是掌门：显示职能 ===
    html += _gmRenderLeaderFunctions(sect, ed);
  } else {
    // === 未是掌门：显示传承条件 ===
    const check = gmCanAssumeLeadership();
    const req = GM_REQ[sect.tier] || GM_REQ.minor;

    let fame = 0;
    try {
      if (typeof window.jianghuState !== 'undefined' && window.jianghuState.reputation)
        fame = window.jianghuState.reputation.fame || 0;
    } catch(e) {}

    html += `
      <div style="font-size:12px;color:rgba(200,180,140,.7);line-height:1.8;margin-bottom:12px">
        门派掌门之位传承，须天时地利人和。当你在门派中德望兼备，方能执掌大局。
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">`;

    const checks = [
      { label: '阶级', need: '元老（grand）', met: (ed.sectRank || 'disciple') === 'grand' },
      { label: '等级', need: `Lv${req.level}`, met: (ed.level || 1) >= req.level },
      { label: '贡献', need: `${req.contrib}`, met: (ed.sectContrib || 0) >= req.contrib },
      { label: '声望', need: `${req.fame}`, met: fame >= req.fame },
    ];

    checks.forEach(c => {
      html += `
        <div style="display:flex;align-items:center;gap:8px;font-size:11px">
          <span style="color:${c.met ? '#80e880' : '#ff8888'};flex-shrink:0">${c.met ? '✅' : '❌'}</span>
          <span style="color:rgba(200,180,140,.6)">${c.label}：</span>
          <span style="color:${c.met ? '#80e880' : 'rgba(200,180,140,.4)'}">${c.need}</span>
        </div>`;
    });

    html += '</div>';

    if (check.can) {
      html += `
        <div style="text-align:center">
          <button onclick="gmAssumeLeadership()" style="padding:10px 32px;border-radius:8px;border:1px solid ${sect.color}50;background:${sect.color}18;color:${sect.color};font-size:13px;cursor:pointer;font-weight:bold;letter-spacing:2px">
            👑 接任掌门
          </button>
        </div>`;
    }
  }

  html += '</div>';
  return html;
}

function _gmRenderLeaderFunctions(sect, ed) {
  const state = _gmLoad();
  const sData = state[sect.id] || {};
  const today = _gmTodayStr();
  const edictDone = sData.edictDate === today;

  let html = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">`;

  // 掌门信息栏
  html += `
    <div style="grid-column:1/-1;padding:10px 14px;background:rgba(240,200,80,.06);border:1px solid rgba(240,200,80,.15);border-radius:8px;display:flex;align-items:center;gap:12px">
      <div style="font-size:28px">${sect.icon || '⚔'}</div>
      <div>
        <div style="font-size:13px;color:#f0d090;font-weight:bold">${ed.name || '少侠'}</div>
        <div style="font-size:11px;color:rgba(200,180,140,.5)">
          ${sect.name} 第${sData.generation || 1}代掌门 · 执掌自 ${sData.since || today}
        </div>
      </div>
    </div>`;

  // 镇派之宝
  const relic = GM_RELICS[sect.id];
  if (relic) {
    const activated = sData.relicActivated;
    html += `
      <div style="padding:10px 12px;background:rgba(160,100,200,.06);border:1px solid rgba(160,100,200,.15);border-radius:8px">
        <div style="font-size:11px;color:rgba(200,180,140,.5);margin-bottom:4px">🪬 镇派之宝</div>
        <div style="font-size:12px;color:#c0a0e0;font-weight:bold">${relic.icon} ${relic.name}</div>
        <div style="font-size:10px;color:rgba(200,180,140,.4);margin-top:3px;line-height:1.4">${relic.desc}</div>
        ${!activated ? `
          <button onclick="gmActivateRelic('${sect.id}')" style="margin-top:6px;padding:4px 14px;border-radius:5px;border:1px solid rgba(160,100,200,.3);background:rgba(160,100,200,.1);color:#c0a0e0;font-size:10px;cursor:pointer">激活</button>
        ` : `<div style="font-size:10px;color:#80e880;margin-top:4px">✅ 已激活</div>`}
      </div>`;
  }

  // 每日日令
  html += `
    <div style="padding:10px 12px;background:rgba(240,160,60,.06);border:1px solid rgba(240,160,60,.15);border-radius:8px">
      <div style="font-size:11px;color:rgba(200,180,140,.5);margin-bottom:4px">📜 掌门日令</div>
      ${edictDone ?
        `<div style="font-size:11px;color:rgba(200,180,140,.4)">今日令已下达<br><span style="color:#80e880;font-size:10px">${sData.lastEdict || ''}</span></div>` :
        `<button onclick="gmShowEdicts('${sect.id}')" style="padding:6px 14px;border-radius:5px;border:1px solid rgba(240,160,60,.3);background:rgba(240,160,60,.1);color:#ffa040;font-size:11px;cursor:pointer;width:100%">📣 发布日令</button>`
      }
    </div>`;

  html += '</div>';

  // 传承秘功（掌门专属）
  html += _gmRenderSecretSkill(sect, sData);

  return html;
}

function _gmRenderSecretSkill(sect, sData) {
  const secrets = {
    shaolin: { name: '大力金刚掌（掌门版）', desc: '全力一击，伤害×3，冷却5回合', icon: '🤜' },
    wudang:  { name: '太极真气（掌门版）',   desc: '化解任意一次攻击并反击，冷却4回合', icon: '☯️' },
    huashan: { name: '独孤九剑（真传）',      desc: '剑法无招，必定暴击，冷却6回合', icon: '⚔' },
    mingjiao: { name: '七伤拳（大成）',        desc: '攻击×2.5，自身损失10%气血', icon: '🔥' },
  };
  const sk = secrets[sect.id] || { name: '掌门心法（门派秘传）', desc: '门派最高武学，攻击+25%，防御+20%', icon: '📖' };
  const learned = sData.secretSkillLearned;

  return `
    <div style="padding:12px;background:rgba(80,120,200,.05);border:1px solid rgba(80,120,200,.12);border-radius:8px;margin-top:2px">
      <div style="font-size:11px;color:rgba(200,180,140,.5);margin-bottom:6px">⚡ 传承秘功</div>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="font-size:24px">${sk.icon}</div>
        <div style="flex:1">
          <div style="font-size:12px;color:#90b0e8;font-weight:bold">${sk.name}</div>
          <div style="font-size:10px;color:rgba(200,180,140,.4);margin-top:2px">${sk.desc}</div>
        </div>
        ${learned ?
          '<div style="font-size:10px;color:#80e880;white-space:nowrap">✅ 已习得</div>' :
          `<button onclick="gmLearnSecretSkill('${sect.id}')" style="padding:6px 12px;border-radius:5px;border:1px solid rgba(80,120,200,.3);background:rgba(80,120,200,.12);color:#90b0e8;font-size:10px;cursor:pointer;white-space:nowrap">习得</button>`
        }
      </div>
    </div>`;
}

/* ── 掌门操作 ────────────────────────────────────────────────────── */

/**
 * 激活镇派之宝
 */
function gmActivateRelic(sectId) {
  const state = _gmLoad();
  if (!state[sectId]) state[sectId] = {};
  state[sectId].relicActivated = true;
  _gmSave(state);

  const relic = GM_RELICS[sectId];
  if (relic) _gmToast('⚡ 镇派之宝「' + relic.name + '」已激活！', 'ok');

  // 刷新面板
  _gmRefreshPanel(sectId);
}

/**
 * 显示日令选择弹窗
 */
function gmShowEdicts(sectId) {
  const old = document.getElementById('gmEdictOverlay');
  if (old) old.remove();

  const sect = _gmGetSect(sectId);
  if (!sect) return;
  const ed = _gmEdS();
  const sColor = sect.color || '#ffa040';

  const el = document.createElement('div');
  el.id = 'gmEdictOverlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(4px)';

  let edictHtml = GM_EDICTS.map(e => {
    const hasCost = e.cost && e.cost.silver;
    const canAfford = !hasCost || (ed.silver || 0) >= e.cost.silver;
    return `
      <div onclick="${canAfford ? `gmIssueEdict('${sectId}','${e.id}')` : ''}" style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;border:1px solid rgba(240,200,80,.12);background:rgba(240,200,80,.04);margin-bottom:6px;cursor:${canAfford ? 'pointer' : 'not-allowed'};opacity:${canAfford ? 1 : 0.4};transition:.15s" onmouseover="if(${canAfford})this.style.background='rgba(240,200,80,.09)'" onmouseout="this.style.background='rgba(240,200,80,.04)'">
        <div style="font-size:22px;flex-shrink:0">${e.icon}</div>
        <div style="flex:1">
          <div style="font-size:12px;color:#e0c060;font-weight:bold">${e.name}</div>
          <div style="font-size:10px;color:rgba(200,180,140,.5);margin-top:2px">${e.desc}</div>
        </div>
        ${hasCost ? `<div style="font-size:11px;color:#e0c060;white-space:nowrap">💰-${e.cost.silver}</div>` : ''}
      </div>`;
  }).join('');

  el.innerHTML = `
    <div style="width:min(400px,90vw);border-radius:14px;background:linear-gradient(170deg,#181020,#120c18);border:1px solid ${sColor}30;box-shadow:0 0 40px rgba(0,0,0,.6);overflow:hidden">
      <div style="padding:18px 20px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(240,200,80,.08)">
        <span style="font-size:14px;color:#e0c060;font-weight:bold">📜 发布掌门日令</span>
        <button onclick="document.getElementById('gmEdictOverlay').remove()" style="background:none;border:none;color:rgba(200,180,140,.5);font-size:18px;cursor:pointer">×</button>
      </div>
      <div style="padding:14px 16px 18px">${edictHtml}</div>
    </div>`;

  document.body.appendChild(el);
}

/**
 * 发布日令
 */
function gmIssueEdict(sectId, edictId) {
  const old = document.getElementById('gmEdictOverlay');
  if (old) old.remove();

  const edict = GM_EDICTS.find(e => e.id === edictId);
  if (!edict) return;

  const ed = _gmEdS();

  // 扣除成本
  if (edict.cost && edict.cost.silver) {
    if ((ed.silver || 0) < edict.cost.silver) {
      _gmToast('银两不足！'); return;
    }
    ed.silver -= edict.cost.silver;
  }

  // 发放奖励
  const r = edict.reward || {};
  if (r.contrib) ed.sectContrib = (ed.sectContrib || 0) + r.contrib;
  if (r.silver) ed.silver = (ed.silver || 0) + r.silver;
  if (r.exp) {
    if (typeof addPlayerExp === 'function') addPlayerExp(r.exp);
    else if (ed.exp !== undefined) ed.exp = (ed.exp || 0) + r.exp;
  }
  if (r.fame) {
    try {
      if (typeof window.jianghuState !== 'undefined' && window.jianghuState.reputation) {
        window.jianghuState.reputation.fame = (window.jianghuState.reputation.fame || 0) + r.fame;
        if (typeof jianghuSave === 'function') jianghuSave();
      }
    } catch(e) {}
  }

  if (typeof saveGameState === 'function') saveGameState();
  // 注意：不再手动 localStorage.setItem，saveGameState 已包含存档逻辑

  // 存档日令记录
  const state = _gmLoad();
  if (!state[sectId]) state[sectId] = {};
  state[sectId].edictDate = _gmTodayStr();
  state[sectId].lastEdict = edict.name;
  _gmSave(state);

  _gmToast('📜 日令「' + edict.name + '」已下达！', 'ok');
  _gmRefreshPanel(sectId);
}

/**
 * 学习传承秘功
 */
function gmLearnSecretSkill(sectId) {
  const state = _gmLoad();
  if (!state[sectId]) state[sectId] = {};
  state[sectId].secretSkillLearned = true;
  _gmSave(state);

  _gmToast('⚡ 传承秘功已习得！', 'ok');
  _gmRefreshPanel(sectId);
}

function _gmRefreshPanel(sectId) {
  const panel = document.getElementById('gmLeaderPanel');
  if (!panel) return;
  const sect = _gmGetSect(sectId);
  const ed = _gmEdS();
  if (!sect) return;
  // 重新渲染并替换内容（不含外层容器）
  const isLeader = gmIsLeader(sectId);
  if (isLeader) {
    panel.innerHTML = '<div style="font-size:13px;color:#e0c060;font-weight:bold;margin-bottom:14px">👑 掌门之位</div>' +
      _gmRenderLeaderFunctions(sect, ed);
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  sect.html 长老殿 底部集成
 * ════════════════════════════════════════════════════════════════════ */

/**
 * 增强长老殿，在底部追加掌门传承面板
 * 调用时机：renderHall(sect) 完成后
 */
function gmEnhanceHall(sectId) {
  const hallEl = document.getElementById('sectHallContent');
  if (!hallEl) return;

  const old = document.getElementById('gmLeaderPanelWrapper');
  if (old) old.remove();

  const html = gmRenderLeaderPanel(sectId);
  if (!html) return;

  const div = document.createElement('div');
  div.id = 'gmLeaderPanelWrapper';
  div.innerHTML = html;
  hallEl.appendChild(div);
}

/* ════════════════════════════════════════════════════════════════════
 *  全局挂载
 * ════════════════════════════════════════════════════════════════════ */

window.gmAssumeLeadership = gmAssumeLeadership;
window.gmConfirmLeadership = gmConfirmLeadership;
window.gmActivateRelic = gmActivateRelic;
window.gmShowEdicts = gmShowEdicts;
window.gmIssueEdict = gmIssueEdict;
window.gmLearnSecretSkill = gmLearnSecretSkill;
window.gmEnhanceHall = gmEnhanceHall;
window.gmIsLeader = gmIsLeader;
window.gmRenderLeaderPanel = gmRenderLeaderPanel;

window.GM = {
  assumeLeadership: gmAssumeLeadership,
  confirmLeadership: gmConfirmLeadership,
  activateRelic: gmActivateRelic,
  showEdicts: gmShowEdicts,
  issueEdict: gmIssueEdict,
  learnSecretSkill: gmLearnSecretSkill,
  enhanceHall: gmEnhanceHall,
  isLeader: gmIsLeader,
  renderLeaderPanel: gmRenderLeaderPanel,
  canAssumeLeadership: gmCanAssumeLeadership,
};
