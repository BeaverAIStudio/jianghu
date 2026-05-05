// ═══ 调试：确认此文件被执行 ═══
// travel-render 文件开始加载
// ═══ 预注册 ═══
window._travelRenderLoaded = true;
// 注意：window.travelServiceAction 不在这里预注册，避免提前置 null 导致调用失败
// ════════════════════════════

function travelRenderLocation(cityId){
  travelCurrentCity = cityId;
  const node = WORLD_NODES[cityId];
  if(!node) return;

  // ── 护送任务完成检测（到达新城市时自动检查）──
  if(typeof tryCompleteEscortQuest === 'function') {
    setTimeout(() => tryCompleteEscortQuest(cityId), 500);
  }

  // 城市切换音效
  if (typeof playAudio === 'function') playAudio('city_change');

  // ── 左侧：位置面板（主题+场景图）──
  const tierColor = NODE_TIER_COLOR[node.tier] || '#a0c8a0';
  const tierLabel = {capital:'重要都城', major:'重要城镇', minor:'普通城镇', sect_location:'门派圣地'}[node.tier] || '江湖之地';

  // ① 主题 class（颜色系）
  const locPanel = document.getElementById('travelLocPanel');
  if(locPanel){
    locPanel.className = 'travel-location-panel ' + getLocationThemeClass(node);
  }

  // ② ASCII 场景图
  const sceneKey = getLocationSceneKey(node);
  let sceneArt;
  if(sceneKey.startsWith('@@node:') && typeof NODE_SCENES !== 'undefined'){
    sceneArt = NODE_SCENES[sceneKey.slice(7)] || LOCATION_SCENES['city_minor'];
  } else {
    sceneArt = LOCATION_SCENES[sceneKey] || LOCATION_SCENES['city_minor'];
  }
  const sceneArtEl = document.getElementById('tlSceneArt');
  if(sceneArtEl){
    sceneArtEl.textContent = sceneArt;
    // 门派地点场景图着门派颜色
    if(node.type === 'sect_location' && node.sects && node.sects.length){
      const sect = SECTS.find(x=>x.id===node.sects[0]);
      if(sect && sect.color) sceneArtEl.style.color = sect.color.replace(/[^#\w,.()\s]/g,'') + '88';
      else sceneArtEl.style.color = '';
    } else {
      sceneArtEl.style.color = '';
    }
  }

  // ③ 服务按钮（图标+名称卡片式）
  const SVC_DEFS = {
    inn:       { icon:'🏠', name:'旅店', sub:'歇脚住店', onclick:`travelServiceAction('inn','${cityId}')` },
    shop:      { icon:'🛒', name:'商店', sub:'购买物资', onclick:`travelServiceAction('shop','${cityId}')` },
    blacksmith:{ icon:'⚒',  name:'铁匠', sub:'锻造升级', onclick:`travelGoBlacksmith('${cityId}')` },
    market:    { icon:'🏪', name:'集市', sub:'交易珍货', onclick:`travelServiceAction('market','${cityId}')` },
    guild:     { icon:'⚔',  name:'镖局', sub:'押镖任务', onclick:`travelServiceAction('guild','${cityId}')` },
    hospital:  { icon:'💊', name:'医馆', sub:'治伤疗病', onclick:`travelServiceAction('hospital','${cityId}')` },
  };
  const services = (node.services||[]).map(s=>{
    const a = SVC_DEFS[s];
    if(!a) return `<span class="tl-service-tag">${SERVICE_ICON[s]||s}</span>`;
    return `<button class="tl-service-btn" onclick="${a.onclick}">
      <span class="svc-icon">${a.icon}</span>
      <span class="svc-name">${a.name}</span>
    </button>`;
  }).join('');

  // ④ 门派入口
  const sects = (node.sects||[]).map(sid=>{
    const s = SECTS.find(x=>x.id===sid);
    return s ? `<span style="color:${s.color||'#ffd080'};cursor:pointer;font-size:13px" onclick="travelGoSect('${sid}')">${s.emblem||''} ${s.name}</span>` : '';
  }).join('  ');

  // 玩家角色名
  const profileRaw = localStorage.getItem('wuxia_player_profile');
  let playerName = '侠客';
  if (profileRaw) {
    try { const p = JSON.parse(profileRaw); if (p.name) playerName = p.name; } catch(e) {}
  }
  if (playerName === '侠客' && typeof edS !== 'undefined' && edS.name) {
    playerName = edS.name;
  } else if (playerName === '侠客') {
    playerName = document.getElementById('edName')?.value || '侠客';
  }

  document.getElementById('tlName').textContent    = node.name;
  document.getElementById('tlDesc').textContent    = node.desc||'';

  // ── 进城第一眼旁白 ──
  const _isFirstVisit = !travelHistory.slice(1).includes(cityId);
  const _arrivalFlavor = _getArrivalFlavor(node, _isFirstVisit);
  const flavorEl = document.getElementById('tlArrivalFlavor');
  if(flavorEl){
    flavorEl.textContent = _arrivalFlavor;
    flavorEl.style.display = _arrivalFlavor ? '' : 'none';
  }

  // ── 首次到访奖励（探索激励）──
  if(_isFirstVisit && travelHistory.length > 1){
    // 按城市等级给予奖励
    const _tierReward = { capital: { silver: 80, exp: 60 }, major: { silver: 40, exp: 30 }, minor: { silver: 20, exp: 15 }, sect_location: { silver: 30, exp: 25 } };
    const _r = _tierReward[node.tier] || { silver: 20, exp: 15 };
    setTimeout(function(){
      if(typeof addSilver === 'function') addSilver(_r.silver);
      else if(typeof travelPlayerState !== 'undefined') travelPlayerState.silver = (travelPlayerState.silver||0) + _r.silver;
      if(typeof addPlayerExp === 'function') addPlayerExp(_r.exp, '探索新地点·' + node.name);
      if(typeof showToast === 'function') showToast('🗺️ 初探' + node.name + '！获得 ' + _r.silver + '两银子 +' + _r.exp + '经验', 3000);
    }, 800);
  }
  // 在 capital/major 城市追加斗蛐蛐入口（门派圣地不加）
  const cricketBtn = (node.tier==='capital'||node.tier==='major') && node.type!=='sect_location'
    ? `<button class="tl-service-btn" onclick="openCricketGame()" title="字符画斗蛐蛐小游戏">
        <span class="svc-icon">🦗</span>
        <span class="svc-name">斗蛐蛐</span>
      </button>` : '';

  // 捉蛐蛐：capital/major/minor 城市都有，门派圣地无
  const catchCricketBtn = node.type!=='sect_location'
    ? `<button class="tl-service-btn" onclick="openCricketCatchGame()" title="野外捉蛐蛐">
        <span class="svc-icon">🌿</span>
        <span class="svc-name">捉蛐蛐</span>
      </button>` : '';


  const fishingBtn = (typeof cityHasFishingSpot === 'function' && cityHasFishingSpot(cityId, node.terrain||''))
    ? `<button class="tl-service-btn" onclick="openFishingGame('${cityId}')" title="江湖垂钓">
        <span class="svc-icon">🎣</span>
        <span class="svc-name">钓鱼</span>
      </button>` : '';

  // 赌坊：capital/major 城市有，门派圣地无
  const gamblingBtn = (node.tier==='capital'||node.tier==='major') && node.type!=='sect_location'
    ? `<button class="tl-service-btn" onclick="openGamblingGame('${cityId}')" title="赌坊猜大小">
        <span class="svc-icon">🎲</span>
        <span class="svc-name">赌坊</span>
      </button>` : '';

  // 擂台：capital/major 城市有
  const arenaBtn = (node.tier==='capital'||node.tier==='major')
    ? `<button class="tl-service-btn" onclick="openArena('${cityId}')" title="擂台比武">
        <span class="svc-icon">⚔️</span>
        <span class="svc-name">擂台</span>
      </button>` : '';

  // 投壶游戏：有酒馆(tavern)服务的城市
  const pitchpotBtn = (node.services||[]).includes('tavern')
    ? `<button class="tl-service-btn" onclick="openPitchpotGame('${cityId}')" title="酒馆投壶">
        <span class="svc-icon">🏺</span>
        <span class="svc-name">投壶</span>
      </button>` : '';

  // 棋社对弈：有chess服务的城市
  const chessBtn = (node.services||[]).includes('chess')
    ? `<button class="tl-service-btn" onclick="openGoGame('${cityId}')" title="棋社对弈">
        <span class="svc-icon">♟️</span>
        <span class="svc-name">棋社</span>
      </button>` : '';

  const herbalismBtn = (node.services||[]).includes('herbalism')
    ? `<button class="tl-service-btn" onclick="openHerbalism('${cityId}')" title="草药店">
        <span class="svc-icon">🌿</span>
        <span class="svc-name">草药店</span>
      </button>` : '';

  const forgeBtn = (node.services||[]).includes('forge')
    ? `<button class="tl-service-btn" onclick="openForge('${cityId}')" title="铁匠铺">
        <span class="svc-icon">🔨</span>
        <span class="svc-name">铁匠铺</span>
      </button>` : '';

  const allServices = services + cricketBtn + catchCricketBtn + fishingBtn + gamblingBtn + arenaBtn + pitchpotBtn + chessBtn + herbalismBtn + forgeBtn;
  document.getElementById('tlServices').innerHTML  = allServices
    ? `<div class="tl-services-label">可用服务</div><div class="tl-services">${allServices}</div>` : '';
  // 当前城市是否是玩家本门总舵
  const _locEdS = (typeof edS !== 'undefined') ? edS : null;
  const _locPlayerSect = _locEdS ? (_locEdS.sect || null) : null;
  let sectHqLabel = '';
  if(node.type === 'sect_location' && node.sects && node.sects.length){
    const isMySect = _locPlayerSect && node.sects.includes(_locPlayerSect);
    if(isMySect){
      const mySect = (typeof SECTS !== 'undefined') ? SECTS.find(s=>s.id===_locPlayerSect) : null;
      const sc = (mySect && mySect.color) || '#ffd080';
      sectHqLabel = `<span style="color:${sc};font-weight:700;background:${sc}18;border:1px solid ${sc}40;border-radius:4px;padding:1px 6px;font-size:9px;letter-spacing:1px">🏠 本门总舵</span>`;
    }
  }

  document.getElementById('tlSects').innerHTML = sects
    ? `<div class="tl-sects">⚔ 驻此门派：${sects}</div>` : '';
  document.getElementById('tlCoords').textContent  = `坐标 (${node.x >= 0 ? '东'+node.x : '西'+Math.abs(node.x)}, ${node.y >= 0 ? '南'+node.y : '北'+Math.abs(node.y)}) · ${playerName} 于此`;
  document.getElementById('tlMeta').innerHTML =
    `<span style="color:${tierColor};border:1px solid ${tierColor};padding:1px 6px;border-radius:3px;font-size:9px;letter-spacing:1px">${tierLabel}</span>`
    + sectHqLabel
    +`<span>📍 ${node.region||''}</span>`
    +`<span>${TERRAIN_ICON[node.terrain]||'🗺'} ${node.terrain||''}</span>`;

  // ── NPC 系统 ──
  try{
    if(typeof renderCityNpcs === 'function') renderCityNpcs(cityId);
    else if(typeof window.renderCityNpcs === 'function') window.renderCityNpcs(cityId);
    else console.warn('[travel-render] renderCityNpcs 未加载');
  }catch(e){ console.error('[renderCityNpcs]',e); }
  // 旅行抵达后自动推进任务
  try{ if(travelHistory.length > 1) npcOnTravelComplete(cityId); }catch(e){ console.error('[npcOnTravelComplete]',e); }
  // 江湖具名NPC邂逅
  try{ if(travelHistory.length > 1 && typeof jhOnArrival === 'function') jhOnArrival(cityId); }catch(e){ console.error('[jhOnArrival]',e); }
  // ── 地下城入口 ──
  const dgEntEl = document.getElementById('tlDungeonEntrances');
  if(dgEntEl && typeof renderDungeonEntrances === 'function'){
    try{ renderDungeonEntrances(cityId, dgEntEl); }catch(e){ console.error('[renderDungeonEntrances]',e); }
  }

  // ── 右侧：罗盘 ──
  const roads = node.roads || {};
  const dirIds = ['N','NE','E','SE','S','SW','W','NW'];
  const cellIds = { N:'cN', NE:'cNE', E:'cE', SE:'cSE', S:'cS', SW:'cSW', W:'cW', NW:'cNW' };

  const visitedSet2 = new Set(travelHistory);
  // travelHistory[1] 是上一个城市（刚离开的）
  const prevCityId = travelHistory[1] || null;
  dirIds.forEach(dir=>{
    const el = document.getElementById(cellIds[dir]);
    if(!el) return;
    const destId = roads[dir];
    const dest   = destId ? WORLD_NODES[destId] : null;
    if(dest){
      const isVisited = visitedSet2.has(destId);
      const isPrev    = destId === prevCityId;
      // 检查地点是否锁定
      const accessStatus = (typeof getLocationAccessStatus === 'function') 
        ? getLocationAccessStatus(destId) 
        : 'unrestricted';
      const isLocked = accessStatus === 'locked';
      
      let extraClass = '';
      if(isPrev)    extraClass = ' cc-prev';
      else if(isVisited) extraClass = ' cc-visited';
      if(isLocked) extraClass += ' cc-locked';
      el.className = `compass-cell has-road${extraClass}`;
      const tc = isLocked ? '#666' : (NODE_TIER_COLOR[dest.tier]||'#a0c8a0');
      // 已访问城市小标记
      const visitedDot = isVisited
        ? `<div class="cc-visited-dot" title="到访过">${isPrev?'←来':'✓'}</div>`
        : '';
      // 锁定提示
      const lockHint = isLocked 
        ? `<div class="cc-locked-hint" title="需主线推进后解锁">🔒</div>` 
        : '';
      el.innerHTML = `
        <div class="cc-arrow">${DIR_ARROW[dir]}</div>
        <div class="cc-icon" style="${isLocked ? 'opacity:0.5' : ''}">${isLocked ? '💀' : (dest.icon||'📍')}</div>
        <div class="cc-name" style="color:${tc}; ${isLocked ? 'opacity:0.6' : ''}">${dest.name}${isLocked ? ' 🔒' : ''}</div>
        <div class="cc-dir">${DIR_LABEL[dir]||dir}</div>
        ${visitedDot}
        ${lockHint}
      `;
      el.onclick = ()=> travelMoveTo(destId);
    } else {
      el.className = 'compass-cell';
      el.innerHTML = `<div class="cc-empty">·</div>`;
      el.onclick = null;
    }
  });

  // ── 下方：路线卡片 ──
  const roadsEl = document.getElementById('travelRoads');
  const roadEntries = Object.entries(roads).map(([dir,destId])=>{
    const dest = WORLD_NODES[destId];
    if(!dest) return null;
    
    // 检查地点是否锁定
    const accessStatus = (typeof getLocationAccessStatus === 'function') 
      ? getLocationAccessStatus(destId) 
      : 'unrestricted';
    const isLocked = accessStatus === 'locked';
    
    const tc = isLocked ? '#666' : (NODE_TIER_COLOR[dest.tier]||'#a0c8a0');
    const tl = {capital:'都城',major:'城镇',minor:'小镇',sect_location:'圣地'}[dest.tier]||'';
    const sectNames = (dest.sects||[]).map(sid=>{ const s=SECTS.find(x=>x.id===sid); return s?s.name:''; }).filter(Boolean).join('/');
    const isVisited = travelHistory.includes(destId);

    // ── 距离 + 旅途时间 ──
    const timeInfo = travelCalcTime(cityId, destId);
    const footStr  = fmtDays(timeInfo.footDays);
    // 坐骑判断：永久坐骑 OR 租马
    const _edSRef = (typeof edS !== 'undefined') ? edS : null;
    const hasPermHorse = !!(_edSRef && _edSRef.horseId && HORSE_BREEDS[_edSRef.horseId]);
    const hasRentMount = timeInfo.rentMount;
    const hasAnyMount = hasPermHorse || hasRentMount;
    let horseStr = null;
    if(hasRentMount) horseStr = fmtDays(timeInfo.horseDays); // 租马
    else if(hasPermHorse) horseStr = fmtDays(timeInfo.horseDays); // 永久
    const distLi   = timeInfo.distLi;

    // ── 目的地服务图标 ──
    const SVC_ICON_MAP = {inn:'🏠',shop:'🛒',blacksmith:'⚒',market:'🏪',guild:'⚔',hospital:'💊',stable:'🐴',poststation:'🏇'};
    const svcIcons = (dest.services||[]).map(s=>SVC_ICON_MAP[s]||'').filter(Boolean);
    // 门派和特色功能
    if((dest.tier==='capital'||dest.tier==='major') && dest.type!=='sect_location'){
      svcIcons.push('🎲','🦗','🎣');
    }
    const svcRow = svcIcons.length
      ? `<div class="rc-services">${svcIcons.map(ic=>`<span class="rc-svc-icon">${ic}</span>`).join('')}</div>`
      : '';

    // ── 门派总舵标记 ──
    const _edSRef2 = (typeof edS !== 'undefined') ? edS : null;
    const _playerSect = _edSRef2 ? (_edSRef2.sect || null) : null;
    let sectHqTag = '';
    if(dest.type === 'sect_location' && dest.sects && dest.sects.length){
      const isMySect = _playerSect && dest.sects.includes(_playerSect);
      if(isMySect){
        const mySect = (typeof SECTS !== 'undefined') ? SECTS.find(s=>s.id===_playerSect) : null;
        const sc = (mySect && mySect.color) || '#ffd080';
        sectHqTag = `<span class="rc-tier" style="color:${sc};font-weight:700;background:${sc}18;border:1px solid ${sc}40;border-radius:4px;padding:1px 6px">🏠 本门总舵</span>`;
      } else {
        sectHqTag = `<span class="rc-tier" style="color:#c0a060">⛩ 门派总舵</span>`;
      }
    }

    // ── 锁定提示 ──
    const lockBadge = isLocked 
      ? `<div style="color:#ff6060;font-size:10px;margin-top:4px;padding:3px 6px;background:rgba(255,0,0,0.1);border-radius:4px;border:1px solid rgba(255,0,0,0.2)">🔒 需要主线推进至第三幕后方可进入</div>` 
      : '';

    if (isLocked) {
      return `<div class="road-card${isVisited?' visited':''}" style="opacity:0.6;border-left:3px solid #ff6060;cursor:not-allowed">
        <div class="rc-dir">${DIR_ARROW[dir]} ${DIR_LABEL[dir]||dir}</div>
        <div class="rc-icon" style="opacity:0.5">💀</div>
        <div class="rc-name" style="color:#666">${dest.name} 🔒</div>
        <div class="rc-meta">${TERRAIN_ICON[dest.terrain]||''} ${dest.terrain||''} · ${dest.region||''}</div>
        ${lockBadge}
        <div style="display:flex;gap:4px;align-items:center;margin-top:4px;flex-wrap:wrap">
          <span class="rc-tier" style="color:#666">${tl}</span>
          ${sectHqTag}
        </div>
      </div>`;
    }

    return `<div class="road-card${isVisited?' visited':''}" onclick="travelMoveTo('${destId}')">
      <div class="rc-dir">${DIR_ARROW[dir]} ${DIR_LABEL[dir]||dir}</div>
      <div class="rc-icon">${dest.icon||'📍'}</div>
      <div class="rc-name" style="color:${tc}">${dest.name}</div>
      <div class="rc-meta">${TERRAIN_ICON[dest.terrain]||''} ${dest.terrain||''} · ${dest.region||''}</div>
      <div class="rc-dist">📏 ${distLi}里
        ${hasAnyMount
          ? `&nbsp;·&nbsp;${hasRentMount ? '🐴' : HORSE_BREEDS[_edSRef && _edSRef.horseId]?.icon||'🐴'}<span class="rc-time-horse">${horseStr}${hasRentMount?'<span style="font-size:9px;color:#ffd060">(租)</span>':''}</span>`
          : `&nbsp;·&nbsp;🚶<span class="rc-time-foot">${footStr}</span>`
        }
      </div>
      ${hasAnyMount ? `<div class="rc-foot-tip">🚶徒步约${footStr}</div>` : ''}
      ${sectNames?`<div style="font-size:9px;color:rgba(220,180,80,.6);margin-top:3px">⚔ ${sectNames}</div>`:''}
      ${svcRow}
      <div style="display:flex;gap:4px;align-items:center;margin-top:4px;flex-wrap:wrap">
        <span class="rc-tier" style="color:${tc}">${tl}</span>
        ${sectHqTag}
        ${isVisited?'<span style="font-size:9px;color:rgba(140,200,140,.4)">✓ 到访过</span>':''}
      </div>
    </div>`;
  }).filter(Boolean);
  roadsEl.innerHTML = roadEntries.join('');

  // ── 足迹 ──
  travelRenderFootprint();

  // ── 事件日志 ──
  travelRenderEventLog();

  // 更新全图索引高亮
  travelRenderIndex();

  // ── 情境任务触发：进城 ──
  if(typeof triggerContextualCity === 'function'){
    setTimeout(()=>{ try{ triggerContextualCity(cityId); }catch(e){} }, 100);
  }
  // ── 心情任务触发：进城 ──
  if(typeof checkNpcMoodsOnEnter === 'function'){
    setTimeout(()=>{ try{ checkNpcMoodsOnEnter(cityId); }catch(e){} }, 120);
  }
  // ── 事件链触发：进城 ──
  if(typeof checkEventChainTriggers === 'function'){
    setTimeout(()=>{ try{ checkEventChainTriggers('city', { cityId }); }catch(e){} }, 140);
  }
}

// 渲染旅行足迹
function travelRenderFootprint(){
  const el = document.getElementById('travelFootprint');
  if(!el) return;
  if(travelHistory.length <= 1){ el.innerHTML = '<span style="color:rgba(140,180,140,.3);font-size:11px">尚未离开此地</span>'; return; }
  el.innerHTML = travelHistory.slice(0,8).map((id,i)=>{
    const n = WORLD_NODES[id];
    const isNow = i===0;
    const tierColor = isNow ? (NODE_TIER_COLOR[n?.tier]||'#a0ffc8') : '';
    const style = isNow ? `style="color:${tierColor};font-weight:700;"` : '';
    const regionTip = (n?.region && !isNow) ? ` title="${n.region}"` : '';
    return `<span class="footprint-item${isNow?' fp-now':''}" ${style} onclick="travelRenderLocation('${id}')"${regionTip}>${n?.icon||'📍'}${n?.name||id}${isNow?'<span class="fp-here-dot">●</span>':''}</span>`;
  }).join('<span class="fp-arrow">←</span>');
}

// 渲染旅途事件日志
function travelRenderEventLog(){
  const el = document.getElementById('travelEventLog');
  if(!el) return;
  if(travelEventLog.length === 0){
    el.innerHTML = '<div style="color:rgba(160,180,160,.3);font-size:11px;text-align:center;padding:16px 0">出发吧，江湖在等着你……</div>';
    return;
  }
  // 最多显示20条，最新的在顶部
  const logs = travelEventLog.slice(0, 20);
  el.innerHTML = logs.map((ev, i)=>{
    const typeCls = {good:'evl-good',great:'evl-great',bad:'evl-bad',normal:'evl-normal'}[ev.type]||'evl-normal';
    const isNew = i === 0 ? ' evl-newest' : '';
    return `<div class="evl-item ${typeCls}${isNew}">
      <div class="evl-meta">${ev.time} &nbsp;${ev.from} → ${ev.to}</div>
      <div class="evl-body"><span class="evl-icon">${ev.icon}</span><span class="evl-title">${ev.title}</span></div>
      <div class="evl-result">${ev.result||''}</div>
    </div>`;
  }).join('');
  // 确保最新条目可见（最新在顶部，滚到顶）
  el.scrollTop = 0;
}

// 城市服务动作（显式注册到 window 确保全局可访问）
function travelServiceAction(service, cityId){
  // 首次调用时自注册到 window（防御性）
  if(typeof window.travelServiceAction !== 'function') window.travelServiceAction = travelServiceAction;
  // 兜底：cityId 无效时尝试 travelCurrentCity，否则用 'luoyang'
  if (!cityId || !WORLD_NODES[cityId]) {
    cityId = (typeof travelCurrentCity !== 'undefined' && WORLD_NODES[travelCurrentCity]) ? travelCurrentCity : 'luoyang';
  }
  const node = WORLD_NODES[cityId];
  const svcName = {inn:'旅店',shop:'商店',market:'集市',guild:'镖局',hospital:'医馆'}[service]||service;

  if(service === 'inn'){
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"客栈住宿系统
    // ═══════════════════════════════════════════════════════════════
    const INN_JIANGHU_EVENTS = {
      goodDream: { id: 'goodDream', chance: 0.05, icon: '🌙', title: '美梦连连', desc: '一夜好梦，精神焕发', effect: () => ({ energyBonus: 20, msg: '🌙 美梦连连！额外恢复20点精力上限！' }) },
      nightmare: { id: 'nightmare', chance: 0.04, icon: '💀', title: '噩梦缠身', desc: '噩梦惊醒，心神不宁', effect: () => ({ energyPenalty: 15, msg: '💀 噩梦缠身，精力只恢复了85点...' }) },
      overhear: { id: 'overhear', chance: 0.06, icon: '👂', title: '隔墙有耳', desc: '无意中听到江湖秘闻', effect: () => ({ intel: 1, msg: '👂 隔墙有耳！获得一条江湖情报！' }) },
      discount: { id: 'discount', chance: 0.05, icon: '🎫', title: '店庆优惠', desc: '恰逢店庆，房费打折', effect: (cost) => ({ cost: Math.round(cost * 0.6), refund: Math.round(cost * 0.4), msg: '🎫 店庆优惠！房费6折！' }) },
      luxurySuite: { id: 'luxurySuite', chance: 0.03, icon: '👑', title: '天字一号', desc: '被免费升级到天字房', effect: () => ({ hpBonus: 30, msg: '👑 被升级到天字一号房！气血额外恢复30%！' }) },
    };

    function _checkInnJianghuEvent(cost) {
      const roll = Math.random();
      let cumulative = 0;
      for (const key in INN_JIANGHU_EVENTS) {
        const evt = INN_JIANGHU_EVENTS[key];
        cumulative += evt.chance;
        if (roll < cumulative) {
          return { ...evt, result: evt.effect(cost) };
        }
      }
      return null;
    }

    // ── 旅店：按等级浮动（基础10两，每超过Lv10加2两，大城市+5两）──
    const playerLevel = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;
    const cityTier = (node && node.tier) || 0;
    const baseCost = 10;
    const lvlExtra = Math.max(0, Math.floor((playerLevel - 10) / 5)) * 3; // 每跨5级多3两
    const cityExtra = (cityTier === 'capital' || cityTier === 'major') ? 8 : (cityTier === 'hub' ? 4 : 0);
    let cost = Math.max(baseCost, baseCost + lvlExtra + cityExtra);

    // ═══════════════════════════════════════════════════════════════
    //  检查将将胡事件（可能影响价格）
    // ═══════════════════════════════════════════════════════════════
    const jhEvent = _checkInnJianghuEvent(cost);
    if (jhEvent && jhEvent.result.cost) {
      cost = jhEvent.result.cost;
    }

    if(!hasSilver(cost)){
      travelShowMsg(`盘缠不足！住店需要${cost}两银子（含等级/城市附加），你现有 ${getSilver()} 两。`, '旅店');
      return;
    }
    spendSilver(cost);

    // ── 推进1天（住一晚=过了一天）──
    const curDay = (typeof edS !== 'undefined' && edS.gameDay != null) ? edS.gameDay : 1;
    if (typeof edS !== 'undefined' && typeof advanceWuxiaDate === 'function') {
      advanceWuxiaDate(edS, 1);
      try { localStorage.setItem('wuxia_editor', JSON.stringify(edS)); } catch(e) {}
    }
    // 每日饱食/口渴消耗
    const foodDrain  = 8;
    const waterDrain = 12;
    travelPlayerState.food  = Math.max(0, (travelPlayerState.food  ?? 100) - foodDrain);
    travelPlayerState.water = Math.max(0, (travelPlayerState.water ?? 100) - waterDrain);

    // 旅店：主要恢复精力，少量恢复气血（+20%）
    let hpRecovery = 20;
    let energyRecovery = 100;

    // 应用将将胡事件效果
    if (jhEvent) {
      if (jhEvent.result.hpBonus) hpRecovery += jhEvent.result.hpBonus;
      if (jhEvent.result.energyBonus) energyRecovery = Math.min(120, energyRecovery + jhEvent.result.energyBonus);
      if (jhEvent.result.energyPenalty) energyRecovery = 100 - jhEvent.result.energyPenalty;
    }

    travelPlayerState.hp = Math.min(100, travelPlayerState.hp + hpRecovery);
    travelPlayerState.energy = energyRecovery;
    // ── 恢复内力（气）—— 旅店休息应恢复满内力 ──
    if (typeof edS !== 'undefined') {
      edS.mp = edS.maxMp || 100;
      try { localStorage.setItem('wuxia_editor', JSON.stringify(edS)); } catch(e) {}
      // 同时更新 wuxia_player_profile
      const profileRaw = localStorage.getItem('wuxia_player_profile');
      if (profileRaw) {
        try {
          const profile = JSON.parse(profileRaw);
          profile.mp = edS.mp;
          profile.maxMp = edS.maxMp;
          localStorage.setItem('wuxia_player_profile', JSON.stringify(profile));
        } catch(e) {}
      }
    }
    // 同步恢复 edS 中的血量（战斗系统使用）
    if(typeof edS !== 'undefined'){
      const maxHp = edS.maxHp || 100;
      edS.hp = Math.min(maxHp, Math.round(maxHp * travelPlayerState.hp / 100));
      // 保存到存档
      const edRaw = localStorage.getItem('wuxia_editor');
      if(edRaw){
        try{
          const edData = JSON.parse(edRaw);
          edData.hp = edS.hp;
          localStorage.setItem('wuxia_editor', JSON.stringify(edData));
        }catch(e){}
      }
      // 同时更新 wuxia_player_profile
      const profileRaw = localStorage.getItem('wuxia_player_profile');
      if(profileRaw){
        try{
          const profile = JSON.parse(profileRaw);
          profile.hp = edS.hp;
          profile.maxHp = edS.maxHp;
          profile.totalExp = edS.totalExp || 0;
          profile.level = edS.level || 1;
          localStorage.setItem('wuxia_player_profile', JSON.stringify(profile));
        }catch(e){}
      }
    }
    SilverManager.save();

    // 构建消息
    let eventMsg = '';
    if (jhEvent) {
      eventMsg = `\n✨ ${jhEvent.result.msg}`;
      if (jhEvent.result.refund) {
        addSilver(jhEvent.result.refund);
        eventMsg += `（退还${jhEvent.result.refund}两）`;
      }
      if (jhEvent.result.intel && typeof addIntel === 'function') {
        addIntel('random', 1);
      }
      // 显示Toast
      setTimeout(() => {
        if (typeof showToast === 'function') {
          showToast(`${jhEvent.icon} ${jhEvent.title}！${jhEvent.result.msg}`, jhEvent.id === 'nightmare' ? 'warn' : 'success', 3000);
        }
      }, 500);
    }

    const dateStr = (typeof edS !== 'undefined' && typeof formatWuxiaDate === 'function') ? formatWuxiaDate(edS) : '';
    travelShowMsg(`在 ${node?.name} 旅店入住一夜（花费${cost}两${lvlExtra>0?'，含等级附加':''}${cityExtra>0?'，大城市溢价':''}），饱食-${foodDrain}，口渴-${waterDrain}，精力恢复至${energyRecovery}%，气血恢复${hpRecovery}%！${eventMsg}\n💰 剩余银两：${getSilver()}两  📅 ${dateStr}`, '🏠 旅店');
    travelRenderIndex();

    // ── 城市奇遇：客栈留宿时 20% 概率触发 ──────────────
    if (typeof cityEncOnInnRest === 'function') {
      setTimeout(() => cityEncOnInnRest(), 800);
    }
    return;
  }
  if(service === 'hospital'){
    // 优先读 travelPlayerState.hp（旅行系统百分比，受伤后实时更新）
    // edS.hp 是绝对值，默认=maxHp=150，旅行事件受伤不会同步更新它，不可靠
    let currentHp = 100;
    if(typeof travelPlayerState !== 'undefined' && travelPlayerState.hp != null){
      currentHp = Math.round(travelPlayerState.hp);
    } else if(typeof edS !== 'undefined' && edS.maxHp){
      currentHp = Math.round((edS.hp / edS.maxHp) * 100);
    }
    currentHp = Math.max(0, Math.min(100, currentHp));
    if(currentHp >= 100){
      travelShowMsg('你现在无伤无病，身体倍棒！', '💊 医馆');
      return;
    }
    // ── 医馆：按损失血量计费（基础30两，每少10%气血+5两）──
    const baseCost = 30;
    const lostPercent = 100 - currentHp; // 0~99
    const dmgExtra = Math.ceil(lostPercent / 15) * 8; // 每少15%加8两
    const cost = baseCost + dmgExtra;
    if(!hasSilver(cost)){
      travelShowMsg(`治疗需要${cost}两（伤势较重），你现有 ${getSilver()} 两，囊中羞涩。`, '医馆');
      return;
    }
    spendSilver(cost);
    travelPlayerState.hp = 100;
    // 同步恢复 edS 中的血量（战斗系统使用）
    if(typeof edS !== 'undefined'){
      edS.hp = edS.maxHp || 100;
      // 保存到存档
      const edRaw = localStorage.getItem('wuxia_editor');
      if(edRaw){
        try{
          const edData = JSON.parse(edRaw);
          edData.hp = edS.hp;
          localStorage.setItem('wuxia_editor', JSON.stringify(edData));
        }catch(e){}
      }
      // 同时更新 wuxia_player_profile
      const profileRaw = localStorage.getItem('wuxia_player_profile');
      if(profileRaw){
        try{
          const profile = JSON.parse(profileRaw);
          profile.hp = edS.hp;
          profile.maxHp = edS.maxHp;
          profile.totalExp = edS.totalExp || 0;
          profile.level = edS.level || 1;
          localStorage.setItem('wuxia_player_profile', JSON.stringify(profile));
        }catch(e){}
      }
    }
    // ── 恢复内力（医馆治疗应恢复满内力）──
    if (typeof edS !== 'undefined') {
      edS.mp = edS.maxMp || 100;
      try { localStorage.setItem('wuxia_editor', JSON.stringify(edS)); } catch(e) {}
      const profileRaw = localStorage.getItem('wuxia_player_profile');
      if (profileRaw) {
        try {
          const profile = JSON.parse(profileRaw);
          profile.mp = edS.mp;
          profile.maxMp = edS.maxMp;
          localStorage.setItem('wuxia_player_profile', JSON.stringify(profile));
        } catch(e) {}
      }
    }
    SilverManager.save();
    travelShowMsg(`郎中施针把脉，药到病除！气血与内力完全恢复。（花费${cost}两${dmgExtra>0?'，含伤势附加':''}）\n💰 剩余银两：${getSilver()}两`, '💊 医馆');
    travelRenderIndex();
    return;
  }

  if(service === 'guild'){
    if(typeof openEscortGame === 'function'){
      openEscortGame(cityId);
    } else {
      travelShowMsg(`${node?.name} 镖局内，镖头正在分配押镖任务，高价悬赏贴满一墙。`, '⚔ 镖局');
    }
    return;
  }

  // ── 马厩：租用坐骑加速旅行（方案C）──
  if(service === 'stable'){
    // 检查是否已有坐骑
    const hasMount = localStorage.getItem('wuxia_mount') !== null;
    const mountData = hasMount ? JSON.parse(localStorage.getItem('wuxia_mount')||'{}') : null;
    
    if(mountData && Date.now() < (mountData.expires || 0)){
      travelShowMsg(`你当前骑乘【${mountData.name||'骏马'}】，剩余时间：${Math.ceil(((mountData.expires||0)-Date.now())/60000)} 分钟。`, '🐴 马厩');
    } else {
      // ── 从 _MOUNT_DB 取可租马匹（与 town.html 马厩统一）──
      const MOUNT_DB = window._MOUNT_DB || [];
      const rentable = MOUNT_DB.filter(m => m.rent);
      const playerLevel = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;

      if(typeof townModalOpen === 'function'){
        /* 档位颜色映射（跟 town.html 马厩统一） */
        const tierColor = {
          '普通':{bg:'rgba(130,120,90,.15)', border:'rgba(160,150,120,.18)', tag:'#a89878'},
          '良驹':{bg:'rgba(80,150,100,.12)', border:'rgba(120,170,110,.2)', tag:'#78b888'},
          '名驹':{bg:'rgba(190,160,70,.14)', border:'rgba(210,175,80,.22)', tag:'#d4a840'},
          '稀有':{bg:'rgba(180,100,50,.14)', border:'rgba(210,140,50,.25)', tag:'#e08028'},
          '传说':{bg:'rgba(180,60,40,.14)', border:'rgba(220,100,60,.3)', tag:'#e85030'},
        };

        const mountHtml = rentable.map((m) => {
          const tc = tierColor[m.tier] || tierColor['普通'];
          const dur = m.rent.dur;
          const price = typeof m.rent.price === 'function' ? m.rent.price(playerLevel) : m.rent.price;
          return `
          <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;border:1px solid ${tc.border};border-radius:10px;margin-bottom:7px;background:${tc.bg};cursor:pointer;transition:transform .15s" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''" onclick="_trRent('${m.breedKey}','${m.name.replace(/'/g,"\\'")}',${price},${dur})">
            <span style="font-size:26px;width:36px;text-align:center">${m.icon}</span>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:6px">
                <span style="color:#e8d090;font-weight:bold;font-size:13px">${m.name}</span>
                <span style="font-size:9px;color:${tc.tag};background:${tc.bg};padding:1px 5px;border-radius:3px;border:1px solid ${tc.border}">${m.tier}</span>
                <span style="color:#88c878;font-size:10px">${m.speed}</span>
              </div>
              <div style="color:rgba(180,160,120,.55);font-size:11px;margin-top:2px">${m.desc}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="color:#ffd060;font-weight:bold;font-size:14px">${price}两</div>
              <div style="color:rgba(180,160,120,.45);font-size:9px">${dur}分钟</div>
            </div>
          </div>`;
        }).join('');

        townModalOpen('🐴 马厩租马', `<div style="padding:4px"><div style="color:#a0a070;font-size:11px;margin-bottom:8px">💡 租用坐骑可大幅提升旅行速度，租期结束后自动归还。</div>${mountHtml}<div style="text-align:center;margin-top:8px"><button onclick="closeNpcDialog();if(typeof townModalClose==='function')townModalClose(null)" style="background:rgba(100,100,100,.3);border:1px solid rgba(200,200,200,.2);color:#ccc;padding:5px 16px;border-radius:5px;cursor:pointer;font-size:12px">关闭</button></div></div>`);
      } else {
        travelShowMsg(`${node?.name||''} 马厩里，马夫正在喂马……（弹窗系统不可用）`, '🐴 马厩');
      }
    }
    return;
  }

  // 全局函数：执行租马（与 town.html 马厩统一逻辑）
  window._trRent = function(mountId, name, price, duration){
    try{
      const mySilver = getSilver();
      if(mySilver < price){
        // 尝试用 town.html 的 _stableAlert
        if(typeof window._stableAlert === 'function'){
          window._stableAlert('error','银两不足','💰',
            `租用 <b style="color:#f0d080">${name}</b> 需要 <b style="color:#ffd060">${price} 两</b>银<br>你现有 <b>${mySilver} 两</b><br><span style="font-size:11px;color:rgba(180,160,120,.5)">去镖局跑趟单子，或卖掉些杂物吧</span>`);
        } else {
          showToast(`银两不足！需要 ${price} 两`, 'err');
        }
        return;
      }

      // 二次确认
      if(typeof window._stableConfirm === 'function'){
        window._stableConfirm(
          '确认租用？', '🐴',
          `租用 <b style="color:#f0d080">${name}</b><br>租金：<b style="color:#ffd060">${price} 两</b>银<br>有效期：<b>${duration} 分钟</b>`,
          '确认租用',
          'background:linear-gradient(135deg,#d4a84a,#b8923a)',
          function(){
            _trRentDo(mountId, name, price, duration);
          },
          '再想想'
        );
      } else {
        // 无确认弹窗时直接执行
        _trRentDo(mountId, name, price, duration);
      }
    } catch(e){
      console.error('[_trRent]', e);
      showToast('⚠️ 租马失败', 'err');
    }
  };

  /** 租马实际执行 */
  function _trRentDo(mountId, name, price, duration){
    try{
      spendSilver(price);
      const expires = Date.now() + duration * 60000;
      localStorage.setItem('wuxia_mount', JSON.stringify({ id:mountId, name:name, expires:expires }));

      if(typeof window._stableAlert === 'function'){
        window._stableAlert('success','租下骏马','🐴',
          `租下 <b style="color:#f0d080">${name}</b><br>有效期 <b>${duration} 分钟</b><br>旅行速度大幅提升！`);
      } else {
        showToast(`🐴 租下【${name}】，有效期 ${duration} 分钟！`, 'ok');
      }

      if(typeof townModalClose === 'function') townModalClose(null);
      closeNpcDialog();
      travelShowMsg(`在 ${WORLD_NODES[travelCurrentCity]?.name||''} 马厩租下一匹【${name}】（花费${price}两），可骑行 ${duration} 分钟。\n💰 剩余银两：${getSilver()}两`, '🐴 马厩');
      travelRenderIndex();
    } catch(e){
      console.error('[_trRentDo]', e);
      showToast('⚠️ 租马失败', 'err');
    }
  };

// ══════════════════════════════════════
//  固定驿路（类似高铁线路）
//  每条线路有固定站点，可传送到任意站点（含未到访城市）
// ══════════════════════════════════════
const POST_ROUTES = [
  {
    id:'north_south', name:'官道·南北干线', icon:'🛤', color:'#e8a040',
    desc:'纵贯中原南北，最繁忙的官道驿路',
    stops:['youzhou','cangzhou','kaifeng','luoyang','wuhan','guangzhou'],
  },
  {
    id:'canal_east', name:'运河·东线', icon:'🚢', color:'#60b0d0',
    desc:'沿运河南下，贯通江淮与江南水乡',
    stops:['youzhou','cangzhou','xuzhou','yangzhou','nanjing','hangzhou'],
  },
  {
    id:'west_sichuan', name:'秦蜀·西线', icon:'⛰', color:'#90b080',
    desc:'出潼关入秦岭，西至巴蜀大理',
    stops:['xian','tongguan','luoyang','hanzhong','chengdu','dali'],
  },
  {
    id:'central_cross', name:'中原·横线', icon:'📐', color:'#c09060',
    desc:'横贯东西，连接长安与东海',
    stops:['xian','tongguan','luoyang','kaifeng','xuzhou','haicang'],
  },
  {
    id:'south_coast', name:'岭南·南线', icon:'🌊', color:'#50a0c0',
    desc:'南下闽广，滨海驿道',
    stops:['nanjing','fuzhou','guangzhou','dali'],
  },
];

// ── 驿站：选线路→选站点→付费传送（高铁模式）──
if(service === 'poststation'){
    const playerLevel = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;
    const current = travelCurrentCity || 'luoyang';

    // 距离计算（fallback）
    const distLi = (from, to) => { try { return travelCalcDist(from, to); } catch(e) { return 500; } };
    // 价格：基础15 + 每100里2.5两 + 等级加成 + 驿站加急费10两
    const calcPrice = (d) => Math.max(20, Math.round(15 + (d/100)*2.5 + playerLevel * 1 + 10));

    // 第一级：线路选择面板
    const routeCards = POST_ROUTES.map(r => {
      // 统计本线路可达目的地数（排除当前城市）
      const destStops = r.stops.filter(id => id !== current && WORLD_NODES[id]);
      if(destStops.length === 0) return '';
      // 取最近一站的价格做参考
      const nearest = destStops.reduce((best, id) => {
        const dd = distLi(current, id);
        return dd < best.d ? {id, d:dd} : best;
      }, {id:'', d:99999});
      const refPrice = nearest.id ? calcPrice(nearest.d) : 0;

      const stopNames = r.stops.map(id => WORLD_NODES[id]?.icon||'·').join(' ');
      return `<div style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid ${r.color}40;border-radius:10px;margin-bottom:6px;background:rgba(0,0,0,.25);cursor:pointer" onclick="_pickPoststationRoute('${r.id}')">
        <span style="font-size:26px">${r.icon}</span>
        <div style="flex:1">
          <div style="color:${r.color};font-weight:bold;font-size:14px">${r.name}</div>
          <div style="color:rgba(160,160,140,.55);font-size:10px">${r.desc}</div>
          <div style="font-size:11px;letter-spacing:2px;margin-top:3px">${stopNames}</div>
        </div>
        <div style="text-align:right">
          <div style="color:#ffd060;font-weight:bold;font-size:14px">${destStops.length}站</div>
          <div style="color:rgba(200,180,120,.5);font-size:9px">起${refPrice}两</div>
        </div>
      </div>`;
    }).join('');

    if(typeof townModalOpen === 'function'){
      townModalOpen('🏇 官方驿路', `
        <div style="padding:4px">
          <div style="color:#c8b060;font-size:11px;margin-bottom:6px">✨ 官方驿路快马加鞭，瞬息千里。选择一条驿路，再选定目的地。</div>
          <div style="color:#a0a070;font-size:11px;margin-bottom:8px">💰 当前银两：<b>${getSilver()}</b> 两 · 📍 当前：【${WORLD_NODES[current]?.name||'?'}】</div>
          ${routeCards}
          <div style="text-align:center;margin-top:6px"><button onclick="if(typeof townModalClose==='function')townModalClose(null)" style="background:rgba(100,100,100,.3);border:1px solid rgba(200,200,200,.2);color:#ccc;padding:5px 16px;border-radius:5px;cursor:pointer;font-size:12px">取消</button></div>
        </div>`);
    } else {
      travelShowMsg(`${node?.name||''} 驿站内，驿卒正在整理文书……（弹窗系统不可用）`, '🏇 驿站');
    }
    return;
  }

  const msgs = {
    shop:   `来到 ${node?.name} 商店，琳琅满目的物资摆在眼前……（可前往背包查看）`,
    market: `${node?.name} 集市热闹非凡，各地商人云集，稀奇货物应有尽有。`,
  };
  travelShowMsg(msgs[service]||`进入${svcName}`, svcName);
}
// 确保全局可访问
window.travelServiceAction = travelServiceAction;

// ══════════════════════════════════════
//  驿站辅助函数（模块顶层，确保始终注册到 window）
// ══════════════════════════════════════

// 第二级：选中线路后显示站点列表
window._pickPoststationRoute = function(routeId){
  console.log('[_pickPoststationRoute] 被调用:', routeId);
  const route = POST_ROUTES.find(r => r.id === routeId);
  console.log('[_pickPoststationRoute] 找到线路:', route?.name);
  if(!route){ showToast('驿路不存在','err'); return; }
  const current = travelCurrentCity || 'luoyang';
  const playerLevel = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;
  const distLi = (from, to) => { try { return travelCalcDist(from, to); } catch(e) { return 500; } };
  const calcPrice = (d) => Math.max(20, Math.round(15 + (d/100)*2.5 + playerLevel * 1 + 10));

  // 本线路所有可达站点
  const dests = route.stops.filter(id => id !== current && WORLD_NODES[id]);
  if(dests.length === 0){
    showToast('此线路没有其他目的地','warn'); return;
  }

  // 检查已到访标记
  const visitedRaw = JSON.parse(localStorage.getItem('wuxia_travel_history')||'[]');
  const visitedSet = new Set(Array.isArray(visitedRaw) ? visitedRaw : []);

  const stopCards = dests.map(id => {
    const n = WORLD_NODES[id];
    const d = distLi(current, id);
    const price = calcPrice(d);
    const tc = {capital:'#ffd700', major:'#80c8ff', minor:'#a0c8a0'}[n.tier]||'#ccc';
    const tl = {capital:'都城', major:'城镇', minor:'小镇'}[n.tier]||'';
    const isVisited = visitedSet.has(id);
    return `<div class="poststation-dest" data-dest="${id}" data-price="${price}" data-route="${route.name.replace(/"/g, '&quot;')}" style="display:flex;align-items:center;gap:10px;padding:9px;border:1px solid ${route.color}35;border-radius:8px;margin-bottom:5px;background:rgba(0,0,0,.22);cursor:pointer">
      <span style="font-size:20px">${n.icon||'📍'}</span>
      <div style="flex:1">
        <div style="color:${tc};font-weight:bold;font-size:13px">${n.name}${isVisited?'':' <span style="font-size:9px;color:#e09040">(未探索)</span>'}</div>
        <div style="color:rgba(160,160,140,.5);font-size:10px">${n.region||''} · ${tl} · 📏${d}里</div>
      </div>
      <div style="color:#ffd060;font-weight:bold;font-size:14px">${price}两</div>
    </div>`;
  }).join('');

  // 显示返回按钮
  townModalOpen(`🏇 ${route.icon} ${route.name}`, `
    <div id="poststation-dest-list" style="padding:4px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;cursor:pointer" onclick="_showPoststationRoutes()">
        <span style="font-size:12px">◀</span><span style="color:${route.color};font-size:11px">← 返回线路列表</span>
      </div>
      <div style="color:rgba(160,160,140,.5);font-size:10px;margin-bottom:6px">${route.desc} · 从【${WORLD_NODES[current]?.name}】出发</div>
      ${stopCards}
      <div style="text-align:center;margin-top:6px"><button onclick="if(typeof townModalClose==='function')townModalClose(null)" style="background:rgba(100,100,100,.3);border:1px solid rgba(200,200,200,.2);color:#ccc;padding:5px 16px;border-radius:5px;cursor:pointer;font-size:12px">取消</button></div>
    </div>`);

  // 绑定目的地卡片点击事件（在 townModalBody 上委托，确保能捕获到）
  const modalBody = document.getElementById('townModalBody');
  if (modalBody) {
    // 先移除旧的事件监听器（避免重复绑定）
    modalBody.removeEventListener('click', _onPoststationDestClick);
    modalBody.addEventListener('click', _onPoststationDestClick);
  }
};

// 委托点击处理函数
function _onPoststationDestClick(e) {
  const card = e.target.closest('.poststation-dest');
  if (card) {
    const destId = card.getAttribute('data-dest');
    const price = parseInt(card.getAttribute('data-price'));
    const routeName = card.getAttribute('data-route');
    _doPoststationTo(destId, price, routeName);
  }
}

// 返回线路列表
window._showPoststationRoutes = function(){
  if(typeof travelServiceAction === 'function') travelServiceAction('poststation', travelCurrentCity);
};

// 执行驿站传送（先弹确认，再扣费）
window._doPoststationTo = function(destId, price, routeName){
  console.log('[_doPoststationTo] 被调用:', { destId, price, routeName });
  try{
    const mySilver = getSilver();
    const dest = WORLD_NODES[destId];
    console.log('[_doPoststationTo] 目标城市:', dest?.name, '银两:', mySilver);
    if(!dest){ showToast('目标城市不存在','err'); return; }

    if(mySilver < price){
      // 银两不足：弹窗提示（返回驿站列表）
      if(typeof townModalOpen === 'function'){
        townModalOpen('💸 盘缠不足', `<div style="text-align:center;padding:22px 18px">
          <div style="font-size:48px;margin-bottom:12px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5))">💸</div>
          <div style="color:#e8a0a0;font-size:15px;font-weight:bold;margin-bottom:16px;letter-spacing:2px">盘缠不足</div>
          <div style="color:#c0a080;font-size:13px;line-height:2;margin-bottom:20px">
            前往<span style="color:#ffd060;font-weight:bold">【${dest.name}】</span><br>
            需要 <b style="color:#ff9090;font-size:16px">${price}</b> 两<br>
            囊中所剩 <b style="color:#80d080;font-size:16px">${mySilver}</b> 两
          </div>
          <div style="background:linear-gradient(90deg,transparent,rgba(120,80,40,.2),transparent);height:1px;margin:14px 0"></div>
          <div style="font-size:11px;color:#907060;line-height:1.8">若想节省银两，不妨徒步前往<br>江湖路途，或许会有奇遇</div>
          <div style="margin-top:18px;display:flex;gap:10px;justify-content:center">
            <button onclick="if(typeof _showPoststationRoutes==='function')_showPoststationRoutes()" style="background:rgba(80,60,40,.7);border:1px solid rgba(160,120,60,.4);color:#d0b080;padding:8px 24px;border-radius:8px;cursor:pointer;font-size:13px">知道了</button>
          </div>
        </div>`);
      } else {
        showToast(`银两不足！需要 ${price} 两（当前${mySilver}两）`,'err');
      }
      return;
    }

    // ── 二次确认卡片 ──
    const current = travelCurrentCity || 'luoyang';
    const fromName = WORLD_NODES[current]?.name || '?';
    if(typeof townModalOpen === 'function'){
      townModalOpen('🏇 确认出发', `
        <div style="text-align:center;padding:16px 12px">
          <div style="font-size:44px;margin-bottom:10px">🏇</div>
          <div style="color:#d4b06a;font-size:14px;line-height:2;margin-bottom:14px">
            从【<b>${fromName}</b>】出发<br>
            前往【<b style="color:#ffd060">${dest.name}</b>】<br>
            <span style="font-size:12px;color:#a08050">线路：${routeName||'官方驿路'}</span>
          </div>
          <div style="color:#e0b060;font-size:18px;font-weight:bold;margin-bottom:16px">
            费用：${price} 两 &nbsp;|&nbsp; 余额：${mySilver - price} 两
          </div>
          <div style="display:flex;gap:10px;justify-content:center">
            <button id="btn-poststation-cancel" style="background:rgba(80,80,80,.6);border:1px solid rgba(200,200,200,.2);color:#aaa;padding:7px 22px;border-radius:7px;cursor:pointer;font-size:13px">取消</button>
            <button id="btn-poststation-confirm" data-dest="${destId}" data-price="${price}" data-route="${routeName||''}" style="background:rgba(40,80,40,.9);border:1px solid rgba(80,160,80,.5);color:#80d080;padding:7px 22px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:bold">✅ 确认出发</button>
          </div>`);
      // 绑定按钮事件
      setTimeout(() => {
        const cancelBtn = document.getElementById('btn-poststation-cancel');
        const confirmBtn = document.getElementById('btn-poststation-confirm');
        if(cancelBtn) cancelBtn.onclick = () => townModalClose && townModalClose(null);
        if(confirmBtn) {
          confirmBtn.onclick = function() {
            const destId = this.getAttribute('data-dest');
            const price = parseInt(this.getAttribute('data-price'));
            const routeName = this.getAttribute('data-route');
            _doPoststationConfirm(destId, price, routeName);
          };
        }
      }, 0);
    } else {
      // fallback：原生confirm
      if(!confirm(`前往【${dest.name}】需要 ${price} 两，确认出发？`)) return;
      window._doPoststationConfirm(destId, price, routeName||'');
    }
    return;
  } catch(e){ console.error('[_doPoststationTo]', e); }
};

// 包装函数：从按钮 data 属性获取 destId
window._doPoststationConfirmWrapper = function(price, routeName){
  const btn = event.target;
  const destId = btn.getAttribute('data-dest');
  _doPoststationConfirm(destId, price, routeName);
};

// 确认后真正执行传送
window._doPoststationConfirm = function(destId, price, routeName){
  console.log('[_doPoststationConfirm] 开始传送:', { destId, price, routeName, currentCity: travelCurrentCity });
  try{
    // ① 检查地点访问权限（主线剧情限制）
    if(typeof checkLocationUnlocked === 'function'){
      const accessCheck = checkLocationUnlocked(destId);
      if(!accessCheck.unlocked){
        showToast(`🚫 ${WORLD_NODES[destId]?.name || destId}暂不可前往：${accessCheck.reason}`, 'warn');
        return;
      }
    }
    
    const dest = WORLD_NODES[destId];
    if(!dest){ showToast('目标城市不存在','err'); return; }
    console.log('[_doPoststationConfirm] 目标城市:', dest.name);

    // 检查是否首次到访（扣费前读，避免 visitedHistory 已更新）
    const visitedRaw = JSON.parse(localStorage.getItem('wuxia_travel_history')||'[]');
    const visitedSet = new Set(Array.isArray(visitedRaw) ? visitedRaw : []);
    const isFirstTime = !visitedSet.has(destId);

    // 扣费
    spendSilver(price);
    const oldCity = travelCurrentCity;

    // 更新位置（unshift 确保 travelHistory[0] 始终是当前城市，[1] 是上一个）
    travelCurrentCity = destId;
    cityId = destId;
    travelHistory = travelHistory.filter(id => id !== destId); // 去重
    travelHistory.unshift(destId);
    if(travelHistory.length > 10) travelHistory.length = 10;
    travelSave();

    // 更新 URL，确保刷新页面后城市正确
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('city', destId);
      window.history.replaceState({}, '', url.toString());
    } catch(e) {}

    // 关闭弹窗 & 刷新UI
    console.log('[_doPoststationConfirm] 刷新UI前:', { travelCurrentCity, destId });
    const node = WORLD_NODES[destId];
    console.log('[_doPoststationConfirm] node:', node?.name);
    if(node){
      if(typeof townRenderScene === 'function') {
        console.log('[_doPoststationConfirm] 调用 townRenderScene');
        townRenderScene(node);
        console.log('[_doPoststationConfirm] townRenderScene 完成, cityName:', document.getElementById('townCityName')?.textContent);
      }
      if(typeof townRenderServices === 'function') {
        console.log('[_doPoststationConfirm] 调用 townRenderServices');
        townRenderServices(node, destId);
      }
      // 刷新地下城入口
      const dgEl = document.getElementById('tlDungeonEntrances');
      console.log('[_doPoststationConfirm] 地下城元素:', dgEl);
      if(dgEl && typeof townRenderDungeonEntrances === 'function'){
        try { townRenderDungeonEntrances(destId, dgEl); } catch(e) { console.error('[townRenderDungeonEntrances]', e); }
      }
    }
    if(typeof renderCityNpcs === 'function') renderCityNpcs(destId);
    if(typeof townModalClose === 'function') townModalClose(null);
    if(typeof townRefreshStatus === 'function') townRefreshStatus();

    const routeTag = routeName || '驿路';
    showToast(`🏇 驿站快马！沿【${routeTag}】抵达【${dest.name}】（花费${price}两）`);
    const exploreFlavor = isFirstTime
      ? `\n⚡ 这是你第一次来到【${dest.name}】！四周景物陌生，充满未知……`
      : '';
    travelShowMsg(`你在【${WORLD_NODES[oldCity]?.name||'?'}】驿站登上【${routeTag}】的加急驿马，一路飞驰！\n不过半刻，便已身在【${dest.name}】街头！${exploreFlavor}\n💰 花费：${price}两 · 剩余：${getSilver()}两`, '🏇 驿站');
    travelRenderIndex();

    // 抵达新城市后触发任务推进（travel类任务在此自动完成+发奖）
    setTimeout(()=>{
      try{ if(typeof npcOnTravelComplete === 'function') npcOnTravelComplete(destId); }
      catch(e){ console.error('[doPoststationTo] npcOnTravelComplete err:', e); }
      try{ if(typeof jhOnArrival === 'function') jhOnArrival(destId); }
      catch(e){}
      try{ if(typeof wantedCheckOnArrival === 'function') wantedCheckOnArrival(destId); }
      catch(e){}
    }, 600);
  } catch(e){
    console.error('[_doPoststationConfirm]', e);
    showToast('⚠️ 传送失败', 'err');
  }
};
// ── 兼容旧接口：旧传音符持有者自动跳转驿站 ──
// 之前商店卖的千里传音符已改为「驿站急件」商品
// 如果玩家仍有旧的 wuxia_teleport Scrolls 计数，直接引导使用新驿站
window.useTeleportScroll = function(){
  const TP_KEY = 'wuxia_teleport Scrolls';
  const count = parseInt(localStorage.getItem(TP_KEY)||'0');
  if(count > 0){
    localStorage.setItem(TP_KEY, String(count - 1));
    showToast(`📜 旧传音符已回收，请前往驿站传送`, 'info');
    if(typeof travelServiceAction === 'function') travelServiceAction('poststation', travelCurrentCity);
  } else {
    showToast('🏇 请前往城镇【驿站】服务', 'info');
    if(typeof travelServiceAction === 'function') travelServiceAction('poststation', travelCurrentCity);
  }
};

window._doTeleportTo = function(destId){
  // 旧接口兼容 → 走驿站
  if(typeof travelServiceAction === 'function') travelServiceAction('poststation', travelCurrentCity);
};

// 快捷休息按钮（无论当前城市是否有旅店）
function travelRestAtInn(){
  // 兜底：若 travelCurrentCity 无效，尝试从 town.html 的全局 cityId 同步
  if (!travelCurrentCity && typeof cityId !== 'undefined') travelCurrentCity = cityId;
  if (!travelCurrentCity || !WORLD_NODES[travelCurrentCity]) travelCurrentCity = 'luoyang';
  const node = WORLD_NODES[travelCurrentCity];
  const hasInn = (node?.services||[]).includes('inn');
  if(!hasInn){
    // 野外露营：免费但只恢复一半
    travelPlayerState.energy = Math.min(100, travelPlayerState.energy + 40);
    travelPlayerState.hp     = Math.min(100, travelPlayerState.hp + 10);
    // 同步恢复 edS 中的血量（战斗系统使用）
    if(typeof edS !== 'undefined'){
      const maxHp = edS.maxHp || 100;
      edS.hp = Math.min(maxHp, Math.round(maxHp * travelPlayerState.hp / 100));
      // 保存到存档
      const edRaw = localStorage.getItem('wuxia_editor');
      if(edRaw){
        try{
          const edData = JSON.parse(edRaw);
          edData.hp = edS.hp;
          localStorage.setItem('wuxia_editor', JSON.stringify(edData));
        }catch(e){}
      }
      // 同时更新 wuxia_player_profile
      const profileRaw = localStorage.getItem('wuxia_player_profile');
      if(profileRaw){
        try{
          const profile = JSON.parse(profileRaw);
          profile.hp = edS.hp;
          profile.maxHp = edS.maxHp;
          profile.totalExp = edS.totalExp || 0;
          profile.level = edS.level || 1;
          localStorage.setItem('wuxia_player_profile', JSON.stringify(profile));
        }catch(e){}
      }
    }
    travelSave();
    travelShowMsg(`在野外搭帐篷歇息……气血+10%，精力+40\n⚡ 当前精力：${travelPlayerState.energy}%  ❤ 气血：${travelPlayerState.hp}%`, '🌿 野外露营');

    // ── 野外休息获得少量真气 ─────────────────────
    if(typeof addRealmQi === 'function'){
      addRealmQi(3, 'rest');
    }
    travelRenderIndex();
  } else {
    travelServiceAction('inn', travelCurrentCity);
  }
}

// ── 坐骑选择弹窗 ──
function travelShowHorsePicker(){
  const overlay = document.createElement('div');
  overlay.className = 'travel-ev-overlay';
  const currentKey = (typeof edS !== 'undefined' && edS.horseId) || null;

  const breedCards = Object.entries(HORSE_BREEDS).map(([key, b])=>{
    const dayLi = Math.round((b.travelSpeed||20) * 12);
    const isActive = key === currentKey;
    const speedBar = Math.round((b.travelSpeed||20) / 90 * 100); // 赤兔=100%
    return `<div class="hp-card${isActive?' hp-active':''}" onclick="travelSelectHorse('${key}', this.closest('.travel-ev-overlay'))" style="--hc:${b.color}">
      <span class="hp-icon">${b.icon}</span>
      <div class="hp-name" style="color:${b.color}">${b.name}</div>
      <div class="hp-desc">${b.desc}</div>
      <div class="hp-speed">
        <div class="hp-spd-bar"><div class="hp-spd-fill" style="width:${speedBar}%;background:${b.color}"></div></div>
        <span>日行≈${dayLi}里</span>
      </div>
      ${isActive?'<div class="hp-curr">▶ 当前坐骑</div>':''}
    </div>`;
  }).join('');

  overlay.innerHTML = `
    <div class="travel-hp-popup">
      <div class="ev-title">🐴 选择坐骑</div>
      <div style="font-size:10px;color:rgba(160,200,160,.5);margin-bottom:12px">坐骑速度影响旅途时间和精力消耗</div>
      <div class="hp-list">${breedCards}</div>
      <div style="display:flex;gap:10px;margin-top:14px;justify-content:center">
        <button class="ev-btn" onclick="travelSelectHorse(null,this.closest('.travel-ev-overlay'))">🚶 徒步</button>
        <button class="ev-btn" style="background:rgba(60,20,20,.4)" onclick="this.closest('.travel-ev-overlay').remove()">取消</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

// 选中坐骑
function travelSelectHorse(key, overlayEl){
  if(typeof edS !== 'undefined') edS.horseId = key || null;
  if(overlayEl) overlayEl.remove();
  travelRenderIndex();
  // 同步捏脸工坊马匹选择
  if(key && typeof pvSelectBreed === 'function') pvSelectBreed(key);
  const breed = key ? HORSE_BREEDS[key] : null;
  const msg = breed
    ? `已选择坐骑：${breed.icon} ${breed.name}（日行约${Math.round(breed.travelSpeed*12)}里）`
    : '已改为徒步旅行';
  travelShowMsg(msg, '坐骑');
}

// 点击门派跳转到门派志
function travelGoSect(sectId){
  const allTabs=document.querySelectorAll('.tab');
  const sectsTab=[...allTabs].find(t=>t.textContent.includes('门派志'));
  showPage('sects',sectsTab);
}

// 铁匠铺：找到当前城市的 smith NPC 并打开其对话框
function travelGoBlacksmith(cityId){
  const npcIds = (typeof WORLD_NODE_NPCS !== 'undefined') ? (WORLD_NODE_NPCS[cityId] || []) : [];
  // 找匹配 blacksmith 过滤器关键词的 NPC
  const filters = (typeof SVC_ROLE_FILTERS !== 'undefined') ? (SVC_ROLE_FILTERS.blacksmith || []) : ['铁匠','锻造','神兵铁匠'];
  const smithNpc = npcIds.find(npcId => {
    const npc = (typeof NPC_DB !== 'undefined') ? NPC_DB[npcId] : null;
    if(!npc) return false;
    const role = (npc.role || '').toLowerCase();
    return filters.some(k => role.includes(k.toLowerCase()));
  });
  if(smithNpc && typeof openNpcDialog === 'function'){
    openNpcDialog(smithNpc, cityId);
  } else {
    // 兜底：打开武器志
    travelGoWeapons();
  }
}

// 铁匠铺跳转到武器志（兜底）
function travelGoWeapons(){
  const allTabs=document.querySelectorAll('.tab');
  const wepTab=[...allTabs].find(t=>t.textContent.includes('武器志'));
  showPage('weapons',wepTab);
}

// 旅行提示弹窗（轻量级）
function travelShowMsg(text, title){
  const overlay = document.createElement('div');
  overlay.className = 'travel-ev-overlay';
  overlay.style.cursor = 'pointer';
  overlay.innerHTML = `
    <div class="travel-ev-popup ev-normal" style="max-width:360px">
      <div class="ev-title">${title||'江湖消息'}</div>
      <div class="ev-desc" style="margin-bottom:12px">${text}</div>
      <button class="ev-btn" onclick="this.closest('.travel-ev-overlay').remove()">知道了</button>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(()=>{ if(overlay.parentNode) overlay.remove(); }, 4000);
}

// 渲染全图索引（首次渲染骨架，之后更新高亮和访问状态）
let _indexRendered = false;
function travelRenderIndex(){
  const el = document.getElementById('travelIndex');
  if(!el) return;
  if(!_indexRendered){
    _indexRendered = true;
    const totalCities = Object.values(WORLD_NODES).length;
    // 更新统计标题
    const titleEl = document.querySelector('.travel-index-title');
    if(titleEl){
      const input = titleEl.querySelector('input');
      const inputHtml = input?.outerHTML||'';
      titleEl.innerHTML = `江湖全图 · <span style="color:rgba(160,220,180,.6)">${totalCities}</span> 处城镇 &nbsp; <span id="visitedCount" style="color:rgba(100,220,150,.5);font-size:10px"></span> ${inputHtml}`;
      const newInput = titleEl.querySelector('input');
      if(newInput) newInput.addEventListener('input', e=>citySearch(e.target.value));
    }
    el.innerHTML = Object.values(WORLD_NODES).map(node=>{
      const tc = NODE_TIER_COLOR[node.tier]||'#a0c8a0';
      return `<div class="city-chip" data-id="${node.id}"
        data-name="${node.name}" data-region="${node.region||''}"
        onclick="travelRenderLocation('${node.id}')">
        <span class="city-chip-icon">${node.icon||'📍'}</span>
        <div>
          <div class="city-chip-name" style="color:${tc}">${node.name}</div>
          <div class="city-chip-region">${node.region||''}</div>
        </div>
      </div>`;
    }).join('');
  }
  // 每次都更新高亮和已访问状态
  const visitedSet = new Set(travelHistory);
  document.querySelectorAll('.city-chip').forEach(c=>{
    const id = c.dataset.id;
    c.classList.toggle('current', id === travelCurrentCity);
    c.classList.toggle('visited', visitedSet.has(id) && id !== travelCurrentCity);
  });
  // 更新访问计数
  const vcEl = document.getElementById('visitedCount');
  if(vcEl) vcEl.textContent = `✓ 已探索 ${visitedSet.size} 处`;

  // ── 更新探索进度条 ──
  const totalCnt = Object.keys(WORLD_NODES).length;
  const visitCnt = visitedSet.size;
  const fillEl = document.getElementById('mapExploreFill');
  const pctEl  = document.getElementById('mapExplorePct');
  if(fillEl) fillEl.style.width = (visitCnt / Math.max(1,totalCnt) * 100).toFixed(1) + '%';
  if(pctEl)  pctEl.textContent  = `${visitCnt} / ${totalCnt}`;

  // ── 同时更新旅行玩家状态栏（颜色跟随数值变化）──
  const silvEl = document.getElementById('travelSilver');
  const hpEl   = document.getElementById('travelHp');
  const enEl   = document.getElementById('travelEnergy');
  if(silvEl) silvEl.textContent = getSilver() + '两';
  if(hpEl){
    const hpVal = travelPlayerState.hp;
    hpEl.textContent = hpVal + '%';
    hpEl.style.color = hpVal <= 20 ? '#ff4444'
                     : hpVal <= 40 ? '#ff8844'
                     : hpVal <= 60 ? '#ffcc44'
                     : hpVal <= 80 ? '#aadd66'
                     : '#44ee88';
    // 低血时父span加警示动画class
    const hpSpan = hpEl.closest('.tpb-item');
    if(hpSpan){
      hpSpan.classList.toggle('tpb-danger', hpVal <= 20);
      hpSpan.classList.toggle('tpb-warn',   hpVal > 20 && hpVal <= 40);
    }
  }
  if(enEl){
    const enVal = travelPlayerState.energy;
    enEl.textContent = enVal + '%';
    enEl.style.color = enVal <= 20 ? '#ff8844'
                     : enVal <= 40 ? '#ffcc44'
                     : enVal <= 60 ? '#d4e066'
                     : '#aaddff';
  }

  // ── 坐骑状态显示（含临时租马）──
  const horseBarEl = document.getElementById('travelHorseBar');
  if(horseBarEl){
    // 先检查租马
    let rentMount = null;
    try {
      const raw = localStorage.getItem('wuxia_mount');
      if(raw){
        const m = JSON.parse(raw);
        if(m && Date.now() < (m.expires||0)) rentMount = m;
      }
    } catch(e){}

    if(rentMount){
      const remainMin = Math.max(0, Math.ceil(((rentMount.expires||0)-Date.now())/60000));
      horseBarEl.innerHTML = `🐴 <b style="color:#e8d090">${rentMount.name}</b> <span style="font-size:9px;color:#ffd060">(租)·剩余${remainMin}分钟</span>`;
    } else if(typeof edS !== 'undefined' && edS.horseId && HORSE_BREEDS[edS.horseId]){
      const breed = HORSE_BREEDS[edS.horseId];
      const dayLi = Math.round((breed.travelSpeed||30) * 12);
      horseBarEl.innerHTML = `${breed.icon} <b style="color:${breed.color}">${breed.name}</b> <span style="font-size:9px;opacity:.6">日行≈${dayLi}里</span>`;
    } else {
      horseBarEl.innerHTML = `🚶 <span style="opacity:.6">步行</span> <span style="font-size:9px;opacity:.4">约480里/天</span>`;
    }
  }

  // ── 声誉栏更新 ──
  renderReputationBar();
  // ── 等级/经验栏更新 ──
  if(typeof renderPlayerExpBar === 'function') renderPlayerExpBar();
  // ── 根骨按钮角标：有未分配点数时亮红点 ──
  const rootBoneBtn = document.getElementById('tpbRootBone');
  if(rootBoneBtn && typeof edS !== 'undefined'){
    const free = edS.freePoints || 0;
    rootBoneBtn.classList.toggle('has-points', free > 0);
    rootBoneBtn.title = free > 0 ? `根骨加点（剩余 ${free} 点）` : '根骨加点';
  }
}

// 声誉数值 → 称号/颜色
function getRepInfo(rep){
  if(rep >= 150) return { label:'义侠',  color:'#80ffb0', icon:'⭐' };
  if(rep >= 100) return { label:'游侠',  color:'#c8ffa0', icon:'🌟' };
  if(rep >= 80)  return { label:'名声',  color:'#a0d0a0', icon:'🌟' };
  if(rep >= 50)  return { label:'恶名',  color:'#ffd080', icon:'⚠️' };
  if(rep >= 20)  return { label:'恶徒',  color:'#ff9060', icon:'💀' };
  return             { label:'公敌',  color:'#ff4040', icon:'☠️' };
}

function renderReputationBar(){
  const repVal = document.getElementById('travelRepValue');
  const repBar = document.getElementById('travelRepBar');
  if(!repVal || !travelPlayerState) return;

  const rep = travelPlayerState.reputation ?? 100;
  const info = getRepInfo(rep);
  repVal.textContent = rep;
  repVal.style.color = info.color;
  if(repBar) repBar.title = `声誉 ${rep} · ${info.label}`;

  // 通缉警告 banner（在状态栏下方）
  const warnId = 'wantedWarnBanner';
  let banner = document.getElementById(warnId);
  const wanted = (travelPlayerState.wantedBy || []).filter(w=> {
    if(w.expireDay === -1) return true;
    const curDay = (typeof edS !== 'undefined' ? edS.gameDay : 0) || 0;
    return curDay <= w.expireDay;
  });

  if(wanted.length > 0){
    const names = wanted.map(w=> w.sectName).join('、');
    const bannerText = `☠️ 通缉中：${names} 正在追杀你！`;
    if(!banner){
      banner = document.createElement('div');
      banner.id = warnId;
      banner.style.cssText = `
        background:rgba(120,10,10,.85);border:1px solid rgba(255,80,80,.4);
        color:#ffaaaa;font-size:11px;letter-spacing:1px;
        padding:4px 14px;text-align:center;
        animation:wantedPulse 2s ease-in-out infinite;
        cursor:pointer;
      `;
      banner.onclick = showReputationDetail;
      const tpbar = document.querySelector('.travel-player-bar');
      if(tpbar) tpbar.parentNode.insertBefore(banner, tpbar.nextSibling);
    }
    banner.textContent = bannerText;
  } else {
    banner?.remove();
  }
}

// 声誉详情弹窗（全功能版）
function showReputationDetail(){
  document.querySelectorAll('.rep-detail-ov').forEach(el => el.remove());

  const rep     = travelPlayerState?.reputation ?? 100;
  const info    = getRepInfo(rep);
  const wanted  = (travelPlayerState?.wantedBy || []);
  const curDay  = (typeof edS !== 'undefined' ? edS.gameDay : 0) || 0;
  const silver  = getSilver();

  const activeWanted = wanted.filter(w => w.expireDay === -1 || curDay <= w.expireDay);

  // ── 声誉条各段分隔标记 ──
  const REP_MILESTONES = [
    { v:180, label:'义薄云天', color:'#80ffb0' },
    { v:150, label:'一方名侠', color:'#60e890' },
    { v:120, label:'江湖游侠', color:'#a0d8a0' },
    { v:100, label:'过路武人', color:'#909090' },
    { v:80,  label:'浪客',    color:'#c8a060' },
    { v:50,  label:'恶名',    color:'#e07040' },
    { v:20,  label:'恶徒',    color:'#ff6040' },
    { v:0,   label:'公敌',    color:'#ff4040' },
  ];

  // 声誉条 HTML
  const repBarPct = Math.round(rep / 2); // 0-100%
  const milestoneMarksHtml = REP_MILESTONES.map(m => {
    const pct = m.v / 2;
    return `<div class="rep-milestone-mark" style="left:${pct}%;background:${m.color}" title="${m.label}(${m.v})"></div>`;
  }).join('');

  // 当前称号的效果说明
  const tierEffects = {
    '义薄云天': '正道门派弟子主动示好，通缉自动消除概率+30%，贡献奖励×1.5',
    '一方名侠': '正道商人折扣+10%，路遇正道NPC时友善',
    '江湖游侠': '大多数NPC中立对待，无特殊加成',
    '过路武人': '随遇而安，无加成无惩罚',
    '江湖浪客': '正道门派警惕，部分商人拒绝交易',
    '恶名在外': '正道门派追杀概率+20%，黑市商人更友善',
    '天下公敌': '进入正道城市必遭拦截，黑市专属道具解锁',
  };
  const curEffect = tierEffects[info.label] || '江湖中立，随遇而安。';

  // 通缉令 HTML
  const wantedRowsHtml = activeWanted.length
    ? activeWanted.map(w => {
        const bail = typeof calcBailAmount === 'function' ? calcBailAmount(w.sectId) : 200;
        const canBail = silver >= bail;
        const daysLeft = w.expireDay === -1 ? '永久' : `${Math.max(0, w.expireDay - curDay)}天后失效`;
        const killLabel = w.killCount >= 5 ? '🔴极度危险' : w.killCount >= 3 ? '🟠高度危险' : '🟡一般通缉';
        return `
          <div class="rep-wanted-row">
            <div class="rep-wanted-sect">
              <span class="rep-wanted-icon">☠️</span>
              <span style="color:#ffcccc;font-weight:bold">${w.sectName}</span>
              <span class="rep-wanted-level">${killLabel}</span>
            </div>
            <div class="rep-wanted-reason">罪名：${w.reason}</div>
            <div class="rep-wanted-meta">
              击杀×${w.killCount||1} &nbsp;·&nbsp; 悬赏 ${bail}两 &nbsp;·&nbsp; ${daysLeft}
            </div>
            <div class="rep-wanted-actions">
              <button class="rep-bail-btn ${canBail?'':'rep-bail-disabled'}"
                onclick="repDetailBail('${w.sectId}',${bail})"
                ${canBail?'':'disabled'}>
                💰 缴纳赎金 ${bail}两
              </button>
            </div>
          </div>`;
      }).join('')
    : `<div class="rep-no-wanted">✅ 当前无通缉在身</div>`;

  // 江湖传闻（根据声誉生成）
  const rumors = _genReputationRumors(rep, activeWanted);
  const rumorsHtml = rumors.map(r => `<div class="rep-rumor-item">${r}</div>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'rep-detail-ov';
  overlay.innerHTML = `
    <div class="rep-detail-box">
      <div class="rep-detail-header">
        <span class="rep-detail-icon">${info.icon}</span>
        <div>
          <div class="rep-detail-title" style="color:${info.color}">${info.label}</div>
          <div class="rep-detail-sub">江湖声誉 · ${rep} / 200</div>
        </div>
        <button class="rep-close-x" onclick="this.closest('.rep-detail-ov').remove()">✕</button>
      </div>

      <!-- 声誉条 -->
      <div class="rep-bar-wrap">
        <div class="rep-bar-bg">
          <div class="rep-bar-fill" style="width:${repBarPct}%;background:${info.color}"></div>
          ${milestoneMarksHtml}
        </div>
        <div class="rep-bar-labels">
          <span style="color:#ff4040">0 公敌</span>
          <span style="color:#909090">100 中立</span>
          <span style="color:#80ffb0">200 义侠</span>
        </div>
      </div>

      <!-- 当前效果 -->
      <div class="rep-effect-block">
        <div class="rep-section-title">✦ 声誉效果</div>
        <div class="rep-effect-text">${curEffect}</div>
      </div>

      <!-- 通缉令 -->
      <div class="rep-section-title">☠️ 通缉追杀</div>
      <div class="rep-wanted-list">${wantedRowsHtml}</div>

      <!-- 江湖传闻 -->
      <div class="rep-section-title">👂 江湖对你的看法</div>
      <div class="rep-rumors">${rumorsHtml}</div>

      <!-- 关闭 -->
      <button class="rep-main-close" onclick="this.closest('.rep-detail-ov').remove()">关闭</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });

  // 注入样式
  _injectRepDetailStyles();
}

// 赎金支付（从弹窗调用）
function repDetailBail(sectId, bail){
  if(!hasSilver(bail)){ showToast('银两不足！'); return; }
  if(typeof clearWanted === 'function'){
    spendSilver(bail);
    SilverManager.save();
    clearWanted(sectId, 'silver');
  }
  document.querySelectorAll('.rep-detail-ov').forEach(el => el.remove());
  setTimeout(showReputationDetail, 300);
}

// 根据声誉生成传闻文本
function _genReputationRumors(rep, activeWanted){
  const rumors = [];
  if(rep >= 180){
    rumors.push('📣 "此人义薄云天，江湖同道无不敬仰！"');
    rumors.push('📣 武林盟正考虑邀请其参加年度大会。');
  } else if(rep >= 150){
    rumors.push('📣 "这位侠士名声极佳，正道门派皆对其有好感。"');
    rumors.push('📣 路遇行人多主动致礼，唤作"大侠"。');
  } else if(rep >= 100){
    rumors.push('💬 "就是个来来去去的武人，没听过什么特别的事。"');
    rumors.push('💬 无显著名声，江湖各方持中立态度。');
  } else if(rep >= 80){
    rumors.push('⚠️ "此人行事颇为飘忽，不是省油的灯。"');
    rumors.push('⚠️ 部分正道门派开始对其保持警惕。');
  } else if(rep >= 50){
    rumors.push('🔴 "不可交！此人恶名在外，江湖中人皆避之不及！"');
    rumors.push('🔴 进入大城市时，常有人交头接耳、指指点点。');
  } else {
    rumors.push('💀 "天下公敌！见者诛之，赏银千两！"');
    rumors.push('💀 各大正道门派联合发出追杀令。');
  }
  if(activeWanted.length > 0){
    rumors.push(`🚨 "${activeWanted[0].sectName}等${activeWanted.length}个门派正在追缉此人！"`);
  }
  return rumors;
}

// 注入声誉面板样式
function _injectRepDetailStyles(){
  if(document.getElementById('rep-detail-styles')) return;
  const st = document.createElement('style');
  st.id = 'rep-detail-styles';
  st.textContent = `
.rep-detail-ov {
  position:fixed;inset:0;z-index:9980;
  background:rgba(0,0,0,.82);
  display:flex;align-items:center;justify-content:center;
  padding:16px;box-sizing:border-box;
}
.rep-detail-box {
  background:linear-gradient(160deg,rgba(8,18,10,.98),rgba(4,10,5,.99));
  border:1px solid rgba(80,180,100,.25);
  border-radius:14px;
  padding:20px 18px 16px;
  max-width:380px;width:100%;
  max-height:90vh;overflow-y:auto;
  box-shadow:0 0 40px rgba(0,180,80,.1),0 8px 32px rgba(0,0,0,.6);
  font-family:'Courier New',monospace;
}
.rep-detail-header {
  display:flex;align-items:center;gap:12px;margin-bottom:14px;
}
.rep-detail-icon { font-size:28px; }
.rep-detail-title { font-size:18px;font-weight:bold;letter-spacing:3px; }
.rep-detail-sub { font-size:10px;color:rgba(160,200,160,.5);letter-spacing:2px;margin-top:2px; }
.rep-close-x {
  margin-left:auto;background:transparent;
  border:1px solid rgba(160,200,160,.2);border-radius:50%;
  color:rgba(160,200,160,.5);width:26px;height:26px;
  font-size:11px;cursor:pointer;transition:border-color .2s;
}
.rep-close-x:hover { border-color:rgba(160,200,160,.6);color:rgba(160,200,160,.9); }

/* 声誉条 */
.rep-bar-wrap { margin-bottom:14px; }
.rep-bar-bg {
  position:relative;height:10px;
  background:rgba(255,255,255,.07);
  border-radius:5px;overflow:visible;
  margin-bottom:5px;
}
.rep-bar-fill {
  height:100%;border-radius:5px;
  transition:width .5s ease;
  box-shadow:0 0 8px currentColor;
}
.rep-milestone-mark {
  position:absolute;top:-3px;width:2px;height:16px;
  border-radius:1px;opacity:.4;pointer-events:none;
}
.rep-bar-labels {
  display:flex;justify-content:space-between;
  font-size:9px;color:rgba(160,160,160,.5);
  letter-spacing:1px;margin-top:3px;
}

/* 效果块 */
.rep-effect-block {
  background:rgba(255,255,255,.03);
  border:1px solid rgba(80,160,80,.15);
  border-radius:8px;padding:10px 12px;
  margin-bottom:14px;
}
.rep-section-title {
  font-size:10px;letter-spacing:3px;
  color:rgba(120,200,140,.5);
  margin-bottom:8px;margin-top:6px;
}
.rep-effect-text {
  font-size:11px;color:rgba(160,200,160,.75);
  line-height:1.7;letter-spacing:1px;
}

/* 通缉令 */
.rep-wanted-list { margin-bottom:12px; }
.rep-no-wanted {
  font-size:11px;color:rgba(100,180,100,.5);
  padding:8px 0;letter-spacing:1px;
}
.rep-wanted-row {
  background:rgba(120,0,0,.15);
  border:1px solid rgba(255,80,80,.2);
  border-radius:8px;padding:10px 12px;
  margin-bottom:8px;
}
.rep-wanted-sect {
  display:flex;align-items:center;gap:8px;
  margin-bottom:4px;
}
.rep-wanted-icon { font-size:14px; }
.rep-wanted-level {
  font-size:10px;
  background:rgba(255,60,60,.15);
  border-radius:3px;padding:1px 5px;
}
.rep-wanted-reason {
  font-size:10px;color:rgba(200,140,140,.6);
  letter-spacing:1px;margin-bottom:3px;
}
.rep-wanted-meta {
  font-size:10px;color:rgba(180,120,120,.5);
  letter-spacing:1px;margin-bottom:6px;
}
.rep-wanted-actions { display:flex;gap:8px; }
.rep-bail-btn {
  background:rgba(180,120,0,.2);
  border:1px solid rgba(220,160,60,.3);
  border-radius:5px;color:rgba(220,185,100,.85);
  padding:5px 12px;font-size:10px;letter-spacing:1px;
  cursor:pointer;transition:background .2s;
}
.rep-bail-btn:hover:not([disabled]) { background:rgba(180,120,0,.4); }
.rep-bail-disabled { opacity:.35;cursor:not-allowed; }

/* 传闻 */
.rep-rumors { margin-bottom:14px; }
.rep-rumor-item {
  font-size:11px;color:rgba(160,200,160,.65);
  line-height:1.8;letter-spacing:1px;
  padding:3px 0;
  border-bottom:1px solid rgba(80,160,80,.08);
}

/* 关闭按钮 */
.rep-main-close {
  width:100%;background:rgba(40,80,50,.4);
  border:1px solid rgba(80,160,80,.2);
  border-radius:8px;color:rgba(140,200,160,.7);
  padding:9px;font-size:12px;letter-spacing:3px;
  cursor:pointer;transition:background .2s;
}
.rep-main-close:hover { background:rgba(40,80,50,.7); }
  `;
  document.head.appendChild(st);
}



// ── 等级详情弹窗 ──────────────────────────────────────────────
function showLevelDetail(){
  if(typeof expNeededForLevel === 'undefined') return;
  const lv       = (typeof edS !== 'undefined' ? edS.level : 1) || 1;
  const totalExp = (typeof edS !== 'undefined' ? edS.totalExp : 0) || 0;
  const title    = (typeof getLevelTitle === 'function') ? getLevelTitle(lv) : '';
  const maxLv    = (typeof MAX_LEVEL !== 'undefined') ? MAX_LEVEL : 150;

  let expHtml = '';
  if(lv >= maxLv){
    expHtml = `<div style="color:#ffd060;font-size:13px;text-align:center;padding:8px 0">已达满级 · 天下第一</div>`;
  } else {
    const expThisLv = expNeededForLevel(lv);
    const expNextLv = expNeededForLevel(lv + 1);
    const expIn     = totalExp - expThisLv;
    const expNeed   = expNextLv - expThisLv;
    const pct       = Math.min(100, (expIn / expNeed * 100)).toFixed(1);
    expHtml = `
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(200,180,100,.7);margin-bottom:4px">
          <span>升至 Lv${lv+1}</span>
          <span>${expIn.toLocaleString()} / ${expNeed.toLocaleString()} 经验</span>
        </div>
        <div style="height:8px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#c89020,#ffd060);border-radius:4px;transition:width .4s"></div>
        </div>
      </div>
      <div style="font-size:10px;color:rgba(180,160,80,.5);margin-top:4px">累计经验：${totalExp.toLocaleString()}</div>`;
  }

  // 属性成长预览
  const lvBonus = (typeof getLevelBonus === 'function') ? getLevelBonus(lv) : {};
  const growthHtml = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:12px;font-size:11px">
      <div style="background:rgba(255,255,255,.04);border-radius:5px;padding:5px 0;text-align:center">
        <div style="color:#ff8080">${100 + (lvBonus.hp||0)}</div><div style="opacity:.5;font-size:9px">气血</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:5px;padding:5px 0;text-align:center">
        <div style="color:#ffb060">${15 + (lvBonus.atk||0)}</div><div style="opacity:.5;font-size:9px">攻击</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:5px;padding:5px 0;text-align:center">
        <div style="color:#80b0ff">${10 + (lvBonus.def||0)}</div><div style="opacity:.5;font-size:9px">防御</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:5px;padding:5px 0;text-align:center">
        <div style="color:#80e0ff">${100 + (lvBonus.mp||0)}</div><div style="opacity:.5;font-size:9px">内力</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:5px;padding:5px 0;text-align:center">
        <div style="color:#c0ff80">${(8 + (lvBonus.spd||0)).toFixed(1)}</div><div style="opacity:.5;font-size:9px">速度</div>
      </div>
      <div style="background:rgba(255,255,255,.04);border-radius:5px;padding:5px 0;text-align:center">
        <div style="color:#ffd060">Lv${lv}</div><div style="opacity:.5;font-size:9px">等级</div>
      </div>
    </div>
    <div style="font-size:9px;color:rgba(160,140,80,.4);margin-top:8px;text-align:center">
      每级：气血+8 · 攻击+2 · 防御+1 · 内力+5 · 速度+0.1
    </div>`;

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  overlay.onclick = e => { if(e.target===overlay) overlay.remove(); };
  overlay.innerHTML = `<div style="background:linear-gradient(160deg,#1a1500,#0e0c00);border:1px solid rgba(255,200,60,.25);border-radius:12px;padding:20px 24px;min-width:280px;max-width:360px">
    <div style="font-size:15px;color:#ffd060;margin-bottom:4px">⚔ 等级 · ${title}</div>
    <div style="font-size:11px;color:rgba(200,180,80,.5);margin-bottom:14px">Lv ${lv} / ${maxLv}</div>
    ${expHtml}
    ${growthHtml}
    <div style="text-align:right;margin-top:16px">
      <button onclick="this.closest('div[style]').remove()" style="background:rgba(80,70,20,.6);border:1px solid rgba(200,160,40,.3);color:#c8a840;padding:5px 16px;border-radius:5px;cursor:pointer;font-size:11px">关闭</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
}
function citySearch(q){
  q = q.trim().toLowerCase();
  document.querySelectorAll('.city-chip').forEach(c=>{
    const name   = (c.dataset.name||'').toLowerCase();
    const region = (c.dataset.region||'').toLowerCase();
    c.style.display = (!q || name.includes(q) || region.includes(q)) ? '' : 'none';
  });
}



function renderWeaponsPage(){
  const grid=document.getElementById('weaponsGrid');
  const filterEl=document.getElementById('wepFilter');
  if(!grid||!filterEl) return;
  // 过滤按钮
  const rarities=[['all','✦ 全部'],['legendary','传说'],['epic','史诗'],['rare','精良'],['common','普通']];
  filterEl.innerHTML=rarities.map(([k,l])=>`<button class="wep-filter-btn${_wepFilter===k?' active':''}" onclick="filterWeapons('${k}')">${l} ${k==='all'?'('+WEAPONS.length+')':'('+WEAPONS.filter(w=>w.rarity===k).length+')'}</button>`).join('');
  // 武器列表
  const list = _wepFilter==='all' ? WEAPONS : WEAPONS.filter(w=>w.rarity===_wepFilter);
  const rarityOrder={legendary:0,epic:1,rare:2,common:3};
  list.sort((a,b)=>(rarityOrder[a.rarity]||9)-(rarityOrder[b.rarity]||9));
  grid.innerHTML=list.map(w=>{
    const ri=WEP_RARITY[w.rarity]||WEP_RARITY.common;
    const statHtml=`<span class="wep-stat positive">⚔+${w.atkBonus} 攻击</span>`
      +(w.critBonus?`<span class="wep-stat positive">🎯+${Math.round(w.critBonus*100)}% 暴击</span>`:'')
      +(w.defBonus?`<span class="wep-stat positive">🛡+${w.defBonus} 防御</span>`:'')
      +(w.hpBonus?`<span class="wep-stat positive">❤+${w.hpBonus} 气血</span>`:'')
      +(w.mpBonus?`<span class="wep-stat positive">💙+${w.mpBonus} 内力</span>`:'')
      +(w.dodgeBonus?`<span class="wep-stat positive">💨+${w.dodgeBonus}% 闪避</span>`:'')
      +(w.speedBonus?`<span class="wep-stat positive">⚡+${w.speedBonus} 速度</span>`:'')
      +(w.special&&w.special!=='无特殊效果'?`<span class="wep-stat special">✦ ${w.special.slice(0,28)}…</span>`:'');
    // 哪些角色在用
    const users=Object.entries(CHAR_WEAPON).filter(([cid,wid])=>wid===w.id).map(([cid])=>CHARS.find(c=>c.id===cid)).filter(Boolean);
    const userHtml=users.length?`<div style="margin-top:8px;font-size:9px;color:rgba(140,180,220,.4);letter-spacing:2px">▸ 持有者：${users.map(c=>`<span style="color:${c.color}">${c.name}</span>`).join(' ')}</div>`:'';
    return `<div class="wep-card wep-${w.rarity}"
      style="--wc-color:${w.color};--wc-color2:${w.color2};--wc-glow:${w.glow};--wc-border:${w.border};--wc-bg1:${w.bg1}">
      <div class="wep-card-topbar"></div>
      <div class="wep-banner">
        <div class="wep-emblem" style="--wc-glow:${w.glow}">${getWepAsciiHtml(w.cat, w.color)}</div>
        <div class="wep-info">
          <div class="wep-name">${w.name}</div>
          <div class="wep-type">${w.type}</div>
          <div class="wep-rarity" style="border-color:${ri.border};color:${ri.color};background:${ri.bg1}">${ri.label}</div>
        </div>
      </div>
      <div class="wep-body">
        <div class="wep-desc">${w.desc}</div>
        <div class="wep-stats">${statHtml}</div>
        ${userHtml}
      </div>
    </div>`;
  }).join('');
}
function filterWeapons(k){ _wepFilter=k; renderWeaponsPage(); }

// ── 服务按钮涟漪效果（事件代理，全局初始化一次）──
(function initSvcRipple(){
  document.addEventListener('click', e=>{
    const btn = e.target.closest('.tl-service-btn');
    if(!btn) return;
    const r = document.createElement('span');
    r.className = 'svc-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;`
      + `left:${e.clientX-rect.left-size/2}px;`
      + `top:${e.clientY-rect.top-size/2}px;`;
    btn.appendChild(r);
    setTimeout(()=> r.remove(), 520);
  });
})();


// ════════════════════════════════════════════════
//  通用游戏对话框（供五子棋/锻造/采药等小游戏共用）
// ════════════════════════════════════════════════

let _gameDialogOverlay = null;
let _gameDialogOnClose = null;

function showGameDialog(config) {
  // 先关闭已有的
  closeGameDialog();

  const w = config.width || 850;
  const h = config.height || 620;
  const title = config.title || '小游戏';

  const overlay = document.createElement('div');
  overlay.id = 'gameDialogOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9998;
    background:rgba(0,0,0,.88);
    display:flex;align-items:center;justify-content:center;
    animation:ppFadeIn .25s ease;
  `;
  overlay.innerHTML = `
    <div id="gameDialogBox" style="
      position:relative;
      width:${Math.min(w, window.innerWidth - 16)}px;
      max-height:${Math.min(h, window.innerHeight - 16)}px;
      background:linear-gradient(160deg,rgba(10,15,12,.98),rgba(6,10,8,.99));
      border:1px solid rgba(100,180,120,.2);
      border-radius:14px;
      display:flex;flex-direction:column;
      overflow:hidden;
      box-shadow:0 0 60px rgba(0,120,60,.08),0 12px 40px rgba(0,0,0,.6);
    ">
      <div style="
        display:flex;align-items:center;justify-content:space-between;
        padding:10px 16px;
        background:rgba(0,0,0,.3);
        border-bottom:1px solid rgba(100,180,120,.12);
        flex-shrink:0;
      ">
        <span style="font-size:14px;font-weight:bold;color:#c8e8d0;letter-spacing:2px">${title}</span>
        <button onclick="closeGameDialog()" style="
          background:transparent;border:1px solid rgba(160,200,160,.2);
          border-radius:50%;color:rgba(160,200,160,.5);width:26px;height:26px;
          font-size:12px;cursor:pointer;transition:border-color .2s;
        ">✕</button>
      </div>
      <div id="gameDialogContent" style="
        flex:1;overflow-y:auto;padding:14px 16px;
        -webkit-overflow-scrolling:touch;
        scrollbar-width:none; -ms-overflow-style:none;
      "></div>
      <style>#gameDialogContent::-webkit-scrollbar{display:none}</style>
    </div>
  `;
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeGameDialog();
  });

  document.body.appendChild(overlay);
  _gameDialogOverlay = overlay;
  _gameDialogOnClose = typeof config.onClose === 'function' ? config.onClose : null;

  // 填充内容
  const contentEl = document.getElementById('gameDialogContent');
  if (contentEl && config.content) {
    contentEl.innerHTML = config.content;
  }
}

function closeGameDialog() {
  if (_gameDialogOnClose) {
    try { _gameDialogOnClose(); } catch(e) { console.error('[closeGameDialog]', e); }
    _gameDialogOnClose = null;
  }
  if (_gameDialogOverlay) {
    _gameDialogOverlay.remove();
    _gameDialogOverlay = null;
  }
}

// ════════════════════════════════════════════════════════
//  进城第一眼旁白  _getArrivalFlavor(node, isFirstVisit)
//  按城市等级、地形、是否首次到访随机选一条沉浸式描述
// ════════════════════════════════════════════════════════
function _getArrivalFlavor(node, isFirstVisit){
  if(!node) return '';
  const tier    = node.tier    || 'minor';
  const terrain = node.terrain || '';
  const type    = node.type    || '';

  // ── 门派圣地专属 ──
  if(type === 'sect_location'){
    const sectFlavors = [
      '山门前的青石板路被无数双脚踏磨得光滑，两侧松柏高耸入云，空气里带着一缕香烟气。',
      '远远便见山门，隐在云雾里，透着一股不问世事的清绝。踏入此地，江湖的喧嚣顿时淡了许多。',
      '门前弟子端立如松，目光如炬，只淡淡扫了你一眼，也未阻拦。你整了整衣衫，迈步而入。',
      '这里的空气不太一样，带着一股久远年代的沉积，如同每一块砖石都见过无数江湖风雨。',
    ];
    return sectFlavors[Math.floor(Math.random()*sectFlavors.length)];
  }

  // ── 按地形分流 ──
  const terrainFlavors = {
    '高山': [
      '山风扑面而来，冷冽干净，带着远处雪线的气息。海拔越高，人也越少，偶尔只有鹰在头顶盘旋。',
      '峭壁巍峨，道路险窄，一脚踩稳才能迈出下一步。风声如哨，从某处岩缝里穿过，幽长而空洞。',
    ],
    '山地': [
      '山路蜿蜒，林间光线斑驳，踩过几段青苔湿润的石阶，终于见到了人烟。',
      '山里的空气湿而凉，你呼出一口白雾，在林间树梢间漫散开去。',
    ],
    '沙漠': [
      '沙粒细细地扑在脸上，黄沙漫无边际。热风卷过来，带着一股干燥的灼意，连眼睛都睁不太开。',
      '日头毒辣，脚下的沙地烫得发烫。远处的建筑在热浪中微微扭曲，像是海市蜃楼，走近才实了。',
    ],
    '水乡': [
      '河网纵横，乌篷船穿行其间，偶有橹声划破水面，撑船人低声哼着不知名的小调。',
      '石桥拱起，水面倒映着粉墙黛瓦，烟雨如丝。这里慢悠悠的，连脚步都跟着轻了。',
    ],
    '海': [
      '海风带着咸湿的腥味扑来，远处波光粼粼，几艘大船在锚地静静停泊，旗帜在风里猎猎作响。',
      '海浪声从不远处传来，沉而有力，与内陆的山风完全不同，听着竟莫名平静。',
    ],
    '密林': [
      '树冠浓密，遮住了大半天光，林间幽暗而潮湿，脚下枯叶踩起来簌簌作响。',
      '深林里不知藏着什么，各种鸟鸣交替响起，间或有枝条轻折的声音，让人不由放慢脚步。',
    ],
    '竹林': [
      '修竹成林，风过时竹叶轻响，沙沙不绝。阳光透过竹梢漏下，地面碎影摇曳，清幽至极。',
      '竹子长得笔直而密，将两侧的天光几乎遮严。走在其中，仿佛整个世界只剩这一条窄径。',
    ],
    '冰原': [
      '脚下积雪压得厚实，每一步都踩出深坑。四下里白茫茫一片，风声刮过，刀割一般。',
      '冰雪无声。太安静了，安静得有些不自然，只有偶尔的雪粒被风扬起，细细地打在脸上。',
    ],
    '要塞': [
      '城墙高厚，守卫腰间挂刀，目光警惕。进出的人都被仔细查验，每个人都走得小心翼翼。',
      '烽火台在远处静立，此地常年是兵家必争之地，空气里仿佛还残留着往日金戈铁马的气息。',
    ],
  };

  // 找到匹配地形的文案
  for(const [key, flvs] of Object.entries(terrainFlavors)){
    if(terrain.includes(key)){
      return flvs[Math.floor(Math.random()*flvs.length)];
    }
  }

  // ── 按城市等级分流（首次/再访不同文案）──
  if(tier === 'capital'){
    const firstTime = [
      '城门高耸，车马如流，小贩的吆喝声与远处钟楼的钟声交织在一起。这是你第一次踏入这座大城，一时有些茫然，不知该先往哪里走。',
      '护城河宽阔，吊桥放下，人流摩肩接踵。这座都城的气象与你此前见过的任何地方都不同——大，嘈杂，且充满了各种各样的人。',
      '城楼上的旗幡迎风飘展，城门洞里人声鼎沸。入了城，立刻被人群裹挟着往前走，你暗自感叹：江湖之大，不过如此。',
    ];
    const returnTime = [
      '老地方了。城门守卫换了一批新面孔，但城里那股油烟气和喧嚣声一如往昔。',
      '熟悉的街道，熟悉的叫卖声。再次回到这里，像是换了个人看同一幅画，有些东西一样，有些又不一样了。',
      '踏进城门的那一刻，脑子里不由自主地回忆起上一次来时的事——那时候的自己，和现在还不太一样。',
    ];
    const pool = isFirstVisit ? firstTime : returnTime;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  if(tier === 'major'){
    const firstTime = [
      '镇子比你想象中热闹，街道两侧店铺林立，各色招幌随风摇晃。你揉了揉走酸的小腿，四下打量起来。',
      '这地方比路上的小村镇大不少。人来人往，有行商，有武人，还有三五成群的江湖闲汉在街头聊天。',
      '沿着主街走进去，香气和噪音一起扑来。你驻足片刻，感觉这里随便扯住一个人，都可能有段说不完的故事。',
    ];
    const returnTime = [
      '又来了。镇子还是老样子，只是你的心境不同了，看什么都带着不一样的眼光。',
      '街尾那家面馆还在，门口坐着两个晒太阳的老人，好像从没动过。这地方有一种奇特的静止感。',
      '上回离开时，有件事没做完。这次不知道能不能弥补。你漫无目的地走进去，走一步算一步。',
    ];
    const pool = isFirstVisit ? firstTime : returnTime;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  // minor / 其他
  const firstTime = [
    '不大的地方，三两户人家，一两间铺子，一条窄街走到头。你来了，算是今日到此的外乡人。',
    '村口的老槐树叶子沙沙响。几个孩童好奇地打量你，随后又跑开了。小地方消息灵通，你的到来大概很快就要传开。',
    '路边茶摊，一壶劣茶，两块糙点。你坐下来，听了几句本地人议论家常，摸了个大致方向。',
  ];
  const returnTime = [
    '小地方，记性好的人多。你一进村，就有眼熟的人朝你点了点头。',
    '又回来了，就好像出门转了一圈，一切都没变，又都变了点儿。',
    '这里比你记忆里的小。或者说，是你走的地方多了，才觉得小了。',
  ];
  const pool = isFirstVisit ? firstTime : returnTime;
  return pool[Math.floor(Math.random()*pool.length)];
}

// travel-render 文件加载完毕
