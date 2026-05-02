/* ================================================================
 *  sect-map.js v=37 — 门派大字符画地图系统
 *  即时战斗式移动（rogue-auto 模式）
 *  ================================================================ */

(function(){
  'use strict';

  /* ===== 配置 ===== */
  var FONT_SIZE   = 16;     // 字号(px)
  var CELL_W      = 0.60;   // 字符宽高比
  var CELL_H      = 1.15;
  var MOVE_SPEED  = 6;      // 格/秒（即时战斗速度）

  var $viewport, $canvas, $player, $pcBody;
  var $minimap, $sbPos, $sbSect, $sbHint;
  var camera    = { x:0, y:0 };
  var charPos   = { x:0, y:0 };
  var charDir   = 'down';
  var isMoving  = false;
  var keys      = {};
  var touchDir  = { x:0, y:0 };
  var lastTime  = 0;
  var animFrame = null;
  var mapData   = null;
  var npcEls    = {};
  var curNPCId  = null;

  /* ===== 主角精灵图（8方向）====== */
  var PLAYER_SPRITES = {
    down:  [
      ['\u2588\u2588\u2588\u2588\u2588','\u2588 \u263a \u2588','\u2588\u255d\u2567\u255d\u2588'],
      ['\u2588\u2588\u2588\u2588\u2588','\u2588 \u263a \u2588','\u2588\u255a\u2567\u255a\u2588']
    ],
    up: [
      ['\u2588\u2588\u2588\u2588\u2588','\u2588 \u263a \u2588','\u2559\u2563\u2559\u2563\u2588'],
      ['\u2588\u2588\u2588\u2588\u2588','\u2588 \u263a \u2588','\u2559\u2563\u2559\u2563\u2588']
    ],
    left: [['\u2588\u2588\u2588\u2588\u2588','\u2588 \u00b7 \u2588','\u2588\u255d\u2567\u255a']],
    right:[['\u2588\u2588\u2588\u2588\u2588','\u00b7 \u263a \u2588','\u2559\u2567\u255a\u2588']]
  };
  PLAYER_SPRITES.upleft   = PLAYER_SPRITES.left;
  PLAYER_SPRITES.upright  = PLAYER_SPRITES.right;
  PLAYER_SPRITES.downleft = PLAYER_SPRITES.left;
  PLAYER_SPRITES.downright= PLAYER_SPRITES.right;
  var PLAYER_STAND = {
    down:['\u2588\u2588\u2588\u2588\u2588','\u2588 \u263a \u2588','\u2588\u2567\u2567\u2567\u2588'],
    up:  ['\u2588\u2588\u2588\u2588\u2588','\u2588 \u263a \u2588','\u2559\u2559\u2559\u2563\u2588'],
    left:['\u2588\u2588\u2588\u2588\u2588','\u2588 \u00b7 \u2588','\u2588\u2567\u255a\u2588'],
    right:['\u2588\u2588\u2588\u2588\u2588','\u00b7 \u263a \u2588','\u2559\u2567\u255a\u2588']
  };
  PLAYER_STAND.upleft   = PLAYER_STAND.left;
  PLAYER_STAND.upright  = PLAYER_STAND.right;
  PLAYER_STAND.downleft = PLAYER_STAND.left;
  PLAYER_STAND.downright= PLAYER_STAND.right;

  function _e(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  /* ===== 格子类型 -> CSS类名 ===== */
  function cellClass(ch){
    if('\u2551\u2554\u2557\u255a\u255d\u2564\u2567\u2569\u2550\u2502\u250c\u2510\u2514\u2518\u252c\u2534\u2570\u2566\u253c\u2524\u256c\u2574\u2560'.indexOf(ch) >= 0) return 'wall';
    if(ch === ' ') return 'path';
    if(ch === '.' || ch === '\u00b7') return 'grass';
    if(ch === '~' || ch === '\u2248' || ch === '\uff5e') return 'water';
    if('\u25b2\u25b1\u25b4\u25b5\u26f0\ud83c\udf32\ud83c\udf33\ud83c\udf34'.indexOf(ch) >= 0) return 'tree';
    if('SDTGMLP'.indexOf(ch) >= 0) return 'door';
    if(ch === '@') return 'special';
    if('\u2588\u2593\u2592\u2591\u25a0\u25a1'.indexOf(ch) >= 0) return 'building-inner';
    return '';
  }

  function isPassable(ch){
    return ' .\u00b7~\u2248\uff5e@SDTGMLP'.indexOf(ch) >= 0;
  }

  function canWalk(x, y){
    if(x < 0 || x >= mapData.w || y < 0 || y >= mapData.h) return false;
    return isPassable(mapData.grid[y][x]);
  }

  var SECT_MAPS = {

    'shaolin': {
      color: '#d4a020',
      name: '\u5c11\u6797\u5bfa',
      w: 100,
      h: 72,
      spawnPos: { x:51, y:71 },
      map: [
    '······························⛰嵩山⛰······························································    ',
    '····························╚════════════════════════════════════════════╝··························',
    '·························╔╗··········································╔╝·····························',
    '·······················╔══╩╝······································后山小径····················║╚════╗   ',
    '·····················╔══╩╝  ╚══════╗  ⛰崖壁⛰  ╠══════════╩╗                                           ',
    '╔═══╩╝         ╚══════╗   ⛰  ╚════════════════════╝   ╠══════╗                                      ',
    '╔╩╝ ···L后山出口····╚══════╗     ⛰    ║╚══════╩╗                                                        ',
    '╩╝  ···通往塔林···  ╚════╝   ⛰       ║╚════════════════════════╝                                        ',
    '╔╩╝ ···塔林···  ⛰  🗼🗼🗼  ···  ║  ╠╗                                                                    ',
    '╩╝ ·古 松 林 ·⛰  🗼  ·   ║  │║                                                                          ',
    '│ ··· ││    ···  ┌┴┐  ·····  ║  │║                                                                  ',
    '│ · ┌──┴──┐  ·  ║藏║  ·    │  │║                                                                     ',
    '│··│藏经阁│···╚════╝  ·   │  │║                                                                        ',
    '│  └──┬──┘  ·    │    ·    │  │║                                                                    ',
    '╠══╪════════════════╧·══════════════╩  │  │║                                                        ',
    '║     ┌────────┐          │        ║                                                ┌────┐          ',
    '║     │ 达摩院  │    🧘   │        ║                                                    │Z藏经阁│          ',
    '║     │   🧘   │          │        ║                                                 │ 📚万卷书│         ',
    '║     └────┬───┘          │        ║                                                └─┬──┘          ',
    '║      │                          ║                                                   竹林🎋           ',
    '══╬════╪════════════════════════════════════════════════════════════════════════════════════════════',
    '│ ║   │ ┌─────────────────┐   │                                                     ┌────┐          ',
    '│ ║   │ │     大雄宝殿    │   │                                                         │Z门    │          ',
    '│ ║   │ │     🙏🙏🙏     │   │                                                         └─── ┘          ',
    '│ ║   │ └───────┬─────────┘   │                                                                     ',
    '│ ╠════╪══D门═════╪════════════════════════════════════════════════════════╬═════════════════════════',
    '│ ║        │                 │                                                                      ',
    '│ ║   ┌────────────┐       │                                                                        ',
    '│ ║   │   天王殿    │       │                                                                          ',
    '│ ║   │  四大天王塑像│       │                                                                            ',
    '│ ║   └──────┬─────┘       │                                                                        ',
    '│ ╠════╪═════════╪══════════════════════════════════════════════════════╬═══════════════════════════',
    '│ ╠════╩═════════╦══════════════════════════════════════════════════════╣═══════════════════════════',
    '│ ║                       │                                                                         ',
    '│ ║   ┌──────────┐       │        ← S山门                                                             ',
    '│ ║   │   S山门   │       │   🔔钟楼                                   🥁鼓楼                               ',
    '│ ║   │  🚪少林  │  石狮🦁  🦁│                                                                            ',
    '│ ║   └────┬───┘            │                                                                       ',
    '│ ╠════╪════════════════════════════════════════════════════════════════════════════════════════════',
    '│ ║  ·    │    ·             │                                                                      ',
    '╰══╩════╪═══════════════════════════════════════════════════════════════════════════════════════════',
    '           │                                                                                        ',
    '············─┼·······················                                                               ',
    '····································································································',
    '····································································································',
    '············································································┌───┐···················',
    '············································································│放生池│···················',
    '············································································│ 🐟鱼│···················',
    '············································································└───┘···················',
    '····································································································',
    ' ··· 少林寺山门前广场  ··                                                                                   ',
    '  ·· 出生点 ··                                                                                         ',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
    '····································································································',
  ],

  buildings: {
  D: { x:51, y:39, name:'大雄宝殿', icon:'🏯', desc:'少林核心建筑。如来金身佛像端坐莲台，十八罗汉分列两侧。香火缭绕，庄严肃穆。', actions:[
    { label:'参拜', icon:'🙏', action:'pray', msg:'双手合十，虔诚跪拜...' },
    { label:'返回', icon:'↩️', action:'leave', msg:'转身离开。' }
  ]},
  T: { x:50, y:54, name:'天王殿', icon:'🛕', desc:'少林第一进殿宇。四大天王怒目而立，弥勒佛笑迎八方来客。', actions:[
    { label:'进入', icon:'🚶', action:'enter', msg:'跨过门槛...' },
    { label:'返回', icon:'↩️', action:'leave', msg:'转身离开。' }
  ]},
  S: { x:50, y:63, name:'山门', icon:'🚪', desc:'少林寺大门。匾额上书少林寺三字。石狮把守，威严壮观。', actions:[
    { label:'离开', icon:'🚪', action:'leave', msg:'走出山门。' }
  ]},
  Z: { x:80, y:17, name:'藏经阁', icon:'📚', desc:'少林藏书之所。收藏天下武学典籍，七十二绝技秘籍皆出于此。四周翠竹环绕。', actions:[
    { label:'阅览', icon:'📖', action:'read', msg:'翻阅武学典籍...' },
    { label:'返回', icon:'↩️', action:'leave', msg:'合上书卷离开。' }
  ]},
  M: { x:15, y:41, name:'达摩院', icon:'🧘', desc:'达摩祖师面壁修行之处。院内禅房密布，是少林弟子修习内功心法的场所。', actions:[
    { label:'打坐', icon:'🧘', action:'meditate', msg:'盘腿坐下，闭目凝神...' },
    { label:'返回', icon:'↩️', action:'leave', msg:'起身离开。' }
  ]},
  L: { x:14, y:14, name:'后山小径', icon:'🌲', desc:'通往后山的崎岖小路。传说达摩祖师曾在此折芦渡江。', actions:[
    { label:'进入', icon:'🌲', action:'enter', msg:'踏上小路...' },
    { label:'返回', icon:'↩️', action:'leave', msg:'转身下山。' }
  ]}
},

npcs: [
  { id:'abbot_xuanci', x:51, y:37, name:'玄慈方丈', spriteKey:'elder', dialog:['阿弥陀佛。','施主远道而来，有失远迎。','少林以武止戈，望施主明鉴。'], patrol:null },
  { id:'monk_huineng', x:85, y:17, name:'慧能师兄', spriteKey:'monk', dialog:['师弟今日用功否？','藏经阁的书不可乱翻。','方丈正在大雄宝殿等你。'], patrol:null },
  { id:'monk_jueyuan', x:84, y:20, name:'觉远僧', spriteKey:'monk', dialog:['我在看守藏经阁。','未经许可不得入内！','……不过你可以试试。'], patrol:null },
  { id:'guard_shan', x:50, y:67, name:'守山弟子', spriteKey:'guard', dialog:['站住！','何人擅闯少林！','没有通行令牌，请回吧。'], patrol:null },
  { id:'monk_training', x:15, y:43, name:'练武僧人', spriteKey:'fighter', dialog:['再来一组！','拳脚要稳，呼吸要匀。','你的根基还不错。'], patrol:{path:[{x:13,y:43},{x:19,y:43},{x:19,y:45},{x:13,y:45}], speed:4000} },
  { id:'monk_bell', x:29, y:35, name:'撞钟僧', spriteKey:'monk', dialog:['晨钟暮鼓，警醒世人。','你要去撞钟吗？','时候未到。'], patrol:null },
  { id:'monk_drum', x:67, y:35, name:'击鼓僧', spriteKey:'monk', dialog:['鼓声阵阵，壮我少林声威！','每逢大典才击鼓。','平日里我来擦拭保养。'], patrol:null },
  { id:'fish_keeper', x:78, y:54, name:'放生僧', spriteKey:'monk', dialog:['这池子里的鱼都是信徒放生的。','万物皆有灵。','你也要放生吗？'], patrol:null }
],
    },

  };

  /* ================================================================
   *  地图渲染
   *  ================================================================ */
  function renderMap(){
    var html = '';
    mapData.visual.forEach(function(line, yi){
      html += '<div class="map-row">';
      for(var x = 0; x < line.length; x++){
        html += '<span class="'+cellClass(line[x])+'">'+_e(line[x])+'</span>';
      }
      html += '</div>';
    });
    $canvas.innerHTML = html;
  }

  /* 主角定位（#player 现在在 #map-canvas 外面，随 canvas transform 滚动） */
  function updateCharPos(){
    var px = charPos.x * FONT_SIZE * CELL_W - camera.x;
    var py = charPos.y * FONT_SIZE * CELL_H - camera.y;      // 不偏移，行走/站立与角色格子对齐
    $player.style.left = px + 'px';
    $player.style.top = py + 'px';
    renderChar();
  }

  function renderChar(){
    var frames = PLAYER_SPRITES[charDir] || PLAYER_SPRITES.down;
    var stand = PLAYER_STAND[charDir] || PLAYER_STAND.down;
    var frameIdx = Math.floor(Date.now() / 200) % frames.length;
    var body = isMoving ? frames[frameIdx] : stand;
    $pcBody.innerHTML = body.map(_e).join('\n');
  }

  function renderNPCs(){
    (mapData.npcs || []).forEach(function(n){
      if(npcEls[n.id]) return;
      var el = document.createElement('div');
      el.className = 'npc-char';
      el.dataset.npcId = n.id;
      el.innerHTML = '<div class="npc-body">\ud83e\uddbd</div><div class="npc-name">'+_e(n.name)+'</div>';
      el.addEventListener('click', function(){ talkTo(n.id); });
      $viewport.appendChild(el);        // 放在 viewport 里，不被 renderMap 冲掉
      npcEls[n.id] = el;
    });
  }

  function updateNPCPositions(){
    (mapData.npcs || []).forEach(function(n){
      var el = npcEls[n.id];
      if(!el) return;
      var nx = n.x * FONT_SIZE * CELL_W - camera.x;
      var ny = n.y * FONT_SIZE * CELL_H - camera.y;
      el.style.left = nx + 'px';
      el.style.top = ny + 'px';
    });
  }

  /* 小地图 */
  function renderMiniMap(){
    var html = '';
    mapData.visual.forEach(function(line, yi){
      for(var x = 0; x < line.length; x++){
        if(charPos.x === x && charPos.y === yi) html += '<span class="mm-player">@</span>';
        else if(isPassable(line[x])) html += '\u00b7';
        else html += '#';
      }
      html += '\n';
    });
    $minimap.innerHTML = html;
  }


  /* ================================================================
   *  即时移动系统（完全照搬 rogue-auto 模式）
   *  - keys[] 状态表：keydown=true, keyup=false
   *  - gameLoop(dt) 每帧读 keys → 算 dx/dy → 归一化 → speed*dt 移动
   *  - X/Y 分离碰撞检测（轴分离）
   *  ================================================================ */

  /** 每帧移动逻辑——完全同 rogue-auto Player.handleInput() */
  function handleMovement(dt){
    var dx = 0, dy = 0;
    if(keys['ArrowUp'] || keys['KeyW']) dy -= 1;
    if(keys['ArrowDown'] || keys['KeyS']) dy += 1;
    if(keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
    if(keys['ArrowRight'] || keys['KeyD']) dx += 1;
    if(touchDir.x !== 0 || touchDir.y !== 0){
      if(dx === 0 && dy === 0){ dx = touchDir.x; dy = touchDir.y; }
    }
    if(dx === 0 && dy === 0){ if(isMoving){ isMoving = false; $player.classList.remove('walking'); } return; }
    if(!isMoving){ isMoving = true; $player.classList.add('walking'); }
    var len = Math.sqrt(dx*dx + dy*dy); dx /= len; dy /= len;
    if(Math.abs(dx) > Math.abs(dy)){ charDir = dx > 0 ? 'right' : 'left'; }
    else{ charDir = dy > 0 ? 'down' : 'up'; }
    var speed = MOVE_SPEED;
    var newX = charPos.x + dx * speed * dt;
    var newY = charPos.y + dy * speed * dt;
    var checkX = Math.floor(newX), checkY = Math.floor(newY);
    var curX = Math.floor(charPos.x), curY = Math.floor(charPos.y);
    if(canWalk(checkX, curY)) charPos.x = newX; else charPos.x = curX;
    if(canWalk(curX, checkY)) charPos.y = newY; else charPos.y = curY;
    checkBuildingProximity();
    checkNPCProximity();
  }

  /* 相机 */
  function updateCamera(){
    var targetCX = charPos.x * FONT_SIZE * CELL_W - $viewport.clientWidth / 2 + FONT_SIZE * CELL_W / 2;
    var targetCY = charPos.y * FONT_SIZE * CELL_H - $viewport.clientHeight / 2 + ($player.offsetHeight || 58) / 2;
    camera.x = targetCX; camera.y = targetCY;
    var maxX = Math.max(0, mapData.w * FONT_SIZE * CELL_W - $viewport.clientWidth);
    var maxY = Math.max(0, mapData.h * FONT_SIZE * CELL_H - $viewport.clientHeight);
    camera.x = Math.max(0, Math.min(maxX, camera.x));
    camera.y = Math.max(0, Math.min(maxY, camera.y));
    $canvas.style.transform = 'translate(' + (-camera.x) + 'px, ' + (-camera.y) + 'px)';
    updateCharPos(); updateNPCPositions();
    $sbPos.textContent = '(' + Math.floor(charPos.x) + ', ' + Math.floor(charPos.y) + ')';
  }

  /* 游戏主循环 */
  function gameLoop(timestamp){
    if(!lastTime) lastTime = timestamp;
    var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    handleMovement(dt);
    updateCamera();
    animFrame = requestAnimationFrame(gameLoop);
  }

  function startGameLoop(){
    if(animFrame) cancelAnimationFrame(animFrame);
    lastTime = 0;
    animFrame = requestAnimationFrame(gameLoop);
  }


  /* ================================================================
   *  建筑与 NPC 交互
   *  ================================================================ */
  function checkBuildingProximity(){
    var bldgs = mapData.buildings || {};
    Object.keys(bldgs).forEach(function(k){
      var b = bldgs[k];
      var dist = Math.sqrt((charPos.x-b.x)*(charPos.x-b.x)+(charPos.y-b.y)*(charPos.y-b.y));
      if(dist <= 1.8 && !$sbHint.classList.contains('visible')){
        $sbHint.innerHTML = '['+k+'] '+b.name+' - '+b.icon+' \u70b9\u51fb\u4ea4\u4e92';
        $sbHint.className = 'visible hint-'+k;
      } else if(dist > 1.8){
        $sbHint.className = '';
      }
    });
  }

  function checkNPCProximity(){
    var closest = null, minDist = 2.5;
    (mapData.npcs||[]).forEach(function(n){
      var d = Math.sqrt((charPos.x-n.x)*(charPos.x-n.x)+(charPos.y-n.y)*(charPos.y-n.y));
      if(d < minDist){ minDist = d; closest = n; }
    });
    if(closest && !curNPCId){ showNPCHint(closest); }
  }

  function showNPCHint(npc){
    curNPCId = npc.id;
    $sbHint.innerHTML = '[NPC] '+npc.name+' - \u70b9\u51fb\u5bf9\u8bdd';
    $sbHint.className = 'visible hint-npc';
  }

  window.talkTo = function(npcId){
    var npc = (mapData.npcs||[]).find(function(n){ return n.id===npcId; });
    if(!npc) return;
    var line = npc.dialog[Math.floor(Math.random()*npc.dialog.length)];
    alert(npc.name + ': ' + line);
  };


  /* ================================================================
   *  输入处理
   *  ================================================================ */
  function bindInput(){
    document.addEventListener('keydown', function(e){
      var code = e.code;
      if(code.startsWith('Arrow') || code.startsWith('Key')){ e.preventDefault(); }
      keys[code] = true;
    });
    document.addEventListener('keyup', function(e){
      var code = e.code; delete keys[code];
    });
    window.addEventListener('blur', function(){
      keys = {}; touchDir = {x:0,y:0};
      if(isMoving){ isMoving=false; $player.classList.remove('walking'); }
    });

    // 触摸摇杆
    var $stick = document.getElementById('joystick-stick');
    var $base = document.getElementById('joystick-base');
    if($base){
      var stickRect = null;
      $base.addEventListener('touchstart', function(e){
        e.preventDefault(); stickRect = $base.getBoundingClientRect();
      },{passive:false});
      $base.addEventListener('touchmove', function(e){
        e.preventDefault(); if(!stickRect) return;
        var t = e.touches[0]; var cx=stickRect.left+stickRect.width/2, cy=stickRect.top+stickRect.height/2;
        var dx=t.clientX-cx, dy=t.clientY-cy; var maxR=stickRect.width*0.4;
        var dist=Math.hypot(dx,dy); if(dist>maxR){dx*=maxR/dist; dy*=maxR/dist;}
        $stick.style.transform = 'translate('+dx+'px,'+dy+'px)';
        var mag = Math.hypot(dx,dy)/maxR; if(mag<0.3){ touchDir={x:0,y:0}; return; }
        touchDir={x:dx/maxR, y:dy/maxR};
      },{passive:false});
      $base.addEventListener('touchend', function(e){
        e.preventDefault(); $stick.style.transform=''; touchDir={x:0,y:0};
      },{passive:false});
    }
  }


  /* ================================================================
   *  初始化
   *  ================================================================ */
  window.initSectMap = function(sectName){
    var sm = SECT_MAPS[sectName]; if(!sm){ alert('\u672a\u77e5\u95e8\u6d3e:'+sectName); return; }
    mapData = { w:sm.w, h:sm.h, grid:[], visual:[], buildings:sm.buildings||{}, npcs:sm.npcs||[], color:sm.color };

    // 解析地图字符串为二维数组
    var rawLines = [];
    sm.map.forEach(function(s){ rawLines.push(s.split('')); });
    mapData.grid = rawLines;
    mapData.visual = sm.map;

    // UI引用
    $viewport = document.getElementById('map-viewport');
    $canvas    = document.getElementById('map-canvas');
    $player    = document.getElementById('player');
    $pcBody    = $player.querySelector('.pc-body');
    $minimap   = document.getElementById('minimap-canvas');
    $sbPos     = document.getElementById('sb-pos');
    $sbSect    = document.getElementById('sb-sect');
    $sbHint    = document.getElementById('interact-hint');

    $canvas.style.width  = sm.w * FONT_SIZE * CELL_W + 'px';
    $canvas.style.height = sm.h * FONT_SIZE * CELL_H + 'px';

    $sbSect.textContent = sm.name;
    $sbSect.style.color = sm.color;

    charPos.x = sm.spawnPos.x;
    charPos.y = sm.spawnPos.y;
    camera.x = 0; camera.y = 0;

    renderMap();
    renderChar();
    renderNPCs();
    renderMiniMap();

    bindInput();
    startGameLoop();
  };
})();
