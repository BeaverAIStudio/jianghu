// ═══════════════════════════════════════════════════════════════
//  jianghu.js  —  江湖系统：具名NPC · 关系网 · 声望 · 恩仇录
// ═══════════════════════════════════════════════════════════════

// ── 阵营常量 ──
const FACTION = {
  ZHENGDAO : 'zhengdao',   // 正道
  XIEDAO   : 'xiedao',     // 邪道
  ZHONGLI  : 'zhongli',    // 中立
  CHAOTING : 'chaoting',   // 朝廷
};

// ── 关系类型 ──
const REL_TYPE = {
  STRANGER : 'stranger',
  FRIEND   : 'friend',
  BROTHER  : 'brother',   // 义兄弟
  RIVAL    : 'rival',     // 对头（有竞争无深仇）
  ENEMY    : 'enemy',     // 仇敌
  LOVER    : 'lover',     // 情缘
  TEACHER  : 'teacher',   // 师父
  STUDENT  : 'student',   // 弟子
};

// ════════════════════════════════════════════════════════════════
//  一、具名NPC数据库  JIANGHU_NPC_DB
//  字段说明：
//    id          唯一标识
//    name        姓名
//    title       江湖称号
//    sect        所属门派（对应 SECTS[].id）
//    faction     阵营
//    gender      male/female
//    age         年龄
//    avatar      头像emoji
//    locations   常驻/游走地点数组（第一个为主要地点）
//    personality 性格标签数组
//    background  人物背景（对玩家可见）
//    secret      隐藏秘密（触发条件后揭示）
//    greetings   初次见面台词池
//    dialogs     对话选项数组
//    initRel     对玩家的初始关系值（按阵营）
//    npcRelations 与其他NPC的关系（构成关系网）
//    quests      可触发的任务id数组
// ════════════════════════════════════════════════════════════════
const JIANGHU_NPC_DB = {

  // ── 1. 云霄剑 · 裴长风（华山派掌门师兄，正道领袖）──
  npc_pei_changfeng: {
    id: 'npc_pei_changfeng',
    name: '裴长风',
    title: '云霄一剑',
    sect: 'huashan',
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 42,
    avatar: '⚔️',
    locations: ['huayin', 'luoyang', 'kaifeng'],
    personality: ['刚直', '重诺', '寡言'],
    background: '华山派首席弟子，剑法出神入化，人称"云霄一剑"。二十年前曾只身闯入日月神教护送一名孤儿出来，此后与神教结下死仇。为人正派但不善变通，对邪道人士毫不留情。',
    secret: '当年护送的孤儿正是日月神教少主，此事至今无人知晓。',
    greetings: [
      '华山裴长风。你是什么来路？',
      '剑道一途，非有大毅力者不可入。你练剑几年了？',
      '最近江湖不太平，日月神教的人四处活动，你小心些。',
    ],
    dialogs: [
      { id:'d_pei_01', text:'请教剑法心得', minRel:0,
        reply:'剑法无他，唯快、准、狠三字。但真正的剑道，在于"意"——意到剑到，意不动则剑不出。',
        relDelta:3 },
      { id:'d_pei_02', text:'问他和日月神教的过节', minRel:20,
        reply:'（眼神一冷）旧事不提。你只需知道，只要我裴长风在一日，神教就别想在中原横行。',
        relDelta:5 },
      { id:'d_pei_03', text:'请求切磋（关系≥50）', minRel:50,
        reply:'好。接我三剑，若能接住，算你有资格和我谈剑道。',
        relDelta:15, action:'duel_pei' },
      { id:'d_pei_04', text:'打听武林近况', minRel:10,
        reply:'《天机令》的事你听说了吗？据说持令者可号令半个江湖，几大势力都在暗中争夺，这次怕是腥风血雨。',
        relDelta:2, intelId:'intel_tianji_ling' },
    ],
    initRel: { zhengdao: 15, zhongli: 0, xiedao: -30, chaoting: 5 },
    npcRelations: {
      npc_leng_yuesha:  { val: -80, type: REL_TYPE.ENEMY,   note: '血海深仇，神教杀其师父' },
      npc_su_qinghe:    { val:  60, type: REL_TYPE.FRIEND,  note: '多年好友，惺惺相惜' },
      npc_wu_santong:   { val:  40, type: REL_TYPE.FRIEND,  note: '同为正道，守望相助' },
      npc_bai_luochen:  { val: -20, type: REL_TYPE.RIVAL,   note: '理念不同，时有争执' },
      npc_qin_xiaoman:  { val:  30, type: REL_TYPE.FRIEND,  note: '赏识其才华，暗中照拂' },
    },
    quests: ['jh_quest_escort_letter', 'jh_quest_recover_sword'],
  },

  // ── 2. 冷月杀 · 冷月纱（日月神教圣女，亦正亦邪）──
  npc_leng_yuesha: {
    id: 'npc_leng_yuesha',
    name: '冷月纱',
    title: '神教圣女',
    sect: 'riyue',
    faction: FACTION.XIEDAO,
    gender: 'female',
    age: 24,
    avatar: '🌙',
    locations: ['yinzhou', 'luoyang', 'kaifeng'],
    personality: ['冷艳', '心思深沉', '重情义'],
    background: '日月神教圣女，冰魄神功已臻化境。表面冷漠无情，实则心中自有一把尺。曾因一件旧事对正道大侠裴长风怀有复杂情感——仇？恩？她自己也说不清。',
    secret: '其实并不认同神教教主的野心，正在秘密寻找一样东西，想要彻底改变神教的命运。',
    greetings: [
      '（审视你片刻）你不像寻常武人，有点意思。',
      '你来这里，是奉谁之命？还是只是路过？',
      '神教的事，不劳外人操心。',
    ],
    dialogs: [
      { id:'d_leng_01', text:'问她神教的事', minRel:0,
        reply:'神教乃是圣洁之地，外人所见皆是误解。（停顿）但你若真心想了解……或许可以给你一个机会。',
        relDelta:5 },
      { id:'d_leng_02', text:'问她与裴长风的过节', minRel:30,
        reply:'（冷冷一笑）裴长风？他和我师门之间的恩怨，三天三夜说不完。你不必管。',
        relDelta:3 },
      { id:'d_leng_03', text:'说她其实是好人（关系≥60）', minRel:60,
        reply:'（愣了一下，随即转过头）……你胡说什么。',
        relDelta:20 },
      { id:'d_leng_04', text:'请她指点冰魄功', minRel:40,
        reply:'你的内力根基还算扎实。伸出手，我教你如何凝练寒气。',
        relDelta:10, action:'learn_ice_skill' },
    ],
    initRel: { zhengdao: -20, zhongli: 10, xiedao: 20, chaoting: -30 },
    npcRelations: {
      npc_pei_changfeng: { val: -80, type: REL_TYPE.ENEMY,   note: '世仇，但内心有挣扎' },
      npc_xu_muyun:      { val:  50, type: REL_TYPE.FRIEND,  note: '神教中少数真心朋友' },
      npc_he_yisheng:    { val:  40, type: REL_TYPE.FRIEND,  note: '曾救过他的命' },
      npc_bai_luochen:   { val: -10, type: REL_TYPE.RIVAL,   note: '立场相近，却相互提防' },
    },
    quests: ['jh_quest_secret_mission', 'jh_quest_find_relic'],
  },

  // ── 3. 醉侠 · 吴三通（丐帮帮主，豪迈义气）──
  npc_wu_santong: {
    id: 'npc_wu_santong',
    name: '吴三通',
    title: '醉侠帮主',
    sect: 'tiandibang',
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 55,
    avatar: '🍺',
    locations: ['cangzhou', 'xuzhou', 'yangzhou', 'kaifeng'],
    personality: ['豪爽', '好酒', '重义'],
    background: '天地帮帮主，人称"醉侠"。走遍大江南北，帮中弟子遍及各城。最爱喝酒，越喝越清醒，天下好汉喝三碗酒便可结为朋友。消息极为灵通，江湖上没有他不知道的事。',
    secret: '年轻时曾是官府捕快，因一件冤案离开，至今对朝廷既恨且念。',
    greetings: [
      '哈哈！好汉，一起喝一碗？',
      '走南闯北这么多年，就服两种人：真侠客，和会喝酒的。你是哪种？',
      '消息？老吴什么消息都有，就看你出得起价钱不。',
    ],
    dialogs: [
      { id:'d_wu_01', text:'和他喝酒（5两）', minRel:0,
        reply:'（举碗）来！江湖儿女，不醉不归！（你们喝了个痛快，他话也多了起来）',
        relDelta:20, action:'drink_with_wu' },
      { id:'d_wu_02', text:'打探江湖消息（10两）', minRel:10,
        reply:'（压低声音）最近北边草原上的鹰隼帮和天龙帮起了冲突，听说是为了抢一张藏宝图……你要知道详情，得再加钱。',
        relDelta:5, action:'buy_intel_wu', intelId:'intel_treasure_war' },
      { id:'d_wu_03', text:'请他帮个忙（关系≥50）', minRel:50,
        reply:'哈！有什么事直说，老吴帮得上的，绝不含糊。帮不上的……老吴也会给你出主意！',
        relDelta:10, action:'wu_help' },
      { id:'d_wu_04', text:'问他有没有任务', minRel:20,
        reply:'正好，帮里有个兄弟在沧州失踪了，你若顺路，帮忙查查？有重谢。',
        relDelta:5, questId:'jh_quest_find_brother' },
    ],
    initRel: { zhengdao: 20, zhongli: 15, xiedao: -5, chaoting: -10 },
    npcRelations: {
      npc_pei_changfeng:  { val:  40, type: REL_TYPE.FRIEND,  note: '同道中人，常相往来' },
      npc_qin_xiaoman:    { val:  55, type: REL_TYPE.FRIEND,  note: '视如晚辈，多有照顾' },
      npc_zhao_wuji:      { val: -30, type: REL_TYPE.RIVAL,   note: '争夺漕运地盘' },
      npc_he_yisheng:     { val:  70, type: REL_TYPE.FRIEND,  note: '铁杆老友，相识二十年' },
    },
    quests: ['jh_quest_find_brother', 'jh_quest_secret_cargo'],
  },

  // ── 4. 毒手医仙 · 何以生（游医，亦正亦邪）──
  npc_he_yisheng: {
    id: 'npc_he_yisheng',
    name: '何以生',
    title: '毒手医仙',
    sect: 'wudu',
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 48,
    avatar: '🌿',
    locations: ['chengdu', 'dali', 'changsha', 'hangzhou'],
    personality: ['玩世不恭', '心善', '话多'],
    background: '江湖游医，出身五毒教却反感教中阴谋，独自游历天下行医救人。手中既有毒也有药，他说"医者知毒，方能解毒"。收费标准奇特：富人多收，穷人少收，好人不收。',
    secret: '身上带着五毒教一件秘密要物，被教中人追杀，却始终不肯交出。',
    greetings: [
      '哎，看你面色，近来睡眠不好？让我把把脉。',
      '我是游医，也是游侠。游来游去，游到这里了。',
      '有伤？中毒？还是心病？心病最难治，但老何也会。',
    ],
    dialogs: [
      { id:'d_he_01', text:'请他看诊', minRel:0,
        reply:'伸出手。（把脉片刻）内力紊乱，最近战斗太多。给你几粒养元丹，记得早睡。',
        relDelta:10, action:'he_diagnose' },
      { id:'d_he_02', text:'向他学解毒之法', minRel:30,
        reply:'想学？先告诉我，你学了是救人还是害人？（若选救人）那行，我教你基础解毒心法。',
        relDelta:15, action:'learn_detox' },
      { id:'d_he_03', text:'问他为何离开五毒教', minRel:40,
        reply:'（苦笑）那帮人，把毒用在江湖仇杀上，哪有用在治病救人上。我不屑。',
        relDelta:8 },
      { id:'d_he_04', text:'帮他一个忙（关系≥50）', minRel:50,
        reply:'（压低声音）五毒教的人在追我，我有一样东西需要秘密转交，你敢接这差事吗？',
        relDelta:20, questId:'jh_quest_secret_delivery' },
    ],
    initRel: { zhengdao: 10, zhongli: 20, xiedao: 5, chaoting: -5 },
    npcRelations: {
      npc_wu_santong:    { val:  70, type: REL_TYPE.FRIEND,  note: '铁杆老友' },
      npc_leng_yuesha:   { val:  40, type: REL_TYPE.FRIEND,  note: '她救过他，他医过她' },
      npc_lan_ruoxue:    { val:  60, type: REL_TYPE.FRIEND,  note: '互相仰慕，却各有难言之隐' },
      npc_zhao_wuji:     { val: -40, type: REL_TYPE.ENEMY,   note: '赵武极曾陷害他师父' },
    },
    quests: ['jh_quest_secret_delivery', 'jh_quest_rare_poison'],
  },

  // ── 5. 铁算盘 · 赵武极（漕运黑帮大佬，腹黑权谋）──
  npc_zhao_wuji: {
    id: 'npc_zhao_wuji',
    name: '赵武极',
    title: '铁算盘',
    sect: 'tianlong',
    faction: FACTION.XIEDAO,
    gender: 'male',
    age: 50,
    avatar: '🎰',
    locations: ['yangzhou', 'nanjing', 'xuzhou'],
    personality: ['工于心计', '面善心狠', '贪财'],
    background: '天龙帮幕后掌权者，控制着扬州到金陵一带的漕运和赌场。表面是个富商，实则手中握着数百条人命。擅长以利益诱人、以把柄制人。江湖上对他又恨又怕。',
    secret: '曾伪造证据陷害何以生的师父，导致其含冤入狱。此事知情者极少。',
    greetings: [
      '（皮笑肉不笑）哟，新面孔，做什么买卖的？',
      '江湖上做事，要么有用，要么有钱。你是哪样？',
      '赵某人从不白帮人，你有什么可以拿出来交换？',
    ],
    dialogs: [
      { id:'d_zhao_01', text:'打探漕运情报', minRel:0,
        reply:'消息嘛，自然有。不过天下没有免费的消息，你出得起多少？',
        relDelta:0, action:'buy_intel_zhao' },
      { id:'d_zhao_02', text:'接他的任务', minRel:10,
        reply:'（递过来一封信）把这封信送到金陵，不要拆开，不要问内容。事成之后，三百两。',
        relDelta:5, questId:'jh_quest_blind_delivery' },
      { id:'d_zhao_03', text:'揭穿他的阴谋（关系≥60）', minRel:60,
        reply:'（表情一变，随即恢复平静）你知道的太多了……这很危险。',
        relDelta:-30, action:'zhao_threat' },
    ],
    initRel: { zhengdao: -20, zhongli: 0, xiedao: 20, chaoting: 10 },
    npcRelations: {
      npc_wu_santong:    { val: -30, type: REL_TYPE.RIVAL,   note: '漕运地盘争夺' },
      npc_he_yisheng:    { val: -40, type: REL_TYPE.ENEMY,   note: '陷害过何以生师父' },
      npc_qin_xiaoman:   { val: -50, type: REL_TYPE.ENEMY,   note: '秦小满曾破坏他一笔大生意' },
      npc_xu_muyun:      { val:  20, type: REL_TYPE.FRIEND,  note: '利益往来，互相利用' },
    },
    quests: ['jh_quest_blind_delivery', 'jh_quest_collect_debt'],
  },

  // ── 6. 天山飞燕 · 秦小满（逍遥派传人，活泼跳脱）──
  npc_qin_xiaoman: {
    id: 'npc_qin_xiaoman',
    name: '秦小满',
    title: '天山飞燕',
    sect: 'xiaoyao',
    faction: FACTION.ZHONGLI,
    gender: 'female',
    age: 22,
    avatar: '🦋',
    locations: ['litang', 'xining', 'lanzhou', 'kaifeng'],
    personality: ['开朗', '古灵精怪', '刀子嘴豆腐心'],
    background: '逍遥派天赋最高的弟子，轻功绝世。性格跳脱，不拘礼法，喜欢四处游历找麻烦……呃，找乐子。表面上什么都不在乎，其实心里装着整个江湖。',
    secret: '正在秘密寻找一件与逍遥派创派祖师有关的遗物，找到后门派才能真正中兴。',
    greetings: [
      '哇，你长得还行！交个朋友嘛？',
      '无聊无聊，这地方有什么好玩的，你知道吗？',
      '我在找一样东西，你有没有见过一块刻着星图的玉牌？',
    ],
    dialogs: [
      { id:'d_qin_01', text:'和她聊旅行见闻', minRel:0,
        reply:'你去过大漠吗？我上个月刚从玉门关回来，沙漠里的日落……哎哎哎，你有没有在认真听我说话！',
        relDelta:10 },
      { id:'d_qin_02', text:'请教轻功心法', minRel:25,
        reply:'轻功嘛，关键不在力气，在于"借"字——借风、借树、借一切可借之物。（随手一跃，踩着树梢转了一圈）你试试？',
        relDelta:10, action:'learn_qinggong' },
      { id:'d_qin_03', text:'帮她找星图玉牌', minRel:40,
        reply:'你愿意帮我？！那……那太好了！（眼睛一亮）据说这玉牌在某个山洞里，具体位置我还在查，你先等我消息。',
        relDelta:25, questId:'jh_quest_star_jade' },
      { id:'d_qin_04', text:'取笑她（关系≥30）', minRel:30,
        reply:'（跳起来）你！你再说一遍！……（憋着笑）好吧，说得对，我确实有点傻乎乎的。',
        relDelta:8 },
    ],
    initRel: { zhengdao: 10, zhongli: 20, xiedao: -5, chaoting: -5 },
    npcRelations: {
      npc_pei_changfeng: { val:  30, type: REL_TYPE.FRIEND,  note: '正道前辈，有些敬佩' },
      npc_wu_santong:    { val:  55, type: REL_TYPE.FRIEND,  note: '吴叔对她很好' },
      npc_zhao_wuji:     { val: -50, type: REL_TYPE.ENEMY,   note: '拆过他生意，他怀恨在心' },
      npc_su_qinghe:     { val:  35, type: REL_TYPE.FRIEND,  note: '偶尔会一起下棋' },
      npc_bai_luochen:   { val:  20, type: REL_TYPE.RIVAL,   note: '互相看不顺眼又互相欣赏' },
    },
    quests: ['jh_quest_star_jade', 'jh_quest_chase_thief'],
  },

  // ── 7. 玄机先生 · 苏清河（谋士/隐居高人，博学多才）──
  npc_su_qinghe: {
    id: 'npc_su_qinghe',
    name: '苏清河',
    title: '玄机先生',
    sect: 'guigu',
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 60,
    avatar: '📜',
    locations: ['luoyang', 'nanjing', 'hangzhou'],
    personality: ['睿智', '淡泊', '惜才'],
    background: '鬼谷门传人，当年曾在朝廷做过谋士，后因看透官场险恶而归隐。江湖人称"玄机先生"，凡遇大事必找他问计。擅长奇门遁甲，能观星辨凶吉，算到的事十有八九准确。',
    secret: '手中握有一张预言未来十年江湖走势的"天机图"，但他从未示人。',
    greetings: [
      '（不抬头，继续摆弄棋局）坐。我知道你来干什么。',
      '人生如棋，落子无悔。你近来是否面临一个难以抉择的局面？',
      '老夫观天象，近日将有大变。你此番来得正是时候。',
    ],
    dialogs: [
      { id:'d_su_01', text:'请他指点迷津', minRel:0,
        reply:'（沉吟片刻）你现在面临的困境，根源在于……你尚未想清楚自己究竟想要什么。想清楚了，路自然就有了。',
        relDelta:8 },
      { id:'d_su_02', text:'向他学习谋略', minRel:30,
        reply:'兵法韬略，非一日之功。不过老夫可以先教你一事：观人。人心看透了，局便破了。',
        relDelta:12, action:'learn_strategy' },
      { id:'d_su_03', text:'问他天机图的事（关系≥70）', minRel:70,
        reply:'（沉默良久）……你是第几个问我这个的？（叹气）你不是寻常人，罢了，让你看一眼。',
        relDelta:30, action:'view_tianji_map' },
      { id:'d_su_04', text:'请他算一卦', minRel:15,
        reply:'（闭目掐算）你近期有一场恶战，胜负各半。记住：不可独行，须得一助力。',
        relDelta:5, action:'fortune_telling' },
    ],
    initRel: { zhengdao: 15, zhongli: 25, xiedao: 5, chaoting: -10 },
    npcRelations: {
      npc_pei_changfeng: { val:  60, type: REL_TYPE.FRIEND,  note: '多年知己' },
      npc_qin_xiaoman:   { val:  35, type: REL_TYPE.FRIEND,  note: '下棋的棋友' },
      npc_xu_muyun:      { val:  20, type: REL_TYPE.RIVAL,   note: '棋逢对手，暗中较劲' },
      npc_bai_luochen:   { val: -25, type: REL_TYPE.RIVAL,   note: '理念相悖' },
    },
    quests: ['jh_quest_tianji_clue', 'jh_quest_chess_duel'],
  },

  // ── 8. 白衣罗刹 · 白落尘（魔教杀手，身份成谜）──
  npc_bai_luochen: {
    id: 'npc_bai_luochen',
    name: '白落尘',
    title: '白衣罗刹',
    sect: 'xuanming',
    faction: FACTION.XIEDAO,
    gender: 'male',
    age: 35,
    avatar: '🗡️',
    locations: ['datong', 'yanmen', 'jinyang'],
    personality: ['冷漠', '自负', '不择手段'],
    background: '玄冥教顶尖杀手，人称"白衣罗刹"。从不言笑，每次出现必有人死。武功路数诡异难测，据说融合了多门绝学。有人说他并非本性凶残，只是被什么东西困住了。',
    secret: '身负一道奇特内伤，只有何以生手中的解药才能根治，但他宁死也不肯开口求人。',
    greetings: [
      '（看都不看你一眼）你最好有正经事，不然别浪费彼此时间。',
      '我接了你的命？（停顿）……没有，那就没什么好说的。',
      '江湖上太多废话了。',
    ],
    dialogs: [
      { id:'d_bai_01', text:'问他是否接了对自己的刺杀', minRel:-30,
        reply:'（沉默三秒）若接了，你已经死了。',
        relDelta:5 },
      { id:'d_bai_02', text:'问他内伤的事（关系≥40）', minRel:40,
        reply:'（身体微微一僵）……谁告诉你的？（眼神危险）你最好不要到处乱说。',
        relDelta:10 },
      { id:'d_bai_03', text:'帮他找解药（关系≥60）', minRel:60,
        reply:'（沉默很久）……为什么。（又沉默）你要什么回报。（再沉默）……谢谢。',
        relDelta:40, questId:'jh_quest_bai_medicine' },
      { id:'d_bai_04', text:'挑衅他', minRel:0,
        reply:'（抬眼看你，眼神如刀）再说一遍？',
        relDelta:-20 },
    ],
    initRel: { zhengdao: -30, zhongli: -5, xiedao: 10, chaoting: -20 },
    npcRelations: {
      npc_pei_changfeng: { val: -20, type: REL_TYPE.RIVAL,   note: '曾数次交手，不分胜负' },
      npc_leng_yuesha:   { val: -10, type: REL_TYPE.RIVAL,   note: '同属黑道，互相提防' },
      npc_su_qinghe:     { val: -25, type: REL_TYPE.RIVAL,   note: '苏清河曾破坏他的刺杀任务' },
      npc_qin_xiaoman:   { val:  20, type: REL_TYPE.RIVAL,   note: '某种奇怪的互相欣赏' },
      npc_he_yisheng:    { val:  15, type: REL_TYPE.FRIEND,  note: '唯一能解他内伤的人' },
    },
    quests: ['jh_quest_bai_medicine'],
  },

  // ── 9. 云中鹤 · 徐慕云（商人+情报贩，中立游走）──
  npc_xu_muyun: {
    id: 'npc_xu_muyun',
    name: '徐慕云',
    title: '云中鹤',
    sect: null,
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 38,
    avatar: '🦅',
    locations: ['yangzhou', 'luoyang', 'xian', 'nanjing', 'youzhou'],
    personality: ['精明', '圆滑', '义气（只对朋友）'],
    background: '无门无派，走南闯北的信息贩子和大商人。各方势力都买他的情报，各方势力他也都惹不起。人称"云中鹤"，意为高飞不落地，谁都抓不住。消息比官府还灵通。',
    secret: '其实是某个已解散秘密组织的最后一名成员，手中保管着组织的全部档案。',
    greetings: [
      '（招手）嘿！来来来，有笔好买卖！',
      '各大门派的消息、朝廷的动向、江湖上的秘辛……你想要哪种？',
      '我这人原则只有一个：钱到消息到。',
    ],
    dialogs: [
      { id:'d_xu_01', text:'购买江湖情报（按档收费）', minRel:0,
        reply:'（摊开手）一档消息五两，二档十五两，三档……三档你买不起。',
        relDelta:3, action:'buy_intel_tiered' },
      { id:'d_xu_02', text:'用消息换消息', minRel:30,
        reply:'哦？你有什么独家消息？说来听听，若值钱，咱们换。',
        relDelta:8, action:'trade_intel' },
      { id:'d_xu_03', text:'问他秘密组织的事（关系≥80）', minRel:80,
        reply:'（表情骤变）……你从哪里听说的？（长时间沉默）……算了，是时候了。跟我来，我有样东西要给你看。',
        relDelta:30, action:'xu_secret_reveal' },
      { id:'d_xu_04', text:'让他帮忙打探某人下落', minRel:20,
        reply:'查人？没问题，给我三天时间，再给我二十两，我告诉你他昨晚在哪睡觉。',
        relDelta:5, action:'xu_find_person' },
    ],
    initRel: { zhengdao: 5, zhongli: 20, xiedao: 5, chaoting: 5 },
    npcRelations: {
      npc_leng_yuesha:   { val:  50, type: REL_TYPE.FRIEND,  note: '神教圣女，关系复杂微妙' },
      npc_zhao_wuji:     { val:  20, type: REL_TYPE.FRIEND,  note: '互相利用，保持距离' },
      npc_su_qinghe:     { val:  20, type: REL_TYPE.RIVAL,   note: '棋逢对手' },
      npc_wu_santong:    { val:  35, type: REL_TYPE.FRIEND,  note: '酒友，偶尔互通消息' },
    },
    quests: ['jh_quest_intel_chain', 'jh_quest_lost_letter'],
  },

  // ── 10. 苗疆蛊后 · 蓝若雪（五毒传人，神秘）──
  npc_lan_ruoxue: {
    id: 'npc_lan_ruoxue',
    name: '蓝若雪',
    title: '蛊后',
    sect: 'wudu',
    faction: FACTION.ZHONGLI,
    gender: 'female',
    age: 28,
    avatar: '🦋',
    locations: ['wudu_miao', 'dali', 'guiyang'],
    personality: ['神秘', '温柔', '执念深'],
    background: '苗疆五毒教圣女，精通蛊术和草药。与何以生亦敌亦友，两人常为医毒之道辩论。她认为毒与药本是一体，关键在用心。苗疆深处有她守护的一片圣地，外人轻易不得踏入。',
    secret: '正在培育一种能解天下所有毒的"百解蛊"，成功之日便是她离开五毒教之时。',
    greetings: [
      '你的眼睛很特别，进了苗疆，说明命不该绝。',
      '（有蝴蝶停在她肩上）这是我的使者，它告诉我你来了。',
      '苗疆的规矩，外人进来须得报上名来。',
    ],
    dialogs: [
      { id:'d_lan_01', text:'问她蛊术的事', minRel:0,
        reply:'蛊术非巫，是人与自然的契约。每一只蛊都有灵性，强迫不得，只能以心相通。',
        relDelta:6 },
      { id:'d_lan_02', text:'请她解毒', minRel:10,
        reply:'（仔细查看你）寒毒？火毒？……普通毒素。我替你解了，但你欠我一个人情。',
        relDelta:15, action:'lan_detox' },
      { id:'d_lan_03', text:'帮她寻找百解蛊原料', minRel:35,
        reply:'（眼神一亮）你愿意帮我？……（沉默片刻）好，我需要三样东西，缺一不可。',
        relDelta:20, questId:'jh_quest_baijie_gu' },
      { id:'d_lan_04', text:'谈谈对毒与药的看法（关系≥50）', minRel:50,
        reply:'（认真听完你说的）……你和大多数外人不同。也许，苗疆的大门可以为你多开一道缝。',
        relDelta:15 },
    ],
    initRel: { zhengdao: 0, zhongli: 20, xiedao: 5, chaoting: -15 },
    npcRelations: {
      npc_he_yisheng:    { val:  60, type: REL_TYPE.FRIEND,  note: '亦友亦对手，互相欣赏' },
      npc_leng_yuesha:   { val:  25, type: REL_TYPE.FRIEND,  note: '同为女子行走江湖，有惺惺相惜之感' },
      npc_zhao_wuji:     { val: -35, type: REL_TYPE.ENEMY,   note: '曾试图利用蛊术控制她' },
    },
    quests: ['jh_quest_baijie_gu', 'jh_quest_miao_herb'],
  },

  // ── 11. 铁笔判官 · 孟秋白（朝廷捕头，执法严苛）──
  npc_meng_qiubai: {
    id: 'npc_meng_qiubai',
    name: '孟秋白',
    title: '铁笔判官',
    sect: null,
    faction: FACTION.CHAOTING,
    gender: 'male',
    age: 45,
    avatar: '⚖️',
    locations: ['kaifeng', 'luoyang', 'youzhou', 'xian'],
    personality: ['铁面无私', '认死理', '暗藏柔情'],
    background: '六扇门首席捕头，人称"铁笔判官"。判过的案从不翻，抓过的人从不逃。武功不是最高，但追人的手段天下第一。对江湖好汉不排斥，但对违法乱纪零容忍。',
    secret: '有一个亲弟弟混入了江湖黑道，他知道却一直没有抓，这是他心中最大的刺。',
    greetings: [
      '六扇门孟秋白，你的来历我已查过，有几个问题想请教。',
      '江湖人行事，也要讲个理字。你说是不是？',
      '我不管你是哪派的，律法之前，一律平等。',
    ],
    dialogs: [
      { id:'d_meng_01', text:'主动配合问话', minRel:0,
        reply:'（满意地点头）你比大多数江湖人讲理。我也不为难你——但若你知道某些事，希望告知本官。',
        relDelta:12 },
      { id:'d_meng_02', text:'向他举报恶人', minRel:15,
        reply:'（掏出纸笔）说，本官一一记下。证据确凿者，三日内必行动。',
        relDelta:10, action:'meng_report' },
      { id:'d_meng_03', text:'问他弟弟的事（关系≥60）', minRel:60,
        reply:'（沉默很久，手紧握）……你怎么知道这事。（叹气）他不是坏人，只是走错了路。我……我不知道该怎么办。',
        relDelta:25 },
      { id:'d_meng_04', text:'请他对某件案子睁一只眼闭一只眼', minRel:0,
        reply:'（眼神一冷）你在跟本官说什么？',
        relDelta:-20 },
    ],
    initRel: { zhengdao: 15, zhongli: 5, xiedao: -40, chaoting: 30 },
    npcRelations: {
      npc_pei_changfeng: { val:  30, type: REL_TYPE.FRIEND,  note: '相互尊重，偶有协作' },
      npc_zhao_wuji:     { val: -35, type: REL_TYPE.ENEMY,   note: '一直在查他，苦无证据' },
      npc_wu_santong:    { val: -10, type: REL_TYPE.RIVAL,   note: '丐帮游走法外，他不太认可' },
    },
    quests: ['jh_quest_arrest_warrant', 'jh_quest_meng_brother'],
  },

  // ── 12. 琴魔 · 姜凌波（音律高手，居无定所）──
  npc_jiang_lingbo: {
    id: 'npc_jiang_lingbo',
    name: '姜凌波',
    title: '琴魔',
    sect: 'lingxiao',
    faction: FACTION.ZHONGLI,
    gender: 'female',
    age: 30,
    avatar: '🎵',
    locations: ['hangzhou', 'suzhou', 'yangzhou', 'nanjing'],
    personality: ['超然物外', '情感丰富', '偶尔癫狂'],
    background: '凌霄阁首席弟子，以琴入武，音律至极可伤人于无形。江湖人皆知她琴声如魔，听之者心旌摇荡，或喜或悲不能自控。她游遍名山大川，只为寻一知音。',
    secret: '曾深爱一人，此人背叛了她，从此她只肯以音律待人，再不肯付出真心。但玩家能够打开她的心。',
    greetings: [
      '（指间拂弦，抬眼）你能听出这曲子的名字吗？',
      '我只与懂音律的人说话，你懂音律吗？',
      '世间最难奏的曲子，不是技法高超的——是让人落泪的那种。',
    ],
    dialogs: [
      { id:'d_jiang_01', text:'请她奏一曲', minRel:0,
        reply:'（轻轻点头，手指落下，一曲如清泉潺潺）……你适合听这个。',
        relDelta:10, action:'jiang_play_music' },
      { id:'d_jiang_02', text:'讲一个亲身经历的故事', minRel:20,
        reply:'（认真听，眼神渐渐柔和）……你的故事，比大多数人的都有血肉。我能把它谱成曲吗？',
        relDelta:15 },
      { id:'d_jiang_03', text:'学习琴音功', minRel:45,
        reply:'（沉默片刻）我很少教人。但你……（叹气）好吧，先学内功配合法，其余看你悟性。',
        relDelta:20, action:'learn_qin_skill' },
      { id:'d_jiang_04', text:'问她过去的那个人', minRel:70,
        reply:'（手指突然停下，好久都没有说话）……他叫什么名字不重要，重要的是……（闭眼）算了，没什么好说的。',
        relDelta:15 },
    ],
    initRel: { zhengdao: 5, zhongli: 20, xiedao: 0, chaoting: -5 },
    npcRelations: {
      npc_su_qinghe:     { val:  35, type: REL_TYPE.FRIEND,  note: '棋与琴，偶有往来' },
      npc_he_yisheng:    { val:  25, type: REL_TYPE.FRIEND,  note: '何以生医治过她的心伤' },
      npc_bai_luochen:   { val: -15, type: REL_TYPE.RIVAL,   note: '对他充满好奇和不安' },
    },
    quests: ['jh_quest_find_zhiyin', 'jh_quest_lost_score'],
  },

  // ── 13. 拳王 · 雷破天（力量型武者，快意恩仇）──
  npc_lei_potian: {
    id: 'npc_lei_potian',
    name: '雷破天',
    title: '北拳王',
    sect: 'kongtong',
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 38,
    avatar: '👊',
    locations: ['datong', 'jinyang', 'yanmen', 'cangzhou'],
    personality: ['耿直', '力量至上', '不服就打'],
    background: '崆峒派首席武僧，人称"北拳王"，力大无穷。一身横练功夫刀枪不入，拳法如山崩地裂。性情耿直，眼里揉不了沙子，见到不平事必然出手，常常打完才问缘由。',
    secret: '有个被人陷害入狱的师父，他正在暗中收集证据，随时准备劫狱——只要证据够了。',
    greetings: [
      '（抬头打量你）身板还行，练过？',
      '闲话少说，有事说事，没事就一起喝酒。',
      '北边的刀客越来越嚣张，本大爷正好手痒。',
    ],
    dialogs: [
      { id:'d_lei_01', text:'和他比试拳脚', minRel:0,
        reply:'哈！这才是爷们说话的方式！来！（撸袖子）输了别哭！',
        relDelta:15, action:'duel_lei' },
      { id:'d_lei_02', text:'帮他打探师父的案情', minRel:30,
        reply:'（眼神一变）……你听说了？（停顿）好，你帮我查，我认你这个兄弟。',
        relDelta:20, questId:'jh_quest_clear_name' },
      { id:'d_lei_03', text:'问他力道的秘诀', minRel:20,
        reply:'力气哪有秘诀？就是练！不过话说回来，真正的力道要跟呼吸走——吐气成拳，吸气蓄力。',
        relDelta:8, action:'learn_force_skill' },
    ],
    initRel: { zhengdao: 20, zhongli: 10, xiedao: -25, chaoting: -5 },
    npcRelations: {
      npc_wu_santong:    { val:  45, type: REL_TYPE.FRIEND,  note: '同道豪侠，酒肉朋友' },
      npc_bai_luochen:   { val: -50, type: REL_TYPE.ENEMY,   note: '白落尘曾伤他一个师弟' },
      npc_meng_qiubai:   { val: -15, type: REL_TYPE.RIVAL,   note: '对官府天生不信任' },
      npc_zhao_wuji:     { val: -45, type: REL_TYPE.ENEMY,   note: '怀疑是赵武极陷害了师父' },
    },
    quests: ['jh_quest_clear_name', 'jh_quest_border_bandits'],
  },

  // ── 14. 鬼面神算 · 温无忧（奇门遁甲大师，预言者）──
  npc_wen_wuyou: {
    id: 'npc_wen_wuyou',
    name: '温无忧',
    title: '鬼面神算',
    sect: 'guigu',
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 70,
    avatar: '🎭',
    locations: ['dunhuang', 'yumenguan', 'xining'],
    personality: ['神秘莫测', '话说半句', '实则心善'],
    background: '鬼谷门老祖，苏清河的师父。常年隐居西域，面戴奇异面具，从不以真面目示人。凡他开口，必是要紧之言，从不废话。江湖人闻其名而色变，却又无不想得到他的指点。',
    secret: '他所有预言都是真的——但他选择性地只说能改变结果的那些，沉默的预言往往是最黑暗的。',
    greetings: [
      '你来了。我算你来的时间，只差了半个时辰。',
      '（不看你）坐下，把你左手给我看。',
      '你有三劫，已过其一。',
    ],
    dialogs: [
      { id:'d_wen_01', text:'请他算命', minRel:0,
        reply:'（看手相，久久不语）……你命中有一贵人，会在你最危难时出手。但代价……（摇头）自己领悟罢。',
        relDelta:10, action:'wen_fortune' },
      { id:'d_wen_02', text:'问他三劫是什么', minRel:20,
        reply:'一劫是情，二劫是义，三劫是……（闭眼）你还没到时候听。',
        relDelta:8 },
      { id:'d_wen_03', text:'问他苏清河的事', minRel:30,
        reply:'清河这孩子，聪明过头了。总想看透全局，却不知有些局，置身其中才能破。你见到他，帮我带句话。',
        relDelta:15, action:'wen_message_su' },
      { id:'d_wen_04', text:'请他传授奇门之法（关系≥60）', minRel:60,
        reply:'你的根骨……（沉默）也罢。老夫传你一法：观气。气散则事败，气聚则事成。',
        relDelta:25, action:'learn_qimen' },
    ],
    initRel: { zhengdao: 10, zhongli: 20, xiedao: 10, chaoting: 0 },
    npcRelations: {
      npc_su_qinghe:     { val:  80, type: REL_TYPE.TEACHER, note: '师徒，已多年未见' },
      npc_bai_luochen:   { val:  30, type: REL_TYPE.FRIEND,  note: '曾为他解过一道心结' },
    },
    quests: ['jh_quest_three_trials'],
  },

  // ── 15. 大漠刀客 · 沙哈尔（西域江湖人，豪迈异域风）──
  npc_shahar: {
    id: 'npc_shahar',
    name: '沙哈尔',
    title: '大漠飞刀',
    sect: 'xixia',
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 32,
    avatar: '🏜️',
    locations: ['dunhuang', 'guizi', 'xiyu_city', 'lanzhou'],
    personality: ['豪迈', '直率', '护短'],
    background: '西夏秘宗的外门弟子，以飞刀闻名大漠。中原话说得不太流利，但义气比任何人都足。他走过的地方比大多数江湖人都多，西域诸国的秘闻他知道大半。',
    secret: '在西域某处埋藏着一批财宝，是他护镖失败的遗憾，他一直想找机会带人去取回。',
    greetings: [
      '（大声）哈！中原朋友！你吃过烤羊吗？',
      '大漠的风和中原不同，你来大漠，要换种活法。',
      '沙哈尔的刀，只砍坏人。你是好人，对不对？',
    ],
    dialogs: [
      { id:'d_sha_01', text:'和他吃烤羊（8两）', minRel:0,
        reply:'（立刻精神起来）好！你是真朋友！（烤完大嚼，话也多了）',
        relDelta:20, action:'eat_lamb' },
      { id:'d_sha_02', text:'学习飞刀技法', minRel:25,
        reply:'飞刀要稳，要准，要狠。最重要的是——心里要平。我教你第一式：定心刀。',
        relDelta:15, action:'learn_feidao' },
      { id:'d_sha_03', text:'请他带路找西域秘境', minRel:40,
        reply:'（眼睛一亮）你想去？！好！我知道三个地方，每个都有宝贝！我们一起去！',
        relDelta:20, questId:'jh_quest_desert_treasure' },
    ],
    initRel: { zhengdao: 10, zhongli: 25, xiedao: 0, chaoting: -5 },
    npcRelations: {
      npc_qin_xiaoman:   { val:  45, type: REL_TYPE.FRIEND,  note: '同样爱旅行，一见如故' },
      npc_xu_muyun:      { val:  30, type: REL_TYPE.FRIEND,  note: '商人，买过他的西域情报' },
    },
    quests: ['jh_quest_desert_treasure', 'jh_quest_lost_caravan'],
  },

  // ── 16. 幻花宫主 · 花如梦（桃花岛传人，武艺与美貌并重）──
  npc_hua_rumeng: {
    id: 'npc_hua_rumeng',
    name: '花如梦',
    title: '幻花宫主',
    sect: 'taohuadao',
    faction: FACTION.ZHONGLI,
    gender: 'female',
    age: 26,
    avatar: '🌸',
    locations: ['taohuadao', 'hangzhou', 'suzhou'],
    personality: ['柔中带刚', '喜怒无常', '对喜欢的人极好'],
    background: '桃花岛新一代岛主，武艺卓绝且美艳绝伦。掌门秘籍《碧落心法》已得真传，凡踏入桃花岛者，若无她允许皆难离开。看似轻浮，实则心思极细。',
    secret: '岛上藏着她师父留下的一道遗命，她一直在等一个人来完成它。',
    greetings: [
      '（桃花飘落）来者何人？本宫记性好，来过一次的脸都记得。',
      '桃花岛的规矩：美人下山要经本宫首肯。你是来干什么的？',
      '（一笑）你眼神不错，江湖人大多眼神太凶了。',
    ],
    dialogs: [
      { id:'d_hua_01', text:'欣赏桃花岛的风光', minRel:0,
        reply:'（轻轻笑）难得有人先看风景再看人。这份眼力，本宫记住了。',
        relDelta:12 },
      { id:'d_hua_02', text:'请教碧落心法', minRel:35,
        reply:'（上下打量你）……根骨尚可。本宫只教第一层，其余你自己悟。',
        relDelta:15, action:'learn_biluo' },
      { id:'d_hua_03', text:'问她师父的遗命', minRel:55,
        reply:'（沉默，随即看向你）……你就是师父说的那个人吗？说给我听听，你经历过什么……',
        relDelta:20, questId:'jh_quest_masters_will' },
    ],
    initRel: { zhengdao: 5, zhongli: 20, xiedao: -5, chaoting: -10 },
    npcRelations: {
      npc_jiang_lingbo:  { val:  40, type: REL_TYPE.FRIEND,  note: '琴与花，时有往来' },
      npc_lan_ruoxue:    { val:  30, type: REL_TYPE.FRIEND,  note: '两位女中豪杰，惺惺相惜' },
      npc_zhao_wuji:     { val: -40, type: REL_TYPE.ENEMY,   note: '赵武极曾派人偷岛上秘籍' },
    },
    quests: ['jh_quest_masters_will', 'jh_quest_island_intruder'],
  },

  // ── 17. 昆仑剑仙 · 岳孤云（老一辈高手，归隐）──
  npc_yue_guyun: {
    id: 'npc_yue_guyun',
    name: '岳孤云',
    title: '昆仑剑仙',
    sect: 'kunlun',
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 72,
    avatar: '☁️',
    locations: ['litang', 'xining', 'hetian'],
    personality: ['超然', '话少但字字千金', '看透生死'],
    background: '上一代江湖第一剑客，如今归隐昆仑。三十年前的武林盟主，亲历了那个时代所有的腥风血雨，如今看江湖如看棋局。只有极少数人才能见到他，见到的人都会有大机缘。',
    secret: '三十年前被迫做过一件违心之事，至今是他心中的痛。若玩家声望足够高，他会坦白一切并请求帮助弥补。',
    greetings: [
      '（睁开眼，不说话，只是静静地看你）',
      '能找到这里来……你不是寻常人。',
      '老夫已无心江湖，但你既然来了，便说吧。',
    ],
    dialogs: [
      { id:'d_yue_01', text:'请他讲讲三十年前的江湖', minRel:0,
        reply:'（沉默许久）那是个……英雄辈出却也英雄横死的年代。想听哪段？',
        relDelta:8 },
      { id:'d_yue_02', text:'请求传授绝技（声望≥300）', minRel:30,
        reply:'（看了你很久）……你有资格。但老夫的剑法，不是传给武痴的，是传给真侠客的。你做好准备了吗？',
        relDelta:30, action:'learn_jiaxian_sword', minFame:300 },
      { id:'d_yue_03', text:'问他当年做的那件事（关系≥80）', minRel:80,
        reply:'（身体微颤）……你查到了？（长久沉默）好，是我的错，我愿承担。你愿意帮我弥补吗？',
        relDelta:40, questId:'jh_quest_old_regret' },
    ],
    initRel: { zhengdao: 20, zhongli: 10, xiedao: -20, chaoting: 0 },
    npcRelations: {
      npc_wen_wuyou:     { val:  50, type: REL_TYPE.FRIEND,  note: '老友，多年未见' },
      npc_su_qinghe:     { val:  40, type: REL_TYPE.FRIEND,  note: '当年的小辈，如今已成大才' },
      npc_pei_changfeng: { val:  35, type: REL_TYPE.FRIEND,  note: '赞赏其品行' },
    },
    quests: ['jh_quest_old_regret'],
  },

  // ── 18. 漠北狼王 · 铁木真烈（草原豪雄，异族英豪）──
  npc_tiemu_zhalie: {
    id: 'npc_tiemu_zhalie',
    name: '铁木真烈',
    title: '草原狼王',
    sect: null,
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 40,
    avatar: '🐺',
    locations: ['caoyuan', 'datong', 'yanmen'],
    personality: ['霸道', '重诺', '草原法则'],
    background: '草原最强的勇士，统领数十个部落。中原武林普遍对他有偏见，但实际上他是个重承诺讲信义的人。以战力结交朋友，认为"打过才知深浅"。若你赢过他，他便彻底尊重你。',
    secret: '中原话其实说得很好，但他故意说得磕磕绊绊，以此观察对方是否有耐心——他讨厌急躁的人。',
    greetings: [
      '（打量你）中原人。你……打过多少人？',
      '草原上说话，先打一架再说，你中原人说话先说话，很奇怪。',
      '我听说你的事，你来找我，是要战吗？',
    ],
    dialogs: [
      { id:'d_tie_01', text:'接受他的战斗考验', minRel:0,
        reply:'好！这才是草原的规矩！来！（拔出弯刀）赢了，你是我的朋友！',
        relDelta:20, action:'duel_tiemu' },
      { id:'d_tie_02', text:'学习草原骑战之法', minRel:30,
        reply:'（点头）我教你，马背上的力量，和地上不同，要与马合一。',
        relDelta:15, action:'learn_cavalry' },
      { id:'d_tie_03', text:'结为盟友', minRel:50,
        reply:'（郑重行礼）中原人，从今日起，草原是你的后盾。但你也要为我守住南边的消息。',
        relDelta:25, action:'form_alliance' },
    ],
    initRel: { zhengdao: -5, zhongli: 20, xiedao: 0, chaoting: -30 },
    npcRelations: {
      npc_meng_qiubai:   { val: -20, type: REL_TYPE.RIVAL,   note: '代表两股势力，常有摩擦' },
      npc_lei_potian:    { val:  30, type: REL_TYPE.FRIEND,  note: '同样崇尚力量，惺惺相惜' },
      npc_shahar:        { val:  50, type: REL_TYPE.FRIEND,  note: '西域同根，多有往来' },
    },
    quests: ['jh_quest_steppe_war', 'jh_quest_missing_envoy'],
  },

  // ── 19. 枯木禅师（少林高僧，渡人无数）──
  npc_kumu_chanshi: {
    id: 'npc_kumu_chanshi',
    name: '枯木禅师',
    title: '禅门活佛',
    sect: 'shaolin',
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 80,
    avatar: '☸️',
    locations: ['songshan'],
    personality: ['悲悯', '看透一切', '不轻易开口'],
    background: '少林寺辈分最高的在世武僧，一百岁以下的内功修为无人出其右。他很少说话，但每说一句都是真理。据说他能看出一个人内心的真实想法，无论你说什么他都不会轻易评判。',
    secret: '曾在少林藏经阁深处发现了一本比《易筋经》更高深的典籍，如今在等一个有缘人。',
    greetings: [
      '（念一声佛号，点头示意你坐）',
      '施主，你心中有困惑，但你自己已经知道答案了。',
      '（平静地看你）来就来了，不必说话。',
    ],
    dialogs: [
      { id:'d_ku_01', text:'礼佛（赠香火钱5两）', minRel:0,
        reply:'（微微点头）心诚则灵，施主有善根。',
        relDelta:15, action:'donate_temple' },
      { id:'d_ku_02', text:'向他倾诉心事', minRel:20,
        reply:'（静静听完）……你已经有了答案，只是需要一个人告诉你，这样想并没有错。',
        relDelta:15 },
      { id:'d_ku_03', text:'请求传授易筋经（声望≥500，阵营正道）', minRel:60,
        reply:'（从袖中取出一本破旧册子）……老僧等你等了很久了。',
        relDelta:30, action:'learn_yijinjing', minFame:500, requireFaction:'zhengdao' },
      { id:'d_ku_04', text:'问他藏经阁那本书', minRel:70,
        reply:'（沉默很久，最终点头）你该去看那本书了。（站起，示意你跟随）',
        relDelta:25, questId:'jh_quest_secret_sutra' },
    ],
    initRel: { zhengdao: 25, zhongli: 15, xiedao: -10, chaoting: 5 },
    npcRelations: {
      npc_yue_guyun:     { val:  60, type: REL_TYPE.FRIEND,  note: '老相识，相互敬重' },
      npc_wen_wuyou:     { val:  45, type: REL_TYPE.FRIEND,  note: '佛道相参，偶有论道' },
      npc_pei_changfeng: { val:  35, type: REL_TYPE.FRIEND,  note: '正道后辈中的翘楚' },
    },
    quests: ['jh_quest_secret_sutra'],
  },

  // ── 20. 无名江湖客 · 陈归尘（主线触发NPC，与玩家命运相连）──
  npc_chen_guichen: {
    id: 'npc_chen_guichen',
    name: '陈归尘',
    title: '无名客',
    sect: null,
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 30,
    avatar: '👤',
    locations: ['kaifeng', 'luoyang', 'cangzhou', 'yangzhou'],
    personality: ['沉默', '警觉', '疲惫中带着执念'],
    background: '一个看起来普普通通的江湖人，没有显赫门派，没有响亮称号。但凡接触过他的人都有奇怪的感觉——他好像知道一些别人不知道的事。他总是在赶路，像是在找什么，又像是在逃什么。',
    secret: '他是《天机令》的持有者之一，各大势力都在追杀他。他找的是另一半令牌——而另一半，或许就在玩家身上。（主线核心）',
    greetings: [
      '（警惕地看着你）……你跟来多久了？',
      '我不想惹麻烦，你也最好别跟我走太近。',
      '（喝酒，没有说话，只是偶尔抬头看你一眼）',
    ],
    dialogs: [
      { id:'d_chen_01', text:'主动打招呼', minRel:0,
        reply:'（沉默片刻）……你为什么要和我说话？',
        relDelta:5 },
      { id:'d_chen_02', text:'告诉他有人在跟踪他', minRel:0,
        reply:'（眼神骤然锐利）……你注意到了？（盯着你看）你是什么人？',
        relDelta:15, action:'chen_wary_event' },
      { id:'d_chen_03', text:'主动帮他脱险', minRel:10,
        reply:'（事后，沉默地看你良久）……我欠你一条命。陈归尘的命，是可以用的。',
        relDelta:40, questId:'jh_quest_tianji_main' },
      { id:'d_chen_04', text:'问他到底在找什么（关系≥50）', minRel:50,
        reply:'（沉默很久，最终从怀里取出半块令牌）……你见过这个吗？',
        relDelta:20, action:'tianji_ling_reveal' },
    ],
    initRel: { zhengdao: 0, zhongli: 5, xiedao: 0, chaoting: -20 },
    npcRelations: {
      npc_xu_muyun:      { val:  30, type: REL_TYPE.FRIEND,  note: '唯一知道他秘密的人' },
      npc_pei_changfeng: { val:  15, type: REL_TYPE.FRIEND,  note: '裴长风曾帮过他' },
      npc_bai_luochen:   { val: -60, type: REL_TYPE.ENEMY,   note: '白落尘接了刺杀他的任务' },
      npc_leng_yuesha:   { val: -30, type: REL_TYPE.ENEMY,   note: '神教在追杀他' },
    },
    quests: ['jh_quest_tianji_main'],
  },

};

// ════════════════════════════════════════════════════════════════
//  二、NPC关系网总览  JIANGHU_RELATION_MAP
//  用于快速查询"帮助A会影响B的态度"
// ════════════════════════════════════════════════════════════════
const JIANGHU_RELATION_MAP = (function(){
  const map = {};
  Object.values(JIANGHU_NPC_DB).forEach(npc => {
    map[npc.id] = {};
    if(npc.npcRelations){
      Object.entries(npc.npcRelations).forEach(([targetId, rel]) => {
        map[npc.id][targetId] = rel;
      });
    }
  });
  return map;
})();

// ════════════════════════════════════════════════════════════════
//  三、声望系统
// ════════════════════════════════════════════════════════════════
const REPUTATION_TITLES = [
  // [minFame, minAlign, maxAlign, title]
  { minFame:0,    align:[60,100],  title:'仁义新丁' },
  { minFame:0,    align:[-60,60],  title:'过路江湖客' },
  { minFame:0,    align:[-100,-60],title:'街头混混' },
  { minFame:100,  align:[60,100],  title:'义薄云天' },
  { minFame:100,  align:[-60,60],  title:'江湖游侠' },
  { minFame:100,  align:[-100,-60],title:'惯匪悍贼' },
  { minFame:300,  align:[60,100],  title:'一方名侠' },
  { minFame:300,  align:[-60,60],  title:'江湖豪客' },
  { minFame:300,  align:[-100,-60],title:'一方霸主' },
  { minFame:600,  align:[60,100],  title:'武林楷模' },
  { minFame:600,  align:[-60,60],  title:'江湖传说' },
  { minFame:600,  align:[-100,-60],title:'武林毒瘤' },
  { minFame:1000, align:[60,100],  title:'一代大侠' },
  { minFame:1000, align:[-60,60],  title:'江湖奇人' },
  { minFame:1000, align:[-100,-60],title:'一代枭雄' },
];

function getReputationTitle(fame, align){
  const tiers = REPUTATION_TITLES.filter(t => fame >= t.minFame);
  if(!tiers.length) return '过路江湖客';
  let best = tiers[0];
  tiers.forEach(t => {
    if(t.minFame >= best.minFame){
      if(align >= t.align[0] && align < t.align[1]) best = t;
    }
  });
  return best.title;
}

// ════════════════════════════════════════════════════════════════
//  四、江湖状态 + 持久化
// ════════════════════════════════════════════════════════════════
const JIANGHU_STATE_KEY = 'wuxia_jianghu_state';

let jianghuState = {
  // 玩家↔NPC 关系（升级版）
  npcRels: {},
  /*
    'npc_pei_changfeng': {
      val: 0,          // -100~100
      type: 'stranger',
      encounters: 0,   // 见过几次
      note: '',        // 最近一次交往备注
      debt: 0,         // 我欠他(+正数) / 他欠我(-负数)
    }
  */

  // 声望
  reputation: {
    fame: 0,          // 0~1000+
    alignment: 0,     // -100~100
    mystery: 0,       // 0~100
  },

  // 恩仇录
  grievances: [],
  /*
    { id, type:'enmity'/'grace'/'bond', target, targetName,
      reason, date:{month,year}, resolved, resolveNote }
  */

  // 各城市声望（城市ID → {rep: 0~100, align: -100~100}）
  cityRep: {},

  // 世界动态事件 { eventId: { id, tier, data, startTs, endTs, active } }
  worldEvents: {},

  // 每日简报 { lastDate: 'YYYY-MM-DD', shownToday: [bulletinId] }
  worldBulletin: { lastDate: '', shownToday: [] },

  // 成长经历
  growth: {
    battles: 0,
    journeys: 0,
    helps: 0,
    betrayals: 0,
    neardeath: 0,
  },

  // 已解锁的主线进度标记
  mainFlags: {},
};

function jianghuSave(){
  try{ localStorage.setItem(JIANGHU_STATE_KEY, JSON.stringify(jianghuState)); }catch(e){}
}
function jianghuLoad(){
  try{
    const raw = localStorage.getItem(JIANGHU_STATE_KEY);
    if(!raw) return;
    const d = JSON.parse(raw);
    jianghuState = Object.assign(jianghuState, d);
    // 确保 cityRep 被初始化（兼容旧存档）
    if(!jianghuState.cityRep) jianghuState.cityRep = {};
    // 确保世界事件状态被初始化
    if(!jianghuState.worldEvents)   jianghuState.worldEvents   = {};
    if(!jianghuState.worldBulletin) jianghuState.worldBulletin = { lastDate: '', shownToday: [] };
  }catch(e){}
}

// ════════════════════════════════════════════════════════════════
//  五、核心API
// ════════════════════════════════════════════════════════════════

/** 获取玩家与某NPC的关系对象（不存在则初始化） */
function jhGetRel(npcId){
  if(!jianghuState.npcRels[npcId]){
    const npc = JIANGHU_NPC_DB[npcId];
    const initVal = jhCalcInitRel(npc);
    // 根据初始值决定初始关系类型
    let initType = REL_TYPE.STRANGER;
    if(initVal >= 30)  initType = REL_TYPE.FRIEND;
    if(initVal <= -30) initType = REL_TYPE.RIVAL;
    if(initVal <= -70) initType = REL_TYPE.ENEMY;
    jianghuState.npcRels[npcId] = { val: initVal, type: initType, encounters: 0, note: '', debt: 0 };
  }
  return jianghuState.npcRels[npcId];
}

/**
 * 根据门派ID获取阵营
 * 优先从 SECTS 数据（data-sects.js）读取 alignment 字段，
 * 再映射到旧 FACTION 常量（保持 jhGetRel 兼容性）
 */
function getSectFaction(sectId){
  // 直接从 SECTS 数据读取，避免硬编码错误
  if(typeof SECTS !== 'undefined'){
    const sect = SECTS.find(s => s.id === sectId);
    if(sect && sect.alignment){
      const alignMap = {
        righteous: FACTION.ZHENGDAO,
        neutral:   FACTION.ZHONGLI,
        chaotic:   FACTION.ZHONGLI,   // 混乱→中立（initRel 由 chaotic 字段修正）
        evil:      FACTION.XIEDAO,
      };
      return alignMap[sect.alignment] || FACTION.ZHONGLI;
    }
  }
  // fallback（SECTS 未加载时）
  return FACTION.ZHONGLI;
}

/**
 * 根据门派ID获取精确的 alignment 字符串
 * righteous / neutral / chaotic / evil
 */
function getSectAlignment(sectId){
  if(!sectId) return 'neutral';
  if(typeof SECTS !== 'undefined'){
    const sect = SECTS.find(s => s.id === sectId);
    if(sect && sect.alignment) return sect.alignment;
  }
  return 'neutral';
}

/**
 * 根据 NPC 数据计算初始关系值（兼容 jianghu.js 的 initRel 字段）
 * 新版：基于玩家声望 alignment（-100~100）而非固定阵营key
 */
function jhCalcInitRel(npc){
  if(!npc) return 0;
  const playerAlign = (typeof jianghuState !== 'undefined')
    ? (jianghuState.reputation?.alignment || 0) : 0;

  // 优先使用旧 initRel 字段（按阵营key存的），作为基准值
  const playerFaction = getSectFaction(
    typeof edS !== 'undefined' && edS.char ? edS.char.sect : null
  );
  let base = npc.initRel ? (npc.initRel[playerFaction] || 0) : 0;

  // 再叠加新 alignment 系统修正
  const npcAlign = getSectAlignment(npc.sect);
  const isRighteous = playerAlign >= 30;
  const isEvil      = playerAlign <= -30;

  if(npcAlign === 'evil'){
    if(isRighteous) base = Math.min(base, -40);   // 正道×邪道→至少-40
    if(isEvil)      base = Math.max(base,  15);    // 邪道×邪道→至少+15
  } else if(npcAlign === 'righteous'){
    if(isEvil)      base = Math.min(base, -40);    // 邪道×正道→至少-40
    if(isRighteous) base = Math.max(base,  15);    // 正道×正道→至少+15
  } else if(npcAlign === 'chaotic'){
    // 混乱阵营：邪道玩家略有好感，正道玩家略有嫌隙
    if(isEvil)      base += 10;
    if(isRighteous) base -= 5;
  }

  return Math.max(-100, Math.min(100, base));
}

/** 修改关系值，并触发关系网涟漪效果（NPC个人关系网 + 门派关系网） */
function jhChangeRel(npcId, delta, note=''){
  const rel = jhGetRel(npcId);
  const oldType = rel.type;
  rel.val = Math.max(-100, Math.min(100, rel.val + delta));
  rel.encounters++;
  if(note) rel.note = note;

  // 更新关系类型
  // LOVER 由情缘系统管理，不自动升降（除非情缘系统主动改变）
  const isLover = rel.type === REL_TYPE.LOVER;
  if(!isLover){
    if(rel.val >= 70)       rel.type = REL_TYPE.BROTHER;
    else if(rel.val >= 30)  rel.type = REL_TYPE.FRIEND;
    else if(rel.val <= -70) rel.type = REL_TYPE.ENEMY;
    else if(rel.val <= -30) rel.type = REL_TYPE.RIVAL;
    else                    rel.type = REL_TYPE.STRANGER;
  }

  // ── 涟漪一：通过 NPC 个人 npcRelations 传导 ──
  const npcData = JIANGHU_NPC_DB[npcId];
  if(npcData && npcData.npcRelations){
    Object.entries(npcData.npcRelations).forEach(([friendId, friendRel]) => {
      if(jianghuState.npcRels[friendId]){
        const sign = friendRel.val > 0 ? 1 : -1;
        const ripple = Math.round(delta * sign * 0.2);
        if(ripple !== 0){
          jianghuState.npcRels[friendId].val = Math.max(-100, Math.min(100,
            jianghuState.npcRels[friendId].val + ripple));
        }
      }
    });
  }

  // ── 涟漪二：门派关系网传导 ──
  // 只有显著变化（≥5点）才触发，避免频繁小幅抖动
  if(Math.abs(delta) >= 5 && typeof SECTS !== 'undefined'){
    const npcSect = npcData ? npcData.sect : null;
    if(npcSect){
      const sect = SECTS.find(s => s.id === npcSect);
      if(sect && sect.relations){
        // 对盟友门派的具名NPC：同向15%
        (sect.relations.allies || []).forEach(allyId => {
          jhSectRipple(allyId, delta, 0.15);
        });
        // 对敌对门派的具名NPC：反向12%（帮了A，A的死敌B更讨厌玩家）
        (sect.relations.enemies || []).forEach(enemyId => {
          jhSectRipple(enemyId, -delta, 0.12);
        });
        // 对竞争派的具名NPC：反向5%（轻微）
        (sect.relations.rivals || []).forEach(rivalId => {
          jhSectRipple(rivalId, -delta, 0.05);
        });
      }
    }
  }

  // ── 情缘系统钩子：好感变化时通知 ──
  if(typeof ROM !== 'undefined' && typeof ROM.onRelChange === 'function'){
    try{ ROM.onRelChange(npcId, rel.val); } catch(e){}
  }

  jianghuSave();
}

/**
 * 门派涟漪辅助：对某门派的所有具名NPC施加微小关系变化
 * @param {string} sectId  门派id
 * @param {number} delta   原始变化量（已乘符号）
 * @param {number} ratio   传导比例
 */
function jhSectRipple(sectId, delta, ratio){
  Object.values(JIANGHU_NPC_DB).forEach(npc => {
    if(npc.sect === sectId && jianghuState.npcRels[npc.id]){
      const ripple = Math.round(delta * ratio);
      if(ripple !== 0){
        jianghuState.npcRels[npc.id].val = Math.max(-100, Math.min(100,
          jianghuState.npcRels[npc.id].val + ripple));
      }
    }
  });
}

/** 增加声望（可选：同时增加特定城市的声望） */
function jhAddFame(delta, alignDelta=0, cityId=null){
  jianghuState.reputation.fame = Math.max(0, jianghuState.reputation.fame + delta);
  jianghuState.reputation.alignment = Math.max(-100, Math.min(100,
    jianghuState.reputation.alignment + alignDelta));
  // 同时增加城市声望
  if(cityId){
    if(!jianghuState.cityRep[cityId]){
      jianghuState.cityRep[cityId] = { rep: 0, align: 0 };
    }
    jianghuState.cityRep[cityId].rep = Math.max(0, Math.min(100,
      jianghuState.cityRep[cityId].rep + Math.floor(delta * 0.3)));
    jianghuState.cityRep[cityId].align = Math.max(-100, Math.min(100,
      jianghuState.cityRep[cityId].align + alignDelta));
  }
  jianghuSave();
}

/** 获取指定城市的声望 */
function jhGetCityRep(cityId){
  if(!jianghuState.cityRep[cityId]){
    jianghuState.cityRep[cityId] = { rep: 0, align: 0 };
  }
  return jianghuState.cityRep[cityId];
}

/** 获取城市声望等级名称 */
function jhGetCityRepTitle(cityRep){
  if(cityRep >= 80) return '名满全城';
  if(cityRep >= 60) return '德高望重';
  if(cityRep >= 40) return '小有名气';
  if(cityRep >= 20) return '初来乍到';
  if(cityRep >= 10) return '略有耳闻';
  return '默默无闻';
}

/** 获取城市所有者信息 */
function jhGetCityOwner(cityId){
  if(typeof WORLD_NODES === 'undefined') return null;
  const city = WORLD_NODES[cityId];
  if(!city || !city.cityOwner || city.cityOwner === 'neutral') return null;
  return city.cityOwner;
}

/** 获取城市所有者的阵营 */
function jhGetCityFaction(cityOwnerId){
  if(typeof SECTS === 'undefined') return 'neutral';
  const sect = SECTS.find(s => s.id === cityOwnerId);
  return sect ? sect.alignment : 'neutral';
}

/** 获取城市所有者的名称 */
function jhGetCityOwnerName(cityOwnerId){
  if(typeof SECTS === 'undefined') return '未知势力';
  const sect = SECTS.find(s => s.id === cityOwnerId);
  return sect ? sect.name : '未知势力';
}

/** 判断玩家在当前城市的声望是否足够触发某些效果 */
function jhCheckCityAccess(cityId, minRep=0){
  const rep = jhGetCityRep(cityId);
  return rep.rep >= minRep;
}

/** 城市控制效果：获取在该城市的购物价格系数 */
function jhGetCityPriceMod(cityId){
  const owner = jhGetCityOwner(cityId);
  if(!owner) return 1.0; // 中立城市无加成
  const cityFaction = jhGetCityFaction(owner); // 'righteous'/'evil'/'neutral'/'chaotic'
  const playerAlign = (typeof jianghuState !== 'undefined' && jianghuState.reputation)
    ? jianghuState.reputation.alignment : 0; // -100~100
  // 正道城市：玩家立场偏向正道（alignment > 30）有折扣
  if(cityFaction === 'righteous' && playerAlign > 30){
    return 0.9; // 9折
  }
  // 邪道/混乱城市：玩家立场偏向邪道（alignment < -30）有折扣
  if((cityFaction === 'evil' || cityFaction === 'chaotic') && playerAlign < -30){
    return 0.9; // 9折
  }
  // 敌对阵营价格上浮（玩家门派与城市控制者为敌对关系）
  const sect = SECTS.find(s => s.id === owner);
  if(sect && sect.relations){
    if(typeof edS !== 'undefined' && edS.sectId){
      const playerSect = SECTS.find(s => s.id === edS.sectId);
      if(playerSect && playerSect.relations && playerSect.relations.enemies &&
         playerSect.relations.enemies.includes(owner)){
        return 1.3; // 敌对门派，价格上浮30%
      }
    }
  }
  return 1.0;
}

/** 城市控制效果：获取在该城市遭遇特定阵营敌人的概率调整 */
function jhGetCityEnemySpawnMod(cityId, enemyFaction){
  const owner = jhGetCityOwner(cityId);
  if(!owner) return 1.0; // 中立城市无调整
  const sect = SECTS.find(s => s.id === owner);
  if(!sect || !sect.relations) return 1.0;
  // 敌对阵营遭遇概率提高
  if(sect.relations.enemies && sect.relations.enemies.includes(enemyFaction)){
    return 1.5; // 遭遇敌对势力概率+50%
  }
  // 同盟阵营遭遇概率降低
  if(sect.relations.allies && sect.relations.allies.includes(enemyFaction)){
    return 0.5; // 遭遇同盟势力概率-50%


// ═══════════════════════════════════════════════════════════════════
//  城市声望系统扩展（v2：档位福利 + 独家服务）
//  jianghuState.cityRep[cityId] = { rep:0-100, align:-100~100 }
// ═══════════════════════════════════════════════════════════════════

// ── 声望段位表 ──
const REP_TIERS = [
  { min:80, title:'名满全城', color:'#ffd700', badge:'🏆', tip:'传说' },
  { min:60, title:'德高望重', color:'#c080f0', badge:'⭐', tip:'卓越' },
  { min:40, title:'小有名气', color:'#80c0ff', badge:'🌟', tip:'知名' },
  { min:20, title:'初来乍到', color:'#80e080', badge:'🌱', tip:'入门' },
  { min:10, title:'略有耳闻', color:'#c0c080', badge:'💬', tip:'路人' },
  { min:0,  title:'默默无闻', color:'#808080', badge:'🔇', tip:'无名' },
];

// ── 各档位解锁福利 ──
const REP_BENEFITS = {
  10: { shopDiscount:.98, desc:'商店略微折扣（−2%）' },
  20: {
    shopDiscount:.95, desc:'商店折扣（−5%）',
    exclusiveDialogue: true, bountyBonus:.10,
  },
  40: {
    shopDiscount:.90, desc:'商店优惠（−10%）',
    exclusiveDialogue: true, bountyBonus:.20, questChance:.15, npcRequest: true,
  },
  60: {
    shopDiscount:.85, desc:'商店贵宾折扣（−15%）',
    exclusiveDialogue: true, bountyBonus:.30, questChance:.25, npcRequest: true,
    hiddenShop: true, cityEvent: true,
  },
  80: {
    shopDiscount:.80, desc:'商店至尊折扣（−20%）',
    exclusiveDialogue: true, bountyBonus:.40, questChance:.35, npcRequest: true,
    hiddenShop: true, cityEvent: true, exclusiveQuest: true, cityTitle: true,
  },
};

function jhGetRepTier(cityRep){
  return REP_TIERS.find(t => cityRep >= t.min) || REP_TIERS[REP_TIERS.length-1];
}

function jhGetRepBenefits(cityId){
  const data = jhGetCityRep(cityId);
  const rep = data.rep || 0;
  const unlocked = {};
  for(const [tier, benefit] of Object.entries(REP_BENEFITS)){
    if(rep >= Number(tier)) Object.assign(unlocked, benefit);
  }
  return { rep, tier: jhGetRepTier(rep), benefits: unlocked };
}

function jhAddCityRep(cityId, delta){
  if(!jianghuState.cityRep) jianghuState.cityRep = {};
  if(!jianghuState.cityRep[cityId]) jianghuState.cityRep[cityId] = { rep:0, align:0 };
  const oldRep = jianghuState.cityRep[cityId].rep;
  jianghuState.cityRep[cityId].rep = Math.min(100, Math.max(0, oldRep + delta));
  const newRep = jianghuState.cityRep[cityId].rep;
  const oldTier = jhGetRepTier(oldRep);
  const newTier = jhGetRepTier(newRep);
  if(newTier.min > oldTier.min && typeof showToast === 'function'){
    showToast(newTier.badge + ' 声望提升！【' + newTier.title + '】', 'good', 3000);
  }
  return newRep;
}

function jhReduceCityRep(cityId, delta){
  return jhAddCityRep(cityId, -Math.abs(delta));
}

function jhGetRepShopDiscount(cityId){
  const { benefits } = jhGetRepBenefits(cityId);
  return benefits.shopDiscount || 1.0;
}

function jhGetRepBountyBonus(cityId){
  const { benefits } = jhGetRepBenefits(cityId);
  return benefits.bountyBonus || 0;
}

function jhHasExclusiveDialogue(cityId){
  const { benefits } = jhGetRepBenefits(cityId);
  return !!benefits.exclusiveDialogue;
}

function jhGetRepBadgeHtml(cityRep){
  const tier = jhGetRepTier(cityRep);
  return '<span style="color:' + tier.color + ';font-weight:bold">' + tier.badge + ' ' + tier.title + '</span>';
}

function jhGetRepProgressBar(cityRep, width){
  width = width || 120;
  const pct = Math.min(100, Math.max(0, cityRep));
  const tier = jhGetRepTier(cityRep);
  const nextTier = REP_TIERS.find(t => t.min > cityRep);
  const nextPct = nextTier ? nextTier.min : 100;
  const nextTitle = nextTier ? nextTier.title : '已满';
  const filledWidth = Math.round((cityRep / nextPct) * width);
  const benefitParts = [];
  const { benefits } = jhGetRepBenefits(window.travelCurrentCity || '');
  if(benefits.shopDiscount && benefits.shopDiscount < 1) benefitParts.push('购物' + Math.round((1-benefits.shopDiscount)*100) + '%off');
  if(benefits.bountyBonus) benefitParts.push('赏金+' + Math.round(benefits.bountyBonus*100) + '%');
  if(benefits.hiddenShop) benefitParts.push('隐藏商店');
  if(benefits.exclusiveQuest) benefitParts.push('专属任务');
  const benefitStr = benefitParts.length ? ' · ' + benefitParts.join(' · ') : '';
  return '<div style="display:inline-flex;flex-direction:column;gap:2px;vertical-align:middle">' +
    '<div style="display:flex;align-items:center;gap:5px">' +
    '<span style="color:' + tier.color + ';font-size:10px;font-weight:bold">' + tier.badge + tier.title + '</span>' +
    '<span style="color:rgba(180,160,80,.45);font-size:9px">(' + cityRep + '/100)' + benefitStr + '</span>' +
    '</div>' +
    '<div style="position:relative;width:' + width + 'px;height:5px;background:rgba(60,50,30,.6);border-radius:3px;overflow:hidden">' +
    '<div style="position:absolute;top:0;left:0;height:100%;width:' + filledWidth + 'px;background:linear-gradient(90deg,' + tier.color + ',' + tier.color + 'aa);border-radius:3px;transition:width .3s"></div>' +
    '</div>' +
    '<div style="color:rgba(140,120,60,.45);font-size:8px">再升' + (nextPct-cityRep) + '点可升至「' + nextTitle + '」</div>' +
    '</div>';
}

function townRefreshCityRepBar(){
  if(typeof travelCurrentCity === 'undefined' || !travelCurrentCity) return;
  const el = document.getElementById('tsbCityRep');
  if(!el) return;
  const cityRep = jhGetCityRep(travelCurrentCity);
  const rep = cityRep.rep || 0;
  const tier = jhGetRepTier(rep);
  const tierInfo = jhGetRepBenefits(travelCurrentCity);
  const benefits = tierInfo.benefits;
  const benefitParts = [];
  if(benefits.shopDiscount && benefits.shopDiscount < 1) benefitParts.push('购物' + Math.round((1-benefits.shopDiscount)*100) + '%off');
  if(benefits.bountyBonus) benefitParts.push('赏金+' + Math.round(benefits.bountyBonus*100) + '%');
  if(benefits.hiddenShop) benefitParts.push('隐藏商店');
  const benefitStr = benefitParts.length ? ' · ' + benefitParts.join(' · ') : '';
  el.innerHTML = '<span style="color:' + tier.color + '">' + tier.badge + tier.title + '</span>' +
    '<span style="color:rgba(180,160,80,.45);font-size:9px">(' + rep + '/100)' + benefitStr + '</span>';
  el.style.display = 'block';
}

window.jhAddCityRep = jhAddCityRep;
window.jhReduceCityRep = jhReduceCityRep;
window.jhGetRepBenefits = jhGetRepBenefits;
window.jhGetRepTier = jhGetRepTier;
window.jhGetRepBadgeHtml = jhGetRepBadgeHtml;
window.jhGetRepProgressBar = jhGetRepProgressBar;
window.townRefreshCityRepBar = townRefreshCityRepBar;

  }
// ═══════════════════════════════════════════════════════════════════
//  世界动态事件系统
//  tier:  small(日常) | medium(剧情) | major(重大)
//  生效机制：事件加入 worldEvents → 影响 shop/dungeon/npc → 过期清除
// ═══════════════════════════════════════════════════════════════════

const WE_TIER    = { SMALL: 'small', MEDIUM: 'medium', MAJOR: 'major' };
const WE_CD_DAYS = { small: 2, medium: 5, major: 10 }; // 事件存活天数

// 初始化 worldEvents（兼容旧存档）
if (!jianghuState.worldEvents)    jianghuState.worldEvents    = {};
if (!jianghuState.worldBulletin)   jianghuState.worldBulletin = { lastDate: '', shownToday: [] };

/** 触发一个世界事件（可被主线/每日轮询调用） */
function weAddEvent(eventId, tier, data) {
  const days = WE_CD_DAYS[tier] || 5;
  const endTs = Date.now() + days * 86400000;
  jianghuState.worldEvents[eventId] = {
    id: eventId, tier, data, startTs: Date.now(), endTs, active: true
  };
  jianghuSave();
  // major 事件触发弹窗
  if (tier === WE_TIER.MAJOR) {
    const ev = WE_DB[eventId];
    if (ev) weShowMajorPopup(eventId, ev, data);
  }
}

/** 获取当前所有活跃事件 */
function weGetEvents() {
  const now = Date.now();
  const active = {};
  for (const [k, v] of Object.entries(jianghuState.worldEvents)) {
    if (v.active && v.endTs > now) active[k] = v;
  }
  return active;
}

/** 清理已过期事件 */
function weCleanExpired() {
  const now = Date.now();
  let changed = false;
  for (const [k, v] of Object.entries(jianghuState.worldEvents)) {
    if (v.endTs <= now) { v.active = false; changed = true; }
  }
  if (changed) jianghuSave();
}

/** 每日简报：进城时调用，30% 概率展示一条江湖简报 */
function weDailyBulletin(cityId) {
  weCleanExpired();
  const today = _todayStr();
  const bulletin = jianghuState.worldBulletin;

  // 跨日重置
  if (bulletin.lastDate !== today) {
    bulletin.lastDate   = today;
    bulletin.shownToday = [];
  }

  // 已有活跃世界事件时，以 50% 概率展示该事件相关的简报
  const activeEvents = Object.values(weGetEvents());
  if (activeEvents.length > 0 && Math.random() < 0.5) {
    const ev = activeEvents[Math.floor(Math.random() * activeEvents.length)];
    const dbEntry = WE_DB[ev.id];
    if (dbEntry && !bulletin.shownToday.includes(ev.id)) {
      bulletin.shownToday.push(ev.id);
      weShowBulletinPopup(cityId, ev.id, dbEntry, ev.data);
      return;
    }
  }

  // 30% 概率随机抽取一条日常简报
  if (Math.random() >= 0.30) return;

  // 过滤已展示过的
  const available = WE_BULLETIN_POOL.filter(e => !bulletin.shownToday.includes(e.id));
  if (available.length === 0) return;

  const pick = available[Math.floor(Math.random() * available.length)];
  bulletin.shownToday.push(pick.id);
  weShowBulletinPopup(cityId, pick.id, pick, null);
}

/** 展示江湖简报弹窗（进城触发，轻提示） */
function weShowBulletinPopup(cityId, bulletId, bullet, eventData) {
  const tier  = eventData ? WE_DB[bulletId]?.tier : WE_TIER.SMALL;
  const color = tier === WE_TIER.MAJOR ? '#ff6666' : tier === WE_TIER.MEDIUM ? '#ffaa44' : '#88ccff';
  const label = tier === WE_TIER.MAJOR ? '⚠️ 重大事件' : tier === WE_TIER.MEDIUM ? '📢 江湖动态' : '📰 江湖简报';

  // 生成正文（支持动态插值）
  let body = bullet.desc || bullet.text || '';
  if (eventData) {
    body = body
      .replace('{city}', eventData.cityId ? (WORLD_NODES[eventData.cityId]?.name || eventData.cityId) : '')
      .replace('{sect}', eventData.sectId  ? (SECTS?.find(s=>s.id===eventData.sectId)?.name || eventData.sectId) : '')
      .replace('{npc}',  eventData.npcId  ? eventData.npcName || eventData.npcId : '');
  }

  _wePopup(label, body, color, null);
}

/** 展示重大事件强制弹窗（major tier 触发） */
function weShowMajorPopup(eventId, ev, data) {
  const body = (ev.desc || ev.text || '')
    .replace('{city}', data?.cityId ? (WORLD_NODES[data.cityId]?.name || data.cityId) : '')
    .replace('{sect}', data?.sectId  ? (SECTS?.find(s=>s.id===data.sectId)?.name || data.sectId) : '')
    .replace('{npc}',  data?.npcId  ? (data.npcName || data.npcId) : '');

  _wePopup('⚠️ 江湖剧变', body, '#ff4444', null);
  // 同步触发成就检查（如果有相关成就）
  if (typeof window.checkAchievements === 'function') {
    setTimeout(() => window.checkAchievements('world_event', eventId), 500);
  }
}

/** 通用弹窗实现 */
function _wePopup(title, body, borderColor, onClose) {
  // 避免重复弹窗
  const existing = document.getElementById('we-popup');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'we-popup';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;
    background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;
  `;
  overlay.onclick = (e) => {
    if (e.target === overlay) { overlay.remove(); if (onClose) onClose(); }
  };

  const box = document.createElement('div');
  box.style.cssText = `
    background:#1a1a2e;border-radius:12px;padding:24px 28px;max-width:380px;width:90%;
    border:2px solid ${borderColor};box-shadow:0 8px 32px rgba(0,0,0,.6);
    font-family:inherit;color:#ddd;text-align:center;
  `;
  box.innerHTML = `
    <div style="font-size:13px;color:${borderColor};margin-bottom:8px">${title}</div>
    <div style="font-size:14px;line-height:1.7;margin-bottom:18px">${body}</div>
    <button onclick="document.getElementById('we-popup')?.remove();${onClose ? onClose : ''}"
      style="background:${borderColor}22;border:1px solid ${borderColor};color:${borderColor};
             padding:6px 24px;border-radius:6px;cursor:pointer;font-size:13px">
      我已知晓
    </button>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

/** 世界事件对商店价格的影响（供 shop 调用） */
function weGetPriceMod(shopType, cityId) {
  const events = Object.values(weGetEvents());
  let mod = 1.0;
  for (const ev of events) {
    const effect = WE_DB[ev.id]?.priceEffect;
    if (!effect) continue;
    if (effect.cities && !effect.cities.includes(cityId)) continue;
    if (effect.sect  && ev.data?.sectId && ev.data.sectId !== effect.sect) continue;
    mod *= effect.value || 1.0;
  }
  return mod;
}

/** 世界事件对地下城难度的影响（供 dungeon 调用） */
function weGetDungeonMod(dungeonId, baseTier) {
  const events = Object.values(weGetEvents());
  let tierMod = 0;
  for (const ev of events) {
    const effect = WE_DB[ev.id]?.dungeonEffect;
    if (!effect) continue;
    if (effect.dungeons && !effect.dungeons.includes(dungeonId)) continue;
    if (effect.nearCity && !effect.nearCity) continue;
    tierMod += effect.tierBonus || 0;
  }
  return tierMod;
}

/** 世界事件对 NPC 对话的影响（供 npc-logic 调用） */
function weGetNpcGreetingModifier(npcId) {
  const events = Object.values(weGetEvents());
  let modifier = '';
  for (const ev of events) {
    const effect = WE_DB[ev.id]?.npcEffect;
    if (!effect) continue;
    if (effect.npcs && !effect.npcs.includes(npcId)) continue;
    if (effect.sect && ev.data?.sectId) {
      // 影响该门派所有 NPC
      if (typeof SECTS !== 'undefined') {
        const sectNpcs = SECTS.filter(s => s.id === effect.sect).flatMap(s => (s.npcIds || []));
        if (!sectNpcs.includes(npcId)) continue;
      }
    }
    if (effect.greetingSuffix) modifier += ' ' + effect.greetingSuffix;
  }
  return modifier;
}

/** 每日轮询：每次进城时检查是否该触发随机世界事件（small tier） */
function weRollDailyEvent() {
  weCleanExpired();
  const today = _todayStr();
  if (jianghuState.worldBulletin.lastDate !== today) {
    // 跨日有 10% 概率触发一个小型世界事件
    if (Math.random() < 0.10) {
      const smallEvents = Object.entries(WE_DB)
        .filter(([_, e]) => e.tier === WE_TIER.SMALL)
        .filter(([id, _]) => !jianghuState.worldEvents[id]?.active);
      if (smallEvents.length > 0) {
        const [id, ev] = smallEvents[Math.floor(Math.random() * smallEvents.length)];
        const data = typeof ev.dataGen === 'function' ? ev.dataGen() : ev.data || {};
        weAddEvent(id, WE_TIER.SMALL, data);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  江湖简报数据库  (~30 条)
//  id: 唯一标识 | tier: small/medium/major | text: 简报正文
//  支持插值：{city} {sect} {npc}
// ═══════════════════════════════════════════════════════════════════

const WE_BULLETIN_POOL = [
  // ── 门派动态 ──────────────────────────────────────────────────
  { id:'b01', tier: WE_TIER.SMALL, text:'少林寺近日闭门谢客，据传在筹备一场武林盛事。' },
  { id:'b02', tier: WE_TIER.SMALL, text:'武当掌门闭关修炼，弟子们轮流巡山，山下香客比往日少了许多。' },
  { id:'b03', tier: WE_TIER.SMALL, text:'华山派近日广收门徒，江湖新人纷纷前往拜师。' },
  { id:'b04', tier: WE_TIER.SMALL, text:'明教总坛守卫森严，有江湖人传言是在防备什么。' },
  { id:'b05', tier: WE_TIER.SMALL, text:'五毒教近日有弟子在中原现身，所过之处人人侧目。' },
  { id:'b06', tier: WE_TIER.SMALL, text:'天山脚下近来天气异常，山民传言与逍遥派有关。' },
  { id:'b07', tier: WE_TIER.SMALL, text:'丐帮弟子近日在各大城镇出没，似乎在寻访什么人。' },
  // ── 城市新闻 ──────────────────────────────────────────────────
  { id:'b08', tier: WE_TIER.SMALL, text:'沧州连日大雨，粮价飞涨，城中百姓议论纷纷。' },
  { id:'b09', tier: WE_TIER.SMALL, text:'扬州城中新开了一家赌坊，吸引了不少江湖豪客。' },
  { id:'b10', tier: WE_TIER.SMALL, text:'开封近日有神秘人在街头卖艺，所使兵器闻所未闻。' },
  { id:'b11', tier: WE_TIER.SMALL, text:'杭州西湖近日游客骤增，据说有人在湖畔见过传说中的剑侠。' },
  { id:'b12', tier: WE_TIER.SMALL, text:'成都城中物价平稳，唐门弟子却比往日更加低调。' },
  // ── 地下城异变 ────────────────────────────────────────────────
  { id:'b13', tier: WE_TIER.SMALL, text:'江湖传闻，黑风寨近日来了一批蒙面客，气氛诡异。' },
  { id:'b14', tier: WE_TIER.SMALL, text:'听说绝龙岭深处有人看见了上古遗迹的光芒……' },
  { id:'b15', tier: WE_TIER.SMALL, text:'幽冥谷近来瘴气比往年更重，独行侠们纷纷结伴而入。' },
  { id:'b16', tier: WE_TIER.SMALL, text:'血刀寨近日沉寂得异常，仿佛在酝酿一场大风暴。' },
  // ── NPC 消息 ──────────────────────────────────────────────────
  { id:'b17', tier: WE_TIER.SMALL, text:'听闻开封铁匠马连近日收了件古怪兵器，秘不示人。' },
  { id:'b18', tier: WE_TIER.SMALL, text:'洛阳杏林堂的叶大夫云游未归，医馆暂时关门。' },
  { id:'b19', tier: WE_TIER.SMALL, text:'苏州某客栈掌柜神秘失踪，江湖人议论纷纷。' },
  { id:'b20', tier: WE_TIER.SMALL, text:'日月神教左使在江南现身，行踪成谜，各派暗中戒备。' },
  // ── 江湖八卦 ──────────────────────────────────────────────────
  { id:'b21', tier: WE_TIER.SMALL, text:'江湖传言，有人在东海孤岛上见到了传说中的武林秘籍。' },
  { id:'b22', tier: WE_TIER.SMALL, text:'近来江湖上新出现了一批年轻高手，来历不明。' },
  { id:'b23', tier: WE_TIER.SMALL, text:'据说某个隐世门派即将重出江湖，正道各派人心惶惶。' },
  { id:'b24', tier: WE_TIER.SMALL, text:'有人在茶馆里说书，讲述了一段被遗忘的江湖往事。' },
  { id:'b25', tier: WE_TIER.SMALL, text:'近日江湖上赝品兵器盛行，真假难辨，购置兵器需小心。' },
  { id:'b26', tier: WE_TIER.SMALL, text:'某位游侠在酒馆豪饮后消失，留下一把刻有异文的短剑。' },
  { id:'b27', tier: WE_TIER.SMALL, text:'江湖夜雨，有人目击一道黑影掠过城中屋顶。' },
  { id:'b28', tier: WE_TIER.SMALL, text:'某处古墓近日发出异响，吸引了众多探险者前往。' },
  { id:'b29', tier: WE_TIER.SMALL, text:'有人在深山里捡到一本残破的手抄本，上面的字迹无人能识。' },
  { id:'b30', tier: WE_TIER.SMALL, text:'近日江湖上流传一首谜语，谜底据说指向一处宝藏。' },
];

// ═══════════════════════════════════════════════════════════════════
//  世界事件数据库
//  id: 唯一标识 | tier: small/medium/major | desc: 弹窗正文
//  dataGen: 动态数据生成函数 | priceEffect | dungeonEffect | npcEffect
// ═══════════════════════════════════════════════════════════════════

const WE_DB = {
  // ── 小型事件 ───────────────────────────────────────────────────
  'we_sect_dispute_1': {
    tier: WE_TIER.SMALL,
    desc: '{sect} 内部发生了一场激烈的争论，门中弟子人心惶惶。',
    priceEffect: { sect: 'shaolin', value: 1.15 }, // 少林内乱，物价涨
    dungeonEffect: { nearCity: 'songshan', tierBonus: 1 }, // 嵩山附近难度+1
  },
  'we_trader_refugee': {
    tier: WE_TIER.SMALL,
    desc: '一群商人难民涌入{city}，据说是西边战乱所致。',
    priceEffect: { cities: ['kaifeng','dongjing'], value: 1.10 },
    npcEffect: { greetingSuffix: '面带愁容，似乎有什么心事' },
  },
  'we_plague_shadow': {
    tier: WE_TIER.SMALL,
    desc: '{city} 城中悄悄流传起一场疫病，医馆人满为患。',
    priceEffect: { cities: ['kaifeng'], value: 1.20 },
    dungeonEffect: { nearCity: 'kaifeng', tierBonus: 1 },
  },
  'we_sect_training': {
    tier: WE_TIER.SMALL,
    desc: '{sect} 正在举行年度大考，弟子们纷纷外出历练。',
    dungeonEffect: { nearCity: null, tierBonus: 0 }, // 暂时降低周围难度（弟子外流）
  },
  'we_dungeon_treasure_rumor': {
    tier: WE_TIER.SMALL,
    desc: '江湖传闻，{city} 附近的某处险地出现了稀世珍宝，各派高手闻风而动。',
    dungeonEffect: { nearCity: 'cangzhou', tierBonus: 2 }, // 沧州附近难度骤升
  },

  // ── 中型事件（通常由主线触发）────────────────────────────────
  'we_xuegu_rise': {
    tier: WE_TIER.MEDIUM,
    desc: '{sect} 的势力急剧扩张，已有数座城镇落入其掌控。',
    priceEffect:  { sect: 'xuegu', value: 0.85 }, // 血骨门控制区物价反而低（抢来的）
    dungeonEffect:{ nearCity: 'cangzhou', tierBonus: 3 },
    npcEffect:    { sect: 'xuegu', greetingSuffix: '语气中带着傲气' },
  },
  'we_riyue_patrol': {
    tier: WE_TIER.MEDIUM,
    desc: '日月神教开始在江南大规模巡逻，各派弟子需格外小心。',
    dungeonEffect:{ nearCity: 'hangzhou', tierBonus: 2 },
    npcEffect:    { npcs: ['hangzhou_inn','hangzhou_doctor','hangzhou_swordsman'], greetingSuffix: '说话时目光不时望向窗外，似在戒备' },
  },
  'we_sect_founder_death': {
    tier: WE_TIER.MEDIUM,
    desc: '{sect} 的创始人在昨夜的激战中陨落，门派陷入群龙无首之境。',
    priceEffect:  { sect: null, value: 1.0 }, // 无价格影响
    dungeonEffect: { nearCity: 'mingzhou', tierBonus: 1 },
    npcEffect:    { sect: null, greetingSuffix: '神情哀伤，似乎还沉浸在悲痛中' },
  },
  'we_xuanming_sect_fall': {
    tier: WE_TIER.MEDIUM,
    desc: '{sect} 遭受重创，门派根基动摇，已无力维持对外扩张。',
    dungeonEffect: { nearCity: 'luoyang', tierBonus: -1 }, // 难度降低
    npcEffect:    { sect: 'xuanming', greetingSuffix: '语气低沉，士气低落' },
  },

  // ── 重大事件（强制弹窗）────────────────────────────────────────
  'we_city_occupied': {
    tier: WE_TIER.MAJOR,
    desc: '{city} 已被 {sect} 攻占！旧势力的 NPC 纷纷逃离，城中一片混乱。',
    priceEffect:  { cities: ['cangzhou'], value: 1.40 },
    dungeonEffect:{ nearCity: 'cangzhou', tierBonus: 5 },
    npcEffect:    { greetingSuffix: '语气中满是无奈与恐惧' },
  },
  'we_celebrity_death': {
    tier: WE_TIER.MAJOR,
    desc: '江湖名人 {npc} 在 {city} 郊外遇害，凶手成谜，江湖震动。',
    npcEffect: { npcs: [], greetingSuffix: '谈论起这桩命案时无不摇头叹息' },
  },
  'we_mainline_chapter3': {
    tier: WE_TIER.MAJOR,
    desc: '血骨门之乱达到高潮！{city} 危在旦夕，正道各派紧急集结。',
    priceEffect:  { cities: ['cangzhou'], value: 1.60 },
    dungeonEffect:{ nearCity: 'cangzhou', tierBonus: 6 },
    npcEffect:    { npcs: ['kaifeng_inn','kaifeng_doctor','kaifeng_smith'], greetingSuffix: '神色紧张，不时望向城门方向' },
  },
  'we_city_control_change': {
    tier: WE_TIER.MEDIUM,
    desc: '江湖势力重新洗牌！{cityId} 的控制权发生变更，{changeName}。',
    duration: 7 * 24 * 3600 * 1000, // 7天
    npcEffect: { npcs: [], greetingSuffix: '谈论起城中势力变动时眼神复杂' },
  },
};

// ═══════════════════════════════════════════════════════════════════
//  门派巡逻敌人生成系统
//  基于城市控制势力，在地下城入口等场景触发门派巡逻队遭遇
// ═══════════════════════════════════════════════════════════════════

// 门派 → 巡逻敌人池（从小怪到大怪排列，dungeonLevel 决定选取索引）
// 只使用 ENEMY_DB 中实际存在的敌人 ID
const SECT_PATROL_POOL = {
  shaolin:     ['hunter_thief', 'bandit_veteran', 'wild_sect_master'],  // 无少林专属怪，用通用
  wudang:      ['wudang_spy', 'wudang_traitor', 'wild_sect_master'],
  huashan:     ['huashan_sword_disciple', 'huashan_sword_master'],
  riyue:       ['riyue_guardian', 'riyue_fire_guard', 'shadow_master'],
  mingjiao:    ['mingjiao_soldier', 'mingjiao_elder', 'holy_fire_guard'],
  wudu:        ['five_poison_disciple', 'five_poison_elder', 'five_poison_boss'],
  xuegu:       ['blood_bone_soldier', 'blood_bone_elite_guard', 'blood_bone_vice_master'],
  xuanming:    ['xuanming_cultist', 'xuanming_spy', 'xuanming_boss'],
  xiyu_bandit: ['desert_bandit', 'desert_assassin', 'desert_boss'],
  tiandibang:  ['bandit_foot', 'bandit_veteran', 'bandit_chief_cangzhou'],
  tangmen:     ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  taohuadao:   ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  xiaoyao:     ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  shengguang:  ['holy_fire_guard', 'wild_sect_master', 'wild_sect_master'],
  kongtong:    ['kunlun_invader', 'kunlun_warlord', 'wild_sect_master'],
  kunlun:      ['kunlun_invader', 'kunlun_warlord', 'wild_sect_master'],
  lingxiao:    ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  tianlong:    ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  qingcheng:   ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  haisha:      ['haisha_pirate', 'haisha_captain', 'wild_sect_master'],
  nangong:     ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  diancang:    ['desert_bandit', 'desert_assassin', 'desert_boss'],
  tianshan:    ['desert_bandit', 'desert_assassin', 'desert_boss'],
  xixia:       ['desert_bandit', 'desert_assassin', 'desert_boss'],
  guigu:       ['hunter_thief', 'hunter_boss', 'wild_sect_master'],
  // 中立/通用城市用江湖浪人
  neutral:     ['bandit_foot', 'bandit_veteran', 'highway_robber_boss'],
};

/**
 * 获取城市控制势力的巡逻敌人类别
 * @param {string} cityId - 城市ID
 * @param {number} dungeonLevel - 地下城推荐等级（用于选怪难度）
 * @returns {{ enemyId: string, factionName: string, factionColor: string } | null}
 */
function jhGetFactionPatrolEnemy(cityId, dungeonLevel = 1){
  const owner = jhGetCityOwner(cityId);
  // 中立城市不触发门派巡逻
  if(!owner) return null;
  const sect = SECTS.find(s => s.id === owner);
  if(!sect) return null;

  const pool = SECT_PATROL_POOL[owner] || SECT_PATROL_POOL.neutral;

  // 根据地下城等级选怪：
  // Lv1-15  → index 0（小怪）
  // Lv16-35 → index 1（中怪）
  // Lv36+   → index 2（大怪/elite）
  let idx = dungeonLevel >= 36 ? 2 : dungeonLevel >= 16 ? 1 : 0;
  // 确保不越界
  idx = Math.min(idx, pool.length - 1);
  const enemyId = pool[idx];

  // 阵营颜色
  const factionColor = {
    righteous: '#80d080',
    evil:      '#e05050',
    chaotic:   '#e08020',
    neutral:   '#a080a0'
  }[sect.alignment] || '#a080a0';

  return { enemyId, factionName: sect.name, factionColor };
}

/**
 * 判断在指定城市/地下城是否触发门派巡逻遭遇
 * 会考虑敌人生成概率调整（jhGetCityEnemySpawnMod）
 * @param {string} cityId
 * @param {string} dungeonId - 地下城ID（用于确定势力判断）
 * @returns {boolean}
 */
function jhShouldTriggerFactionPatrol(cityId, dungeonId){
  const owner = jhGetCityOwner(cityId);
  if(!owner) return false;

  // 基础遭遇概率 25%
  let baseChance = 0.25;

  // 玩家立场与城市控制者敌对 → 遭遇概率降低（减少摩擦）
  if(typeof jianghuState !== 'undefined' && jianghuState.reputation && jianghuState.reputation.alignment !== undefined){
    const align = jianghuState.reputation.alignment;
    // 玩家与门派敌对时，遭遇门派弟子的概率降低（他们不主动惹你）
    const sect = SECTS.find(s => s.id === owner);
    if(sect && sect.relations && sect.relations.enemies){
      if(typeof edS !== 'undefined' && edS.sectId && sect.relations.enemies.includes(edS.sectId)){
        baseChance = 0.12; // 敌对门派：巡逻概率降低（各走各的路）
      }
    }
    // 玩家与门派友好/同阵营 → 遭遇概率正常（互相照面）
    if(align > 30 || align < -30){
      baseChance = 0.30; // 偏向明显，概率提高
    }
  }

  // 每日巡逻遭遇上限（避免刷屏）
  const today = new Date().toDateString();
  const patrolKey = 'wuxia_patrol_today';
  const patrolData = JSON.parse(localStorage.getItem(patrolKey) || '{"date":"","count":0}');
  if(patrolData.date !== today){
    patrolData.date = today;
    patrolData.count = 0;
    localStorage.setItem(patrolKey, JSON.stringify(patrolData));
  }
  if(patrolData.count >= 3) return false; // 每日最多3次巡逻遭遇

  return Math.random() < baseChance;
}

/**
 * 标记门派巡逻遭遇已触发（用于每日上限计数）
 */
function jhMarkFactionPatrolTriggered(){
  const today = new Date().toDateString();
  const patrolKey = 'wuxia_patrol_today';
  const patrolData = JSON.parse(localStorage.getItem(patrolKey) || '{"date":"","count":0}');
  if(patrolData.date !== today){
    patrolData.date = today;
    patrolData.count = 0;
  }
  patrolData.count = (patrolData.count || 0) + 1;
  localStorage.setItem(patrolKey, JSON.stringify(patrolData));
}


/** 添加恩仇录条目 */
function jhAddGrievance(entry){
  entry.id = entry.id || ('grv_' + Date.now());
  entry.resolved = false;
  entry.date = { 
    year: (typeof edS !== 'undefined' ? edS.gameYear||1 : 1),
    month: (typeof edS !== 'undefined' ? edS.gameMonth||1 : 1)
  };
  jianghuState.grievances.push(entry);
  jianghuSave();
}

/** 解决恩仇录条目 */
function jhResolveGrievance(id, note=''){
  const g = jianghuState.grievances.find(x => x.id === id);
  if(g){ g.resolved = true; g.resolveNote = note; jianghuSave(); }
}

// ════════════════════════════════════════════════════════════════
//  六、NPC邂逅系统（旅行到达时触发）
// ════════════════════════════════════════════════════════════════

/** 获取某地点当前存在的具名NPC列表 */
function jhGetNpcsAtLocation(locationId){
  return Object.values(JIANGHU_NPC_DB).filter(npc =>
    npc.locations && npc.locations.includes(locationId)
  );
}

/** 旅行到达某地后，触发具名NPC邂逅事件（低概率惊喜） */
function jhOnArrival(locationId){
  const npcs = jhGetNpcsAtLocation(locationId);
  if(!npcs.length) return;

  // 每个NPC 30%概率出现提示
  npcs.forEach(npc => {
    if(Math.random() < 0.30){
      const rel = jhGetRel(npc.id);
      // 老朋友必定出现，陌生人30%
      const shouldAppear = rel.encounters > 0 || Math.random() < 0.30;
      if(shouldAppear){
        setTimeout(() => jhShowNpcEncounter(npc), 1000 + Math.random()*2000);
      }
    }
  });
}

/** 显示NPC邂逅提示弹窗 */
function jhShowNpcEncounter(npc){
  const rel = jhGetRel(npc.id);
  const relLabel = jhGetRelLabel(rel.val);
  const greeting = npc.greetings[Math.floor(Math.random()*npc.greetings.length)];

  // 创建弹窗
  const overlay = document.createElement('div');
  overlay.className = 'jh-encounter-overlay';
  overlay.innerHTML = `
    <div class="jh-encounter-box">
      <div class="jh-enc-header">
        <span class="jh-enc-avatar">${npc.avatar}</span>
        <div class="jh-enc-info">
          <div class="jh-enc-name">${npc.name} <span class="jh-enc-title">· ${npc.title}</span></div>
          <div class="jh-enc-rel ${jhGetRelClass(rel.val)}">${relLabel} (${rel.val > 0 ? '+' : ''}${rel.val})</div>
        </div>
      </div>
      <div class="jh-enc-speech">"${greeting}"</div>
      <div class="jh-enc-btns">
        <button class="jh-btn-talk" onclick="jhOpenNpcSheet('${npc.id}'); this.closest('.jh-encounter-overlay').remove()">
          💬 与他交谈
        </button>
        <button class="jh-btn-pass" onclick="this.closest('.jh-encounter-overlay').remove()">
          点头离去
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 5秒自动消失
  setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 7000);
}

// ════════════════════════════════════════════════════════════════
//  七、NPC详情页（人物卡）
// ════════════════════════════════════════════════════════════════

function jhOpenNpcSheet(npcId){
  const npc = JIANGHU_NPC_DB[npcId];
  if(!npc) return;
  const rel = jhGetRel(npcId);
  rel.encounters++;
  jianghuSave();

  // 可用对话选项（过滤minRel）
  const availableDialogs = (npc.dialogs || []).filter(d => rel.val >= (d.minRel || 0));

  const overlay = document.createElement('div');
  overlay.className = 'jh-npc-overlay';
  overlay.id = 'jh-npc-overlay';

  const factionColors = {
    zhengdao: '#4db6ac', xiedao: '#e57373',
    zhongli: '#90a4ae', chaoting: '#ffb74d',
  };
  const factionLabels = {
    zhengdao:'正道', xiedao:'邪道', zhongli:'中立', chaoting:'朝廷',
  };

  overlay.innerHTML = `
    <div class="jh-npc-sheet">
      <!-- 头部 -->
      <div class="jh-npc-head" style="border-color:${factionColors[npc.faction]||'#aaa'}">
        <div class="jh-npc-avatar-big">${npc.avatar}</div>
        <div class="jh-npc-head-info">
          <div class="jh-npc-bigname">${npc.name}</div>
          <div class="jh-npc-bigtitle">${npc.title}</div>
          <div class="jh-npc-tags">
            <span class="jh-tag" style="background:${factionColors[npc.faction]||'#aaa'}22;color:${factionColors[npc.faction]||'#aaa'}">${factionLabels[npc.faction]||''}</span>
            ${npc.sect ? `<span class="jh-tag">${getSectName(npc.sect)}</span>` : ''}
            ${npc.personality.map(p=>`<span class="jh-tag-p">${p}</span>`).join('')}
          </div>
        </div>
        <button class="jh-close-btn" onclick="document.getElementById('jh-npc-overlay').remove()">✕</button>
      </div>

      <!-- 关系状态 -->
      <div class="jh-rel-bar">
        <div class="jh-rel-label ${jhGetRelClass(rel.val)}">
          ${jhGetRelLabel(rel.val)} &nbsp;
          <span class="jh-rel-val">${rel.val > 0 ? '+' : ''}${rel.val}</span>
        </div>
        <div class="jh-rel-track">
          <div class="jh-rel-fill" style="width:${(rel.val+100)/2}%;background:${jhGetRelColor(rel.val)}"></div>
        </div>
        <div class="jh-rel-encounters">已见过 ${rel.encounters} 次</div>
      </div>

      <!-- 背景 -->
      <div class="jh-section">
        <div class="jh-section-title">📖 人物背景</div>
        <div class="jh-bg-text">${npc.background}</div>
      </div>

      <!-- 对话选项 -->
      <div class="jh-section">
        <div class="jh-section-title">💬 可选话题</div>
        <div class="jh-dialog-list">
          ${availableDialogs.length ? availableDialogs.map(d => `
            <div class="jh-dialog-item" onclick="jhHandleDialog('${npcId}','${d.id}')">
              <div class="jh-d-text">${d.text}</div>
              ${d.relDelta ? `<div class="jh-d-rel ${d.relDelta>0?'pos':'neg'}">${d.relDelta>0?'+':''}${d.relDelta} 好感</div>` : ''}
            </div>
          `).join('') : '<div class="jh-empty">与此人还不够熟络，多走动走动。</div>'}
          
        </div>
      </div>

      <!-- NPC之间的关系 -->
      <div class="jh-section">
        <div class="jh-section-title">🕸 江湖关系</div>
        <div class="jh-rel-net">
          ${Object.entries(npc.npcRelations||{}).map(([tid, r]) => {
            const tnpc = JIANGHU_NPC_DB[tid];
            if(!tnpc) return '';
            return `<div class="jh-rel-net-item">
              <span class="jh-rn-avatar">${tnpc.avatar}</span>
              <span class="jh-rn-name">${tnpc.name}</span>
              <span class="jh-rn-rel ${r.val>0?'pos':'neg'}">${r.val>0?'◆':'◇'} ${r.note}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

/** 处理对话选项点击 */
function jhHandleDialog(npcId, dialogId){
  const npc = JIANGHU_NPC_DB[npcId];
  if(!npc) return;
  const d = (npc.dialogs||[]).find(x=>x.id===dialogId);
  if(!d) return;

  // 声望/等级检查
  if(d.minFame && jianghuState.reputation.fame < d.minFame){
    showToast(`⚠️ 需要声望 ${d.minFame}（当前 ${jianghuState.reputation.fame}）`);
    return;
  }
  if(d.requireFaction){
    const playerFaction = getSectFaction(typeof edS !== 'undefined' && edS.char ? edS.char.sect : null);
    if(playerFaction !== d.requireFaction){
      const fLabel = {zhengdao:'正道',xiedao:'邪道',zhongli:'中立',chaoting:'朝廷'};
      showToast(`⚠️ 需要 ${fLabel[d.requireFaction]||d.requireFaction} 阵营`);
      return;
    }
  }

  // 改变关系值
  if(d.relDelta) jhChangeRel(npcId, d.relDelta, d.text);

  // 关闭旧弹窗，显示对话结果
  const overlay = document.getElementById('jh-npc-overlay');
  if(overlay) overlay.remove();

  // 执行 action（在显示结果前触发，结果弹窗中可携带额外效果说明）
  let extraEffect = '';
  if(d.action) extraEffect = jhDoAction(npcId, d.action, d);

  jhShowDialogResult(npc, d, extraEffect);
}

function jhShowDialogResult(npc, d, extraEffect=''){
  const overlay = document.createElement('div');
  overlay.className = 'jh-dialog-result-overlay';
  overlay.innerHTML = `
    <div class="jh-dialog-result">
      <div class="jh-dr-speaker">${npc.avatar} ${npc.name}</div>
      <div class="jh-dr-reply">"${d.reply}"</div>
      ${d.relDelta ? `<div class="jh-dr-effect ${d.relDelta>0?'pos':'neg'}">${d.relDelta>0?'▲':'▼'} 好感 ${d.relDelta>0?'+':''}${d.relDelta}</div>` : ''}
      ${extraEffect ? `<div class="jh-dr-extra">${extraEffect}</div>` : ''}
      <div class="jh-dr-btns">
        <button onclick="jhOpenNpcSheet('${npc.id}'); this.closest('.jh-dialog-result-overlay').remove()">← 返回</button>
        <button onclick="this.closest('.jh-dialog-result-overlay').remove()">告辞</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ════════════════════════════════════════════════════════════════
//  八、江湖人物志页面（总览）
// ════════════════════════════════════════════════════════════════

function jhShowJianghuPage(){
  const overlay = document.createElement('div');
  overlay.className = 'jh-page-overlay';
  overlay.id = 'jh-page-overlay';

  const knownNpcs = Object.values(JIANGHU_NPC_DB).filter(npc => {
    const rel = jianghuState.npcRels[npc.id];
    return rel && rel.encounters > 0;
  });

  const unknownNpcs = Object.values(JIANGHU_NPC_DB).filter(npc => {
    const rel = jianghuState.npcRels[npc.id];
    return !rel || rel.encounters === 0;
  });

  const repTitle = getReputationTitle(
    jianghuState.reputation.fame,
    jianghuState.reputation.alignment
  );

  overlay.innerHTML = `
    <div class="jh-page">
      <div class="jh-page-header">
        <div class="jh-page-title">📖 江湖人物志</div>
        <div class="jh-rep-badge">
          ${repTitle} · 声名 ${jianghuState.reputation.fame}
          <span class="jh-align ${jianghuState.reputation.alignment>0?'good':'evil'}">
            ${jianghuState.reputation.alignment>0?'◆侠义':'◆邪道'}${Math.abs(jianghuState.reputation.alignment)}
          </span>
          ${typeof getKarmaBand === 'function' ? `<span style="font-size:11px;color:${getKarmaBand(jianghuState.reputation.alignment).color};margin-left:6px;">${getKarmaBand(jianghuState.reputation.alignment).icon}${getKarmaBand(jianghuState.reputation.alignment).name}</span>` : ''}
        </div>
        <button class="jh-close-btn" onclick="document.getElementById('jh-page-overlay').remove()">✕</button>
      </div>

      <!-- 已结识 -->
      <div class="jh-section">
        <div class="jh-section-title">已结识 (${knownNpcs.length})</div>
        <div class="jh-npc-grid">
          ${knownNpcs.map(npc => {
            const rel = jhGetRel(npc.id);
            return `
              <div class="jh-npc-card ${jhGetRelClass(rel.val)}" onclick="jhOpenNpcSheet('${npc.id}')">
                <div class="jh-card-avatar">${npc.avatar}</div>
                <div class="jh-card-name">${npc.name}</div>
                <div class="jh-card-title">${npc.title}</div>
                <div class="jh-card-rel">${jhGetRelLabel(rel.val)}</div>
                <div class="jh-card-relbar">
                  <div style="width:${(rel.val+100)/2}%;height:3px;background:${jhGetRelColor(rel.val)};border-radius:2px"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 未结识 -->
      <div class="jh-section">
        <div class="jh-section-title">江湖传闻中的人物 (${unknownNpcs.length})</div>
        <div class="jh-npc-grid">
          ${unknownNpcs.map(npc => `
            <div class="jh-npc-card unknown">
              <div class="jh-card-avatar">❓</div>
              <div class="jh-card-name">？？？</div>
              <div class="jh-card-title">${npc.title}</div>
              <div class="jh-card-rel">素未谋面</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ════════════════════════════════════════════════════════════════
//  九、工具函数
// ════════════════════════════════════════════════════════════════

function jhGetRelLabel(val, type){
  if(type === REL_TYPE.LOVER)    return '♥ 情缘';
  if(type === REL_TYPE.TEACHER)  return '✎ 师父';
  if(type === REL_TYPE.STUDENT)  return '✎ 弟子';
  if(type === REL_TYPE.BROTHER)  return '✦ 挚友';
  if(val >= 70)                  return '✦ 挚友';
  if(val >= 30)                  return '◎ 友善';
  if(val >= -20)                 return '· 陌路';
  if(val >= -60)                 return '▽ 敌意';
  return '✗ 仇敌';
}

function jhGetRelClass(val, type){
  if(type === REL_TYPE.LOVER)    return 'rel-lover';
  if(type === REL_TYPE.TEACHER)  return 'rel-teacher';
  if(type === REL_TYPE.STUDENT)  return 'rel-student';
  if(val >= 70)                  return 'rel-brother';
  if(val >= 30)                  return 'rel-friend';
  if(val >= -20)                 return 'rel-neutral';
  if(val >= -60)                 return 'rel-hostile';
  return 'rel-enemy';
}

function jhGetRelColor(val, type){
  if(type === REL_TYPE.LOVER)    return '#ff6b9d';
  if(type === REL_TYPE.TEACHER)  return '#64b5f6';
  if(type === REL_TYPE.STUDENT)  return '#64b5f6';
  if(val >= 70)                  return '#ff9fc8';
  if(val >= 30)                  return '#80d080';
  if(val >= -20)                 return '#90a4ae';
  if(val >= -60)                 return '#ff8060';
  return '#ff4040';
}

function getSectName(sectId){
  if(typeof SECTS === 'undefined') return sectId;
  const s = SECTS.find(x => x.id === sectId);
  return s ? s.name : sectId;
}

// ════════════════════════════════════════════════════════════════
//  十、CSS 样式注入
// ════════════════════════════════════════════════════════════════
(function injectJianghuStyles(){
  const style = document.createElement('style');
  style.textContent = `
  /* ── 邂逅弹窗 ── */
  .jh-encounter-overlay {
    position:fixed; bottom:80px; right:20px; z-index:9000;
    animation: jhSlideIn .4s ease;
  }
  @keyframes jhSlideIn {
    from { transform:translateX(120%); opacity:0; }
    to   { transform:translateX(0);   opacity:1; }
  }
  .jh-encounter-box {
    background: rgba(15,20,15,.95);
    border: 1px solid rgba(120,200,120,.4);
    border-radius: 12px;
    padding: 14px 16px;
    width: 280px;
    box-shadow: 0 4px 24px rgba(0,0,0,.6);
    color: #d4e8d4;
    font-size: 13px;
  }
  .jh-enc-header { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .jh-enc-avatar { font-size:28px; }
  .jh-enc-name { font-size:15px; font-weight:700; color:#e8f5e8; }
  .jh-enc-title { font-size:12px; color:#90a490; font-weight:normal; }
  .jh-enc-speech {
    background:rgba(255,255,255,.06); border-left:3px solid rgba(120,200,120,.5);
    padding:8px 10px; border-radius:4px; margin-bottom:10px;
    font-style:italic; color:#c8dcc8; line-height:1.6;
  }
  .jh-enc-btns { display:flex; gap:8px; }
  .jh-btn-talk, .jh-btn-pass {
    flex:1; padding:6px; border-radius:6px; border:none; cursor:pointer;
    font-size:12px; transition:all .2s;
  }
  .jh-btn-talk {
    background:rgba(80,180,80,.25); color:#a0e8a0; border:1px solid rgba(80,180,80,.4);
  }
  .jh-btn-talk:hover { background:rgba(80,180,80,.4); }
  .jh-btn-pass {
    background:rgba(255,255,255,.07); color:#a0b0a0; border:1px solid rgba(255,255,255,.12);
  }
  .jh-btn-pass:hover { background:rgba(255,255,255,.12); }

  /* ── NPC详情弹窗 ── */
  .jh-npc-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.7);
    z-index:9100; display:flex; align-items:center; justify-content:center;
    animation: jhFadeIn .25s;
  }
  @keyframes jhFadeIn { from{opacity:0} to{opacity:1} }
  .jh-npc-sheet {
    background: linear-gradient(160deg,#0d1a0d,#111b11);
    border: 1px solid rgba(120,200,120,.3);
    border-radius: 14px;
    width: min(480px,95vw);
    max-height: 85vh;
    overflow-y: auto;
    padding: 20px;
    color: #d4e8d4;
    scrollbar-width: thin;
  }
  .jh-npc-head {
    display:flex; align-items:flex-start; gap:14px;
    border-bottom: 1px solid; padding-bottom:14px; margin-bottom:14px; position:relative;
  }
  .jh-npc-avatar-big { font-size:44px; line-height:1; }
  .jh-npc-bigname { font-size:22px; font-weight:700; color:#e8f5e8; }
  .jh-npc-bigtitle { font-size:14px; color:#90a490; margin-bottom:6px; }
  .jh-npc-tags { display:flex; flex-wrap:wrap; gap:5px; }
  .jh-tag {
    padding:2px 8px; border-radius:20px; font-size:11px;
    background:rgba(255,255,255,.08); color:#a0b8a0;
  }
  .jh-tag-p {
    padding:2px 8px; border-radius:20px; font-size:11px;
    background:rgba(120,200,120,.1); color:#80c080;
  }
  .jh-close-btn {
    position:absolute; right:0; top:0; background:none; border:none;
    color:#688; font-size:16px; cursor:pointer; padding:4px;
  }
  .jh-rel-bar { margin-bottom:14px; }
  .jh-rel-label { font-size:13px; font-weight:600; margin-bottom:5px; }
  .jh-rel-track {
    height:6px; background:rgba(255,255,255,.08); border-radius:3px; overflow:hidden;
    margin-bottom:4px;
  }
  .jh-rel-fill { height:100%; border-radius:3px; transition:width .4s; }
  .jh-rel-encounters { font-size:11px; color:#688; }
  .jh-section { margin-bottom:16px; }
  .jh-section-title {
    font-size:12px; color:#689; text-transform:uppercase; letter-spacing:.5px;
    margin-bottom:8px; border-bottom:1px solid rgba(120,200,120,.15); padding-bottom:4px;
  }
  .jh-bg-text { font-size:13px; color:#b0c8b0; line-height:1.7; }
  .jh-dialog-list { display:flex; flex-direction:column; gap:6px; }
  .jh-dialog-item {
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
    border-radius:8px; padding:8px 12px; cursor:pointer; transition:all .2s;
  }
  .jh-dialog-item:not(.locked):hover {
    background:rgba(80,180,80,.12); border-color:rgba(80,180,80,.3);
  }
  .jh-dialog-item.locked { opacity:.5; cursor:default; }
  .jh-d-text { font-size:13px; color:#d4e8d4; }
  .jh-locked-text { color:#688; }
  .jh-d-rel { font-size:12px; font-weight:600; }
  .jh-d-rel.pos { color:#80d080; }
  .jh-d-rel.neg { color:#e07070; }
  .jh-d-req { font-size:11px; color:#566; }
  .jh-empty { color:#556; font-size:13px; font-style:italic; text-align:center; padding:10px; }

  /* 关系网 */
  .jh-rel-net { display:flex; flex-direction:column; gap:6px; }
  .jh-rel-net-item {
    display:flex; align-items:center; gap:8px; font-size:13px;
    padding:4px 8px; border-radius:6px; background:rgba(255,255,255,.04);
  }
  .jh-rn-avatar { font-size:16px; }
  .jh-rn-name { color:#c4dcc4; min-width:60px; }
  .jh-rn-rel.pos { color:#80c080; font-size:12px; }
  .jh-rn-rel.neg { color:#e08080; font-size:12px; }

  /* ── 对话结果弹窗 ── */
  .jh-dialog-result-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:9200;
    display:flex; align-items:center; justify-content:center; animation:jhFadeIn .2s;
  }
  .jh-dialog-result {
    background:linear-gradient(160deg,#0d1a0d,#111b11);
    border:1px solid rgba(120,200,120,.35); border-radius:14px;
    padding:24px; width:min(400px,90vw); color:#d4e8d4;
  }
  .jh-dr-speaker { font-size:16px; font-weight:700; color:#e8f5e8; margin-bottom:12px; }
  .jh-dr-reply {
    font-size:14px; color:#c0d8c0; line-height:1.7; font-style:italic;
    background:rgba(255,255,255,.06); padding:12px; border-radius:8px;
    border-left:3px solid rgba(120,200,120,.4); margin-bottom:14px;
  }
  .jh-dr-effect { font-size:13px; font-weight:600; margin-bottom:14px; text-align:center; }
  .jh-dr-effect.pos { color:#80d080; }
  .jh-dr-effect.neg { color:#e07070; }
  .jh-dr-btns { display:flex; gap:10px; justify-content:flex-end; }
  .jh-dr-btns button {
    padding:6px 16px; border-radius:8px; border:none; cursor:pointer;
    background:rgba(80,180,80,.2); color:#a0e0a0; font-size:13px;
    border:1px solid rgba(80,180,80,.3); transition:all .2s;
  }
  .jh-dr-btns button:hover { background:rgba(80,180,80,.35); }

  /* ── 人物志总览页 ── */
  .jh-page-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.8); z-index:9050;
    display:flex; justify-content:center; overflow-y:auto; padding:20px;
    animation:jhFadeIn .25s;
  }
  .jh-page {
    background:linear-gradient(160deg,#0c180c,#101810);
    border:1px solid rgba(120,200,120,.25); border-radius:16px;
    width:min(680px,100%); height:fit-content; padding:24px; color:#d4e8d4;
  }
  .jh-page-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:20px; flex-wrap:wrap; gap:8px;
  }
  .jh-page-title { font-size:20px; font-weight:700; color:#e8f5e8; }
  .jh-rep-badge {
    background:rgba(255,255,255,.07); border-radius:20px;
    padding:4px 12px; font-size:13px; color:#a0c0a0;
  }
  .jh-align.good { color:#80d080; margin-left:6px; }
  .jh-align.evil { color:#e07070; margin-left:6px; }
  .jh-npc-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px;
  }
  .jh-npc-card {
    background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
    border-radius:10px; padding:10px 8px; text-align:center; cursor:pointer;
    transition:all .2s;
  }
  .jh-npc-card:not(.unknown):hover {
    background:rgba(80,180,80,.12); border-color:rgba(80,180,80,.35);
    transform:translateY(-2px);
  }
  .jh-npc-card.unknown { opacity:.5; cursor:default; filter:grayscale(.8); }
  .jh-card-avatar { font-size:28px; margin-bottom:4px; }
  .jh-card-name { font-size:13px; font-weight:600; color:#d8ecd8; }
  .jh-card-title { font-size:11px; color:#80a080; margin-bottom:5px; }
  .jh-card-rel { font-size:11px; margin-bottom:4px; }
  .jh-card-relbar { background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; }

  /* 关系颜色 */
  .rel-lover   { color:#ff6b9d; font-weight:600; }
  .rel-teacher { color:#64b5f6; }
  .rel-student { color:#64b5f6; }
  .rel-brother { color:#ff9fc8; }
  .rel-friend  { color:#80d080; }
  .rel-neutral { color:#90a4ae; }
  .rel-hostile { color:#ff8060; }
  .rel-enemy   { color:#ff4040; }
  `;
  document.head.appendChild(style);
})();

// ════════════════════════════════════════════════════════════════
//  十一、扩充具名NPC（21-30）
// ════════════════════════════════════════════════════════════════
Object.assign(JIANGHU_NPC_DB, {

  // ── 21. 一刀流 · 江楠（女刀客，独行侠）──
  npc_jiang_nan: {
    id: 'npc_jiang_nan',
    name: '江楠',
    title: '一刀定江山',
    sect: 'tianlong',
    faction: FACTION.ZHONGLI,
    gender: 'female',
    age: 27,
    avatar: '🗡️',
    locations: ['cangzhou', 'yangzhou', 'nanjing', 'xuzhou'],
    personality: ['话少力足', '恩怨分明', '护短'],
    background: '出身草莽，凭着一把朴刀打遍南北。不属任何门派，却受各派尊重。曾在一夜之间连杀十二名刺客，从此名震江湖。话很少，但开口必是要紧事。见过血的眼睛，让人不敢直视。',
    secret: '刀法来自一本残卷，她发现残卷中另有半部，正是她的杀父仇人所持。',
    greetings: [
      '（点头，无话）',
      '有事说事。',
      '你知道我的刀，那就别惹我。',
    ],
    dialogs: [
      { id:'d_jn_01', text:'问她刀法的路数', minRel:0,
        reply:'刀无花法，就一个字——快。下手快，下决心也要快。',
        relDelta:5 },
      { id:'d_jn_02', text:'请她喝酒', minRel:20,
        reply:'（坐下，自己倒酒）江楠不拒好酒。（喝完一碗，话明显多了）你这人还行。',
        relDelta:18, action:'drink_with_jn' },
      { id:'d_jn_03', text:'帮她查残卷下落（关系≥40）', minRel:40,
        reply:'（手微微收紧）……你怎么知道这事。（沉默后）你若真能找到那半部，我欠你一条命。',
        relDelta:20, questId:'jh_quest_half_manual' },
      { id:'d_jn_04', text:'结为义姐妹（关系≥70）', minRel:70,
        reply:'（沉默看你良久，最终拔刀，刀背轻拍你肩）……江楠从不轻易认人，但你……算了，以后叫我姐。',
        relDelta:30, action:'sworn_sister_jn' },
    ],
    initRel: { zhengdao: 5, zhongli: 20, xiedao: -10, chaoting: -15 },
    npcRelations: {
      npc_wu_santong:    { val:  35, type: REL_TYPE.FRIEND, note: '吴三通常常帮她打探消息' },
      npc_bai_luochen:   { val: -20, type: REL_TYPE.RIVAL,  note: '路数相近，但道不同' },
      npc_lei_potian:    { val:  40, type: REL_TYPE.FRIEND, note: '同样崇尚实战，酒友' },
    },
    quests: ['jh_quest_half_manual'],
  },

  // ── 22. 剑痴 · 柳如烟（剑道研究者，散漫天才）──
  npc_liu_ruyan: {
    id: 'npc_liu_ruyan',
    name: '柳如烟',
    title: '剑痴',
    sect: 'wudang',
    faction: FACTION.ZHENGDAO,
    gender: 'female',
    age: 25,
    avatar: '🌙',
    locations: ['wudang', 'hangzhou', 'luoyang', 'huayin'],
    personality: ['痴迷剑道', '心不在焉', '偶尔惊艳'],
    background: '武当山天赋最高却最散漫的弟子。别的师兄师姐苦练打坐，她整天研究各派剑谱、走神发呆，但每次比武又是第一。师父说她是"剑道天生之人，非人力可追"。',
    secret: '已经悟出了一门融合各派精髓的剑法，但觉得还差一点，不肯出手。',
    greetings: [
      '（回神）啊？你说什么，我刚才在想一个剑式……',
      '你用剑还是用刀？我在研究两者的破解之道，能切磋一下吗？',
      '（盯着空气）这一招的收势应该……哦，你来了。',
    ],
    dialogs: [
      { id:'d_lr_01', text:'和她探讨剑法', minRel:0,
        reply:'（立刻精神起来）！！这招我想了三天了！你是说发力点在腕关节？让我试试——（拔剑，剑气扑面）',
        relDelta:15 },
      { id:'d_lr_02', text:'请她展示剑法', minRel:25,
        reply:'（一声叹气，拔剑）好，你看仔细——（剑光如流水，三十六式一气呵成，令人目眩）……就这样，懂了吗？',
        relDelta:12, action:'view_sword_demo' },
      { id:'d_lr_03', text:'帮她收集各派剑谱残本（关系≥35）', minRel:35,
        reply:'你真的愿意帮我？！（眼睛大亮）太好了！我需要少林拳经、华山剑典、崆峒散章——你帮我找来，我教你那套融合剑法！',
        relDelta:25, questId:'jh_quest_sword_scrolls' },
      { id:'d_lr_04', text:'问她悟出的新剑法（关系≥60）', minRel:60,
        reply:'（犹豫了很久）……其实已经成了。但我怕教给别人，会被人拿去伤人。你……你应该不会的，对吧。',
        relDelta:20, action:'learn_fusion_sword' },
    ],
    initRel: { zhengdao: 20, zhongli: 10, xiedao: -15, chaoting: 0 },
    npcRelations: {
      npc_pei_changfeng: { val:  40, type: REL_TYPE.FRIEND,  note: '相互欣赏对方的剑法' },
      npc_qin_xiaoman:   { val:  50, type: REL_TYPE.FRIEND,  note: '一起旅行研究武学' },
      npc_yue_guyun:     { val:  45, type: REL_TYPE.FRIEND,  note: '老剑仙给她指点过' },
    },
    quests: ['jh_quest_sword_scrolls'],
  },

  // ── 23. 毒蛇堂 · 谭破军（邪道刽子手，嗜血）──
  npc_tan_pojun: {
    id: 'npc_tan_pojun',
    name: '谭破军',
    title: '毒蛇煞',
    sect: 'xuanming',
    faction: FACTION.XIEDAO,
    gender: 'male',
    age: 40,
    avatar: '🐍',
    locations: ['yanmen', 'datong', 'youzhou'],
    personality: ['嗜杀', '自傲', '偶有恻隐'],
    background: '玄冥教的执法长老，人称"毒蛇煞"。执行过无数次刺杀任务，从未失手。玄冥教内他的权威仅次于教主。虽然杀戮是他的本性，却有一条铁律：不杀孩子。这是他唯一的底线。',
    secret: '年轻时曾是正道弟子，因一次意外杀了自己的师父，被迫走上邪路。内心深处是否有悔恨，只有他自己知道。',
    greetings: [
      '（阴沉地看你）你找我，是找死，还是找活路？',
      '我听说你最近一直在江湖上搅风搅雨……有意思。',
      '本堂的规矩：没有不能杀的人，只有还没有到时候的人。',
    ],
    dialogs: [
      { id:'d_tp_01', text:'问他是否会接自己的命', minRel:-50,
        reply:'（冷笑）若接了，你已经死了。不过……你这个人挺有意思，还没到那时候。',
        relDelta:8 },
      { id:'d_tp_02', text:'问他当年的事（关系≥30）', minRel:30,
        reply:'（表情骤变，随即恢复冷漠）你查了我的底？……（沉默许久）那件事和你有什么关系。',
        relDelta:10 },
      { id:'d_tp_03', text:'帮他做一件事（不问缘由）', minRel:0,
        reply:'（眯眼）不问缘由？……（把玩着刀柄）这种人不是蠢就是强。你是哪种？',
        relDelta:15, questId:'jh_quest_silent_errand' },
      { id:'d_tp_04', text:'揭穿他的过去并说"不晚"（关系≥60）', minRel:60,
        reply:'（长久沉默，手握拳松开了又握）……你凭什么说不晚。（眼眶微红，立刻别过脸）……滚。',
        relDelta:35 },
    ],
    initRel: { zhengdao: -40, zhongli: -10, xiedao: 15, chaoting: -30 },
    npcRelations: {
      npc_bai_luochen:   { val:  30, type: REL_TYPE.FRIEND,  note: '同属玄冥，有些惺惺相惜' },
      npc_meng_qiubai:   { val: -50, type: REL_TYPE.ENEMY,   note: '孟秋白追了他十年' },
      npc_he_yisheng:    { val: -20, type: REL_TYPE.RIVAL,   note: '曾有数次正面交锋' },
    },
    quests: ['jh_quest_silent_errand'],
  },

  // ── 24. 书剑侠 · 裴思明（文武兼修，正道学子）──
  npc_pei_siming: {
    id: 'npc_pei_siming',
    name: '裴思明',
    title: '书剑双绝',
    sect: 'guigu',
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 28,
    avatar: '📚',
    locations: ['luoyang', 'kaifeng', 'nanjing', 'hangzhou'],
    personality: ['博学', '热血', '有时冲动'],
    background: '鬼谷门弟子，苏清河的得意门生。文章可安天下，剑法可定乾坤——至少他本人是这么认为的。理想是走遍江湖，写出一部记录这个时代所有英雄的《江湖志》。常常因为记笔记而在战斗中分心。',
    secret: '《江湖志》已经写了一半，里面有很多当事人不知道的秘密，若泄露出去，半个江湖都会乱。',
    greetings: [
      '（在写字）稍等，我把这段话记完——好了！你是……（翻记录本）见过吗？',
      '天啊！你就是那个……我听说过你！能采访你一下吗？！',
      '玄机先生的弟子，裴思明。你有故事吗？我在收集。',
    ],
    dialogs: [
      { id:'d_ps_01', text:'讲一段自己的经历给他记录', minRel:0,
        reply:'（奋笔疾书，眼睛发光）！！这段太精彩了！你描述的时候能不能再生动一点——他的眼睛是什么颜色的？',
        relDelta:20 },
      { id:'d_ps_02', text:'帮他打探某个英雄的下落', minRel:20,
        reply:'你愿意帮我！太好了！我需要找到那位"翠竹老剑客"，据说他每十年才下山一次，这次说不定……',
        relDelta:15, questId:'jh_quest_find_recluse' },
      { id:'d_ps_03', text:'问他《江湖志》写到哪了', minRel:35,
        reply:'（神秘一笑）写了……很多了。（压低声音）里面有几段，我自己看着都心跳加速，但我不能说是谁。',
        relDelta:10 },
      { id:'d_ps_04', text:'结为义兄弟（关系≥65）', minRel:65,
        reply:'（呆住，随即大喜）你愿意？！（立刻掏出记录本）等等我先记下来——不对不对，先结拜！',
        relDelta:30, action:'sworn_brother_ps' },
    ],
    initRel: { zhengdao: 20, zhongli: 15, xiedao: -15, chaoting: 5 },
    npcRelations: {
      npc_su_qinghe:     { val:  80, type: REL_TYPE.TEACHER, note: '师父，最崇拜的人' },
      npc_qin_xiaoman:   { val:  45, type: REL_TYPE.FRIEND,  note: '一起旅行时记录过她的事迹' },
      npc_chen_guichen:  { val:  25, type: REL_TYPE.FRIEND,  note: '觉得他身上有大秘密' },
    },
    quests: ['jh_quest_find_recluse'],
  },

  // ── 25. 冰心道长 · 玄清（武当女道士，冷静如水）──
  npc_xuan_qing: {
    id: 'npc_xuan_qing',
    name: '玄清',
    title: '冰心道长',
    sect: 'wudang',
    faction: FACTION.ZHENGDAO,
    gender: 'female',
    age: 35,
    avatar: '☯️',
    locations: ['wudang', 'xian', 'luoyang'],
    personality: ['沉静如水', '原则极强', '一旦认定不回头'],
    background: '武当山戒律院首座，掌管门规戒律。表面冷淡，实则心细如发。凡事看得透彻，不轻易开口，一旦开口必有深意。曾经驱逐过三名违反门规的弟子，其中一名是她的同门师兄。',
    secret: '十年前曾经下山追杀一个仇人，那个人当时只有十二岁。她追上了，但最终放手了——这是她终生的自我拷问。',
    greetings: [
      '（打量你一眼）你来武当，是为了拜师还是有事？',
      '贫道玄清，武当山戒律院。你没有违规吧？',
      '（沉默地看你半晌）……你心里藏着一件事没说出来。',
    ],
    dialogs: [
      { id:'d_xq_01', text:'向她请教道法', minRel:0,
        reply:'道法自然，无为而治。你现在做的事情，顺势而为了吗？（停顿）你好好想想。',
        relDelta:8 },
      { id:'d_xq_02', text:'问她当年放走那个孩子', minRel:50,
        reply:'（手中茶盏轻轻放下）……你查到了这件事。（沉默很久）那孩子是无辜的，我没有办法杀一个孩子。但我也没有颜面再提此事。',
        relDelta:15 },
      { id:'d_xq_03', text:'请求她的庇护（关系≥40）', minRel:40,
        reply:'（点头）若是正当之事，武当不会袖手。说来听听。',
        relDelta:15, action:'wudang_protection' },
      { id:'d_xq_04', text:'拜她为师（声望≥300，关系≥70）', minRel:70,
        reply:'（沉默，细看你良久）……你有修道的根骨。但我的规矩很严，若你能做到，我便收你。',
        relDelta:30, action:'apprentice_xq', minFame:300 },
    ],
    initRel: { zhengdao: 20, zhongli: 5, xiedao: -35, chaoting: 5 },
    npcRelations: {
      npc_pei_changfeng: { val:  40, type: REL_TYPE.FRIEND,  note: '同为正道，互相尊重' },
      npc_liu_ruyan:     { val:  50, type: REL_TYPE.FRIEND,  note: '自家师妹，又爱又头疼' },
      npc_leng_yuesha:   { val: -25, type: REL_TYPE.RIVAL,   note: '道不同不相为谋' },
    },
    quests: ['jh_quest_wudang_secret'],
  },

  // ── 26. 丐帮双煞之一 · 卢大虎（豪爽莽汉，讲义气）──
  npc_lu_dahu: {
    id: 'npc_lu_dahu',
    name: '卢大虎',
    title: '天地双煞',
    sect: 'tiandibang',
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 36,
    avatar: '🐯',
    locations: ['cangzhou', 'xuzhou', 'kaifeng', 'yangzhou'],
    personality: ['天不怕地不怕', '讲义气', '不善谋略'],
    background: '天地帮左护法，吴三通的左膀右臂。拳脚功夫极硬，打架从不用兵器，一双铁拳打遍南北。脑子不太灵光，但心是好的。帮中兄弟无论大事小事都愿意替他们扛。',
    secret: '其实内功已经达到了极高境界，但他自己不知道，因为从没认真学过内功理论。',
    greetings: [
      '哎！老大的朋友就是我的朋友！来，喝酒！',
      '什么？你有困难？大虎哥帮你！',
      '（打了一个嗝）刚才喝了二十碗……你来了正好，再喝二十碗！',
    ],
    dialogs: [
      { id:'d_ld_01', text:'和他比比拳脚', minRel:0,
        reply:'（立刻跳起来）！！好！真是好汉！来！（全力出拳，带着巨风）',
        relDelta:20, action:'duel_lu' },
      { id:'d_ld_02', text:'请他办一件力气活', minRel:15,
        reply:'力气活？大虎最擅长了！说！什么事？扛多重？多远？',
        relDelta:10, questId:'jh_quest_muscle_job' },
      { id:'d_ld_03', text:'结为义兄弟（关系≥60）', minRel:60,
        reply:'真的？！（眼眶红了）大虎从小没兄弟，我一直想……（猛地抱住你，劲道极大）兄弟！！',
        relDelta:35, action:'sworn_brother_lu' },
    ],
    initRel: { zhengdao: 20, zhongli: 15, xiedao: -10, chaoting: -5 },
    npcRelations: {
      npc_wu_santong:    { val:  80, type: REL_TYPE.FRIEND,  note: '誓死效忠的老大' },
      npc_zhao_wuji:     { val: -40, type: REL_TYPE.ENEMY,   note: '曾和他打过大架' },
      npc_lei_potian:    { val:  50, type: REL_TYPE.FRIEND,  note: '力量相当，引为知己' },
    },
    quests: ['jh_quest_muscle_job'],
  },

  // ── 27. 望月楼主 · 席珠儿（情报花魁，不可小觑）──
  npc_xi_zhuier: {
    id: 'npc_xi_zhuier',
    name: '席珠儿',
    title: '望月楼主',
    sect: null,
    faction: FACTION.ZHONGLI,
    gender: 'female',
    age: 29,
    avatar: '🌹',
    locations: ['yangzhou', 'hangzhou', 'suzhou', 'nanjing'],
    personality: ['八面玲珑', '心思深沉', '刀子藏在笑里'],
    background: '望月楼老板娘，江南最大的消息集散地。表面上是个卖笑卖艺的花魁，实则手中掌握着半个江湖的隐秘。各派都不敢动她，因为她知道每个人的把柄。笑起来最甜，下手最快。',
    secret: '望月楼背后是一个已消亡的神秘组织的分支，席珠儿是最后一任联络人，她在等一道指令。',
    greetings: [
      '（娇笑）哟，贵客来了！楼里最好的房间，给你留着呢~',
      '耳报神说你要来，本楼主准备了好茶，坐下慢聊。',
      '消息嘛，有的。价钱嘛，你出得起吗？',
    ],
    dialogs: [
      { id:'d_xz_01', text:'购买一档情报（20两）', minRel:0,
        reply:'（轻扇团扇）你倒是爽快。（侧身低声）最近某大派的二当家，好像有些不老实……',
        relDelta:5, action:'buy_intel_xz' },
      { id:'d_xz_02', text:'问她望月楼的真实身份', minRel:40,
        reply:'（笑容不变，眼神一冷）好奇心太重，不是好习惯。但……你问得出来，说明你够聪明。',
        relDelta:10 },
      { id:'d_xz_03', text:'请她跟踪某人（关系≥50）', minRel:50,
        reply:'（把玩团扇）盯人的事本楼主最擅长。但这个价……（伸出三根手指）三十两，加你一个人情。',
        relDelta:10, questId:'jh_quest_shadow_tail' },
      { id:'d_xz_04', text:'问她那道指令（关系≥75）', minRel:75,
        reply:'（收起笑容，第一次直视你的眼睛）……你知道了？（叹气）好，你是可以信任的人。那道指令，说的是你。',
        relDelta:40, action:'xi_secret_reveal' },
    ],
    initRel: { zhengdao: 5, zhongli: 20, xiedao: 5, chaoting: -20 },
    npcRelations: {
      npc_xu_muyun:      { val:  45, type: REL_TYPE.FRIEND,  note: '情报行同行，互通有无' },
      npc_zhao_wuji:     { val: -30, type: REL_TYPE.RIVAL,   note: '他想收购望月楼，她没答应' },
      npc_jiang_lingbo:  { val:  35, type: REL_TYPE.FRIEND,  note: '琴声是她最爱的表演' },
    },
    quests: ['jh_quest_shadow_tail'],
  },

  // ── 28. 铸剑师 · 欧冶风（神兵铸造者）──
  npc_ouye_feng: {
    id: 'npc_ouye_feng',
    name: '欧冶风',
    title: '当世铸剑第一',
    sect: null,
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 55,
    avatar: '🔥',
    locations: ['jinyang', 'cangzhou', 'luoyang'],
    personality: ['专注', '骄傲', '视神兵如子'],
    background: '江湖中公认的第一铸剑师，欧冶子一脉传人。每把剑都有名有姓，他说"铸剑如育人，心不诚则剑不灵"。从不接钱多的订单，只接有缘的武者。铸出的剑被认为都有灵性，可与主人共鸣。',
    secret: '手中有一块天外陨铁，已保存三十年，在等一个有资格用它的人。',
    greetings: [
      '（不抬头，锤声不停）等一下，这一刀不能停。',
      '来看剑的？还是要订剑？',
      '你手上拿的那把……（终于抬头）嗯，不错的铁，但主人配不上它。',
    ],
    dialogs: [
      { id:'d_oyf_01', text:'请他鉴定手中兵器', minRel:0,
        reply:'（拿起细看，沉吟）这剑……原主是个高手，但传到你手上还没有完全认主。需要花时间磨合。',
        relDelta:10, action:'weapon_appraise' },
      { id:'d_oyf_identify', text:'🔍 鉴定装备（收费）', minRel:0,
        reply:'（放下锤子）鉴定？我看看你带来了什么。',
        relDelta:0, action:'identify_equip' },
      { id:'d_oyf_02', text:'订制一把量身剑（500两）', minRel:20,
        reply:'（放下锤，正式看你）500两是买不了名剑的。但……你的气质还行。让我先看看你的武学路数，再决定要不要接单。',
        relDelta:15, questId:'jh_quest_custom_sword' },
      { id:'d_oyf_03', text:'问他天外陨铁（关系≥60）', minRel:60,
        reply:'（停下来，一字一顿）你知道这块铁……（打量你很久，最终叹气）……二十年了，终于等到一个说得过去的人。',
        relDelta:30, action:'ouye_meteorite' },
    ],
    initRel: { zhengdao: 10, zhongli: 25, xiedao: 0, chaoting: 5 },
    npcRelations: {
      npc_lei_potian:    { val:  30, type: REL_TYPE.FRIEND,  note: '崆峒弟子，铸过几件兵器' },
      npc_bai_luochen:   { val: -15, type: REL_TYPE.RIVAL,   note: '曾拒绝为他铸杀人刀' },
      npc_pei_changfeng: { val:  35, type: REL_TYPE.FRIEND,  note: '华山剑法精纯，值得铸剑' },
    },
    quests: ['jh_quest_custom_sword'],
  },

  // ── 29. 河神堂主 · 水老三（水匪出身，洗手上岸）──
  npc_shui_laosan: {
    id: 'npc_shui_laosan',
    name: '水老三',
    title: '河神三爷',
    sect: 'tiandibang',
    faction: FACTION.ZHONGLI,
    gender: 'male',
    age: 50,
    avatar: '⚓',
    locations: ['yangzhou', 'xuzhou', 'hangzhou', 'cangzhou'],
    personality: ['老油条', '护己护人', '刀子嘴豆腐心'],
    background: '年轻时是长江上赫赫有名的水匪，四十岁洗手上岸开了个摆渡行，如今是扬州码头的隐形老大。认识他的人没有一个敢惹，不认识他的人以为他只是个渡船老头。江湖恩怨处理得极为圆滑，从不得罪人。',
    secret: '年轻时手上有命案，那个人的家属还在找他。他一直在暗中接济那家人，希望有一天能了结此事。',
    greetings: [
      '上船，上船，老三的船不漏水！',
      '（磕烟杆）哟，又来了，是要消息还是要过河？',
      '我这人吧，走南闯北，见人无数，就你这个……有点看不透。',
    ],
    dialogs: [
      { id:'d_sls_01', text:'请他摆渡（免费）', minRel:0,
        reply:'免费？（哈哈大笑）小子有意思，行吧，今天老三心情好，上船！',
        relDelta:10, action:'free_ferry' },
      { id:'d_sls_02', text:'请他打听水上消息', minRel:15,
        reply:'（凑近，压低声音）水上的事我知道三成，码头的事我知道八成。你问什么？',
        relDelta:8, action:'buy_intel_water' },
      { id:'d_sls_03', text:'帮他了结那件旧事（关系≥50）', minRel:50,
        reply:'（突然不说话，良久后）……你查到了？（叹气，把烟杆放下）这件事我一直没法面对……你真的愿意帮老三？',
        relDelta:30, questId:'jh_quest_old_debt' },
    ],
    initRel: { zhengdao: 5, zhongli: 20, xiedao: 5, chaoting: -15 },
    npcRelations: {
      npc_wu_santong:    { val:  50, type: REL_TYPE.FRIEND,  note: '老友，一起打过水战' },
      npc_zhao_wuji:     { val: -25, type: REL_TYPE.RIVAL,   note: '漕运地盘争夺' },
      npc_xu_muyun:      { val:  30, type: REL_TYPE.FRIEND,  note: '信息互通，互有往来' },
    },
    quests: ['jh_quest_old_debt'],
  },

  // ── 30. 天命神童 · 魏子年（少年剑侠，野心与天真并存）──
  npc_wei_zinián: {
    id: 'npc_wei_zinián',
    name: '魏子年',
    title: '天命神童',
    sect: null,
    faction: FACTION.ZHENGDAO,
    gender: 'male',
    age: 16,
    avatar: '⚡',
    locations: ['kaifeng', 'luoyang', 'cangzhou', 'yangzhou'],
    personality: ['天真', '野心勃勃', '不服输'],
    background: '无门无派的少年剑客，被多个门派争抢收徒，全部拒绝了——他说要"自己打出一条路"。年纪最小，但实力已经超过大多数成年武人。对一切强者充满崇拜，对一切规则充满怀疑。',
    secret: '其实身上带着一块令牌，连他自己都不知道是什么，只知道父亲临死前叫他贴身保管。',
    greetings: [
      '（眼睛发亮）喂！你是不是很厉害！跟我过几招！',
      '我要成为江湖第一！你觉得我现在差在哪里？',
      '大人们说我太年轻，我偏要让他们看看。',
    ],
    dialogs: [
      { id:'d_wzy_01', text:'和他切磋一下', minRel:0,
        reply:'（拔剑，跃跃欲试）来！我已经等这个机会好久了！（打完）……我差在哪里？你告诉我！',
        relDelta:18, action:'duel_wei' },
      { id:'d_wzy_02', text:'给他指点', minRel:20,
        reply:'（认真听，边点头边比划）……是这样！原来如此！（立刻要再练一遍）等等别走，我再试试！',
        relDelta:15 },
      { id:'d_wzy_03', text:'帮他查父亲令牌的来历（关系≥40）', minRel:40,
        reply:'（犹豫，最终从怀里取出一块半残的令牌）……你见过这个吗？我爹说要保命……',
        relDelta:25, questId:'jh_quest_orphan_token' },
      { id:'d_wzy_04', text:'收他为弟子（关系≥60）', minRel:60,
        reply:'（大跳起来）师父！！（立刻跪下行礼，然后站起来，眼泪含在眼睛里）……我一定不让你失望！',
        relDelta:40, action:'take_apprentice_wei' },
    ],
    initRel: { zhengdao: 15, zhongli: 20, xiedao: -10, chaoting: 0 },
    npcRelations: {
      npc_pei_changfeng: { val:  35, type: REL_TYPE.FRIEND, note: '最崇拜的前辈' },
      npc_qin_xiaoman:   { val:  40, type: REL_TYPE.FRIEND, note: '像姐姐一样的存在' },
      npc_chen_guichen:  { val:  20, type: REL_TYPE.FRIEND, note: '命运相连，令牌之谜' },
    },
    quests: ['jh_quest_orphan_token'],
  },

});

// ════════════════════════════════════════════════════════════════
//  十二、Dialog Action 处理器
//  处理所有 d.action 字段对应的实际逻辑
// ════════════════════════════════════════════════════════════════

/**
 * 处理对话 action，返回额外效果描述（显示在结果弹窗）
 */
function jhDoAction(npcId, action, dialogData){
  const npc = JIANGHU_NPC_DB[npcId];
  switch(action){

    // ── 切磋/决斗 ──
    case 'duel_pei':
    case 'duel_lei':
    case 'duel_tiemu':
    case 'duel_lu':
    case 'duel_wei':{
      const playerLv = typeof edS !== 'undefined' ? (edS.level||1) : 1;
      const npcLv = { duel_pei:65, duel_lei:55, duel_tiemu:60, duel_lu:48, duel_wei:30 }[action]||50;
      const win = playerLv + Math.floor(Math.random()*20) > npcLv;
      const fameGain = win ? Math.floor(npcLv * 1.2) : Math.floor(npcLv * 0.3);
      jhAddFame(fameGain, win ? 5 : 0);
      if(win){
        jhChangeRel(npcId, 15, '切磋胜利');
        jhAddGrievance({ type:'bond', target:npcId, targetName:npc.name,
          reason:`与${npc.name}切磋，大获全胜` });
        return `⚔️ 切磋结果：<span style="color:#80ff80">你胜了！</span> 声名+${fameGain}，好感+15`;
      } else {
        jhChangeRel(npcId, 8, '切磋败北');
        return `⚔️ 切磋结果：<span style="color:#ff9060">你败了</span>（实力差距明显）声名+${fameGain}，好感+8（败者之勇）`;
      }
    }

    // ── 喝酒 ──
    case 'drink_with_wu':
    case 'drink_with_jn':{
      const cost = action === 'drink_with_wu' ? 5 : 8;
      if(hasSilver(cost)){
        spendSilver(cost);
        SilverManager.save();
        jhAddFame(10, 2);
        return `🍺 花费${cost}两酒钱，把酒言欢！声名+10，好感已加成`;
      } else {
        return `💸 身上银两不足${cost}两，喝酒计划落空…`;
      }
    }

    // ── 购买情报 ──
    case 'buy_intel_wu':
    case 'buy_intel_zhao':
    case 'buy_intel_tiered':
    case 'buy_intel_water':
    case 'buy_intel_xz':{
      const costs = { buy_intel_wu:10, buy_intel_zhao:20, buy_intel_tiered:15,
                      buy_intel_water:12, buy_intel_xz:20 };
      const cost = costs[action]||15;
      if(hasSilver(cost)){
        spendSilver(cost);
        SilverManager.save();
        const intels = [
          '某大派内部出现叛徒，正在秘密处置中……',
          '血骨门最近在招募死士，出手阔绰，怕是在谋划大事。',
          '朝廷密探已混入三个江湖门派，具体哪三个……有人知道，但不肯说。',
          '西域有一批失踪的商队，据说遇到了不该遇到的东西。',
          '有人在收购各门派的武学秘籍，价高得离谱，不知用意。',
          '近来江湖上频繁出现同一个印记，圈内人说那是一个消亡已久的组织的标记。',
        ];
        const intel = intels[Math.floor(Math.random()*intels.length)];
        return `👂 花费${cost}两，听闻消息：<br><em style="color:#c8d860">"${intel}"</em>`;
      } else {
        return `💸 银两不足，情报交易失败。`;
      }
    }

    // ── 义兄弟/义姐妹结拜 ──
    case 'sworn_brother_ps':
    case 'sworn_brother_lu':
    case 'sworn_sister_jn':{
      const rel = jhGetRel(npcId);
      if(rel.val < 65){
        return `❌ 与${npc.name}的好感度尚不足（需65以上），无法结拜。`;
      }
      if(rel.type === REL_TYPE.BROTHER){
        return `✅ 你与${npc.name}早已结为义兄弟/义姐妹！`;
      }
      rel.type = REL_TYPE.BROTHER;
      rel.val = Math.max(rel.val, 80);
      jianghuSave();
      jhAddFame(50, 10);
      jhAddGrievance({ type:'bond', target:npcId, targetName:npc.name,
        reason:`与${npc.name}（${npc.title}）结为义兄弟/义姐妹，情同手足` });
      showToast(`🩸 义结金兰！${npc.name}（${npc.title}）与你结为手足！好感已升至80+，声名+50`);
      return `🩸 <span style="color:#ff9fc8">义结金兰！</span>你与${npc.name}正式结为手足，恩仇共担，生死与共。声名+50`;
    }

    // ── 收徒 ──
    case 'apprentice_xq':
    case 'take_apprentice_wei':{
      const rel = jhGetRel(npcId);
      if(action === 'take_apprentice_wei'){
        // 玩家收魏子年为弟子
        rel.type = REL_TYPE.STUDENT;
        rel.val  = Math.max(rel.val, 85);
      } else {
        // 玄清收玩家为弟子
        rel.type = REL_TYPE.STUDENT;
        rel.val  = Math.max(rel.val, 80);
      }
      jianghuSave();
      jhAddFame(60, 15);
      const roleText = action === 'take_apprentice_wei' ? '你收魏子年为弟子' : `你拜玄清道长为师`;
      jhAddGrievance({ type:'bond', target:npcId, targetName:npc.name, reason:roleText });
      return `📚 <span style="color:#f0c060">师徒缘定！</span>${roleText}，从此薪火相传。声名+60`;
    }

    // ── 情缘触发（冷月纱）──
    case 'learn_ice_skill':{
      jhAddFame(20, 0);
      // 标记情缘前置（大幅提升告白成功率）
      if(typeof ROM !== 'undefined') ROM.markIceSkill('npc_leng_yuesha');
      const narr = [
        '冷月纱凝视你片刻，忽然叹了口气。',
        '"罢了……你若能练成冰魄心法的精髓，也算不枉我一番心意。"',
        '她伸出手，一股极寒内力渡入你体内——冰火交织，疼痛难忍，但你咬牙承受。',
        '"忍住。"她的声音很轻，却带着从未有过的温柔。',
        '半炷香后，你感觉经脉中多了一道冰凉气流。',
        '冷月纱收回手，转过身去："内力上限已增。若……若你想继续深造，日后可再来找我。"',
      ].join('<br>');
      return `❄️ <span style="color:#90d0ff">冷月纱倾心相授冰魄心法精要！</span><br><span style="color:#c0d8f0;font-size:12px;line-height:1.5">${narr}</span><br><span style="color:#80c0ff">内力上限+10（下次升级生效） · 好感+10 · 解锁情缘特殊加成</span>`;
    }

    // ── 学习技能 ──
    case 'learn_qinggong':
      jhAddFame(15, 3); return '🌬️ 习得逍遥轻功入门心法，移动速度+5%（战场效果）';
    case 'learn_detox':
      jhAddFame(15, 5); return '🌿 学会基础解毒运气法，战斗中毒性减免+10%';
    case 'learn_force_skill':
      jhAddFame(15, 0); return '💪 习得崆峒吐纳发力诀，力量属性+3，暴击伤害+5%';
    case 'learn_feidao':
      jhAddFame(20, 0); return '🎯 沙哈尔传授飞刀定心术，命中率+8%，首攻伤害+15%';
    case 'learn_strategy':
      jhAddFame(25, 5); return '🧠 玄机先生传授识人断势之法，气运+2，每日首战胜率+10%';
    case 'learn_qin_skill':
      jhAddFame(30, 5); return '🎵 习得琴音困敌初式，战斗中有20%概率使敌晕眩1回合';
    case 'learn_biluo':
      jhAddFame(25, 0); return '🌸 习得碧落心法第一层，气血上限+15，恢复速度×1.2';
    case 'learn_qimen':
      jhAddFame(35, 8); return '🔯 温无忧传授观气之法，战前预判敌方属性，气运+3';
    case 'learn_cavalry':
      jhAddFame(20, 0); return '🐎 习得草原骑战之术，移动力+10%，骑乘战斗伤害+20%';
    case 'learn_fusion_sword':
      jhAddFame(60, 10); return '⚔️ 习得柳如烟融汇百家的无名剑法，剑系技能伤害+20%，CD-1';
    case 'view_sword_demo':
      jhAddFame(10, 5); return '✨ 目睹柳如烟三十六式剑法演示，感悟+，下次升级额外获得1个技能点';
    case 'learn_yijinjing':
      jhAddFame(100, 20); return '☸️ 枯木禅师传授易筋经，气血上限+30，内力+20，攻防双提升';

    // ── 特殊事件 ──
    case 'donate_temple':
      jhAddFame(15, 10); return '🕊️ 香火钱5两，心怀善念，侠义+10，声名+15';
    case 'free_ferry':
      jhAddFame(5, 2); return '⛵ 免费摆渡，水老三好感+10（已加成）';
    case 'fortune_telling':
      return `🎴 卦象显示：近日有一场恶战，注意避开孤立无援之地。<br><em style="color:#c8a840">气运+1（本次会话有效）</em>`;
    case 'wen_fortune':
      return `🌌 温无忧命理推算：你命格中有「天机」二字，与某人的命运深度交缠。<br><em style="color:#c8a840">提示：陈归尘与你有命运关联</em>`;
    case 'jiang_play_music':
      return '🎵 姜凌波一曲既毕，令人心神澄静。<br><em style="color:#d060d0">内力自然恢复速度×1.5（本城镇停留期间）</em>';
    case 'zhao_threat':
      jhAddGrievance({ type:'enmity', target:npcId, targetName:npc.name,
        reason:'揭穿赵武极阴谋，对方翻脸警告' });
      return '⚠️ 赵武极已将你列为威胁，此后他的手下可能在城中对你不利。<br><em style="color:#ff8060">恩仇录：新增仇敌</em>';
    case 'chen_wary_event':
      return '🕵️ 陈归尘感到威胁，急忙转移……你的警告让他对你多了一份戒心与信任。<br><em style="color:#c8a840">主线提示：继续与陈归尘接触，可触发天机令主线</em>';
    case 'tianji_ling_reveal':
      jianghuState.mainFlags['tianji_ling_seen'] = true;
      jianghuSave();
      return '🪙 陈归尘出示了半块令牌……你发现自己身上某样东西似乎与它有所呼应。<br><em style="color:#f0c060">主线解锁：天机令之谜</em>';
    case 'xu_secret_reveal':
      jianghuState.mainFlags['xu_secret_revealed'] = true;
      jianghuSave();
      return '📜 徐慕云带你进入密室，展示了那个消亡组织的完整档案……<br><em style="color:#f0c060">情报+5条，主线进度更新</em>';
    case 'xi_secret_reveal':
      jianghuState.mainFlags['xi_secret_revealed'] = true;
      jianghuSave();
      return '🌹 席珠儿低声道出那道等待多年的指令……与天机令有关。<br><em style="color:#f0c060">隐藏支线解锁：望月楼的秘密</em>';
    case 'wu_help':
      return '🤝 吴三通承诺会派天地帮兄弟协助你，下次在各城镇遇到麻烦，他们会出面。<br><em style="color:#80d080">天地帮庇护：本月内在沧州/扬州/徐州减少50%仇敌遭遇</em>';
    case 'meng_report':
      jhAddFame(20, 15); return '⚖️ 向孟秋白举报恶人，官府备案。侠义+15，声名+20';
    case 'wudang_protection':
      jhAddFame(30, 10); return '⛩️ 武当山正式为你发出庇护令，玄冥教/日月神教在正道城市的通缉暂时失效。';
    case 'weapon_appraise':
      return '🔍 欧冶风鉴定完毕：你手中兵器成色上乘，若修缮磨砺，攻击力可再提升5%。<br><em style="color:#c8d860">携带至铁匠铺可升级</em>';
    case 'ouye_meteorite':
      jianghuState.mainFlags['ouye_meteorite_seen'] = true;
      jianghuSave();
      return '🌠 欧冶风展示三十年珍藏的天外陨铁——传说此铁铸剑，可破任何护甲。<br><em style="color:#f0c060">隐藏任务解锁：锻造神兵</em>';
    case 'form_alliance':
      jhAddFame(50, 0);
      jianghuState.mainFlags['steppe_alliance'] = true;
      jianghuSave();
      return '🐺 草原联盟缔结！铁木真烈在草原各部落为你传扬名声。<br><em style="color:#80d080">解锁：草原消息网络（可获取北境情报）声名+50</em>';
    case 'view_tianji_map':
      jianghuState.mainFlags['tianji_map_seen'] = true;
      jianghuSave();
      return '🗺️ 天机图揭示了未来数年内的江湖走势……血骨门之乱不过是序幕。<br><em style="color:#f0c060">主线提示更新：血骨门背后另有推手</em>';
    case 'eat_lamb':
      if(hasSilver(8)){
        spendSilver(8); SilverManager.save();
      }
      return '🍖 一顿烤全羊下肚，宾主尽欢！精力+20，与沙哈尔好感+20（已加成）';
    case 'wen_message_su':
      jianghuState.mainFlags['wen_message_delivered'] = true;
      jianghuSave();
      return '📮 你记住了温无忧的话，准备带给苏清河。<br><em style="color:#c8a840">找到苏清河传话，可获关系奖励</em>';
    case 'buy_intel_water':
      return '⚓ 水老三透露了一批水上消息（已记入情报栏）';
    case 'sworn_brother_ps':
      // 已在上面统一处理，此处兜底
      return '📚 你与裴思明结为义兄弟，这段情谊将被记入《江湖志》。';

    default:
      return '';
  }
}

// ════════════════════════════════════════════════════════════════
//  十三、恩仇录 UI 面板
// ════════════════════════════════════════════════════════════════

function jhShowGrievancePage(){
  const overlay = document.createElement('div');
  overlay.className = 'jh-page-overlay';
  overlay.id = 'jh-grv-overlay';

  const all = jianghuState.grievances || [];
  const active   = all.filter(g => !g.resolved);
  const resolved = all.filter(g =>  g.resolved);

  const renderEntry = (g) => {
    const typeIcon  = { enmity:'⚔️', grace:'🙏', bond:'🤝' }[g.type] || '📌';
    const typeLabel = { enmity:'仇怨', grace:'恩情', bond:'情义' }[g.type] || '其他';
    const typeColor = { enmity:'#ff8060', grace:'#80d0ff', bond:'#ff9fc8' }[g.type] || '#aaa';
    const npc = JIANGHU_NPC_DB[g.target];
    const avatar = npc ? npc.avatar : '👤';
    return `
      <div class="jh-grv-entry ${g.resolved?'resolved':''}">
        <div class="jh-grv-type" style="color:${typeColor}">${typeIcon} ${typeLabel}</div>
        <div class="jh-grv-body">
          <div class="jh-grv-who">${avatar} <strong>${g.targetName}</strong></div>
          <div class="jh-grv-reason">${g.reason}</div>
          ${g.date ? `<div class="jh-grv-date">第${g.date.month}月</div>` : ''}
          ${g.resolved ? `<div class="jh-grv-resolve">✅ 已了结：${g.resolveNote||''}</div>` : ''}
        </div>
      </div>
    `;
  };

  overlay.innerHTML = `
    <div class="jh-page" style="max-width:560px">
      <div class="jh-page-header">
        <div class="jh-page-title">📜 恩仇录</div>
        <div class="jh-rep-badge">未了结 ${active.length} · 已了结 ${resolved.length}</div>
        <button class="jh-close-btn" onclick="document.getElementById('jh-grv-overlay').remove()">✕</button>
      </div>

      ${active.length ? `
        <div class="jh-section">
          <div class="jh-section-title">未了结（${active.length}）</div>
          <div class="jh-grv-list">${active.map(renderEntry).join('')}</div>
        </div>
      ` : '<div class="jh-empty" style="margin:20px 0">✨ 当前无未了结的恩仇</div>'}

      ${resolved.length ? `
        <div class="jh-section">
          <div class="jh-section-title">已了结（${resolved.length}）</div>
          <div class="jh-grv-list">${resolved.map(renderEntry).join('')}</div>
        </div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(overlay);
}

// ════════════════════════════════════════════════════════════════
//  十四、人物志页面补充：恩仇录入口 + 更丰富的头部信息
// ════════════════════════════════════════════════════════════════

// 在原 jhShowJianghuPage 创建的 overlay 中补充恩仇录入口按钮
// 通过扩展 jhShowJianghuPage 实现

const _jhShowJianghuPage_orig = jhShowJianghuPage;
jhShowJianghuPage = function(){
  _jhShowJianghuPage_orig();
  // 在人物志弹窗顶部补充恩仇录按钮
  const page = document.querySelector('#jh-page-overlay .jh-page-header');
  if(page){
    const btn = document.createElement('button');
    btn.innerHTML = '📜 恩仇录';
    btn.onclick = jhShowGrievancePage;
    btn.style.cssText = `
      background:rgba(200,120,60,.2);border:1px solid rgba(200,120,60,.4);
      color:#e0a080;padding:3px 10px;border-radius:4px;font-size:11px;cursor:pointer;
      margin-left:8px;
    `;
    page.insertBefore(btn, page.querySelector('.jh-close-btn'));
  }
};

// ════════════════════════════════════════════════════════════════
//  十五、新NPC任务数据（添加到QUEST_DB兼容格式，在npc-data-map.js中的QUEST_DB外额外注册）
//  这里提供快捷注册函数，在jianghu.js加载完成后执行
// ════════════════════════════════════════════════════════════════

function jhRegisterQuests(){
  if(typeof QUEST_DB === 'undefined') return;
  const newQuests = {
    jh_quest_half_manual: {
      id:'jh_quest_half_manual', name:'刀诀残卷',
      icon:'🗡️', type:'travel', minRel:40,
      desc:'江楠的刀法来自一本残卷，另半部在她的杀父仇人手中。帮她找到仇人的下落，此人据说隐匿在北边某城。',
      reward:{ silver:120, exp:80, rel:30 }, rewardText:'120两 + 好感大增',
      triggerCity:null,
    },
    jh_quest_sword_scrolls: {
      id:'jh_quest_sword_scrolls', name:'汇典集萃',
      icon:'📚', type:'fetch', minRel:35,
      desc:'柳如烟需要少林拳经残本、华山剑典残本、崆峒散章各一册，帮她从各地搜集齐全。',
      reward:{ silver:80, exp:60, rel:25, manual:'fusion_sword_intro' }, rewardText:'80两 + 融合剑法心法',
      triggerCity:null,
    },
    jh_quest_silent_errand: {
      id:'jh_quest_silent_errand', name:'无声差事',
      icon:'📦', type:'deliver', minRel:0,
      desc:'谭破军交给你一个密封的木匣，指定送往某地，不许打开，不许问缘由。路上会有人拦截。',
      reward:{ silver:200, exp:100, rel:20 }, rewardText:'200两 + 谭破军好感',
      triggerCity:null,
    },
    jh_quest_find_recluse: {
      id:'jh_quest_find_recluse', name:'寻访翠竹老人',
      icon:'🎋', type:'travel', minRel:20,
      desc:'裴思明要寻访传说中的"翠竹老剑客"，此人每十年才下山一次，据说最近出没在某处深山。帮他打探下落。',
      reward:{ silver:60, exp:45, rel:20 }, rewardText:'60两 + 《江湖志》提及你',
      triggerCity:null,
    },
    jh_quest_wudang_secret: {
      id:'jh_quest_wudang_secret', name:'武当深处的秘密',
      icon:'☯️', type:'travel', minRel:40,
      desc:'玄清道长发现武当藏经阁深处有人动过，某部典籍被秘密复制了一份，追查是谁所为。',
      reward:{ silver:90, exp:70, rel:30 }, rewardText:'90两 + 武当内功秘法一式',
      triggerCity:null,
    },
    jh_quest_muscle_job: {
      id:'jh_quest_muscle_job', name:'护送大件货',
      icon:'💪', type:'travel', minRel:15,
      desc:'卢大虎帮中有批大件货物需要从沧州运到开封，路途不安全，需要护送人手。',
      reward:{ silver:70, exp:40, rel:15 }, rewardText:'70两 + 天地帮好感',
      triggerCity:null,
    },
    jh_quest_shadow_tail: {
      id:'jh_quest_shadow_tail', name:'暗中跟踪',
      icon:'👁️', type:'travel', minRel:50,
      desc:'席珠儿怀疑某人是奸细，但苦无实据。委托你在不惊动对方的情况下跟踪一天，记录其行踪。',
      reward:{ silver:100, exp:60, rel:20 }, rewardText:'100两 + 情报一条',
      triggerCity:null,
    },
    jh_quest_custom_sword: {
      id:'jh_quest_custom_sword', name:'量身铸剑',
      icon:'🔥', type:'fetch', minRel:20,
      desc:'欧冶风答应为你铸一把剑，但需要你先带来：精铁矿石×3、寒晶石×1，以及让他"看清楚你的武学路数"（达到40级以上）。',
      reward:{ silver:0, exp:80, item:'custom_sword_ouye' }, rewardText:'专属神兵（攻击+25，暴击+10%）',
      triggerCity:null, minLevel:40,
    },
    jh_quest_old_debt: {
      id:'jh_quest_old_debt', name:'旧账了结',
      icon:'⚓', type:'travel', minRel:50,
      desc:'水老三年轻时手上有条人命，那家人还在寻仇。帮他找到那家人，看能否以补偿代替报仇，了结这段旧债。',
      reward:{ silver:80, exp:60, rel:35 }, rewardText:'80两 + 水老三铭记大恩',
      triggerCity:null,
    },
    jh_quest_orphan_token: {
      id:'jh_quest_orphan_token', name:'令牌之谜',
      icon:'⚡', type:'travel', minRel:40,
      desc:'魏子年父亲留下的那半块令牌来历不明，帮他查清这块令牌的来历。据说与天机令有关……',
      reward:{ silver:50, exp:50, rel:30 }, rewardText:'50两 + 主线线索',
      triggerCity:null,
    },
  };
  Object.assign(QUEST_DB, newQuests);
}

// ════════════════════════════════════════════════════════════════
//  十六、补充 CSS（恩仇录样式）
// ════════════════════════════════════════════════════════════════
function injectGrievanceStyles(){
  const style = document.createElement('style');
  style.textContent = `
  .jh-grv-list { display:flex; flex-direction:column; gap:8px; }
  .jh-grv-entry {
    display:flex; gap:10px; align-items:flex-start;
    background:rgba(255,255,255,.04); border-radius:8px;
    padding:10px 12px; border:1px solid rgba(255,255,255,.06);
  }
  .jh-grv-entry.resolved { opacity:.5; }
  .jh-grv-type { font-size:11px; font-weight:700; min-width:50px; margin-top:2px; }
  .jh-grv-body { flex:1; min-width:0; }
  .jh-grv-who { font-size:14px; color:#e8f5e8; margin-bottom:4px; }
  .jh-grv-reason { font-size:13px; color:#a0c0a0; line-height:1.5; }
  .jh-grv-date { font-size:11px; color:#688; margin-top:3px; }
  .jh-grv-resolve { font-size:11px; color:#80d080; margin-top:4px; }
  .jh-dr-extra {
    background:rgba(255,255,255,.07); border-radius:6px;
    padding:8px 10px; font-size:12px; color:#c8d8c8;
    line-height:1.6; margin-bottom:12px;
  }
  `;
  document.head.appendChild(style);
}
injectGrievanceStyles();  // 执行恩仇录样式注入（位于 injectJianghuStyles 内）

// ── 初始化 ──
jianghuLoad();
// 注册新NPC任务（等QUEST_DB加载后）
if(typeof QUEST_DB !== 'undefined'){
  jhRegisterQuests();
} else {
  // 兜底：延迟注册
  setTimeout(jhRegisterQuests, 100);
}
// 江湖系统加载完成
// EOF
}

