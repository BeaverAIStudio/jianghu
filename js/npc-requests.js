// ═══════════════════════════════════════════════════════════════
//  npc-requests.js  —  NPC主动找玩家帮忙系统
//  版本: 1.0
//  依赖：jianghu.js（jianghuState、jhGetCityRep）, npc-data-*.js
//  触发：
//    1. 城市声望 ≥ 60（德高望重）进城时有概率触发
//    2. 完成任务后 30% 概率该 NPC 回访
//    3. 每日登录检查
// ═══════════════════════════════════════════════════════════════

// ── 送信/送货委托：各城市固定目标表 ──
// 原则：目标必须在发起城市的【相邻城镇】，让玩家有"跑腿"感，但不会找不到地方
// 格式：[发起NPC_ID] → { targetNpcId, targetNpcName, targetCityId, targetCityName, letterDesc/deliveryDesc }
const DELIVER_NPC_MAP = {

  // ── 开封(kaifeng) ──  相邻：沧州(N)、洛阳(W)、嵩山(S)、徐州(E)
  // 开封掌柜→ 沧州跌打名医（旧伤，北行求医）
  kaifeng_inn:    { targetNpcId:'cangzhou_doctor',       targetNpcName:'接骨王',   targetCityId:'cangzhou', targetCityName:'沧州',  letterDesc:'一封托沧州接骨王看旧伤的求诊书' },
  // 开封铁匠→ 沧州女镖师（采购镖路用刀）
  kaifeng_smith:  { targetNpcId:'cangzhou_escort_woman', targetNpcName:'铁娘子',   targetCityId:'cangzhou', targetCityName:'沧州',  deliveryDesc:'一柄刚开刃的加重镖刀，沧州镖局订的货' },

  // ── 沧州(cangzhou) ── 相邻：幽州(N)、晋阳(W)、开封(S)、海仓(E)
  // 沧州掌柜→ 开封郎中（问诊书）
  cangzhou_inn:   { targetNpcId:'kaifeng_doctor',        targetNpcName:'范杏林',   targetCityId:'kaifeng',  targetCityName:'开封',  letterDesc:'一封托开封范大夫替人看病的书信' },
  // 沧州刀匠→ 晋阳总镖头（太行路军备采购单）
  cangzhou_smith: { targetNpcId:'jinyang_escort',        targetNpcName:'杨破虏',   targetCityId:'jinyang',  targetCityName:'晋阳',  deliveryDesc:'一批沧州制式镖刀，太行镖局订的货' },

  // ── 晋阳(jinyang) ── 相邻：大同(N)、蒲州(S)、沧州(E)、汾州(W)
  // 晋阳掌柜→ 大同武器铺（催军备订单）
  jinyang_inn:    { targetNpcId:'datong_smith',          targetNpcName:'朱铁锤',   targetCityId:'datong',   targetCityName:'大同',  letterDesc:'一封催大同朱铁锤交货的函件' },
  // 晋阳刀匠→ 大同镖局镖头（押送合同）
  jinyang_smith:  { targetNpcId:'datong_escort',         targetNpcName:'李镖头',   targetCityId:'datong',   targetCityName:'大同',  deliveryDesc:'一批太行制式长刀，大同镖局北线用的货' },

  // ── 大同(datong) ── 相邻：雁门(N)、晋阳(S)、沧州(E)、朔州(W)
  // 大同驿站→ 晋阳旅舍掌柜（商队联络信）
  datong_inn:     { targetNpcId:'jinyang_inn',           targetNpcName:'柳老伯',   targetCityId:'jinyang',  targetCityName:'晋阳',  letterDesc:'一封大同商队托晋阳旅舍代为安排住所的信' },
  // 大同武器铺→ 晋阳刀匠（原料采购单）
  datong_smith:   { targetNpcId:'jinyang_smith',         targetNpcName:'关铁牛',   targetCityId:'jinyang',  targetCityName:'晋阳',  deliveryDesc:'一批大漠铁料样品，晋阳刀匠要看货' },

  // ── 潼关(tongguan) ── 相邻：蒲州(N)、商州(S)、洛阳(E)、长安(W)
  // 潼关旅舍→ 汉中客栈掌柜（蜀商联络）
  tongguan_inn:   { targetNpcId:'hanzhong_inn',          targetNpcName:'张蜀道',   targetCityId:'hanzhong', targetCityName:'汉中',  letterDesc:'一封关中商队托汉中客栈代为接待蜀地商人的信' },
  // 潼关刀剑铺→ 汉中铁匠（蜀铁采购单）
  tongguan_smith: { targetNpcId:'hanzhong_smith',        targetNpcName:'骆长铁',   targetCityId:'hanzhong', targetCityName:'汉中',  deliveryDesc:'一份关城订购蜀铁的采购合同' },

  // ── 汉中(hanzhong) ── 相邻：长安(N)、商州(NE)、南阳(E)、成都方向(W)
  // 汉中掌柜→ 潼关旅舍（关中联络）
  hanzhong_inn:   { targetNpcId:'tongguan_inn',          targetNpcName:'张守义',   targetCityId:'tongguan', targetCityName:'潼关',  letterDesc:'一封请潼关守义哥打听关中刀价的书信' },
  // 汉中铁匠→ 潼关镖头（镖路委托）
  hanzhong_smith: { targetNpcId:'tongguan_escort',       targetNpcName:'马镖头',   targetCityId:'tongguan', targetCityName:'潼关',  deliveryDesc:'一批蜀铁刀具，关中客人在潼关镖局取货' },

  // ── 扬州(yangzhou) ── 相邻：徐州(N)、苏州(E)、南京(S)
  // 扬州掌柜→ 苏州女医（江南医案往来）
  yangzhou_inn:   { targetNpcId:'suzhou_doctor',         targetNpcName:'叶青莲',   targetCityId:'suzhou',   targetCityName:'苏州',  letterDesc:'一封扬州病家托苏州叶青莲女医远诊的信笺' },

  // ── 苏州(suzhou) ── 相邻：海仓(N)、杭州(S)、桃花岛海岸(E)、南京(W)
  // 苏州掌柜→ 杭州名医（丝绸商病了）
  suzhou_inn:     { targetNpcId:'hangzhou_doctor',       targetNpcName:'陈回春',   targetCityId:'hangzhou', targetCityName:'杭州',  letterDesc:'一封苏州绸缎商托杭州陈回春大夫出诊的急信' },
  // 苏州铁匠→ 杭州茶馆（特制茶刀定制）
  suzhou_smith:   { targetNpcId:'hangzhou_inn',          targetNpcName:'柳春风',   targetCityId:'hangzhou', targetCityName:'杭州',  deliveryDesc:'一套苏式精工茶刀，西湖茶馆柳掌柜定制的' },

  // ── 杭州(hangzhou) ── 相邻：苏州(N)、明州(S)、南京(W)
  // 杭州掌柜→ 苏州园林客栈（富商转信）
  hangzhou_inn:   { targetNpcId:'suzhou_inn',            targetNpcName:'顾绣娘',   targetCityId:'suzhou',   targetCityName:'苏州',  letterDesc:'一封杭州商户托苏州顾绣娘代转的家书' },

  // ── 荆州(jingzhou) ── 相邻：襄阳(N)、武汉(E)
  // 荆州掌柜→ 武汉草药医婆（楚地问诊）
  jingzhou_inn:   { targetNpcId:'wuhan_doctor',          targetNpcName:'叶青莲',   targetCityId:'wuhan',    targetCityName:'武汉',  letterDesc:'一封荆州商人托武汉叶草医看家眷病症的书信' },
  // 荆州铁匠→ 武汉旅店老板（联络货品）
  jingzhou_smith: { targetNpcId:'wuhan_inn',             targetNpcName:'程大嘴',   targetCityId:'wuhan',    targetCityName:'武汉',  deliveryDesc:'一批荆州楚铁刀剑，武汉程老板帮忙代售的货' },

  // ── 武汉(wuhan) ── 相邻：荆州(W)、襄阳(NW)
  // 武汉旅店→ 荆州客栈（商路联络）
  wuhan_inn:      { targetNpcId:'jingzhou_inn',          targetNpcName:'吴老倌',   targetCityId:'jingzhou', targetCityName:'荆州',  letterDesc:'一封请荆州吴老倌代为打听江上镖路消息的信' },
};

// ── 存储键名 ──
const NPC_REQ_KEY = 'wuxia_npc_requests';

// ── 状态 ──
let npcReqState = {
  pending: [],      // 等待玩家处理的委托 [{id, npcId, type, title, desc, reward, expire, cityId}]
  completed: [],    // 已完成的委托ID列表
  rejected: [],     // 已拒绝的委托ID列表（影响好感）
  lastCheckDate: '' // 最后一次每日检查的日期
};

function npcReqSave(){
  try{ localStorage.setItem(NPC_REQ_KEY, JSON.stringify(npcReqState)); }catch(e){}
}
function npcReqLoad(){
  try{
    const raw = localStorage.getItem(NPC_REQ_KEY);
    if(raw){
      const d = JSON.parse(raw);
      npcReqState = Object.assign(npcReqState, d);
      if(!Array.isArray(npcReqState.pending)) npcReqState.pending = [];
      if(!Array.isArray(npcReqState.completed)) npcReqState.completed = [];
      if(!Array.isArray(npcReqState.rejected)) npcReqState.rejected = [];
    }
  }catch(e){}
}

// ════════════════════════════════════════════════════════════════
//  一、委托数据库（NPC可发起的委托模板）
// ════════════════════════════════════════════════════════════════

/**
 * 委托类型：
 *   fetch    — 帮找/带回物品
 *   info     — 打探情报
 *   deliver  — 传信/送物
 *   urgent   — 紧急求助（战斗任务）
 *   gratitude— 感谢回访（轻量，无需出门）
 */
const NPC_REQUEST_TEMPLATES = [

  // ── 小型求助（fetch类）──────────────────────────────────────
  {
    id: 'req_inn_herb',
    npcIds: ['cangzhou_inn','kaifeng_inn','hangzhou_inn','luoyang_inn','yangzhou_inn'],
    type: 'fetch',
    title: '掌柜的小请求',
    desc(npcName){ return `${npcName}拦住了你："哎，兄台，你走江湖见多识广，能否帮我找几株车前草？客官腹泻，我这儿正缺药……"`; },
    reqItem: 'herb_plantain',  // 车前草（如背包有即可完成）
    reqCount: 2,
    reward: { silver: 50, rel: 8, exp: 20 },
    rewardDesc: '银两×50 · 好感+8',
    minRel: 10,
    maxPerDay: 1,
    lore: '江湖客栈，什么稀奇古怪的事都见过，什么稀奇古怪的药也都用过。'
  },
  {
    id: 'req_smith_ore',
    npcIds: ['cangzhou_smith','kaifeng_smith','luoyang_smith','hangzhou_smith'],
    type: 'fetch',
    title: '铁匠的材料单',
    desc(npcName){ return `${npcName}擦了擦手，递给你一张皱皱巴巴的纸条："我这最近正赶大单，铁矿石缺口甚急，你要是能给我带几块回来，工钱好说。"`; },
    reqItem: 'mat_iron_ore',
    reqCount: 3,
    reward: { silver: 80, rel: 10, exp: 25 },
    rewardDesc: '银两×80 · 好感+10',
    minRel: 20,
    maxPerDay: 1,
    lore: '刀剑无眼，但每一把好刀背后都有个睡眠不足的铁匠。'
  },
  {
    id: 'req_doctor_mushroom',
    npcIds: ['cangzhou_doctor','kaifeng_doctor','hangzhou_doctor','luoyang_doctor'],
    type: 'fetch',
    title: '药铺缺货',
    desc(npcName){ return `${npcName}叹气："近日伤者渐多，我这灵芝粉快用完了。若你碰巧有灵芝，不妨卖我几株？"`; },
    reqItem: 'herb_lingzhi',
    reqCount: 1,
    reward: { silver: 120, rel: 12, exp: 30, bonusItem: 'med_jinchuang_yao' },
    rewardDesc: '银两×120 · 好感+12 · 金疮药×1',
    minRel: 15,
    maxPerDay: 1,
    lore: '仁心仁术，但药材不够也得巧妇难为无米之炊。'
  },

  // ── 情报委托（info类）──────────────────────────────────────
  {
    id: 'req_merchant_spy',
    npcIds: ['fuzhou_merchant','yangzhou_merchant','kaifeng_merchant','hangzhou_merchant'],
    type: 'info',
    title: '商人的烦恼',
    desc(npcName){ return `${npcName}压低声音："听说你在江湖走动频繁，能否帮我打探——附近哪条路最近有山匪出没？我下旬要走货，想绕开危险。"`; },
    targetDungeon: null, // 自动读取当前城市附近地下城
    reward: { silver: 150, rel: 15, exp: 40 },
    rewardDesc: '银两×150 · 好感+15',
    minRel: 30,
    maxPerDay: 1,
    lore: '商道险象环生，消息就是命。'
  },
  {
    id: 'req_beggar_location',
    npcIds: ['luoyang_beggar','kaifeng_beggar','hangzhou_beggar'],
    type: 'info',
    title: '丐帮的线报',
    desc(npcName){ return `${npcName}凑过来，手指搓了搓："侠爷，咱丐帮兄弟最近在南郊见了几个陌生人，形迹可疑。你要不要去瞧瞧，回来告诉我是什么路数？"`; },
    reward: { silver: 60, rel: 18, exp: 35, fameBonus: 5 },
    rewardDesc: '银两×60 · 好感+18 · 声望+5',
    minRel: 20,
    maxPerDay: 1,
    lore: '丐帮是江湖的眼睛，但他们有时也需要别人的腿。'
  },

  // ── 传信委托（deliver类）──────────────────────────────────
  {
    id: 'req_inn_letter',
    npcIds: ['cangzhou_inn','kaifeng_inn','luoyang_inn','yangzhou_inn','suzhou_inn','hangzhou_inn','hanzhong_inn','datong_inn','jinyang_inn','tongguan_inn','jingzhou_inn','wuhan_inn'],
    type: 'deliver',
    title: '替人传信',
    desc(npcName, npcId){
      const m = npcId && DELIVER_NPC_MAP[npcId];
      const toName  = m ? m.targetNpcName  : '城中大夫';
      const toCity  = m ? m.targetCityName : '邻镇';
      const letter  = m ? m.letterDesc     : '一封托付书信';
      return `${npcName}从柜台下摸出一封信："有位客官临走时托我转交——${letter}，麻烦你送去${toCity}，交给${toName}。跑一趟不算远，有劳了。"`;
    },
    targetRole: 'doctor',
    reward: { silver: 40, rel: 8, exp: 15 },
    rewardDesc: '银两×40 · 好感+8',
    minRel: 5,
    maxPerDay: 1,
    lore: '江湖人，一诺千金；小事也不例外。'
  },
  {
    id: 'req_smith_delivery',
    npcIds: ['cangzhou_smith','kaifeng_smith','luoyang_smith','suzhou_smith','hanzhong_smith','datong_smith','jinyang_smith'],
    type: 'deliver',
    title: '铁匠的订单',
    desc(npcName, npcId){
      const m = npcId && DELIVER_NPC_MAP[npcId];
      const toName = m ? m.targetNpcName  : '镖局掌柜';
      const toCity = m ? m.targetCityName : '邻镇';
      const goods  = m ? m.deliveryDesc   : '一批定制兵器';
      return `${npcName}把包袱往桌上一推："${goods}——得送去${toCity}交给${toName}，我腰不好走不了远路，你帮个忙？"`;
    },
    targetRole: 'guild',
    reward: { silver: 60, rel: 10, exp: 20 },
    rewardDesc: '银两×60 · 好感+10',
    minRel: 20,
    maxPerDay: 1,
    lore: '每一把刀，都有它要去的地方。'
  },

  // ── 感谢回访（gratitude类）──────────────────────────────
  {
    id: 'req_gratitude_inn',
    npcIds: ['cangzhou_inn','kaifeng_inn','hangzhou_inn','luoyang_inn'],
    type: 'gratitude',
    title: '掌柜的谢意',
    desc(npcName){ return `${npcName}招手叫住你："上次多亏了你……我特意备了几坛好酒，你务必收下。"`; },
    triggerAfterQuest: true, // 仅在完成该NPC任务后触发
    reward: { silver: 30, rel: 12, bonusItem: 'food_yellow_wine' },
    rewardDesc: '银两×30 · 好感+12 · 黄酒×2',
    minRel: 30,
    maxPerDay: 1,
    lore: '江湖上，有情有义的人不多，却正是这些人让江湖有了温度。'
  },
  {
    id: 'req_gratitude_doctor',
    npcIds: ['cangzhou_doctor','kaifeng_doctor','hangzhou_doctor','luoyang_doctor'],
    type: 'gratitude',
    title: '大夫的谢礼',
    desc(npcName){ return `${npcName}从医箱里取出一个小瓷瓶："你上次帮了我，这瓶养气丹，算是我的心意，请勿推辞。"`; },
    triggerAfterQuest: true,
    reward: { rel: 15, bonusItem: 'med_yangqi_dan' },
    rewardDesc: '好感+15 · 养气丹×1',
    minRel: 35,
    maxPerDay: 1,
    lore: '大夫的谢礼，往往比银子更实用。'
  },

  // ── 紧急委托（urgent类）──────────────────────────────────
  {
    id: 'req_urgent_protect',
    npcIds: ['cangzhou_escort_woman','kaifeng_escort_woman'],
    type: 'urgent',
    title: '紧急护送',
    desc(npcName){ return `${npcName}神色焦急："不好了！我们有位要护送的商队客户在城外遇袭，旁边没有人手，你能帮我们走一趟吗？事成必有重谢！"`; },
    reward: { silver: 300, rel: 20, exp: 80, fameBonus: 10 },
    rewardDesc: '银两×300 · 好感+20 · 声望+10',
    minRel: 40,
    maxPerDay: 1,
    lore: '镖局的生意，靠的是每一次不失的护送。'
  }
];

// ════════════════════════════════════════════════════════════════
//  二、核心逻辑
// ════════════════════════════════════════════════════════════════

/**
 * 获取当前城市可触发的NPC委托
 * @param {string} cityId
 * @param {string} [triggerSource] 'enter'|'quest_complete'|'daily'
 * @returns {object|null} 随机选一个委托，或 null
 */
function npcReqPickForCity(cityId, triggerSource){
  if(!cityId) return null;

  // 获取当前城市NPC列表
  const cityNpcs = _getNpcIdsForCity(cityId);
  if(!cityNpcs.length) return null;

  // 获取玩家关系
  const rels = (typeof jianghuState !== 'undefined') ? (jianghuState.npcRels || {}) : {};
  const cityRep = (typeof jhGetCityRep === 'function') ? jhGetCityRep(cityId).rep : 0;

  // 过滤可用模板
  const available = NPC_REQUEST_TEMPLATES.filter(tpl => {
    // NPC 在当前城市
    const hasNpc = tpl.npcIds.some(id => cityNpcs.includes(id));
    if(!hasNpc) return false;

    // 未在 pending 中已有相同id的委托
    if(npcReqState.pending.some(r => r.tplId === tpl.id)) return false;

    // gratitude 类只在 quest_complete 时触发
    if(tpl.type === 'gratitude' && triggerSource !== 'quest_complete') return false;

    // urgent 类只在 daily 或 reputation 触发
    if(tpl.type === 'urgent' && triggerSource === 'quest_complete') return false;

    // 关系门槛
    const npcWithRel = tpl.npcIds.find(id => cityNpcs.includes(id));
    if(npcWithRel){
      const relObj = rels[npcWithRel] || {};
      const relVal = (typeof relObj === 'object') ? (relObj.rel || relObj || 0) : relObj;
      const actualRel = (typeof relVal === 'object') ? (relVal.rel || 0) : (relVal || 0);
      if(actualRel < (tpl.minRel || 0)) return false;
    }

    return true;
  });

  if(!available.length) return null;

  // 随机选一个
  const tpl = available[Math.floor(Math.random() * available.length)];

  // 选择具体NPC（在当前城市内）
  const validNpcIds = tpl.npcIds.filter(id => cityNpcs.includes(id));
  const chosenNpcId = validNpcIds[Math.floor(Math.random() * validNpcIds.length)];

  // 构建委托实例
  const npcName = _getNpcDisplayName(chosenNpcId);
  // deliver 类型：从 DELIVER_NPC_MAP 取固定目标
  const deliverTarget = (tpl.type === 'deliver' && DELIVER_NPC_MAP[chosenNpcId]) ? DELIVER_NPC_MAP[chosenNpcId] : null;
  return {
    instanceId: `req_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    tplId: tpl.id,
    npcId: chosenNpcId,
    npcName,
    type: tpl.type,
    title: tpl.title,
    desc: typeof tpl.desc === 'function' ? tpl.desc(npcName, chosenNpcId) : tpl.desc,
    reward: tpl.reward,
    rewardDesc: tpl.rewardDesc,
    lore: tpl.lore,
    reqItem: tpl.reqItem || null,
    reqCount: tpl.reqCount || 0,
    targetRole:    tpl.targetRole    || null,
    targetNpcId:   deliverTarget ? deliverTarget.targetNpcId   : null,
    targetNpcName: deliverTarget ? deliverTarget.targetNpcName : null,
    targetCityId:  deliverTarget ? deliverTarget.targetCityId  : cityId,
    cityId,
    createdAt: Date.now(),
    expire: Date.now() + 3 * 86400000 // 3天过期
  };
}

/**
 * 进城时检查是否触发NPC委托
 * @param {string} cityId
 */
function npcReqOnEnterCity(cityId){
  if(!cityId) return;

  const today = new Date().toLocaleDateString();
  const storedToday = (npcReqState._enterCheckDates || {})[cityId];
  if(storedToday === today) return; // 今日已检查过该城市

  // 记录检查
  if(!npcReqState._enterCheckDates) npcReqState._enterCheckDates = {};
  npcReqState._enterCheckDates[cityId] = today;

  // 清理过期委托
  _npcReqCleanExpired();

  // 城市声望越高，触发概率越高
  const cityRep = (typeof jhGetCityRep === 'function') ? jhGetCityRep(cityId).rep : 0;
  let triggerChance = 0.15;
  if(cityRep >= 60) triggerChance = 0.45;
  else if(cityRep >= 40) triggerChance = 0.30;
  else if(cityRep >= 20) triggerChance = 0.20;

  if(Math.random() > triggerChance) { npcReqSave(); return; }

  const req = npcReqPickForCity(cityId, 'enter');
  if(!req) { npcReqSave(); return; }

  npcReqState.pending.push(req);
  npcReqSave();

  // 延迟 1.5s 弹出（让城镇页面渲染完）
  setTimeout(() => _npcReqShowPopup(req), 1500);
}

/**
 * 进城时检查结义兄弟求助事件（sworn-brother.js）
 * @param {string} cityId
 */
function _swornCheckBrotherEvent(cityId){
  if(typeof SW === 'undefined' || typeof SW.eventBrotherHelp !== 'function') return;
  const evt = SW.eventBrotherHelp();
  if(!evt) return;
  // 简单的弹窗提示
  if(typeof townToast === 'function'){
    townToast(`🩸 ${evt.title}`);
  }
}

/**
 * 完成任务后回调：30%概率触发感谢回访
 * @param {string} questId
 * @param {string} npcId  任务NPC
 * @param {string} cityId
 */
function npcReqOnQuestComplete(questId, npcId, cityId){
  if(!npcId || !cityId) return;
  if(Math.random() > 0.30) return;

  const req = npcReqPickForCity(cityId, 'quest_complete');
  if(!req) return;

  // 优先选与任务NPC相同的模板
  const grat = NPC_REQUEST_TEMPLATES.find(t =>
    t.type === 'gratitude' && t.npcIds.includes(npcId)
  );
  const finalReq = grat
    ? {
        ...req,
        tplId: grat.id,
        npcId,
        npcName: _getNpcDisplayName(npcId),
        type: 'gratitude',
        title: grat.title,
        desc: typeof grat.desc === 'function' ? grat.desc(_getNpcDisplayName(npcId)) : grat.desc,
        reward: grat.reward,
        rewardDesc: grat.rewardDesc,
        lore: grat.lore
      }
    : req;

  npcReqState.pending.push(finalReq);
  npcReqSave();

  setTimeout(() => _npcReqShowPopup(finalReq), 800);
}

/**
 * 领取/完成委托
 * @param {string} instanceId
 */
function npcReqComplete(instanceId){
  const idx = npcReqState.pending.findIndex(r => r.instanceId === instanceId);
  if(idx < 0) return;
  const req = npcReqState.pending[idx];

  // 发放奖励
  _npcReqGiveReward(req);

  npcReqState.completed.push(instanceId);
  npcReqState.pending.splice(idx, 1);
  npcReqSave();

  // 关闭弹窗
  const pop = document.getElementById('npc-req-overlay');
  if(pop) pop.remove();

  if(typeof showToast === 'function'){
    showToast(`✅ 完成了「${req.npcName}」的委托：${req.title}`, 'success');
  }
}

/**
 * 拒绝委托（好感-5）
 */
function npcReqReject(instanceId){
  const idx = npcReqState.pending.findIndex(r => r.instanceId === instanceId);
  if(idx < 0) return;
  const req = npcReqState.pending[idx];

  // 好感惩罚
  if(typeof npcChangeRel === 'function'){
    npcChangeRel(req.npcId, -5);
  } else if(typeof jianghuState !== 'undefined' && jianghuState.npcRels){
    const rel = jianghuState.npcRels[req.npcId];
    if(rel && typeof rel === 'object') rel.rel = Math.max(0, (rel.rel||0) - 5);
    if(typeof jianghuSave === 'function') jianghuSave();
  }

  npcReqState.rejected.push(instanceId);
  npcReqState.pending.splice(idx, 1);
  npcReqSave();

  const pop = document.getElementById('npc-req-overlay');
  if(pop) pop.remove();

  if(typeof showToast === 'function'){
    showToast(`「${req.npcName}」有些失望……好感-5`, 'warn');
  }
}

// ════════════════════════════════════════════════════════════════
//  三、弹窗 UI
// ════════════════════════════════════════════════════════════════

function _npcReqShowPopup(req){
  if(!req) return;

  // 避免弹窗堆叠：只有弹窗不存在时才显示
  if(document.getElementById('npc-req-overlay')) return;

  // 类型颜色
  const typeColors = {
    fetch:    '#60b8ff',
    info:     '#a0e0c0',
    deliver:  '#f0c060',
    urgent:   '#ff8060',
    gratitude:'#ff90c0'
  };
  const typeLabels = {
    fetch:    '🎒 帮找物品',
    info:     '🔍 打探情报',
    deliver:  '📬 帮忙传信',
    urgent:   '⚡ 紧急委托',
    gratitude:'💝 感谢回访'
  };
  const color = typeColors[req.type] || '#a0b890';
  const typeLabel = typeLabels[req.type] || '委托';

  // 生成 NPC ASCII 头像（简易）
  const avatar = _npcReqGetPortrait(req.npcId);

  const overlay = document.createElement('div');
  overlay.id = 'npc-req-overlay';
  overlay.innerHTML = `
    <div class="npc-req-backdrop" onclick="_npcReqDismiss('${req.instanceId}')"></div>
    <div class="npc-req-card" style="border-color:${color}55">
      <!-- 类型标签 -->
      <div class="npc-req-type-tag" style="color:${color};border-color:${color}44">
        ${typeLabel}
      </div>
      <!-- NPC 信息行 -->
      <div class="npc-req-npc-row">
        <div class="npc-req-portrait">${avatar}</div>
        <div class="npc-req-npc-info">
          <div class="npc-req-npc-name">${req.npcName}</div>
          <div class="npc-req-npc-city">📍 ${_getCityDisplayName(req.cityId)}</div>
        </div>
        <div class="npc-req-title" style="color:${color}">${req.title}</div>
      </div>
      <!-- 对话内容 -->
      <div class="npc-req-desc">"${req.desc}"</div>
      <!-- 奖励 -->
      <div class="npc-req-reward-bar">
        <span style="color:#a0b890;font-size:11px">委托报酬：</span>
        <span style="color:#f0d080;font-size:12px">${req.rewardDesc}</span>
      </div>
      ${req.lore ? `<div class="npc-req-lore">${req.lore}</div>` : ''}
      <!-- 按钮 -->
      <div class="npc-req-btns">
        <button class="npc-req-btn npc-req-reject" onclick="npcReqReject('${req.instanceId}')">
          婉拒
        </button>
        <button class="npc-req-btn npc-req-accept" onclick="npcReqHandleAccept('${req.instanceId}')"
          style="border-color:${color}88;color:${color}">
          接受委托
        </button>
      </div>
    </div>
  `;
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:88880;
    display:flex;align-items:flex-end;justify-content:center;
    font-family:'Courier New',monospace;
    animation:npcReqFadeIn .35s ease forwards;
    padding-bottom:16px;
  `;
  document.body.appendChild(overlay);
}

/**
 * 接受委托：检查是否可立即完成（如背包有物品），否则加入待办
 */
window.npcReqHandleAccept = function(instanceId){
  const req = npcReqState.pending.find(r => r.instanceId === instanceId);
  if(!req) return;

  const pop = document.getElementById('npc-req-overlay');
  if(pop) pop.remove();

  // fetch 类：检查背包
  if(req.type === 'fetch' && req.reqItem){
    const hasEnough = _npcReqCheckItem(req.reqItem, req.reqCount || 1);
    if(hasEnough){
      // 消耗物品并立即完成
      _npcReqConsumeItem(req.reqItem, req.reqCount || 1);
      npcReqComplete(instanceId);
      return;
    } else {
      if(typeof showToast === 'function'){
        showToast(`📋 已接受「${req.title}」，前往地下城采集后再回来汇报！`, 'info');
      }
      return;
    }
  }

  // deliver/info/gratitude/urgent 类：弹出简单完成流程
  if(req.type === 'gratitude'){
    // 感谢委托：直接完成
    npcReqComplete(instanceId);
    return;
  }

  // 其他类型：提示玩家去操作
  const hints = {
    deliver: `📬 请前往城内「${_getRoleDisplayName(req.targetRole)}」处完成传信任务`,
    info:    '🔍 请前往附近地下城打探情报后回来汇报',
    urgent:  '⚡ 请做好准备，立即出发护送！'
  };
  if(typeof showToast === 'function'){
    showToast(hints[req.type] || `接受了「${req.title}」`, 'info');
  }

  // urgent 类：立即完成（后续可扩展为实际战斗）
  if(req.type === 'urgent'){
    setTimeout(() => npcReqComplete(instanceId), 500);
  }
};

/**
 * 点击背景关闭（不计拒绝，仅延后）
 */
window._npcReqDismiss = function(instanceId){
  const pop = document.getElementById('npc-req-overlay');
  if(pop) pop.remove();
  // 委托留在 pending，玩家可从状态栏重新查看
};

/**
 * 在 NPC 对话框里完成送信委托
 * 由 openNpcDialog 中的"📮 送达"按钮调用
 */
window.npcReqDeliverToNpc = function(instanceId){
  const req = npcReqState.pending.find(r => r.instanceId === instanceId);
  if(!req || req.type !== 'deliver') return;

  // 完成委托发放奖励
  npcReqComplete(instanceId);

  // 关闭 NPC 对话框并重新打开（刷新按钮状态）
  if(typeof closeNpcDialog === 'function') closeNpcDialog();
};

/**
 * 在 NPC 对话框里完成 QUEST_DB 类型的 deliver 任务（quest_newbie_letter_delivery / quest_daily_deliver）
 * 由 openNpcDialog 中的"📮 送达"按钮调用
 */
window.npcQuestDeliverHere = function(questId){
  if(typeof getQuestStatus !== 'function' || getQuestStatus(questId) !== 'active') return;
  const q = typeof getAnyQuest === 'function' ? getAnyQuest(questId) : null;
  if(!q || q.type !== 'deliver') return;

  // 标记为"待领取"（done），让玩家回到接任务NPC处领奖
  if(typeof setQuestStatus === 'function') setQuestStatus(questId, 'done');

  if(typeof townToast === 'function'){
    townToast(`📮 信件已送达！回到委托人处领取酬劳。`);
  }
  if(typeof closeNpcDialog === 'function') closeNpcDialog();
};





// ════════════════════════════════════════════════════════════════
//  四、辅助函数
// ════════════════════════════════════════════════════════════════

/** 获取城市的NPC ID列表 */
function _getNpcIdsForCity(cityId){
  if(typeof NAMED_CITY_NPCS !== 'undefined'){
    return NAMED_CITY_NPCS[cityId] || [];
  }
  // fallback：从 NPC_DB 扫描
  if(typeof NPC_DB !== 'undefined'){
    return Object.keys(NPC_DB).filter(id => id.startsWith(cityId + '_'));
  }
  return [];
}

/** 获取NPC显示名（优先取name字段）*/
function _getNpcDisplayName(npcId){
  if(typeof NPC_DB !== 'undefined' && NPC_DB[npcId]){
    return NPC_DB[npcId].name || npcId;
  }
  // fallback：从ID推断
  const parts = npcId.split('_');
  return parts.slice(1).join('·') || npcId;
}

/** 获取城市显示名 */
function _getCityDisplayName(cityId){
  if(typeof WORLD_NODES !== 'undefined' && WORLD_NODES[cityId]){
    return WORLD_NODES[cityId].name || cityId;
  }
  return cityId;
}

/** 获取角色类型显示名 */
function _getRoleDisplayName(role){
  const map = {
    doctor: '医馆', inn: '客栈', smith: '铁匠铺',
    guild: '镖局', merchant: '商铺', tavern: '酒肆'
  };
  return map[role] || role || '目标地点';
}

/** 简易 NPC 头像（ASCII风格）*/
function _npcReqGetPortrait(npcId){
  const portraits = {
    inn:      '👴', doctor:   '⚕️', smith:    '🔨',
    escort:   '🗡️', merchant: '🪙', beggar:   '🧤',
    swordsman:'⚔️', default:  '🧑'
  };
  for(const [key, icon] of Object.entries(portraits)){
    if(npcId.includes(key)) return `<span style="font-size:28px">${icon}</span>`;
  }
  return `<span style="font-size:28px">🧑</span>`;
}

/** 发放委托奖励 */
function _npcReqGiveReward(req){
  const r = req.reward || {};

  if(r.silver && typeof addSilver === 'function') addSilver(r.silver, `NPC委托:${req.title}`);
  else if(r.silver && typeof travelPlayerState !== 'undefined'){
    travelPlayerState.silver = (travelPlayerState.silver || 0) + r.silver;
    if(typeof travelSave === 'function') travelSave();
  }

  if(r.exp && typeof addExp === 'function') addExp(r.exp);

  if(r.fameBonus && typeof jhAddFame === 'function') jhAddFame(r.fameBonus, req.cityId);

  if(r.rel && typeof npcChangeRel === 'function'){
    npcChangeRel(req.npcId, r.rel);
  } else if(r.rel && typeof jianghuState !== 'undefined'){
    const rel = jianghuState.npcRels[req.npcId];
    if(rel && typeof rel === 'object') rel.rel = Math.min(100, (rel.rel||0) + r.rel);
    if(typeof jianghuSave === 'function') jianghuSave();
  }

  // 奖励物品
  if(r.bonusItem && typeof addItemToInventory === 'function'){
    addItemToInventory(r.bonusItem, 1);
  }
}

/** 检查背包是否有足够物品 */
function _npcReqCheckItem(itemId, count){
  if(typeof window.edS === 'undefined') return false;
  const inv = window.edS.inventory || window.edS.bag || [];
  const found = inv.filter(it => it && it.id === itemId);
  return found.length >= count;
}

/** 消耗背包物品 */
function _npcReqConsumeItem(itemId, count){
  if(typeof window.edS === 'undefined') return;
  const inv = window.edS.inventory || window.edS.bag;
  if(!Array.isArray(inv)) return;
  let removed = 0;
  for(let i = inv.length - 1; i >= 0 && removed < count; i--){
    if(inv[i] && inv[i].id === itemId){
      inv.splice(i, 1);
      removed++;
    }
  }
  if(typeof saveGameState === 'function') saveGameState();
}

/** 清理过期委托 */
function _npcReqCleanExpired(){
  const now = Date.now();
  const before = npcReqState.pending.length;
  npcReqState.pending = npcReqState.pending.filter(r => !r.expire || r.expire > now);
  if(npcReqState.pending.length < before) npcReqSave();
}

// ════════════════════════════════════════════════════════════════
//  五、CSS 注入
// ════════════════════════════════════════════════════════════════

(function injectNpcReqStyles(){
  const style = document.createElement('style');
  style.textContent = `
@keyframes npcReqFadeIn {
  from { opacity:0;transform:translateY(40px); }
  to   { opacity:1;transform:translateY(0); }
}
.npc-req-backdrop {
  position:absolute;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(2px);
}
.npc-req-card {
  position:relative;z-index:1;
  width:min(400px,95vw);
  background:rgba(12,16,12,.97);
  border-radius:14px;border-width:1px;border-style:solid;
  padding:18px 18px 14px;
  box-shadow:0 -4px 40px rgba(0,0,0,.6);
}
.npc-req-type-tag {
  display:inline-block;font-size:10px;padding:2px 8px;
  border-radius:8px;border-width:1px;border-style:solid;
  margin-bottom:12px;letter-spacing:1px;
}
.npc-req-npc-row {
  display:flex;align-items:center;gap:10px;margin-bottom:12px;
}
.npc-req-portrait {
  width:44px;height:44px;border-radius:8px;
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.npc-req-npc-info {
  flex:1;min-width:0;
}
.npc-req-npc-name {
  font-size:15px;font-weight:700;color:#e8f5e8;
}
.npc-req-npc-city {
  font-size:10px;color:#607060;margin-top:2px;
}
.npc-req-title {
  font-size:13px;font-weight:700;text-align:right;white-space:nowrap;
}
.npc-req-desc {
  font-size:13px;color:#b0c8a0;line-height:1.7;
  padding:10px 12px;border-left:2px solid rgba(255,255,255,.1);
  margin-bottom:10px;font-style:italic;
}
.npc-req-reward-bar {
  padding:7px 10px;border-radius:6px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);
  margin-bottom:8px;display:flex;align-items:center;gap:6px;
}
.npc-req-lore {
  font-size:10px;color:#506050;line-height:1.5;
  margin-bottom:8px;text-align:right;font-style:italic;
}
.npc-req-btns {
  display:flex;gap:8px;margin-top:12px;
}
.npc-req-btn {
  flex:1;padding:9px 12px;border-radius:8px;cursor:pointer;
  font-size:13px;font-family:inherit;transition:all .2s;
}
.npc-req-reject {
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
  color:#667;
}
.npc-req-reject:hover { background:rgba(255,255,255,.08);color:#a0b090; }
.npc-req-accept {
  background:rgba(255,255,255,.06);border-width:1px;border-style:solid;
  font-weight:700;
}
.npc-req-accept:hover { background:rgba(255,255,255,.12); }
  `;
  document.head.appendChild(style);
})();

// ════════════════════════════════════════════════════════════════
//  六、初始化
// ════════════════════════════════════════════════════════════════

npcReqLoad();
