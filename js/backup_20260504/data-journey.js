// ═══════════════════════════════════════════════════════════════
//  旅途野外采集 & 随机事件
//  每天随机触发：自动消耗背包食物/水，或野外采集/河水饮用
// ═══════════════════════════════════════════════════════════════

// 野外食物池（按来源分）
const JNY_FORAGE_POOL = {
  safe: [
    { icon:'🌿', name:'野浆果',       desc:'酸甜可口',             effect:{ food:18 } },
    { icon:'🌰', name:'山核桃',       desc:'油脂丰富',             effect:{ food:22 } },
    { icon:'🍃', name:'野菜',         desc:'清苦充饥',             effect:{ food:15 } },
    { icon:'🫐', name:'野山梨',       desc:'水分充足',             effect:{ food:20, water:12 } },
    { icon:'🍄', name:'野山菇',       desc:'香气扑鼻',             effect:{ food:20 } },
    { icon:'🐟', name:'溪涧小鱼',     desc:'新鲜可口',             effect:{ food:28, hp:8 } },
    { icon:'🍯', name:'野蜂蜜',       desc:'甘甜滋补',             effect:{ food:25, hp:10 } },
    { icon:'🌾', name:'田边野菜',     desc:'田埂边随手挖的',       effect:{ food:15 } },
    { icon:'🌰', name:'野栗子',       desc:'山坡上拾的',           effect:{ food:20 } },
    { icon:'🍃', name:'高山雪茶',     desc:'高寒地带特有',         effect:{ food:12, water:25 } },
    { icon:'🐟', name:'河鲜',         desc:'河道里顺手捉的',       effect:{ food:30, hp:10 } },
    { icon:'🐚', name:'湖滨螺蛳',     desc:'湖边摸的',             effect:{ food:22, water:8 } },
    { icon:'🍄', name:'林下蘑菇',     desc:'林间蘑菇丛',           effect:{ food:18 } },
    { icon:'🍯', name:'树上蜂巢',     desc:'野蜂蜜',               effect:{ food:25, hp:10 } },
    { icon:'🌵', name:'沙漠仙人掌',   desc:'口渴时挤出汁液',       effect:{ food:10, water:20 } },
    { icon:'🦀', name:'礁石蟹',       desc:'海边礁石缝里摸的',     effect:{ food:25, water:10 } },
    { icon:'🌿', name:'肥美牧草尖',   desc:'鲜嫩草尖',             effect:{ food:15 } },
    { icon:'🐸', name:'沼泽田鸡',     desc:'踩草时顺手捉的',       effect:{ food:20, hp:-5 } },
    { icon:'🧊', name:'冰块',          desc:'含而化之',             effect:{ water:15, food:5 } },
    { icon:'🥜', name:'野生花生',     desc:'沙地里的野生花生',     effect:{ food:22 } },
    { icon:'🍇', name:'山葡萄',       desc:'藤上摘的野葡萄',       effect:{ food:18, water:15 } },
    { icon:'🌺', name:'可食花瓣',     desc:'不知名的野花',         effect:{ food:10, water:10 } },
    { icon:'🦌', name:'猎获野兔',     desc:'草丛中伏击所得',       effect:{ food:35, hp:5 } },
    { icon:'🐦', name:'捕得山雀',     desc:'林间张网捕的',         effect:{ food:20 } },
    { icon:'🍢', name:'烤蝉蛹',        desc:'火堆旁烤熟的蝉蛹',     effect:{ food:15, hp:5 } },
    { icon:'🌱', name:'野菜汤',        desc:'野菜煮的清汤',         effect:{ food:18, water:20 } },
  ],
  risky: [
    { icon:'🍄', name:'毒蘑菇',      desc:'误食后腹中绞痛！',     effect:{ food:20, detox:-1 }, bad:true, poisonDesc:'腹痛难忍，内力运行受阻' },
    { icon:'🐍', name:'毒蛇',        desc:'反被咬伤！',           effect:{ food:15, hp:-25 }, bad:true, poisonDesc:'蛇毒发作，浑身发麻' },
    { icon:'🌿', name:'断肠草',      desc:'苦涩难当！',           effect:{ food:5,  detox:-1 }, bad:true, poisonDesc:'肝肠寸断，痛苦难当' },
    { icon:'🦎', name:'毒蜥蜴',       desc:'咬后口舌发麻！',       effect:{ food:10, hp:-20 }, bad:true, poisonDesc:'中毒麻痹，四肢无力' },
    { icon:'🌸', name:'曼陀罗花',     desc:'传说食之致幻！',       effect:{ food:8, detox:-2 }, bad:true, poisonDesc:'神志不清，眼前出现幻象' },
    { icon:'🐸', name:'毒蟾蜍',       desc:'误以为田鸡！',         effect:{ food:15, hp:-15, detox:-1 }, bad:true, poisonDesc:'皮肤溃烂，痛痒难忍' },
  ],
  water: [
    { icon:'💧', name:'山泉水',       desc:'清冽甘甜',             effect:{ water:35 }, good:true },
    { icon:'💧', name:'溪水',         desc:'清凉解渴',             effect:{ water:25 }, good:true },
    { icon:'💧', name:'湖水',          desc:'微有腥味',             effect:{ water:30 }, good:true },
    { icon:'💧', name:'晨露',          desc:'草叶上的露珠',         effect:{ water:15 }, good:true },
    { icon:'💧', name:'瀑布水雾',    desc:'瀑布旁的水雾',         effect:{ water:20, hp:5 }, good:true },
    { icon:'💧', name:'溶洞滴泉',    desc:'石缝中渗出的泉水',     effect:{ water:28 }, good:true },
  ],
  badWater: [
    { icon:'💧', name:'浑浊河水',     desc:'泥沙俱下',             effect:{ water:20, hp:-15 }, bad:true, poisonDesc:'腹痛如绞，身体虚脱' },
    { icon:'💧', name:'死水潭',       desc:'恶臭难当',             effect:{ water:10, hp:-20, detox:-1 }, bad:true, poisonDesc:'染上疫病，四肢无力' },
    { icon:'💧', name:'绿藻池塘',     desc:'水藻腐烂的味道',       effect:{ water:15, hp:-10, detox:-1 }, bad:true, poisonDesc:'恶心呕吐，浑身发冷' },
    { icon:'💧', name:'咸水井',       desc:'又苦又咸',             effect:{ water:5, food:-10 }, bad:true, poisonDesc:'越喝越渴，嘴唇干裂' },
    { icon:'💧', name:'化工废水',    desc:'不知何物污染',         effect:{ water:8, hp:-25, detox:-1 }, bad:true, poisonDesc:'腹部剧痛，面色发青' },
  ],
};

// 每日旅途事件（饥渴相关）
const JNY_HUNGER_EVENTS = [
  // ── 好事件 ──
  { icon:'🌿', title:'采摘野果',     type:'good',
    desc:'路旁有几株野果树，顺手摘了几颗。',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const f = pool.safe[Math.floor(Math.random()*pool.safe.length)]; return useForageItem(f, true); } },
  { icon:'💧', title:'寻得清泉',     type:'good',
    desc:'山涧中偶遇一汪清泉，痛饮一番。',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const w = pool.water[Math.floor(Math.random()*pool.water.length)]; return useForageItem(w, true); } },
  { icon:'🏕️', title:'扎营休整',     type:'great',
    desc:'天色已晚，寻一处山洞歇脚，生火造饭。',
    narrFn(){ return campRest(); } },
  { icon:'🍖', title:'猎获野味',     type:'great',
    desc:'张弓设伏，竟猎得一只肥美的野兔。',
    narrFn(){ return useForageItem({ icon:'🦌', name:'烤野兔', effect:{ food:40, hp:8 } }, true); } },
  { icon:'🐟', title:'溪流垂钓',     type:'good',
    desc:'溪边歇脚，甩竿垂钓，竟有鱼获！',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const f = pool.safe.find(i=>i.name.includes('鱼')) || pool.safe[0]; return useForageItem(f, true); } },
  { icon:'🍯', title:'发现蜂巢',     type:'great',
    desc:'林中一棵老树上挂着一个大蜂巢，割了一块蜂蜜。',
    narrFn(){ return useForageItem({ icon:'🍯', name:'野蜂蜜', effect:{ food:30, hp:12 } }, true); } },
  { icon:'🌅', title:'清晨甘露',     type:'good',
    desc:'晨起草叶上凝着满满露珠，采集饮下。',
    narrFn(){ return useForageItem({ icon:'💧', name:'晨露', effect:{ water:20, food:8 } }, true); } },
  { icon:'🫖', title:'茶亭歇脚',     type:'great',
    desc:'路遇一座废弃茶亭，缸中尚有陈茶，一饮而尽。',
    narrFn(){ return useForageItem({ icon:'🍵', name:'陈茶', effect:{ water:30, energy:15 } }, true); } },
  { icon:'🍲', title:'野菜炖汤',     type:'good',
    desc:'采了一把野菜，用石锅炖了碗清汤。',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const f = pool.safe[Math.floor(Math.random()*pool.safe.length)]; return useForageItem(f, true) + '；又用泉水炖了汤，口渴+15'; } },
  { icon:'🫙', title:'发现储水',    type:'great',
    desc:'山壁凹陷处积了一洼雨水，竟还算清澈。',
    narrFn(){ return useForageItem({ icon:'💧', name:'山壁雨水', effect:{ water:35 } }, true); } },

  // ── 普通事件 ──
  { icon:'🍖', title:'消耗干粮',     type:'normal',
    desc:'肚子饿了，取出背包里的干粮充饥。',
    narrFn(){ return consumeFromBag('food'); } },
  { icon:'🍵', title:'饮水解渴',     type:'normal',
    desc:'口渴难耐，打开水囊喝了几口。',
    narrFn(){ return consumeFromBag('water'); } },
  { icon:'🍙', title:'省吃俭用',     type:'normal',
    desc:'将干粮省着吃，分作两顿。',
    narrFn(){ const food = travelPlayerState.food ?? 100; travelPlayerState.food = Math.min(100, food + 8); travelSave(); return '饱食+8（省下了一半）'; } },
  { icon:'💧', title:'小憩饮水',     type:'normal',
    desc:'找了处阴凉地歇脚，抿了几口水润唇。',
    narrFn(){ const water = travelPlayerState.water ?? 100; travelPlayerState.water = Math.min(100, water + 12); travelSave(); return '口渴+12'; } },
  { icon:'🍜', title:'路旁快餐',     type:'normal',
    desc:'路过一个小村落，花几文钱买了碗热粥。',
    narrFn(){ travelPlayerState.food = Math.min(100, (travelPlayerState.food ?? 50) + 20); travelSave(); return '饱食+20（花钱买的）'; } },
  { icon:'🏚️', title:'荒屋搜刮',     type:'normal',
    desc:'一座废弃荒屋中找到些陈年干粮。',
    narrFn(){ const food = travelPlayerState.food ?? 50; travelPlayerState.food = Math.min(100, food + 15); travelSave(); return '饱食+15（陈粮，略带霉味）'; } },

  // ── 坏事件 ──
  { icon:'🍄', title:'误食毒菇',     type:'bad',
    desc:'见路旁野菇颜色鲜艳，采而食之……',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const b = pool.risky[Math.floor(Math.random()*pool.risky.length)]; return useForageItem(b, false); } },
  { icon:'🤢', title:'饮水不适',     type:'bad',
    desc:'饮了几口溪水，腹中翻涌……',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const w = pool.badWater[Math.floor(Math.random()*pool.badWater.length)]; return useForageItem(w, false); } },
  { icon:'🍱', title:'干粮告罄',    type:'bad',
    desc:'背包空空，饥肠辘辘，勉强撑过一日。',
    narrFn(){ return starveDay(); } },
  { icon:'🦎', title:'被毒虫咬',     type:'bad',
    desc:'草丛中钻出一条毒蜈蚣，咬伤小腿。',
    narrFn(){ if(typeof edS !== 'undefined'){ edS.hp = Math.max(1, (edS.hp||50) - 20); edS.detox = (edS.detox||0) - 1; } travelPlayerState.hp = Math.max(1, (travelPlayerState.hp||50) - 15); travelSave(); return '气血-15，中了蜈蚣毒！'; } },
  { icon:'🌧️', title:'淋雨受寒',    type:'bad',
    desc:'暴雨突至，淋成落汤鸡，连打个喷嚏。',
    narrFn(){ const food = travelPlayerState.food ?? 50; const water = travelPlayerState.water ?? 50; travelPlayerState.food = Math.max(0, food - 8); travelPlayerState.water = Math.max(0, water - 8); travelSave(); return '淋雨受寒，饱食-8，口渴-8'; } },
  { icon:'🔥', title:'火种熄灭',     type:'bad',
    desc:'连日阴雨，火种熄了，只能吃冷食。',
    narrFn(){ travelPlayerState.food = Math.max(0, (travelPlayerState.food ?? 50) - 10); travelSave(); return '冷食难以下咽，饱食-10'; } },
  { icon:'🐺', title:'野兽惊扰',     type:'bad',
    desc:'夜半被狼嚎惊醒，慌乱中遗落了些干粮。',
    narrFn(){ if(typeof consumableBagConsume === 'function'){ const bag = consumableBagLoad(); const food = bag.find(e=>e.effect?.food); if(food) consumableBagConsume(food.id, 1); } travelPlayerState.food = Math.max(0, (travelPlayerState.food ?? 50) - 15); travelSave(); return '惊惶逃窜，干粮洒落，饱食-15'; } },
  { icon:'🌵', title:'误食沙漠果',  type:'bad',
    desc:'沙漠中见到红色果子，误以为可食……',
    narrFn(){ travelPlayerState.food = Math.max(0, (travelPlayerState.food ?? 50) + 5); travelPlayerState.water = Math.max(0, (travelPlayerState.water ?? 50) - 20); if(typeof edS !== 'undefined'){ edS.hp = Math.max(1, (edS.hp||50) - 10); } travelSave(); return '越吃越渴，气血-10！'; } },
  { icon:'🍖', title:'干粮腐坏',    type:'bad',
    desc:'干粮保存不当，已经发霉变质，只能扔掉。',
    narrFn(){ if(typeof consumableBagConsume === 'function'){ const bag = consumableBagLoad(); const food = bag.find(e=>e.effect?.food); if(food) consumableBagConsume(food.id, 1); } return '背包中的干粮已腐坏，丢弃了1份'; } },
  { icon:'🌊', title:'渡口断水',    type:'bad',
    desc:'渡口处水井干涸，好不容易找到的水又苦又咸。',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const w = pool.badWater[Math.floor(Math.random()*pool.badWater.length)]; return useForageItem(w, false); } },

  // ── 中性/特殊 ──
  { icon:'🍲', title:'野炊烹饪',     type:'normal',
    desc:'就地取材生火，做了一顿野炊。',
    narrFn(terrain){ const pool = getTerrainForagePool(terrain); const f = pool.safe[Math.floor(Math.random()*pool.safe.length)]; return useForageItem(f, false) + '；又喝了山泉，口渴+20'; } },
  { icon:'💰', title:'路遇商队',    type:'normal',
    desc:'偶遇一队行商，换了些干粮。',
    narrFn(){ if(typeof consumableBagAdd === 'function'){ consumableBagAdd({ id:'item_journey_ration', name:'旅途干粮', icon:'🥖', desc:'换来的干粮', effect:{ food:35 } }, 2); } return '💰 用银两换了2份旅途干粮，已放入背包'; } },
  { icon:'🗺️', title:'发现药草',    type:'good',
    desc:'路旁一株不知名草药，顺手采了。',
    narrFn(){ if(typeof consumableBagAdd === 'function'){ consumableBagAdd({ id:'item_wild_herb', name:'野山参', icon:'🌿', desc:'野外采的草药', effect:{ hp:25 } }, 1); } return '🌿 采得【野山参】×1，已放入背包'; } },
  { icon:'🐴', title:'蹭车同行',     type:'great',
    desc:'遇到好心商队，搭了一段骡车，省了不少脚力。',
    narrFn(){ travelPlayerState.energy = Math.min(120, (travelPlayerState.energy ?? 80) + 15); travelPlayerState.food = Math.min(100, (travelPlayerState.food ?? 50) + 10); travelSave(); return '精力+15，饱食+10（蹭车省脚力）'; } },
  { icon:'😵', title:'体力透支',    type:'bad',
    desc:'连日赶路，精疲力竭，晕倒在路旁……',
    narrFn(){ travelPlayerState.energy = 0; travelPlayerState.hp = Math.max(1, (travelPlayerState.hp ?? 50) - 15); travelSave(); return '精力耗尽，昏厥片刻，气血-15'; } },
  { icon:'☀️', title:'烈日酷暑',    type:'normal',
    desc:'烈日当空，口干舌燥，汗如雨下。',
    narrFn(){ travelPlayerState.water = Math.max(0, (travelPlayerState.water ?? 50) - 15); travelSave(); return '烈日暴晒，口渴-15'; } },
  { icon:'🧘', title:'打坐凝神',     type:'good',
    desc:'借一段休息时间打坐，内力缓缓恢复。',
    narrFn(){ if(typeof edS !== 'undefined') edS.mp = Math.min(edS.maxMp||100, (edS.mp||0) + 15); travelPlayerState.energy = Math.min(120, (travelPlayerState.energy ?? 80) + 10); travelSave(); return '内力+15，精力+10'; } },
];

// 根据当前地形返回适合的野外采集池
function getTerrainForagePool(terrain){
  const safeBase  = JNY_FORAGE_POOL.safe;
  const riskyBase = JNY_FORAGE_POOL.risky;
  const waterBase  = JNY_FORAGE_POOL.water;
  const badWater   = JNY_FORAGE_POOL.badWater;
  // 各地形特色野外食物
  const terrainBonus = {
    '平原':    [{ icon:'🌾', name:'田边野菜',    desc:'田埂边挖的野菜',   effect:{ food:15 } }],
    '山地':    [{ icon:'🌰', name:'野栗子',      desc:'山坡上的野栗子树', effect:{ food:20 } }],
    '高山':    [{ icon:'🍃', name:'高山雪茶',    desc:'高寒地带特有茶种', effect:{ food:12, water:25 } }],
    '水乡':    [{ icon:'🐟', name:'河鲜',        desc:'河道里顺手捉的鱼', effect:{ food:30, hp:10 } }],
    '湖泊':    [{ icon:'🐚', name:'湖滨螺蛳',    desc:'湖边摸的螺蛳',    effect:{ food:22, water:8 } }],
    '森林':    [{ icon:'🍄', name:'林下蘑菇',    desc:'林间蘑菇丛',     effect:{ food:18 } }, { icon:'🍯', name:'野蜂蜜',    desc:'树上蜂巢',     effect:{ food:25, hp:10 } }],
    '沙漠':    [{ icon:'🌵', name:'沙漠仙人掌',  desc:'口渴时挤出汁液', effect:{ food:10, water:20 } }],
    '戈壁':    [{ icon:'🌿', name:'干枯草根',    desc:'勉强可食',       effect:{ food:8 } }],
    '海滨':    [{ icon:'🦀', name:'礁石蟹',      desc:'海边礁石缝里摸的', effect:{ food:25, water:10 } }],
    '草原':    [{ icon:'🌿', name:'肥美牧草尖',  desc:'鲜嫩草尖',       effect:{ food:15 } }],
    '沼泽':    [{ icon:'🐸', name:'沼泽田鸡',    desc:'踩草时顺手捉的', effect:{ food:20, hp:-5 } }],
    '冰原':    [{ icon:'🧊', name:'冰块',         desc:'含而化之，勉强解渴', effect:{ water:15, food:5 } }],
  };
  const extra = terrainBonus[terrain] || [];
  return {
    safe:    [...safeBase, ...extra],
    risky:   riskyBase,
    water:   waterBase,
    badWater: badWater,
  };
}

// 使用一份采集/饮水物品
function useForageItem(item, isGood){
  if(!item) return '';
  const ef = item.effect || {};
  let msg = `${item.icon} 食用了【${item.name}】`;
  if(ef.food){
    travelPlayerState.food = Math.min(100, Math.max(0, (travelPlayerState.food ?? 50) + ef.food));
    msg += `，饱食+${ef.food}`;
  }
  if(ef.water){
    travelPlayerState.water = Math.min(100, Math.max(0, (travelPlayerState.water ?? 50) + ef.water));
    msg += `，口渴+${ef.water}`;
  }
  if(ef.hp){
    travelPlayerState.hp = Math.min(100, Math.max(0, (travelPlayerState.hp ?? 50) + ef.hp));
    msg += `，气血${ef.hp > 0 ? '+' : ''}${ef.hp}`;
  }
  if(ef.detox === -1){
    msg += `，${item.poisonDesc || '中了毒！'}`;
    travelPlayerState.detox = (travelPlayerState.detox || 0) - 1;
    if(typeof edS !== 'undefined'){
      edS.detox = (edS.detox || 0) - 1; // 累积中毒层数
      edS.hp = Math.max(1, (edS.hp || 50) - 15);
    }
  }
  // 使用防抖存档，避免频繁写入
  if (typeof _travelSaveDebounced === 'function') {
    _travelSaveDebounced();
  } else {
    travelSave();
  }
  return msg;
}

// 从背包消耗食物（返回叙事文字）
function consumeFromBag(type){
  const bag = (typeof consumableBagLoad === 'function') ? consumableBagLoad() : [];
  const consumable = bag.find(e => e.effect && e.effect[type]);
  if(consumable){
    const ef = consumable.effect || {};
    if(type === 'food' && ef.food){
      travelPlayerState.food = Math.min(100, Math.max(0, (travelPlayerState.food ?? 50) + ef.food));
      msg = `${consumable.icon} 吃下【${consumable.name}】，饱食+${ef.food}`;
    } else if(type === 'water' && ef.water){
      travelPlayerState.water = Math.min(100, Math.max(0, (travelPlayerState.water ?? 50) + ef.water));
      msg = `${consumable.icon} 饮下【${consumable.name}】，口渴+${ef.water}`;
    }
    if(typeof consumableBagConsume === 'function') consumableBagConsume(consumable.id, 1);
    // 使用防抖存档
    if (typeof _travelSaveDebounced === 'function') {
      _travelSaveDebounced();
    } else {
      travelSave();
    }
    return msg;
  }
  
  // 背包没有时，野外采集/找水 - 但有风险！（受黄历影响）
  // 计算黄历修正
  let badEventMod = 1.0;
  if (typeof getAlmanacModifier === 'function' && typeof edS !== 'undefined') {
    badEventMod = getAlmanacModifier(edS, 'bad'); // 凶日增加坏事件概率
  }
  
  if (type === 'food') {
    // 基础20%概率吃到毒果，受黄历修正（凶日更高，吉日更低）
    const poisonProb = 0.20 * badEventMod;
    if (Math.random() < poisonProb) {
      const poisonItems = [
        { icon: '☠️', name: '毒蘑菇', desc: '颜色鲜艳的毒菇', effect: { food: 5, hp: -15 }, poisonDesc: '中毒了！气血-15' },
        { icon: '🤢', name: '腐坏野果', desc: '已经腐烂的果子', effect: { food: 3, hp: -10 }, poisonDesc: '吃坏了肚子！气血-10' },
        { icon: '😵', name: '毒浆果', desc: '看似美味实则有毒', effect: { food: 8, hp: -20 }, poisonDesc: '中毒晕眩！气血-20' }
      ];
      const poison = poisonItems[Math.floor(Math.random() * poisonItems.length)];
      return useForageItem(poison, false) + ' 💀（野外觅食有风险！）';
    }
    // 正常食物
    const f = JNY_FORAGE_POOL.safe[Math.floor(Math.random()*JNY_FORAGE_POOL.safe.length)];
    return useForageItem(f, false);
  } else {
    // 基础25%概率喝到脏水，受黄历修正
    const badWaterProb = 0.25 * badEventMod;
    if (Math.random() < badWaterProb) {
      const badWaterItems = [
        { icon: '🤮', name: '污浊泥水', desc: '浑浊的积水', effect: { water: 10, hp: -12 }, poisonDesc: '喝坏了肚子！气血-12' },
        { icon: '💀', name: '死水', desc: ' stagnant 的臭水', effect: { water: 15, hp: -18 }, poisonDesc: '中毒了！气血-18' },
        { icon: '😷', name: '带虫污水', desc: '有寄生虫的水', effect: { water: 8, hp: -10 }, poisonDesc: '感染寄生虫！气血-10' }
      ];
      const badWater = badWaterItems[Math.floor(Math.random() * badWaterItems.length)];
      return useForageItem(badWater, false) + ' 💀（野外水源有风险！）';
    }
    // 正常水源
    const w = JNY_FORAGE_POOL.water[Math.floor(Math.random()*JNY_FORAGE_POOL.water.length)];
    return useForageItem(w, false);
  }
}

// 扎营休整（干粮+休息，恢复饥渴）
function campRest(){
  let msg = '🏕️ 扎营休整，饱食+25，口渴+30';
  travelPlayerState.food  = Math.min(100, (travelPlayerState.food  ?? 50) + 25);
  travelPlayerState.water = Math.min(100, (travelPlayerState.water ?? 50) + 30);
  travelSave();
  return msg;
}

// 挨饿一天（无食物可吃，饥渴度持续下降后额外惩罚）
function starveDay(){
  let msg = '⚠️ 干粮告罄，饥肠辘辘。';
  travelPlayerState.food  = Math.max(0, (travelPlayerState.food  ?? 0) - 20);
  travelPlayerState.water = Math.max(0, (travelPlayerState.water ?? 0) - 15);
  travelPlayerState.hp    = Math.max(1, (travelPlayerState.hp    ?? 50) - 10);
  travelSave();
  return msg;
}

// ── 日志推送（可被 fireDayHungerEvent 调用）───────────────────────
function pushLog(text, type){
  const body = document.getElementById('jnyLogBody');
  if(!body) return;
  const line = document.createElement('div');
  line.className = 'jny-log-line jny-log-' + (type || 'narr');
  line.textContent = text;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}
// 兼容旧调用
const pushNarr = (text) => pushLog(text, 'narr');

// 触发每日旅途饥渴事件（支持黄历吉凶修正）
function fireDayHungerEvent(terrain){
  // 优先检查是否饱食/口渴状态良好（40%概率跳过）
  const food  = travelPlayerState.food  ?? 100;
  const water = travelPlayerState.water ?? 100;
  
  // 应用黄历修正：吉日更容易跳过（好事不用触发），凶日更难跳过
  let skipProb = 0.4;
  if (typeof getAlmanacModifier === 'function' && typeof edS !== 'undefined') {
    skipProb *= getAlmanacModifier(edS, 'good'); // 吉日skipProb增加，凶日减少
  }
  
  if(food > 60 && water > 60 && Math.random() < skipProb) return; // 状态好，不触发

  // 根据当前饥渴状态调整事件概率
  let badChance = (food < 30 || water < 20) ? 0.5 : 0.3;
  let goodChance = (food > 50 && water > 50) ? 0.3 : 0.15;
  
  // 应用黄历修正
  if (typeof getAlmanacModifier === 'function' && typeof edS !== 'undefined') {
    const goodMod = getAlmanacModifier(edS, 'good');
    const badMod = getAlmanacModifier(edS, 'bad');
    // 吉日：badChance降低，goodChance增加
    badChance *= badMod;
    goodChance *= goodMod;
  }

  // 权重选择事件类型
  let candidates;
  const roll = Math.random();
  if(roll < badChance){
    // 坏状态：更容易触发负面事件
    candidates = JNY_HUNGER_EVENTS.filter(e => e.type === 'bad' || e.type === 'normal');
  } else if(roll < badChance + goodChance){
    // 好状态：更容易触发好事件
    candidates = JNY_HUNGER_EVENTS.filter(e => e.type === 'good' || e.type === 'great' || e.type === 'normal');
  } else {
    candidates = JNY_HUNGER_EVENTS;
  }

  const ev = candidates[Math.floor(Math.random() * candidates.length)];
  const resultText = ev.narrFn ? ev.narrFn(terrain || '平原') : '';
  const typeMap = { good:'event-good', great:'event-great', bad:'event-bad', normal:'event-normal' };
  pushLog(`${ev.icon} 【${ev.title}】${ev.desc}${resultText ? '　→ ' + resultText : ''}`, typeMap[ev.type] || 'event-normal');
}

// 导出到全局
window.JNY_FORAGE_POOL = JNY_FORAGE_POOL;
window.consumeFromBag = consumeFromBag;
window.fireDayHungerEvent = fireDayHungerEvent;

function journeyStart(fromId, destId, onComplete){
  const fromNode = WORLD_NODES[fromId];
  const destNode  = WORLD_NODES[destId];
  if(!fromNode || !destNode) { onComplete && onComplete(); return; }

  const timeInfo = travelCalcTime(fromId, destId);
  // 有坐骑（永久或租马）就用 horseDays，否则 footDays（与 travel.js 保持一致）
  const hasAnyMount = !!(timeInfo.rentMount || (typeof edS !== 'undefined' && edS.horseId && HORSE_BREEDS[edS.horseId]));
  const hasHorse = !!(typeof edS !== 'undefined' && edS.horseId && HORSE_BREEDS[edS.horseId]);
  const breed    = hasHorse ? HORSE_BREEDS[edS.horseId] : null;
  const days     = hasAnyMount ? timeInfo.horseDays : timeInfo.footDays;
  const distLi   = timeInfo.distLi;

  // ── 四季初始化（新存档默认第1月，后续累计月份随行程推进） ──
  // 注意：gameMonth 现在由 origin-generator.js 统一初始化为 1
  if(typeof edS !== 'undefined' && !edS.gameMonth) edS.gameMonth = 1;
  const jnySeason   = (typeof edS !== 'undefined' && SEASON_MAP[edS.gameMonth]) || 'spring';
  const jnySeasonInfo = SEASON_INFO[jnySeason];

  // 行程结束后月份推进（多天旅途约推进0~1个月）
  const monthAdvance = days > 20 ? 1 : (days > 8 ? (Math.random() < .5 ? 1 : 0) : 0);

  // ── 天气随机（出发时决定，整段旅途固定，雪天只在冬季或高山） ──
  let weatherPool = [...jnySeasonInfo.weatherPool];
  // 冰原/高山强制雪天概率更高
  if(fromNode.terrain === '冰原' || destNode.terrain === '冰原'){
    weatherPool = ['snow','snow','snow','wind','cloudy','sunny'];
  } else if(fromNode.terrain === '高山' || destNode.terrain === '高山'){
    if(jnySeason==='winter') weatherPool = ['snow','snow','wind','cloudy','sunny','mist'];
  }
  // 沙漠无雨无雪
  if(fromNode.terrain === '沙漠绿洲' || destNode.terrain === '沙漠绿洲'){
    weatherPool = ['sunny','sunny','sunny','wind','wind','cloudy'];
  }
  const jnyWeatherId = weatherPool[Math.floor(Math.random() * weatherPool.length)];
  const jnyWeather   = WEATHER_DEF[jnyWeatherId] || WEATHER_DEF.sunny;

  // 记录当前旅途地形，供野外遭遇战使用
  if(typeof window !== 'undefined'){
    window._travelCurrentTerrain = fromNode.terrain || '平原';
  }

  // 叙事文字池（出发+目的地各取一组，混合）
  const narrFrom = jnyGetNarr(fromNode.terrain);
  const narrDest = jnyGetNarr(destNode.terrain);
  const narrAll  = [...narrFrom, ...narrDest].sort(()=>Math.random()-.5);

  // ── 创建覆盖层DOM ──
  const overlay = document.createElement('div');
  overlay.className = 'journey-overlay';

  // 状态栏
  const modeStr = breed
    ? `${breed.icon} <span style="color:${breed.color}">${breed.name}</span>`
    : '🚶 步行';
  const timeStr = fmtDays(days);
  overlay.innerHTML = `
    <div class="jny-topbar">
      <div class="jny-from-to">${fromNode.icon} ${fromNode.name} → ${destNode.icon} ${destNode.name}</div>
      <span class="jny-horse-tag">${modeStr}</span>
      <span class="jny-stat">📏 ${distLi}里</span>
      <span class="jny-stat">⏳ ${timeStr}</span>
      <span class="jny-stat" id="jnyFoodTag">🍚 ${travelPlayerState.food ?? 100}</span>
      <span class="jny-stat" id="jnyWaterTag">💧 ${travelPlayerState.water ?? 100}</span>
      <button class="jny-skip-btn" onclick="if(window._jnySkip) window._jnySkip();">⏭ 跳过</button>
    </div>
    <div class="jny-scene" id="jnyScene">
      <div class="jny-sky-tint" id="jnySkyTint"></div>
      <div class="jny-ascii-canvas" id="jnyAsciiCanvas">
        <canvas id="jnyParticleCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.35;"></canvas>
        <div class="jny-sky" id="jnySky"></div>
        <div class="jny-mountains" id="jnyMountains"></div>
        <div class="jny-ground-wrap" id="jnyGroundWrap">
          <div class="jny-horizon" id="jnyHorizon"></div>
          <div class="jny-bg-scroll" id="jnyBgScroll"></div>
          <div class="jny-fg-scroll" id="jnyFgScroll"></div>
        </div>
      </div>
      <div class="jny-player" id="jnyPlayer"></div>
      <div class="jny-progress-wrap">
        <div class="jny-prog-label">
          <span id="jnySegLabel">出发</span>
          <span id="jnyTimeLabel" style="color:rgba(200,220,160,.8);font-size:10px;">卯时</span>
          <span id="jnyWeatherLabel" style="color:rgba(200,220,180,.75);font-size:10px;">${jnySeasonInfo.icon}${jnySeasonInfo.label} ${jnyWeather.icon}${jnyWeather.label}</span>
          <span id="jnyDistLabel">0 / ${distLi}里</span>
        </div>
        <div class="jny-prog-bar"><div class="jny-prog-fill" id="jnyProgFill" style="width:0%"></div></div>
      </div>
    </div>
    <div class="jny-log-panel" id="jnyLogPanel">
      <div class="jny-log-title">📜 行程日志</div>
      <div class="jny-log-body" id="jnyLogBody"></div>
    </div>`;
  document.body.appendChild(overlay);

  // ── 动画状态 ──
  let playerTimer  = null;
  let groundOffset = 0;
  let groundTimer  = null;


  // ── 天空字符画配置 ──
  // body: 太阳/月亮字符画（右上角，唯一）
  // clouds: 云朵行（单份，CSS拼双份无缝漂移）
  // bg: 背景底色（天空颜色）
  // fall: 飘落层（雪花/花瓣，可选）
  const SKY_ART = {
    day_plain: {
      body:   '  ( )\n (' + ' ☀' + ' )\n  ( )',
      bodyColor: '#ffe066',
      clouds: '                     (~~~)                                                    (~~~)\n' +
              '          (~~~~~)  (~~~~~~)       (~~~~~)                      (~~~~)       (~~~~~~~~)\n' +
              ' (~~~~~)  (~~~~~~)  (~~~)  (~~~~~) (~~~~)    (~~~~~~~)  (~~~~~)(~~~~~)       (~~~~) ',
      cloudColor: 'rgba(255,255,220,0.38)',
      bgColor:    'rgba(30,90,160,0.0)',
    },
    day_cloud: {
      body:   '  ( )\n (' + ' ☀' + ' )\n  ( )',
      bodyColor: '#ffe066',
      clouds: '        (~~~~~~~~)                                 (~~~~~~~~~)                      \n' +
              '  (~~~~)(~~~~~~~~~~)   (~~~~~~)      (~~~~~)     (~~~~~~~~~~~)  (~~~~~~)            \n' +
              ' (~~~~~)(~~~~~~~~)  (~~~~~~~~~~) (~~~~~~~~~)      (~~~~~~~~)  (~~~~~~~~~~)  (~~~~~~)',
      cloudColor: 'rgba(240,248,255,0.45)',
      bgColor:    'rgba(30,80,150,0.0)',
    },
    eve: {
      body:   ' \\ | /\n  (☀)\n / | \\',
      bodyColor: '#ff8c00',
      clouds: '                   (~~~)                                              (~~~~)       \n' +
              '       (~~~~~~)  (~~~~~)      (~~~~~)                  (~~~~~~)      (~~~~~)       \n' +
              ' (~~~~)(~~~~~~)   (~~~) (~~~~~)(~~~~)      (~~~~~~)    (~~~~~~) (~~~~)(~~~~)       ',
      cloudColor: 'rgba(255,160,80,0.45)',
      bgColor:    'rgba(0,0,0,0)',
    },
    night: {
      body:   '  /)\n ( ☾\n  \\)',
      bodyColor: '#d0e8ff',
      clouds: ' ·  ★  ·    ·   ★    ·    ★  ·    ★    ·   ·    ★    ·   ★  ·    ★    ·   ·    ★  \n' +
              '★    ·   ★   ·    ★   ·  ★    ·  ★    ·   ★    ·   ★    ·  ★    ·   ★    ·   ★   ·\n' +
              ' ·  ★  · ★ · ★  ·  ★ ·  ★ ·   ★   · ★ ·  ★  · ★  ·  ★  · ★   ·  ★  · ★  ·  ★  ·',
      cloudColor: 'rgba(180,210,255,0.55)',
      bgColor:    'rgba(0,0,0,0)',
    },
    fairy: {
      body:   '  * *\n *❄* *\n  * *',
      bodyColor: '#b0e0ff',
      clouds: '          *    *      *        *     *         *      *    *       *     *         *\n' +
              '  *  ❄  *   *   (~~~)  *  ❄  *   *   *  ❄  *    *  (~~~) *  ❄  *   *   *   ❄   * \n' +
              '*   *  (~~~)  *   *  *   *  (~~~)   *   *  *  (~~~)  *  *   * (~~~)  *   *  (~~~) ',
      cloudColor: 'rgba(200,230,255,0.5)',
      bgColor:    'rgba(0,0,0,0)',
      fall: '❄', fallType: 'snow',
      fallColor: 'rgba(200,230,255,0.55)',
    },
    forest: {
      body:   ' ( ☀ )\n  | |\n  | |',
      bodyColor: '#aadd44',
      clouds: '  ·  ·    ·   ✿   ·     ·   ✿    ·    ✿   ·    ·   ✿    ·    ·   ✿    ·    ·   ✿ \n' +
              '✿    ·   ✿    ·   ✿    ·   ✿   ·   ✿    ·   ✿    ·    ✿    ·   ✿    ·    ✿    ·  \n' +
              ' ·  ✿  ·  ✿  ·  ✿  ·   ✿  ·  ✿  ·  ✿  ·   ✿  ·  ✿  ·   ✿  ·  ✿  ·   ✿  ·  ✿  ',
      cloudColor: 'rgba(100,220,100,0.4)',
      bgColor:    'rgba(0,0,0,0)',
      fall: '✿', fallType: 'leaf',
      fallColor: 'rgba(255,180,200,0.5)',
    },
    desert: {
      body:   '\\  |  /\n  ☀\n/  |  \\',
      bodyColor: '#ffcc00',
      clouds: '                                                                                   \n' +
              '       (~)            (~)                  (~)           (~)                      \n' +
              ' (~)        (~)             (~)   (~)           (~)             (~)         (~)   ',
      cloudColor: 'rgba(255,220,120,0.35)',
      bgColor:    'rgba(0,0,0,0)',
    },
    snow: {
      body:   '  /)\n ( ☾\n  \\)',
      bodyColor: '#c0d8ff',
      clouds: '        (~~~~~)                   (~~~~~)              (~~~~~)                    \n' +
              '  (~~~~)(~~~~~~) (~~~~~)    (~~~~)(~~~~~~)  (~~~~~)(~~~~)(~~~~~~)  (~~~~~)         \n' +
              ' (~~~~~)(~~~~~) (~~~~~~~) (~~~~~)(~~~~~)  (~~~~~~~)(~~~~)(~~~~~) (~~~~~~~)(~~~~~) ',
      cloudColor: 'rgba(200,230,255,0.5)',
      bgColor:    'rgba(0,0,0,0)',
      fall: '❄', fallType: 'snow',
      fallColor: 'rgba(220,240,255,0.7)',
    },
  };

  // ── 渲染天空字符画（crossfade 无缝切换） ──
  // 新层淡入同时旧层淡出，视觉完全连续
  let _skyFadeTimer = null;


  function buildSkyLayer(art, skyType){
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;inset:0;transition:opacity .7s ease;opacity:0;pointer-events:none;';

    // 天体（太阳/月亮）不放在 crossfade 层，由固定 div 承载
    if(art.clouds){
      const cloudEl = document.createElement('div');
      cloudEl.className = 'jny-sky-clouds';
      cloudEl.textContent = art.clouds + art.clouds;
      cloudEl.style.color = art.cloudColor || 'rgba(255,255,255,0.4)';
      if(skyType === 'night') cloudEl.style.animationDuration = '60s';
      wrap.appendChild(cloudEl);
    }
    // fall 层不放在天空容器内（会被 overflow:hidden 裁剪），由 updateFallLayer() 独立管理
    return wrap;
  }

  // ── 全屏飘落层（雨/雪/黄沙/落叶）——挂在 jnyAsciiCanvas 上，不受天空高度限制 ──
  // 单 div 高度200%，translateY(0→-50%) 无缝循环；内容随机稀疏，两份完全相同拼接

  function _genFallContent(fallType, seed, extraChars){
    // 按 fallType 设定字符集、每行密度
    const FALL_CONFIG = {
      rain:  { chars:['|','|','|','|','¦','|'], perRow:7,  dur:'12s' },
      snow:  { chars:['❄','*','·','❄','·'],    perRow:4,  dur:'20s' },
      leaf:  { chars:['~','·','∼','~','·'],     perRow:3,  dur:'22s' },
      sand:  { chars:['·','.','·','.','·'],     perRow:5,  dur:'14s' },
    };
    const cfg = FALL_CONFIG[fallType] || FALL_CONFIG.snow;
    // 如果外部传了字符（如 ✿ 或 🍂），混入字符集增加多样性
    const chars = extraChars ? [...cfg.chars, ...extraChars, '·', '·'] : cfg.chars;
    const COLS = 80; // 每行字符宽度
    // 动态计算行数：确保单份内容高度 >= jnyScene 实际高度（font 13px line-height 1.6 ≈ 20.8px/行）
    const sceneH = (document.getElementById('jnyScene') || {offsetHeight: 600}).offsetHeight || 600;
    const lineH = 13 * 1.6; // ≈ 20.8px
    const rows = Math.ceil(sceneH / lineH) + 4; // 多留4行余量

    // 用 seeded 伪随机（固定 seed 保证每次旅行同一天气图案一致）
    let s = (seed || 42) & 0xffff;
    const rng = () => { s = (s * 16807 + 7) & 0xffff; return s / 0xffff; };

    let half = '';
    for(let r = 0; r < rows; r++){
      const line = new Array(COLS).fill(' ');
      const count = Math.max(1, Math.round(cfg.perRow * (0.4 + rng() * 1.2))); // 密度随机±60%
      for(let i = 0; i < count; i++){
        const pos = Math.floor(rng() * COLS);
        const ch = chars[Math.floor(rng() * chars.length)];
        line[pos] = ch;
      }
      half += line.join('') + '\n';
    }
    // 两份内容拼接（配合 CSS height:200%，translateY(50%) 无缝循环）
    return { content: half + half, dur: cfg.dur };
  }

  function updateFallLayer(art){
    // 挂在 jnyScene 上：scene = 整个行路画面，overflow:hidden 做边界，百分比基于 scene 高度
    const canvas = document.getElementById('jnyScene') || document.getElementById('jnyAsciiCanvas');
    if(!canvas) return;
    // 移除旧 fall 层（scene 和 canvas 里都清一遍）
    document.querySelectorAll('.jny-sky-fall').forEach(el => el.remove());

    if(!art || !art.fall) return; // 无 fall 则清空

    // 从 art 里解析 fallType（rain/snow/leaf/sand），没有则 fallback 解析字符
    const fallType = art.fallType || (art.fall.includes('|') ? 'rain' :
                     art.fall.includes('❄') ? 'snow' :
                     art.fall.includes('✿') ? 'leaf' : 'sand');

    // 从 art.fall 提取额外装饰字符（如 ✿、🍂 等）
    const extraChar = art.fall.trim().length === 1 && art.fall.trim() !== '|' && art.fall.trim() !== '·'
                      ? [art.fall.trim()] : null;

    // seed 取 fallType 字符哈希，保证同一天气图案稳定
    const seed = (fallType.charCodeAt(0) * 317 + (fallType.charCodeAt(1) || 0) * 13) & 0xffff;
    const { content, dur } = _genFallContent(fallType, seed, extraChar);

    const fallEl = document.createElement('div');
    fallEl.className = 'jny-sky-fall';
    fallEl.textContent = content;
    fallEl.style.color = art.fallColor || 'rgba(255,255,255,0.6)';
    fallEl.style.setProperty('--fall-dur', dur);
    canvas.appendChild(fallEl);
  }

  // 初始化天空固定天体 div（太阳+月亮，不参与 crossfade）
  function initCelestialDivs(){
    const skyEl = document.getElementById('jnySky');
    if(!skyEl || document.getElementById('jnySun')) return;

    const sunEl = document.createElement('div');
    sunEl.id = 'jnySun';
    sunEl.className = 'jny-sky-body';
    sunEl.dataset.celestial = 'sun';
    sunEl.textContent = '  ( )\n (' + ' ☀' + ' )\n  ( )';
    sunEl.style.color   = '#ffe066';
    sunEl.style.left    = '85%';
    sunEl.style.bottom  = '10%';
    sunEl.style.opacity = '1';
    sunEl.style.zIndex  = '5';
    skyEl.appendChild(sunEl);

    const moonEl = document.createElement('div');
    moonEl.id = 'jnyMoon';
    moonEl.className = 'jny-sky-body';
    moonEl.dataset.celestial = 'moon';
    moonEl.textContent = ' (  )\n( 🌙 )\n (  )';
    moonEl.style.color   = '#d0e8ff';
    moonEl.style.left    = '82%';
    moonEl.style.bottom  = '10%';
    moonEl.style.opacity = '0';
    moonEl.style.zIndex  = '5';
    skyEl.appendChild(moonEl);
  }

  function spawnSkyParticles(skyType, _sceneColor){
    const skyEl = document.getElementById('jnySky');
    if(!skyEl) return;

    // 四季+天气对 fall 层的覆盖：天气有 fallType 优先，否则按季节补充
    let artOverride = null;
    const wFall = activeWeather ? activeWeather.fallType : null;
    if(wFall === 'rain'){
      // 已在 SKY_ART.rain/thunder 里带 fall，不需要额外覆盖

    } else if(wFall === 'snow'){
      // 已在 SKY_ART.snow 里带 fall
    } else if(wFall === 'leaf'){
      // 秋风落叶
      artOverride = { fall: '~', fallType: 'leaf', fallColor: 'rgba(200,120,40,0.5)' };
    } else if(jnySeason === 'spring' && (skyType === 'day_plain' || skyType === 'forest') && activeWeatherId === 'sunny'){
      // 春季晴天：樱花花瓣飘落
      artOverride = { fall: '✿', fallType: 'leaf', fallColor: 'rgba(255,180,210,0.5)' };
    }


    const baseArt = SKY_ART[skyType] || SKY_ART.day_plain;
    // 合并 override（只覆盖 fall/fallColor）
    const art = artOverride ? Object.assign({}, baseArt, artOverride) : baseArt;

    // ── 全屏飘落层独立管理（不在天空容器内，不受 overflow:hidden 裁剪） ──
    updateFallLayer(art);

    // 新层先透明叠入（仅云朵/背景，fall已独立处理）
    const newLayer = buildSkyLayer(art, skyType);
    skyEl.appendChild(newLayer);

    // 旧层们开始淡出（保留天体 div）
    Array.from(skyEl.children).forEach(child => {
      if(child !== newLayer && child.id !== 'jnySun' && child.id !== 'jnyMoon') {
        child.style.transition = 'opacity .7s ease';
        child.style.opacity = '0';
      }
    });

    // 新层淡入
    if(_skyFadeTimer) clearTimeout(_skyFadeTimer);
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{ newLayer.style.opacity = '1'; });
    });

    // 旧层淡出完成后删除（保留天体 div #jnySun/#jnyMoon）
    _skyFadeTimer = setTimeout(()=>{
      Array.from(skyEl.children).forEach(child => {
        if(child !== newLayer && child.id !== 'jnySun' && child.id !== 'jnyMoon') child.remove();
      });
    }, 800);
  }

  // ── 地面/场景渲染（CSS 动画版，无需 JS 驱动滚动） ──
  // 地面颜色/内容由此函数设置，滚动由 CSS @keyframes 自动完成

  // ── 地面近景/远景内容（各64字符×2=200%宽，CSS无缝循环） ──
  const GROUND_CONTENT = {
    平原:    ['─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─',
              '──────────────────────────────────────────────────────────────────'],
    山地:    ['/\\  /\\    /\\  /\\    /\\  /\\    /\\  /\\    /\\  /\\    /\\  /\\    /\\',
              '──────────────────────────────────────────────────────────────────'],
    高山:    ['/\\\\  /\\   /\\\\    /\\  /\\\\   /\\   /\\\\  /\\   /\\\\    /\\  /\\\\  /\\',
              '──────────────────────────────────────────────────────────────────'],
    密林:    ['Y  Y   Y  Y   Y  Y   Y  Y   Y  Y   Y  Y   Y  Y   Y  Y   Y  Y   ',
              '──────────────────────────────────────────────────────────────────'],
    沙漠绿洲:['~  ~~  ~  ~  ~~  ~  ~  ~~  ~  ~  ~~  ~  ~  ~~  ~  ~  ~~  ~  ~  ~',
              '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'],
    冰原:    ['─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─  ─',
              '──────────────────────────────────────────────────────────────────'],
    水乡:    ['~  ≈  ~  ~  ≈  ~  ~  ≈  ~  ~  ≈  ~  ~  ≈  ~  ~  ≈  ~  ~  ≈  ~ ',
              '≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈'],
    草原:    ['w  ww  w  w  ww  w  w  ww  w  w  ww  w  w  ww  w  w  ww  w  w  ',
              '──────────────────────────────────────────────────────────────────'],
  };

  // ── 远景背景字符画（多行错落，每种地形独特风格，双份无缝循环） ──
  // 内容约160字符宽，拼两份后 width:200% 无缝 translateX(-50%)
  const MOUNTAIN_ART = {
    平原:
`                   /\\                                    /\\         /\\
        _____      /  \\          /\\       _______        /  \\   /\\  /  \\      ____
       /     \\____/    \\___     /  \\     /       \\______/    \\ /  \\/    \\____/    \\
──────/────────────────────\\───/────\\───/─────────────────────────────────────────`,

    山地:
`         /\\                 /\\\\           /\\     /\\                  /\\\\
    /\\   /  \\    /\\    /\\   /  \\\\    /\\   /  \\   /  \\   /\\    /\\    /  \\\\   /\\
   /  \\ /    \\  /  \\  /  \\ /    \\\\  /  \\ /    \\ /    \\ /  \\  /  \\  /    \\\\ /  \\
──/────X──────\\/────\\/────X──────\\\\/────X──────X──────X──────\\/────X──────X──────`,

    高山:
`                  *
            /\\\\   /\\\\              *          /\\\\
           /  \\\\*/  \\\\      /\\\\   /\\\\         /  \\\\         /\\\\
      /\\  /    \\/    \\\\    /  \\\\ /  \\\\  /\\   /    \\\\  /\\   /  \\\\
─────/──\\/──────────  \\\\──/────X──────\\/──\\─/──────\\\\/──\\─/────\\\\──────────────`,

    密林:
`   |\\   /|  |\\  |  /|   |\\    /|  |\\   /|   |\\  /|   |\\   /|  |\\  |  /|
   | \\ / |  | \\ | / |   | \\  / |  | \\ / |   | \\/ |   | \\ / |  | \\ | / |
   |  X  |  |  \\|/  |   |  \\/  |  |  X  |   |  | |   |  X  |  |  \\|/  |
───┴──┴──┴──┴───┴───┴───┴──────┴──┴──┴──┴───┴──┴─┴───┴──┴──┴──┴───┴───┴`,

    沙漠绿洲:
`                                |                          |
          _____               |  |        _____          |  |      _
    ___  /~~~~~\\   ___       |   |  ___ /~~~~~\\  ___   |   |  ___/ \\
~~~/ ~~\\/ ~~~~~ \\~/ ~~\\~~~~~|   |~/ ~~X~~~~~~~/~~/ ~~\\|   |~/ ~~   \\~~~~~`,

    冰原:
`               *   *                        *   *
        /\\\\    * * *     /\\\\          /\\\\   * * *    /\\\\        /\\\\
       /  \\\\  * * * *   /  \\\\  /\\    /  \\\\ * * * *  /  \\\\  /\\  /  \\\\
──────/────\\\\──────────/────\\/──\\───/────\\\\─────────/────\\/──\\─/────\\\\─────`,

    水乡:
`        _                   ___              _      ___
    ___/|\\___    ___     ___|___|___    _____/|\\____|___|    ___
   /    |    \\  /   \\   /              /     |           \\  /   \\
~~~\\~~~~|~~~~/ /~~~~~\\~~\\~~~~~~~~~~~~~~~\\~~~~|~~~~~~~~~~~~\\/~~~~~\\~~`,

    草原:
`                                                            _
                 _____              ____         _____     / \\      ___
      ____      /     \\     ___    /    \\       /     \\___/   \\____/   \\
─────/────\\────/───────\\───/───\\──/──────\\─────/──────────────────────────`,
  };

  function getGroundContent(terrain){
    return GROUND_CONTENT[terrain] || GROUND_CONTENT['平原'];
  }

  // 注入天气专属天空艺术（就近写在 renderScene 前）
  _injectWeatherSkyArt(SKY_ART);

  // ── 渲染场景（直接更新，无淡入淡出） ──
  function renderScene(terrain, phase){
    const key   = jnyGetSceneKey(terrain, phase);
    const scene = JOURNEY_SCENES[key] || JOURNEY_SCENES['平原_day'];

    // 四季地面颜色叠加
    const seasonCol  = jnySeasonInfo.groundTint || null;
    const col = seasonCol || scene.color;

    const tintEl  = document.getElementById('jnySkyTint');
    const wrapEl  = document.getElementById('jnyGroundWrap');
    const hznEl   = document.getElementById('jnyHorizon');
    const bgEl    = document.getElementById('jnyBgScroll');
    const fgEl    = document.getElementById('jnyFgScroll');
    const mtnEl   = document.getElementById('jnyMountains');

    // 基础tint + 天气叠加
    let baseTint = scene.tint;
    if(activeWeather.groundTintMod) baseTint = baseTint + ',' + activeWeather.groundTintMod;
    if(tintEl) tintEl.style.background = baseTint;



    if(wrapEl) wrapEl.style.color = col;
    if(hznEl)  hznEl.style.color  = col;

    // 地面近景/远景
    const gc = getGroundContent(terrain);
    if(bgEl){ bgEl.textContent = gc[0] + ' ' + gc[0]; }
    if(fgEl){ fgEl.textContent = gc[1] + gc[1]; }

    // 马速动态调整滚动速度
    const tspd = (hasHorse && breed) ? (breed.travelSpeed || 25) : 0;
    const sf   = hasHorse ? (0.5 + (tspd / 90) * 2.5) : 0.5;
    if(fgEl) fgEl.style.animationDuration = (8  / sf).toFixed(1) + 's';
    if(bgEl) bgEl.style.animationDuration = (18 / sf).toFixed(1) + 's';

    // 远景背景（四季颜色）——多行内容需按行合并两份以实现无缝循环
    if(mtnEl){
      mtnEl.style.color = jnySeasonInfo.mountainColor || col;
      const mtnArt = MOUNTAIN_ART[terrain] || MOUNTAIN_ART['平原'];
      // 多行按行拼接：每行内容重复两次，确保 width:200% + translateX(-50%) 无缝
      const lines = mtnArt.split('\n');
      mtnEl.textContent = lines.map(l => l + l).join('\n');
      const mtnDur = (28 / sf).toFixed(1) + 's';
      mtnEl.style.animationDuration = mtnDur;
    }

    // 天空：天气优先覆盖 skyType，否则用场景默认
    const activeSkyType = (phase !== 'night' && activeWeather.skyOverride)
      ? activeWeather.skyOverride
      : (scene.skyType || 'day_plain');
    spawnSkyParticles(activeSkyType, col);
  }

  // startGroundScroll 不再需要，保留空函数以兼容启动调用
  function startGroundScroll(){ /* 已由 CSS animation 接管 */ }


  // ── 玩家动画（完全复刻捏脸工坊结构） ──
  const playerInfo = jnyGetPlayerFrames();
  const pColor     = playerInfo.color;
  const pIsHorse   = playerInfo.isHorse;
  const riderColor = edS.color || '#f0c060';

  // ── 构建与捏脸完全相同的人物 div 结构 ──
  function buildJnyPlayerHTML(){
    const col = riderColor;
    const shadow = `0 0 8px ${col}88`;
    const baseStyle = `color:${col};text-shadow:${shadow};`;

    // 读取玩家各部位内容（与 edRefreshPreview 完全一致）
    const headTxt  = edGetPart('head');
    const bodyTxt  = edGetPart('body');
    const legsTxt  = edGetPart('legs');
    const {left: armL, right: armR} = edSplitArms(edGetPart('arms'));

    // 马匹（行路用镜像帧，初始第一帧）
    const horseFrame0 = pIsHorse && playerInfo.breed
      ? playerInfo.breed.frames[0]   // 已在 jnyGetPlayerFrames 中镜像
      : '';

    // 骑马时加 pv-ride，步行时加 pv-walk，腿部显示状态也区分
    const wrapClass  = pIsHorse ? 'preview-ascii pv-ride' : 'preview-ascii pv-walk';
    // 骑马时腿部用 display:none 完全移除占位（避免身体与马之间出现空隙）
    const legsStyle = pIsHorse ? 'display:none;' : `${baseStyle}white-space:pre;`;

    return `
      <div class="${wrapClass}" id="jnyPvWrap" style="
        position:relative;display:inline-flex;flex-direction:column;
        align-items:center;font-family:'Courier New',monospace;
        font-size:13px;line-height:1.3;text-align:center;
      ">
        <div class="pv-part" id="jny-head"  style="${baseStyle}white-space:pre;">${escHtml(headTxt)}</div>
        <div style="display:flex;align-items:flex-start;justify-content:center;">
          <div class="pv-part pv-arm-left"  id="jny-arm-l" style="${baseStyle}white-space:pre;">${escHtml(armL)}</div>
          <div class="pv-part" id="jny-body" style="${baseStyle}white-space:pre;">${escHtml(bodyTxt)}</div>
          <div class="pv-part pv-arm-right" id="jny-arm-r" style="${baseStyle}white-space:pre;">${escHtml(armR)}</div>
        </div>
        <div class="pv-part" id="jny-legs"  style="${legsStyle}">${pIsHorse ? '' : escHtml(legsTxt)}</div>
        <div id="jny-horse" style="
          color:${pColor};
          text-shadow:0 0 10px ${pColor},0 0 22px ${pColor}66;
          filter:drop-shadow(0 0 8px ${pColor});
          font-size:11px;line-height:1.35;white-space:pre;
          font-family:'Courier New',monospace;text-align:center;
          margin-top:0;
          ${pIsHorse ? '' : 'display:none;'}
        ">${escHtml(horseFrame0)}</div>
      </div>`;
  }

  function startPlayerAnim(){
    if(playerTimer) clearInterval(playerTimer);

    // 写入人物 HTML
    const el = document.getElementById('jnyPlayer');
    if(el) el.innerHTML = buildJnyPlayerHTML();

    if(!pIsHorse || !playerInfo.breed){
      // 步行：CSS动画已在HTML中通过pv-walk类设置，无需额外操作
      return;
    }

    // 骑马：按 breed.interval 循环切换马帧（镜像帧）
    const breed    = playerInfo.breed;
    const interval = breed.interval || 220;
    let   frame    = 0;

    // 同步 animationDuration 到 breed.interval
    // .pv-ride 的 pvHorseBob/pvHorseGallop 默认 0.35s，按速度调整
    const bobSec     = (interval * 1.0 / 1000).toFixed(3);
    const gallopSec  = (interval * 0.9 / 1000).toFixed(3);
    const _applyDur = () => {
      const el2 = document.getElementById('jnyPlayer');
      if(!el2) return;
      const headEl  = el2.querySelector('#jny-head');
      const bodyEl  = el2.querySelector('#jny-body');
      if(headEl) headEl.style.animationDuration = bobSec    + 's';
      if(bodyEl) bodyEl.style.animationDuration = gallopSec + 's';
    };
    _applyDur();

    playerTimer = setInterval(()=>{
      if(paused) return;
      frame = (frame + 1) % breed.frames.length;
      const horseEl = document.getElementById('jny-horse');
      if(horseEl) horseEl.textContent = breed.frames[frame];
    }, interval);
  }


  // ── 每日日志：按天切换时自动写入 ──
  let lastLogDay = -1;
  const TIME_SHICHEN_FOR_LOG = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  function maybePushDayLog(gamePct){
    const curDay = Math.floor(gamePct * totalDays); // 0-based
    if(curDay === lastLogDay) return;
    lastLogDay = curDay;
    const dayNum = curDay + 1;
    const wxId   = weatherSeq[Math.min(curDay, weatherSeq.length-1)] || 'sunny';
    const wx     = WEATHER_DEF[wxId] || WEATHER_DEF.sunny;
    const shichenIdx = Math.floor(((3 + (curDay % 12))) % 12); // 每天从不同时辰起
    const shichen    = TIME_SHICHEN_FOR_LOG[shichenIdx];
    let dayLabel = totalDays <= 1
      ? `${wx.icon} 今日 ${wx.label}，${wx.narr}`
      : `📅 第${dayNum}天 ${shichen}时 ${wx.icon}${wx.label}`;
    // 加一条地形/随机旅途叙事
    const narrPool = narrAll;
    if(narrPool.length > 0){
      dayLabel += `　${narrPool[(curDay * 3 + 7) % narrPool.length]}`;
    }
    pushLog(dayLabel, 'day');
  }

  // ── 天体位置动态更新（每帧，根据行路进度 pct 0~1） ──
  // 用游戏时辰驱动：太阳卯时升(index3)→午时顶(6)→酉时落(9)，月亮戌时升(10)→子时顶(0)→卯时落(3)
  // shichenAbs = 从子时0开始的绝对时辰（0~23），支持跨天
  function updateCelestialPos(pct){
    const sunEl  = document.getElementById('jnySun');
    const moonEl = document.getElementById('jnyMoon');
    if(!sunEl && !moonEl) return;

    // 当前游戏时辰（浮点，0=子时开始，到 totalShichen 结束）
    const shichenAbs = (START_SHICHEN + pct * totalShichen) % 24;

    // ── 太阳：卯时(3)升→戌时(9)顶→亥时(15)落，跨12时辰（白天）
    // 以正午(index 6, 即 SUN_RISE+6=9) 为弧顶
    const SUN_RISE = 3, SUN_SET = 15; // 跨12时辰，与月亮对称
    let sunLeft, sunBottom, sunOpacity;
    if(shichenAbs >= SUN_RISE && shichenAbs <= SUN_SET){
      const t = (shichenAbs - SUN_RISE) / (SUN_SET - SUN_RISE); // 0~1
      sunLeft    = 85 - t * 82;                           // 从右85%→左3%
      sunBottom  = 6 + Math.sin(t * Math.PI) * 64;        // 弧线顶部约70%
      // 日出/日落时淡入淡出
      sunOpacity = t < 0.08 ? t / 0.08 : t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;
    } else {
      // 夜晚，太阳不可见
      sunLeft    = shichenAbs < SUN_RISE ? 85 : 3;
      sunBottom  = -10; // 地平线以下
      sunOpacity = 0;
    }

    // ── 月亮：亥时(15)升→子时(21)顶→卯时(27)落，跨12时辰（夜晚），与太阳对称
    // MOON_RISE=15 对应 shichenAbs，跨天用+24处理（shichenAbs可能0~3为次日卯时前）
    const MOON_RISE = 15, MOON_SET = 27; // 27=次日卯时(3+24)，跨12时辰
    const moonAbs = shichenAbs < MOON_RISE ? shichenAbs + 24 : shichenAbs; // 跨天处理
    let moonLeft, moonBottom, moonOpacity;
    if(moonAbs >= MOON_RISE && moonAbs <= MOON_SET){
      const t = (moonAbs - MOON_RISE) / (MOON_SET - MOON_RISE); // 0~1，与太阳完全对称
      moonLeft   = 82 - t * 80;                           // 从右82%→左2%
      moonBottom = 6 + Math.sin(t * Math.PI) * 55;        // 稍矮弧线
      moonOpacity = t < 0.08 ? t / 0.08 : t > 0.88 ? 1 - (t - 0.88) / 0.12 : 1;
    } else {
      moonLeft   = moonAbs < MOON_RISE ? 82 : 2;
      moonBottom = -10;
      moonOpacity = 0;
    }

    if(sunEl){
      sunEl.style.left    = sunLeft.toFixed(1) + '%';
      sunEl.style.bottom  = sunBottom.toFixed(1) + '%';
      sunEl.style.color   = jnySeasonInfo.sunColor || '#ffe066';
      sunEl.style.opacity = Math.max(0, sunOpacity * (activeWeather.sunOpacityMod ?? 1)).toFixed(3);
    }
    if(moonEl){

      moonEl.style.left    = moonLeft.toFixed(1) + '%';
      moonEl.style.bottom  = moonBottom.toFixed(1) + '%';
      moonEl.style.color   = jnySeasonInfo.moonColor || '#d0e8ff';
      moonEl.style.opacity = Math.max(0, moonOpacity * (activeWeather.moonOpacityMod ?? 1)).toFixed(3);
    }
  }

  // ════════════════════════════════════════
  //  连续线性行路引擎
  // ════════════════════════════════════════

  // 总旅程时长（ms）：按里程计算，但视觉动画固定 10 秒
  const baseDur  = hasHorse ? 12000 : 20000;
  const totalDur = Math.max(baseDur, Math.min(baseDur * 2, baseDur * (distLi / 300)));
  const visDur   = 10000; // 视觉动画固定 10 秒

  // ── 游戏时间系统 ──
  // 旅途总时长 = days 天 = days*12 时辰
  // 出发时辰：卯时（6:00，天刚亮，符合旅途出发感）
  const TIME_SHICHEN = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const START_SHICHEN = 3; // 卯时 = index 3
  const totalShichen = days * 12; // 整个旅途跨越的时辰数

  function getGameTimeStr(pct){
    const shichenPassed = pct * totalShichen;
    const daysPassed    = Math.floor(shichenPassed / 12);
    const shichenIdx    = Math.floor(shichenPassed % 12);
    const shichen       = TIME_SHICHEN[(START_SHICHEN + shichenIdx) % 12];
    if(totalShichen <= 12){
      // 不足一天，只显示时辰
      return shichen + '时';
    }
    // 超过一天，显示"第X天 XX时"
    return `第${daysPassed + 1}天 ${shichen}时`;
  }

  // ── 天气动态序列：按天预生成，每过一天自动切换 ──
  // 总天数向上取整，至少1天；短途(<1天)也算1天
  const totalDays = Math.max(1, Math.ceil(days));

  // 生成每天的天气 id 数组（相邻两天有转移倾向，天气更稳定，典型持续2~4天）
  function _pickNextWeather(prevId){
    const transitions = {
      sunny:   ['sunny','sunny','sunny','cloudy','mist'],
      cloudy:  ['cloudy','cloudy','sunny','rain','wind','mist'],
      rain:    ['rain','rain','cloudy','thunder','mist'],
      thunder: ['thunder','rain','rain','cloudy'],
      snow:    ['snow','snow','snow','cloudy','wind'],
      wind:    ['wind','wind','cloudy','sunny'],
      mist:    ['mist','mist','cloudy','sunny'],
    };
    // 70% 按转移倾向（大概率保持或邻近天气），30% 随机季节池
    const tranPool = transitions[prevId] || weatherPool;
    const merged   = Math.random() < 0.7 ? tranPool : weatherPool;
    const filtered = merged.filter(w => weatherPool.includes(w));
    const pool     = filtered.length ? filtered : weatherPool;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const weatherSeq = [jnyWeatherId]; // 第0天已定
  for(let d = 1; d < totalDays; d++){
    weatherSeq.push(_pickNextWeather(weatherSeq[d - 1]));
  }

  // 当前天气（let，在 jnyTick 里可动态切换）
  // jnyWeather / jnyWeatherId 是 const，我们用新的 let 变量存活跃天气
  // renderScene / updateCelestialPos 里读取 activeWeather / activeWeatherId
  let activeWeatherId = jnyWeatherId;
  let activeWeather   = jnyWeather;

  let lastWeatherDay  = 0;  // 上一次已应用天气的天索引
  let lastHungerDay    = -1; // 上一次已触发饥渴事件的天索引

  // 叙事触发点（均匀分布在 10%~85% 之间）
  const narrCount = Math.max(3, Math.min(8, narrAll.length));
  const narrTriggers = Array.from({length: narrCount}, (_, i) =>
    0.10 + (i / (narrCount - 1)) * 0.75
  );
  let narrFired = new Array(narrCount).fill(false);

  // 每天事件触发点（每天35%概率，均匀分布在该天的50%~80%处）
  // key = 天索引(0-based)，value = gamePct触发点
  const dayEventPcts = {};
  for(let d = 0; d < totalDays; d++){
    if(Math.random() < 0.35){
      // 在当天时间段内的50%~80%触发
      const dayStart = d / totalDays;
      const dayEnd   = (d + 1) / totalDays;
      dayEventPcts[d] = dayStart + (dayEnd - dayStart) * (0.5 + Math.random() * 0.3);
    }
  }
  const firedEventDays = new Set();
  let   paused         = false;

  // 场景切换点：前半程出发地地形，后半程目的地地形
  // 额外细分三个时辰阶段（0%=day 50%=eve 75%=night）
  let lastSceneKey = '';
  function getSceneAtPct(pct){
    const terrain = pct < 0.5 ? fromNode.terrain : destNode.terrain;
    const phase   = pct < 0.50 ? 'day' : pct < 0.75 ? 'eve' : 'night';
    return { terrain, phase, key: terrain + '_' + phase };
  }

  // ── tick 推进 ──
  let startTime   = null;
  let tickTimer   = null;
  let lastPct     = 0;

  function jnyTick(ts){
    if(paused) return;
    if(!startTime) startTime = ts;
    const elapsed   = ts - startTime;
    // 视觉动画进度：固定 visDur（10秒走完进度条/场景）
    const visPct    = Math.min(1, elapsed / visDur);
    // 游戏时间进度：与视觉进度同步，确保10秒内走完整个游戏时间
    // 使用 visPct 映射到游戏时间，这样到达时游戏时间也正好走完
    const gamePct   = visPct;

    // ── 天体位置更新（游戏时间驱动） ──
    updateCelestialPos(gamePct);

    // ── 进度条 + 里程标签（视觉动画驱动，固定10秒） ──
    const fillEl   = document.getElementById('jnyProgFill');
    const distLbl  = document.getElementById('jnyDistLabel');
    const segLbl   = document.getElementById('jnySegLabel');
    const timeLbl  = document.getElementById('jnyTimeLabel');
    if(fillEl)  fillEl.style.width = Math.round(visPct * 100) + '%';
    if(distLbl) distLbl.textContent = `${Math.round(visPct * distLi)} / ${distLi}里`;
    if(timeLbl) timeLbl.textContent = getGameTimeStr(gamePct);
    if(segLbl){
      const labels = ['出发','途中','前行','跋涉','渐近','将至','快到了'];
      segLbl.textContent = labels[Math.floor(visPct * (labels.length - 1))];
    }

    // ── 饱食/口渴实时显示 ──
    // 直接读取 travelPlayerState 的当前值（每日事件会实时更新它）
    const foodTag  = document.getElementById('jnyFoodTag');
    const waterTag = document.getElementById('jnyWaterTag');
    if(foodTag){
      const curFood = travelPlayerState.food ?? 100;
      foodTag.textContent  = '🍚 ' + Math.max(0, Math.round(curFood));
      foodTag.style.color  = curFood < 30 ? '#e74c3c' : curFood < 60 ? '#e67e22' : '';
    }
    if(waterTag){
      const curWater = travelPlayerState.water ?? 100;
      waterTag.textContent = '💧 ' + Math.max(0, Math.round(curWater));
      waterTag.style.color = curWater < 20 ? '#e74c3c' : curWater < 50 ? '#3498db' : '';
    }

    // ── 天气按天切换（游戏时间驱动） ──
    const curDayIdx = Math.min(totalDays - 1, Math.floor(gamePct * totalDays));
    if(curDayIdx !== lastWeatherDay){
      lastWeatherDay = curDayIdx;
      const newWxId  = weatherSeq[curDayIdx] || 'sunny';
      if(newWxId !== activeWeatherId){
        activeWeatherId = newWxId;
        activeWeather   = WEATHER_DEF[newWxId] || WEATHER_DEF.sunny;
        // 更新进度栏天气标签
        const wxLbl = document.getElementById('jnyWeatherLabel');
        if(wxLbl) wxLbl.textContent = `${jnySeasonInfo.icon}${jnySeasonInfo.label} ${activeWeather.icon}${activeWeather.label}`;
        // 推送天气变化叙事
        pushNarr(`${activeWeather.icon} ${activeWeather.narr}`);
        // 重新渲染当前场景（天空+tint+fall 全部刷新）
        const { terrain, phase } = getSceneAtPct(gamePct);
        renderScene(terrain, phase);
      }
    }

    // ── 每日饥渴事件（按天推进，随机触发） ──
    if(curDayIdx !== lastHungerDay){
      lastHungerDay = curDayIdx;
      const { terrain } = getSceneAtPct(gamePct);
      setTimeout(()=> fireDayHungerEvent(terrain), 150);
    }

    // 场景平滑切换（地形/时辰变化时触发一次 renderScene，由 crossfade 负责过渡）
    const { terrain, phase, key } = getSceneAtPct(gamePct);
    if(key !== lastSceneKey){
      lastSceneKey = key;
      renderScene(terrain, phase);
    }

    // ── 每日日志（按天推进自动写入） ──
    maybePushDayLog(gamePct);

    // 每天事件检查（日志形式，不暂停进度条）
    const curDayForEvent = Math.min(totalDays - 1, Math.floor(gamePct * totalDays));
    if(dayEventPcts[curDayForEvent] !== undefined &&
       !firedEventDays.has(curDayForEvent) &&
       gamePct >= dayEventPcts[curDayForEvent]){
      firedEventDays.add(curDayForEvent);
      setTimeout(()=> showBigEvent(), 80);
    }

    // 到达判断：视觉进度主导，10秒固定走完即到达
    if(visPct >= 1){
      arrive();
      return;
    }

    lastPct = visPct;
    tickTimer = requestAnimationFrame(jnyTick);
  }

  // ── 显示重大事件（日志形式，不暂停） ──
  function showBigEvent(){
    // 江湖奇遇系统接入（12%概率触发深度叙事奇遇弹窗，保留弹窗交互）
    if(typeof ENCOUNTER_DB !== 'undefined' && typeof showEncounterModal === 'function'){
      if(Math.random() < 0.12){
        const enc = (typeof pickEncounterEvent === 'function') ? pickEncounterEvent() : ENCOUNTER_DB[0];
        showEncounterModal(enc);
        // 奇遇弹窗关闭后不需要 resume，进度条已经在走
        return;
      }
    }

    // 普通旅途事件：直接执行 + 写入日志
    const ev = travelPickEvent(fromId, destId);
    const resultText = ev.fn ? ev.fn() : (ev.result || '');
    const typeMap = { good:'event-good', great:'event-great', bad:'event-bad', normal:'event-normal' };
    const logType = typeMap[ev.type] || 'event-normal';
    pushLog(`${ev.icon} 【${ev.title}】${ev.desc}${resultText ? '　→ ' + resultText : ''}`, logType);
    if(typeof travelRenderIndex === 'function') travelRenderIndex();
  }

  // ── 到达目的地 ──
  function arrive(){
    if(tickTimer){ cancelAnimationFrame(tickTimer); tickTimer = null; }
    if(playerTimer){ clearInterval(playerTimer); playerTimer = null; }
    stopJnyParticles();  // 停止行路粒子背景

    const fillEl  = document.getElementById('jnyProgFill');
    const segLbl  = document.getElementById('jnySegLabel');
    const distLbl = document.getElementById('jnyDistLabel');
    if(fillEl)  fillEl.style.width = '100%';
    if(distLbl) distLbl.textContent = `${distLi} / ${distLi}里`;
    if(segLbl)  segLbl.textContent  = '到达！';

    renderScene(destNode.terrain, 'day');

    // 到达闪光特效
    const flash = document.createElement('div');
    flash.className = 'jny-arrive-flash';
    document.getElementById('jnyScene').appendChild(flash);
    setTimeout(()=> flash.remove(), 900);

    // 写入到达日志
    pushLog(`🎉 抵达 ${destNode.icon} ${destNode.name}！`, 'arrive');
    if(destNode.desc) pushLog(`　${destNode.desc.slice(0, 50)}……`, 'narr');

    // 2秒后自动进城（不需要点按钮）
    setTimeout(()=>{
      const overlay = document.querySelector('.journey-overlay');
      if(overlay) overlay.remove();
      window._jnyComplete && window._jnyComplete();
    }, 2200);
  }

  // ── 跳过：停止动画 → 立即完成回调链 ──
  window._jnySkip = ()=>{
    if(tickTimer){ cancelAnimationFrame(tickTimer); tickTimer = null; }
    if(playerTimer){ clearInterval(playerTimer); playerTimer = null; }
    stopJnyParticles();
    const overlay = document.querySelector('.journey-overlay');
    if(overlay) overlay.remove();
    // 执行完整完成回调链
    window._jnyComplete && window._jnyComplete();
  };

  // ── 注册全局回调（大事件后恢复） ──
  window._jnyResume   = ()=>{
    paused = false;
    // 用已消耗进度 lastPct 反推 startTime，从当前进度继续，不重置
    startTime = performance.now() - lastPct * totalDur;
    tickTimer = requestAnimationFrame(jnyTick);
  };
  window._jnyComplete = ()=>{
    _jnyAdvanceMonth(monthAdvance);
    // 抵达时检查主线任务城市触发
    if(typeof checkMainQuestTriggerCity === 'function') checkMainQuestTriggerCity(destId);
    // 执行传入的完成回调（如更新 edS.gameDay 等）
    if(typeof onComplete === 'function') onComplete();
    // 跳转前保存状态
    if(typeof travelSave === 'function') travelSave();
    // 跳转到目的地城镇页面
    window.location.href = 'town.html?city=' + destId;
  };

  // ── 启动 ──
  startGroundScroll();
  startPlayerAnim();
  startJnyParticles();  // 行路粒子背景
  // 初始化天体固定 div（太阳+月亮）
  initCelestialDivs();
  // 初始渲染第一帧场景
  renderScene(fromNode.terrain, 'day');
  lastSceneKey = fromNode.terrain + '_day';
  // 出发时推送季节+天气文字
  setTimeout(()=>{
    pushNarr(`${jnySeasonInfo.icon} 时值${jnySeasonInfo.label}季，${activeWeather.narr}`);
  }, 400);
  tickTimer = requestAnimationFrame(jnyTick);
}

// 行程结束后月份推进（已废弃，gameMonth 是起始月份，显示时根据 gameDay 自动计算）
function _jnyAdvanceMonth(monthAdv){
  // gameDay 是累计天数，gameMonth 是起始月份
  // 显示时会根据 gameDay 自动计算当前月份，不需要手动更新 gameMonth
  return;
}

// HTML转义工具
function escHtml(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// 方向中文名
const DIR_LABEL = { N:'北', S:'南', E:'东', W:'西', NE:'东北', NW:'西北', SE:'东南', SW:'西南' };
const DIR_ARROW = { N:'↑', S:'↓', E:'→', W:'←', NE:'↗', NW:'↖', SE:'↘', SW:'↙' };

// ── 地形行进系数（乘以基础距离 → 实际行程里数）──
// 平坦地形=1.0, 山地/险峻=较慢, 丘陵=略慢
const TERRAIN_TRAVEL_FACTOR = {
  平原:1.0, 丘陵:1.2, 山地:1.5, 高山:1.8, 仙山:1.8, 险峰:2.0, 险关:1.6,
  盆地:1.1, 高原:1.3, 河谷:1.2, 水乡:1.2, 海港:1.0, 海岛:1.4, 湖滨:1.1,
  草原:0.9, 沙漠绿洲:1.4, 戈壁:1.5, 冰原:1.8, 山城:1.4, 密林:1.6,
  高原湖泊:1.4, 奇峰:1.7, 海滨:1.1, 峡谷:1.7, 绿洲:1.2,
};

// ── 计算两城市间的行程里数 ──
// 基于坐标欧式距离，1格≈50里，再乘以目的地地形系数
function travelCalcDist(fromId, toId){
  const a = WORLD_NODES[fromId], b = WORLD_NODES[toId];
  if(!a || !b) return 200; // 默认200里
  const dx = b.x - a.x, dy = b.y - a.y;
  const rawDist = Math.sqrt(dx*dx + dy*dy);
  // 地形系数：取目的地和出发地的平均
  const fa = TERRAIN_TRAVEL_FACTOR[a.terrain] || 1.0;
  const fb = TERRAIN_TRAVEL_FACTOR[b.terrain] || 1.0;
  const factor = (fa + fb) / 2;
  return Math.round(rawDist * 50 * factor);
}

// ── 根据距离+坐骑计算旅途时间描述 ──
// 返回 { distLi, footDays, horseDays, horseName, horseIcon, rentMount }
// 优先级：临时租马 > 永久坐骑 > 徒步
function travelCalcTime(fromId, toId){
  const distLi = travelCalcDist(fromId, toId);
  // 徒步：约40里/天（对应人行速）
  const footDays = distLi / 40;

  // ══ 1. 检查临时租马（wuxia_mount，localStorage）══
  let rentMount = null;
  try {
    const raw = localStorage.getItem('wuxia_mount');
    if(raw){
      const m = JSON.parse(raw);
      if(m && Date.now() < (m.expires||0)) rentMount = m;
      else localStorage.removeItem('wuxia_mount'); // 过期清理
    }
  } catch(e){}

  // ══ 2. 永久坐骑（HORSE_BREEDS）══
  const breedKey = (typeof edS !== 'undefined' && edS.horseId) || 'none';
  const breed = HORSE_BREEDS[breedKey];

  // ══ 3. 计算最终速度 ══
  let finalDays = footDays;      // 默认徒步
  let horseName = '';
  let horseIcon = '';
  let horseDays = 0;

  if(rentMount){
    // 租马加速（按 breedKey 给倍率，与 town.html _MOUNT_DB 对齐）
    const rentSpdMap = {
      old:1.25, normal:1.42, pony:1.33,
      zebra:1.47, warhorse:1.64, white:1.59,
      phantom:1.61, black:1.73, snow:1.70,
      heavenly:2.20, redrabbit:2.35, camel:1.20,
      // 兼容旧 ID（防止已有租用记录失效）
      horse_brown:1.30, horse_black:1.50, horse_white:1.80,
    };
    const spdMult = rentSpdMap[rentMount.id] || 1.3;
    finalDays = footDays / spdMult;
    horseDays = finalDays;
    horseName = `${rentMount.name}（租）`;
    // 租马图标映射（对应 _MOUNT_DB 的 breedKey）
    const rentIconMap = {old:'🌾',normal:'🐴',pony:'🐎',zebra:'🦓',warhorse:'🦄',white:'🌟',phantom:'🌙',black:'🖤',snow:'❄',heavenly:'🔥',redrabbit:'🔴',camel:'🐪'};
    horseIcon = rentIconMap[rentMount.id] || '🐴';
  } else if(breed){
    // 永久坐骑
    const horseSpeed = breed.travelSpeed || 30;
    finalDays = distLi / (horseSpeed * 12);
    horseDays = finalDays;
    horseName = breed.name;
    horseIcon = breed.icon;
  }

  return { distLi, footDays, horseDays, horseName, horseIcon, rentMount: !!rentMount };
}

// ── 旅途时间格式化（天/时辰）──
function fmtDays(days){
  if(days < 0.5){
    const hrs = Math.round(days * 12);
    return hrs <= 1 ? '约1时辰' : `约${hrs}时辰`;
  }
  if(days < 1.5) return '约1天';
  if(days < 30)  return `约${Math.round(days)}天`;
  const months = Math.round(days / 30);
  return `约${months}个月`;
}

// 地形图标
const TERRAIN_ICON = {
  平原:'🌾', 丘陵:'⛰', 山地:'🏔', 高山:'🗻', 仙山:'✨', 险峰:'⚡', 险关:'🏯',
  盆地:'🌿', 高原:'🏔', 河谷:'🌊', 水乡:'🛶', 海港:'⚓', 海岛:'🏝', 湖滨:'🌊',
  草原:'🐴', 沙漠绿洲:'🌵', 戈壁:'🏜', 冰原:'❄', 山城:'🏰', 密林:'🌲',
  高原湖泊:'💧', 奇峰:'🎋', 海滨:'🌊', 峡谷:'⚡', 绿洲:'🌴',
};

// 城镇服务图标
const SERVICE_ICON = {
  inn:'🏠旅店', shop:'🛒商店', blacksmith:'⚒铁匠', market:'🏪集市',
  guild:'⚔镖局', hospital:'💊医馆',
};

// 节点tier颜色
const NODE_TIER_COLOR = {
  capital:'#ffd700', major:'#80c8ff', minor:'#a0c8a0',
  sect_location:'#e080ff',
};

// ════════════════════════════════════════════════
//  江湖舆图 · 旅行系统（已迁移至 WORLD_NODES 节点路网）
// ════════════════════════════════════════════════

// ── 旅行系统状态 ──
let travelCurrentCity = 'luoyang';  // 玩家当前所在城市
let travelHistory = ['luoyang'];    // 旅行足迹（最近10个城市）
let travelEventLog = [];            // 旅途事件日志（最近8条）

// ── 旅行玩家状态（独立存储，不依赖战斗系统）──
// 江湖行走时的个人状态：银两/气血/精力（均有最大上限）
