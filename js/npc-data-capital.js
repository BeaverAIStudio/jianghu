// npc-data-capital.js — 六大都城 NPC (洛阳/长安/幽州/扬州/成都/金陵)
// 自动从 npc-data.js 拆分生成

// npc-data.js — NPC数据库 / 任务库 / 情报库 / 城镇映射
// 自动从 npc.js 拆分生成

const NPC_REL_LEVELS = [
  { min:-100, max:-60, key:'enemy',   label:'仇敌', cls:'rel-enemy',   color:'#ff4040' },
  { min:-60,  max:-20, key:'hostile', label:'敌意', cls:'rel-hostile', color:'#ff8060' },
  { min:-20,  max:20,  key:'neutral', label:'陌路', cls:'rel-neutral', color:'rgba(160,180,160,.5)' },
  { min:20,   max:60,  key:'friend',  label:'友善', cls:'rel-friend',  color:'#80d080' },
  { min:60,   max:100, key:'love',    label:'挚友', cls:'rel-love',    color:'#ff9fc8' },
];
function getNpcRelLevel(val){
  return NPC_REL_LEVELS.find(l=> val >= l.min && val < l.max) || NPC_REL_LEVELS[2];
}

// ── NPC 数据库 ──
// 每城可引用的 NPC ID，NPC 对象定义在 NPC_DB
// cityId -> [npcId, ...]  由 WORLD_NODE_NPCS 映射
const NPC_DB = {

  // ══════════════════════════════════════════════════════════
  //  洛阳城 NPCs  (capital · 中原腹地)
  // ══════════════════════════════════════════════════════════

  // 洛阳·悦来客栈掌柜
  luoyang_inn: {
    id:'luoyang_inn', name:'赵福来', role:'旅店掌柜', category:'inn', avatar:'🧓',
    city:'luoyang', level:70, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:60,
    greetings:[
      '客官，要住店吗？本店悦来客栈在洛阳开了三十年，在下赵某绝不坑人。',
      '江湖好汉远道而来，先歇歇脚？今日刚到了一批好酒，晚上加菜。',
      '最近洛阳城热闹得很，武林大会的风声又传开了，好汉们都往这儿聚。',
    ],
    topics:[
      { id:'t_ly_inn_price', text:'打听住店价格', reply:'上房二两，中房八钱，大通铺三钱，客官要哪种？', relDelta:0 },
      { id:'t_ly_inn_rumor', text:'城里有什么新鲜事？', reply:'昨夜有天地帮的人在城中闹事，说是从沧州天雷寨来的，不知是哪路好汉来踢场子了，今早发现地上还有血迹…', relDelta:2, intelId:'intel_mingjiao_rise' },
      { id:'t_ly_inn_rest',  text:'休息一晚（10两）', reply:'好嘞！楼上上房已打扫干净，客官好眠！', relDelta:5, action:'inn_rest' },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general','chain_inn_a1'],
    intels:['intel_mingjiao_rise','intel_road_bandit'],
  },

  // 洛阳·杏林堂郎中
  luoyang_doctor: {
    id:'luoyang_doctor', name:'孟回春', role:'杏林圣手', category:'medicine', avatar:'👨‍⚕️',
    city:'luoyang', level:53, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_cloth',
    silver:120,
    giftPrefs:{
      label:'药理与温补珍材',
      love:['medicinal','herb','pearl'],
      like:['mystic'],
      thanksLoved:[
        '这味药引来得正好，老夫正缺这一手。',
        '好材料，入药温润不燥，这份人情老夫记下了。'
      ],
      thanksLiked:[
        '这东西虽不算绝品，却也足够派上用场。'
      ],
      questHint:'孟回春捻着材料沉吟片刻，像是想把一桩病案托付给你。',
      followup:{
        questText: ({ questName }) => questName ? `追问孟回春提的「${questName}」` : '追问孟回春那桩病案',
        questReply: ({ questName }) => questName
          ? `孟回春把药案按在桌上，低声道："这桩病不只伤在筋骨，还牵着别的手脚——${questName}。该去哪里问人、该备哪味药引，我都替你记进任务页了。"`
          : '孟回春捻须道："病家那边拖不得，我这儿却又抽不开身。你去任务页看看，我把脉案和要备的药引都给你写明白。"',
        intelText: () => '请孟老细说毒门药路',
        intelReply: ({ intelText }) => `孟回春先把窗扇掩了半边，这才压低声音："${intelText}"`,
        warmText: () => '顺着脉案再问几句',
        warmReply: ({ npcName }) => `${npcName}把药包往你手边推了推："你送礼不浮，问话也不躁。往后若再遇上疑难病症，尽管来杏林堂找我。"`,
      }
    },
    greetings:{
      hostile:[
        '孟回春抬眼扫你一记：“若只是来逞强吹嘘，杏林堂不奉陪。真有伤病，就把话说清。”',
        '老夫救人，不爱看人拿命当戏。你若还想硬撑，门在那边。',
      ],
      guarded:[
        '气息浮、步子急，八成是带伤还不肯认。坐下前先把来路说清，老夫才好判断该不该接手。',
        '江湖人身上的伤，常不只伤在皮肉。你若愿意实话实说，老夫才好开方。',
      ],
      neutral:[
        '老夫行医四十载，江湖刀伤、内伤、毒伤，没有治不好的。',
        '气色不太好啊，让老夫把个脉？',
        '武人最忌讳带伤行走，小伤不治拖成大患，得不偿失。',
      ],
      friendly:[
        '又来了？上回那口气总算养回来几分。坐，老夫先给你把把脉，再决定是扎针还是开方。',
        '你这人肯听劝，比大多数武人强。若是路上又沾了邪毒怪伤，先来杏林堂。',
      ],
      close:[
        '来，先把袖子挽起来。你的脉我已摸熟七八分，今日是旧伤复发，还是又替别人挡刀了？',
        '老夫见你行事虽莽，心却不坏。真撞上疑难病案，咱们一边煎药一边细说。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'chain_doc_b3', status:'claimed' },
        greetings:{
          neutral:['孟回春把新写好的药方压在案角：“那位病人总算捡回了一条命。你若想听后话，今日老夫肯多说两句。”'],
          friendly:['孟回春把药盏往你手边推了推：“你来得巧。那位病人这两日终于能自己下地了，老夫正想同你说说后续。”'],
          close:['孟回春望着你叹了口气，又带点笑意：“那桩病案能收得住尾，多亏你没半途松手。坐下，老夫把后来查明的细节慢慢讲给你。”'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_doc_b2', statuses:['active','done'] },
        greetings:{
          neutral:['孟回春把药箱扣得很紧：“那伙劫药的人还在盯着这副解毒药。你若是来回话，就直接说紧要的。”'],
          friendly:['孟回春压低声音：“药材暂时护住了，可那帮人来路不简单。你若在外头听见什么，先告诉老夫。”'],
          close:['孟回春把门帘拨严了些：“如今不是缺药，是缺敢把这条线追到底的人。你既来了，我便不瞒你。”'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_doc_b1', statuses:['active','done'] },
        greetings:{
          neutral:['孟回春把空药盏放回案上：“那味解毒药还差最后一味。你若是来问病案后续，今日正赶得上。”'],
          friendly:['孟回春捻着药须点了点头：“那位病人脉象还吊着一线，全看那味药能不能及时寻回。你来得正好。”'],
          close:['孟回春把旧药案摊开：“这回不是普通问诊，是在和阎王抢人。你若还愿意听，老夫便把缺口都告诉你。”'],
        }
      },
      {
        requiresTopic:'t_ly_doc_oldcase',
        greetings:{
          neutral:['孟回春把旧药案摊在手边：“你既还记着那桩慢毒病案，今日若是有了新见闻，就别绕弯子。”'],
          friendly:['孟回春抬手点了点案头药帖：“那桩旧病案我还压着。你若又想起什么细枝末节，咱们正好接着往下盘。”'],
          close:['孟回春把炉上药盏挪近些：“来得正好。那桩旧案你我都没放下，坐近点，边看脉边说。”'],
        }
      },
      {
        requiresTopic:'t_ly_doc_case',
        greetings:{
          guarded:['孟回春把案上的药包轻轻一按：“那位慢毒镖客的事，老夫还记着。你若只是来套话，就不必开口了。”'],
          neutral:['孟回春捻须看了你一眼：“上回那桩慢毒病案，老夫还压在心里。你若想接着聊，老夫这里有的是话。”'],
          friendly:['孟回春把药案朝你推近了些：“你既听进了那桩病案，往后若再撞上怪伤怪毒，先来杏林堂。”'],
          close:['孟回春轻敲药案：“那位慢毒镖客的后续，我还想同你接着参详。你来得正好。”'],
        }
      },
    ],
    topics:[
      { id:'t_ly_doc_heal',  text:'治伤', reply:'好，躺下，老夫先看看伤势。（银针飞舞，片刻后气血已复）', relDelta:3, action:'heal_hp' },
      { id:'t_ly_doc_talk',  text:'聊聊养生之道', reply:'每日子时打坐调息，以意领气贯通奇经八脉，三年必见大成。切莫逞强硬拼，根基伤了可不是闹着玩的。', relDelta:4 },
      { id:'t_ly_doc_herbs', text:'购买草药', reply:'这是本堂的草药，都是老夫亲自炮制，童叟无欺。', relDelta:0, action:'open_shop' },
      { id:'t_ly_doc_case', text:'问问近来遇过什么怪病', doneText:'接着问那位慢毒镖客', reply:'前几日来了个镖客，伤口不过寸许，脉象却像中了慢毒。表面是刀伤，里头却是药理做的手脚。江湖上会这等阴法的人，不止一家。', repeatReply:'孟回春把药案往你这边推了推：“那镖客的事还没完。若没有新线索，这案子也只能先记在心里。”', relDelta:3, intelId:'intel_poison_cult', excludesQuestStates:[{ questId:'chain_doc_b1', statuses:['active','done'] }, { questId:'chain_doc_b2', statuses:['active','done'] }, { questId:'chain_doc_b3', statuses:['active','done'] }] },
      { id:'t_ly_doc_judge', text:'让他评一句自己的气血路数', doneTextStages:{ neutral:'再请他评一句自己的气血路数', friendly:'再让孟回春把把脉', close:'再让孟回春看看旧伤脉路' }, reply:'孟回春扣住你腕脉，沉吟半晌：“你出手不算乱，坏就坏在仗着年轻硬扛。再这么透支下去，哪天经脉真裂开了，神仙也难救。”', replyStages:{ neutral:'孟回春扣住你腕脉，沉吟半晌：“你出手不算乱，坏就坏在仗着年轻硬扛。再这么透支下去，哪天经脉真裂开了，神仙也难救。”', friendly:'孟回春把完脉后，语气缓了些：“底子不差，毛病还是那股逞强劲。你若肯收着三分火气，往后气血路数会顺得多。”', close:'孟回春收回手指，像训晚辈似的看你一眼：“筋骨和心气我都摸熟了。你不是没本事，是总把自己当药渣子熬，往后再乱拼命，先来让我知道。”' }, repeatReplyStages:{ neutral:'孟回春摇了摇头：“脉路不是一日能改的。记住老夫那句，少硬扛，多养气。”', friendly:'孟回春嗯了一声：“比上回顺些了，说明你多少听进去了。继续养，别急着拿命试刀。”', close:'孟回春给你拢了拢袖口：“还是那句话，真有旧伤翻出来，别等撑不住了才来。”' }, relDelta:5, minRel:20 },
      { id:'t_ly_doc_oldcase', text:'顺着上回病案再追问', doneText:'病案翻过了，再追一句', reply:'孟回春翻出一摞旧药案，缓声道：“江湖上最难治的不是毒，是人心。很多病拖到如今，并非无药可医，而是当事人始终不肯说实话。”', repeatReply:'孟回春把药案重新合上：“能说的老夫都说了。再往下，就得看你自己能不能从人心里把病根挖出来。”', relDelta:6, minRel:60, requiresTopic:'t_ly_doc_case' },
      { id:'t_ly_doc_chainherb', text:'问那味解毒药还差什么', doneText:'再问那味药的药性', reply:'孟回春拈起一撮晒干的药末：“这味药最难的不是找，是认。寻常人看它像枯草，真下到汤里却能把慢毒逼出三分。若带错了，反倒催命。”', repeatReply:'孟回春把药末重新包好：“记住它闻着淡，入口却苦得发涩。见着相近的草，也别轻易下手。”', relDelta:4, minRel:20, requiresQuestState:{ questId:'chain_doc_b1', statuses:['active','done'] } },
      { id:'t_ly_doc_chainambush', text:'问劫药那伙人是什么路数', doneText:'再问那伙人背后的来路', reply:'孟回春眉头压得极低：“他们下手不像寻常匪人，更像认得药性、也认得病人的底细。若只是图财，不会盯得这么准。”', repeatReply:'孟回春把门帘掀开一线又放下：“这帮人怕是有人在里头递信。真追这条线，得防的不止刀子。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_doc_b2', statuses:['active','done'] } },
      { id:'t_ly_doc_chainafter', text:'问那位病人后来可醒了', doneText:'再听听那病人的后话', reply:'孟回春长出一口气：“人醒了，第一句不是问命保没保住，是问那趟镖最后送没送到。江湖人有时就是这样，命刚捡回来，先惦记的还是肩上那点事。”', repeatReply:'孟回春把药碗推远些：“病是压住了，可旧债旧怨未必真完。你我都知道，这案子后头还有尾巴。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_doc_b3', status:'claimed' } },
    ],

    shop:{
      type:'medicine',  // 药铺：点击"医馆"才匹配，点击"商店"不匹配
      items:[
        { id:'item_herb_blood', name:'活血草',   desc:'活血化瘀，回复气血30',   icon:'🌿', price:6,  effect:{hp:30} },
        { id:'item_herb_qi',    name:'参须片',   desc:'大补内力，回复内力50',   icon:'🌱', price:12, effect:{mp:50} },
        { id:'item_herb_anti',  name:'解毒丸',   desc:'解除中毒状态',           icon:'💊', price:18, effect:{detox:true} },
        { id:'item_food_bun',   name:'药膳包子', desc:'温补，回复饱食度30',     icon:'🥟', price:4,  effect:{food:30} },
        { id:'item_jingqi_pill',name:'精气丸',   desc:'同时回复气血40和内力60', icon:'⚪', price:20, effect:{hp:40, mp:60} },
        { id:'item_energy_herb',name:'提神草',   desc:'提振精神，精力+30',      icon:'🍀', price:8,  effect:{energy:30} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','chain_doc_b1'],
    intels:['intel_poison_cult'],
  },

  // 洛阳·神兵铁铺
  luoyang_smith: {
    id:'luoyang_smith', name:'牛铁山', role:'神兵铁匠', category:'blacksmith', avatar:'🔨',
    city:'luoyang', level:50, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:200,
    giftPrefs:{
      label:'寒铁机括与硬料',
      love:['ore','mechanism','thunder'],
      like:['flame','martial'],
      thanksLoved:[
        '好家伙，这料子一上炉，准能出响器。',
        '成，这种硬料可不是天天都能碰见。'
      ],
      thanksLiked:[
        '先收着，回头试刀开锋正好用得上。'
      ],
      questHint:'牛铁山把材料往炉边一放，像是想起一桩缺料的铸造活。',
      followup:{
        questText: ({ questName }) => questName ? `追问牛铁山那炉「${questName}」` : '追问牛铁山那炉活',
        questReply: ({ questName }) => questName
          ? `牛铁山把铁钳往炉边一磕："这炉火就差临门一脚——${questName}。缺哪路料、该去谁那儿换，我都替你写进任务页了，照着办就行。"`
          : '牛铁山抹了把汗，朝炉膛努努嘴："我这儿压着一件硬活，差料也差人腿脚。去任务页看看，我把该跑的门路都给你列清。"',
        intelText: () => '请牛师傅细说寒铁门路',
        intelReply: ({ intelText }) => `牛铁山把火钳伸进炉里拨了拨火星，闷声道："${intelText}"`,
        warmText: () => '顺着炉边旧事问下去',
        warmReply: ({ npcName }) => `${npcName}咧嘴笑了笑："你懂料，也懂什么时候该闭嘴。以后若真碰上好矿好兵器，俺也去先给你透个风。"`,
      }
    },
    greetings:{
      hostile:[
        '牛铁山头也不抬：“光会站边上指手画脚的，别挡着炉火。真懂兵器，再开口。”',
        '俺这儿卖的是家伙，不卖嘴皮子。若只是来找不痛快，出门左拐。',
      ],
      guarded:[
        '把兵器先递来看看。是来买、来修，还是来套俺的话？',
        '炉火正旺，别绕弯子。你若真有眼力，俺自然肯多说两句。',
      ],
      neutral:[
        '叮叮当当！好刀要磨，好剑要淬！客官想打什么兵器？',
        '俺这炉子烧了四十年，洛阳城里有头有脸的侠客，哪个手里的家伙不是出自俺牛铁山之手！',
        '这把刀刃口卷了，拿来俺给你修修，不收钱！',
      ],
      friendly:[
        '来得正好，俺也去刚开炉。你若看中哪块料子，趁热说，俺也去替你留一手。',
        '你这人不光懂刀，还懂什么时候该让铁匠先把火候顾稳，俺也去乐意跟你多聊聊。',
      ],
      close:[
        '别在外头站着，进炉边来。你如今看料的眼神，已经不像外行了。',
        '俺也去不跟你摆门面了。真遇上好矿好兵器，你先来看，旁人俺也去未必让。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'chain_smith_c3', status:'claimed' },
        greetings:{
          neutral:['牛铁山把新淬好的兵刃横在案上：“那口神兵总算出了炉。你若想听它最后成形时的响儿，俺也去记得清。”'],
          friendly:['牛铁山咧嘴一笑：“来得巧，俺也去正想让你看看那口新成的家伙。没有你跑出来的门路，这炉火可熬不到今天。”'],
          close:['牛铁山把你往炉边招了招：“进来听，别让外头人听见。那口神兵最后落锤时是什么动静，俺也去只想说给你。”'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_smith_c2', statuses:['active','done'] },
        greetings:{
          neutral:['牛铁山把火钳往炉膛里一探：“图没拿回来前，俺也去这炉火不敢乱开。你若有后信，就赶紧说。”'],
          friendly:['牛铁山盯着炉膛里那点蓝火：“图纸一日不回，这块陨铁就一日只能干烧。俺也去等的就是你这边的准话。”'],
          close:['牛铁山压低嗓门：“抢图的人未必识货，可他背后的人八成识。你若真摸到线，俺也去陪你把这件事砸到底。”'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_smith_c1', statuses:['active','done'] },
        greetings:{
          neutral:['牛铁山把陨铁碎片往铁砧上一搁：“老匠人的门路若真问出来，这块料子还有救。你来得正是时候。”'],
          friendly:['牛铁山抹了把汗：“俺也去守着这块陨铁守了好几夜，就等你带回古法的消息。”'],
          close:['牛铁山把炉门拨开一线，让热浪扑了出来：“你若还肯替俺也去这一趟，俺也去就把这炉压箱底的念想全摊给你听。”'],
        }
      },
    ],
    topics:[
      { id:'t_ly_smith_identify', text:'🔍 鉴定装备（收费）', reply:'放下锤子，让你把装备拿出来看看。', relDelta:0, action:'identify_equip' },
      { id:'t_ly_smith_story', text:'问铁匠的来历', reply:'俺当年也是江湖人，在华山论剑上打进了前二十。后来断了两根手指，练不了细活，就改行打铁。唉，往事如烟…', relDelta:6 },
      { id:'t_ly_smith_tip',   text:'打听武器行情', reply:'最近玄铁涨价得厉害，好刀价钱水涨船高。听说昆仑山里有块千年寒铁矿脉，那才是真宝贝，可惜昆仑派看得紧。', relDelta:2, intelId:'intel_kunlun_sword', excludesQuestStates:[{ questId:'chain_smith_c1', statuses:['active','done'] }, { questId:'chain_smith_c2', statuses:['active','done'] }, { questId:'chain_smith_c3', statuses:['active','done'] }] },
      { id:'t_ly_smith_fixfree', text:'问他为何修刃不收钱', reply:'牛铁山把刀在指节上轻轻一敲：“兵器卷了口，主人脸上也没光。俺宁可少挣几文，也不愿看把好刀被人糟蹋。”', relDelta:4 },
      { id:'t_ly_smith_look', text:'请他评一评自己的兵器', reply:'牛铁山接过你的家伙掂了掂：“路子没错，就是保养太糙。真打起来，它未必先断，可你手上的劲会先乱。回去把腕力和收势再练练。”', relDelta:5, minRel:20 },
      { id:'t_ly_smith_furnace', text:'顺着炉边旧事多问一句', reply:'牛铁山望着炉膛里翻红的铁料，半晌才道：“江湖人都爱问名剑从哪来，却少有人问一把废铁是怎么熬成的。能熬得住火的人，后来大多也熬得住事。”', relDelta:6, minRel:60 },
      { id:'t_ly_smith_chaincraft', text:'问那位老匠人的古法门路', doneText:'再问那门古法到底缺哪一环', reply:'牛铁山用火钳敲了敲陨铁：“老法子讲究三样：识火、识料、识人。料俺也去有，火俺也去敢熬，偏偏少个真正见过古法的人点醒最后那一下。”', repeatReply:'牛铁山往西边努努嘴：“俺也去要问的不是招式，是火候里那口气。找不对人，再好的料子也得糟蹋。”', relDelta:4, minRel:20, requiresQuestState:{ questId:'chain_smith_c1', statuses:['active','done'] } },
      { id:'t_ly_smith_chainmap', text:'问那张锻造图为何这么要紧', doneText:'再问那张图到底记了什么', reply:'牛铁山把铁锤轻轻搁下：“图上未必全是招式，最值钱的是次序。先烧哪一面、几时淬火、几时回温，错一环，神兵就成废铁。”', repeatReply:'牛铁山盯着炉火哼了一声：“抢图的人多半只知道它值钱，不知道它值命。俺也去这口炉等得起，图纸可未必等得起。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_smith_c2', statuses:['active','done'] } },
      { id:'t_ly_smith_chainblade', text:'问那口神兵最后成了什么样', doneText:'再听听那口神兵出炉时的响', reply:'牛铁山眼里难得露出点得意：“最后一锤落下去时，整炉火像被人一把攥紧，连铁声都干净了。俺也去打了半辈子铁，知道那一声不是巧，是成了。”', repeatReply:'牛铁山把掌心按在铁砧上：“真成器的兵刃，不一定见血才吓人。有些家伙一出炉，站在旁边的人心里就先静了。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_smith_c3', status:'claimed' } },
    ],
    shop:{
      items:[
        { id:'item_whet',       name:'精磨刀石',   desc:'临时提升攻击力8，持续5回合', icon:'🪨', price:10, effect:{atkBuff:8,  turns:5} },
        { id:'item_oil',        name:'护甲油脂',   desc:'临时提升防御力8，持续5回合', icon:'🫙', price:9,  effect:{defBuff:8,  turns:5} },
        { id:'item_arrow',      name:'精钢镖针',   desc:'暗器类武器专用消耗品，×5',   icon:'🏹', price:15, effect:{special:'dart_ammo'} },
        { id:'item_iron_coat',  name:'铁甲涂油',   desc:'防御+5且不易磨损，持续8回合',icon:'🛡️', price:12, effect:{defBuff:5,  turns:8} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','chain_smith_c1'],
    intels:['intel_kunlun_sword'],
  },

  // 洛阳·醉仙楼酒馆
  luoyang_tavern: {
    id:'luoyang_tavern', name:'沈云燕', role:'酒馆掌柜', category:'tavern', avatar:'👩',
    city:'luoyang', level:73, tier:'func',
    weapon:'wep_short_knife', armor:'cs_cloth',
    silver:80,
    greetings:[
      '客官来啦！今日新到了一坛二十年陈的汾酒，要不要尝尝？',
      '我们掌柜最近愁着呢，说是隔壁新开了家酒馆，抢了不少生意。',
      '江湖乱得很，最近好多侠客来这里喝闷酒，一喝就喝到天亮。',
    ],
    topics:[
      { id:'t_ly_tav_drink',  text:'买壶酒喝（3两）', reply:'好嘞！这是招牌汾酒，入口绵柔，后劲儿十足，喝了包您神清气爽！', relDelta:5, action:'buy_drink' },
      { id:'t_ly_tav_gossip', text:'八卦洛阳城的事', reply:'悄悄告诉你，天地帮最近和来自江南的某个帮派谈生意，说是要联手，但又闹翻了。昨晚还动了家伙！', relDelta:3, intelId:'intel_local_gossip' },
      { id:'t_ly_tav_sing',   text:'请她唱曲儿（2两）', reply:'（沈云燕整了整衣裙，轻启朱唇，唱起一段洛阳小调，声若黄莺，满堂叫好）', relDelta:8, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_wine_fen',      name:'汾酒',       desc:'名酒，精力+30',           icon:'🍶', price:4,  effect:{energy:30} },
        { id:'item_wine_hong',     name:'女儿红',     desc:'美酒，精力+40微微上头',   icon:'🍷', price:7,  effect:{energy:40, dizzy:true} },
        { id:'item_food_meat',     name:'酱牛肉',     desc:'洛阳名吃，饱食度+45',     icon:'🍖', price:8,  effect:{food:45} },
        { id:'item_food_fish',     name:'清蒸黄河鲤', desc:'鲜鱼，饱食度+35',         icon:'🐟', price:5,  effect:{food:35} },
        { id:'item_food_tofu',     name:'洛阳水席',   desc:'正宗洛阳菜，饱食度+50，精力+15', icon:'🥘', price:12, effect:{food:50, energy:15} },
        { id:'item_wine_courage',  name:'壮胆烈酒',   desc:'一杯下肚勇气倍增，攻击+8持续3回合', icon:'🏮', price:15, effect:{atkBuff:8, turns:3} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels:['intel_local_gossip'],
  },

  // 洛阳·城门丐头
  luoyang_beggar: {
    id:'luoyang_beggar', name:'苦行侠', role:'丐帮老叟', category:'quest', avatar:'🧙',
    city:'luoyang', level:73, tier:'major',
    weapon:'wep_peach_stick', armor:'cs_cloth',
    silver:15,
    giftPrefs:{
      label:'值钱又好转手的稀罕货',
      love:['raretrade','dark'],
      like:['fang','martial'],
      thanksLoved:[
        '嘿，这礼可不轻，老汉就喜欢这种真家伙。',
        '好货！这一下可够老汉换不少门路。'
      ],
      thanksLiked:[
        '不错，至少不是拿破烂来糊弄老汉。'
      ],
      questHint:'苦行侠把礼物飞快收进破袋里，左右一看，像是准备跟你说点别的。',
      followup:{
        questText: ({ questName }) => questName ? `顺着苦行侠这条「${questName}」门路往下摸` : '顺着苦行侠这条门路继续摸',
        questReply: ({ questName }) => questName
          ? `苦行侠往墙根一缩，嘿嘿低笑："既然你给得起，老汉也给你开条缝——${questName}。去哪儿蹲点、该避开谁，任务页里我都替你留了暗记。"`
          : '苦行侠把破袋往怀里一塞，压低嗓子道："你既懂规矩，老汉就指你一条活路。去任务页看，我把碰头的地方和该避的人都给你写上。"',
        intelText: () => '请老汉把风声讲透',
        intelReply: ({ intelText }) => `苦行侠抬起脏袖遮了遮嘴角，声音却细得像针："${intelText}"`,
        warmText: () => '蹲下来听他继续往下说',
        warmReply: ({ npcName }) => `${npcName}眯眼打量你片刻，才嘿地一笑："行，算你会做人。以后城门口若先刮起什么邪风，老汉多半会先朝你招招手。"`,
      }
    },
    greetings:{
      hostile:[
        '苦行侠把破碗一扣：“没银子、没规矩，还想从老汉嘴里撬消息？做梦。”',
        '城门风大，人心更冷。你若是来找乐子，老汉可没闲工夫陪你。',
      ],
      guarded:[
        '嘿，脚步轻，眼睛却不老实。你是想施舍，还是想从老汉这儿捞门路？',
        '别看老汉窝在墙根，城里谁进谁出、谁真谁假，我都记着呢。你先说，你想问什么。',
      ],
      neutral:[
        '哎哟，行行好，赏口吃的？老汉在洛阳城门蹲了三十年，什么事儿没见过！',
        '别看老汉这副落魄相，江湖上的腥风血雨俺见得多了，你有几斤几两俺一眼就看出来。',
        '丐帮的消息最灵通，就看你舍不舍得花银子了，哈哈！',
      ],
      friendly:[
        '来啦？站近点说，今儿城门口又换了几张生脸，老汉正想找个懂门道的人聊聊。',
        '你这人还算讲究，给吃给银都不装腔。老汉若听见什么风声，未必不能先漏你半句。',
      ],
      close:[
        '蹲下来说，别站得跟官差似的。你我如今算熟人，老汉不爱跟你打那些空哈哈。',
        '城门口的脏风、黑话、买路钱，你也摸着门了。真有邪乎事，老汉先替你留心。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'quest_beggar_secret_passage', status:'claimed' },
        greetings:{
          neutral:['苦行侠把破袋往脚边一拢：“那条暗道的事，如今可不只是老鼠打洞那么简单。你若还想听，老汉这回不收你冤枉钱。”'],
          friendly:['苦行侠抬起脏袖遮了遮嘴：“你把暗道那头的气味都摸回来了，老汉这几日越想越不对。来，俺也去把后半截给你理理。”'],
          close:['苦行侠往墙根又缩了半寸，给你让出块地方：“暗道的口子、里头的人、背后的手脚，俺也去只想说给你这种真蹚过的人听。”'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_beggar_secret_passage', statuses:['active','done'] },
        greetings:{
          neutral:['苦行侠把手里的破碗倒扣在地：“那条暗道口俺也去盯了半个月，就差个腿脚利索的替老汉钻进去。你若有信，就别兜圈子。”'],
          friendly:['苦行侠朝城墙阴影里努了努嘴：“暗道这事不是小玩笑，里头八成还连着别人的活路。你若查到什么，先来跟老汉对一嘴。”'],
          close:['苦行侠把声音压成一线：“真要顺着那条暗道摸，怕是要摸到见不得光的人。你敢去，老汉就敢把更脏的话说给你。”'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_gossip_beggar_network', statuses:['active','done'] },
        greetings:{
          neutral:['苦行侠抖了抖破袋：“这回不是讨饭，是讨消息。那几条街底下像是有人夜里动土，你若带了风声，赶紧说。”'],
          friendly:['苦行侠眼皮一抬：“城里叫花子这两天都在替老汉盯那几条街。你若也看见了不对劲，俺也去好把线头往一处拢。”'],
          close:['苦行侠嘿地一笑，露出缺牙：“旁人只当我们脏，真有消息时，脏地方反倒最藏得住眼睛。你回来得正好，俺也去把网再收紧些。”'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_beg_food', status:'claimed' },
        greetings:{
          neutral:['苦行侠舔了舔牙缝，像还记着那碗热饭的香气：“吃饱了以后，老汉这脑子果然转得比平时快。你若想听那秘密后头还有没有尾巴，问就是。”'],
          friendly:['苦行侠把破碗翻来覆去地敲：“那碗热饭老汉没白吃，后头又听来两耳朵新风声。你来得不亏。”'],
          close:['苦行侠眯眼冲你笑：“肯给老汉热饭的人不多，肯听老汉把话说尽的人更少。你既来了，俺也去不卖关子。”'],
        }
      },
    ],
    topics:[
      { id:'t_ly_beg_coin',   text:'施舍（1两）', reply:'（老叟眼睛一亮）好人有好报！告诉你，城东废园子里，前几日有人进去，没出来……', relDelta:15, intelId:'intel_treasure_cave', excludesQuestStates:[{ questId:'quest_beg_food', statuses:['active','done'] }] },
      { id:'t_ly_beg_skill',  text:'向他讨教武功', reply:'嘿嘿！老汉当年练过丐帮打狗棍法第七路，不过你得先带老汉吃顿饱的才肯教！', relDelta:5 },
      { id:'t_ly_beg_secret', text:'打探江湖秘闻（5两）', reply:'（压低声音）听说《武穆遗书》最后一册重现江湖，天地帮、少林、武当都在暗中追查，血雨腥风怕是要来了……', relDelta:8, action:'pay_info', intelId:'intel_tianshu', excludesQuestStates:[{ questId:'quest_beggar_secret_passage', statuses:['active','done'] }, { questId:'quest_gossip_beggar_network', statuses:['active','done'] }] },
      { id:'t_ly_beg_gate', text:'问他为何总蹲在城门口', reply:'苦行侠嘿嘿一笑：“城里的人会装，出城的人会慌。想看一个人心里有没有鬼，最好就在城门口看他那两步路。”', relDelta:4 },
      { id:'t_ly_beg_face', text:'让他瞧瞧自己像哪路人', reply:'苦行侠眯眼把你从上到下瞧了一遍：“你这身骨头不像大户养出来的，也不像邪门歪道泡出来的，倒像是一路挨打一路长本事的。这样的江湖人，命硬。”', relDelta:5, minRel:20 },
      { id:'t_ly_beg_olddays', text:'顺着他年轻时的事往下问', reply:'苦行侠缩了缩脖子，半真半假地笑道：“年轻时也阔过、狠过、替人挡过刀。后来人散了、帮规也变了，老汉就学会了蹲低一点，看别人怎么把路走歪。”', relDelta:6, minRel:60 },
      { id:'t_ly_beg_hotmeal', text:'问那碗热饭换来的秘密还有没有后话', doneText:'再问那碗热饭后头换来的风声', reply:'苦行侠咂了咂嘴：“那回老汉说的大秘密，不是凭空编出来的。真正值钱的不是一句话，是谁在饿得最狠的时候还惦记着把消息压住。”', repeatReply:'苦行侠把破碗在膝头轻轻一磕：“热饭只能暖一阵，人心里那点凉意可不是一顿就能散。你若想查深，得盯着谁先吃饱、谁先闭嘴。”', relDelta:4, minRel:10, requiresQuestState:{ questId:'quest_beg_food', status:'claimed' } },
      { id:'t_ly_beg_tunnel', text:'问那条地下暗道通向哪头', doneText:'再问暗道里头最该防什么', reply:'苦行侠伸出两根发黑的手指比了比：“这种暗道最怕两头都不干净。入口像给穷人留的活路，出口却常常通向不该见光的买卖。”', repeatReply:'苦行侠把脖子一缩：“老汉腿脚不行，可鼻子还灵。那暗道里若真有新土味，多半不是老鼠，是人刚动过手。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'quest_beggar_secret_passage', statuses:['active','done'] } },
      { id:'t_ly_beg_tunnelafter', text:'问暗道背后还牵着谁', doneText:'再问那条暗道后头的人情账', reply:'苦行侠嘿嘿一笑，眼里却没什么笑意：“暗道这种东西，从来不只藏货，也藏人情和灭口。你把口子掀开了，后头想捂的人可不会少。”', repeatReply:'苦行侠抬袖挡了挡脸：“再往后问，就不是图热闹，是图命。老汉提醒过你，真走进去就别装没看见。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'quest_beggar_secret_passage', status:'claimed' } },
      { id:'t_ly_beg_network', text:'问叫花帮最近盯上哪几条街', doneText:'再问那张情报网收回来什么味道', reply:'苦行侠用指甲在地上划了几道：“看街不是看谁热闹，是看哪条巷子忽然太安静。真有事的地方，连狗都比平时少叫两声。”', repeatReply:'苦行侠把破袋抱紧些：“东一耳西一眼听来的消息最碎，也最真。你要学会从那些没头没尾的话里，拼出谁在夜里不睡觉。”', relDelta:4, minRel:10, requiresQuestState:{ questId:'quest_gossip_beggar_network', statuses:['active','done'] } },
    ],
    shop:null,
    quests:['quest_beg_food','quest_beggar_secret_passage','quest_daily_beggar_intel','quest_gossip_beggar_network','quest_daily_gossip_general'],
    intels:['intel_treasure_cave','intel_tianshu'],
  },


  // 洛阳·行商大贾
  luoyang_merchant: {
    id:'luoyang_merchant', name:'韩振财', role:'洛阳首富', category:'shop', avatar:'💰',
    city:'luoyang', level:57, tier:'func',
    weapon:'wep_tao_charm', armor:'cs_scholar',
    silver:500,
    giftPrefs:{
      label:'撑门面的贵货与能周转的奇材',
      love:['raretrade','pearl','mechanism'],
      like:['pelt','mystic'],
      thanksLoved:[
        '这礼够体面，也够值钱，韩某喜欢。',
        '成色不错，留着自用长脸，转出去也有赚头。'
      ],
      thanksLiked:[
        '嗯，这份礼送得懂行，倒不像外行人。'
      ],
      questHint:'韩振财把礼物放到案边，神色亲热了不少，像是终于肯把手头买卖说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问韩振财这单「${questName}」` : '追问韩振财手里那单买卖',
        questReply: ({ questName }) => questName
          ? `韩振财把算盘拨得噼啪一响，笑道："既然你给足了韩某面子，这单生意就让你先沾手——${questName}。价码、路线、该跟谁对账，我都写在任务页里。"`
          : '韩振财把账册合上半本，笑意更深："我手里正有单买卖缺个稳妥人。你去任务页看看，来路去路、赚头亏头，我都替你算清楚了。"',
        intelText: () => '请韩掌柜把商路价码说细',
        intelReply: ({ intelText }) => `韩振财抬手示意伙计退开，这才压低声音："${intelText}"`,
        warmText: () => '顺着账面继续往下谈',
        warmReply: ({ npcName }) => `${npcName}把礼物往柜里一收："你这人会做事，也会做人。往后若有路子能赚银子，韩某不会忘了先给你留一份。"`,
      }
    },
    greetings:{
      hostile:[
        '韩振财把账册一合：“韩某做的是正经买卖，不接无名火，也不陪无聊人耗时辰。”',
        '若只是来试探价码、搅人心绪，韩某这儿可没有白听的账。',
      ],
      guarded:[
        '买货、卖货，还是谈路子？韩某先得知道，你打算拿什么跟我换信任。',
        '行商最怕看错人。你若想谈正事，不妨先把来意摆到明面上。',
      ],
      neutral:[
        '做生意讲个信字，韩某在洛阳二十年，一手一脚赚来的名声。客官要什么？',
        '最近丝绸价格涨了不少，南边运来的货全贵了，可没法子。',
        '你是走江湖的？正好，韩某有笔买卖想托付，出手阔绰！',
      ],
      friendly:[
        '你来得巧，韩某正翻账本。旁人看不懂这些数字，你倒未必。',
        '跟你说话省心，不必句句防着。若你还想赚银子，咱们可以谈得再深些。',
      ],
      close:[
        '来，坐里间。外头那些客人只配听价码，你却能听韩某说门路。',
        '你既懂规矩，也懂分寸，韩某有些账本以外的话，倒愿意讲给你听。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'chain_merchant_e3', status:'claimed' },
        greetings:{
          neutral:['韩振财把新抄好的账页推到一边：“那本旧账总算对平了。你若想听韩某怎么把尾款一笔笔讨回来，今日有空。”'],
          friendly:['韩振财端茶给你，笑得松快不少：“账追回来后，连伙计说话都敢大声了。你既来了，咱们正好把后话说完。”'],
          close:['韩振财把你请进里间：“外头人只看见韩某生意又顺了，却不知道这本账是你替我从刀口上捞回来的。”'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_merchant_e2', statuses:['active','done'] },
        greetings:{
          neutral:['韩振财指尖压着半本账册：“账本线索已经对上，可背后那位主使还没浮出来。你若有消息，先说这个。”'],
          friendly:['韩振财把算盘拨得极慢：“现在不是亏钱的问题，是有人想借这笔账把人一并抹掉。你若查到口风，韩某记你这份情。”'],
          close:['韩振财看了眼门外才低声道：“敢动我账本的人，胃口绝不止这一单。你若真摸到人，韩某连压箱底的名册都能给你看。”'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_merchant_e1', statuses:['active','done'] },
        greetings:{
          neutral:['韩振财把算盘扣在账页上：“那笔对不上的货款还卡着。你若来问后续，韩某这里正缺个肯替我走一趟的人。”'],
          friendly:['韩振财抬手示意伙计退远些：“明面上的账好算，暗地里的手脚难防。你若愿继续听，韩某就把怀疑都摊开说。”'],
          close:['韩振财把里间帘子放下：“这不是普通亏空，是有人拿韩某的路子做局。你既是自己人，账里最脏那几页也该让你知道。”'],
        }
      },
    ],
    topics:[
      { id:'t_ly_merch_buy',  text:'看看货物', reply:'这都是韩某走南闯北收来的好货，最贵的放里屋，客官要看吗？', relDelta:0, action:'open_shop' },
      { id:'t_ly_merch_task', text:'问问有没有任务', reply:'正好！有批丝绸要运到扬州，沿途盗贼猖獗，你若顺路，报酬绝不少你的。', relDelta:3, excludesQuestStates:[{ questId:'chain_merchant_e1', statuses:['active','done'] }, { questId:'chain_merchant_e2', statuses:['active','done'] }, { questId:'chain_merchant_e3', statuses:['active','done'] }] },
      { id:'t_ly_merch_info', text:'打听商道行情', reply:'北方战事吃紧，茶叶、盐巴价格暴涨。江南水患，粮价也在涨。走江湖得留个心眼，银子要花在刀刃上。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_ly_merch_credit', text:'问他为何如此看重信誉', reply:'韩振财抬手拨了两下算盘：“一单亏钱，顶多伤皮肉；一单失信，十年招牌都得赔进去。江湖人信刀，商人信账，本质是一个道理。”', repeatReply:'韩振财把账册重新摊开：“信誉这东西，嘴上讲一次就够，往后得拿事来验。”', relDelta:4 },
      { id:'t_ly_merch_look', text:'请他评评自己适合哪路买卖', reply:'韩振财把你从衣着兵器看到脚下尘土，笑道：“你不像能坐柜台的人，倒像适合替人跑险路、压难货。赚得比旁人凶，也更容易招人记恨。”', replyStages:{ neutral:'韩振财把你从衣着兵器看到脚下尘土，笑道：“你不像能坐柜台的人，倒像适合替人跑险路、压难货。赚得比旁人凶，也更容易招人记恨。”', friendly:'韩振财拨了两下算盘珠：“你不适合守店，却适合替人把难货变活钱。只要分寸拿稳，手会比旁人更快。”', close:'韩振财端起茶盏看了你一眼：“若韩某真要另开一路偏门买卖，会先想到你。你不是最稳的那种人，却是最敢去啃硬骨头的。”' }, repeatReplyStages:{ neutral:'韩振财失笑：“韩某看人的话已经给过，剩下的就看你自己敢不敢认。”', friendly:'韩振财点了点你袖口尘土：“你身上写着路数，不必我再念第二遍。”', close:'韩振财笑得很淡：“你适合什么路子，你我心里都明白。”' }, relDelta:5, minRel:20 },
      { id:'t_ly_merch_loss', text:'顺着他赔过的那单生意往下问', reply:'韩振财敲了敲账本边角，笑意淡了些：“韩某也不是生来就会算。年轻时赔过一整船货，连伙计都散了。后来才明白，货能丢，心气不能先乱。”', repeatReply:'韩振财合上账本：“赔过一次，才知道什么叫守得住。真要把话说尽，就不是谈生意，是翻伤疤了。”', relDelta:6, minRel:60, requiresTopic:'t_ly_merch_credit' },
      { id:'t_ly_merch_chainledger', text:'问那笔对不上的账到底差在哪', doneText:'再问账面缺口是怎么做出来的', reply:'韩振财翻到一页被反复揉过的账：“最怪的不是少了多少银子，是每一笔都少得刚刚好。像是有人既懂行，又故意让韩某查出一点，却查不全。”', repeatReply:'韩振财用指节敲了敲页脚：“会做这种账的人，知道该把哪一笔留活口，好引人往错路上追。”', relDelta:4, minRel:20, requiresQuestState:{ questId:'chain_merchant_e1', statuses:['active','done'] } },
      { id:'t_ly_merch_chainboss', text:'问幕后主使想吞的到底是什么', doneText:'再问那主使图的是钱还是路子', reply:'韩振财把声音压得极低：“若只是吞一批货，犯不着冒这么大险。韩某怕的是，他看中的不是货款，是我这条商路上跟谁做过、欠过谁的人情。”', repeatReply:'韩振财把账册重新合上：“钱丢了还能赚，路子若被人掐住，往后每一单都得被人拿捏。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_merchant_e2', statuses:['active','done'] } },
      { id:'t_ly_merch_chainafter', text:'问追回账本后他先做了什么', doneText:'再听他讲那本账追回后的后手', reply:'韩振财失笑，把算盘拨得噼啪直响：“先把欠伙计的那口气还回去，再把几家老主顾一一安住。生意场上最难收的不是银子，是人心。”', repeatReply:'韩振财抿了口茶：“账本回来只是头一步。后头那些肯继续跟我走货的人，才是真正值钱的本钱。”', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_merchant_e3', status:'claimed' } },
    ],
    shop:{
      type:'misc',  // 杂货铺：点击"商店"才匹配
      items:[
        { id:'item_map_piece',   name:'地图残片', desc:'揭示附近隐藏地点',     icon:'🗺', price:25, effect:{reveal_map:true} },
        { id:'item_elixir',      name:'灵药',     desc:'回复气血内力各50',     icon:'⚗',  price:35, effect:{hp:50, mp:50} },
        { id:'item_wine_age',    name:'陈年汾酒', desc:'极品美酒，精力+40',   icon:'🍯', price:20, effect:{energy:40} },
        { id:'item_lucky_incense',name:'祈福香',  desc:'燃香后气运小幅提升，好感+5', icon:'🕯️', price:15, effect:{rel_bonus:5} },
        { id:'item_travel_ration',name:'行路干粮',desc:'耐储的行路口粮，饱食度+40', icon:'🧆', price:8,  effect:{food:40} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','chain_merchant_e1'],
    intels:['intel_trade_route'],
  },

  // 洛阳·女剑客
  luoyang_swordwoman: {
    id:'luoyang_swordwoman', name:'雁翎', role:'洛阳女剑客', category:'sect', avatar:'⚔',
    city:'luoyang', level:68, tier:'major',
    weapon:'wep_uc_sword', armor:'cs_scholar',
    silver:240,
    greetings:[
      '洛阳城里才子佳人不少，但能像雁翎这般既能吟诗又能舞剑的——独此一家！',
      '侠客的路从来不分男女，只分有没有那颗赤子之心。',
      '你来得正好，正好与雁翎切磋几招——放心，俺会留手的。',
    ],
    topics:[
      { id:'t_ly_sw_duel', text:'切磋武艺', reply:'好！那俺就不客气了，来！【雁翎抽剑，剑光如练，招式既有女子的柔美又不失凌厉】', relDelta:12 },
      { id:'t_ly_sw_intel', text:'打听洛阳江湖', reply:'洛阳目前有三派势力角力：丐帮、绿林、还有一帮神出鬼没的黑衣人。黑衣人最近频繁出入洛阳南市，让人不安。', relDelta:7, intelId:'intel_sect_secret' },
      { id:'t_ly_sw_task', text:'有没有任务', reply:'有人雇雁翎去查一件事，但俺一个人忙不过来，你有兴趣一起？', relDelta:9 },
    ],
    shop: null,
    quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_sect_secret'],
  },

  // 洛阳·驿站管事
  npc_luoyang_postmaster: {
    id:'npc_luoyang_postmaster', name:'钱通', role:'洛阳驿站管事', category:'misc', avatar:'📮',
    city:'luoyang', level:45, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:80,
    greetings:[
      '洛阳驿站，四通八达！天下信件包裹，皆由此中转。',
      '客官有急件要送？本驿站承接各地快马传递，保证准时送达！',
      '最近各地往来信件颇多，驿站人手紧缺，正缺可靠的跑腿人。',
    ],
    topics:[
      { id:'t_ly_post_service', text:'打听驿站业务', reply:'本驿站连接天下三十六道，北通幽燕，南达岭南，西接关中，东连齐鲁。快马一日可达，普通信件三日必至。', relDelta:2 },
      { id:'t_ly_post_rate', text:'询问邮费价格', reply:'普通信件五钱，加急一两，特快三两。若是贵重物品，还可保价，万无一失。', relDelta:0 },
      { id:'t_ly_post_job', text:'问问有没有活干', reply:'正好！有批急件要送往各地，你若顺路，每趟都有酬劳。去柜台找我就是。', relDelta:5 },
    ],
    shop: null,
    quests:['quest_daily_deliver'],
    intels: ['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  长安城 NPCs  (capital · 关中盆地)
  // ══════════════════════════════════════════════════════════

  // 长安·大唐客栈掌柜
  xian_inn: {
    id:'xian_inn', name:'胡大壮', role:'客栈掌柜', category:'inn', avatar:'🧔',
    city:'xian', level:57, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_ranger',
    silver:80,
    greetings:[
      '欢迎光临大唐客栈！长安城最大的客栈，住着舒心，吃着放心！',
      '客官是从洛阳来的？这一路上可不太平，最近关中道上盗匪多了不少。',
      '长安城皇城脚下，三教九流全聚齐，没事儿别在夜里出门，小心叫人顺了钱袋。',
    ],
    topics:[
      { id:'t_xa_inn_price', text:'打听住店价格', reply:'上房三两——长安物价贵，见谅！中房一两，大通铺五钱。', relDelta:0 },
      { id:'t_xa_inn_rumor', text:'长安城有什么大事？', reply:'皇城根下风云变幻啊。听说神策军最近在城西大肆抓人，说是查什么江湖细作，弄得人心惶惶。', relDelta:2, intelId:'intel_mingjiao_rise' },
      { id:'t_xa_inn_rest',  text:'住店一晚（10两）', reply:'好嘞！上房已备好，客官慢走不送！', relDelta:5, action:'inn_rest' },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_mingjiao_rise','intel_road_bandit'],
  },

  // 长安·惠仁医馆
  xian_doctor: {
    id:'xian_doctor', name:'林惠仁', role:'太医院出身', category:'medicine', avatar:'👩‍⚕️',
    city:'xian', level:54, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_scholar',
    silver:150,
    greetings:[
      '老身曾在太医院供职二十年，医术嘛，长安城里找不出几个比我强的。',
      '武人逞强，伤了根基最是麻烦，趁早治，莫要拖。',
      '这位客官气色不好，内伤未愈？来，让老身看看。',
    ],
    topics:[
      { id:'t_xa_doc_heal',  text:'治伤（35两）', reply:'长安物价贵，多收五两。（林惠仁手法精妙，银针疗伤效果极佳）', relDelta:3, action:'heal_hp' },
      { id:'t_xa_doc_talk',  text:'聊养生之道', reply:'行走江湖最重要的是护好心脉。每逢月圆之夜服一粒固元丹，能凝聚真元，延年益寿。', relDelta:4 },
      { id:'t_xa_doc_herbs', text:'买药', reply:'本馆草药皆从秦岭深处采办，货真价实。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      type:'medicine',
      items:[
        { id:'item_herb_blood',  name:'活血草',   desc:'活血化瘀，回复气血30',   icon:'🌿', price:7,  effect:{hp:30} },
        { id:'item_herb_qi',     name:'参须片',   desc:'大补内力，回复内力50',   icon:'🌱', price:14, effect:{mp:50} },
        { id:'item_herb_anti',   name:'解毒丸',   desc:'解除中毒状态',           icon:'💊', price:20, effect:{detox:true} },
        { id:'item_guyuan_pill', name:'固元丹',   desc:'回复气血80，长安太医秘制', icon:'💎', price:38, effect:{hp:80} },
        { id:'item_jingqi_pill', name:'精气丸',   desc:'回复气血40+内力60',     icon:'⚪', price:22, effect:{hp:40, mp:60} },
        { id:'item_baoji_pill',  name:'保命丸',   desc:'气血+50，精力+20，全能补给', icon:'🔶', price:30, effect:{hp:50, energy:20} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels:['intel_poison_cult'],
  },

  // 长安·龙泉兵器铺
  xian_smith: {
    id:'xian_smith', name:'秦铁虎', role:'龙泉铸剑师', category:'blacksmith', avatar:'⚔',
    city:'xian', level:88, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_soldier',
    silver:300,
    greetings:[
      '龙泉剑，长安造！秦某祖上三代铸剑，手艺传承百年！',
      '你这武器成色不行，拿来让秦某瞧瞧，能修则修，不能修就换把好的。',
      '长安城里真正的行家都来秦某这里置办兵器，你眼光不错。',
    ],
    topics:[
      { id:'t_xa_smith_story', text:'问他来历', reply:'秦某祖籍龙泉，十五岁入行，铸了一辈子剑。最得意的一把是二十年前为一位女侠打造的，那剑至今下落不明，唉……', relDelta:6 },
      { id:'t_xa_smith_tip',   text:'打听名剑行情', reply:'近年好剑难求，玄铁稀缺。听说华山剑宗那位紫霄真人藏着一柄无名古剑，寒光逼人，不知是何来历。', relDelta:2, intelId:'intel_kunlun_sword' },
    ],
    shop:{
      items:[
        { id:'item_whet',         name:'龙泉磨刀石', desc:'提升攻击力8，持续5回合',     icon:'🪨', price:12, effect:{atkBuff:8,  turns:5} },
        { id:'item_oil',          name:'护甲油脂',   desc:'提升防御力8，持续5回合',     icon:'🫙', price:10, effect:{defBuff:8,  turns:5} },
        { id:'item_arrow',        name:'精钢镖针',   desc:'暗器类武器消耗品×5',         icon:'🏹', price:15, effect:{special:'dart_ammo'} },
        { id:'item_speed_oil',    name:'疾风步靴脂', desc:'速度+5，持续4回合',          icon:'💨', price:18, effect:{speedBuff:5, turns:4} },
        { id:'item_heavy_whet',   name:'重刃磨石',   desc:'攻击力+12，持续3回合（重武器专用）',icon:'🔩',price:20,effect:{atkBuff:12, turns:3}},
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels:['intel_kunlun_sword'],
  },

  // 长安·胡姬酒肆
  xian_tavern: {
    id:'xian_tavern', name:'波斯香', role:'胡姬掌柜', category:'misc', avatar:'💃',
    city:'xian', level:53, tier:'func',
    weapon:'wep_short_knife', armor:'cs_scholar',
    silver:120,
    greetings:[
      '欢迎！长安胡姬酒肆，西域美酒，长安独一份！',
      '今日新到葡萄酒，来自西域大宛，香气馥郁，客官要尝尝吗？',
      '哎，丝绸之路上的客商今天又来了一批，热闹着呢！',
    ],
    topics:[
      { id:'t_xa_tav_drink',  text:'喝壶西域葡萄酒（5两）', reply:'（波斯香倒了满满一杯，殷红如血，香气四溢）大宛葡萄酒，甘甜醇厚，请慢用！', relDelta:5, action:'buy_drink' },
      { id:'t_xa_tav_gossip', text:'打听西域消息', reply:'丝绸之路上最近不太平，听说有支商队在玉门关外遭劫，那帮人功夫了得，连护镖的高手都没能幸免……', relDelta:3, intelId:'intel_trade_route' },
      { id:'t_xa_tav_dance',  text:'请她跳段胡旋舞（3两）', reply:'（波斯香换上彩裙，鼓点一响，翩然起舞，满座喝彩，精神为之一振）', relDelta:8, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_wine_grape',   name:'葡萄美酒',  desc:'西域名酒，精力+35',           icon:'🍷', price:7,  effect:{energy:35} },
        { id:'item_wine_mare',    name:'马奶酒',    desc:'草原烈酒，精力+40微微上头',   icon:'🍶', price:5,  effect:{energy:40, dizzy:true} },
        { id:'item_food_lamb',    name:'胡人烤羊',  desc:'鲜嫩烤全羊，饱食度+55',      icon:'🍖', price:15, effect:{food:55} },
        { id:'item_food_naan',    name:'胡饼',      desc:'西域大饼，饱食度+28',         icon:'🫓', price:3,  effect:{food:28} },
        { id:'item_western_spice',name:'西域香料',  desc:'珍贵香料，送人好感+8或自用提振精神', icon:'🌶️', price:12, effect:{rel_bonus:8} },
        { id:'item_wine_strong',  name:'烈焰蒸酒',  desc:'高度烈酒，精力+50，攻击+5持续2回合', icon:'🔥', price:18, effect:{energy:50, atkBuff:5, turns:2} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels:['intel_trade_route'],
  },

  // 长安·隐剑老人
  xian_swordmaster: {
    id:'xian_swordmaster', name:'裴玄清', role:'关中剑圣', category:'misc', avatar:'🧘',
    city:'xian', level:106, tier:'elite',
    weapon:'wep_heaven_sword', armor:'cs_ep_sword',
    silver:50,
    greetings:[
      '老夫在此隐居十年，你能找到这里，说明有些缘分。',
      '剑之道，在于心静如水。你的眼神太浮，需要磨砺。',
      '长安城的繁华，与老夫无关。找老夫，必有要事。',
    ],
    topics:[
      { id:'t_xa_sword_ask',   text:'请教剑法心得', reply:'剑分三境：以力御剑，以气御剑，以意御剑。你现在处于第几境？（注视你片刻）嗯……有根骨，可以指点。', relDelta:5 },
      { id:'t_xa_sword_train', text:'请求指点（关系>40）', reply:'你有这份诚心，老夫传你一式"玄清一剑"，须用心体会。', relDelta:10, action:'train_skill', minRel:40 },
      { id:'t_xa_sword_past',  text:'问他过去', reply:'（许久沉默）当年关中第一剑客之名，老夫当仁不让。后来一战之后，心灰意冷，从此不再过问江湖事。', relDelta:6 },
    ],
    shop:null,
    quests:['quest_test_talent','quest_swordsman_duel_honor','quest_elder_ancient_tome','quest_gossip_weird_duel','chain_hermit_d1'],
    intels:['intel_cultivation_tip'],
  },

  // 长安·长安首富
  xian_merchant: {
    id:'xian_merchant', name:'安禄金', role:'西域商王', category:'shop', avatar:'👳',
    city:'xian', level:73, tier:'func',
    weapon:'wep_blood_saber', armor:'cs_scholar',
    silver:800,
    greetings:[
      '哈哈，朋友！安禄金的货，西域第一！价格公道，货真价实！',
      '丝绸之路，安某走了三十年，见过的宝贝比你数过的银子还多！',
      '做生意是缘分，客官进来看看，说不定有你喜欢的。',
    ],
    topics:[
      { id:'t_xa_merch_buy',  text:'看看货物', reply:'这边是丝绸、香料；那边是珍宝、异域宝物。都是正经货，不骗你！', relDelta:0, action:'open_shop' },
      { id:'t_xa_merch_task', text:'有没有任务', reply:'安某有批货要从长安运到凉州，路上不太平，你若顺路，报酬丰厚！', relDelta:3 },
      { id:'t_xa_merch_info', text:'打听丝路行情', reply:'玉门关外最近不太平，大宛来的商队折损了三成。香料、宝石价格飞涨，现在进货是好时机！', relDelta:2, intelId:'intel_trade_route' },
    ],
    shop:{
      items:[
        { id:'item_spice',       name:'西域香料', desc:'异域香料，可换取好感度', icon:'🫙', price:20, effect:{rel_bonus:10} },
        { id:'item_elixir',      name:'灵药',   desc:'回复气血内力各50',       icon:'⚗',  price:45, effect:{hp:50, mp:50} },
        { id:'item_grape_wine',  name:'大宛葡萄酒', desc:'极品美酒，精力+45',  icon:'🍯', price:30, effect:{energy:45} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels:['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  幽州·燕京 NPCs  (capital · 天龙帮总坛)
  // ══════════════════════════════════════════════════════════

  // 幽州·燕云客栈
  youzhou_inn: {
    id:'youzhou_inn', name:'耶律风', role:'客栈掌柜', category:'inn', avatar:'🧔',
    city:'youzhou', level:67, tier:'func',
    weapon:'wep_uc_dao', armor:'cs_ranger',
    silver:90,
    greetings:[
      '哈，来自南方的侠客？燕京欢迎你！本店燕云客栈，北地第一！',
      '北边的风可大着呢，外面刮起来能把人吹走，先进来暖暖！',
      '天龙帮今儿在校场比武，整个燕京都热闹起来了，要不要去看看？',
    ],
    topics:[
      { id:'t_yz_inn_price', text:'打听住店价格', reply:'上房二两，中房八钱，大通铺三钱。燕京汉胡都有，住着热闹！', relDelta:0 },
      { id:'t_yz_inn_rumor', text:'燕京城有什么新鲜事？', reply:'听说天龙帮最近和辽东一个新兴的武林势力起了摩擦，帮主亲自出马谈判，结果不欢而散，只怕要动刀兵了……', relDelta:2, intelId:'intel_mingjiao_rise' },
      { id:'t_yz_inn_rest',  text:'住店一晚（10两）', reply:'好！夜里冷，被子我给你多加一床！', relDelta:5, action:'inn_rest' },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_mingjiao_rise','intel_road_bandit'],
  },

  // 幽州·北地圣手
  youzhou_doctor: {
    id:'youzhou_doctor', name:'萨满老巫', role:'北地巫医', category:'medicine', avatar:'🧙‍♂️',
    city:'youzhou', level:52, tier:'func',
    weapon:'wep_staff_wind', armor:'cs_cloth',
    silver:100,
    greetings:[
      '老夫行医用的是草原巫医之法，听起来玄，但治伤的本事不输中原名医。',
      '北地风寒，内伤最怕冻，得趁早处置。',
      '你这气色，有隐伤未愈。来，坐下，让老夫看看。',
    ],
    topics:[
      { id:'t_yz_doc_heal',  text:'治伤', reply:'（老巫取出骨针，施以草原古法，片刻气血回复）北地秘法，比你们中原的针灸还管用！', relDelta:3, action:'heal_hp' },
      { id:'t_yz_doc_talk',  text:'聊聊北地武学', reply:'草原人练武靠的是骑射和摔跤，大开大合，力量惊人。但内力修炼比不上中原门派精深，各有所长。', relDelta:4 },
      { id:'t_yz_doc_herbs', text:'买草药', reply:'这是草原药草，和中原的不一样，但治外伤和风寒效果极佳！', relDelta:0, action:'open_shop' },
    ],
    shop:{
      type:'medicine',
      items:[
        { id:'item_herb_blood', name:'活血草',   desc:'活血化瘀，回复气血30', icon:'🌿', price:8,  effect:{hp:30} },
        { id:'item_herb_qi',    name:'参须片',   desc:'大补内力，回复内力50', icon:'🌱', price:15, effect:{mp:50} },
        { id:'item_herb_anti',  name:'解毒丸',   desc:'解除中毒状态',         icon:'💊', price:20, effect:{detox:true} },
        { id:'item_herb_wind',  name:'御寒丹',   desc:'抵御寒气，回复精力35', icon:'❄',  price:18, effect:{energy:35} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels:['intel_poison_cult'],
  },

  // 幽州·北疆铸兵坊
  youzhou_smith: {
    id:'youzhou_smith', name:'铁木真', role:'北地铸兵师', category:'blacksmith', avatar:'⚒',
    city:'youzhou', level:83, tier:'major',
    weapon:'wep_wolf_fang', armor:'cs_general',
    silver:250,
    greetings:[
      '哼，你这武器太轻了，北地行走得用重兵器，打起来才够劲！',
      '俺的兵器在草原上砍过狼群，在战场上劈过铁甲，绝对过硬！',
      '中原的刀剑做工精细，但北地的斧钺够狠够重，各有妙处。',
    ],
    topics:[
      { id:'t_yz_smith_story', text:'聊聊他的来历', reply:'俺本是草原铁匠的儿子，后来随父亲来到燕京定居。见过大漠风沙，见过中原繁华，锤了一辈子铁，不后悔。', relDelta:6 },
      { id:'t_yz_smith_tip',   text:'打听北地武器', reply:'辽东有一种寒铁，天寒地冻中百炼而成，打出的兵器极其锋利。听说天龙帮老帮主手里就有一把，不知是否在世。', relDelta:2, intelId:'intel_kunlun_sword' },
    ],
    shop:{
      items:[
        { id:'item_whet',   name:'玄铁磨刀石', desc:'提升攻击力5，持续5回合', icon:'🪨', price:12, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',    name:'护甲油脂',   desc:'提升防御力5，持续5回合', icon:'🫙', price:10, effect:{defBuff:5, turns:5} },
        { id:'item_arrow',  name:'骨制弓箭',   desc:'暗器类武器消耗品',       icon:'🏹', price:15, effect:{special:'dart_ammo'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels:['intel_kunlun_sword'],
  },

  // 幽州·胡人酒肆
  youzhou_tavern: {
    id:'youzhou_tavern', name:'扎拉', role:'胡人酒馆老板', category:'tavern', avatar:'🍺',
    city:'youzhou', level:63, tier:'func',
    weapon:'wep_iron_fist', armor:'cs_ranger',
    silver:100,
    greetings:[
      '哈哈！进来喝酒！北地烈酒，喝了暖身，比中原的好喝十倍！',
      '今天天龙帮的弟兄来喝酒，你跟他们坐一桌，不怕的话！',
      '有钱就喝，没钱就走，扎拉的酒肆不赊账！',
    ],
    topics:[
      { id:'t_yz_tav_drink',  text:'喝碗马奶酒（3两）', reply:'好，来！（扎拉端上一大碗马奶酒）一口闷下去！', relDelta:5, action:'buy_drink' },
      { id:'t_yz_tav_gossip', text:'打听燕京消息', reply:'前几天天龙帮抓了个奸细，说是辽东来的探子，当场就……（扎拉抬手做了个抹脖子的手势）这地方混不好要命的！', relDelta:3, intelId:'intel_local_gossip' },
      { id:'t_yz_tav_arm',    text:'看看有没有消遣', reply:'（扎拉哈哈大笑）你要消遣？后院有摔跤，赌谁赢，赌注随便下！', relDelta:8, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_mare_wine',  name:'马奶酒',  desc:'草原烈酒，精力+30',        icon:'🍶', price:3,  effect:{energy:30} },
        { id:'item_fire_wine',  name:'北疆烈火酒', desc:'极烈，精力+45微微上头', icon:'🔥', price:10, effect:{energy:45, dizzy:true} },
        { id:'item_roast_meat', name:'烤羊排',  desc:'饱食度+45',               icon:'🍖', price:12, effect:{food:45} },
        { id:'item_dry_meat',   name:'风干牛肉', desc:'干粮，饱食度+20',        icon:'🥩', price:5,  effect:{food:20} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels:['intel_local_gossip'],
  },

  // 幽州·天龙帮探子
  youzhou_spy: {
    id:'youzhou_spy', name:'乔大勇', role:'天龙帮副堂主', category:'quest', avatar:'🕵',
    city:'youzhou', level:97, tier:'elite',
    weapon:'wep_xuanming_palm', armor:'cs_ep_iron',
    silver:200,
    greetings:[
      '（眼神锐利地打量你）你是外地来的？来燕京做什么？',
      '天龙帮在燕京说了算，不知道的话，现在知道了。',
      '有什么消息想知道？乔某消息最灵通，就看你出不出得起价钱。',
    ],
    topics:[
      { id:'t_yz_spy_ask',   text:'打听天龙帮', reply:'天龙帮是北方第一大帮，帮众三千，帮主乔天义，铁腕手段，无人敢惹。你是想入帮还是找茬？', relDelta:3 },
      { id:'t_yz_spy_intel', text:'买情报（10两）', reply:'（压低声音）告诉你个消息，辽东那边有人在暗中招募武林高手，说是要图谋什么大事，具体的……我也只知道这些。', relDelta:5, action:'pay_info', intelId:'intel_tianshu' },
      { id:'t_yz_spy_fight', text:'你敢跟我比试？', reply:'（冷笑）你知道上一个在燕京找茬的人在哪里吗？北城外的乱葬岗。——不过，你有胆量，乔某倒有些欣赏。', relDelta:-5 },
    ],
    shop:null,
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels:['intel_tianshu','intel_trade_route'],
  },

  // 幽州·行走草原的商人
  youzhou_merchant: {
    id:'youzhou_merchant', name:'慕容博达', role:'塞外行商', category:'misc', avatar:'🧑‍💼',
    city:'youzhou', level:50, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:400,
    greetings:[
      '客官，北地特产、草原珍品，要不要看看？慕容博达的货，草原上跑了二十年！',
      '马皮、兽骨、草原宝石，中原难得一见。',
      '你是南方来的？好，南方的货我也收，有没有江南特产？',
    ],
    topics:[
      { id:'t_yz_merch_buy',  text:'看看货物', reply:'这是草原上的好东西，中原买不到，好眼力的客官才识货！', relDelta:0, action:'open_shop' },
      { id:'t_yz_merch_task', text:'有没有任务', reply:'慕容某有批货要从燕京运到中原，路上有劫匪，你若顺路护送，分你三成利！', relDelta:3 },
      { id:'t_yz_merch_info', text:'打听北地行情', reply:'草原今年牛羊大丰收，皮毛价格下来了。但铁器价格在涨，辽东打仗，铁都被征用了。', relDelta:2, intelId:'intel_trade_route' },
    ],
    shop:{
      items:[
        { id:'item_fur',         name:'狐裘',    desc:'北地珍贵皮毛，保暖', icon:'🦊', price:35, effect:{defBuff:3, turns:999} },
        { id:'item_elixir',      name:'灵药',    desc:'回复气血内力各50',   icon:'⚗',  price:40, effect:{hp:50, mp:50} },
        { id:'item_horse_milk',  name:'草原马奶', desc:'精力+35',            icon:'🥛', price:8,  effect:{energy:35} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels:['intel_trade_route'],
  },

  // 幽州·北地女侠
  youzhou_swordwoman: {
    id:'youzhou_swordwoman', name:'塞北雁', role:'幽州女侠', category:'misc', avatar:'🦅',
    city:'youzhou', level:72, tier:'major',
    weapon:'wep_uc_spear', armor:'cs_soldier',
    silver:300,
    greetings:[
      '塞北风烈，养出的女儿自然也是铁骨铮铮！',
      '俺名叫塞北雁，在幽云十六州这片地界，走的路比很多男人都长。',
      '胡人的骑射、中原的枪法——俺两样都会，你想见识哪个？',
    ],
    topics:[
      { id:'t_yz_sw_border', text:'打听边关情况', reply:'最近北边的鞑子又不消停了，牧马南下骚扰村庄，幽州守军人手不够……你若有意，边关缺好手。', relDelta:7, intelId:'intel_road_bandit' },
      { id:'t_yz_sw_skill', text:'学习骑射', reply:'骑射是草原的绝技，俺自幼跟胡人学的。你要学，先把腰马功夫练好！', relDelta:5, action:'go_skills' },
      { id:'t_yz_sw_task', text:'有没有任务', reply:'北边有个村子被劫了，乡亲们无力反击，俺正打算去教训那帮马贼，你来不来？', relDelta:10 },
    ],
    shop: null,
    quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  扬州城 NPCs  (capital · 江南水乡)
  // ══════════════════════════════════════════════════════════

  // 扬州·瘦西湖畔客栈
  yangzhou_inn: {
    id:'yangzhou_inn', name:'柳如梦', role:'客栈掌柜', category:'inn', avatar:'👩',
    city:'yangzhou', level:52, tier:'func',
    weapon:'wep_short_knife', armor:'cs_scholar',
    silver:70,
    greetings:[
      '欢迎来到瘦西湖畔客栈！扬州城最风雅的地方，柳某保证让客官住得舒心。',
      '烟花三月下扬州，客官来得好时节，今夜明月正好，不醉不归！',
      '南宫世家今日在湖边设宴，热闹得很，客官若有兴趣不妨去瞧瞧。',
    ],
    topics:[
      { id:'t_yz2_inn_price', text:'打听住店价格', reply:'上房三两，环境比中原好上不少；中房一两，大通铺五钱。', relDelta:0 },
      { id:'t_yz2_inn_rumor', text:'扬州城有什么新鲜事？', reply:'南宫世家的少世主南宫明月最近出来走动了，据说正在寻访武林高手，也不知为何。姑娘生得如花似玉，见者无不倾心。', relDelta:2, intelId:'intel_local_gossip' },
      { id:'t_yz2_inn_rest',  text:'住店一晚（10两）', reply:'好！今夜月色美，客官睡前不妨在湖边走走。', relDelta:5, action:'inn_rest' },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_local_gossip','intel_road_bandit'],
  },

  // 扬州·悬壶堂名医
  yangzhou_doctor: {
    id:'yangzhou_doctor', name:'周妙手', role:'江南名医', category:'misc', avatar:'🧓',
    city:'yangzhou', level:56, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_cloth',
    silver:130,
    greetings:[
      '周某行医三十年，扬州城里的疑难杂症，没有治不好的。',
      '江南水土好，但湿气重，最容易伤骨头。武人尤其要注意。',
      '气色还好，不过经脉有些瘀堵，要不要调理一下？',
    ],
    topics:[
      { id:'t_yz2_doc_heal',  text:'治伤', reply:'（周妙手指法如飞，银针点穴，片刻痛楚尽消）江南针法，比北地粗针细腻多了。', relDelta:3, action:'heal_hp' },
      { id:'t_yz2_doc_talk',  text:'聊聊江南医术', reply:'江南湿气重，这里的医者都擅长祛湿通络。周某有一套专门针对武人内伤的针法，效果显著。', relDelta:4 },
      { id:'t_yz2_doc_herbs', text:'购买草药', reply:'江南草药水分足，药性温和却见效快。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      type:'medicine',
      items:[
        { id:'item_herb_blood', name:'活血草',   desc:'活血化瘀，回复气血30',   icon:'🌿', price:8,  effect:{hp:30} },
        { id:'item_herb_qi',    name:'参须片',   desc:'大补内力，回复内力50',   icon:'🌱', price:15, effect:{mp:50} },
        { id:'item_herb_anti',  name:'解毒丸',   desc:'解除中毒状态',           icon:'💊', price:20, effect:{detox:true} },
        { id:'item_lotus_pill', name:'荷花养气丸', desc:'江南秘制，气血+50',   icon:'🪷', price:30, effect:{hp:50} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels:['intel_poison_cult'],
  },

  // 扬州·运河兵器坊
  yangzhou_smith: {
    id:'yangzhou_smith', name:'蒋百炼', role:'江南剑师', category:'blacksmith', avatar:'🔧',
    city:'yangzhou', level:57, tier:'func',
    weapon:'wep_uc_iron_sword', armor:'cs_ranger',
    silver:180,
    greetings:[
      '江南的剑讲究个轻、快、准！蒋某打的剑，力虽不如北地，但出剑快半拍，就是要命！',
      '客官这兵器，北地粗铁打的？来来，江南精铁才配配看。',
      '运河边上的铁坊，南来北往的好料都在这儿过，眼界宽得很。',
    ],
    topics:[
      { id:'t_yz2_smith_story', text:'聊他的故事', reply:'蒋某年轻时跟着一位姓独孤的老剑客学过铸剑，那老人说：最好的剑，是适合主人的剑，不是最贵的剑。此言至今受益。', relDelta:6 },
      { id:'t_yz2_smith_tip',   text:'打听扬州武器市场', reply:'扬州是江南枢纽，好东西都往这里流。听说最近有人在出售一把古剑，来历不明，已经换了好几个主人，每个主人都死于非命……', relDelta:2, intelId:'intel_kunlun_sword' },
    ],
    shop:{
      items:[
        { id:'item_whet',  name:'精磨刀石', desc:'提升攻击力5，持续5回合', icon:'🪨', price:12, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',   name:'护甲油脂', desc:'提升防御力5，持续5回合', icon:'🫙', price:10, effect:{defBuff:5, turns:5} },
        { id:'item_arrow', name:'飞蝗石',   desc:'暗器类武器消耗品',       icon:'🔮', price:18, effect:{special:'dart_ammo'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels:['intel_kunlun_sword'],
  },

  // 扬州·画舫花楼
  yangzhou_tavern: {
    id:'yangzhou_tavern', name:'红袖添香', role:'画舫花魁', category:'tavern', avatar:'💃',
    city:'yangzhou', level:66, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_scholar',
    silver:200,
    greetings:[
      '客官，红袖为您斟酒！扬州花雕，天下无双！',
      '今夜月色正好，共饮一杯，忘却江湖烦忧，如何？',
      '来，进来坐坐，红袖这里消息最灵通，什么都知道一点儿。',
    ],
    topics:[
      { id:'t_yz2_tav_drink',  text:'喝一杯花雕（5两）', reply:'（红袖轻启朱唇，微微一笑，亲手斟满）扬州花雕，陈年二十载，请慢用。', relDelta:5, action:'buy_drink' },
      { id:'t_yz2_tav_gossip', text:'打听扬州秘闻', reply:'（附耳低语）南宫少世主在找一本古籍，好像跟扬州旧事有关，还有人说，三十年前的一桩灭门惨案另有隐情……', relDelta:3, intelId:'intel_tianshu' },
      { id:'t_yz2_tav_sing',   text:'请她唱曲（5两）', reply:'（红袖拈起桃花扇，莺声婉转，月色为之失色。满堂宾客鸦雀无声，如痴如醉）', relDelta:10, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_huadiao',   name:'花雕酒',  desc:'扬州名酒，精力+30',        icon:'🍷', price:8,  effect:{energy:30} },
        { id:'item_peach_blossom', name:'桃花酿', desc:'醉人美酒，精力+40微微上头', icon:'🍶', price:12, effect:{energy:40, dizzy:true} },
        { id:'item_jiangnan_cake', name:'江南糕点', desc:'精致小食，饱食度+25', icon:'🍡', price:5,  effect:{food:25} },
        { id:'item_crab',     name:'大闸蟹',  desc:'江南特产，饱食度+35',       icon:'🦀', price:15, effect:{food:35} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels:['intel_tianshu','intel_local_gossip'],
  },

  // 扬州·南宫世家武师
  yangzhou_guard: {
    id:'yangzhou_guard', name:'南宫浩然', role:'南宫世家护法', category:'sect', avatar:'🥋',
    city:'yangzhou', level:97, tier:'elite',
    weapon:'wep_dragon_lance', armor:'cs_ep_sword',
    silver:300,
    greetings:[
      '（打量你）来扬州的江湖人不少，但如你这般气度的不多。',
      '本护法守护南宫世家已二十年，未尝一败。你若有胆，可以试试。',
      '世家门前闲杂人等不得靠近。你有什么事？',
    ],
    topics:[
      { id:'t_yz2_guard_ask',   text:'打听南宫世家', reply:'南宫世家家传"飞燕十三剑"，已传承八代。世家之人文武皆修，在江南声望极高。', relDelta:3 },
      { id:'t_yz2_guard_train', text:'请求切磋（关系>40）', reply:'（点头）好。难得有人主动找本护法切磋。你若能接下三十招，本护法传你一式家传剑法。', relDelta:10, action:'train_skill', minRel:40 },
      { id:'t_yz2_guard_past',  text:'聊聊过去', reply:'二十年前，本护法曾游历天下，后遇南宫老家主，蒙其收留，此后便在世家效力，报答知遇之恩。', relDelta:6 },
    ],
    shop:null,
    quests:['quest_guard_spy_hunt','quest_guard_bandit_clear','quest_guard_patrol_border','quest_daily_guard_patrol'],
    intels:['intel_cultivation_tip'],
  },

  // 扬州·运河大商
  yangzhou_merchant: {
    id:'yangzhou_merchant', name:'钱百万', role:'运河大商', category:'misc', avatar:'💰',
    city:'yangzhou', level:50, tier:'func',
    weapon:'wep_tao_charm', armor:'cs_scholar',
    silver:600,
    greetings:[
      '哎哟，客官，钱百万这里，天下好货应有尽有！',
      '运河跑了三十年，从扬州到大都，没有钱某不知道的商路。',
      '你是侠客？好！侠客最讲信义，钱某最爱和侠客做生意！',
    ],
    topics:[
      { id:'t_yz2_merch_buy',  text:'看看货物', reply:'进来进来！瓷器、丝绸、茶叶、珍宝，应有尽有，看上哪件直说！', relDelta:0, action:'open_shop' },
      { id:'t_yz2_merch_task', text:'有没有任务', reply:'正好！钱某有批江南丝绸要运到北方，路上劫匪多，你若顺路护送，利润分你二成！', relDelta:3 },
      { id:'t_yz2_merch_info', text:'打听江南行情', reply:'扬州是江南货物集散地，什么都贵。今年江南大丰收，粮价稳，但丝绸价格因北方战事翻了一番。', relDelta:2, intelId:'intel_trade_route' },
    ],
    shop:{
      items:[
        { id:'item_silk',        name:'江南丝绸', desc:'精品丝绸，换取好感', icon:'🎀', price:25, effect:{rel_bonus:10} },
        { id:'item_elixir',      name:'灵药',   desc:'回复气血内力各50', icon:'⚗',  price:40, effect:{hp:50, mp:50} },
        { id:'item_jiaxing_rice', name:'嘉兴米酒', desc:'精力+40',       icon:'🍶', price:12, effect:{energy:40} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels:['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  成都城 NPCs  (capital · 天府之国)
  // ══════════════════════════════════════════════════════════

  // 成都·锦官城客栈
  chengdu_inn: {
    id:'chengdu_inn', name:'王巴蜀', role:'巴蜀掌柜', category:'misc', avatar:'🧓',
    city:'chengdu', level:67, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:65,
    greetings:[
      '来来来，进来坐！成都的茶馆和客栈，哪一家不是一绝？',
      '客官从哪里来？蜀道难行，能进成都的都是有本事的人！',
      '今天茶馆来了个说书人，讲唐门的秘闻，一会儿要不要去听听？',
    ],
    topics:[
      { id:'t_cd_inn_price', text:'问住宿价格', reply:'上房二两，中房八钱，大通铺四钱。成都物价比北方低，住得实惠！', relDelta:0 },
      { id:'t_cd_inn_rumor', text:'成都城有什么新鲜事？', reply:'唐门最近在城外秘密操练，还购置了大批铁料，不知是在打造什么暗器。成都人私下都在猜测，是不是要出山了？', relDelta:2, intelId:'intel_local_gossip' },
      { id:'t_cd_inn_rest',  text:'住店一晚（10两）', reply:'好！成都夜里凉快，睡得香！', relDelta:5, action:'inn_rest' },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_local_gossip','intel_road_bandit'],
  },

  // 成都·天府神医
  chengdu_doctor: {
    id:'chengdu_doctor', name:'杜若仙', role:'药王传人', category:'medicine', avatar:'👩‍⚕️',
    city:'chengdu', level:56, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_cloth',
    silver:110,
    greetings:[
      '蜀中草药遍地，杜某行医用药取自峨眉山深处，药效远胜中原。',
      '你这身上有毒？别慌，蜀中解毒圣手是杜某，没有解不了的毒。',
      '武人最怕唐门的暗器之毒，那毒发作起来，神仙都难救。',
    ],
    topics:[
      { id:'t_cd_doc_heal',  text:'治伤', reply:'（杜若仙取出峨眉山草药，炮制成药，服下后痛楚渐消）蜀中草药，内外兼治！', relDelta:3, action:'heal_hp' },
      { id:'t_cd_doc_talk',  text:'聊蜀中医术', reply:'蜀中独门解毒之法，是家传秘技。唐门的毒三百余种，杜某会的解药只有二百九十九种，还有一种……至今未解。', relDelta:4 },
      { id:'t_cd_doc_herbs', text:'买草药', reply:'峨眉山的草药，成都独有，外面买不到！', relDelta:0, action:'open_shop' },
    ],
    shop:{
      type:'medicine',
      items:[
        { id:'item_herb_blood',  name:'活血草',   desc:'活血化瘀，回复气血30', icon:'🌿', price:8,  effect:{hp:30} },
        { id:'item_herb_qi',     name:'参须片',   desc:'大补内力，回复内力50', icon:'🌱', price:15, effect:{mp:50} },
        { id:'item_herb_anti',   name:'解毒丸',   desc:'解除中毒状态',         icon:'💊', price:20, effect:{detox:true} },
        { id:'item_emei_pill',   name:'峨眉养元丹', desc:'蜀中秘方，气血+50内力+30', icon:'🟢', price:45, effect:{hp:50, mp:30} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels:['intel_poison_cult'],
  },

  // 成都·天府兵器铺
  chengdu_smith: {
    id:'chengdu_smith', name:'霍铁锤', role:'蜀中铸兵师', category:'blacksmith', avatar:'🔨',
    city:'chengdu', level:72, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_soldier',
    silver:220,
    greetings:[
      '蜀中铁矿出好料，霍某打的兵器，唐门都来订制！',
      '客官眼力好！这些都是按唐门要求打造的余货，质量有保障！',
      '你这武器成色不错，北方货？蜀铁更硬，有兴趣换换看？',
    ],
    topics:[
      { id:'t_cd_smith_story', text:'聊他的故事', reply:'霍某的父亲给唐门打了三十年暗器，做了一辈子见不得光的活儿，临终前让霍某改行打正经兵器。唉，这行当……', relDelta:6 },
      { id:'t_cd_smith_tip',   text:'打听成都武器市场', reply:'唐门最近大量采购铁料，有人猜测是要打造一批新式暗器。具体什么形制，霍某猜不透，但那老掌门的眼神吓人。', relDelta:2, intelId:'intel_poison_cult' },
    ],
    shop:{
      items:[
        { id:'item_whet',   name:'蜀铁磨刀石', desc:'提升攻击力5，持续5回合', icon:'🪨', price:12, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',    name:'护甲油脂',   desc:'提升防御力5，持续5回合', icon:'🫙', price:10, effect:{defBuff:5, turns:5} },
        { id:'item_arrow',  name:'袖箭镖头',   desc:'暗器类武器消耗品',       icon:'🏹', price:18, effect:{special:'dart_ammo'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels:['intel_poison_cult'],
  },

  // 成都·锦城茶馆
  chengdu_tavern: {
    id:'chengdu_tavern', name:'小辣椒', role:'茶馆小二', category:'tavern', avatar:'🌶',
    city:'chengdu', level:70, tier:'func',
    weapon:'wep_short_knife', armor:'cs_cloth',
    silver:50,
    greetings:[
      '来来来，坐！成都茶馆，喝茶听曲聊是非，啥都有！',
      '今天说书先生说到精彩处，客官来得好时候！',
      '要喝辣的还是不辣的？成都菜，不辣不算吃饭！',
    ],
    topics:[
      { id:'t_cd_tav_drink',  text:'喝碗盖碗茶（1两）', reply:'（小辣椒麻利地摆上盖碗，滚烫的香茶倒上）成都盖碗茶，天下第一！', relDelta:5, action:'buy_drink' },
      { id:'t_cd_tav_gossip', text:'打听成都消息', reply:'今天茶馆里来了个从峨眉山下来的和尚，说是看见山上有血迹，还有人哭……说到这儿，那和尚就走了，到现在都没回来！', relDelta:3, intelId:'intel_local_gossip' },
      { id:'t_cd_tav_eat',    text:'吃顿成都火锅（5两）', reply:'（一锅红汤咕嘟咕嘟冒着热气，麻辣鲜香，吃完浑身通透，精力大振！）', relDelta:8, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_gaiwan_tea',  name:'盖碗茶',  desc:'成都名茶，精力+20',         icon:'🍵', price:1,  effect:{energy:20} },
        { id:'item_baijiu',      name:'蜀中白酒', desc:'烈酒，精力+40微微上头',    icon:'🍶', price:8,  effect:{energy:40, dizzy:true} },
        { id:'item_hotpot',      name:'成都火锅', desc:'大餐，饱食度+55精力+20',   icon:'🍲', price:15, effect:{food:55, energy:20} },
        { id:'item_jiaobo',      name:'椒伯饼',  desc:'特色干粮，饱食度+20',      icon:'🥮', price:3,  effect:{food:20} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels:['intel_local_gossip'],
  },

  // 成都·唐门外门弟子
  chengdu_tangmen: {
    id:'chengdu_tangmen', name:'唐笑风', role:'唐门外门弟子', category:'sect', avatar:'🎯',
    city:'chengdu', level:87, tier:'major',
    weapon:'wep_stone_bow', armor:'cs_ranger',
    silver:180,
    greetings:[
      '唐门弟子不轻易露面，你遇见唐某，是你的缘分，也许是你的劫数。',
      '（手中暗器把玩）不要乱动，唐某的机关弩，百步之内，无声无息。',
      '找唐门有什么事？说清楚，唐某时间不多。',
    ],
    topics:[
      { id:'t_cd_tang_ask',   text:'打听唐门', reply:'唐门机关暗器甲天下，外门弟子也不是好惹的。你打听这些是想入门还是找麻烦？', relDelta:2 },
      { id:'t_cd_tang_train', text:'切磋一下（关系>40）', reply:'（微微一笑）唐某出手从不留情，你确定？——好，唐某教你唐门入门暗器心法。', relDelta:10, action:'train_skill', minRel:40 },
      { id:'t_cd_tang_secret', text:'打听唐门秘密（10两）', reply:'（想了想，接过银子）告诉你一件事：唐门最近在研制一种新毒，毒性极烈，据说是为了对付一个旧敌……就这些。', relDelta:5, action:'pay_info', intelId:'intel_tianshu' },
    ],
    shop:null,
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels:['intel_tianshu','intel_poison_cult'],
  },

  // 成都·蜀商巨贾
  chengdu_merchant: {
    id:'chengdu_merchant', name:'程天财', role:'蜀中大商', category:'misc', avatar:'🧑‍💼',
    city:'chengdu', level:67, tier:'func',
    weapon:'wep_tao_charm', armor:'cs_scholar',
    silver:450,
    greetings:[
      '程某在成都做了二十年生意，天府之国，物华天宝，要什么有什么！',
      '今年蜀中大丰收，粮食便宜，但铁器贵了——唐门采购太多了。',
      '客官是走江湖的？好！程某有几件事正缺一个稳当的人帮忙。',
    ],
    topics:[
      { id:'t_cd_merch_buy',  text:'看看货物', reply:'蜀锦、川茶、花椒、成都特产，应有尽有，物美价廉！', relDelta:0, action:'open_shop' },
      { id:'t_cd_merch_task', text:'有没有任务', reply:'程某有批蜀锦要走汉中北上，途中山路难走、匪患不少，你若顺路护送，报酬丰厚！', relDelta:3 },
      { id:'t_cd_merch_info', text:'打听蜀中行情', reply:'蜀中封闭，物价稳，但最近唐门大量采购铁料，导致铁器价格涨了三成。外省货物翻倍，本地的反而平稳。', relDelta:2, intelId:'intel_trade_route' },
    ],
    shop:{
      items:[
        { id:'item_sichuan_tea', name:'雅安茶砖', desc:'蜀中名茶，精力+30', icon:'🍵', price:15, effect:{energy:30} },
        { id:'item_elixir',      name:'灵药',   desc:'回复气血内力各50', icon:'⚗',  price:40, effect:{hp:50, mp:50} },
        { id:'item_sichuan_wine', name:'剑南春', desc:'蜀中名酒，精力+45', icon:'🍯', price:28, effect:{energy:45} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels:['intel_trade_route'],
  },

  // 成都·女镖头
  chengdu_escort_woman: {
    id:'chengdu_escort_woman', name:'刀三娘', role:'川中女镖头', category:'escort', avatar:'🗡',
    city:'chengdu', level:70, tier:'major',
    weapon:'wep_uc_dao', armor:'cs_ranger',
    silver:320,
    greetings:[
      '四川的辣椒和四川的刀，都是出了名的厉害！刀三娘，你们怕不怕？',
      '俺走镖二十年，蜀道走烂了几双鞋，但护的货，一件没出事！',
      '找俺的江湖人不少，但俺挑人——没骨气的、没义气的，俺不要！',
    ],
    topics:[
      { id:'t_cd_ew_join', text:'了解走镖情况', reply:'俺目前有条线从成都到夔州，再沿江下到重庆，沿途有些土匪但不算难对付。你要参与？', relDelta:6 },
      { id:'t_cd_ew_intel', text:'打听成都江湖', reply:'成都最近唐门和南方某门派暗中较劲，表面上风平浪静，实际上黑市里的毒药买卖多了好几倍……', relDelta:7, intelId:'intel_sect_secret' },
      { id:'t_cd_ew_task', text:'有没有任务', reply:'有批很重要的货要从成都急送到洛阳，委托人出价极高，但他要求绝对保密——你能做到？', relDelta:9 },
    ],
    shop: null,
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_gossip_weird_duel'],
    intels: ['intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  金陵·南京 NPCs  (capital · 秦淮河畔)
  // ══════════════════════════════════════════════════════════

  // 金陵·秦淮客栈
  nanjing_inn: {
    id:'nanjing_inn', name:'柳半城', role:'秦淮老掌柜', category:'misc', avatar:'🧓',
    city:'nanjing', level:63, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:75,
    greetings:[
      '秦淮河畔，柳某经营了三十年，金陵城里最有故事的客栈！',
      '夜里秦淮河上的画舫歌声飘过来，睡不着也值了。',
      '客官来得好！今晚河边有诗会，文人武侠都去，热闹得很！',
    ],
    topics:[
      { id:'t_nj_inn_price', text:'问住宿价格', reply:'临河上房三两，景色一绝；中房一两；大通铺四钱。', relDelta:0 },
      { id:'t_nj_inn_rumor', text:'金陵有什么大事？', reply:'最近秦淮河对岸来了个神秘人，据说是某个大帮派的使者，跟金陵几大世家接连密谈，不知商量什么。', relDelta:2, intelId:'intel_local_gossip' },
      { id:'t_nj_inn_rest',  text:'住店一晚（10两）', reply:'好！临河的房间，夜里有风，听着河上的曲子入眠，再好不过。', relDelta:5, action:'inn_rest' },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_local_gossip','intel_road_bandit'],
  },

  // 金陵·杏林圣手
  nanjing_doctor: {
    id:'nanjing_doctor', name:'薛仁俊', role:'江南名医', category:'misc', avatar:'👨‍⚕️',
    city:'nanjing', level:57, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_cloth',
    silver:120,
    greetings:[
      '薛某行医于金陵二十载，文人的心病和武人的刀伤，都能治。',
      '武人多逞强，伤了不说，拖到不能动才来，可不好治了。',
      '气色尚可，不过眼神有些疲惫，是近来忧心事多？',
    ],
    topics:[
      { id:'t_nj_doc_heal',  text:'治伤', reply:'（薛仁俊手法从容，银针点穴，片刻内伤渐愈）金陵的医术兼收并蓄，各家所长皆有涉猎。', relDelta:3, action:'heal_hp' },
      { id:'t_nj_doc_talk',  text:'聊金陵风土', reply:'金陵是六朝古都，文气极重，武学在此反而显得秀气。薛某见过的侠客，在金陵住久了，都变得文雅起来，有趣。', relDelta:4 },
      { id:'t_nj_doc_herbs', text:'买药', reply:'金陵附近山水俱佳，药材品质上乘。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      type:'medicine',
      items:[
        { id:'item_herb_blood',  name:'活血草',    desc:'活血化瘀，回复气血30', icon:'🌿', price:8,  effect:{hp:30} },
        { id:'item_herb_qi',     name:'参须片',    desc:'大补内力，回复内力50', icon:'🌱', price:15, effect:{mp:50} },
        { id:'item_herb_anti',   name:'解毒丸',    desc:'解除中毒状态',         icon:'💊', price:20, effect:{detox:true} },
        { id:'item_qinhuai_pill', name:'秦淮养心丸', desc:'宁心安神，精力+40',  icon:'🌸', price:25, effect:{energy:40} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels:['intel_poison_cult'],
  },

  // 金陵·铁器坊
  nanjing_smith: {
    id:'nanjing_smith', name:'宋锻云', role:'金陵铁器匠', category:'blacksmith', avatar:'⚒',
    city:'nanjing', level:64, tier:'func',
    weapon:'wep_uc_iron_sword', armor:'cs_ranger',
    silver:160,
    greetings:[
      '金陵的铁器坊比不上北方大，但做工精细，一把剑拿出来，文人都舍不得砍人。',
      '宋某打的剑带花纹，看着好看，但你放心，实战照样管用！',
      '客官来看看？金陵客人眼光高，选的兵器都不寻常。',
    ],
    topics:[
      { id:'t_nj_smith_story', text:'聊他的故事', reply:'宋某年轻时学的是雕刻，后来发现刻铁比刻木更有意思，就改行打铁了。金陵人，做什么都讲究个"雅"字。', relDelta:6 },
      { id:'t_nj_smith_tip',   text:'打听武器消息', reply:'最近有人在金陵收购古兵器，出价极高，不知是谁在背后指使。那些古兵器都有来历，恐怕不是普通收藏……', relDelta:2, intelId:'intel_kunlun_sword' },
    ],
    shop:{
      items:[
        { id:'item_whet',  name:'精磨刀石', desc:'提升攻击力5，持续5回合', icon:'🪨', price:12, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',   name:'护甲油脂', desc:'提升防御力5，持续5回合', icon:'🫙', price:10, effect:{defBuff:5, turns:5} },
        { id:'item_arrow', name:'精钢镖针', desc:'暗器类武器消耗品',       icon:'🏹', price:18, effect:{special:'dart_ammo'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels:['intel_kunlun_sword'],
  },

  // 金陵·秦淮画舫酒家
  nanjing_tavern: {
    id:'nanjing_tavern', name:'陈秦淮', role:'秦淮酒家掌柜', category:'tavern', avatar:'🎭',
    city:'nanjing', level:68, tier:'func',
    weapon:'wep_short_knife', armor:'cs_scholar',
    silver:90,
    greetings:[
      '秦淮名食名酒，金陵第一！陈某欢迎各路好汉！',
      '今夜河上灯火，岸边美酒，此情此景，不饮可惜！',
      '客官是外地来的？金陵好地方，住下来好好玩几天！',
    ],
    topics:[
      { id:'t_nj_tav_drink',  text:'喝壶金陵美酒（4两）', reply:'（陈秦淮斟上一壶陈年花雕）金陵花雕，存了十年，香气经久不散，请慢用！', relDelta:5, action:'buy_drink' },
      { id:'t_nj_tav_gossip', text:'打听秦淮秘事', reply:'（低声）前几日有人在河边发现了一具江湖人的尸体，身上没有兵器，但腰间有个特殊的标记……不知是哪个帮派的手笔。', relDelta:3, intelId:'intel_local_gossip' },
      { id:'t_nj_tav_poetry', text:'赏夜宴听曲（3两）', reply:'（陈秦淮安排了一席夜宴，琴声悠扬，诗词唱和，心境开阔，精神大振）', relDelta:8, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_qinhuai_wine', name:'秦淮花雕', desc:'金陵名酒，精力+30',       icon:'🍷', price:6,  effect:{energy:30} },
        { id:'item_spring_wine',  name:'金陵春',  desc:'陈年美酒，精力+45微上头', icon:'🍶', price:12, effect:{energy:45, dizzy:true} },
        { id:'item_duck',         name:'金陵盐水鸭', desc:'金陵特产，饱食度+35',  icon:'🦆', price:10, effect:{food:35} },
        { id:'item_osmanthus',    name:'桂花糕',  desc:'精致小食，饱食度+20',     icon:'🍰', price:4,  effect:{food:20} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels:['intel_local_gossip'],
  },

  // 金陵·隐居剑侠
  nanjing_hermit: {
    id:'nanjing_hermit', name:'独孤晚云', role:'金陵剑隐', category:'misc', avatar:'🧘',
    city:'nanjing', level:93, tier:'elite',
    weapon:'wep_ghost_blade', armor:'cs_ep_shadow',
    silver:30,
    greetings:[
      '（望着秦淮河发呆，许久后侧目）你找我？',
      '老夫不问江湖事已三十年，今日你来，必有缘故。',
      '秦淮河水，百年如故。江湖人事，百年也没变过。',
    ],
    topics:[
      { id:'t_nj_herm_ask',   text:'请教剑道', reply:'剑道只有一句话：出剑无悔。其余的，你自己悟去。', relDelta:5 },
      { id:'t_nj_herm_train', text:'恳求指点（关系>50）', reply:'（沉默片刻，站起身）你诚心如此，老夫传你"晚云一剑"——天下剑法，皆在其中。', relDelta:15, action:'train_skill', minRel:50 },
      { id:'t_nj_herm_past',  text:'问他的过去', reply:'（苦笑）当年，天下人称老夫"剑神"。后来……有人死在老夫剑下，老夫便再也拔不出剑了。从此隐居于此，以自赎。', relDelta:8 },
    ],
    shop:null,
    quests:['quest_test_talent','quest_hermit_seek_material','quest_hermit_old_friend','quest_gossip_haunted_inn'],
    intels:['intel_cultivation_tip'],
  },

  // 金陵·金陵首富
  nanjing_merchant: {
    id:'nanjing_merchant', name:'陆锦华', role:'金陵大商', category:'misc', avatar:'💎',
    city:'nanjing', level:75, tier:'func',
    weapon:'wep_tao_charm', armor:'cs_scholar',
    silver:700,
    greetings:[
      '陆某在金陵经营三十年，金陵最大的绸缎庄和米行都是陆某的产业。',
      '做生意的人，最怕兵荒马乱，不怕江湖争斗，因为侠客需要买东西！',
      '客官来得正好，陆某正有一桩生意想托付给可靠的江湖人。',
    ],
    topics:[
      { id:'t_nj_merch_buy',  text:'看看货物', reply:'金陵绸缎、江南茶叶、古董字画……陆某这里什么都有，就看客官的品味了。', relDelta:0, action:'open_shop' },
      { id:'t_nj_merch_task', text:'有没有任务', reply:'陆某有批货要运往福建泉州，海路不太平，你若顺路，分你三成利！', relDelta:3 },
      { id:'t_nj_merch_info', text:'打听金陵行情', reply:'金陵文风鼎盛，什么都贵。古董字画最有市场，但水很深。江南今年粮价平稳，丝绸因北方战事涨了不少。', relDelta:2, intelId:'intel_trade_route' },
    ],
    shop:{
      items:[
        { id:'item_painting',    name:'名人字画', desc:'金陵珍品，换取好感', icon:'🎨', price:40, effect:{rel_bonus:15} },
        { id:'item_elixir',      name:'灵药',    desc:'回复气血内力各50', icon:'⚗',  price:40, effect:{hp:50, mp:50} },
        { id:'item_nanjing_wine', name:'金陵春酒', desc:'精力+42',        icon:'🍯', price:20, effect:{energy:42} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels:['intel_trade_route'],
  },

  // 金陵·女词人
  nanjing_poetess: {
    id:'nanjing_poetess', name:'秋月', role:'金陵女词人', category:'misc', avatar:'🌙',
    city:'nanjing', level:60, tier:'major',
    weapon:'wep_tao_charm', armor:'cs_robe',
    silver:180,
    greetings:[
      '秦淮河上，月色如霜，最是多情——客官，俺的词作听一听？',
      '侠客用剑，文人用笔，俺秋月两样都用，你信不信？',
      '金陵城有学问的人多，但真正懂侠义的，寥寥无几，客官你呢？',
    ],
    topics:[
      { id:'t_nj_poet_read', text:'听一首词', reply:'【秋月轻吟，一首秦淮风月词，满含江湖儿女情怀，令人心旷神怡】', relDelta:10 },
      { id:'t_nj_poet_intel', text:'打听金陵文坛', reply:'近来金陵出了件怪事——某大族收藏的孤本武学秘籍不翼而飞，涉嫌盗取之人竟是个女子，但没有人见过她的脸。', relDelta:8, intelId:'intel_tianshu' },
      { id:'t_nj_poet_task', text:'有没有任务', reply:'有位老学者委托俺寻一本古籍，说在城南某书坊，但书坊主不肯卖，你能帮俺想个法子？', relDelta:9 },
    ],
    shop:{ items:[
      { id:'item_qinhuai_wine', icon:'🍷', name:'秦淮花酒', desc:'金陵特酿，精力+35，心情愉悦', price:22, effect:{ energy:35 } },
      { id:'item_poem_scroll', icon:'📜', name:'词卷一册', desc:'名家手抄词册，赠礼好感+15', price:50, effect:{ rel_bonus:15 } },
    ]},
    quests:['quest_song_request','quest_scholar_collect_poems','quest_scholar_protect_scroll','quest_daily_copy_errand','quest_poet_odd_client','quest_gossip_plagiarism'],
    intels: ['intel_tianshu'],
  },

  // ══════════════════════════════════════════════════════════

};
