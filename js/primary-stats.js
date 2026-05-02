// Primary Stats System (root-bone allocation)
// Manages player's 5 primary stat points: vigor/tough/swift/inner/will

// ── 五维定义（加点面板+属性加成共用）──
const PRIMARY_STATS_DEF = [
  { key:'vigor', name:'\u529B\u91CF', icon:'\u26A1', color:'#ff6644',
    desc:'\u653B\u51FB/\u66B4\u51FB', effects:['\u653B\u51FB +1.5/\u70B9'] },
  { key:'tough',  name:'\u8D28\u4F53', icon:'\uD83D\uDCE6', color:'#44aa44',
    desc:'\u6C14\u8840/\u9632\u5FA1', effects:['\u6C14\u8840 +8/\u70B9'] },
  { key:'swift',  name:'\u8EAB\u6CD5', icon:'\uD83C\uDF28', color:'#4488cc',
    desc:'\u901F\u5EA6/\u95EA\u907F', effects:['\u901F\u5EA6 +0.5/\u70B9'] },
  { key:'inner',  name:'\u5185\u606F', icon:'\uD83D\uDCA9', color:'#44aacc',
    desc:'\u5185\u529B/\u9632\u8BA1', effects:['\u5185\u529B +6/\u70B9'] },
  { key:'will',   name:'\u5FC3\u5FF5', icon:'\uD83D\uDD25', color:'#cc6644',
    desc:'\u66B4\u51FB/\u751F\u547D', effects:['\u66B4\u51FB +0.43/\u70B9'] }
];

// ── 初始值 & 常量 ──
const PRIMARY_INIT = { vigor:0, tough:0, swift:0, inner:0, will:0 };
const POINTS_PER_LEVEL = 3; // per level

// ── 属性加成计算（供 edStats / battle 使用）──
function calcPrimaryBonus(pts){
  if(!pts) pts = PRIMARY_INIT;
  return {
    atk: Math.round((pts.vigor||0)*1.5),
    hp: Math.round((pts.tough||0)*8),
    def: Math.round((pts.tough||0)*0.5 + (pts.will||0)*0.3),
    spd: Math.round((pts.swift||0)*0.5 * 10)/10,
    dodge: Math.min(50, Math.round((pts.swift||0)*0.25 + (pts.inner||0)*0.08)),
    mp: Math.round((pts.inner||0)*6),
    crit: Math.min(80, Math.round((pts.vigor||0)*0.15 + (pts.will||0)*0.28))
  };
}

// ── 已花费点数 ──
function calcSpentPoints(){
  var p = (typeof edS !== 'undefined') ? (edS.primaryPts || PRIMARY_INIT) : PRIMARY_INIT;
  return (p.vigor||0)+(p.tough||0)+(p.swift||0)+(p.inner||0)+(p.will||0);
}

// ── 分配点数（返回 true=成功）──
function allocatePrimary(key, delta){
  if(typeof edS === 'undefined') return false;
  if(!PRIMARY_STATS_DEF.find(function(d){return d.key===key;})) return false;
  var pts = edS.primaryPts || (edS.primaryPts = Object.assign({}, PRIMARY_INIT));
  var cur = pts[key] || 0;
  if(delta > 0){
    var free = edS.freePoints || 0;
    if(free < delta) return false;
    pts[key] = cur + delta;
    edS.freePoints = free - delta;
  } else {
    var newVal = Math.max(0, cur + delta);
    var actualDelta = newVal - cur;
    pts[key] = newVal;
    edS.freePoints = (edS.freePoints || 0) - actualDelta;
  }
  savePrimaryStats();
  if(typeof renderPrimaryPanel === 'function') renderPrimaryPanel();
  if(typeof edRefresh === 'function') edRefresh();
  return true;
}

// UI: render primary stats panel (string concatenation only - no template literals)
function renderPrimaryPanel(){
  var el = document.getElementById('primaryStatsPanel');
  if(!el) return;

  var pts   = (typeof edS !== 'undefined' && edS.primaryPts) || PRIMARY_INIT;
  var free  = (typeof edS !== 'undefined') ? (edS.freePoints || 0) : 0;
  var bonus = calcPrimaryBonus(pts);
  var fate  = (typeof edS !== 'undefined') ? (edS.fate || 10) : 10;

  var fateLabel = fate >= 18 ? '\u5929\u8D50\u9E3F\u8FD0' : fate >= 14 ? '\u798F\u7F18\u6DF1\u539A' :
                 fate >= 10 ? '\u8FD0\u52BF\u5E73\u7A33' : fate >= 6  ? '\u547D\u9014\u591A\u8E4B' : '\u65F6\u8FD0\u4E0D\u6D4E';
  var fateColor = fate >= 14 ? '#ffd060' : fate >= 10 ? '#a0c8a0' : '#ff8888';

  var h = '<div class="ps-header">';
  h += '<span class="ps-title">\u2694 \u6B66\u8005\u6839\u9AA8</span>';
  h += '<span class="ps-free '+(free>0?'ps-free-avail':'')+'">\u5269\u4F59\u70B9\u6570\uFF1A<b>'+free+'</b></span>';
  h += '</div>';

  h += '<div class="ps-stats-grid">';
  for(var i=0;i<PRIMARY_STATS_DEF.length;i++){
    var d = PRIMARY_STATS_DEF[i];
    var val = pts[d.key] || 0;
    var canAdd = free > 0;
    var canSub = val > 0;
    var eff = (d.effects && d.effects.length) ? d.effects.join(' \u00B7 ') : '';
    h += '<div class="ps-row" data-key="'+d.key+'">';
    h += '<span class="ps-icon">'+d.icon+'</span>';
    h += '<div class="ps-info">';
    h += '<span class="ps-name" style="color:'+d.color+'">'+d.name+'</span>';
    h += '<span class="ps-desc">'+d.desc+'</span>';
    h += '<span class="ps-effects">'+eff+'</span>';
    h += '</div><div class="ps-controls">';
    // Build onclick handlers safely (avoid nested quote issues)
    var subOnclick = "allocatePrimary('" + d.key + "',-1)";
    var addOnclick = "allocatePrimary('" + d.key + "',1)";
    h += '<button class="ps-btn ps-sub '+(canSub?'':'ps-disabled')+'" onclick="'+subOnclick+'" '+(canSub?'':'disabled')+'>\u2212</button>';
    h += '<span class="ps-val" style="color:'+d.color+'">'+val+'</span>';
    h += '<button class="ps-btn ps-add '+(canAdd?'':'ps-disabled')+'" onclick="'+addOnclick+'" '+(canAdd?'':'disabled')+'>+</button>';
    h += '</div></div>';
  }
  h += '</div>';

  h += '<div class="ps-bonus-row"><span class="ps-bonus-title">\u52A0\u70B9\u6548\u679C\u9884\u89C8</span>';
  h += '\u2694'+(bonus.atk>0?'+':'')+bonus.atk+' \u653B ';
  h += '\u2764'+(bonus.hp>0?'+':'')+bonus.hp+' \u8840 ';
  h += '\uD83D\uDEE1'+(bonus.def>0?'+':'')+bonus.def+' \u9632 ';
  h += '\u26A1'+(bonus.spd>0?'+':'')+bonus.spd+' \u901F ';
  h += '\uD83C\uDF28'+(bonus.dodge>0?'+':'')+bonus.dodge+'% \u95EA ';
  h += '\uD83D\uDCA9'+(bonus.mp>0?'+':'')+bonus.mp+' \u5185 ';
  h += '\uD83C\uDFAF'+(bonus.crit>0?'+':'')+bonus.crit+'% \u66B4';
  h += '</div>';

  h += '<div class="ps-fate-row">';
  h += '<span class="ps-fate-icon">\u2728</span>';
  h += '<span class="ps-fate-label">\u6C14\u8FD0</span>';
  h += '<span class="ps-fate-val" style="color:'+fateColor+'">'
    +fateLabel+'\uFF08'+fate+'\uFF09</span>';
  h += '<span class="ps-fate-hint"> \u00B7 \u5F71\u54CD\u5546\u4EF7 '
    +'\u00B7 \u597D\u611F \u00B7 \u968F\u673A\u4E8B\u4EF6 \u00B7 \u6389\u843D</span>';
  h += '</div>';

  el.innerHTML = h;

  // sync root bone button red dot
  var tpb = document.getElementById('tpbRootBone');
  if(tpb) tpb.classList.toggle('has-points', free > 0);
}

// Level-up prompt bubble
function showLevelUpAllocPrompt(newLevel){
  var free = typeof edS !== 'undefined' ? (edS.freePoints || 0) : 0;
  if(free <= 0) return;
  var tip = document.createElement('div');
  tip.className = 'ps-levelup-tip';
  tip.innerHTML = '\u2726 \u5347\u7EA7\uFF01\u83B7\u5F97 <b>'
    +POINTS_PER_LEVEL+'</b> \u70B9\u6839\u9AA8\u70B9\u6570<br><small>\u70B9\u51FB\u5206\u914D</small>';
  tip.style.cssText =
    'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);'+
    'background:rgba(20,10,50,.95);border:1px solid rgba(240,192,96,.5);'+
    'color:#ffd060;padding:8px 18px;border-radius:8px;font-size:13px;'+
    'text-align:center;cursor:pointer;z-index:9000;';
  tip.onclick = function(){ tip.remove(); openPrimaryPanel(); };
  document.body.appendChild(tip);
  setTimeout(function(){ tip.remove(); }, 4200);
}

// Open primary panel overlay
function openPrimaryPanel(){
  var overlay = document.getElementById('primaryPanelOverlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.id = 'primaryPanelOverlay';
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:8500;'+
      'display:flex;align-items:center;justify-content:center;';
    overlay.onclick = function(e){ if(e.target===overlay) overlay.remove(); };
    var box = document.createElement('div');
    box.id = 'primaryStatsPanel';
    box.style.cssText =
      'background:rgba(8,5,25,.97);border:1px solid rgba(240,192,96,.3);'+
      'border-radius:12px;padding:18px;min-width:320px;max-width:420px;width:92vw;'+
      'max-height:85vh;overflow-y:auto;';
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
  renderPrimaryPanel();
}

// ── 存档读写 ──

function loadPrimaryStats(){
  if(typeof edS === 'undefined') return;
  try{
    var saved = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    edS.primaryPts  = Object.assign({}, PRIMARY_INIT, saved.primaryPts  || {});

    // freePoints compatibility fix
    var currentLevel = edS.level || (saved.level || 1);
    var totalTheory = (currentLevel - 1) * POINTS_PER_LEVEL;
    var p = edS.primaryPts || PRIMARY_INIT;
    var spent = (p.vigor||0)+(p.tough||0)+(p.swift||0)+(p.inner||0)+(p.will||0);
    var correctFree = Math.max(0, totalTheory - spent);

    var savedFree = saved.freePoints;
    if(savedFree === undefined || savedFree === null || Math.abs(savedFree - correctFree) > 2){
      if(savedFree !== undefined && savedFree !== null){
        console.warn('[loadPrimaryStats] fixed: saved='+savedFree+' calc='+correctFree);
      }
      edS.freePoints = correctFree;
    } else {
      edS.freePoints = savedFree;
    }

    edS.fate        = saved.fate ?? Math.floor(Math.random() * 16) + 5;
    if(saved.originPts) edS.originPts = saved.originPts;
    if(saved.karma !== undefined && saved.karma !== null) edS.karma = saved.karma;
  }catch(e){
    edS.primaryPts = Object.assign({}, PRIMARY_INIT);
    edS.freePoints = 0;
    edS.fate = 10;
  }
}

function savePrimaryStats(){
  if(typeof edS === 'undefined') return;
  try{
    var saved = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    saved.primaryPts = edS.primaryPts;
    saved.freePoints = edS.freePoints;
    saved.fate       = edS.fate;
    if(edS.originPts) saved.originPts = edS.originPts;
    if(edS.karma !== undefined) saved.karma = edS.karma;
    localStorage.setItem('wuxia_player_progress', JSON.stringify(saved));

    var editorRaw = localStorage.getItem('wuxia_editor');
    if(editorRaw){
      var editor = JSON.parse(editorRaw);
      editor.primaryPts = edS.primaryPts;
      editor.freePoints = edS.freePoints;
      editor.fate       = edS.fate;
      if(edS.originPts) editor.originPts = edS.originPts;
      if(edS.karma !== undefined) editor.karma = edS.karma;
      if(edS.level) editor.level = edS.level;
      if(edS.totalExp !== undefined) editor.totalExp = edS.totalExp;
      localStorage.setItem('wuxia_editor', JSON.stringify(editor));
    }
  }catch(e){}
}

// Theory total free points for a given level
function calcFreePoints(level){
  return Math.max(0, (level - 1) * POINTS_PER_LEVEL);
}
