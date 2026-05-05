// ════════════════════════════════════════════════════
//  sect-building.js  门派建筑升级系统
//  功能：
//    1. 门派建筑管理（6类建筑，各5级升级）
//    2. 建筑效果影响门派功能（贡献商店折扣、炼丹效率、秘境奖励等）
//    3. 建筑材料收集+升级消耗
//    4. 建筑效果全局生效
//  version: 1
// ════════════════════════════════════════════════════

;(function(){
'use strict';

// ═══════════════════════════════════════════════════
//  一、建筑配置
// ═══════════════════════════════════════════════════

/**
 * 建筑类型定义
 * id: 建筑ID
 * name: 建筑名
 * icon: 图标
 * desc: 描述
 * levels: [{ lv, name, cost, effect, desc }] 1-5级
 * cost: { silver, materials: { materialId: count } }
 * effect: 建筑效果
 */
var SECT_BUILDINGS = {
  lecture_hall: {
    id: 'lecture_hall',
    name: '讲武堂',
    icon: '🏛',
    desc: '门派弟子修习武学之所，升级后可增加弟子实力和手牌上限。',
    levels: [
      { lv:1, name:'简陋草堂',     cost:{ silver:500,  mats:{} },                          effect:{ disciplePower:1.0, cardLimitBonus:0 },  desc:'基础训练场所' },
      { lv:2, name:'木质演武场',   cost:{ silver:2000, mats:{item_iron_ore:10} },           effect:{ disciplePower:1.1, cardLimitBonus:1 },  desc:'弟子实力+10% · 手牌上限+1' },
      { lv:3, name:'石砌讲武堂',   cost:{ silver:5000, mats:{item_iron_ore:20,item_spirit_stone:5} }, effect:{ disciplePower:1.25, cardLimitBonus:2 }, desc:'弟子实力+25% · 手牌上限+2' },
      { lv:4, name:'精钢武馆',     cost:{ silver:12000,mats:{item_spirit_stone:15,item_copper_core:5} }, effect:{ disciplePower:1.4, cardLimitBonus:3 }, desc:'弟子实力+40% · 手牌上限+3' },
      { lv:5, name:'天工武圣殿',   cost:{ silver:30000,mats:{item_spirit_stone:30,item_copper_core:15} }, effect:{ disciplePower:1.6, cardLimitBonus:3 }, desc:'弟子实力+60% · 手牌上限+3' },
    ],
  },
  alchemy_room: {
    id: 'alchemy_room',
    name: '丹房',
    icon: '🧪',
    desc: '炼丹制药的场所，升级后可提高炼丹成功率和换牌效果。',
    levels: [
      { lv:1, name:'土灶草庐',     cost:{ silver:300,  mats:{} },                           effect:{ alchemyBonus:1.0, swapCostReduce:0 },  desc:'简陋的炼丹设备' },
      { lv:2, name:'青砖丹室',     cost:{ silver:1500, mats:{item_herb_green:15} },          effect:{ alchemyBonus:1.15, swapCostReduce:1 }, desc:'炼丹+15% · 换牌省1气' },
      { lv:3, name:'玉石炼丹炉',   cost:{ silver:4000, mats:{item_herb_green:30,item_herb_blue:10} }, effect:{ alchemyBonus:1.3, swapCostReduce:2 }, desc:'炼丹+30% · 换牌省2气' },
      { lv:4, name:'玄铁八卦炉',   cost:{ silver:10000,mats:{item_herb_blue:20,item_spirit_stone:10} }, effect:{ alchemyBonus:1.5, swapCostReduce:3 }, desc:'炼丹+50% · 换牌省3气' },
      { lv:5, name:'天火九转炉',   cost:{ silver:25000,mats:{item_herb_blue:40,item_spirit_stone:25} }, effect:{ alchemyBonus:1.8, swapCostReduce:5 }, desc:'炼丹+80% · 换牌省5气' },
    ],
  },
  armory: {
    id: 'armory',
    name: '兵器库',
    icon: '⚔️',
    desc: '打造和存放兵器的场所，升级后增加装备耐久和修理折扣。',
    levels: [
      { lv:1, name:'简陋铁匠铺',   cost:{ silver:400,  mats:{} },                           effect:{ repairDiscount:1.0, durabilityBonus:0 },   desc:'基础的锻造设备' },
      { lv:2, name:'正式铸剑坊',   cost:{ silver:1800, mats:{item_iron_ore:15} },            effect:{ repairDiscount:0.9, durabilityBonus:5 },   desc:'修理费用-10%，装备耐久+5' },
      { lv:3, name:'精钢锻造房',   cost:{ silver:4500, mats:{item_iron_ore:30,item_copper_core:5} }, effect:{ repairDiscount:0.8, durabilityBonus:10 }, desc:'修理费用-20%' },
      { lv:4, name:'玄铁淬火室',   cost:{ silver:11000,mats:{item_copper_core:10,item_spirit_stone:8} }, effect:{ repairDiscount:0.7, durabilityBonus:20 }, desc:'修理费用-30%' },
      { lv:5, name:'天工百炼坊',   cost:{ silver:28000,mats:{item_copper_core:20,item_spirit_stone:20} }, effect:{ repairDiscount:0.5, durabilityBonus:35 }, desc:'修理费用-50%' },
    ],
  },
  treasury: {
    id: 'treasury',
    name: '藏宝阁',
    icon: '💰',
    desc: '门派宝库，升级后增加收入和门派专属卡池解锁。',
    levels: [
      { lv:1, name:'木箱藏钱',     cost:{ silver:600,  mats:{} },                           effect:{ shopDiscount:1.0, incomeBonus:0, rarityUnlock:0 },  desc:'简单的钱箱' },
      { lv:2, name:'铁制保险柜',   cost:{ silver:2500, mats:{item_iron_ore:10} },            effect:{ shopDiscount:0.95, incomeBonus:50, rarityUnlock:0 },  desc:'贡献商店-5%' },
      { lv:3, name:'精钢金库',     cost:{ silver:6000, mats:{item_iron_ore:20,item_spirit_stone:5} }, effect:{ shopDiscount:0.9, incomeBonus:150, rarityUnlock:1 },  desc:'贡献-10% · 解锁精品技能' },
      { lv:4, name:'玉石宝库',     cost:{ silver:15000,mats:{item_spirit_stone:15,item_copper_core:8} }, effect:{ shopDiscount:0.85, incomeBonus:300, rarityUnlock:2 }, desc:'贡献-15% · 解锁稀有技能' },
      { lv:5, name:'龙脉宝库',     cost:{ silver:35000,mats:{item_spirit_stone:30,item_copper_core:15} }, effect:{ shopDiscount:0.8, incomeBonus:500, rarityUnlock:3 },  desc:'贡献-20% · 解锁传说技能' },
    ],
  },
  training_ground: {
    id: 'training_ground',
    name: '练功场',
    icon: '🏋️',
    desc: '弟子日常修炼的场所，升级后增加经验获取和将将胡伤害。',
    levels: [
      { lv:1, name:'泥地操场',     cost:{ silver:350,  mats:{} },                           effect:{ expBonus:1.0, huDamageBonus:0 },  desc:'一块平整的泥地' },
      { lv:2, name:'石板练功场',   cost:{ silver:1500, mats:{item_iron_ore:8} },             effect:{ expBonus:1.1, huDamageBonus:0.05 },  desc:'经验+10% · 将将胡伤害+5%' },
      { lv:3, name:'梅花桩阵',     cost:{ silver:3500, mats:{item_iron_ore:15,item_spirit_stone:3} }, effect:{ expBonus:1.2, huDamageBonus:0.10 }, desc:'经验+20% · 将将胡伤害+10%' },
      { lv:4, name:'机关试炼场',   cost:{ silver:8000, mats:{item_spirit_stone:10,item_copper_core:5} }, effect:{ expBonus:1.35, huDamageBonus:0.20 }, desc:'经验+35% · 将将胡伤害+20%' },
      { lv:5, name:'天罡北斗阵',   cost:{ silver:20000,mats:{item_spirit_stone:20,item_copper_core:12} }, effect:{ expBonus:1.5, huDamageBonus:0.25 },  desc:'经验+50% · 将将胡伤害+25%' },
    ],
  },
  meditation_hall: {
    id: 'meditation_hall',
    name: '静修阁',
    icon: '🧘',
    desc: '弟子闭关修炼的场所，升级后增加内力恢复和突破概率。',
    levels: [
      { lv:1, name:'山洞静室',     cost:{ silver:400,  mats:{} },                           effect:{ neiliRegen:1.0, breakthroughBonus:0 },  desc:'简陋的打坐场所' },
      { lv:2, name:'竹林精舍',     cost:{ silver:1800, mats:{item_herb_green:10} },          effect:{ neiliRegen:1.15, breakthroughBonus:3 },  desc:'内力恢复+15%' },
      { lv:3, name:'玉石静修室',   cost:{ silver:4500, mats:{item_herb_green:25,item_herb_blue:8} }, effect:{ neiliRegen:1.3, breakthroughBonus:6 },  desc:'内力恢复+30%' },
      { lv:4, name:'灵气洞府',     cost:{ silver:10000,mats:{item_herb_blue:15,item_spirit_stone:10} }, effect:{ neiliRegen:1.5, breakthroughBonus:10 }, desc:'内力恢复+50%' },
      { lv:5, name:'天人合一境',   cost:{ silver:25000,mats:{item_spirit_stone:25,item_herb_blue:30} }, effect:{ neiliRegen:1.8, breakthroughBonus:15 }, desc:'内力恢复+80%' },
    ],
  },
};

// ═══════════════════════════════════════════════════
//  二、存档
// ═══════════════════════════════════════════════════

var SB_SAVE_KEY = 'wuxia_sect_building';

/**
 * 存档结构：
 * { sectId, buildings: { buildingId: level }, lastIncome: 'YYYY-MM-DD' }
 */
function sbLoad(){
  try { return JSON.parse(localStorage.getItem(SB_SAVE_KEY) || '{}'); }
  catch(e){ return {}; }
}
function sbSave(data){
  try { localStorage.setItem(SB_SAVE_KEY, JSON.stringify(data)); }
  catch(e){}
}

// ═══════════════════════════════════════════════════
//  三、建筑逻辑
// ═══════════════════════════════════════════════════

/** 获取指定门派的建筑等级 */
function sbGetLevel(buildingId){
  var save = sbLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return 1; // 默认1级
  if(save.sectId !== ed.sect) return 1; // 不同门派
  return (save.buildings && save.buildings[buildingId]) || 1;
}

/** 获取建筑效果 */
function sbGetEffect(buildingId, effectKey){
  var lv = sbGetLevel(buildingId);
  var cfg = SECT_BUILDINGS[buildingId];
  if(!cfg || lv < 1 || lv > cfg.levels.length) return 1;
  return cfg.levels[lv - 1].effect[effectKey] || 0;
}

/** 获取全部建筑效果（合并） */
function sbGetAllEffects(){
  var effects = {};
  Object.keys(SECT_BUILDINGS).forEach(function(bid){
    var lv = sbGetLevel(bid);
    var cfg = SECT_BUILDINGS[bid];
    if(!cfg || lv < 1 || lv > cfg.levels.length) return;
    var eff = cfg.levels[lv - 1].effect;
    Object.keys(eff).forEach(function(k){
      effects[k] = (effects[k] || 0) + eff[k];
    });
  });
  return effects;
}

/** 升级建筑 */
function sbUpgrade(buildingId){
  var cfg = SECT_BUILDINGS[buildingId];
  if(!cfg){ if(typeof showToast === 'function') showToast('未知建筑', 'error'); return false; }

  var save = sbLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect){ if(typeof showToast === 'function') showToast('未加入门派', 'warn'); return false; }

  // 切换门派时重置建筑
  if(save.sectId !== ed.sect){
    save.sectId = ed.sect;
    save.buildings = {};
  }

  var currentLv = (save.buildings && save.buildings[buildingId]) || 1;
  if(currentLv >= 5){ if(typeof showToast === 'function') showToast('已满级', 'warn'); return false; }

  var nextLevel = cfg.levels[currentLv]; // 当前lv索引就是下一级
  if(!nextLevel){ if(typeof showToast === 'function') showToast('无法升级', 'warn'); return false; }

  var cost = nextLevel.cost;

  // 检查银两
  if(ed.silver < cost.silver){
    if(typeof showToast === 'function') showToast('银两不足，需要' + cost.silver + '两', 'warn');
    return false;
  }

  // 检查材料
  if(cost.mats){
    var matsOk = true;
    Object.keys(cost.mats).forEach(function(matId){
      var need = cost.mats[matId];
      var have = sbCountItem(matId);
      if(have < need){
        if(typeof showToast === 'function') showToast('材料不足：' + matId + '（需要' + need + '，拥有' + have + '）', 'warn');
        matsOk = false;
      }
    });
    if(!matsOk) return false;
  }

  // 扣除银两
  ed.silver -= cost.silver;
  if(typeof saveProgress === 'function') saveProgress();

  // 扣除材料
  if(cost.mats){
    Object.keys(cost.mats).forEach(function(matId){
      sbRemoveItem(matId, cost.mats[matId]);
    });
  }

  // 升级
  if(!save.buildings) save.buildings = {};
  save.buildings[buildingId] = currentLv + 1;
  save.sectId = ed.sect;
  sbSave(save);

  if(typeof showToast === 'function'){
    showToast('🏗 ' + cfg.name + '升级到 Lv.' + (currentLv + 1) + '！', 'ok');
  }

  // 刷新面板
  var sect = (typeof SECTS !== 'undefined') ? SECTS.find(function(s){ return s.id === ed.sect; }) : null;
  if(sect && typeof renderSectBuildingPanel === 'function'){
    renderSectBuildingPanel(sect);
  }

  return true;
}

/** 计算物品数量（简单实现，从背包/存档中读取） */
function sbCountItem(itemId){
  if(typeof edS === 'undefined') return 0;
  var bag = edS.bag || [];
  var count = 0;
  bag.forEach(function(b){ if(b.id === itemId) count += (b.qty || 1); });
  return count;
}

/** 移除物品 */
function sbRemoveItem(itemId, qty){
  if(typeof edS === 'undefined') return;
  var bag = edS.bag || [];
  var remaining = qty;
  edS.bag = bag.filter(function(b){
    if(b.id === itemId && remaining > 0){
      var take = Math.min(b.qty || 1, remaining);
      remaining -= take;
      if(b.qty > take){ b.qty -= take; return true; }
      return false;
    }
    return true;
  });
  if(typeof saveProgress === 'function') saveProgress();
}

// ═══════════════════════════════════════════════════
//  四、UI 渲染
// ═══════════════════════════════════════════════════

function renderSectBuildingPanel(sect){
  var container = document.getElementById('tab-building');
  if(!container) return;

  var save = sbLoad();
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect){
    container.innerHTML = '<div class="sect-library-empty" style="padding:30px 16px">' +
      '<div style="font-size:28px;margin-bottom:10px">🏗</div>' +
      '<div style="font-size:13px;color:var(--text3)">未加入门派</div></div>';
    return;
  }

  // 切换门派时重置
  if(save.sectId && save.sectId !== ed.sect){
    save.sectId = ed.sect;
    save.buildings = {};
    sbSave(save);
  }

  var html = '';

  // ── 标题 ──
  html += '<div style="text-align:center;padding:12px 0 8px">';
  html += '<div style="font-size:18px;font-weight:bold;color:' + (sect.color || '#f0c060') + '">🏗 门派建筑</div>';
  html += '<div style="font-size:11px;color:var(--text3);margin-top:4px">升级门派建筑，提升各项功能效果</div>';
  html += '<div style="font-size:11px;color:rgba(200,180,120,.7);margin-top:2px">💰 银两：' + (ed.silver || 0) + ' 两</div>';
  html += '</div>';

  // ── 功能入口快捷按钮 ──
  html += '<div style="display:flex;gap:8px;padding:0 8px 8px;flex-wrap:wrap">';
  // 讲武堂 → 学武学（藏经阁）
  html += '<button onclick="try{switchTab(\'library\')}catch(e){}if(typeof window.showToast===\'function\')window.showToast(\'前往藏经阁学习武学\',\'ok\')" ' +
    'style="flex:1;min-width:45%;padding:8px 6px;border:1px solid rgba(240,192,96,.2);border-radius:8px;' +
    'background:linear-gradient(135deg,rgba(240,192,96,.08),rgba(240,192,96,.03));color:#f0c060;' +
    'font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;font-weight:bold">📖 学武学（藏经阁）</button>';
  // 兵器库/藏宝阁 → 买装备（藏宝阁）
  html += '<button onclick="try{switchTab(\'treasury\')}catch(e){}if(typeof window.showToast===\'function\')window.showToast(\'前往藏宝阁购买装备\',\'ok\')" ' +
    'style="flex:1;min-width:45%;padding:8px 6px;border:1px solid rgba(240,192,96,.2);border-radius:8px;' +
    'background:linear-gradient(135deg,rgba(240,192,96,.08),rgba(240,192,96,.03));color:#f0c060;' +
    'font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;font-weight:bold">💰 买装备（藏宝阁）</button>';
  // 贡献商店
  html += '<button onclick="try{switchTab(\'shop\')}catch(e){}if(typeof window.showToast===\'function\')window.showToast(\'前往贡献商店\',\'ok\')" ' +
    'style="flex:1;min-width:45%;padding:8px 6px;border:1px solid rgba(128,232,128,.2);border-radius:8px;' +
    'background:linear-gradient(135deg,rgba(128,232,128,.08),rgba(128,232,128,.03));color:#80e880;' +
    'font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;font-weight:bold">⚔ 贡献商店</button>';
  // 演武场
  html += '<button onclick="try{switchTab(\'arena\')}catch(e){}if(typeof window.showToast===\'function\')window.showToast(\'前往演武场切磋\',\'ok\')" ' +
    'style="flex:1;min-width:45%;padding:8px 6px;border:1px solid rgba(255,136,32,.2);border-radius:8px;' +
    'background:linear-gradient(135deg,rgba(255,136,32,.08),rgba(255,136,32,.03));color:#ff8830;' +
    'font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;font-weight:bold">🏟 演武场</button>';
  html += '</div>';

  // ── 建筑列表 ──
  var buildingIds = Object.keys(SECT_BUILDINGS);
  var totalLevel = 0;
  var maxLevel = buildingIds.length * 5;

  buildingIds.forEach(function(bid){
    var cfg = SECT_BUILDINGS[bid];
    var currentLv = (save.buildings && save.buildings[bid]) || 1;
    totalLevel += currentLv;

    var nextLvData = currentLv < 5 ? cfg.levels[currentLv] : null;
    var currentData = cfg.levels[currentLv - 1];

    // 等级条
    var lvPct = (currentLv / 5) * 100;
    var barColor = currentLv >= 5 ? '#ffd700' : (currentLv >= 3 ? '#80e880' : '#f0c060');

    html += '<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px;margin:6px 8px">';

    // 头部
    html += '<div style="display:flex;justify-content:space-between;align-items:center">';
    html += '<div style="display:flex;align-items:center;gap:8px">';
    html += '<span style="font-size:24px">' + cfg.icon + '</span>';
    html += '<div>';
    html += '<div style="font-weight:bold;font-size:14px">' + cfg.name + '</div>';
    html += '<div style="font-size:10px;color:var(--text3)">' + currentData.name + '</div>';
    html += '</div></div>';
    html += '<div style="text-align:right">';
    html += '<div style="font-size:16px;font-weight:bold;color:' + barColor + '">Lv.' + currentLv + '</div>';
    html += '</div></div></div>';  // 3个: rightSection + iconSection + flexHeader (line 316)

    // 等级进度条
    html += '<div style="background:rgba(0,0,0,.3);border-radius:3px;height:6px;overflow:hidden;margin:8px 0">';
    html += '<div style="height:100%;width:' + lvPct + '%;background:' + barColor + ';border-radius:3px;transition:width .3s"></div></div>';

    // 当前效果
    if(currentData.effect){
      var effectStrs = Object.keys(currentData.effect).map(function(k){
        return _sbEffectLabel(k, currentData.effect[k]);
      }).filter(Boolean);
      if(effectStrs.length > 0){
        html += '<div style="font-size:10px;color:rgba(200,180,120,.7);margin:4px 0">' + effectStrs.join(' · ') + '</div>';
      }
    }

    // 描述
    html += '<div style="font-size:10px;color:var(--text3);margin-top:2px">' + (currentData.desc || '') + '</div>';

    // 升级信息
    if(nextLvData){
      var canAfford = (ed.silver || 0) >= nextLvData.cost.silver;
      var nextEffectStrs = Object.keys(nextLvData.effect).map(function(k){
        return _sbEffectLabel(k, nextLvData.effect[k]);
      }).filter(Boolean);

      html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.04)">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div>';
      html += '<div style="font-size:11px;color:' + (canAfford ? '#f0c060' : '#ff6060') + '">升级到 Lv.' + nextLvData.lv + ' · ' + nextLvData.name + '</div>';
      html += '<div style="font-size:10px;color:var(--text3)">💰 ' + nextLvData.cost.silver + '两';
      // 材料消耗（使用中文名）
      if(nextLvData.cost.mats && Object.keys(nextLvData.cost.mats).length > 0){
        Object.keys(nextLvData.cost.mats).forEach(function(matId){
          var need = nextLvData.cost.mats[matId];
          var have = sbCountItem(matId);
          var enough = have >= need;
          var matName = (typeof sbGetMatName === 'function') ? sbGetMatName(matId) : matId;
          var matIcon = (typeof sbGetMatIcon === 'function') ? sbGetMatIcon(matId) : '📦';
          html += ' · ' + matIcon + ' ' + matName + ' <span style="color:' + (enough ? '#80e880' : '#ff6060') + '">' + have + '/' + need + '</span>';
        });
      }
      html += '</div>';
      if(nextEffectStrs.length > 0){
        html += '<div style="font-size:9px;color:rgba(200,180,120,.5);margin-top:2px">→ ' + nextEffectStrs.join(' · ') + '</div>';
      }
      html += '</div>';

      // 升级按钮
      html += '<button onclick="sbUpgrade(\'' + bid + '\')" ' +
        'style="margin-top:6px;padding:6px 16px;border:none;border-radius:6px;' +
        'background:' + (canAfford ? 'rgba(240,192,96,.15)' : 'rgba(100,100,100,.1)') + ';' +
        'color:' + (canAfford ? '#f0c060' : '#666') + ';font-size:12px;cursor:pointer;' +
        (canAfford ? '' : 'opacity:.5;') + 'font-weight:bold">' +
        (canAfford ? '⬆ 升级' : '银两不足') + '</button>';
      html += '</div>';
    } else {
      html += '<div style="margin-top:6px;font-size:11px;color:#ffd700;text-align:center">✦ 已达最高等级</div>';
    }

    html += '</div>';
  });

  // ── 底部统计 ──
  html += '<div style="text-align:center;padding:12px 8px;font-size:10px;color:var(--text3);opacity:.5">';
  html += '建筑总等级 ' + totalLevel + '/' + maxLevel + ' · 升级消耗银两和材料 · 叛门后建筑重置</div>';

  container.innerHTML = html;
}

/** 效果文字标签 */
function _sbEffectLabel(key, value){
  var labels = {
    'disciplePower':    value >= 1 ? '弟子实力×' + value : '',
    'alchemyBonus':     value >= 1 ? '炼丹效率×' + value : '',
    'repairDiscount':   value < 1 ? '修理折扣' + Math.round((1 - value) * 100) + '%' : '',
    'durabilityBonus':  value > 0 ? '耐久+' + value : '',
    'shopDiscount':     value < 1 ? '商店折扣' + Math.round((1 - value) * 100) + '%' : '',
    'incomeBonus':      value > 0 ? '收入+' + value : '',
    'expBonus':         value >= 1 ? '经验×' + value : '',
    'neiliRegen':       value >= 1 ? '内力恢复×' + value : '',
    'breakthroughBonus':value > 0 ? '突破概率+' + value + '%' : '',
    // ── 将将胡：建筑手牌效果 ──
    'cardLimitBonus':   value > 0 ? '🀄 手牌上限+' + value : '',
    'huDamageBonus':    value > 0 ? '🀄 将将胡伤害+' + Math.round(value * 100) + '%' : '',
    'swapCostReduce':   value > 0 ? '🀄 换牌省气-' + value : '',
    'rarityUnlock':     value >= 3 ? '🀄 解锁传说技能' : (value >= 2 ? '🀄 解锁稀有技能' : (value >= 1 ? '🀄 解锁精品技能' : '')),
    'maxPlayBonus':     value > 0 ? '🀄 每回合多出' + value + '张' : '',
  };
  return labels[key] || '';
}

// ═══════════════════════════════════════════════════
//  五、导出
// ═══════════════════════════════════════════════════

window.SECT_BUILDINGS       = SECT_BUILDINGS;
window.sbGetLevel           = sbGetLevel;
window.sbGetEffect          = sbGetEffect;
window.sbGetAllEffects      = sbGetAllEffects;
window.sbUpgrade            = sbUpgrade;
window.sbCountItem          = sbCountItem;
window.renderSectBuildingPanel = renderSectBuildingPanel;

})();
