// npc-data-sects.js — 所有门派据点 NPC
// 自动从 npc-data.js 拆分生成

Object.assign(NPC_DB, {
  // ══════════════════════════════════════════════════════════
  //  少林寺·藏经阁 NPCs  (sect · 嵩山 · 佛系武学)
  // ══════════════════════════════════════════════════════════

  shaolin_abbot: {
    id:'shaolin_abbot', name:'玄慈方丈', role:'少林寺方丈', category:'sect', avatar:'☸',
    city:'shaolin_temple', level:75, tier:'elite',
    weapon:'wep_uc_bamboo_staff', armor:'cs_lg_shaolin',
    silver:400,
    greetings:[
      '阿弥陀佛，善哉善哉。少林寺千年古刹，不为争名逐利，只为普度众生。',
      '施主远道而来，必有因缘。少林武学以佛为心、以武为用，非有大慧者不能参透。',
      '七十二绝技，每一项都需数十年苦修。施主若想学，先问自己——吃得了这份苦吗？',
    ],
    greetingOverrides:[
      {
        requiresSect:'shaolin',
        greetings:{
          hostile:'（冷冷扫你一眼）你既已入我少林，便当守少林清规。若犯门规，休怪老衲不念旧情。',
          guarded:'（微微颔首）少林弟子来访，难得。坐下喝杯茶，有何修行上的疑惑？',
          neutral:'（双手合十）阿弥陀佛。既是少林弟子，便是一家人。老衲今日正要考校一下你的少林功夫进展如何。',
          friendly:'（微微一笑）你回来了少林。近来江湖动静不小，本寺也有几件事需要弟子出力，你有空吗？',
          close:'（挥手示意）来，坐下。不用多礼——你是少林弟子，老衲便是你师父。有何心得尽管说来。',
        },
      },
    ],
    topics:[
      { id:'sl_abbot_join', text:'拜师入门', reply:'（目光如炬，打量你许久）施主既有向佛之心，少林寺自当敞开山门。但入我门需先过三关试炼——若能通过，便是我佛门弟子。', relDelta:5, action:'join_sect' },
      { id:'sl_abbot_teach', text:'请教少林武学', reply:'少林武学讲究"禅武合一"。每一招都是佛法在肢体上的体现，不是打斗的技巧，而是修心的法门。悟性够了，招式自然就通了！', relDelta:10, action:'train_skill' },
      { id:'sl_abbot_spar', text:'切磋武艺', reply:'（单掌立胸）请！（较量后）施主根基扎实，是个练武的好苗子！若有缘，可常来少林走动。', relDelta:12, action:'spar_fight' },
      { id:'sl_ablot_buddha', text:'请教佛法', reply:'佛法浩瀚如海，贫僧修行七十载也不过窥得沧海一粟。但有一点可以告诉施主——放下执念，便是通途。武功亦然，太过执着于胜负，反失武学真谛。', relDelta:8 },
      { id:'sl_ablot_manual', text:'求购佛门秘籍', reply:'（沉吟片刻）少林藏经阁所藏典籍，从不外传。但……施主若诚心想学佛门功夫，入门残卷倒可以结缘，更高深的需看资质与缘分。', relDelta:6, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_bd_frag1',    icon:'📜', name:'少林入门残卷',   desc:'【佛系残卷】解锁罗汉拳第一式',     price:260, effect:{ manual:'m_bd_frag1' } },
      { id:'m_bd_partial1', icon:'📗', name:'罗汉拳残本',     desc:'【佛系残本】解锁2式护体功法',       price:420, effect:{ manual:'m_bd_partial1' } },
      { id:'m_bd_complete1',icon:'📘', name:'金刚经完本',     desc:'【佛系完本】解锁3式佛门绝学(需大成)',price:720, effect:{ manual:'m_bd_complete1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_shaolin_1',
      topic: { id:'sl_chain_main', text:'【门派任务】达摩院密令', reply:'阿弥陀佛。你既是少林弟子，老衲有一要事相托——此事关乎少林存亡，亦关乎整个正道武林……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  shaolin_disciple: {
    id:'shaolin_disciple', name:'慧能', role:'少林寺弟子', category:'sect', avatar:'🙏',
    city:'shaolin_temple', level:35, tier:'func',
    weapon:'wep_iron_fist', armor:'cs_monk_robe',
    silver:60,
    greetings:[
      '阿弥陀佛，师兄有礼！小僧慧能，在此守护藏经阁。',
      '师父说了，来访者以礼相待。师兄有什么需要帮忙的吗？',
    ],
    topics:[
      { id:'sl_disc_spar', text:'切磋拳脚', reply:'（拱手）请师兄指教！（较量后）师兄好功夫，小僧佩服！', relDelta:7, action:'spar_fight' },
      { id:'sl_disc_buy', text:'购买寺中物资', reply:'寺里的素斋和药材都是上品，师兄看看需要什么？', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_shaolin_bread', icon:'🍞', name:'少林素饼', desc:'粗粮素斋，饱食度+40', price:15, effect:{ food:40 } },
      { id:'item_shaolin_tea', icon:'🍵', name:'少林禅茶', desc:'清心醒脑，精力+25', price:30, effect:{ energy:25 } },
    ]},
    quests:['quest_sect_mission','quest_dojo_challenge','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  武当派·金殿 NPCs  (sect · 武当山 · 道系武学)
  // ══════════════════════════════════════════════════════════

  wudang_taoist: {
    id:'wudang_taoist', name:'冲虚道长', role:'武当掌教', category:'misc', avatar:'☯',
    city:'wudang_mountain', level:68, tier:'elite',
    weapon:'wep_uc_bamboo_staff', armor:'cs_lg_wudang',
    silver:350,
    greetings:[
      '无量天尊。武当山乃清修之地，道法自然，不染尘埃。',
      '太极拳法，以柔克刚，四两拨千斤。来者若是同道中人，不妨一叙。',
      '道家武学不在招式，而在"道"。悟了道，草木竹石皆可为兵器；未悟道，神兵利器也枉然。',
    ],
    greetingOverrides:[
      {
        requiresSect:'wudang',
        greetings:{
          hostile:'（拂尘轻扫）入了武当门，便该守武当规。若行差踏错，老道不会姑息。',
          guarded:'（打量片刻）你便是新入门的那位？嗯……根骨尚可。来，坐下说话。',
          neutral:'（轻摇拂尘）无量天尊。既然已是武当弟子，便是道门中人。老道今日正好有空，可指点你一二。',
          friendly:'（微微一笑）你来了。老道刚泡了一壶武当道茶，你也来一杯，近来修行可有心得？',
          close:'（挥拂尘示意）不必多礼，坐。你我已是同门，有何疑难直说便是。',
        },
      },
    ],
    topics:[
      { id:'wd_taoist_join', text:'拜师入门', reply:'（轻摇拂尘）武当收徒，首重德行，次重悟性。道友若有意入我门，便先过一遭切磋考验吧。', relDelta:5, action:'join_sect' },
      { id:'wd_taoist_teach', text:'请教武当道法', reply:'太极者，无极而生，动静之机，阴阳之母。武当武学的根基在于理解阴阳转化——刚不可久，柔不可守，变化才是永恒。', relDelta:10, action:'train_skill' },
      { id:'wd_taoist_spar', text:'切磋武艺', reply:'（轻摇拂尘）请。（推手之间将人轻轻弹出数丈）太极之道，借力打力。施主还需多悟！', relDelta:12, action:'spar_fight' },
      { id:'wd_taoist_dao', text:'谈论道家思想', reply:'道法自然，不是什么都不做，而是顺应万物本性而为。就像水——它不与岩石硬碰，却能穿透一切。武学同理。', relDelta:7 },
      { id:'wd_taoist_manual', text:'求购道门秘籍', reply:'（抚须微笑）道门典籍讲究缘分。不过看施主根骨不错，几本基础功法的抄本倒是可以割爱。', relDelta:6, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_ta_frag1',    icon:'📜', name:'太极基础残卷',   desc:'【道系残卷】解锁太极第一式',         price:250, effect:{ manual:'m_ta_frag1' } },
      { id:'m_ta_partial1', icon:'📗', name:'道门心法残本',   desc:'【道系残本】解锁2式以柔制刚之法',   price:400, effect:{ manual:'m_ta_partial1' } },
      { id:'m_ta_complete1',icon:'📘', name:'玄真道经完本',   desc:'【道系完本】解锁3式天人合一之术(需大成)',price:700, effect:{ manual:'m_ta_complete1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_wudang_1',
      topic: { id:'wd_chain_main', text:'【门派任务】清虚失踪', reply:'无量天尊。清虚师弟已失踪三日，武当上下忧心忡忡。你是武当弟子，此事关乎我派存亡……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  wudang_disciple: {
    id:'wudang_disciple', name:'青松', role:'武当道童', category:'misc', avatar:'🎋',
    city:'wudang_mountain', level:28, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_scholar',
    silver:50,
    greetings:[
      '无量天尊！这位居士是来拜访家师的吗？',
      '武当山上清净得很，道童青松给居士引路。',
    ],
    topics:[
      { id:'wd_disc_spar', text:'切磋太极', reply:'（行礼）请居士赐教！（较量后）居士的功夫很有意思，不像正统道家路数呢！', relDelta:6, action:'spar_fight' },
      { id:'wd_disc_buy', text:'购买山中特产', reply:'武当山的药材和丹丸都是师父亲自炼制的，效果很好！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_wudang_pill', icon:'💊', name:'武当丹丸', desc:'道家炼制，气血+35，内力+20', price:55, effect:{ hp:35, mp:20 } },
      { id:'item_wudang_tea', icon:'🍵', name:'武当道茶', desc:'清心明目，精力+30', price:25, effect:{ energy:30 } },
    ]},
    quests:['quest_sect_mission','quest_dojo_challenge','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  华山派·思过崖 NPCs  (sect · 华山 · 剑系武学)
  // ══════════════════════════════════════════════════════════

  huashan_swordmaster: {
    id:'huashan_swordmaster', name:'岳怀瑾', role:'华山剑宗宗主', category:'misc', avatar:'⚔',
    city:'huashan_mountain', level:58, tier:'major',
    weapon:'wep_uc_sword', armor:'cs_ep_sword',
    silver:300,
    greetings:[
      '华山论剑，天下英雄谁敢不服？阁下能登上北峰，已是不凡！',
      '华山剑法分两支——气宗以气御剑，剑宗以剑御气。老夫修的是剑宗，信奉"剑在人在"！',
      '（擦拭长剑）这把剑跟随老夫三十年，饮血无数。阁下的剑，又有多少故事？',
    ],
    greetingOverrides:[
      {
        requiresSect:'huashan',
        greetings:{
          hostile:'（冷冷拔剑）华山的规矩你都忘了？回去把门规抄一百遍再来见老夫！',
          guarded:'（上下打量）你是新来的华山弟子？嗯……根骨不错，但离老夫的要求还差得远。',
          neutral:'（微微点头）既然入了华山，便是华山的人。老夫今日正好有空，来切磋两招？',
          friendly:'（收起剑）你来了华山这些日子，剑法可有长进？来，坐下说说。',
          close:'（放下长剑）自己人，不客气了。有什么心得，拿出来让老夫看看。',
        },
      },
    ],
    topics:[
      { id:'hs_sm_join', text:'拜师入门', reply:'（目光锐利）华山派以剑立门，收徒极严。想学剑？先让老夫看看你的剑心够不够坚定。', relDelta:5, action:'join_sect' },
      { id:'hs_sm_teach', text:'请教华山剑法', reply:'华山剑法讲究一个"快"字——天下武功唯快不破！但快不是乱快，而是每一剑都恰到好处，多一分则过，少一分不及。', relDelta:10, action:'train_skill' },
      { id:'hs_sm_spar', text:'切磋剑法', reply:'（拔剑）来！（剑光闪烁间已出三十六招）华山剑法如何？（较量后）不错，你能接住老夫三成剑意！', relDelta:12, action:'spar_fight' },
      { id:'hs_sm_sword', text:'谈论剑道', reply:'剑道有三境：手中之剑、心中之剑、无剑之剑。大多数人终其一生只在第一境徘徊。能达到第二境者百里挑一。第三境……老夫也在摸索！', relDelta:9 },
      { id:'hs_sm_manual', text:'求购华山剑典', reply:'（目光如炬）想学华山剑法？哼，多少人攀华山就为这一目的！不过……看你骨骼惊奇，卖你几本入门剑谱倒也无妨。高深剑典需看你日后造化！', relDelta:6, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_sw_frag1',    icon:'📜', name:'剑法基础残卷',   desc:'【剑系残卷】解锁剑气斩初式',           price:240, effect:{ manual:'m_sw_frag1' } },
      { id:'m_sw_partial1', icon:'📗', name:'剑宗秘要残本',   desc:'【剑系残本】解锁2式犀利剑招',           price:380, effect:{ manual:'m_sw_partial1' } },
      { id:'m_sw_complete1',icon:'📘', name:'御风剑典完本',   desc:'【剑系完本】解锁3式进阶剑招(需大成)',   price:680, effect:{ manual:'m_sw_complete1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_huashan_1',
      topic: { id:'hs_chain_main', text:'【门派任务】剑气之争', reply:'华山附近山匪横行，岳掌门正为此烦心。你既是华山弟子，何不下山一试身手？顺便查查这些山匪的真正来历……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  huashan_disciple: {
    id:'huashan_disciple', name:'令狐儿', role:'华山派弟子', category:'sect', avatar:'⚡',
    city:'huashan mountain', level:32, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:70,
    greetings:[
      '华山派以剑立派！师兄也是使剑的高手吗？',
      '师父说了，上山来的都是有缘人，要以礼相待！',
    ],
    topics:[
      { id:'hs_disc_spar', text:'切磋剑术', reply:'（抱拳）请师兄指教！（较量后）好剑法！不知道师兄是哪一门派的？', relDelta:7, action:'spar_fight' },
      { id:'hs_disc_buy', text:'购买华山物资', reply:'华山的药草和干粮都是我们从山下带上来的，不多但精！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_huashan_wine', icon:'🍶', name:'华山清酒', desc:'华山酿造，士气提升，气血+25', price:35, effect:{ hp:25 } },
      { id:'item_huashan_herb', icon:'🌿', name:'华山灵芝', desc:'悬崖采撷，气血+50', price:65, effect:{ hp:50 } },
    ]},
    quests:['quest_sect_mission','quest_dojo_challenge','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  明教·圣火大殿 NPCs  (sect · 波斯明教 · 火系武学)
  // ══════════════════════════════════════════════════════════

  mingjiao_flamelord: {
    id:'mingjiao_flamelord', name:'范遥', role:'明教光明右使', category:'misc', avatar:'🔥',
    city:'mingjiao_flamehall', level:66, tier:'major',
    weapon:'wep_flame_blade', armor:'cs_lg_mingjiao',
    silver:350,
    greetings:[
      '圣火令出，谁敢不从！阁下闯入明教总坛，是敌是友？',
      '明教虽被江湖人视为邪派，但俺们做的事——抗元救民——可比那些伪君子正派得多！',
      '（把玩手中火焰）圣火不灭，明教不死！你想怎么个死法？……开个玩笑，说吧，什么事？',
    ],
    greetingOverrides:[
      {
        requiresSect:'mingjiao',
        greetings:{
          hostile:'（火焰一窒）明教弟子？哼……俺也去把你当外人了是不是？回去给俺想清楚再回来！',
          guarded:'（打量你）你就是新入门那几个？有点意思，但还不够格——明教不养废物。',
          neutral:'（火焰跳动）既然是明教兄弟，便是一家人！坐下，俺也去弄点西域葡萄酒来喝！',
          friendly:'（哈哈大笑）你来了！圣火不灭——兄弟，来，坐下说话！明教上下都念着你的好！',
          close:'（拍桌）自己兄弟！别站着了，俺也去给你倒酒，坐下聊聊有什么打算！',
        },
      },
    ],
    topics:[
      { id:'mj_fl_join', text:'拜师入门', reply:'（眼中闪过一丝兴趣）想入明教？好！圣火不拒有志之人。先过俺的火焰试炼，活下来的就是兄弟！', relDelta:5, action:'join_sect' },
      { id:'mj_fl_teach', text:'请教明教武学', reply:'明教圣火功以"烈"为核——燃尽一切阻碍！修炼时需引火入体，初学者容易烧伤经脉，所以必须从控火的基本功练起！', relDelta:10, action:'train_skill' },
      { id:'mj_fl_spar', text:'切磋武艺', reply:'（周身燃起火焰）小心烧到了！（较量后）哈哈！有意思，你的内力居然能抵住圣火灼烧！', relDelta:12, action:'spar_fight' },
      { id:'mj_fl_yuan', text:'了解明教历史', reply:'明教源自波斯，唐时传入中原。历代教主皆以驱除鞑虏、恢复中华为己任。但正道容不下我们，说俺们信的是"火魔"……哼！', relDelta:8, intelId:'intel_mingjiao_rise' },
      { id:'mj_fl_manual', text:'求购明教秘籍', reply:'（冷笑）明教的功夫外人学了也没用——没有圣火体质，强行修炼会自焚而死！但你若执意要买……价格翻倍！', relDelta:5, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_fi_frag1',    icon:'📜', name:'炎拳入门残卷',   desc:'【火系残卷】解锁炎拳第一式',             price:280, effect:{ manual:'m_fi_frag1' } },
      { id:'m_fi_partial1', icon:'📗', name:'烈火心法残本',   desc:'【火系残本】解锁2式攻守兼备火焰功法',   price:450, effect:{ manual:'m_fi_partial1' } },
      { id:'m_fi_complete1',icon:'📘', name:'圣火令功法完本', desc:'【火系完本】解锁3式烈焰如龙(需大成)',   price:750, effect:{ manual:'m_fi_complete1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_mingjiao_rise'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_mingjiao_1',
      topic: { id:'mj_chain_main', text:'【门派任务】圣火抉择', reply:'圣火令出，谁敢不从！明教面临抉择——是加入三魔联盟，还是保持独立？你是明教弟子，此事关乎明教未来……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  mingjiao_guard: {
    id:'mingjiao_guard', name:'韦一笑', role:'明教青翼蝠王', category:'misc', avatar:'🦇',
    city:'mingjiao_flamehall', level:48, tier:'func',
    weapon:'wep_dark_knife', armor:'cs_assassin',
    silver:120,
    greetings:[
      '（身影一闪即至）嘿嘿，你的速度太慢了，连老蝙蝠的影子都摸不到！',
      '明教总坛禁地，闲人免进。除非……你有教主的手令？',
    ],
    topics:[
      { id:'mj_guard_spar', text:'比试身法', reply:'（眨眼间绕到你身后）追不上吧？（较量后）嘿，你比一般人强多了，居然能看到我的残影！', relDelta:9, action:'spar_fight' },
      { id:'mj_guard_buy', text:'购买明教物资', reply:'西域传来的东西，外面可买不到！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_mingjiao_oil', icon:'🫒', name:'波斯火油', desc:'易燃之物，可用于战斗', price:45, effect:{} },
      { id:'item_mingjiao_wine', icon:'🍷', name:'葡萄酒', desc:'西域美酒，精力+30，气血+20', price:55, effect:{ energy:30, hp:20 } },
    ]},
    quests:['quest_sect_mission','quest_dojo_challenge','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  唐门·暗器总堂 NPCs  (sect · 四川 · 天下第一暗器)
  // ══════════════════════════════════════════════════════════

  tangmen_elder: {
    id:'tangmen_elder', name:'唐烈风', role:'唐门三老之一', category:'misc', avatar:'💀',
    city:'tangmen_hall', level:62, tier:'major',
    weapon:'wep_dark_knife', armor:'cs_assassin',
    silver:350,
    greetings:[
      '唐门的规矩，外人不得入内。你有什么本事，能闯进这里？',
      '天下第一暗器，可不是吹出来的！进门的人，不死也要脱层皮！',
      '进来了就别想轻易出去，除非你够格成为唐门的人！',
    ],
    topics:[
      { id:'tm_elder_join', text:'拜师入门', reply:'（冷眼打量）唐门不轻易收徒。你若真想学暗器之术，先过俺三关试炼——过了，老夫亲自教你第一课。', relDelta:5, action:'join_sect' },
      { id:'t_tm_elder_sect', text:'拜访唐门', reply:'唐门不轻易收外人。若想学暗器之术，先证明自己的武功底子，否则暗器学了也是浪费！', relDelta:5 },
      { id:'t_tm_elder_teach', text:'请教暗器心法', reply:'唐门暗器讲究"快、准、毒"三字。速度决定生死，准度决定效果，毒性决定结局。三者缺一不可！', relDelta:8, action:'train_skill' },
      { id:'t_tm_elder_spar', text:'切磋武艺', reply:'（从袖中飞出三枚银针）先接住俺的三针再说！（较量后）还不错，进门的资格有了！', relDelta:10, action:'spar_fight' },
      { id:'t_tm_elder_manual', text:'求购武学秘籍', reply:'唐门秘技，向来不外传。但若你肯出重金……（压低声音）暗系和毒系的入门典籍，老夫手中倒有几本。', relDelta:6, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_sh_frag1',    icon:'📜', name:'夜行残卷',     desc:'【暗系残卷】解锁：暗器快袭第一式', price:280, effect:{ manual:'m_sh_frag1' } },
      { id:'m_sh_partial1', icon:'📗', name:'影刺残本',     desc:'【暗系残本】解锁2式影杀绝技', price:450, effect:{ manual:'m_sh_partial1' } },
      { id:'m_po_partial1', icon:'📗', name:'蛊毒秘法残本', desc:'【毒系残本】解锁2式蛊毒功法', price:380, effect:{ manual:'m_po_partial1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_tangmen_1',
      topic: { id:'tm_chain_main', text:'【门派任务】唐门危机', reply:'唐门收到血骨门的威胁信——要么效命，要么灭门。唐门从不屈服于任何势力，此事关乎唐门存亡……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  tangmen_merchant: {
    id:'tangmen_merchant', name:'唐心机', role:'唐门外堂商人', category:'shop', avatar:'🎯',
    city:'tangmen_hall', level:38, tier:'func',
    weapon:'wep_dark_knife', armor:'cs_cloth',
    silver:200,
    greetings:[
      '唐门的暗器，外面可买不到！来这里就是有缘人，尽管挑！',
      '我们唐门做生意也是一把好手，价格公道童叟无欺！',
    ],
    topics:[
      { id:'t_tm_mer_poison', text:'了解唐门毒药', reply:'唐门毒药分三类：速毒（秒杀）、慢毒（消耗）、迷毒（控制）。最厉害的是百年毒王，但那是唐门最高机密，不外传！', relDelta:5 },
    ],
    shop:{ items:[
      { id:'item_tang_needle', icon:'🪡', name:'唐门飞针', desc:'精巧暗器，远程攻击+12', price:60, effect:{ atkBuff:12 } },
      { id:'item_tang_antidote', icon:'💊', name:'唐门解毒丸', desc:'解百毒，气血+30', price:80, effect:{ hp:30 } },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  峨眉派·金顶禅院 NPCs  (sect · 四川 · 白衣女侠)
  // ══════════════════════════════════════════════════════════

  emei_elder: {
    id:'emei_elder', name:'圆真师太', role:'峨眉派住持', category:'misc', avatar:'🌺',
    city:'emei_sect', level:63, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_monk_robe',
    silver:200,
    greetings:[
      '峨眉派以慈悲为怀，但邪恶之徒当前，峨眉剑法绝不手软！',
      '阁下气质不俗，是有缘人。峨眉山清净，静心修炼最佳！',
      '倚天神剑法，守护苍生。你来此有何因缘？',
    ],
    greetingOverrides:[
      {
        requiresSect:'emei',
        greetings:{
          hostile:'（冷眼扫过）峨眉弟子，该知道什么该做、什么不该做。下次再犯，门规处置。',
          guarded:'（合十）你是新入门的弟子？嗯……峨眉看重心性，武功其次。慢慢来吧。',
          neutral:'（微微颔首）既然入了峨眉，便是佛门弟子。老尼今日有空，可指点你峨眉剑法一二。',
          friendly:'（微微一笑）你来了峨眉这些日子，可有什么心得？坐下喝茶，老尼正好有话想跟你说。',
          close:'（招手）不必多礼。有什么困惑，直接问便是。',
        },
      },
    ],
    topics:[
      { id:'em_elder_join', text:'拜师入门', reply:'（合十）峨眉派收徒虽重女眷，但不拒有缘男客做外门居士。你若有心向善习剑，便先过老尼一关试炼吧。', relDelta:5, action:'join_sect' },
      { id:'t_em_elder_teach', text:'请教峨眉武学', reply:'峨眉武学融合佛法与剑道，以慈悲心运剑，一招一式皆有大义。心不正者，学了也是邪功！', relDelta:8, action:'train_skill' },
      { id:'t_em_elder_quest', text:'询问可有差事', reply:'峨眉派最近需要人去调查山下草药被盗之事，若有意帮忙，峨眉愿以武学指点相酬。', relDelta:5 },
      { id:'t_em_elder_intel', text:'了解江湖大势', reply:'五毒教近来动静颇大，据情报在南方加紧布置。峨眉派已派出弟子暗中跟踪，若有所获会告知盟友。', relDelta:6, intelId:'intel_poison_cult' },
      { id:'t_em_elder_manual', text:'求购武学秘籍', reply:'（合十）施主有向善之心，老尼可将峨眉剑经与圣法典籍传授于你，但望你以武行善，切勿作恶！', relDelta:8, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_sw_frag1',    icon:'📜', name:'剑法基础残卷', desc:'【剑系残卷】解锁剑气斩初式', price:200, effect:{ manual:'m_sw_frag1' } },
      { id:'m_ho_frag1',    icon:'📜', name:'圣光残卷',     desc:'【圣系残卷】解锁圣光第一式', price:260, effect:{ manual:'m_ho_frag1' } },
      { id:'m_sw_partial1', icon:'📗', name:'剑宗秘要残本', desc:'【剑系残本】解锁2式利剑绝招', price:360, effect:{ manual:'m_sw_partial1' } },
      { id:'m_ho_partial1', icon:'📗', name:'天使奥义残本', desc:'【圣系残本】解锁2式圣门功法', price:380, effect:{ manual:'m_ho_partial1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_poison_cult'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_emei_1',
      topic: { id:'em_chain_main', text:'【门派任务】五毒教异动', reply:'阿弥陀佛。近期五毒教频繁活动，恐有图谋。峨眉弟子，你可愿下山查探一番？（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  emei_disciple: {
    id:'emei_disciple', name:'白雪儿', role:'峨眉派弟子', category:'sect', avatar:'⚔',
    city:'emei_sect', level:43, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:100,
    greetings:[
      '峨眉弟子在此修炼，俗家人请勿擅闯禁地！',
      '师父说了，有缘人来峨眉，以礼相待。你是有缘人么？',
    ],
    topics:[
      { id:'t_em_disc_spar', text:'切磋武艺', reply:'（微微低眉）请吧！（较量后）你的武功确实不凡，难怪有缘上山！', relDelta:8, action:'spar_fight' },
      { id:'t_em_disc_herb', text:'购买药材', reply:'峨眉山的草药极有灵气，用于治伤效果极好！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_emei_herb', icon:'🌸', name:'峨眉灵草', desc:'金顶灵气浸染，气血+45', price:65, effect:{ hp:45 } },
      { id:'item_emei_incense', icon:'🧘', name:'峨眉禅香', desc:'安神净心，内力+40', price:70, effect:{ mp:40 } },
    ]},
    quests:['quest_sect_mission','quest_dojo_challenge','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_cultivation_tip'],
  },

  // 峨眉·女剑士（护山执剑）
  emei_swordswoman: {
    id:'emei_swordswoman', name:'凌霜剑姬', role:'峨眉执法剑使', category:'misc', avatar:'❄',
    city:'emei_sect', level:62, tier:'major',
    weapon:'wep_uc_sword', armor:'cs_scholar',
    silver:250,
    greetings:[
      '凌霜剑，三百年前由峨眉祖师所创，以霜雪为意象，一剑封喉，绝不留情！',
      '俺是峨眉的执法使，负责处置门中违规和外来侵扰——你来意不明，先说清楚。',
      '峨眉女儿不是花瓶，我们的剑，比任何人都要利！',
    ],
    greetingOverrides:[
      {
        requiresSect:'emei',
        greetings:{
          hostile:'（冷哼）峨眉弟子，敢犯门规？凌霜剑不留情！',
          guarded:'（打量）你是新入门的峨眉弟子？嗯……根骨不错，但凌霜剑不是那么好学的。',
          neutral:'（微微点头）既然入了峨眉，便是同门。有什么事？',
          friendly:'（收起剑）你回来了峨眉。凌霜剑法可有进展？来，坐下说话。',
          close:'（招手）自己人，不客气了。有什么困惑，直接问便是。',
        },
      },
    ],
    topics:[
      { id:'em_sw_join', text:'拜师入门', reply:'冷眼扫过峨眉执法使不随便收徒。你若真想学凌霜剑法，先接俺三剑——挡住了再说入门的事。', relDelta:5, action:'join_sect' },
      { id:'t_em_sw_law', text:'了解峨眉规矩', reply:'峨眉不收男弟子，但可结善缘。来客须守规矩，不可在山中动武——除非你想和凌霜过过招。', relDelta:5 },
      { id:'t_em_sw_duel', text:'请教剑法', reply:'凌霜剑法非本派弟子不传，但俺可以演示一招……【一剑刺出，寒意逼人，剑花如冰晶飞散】', relDelta:10 },
      { id:'t_em_sw_task', text:'有没有任务', reply:'最近有人潜入后山，像是探查什么机密，你能帮我查清这些人的来路？', relDelta:8 },
    ],
    shop:{ items:[
      { id:'m_ho_frag1',    icon:'📜', name:'圣光残卷',       desc:'【圣系残卷】解锁圣光第一式',           price:260, effect:{ manual:'m_ho_frag1' } },
      { id:'m_sw_frag1',    icon:'📜', name:'剑法基础残卷',   desc:'【剑系残卷】解锁剑气斩初式',           price:220, effect:{ manual:'m_sw_frag1' } },
      { id:'item_emei_sword_oil', icon:'⚔', name:'剑锋保养油', desc:'凌霜剑专用，攻击+6',                price:45, effect:{ atkBuff:6 } },
    ]},
    quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'],
    intels: ['intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  逍遥仙境·逍遥派 NPCs  (sect · 天山 · 逍遥绝学)
  // ══════════════════════════════════════════════════════════

  xiaoyao_elder: {
    id:'xiaoyao_elder', name:'无忧子', role:'逍遥派长老', category:'sect', avatar:'🌀',
    city:'xiaoyao_grotto', level:112, tier:'func',
    weapon:'wep_m_ruyi', armor:'cs_lg_xiaoyao',
    silver:500,
    greetings:[
      '天高地远，逍遥自在！你能找到此地，本就是缘法不浅！',
      '逍遥派不在世俗江湖争斗，但不代表我们不知江湖事！',
      '北冥神功、凌波微步……你想学哪一门？',
    ],
    greetingOverrides:[
      {
        requiresSect:'xiaoyao',
        greetings:{
          hostile:'（眉头一皱）逍遥派虽无太多规矩，但你这般……罢了，下不为例。',
          guarded:'（打量片刻）你是新入门的孩子？嗯……有点意思，但逍遥之道在于忘我，你还差得远。',
          neutral:'（微微一笑）既然入了逍遥派，便是一家人。老夫这里不问俗事，你尽管逍遥自在。',
          friendly:'（招手）来了！天山风景正好，来坐下喝杯雪莲茶。老夫正要跟你说一件事——',
          close:'（拍拍身边）自己孩子，不客气了。有什么心事，尽管说，逍遥派不问恩怨，只问心意。',
        },
      },
    ],
    topics:[
      { id:'xy_elder_join', text:'拜师入门', reply:'（抚须微笑）逍遥派收徒，只看悟性，不看出身。你有心入我门？先让老夫看看你的本事。', relDelta:5, action:'join_sect' },
      { id:'t_xy_elder_teach', text:'请教逍遥武学', reply:'逍遥武学讲究"随心所欲"，不拘于招式，以意念引导内力，化万法为一体。这是境界，不能强求，需从日常感悟中领会！', relDelta:10, action:'train_skill' },
      { id:'t_xy_elder_world', text:'谈论天下大势', reply:'世间争斗，本是无解之局。强者寻强，弱者受欺，循环往复。逍遥派选择置身事外，但若苍生有难，我辈不能袖手！', relDelta:8 },
      { id:'t_xy_elder_secret', text:'请教逍遥心法', reply:'（沉默片刻）逍遥三老各守一方秘法，我守"北冥"，他守"凌波"，她守"小无相"。三法合一，方是完整的逍遥神功。只是……三老已久未相聚了。', relDelta:12, intelId:'intel_tianshu' },
      { id:'t_xy_elder_manual', text:'求购武学秘籍', reply:'秘籍乃逍遥武学根本，轻易不传外人。不过……你若有缘，出价足够，我可割爱几本入门典籍。', relDelta:6, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_wi_partial1', icon:'📗', name:'御风轻功残本', desc:'【风系残本】解锁：凌波微步+道法无形', price:380, effect:{ manual:'m_wi_partial1' } },
      { id:'m_ta_complete1', icon:'📘', name:'玄真道经完本', desc:'【道系完本】解锁3式道家绝学（需大成）', price:680, effect:{ manual:'m_ta_complete1' } },
      { id:'m_ic_partial1',  icon:'📗', name:'玄冥冰功残本', desc:'【冰系残本】解锁2式冰封功法', price:420, effect:{ manual:'m_ic_partial1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_tianshu'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_xiaoyao_1',
      topic: { id:'xy_chain_main', text:'【门派任务】逍遥秘事', reply:'逍遥派三老各守一方秘法，但数十年未曾相聚。你既入逍遥派，此事关乎我派传承……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  xiaoyao_healer: {
    id:'xiaoyao_healer', name:'水清儿', role:'逍遥派医者', category:'misc', avatar:'💧',
    city:'xiaoyao_grotto', level:77, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_scholar',
    silver:200,
    greetings:[
      '逍遥仙境，远离尘世。来者皆客，受伤了让俺来看看！',
      '天山雪莲，世间难得良药，在这里随处可见！',
    ],
    topics:[
      { id:'t_xy_heal_heal', text:'求医问诊', reply:'让俺看看……天山清气之地修炼的内力，对疗伤极有帮助，你会好得很快！', relDelta:5, action:'heal_hp' },
      { id:'t_xy_heal_herb', text:'购买天山药材', reply:'天山雪莲、千年冰参，皆是世间罕见之物！', relDelta:4, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_snow_lotus', icon:'❄', name:'天山雪莲', desc:'千年灵药，气血+60，内力+40', price:150, effect:{ hp:60, mp:40 } },
      { id:'item_ice_spring', icon:'💧', name:'天山冰泉水', desc:'清冽解毒，精力+35', price:60, effect:{ energy:35 } },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  五毒教·蛊毒圣地 NPCs  (sect · 苗疆 · 蛊毒绝学)
  // ══════════════════════════════════════════════════════════

  wudu_shaman: {
    id:'wudu_shaman', name:'毒凤凰', role:'五毒教圣女', category:'misc', avatar:'🐍',
    city:'wudu_sect', level:56, tier:'major',
    weapon:'wep_dark_knife', armor:'cs_scholar',
    silver:300,
    greetings:[
      '外来者，你是第几个闯进圣地的？前几个……都不太好。',
      '苗疆之毒，世间无解！你来这里，是找死还是学艺？',
      '五毒之学，以毒攻毒，知者乐，不知者惧。你是哪种？',
    ],
    topics:[
      { id:'t_wd_sha_poison', text:'了解五毒之学', reply:'五毒教的蛊术分五系：蜂毒、蛇毒、蜈毒、蟾毒、蝎毒。每系都有克制之法，但要克制必须先中过一次，极为凶险！', relDelta:6 },
      { id:'t_wd_sha_spar', text:'切磋武艺', reply:'（微笑，手边出现数只蝴蝶）来吧，这些蝴蝶能要人命！（较量后）有意思，你能全身而退，算是过了第一关！', relDelta:10, action:'spar_fight' },
      { id:'t_wd_sha_intel', text:'了解苗疆秘密', reply:'苗疆深处有上古神地，那里的药材千年难遇，但守护那些地方的古老生物极为凶猛，普通武人根本进不去！', relDelta:7, intelId:'intel_kunlun_sword' },
    ],
    shop:{ items:[
      { id:'m_sh_frag1',    icon:'📜', name:'夜行残卷',       desc:'【暗系残卷】解锁暗器快袭第一式',     price:300, effect:{ manual:'m_sh_frag1' } },
      { id:'m_qm_frag1',    icon:'📜', name:'奇门入门残卷',   desc:'【奇门残卷】解锁奇门遁甲第一式',     price:260, effect:{ manual:'m_qm_frag1' } },
      { id:'item_shadow_dart', icon:'🎯', name:'淬毒飞针',     desc:'五毒炼制，远程攻击+8',              price:65, effect:{ atkBuff:8 } },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_poison_cult'],
  },

  wudu_doctor: {
    id:'wudu_doctor', name:'苗婆婆', role:'五毒教医毒师', category:'misc', avatar:'🌿',
    city:'wudu_sect', level:37, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:150,
    greetings:[
      '毒蛊之地，寻常医术没用！老婆子的蛊术，毒伤什么都能治！',
      '中了毒来找俺，不然就算内力再强，也架不住五毒侵蚀！',
    ],
    topics:[
      { id:'t_wd_doc_heal', text:'解毒疗伤', reply:'让俺看看……用了什么毒？好，这种毒的解法老婆子知道！', relDelta:5, action:'heal_hp' },
      { id:'t_wd_doc_antidote', text:'购买解毒药', reply:'各种毒的解药都有，就是贵了些！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_wudu_antidote', icon:'🧪', name:'五毒总解丸', desc:'解百毒，气血+50', price:100, effect:{ hp:50 } },
      { id:'item_wudu_gu_water', icon:'🍵', name:'蛊虫培育水', desc:'奇异饮品，内力+50', price:80, effect:{ mp:50 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general'],
    intels: ['intel_poison_cult'],
  },

  // ══════════════════════════════════════════════════════════
  //  崆峒派·问道宫 NPCs  (sect · 甘肃 · 七伤拳)
  // ══════════════════════════════════════════════════════════

  kongtong_elder: {
    id:'kongtong_elder', name:'问道子', role:'崆峒派掌门', category:'sect', avatar:'🌪',
    city:'kongtong_peak', level:72, tier:'elite',
    weapon:'wep_m_chaos_bead', armor:'cs_lg_kongtong',
    silver:250,
    greetings:[
      '崆峒山顶，问道论武！你来此，是问道还是论武？',
      '七伤拳号称天下最刚猛之拳，练者先伤自身，才能伤人！',
      '道家武学讲究阴阳相济，刚柔并存。崆峒拳看似刚猛，实则有柔劲在其中！',
    ],
    greetingOverrides:[
      {
        requiresSect:'kongtong',
        greetings:{
          hostile:'（冷冷扫你一眼）崆峒门规你不是不知道，下去领罚！',
          guarded:'（打量片刻）新来的崆峒弟子？七伤拳的滋味尝过了吗？',
          neutral:'（微微颔首）既然入了崆峒，便是一家人。坐下，有什么修行上的困惑尽管问。',
          friendly:'（拍了拍你的肩）你来了！七伤拳练得怎么样了？来，坐下让本真人看看你的进境！',
          close:'（放下茶杯）自己弟子，不用客气。有什么需要，尽管说。',
        },
      },
    ],
    topics:[
      { id:'kt_elder_join', text:'拜师入门', reply:'（抱拳）崆峒派收徒，首重骨气！你若能接下我三招七伤拳，便有资格入我门墙。', relDelta:5, action:'join_sect' },
      { id:'t_kt_elder_teach', text:'请教崆峒拳法', reply:'七伤拳的真谛，在于先强化自身，再以最强状态出击！每练一次，自身受损一次，但也进步一次。此拳大成者，天下无敌，但也饱受内伤之苦！', relDelta:10, action:'train_skill' },
      { id:'t_kt_elder_spar', text:'切磋武艺', reply:'（摆起崆峒拳架）来！本真人已久未出手，今日看看你有几斤几两！（较量后）不错，来崆峒之人中难得的好手！', relDelta:12, action:'spar_fight' },
      { id:'t_kt_elder_intel', text:'了解西北局势', reply:'西北日月神教渗透极深，灵州已有其眼线。崆峒派虽在甘肃一隅，但消息灵通，近期西域各路人马异动，恐有大事！', relDelta:7, intelId:'intel_mingjiao_rise' },
      { id:'t_kt_elder_manual', text:'求购武学秘籍', reply:'（重重一拍桌子）要买秘籍？胆子不小！崆峒派的拳法和雷法，外人难得一见。你若真心学，出价吧！', relDelta:6, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_fx_frag1',    icon:'📜', name:'降龙残卷',     desc:'【拳系残卷】解锁降龙十八掌第一式', price:300, effect:{ manual:'m_fx_frag1' } },
      { id:'m_fo_partial1', icon:'📗', name:'铁血拳谱残本', desc:'【力系残本】解锁2式刚猛拳法', price:360, effect:{ manual:'m_fo_partial1' } },
      { id:'m_th_partial1', icon:'📗', name:'天雷功残本',   desc:'【雷系残本】解锁2式雷法绝技', price:420, effect:{ manual:'m_th_partial1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_mingjiao_rise'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_kongtong_1',
      topic: { id:'kt_chain_main', text:'【门派任务】西北异动', reply:'无量寿佛！日月神教近日在西北大规模活动，崆峒派地处西北，此事关乎我派存亡，你可愿下山查探？（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  kongtong_disciple: {
    id:'kongtong_disciple', name:'石铁拳', role:'崆峒派弟子', category:'sect', avatar:'👊',
    city:'kongtong_peak', level:46, tier:'func',
    weapon:'wep_iron_fist', armor:'cs_general',
    silver:80,
    greetings:[
      '崆峒山练武已三年，下山还远着呢！有何贵干？',
      '师父说了，要以礼待来访的江湖人！',
    ],
    topics:[
      { id:'t_kt_disc_spar', text:'切磋拳法', reply:'（拱手）请多指教！（较量后）你的功夫不简单，俺还差得远！', relDelta:7, action:'spar_fight' },
      { id:'t_kt_disc_buy', text:'购买物资', reply:'山上物资有限，但基本的药材和干粮都有！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_kongtong_herb', icon:'🌿', name:'崆峒山药材', desc:'崆峒特产，气血+30', price:40, effect:{ hp:30 } },
      { id:'item_iron_ration', icon:'🍞', name:'硬面干粮', desc:'耐饥抗饿，饱食度+40', price:15, effect:{ food:40 } },
    ]},
    quests:['quest_sect_mission','quest_dojo_challenge','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  昆仑派·万年雪宫 NPCs  (sect · 西域 · 昆仑三圣)
  // ══════════════════════════════════════════════════════════

  kunlun_elder: {
    id:'kunlun_elder', name:'白崖子', role:'昆仑派三圣之首', category:'misc', avatar:'⛰',
    city:'kunlun_sect', level:60, tier:'major',
    weapon:'wep_silver_sword', armor:'cs_scholar',
    silver:300,
    greetings:[
      '昆仑山万年积雪，昆仑派万古传承！你来此，有何诉求？',
      '三圣剑法，昆仑镇派绝学！非天赋卓绝者难以入门！',
      '西域诸派，昆仑最古。来此者，需有虔诚之心！',
    ],
    greetingOverrides:[
      {
        requiresSect:'kunlun',
        greetings:{
          hostile:'（目光一冷）昆仑门规你都忘了？下次再犯，逐出山门！',
          guarded:'（打量片刻）你是新入门昆仑的弟子？三圣剑法非一朝一夕之功，慢慢来。',
          neutral:'（点头）既然入了昆仑门墙，便该潜心修剑。老夫今日有空，可指点你一二。',
          friendly:'（微微一笑）你来了昆仑这些时日，剑法可有长进？来，坐下说说。',
          close:'（招手）自己弟子，不需多礼。有何困惑，尽管问。',
        },
      },
    ],
    topics:[
      { id:'kl_elder_join', text:'拜师入门', reply:'（目光如电）昆仑三圣剑法，非大毅力者不可修。你若想入昆仑门墙，先让老夫看看你的剑心。', relDelta:5, action:'join_sect' },
      { id:'t_kl_elder_teach', text:'请教昆仑剑法', reply:'昆仑三圣剑法分天、地、人三派，三剑合一才是完整境界。老夫只传"天字剑法"，余者需你自行寻访！', relDelta:10, action:'train_skill' },
      { id:'t_kl_elder_spar', text:'切磋武艺', reply:'（缓缓拔出长剑）昆仑山上，剑气纵横！且看你能挡几招！（较量后）有悟性！昆仑欢迎有缘人！', relDelta:12, action:'spar_fight' },
      { id:'t_kl_elder_west', text:'了解西域秘境', reply:'昆仑山以西，有许多上古遗迹。传说某处山谷藏有前代绝学秘笈，但那里险象环生，普通武人九死一生！', relDelta:8, intelId:'intel_kunlun_sword' },
      { id:'t_kl_elder_manual', text:'求购武学秘籍', reply:'（凝视片刻）老夫观你骨骼清奇，非常人也。昆仑剑典与西域冰风之法，愿与有缘人分享，但价格不菲！', relDelta:8, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_sw_complete1', icon:'📘', name:'御风剑典完本', desc:'【剑系完本】解锁3式进阶剑招（需大成）', price:620, effect:{ manual:'m_sw_complete1' } },
      { id:'m_ic_frag1',     icon:'📜', name:'寒冰入门残卷', desc:'【冰系残卷】解锁冰系第一式', price:240, effect:{ manual:'m_ic_frag1' } },
      { id:'m_wi_frag1',     icon:'📜', name:'风行残卷',     desc:'【风系残卷】解锁风行功第一式', price:220, effect:{ manual:'m_wi_frag1' } },
      { id:'m_wi_partial1',  icon:'📗', name:'御风轻功残本', desc:'【风系残本】解锁2式凌空步法', price:380, effect:{ manual:'m_wi_partial1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_kunlun_sword'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_kunlun_1',
      topic: { id:'kl_chain_main', text:'【门派任务】三圣托付', reply:'无量寿福。昆仑山藏有玄铁令碎片，此事需严守秘密。你既是昆仑弟子，老夫有一要事相托……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  // ══════════════════════════════════════════════════════════
  //  凌霄楼·凌霄阁 NPCs  (sect · 杭州 · 情报中心)
  // ══════════════════════════════════════════════════════════

  lingxiao_broker: {
    id:'lingxiao_broker', name:'程鬼手', role:'凌霄阁情报掮客', category:'misc', avatar:'🏯',
    city:'lingxiao_tower', level:26, tier:'major',
    weapon:'wep_dark_knife', armor:'cs_assassin',
    silver:600,
    greetings:[
      '凌霄楼，消息就是生命！你想买什么情报？',
      '进了凌霄楼就没有秘密——包括你自己的秘密！',
      '有钱的可以问问题，没钱的……也可以用情报换情报！',
    ],
    greetingOverrides:[
      {
        requiresSect:'lingxiao',
        greetings:{
          hostile:'（眼神一冷）凌霄楼的人，敢对外泄露消息？不想活了是吧！',
          guarded:'（打量你）你是新来的凌霄弟子？情报这一行，最忌讳嘴不严。',
          neutral:'（手指敲桌）既然入了凌霄楼，便是自己人。坐下，有什么生意？',
          friendly:'（微微一笑）你回来了凌霄！最近江湖上可有不少有意思的消息，来，坐下说！',
          close:'（招手）自己人，不客气了。有什么情报要交换的？',
        },
      },
    ],
    topics:[
      { id:'lx_broker_join', text:'拜师入门', reply:'（手指敲着桌面）凌霄楼收人，要的是脑子不是蛮力。你若想在情报行当里混，先过俺的"信息试炼"——通过，便收。', relDelta:5, action:'join_sect' },
      { id:'t_lx_broker_buy', text:'购买情报（50两）', reply:'（微笑）什么情报？人的行踪？门派秘辛？路况地图？各有价格，开口吧！', relDelta:8, action:'pay_info' },
      { id:'t_lx_broker_trade', text:'提供情报换取情报', reply:'有价值的情报可以换！如果你知道某大派的秘密或某人的行踪，以物换物，公平交易！', relDelta:10 },
      { id:'t_lx_broker_intel', text:'打听江湖整体动向', reply:'（压低声音）最近日月神教在收买各地情报，大手笔！各大门派也在暗中布置，感觉大规模的江湖风波要来了……', relDelta:6, intelId:'intel_mingjiao_rise' },
    ],
    shop:{ items:[
      { id:'item_spy_report', icon:'📋', name:'凌霄密报',       desc:'某地情报，可出售或自用',             price:120, effect:{} },
      { id:'item_shadow_smoke', icon:'💨', name:'遁烟丸',         desc:'使用后逃跑概率大幅提升',            price:80, effect:{} },
      { id:'m_wi_frag1',     icon:'📜', name:'风行残卷',       desc:'【风系残卷】解锁轻功第一式',           price:250, effect:{ manual:'m_wi_frag1' } },
      { id:'m_qm_frag1',     icon:'📜', name:'奇门入门残卷',   desc:'【奇门残卷】解锁奇门遁甲第一式',       price:280, effect:{ manual:'m_qm_frag1' } },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_mingjiao_rise'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_lingxiao_1',
      topic: { id:'lx_chain_main', text:'【门派任务】凌霄情报', reply:'凌霄阁的情报网正被血骨门清洗！阁中必有内鬼，此事关乎凌霄阁存亡！你是凌霄弟子，此事交给你……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  lingxiao_agent: {
    id:'lingxiao_agent', name:'影子', role:'凌霄阁暗探', category:'misc', avatar:'🌑',
    city:'lingxiao_tower', level:27, tier:'func',
    weapon:'wep_dark_knife', armor:'cs_assassin',
    silver:200,
    greetings:[
      '影子有什么用？无处不在，无处不知！',
      '来凌霄楼的，不是买消息，就是卖消息。你是哪种？',
    ],
    topics:[
      { id:'t_lx_agent_sell', text:'出售情报', reply:'说来听听，有价值的俺来估价！', relDelta:5 },
      { id:'t_lx_agent_gear', text:'购买特制装备', reply:'凌霄阁自产的暗行装备，专为情报工作设计！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_shadow_cloak', icon:'🌑', name:'影行夜衣', desc:'凌霄特制，闪避+8', price:120, effect:{ defBuff:8 } },
      { id:'item_spy_manual', icon:'📜', name:'情报手册', desc:'江湖常识，理解地图和路况', price:50, effect:{} },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_tianshu'],
  },

  // ══════════════════════════════════════════════════════════
  //  天雷寨·天地帮总舵 NPCs  (sect · 沧州 · 雷系高手)
  // ══════════════════════════════════════════════════════════

  tiandibang_boss: {
    id:'tiandibang_boss', name:'雷霸天', role:'天地帮帮主', category:'misc', avatar:'⚡',
    city:'tiandibang_fort', level:49, tier:'elite',
    weapon:'wep_dragon_saber', armor:'cs_lg_tianzhan',
    silver:400,
    greetings:[
      '天地帮，北方第一帮！俺雷霸天，说话算数，一诺千金！',
      '来者不拒，走者不留！有本事就在这里留下，没本事就别碍事！',
      '雷法震天地，看你能不能接俺一掌！',
    ],
    greetingOverrides:[
      {
        requiresSect:'tiandibang',
        greetings:{
          hostile:'（冷哼）入了帮就是兄弟，敢背叛天地帮，俺雷霸天第一个不饶你！',
          guarded:'（上下打量）你就是新入帮的？嗯……有点种，俺也去喜欢你这样的人！',
          neutral:'（大笑）兄弟来了！天地帮上下都是自己人，坐下喝碗酒！',
          friendly:'（拍桌）你来了俺就高兴！帮里最近有几档子事，你来听听！',
          close:'（挥手）自己兄弟不客气！有什么打算，说来听听！',
        },
      },
    ],
    topics:[
      { id:'tdb_boss_join', text:'拜师入门', reply:'（大笑）想入俺天地帮？好！只要你能接下俺一掌不死，就是兄弟！来吧！', relDelta:5, action:'join_sect' },
      { id:'t_tdb_boss_spar', text:'切磋武艺', reply:'（双掌合拢，雷光闪烁）来！让俺看看你的斤两！（较量后）哈哈！好功夫！有资格和天地帮谈合作了！', relDelta:12, action:'spar_fight' },
      { id:'t_tdb_boss_join', text:'询问入帮条件', reply:'天地帮要的是有真本事的人！打赢俺三个堂主，或者立下大功，两条路，选一条！', relDelta:6 },
      { id:'t_tdb_boss_intel', text:'了解北方江湖', reply:'北方现在最乱的是玄冥教，到处收买人手，扩张势力。俺天地帮也被招揽过，但俺没应。那些极寒功法……总感觉不是好路子！', relDelta:7, intelId:'intel_sect_secret' },
    ],
    shop:{ items:[
      { id:'m_th_frag1',     icon:'📜', name:'雷击残卷',       desc:'【雷系残卷】解锁雷霆功第一式',         price:280, effect:{ manual:'m_th_frag1' } },
      { id:'m_fo_frag1',     icon:'📜', name:'霸拳残卷',       desc:'【力系残卷】解锁蛮拳第一式',           price:250, effect:{ manual:'m_fo_frag1' } },
      { id:'item_thunder_talisman', icon:'⚡', name:'雷纹符',   desc:'天地帮秘制，攻击+10(雷伤)',          price:70, effect:{ atkBuff:10 } },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_matchmaking_trouble','quest_gossip_hidden_wealth'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_tiandibang_1',
      topic: { id:'tdb_chain_main', text:'【门派任务】帮主野心', reply:'哈哈哈！乱世出英雄，正是天地帮崛起的大好时机！血骨门与正道打得不可开交，正是俺们趁虚而入的时候！你愿为天地帮开疆拓土吗？（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  tiandibang_smith: {
    id:'tiandibang_smith', name:'雷刀侠', role:'天地帮军械师', category:'blacksmith', avatar:'⚒',
    city:'tiandibang_fort', level:28, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:150,
    greetings:[
      '天地帮的兵器，都是俺一手打造！外人也可以买，价格比外面贵，但质量没话说！',
      '天地帮的规矩，生意归生意，打架归打架！',
    ],
    topics:[
      { id:'t_tdb_smith_thunder', text:'打听雷法武器', reply:'天地帮的雷系高手用的是"雷纹刀"，刀身刻有雷纹，施展雷法时威力加倍！不对外卖，但你若入帮，有机会用到！', relDelta:5 },
    ],
    shop:{ items:[
      { id:'item_thunder_pill', icon:'⚡', name:'雷震丹', desc:'激活体内潜能，攻击临时+15', price:70, effect:{ atkBuff:15 } },
      { id:'item_iron_guard', icon:'🛡', name:'铁甲护腕', desc:'天地帮专制，防御+4', price:80, effect:{ defBuff:4 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels: ['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  桃花堂·东邪总坛 NPCs  (sect · 东海 · 东邪奇功)
  // ══════════════════════════════════════════════════════════

  taohua_elder: {
    id:'taohua_elder', name:'慕容奇', role:'桃花堂堂主', category:'misc', avatar:'🌺',
    city:'taohua_hall', level:89, tier:'elite',
    weapon:'wep_divine_qin', armor:'cs_lg_taohua',
    silver:1000,
    greetings:[
      '落英神剑，天下无双！你能闯过俺的桃花阵来此，确实有些本事！',
      '东邪者，不拘礼法，随心所欲！俺的武学，不教死脑筋之人！',
      '岛上桃花三万株，一树一机关。你站在这里，已经触发了三十七个！',
    ],
    greetingOverrides:[
      {
        requiresSect:'taohua',
        greetings:{
          hostile:'（眉头一皱）桃花堂的规矩你都忘了？回去把岛上的阵法再走一遍！',
          guarded:'（挑眉）你是新上岛的桃花堂弟子？有点意思……但还不够邪门。',
          neutral:'（拈起一片桃花）既然入了桃花堂，便是岛上的自己人。坐下喝酒，有什么事？',
          friendly:'（哈哈大笑）你来了！岛上的桃花开了，来赏花喝酒，老夫正闷得慌！',
          close:'（拍身边位置）自己孩子，坐。来，尝尝桃花酿，老夫有新鲜事要跟你说。',
        },
      },
    ],
    topics:[
      { id:'th_elder_join', text:'拜师入门', reply:'（挑眉打量）想入桃花堂？先过俺的桃花阵再说。能活着走到老夫面前，便有资格拜师。', relDelta:5, action:'join_sect' },
      { id:'t_th_elder_teach', text:'请教东邪武学', reply:'落英神剑讲究"乱中有序"，看似随意，实则每一招都有数十种后手。悟性高者一看就懂，悟性低者……就算手把手教也没用！', relDelta:12, action:'train_skill' },
      { id:'t_th_elder_spar', text:'切磋武艺', reply:'（随手拈起一片桃花花瓣，轻轻一弹）来！（较量后）有趣，你的武功自成一格，东邪欣赏这种不走寻常路的人！', relDelta:15, action:'spar_fight' },
      { id:'t_th_elder_world', text:'谈论天下武学', reply:'天下武学皆有根源——少林武当是正宗，东邪是异端，但异端不代表弱！俺对世俗礼教嗤之以鼻，但对真正的武学，始终保有敬意！', relDelta:10 },
      { id:'t_th_elder_manual', text:'求购武学秘籍', reply:'（拈起一片桃花）武学秘籍嘛，俺这里倒有几本奇特的。能不能学，就看你的悟性！', relDelta:6, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_qin_frag1',    icon:'📜', name:'琴音残卷',     desc:'【琴系残卷】解锁：音律困敌初式', price:280, effect:{ manual:'m_qin_frag1' } },
      { id:'m_sw_partial1',  icon:'📗', name:'剑宗秘要残本', desc:'【剑系残本】解锁2式犀利剑招', price:350, effect:{ manual:'m_sw_partial1' } },
      { id:'m_qin_complete1',icon:'📘', name:'天音三曲完本', desc:'【琴系完本】解锁3式天音绝学（需大成）', price:720, effect:{ manual:'m_qin_complete1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_tianshu'],
  },

  taohua_disciple: {
    id:'taohua_disciple', name:'花弄影', role:'桃花堂弟子', category:'sect', avatar:'🌸',
    city:'taohua_hall', level:34, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:150,
    greetings:[
      '桃花岛的人，个个性格古怪，但武功都是真的！',
      '岛主最近心情不错，愿意见客，你来得好时候！',
    ],
    topics:[
      { id:'t_th_disc_spar', text:'切磋武艺', reply:'（笑着拔剑）来！俺的剑法师承岛主，看你能应付几招！', relDelta:8, action:'spar_fight' },
      { id:'t_th_disc_buy', text:'购买桃花岛特产', reply:'岛上的东西都有灵气，买了不吃亏！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_taohua_wine', icon:'🌸', name:'桃花酿', desc:'桃花酿造，气血+35，魅力提升', price:55, effect:{ hp:35 } },
      { id:'item_east_sea_fish', icon:'🐟', name:'东海鲜鱼', desc:'鲜美无比，饱食度+50', price:30, effect:{ food:50 } },
    ]},
    quests:['quest_sect_mission','quest_dojo_challenge','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  血炼堡·血骨门 NPCs  (sect · 幽州北郊 · 血炼绝功)
  // ══════════════════════════════════════════════════════════

  xuegu_boss: {
    id:'xuegu_boss', name:'骨血老祖', role:'血骨门宗主', category:'misc', avatar:'💀',
    city:'xuegu_fort', level:47, tier:'elite',
    weapon:'wep_ghost_blade', armor:'cs_lg_xuegu',
    silver:500,
    greetings:[
      '血骨门的门规：进来容易，出去难！你想干什么？',
      '血炼大法，以鲜血修炼，以骨骼强化！江湖中最霸道的功法之一！',
      '看你的实力，再决定对你的态度！',
    ],
    greetingOverrides:[
      {
        requiresSect:'xuegu',
        greetings:{
          hostile:'（冷哼）入了血骨门还想背叛？老祖要把你的骨头一根根拆了！',
          guarded:'（冷笑打量）新入门的小子？血骨门的滋味，尝过了吧？',
          neutral:'（抬眼）既然是血骨门的人，坐下吧。门里最近有点事要你去办。',
          friendly:'（冷笑）你回来了！血骨门需要你的血来炼功，有空吗？',
          close:'（招手）自己人，不客气了。有什么打算，说来听听。',
        },
      },
    ],
    topics:[
      { id:'xg_boss_join', text:'拜师入门', reply:'（冷笑）血骨门不收废物。你若想入门，先让老祖看看你的骨血够不够硬！', relDelta:5, action:'join_sect' },
      { id:'t_xg_boss_spar', text:'切磋武艺', reply:'（冷笑）来！俺要看看，值不值得留下你！（激战后）……不错，算你过了第一关！', relDelta:10, action:'spar_fight' },
      { id:'t_xg_boss_intel', text:'了解血骨门', reply:'血骨门修炼的是"血炼大法"，越战越强，以战养战！门中弟子以战斗场数论高下，战得越多，功力越深！', relDelta:5, intelId:'intel_sect_secret' },
      { id:'t_xg_boss_north', text:'打听北方局势', reply:'北边玄冥教和草原大汗暗中勾结，血骨门也被邀参与，但老祖我不信任他们！雷霸天和我想法一样，时机到了再说！', relDelta:7 },
    ],
    shop:{ items:[
      { id:'m_fo_partial1',  icon:'📗', name:'铁血拳谱残本',   desc:'【力系残本】解锁2式狂暴技法',           price:400, effect:{ manual:'m_fo_partial1' } },
      { id:'m_fx_frag1',    icon:'📜', name:'降龙残卷',       desc:'【拳系残卷】解锁降龙十八掌第一式',     price:350, effect:{ manual:'m_fx_frag1' } },
      { id:'item_blood_stone', icon:'🔴', name:'血精石',         desc:'血炼材料，防御+8',                   price:100, effect:{ defBuff:8 } },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_matchmaking_trouble','quest_gossip_hidden_wealth'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_xuegu_1',
      topic: { id:'xg_chain_main', text:'【门派任务】血神经秘', reply:'（冷笑）血神经修炼到了关键时刻——只需再收集武学精华，加上玄铁令的力量，便能大成天下！你是血骨门核心弟子，此事交给你……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  xuegu_smith: {
    id:'xuegu_smith', name:'铁骨头', role:'血骨门铁匠', category:'blacksmith', avatar:'⚒',
    city:'xuegu_fort', level:17, tier:'func',
    weapon:'wep_meteor_hammer', armor:'cs_general',
    silver:100,
    greetings:[
      '血骨门的兵器，专为战斗设计，没有花哨，只有实用！',
      '想买好刀好剑？来对地方了！',
    ],
    topics:[
      { id:'t_xg_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把东西放下，血骨门的铁匠眼里揉不得沙子。', relDelta:0, action:'identify_equip' },
      { id:'t_xg_smith_blood', text:'打听血炼材料', reply:'血炼大法需要特殊铁料和血精石，一般地方没有。血精石需从北疆特定矿脉开采，极为罕见！', relDelta:4 },
    ],
    shop:{ items:[
      { id:'item_blood_iron', icon:'🔴', name:'血炼铁片', desc:'特殊铁料，防御+5', price:90, effect:{ defBuff:5 } },
      { id:'item_blood_pill', icon:'💊', name:'血炼丹', desc:'血骨门秘制，气血+40', price:75, effect:{ hp:40 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  玄冥殿·玄冥教 NPCs  (sect · 极北 · 寒冰绝功)
  // ══════════════════════════════════════════════════════════

  xuanming_elder: {
    id:'xuanming_elder', name:'冥霄子', role:'玄冥教主', category:'misc', avatar:'⛧',
    city:'xuanming_hall', level:53, tier:'elite',
    weapon:'wep_uc_bamboo_staff', armor:'cs_lg_xuanming',
    silver:200,
    greetings:[
      '极北冰原，除玄冥弟子外，无人能活着到此！你是何人？',
      '玄冥神功，以寒制热，以阴克阳！天下无解之毒！',
      '你来此，自然有你的原因。说吧！',
    ],
    greetingOverrides:[
      {
        requiresSect:'xuanming',
        greetings:{
          hostile:'（寒气骤降）入了玄冥门，还敢对老祖不敬？找死！',
          guarded:'（上下打量）你是玄冥教新弟子？能在冰原上站这么久，根骨不错。',
          neutral:'（点头）既然是玄冥教的人，便是一家人。有什么事，说。',
          friendly:'（微微一笑）你回来了玄冥。冰原上修炼，可有进展？',
          close:'（拂袖）自己人，不客气了。有什么事，尽管说。',
        },
      },
    ],
    topics:[
      { id:'xm_elder_join', text:'拜师入门', reply:'（寒气逼人）玄冥教收徒极严，非心性坚韧者不可入。你若能承受我三掌寒冰之力，便有资格。', relDelta:5, action:'join_sect' },
      { id:'t_xm_elder_teach', text:'了解玄冥神功', reply:'玄冥神功需在极寒环境修炼，每一层需在低于零下三十度的寒冰中打坐三年！非常人能承受！但若修炼成功，一掌可冻人骨骸，天下难有解法！', relDelta:8 },
      { id:'t_xm_elder_spar', text:'切磋武艺', reply:'（双手结印，寒气升腾）接俺一掌！（较量后）……你还活着，算你命大！也算有几分能耐！', relDelta:10, action:'spar_fight' },
      { id:'t_xm_elder_north', text:'了解极北秘境', reply:'极北冰原以北，有更广阔的冰域，那里的寒冰是万年形成，修炼玄冥神功的至宝。但那里除了俺的弟子，无人能生存！', relDelta:6, intelId:'intel_kunlun_sword' },
    ],
    shop:{ items:[
      { id:'m_ic_frag1',     icon:'📜', name:'玄冰入门残卷',   desc:'【冰系残卷】解锁冰系第一式',           price:280, effect:{ manual:'m_ic_frag1' } },
      { id:'m_po_frag1',     icon:'📜', name:'五毒入门残卷',   desc:'【毒系残卷】解锁毒术第一式',           price:300, effect:{ manual:'m_po_frag1' } },
      { id:'m_sh_frag1',     icon:'📜', name:'夜行残卷',       desc:'【暗系残卷】解锁暗器快袭第一式',       price:320, effect:{ manual:'m_sh_frag1' } },
      { id:'item_xuanming_ice_pill', icon:'❄', name:'玄冥寒丹', desc:'寒气入体，攻击+12(冰伤)',           price:85, effect:{ atkBuff:12 } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_mingjiao_rise'],
  },

  // ══════════════════════════════════════════════════════════
  //  天山雪宫·天山派 NPCs  (sect · 西域天山 · 冰系武学)
  // ══════════════════════════════════════════════════════════

  tianshan_elder: {
    id:'tianshan_elder', name:'冰心娘', role:'天山派宗主', category:'misc', avatar:'❄',
    city:'tianshan_sect', level:57, tier:'elite',
    weapon:'wep_uc_bamboo_staff', armor:'cs_ep_wind',
    silver:300,
    greetings:[
      '天山雪宫，清冷孤高！来此的江湖人，都是不怕死的！',
      '天山派武功以冰系为主，但并非只有寒冰之力，更有天地大道蕴含其中！',
      '俺数十年镇守雪宫，天下无人敢轻犯！你来此是何目的？',
    ],
    greetingOverrides:[
      {
        requiresSect:'tianshan',
        greetings:{
          hostile:'（目光一寒）天山派的规矩你都忘了？下去领罚！',
          guarded:'（打量片刻）你是新入天山派的弟子？嗯……有点意思。',
          neutral:'（微微颔首）既然入了天山派，便是雪宫的人。坐下，有什么事？',
          friendly:'（微微一笑）你回来了天山。雪宫的茶刚泡好，尝尝。',
          close:'（招手）自己孩子，不客气。有什么事，直说便是。',
        },
      },
    ],
    topics:[
      { id:'ts_elder_join', text:'拜师入门', reply:'（目光如电）天山派收徒，需经冰火双重考验。你若不怕死，便来试试。', relDelta:5, action:'join_sect' },
      { id:'t_ts_elder_teach', text:'请教天山武学', reply:'天山六阳掌，以阴阳互济为要诀，非纯阴或纯阳，而是阴中有阳、阳中含阴！与玄冥神功的纯阴路子不同，这才是天山武学的精髓！', relDelta:10, action:'train_skill' },
      { id:'t_ts_elder_spar', text:'切磋武艺', reply:'（抬手轻弹，冰花飘落）接俺三招！（较量后）不错，中原武学自有其妙处！', relDelta:12, action:'spar_fight' },
      { id:'t_ts_elder_xuanming', text:'谈谈玄冥教', reply:'玄冥神功走的是极端之道，虽然强悍，但修炼者往往心性扭曲，冷酷无情。天山武学强调阴阳平衡，不走极端！两者路子不同，但都是强大！', relDelta:7, intelId:'intel_sect_secret' },
      { id:'t_ts_elder_manual', text:'求购武学秘籍', reply:'（淡淡一笑）冰系功法和风系步法，是天山武学两大精要，有缘人来了，老身留有几本秘籍。', relDelta:5, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_ic_frag1',    icon:'📜', name:'寒冰入门残卷', desc:'【冰系残卷】解锁冰系第一式', price:240, effect:{ manual:'m_ic_frag1' } },
      { id:'m_ic_partial1', icon:'📗', name:'玄冥冰功残本', desc:'【冰系残本】解锁2式冰冻绝技', price:420, effect:{ manual:'m_ic_partial1' } },
      { id:'m_wi_frag1',    icon:'📜', name:'风行残卷',     desc:'【风系残卷】解锁风系轻功第一式', price:220, effect:{ manual:'m_wi_frag1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_tianshan_1',
      topic: { id:'ts_chain_main', text:'【门派任务】天山童姥', reply:'天山雪宫数十年未曾开门迎客，你既有缘入我门下，便是有缘人。血骨门觊觎天山武学，此事关乎天山存亡，你可愿一探究竟？（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  // ══════════════════════════════════════════════════════════
  //  南宫庄园·南宫世家 NPCs  (sect · 洛阳郊外 · 文武双绝)
  // ══════════════════════════════════════════════════════════

  nangong_elder: {
    id:'nangong_elder', name:'南宫世杰', role:'南宫世家家主', category:'misc', avatar:'🏛',
    city:'nangong_manor', level:31, tier:'major',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:800,
    greetings:[
      '南宫庄园，以诗书传家，以剑法传道！阁下到访，有失远迎！',
      '文武双修，南宫世家数百年家训。来访者，俺以礼相待！',
      '阁下的武功……颇有气度，是自修还是名师所授？',
    ],
    greetingOverrides:[
      {
        requiresSect:'nangong',
        greetings:{
          hostile:'（脸色一沉）南宫世家不欢迎忘恩负义之人，下次再犯，赶出庄园！',
          guarded:'（打量片刻）你是新入门的弟子？嗯……有点书卷气，颇合南宫家风。',
          neutral:'（微微一笑）既然入了南宫世家，便是一家人。坐下喝杯茶，有何困惑？',
          friendly:'（抬手）你来了庄园！老夫正要寻人下棋，来，陪老夫手谈一局。',
          close:'（招手）自己人，不客气。有什么心得，尽管说来听听。',
        },
      },
    ],
    topics:[
      { id:'ng_elder_join', text:'拜师入门', reply:'（微微颔首）南宫世家虽以文传家，但剑道一脉从不拒有志之士。阁下若愿入我南宫门墙，便先与老夫切磋几招。', relDelta:5, action:'join_sect' },
      { id:'t_ng_elder_teach', text:'请教南宫剑法', reply:'南宫剑典讲究"以文入武"，剑法中有诗意，诗意中有剑意！每一招都有典故，心存高雅，剑自飘逸！', relDelta:10, action:'train_skill' },
      { id:'t_ng_elder_spar', text:'切磋武艺', reply:'（从容起身，优雅拔剑）请吧！（较量后）好！剑法中有武人气概，难得！南宫庄园认可你！', relDelta:12, action:'spar_fight' },
      { id:'t_ng_elder_intel', text:'了解中原江湖', reply:'南宫家在中原经营数百年，耳目遍布。日月神教近期动作颇大，连官府都有人被他们收买。各大门派都在应对，江湖怕是不得太平了！', relDelta:8, intelId:'intel_mingjiao_rise' },
    ],
    shop:{ items:[
      { id:'m_sw_frag1',     icon:'📜', name:'剑法基础残卷',   desc:'【剑系残卷】解锁剑气斩初式',           price:240, effect:{ manual:'m_sw_frag1' } },
      { id:'m_ho_frag1',     icon:'📜', name:'圣光残卷',       desc:'【圣系残卷】解锁圣光第一式',           price:280, effect:{ manual:'m_ho_frag1' } },
      { id:'m_qin_frag1',    icon:'📜', name:'琴音残卷',       desc:'【琴系残卷】解锁音律困敌初式',         price:300, effect:{ manual:'m_qin_frag1' } },
      { id:'item_nangong_sword_oil', icon:'⚔', name:'南宫剑油',   desc:'世家秘制，攻击+7',                   price:50, effect:{ atkBuff:7 } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_mingjiao_rise'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_nangong_1',
      topic: { id:'ng_chain_main', text:'【门派任务】世家危机', reply:'南宫世家收到血骨门的威胁信——要么归附，要么灭门。南宫世家传承三百年，岂能屈从邪道！你是南宫弟子，此事关乎世家存亡……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  nangong_steward: {
    id:'nangong_steward', name:'贾管家', role:'南宫庄园管家', category:'misc', avatar:'📜',
    city:'nangong_manor', level:24, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:200,
    greetings:[
      '南宫庄园欢迎有礼有节之人！请随俺来，家主正在等候！',
      '庄园内一切物资应有尽有，有需要尽管开口！',
    ],
    topics:[
      { id:'t_ng_stwd_buy', text:'购买庄园特产', reply:'南宫庄园的产品，皆是上品！', relDelta:3, action:'open_shop' },
      { id:'t_ng_stwd_rules', text:'了解庄园规矩', reply:'庄园规矩不多：一不可无礼，二不可盗窃，三不可在庄内动用武力！三条都遵守，南宫庄园把你当上宾！', relDelta:5 },
    ],
    shop:{ items:[
      { id:'item_nangong_wine', icon:'🍷', name:'南宫陈酿', desc:'百年佳酿，精力+30，心情大好', price:80, effect:{ energy:30 } },
      { id:'item_cultural_book', icon:'📚', name:'南宫诗剑录', desc:'文武双修心法，对悟性提升有帮助', price:100, effect:{} },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_local_gossip'],
  },

  // ══════════════════════════════════════════════════════════
  //  鬼谷门·幽洞 NPCs  (sect · 伏牛山 · 奇门遁甲)
  // ══════════════════════════════════════════════════════════

  guigu_master: {
    id:'guigu_master', name:'鬼谷先生', role:'鬼谷门门主', category:'misc', avatar:'🔮',
    city:'guigu_valley', level:26, tier:'major',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:500,
    greetings:[
      '天机不可泄露，但你既然找到了这里，便是天定之人！',
      '鬼谷之术，非武学，是天道。运筹帷幄之中，决胜千里之外！',
      '你来此，是来学谋略，还是学奇门遁甲？',
    ],
    greetingOverrides:[
      {
        requiresSect:'guigu',
        greetings:{
          hostile:'（掐指一算）鬼谷门规你都忘了？下次再犯，逐出师门。',
          guarded:'（打量）你是新入门鬼谷的弟子？嗯……有点意思，但谋略之道，还早。',
          neutral:'（微微点头）既然入了鬼谷门，便是自家人。坐下，有何困惑？',
          friendly:'（微微一笑）你回来了鬼谷。老夫正有一卦要给你说，坐。',
          close:'（招手）自己孩子，不客气了。有什么事，直说便是。',
        },
      },
    ],
    topics:[
      { id:'gg_mst_join', text:'拜师入门', reply:'（微微一笑）鬼谷门收徒，不看出身，只看悟性与心性。你既有缘至此，便让老夫考你一题——答得上来，便是弟子。', relDelta:5, action:'join_sect' },
      { id:'t_gg_mst_teach', text:'请教奇门遁甲', reply:'奇门遁甲，以天干地支排布阵势，变化万千。学会此术，可预判敌人行动，化解危机！但此术需极高悟性，俺只传有缘人！', relDelta:10, action:'train_skill' },
      { id:'t_gg_mst_divination', text:'请先生算一卦', reply:'（掐指一算）你近期有一场大战，胜负各半。但若能得一助力，则必胜无疑！至于那助力是人是物，俺不便说透，你自行参悟！', relDelta:8 },
      { id:'t_gg_mst_world', text:'了解天下大势', reply:'日月神教如日中天，各大门派蠢蠢欲动——这是一场必然发生的天下大战的前兆！谁能笑到最后，取决于各方的智谋，而非武力！', relDelta:12, intelId:'intel_mingjiao_rise' },
    ],
    shop:{ items:[
      { id:'m_qm_frag1',     icon:'📜', name:'奇门入门残卷',   desc:'【奇门残卷】解锁奇门遁甲第一式',       price:280, effect:{ manual:'m_qm_frag1' } },
      { id:'m_ml_frag1',     icon:'📜', name:'命格残卷',       desc:'【命理残卷】解锁天命推算第一式',       price:320, effect:{ manual:'m_ml_frag1' } },
      { id:'item_divination_dice', icon:'🎲', name:'卜卦骰子',   desc:'鬼谷秘器，运气+5(临时)',              price:100, effect:{} },
    ]},
    quests:['quest_test_talent','quest_elder_rogue_disciple','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_gossip_weird_duel'],
    intels: ['intel_mingjiao_rise'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_guigu_1',
      topic: { id:'gg_chain_main', text:'【门派任务】天机异动', reply:'（掐指一算）天机紊乱，血骨门之乱将迎来关键转折。鬼谷门弟子，你便是这变数之人——顺应天机，拨乱反正！（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  // ══════════════════════════════════════════════════════════
  //  海沙岛·海沙派 NPCs  (sect · 东海 · 七杀刀法)
  // ══════════════════════════════════════════════════════════

  haisha_boss: {
    id:'haisha_boss', name:'七杀刀王', role:'海沙派岛主', category:'misc', avatar:'⚓',
    city:'haisha_island', level:31, tier:'major',
    weapon:'wep_uc_dao', armor:'cs_general',
    silver:600,
    greetings:[
      '东海海沙岛，外人免进！但既然来了，就别想走了——除非你有真本事！',
      '七杀刀法，一刀七式，每式都能致命！你想见识么？',
      '海上江湖，比陆上更凶险！在这里，实力才是话语权！',
    ],
    greetingOverrides:[
      {
        requiresSect:'haisha',
        greetings:{
          hostile:'（抽出七杀刀）海沙派的规矩你都忘了？下去领罚！',
          guarded:'（上下打量）你是新入门海沙的？嗯……有点意思。',
          neutral:'（收起刀）既然是海沙派的人，坐下说。海上有什么动静？',
          friendly:'（大笑）你回来了海沙！七杀刀法练得怎么样了？来，坐下喝一杯！',
          close:'（拍身边）自己兄弟不客气！有什么事，说来听听！',
        },
      },
    ],
    topics:[
      { id:'hs_boss_join', text:'拜师入门', reply:'（目光炯炯）想入海沙派？好！东海不养废物，你先跟俺的七杀刀过三招，不死便收！', relDelta:5, action:'join_sect' },
      { id:'t_hs_boss_spar', text:'切磋武艺', reply:'（拔出七杀刀）来！让俺看看中原高手的斤两！（激战后）不错，有资格在俺的岛上留几天！', relDelta:12, action:'spar_fight' },
      { id:'t_hs_boss_sea', text:'了解东海江湖', reply:'东海上的势力复杂：海沙派、桃花岛、明州港帮……各有地盘。最近有批不明来历的船只在游荡，不知是什么势力，让俺警惕！', relDelta:7, intelId:'intel_road_bandit' },
      { id:'t_hs_boss_teach', text:'请教七杀刀法', reply:'七杀刀法的精髓在"狠"！出刀不留手，以势压人，让对手心理先崩！但真正的高手知道，"狠"不是乱砍，而是精准的致命一击！', relDelta:8, action:'train_skill' },
    ],
    shop:{ items:[
      { id:'m_sh_frag1',     icon:'📜', name:'夜行残卷',       desc:'【暗系残卷】解锁暗器快袭第一式',       price:300, effect:{ manual:'m_sh_frag1' } },
      { id:'m_fo_partial1',  icon:'📗', name:'铁血拳谱残本',   desc:'【力系残本】解锁2式蛮拳技法',           price:380, effect:{ manual:'m_fo_partial1' } },
      { id:'item_seven_kill_oil', icon:'⚓', name:'七杀刀油',   desc:'海沙秘制，攻击+10(水伤)',             price:70, effect:{ atkBuff:10 } },
      { id:'item_coral_helm', icon:'🐚', name:'海螺盔',         desc:'东海特产，防御+6',                   price:85, effect:{ defBuff:6 } },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_matchmaking_trouble','quest_gossip_hidden_wealth'],
    intels: ['intel_sect_secret'],
  },

  haisha_merchant: {
    id:'haisha_merchant', name:'沙波涛', role:'海沙派商人', category:'shop', avatar:'🐟',
    city:'haisha_island', level:21, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth',
    silver:300,
    greetings:[
      '东海海货，新鲜美味！南洋香料、珊瑚宝石，应有尽有！',
      '海上来的货，内陆买不到！来看看！',
    ],
    topics:[
      { id:'t_hs_mer_buy', text:'购买海货', reply:'东海特产，全是好东西！', relDelta:3, action:'open_shop' },
      { id:'t_hs_mer_sea', text:'了解海上商路', reply:'东海航线通往南洋、倭国，货物往来频繁。但海盗也多，没有海沙派的旗号，轻易不要出海！', relDelta:5 },
    ],
    shop:{ items:[
      { id:'item_sea_fish', icon:'🐟', name:'东海大鱼', desc:'鲜美海鱼，饱食度+60，气血+20', price:35, effect:{ food:60, hp:20 } },
      { id:'item_coral_gem', icon:'🪸', name:'珊瑚宝石', desc:'稀有海产，价值不菲，礼品佳选', price:150, effect:{} },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general'],
    intels: ['intel_trade_route'],
  },

  // ══════════════════════════════════════════════════════════
  //  圣光圣殿·圣光教 NPCs  (sect · 开封郊外 · 圣光神功)
  // ══════════════════════════════════════════════════════════

  shengguang_elder: {
    id:'shengguang_elder', name:'苏明光', role:'圣光教大祭司', category:'misc', avatar:'✦',
    city:'shengguang_temple', level:61, tier:'elite',
    weapon:'wep_uc_bamboo_staff', armor:'cs_lg_shengguang',
    silver:300,
    greetings:[
      '光明普照，圣光庇护！来者皆是迷途之人，圣光可为你指路！',
      '圣光神功，以光明之力治愈万物，驱逐黑暗！',
      '信圣光者，疾病消除，武功精进！阁下可有此意？',
    ],
    greetingOverrides:[
      {
        requiresSect:'shengguang',
        greetings:{
          hostile:'（目光一冷）圣光门徒不可心怀恶意，下次再犯，开除教籍！',
          guarded:'（打量）你是新入教的弟子？圣光照耀下，人人平等，但心要向善。',
          neutral:'（微微颔首）既然入了圣光教，便是光的子民。坐下，有何需要？',
          friendly:'（微笑）你回来了圣光。圣光照耀你，修行的路上可有困惑？',
          close:'（招手）自己人，不客气。有什么事，尽管说。',
        },
      },
    ],
    topics:[
      { id:'sg_elder_join', text:'拜师入门', reply:'（圣光微照）圣光教收徒，首重信仰。若你心向光明，愿接受圣光试炼，便来吧。', relDelta:5, action:'join_sect' },
      { id:'t_sg_elder_teach', text:'了解圣光神功', reply:'圣光神功以信仰为根基，信仰越坚定，圣光之力越强大！但此功不传邪恶之人，需经圣光考验方能修炼！', relDelta:8, action:'train_skill' },
      { id:'t_sg_elder_heal', text:'请求圣光治愈', reply:'圣光护佑！（施法）感受圣光之力，伤痛消散！', relDelta:6, action:'heal_hp' },
      { id:'t_sg_elder_intel', text:'了解圣光教的目标', reply:'圣光教志在以光明净化江湖黑暗——除邪扶正，治病救人。日月神教的扩张让我们忧虑，其武功走的是邪道，最终会危害苍生！', relDelta:7, intelId:'intel_mingjiao_rise' },
    ],
    shop:{ items:[
      { id:'m_ho_frag1',     icon:'📜', name:'圣光残卷',       desc:'【圣系残卷】解锁圣光第一式',           price:280, effect:{ manual:'m_ho_frag1' } },
      { id:'m_bd_frag1',     icon:'📜', name:'少林入门残卷',   desc:'【佛系残卷】解锁罗汉拳第一式',         price:260, effect:{ manual:'m_bd_frag1' } },
      { id:'m_mu_frag1',     icon:'📜', name:'琴音残卷',       desc:'【琴系残卷】解锁音律困敌初式',         price:300, effect:{ manual:'m_qin_frag1' } },
      { id:'item_holy_water', icon:'✨', name:'圣水',           desc:'圣光炼制，气血+60，解毒',             price:80, effect:{ hp:60 } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_mingjiao_rise'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_shengguang_1',
      topic: { id:'sg_chain_main', text:'【门派任务】圣光启示', reply:'光明普照，圣光庇护！血骨门门主骨冥子修炼血神经，天下即将大乱。圣光教弟子，此事关乎苍生福祉，你可愿随我一同净化邪恶？（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  shengguang_healer: {
    id:'shengguang_healer', name:'白如雪', role:'圣光教治愈师', category:'misc', avatar:'💊',
    city:'shengguang_temple', level:22, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_monk_robe',
    silver:150,
    greetings:[
      '圣光庇护，伤者皆可在此疗伤！',
      '以光明之力治疗，远比普通医术更彻底！',
    ],
    topics:[
      { id:'t_sg_heal_heal', text:'接受圣光治愈', reply:'圣光降临，治愈你的伤痛！', relDelta:5, action:'heal_hp' },
      { id:'t_sg_heal_buy', text:'购买圣光药品', reply:'圣光教的治愈药品，在中原少见！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_holy_potion', icon:'✨', name:'圣光药水', desc:'圣光神功炼制，气血+50', price:70, effect:{ hp:50 } },
      { id:'item_holy_bread', icon:'🍞', name:'圣光面包', desc:'圣殿祝福食物，饱食度+45，气血+15', price:25, effect:{ food:45, hp:15 } },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_cultivation_tip'],
  },

  // ══════════════════════════════════════════════════════════
  //  点苍派·苍云剑阁 NPCs  (sect · 云南 · 毒剑双绝)
  // ══════════════════════════════════════════════════════════

  diancang_elder: {
    id:'diancang_elder', name:'段云峰', role:'点苍派掌门', category:'sect', avatar:'💠',
    city:'diancang_peak', level:62, tier:'elite',
    weapon:'wep_iron_sword', armor:'cs_ep_sword',
    silver:280,
    greetings:[
      '点苍山云深之处，非有缘人难觅此地！你来此，天意也！',
      '苍云剑法，毒剑双绝，柔中带毒，无解！',
      '大理一带，本派维护多年安宁。你若有诚意，可一叙！',
    ],
    greetingOverrides:[
      {
        requiresSect:'diancang',
        greetings:{
          hostile:'（冷冷拔剑）点苍派的规矩你都忘了？下去领罚！',
          guarded:'（打量片刻）你是新入门点苍的弟子？嗯……有点意思。',
          neutral:'（抚剑而立）既然入了点苍派，便是一家人。坐下说话。',
          friendly:'（微微一笑）你回来了点苍。苍云剑法可有长进？',
          close:'（招手）自己人，不客气。有什么事，直说便是。',
        },
      },
    ],
    topics:[
      { id:'dc_elder_join', text:'拜师入门', reply:'（抚剑而立）点苍派剑法独步西南，收徒只看悟性和心性。你若有意，便先试几招。', relDelta:5, action:'join_sect' },
      { id:'t_dc_elder_teach', text:'请教苍云剑法', reply:'苍云剑法分两层：表为剑法飘逸，里为毒性凛然！对手以为看见了花哨剑法，实则每一招都含有点苍山特有的幽毒！', relDelta:10, action:'train_skill' },
      { id:'t_dc_elder_spar', text:'切磋武艺', reply:'（轻挑剑尖）来！苍云剑阁，迎接一切挑战！（较量后）好手！点苍派欢迎如此对手！', relDelta:12, action:'spar_fight' },
      { id:'t_dc_elder_dali', text:'了解大理局势', reply:'大理天龙寺最近动静不小，似乎有什么重要传承将要传授。五毒教也在往云南方向渗透，被本派阻拦了数次！', relDelta:7, intelId:'intel_poison_cult' },
      { id:'t_dc_elder_manual', text:'求购武学秘籍', reply:'点苍派剑法独步云南，秘籍不轻授。不过若你诚意足够……价高者得！', relDelta:5, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_sw_frag1',    icon:'📜', name:'剑法基础残卷', desc:'【剑系残卷】解锁剑气斩初式', price:200, effect:{ manual:'m_sw_frag1' } },
      { id:'m_po_frag1',    icon:'📜', name:'五毒入门残卷', desc:'【毒系残卷】解锁毒系第一式', price:260, effect:{ manual:'m_po_frag1' } },
      { id:'m_sw_partial1', icon:'📗', name:'剑宗秘要残本', desc:'【剑系残本】解锁2式利剑之术', price:380, effect:{ manual:'m_sw_partial1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_poison_cult'],
  },

  // ══════════════════════════════════════════════════════════
  //  青城派·天师洞 NPCs  (sect · 四川青城山 · 阴沉道法)
  // ══════════════════════════════════════════════════════════

  qingcheng_elder: {
    id:'qingcheng_elder', name:'青玄子', role:'青城派掌门', category:'sect', avatar:'🌿',
    city:'qingcheng_peak', level:47, tier:'elite',
    weapon:'wep_iron_sword', armor:'cs_ep_poison',
    silver:250,
    greetings:[
      '青城天下幽，此处机关遍布，外人进来可要小心！',
      '青城道法，以阴沉著称。不是说我们是坏人，只是…手段比较特别！',
      '能到天师洞的，要么武功高强，要么运气极好。你是哪种？',
    ],
    greetingOverrides:[
      {
        requiresSect:'qingcheng',
        greetings:{
          hostile:'（从暗处冷哼）青城派不需要背叛者，自己滚出去！',
          guarded:'（打量）你是新入门青城的弟子？嗯……有点意思。',
          neutral:'（微微现身）既然入了青城派，便是一家人。坐下说话。',
          friendly:'（微微一笑）你回来了青城。青城的机关可有摸熟？',
          close:'（招手）自己人，不客气了。有什么困惑，直说便是。',
        },
      },
    ],
    topics:[
      { id:'qc_elder_join', text:'拜师入门', reply:'从暗处现身青城收徒讲究机缘。你既然找到了这里，说明有缘。但能不能留下，得看你的本事。', relDelta:5, action:'join_sect' },
      { id:'t_qc_elder_teach', text:'请教青城道法', reply:'青城武学以阴毒为特色，讲究后发制人、借力打力。不如峨眉正宗，但在实战中极为难缠！对付正面刚的对手尤其有效！', relDelta:9, action:'train_skill' },
      { id:'t_qc_elder_spar', text:'切磋武艺', reply:'（从身后出现）就这样，这才是青城的方式！（较量后）有意思，你的防御意识不错！', relDelta:10, action:'spar_fight' },
      { id:'t_qc_elder_intel', text:'了解四川武林', reply:'唐门在四川根深叶茂，青城和唐门表面和平，实则互相防范。成都那边唐门弟子最近到处调查什么，青城也在暗中观察！', relDelta:6, intelId:'intel_sect_secret' },
    ],
    shop:{ items:[
      { id:'m_po_frag1',     icon:'📜', name:'五毒入门残卷',   desc:'【毒系残卷】解锁毒术第一式',           price:300, effect:{ manual:'m_po_frag1' } },
      { id:'m_sw_frag1',     icon:'📜', name:'剑法基础残卷',   desc:'【剑系残卷】解锁剑气斩初式',           price:240, effect:{ manual:'m_sw_frag1' } },
      { id:'m_sh_frag1',     icon:'📜', name:'夜行残卷',       desc:'【暗系残卷】解锁暗器快袭第一式',       price:320, effect:{ manual:'m_sh_frag1' } },
      { id:'item_qingcheng_powder', icon:'🌿', name:'青城毒粉',   desc:'阴沉之物，攻击+8(毒伤)',             price:65, effect:{ atkBuff:8 } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
  },

  // ══════════════════════════════════════════════════════════
  //  西夏皇宫·西夏秘宗 NPCs  (sect · 宁夏 · 密宗绝学)
  // ══════════════════════════════════════════════════════════

  xixia_lawking: {
    id:'xixia_lawking', name:'金刚法王', role:'西夏秘宗三法王之一', category:'misc', avatar:'🌙',
    city:'xixia_palace', level:64, tier:'elite',
    weapon:'wep_uc_bamboo_staff', armor:'cs_ep_buddha',
    silver:400,
    greetings:[
      '西夏秘宗，密法无上！你能来到此处，命不该绝于宫外，可喜可贺！',
      '三法王守护西夏皇宫，传承密宗正法！有何来意？',
      '密宗武学，与中原截然不同，感兴趣么？',
    ],
    greetingOverrides:[
      {
        requiresSect:'xixia',
        greetings:{
          hostile:'（金光一现）秘宗教规你都忘了？下次绝不轻饶！',
          guarded:'（打量）你是新入门秘宗的弟子？嗯……密法之道，需慢慢参悟。',
          neutral:'（合掌）既然入了西夏秘宗，便是一家人。坐下，有何困惑？',
          friendly:'（微微一笑）你回来了秘宗。密法修炼可有进展？',
          close:'（招手）自己人，不客气了。有什么事，直说便是。',
        },
      },
    ],
    topics:[
      { id:'xs_law_join', text:'拜师入门', reply:'（金光隐现）西夏秘宗收徒，首重佛缘。你若有心皈依密宗，便先接法王一掌金刚伏魔，能站住者方可入我门。', relDelta:5, action:'join_sect' },
      { id:'t_xs_law_teach', text:'请教密宗武功', reply:'密宗金刚法，以佛力护体，刚猛不可挡！修炼需三密相应——身口意三种修炼缺一不可。非佛缘者，难以入门！', relDelta:10, action:'train_skill' },
      { id:'t_xs_law_spar', text:'切磋武艺', reply:'（合掌低眉，金光乍现）接俺一掌！（较量后）……你确实有非凡之力，难得！', relDelta:12, action:'spar_fight' },
      { id:'t_xs_law_secret', text:'了解西夏秘密', reply:'西夏皇宫深处藏有先王留下的密宗秘典，三法王守护于此。那套秘典记载的不仅是武功，还有整个西夏王朝的来龙去脉……', relDelta:8, intelId:'intel_tianshu' },
    ],
    shop:{ items:[
      { id:'m_ml_frag1',     icon:'📜', name:'命格残卷',       desc:'【命理残卷】解锁天命推算第一式',       price:320, effect:{ manual:'m_ml_frag1' } },
      { id:'m_qm_partial1',  icon:'📗', name:'六爻奇门残本',   desc:'【奇门残本】解锁2式阵法(需partial)',  price:450, effect:{ manual:'m_qm_complete1' } },
      { id:'item_xixia_talisman', icon:'🌙', name:'密宗符咒',   desc:'西域秘制，内力+35',                   price:75, effect:{ mp:35 } },
      { id:'m_sh_frag1',     icon:'📜', name:'夜行残卷',       desc:'【暗系残卷】解锁暗器快袭第一式',       price:300, effect:{ manual:'m_sh_frag1' } },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'],
    intels: ['intel_tianshu'],
  },

  // ══════════════════════════════════════════════════════════
  //  龙象堂·天龙帮 NPCs  (sect · 扬州 · 龙象般若功)
  // ══════════════════════════════════════════════════════════

  tianlong_boss: {
    id:'tianlong_boss', name:'洪震天', role:'天龙帮当家', category:'misc', avatar:'🐉',
    city:'tianlong_stronghold', level:38, tier:'major',
    weapon:'wep_wolf_fang', armor:'cs_general',
    silver:500,
    greetings:[
      '天龙帮控制江南水路，过往商船都要给俺面子！你是来交费的还是来找事的？',
      '龙象般若功，佛门刚猛大法！练到极处，身如金刚，刀枪不入！',
      '俺不喜欢客套话，有什么事直说！',
    ],
    greetingOverrides:[
      {
        requiresSect:'tianlong',
        greetings:{
          hostile:'（冷哼）天龙帮的人，敢吃里扒外？下去领罚！',
          guarded:'（上下打量）你是新入门天龙帮的？嗯……有点种，但还不够。',
          neutral:'（点点头）既然入了天龙帮，便是自己兄弟。坐下说话。',
          friendly:'（拍桌）你回来了天龙！江南水路最近有点动静，你来听听！',
          close:'（招手）自己兄弟不客气！有什么事，说来听听！',
        },
      },
    ],
    topics:[
      { id:'tl_boss_join', text:'拜师入门', reply:'（上下打量）天龙帮不收弱者。想入帮？先跟俺过几招龙象拳——能接住三招的，才算条汉子！', relDelta:5, action:'join_sect' },
      { id:'t_tl_boss_spar', text:'切磋武艺', reply:'（搓搓手掌）来！让俺看看是什么样的高手！（激战后）……不简单！你有这实力，可以在江南走得开！', relDelta:12, action:'spar_fight' },
      { id:'t_tl_boss_trade', text:'谈谈水路合作', reply:'江南水路是俺的地盘，要过路交保护费，这是规矩。但若有本事，也可以帮俺做几件事，互利互惠！', relDelta:7 },
      { id:'t_tl_boss_intel', text:'了解江南势力', reply:'江南最近凌霄阁动作频繁，到处搜集情报，俺也有些不安。另外幽州那边天龙帮老巢最近来了些神秘人，俺还没搞清楚是什么来路！', relDelta:6, intelId:'intel_sect_secret' },
    ],
    shop:{ items:[
      { id:'m_fo_frag1',     icon:'📜', name:'霸拳残卷',       desc:'【力系残卷】解锁蛮拳第一式',           price:260, effect:{ manual:'m_fo_frag1' } },
      { id:'m_bd_frag1',     icon:'📜', name:'少林入门残卷',   desc:'【佛系残卷】解锁罗汉拳第一式',         price:250, effect:{ manual:'m_bd_frag1' } },
      { id:'item_dragon_pill', icon:'🐉', name:'龙象丹',         desc:'天龙帮秘制，气血+50，攻击+5(临时)',   price:90, effect:{ hp:50, atkBuff:5 } },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_matchmaking_trouble','quest_gossip_hidden_wealth'],
    intels: ['intel_sect_secret'],
  },

  tianlong_ferryman: {
    id:'tianlong_ferryman', name:'运河老王', role:'天龙帮船工', category:'special', avatar:'⛵',
    city:'tianlong_stronghold', level:15, tier:'func',
    weapon:'wep_wooden_stick', armor:'cs_cloth',
    silver:40,
    greetings:[
      '天龙帮的船，最快最安全！要去哪里？',
      '运河上的事，老王清楚得很！',
    ],
    topics:[
      { id:'t_tl_fer_route', text:'了解水路情况', reply:'江南水路四通八达！扬州往南到杭州苏州，往北走运河到徐州，什么路都通！就是最近水贼有点多，要小心！', relDelta:4, intelId:'intel_road_bandit' },
      { id:'t_tl_fer_buy', text:'购买水路物资', reply:'船上的东西，实用为主！', relDelta:3, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'item_river_fish', icon:'🐟', name:'运河鲜鱼', desc:'江南鲜鱼，饱食度+45，气血+15', price:20, effect:{ food:45, hp:15 } },
      { id:'item_boat_ration', icon:'🥖', name:'船工干粮', desc:'耐储干粮，饱食度+35', price:12, effect:{ food:35 } },
    ]},
    quests:['quest_river_pirate','quest_ferryman_river_patrol','quest_daily_ferry_errand','quest_daily_gossip_general'],
    intels: ['intel_road_bandit'],
  },

  // ══════════════════════════════════════════════════════════
  //  日月神教·圣殿 NPCs  (sect · 教主)
  // ══════════════════════════════════════════════════════════

  riyue_leader: {
    id:'riyue_leader', name:'日向天', role:'日月神教教主', category:'misc', avatar:'☀',
    city:'riyue_sect', level:120, tier:'func',
    weapon:'wep_sun_spear', armor:'cs_lg_riyue',
    silver:1000,
    greetings:[
      '日月神教，号令天下，莫敢不从！尔等小辈，来此何事？',
      '（高坐宝座之上）本座修炼神功已有大成，天下武林，尽在掌握！',
      '乱世出英雄，本座便是那统一江湖的天命之人！',
    ],
    greetingOverrides:[
      {
        requiresSect:'riyue',
        greetings:{
          hostile:'（冷哼）入了日月神教还想背叛？本座会让人把你的骨头一根根拆了！',
          guarded:'（上下打量）新入门的小子？神教的滋味，尝过了吧？',
          neutral:'（抬眼）既然是日月神教的人，坐下吧。教中最近有点事要你去办。',
          friendly:'（微微一笑）你回来了！日月神教需要你大展身手，有空吗？',
          close:'（招手）自己人，不客气了。有什么打算，说来听听。',
        },
      },
    ],
    topics:[
      { id:'ry_ld_join', text:'拜师入门', reply:'（目光如炬）日月神教收徒，首重忠心！你若想入门，先让本座看看你的本事！', relDelta:5, action:'join_sect' },
      { id:'t_ry_ld_teach', text:'请教神教武学', reply:'日月神教神功以圣火为核，融合光明与黑暗之力。修炼至大成，可与天地同寿！', relDelta:10, action:'train_skill' },
      { id:'t_ry_ld_spar', text:'切磋武艺', reply:'（周身燃起圣火）来！让本座看看你有多少斤两！（较量后）不错，算你有点本事！', relDelta:12, action:'spar_fight' },
      { id:'t_ry_ld_intel', text:'了解神教宏图', reply:'（冷笑）血骨门不过是跳梁小丑，真正有资格一统江湖的，是本座！三魔联盟只是棋子，本座才是执棋之人！', relDelta:8, intelId:'intel_sect_secret' },
      { id:'t_ry_ld_manual', text:'求购神教秘籍', reply:'（冷冷一笑）神教秘技，外人学了也没用。但你既是本教弟子……价格可以商量。', relDelta:5, action:'open_shop' },
    ],
    shop:{ items:[
      { id:'m_fi_frag1',    icon:'📜', name:'炎拳入门残卷',   desc:'【火系残卷】解锁炎拳第一式',             price:280, effect:{ manual:'m_fi_frag1' } },
      { id:'m_fi_partial1', icon:'📗', name:'烈火心法残本',   desc:'【火系残本】解锁2式攻守兼备火焰功法',   price:450, effect:{ manual:'m_fi_partial1' } },
      { id:'m_fi_complete1',icon:'📘', name:'圣火令功法完本', desc:'【火系完本】解锁3式烈焰如龙(需大成)',   price:750, effect:{ manual:'m_fi_complete1' } },
    ]},
    quests:['quest_sect_mission','quest_elder_rogue_disciple','quest_elder_verify_outsider','quest_elder_ancient_tome','quest_daily_sect_patrol','quest_daily_gossip_general'],
    intels: ['intel_sect_secret'],
    // 门派任务链话题
    chainTopics: {
      questId: 'sect_riyue_1',
      topic: { id:'ry_chain_main', text:'【门派任务】教主宏图', reply:'（高坐宝座，俯视天下）血骨门不过是跳梁小丑，真正有资格一统江湖的，是本座！你是日月神教弟子，此事关乎神教霸业……（门派任务链已开启）', action:'start_sect_chain', relDelta:15 },
    },
  },

  // ══════════════════════════════════════════════════════════

});
