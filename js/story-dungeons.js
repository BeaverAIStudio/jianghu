/**
 * ============================================================================
 * 主线剧情专属地下城系统 - StoryDungeons
 * ============================================================================
 * 
 * 功能：
 * 1. 主线剧情专属地下城数据
 * 2. 剧情BOSS战设计
 * 3. 地下城与剧情进度联动
 * 4. 剧情专属奖励
 * 
 * 使用方法：
 *   <script src="js/story-dungeons.js"></script>
 *   StoryDungeons.init();
 * 
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// 剧情地下城数据库
// ═══════════════════════════════════════════════════════════════════════════

const STORY_DUNGEON_DB = {
  // ═══════════════════════════════════════════════════════════════════════
  // 第一幕地下城
  // ═══════════════════════════════════════════════════════════════════════
  
  // 沧州血骨门据点
  story_cangzhou_hideout: {
    id: 'story_cangzhou_hideout',
    name: '沧州血骨门据点',
    icon: '🏚️',
    desc: '沧州城外的一处废弃庄园，血骨门弟子在此秘密活动。庄园深处似乎藏着什么秘密...',
    theme: 'ruins',
    minLevel: 10,
    maxLevel: 25,
    nearCities: ['沧州'],
    terrain: '废墟',
    floors: 1,
    isStoryDungeon: true,
    storyAct: 1,
    requiredQuest: 'mq_act1_investigate',
    
    map: [
      [
        { type:'entry',  cleared:true,  desc:'废弃庄园大门，蛛网密布' },
        { type:'battle', cleared:false, enemyId:'xuegu_recruit', desc:'两名血骨门弟子在巡逻' },
        { type:'chest',  cleared:false, lootTier:'common', desc:'破旧的木箱，里面有些杂物' },
        { type:'event',  cleared:false, desc:'墙角有一具尸体，身上似乎有线索' },
        null,
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'xuegu_fighter', desc:'血骨门精锐弟子' },
        { type:'rest',   cleared:false, desc:'废弃的柴房，可以稍作休息' },
        { type:'battle', cleared:false, enemyId:'xuegu_recruit', desc:'三名血骨门弟子在训练' },
        { type:'chest',  cleared:false, lootTier:'uncommon', desc:'上了锁的铁箱' },
      ],
      [
        null,
        null,
        { type:'trap',   cleared:false, trapType:'arrow',  desc:'地面有机关，触发后弩箭齐发，小心绕行！' },
        { type:'elite',  cleared:false, enemyId:'xuegu_elite', desc:'【血骨门精英】血手无常' },
        { type:'battle', cleared:false, enemyId:'xuegu_fighter', desc:'守卫密道的弟子' },
      ],
      [
        null,
        null,
        null,
        { type:'boss',   cleared:false, enemyId:'boss_blood_wolf', desc:'【据点首领】血狼·厉狂，骨冥子的心腹' },
        { type:'exit',   cleared:false, desc:'密道出口，通往城外' },
      ],
    ],
    startPos: [0, 0],
    
    bossReward: {
      exp: 800,
      silver: 300,
      items: [
        { id:'item_blood_token', qty:1 },
        { id:'item_iron_ore', qty:5 },
      ],
      storyItem: 'item_cangzhou_intel', // 剧情道具：沧州情报
    },
    
    // 剧情专属设置
    storySettings: {
      introCinema: 'dungeon_cangzhou_enter',
      bossCinema: 'boss_blood_wolf_defeat',
      specialLoot: true,
      canReplay: false, // 剧情地下城通关后不可重复
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // 第二幕地下城
  // ═══════════════════════════════════════════════════════════════════════
  
  // 开封黑市
  story_kaifeng_blackmarket: {
    id: 'story_kaifeng_blackmarket',
    name: '开封地下黑市',
    icon: '🕯️',
    desc: '开封城地下的一处秘密交易市场，三教九流汇聚于此。玄铁令碎片的消息在这里流传...',
    theme: 'underground',
    minLevel: 20,
    maxLevel: 35,
    nearCities: ['开封'],
    terrain: '地下',
    floors: 1,
    isStoryDungeon: true,
    storyAct: 2,
    requiredQuest: 'mq_act2_fragment1',
    
    map: [
      [
        { type:'entry',  cleared:true,  desc:'黑市入口，守卫森严' },
        { type:'event',  cleared:false, desc:'一个神秘商人向你招手' },
        { type:'battle', cleared:false, enemyId:'blackmarket_guard', desc:'黑市打手' },
        { type:'chest',  cleared:false, lootTier:'uncommon', desc:'走私者的箱子' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'blackmarket_thug', desc:'地痞流氓' },
        { type:'rest',   cleared:false, desc:'黑市酒馆，可以打探消息' },
        { type:'battle', cleared:false, enemyId:'blackmarket_guard', desc:'守卫通道的打手' },
        { type:'elite',  cleared:false, enemyId:'blackmarket_boss', desc:'【黑市头目】金算盘' },
        null,
      ],
      [
        null,
        { type:'trap',   cleared:false, trapType:'poison', desc:'毒镖陷阱！细小的毒镖从墙缝中射出，沾上必中毒！' },
        { type:'battle', cleared:false, enemyId:'xuegu_agent', desc:'血骨门密探' },
        { type:'event',  cleared:false, desc:'发现碎片的线索' },
        { type:'chest',  cleared:false, lootTier:'rare', desc:'密室宝箱' },
      ],
      [
        null,
        null,
        { type:'boss',   cleared:false, enemyId:'boss_fragment_guardian', desc:'【碎片守护者】黑市之主·阎罗' },
        { type:'battle', cleared:false, enemyId:'xuegu_elite', desc:'血骨门精英' },
        { type:'exit',   cleared:false, desc:'秘密通道' },
      ],
    ],
    startPos: [0, 0],
    
    bossReward: {
      exp: 1200,
      silver: 500,
      items: [
        { id:'item_fragment_kaifeng', qty:1 },
        { id:'item_silver_ingot', qty:3 },
      ],
      storyItem: 'item_xuantie_fragment_1',
    },
    
    storySettings: {
      introCinema: 'dungeon_kaifeng_enter',
      bossCinema: 'boss_fragment_1_obtain',
      specialLoot: true,
      canReplay: false,
    },
  },
  
  // 扬州南宫世家密室
  story_yangzhou_nangong: {
    id: 'story_yangzhou_nangong',
    name: '南宫世家密室',
    icon: '🏛️',
    desc: '南宫世家祖传的地下密室，藏有第二块玄铁令碎片。但密室中机关重重...',
    theme: 'palace',
    minLevel: 25,
    maxLevel: 40,
    nearCities: ['扬州'],
    terrain: '密室',
    floors: 2,
    isStoryDungeon: true,
    storyAct: 2,
    requiredQuest: 'mq_act2_fragment2',
    
    // 第一层
    floor1: {
      map: [
        [
          { type:'entry',  cleared:true,  desc:'密室入口，南宫烈的信任' },
          { type:'trap',   cleared:false, trapType:'spike',  desc:'机关地板！踩上去地刺猛然弹出，需借助轻功飞身而过！' },
          { type:'battle', cleared:false, enemyId:'nangong_guardian', desc:'南宫家机关人' },
          { type:'chest',  cleared:false, lootTier:'uncommon', desc:'先祖遗物箱' },
        ],
        [
          { type:'battle', cleared:false, enemyId:'nangong_guardian', desc:'机关人守卫' },
          { type:'rest',   cleared:false, desc:'安全区域，可以调整状态' },
          { type:'elite',  cleared:false, enemyId:'nangong_elite', desc:'【机关统领】铁甲卫' },
          { type:'event',  cleared:false, desc:'南宫先祖的留言' },
        ],
        [
          null,
          { type:'battle', cleared:false, enemyId:'nangong_guardian', desc:'最后的守卫' },
          { type:'stairs', cleared:false, desc:'通往下一层的阶梯', targetFloor:2 },
          null,
        ],
      ],
      startPos: [0, 0],
    },
    
    // 第二层
    floor2: {
      map: [
        [
          { type:'stairs', cleared:true,  desc:'从上层下来的阶梯', fromFloor:1 },
          { type:'trap',   cleared:false, trapType:'arrow',  desc:'毒箭机关！墙壁暗孔射出数十支涂毒飞箭，需俯身快速穿越！' },
          { type:'battle', cleared:false, enemyId:'nangong_guardian', desc:'最终守卫' },
          { type:'chest',  cleared:false, lootTier:'rare', desc:'南宫家宝箱' },
        ],
        [
          { type:'event',  cleared:false, desc:'南宫家先祖的试炼' },
          { type:'rest',   cleared:false, desc:'先祖祭坛，可以恢复' },
          { type:'boss',   cleared:false, enemyId:'boss_nangong_trial', desc:'【试炼守护者】南宫先祖幻影' },
          { type:'exit',   cleared:false, desc:'获得碎片后的出口' },
        ],
      ],
      startPos: [0, 0],
    },
    
    bossReward: {
      exp: 1500,
      silver: 600,
      items: [
        { id:'item_fragment_yangzhou', qty:1 },
        { id:'item_nangong_badge', qty:1 },
      ],
      storyItem: 'item_xuantie_fragment_2',
    },
    
    storySettings: {
      introCinema: 'dungeon_nangong_enter',
      bossCinema: 'boss_fragment_2_obtain',
      specialLoot: true,
      canReplay: false,
      multiFloor: true,
    },
  },
  
  // 凉州沙漠遗迹
  story_liangzhou_desert: {
    id: 'story_liangzhou_desert',
    name: '凉州沙漠遗迹',
    icon: '🏜️',
    desc: '凉州沙漠深处的一处古老遗迹，最后一块玄铁令碎片就藏在这里。血骨门和玄冥教的人也在寻找...',
    theme: 'desert',
    minLevel: 30,
    maxLevel: 45,
    nearCities: ['凉州'],
    terrain: '沙漠',
    floors: 1,
    isStoryDungeon: true,
    storyAct: 2,
    requiredQuest: 'mq_act2_fragment3',
    
    map: [
      [
        { type:'entry',  cleared:true,  desc:'沙漠遗迹入口，风沙呼啸' },
        { type:'battle', cleared:false, enemyId:'desert_bandit', desc:'沙漠强盗' },
        { type:'event',  cleared:false, desc:'发现血骨门的营地痕迹' },
        { type:'chest',  cleared:false, lootTier:'common', desc:'被遗弃的行李' },
        null,
      ],
      [
        { type:'battle', cleared:false, enemyId:'desert_scorpion', desc:'巨型毒蝎' },
        { type:'rest',   cleared:false, desc:'遗迹中的避风处' },
        { type:'elite',  cleared:false, enemyId:'xuanming_agent', desc:'【玄冥教密探】冷月的手下' },
        { type:'battle', cleared:false, enemyId:'xuegu_elite', desc:'血骨门精英' },
        { type:'chest',  cleared:false, lootTier:'uncommon', desc:'探险者的遗物' },
      ],
      [
        null,
        { type:'trap',   cleared:false, trapType:'fall',   desc:'流沙陷阱！脚下沙地突然松软下陷，跌入暗沙坑后半天爬不出来！' },
        { type:'battle', cleared:false, enemyId:'desert_spirit', desc:'沙漠怨灵' },
        { type:'event',  cleared:false, desc:'古老的壁画，记载着玄铁令的传说' },
        { type:'battle', cleared:false, enemyId:'xuanming_elite', desc:'玄冥教护法' },
      ],
      [
        null,
        null,
        { type:'boss',   cleared:false, enemyId:'boss_desert_guardian', desc:'【遗迹守护者】沙海古魂' },
        { type:'elite',  cleared:false, enemyId:'xuegu_commander', desc:'【血骨门指挥官】沙狼' },
        { type:'exit',   cleared:false, desc:'遗迹深处的秘密通道' },
      ],
    ],
    startPos: [0, 0],
    
    bossReward: {
      exp: 1800,
      silver: 800,
      items: [
        { id:'item_fragment_liangzhou', qty:1 },
        { id:'item_ancient_scroll', qty:1 },
      ],
      storyItem: 'item_xuantie_fragment_3',
    },
    
    storySettings: {
      introCinema: 'dungeon_liangzhou_enter',
      bossCinema: 'boss_fragment_3_obtain',
      specialLoot: true,
      canReplay: false,
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // 第三幕地下城
  // ═══════════════════════════════════════════════════════════════════════
  
  // 少林内鬼调查
  story_shaolin_traitor: {
    id: 'story_shaolin_traitor',
    name: '少林禁地调查',
    icon: '⛩️',
    desc: '少林禁地出现了三魔联盟的内应，必须暗中调查找出真相...',
    theme: 'temple',
    minLevel: 35,
    maxLevel: 50,
    nearCities: ['少林'],
    terrain: '寺庙',
    floors: 1,
    isStoryDungeon: true,
    storyAct: 3,
    requiredQuest: 'mq_act3_spy',
    
    map: [
      [
        { type:'entry',  cleared:true,  desc:'少林禁地入口，方丈特许' },
        { type:'event',  cleared:false, desc:'发现可疑的脚印' },
        { type:'battle', cleared:false, enemyId:'shaolin_traitor', desc:'可疑的少林弟子' },
        { type:'chest',  cleared:false, lootTier:'uncommon', desc:'藏经阁密室' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'xuegu_infiltrator', desc:'血骨门渗透者' },
        { type:'rest',   cleared:false, desc:'禅房，可以静心恢复' },
        { type:'elite',  cleared:false, enemyId:'xuanming_spy', desc:'【玄冥教间谍】假扮的僧人' },
        { type:'event',  cleared:false, desc:'发现密信' },
      ],
      [
        null,
        { type:'trap',   cleared:false, trapType:'spike',  desc:'少林古机关！石锤从侧墙横扫而出，修内力可硬抗，否则躲闪须精准！' },
        { type:'battle', cleared:false, enemyId:'riyue_agent', desc:'日月神教密探' },
        { type:'elite',  cleared:false, enemyId:'traitor_elite', desc:'【内鬼副手】戒律堂叛徒' },
      ],
      [
        null,
        null,
        { type:'boss',   cleared:false, enemyId:'boss_shaolin_traitor', desc:'【少林叛徒】玄悟首座' },
        { type:'exit',   cleared:false, desc:'真相大白后的出口' },
      ],
    ],
    startPos: [0, 0],
    
    bossReward: {
      exp: 2000,
      silver: 1000,
      items: [
        { id:'item_traitor_evidence', qty:1 },
        { id:'item_shaolin_manual', qty:1 },
      ],
      storyItem: 'item_spy_evidence',
    },
    
    storySettings: {
      introCinema: 'dungeon_shaolin_enter',
      bossCinema: 'boss_traitor_reveal',
      specialLoot: true,
      canReplay: false,
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // 第四幕地下城
  // ═══════════════════════════════════════════════════════════════════════
  
  // 幽州血骨门秘密据点
  story_youzhou_hideout: {
    id: 'story_youzhou_hideout',
    name: '幽州血骨门秘密据点',
    icon: '🏴‍☠️',
    desc: '幽州城外的一处隐秘据点，三魔联盟在此密谋。潜入其中，揭露他们的阴谋...',
    theme: 'fortress',
    minLevel: 40,
    maxLevel: 55,
    nearCities: ['幽州'],
    terrain: '堡垒',
    floors: 2,
    isStoryDungeon: true,
    storyAct: 4,
    requiredQuest: 'mq_act4_infiltrate',
    
    floor1: {
      map: [
        [
          { type:'entry',  cleared:true,  desc:'秘密潜入入口' },
          { type:'event',  cleared:false, desc:'偷听守卫谈话' },
          { type:'battle', cleared:false, enemyId:'xuegu_guard', desc:'据点守卫' },
          { type:'chest',  cleared:false, lootTier:'uncommon', desc:'守卫的储物柜' },
        ],
        [
          { type:'battle', cleared:false, enemyId:'xuanming_guard', desc:'玄冥教守卫' },
          { type:'rest',   cleared:false, desc:'储藏室，可以躲藏休息' },
          { type:'elite',  cleared:false, enemyId:'riyue_elite', desc:'【日月神教精英】黑木崖使者' },
          { type:'event',  cleared:false, desc:'发现三魔密约的副本' },
        ],
        [
          null,
          { type:'trap',   cleared:false, trapType:'arrow',  desc:'警报机关！细线一绊，墙中连弩齐发，同时惊动附近巡逻！' },
          { type:'battle', cleared:false, enemyId:'xuegu_elite', desc:'血骨门精英' },
          { type:'stairs', cleared:false, desc:'通往地下二层', targetFloor:2 },
        ],
      ],
      startPos: [0, 0],
    },
    
    floor2: {
      map: [
        [
          { type:'stairs', cleared:true,  desc:'从上层下来', fromFloor:1 },
          { type:'battle', cleared:false, enemyId:'xuegu_commander', desc:'血骨门指挥官' },
          { type:'event',  cleared:false, desc:'发现骨冥子的密室' },
          { type:'chest',  cleared:false, lootTier:'rare', desc:'骨冥子的私人物品' },
        ],
        [
          { type:'battle', cleared:false, enemyId:'xuanming_commander', desc:'玄冥教指挥官' },
          { type:'rest',   cleared:false, desc:'隐蔽角落' },
          { type:'elite',  cleared:false, enemyId:'alliance_guard', desc:'【联盟守卫】三魔联合精英' },
          { type:'event',  cleared:false, desc:'发现骨冥子的日记' },
        ],
        [
          null,
          null,
          { type:'boss',   cleared:false, enemyId:'boss_alliance_commander', desc:'【联盟统帅】三魔联合指挥官' },
          { type:'exit',   cleared:false, desc:'带着密约逃离' },
        ],
      ],
      startPos: [0, 0],
    },
    
    bossReward: {
      exp: 2500,
      silver: 1200,
      items: [
        { id:'item_alliance_treaty', qty:1 },
        { id:'item_gumingzi_diary', qty:1 },
        { id:'item_epic_weapon_box', qty:1 },
      ],
      storyItem: 'item_three_devils_treaty',
    },
    
    storySettings: {
      introCinema: 'dungeon_youzhou_enter',
      bossCinema: 'boss_treaty_obtain',
      specialLoot: true,
      canReplay: false,
      multiFloor: true,
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // 第五幕地下城 - 最终决战
  // ═══════════════════════════════════════════════════════════════════════
  
  // 血骨门总坛
  story_xuegu_final: {
    id: 'story_xuegu_final',
    name: '血骨门总坛',
    icon: '☠️',
    desc: '血骨门的核心据点，骨冥子就在这里。玄铁令即将现世，这是最后的决战！',
    theme: 'darkfortress',
    minLevel: 50,
    maxLevel: 70,
    nearCities: ['沧州'],
    terrain: '魔教总坛',
    floors: 3,
    isStoryDungeon: true,
    storyAct: 5,
    requiredQuest: 'mq_act5_final_dungeon',
    isFinalDungeon: true,
    
    floor1: {
      map: [
        [
          { type:'entry',  cleared:true,  desc:'血骨门总坛大门，正邪两路夹击' },
          { type:'battle', cleared:false, enemyId:'xuegu_elite', desc:'血骨门精锐' },
          { type:'elite',  cleared:false, enemyId:'xuegu_captain', desc:'【血骨门堂主】血手修罗' },
          { type:'chest',  cleared:false, lootTier:'rare', desc:'战利品箱' },
        ],
        [
          { type:'battle', cleared:false, enemyId:'xuanming_elite', desc:'玄冥教援军' },
          { type:'rest',   cleared:false, desc:'临时营地，正道援军在此' },
          { type:'battle', cleared:false, enemyId:'riyue_elite', desc:'日月神教援军' },
          { type:'event',  cleared:false, desc:'发现冷月留下的暗号' },
        ],
        [
          null,
          { type:'trap',   cleared:false, trapType:'poison', desc:'血骨门毒雾机关！地下喷出浓稠血毒，吸入必中血毒每回合持续受伤！' },
          { type:'boss',   cleared:false, enemyId:'boss_xuegu_gatekeeper', desc:'【总坛守卫】血骨门左右护法' },
          { type:'stairs', cleared:false, desc:'通往总坛内殿', targetFloor:2 },
        ],
      ],
      startPos: [0, 0],
    },
    
    floor2: {
      map: [
        [
          { type:'stairs', cleared:true,  desc:'进入内殿', fromFloor:1 },
          { type:'battle', cleared:false, enemyId:'xuegu_general', desc:'血骨门长老' },
          { type:'elite',  cleared:false, enemyId:'xuegu_elder', desc:'【血骨门长老】血魔老人' },
          { type:'chest',  cleared:false, lootTier:'epic', desc:'血骨门宝库' },
        ],
        [
          { type:'event',  cleared:false, desc:'发现骨冥子的过去' },
          { type:'rest',   cleared:false, desc:'安全区域' },
          { type:'battle', cleared:false, enemyId:'xuegu_general', desc:'最后的守卫' },
          { type:'event',  cleared:false, desc:'玄铁令的力量在涌动' },
        ],
        [
          null,
          { type:'boss',   cleared:false, enemyId:'boss_blood_council', desc:'【血骨议会】三大长老' },
          { type:'stairs', cleared:false, desc:'通往最终祭坛', targetFloor:3 },
          null,
        ],
      ],
      startPos: [0, 0],
    },
    
    floor3: {
      map: [
        [
          { type:'stairs', cleared:true,  desc:'最终祭坛入口', fromFloor:2 },
          { type:'event',  cleared:false, desc:'玄铁令就在前方' },
          { type:'rest',   cleared:false, desc:'最后的休整机会' },
          { type:'chest',  cleared:false, lootTier:'legendary', desc:'上古遗物' },
        ],
        [
          null,
          { type:'boss',   cleared:false, enemyId:'boss_gumingzi_final', desc:'【最终BOSS】骨冥子·沈墨' },
          null,
          null,
        ],
        [
          null,
          { type:'exit',   cleared:false, desc:'决战结束，新的篇章开始' },
          null,
          null,
        ],
      ],
      startPos: [0, 0],
    },
    
    bossReward: {
      exp: 5000,
      silver: 3000,
      items: [
        { id:'item_xuantie_token_complete', qty:1 },
        { id:'item_legendary_weapon_box', qty:1 },
        { id:'item_gumingzi_legacy', qty:1 },
      ],
      storyItem: 'item_xuantie_token_final',
    },
    
    storySettings: {
      introCinema: 'dungeon_final_enter',
      midCinema: 'dungeon_final_mid',
      bossCinema: 'boss_gumingzi_final',
      endingCinema: 'act5_ending',
      specialLoot: true,
      canReplay: false,
      multiFloor: true,
      hasMultipleEndings: true,
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // 隐藏地下城 - 二周目专属
  // ═══════════════════════════════════════════════════════════════════════
  
  // 北疆封印之地
  story_beijiang_seal: {
    id: 'story_beijiang_seal',
    name: '北疆封印之地',
    icon: '❄️',
    desc: '【二周目专属】北疆深处的上古封印，真正的幕后黑手就在这里。只有完成一周目才能进入...',
    theme: 'ice',
    minLevel: 80,
    maxLevel: 100,
    nearCities: ['凉州'],
    terrain: '冰封遗迹',
    floors: 3,
    isStoryDungeon: true,
    storyAct: 7, // 特殊幕次
    requiredQuest: 'mq_ngplus_beijiang',
    isNGPlusOnly: true,
    isSecretDungeon: true,
    
    floor1: {
      map: [
        [
          { type:'entry',  cleared:true,  desc:'冰封的封印入口' },
          { type:'battle', cleared:false, enemyId:'beijiang_guardian', desc:'封印守护者' },
          { type:'elite',  cleared:false, enemyId:'ancient_warrior', desc:'【上古战士】冰封的英灵' },
          { type:'chest',  cleared:false, lootTier:'epic', desc:'上古遗物' },
        ],
        [
          { type:'event',  cleared:false, desc:'发现骨冥子与北疆的联系' },
          { type:'rest',   cleared:false, desc:'温暖的火堆' },
          { type:'battle', cleared:false, enemyId:'beijiang_guardian', desc:'封印守卫' },
          { type:'stairs', cleared:false, desc:'深入封印', targetFloor:2 },
        ],
      ],
      startPos: [0, 0],
    },
    
    floor2: {
      map: [
        [
          { type:'stairs', cleared:true,  desc:'封印深处', fromFloor:1 },
          { type:'elite',  cleared:false, enemyId:'shadow_general', desc:'【暗影将军】被封印的战将' },
          { type:'event',  cleared:false, desc:'真相碎片：三十年前的阴谋' },
          { type:'chest',  cleared:false, lootTier:'legendary', desc:'封印宝箱' },
        ],
        [
          { type:'battle', cleared:false, enemyId:'shadow_warrior', desc:'暗影战士' },
          { type:'rest',   cleared:false, desc:'封印间隙' },
          { type:'boss',   cleared:false, enemyId:'boss_shadow_council', desc:'【暗影议会】被封印的魔道长老' },
          { type:'stairs', cleared:false, desc:'通往核心', targetFloor:3 },
        ],
      ],
      startPos: [0, 0],
    },
    
    floor3: {
      map: [
        [
          { type:'stairs', cleared:true,  desc:'封印核心', fromFloor:2 },
          { type:'event',  cleared:false, desc:'最终的真相' },
          { type:'rest',   cleared:false, desc:'最后的准备' },
          { type:'chest',  cleared:false, lootTier:'legendary', desc:'真·上古遗物' },
        ],
        [
          null,
          { type:'boss',   cleared:false, enemyId:'boss_true_villain', desc:'【真·最终BOSS】北疆魔尊·被封印的仇恨' },
          null,
          null,
        ],
        [
          null,
          { type:'exit',   cleared:false, desc:'真结局达成' },
          null,
          null,
        ],
      ],
      startPos: [0, 0],
    },
    
    bossReward: {
      exp: 10000,
      silver: 5000,
      items: [
        { id:'item_true_ending_key', qty:1 },
        { id:'item_legendary_weapon_beijiang', qty:1 },
        { id:'item_ultimate_manual', qty:1 },
      ],
      storyItem: 'item_true_villain_heart',
      specialReward: {
        title: '真·武林至尊',
        achievement: 'ach_true_ending',
        unlockNGPlus2: true,
      },
    },
    
    storySettings: {
      introCinema: 'dungeon_beijiang_enter',
      bossCinema: 'boss_true_villain_defeat',
      endingCinema: 'true_ending',
      specialLoot: true,
      canReplay: true, // 可以重复挑战
      multiFloor: true,
      isTrueFinalDungeon: true,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 剧情BOSS数据库
// ═══════════════════════════════════════════════════════════════════════════

const STORY_BOSS_DB = {
  // 第一幕BOSS
  boss_blood_wolf: {
    id: 'boss_blood_wolf',
    name: '血狼·厉狂',
    title: '沧州据点首领',
    level: 20,
    hp: 800,
    maxHp: 800,
    atk: 45,
    def: 25,
    spd: 30,
    crit: 15,
    dodge: 10,
    skills: ['blood_claw', 'wolf_howl', 'frenzy'],
    desc: '骨冥子的心腹，残忍嗜血，擅长血狼爪法',
    introDialogue: [
      { speaker: 'boss', text: '哈哈哈！正道的小崽子，居然自己送上门来！' },
      { speaker: 'boss', text: '门主说得没错，你们这些伪君子果然会来碍事。' },
      { speaker: 'boss', text: '今天，你就留在这里吧！血狼爪！' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '不...不可能...门主不会放过你的...' },
      { speaker: 'player', text: '血骨门的阴谋，我一定会揭穿！' },
    ],
    specialMechanic: '血狼狂暴：HP低于30%时攻击+50%',
  },
  
  // 第二幕BOSS
  boss_fragment_guardian: {
    id: 'boss_fragment_guardian',
    name: '阎罗',
    title: '黑市之主',
    level: 30,
    hp: 1200,
    maxHp: 1200,
    atk: 60,
    def: 35,
    spd: 40,
    crit: 20,
    dodge: 15,
    skills: ['shadow_strike', 'gold_rain', 'market_rule'],
    desc: '开封黑市的幕后掌控者，为利益可以出卖一切',
    introDialogue: [
      { speaker: 'boss', text: '有趣，居然有人敢在我的地盘闹事。' },
      { speaker: 'boss', text: '想要碎片？可以，拿你的命来换！' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '该死...这碎片...给你也罢...' },
      { speaker: 'boss', text: '但你要知道，血骨门的人也在找这东西...' },
    ],
    specialMechanic: '金元护体：每回合恢复5%HP',
  },
  
  boss_nangong_trial: {
    id: 'boss_nangong_trial',
    name: '南宫先祖幻影',
    title: '试炼守护者',
    level: 35,
    hp: 1500,
    maxHp: 1500,
    atk: 70,
    def: 45,
    spd: 35,
    crit: 10,
    dodge: 20,
    skills: ['nangong_sword', 'ancestral_will', 'righteous_judgment'],
    desc: '南宫世家先祖留下的试炼幻影，考验来者的品德与实力',
    introDialogue: [
      { speaker: 'boss', text: '后辈，你为何寻求玄铁令碎片？' },
      { speaker: 'player', text: '为了阻止血骨门的阴谋，保护武林正道！' },
      { speaker: 'boss', text: '好！让我看看你的决心！' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '很好...你有资格继承这份力量...' },
      { speaker: 'boss', text: '记住，力量是为了守护，不是为了毁灭...' },
    ],
    specialMechanic: '正气凛然：玩家道德值越高，BOSS伤害越低',
  },
  
  boss_desert_guardian: {
    id: 'boss_desert_guardian',
    name: '沙海古魂',
    title: '遗迹守护者',
    level: 40,
    hp: 1800,
    maxHp: 1800,
    atk: 80,
    def: 50,
    spd: 25,
    crit: 15,
    dodge: 5,
    skills: ['sand_storm', 'ancient_curse', 'desert_wrath'],
    desc: '守护沙漠遗迹千年的古魂，玄铁令碎片的守护者',
    introDialogue: [
      { speaker: 'boss', text: '千年...终于有人来了...' },
      { speaker: 'boss', text: '想要碎片？证明你的价值...' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '你...通过了试炼...' },
      { speaker: 'boss', text: '碎片...拿去吧...但记住...更大的危机...正在逼近...' },
    ],
    specialMechanic: '沙暴：每3回合触发，降低玩家命中率',
  },
  
  // 第三幕BOSS
  boss_shaolin_traitor: {
    id: 'boss_shaolin_traitor',
    name: '玄悟',
    title: '少林叛徒',
    level: 45,
    hp: 2200,
    maxHp: 2200,
    atk: 90,
    def: 60,
    spd: 30,
    crit: 10,
    dodge: 15,
    skills: ['shaolin_betrayal', 'demon_palm', 'guilty_conscience'],
    desc: '少林首座，因过去的罪孽被三魔联盟要挟而背叛',
    introDialogue: [
      { speaker: 'boss', text: '你...你怎么找到这里的...' },
      { speaker: 'player', text: '玄悟首座，为什么？你可是少林首座啊！' },
      { speaker: 'boss', text: '你不懂...三十年前...我犯下的罪...' },
      { speaker: 'boss', text: '他们用这个要挟我...我没有选择...' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '终于...结束了...' },
      { speaker: 'boss', text: '告诉方丈...我对不起少林...' },
      { speaker: 'boss', text: '但小心...三魔联盟...还有更大的阴谋...' },
    ],
    specialMechanic: '良心发现：HP低于50%时防御下降，攻击混乱',
  },
  
  // 第四幕BOSS
  boss_alliance_commander: {
    id: 'boss_alliance_commander',
    name: '三魔联合指挥官',
    title: '联盟统帅',
    level: 50,
    hp: 2800,
    maxHp: 2800,
    atk: 100,
    def: 65,
    spd: 45,
    crit: 20,
    dodge: 15,
    skills: ['triple_demon', 'alliance_strike', 'devil_formation'],
    desc: '血骨门、玄冥教、日月神教联合推举的战场指挥官',
    introDialogue: [
      { speaker: 'boss', text: '正道的小虫子，居然潜入到这里。' },
      { speaker: 'boss', text: '不过正好，让正道知道我们的厉害！' },
      { speaker: 'boss', text: '三魔联盟，天下无敌！' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '不可能...三魔联盟...怎么会输...' },
      { speaker: 'player', text: '邪不胜正，这是亘古不变的道理！' },
    ],
    specialMechanic: '三魔之力：每回合随机切换血骨/玄冥/日月三种形态',
  },
  
  // 第五幕BOSS
  boss_xuegu_gatekeeper: {
    id: 'boss_xuegu_gatekeeper',
    name: '血骨门左右护法',
    title: '总坛守卫',
    level: 55,
    hp: 3500,
    maxHp: 3500,
    atk: 110,
    def: 70,
    spd: 40,
    crit: 15,
    dodge: 10,
    skills: ['dual_guard', 'blood_formation', 'gate_seal'],
    desc: '血骨门左右护法，守护总坛大门的最后一道防线',
    introDialogue: [
      { speaker: 'boss', text: '来者止步！这里是血骨门禁地！' },
      { speaker: 'boss', text: '想要见门主？先过我们这关！' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '门主...我们尽力了...' },
      { speaker: 'boss', text: '小子...门主不是你能对付的...' },
    ],
    specialMechanic: '双人配合：两个BOSS共享血量，技能互相配合',
  },
  
  boss_blood_council: {
    id: 'boss_blood_council',
    name: '血骨议会',
    title: '三大长老',
    level: 60,
    hp: 4500,
    maxHp: 4500,
    atk: 120,
    def: 75,
    spd: 35,
    crit: 20,
    dodge: 15,
    skills: ['council_judgment', 'blood_legacy', 'ancient_demon'],
    desc: '血骨门三大长老，掌握着血骨门最古老的秘术',
    introDialogue: [
      { speaker: 'boss', text: '年轻人，你的勇气可嘉。' },
      { speaker: 'boss', text: '但你不明白，骨冥子门主背负的是什么。' },
      { speaker: 'boss', text: '既然你执意要战，那就让我们看看你的实力！' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '咳咳...你确实很强...' },
      { speaker: 'boss', text: '去吧...去见门主...但请记住...' },
      { speaker: 'boss', text: '他...也是一个可怜人...' },
    ],
    specialMechanic: '议会审判：每回合随机封印玩家一个技能',
  },
  
  boss_gumingzi_final: {
    id: 'boss_gumingzi_final',
    name: '骨冥子',
    title: '血骨门门主',
    level: 65,
    hp: 6000,
    maxHp: 6000,
    atk: 140,
    def: 80,
    spd: 50,
    crit: 25,
    dodge: 20,
    skills: ['bone_demon_art', 'xuantie_power', 'revenge_flame', 'redemption_light'],
    desc: '血骨门门主，真实身份是三十年前被正道灭门的沈家遗孤沈墨',
    introDialogue: [
      { speaker: 'boss', text: '终于来了...我等这一天很久了。' },
      { speaker: 'player', text: '骨冥子，你的阴谋到此为止！' },
      { speaker: 'boss', text: '阴谋？哈哈哈！' },
      { speaker: 'boss', text: '你知道什么？你知道三十年前发生了什么吗？' },
      { speaker: 'boss', text: '沈家...我的家人...被你们正道灭门！' },
      { speaker: 'boss', text: '我不过是...想要一个公道！' },
    ],
    midDialogue: [
      { speaker: 'boss', text: '为什么...为什么你们都要阻止我...' },
      { speaker: 'player', text: '冤冤相报何时了？你的仇恨只会带来更多痛苦！' },
      { speaker: 'boss', text: '痛苦？我早就不知道什么是痛苦了...' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '结束了...终于...结束了...' },
      { speaker: 'player', text: '骨冥子...沈墨...放下仇恨吧。' },
      { speaker: 'boss', text: '沈墨...好久没有人叫过这个名字了...' },
      { speaker: 'boss', text: '也许...你说得对...' },
      { speaker: 'boss', text: '玄铁令...拿去吧...但小心...北疆...' },
    ],
    specialMechanic: '复仇之焰：HP每降低10%，攻击+5%；救赎之光：玩家选择救赎路线时触发特殊剧情',
    hasMultiplePhases: true,
    phases: 3,
  },
  
  // 二周目真BOSS
  boss_true_villain: {
    id: 'boss_true_villain',
    name: '北疆魔尊',
    title: '被封印的仇恨',
    level: 100,
    hp: 15000,
    maxHp: 15000,
    atk: 200,
    def: 120,
    spd: 60,
    crit: 30,
    dodge: 25,
    skills: ['ancient_demon_art', 'seal_breaker', 'eternal_hatred', 'apocalypse'],
    desc: '被封印在北疆千年的上古魔尊，一切阴谋的真正幕后黑手',
    introDialogue: [
      { speaker: 'boss', text: '千年...终于有人解开了封印...' },
      { speaker: 'player', text: '你就是真正的幕后黑手？' },
      { speaker: 'boss', text: '幕后黑手？哈哈哈！' },
      { speaker: 'boss', text: '三十年前，是我蛊惑正道灭沈家满门！' },
      { speaker: 'boss', text: '是我让骨冥子走上复仇之路！' },
      { speaker: 'boss', text: '这一切，都是为了今天！' },
      { speaker: 'boss', text: '现在，让我吸收玄铁令的力量，重临世间！' },
    ],
    midDialogue: [
      { speaker: 'boss', text: '不可能...你居然能伤到我...' },
      { speaker: 'player', text: '邪不胜正！你的阴谋不会得逞！' },
      { speaker: 'boss', text: '该死...看来要用那招了...' },
    ],
    defeatDialogue: [
      { speaker: 'boss', text: '不...不可能...我谋划千年...' },
      { speaker: 'boss', text: '该死的人类...该死的情谊...' },
      { speaker: 'boss', text: '为什么...为什么你们能如此强大...' },
      { speaker: 'player', text: '因为我们有彼此，有信念！' },
      { speaker: 'boss', text: '信念...吗...也许...这就是我无法理解的东西...' },
      { speaker: 'boss', text: '但记住...只要世间还有仇恨...我就不会真正消失...' },
    ],
    specialMechanic: '千年怨恨：每回合召唤暗影分身；封印破碎：HP低于30%时全属性+50%',
    hasMultiplePhases: true,
    phases: 4,
    isTrueFinalBoss: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 剧情地下城管理器
// ═══════════════════════════════════════════════════════════════════════════

const StoryDungeons = {
  // 存储键
  STORAGE_KEY: 'wuxia_story_dungeon_state',
  
  // 当前状态
  state: null,
  
  // ═════════════════════════════════════════════════════════════════════════
  // 初始化
  // ═════════════════════════════════════════════════════════════════════════
  
  init() {
    this.loadState();
    console.log('[StoryDungeons] 剧情地下城系统初始化完成');
    return this;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 状态管理
  // ═════════════════════════════════════════════════════════════════════════
  
  loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.state = JSON.parse(saved);
    } else {
      this.state = {
        completedDungeons: [],
        completedBosses: [],
        discoveredSecrets: [],
        currentDungeon: null,
        currentFloor: 1,
      };
      this.saveState();
    }
  },
  
  saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 地下城查询
  // ═════════════════════════════════════════════════════════════════════════
  
  getDungeon(dungeonId) {
    return STORY_DUNGEON_DB[dungeonId];
  },
  
  getAllDungeons() {
    return Object.values(STORY_DUNGEON_DB);
  },
  
  getDungeonsByAct(act) {
    return Object.values(STORY_DUNGEON_DB).filter(d => d.storyAct === act);
  },
  
  getCurrentDungeon() {
    return this.state.currentDungeon ? this.getDungeon(this.state.currentDungeon) : null;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // BOSS查询
  // ═════════════════════════════════════════════════════════════════════════
  
  getBoss(bossId) {
    return STORY_BOSS_DB[bossId];
  },
  
  getAllBosses() {
    return Object.values(STORY_BOSS_DB);
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 地下城解锁检查
  // ═════════════════════════════════════════════════════════════════════════
  
  isDungeonUnlocked(dungeonId, playerProgress) {
    const dungeon = this.getDungeon(dungeonId);
    if (!dungeon) return false;
    
    // 检查是否是二周目专属
    if (dungeon.isNGPlusOnly && !playerProgress.isNGPlus) {
      return false;
    }
    
    // 检查前置任务
    if (dungeon.requiredQuest) {
      // 需要与StoryMainQuest集成检查
      return playerProgress.completedQuests?.includes(dungeon.requiredQuest);
    }
    
    return true;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 地下城完成
  // ═════════════════════════════════════════════════════════════════════════
  
  completeDungeon(dungeonId) {
    if (!this.state.completedDungeons.includes(dungeonId)) {
      this.state.completedDungeons.push(dungeonId);
      this.saveState();
      
      // 触发剧情事件
      this.onDungeonComplete(dungeonId);
    }
  },
  
  completeBoss(bossId) {
    if (!this.state.completedBosses.includes(bossId)) {
      this.state.completedBosses.push(bossId);
      this.saveState();
      
      // 触发BOSS击败事件
      this.onBossDefeat(bossId);
    }
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 事件回调
  // ═════════════════════════════════════════════════════════════════════════
  
  onDungeonComplete(dungeonId) {
    const dungeon = this.getDungeon(dungeonId);
    if (dungeon?.storySettings?.bossCinema) {
      // 触发剧情动画
      console.log(`[StoryDungeons] 触发剧情动画: ${dungeon.storySettings.bossCinema}`);
    }
    
    // 可以在这里触发成就解锁
    console.log(`[StoryDungeons] 地下城完成: ${dungeonId}`);
  },
  
  onBossDefeat(bossId) {
    const boss = this.getBoss(bossId);
    if (boss) {
      console.log(`[StoryDungeons] BOSS击败: ${boss.name}`);
      
      // 触发BOSS对话
      if (boss.defeatDialogue) {
        console.log('[StoryDungeons] 播放BOSS击败对话');
      }
    }
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 获取地下城入口HTML
  // ═════════════════════════════════════════════════════════════════════════
  
  getDungeonEntranceHTML(dungeonId, isUnlocked = true) {
    const dungeon = this.getDungeon(dungeonId);
    if (!dungeon) return '';
    
    const lockedClass = isUnlocked ? '' : 'locked';
    const lockedOverlay = isUnlocked ? '' : '<div class="dungeon-locked-overlay">🔒 未解锁</div>';
    
    return `
      <div class="story-dungeon-card ${lockedClass}" data-dungeon="${dungeonId}">
        <div class="dungeon-icon">${dungeon.icon}</div>
        <div class="dungeon-info">
          <h4>${dungeon.name}</h4>
          <p class="dungeon-desc">${dungeon.desc}</p>
          <div class="dungeon-meta">
            <span class="dungeon-level">Lv.${dungeon.minLevel}-${dungeon.maxLevel}</span>
            <span class="dungeon-act">第${dungeon.storyAct}幕</span>
            ${dungeon.floors > 1 ? `<span class="dungeon-floors">${dungeon.floors}层</span>` : ''}
          </div>
        </div>
        ${lockedOverlay}
      </div>
    `;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 获取BOSS战HTML
  // ═════════════════════════════════════════════════════════════════════════
  
  getBossBattleHTML(bossId) {
    const boss = this.getBoss(bossId);
    if (!boss) return '';
    
    return `
      <div class="story-boss-battle" data-boss="${bossId}">
        <div class="boss-intro">
          <h3>${boss.name}</h3>
          <p class="boss-title">${boss.title}</p>
          <p class="boss-desc">${boss.desc}</p>
        </div>
        <div class="boss-stats">
          <div class="boss-stat"><span>等级:</span> ${boss.level}</div>
          <div class="boss-stat"><span>气血:</span> ${boss.hp}</div>
          <div class="boss-stat"><span>攻击:</span> ${boss.atk}</div>
          <div class="boss-stat"><span>防御:</span> ${boss.def}</div>
        </div>
        <div class="boss-mechanic">
          <p><strong>特殊机制:</strong> ${boss.specialMechanic}</p>
        </div>
      </div>
    `;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 工具函数
  // ═════════════════════════════════════════════════════════════════════════
  
  // 获取剧情进度文本
  getProgressText() {
    const completed = this.state.completedDungeons.length;
    const total = Object.keys(STORY_DUNGEON_DB).length;
    return `剧情地下城进度: ${completed}/${total}`;
  },
  
  // 检查是否完成所有剧情地下城
  isAllDungeonsCompleted() {
    const storyDungeons = Object.keys(STORY_DUNGEON_DB).filter(id => {
      const d = STORY_DUNGEON_DB[id];
      return !d.isNGPlusOnly; // 不包括二周目专属
    });
    return storyDungeons.every(id => this.state.completedDungeons.includes(id));
  },
  
  // 重置状态（用于二周目）
  resetForNGPlus() {
    this.state.completedDungeons = [];
    this.state.completedBosses = [];
    this.state.discoveredSecrets = [];
    this.saveState();
    console.log('[StoryDungeons] 已重置为二周目状态');
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 自动初始化
// ═══════════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.StoryDungeons = StoryDungeons;
  window.STORY_DUNGEON_DB = STORY_DUNGEON_DB;
  window.STORY_BOSS_DB = STORY_BOSS_DB;
  
  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StoryDungeons.init());
  } else {
    StoryDungeons.init();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 导出（用于模块化环境）
// ═══════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StoryDungeons, STORY_DUNGEON_DB, STORY_BOSS_DB };
}
