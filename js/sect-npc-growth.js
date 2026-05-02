// ════════════════════════════════════════════════════
//  sect-npc-growth.js  门派NPC动态成长系统
//  功能：
//    1. 门派弟子NPC属性随时间成长（等级、好感、称号变化）
//    2. 玩家与门派弟子的互动事件（切磋、请教、赠礼）
//    3. NPC触发随机对话（反映门派动态事件和战争状态）
//    4. 弟子出师/叛逃/升职机制
//  version: 1
// ════════════════════════════════════════════════════

;(function(){
'use strict';

// ═══════════════════════════════════════════════════
//  一、NPC成长配置
// ═══════════════════════════════════════════════════

/**
 * NPC成长速度配置（按门派等级）
 * 每个游戏日，NPC获得的经验和成长概率
 */
var NPC_GROWTH_RATE = {
  supreme: { expPerDay: 15, levelChance: 0.08, titleChance: 0.02 },
  major:   { expPerDay: 12, levelChance: 0.06, titleChance: 0.015 },
  minor:   { expPerDay: 10, levelChance: 0.05, titleChance: 0.01 },
};

/**
 * NPC称号升级路线
 * 根据等级自动变更称号前缀
 */
var NPC_TITLE_RANGES = [
  { minLv: 1,  title: '外门弟子',  icon: '🥋' },
  { minLv: 10, title: '内门弟子',  icon: '⚔️' },
  { minLv: 20, title: '精英弟子',  icon: '⭐' },
  { minLv: 35, title: '护法长老',  icon: '🛡️' },
  { minLv: 50, title: '核心长老',  icon: '👑' },
  { minLv: 70, title: '宗师',      icon: '✦' },
];

/**
 * NPC互动事件池
 */
var NPC_INTERACT_EVENTS = [
  { id:'sparring',      icon:'⚔️', name:'切磋武艺', desc:'与{npc}切磋一番，不论输赢皆有收获。', effect:{ rel:3, playerExp:30, type:'battle' } },
  { id:'seek_advice',   icon:'📖', name:'请教功法', desc:'向{npc}请教武学心得，对方欣然指点。', effect:{ rel:5, playerExp:20, type:'dialogue' } },
  { id:'gift_tea',      icon:'🍵', name:'奉茶问候', desc:'给{npc}泡了一壶好茶，对方颇为高兴。', effect:{ rel:4, silver:-20, type:'social' } },
  { id:'gift_wine',     icon:'🍶', name:'对饮论道', desc:'与{npc}把酒言欢，畅谈江湖见闻。', effect:{ rel:6, silver:-50, type:'social' } },
  { id:'train_together',icon:'🏋️', name:'同修功法', desc:'与{npc}一同修炼，互相印证武学。', effect:{ rel:4, playerExp:40, type:'training' } },
  { id:'escort_mission',icon:'🚶', name:'同行历练', desc:'与{npc}一同外出历练，增进了同门情谊。', effect:{ rel:8, playerExp:60, silver:50, type:'mission' } },
];

/**
 * NPC随机对话池（反映门派状态）
 */
var NPC_DIALOGUE_POOL = {
  normal: [
    '「今日天气不错，正好练功。」',
    '「师弟/师姐近来武艺精进不少啊。」',
    '「师兄，掌门最近似乎在闭关修炼。」',
    '「藏经阁最近新到了几本古籍，你有空可以去看看。」',
    '「听说山下又来了不少江湖人，不知道是什么来头。」',
    '「上次切磋输给你了，这次我一定赢回来！」',
    '「门派的丹药快用完了，得去采集些草药。」',
    '「最近江湖上不太平，大家出门要多加小心。」',
  ],
  war: [
    '「听说门派正在和敌对势力开战，我们也要做好准备。」',
    '「前线传来的消息不太好，不知道师兄们怎么样了……」',
    '「掌门下令全员戒备，连外门弟子也要参加巡逻。」',
    '「这场战争关系到门派的存亡，绝不能掉以轻心。」',
  ],
  event_good: [
    '「最近门派喜事连连，看来运道不错啊。」',
    '「掌门出关了！听说是突破了大境界！」',
    '「新发现的那处秘境里果然有好东西，我已经拿到一件了。」',
  ],
  event_bad: [
    '「最近门派不太平，大家心里都有些不安。」',
    '「叛徒的事你听说了吗？真是知人知面不知心。」',
    '「物资紧缺，炼丹房都停工了，这可怎么办……」',
  ],
};

// ═══════════════════════════════════════════════════
//  二、存档
// ═══════════════════════════════════════════════════

var SNG_SAVE_KEY = 'wuxia_sect_npc_growth';

/**
 * 存档结构：
 * {
 *   npcs: {
 *     npcId: {
 *       level, exp, title, totalInteractions,
 *       lastGrowDay, lastInteractDay,
 *       status: 'active' | 'graduated' | 'defected',
 *       mood: 'happy' | 'neutral' | 'upset'
 *     }
 *   },
 *   lastGlobalGrowth: 'YYYY-MM-DD'
 * }
 */
function sngLoad(){
  try { return JSON.parse(localStorage.getItem(SNG_SAVE_KEY) || '{}'); }
  catch(e){ return {}; }
}
function sngSave(data){
  try { localStorage.setItem(SNG_SAVE_KEY, JSON.stringify(data)); }
  catch(e){}
}

// ═══════════════════════════════════════════════════
//  三、NPC成长逻辑
// ═══════════════════════════════════════════════════

/** 获取游戏日 */
function _sngGameDay(){
  // 使用江湖日期（如果有），否则用现实日期
  if(typeof jianghuState !== 'undefined' && jianghuState.day){
    return jianghuState.day;
  }
  return Math.floor(Date.now() / 86400000);
}

/** 获取NPC当前等级 */
function sngGetNpcLevel(npcId){
  var save = sngLoad();
  var npc = save.npcs && save.npcs[npcId];
  return npc ? npc.level : 1;
}

/** 获取NPC称号 */
function sngGetNpcTitle(npcId){
  var lv = sngGetNpcLevel(npcId);
  for(var i = NPC_TITLE_RANGES.length - 1; i >= 0; i--){
    if(lv >= NPC_TITLE_RANGES[i].minLv) return NPC_TITLE_RANGES[i];
  }
  return NPC_TITLE_RANGES[0];
}

/** 全局NPC成长（每日触发一次） */
function sngGlobalGrowth(){
  var save = sngLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return;

  var day = _sngGameDay();
  if(save.lastGlobalGrowth === String(day)) return;
  save.lastGlobalGrowth = String(day);

  var sect = (typeof SECTS !== 'undefined') ? SECTS.find(function(s){ return s.id === ed.sect; }) : null;
  if(!sect) return;

  var rate = NPC_GROWTH_RATE[sect.tier] || NPC_GROWTH_RATE.minor;
  if(!save.npcs) save.npcs = {};

  // 获取当前门派的所有NPC
  var sectNpcs = [];
  if(typeof SECT_NPC_IDS !== 'undefined' && SECT_NPC_IDS[ed.sect]){
    sectNpcs = SECT_NPC_IDS[ed.sect];
  }

  sectNpcs.forEach(function(npcId){
    if(!save.npcs[npcId]){
      save.npcs[npcId] = { level:1, exp:0, totalInteractions:0, status:'active', mood:'neutral' };
    }

    var npc = save.npcs[npcId];
    if(npc.status !== 'active') return;

    // 累加经验
    npc.exp += rate.expPerDay;

    // 升级检查
    var lvUpExp = npc.level * 50 + 100;
    if(npc.exp >= lvUpExp && Math.random() < rate.levelChance){
      npc.level = Math.min(99, npc.level + 1);
      npc.exp = 0;
    }
  });

  sngSave(save);
}

/** 玩家与NPC互动 */
function sngInteract(npcId, eventType){
  var save = sngLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return null;

  if(!save.npcs) save.npcs = {};
  if(!save.npcs[npcId]){
    save.npcs[npcId] = { level:1, exp:0, totalInteractions:0, status:'active', mood:'neutral' };
  }

  var npc = save.npcs[npcId];
  if(npc.status !== 'active') return null;

  // 查找事件配置
  var evt = NPC_INTERACT_EVENTS.find(function(e){ return e.id === eventType; });
  if(!evt) return null;

  // 检查银两
  if(evt.effect.silver && evt.effect.silver < 0){
    if((ed.silver || 0) < Math.abs(evt.effect.silver)){
      if(typeof showToast === 'function') showToast('银两不足', 'warn');
      return null;
    }
    ed.silver += evt.effect.silver;
    if(typeof saveProgress === 'function') saveProgress();
  }

  // 经验
  if(evt.effect.playerExp && typeof gainExp === 'function'){
    gainExp(evt.effect.playerExp);
  }

  // 好感
  if(evt.effect.rel && typeof jhChangeNpcRel === 'function'){
    jhChangeNpcRel(npcId, evt.effect.rel);
  }

  // NPC成长加成
  npc.exp += evt.effect.playerExp || 0;
  npc.totalInteractions++;

  // 心情变化
  npc.mood = evt.effect.rel > 5 ? 'happy' : 'neutral';

  sngSave(save);

  return {
    event: evt,
    npcLevel: npc.level,
    npcTitle: sngGetNpcTitle(npcId),
  };
}

/** 获取NPC随机对话 */
function sngGetRandomDialogue(npcId){
  // 检查门派状态（需读取 sect-war.js 的存档）
  var warSave = null;
  try { warSave = JSON.parse(localStorage.getItem('wuxia_sect_war') || '{}'); } catch(e){ warSave = {}; }
  var ed = (typeof edS !== 'undefined') ? edS : null;

  var pool = NPC_DIALOGUE_POOL.normal;

  // 战争进行中（从 sect-war 存档中读取）
  if(warSave.activeWars){
    var hasActiveWar = Object.keys(warSave.activeWars).some(function(wid){ return !warSave.activeWars[wid].completed; });
    if(hasActiveWar) pool = NPC_DIALOGUE_POOL.war;
  }

  // 事件影响（从 sect-war 存档中读取）
  if(warSave.activeEvents){
    var hasBadEvent = Object.values(warSave.activeEvents).some(function(ae){
      var tmpl = SECT_EVENT_POOL.find(function(e){ return e.id === ae.eventId; });
      return tmpl && tmpl.effect && tmpl.effect.contrib < 0;
    });
    if(hasBadEvent) pool = NPC_DIALOGUE_POOL.event_bad;

    var hasGoodEvent = Object.values(warSave.activeEvents).some(function(ae){
      var tmpl = SECT_EVENT_POOL.find(function(e){ return e.id === ae.eventId; });
      return tmpl && tmpl.effect && tmpl.effect.contrib > 5;
    });
    if(hasGoodEvent && !hasBadEvent) pool = NPC_DIALOGUE_POOL.event_good;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════════════════
//  四、UI 渲染
// ═══════════════════════════════════════════════════

function renderSectNpcPanel(sect){
  var container = document.getElementById('tab-npc');
  if(!container) return;

  var save = sngLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;

  var html = '';

  // ── 标题 ──
  html += '<div style="text-align:center;padding:12px 0 8px">';
  html += '<div style="font-size:18px;font-weight:bold;color:' + (sect.color || '#f0c060') + '">👥 门派弟子</div>';
  html += '<div style="font-size:11px;color:var(--text3);margin-top:4px">门派弟子的成长状况与互动</div>';
  html += '</div>';

  // 触发全局成长
  sngGlobalGrowth();

  // 获取NPC列表
  var npcList = [];
  var sectNpcIds = (typeof SECT_NPC_IDS !== 'undefined' && ed && ed.sect) ? (SECT_NPC_IDS[ed.sect] || []) : [];

  if(sectNpcIds.length === 0){
    html += '<div style="text-align:center;padding:30px 0;color:var(--text3);font-size:12px">';
    html += '📭 暂无门派弟子数据</div>';
  } else {
    sectNpcIds.forEach(function(npcId){
      var npcData = save.npcs && save.npcs[npcId];
      var level = npcData ? npcData.level : 1;
      var titleInfo = sngGetNpcTitle(npcId);
      var interactions = npcData ? (npcData.totalInteractions || 0) : 0;
      var mood = npcData ? (npcData.mood || 'neutral') : 'neutral';
      var moodIcon = mood === 'happy' ? '😊' : mood === 'upset' ? '😤' : '😐';

      // 获取NPC名
      var npcName = npcId;
      if(typeof NPC_DB !== 'undefined' && NPC_DB[npcId]){
        npcName = NPC_DB[npcId].name || npcId;
      }

      html += '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:12px;margin:6px 8px">';

      // NPC信息头
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div style="display:flex;align-items:center;gap:6px">';
      html += '<span style="font-size:18px">' + titleInfo.icon + '</span>';
      html += '<div>';
      html += '<div style="font-weight:bold;font-size:13px">' + npcName + '</div>';
      html += '<div style="font-size:10px;color:var(--text3)">' + titleInfo.title + ' · Lv.' + level + '</div>';
      html += '</div></div>';
      html += '<div style="display:flex;align-items:center;gap:4px">';
      html += '<span style="font-size:14px">' + moodIcon + '</span>';
      if(interactions > 0){
        html += '<span style="font-size:9px;color:var(--text3)">互动' + interactions + '次</span>';
      }
      html += '</div></div>';

      // 快速互动按钮
      html += '<div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap">';
      NPC_INTERACT_EVENTS.slice(0, 4).forEach(function(evt){
        var costStr = '';
        if(evt.effect.silver && evt.effect.silver < 0) costStr = ' 💰' + Math.abs(evt.effect.silver);
        html += '<button onclick="sngInteract(\'' + npcId + '\',\'' + evt.id + '\')" ' +
          'style="padding:4px 8px;border:1px solid rgba(255,255,255,.08);border-radius:4px;' +
          'background:rgba(255,255,255,.03);color:var(--text2);font-size:10px;cursor:pointer">' +
          evt.icon + ' ' + evt.name + costStr + '</button>';
      });
      html += '</div>';

      html += '</div>';
    });
  }

  // ── 底部 ──
  html += '<div style="text-align:center;padding:14px 8px;font-size:10px;color:var(--text3);opacity:.5">';
  html += '弟子每日自动成长 · 互动可加速成长并提升好感 · NPC对话反映门派状态</div>';

  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════
//  五、门派NPC ID映射（从npc-data-sects.js提取）
// ═══════════════════════════════════════════════════

/**
 * 每个门派的NPC ID列表
 * 在模块加载时从NPC数据库中动态提取
 */
var SECT_NPC_IDS = {};

function _sngInitNpcIds(){
  if(typeof NPC_DB === 'undefined') return;
  var npcKeys = Object.keys(NPC_DB);

  // 通过NPC的sect属性或ID前缀匹配门派
  var sectIds = ['shaolin','wudang','huashan','mingjiao','wudu','tangmen','taohuadao',
    'xiaoyao','tiandibang','guigu','shengguang','emei','kongtong','kunlun','diancang',
    'tianshan','xixia','tianlong','nangong','xuanming','haisha','riyue','xuegu',
    'lingxiao','qingcheng'];

  sectIds.forEach(function(sid){
    SECT_NPC_IDS[sid] = npcKeys.filter(function(nid){
      return nid.indexOf(sid) === 0 || (NPC_DB[nid].sect === sid);
    });
  });
}

// 延迟初始化（等待NPC数据库加载）
setTimeout(_sngInitNpcIds, 500);

// ═══════════════════════════════════════════════════
//  六、导出
// ═══════════════════════════════════════════════════

window.NPC_GROWTH_RATE      = NPC_GROWTH_RATE;
window.NPC_TITLE_RANGES     = NPC_TITLE_RANGES;
window.NPC_INTERACT_EVENTS  = NPC_INTERACT_EVENTS;
window.NPC_DIALOGUE_POOL    = NPC_DIALOGUE_POOL;
window.SECT_NPC_IDS         = SECT_NPC_IDS;
window.sngGetNpcLevel       = sngGetNpcLevel;
window.sngGetNpcTitle       = sngGetNpcTitle;
window.sngGlobalGrowth      = sngGlobalGrowth;
window.sngInteract          = sngInteract;
window.sngGetRandomDialogue = sngGetRandomDialogue;
window.renderSectNpcPanel   = renderSectNpcPanel;

})();
