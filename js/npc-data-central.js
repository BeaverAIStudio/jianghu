// npc-data-central.js — 中原+江南+华北+西北 major城 NPC
// 自动从 npc-data.js 拆分生成

Object.assign(NPC_DB, {
  //  开封城 NPCs  (major · 汴梁)
  // ══════════════════════════════════════════════════════════

  kaifeng_inn: {
    id:'kaifeng_inn', name:'汴梁老方', role:'客栈掌柜', category:'inn', avatar:'🧓',
    city:'kaifeng', level:30, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:55,
    greetings:{
      hostile:[
        '汴梁老方把算盘珠一拨："想闹事去街口武馆，这里是客栈，不是让人抖横的地方。"',
        '开封人讲体面。你若只是来探口风、不给句明白话，老方这儿可不留。',
      ],
      guarded:[
        '住店、问路，还是打听人？你先把来意说清，老方才知道该把你往哪张桌上请。',
        '这年头投店的人多，带祸上门的人也不少。你若想听实话，先别跟老方打哈哈。',
      ],
      neutral:[
        '汴梁汴梁，天下中心！老方的客栈，开封城里最地道！',
        '客官从洛阳来？那路上可有不少好汉，最近太不平了。',
        '汴河边上今日来了条大船，说是江南商队，听说载着什么稀罕货。',
      ],
      friendly:[
        '来啦？靠窗坐，汴河风凉。你若想听城里的新风声，老方给你挑干净的说。',
        '你这人住店不挑事、问话也有分寸，老方记着呢。真有麻烦事，未必不能先知会你。',
      ],
      close:[
        '自己掀帘子进就是。你如今算半个自家客，老方不跟你摆开封掌柜那套场面话。',
        '外头人只当老方会做生意，你却知道我更会认人。你来了，便说明有正事可谈。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'chain_inn_a3', status:'claimed' },
        greetings:{
          neutral:['汴梁老方把热茶往你手边一推："那位旅客总算脱了险，连住店的客人都安心了不少。你若想听他后来又交代了什么，坐下慢慢说。"'],
          friendly:['汴梁老方笑着把账册合了半本："人救回来后，店里伙计见谁都夸你靠谱。你既来了，老方把那份谢礼后头的门道给你讲讲。"'],
          close:['汴梁老方把你往里间让了让："外头只知道旅客平安，老方却知道，他留下的那份口信比银子还沉。你该听。"'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_inn_a3', statuses:['active','done'] },
        greetings:{
          neutral:['汴梁老方把柜台擦得锃亮，声音却压得很低："人已经救出来了，可那位旅客带着的后话还没交代完。你若是来收尾，老方就在等你。"'],
          friendly:['汴梁老方朝后院偏了偏头："那位旅客缓过气以后，口口声声说有要命的消息只肯交给可信的人。你若方便，俺也去替你把门。"'],
          close:['汴梁老方把门帘往下压了压："人是救回来了，可真正值钱的东西还在他嘴里。你既到了，俺也去不让闲人来搅。"'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_inn_a2', statuses:['active','done'] },
        greetings:{
          neutral:['汴梁老方把茶碗扣在桌上："天地帮那头目还没倒下，老方这心里一直悬着。你若有信，先说人。"'],
          friendly:['汴梁老方朝门外望了一眼："那帮人敢在开封扣人换钱，分明是拿咱这地界试刀。你若准备动手，俺也去把他们常露脸的地方再给你捋一遍。"'],
          close:['汴梁老方把嗓门压成一线："这已不是普通寻人，是有人想借那旅客钓更大的鱼。你若真要砍那头目，俺也去把怀疑都摊给你。"'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_inn_a1', statuses:['active','done'] },
        greetings:{
          neutral:['汴梁老方把抹布往肩上一搭："那位失踪旅客的线头，俺也去越想越不对。你若查到了城西那边的风声，就别绕弯子。"'],
          friendly:['汴梁老方给你添了半盏热茶："旅客这事八成扯上了天地帮，老方现在最缺的，就是一个肯替我把线摸深的人。"'],
          close:['汴梁老方往柜台里靠了靠："你既肯接这档子麻烦事，俺也去就不藏了。那旅客不是普通住客，他后头还有更脏的账。"'],
        }
      },
    ],
    topics:[
      { id:'t_kf_inn_price', text:'问住宿价格', reply:'上房一两半，中房六钱，大通铺两钱。', relDelta:0 },
      { id:'t_kf_inn_rumor', text:'开封城有什么事？', reply:'前几天有人在汴河边跌了跤，摔出来一个铁盒子，里头是一张藏宝图……到现在不知落谁手里了，满城都在传这件事！', relDelta:2, intelId:'intel_treasure_cave', excludesQuestStates:[{ questId:'chain_inn_a1', statuses:['active','done'] }, { questId:'chain_inn_a2', statuses:['active','done'] }, { questId:'chain_inn_a3', statuses:['active','done'] }] },
      { id:'t_kf_inn_rest',  text:'住店一晚（10两）', reply:'好！上房给你打扫好了，汴河夜景没得说！', relDelta:5, action:'inn_rest' },
      { id:'t_kf_inn_eye', text:'问老方怎么看出客人心里有事', reply:'汴梁老方嘿了一声："看鞋底、看包袱、看进门先看哪边。真有鬼的人，一进门先找退路；真赶路的人，先找热水和床。"', repeatReply:'汴梁老方把算盘拨得啪啪响："认人这门手艺，靠的不是神通，是见得够多。你若常在客栈里蹲，也会看。"', relDelta:4 },
      { id:'t_kf_inn_oldcase', text:'顺着他年轻时遇过的怪客再问一句', doneText:'再问老方见过最难忘的怪客', reply:'汴梁老方眯眼想了想："最难忘的不是武功最高的，是一个进门时笑得客气、出门时满身血的人。那一夜我就懂了，江湖人最怕的不是凶，是太会装。"', repeatReply:'汴梁老方把茶壶往炉上搁稳："老话头说一次就够，再多就成了吓人。你心里记住，进门太稳的人，未必真稳。"', relDelta:6, minRel:60, requiresTopic:'t_kf_inn_eye' },
      { id:'t_kf_inn_clue', text:'问那位旅客究竟招惹了谁', doneText:'再问那旅客为何会落到天地帮手里', reply:'汴梁老方压低声音："老方看他不是惹事，是知道了不该知道的东西。天地帮若只是图财，不会把人悄悄扣到城西去，还专挑没人问的时候下手。"', repeatReply:'汴梁老方用指节敲了敲柜台："这类事最麻烦的不是谁动手，是谁在背后点头。你若顺着查，别只盯着明面上的喽啰。"', relDelta:4, minRel:20, requiresQuestState:{ questId:'chain_inn_a1', statuses:['active','done'] } },
      { id:'t_kf_inn_hostage', text:'问那帮天地帮想拿旅客换什么', doneText:'再问那头目最可能把人押去哪儿', reply:'汴梁老方把嗓门压得极低："若只为赎金，早该递话了。老方更怕他们要的不是银子，是旅客怀里那点见不得光的消息。"', repeatReply:'汴梁老方往城西方向努努嘴："那帮人办事最爱借空宅和旧仓房遮眼。真押人，多半也是这种地方，方便转手，也方便灭口。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_inn_a2', statuses:['active','done'] } },
      { id:'t_kf_inn_message', text:'问那名信使留下了什么后话', doneText:'再听听那名信使交代的尾巴', reply:'汴梁老方叹了口气："人缓过神后，说的第一句不是谢救命，是问那封信到底有没有落到正主手里。你看，真做信使的，命能丢，话却不敢丢。"', repeatReply:'汴梁老方把茶碗推近些："江湖上最吓人的，不一定是刀口，是有人明知会丢命，还非把一句话送出去。那旅客就是这种命。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_inn_a3', status:'claimed' } },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general','chain_inn_a1'],
    intels:['intel_treasure_cave','intel_road_bandit'],
  },

  kaifeng_doctor: {
    id:'kaifeng_doctor', name:'范杏林', role:'开封郎中', category:'medicine', avatar:'👨‍⚕️',
    city:'kaifeng', level:35, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_cloth',
    silver:90,
    greetings:{
      hostile:[
        '范杏林把药碾一放："若只是来逞能吹伤，老范没空陪你。真有病，就把手伸出来。"',
        '医馆里救命，不听空话。你若还想硬撑着装没事，门在那边。',
      ],
      guarded:[
        '先说是刀伤、毒伤，还是旧伤反复。你若藏着掖着，老范也没法替你下针。',
        '开封这阵子伤者太多，老范不怕忙，就怕有人把真病拖成死病。你别学他们。',
      ],
      neutral:[
        '范某医馆在开封城开了二十年，刀伤箭伤、内伤外伤，都能治。',
        '最近江湖上打打杀杀多，老范我每天忙得很！',
        '客官面色不好，是有伤在身？让老范看看。',
      ],
      friendly:[
        '又来了？上回那点瘀血才刚散，别又拿命去跟人硬顶。坐，老范先给你把脉。',
        '你这人肯听劝，省了老范不少口舌。路上若再撞见怪伤怪毒，先回医馆再说。',
      ],
      close:[
        '来，把袖子挽起来。你的脉路老范已经摸熟了七八分，是旧伤翻上来，还是又替人挡了一记？',
        '老范看你这人心热手快，最容易替别人扛事。往后真碰上疑难病案，记得先来医馆同我商量。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'chain_doc_b3', status:'claimed' },
        greetings:{
          neutral:['范杏林把新写好的方子压在药案上："那位病人总算捡回了一条命。你若还想听后头怎样将养，老范今日肯多说两句。"'],
          friendly:['范杏林把药盏往你手边推了推："你来得巧，那位病人这两日已能下地，老范正想把后话跟你交代完。"'],
          close:['范杏林长出一口气："这桩病案能收尾，多亏你没中途松手。坐近些，老范把他醒来后说的话讲给你听。"'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_doc_b2', statuses:['active','done'] },
        greetings:{
          neutral:['范杏林把药包压得很紧："那伙劫药的贼人还在盯这味解毒药。你若有信，就先说紧要的。"'],
          friendly:['范杏林把门帘拨严了些："药材暂时护住了，可盯上它的人不简单。你若在外头听见什么，先告诉老范。"'],
          close:['范杏林压低声音："如今不是缺药，是缺敢把这伙人追到底的腿脚。你既来了，老范就不瞒你。"'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_doc_b1', statuses:['active','done'] },
        greetings:{
          neutral:['范杏林把空药盏往案角一搁："那味解毒药还差最后一味。你若是来问病案后续，今日正赶得上。"'],
          friendly:['范杏林捻着药须点了点头："那位病人的脉象还吊着一线，全看那味药能不能及时寻回。你来得正好。"'],
          close:['范杏林把旧脉案摊开："这回不是普通看诊，是在跟阎王抢人。你若还愿意听，老范便把缺口都告诉你。"'],
        }
      },
    ],
    topics:[
      { id:'t_kf_doc_heal',  text:'治伤（25两）', reply:'开封物价比长安低，收你便宜点。（施针片刻，气血渐复）', relDelta:3, action:'heal_hp' },
      { id:'t_kf_doc_herbs', text:'买草药', reply:'这里的草药从嵩山、伏牛山一带采来，药效不错。', relDelta:0, action:'open_shop' },
      { id:'t_kf_doc_talk',  text:'聊聊江湖见闻', reply:'最近来老范这里治伤的，有少林的武僧，也有日月神教的人，两拨人只差没在老范医馆里再打一场！', repeatReply:'范杏林摇了摇头："医馆里最怕的不是人多，是带着火气来的江湖人。真让他们在药柜前动手，老范这点家底就别想保了。"', relDelta:4, excludesQuestStates:[{ questId:'chain_doc_b1', statuses:['active','done'] }, { questId:'chain_doc_b2', statuses:['active','done'] }, { questId:'chain_doc_b3', statuses:['active','done'] }] },
      { id:'t_kf_doc_pulse', text:'请他评一句自己的气血路数', doneTextStages:{ neutral:'再请范郎中评一句气血路数', friendly:'再让范杏林把把脉', close:'再请范杏林看看旧伤脉路' }, reply:'范杏林扣住你腕脉，沉吟片刻："底子不差，坏就坏在出手太猛。你若总仗着年轻硬扛，再好的经脉也得叫你磨出裂口。"', replyStages:{ neutral:'范杏林扣住你腕脉，沉吟片刻："底子不差，坏就坏在出手太猛。你若总仗着年轻硬扛，再好的经脉也得叫你磨出裂口。"', friendly:'范杏林把完脉后语气缓了缓："比上回来得顺些，说明你多少听进了老范的话。再收三分火气，路会更长。"', close:'范杏林收回手指，像训自家晚辈似的看你一眼："筋骨和心气老范都摸得差不多了。你不是没本事，是总爱把自己当药渣子熬。"' }, repeatReplyStages:{ neutral:'范杏林摆摆手："脉路不是一日能改的，记着少逞强、多养气。"', friendly:'范杏林点点头："继续这么养，比乱吃补药强得多。"', close:'范杏林给你拢了拢袖口："还是那句话，旧伤若翻，不许硬扛。"' }, relDelta:5, minRel:20 },
      { id:'t_kf_doc_oldrecord', text:'顺着医馆旧病案再多问一句', doneText:'病案翻过了，再追一句', reply:'范杏林翻出一摞旧药案，缓声道："江湖上最难治的，从来不是毒，是人心。很多伤拖成绝症，不是没药，是病人不肯把真话说全。"', repeatReply:'范杏林把药案重新合上："老范能说的就这些。再往下，就得看你能不能把人心里的病根也揪出来。"', relDelta:6, minRel:60, requiresTopic:'t_kf_doc_talk' },
      { id:'t_kf_doc_chainherb', text:'问那味解毒药还差什么', doneText:'再问那味药的药性', reply:'范杏林拈起一撮晒干的药末："这味药最难的不是找，是认。寻常人看它像枯草，真下到汤里却能把奇毒逼出去三分。若带错了，反倒催命。"', repeatReply:'范杏林把药末重新包好："记住它闻着淡，入口却苦得发涩。见着相近的草，也别急着摘。"', relDelta:4, minRel:20, requiresQuestState:{ questId:'chain_doc_b1', statuses:['active','done'] } },
      { id:'t_kf_doc_chainambush', text:'问劫药那伙人是什么路数', doneText:'再问那伙人背后的来路', reply:'范杏林眉头压得很低："他们下手不像寻常劫匪，更像识药性、也识病人底细的人。若只是图财，不会盯得这样准。"', repeatReply:'范杏林把门帘掀开一线又放下："这帮人多半有人递信。真追这条线，得防的不止明刀。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_doc_b2', statuses:['active','done'] } },
      { id:'t_kf_doc_chainafter', text:'问那位病人后来可醒了', doneText:'再听听那病人的后话', reply:'范杏林长出一口气："人醒了，先问的不是命保住没有，而是托付出去的那件事办没办成。江湖人有时就是这样，命刚捡回来，先惦记的还是肩上那点责任。"', repeatReply:'范杏林把药碗推远了些："病是压住了，可旧债旧怨未必真完。你我都知道，这案子后头还有尾巴。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_doc_b3', status:'claimed' } },
    ],
    shop:{
      type:'medicine',
      items:[
        { id:'item_herb_blood', name:'活血草',   desc:'活血化瘀，回复气血30', icon:'🌿', price:7,  effect:{hp:30} },
        { id:'item_herb_qi',    name:'参须片',   desc:'大补内力，回复内力50', icon:'🌱', price:13, effect:{mp:50} },
        { id:'item_herb_anti',  name:'解毒丸',   desc:'解除中毒状态',         icon:'💊', price:18, effect:{detox:true} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','chain_doc_b1'],
    intels:['intel_poison_cult'],
  },

  kaifeng_smith: {
    id:'kaifeng_smith', name:'铁牛儿', role:'汴梁铁匠', category:'blacksmith', avatar:'🔨',
    city:'kaifeng', level:43, tier:'func',
    weapon:'wep_uc_dao', armor:'cs_general',
    silver:140,
    greetings:{
      hostile:[
        '铁牛儿头也不抬："只会动嘴不会动手的，别挡着俺炉火。真懂兵器，再开口。"',
        '俺这儿卖的是家伙，不卖气受。你若只是来找不痛快，出门左拐。',
      ],
      guarded:[
        '把兵器先递来看看。是来买、来修，还是来套俺的话？',
        '炉火正旺，别绕弯子。你若真有眼力，俺自然肯多说两句。',
      ],
      neutral:[
        '汴梁铁匠，顶顶有名！铁牛儿的刀，开封城里卖了二十年，回头客最多！',
        '你这武器缺个开刃，拿来我给你磨磨，不贵！',
        '最近铁料紧缺，价钱往上走，但铁牛儿保证价格公道！',
      ],
      friendly:[
        '来得正好，俺也去刚开炉。你若看中哪块料子，趁热说，俺也去给你留一手。',
        '你这人不只懂看刀口，还懂让铁匠先把火候顾稳，俺也去乐意跟你多聊两句。',
      ],
      close:[
        '别在门口杵着，进炉边来。你如今看料的眼神，已经不像外行了。',
        '俺也去不跟你摆门面了。真碰上好矿好兵器，俺也去先让你看，旁人未必有这份面子。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'chain_smith_c3', status:'claimed' },
        greetings:{
          neutral:['铁牛儿把新淬好的刀横在案上："那口神兵总算出了炉。你若想听最后一锤是怎么落的，俺也去记得清清楚楚。"'],
          friendly:['铁牛儿咧嘴一笑："来得巧！俺也去正想让你看看那口新成的家伙。没有你跑出来的门路，这炉火可熬不到今天。"'],
          close:['铁牛儿朝你招了招手："进来听，别让外头人听见。那口神兵出炉时的响儿，俺也去只想说给你。"'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_smith_c2', statuses:['active','done'] },
        greetings:{
          neutral:['铁牛儿把火钳往炉膛里一探："图没拿回来前，俺也去这炉火不敢乱开。你若有后信，就赶紧说。"'],
          friendly:['铁牛儿盯着炉膛里那点蓝火："图纸一日不回，这块陨铁就一日只能干烧。俺也去等的就是你这边的准话。"'],
          close:['铁牛儿把嗓门压低："抢图的人未必识货，可他背后的人八成识。你若真摸到线，俺也去陪你把这事砸到底。"'],
        }
      },
      {
        requiresQuestState:{ questId:'chain_smith_c1', statuses:['active','done'] },
        greetings:{
          neutral:['铁牛儿把陨铁碎片往铁砧上一搁："老匠人的门路若真问出来，这块料子还有救。你来得正是时候。"'],
          friendly:['铁牛儿抹了把汗："俺也去守着这块陨铁守了好几夜，就等你带回古法的消息。"'],
          close:['铁牛儿把炉门拨开一线，让热浪扑了出来："你若还肯替俺也去这一趟，俺也去就把这炉压箱底的念想都摊给你听。"'],
        }
      },
    ],
    topics:[
      { id:'t_kf_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把东西拿来俺看看。火候见功夫，俺的眼睛见高低。', relDelta:0, action:'identify_equip' },
      { id:'t_kf_smith_story', text:'聊聊铁匠行当', reply:'铁牛儿的爷爷是给宋军打兵器的，到了铁牛儿这代，宋军没了，只给江湖人打刀，客源反而更广了，哈哈！', relDelta:6 },
      { id:'t_kf_smith_tip',   text:'打听武器消息', reply:'沧州有个新来的铸剑师，据说是北方哪个隐门的传人，打出的刀剑有怪力，杀伤力惊人，不知是真是假。', relDelta:2, intelId:'intel_kunlun_sword', excludesQuestStates:[{ questId:'chain_smith_c1', statuses:['active','done'] }, { questId:'chain_smith_c2', statuses:['active','done'] }, { questId:'chain_smith_c3', statuses:['active','done'] }] },
      { id:'t_kf_smith_edge', text:'问他怎么看刀识人', reply:'铁牛儿把刀在指节上轻轻一敲："看刀口最实在。用刀的人急不急、狠不狠、惜不惜命，都写在刃上。人嘴会装，刀口不会。"', repeatReply:'铁牛儿把刀递还给你："兵器是跟着主人的。你若肯把自家手上那点毛病改改，刀也会跟着顺。"', relDelta:4 },
      { id:'t_kf_smith_look', text:'请他评一评自己的兵器', reply:'铁牛儿接过你的家伙掂了掂："路子没错，就是保养太糙。真打起来，它未必先断，可你手上的劲会先乱。回去把腕力和收势再练练。"', relDelta:5, minRel:20 },
      { id:'t_kf_smith_oldarmy', text:'顺着祖上传下的军中旧事多问一句', doneText:'再问铁牛儿家里那点旧军器门路', reply:'铁牛儿望着炉膛里翻红的铁料，半晌才道："军中打铁和江湖打铁不一样。前者讲制式，后者讲命。俺家老人到死都说，真上战场时，一寸误差就是一条命。"', repeatReply:'铁牛儿把铁锤轻轻搁下："老话俺也去只能说到这儿。再多，就不是讲故事，是翻祖宗留下的旧账了。"', relDelta:6, minRel:60, requiresTopic:'t_kf_smith_story' },
      { id:'t_kf_smith_chaincraft', text:'问那位老匠人的古法门路', doneText:'再问那门古法到底缺哪一环', reply:'铁牛儿用火钳敲了敲陨铁："老法子讲究三样：识火、识料、识人。料俺也去有，火俺也去敢熬，偏偏少个真正见过古法的人点醒最后那一下。"', repeatReply:'铁牛儿往西边努努嘴："俺也去要问的不是招式，是火候里那口气。找不对人，再好的料子也得糟蹋。"', relDelta:4, minRel:20, requiresQuestState:{ questId:'chain_smith_c1', statuses:['active','done'] } },
      { id:'t_kf_smith_chainmap', text:'问那张锻造图为何这么要紧', doneText:'再问那张图到底记了什么', reply:'铁牛儿把铁锤轻轻搁下："图上未必全是招式，最值钱的是次序。先烧哪一面、几时淬火、几时回温，错一环，神兵就成废铁。"', repeatReply:'铁牛儿盯着炉火哼了一声："抢图的人多半只知道它值钱，不知道它值命。俺也去这口炉等得起，图纸可未必等得起。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_smith_c2', statuses:['active','done'] } },
      { id:'t_kf_smith_chainblade', text:'问那口神兵最后成了什么样', doneText:'再听听那口神兵出炉时的响', reply:'铁牛儿眼里难得露出点得意："最后一锤落下去时，整炉火像被人一把攥紧，连铁声都干净了。俺也去打了半辈子铁，知道那一声不是巧，是成了。"', repeatReply:'铁牛儿把掌心按在铁砧上："真成器的兵刃，不一定见血才吓人。有些家伙一出炉，站在旁边的人心里就先静了。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'chain_smith_c3', status:'claimed' } },
    ],
    shop:{
      items:[
        { id:'item_whet',  name:'磨刀石', desc:'提升攻击力5，持续5回合', icon:'🪨', price:10, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',   name:'护甲油', desc:'提升防御力5，持续5回合', icon:'🫙', price:8,  effect:{defBuff:5, turns:5} },
        { id:'item_arrow', name:'铁镖',   desc:'暗器类武器消耗品',       icon:'🏹', price:15, effect:{special:'dart_ammo'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','chain_smith_c1'],
    intels:['intel_kunlun_sword'],
  },

  // ══════════════════════════════════════════════════════════
  //  开封城·商会掌柜（商店NPC）
  // ══════════════════════════════════════════════════════════

  kaifeng_merchant: {
    id:'kaifeng_merchant', name:'钱进宝', role:'汴梁商会掌柜', category:'shop', avatar:'💰',
    city:'kaifeng', level:44, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:380,
    giftPrefs:{
      label:'古玩字画与金银细软',
      love:['raretrade','pearl','mechanism'],
      like:['pelt','mystic'],
      thanksLoved:[
        '这物件有来头，有眼力！钱某最喜欢跟懂货的人打交道。',
        '好东西，留着压箱底都值。钱某承你这份人情。'
      ],
      thanksLiked:[
        '有点意思，不是行外人随便买的那种货色。'
      ],
      questHint:'钱进宝把玩着手里的玉佩，神色亲热了不少，像是终于肯把手头的买卖说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问钱掌柜这单「${questName}」` : '追问钱掌柜手里那单买卖',
        questReply: ({ questName }) => questName
          ? `钱进宝摇着折扇笑道："既然你诚心想沾这笔生意，钱某也不瞒你——${questName}。路线和对接人，任务页里都写明白了。"` : '钱进宝把算盘轻轻拨了一下："我手里正有单走镖的买卖，汴梁商家都靠这条线吃饭。你若感兴趣，去任务页看看。"',
        intelText: () => '请钱掌柜把这条商路细说分明',
        intelReply: ({ intelText }) => `钱进宝压低了声音："${intelText}"`,
        warmText: () => '顺着账目继续往下谈',
        warmReply: ({ npcName }) => `${npcName}把玉佩收进袖中："你是个实在人。往后若还有路子，钱某第一个想到你。"`,
      }
    },
    greetings:{
      hostile:[
        '钱进宝眼皮一抬："钱某做的是正经买卖，不陪无聊人消遣时辰。"',
        '你这人进门就闻着一股蹭饭气，钱某这儿可没有白占的便宜。'
      ],
      guarded:[
        '汴梁城商会讲信义，但只对讲信义的人。阁下有何贵干？',
        '先说清楚要买还是要卖，再谈别的。钱某不爱听废话。'
      ],
      neutral:[
        '汴梁居天下之中，南来北往的货都从这儿过。钱某的商号在开封，少说也有二十年了。',
        '你是跑江湖的？正好，最近有批货要出手，你若有兴趣，可以谈谈。',
        '开封城繁华，什么货都有。钱某这儿只卖好东西，不卖水货。'
      ],
      friendly:[
        '来得正好，那批新到的货刚清点完，你眼光不错，先给你看看。',
        '钱某就欣赏你这种痛快人。有什么需要，尽管开口。'
      ],
      close:[
        '进里间说话，外头人多眼杂。有些买卖，不方便在外头谈。',
        '你是钱某信得过的人。有些路子旁人不能走，你却可以。'
      ],
    },
    topics:[
      { id:'t_kf_merch_buy',  text:'看看货物', reply:'这都是钱某走南闯北收来的好货，品质绝对有保证。', relDelta:0, action:'open_shop' },
      { id:'t_kf_merch_task', text:'问问有没有任务', reply:'有批货要从开封送去洛阳，沿途还算太平，你若顺路，报酬好商量。', relDelta:3 },
      { id:'t_kf_merch_info', text:'打听商道行情', reply:'北方最近不太平，走商的都往南边绕。开封这儿倒是热闹，汴河上下，日夜不停。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_kf_merch_credit', text:'问他为何信誉这么好', reply:'钱进宝摇着折扇："信誉这东西，丢一次就没有了。钱某宁可少赚一单，也不愿坏了自己的招牌。"', relDelta:4 },
      { id:'t_kf_merch_road', text:'问开封往哪条路最繁华', reply:'往南走是江南，鱼米之乡；往北走是燕云，多的是皮货和马匹；往西走是关中，那边铁器值钱。', relDelta:3 },
      { id:'t_kf_merch_cricket', text:'听说贵店有蛐蛐笼卖？', reply:'钱进宝压低声音："有是有，蛐蛐笼品质不错。不过最近进货的少了，你要是诚心要，钱某可以给你留一个。"', relDelta:1 },
    ],
    shop:{
      items:[
        { id:'item_map_piece',   name:'地图残片',   desc:'揭示附近隐藏地点',           icon:'🗺', price:25, effect:{reveal_map:true} },
        { id:'item_elixir',      name:'灵药',       desc:'回复气血内力各50',             icon:'⚗',  price:35, effect:{hp:50, mp:50} },
        { id:'item_wine_age',    name:'陈年汾酒',   desc:'极品美酒，精力+40',           icon:'🍯', price:20, effect:{energy:40} },
        { id:'item_lucky_incense',name:'祈福香',    desc:'燃香后气运小幅提升',         icon:'🕯️', price:15, effect:{rel_bonus:5} },
        { id:'item_travel_ration',name:'行路干粮',  desc:'耐储的行路口粮，饱食度+40',     icon:'🧆', price:8,  effect:{food:40} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐',icon:'🧺', price:40, effect:{} },
        // ── 高价值商品（经济平衡 A 类）──
        { id:'item_qi_pill',     name:'培元丹',     desc:'内力上限永久+20，需逐步吸收', icon:'💎', price:180, effect:{maxMp:20} },
        { id:'item_blood_pill',  name:'活血再造丹', desc:'气血上限永久+30，需逐步吸收', icon:'❤️‍🔥', price:250, effect:{maxHp:30} },
        { id:'item_teleport_scroll',name:'驿站急件', desc:'凭此可在驿站享受八折优惠（一次性）',icon:'📜', price:30, effect:{poststationDiscount:0.2} },
        { id:'item_respec_pill', name:'洗髓易筋丸', desc:'重分配全部自由属性点（不含出身点）',icon:'🔄', price:300, effect:{respec:true} },
        { id:'item_mat_pack_iron',name:'铁矿材料包', desc:'含铁矿石×8、煤炭×5，锻造必备', icon:'⛏️', price:65, effect:{materialPack:['item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_coal','item_coal','item_coal','item_coal','item_coal']} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_gossip_weird_duel'],
    intels:['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  成都城·商会掌柜（商店NPC → 杂货店入口）
  // ══════════════════════════════════════════════════════════
  chengdu_merchant: {
    id:'chengdu_merchant', name:'刘蜀商', role:'蜀中商会掌柜/商人', category:'shop', avatar:'💰',
    city:'chengdu', level:46, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:400,
    giftPrefs:{
      label:'蜀锦、茶叶与山货特产',
      love:['herb','spice','silk'],
      like:['pelt','mystic'],
      thanksLoved:[
        '这是上等蜀锦的颜色！识货！你这人，我刘某欣赏。',
        '好东西！川妹子都爱这个，你倒知道行情。'
      ],
      thanksLiked:[
        '有点意思，不是行外人随便买的那种货色。'
      ],
      questHint:'刘蜀商把算盘轻轻一拨："有点门路的人，生意就好做多了。"',
      followup:{
        questText: ({ questName }) => questName ? `追问刘掌柜这笔「${questName}」` : '追问刘掌柜手里那单买卖',
        questReply: ({ questName }) => questName
          ? `刘蜀商压低声音："${questName}。这事急不得，你去任务页里看看，规矩都写明白了。"` : '刘蜀商摇着折扇："我手里正有批蜀锦要送到南边去，你若感兴趣，去任务页看看。"',
        intelText: () => '请刘掌柜把这条商路细说分明',
        intelReply: ({ intelText }) => `刘蜀商压低了声音："${intelText}"`,
        warmText: () => '顺着生意经继续往下谈',
        warmReply: ({ npcName }) => `${npcName}把茶叶收进袖中："你是个实在人。下回川货南下，头一个想着你。"`,
      }
    },
    greetings:{
      hostile:[
        '刘蜀商眼皮一抬："李某做的是正经买卖，不陪无聊人消遣时辰。"',
        '你这人进门就闻着一股蹭饭气，我这儿可没有白占的便宜。'
      ],
      guarded:[
        '成都城商会讲信义，但只对讲信义的人。阁下有何贵干？',
        '先说清楚要买还是要卖，再谈别的。我不爱听废话。'
      ],
      neutral:[
        '蜀道难，难于上青天——可货还是要运的。我刘某在成都做了二十年买卖，什么货没见过。',
        '你是跑江湖的？正好，最近有批蜀锦要出手，你若有兴趣，可以谈谈。',
        '成都城繁华，蜀锦、茶叶、川妹子，什么都有。我这儿只卖好东西，不卖水货。'
      ],
      friendly:[
        '来得正好，那批新到的蜀锦刚清点完，你眼光不错，先给你看看。',
        '我就欣赏你这种痛快人。有什么需要，尽管开口。'
      ],
      close:[
        '进里间说话，外头人多眼杂。有些买卖，不方便在外头谈。',
        '你是刘某信得过的人。有些路子旁人不能走，你却可以。'
      ],
    },
    topics:[
      { id:'t_cd_merch_buy',  text:'看看货物', reply:'这都是我走南闯北收来的好货，品质绝对有保证。', relDelta:0, action:'open_shop' },
      { id:'t_cd_merch_task', text:'问问有没有任务', reply:'有批货要从成都送出去，沿途还算太平，你若顺路，报酬好商量。', relDelta:3 },
      { id:'t_cd_merch_info', text:'打听商道行情', reply:'蜀道难行，可蜀锦和茶叶值钱，往东走长江水道，往北走川陕大道，都是我刘某的路线。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_cd_merch_road', text:'问成都往哪条路最繁华', reply:'往东是长江水路，往北是蜀道通中原，往南是云贵大山。四川的货出川才值钱。', relDelta:3 },
      { id:'t_cd_merch_cricket', text:'听说贵店有蛐蛐笼卖？', reply:'刘蜀商压低声音："有是有，蛐蛐笼品质不错。不过最近进货的少了，你要是诚心要，我可以给你留一个。"', relDelta:1 },
    ],
    shop:{
      items:[
        { id:'item_elixir',      name:'灵药',       desc:'回复气血内力各50',             icon:'⚗',  price:35, effect:{hp:50, mp:50} },
        { id:'item_wine_age',    name:'陈年汾酒',   desc:'极品美酒，精力+40',           icon:'🍯', price:20, effect:{energy:40} },
        { id:'item_travel_ration',name:'行路干粮',  desc:'耐储的行路口粮，饱食度+40',     icon:'🧆', price:8,  effect:{food:40} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐',icon:'🧺', price:40, effect:{} },
        // ── 高价值商品（经济平衡 A 类）──
        { id:'item_qi_pill',     name:'培元丹',     desc:'内力上限永久+20，需逐步吸收',     icon:'💎', price:180, effect:{maxMp:20} },
        { id:'item_blood_pill',  name:'活血再造丹', desc:'气血上限永久+30，需逐步吸收',     icon:'❤️‍🔥', price:250, effect:{maxHp:30} },
        { id:'item_teleport_scroll',name:'驿站急件', desc:'凭此可在驿站享受八折优惠（一次性）',   icon:'📜', price:30, effect:{poststationDiscount:0.2} },
        { id:'item_respec_pill', name:'洗髓易筋丸', desc:'重分配全部自由属性点（不含出身点）',   icon:'🔄', price:300, effect:{respec:true} },
        { id:'item_mat_pack_herb',name:'百草材料包', desc:'含各类草药×6，合成炼药必备',       icon:'🌿', price:55, effect:{materialPack:['item_herb_gancao','item_herb_qi','item_herb_heal','item_herb_blood','item_herb_anti','item_herb_gancao']} },
      ]
    },
    quests:['quest_escort_goods','quest_daily_merchant_delivery'],
    intels:['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  成都城·女镖头（镖局NPC → 护镖小游戏入口）
  // ══════════════════════════════════════════════════════════
  chengdu_escort_woman: {
    id:'chengdu_escort_woman', name:'钟无艳', role:'成都女镖头', category:'escort', avatar:'🗡',
    city:'chengdu', level:52, tier:'major',
    weapon:'wep_blood_saber', armor:'cs_ranger',
    silver:280,
    giftPrefs:{
      label:'走镖用得上的硬货',
      love:['herb','mineral','pelt'],
      like:['mystic','raretrade'],
      thanksLoved:[
        '这是好料子！走镖路上扎营烤肉最派得上用场，俺记你这份情。',
        '有眼光！这东西拿到外头去，能换不少硬通货。'
      ],
      thanksLiked:[
        '嗯，有点意思，走镖的人手头正缺这个。'
      ],
      questHint:'钟无艳拍了拍腰间的刀鞘，压低声音："有些事不好在这儿说，你若想沾我这路子，任务页里看看。"',
      followup:{
        questText: ({ questName }) => questName ? `追问钟镖头这桩「${questName}」` : '追问钟镖头手里那桩买卖',
        questReply: ({ questName }) => questName
          ? `钟无艳把刀横过来擦了擦："${questName}。这事急不得，你去任务页里看看，规矩都写明白了。"` : '钟无艳冷哼一声："我这儿正有单走镖的买卖，成都往哪条路都有。你若感兴趣，去任务页看看。"',
        intelText: () => '请钟镖头把这条路细说分明',
        intelReply: ({ intelText }) => `钟无艳压低了声音："${intelText}"`,
        warmText: () => '问问她走镖的故事',
        warmReply: ({ npcName }) => `${npcName}把刀入鞘："你是刘某信得过的人。有些路子旁人不能走，你却可以。"`,
      }
    },
    greetings:{
      hostile:[
        '钟无艳按着刀柄："成都城不讲规矩的人，俺见过太多了。"',
        '（上下打量）你是来蹭活的，还是来找茬的？'
      ],
      guarded:[
        '成都镖局讲信义，但只对讲信义的人。阁下有何贵干？',
        '先说清楚，是来接镖还是来找茬的？'
      ],
      neutral:[
        '蜀道难，难于上青天——可货还是要运的。俺在成都开了二十年镖局，什么货没押过。',
        '你是跑江湖的？正好，最近有批蜀锦要押出去，你若有兴趣，可以谈谈。',
        '成都城繁华，唐门的东西值钱，押镖风险也大。你若感兴趣，可以聊聊。'
      ],
      friendly:[
        '来得正好，那批新到的货刚清点完，你眼光不错，先给你看看镖路。',
        '俺就欣赏你这种痛快人。有什么需要，尽管开口。'
      ],
      close:[
        '进里间说话，外头人多眼杂。有些买卖，不方便在外头谈。',
        '你是俺信得过的人。有些路子旁人不能走，你却可以。'
      ],
    },
    topics:[
      { id:'t_cd_ew_join',   text:'打听镖局情况', reply:'俺在成都开镖局，走的是南来北往的货。川陕大道和长江水路，俺都能护。', relDelta:5 },
      { id:'t_cd_ew_escort', text:'接一单护镖', reply:'好眼力！成都往哪条路都有镖路，你挑一条。', relDelta:8, action:'open_escort' },
      { id:'t_cd_ew_skill',  text:'聊武艺', reply:'俺使的是川西刀法，讲究实用！走镖不是比招式，是比谁先看清路数。', relDelta:7 },
      { id:'t_cd_ew_task',   text:'有没有任务', reply:'有批货要从成都送出去，最近路上不太平，你若准备接，先掂量掂量自己的本事。', relDelta:8 },
      { id:'t_cd_ew_road',   text:'问最险的一次走镖', reply:'钟无艳沉吟了一下："有一回从成都往汉中，遇上山匪连环埋伏。俺让镖车走小道，自己带人前后夹击，一夜没合眼，总算把人货都带出来了。"', relDelta:6, minRel:20 },
      { id:'t_cd_ew_story',  text:'问她为何当镖师', reply:'钟无艳把刀横过来擦了擦："俺小时被人绑过票，是镖师救出来的。后来就拜了师，学了这身本事，发誓不让人再受那种罪。"', relDelta:7, minRel:40 },
    ],
    shop:null,
    quests:['quest_escort_goods','quest_escort_rescue','quest_escort_reconnaissance','quest_daily_escort','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
    intels:['intel_trade_route','intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  各地商人 NPC（商店服务 → shop 按钮）
  // ══════════════════════════════════════════════════════════

  // ── 郑州·杂货商 ──
  zhengzhou_merchant: {
    id:'zhengzhou_merchant', name:'郑货郎', role:'中原杂货商人', category:'shop', avatar:'💰',
    city:'zhengzhou', level:22, tier:'minor',
    weapon:'wep_wooden_sword', armor:'cs_robe',
    silver:120,
    greetings:{
      neutral:['中原古道，来来往往的人多，我这儿的货也杂。','往东往西的都打这儿过，什么稀罕物我都见过。'],
      friendly:['你是熟客了！今儿要点什么？'],
    },
    topics:[
      { id:'t_zz_buy', text:'看看有什么货', reply:'药材、干粮、铁器都有，价格公道。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各30', icon:'⚗', price:25, effect:{hp:30,mp:30} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+35', icon:'🧆', price:7, effect:{food:35} },
        { id:'item_iron_ore', name:'铁矿石', desc:'锻造用材料', icon:'�ite', price:15, effect:{} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },

      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 沧州·商会掌柜 ──
  cangzhou_merchant: {
    id:'cangzhou_merchant', name:'孙大茂', role:'沧州商会商人', category:'shop', avatar:'💰',
    city:'cangzhou', level:28, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:180,
    greetings:{
      neutral:['沧州武术之乡，我这买卖也跟着热闹。','南来北往的武人多了，我这儿的货不愁卖。'],
      friendly:['来得正好，新到了一批北边的皮货。'],
    },
    topics:[
      { id:'t_cz_buy', text:'看看货物', reply:'皮货、铁器、药材都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各35', icon:'⚗', price:30, effect:{hp:35,mp:35} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+38', icon:'🧆', price:7, effect:{food:38} },
        { id:'item_wine_age', name:'高粱酒', desc:'精力+35', icon:'🍶', price:18, effect:{energy:35} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 襄阳·商会掌柜 ──
  xiangyang_merchant: {
    id:'xiangyang_merchant', name:'吴半城', role:'襄阳商会掌柜', category:'shop', avatar:'💰',
    city:'xiangyang', level:36, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:220,
    greetings:{
      neutral:['襄阳自古兵家必争，我这买卖也跟着兴衰。','南北货物在襄阳集散，什么都有。'],
      friendly:['吴某在襄阳做了半辈子买卖，货真价实。'],
    },
    topics:[
      { id:'t_xy_buy', text:'看看货物', reply:'荆襄特产、北边皮货、南边丝绸都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各40', icon:'⚗', price:32, effect:{hp:40,mp:40} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+40', icon:'🧆', price:7, effect:{food:40} },
        { id:'item_wine_age', name:'襄阳老酒', desc:'精力+38', icon:'🍶', price:18, effect:{energy:38} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 晋阳·商会掌柜 ──
  jinyang_merchant: {
    id:'jinyang_merchant', name:'赵富记', role:'晋阳商会掌柜', category:'shop', avatar:'💰',
    city:'jinyang', level:40, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:250,
    greetings:{
      neutral:['晋阳城靠山吃山，煤矿、皮货、盐巴都是好货。','山西商人走天下，我这儿的货品也讲究。'],
      friendly:['赵某这儿晋商天下闻名，童叟无欺。'],
    },
    topics:[
      { id:'t_jy_buy', text:'看看货物', reply:'煤矿、皮货、盐巴俱全。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各42', icon:'⚗', price:34, effect:{hp:42,mp:42} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+42', icon:'🧆', price:7, effect:{food:42} },
        { id:'item_iron_ore', name:'煤炭', desc:'锻造用燃料', icon:'ite', price:12, effect:{} },
        { id:'item_wine_age', name:'汾酒', desc:'精力+40', icon:'🍶', price:20, effect:{energy:40} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 潼关·边关商贩 ──
  tongguan_merchant: {
    id:'tongguan_merchant', name:'马三通', role:'潼关边关商人', category:'shop', avatar:'💰',
    city:'tongguan', level:38, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_robe',
    silver:200,
    greetings:{
      neutral:['潼关险要，过往客商都得从我这儿补货。','东西往来，全凭我这关口的货栈。'],
      friendly:['你是老面孔了，给你留了好货。'],
    },
    topics:[
      { id:'t_tg_buy', text:'看看有什么', reply:'干粮、药材、铁器，什么都备着。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各38', icon:'⚗', price:32, effect:{hp:38,mp:38} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+40', icon:'🧆', price:7, effect:{food:40} },
        { id:'item_iron_ore', name:'铁矿石', desc:'锻造用材料', icon:'ite', price:14, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 大同·北疆商贩 ──
  datong_merchant: {
    id:'datong_merchant', name:'李守边', role:'大同边贸商人', category:'shop', avatar:'💰',
    city:'datong', level:42, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_robe',
    silver:230,
    greetings:{
      neutral:['大同是北疆门户，蒙古、皮毛、铁器这儿都有。','守着这条道，什么货都见过。'],
      friendly:['守边人做的是实在买卖，不坑人。'],
    },
    topics:[
      { id:'t_dt_buy', text:'看看货物', reply:'北疆皮毛、战马草料、铁器都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各45', icon:'⚗', price:36, effect:{hp:45,mp:45} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+45', icon:'🧆', price:8, effect:{food:45} },
        { id:'item_wine_age',   name:'马奶酒',   desc:'精力+42',  icon:'🍶', price:20, effect:{energy:42} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 雁门关·边关商人 ──
  yanmen_merchant: {
    id:'yanmen_merchant', name:'关云岭', role:'雁门关边关商人', category:'shop', avatar:'💰',
    city:'yanmen', level:44, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_robe',
    silver:240,
    greetings:{
      neutral:['雁门关外是草原，这儿的货都是塞外运来的。','守着天险，什么货都值钱。'],
      friendly:['你这人实在，我给你报个实在价。'],
    },
    topics:[
      { id:'t_ym_buy', text:'看看货物', reply:'塞外皮毛、战马草料、干肉都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各45', icon:'⚗', price:36, effect:{hp:45,mp:45} },
        { id:'item_travel_ration', name:'行路干粮', desc:'饱食度+45', icon:'🧆', price:8, effect:{food:45} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 重庆·山城商人 ──
  chongqing_merchant: {
    id:'chongqing_merchant', name:'刘巴渝', role:'巴渝商会掌柜', category:'shop', avatar:'💰',
    city:'chongqing', level:46, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:260,
    greetings:{
      neutral:['重庆山城，两江交汇，什么货都走水路来。','巴渝商会做的是西南生意。'],
      friendly:['刘某做买卖实在，老客都知道。'],
    },
    topics:[
      { id:'t_cq_buy', text:'看看货物', reply:'川椒、山货、水产、药材都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各48', icon:'⚗', price:38, effect:{hp:48,mp:48} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+48', icon:'🧆', price:8, effect:{food:48} },
        { id:'item_spice', name:'花椒', desc:'川味调料', icon:'🌶', price:10, effect:{} },
        { id:'item_wine_age', name:'巴渝老酒', desc:'精力+45', icon:'🍶', price:20, effect:{energy:45} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'], intels:['intel_trade_route'],
  },

  // ── 大理·南诏商人 ──
  dali_merchant: {
    id:'dali_merchant', name:'段氏商', role:'大理段氏商会', category:'shop', avatar:'💰',
    city:'dali', level:48, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:280,
    greetings:{
      neutral:['大理南诏故都，翡翠、茶叶、药材闻名天下。','段氏在大理经营有道，什么货都有。'],
      friendly:['段某的货品，你放心。'],
    },
    topics:[
      { id:'t_dl_buy', text:'看看货物', reply:'南红、翡翠、普洱、药材都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各50', icon:'⚗', price:40, effect:{hp:50,mp:50} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+50', icon:'🧆', price:8, effect:{food:50} },
        { id:'item_wine_age', name:'陈年佳酿', desc:'精力+50，口渴度+20', icon:'🍶', price:25, effect:{energy:50, water:20} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
        { id:'item_elder_pu_tea', name:'老普洱茶', desc:'精力+48', icon:'🍵', price:22, effect:{energy:48} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 徐州·运河商人 ──
  xuzhou_merchant: {
    id:'xuzhou_merchant', name:'周通达', role:'徐州运河商人', category:'shop', avatar:'💰',
    city:'xuzhou', level:38, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:220,
    greetings:{
      neutral:['徐州是运河要冲，南来北往的货都在这儿转。','五省通衢，做买卖最方便。'],
      friendly:['你是老客了，给你留着好货。'],
    },
    topics:[
      { id:'t_xz_buy', text:'看看货物', reply:'江南丝绸、北边皮货、运河水产都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各40', icon:'⚗', price:34, effect:{hp:40,mp:40} },
        { id:'item_travel_ration',name:'行路干粮', desc:'饱食度+42', icon:'🧆', price:7, effect:{food:42} },
        { id:'item_wine_age', name:'陈年佳酿', desc:'精力+42，口渴度+18', icon:'🍶', price:20, effect:{energy:42, water:18} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
        { id:'item_xuzhou_fish', name:'运河鲜鱼', desc:'饱食度+40，气血+15', icon:'🐟', price:15, effect:{food:40, hp:15} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 荆州·江陵商人 ──
  jingzhou_merchant: {
    id:'jingzhou_merchant', name:'吴掌柜', role:'荆州商会掌柜', category:'shop', avatar:'💰',
    city:'jingzhou', level:40, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:240,
    greetings:{
      neutral:['荆州古都，长江中游，什么货都在这儿过。','荆楚商会做的是长江生意。'],
      friendly:['吴某的货实在，老客都知道。'],
    },
    topics:[
      { id:'t_jz_buy', text:'看看货物', reply:'江汉特产、荆襄药材、铁器都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各42', icon:'⚗', price:34, effect:{hp:42,mp:42} },
        { id:'item_travel_ration', name:'行路干粮', desc:'饱食度+44', icon:'🧆', price:7, effect:{food:44} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
        { id:'item_wine_age', name:'江陵老酒', desc:'精力+42', icon:'🍶', price:18, effect:{energy:42} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 金陵·南京商会掌柜 ──
  nanjing_merchant: {
    id:'nanjing_merchant', name:'沈万三', role:'金陵商会大商人', category:'shop', avatar:'💰',
    city:'nanjing', level:50, tier:'capital',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:320,
    greetings:{
      neutral:['金陵是江南繁华地，我这儿的货也是天下最全的。','沈某在金陵做了几十年买卖，什么没见过。'],
      friendly:['你是行家，来来来，看看这批新货。'],
    },
    topics:[
      { id:'t_nj_buy', text:'看看货物', reply:'江南丝绸、景德瓷器、徽州茶叶、金陵特产，一应俱全。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'上品灵药', desc:'回复气血内力各55', icon:'⚗', price:45, effect:{hp:55,mp:55} },
        { id:'item_travel_ration',name:'金陵糕点', desc:'饱食度+55', icon:'🧆', price:9, effect:{food:55} },
        { id:'item_wine_age', name:'金陵春', desc:'精力+55', icon:'🍶', price:25, effect:{energy:55} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery','quest_merchant_stolen_goods'],
  },

  // ── 灵州·西夏商人 ──
  yinzhou_merchant: {
    id:'yinzhou_merchant', name:'赫连商', role:'灵州西夏商人', category:'shop', avatar:'💰',
    city:'yinzhou', level:44, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_robe',
    silver:260,
    greetings:{
      neutral:['灵州是西夏故地，丝路东端，什么货都有。','羌汉杂居，货品也多元。'],
      friendly:['赫连做买卖讲信用，你放心。'],
    },
    topics:[
      { id:'t_yz_buy', text:'看看货物', reply:'西夏皮货、回鹘香料、丝路珠宝都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各45', icon:'⚗', price:38, effect:{hp:45,mp:45} },
        { id:'item_travel_ration', name:'行路干粮', desc:'饱食度+46', icon:'🧆', price:8, effect:{food:46} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 辽阳·契丹商人 ──
  liaoyang_merchant: {
    id:'liaoyang_merchant', name:'耶律通', role:'辽阳契丹商人', category:'shop', avatar:'💰',
    city:'liaoyang', level:46, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_robe',
    silver:270,
    greetings:{
      neutral:['辽阳是契丹重镇，女真、蒙古、汉货都在这儿交汇。','守着这条道，货品不愁卖。'],
      friendly:['耶律的买卖公道，老客都认我。'],
    },
    topics:[
      { id:'t_ly_buy', text:'看看货物', reply:'女真皮货、蒙古战马、人参药材都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各48', icon:'⚗', price:40, effect:{hp:48,mp:48} },
        { id:'item_travel_ration', name:'行路干粮', desc:'饱食度+48', icon:'🧆', price:8, effect:{food:48} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 草原王庭·游牧商人 ──
  caoyuan_merchant: {
    id:'caoyuan_merchant', name:'铁木商', role:'草原王庭商人', category:'shop', avatar:'💰',
    city:'caoyuan', level:50, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_robe',
    silver:280,
    greetings:{
      neutral:['草原深处，什么稀罕货都有。','游牧民族的东西，中原可不多见。'],
      friendly:['你是远方来客，给你最好的价钱。'],
    },
    topics:[
      { id:'t_cy_buy', text:'看看有什么', reply:'汗血宝马、草原皮张、奶酪、蒙古刀都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'草原灵药', desc:'回复气血内力各50', icon:'⚗', price:42, effect:{hp:50,mp:50} },
        { id:'item_travel_ration', name:'风干牛肉', desc:'饱食度+55', icon:'🧆', price:10, effect:{food:55} },
        { id:'item_wine_age', name:'马奶酒', desc:'精力+50', icon:'🍶', price:22, effect:{energy:50} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ── 日月城·商会掌柜 ──
  riyue_city_merchant: {
    id:'riyue_city_merchant', name:'钱多多', role:'日月城商会掌柜', category:'shop', avatar:'💰',
    city:'riyue_city', level:52, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:300,
    greetings:{
      neutral:['日月城是神教附属，什么货都能弄到。','西域、南洋、东海，四面八方的货都走我这儿。'],
      friendly:['钱某的门路多，你想要什么，说一声。'],
    },
    topics:[
      { id:'t_rc_buy', text:'看看货物', reply:'西域香料、明教特产、波斯地毯、都有。', relDelta:0, action:'open_shop' },
    ],
    shop:{
      items:[
        { id:'item_elixir', name:'灵药', desc:'回复气血内力各52', icon:'⚗', price:44, effect:{hp:52,mp:52} },
        { id:'item_travel_ration', name:'行路干粮', desc:'饱食度+52', icon:'🧆', price:8, effect:{food:52} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
        { id:'item_wine_age', name:'葡萄酒', desc:'精力+50', icon:'🍷', price:24, effect:{energy:50} },
      ]
    },
    quests:['quest_daily_merchant_delivery'],
  },

  // ══════════════════════════════════════════════════════════
  //  各地镖头 NPC（镖局服务 → guild 按钮）
  // ══════════════════════════════════════════════════════════

  // ── 晋阳·镖头 ──
  jinyang_escort: {
    id:'jinyang_escort', name:'赵镖头', role:'晋阳镖局镖头', category:'escort', avatar:'🗡',
    city:'jinyang', level:46, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_ranger',
    silver:260,
    greetings:{
      neutral:['晋阳镖局走的是北道，太原、大同都能护。','山西好汉多，镖路也稳当。'],
      friendly:['你是熟客了，走哪条道？'],
    },
    topics:[
      { id:'t_jy_esc', text:'接一单护镖', reply:'好眼力！晋阳往北走太原，往东走河北，你挑一条。', relDelta:8, action:'open_escort' },
    ],
    quests:['quest_escort_goods','quest_daily_escort','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
  },

  // ── 潼关·镖头 ──
  tongguan_escort: {
    id:'tongguan_escort', name:'马镖头', role:'潼关镖局镖头', category:'escort', avatar:'🗡',
    city:'tongguan', level:44, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_ranger',
    silver:250,
    greetings:{
      neutral:['潼关是险关，走镖的都知道这儿最重要。','守着这道口，什么货我都敢接。'],
      friendly:['老客了，走哪条路？'],
    },
    topics:[
      { id:'t_tg_esc', text:'接一单护镖', reply:'好！潼关往东往西都有镖路，你挑。', relDelta:8, action:'open_escort' },
    ],
    quests:['quest_escort_goods','quest_daily_escort','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
  },

  // ── 襄阳·镖头 ──
  xiangyang_escort: {
    id:'xiangyang_escort', name:'吴镖头', role:'襄阳镖局镖头', category:'escort', avatar:'🗡',
    city:'xiangyang', level:48, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_ranger',
    silver:280,
    greetings:{
      neutral:['襄阳自古兵家必争，走镖靠的是胆识和脑子。','长江水道、荆襄古道，我都熟。'],
      friendly:['吴某在襄阳走镖二十年，没有丢过一票。'],
    },
    topics:[
      { id:'t_xy_esc', text:'接一单护镖', reply:'襄阳往东往北都有镖路，你挑一条。', relDelta:8, action:'open_escort' },
    ],
    quests:['quest_escort_goods','quest_daily_escort'],
  },

  // ── 大同·镖头 ──
  datong_escort: {
    id:'datong_escort', name:'李镖头', role:'大同镖局镖头', category:'escort', avatar:'🗡',
    city:'datong', level:50, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_ranger',
    silver:300,
    greetings:{
      neutral:['大同是北疆门户，走镖走的是塞外风霜。','蒙古鞑子、南边商队，我都护过。'],
      friendly:['大同镖局的名号，是打出来的。'],
    },
    topics:[
      { id:'t_dt_esc', text:'接一单护镖', reply:'好胆色！大同往南往北都有镖路，你挑。', relDelta:8, action:'open_escort' },
    ],
    quests:['quest_escort_goods','quest_daily_escort','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
  },

  // ══════════════════════════════════════════════════════════
  //  开封城·女镖头（镖局NPC → 护镖小游戏入口）
  // ══════════════════════════════════════════════════════════

  kaifeng_escort_woman: {
    id:'kaifeng_escort_woman', name:'赵飞燕', role:'开封女镖头', category:'escort', avatar:'🗡',
    city:'kaifeng', level:50, tier:'major',
    weapon:'wep_uc_iron_sword', armor:'cs_ranger',
    silver:260,
    giftPrefs:{
      label:'走镖用得上的硬货',
      love:['martial','pelt','fang'],
      like:['thunder','raretrade'],
      thanksLoved:[
        '这礼实在，走镖遇上硬茬子时最顶用。',
        '够硬气！赵某收下了，下回有险镖先想着你。'
      ],
      thanksLiked:[
        '行，这份礼不虚，赵某记着了。'
      ],
      questHint:'赵飞燕把刀往桌上一搁，似乎更愿意把那桩危险差事说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问赵镖头这趟「${questName}」` : '追问赵镖头要托的那趟活',
        questReply: ({ questName }) => questName
          ? `赵飞燕拍了一下镖箱："既然你敢接，那赵某也直说——${questName}。埋伏点、接应口、该先砍谁，任务页里都标好了。"` : '赵飞燕扬了扬下巴："我手里正有趟险活，你若敢接，去任务页看，我把路上可能翻脸的地方都给你点出来。"',
        intelText: () => '请她把埋伏路数讲明',
        intelReply: ({ intelText }) => `赵飞燕把刀往桌上一横："${intelText}"`,
        warmText: () => '顺着刀口上的事再问一句',
        warmReply: ({ npcName }) => `${npcName}哼了一声："你这人有胆气。下回若有要命的镖，赵某先问你敢不敢接。"`,
      }
    },
    greetings:{
      hostile:[
        '赵飞燕冷冷地看了你一眼："找茬的趁早滚，赵某的刀不认人。"',
        '你若是来打听消息的，就免开尊口。赵某没空陪闲人聊天。'
      ],
      guarded:[
        '赵某走镖二十年，什么人没见过。先说明白，你想干什么？',
        '汴梁城龙蛇混杂，你若想找赵某办事，先拿点诚意出来。'
      ],
      neutral:[
        '开封镖局不比沧州，但赵某的名号在这一片还管用！',
        '走镖护货是赵某的本事。你若想过两招，赵某也奉陪。',
        '汴河水路和陆路都通，走哪条都能护镖，就是风险不同。'
      ],
      friendly:[
        '来得正好，正好有批货要发，你若有空，不妨听听。',
        '赵某看你有几分胆气，说话也不绕弯子。有趟镖，想找个靠得住的人。'
      ],
      close:[
        '进来说话。有些镖的路数，不方便在外头讲。',
        '你既跟赵某走得近了，有些险镖，赵某第一个找你。'
      ],
    },
    topics:[
      { id:'t_kf_ew_join',   text:'打听镖局情况', reply:'赵某在开封开镖局，走的是南来北往的货。汴河水路和官道并行，赵某两路都能护。', relDelta:5 },
      { id:'t_kf_ew_escort', text:'接一单护镖', reply:'好眼力！开封往洛阳、往沧州都有镖路，你挑一条。', relDelta:8, action:'open_escort' },
      { id:'t_kf_ew_skill',  text:'聊武艺', reply:'赵某使的是轻灵路子，刀走偏锋，胜在快字。走镖不是比招式，是比谁先看清路数。', relDelta:7 },
      { id:'t_kf_ew_task',   text:'有没有任务', reply:'有批货要从开封送去洛阳，但最近路上不太平，你若准备接，先掂量掂量自己的本事。', relDelta:8 },
      { id:'t_kf_ew_road',   text:'问最险的一次走镖', reply:'赵飞燕沉吟了一下："有一回从开封往涿郡，遇上山匪连环埋伏。赵某让镖车走小道，自己带人前后夹击，一夜没合眼，总算把人货都带出来了。"', relDelta:6, minRel:20 },
      { id:'t_kf_ew_rule',   text:'问她挑人的规矩', reply:'赵飞燕扬了扬下巴："赵某挑人只认一条：能不能在关键时刻不掉链子。银子少点没关系，临阵脱逃的，赵某不伺候。"', relDelta:5 },
      { id:'t_kf_ew_story',  text:'问她为何当镖师', reply:'赵飞燕把刀横过来擦了擦："赵某小时被人绑过票，是镖师救出来的。后来就拜了师，学了这身本事，发誓不让人再受那种罪。"', relDelta:7, minRel:40 },
    ],
    shop:null,
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
    intels:['intel_road_bandit'],
  },


  kaifeng_tavern: {
    id:'kaifeng_tavern', name:'东京小花', role:'汴梁酒家小二', category:'tavern', avatar:'👧',
    city:'kaifeng', level:40, tier:'func',
    weapon:'wep_short_knife', armor:'cs_cloth',
    silver:40,
    greetings:{
      hostile: '（小花叉着腰）汴梁酒家不招待找茬的！不喝酒就别挡着门口！',
      guarded: '开封城三天两头有人闹事，小花见多了。先付银子再说。',
      neutral:  '客官来了！汴梁包子刚出锅，热气腾腾！开封城热闹，江湖人都来喝酒消气。来一笼？',
      friendly: '来了呀！小花给你留了靠窗的位子，灌汤包也热着呢——老客了，小花记得你的口味！',
      close:    '（凑近小声说）小花有件事——最近掌柜被人威胁，好像跟城东那家新酒楼有关。你能不能帮小花查查？小花给你做独家秘制小菜！',
    },
    topics:[
      { id:'t_kf_tav_drink',  text:'喝壶汴梁酒（2两）', reply:'好嘞！这是咱家招牌竹叶青，爽口得很！', relDelta:5, action:'buy_drink' },
      { id:'t_kf_tav_gossip', text:'打听开封消息', reply:'城东有个武馆最近好像出了什么事，好几天关门，里面动静也没了，不知出了啥事……', relDelta:3, intelId:'intel_local_gossip' },
      { id:'t_kf_tav_eat',    text:'来笼包子（1两）', reply:'（热腾腾的灌汤包上桌，吃饱喝足，浑身有力气）', relDelta:5, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_bianliang_wine', name:'汴梁老酒', desc:'中原名酒，精力+25',     icon:'🍶', price:4,  effect:{energy:25} },
        { id:'item_soup_dumpling',  name:'灌汤包',  desc:'开封特产，饱食度+30',   icon:'🥟', price:3,  effect:{food:30} },
        { id:'item_carp_soup',      name:'黄河鲤鱼汤', desc:'饱食度+25，气血+15', icon:'🍲', price:8,  effect:{food:25, hp:15} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer','quest_cricket_debut','quest_cricket_daily'],
    intels:['intel_local_gossip'],
  },

  // ══════════════════════════════════════════════════════════
  //  沧州 NPCs  (major · 武风之城)
  // ══════════════════════════════════════════════════════════

  cangzhou_inn: {
    id:'cangzhou_inn', name:'镖头老张', role:'镖局掌柜', category:'escort', avatar:'🧓',
    city:'cangzhou', level:38, tier:'func',
    weapon:'wep_uc_dao', armor:'cs_ranger',
    silver:80,
    giftPrefs:{
      label:'压车走镖用得上的硬货',
      love:['martial','pelt','raretrade'],
      like:['ore'],
      thanksLoved:[
        '这东西压车镇场正好，老张承你这份情。',
        '行家一出手就知道有没有，这礼送到点子上了。'
      ],
      thanksLiked:[
        '嗯，路上带着倒也实用。'
      ],
      questHint:'镖头老张神色一松，像是终于肯把最近那桩棘手的镖局差事交给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问老张这趟「${questName}」` : '追问老张最近那趟镖',
        questReply: ({ questName }) => questName
          ? `镖头老张给你斟了口热茶，压低声音道："这趟活表面不大，实则不省心——${questName}。该从哪条路绕、该防哪拨人，我都记进任务页里了。"`
          : '镖头老张把门帘往下压了压："我这儿最近压着一趟麻烦镖，客栈里人多嘴杂，不好细说。你去任务页看看，路线和忌讳我都给你写着。"',
        intelText: () => '请老张细说道上的风声',
        intelReply: ({ intelText }) => `镖头老张朝门外扫了一眼，才把声音放低："${intelText}"`,
        warmText: () => '顺着沧州路上的事再问几句',
        warmReply: ({ npcName }) => `${npcName}拍了拍桌角："你这人靠得住。往后谁家镖车要走险路，我这里若先听到风声，少不了提前知会你。"`,
      }
    },
    greetings:{
      hostile:[
        '镖头老张把茶碗往桌上一搁："这儿是镖局门脸，不是让人来抖威风的地方。想闹事，出门练武场多得很。"',
        '道上混饭吃，最烦不讲规矩的人。你若只是来探虚实，老张可没好脸色给你看。',
      ],
      guarded:[
        '住店、问路，还是打听镖行风声？你先把话摆明，老张才知道该把你当客人还是当闲人。',
        '沧州这地界，笑脸背后未必没刀。你若真想聊道上的事，先把来意说清楚。',
      ],
      neutral:[
        '沧州走镖三十年，老张见过多少江湖英雄！客官进来歇歇脚！',
        '沧州武风天下闻名，住在这儿，随便一条街拐出去就是练武场。',
        '听说最近道上不太平，镖局接的活儿比往年少了，哎……',
      ],
      friendly:[
        '来啦？坐近点，外头风硬。你若想听道上的旧规矩，老张今天有空跟你慢慢掰扯。',
        '你这人说话实在，倒像能压得住镖车的。往后若路上有事，未必不能先来问我。',
      ],
      close:[
        '别见外，自己掀帘子进。你如今也算半个走江湖的人了，老张不拿场面话糊弄你。',
        '有些道上的风声，我连店里伙计都不全说。你若来了，就说明我愿意让你听。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'quest_gossip_haunted_inn', status:'claimed' },
        greetings:{
          neutral:['镖头老张把柜上的烛台扶正："那几夜闹鬼的动静总算消停了，住店的人也敢把门窗关严。你若想听真相后头的尾巴，我可以慢慢说。"'],
          friendly:['镖头老张给你续了盏热茶："客栈风声平了，伙计们这两天总算睡了个囫囵觉。你既回来了，俺也去把后头怎么收拾的告诉你。"'],
          close:['镖头老张把门帘压低了些："外头都说是鬼散了，俺也去知道，是你把那团脏事掀了个底朝天。坐下，后话你该听。"'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_gossip_haunted_inn', statuses:['active','done'] },
        greetings:{
          neutral:['镖头老张朝楼上瞥了一眼："那几声怪响还没查明，这两日住客都在退房。你若有线索，就先说这个。"'],
          friendly:['镖头老张把茶碗压在桌角："是鬼是贼俺也去不信邪，可生意已经被闹得七零八落。你若准备去查，俺也去把这几夜的动静再给你过一遍。"'],
          close:['镖头老张压低声音："闹鬼这事多半是借壳吓人，真正要紧的是谁想借这客栈做文章。你若要追，俺也去不瞒你。"'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_missing_guest', status:'claimed' },
        greetings:{
          neutral:['镖头老张摸了摸账册边角："那位失踪旅客总算有了下落，老张这心口也松了半截。你若还想听那人留下的后话，坐下说。"'],
          friendly:['镖头老张叹了口气，又笑了笑："人找回来后，店里伙计提起你都像提自家镖师。来，俺也去把那人临走前说的话讲给你。"'],
          close:['镖头老张看你一眼，语气比平时更实："那位旅客能活着脱身，这份情俺也去记着。真要往后翻这桩事的余波，我只跟你说。"'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_missing_guest', statuses:['active','done'] },
        greetings:{
          neutral:['镖头老张把柜台敲得笃笃响："那位住店的旅客还没找着，人是昨晚失的，包袱却还在。你若来回信，先说这个。"'],
          friendly:['镖头老张把声音压低："老张做客栈这么多年，最怕的不是赔银子，是人在我这儿住下却不明不白没了。你若查到门路，俺也去记你。"'],
          close:['镖头老张朝后院偏了偏头："这事我越想越不像普通失踪，像有人借客栈挑衅老张的招牌。你既在查，俺也去把怀疑都摊给你。"'],
        }
      },
    ],
    topics:[
      { id:'t_cz_inn_price', text:'问住宿价格', reply:'上房一两半，中房六钱，大通铺两钱半。沧州实在，不宰客。', relDelta:0 },
      { id:'t_cz_inn_rumor', text:'沧州有什么大事？', reply:'最近江湖上出了个狠人，把沧州三家武馆全扫了一遍，一个能打的都没留下。就连马家大刀也被人当场打折了，可怕！', relDelta:2, intelId:'intel_local_gossip', excludesQuestStates:[{ questId:'quest_missing_guest', statuses:['active','done'] }, { questId:'quest_gossip_haunted_inn', statuses:['active','done'] }] },
      { id:'t_cz_inn_rest',  text:'住店一晚（10两）', reply:'好！沧州的床铺硬实，睡了精神！', relDelta:5, action:'inn_rest' },
      { id:'t_cz_inn_rule', text:'问问沧州镖行的规矩', reply:'镖头老张竖起两根手指："第一，接了镖就别问雇主闲事；第二，路上出了事，先保人再保货。货丢了还能赔，人没了，镖局的招牌也就塌了。"', repeatReply:'镖头老张抿了口茶："规矩我已经说了，真上路时能不能记住，那才叫本事。"', relDelta:4 },
      { id:'t_cz_inn_fighter', text:'顺着那个狠人的事再追问', reply:'镖头老张压低声音："那人不像是一时逞凶，倒像是专门踩盘子、摸门道来的。沧州近来怕不是只丢脸面，还要丢更大的东西。"', replyStages:{ neutral:'镖头老张压低声音："那人不像是一时逞凶，倒像是专门踩盘子、摸门道来的。沧州近来怕不是只丢脸面，还要丢更大的东西。"', friendly:'镖头老张往门外瞥了一眼："俺也去怀疑，那狠人不是冲武馆去的，是借着砸场子试谁会先露怯。真要出事，怕还在后头。"', close:'镖头老张把声音压得更低："你若真要查，就别只盯着擂台。那人踩的是沧州地头的胆气，背后八成还有人等着收网。"' }, repeatReplyStages:{ neutral:'镖头老张摇摇头："这事还没落地，先别逢人就讲。"', friendly:'镖头老张嗯了一声："我知道你记住了，真有后信俺也去再告诉你。"', close:'镖头老张看了你一眼："这事你心里有数就行，别替我往外漏。"' }, relDelta:5, minRel:20, intelId:'intel_local_gossip' },
      { id:'t_cz_inn_oldroad', text:'聊聊他走镖最险的一回', reply:'老张望着门外尘路笑了笑："最险那回，不是刀最多的一回，是整整三天没人说话的一回。你不知道队里谁已经动摇，那才真要命。"', repeatReply:'老张把茶碗一扣："险路的门道俺也去只能说到这儿，再多半句，就得你自己上路去懂了。"', relDelta:6, minRel:60, requiresTopic:'t_cz_inn_rule' },
      { id:'t_cz_inn_guest', text:'问那位失踪旅客留下了什么', doneText:'再问那旅客包袱里最蹊跷的东西', reply:'镖头老张把声音压得很低："包袱没少几件衣裳，偏偏少了一页夹在书里的纸。人若是自己走的，不会把包袱留全、只带最要命的东西。"', repeatReply:'镖头老张用指节敲了敲柜台："老张见得多，越像没丢东西的案子，往往越说明对方知道自己该拿什么。"', relDelta:4, minRel:20, requiresQuestState:{ questId:'quest_missing_guest', statuses:['active','done'] } },
      { id:'t_cz_inn_guestafter', text:'问那位旅客脱身后留下什么话', doneText:'再听听那旅客后来还有什么交代', reply:'镖头老张叹了口气："人一回来，先朝我作揖，说欠了老张一条命。可他说得最多的，不是害怕，是怕那份信没送到该送的人手里。"', repeatReply:'镖头老张把茶盏往前一推："江湖上最沉的，未必是刀，是那种明知会惹祸也得送出去的话。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'quest_missing_guest', status:'claimed' } },
      { id:'t_cz_inn_ghost', text:'问夜里那阵怪响像什么', doneText:'再问客栈夜里的响动到底从哪来', reply:'镖头老张朝楼梯口抬了抬下巴："头一夜像拖箱子，第二夜像人在墙后刮木板，第三夜最瘆人，像有人故意在你快睡着时才轻轻敲门。"', repeatReply:'镖头老张把门帘掀开又放下："真闹鬼不会专挑生意最好的那几间房下手。俺也去更信，是有人在拿住客的胆子做买卖。"', relDelta:4, minRel:20, requiresQuestState:{ questId:'quest_gossip_haunted_inn', statuses:['active','done'] } },
      { id:'t_cz_inn_ghostafter', text:'问客栈平静后他先整顿了什么', doneText:'再听他讲闹鬼风波后的收尾', reply:'镖头老张笑得有点疲："先换锁，再换夜里巡楼的人，最后把那些爱添油加醋的闲话一个个按下去。客栈做的是迎人进门的买卖，最怕的就是人心先散。"', repeatReply:'镖头老张把算盘拨得啪啪响："事平了不算本事，事平以后还能把人心和招牌一块儿扶起来，那才叫熬过去。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'quest_gossip_haunted_inn', status:'claimed' } },
    ],
    shop:null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_local_gossip','intel_road_bandit'],
  },


  cangzhou_doctor: {
    id:'cangzhou_doctor', name:'接骨王', role:'跌打名医', category:'misc', avatar:'🩺',
    city:'cangzhou', level:34, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:95,
    greetings:{
      hostile: '想来闹事？先把骨头让我折一遍，再谈别的！',
      guarded: '（斜眼打量）来看病还是来捣乱？',
      neutral: '沧州多习武者，接骨王我专治骨折脱臼、刀剑内伤，生意好得不行！',
      friendly: '今天又接了几个断骨，江湖人真是不爱惜自己。你来了，正好坐下歇歇。',
      close: '（看也不看就开口）你那旧伤又犯了？把袖子撸起来，让我看看。',
    },
    greetingOverrides:[
      { requiresQuestState:['quest_rare_herb:active'],   text:'那株百年灵芝——有眉目了吗？病人撑不了多久了。' },
      { requiresQuestState:['quest_rare_herb:done'],     text:'灵芝拿来了！好！速速入煎，今夜便能用上。多谢你了。' },
      { requiresQuestState:['chain_doc_b1:active'],      text:'（压低声音）那味解毒之药，你在深山可有踪迹？' },
      { requiresQuestState:['chain_doc_b2:active'],      text:'竟有人劫药？丧心病狂！你一定要把那批药夺回来！' },
      { requiresQuestState:['chain_doc_b3:active'],      text:'（神色凝重）这毒源头不在寻常地方……你准备好了吗？' },
      { requiresQuestState:['chain_doc_b3:done'],        text:'（长吁一口气）终于……这条命算是真的保下来了。你的恩情，接骨王记一辈子。' },
    ],
    giftPrefs:{
      label:'跌打救命用的药材与珍稀药引',
      love:['herb','pill','poison'],
      like:['raretrade','martial'],
      thanksLoved:[
        '（眼睛一亮）这药材是从哪里弄来的？品相这么好，我用来配接骨散，能多救不少人！',
        '好东西！沧州的伤药一向不够精，有这个，能多撑几条命。'
      ],
      thanksLiked:[
        '不错，这个我能用上，收下了。'
      ],
      questHint:'接骨王把礼物收好，脸色松动，像是想起了什么要紧的差事。',
      followup:{
        questText: ({ questName }) => questName ? `追问接骨王那桩「${questName}」的来龙去脉` : '追问接骨王提到的病案',
        questReply: ({ questName }) => questName
          ? `（放低声音）这桩事……说来话长。那位病人的伤，不是寻常刀伤，是被毒针所伤，毒法出奇。我怀疑背后有人故意为之，才托你去查那味「${questName}」——你若有意，便把委托接了。`
          : '（放低声音）那位病人，来路不明，伤势也古怪。我治了这么多年，头一次见这种毒法，总觉得背后有猫腻。',
        flavor:'medic',
      },
    },
    topics:[
      { id:'t_cz_doc_heal',  text:'治伤（28两）', reply:'（接骨王手法粗犷但有效，骨骼复位，内伤消散）沧州跌打手法，实战第一！', relDelta:3, action:'heal_hp' },
      { id:'t_cz_doc_herbs', text:'买草药', reply:'这里的跌打消肿药，沧州武人人手一份，管用！', relDelta:0, action:'open_shop' },
      { id:'t_cz_doc_talk',  text:'聊聊沧州武风',
        replyStages:{
          guarded: '（不太搭理）来看病的直说，闲话少叙。',
          neutral:  '沧州出的都是实战派，花架子在这儿活不长。我见过最能打的是个不知名的过客，一炷香打遍全城武馆，然后就走了，没人知道他是谁。',
          friendly: '沧州人出门，兜里揣的不是银子，是接骨药和止血布。这地方，打架是家常便饭，我这门生意才做了三十年不倒。',
          close:    '说实话，江湖上真正厉害的伤，不是刀砍的，是内力冲脉的。那种伤你看不出来，拖几天就没救了。我最怕碰见这类病人，治不了。',
        },
        relDelta:4
      },
      { id:'t_cz_doc_case',  text:'问问最近有无奇症',
        requiresRel: 20,
        reply:'（停顿）……最近倒有一个怪案子。来了个壮汉，看着没伤，却突然倒地，脉象全乱。我按江湖常见毒症治了半日没用，后来才发现——是被人用了某种内家逆脉手法，把经脉的走向强行逆了。厉害得很。',
        relDelta:6, intelId:'intel_poison_cult'
      },
      { id:'t_cz_doc_b1_followup', text:'追问那味解毒之药',
        requiresQuestState:['chain_doc_b1:active'],
        reply:'（压低声音）那药叫「鬼针草心」，只在深山阴谷才有。你进山时留意阴湿的山壁，那种草叶背面发黑、茎有细刺的，就是了。别被它刺到，本身也带毒。',
        relDelta:3
      },
    ],
    shop:{ type:'medicine',
      items:[
        { id:'item_herb_blood', name:'活血草',  desc:'活血化瘀，回复气血30', icon:'🌿', price:7,  effect:{hp:30} },
        { id:'item_herb_qi',    name:'参须片',  desc:'大补内力，回复内力50', icon:'🌱', price:13, effect:{mp:50} },
        { id:'item_herb_anti',  name:'解毒丸',  desc:'解除中毒状态',         icon:'💊', price:18, effect:{detox:true} },
        { id:'item_bone_oint',  name:'跌打药膏', desc:'外伤特效，气血+40',   icon:'💪', price:20, effect:{hp:40} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_poison_cult'],
  },

  cangzhou_smith: {
    id:'cangzhou_smith', name:'大刀马连', role:'沧州刀匠', category:'blacksmith', avatar:'🗡',
    city:'cangzhou', level:51, tier:'major',
    weapon:'wep_blood_saber', armor:'cs_soldier',
    silver:200,
    greetings:{
      hostile: '（抡起铁锤）找死？俺这把锤子打人比打铁还顺手！',
      guarded: '（斜着眼）买刀就进来，看热闹就走！',
      neutral:  '马连的刀，砍铁如泥！沧州武人十个有九个用过俺的刀！',
      friendly: '来了！要的是哪路刀？俺新打了两把，一把厚背重刀，一把细长柳叶，都是好货！',
      close:    '（头也不抬）你来得正好，俺刚开一炉新铁，你先看看成色，帮俺把把关。',
    },
    greetingOverrides:[
      { requiresQuestState:['quest_iron_ore:active'],            text:'那矿山流寇……你去过了吗？俺等着那批矿石，炉子都晾着呢！' },
      { requiresQuestState:['quest_iron_ore:done'],              text:'矿石到了！好料！这批打出来的刀，说不定能是俺这辈子最好的货！' },
      { requiresQuestState:['quest_smith_stolen_hammer:active'], text:'（脸黑）俺那锤子……那是祖传的！你一定要给俺夺回来！' },
      { requiresQuestState:['quest_smith_stolen_hammer:done'],   text:'（握着铁锤，眼眶微红）回来了……这锤子比俺爹传给俺时还沉，是俺糊涂了，没保管好。多谢你。' },
      { requiresQuestState:['chain_smith_c1:active'],            text:'那古法……老匠人那边，你去打探了吗？' },
      { requiresQuestState:['chain_smith_c2:active'],            text:'（咬牙）锻造图被人截走了？谁干的！必须夺回来！' },
      { requiresQuestState:['chain_smith_c3:active'],            text:'（摩拳擦掌）陨铁都到手了，就差这最后一锤，你且等着，俺要打一把天下无双的刀！' },
      { requiresQuestState:['chain_smith_c3:done'],              text:'（双手奉上刀）成了！这便是俺五代手艺的极致——拿去，好好用！' },
    ],
    giftPrefs:{
      label:'锻造用的稀缺矿料与铁匠爱不释手的兵器材料',
      love:['ore','fang','thunder'],
      like:['martial','pelt'],
      thanksLoved:[
        '（眼睛放光）这是哪来的？这品相……俺打铁三十年，见过最好的矿料不过如此！拿来！俺今晚就开炉！',
        '好料！这东西市面上根本买不到，你从哪淘的？算你厉害，俺认你这个朋友了！'
      ],
      thanksLiked:[
        '不错，这个俺能用上。'
      ],
      questHint:'大刀马连掂了掂礼物，神色松动，压低声音道：「你对铁器有兴趣，倒正好——俺这里有件事想托给个靠谱的人。」',
      followup:{
        questText: ({ questName }) => questName ? `追问马连那桩「${questName}」的差事` : '追问马连提到的锻造消息',
        questReply: ({ questName }) => questName
          ? `（压低声音）那件事……不是俺小题大做。那块陨铁，传说中出过一件神兵，后来流落江湖，下落不明。俺老爹临死前跟俺说，那东西如果找到，配上古法，能打出百年难见的好刀。你若有意，把委托接了，咱们一道查。`
          : `（喝了口水）那块陨铁的事，不是普通的买卖，背后涉及的人不简单……`,
        flavor:'smith',
      },
    },
    topics:[
      { id:'t_cz_smith_story', text:'聊他来历',
        replyStages:{
          guarded:  '（撇嘴）俺家祖辈打铁，没啥好聊的，买刀就买，不买就走。',
          neutral:  '俺家五代打铁，专给沧州武人打刀。沧州马家大刀法就是用俺家的刀练出来的，虽然那法子学的人用的刀越来越轻了……',
          friendly: '俺爹说过，真正的刀匠打的不是铁，是性子。你急着出活打出来的刀没灵魂，慢工细火才叫刀。俺这辈子就认这个理。',
          close:    '其实俺年轻时也想学武，跟着沧州武馆练了三年大刀。后来俺爹摔伤了腿，俺回来接手铁铺，这刀就这么打了一辈子……不后悔，但有时候还是会想，如果当初没回来……',
        },
        relDelta:6
      },
      { id:'t_cz_smith_tip',   text:'打听江湖兵器消息',
        requiresRel: 10,
        reply:'听说燕京来了个铸兵师，用辽东寒铁打刀，砍起来连骨头都不带响的，就那么削过去了……这种刀有点可怕。',
        repeatReplyStages:{
          neutral:  '这些消息俺也只听了个风声，具体的不清楚。',
          friendly: '对了，俺还听说那个铸兵师……跟某个大门派有来往。不知道哪家门派养着这种人物，来头不小。',
          close:    '（叹气）俺其实最担心的是——那种刀，普通人买了也扛不住，但要是落到滥杀之人手里，江湖不消停了。',
        },
        relDelta:2, intelId:'intel_kunlun_sword'
      },
      { id:'t_cz_smith_ore_followup', text:'追问矿山流寇情况',
        requiresQuestState:['quest_iron_ore:active'],
        reply:'（皱眉）那帮流寇来了有月余了，起初只是驱赶采矿的工人，后来竟下了黑手，有两个工人给打断了腿。俺去报官，官府说兵力不够。这地方靠自己！',
        relDelta:3
      },
      { id:'t_cz_smith_hammer_story', text:'问问那把祖传铁锤',
        requiresQuestState:['quest_smith_stolen_hammer:done'],
        reply:'（摸着铁锤）这锤子跟了俺家五代，锤面磨出了包浆，打出来的铁——有种说不清的顺劲，别的锤子比不了。俺爹说，是老祖宗的手气渗进去了。',
        relDelta:5
      },
    ],
    shop:{
      items:[
        { id:'item_whet',  name:'粗石磨刀', desc:'提升攻击力5，持续5回合', icon:'🪨', price:10, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',   name:'护甲油',   desc:'提升防御力5，持续5回合', icon:'🫙', price:8,  effect:{defBuff:5, turns:5} },
        { id:'item_arrow', name:'飞镖',     desc:'暗器类武器消耗品',       icon:'🏹', price:15, effect:{special:'dart_ammo'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','chain_smith_c1',],
    intels:['intel_kunlun_sword'],
  },

  cangzhou_tavern: {
    id:'cangzhou_tavern', name:'虎三爷', role:'江湖酒馆老板', category:'tavern', avatar:'🐯',
    city:'cangzhou', level:40, tier:'func',
    weapon:'wep_iron_fist', armor:'cs_ranger',
    silver:60,
    greetings:{
      hostile: '（虎三爷抄起酒坛）想砸场子？先问问这坛酒！',
      guarded: '（斜眼）来喝酒还是来找事？先把话说清楚。',
      neutral:  '哈哈！沧州虎三爷的酒馆，不打架不算来过！外地人进来喝一口！',
      friendly: '来了！今天运气好，刚开了坛好酒，坐下，三爷请你一碗！',
      close:    '（已经在倒酒）不用说了，你那口还是烈的，三爷记得清楚。',
    },
    topics:[
      { id:'t_cz_tav_drink',  text:'喝碗烧刀子（2两）', reply:'（虎三爷端上一大碗烧刀子）沧州武人喝的，一口下去，腑脏生暖，精神来了！', relDelta:5, action:'buy_drink' },
      { id:'t_cz_tav_gossip', text:'打听江湖消息', reply:'（豪爽地拍桌子）告诉你！最近有人在城外的山里扎营，人数不少，都是外地来的，练的什么功夫……瞧着不像好人！', relDelta:3, intelId:'intel_road_bandit' },
      { id:'t_cz_tav_fight',  text:'跟三爷掰掰手腕', reply:'（哈哈大笑，伸出粗壮的手臂）来！三爷我今儿高兴，赢了请你喝酒，输了你请俺！', relDelta:10, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_cangzhou_wine', name:'烧刀子',  desc:'沧州烈酒，精力+35',      icon:'🍶', price:3,  effect:{energy:35} },
        { id:'item_wine_hong',     name:'女儿红',  desc:'美酒，精力+35微上头',    icon:'🍷', price:8,  effect:{energy:35, dizzy:true} },
        { id:'item_braised_pork',  name:'酱肘子',  desc:'沧州特色，饱食度+40',    icon:'🍖', price:10, effect:{food:40} },
        { id:'item_wheat_cake',    name:'糖火烧',  desc:'北方点心，饱食度+20',    icon:'🍩', price:2,  effect:{food:20} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer','quest_cricket_debut','quest_cricket_daily'],
    intels:['intel_road_bandit'],
  },

  // 沧州·女镖师
  cangzhou_escort_woman: {
    id:'cangzhou_escort_woman', name:'铁娘子', role:'沧州女镖师', category:'escort', avatar:'🗡',
    city:'cangzhou', level:52, tier:'major',
    weapon:'wep_blood_saber', armor:'cs_ranger',
    silver:280,
    giftPrefs:{
      label:'走镖拼命用得上的皮骨硬货',
      love:['martial','pelt','fang'],
      like:['thunder','raretrade'],
      thanksLoved:[
        '这礼够硬气，走镖碰上硬仗时最顶用。',
        '好东西，带着上路，心里都稳三分。'
      ],
      thanksLiked:[
        '行，这份礼不虚，铁娘子收下了。'
      ],
      questHint:'铁娘子把礼物往刀旁一搁，似乎更愿意把那桩危险差事说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问铁娘子这趟「${questName}」` : '追问铁娘子要托的那趟活',
        questReply: ({ questName }) => questName
          ? `铁娘子把刀背往掌心一敲，干脆道："既然你敢收这份人情，那这趟活俺也去直说——${questName}。埋伏点、接应口、该先砍谁，任务页里我都替你标好了。"`
          : '铁娘子挑眉看了你一眼："我手里正有趟险活，胆小的听完都要退。你去任务页看，我把路上可能翻脸的地方都给你点出来。"',
        intelText: () => '请她把埋伏路数讲明',
        intelReply: ({ intelText }) => `铁娘子把刀往桌上一横，语气压得极低："${intelText}"`,
        warmText: () => '顺着刀口上的事再问一句',
        warmReply: ({ npcName }) => `${npcName}扬了扬下巴："你这人胆气不差，送礼也不娘们唧唧。下回若真有要命的镖，我先问你敢不敢接。"`,
      }
    },
    greetings:{
      hostile:[
        '铁娘子挑眉按刀："看热闹的离远点。俺这儿接的是要命的活，不陪人斗嘴。"',
        '你若冲着"女人走镖"四个字来取笑，最好现在就闭嘴。刀口不认这些废话。',
      ],
      guarded:[
        '要请镖、要搭手，还是想探俺底细？先说明白，俺不爱跟含糊人耗。',
        '走镖路上最怕两种人：胆小的，和嘴甜心黑的。你最好都不是。',
      ],
      neutral:[
        '沧州是武人之乡，男人能走镖，女人一样能！铁娘子的名号，沧州人没有不知道的！',
        '别看俺是女的，这把刀可不认男女——想试试么？',
        '走镖二十年，太行山、大漠都去过，没什么能难倒铁娘子！',
      ],
      friendly:[
        '来得正好。你若真想跟俺跑一趟路，先坐下喝口水，再聊哪条线最容易翻脸。',
        '俺看人不只看刀，也看骨头。你骨头不软，这点铁娘子记着。',
      ],
      close:[
        '你来了俺也去不绕弯子。真有险镖，旁人我未必带，你倒可以先听听。',
        '外头都只记得铁娘子够凶，你却知道俺也去会挑人、会护人。冲这点，俺也去愿意跟你说实话。',
      ],
    },
    greetingOverrides:[
      {
        requiresQuestState:{ questId:'quest_escort_rescue', status:'claimed' },
        greetings:{
          neutral:['铁娘子把刀往桌上一横，神色总算松了点："人和货都带回来了，这趟账俺也去记你一辈子。若想听后话，坐。"'],
          friendly:['铁娘子给你倒了碗凉茶："那趟劫镖案收住了，镖局里的人这两天说话都比平时响。你来得正好。"'],
          close:['铁娘子扬了扬下巴："外头都说俺也去命硬，俺也去知道，这趟能收回来是因为你没掉链子。坐近些，俺也去把后头整顿的人情事说给你。"'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_escort_rescue', statuses:['active','done'] },
        greetings:{
          neutral:['铁娘子按着刀鞘："劫镖的人还没清干净，这会儿俺也去没空说场面话。你若有线索，就直接讲。"'],
          friendly:['铁娘子朝门外看了一眼："人质还卡在山里，俺也去这口气一直没松。你若准备动身，俺也去把埋伏的地方再给你过一遍。"'],
          close:['铁娘子把嗓门压得极低："这趟不只是抢货，是有人想踩俺镖局的脸。你若肯出手，俺也去把最险那段路都摊开给你。"'],
        }
      },
      {
        requiresQuestState:{ questId:'quest_escort_reconnaissance', statuses:['active','done'] },
        greetings:{
          neutral:['铁娘子用刀尖在地上划了道线："北路那几处险口俺也去都标出来了。你若是来回踩点消息，先说地形。"'],
          friendly:['铁娘子把茶碗往地图上一压："俺也去现在最缺的不是人，是能把路看明白的人。你若带回了风声，就别卖关子。"'],
          close:['铁娘子把卷好的路图递到你面前："俺也去信你眼力，所以这份踩点图先给你看。哪块最像埋伏地，你我先对一遍。"'],
        }
      },
    ],
    topics:[
      { id:'t_cz_ew_join', text:'打听镖局情况', reply:'俺在沧州自己开了家小镖局，没有大名头，但信誉好！要请镖可以找俺。', relDelta:5 },
      { id:'t_cz_ew_skill', text:'聊武艺', reply:'俺练的是沧州枪棒，力道为先。女人力气小，就用巧劲补！', relDelta:7 },
      { id:'t_cz_ew_task', text:'有没有任务', reply:'有批货要从沧州送去涿州，但途中不太平，你要是顺路，可以帮把手。', relDelta:8, excludesQuestStates:[{ questId:'quest_escort_reconnaissance', statuses:['active','done'] }, { questId:'quest_escort_rescue', statuses:['active','done'] }] },
      { id:'t_cz_ew_rule', text:'问她挑人的规矩', reply:'铁娘子把刀鞘往地上一顿："俺挑人就看三样：遇事跑不跑、拿了钱认不认账、同伴倒下时回不回头。少一样，俺也去不用。"', relDelta:5 },
      { id:'t_cz_ew_road', text:'问最险的一次走镖', reply:'铁娘子眯了眯眼："太行山那回，下了一夜雪，前头是埋伏，后头是塌路。俺也去让车队灭灯走崖边，硬是把人和货都带出来了。怕当然怕，可一怕就真死了。"', relDelta:6, minRel:20 },
      { id:'t_cz_ew_soft', text:'问她有没有绝不接的活', reply:'铁娘子哼了一声："有。拿孩子当幌子的、拿女人当弃子的、还有事成了就想灭口的。银子再多俺也去不挣那种脏钱，睡不踏实。"', relDelta:7, minRel:60 },
      { id:'t_cz_ew_scout', text:'问北路踩点最该盯什么', doneText:'再问北路哪一段最容易翻车', reply:'铁娘子用手指在桌面敲了三下："桥、坡、林子口，这三样最要命。桥窄了车不好掉头，坡陡了人容易散，林子口一黑，就最适合人藏弩。"', repeatReply:'铁娘子把刀鞘横过来比了一下："俺也去最怕那种看着能过、实则一堵就全堵死的路。你记地形时，专盯这种地方。"', relDelta:4, minRel:20, requiresQuestState:{ questId:'quest_escort_reconnaissance', statuses:['active','done'] } },
      { id:'t_cz_ew_rescue', text:'问那帮劫镖人平常怎么下手', doneText:'再问劫镖人的领头路数', reply:'铁娘子眯起眼："真会劫镖的，不会一开始就抢货。他们先拆队、先吓马、再断后路，等车队自己乱了，才一口咬住最值钱那辆。"', repeatReply:'铁娘子把刀柄按得咯吱作响："俺也去最恨这种懂行的贼。因为他们不是碰运气，是拿别人的命换自己的门路。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'quest_escort_rescue', statuses:['active','done'] } },
      { id:'t_cz_ew_after', text:'问这趟人货带回后她先做了什么', doneText:'再听她讲镖局怎么收拾残局', reply:'铁娘子吐了口气："先点人，再点货，最后才骂人。镖局撑得住，不是因为没出事，是出了事以后还有人肯站回来认这块招牌。"', repeatReply:'铁娘子端起茶碗，一口喝干："俺也去把车队里每个人都重新排了一遍。能同生共死的留下，心飘的，就让他另找门路。"', relDelta:5, minRel:20, requiresQuestState:{ questId:'quest_escort_rescue', status:'claimed' } },
    ],
    shop: null,
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_gossip_weird_duel','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  汉中城 NPCs  (major · 蜀道咽喉)
  // ══════════════════════════════════════════════════════════

  hanzhong_inn: {
    id:'hanzhong_inn', name:'张蜀道', role:'汉中客栈掌柜', category:'inn', avatar:'🧔',
    city:'hanzhong', level:33, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:60,
    greetings:{
      hostile: '（张蜀道把算盘往桌上一搁）你若只是来惹事，这客栈待不了。',
      guarded: '（打量一眼）打尖还是住店？先说清楚再坐。',
      neutral:  '客官，汉中是蜀道要冲，南来北往的好汉都要在这儿歇脚！进来坐，喝碗米酒再走。',
      friendly: '来啦！汉中米饭刚出锅，今天还有腊肉，坐下吃饱再赶路！',
      close:    '（已经盛了饭）不用说，老位置，先吃饭，吃完再聊。',
    },
    topics:[
      { id:'t_hz_inn_price', text:'问住宿价格', reply:'上房一两半，中房七钱，大通铺三钱。', relDelta:0 },
      { id:'t_hz_inn_rumor', text:'汉中有什么消息？', reply:'最近秦岭山里有异动，有人见过成群的武林人从山里出来，又看不出是哪门哪派，诡异得很。', relDelta:2, intelId:'intel_road_bandit' },
      { id:'t_hz_inn_rest',  text:'住店一晚（10两）', reply:'好！汉中夜里凉，被子给你加厚一床！', relDelta:5, action:'inn_rest' },
    ],
    shop:null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_road_bandit','intel_local_gossip'],
  },

  hanzhong_smith: {
    id:'hanzhong_smith', name:'骆长铁', role:'汉中铁匠', category:'blacksmith', avatar:'⚒',
    city:'hanzhong', level:32, tier:'func',
    weapon:'wep_uc_dao', armor:'cs_ranger',
    silver:150,
    greetings:{
      hostile: '（锤子往铁砧上一搁）不买兵器就别挡在这儿碍事！',
      guarded: '（打铁不停，侧头瞥一眼）先说清楚，修兵器付现银，不赊账。',
      neutral:  '汉中的铁从汉水里淘来，柔韧性极好，打出的刀不容易断。客官要修兵器还是买新的？',
      friendly: '来来来，你上次那把刀我仔细看了看，钢口不错，就是用法不对——你握太紧了，松一些。',
      close:    '（递过一把刚淬火的匕首）这把送你，俺花了一晚上打的，汉水铁的手感，你会喜欢的。',
    },
    topics:[
      { id:'t_hz_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把东西放砧子上，俺给你掌掌眼。', relDelta:0, action:'identify_equip' },
      { id:'t_hz_smith_story', text:'聊经历', reply:'俺在汉中打了三十年铁，见过各路人马。最厉害的一批是从蜀中出来的，个个带着唐门暗器，不敢招惹……', relDelta:6 },
      { id:'t_hz_smith_tip',   text:'打听兵器消息', reply:'前几天有个从成都来的人，要我修一把奇怪的弩机，那机关精妙绝伦，像是唐门的东西——他修好就走了，还没付钱！', relDelta:2, intelId:'intel_poison_cult' },
    ],
    shop:{
      items:[
        { id:'item_whet', name:'磨刀石', desc:'提升攻击力5，持续5回合', icon:'🪨', price:10, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',  name:'护甲油', desc:'提升防御力5，持续5回合', icon:'🫙', price:8,  effect:{defBuff:5, turns:5} },
        { id:'item_arrow',name:'弩箭',   desc:'暗器类武器消耗品',       icon:'🏹', price:15, effect:{special:'dart_ammo'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels:['intel_poison_cult'],
  },

  hanzhong_tavern: {
    id:'hanzhong_tavern', name:'米香阿嫂', role:'汉中米酒馆', category:'tavern', avatar:'👩',
    city:'hanzhong', level:42, tier:'func',
    weapon:'wep_short_knife', armor:'cs_cloth',
    silver:45,
    greetings:{
      hostile: '（米香阿嫂抱臂冷脸）不喝酒不吃饭，杵我这儿干嘛？',
      guarded: '（头也不抬地擦碗）吃什么自己看牌子，别指望阿嫂给你推荐。',
      neutral:  '来来来，汉中米酒！自家酿的，香甜好喝，不上头！今儿还有刚蒸的汉中面皮！',
      friendly: '又来啦！上次你说爱吃辣的，阿嫂今天特意多放了油泼辣子，一碗管你过瘾！',
      close:    '（拉着坐下）快坐快坐，你那份腊肉阿嫂给你留着呢，别处吃不到这味儿。',
    },
    topics:[
      { id:'t_hz_tav_drink',  text:'喝碗米酒（2两）', reply:'（米香阿嫂盛来满满一碗）汉中米酒，甜而不腻，喝完精神来了！', relDelta:5, action:'buy_drink' },
      { id:'t_hz_tav_gossip', text:'打听消息', reply:'最近有个戴斗笠的男子连住了三天，啥都不说，每天就坐在门口望着蜀道方向。昨天突然不见了，好奇怪……', relDelta:3, intelId:'intel_local_gossip' },
      { id:'t_hz_tav_eat',    text:'吃碗汉中面皮（1两）', reply:'（一碗红辣辣的汉中面皮端上，吃完大汗淋漓，浑身通畅）', relDelta:5, action:'pay_song' },
    ],
    shop:{
      items:[
        { id:'item_hanzhong_rice_wine', name:'汉中米酒',  desc:'温润香甜，精力+25',    icon:'🍶', price:2, effect:{energy:25} },
        { id:'item_mianpi',             name:'汉中面皮',  desc:'特色小吃，饱食度+30',  icon:'🍜', price:3, effect:{food:30} },
        { id:'item_hanzhong_pork',      name:'汉中腊肉',  desc:'腌制腊肉，饱食度+35', icon:'🥩', price:8, effect:{food:35} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels:['intel_local_gossip'],
  },

  hanzhong_doctor: {
    id:'hanzhong_doctor', name:'秦望山', role:'秦岭药农', category:'misc', avatar:'🌿',
    city:'hanzhong', level:33, tier:'func',
    weapon:'wep_dark_knife', armor:'cs_cloth',
    silver:70,
    greetings:{
      hostile: '（秦望山盯着你的伤口）中毒的？别把毒气带到我药铺里来。',
      guarded: '（摆弄草药，不看你）山里人卖药，不还价。看不中就走。',
      neutral:  '秦岭山里的草药，百年难得一见的都有。客官脚步沉重，是蜀道走伤了腿？来，俺给你敷敷。',
      friendly: '老熟人了！上次给你配的跌打酒用完没有？俺新采了一批秦岭赤芍，比上次的还好。',
      close:    '（从里屋端出一罐膏药）这个方子俺只给你，百年秦岭雪莲调的，一般人连见都没见过。',
    },
    topics:[
      { id:'t_hz_doc_heal',  text:'治伤（25两）', reply:'（秦岭草药外敷，内服调理，比城里的方子还管用）秦岭草药，天下第一！', relDelta:3, action:'heal_hp' },
      { id:'t_hz_doc_herbs', text:'买草药', reply:'这些都是秦岭深处的珍稀草药，平地上买不到！', relDelta:0, action:'open_shop' },
      { id:'t_hz_doc_talk',  text:'聊山里的事', reply:'秦岭里有个山谷，住着一个老道士，据说活了百余岁，武功深不可测，但不与外人往来，俺见过一次，从此再也找不到那条路了……', relDelta:4 },
    ],
    shop:{ type:'medicine',
      items:[
        { id:'item_herb_blood', name:'活血草',   desc:'活血化瘀，回复气血30', icon:'🌿', price:6,  effect:{hp:30} },
        { id:'item_herb_qi',    name:'秦岭参须', desc:'大补内力，回复内力60', icon:'🌱', price:18, effect:{mp:60} },
        { id:'item_herb_anti',  name:'解毒丸',   desc:'解除中毒状态',         icon:'💊', price:18, effect:{detox:true} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels:['intel_cultivation_tip'],
  },

  // 汉中·蜀道女镖头
  hanzhong_escort_woman: {
    id:'hanzhong_escort_woman', name:'苗翠花', role:'蜀道女镖头', category:'escort', avatar:'🗡',
    city:'hanzhong', level:48, tier:'major',
    weapon:'wep_uc_iron_sword', armor:'cs_ranger',
    silver:220,
    greetings:{
      hostile: '（苗翠花按着刀柄）蜀道上不讲规矩的人，俺见过太多了。',
      guarded: '（打量你）走蜀道的？看你脚步虚浮，怕是第一次翻秦岭。',
      neutral:  '蜀道难，难于上青天！但俺苗翠花走了十五年，没有一次出过事！要押镖还是问路？',
      friendly: '嘿，你又来了！上回带你过的那截栈道，最近落了石头不太好走，俺给你画条新路。',
      close:    '（拍拍你肩膀）姐妹/兄弟，这条蜀道上谁敢动你，报俺苗翠花的名字——这方圆百里，俺的面子还是管用的。',
    },
    topics:[
      { id:'t_hz_ew_route', text:'打听蜀道情况', reply:'蜀道分东线和西线。东线容易些但有水贼，西线险峻但贼少。俺一般走东线，但这月东线来了批新匪，有点棘手……', relDelta:6, intelId:'intel_road_bandit' },
      { id:'t_hz_ew_task', text:'有没有任务', reply:'有趟镖从汉中到成都，货主不肯透露货物内容，但价钱给得高。你要一同护镖么？', relDelta:8 },
      { id:'t_hz_ew_background', text:'打听来历', reply:'俺是汉中本地人，自幼随父学武，父亲过世后接手了这条蜀道镖路，一走就是十五年。', relDelta:5 },
    ],
    shop: null,
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_gossip_weird_duel'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  少林寺 NPCs  (sect_location · supreme)
  // ══════════════════════════════════════════════════════════

  shaolin_elder: {
    id:'shaolin_elder', name:'方丈无相大师', role:'少林方丈', category:'sect', avatar:'☸',
    city:'shaolin_temple', level:111, tier:'func',
    weapon:'wep_nine_ring', armor:'cs_lg_shaolin',
    silver:10,
    greetings:{
      hostile: '（双目猛睁，佛光隐现）施主杀气太重，少林清净之地，不欢迎尔等。',
      guarded: '（微闭双目）阿弥陀佛，施主请留步。少林山门，非有缘者不得擅入。',
      neutral:  '阿弥陀佛，施主远道而来，定有缘法。少林山门，有缘者方能入内。',
      friendly: '（含笑）施主心性纯良，老衲与你甚是有缘。来，坐下喝杯禅茶，聊聊佛法。',
      close:    '（亲自为你斟茶）在方丈眼中，你已如少林弟子一般。有困惑时，随时来寻老衲。',
    },
    topics:[
      { id:'t_sl_elder_skill', text:'学习少林武功', reply:'少林武功需有缘人，且须通过考验。施主若有诚心，可从达摩院基础功法开始修习。', relDelta:2, action:'go_skills' },
      { id:'t_sl_elder_lore',  text:'了解少林历史', reply:'少林寺千年古刹，达摩祖师面壁九年传下衣钵。七十二绝技、易筋经、洗髓经，皆是无量功德之法。', relDelta:6 },
      { id:'t_sl_elder_ask',   text:'请教佛法', reply:'（微微一笑）施主心中有困惑，便已踏上觉悟之路。放下屠刀，立地成佛——此言并非要你不习武，而是教你以慈悲之心用武。', relDelta:8 },
      { id:'t_sl_elder_manual', text:'求购武学秘籍', reply:'（合十）阿弥陀佛。少林功法自有传承，轻易不传外姓之人。然施主有缘来此，少林慈悲，可传入门之法——但需以善念修习！', relDelta:10, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_bd_frag1',     icon:'📜', name:'少林入门残卷', desc:'【佛系残卷】解锁少林第一式', price:250, effect:{ manual:'m_bd_frag1' } },
      { id:'m_bd_partial1',  icon:'📗', name:'罗汉拳残本',   desc:'【佛系残本】解锁2式护体功法', price:400, effect:{ manual:'m_bd_partial1' } },
      { id:'m_fo_frag1',     icon:'📜', name:'霸拳残卷',     desc:'【力系残卷】解锁力系第一式', price:200, effect:{ manual:'m_fo_frag1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome'],
    intels:['intel_sect_secret'],
  },

  shaolin_monk: {
    id:'shaolin_monk', name:'慧空', role:'少林首座武僧', category:'sect', avatar:'🥋',
    city:'shaolin_temple', level:91, tier:'major',
    weapon:'wep_uc_bamboo_staff', armor:'cs_shaolin',
    silver:20,
    greetings:{
      hostile: '（横棍挡路）施主，你的杀意慧空感应得到——少林圣地，退出去！',
      guarded: '施主，少林圣地，闲人勿近。你来此处，有何目的？说清楚。',
      neutral:  '（双手合十）阿弥陀佛。施主的武功颇有火气，需要磨砺。有何贵干？',
      friendly: '（收棍让路）施主，达摩院今日恰好有空，要不要进来练几招？',
      close:    '（拍拍你的肩膀）你的棍法进步不小。慧空有一套从未教人的伏虎棍法残式，改天传你。',
    },
    topics:[
      { id:'t_sl_monk_ask',   text:'打听少林武学', reply:'少林七十二绝技，各有所长。外人学了也难得精髓，需有佛心方能修习。', relDelta:3 },
      { id:'t_sl_monk_train', text:'请求指点（关系>40）', reply:'（审视片刻）好，慧空传你"少林铁砂掌"入门心法，其余须靠自悟。', relDelta:10, action:'train_skill', minRel:40 },
      { id:'t_sl_monk_fight', text:'与武僧切磋', reply:'（点头）敢在少林切磋，胆气可嘉。来！（棍影如飞，招招精妙）', relDelta:5 },
    ],
    shop:null,
    quests:['quest_sect_mission','quest_monk_demon_banish','quest_monk_pilgrim_escort'],
    intels:['intel_cultivation_tip'],
  },

  shaolin_smith: {
    id:'shaolin_smith', name:'魏守诚', role:'少林俗家铁匠', category:'blacksmith', avatar:'🔨',
    city:'shaolin_temple', level:84, tier:'func',
    weapon:'wep_uc_bamboo_staff', armor:'cs_cloth',
    silver:100,
    greetings:{
      hostile: '（锤子一横）少林铁铺不招待闹事的人，施主请回！',
      guarded: '阿弥陀佛……施主要买兵器？先付银子，不赊不换。',
      neutral:  '阿弥陀佛！俺是少林俗家弟子，负责打造寺里的器具和兵器。嵩山铁矿品质极好，施主若需要，俺这儿有余货。',
      friendly: '来啦！上次你买的那把戒刀，俺又帮你淬了一遍火，比当初更硬了——来拿吧，不加钱。',
      close:    '（从暗格里取出一柄精钢短棍）这个是俺私底下用百年嵩山铁打的，寺里不让卖，送你了，别声张。',
    },
    topics:[
      { id:'t_sl_smith_identify', text:'🔍 鉴定装备（收费）', reply:'阿弥陀佛……施主把装备取来，贫僧略通此道。', relDelta:0, action:'identify_equip' },
      { id:'t_sl_smith_talk', text:'聊聊少林', reply:'俺在少林当俗家弟子二十年了，学了两套棍法，没出家，但也不回家——少林这地方，待惯了就走不了了。', relDelta:5 },
    ],
    shop:{
      items:[
        { id:'item_whet',   name:'嵩山磨刀石', desc:'提升攻击力5，持续5回合', icon:'🪨', price:15, effect:{atkBuff:5, turns:5} },
        { id:'item_oil',    name:'护甲油脂',   desc:'提升防御力5，持续5回合', icon:'🫙', price:12, effect:{defBuff:5, turns:5} },
        { id:'item_herb_qi', name:'参须片',    desc:'大补内力，回复内力50',   icon:'🌱', price:15, effect:{mp:50} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels:['intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  华山·剑宗峰 NPCs  (sect_location · major)
  // ══════════════════════════════════════════════════════════

  huashan_elder: {
    id:'huashan_elder', name:'紫霄', role:'华山掌门', category:'sect', avatar:'⚔',
    city:'huashan_sect', level:68, tier:'elite',
    weapon:'wep_heaven_sword', armor:'cs_ep_sword',
    silver:30,
    greetings:{
      hostile: '（剑意凛冽，寒气逼人）华山剑宗不收心术不正之人——你身上杀气太重。',
      guarded: '（剑意如霜）来到华山绝顶，你的剑气还是太软。先练基本功。',
      neutral:  '华山剑宗讲究一个"快"字，快到极处，便是无敌。你来华山，是学剑还是比剑？',
      friendly: '（微微颔首）你最近剑法有长进，气宗那帮人看了都要说嘴。来，紫霄给你斟茶。',
      close:    '（望着远方，语气难得温和）气宗剑宗之争……你或许能找到第三条路。本座等着看。',
    },
    topics:[
      { id:'t_hs_elder_skill', text:'学习华山剑法', reply:'华山剑法讲究以意驭剑，快中有意，意中有力。想学，先走三百招再说。', relDelta:2, action:'go_skills' },
      { id:'t_hs_elder_lore',  text:'了解华山派', reply:'华山以剑立派，百年来剑宗气宗之争未息。剑宗主攻，气宗主守，各有所长，各有弊端。本座以为，剑气双修，方是正道。', relDelta:6 },
      { id:'t_hs_elder_train', text:'请求指点（关系>50）', reply:'（点头，缓缓抽剑）华山绝顶之上，本座传你"独孤九剑"第一式——总诀式。', relDelta:15, action:'train_skill', minRel:50 },
      { id:'t_hs_elder_manual', text:'求购武学秘籍', reply:'（冷冷一瞥）你倒有眼光。华山剑典，从来只传有缘人——出价合适，本座可割爱几本。', relDelta:8, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_sw_partial1',  icon:'📗', name:'剑宗秘要残本', desc:'【剑系残本】解锁2式犀利剑招', price:360, effect:{ manual:'m_sw_partial1' } },
      { id:'m_sw_complete1', icon:'📘', name:'御风剑典完本', desc:'【剑系完本】解锁3式剑道绝学（需大成）', price:680, effect:{ manual:'m_sw_complete1' } },
      { id:'m_wi_partial1',  icon:'📗', name:'御风轻功残本', desc:'【风系残本】解锁2式凌空步法', price:380, effect:{ manual:'m_wi_partial1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome'],
    intels:['intel_sect_secret'],
  },

  huashan_swordsman: {
    id:'huashan_swordsman', name:'叶孤行', role:'华山剑客', category:'sect', avatar:'🗡',
    city:'huashan_sect', level:46, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:50,
    greetings:{
      hostile: '（手按剑柄，眼神冰冷）华山之上，不欢迎来路不明的人。',
      guarded: '华山险，剑更险。你既然上来了，就不要急着下去——先亮亮你的本事。',
      neutral:  '（随意地靠着峭壁）闲着无事，切磋一下？在华山，不会剑法的人连路都走不稳。',
      friendly: '来了？正好，我新悟了一招"落雁回风"，找不到人试，你来帮我接接。',
      close:    '（递过一壶酒）咱俩现在算华山上最闲的两个人了。喝一杯，我教你一招紫霄掌门从不外传的起手式。',
    },
    topics:[
      { id:'t_hs_sword_ask',   text:'请教剑法', reply:'剑法没什么秘诀，就是练。练到剑与人合一，才算入门。本座在华山练了二十年，还觉得不够。', relDelta:5 },
      { id:'t_hs_sword_train', text:'切磋（关系>30）', reply:'（拔剑，剑光如白虹）来！不留手，看你能接几招！', relDelta:10, action:'train_skill', minRel:30 },
      { id:'t_hs_sword_past',  text:'聊聊他的来历', reply:'本座是风清扬前辈的关门弟子——不对，应该说，本座有幸在华山某处偶遇了一位高人，学了几手……那人已不知所踪。', relDelta:6 },
    ],
    shop:null,
    quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels:['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  武当山·紫霄宫 NPCs  (sect_location · major)
  // ══════════════════════════════════════════════════════════

  wudang_elder: {
    id:'wudang_elder', name:'张玄机', role:'武当掌门', category:'sect', avatar:'☯',
    city:'wudang_peak', level:83, tier:'elite',
    weapon:'wep_taiji_sword', armor:'cs_lg_wudang',
    silver:10,
    greetings:{
      hostile: '（太极内力运转周身，袍袖鼓荡）施主心有戾气，武当山不宜久留。',
      guarded: '（双目微闭）道法自然，无为而无不为。施主来武当，所为何事？',
      neutral:  '武当武学，以柔克刚，以静制动。施主身上的内力颇为纯正，是有师承的人。',
      friendly: '（微微一笑）施主近来修为精进，内力比上次见面更加沉稳。来，与掌门论一论道。',
      close:    '（亲自引路）你已非外人。武当后山的太极泉，只有亲传弟子才知道——带你去坐坐。',
    },
    topics:[
      { id:'t_wd_elder_skill', text:'学习武当功法', reply:'武当太极，入门易，大成难。先习太极拳法，以气行拳，以意驭剑，方能领悟武当真髓。', relDelta:2, action:'go_skills' },
      { id:'t_wd_elder_lore',  text:'了解武当', reply:'武当以道立派，百年来以太极为本，融阴阳之变于武学之中。本派弟子不争先机，后发制人，以不变应万变。', relDelta:6 },
      { id:'t_wd_elder_ask',   text:'请教道法', reply:'（徐徐开口）道德经有云：柔弱胜刚强。武学亦然——化掉对方的力，比硬接更高明。这是武当的根本。', relDelta:8 },
      { id:'t_wd_elder_manual', text:'求购武学秘籍', reply:'（缓缓睁眼）施主能来武当山，已是有缘。武当道经与太极典籍，可传有缘人——但需以正道修习，不可为恶。', relDelta:10, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_ta_frag1',     icon:'📜', name:'太极基础残卷', desc:'【道系残卷】解锁太极第一式', price:220, effect:{ manual:'m_ta_frag1' } },
      { id:'m_ta_partial1',  icon:'📗', name:'道门心法残本', desc:'【道系残本】解锁2式以柔克刚之法', price:400, effect:{ manual:'m_ta_partial1' } },
      { id:'m_ta_complete1', icon:'📘', name:'玄真道经完本', desc:'【道系完本】解锁3式道家绝学（需大成）', price:720, effect:{ manual:'m_ta_complete1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome'],
    intels:['intel_sect_secret'],
  },

  wudang_taoist: {
    id:'wudang_taoist', name:'玄清', role:'武当首席长老', category:'sect', avatar:'🌙',
    city:'wudang_peak', level:71, tier:'elite',
    weapon:'wep_cold_light', armor:'cs_ep_sword',
    silver:30,
    greetings:{
      hostile: '（拂尘一甩，气流涌动）少年，你身上杀孽不轻，贫道劝你莫上武当。',
      guarded: '（目光清澈如水）少年，你来武当，是寻武功还是寻道？先说清来意。',
      neutral:  '武当山云雾缭绕，常住者自然心静。贫道玄清，有何疑问，尽管开口。',
      friendly: '（笑着递来一杯道茶）你的悟性比上回又好了些。来，尝尝今年新采的武当银针。',
      close:    '（引你到后殿）贫道有一套"紫霄道经"注解，从未给外人看过——你我交情到了，赠你参悟。',
    },
    topics:[
      { id:'t_wd_tao_ask',   text:'请教太极心法', reply:'太极之道，在于阴阳调和。一阴一阳谓之道，刚柔并济，方能走遍天下。', relDelta:5 },
      { id:'t_wd_tao_train', text:'请求指点（关系>35）', reply:'（微笑）好，贫道教你太极推手的第一层心法——引进落空。', relDelta:10, action:'train_skill', minRel:35 },
      { id:'t_wd_tao_past',  text:'聊聊过去', reply:'贫道年轻时也行走江湖，见过太多杀伐，后来遇见掌门真人，方知武学不只是杀人之术……入武当，是贫道此生最正确的决定。', relDelta:6 },
    ],
    shop:null,
    quests:['quest_sect_mission','quest_taoist_herb_gather','quest_monk_demon_banish'],
    intels:['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  日月神教·圣殿 NPCs  (sect_location · supreme)
  // ══════════════════════════════════════════════════════════

  riyue_envoy: {
    id:'riyue_envoy', name:'周炎阳', role:'日月神教光明使', category:'misc', avatar:'🌙',
    city:'riyue_sect', level:117, tier:'func',
    weapon:'wep_sun_spear', armor:'cs_lg_riyue',
    silver:100,
    greetings:{
      hostile: '（杀意如实质压来）圣教总坛岂容你放肆？再进一步，别怪周某不客气。',
      guarded: '（目光如炬）圣教总坛，闲杂人等不得入内。你是什么人？报上名来。',
      neutral:  '日月神教，号令天下，莫敢不从。你既然到了这里，就要讲规矩。有本事的人，教主自然看得上。',
      friendly: '（嘴角微扬）你倒有几分真本事。教中最近有些差事需要可靠的人，你有没有兴趣？',
      close:    '（压低声音）有些话只能对信得过的人说——教内局势不稳，你小心些，有什么风声先来告诉我。',
    },
    topics:[
      { id:'t_ry_envoy_ask',   text:'打听日月神教', reply:'神教是天下第一大教，教众数十万，教主神功盖世，武林各派莫敢撄其锋。你想加入？还是来找麻烦？', relDelta:3 },
      { id:'t_ry_envoy_skill', text:'学习神教功法', reply:'神教功法非弟子不传。你若有意加入圣教，本使可代为引荐。教主若看得上，自然传你上乘武功。', relDelta:2, action:'go_skills' },
      { id:'t_ry_envoy_intel', text:'打探教内消息（20两）', reply:'（冷冷一笑，接过银子）告诉你：教内最近有人觊觎教主之位，暗中动作不少……说多了对你我都没好处。', relDelta:5, action:'pay_info', intelId:'intel_tianshu' },
    ],
    shop:null,
    quests:['quest_sect_mission','quest_spy_trail'],
    intels:['intel_tianshu','intel_mingjiao_rise'],
  },

  riyue_merchant: {
    id:'riyue_merchant', name:'霍明达', role:'圣殿供奉', category:'misc', avatar:'🛒',
    city:'riyue_sect', level:68, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:300,
    greetings:{
      hostile: '（冷冷打量）你不是教中的人吧？圣殿供奉的货物，不对外人开放。',
      guarded: '速战速决，圣教的人都忙着——你要什么，快说，先付银子。',
      neutral:  '圣教有专属货源，外人难得一见。你有缘进来，不妨看看。本座经手的货，质量有保证。',
      friendly: '来啦？上次你要的那批嵩山铁本座给你留着了，这东西外面根本搞不到。',
      close:    '（从暗柜里取出一个锦盒）这玩意儿是教主亲自从西域弄来的，本座偷偷留了一件——给你了，别让第三个人知道。',
    },
    topics:[
      { id:'t_ry_merch_buy',  text:'看看货物', reply:'圣教特供，包括稀有草药、异域兵器、秘制丹药，都有！', relDelta:0, action:'open_shop' },
      { id:'t_ry_merch_info', text:'打听神教动向', reply:'（压低声音）最近教主闭关，各路高手都蠢蠢欲动……你这消息不值银子，送你了。', relDelta:2, intelId:'intel_mingjiao_rise' },
    ],
    shop:{
      items:[
        { id:'item_elixir',      name:'灵药',    desc:'回复气血内力各50',     icon:'⚗',  price:40, effect:{hp:50, mp:50} },
        { id:'item_herb_anti',   name:'解毒丸',  desc:'解除中毒状态',         icon:'💊', price:20, effect:{detox:true} },
        { id:'item_sunflower_wine', name:'葵花酿', desc:'神教秘酿，精力+50', icon:'🌻', price:35, effect:{energy:50} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels:['intel_mingjiao_rise'],
  },

  // ══════════════════════════════════════════════════════════
  //  大理城 NPCs  (major · 苍山洱海 · 南天佛国)
  // ══════════════════════════════════════════════════════════

  // 大理·洱海客栈掌柜
  dali_inn: {
    id:'dali_inn', name:'段伯明', role:'洱海客栈掌柜', category:'inn', avatar:'🌸',
    city:'dali', level:42, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:90,
    greetings:{
      hostile: '（冷淡地擦着柜台）客栈满了，客官另请高明。',
      guarded: '大理风景好，但江湖事也多。客官是来游山还是来找人的？',
      neutral:  '客官远道而来，大理苍山洱海，风景独好，住一住值得！天龙寺就在附近，若有心可去参拜。',
      friendly: '来了来了！上次你要的临湖雅间给你留着呢。段伯明今天亲自下厨，给你整了一桌白族家常菜。',
      close:    '（把钥匙直接递过来）你那间房俺一直给你留着，随时来随时住，不收钱——咱们啥交情，说钱就见外了。',
    },
    topics:[
      { id:'t_dl_inn_rest',  text:'住店一晚（10两）', reply:'苍山晚风清爽，比中原的热夜好多了！客官睡个好觉！', relDelta:5, action:'inn_rest' },
      { id:'t_dl_inn_tianlong',text:'打听天龙寺情况', reply:'天龙寺是皇家寺院，供奉着大理段氏历代先祖。寺内有高僧，武功深不可测，但不轻易见外人。若有缘，自然相遇。', relDelta:4, intelId:'intel_sect_secret' },
      { id:'t_dl_inn_scenery', text:'游洱海要注意什么？', reply:'洱海水深，有几处礁石暗流，不熟悉的不要乱游。岸边的白族渔村热情好客，可以跟他们学钓鱼，鱼特别大！', relDelta:3 },
    ],
    shop: null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  // 大理·天龙寺执事高僧
  dali_monk: {
    id:'dali_monk', name:'本因大师', role:'天龙寺执事高僧', category:'sect', avatar:'☸',
    city:'dali', level:47, tier:'major',
    weapon:'wep_uc_bamboo_staff', armor:'cs_scholar',
    silver:200,
    greetings:{
      hostile: '（双手合十，目光严厉）施主戾气深重，天龙寺不渡无心之人。',
      guarded: '施主来自何方？天龙寺虽非圣地，但也非随意出入之地。请先表明来意。',
      neutral:  '施主来自何方？天龙寺非圣地，任何有缘人皆可叩门。老衲在此数十年，放下的比拿起的要多。',
      friendly: '（含笑）施主又来了，缘分使然。天龙寺后山有一眼温泉，专治内伤，老衲引你去。',
      close:    '（引你入内殿）老衲有一部未完的经书注解，正缺一位武功上有所悟的友人参详——施主若不嫌弃，与老衲共修如何？',
    },
    topics:[
      { id:'t_dl_monk_heal',  text:'请大师为内伤调理（40两）', reply:'（轻轻按穴导气）施主内力运行不畅，当是强行修炼所伤。老衲为你调和气脉，今后切莫急于求成。', relDelta:5, action:'heal_mp' },
      { id:'t_dl_monk_talk',  text:'请教武学境界',              reply:'武学之道，在于悟而非学。技击只是外壳，内心的平静才是根本。杀伐之气若不化解，武功越高，心魔越深。施主可有此感？', relDelta:6 },
      { id:'t_dl_monk_intel', text:'询问大理武林秘事',          reply:'（沉默片刻）多年前，有一部古武学典籍曾在大理出现。老衲见过一眼，确是旷世奇书。但持书之人为此饱受追杀，最终将典籍藏于某处，告诫后人：无德者得之，反受其害……', relDelta:4, intelId:'intel_tianshu' },
    ],
    shop:{
      items:[
        { id:'item_tianlong_pill',  name:'天龙禅药', desc:'内力+80，极品药物',         icon:'💊', price:60, effect:{mp:80} },
        { id:'item_herb_qi',        name:'参须片',   desc:'大补内力，回复内力50',       icon:'🌱', price:15, effect:{mp:50} },
        { id:'item_herb_blood',     name:'活血草',   desc:'活血化瘀，回复气血30',       icon:'🌿', price:8,  effect:{hp:30} },
        { id:'item_incense_peace',  name:'定心香',   desc:'精力+40，减少焦虑烦躁',     icon:'🕯', price:20, effect:{energy:40} },
      ]
    },
    quests:['quest_sect_mission','quest_monk_demon_banish','quest_monk_pilgrim_escort'],
    intels: ['intel_tianshu'],
  },

  // 大理·白族药铺女医师
  dali_doctor: {
    id:'dali_doctor', name:'阿苓', role:'白族药铺医师', category:'medicine', avatar:'👩‍⚕️',
    city:'dali', level:47, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_cloth',
    silver:100,
    greetings:{
      hostile: '（银针在手，神情戒备）阿苓的药铺不治来历不明的人，请回。',
      guarded: '苍山草药有灵气，但不是谁都配用的。你要看什么病？先说清楚。',
      neutral:  '阿苓的药铺，苍山草药最全！刀伤、箭伤、毒伤，没有治不了的。白族有句话：药医有缘人。',
      friendly: '回来了？上次给你配的活血散用完没有？阿苓又新采了一批苍山雪莲，效果比上回还好。',
      close:    '（从里屋端出一碗药汤）这方子是阿苓祖传的，从不给外人喝——你受了内伤还硬撑着，趁热喝了吧。',
    },
    topics:[
      { id:'t_dl_doc_heal',  text:'治伤',  reply:'（轻柔地处理伤势）苍山雪水温度刚好，先洗净伤口，再敷白族特制药草，包好了！', relDelta:4, action:'heal_hp' },
      { id:'t_dl_doc_detox', text:'解毒（40两）',  reply:'（嗅了嗅中毒部位）是苗疆蛊毒……阿苓研究过，有解法，但材料珍贵。先用这个应急，完全根治需要时间！', relDelta:5, action:'detox' },
      { id:'t_dl_doc_herbs', text:'购买草药',       reply:'苍山的草药，每一样都是阿苓亲自去采的，新鲜！', relDelta:0, action:'open_shop' },
    ],
    shop:{ type:'medicine',
      items:[
        { id:'item_cangshan_herb', name:'苍山灵草',  desc:'回复气血50，效果绝佳',       icon:'🌿', price:12, effect:{hp:50} },
        { id:'item_bai_medicine',  name:'白族秘药',  desc:'回复内力60，白族祖传',        icon:'🌱', price:18, effect:{mp:60} },
        { id:'item_herb_anti',     name:'蛊毒解药',  desc:'解除中毒/蛊毒状态',           icon:'💊', price:35, effect:{detox:true} },
        { id:'item_erhai_fish',    name:'洱海鱼干',  desc:'饱食度+30，口渴度+10，香鲜', icon:'🐟', price:4,  effect:{food:30} },
      ]
    },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels: ['intel_poison_cult'],
  },

  // 大理·点苍派剑客
  dali_swordsman: {
    id:'dali_swordsman', name:'玉苍霜', role:'点苍派剑客', category:'sect', avatar:'⚔',
    city:'dali', level:54, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:250,
    greetings:{
      hostile: '（按剑冷视）点苍派不与邪道之人论剑，请自重。',
      guarded: '点苍山上习剑十年，下山走走江湖。阁下是哪路朋友？先报个名号。',
      neutral:  '大理的剑法融合了佛门内力，和中原武学不同。苍山剑法讲究"以柔克刚"——有机会切磋切磋！',
      friendly: '老兄剑法又有进步！点苍山上俺闭关了三个月，新悟了几招，正好找你试手。',
      close:    '（拍着你的肩）走，苍山顶上。俺有桩心事想跟你说——关于你上次提的那位中原高手，俺找到线索了。',
    },
    topics:[
      { id:'t_dl_sword_spar',  text:'切磋武艺', reply:'（微微一礼，缓缓拔剑）请！（一番较量后）中原武学果然名不虚传！玉某受益匪浅，改日再切磋！', relDelta:8, action:'spar_fight' },
      { id:'t_dl_sword_teach', text:'请教点苍剑法',  reply:'点苍剑法的要诀在"悟"——悟苍山的刚劲，悟洱海的柔情，刚柔相济方是剑道真谛。光靠力量是走不远的。', relDelta:5 },
      { id:'t_dl_sword_intel', text:'打听云南武林情况', reply:'云南地广，武林人士比中原少，但各族都有自己的武功秘传。五毒教在苗疆活跃，天龙寺影响力极大。若往更南走，要注意蛊毒，那东西防不胜防。', relDelta:4, intelId:'intel_poison_cult' },
    ],
    shop: null,
    quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_poison_cult'],
  },

  // ══════════════════════════════════════════════════════════
  //  重庆渝州 NPCs  (major · 两江汇流 · 山城码头)
  // ══════════════════════════════════════════════════════════

  // 重庆·渝州码头旅舍掌柜
  chongqing_inn: {
    id:'chongqing_inn', name:'袁二爷', role:'码头旅舍掌柜', category:'misc', avatar:'⛵',
    city:'chongqing', level:50, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:80,
    greetings:{
      hostile: '（护住柜台）码头上不欢迎闹事的人，朋友另请吧。',
      guarded: '（打量一番）渝州码头不是谁都能歇脚的，先亮亮你的来路。',
      neutral:  '朋友，来了！码头上风大浪急，先进来喝碗豆花，歇歇脚！俺们这里袍哥文化，见到熟人叫声"自己人"，比啥都管用！',
      friendly: '（拉着坐下）又来啦！二爷今天搞了条好鱼，晚上给你炖个酸菜鱼，码头上最好的味道！',
      close:    '（低声）你那间房俺一直留着，钥匙在老地方。另外——李扳爷那边有话让你去一趟，好像有要紧事。',
    },
    topics:[
      { id:'t_cq_inn_rest',  text:'住店一晚（10两）', reply:'好！码头夜晚船歌不断，习惯了比音乐还好听，客官不会觉得吵的！', relDelta:5, action:'inn_rest' },
      { id:'t_cq_inn_guild', text:'打听码头帮会情况', reply:'渝州码头是袍哥堂口的地盘，外来武人想立足，最好先拜见码头舵主李扳爷，否则难以行事。俺认识他，可以引荐。', relDelta:4 },
      { id:'t_cq_inn_rumor', text:'听听渝州最新消息', reply:'最近从成都方向来了一批人，据说是唐门的，在城里暗中查什么人，神神秘秘的。码头上有人说见过那伙人往川江上游去了……', relDelta:3, intelId:'intel_sect_secret' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  // 重庆·码头袍哥舵主
  chongqing_boss: {
    id:'chongqing_boss', name:'李扳爷', role:'袍哥堂口舵主', category:'special', avatar:'🐉',
    city:'chongqing', level:84, tier:'elite',
    weapon:'wep_m_chaos_saber', armor:'cs_ep_iron',
    silver:600,
    greetings:{
      hostile: '（手按刀柄，身后涌出几个壮汉）渝州码头不欢迎不守规矩的外人。',
      guarded: '江湖规矩，先说自己是哪路人。不藏着掖着，大家好说话。袍哥堂口不信空口白话。',
      neutral:  '哟，朋友，认识认识！我叫李扳爷，渝州码头我说了算！袍哥堂口不排外，但凡事先讲规矩，大家都是规矩人。',
      friendly: '来来来，坐下喝酒！在渝州码头，你算是俺李扳爷看得上的人——有什么难处尽管开口。',
      close:    '（关上门，压低声音）这桩事只能跟你说——码头下面有批货被人盯上了，俺信不过旁人，你帮俺盯着。',
    },
    topics:[
      { id:'t_cq_boss_info',   text:'打听渝州江湖格局', reply:'渝州分三股势力：码头袍哥管水上生意，唐门在西边山头，还有一帮神出鬼没的绿林好汉占着东边山道。三方目前还算平静，但平静里暗流涌动……', relDelta:5, intelId:'intel_sect_secret' },
      { id:'t_cq_boss_job',    text:'有没有差事可做', reply:'正好有桩事。最近有一批货要送到乐山，路上不太平，需要个有真本事的护送。成了，五十两，另外老夫记你一份交情！', relDelta:4, action:'quest_start' },
      { id:'t_cq_boss_invite', text:'结交一下', reply:'好说！渝州袍哥堂口的朋友，路上互相照应，这是规矩。你来渝州，算是认识了俺李扳爷，以后有难处，说一声！', relDelta:10 },
    ],
    shop: null,
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_matchmaking_trouble','quest_gossip_hidden_wealth'],
    intels: ['intel_sect_secret'],
  },

  // 重庆·江边麻辣火锅摊
  chongqing_hotpot: {
    id:'chongqing_hotpot', name:'花椒妹', role:'火锅摊老板娘', category:'misc', avatar:'🌶',
    city:'chongqing', level:41, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:40,
    greetings:{
      hostile: '（铲子往锅里一敲）吃不吃？不吃别挡着花椒妹做生意！',
      guarded: '来吃火锅就坐下，不吃的别占位子——花椒妹这摊子小，谢绝白看。',
      neutral:  '来来来！重庆火锅！麻辣鲜香，吃了浑身热乎！我家底料祖传秘方，吃一次想一辈子！',
      friendly: '又来啦！知道你爱吃辣，花椒妹今天给你加了个"地狱辣"的锅底，一般人受不了，你肯定行！',
      close:    '（端上一碗私房蘸料）这个方子花椒妹谁都没给过——你品品，配毛肚绝了。吃完了锅底你带回去，晚上自己热热还能再吃一顿。',
    },
    topics:[
      { id:'t_cq_hp_eat',   text:'来份火锅（5两）', reply:'（端来一锅滚烫火红的火锅）小心烫！先下毛肚，三秒钟，蘸料一拌，绝了！', relDelta:3, action:'buy_food' },
      { id:'t_cq_hp_drink', text:'来壶山城米酒（3两）', reply:'（斟上一碗清澈米酒）山城米酒，配火锅，天下第一！', relDelta:2, action:'buy_drink' },
      { id:'t_cq_hp_gossip',text:'聊聊码头趣事', reply:'前天有个北方来的大汉，说不怕辣，点了双倍辣锅，一口下去眼泪都出来了哈哈哈！这里好汉多，最怕的就是川辣！', relDelta:4 },
    ],
    shop:{
      items:[
        { id:'item_hotpot',     name:'重庆火锅',   desc:'饱食度+45，气血+15，辣到精神振奋', icon:'🫕', price:5,  effect:{food:45, hp:15} },
        { id:'item_mountain_wine',name:'山城米酒',  desc:'精力+30，暖胃驱寒',                 icon:'🍶', price:3,  effect:{energy:30} },
        { id:'item_dried_chili',  name:'风干辣椒',  desc:'佐料，烹饪食物时使用',              icon:'🌶', price:2,  effect:{spice:true} },
      ]
    },
    quests:['quest_drunk_brawl','quest_teahouse_gossip','quest_daily_food_delivery','quest_foodie_contest_intro','quest_gossip_noodle_rivalry'],
    intels: [],
  },

  // 重庆·川江老船工
  chongqing_boatman: {
    id:'chongqing_boatman', name:'吴纤夫', role:'川江老船工', category:'special', avatar:'⛵',
    city:'chongqing', level:48, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:60,
    greetings:{
      hostile: '（脸色一沉）川江上也有川江的规矩。客官看着不像善茬，俺这船不载。',
      guarded: '客官要走水路？先付定金。川江险得很，翻了船俺可不赔命。',
      neutral:  '客官要走水路？川江险，但比走山道快十倍！俺拉纤走了三十年，川江没有俺不认识的滩头！',
      friendly: '老客了！这次走哪条线？三峡段最近水位不错，俺给你走条近路，能省半天。',
      close:    '（拉到一旁）兄弟，俺跟你说个事——上次那个暗礁的位置又变了，只有俺知道新的安全水道。下次你走三峡，一定叫俺撑船。',
    },
    topics:[
      { id:'t_cq_boat_hire',  text:'雇船走水路（20两）', reply:'（打量一下）好嘞，往哪儿走？三峡段浪急，俺多收点，但保管快！（顺流可快速抵达目的地）', relDelta:4, action:'river_travel' },
      { id:'t_cq_boat_story', text:'聊聊川江险情',       reply:'川江最险的是瞿塘峡，水流凶悍，礁石如刀。俺见过不少船在那翻了，船工和客人全没了……所以俺每次过峡前都要烧香拜江神，不是迷信，是敬畏！', relDelta:4 },
      { id:'t_cq_boat_intel', text:'打听水路情报',       reply:'最近荆州方向来了几艘快船，船上的人神秘兮兮。有同行说那是什么帮会的人，押着重要货物上来的。你若有用，就告诉你了。', relDelta:3, intelId:'intel_trade_route' },
    ],
    shop:{
      items:[
        { id:'item_water_food', name:'船家咸鱼', desc:'饱食度+35，口渴度-10', icon:'🐟', price:3, effect:{food:35} },
        { id:'item_boat_rope',  name:'麻绳一束', desc:'工具，行船必备',        icon:'🪢', price:3, effect:{tool:true} },
      ]
    },
    quests:['quest_river_pirate','quest_ferryman_find_cargo','quest_daily_ferry_errand'],
    intels: ['intel_trade_route'],
  },

  // 重庆·渡口茶娘
  chongqing_teawoman: {
    id:'chongqing_teawoman', name:'巴蜀花', role:'渡口茶摊老板娘', category:'tavern', avatar:'🍵',
    city:'chongqing', level:38, tier:'func',
    weapon:'wep_short_knife', armor:'cs_cloth',
    silver:55,
    greetings:{
      hostile: '（端茶的手一顿）茶摊不招待面生歹人，客官请便。',
      guarded: '坐吧。茶钱先付，老鹰茶一文，姜茶两文，不还价。',
      neutral:  '客官，坐坐坐！来碗老鹰茶，解解峡江的风尘！上船前喝碗姜茶，抗晕船抗风寒，管用得很！',
      friendly: '来了呀！今天的茶是新炒的峡江毛尖，巴蜀花给你留着最好的那一壶呢，别人俺都不给泡。',
      close:    '（神秘地凑近）你上次问的那个蒙面人的事，俺又打听到了一些——喝完这杯跟你说，这事不好让旁人听到。',
    },
    topics:[
      { id:'t_cq_tw_buy', text:'来碗茶', reply:'老鹰茶、功夫茶、姜茶……随你选！俺这茶都是峡江山上采的，不比什么大茶庄差。', relDelta:3, action:'open_shop' },
      { id:'t_cq_tw_gossip', text:'聊聊渡口见闻', reply:'上个月有一伙蒙面人从这里过，押着几口大箱子，也不知道里头装的什么。李扳爷那边好像也派人盯着……', relDelta:6, intelId:'intel_road_bandit' },
      { id:'t_cq_tw_task', text:'有需要帮忙的么', reply:'我家孩子在码头上丢了一只猫，你要是路过东边市集，帮我留意留意，猫是花色的……', relDelta:7 },
    ],
    shop:{ items:[
      { id:'item_eagle_tea', icon:'🍵', name:'老鹰茶', desc:'解渴+30，清热解乏', price:5, effect:{ water:30 } },
      { id:'item_ginger_tea', icon:'☕', name:'姜茶', desc:'精力+20，抗风寒', price:8, effect:{ energy:20 } },
      { id:'item_chuan_cakes', icon:'🥮', name:'川味糕点', desc:'饱食度+28', price:10, effect:{ food:28 } },
    ]},
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_gossip_weird_duel','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  雁门关 NPCs  (major · 天下九塞之首 · 北境边关)
  // ══════════════════════════════════════════════════════════

  // 雁门关·边关驿站老卒
  yanmen_inn: {
    id:'yanmen_inn', name:'宋老卒', role:'边关驿站老卒', category:'inn', avatar:'🪖',
    city:'yanmen', level:36, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_general',
    silver:60,
    greetings:{
      hostile: '（老赵头按住腰刀）关外的事俺管不了，但驿站里闹事，俺翻脸不认人。',
      guarded: '驿站简陋，但规矩有。先交银子再说别的。',
      neutral:  '关外大漠，风刀霜剑。客官若非要事，最好别往北去，命比银子重要！驿站简陋，但能遮风挡雪。',
      friendly: '回来了？外头冷，赶紧进来烤烤火！老赵头给你留着热汤呢。',
      close:    '（压低声音）老赵头这辈子没求过人——你要是出关，帮俺看看俺儿子当年打仗失踪的那个方向，俺一直不敢自己去。',
    },
    topics:[
      { id:'t_ym_inn_rest',  text:'在驿站休息（10两）', reply:'（铺好草席）条件简陋，莫嫌弃。这地方，能有个避风的地方就不错了！', relDelta:5, action:'inn_rest' },
      { id:'t_ym_inn_north', text:'打听关外情形',       reply:'关外最近不消停。有支草原骑兵在四处搜查什么，旗号不认识，不像寻常部落。是为了江湖上流传的什么宝物？俺一个老卒，搞不懂这些弯弯绕。', relDelta:3, intelId:'intel_tianshu' },
      { id:'t_ym_inn_story', text:'听老卒讲雁门往事',   reply:'当年此地大战无数，萧峰曾在这关上与天下英雄大战，那一天血染城头。江湖上都说他是契丹贵种，却是当世第一大英雄，老夫亲眼见过那场面……', relDelta:5 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_tianshu'],
  },

  // 雁门关·守关副将
  yanmen_commander: {
    id:'yanmen_commander', name:'岳重山', role:'雁门守关副将', category:'misc', avatar:'⚔',
    city:'yanmen', level:47, tier:'major',
    weapon:'wep_uc_spear', armor:'cs_general',
    silver:400,
    greetings:{
      hostile: '（按剑）来者止步！雁门关不是你撒野的地方，再前一步，军法处置！',
      guarded: '江湖人过关，拿出证明。无故擅闯雁门关，按军规处置！先报上来路。',
      neutral:  '守关就是守江山！岳某在此，草原铁骑休想轻易南下。你是哪路英雄？雁门这地方，来得起的，都是有真本事的！',
      friendly: '（抱拳）又来了！上次你过关帮岳某截了几个细作，这份人情岳某记着。有什么需要尽管开口。',
      close:    '（拉到偏帐）有桩密事——北边草原上最近有异动，岳某信得过你，想请你走一趟暗中查探。',
    },
    topics:[
      { id:'t_ym_cmd_pass',  text:'申请通行北上', reply:'北上草原，你要做好准备——那边没有中原的规矩，弱肉强食。本将记下你的名字，若三月未归，本将会派人去草原查找。', relDelta:5, action:'pass_gate' },
      { id:'t_ym_cmd_intel', text:'打听关外敌情', reply:'草原上最近有一股神秘势力在活动，收罗武林高手，目的不明。据探子报，他们也在寻找一部古武学残卷……若你在外遇到，可回来通报本将。', relDelta:4, intelId:'intel_tianshu' },
      { id:'t_ym_cmd_train', text:'讨教边关枪法', reply:'雁门枪法讲究三字——快、猛、准。快如疾风，猛如雷霆，准如雕弓。守关守的是一口气，气不散则战不败！', relDelta:5 },
    ],
    shop: null,
    quests:['quest_guard_spy_hunt','quest_guard_bandit_clear','quest_guard_patrol_border','quest_daily_guard_patrol'],
    intels: ['intel_tianshu'],
  },

  // 雁门关·关口杂货铺老板
  yanmen_shop: {
    id:'yanmen_shop', name:'李铁锤', role:'关口杂货铺老板', category:'shop', avatar:'🛒',
    city:'yanmen', level:31, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:100,
    greetings:{
      hostile: '（铁锤往柜台上一拍）不买东西就别挡着铺子！',
      guarded: '关口铺子不还价。要买就买，不买走人。',
      neutral:  '关口唯一的杂货铺，啥都有！往北去买不到这些，客官多备点！干粮、皮袄、绳索、药草，北上必备。',
      friendly: '来啦！上次你走了一趟关外回来，看来是活下来了——回来补货？老价格给你打九折！',
      close:    '（从后院搬出一箱东西）这批是俺私藏的顶级火折子和精制绳索，外头买不到的，先给你挑。',
    },
    topics:[
      { id:'t_ym_shop_buy',  text:'买些补给', reply:'北地苦寒，多备些食物和水，棉衣也要厚实的，关外温度比关内低十度！', relDelta:0, action:'open_shop' },
      { id:'t_ym_shop_info', text:'打听关外路线', reply:'出关往北，第一天是草原边缘，有些小部落，还算友好。再往北就是真正的大漠了，方向感很重要，别迷路。靠北极星走，错不了。', relDelta:3, intelId:'intel_road_bandit' },
    ],
    shop:{
      items:[
        { id:'item_north_ration',   name:'北地干粮',  desc:'饱食度+50，适合长途跋涉', icon:'🎒', price:5,  effect:{food:50} },
        { id:'item_fur_coat',       name:'皮毛大衣',  desc:'防寒护具，减少寒地伤害',   icon:'🧥', price:30, effect:{equip:'cs_fur'} },
        { id:'item_water_skin',     name:'牛皮水袋',  desc:'口渴度+60，可携带',         icon:'💧', price:8,  effect:{water:60} },
        { id:'item_herb_blood',     name:'活血草',    desc:'活血化瘀，回复气血30',      icon:'🌿', price:8,  effect:{hp:30} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  大同 NPCs  (major · 北方军镇 · 塞外风沙)
  // ══════════════════════════════════════════════════════════

  // 大同·塞外驿站掌柜
  datong_inn: {
    id:'datong_inn', name:'呼延忠', role:'塞外驿站掌柜', category:'misc', avatar:'🧔',
    city:'datong', level:37, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:80,
    greetings:{
      hostile: '（呼延忠冷冷看你）塞外驿站不收来历不明的人，客官请便。',
      guarded: '北风刮得紧，进来先付银子再说。大同这地方不比中原。',
      neutral:  '客官是南下中原还是北去草原？大同是分水岭，再往北便是塞外了！先进来暖暖，喝碗羊汤！',
      friendly: '（一把拉你进来）又来啦！上炕坐！呼延忠给你温着羊汤呢，外面冻得够呛吧？',
      close:    '（关上门，低声）有批草原的人在城里暗中盯梢，你出入小心。有啥信要递，呼延忠帮你。',
    },
    topics:[
      { id:'t_dt_inn_rest',  text:'住店一晚（10两）', reply:'北方大炕，烧得热乎，保管客官睡得香甜！', relDelta:5, action:'inn_rest' },
      { id:'t_dt_inn_north', text:'打听草原方向消息', reply:'最近有批草原部落的人进城，不像普通牧民，个个腰悬弯刀，眼神凶悍。听说是在给什么大人物办事……', relDelta:3, intelId:'intel_trade_route' },
      { id:'t_dt_inn_food',  text:'有没有特色吃食？', reply:'大同火锅最拿手！羊肉、野兔、蔬菜一锅炖，北方武人最爱，吃完浑身有劲！', relDelta:2 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_trade_route'],
  },

  // 大同·北军武器铺
  datong_smith: {
    id:'datong_smith', name:'朱铁锤', role:'北军武器铺老板', category:'misc', avatar:'⚔',
    city:'datong', level:39, tier:'func',
    weapon:'wep_wolf_fang', armor:'cs_general',
    silver:200,
    greetings:{
      hostile: '（锤子一顿）买不买？不买别乱摸，俺的兵器都是精品！',
      guarded: '俺这铺子卖的是塞外实战兵器，不是南方那些花架子。先说清楚你要什么。',
      neutral:  '北方的兵器和南方不一样，厚重粗犷，专为塞外恶战设计！军中退役的都来俺这换趁手的。',
      friendly: '来啦！上次给你修的那把刀又裂了？没事，这回俺给你加固一下——免费，老熟人了。',
      close:    '（从暗格里取出一柄弯刀）这把是俺从草原缴获的精品，百炼花纹钢，市面上根本没有——给你留着了。',
    },
    topics:[
      { id:'t_dt_smith_repair', text:'修缮兵器（12两）', reply:'（检查武器）这刃口受了大力，打磨一下，给你修好！', relDelta:3, action:'repair_weapon' },
      { id:'t_dt_smith_story',  text:'聊聊北方武风', reply:'北方人打架不讲究招式，就是力大招沉，正面硬打。南方花拳绣腿到了北方，遇上真正的塞外壮汉，往往吃大亏！', relDelta:3 },
    ],
    shop:{
      items:[
        { id:'item_dt_axe',      name:'塞外战斧',  desc:'北方特产重型武器，攻击力强',   icon:'🪓', price:100, effect:{equip:'wep_war_hammer'} },
        { id:'item_dt_saber',    name:'弯刀',       desc:'草原制式弯刀，挥砍速度快',      icon:'⚔',  price:80,  effect:{equip:'wep_broadsword'} },
        { id:'item_whetstone',   name:'磨刀石',     desc:'修缮武器',                       icon:'🪨', price:12,  effect:{repair:true} },
        { id:'item_horn_bow',    name:'角弓',        desc:'北方弓箭，远程攻击利器',        icon:'🏹', price:65,  effect:{equip:'wep_bow'} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels: ['intel_road_bandit'],
  },

  // 大同·塞外烤肉酒馆
  datong_tavern: {
    id:'datong_tavern', name:'狼吟风', role:'烤肉酒馆老板', category:'tavern', avatar:'🍖',
    city:'datong', level:32, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:50,
    greetings:{
      hostile: '（抄起烤叉）狼吟风不招待找茬的人！吃就坐下，不吃滚！',
      guarded: '坐吧，先付钱。草原风味不是谁都能消受的，怕辣怕膻的别点。',
      neutral:  '来来来！大同烤全羊！草原上的羊比南方的肉香十倍！奶酒、马奶、羊肉，大漠孤烟喝酒吃肉，才是真汉子的活法！',
      friendly: '来了！今天刚到了一批新鲜羊腿，狼吟风给你挑最好的一块，烤得焦香流油！',
      close:    '（端上私藏的马奶酒）这壶是草原王公进贡的，市面喝不到。咱俩的关系，值得开这壶。',
    },
    topics:[
      { id:'t_dt_tav_meat', text:'来份烤羊肉（4两）', reply:'（切来一大块烤得焦香的羊肉）趁热吃，凉了腥！', relDelta:3, action:'buy_food' },
      { id:'t_dt_tav_drink', text:'来碗奶酒（3两）',  reply:'（递来一碗白色奶酒）草原奶酒，浓烈甘甜，喝了暖心！', relDelta:3, action:'buy_drink' },
      { id:'t_dt_tav_rumor', text:'打听塞外消息',     reply:'最近草原那边有个新兴部族，首领武艺高强，听说是学过中原武功的，开始往南扩展地盘，雁门关那边已经紧张起来了……', relDelta:2, intelId:'intel_sect_secret' },
    ],
    shop:{
      items:[
        { id:'item_roast_lamb',  name:'烤羊肉',   desc:'饱食度+45，力量感提升', icon:'🍖', price:4, effect:{food:45} },
        { id:'item_milk_wine',   name:'草原奶酒', desc:'精力+35，心情大好',      icon:'🥛', price:3, effect:{energy:35} },
        { id:'item_highland_bun',name:'大饼',     desc:'饱食度+30，便于携带',    icon:'🥙', price:1, effect:{food:30} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels: ['intel_sect_secret'],
  },

  // 大同·退役守边老将
  datong_veteran: {
    id:'datong_veteran', name:'燕无忌', role:'退役守边老将', category:'misc', avatar:'🎖',
    city:'datong', level:52, tier:'major',
    weapon:'wep_uc_spear', armor:'cs_general',
    silver:300,
    greetings:{
      hostile: '（眼神如鹰）你身上有血腥气，老夫不喜欢。离开。',
      guarded: '退下来了，但老夫的眼力还在。你是哪路人？先报门来。',
      neutral:  '老夫守雁门二十年，草原铁骑的手段俺见得多了。年轻人打仗靠热血，老夫靠经验和冷静——有眼光的可来请教。',
      friendly: '（递过一杯烈酒）来，坐。你这后生有股子军人的劲头，老夫喜欢。有什么不懂的尽管问。',
      close:    '（难得露出笑容）老夫这些年没收到过像样的徒弟——你若愿意，老夫教你"雁门十八枪"，不传外人的东西。',
    },
    topics:[
      { id:'t_dt_vet_train',  text:'请教边关武艺', reply:'边关武艺讲究实用，不追求花哨。一枪一矛，力沉势猛，攻其必救，守其必攻。老夫教你一招"回马枪"，敌人追来时反手一击，屡试不爽！', relDelta:5 },
      { id:'t_dt_vet_intel',  text:'打听草原敌情', reply:'老夫退役前得到消息，草原上有人在收集武林秘籍，专门寻访落难的武林人。目的不明，但绝非善意。你若遇到此类人，多留个心眼！', relDelta:4, intelId:'intel_tianshu' },
      { id:'t_dt_vet_story',  text:'听将军讲边关往事', reply:'最难忘的一仗，是二十年前雁门关外。敌军三万，我军三千，守了七天七夜。第三天弓箭用尽，老夫带着兄弟们拿着长矛肉搏……那年月的人，每一个都是英雄。', relDelta:6 },
    ],
    shop: null,
    quests:['quest_veteran_war_relic','quest_veteran_teach_move','quest_daily_veteran_escort','quest_gossip_weird_duel'],
    intels: ['intel_tianshu'],
  },

  // ══════════════════════════════════════════════════════════
  //  兰州 NPCs  (major · 黄河要冲 · 丝路西端)
  // ══════════════════════════════════════════════════════════

  // 兰州·河边渡口客栈掌柜
  lanzhou_inn: {
    id:'lanzhou_inn', name:'马朝晖', role:'渡口客栈掌柜', category:'inn', avatar:'🧔',
    city:'lanzhou', level:33, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:75,
    greetings:{
      hostile: '（挡住门口）黄河渡口不收不三不四的人，客官请走。',
      guarded: '住店先付钱。兰州这地方鱼龙混杂，马朝晖不赊不欠。',
      neutral:  '客官是西行出关还是东归中原？兰州是丝路起点，往西漫漫长路！黄河风沙大，住俺这里背风暖和。',
      friendly: '来了！上回给你留的临河房还在，晚上听黄河水声，比什么催眠曲都好使。',
      close:    '（低声）前天那批西域怪人又来了，在你隔壁住的。马朝晖替你盯着——你要是走丝路，小心。',
    },
    topics:[
      { id:'t_lz_inn_rest',  text:'住店一晚（10两）', reply:'黄河水声可当催眠曲，保证客官睡个好觉！', relDelta:5, action:'inn_rest' },
      { id:'t_lz_inn_west',  text:'打听西行路况', reply:'出了兰州往西是河西走廊，风沙大，补给难找。建议备足干粮和水，最好找个熟路的向导。西夏秘宗在那边势力不小，要小心。', relDelta:3, intelId:'intel_trade_route' },
      { id:'t_lz_inn_rumor', text:'听听最近消息', reply:'昨天有批西域商人进城，驼队里藏着几个怪人，不像商贾，倒像江湖人。据说在找什么古图，问了好几家旅舍……', relDelta:2, intelId:'intel_tianshu' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_trade_route','intel_tianshu'],
  },

  // 兰州·丝路杂货商
  lanzhou_merchant: {
    id:'lanzhou_merchant', name:'安大富', role:'丝路杂货商', category:'shop', avatar:'🐪',
    city:'lanzhou', level:57, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:400,
    greetings:{
      hostile: '（冷笑）安大富的铺子不招待空手问价的人，有银子再说。',
      guarded: '东西方的好货都有，但安某的规矩是先看银子再谈价。客官有诚意吗？',
      neutral:  '东西方的货都有！葡萄、香料、宝石、西域马——安某在丝路上跑了二十年，你说名字俺都能给你找来！',
      friendly: '（热情招呼）来了！上次你要的昆仑玉料俺搞到了一块上等的，别人俺都没告诉，先给你看！',
      close:    '（关上铺门）安某有桩生意想跟你合伙——丝路西段有批货利润极大，但路上凶险。你若肯走一趟，安某三成利让给你。',
    },
    topics:[
      { id:'t_lz_merch_buy',   text:'看看货物', reply:'这批刚从西域运来的——葡萄干、昆仑玉料、波斯香料，还有几件稀罕的西域兵器！', relDelta:0, action:'open_shop' },
      { id:'t_lz_merch_route', text:'打听丝路商道', reply:'眼下最稳的路线是走河西走廊，但要过鬼门关——玉门关那段。若遇到打着西夏旗号的人，给点买路钱就能过，硬来反而麻烦。', relDelta:3, intelId:'intel_trade_route' },
      { id:'t_lz_merch_horse', text:'问问马匹行情', reply:'西域良马这季价格涨了，但若是你要买坐骑，俺认识个马贩子，价格比市面上便宜三成，回头引荐给你！', relDelta:4 },
    ],
    shop:{
      items:[
        { id:'item_grape_dried',  name:'葡萄干',   desc:'口渴度+20，饱食度+15，西域风味', icon:'🍇', price:6,  effect:{water:20, food:15} },
        { id:'item_spice_pack',   name:'波斯香料包',desc:'精力+20，提振精神',              icon:'🌶', price:12, effect:{energy:20} },
        { id:'item_kunlun_jade', name:'昆仑玉料', desc:'珍贵材料，可高价出售', icon:'💚', price:50, effect:{material:true} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels: ['intel_trade_route'],
  },

  // 兰州·黄河渡船老把式
  lanzhou_ferryman: {
    id:'lanzhou_ferryman', name:'黄三爷', role:'黄河老渡夫', category:'misc', avatar:'⛵',
    city:'lanzhou', level:38, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:60,
    greetings:{
      hostile: '（橹一横）黄河上也有规矩，老黄不载形迹可疑的人。',
      guarded: '上船先交渡钱。黄河水急，出了事老黄不负责。',
      neutral:  '上船咧！黄河水大浪急，俺老黄摆渡三十年，没翻过一次船！江湖人过河，渡船比马快。',
      friendly: '老熟人！今天水流不错，不用排队，老黄直接撑你过去。渡钱？免了免了！',
      close:    '（从船底摸出一壶酒）这壶是三十年前一位渡客留下的陈酿，老黄一直舍不得喝——今天跟你分了。',
    },
    topics:[
      { id:'t_lz_ferry_cross',  text:'过河（5两）', reply:'（撑篙入水）坐稳了！黄河浪大，扶好船帮！（片刻后平安抵达对岸）', relDelta:4, action:'cross_river' },
      { id:'t_lz_ferry_story',  text:'听老把式讲黄河故事', reply:'三十年前俺摆渡，曾送过一位白发剑客过河。他一言不发，到了对岸留下十两银子，只说了一句：江湖路远，保重。从此再没见过那人，不知那侠客后来如何了……', relDelta:5 },
      { id:'t_lz_ferry_info',   text:'打听西行路上情报', reply:'河西走廊的风沙现在大，有几处商队被劫，是一伙蒙面骑马的，专挑落单的盯。你要西行，最好结伴同行。', relDelta:3, intelId:'intel_road_bandit' },
    ],
    shop:{
      items:[
        { id:'item_river_fish',  name:'黄河鲤鱼', desc:'饱食度+40，回复气血20', icon:'🐟', price:4, effect:{food:40, hp:20} },
        { id:'item_hemp_rope',   name:'麻绳一束', desc:'工具，遇险时可用',       icon:'🪢', price:3, effect:{tool:true} },
      ]
    },
    quests:['quest_river_pirate','quest_ferryman_river_patrol','quest_daily_ferry_errand'],
    intels: ['intel_road_bandit'],
  },

  // 兰州·西凉武馆教头
  lanzhou_martial: {
    id:'lanzhou_martial', name:'铁古麻', role:'西凉武馆教头', category:'misc', avatar:'🥋',
    city:'lanzhou', level:59, tier:'major',
    weapon:'wep_wolf_fang', armor:'cs_general',
    silver:280,
    greetings:{
      hostile: '（双拳一握，骨节噼啪）西凉武馆不收奸恶之徒，出去。',
      guarded: '打擂台？先报门派和师承。铁古麻的武馆有规矩。',
      neutral:  '老夫铁古麻，胡汉混血，西凉武学融合多家所长，独树一帜！西凉武风彪悍，有本事就上擂台！',
      friendly: '嘿！你小子比上回又硬了。铁古麻最近琢磨出一套融合拳棍的新路子，要不要练练？',
      close:    '（拍着你的背）铁古麻这辈子没服过几个人，你是其中之一。有件事一直想跟你说——昆仑派的人找过我，想招揽我去。',
    },
    topics:[
      { id:'t_lz_mart_spar',  text:'切磋比武', reply:'（点头）好，老夫见识一下中原武学的斤两！（一番较量后）不错，中原功夫根基深厚，老夫输得心服口服！', relDelta:8, action:'spar_fight' },
      { id:'t_lz_mart_teach', text:'请教西凉功夫', reply:'西凉武学讲究刚猛直接，无花架子。核心是"以力破巧"——力量足够大，任何技巧都是纸糊的！但前提是内力要练扎实。', relDelta:4 },
      { id:'t_lz_mart_intel', text:'打听西北武林消息', reply:'昆仑派最近有动静，听说有分支下山，在丝路沿线活动频繁。另外西夏那边也不消停，有人在找什么失传秘籍……', relDelta:3, intelId:'intel_tianshu' },
    ],
    shop: null,
    quests:['quest_dojo_challenge','quest_swordsman_duel_honor','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_tianshu'],
  },

  // ══════════════════════════════════════════════════════════
  //  潼关 NPCs  (major · 天下第一险关)
  // ══════════════════════════════════════════════════════════

  // 潼关·关城旅舍掌柜
  tongguan_inn: {
    id:'tongguan_inn', name:'张守义', role:'关城旅舍掌柜', category:'misc', avatar:'🧔',
    city:'tongguan', level:50, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:70,
    greetings:{
      hostile: '（张守义挡在门口）客官另请吧，俺这旅舍不留可疑之人。',
      guarded: '潼关查得紧，客官有通行文书吗？没有的话先想想办法。',
      neutral:  '客官是东来还是西去？潼关是必经之地，住一晚歇歇脚再赶路不迟。一夫当关万夫莫开，住在潼关，心里踏实！',
      friendly: '来了！上回你走的时候让俺帮你办的事，张守义办妥了——通行文书给你备了一份新的。',
      close:    '（把你让进后屋）有个消息只能跟你一人说——守关的赵把总最近在查一批黑衣人，你最近出入小心些。',
    },
    topics:[
      { id:'t_tg_inn_rest',  text:'住店一晚（10两）', reply:'好咧，上房烧了炭盆，暖着呢！', relDelta:5, action:'inn_rest' },
      { id:'t_tg_inn_pass',  text:'打听通关消息', reply:'最近上头有令，可疑人等一律盘查。但若是手持江湖信物或门派令牌，守关的老赵会开绿灯，他也是道上的人。', relDelta:3, intelId:'intel_road_bandit' },
      { id:'t_tg_inn_east',  text:'往东洛阳多远？', reply:'快马一日可到洛阳，步行约需三日。不过这段路官道平坦，比翻秦岭要好走得多。', relDelta:2 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_road_bandit'],
  },

  // 潼关·守关把总
  tongguan_guard: {
    id:'tongguan_guard', name:'赵铁壁', role:'守关把总', category:'misc', avatar:'🛡',
    city:'tongguan', level:56, tier:'major',
    weapon:'wep_uc_spear', armor:'cs_general',
    silver:200,
    greetings:{
      hostile: '（长枪一横）站住！赵某眼皮底下休想蒙混过关。来人，扣下！',
      guarded: '停！报上名来，说明来意。江湖人过关，拿出门派信物，不然留下配合盘查！',
      neutral:  '老夫守关二十年，眼皮子底下没飞过一只苍蝇。你是哪路英雄？报上名来。',
      friendly: '（点头放行）是你啊，过去吧。赵某替你看着点——最近不太平。',
      close:    '（拉到一旁）老夫在这关上二十年，你是唯一一个让赵某放心的人。有桩朝廷密令的事，想请你帮忙——当然，不勉强。',
    },
    topics:[
      { id:'t_tg_guard_pass', text:'出示身份请求通行', reply:'嗯……看你是个正经江湖人，行吧。但下次带上腰牌，别让老夫为难！', relDelta:5, action:'pass_gate' },
      { id:'t_tg_guard_rumor',text:'打听关外消息', reply:'上次有支奇怪的队伍从西边来，全员黑衣，报的是商队，但兵器味道掩不住。老夫放他们进来，第二天洛阳就出事了，这事至今是老夫心头刺！', relDelta:3, intelId:'intel_sect_secret' },
      { id:'t_tg_guard_train',text:'讨教枪棍防守之法', reply:'防守？一个字——稳！稳如山岳，立于不败；再一个字——准！出手精准，一击必中。枪棍之道，不在花架子，在于实用！', relDelta:4 },
    ],
    shop: null,
    quests:['quest_guard_spy_hunt','quest_guard_bandit_clear','quest_guard_patrol_border','quest_daily_guard_patrol'],
    intels: ['intel_sect_secret'],
  },

  // 潼关·刀剑铺伙计
  tongguan_smith: {
    id:'tongguan_smith', name:'薛长刀', role:'刀剑铺伙计', category:'misc', avatar:'⚔',
    city:'tongguan', level:35, tier:'func',
    weapon:'wep_wolf_fang', armor:'cs_cloth',
    silver:150,
    greetings:{
      hostile: '（薛长刀手按刀柄）不买东西别乱碰，这些兵器都是精品！',
      guarded: '过关的好汉都来俺这换趁手的，但要先付钱。薛长刀不白干活。',
      neutral:  '兵器要好使就得经常保养！客官要打磨刀刃吗？关内关外武风盛，俺这铺子从不缺生意！',
      friendly: '来了！你那把刀俺上次就看出钢口不错，今天给你免费淬一道火——薛长刀的手艺你信得过。',
      close:    '（从暗柜取出一柄精钢长刀）这把刀俺磨了半年，是想留给真正配得上它的人。你拿去用吧。',
    },
    topics:[
      { id:'t_tg_smith_repair', text:'修缮兵器（12两）', reply:'（接过武器仔细检查）这口刃口卷了，一刻钟给你修好！', relDelta:3, action:'repair_weapon' },
      { id:'t_tg_smith_talk',   text:'聊聊刀剑门道', reply:'好刀不在装饰花哨，在于钢色和淬火手法。俺见过最好的一把刀，入水不沾，出鞘自鸣，那才叫神兵！', relDelta:3 },
    ],
    shop:{
      items:[
        { id:'item_tg_dagger',  name:'关卡短匕', desc:'轻便锋利，携带方便',     icon:'🗡', price:45, effect:{equip:'wep_short_sword'} },
        { id:'item_tg_saber',   name:'关内厚背刀',desc:'厚重耐用，攻防兼备',   icon:'⚔',  price:90, effect:{equip:'wep_broadsword'} },
        { id:'item_whetstone',  name:'磨刀石',    desc:'修缮武器，恢复耐久',    icon:'🪨', price:12, effect:{repair:true} },
        { id:'item_armor_oil',  name:'铠甲润滑油',desc:'维护防具，恢复防御',   icon:'🧴', price:10, effect:{repair_armor:true} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels: ['intel_road_bandit'],
  },

  // 潼关·关前茶摊老妪
  tongguan_tea: {
    id:'tongguan_tea', name:'秦婆婆', role:'关前茶摊老板', category:'tavern', avatar:'👵',
    city:'tongguan', level:41, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:30,
    greetings:{
      hostile: '（秦婆婆端茶的手一顿）老婆子不招待面生凶恶之人，走吧。',
      guarded: '坐吧。茶一文钱一碗，不还价。客官赶路辛苦，喝碗热茶再上路。',
      neutral:  '过路的侠客，歇个脚，喝碗茶！老婆子在这摆摊四十年，见过多少英雄豪杰从这走过。茶水虽淡，情义重。',
      friendly: '（笑眯眯端茶）又来了！今天茶比往常好——后山采的新茶，老婆子亲手炒的，别人可喝不到。',
      close:    '（颤巍巍拉住你的手）老婆子有件旧物想交给你——是俺当家的当年留下的腰牌，你拿着，过关的时候比什么文书都管用。',
    },
    topics:[
      { id:'t_tg_tea_drink', text:'来碗热茶（1两）',   reply:'（递来一碗清香热茶）慢慢喝，不用急，关前的路走得急容易跌跤！', relDelta:3, action:'buy_drink' },
      { id:'t_tg_tea_food',  text:'要个烙饼（1两）',   reply:'（递来两张烙饼）刚烙的，加了芝麻，香！顶饿！', relDelta:2, action:'buy_food' },
      { id:'t_tg_tea_story', text:'老人家在这儿多久了？', reply:'四十年喽。老婆子年轻时丈夫是守关兵，后来他没了，俺就在这摆摊，守着这关城，当做陪着他。', relDelta:6 },
    ],
    shop:{
      items:[
        { id:'item_green_tea', name:'关前清茶', desc:'口渴度+40，清爽提神', icon:'🍵', price:1, effect:{water:40} },
        { id:'item_sesame_cake',name:'芝麻烙饼',desc:'饱食度+30，耐饿', icon:'🥙', price:1, effect:{food:30} },
        { id:'item_road_dry_food',name:'干粮包', desc:'饱食度+50，便于携带', icon:'🎒', price:3, effect:{food:50} },
      ]
    },
    quests:['quest_teahouse_gossip','quest_daily_food_delivery','quest_gossip_tea_scandal','quest_gossip_hidden_wealth'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  晋阳城 NPCs  (major · 山西腹地 · 煤铁之乡)
  // ══════════════════════════════════════════════════════════

  // 晋阳·并州旅舍掌柜
  jinyang_inn: {
    id:'jinyang_inn', name:'柳老伯', role:'并州旅舍掌柜', category:'misc', avatar:'🧔',
    city:'jinyang', level:41, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:80,
    greetings:{
      hostile: '（柳老伯挡在门口）客官请回，并州不欢迎闹事的人。',
      guarded: '今夜风大，客官要住店就早定房。柳老伯这里不赊账。',
      neutral:  '哟，远道来的客官！并州天气干冷，先喝碗热汤暖暖身子。晋阳这地界铁匠多镖师多，绝不会无聊。',
      friendly: '来了！你那间上房俺一直留着呢——柳老伯知道你喜欢安静，给烧了最好的炭盆。',
      close:    '（拉着坐下）有桩事想跟你商量——最近太行山上不太平，镖局出了好几档子事，你有功夫在身，能不能帮帮老伯？',
    },
    topics:[
      { id:'t_jy_inn_rest',   text:'住店一晚（10两）', reply:'好嘞，楼上暖炕铺好了，客官好生歇息！', relDelta:5, action:'inn_rest' },
      { id:'t_jy_inn_rumor',  text:'打听晋阳消息', reply:'最近有支镖队出事了，在太行山道上遭了劫，听说劫镖的是一帮蒙面人，本事不小……', relDelta:2, intelId:'intel_road_bandit' },
      { id:'t_jy_inn_forge',  text:'哪家铁铺最有名？', reply:'要说晋阳第一刀匠，非"百炼堂"关铁牛莫属。他家打出来的刀能削铁如泥，江湖上好多名刀都出自他手。', relDelta:3 },
    ],
    shop: null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_road_bandit'],
  },

  // 晋阳·百炼堂刀匠
  jinyang_smith: {
    id:'jinyang_smith', name:'关铁牛', role:'晋阳刀匠', category:'blacksmith', avatar:'🔨',
    city:'jinyang', level:51, tier:'major',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:350,
    greetings:{
      hostile: '（铁锤一顿）百炼堂不接待来找茬的，关铁牛的脾气跟他打的铁一样硬！',
      guarded: '来买兵器就挑，不买别乱摸。俺关铁牛的作品，都是精品。',
      neutral:  '来来来！晋阳百炼堂，三十年只做一件事——打天下第一的刀！煤铁之乡出神兵，砍铁不卷刃，断玉不留痕！',
      friendly: '嘿！你上次买的那把晋铁刀怎么样？关铁牛就知道你眼光好——来，刚出炉了一把新的，先给你过目。',
      close:    '（从地窖搬出一件黑布包裹的东西）这把是俺花了三年用百炼法打的"关家刀"，原本不打算卖——送你了，你配得上。',
    },
    topics:[
      { id:'t_jy_smith_repair', text:'修缮兵器（15两）', reply:'（接过刀，仔细打量）嗯，刃口有缺口，十分钟给你修好！兵器修好，战力回复！', relDelta:4, action:'repair_weapon' },
      { id:'t_jy_smith_story',  text:'聊聊晋阳名刀', reply:'当年有位大侠找俺打了把"龙泉晋铁刀"，用了足足一年，百炼方成。那刀随他走遍江湖，斩妖除魔无数，后来他失踪了，那刀也不见了……', relDelta:5 },
    ],
    shop:{
      items:[
        { id:'item_jy_knife',   name:'晋铁短刀', desc:'晋阳百炼堂出品，锋利耐用', icon:'🗡', price:60,  effect:{equip:'wep_short_sword'} },
        { id:'item_jy_broadsword', name:'晋铁朴刀', desc:'重刀型武器，攻击力强',  icon:'⚔',  price:120, effect:{equip:'wep_broadsword'} },
        { id:'item_whetstone',  name:'磨刀石',   desc:'修缮武器，恢复耐久',        icon:'🪨', price:15,  effect:{repair:true} },
        { id:'item_iron_ingot', name:'精铁锭',   desc:'上等煤铁，可用于锻造',      icon:'🔩', price:25,  effect:{material:true} },
      ]
    },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels: ['intel_kunlun_sword'],
  },

  // 晋阳·汾酒坊小二
  jinyang_tavern: {
    id:'jinyang_tavern', name:'小翠', role:'汾酒坊伙计', category:'misc', avatar:'🍶',
    city:'jinyang', level:38, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:40,
    greetings:{
      hostile: '（小翠叉着腰）不喝酒不吃饭就别占座，汾酒坊坐满了！',
      guarded: '坐吧，先点菜。汾酒坊规矩——先付钱后上酒，不赊不欠。',
      neutral:  '客官，来一壶汾酒？晋阳汾酒天下第一！猪头肉配汾酒，香着哩！江湖好汉最爱来咱们这儿。',
      friendly: '来啦！小翠给你留着靠窗的位子呢，今天猪头肉卤得特别入味——先给你切一盘！',
      close:    '（端来一小壶，压低声音）这是掌柜私藏的十年陈酿汾酒，外头买不到。小翠偷偷给你倒的，别让掌柜看见！',
    },
    topics:[
      { id:'t_jy_tav_drink', text:'来壶汾酒（5两）',  reply:'（倒上一壶清澈汾酒）慢用，客官，酒香可别让旁边那几位闻见，不然得抢！', relDelta:3, action:'buy_drink' },
      { id:'t_jy_tav_food',  text:'要份猪头肉（3两）', reply:'（端来一盘卤猪头肉）香不香？正宗晋阳做法，皮Q肉烂，入味！', relDelta:2, action:'buy_food' },
      { id:'t_jy_tav_news',  text:'听听江湖消息', reply:'哎，最近城里来了几个神秘人，据说是从草原那边来的，腰悬弯刀，眼神凶悍，不知在打听什么……', relDelta:2, intelId:'intel_trade_route' },
    ],
    shop:{
      items:[
        { id:'item_fen_wine',   name:'晋阳汾酒', desc:'精力+30，心情大好', icon:'🍶', price:5, effect:{energy:30} },
        { id:'item_pig_head',   name:'卤猪头肉', desc:'饱食度+35，回复气血15', icon:'🥩', price:3, effect:{food:35, hp:15} },
        { id:'item_millet_bun', name:'高粱馒头', desc:'饱食度+25', icon:'🥖', price:1, effect:{food:25} },
      ]
    },
    quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer'],
    intels: ['intel_trade_route'],
  },

  // 晋阳·太行镖局总镖头
  jinyang_escort: {
    id:'jinyang_escort', name:'杨破虏', role:'太行镖局总镖头', category:'escort', avatar:'🐯',
    city:'jinyang', level:65, tier:'major',
    weapon:'wep_uc_spear', armor:'cs_general',
    silver:500,
    greetings:{
      hostile: '（按枪立目）太行镖局不与不义之人打交道。请回。',
      guarded: '走镖三十年，杨破虏见过各路人。你是哪路？先说清楚。',
      neutral:  '老夫杨破虏，走镖三十年，太行山的道闭着眼都能走！江湖人最重信义——死活都要把镖送到。最近匪患严重，正招好手。',
      friendly: '（抱拳）又来了！上次护镖干得漂亮，杨某记着这份功劳。有活儿先找你。',
      close:    '（拍着你肩膀，难得认真）老夫有一桩二十年前的旧事想托你——当年有批镖被劫，兄弟折了三个，仇人至今逍遥。你若愿意帮老夫了结此事……',
    },
    topics:[
      { id:'t_jy_esc_join',  text:'打听护镖机会', reply:'现在就缺人手。太行古道一趟，来回十天，赏钱五十两，但要签生死状——路上有危险，后悔就别来。', relDelta:4, action:'quest_start' },
      { id:'t_jy_esc_rumor', text:'打听太行道路情报', reply:'太行山东麓有个叫"黑风寨"的山贼窝，近日越发猖獗，连老夫的镖队都吃了亏。若能除了那伙人，江湖上少一大祸患！', relDelta:3, intelId:'intel_road_bandit' },
      { id:'t_jy_esc_skill', text:'请教枪法', reply:'枪法讲究一个"势"字，正所谓"枪如游龙，势贯长虹"。老夫走镖多年，枪法精进都靠实战，不靠打坐！你若有兴趣，陪老夫练几招。', relDelta:5 },
    ],
    shop: null,
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_gossip_weird_duel'],
    intels: ['intel_road_bandit'],
  },

  // 晋阳·晋绣坊女掌柜
  jinyang_embroidery: {
    id:'jinyang_embroidery', name:'温绣珠', role:'晋绣坊女掌柜', category:'misc', avatar:'🧵',
    city:'jinyang', level:36, tier:'func',
    weapon:'wep_short_knife', armor:'cs_cloth',
    silver:120,
    greetings:{
      hostile: '（温绣珠捏着绣花针，眼神锐利）并州的女儿不光会绣花，还会扎人呢。不买东西请走。',
      guarded: '晋绣天下闻名，但温某的绣品不便宜。客官有预算吗？',
      neutral:  '晋绣天下闻名，俺这坊子的手艺皇宫都用过！客官要绣帕子送人？三日内做好。并州女儿不光能绣花，剪子削铁也不在话下！',
      friendly: '来了呀！温某新绣了一条腰带，用的蚕丝是今年最好的——你来得正好，别人预定的俺都推了先给你看！',
      close:    '（红了眼眶，递过一方绣帕）这条帕子是温某给将来要紧的人绣的……你若不嫌弃，就收着吧。里面还缝了一张暗图，晋阳城外的铁矿位置。',
    },
    topics:[
      { id:'t_jy_emb_buy', text:'买些绣品', reply:'绣品都是手工，价不便宜，但绝对值！', relDelta:3, action:'open_shop' },
      { id:'t_jy_emb_legend', text:'打听晋阳趣闻', reply:'晋阳城外有座铁矿，据说里头藏着前朝兵器库，去过的人都回不来……是真是假俺也不知道。', relDelta:6, intelId:'intel_kunlun_sword' },
      { id:'t_jy_emb_task', text:'有没有需要帮忙的', reply:'俺的绣绷子前几天被一个混混抢走了，那人我认得，在市集那边晃悠，你帮我要回来行么？', relDelta:8 },
    ],
    shop:{ items:[
      { id:'item_jinyang_brocade', icon:'🎀', name:'晋绣锦帕', desc:'精美晋绣，赠礼好感+12', price:45, effect:{ rel_bonus:12 } },
      { id:'item_silk_bandage', icon:'🩹', name:'丝绸护腕', desc:'细腻丝绸绑护腕，防御+3', price:38, effect:{} },
      { id:'item_embr_sachet', icon:'🌸', name:'香囊', desc:'绣花香囊，精力+20', price:22, effect:{ energy:20 } },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  徐州 NPCs  (major · 江淮要冲 · 兵家必争)
  // ══════════════════════════════════════════════════════════

  xuzhou_inn: {
    id:'xuzhou_inn', name:'项老三', role:'彭城旅舍掌柜', category:'misc', avatar:'🏮',
    city:'xuzhou', level:32, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:60,
    greetings:{
      hostile: '（项老三横在门口）彭城不欢迎来找事的人！客官请回。',
      guarded: '徐州四战之地，项老三什么人都见过。住店先付银子，不赊不欠。',
      neutral:  '彭城是古战场，英雄辈出之地！徐州四战之地，北边来的南边来的都经过这里——客官歇歇脚，听俺讲讲项羽的故事！',
      friendly: '来了！项老三今天炖了一锅彭城老鸭汤，给你留着呢！上房已经准备好了。',
      close:    '（拉着坐下，关上门）最近徐州出了桩怪事——夜里城墙上有人影出没，守城的刘将军让俺暗中留意。你走南闯北见多识广，帮老三想想这是怎么回事？',
    },
    topics:[
      { id:'t_xz_inn_rest', text:'住店一晚（10两）', reply:'好！彭城的夜风豪气，睡一晚包你精神百倍！', relDelta:5, action:'inn_rest' },
      { id:'t_xz_inn_news', text:'打听江淮最新消息', reply:'北边沧州飞刀门最近活跃，往来镖车时常被劫，听说跟某个大帮会有关，但具体什么情况俺也说不清。', relDelta:4, intelId:'intel_road_bandit' },
      { id:'t_xz_inn_history', text:'聊聊彭城古战场', reply:'这里是楚汉之争最激烈的地方，项羽大战刘邦，都是铁血男儿！俺们徐州人血脉里就有一股霸气！', relDelta:3 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_road_bandit'],
  },

  xuzhou_commander: {
    id:'xuzhou_commander', name:'刘破军', role:'徐州守备将军', category:'misc', avatar:'🗡',
    city:'xuzhou', level:64, tier:'major',
    weapon:'wep_uc_spear', armor:'cs_general',
    silver:300,
    greetings:{
      hostile: '（按剑怒目）刘破军在此！宵小之辈，再不退后，军法处置！',
      guarded: '本将军驻守徐州，你来此有何贵干？先报上来路和目的。',
      neutral:  '彭城是北方防线关键节点，本将不眠不休也要守住。听说你武功不错——江湖人中能当军中教头的屈指可数。',
      friendly: '（抱拳）来了！上次那桩军情你帮忙报的信，立了功。刘某记着你的好处！',
      close:    '（屏退左右）有桩事只能跟你说——朝廷怀疑军中有内奸，本将信不过旁人，想请你暗中帮忙查查。',
    },
    topics:[
      { id:'t_xz_cmd_duty', text:'了解徐州防务', reply:'北边黑水帮最近蠢蠢欲动，有意控制淮河水路。本将已派斥候打探，暂时在观望，若他们越界，自有刀枪伺候。', relDelta:5 },
      { id:'t_xz_cmd_recruit', text:'谈论江湖形势', reply:'江湖乱，官府也为难。本将和几位镖局当家有些交情，他们传递的情报比塘报快多了。你若有江湖消息，不妨也说来听听。', relDelta:6 },
      { id:'t_xz_cmd_fight', text:'请教枪法', reply:'（大笑）好，本将军的战阵枪法鲜少有人讨教，今日就指点你几招！', relDelta:10, action:'train_skill' },
    ],
    shop: null,
    quests:['quest_guard_spy_hunt','quest_guard_bandit_clear','quest_guard_patrol_border','quest_daily_guard_patrol'],
    intels: ['intel_mingjiao_rise'],
  },

  xuzhou_smith: {
    id:'xuzhou_smith', name:'范铁胆', role:'铁器铺掌柜', category:'blacksmith', avatar:'⚒',
    city:'xuzhou', level:50, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:120,
    greetings:{
      hostile: '（铁锤一横）范铁胆的铺子不招待找事的人！买就买，不买走！',
      guarded: '彭城铁器三代传承，不卖假冒伪劣。先付银子。',
      neutral:  '彭城铁器天下闻名！俺家铁铺三代传承，什么兵器都打过，就看你要什么！',
      friendly: '来啦！你上次买的那把匕首磨损不小，范铁胆免费给你磨一磨——老客户，不收钱。',
      close:    '（从后院搬出一口古朴的铁刀）这把是俺爷爷打的传家宝，从没卖过。你配得上它——拿去吧，算是范铁胆送你的。',
    },
    topics:[
      { id:'t_xz_smith_tip', text:'请教锻造之道', reply:'锻造的秘诀在火候——太热则脆，太冷则软，火候恰到好处，才是好刀好剑！', relDelta:4 },
    ],
    shop:{ items:[
      { id:'item_iron_pill', icon:'⚫', name:'铁胆散', desc:'提升韧性，防御临时+5', price:30, effect:{ defBuff:5 } },
      { id:'item_wolf_fang', icon:'🐺', name:'狼牙匕首', desc:'防身利器，购入后使用可+10攻击', price:80, effect:{ atkBuff:10 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels: ['intel_trade_route'],
  },

  xuzhou_hero: {
    id:'xuzhou_hero', name:'石破天', role:'游历侠客', category:'misc', avatar:'🗡',
    city:'xuzhou', level:50, tier:'major',
    weapon:'wep_wolf_fang', armor:'cs_ranger',
    silver:200,
    greetings:{
      hostile: '（石破天手按刀柄，眼神锐利）阁下身上杀气不轻，在下不与恶人为伍。',
      guarded: '在下石破天，游历至此。阁下是哪路朋友？先通个名号。',
      neutral:  '天下英雄出我辈，一入江湖岁月催！彭城是好地方，英雄气概浓——阁下是练家子？切磋切磋？',
      friendly: '（大笑）又见面了！上次切磋还没分出胜负，今天再打一场？石某最近悟了一招新式。',
      close:    '（难得认真起来）石某游历天下，知己难求。你是我见过最值得托付后背的人——有件关乎武林存亡的事，想跟你细说。',
    },
    topics:[
      { id:'t_xz_hero_spar', text:'切磋武艺', reply:'（摩拳擦掌）好久没遇到对手了！（一番较量后）痛快！你我都有进步，他日再战！', relDelta:10, action:'spar_fight' },
      { id:'t_xz_hero_travel', text:'聊聊游历见闻', reply:'在下走遍大江南北，中原武学大同小异，但西域功法真是千奇百怪！那边的高手修炼的是截然不同的路子，极难应对。', relDelta:5 },
      { id:'t_xz_hero_secret', text:'打听江湖秘闻', reply:'最近有传言说某处出现了失传武学秘籍，各门派暗中争抢，血雨腥风。你我皆是江湖人，凡事小心为上！', relDelta:4, intelId:'intel_tianshu' },
    ],
    shop: null,
    quests:['quest_test_talent','quest_swordsman_settle_grudge','quest_patrol_road','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_tianshu'],
  },

  // ══════════════════════════════════════════════════════════
  //  苏州 NPCs  (major · 江南水乡 · 丝绸之都)
  // ══════════════════════════════════════════════════════════

  suzhou_inn: {
    id:'suzhou_inn', name:'顾绣娘', role:'园林客栈老板娘', category:'inn', avatar:'🌸',
    city:'suzhou', level:47, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_scholar',
    silver:80,
    greetings:{
      hostile: '（顾绣娘放下茶杯）苏州园林不收粗鲁之人，客官请便。',
      guarded: '住店先看价位。本客栈坐拥苏州最美园林，住一晚值回票价——但不是谁都住得起。',
      neutral:  '客官，吴侬软语问个好！苏州夜色运河灯光点点，桃花岛的船有时也会靠岸。住一晚享受享受？',
      friendly: '来了呀！顾绣娘给你留了临水的雅间，推开窗就能看运河——这几天桂花开得正好。',
      close:    '（低声）绣娘有个秘密——这客栈地下有条暗道，是当年抗倭时修的。你若遇到危险，可以走那条路。',
    },
    topics:[
      { id:'t_sz_inn_rest', text:'住店一晚（10两）', reply:'好！客房配有园林小院，入夜后听运河船歌，胜过一切烦恼！', relDelta:5, action:'inn_rest' },
      { id:'t_sz_inn_silk', text:'打听苏州绸缎', reply:'苏绸天下第一！我们这里每匹绸缎都是苏州绣娘一针一线绣出来的。不过最近丝价上涨，北方战乱影响蚕桑，贵了一倍不止。', relDelta:3, intelId:'intel_trade_route' },
      { id:'t_sz_inn_boat', text:'询问前往桃花岛', reply:'桃花岛在东海，需从渡口出海。岛主性情古怪，据说近来消息全无，没人知道岛上情况。', relDelta:4 },
    ],
    shop: null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_trade_route'],
  },

  suzhou_poet: {
    id:'suzhou_poet', name:'唐如玉', role:'才女词人', category:'misc', avatar:'📜',
    city:'suzhou', level:52, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:150,
    greetings:{
      hostile: '（唐如玉合上书卷）阁下气势不善，苏州文人不爱与粗莽之人论诗。',
      guarded: '江南风物迷人，但不是谁都能领会的。阁下是哪类人？武人还是文人？',
      neutral:  '江南风物最迷人，诗词歌赋无不出于此地！苏州之美在水在桥在月色——阁下可懂诗？能文能武者凤毛麟角。',
      friendly: '（微笑展卷）来了！唐某新填了一首词，正缺人品评——你是最合适的人选。',
      close:    '（眼神温柔）这些年来，唐某把心事都写进了诗里。你是唯一读懂的人……有些话，诗里说不清，改日与你细说。',
    },
    topics:[
      { id:'t_sz_poet_chat', text:'聊聊江南风物', reply:'苏州有三绝——园林、丝绸、评弹。评弹婉转，似诉江湖往事，听一曲能让人忘却心头烦忧！', relDelta:6 },
      { id:'t_sz_poet_martial', text:'谈论武学与文学', reply:'（微笑）以为才女不通武学？在下习过剑法，剑道与诗道相通，讲究"意境"二字，一剑一诗，都要有灵魂。', relDelta:7 },
      { id:'t_sz_poet_intel', text:'打听苏州消息', reply:'最近凌霄阁的人在苏州走动频繁，似乎在搜集什么情报。凌霄阁买卖消息，有人出大价钱买某人的行踪，不知是谁。', relDelta:4, intelId:'intel_sect_secret' },
    ],
    shop: null,
    quests:['quest_song_request','quest_scholar_collect_poems','quest_scholar_protect_scroll','quest_daily_copy_errand','quest_poet_odd_client','quest_gossip_plagiarism'],
    intels: ['intel_sect_secret'],
  },

  suzhou_merchant: {
    id:'suzhou_merchant', name:'沈万通', role:'丝绸大商', category:'misc', avatar:'💰',
    city:'suzhou', level:35, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_scholar',
    silver:500,
    greetings:{
      hostile: '（沈万通冷笑）沈某的生意不跟来历不明的人做。请便。',
      guarded: '在下苏州绸缎第一商。先亮银子再谈价，沈某不做小本买卖。',
      neutral:  '在下走南闯北三十年，什么生意没做过！南来北往的货物都经过苏州，沈某最清楚行情！',
      friendly: '来了！上次你要的那批丝绸沈某给你备好了，价格比市面低两成——老客户嘛。',
      close:    '（关上账房门）沈某有桩海上贸易的生意，利润极大但风险不小。信得过你的人不多——你愿不愿意入伙？',
    },
    topics:[
      { id:'t_sz_mer_trade', text:'打听商道情报', reply:'北方边境战事使丝路受阻，西域香料价格飞涨，但江南丝绸没受影响，反而卖得更好了。如今最赚钱的是往西北运绸缎，一来一回利润翻倍！', relDelta:4, intelId:'intel_trade_route' },
      { id:'t_sz_mer_buy', text:'购置商品', reply:'尽管看！本商行货色齐全，保真价实！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_silk_cloth', icon:'🧵', name:'苏州绸缎', desc:'高级衣料，礼物佳品，好感度提升更容易', price:40, effect:{} },
      { id:'item_jade_tea', icon:'🍵', name:'碧螺春茶', desc:'苏州名茶，精力+20', price:25, effect:{ energy:20 } },
      { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','chain_merchant_e1',],
    intels: ['intel_trade_route'],
  },

  // 苏州·绣坊女掌柜
  suzhou_silk_woman: {
    id:'suzhou_silk_woman', name:'绣娘柳', role:'苏州绣坊女掌柜', category:'misc', avatar:'🧵',
    city:'suzhou', level:43, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_robe',
    silver:160,
    greetings:{
      hostile: '（银针一转，寒光乍现）绣娘柳的坊子不收歹人，请回。',
      guarded: '苏绣天下第一，但绣品不便宜。客官有预算？买就买，不买别乱摸。',
      neutral:  '苏州刺绣天下第一，皇家都来定货！绣娘柳的银针不只绣花，也防身。来苏州不买件苏绣可算白来了。',
      friendly: '来了呀！绣娘柳新绣了一方帕子，用的双面绣——你看看这手艺，世上找不到第二家。',
      close:    '（红了脸，递过一方亲手绣的荷包）这个……绣娘柳从来没给旁人绣过。你收着吧，路上小心。',
    },
    topics:[
      { id:'t_sz_silk_buy', text:'看看绣品', reply:'苏绣有大件（屏风、衣料）也有小件（荷包、香囊）。你要送人的，还是自用的？', relDelta:3, action:'open_shop' },
      { id:'t_sz_silk_gossip', text:'打听苏州动态', reply:'最近运河上有批丝绸被劫，损失不小。苏州商会正在联系镖局，但价钱谈不拢……', relDelta:5, intelId:'intel_trade_route' },
      { id:'t_sz_silk_task', text:'有没有需要帮忙的', reply:'有批客商赖账不走，还扬言要砸俺的坊子，你能帮俺去谈谈理？', relDelta:9 },
    ],
    shop:{ items:[
      { id:'item_suzhou_embr', icon:'🎀', name:'苏绣香囊', desc:'精美苏绣，赠礼好感+14', price:55, effect:{ rel_bonus:14 } },
      { id:'item_suzhou_silk', icon:'🧵', name:'苏州绫罗', desc:'高级衣料，身价提升', price:80, effect:{} },
      { id:'item_biluochun',   icon:'🍵', name:'碧螺春', desc:'苏州名茶，精力+22', price:28, effect:{ energy:22 } },
    ]},
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_gossip_weird_duel'],
    intels: ['intel_trade_route'],
  },

  // 苏州·杏林医馆
  suzhou_doctor: {
    id:'suzhou_doctor', name:'叶青莲', role:'苏州女医', category:'misc', avatar:'🌿',
    city:'suzhou', level:40, tier:'func',
    weapon:'wep_silver_needle', armor:'cs_robe',
    silver:120,
    greetings:{
      hostile: '（叶青莲皱眉）医者仁心，但不治寻衅之人。',
      guarded: '江南湿气重，内伤最易复发。阁下可是有伤在身？',
      neutral: '苏州水土虽好，江湖人总难免带伤而来。叶某擅长针灸与内伤调理，收费公道。',
      friendly: '（叶青莲含笑）你又来啦。伤势如何？上次那副药吃完了没？',
      close: '（低声）你的内伤根子还没断，我给你配副调理方子，记得按时服用。',
    },
    topics:[
      { id:'t_sz_doc_heal', text:'求诊治伤', reply:'来，先把脉。（片刻后）你的伤在经脉，用银针疏导一番，再配些药草，三五日便无大碍。', relDelta:5, action:'open_hospital' },
      { id:'t_sz_doc_herb', text:'买些药材', reply:'苏州药材新鲜，太湖边采的尤其好。需要什么？', relDelta:3, action:'open_shop' },
      { id:'t_sz_doc_gossip', text:'打听苏州动态', reply:'近来运河边有人被人下了慢性毒，看诊时发现的。是绸缎商人，具体因由不便多说……', relDelta:6, intelId:'intel_local_rumor' },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_jiuhua_pill',  icon:'💊', name:'九花丸',   desc:'活血止痛，气血+55',  price:28, effect:{ hp:55 } },
      { id:'item_jinchuang',    icon:'🩹', name:'金疮药',   desc:'止血消肿，气血+35',  price:16, effect:{ hp:35 } },
      { id:'item_lingzhi_tea',  icon:'🍵', name:'灵芝药茶', desc:'养气润脉，内力+30',  price:22, effect:{ mp:30 } },
      { id:'item_detox_pill',   icon:'🌿', name:'解毒丸',   desc:'解除常规中毒状态',   price:35, effect:{ detox:1 } },
      { id:'item_herb_blood',   icon:'🌱', name:'活血草',   desc:'活血化瘀，气血+20',  price:10, effect:{ hp:20 } },
    ]},
    quests:['quest_daily_collect_herb','quest_medicine_missing','quest_gossip_poison_case'],
    intels: ['intel_local_rumor'],
  },

  // 苏州·铁器坊
  suzhou_smith: {
    id:'suzhou_smith', name:'周铁手', role:'苏州铁匠', category:'blacksmith', avatar:'⚒',
    city:'suzhou', level:38, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_leather',
    silver:200,
    greetings:{
      hostile: '（周铁手放下铁锤）我这坊子不接闹事的买卖，请便。',
      guarded: '苏州出绸缎，但江湖人还是少不了好刀。你要买还是要修？',
      neutral: '周某打了三十年铁，苏州城内无人不知周铁手。兵器磨损了？拿来看看。',
      friendly: '（周铁手擦擦手）你来得巧，刚出炉一批新货，你先挑。',
      close: '（拍肩）老熟客了！这把刀我给你打薄刃口，更适合你的路数。',
    },
    topics:[
      { id:'t_sz_smt_buy', text:'看看兵器', reply:'刀剑弓弩俺都能打。苏州工艺细，价格比北边稍贵，但耐用。', relDelta:3, action:'open_shop' },
      { id:'t_sz_smt_repair', text:'修理兵器', reply:'磨损几成？（掂了掂）中等损耗，三十文，一炷香功夫。', relDelta:5 },
      { id:'t_sz_smt_gossip', text:'打听附近动态', reply:'运河上最近多了些生面孔，码头脚夫说是从北边来的，行事鬼祟。俺一铁匠，也说不准什么来路。', relDelta:4, intelId:'intel_local_rumor' },
    ],
    shop:{ items:[
      { id:'wep_iron_sword',    icon:'🗡', name:'铁制长剑',   desc:'标准长剑，攻击+8',   price:60,  type:'weapon', effect:{ atk:8 } },
      { id:'wep_iron_saber',    icon:'⚔', name:'铁制刀',     desc:'厚背重刃，攻击+10',  price:75,  type:'weapon', effect:{ atk:10 } },
      { id:'wep_wooden_bow',    icon:'🏹', name:'木弓',       desc:'轻便远程，攻击+6',   price:45,  type:'weapon', effect:{ atk:6 } },
      { id:'item_arrow_bundle', icon:'🪃', name:'箭矢×10',   desc:'补充弓箭消耗',        price:12,  effect:{} },
      { id:'item_iron_ingot',   icon:'🔩', name:'精铁锭',     desc:'锻造材料',            price:30,  effect:{} },
    ]},
    quests:['quest_daily_bounty_hunt','quest_smith_ore_fetch','quest_gossip_weird_duel'],
    intels: ['intel_local_rumor'],
  },

  // ══════════════════════════════════════════════════════════
  //  杭州 NPCs  (major · 西湖天下景 · 江南盛地)
  // ══════════════════════════════════════════════════════════

  hangzhou_inn: {
    id:'hangzhou_inn', name:'柳春风', role:'西湖茶馆掌柜', category:'misc', avatar:'🏮',
    city:'hangzhou', level:44, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_scholar',
    silver:70,
    greetings:{
      hostile: '（放下茶壶，冷冷地）这里是茶馆，不是打架的地方，给我出去！',
      guarded: '（淡淡扫一眼）喝茶就喝茶，别给我惹麻烦。',
      neutral:  '西湖边的茶馆，天下第一！客官里面请，边品龙井边看湖景！',
      friendly: '来了！刚泡了一壶今年的明前龙井，坐下尝尝，比什么药都养人。',
      close:    '（已经在倒茶）不用说了，老位子，老口味，你就是那个座儿。',
    },
    greetingOverrides:[
      { requiresQuestState:['quest_missing_guest:active'],  text:'那位失踪旅客……你有消息了吗？他在这儿住了五日，突然就不见了，我心里不安。' },
      { requiresQuestState:['quest_missing_guest:done'],    text:'（松了口气）人找到了？谢天谢地……你且坐，这壶茶我请了。' },
      { requiresQuestState:['chain_inn_a1:active'],         text:'天地帮的人？（压低声音）这群人在城西一带横行，你小心些，不是普通地痞。' },
      { requiresQuestState:['chain_inn_a2:active'],         text:'（神色凝重）旅客还在他们手里？你一定要救出来，那人身上带的消息……不得落到坏人手中。' },
      { requiresQuestState:['chain_inn_a3:active'],         text:'旅客脱险，真是谢天谢地。他说要亲自谢你——你什么时候方便，来茶馆见他。' },
      { requiresQuestState:['chain_inn_a3:done'],           text:'（轻声笑）那情报的事，我就当没听说过。你保重江湖，日后路过杭州，这里永远有你的座儿。' },
    ],
    giftPrefs:{
      label:'茶庄老板娘喜欢精致茶具与江南特产',
      love:['tea','silk','jade'],
      like:['food','raretrade'],
      thanksLoved:[
        '（眼睛一亮）这……哪里来的好茶？不对，这是贡品级别的！你从哪淘的？我这辈子就好这一口，收下了，多谢你！',
        '好东西！苏杭走了这么多年，我见过的茶里也就这个配坐西湖边。你懂我的心！'
      ],
      thanksLiked:[
        '（点点头）不错，难为你记着我的口味。'
      ],
      questHint:'柳春风捧着礼物，抿嘴一笑，压低声音道："你来得正好——有件事我想拜托个靠谱的人，不是普通差事。"',
      followup:{
        questText: ({ questName }) => questName ? `追问柳春风那桩「${questName}」的来龙去脉` : '追问柳春风提到的那件差事',
        questReply: ({ questName }) => questName
          ? `（四下张望后低声）那位旅客，说起来来头不小——他是凌霄阁往来信使，身上带着一份名单，名单上的人……都是江湖上见不得光的交易方。我不敢自己查，才想着托给你。「${questName}」那委托，就在那儿，你若有意，便接了。`
          : `（放低声音）那旅客失踪的事，背后不简单。我在这开馆多年，见过各色人等，这件事……不是普通的失踪。`,
        flavor:'innkeeper',
      },
    },
    topics:[
      { id:'t_hz_inn_rest', text:'喝茶歇息（5两）', reply:'龙井上！坐在西湖边看水看山，什么烦恼都忘了！', relDelta:5, action:'inn_rest' },
      { id:'t_hz_inn_lingxiao', text:'打听凌霄阁',
        replyStages:{
          guarded:  '（摇摇头）凌霄阁的事我不大清楚，你自己打听吧。',
          neutral:  '凌霄阁就在杭州城里，一栋高楼，专门买卖消息。想知道谁的行踪，付银子就有。但进去的规矩多，不是一般人能随便进！',
          friendly: '凌霄阁的人常来喝茶，说话滴水不漏，绝口不提买卖。我只知道他们的价格不便宜——越私密的消息，越贵。',
          close:    '（凑近说）上次有个人找凌霄阁买一条消息，花了三百两，买的是某个人出行路线。那人当晚就被人截了……这买卖，做的是人命。',
        },
        relDelta:4, intelId:'intel_sect_secret'
      },
      { id:'t_hz_inn_martial', text:'询问江南武林动态',
        requiresRel: 5,
        reply:'江南武林平静些，不像中原那么乱。但最近桃花岛一带传来奇怪的消息，说岛上有人受伤，不知真假……',
        repeatReplyStages:{
          neutral:  '（叹气）桃花岛那边我只是听说，细节不知道，你问司马大侠比较准。',
          friendly: '不只是桃花岛，就连明教那边也有动静——凌霄阁的眼线说，明教最近几次秘密聚会，完事后就有人死，死因不明。',
          close:    '（低声）说句实在的，江南现在看着太平，其实水下暗流很急。凌霄阁、五毒教、还有几个我叫不出名字的组织，都在这片地方插了手。我也只能知道这些了。',
        },
        relDelta:3
      },
      { id:'t_hz_inn_west_lake', text:'聊聊西湖风物',
        requiresRel: 15,
        replyStages:{
          guarded:  '西湖挺美，你自己去转吧。',
          neutral:  '西湖最美的时候是清晨——薄雾未散，湖面像一面镜子，那时候来喝茶，喝的是意境，不是茶叶。',
          friendly: '我在西湖边开馆十八年了。亲眼见过无数江湖人来了又走，有的意气风发，后来再没见着……我不问他们的事，只管把茶泡好。',
          close:    '（看着窗外）有时候想，如果当初我没留在杭州，而是跟着那个人走……不说了，往事了。你喝茶。',
        },
        relDelta:6
      },
    ],
    shop: null,
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general','chain_inn_a1'],
    intels: ['intel_sect_secret'],
  },

  hangzhou_swordsman: {
    id:'hangzhou_swordsman', name:'司马青云', role:'天目山剑客', category:'sect', avatar:'⚔',
    city:'hangzhou', level:57, tier:'major',
    weapon:'wep_silver_sword', armor:'cs_ranger',
    silver:220,
    greetings:{
      hostile: '（手按剑柄）来挑衅的，就别怪我不客气。',
      guarded: '（冷眼）来者何人，所为何事？',
      neutral:  '天目山的剑法纵横江南，到杭州走走，顺便看看有无对手！',
      friendly: '你来了！正好，我在想一招剑意，想与人切磋印证——你有空吗？',
      close:    '（已经抬手示意）不用客套了，拔剑吧，说话在剑上。',
    },
    giftPrefs:{
      label:'剑客最爱精铁良兵与江湖稀见物件',
      love:['sword','ore','thunder'],
      like:['martial','raretrade'],
      thanksLoved:[
        '（接过，眼神一变）这铁……这是寒铁矿锻出来的！拿在手里沉，但剑气流转极顺。你懂剑，这份礼我领了。',
        '好东西！天下兵器，贵在材质，材质好一成，剑招就强三成。你送我这个，是把我当自己人了。'
      ],
      thanksLiked:[
        '（点头）不错，这个有用，谢你了。'
      ],
      questHint:'司马青云把礼物放好，斜眼看你：「你有意思，送的东西懂行。倒是有件麻烦事，我一直没找到合适的人托付……」',
      followup:{
        questText: ({ questName }) => questName ? `追问司马青云那桩「${questName}」` : '追问司马青云提到的麻烦事',
        questReply: ({ questName }) => questName
          ? `（直接说）前几日有人冒我之名，在城东打伤了三个商人，声称是"天目山剑法"。我天目剑法虽不是绝顶门派，却从不伤无辜。此人是在败坏我的名声——我要找出来，但我一出面就打草惊蛇。「${questName}」那事，就是这个，你若帮我查，我记你这份情。`
          : `（微微皱眉）有人用我的名义干了些不光彩的事……我得查清楚，但自己出面不合适。`,
        flavor:'swordsman',
      },
    },
    topics:[
      { id:'t_hz_sword_spar', text:'切磋武艺',
        reply:'（抬手微礼）请！（较量后）好功夫，天目山的剑法遇到了对手，痛快！',
        repeatReplyStages:{
          neutral:  '（点头）不错，你进步了，上次那个破绽现在没了。',
          friendly: '（微笑）每次与你切磋，都有收获。你这路子……不像是门派正传，反而更有自己的东西。',
          close:    '（拭剑）说实话，在杭州真正能让我全力出手的对手，就你一个。其他的……多是来凑热闹的。',
        },
        relDelta:10, action:'spar_fight'
      },
      { id:'t_hz_sword_school', text:'聊聊江南剑法',
        replyStages:{
          guarded:  '江南剑法各有所长，但我天目一脉以轻灵为本，细节不便多说。',
          neutral:  '江南剑法讲究"轻灵飘逸"，走的是巧劲而非蛮力。和西北那些大开大合的刀法截然不同，各有所长。',
          friendly: '天目剑法的精要，在于"以小搏大"——用最小的力道，卸开对方最大的冲击。听起来容易，练起来要脱几层皮。',
          close:    '（沉默一会儿）剑法到最后，其实不是招式，是"心"。你心里有什么，剑尖就指向哪里。这话是我师父说的，当时不懂，现在懂了，但师父已经不在了。',
        },
        relDelta:6
      },
      { id:'t_hz_sword_intel', text:'打听西湖附近情况',
        requiresRel: 10,
        reply:'西湖外海有凌霄阁的眼线，消息流通极快。听说明教和日月神教最近在秘密联络，具体为何，还不清楚。',
        repeatReplyStages:{
          neutral:  '（摇头）我说的那些只是风声，具体的真不知道。',
          friendly: '再补一句——凌霄阁的人最近在打听天目山一带的地形。我怀疑他们在找什么东西，或者有人在山里藏了什么。',
          close:    '（低声）明教与日月神教联络这件事……你若想深查，建议先不要惊动凌霄阁。那些人买卖消息的同时，也在出卖消息。',
        },
        relDelta:4, intelId:'intel_mingjiao_rise'
      },
      { id:'t_hz_sword_battle_discuss', text:'讨论一招剑意',
        requiresRel: 30,
        reply:'（思索片刻）你说的这一招——我试过类似的变化。真正的关键在于步法，不在剑尖，脚往哪里走，剑意就往哪里延伸。来，我演示一遍。（演示一套剑步）你体会一下。',
        relDelta:12
      },
    ],
    shop: null,
    quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_mingjiao_rise'],
  },

  hangzhou_doctor: {
    id:'hangzhou_doctor', name:'陈回春', role:'杭州名医', category:'misc', avatar:'💊',
    city:'hangzhou', level:38, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:200,
    greetings:{
      hostile: '（皱眉）你来此不是求医，是找麻烦？我的药箱里有针，别逼我动手。',
      guarded: '（抬眼看）受伤了？说清楚症状，我来看看。',
      neutral:  '在下陈回春，悬壶济世三十年，江湖人受了伤都往这里来！',
      friendly: '来了！今日可有伤要看？或者只是路过坐坐，也好，我正好讲个病案给你听。',
      close:    '（不抬头，手里还在研药）坐，茶在旁边，我这味药再磨一刻便好。',
    },
    greetingOverrides:[
      { requiresQuestState:['quest_rare_herb:active'],   text:'那百年灵芝……大山深处，不好找，但那位病人等不了多久，你要快些。' },
      { requiresQuestState:['quest_rare_herb:done'],     text:'（接过灵芝，神色大松）来了！速速入煎，今夜便能用上。你救了那人一命，这份功德不小。' },
      { requiresQuestState:['chain_doc_b1:active'],      text:'（压低声音）那味鬼针草心，你在深山有踪迹了吗？此药解毒极妙，但生在阴谷，难找。' },
      { requiresQuestState:['chain_doc_b2:active'],      text:'五毒教的人竟然去截药？！（握拳）那是救命的药，这帮人真是……你一定要把药夺回来！' },
      { requiresQuestState:['chain_doc_b3:active'],      text:'（眼神复杂）神医的传承……这套医道心法，我藏了三十年，本以为要带进棺材。你是第一个让我愿意传出去的人。' },
      { requiresQuestState:['chain_doc_b3:done'],        text:'（轻声）患者已无大碍了。你且把那残卷收好，日后若遇中毒内伤，按上面的法子来，九成九能救人。' },
    ],
    giftPrefs:{
      label:'名医最爱稀缺药材与精品茶叶',
      love:['herb','pill','tea'],
      like:['poison','raretrade'],
      thanksLoved:[
        '（眼睛放光，颤着手接过来）这……这是哪里来的？五叶参须？配合我手边那味秘方，可以提纯出治内伤的至药！你从哪得的？',
        '好药材！这品相，不亚于我年轻时进太医院见到的贡品。你这人懂药，我认你这个朋友了。'
      ],
      thanksLiked:[
        '（点点头）这个我能用上，谢了。'
      ],
      questHint:'陈回春把药材收好，沉吟片刻，道："你若有闲，我这里有件悬案，托给外人一直不放心，你倒是合适的人选。"',
      followup:{
        questText: ({ questName }) => questName ? `追问陈回春那桩「${questName}」的详情` : '追问陈回春提到的悬案',
        questReply: ({ questName }) => questName
          ? `（放下药匙）那位病人，来路不明，伤的不是刀伤，是中了一种我从未见过的复合蛊毒。此毒无色无味，发作时似乎猝死，其实只是假死。能下这种毒的……不是一般江湖人。「${questName}」那委托我挂了出去，你若有意，便接下来，帮我查查那毒的源头。`
          : `（叹气）那患者的蛊毒，三十年行医我头一次见。背后有人在用这种东西……我担心不止一个人中过。`,
        flavor:'medic',
      },
    },
    topics:[
      { id:'t_hz_doc_heal', text:'求医问诊', reply:'让我看看伤势……这伤处理得还可以，但长期行走江湖要注意，内伤比外伤更难医！', relDelta:5, action:'heal_hp' },
      { id:'t_hz_doc_herb', text:'购买药材', reply:'龙井旁边的山里就有不少好药材！', relDelta:3, action:'open_shop' },
      { id:'t_hz_doc_theory', text:'聊聊行医心得',
        requiresRel: 10,
        replyStages:{
          guarded:  '（简短）行医就是治病救人，没什么好聊的。',
          neutral:  '行医三十年，最难治的不是刀伤，是内伤。很多人以为外伤好了就好了，其实气脉损伤藏在里面，十年后才发作，那时候就晚了。',
          friendly: '我以前在江湖上也见过不少高手，有人轻功绝顶，有人内力深厚。但见过最多的，是他们老了之后，年轻时落下的暗伤一起来找账——那才叫苦。',
          close:    '（停顿）说实话，我当年也习过武。后来……遇到一件事，就搁了。以医术渡人，比以武力伤人，让我更安心一点。',
        },
        relDelta:6
      },
      { id:'t_hz_doc_strange_case', text:'打听近来有无奇症',
        requiresRel: 20,
        reply:'（压低声音）最近来了个病人，看着好好的，脉象却乱成一锅粥。我检查了半天，发现他的经脉里有一股细微的外力……像是被人悄悄改了走向。这种手法，是五毒教的做法，但更高明，普通弟子做不到。',
        relDelta:7, intelId:'intel_cultivation_tip'
      },
      { id:'t_hz_doc_b1_tip', text:'追问鬼针草心的采法',
        requiresQuestState:['chain_doc_b1:active'],
        reply:'（交代详细）此草只生在背阳、常年潮湿的山壁下，叶背发黑、茎上有倒刺。采时戴厚布手套，别碰到倒刺——本身带轻微麻痹毒，不致命，但麻上半日很难受。',
        relDelta:4
      },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_longjing_pill', icon:'🍵', name:'龙井回气丸', desc:'以西湖龙井炼制，气血+40', price:45, effect:{ hp:40 } },
      { id:'item_lotus_remedy', icon:'🪷', name:'莲心养神散', desc:'西湖莲心提炼，内力+35', price:50, effect:{ mp:35 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','chain_doc_b1',],
    intels: ['intel_cultivation_tip'],
  },

  // 杭州·西湖茶庄女老板
  hangzhou_tea_woman: {
    id:'hangzhou_tea_woman', name:'沈碧云', role:'西湖茶庄女老板', category:'misc', avatar:'🍵',
    city:'hangzhou', level:40, tier:'func',
    weapon:'wep_short_knife', armor:'cs_robe',
    silver:130,
    greetings:{
      hostile: '（沈碧云放下茶盏）西湖茶庄不欢迎粗鲁之人，请回。',
      guarded: '西湖龙井是天下名茶，但碧云的茶不白送。先看银子。',
      neutral:  '西湖龙井天下第一！湖边品茶看西湖烟雨，是最惬意的事——客官坐下来歇歇？',
      friendly: '来了！今天新到一批明前龙井，碧云先给你泡了一壶。坐湖边那桌，风景最好！',
      close:    '（低声）碧云有桩事——有人在暗中高价收西湖龙井古树上的茶芽，手段很毒。你若路过龙井村，帮我留意留意。',
    },
    topics:[
      { id:'t_hz_tw_buy', text:'品茶买茶', reply:'今日新到了一批明前龙井，清香扑鼻，保证正宗！来一两，还是半斤？', relDelta:4, action:'open_shop' },
      { id:'t_hz_tw_gossip', text:'聊聊西湖趣闻', reply:'前几天有个中原来的剑客，在西湖边挑战本地武人，被司马青云一剑逼退。那人好像是某门派的密探，身份很可疑……', relDelta:6, intelId:'intel_sect_secret' },
      { id:'t_hz_tw_task', text:'有没有需要帮忙的', reply:'俺的茶叶运输被山匪截了，你若路过天目山方向，帮我查查是哪路人？', relDelta:8 },
    ],
    shop:{ items:[
      { id:'item_longjing_fresh', icon:'🍵', name:'西湖龙井', desc:'天下名茶，精力+28，好感亲切', price:30, effect:{ energy:28 } },
      { id:'item_xhu_pastry',    icon:'🧁', name:'西湖糕点', desc:'江南特色，饱食度+22', price:15, effect:{ food:22 } },
      { id:'item_lotus_wine',    icon:'🪷', name:'荷花酿', desc:'西湖荷花特酿，精力+25', price:22, effect:{ energy:25 } },
    ]},
    quests:['quest_escort_rescue','quest_escort_reconnaissance','quest_daily_bounty_hunt','quest_gossip_weird_duel'],
    intels: ['intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  杭州·商会掌柜（商店NPC）
  // ══════════════════════════════════════════════════════════
  hangzhou_merchant: {
    id:'hangzhou_merchant', name:'苏锦文', role:'江南商会杭州分号掌柜', category:'shop', avatar:'💰',
    city:'hangzhou', level:42, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:320,
    giftPrefs:{
      label:'丝绸织锦与江南风物',
      love:['pearl','raretrade'],
      like:['mystic','mechanism'],
      thanksLoved:['苏某走南闯北，这等好货实属难得！','这份心意，苏某领了。'],
      thanksLiked:['不错，江南正好用得上。'],
      questHint:'苏锦文神色亲热了不少，像是终于肯把那单江南买卖说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问苏掌柜这单「${questName}」` : '追问苏掌柜手里那单买卖',
        questReply: ({ questName }) => questName
          ? `苏锦文把折扇一收：\"既然你诚心想沾这笔生意，苏某也不瞒你——${questName}。去任务页看。\"` : '苏锦文翻开账本：\"我手里正有批货要往广州送，你若顺路，去任务页看看。\"',
        intelText: () => '请苏掌柜把这条商路细说分明',
        intelReply: ({ intelText }) => `苏锦文压低了声音：\"${intelText}\"`,
        warmText: () => '顺着账目继续往下谈',
        warmReply: ({ npcName }) => `${npcName}把货物单据收好：\"你是苏某信得过的人，往后江南的买卖，少不了你帮忙。\"`,
      }
    },
    greetings:{
      hostile:['苏某做的是正经买卖，不陪无聊人消磨时辰。'],
      guarded:['先说清楚要买还是要卖，再谈别的。'],
      neutral:['杭州鱼米之乡，丝绸甲天下。苏某的商号在江南少说也有二十年了。','江南繁华，什么货都有。苏某这儿只卖好东西，不卖水货。'],
      friendly:['来得正好，正好有批新货刚清点完，你眼光不错。'],
      close:['你是苏某信得过的人。有些路子旁人不能走，你却可以。'],
    },
    topics:[
      { id:'t_hz_merch_buy',  text:'看看货物', reply:'这都是苏某走南闯北收来的好货，品质绝对有保证。', relDelta:0, action:'open_shop' },
      { id:'t_hz_merch_task', text:'问问有没有任务', reply:'有批货要从杭州送往广州，沿途还算太平，你若顺路，报酬好商量。', relDelta:3 },
      { id:'t_hz_merch_info', text:'打听江南商道', reply:'往南走广州，走海运最快但有风险；往北走扬州，是运河要道，最稳当。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_hz_merch_cricket', text:'听说贵店有蛐蛐笼卖？', reply:'蛐蛐笼？杭州这边斗蛐蛐的风气浓，苏某这儿有好货，给你留着呢。', relDelta:1 },
    ],
    shop:{
      items:[
        { id:'item_elixir',      name:'灵药',       desc:'回复气血内力各50',       icon:'⚗',  price:35, effect:{hp:50, mp:50} },
        { id:'item_travel_ration',name:'行路干粮',  desc:'饱食度+40',             icon:'🧆', price:8,  effect:{food:40} },
        { id:'item_wine_age',    name:'陈年女儿红', desc:'江南名酒，精力+40',     icon:'🍯', price:22, effect:{energy:40} },
        { id:'item_lucky_incense',name:'祈福香',    desc:'气运小幅提升',          icon:'🕯️', price:15, effect:{rel_bonus:5} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_gossip_weird_duel'],
    intels:['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  荆州城 NPCs  (major · 古来兵家必争 · 长江要冲)
  // ══════════════════════════════════════════════════════════

  jingzhou_inn: {
    id:'jingzhou_inn', name:'吴老倌', role:'江边客栈掌柜', category:'inn', avatar:'🛶',
    city:'jingzhou', level:50, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:70,
    greetings:{
      hostile: '（吴老倌挡住门口）荆州客栈不留可疑之人，客官请便。',
      guarded: '天下枢纽的地方鱼龙混杂，先付银子再谈别的。',
      neutral:  '荆州城，天下枢纽！长江两岸数百年，俺这客栈开了二十年，什么人都见过。武当道士、少林和尚都在这打过尖！',
      friendly: '来了！上回帮你留的那间临江房还在，晚上听长江渔火，舒服得很。',
      close:    '（压低声音）老倌替你打听到一个消息——洞庭水贼最近在招人，条件开得很高，但冲着谁去的还没弄清楚。你小心。',
    },
    topics:[
      { id:'t_jz_inn_rest', text:'住店一晚（10两）', reply:'好！荆州夜晚有长江渔火，比什么景致都美！', relDelta:5, action:'inn_rest' },
      { id:'t_jz_inn_news', text:'打听荆州消息', reply:'听说凌霄阁最近在荆州设了暗桩，到处收买消息。另外武当山那边来了几个高手，说是下山办事，但具体是什么事，不清楚。', relDelta:4, intelId:'intel_sect_secret' },
      { id:'t_jz_inn_route', text:'询问水路情况', reply:'荆州是长江中游最重要的渡口，往东可至武汉，往西入巴蜀，往南可下洞庭。但最近洞庭水贼闹事，南边水路不太平！', relDelta:3, intelId:'intel_road_bandit' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_road_bandit'],
  },

  jingzhou_general: {
    id:'jingzhou_general', name:'魏铁城', role:'荆州城守', category:'misc', avatar:'🗡',
    city:'jingzhou', level:62, tier:'major',
    weapon:'wep_wolf_fang', armor:'cs_general',
    silver:280,
    greetings:{
      hostile: '（拔剑指来）荆州咽喉之地，宵小敢在此放肆，先问本将手中这柄剑！',
      guarded: '荆州是天下咽喉，本将镇守于此。你一身武艺不错——但可曾为朝廷效力过？先说清来路。',
      neutral:  '长江沿岸近来不太平，水贼和江湖帮会都在蠢蠢欲动。本将日夜守卫，哪路宵小敢在此滋事！',
      friendly: '（点头）又来了。上次你帮忙清剿的那股水贼，朝廷发了赏——本将替你领了，回头给你。',
      close:    '（拉入内室）本将有一件私事——朝廷有人要陷害本将，证据被藏了起来。你若能帮忙找到，魏某此生不忘。',
    },
    topics:[
      { id:'t_jz_gen_duty', text:'了解荆州军务', reply:'洞庭水贼最近偷袭商船，朝廷已发文让本将清剿。但那些贼人水性极好，陆上兵丁难以追击。若有会水战的江湖高手协助，本将不吝重谢。', relDelta:6 },
      { id:'t_jz_gen_history', text:'聊聊荆州历史', reply:'荆州古来就是兵家必争。三国时刘备借荆州，后来孙权索荆州，死了多少英雄！本将每思及此，便觉责任重大！', relDelta:5 },
    ],
    shop: null,
    quests:['quest_patrol_road','quest_guard_spy_hunt','quest_guard_bandit_clear','quest_daily_guard_patrol'],
    intels: ['intel_mingjiao_rise'],
  },

  jingzhou_smith: {
    id:'jingzhou_smith', name:'甘百炼', role:'楚地铁匠', category:'blacksmith', avatar:'🔨',
    city:'jingzhou', level:37, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:100,
    greetings:{
      hostile: '（甘百炼锤子一顿）楚地铁铺不收闹事的！出去！',
      guarded: '楚国出精铁，但好铁不白给。先付银子。',
      neutral:  '楚国出精铁，荆州出名匠！干爷爷的铁铺传了四代，没有打不了的兵器。你是江湖人，来挑把好家伙？',
      friendly: '来了！你上次买的那把短剑甘百炼又给你淬了一遍火，现在比当初还硬三分——不收钱！',
      close:    '（从炉底取出一块暗红色铁锭）这是楚地百年赤矿打的精铁，甘百炼存了半辈子——给你，够打一把绝世好刀。',
    },
    topics:[
      { id:'t_jz_smith_identify', text:'🔍 鉴定装备（收费）', reply:'拿上来让甘百炼看看，俺打了四代铁，眼睛毒着呢。', relDelta:0, action:'identify_equip' },
      { id:'t_jz_smith_custom', text:'打听锻造材料', reply:'楚地铁质偏韧，适合打长兵器。北方的铁偏硬，适合重刀。想要什么风格的武器，材料很关键！', relDelta:4 },
    ],
    shop:{ items:[
      { id:'item_chu_iron', icon:'⚒', name:'楚地精铁', desc:'质地韧劲好，武器强化材料', price:60, effect:{} },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels: ['intel_trade_route'],
  },

  jingzhou_strategist: {
    id:'jingzhou_strategist', name:'诸葛寒', role:'隐士谋士', category:'quest', avatar:'📜',
    city:'jingzhou', level:55, tier:'major',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:100,
    greetings:{
      hostile: '（诸葛寒目光如电）阁下心术不正，老夫不与阴谋者论道。',
      guarded: '江湖如棋局，看破者方能不败。阁下面相——经历颇多，但老夫还需观察。',
      neutral:  '江湖风云变幻，荆州地处要冲。阁下面相不凡，江湖闯荡过不少，可愿与老夫一叙？',
      friendly: '（微笑）来了。老夫最近悟出一局残棋，百思不解——你若有些想法，不妨帮老夫参谋参谋。',
      close:    '（推开密室暗格）诸葛寒一生谋略，从未托付于人。你是例外——这里有老夫半生整理的天下势力图谱，拿去看吧。',
    },
    topics:[
      { id:'t_jz_str_counsel', text:'请教江湖谋略', reply:'兵法云：知己知彼百战不殆。江湖中最忌莽撞，每出手前先探清对方底细，再寻其弱点。阁下若遇强敌，不妨先以迂回之策扰乱其心，再正面一击！', relDelta:8 },
      { id:'t_jz_str_intel', text:'打听各方动向', reply:'日月神教在中原渗透甚深，各派首领都如坐针毡。但神教内部并不团结，光明左右使各有算盘，此乃其破绽所在！', relDelta:6, intelId:'intel_mingjiao_rise' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_mingjiao_rise'],
  },

  // ══════════════════════════════════════════════════════════
  //  武汉·武昌 NPCs  (major · 九省通衢 · 武汉三镇)
  // ══════════════════════════════════════════════════════════

  wuhan_inn: {
    id:'wuhan_inn', name:'程大嘴', role:'武昌楼旅店老板', category:'inn', avatar:'🐟',
    city:'wuhan', level:31, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:90,
    greetings:{
      hostile: '（程大嘴抄起扁担）武昌楼不招待找茬的！客官请回！',
      guarded: '九省通衢的地方什么人都有，先付钱再说。程大嘴不赊账。',
      neutral:  '欢迎！武昌鱼最鲜，热干面最香，先填饱肚子再说话！九省通衢南来北往，什么江湖秘闻都听过！',
      friendly: '来了来了！今天武昌鱼大个肥美，程大嘴给你清蒸了一条——老位子给你留着呢！',
      close:    '（关上后厨门）大嘴有个事——城里那批关外来的人又出现了，就住在你隔壁。大嘴怕他们对你不利，你出入当心。',
    },
    topics:[
      { id:'t_wh_inn_rest', text:'住店一晚（10两）', reply:'好！二楼可以看到长江，早晨渔船出江的景色，值回票价！', relDelta:5, action:'inn_rest' },
      { id:'t_wh_inn_news', text:'打听武汉消息', reply:'最近从北边来了一批神秘武人，听口音像是关外的。在城里几家武馆踢了场子，全赢了，然后就不见了，不知去哪里了。', relDelta:4, intelId:'intel_road_bandit' },
      { id:'t_wh_inn_fish', text:'点一份武昌鱼', reply:'好嘞！武昌鱼清蒸最好，配上汉口酒，吃完再上路，体力翻倍！', relDelta:6, action:'buy_drink' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_road_bandit'],
  },

  wuhan_hero: {
    id:'wuhan_hero', name:'黄鹤道', role:'黄鹤楼剑侠', category:'misc', avatar:'🦅',
    city:'wuhan', level:52, tier:'major',
    weapon:'wep_silver_sword', armor:'cs_ranger',
    silver:300,
    greetings:{
      hostile: '（黄鹤道手按剑柄）黄鹤楼上不容放肆之人，请回。',
      guarded: '昔人已乘黄鹤去，此地空余黄鹤楼。阁下是来游历还是来找人？',
      neutral:  '黄鹤楼上，江湖险恶，一人之力有限，若能结交真心朋友比什么都强！武汉三镇藏龙卧虎——你来此寻什么人？',
      friendly: '（大笑）来啦！黄鹤楼上好酒好风，今天又切磋一场？上次你那招进步不小！',
      close:    '（难得沉默）黄某一生孤剑，交心的朋友只有你一个。有件事——我查出当年害我师父的仇人在长沙，你若肯同行……',
    },
    topics:[
      { id:'t_wh_hero_spar', text:'切磋武艺', reply:'黄鹤楼上，刀光剑影！（一番较量后）好！武汉三镇第一高手之名，要让出来了！痛快！', relDelta:10, action:'spar_fight' },
      { id:'t_wh_hero_travel', text:'聊聊四方见闻', reply:'俺走过南北，见过形形色色的高手。中原武林明面上风平浪静，暗地里各方势力都在布局。日月神教动作最大，各大门派都在观望。', relDelta:6 },
      { id:'t_wh_hero_jianghu', text:'谈谈江湖情义', reply:'俺认为，江湖情义比什么都重要。银子花了能再挣，命没了就完了，但朋友的义，是多少银子换不来的！', relDelta:8 },
    ],
    shop: null,
    quests:['quest_test_talent','quest_swordsman_settle_grudge','quest_patrol_road','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_mingjiao_rise'],
  },

  wuhan_doctor: {
    id:'wuhan_doctor', name:'叶青莲', role:'草药医婆', category:'misc', avatar:'🌿',
    city:'wuhan', level:31, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:150,
    greetings:{
      hostile: '（叶青莲银针一横）老婆子不治心术不正的人，出去！',
      guarded: '武汉湿气重，受伤要及时治。看诊先付银子。',
      neutral:  '老婆子坐诊三十年，江湖上受伤的人都爱找俺！武汉湿气重，治伤要趁早，否则湿寒症一辈子难好。',
      friendly: '回来了？上次你那道内伤老婆子配的药，用完没有？这次给你多备了几副——不收钱。',
      close:    '（颤巍巍拉住你的手）老婆子有个秘密方子——专治经脉断损。这方子从来没给人用过，但你的伤……值得老婆子冒险。',
    },
    topics:[
      { id:'t_wh_doc_heal', text:'求医问诊', reply:'老婆子给你看看……这伤还好，配几副药就能好！', relDelta:5, action:'heal_hp' },
      { id:'t_wh_doc_herb', text:'购买药材', reply:'长江边的草药最新鲜，尽管来取！', relDelta:3, action:'open_shop' },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_wuhan_herbal', icon:'🌿', name:'汉口草药包', desc:'武汉特产药材，气血+35', price:40, effect:{ hp:35 } },
      { id:'item_lotus_tea', icon:'🍵', name:'莲心清神汤', desc:'安神定气，精力+25', price:30, effect:{ energy:25 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  武汉·商会掌柜（商店NPC）
  // ══════════════════════════════════════════════════════════
  wuhan_merchant: {
    id:'wuhan_merchant', name:'郑万通', role:'武汉商会总号掌柜', category:'shop', avatar:'💰',
    city:'wuhan', level:36, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:260,
    giftPrefs:{
      label:'长江货物与实用物资',
      love:['raretrade','mechanism'],
      like:['pelt','mystic'],
      thanksLoved:['郑某走南闯北，这等好货实属难得！','这份心意，郑某领了。'],
      thanksLiked:['不错，武汉正好用得上。'],
      questHint:'郑万通神色亲热了不少，像是终于肯把那单长江买卖说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问郑掌柜这单「${questName}」` : '追问郑掌柜手里那单买卖',
        questReply: ({ questName }) => questName
          ? `郑万通把折扇一收：\"既然你诚心想沾这笔生意，郑某也不瞒你——${questName}。去任务页看。\"` : '郑万通翻开账本：\"我手里正有批货要往成都送，你若顺路，去任务页看看。\"',
        intelText: () => '请郑掌柜把这条商路细说分明',
        intelReply: ({ intelText }) => `郑万通压低了声音：\"${intelText}\"`,
        warmText: () => '顺着账目继续往下谈',
        warmReply: ({ npcName }) => `${npcName}把货物单据收好：\"你是郑某信得过的人，往后武汉的买卖，少不了你帮忙。\"`,
      }
    },
    greetings:{
      hostile:['郑某做的是正经买卖，不陪无聊人消磨时辰。'],
      guarded:['先说清楚要买还是要卖，再谈别的。'],
      neutral:['武汉长江要冲，九省通衢，什么货都从这儿过。','郑某的商号在武汉少说也有二十年了。'],
      friendly:['来得正好，正好有批新货刚清点完，你眼光不错。'],
      close:['你是郑某信得过的人。有些路子旁人不能走，你却可以。'],
    },
    topics:[
      { id:'t_wh_merch_buy',  text:'看看货物', reply:'这都是郑某走南闯北收来的好货，品质绝对有保证。', relDelta:0, action:'open_shop' },
      { id:'t_wh_merch_task', text:'问问有没有任务', reply:'有批货要从武汉送往成都，沿途要过山区，你若准备接，先掂量掂量自己的本事。', relDelta:3 },
      { id:'t_wh_merch_info', text:'打听长江商道', reply:'往西走成都，要过三峡，路上山匪不少；往东走南京，走水路最稳当。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_wh_merch_cricket', text:'听说贵店有蛐蛐笼卖？', reply:'蛐蛐笼？有是有，不过最近进的少了。你诚心要的话，郑某可以给你调货。', relDelta:1 },
    ],
    shop:{
      items:[
        { id:'item_elixir',      name:'灵药',       desc:'回复气血内力各50',       icon:'⚗',  price:35, effect:{hp:50, mp:50} },
        { id:'item_travel_ration',name:'行路干粮',  desc:'饱食度+40',             icon:'🧆', price:8,  effect:{food:40} },
        { id:'item_wine_age',    name:'陈年汾酒',   desc:'精力+40',               icon:'🍯', price:20, effect:{energy:40} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备', icon:'🧺', price:40, effect:{} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_gossip_weird_duel'],
    intels:['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  长沙 NPCs  (major · 楚地中心 · 潇湘武学)
  // ══════════════════════════════════════════════════════════

  changsha_inn: {
    id:'changsha_inn', name:'贾老倌', role:'岳麓山脚客栈掌柜', category:'inn', avatar:'🍊',
    city:'changsha', level:40, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:70,
    greetings:{
      hostile: '（贾老倌挡住门口）楚地不留歹人，客官请回。',
      guarded: '长沙城里江湖人多，先付银子再说。贾老倌的客栈规矩不能破。',
      neutral:  '长沙城，楚文化的根！岳麓山上书院山下江湖，来了就别急着走。凌霄阁在长沙有分坛，消息灵通得很！',
      friendly: '来了！湘菜给你备好了——剁椒鱼头加臭豆腐，正宗湖南味！老位子留着呢。',
      close:    '（低声）贾老倌替你留意了——凌霄阁最近在找一个人，描述跟你很像。你在这里出入要小心，老倌替你打掩护。',
    },
    topics:[
      { id:'t_cs_inn_rest', text:'住店一晚（10两）', reply:'好！长沙的辣椒红油端上来，吃完保你精力充沛，一觉睡到天亮！', relDelta:5, action:'inn_rest' },
      { id:'t_cs_inn_lingxiao', text:'打听凌霄阁分坛', reply:'凌霄阁在城南有据点，那里每月都有消息汇聚发散。据说阁主本人有时候也会出现在长沙，但从不露面！', relDelta:4, intelId:'intel_sect_secret' },
      { id:'t_cs_inn_jianghu', text:'了解湖南江湖', reply:'湖南武林以潇湘剑法著称，轻灵飘逸，和楚地民风有些反差。张家界那边还有凌霄阁的弟子在深山修炼，鲜少下山。', relDelta:3 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  changsha_swordwoman: {
    id:'changsha_swordwoman', name:'苗湘君', role:'潇湘女剑侠', category:'misc', avatar:'🌸',
    city:'changsha', level:57, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:200,
    greetings:{
      hostile: '（苗湘君按剑冷视）潇湘剑下不斩无名之辈——但也不欢迎不速之客。',
      guarded: '楚地女子不输男儿。阁下是来切磋的，还是来找事的？先说清楚。',
      neutral:  '潇湘剑法以柔克刚，万水千山皆折腰！凌霄阁请俺入阁，俺没答应——江湖人最要紧的是自由。你是练家子？切磋切磋？',
      friendly: '（微笑亮剑）又见面了！上次你那招化解得漂亮，苗湘君记着呢。今天有没有空陪俺练几式？',
      close:    '（收剑入鞘，难得柔声）苗湘君行走江湖多年，你是第一个让俺放下戒心的人。有件衡山隐士的事……你愿意跟俺一起去找吗？',
    },
    topics:[
      { id:'t_cs_sword_spar', text:'切磋武艺', reply:'（抬起长剑，指向你）来！潇湘一剑，且看你如何应对！（较量后）好功夫，今日不虚此行！', relDelta:10, action:'spar_fight' },
      { id:'t_cs_sword_teach', text:'请教潇湘剑法', reply:'潇湘剑法的精髓在"随势"，顺着对方的劲使力，四两拨千斤。死记硬背是学不来的，要靠悟！', relDelta:7 },
      { id:'t_cs_sword_intel', text:'打听湖南各方消息', reply:'湖南山深林密，藏了不少世外高手。衡山那边有位隐士，据说修炼了失传的掌法，找过他的人不少，都没找到。', relDelta:4, intelId:'intel_kunlun_sword' },
    ],
    shop: null,
    quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_kunlun_sword'],
  },

  changsha_merchant: {
    id:'changsha_merchant', name:'廖胖子', role:'湘商会馆掌柜', category:'shop', avatar:'🍵',
    city:'changsha', level:38, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:300,
    greetings:{
      hostile: '（廖胖子翻着账本头都不抬）湘商会馆不跟来历不明的人做生意。',
      guarded: '湘商会馆湖南最大商行，想知道行情先拿出诚意——银票或者消息。',
      neutral:  '湘商会馆，湖南最大商行！廖胖子做什么生意不知道的？长沙货物南来北往，问俺市价准没错！',
      friendly: '来了！上次你要的那批货廖胖子给你弄到了，价格比上次还低——老客户，够意思吧？',
      close:    '（合上账本）廖胖子有个秘密商路，绕过官税利润翻三倍。你若是信得过俺，入一股？赚了对半分。',
    },
    topics:[
      { id:'t_cs_mer_trade', text:'打听商道情报', reply:'最近从广州来的香料生意很好。北方战事加剧，但南方商道畅通，湘楚物资源源不断往北运，商机极大！', relDelta:4, intelId:'intel_trade_route' },
      { id:'t_cs_mer_buy', text:'购买特产', reply:'湘辣子、浏阳花炮、湘绣，尽管选！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_xiangcai', icon:'🌶', name:'辣子佐料', desc:'湖南辣料，吃后热血沸腾，攻击临时+8', price:20, effect:{ atkBuff:8 } },
      { id:'item_xiangsui', icon:'🌿', name:'湘绣锦囊', desc:'精美香囊，收纳物品，礼品佳选', price:45, effect:{} },
      { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels: ['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  广州 NPCs  (major · 岭南港城 · 海上丝路)
  // ══════════════════════════════════════════════════════════

  guangzhou_inn: {
    id:'guangzhou_inn', name:'陈大旺', role:'珠江边客栈掌柜', category:'inn', avatar:'⚓',
    city:'guangzhou', level:32, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:80,
    greetings:{
      hostile: '（陈大旺挡住楼梯）珠江边不欢迎找事的人！出去！',
      guarded: '广州什么人都有，先付银子再说。陈大旺的客栈不赊不欠。',
      neutral:  '广州是南海最大港城，五湖四海的人都在这里！吃的好，生意好，海上商船刚靠岸有异域货物。客官坐坐！',
      friendly: '来了！你的老房间大旺给你留着呢，窗外能看到珠江夜景——这可是全广州最好的位置！',
      close:    '（关上门）大旺替你打听到一个事——海沙派最近在暗中跟南洋武士联手，目标是广州港的货物。你出入小心。',
    },
    topics:[
      { id:'t_gz_inn_rest', text:'住店一晚（10两）', reply:'好！珠江夜景美绝，潮涨潮落，和内陆的夜完全不同！', relDelta:5, action:'inn_rest' },
      { id:'t_gz_inn_sea', text:'打听海上情况', reply:'海沙派的船最近不太活跃，听说遭了什么变故。东南方向反而出现了几艘陌生旗号的大船，不知是哪路人马。', relDelta:4, intelId:'intel_road_bandit' },
      { id:'t_gz_inn_trade', text:'询问海外商道', reply:'广州港每月都有来自波斯、南洋的商船，带来珍奇货物。不过俺们最值钱的还是出口的丝绸和瓷器！', relDelta:3, intelId:'intel_trade_route' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_trade_route'],
  },

  guangzhou_hero: {
    id:'guangzhou_hero', name:'邝猛虎', role:'岭南武馆馆主', category:'misc', avatar:'👊',
    city:'guangzhou', level:51, tier:'major',
    weapon:'wep_iron_fist', armor:'cs_general',
    silver:280,
    greetings:{
      hostile: '（邝猛虎双拳一握）岭南武馆不收来路不明的人！出去！',
      guarded: '岭南拳法以刚克刚，你想在广州站稳脚跟？先过了俺这关再说。',
      neutral:  '岭南拳法以刚克刚！俺邝猛虎广州三十年无敌手。中原武林看不起岭南武学？进了武馆再说话！',
      friendly: '嘿！你小子拳法又有进步！邝猛虎最近琢磨出一套"虎鹤双形"的新路子，来练练？',
      close:    '（拍着你肩膀）猛虎一辈子没服过几个人。你是其中之一——俺有桩海沙派的旧事想跟你联手了结。',
    },
    topics:[
      { id:'t_gz_hero_spar', text:'切磋武艺', reply:'（摆开岭南拳架势）来！中原武功对上岭南拳，看谁厉害！（较量后）哈，好小子，中原确实藏龙卧虎！', relDelta:10, action:'spar_fight' },
      { id:'t_gz_hero_teach', text:'请教岭南拳法', reply:'岭南拳讲究短桥窄马，力发于腰，快打急收！和内陆那些花架子不同，实战里每一招都是要命的！', relDelta:7 },
      { id:'t_gz_hero_jianghu', text:'打听岭南江湖', reply:'岭南江湖比中原复杂，还有南洋武士掺和进来。海沙派势力最大，但他们最近出了变故，其他帮派都在趁机扩张！', relDelta:5, intelId:'intel_sect_secret' },
    ],
    shop: null,
    quests:['quest_test_talent','quest_swordsman_settle_grudge','quest_patrol_road','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_sect_secret'],
  },

  guangzhou_merchant: {
    id:'guangzhou_merchant', name:'蕃商哈桑', role:'波斯商人', category:'shop', avatar:'🌙',
    city:'guangzhou', level:48, tier:'func',
    weapon:'wep_blood_saber', armor:'cs_cloth',
    silver:400,
    greetings:{
      hostile: '（哈桑手按弯刀）大食商人的铺子不招待粗鲁之人。请回。',
      guarded: '广州是东西方贸易中心，但哈桑的货物不便宜。先看银子。',
      neutral:  '你好！俺来自大食，沿海路至广州做丝绸香料买卖！广州可买到世界各地的好东西，俺也会大食武功！',
      friendly: 'Ah,我的朋友！上次你要的那批波斯香料到了，上等货！价格给你打八折。',
      close:    '（压低声音）哈桑有艘私船下月要出海，走的是一条不经过官港的暗线。利润极大但需要可靠的人护船——你有没有兴趣？',
    },
    topics:[
      { id:'t_gz_mer_trade', text:'购买异域商品', reply:'大食香料、波斯宝石、南洋香木！尽管挑选！', relDelta:3, action:'open_shop' },
      { id:'t_gz_mer_foreign', text:'聊聊西域和大食', reply:'从大食到广州，海路要走数月。一路上风险不小，但利润丰厚。俺在路上见过很多奇人异事，有机会讲给你听！', relDelta:6 },
    ],
    shop:{ items:[
      { id:'item_persian_spice', icon:'🌶', name:'波斯香料', desc:'异域香料，精力+15，心情振奋', price:35, effect:{ energy:15 } },
      { id:'item_arabian_gem', icon:'💎', name:'大食宝石', desc:'稀有宝石，贵重礼品，好感提升显著', price:120, effect:{} },
      { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'],
    intels: ['intel_trade_route'],
  },

  // 广州·岭南草药婆婆
  guangzhou_herbalist: {
    id:'guangzhou_herbalist', name:'阿莲婆', role:'岭南草药婆婆', category:'misc', avatar:'🌿',
    city:'guangzhou', level:35, tier:'func',
    weapon:'wep_short_knife', armor:'cs_cloth',
    silver:60,
    greetings:{
      hostile: '（阿莲婆银针一横）老婆子不治心术不正的人，走开！',
      guarded: '岭南湿热容易中暑。看诊先付银子，阿莲婆不白忙活。',
      neutral:  '岭南湿热，阿莲婆的凉茶包治百病！从北方来的？先喝碗凉茶去去燥热！俺在珠江边做了三十年药。',
      friendly: '来了！上次你那道湿寒老婆子配了药，今天再给你复查一下——不收钱，熟人嘛。',
      close:    '（颤巍巍从柜底取出一罐膏药）这方子是阿莲婆的师父传的，专治经脉寸断——从来没给人用过。你的伤……值得冒这个险。',
    },
    topics:[
      { id:'t_gz_herb_buy', text:'买些草药', reply:'岭南的草药和中原的不一样，药效更猛！来，看你需要什么。', relDelta:3, action:'open_shop' },
      { id:'t_gz_herb_local', text:'打听岭南药方', reply:'岭南有味药叫鱼腥草，清热解毒，北方人不习惯那味道，但用处大着哩！', relDelta:5 },
      { id:'t_gz_herb_task', text:'有没有需要帮忙的', reply:'我儿子去山里采药三天没回来，你要是路过白云山，帮我留意留意……', relDelta:8 },
    ],
    shop:{ items:[
      { id:'item_lingnan_herb', icon:'🌿', name:'岭南凉茶包', desc:'清热解毒，气血+20，解轻毒', price:18, effect:{ hp:20 } },
      { id:'item_heat_balm', icon:'💊', name:'祛暑丹', desc:'岭南特制，精力+25，饱食度+15', price:25, effect:{ energy:25, food:15 } },
      { id:'item_pearl_powder', icon:'✨', name:'珍珠粉', desc:'南海珍珠研磨，气血内力各+30', price:55, effect:{ hp:30, mp:30 } },
    ]},
    quests:['quest_rare_herb','quest_taoist_herb_gather','quest_daily_herbs'],
    intels: ['intel_jianghu'],
  },

  // 广州·珠江歌舫花魁
  guangzhou_dancer: {
    id:'guangzhou_dancer', name:'南珍姑娘', role:'珠江歌舫花魁', category:'tavern', avatar:'🌺',
    city:'guangzhou', level:44, tier:'major',
    weapon:'wep_short_knife', armor:'cs_robe',
    silver:320,
    greetings:{
      hostile: '（南珍收起笑容）珠江歌舫不招待粗野之人，请回。',
      guarded: '五湖四海的英雄来了广州都来转一转，但南珍的歌不是谁都能听的。先亮银子。',
      neutral:  '珠江月色最美，舫中歌声最甜——进来坐坐？南珍不只会唱曲，江湖上的消息也知道不少。',
      friendly: '（笑着迎上来）来了！今晚有首新曲子，是南珍专门为你写的——先坐，茶和点心都备好了。',
      close:    '（收起歌扇，认真看着你）南珍在珠江上唱了十年曲，看透了形形色色的人。你是唯一把南珍当"人"而不是"歌女"看的。有件事，只能告诉你一个人……',
    },
    topics:[
      { id:'t_gz_dance_song', text:'听一段南曲', reply:'【南珍清了清嗓子，一段珠江水调悠扬而起，让人心旷神怡】恩人好耳力！', relDelta:10, action:null },
      { id:'t_gz_dance_info', text:'打听江湖消息', reply:'上月有几个黑衣人在广州码头接了批货，神神秘秘的。蕃商哈桑知道更多，但他嘴紧。', relDelta:8, intelId:'intel_trade_route' },
      { id:'t_gz_dance_buy', text:'买些礼物', reply:'姑娘这里有岭南特产，都是好东西！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_pearl_necklace', icon:'📿', name:'南海珍珠链', desc:'岭南名产，赠人好感+20', price:100, effect:{ rel_bonus:20 } },
      { id:'item_lychee_wine', icon:'🍷', name:'荔枝酿', desc:'岭南荔枝美酒，精力+30，心情愉悦', price:30, effect:{ energy:30 } },
    ]},
    quests:['quest_spy_trail','quest_teahouse_gossip','quest_song_request','quest_merchant_price_intel','quest_gossip_secret_admirer'],
    intels: ['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  灵州·银川 NPCs  (major · 西夏故都 · 密宗圣地)
  // ══════════════════════════════════════════════════════════

  yinzhou_inn: {
    id:'yinzhou_inn', name:'李守门', role:'灵州驿站掌柜', category:'misc', avatar:'🌙',
    city:'yinzhou', level:40, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_ranger',
    silver:60,
    greetings:{
      hostile: '（李守门挡住门口）灵州不收来历不明的人，客官请便。',
      guarded: '西北风沙大，但李守门的驿站规矩也大。先付银子。',
      neutral:  '灵州是西夏故都，物是人非但故事没结束！西北风沙大，进来喝碗热汤暖暖身子再说话。',
      friendly: '来了！你的毡包李守门一直留着呢——西北夜晚星空绝美，出去看看，比什么烦恼都治愈。',
      close:    '（压低声音）守门替你发现一个事——有人半夜在皇宫废墟附近挖东西，被密宗武士赶走了，但那人不死心，白天又来了。你出入小心。',
    },
    topics:[
      { id:'t_yz_inn_rest', text:'住店一晚（10两）', reply:'好！西北夜晚星空绝美，睡前出去看看，比任何烦恼都治愈！', relDelta:5, action:'inn_rest' },
      { id:'t_yz_inn_xixia', text:'打听西夏皇宫', reply:'西夏皇宫废墟在城北，密宗三法王重建了一部分。听说宫中有密宗秘典和西夏王朝最后的秘密，但进去的人十有八九出不来！', relDelta:4, intelId:'intel_tianshu' },
      { id:'t_yz_inn_route', text:'询问西行路况', reply:'往西走是河西走廊，沙漠戈壁，路不好走。最好找有经验的向导，否则容易在荒漠中迷路，那就危险了！', relDelta:3, intelId:'intel_road_bandit' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_tianshu'],
  },

  yinzhou_monk: {
    id:'yinzhou_monk', name:'旃陀罗', role:'密宗大法师', category:'misc', avatar:'🌀',
    city:'yinzhou', level:51, tier:'major',
    weapon:'wep_uc_bamboo_staff', armor:'cs_monk_robe',
    silver:200,
    greetings:{
      hostile: '（旃陀罗双目如电）施主身上戾气深重，密宗圣地不欢迎邪念之人。',
      guarded: '西夏密宗传自天竺，与中原武学大异其趣。施主来此，先表明心性。',
      neutral:  '三法王流落此地传承密宗，乃是天意。密宗力量来自信仰与修炼——阁下来此或许也是因缘。',
      friendly: '（微笑合十）施主心性日渐纯善，老衲甚慰。来，密宗茶室新烹了酥油茶，边喝边聊。',
      close:    '（引你入密室）老衲有一部从未示人的密宗注解，记载了三法王数十年悟不透的秘典线索——你若愿意参悟，这是你的了。',
    },
    topics:[
      { id:'t_yz_monk_teach', text:'请教密宗武学', reply:'密宗武功讲究"三密相应"——身密（姿势）、口密（咒语）、意密（意念）。三者合一，可发出非凡力量。俺可教你一些基础，剩下靠自己悟！', relDelta:9, action:'train_skill' },
      { id:'t_yz_monk_xixia', text:'询问西夏秘密', reply:'西夏王朝覆灭，但密宗传承未断。宫中藏有王朝最后的秘典，记载了一套无上武学，三法王守护了数十年，至今未能悟透……', relDelta:7, intelId:'intel_sect_secret' },
      { id:'t_yz_monk_goal', text:'谈论人生目标', reply:'密宗认为，众生皆有佛性，修炼是为了觉悟，而非争强好胜。但世间是非恩怨，有时不修武不能自保，这也是密宗武学存在的原因。', relDelta:5 },
    ],
    shop: null,
    quests:['quest_sect_mission','quest_monk_demon_banish','quest_monk_pilgrim_escort'],
    intels: ['intel_sect_secret'],
  },

  yinzhou_guard: {
    id:'yinzhou_guard', name:'铁鞍驼', role:'西夏遗民武士', category:'misc', avatar:'🐪',
    city:'yinzhou', level:50, tier:'func',
    weapon:'wep_blood_saber', armor:'cs_general',
    silver:80,
    greetings:{
      hostile: '（弯刀出鞘）西夏故土不欢迎外人的蔑视！再前一步，别怪弯刀不长眼！',
      guarded: '密宗三法王给了俺们容身之所，俺们以命相报。你是谁？先说清楚。',
      neutral:  '西夏旧部，守护故土！外来者想耀武扬威，先问过俺的弯刀！',
      friendly: '（收刀点头）你这人有骨气，铁鞍驼佩服。来，喝碗马奶酒——上次你帮俺们赶走了盗墓贼，这份情记着。',
      close:    '（拍着你的肩）铁鞍驼这辈子只服两个半人——三法王算三个，算你半个。皇宫废墟里有条密道，只有俺知道。你若需要，俺带你去。',
    },
    topics:[
      { id:'t_yz_guard_patrol', text:'了解灵州防务', reply:'城北皇宫废墟危险，贸然进入必遭机关。法王已布下阵法，外人不得入内，若强行闯入，俺们会出手阻拦！', relDelta:4 },
      { id:'t_yz_guard_buy', text:'购买西北货物', reply:'西北的皮草、弯刀、骏马，俺都有路子！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_westfur', icon:'🧥', name:'西夏皮草', desc:'御寒精品，防御+3', price:55, effect:{ defBuff:3 } },
      { id:'item_grassjuice', icon:'🌿', name:'草原青草汁', desc:'天然解乏，精力+20', price:20, effect:{ energy:20 } },
    ]},
    quests:['quest_guard_spy_hunt','quest_guard_bandit_clear','quest_guard_patrol_border','quest_daily_guard_patrol'],
    intels: ['intel_trade_route'],
  },

  // 银川·西夏女巫
  yinzhou_shamaness: {
    id:'yinzhou_shamaness', name:'夏雪儿', role:'西夏遗族女巫', category:'misc', avatar:'🌙',
    city:'yinzhou', level:48, tier:'major',
    weapon:'wep_silver_needle', armor:'cs_robe',
    silver:180,
    greetings:{
      hostile: '（夏雪儿银针一转）你的命格里有血光，雪儿不帮心术不正的人。',
      guarded: '雪儿的双眼能看穿你的过去——但雪儿选择不说。先说明来意。',
      neutral:  '夏雪儿的双眼能看穿你身上的伤和病——不，是能看穿你的过去。西夏法术与草药之道代代相传。',
      friendly: '（微微笑了）你的气运比上次见面时亮了些——说明你做了善事。来，雪儿给你配一碗安神汤。',
      close:    '（拉住你的手，认真看着你的眼睛）雪儿从你身上看到了两道纠缠的命运线……这件事只能告诉你一个人。你愿意听吗？',
    },
    topics:[
      { id:'t_yz_sha_heal', text:'求治疗', reply:'把手伸出来，让俺看看脉象……嗯，内伤和毒气，都能处理。', relDelta:5, action:'open_shop' },
      { id:'t_yz_sha_divination', text:'占卜一卦', reply:'西夏的占法，用的是五行和星象。俺说的话不一定每次准，但大方向不会错——你最近有一劫，但能平安过去。', relDelta:8 },
      { id:'t_yz_sha_task', text:'有没有任务', reply:'有人在西夏故都废墟中挖掘古物，很不吉利……你能去制止他们，或者带回失散的文物？', relDelta:10 },
    ],
    shop:{ items:[
      { id:'item_xixia_herb', icon:'🌿', name:'西夏秘草', desc:'西夏古方，解毒+内力+40', price:45, effect:{ mp:40, detox:true } },
      { id:'item_sand_talisman', icon:'✨', name:'沙丘符咒', desc:'西夏法术，精力+30，护身', price:35, effect:{ energy:30 } },
    ]},
    quests:['quest_sect_mission','quest_taoist_herb_gather','quest_monk_demon_banish'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  辽阳·上京 NPCs  (major · 契丹重镇 · 辽东雄城)
  // ══════════════════════════════════════════════════════════

  liaoyang_inn: {
    id:'liaoyang_inn', name:'萧大牛', role:'辽东旅舍掌柜', category:'misc', avatar:'🏯',
    city:'liaoyang', level:45, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_ranger',
    silver:70,
    greetings:{
      hostile: '（萧大牛横身挡门）辽东旅舍不收找事的人！不住就滚！',
      guarded: '辽东豪汉不废话。住店就进来付银子，不住靠边。',
      neutral:  '辽东豪汉，不废话！上京城汉人契丹混居，武风彪悍别惹事。城里相对安全，血骨门在城外。',
      friendly: '来了！萧大牛今天炖了锅牛肉，给你留着呢——辽东冬冷，吃饱了暖和。老位子，不用说了！',
      close:    '（拉到一旁低声）大牛替你发现一个事——血骨门的人最近在城里暗中活动，换了便装混进来了。你出入小心，大牛帮你打掩护。',
    },
    topics:[
      { id:'t_ly_inn_rest', text:'住店一晚（10两）', reply:'好！辽东夜晚冷，被子管够！', relDelta:5, action:'inn_rest' },
      { id:'t_ly_inn_xuegu', text:'打听血骨门', reply:'血骨门在城外驻扎多年，专门收买打手。听说最近他们和什么大势力有了联系，变得更猖獗了，往来武人小心些！', relDelta:4, intelId:'intel_sect_secret' },
      { id:'t_ly_inn_weather', text:'了解辽东气候', reply:'辽东冬天极寒！没有修炼过抗寒功的，冬天别轻易出远门，否则能冻死在路上！玄冥教的人倒是喜欢冬天出没，说冷才能修炼！', relDelta:3 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  liaoyang_archer: {
    id:'liaoyang_archer', name:'耶律风', role:'契丹神射手', category:'misc', avatar:'🏹',
    city:'liaoyang', level:57, tier:'major',
    weapon:'wep_stone_bow', armor:'cs_ranger',
    silver:300,
    greetings:{
      hostile: '（耶律风弯弓搭箭）契丹人的领地不欢迎不速之客！',
      guarded: '契丹弓法百步穿杨。阁下是来挑战的还是来做买卖的？先说清楚。',
      neutral:  '契丹弓法百步穿杨！俺耶律风辽东第一射手。中原武人少练弓法是劣势，但刀剑功夫确实强——切磋？',
      friendly: '（大笑收弓）又来了！上次切磋你的近身功夫赢了，但弓法？改日骑马对射，俺不服！',
      close:    '（难得认真）耶律风一辈子只认几个兄弟，你是其中一个。草原王庭最近有变局，你若愿意跟俺走一趟——俺把耶律家的秘密告诉你。',
    },
    topics:[
      { id:'t_ly_archer_spar', text:'切磋武艺', reply:'好，远程和近身都来！（一番较量后）近身功夫你赢了，但弓法俺不服，改日骑马对射！', relDelta:10, action:'spar_fight' },
      { id:'t_ly_archer_teach', text:'请教骑射之法', reply:'骑射要诀在于"人马合一"——心随马动，气随弓发，瞄准的瞬间人马一体，才能百发百中。非经年苦练难以领悟！', relDelta:8 },
      { id:'t_ly_archer_north', text:'打听北方草原情况', reply:'草原王庭那边最近又换了大汗，新王年轻气盛，有南下的意图。玄冥教在草原上也有布局，北方乱局只怕不远了！', relDelta:5, intelId:'intel_mingjiao_rise' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_mingjiao_rise'],
  },

  liaoyang_smith: {
    id:'liaoyang_smith', name:'铁哈答', role:'辽东铁匠', category:'blacksmith', avatar:'⚒',
    city:'liaoyang', level:50, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:150,
    greetings:{
      hostile: '（铁锤一顿）辽东铁铺不招待闹事的！',
      guarded: '辽东出好铁，但好铁不白给。要什么兵器？先付银子。',
      neutral:  '辽东出精兵出好铁！连草原王庭的将士都来铁哈答这订货。刀枪剑戟斧钺钩叉，通通拿手！',
      friendly: '来了！上次给你打的契丹弯刀用得怎样？铁哈答免费给你磨一磨——老朋友不收钱。',
      close:    '（从深坑取出一块发亮的铁锭）这是辽东最深山里的千年寒铁，铁哈答存了半辈子。拿去打一把传世兵刃——只有你配得上。',
    },
    topics:[
      { id:'t_ly_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把东西拿上来，辽东的铁匠眼里揉不得沙子。', relDelta:0, action:'identify_equip' },
      { id:'t_ly_smith_material', text:'打听辽东铁矿', reply:'辽东铁矿丰富，质地坚硬，打出的刀剑经久耐用。但最好的铁还是在深山里，需要入山采取！', relDelta:4 },
    ],
    shop:{ items:[
      { id:'item_liao_iron', icon:'⚔', name:'辽东精铁', desc:'辽东特产铁料，坚硬耐用', price:70, effect:{} },
      { id:'item_cold_ointment', icon:'❄', name:'御寒膏', desc:'抵御寒冷，精力+15', price:30, effect:{ energy:15 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels: ['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  草原王庭 NPCs  (major · 游牧王庭 · 大漠豪雄)
  // ══════════════════════════════════════════════════════════

  caoyuan_inn: {
    id:'caoyuan_inn', name:'牧人巴图', role:'草原驿站主人', category:'misc', avatar:'🐴',
    city:'caoyuan', level:44, tier:'func',
    weapon:'wep_blood_saber', armor:'cs_ranger',
    silver:50,
    greetings:{
      hostile: '（巴图按住马刀）草原不欢迎来路不明的人，回去！',
      guarded: '草原人来者皆客，但巴图的毡包不是谁都能住的。先表明来意。',
      neutral:  '草原人不住旅舍，但汉人怕风，俺给你一顶毡包！大漠辽阔来者皆客，有什么需要尽管说。',
      friendly: '来了！你的马巴图给你喂好了草料。今晚炖了手把肉——草原上最好的待客之道！',
      close:    '（拉你到马群边）巴图有匹最好的腾云驹，从来不给人骑——但你例外。这匹马送你了，草原上它会救你的命。',
    },
    topics:[
      { id:'t_cy_inn_rest', text:'在毡包歇息（8两）', reply:'好，俺们的毡包比旅舍暖和！夜里还能听到狼嚎和马嘶，很特别的！', relDelta:5, action:'inn_rest' },
      { id:'t_cy_inn_king', text:'打听草原大汗', reply:'新大汗雄心勃勃，想统一各部落，还想南下。但俺觉得他太年轻，凡事急了没好下场。王庭那边玄冥教的人来往频繁，不知在商议什么。', relDelta:4, intelId:'intel_sect_secret' },
      { id:'t_cy_inn_horse', text:'了解草原骏马', reply:'草原上最好的马是腾云驹，速度可媲美中原的赤兔！大汗的坐骑就是腾云驹，不卖的。其他马也不差，来俺牧场看看！', relDelta:6 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  caoyuan_khan: {
    id:'caoyuan_khan', name:'铁木寒', role:'草原王庭勇士首领', category:'misc', avatar:'🐅',
    city:'caoyuan', level:70, tier:'elite',
    weapon:'wep_m_divine_spear', armor:'cs_ep_iron',
    silver:400,
    greetings:{
      hostile: '（铁木寒握紧弯刀）汉人武士？在草原王庭放肆——先问问俺的刀！',
      guarded: '能在草原上活下来就算有本事。你来王庭想立功还是找死？先说清楚。',
      neutral:  '草原上最强的不是兵器是意志！玄冥教的人说你是高手，铁木寒要亲自见识见识！',
      friendly: '（大笑拍肩）好样的！上次切磋你是草原上难得的对手。来，喝碗马奶酒，聊聊！',
      close:    '（收刀，罕见地认真）铁木寒半生征战，信得过的人不超过五个。你是其中之一。草原要变天了——你若愿意帮俺，俺把铁木寒家的全部势力交给你调配。',
    },
    topics:[
      { id:'t_cy_khan_spar', text:'切磋武艺', reply:'（握紧弯刀）中原高手！来！（激战后）哈！好手！草原上难得有对手，你算一个！', relDelta:12, action:'spar_fight' },
      { id:'t_cy_khan_alliance', text:'谈论中原与草原关系', reply:'中原人说俺们是蛮夷，但俺们的马术弓术，中原人永远学不会！双方若能不打仗，互通有无，岂不更好？只是大汗想建功立业，俺也拦不住。', relDelta:8 },
      { id:'t_cy_khan_xuanming', text:'打听玄冥教', reply:'玄冥教的人神出鬼没，说可以帮大汗，但俺不信任他们。他们修炼极寒功法，传说一掌能让人冻死。你若去极北，小心些！', relDelta:6, intelId:'intel_mingjiao_rise' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_mingjiao_rise'],
  },

  caoyuan_shaman: {
    id:'caoyuan_shaman', name:'塔娜花', role:'草原萨满祭司', category:'misc', avatar:'🌀',
    city:'caoyuan', level:38, tier:'func',
    weapon:'wep_uc_bamboo_staff', armor:'cs_cloth',
    silver:100,
    greetings:{
      hostile: '（塔娜花目光锐利）天神告诉我，你身上有血腥气。草原萨满不帮你。',
      guarded: '天神感召，塔娜花能感受到你身上的气运——但先说明来意。',
      neutral:  '天神感召！草原萨满与天地神灵相通，知晓过去未来。来，让塔娜花占卜一下你的命运！',
      friendly: '（微笑）你的气运比上次亮了。塔娜花为你求了一道平安符，随身带着，能辟邪。',
      close:    '（闭上双眼，声音颤抖）塔娜花占卜到了你未来的一个关键转折点……这件事只能告诉你一个人。但你必须做出选择，而无论选哪条路，代价都很大。',
    },
    topics:[
      { id:'t_cy_sha_divine', text:'请求占卜', reply:'（闭眼沉吟）天神告诉俺，你前方有大危险，但也有大机遇。若能逢凶化吉，必成一代豪杰！但关键在于：要信任真正的朋友！', relDelta:6 },
      { id:'t_cy_sha_herb', text:'购买草原药材', reply:'草原药材与中原不同，有些功效奇特！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_grassherb', icon:'🌿', name:'草原奇草', desc:'奇特药材，气血+25，内力+25', price:50, effect:{ hp:25, mp:25 } },
      { id:'item_wolf_bone', icon:'🦴', name:'狼骨粉', desc:'增强体魄，防御临时+6', price:45, effect:{ defBuff:6 } },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  日月城 NPCs  (major · 日月神教附属城镇)
  // ══════════════════════════════════════════════════════════

  riyue_city_inn: {
    id:'riyue_city_inn', name:'葛日升', role:'日月城旅舍掌柜', category:'misc', avatar:'☀',
    city:'riyue_city', level:34, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:70,
    greetings:{
      hostile: '（葛日升挡在门口）日月城不收可疑之人！客官请回。',
      guarded: '日月城与神教关系密切，来者要注意分寸。先付银子再说。',
      neutral:  '日月城繁华，来往教众和江湖人都在此歇脚！神教在招募高手，有兴趣可以去打听。',
      friendly: '来了！葛日升给你留着临街的雅间，能看到日月神教的巡逻——在这城里住着安全着呢。',
      close:    '（关上门压低声音）日升有桩事——神教最近在秘密搜查一个人，描述跟很像。你在这里的行踪日升帮你掩盖，但你自己也要小心。',
    },
    topics:[
      { id:'t_ryc_inn_rest', text:'住店一晚（10两）', reply:'好！日月城的夜晚有神教弟子巡逻，比一般城镇安全得多！', relDelta:5, action:'inn_rest' },
      { id:'t_ryc_inn_jiao', text:'打听日月神教近况', reply:'神教最近大量招人，各部门都在扩张。听说有重要行动在筹划，但具体是什么，俺这小掌柜哪知道！', relDelta:4, intelId:'intel_mingjiao_rise' },
      { id:'t_ryc_inn_route', text:'询问附近地形', reply:'往东南走就是日月神教总坛，一般人进不去。往北是开封，往西是汝州。本城表面上是普通城镇，实际上神教的眼线遍布！', relDelta:3 },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels: ['intel_mingjiao_rise'],
  },

  riyue_city_agent: {
    id:'riyue_city_agent', name:'黑风使', role:'日月神教暗探', category:'misc', avatar:'🌙',
    city:'riyue_city', level:52, tier:'major',
    weapon:'wep_dark_knife', armor:'cs_assassin',
    silver:250,
    greetings:{
      hostile: '（黑风使杀意涌动）日月神教暗探的眼睛无处不在，阁下最好老实点。',
      guarded: '日月神教威震天下。阁下来此，可是有意入教？先证明你的价值。',
      neutral:  '教主法旨，俺等奉命行事，无须多问。你的武功有些意思——教中正缺这样的人才。',
      friendly: '（点头）你的表现教主已经知道了。黑风使替你在教中说了好话——往后在日月城，没人敢动你。',
      close:    '（四周无人时才开口）黑风使有自己的情报网，不完全听命于教主。有桩事想私下托你——教内有人想对教主动手，暗探不能明着查。你若愿意帮忙，黑风使欠你一条命。',
    },
    topics:[
      { id:'t_ryc_agent_join', text:'询问加入神教', reply:'入教须经考核，展示武功，通过者方可入门。入教后有神教保护，同门皆可相助，但教规森严，不得违背教主命令！', relDelta:6 },
      { id:'t_ryc_agent_intel', text:'打听神教内情', reply:'（审视你）你想知道什么？…俺也只知道表面。神教分日月两部，光明左右使统领各部。教主的命令，无人敢违！', relDelta:4, intelId:'intel_mingjiao_rise' },
      { id:'t_ryc_agent_spar', text:'切磋武艺', reply:'（眸光一冷）好，教中正需要评估各路好手的实力！（较量后）不错，你确实有两下子！', relDelta:8, action:'spar_fight' },
    ],
    shop: null,
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_mingjiao_rise'],
  },

  riyue_city_smith: {
    id:'riyue_city_smith', name:'卫锻霞', role:'神教专属铁匠', category:'blacksmith', avatar:'⚒',
    city:'riyue_city', level:47, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:120,
    greetings:{
      hostile: '（卫锻霞锤子一顿）神教专属铁铺不招待闹事的人！',
      guarded: '神教兵器质量保证，但外人也要付公道价钱。先亮银子。',
      neutral:  '神教的兵器都是卫锻霞打造的，日月两色兵器是拿手绝活！外人也可以买，价格公道。',
      friendly: '来了！你上次订的那把匕首锻霞给你做了个改良——刀刃更薄更利。老熟人不加钱！',
      close:    '（从暗柜取出一柄日月双刀）这是锻霞花了三个月偷偷打的——教规不许外售日月双刀，但你是例外。收好了，别让人看见。',
    },
    topics:[
      { id:'t_ryc_smith_identify', text:'🔍 鉴定装备（收费）', reply:'神教的铁匠，眼力不会差。把东西拿来俺瞧瞧。', relDelta:0, action:'identify_equip' },
      { id:'t_ryc_smith_special', text:'打听特制武器', reply:'神教专用的日月双刀和乾坤双鞭是俺负责维护的，但那些不对外售卖，只有教中高手才配用！', relDelta:4 },
    ],
    shop:{ items:[
      { id:'item_riyue_blade', icon:'⚔', name:'日月匕首', desc:'神教样式匕首，锋利精巧', price:80, effect:{ atkBuff:6 } },
      { id:'item_moon_elixir', icon:'🌙', name:'月华丹', desc:'内力修复，精力+30', price:40, effect:{ energy:30 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon'],
    intels: ['intel_sect_secret'],
  },

  // 日月神教·圣火女祭司
  riyue_city_priestess: {
    id:'riyue_city_priestess', name:'圣火花媛', role:'日月神教圣火女祭司', category:'misc', avatar:'🔥',
    city:'riyue_city', level:55, tier:'major',
    weapon:'wep_silver_needle', armor:'cs_robe',
    silver:280,
    greetings:{
      hostile: '（圣火摇曳，花媛目光冰冷）圣火照善恶——你身上有阴暗之气，花媛不欢迎。',
      guarded: '日月光明善恶皆照。外人来到圣火台须过花媛这一关——先证明你的心性。',
      neutral:  '圣火照耀明王庇佑。花媛负责净化与治愈，但也懂得惩戒之道。来朝拜还是有所求？',
      friendly: '（微笑）圣火感应到了你心性的变化——比初见时纯净了许多。来，花媛为你做一次净化。',
      close:    '（在圣火前低声）花媛看到了你的命运与圣火的交织……有些事只能告诉你。教主最近在追查一件关系到教中根基的旧事——而你，是关键。',
    },
    topics:[
      { id:'t_ryc_pri_heal', text:'请求治疗', reply:'圣火有净化之力，花媛可为你消除体内的毒和暗伤。', relDelta:5, action:'open_shop' },
      { id:'t_ryc_pri_ritual', text:'打听教中仪式', reply:'圣火节每月初一举行，教众在圣火台前起誓，以日月为证。外人无缘得见，但你……或许可以破例。', relDelta:8, intelId:'intel_sect_secret' },
      { id:'t_ryc_pri_skill', text:'学习教中心法', reply:'圣火心法非教众不传，但花媛可以教你一些护体的基础修炼……', relDelta:3, action:'go_skills' },
    ],
    shop:{ items:[
      { id:'item_holy_fire_pill', icon:'🔥', name:'圣火净化丹', desc:'解毒+气血+50+内力+30', price:60, effect:{ hp:50, mp:30, detox:true } },
      { id:'item_sun_charm',     icon:'☀', name:'日华符', desc:'日月神教护身符，精力+25', price:35, effect:{ energy:25 } },
    ]},
    quests:['quest_sect_mission','quest_monk_demon_banish','quest_daily_temple_errand','quest_gossip_fake_patient'],
    intels: ['intel_sect_secret','intel_mingjiao_rise'],
  },

  // ══════════════════════════════════════════════════════════

});
