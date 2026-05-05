// ════════════════════════════════════════════════════
//  data-dungeon.js  地下城数据
//  结构：地下城(DUNGEON_DB) → 固定地图(rooms网格) → 房间(room)
//  每个地下城挂在地图节点附近，玩家从舆图进入
// ════════════════════════════════════════════════════

// ── 房间类型常量 ──
const ROOM_TYPE = {
  EMPTY:   'empty',    // 空房间（已清理/安全）
  BATTLE:  'battle',   // 战斗房
  ELITE:   'elite',    // 精英战斗房
  BOSS:    'boss',     // BOSS房
  CHEST:   'chest',    // 宝箱房
  TRAP:    'trap',     // 陷阱房（触发后变empty）
  REST:    'rest',     // 休息点（小量回血）
  EVENT:   'event',    // 随机事件
  ENTRY:   'entry',    // 入口（起始位置）
  EXIT:    'exit',     // 出口（通关后显示）
};

// ── 房间图标 ──
const ROOM_ICONS = {
  empty:  '·',
  battle: '⚔',
  elite:  '💀',
  boss:   '👹',
  chest:  '📦',
  trap:   '⚠',
  rest:   '🔥',
  event:   '❓',
  collect: '⛏',
  entry:  '🚪',
  exit:   '🏆',
};

// ── 地下城数据库 ──
// map: 二维数组，每格是一个房间对象
//   { type, cleared, enemyId, lootTier, desc }
// nearCities: 附近城市ID列表（舆图上从这些城市可见此地下城）
// ────────────────────────────────────────────────────────
const DUNGEON_DB = {

  // ══════════════════════════════════════
  //  一、新手区（Lv1-15）
  // ══════════════════════════════════════

  dungeon_wolf_valley: {
    id:       'dungeon_wolf_valley',
    name:     '狼牙谷',
    icon:     '🐺',
    desc:     '汝州城外的险峻山谷，常年有饿狼出没，附近村民苦不堪言。谷中深处似乎还有山贼盘踞。',
    theme:    'mountain',  // 背景主题
    minLevel: 1,
    maxLevel: 15,
    nearCities: ['ruzhou'],
    terrain:  '山地',
    floors:   1,
    // 地图：5列×4行网格（null = 不可通行墙壁）
    // 入口固定在[3][0]（第4行第1列）
    map: [
      [
        { type:'empty',  cleared:false, desc:'荒草丛生的山路入口'  },
        { type:'battle', cleared:false, enemyId:'wolf',        desc:'两只饿狼守着岔路口' },
        { type:'chest',  cleared:false, lootTier:'common',     desc:'山缝里塞着个破旧包袱' },
        null,
        null,
      ],
      [
        { type:'entry',  cleared:true,  desc:'狼牙谷入口，山风猎猎' },
        { type:'battle', cleared:false, enemyId:'wolf',        desc:'一群野狼在此游荡' },
        { type:'rest',   cleared:false, desc:'山腰有一处避风石洞，可以歇脚' },
        { type:'battle', cleared:false, enemyId:'bandit_foot', desc:'几个巡逻的山贼' },
        { type:'chest',  cleared:false, lootTier:'uncommon',   desc:'山贼藏在石头后的箱子' },
      ],
      [
        null,
        { type:'trap',   cleared:false, desc:'地面有绳索陷阱，稍不留神就会被绊倒' },
        { type:'battle', cleared:false, enemyId:'boar',        desc:'一头受伤的野猪横冲直撞' },
        { type:'elite',  cleared:false, enemyId:'wolf_king',   desc:'狼群首领，体型异常巨大' },
        { type:'event',  cleared:false, desc:'一个受伤的行商，求你护送他出去' },
      ],
      [
        null,
        null,
        { type:'battle', cleared:false, enemyId:'bandit_chief_low', desc:'山贼老大的营地' },
        { type:'battle', cleared:false, enemyId:'bandit_foot', desc:'守卫营地的山贼' },
        { type:'boss',   cleared:false, enemyId:'bandit_chief_low', desc:'【山贼头目】三当家扎老三，手持朴刀' },
      ],
    ],
    // 玩家出生点
    startPos: [1, 0],
    // 击败BOSS后额外奖励
    bossReward: {
      exp:    500,
      silver: 80,
      items:  [
        { id:'item_iron_ore',    qty:3 },
        { id:'item_cloth',       qty:2 },
      ],
      manualChance: 0.15,  // 15%概率掉落秘籍
    },
    // 通关后是否解锁其他地下城
    unlocks: [],
    // 每N个房间自动小量回血
    restInterval: 3,
    restHealPct:  0.08,  // 恢复最大气血8%
  },

  // ════════════════════════════════════════════════════════
  //  新手城镇专属Lv1地下城（16个初始城镇各一个）
  //  每个地下城都有独特的布局、尺寸和特色玩法
  // ════════════════════════════════════════════════════════

  // ════════════════════════════════════════════════════════
  //  【特色1】沧州·废弃盐仓 - 双层迷宫结构
  //  特色：2层结构，上层仓库+下层地道，有陷阱和隐藏宝箱
  // ════════════════════════════════════════════════════════
  dungeon_cangzhou_salt_warehouse: {
    id:       'dungeon_cangzhou_salt_warehouse',
    name:     '废弃盐仓',
    icon:     '🏚️',
    desc:     '沧州海边一处废弃的官盐仓库，上层是破败的库房，下层是走私者挖掘的秘密地道。据说地道深处藏着海盗的赃物。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['cangzhou'],
    terrain:  '废墟',
    floors:   2,
    // 第一层：仓库区 4×4
    map: [
      [
        { type:'entry',  cleared:true,  desc:'盐仓大门，门板半塌' },
        { type:'battle', cleared:false, enemyId:'salt_thief',   desc:'流浪者在仓库外徘徊' },
        null,
        { type:'chest',  cleared:false, lootTier:'common',     desc:'破损的盐袋，里面藏着东西' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'野狗在盐堆间穿梭' },
        { type:'rest',   cleared:false, desc:'倒塌的值班室可以歇脚' },
        { type:'battle', cleared:false, enemyId:'salt_thief',   desc:'小毛贼在翻找值钱的东西' },
        { type:'trap',   cleared:false, desc:'地上的盐渍滑腻，容易摔倒！' },
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'走私者藏货的暗格' },
        { type:'elite',  cleared:false, enemyId:'salt_thief',   desc:'盐仓看守，手持棍棒' },
        { type:'battle', cleared:false, enemyId:'salt_thief',   desc:'两个同伙在分赃' },
      ],
      [
        null,
        null,
        { type:'event',  cleared:false, desc:'通往地道的暗门，隐约传来水声' },
        { type:'empty',  cleared:false, desc:'盐仓角落，堆满发霉的盐袋' },
      ],
    ],
    // 第二层：秘密地道 3×5
    floor2Map: [
      [
        { type:'entry',  cleared:true,  desc:'地道入口，潮湿阴暗' },
        { type:'battle', cleared:false, enemyId:'salt_thief',   desc:'地道哨兵' },
        { type:'trap',   cleared:false, desc:'地面有积水，踩上去会打滑！' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'海盗藏匿的小箱子' },
        { type:'empty',  cleared:false, desc:'地道岔路，通向未知' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'野狗群' },
        { type:'rest',   cleared:false, desc:'地道的干燥角落可以休息' },
        { type:'elite',  cleared:false, enemyId:'salt_thief',   desc:'海盗小头目' },
        { type:'battle', cleared:false, enemyId:'salt_thief',   desc:'海盗手下' },
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'海盗头目的私藏宝箱' },
      ],
      [
        null,
        null,
        { type:'boss',   cleared:false, enemyId:'salt_boss', desc:'【盐仓恶霸】老盐枭，控制这片仓库多年' },
        { type:'empty',  cleared:false, desc:'地道的尽头，通向海边' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:450, silver:85, items:[{id:'item_cloth',qty:3},{id:'item_iron_ore',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色2】杭州·西湖水榭 - T型水道布局
  //  特色：T字形水道，需要绕路探索，有隐藏休息点
  // ════════════════════════════════════════════════════════
  dungeon_hangzhou_waterside: {
    id:       'dungeon_hangzhou_waterside',
    name:     '西湖水榭',
    icon:     '🌉',
    desc:     '杭州西湖边一处废弃的水榭园林，亭台楼阁间水道纵横。水贼利用复杂的地形设下埋伏，劫掠过往游客。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['hangzhou'],
    terrain:  '水边',
    floors:   1,
    // 扩展布局：5行×5列，水榭园林迷宫，含3处采集点
    map: [
      [
        { type:'entry',   cleared:true,  desc:'水榭正门，朱漆剥落' },
        { type:'battle',  cleared:false, enemyId:'water_thief', desc:'水贼在门边放哨' },
        { type:'chest',   cleared:false, lootTier:'common',     desc:'游客落下的包裹' },
        { type:'collect', cleared:false, desc:'荷花池畔淤泥松软，挽起裤脚便能摸到一层河泥' },
        { type:'collect', cleared:false, desc:'残荷根下淤泥肥厚，随手一捧便是一把软泥' },
      ],
      [
        null,
        { type:'rest',    cleared:false, desc:'凉亭可以歇脚，还能观赏湖景' },
        { type:'battle',  cleared:false, enemyId:'water_thief', desc:'水贼在桥上收过路费' },
        { type:'trap',    cleared:false, desc:'木桥腐朽，踩上去会断裂！' },
        { type:'collect', cleared:false, desc:'西湖深处隐秘水湾，淤泥沉积极厚' },
      ],
      [
        { type:'battle',  cleared:false, enemyId:'wolf',        desc:'野狗在假山后出没' },
        { type:'chest',   cleared:false, lootTier:'uncommon',   desc:'假山里的秘密藏宝处' },
        { type:'battle',  cleared:false, enemyId:'water_thief', desc:'水贼在水榭里巡逻' },
        { type:'event',   cleared:false, desc:'一位被困的书生，求你带他出去' },
        null,
      ],
      [
        { type:'collect', cleared:false, desc:'荷叶遮掩的浅滩，淤泥中混有湖底腐叶' },
        { type:'battle',  cleared:false, enemyId:'water_thief', desc:'水贼手下' },
        { type:'elite',   cleared:false, enemyId:'water_thief', desc:'水贼小头目，守着要道' },
        { type:'chest',   cleared:false, lootTier:'uncommon',   desc:'阁楼暗格里的皮箱' },
        null,
      ],
      [
        null,
        null,
        { type:'trap',    cleared:false, desc:'机关绊索触发，扑入泥泞！' },
        { type:'rest',    cleared:false, desc:'偏院水阁，有人留下了干粮' },
        { type:'boss',    cleared:false, enemyId:'water_boss',  desc:'【西湖水贼头目】浪里白条，水性极好' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:480, silver:90, items:[{id:'item_herb_common',qty:3},{id:'item_cloth',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色3】襄阳·古城暗道 - 环形回廊
  //  特色：环形布局，可以顺时针或逆时针探索，有捷径
  // ════════════════════════════════════════════════════════
  dungeon_xiangyang_secret_passage: {
    id:       'dungeon_xiangyang_secret_passage',
    name:     '古城暗道',
    icon:     '🏛️',
    desc:     '襄阳古城墙下的秘密通道，据说是古代守军修建的战备地道。如今被逃兵和流寇占据，成为他们的藏身之所。',
    theme:    'dark',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['xiangyang'],
    terrain:  '地道',
    floors:   1,
    // 扩展布局：4行×5列，地道回廊含采集点
    map: [
      [
        { type:'chest',   cleared:false, lootTier:'uncommon',  desc:'守军遗留的物资箱' },
        { type:'battle',  cleared:false, enemyId:'deserter',   desc:'逃兵在巡逻' },
        { type:'trap',    cleared:false, desc:'地道年久失修，有落石！' },
        { type:'chest',   cleared:false, lootTier:'common',    desc:'破损的兵器架' },
        { type:'collect', cleared:false, desc:'地道壁缝间长满了野草，信手可采' },
      ],
      [
        { type:'battle',  cleared:false, enemyId:'wolf',       desc:'野狗群' },
        { type:'entry',   cleared:true,  desc:'暗道入口，隐藏在城墙根下' },
        { type:'rest',    cleared:false, desc:'地道的休息点，有石凳' },
        { type:'battle',  cleared:false, enemyId:'deserter',   desc:'流寇在堵路' },
        { type:'collect', cleared:false, desc:'旧城墙砖缝里嵌着矿质沉积，仔细剥落能得石料' },
      ],
      [
        { type:'collect', cleared:false, desc:'地道角落有一处腐烂的木箱，翻出些零碎矿石' },
        { type:'elite',   cleared:false, enemyId:'deserter',   desc:'逃兵小队长' },
        { type:'battle',  cleared:false, enemyId:'deserter',   desc:'两个逃兵' },
        { type:'event',   cleared:false, desc:'一个受伤的守军，知道地道的秘密' },
        null,
      ],
      [
        null,
        { type:'trap',    cleared:false, desc:'绊索机关，顶部砖块坠落！' },
        { type:'battle',  cleared:false, enemyId:'deserter',   desc:'守在暗道深处的流寇' },
        { type:'chest',   cleared:false, lootTier:'uncommon',  desc:'逃兵藏在地道尽头的箱子' },
        { type:'boss',    cleared:false, enemyId:'deserter_boss', desc:'【暗道霸主】原是襄阳守将，如今落草为寇' },
      ],
    ],
    // 玩家出生点（entry 在第1行第1列）
    startPos: [1, 1],
    bossReward: { exp:460, silver:88, items:[{id:'item_iron_ore',qty:3},{id:'item_cloth',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色4】扬州·瘦西湖画舫 - 水上浮动平台
  //  特色：3×3浮动平台，中间是主船，四周是小船
  // ════════════════════════════════════════════════════════
  dungeon_yangzhou_painting_boat: {
    id:       'dungeon_yangzhou_painting_boat',
    name:     '瘦西湖画舫',
    icon:     '⛵',
    desc:     '扬州瘦西湖上几艘废弃的画舫船，被一伙水贼占据。船与船之间用木板连接，走在上面摇摇晃晃。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['yangzhou'],
    terrain:  '水上',
    floors:   1,
    // 扩展布局：5行×5列，水上画舫群，含多处采集点
    map: [
      [
        { type:'chest',   cleared:false, lootTier:'common',   desc:'小货船上落下的木箱' },
        { type:'battle',  cleared:false, enemyId:'boat_thief',desc:'水贼在船头望风' },
        { type:'collect', cleared:false, desc:'船亭下方水草淤积，俯身用木勺便能刮起一层河泥' },
        { type:'trap',    cleared:false, desc:'连接甲板的绳桥松动，容易失足！' },
        { type:'collect', cleared:false, desc:'画舫后甲板湖底藕塘，淤泥堆积' },
      ],
      [
        { type:'battle',  cleared:false, enemyId:'wolf',       desc:'水贼养的恶狗' },
        { type:'entry',   cleared:true,  desc:'主画舫入口，雕梁画栋' },
        { type:'rest',    cleared:false, desc:'船舱内可以休息，有水贼留下的干粮' },
        { type:'battle',  cleared:false, enemyId:'boat_thief', desc:'水贼在船舱内喝酒' },
        { type:'collect', cleared:false, desc:'船尾淤积区，落叶与河泥混合，富含泥料' },
      ],
      [
        { type:'collect', cleared:false, desc:'岸边芦苇丛，水面浮泥厚实' },
        { type:'battle',  cleared:false, enemyId:'boat_thief', desc:'守船的水贼喽啰' },
        { type:'chest',   cleared:false, lootTier:'uncommon',  desc:'船主的私藏宝箱' },
        { type:'event',   cleared:false, desc:'受伤的渔人，被水贼关押于此' },
        null,
      ],
      [
        null,
        { type:'trap',    cleared:false, desc:'甲板腐朽踏空，一脚踩入水中！' },
        { type:'battle',  cleared:false, enemyId:'boat_thief', desc:'水贼精锐轮班守卫' },
        { type:'elite',   cleared:false, enemyId:'boat_thief', desc:'画舫水贼头目，手持钩镰枪' },
        null,
      ],
      [
        null,
        null,
        { type:'chest',   cleared:false, lootTier:'rare',      desc:'最深处船底的密室暗格' },
        { type:'rest',    cleared:false, desc:'船主卧舱，豪华陈设尤在' },
        { type:'boss',    cleared:false, enemyId:'boat_boss',   desc:'【瘦西湖霸主】占据画舫称王称霸' },
      ],
    ],
    startPos: [1, 1],
    bossReward: { exp:440, silver:82, items:[{id:'item_cloth',qty:3},{id:'item_river_mud',qty:2}], manualChance:0.12 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色5】成都·竹林迷阵 - 十字型竹林
  //  特色：十字型布局，中间交叉点有精英怪，四条路通向不同奖励
  // ════════════════════════════════════════════════════════
  dungeon_chengdu_bamboo_maze: {
    id:       'dungeon_chengdu_bamboo_maze',
    desc:     '成都郊外的一片茂密竹林，据说有山贼在此设下迷阵。竹林深处隐约可见一座破旧的茶寮。',
    name:     '竹林迷阵',
    icon:     '🎋',
    theme:    'forest',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['chengdu'],
    terrain:  '竹林',
    floors:   1,
    // 扩展布局：5行×6列，竹林迷宫，含4处采集点
    map: [
      [
        null,
        { type:'chest',   cleared:false, lootTier:'uncommon',   desc:'竹林深处的宝箱，落满竹叶' },
        { type:'battle',  cleared:false, enemyId:'bamboo_thief',desc:'山贼在竹林埋伏' },
        { type:'collect', cleared:false, desc:'向阳竹根旁长着一丛甘草，翻开落叶便能采摘' },
        { type:'collect', cleared:false, desc:'竹溪旁的湿地草甸，野生甘草丛生' },
        null,
      ],
      [
        { type:'battle',  cleared:false, enemyId:'wolf',         desc:'野狼在竹林边缘' },
        { type:'rest',    cleared:false, desc:'破旧茶寮可以歇脚，炉火尚温' },
        { type:'entry',   cleared:true,  desc:'竹林入口，翠竹成荫' },
        { type:'battle',  cleared:false, enemyId:'bamboo_thief', desc:'山贼哨兵把守要道' },
        { type:'chest',   cleared:false, lootTier:'common',      desc:'商人遗失的货箱' },
        { type:'collect', cleared:false, desc:'幽深竹径两侧，竹根间夹杂着大片甘草' },
      ],
      [
        { type:'collect', cleared:false, desc:'药农曾开垦的草圃，甘草长势茂盛' },
        { type:'trap',    cleared:false, desc:'竹林陷阱，竹签暗藏！' },
        { type:'elite',   cleared:false, enemyId:'bamboo_thief', desc:'山贼小头目，武艺高强' },
        { type:'battle',  cleared:false, enemyId:'bamboo_thief', desc:'山贼轮班守在此处' },
        { type:'event',   cleared:false, desc:'被困的采药人，知道出林捷径' },
        null,
      ],
      [
        null,
        { type:'battle',  cleared:false, enemyId:'wolf',         desc:'一群被山贼驱赶的野狼' },
        { type:'chest',   cleared:false, lootTier:'uncommon',    desc:'山贼首领的储粮仓' },
        { type:'trap',    cleared:false, desc:'绊线机关，触发落竹！' },
        { type:'rest',    cleared:false, desc:'茶寮内院，有水有粮' },
        null,
      ],
      [
        null,
        null,
        { type:'battle',  cleared:false, enemyId:'bamboo_thief', desc:'看守BOSS营地的精锐山贼' },
        { type:'boss',    cleared:false, enemyId:'bamboo_boss',  desc:'【竹林山大王】盘踞此地多年，刀法粗犷' },
        null,
        null,
      ],
    ],
    startPos: [1, 2],
    bossReward: { exp:470, silver:86, items:[{id:'item_herb_common',qty:3},{id:'item_iron_ore',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色6】大理·茶马古道驿站 - 线性长条+分支
  //  特色：线性主道+两侧分支，适合探索型玩家
  // ════════════════════════════════════════════════════════
  dungeon_dali_tea_horse_road: {
    id:       'dungeon_dali_tea_horse_road',
    name:     '茶马古道驿站',
    icon:     '🐴',
    desc:     '大理苍山脚下的一个废弃驿站，曾是茶马古道的重要补给点。如今被马贼占据，成为他们打劫商队的据点。',
    theme:    'mountain',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['dali'],
    terrain:  '古道',
    floors:   1,
    // 线性长条+分支布局
    map: [
      [
        { type:'entry',  cleared:true,  desc:'驿站大门，门匾歪斜' },
        { type:'battle', cleared:false, enemyId:'horse_thief',   desc:'马贼哨兵' },
        { type:'chest',  cleared:false, lootTier:'common',     desc:'废弃的货箱' },
        { type:'rest',   cleared:false, desc:'马棚可以休息' },
      ],
      [
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'商人的秘密藏货点' },
        null,
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'马贼养的恶犬' },
        { type:'battle', cleared:false, enemyId:'horse_thief',   desc:'马贼在分赃' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'horse_thief',   desc:'马贼巡逻队' },
        { type:'trap',   cleared:false, desc:'地上的绊马索！' },
        { type:'elite',  cleared:false, enemyId:'horse_thief',   desc:'马贼小队长' },
        { type:'event',  cleared:false, desc:'被俘的商人，求你救他' },
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'马贼头目的宝箱' },
        { type:'boss',   cleared:false, enemyId:'horse_boss', desc:'【马贼大头目】苍山一霸' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:490, silver:92, items:[{id:'item_iron_ore',qty:3},{id:'item_cloth',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色7】洛阳·邙山地宫 - 双层墓穴结构
  //  特色：2层墓穴，上层明殿+下层暗室，有机关陷阱
  // ════════════════════════════════════════════════════════
  dungeon_luoyang_underground_palace: {
    id:       'dungeon_luoyang_underground_palace',
    name:     '邙山地宫',
    icon:     '⚰️',
    desc:     '洛阳邙山脚下的一处古墓，上层是供奉用的明殿，下层是安葬用的暗室。盗墓贼和邪教徒在此活动，阴森恐怖。',
    theme:    'dark',
    minLevel: 1,
    maxLevel: 15,
    nearCities: ['luoyang'],
    terrain:  '墓穴',
    floors:   2,
    // 第一层：明殿 3×4
    map: [
      [
        { type:'entry',  cleared:true,  desc:'地宫入口，石门半开' },
        { type:'battle', cleared:false, enemyId:'tomb_weak',    desc:'墓穴拾荒者在撬石门' },
        { type:'chest',  cleared:false, lootTier:'common',     desc:'破损的祭品箱' },
        { type:'empty',  cleared:false, desc:'明殿正堂，供奉着不知名的神像' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'tomb_weak',    desc:'墓穴拾荒者在啃食骸骨' },
        { type:'rest',   cleared:false, desc:'偏殿可以暂时休息' },
        { type:'trap',   cleared:false, desc:'地上的石板松动，触发机关！' },
        { type:'elite',  cleared:false, enemyId:'tomb_warden',   desc:'古墓守墓人，早已丧失神智' },
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'盗墓贼的赃物箱' },
        { type:'event',  cleared:false, desc:'通往暗室的石门，需要机关开启' },
        null,
      ],
    ],
    // 第二层：暗室 3×5
    floor2Map: [
      [
        { type:'entry',  cleared:true,  desc:'暗室入口，阴风阵阵' },
        { type:'battle', cleared:false, enemyId:'tomb_thief',   desc:'墓穴小贼在举行仪式' },
        { type:'trap',   cleared:false, desc:'毒箭机关！' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'陪葬品箱' },
        { type:'empty',  cleared:false, desc:'暗室甬道，两侧是石棺' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'tomb_weak',   desc:'墓穴拾荒者守在此处' },
        { type:'rest',   cleared:false, desc:'暗室的角落可以藏身' },
        { type:'elite',  cleared:false, enemyId:'tomb_warden',  desc:'古墓守墓人，被邪气驱使' },
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'主墓室的宝藏' },
        { type:'battle', cleared:false, enemyId:'tomb_thief',   desc:'墓穴小贼护卫' },
      ],
      [
        null,
        null,
        { type:'boss',   cleared:false, enemyId:'tomb_boss_new', desc:'【墓穴鬼王】怨气冲天，守护着墓中绝世宝藏' },
        { type:'empty',  cleared:false, desc:'主墓室，棺椁已经打开' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:550, silver:110, items:[{id:'item_cloth',qty:3},{id:'item_herb_common',qty:2}], manualChance:0.18 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色8】幽州·燕山猎场 - 大型狩猎场
  //  特色：4×4大型地图，有多个精英点和隐藏宝箱
  // ════════════════════════════════════════════════════════
  dungeon_youzhou_hunting_ground: {
    id:       'dungeon_youzhou_hunting_ground',
    name:     '燕山猎场',
    icon:     '🏹',
    desc:     '幽州燕山脚下的一片皇家猎场，如今已经荒废。胡人散兵和野兽在此出没，还有传说中的巨熊。',
    theme:    'mountain',
    minLevel: 1,
    maxLevel: 15,
    nearCities: ['youzhou'],
    terrain:  '猎场',
    floors:   1,
    // 扩展布局：5×5猎场山林，补充多条采集支线
    map: [
      [
        { type:'entry',   cleared:true,  desc:'猎场入口，木栅栏破损' },
        { type:'battle',  cleared:false, enemyId:'hunter_thief', desc:'胡人散兵在巡逻' },
        { type:'chest',   cleared:false, lootTier:'common',     desc:'猎人的工具箱' },
        { type:'collect', cleared:false, desc:'林边草甸散着野菜和草药，稍加翻找便有收获' },
        { type:'empty',   cleared:false, desc:'猎场的草地，野兔出没' },
      ],
      [
        { type:'battle',  cleared:false, enemyId:'wolf',        desc:'野狼群' },
        { type:'rest',    cleared:false, desc:'猎人的小屋可以休息' },
        { type:'trap',    cleared:false, desc:'猎人的捕兽夹！' },
        { type:'battle',  cleared:false, enemyId:'hunter_thief', desc:'散兵在埋伏' },
        { type:'collect', cleared:false, desc:'林中老树根旁生着山参幼株，耐心挖掘能采得一些' },
      ],
      [
        { type:'chest',   cleared:false, lootTier:'uncommon',   desc:'猎场的秘密储藏点' },
        { type:'elite',   cleared:false, enemyId:'hunter_thief', desc:'散兵小队长' },
        { type:'battle',  cleared:false, enemyId:'wolf',        desc:'更多的野狼' },
        { type:'empty',   cleared:false, desc:'猎场深处，树木茂密' },
        { type:'collect', cleared:false, desc:'猎径旁的荒坡长着不少可入药的野草' },
      ],
      [
        { type:'battle',  cleared:false, enemyId:'hunter_thief', desc:'巡守山谷口的胡人散兵' },
        { type:'collect', cleared:false, desc:'废弃陷坑附近积着猎人留下的补给与野菜' },
        { type:'elite',   cleared:false, enemyId:'hunter_thief', desc:'散兵精锐' },
        { type:'event',   cleared:false, desc:'受伤的猎户，知道巨熊的位置' },
        null,
      ],
      [
        null,
        { type:'chest',   cleared:false, lootTier:'rare',       desc:'藏在山岩后的猎王私库' },
        { type:'trap',    cleared:false, desc:'山坡滚木突然坠下！' },
        { type:'boss',    cleared:false, enemyId:'hunter_boss', desc:'【燕山猎王】胡人散兵首领，骑射双绝' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:580, silver:120, items:[{id:'item_iron_ore',qty:4},{id:'item_cloth',qty:3}], manualChance:0.18 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色9】福州·闽江码头 - Z字形栈道
  //  特色：Z字形栈道布局，沿江边蜿蜒
  // ════════════════════════════════════════════════════════
  dungeon_fuzhou_dock: {
    id:       'dungeon_fuzhou_dock',
    name:     '闽江码头',
    icon:     '⚓',
    desc:     '福州闽江边的一个废弃码头，栈道沿着江岸蜿蜒。海盗和水贼利用复杂的地形设伏，劫掠过往船只。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['fuzhou'],
    terrain:  '码头',
    floors:   1,
    // 扩展布局：5×5栈桥与滩涂，补充码头采集点
    map: [
      [
        { type:'entry',   cleared:true,  desc:'码头入口，栈桥腐朽' },
        { type:'battle',  cleared:false, enemyId:'dock_thief', desc:'水贼在码头放哨' },
        { type:'collect', cleared:false, desc:'栈桥边的淤泥滩翻开来湿软黏重，可挖出不少河泥' },
        null,
        null,
      ],
      [
        null,
        { type:'chest',   cleared:false, lootTier:'common',    desc:'渔民的破鱼篓' },
        { type:'battle',  cleared:false, enemyId:'wolf',       desc:'野狗在码头游荡' },
        { type:'collect', cleared:false, desc:'岸边废船下积着一层河泥，伸手便能刮下大把泥料' },
        null,
      ],
      [
        { type:'rest',    cleared:false, desc:'废弃的渔棚可以休息' },
        { type:'trap',    cleared:false, desc:'栈桥断裂，小心跌落！' },
        { type:'elite',   cleared:false, enemyId:'dock_thief', desc:'水贼小头目' },
        { type:'chest',   cleared:false, lootTier:'uncommon',  desc:'海盗的赃物箱' },
        { type:'collect', cleared:false, desc:'码头深处的潮湿角落散落江货杂物，也能捡到些本地土产' },
      ],
      [
        { type:'collect', cleared:false, desc:'退潮后的木桩间沉积着厚泥，适合采挖' },
        { type:'battle',  cleared:false, enemyId:'dock_thief', desc:'海盗手下在巡河' },
        { type:'battle',  cleared:false, enemyId:'dock_thief', desc:'闽江水匪在此拦截来人' },
        { type:'rest',    cleared:false, desc:'破旧仓棚里仍有几张草席' },
        null,
      ],
      [
        null,
        null,
        { type:'trap',    cleared:false, desc:'脚下木板突然塌陷！' },
        { type:'boss',    cleared:false, enemyId:'dock_boss',  desc:'【闽江龙王】海盗头目，水性极好' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:460, silver:88, items:[{id:'item_cloth',qty:3}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色10】苏州·虎丘剑池 - 对称式园林
  //  特色：对称式布局，左右镜像，中间是主Boss
  // ════════════════════════════════════════════════════════
  dungeon_suzhou_sword_pool: {
    id:       'dungeon_suzhou_sword_pool',
    name:     '虎丘剑池',
    icon:     '⚔️',
    desc:     '苏州虎丘山下的剑池，传说吴王阖闾葬于此处，以宝剑三千陪葬。如今被一伙地痞流氓占据，他们在池边设下赌局。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['suzhou'],
    terrain:  '园林',
    floors:   1,
    // 对称式布局
    map: [
      [
        { type:'chest',  cleared:false, lootTier:'common',     desc:'左侧的假山石后藏着宝箱' },
        { type:'battle', cleared:false, enemyId:'gambler_thug',   desc:'地痞在池边收保护费' },
        { type:'entry',  cleared:true,  desc:'剑池入口，古木参天' },
        { type:'battle', cleared:false, enemyId:'gambler_thug',   desc:'另一个地痞在望风' },
        { type:'chest',  cleared:false, lootTier:'common',     desc:'右侧的假山石后藏着宝箱' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'野狗在左侧游荡' },
        { type:'rest',   cleared:false, desc:'剑池边的亭子可以休息' },
        { type:'trap',   cleared:false, desc:'池边的石板湿滑，容易摔倒！' },
        { type:'elite',  cleared:false, enemyId:'gambler_thug',   desc:'地痞头目在池中央' },
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'野狗在右侧游荡' },
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'剑池底的秘密藏宝处' },
        { type:'boss',   cleared:false, enemyId:'gambler_boss', desc:'【虎丘赌霸】控制剑池赌局的地头蛇' },
        { type:'event',  cleared:false, desc:'一位输光钱的赌徒，知道赌局的秘密' },
        null,
      ],
    ],
    startPos: [1, 1],
    bossReward: { exp:470, silver:90, items:[{id:'item_iron_ore',qty:2},{id:'item_herb_common',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色11】晋阳·汾河渡口 - 河心岛布局
  //  特色：河心岛为中心，两岸为分支
  // ════════════════════════════════════════════════════════
  dungeon_jinyang_ferry: {
    id:       'dungeon_jinyang_ferry',
    name:     '汾河渡口',
    icon:     '🚣',
    desc:     '晋阳城外的汾河渡口，河心有一个小岛，是马贼的秘密据点。两岸是废弃的码头，中间需要渡河。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['jinyang'],
    terrain:  '渡口',
    floors:   1,
    // 扩展布局：4×5渡口与河心岛，加入河滩采集点
    map: [
      [
        { type:'entry',   cleared:true,  desc:'渡口北岸，船只稀少' },
        { type:'battle',  cleared:false, enemyId:'ferry_thief', desc:'马贼在北岸放哨' },
        { type:'collect', cleared:false, desc:'北岸浅滩堆着湿泥与碎石，翻找可得些河泥与矿砂' },
        { type:'chest',   cleared:false, lootTier:'common',     desc:'遗弃的货箱' },
        null,
      ],
      [
        { type:'trap',    cleared:false, desc:'渡河的小船摇晃不稳！' },
        { type:'rest',    cleared:false, desc:'河心岛可以休息' },
        { type:'elite',   cleared:false, enemyId:'ferry_thief', desc:'马贼小头目' },
        { type:'battle',  cleared:false, enemyId:'wolf',        desc:'马贼养的恶犬' },
        { type:'collect', cleared:false, desc:'河心岛背阴处沉积着厚泥，伸手即可挖取' },
      ],
      [
        { type:'collect', cleared:false, desc:'废弃木桩旁卡着不少铁锈碎件和河砂' },
        { type:'chest',   cleared:false, lootTier:'uncommon',   desc:'马贼的赃物' },
        { type:'battle',  cleared:false, enemyId:'ferry_thief', desc:'守在岛南的马贼喽啰' },
        { type:'event',   cleared:false, desc:'被俘的摆渡人，知道马贼的弱点' },
        null,
      ],
      [
        null,
        { type:'trap',    cleared:false, desc:'岸边绳桥突然松脱！' },
        { type:'rest',    cleared:false, desc:'废船残舱还能避风' },
        { type:'boss',    cleared:false, enemyId:'ferry_boss',  desc:'【汾河马王】马贼首领，骑术精湛' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:480, silver:92, items:[{id:'item_iron_ore',qty:3},{id:'item_cloth',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色12】嵩山·少林寺外塔林 - 塔林迷宫
  //  特色：塔林式布局，多路径选择，有隐藏宝箱
  // ════════════════════════════════════════════════════════
  dungeon_songshan_pagoda_forest: {
    id:       'dungeon_songshan_pagoda_forest',
    name:     '少林寺外塔林',
    icon:     '🏯',
    desc:     '嵩山少林寺外的塔林，历代高僧圆寂后建塔于此。塔林错综复杂，山贼利用地形设伏，甚至敢在佛塔前行凶。',
    theme:    'mountain',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['songshan'],
    terrain:  '塔林',
    floors:   1,
    // 塔林迷宫布局
    map: [
      [
        { type:'entry',  cleared:true,  desc:'塔林入口，古塔林立' },
        { type:'event', cleared:false, desc:'塔间小径，古塔耸立' },
        { type:'battle', cleared:false, enemyId:'pagoda_thief',   desc:'山贼在塔间埋伏' },
        { type:'event', cleared:false, desc:'塔间小径，尽头有闪光' },
        { type:'chest',  cleared:false, lootTier:'common',     desc:'香客落下的香油钱袋' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'野狗在塔林游荡' },
        { type:'rest',   cleared:false, desc:'塔下的石凳可以休息' },
        { type:'event', cleared:false, desc:'塔间小径' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'塔基下的秘密藏宝处' },
        { type:'battle', cleared:false, enemyId:'pagoda_thief',   desc:'山贼在塔后躲藏' },
      ],
      [
        { type:'event', cleared:false, desc:'塔基旁的石径' },
        { type:'trap',   cleared:false, desc:'塔林中的陷阱！' },
        { type:'elite',  cleared:false, enemyId:'pagoda_thief',   desc:'山贼小头目' },
        { type:'battle', cleared:false, enemyId:'pagoda_thief',   desc:'山贼手下' },
        { type:'event', cleared:false, desc:'塔林边缘的小径' },
      ],
      [
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'高僧塔中的遗物' },
        { type:'event', cleared:false, desc:'塔基旁的石径' },
        { type:'event',  cleared:false, desc:'一位老僧，知道山贼的藏身之处' },
        { type:'boss',   cleared:false, enemyId:'pagoda_boss', desc:'【塔林恶霸】胆敢在佛门清净地行凶' },
        { type:'event', cleared:false, desc:'塔林边缘' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:490, silver:95, items:[{id:'item_cloth',qty:3},{id:'item_herb_common',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色13】岳阳·洞庭渔寨 - 水上浮村
  //  特色：浮村式布局，多个小岛/浮台连接
  // ════════════════════════════════════════════════════════
  dungeon_yueyang_fishing_village: {
    id:       'dungeon_yueyang_fishing_village',
    name:     '洞庭渔寨',
    icon:     '🛖',
    desc:     '岳阳洞庭湖上的一个水上渔村，房屋建在水桩上，用木板连接。水贼占据了这个渔寨，劫掠过往渔船。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['yueyang'],
    terrain:  '渔寨',
    floors:   1,
    // 扩展布局：5×5浮台渔寨，增加水边采集点
    map: [
      [
        { type:'entry',   cleared:true,  desc:'渔寨入口，木桥摇晃' },
        { type:'collect', cleared:false, desc:'桥边淤泥里埋着不少黑泥，俯身便可掏出几把' },
        { type:'battle',  cleared:false, enemyId:'fishing_thief', desc:'水贼在桥头把守' },
        { type:'chest',   cleared:false, lootTier:'common',     desc:'渔民的破鱼篓' },
        null,
      ],
      [
        { type:'battle',  cleared:false, enemyId:'wolf',        desc:'野狗在浮台上' },
        { type:'rest',    cleared:false, desc:'渔棚可以休息' },
        { type:'trap',    cleared:false, desc:'木板腐朽，容易踩空！' },
        { type:'collect', cleared:false, desc:'桩脚之间沉着厚厚湖泥，适合反复采挖' },
        null,
      ],
      [
        { type:'collect', cleared:false, desc:'被废弃的小船底部积着湿泥与湖底杂物' },
        { type:'chest',   cleared:false, lootTier:'uncommon',   desc:'水贼的赃物' },
        { type:'elite',   cleared:false, enemyId:'fishing_thief', desc:'水贼小头目' },
        { type:'battle',  cleared:false, enemyId:'fishing_thief', desc:'水贼手下' },
        null,
      ],
      [
        { type:'event',   cleared:false, desc:'被俘的渔民，知道水贼的弱点' },
        { type:'battle',  cleared:false, enemyId:'fishing_thief', desc:'守着主寨的水匪' },
        { type:'rest',    cleared:false, desc:'空置渔屋里还有些干柴' },
        { type:'boss',    cleared:false, enemyId:'fishing_boss', desc:'【洞庭水霸】渔寨的实际控制者' },
        null,
      ],
      [
        null,
        { type:'collect', cleared:false, desc:'浮台尽头芦苇根部堆着一层软泥，越挖越深' },
        { type:'trap',    cleared:false, desc:'朽木突然断裂，险些跌入湖中！' },
        { type:'chest',   cleared:false, lootTier:'common',     desc:'渔网和破木箱堆里藏着些旧物' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:470, silver:90, items:[{id:'item_cloth',qty:3}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ════════════════════════════════════════════════════════
  //  【特色14】明州·甬江盐场 - 盐田网格
  //  特色：网格状盐田布局，规整但有隐藏路径
  // ════════════════════════════════════════════════════════
  dungeon_mingzhou_salt_field: {
    id:       'dungeon_mingzhou_salt_field',
    name:     '甬江盐场',
    icon:     '🧂',
    desc:     '明州甬江边的一个废弃盐场，盐田纵横交错。走私贩子利用盐田的复杂地形藏匿货物，逃避官府追查。',
    theme:    'water',
    minLevel: 1,
    maxLevel: 12,
    nearCities: ['mingzhou'],
    terrain:  '盐场',
    floors:   1,
    // 网格状盐田布局
    map: [
      [
        { type:'entry',  cleared:true,  desc:'盐场入口，盐堆如山' },
        { type:'battle', cleared:false, enemyId:'salt_field_thief',   desc:'走私贩子在盐堆后' },
        { type:'chest',  cleared:false, lootTier:'common',     desc:'破损的盐袋' },
        { type:'empty',  cleared:false, desc:'盐田空地，白茫茫一片' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'野狗在盐场觅食' },
        { type:'rest',   cleared:false, desc:'盐工的茅屋可以休息' },
        { type:'trap',   cleared:false, desc:'盐坑陷阱，踩进去会陷住！' },
        { type:'battle', cleared:false, enemyId:'salt_field_thief',   desc:'走私贩子巡逻' },
      ],
      [
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'走私贩子的藏货点' },
        { type:'elite',  cleared:false, enemyId:'salt_field_thief',   desc:'走私小头目' },
        { type:'battle', cleared:false, enemyId:'salt_field_thief',   desc:'走私贩子手下' },
        { type:'event',  cleared:false, desc:'被胁迫的盐工，知道走私路线的秘密' },
      ],
      [
        null,
        null,
        { type:'boss',   cleared:false, enemyId:'salt_field_boss', desc:'【盐场枭雄】走私团伙的首领' },
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'走私头目的私藏' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:480, silver:92, items:[{id:'item_iron_ore',qty:2},{id:'item_cloth',qty:2}], manualChance:0.15 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ──────────────────────────────────────
  dungeon_bandit_camp: {
    id:       'dungeon_bandit_camp',
    name:     '黑风寨',
    icon:     '🏕️',
    desc:     '长安城郊臭名昭著的山贼营寨，黑风大当家率众打家劫舍，过往商队无不绕道而行。',
    theme:    'camp',
    minLevel: 8,
    maxLevel: 20,
    nearCities: ['xian', 'bin_zhou'],
    terrain:  '山地',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'黑风寨山门，两侧插着骷髅旗' },
        { type:'battle', cleared:false, enemyId:'bandit_foot',   desc:'山门守卫，正在打牌偷懒' },
        { type:'battle', cleared:false, enemyId:'bandit_archer', desc:'营寨箭楼上的弓箭手' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'劫来的财物箱' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'bandit_foot',   desc:'巡逻的小喽啰' },
        { type:'rest',   cleared:false, desc:'营寨篝火，气息幽静' },
        { type:'elite',  cleared:false, enemyId:'bandit_chief_low', desc:'二当家，擅使流星锤' },
        { type:'trap',   cleared:false, desc:'绊马索和暗哨，一不小心就会惊动全寨' },
        { type:'chest',  cleared:false, lootTier:'rare',          desc:'二当家私藏的宝贝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'bandit_archer', desc:'营寨内的弓手' },
        { type:'event',  cleared:false, desc:'被关押的行商，给你情报换自由' },
        { type:'battle', cleared:false, enemyId:'bandit_chief_low', desc:'大当家的贴身护卫' },
        { type:'boss',   cleared:false, enemyId:'bandit_boss',    desc:'【黑风大当家】豪横悍匪，力大无穷' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    1200,
      silver: 200,
      items:  [
        { id:'item_iron_ore',    qty:5 },
        { id:'item_herb_common', qty:3 },
      ],
      manualChance: 0.20,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ══════════════════════════════════════
  //  二、中级区（Lv15-35）
  // ══════════════════════════════════════

  dungeon_ghost_temple: {
    id:       'dungeon_ghost_temple',
    name:     '荒庙幽魂祠',
    icon:     '👻',
    desc:     '扬州城郊一座荒废百年的古庙，夜间常有鬼火游荡，村民称传闻庙中封印着古代煞气。',
    theme:    'ghost',
    minLevel: 15,
    maxLevel: 35,
    nearCities: ['yangzhou', 'nanjing'],
    terrain:  '平原',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'破败庙门，朱漆斑驳' },
        { type:'event',  cleared:false, desc:'庙门石碑上刻着封印符文，感觉有危险气息' },
        { type:'battle', cleared:false, enemyId:'ghost_lv1',     desc:'游荡的怨灵，久死不散' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'供桌上残留的古旧香盒' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'ghost_lv1',     desc:'庙廊中漂浮的鬼火' },
        { type:'trap',   cleared:false, desc:'触动了古老机关，石板从脚下崩塌！' },
        { type:'rest',   cleared:false, desc:'庙中香炉尚有余温，在此打坐可回复精力' },
        { type:'battle', cleared:false, enemyId:'ghost_lv1',     desc:'两道厉鬼挡住了去路' },
        { type:'elite',  cleared:false, enemyId:'ghost_lv2',     desc:'古庙守魂，死守禁地' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'ghost_lv1',     desc:'怨气弥漫的内殿' },
        { type:'chest',  cleared:false, lootTier:'rare',          desc:'封印在佛像背后的古匣' },
        { type:'event',  cleared:false, desc:'一个道士被鬼气缠身，请求你驱魔救他' },
        { type:'boss',   cleared:false, enemyId:'ghost_boss_low', desc:'【千年凶煞】被镇压在此的古代恶灵' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    3000,
      silver: 350,
      items:  [
        { id:'item_herb_rare',   qty:3 },
        { id:'item_ghost_bone',  qty:2 },
      ],
      manualChance: 0.25,
    },
    unlocks: ['dungeon_mingjiao_cave'],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ──────────────────────────────────────
  dungeon_poison_swamp: {
    id:       'dungeon_poison_swamp',
    name:     '毒雾沼泽',
    icon:     '🐍',
    desc:     '苗疆深处的天然毒沼，五毒教在此豢养大量毒物。中毒后不解毒则气血持续下降。',
    theme:    'swamp',
    minLevel: 20,
    maxLevel: 40,
    nearCities: ['wudu_miao', 'guiyang'],
    terrain:  '丛林',
    floors:   1,
    specialRule: 'poison_aura',  // 特殊规则：每3步触发中毒效果
    map: [
      [
        { type:'entry',  cleared:true,  desc:'沼泽入口，毒雾弥漫' },
        { type:'battle', cleared:false, enemyId:'poison_snake',  desc:'一条巨型毒蛇盘在路中央' },
        { type:'trap',   cleared:false, desc:'踩中毒液陷阱，被喷了一脸毒雾！' },
        { type:'battle', cleared:false, enemyId:'five_poison_disciple', desc:'五毒教外门弟子' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'五毒教遗留的药箱' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'poison_spider', desc:'几只硕大的毒蜘蛛从草丛跳出' },
        { type:'rest',   cleared:false, desc:'沼泽中一块干燥的石台，可以暂时休息解毒' },
        { type:'event',  cleared:false, desc:'遇见一个采药人，他知道沼泽深处的秘密' },
        { type:'battle', cleared:false, enemyId:'five_poison_disciple', desc:'守护蛊巢的教众' },
        { type:'elite',  cleared:false, enemyId:'five_poison_elder',    desc:'五毒教长老，通晓百毒' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'poison_snake',  desc:'两条蛇王挡住去路' },
        { type:'chest',  cleared:false, lootTier:'rare',          desc:'隐藏在毒花丛中的宝匣' },
        { type:'trap',   cleared:false, desc:'踩破蛊巢，毒虫四散！' },
        { type:'boss',   cleared:false, enemyId:'five_poison_boss', desc:'【五毒教坛主】蛊毒大师，神出鬼没' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    4500,
      silver: 500,
      items:  [
        { id:'item_poison_gland', qty:4 },
        { id:'item_herb_rare',    qty:3 },
        { id:'item_antidote',     qty:2 },
      ],
      manualChance: 0.28,
    },
    unlocks: [],
    restInterval: 2,  // 中毒沼泽更频繁回血
    restHealPct:  0.12,
  },

  // ══════════════════════════════════════
  //  三、高级区（Lv35-60）
  // ══════════════════════════════════════

  dungeon_mingjiao_cave: {
    id:       'dungeon_mingjiao_cave',
    name:     '明教火焰窟',
    icon:     '🔥',
    desc:     '明教在昆仑山腹中开凿的秘密据点，供奉圣火教义。内有重重机关和精锐教众把守。',
    theme:    'fire',
    minLevel: 35,
    maxLevel: 60,
    nearCities: ['chengdu', 'hanzhong'],
    terrain:  '高山',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'火焰窟入口，岩壁上雕刻着烈焰图腾' },
        { type:'battle', cleared:false, enemyId:'mingjiao_soldier',  desc:'明教护卫，手持火把' },
        { type:'trap',   cleared:false, desc:'机关喷火，险些被灼伤！' },
        { type:'chest',  cleared:false, lootTier:'rare',              desc:'明教秘典残卷' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'mingjiao_soldier',  desc:'巡逻的教众' },
        { type:'rest',   cleared:false, desc:'洞窟中的火盆，可以在此烤干衣物休整' },
        { type:'battle', cleared:false, enemyId:'mingjiao_elder',    desc:'明教火焰使者' },
        { type:'event',  cleared:false, desc:'一个被囚禁的江湖客，愿以秘密换取自由' },
        { type:'chest',  cleared:false, lootTier:'epic',              desc:'明教圣火令碎片' },
      ],
      [
        null,
        { type:'elite',  cleared:false, enemyId:'mingjiao_elder',    desc:'火焰法王，内功精深' },
        { type:'battle', cleared:false, enemyId:'mingjiao_soldier',  desc:'守护内殿的精锐' },
        { type:'trap',   cleared:false, desc:'落石机关！砸下一片碎石！' },
        { type:'boss',   cleared:false, enemyId:'evil_fire_boss',    desc:'【烈焰护法】明教四大法王之一' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    8000,
      silver: 800,
      items:  [
        { id:'item_fire_crystal',  qty:3 },
        { id:'item_spirit_stone',  qty:2 },
      ],
      manualChance: 0.30,
    },
    unlocks: ['dungeon_xuanming_lair'],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ──────────────────────────────────────
  dungeon_ice_cavern: {
    id:       'dungeon_ice_cavern',
    name:     '天山冰魄洞',
    icon:     '❄️',
    desc:     '天山绝顶的冰川洞穴，终年冰封。逍遥派弟子曾在此寻访无崖子留下的武学秘藏，却一去不回。',
    theme:    'ice',
    minLevel: 40,
    maxLevel: 65,
    nearCities: ['tianshan_peak'],
    terrain:  '冰原',
    floors:   1,
    specialRule: 'freeze_floor',  // 特殊规则：冰面打滑，移动偶尔随机偏移一格
    map: [
      [
        { type:'entry',  cleared:true,  desc:'冰洞入口，寒气逼人，呼气成霜' },
        { type:'battle', cleared:false, enemyId:'snow_wolf',       desc:'雪狼群守在洞口' },
        { type:'chest',  cleared:false, lootTier:'rare',            desc:'冻在冰壁里的古代包裹' },
        null,
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'ice_ghost',       desc:'冰魂鬼魅，以寒气伤人' },
        { type:'trap',   cleared:false, desc:'踩破薄冰，掉入冰水，损失气血！' },
        { type:'rest',   cleared:false, desc:'洞中的温泉眼，温热的泉水可以回复体力' },
        { type:'elite',  cleared:false, enemyId:'snow_eagle',      desc:'雪域神鹰俯冲攻击' },
        { type:'chest',  cleared:false, lootTier:'epic',            desc:'逍遥派弟子留下的锦囊' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'snow_leopard',    desc:'冰原雪豹，极速猎手' },
        { type:'event',  cleared:false, desc:'逍遥派失踪弟子的遗言残简，记载着洞中机密' },
        { type:'battle', cleared:false, enemyId:'ice_ghost',       desc:'两道冰魂联手袭来' },
        { type:'boss',   cleared:false, enemyId:'ice_boss',        desc:'【天山冰魄】洞中最强的冰灵之王' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    10000,
      silver: 1000,
      items:  [
        { id:'item_ice_crystal',   qty:4 },
        { id:'item_spirit_stone',  qty:3 },
      ],
      manualChance: 0.32,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ══════════════════════════════════════
  //  四、精英区（Lv60-90）
  // ══════════════════════════════════════

  dungeon_xuanming_lair: {
    id:       'dungeon_xuanming_lair',
    name:     '玄冥主坛',
    icon:     '☠️',
    desc:     '玄冥教的核心据点，藏匿于幽州荒漠之中。坛内高手如云，连正道联盟都不敢轻易踏入。',
    theme:    'dark',
    minLevel: 60,
    maxLevel: 90,
    nearCities: ['youzhou', 'anyang'],
    terrain:  '平原',
    floors:   2,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'玄冥坛外围，阴气沉沉' },
        { type:'battle', cleared:false, enemyId:'xuanming_disciple',   desc:'玄冥外坛弟子' },
        { type:'battle', cleared:false, enemyId:'xuanming_disciple',   desc:'两个巡逻护坛弟子' },
        { type:'trap',   cleared:false, desc:'玄冥幻阵迷阵，迷失方向损失精力！' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'玄冥弟子携带的秘药' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'xuanming_disciple',   desc:'守卫内坛的武士' },
        { type:'rest',   cleared:false, desc:'外坛密室，暂时安全' },
        { type:'elite',  cleared:false, enemyId:'xuanming_envoy',      desc:'玄冥主坛使者，阴寒内力' },
        { type:'event',  cleared:false, desc:'玄冥坛主手下叛徒，愿意提供内部情报' },
        { type:'battle', cleared:false, enemyId:'xuanming_envoy',      desc:'另一路主坛使者' },
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'legendary',          desc:'玄冥圣物，传说级宝物' },
        { type:'elite',  cleared:false, enemyId:'xuanming_envoy',      desc:'内坛长老，修为高深' },
        { type:'trap',   cleared:false, desc:'阴毒机关，触发后中毒！' },
        { type:'boss',   cleared:false, enemyId:'xuanming_boss',       desc:'【玄冥坛主】北冥功法大成，极为危险' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    18000,
      silver: 2000,
      items:  [
        { id:'item_chaos_essence', qty:2 },
        { id:'item_spirit_stone',  qty:5 },
        { id:'item_dark_crystal',  qty:3 },
      ],
      manualChance: 0.40,
    },
    unlocks: ['dungeon_blood_bone_fortress'],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ══════════════════════════════════════
  //  五、终极区（Lv90-120）
  // ══════════════════════════════════════

  dungeon_blood_bone_fortress: {
    id:       'dungeon_blood_bone_fortress',
    name:     '血骨要塞',
    icon:     '🔴',
    desc:     '血骨门在幽州郊外修建的终极据点，骨冥子藏身于此。夺取玄铁令的最终决战就在这里。',
    theme:    'blood',
    minLevel: 90,
    maxLevel: 120,
    nearCities: ['youzhou'],
    terrain:  '平原',
    floors:   3,
    isMainQuestDungeon: true,  // 主线地下城
    map: [
      [
        { type:'entry',  cleared:true,  desc:'血骨要塞外城，断骨横陈' },
        { type:'battle', cleared:false, enemyId:'blood_bone_soldier',  desc:'血骨门外门战士' },
        { type:'battle', cleared:false, enemyId:'blood_bone_soldier',  desc:'两个巡逻卫兵' },
        { type:'trap',   cleared:false, desc:'血骨机关，滴血激活！损失气血！' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'血骨门战利品箱' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_soldier',  desc:'守门精锐' },
        { type:'rest',   cleared:false, desc:'缴获的物资点，可以补给' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_altar_master', desc:'血骨门坛主，以鲜血为力量' },
        { type:'event',  cleared:false, desc:'被血骨门俘虏的武林人士，求你救出他们' },
        { type:'chest',  cleared:false, lootTier:'legendary',          desc:'血骨门密库，藏有至宝' },
      ],
      [
        null,
        { type:'elite',  cleared:false, enemyId:'blood_bone_vice_master', desc:'血骨门副门主，骨冥子的左膀右臂' },
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master', desc:'内殿精锐护卫' },
        { type:'trap',   cleared:false, desc:'血骨阵法激活，一时迷失方向！' },
        { type:'boss',   cleared:false, enemyId:'gu_ming_zi',          desc:'【骨冥子】血骨门门主，炼骨绝学天下无双' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    50000,
      silver: 5000,
      items:  [
        { id:'item_dragon_scale',  qty:2 },
        { id:'item_chaos_essence', qty:5 },
        { id:'item_spirit_stone',  qty:10 },
      ],
      manualChance: 0.60,
      specialReward: 'xuantie_ling',  // 主线道具：玄铁令
    },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.12,
  },

  // ══════════════════════════════════════
  //  六、新增地下城（对应敌人库扩充）
  // ══════════════════════════════════════

  // ── 1. 深山猎场（Lv5-18，小型，2行×4列）──
  dungeon_wild_hunting_ground: {
    id:       'dungeon_wild_hunting_ground',
    name:     '深山猎场',
    icon:     '🐯',
    desc:     '南阳山地深处的原始猎场，虎狼成群、野猪横行。猎户轻易不敢独自入内，据说山腹有一头巨熊称王称霸。',
    theme:    'mountain',
    minLevel: 5,
    maxLevel: 18,
    nearCities: ['ruzhou', 'nanyang'],
    terrain:  '密林',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'猎场入口，地上有新鲜爪印' },
        { type:'battle', cleared:false, enemyId:'wild_boar',    desc:'一头愤怒的野猪冲来' },
        { type:'battle', cleared:false, enemyId:'wolf',         desc:'两只饿狼从灌木中窜出' },
        { type:'trap',   cleared:false, desc:'猎人废弃的铁夹，踩中后损失气血！' },
        { type:'chest',  cleared:false, lootTier:'common',      desc:'猎户遗落的猎袋，里面还有些东西' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wolf_alpha',   desc:'带着狼群的巨狼首领' },
        { type:'battle', cleared:false, enemyId:'tiger_normal', desc:'守在兽道的猛虎' },
        { type:'rest',   cleared:false, desc:'山涧清泉，可以饮水疗伤' },
        { type:'elite',  cleared:false, enemyId:'black_bear',   desc:'壮年黑熊，体型庞大' },
        { type:'boss',   cleared:false, enemyId:'black_bear', desc:'【黑背熊王】山中霸主，力大如山' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    900,
      silver: 140,
      items:  [
        { id:'item_fur',          qty:4 },
        { id:'item_herb_common',  qty:4 },
        { id:'item_beast_bone',   qty:3 },
      ],
      manualChance: 0.14,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ── 2. 山贼总寨（Lv10-25，中型，3行×5列）──
  dungeon_bandit_stronghold: {
    id:       'dungeon_bandit_stronghold',
    name:     '虎啸山总寨',
    icon:     '🏴',
    desc:     '长安北面最大的山贼据点，山贼头目将各路喽啰统一收编，手下有数百人马，官府多次清剿均无功而返。',
    theme:    'camp',
    minLevel: 10,
    maxLevel: 25,
    nearCities: ['xian', 'bin_zhou'],
    terrain:  '山地',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'总寨外围栅栏，旗帜招展' },
        { type:'battle', cleared:false, enemyId:'bandit_scout',  desc:'哨探斥候，眼神警惕' },
        { type:'battle', cleared:false, enemyId:'bandit_scout',  desc:'两人一组的巡逻队' },
        { type:'trap',   cleared:false, desc:'暗哨鸣箭，惊动附近喽啰！损失精力' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'路边随意堆着的劫来货物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'bandit_scout',  desc:'守营门的喽啰' },
        { type:'rest',   cleared:false, desc:'山寨炊房，趁没人可以偷偷吃一顿补血' },
        { type:'elite',  cleared:false, enemyId:'bandit_chief',  desc:'山寨二掌柜，使一把长刀' },
        { type:'event',  cleared:false, desc:'被关押的朝廷信使，愿以重金答谢救命之恩' },
        { type:'chest',  cleared:false, lootTier:'rare',          desc:'二掌柜私藏的宝贝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'bandit_scout',  desc:'总寨内殿守卫' },
        { type:'battle', cleared:false, enemyId:'bandit_chief',  desc:'大掌柜的贴身护卫' },
        { type:'trap',   cleared:false, desc:'油锅机关，触发后烫伤！' },
        { type:'boss',   cleared:false, enemyId:'bandit_chief',  desc:'【山贼总头目】虎啸山大当家，号称"断路虎"' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    2000,
      silver: 300,
      items:  [
        { id:'item_iron_ore',    qty:6 },
        { id:'item_cloth',       qty:4 },
        { id:'item_elixir_low',  qty:2 },
      ],
      manualChance: 0.18,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ── 3. 华山剑宗密道（Lv25-45，中型，3行×5列）──
  dungeon_huashan_sword_path: {
    id:       'dungeon_huashan_sword_path',
    name:     '华山剑宗密道',
    icon:     '⚔️',
    desc:     '华山绝壁背后隐藏的秘密剑道，剑宗弟子在此苦练剑法，外人一旦闯入便是生死之局。传闻密道深处藏有剑宗失传剑谱。',
    theme:    'mountain',
    minLevel: 25,
    maxLevel: 45,
    nearCities: ['huazhou', 'xian'],
    terrain:  '高山',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'密道入口，剑气隐隐可感' },
        { type:'battle', cleared:false, enemyId:'huashan_sword_disciple', desc:'把守要道的剑宗弟子' },
        { type:'trap',   cleared:false, desc:'剑气机关，触发后被剑气刮伤！' },
        { type:'chest',  cleared:false, lootTier:'rare',                   desc:'弟子遗落的剑法心得残卷' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'huashan_sword_disciple', desc:'两名剑术精湛的弟子联手' },
        { type:'rest',   cleared:false, desc:'练剑台旁的石椅，剑气中打坐别有一番意境' },
        { type:'elite',  cleared:false, enemyId:'huashan_sword_disciple', desc:'剑宗核心弟子，剑法已臻化境' },
        { type:'event',  cleared:false, desc:'一位迷途的剑宗弟子，不想与你为敌，或许可以谈判' },
        { type:'chest',  cleared:false, lootTier:'epic',                   desc:'石壁夹缝中的铁匣，藏有剑谱残页' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'huashan_sword_disciple', desc:'守卫密室的精锐弟子' },
        { type:'battle', cleared:false, enemyId:'huashan_sword_disciple', desc:'最后的守关弟子' },
        { type:'trap',   cleared:false, desc:'华山剑阵激活，剑光四射！' },
        { type:'boss',   cleared:false, enemyId:'huashan_sword_master',   desc:'【剑宗长老·风无痕】一剑开山，当世剑道宗师' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    5000,
      silver: 600,
      items:  [
        { id:'item_spirit_stone',  qty:2 },
        { id:'item_sword_shard',   qty:3 },
      ],
      manualChance: 0.28,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 4. 少林铜人阵（Lv30-50，中型，3行×5列）──
  dungeon_shaolin_copper_array: {
    id:       'dungeon_shaolin_copper_array',
    name:     '少室山铜人阵',
    icon:     '🤺',
    desc:     '少林寺传承千年的考验之所，铜铸罗汉按古法排布，以内力驱动，专为磨砺弟子筋骨。外人入阵若无真本事，轻则重伤，重则丧命。',
    theme:    'temple',
    minLevel: 30,
    maxLevel: 50,
    nearCities: ['nanyang'],
    terrain:  '寺庙',
    floors:   1,
    specialRule: 'no_weapon_bonus',  // 特殊：铜人阵以内力制胜，兵器加成减半
    map: [
      [
        { type:'entry',  cleared:true,  desc:'铜人阵入口，十八铜人栩栩如生' },
        { type:'battle', cleared:false, enemyId:'copper_guardian',  desc:'第一道：两尊铜人守门罗汉' },
        { type:'trap',   cleared:false, desc:'暗格机关，铜臂横扫！损失大量气血' },
        { type:'rest',   cleared:false, desc:'阵中禅房，可以调息打坐' },
        { type:'chest',  cleared:false, lootTier:'rare',             desc:'前人通过铜人阵的奖励遗留' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'copper_guardian',  desc:'第二道：移动铜人，攻势凌厉' },
        { type:'event',  cleared:false, desc:'一位少林弟子在此修炼，他可以给你一些建议' },
        { type:'battle', cleared:false, enemyId:'copper_protector', desc:'第三道：铜人护法，铁甲难破' },
        { type:'trap',   cleared:false, desc:'铜人联动阵法，四面合围！' },
        { type:'chest',  cleared:false, lootTier:'epic',             desc:'少林秘传的护体心法残页' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'copper_protector', desc:'第四道：双铜人夹击' },
        { type:'battle', cleared:false, enemyId:'copper_guardian',  desc:'第五道：铜人群阵' },
        { type:'elite',  cleared:false, enemyId:'copper_protector', desc:'第六道：精铁护法，所向无敌' },
        { type:'boss',   cleared:false, enemyId:'copper_arhat',     desc:'【铜人罗汉·金身】终极铜人，以佛力驱动，金身难伤' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    6000,
      silver: 700,
      items:  [
        { id:'item_copper_core',   qty:3 },
        { id:'item_spirit_stone',  qty:3 },
      ],
      manualChance: 0.30,
    },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.12,
  },

  // ── 5. 千年古墓（Lv35-55，大型，4行×6列）──
  dungeon_ancient_tomb: {
    id:       'dungeon_ancient_tomb',
    name:     '千年阴王墓',
    icon:     '⚰️',
    desc:     '中原腹地一座埋没千年的王侯古墓，近年地表裂开，阴气外泄，周边百姓夜闻鬼哭。墓中自有千年尸骸因阴气复活，成为不死之灾。',
    theme:    'tomb',
    minLevel: 35,
    maxLevel: 55,
    nearCities: ['luoyang', 'anyang'],
    terrain:  '地下墓穴',
    floors:   2,
    specialRule: 'undead_regen',   // 特殊：亡灵每3轮回复少量气血，须快速击破
    map: [
      [
        { type:'entry',  cleared:true,  desc:'古墓入口，阴风扑面，烛火摇曳' },
        { type:'battle', cleared:false, enemyId:'tomb_zombie',           desc:'刚刚苏醒的古墓僵尸' },
        { type:'trap',   cleared:false, desc:'墓道机关，毒针射出！损失气血并中毒' },
        { type:'chest',  cleared:false, lootTier:'uncommon',              desc:'陪葬品散落一地' },
        { type:'battle', cleared:false, enemyId:'tomb_zombie',           desc:'僵尸群拥堵在岔路口' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'ancient_undead_soldier',desc:'千年尸兵，身披残甲' },
        { type:'rest',   cleared:false, desc:'墓中神龛，燃香可以驱邪，稍作休息' },
        { type:'battle', cleared:false, enemyId:'tomb_zombie',           desc:'两具刚复活的僵尸' },
        { type:'elite',  cleared:false, enemyId:'tomb_guardian_spirit',  desc:'墓道守灵，以阴气为武器' },
        { type:'chest',  cleared:false, lootTier:'rare',                  desc:'内棺旁的陪葬宝匣' },
        { type:'event',  cleared:false, desc:'一位盗墓贼被困在此，知道墓主秘密的所在' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'ancient_undead_soldier',desc:'内殿守卫尸兵，久历修炼' },
        { type:'trap',   cleared:false, desc:'崩塌机关！石块砸落，损失大量气血' },
        { type:'battle', cleared:false, enemyId:'tomb_guardian_spirit',  desc:'两道守灵联手阻拦' },
        { type:'chest',  cleared:false, lootTier:'epic',                  desc:'墓主棺前的宝物台' },
        null,
      ],
      [
        null,
        null,
        { type:'battle', cleared:false, enemyId:'ancient_undead_soldier',desc:'最后的尸兵卫队' },
        { type:'elite',  cleared:false, enemyId:'tomb_guardian_spirit',  desc:'墓主生前侍卫的残魂' },
        { type:'trap',   cleared:false, desc:'千年阴阵发动，阴气伤体！' },
        { type:'boss',   cleared:false, enemyId:'undead_king',           desc:'【千年尸王·幽冥君】古代诸侯化身亡灵，统御墓中一切死灵' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    7500,
      silver: 900,
      items:  [
        { id:'item_ghost_bone',    qty:4 },
        { id:'item_spirit_stone',  qty:3 },
        { id:'item_ancient_jade',  qty:2 },
      ],
      manualChance: 0.32,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 6. 桃花岛秘境（Lv40-60，小型，2行×4列）──
  dungeon_peach_island_secret: {
    id:       'dungeon_peach_island_secret',
    name:     '桃花岛内阵',
    icon:     '🌸',
    desc:     '桃花岛深处由东邪精心布下的迷踪阵，阵中幻象丛生，闯阵者往往迷失其中，最终力竭。岛主花千影在阵心坐镇，鲜有人能见到她的真容。',
    theme:    'island',
    minLevel: 40,
    maxLevel: 60,
    nearCities: ['hangzhou', 'mingzhou'],
    terrain:  '海岛',
    floors:   1,
    specialRule: 'illusion_array',  // 特殊：迷踪阵，部分房间位置会随机变换
    map: [
      [
        { type:'entry',  cleared:true,  desc:'桃花阵入口，花瓣漫天飞舞，美丽而危险' },
        { type:'battle', cleared:false, enemyId:'peach_array_spirit', desc:'桃花阵灵，幻化成美人' },
        { type:'battle', cleared:false, enemyId:'peach_array_spirit', desc:'阵中幻化的舞姬' },
        { type:'trap',   cleared:false, desc:'迷踪阵法发动，迷失方向，消耗大量精力！' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'阵中宝岛主留下的暗格锦囊' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'peach_array_spirit', desc:'两道阵灵夹击' },
        { type:'battle', cleared:false, enemyId:'peach_array_spirit', desc:'阵灵化作的琴师' },
        { type:'rest',   cleared:false, desc:'阵心桃树下，隐约有一缕真气护佑，可以调息' },
        { type:'elite',  cleared:false, enemyId:'peach_array_spirit', desc:'最强阵灵，幻象逼真难辨' },
        { type:'boss',   cleared:false, enemyId:'peach_island_master',desc:'【岛主·花千影】桃花岛传人，琴棋书画皆是杀招' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    9800,
      silver: 1200,
      items:  [
        { id:'item_peach_blossom', qty:5 },
        { id:'item_spirit_stone',  qty:3 },
        { id:'item_charm_elixir',  qty:1 },
      ],
      manualChance: 0.35,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 7. 明教圣火台（Lv45-65，中型，3行×5列）──
  dungeon_holy_fire_altar: {
    id:       'dungeon_holy_fire_altar',
    name:     '明教圣火台',
    icon:     '🔆',
    desc:     '明教在光明顶外围设立的圣火祭坛，由光明使者亲自驻守。此地是明教最神圣之所，闯入者视同不共戴天之仇。',
    theme:    'fire',
    minLevel: 45,
    maxLevel: 65,
    nearCities: ['hanzhong', 'chengdu'],
    terrain:  '高山',
    floors:   1,
    specialRule: 'fire_aura',    // 特殊：每2步受到灼热伤害
    map: [
      [
        { type:'entry',  cleared:true,  desc:'圣火台外围，火光冲天，热浪滚滚' },
        { type:'battle', cleared:false, enemyId:'holy_fire_guard', desc:'圣火台守卫，手持火焰令旗' },
        { type:'trap',   cleared:false, desc:'圣火机关喷射火柱！灼伤！' },
        { type:'chest',  cleared:false, lootTier:'rare',            desc:'圣火台供奉的礼器匣' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'holy_fire_guard', desc:'两名守卫联手防御' },
        { type:'rest',   cleared:false, desc:'祭台侧室，圣火余温尚存，可在此调息' },
        { type:'elite',  cleared:false, enemyId:'holy_fire_guard', desc:'圣火精锐卫士，以火焰内功护身' },
        { type:'event',  cleared:false, desc:'一个想离开明教的弟子，请求你带他逃走' },
        { type:'chest',  cleared:false, lootTier:'epic',            desc:'圣火令残片，明教至宝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'holy_fire_guard', desc:'内坛最后的卫队' },
        { type:'battle', cleared:false, enemyId:'holy_fire_guard', desc:'两个不死心的圣火卫' },
        { type:'trap',   cleared:false, desc:'圣火阵法全开，烈火四射！' },
        { type:'boss',   cleared:false, enemyId:'bright_left_envoy',desc:'【光明左使·炎烈】明教四使之一，烈焰掌法天下无双' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    11000,
      silver: 1300,
      items:  [
        { id:'item_fire_crystal',  qty:4 },
        { id:'item_spirit_stone',  qty:4 },
        { id:'item_flame_essence', qty:2 },
      ],
      manualChance: 0.35,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 8. 唐门机关堡（Lv50-70，大型，4行×6列）──
  dungeon_tangmen_mechanism_fort: {
    id:       'dungeon_tangmen_mechanism_fort',
    name:     '唐门机关堡',
    icon:     '⚙️',
    desc:     '唐门在蜀中深山建造的秘密机关堡垒，堡内机关重重、暗器遍布，机关堡主千机子以毕生心血布下此阵，据说从未有人活着走出去。',
    theme:    'mechanism',
    minLevel: 50,
    maxLevel: 70,
    nearCities: ['chengdu', 'chongqing'],
    terrain:  '山地',
    floors:   2,
    specialRule: 'trap_everywhere',  // 特殊：陷阱房伤害翻倍，机关人偶有概率自爆
    map: [
      [
        { type:'entry',  cleared:true,  desc:'机关堡大门，铁甲铜墙，闻得到机油味' },
        { type:'trap',   cleared:false, desc:'地板暗箭，触发即射！' },
        { type:'battle', cleared:false, enemyId:'mechanism_doll',       desc:'守门机关人偶，行动精准' },
        { type:'chest',  cleared:false, lootTier:'rare',                  desc:'机关堡内部零件箱，混着宝物' },
        { type:'trap',   cleared:false, desc:'弹簧刀阵，扫过来！' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'mechanism_doll',       desc:'两具人偶联动攻击' },
        { type:'rest',   cleared:false, desc:'机关堡内的工坊，可借用工具修复装备' },
        { type:'battle', cleared:false, enemyId:'mechanism_beast',      desc:'机关兽，形如钢虎，獠牙锋利' },
        { type:'event',  cleared:false, desc:'一个被困在机关里的唐门弟子，知道停机暗号' },
        { type:'elite',  cleared:false, enemyId:'mechanism_beast',      desc:'双机关兽守卫内厅' },
        { type:'chest',  cleared:false, lootTier:'epic',                  desc:'千机子设计图纸，里面有机关堡的秘密' },
      ],
      [
        null,
        { type:'trap',   cleared:false, desc:'旋转刀盘！高速旋转割伤！' },
        { type:'battle', cleared:false, enemyId:'mechanism_doll',       desc:'精密升级版人偶，反应更快' },
        { type:'battle', cleared:false, enemyId:'mechanism_beast',      desc:'最大的机关兽，可发射弩箭' },
        { type:'trap',   cleared:false, desc:'自爆机关！爆炸伤害巨大！' },
        { type:'chest',  cleared:false, lootTier:'legendary',            desc:'千机子最得意的作品——万机匣' },
      ],
      [
        null,
        null,
        { type:'battle', cleared:false, enemyId:'mechanism_doll',       desc:'最终防线：三具精英人偶' },
        { type:'elite',  cleared:false, enemyId:'mechanism_beast',      desc:'镇堡机关兽王，铸造了三十年' },
        { type:'trap',   cleared:false, desc:'全堡机关联动！陷阱风暴！' },
        { type:'boss',   cleared:false, enemyId:'mechanism_castle_lord',desc:'【机关堡主·千机子】人称"机关圣手"，以机关为剑' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    13000,
      silver: 1600,
      items:  [
        { id:'item_mechanism_core', qty:3 },
        { id:'item_spirit_stone',   qty:4 },
        { id:'item_rare_gem',       qty:2 },
      ],
      manualChance: 0.38,
    },
    unlocks: [],
    restInterval: 4,
    restHealPct:  0.08,
  },

  // ── 9. 玄冥外坛（Lv55-75，中型，3行×5列）──
  dungeon_xuanming_outer_altar: {
    id:       'dungeon_xuanming_outer_altar',
    name:     '玄冥外坛',
    icon:     '🌑',
    desc:     '玄冥主坛的前哨据点，由教中最忠诚的狂热信徒和玄冥双煞把守。外坛虽是前哨，战力却不逊于许多正派总坛。',
    theme:    'dark',
    minLevel: 55,
    maxLevel: 75,
    nearCities: ['youzhou', 'cangzhou'],
    terrain:  '平原',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'玄冥外坛，阴气比主坛更浓' },
        { type:'battle', cleared:false, enemyId:'xuanming_cultist',     desc:'外坛狂热信徒，不惜死命' },
        { type:'battle', cleared:false, enemyId:'xuanming_cultist',     desc:'三个信徒联手守道' },
        { type:'trap',   cleared:false, desc:'玄冥幻毒阵，中毒并眩晕！' },
        { type:'chest',  cleared:false, lootTier:'epic',                 desc:'外坛信徒的供奉宝物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'xuanming_cultist',     desc:'坛内精锐护卫' },
        { type:'rest',   cleared:false, desc:'外坛密室，暂时安全，可以调息' },
        { type:'elite',  cleared:false, enemyId:'xuanming_cultist',     desc:'外坛执法长老，阴寒内力' },
        { type:'event',  cleared:false, desc:'一个被俘的正道侠客，请求援手' },
        { type:'chest',  cleared:false, lootTier:'legendary',            desc:'外坛藏有的玄冥秘典' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'xuanming_cultist',     desc:'最后的信徒死士' },
        { type:'battle', cleared:false, enemyId:'xuanming_cultist',     desc:'玄冥护坛武士' },
        { type:'trap',   cleared:false, desc:'北冥绝阵！气血内力双双损耗！' },
        { type:'boss',   cleared:false, enemyId:'xuanming_twin_frost',  desc:'【玄冥双煞·寒血】以两人合击之术称霸北地，寒冰内功登峰造极' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    14000,
      silver: 1800,
      items:  [
        { id:'item_dark_crystal',  qty:4 },
        { id:'item_chaos_essence', qty:2 },
        { id:'item_spirit_stone',  qty:5 },
      ],
      manualChance: 0.38,
    },
    unlocks: ['dungeon_xuanming_lair'],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 10. 水府龙宫（Lv55-80，中型，3行×5列）──
  dungeon_water_dragon_palace: {
    id:       'dungeon_water_dragon_palace',
    name:     '河底水府',
    icon:     '🌊',
    desc:     '洞庭湖底的神秘水府，由妖龙王敖洪盘踞，统率虾兵蟹将。近年来水府作乱，扰乱湖中船运，周边百姓深受其害。',
    theme:    'water',
    minLevel: 55,
    maxLevel: 80,
    nearCities: ['yueyang', 'wuhan'],
    terrain:  '水下',
    floors:   1,
    specialRule: 'underwater',   // 特殊：水下环境，速度-2，内力消耗+20%
    map: [
      [
        { type:'entry',  cleared:true,  desc:'水府入口，巨大的珊瑚拱门，水流湍急' },
        { type:'battle', cleared:false, enemyId:'water_shrimp_soldier', desc:'虾兵两队，长戟挡路' },
        { type:'trap',   cleared:false, desc:'激流冲击！被冲走，损失气血！' },
        { type:'chest',  cleared:false, lootTier:'rare',                  desc:'水府仓库，藏有沉船宝物' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'lake_fishman',          desc:'湖底鱼人，熟悉水下地形' },
        { type:'rest',   cleared:false, desc:'水府暖流处，温度较高，可以稍作休息' },
        { type:'elite',  cleared:false, enemyId:'water_crab_general',   desc:'蟹将统帅，双钳如刀' },
        { type:'event',  cleared:false, desc:'一个被扣押的渔民，知道水府宝库的位置' },
        { type:'chest',  cleared:false, lootTier:'epic',                  desc:'妖龙王的宝库，珍宝无数' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'water_shrimp_soldier', desc:'精锐虾兵护卫殿前' },
        { type:'battle', cleared:false, enemyId:'lake_fishman',          desc:'鱼人精锐卫队' },
        { type:'elite',  cleared:false, enemyId:'river_dragon_king',    desc:'妖龙王的化身分身，先打倒它才能见本体' },
        { type:'boss',   cleared:false, enemyId:'water_dragon_god',     desc:'【水龙神·共工】河底最强的水系妖神，洪水之力惊天动地' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    15000,
      silver: 2000,
      items:  [
        { id:'item_dragon_scale',  qty:2 },
        { id:'item_water_pearl',   qty:4 },
        { id:'item_spirit_stone',  qty:5 },
      ],
      manualChance: 0.40,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 11. 蛇妖宝塔（Lv60-80，小型，2行×4列）──
  dungeon_snake_pagoda: {
    id:       'dungeon_snake_pagoda',
    name:     '蛇妖宝塔',
    icon:     '🐍',
    desc:     '苗疆一座千年古塔，被蛇妖白鳞妖后占据，以蛊毒为法，控制周围村庄。塔中蛇患弥漫，毒气侵体，非有解毒之术者难以深入。',
    theme:    'swamp',
    minLevel: 60,
    maxLevel: 80,
    nearCities: ['wudu_miao', 'guiyang'],
    terrain:  '丛林',
    floors:   1,
    specialRule: 'poison_aura',   // 特殊：持续中毒环境
    map: [
      [
        { type:'entry',  cleared:true,  desc:'宝塔底层，毒雾弥漫，蛇影乱窜' },
        { type:'battle', cleared:false, enemyId:'pagoda_snake_demon',   desc:'守塔蛇妖，吐毒攻击' },
        { type:'battle', cleared:false, enemyId:'poison_snake',         desc:'盘踞在柱上的毒蛇' },
        { type:'trap',   cleared:false, desc:'蛇巢震动，群蛇涌出！中毒！' },
        { type:'chest',  cleared:false, lootTier:'epic',                  desc:'塔中蛇妖的宝物窝' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'pagoda_snake_demon',   desc:'两条大蛇妖联手' },
        { type:'battle', cleared:false, enemyId:'pagoda_snake_demon',   desc:'从暗处袭来的蛇妖' },
        { type:'rest',   cleared:false, desc:'塔顶天窗透入阳光，此处蛇毒较淡，可以调息' },
        { type:'elite',  cleared:false, enemyId:'pagoda_snake_demon',   desc:'塔中最强的蛇妖，以毒练就金身' },
        { type:'boss',   cleared:false, enemyId:'white_scale_queen',    desc:'【白鳞妖后·素姬】蛇族女皇，千年修炼，以蛊毒统御苗疆' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    15500,
      silver: 1850,
      items:  [
        { id:'item_snake_scale',   qty:5 },
        { id:'item_poison_gland',  qty:4 },
        { id:'item_spirit_stone',  qty:4 },
      ],
      manualChance: 0.40,
    },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.12,
  },

  // ── 12. 雷音寺禅院（Lv65-85，中型，3行×5列）──
  dungeon_leiyin_temple: {
    id:       'dungeon_leiyin_temple',
    name:     '雷音寺禅院',
    icon:     '⚡',
    desc:     '传说中雷法宗师开创的古刹，住持雷鸣以雷音禅功称霸一方。近年寺院封山、拒绝往来，江湖上流传着寺中藏有上古雷法真经。',
    theme:    'temple',
    minLevel: 65,
    maxLevel: 85,
    nearCities: ['hangzhou', 'suzhou'],
    terrain:  '山地',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'雷音寺山门，大钟轰鸣，震人心魄' },
        { type:'battle', cleared:false, enemyId:'leiyin_abbot',         desc:'守门武僧，以雷音掌法见长' },
        { type:'trap',   cleared:false, desc:'雷音阵法激活，雷光炸裂！' },
        { type:'chest',  cleared:false, lootTier:'epic',                  desc:'寺中供奉的舍利宝匣' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'leiyin_abbot',         desc:'两位禅武合一的僧人' },
        { type:'rest',   cleared:false, desc:'禅院静室，在此打坐可恢复气血内力' },
        { type:'elite',  cleared:false, enemyId:'leiyin_abbot',         desc:'雷音首座，雷法精深' },
        { type:'event',  cleared:false, desc:'寺中长老，觉得你有缘，愿指点武学' },
        { type:'chest',  cleared:false, lootTier:'legendary',            desc:'雷音寺镇寺宝典，藏有雷法真经' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'leiyin_abbot',         desc:'寺院精锐护法僧' },
        { type:'battle', cleared:false, enemyId:'leiyin_abbot',         desc:'最后的守寺武僧' },
        { type:'trap',   cleared:false, desc:'天雷降临！巨大雷击！' },
        { type:'boss',   cleared:false, enemyId:'leiyin_abbot',         desc:'【雷音寺住持·雷鸣】雷禅双绝，一声佛号可令雷光迸发' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    17000,
      silver: 2200,
      items:  [
        { id:'item_thunder_core',  qty:3 },
        { id:'item_spirit_stone',  qty:5 },
        { id:'item_chaos_essence', qty:2 },
      ],
      manualChance: 0.40,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 13. 西夏国师陵（Lv70-90，小型，2行×4列）──
  dungeon_western_xia_tomb: {
    id:       'dungeon_western_xia_tomb',
    name:     '西夏国师陵',
    icon:     '🏯',
    desc:     '西夏国灭后，末代国师不甘就此消散，以秘法将残魂封印于陵墓之中，守护着西夏最后的秘宝。侵入者将面临国师残魂的无尽诅咒。',
    theme:    'desert',
    minLevel: 70,
    maxLevel: 90,
    nearCities: ['xiyu_city', 'hetian'],
    terrain:  '沙漠',
    floors:   1,
    specialRule: 'curse_debuff',  // 特殊：诅咒环境，所有属性-10%
    map: [
      [
        { type:'entry',  cleared:true,  desc:'国师陵入口，黄沙遮天，阴风阵阵' },
        { type:'battle', cleared:false, enemyId:'western_xia_spirit',   desc:'国师的残魂护卫' },
        { type:'battle', cleared:false, enemyId:'western_xia_spirit',   desc:'游荡的守陵魂' },
        { type:'trap',   cleared:false, desc:'西夏诅咒阵，中诅咒！所有属性削弱！' },
        { type:'chest',  cleared:false, lootTier:'legendary',             desc:'西夏王室的陪葬宝物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'western_xia_spirit',   desc:'两道残魂联手' },
        { type:'battle', cleared:false, enemyId:'western_xia_spirit',   desc:'苏醒的古代战魂' },
        { type:'rest',   cleared:false, desc:'陵墓深处供奉香炉，香烟可驱散诅咒，稍作恢复' },
        { type:'elite',  cleared:false, enemyId:'western_xia_spirit',   desc:'国师最强的护陵残魂' },
        { type:'boss',   cleared:false, enemyId:'western_xia_spirit',   desc:'【西夏国师·残魂】不甘消散的末代国师，密宗秘法称绝西域' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    20500,
      silver: 2700,
      items:  [
        { id:'item_sand_crystal',  qty:5 },
        { id:'item_chaos_essence', qty:3 },
        { id:'item_spirit_stone',  qty:6 },
      ],
      manualChance: 0.44,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── 14. 骨冥子终章（Lv100+，超级Boss地下城，3行×5列）──
  dungeon_bone_mingzi_final: {
    id:       'dungeon_bone_mingzi_final',
    name:     '骨冥子决战场',
    icon:     '💀',
    desc:     '血骨要塞的最深处，骨冥子为自己布下的最后防线。以无数血骨门弟子的精血铸就，此地充斥着无尽的煞气与死意。这是一场关乎江湖命运的终极决战。',
    theme:    'blood',
    minLevel: 100,
    maxLevel: 120,
    nearCities: ['youzhou'],
    terrain:  '平原',
    floors:   1,
    isMainQuestDungeon: true,
    specialRule: 'blood_curse',  // 特殊：每回合损失1%气血（被煞气侵蚀），必须速战
    map: [
      [
        { type:'entry',  cleared:true,  desc:'骨冥子决战场，血腥之气令人窒息' },
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master', desc:'骨冥子最忠诚的坛主' },
        { type:'trap',   cleared:false, desc:'血骨煞阵！气血持续流失！' },
        { type:'chest',  cleared:false, lootTier:'legendary',               desc:'血骨门最后的宝库' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_vice_master',  desc:'血刃副门主拼死阻拦' },
        { type:'rest',   cleared:false, desc:'唯一一处正气聚集之所，在此可短暂抵御煞气' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_altar_master', desc:'骨冥子亲传弟子，炼骨绝学' },
        { type:'event',  cleared:false, desc:'被血骨门控制的无辜弟子，急需解救' },
        { type:'chest',  cleared:false, lootTier:'legendary',               desc:'传说中的玄铁令就在此处！' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master', desc:'最后的血骨门精锐' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_vice_master',  desc:'血刃副门主的最后疯狂' },
        { type:'trap',   cleared:false, desc:'骨冥子亲布的终极血骨大阵！' },
        { type:'boss',   cleared:false, enemyId:'bone_mingzi',             desc:'【骨冥子】血骨门绝世门主，炼骨化神，武道至此已近魔道' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    80000,
      silver: 8000,
      items:  [
        { id:'item_dragon_scale',  qty:5 },
        { id:'item_chaos_essence', qty:8 },
        { id:'item_spirit_stone',  qty:15 },
      ],
      manualChance: 0.80,
      specialReward: 'xuantie_ling_complete',  // 主线完成道具
    },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.15,
  },

  // ══════════════════════════════════════
  //  七、特殊地下城（侧线/解锁类）
  // ══════════════════════════════════════

  dungeon_desert_ruins: {
    id:       'dungeon_desert_ruins',
    name:     '西域古城废墟',
    icon:     '🏜️',
    desc:     '丝路沿途的古代城邦遗址，埋藏着大量宝物，但也有守护遗迹的地煞和沙漠猛兽。',
    theme:    'desert',
    minLevel: 45,
    maxLevel: 75,
    nearCities: ['xiyu_city', 'hetian', 'yumenguan'],
    terrain:  '沙漠绿洲',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'废墟城门，风沙中隐约可见古字' },
        { type:'battle', cleared:false, enemyId:'desert_lizard',     desc:'荒漠巨蜥把守路口' },
        { type:'chest',  cleared:false, lootTier:'rare',              desc:'古代城邦的宝物' },
        null,
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'desert_bandit',     desc:'劫掠废墟的西域马贼' },
        { type:'trap',   cleared:false, desc:'流沙陷阱，险些被困！' },
        { type:'rest',   cleared:false, desc:'废墟中的古井，水质清凉可以休整' },
        { type:'battle', cleared:false, enemyId:'desert_bandit',     desc:'马贼中的武功高手' },
        { type:'elite',  cleared:false, enemyId:'desert_assassin',   desc:'西域刺客，神出鬼没' },
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'epic',              desc:'城邦王室的遗宝' },
        { type:'event',  cleared:false, desc:'一位西域商人，声称知道宝藏的真正位置' },
        { type:'battle', cleared:false, enemyId:'desert_lizard',     desc:'巨蜥守护内殿' },
        { type:'boss',   cleared:false, enemyId:'desert_boss',       desc:'【沙漠古魔】废墟深处沉睡了百年的存在' },
      ],
    ],
    startPos: [0, 0],
    bossReward: {
      exp:    12000,
      silver: 1500,
      items:  [
        { id:'item_spirit_stone',  qty:4 },
        { id:'item_sand_crystal',  qty:5 },
      ],
      manualChance: 0.35,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ══════════════════════════════════════
  //  七、Lv75-100 前终章过渡段
  // ══════════════════════════════════════

  dungeon_riyue_forbidden: {
    id:       'dungeon_riyue_forbidden',
    name:     '日月神教禁地',
    icon:     '☀️',
    desc:     '日月神教隐藏于终南山腹的核心圣地，外人一旦闯入即被视为不共戴天的敌人。禁地深处供奉着圣火真焰，传说得其真传者可练就焚天圣功。',
    theme:    'fire',
    minLevel: 75,
    maxLevel: 92,
    nearCities: ['xian'],
    terrain:  '山地圣地',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'禁地山门，巨石上刻"非我神教勿入"' },
        { type:'battle', cleared:false, enemyId:'riyue_fire_guard',  desc:'一队圣火禁卫在此巡逻' },
        { type:'trap',   cleared:false, desc:'地底机关，圣火喷射陷阱' },
        { type:'battle', cleared:false, enemyId:'riyue_fire_guard',  desc:'守门禁卫挡住去路' },
        { type:'chest',  cleared:false, lootTier:'rare',             desc:'神教信众的秘密储藏' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'riyue_guardian',    desc:'巡逻护法使者，察觉到了你的入侵' },
        { type:'rest',   cleared:false, desc:'供奉圣火的神龛，火光温暖可以稍作休整' },
        { type:'collect', cleared:false, desc:'圣火祭坛旁有一层灼热晶砂，拨开灰烬便能采出灵性矿料' },
        { type:'elite',  cleared:false, enemyId:'riyue_guardian',    desc:'【光明使者】禁地四护法之首，圣火神功第八重' },
        { type:'chest',  cleared:false, lootTier:'epic',             desc:'神教密室中的至宝' },
      ],
      [
        { type:'collect', cleared:false, desc:'禁地山腹石缝透出赤金光泽，敲开后能掏出受圣火淬炼的石料' },
        { type:'battle', cleared:false, enemyId:'riyue_fire_guard',  desc:'三人一组的精锐禁卫' },
        { type:'trap',   cleared:false, desc:'烈焰封印阵，踏入即触发圣火' },
        { type:'battle', cleared:false, enemyId:'riyue_guardian',    desc:'神教护法老僧，武功深不可测' },
        { type:'boss',   cleared:false, enemyId:'evil_fire_boss',    desc:'【圣火教主】日月神教最后的守护者，一身圣火神功已臻化境' },
      ],
    ],
    startPos: [0, 0],
    specialRule: 'holy_fire',  // 圣火环境：火系技能伤害+20%，冰系伤害-20%
    bossReward: {
      exp:    22000,
      silver: 2200,
      items:  [
        { id:'item_spirit_stone',   qty:5 },
        { id:'item_chaos_essence',  qty:2 },
        { id:'item_manual_rare',    qty:1 },
      ],
      manualChance: 0.40,
    },
    unlocks: ['dungeon_blood_bone_altar'],
    restInterval: 4,
    restHealPct:  0.12,
  },

  dungeon_blood_bone_altar: {
    id:       'dungeon_blood_bone_altar',
    name:     '血骨门血炼台',
    icon:     '🩸',
    desc:     '血骨门在深山中秘密建造的血煞炼台，以无数亡魂的怨气凝聚而成。血炼台上常年弥漫着腐臭和血气，踏入此地者无不毛骨悚然。据说骨冥子在此炼就了绝世血魔功。',
    theme:    'blood',
    minLevel: 85,
    maxLevel: 98,
    nearCities: ['youzhou'],
    terrain:  '地下祭坛',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'血炼台入口，空气中弥漫着血腥气息' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',      desc:'两名持骨刀的精锐卫兵' },
        { type:'event',  cleared:false, desc:'一具倒地的江湖侠士，临死前留下了一张地图' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',      desc:'血骨门精锐卫队' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_high_priest',      desc:'大祭司正在主持血煞祭典' },
        { type:'trap',   cleared:false, desc:'血煞阵法，踏入者气血持续流失' },
        { type:'rest',   cleared:false, desc:'炼台旁的铁笼，关押着一批江湖人士，有人留下了草药' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_high_priest',      desc:'【大祭司·血幽】血炼台最强坛主，以生人血炼就了半身煞气' },
        { type:'chest',  cleared:false, lootTier:'epic',                       desc:'祭台内的珍藏，全是以鲜血换来的宝物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',      desc:'换班的血骨精锐卫' },
        { type:'battle', cleared:false, enemyId:'blood_bone_high_priest',      desc:'护坛大祭司，感应到有人入侵' },
        { type:'trap',   cleared:false, desc:'骨阵机关，骨骸从地下射出' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_high_priest',      desc:'血炼台四大大祭司齐聚' },
        null,
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'legendary',                  desc:'血炼台最深处的秘宝，血骨门门规严禁外传' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',      desc:'精锐骨刀队' },
        { type:'event',  cleared:false, desc:'一面刻有血骨门秘法的血符，触摸后获得诅咒或顿悟' },
        { type:'boss',   cleared:false, enemyId:'blood_bone_vice_master',      desc:'【副门主·血刃】骨冥子麾下第一杀手，号称杀人从不用第二刀' },
      ],
    ],
    startPos: [0, 0],
    specialRule: 'blood_curse',  // 血煞环境：每4回合失去5%最大HP
    bossReward: {
      exp:    28000,
      silver: 3000,
      items:  [
        { id:'item_xuegu_emblem',   qty:3 },
        { id:'item_chaos_essence',  qty:3 },
        { id:'item_spirit_stone',   qty:6 },
      ],
      manualChance: 0.45,
    },
    unlocks: [],
    restInterval: 4,
    restHealPct:  0.10,
  },

  dungeon_ghost_city: {
    id:       'dungeon_ghost_city',
    name:     '幽州鬼城',
    icon:     '🏚️',
    desc:     '幽州荒野中一座被诅咒的古城，百年前因一场大战死伤无数，亡魂无处归依，日积月累化为阴煞之地。玄冥教以此为外据点，借助阴煞之气修炼邪功。',
    theme:    'dark',
    minLevel: 80,
    maxLevel: 95,
    nearCities: ['youzhou'],
    terrain:  '阴煞废城',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'断壁残垣的城门，风中传来幽怨哭声' },
        { type:'battle', cleared:false, enemyId:'ghost_city_warrior',        desc:'百年亡灵武士守在城门' },
        { type:'battle', cleared:false, enemyId:'ghost_city_warrior',        desc:'成群的亡灵武士游荡此处' },
        { type:'chest',  cleared:false, lootTier:'rare',                     desc:'废城中残存的宝物' },
        null,
      ],
      [
        null,
        { type:'trap',   cleared:false, desc:'阴煞漩涡，陷入其中内力大损' },
        { type:'rest',   cleared:false, desc:'破庙中的供案，有人留下了草药和香烛' },
        { type:'battle', cleared:false, enemyId:'xuanming_ghost_overseer',   desc:'玄冥鬼城坐镇者，正在此地驱役亡灵' },
        { type:'battle', cleared:false, enemyId:'ghost_city_warrior',        desc:'古战场的亡灵武士' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'ghost_city_warrior',        desc:'一队亡灵武士在废街上游荡' },
        { type:'collect', cleared:false, desc:'古井井壁结着阴寒结晶，捞起时还能摸到煞气凝成的石屑' },
        { type:'elite',  cleared:false, enemyId:'xuanming_ghost_overseer',   desc:'【冥镇·煞罗】玄冥教在鬼城的最强坐镇者' },
        { type:'trap',   cleared:false, desc:'千年骨阵，触发后一批尸骸同时复活' },
        { type:'chest',  cleared:false, lootTier:'epic',                     desc:'鬼城深处的珍藏，混合着阴气的宝物' },
      ],
      [
        { type:'collect', cleared:false, desc:'废城地脉里沉着阴煞残核，翻开碎砖往往能拾到可用材料' },
        { type:'battle', cleared:false, enemyId:'xuanming_ghost_overseer',   desc:'两位玄冥坐镇者联手守关' },
        { type:'battle', cleared:false, enemyId:'ghost_city_warrior',        desc:'鬼城最强亡灵武士，百年怨气化为铠甲' },
        { type:'event',  cleared:false, desc:'鬼城主人的日记，记载了这座城市的悲剧史' },
        { type:'boss',   cleared:false, enemyId:'xuanming_boss',             desc:'【玄冥教主·寒渊子】以鬼城为道场，修炼万年阴寒之功' },
      ],
    ],
    startPos: [0, 0],
    specialRule: 'ghost_aura',  // 阴煞环境：回合末内力消耗+15%，但亡灵系技能伤害+30%
    bossReward: {
      exp:    25000,
      silver: 2500,
      items:  [
        { id:'item_ghost_jade',    qty:3 },
        { id:'item_chaos_essence', qty:3 },
        { id:'item_spirit_stone',  qty:5 },
      ],
      manualChance: 0.42,
    },
    unlocks: [],
    restInterval: 4,
    restHealPct:  0.08,
  },

  // ══════════════════════════════════════
  //  八、西域/海上方向
  // ══════════════════════════════════════

  dungeon_haisha_pirate_island: {
    id:       'dungeon_haisha_pirate_island',
    name:     '海沙帮海盗岛',
    icon:     '🏴‍☠️',
    desc:     '东海上一座海沙帮盘踞的要塞海岛，岛上船坞密布、仓库满载，是整个东海最大的走私据点。帮主铁锚鲨在此经营多年，手下战力不输一流门派。',
    theme:    'ocean',
    minLevel: 55,
    maxLevel: 75,
    nearCities: ['yangzhou', 'hangzhou', 'quanzhou'],
    terrain:  '海岛要塞',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'海岛栈桥，海风夹杂着鱼腥味' },
        { type:'battle', cleared:false, enemyId:'haisha_pirate',    desc:'把守码头的海沙喽啰' },
        { type:'event',  cleared:false, desc:'一艘搁浅的商船，船舱里还有货物' },
        { type:'battle', cleared:false, enemyId:'haisha_pirate',    desc:'岸上的弓弩手向你射击' },
        { type:'chest',  cleared:false, lootTier:'uncommon',        desc:'海沙帮的走私货仓' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'haisha_captain',   desc:'带领巡逻队的海沙头目' },
        { type:'trap',   cleared:false, desc:'铁索机关，触发后铁笼从天而降' },
        { type:'rest',   cleared:false, desc:'海盗补给站，有食物和药品' },
        { type:'battle', cleared:false, enemyId:'haisha_captain',   desc:'海沙帮武功最强的头领之一' },
        { type:'elite',  cleared:false, enemyId:'haisha_captain',   desc:'【铁爪·何三刀】铁锚鲨麾下第一刀手' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'haisha_pirate',    desc:'仓库里涌出一批海盗' },
        { type:'chest',  cleared:false, lootTier:'rare',             desc:'最大仓库的深处，压舱的贵重货物' },
        { type:'event',  cleared:false, desc:'一名被关押的官府密探，愿意提供情报' },
        { type:'boss',   cleared:false, enemyId:'haisha_boss',       desc:'【铁锚鲨】海沙帮当家，一手铁锚功横扫东海十年' },
      ],
    ],
    startPos: [0, 0],
    specialRule: 'ocean_wind',  // 海上环境：轻功系技能伤害+15%，重甲防御-10%
    bossReward: {
      exp:    14000,
      silver: 2000,
      items:  [
        { id:'item_spirit_stone',    qty:3 },
        { id:'item_western_silk',    qty:3 },
        { id:'item_manual_complete', qty:1 },
      ],
      manualChance: 0.35,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.12,
  },

  dungeon_silk_road_devil_lair: {
    id:       'dungeon_silk_road_devil_lair',
    name:     '丝路古驿魔窟',
    icon:     '🕌',
    desc:     '玉门关外一处失落已久的古代驿站，被西域邪教掘地三尺改造为魔窟。窟内供奉着异域邪神，信奉者以异术御敌，手段诡谲难以预判。丝路商队时常在此遇难，无一生还。',
    theme:    'desert',
    minLevel: 60,
    maxLevel: 80,
    nearCities: ['xiyu_city', 'yumenguan', 'hetian'],
    terrain:  '沙漠魔窟',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'古驿大门，门柱上刻满异域咒文' },
        { type:'battle', cleared:false, enemyId:'silk_road_cultist',    desc:'西域邪教信徒在门口等候猎物' },
        { type:'trap',   cleared:false, desc:'流沙陷阱，踩下后沉入沙中' },
        { type:'battle', cleared:false, enemyId:'desert_lizard',        desc:'被魔窟邪气改造过的巨蜥，体型更大' },
        { type:'chest',  cleared:false, lootTier:'rare',                desc:'丝路商队遗留的财货' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'silk_road_cultist',    desc:'邪教信徒冲出拦路' },
        { type:'rest',   cleared:false, desc:'古驿的水井，还有清水可用' },
        { type:'event',  cleared:false, desc:'一块残损的西域古地图，标注着某处秘宝的位置' },
        { type:'elite',  cleared:false, enemyId:'silk_road_assassin',   desc:'【沙蛊客】精通蛊术的西域刺客，蛊毒入体则气血倒流' },
        { type:'battle', cleared:false, enemyId:'silk_road_cultist',    desc:'守护内殿的精锐信徒' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'silk_road_assassin',   desc:'两名沙蛊客同时出手' },
        { type:'trap',   cleared:false, desc:'爆沙机关，触发后飞沙石弹四射' },
        { type:'chest',  cleared:false, lootTier:'epic',                desc:'邪神祭坛上的供品，积累了百年的财富' },
        { type:'boss',   cleared:false, enemyId:'desert_boss',          desc:'【黄沙魔王·孛罗】以异域秘法修炼至大成，自称沙漠之神' },
      ],
    ],
    startPos: [0, 0],
    specialRule: 'desert_heat',  // 沙漠酷热：每3回合失去5点HP，携带水囊可抵消
    bossReward: {
      exp:    16000,
      silver: 1800,
      items:  [
        { id:'item_sand_crystal',   qty:6 },
        { id:'item_western_silk',   qty:4 },
        { id:'item_spirit_stone',   qty:3 },
      ],
      manualChance: 0.38,
    },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ══════════════════════════════════════
  //  九、新增地下城组（Lv1-20 新手扩展）
  // ══════════════════════════════════════

  // ── N1. 村口野鸡林（Lv1-8，迷你，2行×3列）──
  dungeon_chicken_woods: {
    id:       'dungeon_chicken_woods',
    name:     '村口野鸡林',
    icon:     '🌲',
    desc:     '汴京城外一片荒僻树林，野鸡野兔成群，附近有流浪汉和小毛贼出没。初出茅庐的江湖客练手的好地方。',
    theme:    'mountain',
    minLevel: 1,
    maxLevel: 8,
    nearCities: ['kaifeng'],
    terrain:  '密林',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'林子入口，树叶哗哗作响' },
        { type:'battle', cleared:false, enemyId:'wolf',          desc:'一只野狼盯上了你' },
        { type:'battle', cleared:false, enemyId:'bandit_foot',   desc:'躲在树后的小毛贼' },
        { type:'chest',  cleared:false, lootTier:'common',       desc:'猎人遗落的简陋行囊' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'bandit_foot',   desc:'几个流浪乞丐翻脸抢劫' },
        { type:'rest',   cleared:false, desc:'林中空地，可以稍作休息' },
        { type:'elite',  cleared:false, enemyId:'bandit_foot',   desc:'毛贼小头目，手持短刀' },
        { type:'boss',   cleared:false, enemyId:'bandit_chief_low', desc:'【林中恶霸·秃子刀】地头蛇，欺负过往行人' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:350, silver:50, items:[{id:'item_herb_common',qty:2},{id:'item_meat_rabbit',qty:1}], manualChance:0.10 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N2. 破庙地窖（Lv3-12，小型，2行×4列）──
  dungeon_old_temple_cellar: {
    id:       'dungeon_old_temple_cellar',
    name:     '破庙地窖',
    icon:     '🕯️',
    desc:     '扬州郊外破败古庙下方的密道地窖，不知何时起成了小蟊贼的藏匿之所，内有简陋陷阱和一个刁钻的头目。',
    theme:    'ghost',
    minLevel: 3,
    maxLevel: 12,
    nearCities: ['yangzhou'],
    terrain:  '地窖',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'破庙地板下的暗道，尘土飞扬' },
        { type:'battle', cleared:false, enemyId:'bandit_foot',   desc:'守在地窖口的小喽啰' },
        { type:'battle', cleared:false, enemyId:'bandit_foot',   desc:'暗处埋伏的蟊贼' },
        { type:'trap',   cleared:false, desc:'绊脚绳，一不留神就摔一跤！' },
        { type:'chest',  cleared:false, lootTier:'common',       desc:'随意堆放的杂物箱' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'bandit_foot',   desc:'两个蟊贼扑来' },
        { type:'rest',   cleared:false, desc:'地窖角落有几块干粮，可以充饥恢复精力' },
        { type:'elite',  cleared:false, enemyId:'bandit_foot',   desc:'蟊贼中的好手，刀法凶狠' },
        { type:'event',  cleared:false, desc:'一个被关在地窖的商人，要求你放他出去' },
        { type:'boss',   cleared:false, enemyId:'bandit_chief_low', desc:'【地窖头目·豆腐渣】凶名在外，实则是个欺软怕硬的懦夫' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:550, silver:75, items:[{id:'item_cloth',qty:2},{id:'item_herb_common',qty:2}], manualChance:0.12 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N3. 矿山废坑（Lv6-16，标准，4行×5列）──
  dungeon_abandoned_mine: {
    id:       'dungeon_abandoned_mine',
    name:     '荒废矿坑',
    icon:     '⛏️',
    desc:     '汝州近郊一处废弃铁矿，早年因矿难封闭，如今被强盗占据做巢穴。坑道内黑暗闷热、岩壁摇晃，危险程度不亚于真正的地下城。',
    theme:    'mountain',
    minLevel: 6,
    maxLevel: 16,
    nearCities: ['ruzhou'],
    terrain:  '矿坑',
    floors:   1,
    map: [
      [
        { type:'entry',   cleared:true,  desc:'矿坑入口，铁轨延伸入黑暗深处' },
        { type:'battle',  cleared:false, enemyId:'mine_thug',    desc:'霸占矿坑的粗汉拦路收费' },
        { type:'trap',    cleared:false, desc:'顶部碎石松动，一阵轰隆！' },
        { type:'collect', cleared:false, desc:'岩壁上裸露着一段铁矿脉，敲开便能采到矿石' },
        { type:'collect', cleared:false, desc:'支道尽头的矿墙，铁矿石密集裸露' },
      ],
      [
        { type:'battle',  cleared:false, enemyId:'mine_thug',    desc:'两个矿坑恶汉联手' },
        { type:'rest',    cleared:false, desc:'废弃工房，工人用的干粮还在架子上' },
        { type:'collect', cleared:false, desc:'废弃矿车旁的矿渣堆，翻找可得铁矿碎块' },
        { type:'battle',  cleared:false, enemyId:'mine_thug',    desc:'矿坑深处的守卫队' },
        { type:'chest',   cleared:false, lootTier:'uncommon',    desc:'藏在矿车底下的木箱' },
      ],
      [
        { type:'collect', cleared:false, desc:'矿坑侧道，矿脉在此拐角处外露' },
        { type:'trap',    cleared:false, desc:'矿坑支撑柱断裂，塌方！' },
        { type:'battle',  cleared:false, enemyId:'mine_thug',    desc:'藏在暗处的矿坑恶汉' },
        { type:'event',   cleared:false, desc:'一头困在矿坑的野熊，正在疯狂撞墙' },
        { type:'chest',   cleared:false, lootTier:'rare',        desc:'矿坑深处的秘密储物间' },
      ],
      [
        null,
        { type:'collect', cleared:false, desc:'最深矿道，厚重矿壁中富铁矿层清晰可辨' },
        { type:'elite',   cleared:false, enemyId:'mine_thug',    desc:'矿坑恶汉精锐，手持铁锤' },
        { type:'trap',    cleared:false, desc:'绊索触发，落石砸伤！' },
        { type:'boss',    cleared:false, enemyId:'mine_boss',    desc:'【矿霸·铁锤孙】凭一把铁锤横行矿区，手下有几十号人' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:1000, silver:140, items:[{id:'item_iron_ore',qty:6},{id:'item_herb_common',qty:2}], manualChance:0.12 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ══════════════════════════════════════
  //  十、新增地下城组（Lv15-35 中级扩展）
  // ══════════════════════════════════════

  // ── N4. 渔村地下水道（Lv12-22，小型，2行×4列）──
  dungeon_fishing_village_sewer: {
    id:       'dungeon_fishing_village_sewer',
    name:     '渔村地下水道',
    icon:     '🐟',
    desc:     '杭州渔村下方暗藏的走私水道网络，以水路运输违禁货物，由一伙水寇把守。水道内潮湿昏暗，偶有毒蛇出没。',
    theme:    'water',
    minLevel: 12,
    maxLevel: 22,
    nearCities: ['hangzhou', 'suzhou'],
    terrain:  '水道',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'渔村地板下的暗道，水声潺潺' },
        { type:'battle', cleared:false, enemyId:'water_thug',    desc:'守在入口的水寇喽啰' },
        { type:'battle', cleared:false, enemyId:'water_thug',    desc:'暗处偷袭的水寇' },
        { type:'trap',   cleared:false, desc:'绊索触发，滑入水中，损失气血！' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'走私货物的木桶，里面藏着好东西' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'poison_snake',  desc:'一条盘踞在水道里的毒蛇' },
        { type:'battle', cleared:false, enemyId:'water_thug',    desc:'水寇巡逻队' },
        { type:'rest',   cleared:false, desc:'水道交汇的干燥石台，可以停下来喘口气' },
        { type:'elite',  cleared:false, enemyId:'water_thug',    desc:'水寇头领，以短桨为兵器' },
        { type:'boss',   cleared:false, enemyId:'water_pirate_chief', desc:'【水道霸主·摆渡刀】走私水道的实际控制者，刀法凌厉如水' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:2400, silver:320, items:[{id:'item_herb_rare',qty:2},{id:'item_elixir_low',qty:1}], manualChance:0.20 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ── N5. 江湖私塾（Lv15-28，小型，2行×4列）──
  dungeon_jianghu_school: {
    id:       'dungeon_jianghu_school',
    name:     '江湖私塾暗室',
    icon:     '📚',
    desc:     '汴京一家表面教书育人的私塾，背地里是某野道门的秘密基地。地下有修炼室和密道，野道门弟子在此研习邪门武功。',
    theme:    'temple',
    minLevel: 15,
    maxLevel: 28,
    nearCities: ['kaifeng', 'luoyang'],
    terrain:  '建筑内部',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'私塾后院的机关暗门，楼梯通向地下' },
        { type:'battle', cleared:false, enemyId:'wild_sect_disciple', desc:'守在走廊的野道门小弟' },
        { type:'battle', cleared:false, enemyId:'wild_sect_disciple', desc:'暗处放哨的弟子' },
        { type:'trap',   cleared:false, desc:'步骤机关，踩错顺序触发毒针！' },
        { type:'chest',  cleared:false, lootTier:'uncommon',          desc:'野道门弟子的秘密储物柜' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wild_sect_disciple', desc:'两名修炼中被打断的弟子' },
        { type:'battle', cleared:false, enemyId:'wild_sect_disciple', desc:'闻讯赶来的增援' },
        { type:'rest',   cleared:false, desc:'暗室内的打坐石台，此地充满灵气可恢复内力' },
        { type:'elite',  cleared:false, enemyId:'wild_sect_disciple', desc:'野道门执事，武功比普通弟子高出一截' },
        { type:'boss',   cleared:false, enemyId:'wild_sect_master',   desc:'【私塾先生·钱老狗】人前是私塾老师，人后是野道门坛主，功法阴险' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:3500, silver:420, items:[{id:'item_herb_rare',qty:2},{id:'item_spirit_stone',qty:1}], manualChance:0.24 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N6. 官道劫匪窟（Lv18-30，标准，3行×5列）──
  dungeon_highway_robbers_den: {
    id:       'dungeon_highway_robbers_den',
    name:     '官道劫匪窟',
    icon:     '🛣️',
    desc:     '长安官道旁的山腹巢穴，一伙有组织的劫匪盘踞于此，专劫官商要路，已被官府通缉多年。',
    theme:    'camp',
    minLevel: 18,
    maxLevel: 30,
    nearCities: ['xian'],
    terrain:  '山地',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'山腹洞口，地上散落着被劫行商的遗物' },
        { type:'battle', cleared:false, enemyId:'highway_robber',     desc:'两个持刀劫匪守着入口' },
        { type:'trap',   cleared:false, desc:'绊马索机关，惊动全巢！' },
        { type:'battle', cleared:false, enemyId:'highway_robber',     desc:'一群劫匪从侧洞涌出' },
        { type:'chest',  cleared:false, lootTier:'uncommon',           desc:'劫来的商货，价值不菲' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'highway_robber',     desc:'巡逻队，人数不少' },
        { type:'rest',   cleared:false, desc:'劫匪的饭堂，有吃有喝，趁机补给' },
        { type:'event',  cleared:false, desc:'一个被绑架等待赎金的商人，愿以报酬换自由' },
        { type:'elite',  cleared:false, enemyId:'highway_robber',     desc:'劫匪中的武功高手，自称学过正规功夫' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'劫匪头目的私藏' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'highway_robber',     desc:'最后一道守卫' },
        { type:'trap',   cleared:false, desc:'暗箭机关，从侧壁射出！' },
        { type:'battle', cleared:false, enemyId:'highway_robber',     desc:'头目贴身护卫' },
        { type:'boss',   cleared:false, enemyId:'highway_robber_boss', desc:'【截道鬼·方七害】官府悬赏五百两白银的江洋大盗' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:4000, silver:450, items:[{id:'item_iron_ore',qty:5},{id:'item_herb_rare',qty:2},{id:'item_elixir_low',qty:2}], manualChance:0.22 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ── N7. 苗疆蛊王洞（Lv22-38，标准，3行×5列）──
  dungeon_miao_gu_cave: {
    id:       'dungeon_miao_gu_cave',
    name:     '苗疆蛊王洞',
    icon:     '🦋',
    desc:     '贵州苗疆深处，传说中蛊王居住的山洞。洞内遍布毒虫、蛊阵，苗疆蛊师在此修炼上古蛊术，习得者能以蛊虫操控人心。',
    theme:    'swamp',
    minLevel: 22,
    maxLevel: 38,
    nearCities: ['guiyang', 'wudu_miao'],
    terrain:  '丛林洞穴',
    floors:   1,
    specialRule: 'poison_aura',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'洞口遍布骷髅装饰，苗疆风格的咒符挂满树枝' },
        { type:'battle', cleared:false, enemyId:'miao_gu_shaman',     desc:'持蛊鼓的苗疆蛊师' },
        { type:'trap',   cleared:false, desc:'蛊虫陷阱，踩到后身中蛊毒！' },
        { type:'battle', cleared:false, enemyId:'five_poison_disciple',desc:'配合蛊师的五毒弟子' },
        { type:'chest',  cleared:false, lootTier:'uncommon',           desc:'蛊师配制的毒药和草药' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'miao_gu_shaman',     desc:'两位蛊师联手施蛊' },
        { type:'rest',   cleared:false, desc:'洞中天然流泉，泉水有解蛊之效' },
        { type:'event',  cleared:false, desc:'一只通了灵气的蛊虫，似乎想帮你' },
        { type:'elite',  cleared:false, enemyId:'miao_gu_shaman',     desc:'高阶蛊师，能同时控制三种蛊虫' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'蛊王留下的蛊方秘笈' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'miao_gu_shaman',     desc:'最强的蛊师守卫内洞' },
        { type:'trap',   cleared:false, desc:'蛊王大阵启动，毒雾充斥全洞！' },
        { type:'battle', cleared:false, enemyId:'five_poison_disciple',desc:'蛊王的贴身护卫' },
        { type:'boss',   cleared:false, enemyId:'miao_gu_king',       desc:'【苗疆蛊王·巫蛊婆婆】百岁蛊婆，以人蛊为最高武学，天下蛊毒尽在掌中' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:5500, silver:580, items:[{id:'item_poison_gland',qty:3},{id:'item_herb_rare',qty:3},{id:'item_antidote',qty:2}], manualChance:0.26 },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.12,
  },

  // ── N8. 武当后山禁区（Lv25-40，小型，2行×4列）──
  dungeon_wudang_forbidden_hill: {
    id:       'dungeon_wudang_forbidden_hill',
    name:     '武当后山禁区',
    icon:     '⛩️',
    desc:     '武当山后山一处外人不知的禁地，据说是历代真人闭关悟道之所。近年来有邪徒潜入，意图窃取武当镇派真经，武当已派人追查。',
    theme:    'mountain',
    minLevel: 25,
    maxLevel: 40,
    nearCities: ['wudang_mtn', 'hanzhong'],
    terrain:  '高山',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'禁区入口，刻有"内门弟子方可入内"的石碑' },
        { type:'battle', cleared:false, enemyId:'wudang_spy',     desc:'潜入此处的江湖蟊贼，被武当弟子追赶' },
        { type:'battle', cleared:false, enemyId:'wudang_spy',     desc:'望风的同伙' },
        { type:'trap',   cleared:false, desc:'武当太极阵机关，气机逆转，损失内力！' },
        { type:'chest',  cleared:false, lootTier:'rare',           desc:'武当弟子的修炼笔记' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'wudang_spy',     desc:'两个偷取武当秘典的宵小' },
        { type:'battle', cleared:false, enemyId:'wudang_spy',     desc:'接应的江湖人士' },
        { type:'rest',   cleared:false, desc:'禁区中的太极石台，在此打坐内力恢复加倍' },
        { type:'elite',  cleared:false, enemyId:'wudang_spy',     desc:'组织偷盗的幕后奸人，武功不弱' },
        { type:'boss',   cleared:false, enemyId:'wudang_traitor', desc:'【武当叛徒·贪风】曾是武当弟子，背叛门派出卖秘典，以偷学到的真武剑法害人' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:5500, silver:600, items:[{id:'item_spirit_stone',qty:2},{id:'item_herb_rare',qty:3}], manualChance:0.28 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ══════════════════════════════════════
  //  十一、新增地下城组（Lv35-60 高级扩展）
  // ══════════════════════════════════════

  // ── N9. 沿海走私港（Lv30-48，标准，3行×5列）──
  dungeon_smuggler_harbor: {
    id:       'dungeon_smuggler_harbor',
    name:     '沿海走私港',
    icon:     '⚓',
    desc:     '泉州近海一处隐秘的走私港湾，由海商与黑道联手经营，专运奇珍异宝和禁物。港内有重兵把守，官府多次围剿均无功而返。',
    theme:    'ocean',
    minLevel: 30,
    maxLevel: 48,
    nearCities: ['quanzhou'],
    terrain:  '海岸',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'隐秘港湾入口，巡逻船只来回游弋' },
        { type:'battle', cleared:false, enemyId:'smuggler_guard',    desc:'港口守卫，手持火把扫视' },
        { type:'trap',   cleared:false, desc:'锁链机关，触发后脚踝被锁住！' },
        { type:'battle', cleared:false, enemyId:'smuggler_guard',    desc:'换班的守卫队伍' },
        { type:'chest',  cleared:false, lootTier:'uncommon',          desc:'走私货仓里的普通货物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'smuggler_guard',    desc:'发现入侵者的巡逻兵' },
        { type:'rest',   cleared:false, desc:'仓库侧间，里面有走私来的补给品' },
        { type:'event',  cleared:false, desc:'一个被扣押的官府密探，知道港口头目的秘密' },
        { type:'elite',  cleared:false, enemyId:'smuggler_captain',  desc:'走私港的武功总管，善用铁锁功' },
        { type:'chest',  cleared:false, lootTier:'epic',              desc:'压仓的最贵货物，以血肉守护' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'smuggler_guard',    desc:'最后的港口卫兵' },
        { type:'battle', cleared:false, enemyId:'smuggler_captain',  desc:'头目的亲信护卫' },
        { type:'trap',   cleared:false, desc:'爆炸货物！引燃库存！' },
        { type:'boss',   cleared:false, enemyId:'smuggler_boss',     desc:'【走私枭雄·银牙罗】以白银铸牙以示豪横，东海走私第一人' },
      ],
    ],
    startPos: [0, 0],
    specialRule: 'ocean_wind',
    bossReward: { exp:7000, silver:900, items:[{id:'item_western_silk',qty:3},{id:'item_spirit_stone',qty:2},{id:'item_gem',qty:1}], manualChance:0.28 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N10. 草原马贼营（Lv30-45，标准，3行×5列）──
  dungeon_steppe_bandit_camp: {
    id:       'dungeon_steppe_bandit_camp',
    name:     '草原马贼大营',
    icon:     '🐴',
    desc:     '燕云十六州以北草原上一支庞大马贼势力的大本营，以骑射和劫掠为生，官府从未成功剿灭。营地藏于草甸深处，外人难以察觉。',
    theme:    'camp',
    minLevel: 30,
    maxLevel: 45,
    nearCities: ['youzhou', 'cangzhou'],
    terrain:  '草原',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'马贼营外围，到处是拴马的木桩' },
        { type:'battle', cleared:false, enemyId:'steppe_rider',      desc:'持弓的骑射手发现了你' },
        { type:'battle', cleared:false, enemyId:'steppe_rider',      desc:'两人一组的巡逻骑手' },
        { type:'trap',   cleared:false, desc:'马绳绊索，绊倒！' },
        { type:'chest',  cleared:false, lootTier:'uncommon',          desc:'劫来的商队货物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'steppe_rider',      desc:'营帐间的散兵' },
        { type:'rest',   cleared:false, desc:'马贼的炊事帐，有烤肉和马奶酒' },
        { type:'elite',  cleared:false, enemyId:'steppe_champion',   desc:'草原勇士，马上马下皆是一流' },
        { type:'event',  cleared:false, desc:'一个被掳来的中原商人，愿以情报换自由' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'大营主帐里的战利品' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'steppe_rider',      desc:'守卫主帐的精锐战士' },
        { type:'battle', cleared:false, enemyId:'steppe_champion',   desc:'草原勇士护卫头领' },
        { type:'trap',   cleared:false, desc:'投石机发射，巨石砸来！' },
        { type:'boss',   cleared:false, enemyId:'steppe_warlord',    desc:'【草原霸主·铁木真格】统一草原马贼的枭雄，一杆马槊天下无双' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:6500, silver:750, items:[{id:'item_fur',qty:4},{id:'item_spirit_stone',qty:2},{id:'item_beast_bone',qty:3}], manualChance:0.28 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.08,
  },

  // ── N11. 道观暗炉（Lv35-52，小型，2行×4列）──
  dungeon_taoist_dark_forge: {
    id:       'dungeon_taoist_dark_forge',
    name:     '问道阁暗炉',
    icon:     '🔮',
    desc:     '杭州附近一座道观，表面香火鼎盛，实则观主以神圣之名行炼血炉鼎之术，以江湖人的内力为燃料炼制邪丹，贪图长生。',
    theme:    'fire',
    minLevel: 35,
    maxLevel: 52,
    nearCities: ['hangzhou', 'suzhou'],
    terrain:  '道观',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'道观后院，暗藏地下的炉鼎大殿' },
        { type:'battle', cleared:false, enemyId:'dark_taoist',     desc:'保护暗炉的观主心腹道士' },
        { type:'battle', cleared:false, enemyId:'dark_taoist',     desc:'巡逻的炼丹童子' },
        { type:'trap',   cleared:false, desc:'炉火机关，喷出灼热火焰！' },
        { type:'chest',  cleared:false, lootTier:'rare',            desc:'炼丹炉旁的药材储备' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'dark_taoist',     desc:'三个道士守护鼎炉' },
        { type:'battle', cleared:false, enemyId:'dark_taoist',     desc:'闻讯赶来的护法' },
        { type:'rest',   cleared:false, desc:'旁殿供奉的神像，真气尚存，可在此恢复' },
        { type:'elite',  cleared:false, enemyId:'dark_taoist',     desc:'大弟子，已将炉鼎真气化为杀器' },
        { type:'boss',   cleared:false, enemyId:'dark_taoist_master', desc:'【问道阁主·腐骨真人】以百年内力炼邪丹求长生，本体已形如枯骨但真气极深' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:8800, silver:1050, items:[{id:'item_fire_crystal',qty:2},{id:'item_spirit_stone',qty:3},{id:'item_elixir_mid',qty:1}], manualChance:0.32 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N12. 南疆瘴气谷（Lv38-55，标准，3行×5列）──
  dungeon_southern_miasma_valley: {
    id:       'dungeon_southern_miasma_valley',
    name:     '南疆瘴气谷',
    icon:     '🌿',
    desc:     '云南南疆一条终年弥漫着瘴气的幽深山谷，传闻谷底有失落的上古药典。瘴气中毒虫横行、妖兽成群，只有苗疆土著才知道解瘴之法。',
    theme:    'swamp',
    minLevel: 38,
    maxLevel: 55,
    nearCities: ['guiyang', 'wudu_miao'],
    terrain:  '丛林',
    floors:   1,
    specialRule: 'poison_aura',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'山谷入口，空气中弥漫着甜腻的瘴气' },
        { type:'battle', cleared:false, enemyId:'jungle_beast',       desc:'瘴气中变异的巨兽' },
        { type:'trap',   cleared:false, desc:'瘴气漩涡，陷入后中毒加重！' },
        { type:'battle', cleared:false, enemyId:'jungle_beast',       desc:'两只毒化猛兽守着岔路' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'先辈探险者的遗留包裹' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'miasma_zombie',      desc:'被瘴气侵染，半活半死的行尸' },
        { type:'rest',   cleared:false, desc:'谷中清泉，泉水有解瘴之效，可以稍作恢复' },
        { type:'event',  cleared:false, desc:'一份上古药典的残页，记载着此谷的秘密' },
        { type:'elite',  cleared:false, enemyId:'miasma_zombie',      desc:'最强的瘴气行尸，全身弥漫毒气' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'上古药典！藏在谷底的秘宝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'jungle_beast',       desc:'谷底的最强毒化猛兽' },
        { type:'trap',   cleared:false, desc:'瘴气大爆发，毒素浓度骤增！' },
        { type:'battle', cleared:false, enemyId:'miasma_zombie',      desc:'行尸群护卫谷底禁地' },
        { type:'boss',   cleared:false, enemyId:'miasma_king',        desc:'【瘴气王·绿化尸】吸收百年瘴气之精华，已化为非人非鬼的最强瘴气体' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:9500, silver:1100, items:[{id:'item_herb_rare',qty:5},{id:'item_poison_gland',qty:4},{id:'item_antidote',qty:3}], manualChance:0.32 },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.12,
  },

  // ── N13. 黄河漕运寨（Lv40-58，标准，3行×5列）──
  dungeon_yellow_river_stronghold: {
    id:       'dungeon_yellow_river_stronghold',
    name:     '黄河漕运寨',
    icon:     '🌊',
    desc:     '黄河渡口边一座以漕运为掩护的武林帮会大寨，控制黄河中游所有过路税收，以武力垄断这段水路已逾二十年。',
    theme:    'water',
    minLevel: 40,
    maxLevel: 58,
    nearCities: ['kaifeng', 'cangzhou', 'luoyang'],
    terrain:  '水乡',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'漕运寨码头，停着十几艘运粮大船' },
        { type:'battle', cleared:false, enemyId:'canal_guard',        desc:'守码头的漕帮打手' },
        { type:'event',  cleared:false, desc:'一个被勒索的漕工，愿意帮你传递消息' },
        { type:'battle', cleared:false, enemyId:'canal_guard',        desc:'换班的打手队伍' },
        { type:'chest',  cleared:false, lootTier:'uncommon',           desc:'漕帮的货仓，藏着收来的过路钱' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'canal_warrior',      desc:'漕帮精锐战士，以铁棍为兵' },
        { type:'rest',   cleared:false, desc:'寨内伙房，有充足的粮食和清水' },
        { type:'trap',   cleared:false, desc:'水上暗器机关，触发后水箭四射！' },
        { type:'elite',  cleared:false, enemyId:'canal_warrior',      desc:'漕帮执法长老，以水功为绝技' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'寨主私库，多年勒索的积累' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'canal_guard',        desc:'最后的守卫' },
        { type:'battle', cleared:false, enemyId:'canal_warrior',      desc:'寨主的亲兵' },
        { type:'trap',   cleared:false, desc:'漕帮水阵，洪水涌来！' },
        { type:'boss',   cleared:false, enemyId:'canal_overlord',     desc:'【漕帮寨主·黄河老龙】以黄河水功称霸一方，手握黄河中游生杀大权' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:10000, silver:1200, items:[{id:'item_water_pearl',qty:3},{id:'item_spirit_stone',qty:3},{id:'item_elixir_mid',qty:2}], manualChance:0.32 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ══════════════════════════════════════
  //  十二、新增地下城组（Lv55-80 精英扩展）
  // ══════════════════════════════════════

  // ── N14. 昆仑山神宫（Lv50-68，中型，3行×5列）──
  dungeon_kunlun_divine_palace: {
    id:       'dungeon_kunlun_divine_palace',
    name:     '昆仑山神宫',
    icon:     '🏔️',
    desc:     '昆仑山绝顶隐藏的上古神宫，相传是昆仑派祖师留下的最终修炼之所。近年来一股神秘势力强行进驻，封锁了神宫，对外宣称发现了镇压妖魔的上古秘宝。',
    theme:    'mountain',
    minLevel: 50,
    maxLevel: 68,
    nearCities: ['yumenguan', 'hetian'],
    terrain:  '高山',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'神宫石阶，云雾缭绕，脚下是万丈深渊' },
        { type:'battle', cleared:false, enemyId:'kunlun_invader',     desc:'占据神宫的武装人员' },
        { type:'trap',   cleared:false, desc:'神宫机关，古老的昆仑剑气阵激活！' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'昆仑派历代留存的宝物' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'kunlun_invader',     desc:'侵占者的巡逻队' },
        { type:'rest',   cleared:false, desc:'神宫灵气聚集的莲台，在此打坐可大幅恢复内力' },
        { type:'elite',  cleared:false, enemyId:'kunlun_invader',     desc:'侵占者的武功统领' },
        { type:'event',  cleared:false, desc:'神宫的最后一个守宫老人，请求你驱逐侵占者' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'神宫最深处的昆仑秘宝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'kunlun_invader',     desc:'守护内殿的精锐卫兵' },
        { type:'trap',   cleared:false, desc:'昆仑绝顶剑气大阵！剑光横扫！' },
        { type:'battle', cleared:false, enemyId:'kunlun_invader',     desc:'最后的侵占者守卫' },
        { type:'boss',   cleared:false, enemyId:'kunlun_warlord',     desc:'【昆仑侵主·刀剑独孤】以一己之力强占神宫，志在窃取上古秘宝' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:12000, silver:1500, items:[{id:'item_ice_crystal',qty:3},{id:'item_spirit_stone',qty:4},{id:'item_chaos_essence',qty:1}], manualChance:0.34 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N15. 东海剑岛（Lv52-70，中型，3行×5列）──
  dungeon_eastern_sea_sword_island: {
    id:       'dungeon_eastern_sea_sword_island',
    name:     '东海剑岛',
    icon:     '🗡️',
    desc:     '东海上一座孤岛，百年前一位天下无双的剑客在此封剑，留下"剑冢"和无数死守遗命的遗徒。剑冢内藏有传说中的绝世剑谱，无数剑客折戟于此。',
    theme:    'ocean',
    minLevel: 52,
    maxLevel: 70,
    nearCities: ['hangzhou', 'mingzhou'],
    terrain:  '海岛',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'剑岛海岸，遍地是古旧的断剑残骸' },
        { type:'battle', cleared:false, enemyId:'sword_island_guard', desc:'守岛的剑冢遗徒' },
        { type:'trap',   cleared:false, desc:'剑气机关，乱剑从地下射出！' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'前辈剑客留下的物品' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'sword_island_guard', desc:'遗徒中的老辈弟子' },
        { type:'rest',   cleared:false, desc:'剑冢旁的孤松下，剑气中打坐能感悟剑意' },
        { type:'event',  cleared:false, desc:'剑冢前刻有一篇剑道心法，研读可悟剑道' },
        { type:'elite',  cleared:false, enemyId:'sword_island_guard', desc:'遗徒首席，剑法已入化境' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'剑冢的镇宝：绝世剑谱残页' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'sword_island_guard', desc:'剑冢守门的最强遗徒' },
        { type:'trap',   cleared:false, desc:'封剑阵法！万剑归宗，剑气如山倒！' },
        { type:'battle', cleared:false, enemyId:'sword_island_guard', desc:'誓死护卫剑冢的弟子' },
        { type:'boss',   cleared:false, enemyId:'sword_island_guardian',desc:'【剑冢守灵·无剑老人】遗留的一缕剑意凝聚成形，无剑胜有剑，天下剑道最后的传承' },
      ],
    ],
    startPos: [0, 0],
    specialRule: 'ocean_wind',
    bossReward: { exp:13500, silver:1700, items:[{id:'item_sword_shard',qty:5},{id:'item_spirit_stone',qty:4},{id:'item_manual_rare',qty:1}], manualChance:0.38 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N16. 地火炼狱（Lv55-75，标准，3行×5列）──
  dungeon_underground_purgatory: {
    id:       'dungeon_underground_purgatory',
    name:     '地底炼狱洞',
    icon:     '🌋',
    desc:     '四川一处地下火山活动区，地热喷发，岩浆涌动。明教一支极端派系在此建立隐秘据点，以"炼狱之火"考验信众，存活下来的都是精锐中的精锐。',
    theme:    'fire',
    minLevel: 55,
    maxLevel: 75,
    nearCities: ['chengdu', 'chongqing'],
    terrain:  '火山地带',
    floors:   1,
    specialRule: 'fire_aura',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'地底洞口，热浪滚滚，脚下岩石滚烫' },
        { type:'battle', cleared:false, enemyId:'fire_fanatic',        desc:'身披火焰、以炼狱为荣的极端信众' },
        { type:'trap',   cleared:false, desc:'岩浆喷口机关，触发后被熔岩喷溅！' },
        { type:'chest',  cleared:false, lootTier:'rare',                desc:'信众修炼时遗留的宝物' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'fire_fanatic',        desc:'两名炼狱信众联手' },
        { type:'rest',   cleared:false, desc:'内力隔热的石台，可以在此短暂休息' },
        { type:'event',  cleared:false, desc:'一个被扔进炼狱"考验"的无辜者，求你救他' },
        { type:'elite',  cleared:false, enemyId:'fire_champion',       desc:'通过炼狱考验的最强信众，身体已近乎火焰化' },
        { type:'chest',  cleared:false, lootTier:'epic',                desc:'炼狱核心的至宝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'fire_fanatic',        desc:'守护炼狱主殿的精锐' },
        { type:'trap',   cleared:false, desc:'全区域地热爆发！' },
        { type:'elite',  cleared:false, enemyId:'fire_champion',       desc:'炼狱的传道者，以火焰为信仰' },
        { type:'boss',   cleared:false, enemyId:'purgatory_overlord',  desc:'【炼狱主·火祭司】在炼狱中修炼数十年，已成半人半火的存在，明教异端' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:14500, silver:1800, items:[{id:'item_fire_crystal',qty:5},{id:'item_flame_essence',qty:3},{id:'item_spirit_stone',qty:4}], manualChance:0.36 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N17. 少林藏经阁地宫（Lv55-72，中型，3行×5列）──
  dungeon_shaolin_scripture_vault: {
    id:       'dungeon_shaolin_scripture_vault',
    name:     '少林藏经阁地宫',
    icon:     '📖',
    desc:     '少林寺地下秘藏，供奉着千年佛法武学经典。一次偷盗事件中，贼人被困于此，将地宫改造成贼窝。少林已封闭地宫，等待有缘人清理门户。',
    theme:    'temple',
    minLevel: 55,
    maxLevel: 72,
    nearCities: ['nanyang'],
    terrain:  '寺庙地宫',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'地宫入口，佛灯长明，地面有脚印' },
        { type:'battle', cleared:false, enemyId:'scripture_thief',    desc:'潜入地宫的盗贼' },
        { type:'trap',   cleared:false, desc:'少林护经阵机关！金刚之力横扫！' },
        { type:'chest',  cleared:false, lootTier:'rare',               desc:'被盗贼随手扔在地上的经典残页' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'scripture_thief',    desc:'两个联手的盗贼' },
        { type:'rest',   cleared:false, desc:'佛像前的蒲团，佛光庇护，在此打坐可恢复内力' },
        { type:'elite',  cleared:false, enemyId:'scripture_thief',    desc:'盗贼头目的副手，武功已成气候' },
        { type:'event',  cleared:false, desc:'一位少林弟子在此研读经典，愿为你引路' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'地宫深处的镇宫宝典' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'scripture_thief',    desc:'守卫内库的盗贼精锐' },
        { type:'trap',   cleared:false, desc:'护经真力大阵全开！佛光灼烧邪徒！' },
        { type:'battle', cleared:false, enemyId:'scripture_thief',    desc:'最后的盗贼护卫' },
        { type:'boss',   cleared:false, enemyId:'scripture_thief_lord',desc:'【偷经贼首·无字禅】曾是少林叛徒，偷走半部绝技后一直躲藏，如今改邪难归正' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:13000, silver:1600, items:[{id:'item_copper_core',qty:2},{id:'item_spirit_stone',qty:5},{id:'item_chaos_essence',qty:1}], manualChance:0.35 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.12,
  },

  // ── N18. 天南毒林（Lv58-78，标准，3行×5列）──
  dungeon_southern_poison_forest: {
    id:       'dungeon_southern_poison_forest',
    name:     '天南百毒林',
    icon:     '☠️',
    desc:     '云南南部边陲一片神秘丛林，生长着数百种世间最烈的毒草毒虫，连空气都带着毒性。五毒教在此建有最高机密的炼毒场，非核心弟子不得进入。',
    theme:    'swamp',
    minLevel: 58,
    maxLevel: 78,
    nearCities: ['wudu_miao', 'guiyang'],
    terrain:  '丛林',
    floors:   1,
    specialRule: 'poison_aura',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'毒林入口，毒雾浓厚，视野不超过三丈' },
        { type:'battle', cleared:false, enemyId:'five_poison_disciple', desc:'巡逻的五毒弟子，已服百毒不侵之药' },
        { type:'trap',   cleared:false, desc:'蛊虫陷阱，踩中后多重中毒！' },
        { type:'battle', cleared:false, enemyId:'five_poison_disciple', desc:'守护炼毒场外围的精锐弟子' },
        { type:'chest',  cleared:false, lootTier:'rare',                 desc:'炼毒场的原材料储备' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'five_poison_elder',   desc:'五毒长老巡视炼毒进度' },
        { type:'rest',   cleared:false, desc:'林中唯一的解毒清泉，五毒弟子视为圣地' },
        { type:'event',  cleared:false, desc:'一份记载百毒秘方的炼毒笔记' },
        { type:'elite',  cleared:false, enemyId:'five_poison_elder',   desc:'百毒不侵的高阶长老，以毒为兵' },
        { type:'chest',  cleared:false, lootTier:'epic',                 desc:'炼毒场的最高机密毒方' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'five_poison_disciple', desc:'最后的弟子守卫' },
        { type:'trap',   cleared:false, desc:'毒王大阵！千毒同发！' },
        { type:'elite',  cleared:false, enemyId:'five_poison_elder',   desc:'炼毒场总管，以身炼毒五十年' },
        { type:'boss',   cleared:false, enemyId:'five_poison_boss',    desc:'【毒王·鸩血老祖】以鸩血为酒、百毒为食，修炼五十年，毒功冠绝天下' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:15000, silver:1900, items:[{id:'item_poison_gland',qty:6},{id:'item_herb_rare',qty:4},{id:'item_snake_scale',qty:3}], manualChance:0.38 },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.12,
  },

  // ══════════════════════════════════════
  //  十三、新增地下城组（Lv70-100 顶级扩展）
  // ══════════════════════════════════════

  // ── N19. 藏边秘寺（Lv62-82，中型，3行×5列）──
  dungeon_tibet_secret_temple: {
    id:       'dungeon_tibet_secret_temple',
    name:     '藏边密宗秘寺',
    icon:     '🏔️',
    desc:     '西藏边境山巅一座千年密宗古寺，藏有无上密宗武学。寺中密宗修士以佛法和武力护寺，近年被外道强行侵入，双方激战不休，寺院已遭严重破坏。',
    theme:    'temple',
    minLevel: 62,
    maxLevel: 82,
    nearCities: ['xiyu_city', 'tianshan_peak'],
    terrain:  '高山',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'密宗古寺外院，法铃声声，却混杂着兵刃相击之声' },
        { type:'battle', cleared:false, enemyId:'outer_invader',       desc:'侵入密寺的外道武徒' },
        { type:'trap',   cleared:false, desc:'密宗护寺阵法！金刚咒语激活！' },
        { type:'chest',  cleared:false, lootTier:'rare',                desc:'被外道破坏遗散的寺宝' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'outer_invader',       desc:'外道精锐在走廊上巡逻' },
        { type:'rest',   cleared:false, desc:'密宗静室，佛光尚存，在此可大幅恢复内力' },
        { type:'event',  cleared:false, desc:'一位受伤的密宗大师，愿传授你密宗护身之法' },
        { type:'elite',  cleared:false, enemyId:'outer_invader',       desc:'外道武功首席，觊觎密宗宝典已久' },
        { type:'chest',  cleared:false, lootTier:'epic',                desc:'密宗秘殿内的至宝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'outer_invader',       desc:'最后的外道守卫' },
        { type:'trap',   cleared:false, desc:'密宗终极护法阵！威力惊天！' },
        { type:'battle', cleared:false, enemyId:'outer_invader',       desc:'头目的亲卫队' },
        { type:'boss',   cleared:false, enemyId:'tibet_invader_chief', desc:'【外道首领·索命罗刹】以魔功强占密寺，意图参透密宗武学的终极奥义' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:19000, silver:2300, items:[{id:'item_sand_crystal',qty:3},{id:'item_spirit_stone',qty:6},{id:'item_chaos_essence',qty:2}], manualChance:0.40 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N20. 朝廷锦衣卫秘狱（Lv65-85，中型，3行×5列）──
  dungeon_imperial_secret_prison: {
    id:       'dungeon_imperial_secret_prison',
    name:     '锦衣卫秘密诏狱',
    icon:     '🔒',
    desc:     '汴京皇城地下一座秘密诏狱，关押着各方势力中最危险的江湖人物。因内部贪污腐败，诏狱已暗中被某大阁老控制，成为私设刑堂，随意关押异己。',
    theme:    'dark',
    minLevel: 65,
    maxLevel: 85,
    nearCities: ['kaifeng'],
    terrain:  '地下',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'秘狱入口，戒备森严，但有内线帮你开门' },
        { type:'battle', cleared:false, enemyId:'imperial_guard',      desc:'锦衣卫守卫，以皇家功法训练' },
        { type:'trap',   cleared:false, desc:'机关弩阵，触发后连珠箭射！' },
        { type:'chest',  cleared:false, lootTier:'epic',                desc:'从被关押的江湖人身上没收的财物' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'imperial_guard',      desc:'换班的锦衣精锐' },
        { type:'rest',   cleared:false, desc:'狱卒值班室，有酒有肉，趁机补给' },
        { type:'event',  cleared:false, desc:'关在此处的江湖侠客，知道幕后阁老的秘密' },
        { type:'elite',  cleared:false, enemyId:'imperial_chief_guard', desc:'诏狱千户，以残酷审讯之法著称' },
        { type:'chest',  cleared:false, lootTier:'legendary',           desc:'阁老的私库，藏着无数贪来的宝物' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'imperial_guard',      desc:'内殿最强守卫' },
        { type:'trap',   cleared:false, desc:'诏狱终极防御阵法！' },
        { type:'battle', cleared:false, enemyId:'imperial_chief_guard', desc:'两名千户联手守门' },
        { type:'boss',   cleared:false, enemyId:'corrupt_official',    desc:'【腐败阁老·严铁面】手握诏狱生杀大权，以皇家武学护身，阴险狠毒' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:20000, silver:2500, items:[{id:'item_dark_crystal',qty:3},{id:'item_spirit_stone',qty:6},{id:'item_chaos_essence',qty:2}], manualChance:0.40 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N21. 海底珊瑚宫（Lv68-88，大型，4行×5列）──
  dungeon_coral_sea_palace: {
    id:       'dungeon_coral_sea_palace',
    name:     '海底珊瑚宫',
    icon:     '🪸',
    desc:     '南海海底一座以珊瑚和贝壳构建的绚丽宫殿，是南海鲛族的精神圣地。鲛族以高超水功和奇异异术闻名，凡人难以踏入。近年与人类武林的冲突愈演愈烈。',
    theme:    'water',
    minLevel: 68,
    maxLevel: 88,
    nearCities: ['quanzhou', 'hangzhou'],
    terrain:  '水下',
    floors:   2,
    specialRule: 'underwater',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'珊瑚宫外围，彩色光芒在水中流动' },
        { type:'battle', cleared:false, enemyId:'coral_shark_guard',   desc:'宫殿外围的鲛族卫士' },
        { type:'trap',   cleared:false, desc:'水流漩涡机关，被吸入！' },
        { type:'battle', cleared:false, enemyId:'coral_shark_guard',   desc:'两队鲛族巡逻兵' },
        { type:'chest',  cleared:false, lootTier:'rare',                desc:'鲛族的财宝收藏' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'coral_mermaid',       desc:'鲛族女战士，以歌声迷惑敌人' },
        { type:'rest',   cleared:false, desc:'暖流区域，温热水流有治愈之效' },
        { type:'event',  cleared:false, desc:'一条迷路的人鱼幼儿，哭着求你帮她找到父母' },
        { type:'elite',  cleared:false, enemyId:'coral_elder',         desc:'鲛族长老，水功已达化境' },
        { type:'chest',  cleared:false, lootTier:'epic',                desc:'珊瑚宫的宝库，积蓄千年的海底珍宝' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'coral_shark_guard',   desc:'内宫守卫' },
        { type:'battle', cleared:false, enemyId:'coral_mermaid',       desc:'鲛族战士联手' },
        { type:'elite',  cleared:false, enemyId:'coral_elder',         desc:'宫殿护卫首席长老' },
        { type:'chest',  cleared:false, lootTier:'legendary',           desc:'珊瑚宫最深处的镇宫宝物' },
      ],
      [
        null,
        null,
        { type:'battle', cleared:false, enemyId:'coral_shark_guard',   desc:'最后的卫队' },
        { type:'trap',   cleared:false, desc:'潮汐大阵！水压骤增！' },
        { type:'boss',   cleared:false, enemyId:'coral_sea_king',      desc:'【南海鲛王·碧浪君】南海鲛族之王，万年修炼，以海水为剑，滔天神威' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:22000, silver:2800, items:[{id:'item_water_pearl',qty:6},{id:'item_dragon_scale',qty:1},{id:'item_spirit_stone',qty:6}], manualChance:0.42 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N22. 天雷峰巅（Lv72-90，小型，2行×4列）──
  dungeon_thunder_peak: {
    id:       'dungeon_thunder_peak',
    name:     '天雷峰顶',
    icon:     '⚡',
    desc:     '燕赵之地传说中雷神降临的峰顶，终年雷电不断。一位修炼雷法至颠的老魔头在此盘踞，以雷电为护体，轻易不与人交手——因为没有人能活着靠近。',
    theme:    'mountain',
    minLevel: 72,
    maxLevel: 90,
    nearCities: ['youzhou', 'cangzhou'],
    terrain:  '高山',
    floors:   1,
    specialRule: 'storm_field',  // 暴风雷电：每2回合触发一次随机雷击
    map: [
      [
        { type:'entry',  cleared:true,  desc:'峰顶入口，雷声滚滚，天地间充斥着电流' },
        { type:'battle', cleared:false, enemyId:'thunder_disciple',    desc:'被老魔头收养的雷法信徒' },
        { type:'battle', cleared:false, enemyId:'thunder_disciple',    desc:'巡逻的雷法侍从' },
        { type:'trap',   cleared:false, desc:'雷阵机关！天雷降临！' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'雷法修炼者的遗物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'thunder_disciple',    desc:'誓死护卫老魔头的门徒' },
        { type:'battle', cleared:false, enemyId:'thunder_disciple',    desc:'雷法高手拦路' },
        { type:'rest',   cleared:false, desc:'峰顶避雷石，以真气护体可在此短暂歇息' },
        { type:'elite',  cleared:false, enemyId:'thunder_disciple',    desc:'最强门徒，以雷法称霸一时' },
        { type:'boss',   cleared:false, enemyId:'thunder_demon',       desc:'【天雷老魔·霹雳尊者】以雷法入魔，身体已成人形雷胆，触之即殛' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:22500, silver:2600, items:[{id:'item_thunder_core',qty:5},{id:'item_chaos_essence',qty:3},{id:'item_spirit_stone',qty:5}], manualChance:0.44 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N23. 玄冥冰窖（Lv75-93，标准，3行×5列）──
  dungeon_xuanming_ice_cellar: {
    id:       'dungeon_xuanming_ice_cellar',
    name:     '玄冥教冰封秘窖',
    icon:     '🧊',
    desc:     '幽州地下玄冥教修建的特殊冰冻密室，用以封印被俘的江湖高手和秘密研究冰寒功法。密室内常年零下，冰封的江湖高手仍有一息尚存，随时可能苏醒。',
    theme:    'ice',
    minLevel: 75,
    maxLevel: 93,
    nearCities: ['youzhou', 'anyang'],
    terrain:  '冰原',
    floors:   1,
    specialRule: 'freeze_floor',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'秘窖入口，冷气森森，呼气成雾' },
        { type:'battle', cleared:false, enemyId:'xuanming_envoy',       desc:'守护冰窖的玄冥特使' },
        { type:'trap',   cleared:false, desc:'冰刺机关，触发后冰刺从地面射出！' },
        { type:'battle', cleared:false, enemyId:'xuanming_envoy',       desc:'两名特使巡逻' },
        { type:'chest',  cleared:false, lootTier:'epic',                 desc:'冰封的宝物，被封印在冰柱中' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'xuanming_disciple',    desc:'守卫冰封区域的弟子' },
        { type:'rest',   cleared:false, desc:'冰窖内唯一的温暖区域，以真气护身可恢复' },
        { type:'collect', cleared:false, desc:'厚冰之下封着寒晶矿层，慢慢凿开便能采出冰晶' },
        { type:'elite',  cleared:false, enemyId:'xuanming_envoy',       desc:'冰窖总管，寒气入体可冻伤' },
        { type:'chest',  cleared:false, lootTier:'legendary',            desc:'冰封的顶级武学秘典' },
      ],
      [
        { type:'collect', cleared:false, desc:'秘窖角落结着灵气冰柱，砸碎后常能看到灵石碎光' },
        { type:'battle', cleared:false, enemyId:'xuanming_envoy',       desc:'最后的守卫' },
        { type:'trap',   cleared:false, desc:'冰封大阵！全场冰封！' },
        { type:'elite',  cleared:false, enemyId:'xuanming_envoy',       desc:'最强特使，冰寒内功已至化境' },
        { type:'boss',   cleared:false, enemyId:'ice_palace_guardian',  desc:'【冰封镇守·寒骨真人】长年在零下之地修炼，玄冥寒功第一人，触之冰封三尺' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:24000, silver:2800, items:[{id:'item_ice_crystal',qty:6},{id:'item_dark_crystal',qty:3},{id:'item_spirit_stone',qty:6}], manualChance:0.43 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N24. 刀塔十三层（Lv78-96，大型，4行×5列）──
  dungeon_blade_pagoda: {
    id:       'dungeon_blade_pagoda',
    name:     '刀道十三层塔',
    icon:     '🗼',
    desc:     '西北边境一座以刀法著称的挑战宝塔，相传每一层有一位精通绝世刀法的高手把守，通过十三层者可取走塔顶的无上刀典。已有千余人尝试，无一登顶。',
    theme:    'camp',
    minLevel: 78,
    maxLevel: 96,
    nearCities: ['xian', 'bin_zhou'],
    terrain:  '山地',
    floors:   1,
    specialRule: 'no_weapon_bonus',  // 刀塔规则：只有刀法有效，其他兵器加成减半
    map: [
      [
        { type:'entry',  cleared:true,  desc:'刀塔底层，刀气横溢，难以呼吸' },
        { type:'battle', cleared:false, enemyId:'blade_guardian',      desc:'第三层守塔者，刀法已臻精妙' },
        { type:'trap',   cleared:false, desc:'刀阵机关！万刀齐飞！' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'前辈挑战者留下的宝物' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'blade_guardian',      desc:'第六层守塔者，刀随心走' },
        { type:'rest',   cleared:false, desc:'层间歇台，可以调整状态' },
        { type:'event',  cleared:false, desc:'一块刀法铭文，记载着某位前辈的刀道感悟' },
        { type:'elite',  cleared:false, enemyId:'blade_master',        desc:'第九层守塔者，刀法化境，出刀快若电闪' },
        { type:'chest',  cleared:false, lootTier:'legendary',           desc:'第九层的守塔奖励——无上刀典节选' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'blade_master',        desc:'第十一层守塔者，单刀无二' },
        { type:'trap',   cleared:false, desc:'十二层刀气大阵！一道道刀芒横切！' },
        { type:'elite',  cleared:false, enemyId:'blade_master',        desc:'第十二层守塔者，已将刀融入气中' },
        { type:'boss',   cleared:false, enemyId:'blade_grandmaster',   desc:'【刀塔塔主·十三刀绝】以十三刀绝命名，无人曾见到第十三刀便已身死' },
      ],
      [
        null,
        null,
        { type:'event',  cleared:false, desc:'塔顶的无上刀典，竟记载着刀道最终的秘密……' },
        { type:'chest',  cleared:false, lootTier:'legendary',           desc:'无上刀典·第十三页，刀道至极的感悟' },
        null,
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:30000, silver:3500, items:[{id:'item_chaos_essence',qty:4},{id:'item_spirit_stone',qty:8},{id:'item_rare_gem',qty:3}], manualChance:0.50 },
    unlocks: [],
    restInterval: 4,
    restHealPct:  0.08,
  },

  // ── N25. 万魔窟（Lv82-98，大型，4行×5列）──
  dungeon_ten_thousand_devils: {
    id:       'dungeon_ten_thousand_devils',
    name:     '万魔窟',
    icon:     '😈',
    desc:     '北疆荒原上一处被万古邪魔之气侵染的天然洞穴群，当地人称"魔鬼的家"。血骨门在此布下百年邪阵，以积聚魔气供骨冥子修炼血魔功，是血骨门最关键的法力来源。',
    theme:    'blood',
    minLevel: 82,
    maxLevel: 98,
    nearCities: ['youzhou'],
    terrain:  '平原',
    floors:   2,
    specialRule: 'blood_curse',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'万魔窟入口，黑气腾腾，令人窒息' },
        { type:'battle', cleared:false, enemyId:'devil_follower',      desc:'被魔气侵染、失去理智的血骨狂徒' },
        { type:'trap',   cleared:false, desc:'魔气旋涡！被吸入后损失气血和内力！' },
        { type:'battle', cleared:false, enemyId:'devil_follower',      desc:'两名狂徒联手' },
        { type:'chest',  cleared:false, lootTier:'epic',               desc:'魔气中凝聚的精华物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master',desc:'血骨门坛主维护魔阵' },
        { type:'rest',   cleared:false, desc:'唯一的正气石，可以短暂抵御魔气侵蚀' },
        { type:'event',  cleared:false, desc:'一个意识尚存的被迷惑者，请求你解开他的魔咒' },
        { type:'elite',  cleared:false, enemyId:'devil_champion',      desc:'被魔气强化的血骨精英，力量暴增' },
        { type:'chest',  cleared:false, lootTier:'legendary',           desc:'万魔窟最深处凝聚的魔晶' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'devil_follower',      desc:'更深处更疯狂的魔气狂徒' },
        { type:'battle', cleared:false, enemyId:'devil_champion',      desc:'最强的魔气精英' },
        { type:'elite',  cleared:false, enemyId:'devil_champion',      desc:'魔窟守护者，以魔气为甲' },
        { type:'chest',  cleared:false, lootTier:'legendary',           desc:'骨冥子的炼魔辅助道具' },
      ],
      [
        null,
        null,
        { type:'trap',   cleared:false, desc:'万魔聚汇！魔气冲天！' },
        { type:'battle', cleared:false, enemyId:'blood_bone_vice_master',desc:'血刃副门主坐镇魔窟' },
        { type:'boss',   cleared:false, enemyId:'devil_king',          desc:'【万魔化身·血魔尸王】百年魔气凝聚成形的血魔，骨冥子的杰作，不死不灭' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:35000, silver:4000, items:[{id:'item_chaos_essence',qty:5},{id:'item_xuegu_emblem',qty:2},{id:'item_spirit_stone',qty:8}], manualChance:0.50 },
    unlocks: ['dungeon_bone_mingzi_final'],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N26. 仙剑谷遗址（Lv85-100，中型，3行×5列）──
  dungeon_ancient_sword_valley: {
    id:       'dungeon_ancient_sword_valley',
    name:     '仙剑谷遗址',
    icon:     '🌟',
    desc:     '传说中上古剑仙遗留下的圣地，谷内剑气千年不散，随处可见上古剑阵痕迹。血骨门秘密开凿此地，意图窃取上古剑意炼入血魔功，已严重破坏了圣地的根基。',
    theme:    'mountain',
    minLevel: 85,
    maxLevel: 100,
    nearCities: ['xian', 'hanzhong'],
    terrain:  '高山',
    floors:   1,
    map: [
      [
        { type:'entry',  cleared:true,  desc:'仙剑谷入口，千年剑意如实质般压迫全身' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'在此掘宝的血骨精锐' },
        { type:'trap',   cleared:false, desc:'上古剑气机关！古剑自动斩击！' },
        { type:'chest',  cleared:false, lootTier:'epic',                desc:'被血骨门收缴的上古宝物' },
        { type:'collect', cleared:false, desc:'谷壁剑痕中嵌着灵石碎芒，顺着裂缝便能剔出高阶矿料' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master',desc:'驻守此地的血骨坛主' },
        { type:'rest',   cleared:false, desc:'剑气汇聚处，感悟剑意可恢复内力' },
        { type:'collect', cleared:false, desc:'上古剑阵残基周围散落晶莹矿片与宝石碎粒，可慢慢搜集' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_altar_master',desc:'四大坛主齐聚破坏剑阵' },
        { type:'chest',  cleared:false, lootTier:'legendary',            desc:'上古剑仙的遗留——镇谷之剑' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'最后的血骨卫队' },
        { type:'trap',   cleared:false, desc:'千年剑阵全面激活！万剑同发！' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_altar_master',desc:'血骨门最强坛主护卫boss' },
        { type:'boss',   cleared:false, enemyId:'ancient_sword_guardian',desc:'【剑谷护法·剑意残魂】上古剑仙留下的最后意志，以剑意凝聚成形，见到血骨门破坏圣地后愤而出手' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:38000, silver:4500, items:[{id:'item_sword_shard',qty:6},{id:'item_chaos_essence',qty:5},{id:'item_spirit_stone',qty:10}], manualChance:0.52 },
    unlocks: [],
    restInterval: 3,
    restHealPct:  0.10,
  },

  // ── N27. 冰火两仪洞（Lv88-105，大型，4行×6列）──
  dungeon_ice_fire_yin_yang: {
    id:       'dungeon_ice_fire_yin_yang',
    name:     '冰火两仪洞',
    icon:     '☯️',
    desc:     '昆仑山深处一处奇特的地质洞穴，一半永远冰封，一半岩浆涌动，阴阳两仪之气在此激烈碰撞。古代有大宗师在此悟道成就绝世武学，血骨门为了窃取这股力量在此驻扎，与守护此地的神秘老人激战至今。',
    theme:    'mountain',
    minLevel: 88,
    maxLevel: 105,
    nearCities: ['xiyu_city', 'tianshan_peak'],
    terrain:  '高山',
    floors:   2,
    specialRule: 'yin_yang_field',  // 两仪之地：回合偶数时冰寒伤害+20%，奇数时火焰伤害+20%
    map: [
      [
        { type:'entry',  cleared:true,  desc:'洞穴入口，左侧冰霜右侧火焰，令人惊叹' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'掌控冰侧的血骨精锐' },
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master',desc:'主持阵法的血骨坛主' },
        { type:'trap',   cleared:false, desc:'两仪错位！冰火同时袭来！' },
        { type:'chest',  cleared:false, lootTier:'epic',                 desc:'血骨门在此积累的宝物' },
        { type:'collect', cleared:false, desc:'洞壁冰火交界处凝着异质晶层，细敲能取出灵石与寒晶' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'火侧的血骨守卫' },
        { type:'rest',   cleared:false, desc:'两仪中心点，阴阳平衡处，可以恢复' },
        { type:'collect', cleared:false, desc:'阴阳平衡点下方埋着两仪残核，翻开碎石常可拾到稀有结晶' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_vice_master',desc:'血刃副门主亲自镇守此洞' },
        { type:'chest',  cleared:false, lootTier:'legendary',             desc:'两仪洞核心：阴阳合一的传世宝物' },
        null,
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master',desc:'内洞精锐坛主' },
        { type:'trap',   cleared:false, desc:'两仪大阵全开！冰火共噬！' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'内洞最强守卫' },
        { type:'chest',  cleared:false, lootTier:'legendary',             desc:'古代大宗师留下的武学感悟' },
        null,
      ],
      [
        null,
        null,
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master',desc:'最后的坛主守门' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_vice_master',desc:'血刃副门主的最终状态' },
        { type:'trap',   cleared:false, desc:'终极两仪爆发！' },
        { type:'boss',   cleared:false, enemyId:'ice_fire_yin_yang_boss',desc:'【两仪大魔·阴阳尸祖】骨冥子以两仪之气炼成的最强傀儡，集冰火两仪于一身，如山岳般难以撼动' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:48000, silver:5500, items:[{id:'item_ice_crystal',qty:4},{id:'item_fire_crystal',qty:4},{id:'item_chaos_essence',qty:6},{id:'item_spirit_stone',qty:10}], manualChance:0.55 },
    unlocks: ['dungeon_bone_mingzi_final'],
    restInterval: 3,
    restHealPct:  0.12,
  },

  // ── N28. 骨冥子炼骨秘地（Lv95-115，大型，4行×6列）──
  dungeon_bone_mingzi_forge: {
    id:       'dungeon_bone_mingzi_forge',
    name:     '骨冥子炼骨秘地',
    icon:     '🦴',
    desc:     '骨冥子亲手修建的极秘地下炼骨圣地，以无数江湖名家的精骨炼就。这里是骨冥子武功修为的真正来源，也是他最后的底牌所在。仅次于决战场的终极地下城。',
    theme:    'blood',
    minLevel: 95,
    maxLevel: 115,
    nearCities: ['youzhou'],
    terrain:  '地下祭坛',
    floors:   2,
    isMainQuestDungeon: true,
    specialRule: 'blood_curse',
    map: [
      [
        { type:'entry',  cleared:true,  desc:'炼骨秘地外层，处处是精骨铸成的装饰物' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'骨冥子最信任的精锐卫兵' },
        { type:'trap',   cleared:false, desc:'血骨大阵激活！遍地骨刺！' },
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master',desc:'四大坛主巡逻' },
        { type:'chest',  cleared:false, lootTier:'epic',                desc:'骨冥子炼骨所用的宝物' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'blood_bone_vice_master',desc:'血刃副门主守卫内层' },
        { type:'rest',   cleared:false, desc:'唯一一处正气护符所在，短暂抵御煞气' },
        { type:'collect', cleared:false, desc:'炼骨池边堆着尚未炼尽的残核与灵石粉，翻检便能收集高阶材料' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_altar_master',desc:'四大坛主联合守门' },
        { type:'chest',  cleared:false, lootTier:'legendary',            desc:'骨冥子的炼骨心得秘录' },
        { type:'collect', cleared:false, desc:'骨墙缝隙里嵌着兽核与煞气结晶，硬撬下来可作锻造药引' },
      ],
      [
        { type:'collect', cleared:false, desc:'秘地地脉被煞气反复灌注，地面下埋着可用的混沌残晶' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'精锐卫队换防' },
        { type:'trap',   cleared:false, desc:'万骨同鸣！骨气冲天！' },
        { type:'battle', cleared:false, enemyId:'blood_bone_altar_master',desc:'最后的坛主守卫' },
        { type:'elite',  cleared:false, enemyId:'blood_bone_vice_master',desc:'血刃副门主最终发力' },
        null,
      ],
      [
        null,
        null,
        { type:'chest',  cleared:false, lootTier:'legendary',            desc:'骨冥子秘地核心宝库——骨冥令' },
        { type:'battle', cleared:false, enemyId:'blood_bone_elite_guard',desc:'最强精锐卫队' },
        { type:'trap',   cleared:false, desc:'骨冥子亲布的终极炼骨大阵！' },
        { type:'boss',   cleared:false, enemyId:'bone_mingzi',          desc:'【骨冥子·炼骨化神】血骨门主以秘地为凭，炼骨功已至化神之境，此战只是序曲' },
      ],
    ],
    startPos: [0, 0],
    bossReward: { exp:65000, silver:7000, items:[{id:'item_dragon_scale',qty:3},{id:'item_chaos_essence',qty:7},{id:'item_spirit_stone',qty:12}], manualChance:0.65 },
    unlocks: ['dungeon_bone_mingzi_final'],
    restInterval: 2,
    restHealPct:  0.12,
  },

};

// ── 地下城随机事件表 ──
const DUNGEON_EVENTS = [
  {
    id: 'ev_merchant',
    title: '💰 落难商人',
    desc: '一位受伤的商人蜷缩在角落，身边散落着货物。',
    choices: [
      { text: '救助他（给予药品）', cost: { item: 'item_herb_common', qty: 1 }, reward: { silver: 50, rep: 5 }, result: '商人千恩万谢，告诉你前方宝箱的位置，并留下了银两。' },
      { text: '帮他疗伤（消耗内力）', cost: { mp: 30 }, reward: { silver: 30, exp: 100 }, result: '运功帮他疗伤，他感激地塞给你一些银子。' },
      { text: '无视他继续前行', reward: {}, result: '商人用绝望的眼神看着你离去……' },
    ],
  },
  {
    id: 'ev_inscription',
    title: '📜 残破碑文',
    desc: '石壁上刻着古老的碑文，记载着一门武学的修炼要诀。',
    choices: [
      { text: '仔细研读（消耗10分钟）', reward: { exp: 200, skillProfBonus: 0.5 }, result: '从碑文中领悟了一些武学道理，修为小有精进。' },
      { text: '拓印下来（获得拓本）', reward: { item: 'item_inscription_rubbing', qty: 1 }, result: '将碑文拓印下来，回头可以慢慢研究。' },
      { text: '不感兴趣，继续前行', reward: {}, result: '碑文的秘密被你留在了身后。' },
    ],
  },
  {
    id: 'ev_trap_disarm',
    title: '⚙️ 精妙机关',
    desc: '前方有一套复杂的机关陷阱，触发后必然受伤，但也可以尝试拆除。',
    choices: [
      { text: '小心拆除（身法检定）', chance: 0.6, reward: { item: 'item_trap_parts', qty: 2 }, failCost: { hp: 50 }, result: '【成功】机关被你精巧拆除，获得了陷阱零件。', failResult: '手滑触发了机关，受到伤害！' },
      { text: '硬冲过去', cost: { hp: 30 }, reward: {}, result: '触发了机关，受到一些伤害，但总算冲过去了。' },
      { text: '绕路走', cost: { energy: 20 }, reward: {}, result: '绕了一大圈，消耗了不少体力，但平安绕过了机关。' },
    ],
  },
  {
    id: 'ev_secret_room',
    title: '🔍 隐秘小门',
    desc: '石墙上发现了一道缝隙，推开后是个小暗室。',
    choices: [
      { text: '进去探索', reward: { lootTier: 'rare', exp: 150 }, result: '暗室中有人遗留的物品，收获颇丰！' },
      { text: '谨慎进入', reward: { lootTier: 'uncommon' }, result: '小心翼翼地进入，发现了一些有用的东西。' },
      { text: '不进去，可能有危险', reward: {}, result: '没有进入，继续赶路。' },
    ],
  },
  {
    id: 'ev_wounded_enemy',
    title: '🩸 受伤的敌人',
    desc: '一个受了重伤的敌人趴在地上，已经丧失战斗力。',
    choices: [
      { text: '补上一刀（获得经验和掉落）', reward: { exp: 150, lootTier: 'common' }, result: '敌人倒下，留下了一些物品。' },
      { text: '救治他（可能获得情报）', chance: 0.5, reward: { intel: true, rep: 10 }, failReward: {}, result: '【成功】他感激地透露了前方的情况。', failResult: '他苏醒后趁机逃跑了……' },
      { text: '绑起来当人质', reward: { silver: 100 }, result: '威胁他交出财物，然后让他滚蛋。' },
    ],
  },
];

// ── 宝箱掉落表（按稀有度）──
const DUNGEON_CHEST_LOOT = {
  // common 宝箱 → 普通材料 + 少量common收藏品（8%）
  common: [
    { id:'item_cloth',          weight:28, qty:[1,3] },
    { id:'item_iron_ore',       weight:24, qty:[1,3] },
    { id:'item_herb_common',    weight:28, qty:[1,4] },
    { id:'silver',              weight:12, qty:[20,50] },
    // 收藏品（common，总权重8）
    { id:'col_broken_compass',  weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_old_portrait',    weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_worn_sandal',     weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_empty_jug',       weight:2,  qty:[1,1], _isCollectible:true },
  ],
  // uncommon 宝箱 → 较好材料 + uncommon收藏品（12%）
  uncommon: [
    { id:'item_herb_common',    weight:18, qty:[2,4] },
    { id:'item_iron_ore',       weight:18, qty:[2,5] },
    { id:'item_herb_rare',      weight:14, qty:[1,2] },
    { id:'silver',              weight:22, qty:[50,120] },
    { id:'item_elixir_low',     weight:16, qty:[1,2] },
    // 收藏品（common+uncommon，总权重12）
    { id:'col_dice_set',        weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_copper_mirror',   weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_clay_figurine',   weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_red_thread',      weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_bronze_bell',     weight:1,  qty:[1,1], _isCollectible:true },
    { id:'col_music_score',     weight:1,  qty:[1,1], _isCollectible:true },
  ],
  // rare 宝箱 → 稀有材料 + rare收藏品（15%）
  rare: [
    { id:'item_herb_rare',      weight:18, qty:[2,4] },
    { id:'item_spirit_stone',   weight:12, qty:[1,2] },
    { id:'silver',              weight:22, qty:[120,300] },
    { id:'item_elixir_mid',     weight:18, qty:[1,2] },
    { id:'item_gem',            weight:15, qty:[1,1] },
    // 收藏品（uncommon+rare，总权重15）
    { id:'col_jade_pendant',    weight:4,  qty:[1,1], _isCollectible:true },
    { id:'col_chess_piece',     weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_ink_stick',       weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_silver_hairpin',  weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_sect_tablet',     weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_letter_sealed',   weight:1,  qty:[1,1], _isCollectible:true },
  ],
  // epic 宝箱 → 精品材料 + epic收藏品（18%）
  epic: [
    { id:'item_spirit_stone',   weight:18, qty:[2,4] },
    { id:'item_chaos_essence',  weight:9,  qty:[1,2] },
    { id:'silver',              weight:18, qty:[300,600] },
    { id:'item_elixir_high',    weight:22, qty:[1,2] },
    { id:'item_rare_gem',       weight:15, qty:[1,1] },
    // 收藏品（rare+epic，总权重18）
    { id:'col_tiger_seal',      weight:4,  qty:[1,1], _isCollectible:true },
    { id:'col_jade_ring',       weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_war_flag',        weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_jade_buddha',     weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_ancient_coin',    weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_moonstone',       weight:1,  qty:[1,1], _isCollectible:true },
    { id:'col_scroll_painting', weight:1,  qty:[1,1], _isCollectible:true },
  ],
  // legendary 宝箱 → 顶级材料 + 传说收藏品（20%）
  legendary: [
    { id:'item_chaos_essence',  weight:18, qty:[2,3] },
    { id:'item_dragon_scale',   weight:9,  qty:[1,1] },
    { id:'silver',              weight:18, qty:[600,1500] },
    { id:'item_elixir_high',    weight:22, qty:[2,3] },
    { id:'item_mythic_gem',     weight:13, qty:[1,1] },
    // 收藏品（epic+legendary，总权重20）
    { id:'col_phoenix_feather', weight:6,  qty:[1,1], _isCollectible:true },
    { id:'col_scroll_painting', weight:4,  qty:[1,1], _isCollectible:true },
    { id:'col_jade_token_dragon',weight:4, qty:[1,1], _isCollectible:true },
    { id:'col_broken_sword',    weight:3,  qty:[1,1], _isCollectible:true },
    { id:'col_anon_portrait',   weight:2,  qty:[1,1], _isCollectible:true },
    { id:'col_cracked_bell',    weight:1,  qty:[1,1], _isCollectible:true },
  ],
};

const DUNGEON_LOCAL_TASK_LOOT = {
  // 任务物资来源约束：不能从宝箱开出；基础资源可优先放进 roomCollect 做成真正采集点。
  // 注：dungeon_mine 是旧 key，实际 ID 为 dungeon_abandoned_mine，两个都保留以兼容旧存档
  dungeon_mine: {
    roomCollect: [
      { id:'item_iron_ore', chance:1, minQty:2, maxQty:4 },
    ],
  },
  dungeon_abandoned_mine: {
    roomCollect: [
      { id:'item_iron_ore', chance:1, minQty:2, maxQty:5 },
    ],
    enemyDrops: [
      { id:'item_ore_iron', chance:0.28, minQty:1, maxQty:2 },
      { id:'item_leftover_food', chance:0.15, minQty:1, maxQty:2 },
    ],
  },
  dungeon_wolf_valley: {

    enemyDrops: [
      { id:'item_meat_rabbit', chance:0.18, minQty:1, maxQty:1 },
      { id:'item_herb_gancao', chance:0.22, minQty:1, maxQty:2 },
    ],
  },
  dungeon_cangzhou_salt_warehouse: {
    enemyDrops: [
      { id:'item_ore_iron', chance:0.26, minQty:1, maxQty:2 },
      { id:'item_leftover_food', chance:0.18, minQty:1, maxQty:2 },
      { id:'item_river_mud', chance:0.10, minQty:1, maxQty:2 },
      { id:'item_local_specialty', chance:0.08, minQty:1, maxQty:1 },
    ],
  },
  dungeon_hangzhou_waterside: {
    roomCollect: [
      { id:'item_river_mud',       chance:1,    minQty:2, maxQty:5 },
      { id:'item_lotus_root',      chance:0.40, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_ink_songyan',     chance:0.12, minQty:1, maxQty:1 },
      { id:'item_leftover_food',   chance:0.15, minQty:1, maxQty:2 },
      { id:'item_local_specialty', chance:0.08, minQty:1, maxQty:1 },
    ],
  },

  dungeon_xiangyang_secret_passage: {
    roomCollect: [
      { id:'item_herb_common',  chance:0.55, minQty:1, maxQty:2 },
      { id:'item_iron_ore',     chance:0.45, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_ore_iron',        chance:0.22, minQty:1, maxQty:2 },
      { id:'item_leftover_food',   chance:0.18, minQty:1, maxQty:2 },
    ],
  },
  dungeon_yangzhou_painting_boat: {
    roomCollect: [
      { id:'item_river_mud',       chance:1,    minQty:2, maxQty:5 },
      { id:'item_lotus_root',      chance:0.35, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_local_specialty', chance:0.18, minQty:1, maxQty:2 },
      { id:'item_leftover_food',   chance:0.18, minQty:1, maxQty:2 },
      { id:'item_ink_songyan',     chance:0.10, minQty:1, maxQty:1 },
    ],
  },
  dungeon_chengdu_bamboo_maze: {
    roomCollect: [
      { id:'item_herb_gancao',     chance:1,    minQty:1, maxQty:3 },
      { id:'item_bamboo_shoot',    chance:0.50, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_herb_renshen', chance:0.12, minQty:1, maxQty:1 },
      { id:'item_vegetable_fresh', chance:0.22, minQty:1, maxQty:2 },
      { id:'item_wild_meat', chance:0.20, minQty:1, maxQty:2 },
    ],
  },
  dungeon_dali_tea_horse_road: {
    roomCollect: [
      { id:'item_local_specialty', chance:1,    minQty:1, maxQty:2 },
      { id:'item_vegetable_fresh', chance:0.45, minQty:1, maxQty:2 },
      { id:'item_herb_renshen',    chance:0.25, minQty:1, maxQty:1 },
    ],
    enemyDrops: [
      { id:'item_local_specialty', chance:0.24, minQty:1, maxQty:2 },
      { id:'item_vegetable_fresh', chance:0.20, minQty:1, maxQty:2 },
      { id:'item_herb_renshen',    chance:0.12, minQty:1, maxQty:1 },
      { id:'item_wild_meat',       chance:0.20, minQty:1, maxQty:2 },
    ],
  },
  dungeon_luoyang_underground_palace: {
    roomCollect: [
      { id:'item_ink_songyan',     chance:1,    minQty:1, maxQty:2 },
      { id:'item_herb_common',     chance:0.40, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_ink_songyan',     chance:0.18, minQty:1, maxQty:1 },
      { id:'item_leftover_food',   chance:0.15, minQty:1, maxQty:2 },
    ],
  },
  dungeon_youzhou_hunting_ground: {
    roomCollect: [
      { id:'item_vegetable_fresh', chance:1,    minQty:1, maxQty:2 },
      { id:'item_herb_renshen',    chance:0.30, minQty:1, maxQty:1 },
    ],
    enemyDrops: [
      { id:'item_meat_rabbit',     chance:0.35, minQty:1, maxQty:2 },
      { id:'item_herb_renshen',    chance:0.16, minQty:1, maxQty:1 },
      { id:'item_wild_meat',       chance:0.25, minQty:1, maxQty:2 },
      { id:'item_ore_iron',        chance:0.20, minQty:1, maxQty:2 },
    ],
  },
  dungeon_fuzhou_dock: {
    roomCollect: [
      { id:'item_river_mud',       chance:1,    minQty:2, maxQty:5 },
      { id:'item_local_specialty', chance:0.35, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_river_mud',       chance:0.26, minQty:1, maxQty:3 },
      { id:'item_local_specialty', chance:0.20, minQty:1, maxQty:2 },
    ],
  },
  dungeon_suzhou_sword_pool: {
    roomCollect: [
      { id:'item_river_mud',       chance:1,    minQty:1, maxQty:3 },
      { id:'item_ink_songyan',     chance:0.45, minQty:1, maxQty:1 },
    ],
    enemyDrops: [
      { id:'item_ink_songyan',     chance:0.16, minQty:1, maxQty:1 },
      { id:'item_local_specialty', chance:0.18, minQty:1, maxQty:2 },
      { id:'item_vegetable_fresh', chance:0.15, minQty:1, maxQty:2 },
    ],
  },
  dungeon_jinyang_ferry: {
    roomCollect: [
      { id:'item_river_mud',       chance:1,    minQty:2, maxQty:4 },
      { id:'item_ore_iron',        chance:0.35, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_river_mud',       chance:0.30, minQty:1, maxQty:3 },
      { id:'item_ore_iron',        chance:0.20, minQty:1, maxQty:2 },
    ],
  },
  dungeon_songshan_pagoda_forest: {
    roomCollect: [
      { id:'item_herb_gancao',     chance:1,    minQty:1, maxQty:3 },
      { id:'item_herb_renshen',    chance:0.30, minQty:1, maxQty:1 },
    ],
    enemyDrops: [
      { id:'item_herb_gancao',     chance:0.24, minQty:1, maxQty:2 },
      { id:'item_herb_renshen',    chance:0.12, minQty:1, maxQty:1 },
    ],
  },
  dungeon_yueyang_fishing_village: {
    roomCollect: [
      { id:'item_river_mud',       chance:1,    minQty:2, maxQty:5 },
      { id:'item_local_specialty', chance:0.30, minQty:1, maxQty:2 },
    ],
    enemyDrops: [
      { id:'item_river_mud',       chance:0.30, minQty:1, maxQty:3 },
      { id:'item_wild_meat',       chance:0.20, minQty:1, maxQty:2 },
      { id:'item_leftover_food',   chance:0.18, minQty:1, maxQty:2 },
    ],
  },
  dungeon_riyue_forbidden: {
    roomCollect: [
      { id:'item_spirit_stone',    chance:0.72, minQty:1, maxQty:1 },
      { id:'item_rare_gem',        chance:0.24, minQty:1, maxQty:1 },
    ],
  },
  dungeon_xuanming_ice_cellar: {
    roomCollect: [
      { id:'item_ice_crystal',     chance:1,    minQty:1, maxQty:2 },
      { id:'item_spirit_stone',    chance:0.32, minQty:1, maxQty:1 },
    ],
  },
  dungeon_ghost_city: {
    roomCollect: [
      { id:'item_spirit_stone',    chance:0.75, minQty:1, maxQty:1 },
      { id:'item_chaos_essence',   chance:0.18, minQty:1, maxQty:1 },
    ],
  },
  dungeon_ancient_sword_valley: {
    roomCollect: [
      { id:'item_spirit_stone',    chance:0.88, minQty:1, maxQty:2 },
      { id:'item_rare_gem',        chance:0.35, minQty:1, maxQty:1 },
    ],
  },
  dungeon_ice_fire_yin_yang: {
    roomCollect: [
      { id:'item_ice_crystal',     chance:1,    minQty:1, maxQty:2 },
      { id:'item_spirit_stone',    chance:0.65, minQty:1, maxQty:2 },
      { id:'item_chaos_essence',   chance:0.24, minQty:1, maxQty:1 },
    ],
  },
  dungeon_bone_mingzi_forge: {
    roomCollect: [
      { id:'item_beast_core',      chance:1,    minQty:1, maxQty:2 },
      { id:'item_spirit_stone',    chance:0.72, minQty:1, maxQty:2 },
      { id:'item_chaos_essence',   chance:0.30, minQty:1, maxQty:1 },
    ],
  },
  dungeon_mingzhou_salt_field: {
    roomCollect: [
      { id:'item_local_specialty', chance:1,    minQty:2, maxQty:4 },
    ],
    enemyDrops: [
      { id:'item_local_specialty', chance:0.26, minQty:1, maxQty:2 },
      { id:'item_leftover_food',   chance:0.16, minQty:1, maxQty:2 },
    ],
  },
};


const DUNGEON_QUEST_ITEM_EQUIV = {
  item_ore_iron: ['item_ore_iron', 'item_iron_ore'],
  item_iron_ore: ['item_ore_iron', 'item_iron_ore'],
};

function _getDungeonLocalLootConfig(dungeonId){
  return DUNGEON_LOCAL_TASK_LOOT[dungeonId] || null;
}

function getDungeonRoomCollectEntries(dungeonId){
  const cfg = _getDungeonLocalLootConfig(dungeonId);
  return Array.isArray(cfg?.roomCollect) ? cfg.roomCollect.map(entry => ({ ...entry })) : [];
}

function _collectDungeonEnemyIds(dungeon){

  const ids = new Set();
  if(!dungeon || !Array.isArray(dungeon.map)) return ids;
  dungeon.map.forEach(row => {
    if(!Array.isArray(row)) return;
    row.forEach(cell => {
      if(cell && cell.enemyId) ids.add(cell.enemyId);
    });
  });
  return ids;
}

function isDungeonQuestItemMatch(haveItemId, needItemId){
  if(!haveItemId || !needItemId) return false;
  if(haveItemId === needItemId) return true;
  const aliases = DUNGEON_QUEST_ITEM_EQUIV[needItemId] || DUNGEON_QUEST_ITEM_EQUIV[haveItemId] || null;
  return Array.isArray(aliases) ? aliases.includes(haveItemId) && aliases.includes(needItemId) : false;
}

function getDungeonExtraEnemyDrops(dungeonId, enemyId){
  const cfg = _getDungeonLocalLootConfig(dungeonId);
  if(!cfg || !Array.isArray(cfg.enemyDrops)) return [];
  return cfg.enemyDrops
    .filter(drop => !Array.isArray(drop.enemyIds) || !enemyId || drop.enemyIds.includes(enemyId))
    .map(drop => ({ ...drop }));
}

function getDungeonObtainableItemIds(dungeonId){
  const dungeon = DUNGEON_DB[dungeonId];
  if(!dungeon) return [];

  const itemIds = new Set();
  const enemyIds = _collectDungeonEnemyIds(dungeon);
  const enemyDb = (typeof ENEMY_DB !== 'undefined' && ENEMY_DB) || (typeof window !== 'undefined' && window.ENEMY_DB) || {};

  enemyIds.forEach(enemyId => {
    const enemy = enemyDb[enemyId];
    (enemy?.drops || []).forEach(drop => {
      if(drop?.id) itemIds.add(drop.id);
    });
  });

  const localCfg = _getDungeonLocalLootConfig(dungeonId);
  (localCfg?.enemyDrops || []).forEach(drop => {
    if(drop?.id) itemIds.add(drop.id);
  });
  (localCfg?.roomCollect || []).forEach(entry => {
    if(entry?.id) itemIds.add(entry.id);
  });

  if(dungeon.bossReward?.items){

    dungeon.bossReward.items.forEach(entry => {
      if(entry?.id) itemIds.add(entry.id);
    });
  }

  return [...itemIds];
}

function canDungeonProvideQuestItem(dungeonId, targetItem){
  return getDungeonObtainableItemIds(dungeonId).some(itemId =>
    isDungeonQuestItemMatch(itemId, targetItem)
  );
}

function getCityQuestItemIds(cityId){
  const itemIds = new Set();
  getDungeonsNearCity(cityId).forEach(dungeon => {
    getDungeonObtainableItemIds(dungeon.id).forEach(itemId => itemIds.add(itemId));
  });
  if(typeof getCityFishingItemIds === 'function'){
    getCityFishingItemIds(cityId).forEach(itemId => itemIds.add(itemId));
  }
  return [...itemIds];
}


function canCityProvideQuestItem(cityId, targetItem){
  if(!cityId || !targetItem) return true;
  return getCityQuestItemIds(cityId).some(itemId =>
    isDungeonQuestItemMatch(itemId, targetItem)
  );
}

// ── 宝箱掉落辅助函数 ──
function dungeonRollChestLoot(tier){
  const table = DUNGEON_CHEST_LOOT[tier] || DUNGEON_CHEST_LOOT.common;
  const totalW = table.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * totalW;
  for(const entry of table){
    r -= entry.weight;
    if(r <= 0){
      const qty = entry.qty[0] + Math.floor(Math.random() * (entry.qty[1] - entry.qty[0] + 1));
      return { id: entry.id, qty };
    }
  }
  return { id: 'silver', qty: 30 };
}


// ── 根据城市获取附近地下城列表 ──
function getDungeonsNearCity(cityId){
  return Object.values(DUNGEON_DB).filter(d =>
    d.nearCities && d.nearCities.includes(cityId)
  );
}

// ── 根据玩家等级过滤可进入的地下城 ──
function getAvailableDungeons(cityId, playerLevel){
  return getDungeonsNearCity(cityId).filter(d =>
    playerLevel >= d.minLevel - 5  // 允许提前5级看到入口（但进入有警告）
  );
}

