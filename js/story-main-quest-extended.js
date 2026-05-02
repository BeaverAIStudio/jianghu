/**
 * ============================================================================
 * 主线剧情扩展模块 - StoryMainQuestExtended
 * ============================================================================
 * 
 * 《血骨门之乱》完整版 - 40+任务、多阵营、深度抉择
 * 
 * 扩展内容：
 * - 第一幕：8个任务（原4个）- 从无名小卒到江湖新秀
 * - 第二幕：8个任务（原5个）- 三碎片之争，各方势力登场
 * - 第三幕：7个任务（原3个）- 正道会盟，内鬼疑云
 * - 第四幕：7个任务（原3个）- 孤身潜入，正邪抉择
 * - 第五幕：7个任务（原3个）- 决战前夜，生死之战
 * - 第六幕：6个任务（原3个）- 战后余波，北疆伏笔
 * 
 * 新增系统：
 * - 阵营系统：正道/邪道/中立，影响剧情走向
 * - 关键抉择：10+重大选择，决定结局
 * - NPC关系：深度羁绊系统
 * - 时间线：剧情时间推进
 * 
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// 扩展主线任务数据库 - 43个任务
// ═══════════════════════════════════════════════════════════════════════════

const MAIN_QUEST_DATA_EXTENDED = {
  
  // ═════════════════════════════════════════════════════════════════════════
  // 第一幕：踏入江湖（8个任务）
  // ═════════════════════════════════════════════════════════════════════════
  
  mq_act1_start: {
    id: 'mq_act1_start',
    act: 1,
    chapter: '序章·乱世起',
    name: '神秘来信',
    desc: '你在故乡收到一封来自洛阳的密信，信中提及血骨门的阴谋，以及一个你从未听说的名字——玄铁令。发信人自称"鹤隐"，邀你前往洛阳一叙。',
    type: 'travel',
    targetCity: '洛阳',
    prev: null,
    next: 'mq_act1_arrive_luoyang',
    rewards: { exp: 100, silver: 50, morality: 0 },
    hint: '前往洛阳城，寻找发信人',
    cinema: 'act1_opening',
    importance: 'main',
  },
  
  mq_act1_arrive_luoyang: {
    id: 'mq_act1_arrive_luoyang',
    act: 1,
    chapter: '第一章·洛阳风云',
    name: '初入洛阳',
    desc: '洛阳城中暗流涌动。你在客栈落脚，听闻血骨门弟子在城中活动，百姓人心惶惶。需要先了解城中情况，再寻找鹤隐。',
    type: 'explore',
    targetCity: '洛阳',
    explorePoints: 3,
    prev: 'mq_act1_start',
    next: 'mq_act1_meet_heyin',
    rewards: { exp: 150, silver: 80, morality: 0 },
    hint: '在洛阳城中探索，收集情报',
    cinema: null,
    importance: 'main',
  },
  
  mq_act1_meet_heyin: {
    id: 'mq_act1_meet_heyin',
    act: 1,
    chapter: '第一章·洛阳风云',
    name: '初识鹤隐',
    desc: '在洛阳客栈的雅间，你终于见到了鹤隐——一位白发苍苍却精神矍铄的老者。他告诉你，血骨门正在收集玄铁令碎片，企图解开上古封印，获得毁天灭地的力量。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act1_arrive_luoyang',
    next: 'mq_act1_first_choice',
    rewards: { exp: 200, silver: 100, morality: 0 },
    hint: '在洛阳客栈与鹤隐对话',
    cinema: null,
    importance: 'main',
  },
  
  // 关键抉择1：是否接受使命
  mq_act1_first_choice: {
    id: 'mq_act1_first_choice',
    act: 1,
    chapter: '第一章·洛阳风云',
    name: '抉择：江湖之路',
    desc: '鹤隐问你："年轻人，你可愿为了这天下苍生，踏上这条充满危险的江湖之路？"你的选择将决定你的命运。',
    type: 'choice',
    choices: [
      { id: 'accept', text: '义不容辞，晚辈愿往', morality: 10, next: 'mq_act1_accept' },
      { id: 'hesitate', text: '此事重大，容我考虑', morality: 0, next: 'mq_act1_hesitate' },
      { id: 'refuse', text: '我只是一介草民，无力回天', morality: -5, next: 'mq_act1_refuse' },
    ],
    prev: 'mq_act1_meet_heyin',
    next: null, // 由选择决定
    rewards: { exp: 100, silver: 50 },
    hint: '做出你的选择',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act1_accept: {
    id: 'mq_act1_accept',
    act: 1,
    chapter: '第一章·洛阳风云',
    name: '踏上江湖',
    desc: '鹤隐欣慰地点头："好！有此决心，何愁大事不成？"他告诉你，沧州有血骨门的秘密据点，你的第一个任务是前去探查。',
    type: 'travel',
    targetCity: '沧州',
    prev: 'mq_act1_first_choice',
    next: 'mq_act1_cangzhou_arrival',
    rewards: { exp: 200, silver: 100, morality: 5 },
    hint: '前往沧州',
    cinema: null,
    importance: 'main',
  },
  
  mq_act1_hesitate: {
    id: 'mq_act1_hesitate',
    act: 1,
    chapter: '第一章·洛阳风云',
    name: '犹豫再三',
    desc: '鹤隐不恼，只是淡淡地说："犹豫是人之常情。但你要记住，有些机会，一旦错过便不再来。"你思考一夜，最终决定接受这个使命。',
    type: 'travel',
    targetCity: '沧州',
    prev: 'mq_act1_first_choice',
    next: 'mq_act1_cangzhou_arrival',
    rewards: { exp: 150, silver: 80, morality: 0 },
    hint: '前往沧州',
    cinema: null,
    importance: 'main',
  },
  
  mq_act1_refuse: {
    id: 'mq_act1_refuse',
    act: 1,
    chapter: '第一章·洛阳风云',
    name: '被迫卷入',
    desc: '你婉拒了鹤隐。然而就在你准备离开洛阳时，一群血骨门弟子袭击了你——他们误以为你是鹤隐的同党。你被迫反击，却也因此卷入了这场风波。',
    type: 'battle',
    targetEnemy: 'xuegu_recruit',
    enemyCount: 3,
    prev: 'mq_act1_first_choice',
    next: 'mq_act1_cangzhou_arrival',
    rewards: { exp: 300, silver: 150, morality: -5 },
    hint: '击败血骨门弟子',
    cinema: null,
    importance: 'main',
  },
  
  mq_act1_cangzhou_arrival: {
    id: 'mq_act1_cangzhou_arrival',
    act: 1,
    chapter: '第二章·沧州暗战',
    name: '沧州疑云',
    desc: '沧州城中，你发现血骨门的活动比想象中更加猖獗。城中百姓敢怒不敢言，镖局生意也受到了影响。你需要找到据点的具体位置。',
    type: 'explore',
    targetCity: '沧州',
    explorePoints: 3,
    prev: ['mq_act1_accept', 'mq_act1_hesitate', 'mq_act1_refuse'],
    next: 'mq_act1_rescue_zhongheng',
    rewards: { exp: 200, silver: 100, morality: 0 },
    hint: '在沧州收集据点情报',
    cinema: null,
    importance: 'main',
  },
  
  mq_act1_rescue_zhongheng: {
    id: 'mq_act1_rescue_zhongheng',
    act: 1,
    chapter: '第二章·沧州暗战',
    name: '营救钟恒',
    desc: '你得知沧州镖局的少镖头钟恒被血骨门抓走，关押在暗巷据点中。营救他或许能获得更多情报。',
    type: 'dungeon',
    dungeonId: 'story_cangzhou_hideout',
    prev: 'mq_act1_cangzhou_arrival',
    next: 'mq_act1_report_back',
    rewards: { exp: 500, silver: 300, morality: 10 },
    hint: '进入沧州暗巷据点，营救钟恒',
    cinema: null,
    importance: 'main',
  },
  
  mq_act1_report_back: {
    id: 'mq_act1_report_back',
    act: 1,
    chapter: '第二章·沧州暗战',
    name: '回报鹤隐',
    desc: '钟恒获救后，告诉你血骨门正在寻找三枚玄铁令碎片。你决定立即返回洛阳，向鹤隐汇报这一切。',
    type: 'travel',
    targetCity: '洛阳',
    prev: 'mq_act1_rescue_zhongheng',
    next: 'mq_act2_start',
    rewards: { exp: 300, silver: 200, morality: 5 },
    hint: '返回洛阳向鹤隐汇报',
    cinema: null,
    importance: 'main',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 第二幕：风云变色（8个任务）
  // ═════════════════════════════════════════════════════════════════════════
  
  mq_act2_start: {
    id: 'mq_act2_start',
    act: 2,
    chapter: '第三章·玄铁之谜',
    name: '玄铁令的秘密',
    desc: '鹤隐向你揭示了玄铁令的真相——上古神器，封印着足以毁灭武林的力量。三枚碎片分别藏于开封、扬州、凉州。你必须赶在血骨门之前找到它们。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act1_report_back',
    next: 'mq_act2_kaifeng_route',
    rewards: { exp: 300, silver: 200, morality: 0 },
    hint: '与鹤隐对话了解详情',
    cinema: 'act2_rising',
    importance: 'main',
  },
  
  mq_act2_kaifeng_route: {
    id: 'mq_act2_kaifeng_route',
    act: 2,
    chapter: '第三章·玄铁之谜',
    name: '前往开封',
    desc: '第一枚碎片据说在开封的黑市中流通。然而血骨门也已得知消息，你必须小心行事。',
    type: 'travel',
    targetCity: '开封',
    prev: 'mq_act2_start',
    next: 'mq_act2_blackmarket_info',
    rewards: { exp: 200, silver: 150, morality: 0 },
    hint: '前往开封',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_blackmarket_info: {
    id: 'mq_act2_blackmarket_info',
    act: 2,
    chapter: '第四章·开封黑市',
    name: '黑市探查',
    desc: '开封黑市鱼龙混杂，玄铁令碎片的消息引来了各方势力。你需要找到碎片的下落，同时避开血骨门的眼线。',
    type: 'explore',
    targetCity: '开封',
    explorePoints: 4,
    prev: 'mq_act2_kaifeng_route',
    next: 'mq_act2_fragment1_battle',
    rewards: { exp: 300, silver: 200, morality: 0 },
    hint: '在黑市中收集碎片情报',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_fragment1_battle: {
    id: 'mq_act2_fragment1_battle',
    act: 2,
    chapter: '第四章·开封黑市',
    name: '黑市夺宝',
    desc: '你找到了碎片的下落，但血骨门的追命使血爪也盯上了它。一场恶战在所难免。',
    type: 'dungeon',
    dungeonId: 'story_kaifeng_blackmarket',
    prev: 'mq_act2_blackmarket_info',
    next: 'mq_act2_fragment1_obtained',
    rewards: { exp: 600, silver: 400, morality: 5 },
    hint: '进入黑市地下，夺取碎片',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_fragment1_obtained: {
    id: 'mq_act2_fragment1_obtained',
    act: 2,
    chapter: '第四章·开封黑市',
    name: '第一枚碎片',
    desc: '你成功夺得第一枚玄铁令碎片。碎片入手时，你感到一股奇异的力量流入体内。鹤隐曾警告过你，碎片会影响持有者的心智...',
    type: 'choice',
    choices: [
      { id: 'keep', text: '小心保管碎片', morality: 5, next: 'mq_act2_yangzhou_prep' },
      { id: 'study', text: '研究碎片的力量', morality: -5, next: 'mq_act2_fragment_corruption' },
    ],
    prev: 'mq_act2_fragment1_battle',
    next: null,
    rewards: { exp: 400, silver: 300, item: 'item_xuantie_fragment_1' },
    hint: '做出选择',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act2_fragment_corruption: {
    id: 'mq_act2_fragment_corruption',
    act: 2,
    chapter: '第四章·开封黑市',
    name: '碎片侵蚀',
    desc: '你试图研究碎片的力量，却感到一阵眩晕。一个声音在你脑海中低语："力量...想要力量吗？"你勉强压制住这种冲动，但内心已种下了欲望的种子。',
    type: 'travel',
    targetCity: '扬州',
    prev: 'mq_act2_fragment1_obtained',
    next: 'mq_act2_yangzhou_arrival',
    rewards: { exp: 300, silver: 200, morality: -10 },
    hint: '前往扬州寻找第二枚碎片',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_yangzhou_prep: {
    id: 'mq_act2_yangzhou_prep',
    act: 2,
    chapter: '第四章·开封黑市',
    name: '准备南下',
    desc: '你将碎片小心收好，决定立即前往扬州。第二枚碎片在南宫世家手中，而南宫世家与血骨门素来不和，这或许是个机会。',
    type: 'travel',
    targetCity: '扬州',
    prev: 'mq_act2_fragment1_obtained',
    next: 'mq_act2_yangzhou_arrival',
    rewards: { exp: 300, silver: 200, morality: 5 },
    hint: '前往扬州',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_yangzhou_arrival: {
    id: 'mq_act2_yangzhou_arrival',
    act: 2,
    chapter: '第五章·扬州风云',
    name: '南宫世家',
    desc: '扬州南宫世家是江南武林的泰山北斗。然而当你到达时，却发现南宫世家正遭受血骨门的围攻！',
    type: 'explore',
    targetCity: '扬州',
    explorePoints: 3,
    prev: ['mq_act2_fragment_corruption', 'mq_act2_yangzhou_prep'],
    next: 'mq_act2_nangong_siege',
    rewards: { exp: 400, silver: 250, morality: 0 },
    hint: '了解南宫世家的情况',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_nangong_siege: {
    id: 'mq_act2_nangong_siege',
    act: 2,
    chapter: '第五章·扬州风云',
    name: '解困南宫',
    desc: '血骨门副门主血刃亲自带队围攻南宫世家。南宫家主南宫烈虽武功高强，但寡不敌众。你的出现或许能扭转战局。',
    type: 'dungeon',
    dungeonId: 'story_yangzhou_nangong',
    prev: 'mq_act2_yangzhou_arrival',
    next: 'mq_act2_nangong_reward',
    rewards: { exp: 700, silver: 500, morality: 10 },
    hint: '击退血骨门，解救南宫世家',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_nangong_reward: {
    id: 'mq_act2_nangong_reward',
    act: 2,
    chapter: '第五章·扬州风云',
    name: '南宫之谢',
    desc: '南宫烈感激你的援手，将第二枚玄铁令碎片赠予你。"此物虽珍贵，但留在南宫家只会招来更多祸端。"他还告诉你，第三枚碎片在凉州的沙漠古城中。',
    type: 'talk',
    targetNpc: '南宫烈',
    prev: 'mq_act2_nangong_siege',
    next: 'mq_act2_liangzhou_journey',
    rewards: { exp: 500, silver: 400, item: 'item_xuantie_fragment_2' },
    hint: '与南宫烈对话',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_liangzhou_journey: {
    id: 'mq_act2_liangzhou_journey',
    act: 2,
    chapter: '第六章·凉州追踪',
    name: '西域之行',
    desc: '凉州位于西域边陲，沙漠广袤，环境恶劣。但最危险的不仅是自然，还有潜伏在沙漠中的各方势力。',
    type: 'travel',
    targetCity: '凉州',
    prev: 'mq_act2_nangong_reward',
    next: 'mq_act2_desert_exploration',
    rewards: { exp: 400, silver: 300, morality: 0 },
    hint: '前往凉州',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_desert_exploration: {
    id: 'mq_act2_desert_exploration',
    act: 2,
    chapter: '第六章·凉州追踪',
    name: '沙漠古城',
    desc: '第三枚碎片藏在一座千年古城的遗迹中。然而血骨门、玄冥教、甚至日月神教的人都已闻风而动。你能否在混战中夺得碎片？',
    type: 'dungeon',
    dungeonId: 'story_liangzhou_desert',
    prev: 'mq_act2_liangzhou_journey',
    next: 'mq_act2_fragment3_obtained',
    rewards: { exp: 800, silver: 600, morality: 5 },
    hint: '进入沙漠古城，夺得第三枚碎片',
    cinema: null,
    importance: 'main',
  },
  
  mq_act2_fragment3_obtained: {
    id: 'mq_act2_fragment3_obtained',
    act: 2,
    chapter: '第六章·凉州追踪',
    name: '碎片齐聚',
    desc: '三枚碎片终于集齐。当你将它们放在一起时，碎片发出微弱的光芒，似乎在共鸣。你意识到，玄铁令的力量远比想象中更加神秘和危险。',
    type: 'travel',
    targetCity: '洛阳',
    prev: 'mq_act2_desert_exploration',
    next: 'mq_act3_start',
    rewards: { exp: 600, silver: 500, item: 'item_xuantie_fragment_3', title: '碎片收集者' },
    hint: '返回洛阳向鹤隐汇报',
    cinema: null,
    importance: 'main',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 第三幕：三魔联盟（7个任务）
  // ═════════════════════════════════════════════════════════════════════════
  
  mq_act3_start: {
    id: 'mq_act3_start',
    act: 3,
    chapter: '第七章·三魔暗涌',
    name: '三魔密约',
    desc: '鹤隐面色凝重地告诉你：血骨门、玄冥教、日月神教已经结成联盟，代号"三魔联盟"。他们的目标不仅是玄铁令，更是要颠覆整个武林秩序。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act2_fragment3_obtained',
    next: 'mq_act3_shaolin_summit',
    rewards: { exp: 500, silver: 400, morality: 0 },
    hint: '与鹤隐商议对策',
    cinema: 'act3_darkness',
    importance: 'main',
  },
  
  mq_act3_shaolin_summit: {
    id: 'mq_act3_shaolin_summit',
    act: 3,
    chapter: '第七章·三魔暗涌',
    name: '少林会盟',
    desc: '为对抗三魔联盟，正道各派决定在少林寺召开武林大会。你作为玄铁令碎片的持有者，被邀请参加这次会议。',
    type: 'travel',
    targetCity: '少林',
    prev: 'mq_act3_start',
    next: 'mq_act3_alliance_debate',
    rewards: { exp: 400, silver: 300, morality: 5 },
    hint: '前往少林寺参加武林大会',
    cinema: null,
    importance: 'main',
  },
  
  mq_act3_alliance_debate: {
    id: 'mq_act3_alliance_debate',
    act: 3,
    chapter: '第八章·正道会盟',
    name: '盟主之争',
    desc: '武林大会上，各派为盟主之位争执不休。少林方丈提议由你来保管玄铁令碎片，却遭到了某些人的质疑...',
    type: 'choice',
    choices: [
      { id: 'accept_guard', text: '晚辈定不负所托', morality: 10, next: 'mq_act3_accept_guardian' },
      { id: 'suggest_other', text: '晚辈资历尚浅，请另选贤能', morality: 5, next: 'mq_act3_suggest_other' },
      { id: 'keep_self', text: '碎片在我手中，我自会保管', morality: -5, next: 'mq_act3_keep_self' },
    ],
    prev: 'mq_act3_shaolin_summit',
    next: null,
    rewards: { exp: 500, silver: 400 },
    hint: '做出选择',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act3_accept_guardian: {
    id: 'mq_act3_accept_guardian',
    act: 3,
    chapter: '第八章·正道会盟',
    name: '守护者之责',
    desc: '你的谦逊和担当赢得了众人的尊重。少林方丈宣布成立"正道联盟"，共同对抗三魔联盟。',
    type: 'talk',
    targetNpc: '少林方丈',
    prev: 'mq_act3_alliance_debate',
    next: 'mq_act3_traitor_clue',
    rewards: { exp: 600, silver: 500, morality: 10, title: '正道新秀' },
    hint: '与少林方丈商议联盟事宜',
    cinema: null,
    importance: 'main',
  },
  
  mq_act3_suggest_other: {
    id: 'mq_act3_suggest_other',
    act: 3,
    chapter: '第八章·正道会盟',
    name: '推举贤能',
    desc: '你推举少林方丈担任盟主。方丈推辞不过，最终答应暂代盟主之职。正道联盟正式成立。',
    type: 'talk',
    targetNpc: '少林方丈',
    prev: 'mq_act3_alliance_debate',
    next: 'mq_act3_traitor_clue',
    rewards: { exp: 500, silver: 400, morality: 5 },
    hint: '与少林方丈商议',
    cinema: null,
    importance: 'main',
  },
  
  mq_act3_keep_self: {
    id: 'mq_act3_keep_self',
    act: 3,
    chapter: '第八章·正道会盟',
    name: '独断专行',
    desc: '你的态度引起了一些人的不满，但碍于你的实力，无人敢当面反对。正道联盟虽然成立，但内部已生嫌隙。',
    type: 'talk',
    targetNpc: '少林方丈',
    prev: 'mq_act3_alliance_debate',
    next: 'mq_act3_traitor_clue',
    rewards: { exp: 400, silver: 300, morality: -10 },
    hint: '与少林方丈对话',
    cinema: null,
    importance: 'main',
  },
  
  mq_act3_traitor_clue: {
    id: 'mq_act3_traitor_clue',
    act: 3,
    chapter: '第八章·正道会盟',
    name: '内鬼疑云',
    desc: '就在联盟成立之际，你收到密报：正道联盟内部有内鬼，正在向三魔联盟泄露情报。你必须找出这个叛徒。',
    type: 'explore',
    targetCity: '少林',
    explorePoints: 4,
    prev: ['mq_act3_accept_guardian', 'mq_act3_suggest_other', 'mq_act3_keep_self'],
    next: 'mq_act3_traitor_reveal',
    rewards: { exp: 500, silver: 400, morality: 0 },
    hint: '在少林寺中调查内鬼线索',
    cinema: null,
    importance: 'main',
  },
  
  mq_act3_traitor_reveal: {
    id: 'mq_act3_traitor_reveal',
    act: 3,
    chapter: '第九章·内鬼浮现',
    name: '真相大白',
    desc: '调查指向了昆仑派长老凌霄子。面对证据，凌霄子承认自己被三魔联盟收买。他的背叛让正道联盟元气大伤。',
    type: 'dungeon',
    dungeonId: 'story_shaolin_traitor',
    prev: 'mq_act3_traitor_clue',
    next: 'mq_act4_start',
    rewards: { exp: 800, silver: 600, morality: 10 },
    rewards_alt: { exp: 600, silver: 400, morality: -10 }, // 如果放走叛徒
    hint: ' confront 凌霄子',
    cinema: null,
    importance: 'main',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 第四幕：联盟裂隙（7个任务）- 关键抉择幕
  // ═════════════════════════════════════════════════════════════════════════
  
  mq_act4_start: {
    id: 'mq_act4_start',
    act: 4,
    chapter: '第十章·至暗时刻',
    name: '联盟裂隙',
    desc: '凌霄子的背叛让正道联盟陷入信任危机。各派互相猜忌，联盟濒临瓦解。鹤隐告诉你，必须有人潜入三魔联盟，获取他们的核心情报。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act3_traitor_reveal',
    next: 'mq_act4_infiltrate_choice',
    rewards: { exp: 500, silver: 400, morality: 0 },
    hint: '与鹤隐商议对策',
    cinema: 'act4_fracture',
    importance: 'main',
  },
  
  // 关键抉择2：潜入方式
  mq_act4_infiltrate_choice: {
    id: 'mq_act4_infiltrate_choice',
    act: 4,
    chapter: '第十章·至暗时刻',
    name: '抉择：潜入之道',
    desc: '潜入三魔联盟总部危险重重。你可以选择伪装成血骨门弟子混入，或者尝试与玄冥教接触，利用他们的内部矛盾。',
    type: 'choice',
    choices: [
      { id: 'disguise', text: '伪装潜入，暗中调查', morality: 5, next: 'mq_act4_disguise_route' },
      { id: 'contact', text: '接触玄冥教，寻求合作', morality: 0, next: 'mq_act4_contact_route' },
      { id: 'direct', text: '正面突破，直捣黄龙', morality: -5, next: 'mq_act4_direct_route' },
    ],
    prev: 'mq_act4_start',
    next: null,
    rewards: { exp: 300, silver: 200 },
    hint: '选择潜入方式',
    cinema: null,
    importance: 'critical',
  },
  
  // 路线A：伪装潜入
  mq_act4_disguise_route: {
    id: 'mq_act4_disguise_route',
    act: 4,
    chapter: '第十一章·孤身潜入',
    name: '血骨门弟子',
    desc: '你伪装成一名血骨门弟子，成功混入了幽州总部。在这里，你看到了三魔联盟的运作方式，也发现了许多不为人知的秘密...',
    type: 'travel',
    targetCity: '幽州',
    prev: 'mq_act4_infiltrate_choice',
    next: 'mq_act4_undercover_mission',
    rewards: { exp: 400, silver: 300, morality: 5 },
    hint: '前往幽州，伪装潜入',
    cinema: null,
    importance: 'main',
  },
  
  mq_act4_undercover_mission: {
    id: 'mq_act4_undercover_mission',
    act: 4,
    chapter: '第十一章·孤身潜入',
    name: '潜伏任务',
    desc: '在总部的日子里，你逐渐获得了一些信任。你得知三魔联盟正在策划一次大规模行动，目标是正道联盟的核心人物。',
    type: 'dungeon',
    dungeonId: 'story_youzhou_hideout',
    prev: 'mq_act4_disguise_route',
    next: 'mq_act4_moral_dilemma',
    rewards: { exp: 700, silver: 500, morality: 5 },
    hint: '完成潜伏任务，获取情报',
    cinema: null,
    importance: 'main',
  },
  
  // 路线B：接触玄冥教
  mq_act4_contact_route: {
    id: 'mq_act4_contact_route',
    act: 4,
    chapter: '第十一章·合纵连横',
    name: '玄冥密使',
    desc: '玄冥教与血骨门并非铁板一块。你通过秘密渠道联系上了玄冥教左护法冷月，她对血骨门门主骨冥子的野心早有不满...',
    type: 'travel',
    targetCity: '开封',
    prev: 'mq_act4_infiltrate_choice',
    next: 'mq_act4_cold_moon_meeting',
    rewards: { exp: 400, silver: 300, morality: 0 },
    hint: '前往开封与冷月会面',
    cinema: null,
    importance: 'main',
  },
  
  mq_act4_cold_moon_meeting: {
    id: 'mq_act4_cold_moon_meeting',
    act: 4,
    chapter: '第十一章·合纵连横',
    name: '月下密谈',
    desc: '冷月告诉你，骨冥子想要独占玄铁令的力量，玄冥教和日月神教都只是他的棋子。她愿意与你合作，条件是事成之后平分玄铁令。',
    type: 'choice',
    choices: [
      { id: 'agree', text: '暂时答应，日后再说', morality: -5, next: 'mq_act4_alliance_betrayal' },
      { id: 'refuse', text: '玄铁令不能落入邪道', morality: 10, next: 'mq_act4_refuse_deal' },
      { id: 'negotiate', text: '尝试谈判更好的条件', morality: 0, next: 'mq_act4_negotiate_deal' },
    ],
    prev: 'mq_act4_contact_route',
    next: null,
    rewards: { exp: 500, silver: 400 },
    hint: '做出选择',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act4_alliance_betrayal: {
    id: 'mq_act4_alliance_betrayal',
    act: 4,
    chapter: '第十一章·合纵连横',
    name: '双面间谍',
    desc: '你与冷月达成协议，成为正道联盟与玄冥教之间的双面间谍。这种危险的平衡能否维持下去？',
    type: 'travel',
    targetCity: '幽州',
    prev: 'mq_act4_cold_moon_meeting',
    next: 'mq_act4_moral_dilemma',
    rewards: { exp: 600, silver: 500, morality: -10 },
    hint: '前往幽州继续调查',
    cinema: null,
    importance: 'main',
  },
  
  mq_act4_refuse_deal: {
    id: 'mq_act4_refuse_deal',
    act: 4,
    chapter: '第十一章·合纵连横',
    name: '正道不屈',
    desc: '你的拒绝激怒了冷月，但她也对你产生了一丝敬意。"你这样的人，不该死在这里。"她放你离开，但警告你不要再出现在她面前。',
    type: 'travel',
    targetCity: '幽州',
    prev: 'mq_act4_cold_moon_meeting',
    next: 'mq_act4_moral_dilemma',
    rewards: { exp: 500, silver: 300, morality: 15 },
    hint: '独自前往幽州调查',
    cinema: null,
    importance: 'main',
  },
  
  mq_act4_negotiate_deal: {
    id: 'mq_act4_negotiate_deal',
    act: 4,
    chapter: '第十一章·合纵连横',
    name: '各退一步',
    desc: '经过谈判，你答应帮助冷月对付骨冥子，但玄铁令必须由正道联盟封印。冷月勉强同意，但眼中闪过一丝算计。',
    type: 'travel',
    targetCity: '幽州',
    prev: 'mq_act4_cold_moon_meeting',
    next: 'mq_act4_moral_dilemma',
    rewards: { exp: 600, silver: 400, morality: 0 },
    hint: '前往幽州',
    cinema: null,
    importance: 'main',
  },
  
  // 路线C：正面突破
  mq_act4_direct_route: {
    id: 'mq_act4_direct_route',
    act: 4,
    chapter: '第十一章·单刀赴会',
    name: '正面突破',
    desc: '你决定不玩阴谋诡计，直接杀入三魔联盟总部。这种疯狂的举动让所有人都始料未及...',
    type: 'dungeon',
    dungeonId: 'story_youzhou_hideout',
    prev: 'mq_act4_infiltrate_choice',
    next: 'mq_act4_moral_dilemma',
    rewards: { exp: 800, silver: 600, morality: -5 },
    hint: '杀入幽州总部',
    cinema: null,
    importance: 'main',
  },
  
  // 关键抉择3：道德考验
  mq_act4_moral_dilemma: {
    id: 'mq_act4_moral_dilemma',
    act: 4,
    chapter: '第十二章·三魔密约',
    name: '抉择：力量之诱',
    desc: '你在三魔联盟总部发现了一份密约，以及关于玄铁令的更多秘密。更重要的是，你发现了如何快速获得强大力量的方法——代价是牺牲无辜者的生命。',
    type: 'choice',
    choices: [
      { id: 'reject', text: '断然拒绝，销毁密约', morality: 20, next: 'mq_act4_destroy_covenant' },
      { id: 'keep', text: '保留密约，以备不时之需', morality: -10, next: 'mq_act4_keep_covenant' },
      { id: 'use', text: '为了大局，使用禁术', morality: -30, next: 'mq_act4_use_forbidden' },
    ],
    prev: ['mq_act4_undercover_mission', 'mq_act4_alliance_betrayal', 'mq_act4_refuse_deal', 'mq_act4_negotiate_deal', 'mq_act4_direct_route'],
    next: null,
    rewards: { exp: 500, silver: 400 },
    hint: '做出选择',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act4_destroy_covenant: {
    id: 'mq_act4_destroy_covenant',
    act: 4,
    chapter: '第十二章·三魔密约',
    name: '正道之光',
    desc: '你销毁了密约，阻止了禁术的流传。虽然失去了一个快速提升实力的机会，但你的道心更加坚定。',
    type: 'travel',
    targetCity: '武当',
    prev: 'mq_act4_moral_dilemma',
    next: 'mq_act5_start',
    rewards: { exp: 600, silver: 500, morality: 20, title: '正道楷模' },
    hint: '前往武当与正道联盟汇合',
    cinema: null,
    importance: 'main',
  },
  
  mq_act4_keep_covenant: {
    id: 'mq_act4_keep_covenant',
    act: 4,
    chapter: '第十二章·三魔密约',
    name: '留有余地',
    desc: '你保留了密约，告诉自己这只是为了知己知彼。但内心深处，你知道这个选择意味着什么...',
    type: 'travel',
    targetCity: '武当',
    prev: 'mq_act4_moral_dilemma',
    next: 'mq_act5_start',
    rewards: { exp: 500, silver: 400, morality: -10 },
    hint: '前往武当',
    cinema: null,
    importance: 'main',
  },
  
  mq_act4_use_forbidden: {
    id: 'mq_act4_use_forbidden',
    act: 4,
    chapter: '第十二章·三魔密约',
    name: '踏入黑暗',
    desc: '你使用了禁术，力量如潮水般涌入体内。你能感觉到自己的变化——不仅是实力，还有心性。但为了击败骨冥子，你认为这是值得的代价。',
    type: 'travel',
    targetCity: '武当',
    prev: 'mq_act4_moral_dilemma',
    next: 'mq_act5_start',
    rewards: { exp: 1000, silver: 800, morality: -30, buff: 'forbidden_power' },
    hint: '前往武当',
    cinema: null,
    importance: 'main',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 第五幕：决战前夜（7个任务）
  // ═════════════════════════════════════════════════════════════════════════
  
  mq_act5_start: {
    id: 'mq_act5_start',
    act: 5,
    chapter: '第十三章·决战前夜',
    name: '玄铁令现世',
    desc: '三枚碎片终于齐聚，玄铁令即将重现人间。骨冥子决定在血骨门总坛举行仪式，解开玄铁令的封印。正道联盟必须在他成功之前阻止这一切。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act4_moral_dilemma',
    next: 'mq_act5_war_preparation',
    rewards: { exp: 600, silver: 500, morality: 0 },
    hint: '与鹤隐商议决战计划',
    cinema: 'act5_climax',
    importance: 'main',
  },
  
  mq_act5_war_preparation: {
    id: 'mq_act5_war_preparation',
    act: 5,
    chapter: '第十三章·决战前夜',
    name: '战前准备',
    desc: '决战在即，你需要做好万全准备。收集情报、准备药品、联络盟友——每一个细节都可能决定最终的胜负。',
    type: 'explore',
    targetCity: '沧州',
    explorePoints: 3,
    prev: 'mq_act5_start',
    next: 'mq_act5_alliance_gamble',
    rewards: { exp: 500, silver: 400, morality: 0 },
    hint: '在沧州做最后的准备',
    cinema: null,
    importance: 'main',
  },
  
  // 关键抉择4：决战策略
  mq_act5_alliance_gamble: {
    id: 'mq_act5_alliance_gamble',
    act: 5,
    chapter: '第十三章·决战前夜',
    name: '抉择：决战之策',
    desc: '正道联盟制定了两个方案：一是集中优势兵力正面强攻；二是派精锐小队潜入破坏仪式。你作为核心战力，需要选择参与哪个方案。',
    type: 'choice',
    choices: [
      { id: 'frontal', text: '正面强攻，牵制主力', morality: 5, next: 'mq_act5_frontal_assault' },
      { id: 'stealth', text: '潜入破坏，直取骨冥子', morality: 5, next: 'mq_act5_stealth_team' },
      { id: 'solo', text: '独自行动，各凭本事', morality: -5, next: 'mq_act5_solo_path' },
    ],
    prev: 'mq_act5_war_preparation',
    next: null,
    rewards: { exp: 400, silver: 300 },
    hint: '选择决战策略',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act5_frontal_assault: {
    id: 'mq_act5_frontal_assault',
    act: 5,
    chapter: '第十四章·血战总坛',
    name: '正面强攻',
    desc: '你率领正道联盟的精锐，从正面杀入血骨门总坛。喊杀声震天，血光四溅——这是决定武林命运的一战。',
    type: 'dungeon',
    dungeonId: 'story_xuegu_final',
    prev: 'mq_act5_alliance_gamble',
    next: 'mq_act5_boss_approach',
    rewards: { exp: 1000, silver: 800, morality: 5 },
    hint: '攻入血骨门总坛',
    cinema: null,
    importance: 'main',
  },
  
  mq_act5_stealth_team: {
    id: 'mq_act5_stealth_team',
    act: 5,
    chapter: '第十四章·血战总坛',
    name: '精锐潜入',
    desc: '你带领一支精锐小队，从密道潜入总坛核心。你们的任务是破坏仪式，阻止骨冥子解封玄铁令。',
    type: 'dungeon',
    dungeonId: 'story_xuegu_final',
    prev: 'mq_act5_alliance_gamble',
    next: 'mq_act5_boss_approach',
    rewards: { exp: 900, silver: 700, morality: 5 },
    hint: '潜入总坛核心',
    cinema: null,
    importance: 'main',
  },
  
  mq_act5_solo_path: {
    id: 'mq_act5_solo_path',
    act: 5,
    chapter: '第十四章·血战总坛',
    name: '独闯龙潭',
    desc: '你决定独自行动。在混乱中，你如幽灵般穿梭于战场，直奔骨冥子所在。这是属于你的战斗。',
    type: 'dungeon',
    dungeonId: 'story_xuegu_final',
    prev: 'mq_act5_alliance_gamble',
    next: 'mq_act5_boss_approach',
    rewards: { exp: 1200, silver: 1000, morality: -5 },
    hint: '独自杀入总坛深处',
    cinema: null,
    importance: 'main',
  },
  
  mq_act5_boss_approach: {
    id: 'mq_act5_boss_approach',
    act: 5,
    chapter: '第十四章·血战总坛',
    name: '骨冥子',
    desc: '终于，你站在了骨冥子面前。他手持即将解封的玄铁令，狂笑着："来得正好，见证新神的诞生吧！"',
    type: 'talk',
    targetNpc: '骨冥子',
    prev: ['mq_act5_frontal_assault', 'mq_act5_stealth_team', 'mq_act5_solo_path'],
    next: 'mq_act5_final_choice',
    rewards: { exp: 500, silver: 400, morality: 0 },
    hint: '面对骨冥子',
    cinema: 'boss_gumingzi',
    importance: 'main',
  },
  
  // 最终抉择
  mq_act5_final_choice: {
    id: 'mq_act5_final_choice',
    act: 5,
    chapter: '第十五章·最终决战',
    name: '抉择：最终之战',
    desc: '骨冥子已经解开了玄铁令的部分封印，强大的力量让他近乎无敌。但在最后的时刻，你感受到了玄铁令的呼唤——它认可了你的潜质，愿意将力量借给你。问题是：你接受吗？',
    type: 'choice',
    choices: [
      { id: 'reject_power', text: '拒绝诱惑，凭己之力战斗', morality: 30, next: 'mq_act5_battle_pure' },
      { id: 'accept_power', text: '借用力量，击败骨冥子', morality: -10, next: 'mq_act5_battle_power' },
      { id: 'seal_together', text: '与骨冥子同归于尽，封印玄铁令', morality: 50, next: 'mq_act5_sacrifice_ending' },
    ],
    prev: 'mq_act5_boss_approach',
    next: null,
    rewards: { exp: 800, silver: 600 },
    hint: '做出最终选择',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act5_battle_pure: {
    id: 'mq_act5_battle_pure',
    act: 5,
    chapter: '第十五章·最终决战',
    name: '正道之战',
    desc: '你拒绝了玄铁令的力量，选择用自己的力量对抗骨冥子。这是一场公平的对决——人的意志，对抗被神器控制的傀儡。',
    type: 'boss',
    targetBoss: 'npc_gumingzi',
    bossPhase: 3,
    prev: 'mq_act5_final_choice',
    next: 'mq_act6_start',
    rewards: { exp: 2000, silver: 1500, morality: 20, title: '正道守护者' },
    hint: '击败骨冥子',
    cinema: null,
    importance: 'main',
  },
  
  mq_act5_battle_power: {
    id: 'mq_act5_battle_power',
    act: 5,
    chapter: '第十五章·最终决战',
    name: '以力破力',
    desc: '你接受了玄铁令的力量，瞬间感受到前所未有的强大。但这股力量也在侵蚀你的意志——你必须在击败骨冥子之前，保持清醒。',
    type: 'boss',
    targetBoss: 'npc_gumingzi',
    bossPhase: 3,
    prev: 'mq_act5_final_choice',
    next: 'mq_act6_start',
    rewards: { exp: 2000, silver: 1500, morality: -10, buff: 'xuantie_blessing', title: '玄铁之主' },
    hint: '击败骨冥子',
    cinema: null,
    importance: 'main',
  },
  
  mq_act5_sacrifice_ending: {
    id: 'mq_act5_sacrifice_ending',
    act: 5,
    chapter: '第十五章·最终决战',
    name: '壮烈牺牲',
    desc: '你做出了最艰难的选择——与骨冥子同归于尽，将玄铁令重新封印。在生命的最后时刻，你看到了武林的和平，看到了人们脸上的笑容。这一切，都值得。',
    type: 'ending',
    endingType: 'sacrifice',
    prev: 'mq_act5_final_choice',
    next: null,
    rewards: { exp: 3000, silver: 2000, morality: 100, title: '武林烈士' },
    hint: '特殊结局',
    cinema: 'ending_sacrifice',
    importance: 'final',
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 第六幕：战后余波（6个任务）
  // ═════════════════════════════════════════════════════════════════════════
  
  mq_act6_start: {
    id: 'mq_act6_start',
    act: 6,
    chapter: '第十六章·战后余波',
    name: '胜利之后',
    desc: '骨冥子倒下了，玄铁令被重新封印。三魔联盟土崩瓦解，武林迎来了久违的和平。但你心中清楚，这只是一个开始...',
    type: 'travel',
    targetCity: '洛阳',
    prev: 'mq_act5_final_choice',
    next: 'mq_act6_celebration',
    rewards: { exp: 800, silver: 600, morality: 0 },
    hint: '返回洛阳参加庆功宴',
    cinema: 'act6_finale',
    importance: 'main',
  },
  
  mq_act6_celebration: {
    id: 'mq_act6_celebration',
    act: 6,
    chapter: '第十六章·战后余波',
    name: '武林大会',
    desc: '洛阳城中举行了盛大的庆功宴，正道各派齐聚一堂。你成为了众人敬仰的英雄，但你知道，真正的英雄是那些为此牺牲的人们。',
    type: 'talk',
    targetNpc: '少林方丈',
    prev: 'mq_act6_start',
    next: 'mq_act6_rewards',
    rewards: { exp: 1000, silver: 800, morality: 5 },
    hint: '参加庆功宴',
    cinema: null,
    importance: 'main',
  },
  
  mq_act6_rewards: {
    id: 'mq_act6_rewards',
    act: 6,
    chapter: '第十六章·战后余波',
    name: '论功行赏',
    desc: '正道联盟决定对你进行封赏。根据你在整个事件中的表现，你将获得相应的地位和荣誉。',
    type: 'choice',
    choices: [
      { id: 'accept_title', text: '接受封赏，光耀门楣', morality: 5, next: 'mq_act6_hero_life' },
      { id: 'humble', text: '推辞封赏，功成身退', morality: 10, next: 'mq_act6_hermit_path' },
      { id: 'negotiate', text: '请求建立新势力', morality: 0, next: 'mq_act6_new_sect' },
    ],
    prev: 'mq_act6_celebration',
    next: null,
    rewards: { exp: 1000, silver: 1000 },
    hint: '做出选择',
    cinema: null,
    importance: 'critical',
  },
  
  mq_act6_hero_life: {
    id: 'mq_act6_hero_life',
    act: 6,
    chapter: '第十七章·武林新序',
    name: '英雄之路',
    desc: '你接受了正道联盟的封赏，成为新一代的武林领袖。在你的带领下，武林进入了一个新的时代——更加团结，更加公正。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act6_rewards',
    next: 'mq_act6_final_secret',
    rewards: { exp: 1200, silver: 1200, title: '武林盟主' },
    hint: '与鹤隐对话',
    cinema: null,
    importance: 'main',
  },
  
  mq_act6_hermit_path: {
    id: 'mq_act6_hermit_path',
    act: 6,
    chapter: '第十七章·武林新序',
    name: '隐世高人',
    desc: '你推辞了所有封赏，选择隐居山林。江湖上再也没有你的消息，但你的传说却在民间流传，成为一代侠客的精神象征。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act6_rewards',
    next: 'mq_act6_final_secret',
    rewards: { exp: 1500, silver: 800, title: '隐世高人' },
    hint: '与鹤隐告别',
    cinema: null,
    importance: 'main',
  },
  
  mq_act6_new_sect: {
    id: 'mq_act6_new_sect',
    act: 6,
    chapter: '第十七章·武林新序',
    name: '开宗立派',
    desc: '你请求建立一个新的门派，不属正道也不属邪道，只为维护武林平衡。这个提议引起了争议，但最终得到了认可。你的门派将成为武林中的第三股力量。',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: 'mq_act6_rewards',
    next: 'mq_act6_final_secret',
    rewards: { exp: 1500, silver: 1500, title: '开派祖师' },
    hint: '与鹤隐商议',
    cinema: null,
    importance: 'main',
  },
  
  mq_act6_final_secret: {
    id: 'mq_act6_final_secret',
    act: 6,
    chapter: '第十八章·北疆迷云',
    name: '新的威胁',
    desc: '在一切尘埃落定之际，鹤隐单独找到你，神色凝重地说："骨冥子只是棋子，真正的幕后黑手...来自北疆。"他递给你一封密信，"当你准备好面对更大的挑战时，打开它。"',
    type: 'talk',
    targetNpc: '鹤隐',
    prev: ['mq_act6_hero_life', 'mq_act6_hermit_path', 'mq_act6_new_sect'],
    next: null,
    rewards: { exp: 2000, silver: 2000, item: 'item_northern_secret_letter', title: '血骨终结者' },
    hint: '剧情已完结，等待二周目《北疆风云》',
    cinema: null,
    importance: 'final',
    isFinal: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 阵营系统
// ═══════════════════════════════════════════════════════════════════════════

const STORY_FACTIONS = {
  righteous: {
    id: 'righteous',
    name: '正道联盟',
    description: '以少林、武当为首的正道门派联盟',
    leader: '少林方丈',
    alignment: 'good',
    reputation: 0,
    members: ['少林', '武当', '峨眉', '昆仑', '华山', '崆峒', '天山', '南宫', '圣光教'],
  },
  evil: {
    id: 'evil',
    name: '三魔联盟',
    description: '血骨门、玄冥教、日月神教的邪恶同盟',
    leader: '骨冥子',
    alignment: 'evil',
    reputation: 0,
    members: ['血骨门', '玄冥教', '日月神教'],
  },
  neutral: {
    id: 'neutral',
    name: '中立势力',
    description: '不属正邪，保持独立的门派',
    leader: null,
    alignment: 'neutral',
    reputation: 0,
    members: ['唐门', '逍遥', '鬼谷', '凌霄阁', '桃花岛', '青城'],
  },
  chaotic: {
    id: 'chaotic',
    name: '混乱势力',
    description: '不受约束的江湖帮派',
    leader: null,
    alignment: 'chaotic',
    reputation: 0,
    members: ['天地帮', '海沙帮'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 关键NPC关系系统
// ═══════════════════════════════════════════════════════════════════════════

const STORY_NPC_RELATIONSHIPS = {
  heyin: {
    id: 'heyin',
    name: '鹤隐',
    title: '神秘老者',
    description: '身份神秘的老者，似乎知道很多秘密',
    initialRelation: 50,
    maxRelation: 100,
    events: {
      first_meet: { description: '初识鹤隐', relationChange: 0 },
      accept_quest: { description: '接受使命', relationChange: 10 },
      refuse_quest: { description: '拒绝使命', relationChange: -10 },
      report_success: { description: '成功汇报', relationChange: 5 },
      final_secret: { description: '得知北疆秘密', relationChange: 20 },
    },
  },
  
  gumingzi: {
    id: 'gumingzi',
    name: '骨冥子',
    title: '血骨门门主',
    description: '血骨门门主，企图解封玄铁令',
    initialRelation: -100,
    maxRelation: -100,
    isHostile: true,
  },
  
  cold_moon: {
    id: 'cold_moon',
    name: '冷月',
    title: '玄冥教左护法',
    description: '玄冥教左护法，对骨冥子心怀不满',
    initialRelation: 0,
    maxRelation: 80,
    events: {
      first_contact: { description: '初次接触', relationChange: 0 },
      agree_deal: { description: '达成协议', relationChange: 10 },
      refuse_deal: { description: '拒绝合作', relationChange: -20 },
      betray: { description: '背叛协议', relationChange: -50 },
    },
  },
  
  nangong_lie: {
    id: 'nangong_lie',
    name: '南宫烈',
    title: '南宫家主',
    description: '南宫世家当代家主',
    initialRelation: 30,
    maxRelation: 100,
    events: {
      rescue: { description: '解救南宫世家', relationChange: 30 },
      receive_fragment: { description: '获得碎片赠予', relationChange: 20 },
    },
  },
  
  shaolin_abbot: {
    id: 'shaolin_abbot',
    name: '少林方丈',
    title: '正道联盟盟主',
    description: '少林方丈，正道联盟的领袖',
    initialRelation: 40,
    maxRelation: 100,
    events: {
      attend_summit: { description: '参加武林大会', relationChange: 10 },
      accept_guardian: { description: '接受守护者职责', relationChange: 15 },
      betray_trust: { description: '背叛信任', relationChange: -50 },
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 剧情时间线系统
// ═══════════════════════════════════════════════════════════════════════════

const STORY_TIMELINE = {
  prologue: {
    id: 'prologue',
    name: '序章',
    description: '乱世起，神秘来信',
    duration: 1, // 游戏内天数
    quests: ['mq_act1_start'],
  },
  act1: {
    id: 'act1',
    name: '第一幕',
    description: '踏入江湖，沧州暗战',
    duration: 7,
    quests: ['mq_act1_arrive_luoyang', 'mq_act1_meet_heyin', 'mq_act1_first_choice', 
             'mq_act1_accept', 'mq_act1_cangzhou_arrival', 'mq_act1_rescue_zhongheng', 'mq_act1_report_back'],
  },
  act2: {
    id: 'act2',
    name: '第二幕',
    description: '风云变色，三碎片之争',
    duration: 14,
    quests: ['mq_act2_start', 'mq_act2_kaifeng_route', 'mq_act2_blackmarket_info', 
             'mq_act2_fragment1_battle', 'mq_act2_fragment1_obtained', 'mq_act2_yangzhou_arrival',
             'mq_act2_nangong_siege', 'mq_act2_nangong_reward', 'mq_act2_liangzhou_journey',
             'mq_act2_desert_exploration', 'mq_act2_fragment3_obtained'],
  },
  act3: {
    id: 'act3',
    name: '第三幕',
    description: '三魔联盟，正道会盟',
    duration: 10,
    quests: ['mq_act3_start', 'mq_act3_shaolin_summit', 'mq_act3_alliance_debate',
             'mq_act3_traitor_clue', 'mq_act3_traitor_reveal'],
  },
  act4: {
    id: 'act4',
    name: '第四幕',
    description: '联盟裂隙，孤身潜入',
    duration: 12,
    quests: ['mq_act4_start', 'mq_act4_infiltrate_choice', 'mq_act4_undercover_mission',
             'mq_act4_cold_moon_meeting', 'mq_act4_moral_dilemma', 'mq_act4_destroy_covenant'],
  },
  act5: {
    id: 'act5',
    name: '第五幕',
    description: '决战前夜，生死之战',
    duration: 5,
    quests: ['mq_act5_start', 'mq_act5_war_preparation', 'mq_act5_alliance_gamble',
             'mq_act5_frontal_assault', 'mq_act5_boss_approach', 'mq_act5_final_choice', 'mq_act5_battle_pure'],
  },
  act6: {
    id: 'act6',
    name: '第六幕',
    description: '战后余波，北疆迷云',
    duration: 3,
    quests: ['mq_act6_start', 'mq_act6_celebration', 'mq_act6_rewards', 
             'mq_act6_hero_life', 'mq_act6_final_secret'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 导出
// ═══════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MAIN_QUEST_DATA_EXTENDED,
    STORY_FACTIONS,
    STORY_NPC_RELATIONSHIPS,
    STORY_TIMELINE,
  };
}

// 合并到全局（如果主模块已加载）
if (typeof window !== 'undefined') {
  window.MAIN_QUEST_DATA_EXTENDED = MAIN_QUEST_DATA_EXTENDED;
  window.STORY_FACTIONS = STORY_FACTIONS;
  window.STORY_NPC_RELATIONSHIPS = STORY_NPC_RELATIONSHIPS;
  window.STORY_TIMELINE = STORY_TIMELINE;
}

console.log('[StoryMainQuestExtended] 扩展剧情数据已加载，共', Object.keys(MAIN_QUEST_DATA_EXTENDED).length, '个任务');
