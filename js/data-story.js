// ════════════════════════════════════════════════════
//  data-story.js  世界故事背景 · 主线危机 · 任务链
//  江湖将将胡 — 故事背景：《血骨门之乱》
// ════════════════════════════════════════════════════

// ── 世界背景叙事 ──────────────────────────────────
const WORLD_STORY = {
  era: '乱世',
  eraDesc: '大齐国力衰退，边境烽烟四起，江湖暗流涌动',

  background: `
天下三分，烽烟四起。

大齐王朝历经百年，国祚将衰。边疆游牧南侵，朝廷党争不断，百姓流离失所。
江湖之中，正邪两道本已势均力敌——少林武当领衔的正道联盟，与日月神教、血骨门为首的邪道，已是百年积怨。

然而，真正让天下震动的，是一件失踪数百年的传说之物：

  「玄铁令」

相传玄铁令由上古战神以天外陨铁铸就，持令者可号令天下兵器，武功倍增。
血骨门门主「骨冥子」偶得古籍，得知玄铁令就藏于中原某处，
遂联合玄冥教、日月神教，组建「三魔联盟」，大肆搜查，
于中原各地烧杀掠夺，制造混乱，意图借乱世之机，以玄铁令一统江湖。

正道诸派措手不及，少林达摩院首座「玄悟大师」在搜集玄铁令线索途中，
于洛阳城外遭遇伏击，身负重伤，音讯全无。

这一切，都从你踏入江湖的那一天开始，悄然改变……
  `.trim(),

  mainCrisis: '「玄铁令」争夺战——三魔联盟与正道联盟的决战迫在眉睫',
  mainVillain: '骨冥子（血骨门门主）',
  mainMystery: '玄铁令的下落 · 玄悟大师的失踪',
};

// ── 势力格局 ──────────────────────────────────────
const FACTION_STATUS = {
  // 正道阵营
  righteous: {
    label: '正道联盟',
    icon: '⚔',
    color: '#80d8ff',
    situation: '被三魔联盟逼得节节败退，少林达摩院首座失踪，武当山道长在追查玄铁令线索，各派整合力量抵御邪道进攻',
    keyNpc: 'npc_xuanwu_wudang',  // 武当的探查者
    hotspot: ['嵩山','武当山','昆仑山'],
  },
  evil: {
    label: '三魔联盟',
    icon: '☠',
    color: '#ff6060',
    situation: '以血骨门为主导，玄冥教负责情报渗透，日月神教负责正面冲突；三家各有私心，内部暗藏裂隙',
    keyNpc: 'npc_gumingzi',
    hotspot: ['幽州','金陵','西域城邦'],
  },
  neutral: {
    label: '中立势力',
    icon: '⚖',
    color: '#d0b870',
    situation: '唐门、桃花岛、逍遥派等门派保持观望，坐收渔利或暗中扶持各方；凌霄阁暗中收购武器，从中牟利',
    keyNpc: 'npc_lingyun_leader',
    hotspot: ['扬州','成都','桃花岛'],
  },
  chaos: {
    label: '混乱势力',
    icon: '🔥',
    color: '#ff9040',
    situation: '明教趁乱在西北扩张，天地帮和海沙帮在漕运要道设卡掠财，民间流寇遍布',
    keyNpc: 'npc_tiandi_boss',
    hotspot: ['汉中','扬州','大运河沿线'],
  },
};

// ════════════════════════════════════════════════════
//  主线任务链（分幕结构）
//  每幕解锁条件逐级递进
// ════════════════════════════════════════════════════
const MAIN_QUEST_CHAIN = {

  // ══════════════════════════════════════════════════════════════════
  //  《血骨门之乱》完整主线 · 六幕三十一节点
  //
  //  结构说明：
  //  - act：幕次（1-6）
  //  - type：talk | kill | travel | collect | dungeon
  //  - triggerCity / triggerNpc / triggerItem：自动触发条件
  //  - targetNpcId / targetCityId：击杀/地点目标
  //  - nextQuest / prevQuest：任务链顺序
  //  - isFinal：是否为主线终章
  //  - isEpilogue：是否尾声
  //  - rewardText / reward：奖励（统一格式）
  // ══════════════════════════════════════════════════════════════════

  // ── 第一幕：踏入江湖 ──────────────────────────────────
  // 玩家初出茅庐，意外卷入玄铁令的漩涡，与血骨门首次交锋

  act1_prologue: {
    id: 'mq_act1_prologue',
    icon: '🌅',
    act: 1,
    name: '江湖序章',
    desc: '你拜别师门，踏入江湖。行至中原腹地，沿途所见：流民四窜、商队戒备森严。江湖，似乎比传闻中更不太平……',
    type: 'travel',
    rewardText: '经验+100',
    reward: { exp: 100 },
    nextQuest: 'mq_act1_letter',
    triggerCity: 'luoyang',  // 到达洛阳后自动推进
  },

  act1_letter: {
    id: 'mq_act1_letter',
    icon: '📜',
    act: 1,
    name: '旅途密信',
    desc: '你在洛阳城郊拾到一封被遗落的信笺，火漆已拆。信中提及"玄铁令"三字，并有一个暗号地点——"洛阳城外问路亭，戌时三刻"。这封信是谁遗落的？为何如此巧合地被你捡到？',
    type: 'collect',
    rewardText: '经验+150 · 获得「神秘密信」',
    reward: { exp: 150, item: 'item_main_letter' },
    nextQuest: 'mq_act1_wenlu',
    triggerCity: 'luoyang',
  },

  act1_wenlu: {
    id: 'mq_act1_wenlu',
    icon: '🏚',
    act: 1,
    name: '问路亭之约',
    desc: '戌时三刻，问路亭。你如约而至，等来的是一位神秘的蒙面老者，自称"鹤隐"。他透露：少林达摩院首座玄悟大师失踪前，曾留下一枚锦囊，交给了沧州的镖师"钟恒"。而血骨门，也在追查这枚锦囊……',
    type: 'talk',
    rewardText: '经验+250 · 解锁情报「玄悟大师失踪」',
    reward: { exp: 250, intel: 'intel_xuanwu_missing' },
    nextQuest: 'mq_act1_cangzhou_road',
    triggerNpc: 'npc_heyin_mysterious',
  },

  act1_cangzhou_road: {
    id: 'mq_act1_cangzhou_road',
    icon: '🛤️',
    act: 1,
    name: '通往沧州',
    desc: '你马不停蹄赶往沧州。然而刚入冀州地界，便听闻海沙帮近日封锁了沧州城门，凡入城者须交"入城税"。更有人在城中看见血骨门的黑衣人在活动——他们也盯上了那枚锦囊。',
    type: 'travel',
    rewardText: '经验+200',
    reward: { exp: 200 },
    nextQuest: 'mq_act1_cangzhou',
    triggerCity: 'cangzhou',
  },

  act1_cangzhou: {
    id: 'mq_act1_cangzhou',
    icon: '⚔',
    act: 1,
    name: '沧州暗战',
    desc: '你在沧州城内找到镖师钟恒，但他已被血骨门的人盯上。钟恒将锦囊托付给你，并透露：血骨门在城中设有一处暗哨，专门截杀知情者。你必须潜入地下据点，救出钟恒，夺回玄悟锦囊！',
    type: 'dungeon',  // 改为剧情地下城
    dungeonId: 'sd_cangzhou_hideout',  // 关联剧情地下城
    rewardText: '经验+500 · 获得「玄悟锦囊」· 正道声望+20',
    reward: { exp: 500, item: 'item_secret_pouch', fameRighteous: 20 },
    triggerCity: 'cangzhou',
    nextQuest: 'mq_act2_pouch',
  },

  // ── 第二幕：风云初动 ──────────────────────────────────
  // 玄铁令碎片秘密揭开，三魔联盟的身影开始浮现

  act2_pouch: {
    id: 'mq_act2_pouch',
    icon: '🔍',
    act: 2,
    name: '锦囊之谜',
    desc: '你寻得安全之处，打开玄悟锦囊。里面是一张残缺的羊皮地图，标注着"嵩山石窟第三层"。另有一行褪色字迹：「令藏三处，碎而不全，唯合则显——天外玄铁，号令群兵」。玄铁令竟被分成了三块，藏在三个地方！',
    type: 'collect',
    rewardText: '经验+500 · 解锁第二幕',
    reward: { exp: 500 },
    nextQuest: 'mq_act2_songshan',
    triggerItem: 'item_secret_pouch',
  },

  act2_songshan: {
    id: 'mq_act2_songshan',
    icon: '⛰',
    act: 2,
    name: '嵩山石窟',
    desc: '你马不停蹄赶往嵩山。石窟深处，果然有一道隐藏的机关——三块碎片之一的线索就藏在这里。然而血骨门的探子已尾随而至，你必须深入石窟，击败上古石魔，才能取得碎片！',
    type: 'dungeon',
    dungeonId: 'sd_songshan_grotto',
    rewardText: '经验+1200 · 获得「玄铁令碎片（一）」· 少林好感+30',
    reward: { exp: 1200, item: 'item_xuantie_shard1', rel_sect: 'shaolin', rel_val: 30 },
    triggerCity: 'songshan',
    nextQuest: 'mq_act2_wudang',
  },

  act2_wudang: {
    id: 'mq_act2_wudang',
    icon: '☯',
    act: 2,
    name: '武当之危',
    desc: '武当派清虚真人掌握第二块碎片的秘密，但三日前失联于后山。你赶往武当，发现清虚真人遭玄冥教杀手埋伏，身负重伤。他将碎片线索告知于你后便昏迷不醒——而凶手，还在武当山中潜伏！',
    type: 'kill',
    rewardText: '经验+1000 · 获得「玄铁令碎片（二）」',
    reward: { exp: 1000, item: 'item_xuantie_shard2', rel_sect: 'wudang', rel_val: 20 },
    targetNpcId: 'npc_xuanming_assassin_wudang',
    targetName: '玄冥教刺客',
    targetCityId: 'wudang',
    nextQuest: 'mq_act2_kunlun',
  },

  act2_kunlun: {
    id: 'mq_act2_kunlun',
    icon: '🏔',
    act: 2,
    name: '昆仑试炼',
    desc: '第三块碎片的线索指向昆仑雪山。昆仑派掌门白崖子告知：血骨门已派大批人马前往昆仑秘道，意图抢先夺取碎片。昆仑弟子伤亡惨重，白崖子恳请你前往支援，阻止血骨门的图谋！',
    type: 'dungeon',
    rewardText: '经验+1200 · 昆仑好感+30',
    reward: { exp: 1200, rel_sect: 'kunlun', rel_val: 30 },
    targetNpcId: 'npc_xuegu_elite_kunlun',
    targetName: '血骨门坛主',
    targetCityId: 'kunlun',
    nextQuest: 'mq_act2_three_shards',
  },

  act2_three_shards: {
    id: 'mq_act2_three_shards',
    icon: '🔩',
    act: 2,
    name: '三碎合一',
    desc: '你带着两块碎片返回中原——第三块碎片，你已从昆仑秘道中夺取。三块碎片在掌心微微震动，彼此呼应，竟缓缓合在一起，透出幽蓝色的光芒！消息传出，三魔联盟为之震动，骨冥子亲自下令：追杀持碎片者！',
    type: 'collect',
    rewardText: '经验+1500 · 获得「玄铁令碎片（三）」',
    reward: { exp: 1500, item: 'item_xuantie_shard3' },
    nextQuest: 'mq_act2_hunt',
  },

  act2_hunt: {
    id: 'mq_act2_hunt',
    icon: '🗡',
    act: 2,
    name: '三魔追杀',
    desc: '血骨门、日月神教、玄冥教三路人马同时出动，追杀你夺回玄铁令碎片！你被迫辗转各地，边战边退，最终决定前往嵩山少林，将碎片托付给正道联盟——在那里，你将见证一场改变整个江湖格局的会盟。',
    type: 'travel',
    rewardText: '经验+1000 · 解锁第三幕',
    reward: { exp: 1000 },
    nextQuest: 'mq_act3_alliance',
    triggerCity: 'songshan',
  },

  // ── 第三幕：三魔暗涌 ──────────────────────────────────
  // 三魔联盟正式浮出水面，正邪决战迫在眉睫

  act3_alliance: {
    id: 'mq_act3_alliance',
    icon: '⚔',
    act: 3,
    name: '正道会盟',
    desc: '少林方丈广发英雄帖，各派齐聚嵩山。会上，少林方丈宣布：血骨门、日月神教、玄冥教三派已正式结盟，意图借玄铁令一统江湖。正道联盟正式成立，你被推举为联盟先锋，统领各派年轻弟子，迎击三魔联盟！',
    type: 'talk',
    rewardText: '经验+800 · 获得称号「联盟先锋」',
    reward: { exp: 800, title: '联盟先锋' },
    nextQuest: 'mq_act3_invasion',
    triggerCity: 'songshan',
  },

  act3_invasion: {
    id: 'mq_act3_invasion',
    icon: '☠',
    act: 3,
    name: '三魔并起',
    desc: '三魔联盟同时在三个方向发动进攻——血骨门进攻嵩山，玄冥教渗透武当，日月神教则剑指华山。三路告急！你必须分兵支援，但兵力有限……每一路的选择，都将决定正道的命运。',
    type: 'dungeon',
    rewardText: '经验+1200 · 解锁多线选择',
    reward: { exp: 1200 },
    targetNpcId: 'npc_xuegu_elite_songshan',
    targetName: '血骨门先遣队',
    targetCityId: 'songshan',
    nextQuest: 'mq_act3_counterattack',
  },

  act3_counterattack: {
    id: 'mq_act3_counterattack',
    icon: '🔥',
    act: 3,
    name: '绝地反击',
    desc: '正道联盟成功挡住了三魔联盟的第一波攻势。趁胜追击，你率领联盟精锐，对幽州血骨门据点发起反击！这一战，将决定谁能掌控北方武林的主动权！',
    type: 'kill',
    rewardText: '经验+2000 · 声望+50',
    reward: { exp: 2000, fame: 50 },
    targetNpcId: 'npc_xuegu_elite_youzhou',
    targetName: '血骨门副门主「血刃」',
    targetCityId: 'youzhou',
    nextQuest: 'mq_act3_division',
  },

  act3_division: {
    id: 'mq_act3_division',
    icon: '⚡',
    act: 3,
    name: '联盟暗隙',
    desc: '战后清点，你发现联盟内部有人泄露了我方情报——否则血骨门不可能精准掌握各派部署。你开始暗中调查，发现玄冥教的渗透远比想象中更深……甚至有联盟内部人员与三魔暗通款曲。',
    type: 'collect',
    rewardText: '经验+800 · 解锁情报「内鬼线索」',
    reward: { exp: 800, intel: 'intel_sect_spy' },
    nextQuest: 'mq_act3_truth',
  },

  act3_truth: {
    id: 'mq_act3_truth',
    icon: '🗝',
    act: 3,
    name: '真相浮现',
    desc: '你顺藤摸瓜，揪出了潜伏在联盟内部的叛徒——竟是联盟副盟主，日月神教的卧底！他被揭穿后当场叛逃，携带着一份绝密情报投奔三魔联盟。这份情报的内容，足以让三魔联盟发动一场足以摧毁整个正道的大战……',
    type: 'talk',
    rewardText: '经验+1000 · 开启第四幕',
    reward: { exp: 1000 },
    nextQuest: 'mq_act4_desperate',
  },

  // ── 第四幕：联盟裂隙 ──────────────────────────────────
  // 最黑暗的时刻，绝望中的希望

  act4_desperate: {
    id: 'mq_act4_desperate',
    icon: '🌑',
    act: 4,
    name: '至暗时刻',
    desc: '叛徒泄露的情报让三魔联盟占尽先机。正道各派接连遭受重创：华山派山门被围，峨眉金顶遭袭，昆仑雪道被封……最危急的是——血骨门已侦知你手中有三块玄铁令碎片，正派出全部精锐前来截杀！',
    type: 'travel',
    rewardText: '经验+600',
    reward: { exp: 600 },
    nextQuest: 'mq_act4_last_hope',
    triggerCity: 'kaifeng',
  },

  act4_last_hope: {
    id: 'mq_act4_last_hope',
    icon: '🌟',
    act: 4,
    name: '最后的希望',
    desc: '正道联盟退守开封，仅存的力量龟缩于古都之中。就在绝望之际，鹤隐老者再次现身，带来了转机：血骨门总部有一份「三魔密约」，记录了三魔联盟内部的利益分配和致命弱点。若能取得此物，三魔联盟将从内部瓦解！',
    type: 'talk',
    rewardText: '经验+500 · 获得情报「三魔密约」',
    reward: { exp: 500, intel: 'intel_demon_pact' },
    nextQuest: 'mq_act4_infiltrate',
    triggerNpc: 'npc_heyin_mysterious',
  },

  act4_infiltrate: {
    id: 'mq_act4_infiltrate',
    icon: '🗝',
    act: 4,
    name: '幽州潜入',
    desc: '你孤身潜入血骨门总部所在——幽州黑市。这里是三教九流的汇聚之地，也是骨冥子的老巢。你必须潜入庞大的地下堡垒，找到「三魔密约」，并在被发现前杀出重围！',
    type: 'dungeon',
    dungeonId: 'sd_youzhou_headquarters',
    rewardText: '经验+3000 · 获得「三魔密约抄本」· 正道声望+50',
    reward: { exp: 3000, fameRighteous: 50 },
    triggerCity: 'youzhou',
    nextQuest: 'mq_act4_leverage',
  },

  act4_leverage: {
    id: 'mq_act4_leverage',
    icon: '💣',
    act: 4,
    name: '以敌制敌',
    desc: '三魔密约的内容令你震惊：血骨门许诺日月神教事成之后独占中原，玄冥教却只得到一纸空文——三魔之间本就有裂隙！你决定将此消息透露给玄冥教，让他们与血骨门内斗，正道坐收渔利！',
    type: 'talk',
    rewardText: '经验+1200 · 玄冥教与血骨门关系恶化',
    reward: { exp: 1200 },
    nextQuest: 'mq_act4_fracture',
  },

  act4_fracture: {
    id: 'mq_act4_fracture',
    icon: '💥',
    act: 4,
    name: '三魔裂隙',
    desc: '玄冥教得知真相后勃然大怒，撤回了对血骨门的支援，转而与日月神教对峙。三魔联盟名存实亡，内部矛盾全面爆发！你趁此良机，率正道联盟精锐，向血骨门发起总攻！',
    type: 'kill',
    rewardText: '经验+2000 · 开启第五幕',
    reward: { exp: 2000 },
    targetNpcId: 'npc_xuegu_elite_youzhou',
    targetName: '血骨门长老「骨魔」',
    targetCityId: 'youzhou',
    nextQuest: 'mq_act5_prelude',
  },

  // ── 第五幕：决战天下 ──────────────────────────────────
  // 终极对决，天下的命运在此一战

  act5_prelude: {
    id: 'mq_act5_prelude',
    icon: '🌙',
    act: 5,
    name: '决战前夜',
    desc: '正道联盟各派齐聚幽州城外，决战一触即发。战前，鹤隐老者将玄铁令的秘密全盘托出：玄铁令并非武器，而是上古时期封印某种恐怖存在的钥匙——骨冥子真正想要的，不是号令江湖，而是解除封印，获取毁灭性的力量！',
    type: 'talk',
    rewardText: '经验+1000 · 解锁「玄铁令真相」',
    reward: { exp: 1000 },
    nextQuest: 'mq_act5_assemble',
  },

  act5_assemble: {
    id: 'mq_act5_assemble',
    icon: '⚔',
    act: 5,
    name: '群雄汇聚',
    desc: '正道联盟各派掌门与高手齐聚幽州城外，少林方丈、武当掌门、峨眉师太、昆仑真人……所有你想不到会并肩而立的人，此刻都站在了一起。骨冥子率血骨门精锐在城墙上列阵，双方隔着护城河对峙，天下武林的命运，就在明日一战！',
    type: 'talk',
    rewardText: '经验+800 · 全正道门派好感+15',
    reward: { exp: 800 },
    nextQuest: 'mq_act5_final_battle',
  },

  act5_final_battle: {
    id: 'mq_act5_final_battle',
    icon: '💀',
    act: 5,
    name: '血骨门决战',
    desc: '号角吹响，决战开始！正道联盟率先锋部队冲击血骨门总坛，你身先士卒，一路杀穿重重防线，击败四大护法，最终直面骨冥子！这是决定江湖命运的最终一战！',
    type: 'dungeon',
    dungeonId: 'sd_final_bloodgate',
    rewardText: '经验+8000 · 获得「玄铁令（完整）」· 称号「武林盟副盟主」· 正道声望+100',
    reward: { exp: 8000, fame: 100, title: '武林盟副盟主' },
    triggerCity: 'youzhou',
    nextQuest: 'mq_act5_seal',
  },

  act5_seal: {
    id: 'mq_act5_seal',
    icon: '🔮',
    act: 5,
    name: '玄铁封印',
    desc: '骨冥子倒下了，但封印已开始松动——他在临死前启动了禁忌之术！鹤隐老者现身，以毕生修为配合玄铁令，重新加固封印。你亲眼看见那来自深渊的黑暗被再次镇压，鹤隐老者却化为虚无，永远留在了封印之中……',
    type: 'collect',
    rewardText: '经验+3000 · 获得「玄铁令（完整）」',
    reward: { exp: 3000, item: 'item_xuantie_complete' },
    nextQuest: 'mq_act6_aftermath',
  },

  // ── 第六幕：余波未平 ──────────────────────────────────
  // 战后天下，新格局与新威胁

  act6_aftermath: {
    id: 'mq_act6_aftermath',
    icon: '🌅',
    act: 6,
    name: '战后余波',
    desc: '血骨门覆灭，三魔联盟瓦解。然而天下并未太平——玄冥教残部退往北疆，日月神教收缩西境，中原出现权力真空。各方势力蠢蠢欲动，新的江湖格局正在重塑。你站在幽州城头，眺望远方的地平线。',
    type: 'talk',
    rewardText: '经验+2000 · 声望+80',
    reward: { exp: 2000, fame: 80 },
    nextQuest: 'mq_act6_new_order',
  },

  act6_new_order: {
    id: 'mq_act6_new_order',
    icon: '🏛',
    act: 6,
    name: '武林新序',
    desc: '正道联盟正式更名为「武林盟」，各派签订新的盟约，共治江湖。你被推举为武林盟副盟主，与少林方丈并肩执掌天下武林。然而你的心中清楚：真正的江湖，从来不是靠一纸盟约就能太平的。',
    type: 'talk',
    rewardText: '经验+1500 · 获得称号「武林副盟主」',
    reward: { exp: 1500, title: '武林副盟主' },
    nextQuest: 'mq_act6_new_threat',
  },

  act6_new_threat: {
    id: 'mq_act6_new_threat',
    icon: '🌑',
    act: 6,
    name: '新敌浮现',
    desc: '就在武林盟成立的庆功宴上，一封血书送到了少林方丈手中——北疆传来消息：封印之地出现异动，比骨冥子更古老、更恐怖的存在正在苏醒。鹤隐老者当年对抗的那个封印，比任何人想象的都要复杂……而你，将再次踏入未知的深渊。',
    type: 'collect',
    rewardText: '经验+1000 · 开启新篇章「北疆迷云」',
    reward: { exp: 1000 },
    nextQuest: 'mq_act6_xuantie_fate',
  },

  act6_xuantie_fate: {
    id: 'mq_act6_xuantie_fate',
    icon: '🏅',
    act: 6,
    name: '玄铁归处',
    desc: '你手握完整的玄铁令，思考着它的归宿。有人认为应将其销毁，以绝后患；有人认为应留在武林盟，以备不测；也有人认为，应将玄铁令送回它原本的所在，重新加固封印。江湖路远，你的选择，将决定这片土地的最终命运。',
    type: 'talk',
    rewardText: '经验+2000 · 主线完结',
    reward: { exp: 2000, fame: 100 },
    isFinal: true,
    isEpilogue: true,
  },
};

// ── 主线关键 NPC（发布者/触发者） ─────────────────
// 这些 NPC 只在主线流程中出现（不在 NPC_DB 日常可见）
const STORY_NPCS = {
  npc_heyin_mysterious: {
    id: 'npc_heyin_mysterious',
    name: '鹤隐',
    role: '神秘老者',
    avatar: '🧙',
    city: 'luoyang',
    level: 35,
    tier: 'major',
    weapon: 'wep_iron_sword',
    armor: 'cs_cloth',
    silver: 0,
    greetings: [
      '「你来了……老夫等候多时了。」',
      '「天机不可泄露，但有些事，你不得不知。」',
      '「此地不宜久留，我长话短说。」',
    ],
    topics: [],
    shop: null,
    quests: ['mq_act1_meet'],
    intels: [],
    // 仅主线触发后出现
    storyOnly: true,
  },
};

// ── 主线关键道具 ─────────────────────────────────
const STORY_ITEMS = {
  item_main_letter: {
    id: 'item_main_letter',
    name: '神秘密信',
    icon: '📜',
    desc: '一封火漆已拆的密信，信中提及"玄铁令"与暗号地点"问路亭"。信纸材质不凡，墨迹工整，显然出自名家之手。',
    type: 'quest',
    stackable: false,
  },
  item_secret_pouch: {
    id: 'item_secret_pouch',
    name: '玄悟锦囊',
    icon: '🎴',
    desc: '少林达摩院首座玄悟大师留下的锦囊，内有残缺地图碎片和一行隐晦字迹。',
    type: 'quest',
    stackable: false,
  },
  item_xuantie_shard1: {
    id: 'item_xuantie_shard1',
    name: '玄铁令（一）',
    icon: '🔩',
    desc: '传说中玄铁令的第一块碎片，暗金色，触之微温，上有古篆。',
    type: 'quest',
    stackable: false,
  },
  item_xuantie_shard2: {
    id: 'item_xuantie_shard2',
    name: '玄铁令（二）',
    icon: '🔩',
    desc: '玄铁令的第二块碎片，与第一块拼合后微微发光，古篆字迹显现。',
    type: 'quest',
    stackable: false,
  },
  item_xuantie_shard3: {
    id: 'item_xuantie_shard3',
    name: '玄铁令（三）',
    icon: '🔩',
    desc: '玄铁令的第三块碎片，取自昆仑秘道深处。与前两块拼合后，玄铁令隐隐发出幽蓝之光。',
    type: 'quest',
    stackable: false,
  },
  item_xuantie_complete: {
    id: 'item_xuantie_complete',
    name: '玄铁令（完整）',
    icon: '🏅',
    desc: '三块碎片合一，玄铁令重见天日！通体黑金，古篆流光，持令者攻击+30，感天下兵器之气。',
    type: 'legendary',
    stackable: false,
    effect: { atkBonus: 30, mpBonus: 50, critBonus: 0.08 },
  },
};

// ── 支线任务（与背景挂钩） ────────────────────────
// 格式与 QUEST_DB 兼容，可直接合并展示
// 每条支线含 narrative（叙事）对象：
//   accept  接任时弹出的介绍（npcAvatar/npcName/scene/bgChar/lines/tip）
//   inProgress  进行中提示语（简短）
//   complete    完成时弹出的叙事（scene/lines/reward说明）
const SIDE_QUEST_DB = {

  // ════════════ 三魔联盟系列 ════════════

  sq_xuegu_terrorize: {
    id: 'sq_xuegu_terrorize',
    icon: '💀',
    name: '血骨门的恐吓',
    desc: '洛阳城北的村民反映，近日有血骨门弟子在附近勒索收保护费，弄得人心惶惶。能否替他们出头？',
    type: 'kill',
    targetNpcId: 'npc_xuegu_ruffian',
    targetName: '血骨门小喽啰',
    rewardText: '银两50 + 经验150 + 声望+15',
    reward: { silver: 50, exp: 150, fame: 15 },
    availCities: ['luoyang', 'zhengzhou'],
    unlockCondition: { minLevel: 1 }, // 任何等级可接
    narrative: {
      accept: {
        npcAvatar: '👴',
        npcName: '村长王老伯',
        scene: '洛阳城北·村口',
        bgChar: `
   ┌──────────────────┐
   │  🏘️  村  庄      │
   │  「再不管，     │
   │   我们只能逃    │
   │   了……」        │
   └──────────────────┘`,
        lines: [
          '城北的王老伯颤巍巍地拦住你，身后是几个面色惨白的村民。',
          '「大侠，那些披着黑衣的人，说是血骨门的，每隔三日来收一次"保护费"。』',
          '「上个月老李头不服气，当场就被打断了腿……我们没有办法，只能求您了！」',
          '血骨门竟已嚣张至此，在光天化日下欺压百姓。你握紧了刀柄。',
        ],
        tip: '前往城北寻找并驱逐血骨门小喽啰',
      },
      inProgress: '血骨门的喽啰还在城北横行，村民们还在等你。',
      complete: {
        scene: '洛阳城北·村口',
        lines: [
          '血骨门喽啰落荒而逃，村民们纷纷从屋内涌出，老伯拉着你的手老泪纵横。',
          '「大侠啊！您就是活菩萨下凡……」',
          '「这点银子是全村凑的，您一定要收下，算是大伙的心意。」',
          '你望着他们感激的面孔，心中知道，这才是侠义二字真正的分量。',
        ],
      },
    },
  },

  sq_xuanming_intel: {
    id: 'sq_xuanming_intel',
    icon: '🔍',
    name: '玄冥教的渗透',
    desc: '武当派弟子怀疑门内有玄冥教的奸细，需要你暗中查访，找到那名奸细并将其逐出。',
    type: 'kill',
    targetNpcId: 'npc_xuanming_spy',
    targetName: '玄冥教奸细',
    rewardText: '银两80 + 经验200 + 武当好感+15',
    reward: { silver: 80, exp: 200, rel_sect: 'wudang', rel_val: 15 },
    availCities: ['wudang'],
    narrative: {
      accept: {
        npcAvatar: '🧑‍⚕️',
        npcName: '武当弟子清风',
        scene: '武当山·后山小径',
        bgChar: `
   ☯  ☯  ☯  ☯  ☯  ☯
   ──武当后山密道入口──
   🌲  🌲  🌲  🌲  🌲
   「此地无人，可以说」`,
        lines: [
          '武当弟子清风神色慌张，把你拉到后山偏僻处，四下打量了一番。',
          '「侠士，我们怀疑山上有玄冥教的眼线——掌门的行程早被人传出去过两次了。」',
          '「我们内部不便出手，查的都是自己师兄弟，太难开口。只好求助于外人。」',
          '「若你查到奸细，驱逐即可，不必赶尽杀绝——毕竟那人或许也是被迫的。」',
        ],
        tip: '在武当山内寻找玄冥教奸细的踪迹',
      },
      inProgress: '武当山上还有玄冥教的眼线，清风道弟在等你的消息。',
      complete: {
        scene: '武当山·后山',
        lines: [
          '玄冥教奸细身败被擒，在你追问下，说出了他被胁迫入门的苦衷，随即遁走。',
          '清风道弟赶来，长舒一口气：「多亏侠士相助，武当的秘密终于不再外泄。」',
          '「掌门让我转告：武当的大门，永远为您敞开。」',
          '山风吹过，松涛阵阵，武当的清静终于归来。',
        ],
      },
    },
  },

  sq_haisha_blockade: {
    id: 'sq_haisha_blockade',
    icon: '⚓',
    name: '海沙帮封路',
    desc: '海沙帮的人在沧州到扬州的水路上设卡，拦截南来北往的商船。码头掌柜求你出手解决。',
    type: 'kill',
    targetNpcId: 'npc_haisha_captain',
    targetName: '海沙帮水寇队长',
    rewardText: '银两120 + 经验250 + 声望+20',
    reward: { silver: 120, exp: 250, fame: 20 },
    availCities: ['cangzhou', 'yangzhou'],
    narrative: {
      accept: {
        npcAvatar: '🧔',
        npcName: '码头掌柜吴有财',
        scene: '沧州码头·货仓',
        bgChar: `
   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
   ⚓  码  头  ⚓
   ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
   🚢  [被扣押的商船]`,
        lines: [
          '码头掌柜吴有财急得团团转，见到你如见救星，拉着你进了货仓。',
          '「大侠！海沙帮在运河北段拦了个卡，过路就要收"买路钱"，已经扣了三条商船！」',
          '「官府的人打点好了，根本不管。商会的镖师去了也吃了亏，今天连个船影子都不敢靠近！」',
          '「您要是能把他们水寇队长打服，我们商会愿出一百二十两酬谢！」',
        ],
        tip: '前往沧州运河段，击败海沙帮水寇队长',
      },
      inProgress: '运河上的海沙帮水寇还在为非作歹，商船动弹不得。',
      complete: {
        scene: '沧州码头·运河边',
        lines: [
          '海沙帮水寇队长被打得半跪在船板上，连称"大侠饶命"，随后带着残兵退出了运河段。',
          '码头上掌声四起，被扣押的船家纷纷鸣笛致谢。',
          '吴掌柜满脸红光，把一锭银子塞进你手里：「大侠，运河畅通，功劳都是您的！」',
          '漕运再度繁忙起来，运河两岸飘着货船的帆影。',
        ],
      },
    },
  },

  sq_riyue_spy: {
    id: 'sq_riyue_spy',
    icon: '🌙',
    name: '日月神教的细作',
    desc: '有人发现日月神教在长安城内布置了情报网，正在刺探各大门派的秘密。正道联盟悬赏追查。',
    type: 'kill',
    targetNpcId: 'npc_riyue_spy_changan',
    targetName: '日月神教细作',
    rewardText: '银两100 + 经验180 + 声望+25',
    reward: { silver: 100, exp: 180, fame: 25 },
    availCities: ['changan'],
    narrative: {
      accept: {
        npcAvatar: '👩‍💼',
        npcName: '正道联络人苏云烟',
        scene: '长安城·茶馆雅间',
        bgChar: `
   ╔═══════════════╗
   ║  🍵 茶馆雅间  ║
   ║  「隔墙有耳」 ║
   ║  慎言…        ║
   ╚═══════════════╝`,
        lines: [
          '茶馆雅间内，一名素衣女子向你做了个手势，示意坐下说话。',
          '「我是正道联盟在长安的联络人，叫我苏云烟就好。」她声音压得极低。',
          '「日月神教在长安安插了一名细作，伪装成普通商人，已经将数条机密传出城去。」',
          '「你来长安，是江湖上出了名的人，他不会怀疑你出手。联盟愿以百两酬谢。」',
        ],
        tip: '在长安城内找到并清除日月神教细作',
      },
      inProgress: '日月神教的细作还在长安城内藏匿，苏云烟在等你的消息。',
      complete: {
        scene: '长安城·茶馆雅间',
        lines: [
          '细作被你当场拿下，搜出了藏在砚台夹层里的密信，上面记录着数个正道弟子的行踪。',
          '苏云烟扫了眼密信，眉头微松：「幸好及时，否则后果不堪设想。」',
          '「正道联盟记你一功，这些银两聊表谢意。江湖路上，若有用到联盟之处，遣信来即可。」',
          '窗外长安城灯火如昼，这一晚的危机悄然解除。',
        ],
      },
    },
  },

  // ════════════ 中立势力系列 ════════════

  sq_tiandibang_toll: {
    id: 'sq_tiandibang_toll',
    icon: '🪙',
    name: '天地帮的过路钱',
    desc: '汉中道上，天地帮的人见商队就收"保护费"，已经逼走了三批客商。商会托你出手。',
    type: 'kill',
    targetNpcId: 'npc_tiandibang_toll',
    targetName: '天地帮收费头目',
    rewardText: '银两150 + 经验200',
    reward: { silver: 150, exp: 200 },
    availCities: ['hanzhong'],
    narrative: {
      accept: {
        npcAvatar: '👨‍💼',
        npcName: '汉中商会会长',
        scene: '汉中·商会大堂',
        bgChar: `
   ──────────────────
   🏪  汉中商会
   ──────────────────
   账目：本月收入 ↓↓
   原因：天地帮拦路`,
        lines: [
          '商会会长将你请进大堂，面色凝重地展开一张地图，指着汉中官道上的一个圈。',
          '「天地帮在这里设了卡，凡过路商队，每次收"平安费"三两到十两不等，视货物多少而定。」',
          '「上个月三支商队不服，被当场砸了货。官府收了天地帮的孝敬，两眼一闭不管。」',
          '「侠士若能打走那收费头目，商会愿给一百五十两，且日后过路一律以贵客相待！」',
        ],
        tip: '前往汉中官道，击败天地帮收费头目',
      },
      inProgress: '汉中道上天地帮还在设卡，商队们只能绕远路走，损失惨重。',
      complete: {
        scene: '汉中·官道路口',
        lines: [
          '天地帮头目被你三拳两脚打翻在地，爬起来撒腿就跑，拦路的小喽啰四散奔逃。',
          '远处等候已久的商队缓缓驶来，领队向你抱拳："多谢侠士！今天开路，今后也畅通了！"',
          '汉中商会会长亲自送来酬劳，另附一封手书，说是"日后走汉中，商会保您周全"。',
        ],
      },
    },
  },

  sq_mingjiao_recruit: {
    id: 'sq_mingjiao_recruit',
    icon: '🔥',
    name: '明教的拉拢',
    desc: '明教使者悄悄找到你，希望你"帮个小忙"——护送一批物资前往西北，不问来历，不问去处。事成之后给你一大笔银子。',
    type: 'escort',
    rewardText: '银两200 + 经验300（声誉有变动风险）',
    reward: { silver: 200, exp: 300, alignment_penalty: 'righteous', alignment_bonus: 'chaotic' },
    availCities: ['changan', 'hanzhong'],
    narrative: {
      accept: {
        npcAvatar: '🕵️',
        npcName: '明教使者「红袖」',
        scene: '长安城郊·荒庙',
        bgChar: `
   🔥  🔥  🔥  🔥
   ─ 圣  火  长  明 ─
   🔥  🔥  🔥  🔥
   明教·教义：除暴安良`,
        lines: [
          '一名红衣女子在城郊荒庙候你，见面便开门见山，语气不卑不亢。',
          '「我是明教的使者，人称红袖。教主有令，需将一批物资秘密运往西北，关乎数百流民的生计。」',
          '「不要问是什么物资，也不要问送往何处——只需护送三日，安全交接，钱给足。」',
          '「当然……正道中人大多看不起明教。这趟差事，名声上或许有点风险。愿意做吗？」',
        ],
        tip: '护送明教物资前往西北（此任务可能影响正道声誉）',
      },
      inProgress: '明教的物资还在路上，红袖在等你的护送。',
      complete: {
        scene: '西北·黄土坡',
        lines: [
          '物资安然抵达，接头的明教弟子打开箱子——里面是粮食、布匹、药材，确实是救济流民的物资。',
          '红袖向你深深一礼：「多谢侠士信任明教。世人以为我们是邪道，却不知我们从未忘记苍生。」',
          '你望着不远处流民村庄升起的炊烟，心中五味杂陈。江湖的是非，从来不是一句话说得清的。',
        ],
      },
    },
  },

  // ════════════ 地方民间系列 ════════════

  sq_beast_wolf_pack: {
    id: 'sq_beast_wolf_pack',
    icon: '🐺',
    name: '狼群之患',
    desc: '华北平原近日不断有旅人遭到狼群袭击，猎户们联合悬赏，希望有人能深入狼巢，清剿头狼。',
    type: 'kill',
    targetNpcId: 'npc_wolf_alpha',
    targetName: '巨狼首领',
    rewardText: '银两60 + 经验120 + 狼皮×2',
    reward: { silver: 60, exp: 120, item: 'item_wolf_pelt' },
    availCities: ['zhengzhou', 'kaifeng', 'anyang'],
    narrative: {
      accept: {
        npcAvatar: '🏹',
        npcName: '猎户头领老猎',
        scene: '华北平原·猎户聚落',
        bgChar: `
   🐺 🐺 🐺 🐺 🐺
   ─ 狼 嚎 彻 夜 ─
   🌾  🌾  🌾  🌾
   猎户：「不敢出门」`,
        lines: [
          '猎户头领老猎满脸风霜，在篝火边递给你一碗热汤。',
          '「大侠，我们打了一辈子猎，从来没怕过什么。但这次不同——来了一头巨狼，比寻常狼王大了不止一倍。」',
          '「上个月已经死了两个人，都是我的弟兄。官府说是走山路不小心。走山路哪会留下那种爪印！」',
          '「我们筹了六十两，求侠士帮我们杀了那头巨狼首领，好让大家再过几天消停日子。」',
        ],
        tip: '深入华北丛林，猎杀狼群首领',
      },
      inProgress: '华北山林里的巨狼首领还未被击杀，猎户们仍不敢出门。',
      complete: {
        scene: '华北平原·猎户聚落',
        lines: [
          '你将巨狼的牙齿带回猎户聚落，老猎颤抖着接过，眼眶泛红。',
          '「就是这头畜生……终于……弟兄们，可以瞑目了。」他哽咽着说不下去。',
          '全聚落的人都出来了，孩子们欢呼着绕着你跑。老猎把攒了许久的银子一把塞进你怀里。',
          '「大侠，日后路过，猎户们的灶火永远为你留着！」',
        ],
      },
    },
  },

  sq_tiger_mountain: {
    id: 'sq_tiger_mountain',
    icon: '🐯',
    name: '伏虎问路',
    desc: '嵩山通往少林的山道上，一头巨虎占据要道，已咬死数名进香香客。少林弟子请求江湖侠士出手相助。',
    type: 'kill',
    targetNpcId: 'npc_tiger_songshan',
    targetName: '嵩山白额虎',
    rewardText: '银两80 + 经验160 + 少林好感+10',
    reward: { silver: 80, exp: 160, rel_sect: 'shaolin', rel_val: 10 },
    availCities: ['songshan'],
    narrative: {
      accept: {
        npcAvatar: '👨‍🦱',
        npcName: '少林弟子慧明',
        scene: '嵩山·山道入口',
        bgChar: `
   ⛰️⛰️⛰️⛰️⛰️⛰️
   ─ 嵩 山 山 道 ─
   [封路告示]
   ⚠️ 猛虎出没，禁止通行`,
        lines: [
          '山道入口处贴着封路告示，少林弟子慧明守在旁边，见到你便合掌施礼。',
          '「阿弥陀佛。侠士有所不知，山道正中出了一头白额老虎，体型异常，凶猛异常。」',
          '「上月咬死了两名进香的善男信女，寺里已封路七日，但香客们的路一日不通，少林愧对十方。」',
          '「我佛慈悲，寺里不便出手伤生。但若侠士愿意伏虎，少林感激不尽，必有厚谢。」',
        ],
        tip: '前往嵩山山道中段，击败白额虎',
      },
      inProgress: '嵩山山道仍被白额虎封锁，香客们无法上山礼佛。',
      complete: {
        scene: '嵩山·少林寺山门',
        lines: [
          '白额虎最终倒在山道上，一身虎纹煞是威风。慧明赶来，双手合十，面色复杂。',
          '「阿弥陀佛，生死有命……侠士出手，实乃众生之福。」',
          '「方丈吩咐，请侠士进寺用斋饭，并赐下少林挂单证，日后无论何时，少林大门为您而开。」',
          '山道重新畅通，香火的气味随风飘来，嵩山重回往日的安宁。',
        ],
      },
    },
  },

  sq_bandit_hideout: {
    id: 'sq_bandit_hideout',
    icon: '🗡',
    name: '匪窟清剿',
    desc: '沧州城西十里有处废弃山寨，近被一伙强盗占据，四处打家劫舍。知府出告示，捉拿匪首，赏银三百两。',
    type: 'kill',
    targetNpcId: 'npc_bandit_chief_cangzhou',
    targetName: '强盗头目"断刀张"',
    rewardText: '银两300 + 经验400 + 声望+30',
    reward: { silver: 300, exp: 400, fame: 30 },
    availCities: ['cangzhou'],
    narrative: {
      accept: {
        npcAvatar: '📜',
        npcName: '沧州城门告示',
        scene: '沧州·府衙告示墙',
        bgChar: `
   ╔══════════════════╗
   ║  🔴 官府悬赏告示  ║
   ║  匪首：断刀张     ║
   ║  赏银：三百两     ║
   ║  ⚠️ 危险，谨慎  ║
   ╚══════════════════╝`,
        lines: [
          '府衙墙上的告示已经贴了半个月，笔迹已被风吹得有些模糊，但内容依然触目惊心。',
          '悬赏对象：断刀张，原沧州镖师，后落草为寇，盘踞城西废寨，手下数十人，劫杀过往商旅已逾二十余人。',
          '知府衙门派兵清剿两次，均铩羽而归，如今只能贴告示求助于江湖人士。',
          '三百两，不是小数目。而且——若非江湖中人，恐怕还真拿不下他。',
        ],
        tip: '前往沧州城西废寨，击败匪首断刀张',
      },
      inProgress: '断刀张仍在沧州城西作乱，府衙的赏银还在等着。',
      complete: {
        scene: '沧州·府衙大堂',
        lines: [
          '断刀张被你亲手擒住，押送到府衙，知府大人看见他，险些喜极而泣。',
          '「侠士大才！本府代沧州百姓谢过！这三百两，分文不少！」',
          '门外围了一圈看热闹的百姓，有人认出你来，喊了声"英雄"，霎时间掌声雷动。',
          '你淡淡一笑，转身走入人群——江湖路上，这不过是寻常一日。',
        ],
      },
    },
  },

  sq_desert_caravan: {
    id: 'sq_desert_caravan',
    icon: '🐫',
    name: '沙漠护镖',
    desc: '一支商队要从玉门关穿越沙漠前往龟兹，途中有西域马匪活动，需要一名高手护送。',
    type: 'escort',
    rewardText: '银两250 + 经验350 + 西域特产',
    reward: { silver: 250, exp: 350, item: 'item_western_gift' },
    availCities: ['yumenguan', 'guizi'],
    narrative: {
      accept: {
        npcAvatar: '🐪',
        npcName: '西域商人阿合木',
        scene: '玉门关·驼队聚集处',
        bgChar: `
   🌵  🌵  🌵  🌵
   ─ 丝 路 驿 道 ─
   🐫🐫🐫  →→→
   目标：龟兹城`,
        lines: [
          '玉门关外，一支驼队正在整理行装，领队是个留着大胡子的西域商人，见到你便热情地用半生不熟的中原话打招呼。',
          '「朋友！你是高手，我看得出！我叫阿合木，从大食来的商人，带了一批上好的丝绸要去龟兹。」',
          '「但是……沙漠里最近不安全。有一伙马匪，专门劫丝路商队，已经让两支商队血本无归了。」',
          '「跟我走，三日到龟兹，二百五十两加上西域特产，怎么样？」',
        ],
        tip: '护送阿合木的驼队安全抵达龟兹',
      },
      inProgress: '阿合木的驼队还在沙漠中，等你同行护送。',
      complete: {
        scene: '龟兹城·西域市集',
        lines: [
          '驼队穿越沙漠，成功抵达龟兹。阿合木激动地抱住你，用西域语连声道谢。',
          '「朋友！你最勇敢！马匪见到你，跑得像风一样！哈哈哈！」',
          '他从驼背上取下一个雕花木盒，里面是一块晶莹的西域玉石和一袋金币。',
          '「这是我们西域人的礼节——朋友的朋友，就是我的家人。以后来大食，找阿合木！」',
        ],
      },
    },
  },

  sq_poison_village: {
    id: 'sq_poison_village',
    icon: '☠',
    name: '苗疆蛊毒',
    desc: '贵阳附近一个村庄突然爆发怪病，症状像是中了蛊毒。有人说是五毒教弟子做的实验……',
    type: 'kill',
    targetNpcId: 'npc_wudu_experiment',
    targetName: '五毒教弟子',
    rewardText: '银两80 + 经验200 + 解蛊秘方',
    reward: { silver: 80, exp: 200, item: 'item_antidote_recipe' },
    availCities: ['guiyang', 'miaojiang'],
    narrative: {
      accept: {
        npcAvatar: '👩‍⚕️',
        npcName: '苗疆郎中阿秀',
        scene: '贵阳附近·苗寨',
        bgChar: `
   🌿  🌿  🌿  🌿
   ─ 苗 疆 山 寨 ─
   ⚠️ 蛊毒警戒
   🏠🏠🏠  病人众多`,
        lines: [
          '寨子里弥漫着一股草药混合着腥甜的怪味，苗疆郎中阿秀满眼焦虑地迎上来。',
          '「外来的侠士，你来得正好！寨子里已经有三十多人出现同样的症状：昏昏欲睡，皮肤泛黑。」',
          '「我行医三十年，认得出这是蛊毒——而且不是天然的，是人工施的。」',
          '「两天前，有个穿五毒教衣服的年轻人在寨外出没，我怀疑就是他。侠士若能找到他，夺回解蛊秘方……这些人就有救了！」',
        ],
        tip: '在苗疆附近找到五毒教弟子，夺取解蛊秘方',
      },
      inProgress: '苗寨的村民还在苦苦熬着，五毒教弟子和解蛊秘方还未找到。',
      complete: {
        scene: '贵阳附近·苗寨',
        lines: [
          '五毒教弟子被你制服，一番问话后得知他不过是个失手的新弟子，做实验时操控失误，蛊毒扩散出去。',
          '你从他身上搜出解蛊秘方，交给阿秀郎中。',
          '「有了这个，我今晚就能配药！」阿秀双手颤抖着接过，眼眶湿润，「侠士救了全寨子的人！」',
          '三日后，寨子里的人陆续康复。阿秀将世代相传的解蛊秘方誊抄了一份送给你，作为酬谢。',
        ],
      },
    },
  },

  // ════════════ 新增支线：情感·江湖恩仇系列 ════════════

  sq_old_rival: {
    id: 'sq_old_rival',
    icon: '⚔',
    name: '三十年的仇',
    desc: '一名白发老侠士拦住你，自称是已故"断剑客"的弟子，他的师父三十年前被一名黑衣杀手所害，杀手如今就在江湖上活着，他年老体衰，无力复仇，求你代劳。',
    type: 'kill',
    targetNpcId: 'npc_shadow_master',
    targetName: '黑衣杀手"影无形"',
    rewardText: '经验500 + 断剑诀（残卷）+ 声望+20',
    reward: { exp: 500, item: 'item_broken_sword_manual', fame: 20 },
    availCities: ['luoyang', 'kaifeng', 'zhengzhou'],
    narrative: {
      accept: {
        npcAvatar: '🧓',
        npcName: '白发老侠孟秋水',
        scene: '洛阳城外·大槐树下',
        bgChar: `
   🌳  大  槐  树
   ──────────────
   「三十年了……」
   一个老人在树下等`,
        lines: [
          '城外大槐树下，一个须发皆白的老人见到你，艰难地从石头上站起来，向你抱拳。',
          '「在下孟秋水，是已故断剑客沈无忧的弟子。侠士，老夫有一事相求，已等了三十年。」',
          '「三十年前，一名叫"影无形"的杀手受人雇佣，趁夜刺杀了我师父，夺走了断剑诀。如今我已老朽，这口气终究要有人来出。」',
          '他从怀中摸出半张泛黄的画像，递给你：「此人如今在江湖上仍在接暗杀生意，以"影门"为号，就在中原一带活动。」',
          '「老夫没有别的可以给你，只有师父留下的半本断剑诀——事成之后，全部归你。」',
        ],
        tip: '在中原各城市寻找黑衣杀手"影无形"并将其击败',
      },
      inProgress: '孟秋水还在那棵大槐树下等着，三十年的仇还未了结。',
      complete: {
        scene: '洛阳城外·大槐树下',
        lines: [
          '你把"影无形"留下的腰牌带回来，放在孟秋水颤抖的手心里。',
          '老人久久不说话，只是低头盯着那块铁牌，泪水悄悄滑落，滴在地上。',
          '「师父……弟子没忘。」他喃喃道。',
          '良久，他抬起头，将一个布包郑重地递给你：「断剑诀，全本。请侠士收下，愿你比我师父走得更远。」',
          '你接过布包，看了他一眼，转身离去。背后，老人重新坐回了大槐树下，神情前所未有地平静。',
        ],
      },
    },
  },

  sq_twin_swords: {
    id: 'sq_twin_swords',
    icon: '🗡',
    name: '鸳鸯双刀的下落',
    desc: '扬州一名女镖师委托你寻找一对传说中的"鸳鸯双刀"——那是她祖母留下的，被一名古玩商人从骗走，已辗转三手，如今据说在某个地下赌局里。',
    type: 'collect',
    targetNpcId: null,
    targetName: '鸳鸯双刀',
    rewardText: '银两180 + 经验280 + 扬州女镖师好感',
    reward: { silver: 180, exp: 280, fame: 15 },
    availCities: ['yangzhou', 'suzhou', 'jinling'],
    narrative: {
      accept: {
        npcAvatar: '👩',
        npcName: '女镖师柳如霜',
        scene: '扬州·镖局门口',
        bgChar: `
   🗡  鸳  鸯  双  刀  🗡
   ──────────────────────
   祖传 · 失窃 · 三易其主
   最后下落：扬州地下`,
        lines: [
          '扬州镖局门口，一名身着劲装的女镖师柳如霜迎上来，眼眶微红。',
          '「侠士，我知道求人帮忙不太好开口，但这对刀——是我祖母当年在战场上用过的，有特殊意义。」',
          '「七年前被一个古玩商人用假货换走，之后辗转三手，据一个消息灵通的人说，现在在一个叫"暗月坊"的地下赌局里，作为赌注或者彩头收着。」',
          '「我是镖师，行事要守规矩，不好去那种地方。侠士若能帮我找回来，一百八十两，分文不少。」',
        ],
        tip: '前往扬州周边，查找暗月坊地下赌局，找回鸳鸯双刀',
      },
      inProgress: '柳如霜还在等那对鸳鸯双刀的消息，扬州的地下赌局里或许有线索。',
      complete: {
        scene: '扬州·镖局门口',
        lines: [
          '你把一个布包递给柳如霜，她打开来，双手微颤——两柄弯刀，刀鞘上刻着交颈的鸳鸯，正是那对传说中的双刀。',
          '「是它……真的是它……」她哽咽着把双刀抱在胸前，站了很久。',
          '「祖母说过，这对刀，有情有义，保护过很多人。」她深吸一口气，郑重地向你鞠躬。',
          '「多谢侠士。银子是我这几年的积蓄，请一定收下。」',
        ],
      },
    },
  },

  sq_haunted_manor: {
    id: 'sq_haunted_manor',
    icon: '👻',
    name: '鬼宅秘闻',
    desc: '金陵城郊有一座废弃大宅，夜夜传出哭声，附近居民惶恐不安，不敢靠近。有人说里面闹鬼，有人说是有人在里面藏污纳垢。知府无力处置，悬赏有人去查明真相。',
    type: 'kill',
    targetNpcId: 'npc_ghost_assassin',
    targetName: '占宅的黑市杀手',
    rewardText: '银两160 + 经验300 + 声望+25',
    reward: { silver: 160, exp: 300, fame: 25 },
    availCities: ['jinling'],
    narrative: {
      accept: {
        npcAvatar: '📜',
        npcName: '金陵府衙告示',
        scene: '金陵城郊·废弃宅院外',
        bgChar: `
   🏚️  鬼  宅
   ──────────
   夜夜有哭声
   [实则另有隐情]
   ⚠️ 已有两人失踪`,
        lines: [
          '金陵城郊，一座大宅院的铁门上贴着封条，四周野草丛生，气氛阴冷。',
          '旁边的老婆婆小声告诉你："三个月前开始的，每到夜里就有哭声，前后有两个胆大的年轻人进去，就再也没出来。"',
          '你仔细观察宅院——铁门虽然生锈，但合缝处有新的泥痕，说明最近有人出入过。',
          '哭声？藏匿之处？失踪之人？这宅子恐怕不是真的闹鬼。',
          '府衙悬赏一百六十两，要人查清真相。',
        ],
        tip: '进入金陵鬼宅，查明真相，清除隐患',
      },
      inProgress: '金陵鬼宅里的秘密还未揭开，那两个失踪的年轻人不知死活。',
      complete: {
        scene: '金陵城郊·废弃宅院',
        lines: [
          '进入宅子深处，你发现了地下室——里面关着两名被绑架的平民，哭声正是从这里传出。',
          '占据宅院的是一名黑市杀手，以此地为据点接单藏人。你将他制服，救出了两名被绑者。',
          '失踪的两个年轻人被救出后，泪流满面地称谢。宅子里的秘密就此大白。',
          '金陵知府接到消息，亲自登门道谢，并兑现了一百六十两赏银。城郊的哭声，从此再未响起。',
        ],
      },
    },
  },

  sq_broken_family: {
    id: 'sq_broken_family',
    icon: '🏮',
    name: '破镜重圆',
    desc: '开封城一名商人哭着求你帮忙——他的独子因误交匪人被带走，被迫替匪帮跑腿，至今已三月未归。父亲打探到儿子被关在城南一处秘密据点，求你去救人。',
    type: 'kill',
    targetNpcId: 'npc_veteran',
    targetName: '匪帮头目',
    rewardText: '银两120 + 经验220 + 声望+20',
    reward: { silver: 120, exp: 220, fame: 20 },
    availCities: ['kaifeng', 'zhengzhou'],
    narrative: {
      accept: {
        npcAvatar: '👨‍👦',
        npcName: '商人赵福安',
        scene: '开封·茶铺',
        bgChar: `
   🏮  开  封  城
   ──────────────
   一张父亲寻子的告示
   「我儿何时归来……」`,
        lines: [
          '开封茶铺里，一个中年商人见到你，扑通一声跪下来，吓得你连忙扶起他。',
          '「大侠，求求你救救我儿子！他叫赵小安，今年十七岁，三个月前被城里的流氓盯上，骗他替人送了几趟东西，后来对方威胁他，说他知道了秘密，把他关起来了！」',
          '「我一个商人，打不过那些人，报官也没用，官府说没有证据……」他哽咽着，从怀里掏出一张画像，「这是我儿子，烦请大侠去城南张家废院找一找！」',
          '你看着那张画像上稚气未脱的脸，心里有了决断。',
        ],
        tip: '前往开封城南废院，击败匪帮头目，救出赵小安',
      },
      inProgress: '赵小安还被关着，赵福安每天在茶铺里等消息，眼圈越来越深。',
      complete: {
        scene: '开封·商人家中',
        lines: [
          '你把满身尘土、受了些皮外伤的赵小安带回来，父子俩抱在一起，久久不肯分开。',
          '「爹……我以为再也见不到你了……」少年哭得上气不接下气。',
          '赵福安强忍着泪水，从柜台后面取出一个沉甸甸的布袋，双手奉上：「侠士大恩，无以为报，这一百二十两是全部积蓄，请务必收下！」',
          '你看着这一对父子，心里涌起一股说不清的温热。江湖凶险，但这世上，也有这样值得守护的东西。',
        ],
      },
    },
  },
};

// ── 支线任务状态存取 ─────────────────────────────
// 存在 localStorage 的 wuxia_side_quests 中
function getSideQuestState(){
  try{ return JSON.parse(localStorage.getItem('wuxia_side_quests')||'{}'); }
  catch(e){ return {}; }
}
function saveSideQuestState(data){
  localStorage.setItem('wuxia_side_quests', JSON.stringify(data));
}
function getSideQuestStatus(sqId){
  return getSideQuestState()[sqId] || 'available'; // available / active / done
}
function acceptSideQuest(sqId){
  const st = getSideQuestState();
  if(st[sqId] && st[sqId] !== 'available') return false;
  st[sqId] = 'active';
  saveSideQuestState(st);
  return true;
}
function completeSideQuest(sqId){
  const st = getSideQuestState();
  if(st[sqId] !== 'active') return false;
  st[sqId] = 'done';
  saveSideQuestState(st);
  // 发放奖励
  const sq = SIDE_QUEST_DB[sqId];
  if(sq && sq.reward){
    const r = sq.reward;
    // ① 经验
    if(r.exp && typeof giveExp === 'function') giveExp(r.exp);
    // ② 银两
    if(r.silver){ addSilver(r.silver); SilverManager.save(); }
    // ③ 声望
    if(r.fame && typeof jianghuState !== 'undefined' && jianghuState.reputation){ jianghuState.reputation.fame = (jianghuState.reputation.fame||0)+r.fame; if(typeof jianghuSave==='function') jianghuSave(); }
    // ④ 门派好感（rel_sect）
    if(r.rel_sect && r.rel_val && typeof jianghuState !== 'undefined'){
      const sect = jianghuState.sects?.[r.rel_sect];
      if(sect){ sect.favor = (sect.favor||0) + r.rel_val; if(typeof jianghuSave==='function') jianghuSave(); }
    }
    // ⑤ 阵营倾向（alignment）
    if((r.alignment_bonus || r.alignment_penalty) && typeof jianghuState !== 'undefined'){
      const al = jianghuState.alignment = jianghuState.alignment || {};
      if(r.alignment_bonus){ al[r.alignment_bonus] = (al[r.alignment_bonus]||0) + 8; }
      if(r.alignment_penalty){ al[r.alignment_penalty] = Math.max(0, (al[r.alignment_penalty]||0) - 8); }
      if(typeof jianghuSave==='function') jianghuSave();
    }
    // ⑥ 物品奖励
    if(r.item && typeof addToConsumables === 'function') addToConsumables(r.item, 1);
  }
  return true;
}

// ── 主线任务状态存取 ──────────────────────────────
// 存在 localStorage 的 wuxia_main_quest 中
function getMainQuestProgress(){
  try{
    return JSON.parse(localStorage.getItem('wuxia_main_quest')||'{}');
  }catch(e){ return {}; }
}
function saveMainQuestProgress(data){
  localStorage.setItem('wuxia_main_quest', JSON.stringify(data));
}
function getCurrentMainQuest(){
  const prog = getMainQuestProgress();
  if(prog.current) return MAIN_QUEST_CHAIN[prog.current] || null;
  return MAIN_QUEST_CHAIN['act1_prologue'] || null;
}
function advanceMainQuest(questId){
  const q = MAIN_QUEST_CHAIN[questId];
  if(!q || !q.nextQuest) return;
  const prog = getMainQuestProgress();
  prog[questId] = 'completed';
  prog.current = q.nextQuest;
  saveMainQuestProgress(prog);

  // 主线进入第三幕时，触发世界事件「血骨门之乱达到高潮」
  const nextQ = MAIN_QUEST_CHAIN[q.nextQuest];
  if(nextQ && nextQ.act === 3 && (prog.act3EventTriggered !== true)) {
    prog.act3EventTriggered = true;
    saveMainQuestProgress(prog);
    if(typeof weAddEvent === 'function' && typeof WE_TIER !== 'undefined'){
      weAddEvent('we_mainline_chapter3', WE_TIER.MAJOR, { city: '嵩山' });
    }
    // 同步触发成就（主线第三幕到达）
    if(typeof achOnMainlineEnd === 'function'){
      // 暂不触发 ach_lore_bloodgate，留到 isFinal 节点
    }
  }
}
function isMainQuestComplete(questId){
  return getMainQuestProgress()[questId] === 'completed';
}

/** 检查到达某城市时是否触发主线 */
function checkMainQuestTriggerCity(cityId){
  const cur = getCurrentMainQuest();
  if(!cur || cur.triggerCity !== cityId) return;
  if(isMainQuestComplete(cur.id)) return;
  // 触发提示
  setTimeout(() => {
    showToast(`📖 主线任务触发：${cur.name} — ${(cur.desc||'').slice(0,30)}…`);
  }, 800);
}

/** 击杀 NPC 后检查是否推进主线 */
function checkMainQuestKill(killedNpcId){
  const cur = getCurrentMainQuest();
  if(!cur || cur.type !== 'kill') return;
  if(cur.targetNpcId !== killedNpcId) return;
  if(isMainQuestComplete(cur.id)) return;
  // 发放奖励
  const r = cur.reward;
  if(r){
    if(r.exp && typeof giveExp === 'function') giveExp(r.exp);
    if(r.silver) { addSilver(r.silver); SilverManager.save(); }
    if(r.fame && typeof jianghuState !== 'undefined' && jianghuState.reputation) { jianghuState.reputation.fame = (jianghuState.reputation.fame||0) + r.fame; jianghuSave(); }
  }
  // isFinal：触发主线终章成就
  if(cur.isFinal && typeof achOnMainlineEnd === 'function'){
    achOnMainlineEnd('bloodgate');
  }
  advanceMainQuest(cur.id);
  showToast(`🎉 主线推进：${cur.name} 完成！${cur.rewardText || ''}`);
}

// ═══════════════════════════════════════════════════════════
//  门派专属任务链系统
//  每个门派3-5个阶段任务，与主线《血骨门之乱》深度挂钩
//  任务链ID格式: sect_xxx_chapter_N (xxx=门派ID)
// ═══════════════════════════════════════════════════════════

const SECT_CHAINS = {
  // ══════════════════════════════════════════════════════
  // 【正道门派】
  // ══════════════════════════════════════════════════════

  // ── 少林寺 · 佛法护正道 ──────────────────────────────
  shaolin: {
    name: '少林寺',
    theme: '佛法护正道 · 达摩院之秘',
    chain: [
      {
        id: 'sect_shaolin_1',
        icon: '☸',
        name: '达摩院密令',
        desc: '玄慈方丈私下召见你——达摩院首座玄悟大师失踪前，曾留下一个秘密：玄铁令并非只有三块，实际上有四块。第四块的线索，就藏在少林寺的某处。',
        type: 'talk',
        targetNpc: 'shaolin_abbot',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_shaolin_2',
        narrative: {
          accept: {
            scene: '少林寺·方丈禅房',
            bgChar: `
  ☸  少  林  禅  房  ☸
  ════════════════════
  「此事关系重大」
  「切记保密」`,
            lines: [
              '玄慈方丈示意你进入密室，四下确认无人后，缓缓开口：',
              '「玄悟师兄失踪前，曾告诉老衲一个秘密——玄铁令共有四块，而非江湖传言的三块。」',
              '「第四块的线索，就藏在我少林寺的某处。但此事不能让外人知晓，否则少林将永无宁日。」',
              '「你既已入少林，便是我佛门弟子。此事……你可愿一探究竟？」',
            ],
            tip: '接受方丈的密令，寻找玄铁令第四块的线索',
          },
          complete: {
            scene: '少林寺·方丈禅房',
            lines: [
              '玄慈方丈看完你带回的线索，眉头紧锁：',
              '「原来如此……第四块玄铁令，竟在三百年前就被一位祖师带出中原，藏于……」',
              '「此事暂且保密。你做得很好，少林上下都会记住你的功劳。」',
              '「接下来，或许需要你去一趟武当山，将此事告知冲虚道长——正道联盟需要知道真相。」',
            ],
          },
        },
      },
      {
        id: 'sect_shaolin_2',
        icon: '⛰',
        name: '传讯武当',
        desc: '方丈命你前往武当山，将玄铁令第四块的秘密告知冲虚道长。但武当山路途遥远，且近日有玄冥教杀手出没……',
        type: 'travel',
        targetCity: 'wudang',
        reward: { exp: 400, contrib: 15, rel_sect: 'wudang', rel_val: 10 },
        rewardText: '经验+400 · 门派贡献+15 · 武当好感+10',
        next: 'sect_shaolin_3',
        narrative: {
          accept: {
            scene: '少林寺·山门',
            bgChar: `
  ☸  少  林  山  门  ☸
  ════════════════════
  「一路小心」
  「武当近日不太平」`,
            lines: [
              '临行前，玄慈方丈将一封密信托付于你：',
              '「这封信务必亲手交给冲虚道长。沿途小心，近来玄冥教的人频繁出现在中原。」',
              '「若遇危险，可亮出少林信物。相信武当弟子见到，会助你一臂之力。」',
            ],
            tip: '安全抵达武当山，将密信交给冲虚道长',
          },
        },
      },
      {
        id: 'sect_shaolin_3',
        icon: '💀',
        name: '护卫玄悟',
        desc: '武当传来消息：清虚真人在追查玄悟大师下落时遭遇伏击，身受重伤！据线报，伏击者正是血骨门的人。你需要前往营救。',
        type: 'kill',
        targetNpcId: 'xuegu_guardian',
        targetName: '血骨门护法',
        targetCity: 'wudang',
        reward: { exp: 800, contrib: 25, fame: 30 },
        rewardText: '经验+800 · 门派贡献+25 · 声望+30',
        next: 'sect_shaolin_4',
        narrative: {
          accept: {
            scene: '武当山·遇袭地点',
            bgChar: `
  ☯  玄  冥  杀  手  ☯
  ════════════════════
  「正道的人」
  「杀无赦！」`,
            lines: [
              '你赶到时，清虚真人已倒在血泊中，身旁是三名黑衣人的尸体。',
              '但远处还有更多的脚步声——更多的血骨门杀手正在赶来！',
              '「少林……援兵？快……救玄悟大师……他们在……幽州……」',
              '清虚真人用最后的力气说完，便昏死过去。你必须击退追兵，带他脱离险境！',
            ],
            tip: '击败血骨门护法，护卫清虚真人撤离',
          },
          complete: {
            scene: '武当山·太和宫',
            lines: [
              '清虚真人被救回武当山，经过救治已无大碍。',
              '「多谢少林弟子相救……玄悟大师被囚禁在幽州城外的一处秘密据点，由血骨门副门主亲自看守。」',
              '「此事必须尽快通知正道联盟，否则玄悟大师恐有性命之忧！」',
              '你将情报带回少林，一场营救玄悟大师的行动即将展开……',
            ],
          },
        },
      },
      {
        id: 'sect_shaolin_4',
        icon: '⚔',
        name: '血骨门之战',
        desc: '正道联盟决定发起营救行动，突袭血骨门幽州据点！作为少林弟子，你被委以重任——与血骨门副门主正面交锋，为营救队伍争取时间！',
        type: 'kill',
        targetNpcId: 'blood_bone_vice_master',
        targetName: '血骨门副门主',
        targetCity: 'youzhou',
        reward: { exp: 1500, contrib: 50, fame: 50, title: '少林护法金刚' },
        rewardText: '经验+1500 · 贡献+50 · 声望+50 · 称号：少林护法金刚',
        isFinal: true,
        narrative: {
          accept: {
            scene: '幽州城外·血骨门据点',
            bgChar: `
  💀  血  骨  据  点  💀
  ════════════════════
  「杀进去！」
  「救玄悟大师！」`,
            lines: [
              '正道联盟的高手齐聚幽州，血骨门据点前杀声震天。',
              '你作为少林先遣队，第一个冲入据点大门——',
              '血骨门副门主「血刃」拦在面前，眼中满是杀意：',
              '「少林秃驴！今日就是你的死期！」',
            ],
            tip: '击败血骨门副门主，打开营救通道',
          },
          complete: {
            scene: '幽州·血骨门废墟',
            lines: [
              '血刃倒在你面前，血骨门据点大门被攻破！',
              '玄悟大师被成功救出，虽然身体虚弱，但精神尚好。',
              '「玄铁令……第四块……在……」',
              '玄悟大师在少林寺中，向玄慈方丈和你道出了最后的秘密——',
              '【少林寺·门派任务链完结】',
              '你因功被授予「少林护法金刚」称号，正道联盟声望大增！',
            ],
          },
        },
      },
    ],
  },

  // ── 武当派 · 道法镇邪魔 ─────────────────────────────
  wudang: {
    name: '武当派',
    theme: '道法镇邪魔 · 清虚之殇',
    chain: [
      {
        id: 'sect_wudang_1',
        icon: '☯',
        name: '清虚失踪',
        desc: '武当派掌门冲虚道长紧急召见：清虚真人在追查玄铁令线索时失联三日，玉虚宫弟子在武当后山发现了打斗痕迹和血迹……',
        type: 'travel',
        targetCity: 'wudang',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_wudang_2',
        narrative: {
          accept: {
            scene: '武当山·玉虚宫',
            bgChar: `
  ☯  武  当  玉  虚  宫  ☯
  ════════════════════
  「清虚失联三日」
  「恐怕已遭不测……」`,
            lines: [
              '冲虚道长面色凝重：',
              '「清虚师弟三日前下山追查玄铁令线索，至今未归。后山发现了他与人大战的痕迹……」',
              '「据线报，玄冥教杀手近日频繁在武当附近活动。清虚师弟恐怕已落入敌手。」',
              '「你是武当弟子，此事关乎我派存亡，你可愿下山营救？」',
            ],
            tip: '前往武当后山，调查清虚真人失踪的真相',
          },
        },
      },
      {
        id: 'sect_wudang_2',
        icon: '⛧',
        name: '玄冥伏击',
        desc: '你在武当后山遭遇玄冥教杀手的伏击！击败他们，审问出清虚真人的下落！',
        type: 'kill',
        targetNpcId: 'npc_xuanming_assassin_wudang',
        targetName: '玄冥教杀手',
        targetCity: 'wudang',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 门派贡献+15',
        next: 'sect_wudang_3',
        narrative: {
          accept: {
            scene: '武当山·后山密林',
            bgChar: `
  ⛰️  玄  冥  伏  击  ⛰️
  ════════════════════
  「又一个武当的」
  「杀了他！」`,
            lines: [
              '密林中突然窜出数道黑影——玄冥教的杀手！',
              '「武当的道士，又来送死！」',
              '「清虚那老道已被我们抓走，下一个就是冲虚！」',
              '玄冥杀手！你必须击败他们，从他们口中问出清虚真人的下落！',
            ],
            tip: '击败玄冥教杀手，审问清虚真人的关押地点',
          },
          complete: {
            scene: '武当山·后山密林',
            lines: [
              '玄冥杀手被你击败，终于开口求饶：',
              '「清虚被关在……洛阳城外……玄冥教秘密据点……由玄冥二老之一亲自看守……」',
              '「求大侠饶命！小的只是奉命行事！」',
              '你从他口中得知清虚真人的关押地点，立刻返回武当禀报。',
            ],
          },
        },
      },
      {
        id: 'sect_wudang_3',
        icon: '🌙',
        name: '营救清虚',
        desc: '冲虚道长派你前往洛阳城外，营救被囚禁的清虚真人。看守者是玄冥二老之一——玄冥毒王！',
        type: 'kill',
        targetNpcId: 'xuanming_poison_king',
        targetName: '玄冥毒王',
        targetCity: 'luoyang',
        reward: { exp: 800, contrib: 25, rel_sect: 'shaolin', rel_val: 15 },
        rewardText: '经验+800 · 贡献+25 · 少林好感+15',
        next: 'sect_wudang_4',
        narrative: {
          accept: {
            scene: '洛阳城外·玄冥秘密据点',
            bgChar: `
  ⛧  玄  冥  据  点  ⛧
  ════════════════════
  「站住！」
  「擅入者死！」`,
            lines: [
              '你潜入玄冥教秘密据点，发现清虚真人被铁链锁在地牢中。',
              '但看守者已发现你——玄冥毒王现身！',
              '「武当的小辈，竟敢闯入我玄冥圣地？」',
              '「今日，就让你见识见识玄冥神掌的厉害！」',
            ],
            tip: '击败玄冥毒王，救出清虚真人',
          },
          complete: {
            scene: '洛阳城外·玄冥据点外',
            lines: [
              '玄冥毒王中毒掌反噬，被你击败！',
              '清虚真人得救后，虚弱地握住你的手：',
              '「好……好孩子……玄铁令的第二块线索……就在……」',
              '他艰难地告诉你：第二块玄铁令碎片藏在昆仑山，由昆仑三圣守护。',
              '「快……将此消息……告诉冲虚师兄……」',
            ],
          },
        },
      },
      {
        id: 'sect_wudang_4',
        icon: '🏔',
        name: '昆仑求援',
        desc: '清虚真人让你将玄铁令的消息送往昆仑山。但昆仑位于西域，途中需经过玄冥教的地盘，危险重重……',
        type: 'travel',
        targetCity: 'kunlun',
        reward: { exp: 600, contrib: 20, fame: 25 },
        rewardText: '经验+600 · 贡献+20 · 声望+25',
        next: 'sect_wudang_5',
        narrative: {
          accept: {
            scene: '西域官道',
            bgChar: `
  🏔️  西  域  荒  漠  🏔️
  ════════════════════
  「昆仑山」
  「就在前方」`,
            lines: [
              '你踏上西去的道路，沿途荒凉，危机四伏。',
              '三日后，你接近昆仑山地界——却遭遇了一队玄冥教追兵！',
              '「追了三天三夜，终于追上你了！」',
              '「玄铁令的消息，绝不能传出西域！」',
            ],
            tip: '突破玄冥教追兵，抵达昆仑山',
          },
          complete: {
            scene: '昆仑山·三圣殿',
            lines: [
              '你突破重重追兵，终于抵达昆仑山三圣殿。',
              '昆仑三圣之首白崖子听完你的来意，面色凝重：',
              '「玄铁令第二块碎片，确实在我昆仑守护。但近日血骨门的人也在打它的主意……」',
              '「武当弟子，你远道而来辛苦了。先在昆仑休整，三日后，我派人随你一同护送碎片回中原。」',
              '【武当·门派任务链完结】',
            ],
          },
        },
      },
    ],
  },

  // ── 华山派 · 剑道争锋 ──────────────────────────────
  huashan: {
    name: '华山派',
    theme: '剑道争锋 · 论剑血骨',
    chain: [
      {
        id: 'sect_huashan_1',
        icon: '⚔',
        name: '剑气之争',
        desc: '华山派近期山匪猖獗，岳怀瑾掌门命你下山清剿。但这些山匪似乎不是普通匪徒，背后似乎有血骨门的影子……',
        type: 'kill',
        targetNpcId: 'xuegu_ruffian',
        targetName: '血骨门伪装山匪',
        targetCity: 'huashan',
        reward: { exp: 400, contrib: 12 },
        rewardText: '经验+400 · 门派贡献+12',
        next: 'sect_huashan_2',
        narrative: {
          accept: {
            scene: '华山·思过崖',
            bgChar: `
  ⚔  华  山  论  剑  堂  ⚔
  ════════════════════
  「近日山匪猖獗」
  「你去清剿一番」`,
            lines: [
              '岳怀瑾掌门将一封密令交给你：',
              "「华山附近近日出现一伙'山匪'，打家劫舍，扰乱治安。」",
              '「但据探子回报，这些人训练有素，绝非普通山匪。恐怕是血骨门的人伪装。」',
              '「你下山一趟，查明真相。若真是邪道中人，杀无赦！」',
            ],
            tip: '下山清剿山匪，查明其真实身份',
          },
          complete: {
            scene: '华山·山道',
            lines: [
              '你击败山匪后，从他们身上搜出血骨门的令牌！',
              '「果然是血骨门的人……他们在华山附近布置眼线，恐怕是为了监视华山派……」',
              '更重要的是，你从匪首身上搜出一封密信，上面写着：',
              '「华山剑宗秘典，务必夺回！」——看来血骨门对华山的武学秘籍也有所图谋！',
            ],
          },
        },
      },
      {
        id: 'sect_huashan_2',
        icon: '📜',
        name: '华山秘典',
        desc: '血骨门觊觎华山剑宗秘典！岳掌门命你加强戒备，并主动出击，捣毁血骨门在华山附近的秘密据点！',
        type: 'dungeon',
        targetDungeon: 'dungeon_huashan_cave',
        reward: { exp: 700, contrib: 20, skill: 'huashan_secret_sword' },
        rewardText: '经验+700 · 贡献+20 · 解锁华山秘传剑法',
        next: 'sect_huashan_3',
        narrative: {
          accept: {
            scene: '华山·掌门密室',
            bgChar: `
  ⚔  华  山  掌  门  室  ⚔
  ════════════════════
  「华山剑宗秘典」
  「绝不能落入外人之手」`,
            lines: [
              '岳掌门看完密信，拍案而起：',
              '「好大的胆子！华山剑宗秘典传承三百年，岂容血骨门染指！」',
              '「据线人回报，血骨门在华山北麓有一秘密据点，专门收集各派武学秘籍。」',
              '「你带几个师兄弟，去把那个据点给我端了！秘典若在那儿，一并带回！」',
            ],
            tip: '潜入华山北麓，捣毁血骨门秘密据点',
          },
          complete: {
            scene: '华山北麓·血骨据点废墟',
            lines: [
              '你率华山弟子攻破血骨门据点，缴获大量赃物——其中就包括华山剑宗秘典！',
              '但更令人震惊的是，据点中还有大量其他门派的武学秘籍残页……',
              '「看来血骨门的野心不止华山，而是整个正道武林！」',
              '岳掌门看后大怒：「将此消息通报正道联盟！各派必须提高警惕！」',
            ],
          },
        },
      },
      {
        id: 'sect_huashan_3',
        icon: '🏔',
        name: '嵩山会盟',
        desc: '正道联盟发出英雄帖，各派齐聚嵩山少林，商讨对抗血骨门之策。作为华山派代表，你需前往少林参加会盟。',
        type: 'travel',
        targetCity: 'songshan',
        reward: { exp: 500, contrib: 15, fame: 30 },
        rewardText: '经验+500 · 贡献+15 · 声望+30',
        next: 'sect_huashan_4',
        narrative: {
          accept: {
            scene: '华山·山门',
            bgChar: `
  ⚔  华  山  会  盟  ⚔
  ════════════════════
  「正道各派」
  「齐聚嵩山」`,
            lines: [
              '岳掌门将华山令旗交给你：',
              '「正道联盟英雄帖已至，各派齐聚嵩山少林，商讨对付血骨门之策。」',
              '「我华山派不能缺席。你作为我的代表，务必参加。」',
              '「记住——华山派的荣耀，在你身上！不可堕了我华山威名！」',
            ],
            tip: '前往嵩山少林，参加正道联盟会盟',
          },
        },
      },
      {
        id: 'sect_huashan_4',
        icon: '⚔',
        name: '华山论剑',
        desc: '会盟中，各派高手切磋武艺。华山派以剑闻名，你代表华山出战，与各派高手一较高下！这也是向江湖展示华山实力的机会！',
        type: 'kill',
        targetNpcId: 'huashan_duel_rival',
        targetName: '各派挑战者',
        targetCity: 'songshan',
        reward: { exp: 1000, contrib: 35, fame: 50, title: '华山论剑冠军' },
        rewardText: '经验+1000 · 贡献+35 · 声望+50 · 称号：华山论剑冠军',
        isFinal: true,
        narrative: {
          accept: {
            scene: '嵩山少林·会盟广场',
            bgChar: `
  ⚔  正  道  会  盟  ⚔
  ════════════════════
  「华山剑法」
  「天下第一！」`,
            lines: [
              '嵩山少林寺广场上，正道各派高手齐聚。',
              '「华山派——可有人敢与我派切磋？」',
              '各派高手跃跃欲试，你代表华山挺身而出！',
              '「华山剑法，从不让人失望！请！」',
            ],
            tip: '在各派高手的挑战中取胜，为华山派赢得荣誉',
          },
          complete: {
            scene: '嵩山少林·会盟广场',
            lines: [
              '你连败武当、峨眉、昆仑等派高手，「华山剑法」之名威震四方！',
              '岳掌门闻讯，大笑三声：「好！好！好！我华山派，后继有人！」',
              '玄慈方丈亲自上前：「华山高徒武艺超群，少林佩服。正道联盟有你，正道有望！」',
              '【华山·门派任务链完结】',
              '你被授予「华山论剑冠军」称号，成为年轻一代华山弟子的楷模！',
            ],
          },
        },
      },
    ],
  },

  // ── 峨眉派 · 慈悲伏魔 ──────────────────────────────
  emei: {
    name: '峨眉派',
    theme: '慈悲伏魔 · 金顶之约',
    chain: [
      {
        id: 'sect_emei_1',
        icon: '🌺',
        name: '五毒教异动',
        desc: '圆真师太得到情报：五毒教近日在峨眉附近活动频繁，似乎在暗中布局。作为峨眉弟子，你需调查五毒教的意图。',
        type: 'travel',
        targetCity: 'emei',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_emei_2',
        narrative: {
          accept: {
            scene: '峨眉山·金顶禅院',
            bgChar: `
  🌺  峨  眉  金  顶  🌺
  ════════════════════
  「五毒教」
  「图谋不轨」`,
            lines: [
              '圆真师太面色凝重：',
              '「近日探子回报，五毒教的人在峨眉山附近频繁出没，似在寻找什么。」',
              '「五毒教与我峨眉素无往来，此举必有深意。你下山查探一番。」',
              '「切记——峨眉以慈悲为怀，若对方无恶意，不可妄动干戈。」',
            ],
            tip: '调查五毒教在峨眉附近活动的目的',
          },
        },
      },
      {
        id: 'sect_emei_2',
        icon: '🐍',
        name: '五毒试探',
        desc: '你发现五毒教弟子正在峨眉后山采药，但这些药草似乎与炼制某种剧毒有关！你需要阻止他们，但也不能伤了和气……',
        type: 'kill',
        targetNpcId: 'wudu_shaman',
        targetName: '五毒教弟子',
        targetCity: 'emei',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_emei_3',
        narrative: {
          accept: {
            scene: '峨眉后山·密林',
            bgChar: `
  🌿  五  毒  密  林  🌿
  ════════════════════
  「此地药草」
  「归我五毒教了」`,
            lines: [
              '你发现五毒教弟子正在采摘一种罕见的毒草——「七步断肠」。',
              '这种毒草极为罕见，却是炼制剧毒「灭心散」的主药。',
              '「五毒教的朋友，这些药草乃峨眉山资源，请速离去。」',
              '五毒教弟子冷笑：「峨眉派管得也太宽了吧？这山又不是你们家的！」',
            ],
            tip: '击败五毒教弟子，阻止他们采集毒草',
          },
          complete: {
            scene: '峨眉后山·密林',
            lines: [
              '五毒教弟子被击败后，吐露实情：',
              '「是血骨门让我们来的！他们要用灭心散对付正道联盟，而五毒教只是……受人之托……」',
              '「血骨门承诺事成之后，给我们五毒教大量好处……」',
              '「我们也知道这不太光彩，但教主……教主也是被迫的……」',
              '你将消息带回峨眉，圆真师太大惊：「血骨门竟有如此阴谋！必须尽快告知正道联盟！」',
            ],
          },
        },
      },
      {
        id: 'sect_emei_3',
        icon: '💀',
        name: '解毒之约',
        desc: '血骨门若用灭心散对付正道，后果不堪设想！你必须找到解药配方，或破坏血骨门的炼毒计划！',
        type: 'dungeon',
        targetDungeon: 'dungeon_xuegu_poison_lab',
        reward: { exp: 800, contrib: 25, item: 'antidote_formula' },
        rewardText: '经验+800 · 贡献+25 · 获得灭心散解药配方',
        next: 'sect_emei_4',
        narrative: {
          accept: {
            scene: '峨眉山·金顶禅院',
            bgChar: `
  🌺  灭  心  散  危  机  🌺
  ════════════════════
  「必须阻止」
  「血骨门的阴谋」`,
            lines: [
              '圆真师太召集峨眉高层紧急商议：',
              '「灭心散乃剧毒，中者三日内必亡。若血骨门将此毒用于各派掌门……」',
              '「后果不堪设想！必须找到解药，或破坏他们的炼毒计划！」',
              '「情报显示，血骨门在幽州有一处秘密炼毒之所。峨眉弟子，此事就交给你了！」',
            ],
            tip: '潜入血骨门秘密炼毒所，摧毁灭心散并夺回解药配方',
          },
          complete: {
            scene: '幽州·血骨门炼毒所废墟',
            lines: [
              '你潜入血骨门炼毒所，摧毁了大量灭心散原料和成品！',
              '更幸运的是，你在一份密函中发现了完整的解药配方——「清心露」！',
              '「太好了！有了这配方，正道各派就有救了！」',
              '你带着配方返回峨眉，解药很快被大量炼制出来，分发给各派掌门。',
            ],
          },
        },
      },
      {
        id: 'sect_emei_4',
        icon: '🌺',
        name: '峨眉誓言',
        desc: '血骨门的阴谋被粉碎，但三魔联盟的威胁依然存在。圆真师太命你代表峨眉，与各派联合，共同对抗三魔联盟！',
        type: 'talk',
        targetNpc: 'emei_elder',
        reward: { exp: 600, contrib: 20, fame: 40, title: '峨眉护法' },
        rewardText: '经验+600 · 贡献+20 · 声望+40 · 称号：峨眉护法',
        isFinal: true,
        narrative: {
          accept: {
            scene: '峨眉山·金顶',
            bgChar: `
  🌺  峨  眉  金  顶  🌺
  ════════════════════
  「我峨眉弟子」
  「当护佑苍生」`,
            lines: [
              '圆真师太在金顶之上，为你举行授法仪式：',
              '「你粉碎血骨门阴谋，保全正道各派，立下大功。」',
              "「今日，老尼封你为「峨眉护法」，望你继续守护峨眉，护佑苍生。」",
              '「三魔联盟虽强，但邪不胜正。只要各派团结一心，必能还江湖太平！」',
            ],
            complete: {
              scene: '峨眉山·金顶',
              lines: [
                '【峨眉·门派任务链完结】',
                '你正式成为峨眉护法，峨眉剑法在你手中焕发出新的光彩！',
                '各派掌门联名致谢，峨眉派在江湖上的声望大增。',
                '而你，也成为正道联盟中备受尊敬的新星！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 昆仑派 · 西域守护 ──────────────────────────────
  kunlun: {
    name: '昆仑派',
    theme: '西域守护 · 三圣之托',
    chain: [
      {
        id: 'sect_kunlun_1',
        icon: '🏔',
        name: '三圣托付',
        desc: '昆仑三圣之首白崖子私下召见你——昆仑山深处藏有玄铁令碎片，近日有神秘人试图潜入。你需加强昆仑山戒备。',
        type: 'talk',
        targetNpc: 'kunlun_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_kunlun_2',
        narrative: {
          accept: {
            scene: '昆仑山·三圣殿',
            bgChar: `
  🏔  昆  仑  三  圣  殿  🏔
  ════════════════════
  「此事关乎」
  「天下苍生」`,
            lines: [
              '白崖子将你引入密室：',
              '「昆仑山传承千年，有一秘密从未外传——玄铁令第二块碎片，就藏在我昆仑秘境之中。」',
              '「近日，我感应到有强敌试图潜入昆仑。那些人……恐怕来自血骨门。」',
              '「你是昆仑弟子，此事便交给你。守护好这个秘密，就是守护天下苍生！」',
            ],
            tip: '接受三圣的托付，守护昆仑秘境',
          },
        },
      },
      {
        id: 'sect_kunlun_2',
        icon: '❄',
        name: '昆仑之战',
        desc: '血骨门的人果然来了！他们派出了血骨门坛主，试图夺取玄铁令碎片！你必须将其击退！',
        type: 'kill',
        targetNpcId: 'blood_bone_altar_master',
        targetName: '血骨门坛主',
        targetCity: 'kunlun',
        reward: { exp: 800, contrib: 25 },
        rewardText: '经验+800 · 贡献+25',
        next: 'sect_kunlun_3',
        narrative: {
          accept: {
            scene: '昆仑山·秘境入口',
            bgChar: `
  ❄  血  骨  入  侵  ❄
  ════════════════════
  「玄铁令」
  「必须得到！」`,
            lines: [
              '血骨门坛主率数十名血骨门弟子出现在秘境入口！',
              '「昆仑派，今日就是你们的末日！交出玄铁令，饶你们不死！」',
              '白崖子冷静下令：「昆仑弟子，布阵迎敌！」',
              '你身先士卒，直取血骨门坛主！',
            ],
            tip: '击败血骨门坛主，击退血骨门入侵',
          },
          complete: {
            scene: '昆仑山·秘境入口',
            lines: [
              '血骨门坛主被你击败，血骨门弟子溃逃！',
              '「好！昆仑有你这样的弟子，何惧血骨门！」白崖子欣慰道。',
              '「但这仅仅是开始……血骨门的真正目的，绝不止一块玄铁令碎片。」',
              '「我决定，将玄铁令碎片交给你护送——你一定要把它安全送到正道联盟手中！」',
            ],
          },
        },
      },
      {
        id: 'sect_kunlun_3',
        icon: '⚔',
        name: '护送玄铁',
        desc: '你需将玄铁令碎片护送至中原，交给正道联盟。但血骨门绝不会善罢甘休，他们会派出更强的追兵……',
        type: 'travel',
        targetCity: 'songshan',
        reward: { exp: 600, contrib: 20, fame: 35 },
        rewardText: '经验+600 · 贡献+20 · 声望+35',
        next: 'sect_kunlun_4',
        narrative: {
          accept: {
            scene: '昆仑山·山脚',
            bgChar: `
  🏔  护  送  之  路  🏔
  ════════════════════
  「一路小心」
  「切勿落入敌手」`,
            lines: [
              '你带着玄铁令碎片踏上归途。',
              '白崖子叮嘱：「沿途必有血骨门追兵。务必小心谨慎。」',
              '果然，三日后，你在沙漠中遭遇了血骨门副门主亲自带领的追兵！',
              '「玄铁令……留下！」',
            ],
            tip: '突破血骨门追兵，安全抵达嵩山',
          },
        },
      },
      {
        id: 'sect_kunlun_4',
        icon: '☸',
        name: '少林会盟',
        desc: '你成功将玄铁令碎片护送至嵩山少林，参加正道联盟会盟。各派高手齐聚，商讨最终决战之策！',
        type: 'talk',
        targetNpc: 'shaolin_abbot',
        reward: { exp: 1000, contrib: 40, fame: 50, title: '昆仑使者' },
        rewardText: '经验+1000 · 贡献+40 · 声望+50 · 称号：昆仑使者',
        isFinal: true,
        narrative: {
          accept: {
            scene: '嵩山少林·会盟大殿',
            bgChar: `
  ☸  正  道  会  盟  ☸
  ════════════════════
  「昆仑使者」
  「使命必达！」`,
            lines: [
              '你将玄铁令碎片交到玄慈方丈手中：',
              '「正道联盟，昆仑派使者带到！玄铁令碎片，安全送达！」',
              '各派掌门纷纷起身致敬：「昆仑使者辛苦了！」',
              '玄慈方丈点头：「如今两块碎片在手，加上少林的线索……最终的决战，即将来临！」',
            ],
            complete: {
              scene: '嵩山少林·会盟大殿',
              lines: [
                '【昆仑·门派任务链完结】',
                '你被授予「昆仑使者」称号，成为昆仑派与中原正道联盟的桥梁！',
                '各派掌门商议决定：联合攻伐血骨门，一举铲除三魔联盟！',
                '而你，作为昆仑使者，将参与这场决定江湖命运的大战！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 崆峒派 · 七伤伏魔 ──────────────────────────────
  kongtong: {
    name: '崆峒派',
    theme: '七伤伏魔 · 西北风云',
    chain: [
      {
        id: 'sect_kongtong_1',
        icon: '🌪',
        name: '西北异动',
        desc: '问道子掌门得到消息：日月神教在西北地区大规模活动，似在配合血骨门的阴谋。崆峒派地处西北，责无旁贷！',
        type: 'travel',
        targetCity: 'kongtong',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_kongtong_2',
        narrative: {
          accept: {
            scene: '崆峒山·问道宫',
            bgChar: `
  🌪  崆  峒  问  道  宫  🌪
  ════════════════════
  「西北告急」
  「崆峒必当响应」`,
            lines: [
              '问道子掌门面色凝重：',
              '「据线报，日月神教在灵州大规模集结，与血骨门遥相呼应。」',
              '「若让他们联手成功，整个西北都将陷入混乱！」',
              '「你是崆峒弟子，此事便交给你。查明真相，必要时——杀无赦！」',
            ],
            tip: '前往灵州，调查日月神教的动向',
          },
        },
      },
      {
        id: 'sect_kongtong_2',
        icon: '☀',
        name: '日月阴谋',
        desc: '你发现日月神教在灵州秘密建造了一座基地，似乎在炼制某种邪功。你需潜入其中，探明真相！',
        type: 'dungeon',
        targetDungeon: 'dungeon_riyue_lingzhou',
        reward: { exp: 700, contrib: 20 },
        rewardText: '经验+700 · 贡献+20',
        next: 'sect_kongtong_3',
        narrative: {
          accept: {
            scene: '灵州郊外·日月神教基地',
            bgChar: `
  ☀  日  月  神  教  基  地  ☀
  ════════════════════
  「禁止入内」
  「擅闯者死！」`,
            lines: [
              '你潜入日月神教基地，发现他们正在炼制一种邪功——「吸星大法」！',
              '「血骨门的血炼大法加上日月的吸星大法……若让他们成功……」',
              '「后果不堪设想！必须摧毁这个基地！」',
            ],
            tip: '潜入日月神教基地，摧毁邪功炼制设施',
          },
          complete: {
            scene: '灵州·日月基地废墟',
            lines: [
              '你摧毁了日月神教的邪功炼制设施，大量修炼材料付之一炬！',
              '更获得一份重要情报——血骨门与日月神教约定在幽州会师，'
              +'共同进攻中原！',
              '「这情报太重要了！必须立刻带回崆峒！」',
            ],
          },
        },
      },
      {
        id: 'sect_kongtong_3',
        icon: '🌪',
        name: '七伤之威',
        desc: '情报已送出，但日月神教追兵已到！你需以崆峒绝学「七伤拳」击败追兵，安全返回崆峒山！',
        type: 'kill',
        targetNpcId: 'riyue_elite',
        targetName: '日月神教精英',
        targetCity: 'hanzhong',
        reward: { exp: 600, contrib: 18 },
        rewardText: '经验+600 · 贡献+18',
        next: 'sect_kongtong_4',
        narrative: {
          accept: {
            scene: '灵州官道',
            bgChar: `
  ☀  日  月  追  兵  ☀
  ════════════════════
  「抓住他！」
  「情报不能泄露！」`,
            lines: [
              '你带着情报逃离日月基地，却被日月神教高手追上！',
              '「崆峒派的小子！今日你走不了！」',
              '你运起七伤拳，迎击来敌！',
            ],
            tip: '击败日月神教追兵，安全返回崆峒山',
          },
          complete: {
            scene: '崆峒山·问道宫',
            lines: [
              '你击退日月追兵，带着情报回到崆峒山。',
              '问道子掌门看完情报，拍案而起：',
              '「好！崆峒弟子果然不凡！这情报关系重大，必须立刻通知正道联盟！」',
              '「各派已决定联合攻伐血骨门，崆峒派也不能落后！」',
            ],
          },
        },
      },
      {
        id: 'sect_kongtong_4',
        icon: '⚔',
        name: '西北决战',
        desc: '正道联盟决定先发制人，在西北阻击日月神教与血骨门的会师。作为崆峒弟子，你参与这场关键的西北大战！',
        type: 'kill',
        targetNpcId: 'riyue_vice_leader',
        targetName: '日月神教副教主',
        targetCity: 'hanzhong',
        reward: { exp: 1200, contrib: 45, fame: 45, title: '崆峒战神' },
        rewardText: '经验+1200 · 贡献+45 · 声望+45 · 称号：崆峒战神',
        isFinal: true,
        narrative: {
          accept: {
            scene: '西北·黄河渡口',
            bgChar: `
  🌪  西  北  大  战  🌪
  ════════════════════
  「七伤出鞘」
  「天下无敌！」`,
            lines: [
              '黄河渡口，正邪两军对峙！',
              '日月神教副教主亲自率军，与血骨门遥相呼应。',
              '「崆峒派的七伤拳，今日就让你们见识见识真正的威力！」',
              '问道子掌门一声令下：「杀！」',
            ],
            complete: {
              scene: '西北·黄河渡口战场',
              lines: [
                '你以七伤拳连败日月神教数名高手，最终与日月副教主对决！',
                '一番激战后，日月副教主重伤败逃！',
                '【崆峒·门派任务链完结】',
                '崆峒七伤拳威震西北，你被授予「崆峒战神」称号！',
                '此战大捷，血骨门与日月神教的会师计划彻底失败！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 天山派 · 冰封绝学 ──────────────────────────────
  tianshan: {
    name: '天山派',
    theme: '冰封绝学 · 逍遥往事',
    chain: [
      {
        id: 'sect_tianshan_1',
        icon: '❄',
        name: '天山童姥',
        desc: '天山童姥神秘召见你——原来你与她早逝的弟子有几分相似。她决定传授你天山派不传之秘「天山六阳掌」，但要先通过考验。',
        type: 'talk',
        targetNpc: 'xiaoyao_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_tianshan_2',
        narrative: {
          accept: {
            scene: '天山·缥缈峰',
            bgChar: `
  ❄  天  山  缥  缈  峰  ❄
  ════════════════════
  「你的眼神」
  「让我想起一个故人」`,
            lines: [
              '天山童姥端坐缥缈峰上，见你到来，缓缓开口：',
              '「你长得像我那早年夭折的弟子……罢了，这也是缘分。」',
              '「天山六阳掌乃我派不传之秘，今日我破例传你。」',
              '「但——你必须先证明你的心性。天山武学以心驭冰，心性不纯者修炼，必遭反噬。」',
            ],
            tip: '接受天山童姥的考验',
          },
        },
      },
      {
        id: 'sect_tianshan_2',
        icon: '🏔',
        name: '冰心试炼',
        desc: '天山童姥命你前往天山禁地，取回一株千年雪莲——这是修炼天山六阳掌的必要药引。但禁地中有远古冰魔兽守护……',
        type: 'kill',
        targetNpcId: 'tianshan_ice_beast',
        targetName: '远古冰魔兽',
        targetCity: 'tianshan',
        reward: { exp: 600, contrib: 18, skill: 'tianshan_ice_palm' },
        rewardText: '经验+600 · 贡献+18 · 习得天山冰心掌',
        next: 'sect_tianshan_3',
        narrative: {
          accept: {
            scene: '天山·禁地入口',
            bgChar: `
  ❄  天  山  禁  地  ❄
  ════════════════════
  「千年雪莲」
  「在禁地深处」`,
            lines: [
              '你踏入天山禁地，寒气逼人。',
              '深处传来一声震天咆哮——远古冰魔兽现身！',
              '「何人擅闯禁地！」',
            ],
            tip: '击败远古冰魔兽，取得千年雪莲',
          },
          complete: {
            scene: '天山·缥缈峰',
            lines: [
              '你击败冰魔兽，取得千年雪莲，返回缥缈峰。',
              '天山童姥点头：「好……你的心性，确实适合修炼天山武学。」',
              '「今日起，你便是我天山派的传人。天山六阳掌秘笈，交予你了！」',
            ],
          },
        },
      },
      {
        id: 'sect_tianshan_3',
        icon: '🔥',
        name: '血骨来袭',
        desc: '血骨门的人追踪到天山，试图夺取天山武学秘籍！你需保护天山派，同时追查血骨门的真正目的。',
        type: 'kill',
        targetNpcId: 'blood_bone_soldier',
        targetName: '血骨门精锐',
        targetCity: 'tianshan',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_tianshan_4',
        narrative: {
          accept: {
            scene: '天山·山门',
            bgChar: `
  ❄  血  骨  犯  天  山  ❄
  ════════════════════
  「天山秘籍」
  「必须得到！」`,
            lines: [
              '血骨门精锐突袭天山派！',
              '「天山武学，血骨门要了！」',
              '天山童姥冷喝：「天山弟子，御敌！」',
            ],
            tip: '击退血骨门入侵者',
          },
          complete: {
            scene: '天山·山门',
            lines: [
              '血骨门精锐被击退，但你从俘虏口中得知：',
              '「血骨门门主……在寻找一种能克制血炼大法反噬的功法……」',
              '「天山武学……正是他需要的……」',
              '天山童姥冷笑：「原来如此……骨冥子，你的野心，终究会害了你自己！」',
            ],
          },
        },
      },
      {
        id: 'sect_tianshan_4',
        icon: '❄',
        name: '天山之约',
        desc: '天山童姥决定将完整的逍遥派秘传交给你，并让你带话给逍遥派——天山愿与正道联盟共进退！',
        type: 'talk',
        targetNpc: 'tianshan_elder',
        reward: { exp: 800, contrib: 30, skill: 'xiaoyao_trinity', title: '逍遥传人' },
        rewardText: '经验+800 · 贡献+30 · 习得天山六阳掌 · 称号：天山传人',
        isFinal: true,
        narrative: {
          accept: {
            scene: '天山·缥缈峰',
            bgChar: `
  ❄  天  山  六  阳  掌  ❄
  ════════════════════
  「天山绝学」
  「今日传你」`,
            lines: [
              '天山童姥将天山六阳掌完整秘笈交到你手中：',
              '「你已得我天山真传，日后行走江湖，当以侠义为先。」',
              '「另外……替我给逍遥派带个话：天山愿与正道联盟共进退，血骨门之乱，我们不会袖手旁观！」',
            ],
            complete: {
              scene: '天山·缥缈峰',
              lines: [
                '【天山·门派任务链完结】',
                '你正式成为天山传人，习得天山六阳掌！',
                '天山派加入正道联盟，江湖格局再次改变！',
                '三魔联盟的末日，终于要来了……',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 南宫世家 · 剑礼天下 ─────────────────────────────
  nangong: {
    name: '南宫世家',
    theme: '剑礼天下 · 世家荣光',
    chain: [
      {
        id: 'sect_nangong_1',
        icon: '🏛',
        name: '世家危机',
        desc: '南宫家主秘密召见——南宫世家收到血骨门的威胁信：要么归附，要么灭门。南宫世家传承三百年，岂能屈从邪道？你需找出对策。',
        type: 'talk',
        targetNpc: 'nangong_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_nangong_2',
        narrative: {
          accept: {
            scene: '南宫世家·家主书房',
            bgChar: `
  🏛  南  宫  世  家  🏛
  ════════════════════
  「血骨门」
  「欺人太甚！」`,
            lines: [
              '南宫家主将一封血书拍在桌上：',
              '「血骨门威胁我南宫，要么归附，要么灭门！」',
              '「南宫世家传承三百年，忠义传家，岂能屈从邪道！」',
              '「你是南宫弟子，此事关乎世家存亡，你可有良策？」',
            ],
            tip: '接受家主询问，商讨对策',
          },
        },
      },
      {
        id: 'sect_nangong_2',
        icon: '⚔',
        name: '世家长老',
        desc: '南宫世家决定联合其他正道门派共同抗敌。你需前往各大门派，联络盟友，同时调查血骨门为何盯上南宫世家。',
        type: 'travel',
        targetCity: 'luoyang',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_nangong_3',
        narrative: {
          accept: {
            scene: '南宫世家·议事厅',
            bgChar: `
  🏛  联  合  正  道  🏛
  ════════════════════
  「各派联合」
  「共抗血骨」`,
            lines: [
              '南宫家主决定联络各派：',
              '「血骨门觊觎我南宫，必有图谋。我猜测——他们可能是冲着南宫剑典而来。」',
              '「你先联络少林、武当、华山等正道大派。同时，查明血骨门的真正目的。」',
            ],
            tip: '联络正道各派，商议联合抗敌',
          },
          complete: {
            scene: '洛阳城外',
            lines: [
              '你联络各派归来，得知重要情报——',
              '血骨门不仅盯上南宫世家，还在秘密收集各派武学秘籍！',
              '「南宫剑典、武当太极拳、峨眉剑法……他们想要一网打尽！」',
              '「这是整个正道武林的危机！」',
            ],
          },
        },
      },
      {
        id: 'sect_nangong_3',
        icon: '💀',
        name: '血骨阴谋',
        desc: '你截获了血骨门的密报——原来血骨门主骨冥子正在修炼一种禁忌功法「血神经」，需要收集天下武学秘籍作为辅助！你必须阻止他！',
        type: 'dungeon',
        targetDungeon: 'dungeon_xuegu_forbidden',
        reward: { exp: 800, contrib: 25 },
        rewardText: '经验+800 · 贡献+25',
        next: 'sect_nangong_4',
        narrative: {
          accept: {
            scene: '南宫世家·密室',
            bgChar: `
  🏛  血  神  经  野  心  🏛
  ════════════════════
  「血神经」
  「禁忌之功」`,
            lines: [
              '南宫家主看完成密报，面色大变：',
              '「血神经！传说中的禁忌功法！修炼者需要吸收大量武学精华！」',
              '「难怪血骨门到处收集秘籍……他们是想集天下武学于一体，炼成血神经！」',
              '「若让他们成功，后果不堪设想！必须阻止！」',
            ],
            tip: '潜入血骨门禁地，阻止血神经的修炼',
          },
          complete: {
            scene: '血骨门禁地·废墟',
            lines: [
              '你潜入血骨门禁地，摧毁了大量秘籍收藏！',
              '但更令人震惊的是——血神经的修炼已经开始！',
              '「血神经第一层已成……正道武林，末日将至！」',
              '「必须尽快通知各派，最终决战迫在眉睫！」',
            ],
          },
        },
      },
      {
        id: 'sect_nangong_4',
        icon: '🏛',
        name: '世家荣耀',
        desc: '南宫家主决定联合各派，对血骨门发起最终决战！作为南宫世家最优秀的弟子，你将代表南宫，参与这场决定江湖命运的大战！',
        type: 'kill',
        targetNpcId: 'xuegu_blood_god',
        targetName: '血神经修炼者',
        targetCity: 'youzhou',
        reward: { exp: 1500, contrib: 50, fame: 50, title: '南宫剑圣' },
        rewardText: '经验+1500 · 贡献+50 · 声望+50 · 称号：南宫剑圣',
        isFinal: true,
        narrative: {
          accept: {
            scene: '南宫世家·誓师大会',
            bgChar: `
  🏛  南  宫  誓  师  🏛
  ════════════════════
  「世家荣光」
  「不容玷污！」`,
            lines: [
              '南宫世家大门敞开，各派高手齐聚。',
              '「血骨门为祸江湖，今日我南宫世家与各派同道，共同讨伐！」',
              '「南宫弟子，随我杀敌！」',
            ],
            complete: {
              scene: '血骨门·最终战场',
              lines: [
                '最终决战！你以南宫剑典对决血神经修炼者！',
                '南宫剑典的浩然正气，克制了血神经的邪气！',
                '血神经修炼者被击败，血骨门覆灭！',
                '【南宫世家·门派任务链完结】',
                '你被授予「南宫剑圣」称号，南宫世家荣光永照！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 圣光教 · 圣光裁决 ──────────────────────────────
  shengguang: {
    name: '圣光教',
    theme: '圣光裁决 · 净化邪恶',
    chain: [
      {
        id: 'sect_shengguang_1',
        icon: '✦',
        name: '圣光启示',
        desc: '圣光大祭司得到神谕：血骨门门主骨冥子将在月圆之夜进行血神经的最终修炼。圣光教必须阻止！',
        type: 'talk',
        targetNpc: 'shengguang_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_shengguang_2',
        narrative: {
          accept: {
            scene: '圣光教·神殿',
            bgChar: `
  ✦  圣  光  神  殿  ✦
  ════════════════════
  「神谕降临」
  「血骨将亡」`,
            lines: [
              '圣光大祭司沐浴在圣光中，缓缓开口：',
              '「圣光启示我——血骨门门主骨冥子，将在月圆之夜进行血神经的最终修炼。」',
              '「一旦血神经大成，他将无敌于天下！」',
              '「圣光信徒，这是净化邪恶的时刻！」',
            ],
            tip: '接受圣光启示，准备讨伐血骨门',
          },
        },
      },
      {
        id: 'sect_shengguang_2',
        icon: '💀',
        name: '净化仪式',
        desc: '在最终决战前，你需要收集三件圣物：圣光剑、净化符、光明之泪，用于克制血神经的邪气。',
        type: 'collect',
        targetItem: 'holy_trinity',
        reward: { exp: 600, contrib: 20 },
        rewardText: '经验+600 · 贡献+20',
        next: 'sect_shengguang_3',
        narrative: {
          accept: {
            scene: '圣光教·藏宝室',
            bgChar: `
  ✦  圣  光  三  圣  物  ✦
  ════════════════════
  「剑 · 符 · 泪」
  「净化一切邪恶」`,
            lines: [
              '大祭司交给你三件圣物拓本：',
              '「圣光剑在昆仑山巅，需攀登绝壁方能取得。」',
              '「净化符在峨眉金顶，守护者是千年圣僧。」',
              '「光明之泪在圣湖深处，由湖灵守护。」',
            ],
            tip: '收集三件圣物，用于克制血神经',
          },
          complete: {
            scene: '圣光教·神殿',
            lines: [
              '你成功收集三件圣物！',
              '圣光剑寒光凛冽，净化符符文流转，光明之泪晶莹剔透。',
              '「有了这三件圣物，血神经的邪气必将被净化！」',
              '「准备最终的圣战吧！」',
            ],
          },
        },
      },
      {
        id: 'sect_shengguang_3',
        icon: '⚔',
        name: '圣光讨伐',
        desc: '月圆之夜，你随圣光十字军讨伐血骨门！血骨门副门主率精锐迎战，这是正邪之间的终极对决！',
        type: 'kill',
        targetNpcId: 'blood_bone_vice_master',
        targetName: '血骨门副门主',
        targetCity: 'youzhou',
        reward: { exp: 1000, contrib: 35, fame: 40 },
        rewardText: '经验+1000 · 贡献+35 · 声望+40',
        next: 'sect_shengguang_4',
        narrative: {
          accept: {
            scene: '血骨门·圣光十字军',
            bgChar: `
  ✦  圣  光  讨  伐  ✦
  ════════════════════
  「圣光所照」
  「邪恶必亡！」`,
            lines: [
              '月圆之夜，圣光十字军抵达血骨门！',
              '血骨门副门主率精锐迎战：',
              '「区区圣光教，也敢来送死！」',
              '你举起圣光剑：「以圣光之名——净化！」',
            ],
            tip: '击败血骨门副门主，攻入血骨门核心',
          },
          complete: {
            scene: '血骨门·圣殿',
            lines: [
              '血骨门副门主被圣光剑斩杀！',
              '圣光十字军攻入血骨门核心——',
              '但骨冥子的血神经修炼已到最后阶段！',
              '「来不及了……他就要成功了！」',
            ],
          },
        },
      },
      {
        id: 'sect_shengguang_4',
        icon: '✦',
        name: '圣光裁决',
        desc: '血神经即将大成！你必须用三件圣物施展圣光终极奥义「圣光裁决」，在血神经大成之前将其击败！',
        type: 'kill',
        targetNpcId: 'npc_gumingzi',
        targetName: '骨冥子',
        targetCity: 'youzhou',
        reward: { exp: 2000, contrib: 60, fame: 60, title: '圣光裁决者' },
        rewardText: '经验+2000 · 贡献+60 · 声望+60 · 称号：圣光裁决者',
        isFinal: true,
        narrative: {
          accept: {
            scene: '血骨门·血池',
            bgChar: `
  ✦  圣  光  裁  决  ✦
  ════════════════════
  「血神经」
  「最终决战」`,
            lines: [
              '骨冥子悬浮在血池之上，血神经真气弥漫！',
              '「晚了！你们来晚了！血神经即将大成——」',
              '你举起三件圣物：「圣光在上，以我为器——圣光裁决！」',
            ],
            complete: {
              scene: '血骨门·废墟',
              lines: [
                '圣光裁决贯穿血池，净化了一切邪恶！',
                '骨冥子在圣光中化为灰烬，血神经彻底消亡！',
                '【圣光教·门派任务链完结】',
                '你被授予「圣光裁决者」称号，圣光普照，血骨门覆灭！',
                '江湖，终于迎来久违的太平……',
              ],
            },
          },
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 【中立门派】
  // ══════════════════════════════════════════════════════

  // ── 唐门 · 暗器之殇 ──────────────────────────────
  tangmen: {
    name: '唐门',
    theme: '暗器之殇 · 情报博弈',
    chain: [
      {
        id: 'sect_tangmen_1',
        icon: '🏹',
        name: '唐门危机',
        desc: '唐门收到血骨门的招揽信——要么为血骨门效命，要么被灭门。唐门从不屈服于任何势力，但也不能轻易树敌。你需要找出第三条路。',
        type: 'talk',
        targetNpc: 'tangmen_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_tangmen_2',
        narrative: {
          accept: {
            scene: '唐门·总堂',
            bgChar: `
  🏹  唐  门  总  堂  🏹
  ════════════════════
  「血骨门」
  「欺我唐门无人？」`,
            lines: [
              '唐烈风将血骨门的威胁信撕成碎片：',
              '「唐门立世三百年，从不屈服于任何势力！」',
              '「但血骨门势大，硬拼非上策。唐门弟子，你有何良策？」',
            ],
            tip: '接受唐门的考验，寻找第三条路',
          },
        },
      },
      {
        id: 'sect_tangmen_2',
        icon: '📜',
        name: '情报交易',
        desc: '唐门决定利用自己的情报网络，在正邪两方之间周旋，获取最大利益。你需要潜入血骨门据点，获取他们的行动计划。',
        type: 'dungeon',
        targetDungeon: 'dungeon_xuegu_ Intel',
        reward: { exp: 600, contrib: 18 },
        rewardText: '经验+600 · 贡献+18',
        next: 'sect_tangmen_3',
        narrative: {
          accept: {
            scene: '唐门·情报室',
            bgChar: `
  🏹  唐  门  情  报  网  🏹
  ════════════════════
  「情报就是」
  「最锋利的暗器」`,
            lines: [
              '唐门情报负责人递给你一份血骨门据点图纸：',
              '「血骨门在幽州有一处秘密据点，存放着他们的行动计划。」',
              '「你的任务是潜入其中，获取情报。但切记——不可打草惊蛇。」',
            ],
            tip: '潜入血骨门据点，获取关键情报',
          },
          complete: {
            scene: '唐门·情报室',
            lines: [
              '你成功获取血骨门的情报——',
              '血骨门计划在半月后对正道联盟发动总攻！',
              '「太好了！这份情报价值连城……我们可以卖给正道，赚一大笔！」',
              '「或者……卖给血骨门，换取他们的信任……」',
            ],
          },
        },
      },
      {
        id: 'sect_tangmen_3',
        icon: '⚖',
        name: '两边下注',
        desc: '唐门决定同时向正邪两方出售情报，获取最大利益。你需要分别与正道联盟和血骨门进行交易谈判。',
        type: 'talk',
        targetNpc: 'shaolin_abbot',
        reward: { exp: 500, contrib: 15, silver: 500 },
        rewardText: '经验+500 · 贡献+15 · 银两+500',
        next: 'sect_tangmen_4',
        narrative: {
          accept: {
            scene: '嵩山少林',
            bgChar: `
  ☸  正  道  谈  判  ☸
  ════════════════════
  「情报价值」
  「千金难买」`,
            lines: [
              '你以唐门特使身份拜见玄慈方丈：',
              '「唐门愿向正道联盟提供血骨门情报，条件是——支付丰厚报酬。」',
              '「同时，唐门将保守中立，不会向血骨门透露正道情报。」',
            ],
            tip: '与正道联盟达成情报交易协议',
          },
          complete: {
            scene: '唐门·总堂',
            lines: [
              '正道联盟支付了大笔银两，获取了血骨门的情报。',
              '同时，你也与血骨门进行了交易，换取了血骨门的信任和一些好处。',
              '「干得好！唐门在正邪之间游刃有余，这才是生存之道！」',
            ],
          },
        },
      },
      {
        id: 'sect_tangmen_4',
        icon: '🏹',
        name: '唐门之道',
        desc: '唐门决定在大战结束后继续保持中立，并在新的江湖格局中占据有利位置。你需代表唐门，与各方势力斡旋。',
        type: 'talk',
        targetNpc: 'tangmen_elder',
        reward: { exp: 700, contrib: 25, fame: 20, title: '唐门智者' },
        rewardText: '经验+700 · 贡献+25 · 声望+20 · 称号：唐门智者',
        isFinal: true,
        narrative: {
          accept: {
            scene: '唐门·总堂',
            bgChar: `
  🏹  唐  门  之  道  🏹
  ════════════════════
  「明哲保身」
  「才是上策」`,
            lines: [
              '唐烈风满意地点头：',
              '「你做得很好。唐门的生存之道，就是永远站在胜利者一边。」',
              '「大战将至，无论谁胜谁负，唐门都会屹立不倒。」',
              '「去吧，在新的江湖格局中，为唐门争取最大利益！」',
            ],
            complete: {
              scene: '唐门·总堂',
              lines: [
                '【唐门·门派任务链完结】',
                '你被授予「唐门智者」称号，成为唐门新一代的智囊！',
                '无论正道联盟与三魔联盟谁胜谁负，唐门都能在新的江湖中占据一席之地。',
                '这就是唐门之道——暗器伤人，智谋取胜！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 逍遥派 · 逍遥物外 ──────────────────────────────
  xiaoyao: {
    name: '逍遥派',
    theme: '逍遥物外 · 天山归宗',
    chain: [
      {
        id: 'sect_xiaoyao_1',
        icon: '🌀',
        name: '逍遥秘事',
        desc: '无忧子私下召见——逍遥派三老各守一方秘法，但近年来联系渐少。三老不合，恐怕会被人利用……',
        type: 'talk',
        targetNpc: 'xiaoyao_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_xiaoyao_2',
        narrative: {
          accept: {
            scene: '逍遥派·逍遥洞',
            bgChar: `
  🌀  逍  遥  洞  🌀
  ════════════════════
  「逍遥三老」
  「三分天下」`,
            lines: [
              '无忧子轻叹一声：',
              '「逍遥派有三位长老，各守一脉秘法——北冥、凌波、小无相。」',
              '「但三老数十年未曾相聚，彼此有些嫌隙……」',
              '「若被有心人挑拨，逍遥派危矣。你是逍遥弟子，此事便交给你。」',
            ],
            tip: '接受任务，调解逍遥三老的矛盾',
          },
        },
      },
      {
        id: 'sect_xiaoyao_2',
        icon: '❄',
        name: '天山之行',
        desc: '逍遥派三老之一「天山童姥」隐居天山，与逍遥派早已断了联系。你需前往天山，请童姥重归逍遥派。',
        type: 'travel',
        targetCity: 'tianshan',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_xiaoyao_3',
        narrative: {
          accept: {
            scene: '通往天山的路上',
            bgChar: `
  🌀  天  山  之  路  🌀
  ════════════════════
  「天山童姥」
  「隐居多年」`,
            lines: [
              '你踏上前往天山的道路。',
              '沿途听闻，天山童姥性情古怪，数十年不曾见客。',
              '但逍遥派三老同气连枝，童姥定会念及旧情……',
            ],
            tip: '前往天山，请天山童姥回归逍遥派',
          },
          complete: {
            scene: '天山·缥缈峰',
            lines: [
              '天山童姥见到你，果然有些动容：',
              '「逍遥派……无忧子那老家伙还活着？」',
              '「罢了，念在旧情，我可以与逍遥派重修旧好。」',
              '「但——你必须先帮我解决一个问题。」',
            ],
          },
        },
      },
      {
        id: 'sect_xiaoyao_3',
        icon: '💀',
        name: '血骨觊觎',
        desc: '天山童姥告诉你：血骨门早已盯上天山武学，数次派人潜入。你需要击退这些入侵者，证明自己的实力。',
        type: 'kill',
        targetNpcId: 'blood_bone_elite',
        targetName: '血骨门精锐',
        targetCity: 'tianshan',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_xiaoyao_4',
        narrative: {
          accept: {
            scene: '天山·缥缈峰',
            bgChar: `
  ❄  血  骨  犯  天  山  ❄
  ════════════════════
  「天山武学」
  「不能落入外人之手」`,
            lines: [
              '天山童姥话音刚落，山下传来厮杀声——',
              '「报！血骨门的人又来了！」',
              '童姥冷笑：「来得正好！让我看看你的实力！」',
            ],
            tip: '击败血骨门入侵者',
          },
          complete: {
            scene: '天山·缥缈峰',
            lines: [
              '你以天山武学击退血骨门入侵者！',
              '天山童姥满意地点头：',
              '「不错……你的心性、武功，都已得到我的认可。」',
              '「去吧，告诉无忧子——逍遥三老，我会回去的。」',
            ],
          },
        },
      },
      {
        id: 'sect_xiaoyao_4',
        icon: '🌀',
        name: '三老归一',
        desc: '天山童姥决定回归逍遥派，与无忧子等人重新合一。三脉秘法合为一体，逍遥派将迎来中兴！',
        type: 'talk',
        targetNpc: 'xiaoyao_elder',
        reward: { exp: 800, contrib: 30, skill: 'xiaoyao_trinity', title: '逍遥传人' },
        rewardText: '经验+800 · 贡献+30 · 习得逍遥三合一 · 称号：逍遥传人',
        isFinal: true,
        narrative: {
          accept: {
            scene: '逍遥派·逍遥洞',
            bgChar: `
  🌀  逍  遥  重  聚  🌀
  ════════════════════
  「三老归一」
  「逍遥中兴」`,
            lines: [
              '天山童姥回归逍遥派，与无忧子重聚！',
              '「师弟，多年不见……」',
              '「师兄，别来无恙。」',
              '三老相视而笑，决定将三脉秘法合为一体，传于有缘人。',
            ],
            complete: {
              scene: '逍遥派·逍遥洞',
              lines: [
                '你成为逍遥三合一秘法的传人！',
                '【逍遥派·门派任务链完结】',
                '你被授予「逍遥传人」称号，成为逍遥派新一代掌门候选人！',
                '逍遥派三老归一，武学传承得以完整。',
                '在这乱世之中，逍遥派将以全新姿态，逍遥于天地之间！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 鬼谷门 · 天机推演 ──────────────────────────────
  guigu: {
    name: '鬼谷门',
    theme: '天机推演 · 谋定天下',
    chain: [
      {
        id: 'sect_guigu_1',
        icon: '🔮',
        name: '天机异动',
        desc: '鬼谷门主鬼谷子夜观天象，发现天机紊乱——血骨门之乱将迎来关键转折。你作为鬼谷门弟子，需协助推演天机。',
        type: 'talk',
        targetNpc: 'guigu_master',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_guigu_2',
        narrative: {
          accept: {
            scene: '鬼谷门·天机阁',
            bgChar: `
  🔮  鬼  谷  天  机  阁  🔮
  ════════════════════
  「天机紊乱」
  「大变将至」`,
            lines: [
              '鬼谷子凝视星空，缓缓开口：',
              '「天下大乱，血骨门兴风作浪。但天数有常，乱极必治。」',
              '「我夜观天象，发现关键人物已经出现……」',
              '「你便是其中之一。鬼谷门弟子，当顺应天机，拨乱反正。」',
            ],
            tip: '接受天机推演任务',
          },
        },
      },
      {
        id: 'sect_guigu_2',
        icon: '📜',
        name: '天机图谱',
        desc: '你需要收集三件天机之物：河图、洛书、推背图，用于推演血骨门之乱的最终走向。',
        type: 'collect',
        targetItem: 'heaven_machine_trio',
        reward: { exp: 600, contrib: 20 },
        rewardText: '经验+600 · 贡献+20',
        next: 'sect_guigu_3',
        narrative: {
          accept: {
            scene: '鬼谷门·藏宝室',
            bgChar: `
  🔮  天  机  三  宝  🔮
  ════════════════════
  「河图 · 洛书 · 推背图」
  「推演天机」`,
            lines: [
              '鬼谷子交给你三张藏宝图：',
              '「河图藏于洛水深处，洛书存于嵩山古寺，推背图则在皇城秘库。」',
              '「这三件宝物可助你推演天机，看清血骨门之乱的结局。」',
            ],
            tip: '收集三件天机之物',
          },
          complete: {
            scene: '鬼谷门·天机阁',
            lines: [
              '你成功收集三件天机之物！',
              '鬼谷子将三宝合一，开始推演——',
              '「天机已现……血骨门覆灭，正道中兴！但——代价惨重……」',
              '「这一战，将有英雄陨落……」',
            ],
          },
        },
      },
      {
        id: 'sect_guigu_3',
        icon: '⚔',
        name: '谋定后动',
        desc: '天机显示：最终决战将决定江湖命运。你需将天机推演的结果告知正道联盟，为最终决战做好准备。',
        type: 'travel',
        targetCity: 'songshan',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_guigu_4',
        narrative: {
          accept: {
            scene: '鬼谷门·天机阁',
            bgChar: `
  🔮  谋  定  天  下  🔮
  ════════════════════
  「知己知彼」
  「百战不殆」`,
            lines: [
              '鬼谷子将推演结果交给你：',
              '「将这结果告知正道联盟。让他们知道，血骨门虽强，但天数已定——必败无疑。」',
              '「但要提醒他们：不可轻敌，血骨门必有后手。」',
            ],
            tip: '将天机推演结果告知正道联盟',
          },
          complete: {
            scene: '嵩山少林',
            lines: [
              '玄慈方丈看完推演结果，面色凝重：',
              '「天数如此……我正道联盟，当奋勇向前，虽死无悔！」',
              '「多谢鬼谷门高徒带来天机。我等……心中有数了。」',
            ],
          },
        },
      },
      {
        id: 'sect_guigu_4',
        icon: '🔮',
        name: '天机圆满',
        desc: '天机推演完成，鬼谷门决定在最终决战时为正道联盟提供情报支援。你需代表鬼谷门，参与这场决定江湖命运的大战。',
        type: 'kill',
        targetNpcId: 'npc_gumingzi',
        targetName: '骨冥子',
        targetCity: 'youzhou',
        reward: { exp: 1500, contrib: 50, fame: 40, title: '鬼谷智者' },
        rewardText: '经验+1500 · 贡献+50 · 声望+40 · 称号：鬼谷智者',
        isFinal: true,
        narrative: {
          accept: {
            scene: '鬼谷门·天机阁',
            bgChar: `
  🔮  天  机  圆  满  🔮
  ════════════════════
  「顺应天机」
  「拨乱反正」`,
            lines: [
              '鬼谷子最后叮嘱：',
              '「天机已定，但人谋亦不可少。」',
              '「去吧，在最终决战中，为正道联盟提供情报支援。」',
              '「记住——你代表的是鬼谷门的智慧！」',
            ],
            complete: {
              scene: '血骨门·最终战场',
              lines: [
                '你以鬼谷门的智谋，识破血骨门的埋伏，为正道联盟争取了关键战机！',
                '最终决战大捷，血骨门覆灭！',
                '【鬼谷门·门派任务链完结】',
                '你被授予「鬼谷智者」称号，鬼谷门的智谋威震江湖！',
                '天机已定，江湖太平！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 凌霄阁 · 情报之王 ──────────────────────────────
  lingxiao: {
    name: '凌霄阁',
    theme: '情报之王 · 消息灵通',
    chain: [
      {
        id: 'sect_lingxiao_1',
        icon: '🏯',
        name: '凌霄情报',
        desc: '凌霄阁主紧急召见——血骨门正在对凌霄阁的线人进行清洗，试图切断正道联盟的情报来源。你需要找出内鬼，保护情报网络。',
        type: 'talk',
        targetNpc: 'lingxiao_broker',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_lingxiao_2',
        narrative: {
          accept: {
            scene: '凌霄阁·总坛',
            bgChar: `
  🏯  凌  霄  阁  总  坛  🏯
  ════════════════════
  「情报网络」
  「危在旦夕」`,
            lines: [
              '凌霄阁主面色凝重：',
              '「近日，我阁多名线人失踪或被杀。血骨门在清洗我们的情报网。」',
              '「必有内鬼！你是凌霄阁弟子，此事交给你——找出内鬼，保护情报网络！」',
            ],
            tip: '接受任务，调查内鬼',
          },
        },
      },
      {
        id: 'sect_lingxiao_2',
        icon: '🔍',
        name: '追查内鬼',
        desc: '你通过凌霄阁的情报网络，追踪到内鬼的线索——竟是阁中高层之一！',
        type: 'dungeon',
        targetDungeon: 'dungeon_lingxiao_basement',
        reward: { exp: 600, contrib: 20 },
        rewardText: '经验+600 · 贡献+20',
        next: 'sect_lingxiao_3',
        narrative: {
          accept: {
            scene: '凌霄阁·秘密档案室',
            bgChar: `
  🏯  凌  霄  机  密  🏯
  ════════════════════
  「内鬼是谁？」
  「线索就在此处」`,
            lines: [
              '你在秘密档案室中发现了关键线索——',
              '「原来是他……凌霄阁副阁主！他被血骨门收买了！」',
              '「必须立刻行动，在他泄露更多情报之前抓住他！」',
            ],
            tip: '潜入秘密档案，揭露内鬼身份',
          },
          complete: {
            scene: '凌霄阁·总坛',
            lines: [
              '你成功揭露内鬼身份，凌霄阁主大怒：',
              '「好一个副阁主！竟敢背叛凌霄阁！」',
              '「立刻将他拿下！清理门户！」',
              '内鬼被抓获，凌霄阁的情报网络得以保全。',
            ],
          },
        },
      },
      {
        id: 'sect_lingxiao_3',
        icon: '💀',
        name: '血骨反击',
        desc: '血骨门得知内鬼被抓，恼羞成怒，派出血骨门高手攻打凌霄阁！你需率众抵御！',
        type: 'kill',
        targetNpcId: 'blood_bone_guardian',
        targetName: '血骨门护法',
        targetCity: 'yangzhou',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_lingxiao_4',
        narrative: {
          accept: {
            scene: '凌霄阁·总坛外',
            bgChar: `
  🏯  血  骨  围  攻  🏯
  ════════════════════
  「凌霄阁」
  「必须摧毁！」`,
            lines: [
              '血骨门护法率军围攻凌霄阁！',
              '「情报网被断，罪在凌霄阁！今日血洗此地！」',
              '凌霄阁主大喝：「凌霄弟子，迎敌！」',
            ],
            tip: '击退血骨门围攻',
          },
          complete: {
            scene: '凌霄阁·总坛',
            lines: [
              '血骨门护法被击败，凌霄阁转危为安！',
              '凌霄阁主亲自向你道谢：',
              '「若非你查出内鬼，今日凌霄阁危矣。」',
              '「从今日起，你便是凌霄阁的核心弟子，共享最机密的情报！」',
            ],
          },
        },
      },
      {
        id: 'sect_lingxiao_4',
        icon: '🏯',
        name: '情报王者',
        desc: '凌霄阁决定在最终决战中发挥情报优势，为正道联盟提供全面的战场情报。你将代表凌霄阁，参与这场大战！',
        type: 'travel',
        targetCity: 'songshan',
        reward: { exp: 800, contrib: 30, fame: 35, title: '凌霄阁主' },
        rewardText: '经验+800 · 贡献+30 · 声望+35 · 称号：凌霄阁主',
        isFinal: true,
        narrative: {
          accept: {
            scene: '凌霄阁·总坛',
            bgChar: `
  🏯  凌  霄  登  顶  🏯
  ════════════════════
  「消息通天下」
  「剑指凌霄阁」`,
            lines: [
              '凌霄阁主正式宣布：',
              '「凌霄阁弟子，你在危难中挽救了阁中同道，立下大功。」',
              '「今日起，你便是凌霄阁的正式阁主——不，暂代阁主。」',
              '「在最终决战中，为正道联盟提供最全面的情报支援！」',
            ],
            complete: {
              scene: '凌霄阁·总坛',
              lines: [
                '【凌霄阁·门派任务链完结】',
                '你成为凌霄阁暂代阁主，获得最机密的情报权限！',
                '在最终决战中，你提供的情报帮助正道联盟屡战屡胜！',
                '凌霄阁「消息通天下」的名号，响彻江湖！',
              ],
            },
          },
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 【混乱门派】
  // ══════════════════════════════════════════════════════

  // ── 明教 · 圣火永燃 ──────────────────────────────
  mingjiao: {
    name: '明教',
    theme: '圣火永燃 · 光明对抗',
    chain: [
      {
        id: 'sect_mingjiao_1',
        icon: '🔥',
        name: '圣火抉择',
        desc: '明教教主收到血骨门的招揽——三魔联盟愿与明教联手，一统江湖。但明教历代教义是「驱除鞑虏，恢复中华」，与血骨门为伍真的正确吗？',
        type: 'talk',
        targetNpc: 'mingjiao_flamelord',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_mingjiao_2',
        narrative: {
          accept: {
            scene: '明教·圣火大殿',
            bgChar: `
  🔥  明  教  圣  火  大  殿  🔥
  ════════════════════
  「三魔联盟」
  「是敌是友？」`,
            lines: [
              '明教教主面对两难抉择：',
              '「血骨门的提议……若与三魔联盟联手，明教势力可大涨。」',
              '「但……我明教历代教义是驱除鞑虏、恢复中华。与血骨门这等邪道为伍……」',
              '「你是明教弟子，此事你怎么看？」',
            ],
            tip: '参与明教教主的抉择讨论',
          },
        },
      },
      {
        id: 'sect_mingjiao_2',
        icon: '⚔',
        name: '正道试探',
        desc: '正当明教犹豫之际，正道联盟也派人来联络——希望明教能保持中立，或倒向正道。你需代表明教，试探双方的真实意图。',
        type: 'travel',
        targetCity: 'songshan',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_mingjiao_3',
        narrative: {
          accept: {
            scene: '嵩山少林',
            bgChar: `
  ☸  正  道  联  络  ☸
  ════════════════════
  「明教」
  「何去何从？」`,
            lines: [
              '你以明教使者身份拜访少林：',
              '「正道联盟愿与明教和解，共同对付血骨门。」',
              '「但……正道素来看不起我明教，这和解有几分真心？」',
            ],
            tip: '试探正道联盟的真实意图',
          },
          complete: {
            scene: '幽州·三魔联盟',
            lines: [
              '你又潜入三魔联盟，试探血骨门的态度：',
              '「明教若加入三魔联盟，事成之后，可分得半壁江山！」',
              '「但血骨门的话，能信几分？」',
              '你将两方态度带回明教，教主陷入沉思……',
            ],
          },
        },
      },
      {
        id: 'sect_mingjiao_3',
        icon: '🔥',
        name: '圣火抉择',
        desc: '经过深思熟虑，明教教主决定——既不投靠三魔联盟，也不完全倒向正道。保持独立，在两强之间寻找平衡，为明教争取最大利益！',
        type: 'talk',
        targetNpc: 'mingjiao_flamelord',
        reward: { exp: 600, contrib: 20 },
        rewardText: '经验+600 · 贡献+20',
        next: 'sect_mingjiao_4',
        narrative: {
          accept: {
            scene: '明教·圣火大殿',
            bgChar: `
  🔥  明  教  圣  火  抉  择  🔥
  ════════════════════
  「明教」
  「走自己的路！」`,
            lines: [
              '教主拍案而起：',
              '「明教不依附任何人！我们有自己的道路！」',
              '「但血骨门势大，正道也不可信。我们必须暗中积蓄力量！」',
              '「明教弟子，这使命就交给你了！」',
            ],
            tip: '接受明教的独立发展路线',
          },
          complete: {
            scene: '明教·圣火大殿',
            lines: [
              '明教决定走独立发展路线——暗中积蓄实力，静待时机。',
              '「明教圣火，永不熄灭。无论正道与邪道谁胜谁负，明教都要屹立不倒！」',
              '「去吧，为明教争取更多的盟友和资源！」',
            ],
          },
        },
      },
      {
        id: 'sect_mingjiao_4',
        icon: '🔥',
        name: '圣火传承',
        desc: '明教在乱世中寻找自己的道路。你作为明教的核心弟子，需在各方势力中周旋，为明教争取最大利益。',
        type: 'kill',
        targetNpcId: 'riyue_elite',
        targetName: '日月神教高手',
        targetCity: 'hanzhong',
        reward: { exp: 1000, contrib: 40, fame: 30, title: '明教光明使' },
        rewardText: '经验+1000 · 贡献+40 · 声望+30 · 称号：明教光明使',
        isFinal: true,
        narrative: {
          accept: {
            scene: '明教·圣火大殿',
            bgChar: `
  🔥  明  教  光  明  使  🔥
  ════════════════════
  「圣火不灭」
  「明教永存」`,
            lines: [
              '教主亲自为你举行加冕仪式：',
              '「你为明教争取了时间和利益，今日起，你便是光明使！」',
              '「无论江湖风云如何变幻，明教圣火，永不熄灭！」',
            ],
            complete: {
              scene: '明教·圣火大殿',
              lines: [
                '【明教·门派任务链完结】',
                '你被授予「明教光明使」称号，成为明教新一代的核心人物！',
                '在接下来的江湖大变局中，明教将伺机而动，成为一股不可忽视的力量。',
                '圣火燎原，明教中兴！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 天地帮 · 雷霆霸业 ──────────────────────────────
  tiandibang: {
    name: '天地帮',
    theme: '雷霆霸业 · 趁乱崛起',
    chain: [
      {
        id: 'sect_tiandibang_1',
        icon: '⚡',
        name: '帮主野心',
        desc: '天地帮帮主有吞并江湖的野心！血骨门之乱让他看到了机会——趁乱扩张势力，建立自己的霸业！',
        type: 'talk',
        targetNpc: 'tiandibang_boss',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_tiandibang_2',
        narrative: {
          accept: {
            scene: '天地帮·总舵',
            bgChar: `
  ⚡  天  地  帮  总  舵  ⚡
  ════════════════════
  「乱世出英雄」
  「正是崛起之时！」`,
            lines: [
              '帮主哈哈大笑：',
              '「乱世！正是我天地帮崛起的大好时机！」',
              '「血骨门与正道打得不可开交，正是我们趁虚而入的时候！」',
              '「天地帮弟子，去为我帮开疆拓土！」',
            ],
            tip: '接受天地帮的扩张任务',
          },
        },
      },
      {
        id: 'sect_tiandibang_2',
        icon: '⚡',
        name: '扩张势力',
        desc: '你需为天地帮攻占几处战略要地，扩大帮派势力。沿途可能遭遇血骨门和正道的人马，都要小心应对。',
        type: 'dungeon',
        targetDungeon: 'dungeon_tiandibang_stronghold',
        reward: { exp: 600, contrib: 20 },
        rewardText: '经验+600 · 贡献+20',
        next: 'sect_tiandibang_3',
        narrative: {
          accept: {
            scene: '汉中·官道',
            bgChar: `
  ⚡  天  地  扩  张  ⚡
  ════════════════════
  「攻占要地」
  「壮大帮派」`,
            lines: [
              '你率天地帮弟子攻占了几处战略要地！',
              '「好！天地帮的势力又扩大了！」',
              '「但要注意，不可太过张扬，以免引来血骨门和正道的联手打压！」',
            ],
            tip: '攻占战略要地，扩大天地帮势力',
          },
          complete: {
            scene: '天地帮·总舵',
            lines: [
              '天地帮势力大增，控制了大片区域！',
              '帮主大喜：「干得好！天地帮在你手中发扬光大！」',
              '「但还不够……要真正称霸江湖，还需更多筹码！」',
            ],
          },
        },
      },
      {
        id: 'sect_tiandibang_3',
        icon: '⚡',
        name: '争夺秘籍',
        desc: '天地帮探子发现一处秘藏，存放着上古武学秘籍。你需率队夺取，为天地帮增添实力。',
        type: 'kill',
        targetNpcId: 'ancient_guardian',
        targetName: '秘藏守护者',
        targetCity: 'hanzhong',
        reward: { exp: 700, contrib: 25 },
        rewardText: '经验+700 · 贡献+25',
        next: 'sect_tiandibang_4',
        narrative: {
          accept: {
            scene: '秦岭深处·秘藏入口',
            bgChar: `
  ⚡  古  代  秘  藏  ⚡
  ════════════════════
  「上古武学」
  「归属天地帮！」`,
            lines: [
              '你率队来到秘藏入口——',
              '秘藏守护者现身：「何人擅闯禁地！」',
              '「天地帮要的东西，就一定能得到！」',
            ],
            tip: '击败秘藏守护者，夺取武学秘籍',
          },
          complete: {
            scene: '天地帮·总舵',
            lines: [
              '你击败守护者，获得上古武学秘籍！',
              '帮主看后大喜：「天雷神功！这可是绝顶武学！」',
              '「有了这本秘籍，天地帮实力大增！」',
            ],
          },
        },
      },
      {
        id: 'sect_tiandibang_4',
        icon: '⚡',
        name: '霸业初成',
        desc: '天地帮势力大增，已成为江湖上一股不可忽视的力量。帮主决定趁正道与血骨门决战之际，发起最后的攻势，建立天地帮的霸业！',
        type: 'kill',
        targetNpcId: 'tiandibang_final_rival',
        targetName: '争霸对手',
        targetCity: 'kaifeng',
        reward: { exp: 1200, contrib: 50, fame: 40, title: '天地帮副帮主' },
        rewardText: '经验+1200 · 贡献+50 · 声望+40 · 称号：天地帮副帮主',
        isFinal: true,
        narrative: {
          accept: {
            scene: '天地帮·誓师大会',
            bgChar: `
  ⚡  天  地  霸  业  ⚡
  ════════════════════
  「雷霆所至」
  「无不臣服！」`,
            lines: [
              '帮主登高大呼：',
              '「天地帮的儿郎们！今日，就是我们称霸江湖的时刻！」',
              '「杀！」',
            ],
            complete: {
              scene: '开封·天地帮总舵',
              lines: [
                '天地帮在乱战中崛起，成为新一代江湖霸主之一！',
                '【天地帮·门派任务链完结】',
                '你被任命为副帮主，成为一人之下、万人之上的人物！',
                '天地帮「雷霆霸业」威震江湖！',
              ],
            },
          },
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 【邪道门派】
  // ══════════════════════════════════════════════════════

  // ── 血骨门 · 血炼天下 ──────────────────────────────
  xuegu: {
    name: '血骨门',
    theme: '血炼天下 · 玄铁野心',
    chain: [
      {
        id: 'sect_xuegu_1',
        icon: '💀',
        name: '血神经秘',
        desc: '血骨门门主骨冥子私下召见——血神经修炼需要大量武学精华和玄铁令的力量。你作为血骨门核心弟子，需为血神经的最终修炼做准备。',
        type: 'talk',
        targetNpc: 'xuegu_boss',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_xuegu_2',
        narrative: {
          accept: {
            scene: '血骨门·门主密室',
            bgChar: `
  💀  血  骨  门  密  室  💀
  ════════════════════
  「血神经」
  「即将大成！」`,
            lines: [
              '骨冥子眼中闪烁着疯狂的光芒：',
              '「血神经修炼到了关键时刻……只需要再收集一些武学精华，加上玄铁令的力量……」',
              '「就能大成！届时，天下将尽在血骨门掌握之中！」',
              '「你是血骨门的核心弟子，此事交给你。」',
            ],
            tip: '接受血神经修炼的准备任务',
          },
        },
      },
      {
        id: 'sect_xuegu_2',
        icon: '📜',
        name: '收集秘籍',
        desc: '血神经需要吸收各派武学精华。你需潜入各派据点，夺取他们的武学秘籍。少林、武当、华山……都在目标名单上！',
        type: 'dungeon',
        targetDungeon: 'dungeon_sect_raid',
        reward: { exp: 700, contrib: 25 },
        rewardText: '经验+700 · 贡献+25',
        next: 'sect_xuegu_3',
        narrative: {
          accept: {
            scene: '血骨门·任务大厅',
            bgChar: `
  💀  血  骨  掠  夺  💀
  ════════════════════
  「武学精华」
  「血神经的养分」`,
            lines: [
              '你率血骨门精锐潜入各派据点，夺取武学秘籍！',
              '少林、武当、华山……无数秘籍落入血骨门手中！',
              '「好！有了这些秘籍，血神经的修炼进度大大加快！」',
            ],
            tip: '潜入各派，夺取武学秘籍',
          },
          complete: {
            scene: '血骨门·血池',
            lines: [
              '大量武学精华被送入血池，骨冥子吸收后，气势更加强大！',
              '「哈哈哈哈！血神经第二层已成！」',
              '「继续收集！最终决战，就在眼前！」',
            ],
          },
        },
      },
      {
        id: 'sect_xuegu_3',
        icon: '🔩',
        name: '玄铁争夺',
        desc: '玄铁令是血神经大成最关键的一环。你需协助血骨门夺取各派手中的玄铁令碎片！',
        type: 'kill',
        targetNpcId: 'shaolin_guardian',
        targetName: '少林守卫',
        targetCity: 'songshan',
        reward: { exp: 800, contrib: 30 },
        rewardText: '经验+800 · 贡献+30',
        next: 'sect_xuegu_4',
        narrative: {
          accept: {
            scene: '嵩山少林·外',
            bgChar: `
  ☸  玄  铁  争  夺  ☸
  ════════════════════
  「玄铁令」
  「必须得到！」`,
            lines: [
              '你率血骨门精锐突袭少林！',
              '「玄铁令就在少林！杀进去！」',
              '少林守卫严阵以待：「血骨门的人，休想踏入少林一步！」',
            ],
            tip: '夺取少林的玄铁令碎片',
          },
          complete: {
            scene: '嵩山少林·废墟',
            lines: [
              '你击败少林守卫，夺取了玄铁令碎片！',
              '「太好了！有了这块碎片，加上收集的秘籍……」',
              '「血神经大成之日，终于要来了！」',
            ],
          },
        },
      },
      {
        id: 'sect_xuegu_4',
        icon: '💀',
        name: '血神经大成',
        desc: '所有准备工作完成！骨冥子决定在血池中完成血神经的最后修炼。一旦大成，血骨门将无敌于天下！',
        type: 'kill',
        targetNpcId: 'final_guardian',
        targetName: '正道联盟高手',
        targetCity: 'youzhou',
        reward: { exp: 1500, contrib: 60, fame: 50, title: '血骨门护法' },
        rewardText: '经验+1500 · 贡献+60 · 声望+50 · 称号：血骨门护法',
        isFinal: true,
        narrative: {
          accept: {
            scene: '血骨门·血池',
            bgChar: `
  💀  血  神 经 大 成  💀
  ════════════════════
  「天下」
  「尽在掌握！」`,
            lines: [
              '正道联盟的高手杀入血池，试图阻止血神经修炼！',
              '「绝不能让他们打扰门主！」',
              '「血骨门弟子，誓死守护血池！」',
            ],
            complete: {
              scene: '血骨门·废墟',
              lines: [
                '你击退了正道联盟的进攻，骨冥子成功完成血神经修炼！',
                '但……正道联盟的圣光裁决者突然出现！',
                '「血神经……终究是邪不胜正！」',
                '【血骨门·门派任务链完结】',
                '虽然血神经大成，但在正道联盟的围攻下，血骨门最终覆灭……',
                '你作为血骨门护法，在最后时刻逃脱，隐姓埋名，等待东山再起的机会……',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 日月神教 · 日月当空 ──────────────────────────────
  riyue: {
    name: '日月神教',
    theme: '日月当空 · 霸主野心',
    chain: [
      {
        id: 'sect_riyue_1',
        icon: '☀',
        name: '教主宏图',
        desc: '日月神教教主有一个野心——一统江湖，成为天下霸主！血骨门之乱正是千载难逢的机会！',
        type: 'talk',
        targetNpc: 'riyue_leader',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_riyue_2',
        narrative: {
          accept: {
            scene: '日月神教·总坛',
            bgChar: `
  ☀  日  月  神  教  总  坛  ☀
  ════════════════════
  「一统江湖」
  「千秋万载！」`,
            lines: [
              '教主高坐宝座之上，俯视群雄：',
              '「血骨门不过是跳梁小丑，真正有资格一统江湖的，是我日月神教！」',
              '「趁血骨门与正道打得两败俱伤，我日月神教坐收渔翁之利！」',
              '「日月弟子，随我开疆拓土！」',
            ],
            tip: '接受日月神教的扩张任务',
          },
        },
      },
      {
        id: 'sect_riyue_2',
        icon: '☀',
        name: '渗透正道',
        desc: '日月神教的策略是渗透而非硬拼。你需潜入各派，布置内应，为日后的行动做准备。',
        type: 'dungeon',
        targetDungeon: 'dungeon_infiltration',
        reward: { exp: 600, contrib: 20 },
        rewardText: '经验+600 · 贡献+20',
        next: 'sect_riyue_3',
        narrative: {
          accept: {
            scene: '日月神教·情报部',
            bgChar: `
  ☀  日  月  渗  透  ☀
  ════════════════════
  「暗棋」
  「遍布天下」`,
            lines: [
              '你潜入各大门派，成功布置了多名内应！',
              '「很好……有了这些暗棋，日月神教的眼线遍布天下！」',
              '「无论正道还是血骨门，一举一动都在我们掌握之中！」',
            ],
            tip: '在各派布置内应',
          },
          complete: {
            scene: '日月神教·总坛',
            lines: [
              '内应网络布置完成！',
              '「干得好！有了这些情报，我们可以随时掌握正邪两方的动向！」',
              '「接下来，就等待最佳时机，一网打尽！」',
            ],
          },
        },
      },
      {
        id: 'sect_riyue_3',
        icon: '⚔',
        name: '渔翁得利',
        desc: '时机成熟！正道联盟与血骨门即将决战。你需率领日月神教精锐，在两败俱伤时出手，一举歼灭双方！',
        type: 'kill',
        targetNpcId: 'dual_enemies',
        targetName: '正道与血骨联军',
        targetCity: 'youzhou',
        reward: { exp: 1000, contrib: 40 },
        rewardText: '经验+1000 · 贡献+40',
        next: 'sect_riyue_4',
        narrative: {
          accept: {
            scene: '幽州·战场边缘',
            bgChar: `
  ☀  渔  翁  得  利  ☀
  ════════════════════
  「两败俱伤」
  「日月出手！」`,
            lines: [
              '你率日月神教精锐埋伏在战场边缘——',
              '正道联盟与血骨门杀得难解难分！',
              '「就是现在！日月弟子，随我出击！」',
            ],
            tip: '在决战关键时刻出手，一网打尽',
          },
          complete: {
            scene: '幽州·战场',
            lines: [
              '日月神教突然杀出，措手不及的双方损失惨重！',
              '「哈哈哈哈！正邪两道，尽在我日月神教掌握之中！」',
              '「一统江湖，就在今日！」',
            ],
          },
        },
      },
      {
        id: 'sect_riyue_4',
        icon: '☀',
        name: '日月一统',
        desc: '日月神教趁乱崛起，成为最后的赢家！教主登上武林至尊之位，你作为功臣，被授予无上荣耀！',
        type: 'talk',
        targetNpc: 'riyue_leader',
        reward: { exp: 1500, contrib: 60, fame: 60, title: '日月神教副教主' },
        rewardText: '经验+1500 · 贡献+60 · 声望+60 · 称号：日月神教副教主',
        isFinal: true,
        narrative: {
          accept: {
            scene: '日月神教·武林至尊台',
            bgChar: `
  ☀  日  月  一  统  ☀
  ════════════════════
  「千秋万载」
  「一统江湖！」`,
            lines: [
              '教主高坐武林至尊之位，接受万众朝拜：',
              '「日月当空，照耀江湖！从今日起，日月神教便是天下正统！」',
              '「而你——日月神教的功臣，将与本教主共享这万里江山！」',
            ],
            complete: {
              scene: '日月神教·总坛',
              lines: [
                '【日月神教·门派任务链完结】',
                '你被任命为副教主，成为日月神教最有权势的人物之一！',
                '日月当空，一统江湖！虽然这是邪道的胜利，但历史将由胜利者书写……',
              ],
            },
          },
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 【邪道门派】
  // ══════════════════════════════════════════════════════

  // ── 五毒教 · 毒行天下 ──────────────────────────────
  wudu: {
    name: '五毒教',
    theme: '毒行天下 · 血蛊之秘',
    chain: [
      {
        id: 'sect_wudu_1',
        icon: '🐍',
        name: '蛊毒来袭',
        desc: '五毒教教主蚩苗儿紧急召见——五毒教收到血骨门威胁，要五毒教交出镇教之宝「万蛊珠」，否则血洗五毒教。教主命你查明血骨门的真正意图。',
        type: 'talk',
        targetNpc: 'wudu_shaman',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_wudu_2',
        narrative: {
          accept: {
            scene: '五毒教·万蛊殿',
            bgChar: `
  🐍  五  毒  万  蛊  殿  🐍
  ════════════════════
  「万蛊珠」
  「我教镇教之宝」`,
            lines: [
              '蚩苗儿教主面色凝重：',
              '「血骨门来势汹汹，扬言要我们交出万蛊珠，否则便血洗五毒教。」',
              '「万蛊珠乃我教历代教主心血所化，岂能拱手让人？」',
              '「但……血骨门势力庞大，我们若硬拼，只怕两败俱伤。你去查查，血骨门究竟有何图谋。」',
            ],
            tip: '调查血骨门为何觊觎万蛊珠',
          },
        },
      },
      {
        id: 'sect_wudu_2',
        icon: '💀',
        name: '血骨阴谋',
        desc: '你潜入血骨门领地，发现血骨门主骨冥子正在修炼一种需要万蛊珠辅助的邪功——「血神经」！原来他需要万蛊珠中的万种蛊毒来压制血神经的反噬！',
        type: 'dungeon',
        targetDungeon: 'dungeon_xuegu_forbidden',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_wudu_3',
        narrative: {
          accept: {
            scene: '血骨门领地边缘',
            bgChar: `
  💀  血  骨  阴  谋  💀
  ════════════════════
  「血神经」
  「需要万蛊珠」`,
            lines: [
              '你潜入血骨门领地，偷听到重要情报——',
              '「血神经修炼到深处，反噬之力越来越强……必须找到万蛊珠，用万毒压制反噬！」',
              '「五毒教若不识抬举，便让他们见识见识血骨门的厉害！」',
              '你暗暗吃惊：原来血骨门觊觎万蛊珠，是为了修炼血神经！',
            ],
            tip: '潜入血骨门禁地，探明血神经的秘密',
          },
          complete: {
            scene: '五毒教·万蛊殿',
            lines: [
              '你将探得的情报禀报蚩苗儿教主：',
              '「血神经……原来如此！难怪血骨门如此急切！」',
              '「但我们五毒教也不是任人宰割的。万蛊珠绝不能落入血骨门手中！」',
              '「看来……是时候与正道联盟接触了。」',
            ],
          },
        },
      },
      {
        id: 'sect_wudu_3',
        icon: '🤝',
        name: '正邪联手',
        desc: '五毒教决定暂时与正道联盟合作，共同对付血骨门。你需作为五毒教使者，与正道联盟接触，商议联手之事。',
        type: 'travel',
        targetCity: 'songshan',
        reward: { exp: 600, contrib: 18, rel_sect: 'shaolin', rel_val: 15 },
        rewardText: '经验+600 · 贡献+18 · 少林好感+15',
        next: 'sect_wudu_4',
        narrative: {
          accept: {
            scene: '五毒教·山门',
            bgChar: `
  🐍  正  邪  联  手  🐍
  ════════════════════
  「共抗血骨」
  「暂时合作」`,
            lines: [
              '蚩苗儿教主叮嘱：',
              '「此行前往嵩山少林，与正道联盟商议联手之事。」',
              '「虽是邪正合作，但为了对付血骨门这个共同的敌人，暂时的联盟是必要的。」',
              '「记住——五毒教的尊严，不可堕了！」',
            ],
            tip: '前往嵩山少林，与正道联盟商议联手抗敌',
          },
          complete: {
            scene: '嵩山少林·大殿',
            lines: [
              '玄慈方丈听完你的来意，沉吟片刻：',
              '「五毒教愿与正道联手抗敌，这是好事。」',
              '「血骨门乃江湖公敌，能多一份力量，正道便多一分胜算。」',
              '「希望此次合作，能为江湖带来太平！」',
            ],
          },
        },
      },
      {
        id: 'sect_wudu_4',
        icon: '🐍',
        name: '五毒归位',
        desc: '正邪联手协议达成！但血骨门的追兵也到了！你需击败追兵，证明五毒教的实力，同时保护正道联盟的安全！',
        type: 'kill',
        targetNpcId: 'blood_bone_elite',
        targetName: '血骨门精锐',
        targetCity: 'songshan',
        reward: { exp: 1000, contrib: 35, fame: 40, title: '五毒使者' },
        rewardText: '经验+1000 · 贡献+35 · 声望+40 · 称号：五毒使者',
        isFinal: true,
        narrative: {
          accept: {
            scene: '嵩山少林·山门',
            bgChar: `
  🐍  五  毒  护  盟  🐍
  ════════════════════
  「五毒教」
  「言出必行」`,
            lines: [
              '血骨门追兵突然出现在少林山门！',
              '「五毒教的叛徒！竟敢与正道勾结！」',
              '「今日，你们都要死！」',
              '蚩苗儿教主冷笑：「来得正好！让他们见识见识五毒教的厉害！」',
            ],
            complete: {
              scene: '嵩山少林·山门',
              lines: [
                '你以五毒教绝学击退血骨门追兵！',
                '玄慈方丈点头：「五毒教果然名不虚传！从今日起，正邪联手，共抗血骨！」',
                '【五毒教·门派任务链完结】',
                '你被授予「五毒使者」称号，成为五毒教与正道联盟的联络人！',
                '虽然正邪有别，但为了对抗血骨门这个更大的威胁，双方暂时携手合作。',
                '江湖的格局，正在悄然改变……',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 玄冥教 · 暗影冥行 ──────────────────────────────
  xuanming: {
    name: '玄冥教',
    theme: '暗影冥行 · 冥王之谋',
    chain: [
      {
        id: 'sect_xuanming_1',
        icon: '🌙',
        name: '冥王密令',
        desc: '玄冥教副教主私下召见——玄冥教本是三魔联盟的一员，但他发现教主与血骨门暗中勾结，欲将玄冥教彻底卖给血骨门！他需要你暗中调查。',
        type: 'talk',
        targetNpc: 'xuanming_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_xuanming_2',
        narrative: {
          accept: {
            scene: '玄冥教·密室',
            bgChar: `
  🌙  玄  冥  密  室  🌙
  ════════════════════
  「内部危机」
  「教主背叛」`,
            lines: [
              '玄冥教副教主面色阴沉：',
              '「我发现了一个惊人的秘密——教主正在暗中与血骨门勾结！」',
              '「他想把玄冥教彻底卖给血骨门，我们这些老人都将被清洗！」',
              '「你是玄冥教的忠诚弟子，此事便交给你暗中调查。」',
            ],
            tip: '暗中调查教主与血骨门的勾结证据',
          },
        },
      },
      {
        id: 'sect_xuanming_2',
        icon: '📜',
        name: '密函证据',
        desc: '你在教主的书房中发现了密函——教主确实与血骨门达成了秘密协议，血骨门将帮助他登上玄冥教教主之位，而作为交换，玄冥教将成为血骨门的附庸！',
        type: 'collect',
        targetItem: 'secret_covenant',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_xuanming_3',
        narrative: {
          accept: {
            scene: '玄冥教·教主书房',
            bgChar: `
  🌙  密  函  证  据  🌙
  ════════════════════
  「铁证如山」
  「教主背叛」`,
            lines: [
              '你潜入教主书房，发现了藏在暗格中的密函——',
              '「血骨门承诺：助玄冥教主登上大位，事成之后，玄冥教为血骨门附庸，永不背叛。」',
              '「竟有此事！教主的野心，竟要用整个玄冥教来陪葬！」',
            ],
            tip: '找到教主背叛玄冥教的证据',
          },
          complete: {
            scene: '玄冥教·密室',
            lines: [
              '副教主看完密函，怒火中烧：',
              '「好一个教主！竟要将玄冥教拱手让人！」',
              '「我们必须阻止他！否则玄冥教将万劫不复！」',
              '「下一步，我们需要争取更多长老的支持！」',
            ],
          },
        },
      },
      {
        id: 'sect_xuanming_3',
        icon: '⚔',
        name: '长老抉择',
        desc: '副教主命你争取玄冥教四大长老的支持，推翻现任教主。但四大长老态度各异，你需要一一说服。',
        type: 'kill',
        targetNpcId: 'xuanming_guardian',
        targetName: '玄冥教守护者',
        targetCity: 'luoyang',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_xuanming_4',
        narrative: {
          accept: {
            scene: '玄冥教·长老阁',
            bgChar: `
  🌙  长  老  抉  择  🌙
  ════════════════════
  「四大长老」
  「各有立场」`,
            lines: [
              '四大长老中，有人支持副教主，有人保持中立，还有人是教主的死忠——',
              '「长老们意见不一，我们必须用实力说话！」',
              '「击败那些顽固的守旧派，让其他长老看到我们的实力！」',
            ],
            tip: '击败玄冥教守护者，争取长老们的支持',
          },
          complete: {
            scene: '玄冥教·长老阁',
            lines: [
              '你击败玄冥教守护者，展现了强大的实力！',
              '原本中立的两位长老终于表态：「副教主所言不虚，我等愿追随！」',
              '「玄冥教不能毁在教主手中！是时候做出选择了！」',
            ],
          },
        },
      },
      {
        id: 'sect_xuanming_4',
        icon: '🌙',
        name: '冥教革新',
        desc: '玄冥教内部政变开始！你需要与副教主联手，推翻现任教主，拯救玄冥教！',
        type: 'kill',
        targetNpcId: 'xuanming_master_old',
        targetName: '玄冥教教主',
        targetCity: 'luoyang',
        reward: { exp: 1200, contrib: 40, fame: 35, title: '玄冥革新者' },
        rewardText: '经验+1200 · 贡献+40 · 声望+35 · 称号：玄冥革新者',
        isFinal: true,
        narrative: {
          accept: {
            scene: '玄冥教·总坛',
            bgChar: `
  🌙  玄  冥  革  新  🌙
  ════════════════════
  「推翻教主」
  「拯救玄冥」`,
            lines: [
              '玄冥教总坛，副教主率领众人与教主对峙！',
              '「教主！你背叛玄冥教，勾结血骨门，今日便是你的末日！」',
              '「叛逆！你们才是叛逆！血骨门才是玄冥教的未来！」',
            ],
            complete: {
              scene: '玄冥教·总坛',
              lines: [
                '你与副教主联手，击败了教主！',
                '教主败逃，血骨门的援军也被击退！',
                '【玄冥教·门派任务链完结】',
                '你被授予「玄冥革新者」称号，成为玄冥教新一代的领袖！',
                '玄冥教脱离三魔联盟，江湖格局再次改变！',
                '血骨门的势力，再次被削弱……',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 海沙帮 · 海沙霸业 ──────────────────────────────
  haisha: {
    name: '海沙帮',
    theme: '海沙霸业 · 运河风云',
    chain: [
      {
        id: 'sect_haisha_1',
        icon: '⚓',
        name: '运河危机',
        desc: '海沙帮帮主海万里紧急召见——血骨门的手伸到了运河！血骨门要求海沙帮让出运河控制权，否则将血洗海沙帮。你需要找出对策。',
        type: 'talk',
        targetNpc: 'haisha_leader',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_haisha_2',
        narrative: {
          accept: {
            scene: '海沙帮·总舵',
            bgChar: `
  ⚓  海  沙  总  舵  ⚓
  ════════════════════
  「运河告急」
  「血骨门施压」`,
            lines: [
              '海万里帮主拍案而起：',
              '「血骨门欺人太甚！竟要我海沙帮让出运河控制权！」',
              '「运河是我们海沙帮的命根子，绝不能拱手让人！」',
              '「但血骨门势大，我们需要智取。你可有良策？」',
            ],
            tip: '接受帮主的询问，商讨对策',
          },
        },
      },
      {
        id: 'sect_haisha_2',
        icon: '📜',
        name: '漕帮联盟',
        desc: '你建议联合运河沿岸的其他漕帮，共同对抗血骨门。帮主命你前往各地联络，组建漕帮联盟。',
        type: 'travel',
        targetCity: 'yangzhou',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_haisha_3',
        narrative: {
          accept: {
            scene: '海沙帮·码头',
            bgChar: `
  ⚓  联  合  漕  帮  ⚓
  ════════════════════
  「漕帮一家」
  「共抗血骨」`,
            lines: [
              '帮主点头：「此计甚好！运河沿岸不止我海沙帮，还有漕帮、长江帮等。」',
              '「若能联合这些力量，血骨门也不敢轻举妄动。」',
              '「你去扬州、苏州、杭州等地，联络各漕帮帮主。」',
            ],
            tip: '联络运河沿岸各漕帮，组建联盟',
          },
          complete: {
            scene: '扬州·漕帮大会',
            lines: [
              '你成功联络各地漕帮，各帮帮主齐聚扬州，商议联合抗敌！',
              '「血骨门的手伸得太长了！是时候让他们知道，运河是我们的运河！」',
              '「漕帮联盟，正式成立！」',
            ],
          },
        },
      },
      {
        id: 'sect_haisha_3',
        icon: '⚔',
        name: '血骨来袭',
        desc: '漕帮联盟成立后，血骨门不甘失败，派出高手袭击！你需击退血骨门的进攻，巩固联盟！',
        type: 'kill',
        targetNpcId: 'blood_bone_raider',
        targetName: '血骨门袭击者',
        targetCity: 'yangzhou',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_haisha_4',
        narrative: {
          accept: {
            scene: '扬州·运河码头',
            bgChar: `
  ⚓  血  骨  袭  击  ⚓
  ════════════════════
  「漕帮联盟」
  「绝不退缩」`,
            lines: [
              '血骨门高手突然袭击扬州码头！',
              '「漕帮的蝼蚁们！竟敢对抗血骨门？今日就让你们见识见识厉害！」',
              '各帮弟子严阵以待：「保护运河！绝不让血骨门得逞！」',
            ],
            tip: '击退血骨门袭击者，保护漕帮联盟',
          },
          complete: {
            scene: '扬州·运河码头',
            lines: [
              '你率各帮弟子击退血骨门袭击者！',
              '「痛快！血骨门也不过如此！」',
              '「运河是我们的家，绝不容外人染指！」',
              '漕帮联盟声威大振，血骨门的运河计划彻底失败！',
            ],
          },
        },
      },
      {
        id: 'sect_haisha_4',
        icon: '⚓',
        name: '运河霸主',
        desc: '漕帮联盟大获全胜！海沙帮一跃成为运河霸主！帮主决定联合更多力量，彻底将血骨门赶出运河！',
        type: 'kill',
        targetNpcId: 'blood_bone_water_chief',
        targetName: '血骨门水军统领',
        targetCity: 'hanzhong',
        reward: { exp: 1000, contrib: 35, fame: 40, title: '运河守护' },
        rewardText: '经验+1000 · 贡献+35 · 声望+40 · 称号：运河守护',
        isFinal: true,
        narrative: {
          accept: {
            scene: '运河·最终战场',
            bgChar: `
  ⚓  运  河  决  战  ⚓
  ════════════════════
  「运河霸主」
  「谁与争锋」`,
            lines: [
              '血骨门水军统领亲率大军而来！',
              '「海沙帮的蝼蚁！今日便是你们的末日！」',
              '「为了运河！为了漕帮！杀！」',
            ],
            complete: {
              scene: '运河·战场',
              lines: [
                '你以海沙帮绝学击败血骨门水军统领！',
                '血骨门水军大败，仓皇逃窜！',
                '【海沙帮·门派任务链完结】',
                '你被授予「运河守护」称号，成为漕帮联盟的领袖人物！',
                '运河从此成为漕帮的天下，血骨门的势力被彻底驱逐！',
                '江湖水路，尽在掌控！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 青城派 · 青城剑影 ──────────────────────────────
  qingcheng: {
    name: '青城派',
    theme: '青城剑影 · 蜀中风云',
    chain: [
      {
        id: 'sect_qingcheng_1',
        icon: '⛰',
        name: '蜀中危机',
        desc: '青城派掌门余沧海紧急召见——玄冥教杀手潜入蜀中，暗杀青城派弟子，企图搅乱蜀中秩序。你需要查出玄冥教的真正目的。',
        type: 'talk',
        targetNpc: 'qingcheng_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_qingcheng_2',
        narrative: {
          accept: {
            scene: '青城派·掌门殿',
            bgChar: `
  ⛰  青  城  掌  门  殿  ⛰
  ════════════════════
  「玄冥教」
  「杀手潜入」`,
            lines: [
              '余沧海掌门面色阴沉：',
              '「玄冥教的杀手近日频繁出现在蜀中，我派已有三名弟子遇害。」',
              '「青城派地处蜀中，若任由玄冥教作乱，蜀中将永无宁日！」',
              '「你是青城弟子，此事便交给你。务必查出玄冥教的真正目的！」',
            ],
            tip: '调查玄冥教杀手潜入蜀中的目的',
          },
        },
      },
      {
        id: 'sect_qingcheng_2',
        icon: '🗡',
        name: '青城剑法',
        desc: '你追上玄冥教杀手，却发现自己功力不足。青城派四长老决定传授你青城派不传之秘「摧心掌」，增强你的实力！',
        type: 'dungeon',
        targetDungeon: 'dungeon_qingcheng_secret',
        reward: { exp: 600, contrib: 18, skill: 'qingcheng_cuixin' },
        rewardText: '经验+600 · 贡献+18 · 习得青城摧心掌',
        next: 'sect_qingcheng_3',
        narrative: {
          accept: {
            scene: '青城派·后山密室',
            bgChar: `
  ⛰  青  城  秘  传  ⛰
  ════════════════════
  「摧心掌」
  「不传之秘」`,
            lines: [
              '四长老将你引入后山密室：',
              '「你的剑法已有根基，但对付玄冥教杀手还差了些。」',
              '「今日传你青城派不传之秘——摧心掌！」',
              '「此掌法凌厉无比，足以与玄冥教高手一战！」',
            ],
            tip: '在后山密室接受四长老的传授',
          },
          complete: {
            scene: '青城派·后山',
            lines: [
              '你习得青城摧心掌，实力大增！',
              '「好！你已得我青城真传，足以与玄冥教高手一战！」',
              '「去吧，找出玄冥教的阴谋！」',
            ],
          },
        },
      },
      {
        id: 'sect_qingcheng_3',
        icon: '💀',
        name: '伏击玄冥',
        desc: '你发现玄冥教杀手正在青城山附近的一处山洞中密谋。你需要潜入山洞，探明他们的阴谋！',
        type: 'kill',
        targetNpcId: 'xuanming_assassin_qingcheng',
        targetName: '玄冥教刺客',
        targetCity: 'chengdu',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_qingcheng_4',
        narrative: {
          accept: {
            scene: '青城山·山洞入口',
            bgChar: `
  ⛰  玄  冥  密  谋  ⛰
  ════════════════════
  「青城山」
  「敌人巢穴」`,
            lines: [
              '你发现玄冥教刺客正在山洞中密谋——',
              '「青城派虽是小派，但占据蜀中要道。」',
              '「血骨门主说了，只要控制青城派，就能切断蜀中与中原的联系！」',
              '「杀光青城派的人，蜀中就是我们的了！」',
            ],
            tip: '潜入山洞，击败玄冥教刺客',
          },
          complete: {
            scene: '青城山·山洞',
            lines: [
              '你击败玄冥教刺客，发现了他们的完整计划——',
              '「原来如此！血骨门的野心不止青城派，而是整个蜀中！」',
              '「必须将此消息带回青城派，让正道各派提高警惕！」',
            ],
          },
        },
      },
      {
        id: 'sect_qingcheng_4',
        icon: '⛰',
        name: '青城威名',
        desc: '你将情报带回青城派，但玄冥教主力也已杀到！你需与掌门联手，击退玄冥教入侵，守护青城派！',
        type: 'kill',
        targetNpcId: 'xuanming_qingcheng_master',
        targetName: '玄冥教蜀中负责人',
        targetCity: 'chengdu',
        reward: { exp: 1000, contrib: 35, fame: 40, title: '青城侠客' },
        rewardText: '经验+1000 · 贡献+35 · 声望+40 · 称号：青城侠客',
        isFinal: true,
        narrative: {
          accept: {
            scene: '青城派·山门',
            bgChar: `
  ⛰  青  城  守  护  ⛰
  ════════════════════
  「守护青城」
  「绝不退缩」`,
            lines: [
              '玄冥教大军压境，直逼青城派山门！',
              '「青城派的蝼蚁！今日便是你们的末日！」',
              '余沧海掌门大喝：「青城弟子，随我御敌！」',
            ],
            complete: {
              scene: '青城派·山门',
              lines: [
                '你与掌门联手，击败玄冥教蜀中负责人！',
                '玄冥教大军溃败，仓皇逃出蜀中！',
                '【青城派·门派任务链完结】',
                '你被授予「青城侠客」称号，成为青城派的英雄！',
                '青城派威名远扬，血骨门在蜀中的势力被彻底清除！',
                '蜀中之地，从此太平！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 桃花岛 · 桃花迷阵 ──────────────────────────────
  taohua: {
    name: '桃花岛',
    theme: '桃花迷阵 · 东海传奇',
    chain: [
      {
        id: 'sect_taohua_1',
        icon: '🌸',
        name: '桃花奇遇',
        desc: '桃花岛主黄药师之女黄蓉神秘召见——她发现父亲近日行为古怪，似乎在暗中筹划什么。你需要帮她查明真相。',
        type: 'talk',
        targetNpc: 'taohua_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_taohua_2',
        narrative: {
          accept: {
            scene: '桃花岛·桃花林',
            bgChar: `
  🌸  桃  花  林  🌸
  ════════════════════
  「父亲异常」
  「暗中筹划」`,
            lines: [
              '黄蓉面色忧虑：',
              '「家父近日行为古怪，整日把自己关在密室中，似乎在研究什么。」',
              '「桃花岛与世隔绝，能让父亲如此上心的事，必定非同小可。」',
              '「你是桃花岛弟子，可愿帮我一探究竟？」',
            ],
            tip: '调查黄岛主在密室中的秘密',
          },
        },
      },
      {
        id: 'sect_taohua_2',
        icon: '📜',
        name: '密室之秘',
        desc: '你潜入黄药师的密室，发现他正在研究玄铁令的碎片！原来黄药师早已得到一块玄铁令碎片，正在研究如何破解其中的秘密！',
        type: 'collect',
        targetItem: 'iron_token_fragment',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_taohua_3',
        narrative: {
          accept: {
            scene: '桃花岛·密室',
            bgChar: `
  🌸  玄  铁  令  之  秘  🌸
  ════════════════════
  「上古神器」
  「隐藏玄机」`,
            lines: [
              '你潜入密室，发现黄药师正在研究一块古老的金属碎片——',
              '「这是……玄铁令？！」',
              '「原来父亲早已得到玄铁令碎片，正在研究其中的秘密！」',
            ],
            tip: '调查玄铁令碎片的秘密',
          },
          complete: {
            scene: '桃花岛·密室',
            lines: [
              '黄药师发现你潜入密室，却没有生气：',
              '「你既然看到了，我也不瞒你。这块玄铁令碎片，是我多年前偶然所得。」',
              '「但近日血骨门之乱，让我意识到，这块碎片或许能派上大用场。」',
              '「此事切记保密，不可外传！」',
            ],
          },
        },
      },
      {
        id: 'sect_taohua_3',
        icon: '⚔',
        name: '血骨追踪',
        desc: '血骨门似乎察觉到了桃花岛拥有玄铁令碎片，派出了追踪高手！你需要击退来犯之敌，保护玄铁令碎片！',
        type: 'kill',
        targetNpcId: 'blood_bone_tracker',
        targetName: '血骨门追踪者',
        targetCity: 'hangzhou',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_taohua_4',
        narrative: {
          accept: {
            scene: '桃花岛·岸边',
            bgChar: `
  🌸  血  骨  追  踪  🌸
  ════════════════════
  「玄铁令」
  「绝不能失」`,
            lines: [
              '血骨门追踪者潜入桃花岛！',
              '「玄铁令碎片就在岛上！血骨门志在必得！」',
              '「桃花岛的人，今日都要死！」',
            ],
            tip: '击退血骨门追踪者',
          },
          complete: {
            scene: '桃花岛·战场',
            lines: [
              '你击败血骨门追踪者，保护了玄铁令碎片！',
              '「血骨门的消息倒是灵通……看来我们的秘密已经暴露了。」',
              '「既然如此，是时候做出选择了。」',
            ],
          },
        },
      },
      {
        id: 'sect_taohua_4',
        icon: '🌸',
        name: '桃花决断',
        desc: '黄药师决定将玄铁令碎片交给正道联盟，与各派联手对抗血骨门。你作为桃花岛使者，需将碎片安全送达！',
        type: 'travel',
        targetCity: 'songshan',
        reward: { exp: 1000, contrib: 35, fame: 45, title: '桃花使者' },
        rewardText: '经验+1000 · 贡献+35 · 声望+45 · 称号：桃花使者',
        isFinal: true,
        narrative: {
          accept: {
            scene: '桃花岛·码头',
            bgChar: `
  🌸  桃  花  决  断  🌸
  ════════════════════
  「正道联盟」
  「共抗血骨」`,
            lines: [
              '黄药师将玄铁令碎片郑重交给你：',
              '「这块碎片留在桃花岛只会引来祸端，不如交给正道联盟，以抗血骨门。」',
              '「你是桃花岛的骄傲，此行务必小心！」',
            ],
            complete: {
              scene: '嵩山少林',
              lines: [
                '你将玄铁令碎片交到玄慈方丈手中！',
                '「桃花岛果然名不虚传！黄岛主高义，我正道联盟铭记在心！」',
                '【桃花岛·门派任务链完结】',
                '你被授予「桃花使者」称号，成为桃花岛与正道联盟的联络人！',
                '桃花岛正式加入抗血骨联盟，江湖格局再次改变！',
                '如今三块玄铁令碎片在手，只差最后一块……',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 点苍派 · 点苍剑派 ──────────────────────────────
  diancang: {
    name: '点苍派',
    theme: '点苍剑派 · 南诏风云',
    chain: [
      {
        id: 'sect_diancang_1',
        icon: '🏔',
        name: '南诏异变',
        desc: '点苍派掌门紧急召见——南诏国内发生政变，亲血骨门的势力上台，点苍派处境危险！你需要查明真相。',
        type: 'talk',
        targetNpc: 'diancang_elder',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_diancang_2',
        narrative: {
          accept: {
            scene: '点苍派·掌门室',
            bgChar: `
  🏔  点  苍  掌  门  室  🏔
  ════════════════════
  「南诏政变」
  「局势危急」`,
            lines: [
              '点苍派掌门面色凝重：',
              '「南诏国发生政变，亲血骨门的势力控制了朝政。」',
              '「点苍派地处南诏，若任由血骨门势力扩张，我们将首当其冲！」',
              '「你是点苍弟子，此事便交给你。务必查明真相！」',
            ],
            tip: '调查南诏政变的真相',
          },
        },
      },
      {
        id: 'sect_diancang_2',
        icon: '🗡',
        name: '点苍剑法',
        desc: '你潜入南诏王宫调查，发现血骨门已经渗透到了南诏朝廷。你需要提升实力，才能应对接下来的挑战。掌门决定传授你点苍派绝学。',
        type: 'dungeon',
        targetDungeon: 'dungeon_diancang_secret',
        reward: { exp: 600, contrib: 18, skill: 'diancang_sword' },
        rewardText: '经验+600 · 贡献+18 · 习得点苍剑法',
        next: 'sect_diancang_3',
        narrative: {
          accept: {
            scene: '点苍派·后山',
            bgChar: `
  🏔  点  苍  绝  学  🏔
  ════════════════════
  「点苍剑法」
  「名震西南」`,
            lines: [
              '掌门将你引入后山：',
              '「点苍剑法乃我派不传之秘，今日传于你。」',
              '「此剑法凌厉迅捷，最适合近身搏斗。」',
              '「学会此剑法，你便能在南诏来去自如！」',
            ],
            tip: '接受掌门传授点苍剑法',
          },
          complete: {
            scene: '点苍派·后山',
            lines: [
              '你习得点苍剑法，实力大增！',
              '「好！如今你已得我点苍真传，足以应对任何挑战！」',
              '「去吧，调查南诏政变的真相！」',
            ],
          },
        },
      },
      {
        id: 'sect_diancang_3',
        icon: '💀',
        name: '王宫暗战',
        desc: '你潜入南诏王宫，发现血骨门已控制了王宫侍卫。你需要击败王宫中的血骨门高手，揭露他们的阴谋！',
        type: 'kill',
        targetNpcId: 'blood_bone_nanzhao_agent',
        targetName: '血骨门南诏代理人',
        targetCity: 'dali',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_diancang_4',
        narrative: {
          accept: {
            scene: '南诏·王宫',
            bgChar: `
  🏔  王  宫  暗  战  🏔
  ════════════════════
  「血骨门」
  「渗透王宫」`,
            lines: [
              '你潜入王宫，发现血骨门已经控制了侍卫——',
              '「血骨门的计划很快就能实现了！」',
              '「南诏将永远成为血骨门的傀儡！」',
              '「绝不能让他们得逞！」',
            ],
            tip: '击败血骨门南诏代理人',
          },
          complete: {
            scene: '南诏·王宫',
            lines: [
              '你击败血骨门代理人，发现了他们的完整计划——',
              '「原来血骨门打算以南诏为跳板，进攻中原！」',
              '「必须将此消息带回点苍派，通知正道各派！」',
            ],
          },
        },
      },
      {
        id: 'sect_diancang_4',
        icon: '🏔',
        name: '点苍雄风',
        desc: '你将情报带回点苍派，但血骨门追兵也杀到了！你需与掌门联手，击退追兵，守护点苍派！',
        type: 'kill',
        targetNpcId: 'blood_bone_diancang_master',
        targetName: '血骨门西南统领',
        targetCity: 'dali',
        reward: { exp: 1000, contrib: 35, fame: 40, title: '点苍侠客' },
        rewardText: '经验+1000 · 贡献+35 · 声望+40 · 称号：点苍侠客',
        isFinal: true,
        narrative: {
          accept: {
            scene: '点苍派·山门',
            bgChar: `
  🏔  点  苍  雄  风  🏔
  ════════════════════
  「守护点苍」
  「绝不让步」`,
            lines: [
              '血骨门大军压境！',
              '「点苍派的蝼蚁！竟敢坏血骨门的大事！」',
              '「今日，血洗点苍派！」',
              '掌门大喝：「点苍弟子，随我御敌！」',
            ],
            complete: {
              scene: '点苍派·战场',
              lines: [
                '你与掌门联手，击败血骨门西南统领！',
                '血骨门大军溃败，点苍派威名远扬！',
                '【点苍派·门派任务链完结】',
                '你被授予「点苍侠客」称号，成为点苍派的英雄！',
                '点苍派在南诏站稳脚跟，血骨门在西南的势力被削弱！',
                '西南之地，暂得安宁！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 西夏秘宗 · 西夏一品堂 ──────────────────────────────
  xixia: {
    name: '西夏秘宗',
    theme: '西夏秘宗 · 一品堂威',
    chain: [
      {
        id: 'sect_xixia_1',
        icon: '🐴',
        name: '一品堂令',
        desc: '西夏一品堂首座秘密召见——血骨门试图拉拢西夏秘宗，许诺大量好处。你需要查明血骨门的真正意图。',
        type: 'talk',
        targetNpc: 'xixia_lawking',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_xixia_2',
        narrative: {
          accept: {
            scene: '西夏秘宗·一品堂',
            bgChar: `
  🐴  西  夏  一  品  堂  🐴
  ════════════════════
  「血骨门」
  「拉拢秘宗」`,
            lines: [
              '一品堂首座面色严峻：',
              '「血骨门派人来了，许诺金银美女，要我西夏秘宗加入三魔联盟。」',
              '「但我总觉得此事没那么简单……血骨门向来言而无信。」',
              '「你是秘宗弟子，此事便交给你暗中调查。」',
            ],
            tip: '暗中调查血骨门拉拢西夏秘宗的真正目的',
          },
        },
      },
      {
        id: 'sect_xixia_2',
        icon: '📜',
        name: '密函秘密',
        desc: '你截获了血骨门给西夏秘宗教主的密函，发现血骨门的真正目的是借道西夏，从西部包抄中原正道联盟！',
        type: 'collect',
        targetItem: 'xixia_secret_letter',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_xixia_3',
        narrative: {
          accept: {
            scene: '西夏秘宗·密室',
            bgChar: `
  🐴  血  骨  阴  谋  🐴
  ════════════════════
  「借道西夏」
  「包抄中原」`,
            lines: [
              '你截获了血骨门的密函——',
              '「若西夏秘宗配合，血骨门将协助其统一西域武林，事成之后，西域归秘宗，中原归血骨门。」',
              '「好大的野心！原来血骨门想借道西夏，从西部包抄中原！」',
            ],
            tip: '截获并分析血骨门密函',
          },
          complete: {
            scene: '西夏秘宗·一品堂',
            lines: [
              '一品堂首座看完密函，怒不可遏：',
              '「血骨门竟敢把西夏秘宗当成棋子！」',
              '「既然他们不仁，休怪我们不义！」',
              '「此事必须尽快通知正道联盟！」',
            ],
          },
        },
      },
      {
        id: 'sect_xixia_3',
        icon: '⚔',
        name: '西域联盟',
        desc: '西夏秘宗决定联合西域各派，共同对抗血骨门。你需要代表秘宗，出使西域各国，组建西域联盟！',
        type: 'travel',
        targetCity: 'xixia',
        reward: { exp: 600, contrib: 18, rel_sect: 'tianshan', rel_val: 15 },
        rewardText: '经验+600 · 贡献+18 · 天山好感+15',
        next: 'sect_xixia_4',
        narrative: {
          accept: {
            scene: '西夏秘宗·议事厅',
            bgChar: `
  🐴  西  域  联  盟  🐴
  ════════════════════
  「联合西域」
  「共抗血骨」`,
            lines: [
              '一品堂首座决定联合西域各派：',
              '「天山派、逍遥派、昆仑派……西域各派都是我们的潜在盟友。」',
              '「你去联络各派，组建西域联盟，共同对抗血骨门！」',
              '「记住——西域虽小，但团结起来，就是一股不可忽视的力量！」',
            ],
            tip: '出使西域各国，组建西域联盟',
          },
          complete: {
            scene: '天山·缥缈峰',
            lines: [
              '天山童姥听完你的来意，点头道：',
              '「血骨门野心勃勃，若让他们得逞，西域将永无宁日。」',
              '「西夏秘宗的好意，天山派领了。从今日起，西域各派联手，共同抗敌！」',
            ],
          },
        },
      },
      {
        id: 'sect_xixia_4',
        icon: '🐴',
        name: '一品绝杀',
        desc: '西域联盟成立，但血骨门不会善罢甘休！你需要击败血骨门在西域的势力，确立西域联盟的威信！',
        type: 'kill',
        targetNpcId: 'blood_bone_west_general',
        targetName: '血骨门西域大将军',
        targetCity: 'xixia',
        reward: { exp: 1000, contrib: 35, fame: 40, title: '一品堂高手' },
        rewardText: '经验+1000 · 贡献+35 · 声望+40 · 称号：一品堂高手',
        isFinal: true,
        narrative: {
          accept: {
            scene: '西域·战场',
            bgChar: `
  🐴  西  域  大  战  🐴
  ════════════════════
  「西域联盟」
  「威震四方」`,
            lines: [
              '血骨门西域大将军率军而来！',
              '「西夏秘宗的叛徒！今日就让你们知道，背叛血骨门的下场！」',
              '「西域联盟，绝不退缩！为了西域的和平，杀！」',
            ],
            complete: {
              scene: '西域·战场',
              lines: [
                '你以一品堂绝学击败血骨门西域大将军！',
                '血骨门西域大军溃败！',
                '【西夏秘宗·门派任务链完结】',
                '你被授予「一品堂高手」称号，成为西夏秘宗的英雄！',
                '西域联盟声威大振，血骨门在西域的势力被彻底清除！',
                '从西部包抄中原的计划，彻底破产！',
              ],
            },
          },
        },
      },
    ],
  },

  // ── 天龙帮 · 天龙八部 ──────────────────────────────
  tianlong: {
    name: '天龙帮',
    theme: '天龙八部 · 江湖义气',
    chain: [
      {
        id: 'sect_tianlong_1',
        icon: '🐉',
        name: '天龙危机',
        desc: '天龙帮帮主紧急召见——血骨门势力扩张到了天龙帮的地盘，要求天龙帮归附，否则将血洗天龙帮。你需要找出对策。',
        type: 'talk',
        targetNpc: 'tianlong_boss',
        reward: { exp: 300, contrib: 10 },
        rewardText: '经验+300 · 门派贡献+10',
        next: 'sect_tianlong_2',
        narrative: {
          accept: {
            scene: '天龙帮·总舵',
            bgChar: `
  🐉  天  龙  总  舵  🐉
  ════════════════════
  「血骨门」
  「来势汹汹」`,
            lines: [
              '天龙帮帮主面色凝重：',
              '「血骨门派人来了，要我们天龙帮归附他们。」',
              '「天龙帮讲的是江湖义气，岂能屈从于血骨门这种邪道？」',
              '「但血骨门势大，硬拼不是办法。你可有良策？」',
            ],
            tip: '接受帮主的询问，商讨对策',
          },
        },
      },
      {
        id: 'sect_tianlong_2',
        icon: '⚔',
        name: '江湖义气',
        desc: '你建议联合江湖中的其他义气帮派，共同对抗血骨门。帮主命你前往各地，联络江湖好汉！',
        type: 'travel',
        targetCity: 'luoyang',
        reward: { exp: 500, contrib: 15 },
        rewardText: '经验+500 · 贡献+15',
        next: 'sect_tianlong_3',
        narrative: {
          accept: {
            scene: '天龙帮·山门',
            bgChar: `
  🐉  联  合  江  湖  🐉
  ════════════════════
  「江湖义气」
  「共抗血骨」`,
            lines: [
              '帮主点头：「江湖之大，义气之士众多。」',
              '「若能联合各路英雄，血骨门也不足为惧。」',
              '「你去洛阳、开封等地，联络各路江湖好汉！」',
            ],
            tip: '联络江湖各路好汉',
          },
          complete: {
            scene: '洛阳·英雄会',
            lines: [
              '各路江湖好汉齐聚洛阳，共商抗敌大计！',
              '「血骨门作恶多端，早就该被剿灭！」',
              '「天龙帮牵头，我们愿意追随！」',
              '江湖义士联盟正式成立！',
            ],
          },
        },
      },
      {
        id: 'sect_tianlong_3',
        icon: '💀',
        name: '义士伏魔',
        desc: '江湖义士联盟成立后，血骨门派出了高手！你需要击败血骨门高手，证明江湖义士联盟的实力！',
        type: 'kill',
        targetNpcId: 'blood_bone_assassin_leader',
        targetName: '血骨门刺客首领',
        targetCity: 'kaifeng',
        reward: { exp: 700, contrib: 22 },
        rewardText: '经验+700 · 贡献+22',
        next: 'sect_tianlong_4',
        narrative: {
          accept: {
            scene: '开封·城外',
            bgChar: `
  🐉  江  湖  义  士  🐉
  ════════════════════
  「义字当头」
  「绝不退缩」`,
            lines: [
              '血骨门刺客首领率人截杀！',
              '「江湖草莽，也敢对抗血骨门？」',
              '「今日让你们知道，什么叫以卵击石！」',
              '各路义士严阵以待：「为了江湖正义，杀！」',
            ],
            tip: '击败血骨门刺客首领',
          },
          complete: {
            scene: '开封·城外',
            lines: [
              '你击败血骨门刺客首领！',
              '「痛快！江湖义士，果然名不虚传！」',
              '「血骨门也不过如此！」',
              '江湖义士联盟声威大振！',
            ],
          },
        },
      },
      {
        id: 'sect_tianlong_4',
        icon: '🐉',
        name: '天龙雄风',
        desc: '血骨门派出了更强的敌人——血骨门副门主！你需要与各路义士联手，击败这位强敌，彻底打垮血骨门在中原的势力！',
        type: 'kill',
        targetNpcId: 'blood_bone_vice_master',
        targetName: '血骨门副门主',
        targetCity: 'kaifeng',
        reward: { exp: 1200, contrib: 45, fame: 50, title: '天龙八部' },
        rewardText: '经验+1200 · 贡献+45 · 声望+50 · 称号：天龙八部',
        isFinal: true,
        narrative: {
          accept: {
            scene: '开封·最终战场',
            bgChar: `
  🐉  天  龙  决  战  🐉
  ════════════════════
  「天龙八部」
  「义薄云天」`,
            lines: [
              '血骨门副门主亲自出马！',
              '「一群江湖草莽，也敢阻挡血骨门的大业？」',
              '「今日，就让你们见识见识，什么叫真正的实力！」',
              '各路义士齐声高喊：「为了江湖正义，虽死无悔！」',
            ],
            complete: {
              scene: '开封·战场',
              lines: [
                '你与各路义士联手，终于击败血骨门副门主！',
                '血骨门大军溃败！',
                '【天龙帮·门派任务链完结】',
                '你被授予「天龙八部」称号，成为江湖义士联盟的盟主！',
                '江湖义士联盟威震四方，血骨门在中原的势力被彻底动摇！',
                '江湖路远，义字当头！',
              ],
            },
          },
        },
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════
//  门派任务链状态存取
//  存在 localStorage 的 wuxia_sect_chains 中
// ═══════════════════════════════════════════════════════════

function getSectChainState() {
  try { return JSON.parse(localStorage.getItem('wuxia_sect_chains') || '{}'); }
  catch (e) { return {}; }
}

function saveSectChainState(data) {
  localStorage.setItem('wuxia_sect_chains', JSON.stringify(data));
}

function getSectChainProgress(sectId) {
  const state = getSectChainState();
  if (!state[sectId]) {
    return { currentStep: 0, completed: false };
  }
  return state[sectId];
}

function getCurrentSectChainQuest(sectId) {
  const sectChain = SECT_CHAINS[sectId];
  if (!sectChain) return null;
  const progress = getSectChainProgress(sectId);
  if (progress.completed || progress.currentStep >= sectChain.chain.length) return null;
  return sectChain.chain[progress.currentStep];
}

function advanceSectChain(sectId) {
  const sectChain = SECT_CHAINS[sectId];
  if (!sectChain) return false;
  
  const state = getSectChainState();
  const current = state[sectId] || { currentStep: 0, completed: false };
  
  current.currentStep++;
  
  // 检查是否完成整个任务链
  if (current.currentStep >= sectChain.chain.length) {
    current.completed = true;
  }
  
  state[sectId] = current;
  saveSectChainState(state);
  return true;
}

function isSectChainCompleted(sectId) {
  const state = getSectChainState();
  return state[sectId]?.completed === true;
}

// 检查门派任务链是否已解锁
function isSectChainUnlocked(sectId, playerSect) {
  if (playerSect !== sectId) return false;
  // 需要是门派成员才能接取任务链
  return true;
}

// 获取门派任务链的当前阶段
function getSectChainStep(sectId) {
  const progress = getSectChainProgress(sectId);
  return progress.currentStep + 1; // 从1开始计数
}

// 获取门派任务链总数
function getSectChainTotal(sectId) {
  const sectChain = SECT_CHAINS[sectId];
  return sectChain ? sectChain.chain.length : 0;
}

// 触发门派任务链对话
function triggerSectChainTalk(sectId) {
  const quest = getCurrentSectChainQuest(sectId);
  if (!quest) return;
  
  if (quest.type === 'talk' && quest.narrative?.accept) {
    showNarrativeDialog(quest.narrative.accept, () => {
      advanceSectChain(sectId);
      showToast(`📜 任务推进：${quest.name}`);
    });
  }
}

// 显示叙事对话框
function showNarrativeDialog(narrative, onComplete) {
  const { scene, bgChar, lines = [], tip = '' } = narrative;
  
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  dialog.innerHTML = `
    <div style="
      width: 90%;
      max-width: 600px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid #c9a227;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 0 40px rgba(201, 162, 39, 0.3);
      font-family: 'Microsoft YaHei', sans-serif;
    ">
      <div style="
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 8px;
      ">📍 ${scene || '未知地点'}</div>
      
      <pre style="
        font-family: monospace;
        font-size: 11px;
        color: #c9a227;
        background: rgba(0,0,0,0.3);
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 16px;
        white-space: pre-wrap;
        text-align: center;
      ">${bgChar || ''}</pre>
      
      <div id="narrativeLines" style="color: #e0e0e0; line-height: 1.8; font-size: 14px;">
        ${lines.map((line, i) => `<p style="margin: 8px 0; animation: fadeIn 0.3s ease ${i * 0.3}s both">${line}</p>`).join('')}
      </div>
      
      ${tip ? `
        <div style="
          margin-top: 16px;
          padding: 10px;
          background: rgba(201, 162, 39, 0.1);
          border-left: 3px solid #c9a227;
          font-size: 12px;
          color: #c9a227;
        ">💡 提示：${tip}</div>
      ` : ''}
      
      <button id="narrativeContinueBtn" style="
        width: 100%;
        margin-top: 20px;
        padding: 12px;
        background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%);
        border: none;
        border-radius: 8px;
        color: #1a1a2e;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
      ">继续</button>
    </div>
    
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  `;
  
  document.body.appendChild(dialog);
  
  const btn = dialog.querySelector('#narrativeContinueBtn');
  btn.addEventListener('click', () => {
    dialog.remove();
    if (onComplete) onComplete();
  });
  
  // 点击背景也可关闭
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.remove();
      if (onComplete) onComplete();
    }
  });
}

// 获取门派任务链渲染HTML
function renderSectChainStatus(sectId) {
  const sectChain = SECT_CHAINS[sectId];
  if (!sectChain) return '';
  
  const progress = getSectChainProgress(sectId);
  const currentStep = progress.currentStep + 1;
  const total = sectChain.chain.length;
  const completed = progress.completed;
  
  if (completed) {
    return `
      <div style="
        padding: 12px;
        background: rgba(201, 162, 39, 0.1);
        border: 1px solid rgba(201, 162, 39, 0.3);
        border-radius: 8px;
        text-align: center;
      ">
        <div style="font-size: 14px; color: #c9a227;">✦ ${sectChain.name} · 任务链已完成 ✦</div>
        <div style="font-size: 12px; color: #888; margin-top: 4px;">${sectChain.theme}</div>
      </div>
    `;
  }
  
  const currentQuest = sectChain.chain[progress.currentStep];
  if (!currentQuest) return '';
  
  return `
    <div style="
      padding: 12px;
      background: rgba(0, 100, 200, 0.1);
      border: 1px solid rgba(0, 150, 255, 0.3);
      border-radius: 8px;
    ">
      <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
        ⚔ ${sectChain.name} · 任务链
      </div>
      <div style="font-size: 10px; color: #666; margin-bottom: 6px;">
        进度：第 ${currentStep} / ${total} 阶段
      </div>
      <div style="
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        overflow: hidden;
      ">
        <div style="
          height: 100%;
          width: ${(currentStep / total) * 100}%;
          background: linear-gradient(90deg, #0096ff, #00d4ff);
          transition: width 0.3s;
        "></div>
      </div>
      <div style="margin-top: 10px;">
        <div style="font-size: 13px; color: #00d4ff;">${currentQuest.icon} ${currentQuest.name}</div>
        <div style="font-size: 11px; color: #888; margin-top: 4px;">${(currentQuest.desc||'').slice(0, 50)}…</div>
      </div>
    </div>
  `;
}
