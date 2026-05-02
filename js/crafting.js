// ════════════════════════════════════════════════════
//  crafting.js  合成系统逻辑 + UI
//  依赖：data-crafting.js, data-equip.js (edS.bag, bagSave)
// ════════════════════════════════════════════════════

// ── 合成背包存储 Key（消耗品与材料单独存储） ──
const CRAFT_BAG_KEY = 'wuxia_craft_bag';

// ── 合成材料背包（仅存 {id, qty} 数组，轻量级） ──
function craftBagLoad(){
  // 只从 localStorage 读取（craftBagSave 已同步 edS.bags）
  let bag = [];
  try{ bag = JSON.parse(localStorage.getItem(CRAFT_BAG_KEY)||'[]'); }
  catch(e){ bag = []; }
  return bag;
}
function craftBagSave(bag){
  localStorage.setItem(CRAFT_BAG_KEY, JSON.stringify(bag));
  // 同时更新 edS.bags.wuxia_craft_bag 以保持兼容性
  if (typeof edS !== 'undefined') {
    if (!edS.bags) edS.bags = {};
    // 转换为 { items: {} } 格式供小游戏使用
    const itemsObj = {};
    bag.forEach(e => { if (e && e.id) itemsObj[e.id] = e.qty || 0; });
    edS.bags.wuxia_craft_bag = { items: itemsObj, maxSlots: 50 };
  }
}

// 获取某材料当前数量
function craftBagGetQty(itemId){
  const bag = craftBagLoad();
  const entry = bag.find(e=>e.id===itemId);
  return entry ? entry.qty : 0;
}

const CRAFT_MATERIAL_EQUIV = {
  item_iron_ore: ['item_iron_ore', 'item_ore_iron'],
  item_ore_iron: ['item_iron_ore', 'item_ore_iron'],
  item_leopard_pelt: ['item_leopard_pelt', 'item_leopard_skin'],
  item_leopard_skin: ['item_leopard_pelt', 'item_leopard_skin'],
  // 玄铁等值映射（mithril_ore 与 xuantie 互通）
  item_mithril_ore: ['item_mithril_ore', 'item_xuantie'],
  item_xuantie:     ['item_mithril_ore', 'item_xuantie'],
};

// ── 合成材料名称 fallback ──────────────────────────────────────────────
// ENEMY_DROP_ITEMS 在主游戏未加载时，此字典提供材料的中文名称/图标/描述
const CRAFT_MATERIAL_NAMES = {
  // 矿石
  item_iron_ore:       { name:'铁矿石',     icon:'🪨', desc:'普通铁矿石，是打造兵器和护甲的基础材料。' },
  item_copper_ore:     { name:'铜矿石',     icon:'🪙', desc:'含铜的矿石，可用于锻造铜器。' },
  item_silver_ore:     { name:'银矿石',     icon:'🥈', desc:'含银的矿石，价值不菲。' },
  item_gold_ore:       { name:'金矿石',     icon:'🥇', desc:'含金量较高的矿石，可提炼黄金。' },
  item_mithril_ore:    { name:'玄铁',       icon:'🌑', desc:'稀有金属，坚硬无比，是打造神兵的珍贵材料。' },
  item_spirit_stone:   { name:'灵石',       icon:'💎', desc:'蕴含灵气的石头，可用于强化装备。' },
  // 强化专用材料
  item_refined_iron:   { name:'精铁',       icon:'⚙️', desc:'经过精炼的铁矿，质地纯净，是强化兵器的核心材料。' },
  item_xuantie:        { name:'玄铁',       icon:'🌑', desc:'传说中的稀世金属，玄色如墨，比精铁更坚，是强化神兵的必备材料。' },
  item_ice_crystal:   { name:'冰晶',       icon:'❄',  desc:'极寒之地凝结的晶体，可用于冰系丹药。' },
  item_sand_crystal:   { name:'沙晶',       icon:'✨', desc:'沙漠中形成的晶体，蕴含沙属性灵气。' },
  item_thunder_core:   { name:'雷核',       icon:'⚡', desc:'蕴含雷电之力的晶体，可用于雷系丹药。' },
  item_beast_core:     { name:'兽核',       icon:'🔴', desc:'野兽体内凝结的晶核，可用于丹药炼制。' },
  item_water_pearl:    { name:'水珠',       icon:'💧', desc:'凝聚水之灵气的珠子，可用于水系丹药。' },
  // 草药
  item_herb_blood:     { name:'活血草',     icon:'🌿', desc:'活血化瘀的草药，是炼制气血丹的基础药材。' },
  item_herb_qi:        { name:'聚气草',     icon:'🍃', desc:'聚拢天地灵气的药草，服之可恢复内力。' },
  item_herb_common:    { name:'普通草药',   icon:'🌱', desc:'山间常见草药，可用于多种基础丹药。' },
  item_herb_rare:      { name:'珍稀药草',   icon:'🌸', desc:'深山秘境中的稀有药草，是高级丹药的关键材料。' },
  item_herb_gancao:    { name:'甘草',       icon:'🌾', desc:'味甘性平的药草，可调和诸药，是常用辅料。' },
  item_herb_renshen:   { name:'人参',       icon:'🥕', desc:'补气养血的珍贵药材，生长于深山老林。' },
  item_rare_jade:      { name:'翡翠原石',   icon:'💚', desc:'质地温润的翡翠原石，价值不菲。' },
  item_hp_potion:      { name:'回气丹',     icon:'💊', desc:'基础疗伤丹药，可恢复气血。', type:'consumable' },
  // 动物材料
  item_snake_gall:     { name:'蛇胆',       icon:'🐍', desc:'毒蛇体内取出的胆囊，可入药。' },
  item_bear_paw:       { name:'熊掌',       icon:'🐾', desc:'珍稀食材，炖食可大补气血。' },
  item_bear_gall:      { name:'熊胆',       icon:'🟤', desc:'珍贵药材，有清热明目之效。' },
  item_bear_hide:      { name:'熊皮',       icon:'🧥', desc:'厚实的兽皮，可用于制作护甲。' },
  item_tiger_bone:     { name:'虎骨',       icon:'🦴', desc:'猛虎之骨，可入药或制作兵器。' },
  item_tiger_pelt:     { name:'虎皮',       icon:'🐅', desc:'猛虎皮毛，极为珍贵。' },
  item_leopard_pelt:   { name:'豹皮',       icon:'🐆', desc:'猎豹皮毛，可制作轻便护甲。' },
  item_wolf_fang:      { name:'狼牙',       icon:'🐺', desc:'锋利的狼牙，可用于制作暗器。' },
  item_wolf_pelt:      { name:'狼皮',       icon:'🐺', desc:'狼的皮毛，可制作保暖衣物。' },
  // 采集物
  item_bamboo:         { name:'翠竹',       icon:'🎋', desc:'韧性十足的竹子，可用于制作多种器具。' },
  item_bamboo_shoot:   { name:'竹笋',       icon:'🌿', desc:'鲜嫩的竹笋，可入药或食用。' },
  item_lotus_root:     { name:'莲藕',       icon:'🪷', desc:'出淤泥而不染的莲藕，可入药。' },
  item_river_mud:      { name:'河泥',       icon:'🟤', desc:'河底的淤泥，可用于修补堤坝或制作陶器。' },
  item_vegetable_fresh: { name:'鲜菜',      icon:'🥬', desc:'新鲜蔬菜，可用于烹饪。' },
  // 布匹/杂物
  item_cloth:          { name:'布料',       icon:'🧵', desc:'普通布料，是制作衣物的基础材料。' },
  item_fine_cloth:     { name:'绸缎',       icon:'👘', desc:'精细的丝绸布料，价值较高。' },
  // 特殊
  item_dragon_scale:   { name:'龙鳞',       icon:'🐉', desc:'传说中的龙之鳞片，蕴含强大力量。' },
  item_phoenix_feather:{ name:'凤羽',       icon:'🦅', desc:'神凤之羽，蕴含火焰之力。' },
};

function craftResolveMaterialIds(itemId){
  return CRAFT_MATERIAL_EQUIV[itemId] || [itemId];
}

function craftBagGetMergedQty(itemId){
  return craftResolveMaterialIds(itemId)
    .reduce((sum, id) => sum + craftBagGetQty(id), 0);
}

function craftBagConsumeMerged(itemId, qty){
  let left = qty;
  const ids = craftResolveMaterialIds(itemId);
  for(const id of ids){
    const have = craftBagGetQty(id);
    if(have <= 0) continue;
    const useQty = Math.min(have, left);
    if(useQty > 0) craftBagConsume(id, useQty);
    left -= useQty;
    if(left <= 0) return true;
  }
  return left <= 0;
}

// 增加材料数量
function craftBagAdd(itemId, qty, meta){
  const bag = craftBagLoad();
  const entry = bag.find(e=>e.id===itemId);
  if(entry){ entry.qty += qty; }
  else {
    // meta 保存 name/icon/type/sellPrice/desc（来自 ENEMY_DROP_ITEMS 或商店）
    bag.push({ id:itemId, qty, ...(meta||{}) });
  }
  craftBagSave(bag);
}

// 消耗材料（返回是否成功）
function craftBagConsume(itemId, qty){
  const bag = craftBagLoad();
  const entry = bag.find(e=>e.id===itemId);
  if(!entry || entry.qty < qty) return false;
  entry.qty -= qty;
  if(entry.qty <= 0){
    const idx = bag.indexOf(entry);
    bag.splice(idx, 1);
  }
  craftBagSave(bag);
  return true;
}

// ── 消耗品背包（产出的药品/道具存这里，与材料分开） ──
const CONSUMABLE_KEY = 'wuxia_consumables';
function consumableBagLoad(){
  try{
    const bag = JSON.parse(localStorage.getItem(CONSUMABLE_KEY)||'[]');
    // 自动修复损坏的数据
    return fixCorruptedConsumablesInBag(bag);
  }
  catch(e){ return []; }
}

// 修复背包中损坏的物品数据（不保存，只返回修复后的副本）
function fixCorruptedConsumablesInBag(bag){
  if(!Array.isArray(bag)) return [];
  for(let i = bag.length - 1; i >= 0; i--){
    const item = bag[i];
    if(!item){
      bag.splice(i, 1);
      continue;
    }
    if(!item.id){
      // 尝试根据 effect 推断物品类型
      if(item.effect && item.effect.food !== undefined){
        item.id = 'item_unknown_food';
        item.name = item.name || '未知食物';
      } else if(item.effect && item.effect.water !== undefined){
        item.id = 'item_unknown_water';
        item.name = item.name || '未知饮品';
      } else if(item.effect && item.effect.hp !== undefined){
        item.id = 'item_unknown_herb';
        item.name = item.name || '未知草药';
      } else {
        // 无法识别，删除
        console.warn('[fixCorruptedConsumablesInBag] 删除损坏物品:', item);
        bag.splice(i, 1);
        continue;
      }
    }
    if(item.id && !item.name){
      const meta = getItemMeta(item.id);
      item.name = (meta && meta.name) ? meta.name : item.id;
    }
    if(!item.icon) item.icon = '📦';
    if(!item.desc) item.desc = '';
    if(!item.effect) item.effect = {};
  }
  return bag;
}
function consumableBagSave(bag){
  localStorage.setItem(CONSUMABLE_KEY, JSON.stringify(bag));
}
function consumableBagGet(itemId){
  return consumableBagLoad().find(e=>e.id===itemId) || null;
}
function consumableBagGetQty(itemId){
  return consumableBagGet(itemId)?.qty || 0;
}
function consumableBagAdd(item, qty){
  const bag = consumableBagLoad();
  const entry = bag.find(e=>e.id===item.id);
  if(entry){ entry.qty += qty; }
  else { bag.push({ ...item, qty }); }
  consumableBagSave(bag);
}

// ══════════════════════════════════════════════════════════
//  统一物品入包函数（npc-logic.js 的事件链奖励等调用）
//  根据物品类型自动路由到正确的背包，并刷新UI
// ══════════════════════════════════════════════════════════
function addItemToBag(itemId, qty) {
  // 1. 查找物品元数据（优先级：DUNGEON_ITEM_DB > ENEMY_DROP_ITEMS > CRAFT_MATERIAL_NAMES）
  const meta = (typeof getItemMeta === 'function') ? getItemMeta(itemId) : null;
  const type = meta?.type || 'consumable'; // 未知物品默认为消耗品

  // 2. 根据类型路由
  if (type === 'collectible' || type === 'material') {
    // 材料/收藏品 → 合成材料背包
    if (typeof injectDropToCraftBag === 'function') {
      injectDropToCraftBag(itemId, qty, meta);
    } else {
      craftBagAdd(itemId, qty, meta);
    }
  } else if (type === 'consumable') {
    // 消耗品（药草/食物/鱼等）→ 消耗品背包
    const item = {
      id: itemId,
      name: meta?.name || itemId,
      icon: meta?.icon || '📦',
      desc: meta?.desc || '',
      effect: meta?.effect || {},
    };
    consumableBagAdd(item, qty);
  } else if (type === 'weapon' || type === 'costume' || type === 'accessory') {
    // 装备 → 生成实例入装备背包
    if (typeof createEquipInst === 'function' && typeof edS !== 'undefined' && typeof bagAddInst === 'function') {
      const inst = createEquipInst(type, itemId);
      if (inst) bagAddInst(inst);
    }
  } else {
    // 其他类型（manual/teleport/bagExpand等）默认进消耗品背包
    const item = {
      id: itemId,
      name: meta?.name || itemId,
      icon: meta?.icon || '📦',
      desc: meta?.desc || '',
      effect: meta?.effect || {},
    };
    consumableBagAdd(item, qty);
  }

  // 3. 刷新背包UI（确保打开背包时能看到新物品）
  _tryRefreshTownBag();
}

// 尝试刷新背包UI（有背包弹窗时刷新，没有时不报错）
function _tryRefreshTownBag() {
  if (typeof refreshTownBag === 'function') refreshTownBag();
  if (typeof _bagRefreshTabBadges === 'function') _bagRefreshTabBadges();
}

function consumableBagConsume(itemId, qty){
  const bag = consumableBagLoad();
  const entry = bag.find(e=>e.id===itemId);
  if(!entry || entry.qty < qty) return false;
  entry.qty -= qty;
  if(entry.qty <= 0) bag.splice(bag.indexOf(entry),1);
  consumableBagSave(bag);
  return true;
}

// ════════════════════════════════════════════════════
//  合成逻辑核心
// ════════════════════════════════════════════════════

// 检查材料是否满足（返回缺少的材料列表，空=满足）
function checkCraftMaterials(recipe){
  const missing = [];
  recipe.materials.forEach(m => {
    const have = craftBagGetMergedQty(m.id);
    if(have < m.qty){
      missing.push({ id:m.id, need:m.qty, have });
    }
  });
  return missing;
}

// 合成结果 ID → 配饰模板 ID 映射（蛐蛐笼直接进装备栏）
const CRAFT_TO_ACCESSORY = {
  'item_cricket_cage_basic':   'acc_cricket_basic',
  'item_cricket_cage_fine':    'acc_cricket_fine',
  'item_cricket_cage_premium': 'acc_cricket_premium',
};

// 执行合成（返回 {ok, msg, result}）
function doCraft(recipeId){
  const recipe = getCraftRecipe(recipeId);
  if(!recipe) return { ok:false, msg:'配方不存在' };

  // 等级检查
  const playerLv = (typeof edS !== 'undefined' ? edS.level : 1) || 1;
  if(playerLv < recipe.level){
    return { ok:false, msg:`需要达到 ${recipe.level} 级才能合成此物` };
  }

  // 材料检查
  const missing = checkCraftMaterials(recipe);
  if(missing.length > 0){
    const detail = missing.map(m=>{
      const meta = getItemMeta(m.id);
      return `${meta?.icon||'🔹'}${meta?.name||m.id} 差 ${m.need - m.have} 个`;
    }).join('，');
    return { ok:false, msg:`材料不足：${detail}` };
  }

  // 特殊成功率判定（如九转金丹60%）
  if(recipe.special && recipe.special.includes('成功率')){
    const match = recipe.special.match(/成功率.*?(\d+)%/);
    if(match){
      const rate = parseInt(match[1]) / 100;
      // 先消耗材料
      recipe.materials.forEach(m => craftBagConsumeMerged(m.id, m.qty));
      if(Math.random() > rate){
        return { ok:false, msg:`💥 炼制失败！${recipe.name}所有材料付之一炬……`, failed:true };
      }
    }
  } else {
    // 正常消耗材料
    recipe.materials.forEach(m => craftBagConsumeMerged(m.id, m.qty));
  }

  // ═══════════════════════════════════════════════
  // 合成"将将胡"恶搞事件（5%总概率）
  // ═══════════════════════════════════════════════
  const gagRoll = Math.random();
  let gagEvent = null;
  if (gagRoll < 0.05) {
    const gagEvents = ['material_explosion', 'mutation', 'extra_yield', 'strange_smell', 'ghost_in_pot', 'lucky_stir'];
    gagEvent = gagEvents[Math.floor(Math.random() * gagEvents.length)];
    
    const gagMessages = {
      material_explosion: { title: '💥 材料爆炸！', msg: '炉子突然炸了，但产物意外的好！', type: 'rare' },
      mutation: { title: '🧬 变异！', msg: '丹药产生了奇怪的变异...', type: 'warning' },
      extra_yield: { title: '🎁 额外产出！', msg: '莫名其妙多出来一份！', type: 'rare' },
      strange_smell: { title: '👃 奇怪气味！', msg: '这味道...怎么像臭豆腐？', type: 'warning' },
      ghost_in_pot: { title: '👻 锅里有鬼！', msg: '丹炉里传出奇怪的声音...', type: 'rare' },
      lucky_stir: { title: '🥄 幸运搅拌！', msg: '你随手一搅，效果翻倍！', type: 'rare' }
    };
    
    if (typeof showCraftToast === 'function') {
      const gagMsg = gagMessages[gagEvent];
      showCraftToast(gagMsg.title + ' ' + gagMsg.msg, gagMsg.type === 'rare');
    }
  }

  // 产出结果
  const { result } = recipe;
  let qty = result.qty || 1;
  
  // 恶搞事件效果应用
  if (gagEvent === 'extra_yield') {
    qty *= 2; // 额外产出：数量翻倍
  } else if (gagEvent === 'lucky_stir') {
    qty += 1; // 幸运搅拌：多一个
  }

  // ── 蛐蛐笼：转为配饰实例进入装备背包 ──
  const accId = CRAFT_TO_ACCESSORY[result.id];
  if(accId){
    // 已在材料背包里的同名旧笼子也一并移走（避免重复）
    const matBag = craftBagLoad();
    const idx = matBag.findIndex(e=>e.id===result.id);
    if(idx >= 0){ matBag.splice(idx,1); craftBagSave(matBag); }
    // 也在消耗品背包里清理
    const conBag = consumableBagLoad();
    const ci = conBag.findIndex(e=>e.id===result.id);
    if(ci >= 0){ conBag.splice(ci,1); consumableBagSave(conBag); }
    // 创建配饰实例并加入装备背包
    if(typeof createEquipInst === 'function'){
      const inst = createEquipInst('accessory', accId);
      if(inst && typeof edS !== 'undefined'){
        if(!edS.bag) edS.bag = [];
        edS.bag.push(inst);
        bagSave();
      }
    }
    // 通知玩家
    const accTpl = ACCESSORIES ? ACCESSORIES.find(a=>a.id===accId) : null;
    const cName = accTpl ? accTpl.name : result.name;
    const cIcon = accTpl ? accTpl.icon : result.icon;
    const cStats = accTpl ? accTpl.cageStats : null;
    let statLines = [];
    if(cStats){
      if(cStats.staminaRegen > 0) statLines.push(`体力恢复+${cStats.staminaRegen}`);
      if(cStats.hpRegen > 0)      statLines.push(`血量恢复+${cStats.hpRegen}`);
      if(cStats.speedBoost > 0)    statLines.push(`蛐蛐攻/防/速+${cStats.speedBoost}`);
    }
    const statStr = statLines.length ? `\n  属性：${statLines.join(' · ')}` : '';
    return {
      ok:   true,
      msg:  `✅ 合成成功！获得 ${cIcon}【${cName}】\n  已放入背包装备栏${statStr}`,
      result, qty, isAccessory: true,
    };
  }

  // 普通消耗品进入消耗品背包
  consumableBagAdd(result, qty);

  // 经验奖励
  if(recipe.exp && typeof addExp === 'function'){
    addExp(recipe.exp);
  }

  // ── 成就系统触发 ──
  if(typeof achOnCraft === 'function') achOnCraft(recipeId, result.rarity);

  return {
    ok:   true,
    msg:  `✅ 合成成功！获得 ${result.icon}【${result.name}】×${qty}`,
    result, qty
  };
}

// 获取物品元数据（从 DUNGEON_ITEM_DB > ENEMY_DROP_ITEMS 或合成产出）
function getItemMeta(itemId){
  // 优先查询地下城物品数据库
  if(typeof DUNGEON_ITEM_DB !== 'undefined' && DUNGEON_ITEM_DB[itemId]){
    return DUNGEON_ITEM_DB[itemId];
  }
  if(typeof ENEMY_DROP_ITEMS !== 'undefined' && ENEMY_DROP_ITEMS[itemId]){
    return ENEMY_DROP_ITEMS[itemId];
  }
  // 在配方产出里查
  for(const r of CRAFT_RECIPES){
    if(r.result.id === itemId) return r.result;
    for(const m of r.materials){
      if(m.id === itemId){
        const found = (typeof DUNGEON_ITEM_DB!=='undefined') ? DUNGEON_ITEM_DB[m.id] : 
                      ((typeof ENEMY_DROP_ITEMS!=='undefined') ? ENEMY_DROP_ITEMS[m.id] : null);
        if(found) return found;
      }
    }
  }
  // fallback：使用本地材料名称字典
  if(CRAFT_MATERIAL_NAMES[itemId]){
    const d = CRAFT_MATERIAL_NAMES[itemId];
    return { id:itemId, name:d.name, icon:d.icon, desc:d.desc, type:'material', sellPrice:0 };
  }
  return null;
}

// 修复损坏的消耗品数据（添加缺失的 id 和 name）
function fixCorruptedConsumables(){
  const bag = consumableBagLoad();
  let needsSave = false;
  for(let i = bag.length - 1; i >= 0; i--){
    const item = bag[i];
    if(!item.id){
      // 尝试根据 effect 推断物品类型
      if(item.effect && item.effect.food !== undefined){
        item.id = 'item_unknown_food';
        item.name = '未知食物';
      } else if(item.effect && item.effect.water !== undefined){
        item.id = 'item_unknown_water';
        item.name = '未知饮品';
      } else if(item.effect && item.effect.hp !== undefined){
        item.id = 'item_unknown_herb';
        item.name = '未知草药';
      } else {
        // 无法识别，删除
        console.warn('[fixCorruptedConsumables] 删除损坏物品:', item);
        bag.splice(i, 1);
      }
      needsSave = true;
    }
    if(item.id && !item.name){
      const meta = getItemMeta(item.id);
      if(meta && meta.name){
        item.name = meta.name;
        needsSave = true;
      } else {
        item.name = item.id;
        needsSave = true;
      }
    }
  }
  if(needsSave){
    consumableBagSave(bag);
    console.log('[fixCorruptedConsumables] 已修复消耗品数据');
  }
  return bag;
}

// ════════════════════════════════════════════════════
//  合成页面 UI
// ════════════════════════════════════════════════════

let _craftCatFilter = '基础丹药'; // 当前分类
let _craftSelectedId = null;       // 当前选中的配方ID

function renderCraftPage(){
  const wrap = document.getElementById('pageCraft');
  if(!wrap) return;

  const playerLv = (typeof edS!=='undefined' ? edS.level : 1) || 1;

  // 炼物阁入场音效
  craftPlaySfx('open');

  wrap.innerHTML = `
  <div class="craft-wrap">
    <!-- 顶部标题 -->
    <div class="craft-header">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div class="craft-title">⚗️ 炼物阁</div>
          <div class="craft-subtitle">材料 × 配方 → 神兵妙药</div>
        </div>
        <div class="craft-bgm-ctrl" id="craftBgmCtrl">
          <span class="craft-bgm-label" id="craftBgmLabel" style="${(_craftBgmSliderVal||0.3)===0?'opacity:.4':''}">${(_craftBgmSliderVal||0.3)===0?'✕':'♪'}</span>
          <input type="range" min="0" max="100" value="${Math.round((_craftBgmSliderVal||0.3)*100)}" class="craft-bgm-slider"
            id="craftBgmSlider" oninput="craftBgmSliderChange(this.value)">
        </div>
      </div>
    </div>

    <!-- 主体：左侧分类+配方列表 / 右侧详情 -->
    <div class="craft-body">
      <!-- 左：分类 + 配方列表 -->
      <div class="craft-left">
        <div class="craft-cat-tabs" id="craftCatTabs">
          ${CRAFT_CATEGORIES.map(c=>{
            const catRecipes = getCraftByCategory(c.id);
            const readyCount = catRecipes.filter(r=> playerLv >= r.level && checkCraftMaterials(r).length === 0).length;
            const active = c.id===_craftCatFilter ? ' active' : '';
            const badge = readyCount > 0 ? `<span class="craft-cat-badge">${readyCount}</span>` : '';
            return `
            <div class="craft-cat-tab${active}"
                 style="--cat-color:${c.color}"
                 onclick="craftSetCat('${c.id}')">
              <span class="craft-cat-icon">${c.icon}</span>
              <span class="craft-cat-name">${c.id}</span>
              ${badge}
            </div>`;
          }).join('')}
        </div>
        <div class="craft-recipe-list" id="craftRecipeList">
          ${renderCraftRecipeList(playerLv)}
        </div>
      </div>

      <!-- 右：配方详情 + 合成按钮 -->
      <div class="craft-right" id="craftDetailPanel">
        ${renderCraftDetail(_craftSelectedId, playerLv)}
      </div>
    </div>

    <!-- 已合成道具 -->
    <div class="craft-stock-section">
      <div class="craft-section-title">🎒 已合成道具</div>
      <div class="craft-stock-grid" id="craftStockGrid">
        ${renderCraftStock()}
      </div>
    </div>

    <!-- 收藏品专区 -->
    <div class="craft-stock-section" id="craftCollectSection">
      <div class="craft-section-title">🏺 珍奇收藏</div>
      <div class="craft-collect-hint">从敌人处获得的无用之物，却各有故事。可出售换银，或留作把玩。</div>
      <div class="craft-collect-grid" id="craftCollectGrid">
        ${renderCraftCollect()}
      </div>
    </div>
  </div>`;
}

// 材料背包快览栏
function renderCraftMatBar(){
  const bag = craftBagLoad();
  if(bag.length === 0){
    return `<div class="craft-mat-empty">背包中还没有材料——击败敌人获取掉落，或在旅行中采集</div>`;
  }
  return bag.map(item=>{
    const meta = getItemMeta(item.id) || item;
    const artData = (typeof getItemArt === 'function') ? getItemArt(item.id) : null;
    const artHtml = artData
      ? `<pre class="craft-mat-art" style="color:${artData.color||'#c8b060'}">${artData.art}</pre>`
      : '';
    const isCollectible = (meta.type||item.type) === 'collectible';
    if(isCollectible) return ''; // 收藏品在专区显示，不出现在材料栏
    return `<div class="craft-mat-chip" onclick="craftToggleMatDetail(this,'${item.id}')" title="${meta.desc||''}">
      <span class="craft-mat-icon">${meta.icon||'🔹'}</span>
      <span class="craft-mat-name">${meta.name||item.id}</span>
      <span class="craft-mat-qty">×${item.qty}</span>
      <div class="craft-mat-detail">
        ${artHtml}
        <div class="cmd-name">${meta.name||item.id}</div>
        <div class="cmd-desc">${meta.desc||''}</div>
        ${meta.sellPrice ? `<div class="cmd-sell">售价：${meta.sellPrice} 两</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function craftToggleMatDetail(el, itemId){
  craftPlaySfx('expand');
  const detail = el.querySelector('.craft-mat-detail');
  if(!detail) return;
  const isOpen = el.classList.contains('open');
  // 关闭所有已开的
  document.querySelectorAll('.craft-mat-chip.open').forEach(c => c.classList.remove('open'));
  if(!isOpen) el.classList.add('open');
}

// 配方列表
function renderCraftRecipeList(playerLv){
  const allRecipes = getCraftByCategory(_craftCatFilter);
  // 只显示材料充足、可合成的配方
  const recipes = allRecipes.filter(r=> playerLv >= r.level && checkCraftMaterials(r).length === 0);
  if(recipes.length === 0) return `<div style="color:rgba(180,150,80,.3);padding:20px;text-align:center;">该分类暂无可合成配方</div>`;

  return recipes.map(r=>{
    const sel = r.id === _craftSelectedId ? ' selected' : '';

    return `<div class="craft-recipe-item${sel} ready" onclick="craftSelectRecipe('${r.id}')">
      <span class="cri-icon">${r.icon}</span>
      <div class="cri-info">
        <div class="cri-name">${r.name}</div>
        <div class="cri-hint">✅ 可合成</div>
      </div>
      <span class="cri-lv">Lv${r.level}</span>
    </div>`;
  }).join('');
}

// 配方详情面板
function renderCraftDetail(recipeId, playerLv){
  if(!recipeId){
    return `<div class="craft-detail-empty">
      <div style="font-size:36px;margin-bottom:12px;">⚗️</div>
      <div style="color:rgba(180,150,80,.5);font-size:13px;letter-spacing:2px;">选择左侧配方查看详情</div>
    </div>`;
  }

  const r = getCraftRecipe(recipeId);
  if(!r) return '';
  const missing = checkCraftMaterials(r);
  const locked  = playerLv < r.level;
  const canCraft = !locked && missing.length === 0;

  const stationInfo = CRAFT_STATIONS[r.station] || CRAFT_STATIONS.basic;

  return `
  <div class="craft-detail">
    <div class="craft-detail-head">
      <span class="craft-detail-icon">${r.icon}</span>
      <div>
        <div class="craft-detail-name">${r.name}</div>
        <div class="craft-detail-cat">${r.category} · ${stationInfo.name}</div>
      </div>
      <div class="craft-detail-lv">Lv${r.level}</div>
    </div>

    <div class="craft-detail-desc">${r.desc}</div>

    <!-- 材料清单 -->
    <div class="craft-mat-list-title">所需材料</div>
    <div class="craft-mat-list">
      ${r.materials.map(m=>{
        const meta = getItemMeta(m.id) || {};
        const have = craftBagGetQty(m.id);
        const ok   = have >= m.qty;
        return `<div class="craft-mat-row${ok?'':' lack'}">
          <span class="cmr-icon">${meta.icon||'🔹'}</span>
          <span class="cmr-name">${meta.name||m.id}</span>
          <span class="cmr-qty">${have}/${m.qty}</span>
          <span class="cmr-status">${ok?'✅':'❌'}</span>
        </div>`;
      }).join('')}
    </div>

    <!-- 产出预览 -->
    <div class="craft-result-preview">
      <div class="craft-mat-list-title">合成产出</div>
      <div class="craft-result-item">
        <span class="cri2-icon">${r.result.icon}</span>
        <div class="cri2-info">
          <div class="cri2-name">${r.result.name} ×${r.result.qty||1}</div>
          <div class="cri2-desc">${r.result.desc||''}</div>
        </div>
      </div>
      ${r.special ? `<div class="craft-special-note">⚡ ${r.special}</div>` : ''}
      <div class="craft-exp-note">📈 合成经验 +${r.exp}</div>
    </div>

    <!-- 合成按钮 -->
    <button class="craft-do-btn${canCraft?'':' disabled'}"
            onclick="doClickCraft('${r.id}')"
            ${canCraft?'':'disabled'}>
      ${locked ? `🔒 等级不足（需 ${r.level} 级）` :
        (canCraft ? `⚗️ 开始合成` : `⚠️ 材料不足`)}
    </button>
  </div>`;
}

// 已合成道具库存
function renderCraftStock(){
  const bag = consumableBagLoad();
  if(bag.length === 0){
    return `<div class="craft-stock-empty">还没有合成任何道具</div>`;
  }
  return bag.map(item=>{
    return `<div class="craft-stock-item" onclick="craftUseItem('${item.id}')">
      <span class="csi-icon">${item.icon||'💊'}</span>
      <div class="csi-info">
        <div class="csi-name">${item.name}</div>
        <div class="csi-desc">${item.desc||''}</div>
      </div>
      <div class="csi-qty-col">
        <span class="csi-qty">×${item.qty}</span>
        <button class="csi-use-btn" onclick="event.stopPropagation();craftUseItem('${item.id}')">使用</button>
      </div>
    </div>`;
  }).join('');
}

// 收藏品专区渲染
const RARITY_LABEL = {
  common:    { label:'普通', color:'rgba(160,145,110,.9)' },
  uncommon:  { label:'少见', color:'rgba(80,200,80,.9)'   },
  rare:      { label:'稀有', color:'rgba(80,140,255,.9)'  },
  epic:      { label:'精品', color:'rgba(180,80,255,.9)'  },
  legendary: { label:'传说', color:'rgba(255,200,40,.9)'  },
};

const CRICKET_RARE_LABEL = {
  1:{label:'凡品',color:'#a09060'},
  2:{label:'良品',color:'#5090d0'},
  3:{label:'极品',color:'#b070e0'},
  4:{label:'神品',color:'#ffd700'},
  5:{label:'传说',color:'#ff6f00'},
};

/**
 * 渲染背包中的蛐蛐列表（从 CG.collection 读取）
 * 点击卡片可跳转到斗蛐蛐界面
 */
function renderCraftCrickets(){
  // 斗蛐蛐模块未加载时显示空提示
  if(typeof CG === 'undefined' || !CG || !Array.isArray(CG.collection)){
    return `<div class="craft-crickets-empty">🦗 蛐蛐数据尚未加载</div>`;
  }
  const list = CG.collection;
  if(list.length === 0){
    return `<div class="craft-crickets-empty">还没有蛐蛐——去野外草丛捕捉吧！</div>`;
  }
  return list.map(c => {
    const breed = (typeof CRICKET_BREEDS !== 'undefined')
      ? CRICKET_BREEDS.find(b=>b.id===c.breedId) : null;
    const rl = CRICKET_RARE_LABEL[breed?breed.rare:1] || CRICKET_RARE_LABEL[1];
    const stats = (typeof cgGetStats === 'function') ? cgGetStats(c) : null;
    const cond = c.condition || 'fresh';
    const condLabel = (typeof cgConditionLabel === 'function')
      ? cgConditionLabel(cond) : cond;
    // 是否在出战阵容中
    const inSquad = Array.isArray(CG.squad) && CG.squad.includes(c.uid);
    return `<div class="craft-cricket-card" style="--cc-color:${rl.color}"
              onclick="if(typeof closeAllPanels==='function')closeAllPanels();if(typeof openCricketGame==='function')openCricketGame()">
      <div class="ccc-left">
        <span class="ccc-rare">${rl.label}</span>
        <span class="ccc-name">${c.name}</span>
        ${inSquad ? '<span class="ccc-squad-badge">出战中</span>' : ''}
      </div>
      <div class="ccc-mid">
        <span class="ccc-breed">${breed ? breed.name : c.breedId}</span>
        <span class="ccc-lv">Lv.${c.level}</span>
        ${stats ? `<span class="ccc-stats">攻${stats.atk} 防${stats.def} 速${stats.spd}</span>` : ''}
      </div>
      <div class="ccc-right">
        <span class="ccc-condition" style="color:${cond==='tired'?'#e07050':cond==='injured'?'#d32f2f':'#4caf50'}">${condLabel}</span>
        <span class="ccc-wl">胜${c.wins}/负${c.losses}</span>
      </div>
    </div>`;
  }).join('');
}

function renderCraftCollect(){
  const bag = craftBagLoad();
  const cols = bag.filter(item=>{
    const meta = getItemMeta(item.id) || item;
    return (meta.type||item.type) === 'collectible';
  });
  if(cols.length === 0){
    return `<div class="craft-collect-empty">尚无收藏——击败江湖豪侠或探索险地，说不定会得到些不知所谓的玩意儿。</div>`;
  }
  return cols.map(item=>{
    const meta = getItemMeta(item.id) || item;
    const rarity = meta.rarity || 'common';
    const rl = RARITY_LABEL[rarity] || RARITY_LABEL.common;
    const sellP = meta.sellPrice || 0;
    const artData = (typeof getItemArt === 'function') ? getItemArt(item.id) : null;
    const artHtml = artData
      ? `<pre class="cci-art" style="color:${artData.color||rl.color}">${artData.art}</pre>`
      : `<div class="cci-art cci-art-fallback" style="color:${rl.color}">${meta.icon||'🔹'}</div>`;
    return `<div class="craft-col-item" style="--col-color:${rl.color}">
      <div class="cci-body">
        ${artHtml}
        <div class="cci-right">
          <div class="cci-top">
            <div class="cci-info">
              <div class="cci-name">${meta.name||item.id}</div>
              <div class="cci-rarity" style="color:${rl.color}">${rl.label}</div>
            </div>
            <div class="cci-qty-col">
              <span class="cci-qty">×${item.qty}</span>
              ${sellP>0 ? `<button class="cci-sell-btn" onclick="craftSellCollect('${item.id}',1)">卖${sellP}两</button>` : ''}
              ${sellP>0 && item.qty>1 ? `<button class="cci-sell-btn cci-sell-all" onclick="craftSellCollect('${item.id}',${item.qty})">全卖</button>` : ''}
            </div>
          </div>
          <div class="cci-desc">${meta.desc||''}</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// 出售收藏品
function craftSellCollect(itemId, qty){
  const bag = craftBagLoad();
  const entry = bag.find(e=>e.id===itemId);
  if(!entry || entry.qty < qty){ showCraftToast('❌ 数量不足', false); craftPlaySfx('no_mat'); return; }
  const meta = getItemMeta(itemId) || entry;
  const price = (meta.sellPrice||0) * qty;
  entry.qty -= qty;
  if(entry.qty <= 0) bag.splice(bag.indexOf(entry),1);
  craftBagSave(bag);
  // 加银两（两套状态都更新，以防场景不同）
  if(typeof travelPlayerState !== 'undefined' && travelPlayerState){
    SilverManager.add(price); SilverManager.save();
    if(typeof travelSave==='function') travelSave();
  }
  // 使用统一银两管理器
  addSilver(price);
  SilverManager.save();
  const icon = meta.icon||'🔹';
  const name = meta.name||itemId;
  craftPlaySfx('sell');
  showCraftToast(`${icon} ${name}×${qty} 已售出，获得 ${price} 两银子`, true);
  // 刷新收藏区和材料栏
  const cg = document.getElementById('craftCollectGrid');
  if(cg) cg.innerHTML = renderCraftCollect();
  const mb = document.getElementById('craftMatBar');
  if(mb) mb.innerHTML = renderCraftMatBar();
}

// ── UI 交互函数 ──

function craftSetCat(cat){
  _craftCatFilter = cat;
  _craftSelectedId = null;
  craftPlaySfx('tab');
  renderCraftPage();
}

function craftSelectRecipe(id){
  _craftSelectedId = id;
  craftPlaySfx('select');
  const playerLv = (typeof edS!=='undefined' ? edS.level : 1) || 1;
  document.getElementById('craftDetailPanel').innerHTML = renderCraftDetail(id, playerLv);
  // 高亮列表中的选中项
  document.querySelectorAll('.craft-recipe-item').forEach(el=>{
    el.classList.toggle('selected', el.getAttribute('onclick')?.includes(id));
  });
}

function doClickCraft(recipeId){
  // 合成期间自动降低背景乐音量，避免与音效冲突
  if(craftBgmIsPlaying()) craftBgmSetVolume(_craftBgmVolume * .25);

  // 合成开始瞬间：炉火点燃
  craftPlaySfx('craft_start');

  const res = doCraft(recipeId);
  const playerLv = (typeof edS!=='undefined' ? edS.level : 1) || 1;

  // ── 音效 & 视觉特效 ──
  if(res.ok){
    // 根据配方等级判断特效等级
    const recipe = getCraftRecipe(recipeId);
    const recLv  = recipe ? (recipe.level||1) : 1;
    let   sfxType = 'success';
    let   fxTier  = 'normal';
    if(recLv >= 35){
      sfxType = 'legendary'; fxTier = 'epic';
    } else if(recLv >= 25 || (recipe && recipe.special)){
      sfxType = 'success_epic'; fxTier = 'epic';
    } else if(recLv >= 15){
      sfxType = 'success_rare'; fxTier = 'rare';
    }
    // 延迟播放成功音效（让炉火声先响完）
    _craftScheduleAudio(()=>{ craftPlaySfx(sfxType); }, 350);
    // 在合成按钮位置爆出特效
    const craftBtn = document.querySelector('.craft-do-btn');
    _craftScheduleAudio(()=>{ craftBlastFx(craftBtn, fxTier); }, 300);
    // 恢复背景乐音量
    _craftScheduleAudio(()=>{ if(craftBgmIsPlaying()) craftBgmSetVolume(_craftBgmVolume); }, 800);
  } else if(res.failed){
    // 材料损耗式失败
    _craftScheduleAudio(()=>{ craftPlaySfx('fail'); }, 250);
    _craftScheduleAudio(()=>{ if(craftBgmIsPlaying()) craftBgmSetVolume(_craftBgmVolume); }, 700);
    const craftBtn = document.querySelector('.craft-do-btn');
    if(craftBtn){
      craftBtn.style.animation = 'none'; craftBtn.offsetHeight;
      craftBtn.style.animation = 'shake .4s ease-out both';
    }
  } else {
    // 材料不足等提示性失败
    craftPlaySfx('no_mat');
  }

  // 显示结果浮层
  showCraftToast(res.msg, res.ok);

  // 刷新界面
  const matBar = document.getElementById('craftMatBar');
  if(matBar) matBar.innerHTML = renderCraftMatBar();
  const recipeList = document.getElementById('craftRecipeList');
  if(recipeList) recipeList.innerHTML = renderCraftRecipeList(playerLv);
  document.getElementById('craftDetailPanel').innerHTML = renderCraftDetail(recipeId, playerLv);
  const stockGrid = document.getElementById('craftStockGrid');
  if(stockGrid) stockGrid.innerHTML = renderCraftStock();
  const collectGrid = document.getElementById('craftCollectGrid');
  if(collectGrid) collectGrid.innerHTML = renderCraftCollect();
}

// 使用消耗品
function craftUseItem(itemId){
  const entry = consumableBagGet(itemId);
  if(!entry){ craftPlaySfx('no_mat'); showCraftToast('❌ 找不到该道具', false); return; }

  const eff = entry.effect || {};
  let msgs = [];

  // 气血恢复
  if(eff.hp){
    if(typeof lHp !== 'undefined'){
      const maxHp = (typeof LH !== 'undefined' && LH._maxHpFull) ? LH._maxHpFull : 1000;
      const heal = Math.min(eff.hp, maxHp - lHp);
      lHp = Math.min(lHp + eff.hp, maxHp);
      msgs.push(`气血 +${heal}`);
      const bar = document.getElementById('lHpBar');
      if(bar) bar.style.width = Math.max(0, lHp / maxHp * 100) + '%';
    }
    // 旅行中也恢复
    if(typeof travelPlayerState !== 'undefined' && travelPlayerState){
      travelPlayerState.hp = Math.min((travelPlayerState.hp ?? 100) + eff.hp, 100);
      msgs.push(`（旅行气血恢复）`);
    }
  }
  // 内力恢复
  if(eff.mp){
    if(typeof lMp !== 'undefined'){
      const maxMp = (typeof LH !== 'undefined' && LH._maxMpFull) ? LH._maxMpFull : 150;
      lMp = Math.min(lMp + eff.mp, maxMp);
      msgs.push(`内力 +${eff.mp}`);
      if(typeof updateMpBars === 'function') updateMpBars();
    }
  }
  // 解毒
  if(eff.detox){
    if(typeof lSt !== 'undefined') lSt.poison = 0;
    msgs.push(`中毒已解除`);
  }
  // 攻击增益
  if(eff.atkBuff){
    if(typeof lSt !== 'undefined'){
      lSt.atkBuff = (lSt.atkBuff||0) + eff.atkBuff;
      msgs.push(`攻击 +${eff.atkBuff}（${eff.turns||3}回合）`);
    }
  }
  // 防御增益
  if(eff.defBuff){
    if(typeof lSt !== 'undefined'){
      lSt.defBuff = (lSt.defBuff||0) + eff.defBuff;
      msgs.push(`防御 +${eff.defBuff}（${eff.turns||3}回合）`);
    }
  }
  // 速度增益
  if(eff.speedBuff){
    if(typeof edS !== 'undefined') edS._tempSpeedBuff = (edS._tempSpeedBuff||0) + eff.speedBuff;
    msgs.push(`速度 +${eff.speedBuff}（${eff.turns||3}回合）`);
  }
  // 饱食度/口渴
  if(eff.food && typeof travelPlayerState !== 'undefined' && travelPlayerState){
    travelPlayerState.food = Math.min(100, (travelPlayerState.food ?? 100) + eff.food);
    msgs.push(`饱食度 +${eff.food}`);
  }
  if(eff.water && typeof travelPlayerState !== 'undefined' && travelPlayerState){
    travelPlayerState.water = Math.min(100, (travelPlayerState.water ?? 100) + eff.water);
    msgs.push(`口渴度 +${eff.water}`);
  }
  // 续命丸（设标记）
  if(eff.auto_revive){
    if(typeof edS !== 'undefined') edS._hasRevivePill = true;
    msgs.push(`💗 续命丸已装备，气血归零时自动触发`);
  }

  if(msgs.length === 0) msgs.push('道具已使用');
  consumableBagConsume(itemId, 1);

  craftPlaySfx('use');
  showCraftToast(`${entry.icon} ${entry.name}：${msgs.join('，')}`, true);
  // 刷新库存显示
  const stockGrid = document.getElementById('craftStockGrid');
  if(stockGrid) stockGrid.innerHTML = renderCraftStock();
  // 刷新旅行状态栏
  if(typeof renderStatusBar === 'function') renderStatusBar();
}

// 浮动提示
function showCraftToast(msg, ok){
  // 先移除旧 Toast（防止残留导致"永远存在"）
  let old = document.getElementById('craftToast');
  if(old){ old.remove(); clearTimeout(old._timer); }
  let el = document.createElement('div');
  el.id = 'craftToast';
  el.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
    padding:10px 22px;border-radius:8px;font-size:13px;z-index:9999;
    letter-spacing:1px;pointer-events:none;transition:opacity .5s ease;
    animation:craft-result-pop .3s cubic-bezier(.17,.67,.44,1.3) both;
    background:${ok?'rgba(20,60,25,.95)':'rgba(70,15,15,.95)'};
    border:1px solid ${ok?'#60c860':'#c04040'};
    color:${ok?'#90ff90':'#ff9090'};
    box-shadow:${ok
      ?'0 0 12px rgba(80,220,80,.45), 0 2px 8px rgba(0,0,0,.5)'
      :'0 0 12px rgba(220,60,60,.4),  0 2px 8px rgba(0,0,0,.5)'};`;
  el.textContent = msg;
  document.body.appendChild(el);
  // 3 秒后淡出，transition 结束后从 DOM 删除
  el._timer = setTimeout(()=>{
    el.style.opacity = '0';
    el.addEventListener('transitionend', ()=>{ if(el.parentNode) el.remove(); }, {once:true});
    // 兜底：1 秒后强制删除（防止 transition 不触发）
    el._forceRm = setTimeout(()=>{ if(el.parentNode) el.remove(); }, 1000);
  }, 3000);
}

// 向合成材料背包注入掉落物（在 battle.js / travel.js 中的掉落逻辑后调用）
function injectDropToCraftBag(dropId, qty, meta){
  craftBagAdd(dropId, qty, meta);
  // 若合成页面当前打开，刷新收藏区
  const collectGrid = document.getElementById('craftCollectGrid');
  if(collectGrid) collectGrid.innerHTML = renderCraftCollect();
  // 同步刷新背包Tab角标
  _tryRefreshTownBag();
}

// ════════════════════════════════════════════════════
//  炼物阁音效 & 视觉特效
// ════════════════════════════════════════════════════

let _craftActx = null;
let _craftAudioSessionId = 0;
const _craftAudioTimers = new Set();

function _craftScheduleAudio(fn, delay = 0){
  const sessionId = _craftAudioSessionId;
  const timerId = setTimeout(() => {
    _craftAudioTimers.delete(timerId);
    if(sessionId !== _craftAudioSessionId) return;
    try{ fn(); }catch(e){}
  }, delay);
  _craftAudioTimers.add(timerId);
  return timerId;
}

function _craftClearAudioTimers(){
  _craftAudioTimers.forEach(timerId => clearTimeout(timerId));
  _craftAudioTimers.clear();
}

function _craftGetACtx(){
  // 优先复用斗蛐蛐的 AudioContext
  if(typeof _cgActx !== 'undefined' && _cgActx) return _cgActx;
  if(!_craftActx) _craftActx = new (window.AudioContext||window.webkitAudioContext)();
  if(_craftActx.state === 'suspended') _craftActx.resume();
  return _craftActx;
}
function cleanupCraftAudio(){
  _craftAudioSessionId++;
  _craftClearAudioTimers();
  try{
    if(_craftBgmTimer) { clearInterval(_craftBgmTimer); _craftBgmTimer = null; }
    if(_craftBgmTimerBass) { clearInterval(_craftBgmTimerBass); _craftBgmTimerBass = null; }
    if(_craftBgmMasterGain){
      try{ _craftBgmMasterGain.disconnect(); }catch(e){}
      _craftBgmMasterGain = null;
    }
    if(_craftActx && _craftActx.state !== 'closed') _craftActx.close();
  }catch(e){}
  _craftActx = null;
}

window.cleanupCraftAudio = cleanupCraftAudio;
window.addEventListener('pagehide', cleanupCraftAudio);
window.addEventListener('beforeunload', cleanupCraftAudio);

/** 合成器：播一个带淡入淡出的音调 */

function _craftTone(opts){
  try{
    const ctx = _craftGetACtx();
    const g   = ctx.createGain();
    g.connect(ctx.destination);
    const { type='sine', freq=440, freqEnd, dur=.15, vol=.2, delay=0 } = opts;
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .01);
    g.gain.exponentialRampToValueAtTime(.001, t + dur);
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if(freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    osc.connect(g);
    osc.start(t);
    osc.stop(t + dur + .02);
  } catch(e){}
}

function _craftNoiseBurst(dur=.06, vol=.2){
  try{
    const ctx = _craftGetACtx();
    const buf  = ctx.createBuffer(1, ctx.sampleRate*dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+dur);
    src.connect(g); g.connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime+dur);
  } catch(e){}
}

/**
 * craftPlaySfx(type)
 * type: 'success'|'success_rare'|'success_epic'|'fail'|'no_mat'|'use'|'sell'
 *       'select'    — 选中配方
 *       'tab'       — 切换分类
 *       'open'      — 打开炼物阁
 *       'expand'    — 展开/折叠材料详情
 *       'craft_start'— 开始合成过程（按钮按下瞬间）
 *       'legendary' — 传说级物品获得
 */
function craftPlaySfx(type){
  try{
    switch(type){

      // ── 打开炼物阁 ── 温暖的钟磬声
      case 'open':
        _craftTone({type:'sine', freq:392, dur:.25, vol:.15});
        _craftTone({type:'sine', freq:523, dur:.25, vol:.15, delay:.1});
        _craftTone({type:'sine', freq:659, dur:.35, vol:.18, delay:.22});
        _craftTone({type:'sine', freq:784, dur:.3,  vol:.12, delay:.4});
        break;

      // ── 切换分类 ── 轻快的翻页声
      case 'tab':
        _craftNoiseBurst(.03, .08);
        _craftTone({type:'sine', freq:660, dur:.06, vol:.12});
        _craftTone({type:'sine', freq:880, dur:.06, vol:.12, delay:.04});
        break;

      // ── 选中配方 ── 柔和的确认音
      case 'select':
        _craftTone({type:'sine', freq:440, dur:.08, vol:.14});
        _craftTone({type:'sine', freq:554, dur:.08, vol:.16, delay:.06});
        _craftTone({type:'sine', freq:659, dur:.1,  vol:.14, delay:.12});
        break;

      // ── 展开/折叠材料详情 ── 轻微的布匹展开声
      case 'expand':
        _craftNoiseBurst(.02, .06);
        _craftTone({type:'sine', freq:523, dur:.05, vol:.1});
        break;

      // ── 开始合成过程 ── 药炉点燃/炉火升温
      case 'craft_start':
        _craftNoiseBurst(.08, .12);
        _craftTone({type:'sine', freq:200, freqEnd:350, dur:.3, vol:.15});
        _craftTone({type:'sine', freq:280, freqEnd:420, dur:.25, vol:.12, delay:.15});
        _craftNoiseBurst(.06, .1);
        break;

      // ── 普通合成成功 ── 叮咚上行
      case 'success':
        _craftTone({type:'sine', freq:523, dur:.16, vol:.22});
        _craftTone({type:'sine', freq:659, dur:.16, vol:.22, delay:.12});
        _craftTone({type:'sine', freq:784, dur:.22, vol:.25, delay:.26});
        // 短促金属敲击
        _craftNoiseBurst(.04, .12);
        break;

      // ── 高级合成成功（level≥20 或稀有配方）── 更华丽的和弦+升调
      case 'success_rare':
        // 双音和弦
        _craftTone({type:'sine', freq:523,  dur:.2,  vol:.2});
        _craftTone({type:'sine', freq:659,  dur:.2,  vol:.2});
        _craftTone({type:'sine', freq:523,  dur:.22, vol:.22, delay:.15});
        _craftTone({type:'sine', freq:784,  dur:.22, vol:.22, delay:.15});
        _craftTone({type:'sine', freq:1047, dur:.3,  vol:.28, delay:.32});
        _craftTone({type:'sine', freq:1318, dur:.3,  vol:.25, delay:.48});
        _craftNoiseBurst(.05, .15);
        break;

      // ── 极品/失败率配方成功 ── 神圣感
      case 'success_epic':
        [523,659,784,1047,1318,1568].forEach((f,i)=>{
          _craftTone({type:'sine', freq:f, dur:.2, vol:.2, delay:i*.09});
        });
        // 同时叠一个低频共鸣
        _craftTone({type:'sine', freq:130, freqEnd:80, dur:.5, vol:.15});
        _craftNoiseBurst(.08, .2);
        break;

      // ── 传说级物品获得 ── 天降神物感，华彩琶音+金色共鸣
      case 'legendary':
        [392,523,659,784,1047,1318,1568,2093].forEach((f,i)=>{
          _craftTone({type:'sine', freq:f, dur:.18, vol:.22, delay:i*.07});
        });
        // 低频共鸣增强
        _craftTone({type:'sine', freq:98, freqEnd:65, dur:.6, vol:.18});
        // 金色噪声
        _craftNoiseBurst(.1, .22);
        _craftNoiseBurst(.08, .15);
        break;

      // ── 材料不足 ── 沉闷短促
      case 'no_mat':
        _craftTone({type:'square', freq:220, freqEnd:150, dur:.15, vol:.2});
        _craftTone({type:'square', freq:180, freqEnd:120, dur:.12, vol:.15, delay:.12});
        break;

      // ── 合成失败（材料损耗）── 低沉下行+噪声
      case 'fail':
        _craftNoiseBurst(.12, .3);
        _craftTone({type:'sawtooth', freq:300, freqEnd:60, dur:.4, vol:.3});
        _craftTone({type:'sine',     freq:200, freqEnd:80, dur:.35, vol:.2, delay:.1});
        break;

      // ── 使用道具 ── 清脆短音
      case 'use':
        _craftTone({type:'sine', freq:880,  dur:.1,  vol:.18});
        _craftTone({type:'sine', freq:1047, dur:.12, vol:.2, delay:.08});
        _craftTone({type:'sine', freq:784,  dur:.14, vol:.15, delay:.18});
        break;

      // ── 出售物品 ── 银两叮当
      case 'sell':
        _craftTone({type:'sine', freq:1200, freqEnd:1600, dur:.08, vol:.2});
        _craftScheduleAudio(()=>{
          _craftTone({type:'sine', freq:1400, freqEnd:1000, dur:.1,  vol:.18});
          _craftNoiseBurst(.03, .1);
        }, 80);
        break;
    }
  } catch(e){}
}

// ════════════════════════════════════════════════════
//  炼物阁循环背景乐（五声音阶古风氛围）
// ════════════════════════════════════════════════════

/**
 * 中国五声音阶频率（宫商角徵羽）
 * 以 D 为宫：D4=293.66, E4=329.63, F#4=369.99, A4=440, B4=493.88
 * 跨两个八度 + 低八度根音
 */
const _CRAFT_BGM_NOTES = [
  146.83,  // D3  低宫
  164.81,  // E3  低商
  185.00,  // F#3 低角
  220.00,  // A3  低徵
  246.94,  // B3  低羽
  293.66,  // D4  宫
  329.63,  // E4  商
  369.99,  // F#4 角
  440.00,  // A4  徵
  493.88,  // B4  羽
  587.33,  // D5  高宫
  659.25,  // E5  高商
];

/** 旋律模式：每个音符 [noteIndex, durationMultiplier] */
const _CRAFT_BGM_MELODY = [
  [5,.8], [7,.6], [9,1.0], [7,.6], [5,.8], [6,.5], [4,.6],
  [3,.8], [5,.6], [7,1.0], [9,.6], [10,1.2], [9,.6], [7,.8],
  [5,.8], [4,.6], [3,.8], [2,.6], [3,1.0], [5,.8], [4,.5], [2,.6],
  [1,.8], [2,.6], [3,.8], [5,1.0], [7,.8], [5,1.2],
  [9,.8], [7,.6], [5,.8], [6,.5], [7,.6], [9,1.0],
  [10,.8], [9,.6], [7,.8], [5,.6], [4,.8], [5,1.2],
  [3,.8], [4,.6], [5,.8], [7,1.0], [9,.8], [10,.6], [9,1.2],
  [7,.8], [5,.6], [4,.8], [3,.6], [2,.8], [1,1.2],
];

/** 低音伴奏模式：缓慢的根音+五度交替 */
const _CRAFT_BGM_BASS = [
  [0, 2.4], [3, 2.4], [4, 2.4], [0, 2.4],
  [2, 2.4], [4, 2.4], [3, 2.4], [0, 2.4],
  [5, 2.4], [4, 2.4], [2, 2.4], [0, 2.4],
  [3, 2.4], [5, 2.4], [4, 2.4], [0, 2.4],
];

let _craftBgmTimer    = null;   // 主旋律定时器
let _craftBgmTimerBass = null;  // 低音定时器
let _craftBgmVolume    = 0.08;  // 主音量（很低，不抢戏）
let _craftBgmMasterGain = null; // 主音量节点
let _craftBgmMelodyIdx  = 0;
let _craftBgmBassIdx    = 0;

/** 计算旋律总时长 */
function _craftBgmMelodyLen(){
  return _CRAFT_BGM_MELODY.reduce((s,n)=>s+n[1], 0);
}

/** 计算低音总时长 */
function _craftBgmBassLen(){
  return _CRAFT_BGM_BASS.reduce((s,n)=>s+n[1], 0);
}

/** 播放一个带混响感的柔和音符（古琴/箫感） */
function _craftBgmNote(freq, dur, vol, delay=0){
  try{
    const ctx = _craftGetACtx();
    const t = ctx.currentTime + delay;
    const master = _craftBgmMasterGain || ctx.destination;

    // 主振荡器：正弦波（柔和）
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    // 轻微颤音（模拟吹奏/拨弦）
    const vibrato = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(4.5, t); // 4.5Hz 颤音
    vibGain.gain.setValueAtTime(1.8, t);
    vibrato.connect(vibGain);
    vibGain.connect(osc.frequency);
    vibrato.start(t);
    vibrato.stop(t + dur + .1);

    // 包络
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(vol, t + Math.min(.04, dur*.1));  // 快起
    env.gain.setValueAtTime(vol, t + dur*.3);
    env.gain.exponentialRampToValueAtTime(vol*.6, t + dur*.7);        // 缓降
    env.gain.exponentialRampToValueAtTime(.001, t + dur);             // 消逝

    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + dur + .05);

    // 泛音层：高一个八度，极低音量（模拟泛音共鸣）
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);
    const env2 = ctx.createGain();
    env2.gain.setValueAtTime(0, t);
    env2.gain.linearRampToValueAtTime(vol * .15, t + .02);
    env2.gain.exponentialRampToValueAtTime(.001, t + dur * .6);
    osc2.connect(env2);
    env2.connect(master);
    osc2.start(t);
    osc2.stop(t + dur * .6 + .05);
  } catch(e){}
}

/** 低音伴奏：更柔和、更长 */
function _craftBgmBassNote(freq, dur, vol, delay=0){
  try{
    const ctx = _craftGetACtx();
    const t = ctx.currentTime + delay;
    const master = _craftBgmMasterGain || ctx.destination;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(vol, t + .08);
    env.gain.setValueAtTime(vol, t + dur*.5);
    env.gain.exponentialRampToValueAtTime(.001, t + dur);

    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + dur + .05);
  } catch(e){}
}

/** 启动循环背景乐 */
function craftBgmStart(){
  try{
    if(_craftBgmTimer) return; // 已在播放

    const ctx = _craftGetACtx();

    // 创建主音量节点
    _craftBgmMasterGain = ctx.createGain();
    _craftBgmMasterGain.gain.setValueAtTime(_craftBgmVolume, ctx.currentTime);
    _craftBgmMasterGain.connect(ctx.destination);

    const NOTE_DUR = 0.55; // 每单位时长的秒数
    const melodyTotal = _craftBgmMelodyLen() * NOTE_DUR;
    const bassTotal   = _craftBgmBassLen() * NOTE_DUR;

    // 重置索引
    _craftBgmMelodyIdx = 0;
    _craftBgmBassIdx   = 0;

    // ── 主旋律调度 ──
    function scheduleMelody(){
      const note = _CRAFT_BGM_MELODY[_craftBgmMelodyIdx];
      const freq = _CRAFT_BGM_NOTES[note[0]];
      const dur  = note[1] * NOTE_DUR;
      _craftBgmNote(freq, dur, _craftBgmVolume * 1.2);

      _craftBgmMelodyIdx++;
      if(_craftBgmMelodyIdx >= _CRAFT_BGM_MELODY.length) _craftBgmMelodyIdx = 0;
    }

    // 先立即播放第一个音
    scheduleMelody();
    _craftBgmTimer = setInterval(scheduleMelody, melodyTotal / _CRAFT_BGM_MELODY.length * 1000);

    // ── 低音伴奏调度 ──
    function scheduleBass(){
      const note = _CRAFT_BGM_BASS[_craftBgmBassIdx];
      const freq = _CRAFT_BGM_NOTES[note[0]];
      const dur  = note[1] * NOTE_DUR;
      _craftBgmBassNote(freq, dur, _craftBgmVolume * .5);

      _craftBgmBassIdx++;
      if(_craftBgmBassIdx >= _CRAFT_BGM_BASS.length) _craftBgmBassIdx = 0;
    }

    scheduleBass();
    _craftBgmTimerBass = setInterval(scheduleBass, bassTotal / _CRAFT_BGM_BASS.length * 1000);
  } catch(e){}
}

/** 停止循环背景乐（淡出） */
function craftBgmStop(){
  try{
    // 淡出
    if(_craftBgmMasterGain){
      const ctx = _craftGetACtx();
      _craftBgmMasterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + .8);
    }
    // 延迟清除定时器，让淡出完成
    setTimeout(()=>{
      if(_craftBgmTimer)   { clearInterval(_craftBgmTimer);   _craftBgmTimer = null; }
      if(_craftBgmTimerBass){ clearInterval(_craftBgmTimerBass); _craftBgmTimerBass = null; }
      _craftBgmMasterGain = null;
    }, 900);
  } catch(e){
    // 强制清理
    if(_craftBgmTimer)    { clearInterval(_craftBgmTimer);    _craftBgmTimer = null; }
    if(_craftBgmTimerBass){ clearInterval(_craftBgmTimerBass); _craftBgmTimerBass = null; }
    _craftBgmMasterGain = null;
  }
}

/** 设置背景乐音量 (0~1) */
function craftBgmSetVolume(v){
  _craftBgmVolume = Math.max(0, Math.min(1, v));
  if(_craftBgmMasterGain){
    const ctx = _craftGetACtx();
    _craftBgmMasterGain.gain.linearRampToValueAtTime(_craftBgmVolume, ctx.currentTime + .2);
  }
}

/** 获取当前背景乐音量 */
function craftBgmGetVolume(){
  return _craftBgmVolume;
}

/** 背景乐是否正在播放 */
function craftBgmIsPlaying(){
  return !!_craftBgmTimer;
}

/** 滑块变化回调 */
function craftBgmSliderChange(val){
  const v = parseInt(val) / 100;
  _craftBgmSliderVal = v; // 记住滑块值，防止 renderCraftPage 重建后丢失
  if(v === 0){
    craftBgmStop();
    const label = document.getElementById('craftBgmLabel');
    if(label) { label.textContent = '✕'; label.style.opacity = '.4'; }
  } else {
    craftBgmSetVolume(v * 0.25); // 最大音量限制在0.25
    if(!craftBgmIsPlaying()) craftBgmStart();
    const label = document.getElementById('craftBgmLabel');
    if(label) { label.textContent = '♪'; label.style.opacity = '1'; }
  }
}

/** 持久记忆滑块值 */
let _craftBgmSliderVal = 0.30;


/**
 * craftBlastFx(anchorEl, tier)
 * 在 anchorEl 附近爆出光环 + 粒子
 * tier: 'normal'|'rare'|'epic'
 */
function craftBlastFx(anchorEl, tier='normal'){
  try{
    const rect = anchorEl
      ? anchorEl.getBoundingClientRect()
      : { left: window.innerWidth/2, top: window.innerHeight/2, width:0, height:0 };
    const cx = rect.left + rect.width/2;
    const cy = rect.top  + rect.height/2;

    const TIER_CFG = {
      normal: { rings:1, particles:8,  colors:['#80ffcc','#40e8ff','#ffffa0'], size:'60px' },
      rare:   { rings:2, particles:14, colors:['#60c0ff','#a060ff','#ffffa0','#ff80ff'], size:'90px' },
      epic:   { rings:3, particles:20, colors:['#ffd700','#ff8c00','#ff4080','#a060ff','#40e8ff'], size:'130px' },
    };
    const cfg = TIER_CFG[tier] || TIER_CFG.normal;

    // ── 光环扩散环 ──
    for(let r=0; r<cfg.rings; r++){
      const ring = document.createElement('div');
      ring.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px; width:${cfg.size}; height:${cfg.size};
        border-radius:50%;
        border:3px solid ${cfg.colors[r % cfg.colors.length]};
        box-shadow:0 0 12px ${cfg.colors[r % cfg.colors.length]};
        pointer-events:none; z-index:9990;
        animation:craft-glow-ring .7s ease-out both;
        animation-delay:${r*120}ms;
      `;
      document.body.appendChild(ring);
      setTimeout(()=>ring.remove(), 900 + r*120);
    }

    // ── 粒子飞散 ──
    const SYMBOLS = ['✦','◆','★','❋','⬡','✸','❄','⬟'];
    for(let i=0; i<cfg.particles; i++){
      const angle = (Math.PI*2 / cfg.particles) * i + Math.random()*.5;
      const dist  = 40 + Math.random()*60;
      const px    = Math.cos(angle)*dist;
      const py    = Math.sin(angle)*dist;
      const color = cfg.colors[i % cfg.colors.length];
      const sym   = SYMBOLS[i % SYMBOLS.length];

      const p = document.createElement('span');
      p.textContent = sym;
      p.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px;
        font-size:${10+Math.random()*8}px; color:${color};
        text-shadow:0 0 6px ${color};
        pointer-events:none; z-index:9991;
        --cx:${px}px; --cy:${py}px;
        animation:craft-particle .65s ease-out both;
        animation-delay:${Math.random()*80}ms;
      `;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(), 800);
    }

    // ── 产出图标弹出动画（在detail面板里找 .cri2-icon）──
    const iconEl = document.querySelector('.cri2-icon');
    if(iconEl){
      iconEl.style.animation = 'none';
      iconEl.offsetHeight; // reflow
      iconEl.style.animation = 'craft-result-pop .5s cubic-bezier(.17,.67,.44,1.3) both';
    }
  } catch(e){}
}
