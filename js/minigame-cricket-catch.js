/**
 * minigame-cricket-catch.js — 野外捕捉蛐蛐小游戏
 * 
 * 玩法：在草丛/废墟/石缝中寻找蛐蛐，通过听声辨位判断稀有度
 * 捕捉过程：发现 → 靠近 → 捕捉（时机小游戏）
 * 稀有度：普通(60%) / 稀有(30%) / 极品(10%)
 */

/* ════════════════════════════════════════
   零、音效系统（Web Audio API 合成）
   ════════════════════════════════════════ */

/** 当前音效会话 ID，用于取消延迟回调 */
let _catchSoundSession = 0;
/** 当前 AudioContext */
let _catchAudioCtx = null;
/** 正在循环播放的背景音节点列表 */
let _catchLoopNodes = [];

/** 获取/复用 AudioContext */
function _catchGetCtx() {
  if (!_catchAudioCtx || _catchAudioCtx.state === 'closed') {
    _catchAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_catchAudioCtx.state === 'suspended') {
    _catchAudioCtx.resume();
  }
  return _catchAudioCtx;
}

/** 停止所有捕捉音效并关闭上下文 */
function catchSoundStop() {
  _catchSoundSession++; // 让所有旧 setTimeout 失效
  _catchLoopNodes.forEach(n => { try { n.stop(); } catch(e){} });
  _catchLoopNodes = [];
  if (_catchAudioCtx) {
    try { _catchAudioCtx.close(); } catch(e){}
    _catchAudioCtx = null;
  }
}

// 别名：供 clearGameAudio 统一清理
window.cleanupCricketAudio = catchSoundStop;

/**
 * 合成一声蛐蛐鸣叫
 * @param {AudioContext} ctx
 * @param {number} startTime  AudioContext时间
 * @param {number} freq       基频 Hz（决定音调高低）
 * @param {number} chirpLen   单次鸣叫时长(s)
 * @param {number} pulses     每次鸣叫的脉冲数（节奏密度）
 * @param {number} gain       音量 0~1
 */
function _synthChirp(ctx, startTime, freq, chirpLen, pulses, gain) {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, startTime);
  masterGain.connect(ctx.destination);

  const pulseLen = chirpLen / pulses;
  for (let i = 0; i < pulses; i++) {
    const t = startTime + i * pulseLen;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    // 轻微频率抖动，模拟翅膀摩擦的不完美感
    osc.frequency.linearRampToValueAtTime(freq * 1.05, t + pulseLen * 0.3);
    osc.frequency.linearRampToValueAtTime(freq,        t + pulseLen * 0.6);

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.setValueAtTime(gain, t + pulseLen * 0.5);
    g.gain.linearRampToValueAtTime(0,    t + pulseLen * 0.9);

    osc.connect(g);
    g.connect(masterGain);
    osc.start(t);
    osc.stop(t + pulseLen);
  }
}

/**
 * 播放蛐蛐叫声（循环）
 * @param {'common'|'rare'|'epic'|'legendary'} tier  稀有度
 */
function catchSoundPlayChirp(tier) {
  catchSoundStop(); // 先停旧音效
  const session = ++_catchSoundSession;
  const ctx = _catchGetCtx();

  // 三档参数
  const profiles = {
    common: { freq: 3800, chirpLen: 0.12, pulses: 3, gain: 0.18, interval: 1.0,  jitter: 0.4 },
    rare:   { freq: 4800, chirpLen: 0.09, pulses: 4, gain: 0.22, interval: 0.75, jitter: 0.25 },
    epic:   { freq: 5800, chirpLen: 0.07, pulses: 6, gain: 0.28, interval: 0.5,  jitter: 0.15 },
    legendary: { freq: 7500, chirpLen: 0.05, pulses: 9, gain: 0.38, interval: 0.35, jitter: 0.08 },
  };
  const p = profiles[tier] || profiles.common;

  // 用递归 setTimeout 实现循环（方便随时取消）
  function scheduleNext(delayMs) {
    const id = setTimeout(() => {
      if (_catchSoundSession !== session) return; // 已被取消
      const nowCtx = _catchGetCtx();
      _synthChirp(nowCtx, nowCtx.currentTime, p.freq, p.chirpLen, p.pulses, p.gain);

      // 史诗级：两声快速连鸣
      if (tier === 'epic') {
        _synthChirp(nowCtx, nowCtx.currentTime + 0.18, p.freq * 1.1, p.chirpLen, p.pulses, p.gain * 0.85);
      }
      // 稀有级：偶发第二声
      if (tier === 'rare' && Math.random() < 0.4) {
        _synthChirp(nowCtx, nowCtx.currentTime + 0.14, p.freq * 0.95, p.chirpLen, p.pulses, p.gain * 0.7);
      }

      const nextDelay = (p.interval + (Math.random() - 0.5) * p.jitter) * 1000;
      scheduleNext(nextDelay);
    }, delayMs);
  }

  // 立即播一声，之后循环
  _synthChirp(ctx, ctx.currentTime + 0.05, p.freq, p.chirpLen, p.pulses, p.gain);
  if (tier === 'epic') {
    _synthChirp(ctx, ctx.currentTime + 0.25, p.freq * 1.1, p.chirpLen, p.pulses, p.gain * 0.85);
  }
  scheduleNext(p.interval * 1000);
}

/**
 * 播放捕捉阶段背景音（紧张的低频心跳 + 轻微蛐蛐叫）
 */
function catchSoundPlayTense() {
  catchSoundStop();
  const session = ++_catchSoundSession;
  const ctx = _catchGetCtx();

  // 低频心跳
  function heartbeat() {
    const id = setTimeout(() => {
      if (_catchSoundSession !== session) return;
      const c = _catchGetCtx();
      // 第一拍
      const o1 = c.createOscillator();
      const g1 = c.createGain();
      o1.type = 'sine';
      o1.frequency.value = 60;
      g1.gain.setValueAtTime(0, c.currentTime);
      g1.gain.linearRampToValueAtTime(0.25, c.currentTime + 0.04);
      g1.gain.linearRampToValueAtTime(0,   c.currentTime + 0.16);
      o1.connect(g1); g1.connect(c.destination);
      o1.start(c.currentTime); o1.stop(c.currentTime + 0.2);

      // 第二拍（0.2s后）
      const o2 = c.createOscillator();
      const g2 = c.createGain();
      o2.type = 'sine';
      o2.frequency.value = 55;
      g2.gain.setValueAtTime(0, c.currentTime + 0.2);
      g2.gain.linearRampToValueAtTime(0.20, c.currentTime + 0.24);
      g2.gain.linearRampToValueAtTime(0,   c.currentTime + 0.36);
      o2.connect(g2); g2.connect(c.destination);
      o2.start(c.currentTime + 0.2); o2.stop(c.currentTime + 0.4);

      heartbeat();
    }, 700);
  }
  heartbeat();

  // 持续轻微蛐蛐背景
  function softChirp() {
    const id = setTimeout(() => {
      if (_catchSoundSession !== session) return;
      const c = _catchGetCtx();
      _synthChirp(c, c.currentTime, 4200, 0.08, 3, 0.08);
      softChirp();
    }, 1200 + Math.random() * 600);
  }
  softChirp();
}

/**
 * 播放捕捉成功音效
 * @param {number} rare  蛐蛐稀有度 1-5
 */
function catchSoundPlaySuccess(rare) {
  catchSoundStop();
  const ctx = _catchGetCtx();
  const t = ctx.currentTime;

  // 上升音阶，稀有度越高音阶越长越华丽
  const notes = rare >= 4
    ? [523, 659, 784, 1047, 1319]   // 史诗/传说：5音上升
    : rare >= 3
    ? [523, 659, 784, 1047]          // 珍贵：4音
    : rare >= 2
    ? [523, 659, 784]                // 稀有：3音
    : [523, 659];                    // 普通：2音

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const st = t + i * 0.1;
    g.gain.setValueAtTime(0,    st);
    g.gain.linearRampToValueAtTime(0.3, st + 0.04);
    g.gain.linearRampToValueAtTime(0,   st + 0.22);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(st); osc.stop(st + 0.25);
  });

  // 传说/史诗额外加一个闪光颤音
  if (rare >= 4) {
    const shimmerStart = t + notes.length * 0.1 + 0.05;
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1800 + i * 120;
      const st2 = shimmerStart + i * 0.06;
      g.gain.setValueAtTime(0,    st2);
      g.gain.linearRampToValueAtTime(0.12, st2 + 0.02);
      g.gain.linearRampToValueAtTime(0,    st2 + 0.1);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(st2); osc.stop(st2 + 0.12);
    }
  }
}

/**
 * 播放捕捉失败音效（跌落/逃跑感）
 */
function catchSoundPlayFail() {
  catchSoundStop();
  const ctx = _catchGetCtx();
  const t = ctx.currentTime;

  // 下降滑音
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.35);
  g.gain.setValueAtTime(0.2, t);
  g.gain.linearRampToValueAtTime(0, t + 0.35);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.38);

  // 蛐蛐跑走的快速叫声（高速短促）
  setTimeout(() => {
    const c = _catchGetCtx();
    _synthChirp(c, c.currentTime, 5000, 0.05, 4, 0.15);
    setTimeout(() => {
      const c2 = _catchGetCtx();
      _synthChirp(c2, c2.currentTime, 4500, 0.04, 3, 0.09);
    }, 100);
  }, 200);
}

/**
 * 播放"接近目标"提示音（光标进入中心区时）
 */
function catchSoundPlayNear() {
  const ctx = _catchGetCtx();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.linearRampToValueAtTime(1100, t + 0.06);
  g.gain.setValueAtTime(0.15, t);
  g.gain.linearRampToValueAtTime(0, t + 0.1);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.12);
}

/* ════════════════════════════════════════
   一、捕捉场景配置
   ════════════════════════════════════════ */
// 神兽出没的偏僻城市（每个城市对应一只神兽）
const CATCH_LEGEND_CITY_BREED = {
  guangzhou:         { breedId:'south_sea_dragon',  name:'南海龙帝',  tip:'深海腥风，隐隐有龙吟之声……' },
  xiyu_city:         { breedId:'wuzang_demon',      name:'乌斯魔王',  tip:'西域荒漠传来诡异的嗡鸣，令人生畏……' },
  xuanming_base:     { breedId:'ice_king',          name:'极北冰帝',  tip:'极寒之地深处，传来震颤大地的鸣叫……' },
  manhuang:          { breedId:'desert_god',        name:'大漠狂神',  tip:'蛮荒绝域，沙暴之中似有凶虫咆哮……' },
  tiandibang_fort:   { breedId:'fortress_overlord', name:'霸寨天王',  tip:'雷云压顶，堡垒之中回荡着震耳之声……' },
  xuegu_fort:        { breedId:'blood_bone_king',   name:'血骨冥王',  tip:'血腥气息中，传来令人胆寒的尖啸……' },
};

const CATCH_SCENES = {
  grass: {
    name: '城郊草丛',
    icon: '🌿',
    desc: '杂草丛生，蛐蛐众多',
    rareBonus: 0,
    art: `
    ／￣￣ ＼
   ／  🌿🌿  ＼
  ｜  🌿🦗🌿  ｜
  ｜  🌿🌿🌿  ｜
   ＼________／
    `
  },
  ruin: {
    name: '破庙废墟',
    icon: '🏚️',
    desc: '断壁残垣，藏虫之地',
    rareBonus: 0.05,
    art: `
    ▓▓▓▓▓▓
   ▓ 🦗  ▓
  ▓  🧱🧱 ▓
   ▓▓▓▓▓▓
    `
  },
  stone: {
    name: '青石缝隙',
    icon: '🪨',
    desc: '石缝阴凉，出好虫',
    rareBonus: 0.08,
    art: `
    🪨🪨🪨🪨
   🪨 🦗 🪨
  🪨🪨🪨🪨🪨
    `
  },
  garden: {
    name: '荒废庭院',
    icon: '🏡',
    desc: '昔日繁华，今为虫居',
    rareBonus: 0.10,
    art: `
    ╔══════╗
    ║ 🦗🌿 ║
    ║ 🌿🌿 ║
    ╚══════╝
    `
  },
  legend: {
    name: '神兽领域',
    icon: '☠',
    desc: '传说神兽出没之地',
    rareBonus: 0,
    isLegend: true,
    art: `
    ⚡🐉⚡
   ⚡⚡⚡⚡⚡
    ⚡🌑⚡
   ⚡⚡⚡⚡⚡
    ⚡🐉⚡
    `
  }
};

/* ════════════════════════════════════════
   二、蛐蛐叫声稀有度判断
   ════════════════════════════════════════ */
const CRICKET_SOUNDS = {
  common: {
    name: '普通鸣声',
    desc: '声音平淡，无甚特别',
    probability: 0.60,
    rarePool: [1, 1], // 只能抓到rare=1的蛐蛐
    color: '#a0a0a0'
  },
  rare: {
    name: '清脆悦耳',
    desc: '声如银铃，似是佳品',
    probability: 0.30,
    rarePool: [1, 2, 2], // 大概率rare=2
    color: '#60b8d0'
  },
  epic: {
    name: '龙吟虎啸',
    desc: '声震四野，必是神虫！',
    probability: 0.10,
    rarePool: [2, 3, 3, 4], // 高概率稀有
    color: '#d0a020'
  },
  legendary: {
    name: '天地震动',
    desc: '⚡ 异象降临，此地有神兽出没！',
    probability: 1.0,
    rarePool: [6], // 神兽级
    color: '#ffd700'
  }
};

/* ════════════════════════════════════════
   三、捕捉游戏状态
   ════════════════════════════════════════ */
let CATCH_STATE = {
  isActive: false,
  scene: null,
  soundType: null,
  targetBreed: null,
  attempts: 0,
  maxAttempts: 3,
  caught: [],
  cityId: null   // 当前城市ID，用于地域品种过滤
};

/* ════════════════════════════════════════
   四、核心函数
   ════════════════════════════════════════ */

/**
 * 打开捕捉小游戏
 */
function openCricketCatchGame() {
  // 检查是否在允许捕捉的地点
  const cityId = travelCurrentCity;
  CATCH_STATE.cityId = cityId; // 记录城市，用于地域品种过滤
  const node = WORLD_NODES[cityId];
  if (!node) {
    showToast('❌ 无法在此处捕捉蛐蛐');
    return;
  }

  // ── 蛐蛐笼检查（每个笼子 = 1个位置） ──
  let totalSlots = 0;
  if (typeof cgGetCageCapacity === 'function') {
    const cap = cgGetCageCapacity();
    totalSlots = cap.slots;
  } else if (typeof craftBagLoad === 'function') {
    const cBag = craftBagLoad();
    for (const cid of ['item_cricket_cage_premium','item_cricket_cage_fine','item_cricket_cage_basic']) {
      const item = cBag.find(e => e.id === cid);
      if(item) totalSlots += item.qty;
    }
  }
  if (totalSlots <= 0) {
    showToast('🧺 需要先准备一个蛐蛐笼才能捉蛐蛐！\n找城镇掌柜购买「竹编蛐蛐罐」或在合成台制作');
    return;
  }

  // ── 容量上限检查（总笼数=总容量） ──
  const collection = (typeof CG !== 'undefined' && CG.collection) ? CG.collection : [];
  if (collection.length >= totalSlots) {
    showToast(`🦗 笼子已满（${collection.length}/${totalSlots}个笼位）\n先去斗蛐蛐或放生几只再来，或获取更多蛐蛐笼！`);
    return;
  }
  
  // 消耗精力检查
  if (typeof edS !== 'undefined' && edS.energy < 5) {
    showToast('😫 精力不足，需要至少5点精力');
    return;
  }
  
  CATCH_STATE.isActive = true;
  CATCH_STATE.attempts = 0;
  CATCH_STATE.caught = [];
  
  renderCatchMain();
}

/**
 * 渲染捕捉主界面
 */
function renderCatchMain() {
  const overlay = document.createElement('div');
  overlay.id = 'cricketCatchOverlay';
  overlay.className = 'cricket-overlay';
  overlay.innerHTML = `
    <div class="cricket-catch-container">
      <div class="catch-header">
        <h2>🦗 野外捉蛐蛐</h2>
        <button class="close-btn" onclick="closeCricketCatch()">✕</button>
      </div>
      <div class="catch-scenes">
        ${Object.entries(CATCH_SCENES).filter(([k]) => k !== 'legend').map(([key, scene]) => `
          <div class="scene-card" onclick="selectCatchScene('${key}')">
            <div class="scene-art">${scene.art}</div>
            <div class="scene-info">
              <div class="scene-name">${scene.icon} ${scene.name}</div>
              <div class="scene-desc">${scene.desc}</div>
            </div>
          </div>
        `).join('')}
        ${(CATCH_LEGEND_CITY_BREED[CATCH_STATE.cityId || '']) ? `
          <div class="scene-card legend-scene" onclick="selectCatchScene('legend')">
            <div class="scene-art legend-art">
    ⚡🐉⚡
   ⚡⚡⚡⚡⚡
    ⚡🌑⚡
   ⚡⚡⚡⚡⚡
    ⚡🐉⚡
            </div>
            <div class="scene-info">
              <div class="scene-name">☠ 神兽出没</div>
              <div class="scene-desc">⚠ ${CATCH_LEGEND_CITY_BREED[CATCH_STATE.cityId].tip}</div>
            </div>
          </div>
        ` : ''}
      </div>
      <div class="catch-tip">
        💡 选择一处地点，仔细聆听蛐蛐的叫声，判断是否有珍品${(CATCH_LEGEND_CITY_BREED[CATCH_STATE.cityId || '']) ? '　⚡ 神兽出没警告！' : ''}
      </div>
      <div id="catchRegionHint" class="region-hint"></div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  addCatchStyles();

  // 显示本地特色蛐蛐提示
  const cityId = CATCH_STATE.cityId;
  if (cityId) {
    const regionalBreeds = CRICKET_BREEDS.filter(b => Array.isArray(b.regions) && b.regions.includes(cityId));
    if (regionalBreeds.length > 0) {
      const hintEl = document.getElementById('catchRegionHint');
      if (hintEl) {
        const names = regionalBreeds.map(b => `${b.icon||'🦗'}${b.name}`).join(' / ');
        hintEl.innerHTML = `📍 本地特色蛐蛐：${names}`;
      }
    }
  }
}

/**
 * 选择捕捉场景
 */
function selectCatchScene(sceneKey) {
  CATCH_STATE.scene = sceneKey;
  CATCH_STATE.attempts = 0;
  
  // 消耗精力
  if (typeof edS !== 'undefined') {
    edS.energy = Math.max(0, edS.energy - 5);
    if (typeof updateTravelStatus === 'function') updateTravelStatus();
  }
  
  renderListeningPhase();
}

/**
 * 聆听阶段 - 判断蛐蛐稀有度
 */
function renderListeningPhase() {
  const scene = CATCH_SCENES[CATCH_STATE.scene];
  
  // 随机决定声音类型
  const roll = Math.random();
  let soundType;
  const isLegendScene = CATCH_STATE.scene === 'legend';
  // 神兽场景：强制触发传说级声音（但仍需捕捉）
  if (isLegendScene) {
    soundType = 'legendary';
  } else if (roll < 0.10) {
    soundType = 'epic';
  } else if (roll < 0.40) {
    soundType = 'rare';
  } else {
    soundType = 'common';
  }
  
  CATCH_STATE.soundType = soundType;
  const sound = CRICKET_SOUNDS[soundType];

  // 播放对应稀有度的蛐蛐叫声
  catchSoundPlayChirp(soundType);

  // 神兽专用音效文字
  const legendSound = (soundType === 'legendary' && typeof LEGENDARY_SOUNDS !== 'undefined')
    ? LEGENDARY_SOUNDS[Math.floor(Math.random() * LEGENDARY_SOUNDS.length)]
    : null;

  const container = document.querySelector('.cricket-catch-container');
  const isLegend = CATCH_STATE.scene === 'legend';
  container.innerHTML = `
    <div class="catch-header">
      <h2 class="${isLegend ? 'legend-title' : ''}">${scene.icon} ${scene.name}</h2>
      <button class="close-btn" onclick="closeCricketCatch()">✕</button>
    </div>
    ${isLegend ? '<div class="legend-banner">⚠ 神 兽 降 临 ⚠</div>' : ''}
    <div class="listening-phase">
      <div class="scene-display">${scene.art}</div>
      <div class="sound-indicator" style="color:${sound.color}">
        <div class="sound-wave">〰️ 〰️ 〰️</div>
        ${legendSound ? `
          <div class="sound-name" style="${legendSound.style}">${legendSound.sound}</div>
          <div class="sound-desc" style="${legendSound.css}">${sound.desc}</div>
        ` : `
          <div class="sound-name">${sound.name}</div>
          <div class="sound-desc">${sound.desc}</div>
        `}
      </div>
      <div class="listen-actions">
        <button class="action-btn primary" onclick="startCatching()">
          🎯 循声捉虫 (消耗3精力)
        </button>
        <button class="action-btn" onclick="renderCatchMain()">
          🔙 换个地方
        </button>
      </div>
      <div class="catch-tip">
        今日剩余次数: ${3 - CATCH_STATE.attempts}/3
      </div>
    </div>
  `;
}

/**
 * 开始捕捉 - 时机小游戏
 */
function startCatching() {
  if (CATCH_STATE.attempts >= CATCH_STATE.maxAttempts) {
    showToast('😅 今日捉虫次数已尽');
    return;
  }
  
  // 消耗精力
  if (typeof edS !== 'undefined') {
    if (edS.energy < 3) {
      showToast('😫 精力不足');
      return;
    }
    edS.energy -= 3;
    if (typeof updateTravelStatus === 'function') updateTravelStatus();
  }
  
  CATCH_STATE.attempts++;
  
  // 切换到紧张的捕捉背景音
  catchSoundPlayTense();

  const container = document.querySelector('.cricket-catch-container');
  container.innerHTML = `
    <div class="catch-header">
      <h2>🦗 捕捉时机</h2>
      <button class="close-btn" onclick="closeCricketCatch()">✕</button>
    </div>
    <div class="catching-phase">
      <div class="catch-instruction">
        看准时机！当蛐蛐停在光圈中心时点击捕捉
      </div>
      <div class="catch-game">
        <div class="cricket-target">🦗</div>
        <div class="catch-zone">
          <div class="target-ring"></div>
          <div class="moving-cursor" id="catchCursor"></div>
        </div>
        <button class="catch-btn" id="catchBtn" onclick="attemptCatch()">
          👐 捕捉！
        </button>
      </div>
      <div class="catch-progress">
        尝试 ${CATCH_STATE.attempts}/${CATCH_STATE.maxAttempts}
      </div>
    </div>
  `;
  
  // 启动光标移动动画
  setTimeout(() => {
    const cursor = document.getElementById('catchCursor');
    if (cursor) {
      cursor.style.animation = 'cursorMove 2s ease-in-out infinite';
      
      // 监听光标位置，接近中心区时播放提示音
      let _lastNearSound = 0;
      const _nearCheckId = setInterval(() => {
        if (!document.getElementById('catchCursor')) {
          clearInterval(_nearCheckId);
          return;
        }
        const c = document.getElementById('catchCursor');
        if (!c) return;
        // 通过 getComputedStyle 获取实际 left（百分比动画）
        const zone = document.querySelector('.catch-zone');
        if (!zone) return;
        const cRect = c.getBoundingClientRect();
        const zRect = zone.getBoundingClientRect();
        const relLeft = cRect.left - zRect.left + cRect.width / 2;
        const center  = zRect.width / 2;
        const dist    = Math.abs(relLeft - center);
        const now     = Date.now();
        // 进入中心区20px范围，每次经过只响一次
        if (dist < 20 && now - _lastNearSound > 800) {
          _lastNearSound = now;
          catchSoundPlayNear();
        }
      }, 50);
    }
  }, 100);
}

/**
 * 执行捕捉
 */
function attemptCatch() {
  const cursor = document.getElementById('catchCursor');
  const btn = document.getElementById('catchBtn');
  if (!cursor || !btn) return;
  
  // 停止动画
  cursor.style.animation = 'none';
  btn.disabled = true;
  
  // 计算位置（简化版：随机成功率）
  // 实际应根据光标位置计算，这里用随机模拟
  const scene = CATCH_SCENES[CATCH_STATE.scene];
  const sound = CRICKET_SOUNDS[CATCH_STATE.soundType];
  
  // 基础成功率
  let successRate = 0.60;
  if (CATCH_STATE.soundType === 'rare') successRate = 0.45;
  if (CATCH_STATE.soundType === 'epic') successRate = 0.30;
  if (CATCH_STATE.soundType === 'legendary') {
    successRate = (typeof LEGEND_CATCH_DIFFICULTY !== 'undefined') ? LEGEND_CATCH_DIFFICULTY : 0.15;
  }
  
  // 场景加成
  successRate += scene.rareBonus;
  
  // ═══════════════════════════════════════════════
  // 捉蛐蛐"将将胡"恶搞效果应用
  // ═══════════════════════════════════════════════
  if (CATCH_STATE._spiderWebEffect) {
    successRate *= 0.7; // 被蜘蛛网缠住，成功率-30%
    delete CATCH_STATE._spiderWebEffect;
  }
  if (CATCH_STATE._badLuckEffect) {
    successRate *= 0.8; // 踩到狗屎，成功率-20%
    delete CATCH_STATE._badLuckEffect;
  }
  
  // 随机结果
  const isSuccess = Math.random() < successRate;
  
  if (isSuccess) {
    // 捕捉成功，生成蛐蛐
    const caughtCricket = generateCaughtCricket();
    CATCH_STATE.caught.push(caughtCricket);
    const breedData = CRICKET_BREEDS.find(b => b.id === caughtCricket.breedId);
    catchSoundPlaySuccess(breedData ? breedData.rare : 1);
    renderCatchSuccess(caughtCricket);
  } else {
    catchSoundPlayFail();
    renderCatchFail();
  }
}

/**
 * 生成捕捉到的蛐蛐
 */
function generateCaughtCricket() {
  const sound = CRICKET_SOUNDS[CATCH_STATE.soundType];
  const scene = CATCH_SCENES[CATCH_STATE.scene];
  
  // ═══════════════════════════════════════════════
  // 捉蛐蛐"将将胡"系统
  // ═══════════════════════════════════════════════
  const luckRoll = Math.random();
  let specialEvent = null;
  let adjustedRarePool = [...sound.rarePool];
  
  // 2%概率：虫王出没（稀有度自动+1级）
  if(luckRoll < 0.02){
    specialEvent = 'king_appear';
    // 提升稀有度池
    const upgradeMap = { common:'rare', rare:'epic', epic:'legendary', legendary:'legendary' };
    adjustedRarePool = adjustedRarePool.map(r => upgradeMap[r] || r);
  }
  // 3%概率：意外惊扰（蛐蛐逃跑，但留下蜕壳可卖钱）
  else if(luckRoll < 0.05){
    specialEvent = 'startled';
  }
  // 1%概率：捕虫大师（捕捉到双蛐蛐）
  else if(luckRoll < 0.06){
    specialEvent = 'master_catch';
  }
  
  // ═══════════════════════════════════════════════
  // 捉蛐蛐"将将胡"恶搞事件（5%总概率）
  // ═══════════════════════════════════════════════
  const gagRoll = Math.random();
  if (gagRoll < 0.05 && !specialEvent) {
    const gagEvents = ['fake_sound', 'cricket_king', 'spider_web', 'dog_poop', 'cricket_vendor', 'cricket_love'];
    specialEvent = gagEvents[Math.floor(Math.random() * gagEvents.length)];
    
    const gagMessages = {
      fake_sound: { title: '🐸 假鸣声！', msg: '原来是只青蛙在叫！', type: 'warning' },
      cricket_king: { title: '👑 蛐蛐王！', msg: '一只巨大的蛐蛐跳了出来！', type: 'legendary' },
      spider_web: { title: '🕸️ 被蜘蛛网缠住！', msg: '你的手被蜘蛛网粘住了！', type: 'warning' },
      dog_poop: { title: '💩 踩到狗屎！', msg: '你踩到了狗屎，运气暂时下降...', type: 'warning' },
      cricket_vendor: { title: '🏪 遇到蛐蛐贩子！', msg: '有个小贩说可以直接卖你蛐蛐！', type: 'rare' },
      cricket_love: { title: '💕 蛐蛐谈恋爱！', msg: '两只蛐蛐正在约会，被你一锅端了！', type: 'rare' }
    };
    
    if (typeof showToast === 'function') {
      const gagMsg = gagMessages[specialEvent];
      showToast(gagMsg.title + ' ' + gagMsg.msg, gagMsg.type);
    }
    
    // 恶搞事件特殊效果
    if (specialEvent === 'fake_sound') {
      // 假鸣声：变成普通蛐蛐
      adjustedRarePool = [1];
    } else if (specialEvent === 'cricket_king') {
      // 蛐蛐王：稀有度+2
      adjustedRarePool = adjustedRarePool.map(r => Math.min(6, r + 2));
    } else if (specialEvent === 'spider_web') {
      // 被蜘蛛网缠住：成功率降低
      CATCH_STATE._spiderWebEffect = true;
    } else if (specialEvent === 'dog_poop') {
      // 踩到狗屎：运气-1（临时）
      CATCH_STATE._badLuckEffect = true;
    } else if (specialEvent === 'cricket_love') {
      // 蛐蛐谈恋爱：捕捉双蛐蛐
      CATCH_STATE._doubleCatch = true;
    }
  }
  
  // 处理意外惊扰
  if(specialEvent === 'startled'){
    return {
      breedId: 'shell_only',
      name: '蛐蛐蜕壳',
      soundType: 'common',
      scene: CATCH_STATE.scene,
      specialEvent: 'startled',
      sellValue: 20 + Math.floor(Math.random() * 30) // 可卖20-50两
    };
  }

  // 根据声音类型决定稀有度池
  const rarePool = adjustedRarePool;
  const targetRare = rarePool[Math.floor(Math.random() * rarePool.length)];

  // 从该稀有度中随机选择品种（按当前城市地域过滤）
  const cityId = CATCH_STATE.cityId;
  let candidates;

  // 神兽场景：只从当前城市专属神兽中抽取
  if (CATCH_STATE.soundType === 'legendary' || targetRare === 'legendary') {
    if (cityId && CATCH_LEGEND_CITY_BREED[cityId]) {
      // 只取该城市专属 + legend:true 的神兽
      candidates = CRICKET_BREEDS.filter(b => b.legend === true && b.regions && b.regions.includes(cityId));
    } else {
      candidates = CRICKET_BREEDS.filter(b => b.legend === true);
    }
  } else {
    candidates = CRICKET_BREEDS.filter(b => b.rare === targetRare);
    // 优先取该城市地域品种（非神兽）
    if (cityId) {
      const regional = candidates.filter(b => Array.isArray(b.regions) && b.regions.includes(cityId));
      if (regional.length > 0) candidates = regional;
    }
  }

  if (candidates.length === 0) {
    candidates = CRICKET_BREEDS.filter(b => b.rare === 1);
  }
  const breed = candidates[Math.floor(Math.random() * candidates.length)];

  // 生成个体名称
  const prefixes = {
    common: ['小', '野', '草'],
    rare: ['青', '金', '玉'],
    epic: ['神', '龙', '霸'],
    legendary: ['天', '神', '仙']
  };
  
  // 虫王出没特殊前缀
  if(specialEvent === 'king_appear'){
    prefixes.common = ['王', '霸', '巨'];
    prefixes.rare = ['王', '帝', '皇'];
    prefixes.epic = ['圣', '帝', '皇'];
    prefixes.legendary = ['圣', '帝', '尊'];
  }
  
  const prefix = (prefixes[CATCH_STATE.soundType] || prefixes.common)[Math.floor(Math.random() * 3)];
  const customName = prefix + breed.name.slice(0, 2);
  
  const result = {
    breedId: breed.id,
    name: customName,
    soundType: CATCH_STATE.soundType,
    scene: CATCH_STATE.scene,
    specialEvent
  };
  
  // 捕虫大师：额外一只
  if(specialEvent === 'master_catch'){
    result.bonusCricket = {
      breedId: breed.id,
      name: '伴' + breed.name.slice(0, 2),
      soundType: CATCH_STATE.soundType,
      scene: CATCH_STATE.scene
    };
  }
  
  return result;
}

/**
 * 捕捉成功界面
 */
function renderCatchSuccess(cricket) {
  // ═══════════════════════════════════════════════
  // 捉蛐蛐"将将胡"系统 - 特殊事件处理
  // ═══════════════════════════════════════════════
  
  // 意外惊扰：只获得蜕壳
  if(cricket.specialEvent === 'startled'){
    const container = document.querySelector('.cricket-catch-container');
    container.innerHTML = `
      <div class="catch-header">
        <h2>😅 惊扰了！</h2>
        <button class="close-btn" onclick="closeCricketCatch()">✕</button>
      </div>
      <div class="catch-success">
        <div style="font-size:48px;margin:20px 0;">🍂</div>
        <div class="caught-info">
          <div class="caught-breed">蛐蛐蜕壳</div>
          <div style="font-size:13px;color:#a09070;margin:10px 0;">
            你动作太大惊动了蛐蛐，它逃走了，只留下这个蜕壳...
          </div>
          <div style="font-size:14px;color:#d0b060;margin:10px 0;">
            💰 可卖 ${cricket.sellValue} 两
          </div>
          <button class="scene-btn" onclick="_catchSellShell(${cricket.sellValue})" style="margin-top:15px;">
            💰 卖给药铺
          </button>
        </div>
      </div>
    `;
    return;
  }

  const breed = CRICKET_BREEDS.find(b => b.id === cricket.breedId);
  const sound = CRICKET_SOUNDS[cricket.soundType];

  // 计算笼位（每个笼子=1个位置）
  const capInfo = (typeof cgGetCageCapacity === 'function') ? cgGetCageCapacity() : { slots:0 };
  let totalSlots = capInfo.slots;
  if(totalSlots <= 0 && typeof craftBagLoad === 'function'){
    const cBag = craftBagLoad();
    for(const cid of ['item_cricket_cage_premium','item_cricket_cage_fine','item_cricket_cage_basic']){
      const item = cBag.find(e => e.id === cid);
      if(item) totalSlots += item.qty;
    }
  }
  const nowCount = (typeof CG !== 'undefined' && CG.collection) ? CG.collection.length : 0;
  const remain = totalSlots - nowCount; // 还没入库，当前这只不算
  const fullAfter = remain <= 1; // 入库后满
  
  // 捕虫大师：需要额外笼位
  const needSlots = cricket.bonusCricket ? 2 : 1;
  const cageInfo = totalSlots > 0
    ? `<div style="font-size:10px;color:rgba(180,200,120,.5);margin-top:4px">🧺 笼位 ${nowCount}/${totalSlots}（捉到后 ${nowCount+needSlots}/${totalSlots}）</div>`
    : '';

  // 暂存待命名的蛐蛐数据（不立即入库）
  window.__pendingCricket = cricket;

  const isLegend = cricket.soundType === 'legendary';
  const isKing = cricket.specialEvent === 'king_appear';
  const isMaster = cricket.specialEvent === 'master_catch';
  
  // 特殊事件标题
  let titleText = isLegend ? '☠ 神兽入手！' : '🎉 抓到了！';
  if(isKing) titleText = '👑 虫王降世！';
  if(isMaster) titleText = '🏆 捕虫大师！双蛐入笼！';
  
  const container = document.querySelector('.cricket-catch-container');
  container.innerHTML = `
    <div class="catch-header">
      <h2 class="${isLegend || isKing ? 'legend-title' : ''}">${titleText}</h2>
      <button class="close-btn" onclick="closeCricketCatch()">✕</button>
    </div>
    ${isLegend || isKing ? '<div class="legend-banner">神 虫 降 世 · 威 震 四 方</div>' : ''}
    ${isMaster ? '<div style="background:linear-gradient(90deg,transparent,#4a9,transparent);color:#fff;text-align:center;padding:6px;font-size:13px;">一 箭 双 雕 · 大 师 手 笔</div>' : ''}
    <div class="catch-success ${isLegend || isKing ? 'legendary-success' : ''}">
      <div class="caught-cricket-art" style="color:${breed.color}; font-size:${isLegend || isKing ? '22px' : '18px'}">
        ${CRICKET_ART[breed.id]?.stand?.join('\n') || '🦗'}
      </div>
      <div class="caught-info">
        <div class="caught-breed" style="${isLegend || isKing ? 'color:#ffd700;text-shadow:0 0 8px rgba(255,215,0,.5);font-size:16px' : ''}">${cricket.name} ${'★'.repeat(breed.rare)} ${isKing ? '👑' : ''}</div>
        <div class="caught-traits">
          <span>攻:${breed.atk}</span>
          <span>防:${breed.def}</span>
          <span>速:${breed.spd}</span>
          <span>体:${breed.stamina}</span>
        </div>
        <div class="caught-skill">${breed.skill}: ${breed.skillDesc}</div>
        ${cageInfo}
        ${isMaster && cricket.bonusCricket ? `
          <div style="margin-top:10px;padding:8px;background:rgba(100,200,150,.15);border-radius:8px;border:1px solid rgba(100,200,150,.3);">
            <div style="font-size:12px;color:#6c9;">🎁  bonus：${cricket.bonusCricket.name}</div>
          </div>
        ` : ''}

        <!-- ── 命名区域 ── -->
        <div style="margin-top:14px;padding:12px;border-radius:10px;background:${isLegend ? 'rgba(180,0,0,.12)' : 'rgba(255,250,230,.15)'};border:1px solid ${isLegend ? 'rgba(255,215,0,.3)' : 'rgba(200,180,100,.25)'}">
          <div style="font-size:12px;color:${isLegend ? '#ffd700' : '#d0b860'};margin-bottom:6px;">✏️ ${isLegend ? '此等神兽，必有威名：' : '给它取个名字吧：'}</div>
          <input id="cgNewCricketName" type="text"
            placeholder="${cricket.name}"
            value="${cricket.name}"
            maxlength="6"
            onkeydown="if(event.key==='Enter')confirmCatchWithName()"
            style="
              width:100%;box-sizing:border-box;
              padding:7px 10px;border-radius:8px;
              border:1px solid rgba(200,180,100,.4);
              background:rgba(30,28,20,.9);color:#f0e6c0;
              font-size:14px;text-align:center;outline:none;
              font-family:inherit;
            "
          />
          <div style="display:flex;gap:6px;margin-top:8px;justify-content:center;">
            <button onclick="confirmCatchWithName()" class="action-btn primary" style="padding:6px 16px;font-size:12px;">
              ✅ 确认名字
            </button>
            <button onclick="document.getElementById('cgNewCricketName').value='${cricket.name}'"
              class="action-btn" style="padding:6px 12px;font-size:11px;background:rgba(80,70,50,.6)">
              🔄 用原名
            </button>
          </div>
        </div>

      </div>
      <div class="success-actions" style="margin-top:10px;">
        ${(CATCH_STATE.attempts < CATCH_STATE.maxAttempts && !fullAfter) ? `
          <button class="action-btn primary" onclick="renderListeningPhase()" style="opacity:.6">
            🔄 继续捕捉（先取名）
          </button>
        ` : ''}
      </div>
    </div>
  `;
  // 聚焦输入框
  setTimeout(() => {
    const input = document.getElementById('cgNewCricketName');
    if(input){ input.focus(); input.select(); }
  }, 100);
}

/**
 * 确认蛐蛐名字 → 真正加入收藏
 */
// 出售蜕壳
function _catchSellShell(value){
  if(typeof edS !== 'undefined'){
    edS.silver = (edS.silver || 0) + value;
    if(typeof editorSave === 'function') editorSave();
  }
  showToast(`💰 蜕壳卖了 ${value} 两`, 'success');
  closeCricketCatch();
}

function confirmCatchWithName(){
  const pending = window.__pendingCricket;
  if(!pending) return;

  // 取用户输入的名字，空则用原名
  let nameInput = document.getElementById('cgNewCricketName');
  const customName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : pending.name;

  // 真正加入收藏
  if(typeof cgAddCricket === 'function'){
    cgAddCricket(pending.breedId, customName, true);
    
    // 捕虫大师：额外加入bonus蛐蛐
    if(pending.bonusCricket){
      cgAddCricket(pending.bonusCricket.breedId, pending.bonusCricket.name, true);
      showToast('🏆 捕虫大师！双蛐入笼！', 'legendary');
    }
  }

  // 清理暂存
  window.__pendingCricket = null;

  // 显示最终确认界面（只读展示）
  renderCatchConfirmed(customName);
}

/**
 * 命名确认后的最终展示
 */
function renderCatchConfirmed(finalName){
  // 从 collection 中找到刚加入的那只（最后一个）
  const cricket = CG.collection[CG.collection.length - 1];
  if(!cricket){ closeCricketCatch(); return; }
  const breed = CRICKET_BREEDS.find(b => b.id === cricket.breedId);

  // 笼位显示
  let totalSlots = 0;
  if(typeof cgGetCageCapacity === 'function'){
    totalSlots = cgGetCageCapacity().slots;
  } else if(typeof craftBagLoad === 'function'){
    const cBag = craftBagLoad();
    for(const cid of ['item_cricket_cage_premium','item_cricket_cage_fine','item_cricket_cage_basic']){
      const item = cBag.find(e => e.id === cid);
      if(item) totalSlots += item.qty;
    }
  }
  const nowCount = CG.collection.length;
  const remain = totalSlots - nowCount;
  const cageInfo = totalSlots > 0
    ? `<div style="font-size:10px;color:rgba(180,200,120,.5);margin-top:4px">🧺 笼位 ${nowCount}/${totalSlots}${remain<=0?'（已满）':''}</div>`
    : '';

  const isLegend = cricket.soundType === 'legendary';
  const container = document.querySelector('.cricket-catch-container');
  container.innerHTML = `
    <div class="catch-header">
      <h2 class="${isLegend ? 'legend-title' : ''}">${isLegend ? '☠ 神兽归位！' : '🎉 捕捉成功！'}</h2>
      <button class="close-btn" onclick="closeCricketCatch()">✕</button>
    </div>
    ${isLegend ? '<div class="legend-banner">恭 喜 获 得 神 兽</div>' : ''}
    <div class="catch-success ${isLegend ? 'legendary-success' : ''}">
      <div class="caught-cricket-art" style="color:${breed.color}">
        ${CRICKET_ART[breed.id]?.stand?.join('\n') || '🦗'}
      </div>
      <div class="caught-info">
        <div class="caught-name" style="color:${breed.fontColor||breed.color}">${finalName}</div>
        <div class="caught-breed">${breed.name} ${'★'.repeat(breed.rare)}</div>
        <div class="caught-traits">
          <span>攻:${breed.atk}</span><span>防:${breed.def}</span>
          <span>速:${breed.spd}</span><span>体:${breed.stamina}</span>
        </div>
        <div class="caught-skill">${breed.skill}: ${breed.skillDesc}</div>
        ${cageInfo}
      </div>
      <div class="success-actions">
        ${(CATCH_STATE.attempts < CATCH_STATE.maxAttempts && remain > 0) ? `
          <button class="action-btn primary" onclick="renderListeningPhase()">
            🔄 继续捕捉
          </button>
        ` : ''}
        <button class="action-btn" onclick="closeCricketCatch()">
          📦 收工
        </button>
      </div>
    </div>
  `;
}

/**
 * 捕捉失败界面
 */
function renderCatchFail() {
  const container = document.querySelector('.cricket-catch-container');
  container.innerHTML = `
    <div class="catch-header">
      <h2>😢 捕捉失败</h2>
      <button class="close-btn" onclick="closeCricketCatch()">✕</button>
    </div>
    <div class="catch-fail">
      <div class="fail-art">💨</div>
      <div class="fail-text">蛐蛐受惊逃走了...</div>
      <div class="fail-actions">
        ${CATCH_STATE.attempts < CATCH_STATE.maxAttempts ? `
          <button class="action-btn primary" onclick="renderListeningPhase()">
            🔄 再试一次
          </button>
        ` : `
          <div class="no-attempts">今日次数已用尽</div>
        `}
        <button class="action-btn" onclick="closeCricketCatch()">
          🔙 离开
        </button>
      </div>
    </div>
  `;
}

/**
 * 关闭捕捉游戏
 */
function closeCricketCatch() {
  // 安全兜底：如果还有未命名的蛐蛐，用原名自动入库
  if(window.__pendingCricket){
    const p = window.__pendingCricket;
    if(typeof cgAddCricket === 'function'){
      cgAddCricket(p.breedId, p.name, true);
    }
    window.__pendingCricket = null;
  }
  catchSoundStop(); // 停止所有音效
  const overlay = document.getElementById('cricketCatchOverlay');
  if (overlay) {
    overlay.remove();
  }
  CATCH_STATE.isActive = false;
}

/**
 * 添加样式
 */
function addCatchStyles() {
  if (document.getElementById('cricketCatchStyles')) return;
  
  const style = document.createElement('style');
  style.id = 'cricketCatchStyles';
  style.textContent = `
    .cricket-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .cricket-catch-container {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid #4a4a6a;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 20px;
      color: #d0d0d0;
    }
    
    .catch-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #4a4a6a;
    }
    
    .catch-header h2 {
      margin: 0;
      color: #ffd080;
      font-size: 20px;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: #888;
      font-size: 20px;
      cursor: pointer;
      padding: 5px 10px;
    }
    
    .close-btn:hover {
      color: #fff;
    }
    
    .catch-scenes {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .scene-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid #4a4a6a;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }
    
    .scene-card:hover {
      background: rgba(255,255,255,0.1);
      border-color: #ffd080;
      transform: translateY(-2px);
    }
    
    .scene-art {
      font-size: 12px;
      line-height: 1.2;
      margin-bottom: 10px;
      color: #888;
      white-space: pre;
      font-family: monospace;
    }
    
    .scene-name {
      font-weight: bold;
      color: #ffd080;
      margin-bottom: 5px;
    }
    
    .scene-desc {
      font-size: 12px;
      color: #888;
    }
    
    .catch-tip {
      text-align: center;
      font-size: 13px;
      color: #888;
      padding: 15px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
    }

    .region-hint {
      text-align: center;
      font-size: 13px;
      color: #b8860b;
      padding: 8px 15px;
      margin: -5px 15px 12px;
      background: rgba(184,134,11,0.08);
      border: 1px dashed rgba(184,134,11,0.3);
      border-radius: 6px;
    }
    .legend-scene {
      border-color: #cc0000 !important;
      background: linear-gradient(135deg, rgba(180,0,0,0.08), rgba(50,0,0,0.12)) !important;
      box-shadow: 0 0 12px rgba(180,0,0,0.25);
      animation: legendPulse 2s ease-in-out infinite;
    }
    @keyframes legendPulse {
      0%, 100% { box-shadow: 0 0 12px rgba(180,0,0,0.25); }
      50% { box-shadow: 0 0 20px rgba(180,0,0,0.45); }
    }
    .legend-art {
      color: #ffd700;
      text-shadow: 0 0 8px rgba(255,215,0,0.6);
      font-size: 11px;
    }
    .legend-title {
      color: #ffd700;
      text-shadow: 0 0 6px rgba(255,215,0,0.5);
    }
    .legend-banner {
      background: linear-gradient(90deg, transparent, rgba(180,0,0,0.15), transparent);
      border-top: 1px solid rgba(180,0,0,0.3);
      border-bottom: 1px solid rgba(180,0,0,0.3);
      padding: 6px 15px;
      text-align: center;
      font-size: 14px;
      color: #ffd700;
      letter-spacing: 2px;
    }
    .legendary-success {
      background: linear-gradient(180deg, rgba(180,0,0,0.12) 0%, rgba(50,0,0,0.08) 100%) !important;
      animation: legendaryReveal 0.8s ease-out;
    }
    @keyframes legendaryReveal {
      0%   { transform: scale(0.85); opacity: 0; filter: brightness(3); }
      50%  { transform: scale(1.05); filter: brightness(1.5); }
      100% { transform: scale(1); opacity: 1; filter: brightness(1); }
    }

    .listening-phase, .catching-phase, .catch-success, .catch-fail {
      text-align: center;
    }
    
    .scene-display {
      font-size: 14px;
      line-height: 1.3;
      margin: 20px 0;
      color: #888;
      white-space: pre;
      font-family: monospace;
    }
    
    .sound-indicator {
      margin: 20px 0;
      padding: 20px;
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
    }
    
    .sound-wave {
      font-size: 24px;
      margin-bottom: 10px;
      animation: soundWave 1s ease-in-out infinite;
    }
    
    @keyframes soundWave {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }
    
    .sound-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .sound-desc {
      font-size: 13px;
      opacity: 0.8;
    }
    
    .listen-actions, .success-actions, .fail-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 20px;
    }
    
    .action-btn {
      padding: 12px 24px;
      border: 1px solid #4a4a6a;
      background: rgba(255,255,255,0.05);
      color: #d0d0d0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .action-btn:hover {
      background: rgba(255,255,255,0.1);
    }
    
    .action-btn.primary {
      background: linear-gradient(135deg, #4a4a6a 0%, #5a5a8a 100%);
      border-color: #ffd080;
      color: #ffd080;
    }
    
    .action-btn.primary:hover {
      background: linear-gradient(135deg, #5a5a8a 0%, #6a6a9a 100%);
    }
    
    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .catch-instruction {
      font-size: 14px;
      color: #888;
      margin-bottom: 20px;
    }
    
    .catch-game {
      margin: 20px 0;
    }
    
    .cricket-target {
      font-size: 48px;
      margin-bottom: 20px;
    }
    
    .catch-zone {
      position: relative;
      width: 200px;
      height: 60px;
      margin: 0 auto 20px;
      background: rgba(255,255,255,0.05);
      border-radius: 30px;
      overflow: hidden;
    }
    
    .target-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border: 3px solid #ffd080;
      border-radius: 50%;
      opacity: 0.6;
    }
    
    .moving-cursor {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, #ffd080 0%, transparent 70%);
      border-radius: 50%;
      left: 10px;
    }
    
    @keyframes cursorMove {
      0%, 100% { left: 10px; }
      50% { left: calc(100% - 40px); }
    }
    
    .catch-btn {
      padding: 15px 40px;
      font-size: 16px;
      background: linear-gradient(135deg, #4a4a6a 0%, #5a5a8a 100%);
      border: 2px solid #ffd080;
      color: #ffd080;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .catch-btn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(255,208,128,0.3);
    }
    
    .catch-btn:active:not(:disabled) {
      transform: scale(0.95);
    }
    
    .catch-progress {
      margin-top: 15px;
      font-size: 13px;
      color: #888;
    }
    
    .caught-cricket-art {
      font-size: 16px;
      line-height: 1.3;
      margin: 20px 0;
      white-space: pre;
      font-family: monospace;
    }
    
    .caught-info {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }
    
    .caught-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .caught-breed {
      font-size: 14px;
      color: #888;
      margin-bottom: 15px;
    }
    
    .caught-traits {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 13px;
    }
    
    .caught-traits span {
      background: rgba(255,255,255,0.1);
      padding: 5px 10px;
      border-radius: 4px;
    }
    
    .caught-skill {
      font-size: 13px;
      color: #ffd080;
      padding-top: 15px;
      border-top: 1px solid #4a4a6a;
    }
    
    .fail-art {
      font-size: 64px;
      margin: 30px 0;
    }
    
    .fail-text {
      font-size: 16px;
      color: #888;
      margin-bottom: 20px;
    }
    
    .no-attempts {
      color: #888;
      font-size: 13px;
      padding: 10px;
    }
  `;
  
  document.head.appendChild(style);
}

// 导出函数
window.openCricketCatchGame = openCricketCatchGame;
window.closeCricketCatch = closeCricketCatch;
window.selectCatchScene = selectCatchScene;
window.renderListeningPhase = renderListeningPhase;
window.startCatching = startCatching;
window.attemptCatch = attemptCatch;
window.catchSoundStop = catchSoundStop;
window.confirmCatchWithName = confirmCatchWithName;
