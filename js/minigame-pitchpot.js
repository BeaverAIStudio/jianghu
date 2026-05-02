/**
 * minigame-pitchpot.js — 酒馆投壶 v3.3
 *
 * 玩法：控制角度和力度，将箭矢投入壶口
 * 特色：主角高大字符画、小壶口、下落命中、人高壶矮透视、酒馆氛围
 */

const PITCHPOT_KEY = 'wuxia_pitchpot_data';

/* ═══════════════════════════════════════════════════════
   字符画场景资源
   ═══════════════════════════════════════════════════════ */

// 壶口字符画（只有壶口，无壶身；近壶口大=好投，远壶口小=难投）
const PP_POT_ART = {
  near: {
    frame: [
      '╭───╮',
      '│   │',
      '╰───╯',
    ],
    width: 6,
    mouthLine: 0,    // 壶口在第几行
  },
  middle: {
    frame: [
      '　╭──╮　',
      '　│　│　',
      '　╰──╯　',
    ],
    width: 8,
    mouthLine: 0,
  },
  far: {
    frame: [
      '　╭─╮　',
      '　│ │　',
      '　╰─╯　',
    ],
    width: 6,
    mouthLine: 0,
  },
  oblique: {
    frame: [
      '　╭─╮　',
      '　╱ ╲　',
      '　╰─╯　',
    ],
    width: 6,
    mouthLine: 0,
    rotate: true,
  },
};

// 酒馆横幅
const PP_BANNER = [
  '╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮',
  '┃　🏮 醉仙楼 · 投壶雅戏 🏮　　┃',
  '┃　　酒香四溢　投壶行令　　　　┃',
  '╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯',
];

/* ═══════════════════════════════════════════════════════
   游戏配置
   ═══════════════════════════════════════════════════════ */

// 壶口配置
// distFrac：壶口在飞行距离线上的位置（0=起点, 1=远壶位置）
// hitZone：命中容差，壶口越小的壶越难
const PP_POTS = [
  { id: 'near',    name: '近壶',   art: 'near',    points: 10, distFrac: 0.35, hitZone: 0.11 },
  { id: 'middle',  name: '中壶',   art: 'middle',  points: 25, distFrac: 0.62, hitZone: 0.09 },
  { id: 'oblique', name: '斜壶',   art: 'oblique', points: 40, distFrac: 0.88, hitZone: 0.07 },
  { id: 'far',     name: '远壶',   art: 'far',     points: 50, distFrac: 1.00, hitZone: 0.06 },
];

// 风向配置（visualForce用于飞行动画的视觉偏移幅度）
const PP_WINDS = [
  { dir: '无风', force: 0,    visualForce: 0,    icon: '○', color: '#a0a0a0' },
  { dir: '微风', force: 0.06, visualForce: 0.04, icon: '→', color: '#87ceeb' },
  { dir: '微风', force: 0.06, visualForce: 0.04, icon: '←', color: '#87ceeb' },
  { dir: '东风', force: 0.12, visualForce: 0.08, icon: '⇉', color: '#87ceeb' },
  { dir: '西风', force: 0.12, visualForce: 0.08, icon: '⇢', color: '#e09050' },
];

// 行酒令
const PP_WIN_LINES = [
  '好箭法！满堂喝彩！', '中矣！再来一壶！', '百步穿杨，佩服佩服！',
  '妙哉！此箭可入《投壶谱》！', '好手！当浮一大白！',
  '箭无虚发！真是高手！', '妙！壶神附体！', '连中三元者，赏酒一坛！',
];
const PP_MISS_LINES = [
  '可惜可惜，差了分毫。', '莫急，下一箭定能命中！',
  '壶口虽小，心要静！', '再试试，风向有变！', '此壶非彼壶，力道再斟酌！',
];

/* ═══════════════════════════════════════════════════════
   游戏状态
   ═══════════════════════════════════════════════════════ */

// 投壶门票
const PP_ENTRY_FEE = 10; // 每局10两

let ppState = {
  score: 0, arrows: 5, totalArrows: 5,
  wind: null, pot: null,
  angle: 45, power: 50,
  throwing: false, highScore: 0,
  history: [],
};

let ppAnimTimer = null;
let ppAmbientTimer = null;  // 氛围动画 timer
let ppLayout = { sceneW: 36, playerZoneW: 14, distPad: 10, potStartCol: 24, potW: 6 };

function _ppShowToast(msg) {
  const el = document.getElementById('ppPopup');
  if (!el) return;
  const t = document.createElement('div');
  t.style.cssText = 'position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(80,30,20,.92);color:#ffd060;padding:8px 18px;border-radius:8px;font-size:13px;z-index:999;animation:ppToastFade 2s forwards;pointer-events:none;white-space:nowrap;';
  t.textContent = msg;
  el.querySelector('.pp-box').appendChild(t);
  setTimeout(() => t.remove(), 2100);
}

/* ═══════════════════════════════════════════════════════
   主角字符画构建（从 edS 读取 ft-animated 部件）
   ═══════════════════════════════════════════════════════ */

function _ppBuildPlayerHtml(col) {
  // 降级：如果 edS 或 ED_PARTS 不可用
  if (typeof ED_PARTS === 'undefined' || typeof edS === 'undefined') {
    return `<div style="font-size:20px;color:${col}">🗡️</div>`;
  }

  const getPart = k => {
    if (edS.useCustom[k] && edS.custom[k]) return edS.custom[k];
    return ED_PARTS[k][edS.parts[k]]?.v || '';
  };

  const auraStr = getPart('aura');
  const headStr = getPart('head');
  const bodyStr = getPart('body');
  const legsStr = getPart('legs');

  // 手臂处理
  let armsStr = getPart('arms');
  if (!edS.useCustom.arms && !edS.armsLocked && edS.weaponId) {
    const idx = (typeof getWepArmsIdx === 'function') ? getWepArmsIdx(edS.weaponId) : null;
    if (idx !== null && ED_PARTS.arms[idx]) armsStr = ED_PARTS.arms[idx].v;
  }
  let armL, armR;
  if (!edS.useCustom.arms) {
    const data = ED_PARTS.arms[edS.parts.arms];
    if (data && data.lv !== undefined) { armL = data.lv; armR = data.rv || ''; }
    else {
      const line = (armsStr || '').split('\n')[0];
      const chars = [...line];
      const mid = Math.ceil(chars.length / 2);
      armL = chars.slice(0, mid).join('');
      armR = chars.slice(mid).join('');
    }
  } else {
    const line = (armsStr || '').split('\n')[0];
    const chars = [...line];
    const mid = Math.ceil(chars.length / 2);
    armL = chars.slice(0, mid).join('');
    armR = chars.slice(mid).join('');
  }

  const auraHtml = auraStr
    ? `<div class="ft-aura" style="color:${col}">${auraStr}</div>` : '';

  return auraHtml
    + `<div class="ft-head" style="color:${col}">${headStr}</div>`
    + `<div class="pp-torso-row">`
    +   `<div class="ft-arm-l" style="color:${col}">${armL}</div>`
    +   `<div class="ft-body-wrap"><div class="ft-body" style="color:${col}">${bodyStr}</div></div>`
    +   `<div class="ft-arm-r" style="color:${col}">${armR}</div>`
    + `</div>`
    + `<div class="ft-legs" style="color:${col}">${legsStr}</div>`;
}

/* ═══════════════════════════════════════════════════════
   打开 / 关闭
   ═══════════════════════════════════════════════════════ */

function openPitchpotGame(cityId) {
  if (!edS.gameDay) edS.gameDay = 0;
  if (typeof SoundFX !== 'undefined') SoundFX.play('craft_open');
  ppLoad();
  ppNewRound();
  ppRender();
}

function ppClose() {
  if (ppAnimTimer) { clearTimeout(ppAnimTimer); ppAnimTimer = null; }
  if (ppAmbientTimer) { clearInterval(ppAmbientTimer); ppAmbientTimer = null; }
  const el = document.getElementById('ppPopup');
  if (el) el.remove();
  ppSave();
  if (typeof travelRenderLocation === 'function') travelRenderLocation();
}

/* ═══════════════════════════════════════════════════════
   回合管理
   ═══════════════════════════════════════════════════════ */

function ppNewRound() {
  ppState.wind = PP_WINDS[rand(0, PP_WINDS.length - 1)];
  ppState.pot = PP_POTS[rand(0, PP_POTS.length - 1)];
}

function _ppPlayerSilver() {
  // 使用统一银两管理器
  return getSilver();
}
function _ppAddSilver(delta) {
  // 使用统一银两管理器
  addSilver(delta);
  SilverManager.save();
}

function ppReset() {
  if (ppAnimTimer) { clearTimeout(ppAnimTimer); ppAnimTimer = null; }
  if (ppAmbientTimer) { clearInterval(ppAmbientTimer); ppAmbientTimer = null; }
  // 检查银两
  const silver = _ppPlayerSilver();
  if (silver < PP_ENTRY_FEE) {
    _ppShowToast(`银两不足！投壶需 ${PP_ENTRY_FEE} 两入场费`);
    return;
  }
  _ppAddSilver(-PP_ENTRY_FEE);
  ppState.score = 0;
  ppState.arrows = ppState.totalArrows;
  ppState.throwing = false;
  ppState.history = [];
  ppNewRound();
  ppRender();
}

/* ═══════════════════════════════════════════════════════
   主渲染
   ═══════════════════════════════════════════════════════ */

function ppRender() {
  const potArt = PP_POT_ART[ppState.pot.art];
  const col = (typeof edS !== 'undefined') ? (edS.color || '#f0c060') : '#f0c060';
  const playerHtml = _ppBuildPlayerHtml(col);

  const html = `
    <div class="pp-overlay" onclick="if(event.target===this)ppClose()">
      <div class="pp-box">
        <!-- 横幅 -->
        <div class="pp-banner">${PP_BANNER.map(l => `<div>${l}</div>`).join('')}</div>

        <!-- 信息栏 -->
        <div class="pp-info-bar">
          <div class="pp-info-cell">
            <span class="pp-info-icon">🏆</span>
            <span class="pp-info-lbl">得分</span>
            <span class="pp-info-val">${ppState.score}</span>
          </div>
          <div class="pp-info-cell">
            <span class="pp-info-icon">🏹</span>
            <span class="pp-info-lbl">箭矢</span>
            <span class="pp-info-val">${ppState.arrows}/${ppState.totalArrows}</span>
          </div>
          <div class="pp-info-cell">
            <span class="pp-info-icon" style="color:${ppState.wind.color}">🌬</span>
            <span class="pp-info-lbl">风向</span>
            <span class="pp-info-val" style="color:${ppState.wind.color}">${ppState.wind.icon} ${ppState.wind.dir}</span>
          </div>
          <div class="pp-info-cell">
            <span class="pp-info-icon">🎯</span>
            <span class="pp-info-lbl">目标</span>
            <span class="pp-info-val">${ppState.pot.name} <small style="color:#ffd060">(${ppState.pot.points}分)</small></span>
          </div>
        </div>

        <!-- 箭矢剩余 -->
        <div class="pp-arrows-row">
          ${Array.from({length: ppState.totalArrows}, (_, i) =>
            `<span class="pp-arrow-indicator${i >= ppState.arrows ? ' used' : ''}">${i < ppState.arrows ? '🏹' : '·'}</span>`
          ).join('')}
        </div>

        <!-- 场景 -->
        <div class="pp-scene-wrap">
          <!-- 氛围层 -->
          <div class="pp-ambience" id="ppAmbience">
            <div class="pp-lantern pp-lantern-l" id="ppLanternL">🏮</div>
            <div class="pp-lantern pp-lantern-r" id="ppLanternR">🏮</div>
            <div class="pp-candle pp-candle-l" id="ppCandleL">🕯️</div>
            <div class="pp-candle pp-candle-r" id="ppCandleR">🕯️</div>
            <div class="pp-dust-container" id="ppDustContainer"></div>
          </div>
          <!-- 地面线（场景级，横贯底部） -->
          <div class="pp-ground-line"></div>
          <!-- 主场景 -->
          <div class="pp-scene-main">
            <!-- 左侧：主角（高，靠上，人站得高） -->
            <div class="pp-player-zone" id="ppPlayerZone" style="color:${col}">
              <div class="pp-ft-animated" id="ppPlayerArt">${playerHtml}</div>
            </div>
            <!-- 中间：距离标尺（半空区域，抛物线经过） -->
            <div class="pp-field-zone" id="ppFieldZone">
              <div class="pp-distance-ruler" id="ppDistanceRuler"></div>
            </div>
            <!-- 右侧：壶口（矮，靠底部，壶在地上） -->
            <div class="pp-pot-zone" id="ppPotZone">
              <div class="pp-pot-glow" id="ppPotGlow"></div>
              <div class="pp-pot-art" id="ppPotArt">
                ${potArt.frame.map(l => `<div class="pp-pot-line">${l.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`).join('')}
              </div>
              <div class="pp-pot-label">${ppState.pot.name}<small> ${ppState.pot.points}分</small></div>
            </div>
          </div>
          <!-- 瞄准canvas -->
          <canvas class="pp-aim-canvas" id="ppAimCanvas"></canvas>
          <!-- 命中/未中浮动提示 -->
          <div class="pp-float-msg" id="ppFloatMsg"></div>
        </div>

        <!-- 操控 -->
        <div class="pp-controls" id="ppControls">
          <div class="pp-ctrl-row">
            <div class="pp-ctrl-item">
              <div class="pp-ctrl-label">📐 角度 <span id="ppAngleVal">${ppState.angle}°</span></div>
              <input type="range" id="ppAngleSlider" min="15" max="75" value="${ppState.angle}"
                     oninput="ppSetAngle(+this.value)" class="pp-slider pp-slider-angle">
              <div class="pp-ctrl-hint">15° — 75°</div>
            </div>
            <div class="pp-ctrl-item">
              <div class="pp-ctrl-label">💪 力度 <span id="ppPowerVal">${ppState.power}%</span></div>
              <input type="range" id="ppPowerSlider" min="10" max="100" value="${ppState.power}"
                     oninput="ppSetPower(+this.value)" class="pp-slider pp-slider-power">
              <div class="pp-ctrl-hint">10% — 100%</div>
            </div>
          </div>
          <div class="pp-ctrl-btns">
            <button class="pp-btn pp-btn-throw" id="ppThrowBtn" onclick="ppThrow()"
                    ${ppState.arrows <= 0 || ppState.throwing ? 'disabled' : ''}>
              🏹 投掷
            </button>
            <button class="pp-btn" id="ppResetBtn" onclick="ppReset()"${ppState.throwing ? ' disabled' : ''}>🔄 重新开始</button>
            <button class="pp-btn" id="ppCloseBtn" onclick="ppClose()"${ppState.throwing ? ' disabled' : ''}>🚪 离开</button>
          </div>
        </div>

        <!-- 游戏记录 -->
        <div class="pp-history" id="ppHistory">
          ${ppState.history.length ? ppRenderHistory() : '<div class="pp-history-empty">尚无投壶记录</div>'}
        </div>

        ${ppState.highScore ? `<div class="pp-highscore">🏅 历史最高: ${ppState.highScore} 分</div>` : ''}

        <div class="pp-rules">📜 精准控制角度和力度将箭矢投入壶口 · 风向会偏移箭矢 · 越远的壶口越小越难！</div>
      </div>
    </div>
  `;

  let el = document.getElementById('ppPopup');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ppPopup';
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  ppInjectStyles();
  // 动态设置中间距离区域的弹性比例（近壶窄=壶靠中间，远壶宽=壶靠右）
  const fieldZone = document.getElementById('ppFieldZone');
  if (fieldZone) fieldZone.style.flexGrow = ppState.pot.distFrac;
  ppStartAmbience();
  // 延迟初始化瞄准线和布局
  setTimeout(() => {
    ppUpdateLayout();
    ppUpdateAimLine();
  }, 100);
}

/* ═══════════════════════════════════════════════════════
   布局计算
   ═══════════════════════════════════════════════════════ */

function ppUpdateLayout() {
  const sceneWrap = document.querySelector('.pp-scene-wrap');
  const playerZone = document.getElementById('ppPlayerZone');
  const potZone = document.getElementById('ppPotZone');
  if (!sceneWrap || !playerZone || !potZone) return;

  const wrapW = sceneWrap.getBoundingClientRect().width;
  const playerRect = playerZone.getBoundingClientRect();
  const potRect = potZone.getBoundingClientRect();

  // 记录玩家右边缘和壶口中心在容器内的X位置（像素）
  ppLayout.wrapW = wrapW;
  ppLayout.playerRightX = playerRect.right - sceneWrap.getBoundingClientRect().left;
  ppLayout.potCenterX = potRect.left + potRect.width / 2 - sceneWrap.getBoundingClientRect().left;
  ppLayout.potCenterY = potRect.top + 10 - sceneWrap.getBoundingClientRect().top;
  // 最大飞行距离（像素）= 场景右边缘 - 玩家右边缘（固定不变，不受壶口视觉位置影响）
  ppLayout.maxFlightPx = wrapW - 20 - ppLayout.playerRightX;
}

/* ═══════════════════════════════════════════════════════
   操控
   ═══════════════════════════════════════════════════════ */

function ppSetAngle(v) {
  ppState.angle = v;
  const el = document.getElementById('ppAngleVal');
  if (el) el.textContent = v + '°';
  ppUpdateAimLine();
}

function ppSetPower(v) {
  ppState.power = v;
  const el = document.getElementById('ppPowerVal');
  if (el) el.textContent = v + '%';
  ppUpdateAimLine();
}

/* ═══════════════════════════════════════════════════════
   投掷
   ═══════════════════════════════════════════════════════ */

function ppThrow() {
  if (ppState.arrows <= 0 || ppState.throwing) return;
  ppState.throwing = true;
  ppState.arrows--;

  const btn = document.getElementById('ppThrowBtn');
  const resetBtn = document.getElementById('ppResetBtn');
  const closeBtn = document.getElementById('ppCloseBtn');
  if (btn) btn.disabled = true;
  if (resetBtn) resetBtn.disabled = true;
  if (closeBtn) closeBtn.disabled = true;

  // 播放音效
  if (typeof SoundFX !== 'undefined') SoundFX.play('throw');

  // 投掷姿态动画
  ppThrowPose(true);

  // 计算飞行参数（命中由动画碰撞检测决定）
  const result = ppCalcResult();

  // 播放飞行动画，回调接收实际命中状态
  ppPlayFlightAnim(result, (hitSuccess) => {
    // 用动画碰撞结果覆盖数学判定
    if (hitSuccess && !result.success) {
      result.success = true;
      result.points = ppState.pot.points;
      ppState.score += result.points;
      result.msg = PP_WIN_LINES[rand(0, PP_WIN_LINES.length - 1)];
    } else if (!hitSuccess && result.success) {
      result.success = false;
      result.points = 0;
      ppState.score -= result.potPoints; // 退回预加的分数
      result.msg = PP_MISS_LINES[rand(0, PP_MISS_LINES.length - 1)];
    }

    ppState.throwing = false;
    ppState.history.unshift(result);

    // 恢复待机姿态
    ppThrowPose(false);

    if (typeof SoundFX !== 'undefined') {
      if (result.success) {
        // 连续命中或高分壶用完美音效
        SoundFX.play('hit_target');
      } else {
        SoundFX.play('fail');
      }
    }
    ppShowFloatMsg(result);
    ppUpdateArrowIndicators();
    // 不在此处恢复按钮，等 ppRender() 统一管理，避免动画间隔期误触

    const histEl = document.getElementById('ppHistory');
    if (histEl) histEl.innerHTML = ppRenderHistory();
    ppRefreshScoreDisplay();

    if (ppState.arrows <= 0) {
      if (btn) btn.disabled = true;
      setTimeout(() => ppGameOver(), 2000);
    } else {
      ppNewRound();
      setTimeout(() => ppRender(), 1200);
    }
  });
}

// 切换投掷/待机姿态
function ppThrowPose(isThrowing) {
  const art = document.getElementById('ppPlayerArt');
  if (!art) return;
  if (isThrowing) {
    art.classList.add('pp-throwing');
  } else {
    art.classList.remove('pp-throwing');
  }
}

/* ═══════════════════════════════════════════════════════
   投掷物理（v3.1：下落掉进壶口才算命中）
   ═══════════════════════════════════════════════════════ */

// 计算壶口像素位置（壶口开口中心）
function ppGetPotPos(wrapW, wrapH) {
  const sceneWrap = document.querySelector('.pp-scene-wrap');
  const potZone = document.getElementById('ppPotZone');
  if (!sceneWrap || !potZone) return { x: wrapW * 0.7, y: wrapH * 0.65 };
  const sRect = sceneWrap.getBoundingClientRect();
  const pRect = potZone.getBoundingClientRect();
  return {
    x: pRect.left + pRect.width / 2 - sRect.left,
    y: pRect.top + 6 - sRect.top,  // 壶口开口的Y位置
  };
}

// 计算地面Y（场景底部，匹配CSS地面线位置bottom:18px）
function ppGetGroundY(wrapH) {
  return wrapH - 18;
}

// 计算玩家右手位置（发射点）
function ppGetPlayerPos(wrapW, wrapH) {
  const sceneWrap = document.querySelector('.pp-scene-wrap');
  const playerZone = document.getElementById('ppPlayerZone');
  if (!sceneWrap || !playerZone) return { x: wrapW * 0.12, y: wrapH * 0.6 };
  const sRect = sceneWrap.getBoundingClientRect();
  const pRect = playerZone.getBoundingClientRect();
  return {
    x: pRect.right - sRect.left,
    y: pRect.top + pRect.height * 0.4 - sRect.top,
  };
}

/**
 * 投掷结果计算（纯数学，不含动画）
 * 
 * 物理模型：斜抛运动
 * - 箭从玩家位置以一定角度和力度抛出
 * - 先上升（上升段），到达顶点后下落（下落段）
 * - 命中条件：箭下落经过壶口X位置时，Y坐标接近壶口Y位置
 * 
 * 用归一化坐标计算（避免像素依赖）：
 * - 水平距离: distMult = sin(2θ) × power^1.3
 * - 垂直位置: 在壶口X处的高度 = arcHeight × (1 - (distToPot/targetDist)²) × 垂直修正
 */
function ppCalcResult() {
  const angleRad = ppState.angle * Math.PI / 180;
  const power = ppState.power / 100;

  // 水平飞行距离比例（0~1.3可超）
  const baseDist = Math.sin(2 * angleRad) * Math.pow(power, 1.3);
  
  // 风力偏差
  const windDir = ppState.wind.icon.includes('←') ? -1 : 
                  (ppState.wind.icon.includes('→') || ppState.wind.icon.includes('⇉') || ppState.wind.icon.includes('⇢')) ? 1 : 0;
  const windOffset = ppState.wind.force * windDir * 0.10;

  // 手感偏差（远壶更难控制）
  const skillNoise = 0.04 + ppState.pot.distFrac * 0.05;
  const randomOffset = (Math.random() - 0.5) * 2 * skillNoise;

  // 实际水平落点（归一化）
  const finalDist = Math.max(0, baseDist + windOffset + randomOffset);

  // 壶口目标位置
  const target = ppState.pot.distFrac;
  const hitZone = ppState.pot.hitZone;

  // ═══════════════════════════════════════════════
  // 投壶"将将胡"系统
  // ═══════════════════════════════════════════════
  const luckRoll = Math.random();
  let specialEvent = null;
  let adjustedHitZone = hitZone;
  
  // 3%概率：神射（命中容差翻倍）
  if(luckRoll < 0.03){
    specialEvent = 'god_shot';
    adjustedHitZone = hitZone * 2;
  }
  // 4%概率：手滑（命中容差减半，更难中）
  else if(luckRoll < 0.07){
    specialEvent = 'slip';
    adjustedHitZone = hitZone * 0.5;
  }
  // 1%概率：连中三元（连续3箭必中，且分数+50%）
  else if(luckRoll < 0.08){
    const recentHits = ppState.history.slice(0, 2).filter(h => h.success).length;
    if(recentHits >= 2){
      specialEvent = 'triple_crown';
      adjustedHitZone = hitZone * 3; // 几乎必中
    }
  }
  
  // ═══════════════════════════════════════════════
  // 投壶"将将胡"恶搞事件（5%总概率）
  // ═══════════════════════════════════════════════
  const gagRoll = Math.random();
  if (gagRoll < 0.05 && !specialEvent) {
    const gagEvents = ['drunk_throw', 'bird_interference', 'slippery_floor', 
                       'wind_gust', 'distracted_by_beauty', 'arrow_bend'];
    specialEvent = gagEvents[Math.floor(Math.random() * gagEvents.length)];
    
    const gagMessages = {
      drunk_throw: { title: '🍺 醉醺醺！', msg: '你喝了几杯酒，手有点不稳...', type: 'warning' },
      bird_interference: { title: '🐦 鸟袭！', msg: '一只鸟飞过，撞偏了你的箭！', type: 'warning' },
      slippery_floor: { title: '😰 地板滑！', msg: '你脚下一滑，箭脱手了！', type: 'warning' },
      wind_gust: { title: '🌪️ 妖风！', msg: '突然一阵怪风，把箭吹歪了！', type: 'warning' },
      distracted_by_beauty: { title: '😍 分心了！', msg: '旁边走过一位美女，你走神了...', type: 'warning' },
      arrow_bend: { title: '🏹 弯箭！', msg: '这支箭居然是弯的！但意外好用？', type: 'rare' }
    };
    
    const gagMsg = gagMessages[specialEvent];
    if (typeof showToast === 'function') {
      showToast(gagMsg.title + ' ' + gagMsg.msg, gagMsg.type);
    }
    
    // 恶搞事件效果
    if (specialEvent === 'drunk_throw') {
      adjustedHitZone = hitZone * 0.6; // 更难中
    } else if (specialEvent === 'bird_interference') {
      adjustedHitZone = hitZone * 0.4; // 更难中
    } else if (specialEvent === 'slippery_floor') {
      adjustedHitZone = hitZone * 0.5; // 更难中
    } else if (specialEvent === 'wind_gust') {
      adjustedHitZone = hitZone * 0.3; // 最难中
    } else if (specialEvent === 'distracted_by_beauty') {
      adjustedHitZone = hitZone * 0.7; // 略难中
    } else if (specialEvent === 'arrow_bend') {
      adjustedHitZone = hitZone * 1.5; // 反而更容易中
    }
  }

  // 命中判定：初始数学判定（会被动画碰撞检测结果覆盖）
  const horizError = Math.abs(finalDist - target);
  const success = horizError < adjustedHitZone;

  let points = 0, msg = '';
  if (success) {
    points = ppState.pot.points;
    // 连中三元奖励
    if(specialEvent === 'triple_crown'){
      points = Math.round(points * 1.5);
      msg = '🏆 连中三元！当赏酒一坛！';
    }
    else if(specialEvent === 'god_shot'){
      msg = '✨ 神射！百步穿杨！';
    }
    // ═══════════════════════════════════════════════
    // 投壶"将将胡"恶搞事件消息
    // ═══════════════════════════════════════════════
    else if(specialEvent === 'drunk_throw'){
      msg = '🍺 醉醺醺地投中了！运气真好！';
    }
    else if(specialEvent === 'bird_interference'){
      msg = '🐦 鸟撞偏了箭，居然中了！';
    }
    else if(specialEvent === 'slippery_floor'){
      msg = '😰 滑倒了但箭飞进了壶！';
    }
    else if(specialEvent === 'wind_gust'){
      msg = '🌪️ 妖风把箭吹进了壶！';
    }
    else if(specialEvent === 'distracted_by_beauty'){
      msg = '😍 虽然分心，但箭还是中了！';
    }
    else if(specialEvent === 'arrow_bend'){
      msg = '🏹 弯箭居然更容易中！';
    }
    else {
      msg = PP_WIN_LINES[rand(0, PP_WIN_LINES.length - 1)];
    }
    ppState.score += points;
  } else {
    msg = PP_MISS_LINES[rand(0, PP_MISS_LINES.length - 1)];
    // 手滑提示
    if(specialEvent === 'slip'){
      msg = '😅 手滑了！这箭力道不对！';
    }
    // 恶搞事件未中提示
    else if(specialEvent === 'drunk_throw'){
      msg = '🍺 喝太多，完全投偏了！';
    }
    else if(specialEvent === 'bird_interference'){
      msg = '🐦 鸟把箭撞飞了！';
    }
    else if(specialEvent === 'slippery_floor'){
      msg = '😰 滑倒脱手，箭飞偏了！';
    }
    else if(specialEvent === 'wind_gust'){
      msg = '🌪️ 妖风太猛，箭被吹走了！';
    }
    else if(specialEvent === 'distracted_by_beauty'){
      msg = '😍 看美女看得入迷，完全没中！';
    }
    else if(specialEvent === 'arrow_bend'){
      msg = '🏹 弯箭拐了个弯，没中！';
    }
  }

  return {
    success, points, msg,
    potName: ppState.pot.name,
    potPoints: ppState.pot.points,
    flightDist: finalDist,
    target,
    specialEvent,
  };
}

/**
 * 计算飞行动画参数（用于渲染抛物线弧+下落段）
 * 
 * 真抛物线模型：
 * - X方向匀速（+风力t²加速偏移）
 * - Y方向：上升段(Y减小) → 顶点 → 下落段(Y增大，重力加速)
 * - 顶点X位置 = startX + maxReach × distMult × peakFrac
 */
function ppCalcFlightParams(wrapW, wrapH) {
  const power = ppState.power / 100;
  const angleRad = ppState.angle * Math.PI / 180;
  const playerPos = ppGetPlayerPos(wrapW, wrapH);
  const pot = ppGetPotPos(wrapW, wrapH);
  const groundY = ppGetGroundY(wrapH);

  const startX = playerPos.x;
  const startY = playerPos.y;
  const maxReach = (ppLayout.maxFlightPx || wrapW * 0.55);

  // 水平飞行距离
  const distMult = Math.sin(2 * angleRad) * Math.pow(power, 1.3);
  
  // 箭的落点X（含风力偏移的视觉效果）
  const windDir = ppState.wind.icon.includes('←') ? -1 : 1;
  const windVisualPx = ppState.wind.visualForce * windDir * maxReach;
  
  const landX = startX + maxReach * distMult + windVisualPx;

  // 弧高（向上为负）：角度越高弧越高，舞台高时弧线更饱满
  const arcMult = 0.35 + (ppState.angle - 15) / 60 * 1.0;
  const arcHeight = -(wrapH * 0.55) * arcMult;

  // 顶点在水平距离中的位置（0~1）：角度越高顶点越靠前
  const peakFrac = 0.35 + (ppState.angle - 15) / 60 * 0.25;  // 0.35~0.60

  return {
    startX, startY,
    landX,         // 箭落地的X位置
    groundY,       // 地面Y
    arcHeight,     // 弧的最高点相对起点的Y偏移（负值=向上）
    peakFrac,      // 顶点在水平距离中的比例
    distMult,      // 归一化水平距离
    windVisualPx,  // 风力水平偏移像素
    potX: pot.x,   // 壶口X
    potY: pot.y,   // 壶口Y
  };
}

/**
 * 给定t(0~1)，计算抛物线上某点的坐标
 * t: 0=起点, peakFrac=顶点, 1=落地
 * 
 * X: 匀速 + 风力t²加速
 * Y: 先上后下的抛物线
 *   - 上升段(t < peakFrac): Y = startY + arcHeight × sin(π × t/peakFrac/2)²
 *   - 下落段(t >= peakFrac): Y从顶点加速下落到groundY
 */
function ppFlightPos(t, fp) {
  // 水平位移（匀速 + 风力t²加速）
  const baseX = fp.startX + (fp.landX - fp.startX) * t;
  const windBend = fp.windVisualPx * 0.3 * t * t;  // 风力在飞行中逐渐累积
  const x = baseX + windBend;

  // 垂直位移（抛物线：先上后下）
  const peakT = fp.peakFrac;
  let y;
  if (t <= peakT) {
    // 上升段：从startY上升到顶点(startY + arcHeight)
    // 用正弦平方使上升更自然
    const riseT = t / peakT;
    y = fp.startY + fp.arcHeight * Math.sin(riseT * Math.PI / 2) ** 1.2;
  } else {
    // 下落段：从顶点落到地面，加速下落（重力）
    const fallT = (t - peakT) / (1 - peakT);
    // 顶点Y
    const peakY = fp.startY + fp.arcHeight;
    // 用二次函数模拟重力加速：先慢后快
    y = peakY + (fp.groundY - peakY) * fallT * fallT;
  }

  return { x, y };
}

/* ═══════════════════════════════════════════════════════
   飞行动画（v3.1：下落掉进壶口）
   ═══════════════════════════════════════════════════════ */

function ppPlayFlightAnim(result, callback) {
  const sceneWrap = document.querySelector('.pp-scene-wrap');
  if (!sceneWrap) { callback(false); return; }

  ppUpdateLayout();

  const wrapRect = sceneWrap.getBoundingClientRect();
  const wrapW = wrapRect.width;
  const wrapH = wrapRect.height;

  const aimCanvas = document.getElementById('ppAimCanvas');
  if (aimCanvas) aimCanvas.style.display = 'none';

  const fp = ppCalcFlightParams(wrapW, wrapH);
  const pot = ppGetPotPos(wrapW, wrapH);

  // 总帧数：舞台更高弧线更长，增加帧数确保下落段清晰可见
  const totalFrames = 28;

  // 创建箭矢元素
  const arrowEl = document.createElement('div');
  arrowEl.className = 'pp-flying-arrow';
  arrowEl.textContent = '──▶';  // 初始：上升箭头朝前
  sceneWrap.appendChild(arrowEl);

  // 创建拖尾容器
  const trailEls = [];
  const MAX_TRAIL = 5;

  let frame = 0;
  let hitDetected = false;

  // 碰撞半径：壶口发光圈32px，取半径+容错
  const HIT_RADIUS = 22;

  function animateStep() {
    frame++;
    const t = frame / totalFrames;

    const pos = ppFlightPos(t, fp);

    // 箭矢符号：全程使用 ──▶，通过旋转表达飞行方向
    // （切换▼会导致箭尾消失，不换字符）
    arrowEl.textContent = '──▶';
    arrowEl.style.fontSize = '13px';

    arrowEl.style.left = pos.x + 'px';
    arrowEl.style.top = pos.y + 'px';

    // 旋转：跟随切线方向
    const tPrev = Math.max(0, t - 0.05);
    const prevPos = ppFlightPos(tPrev, fp);
    const dx = pos.x - prevPos.x;
    const dy = pos.y - prevPos.y;
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      // 下落段补偿：──▶ 朝右是0°，下落需要额外+90°对齐切线
      // 但因为──▶本身就是水平箭头，atan2已经给出正确方向，无需额外补偿
      // 限制旋转角度避免箭尾甩出场景（overflow:hidden）
      angle = Math.max(-70, Math.min(85, angle));
      arrowEl.style.transform = `rotate(${angle}deg)`;
    }

    // 拖尾效果
    if (frame > 1 && frame % 2 === 0) {
      const trail = document.createElement('div');
      trail.className = 'pp-trail-dot';
      trail.style.left = pos.x + 'px';
      trail.style.top = pos.y + 'px';
      sceneWrap.appendChild(trail);
      trailEls.push(trail);
      requestAnimationFrame(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0.3)';
      });
      setTimeout(() => { trail.remove(); trailEls.splice(trailEls.indexOf(trail), 1); }, 300);
    }

    // 实时碰撞检测：箭与壶口圆圈的距离
    if (!hitDetected && t > fp.peakFrac) {
      const distToPot = Math.sqrt((pos.x - pot.x) ** 2 + (pos.y - pot.y) ** 2);
      if (distToPot < HIT_RADIUS) {
        hitDetected = true;
        // 命中！移除箭和拖尾，播放特效
        trailEls.forEach(el => el.remove());
        arrowEl.remove();
        ppPlayHitEffect(sceneWrap, pot, () => callback(true));
        return; // 停止动画循环
      }
    }

    // 帧速度：上升段快，下落段慢
    const isInFall = t > fp.peakFrac;
    const frameDelay = isInFall ? 40 + 20 * ((t - fp.peakFrac) / (1 - fp.peakFrac)) : 32;

    if (frame < totalFrames) {
      ppAnimTimer = setTimeout(animateStep, frameDelay);
    } else {
      // 飞行结束，未命中
      trailEls.forEach(el => el.remove());
      arrowEl.remove();
      ppPlayMissAnim(pos, fp, sceneWrap, () => callback(false));
    }
  }

  ppAnimTimer = setTimeout(animateStep, 30);
}

// 命中特效（华丽版）：箭消失 → 金色光环扩散 + 火花爆发 + 文字飘起
function ppPlayHitEffect(container, pot, callback) {
  const x = pot.x, y = pot.y;

  // ① 壶口闪光
  const glow = document.getElementById('ppPotGlow');
  if (glow) glow.classList.add('pp-glow-flash');
  setTimeout(() => { if (glow) glow.classList.remove('pp-glow-flash'); }, 1000);

  // ② 金色光环扩散（3圈，依次延迟）
  for (let ring = 0; ring < 3; ring++) {
    const halo = document.createElement('div');
    halo.className = 'pp-hit-halo';
    halo.style.left = x + 'px';
    halo.style.top = y + 'px';
    container.appendChild(halo);
    setTimeout(() => {
      halo.classList.add('pp-halo-expand');
    }, ring * 120);
    setTimeout(() => halo.remove(), 900 + ring * 120);
  }

  // ③ 火花爆发（三层：金色 → 白色 → 星尘）
  const layers = [
    { symbols: ['✦','✧','⋆'], colors: ['#ffd060','#ffcc44','#ffe880'], count: 8, range: 60, size: '10-16px' },
    { symbols: ['·','∗','✶'], colors: ['#ffffff','#fff5cc','#ffe880'], count: 6, range: 45, size: '6-10px' },
    { symbols: ['✴','✹','✷'], colors: ['#ffd060','#ffb830','#fff'], count: 5, range: 90, size: '8-14px' },
  ];
  layers.forEach((layer, li) => {
    const [sMin, sMax] = layer.size.split('-').map(s => parseInt(s));
    for (let i = 0; i < layer.count; i++) {
      const spark = document.createElement('div');
      spark.className = 'pp-spark pp-spark-burst';
      spark.textContent = layer.symbols[i % layer.symbols.length];
      spark.style.color = layer.colors[i % layer.colors.length];
      spark.style.fontSize = (sMin + Math.random() * (sMax - sMin)) + 'px';
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';
      container.appendChild(spark);

      const angle = (Math.PI * 2 / layer.count) * i + li * 0.5 + Math.random() * 0.3;
      const dist = layer.range * (0.6 + Math.random() * 0.4);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 10;

      setTimeout(() => {
        spark.style.left = (x + dx) + 'px';
        spark.style.top = (y + dy) + 'px';
        spark.style.opacity = '0';
        spark.style.transform = `scale(${0.2 + Math.random() * 0.5}) rotate(${Math.random() * 360}deg)`;
      }, 30 + li * 80);
      setTimeout(() => spark.remove(), 800 + li * 80);
    }
  });

  // ④ 命中文字飘起
  const hitText = document.createElement('div');
  hitText.className = 'pp-hit-text';
  hitText.textContent = '命中！';
  hitText.style.left = x + 'px';
  hitText.style.top = y + 'px';
  container.appendChild(hitText);
  setTimeout(() => {
    hitText.style.top = (y - 45) + 'px';
    hitText.style.opacity = '0';
  }, 50);
  setTimeout(() => hitText.remove(), 900);

  // 总时长
  setTimeout(callback, 700);
}

// 未中动画：落地点灰尘+箭影消散
function ppPlayMissAnim(landPos, fp, container, callback) {
  const groundY = fp.groundY;
  const finalX = landPos.x + (Math.random() - 0.5) * 20;

  // 创建一个落地箭影
  const shadow = document.createElement('div');
  shadow.className = 'pp-miss-arrow';
  shadow.textContent = '▼';
  shadow.style.left = finalX + 'px';
  shadow.style.top = groundY + 'px';
  shadow.style.transform = 'rotate(25deg)';
  container.appendChild(shadow);

  // 弹跳
  setTimeout(() => {
    shadow.style.top = (groundY - 10) + 'px';
    shadow.style.opacity = '0.6';
  }, 50);

  setTimeout(() => {
    shadow.style.top = groundY + 'px';
    shadow.style.opacity = '0';
    shadow.style.transform = 'rotate(45deg) scale(0.5)';
    // 落地灰尘
    ppMissDust(container, finalX, groundY);
    setTimeout(() => {
      shadow.remove();
      callback();
    }, 500);
  }, 250);
}

// 落地灰尘效果
function ppMissDust(container, x, y) {
  for (let i = 0; i < 5; i++) {
    const dust = document.createElement('div');
    dust.className = 'pp-spark';
    dust.textContent = '·';
    dust.style.color = '#8b7355';
    dust.style.fontSize = (4 + Math.random() * 6) + 'px';
    dust.style.left = x + 'px';
    dust.style.top = y + 'px';
    container.appendChild(dust);

    const dx = (Math.random() - 0.5) * 40;
    const dy = -(5 + Math.random() * 15);
    requestAnimationFrame(() => {
      dust.style.left = (x + dx) + 'px';
      dust.style.top = (y + dy) + 'px';
      dust.style.opacity = '0';
    });
    setTimeout(() => dust.remove(), 500);
  }
}

// 命中火花特效（增强版）
function ppHitSparks(container, x, y) {
  const sparks = ['✧','✦','·','⋆','✶','∗','✴','✹'];
  const sparkCount = 10;
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'pp-spark';
    spark.textContent = sparks[i % sparks.length];
    spark.style.color = i < 4 ? '#ffd060' : (i < 7 ? '#ffe880' : '#ffffff');
    spark.style.fontSize = (6 + Math.random() * 12) + 'px';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    container.appendChild(spark);

    const dx = (Math.random() - 0.5) * 80;
    const dy = (Math.random() - 0.7) * 60;
    requestAnimationFrame(() => {
      spark.style.left = (x + dx) + 'px';
      spark.style.top = (y + dy) + 'px';
      spark.style.opacity = '0';
      spark.style.transform = `scale(${0.3 + Math.random()})`;
    });
    setTimeout(() => spark.remove(), 700);
  }
}

/* ═══════════════════════════════════════════════════════
   瞄准辅助线（v3.1：完整抛物线预览，含下落段）
   ═══════════════════════════════════════════════════════ */

function ppUpdateAimLine() {
  const canvas = document.getElementById('ppAimCanvas');
  const sceneWrap = canvas ? canvas.closest('.pp-scene-wrap') : null;
  if (!canvas || !sceneWrap) return;

  const wrapRect = sceneWrap.getBoundingClientRect();
  if (wrapRect.width < 10) return;

  ppUpdateLayout();

  const dpr = window.devicePixelRatio || 1;
  canvas.width = wrapRect.width * dpr;
  canvas.height = wrapRect.height * dpr;
  canvas.style.width = wrapRect.width + 'px';
  canvas.style.height = wrapRect.height + 'px';
  canvas.style.display = 'block';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, wrapRect.width, wrapRect.height);

  const fp = ppCalcFlightParams(wrapRect.width, wrapRect.height);
  const pot = ppGetPotPos(wrapRect.width, wrapRect.height);

  // 绘制瞄准线（只保留起始一小段，不暴露完整轨迹）
  const steps = 50;
  const visibleSteps = Math.max(6, Math.floor(steps * 0.25)); // 前25%可见
  
  ctx.strokeStyle = 'rgba(255,220,100,0.65)';
  ctx.setLineDash([5, 3]);
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i <= visibleSteps; i++) {
    const t = i / steps;
    const pos = ppFlightPos(t, fp);
    if (i === 0) ctx.moveTo(pos.x, pos.y);
    else ctx.lineTo(pos.x, pos.y);
  }
  ctx.stroke();

  // 渐隐尾巴（从visibleSteps到40%之间，透明度递减）
  const fadeEnd = Math.floor(steps * 0.40);
  for (let i = visibleSteps; i <= fadeEnd; i++) {
    const t = i / steps;
    const pos = ppFlightPos(t, fp);
    const prevT = (i - 1) / steps;
    const prevPos = ppFlightPos(prevT, fp);
    const fadeFrac = 1 - (i - visibleSteps) / (fadeEnd - visibleSteps);
    ctx.strokeStyle = `rgba(255,208,96,${(fadeFrac * 0.2).toFixed(3)})`;
    ctx.setLineDash([2, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  // 壶口目标圈
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(255,208,96,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(pot.x, pot.y, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,208,96,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(pot.x, pot.y, 8, 0, Math.PI * 2);
  ctx.stroke();

  // 风向指示箭头
  if (ppState.wind.force > 0) {
    ctx.setLineDash([]);
    const windDir = ppState.wind.icon.includes('←') ? -1 : 1;
    const windX = wrapRect.width / 2;
    const windY = 14;
    ctx.fillStyle = ppState.wind.color || 'rgba(135,206,235,0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    const arrows = windDir > 0 ? '→ → →' : '← ← ←';
    ctx.globalAlpha = 0.3 + ppState.wind.force * 0.3;
    ctx.fillText(arrows, windX, windY);
    ctx.globalAlpha = 1;
  }
}

/* ═══════════════════════════════════════════════════════
   氛围动画
   ═══════════════════════════════════════════════════════ */

function ppStartAmbience() {
  if (ppAmbientTimer) clearInterval(ppAmbientTimer);

  // 烛光闪烁（优化：降低频率，使用 CSS 动画类代替直接样式操作）
  ppAmbientTimer = setInterval(() => {
    const cl = document.getElementById('ppCandleL');
    const cr = document.getElementById('ppCandleR');
    [cl, cr].forEach(c => {
      if (!c) return;
      // 使用 CSS 变量而不是直接修改 style，减少重排
      const s = 0.85 + Math.random() * 0.3;
      const a = 0.5 + Math.random() * 0.5;
      c.style.setProperty('--candle-scale', s);
      c.style.setProperty('--candle-opacity', a);
      c.style.transform = `scale(var(--candle-scale, 1))`;
      c.style.opacity = `var(--candle-opacity, 1)`;
    });
  }, 600); // 降低频率 200-500ms -> 600ms

  // 尘粒
  ppSpawnDust();
}

function ppSpawnDust() {
  const container = document.getElementById('ppDustContainer');
  if (!container) return;
  // 3~5个尘粒
  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const dust = document.createElement('div');
    dust.className = 'pp-dust';
    dust.style.left = (10 + Math.random() * 80) + '%';
    dust.style.bottom = (Math.random() * 20) + '%';
    dust.style.animationDuration = (4 + Math.random() * 6) + 's';
    dust.style.animationDelay = (Math.random() * 3) + 's';
    dust.style.opacity = 0;
    container.appendChild(dust);
    // 淡入
    setTimeout(() => { dust.style.opacity = (0.15 + Math.random() * 0.2).toFixed(2); }, 100);
    // 移除
    setTimeout(() => { dust.remove(); }, 12000);
  }
}

/* ═══════════════════════════════════════════════════════
   UI辅助
   ═══════════════════════════════════════════════════════ */

function ppShowFloatMsg(result) {
  const el = document.getElementById('ppFloatMsg');
  if (!el) return;
  el.className = 'pp-float-msg show ' + (result.success ? 'hit' : 'miss');
  if (result.success) {
    el.innerHTML = `<div class="pp-fx-title">🎯 命中${result.potName}！</div>
                    <div class="pp-fx-sub">+${result.points}分</div>
                    <div class="pp-fx-quote">"${result.msg}"</div>`;
  } else {
    el.innerHTML = `<div class="pp-fx-title">😔 未命中</div>
                    <div class="pp-fx-quote">"${result.msg}"</div>`;
  }
  setTimeout(() => { el.className = 'pp-float-msg'; }, 3000);
}

function ppUpdateArrowIndicators() {
  document.querySelectorAll('.pp-arrow-indicator').forEach((el, i) => {
    if (i >= ppState.arrows) el.classList.add('used');
  });
}

function ppRefreshScoreDisplay() {
  const cells = document.querySelectorAll('.pp-info-val');
  if (cells[0]) cells[0].textContent = ppState.score;
  if (cells[1]) cells[1].textContent = `${ppState.arrows}/${ppState.totalArrows}`;
}

function ppRenderHistory() {
  return ppState.history.slice(0, 8).map(h => `
    <div class="pp-history-item ${h.success ? 'hit' : 'miss'}">
      <span class="pp-hist-icon">${h.success ? '✅' : '❌'}</span>
      <span class="pp-hist-target">${h.potName}</span>
      <span class="pp-hist-pts">${h.success ? '+' + h.points + '分' : '未中'}</span>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════════════════
   游戏结束
   ═══════════════════════════════════════════════════════ */

function ppGameOver() {
  // 播放结算音效
  if (typeof SoundFX !== 'undefined') {
    if (ppState.score >= 150) SoundFX.play('perfect_hit');
    else if (ppState.score >= 80) SoundFX.play('success');
    else SoundFX.play('fail');
  }

  // ── 成就系统触发 ──
  if(typeof achOnPitchpotHit === 'function') achOnPitchpotHit();

  const score = ppState.score;
  let silver = Math.floor(score * 0.8);
  let exp = Math.floor(score * 0.5);
  let title = '', extra = '';

  if (score >= 200) {
    title = '🏆 神乎其技！百步穿杨！'; silver += 50; exp += 30;
    extra = '酒馆老板赠送上等美酒一坛！';
  } else if (score >= 150) {
    title = '⭐ 技艺精湛！'; silver += 30; exp += 20;
    extra = '众人齐声称妙，赏金加倍！';
  } else if (score >= 100) {
    title = '👍 表现不错！'; silver += 20; exp += 10;
    extra = '酒馆宾客鼓掌喝彩！';
  } else if (score >= 50) {
    title = '✨ 有模有样！'; extra = '多加练习，前途无量。';
  } else {
    title = '📚 来日方长！'; extra = '投壶之道，贵在心境。';
  }

  if (score > ppState.highScore) ppState.highScore = score;

  // 扣除门票，计算净收益
  const netSilver = silver - PP_ENTRY_FEE;
  if (netSilver > 0) {
    _ppAddSilver(netSilver);
  }
  if (typeof edS !== 'undefined') {
    edS.exp = (edS.exp || 0) + exp;
  }

  const overlay = document.getElementById('ppPopup');
  if (!overlay) return;
  overlay.innerHTML = `
    <div class="pp-overlay" onclick="if(event.target===this)ppClose()">
      <div class="pp-box pp-gameover-box">
        <div class="pp-go-title">${title}</div>
        <div class="pp-go-summary">
          <div class="pp-go-row">
            <span class="pp-go-lbl">最终得分</span>
            <span class="pp-go-val" style="color:#ffd060">${score}</span>
          </div>
          <div class="pp-go-row">
            <span class="pp-go-lbl">获得赏金</span>
            <span class="pp-go-val" style="color:#e8d090">${silver} 两</span>
          </div>
          <div class="pp-go-row">
            <span class="pp-go-lbl">入场费</span>
            <span class="pp-go-val" style="color:#e08080">-${PP_ENTRY_FEE} 两</span>
          </div>
          <div class="pp-go-row">
            <span class="pp-go-lbl">净收益</span>
            <span class="pp-go-val" style="color:${netSilver >= 0 ? '#6aca7a' : '#e08080'}">${netSilver >= 0 ? '+' : ''}${netSilver} 两</span>
          </div>
          <div class="pp-go-row">
            <span class="pp-go-lbl">获得经验</span>
            <span class="pp-go-val" style="color:#87ceeb">${exp}</span>
          </div>
          <div class="pp-go-row">
            <span class="pp-go-lbl">历史最高</span>
            <span class="pp-go-val" style="color:#c080f0">${ppState.highScore}</span>
          </div>
        </div>
        <div class="pp-go-extra">${extra}</div>
        <div class="pp-go-stats">
          ${ppState.history.map(h => `<span class="pp-go-stat ${h.success ? 'hit' : 'miss'}">${h.success ? '✓' : '✗'}</span>`).join('')}
        </div>
        <div class="pp-go-btns">
          <button class="pp-btn pp-btn-throw" onclick="ppReset()">🔄 再来一局</button>
          <button class="pp-btn" onclick="ppClose()">🚪 离开酒馆</button>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════
   保存 / 加载
   ═══════════════════════════════════════════════════════ */

function ppSave() {
  try { localStorage.setItem(PITCHPOT_KEY, JSON.stringify({ highScore: ppState.highScore || 0 })); } catch (e) {}
}
function ppLoad() {
  try { const raw = localStorage.getItem(PITCHPOT_KEY); if (raw) ppState.highScore = JSON.parse(raw).highScore || 0; } catch (e) {}
}

/* ═══════════════════════════════════════════════════════
   样式注入
   ═══════════════════════════════════════════════════════ */

function ppInjectStyles() {
  if (document.getElementById('pp-styles-v3')) return;
  const s = document.createElement('style');
  s.id = 'pp-styles-v3';
  s.textContent = `
    /* ── 遮罩 ── */
    .pp-overlay {
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:rgba(0,0,0,.88);z-index:9999;
      display:flex;align-items:center;justify-content:center;
      animation:ppFadeIn .3s ease;
    }
    @keyframes ppToastFade {
      0% { opacity:0; transform:translateX(-50%) translateY(-8px); }
      15% { opacity:1; transform:translateX(-50%) translateY(0); }
      80% { opacity:1; }
      100% { opacity:0; transform:translateX(-50%) translateY(-8px); }
    }
    /* ── 主容器 ── */
    .pp-box {
      width:92%;max-width:700px;max-height:92vh;overflow-y:auto;
      background:linear-gradient(160deg,#0e0704 0%,#1a0e06 40%,#241410 100%);
      border:2px solid #6b3a1f;border-radius:14px;
      padding:16px 14px;
      box-shadow:0 0 60px rgba(139,69,19,.35),inset 0 1px 0 rgba(218,165,32,.08);
      font-family:'SimSun','STSong','Noto Sans SC',monospace;
    }
    .pp-gameover-box { text-align:center; }
    /* ── 横幅 ── */
    .pp-banner {
      text-align:center;margin-bottom:10px;
      filter:drop-shadow(0 0 6px rgba(218,165,32,.3));
    }
    .pp-banner div {
      color:#daa520;font-size:11px;line-height:1.5;
      letter-spacing:2px;font-weight:bold;
      text-shadow:0 0 8px rgba(218,165,32,.4);
    }
    /* ── 信息栏 ── */
    .pp-info-bar {
      display:grid;grid-template-columns:repeat(4,1fr);gap:5px;
      margin-bottom:8px;
    }
    .pp-info-cell {
      text-align:center;padding:6px 3px;
      background:rgba(0,0,0,.35);border:1px solid rgba(139,69,19,.2);
      border-radius:6px;
    }
    .pp-info-icon { font-size:13px; }
    .pp-info-lbl {
      display:block;font-size:7px;color:rgba(200,180,120,.4);
      letter-spacing:1px;margin:1px 0 0;
    }
    .pp-info-val {
      display:block;font-size:12px;font-weight:bold;color:#e8d090;
    }
    /* ── 箭矢指示 ── */
    .pp-arrows-row {
      display:flex;justify-content:center;gap:8px;margin-bottom:8px;
    }
    .pp-arrow-indicator {
      font-size:15px;transition:all .3s ease;
      filter:drop-shadow(0 0 3px rgba(200,180,120,.3));
    }
    .pp-arrow-indicator.used {
      font-size:9px;color:rgba(200,180,120,.2);filter:none;
    }

    /* ════════════════════════════════════════════
       场景：flex 三栏布局（主角 | 距离区 | 壶口）
       ════════════════════════════════════════════ */
    .pp-scene-wrap {
      position:relative;margin:0 -4px 10px;
      border:1px solid rgba(139,69,19,.25);border-radius:10px;
      background:linear-gradient(180deg,#060408 0%,#0a0812 20%,#140c06 60%,#1a1008 100%);
      overflow:hidden;min-height:260px;
    }
    /* 场景级地面线：横贯底部 */
    .pp-scene-wrap > .pp-ground-line {
      position:absolute;bottom:18px;left:20px;right:20px;
      height:2px;z-index:2;
      background:linear-gradient(90deg,transparent,rgba(100,60,20,.35) 15%,rgba(100,60,20,.5) 50%,rgba(100,60,20,.35) 85%,transparent);
      border-radius:1px;
    }
    /* 氛围层 */
    .pp-ambience {
      position:absolute;top:0;left:0;right:0;bottom:0;
      pointer-events:none;z-index:0;
    }
    .pp-lantern {
      position:absolute;top:4px;font-size:16px;
      animation:ppLanternSway 4s ease-in-out infinite alternate;
      filter:drop-shadow(0 0 8px rgba(255,100,30,.4));
    }
    .pp-lantern-l { left:8px; animation-delay:-0.5s; }
    .pp-lantern-r { right:8px; animation-delay:-2s; }
    @keyframes ppLanternSway {
      0%   { transform:rotate(-3deg) translateX(-2px); }
      50%  { transform:rotate(2deg) translateX(1px); }
      100% { transform:rotate(-2deg) translateX(-1px); }
    }
    .pp-candle {
      position:absolute;bottom:12px;font-size:10px;
      transition:transform .2s,opacity .2s;
    }
    .pp-candle-l { left:16px; }
    .pp-candle-r { right:16px; }
    .pp-dust-container {
      position:absolute;top:0;left:0;right:0;bottom:0;
      overflow:hidden;
    }
    .pp-dust {
      position:absolute;width:2px;height:2px;
      background:rgba(200,180,120,.3);border-radius:50%;
      animation:ppDustFloat linear forwards;
    }
    @keyframes ppDustFloat {
      0%   { transform:translate(0, 0) scale(1); opacity:0; }
      10%  { opacity:1; }
      100% { transform:translate(${20 + Math.random()*30}px, -60px) scale(0.3); opacity:0; }
    }

    /* 主场景：三栏flex */
    .pp-scene-main {
      position:relative;z-index:1;
      display:flex;align-items:flex-end;
      padding:8px 8px 22px;  /* 底部留空给地面线 */
      height:100%;
      min-height:240px;
      box-sizing:border-box;
    }

    /* ── 主角区域（撑满高度，字符画靠底站立） ── */
    .pp-player-zone {
      flex-shrink:0;width:72px;
      display:flex;align-items:flex-end;justify-content:center;
      position:relative;padding-bottom:2px;
    }
    /* ft-animated 投壶专用样式 */
    .pp-ft-animated {
      white-space:normal;font-size:18px;line-height:1;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      filter:drop-shadow(0 0 8px var(--pp-char-color, #f0c060));
    }
    .pp-ft-animated .ft-aura {
      display:block;white-space:pre;line-height:1.3;
      margin:0;padding:0;text-align:center;
      text-shadow:0 0 6px currentColor;
      animation:ppAura 2.4s ease-in-out infinite;
      font-size:9px;letter-spacing:1px;
    }
    .pp-ft-animated .ft-head {
      display:block;white-space:pre;line-height:1.5;
      margin:0;padding:0;text-align:center;
      text-shadow:0 0 6px currentColor;
      animation:ppHead 3.2s ease-in-out infinite;animation-delay:-.5s;
    }
    .pp-ft-animated .ft-body {
      display:block;white-space:pre;line-height:1.5;
      text-shadow:0 0 8px currentColor, 0 0 2px currentColor;
      letter-spacing:.05em;font-weight:bold;
      animation:ppBody 2.8s ease-in-out infinite;animation-delay:-.2s;
    }
    .pp-ft-animated .ft-arm-l {
      display:inline-block;white-space:pre;
      transform-origin:top right;
      animation:ppArmL 2.2s ease-in-out infinite;animation-delay:-.3s;
      transition:transform .3s ease;
    }
    .pp-ft-animated .ft-arm-r {
      display:inline-block;white-space:pre;
      transform-origin:top left;
      animation:ppArmR 2.2s ease-in-out infinite;animation-delay:-.9s;
      transition:transform .3s ease;
    }
    .pp-ft-animated .ft-legs {
      display:block;white-space:pre;line-height:1.5;
      animation:ppLegs 2.6s ease-in-out infinite;animation-delay:-.8s;
      transition:transform .3s ease;
    }
    /* 躯干横排 */
    .pp-torso-row {
      display:flex;flex-direction:row;align-items:center;justify-content:center;
      margin:0;padding:0;line-height:1.5;gap:1px;
    }
    .ft-body-wrap { position:relative;display:inline-block; }

    /* 投掷姿态：身体前倾+手臂后拉 */
    .pp-ft-animated.pp-throwing .ft-body {
      animation:ppThrowBody .5s ease forwards !important;
    }
    .pp-ft-animated.pp-throwing .ft-arm-r {
      animation:ppThrowArmR .5s ease forwards !important;
    }
    .pp-ft-animated.pp-throwing .ft-head {
      animation:ppThrowHead .5s ease forwards !important;
    }
    .pp-ft-animated.pp-throwing .ft-legs {
      animation:ppThrowLegs .5s ease forwards !important;
    }
    @keyframes ppThrowBody {
      0%  { transform:scaleY(1) scaleX(1) translateX(0); }
      40% { transform:scaleY(.95) scaleX(1.05) translateX(3px); }
      100%{ transform:scaleY(1) scaleX(1) translateX(0); }
    }
    @keyframes ppThrowArmR {
      0%  { transform:rotate(-12deg) translateX(1px); }
      30% { transform:rotate(-45deg) translateX(8px) scaleX(1.2); }
      100%{ transform:rotate(-12deg) translateX(1px); }
    }
    @keyframes ppThrowHead {
      0%  { transform:translateY(0) rotate(-1deg); }
      30% { transform:translateY(-3px) rotate(5deg) translateX(3px); }
      100%{ transform:translateY(0) rotate(-1deg); }
    }
    @keyframes ppThrowLegs {
      0%  { transform:translateY(0) scaleX(1); }
      30% { transform:translateY(-4px) scaleX(.95); }
      100%{ transform:translateY(0) scaleX(1); }
    }

    /* 待机动画 */
    @keyframes ppAura {
      0%  { transform:translateX(-3px) scale(.95);opacity:.5; }
      50% { transform:translateX(3px) scale(1.05);opacity:1; }
      100%{ transform:translateX(-3px) scale(.95);opacity:.5; }
    }
    @keyframes ppHead {
      0%  { transform:translateY(0) rotate(-1deg); }
      30% { transform:translateY(-3px) rotate(0deg); }
      60% { transform:translateY(-1px) rotate(1deg); }
      100%{ transform:translateY(0) rotate(-1deg); }
    }
    @keyframes ppBody {
      0%,100%{ transform:scaleY(1) scaleX(1); }
      50%    { transform:scaleY(1.03) scaleX(.98); }
    }
    @keyframes ppArmL {
      0%  { transform:rotate(10deg) translateX(-1px); }
      50% { transform:rotate(-6deg) translateX(-2px); }
      100%{ transform:rotate(10deg) translateX(-1px); }
    }
    @keyframes ppArmR {
      0%  { transform:rotate(-10deg) translateX(1px); }
      50% { transform:rotate(6deg) translateX(2px); }
      100%{ transform:rotate(-10deg) translateX(1px); }
    }
    @keyframes ppLegs {
      0%,100%{ transform:translateY(0) scaleX(1); }
      40%    { transform:translateY(2px) scaleX(1.03); }
      70%    { transform:translateY(1px) scaleX(.98); }
    }

    /* ── 距离区域 ── */
    .pp-field-zone {
      display:flex;flex-direction:column;justify-content:flex-end;
      align-items:center;min-width:40px;position:relative;
      padding-bottom:0;
    }
    .pp-distance-ruler {
      width:100%;height:2px;
      background:linear-gradient(90deg,transparent,rgba(200,180,120,.12) 10%,rgba(200,180,120,.18) 50%,rgba(200,180,120,.12) 90%,transparent);
      margin-bottom:6px;position:relative;
    }
    .pp-distance-ruler::before {
      content:'· · · 🏹 · · ·';position:absolute;top:-12px;
      width:100%;text-align:center;font-size:8px;
      color:rgba(200,180,120,.2);letter-spacing:3px;
    }

    /* ── 壶口区域 ── */
    .pp-pot-zone {
      flex-shrink:0;width:54px;
      display:flex;flex-direction:column;align-items:center;
      position:relative;
    }
    /* 壶口发光圈 */
    .pp-pot-glow {
      position:absolute;top:-10px;left:50%;transform:translateX(-50%);
      width:32px;height:32px;border-radius:50%;
      background:radial-gradient(circle,rgba(255,208,96,.08) 0%,rgba(255,180,60,.03) 50%,transparent 70%);
      animation:ppPotGlow 2.5s ease-in-out infinite;
      pointer-events:none;
    }
    .pp-pot-glow.pp-glow-flash {
      animation:ppPotFlash .6s ease-out forwards !important;
    }
    @keyframes ppPotGlow {
      0%,100%{ transform:translateX(-50%) scale(1); opacity:.6; }
      50%    { transform:translateX(-50%) scale(1.15); opacity:1; }
    }
    @keyframes ppPotFlash {
      0%  { transform:translateX(-50%) scale(1); background:radial-gradient(circle,rgba(255,240,150,.5) 0%,transparent 70%); }
      100%{ transform:translateX(-50%) scale(2.5); background:radial-gradient(circle,rgba(255,208,96,0) 0%,transparent 70%); }
    }
    /* 壶口字符画 */
    .pp-pot-art {
      color:#c8b080;font-size:9px;line-height:1.2;
      text-shadow:0 0 6px rgba(200,180,120,.3);
      position:relative;z-index:1;
      text-align:center;
    }
    .pp-pot-line {
      white-space:pre;font-family:'Courier New','SimHei',monospace;
      letter-spacing:0.5px;
    }
    .pp-pot-label {
      font-size:7px;color:rgba(200,180,120,.3);
      margin-top:1px;letter-spacing:1px;
      text-align:center;
    }
    .pp-pot-label small { color:#ffd060; }

    /* ── 浮动消息 ── */
    .pp-float-msg {
      position:absolute;top:20%;left:50%;transform:translateX(-50%);
      padding:10px 20px;border-radius:10px;
      text-align:center;opacity:0;
      transition:all .4s ease;pointer-events:none;z-index:20;
      font-size:13px;
    }
    .pp-float-msg.show { opacity:1; }
    .pp-float-msg.hit {
      background:rgba(40,80,30,.85);border:1px solid rgba(80,180,60,.4);
      box-shadow:0 0 20px rgba(80,180,60,.3);
    }
    .pp-float-msg.miss {
      background:rgba(80,30,20,.85);border:1px solid rgba(200,80,60,.3);
      box-shadow:0 0 15px rgba(200,80,60,.2);
    }
    .pp-fx-title { font-size:15px;font-weight:bold;letter-spacing:2px;margin-bottom:4px; }
    .pp-float-msg.hit .pp-fx-title { color:#80ff90; }
    .pp-float-msg.miss .pp-fx-title { color:#f08060; }
    .pp-fx-sub {
      font-size:18px;font-weight:900;color:#ffd060;
      text-shadow:0 0 10px rgba(255,208,96,.5);margin-bottom:4px;
    }
    .pp-fx-quote {
      font-size:10px;color:rgba(200,180,120,.6);
      font-style:italic;letter-spacing:1px;
    }

    /* ── 操控 ── */
    .pp-controls { margin-top:4px; }
    .pp-ctrl-row {
      display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;
    }
    .pp-ctrl-item {
      padding:8px;background:rgba(0,0,0,.25);
      border:1px solid rgba(139,69,19,.2);border-radius:8px;
    }
    .pp-ctrl-label {
      color:#daa520;font-size:11px;font-weight:bold;
      margin-bottom:6px;letter-spacing:1px;
    }
    .pp-ctrl-label span { color:#ffd060; }
    .pp-ctrl-hint {
      text-align:center;font-size:8px;color:rgba(200,180,120,.3);
      margin-top:3px;letter-spacing:1px;
    }
    .pp-slider {
      width:100%;height:6px;-webkit-appearance:none;appearance:none;
      border-radius:3px;outline:none;cursor:pointer;
    }
    .pp-slider::-webkit-slider-thumb {
      -webkit-appearance:none;width:18px;height:18px;
      border-radius:50%;border:2px solid #daa520;cursor:pointer;
    }
    .pp-slider-angle {
      background:linear-gradient(90deg,#1a3a2a,#2a6a3a,#4aaa5a);
    }
    .pp-slider-angle::-webkit-slider-thumb {
      background:#4aaa5a;box-shadow:0 0 6px rgba(74,170,90,.5);
    }
    .pp-slider-power {
      background:linear-gradient(90deg,#3a1a1a,#6a2a2a,#aa4a4a);
    }
    .pp-slider-power::-webkit-slider-thumb {
      background:#aa4a4a;box-shadow:0 0 6px rgba(170,74,74,.5);
    }
    .pp-ctrl-btns {
      display:flex;justify-content:center;gap:10px;flex-wrap:wrap;
    }
    .pp-btn {
      padding:9px 18px;font-size:12px;font-weight:bold;
      border:1px solid #6b3a1f;
      background:linear-gradient(135deg,#2a1810,#3a2418);
      color:#c8a860;border-radius:8px;cursor:pointer;
      transition:all .25s ease;letter-spacing:1px;
      box-shadow:0 2px 8px rgba(0,0,0,.3);
    }
    .pp-btn:hover {
      transform:translateY(-1px);border-color:#daa520;
      box-shadow:0 4px 12px rgba(218,165,32,.3);color:#ffd060;
    }
    .pp-btn:disabled { opacity:.4;cursor:not-allowed;transform:none; }
    .pp-btn-throw {
      border-color:#4a8a5a;color:#6aca7a;
      background:linear-gradient(135deg,#1a2e1a,#2a4e2a);
    }
    .pp-btn-throw:hover:not(:disabled) {
      border-color:#6aca7a;color:#80ff90;
      box-shadow:0 4px 15px rgba(106,202,122,.35);
    }

    /* ── 记录 ── */
    .pp-history {
      margin-top:8px;padding:6px;
      background:rgba(0,0,0,.2);border-radius:8px;
      display:flex;flex-wrap:wrap;gap:4px;
    }
    .pp-history-empty {
      text-align:center;width:100%;
      color:rgba(200,180,120,.25);font-size:10px;letter-spacing:2px;
    }
    .pp-history-item {
      display:flex;align-items:center;gap:4px;
      padding:3px 8px;border-radius:4px;font-size:10px;letter-spacing:.5px;
    }
    .pp-history-item.hit {
      background:rgba(40,80,30,.4);border:1px solid rgba(80,180,60,.2);color:#80ff90;
    }
    .pp-history-item.miss {
      background:rgba(80,30,20,.3);border:1px solid rgba(200,80,60,.15);color:#e08060;
    }
    .pp-hist-icon { font-size:11px; }
    .pp-hist-target { color:rgba(200,180,120,.7); }
    .pp-hist-pts { font-weight:bold; }
    .pp-highscore {
      text-align:center;margin-top:6px;
      font-size:10px;color:rgba(192,128,240,.5);letter-spacing:1px;
    }
    .pp-rules {
      text-align:center;margin-top:8px;
      font-size:9px;color:rgba(200,180,120,.3);
      letter-spacing:1px;font-style:italic;
    }

    /* ── 结束面板 ── */
    .pp-go-title {
      font-size:20px;font-weight:900;color:#ffd060;
      letter-spacing:4px;margin-bottom:16px;
      text-shadow:0 0 15px rgba(255,208,96,.4);
    }
    .pp-go-summary {
      display:inline-grid;grid-template-columns:auto auto;gap:6px 24px;
      text-align:left;margin-bottom:14px;
    }
    .pp-go-row { display:flex;align-items:center;gap:12px; }
    .pp-go-lbl { font-size:11px;color:rgba(200,180,120,.5);letter-spacing:1px; }
    .pp-go-val { font-size:15px;font-weight:bold; }
    .pp-go-extra {
      font-size:11px;color:rgba(200,180,120,.45);
      font-style:italic;margin-bottom:12px;letter-spacing:1px;
    }
    .pp-go-stats { display:flex;justify-content:center;gap:6px;margin-bottom:16px; }
    .pp-go-stat {
      width:20px;height:20px;line-height:20px;text-align:center;
      border-radius:4px;font-size:11px;font-weight:bold;
    }
    .pp-go-stat.hit { background:rgba(40,80,30,.5);border:1px solid rgba(80,180,60,.3);color:#80ff90; }
    .pp-go-stat.miss { background:rgba(80,30,20,.4);border:1px solid rgba(200,80,60,.2);color:#e08060; }
    .pp-go-btns { display:flex;justify-content:center;gap:12px; }

    /* ── 飞行箭矢 ── */
    .pp-flying-arrow {
      position:absolute;
      color:#ffd060;font-size:13px;font-weight:bold;
      white-space:pre;pointer-events:none;z-index:15;
      text-shadow:0 0 6px rgba(255,208,96,.6);
      transition:none;will-change:left,top,transform;
    }
    /* ── 拖尾点 ── */
    .pp-trail-dot {
      position:absolute;width:3px;height:3px;
      background:rgba(255,208,96,.5);border-radius:50%;
      pointer-events:none;z-index:14;
      transition:opacity .3s ease, transform .3s ease;
    }
    /* ── 命中火花 ── */
    .pp-spark {
      position:absolute;pointer-events:none;z-index:16;
      transition:all .6s ease-out;will-change:transform,opacity;
    }
    .pp-spark-burst {
      transition:all .55s cubic-bezier(.25,.8,.25,1);
    }
    /* ── 命中光环 ── */
    .pp-hit-halo {
      position:absolute;pointer-events:none;z-index:15;
      width:10px;height:10px;border-radius:50%;
      transform:translate(-50%,-50%);
      background:radial-gradient(circle,rgba(255,210,80,.5) 0%,rgba(255,180,40,.2) 40%,transparent 70%);
      opacity:0;will-change:transform,opacity;
    }
    .pp-hit-halo.pp-halo-expand {
      animation:ppHaloBurst .8s ease-out forwards;
    }
    @keyframes ppHaloBurst {
      0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
      60%  { opacity:0.6; }
      100% { transform:translate(-50%,-50%) scale(8); opacity:0; }
    }
    /* ── 命中文字 ── */
    .pp-hit-text {
      position:absolute;pointer-events:none;z-index:18;
      color:#ffd060;font-size:16px;font-weight:bold;
      text-shadow:0 0 10px rgba(255,200,60,.8), 0 0 20px rgba(255,160,40,.4);
      transform:translateX(-50%);
      transition:top .7s cubic-bezier(.2,.6,.3,1), opacity .6s ease .15s;
      white-space:nowrap;
    }
    /* ── 未中箭影 ── */
    .pp-miss-arrow {
      position:absolute;pointer-events:none;z-index:15;
      color:#a08060;font-size:10px;opacity:.8;
      transition:top .2s ease-out, opacity .3s ease-in, transform .3s ease;
    }
    /* ── 瞄准canvas ── */
    .pp-aim-canvas {
      position:absolute;top:0;left:0;
      pointer-events:none;z-index:10;
    }
    /* ── 动画 ── */
    @keyframes ppFadeIn { from{opacity:0} to{opacity:1} }
    /* ── 手机适配 ── */
    @media(max-width:480px){
      .pp-info-bar { grid-template-columns:repeat(2,1fr); }
      .pp-ctrl-row { grid-template-columns:1fr; }
      .pp-player-zone { width:48px; }
      .pp-ft-animated { font-size:14px; }
      .pp-pot-art { font-size:8px; }
      .pp-pot-zone { width:44px; }
    }
  `;
  document.head.appendChild(s);
}
