// ════════════════════════════════════════════════════
//  data-story-dungeons.js  剧情地下城数据
//  《血骨门之乱》专属剧情副本 - 与主线任务链深度绑定
// ════════════════════════════════════════════════════

// ── 剧情地下城类型常量 ──────────────────────────────
const STORY_DUNGEON_TYPE = {
  MAIN:    'main',     // 主线必经地下城
  BRANCH:  'branch',   // 支线可选地下城
  SECRET:  'secret',   // 隐藏地下城（需特定条件解锁）
  FINAL:   'final',    // 终章决战地下城
};

// ── 剧情地下城数据库 ────────────────────────────────
// 与普通地下城的区别：
// 1. 有剧情叙事文本（narrative）
// 2. 与主线任务节点绑定（bindQuest）
// 3. 有剧情过场（cutscenes）
// 4. 只能完成一次（isReplayable: false）
// 5. 有特殊剧情BOSS和机制
// ────────────────────────────────────────────────────
const STORY_DUNGEON_DB = {

  // ════════════════════════════════════════════════════
  //  第一幕：沧州暗战 - 血骨门据点
  // ════════════════════════════════════════════════════

  sd_cangzhou_hideout: {
    id:       'sd_cangzhou_hideout',
    name:     '沧州暗巷·血骨门据点',
    icon:     '🏚️',
    desc:     '沧州城地下暗巷深处，血骨门设有一处秘密据点。镖师钟恒被困于此，你必须潜入救出他，并夺回玄悟锦囊。',
    type:     STORY_DUNGEON_TYPE.MAIN,
    theme:    'dark_alley',  // 暗巷主题
    minLevel: 5,
    maxLevel: 15,
    
    // 绑定主线任务
    bindQuest: 'mq_act1_cangzhou',
    
    // 只能完成一次
    isReplayable: false,
    
    // 进入条件
    requirement: {
      questId: 'mq_act1_cangzhou_road',  // 需完成前置任务
      questStatus: 'completed',
    },
    
    // 剧情叙事
    narrative: {
      enter: {
        scene: '沧州·地下暗巷',
        lines: [
          '你循着线索来到沧州城最混乱的街区。',
          '这里污水横流，乞丐和流民蜷缩在墙角。',
          '一个衣衫褴褛的老乞丐悄悄指了指墙角的暗门——',
          '「血骨门的人……就在下面。小心，他们有高手……」',
        ],
        tip: '潜入血骨门据点，救出钟恒',
      },
      boss: {
        scene: '据点密室',
        lines: [
          '你突破重重守卫，终于来到密室门前。',
          '门内传来钟恒的怒骂声和鞭打声——',
          '「你们这些邪道！玄悟大师不会放过你们的！」',
          '一个阴冷的声音回应：「玄悟？他自身难保了……」',
          '你一脚踹开大门，血骨门追命使「血爪」转身冷笑——',
          '「又一个来送死的。正好，门主需要更多『材料』……」',
        ],
        tip: '击败血爪，救出钟恒！',
      },
      complete: {
        scene: '暗巷出口',
        lines: [
          '血爪倒下了，眼中满是不可置信。',
          '「你……你究竟是谁……门主不会放过你的……」',
          '钟恒虚弱地将锦囊交给你：「快走……血骨门的大队人马马上就到……」',
          '你扶着钟恒逃出暗巷，身后传来追兵的呼喝声……',
          '【第一幕·沧州暗战 完成】',
        ],
        rewardText: '经验+500 · 获得「玄悟锦囊」· 正道声望+20',
      },
    },
    
    // 地图：暗巷迷宫（6×5）
    map: [
      [
        { type:'entry',  cleared:true,  desc:'暗巷入口，腥臭扑鼻' },
        { type:'battle', cleared:false, enemyId:'xuegu_scout',    desc:'两个血骨门哨兵在打牌' },
        { type:'chest',  cleared:false, lootTier:'common',       desc:'哨兵藏酒的木箱' },
        null,
        null,
        { type:'rest',   cleared:false, desc:'废弃的祠堂，可以暂时歇脚' },
      ],
      [
        null,
        { type:'trap',   cleared:false, desc:'地面的捕兽夹，被破布遮盖' },
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'巡逻的血骨门弟子' },
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'守卫通道的喽啰' },
        { type:'elite',  cleared:false, enemyId:'xuegu_elite',    desc:'血骨门小头目「鬼刀」' },
        null,
      ],
      [
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'小头目房间的暗格' },
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'听到动静赶来的守卫' },
        { type:'empty',  cleared:false, desc:'阴暗潮湿的通道' },
        { type:'event',  cleared:false, desc:'一个被囚禁的商人，求你放他出去' },
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'闻讯而来的增援' },
        { type:'rest',   cleared:false, desc:'地下暗河的浅滩，可以休息' },
      ],
      [
        null,
        null,
        { type:'trap',   cleared:false, desc:'毒烟机关，触发会中毒' },
        { type:'elite',  cleared:false, enemyId:'xuegu_poisoner', desc:'血骨门毒师「千手」' },
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'毒师炼药的柜子，有解药' },
        { type:'battle', cleared:false, enemyId:'xuegu_elite',    desc:'守卫密道的精英弟子' },
      ],
      [
        null,
        null,
        null,
        { type:'empty',  cleared:false, desc:'通往密室的狭窄通道' },
        { type:'battle', cleared:false, enemyId:'xuegu_guard',    desc:'密室门前的最后守卫' },
        { type:'boss',   cleared:false, enemyId:'xuegu_zhuazhua', desc:'【追命使·血爪】血骨门沧州负责人，爪功阴毒' },
      ],
    ],
    
    startPos: [0, 0],
    
    bossReward: {
      exp:    500,
      silver: 150,
      items:  [
        { id:'item_secret_pouch', qty:1 },  // 玄悟锦囊
        { id:'item_antidote',     qty:3 },
      ],
      fameRighteous: 20,
    },
    
    // 剧情完成后的特殊处理
    onComplete: 'advanceMainQuest("mq_act1_cangzhou")',  // 自动推进主线
  },

  // ════════════════════════════════════════════════════
  //  第二幕：嵩山石窟 - 玄铁令碎片（一）
  // ════════════════════════════════════════════════════

  sd_songshan_grotto: {
    id:       'sd_songshan_grotto',
    name:     '嵩山石窟·千年秘境',
    icon:     '⛰️',
    desc:     '嵩山深处的千年石窟，据说是上古时期封印邪物的圣地。玄铁令第一块碎片就藏在这里，但血骨门的探子已经先一步到达。',
    type:     STORY_DUNGEON_TYPE.MAIN,
    theme:    'ancient_grotto',
    minLevel: 15,
    maxLevel: 25,
    
    bindQuest: 'mq_act2_songshan',
    isReplayable: false,
    
    requirement: {
      questId: 'mq_act2_pouch',
      questStatus: 'completed',
    },
    
    narrative: {
      enter: {
        scene: '嵩山·石窟入口',
        lines: [
          '你按照锦囊地图，找到嵩山后山的隐秘石窟。',
          '洞口被藤蔓遮掩，石壁上刻满古老的梵文。',
          '「令藏三处，碎而不全……」你默念着锦囊中的字句。',
          '突然，洞内传来打斗声和惨叫声——有人先到了！',
        ],
        tip: '深入石窟，找到第一块玄铁令碎片',
      },
      mid: {
        scene: '石窟深处·机关室',
        lines: [
          '你穿过重重机关，来到石窟核心的石室。',
          '血骨门的人正在强行破解封印，地上躺着几具少林僧人的尸体。',
          '「住手！」你大喝一声。',
          '血骨门追命使「追魂」转身，手中还滴着鲜血——',
          '「又来一个送死的。正好，封印需要更多血祭……」',
        ],
        tip: '阻止血骨门，保护玄铁令碎片！',
      },
      boss: {
        scene: '封印之间',
        lines: [
          '追魂倒下了，但封印已经被破坏大半。',
          '石室中央，一块暗金色的碎片悬浮在法阵中，发出微弱的光芒。',
          '你正要上前取走碎片，地面突然震动——',
          '封印之下，有什么东西正在苏醒……',
          '一个巨大的黑影从地底裂缝中爬出，是上古时期被封印的「石魔」！',
          '「玄……铁……令……」石魔发出低沉的嘶吼，向你扑来！',
        ],
        tip: '击败石魔，夺取玄铁令碎片！',
      },
      complete: {
        scene: '石窟出口',
        lines: [
          '石魔化为碎石，封印重新稳定。',
          '你取下玄铁令碎片，它在你手中微微发热，上面的古篆若隐若现。',
          '远处传来更多血骨门援兵的声音，你必须马上离开！',
          '【第二幕·嵩山石窟 完成】',
          '【获得：玄铁令碎片（一）】',
        ],
        rewardText: '经验+800 · 获得「玄铁令碎片（一）」· 少林好感+30',
      },
    },
    
    // 多层结构：石窟分三层
    floors: 3,
    
    // 第一层：外围通道
    floor1: [
      [
        { type:'entry',  cleared:true,  desc:'石窟入口，梵文石壁' },
        { type:'battle', cleared:false, enemyId:'xuegu_scout',    desc:'血骨门探子正在绘制地图' },
        { type:'chest',  cleared:false, lootTier:'common',       desc:'古人留下的供品箱' },
        { type:'trap',   cleared:false, desc:'地面石板机关，踩错会触发毒箭' },
      ],
      [
        null,
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'听到动静的血骨门弟子' },
        { type:'rest',   cleared:false, desc:'石窟中的地下河，可以休息' },
        { type:'battle', cleared:false, enemyId:'xuegu_elite',    desc:'守卫通道的精英' },
      ],
      [
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'僧人遗留的经卷箱' },
        { type:'elite',  cleared:false, enemyId:'xuegu_poisoner', desc:'血骨门毒师正在布置陷阱' },
        { type:'empty',  cleared:false, desc:'通往下一层的石阶' },
        { type:'exit',   cleared:false, desc:'通往石窟深处的阶梯', toFloor:2 },
      ],
    ],
    
    // 第二层：机关密室
    floor2: [
      [
        { type:'entry',  cleared:true,  desc:'第二层入口，机关重重' },
        { type:'trap',   cleared:false, desc:'滚石机关，需要快速通过' },
        { type:'battle', cleared:false, enemyId:'xuegu_elite',    desc:'守护机关的血骨门高手' },
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'机关密室中的宝物' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'巡逻的守卫' },
        { type:'event',  cleared:false, desc:'被困的少林僧人，需要解救' },
        { type:'elite',  cleared:false, enemyId:'xuegu_zhuihun',  desc:'【追命使·追魂】血骨门高手' },
        { type:'rest',   cleared:false, desc:'安全的石室，可以打坐' },
      ],
      [
        null,
        { type:'trap',   cleared:false, desc:'毒雾机关' },
        { type:'empty',  cleared:false, desc:'通往封印之间的最后通道' },
        { type:'exit',   cleared:false, desc:'通往封印之间', toFloor:3 },
      ],
    ],
    
    // 第三层：封印之间（BOSS层）
    floor3: [
      [
        { type:'entry',  cleared:true,  desc:'封印之间入口，邪气弥漫' },
        { type:'empty',  cleared:false, desc:'残破的法阵' },
        { type:'boss',   cleared:false, enemyId:'boss_stone_demon', desc:'【上古石魔】封印中的邪物，被玄铁令气息唤醒' },
        { type:'chest',  cleared:false, lootTier:'legendary',    desc:'封印核心的宝物' },
      ],
    ],
    
    startPos: [0, 0],
    
    bossReward: {
      exp:    1200,
      silver: 300,
      items:  [
        { id:'item_xuantie_shard1', qty:1 },
        { id:'item_shaolin_medal',  qty:1 },
      ],
      rel_sect: 'shaolin',
      rel_val: 30,
    },
    
    onComplete: 'advanceMainQuest("mq_act2_songshan")',
  },

  // ════════════════════════════════════════════════════
  //  第四幕：幽州潜入 - 血骨门总部（大型剧情地下城）
  // ════════════════════════════════════════════════════

  sd_youzhou_headquarters: {
    id:       'sd_youzhou_headquarters',
    name:     '幽州黑市·血骨门总部',
    icon:     '🏴‍☠️',
    desc:     '血骨门总部位于幽州黑市地下，是一座庞大的地下堡垒。你必须潜入其中，找到「三魔密约」，并安全撤离。这是整个主线中最危险的潜入任务。',
    type:     STORY_DUNGEON_TYPE.MAIN,
    theme:    'underground_fortress',
    minLevel: 35,
    maxLevel: 50,
    
    bindQuest: 'mq_act4_infiltrate',
    isReplayable: false,
    
    requirement: {
      questId: 'mq_act4_last_hope',
      questStatus: 'completed',
    },
    
    // 特殊机制：潜入度
    specialMechanic: {
      name: '潜入度',
      description: '被发现会提高警戒等级，敌人会变强',
      maxAlert: 100,
      phases: [
        { threshold: 0,   name: '完美潜入', enemyBuff: 0 },
        { threshold: 30,  name: '轻微警觉', enemyBuff: 0.1 },
        { threshold: 60,  name: '高度警戒', enemyBuff: 0.25 },
        { threshold: 90,  name: '全面搜捕', enemyBuff: 0.5 },
      ],
    },
    
    narrative: {
      enter: {
        scene: '幽州·黑市',
        lines: [
          '幽州黑市，三教九流的汇聚之地。',
          '你乔装成江湖游医，混在人群中。',
          '按照鹤隐老者的情报，血骨门总部的入口就在黑市最深处的一口枯井中。',
          '你趁着夜色，悄悄潜入枯井……',
        ],
        tip: '潜入血骨门总部，找到三魔密约',
      },
      mid1: {
        scene: '总部外围·地下通道',
        lines: [
          '枯井下方是一条漫长的地下通道，两侧点着幽绿的鬼火。',
          '通道尽头是一扇巨大的铁门，门口有两个血骨门守卫。',
          '你观察了一下，发现旁边有一条通风管道可以绕过去……',
        ],
        tip: '选择：正面突破（战斗）或潜行绕后（需要敏捷）',
      },
      mid2: {
        scene: '总部核心区·档案室',
        lines: [
          '你成功潜入核心区，档案室就在前方。',
          '但门口有一个血骨门长老在巡视，他的感知极为敏锐。',
          '「奇怪……我怎么感觉有人在附近……」长老喃喃自语。',
        ],
        tip: '小心避开长老的感知范围',
      },
      boss: {
        scene: '密室·三魔密约',
        lines: [
          '你终于找到了存放三魔密约的密室。',
          '但就在你拿到密约的瞬间，警报大响！',
          '「哈哈哈！果然有人上钩了！」',
          '血骨门副门主「血刃」从阴影中走出，身后是数十名精锐弟子。',
          '「门主早就料到会有人来找密约。这不过是引蛇出洞的陷阱罢了！」',
          '「不过既然来了，就永远留在这里吧！」',
        ],
        tip: '击败血刃，杀出重围！',
      },
      escape: {
        scene: '黑市·逃亡',
        lines: [
          '血刃倒下了，但整个总部已经沸腾。',
          '你拿着三魔密约，在血骨门大军的追杀下拼命奔逃。',
          '就在即将被包围的危急时刻，鹤隐老者派来的接应者出现——',
          '「快！跟我来！」',
          '你被带入一条秘密通道，甩开了追兵……',
        ],
        tip: '成功逃脱！',
      },
      complete: {
        scene: '安全屋',
        lines: [
          '你瘫坐在安全屋的椅子上，大口喘着粗气。',
          '三魔密约就在手中——这是瓦解三魔联盟的关键！',
          '密约的内容令你震惊：血骨门许诺事成之后独占中原，玄冥教却只得到一纸空文……',
          '「三魔之间本就有裂隙……」你露出笑容。',
          '【第四幕·幽州潜入 完成】',
        ],
        rewardText: '经验+2500 · 获得「三魔密约抄本」· 正道声望+50',
      },
    },
    
    // 大型多层地下城（5层）
    floors: 5,
    
    // 第一层：地下通道
    floor1: [
      [
        { type:'entry',  cleared:true,  desc:'枯井底部，幽绿鬼火' },
        { type:'event',  cleared:false, desc:'选择：正面突破或潜行绕后', isChoice:true },
        { type:'battle', cleared:false, enemyId:'xuegu_guard',    desc:'守卫铁门的血骨门弟子', condition:'choose_combat' },
        { type:'empty',  cleared:false, desc:'通风管道，可以潜行', condition:'choose_stealth' },
        { type:'chest',  cleared:false, lootTier:'uncommon',     desc:'守卫身上的钥匙' },
      ],
      [
        { type:'trap',   cleared:false, desc:'地面压力机关' },
        { type:'battle', cleared:false, enemyId:'xuegu_patrol',   desc:'巡逻队' },
        { type:'rest',   cleared:false, desc:'隐蔽角落，可以休息' },
        { type:'elite',  cleared:false, enemyId:'xuegu_elite',    desc:'精英守卫' },
      ],
      [
        null,
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'巡逻队长身上的密信' },
        { type:'exit',   cleared:false, desc:'通往总部外围', toFloor:2 },
      ],
    ],
    
    // 第二层：总部外围
    floor2: [
      [
        { type:'entry',  cleared:true,  desc:'总部外围，戒备森严' },
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'外围守卫' },
        { type:'event',  cleared:false, desc:'发现一份巡逻时间表' },
        { type:'trap',   cleared:false, desc:'警报机关' },
      ],
      [
        { type:'elite',  cleared:false, enemyId:'xuegu_captain',  desc:'外围队长' },
        { type:'chest',  cleared:false, lootTier:'rare',         desc:'队长的私人物品' },
        { type:'battle', cleared:false, enemyId:'xuegu_foot',     desc:'听到动静赶来的守卫' },
        { type:'rest',   cleared:false, desc:'储藏室，可以藏身' },
      ],
      [
        { type:'empty',  cleared:false, desc:'通往核心区的走廊' },
        { type:'exit',   cleared:false, desc:'通往核心区', toFloor:3 },
      ],
    ],
    
    // 第三层：核心区
    floor3: [
      [
        { type:'entry',  cleared:true,  desc:'核心区入口，高手如云' },
        { type:'elite',  cleared:false, enemyId:'xuegu_elite',    desc:'核心区域守卫' },
        { type:'event',  cleared:false, desc:'避开长老巡视', isStealth:true },
        { type:'chest',  cleared:false, lootTier:'epic',         desc:'长老房间的暗格' },
      ],
      [
        { type:'battle', cleared:false, enemyId:'xuegu_elite',    desc:'核心守卫' },
        { type:'rest',   cleared:false, desc:'安全的密室' },
        { type:'elite',  cleared:false, enemyId:'xuegu_elder',    desc:'血骨门长老' },
        { type:'exit',   cleared:false, desc:'通往档案室', toFloor:4 },
      ],
    ],
    
    // 第四层：档案室
    floor4: [
      [
        { type:'entry',  cleared:true,  desc:'档案室入口' },
        { type:'chest',  cleared:false, lootTier:'legendary',    desc:'三魔密约', isKeyItem:true },
        { type:'boss',   cleared:false, enemyId:'boss_xueren',    desc:'【副门主·血刃】血骨门第二高手' },
        { type:'exit',   cleared:false, desc:'紧急逃生通道', toFloor:5 },
      ],
    ],
    
    // 第五层：逃亡通道
    floor5: [
      [
        { type:'entry',  cleared:true,  desc:'紧急逃生通道' },
        { type:'battle', cleared:false, enemyId:'xuegu_chaser',   desc:'追兵' },
        { type:'battle', cleared:false, enemyId:'xuegu_chaser',   desc:'更多追兵' },
        { type:'event',  cleared:false, desc:'接应者出现', isEscape:true },
        { type:'exit',   cleared:true,  desc:'逃出黑市', isComplete:true },
      ],
    ],
    
    startPos: [0, 0],
    
    bossReward: {
      exp:    3000,
      silver: 800,
      items:  [
        { id:'item_demon_pact_copy', qty:1 },
        { id:'item_xuegu_token',     qty:1 },
      ],
      fameRighteous: 50,
    },
    
    onComplete: 'advanceMainQuest("mq_act4_infiltrate")',
  },

  // ════════════════════════════════════════════════════
  //  第五幕：血骨门决战 - 终章地下城
  // ════════════════════════════════════════════════════

  sd_final_bloodgate: {
    id:       'sd_final_bloodgate',
    name:     '血骨门·总坛决战',
    icon:     '☠️',
    desc:     '正道联盟与血骨门的最终决战！你率领精锐攻入血骨门总坛，直面骨冥子。这是决定江湖命运的一战！',
    type:     STORY_DUNGEON_TYPE.FINAL,
    theme:    'demon_fortress',
    minLevel: 50,
    maxLevel: 70,
    
    bindQuest: 'mq_act5_final_battle',
    isReplayable: true,  // 终章可以重复挑战（回忆模式）
    
    requirement: {
      questId: 'mq_act5_assemble',
      questStatus: 'completed',
    },
    
    narrative: {
      enter: {
        scene: '幽州·血骨门总坛外',
        lines: [
          '号角吹响，决战开始！',
          '正道联盟数千弟子列阵于血骨门总坛之外，各派掌门立于阵前。',
          '少林方丈手持禅杖，声音如洪钟：',
          '「今日之战，关乎天下苍生！诸位侠士，随我杀尽邪魔！」',
          '你作为联盟先锋，率领精锐率先冲入敌阵！',
        ],
        tip: '攻入血骨门总坛，直取骨冥子！',
      },
      phase1: {
        scene: '总坛外围·血战',
        lines: [
          '血骨门弟子如潮水般涌来，喊杀声震天动地。',
          '你身先士卒，一路杀穿三道防线。',
          '鲜血染红了大地，但你的脚步从未停歇。',
          '「先锋营，随我冲杀！」',
        ],
        tip: '突破外围防线',
      },
      phase2: {
        scene: '总坛内城·四大护法',
        lines: [
          '你冲入内城，血骨门四大护法挡在面前。',
          '「血爪」「追魂」「鬼刀」「千手」——',
          '四大护法联手，是血骨门最后的屏障！',
          '「来得正好！新仇旧恨，今日一并清算！」',
        ],
        tip: '击败四大护法',
      },
      phase3: {
        scene: '血池大殿·骨冥子',
        lines: [
          '四大护法尽数倒下，你终于来到血池大殿。',
          '骨冥子站在血池中央，周身环绕着诡异的黑气。',
          '「你终于来了……我等你很久了。」',
          '「玄铁令的碎片在你手中吧？很好，省得我去找了。」',
          '骨冥子狂笑着，血池开始沸腾——',
          '「今日，我将用玄铁令解开上古封印，获得神的力量！」',
          '「而你，将成为我成神之路上的第一块垫脚石！」',
        ],
        tip: '击败骨冥子，阻止他的疯狂计划！',
      },
      final: {
        scene: '封印之间·最终对决',
        lines: [
          '骨冥子倒下了，但他的疯狂笑容依然挂在脸上。',
          '「太晚了……封印已经开始松动了……」',
          '地面剧烈震动，血池中的黑气凝聚成一个巨大的漩涡。',
          '上古封印正在崩溃，有什么恐怖的存在即将降临！',
          '鹤隐老者突然出现，大喊：「快！用玄铁令重新加固封印！」',
          '你握紧玄铁令，冲向漩涡中心……',
        ],
        tip: '用玄铁令加固封印，完成最终使命！',
      },
      complete: {
        scene: '战后·幽州城外',
        lines: [
          '封印重新稳定，黑气消散。',
          '鹤隐老者微笑着看你，身体却开始变得透明。',
          '「孩子……你做得很好……」',
          '「我用毕生修为加固了封印……但我也将化为封印的一部分……」',
          '「江湖的未来……就交给你们了……」',
          '鹤隐老者的身影彻底消失，只留下一枚玉佩。',
          '你跪在原地，久久不语。',
          '【第五幕·血骨门决战 完成】',
          '【主线《血骨门之乱》完结】',
        ],
        rewardText: '经验+5000 · 获得「玄铁令（完整）」· 称号「武林盟副盟主」· 正道声望+100',
      },
    },
    
    // 超大型终章地下城（6层，层层递进）
    floors: 6,
    
    // 第一层：外围防线
    floor1: [
      [
        { type:'entry',  cleared:true,  desc:'总坛外围，战鼓雷鸣' },
        { type:'battle', cleared:false, enemyId:'xuegu_army',     desc:'血骨门大军' },
        { type:'elite',  cleared:false, enemyId:'xuegu_captain',  desc:'血骨门统领' },
        { type:'battle', cleared:false, enemyId:'xuegu_army',     desc:'源源不断的敌人' },
      ],
      [
        { type:'rest',   cleared:false, desc:'临时医疗点' },
        { type:'battle', cleared:false, enemyId:'xuegu_elite',    desc:'精锐部队' },
        { type:'chest',  cleared:false, lootTier:'epic',         desc:'战利品' },
        { type:'exit',   cleared:false, desc:'突破第一道防线', toFloor:2 },
      ],
    ],
    
    // 第二层：第二道防线
    floor2: [
      [
        { type:'entry',  cleared:true,  desc:'第二道防线' },
        { type:'elite',  cleared:false, enemyId:'xuegu_elite',    desc:'血骨门精英' },
        { type:'battle', cleared:false, enemyId:'xuegu_army',     desc:'大军' },
        { type:'trap',   cleared:false, desc:'血骨门布置的陷阱' },
      ],
      [
        { type:'boss',   cleared:false, enemyId:'boss_xuegu_general', desc:'【血骨门大将】镇守第二防线' },
        { type:'exit',   cleared:false, desc:'通往内城', toFloor:3 },
      ],
    ],
    
    // 第三层：内城·四大护法
    floor3: [
      [
        { type:'entry',  cleared:true,  desc:'内城入口' },
        { type:'boss',   cleared:false, enemyId:'boss_xuegu_zhuazhua', desc:'【护法·血爪】' },
        { type:'boss',   cleared:false, enemyId:'boss_xuegu_zhuihun',  desc:'【护法·追魂】' },
      ],
      [
        { type:'rest',   cleared:false, desc:'短暂休整' },
        { type:'boss',   cleared:false, enemyId:'boss_xuegu_guidao',   desc:'【护法·鬼刀】' },
        { type:'boss',   cleared:false, enemyId:'boss_xuegu_qianshou', desc:'【护法·千手】' },
        { type:'exit',   cleared:false, desc:'通往血池大殿', toFloor:4 },
      ],
    ],
    
    // 第四层：血池大殿·骨冥子
    floor4: [
      [
        { type:'entry',  cleared:true,  desc:'血池大殿，血气冲天' },
        { type:'boss',   cleared:false, enemyId:'boss_gumingzi_phase1', desc:'【骨冥子·第一阶段】' },
        { type:'boss',   cleared:false, enemyId:'boss_gumingzi_phase2', desc:'【骨冥子·第二阶段】血神经全力' },
      ],
    ],
    
    // 第五层：封印之间
    floor5: [
      [
        { type:'entry',  cleared:true,  desc:'封印之间，黑气弥漫' },
        { type:'event',  cleared:false, desc:'用玄铁令加固封印', isKeyEvent:true },
        { type:'exit',   cleared:false, desc:'封印稳定，通往外界', toFloor:6 },
      ],
    ],
    
    // 第六层：战后
    floor6: [
      [
        { type:'entry',  cleared:true,  desc:'战后·幽州城外' },
        { type:'event',  cleared:false, desc:'鹤隐老者的告别', isEnding:true },
        { type:'exit',   cleared:true,  desc:'返回江湖', isComplete:true },
      ],
    ],
    
    startPos: [0, 0],
    
    bossReward: {
      exp:    8000,
      silver: 2000,
      items:  [
        { id:'item_xuantie_complete', qty:1 },
        { id:'item_heyin_jade',       qty:1 },
        { id:'item_legendary_weapon', qty:1 },
      ],
      title: '武林盟副盟主',
      fameRighteous: 100,
    },
    
    onComplete: 'advanceMainQuest("mq_act5_final_battle"); unlockAchievement("ach_story_complete");',
  },

  // ════════════════════════════════════════════════════
  //  隐藏剧情地下城：玄铁令真相
  // ════════════════════════════════════════════════════

  sd_secret_xuantie_truth: {
    id:       'sd_secret_xuantie_truth',
    name:     '上古遗迹·玄铁令真相',
    icon:     '🔮',
    desc:     '隐藏在主线之外的秘密地下城。只有收集齐所有线索，才能找到这个上古遗迹，揭开玄铁令的真正秘密……',
    type:     STORY_DUNGEON_TYPE.SECRET,
    theme:    'ancient_ruins',
    minLevel: 60,
    maxLevel: 80,
    
    // 隐藏地下城，不绑定主线
    bindQuest: null,
    isReplayable: false,
    
    // 解锁条件：完成主线 + 收集隐藏线索
    requirement: {
      questId: 'mq_act6_xuantie_fate',
      questStatus: 'completed',
      hiddenItems: ['item_heyin_jade', 'item_xuantie_complete'],  // 需要特定物品
      intel: 'intel_xuantie_origin',  // 需要特定情报
    },
    
    narrative: {
      enter: {
        scene: '北疆·上古遗迹',
        lines: [
          '你循着鹤隐老者留下的玉佩指引，来到北疆荒原。',
          '这里有一座被风沙掩埋的古老遗迹，据说是上古战神封印邪神的地方。',
          '玄铁令的真正秘密，就藏在这里……',
        ],
        tip: '探索上古遗迹，揭开玄铁令的真相',
      },
      // ... 更多剧情
    },
    
    // 隐藏地下城内容省略，作为彩蛋留给玩家探索
    floors: 3,
    // ... 地图数据
    
    bossReward: {
      exp:    5000,
      silver: 1000,
      items:  [
        { id:'item_xuantie_true_form', qty:1 },  // 玄铁令真身
      ],
      hiddenEnding: true,  // 解锁隐藏结局
    },
  },

};

// ════════════════════════════════════════════════════
//  剧情地下城工具函数
// ════════════════════════════════════════════════════

/** 检查剧情地下城是否可进入 */
function canEnterStoryDungeon(dungeonId) {
  const sd = STORY_DUNGEON_DB[dungeonId];
  if (!sd) return { can: false, reason: '地下城不存在' };
  
  // 检查是否已完成（非重复进入）
  if (!sd.isReplayable) {
    const progress = getStoryDungeonProgress();
    if (progress[dungeonId] === 'completed') {
      return { can: false, reason: '该剧情地下城已完成' };
    }
  }
  
  // 检查进入条件
  if (sd.requirement) {
    const req = sd.requirement;
    
    // 检查任务状态
    if (req.questId && req.questStatus) {
      const questProg = getMainQuestProgress();
      if (questProg[req.questId] !== req.questStatus) {
        return { 
          can: false, 
          reason: `需要完成前置任务：${MAIN_QUEST_CHAIN[req.questId]?.name || req.questId}` 
        };
      }
    }
    
    // 检查隐藏物品
    if (req.hiddenItems) {
      // 检查背包中是否有指定物品
      // ... 实现省略
    }
    
    // 检查情报
    if (req.intel) {
      // 检查是否获得指定情报
      // ... 实现省略
    }
  }
  
  return { can: true };
}

/** 获取剧情地下城进度 */
function getStoryDungeonProgress() {
  try {
    return JSON.parse(localStorage.getItem('wuxia_story_dungeon') || '{}');
  } catch (e) {
    return {};
  }
}

/** 保存剧情地下城进度 */
function saveStoryDungeonProgress(dungeonId, status) {
  const progress = getStoryDungeonProgress();
  progress[dungeonId] = status;
  try {
    localStorage.setItem('wuxia_story_dungeon', JSON.stringify(progress));
  } catch (e) {}
}

/** 标记剧情地下城完成 */
function completeStoryDungeon(dungeonId) {
  saveStoryDungeonProgress(dungeonId, 'completed');
  
  const sd = STORY_DUNGEON_DB[dungeonId];
  if (sd && sd.onComplete) {
    // 执行完成回调
    try {
      eval(sd.onComplete);
    } catch (e) {
      console.error('剧情地下城完成回调失败:', e);
    }
  }
}

/** 显示剧情地下城进入确认 */
function showStoryDungeonConfirm(dungeonId, fromPage) {
  const check = canEnterStoryDungeon(dungeonId);
  if (!check.can) {
    showToast(`❌ ${check.reason}`);
    return;
  }
  
  const sd = STORY_DUNGEON_DB[dungeonId];
  
  // 显示剧情介绍弹窗
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:480px">
      <div class="mqn-act-badge" style="color:${sd.type === STORY_DUNGEON_TYPE.FINAL ? '#ff6060' : '#80d8ff'};border-color:rgba(128,216,255,.3)">
        ${sd.type === STORY_DUNGEON_TYPE.FINAL ? '☠️ 终章决战' : '📜 剧情地下城'}
      </div>
      <div class="mqn-title" style="font-size:20px;margin:12px 0">
        ${sd.icon} ${sd.name}
      </div>
      <div class="mqn-desc" style="color:rgba(200,200,200,.9);line-height:1.6;margin-bottom:16px">
        ${sd.desc}
      </div>
      ${sd.narrative?.enter ? `
        <div class="mqn-scene" style="background:rgba(0,0,0,.3);padding:12px;border-radius:8px;margin-bottom:16px">
          <div style="color:#d0b870;font-size:12px;margin-bottom:8px">📍 ${sd.narrative.enter.scene}</div>
          ${sd.narrative.enter.lines.map(line => `<div style="color:rgba(255,255,255,.8);margin:4px 0;padding-left:12px;border-left:2px solid rgba(128,216,255,.3)">${line}</div>`).join('')}
        </div>
      ` : ''}
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">稍后再来</button>
        <button class="mqn-btn mqn-btn-panel" onclick="enterStoryDungeon('${dungeonId}', '${fromPage}')">🗡️ 进入地下城</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

/** 进入剧情地下城 */
function enterStoryDungeon(dungeonId, fromPage) {
  const sd = STORY_DUNGEON_DB[dungeonId];
  if (!sd) return;
  
  // 保存当前状态
  sessionStorage.setItem('dungeon_from_page', fromPage || 'town.html');
  sessionStorage.setItem('story_dungeon_id', dungeonId);
  
  // 跳转到地下城页面
  window.location.href = 'dungeon.html?story=1';
}

// ════════════════════════════════════════════════════
//  导出
// ════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STORY_DUNGEON_DB, STORY_DUNGEON_TYPE };
}
