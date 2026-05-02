// ════════════════════════════════════════════════════
//  sect-economy.js  门派经济 + 悬赏系统
//  功能：
//    1. 门派资金库（收入/支出管理）
//    2. 悬赏任务板（杀怪/采集/护送等悬赏）
//    3. 门派贸易（买卖物资影响银两和贡献）
//    4. 门派资金分红机制
//  version: 1
// ════════════════════════════════════════════════════

;(function(){
'use strict';

// ═══════════════════════════════════════════════════
//  一、门派资金库
// ═══════════════════════════════════════════════════

/**
 * 门派资金来源
 * - 弟子贡献（每次获得贡献时自动存入门派资金）
 * - 建筑收入（金库等级产生的每日收入）
 * - 交易收入（出售门派物资）
 */
var SE_FUND_SOURCES = {
  contribution: '弟子贡献',
  building:     '建筑收入',
  trade:        '门派贸易',
  quest:        '任务报酬',
  dividend:     '分红收益',
};

/**
 * 悬赏任务池
 * type: 'kill' | 'collect' | 'escort' | 'explore'
 */
var SE_BOUNTY_POOL = [
  // ── 击杀悬赏 ──
  { id:'b_hunt_wolves',     type:'kill',    name:'猎杀恶狼',     icon:'🐺', desc:'山脚下的恶狼成群出没，威胁过往行人。', targetCount:5,  targetPool:['wolf','wolf_king'],      reward:{ silver:100, contrib:5,  exp:50 },  minLv:5 },
  { id:'b_hunt_bandits',    type:'kill',    name:'剿灭山贼',     icon:'🗡️', desc:'一伙山贼盘踞在要道，劫掠过往商队。', targetCount:8,  targetPool:['bandit_foot','bandit_veteran'], reward:{ silver:200, contrib:10, exp:80 }, minLv:10 },
  { id:'b_hunt_poison',     type:'kill',    name:'清除毒虫',     icon:'🐍', desc:'附近的毒蛇毒虫越来越多，需尽快清除。', targetCount:6,  targetPool:['poison_toad','venomous_spider'], reward:{ silver:150, contrib:8,  exp:60 },  minLv:8 },
  { id:'b_hunt_undead',     type:'kill',    name:'超度亡魂',     icon:'👻', desc:'古墓附近的亡灵频繁出没，村民不敢上山。', targetCount:10, targetPool:['tomb_zombie','ancient_undead_soldier'], reward:{ silver:300, contrib:15, exp:120 }, minLv:20 },
  { id:'b_hunt_cultist',    type:'kill',    name:'铲除邪教',     icon:'☠️', desc:'有邪教分子在附近活动，需将其剿灭。', targetCount:12, targetPool:['xuanming_cultist','dark_cultist'], reward:{ silver:400, contrib:20, exp:150 }, minLv:30 },
  { id:'b_hunt_assassin',   type:'kill',    name:'追杀刺客',     icon:'🗡️', desc:'一位神秘刺客在城中行刺，必须将其擒获。', targetCount:3,  targetPool:['shadow_assassin','hunter_thief'], reward:{ silver:500, contrib:25, exp:200 }, minLv:35 },
  { id:'b_hunt_monster',    type:'kill',    name:'斩杀妖兽',     icon:'👹', desc:'深山中出现了一只凶猛的妖兽。', targetCount:1,  targetPool:['snow_leopard','blizzard_elemental'], reward:{ silver:600, contrib:30, exp:250 }, minLv:40 },

  // ── 采集悬赏 ──
  { id:'b_gather_herbs',    type:'collect', name:'采集灵药',     icon:'🌿', desc:'炼丹房需要一批草药，到山中采集。', targetCount:5,  targetItem:'item_herb_green', targetItemName:'绿色草药', reward:{ silver:120, contrib:8,  exp:40 },  minLv:5 },
  { id:'b_gather_ore',      type:'collect', name:'开采矿石',     icon:'⛏️', desc:'兵器库需要铁矿石打造新兵器。', targetCount:8,  targetItem:'item_iron_ore',  targetItemName:'铁矿石',   reward:{ silver:150, contrib:8,  exp:50 },  minLv:5 },
  { id:'b_gather_crystal',  type:'collect', name:'寻找灵石',     icon:'💎', desc:'门派需要灵石修炼阵法。', targetCount:3,  targetItem:'item_spirit_stone', targetItemName:'灵石',     reward:{ silver:250, contrib:15, exp:80 },  minLv:15 },
  { id:'b_gather_silk',     type:'collect', name:'搜集蚕丝',     icon:'🧵', desc:'城中绸缎庄委托代购蚕丝。', targetCount:6,  targetItem:'item_cloth',      targetItemName:'丝绸',     reward:{ silver:180, contrib:10, exp:60 },  minLv:8 },

  // ── 护送悬赏 ──
  { id:'b_escort_merchant', type:'escort',  name:'护送商队',     icon:'🚶', desc:'一批贵重货物需要护送至目的地。', targetCount:1,  reward:{ silver:250, contrib:12, exp:100 }, minLv:12 },
  { id:'b_escort_noble',    type:'escort',  name:'护送贵人',     icon:'👑', desc:'一位重要人物需要安全护送到邻城。', targetCount:1,  reward:{ silver:400, contrib:20, exp:150 }, minLv:25 },
  { id:'b_escort_supplies', type:'escort',  name:'运输物资',     icon:'📦', desc:'一批紧急军需物资需要运送到前线。', targetCount:1,  reward:{ silver:350, contrib:18, exp:120 }, minLv:20 },

  // ── 探索悬赏 ──
  { id:'b_explore_ruin',    type:'explore', name:'探索遗迹',     icon:'🏛', desc:'附近发现了一处古代遗迹，需要人前去探索。', targetCount:1,  targetDungeon:'any', reward:{ silver:300, contrib:15, exp:120 }, minLv:15 },
  { id:'b_explore_cave',    type:'explore', name:'探秘洞穴',     icon:'🕳️', desc:'山中有一个神秘洞穴，据说有宝藏。', targetCount:1,  targetDungeon:'any', reward:{ silver:350, contrib:18, exp:140 }, minLv:20 },
  { id:'b_explore_island',  type:'explore', name:'海岛探险',     icon:'🏝️', desc:'海上发现了一座无名岛屿。', targetCount:1,  targetDungeon:'any', reward:{ silver:500, contrib:25, exp:200 }, minLv:30 },
];

// ═══════════════════════════════════════════════════
//  二、存档
// ═══════════════════════════════════════════════════

var SE_SAVE_KEY = 'wuxia_sect_economy';

/**
 * 存档结构：
 * {
 *   sectId,
 *   fund: 0,                     // 门派资金（银两）
 *   totalIncome: 0,               // 累计收入
 *   totalExpense: 0,              // 累计支出
 *   ledger: [ { date, type, amount, desc } ],  // 资金流水
 *   activeBounties: { bountyId: { progress, acceptedAt } },
 *   completedBounties: [ { bountyId, completedAt } ],
 *   lastFundTick: 'YYYY-MM-DD',  // 上次资金结算
 *   lastBountyRefresh: 'YYYY-MM-DD',
 * }
 */
function seLoad(){
  try { return JSON.parse(localStorage.getItem(SE_SAVE_KEY) || '{}'); }
  catch(e){ return {}; }
}
function seSave(data){
  try { localStorage.setItem(SE_SAVE_KEY, JSON.stringify(data)); }
  catch(e){}
}

// ═══════════════════════════════════════════════════
//  三、资金库逻辑
// ═══════════════════════════════════════════════════

function _seTodayStr(){
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

/** 门派资金变动 */
function seAddFund(amount, source, desc){
  var save = seLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return;

  if(save.sectId !== ed.sect){
    save.sectId = ed.sect;
    save.fund = 0;
    save.totalIncome = 0;
    save.totalExpense = 0;
    save.ledger = [];
  }

  save.fund = (save.fund || 0) + amount;
  if(amount > 0) save.totalIncome = (save.totalIncome || 0) + amount;
  else save.totalExpense = (save.totalExpense || 0) + Math.abs(amount);

  if(!save.ledger) save.ledger = [];
  save.ledger.push({
    date: _seTodayStr(),
    type: source || 'other',
    amount: amount,
    desc: desc || (amount > 0 ? '收入' : '支出'),
  });

  // 保留最近50条流水
  if(save.ledger.length > 50) save.ledger = save.ledger.slice(-50);

  seSave(save);
}

/** 获取门派资金 */
function seGetFund(){
  var save = seLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect || save.sectId !== ed.sect) return 0;
  return save.fund || 0;
}

/** 每日资金结算（建筑收入） */
function seDailyFundTick(){
  var save = seLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return;

  var today = _seTodayStr();
  if(save.lastFundTick === today) return;

  // 金库建筑收入
  var incomeBonus = 0;
  if(typeof sbGetEffect === 'function'){
    incomeBonus = sbGetEffect('treasury', 'incomeBonus') || 0;
  }

  if(incomeBonus > 0){
    seAddFund(incomeBonus, 'building', '金库每日收入（Lv.' + sbGetLevel('treasury') + '）');
  }

  save.lastFundTick = today;
  seSave(save);
}

// ═══════════════════════════════════════════════════
//  四、悬赏任务逻辑
// ═══════════════════════════════════════════════════

/** 每日刷新可接悬赏 */
function seRefreshBounties(){
  var save = seLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return;

  var today = _seTodayStr();
  if(save.lastBountyRefresh === today) return;

  // 清理过期的活跃悬赏（3天过期）
  if(save.activeBounties){
    var now = Date.now();
    Object.keys(save.activeBounties).forEach(function(bid){
      if(now - save.activeBounties[bid].acceptedAt > 3 * 86400000){
        delete save.activeBounties[bid];
      }
    });
  }

  save.lastBountyRefresh = today;
  seSave(save);
}

/** 接受悬赏 */
function seAcceptBounty(bountyId){
  var bounty = SE_BOUNTY_POOL.find(function(b){ return b.id === bountyId; });
  if(!bounty){ if(typeof showToast === 'function') showToast('未知悬赏', 'error'); return false; }

  var save = seLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return false;

  if(ed.level < (bounty.minLv || 1)){
    if(typeof showToast === 'function') showToast('等级不足，需要 Lv.' + bounty.minLv, 'warn');
    return false;
  }

  // 检查已接数量上限（最多3个）
  if(!save.activeBounties) save.activeBounties = {};
  if(Object.keys(save.activeBounties).length >= 3){
    if(typeof showToast === 'function') showToast('最多同时接受3个悬赏', 'warn');
    return false;
  }

  // 不能接已完成的
  if(save.completedBounties && save.completedBounties.some(function(c){ return c.bountyId === bountyId; })){
    if(typeof showToast === 'function') showToast('该悬赏已完成', 'warn');
    return false;
  }

  save.activeBounties[bountyId] = { progress: 0, acceptedAt: Date.now() };
  seSave(save);

  if(typeof showToast === 'function') showToast(bounty.icon + ' 接受悬赏：' + bounty.name, 'ok');
  return true;
}

/** 放弃悬赏 */
function seAbandonBounty(bountyId){
  var save = seLoad();
  if(save.activeBounties && save.activeBounties[bountyId]){
    delete save.activeBounties[bountyId];
    seSave(save);
    if(typeof showToast === 'function') showToast('已放弃悬赏', 'warn');
  }
}

/** 增加悬赏进度 */
function seAddBountyProgress(bountyId, amount){
  var save = seLoad();
  if(!save.activeBounties || !save.activeBounties[bountyId]) return null;

  var bounty = SE_BOUNTY_POOL.find(function(b){ return b.id === bountyId; });
  if(!bounty) return null;

  save.activeBounties[bountyId].progress = (save.activeBounties[bountyId].progress || 0) + amount;

  var target = bounty.targetCount || 1;
  if(save.activeBounties[bountyId].progress >= target){
    // 完成！
    var reward = bounty.reward || {};

    // 发放奖励
    if(reward.silver && typeof addSilver === 'function') addSilver(reward.silver);
    if(reward.contrib && typeof edS !== 'undefined'){
      edS.sectContrib = (edS.sectContrib || 0) + reward.contrib;
      if(typeof saveProgress === 'function') saveProgress();
    }
    if(reward.exp && typeof gainExp === 'function') gainExp(reward.exp);

    // 门派资金
    seAddFund(Math.round((reward.silver || 0) * 0.3), 'quest', '悬赏完成：' + bounty.name + '（30%归入门派）');

    // 记录完成
    delete save.activeBounties[bountyId];
    if(!save.completedBounties) save.completedBounties = [];
    save.completedBounties.push({ bountyId: bountyId, completedAt: Date.now() });

    // 保留最近20条
    if(save.completedBounties.length > 20) save.completedBounties = save.completedBounties.slice(-20);

    seSave(save);

    return { type:'complete', bounty: bounty, reward: reward };
  }

  seSave(save);
  return { type:'progress', progress: save.activeBounties[bountyId].progress, target: target };
}

/** 获取可用悬赏列表 */
function seGetAvailableBounties(){
  var save = seLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;

  var activeIds = new Set(Object.keys(save.activeBounties || {}));
  var completedIds = new Set((save.completedBounties || []).map(function(c){ return c.bountyId; }));

  return SE_BOUNTY_POOL.filter(function(b){
    if(activeIds.has(b.id)) return false;
    if(completedIds.has(b.id)) return false;
    if(ed && ed.level < (b.minLv || 1)) return false;
    return true;
  });
}

/** 获取活跃悬赏 */
function seGetActiveBounties(){
  var save = seLoad();
  var result = [];

  Object.keys(save.activeBounties || {}).forEach(function(bid){
    var bounty = SE_BOUNTY_POOL.find(function(b){ return b.id === bid; });
    if(bounty){
      result.push({
        bounty: bounty,
        progress: save.activeBounties[bid].progress || 0,
        target: bounty.targetCount || 1,
      });
    }
  });

  return result;
}

// ═══════════════════════════════════════════════════
//  五、UI 渲染
// ═══════════════════════════════════════════════════

function renderSectEconomyPanel(sect){
  var container = document.getElementById('tab-economy');
  if(!container) return;

  var save = seLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;

  // 触发每日结算
  seDailyFundTick();
  seRefreshBounties();

  var html = '';

  // ── 资金库概览 ──
  var fund = seGetFund();
  html += '<div style="text-align:center;padding:12px 0 10px">';
  html += '<div style="font-size:18px;font-weight:bold;color:' + (sect.color || '#f0c060') + '">💰 门派资金库</div>';
  html += '<div style="font-size:28px;font-weight:bold;margin:8px 0;color:#f0c060">💰 ' + fund.toLocaleString() + ' <span style="font-size:12px;font-weight:normal">两</span></div>';
  if(save.totalIncome || save.totalExpense){
    html += '<div style="font-size:10px;color:var(--text3)">';
    html += '总收入: <span style="color:#80e880">' + (save.totalIncome || 0) + '</span>';
    html += ' · 总支出: <span style="color:#ff6060">' + (save.totalExpense || 0) + '</span>';
    html += '</div>';
  }
  html += '</div>';

  // ── 悬赏任务板 ──
  html += '<div style="padding:4px 8px">';
  html += '<div style="font-size:14px;font-weight:bold;margin:8px 0 6px">📋 悬赏任务板</div>';

  // 活跃悬赏
  var active = seGetActiveBounties();
  if(active.length > 0){
    html += '<div style="font-size:11px;color:var(--text3);margin-bottom:6px">进行中的悬赏：</div>';
    active.forEach(function(ab){
      var b = ab.bounty;
      var pct = Math.min(100, Math.round((ab.progress / ab.target) * 100));

      html += '<div style="background:rgba(240,192,96,.06);border:1px solid rgba(240,192,96,.15);border-radius:8px;padding:10px;margin-bottom:6px">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div style="display:flex;align-items:center;gap:6px">';
      html += '<span style="font-size:16px">' + b.icon + '</span>';
      html += '<div>';
      html += '<div style="font-weight:bold;font-size:12px">' + b.name + '</div>';
      html += '<div style="font-size:9px;color:var(--text3)">' + ab.progress + '/' + ab.target + ' · ' + b.desc + '</div>';
      html += '</div></div>';
      html += '<button onclick="seAbandonBounty(\'' + b.id + '\');renderSectEconomyPanel(' + (sect ? 'window.SECTS?window.SECTS.find(function(s){return s.id===\'' + sect.id + '\'})||null:null' : 'null') + ')" ' +
        'style="font-size:9px;padding:3px 8px;border:1px solid rgba(255,100,100,.2);border-radius:4px;' +
        'background:transparent;color:#ff8080;cursor:pointer">放弃</button>';
      html += '</div>';
      // 进度条
      html += '<div style="background:rgba(0,0,0,.3);border-radius:3px;height:4px;overflow:hidden;margin-top:6px">';
      html += '<div style="height:100%;width:' + pct + '%;background:#f0c060;border-radius:3px"></div></div>';
      html += '</div>';
    });
  }

  // 可接悬赏
  var available = seGetAvailableBounties();
  if(available.length > 0){
    html += '<div style="font-size:11px;color:var(--text3);margin:8px 0 6px">可接悬赏：</div>';

    // 随机显示5个
    var shuffled = available.sort(function(){ return Math.random() - 0.5; }).slice(0, 5);

    shuffled.forEach(function(b){
      var reward = b.reward || {};
      var canAccept = (ed && ed.level >= (b.minLv || 1));

      html += '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;padding:10px;margin-bottom:5px">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div style="display:flex;align-items:center;gap:6px">';
      html += '<span style="font-size:16px">' + b.icon + '</span>';
      html += '<div>';
      html += '<div style="font-weight:bold;font-size:12px">' + b.name;
      if(b.minLv > 1) html += ' <span style="font-size:9px;color:var(--text3)">Lv.' + b.minLv + '+</span>';
      html += '</div>';
      html += '<div style="font-size:9px;color:var(--text3)">' + b.targetCount + (b.type === 'kill' ? '次击杀' : b.type === 'collect' ? '个物品' : b.type === 'escort' ? '次护送' : '次探索') + ' · ' + b.desc.substring(0, 20) + '…</div>';
      html += '</div></div>';
      // 奖励
      html += '<div style="font-size:9px;color:rgba(200,180,120,.7)">💰' + (reward.silver||0) + ' 🏛+' + (reward.contrib||0) + ' ✨' + (reward.exp||0) + '</div>';
      // 接受按钮
      if(canAccept){
        html += '<button onclick="seAcceptBounty(\'' + b.id + '\');renderSectEconomyPanel(' + (sect ? 'window.SECTS?window.SECTS.find(function(s){return s.id===\'' + sect.id + '\'})||null:null' : 'null') + ')" ' +
          'style="margin-top:4px;padding:3px 10px;border:none;border-radius:4px;background:rgba(240,192,96,.15);color:#f0c060;font-size:10px;cursor:pointer;font-weight:bold">接受</button>';
      }
      html += '</div>';
    });
  } else {
    html += '<div style="text-align:center;padding:16px 0;color:var(--text3);font-size:11px">📭 今日暂无新悬赏</div>';
  }

  // ── 资金流水 ──
  if(save.ledger && save.ledger.length > 0){
    html += '<div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)">';
    html += '<div style="font-size:12px;font-weight:bold;margin-bottom:6px">📊 资金流水（最近）</div>';
    save.ledger.slice(-10).reverse().forEach(function(entry){
      var color = entry.amount > 0 ? '#80e880' : '#ff6060';
      var sign = entry.amount > 0 ? '+' : '';
      html += '<div style="display:flex;justify-content:space-between;font-size:10px;padding:3px 0">';
      html += '<span style="color:var(--text3)">' + entry.desc + '</span>';
      html += '<span style="color:' + color + '">' + sign + entry.amount + '</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  html += '</div>';

  // ── 战法手牌服务（将将胡） ──
  html += '<div style="margin-top:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)">';
  html += '<div style="font-size:12px;font-weight:bold;margin-bottom:6px">👑 战法手牌服务</div>';

  // 读取当前加成
  var cardBonus = {};
  try {
    if(typeof getBuildingCardBonus === 'function') cardBonus = getBuildingCardBonus();
  } catch(e){}

  var services = [
    { id:'reshuffle', icon:'🃏', name:'免费洗牌', cost:50, costSilver:80,  desc:'重置当前手牌，不耗气势', effect:'重置手牌' },
    { id:'observe',   icon:'📖', name:'观摩秘籍', cost:100, costSilver:150, desc:'本场战斗门派学派权重×2.5', effect:'学派权重×2.5' },
    { id:'shield',   icon:'🔮', name:'门派法宝', cost:200, costSilver:300, desc:'本场战斗免疫1次BOSS封手', effect:'免疫封手' },
    { id:'meditate', icon:'🧘', name:'静心调息', cost:30, costSilver:50,  desc:'本场战斗运势保底缩短1回合', effect:'运势-1回合' },
  ];

  services.forEach(function(svc){
    var hasBuff = false;
    if(svc.id === 'meditate' && cardBonus.swapCostReduce > 0) hasBuff = true;

    var useContrib = (ed && ed.sectContrib >= svc.cost);
    var useSilver = (!useContrib && ed && ed.silver >= svc.costSilver);
    var canUse = useContrib || useSilver;

    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:rgba(255,255,255,.03);border-radius:6px;margin-bottom:4px">';
    html += '<div style="display:flex;align-items:center;gap:8px">';
    html += '<span style="font-size:20px">' + svc.icon + '</span>';
    html += '<div>';
    html += '<div style="font-size:11px;font-weight:bold">' + svc.name + '</div>';
    html += '<div style="font-size:9px;color:var(--text3)">' + svc.desc + '</div>';
    html += '</div></div>';
    var btnText = (useContrib ? svc.cost + '贡献' : (useSilver ? svc.costSilver + '银两' : '银两不足'));
    var btnColor = canUse ? '#f0c060' : '#666';
    html += '<button onclick="seBuyCardService(\'' + svc.id + '\')" ' +
      'style="padding:4px 10px;border:none;border-radius:5px;' +
      'background:' + (canUse ? 'rgba(240,192,96,.15)' : 'rgba(100,100,100,.1)') + ';' +
      'color:' + btnColor + ';font-size:10px;cursor:' + (canUse ? 'pointer' : 'default') + '">' +
      btnText + '</button>';
    html += '</div>';
  });
  html += '</div>';

  // 底部
  html += '<div style="text-align:center;padding:12px 8px;font-size:10px;color:var(--text3);opacity:.5">';
  html += '每日刷新悬赏 · 同时最多3个 · 3天未完成自动放弃 · 30%悬赏奖励归入门派资金</div>';

  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════
//  六、导出
// ═══════════════════════════════════════════════════

window.SE_BOUNTY_POOL      = SE_BOUNTY_POOL;
window.SE_FUND_SOURCES     = SE_FUND_SOURCES;
/** 战法手牌服务购买 */
function seBuyCardService(serviceId) {
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if (!ed || !ed.sect) {
    if (typeof showToast === 'function') showToast('请先加入门派', 'warn');
    return false;
  }

  var services = {
    reshuffle: { cost: 50, costSilver: 80, desc: '洗牌' },
    observe:   { cost: 100, costSilver: 150, desc: '观摩' },
    shield:    { cost: 200, costSilver: 300, desc: '法宝' },
    meditate:  { cost: 30, costSilver: 50, desc: '调息' },
  };

  var svc = services[serviceId];
  if (!svc) return false;

  var useContrib = (ed.sectContrib >= svc.cost);
  var useSilver = (ed.silver >= svc.costSilver);
  if (!useContrib && !useSilver) {
    if (typeof showToast === 'function') showToast('银两不足', 'error');
    return false;
  }

  // 扣费
  if (useContrib) {
    ed.sectContrib = (ed.sectContrib || 0) - svc.cost;
  } else {
    ed.silver = (ed.silver || 0) - svc.costSilver;
  }

  // 效果：写入战斗状态（供 battle.js 读取）
  var battleState = JSON.parse(sessionStorage.getItem('wuxia_battle_card_bufs') || '{}');
  var ts = Date.now();

  if (serviceId === 'reshuffle') {
    battleState.reshuffleAvailable = true;
    battleState.reshuffleTime = ts;
    if (typeof showToast === 'function') showToast('🃏 洗牌就绪，本场战斗可免费重置手牌');
  } else if (serviceId === 'observe') {
    battleState.observeActive = true;
    battleState.observeTime = ts;
    if (typeof showToast === 'function') showToast('📖 观摩生效，本场学派权重×2.5');
  } else if (serviceId === 'shield') {
    battleState.bossSealImmune = true;
    battleState.shieldTime = ts;
    if (typeof showToast === 'function') showToast('🔮 法宝护体，本场免疫1次BOSS封手');
  } else if (serviceId === 'meditate') {
    battleState.pityReduction = 1; // 保底阈值-1
    battleState.meditateTime = ts;
    if (typeof showToast === 'function') showToast('🧘 静心调息，本场运势保底-1回合');
  }

  sessionStorage.setItem('wuxia_battle_card_bufs', JSON.stringify(battleState));

  // 刷新面板
  if (typeof renderSectEconomyPanel === 'function') {
    var sect = (typeof SECTS !== 'undefined') ? SECTS.find(function(s) { return s.id === ed.sect; }) : null;
    renderSectEconomyPanel(sect);
  }
  return true;
}

/** 清理过期手牌服务状态（每场战斗开始时调用） */
function seClearCardBuf() {
  try {
    sessionStorage.removeItem('wuxia_battle_card_bufs');
  } catch (e) { }
}

window.seBuyCardService   = seBuyCardService;
window.seClearCardBuf     = seClearCardBuf;
window.seGetFund           = seGetFund;
window.seAddFund           = seAddFund;
window.seDailyFundTick     = seDailyFundTick;
window.seAcceptBounty      = seAcceptBounty;
window.seAbandonBounty     = seAbandonBounty;
window.seAddBountyProgress = seAddBountyProgress;
window.seGetAvailableBounties = seGetAvailableBounties;
window.seGetActiveBounties    = seGetActiveBounties;
window.renderSectEconomyPanel  = renderSectEconomyPanel;

})();
