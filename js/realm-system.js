// realm-system.js — 境界系统：真气积累 + 突破 + 称号 + 属性加成
// 独立于等级系统（Lv1-120）的另一条成长线
// 境界描述：后天境 → 先天境 → 宗师境 → 大宗师境 → 天人境

// ══════════════════════════════════════════════
// 1. 境界定义表
// ══════════════════════════════════════════════
const REALM_STAGES = [
  // ── 后天境（Lv1起）──
  {
    realm: 0,
    name: '后天境',
    desc: '打通奇经八脉之前的凡人阶段',
    phases: [
      { phase: 0, label:'初期', short:'后初', qiNeed: 0,    attrBonus:{ atk:0,  def:0,  hp:0,   mp:0,   dodge:0,  crit:0   } },
      { phase: 1, label:'中期', short:'后中', qiNeed: 500,  attrBonus:{ atk:2,  def:1,  hp:30,  mp:20,  dodge:0.3, crit:0.2 } },
      { phase: 2, label:'后期', short:'后后', qiNeed: 1200, attrBonus:{ atk:5,  def:2,  hp:70,  mp:50,  dodge:0.8, crit:0.5 } },
    ],
  },
  // ── 先天境（需境界突破）──
  {
    realm: 1,
    name: '先天境',
    desc: '内功初成，真气可流转于奇经八脉之间',
    phases: [
      { phase: 0, label:'初期', short:'先初', qiNeed: 2500,  attrBonus:{ atk:10, def:5,  hp:150, mp:120, dodge:1.5, crit:1.0 } },
      { phase: 1, label:'中期', short:'先中', qiNeed: 4500,  attrBonus:{ atk:18, def:10, hp:280, mp:220, dodge:2.5, crit:1.8 } },
      { phase: 2, label:'后期', short:'先后', qiNeed: 7500,  attrBonus:{ atk:28, def:18, hp:450, mp:360, dodge:4.0, crit:3.0 } },
    ],
  },
  // ── 宗师境──
  {
    realm: 2,
    name: '宗师境',
    desc: '开宗立派，一代宗师的门槛',
    phases: [
      { phase: 0, label:'初期', short:'宗初', qiNeed: 12000, attrBonus:{ atk:40,  def:28, hp:680,  mp:560,  dodge:6.0, crit:4.5 } },
      { phase: 1, label:'中期', short:'宗中', qiNeed: 20000, attrBonus:{ atk:55,  def:40, hp:950,  mp:800,  dodge:8.5, crit:6.5 } },
      { phase: 2, label:'后期', short:'宗后', qiNeed: 32000, attrBonus:{ atk:75,  def:58, hp:1280, mp:1080, dodge:11.5,crit:9.0 } },
    ],
  },
  // ── 大宗师境──
  {
    realm: 3,
    name: '大宗师境',
    desc: '武学一道，已臻化境，俯瞰众生',
    phases: [
      { phase: 0, label:'初期', short:'大初', qiNeed: 50000,  attrBonus:{ atk:100, def:80,  hp:1700, mp:1450, dodge:15.0, crit:12.0 } },
      { phase: 1, label:'中期', short:'大中', qiNeed: 85000,  attrBonus:{ atk:130, def:110, hp:2200, mp:1900, dodge:19.0, crit:15.5 } },
      { phase: 2, label:'后期', short:'大后', qiNeed: 140000, attrBonus:{ atk:165, def:145, hp:2800, mp:2450, dodge:24.0, crit:20.0 } },
    ],
  },
  // ── 天人境──
  {
    realm: 4,
    name: '天人境',
    desc: '天人合一，天地间再无敌手',
    phases: [
      { phase: 0, label:'初期', short:'天初', qiNeed: 220000, attrBonus:{ atk:210, def:190, hp:3500, mp:3100, dodge:30.0, crit:26.0 } },
      { phase: 1, label:'大圆满', short:'圆满', qiNeed: Infinity, attrBonus:{ atk:270, def:250, hp:4400, mp:4000, dodge:38.0, crit:34.0 } },
    ],
  },
];

// ══════════════════════════════════════════════
// 2. 境界状态管理
// ══════════════════════════════════════════════
// edS.realm     = { realm:0, phase:0, qi:0 }  // 当前境界
// edS.realm     = null                         // 未初始化（兼容旧存档）

const MAX_REALM = 4; // 天人境是最高境界

// ── 获取当前境界配置 ──
function getCurrentRealmCfg(){
  if(typeof edS === 'undefined' || !edS.realm) return REALM_STAGES[0].phases[0];
  const r = Math.min(edS.realm.realm, MAX_REALM);
  const p = Math.min(edS.realm.phase, REALM_STAGES[r].phases.length - 1);
  return REALM_STAGES[r].phases[p];
}

// ── 获取当前境界阶段配置（含下一阶段预告）──
function getRealmPhaseInfo(){
  if(typeof edS === 'undefined' || !edS.realm) {
    return {
      realmName: REALM_STAGES[0].name,
      phaseName: REALM_STAGES[0].phases[0].label,
      shortName: REALM_STAGES[0].phases[0].short,
      current:   REALM_STAGES[0].phases[0],
      next:      REALM_STAGES[0].phases[1] || null,
      qi:        0,
      qiNeed:    REALM_STAGES[0].phases[0].qiNeed,
      qiProgress: 0,
      isMax:     false,
    };
  }
  const cfg = getCurrentRealmCfg();
  const qi   = edS.realm.qi || 0;
  const next = _getNextPhase();
  return {
    realmName: REALM_STAGES[edS.realm.realm].name,
    phaseName: cfg.label,
    shortName: cfg.short,
    current:   cfg,
    next:      next,
    qi:        qi,
    qiNeed:    cfg.qiNeed,
    qiProgress: cfg.qiNeed === Infinity ? 1 : Math.min(1, qi / cfg.qiNeed),
    isMax:     edS.realm.realm === MAX_REALM && edS.realm.phase >= REALM_STAGES[MAX_REALM].phases.length - 1,
  };
}

function _getNextPhase(){
  if(typeof edS === 'undefined' || !edS.realm) return REALM_STAGES[0].phases[1] || null;
  const r = edS.realm.realm;
  const p = edS.realm.phase;
  const realmCfg = REALM_STAGES[r];
  if(p + 1 < realmCfg.phases.length) return realmCfg.phases[p + 1];
  if(r + 1 < REALM_STAGES.length) return REALM_STAGES[r + 1].phases[0];
  return null; // 已达最高
}

// ── 境界属性加成（供 edStats / battle.js 调用）──
function getRealmAttrBonus(){
  const cfg = getCurrentRealmCfg();
  return cfg.attrBonus || { atk:0, def:0, hp:0, mp:0, dodge:0, crit:0 };
}

// ══════════════════════════════════════════════
// 3. 真气积累（addRealmQi）
// ══════════════════════════════════════════════
// source: 'battle' | 'manual' | 'cultivate' | 'event' | 'item'
function addRealmQi(amount, source){
  if(typeof edS === 'undefined') return;
  if(!edS.realm) _initRealm();

  // 已在最高境界大圆满，不增加
  if(edS.realm.realm === MAX_REALM && edS.realm.phase >= REALM_STAGES[MAX_REALM].phases.length - 1) return;

  const oldQi = edS.realm.qi || 0;
  const oldRealm = edS.realm.realm;
  const oldPhase = edS.realm.phase;

  edS.realm.qi = Math.max(0, (edS.realm.qi || 0) + amount);

  // 实时保存
  _saveRealmState();

  // 触发UI刷新
  if(typeof renderRealmUI === 'function') renderRealmUI();

  const info = getRealmPhaseInfo();

  // 真气获取提示（小声提示，不打断）
  if(typeof showToast === 'function' && amount > 0){
    const toast = document.getElementById('travelSection')?.style.display !== 'none' ? true : false;
    if(toast){
      // 旅行中，显示微小提示
      _flashRealmQiHUD(amount);
    }
  }

  console.log(`[addRealmQi] +${amount}（${source}）境界:${REALM_STAGES[oldRealm].name}${info.phaseName} 真气${oldQi}→${edS.realm.qi}`);
}

// 真气HUD闪烁（旅行中右下角提示）
function _flashRealmQiHUD(amount){
  const hud = document.getElementById('realmQiFlash');
  if(!hud){
    const el = document.createElement('div');
    el.id = 'realmQiFlash';
    el.style.cssText = `
      position:fixed;bottom:80px;right:12px;z-index:8888;
      font-size:11px;color:#88ddff;background:rgba(0,30,60,.7);
      border:1px solid rgba(100,200,255,.3);border-radius:8px;
      padding:4px 10px;pointer-events:none;opacity:0;transition:opacity .3s;
      letter-spacing:1px;font-family:'Courier New',monospace;
    `;
    document.body.appendChild(el);
  }
  const hudEl = document.getElementById('realmQiFlash');
  hudEl.textContent = `💠 +${amount} 真气`;
  hudEl.style.opacity = '1';
  clearTimeout(hudEl._timer);
  hudEl._timer = setTimeout(()=>{ hudEl.style.opacity = '0'; }, 1800);
}

// ── 突破尝试（attemptRealmBreakthrough）──
function attemptRealmBreakthrough(){
  if(typeof edS === 'undefined') return;
  if(!edS.realm) _initRealm();

  const info = getRealmPhaseInfo();

  // 检查是否已满足突破条件
  if(info.isMax){
    showToast('已达最高境界！', 'info');
    return;
  }
  if(edS.realm.qi < info.qiNeed){
    showToast(`真气不足（${info.qiNeed - edS.realm.qi}），无法突破！`, 'warn');
    return;
  }

  // 计算突破成功率
  const baseChance = 0.60; // 基础60%
  const levelBonus = Math.min(0.30, (edS.level || 1) * 0.004); // 等级加成，每级+0.4%，最高+30%
  const successChance = Math.min(0.92, baseChance + levelBonus);

  // 突破判定
  const roll = Math.random();
  const success = roll < successChance;

  if(success){
    _doRealmBreakthrough(successChance, getRealmPhaseInfo());
  } else {
    _doRealmBreakthroughFail(successChance);
  }
}

// 突破成功
function _doRealmBreakthrough(successChance, oldInfo){
  if(typeof edS === 'undefined') return;
  const old = oldInfo || getRealmPhaseInfo();

  // 消耗真气（保留5%残余）
  edS.realm.qi = Math.floor(edS.realm.qi * 0.05);

  // 境界提升
  const next = _getNextPhase();
  if(!next){
    // 最高境界
    edS.realm.phase++;
  } else {
    // 正常推进
    const curPhaseIdx = REALM_STAGES[edS.realm.realm].phases.findIndex(p => p.label === old.phaseName);
    if(curPhaseIdx < REALM_STAGES[edS.realm.realm].phases.length - 1){
      edS.realm.phase++;
    } else {
      // 进入新境界
      edS.realm.realm++;
      edS.realm.phase = 0;
    }
  }

  // 属性加成：突破后回血回蓝
  if(typeof edStats === 'function'){
    const newStats = edStats();
    const oldMaxHp = edS.maxHp || newStats.hp;
    const oldMaxMp = edS.maxMp || newStats.mp;
    edS.maxHp = newStats.hp;
    edS.maxMp = newStats.mp;
    edS.hp = Math.min(edS.maxHp, edS.hp + Math.round((edS.maxHp - oldMaxHp) * 0.8));
    edS.mp = Math.min(edS.maxMp, edS.mp + Math.round((edS.maxMp - oldMaxMp) * 0.8));
  }

  _saveRealmState();

  // 播放突破成功动画
  _showRealmBreakthroughEffect(old, getRealmPhaseInfo(), true, successChance);

  // 提示系统检查
  if(typeof checkTips === 'function') setTimeout(() => checkTips(), 1000);
}

// 突破失败
function _doRealmBreakthroughFail(successChance){
  if(typeof edS === 'undefined') return;

  // 消耗真气（50%损失）
  const lost = Math.floor(edS.realm.qi * 0.5);
  edS.realm.qi -= lost;

  // 气血内伤（当前值的15%）
  if(edS.hp) edS.hp = Math.max(1, Math.floor(edS.hp * 0.85));
  if(edS.mp) edS.mp = Math.max(0, Math.floor((edS.mp || 0) * 0.85));

  _saveRealmState();
  if(typeof renderRealmUI === 'function') renderRealmUI();

  showToast(`突破失败！内息受损，真气-${lost}，气血-15%`, 'warn');
  if(typeof playAudio === 'function') playAudio('fail');
}

// ══════════════════════════════════════════════
// 4. 突破动画（华丽版）
// ══════════════════════════════════════════════
function _showRealmBreakthroughEffect(oldInfo, newInfo, success, chance){
  if(typeof playAudio === 'function') playAudio(success ? 'realm_breakthrough' : 'fail');

  // ── 全屏气场爆炸 ──
  const flashOv = document.createElement('div');
  flashOv.id = 'realm-flash-ov';
  const colors = success
    ? ['rgba(120,255,200,.5)','rgba(80,200,255,.3)','transparent']
    : ['rgba(255,80,80,.4)','rgba(255,100,50,.2)','transparent'];
  flashOv.style.cssText = `
    position:fixed;inset:0;z-index:9990;pointer-events:none;
    background:radial-gradient(circle at center, ${colors[0]} 0%, ${colors[1]} 40%, ${colors[2]} 75%);
    opacity:0;transition:opacity .2s;
  `;
  document.body.appendChild(flashOv);
  requestAnimationFrame(()=>{
    flashOv.style.opacity = '1';
    setTimeout(()=> flashOv.style.opacity='0', 400);
    setTimeout(()=> flashOv.remove(), 700);
  });

  if(!success) return; // 失败不需要弹窗

  // ── 境界突破弹窗 ──
  const ov = document.createElement('div');
  ov.id = 'realm-modal';
  ov.style.cssText = `
    position:fixed;inset:0;z-index:9995;
    background:rgba(0,0,0,.92);
    display:flex;align-items:center;justify-content:center;
    opacity:0;transition:opacity .4s;
    font-family:'Courier New',monospace;
  `;

  const realmColor = _getRealmColor(newInfo.realmName);
  const realmIcon  = _getRealmIcon(newInfo.realmName);

  ov.innerHTML = `
    <div id="realm-box" style="
      background:linear-gradient(160deg,rgba(8,12,20,.98),rgba(4,8,15,.99));
      border:2px solid ${realmColor}88;
      border-radius:18px;padding:32px 28px 24px;max-width:360px;width:92%;
      box-shadow:0 0 80px ${realmColor}33,0 0 30px ${realmColor}22,0 8px 40px rgba(0,0,0,.7);
      text-align:center;
      transform:scale(.3) rotateY(90deg);opacity:0;
      transition:transform .7s cubic-bezier(.175,.885,.32,1.275), opacity .5s;
    ">
      <!-- 气场光晕 -->
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:200px;height:200px;border-radius:50%;
        background:radial-gradient(circle,${realmColor}22 0%,transparent 70%);
        pointer-events:none;
      "></div>

      <div style="font-size:10px;letter-spacing:7px;color:${realmColor}88;margin-bottom:10px;">— 境界突破 —</div>

      <!-- 新境界名 -->
      <div style="font-size:28px;letter-spacing:6px;color:${realmColor};font-weight:bold;
                  text-shadow:0 0 30px ${realmColor}99,0 0 60px ${realmColor}55;
                  animation:realmGlow 2s ease-in-out infinite alternate;">
        ${realmIcon} ${newInfo.realmName} <span style="font-size:20px;">${newInfo.phaseName}</span>
      </div>

      <!-- 箭头 -->
      <div style="margin:12px 0;font-size:24px;color:${realmColor}66;">
        ▲
      </div>

      <!-- 旧境界 -->
      <div style="font-size:14px;letter-spacing:4px;color:rgba(160,160,140,.5);margin-bottom:4px;">
        ${oldInfo.realmName} ${oldInfo.phaseName}
      </div>

      <!-- 属性加成 -->
      <div style="width:80%;height:1px;background:${realmColor}44;margin:16px auto;"></div>
      <div style="font-size:11px;letter-spacing:3px;color:${realmColor}99;margin-bottom:10px;">✦ 境界属性加成 ✦</div>
      <div style="font-size:12px;color:rgba(200,200,180,.85);line-height:2.2;letter-spacing:2px;">
        <div>⚔ 攻击 <span style="color:#ffaa44">+${(newInfo.current.attrBonus.atk - oldInfo.current.attrBonus.atk).toFixed(0)}</span></div>
        <div>🛡 防御 <span style="color:#44ccff">+${(newInfo.current.attrBonus.def - oldInfo.current.attrBonus.def).toFixed(0)}</span></div>
        <div>❤ 气血 <span style="color:#ff8888">+${(newInfo.current.attrBonus.hp - oldInfo.current.attrBonus.hp).toFixed(0)}</span></div>
        <div>💙 内力 <span style="color:#88aaff">+${(newInfo.current.attrBonus.mp - oldInfo.current.attrBonus.mp).toFixed(0)}</span></div>
        <div>⚡ 闪避 <span style="color:#88ffaa">+${(newInfo.current.attrBonus.dodge - oldInfo.current.attrBonus.dodge).toFixed(1)}%</span></div>
        <div>💥 暴击 <span style="color:#ff88ff">+${(newInfo.current.attrBonus.crit - oldInfo.current.attrBonus.crit).toFixed(1)}%</span></div>
      </div>

      <!-- 成功率提示 -->
      <div style="margin-top:10px;font-size:10px;color:rgba(150,150,130,.4);letter-spacing:2px;">
        突破成功率 ${(chance * 100).toFixed(0)}%
      </div>

      <!-- 境界描述 -->
      <div style="
        margin:14px 4px 0;
        font-size:11px;color:rgba(180,180,160,.5);
        font-style:italic;letter-spacing:1px;
        line-height:1.8;border-top:1px solid ${realmColor}22;padding-top:10px;
      ">${(()=>{
        const idx = newInfo.realmName === oldInfo.realmName
          ? newInfo.realm
          : _getRealmIndex(newInfo.realmName);
        const stage = REALM_STAGES[idx];
        return stage ? stage.desc : '';
      })()}</div>

      <button id="realm-close-btn" style="
        margin-top:18px;
        background:${realmColor}22;
        border:1px solid ${realmColor}66;
        border-radius:10px;color:${realmColor};
        padding:10px 36px;font-size:13px;letter-spacing:5px;
        cursor:pointer;transition:background .2s;
      ">踏入新境界</button>
    </div>
  `;
  document.body.appendChild(ov);

  // 动画
  requestAnimationFrame(()=>{
    ov.style.opacity = '1';
    const box = document.getElementById('realm-box');
    if(box){
      requestAnimationFrame(()=>{
        box.style.transform = 'scale(1) rotateY(0)';
        box.style.opacity = '1';
      });
    }
  });

  // 粒子爆发
  setTimeout(()=>{ _realmBreakthroughParticles(realmColor); }, 400);

  // 关闭
  setTimeout(()=>{
    const btn = document.getElementById('realm-close-btn');
    if(btn) btn.addEventListener('click', ()=> ov.remove());
    setTimeout(()=>{ if(ov.parentNode) ov.remove(); }, 8000);
  }, 200);

  // CSS注入
  if(!document.getElementById('realm-keyframes')){
    const st = document.createElement('style');
    st.id = 'realm-keyframes';
    st.textContent = `
@keyframes realmGlow {
  0%  { text-shadow: 0 0 30px currentColor, 0 0 60px currentColor; }
  100%{ text-shadow: 0 0 50px currentColor, 0 0 100px currentColor, 0 0 150px currentColor; }
}
@keyframes realmParticleFall {
  0%  { transform: translateY(-20px) scale(1); opacity:1; }
  100%{ transform: translateY(120vh) scale(.3); opacity:0; }
}
@keyframes realmRingExpand {
  0%  { transform:translate(-50%,-50%) scale(.2); opacity:.8; }
  100%{ transform:translate(-50%,-50%) scale(3); opacity:0; }
}
    `;
    document.head.appendChild(st);
  }

  // 刷新UI
  setTimeout(()=>{
    if(typeof renderRealmUI === 'function') renderRealmUI();
    if(typeof renderPlayerExpBar === 'function') renderPlayerExpBar();
  }, 300);
}

function _realmBreakthroughParticles(color){
  const syms = ['✦','★','◆','⬡','💠','◈','✸','◇'];
  const colors = [color, '#ffffff', '#88ffdd', '#ffffa0'];
  for(let i = 0; i < 50; i++){
    setTimeout(()=>{
      const p = document.createElement('div');
      const angle = (i / 50) * Math.PI * 2;
      const dist   = 30 + Math.random() * 60;
      const cx = 50 + Math.cos(angle) * dist;
      const cy = 50 + Math.sin(angle) * dist;
      p.style.cssText = `
        position:fixed;
        left:${cx}%;
        top:${cy}%;
        font-size:${8 + Math.random()*14}px;
        color:${colors[Math.floor(Math.random()*colors.length)]};
        pointer-events:none;z-index:9996;
        animation:realmParticleFall ${1.2+Math.random()*1.5}s ease-out forwards;
      `;
      p.textContent = syms[Math.floor(Math.random()*syms.length)];
      document.body.appendChild(p);
      setTimeout(()=>{ if(p.parentNode) p.remove(); }, 2800);
    }, i * 30);
  }
}

function _getRealmColor(name){
  const map = {
    '后天境': '#88cc88',
    '先天境': '#88aaff',
    '宗师境': '#ddaa66',
    '大宗师境': '#cc66ff',
    '天人境': '#ffdd44',
  };
  return map[name] || '#88cc88';
}

function _getRealmIcon(name){
  const map = {
    '后天境': '🌱',
    '先天境': '🌊',
    '宗师境': '⚔',
    '大宗师境': '👑',
    '天人境': '✨',
  };
  return map[name] || '◆';
}

function _getRealmIndex(name){
  return REALM_STAGES.findIndex(r => r.name === name);
}

// ══════════════════════════════════════════════
// 5. UI渲染（renderRealmUI）
// ══════════════════════════════════════════════
// town.html 中的 #realmStatusBar 由此函数驱动
function renderRealmUI(){
  if(typeof edS === 'undefined') return;

  const info = getRealmPhaseInfo();
  const realmColor = _getRealmColor(info.realmName);
  const qiPct = Math.min(100, info.qiProgress * 100).toFixed(1);

  // ── 城镇状态栏境界区块 ──
  const el = document.getElementById('realmStatusBar');
  if(el){
    const canBreak = !info.isMax && info.qi >= info.qiNeed;
    const breakBtnVisible = canBreak;

    el.innerHTML = `
      <div class="realm-bar-wrap" style="margin-top:4px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
          <span style="font-size:11px;color:${realmColor};letter-spacing:1px;">${_getRealmIcon(info.realmName)} ${info.realmName}${info.phaseName}</span>
          <span style="font-size:10px;color:rgba(180,180,160,.5);">${info.qi.toLocaleString()} / ${info.qiNeed === Infinity ? '∞' : info.qiNeed.toLocaleString()}</span>
          ${breakBtnVisible ? `
            <button onclick="attemptRealmBreakthrough()" class="realm-break-btn" style="
              margin-left:auto;padding:2px 8px;font-size:10px;
              background:rgba(255,200,80,.15);border:1px solid rgba(255,200,80,.4);
              border-radius:6px;color:#ffd060;cursor:pointer;letter-spacing:1px;
              transition:background .2s;
            ">⚡ 突破</button>
          ` : ''}
        </div>
        <div class="tsb-bar-wrap" style="height:6px;">
          <div class="realm-bar-fill" style="
            height:100%;border-radius:3px;width:${qiPct}%;
            background:linear-gradient(90deg,${realmColor}88,${realmColor});
            transition:width .5s;
            box-shadow:0 0 6px ${realmColor}66;
          "></div>
        </div>
        ${info.next && !info.isMax ? `
          <div style="font-size:9px;color:rgba(160,160,140,.3);letter-spacing:1px;margin-top:2px;">
            突破至：${info.next.label}（需${info.next.qiNeed.toLocaleString()}真气）
          </div>
        ` : ''}
      </div>
    `;

    // 注册突破按钮hover效果
    setTimeout(()=>{
      const btn = el.querySelector('.realm-break-btn');
      if(btn){
        btn.addEventListener('mouseover', ()=> btn.style.background='rgba(255,200,80,.3)');
        btn.addEventListener('mouseout',  ()=> btn.style.background='rgba(255,200,80,.15)');
      }
    }, 100);
  }

  // ── 战斗页面境界显示（battle.js 中）──
  const battleEl = document.getElementById('realmBattleBadge');
  if(battleEl){
    battleEl.textContent = `${_getRealmIcon(info.realmName)}${info.realmName}${info.phaseName}`;
    battleEl.style.color = realmColor;
  }
}

// ── 城镇状态栏注入点（在 town.html 的属性行末尾追加境界条）──
function injectRealmStatusBar(){
  const statRow = document.querySelector('.tsb-row2');
  if(!statRow) return;
  // 避免重复注入
  if(document.getElementById('realmStatusBar')) return;
  const wrap = document.createElement('div');
  wrap.id = 'realmStatusBar';
  wrap.style.cssText = 'width:100%;margin-top:2px;';
  statRow.parentNode.insertBefore(wrap, statRow.nextSibling);
}

// ══════════════════════════════════════════════
// 6. 真气获取来源配置
// ══════════════════════════════════════════════
// 被 level-system.js / npc-combat.js 调用
const REALM_QI_SOURCES = {
  // 战斗胜利：基础值 + 等级差奖励 + tier奖励
  battleWin: (targetLevel, targetTier) => {
    const tierBonus = { func:1, major:1.8, elite:3.5 }[targetTier] || 1;
    const diffBonus = Math.max(0, targetLevel - (edS.level || 1)) * 2;
    return Math.round((8 + diffBonus) * tierBonus);
  },
  // 修炼功法（每次修炼完成）
  manualPractice: (manualLevel) => Math.round(5 + manualLevel * 3),
  // 特殊地点打坐
  specialLocationCultivate: () => Math.round(20 + Math.random() * 30),
  // 城市奇遇/事件
  eventBonus: (value) => Math.round(value * 0.5),
};

// ══════════════════════════════════════════════
// 7. 存档管理
// ══════════════════════════════════════════════
function _initRealm(){
  if(typeof edS === 'undefined') return;
  if(!edS.realm){
    // 先尝试从存档恢复，避免用默认值覆盖玩家已突破的境界
    try {
      const candidates = [
        localStorage.getItem('wuxia_editor'),
        localStorage.getItem('wuxia_player_profile'),
        localStorage.getItem('wuxia_player_progress'),
      ];
      for(const raw of candidates){
        if(!raw) continue;
        const data = JSON.parse(raw);
        if(data && data.realm && typeof data.realm.realm === 'number'){
          edS.realm = data.realm;
          console.log('[_initRealm] 从存档恢复境界:', JSON.stringify(edS.realm));
          return;
        }
      }
    } catch(e) {}
    // 所有存档均无境界数据，使用默认值
    edS.realm = { realm:0, phase:0, qi:0 };
  }
}

function _saveRealmState(){
  if(typeof edS === 'undefined') return;
  _initRealm();
  try{
    // 保存到 wuxia_editor
    const edRaw = localStorage.getItem('wuxia_editor');
    if(edRaw){
      const ed = JSON.parse(edRaw);
      ed.realm = edS.realm;
      localStorage.setItem('wuxia_editor', JSON.stringify(ed));
    }
    // 保存到 wuxia_player_profile
    const pfRaw = localStorage.getItem('wuxia_player_profile');
    if(pfRaw){
      const pf = JSON.parse(pfRaw);
      pf.realm = edS.realm;
      localStorage.setItem('wuxia_player_profile', JSON.stringify(pf));
    }
    // 保存到 wuxia_player_progress
    const pgRaw = localStorage.getItem('wuxia_player_progress');
    if(pgRaw){
      const pg = JSON.parse(pgRaw);
      pg.realm = edS.realm;
      localStorage.setItem('wuxia_player_progress', JSON.stringify(pg));
    }
  }catch(e){
    console.error('[realm] 保存失败:', e);
  }
}

function loadRealmState(){
  if(typeof edS === 'undefined') return;
  try{
    const candidates = [
      localStorage.getItem('wuxia_editor'),
      localStorage.getItem('wuxia_player_profile'),
      localStorage.getItem('wuxia_player_progress'),
    ];
    for(const raw of candidates){
      if(!raw) continue;
      try{
        const data = JSON.parse(raw);
        if(data && data.realm && typeof data.realm.realm === 'number'){
          edS.realm = data.realm;
          return;
        }
      }catch(e){}
    }
    // 无存档，默认后天初期
    edS.realm = { realm:0, phase:0, qi:0 };
  }catch(e){
    edS.realm = { realm:0, phase:0, qi:0 };
  }
}

// ══════════════════════════════════════════════
// 8. 境界名称（用于显示）
// ══════════════════════════════════════════════
function getRealmFullName(){
  if(typeof edS === 'undefined' || !edS.realm) return '后天境初期';
  const r = Math.min(edS.realm.realm, MAX_REALM);
  const p = Math.min(edS.realm.phase, REALM_STAGES[r].phases.length - 1);
  return REALM_STAGES[r].name + REALM_STAGES[r].phases[p].label;
}

function getRealmShortName(){
  if(typeof edS === 'undefined' || !edS.realm) return '后初';
  const r = Math.min(edS.realm.realm, MAX_REALM);
  const p = Math.min(edS.realm.phase, REALM_STAGES[r].phases.length - 1);
  return REALM_STAGES[r].phases[p].short;
}

// ── 兼容性别名 ──
window.addRealmQi    = addRealmQi;
window.realmBreakthrough = attemptRealmBreakthrough;
window.renderRealmUI = renderRealmUI;
window.loadRealmState = loadRealmState;

// ══════════════════════════════════════════════
// 9. 闭关修炼（城市/野外可用，花精力换真气）
// ══════════════════════════════════════════════
// 调用方式：闭关修炼按钮 或 城市服务入口
function openCultivateDialog(){
  if(typeof edS === 'undefined') return;
  const info = getRealmPhaseInfo();
  if(info.isMax){
    showToast('已达最高境界！', 'info');
    return;
  }

  const realmColor = _getRealmColor(info.realmName);
  const qiLeft = info.qiNeed - (edS.realm?.qi || 0);
  const energyCost = 15; // 每次消耗精力

  const html = `
    <div style="
      background:linear-gradient(160deg,rgba(8,15,25,.97),rgba(4,10,20,.99));
      border:1px solid ${realmColor}66;
      border-radius:14px;padding:24px 20px 20px;max-width:300px;width:92%;
      text-align:center;font-family:'Courier New',monospace;
    ">
      <div style="font-size:10px;letter-spacing:5px;color:${realmColor}88;margin-bottom:8px;">— 闭关修炼 —</div>
      <div style="font-size:18px;color:${realmColor};letter-spacing:3px;margin-bottom:4px;">
        ${_getRealmIcon(info.realmName)} ${info.realmName}${info.phaseName}
      </div>
      <div style="font-size:11px;color:rgba(160,180,160,.6);margin-bottom:16px;letter-spacing:1px;">
        真气 ${(edS.realm?.qi||0).toLocaleString()} / ${info.qiNeed.toLocaleString()}
      </div>
      <div style="font-size:12px;color:rgba(180,200,180,.75);line-height:2;letter-spacing:1px;margin-bottom:16px;">
        消耗 ⚡${energyCost} 精力，获得 💠 真气<br>
        剩余真气需求：${qiLeft.toLocaleString()}
      </div>
      <div style="display:flex;gap:10px;justify-content:center;">
        <button id="cultivateOnceBtn" onclick="doCultivateOnce()" style="
          flex:1;padding:10px 16px;background:${realmColor}22;
          border:1px solid ${realmColor}66;border-radius:8px;
          color:${realmColor};font-size:12px;letter-spacing:2px;cursor:pointer;
        ">闭关一次</button>
        <button onclick="doCultivateTen()" style="
          flex:1;padding:10px 16px;background:${realmColor}15;
          border:1px solid ${realmColor}44;border-radius:8px;
          color:${realmColor}aa;font-size:12px;letter-spacing:2px;cursor:pointer;
        ">闭关十次</button>
      </div>
      <div id="cultivateMsg" style="margin-top:12px;font-size:11px;color:rgba(180,180,160,.5);letter-spacing:1px;"></div>
    </div>
  `;

  // 覆盖层
  const ov = document.createElement('div');
  ov.id = 'cultivate-ov';
  ov.style.cssText = 'position:fixed;inset:0;z-index:8990;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;';
  ov.innerHTML = html;
  document.body.appendChild(ov);
  ov.addEventListener('click', (e)=>{ if(e.target===ov) ov.remove(); });
}

function doCultivateOnce(){
  if(typeof travelPlayerState === 'undefined'){ showToast('无法修炼', 'warn'); return; }
  const cost = 15;
  if(travelPlayerState.energy < cost){
    showToast(`精力不足（需${cost}点）！`, 'warn');
    return;
  }
  const qiGain = Math.round(12 + Math.random() * 18 + (edS.level || 1) * 0.5);
  travelPlayerState.energy = Math.max(0, travelPlayerState.energy - cost);
  addRealmQi(qiGain, 'cultivate');
  travelSave();
  if(typeof renderRealmUI === 'function') renderRealmUI();

  const msgEl = document.getElementById('cultivateMsg');
  if(msgEl) msgEl.innerHTML = `<span style="color:#88ddff">💠 真气 +${qiGain}，⚡ 精力 -${cost}</span>`;

  // 刷新精力条
  const engBar = document.getElementById('tsbEngBar');
  const engVal = document.getElementById('tsbEngVal');
  if(engBar) engBar.style.width = travelPlayerState.energy + '%';
  if(engVal) engVal.textContent = Math.round(travelPlayerState.energy);
}

function doCultivateTen(){
  const cost = 15 * 10;
  if(typeof travelPlayerState !== 'undefined' && travelPlayerState.energy < cost){
    showToast(`精力不足（需${cost}点）！`, 'warn');
    return;
  }
  let totalQi = 0;
  for(let i = 0; i < 10; i++){
    const qiGain = Math.round(12 + Math.random() * 18 + (edS.level || 1) * 0.5);
    addRealmQi(qiGain, 'cultivate');
    totalQi += qiGain;
  }
  if(typeof travelPlayerState !== 'undefined'){
    travelPlayerState.energy = Math.max(0, travelPlayerState.energy - cost);
    travelSave();
  }
  if(typeof renderRealmUI === 'function') renderRealmUI();

  const msgEl = document.getElementById('cultivateMsg');
  if(msgEl) msgEl.innerHTML = `<span style="color:#88ddff">💠 真气 +${totalQi}，⚡ 精力 -${cost}</span>`;

  const engBar = document.getElementById('tsbEngBar');
  const engVal = document.getElementById('tsbEngVal');
  if(engBar) engBar.style.width = (travelPlayerState?.energy || 0) + '%';
  if(engVal) engVal.textContent = Math.round(travelPlayerState?.energy || 0);

  showToast(`闭关十次，真气 +${totalQi}，精力 -${cost}`, 'info');
}

window.openCultivateDialog = openCultivateDialog;
window.doCultivateOnce     = doCultivateOnce;
window.doCultivateTen      = doCultivateTen;
