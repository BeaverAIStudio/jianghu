// data-manuals.js — 武学秘籍数据库
// 秘籍是玩家永久解锁更多技能的途径，通过战斗掉落/任务奖励/NPC购买获取
// ════════════════════════════════════════════════

// ── 稀有度定义 ──
const MANUAL_RARITY = {
  fragment: { label:'残卷',  color:'#a0a0a0', icon:'📜', glow:'',         techSkills:1 },
  partial:  { label:'残本',  color:'#60cc60', icon:'📗', glow:'glow-grn', techSkills:2 },
  complete: { label:'完本',  color:'#4098ff', icon:'📘', glow:'glow-blu', techSkills:3 },
  rare:     { label:'孤本',  color:'#c860ff', icon:'📙', glow:'glow-pur', techSkills:4 },
  legendary:{ label:'绝世秘典', color:'#ffb030', icon:'📕', glow:'glow-gld', techSkills:5 },
};

// ── 武学秘籍总库 MANUAL_DB ──
// 字段：id / name / rarity / school / desc / flavor（口味文字）
//       skills：解锁的技能ID列表（按难度排）
//       reqLv：最低等级要求
//       reqProf：所需熟练度档位名（可选）
//       reqSect：所需门派ID（可选，null=无限制）
//       dropWeight：掉落权重（用于战斗随机）
const MANUAL_DB = {

  // ═════════════ 剑系 ═════════════
  'm_sw_frag1': {
    id:'m_sw_frag1', name:'剑法基础残卷', rarity:'fragment', school:'剑系',
    desc:'一页残缺的剑法手册，记载着两式基础招法。',
    flavor:'纸张泛黄，墨迹模糊，但招式依稀可辨。',
    skills:['sw01'], reqLv:5, dropWeight:20, reqSect:'huashan' },
  'm_sw_partial1': {
    id:'m_sw_partial1', name:'剑宗秘要残本', rarity:'partial', school:'剑系',
    desc:'剑宗流传的入门功法，记载了两式犀利剑招。',
    flavor:'封面印有"剑宗"二字，不知何处流出。',
    skills:['sw02','sw03'], reqLv:12, dropWeight:10,
    reqSect:'huashan' },
  'm_sw_complete1': {
    id:'m_sw_complete1', name:'御风剑典完本', rarity:'complete', school:'剑系',
    desc:'完整的剑法典籍，囊括三式进阶剑招，气势磅礴。',
    flavor:'书脊工整，应是某大派典藏。',
    skills:['sw04','sw05','sw06'], reqLv:25, reqProf:'大成', dropWeight:4,
    reqSect:'huashan' },
  'm_sw_rare1': {
    id:'m_sw_rare1', name:'天下剑谱孤本', rarity:'rare', school:'剑系',
    desc:'江湖上绝迹多年的剑法孤本，记载四式登峰之招，得之者可称剑道宗师。',
    flavor:'据传仅此一册，曾引多少英雄血染江湖。',
    skills:['sw07','sw08','sw09','sw10'], reqLv:40, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'huashan' },
  'm_sw_legendary': {
    id:'m_sw_legendary', name:'独孤剑典', rarity:'legendary', school:'剑系',
    desc:'绝世剑道的巅峰著作，五式无上剑招，足以傲视天下。',
    flavor:'此书传说由剑道宗祖亲笔所书，字字如剑气。',
    skills:['sw_l1','sw06','sw07','sw09','sw10'], reqLv:55, reqProf:'登峰造极', dropWeight:0,
    reqSect:'huashan' },

  // ═════════════ 佛系 ═════════════
  'm_bd_frag1': {
    id:'m_bd_frag1', name:'少林入门残卷', rarity:'fragment', school:'佛系',
    desc:'一页出自少林寺的武功入门残页。',
    flavor:'上有梵文注释，显然出自佛门手笔。',
    skills:['bd01'], reqLv:5, reqSect:'shaolin', dropWeight:15,
  },
  'm_bd_partial1': {
    id:'m_bd_partial1', name:'罗汉拳残本', rarity:'partial', school:'佛系',
    desc:'少林七十二绝技之一的残本，记载两式护体功法。',
    flavor:'封面残破，内有"南无阿弥陀佛"水印。',
    skills:['bd02','bd03'], reqLv:15, dropWeight:8,
    reqSect:'shaolin' },
  'm_bd_complete1': {
    id:'m_bd_complete1', name:'金刚经完本', rarity:'complete', school:'佛系',
    desc:'完整的金刚护体功法，三式佛门绝学，以守为攻。',
    flavor:'纸张如金，佛光隐隐，有灵性之感。',
    skills:['bd04','bd05','bd06'], reqLv:28, reqProf:'大成', dropWeight:3,
    reqSect:'shaolin' },
  'm_bd_rare1': {
    id:'m_bd_rare1', name:'大藏经孤本', rarity:'rare', school:'佛系',
    desc:'传说中少林镇寺之宝，藏有四式无上佛法武功。',
    flavor:'每翻一页，似有梵音入耳，心神安定。',
    skills:['bd07','bd08','bd09','bd10'], reqLv:45, reqProf:'炉火纯青', reqSect:'shaolin', dropWeight:0,
  },

  // ═════════════ 道系 ═════════════
  'm_ta_frag1': {
    id:'m_ta_frag1', name:'太极基础残卷', rarity:'fragment', school:'道系',
    desc:'武当太极拳的入门残页，以柔克刚之道初现端倪。',
    flavor:'纸上隐隐有道香，想是武当之物。',
    skills:['ta01'], reqLv:5, dropWeight:18,
    reqSect:'wudang' },
  'm_ta_partial1': {
    id:'m_ta_partial1', name:'道门心法残本', rarity:'partial', school:'道系',
    desc:'道门内功心法的残卷，记载两式以柔制刚的妙法。',
    flavor:'道法自然，此书亦然。',
    skills:['ta02','ta03'], reqLv:14, dropWeight:9,
    reqSect:'wudang' },
  'm_ta_complete1': {
    id:'m_ta_complete1', name:'玄真道经完本', rarity:'complete', school:'道系',
    desc:'道家内功完整典籍，三式玄妙功法，身轻如燕。',
    flavor:'书中图文并茂，道理深邃，非老道不能参透。',
    skills:['ta04','ta05','ta06'], reqLv:26, reqProf:'大成', dropWeight:4,
    reqSect:'wudang' },
  'm_ta_rare1': {
    id:'m_ta_rare1', name:'九天玄经孤本', rarity:'rare', school:'道系',
    desc:'道家至高功法孤本，四式天人合一之术，得道者方能参悟。',
    flavor:'此书在手，恍若置身云端，俗世喧嚣尽消。',
    skills:['ta07','ta08','ta09','ta10'], reqLv:42, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'wudang' },

  // ═════════════ 力系 ═════════════
  'm_fo_frag1': {
    id:'m_fo_frag1', name:'霸拳残卷', rarity:'fragment', school:'力系',
    desc:'以力碾压一切的蛮拳入门残页。',
    flavor:'纸张极厚，字迹粗犷有力。',
    skills:['fo01'], reqLv:5, dropWeight:20,
  },
  'm_fo_partial1': {
    id:'m_fo_partial1', name:'铁血拳谱残本', rarity:'partial', school:'力系',
    desc:'以蛮力取胜的拳谱残本，记载两式狂暴技法。',
    flavor:'据说此书被一猛汉磨损，仍可辨认。',
    skills:['fo02','fo03'], reqLv:14, dropWeight:10,
  },
  'm_fo_complete1': {
    id:'m_fo_complete1', name:'震山拳法完本', rarity:'complete', school:'力系',
    desc:'大力金刚的完整拳法，三式山岳般的打击。',
    flavor:'书页厚重如铁板，常人翻阅都费力。',
    skills:['fo04','fo05','fo06'], reqLv:24, reqProf:'大成', dropWeight:4,
  },
  'm_fo_rare1': {
    id:'m_fo_rare1', name:'万力金刚孤本', rarity:'rare', school:'力系',
    desc:'力道宗师的绝世功法，四式足以撼山裂地。',
    flavor:'此书据传以千斤金铁写就，得者无不力量倍增。',
    skills:['fo07','fo08','fo09','fo10'], reqLv:40, reqProf:'炉火纯青', dropWeight:1,
  },

  // ═════════════ 暗系 ═════════════
  'm_sh_frag1': {
    id:'m_sh_frag1', name:'夜行残卷', rarity:'fragment', school:'暗系',
    desc:'一页不知出处的暗器入门残页，教人以快制敌。',
    flavor:'字迹细小，需凑近方能辨认。',
    skills:['sh01'], reqLv:6, dropWeight:16,
    reqSect:'tangmen' },
  'm_sh_partial1': {
    id:'m_sh_partial1', name:'影刺残本', rarity:'partial', school:'暗系',
    desc:'影杀门的暗刺功法，快、准、狠。',
    flavor:'据传此书只在影杀门内流传，怎会流出？',
    skills:['sh02','sh03'], reqLv:16, dropWeight:7,
    reqSect:'tangmen' },
  'm_sh_complete1': {
    id:'m_sh_complete1', name:'鬼影步法完本', rarity:'complete', school:'暗系',
    desc:'鬼魅般的身法完整教程，三式让人如入暗夜之境。',
    flavor:'封面空白无字，内页却藏机无数。',
    skills:['sh04','sh05','sh06'], reqLv:28, reqProf:'大成', dropWeight:3,
    reqSect:'tangmen' },
  'm_sh_rare1': {
    id:'m_sh_rare1', name:'影魔心法孤本', rarity:'rare', school:'暗系',
    desc:'暗夜魔头的绝世心法，四式出神入化的暗杀绝技。',
    flavor:'此书通体黝黑，在夜间几乎隐形，与书中功法相合。',
    skills:['sh07','sh08','sh09','sh10'], reqLv:43, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'tangmen' },

  // ═════════════ 毒系 ═════════════
  'm_po_frag1': {
    id:'m_po_frag1', name:'五毒入门残卷', rarity:'fragment', school:'毒系',
    desc:'五毒教的基础用毒残页，初窥毒术门径。',
    flavor:'书页上还留有淡淡的毒气，需小心翻阅。',
    skills:['po01'], reqLv:7, dropWeight:14,
    reqSect:'diancang' },
  'm_po_partial1': {
    id:'m_po_partial1', name:'蛊毒秘法残本', rarity:'partial', school:'毒系',
    desc:'苗疆蛊毒的两式绝技，令人闻风丧胆。',
    flavor:'书中夹有一枚干枯的蜈蚣，触目惊心。',
    skills:['po02','po03'], reqLv:17, dropWeight:6,
    reqSect:'diancang' },
  'm_po_complete1': {
    id:'m_po_complete1', name:'千毒手完本', rarity:'complete', school:'毒系',
    desc:'以毒入功的完整心法，三式毒功令人防不胜防。',
    flavor:'字字如蛇，读之令人头皮发麻。',
    skills:['po04','po05','po06'], reqLv:30, reqProf:'大成', dropWeight:3,
    reqSect:'diancang' },
  'm_po_rare1': {
    id:'m_po_rare1', name:'万毒不侵孤本', rarity:'rare', school:'毒系',
    desc:'毒道宗师的绝世著作，四式以毒克万物的至高功法。',
    flavor:'据传持书者，天下毒物皆不可近身。',
    skills:['po07','po08','po09','po10'], reqLv:44, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'diancang' },

  // ═════════════ 冰系 ═════════════
  'm_ic_frag1': {
    id:'m_ic_frag1', name:'寒冰入门残卷', rarity:'fragment', school:'冰系',
    desc:'北方冰功的入门残页，初学者可借此感悟冰之寒意。',
    flavor:'书页冰凉，似有冰气残留。',
    skills:['ic01'], reqLv:6, dropWeight:16,
    reqSect:'tianshan' },
  'm_ic_partial1': {
    id:'m_ic_partial1', name:'玄冥冰功残本', rarity:'partial', school:'冰系',
    desc:'玄冥神掌附带的冰功残本，两式让敌人动弹不得。',
    flavor:'触之如握冰块，不知如何保存至今。',
    skills:['ic02','ic03'], reqLv:16, dropWeight:7,
    reqSect:'tianshan' },
  'm_ic_complete1': {
    id:'m_ic_complete1', name:'天山冰心完本', rarity:'complete', school:'冰系',
    desc:'天山逍遥派的冰功完整典籍，三式绝寒之法。',
    flavor:'书中附有冰雪之地的绘图，极尽壮阔。',
    skills:['ic04','ic05','ic06'], reqLv:27, reqProf:'大成', dropWeight:3,
    reqSect:'tianshan' },
  'm_ic_rare1': {
    id:'m_ic_rare1', name:'北冥冰典孤本', rarity:'rare', school:'冰系',
    desc:'北方冰道宗师的绝世孤本，四式冰天雪地之法，令人胆寒。',
    flavor:'此书出世之日，据传方圆百里冰封三尺。',
    skills:['ic07','ic08','ic09','ic10'], reqLv:42, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'tianshan' },

  // ═════════════ 火系 ═════════════
  'm_fi_frag1': {
    id:'m_fi_frag1', name:'炎拳入门残卷', rarity:'fragment', school:'火系',
    desc:'明教火功的入门残页，一股热意扑面而来。',
    flavor:'书页微微发烫，字迹如火焰流动。',
    skills:['fi01'], reqLv:6, dropWeight:17,
    reqSect:'mingjiao' },
  'm_fi_partial1': {
    id:'m_fi_partial1', name:'烈火心法残本', rarity:'partial', school:'火系',
    desc:'以火为兵的残本，两式攻守兼备的火焰功法。',
    flavor:'据说此书在水中浸泡七日后自行干燥，不可思议。',
    skills:['fi02','fi03'], reqLv:15, dropWeight:8,
    reqSect:'mingjiao' },
  'm_fi_complete1': {
    id:'m_fi_complete1', name:'圣火令功法完本', rarity:'complete', school:'火系',
    desc:'明教圣火令附带的完整火功，三式烈焰如龙。',
    flavor:'明教圣物之一，流传千年，灵气不减。',
    skills:['fi04','fi05','fi06'], reqLv:26, reqProf:'大成', dropWeight:3,
    reqSect:'mingjiao' },
  'm_fi_rare1': {
    id:'m_fi_rare1', name:'焚天火典孤本', rarity:'rare', school:'火系',
    desc:'火道极境的绝世孤本，四式足以焚天煮海。',
    flavor:'此书据说以龙涎制成，永不自燃，却能引人体内真火。',
    skills:['fi07','fi08','fi09','fi10'], reqLv:41, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'mingjiao' },

  // ═════════════ 雷系 ═════════════
  'm_th_frag1': {
    id:'m_th_frag1', name:'雷击残卷', rarity:'fragment', school:'雷系',
    desc:'雷霆功法的入门残页，刚猛异常。',
    flavor:'字迹龙飞凤舞，如雷鸣般有力。',
    skills:['th01'], reqLv:7, dropWeight:15,
    reqSect:'kongtong' },
  'm_th_partial1': {
    id:'m_th_partial1', name:'天雷功残本', rarity:'partial', school:'雷系',
    desc:'以雷法为核心的两式绝技残本。',
    flavor:'翻阅此书时似有静电感，令人不敢大意。',
    skills:['th02','th03'], reqLv:16, dropWeight:7,
    reqSect:'kongtong' },
  'm_th_complete1': {
    id:'m_th_complete1', name:'九天雷典完本', rarity:'complete', school:'雷系',
    desc:'传说中的雷法完典，三式天雷功法，威力惊人。',
    flavor:'此书每逢雷雨天气便会自动散发雷光，奇异无比。',
    skills:['th04','th05','th06'], reqLv:28, reqProf:'大成', dropWeight:3,
    reqSect:'kongtong' },
  'm_th_rare1': {
    id:'m_th_rare1', name:'轰天霹雳孤本', rarity:'rare', school:'雷系',
    desc:'雷道宗师的绝世心法，四式轰天之雷，令敌魂飞魄散。',
    flavor:'书中所载功法，据传每用一次便有雷光入体，非大毅力者不可修习。',
    skills:['th07','th08','th09','th10'], reqLv:43, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'kongtong' },

  // ═════════════ 风系 ═════════════
  'm_wi_frag1': {
    id:'m_wi_frag1', name:'风行残卷', rarity:'fragment', school:'风系',
    desc:'轻功入门残页，如风般的身法初现。',
    flavor:'书页轻薄如蝉翼，翻阅时会随风飘动。',
    skills:['wi01'], reqLv:5, dropWeight:18,
    reqSect:'xiaoyao' },
  'm_wi_partial1': {
    id:'m_wi_partial1', name:'御风轻功残本', rarity:'partial', school:'风系',
    desc:'御风而行的轻功两式，如幻似梦。',
    flavor:'此书当年被某逍遥派弟子遗失，辗转流入江湖。',
    skills:['wi02','wi03'], reqLv:13, dropWeight:9,
    reqSect:'xiaoyao' },
  'm_wi_complete1': {
    id:'m_wi_complete1', name:'天风步法完本', rarity:'complete', school:'风系',
    desc:'以风为道的完整步法，三式飘若神仙之功。',
    flavor:'书中绘有行云流水之图，读之令人心旷神怡。',
    skills:['wi04','wi05','wi06'], reqLv:25, reqProf:'大成', dropWeight:4,
    reqSect:'xiaoyao' },
  'm_wi_rare1': {
    id:'m_wi_rare1', name:'风魔绝技孤本', rarity:'rare', school:'风系',
    desc:'风道极境的孤本，四式如风如影，令人捉摸不透。',
    flavor:'此书自行翻动，无风自来，风道之神妙令人叹为观止。',
    skills:['wi07','wi08','wi09','wi10'], reqLv:40, reqProf:'炉火纯青', dropWeight:1,
    reqSect:'xiaoyao' },

  // ═════════════ 圣系 ═════════════
  'm_ho_frag1': {
    id:'m_ho_frag1', name:'圣光残卷', rarity:'fragment', school:'圣系',
    desc:'不知何方圣地流出的功法残页，光明之气扑面。',
    flavor:'书页泛金光，沾手后手掌微暖。',
    skills:['ho01'], reqLv:8, dropWeight:12,
    reqSect:'emei' },
  'm_ho_partial1': {
    id:'m_ho_partial1', name:'天使奥义残本', rarity:'partial', school:'圣系',
    desc:'神圣功法的两式残本，兼具攻守之功效。',
    flavor:'此书来历不明，有人说是从西方传来的异术。',
    skills:['ho02','ho03'], reqLv:18, dropWeight:6,
    reqSect:'emei' },
  'm_ho_complete1': {
    id:'m_ho_complete1', name:'圣典三卷完本', rarity:'complete', school:'圣系',
    desc:'神圣功法的完整三卷，光明之力令人心安。',
    flavor:'书中每字皆散金光，读之身心净化，百病不侵。',
    skills:['ho04','ho05','ho06'], reqLv:30, reqProf:'大成', dropWeight:2,
    reqSect:'emei' },
  'm_ho_rare1': {
    id:'m_ho_rare1', name:'天启圣典孤本', rarity:'rare', school:'圣系',
    desc:'圣道巅峰的绝世孤本，四式天地合一的圣法。',
    flavor:'此书据传由天界神明亲赐，凡人得之，必有大造化。',
    skills:['ho07','ho08','ho09','ho10'], reqLv:48, reqProf:'炉火纯青', dropWeight:0,
    reqSect:'emei' },

  // ═════════════ 拳系 ═════════════
  'm_fx_frag1': {
    id:'m_fx_frag1', name:'降龙残卷', rarity:'fragment', school:'拳系',
    desc:'降龙十八掌的入门残页，虽残却藏大道。',
    flavor:'字里行间气势宏大，非寻常武学可比。',
    skills:['fi1a'], reqLv:10, dropWeight:10,
    reqSect:'kongtong' },
  'm_fx_rare1': {
    id:'m_fx_rare1', name:'降龙十八掌全谱', rarity:'rare', school:'拳系',
    desc:'传说中的绝世掌法全谱，十八掌尽藏其中。',
    flavor:'天下第一掌法！得此书者，可称武林之雄。',
    skills:['fi1b','fi1c','fi1d','fi1e'], reqLv:45, reqProf:'大成', dropWeight:0,
    reqSect:'kongtong' },

  // ═════════════ 奇门 ═════════════
  'm_qm_frag1': {
    id:'m_qm_frag1', name:'奇门入门残卷', rarity:'fragment', school:'奇门',
    desc:'奇门遁甲入门残页，玄机无数。',
    flavor:'书中符文密布，寻常人看不懂一个字。',
    skills:['qm01'], reqLv:8, dropWeight:12,
    reqSect:'kunlun' },
  'm_qm_complete1': {
    id:'m_qm_complete1', name:'六爻奇门完本', rarity:'complete', school:'奇门',
    desc:'奇门遁甲的完整三式，布局陷阱，以奇制胜。',
    flavor:'翻阅此书时，周围空气仿佛在颤抖。',
    skills:['qm02','qm03','qm04'], reqLv:32, reqProf:'大成', dropWeight:2,
    reqSect:'kunlun' },
  'm_qm_rare1': {
    id:'m_qm_rare1', name:'奇门至典孤本', rarity:'rare', school:'奇门',
    desc:'奇门宗师的绝世著作，四式令敌无处遁形之法。',
    flavor:'此书据说每读一遍，便会在书中留下新的内容，不断增益。',
    skills:['qm05','qm06','qm07','qm08'], reqLv:46, reqProf:'炉火纯青', dropWeight:0,
    reqSect:'kunlun' },

  // ═════════════ 琴系 ═════════════
  'm_qin_frag1': {
    id:'m_qin_frag1', name:'琴音残卷', rarity:'fragment', school:'琴系',
    desc:'以乐制敌的入门残页，音律中暗藏杀机。',
    flavor:'书页上绘有五线谱，乐音似乎随时要飘出纸面。',
    skills:['mu01'], reqLv:8, dropWeight:11,
    reqSect:'taohuadao' },
  'm_qin_complete1': {
    id:'m_qin_complete1', name:'天音三曲完本', rarity:'complete', school:'琴系',
    desc:'天音阁的三首武功曲谱，精妙无比。',
    flavor:'读此书时，仿佛耳边萦绕丝竹之音，令人沉迷。',
    skills:['mu02','mu03','mu04'], reqLv:28, reqProf:'大成', dropWeight:2,
    reqSect:'taohuadao' },

  // ═════════════ 命理 ═════════════
  'm_ml_frag1': {
    id:'m_ml_frag1', name:'命格残卷', rarity:'fragment', school:'命理',
    desc:'命理之术的入门残页，窥天地之机。',
    flavor:'书中预言了三件往事，皆已应验，令人心惊。',
    skills:['ft01'], reqLv:10, dropWeight:8,
    reqSect:'xiaoyao' },
  'm_ml_rare1': {
    id:'m_ml_rare1', name:'天机命典孤本', rarity:'rare', school:'命理',
    desc:'命理宗师的绝世孤本，参透天命之道。',
    flavor:'此书据说每逢持有者遇险，便会自动翻到相关页面提示，神乎其神。',
    skills:['ft04','ft05','ft06','ft07'], reqLv:50, reqProf:'炉火纯青', dropWeight:0,
    reqSect:'xiaoyao' },

  // ═════════════ 通用 ═════════════
  'm_cm_frag1': {
    id:'m_cm_frag1', name:'江湖秘笈残卷', rarity:'fragment', school:'通用',
    desc:'不知何人所著的江湖秘笈，记载一式实用绝招。',
    flavor:'封面上写着"得者珍之"，字迹颇为潦草。',
    skills:['cm04'], reqLv:4, dropWeight:22,
  },
  'm_cm_partial1': {
    id:'m_cm_partial1', name:'走江湖秘笈残本', rarity:'partial', school:'通用',
    desc:'江湖走一遭的必备秘笈，两式通用保命之术。',
    flavor:'书中夹有一枚铜钱，或是前任持有者的遗物。',
    skills:['cm05','cm06'], reqLv:10, dropWeight:12,
  },
  'm_cm_complete1': {
    id:'m_cm_complete1', name:'天下武学总纲完本', rarity:'complete', school:'通用',
    desc:'汇聚天下武学精华的通用功法，三式化劲之术。',
    flavor:'此书乃某位游遍江湖的老侠之作，包罗万象。',
    skills:['cm07','cm08','cm09'], reqLv:20, reqProf:'大成', dropWeight:5,
  },
  'm_cm_rare1': {
    id:'m_cm_rare1', name:'武林至尊秘典', rarity:'rare', school:'通用',
    desc:'融合百家武学精华的绝世孤本，四式天下无敌之术。',
    flavor:'据说得此书者，可在三年内学遍天下武学，无人能敌。',
    skills:['cm06','cm07','cm08','cm10'], reqLv:35, reqProf:'大成', dropWeight:1,
  },
};

// ── 掉落权重表（用于战斗后随机） ──
const MANUAL_DROP_POOL = Object.values(MANUAL_DB).filter(m=>m.dropWeight>0);

// 按学派分组（用于商店展示）
const MANUALS_BY_SCHOOL = {};
Object.values(MANUAL_DB).forEach(m=>{
  if(!MANUALS_BY_SCHOOL[m.school]) MANUALS_BY_SCHOOL[m.school]=[];
  MANUALS_BY_SCHOOL[m.school].push(m);
});
