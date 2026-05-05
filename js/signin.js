// ═══════════════════════════════════════════════════════════════
//  signin.js — 每日签到系统
//  7天一轮，奖励递增；断签重置为第1天
//  存储 key：wuxia_signin_state
// ═══════════════════════════════════════════════════════════════

const SIGNIN_KEY = 'wuxia_signin_state';

const SIGNIN_CYCLE = 7; // 7天一轮

// ── 签到奖励表（day 1-7）──
const SIGNIN_REWARDS = [
  { day: 1, icon: '🪙', label: '铜钱袋',   reward: { silver: 30 } },
  { day: 2, icon: '🍚', label: '干粮一份', reward: { silver: 50 } },
  { day: 3, icon: '🍵', label: '上等好茶', reward: { silver: 80, exp: 20 } },
  { day: 4, icon: '📜', label: '功法残页', reward: { silver: 100, exp: 40 } },
  { day: 5, icon: '💊', label: '金疮药',   reward: { silver: 120, exp: 60 } },
  { day: 6, icon: '✨', label: '江湖奇遇', reward: { silver: 150, exp: 80, rep: 10 } },
  { day: 7, icon: '🎁', label: '大侠礼包', reward: { silver: 300, exp: 150, rep: 25 } },
];

// ── 签到状态 ──
let _signinState = {
  currentDay: 0,       // 当前周期第几天（0=今天还没签）
  cycleCount: 0,        // 完成的完整周期数
  lastDate: '',         // 上次签到日期 YYYY-MM-DD
  totalDays: 0,         // 历史总签到天数
  claimedToday: false,  // 今天是否已签
};

function signinLoad() {
  try {
    const raw = localStorage.getItem(SIGNIN_KEY);
    if (raw) {
      _signinState = Object.assign({}, _signinState, JSON.parse(raw));
    }
  } catch(e) {}
  _signinCheckNewDay();
}

function signinSave() {
  try { localStorage.setItem(SIGNIN_KEY, JSON.stringify(_signinState)); } catch(e) {}
}

function _signinToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function _signinCheckNewDay() {
  const today = _signinToday();
  if (_signinState.lastDate !== today) {
    _signinState.claimedToday = false;
  }
}

// ── 执行签到 ──
function signinDoSignin() {
  if (_signinState.claimedToday) return false;
  _signinCheckNewDay();
  if (_signinState.claimedToday) return false;

  const today = _signinToday();
  // 检查是否连续：如果昨天没签，重置周期
  const yesterday = new Date(Date.now() - 86400000);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

  if (_signinState.lastDate && _signinState.lastDate !== yStr) {
    // 断签了，重置到第1天
    _signinState.currentDay = 0;
  }

  // 推进到下一天
  _signinState.currentDay++;
  if (_signinState.currentDay > SIGNIN_CYCLE) {
    _signinState.currentDay = 1;
    _signinState.cycleCount++;
  }

  _signinState.lastDate = today;
  _signinState.claimedToday = true;
  _signinState.totalDays++;
  signinSave();

  // 发放奖励
  const reward = SIGNIN_REWARDS[_signinState.currentDay - 1];
  _signinApplyReward(reward);

  return { day: _signinState.currentDay, reward };
}

function _signinApplyReward(reward) {
  if (!reward || !reward.reward) return;
  const r = reward.reward;

  // 银两：优先用 SilverManager（各页面通用），其次用 addSilver
  if (r.silver) {
    if (typeof SilverManager !== 'undefined' && SilverManager.add) {
      SilverManager.add(r.silver);
      SilverManager.save();
    } else if (typeof addSilver === 'function') {
      addSilver(r.silver);
      // 额外同步到 travelPlayerState（防止 battle 页面 edS 不同步）
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.silver = (travelPlayerState.silver || 0) + r.silver;
        if (typeof travelSave === 'function') travelSave();
      }
    } else if (typeof travelPlayerState !== 'undefined') {
      // 最底层 fallback：直接写 travelPlayerState
      travelPlayerState.silver = (travelPlayerState.silver || 0) + r.silver;
      if (typeof travelSave === 'function') travelSave();
    }
  }
  if (r.exp && typeof addExp === 'function') {
    addExp(r.exp);
  }
  if (r.rep && typeof travelPlayerState !== 'undefined') {
    travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation || 100) + r.rep);
    if (typeof travelSave === 'function') travelSave();
  }
}

// ── 签到UI ──
function showSigninPanel() {
  signinLoad();

  // 如果今天已签，显示已签状态；否则显示签到按钮
  document.querySelectorAll('.signin-overlay').forEach(el => el.remove());

  const ov = document.createElement('div');
  ov.className = 'signin-overlay';
  ov.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,.92);z-index:600;
    display:flex;align-items:center;justify-content:center;
    padding:20px;
  `;

  const today = _signinToday();
  const isClaimed = _signinState.claimedToday && _signinState.lastDate === today;
  const dayLabels = ['一','二','三','四','五','六','日'];

  // 今天未签到时，"今日"应指向 currentDay+1（下一天待签）
  // 今天已签到时，"今日"指向 currentDay（已完成的那天）
  const displayToday = isClaimed
    ? _signinState.currentDay
    : (_signinState.currentDay >= SIGNIN_CYCLE ? 1 : _signinState.currentDay + 1);

  let daysHtml = '';
  for (let i = 0; i < SIGNIN_CYCLE; i++) {
    const rw = SIGNIN_REWARDS[i];
    const dayNum = i + 1;
    const isDone = dayNum < displayToday;       // 已完成的天数（不含今日）
    const isToday = dayNum === displayToday;     // 今日（待签或已签）
    const border = isToday ? 'border-color:#f0c060;' : 'border-color:rgba(240,192,96,.1);';
    const bg = isDone ? 'background:rgba(240,192,96,.08);' : isToday ? 'background:rgba(240,192,96,.15);' : '';

    daysHtml += `
      <div style="flex:1;text-align:center;padding:10px 4px;border-radius:8px;border:1px solid;${border}${bg}min-width:0;">
        <div style="font-size:20px;margin-bottom:4px;${isDone ? 'opacity:.5;' : ''}">${rw.icon}</div>
        <div style="font-size:10px;color:#806040;margin-bottom:2px;">第${dayLabels[i]}天</div>
        <div style="font-size:11px;color:#c0a060;font-weight:bold;">${rw.label}</div>
        <div style="font-size:9px;color:#604830;margin-top:3px;">
          ${rw.reward.silver ? rw.reward.silver+'银' : ''}
          ${rw.reward.exp ? ' +'+rw.reward.exp+'经验' : ''}
          ${rw.reward.rep ? ' +'+rw.reward.rep+'声望' : ''}
        </div>
        ${isDone ? '<div style="font-size:10px;color:#60c080;margin-top:4px;">✓</div>' : isToday ? '<div style="font-size:9px;color:#ffd060;margin-top:4px;">● 今日</div>' : ''}
      </div>
    `;
  }

  const btnText = isClaimed
    ? '✓ 今日已签到'
    : '📝 签到领取奖励';
  const btnStyle = isClaimed
    ? 'background:rgba(100,80,50,.3);color:#604830;cursor:default;'
    : 'background:linear-gradient(135deg,#f0c060,#c08030);color:#1a1410;cursor:pointer;font-weight:bold;';

  ov.innerHTML = `
    <div style="
      background:rgba(5,4,16,.98);border:1px solid rgba(240,192,96,.2);
      border-radius:12px;width:100%;max-width:420px;
      display:flex;flex-direction:column;">
      
      <div style="padding:20px 24px;border-bottom:1px solid rgba(240,192,96,.1);display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:26px">📋</span>
          <div>
            <div style="font-size:16px;color:#ffd060;letter-spacing:1px;">每日签到</div>
            <div style="font-size:10px;color:#806040;">连续签到奖励更多 · 累计 ${_signinState.totalDays} 天</div>
          </div>
        </div>
        <button onclick="this.closest('.signin-overlay').remove()"
          style="background:none;border:none;color:#a08060;font-size:18px;cursor:pointer;">✕</button>
      </div>

      <div style="padding:16px 12px;">
        <div id="signinDaysContainer" style="display:flex;gap:6px;">
          ${daysHtml}
        </div>
      </div>

      <div style="padding:8px 20px 16px;text-align:center;">
        <button id="signinClaimBtn" onclick="signinClaim()" style="
          width:100%;padding:12px;border-radius:8px;border:none;
          font-size:14px;font-family:inherit;${btnStyle}">
          ${btnText}
        </button>
        <div style="font-size:10px;color:#503820;margin-top:8px;">
          已完成 ${_signinState.cycleCount} 个完整周期 · 断签将重置进度
        </div>
      </div>
    </div>
  `;

  ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
}

function signinClaim() {
  if (_signinState.claimedToday) return;

  const result = signinDoSignin();
  if (!result) return;

  // 播放音效
  if (typeof playAudio === 'function') playAudio('achievement');

  // ── 实时更新daysHtml（替换7天卡片的已签状态）──
  const dayLabels = ['一','二','三','四','五','六','日'];
  const curDay = result.day; // 刚签的是哪一天
  // 签到后：今日=已签的那天（显示✓），明天是 curDay+1（若有）
  const displayTodayAfterClaim = curDay >= SIGNIN_CYCLE ? 1 : curDay + 1;

  // 重新计算每一天的样式
  const daysContainer = document.getElementById('signinDaysContainer');
  if (daysContainer) {
    let newDaysHtml = '';
    for (let i = 0; i < SIGNIN_CYCLE; i++) {
      const rw = SIGNIN_REWARDS[i];
      const dayNum = i + 1;
      const isDone = dayNum <= curDay; // 签到后：已完成的天（含今日）显示✓
      const border = dayNum === curDay ? 'border-color:#f0c060;' : 'border-color:rgba(240,192,96,.1);';
      const bg = dayNum <= curDay ? 'background:rgba(240,192,96,.08);' : '';
      newDaysHtml += `
        <div style="flex:1;text-align:center;padding:10px 4px;border-radius:8px;border:1px solid;${border}${bg}min-width:0;">
          <div style="font-size:20px;margin-bottom:4px;${dayNum < curDay ? 'opacity:.5;' : ''}">${rw.icon}</div>
          <div style="font-size:10px;color:#806040;margin-bottom:2px;">第${dayLabels[i]}天</div>
          <div style="font-size:11px;color:#c0a060;font-weight:bold;">${rw.label}</div>
          <div style="font-size:9px;color:#604830;margin-top:3px;">
            ${rw.reward.silver ? rw.reward.silver+'银' : ''}
            ${rw.reward.exp ? ' +'+rw.reward.exp+'经验' : ''}
            ${rw.reward.rep ? ' +'+rw.reward.rep+'声望' : ''}
          </div>
          ${isDone ? '<div style="font-size:10px;color:#60c080;margin-top:4px;">✓</div>' : ''}
        </div>`;
    }
    daysContainer.innerHTML = newDaysHtml;
  }

  // ── 更新按钮：禁用 + 显示已签到 ──
  const btn = document.getElementById('signinClaimBtn');
  if (btn) {
    btn.textContent = '✓ 今日已签到';
    btn.style.background = 'rgba(100,80,50,.3)';
    btn.style.color = '#604830';
    btn.style.cursor = 'default';
    btn.disabled = true;
    btn.onclick = null; // 移除点击事件
  }
  // 同步清除悬浮角标高亮
  const floatBtn = document.getElementById('townSigninFloat');
  if (floatBtn) floatBtn.classList.remove('unclaimed');

  // 显示奖励toast
  const r = result.reward;
  let rewardText = '';
  if (r.reward.silver) rewardText += `银两+${r.reward.silver}  `;
  if (r.reward.exp) rewardText += `经验+${r.reward.exp}  `;
  if (r.reward.rep) rewardText += `声望+${r.reward.rep}  `;
  if (rewardText && typeof townToast === 'function') {
    townToast(`📋 签到成功！第${result.day}天：${rewardText.trim()}`, 'good');
  }

  // 第7天额外特效
  if (result.day === SIGNIN_CYCLE) {
    setTimeout(() => {
      if (typeof townToast === 'function') {
        townToast('🎁 完成一个完整签到周期！下个周期奖励更丰厚~', 'legendary');
      }
    }, 1500);
  }
}

// ── 页面加载时检查并提示 ──
function signinCheckOnLoad() {
  signinLoad();
  const today = _signinToday();
  const isClaimed = _signinState.claimedToday && _signinState.lastDate === today;
  return !isClaimed;
}

// ── 导出 ──
window.showSigninPanel = showSigninPanel;
window.signinClaim = signinClaim;
window.signinCheckOnLoad = signinCheckOnLoad;
