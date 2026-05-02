// npc-data-misc.js — 杂项小城镇 NPC（minor城/特殊地点）
// 自动从 npc-data.js 拆分生成

Object.assign(NPC_DB, {
  //  ★ 新增：其余各地 NPC（minor城市/门派山脚/特殊地点）
  // ══════════════════════════════════════════════════════════

  // ── 郑州 ──
  zhengzhou_inn: { id:'zhengzhou_inn', name:'柳大嫂', role:'驿馆老板娘', category:'inn', avatar:'🏠', city:'zhengzhou', level:25, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:30,
    greetings:['中原南北要道，往来客官请进！','今日羊肉烩面新鲜出锅，暖胃！'],
    topics:[
      { id:'t_zz_inn_rest', text:'住店一晚（10两）', reply:'好嘞！上房给你留着，热水毛巾马上就来！', relDelta:5, action:'inn_rest' },
      { id:'t_zz_inn_road', text:'打听道路', reply:'往南过汝州便是南阳，往北经汲县可去河北。近日北边出了些江湖纷争，多加小心！', relDelta:4, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_huimian', icon:'🍜', name:'烩面一碗', desc:'中原特色，饱食度+40', price:8, effect:{ food:40 } },{ id:'item_steamed_bun', icon:'🥙', name:'芝麻烧饼', desc:'饱食度+25，便于携带', price:5, effect:{ food:25 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  zhengzhou_tavern: { id:'zhengzhou_tavern', name:'赵铁嘴', role:'说书先生', category:'tavern', avatar:'📖', city:'zhengzhou', level:26, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:20,
    greetings:['欲知江湖事，且听老赵一言！','今日说的是潼关大战，精彩！'],
    topics:[{ id:'t_zz_tv_story', text:'听他讲江湖', reply:'最近江湖传言，各大门派为一部武学奇书争得头破血流，据说那奇书能让普通人一夜成高手！信不信由你！', relDelta:5, intelId:'intel_tianshu' }],
    shop:null, quests:['quest_drunk_brawl','quest_tavern_troublemaker','quest_tavern_lost_recipe','quest_daily_tavern_supply','quest_matchmaking_trouble','quest_gossip_tavern_fight','quest_gossip_secret_admirer','quest_cricket_debut','quest_cricket_daily'], intels:['intel_tianshu'] },

  // ── 嵩山 ──
  songshan_inn: { id:'songshan_inn', name:'慧真和尚', role:'山道茶寮僧人', category:'tavern', avatar:'☸', city:'songshan', level:16, tier:'func', weapon:'wep_uc_bamboo_staff', armor:'cs_shaolin', silver:25,
    greetings:['阿弥陀佛，施主上嵩山，所为何事？','山路险要，施主请喝杯清茶再走！'],
    topics:[
      { id:'t_ss_inn_rest', text:'在茶寮休息（8两）', reply:'施主请便，草席已铺好，山风清凉，正好养息。', relDelta:5, action:'inn_rest' },
      { id:'t_ss_inn_shaolin', text:'打听少林寺', reply:'少林寺就在山腰以东，香客武人络绎不绝。但外人想入寺拜访，须由引荐才行，不然门口武僧不会放行！', relDelta:6 }
    ],
    shop:{ items:[{ id:'item_herb_tea', icon:'🍵', name:'草药茶', desc:'口渴度-40，精力+15', price:6, effect:{ water:40, energy:15 } },{ id:'item_dry_cake', icon:'🧆', name:'山僧干粮', desc:'饱食度+30', price:8, effect:{ food:30 } }] },
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },
  songshan_herb: { id:'songshan_herb', name:'郝采药', role:'嵩山药农', category:'misc', avatar:'🌿', city:'songshan', level:25, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:35,
    greetings:['嵩山草药最是上乘，要不要带些？','嵩山上好多奇花异草，我已采了三十年了！'],
    topics:[{ id:'t_ss_herb_sell', text:'买些草药', reply:'嵩山的药材质量最好！要什么尽管说，参须、当归、灵芝我都有！', relDelta:5, action:'open_shop' }],
    shop:{ items:[{ id:'item_herb_qi', icon:'🌱', name:'参须片', desc:'气血+30，精力+20', price:18, effect:{ hp:30, energy:20 } },{ id:'item_herb_heal', icon:'🍃', name:'山灵草', desc:'气血+45，解毒', price:25, effect:{ hp:45 } }] },
    quests:['quest_rare_herb','quest_taoist_herb_gather','quest_daily_herbs','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },
  songshan_merchant: { id:'songshan_merchant', name:'钟香客', role:'嵩山香烛杂货商', category:'shop', avatar:'🕯', city:'songshan', level:20, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:50,
    greetings:['来来来，香烛纸钱、干粮盘缠，嵩山下只有我这一家！','上山拜佛要带香，下山要带药，客官备齐了吗？'],
    topics:[{ id:'t_ss_merchant_buy', text:'买些随身物件', reply:'香烛绳索、干粮清水，一应俱全！武林人士要的兵器材料我也偶尔收货。', relDelta:4, action:'open_shop' }],
    shop:{ items:[
      { id:'item_plain_meal',  icon:'🍱', name:'山僧干饼', desc:'饱食度+35', price:8, effect:{ food:35 } },
      { id:'item_clear_water', icon:'💧', name:'山泉水', desc:'口渴度-45', price:4, effect:{ water:45 } },
      { id:'item_bandage',     icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_torch',       icon:'🔦', name:'松脂火把', desc:'照明道具', price:5, effect:{} },
      { id:'item_rope',        icon:'🪢', name:'麻绳', desc:'攀爬探索用', price:8, effect:{} },
    ] },
    quests:['quest_missing_guest','quest_daily_deliver','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },
  songshan_doctor: { id:'songshan_doctor', name:'贺回春', role:'嵩山山脚郎中', category:'medicine', avatar:'💊', city:'songshan', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:65,
    greetings:['嵩山山路陡峭，跌打损伤最多，老夫就在山脚行医。','练武之人来的多，跌伤骨裂是家常便饭。'],
    topics:[{ id:'t_ss_doc_heal', text:'求医问诊', reply:'山脚郎中虽比不得少林寺里的金创圣手，但寻常伤势都能料理！', relDelta:8, action:'heal' }],
    shop:{ type:'medicine', items:[
      { id:'item_bandage',      icon:'🩹', name:'止血绷带',   desc:'气血+50',           price:16, effect:{ hp:50 } },
      { id:'item_medicine',     icon:'💊', name:'疗伤药丸',   desc:'气血+75',           price:26, effect:{ hp:75 } },
      { id:'item_herb_anti',    icon:'🟢', name:'解毒丸',     desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_jingqi_pill',  icon:'⚪', name:'精气丸',     desc:'气血+40，内力+60',  price:22, effect:{ hp:40, mp:60 } },
    ] },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'], intels:['intel_cultivation_tip'] },

  // ── 汝州 ──
  ruzhou_inn: { id:'ruzhou_inn', name:'孙掌柜', role:'汝州旅店老板', category:'inn', avatar:'🏠', city:'ruzhou', level:23, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['汝州这地界，去南阳往荆楚都方便，欢迎投宿！','本店干净实惠，武林人士常来！'],
    topics:[
      { id:'t_rz_inn_rest', text:'住店一晚（10两）', reply:'好嘞！客房刚打扫干净，热水马上送来！', relDelta:5, action:'inn_rest' },
      { id:'t_rz_inn_road', text:'打听南下路况', reply:'往南直去南阳，再往荆州有官道。近来南阳附近有股土匪，背后据说有江湖门派支持！', relDelta:5, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_plain_meal', icon:'🍱', name:'普通便饭', desc:'饱食度+35', price:7, effect:{ food:35 } },{ id:'item_clear_water', icon:'💧', name:'山泉水', desc:'口渴度-45', price:4, effect:{ water:45 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  ruzhou_doctor: { id:'ruzhou_doctor', name:'李神医', role:'游方郎中', category:'medicine', avatar:'💊', city:'ruzhou', level:27, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:60,
    greetings:['豫南多山，伤者不少，老夫行医至此，正是时候！','什么伤都能治，就是要付诊金！'],
    topics:[{ id:'t_rz_doc_heal', text:'求医问诊', reply:'让老夫看看……内伤外伤都有办法！', relDelta:8, action:'heal' }],
    shop:{ type:'medicine', items:[
      { id:'item_bandage',  icon:'🩹', name:'止血绷带', desc:'气血+50',           price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'疗伤药丸', desc:'气血+80',           price:28, effect:{ hp:80 } },
      { id:'item_herb_anti',icon:'🟢', name:'解毒丸',   desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_jingqi_pill',icon:'⚪',name:'精气丸',  desc:'气血+40，内力+60',  price:22, effect:{ hp:40, mp:60 } },
    ] },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'], intels:['intel_cultivation_tip'] },

  // ── 汲县 ──
  jixian_inn: { id:'jixian_inn', name:'王婆', role:'黄河渡口旅馆老板', category:'inn', avatar:'🏠', city:'jixian', level:19, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:22,
    greetings:['黄河渡口旁边，来来往往客官！','渡船每天卯时出发，要赶早！'],
    topics:[
      { id:'t_jx_inn_rest', text:'住店一晚（10两）', reply:'好！客房临河，晚上能听黄河水声，睡得踏实！', relDelta:5, action:'inn_rest' },
      { id:'t_jx_inn_ferry', text:'打听渡船', reply:'从这里渡过黄河去河北，要等对岸回船。最近河面上有水贼，船家收费涨了不少！', relDelta:4, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_river_bun', icon:'🥟', name:'黄河大包子', desc:'饱食度+40，大份实惠', price:6, effect:{ food:40 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  jixian_merchant: { id:'jixian_merchant', name:'田老板', role:'渡口商人', category:'shop', avatar:'💰', city:'jixian', level:27, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:80,
    greetings:['南北货物在此集散，要什么我这里都有！','渡口生意最好，路过的客人都得在我这里补货！'],
    topics:[{ id:'t_jx_mer_trade', text:'购买旅途物资', reply:'旅途物资应有尽有，出门在外不能省这个钱！', relDelta:5, action:'open_shop' }],
    shop:{ items:[{ id:'item_travel_ration', icon:'🥖', name:'旅途干粮', desc:'饱食度+40', price:10, effect:{ food:40 } },{ id:'item_water_bag', icon:'💧', name:'水囊（满）', desc:'口渴度-50', price:8, effect:{ water:50 } }] },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general','quest_escort_debut','quest_escort_plains','quest_escort_daily'], intels:['intel_trade_route'] },

  // ── 洛南 ──
  luonan_inn: { id:'luonan_inn', name:'秦大娘', role:'秦岭山脚旅店老板', category:'inn', avatar:'🏠', city:'luonan', level:25, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:25,
    greetings:['秦岭脚下，山货药材最多！','进山的客人都在这里歇脚，请进！'],
    topics:[
      { id:'t_ln_inn_rest', text:'住店一晚（10两）', reply:'好！山里的夜晚凉，被子给你加厚一床！', relDelta:5, action:'inn_rest' },
      { id:'t_ln_inn_herb', text:'打听山中情况', reply:'秦岭里草药多，但山路险！隐居的高手也不少，有时夜里能听见山上传来练功的声音！', relDelta:5, intelId:'intel_cultivation_tip' }
    ],
    shop:{ items:[{ id:'item_mountain_herb', icon:'🌿', name:'秦岭山草药', desc:'气血+35，精力+15', price:15, effect:{ hp:35, energy:15 } },{ id:'item_plain_meal', icon:'🍱', name:'便饭', desc:'饱食度+35', price:7, effect:{ food:35 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },
  luonan_hermit: { id:'luonan_hermit', name:'隐士老者', role:'秦岭隐居剑客', category:'sect', avatar:'🗡', city:'luonan', level:30, tier:'major', weapon:'wep_iron_sword', armor:'cs_taoist_grey', silver:0,
    greetings:['老夫隐居于此，不问世事，你来何为？','秦岭清幽，是练剑的好地方！'],
    topics:[{ id:'t_ln_her_teach', text:'请教剑法', reply:'剑法之道，在于心境。心无旁骛，剑自生威！（老者演示了几招，果然气势非凡）', relDelta:15, action:'train_skill' },{ id:'t_ln_her_intel', text:'聊聊江湖', reply:'江湖是非太多，老夫已不理会。但近来江湖动荡，恐怕是有什么大事要发生了……', relDelta:8, intelId:'intel_mingjiao_rise' }],
    shop:null, quests:['quest_test_talent','quest_hermit_seek_material','quest_hermit_old_friend','quest_gossip_haunted_inn','quest_daily_gossip_general','chain_hermit_d1'], intels:['intel_mingjiao_rise'] },

  // ── 商州 ──
  shangzhou_inn: { id:'shangzhou_inn', name:'陈掌柜', role:'秦岭小镇旅店老板', category:'inn', avatar:'🏠', city:'shangzhou', level:16, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:20,
    greetings:['秦岭腹地，上下往来的客人常在此歇脚！','往汉中的山路还有两天路程，多备些干粮！'],
    topics:[
      { id:'t_szh_inn_rest', text:'住店一晚（10两）', reply:'好！客房虽小，但干净暖和，山里的夜晚安静！', relDelta:5, action:'inn_rest' },
      { id:'t_szh_inn_road', text:'打听入川路况', reply:'从商州往南翻秦岭就是汉中，那段山路极险！遇到大雪封山，就得等到春天才能走！', relDelta:5, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_mountain_ration', icon:'🧆', name:'山中干粮', desc:'饱食度+45，耐储', price:12, effect:{ food:45 } },{ id:'item_clear_water', icon:'💧', name:'清水', desc:'口渴度-45', price:4, effect:{ water:45 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  shangzhou_smith: { id:'shangzhou_smith', name:'牛铁锤', role:'山中铁匠', category:'blacksmith', avatar:'⚒', city:'shangzhou', level:19, tier:'func', weapon:'wep_meteor_hammer', armor:'cs_general', silver:50,
    greetings:['秦岭铁矿出好铁，我打的刀最锋利！','想买兵器？先让我看看你是什么路数！'],
    topics:[{ id:'t_szh_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把东西拿来看看，秦岭铁匠的眼力不含糊。', relDelta:0, action:'identify_equip' }],
    shop:{ items:[{ id:'item_short_knife', icon:'🗡', name:'秦岭短刀', desc:'轻便锋利，适合山地使用', price:45, effect:{} }] },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'], intels:['intel_trade_route'] },

  // ── 彬州 ──
  bin_zhou_inn: { id:'bin_zhou_inn', name:'高掌柜', role:'泾河旅店老板', category:'inn', avatar:'🏠', city:'bin_zhou', level:21, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:22,
    greetings:['泾河边的小城，去长安的必经之路！','黄土高原的风大，进来暖暖身子！'],
    topics:[
      { id:'t_bz_inn_rest', text:'住店一晚（10两）', reply:'好！泾河水暖，客房里烧着炕，保管暖和！', relDelta:5, action:'inn_rest' },
      { id:'t_bz_inn_xian', text:'打听长安情况', reply:'长安城里帮派林立，据说最近有来自关外的高手闯入，弄得城里不太平！', relDelta:4, intelId:'intel_local_gossip' }
    ],
    shop:{ items:[{ id:'item_millet_cake', icon:'🥮', name:'小米糕', desc:'饱食度+35', price:6, effect:{ food:35 } },{ id:'item_hot_water', icon:'☕', name:'热茶', desc:'口渴度-40，精力+10', price:5, effect:{ water:40, energy:10 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_local_gossip'] },

  // ── 蒲州 ──
  puzhou_inn: { id:'puzhou_inn', name:'冯渡头', role:'黄河渡口船夫', category:'special', avatar:'⛵', city:'puzhou', level:17, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:30,
    greetings:['秦晋咽喉就在这里！从这里渡河，去哪都方便！','黄河湍急，渡河要看天气！'],
    topics:[
      { id:'t_pz_inn_rest', text:'住店一晚（10两）', reply:'好！渡口小店简陋，但能避风遮雨，明天一早渡河正好！', relDelta:5, action:'inn_rest' },
      { id:'t_pz_inn_ferry', text:'了解渡河情况', reply:'黄河这段水流湍急，渡河要选好天气！近来河面上有流寇，渡船都加了护卫，收费也贵了些！', relDelta:5, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_river_fish', icon:'🐟', name:'黄河鲤鱼', desc:'饱食度+45，气血+15', price:18, effect:{ food:45, hp:15 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  puzhou_merchant: { id:'puzhou_merchant', name:'卫商贾', role:'晋商代理', category:'misc', avatar:'💰', city:'puzhou', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:120,
    greetings:['晋商走遍天下，物资齐全！','秦晋两地货物，在此集散！'],
    topics:[{ id:'t_pz_mer_trade', text:'购买物资', reply:'晋商的货，保质保量！', relDelta:5, action:'open_shop' }],
    shop:{ items:[
      { id:'item_travel_ration', icon:'🥖', name:'旅途干粮', desc:'饱食度+40',         price:8,  effect:{ food:40 } },
      { id:'item_medicine',      icon:'💊', name:'疗伤药丸', desc:'气血+80',            price:28, effect:{ hp:80 } },
      { id:'item_whet',          icon:'🪨', name:'磨刀石',   desc:'攻击+8，持续5回合', price:10, effect:{ atkBuff:8, turns:5 } },
    ] },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general','quest_escort_debut','quest_escort_plains','quest_escort_daily'], intels:['intel_trade_route'] },

  // ── 华阴县 ──
  huayin_inn: { id:'huayin_inn', name:'张婆子', role:'华山脚下旅店老板', category:'inn', avatar:'🏠', city:'huayin', level:15, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:25,
    greetings:['华山香客武人都住我家！','华山剑气从山上传来，让人精神！'],
    topics:[
      { id:'t_hy_inn_rest', text:'住店一晚（10两）', reply:'好！华山脚下空气清新，睡一晚精神百倍！', relDelta:5, action:'inn_rest' },
      { id:'t_hy_inn_huashan', text:'打听华山情况', reply:'华山上的剑宗峰，气宗峰之争从没停过！近来似乎有大批武人上山，说是有什么武功秘典要公开传授，不知真假！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_plain_meal', icon:'🍱', name:'家常饭', desc:'饱食度+35', price:7, effect:{ food:35 } },{ id:'item_herb_tea', icon:'🍵', name:'山茶', desc:'口渴度-40，精力+10', price:5, effect:{ water:40, energy:10 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  huayin_guide: { id:'huayin_guide', name:'石向导', role:'华山向导', category:'misc', avatar:'⛰', city:'huayin', level:26, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:40,
    greetings:['想上华山？我带路最稳！','华山共五峰，北峰最易，南峰最险！'],
    topics:[{ id:'t_hy_guide_path', text:'了解上山路', reply:'华山正道从北峰上，但听说华山派弟子会在半山检查来路不明的武人。若是有门派引荐信或者武功够强，那就没事！', relDelta:7 }],
    shop:{ items:[{ id:'item_mountain_ration', icon:'🧆', name:'山行干粮', desc:'饱食度+45，精力+10', price:12, effect:{ food:45, energy:10 } }] },
    quests:['quest_guide_mountain_path','quest_spy_trail','quest_daily_hunt_wild','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 华州 ──
  huazhou_inn: { id:'huazhou_inn', name:'林掌柜', role:'华州旅店老板', category:'inn', avatar:'🏠', city:'huazhou', level:26, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:25,
    greetings:['华州武人多，旅店每晚客满！','华山脚下的小城，武功交流最多！'],
    topics:[
      { id:'t_hz_inn_rest', text:'住店一晚（10两）', reply:'好！华州武风盛，住店的都是江湖好汉，安全得很！', relDelta:5, action:'inn_rest' },
      { id:'t_hz_inn_market', text:'打听武林动态', reply:'华州的武馆最多，各家功法都不一样。据说有家武馆新来了个神秘馆主，武功了得，连华山弟子都去拜访！', relDelta:5, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_plain_meal', icon:'🍱', name:'便饭', desc:'饱食度+35', price:7, effect:{ food:35 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  huazhou_smith: { id:'huazhou_smith', name:'铁真人', role:'华州兵器铺', category:'misc', avatar:'⚒', city:'huazhou', level:19, tier:'func', weapon:'wep_iron_sword', armor:'cs_general', silver:80,
    greetings:['华州的剑，最合适华山剑法！','老夫打剑三十年，剑气这东西我感觉得到！'],
    topics:[{ id:'t_hz_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把兵器取来，老夫三十年眼力，瞧得出门道。', relDelta:0, action:'identify_equip' }],
    shop:{ items:[{ id:'item_iron_sword', icon:'⚔', name:'华州铁剑', desc:'攻击+5，轻盈适合剑法', price:80, effect:{} }] },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 安阳 ──
  anyang_inn: { id:'anyang_inn', name:'殷掌柜', role:'殷商古都旅店老板', category:'inn', avatar:'🏠', city:'anyang', level:23, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:22,
    greetings:['殷都遗址就在城外，历史悠久的地方！','南来北往的客人，这里最方便！'],
    topics:[
      { id:'t_ay_inn_rest', text:'住店一晚（10两）', reply:'好！殷都古城的夜晚安静，睡得踏实！', relDelta:5, action:'inn_rest' },
      { id:'t_ay_inn_history', text:'打听本地消息', reply:'安阳出了不少奇门遁甲的高手，说是跟甲骨文里的古法有关系。最近有人在城外古遗址挖东西，也不知道在找什么！', relDelta:5, intelId:'intel_treasure_cave' }
    ],
    shop:{ items:[{ id:'item_local_cake', icon:'🥮', name:'豫北扁饼', desc:'饱食度+35', price:6, effect:{ food:35 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_treasure_cave'] },
  anyang_scholar: { id:'anyang_scholar', name:'卜文先生', role:'研究甲骨文的隐士', category:'quest', avatar:'📜', city:'anyang', level:37, tier:'major', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:0,
    greetings:['甲骨文里藏有古代武学秘密，老夫已研究了二十年！','殷商的奇门遁甲之术，远超现代江湖认知！'],
    topics:[{ id:'t_ay_sch_intel', text:'请教奇门之术', reply:'奇门遁甲发源于殷商，甲骨文中有大量记载！老夫解读出其中几个心法，改日传授与你！', relDelta:15, action:'train_skill' }],
    shop:null, quests:['quest_lost_book','quest_scholar_collect_poems','quest_scholar_protect_scroll','quest_daily_copy_errand','quest_poet_odd_client','quest_gossip_plagiarism'], intels:['intel_tianshu'] },

  // ── 海仓港 ──
  haicang_inn: { id:'haicang_inn', name:'方船长', role:'渤海老船长', category:'misc', avatar:'⚓', city:'haicang', level:17, tier:'func', weapon:'wep_dark_knife', armor:'cs_cloth', silver:50,
    greetings:['渤海边的港口，海风咸腥！要搭船出海吗？','海上的事，问我就对了！'],
    topics:[
      { id:'t_hc_inn_rest', text:'住店一晚（10两）', reply:'好！海边小屋简陋，但能听涛声入眠，别有一番风味！', relDelta:5, action:'inn_rest' },
      { id:'t_hc_inn_sea', text:'打听海上情况', reply:'东边的海沙派在这一带很活跃，商船都要给他们过路费。不过最近听说有人从大洋彼岸来，带来了不寻常的武功秘法！', relDelta:7, intelId:'intel_kunlun_sword' }
    ],
    shop:{ items:[{ id:'item_dried_fish', icon:'🐟', name:'腌制咸鱼', desc:'饱食度+35，耐储', price:8, effect:{ food:35 } },{ id:'item_sea_water', icon:'💧', name:'淡水（桶）', desc:'口渴度-50', price:10, effect:{ water:50 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_kunlun_sword'] },
  haicang_merchant: { id:'haicang_merchant', name:'柯海商', role:'海上商人', category:'shop', avatar:'💰', city:'haicang', level:23, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:150,
    greetings:['海外奇珍，只此一家！','从南洋运来的货，你们内陆没见过！'],
    topics:[{ id:'t_hc_mer_exotic', text:'看看海外商品', reply:'南洋宝石、西域香料、东瀛刀剑，应有尽有！', relDelta:6, action:'open_shop' }],
    shop:{ items:[{ id:'item_nanyang_fruit', icon:'🍍', name:'南洋鲜果', desc:'饱食度+40，口渴度-30', price:15, effect:{ food:40, water:30 } },{ id:'item_exotic_herb', icon:'🌺', name:'海外草药', desc:'气血+60', price:40, effect:{ hp:60 } }] },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general','quest_escort_debut','quest_escort_plains','quest_escort_daily'], intels:['intel_trade_route'] },

  // ── 桃花岛渡口 ──
  taohuadao_coast_inn: { id:'taohuadao_coast_inn', name:'苏渡夫', role:'桃花岛摆渡人', category:'misc', avatar:'🌸', city:'taohuadao_coast', level:16, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:35,
    greetings:['想去桃花岛？没有岛主许可，这船不敢开！','东海风大浪急，要上岛得找引荐！'],
    topics:[
      { id:'t_tdc_inn_rest', text:'住店一晚（10两）', reply:'好！渡口小店能避风浪，等天气好了再出海不迟！', relDelta:5, action:'inn_rest' },
      { id:'t_tdc_ferry_info', text:'打听桃花岛情况', reply:'桃花岛外围有迷阵，普通人进去要迷路三天三夜。岛上风景极美，但岛主东邪脾气古怪，没他点头谁都不让上岛！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_dried_fish', icon:'🐟', name:'咸鱼干', desc:'饱食度+35', price:8, effect:{ food:35 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 桃花岛 ──
  taohuadao_villager: { id:'taohuadao_villager', name:'花姑娘', role:'桃花岛渔村少女', category:'misc', avatar:'🌺', city:'taohuadao', level:28, tier:'func', weapon:'wep_wooden_stick', armor:'cs_emei', silver:20,
    greetings:['外来客人好少见！我们岛上很少有人来！','桃花开了又落，每年都很美！'],
    topics:[{ id:'t_td_vil_guide', text:'了解岛上情况', reply:'岛上中间那片林子不能乱进，是东邪阁主设了迷阵的地方！我们村民都走沿海小路！', relDelta:8 }],
    shop:{ items:[{ id:'item_peach_wine', icon:'🍷', name:'桃花酿', desc:'口渴度-40，精力+25，魅力+5', price:22, effect:{ water:40, energy:25 } },{ id:'item_fresh_fish', icon:'🐟', name:'东海鲜鱼', desc:'饱食度+45，气血+15', price:18, effect:{ food:45, hp:15 } }] },
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'], intels:['intel_sect_secret'] },
  taohuadao_fisher: { id:'taohuadao_fisher', name:'陈老渔', role:'桃花岛老渔夫', category:'misc', avatar:'🎣', city:'taohuadao', level:25, tier:'func', weapon:'wep_dark_knife', armor:'cs_cloth', silver:25,
    greetings:['老汉在这岛上打了四十年鱼！','东邪岛主武功盖世，但对我们渔民还不错！'],
    topics:[{ id:'t_td_fisher_intel', text:'打听岛上事', reply:'东邪阁主很少下山，最近好像有批中原武人偷偷摸上来，被迷阵困住了，哈哈！', relDelta:6, intelId:'intel_sect_secret' }],
    shop:null, quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol','quest_daily_fish_crucian'], intels:['intel_sect_secret'] },


  // ── 明州 ──
  mingzhou_inn: { id:'mingzhou_inn', name:'周船家', role:'明州渔港掌柜', category:'misc', avatar:'⚓', city:'mingzhou', level:19, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:30,
    greetings:['明州是出海的门户，往来客官请进！','海上风大，在这里休息好了再出发！'],
    topics:[
      { id:'t_mz_inn_rest', text:'住店一晚（10两）', reply:'好！渔港客栈虽简陋，但海鲜管够，吃完睡个好觉！', relDelta:5, action:'inn_rest' },
      { id:'t_mz_inn_sea', text:'打听出海情况', reply:'海沙岛就在明州东边不远处，海沙派在这一带横行已久。最近有传言说东海上出现了一支神秘船队，来路不明！', relDelta:5, intelId:'intel_trade_route' }
    ],
    shop:{ items:[{ id:'item_seafood', icon:'🦐', name:'明州海鲜', desc:'饱食度+45，口渴度-20', price:20, effect:{ food:45, water:20 } }] },
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_trade_route'] },
  mingzhou_smuggler: { id:'mingzhou_smuggler', name:'暗客甲', role:'海上走私客', category:'misc', avatar:'🏴', city:'mingzhou', level:28, tier:'func', weapon:'wep_short_knife', armor:'cs_assassin', silver:80,
    greetings:['（压低声音）想买些特殊货？只此一家！','做生意要低调，懂吗？'],
    topics:[{ id:'t_mz_smug_buy', text:'看看有什么货', reply:'这些东西从海外来的，中原没有！', relDelta:3, action:'open_shop' }],
    shop:{ items:[{ id:'item_exotic_poison', icon:'💀', name:'海外奇毒', desc:'可用于武器，战斗效果+', price:60, effect:{} },{ id:'item_sea_herb', icon:'🌊', name:'海底珍草', desc:'内力+30，气血+40', price:50, effect:{ mp:30, hp:40 } }] },
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'], intels:['intel_trade_route'] },

  // ── 南阳 ──
  nanyang_inn: { id:'nanyang_inn', name:'武掌柜', role:'南阳旅店老板', category:'inn', avatar:'🏠', city:'nanyang', level:25, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:25,
    greetings:['卧龙岗就在城外，历史名地！','南阳盆地，四通八达，欢迎投宿！'],
    topics:[
      { id:'t_ny_inn_rest', text:'住店一晚（10两）', reply:'好！南阳盆地气候宜人，睡一晚精神饱满！', relDelta:5, action:'inn_rest' },
      { id:'t_ny_inn_road', text:'打听南下路况', reply:'往南过了薄山就是荆州，往西南是汉中方向。最近荆楚一带据说有门派械斗，走的时候带些防身的东西！', relDelta:5, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_plain_meal', icon:'🍱', name:'南阳烩菜', desc:'饱食度+38', price:8, effect:{ food:38 } },{ id:'item_clear_water', icon:'💧', name:'清水', desc:'口渴度-45', price:4, effect:{ water:45 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  nanyang_scholar: { id:'nanyang_scholar', name:'诸先生', role:'卧龙岗隐居先生', category:'misc', avatar:'📜', city:'nanyang', level:33, tier:'major', weapon:'wep_tao_charm', armor:'cs_cloth', silver:0,
    greetings:['隆中对策，智者之论！武林之事亦需谋略！','只会武功不够，还需用脑！'],
    topics:[{ id:'t_ny_sch_intel', text:'请教谋略', reply:'行走江湖，武功是其次，谋略才是根本！老夫观你资质不错，且听几句指点……', relDelta:12 },{ id:'t_ny_sch_teach', text:'请教武学心法', reply:'武功修炼贵在心法，心法通则百功通！', relDelta:10, action:'train_skill' }],
    shop:null, quests:['quest_lost_book','quest_scholar_collect_poems','quest_scholar_protect_scroll','quest_daily_copy_errand','quest_poet_odd_client','quest_gossip_plagiarism'], intels:['intel_mingjiao_rise'] },

  // ── 襄阳城 ──
  xiangyang_inn: { id:'xiangyang_inn', name:'郭掌柜', role:'襄阳大旅店老板', category:'inn', avatar:'🏠', city:'xiangyang', level:49, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:60,
    greetings:['襄阳城，郭大侠守护过的地方！','汉水北岸的雄城，武林人士最多！'],
    topics:[
      { id:'t_xy_inn_rest', text:'住店一晚（10两）', reply:'好！襄阳城英雄辈出，住在这里沾点侠气！', relDelta:5, action:'inn_rest' },
      { id:'t_xy_inn_history', text:'打听本城往事', reply:'当年郭大侠守城数十年，城内百姓至今感念！现在还有不少人来寻访遗迹，城里的武林人士也最喜欢谈论这段历史！', relDelta:6, intelId:'intel_mingjiao_rise' }
    ],
    shop:{ items:[{ id:'item_yangjing_fish', icon:'🐟', name:'汉水鲜鱼', desc:'饱食度+45，气血+20', price:20, effect:{ food:45, hp:20 } },{ id:'item_plain_meal', icon:'🍱', name:'家常便饭', desc:'饱食度+38', price:8, effect:{ food:38 } }] },
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_mingjiao_rise'] },
  xiangyang_general: { id:'xiangyang_general', name:'铁卫将', role:'守城武将', category:'misc', avatar:'⚔', city:'xiangyang', level:51, tier:'major', weapon:'wep_uc_spear', armor:'cs_general', silver:200,
    greetings:['守护襄阳，是每个武人的荣耀！','想进城？先说明来意！'],
    topics:[{ id:'t_xy_gen_spar', text:'切磋武艺', reply:'（昂然而立）守城的武将不轻易动手，但若你有真本事，我倒愿意见识见识！（大战之后）不错，你确有守城之才！', relDelta:15, action:'spar_fight' },{ id:'t_xy_gen_intel', text:'了解周边军情', reply:'最近北方蒙古铁骑又有动向，加上各路江湖人马都往荆楚聚集，形势复杂！', relDelta:8, intelId:'intel_road_bandit' }],
    shop:null, quests:['quest_patrol_road','quest_guard_spy_hunt','quest_guard_bandit_clear','quest_daily_guard_patrol'], intels:['intel_road_bandit'] },
  xiangyang_smith: { id:'xiangyang_smith', name:'汉水铸造坊', role:'铸兵大师', category:'blacksmith', avatar:'⚒', city:'xiangyang', level:34, tier:'func', weapon:'wep_meteor_hammer', armor:'cs_general', silver:120,
    greetings:['汉水铁矿质量一流，我打的兵器连守城都用！','要打兵器，我是整个荆楚最好的师傅！'],
    topics:[],
    shop:{ items:[{ id:'item_hanshui_sword', icon:'⚔', name:'汉水长刀', desc:'攻击+8，坚固耐用', price:120, effect:{} }] },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'], intels:['intel_trade_route'] },

  // ── 武当山镇 ──
  wudang_town_inn: { id:'wudang_town_inn', name:'青云道姑', role:'山镇道观接待', category:'misc', avatar:'☯', city:'wudang_town', level:20, tier:'func', weapon:'wep_iron_sword', armor:'cs_taoist_grey', silver:40,
    greetings:['武当山下，道家圣地！上山需有引荐，否则请在镇中休息！','太极之道，以柔克刚！'],
    topics:[
      { id:'t_wdt_inn_rest', text:'在道观休息（8两）', reply:'施主请便，厢房已备好，道家清净之地，正好养息。', relDelta:5, action:'inn_rest' },
      { id:'t_wdt_inn_wudang', text:'了解武当派', reply:'武当七侠各有绝技，掌门功力深厚！想拜入武当门下，需先通过考验，以示资质！', relDelta:7, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_taoist_tea', icon:'🍵', name:'道家养生茶', desc:'精力+30，内力+20', price:12, effect:{ energy:30, mp:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  wudang_town_doctor: { id:'wudang_town_doctor', name:'清虚道人', role:'武当山道医', category:'misc', avatar:'💊', city:'wudang_town', level:27, tier:'func', weapon:'wep_wooden_stick', armor:'cs_taoist_grey', silver:80,
    greetings:['道家医术，讲究阴阳调和！','内力修炼配合药理，才是养生之道！'],
    topics:[{ id:'t_wdt_doc_heal', text:'求医问诊', reply:'道家医术注重内外兼修，内力受损老道也能帮你调理！', relDelta:8, action:'heal' }],
    shop:{ type:'medicine', items:[{ id:'item_wudang_herb', icon:'🌿', name:'武当秘制药草', desc:'气血+50，内力+30', price:30, effect:{ hp:50, mp:30 } }] },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },

  // ── 沙市 ──
  shashi_inn: { id:'shashi_inn', name:'李摆渡', role:'长江渡口旅店老板', category:'inn', avatar:'🏠', city:'shashi', level:17, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:22,
    greetings:['长江渡口，往来的客官请住下！','从这里入川或去湖南，都要从我这里过！'],
    topics:[
      { id:'t_ss_inn_rest', text:'住店一晚（10两）', reply:'好！长江边湿气重，客房里烧着炭火，保管暖和！', relDelta:5, action:'inn_rest' },
      { id:'t_ss_inn_road', text:'打听水路情况', reply:'长江这段水流湍急，大船小船都有，但水贼时有出没。往西入川要走峡道，往南去湖南走陆路！', relDelta:5, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_river_fish', icon:'🐟', name:'长江鲜鱼', desc:'饱食度+45，气血+15', price:18, effect:{ food:45, hp:15 } },{ id:'item_plain_meal', icon:'🍱', name:'便饭', desc:'饱食度+35', price:7, effect:{ food:35 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },

  // ── 信阳 ──
  xinyang_inn: { id:'xinyang_inn', name:'周药农', role:'大别山药农兼旅店老板', category:'inn', avatar:'🌿', city:'xinyang', level:23, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['大别山草药最好，路过要买些！','中原进入江淮的要道，欢迎！'],
    topics:[
      { id:'t_xy2_inn_rest', text:'住店一晚（10两）', reply:'好！山里的夜晚安静，还有草药香，睡得踏实！', relDelta:5, action:'inn_rest' },
      { id:'t_xy2_inn_herb', text:'打听草药', reply:'大别山里草药奇多！特别是千年参和灵芝，时不时有山民挖到！', relDelta:6, intelId:'intel_cultivation_tip' }
    ],
    shop:{ items:[{ id:'item_herb_qi', icon:'🌱', name:'参须片', desc:'气血+30，精力+20', price:18, effect:{ hp:30, energy:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },

  // ── 合肥 ──
  hefei_inn: { id:'hefei_inn', name:'吴掌柜', role:'合肥旅店老板', category:'inn', avatar:'🏠', city:'hefei', level:27, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['合肥四战之地，镖局船帮都在这里争生意！','巢湖鲜鱼天下闻名，要来一份吗？'],
    topics:[
      { id:'t_hf_inn_rest', text:'住店一晚（10两）', reply:'好！合肥地处要冲，往来人多，客房天天爆满，你来得正好！', relDelta:5, action:'inn_rest' },
      { id:'t_hf_inn_local', text:'打听本地情况', reply:'合肥镖局和船帮之间最近又起纷争，各方都在拉拢江湖人手。若你武功好，两边都想招揽！', relDelta:5, intelId:'intel_trade_route' }
    ],
    shop:{ items:[{ id:'item_chaohu_fish', icon:'🐟', name:'巢湖白鱼', desc:'饱食度+48，气血+15', price:20, effect:{ food:48, hp:15 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_trade_route'] },
  hefei_guild: { id:'hefei_guild', name:'刘镖头', role:'合肥镖局总头领', category:'escort', avatar:'🏛', city:'hefei', level:33, tier:'major', weapon:'wep_uc_spear', armor:'cs_general', silver:200,
    greetings:['合肥镖局走镖三十年，天下没有走不通的路！','要押镖？找我！'],
    topics:[
      { id:'t_hf_guild_task', text:'接一单护镖', reply:'合肥到南京、武汉都有镖路，你挑一条。路上不太平，报酬丰厚！', relDelta:10, action:'open_escort' },
      { id:'t_hf_guild_spar', text:'切磋武艺', reply:'走镖的功夫讲究实用！来，见识见识！', relDelta:12, action:'spar_fight' },
      { id:'t_hf_guild_road', text:'打听镖路情况', reply:'往南走南京，汴淮水道发达，沿途还算太平；往西走武汉，过了岳阳就进山区，得小心山匪！', relDelta:5 },
    ],
    shop:null, quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol','quest_escort_rescue','quest_escort_reconnaissance'], intels:['intel_trade_route'] },

  // ══════════════════════════════════════════════════════════
  //  合肥·商会掌柜（商店NPC）
  // ══════════════════════════════════════════════════════════
  hefei_merchant: {
    id:'hefei_merchant', name:'周通达', role:'合肥商会掌柜', category:'shop', avatar:'💰',
    city:'hefei', level:30, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:200,
    giftPrefs:{
      label:'新奇货物与实用物资',
      love:['raretrade','mechanism'],
      like:['pelt','mystic'],
      thanksLoved:['好东西！周某做买卖这么多年，这眼力还是有的。','你出手不凡，周某记着了。'],
      thanksLiked:['有点意思，周某收下了。'],
      questHint:'周通达压低声音，神色亲热了不少，像是终于肯把那单买卖说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问周掌柜这单「${questName}」` : '追问周掌柜手里那单买卖',
        questReply: ({ questName }) => questName
          ? `周通达拍了拍箱子：\"既然你诚心想沾这笔生意，周某也不瞒你——${questName}。去任务页看，路线都标好了。\"` : '周通达把账本一合：\"我手里正有批货运，你若顺路，报酬好商量。去任务页看看吧。\"',
        intelText: () => '请周掌柜把这条商路细说分明',
        intelReply: ({ intelText }) => `周通达压低了声音：\"${intelText}\"`,
        warmText: () => '顺着账目继续往下谈',
        warmReply: ({ npcName }) => `${npcName}把货物单据收好：\"你是实在人。周某的买卖，往后少不了你帮忙。\"`,
      }
    },
    greetings:{
      hostile:['周某做正经买卖，不陪无聊人消磨时间。'],
      guarded:['先说清楚要什么，再谈别的。'],
      neutral:['合肥南来北往，什么货都有。周某这儿只卖好东西。','巢湖鱼米之乡，货物充足，你来对地方了！'],
      friendly:['来得正好，正好有批新货刚到，你眼光不错。'],
      close:['你是周某信得过的人，有些路子旁人不能走，你可以。'],
    },
    topics:[
      { id:'t_hf_merch_buy',  text:'看看货物', reply:'这都是周某走南闯北收来的好货，品质有保证。', relDelta:0, action:'open_shop' },
      { id:'t_hf_merch_task', text:'问问有没有任务', reply:'有批货要从合肥送去南京，你若顺路，可以看看。', relDelta:3 },
      { id:'t_hf_merch_info', text:'打听商道行情', reply:'往南走南京，走水路最稳；往西走武汉，过了山区就是内陆，路上得小心山匪。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_hf_merch_cricket', text:'听说贵店有蛐蛐笼卖？', reply:'蛐蛐笼？有是有，不过最近进的少了。你诚心要的话，周某可以给你留一个。', relDelta:1 },
    ],
    shop:{
      items:[
        { id:'item_elixir',      name:'灵药',       desc:'回复气血内力各50',       icon:'⚗',  price:35, effect:{hp:50, mp:50} },
        { id:'item_travel_ration',name:'行路干粮',  desc:'饱食度+40',             icon:'🧆', price:8,  effect:{food:40} },
        { id:'item_wine_age',    name:'陈年汾酒',   desc:'精力+40',               icon:'🍯', price:20, effect:{energy:40} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备', icon:'🧺', price:40, effect:{} },
        // ── 高价值商品（经济平衡 A 类）──
        { id:'item_blood_pill',  name:'活血再造丹', desc:'气血上限永久+30，需逐步吸收', icon:'❤️‍🔥', price:250, effect:{maxHp:30} },
        { id:'item_qi_pill',     name:'培元丹',     desc:'内力上限永久+20，需逐步吸收', icon:'💎', price:180, effect:{maxMp:20} },
        { id:'item_teleport_scroll',name:'千里传音符', desc:'瞬间传送至任意已解锁城市',   icon:'🏇', price:30, effect:{teleport:true} },
        { id:'item_mat_pack_iron',name:'铁矿材料包', desc:'含铁矿石×8、煤炭×5',         icon:'⛏️', price:65, effect:{materialPack:['item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_iron_ore','item_coal','item_coal','item_coal','item_coal','item_coal']} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_gossip_weird_duel','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
    intels:['intel_trade_route'],
  },

  // ── 庐州 ──
  luzhou_inn: { id:'luzhou_inn', name:'巢湖渔老', role:'庐州渔夫兼旅店老板', category:'inn', avatar:'🏠', city:'luzhou', level:15, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:22,
    greetings:['庐州巢湖，鱼最肥！','江淮一带最安逸的地方就是这里了！'],
    topics:[
      { id:'t_lzh_inn_rest', text:'住店一晚（10两）', reply:'好！湖边小屋能听水声入眠，别有一番风味！', relDelta:5, action:'inn_rest' },
      { id:'t_lzh_inn_lake', text:'聊聊巢湖', reply:'巢湖里有宝贝，据说湖底有一座沉没的古城！每到月圆夜，还能看见湖底有光！', relDelta:6, intelId:'intel_treasure_cave' }
    ],
    shop:{ items:[{ id:'item_lake_fish', icon:'🐟', name:'巢湖鲫鱼', desc:'饱食度+42', price:15, effect:{ food:42 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_treasure_cave'] },

  // ── 岳阳楼 ──
  yueyang_inn: { id:'yueyang_inn', name:'范老板', role:'岳阳楼酒楼老板', category:'misc', avatar:'🏮', city:'yueyang', level:24, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:45,
    greetings:['先天下之忧而忧，后天下之乐而乐！此处便是岳阳楼！','洞庭湖景色天下第一，欢迎光临！'],
    topics:[
      { id:'t_yy_inn_rest', text:'住店一晚（10两）', reply:'好！岳阳楼上观洞庭，睡一晚神仙也不换！', relDelta:5, action:'inn_rest' },
      { id:'t_yy_inn_lake', text:'欣赏洞庭湖景', reply:'洞庭湖号称八百里，风浪时发，水贼也多。听说洞庭水贼里头有不少是失意的江湖人，不得已才落草！', relDelta:6, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_dongting_fish', icon:'🐟', name:'洞庭鲜鱼', desc:'饱食度+48，气血+20', price:22, effect:{ food:48, hp:20 } },{ id:'item_yellow_crane_wine', icon:'🍷', name:'岳阳名酒', desc:'口渴度-40，精力+25', price:18, effect:{ water:40, energy:25 } }] },
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  yueyang_poet: { id:'yueyang_poet', name:'落魄诗人', role:'游历文人', category:'misc', avatar:'📝', city:'yueyang', level:20, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:5,
    greetings:['登斯楼也，则有心旷神怡，宠辱皆忘！','（感叹）范仲淹若是武林中人，定是一代宗师！'],
    topics:[{ id:'t_yy_poet_intel', text:'他乡遇故人，聊聊江湖', reply:'我游历江南多年，见闻颇广。最近各门派都在暗中活动，好像在争夺什么重要的东西……', relDelta:7, intelId:'intel_tianshu' }],
    shop:null, quests:['quest_song_request','quest_scholar_collect_poems','quest_scholar_protect_scroll','quest_daily_copy_errand','quest_poet_odd_client','quest_gossip_plagiarism'], intels:['intel_tianshu'] },

  // ── 九江 ──
  jiujiang_inn: { id:'jiujiang_inn', name:'庐山隐者', role:'九江旅店老板', category:'inn', avatar:'🏮', city:'jiujiang', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['长江要冲，庐山脚下！','庐山瀑布水大云多，修炼好地方！'],
    topics:[
      { id:'t_jj_inn_rest', text:'住店一晚（10两）', reply:'好！庐山脚下空气清新，睡一晚精神百倍！', relDelta:5, action:'inn_rest' },
      { id:'t_jj_inn_lushan', text:'打听庐山情况', reply:'庐山里隐居的高手不少，但大多不见外客。据说山顶有一个白发老者，武功通天，却从不下山！', relDelta:6, intelId:'intel_cultivation_tip' }
    ],
    shop:{ items:[{ id:'item_lushan_tea', icon:'🍵', name:'庐山云雾茶', desc:'口渴度-45，精力+25', price:15, effect:{ water:45, energy:25 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },

  // ── 南昌 ──
  nanchang_inn: { id:'nanchang_inn', name:'赣水掌柜', role:'南昌旅店老板', category:'inn', avatar:'🏠', city:'nanchang', level:15, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:26,
    greetings:['赣江之滨，南昌城欢迎您！','来往江南的客官请进！'],
    topics:[
      { id:'t_nc_inn_rest', text:'住店一晚（10两）', reply:'好！南昌城热闹，晚上还有夜市，住一晚好好逛逛！', relDelta:5, action:'inn_rest' },
      { id:'t_nc_inn_local', text:'打听本城消息', reply:'南昌城里最近来了不少外地武人，说是听到了什么宝藏线索，都在往江西山里跑！', relDelta:5, intelId:'intel_treasure_cave' }
    ],
    shop:{ items:[{ id:'item_plain_meal', icon:'🍱', name:'赣菜便饭', desc:'饱食度+38', price:8, effect:{ food:38 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_treasure_cave'] },
  nanchang_merchant: { id:'nanchang_merchant', name:'瓷器商贩', role:'景德镇瓷商', category:'misc', avatar:'💰', city:'nanchang', level:16, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:100,
    greetings:['景德镇瓷器，天下第一！','往北往南，我都要跑！'],
    topics:[{ id:'t_nc_mer_trade', text:'购买物资', reply:'我这里东西不少，旅途必备！', relDelta:4, action:'open_shop' }],
    shop:{ items:[{ id:'item_travel_ration', icon:'🥖', name:'旅途干粮', desc:'饱食度+40', price:10, effect:{ food:40 } },{ id:'item_water_bag', icon:'💧', name:'水囊（满）', desc:'口渴度-50', price:8, effect:{ water:50 } }] },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general','quest_escort_debut','quest_escort_plains','quest_escort_daily'], intels:['intel_trade_route'] },

  // ── 衡阳 ──
  hengyang_inn: { id:'hengyang_inn', name:'衡山道士', role:'南岳道观接待', category:'misc', avatar:'⛰', city:'hengyang', level:20, tier:'func', weapon:'wep_iron_sword', armor:'cs_taoist_grey', silver:30,
    greetings:['南岳衡山，道观武馆众多！','衡山派虽不在名门之列，功夫也有几分！'],
    topics:[
      { id:'t_hy2_inn_rest', text:'在道观休息（8两）', reply:'施主请便，厢房已备好，南岳清净之地，正好养息。', relDelta:5, action:'inn_rest' },
      { id:'t_hy2_inn_sect', text:'打听衡山派', reply:'衡山派传承悠久，剑法以衡山四景为名，自成一格。虽然名气不如华山，在湖南一带颇受尊重！', relDelta:7, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_herb_tea', icon:'🍵', name:'南岳养生茶', desc:'精力+30，内力+15', price:10, effect:{ energy:30, mp:15 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  hengyang_swordsman: { id:'hengyang_swordsman', name:'衡剑客', role:'流浪剑客', category:'sect', avatar:'⚔', city:'hengyang', level:38, tier:'major', weapon:'wep_iron_sword', armor:'cs_cloth', silver:50,
    greetings:['走遍湖南，练剑未停！','剑客的脚步不会停，直到遇到真正的对手！'],
    topics:[{ id:'t_hy2_sword_spar', text:'切磋剑法', reply:'（拔剑而立）好！正想找个对手试试新学的招式！（激斗之后）厉害！你这招化解的时机极准！', relDelta:15, action:'spar_fight' }],
    shop:null, quests:['quest_swordsman_duel_honor','quest_swordsman_settle_grudge','quest_daily_escort_practice','quest_gossip_weird_duel'], intels:['intel_sect_secret'] },

  // ── 张家界 ──
  zhangjiajie_inn: { id:'zhangjiajie_inn', name:'土家老汉', role:'湘西旅店老板', category:'inn', avatar:'🏔', city:'zhangjiajie', level:27, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:20,
    greetings:['绝壁奇峰，云雾缭绕，这地方来了就不想走！','凌霄阁的弟子时常在山里出没，注意！'],
    topics:[
      { id:'t_zjj_inn_rest', text:'住店一晚（10两）', reply:'好！湘西山区夜晚凉，被子管够！', relDelta:5, action:'inn_rest' },
      { id:'t_zjj_inn_lingxiao', text:'打听凌霄阁', reply:'凌霄阁在山里有个秘密修炼场，弟子们时不时来练轻功！这里的奇峰正好练飞檐走壁！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_tujia_food', icon:'🍚', name:'土家族米饭', desc:'饱食度+42', price:8, effect:{ food:42 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 恩施 ──
  enshi_inn: { id:'enshi_inn', name:'土司后裔', role:'恩施山城旅店老板', category:'inn', avatar:'🏘', city:'enshi', level:19, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:22,
    greetings:['土家族的土司城就在附近，欢迎来访！','鄂西山区，世外桃源一样的地方！'],
    topics:[
      { id:'t_es_inn_rest', text:'住店一晚（10两）', reply:'好！山城夜晚安静，睡得踏实！', relDelta:5, action:'inn_rest' },
      { id:'t_es_inn_local', text:'打听本地情况', reply:'恩施山高路险，外人少来。但最近来了些奇怪的人，说是寻找失传的土家武学秘法！', relDelta:5, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_tujia_food', icon:'🍚', name:'土家腊肉', desc:'饱食度+45，耐储', price:12, effect:{ food:45 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  enshi_herbalist: { id:'enshi_herbalist', name:'苗医婆婆', role:'精通土苗医术老妇', category:'misc', avatar:'🌿', city:'enshi', level:18, tier:'func', weapon:'wep_wooden_stick', armor:'cs_assassin', silver:50,
    greetings:['土苗医术，专治各类奇毒！','山里的草药什么病都能治！'],
    topics:[{ id:'t_es_herb_sell', text:'购买草药', reply:'我这里的草药，是土苗秘方配置的，比外面卖的好十倍！', relDelta:7, action:'open_shop' }],
    shop:{ items:[{ id:'item_antidote', icon:'🍃', name:'苗族解毒草', desc:'解除中毒状态，气血+30', price:25, effect:{ hp:30 } },{ id:'item_herb_qi', icon:'🌱', name:'参须片', desc:'气血+30，精力+20', price:18, effect:{ hp:30, energy:20 } }] },
    quests:['quest_rare_herb','quest_taoist_herb_gather','quest_daily_herbs','quest_daily_gossip_general'], intels:['intel_poison_cult'] },

  // ── 广元 ──
  guangyuan_inn: { id:'guangyuan_inn', name:'剑门把守', role:'入川要道旅店老板', category:'inn', avatar:'🏘', city:'guangyuan', level:15, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['剑门天下险，过了这里就是天府之国！','入川必经之地，欢迎暂住！'],
    topics:[
      { id:'t_gy_inn_rest', text:'住店一晚（10两）', reply:'好！剑门关险，休息好了再上路！', relDelta:5, action:'inn_rest' },
      { id:'t_gy_inn_road', text:'打听入川路况', reply:'剑门关道路险峻，但是只要跟着商队走，通常安全！快到成都了，路上保持体力！', relDelta:5, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_sichuan_dry', icon:'🍢', name:'四川腊肠', desc:'饱食度+45', price:12, effect:{ food:45 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },

  // ── 唐州城 ──
  tangzhou_inn: { id:'tangzhou_inn', name:'川蜀老妪', role:'唐州城旅店老板', category:'inn', avatar:'🏹', city:'tangzhou', level:18, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:30,
    greetings:['唐门就在山上，来往客官多注意！','这里的食物都是辣的，吃不惯的提前告知！'],
    topics:[
      { id:'t_tz2_inn_rest', text:'住店一晚（10两）', reply:'好！唐州城虽小，但安全，唐门弟子巡逻着呢！', relDelta:5, action:'inn_rest' },
      { id:'t_tz2_inn_tangmen', text:'打听唐门', reply:'唐门在此地根深叶茂，镇上的百姓有一半跟唐门有渊源。别在这里惹事，小心暗器从天而降！', relDelta:5, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_spicy_food', icon:'🌶', name:'麻辣唐州菜', desc:'饱食度+42，精力+10', price:10, effect:{ food:42, energy:10 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  tangzhou_smith: { id:'tangzhou_smith', name:'机关老师傅', role:'唐州城暗器铺', category:'misc', avatar:'⚙', city:'tangzhou', level:24, tier:'func', weapon:'wep_uc_dart', armor:'cs_cloth', silver:90,
    greetings:['唐门暗器，天下第一！我这里是分店！','要买什么机关暗器，我都有！'],
    topics:[],
    shop:{ items:[{ id:'item_flying_dart', icon:'🎯', name:'唐门飞镖', desc:'战斗使用，可增加攻击', price:35, effect:{} }] },
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'], intels:['intel_trade_route'] },

  // ── 峨眉山 ──
  emei_shan_inn: { id:'emei_shan_inn', name:'香客居', role:'峨眉山脚旅店老板', category:'inn', avatar:'🌄', city:'emei_shan', level:16, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['峨眉天下秀！香客武人都在这里歇脚！','上金顶需早起，否则云雾太重，看不清景色！'],
    topics:[
      { id:'t_es2_inn_rest', text:'住店一晚（10两）', reply:'好！峨眉山脚下灵气足，睡一晚养精蓄锐！', relDelta:5, action:'inn_rest' },
      { id:'t_es2_inn_sect', text:'打听峨眉派', reply:'峨眉派弟子皆是女子，武功内外兼修，法力和剑法俱佳。外来武人轻易别打她们的主意，吃不了兜着走！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_emei_tea', icon:'🍵', name:'峨眉竹叶青茶', desc:'口渴度-45，精力+20', price:12, effect:{ water:45, energy:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  emei_shan_monk: { id:'emei_shan_monk', name:'普惠禅师', role:'峨眉山佛门高僧', category:'sect', avatar:'☸', city:'emei_shan', level:26, tier:'major', weapon:'wep_uc_bamboo_staff', armor:'cs_shaolin', silver:0,
    greetings:['阿弥陀佛，施主上山礼佛，心中有何牵挂？','峨眉佛法，以慈悲为怀，以剑意护法！'],
    topics:[{ id:'t_es2_monk_teach', text:'请教佛法武学', reply:'佛法武学，以慈悲心为剑刃，越是心中慈悲，剑气越足！这是峨眉不传之秘！', relDelta:12, action:'train_skill' }],
    shop:null, quests:['quest_sect_mission','quest_monk_demon_banish','quest_monk_pilgrim_escort','quest_daily_temple_errand','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },

  // ── 乐山 ──
  leshan_inn: { id:'leshan_inn', name:'大佛脚下', role:'乐山旅店老板', category:'inn', avatar:'🏘', city:'leshan', level:26, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:25,
    greetings:['乐山大佛保佑，平安顺遂！','三江汇流，鱼儿最肥！'],
    topics:[
      { id:'t_ls_inn_rest', text:'住店一晚（10两）', reply:'好！大佛脚下睡一晚，佛祖保佑平安！', relDelta:5, action:'inn_rest' },
      { id:'t_ls_inn_shaolin', text:'打听少林分寺', reply:'乐山少林分寺规模不小，主要传播佛法和养生功法，不传外功。但他们医术精湛，方圆百里的伤者都来求医！', relDelta:5, intelId:'intel_cultivation_tip' }
    ],
    shop:{ items:[{ id:'item_leshan_fish', icon:'🐟', name:'三江鲜鱼', desc:'饱食度+48，气血+20', price:20, effect:{ food:48, hp:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },
  leshan_doctor: { id:'leshan_doctor', name:'佛医明空', role:'少林分寺医僧', category:'misc', avatar:'💊', city:'leshan', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_shaolin', silver:60,
    greetings:['以慈悲之心治病救人，明空的职责！','武林人士多有伤患，快进来诊治！'],
    topics:[{ id:'t_ls_doc_heal', text:'求医问诊', reply:'老衲行医以佛法引导，先治心再治身！', relDelta:8, action:'heal' }],
    shop:{ type:'medicine', items:[{ id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:20, effect:{ hp:50 } },{ id:'item_wudang_herb', icon:'🌿', name:'山药秘方', desc:'气血+60，内力+20', price:30, effect:{ hp:60, mp:20 } }] },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'], intels:['intel_cultivation_tip'] },

  // ── 达州 ──
  dazhou_inn: { id:'dazhou_inn', name:'盐商掌柜', role:'达州盐商旅店老板', category:'inn', avatar:'🏘', city:'dazhou', level:28, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:35,
    greetings:['达州盐道天下闻名，南来北往的商队都经过这！','井盐生意，最赚钱！'],
    topics:[
      { id:'t_dz_inn_rest', text:'住店一晚（10两）', reply:'好！达州盐商多，客房天天满，你来得正好！', relDelta:5, action:'inn_rest' },
      { id:'t_dz_inn_local', text:'打听本地消息', reply:'达州这边是四川和湖广的交界，最近来了不少奇怪的人，不知道是哪路江湖势力！', relDelta:5, intelId:'intel_trade_route' }
    ],
    shop:{ items:[{ id:'item_sichuan_salt', icon:'🧂', name:'川盐一包', desc:'无食用效果，可交换物资', price:5, effect:{} },{ id:'item_spicy_food', icon:'🌶', name:'麻辣干粮', desc:'饱食度+40', price:10, effect:{ food:40 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_trade_route'] },

  // ── 宜宾 ──
  yibin_inn: { id:'yibin_inn', name:'酒城掌柜', role:'宜宾酒楼老板', category:'misc', avatar:'🍷', city:'yibin', level:16, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:40,
    greetings:['五粮液就在本城出产！尝一口？','长江第一城，美酒美食！'],
    topics:[
      { id:'t_yb_inn_rest', text:'住店一晚（10两）', reply:'好！酒城之夜，美酒相伴，睡个好觉！', relDelta:5, action:'inn_rest' },
      { id:'t_yb_inn_wine', text:'喝几杯聊聊', reply:'（端上一碗烈酒）这酒三碗不过岗！江湖人好喝酒，我懂！不过……最近有帮人来城里打探什么，神神秘秘的，我也闹不清！', relDelta:6, intelId:'intel_local_gossip' }
    ],
    shop:{ items:[{ id:'item_wuliangjiu', icon:'🍷', name:'宜宾美酒', desc:'口渴度-45，精力+30', price:20, effect:{ water:45, energy:30 } },{ id:'item_spicy_food', icon:'🌶', name:'川味下酒菜', desc:'饱食度+38', price:10, effect:{ food:38 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_local_gossip'] },

  // ── 松潘 ──
  songpan_inn: { id:'songpan_inn', name:'藏羌向导', role:'松潘高原向导', category:'misc', avatar:'🏔', city:'songpan', level:27, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:20,
    greetings:['川西高原，离天近，离江湖远！','藏羌之地，别乱走，高原反应要注意！'],
    topics:[
      { id:'t_sp_inn_rest', text:'住店一晚（10两）', reply:'好！高原夜晚冷，火塘烧得旺，暖和！', relDelta:5, action:'inn_rest' },
      { id:'t_sp_inn_guide', text:'打听高原情况', reply:'高原上氧气稀薄，内力修炼却事半功倍！逍遥派弟子常来这里练功，有时能在草甸上看到他们飞来飞去！', relDelta:6, intelId:'intel_cultivation_tip' }
    ],
    shop:{ items:[{ id:'item_yak_meat', icon:'🥩', name:'牦牛肉干', desc:'饱食度+45，耐储', price:15, effect:{ food:45 } },{ id:'item_highland_tea', icon:'🍵', name:'高原酥油茶', desc:'口渴度-45，精力+20', price:10, effect:{ water:45, energy:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_cultivation_tip'] },

  // ── 贵阳 ──
  guiyang_inn: { id:'guiyang_inn', name:'黔中掌柜', role:'贵阳旅店老板', category:'inn', avatar:'🏘', city:'guiyang', level:23, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:24,
    greetings:['天无三日晴，地无三尺平！贵州就是这样的地方！','进入苗疆的门户，来往的武人都在这里补给！'],
    topics:[
      { id:'t_gyz_inn_rest', text:'住店一晚（10两）', reply:'好！贵阳多雨，客房干燥暖和，睡得舒服！', relDelta:5, action:'inn_rest' },
      { id:'t_gyz_inn_wudu', text:'打听苗疆情况', reply:'苗疆里头五毒教势力最大，外来人不要乱闯！但若有引荐，苗族人也很热情！就是不要喝陌生苗女给的酒！', relDelta:5, intelId:'intel_poison_cult' }
    ],
    shop:{ items:[{ id:'item_miao_food', icon:'🍚', name:'苗家酸汤鱼', desc:'饱食度+45，口渴度-20', price:15, effect:{ food:45, water:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_poison_cult'] },

  // ── 苗疆村寨 ──
  wudu_miao_shaman: { id:'wudu_miao_shaman', name:'苗寨巫师', role:'村寨蛊医', category:'misc', avatar:'🌿', city:'wudu_miao', level:37, tier:'major', weapon:'wep_uc_dart', armor:'cs_assassin', silver:60,
    greetings:['外来人，你如何知道这里的路？','苗疆的秘密，不是随便说的！'],
    topics:[{ id:'t_wm_sha_cure', text:'解毒求医', reply:'苗疆的毒，只有苗疆能解！先看看你中了什么毒……', relDelta:10, action:'heal' },{ id:'t_wm_sha_intel', text:'了解五毒教', reply:'五毒教是苗疆最大的势力，我们村寨表面臣服，实则保持距离。他们的蛊术远超我们，但他们的目的令人担忧！', relDelta:8, intelId:'intel_poison_cult' }],
    shop:{ items:[{ id:'item_antidote', icon:'🍃', name:'苗族解毒草', desc:'解除中毒状态，气血+30', price:25, effect:{ hp:30 } }] },
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'], intels:['intel_poison_cult'] },
  wudu_miao_merchant: { id:'wudu_miao_merchant', name:'苗家商贩', role:'苗疆特产商人', category:'shop', avatar:'🌺', city:'wudu_miao', level:17, tier:'func', weapon:'wep_wooden_stick', armor:'cs_assassin', silver:45,
    greetings:['苗疆特产，外面买不到！','银饰草药，两样都有！'],
    topics:[{ id:'t_wm_mer_buy', text:'购买苗疆特产', reply:'苗疆草药效果特别好，外面的价格是这里的三倍！', relDelta:5, action:'open_shop' }],
    shop:{ items:[{ id:'item_miao_food', icon:'🍚', name:'苗家酸鱼', desc:'饱食度+42', price:12, effect:{ food:42 } },{ id:'item_miao_herb', icon:'🌿', name:'苗疆草药', desc:'气血+50，精力+20', price:30, effect:{ hp:50, energy:20 } }] },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general','quest_escort_debut','quest_escort_plains','quest_escort_daily'], intels:['intel_poison_cult'] },

  // ── 桂林 ──
  guilin_inn: { id:'guilin_inn', name:'漓江掌柜', role:'桂林山水旅店老板', category:'inn', avatar:'🏮', city:'guilin', level:17, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:30,
    greetings:['桂林山水甲天下！欢迎来访！','奇峰怪石，最适合练轻功！'],
    topics:[
      { id:'t_gl_inn_rest', text:'住店一晚（10两）', reply:'好！桂林山水美，睡一晚神仙也不换！', relDelta:5, action:'inn_rest' },
      { id:'t_gl_inn_scenic', text:'打听奇峰情况', reply:'桂林附近有不少隐秘洞穴，据说有前朝武人留下的刻字。最近有人专门来这里寻访，说是寻找失传的武学！', relDelta:6, intelId:'intel_treasure_cave' }
    ],
    shop:{ items:[{ id:'item_guizhou_rice', icon:'🍱', name:'桂林米粉', desc:'饱食度+42', price:8, effect:{ food:42 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_treasure_cave'] },
  guilin_guide: { id:'guilin_guide', name:'阿桂向导', role:'桂林山水向导', category:'misc', avatar:'🗺', city:'guilin', level:25, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:25,
    greetings:['桂林漓江泛舟，我是最好的向导！','山洞里的路我都知道！'],
    topics:[{ id:'t_gl_guide_cave', text:'打听山洞秘境', reply:'那个大洞以前有强盗占据，被路过的高手清剿了！洞里据说有宝藏，但一直没人找到！', relDelta:7, intelId:'intel_treasure_cave' }],
    shop:null, quests:['quest_guide_mountain_path','quest_spy_trail','quest_daily_hunt_wild','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_treasure_cave'] },

  // ── 丽江 ──
  lijiang_inn: { id:'lijiang_inn', name:'纳西老者', role:'丽江古城旅店老板', category:'inn', avatar:'🏔', city:'lijiang', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['纳西古城，玉龙雪山脚下，欢迎！','我们纳西族有自己的武学传承，但不外传！'],
    topics:[
      { id:'t_lj_inn_rest', text:'住店一晚（10两）', reply:'好！丽江古城夜色美，睡一晚养精蓄锐！', relDelta:5, action:'inn_rest' },
      { id:'t_lj_inn_local', text:'了解纳西武学', reply:'纳西族的武学注重与自然融合，以借力使力为主。但这是族内秘传，外人很难学到！', relDelta:7, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_highland_tea', icon:'🍵', name:'丽江古城茶', desc:'口渴度-45，精力+20', price:10, effect:{ water:45, energy:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 赣州 ──
  ganzhou_inn: { id:'ganzhou_inn', name:'客家掌柜', role:'赣州旅店老板', category:'inn', avatar:'🏘', city:'ganzhou', level:23, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:24,
    greetings:['客家人最热情好客！欢迎来赣南！','山高林密，隐居的高手不少！'],
    topics:[
      { id:'t_gz_inn_rest', text:'住店一晚（10两）', reply:'好！客家土楼暖和，睡得踏实！', relDelta:5, action:'inn_rest' },
      { id:'t_gz_inn_hermit', text:'打听隐居高手', reply:'赣南山里确实有几位高手，但他们都不愿意见外人。有一位老前辈，据说曾是某大门派的高层，后来归隐于此！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_hakka_rice', icon:'🍱', name:'客家猪肚鸡', desc:'饱食度+48，气血+20', price:22, effect:{ food:48, hp:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 福州 ──
  fuzhou_inn: { id:'fuzhou_inn', name:'闽江掌柜', role:'福州旅店老板', category:'inn', avatar:'🏘', city:'fuzhou', level:17, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:32,
    greetings:['福州港口，东南门户！','海上往来最频繁，消息最灵通！'],
    topics:[
      { id:'t_fz_inn_rest', text:'住店一晚（10两）', reply:'好！福州港口热闹，晚上还有夜市，住一晚好好逛逛！', relDelta:5, action:'inn_rest' },
      { id:'t_fz_inn_haisha', text:'打听海沙派', reply:'海沙派在福州港口有个联络点，专门接待往来海上的武人。他们在东海的势力很大，连官府都不太敢惹！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_fuzhou_fish', icon:'🐟', name:'闽江鲜鱼', desc:'饱食度+45，气血+15', price:18, effect:{ food:45, hp:15 } }] },
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },
  fuzhou_guild: { id:'fuzhou_guild', name:'海商会长', role:'福州海商公会头目', category:'misc', avatar:'⚓', city:'fuzhou', level:29, tier:'major', weapon:'wep_dark_knife', armor:'cs_cloth', silver:200,
    greetings:['东南海贸都要经过我们！','谁要搞海上走私，先过我这关！'],
    topics:[
      { id:'t_fz_guild_trade', text:'打听海上贸易', reply:'东海航线最赚钱，但也最危险！海沙派收保护费，不给就扣船！', relDelta:8, intelId:'intel_trade_route' },
      { id:'t_fz_guild_escort', text:'接一单护镖', reply:'福州到杭州、广州都有镖路，走海运的多，陆运的险。你选哪条？', relDelta:10, action:'open_escort' },
      { id:'t_fz_guild_haisha', text:'问海沙派的情况', reply:'海沙派是东海最大的海上势力，福州港口就是他们的地盘。不过他们只管收钱，不干涉正经买卖。', relDelta:6 },
    ],
    shop:null, quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol','quest_escort_rescue','quest_escort_reconnaissance'], intels:['intel_trade_route'] },

  // ══════════════════════════════════════════════════════════
  //  福州·商会掌柜（商店NPC）
  // ══════════════════════════════════════════════════════════
  fuzhou_merchant: {
    id:'fuzhou_merchant', name:'陈海通', role:'福州商会掌柜', category:'shop', avatar:'💰',
    city:'fuzhou', level:28, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_scholar',
    silver:180,
    giftPrefs:{
      label:'海贸货物与稀罕物件',
      love:['raretrade','pearl'],
      like:['mystic','mechanism'],
      thanksLoved:['好货！海上跑的，就认好东西。','陈某走南洋这么多年，眼光不会差。'],
      thanksLiked:['不错，留着用得上。'],
      questHint:'陈海通神色亲热了不少，像是终于肯把那单海贸买卖说给你听。',
      followup:{
        questText: ({ questName }) => questName ? `追问陈掌柜这单「${questName}」` : '追问陈掌柜手里那单买卖',
        questReply: ({ questName }) => questName
          ? `陈海通拍了拍箱子：\"既然你诚心想沾这笔生意，陈某也不瞒你——${questName}。去任务页看。\"` : '陈海通把账本一合：\"我手里正有批货运往杭州，你若顺路，去任务页看看吧。\"',
        intelText: () => '请陈掌柜把这条海路细说分明',
        intelReply: ({ intelText }) => `陈海通压低了声音：\"${intelText}\"`,
        warmText: () => '顺着账目继续往下谈',
        warmReply: ({ npcName }) => `${npcName}把货物单据收好：\"你是实在人，往后陈某的买卖，少不了你帮忙。\"`,
      }
    },
    greetings:{
      hostile:['陈某做的是东南正经买卖，不陪无聊人。'],
      guarded:['先说清楚要什么。'],
      neutral:['福州港口通四海，什么货都有。','海上跑的，陈某都认得。'],
      friendly:['来得正好，有批新货刚到。'],
      close:['你是陈某信得过的人，有些路子旁人走不了，你可以。'],
    },
    topics:[
      { id:'t_fz_merch_buy',  text:'看看货物', reply:'都是东南沿海的好货，陈某把关，品质没问题。', relDelta:0, action:'open_shop' },
      { id:'t_fz_merch_task', text:'问问有没有任务', reply:'有批货要从福州送往杭州，走海路。你若顺路，可以看看。', relDelta:3 },
      { id:'t_fz_merch_info', text:'打听海贸行情', reply:'东海航线最肥，但海沙派收保护费；往广州走是内陆官道，安全些。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_fz_merch_cricket', text:'听说贵店有蛐蛐笼卖？', reply:'蛐蛐笼？南边玩这个的人少，不过陈某可以给你调货。', relDelta:1 },
    ],
    shop:{
      items:[
        { id:'item_elixir',      name:'灵药',       desc:'回复气血内力各50',       icon:'⚗',  price:35, effect:{hp:50, mp:50} },
        { id:'item_travel_ration',name:'行路干粮',  desc:'饱食度+40',             icon:'🧆', price:8,  effect:{food:40} },
        { id:'item_sea_food',    name:'海味干货',   desc:'饱食度+50，气血+20',    icon:'🦐', price:25, effect:{food:50, hp:20} },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备', icon:'🧺', price:40, effect:{} },
        // ── 高价值商品（经济平衡 A 类）──
        { id:'item_blood_pill',  name:'活血再造丹', desc:'气血上限永久+30，需逐步吸收',     icon:'❤️‍🔥', price:250, effect:{maxHp:30} },
        { id:'item_qi_pill',     name:'培元丹',     desc:'内力上限永久+20，需逐步吸收',     icon:'💎', price:180, effect:{maxMp:20} },
        { id:'item_teleport_scroll',name:'千里传音符', desc:'瞬间传送至任意已解锁城市',       icon:'🏇', price:30, effect:{teleport:true} },
        { id:'item_respec_pill', name:'洗髓易筋丸', desc:'重分配全部自由属性点（不含出身点）',   icon:'🔄', price:300, effect:{respec:true} },
      ]
    },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_daily_merchant_delivery','quest_gossip_weird_duel','quest_escort_debut','quest_escort_plains','quest_escort_daily'],
    intels:['intel_trade_route'],
  },

  // ── 福州医馆 ──────────────────────────────────────────────
  fuzhou_doctor: {
    id:'fuzhou_doctor', name:'林善仁', role:'福州济世堂郎中', category:'medicine', avatar:'💊',
    city:'fuzhou', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:80,
    greetings:{
      hostile:['老夫行医多年，见过太多无赖，请自重！'],
      guarded:['有伤就说，没伤别浪费老夫时间。'],
      neutral:['海上风浪大，伤者最多，老夫这铺子从不关门。','闽南气候湿热，中暑感疾是常事。'],
      friendly:['你身上有些内伤，回头来让老夫看看。'],
      close:['咱们这交情，药钱就算了，人没事才是正经。'],
    },
    topics:[
      { id:'t_fz_doc_heal', text:'求医问诊', reply:'海上来的伤患什么都见过，跌打刀伤、中毒溺水，老夫都能料理！', relDelta:8, action:'heal' },
      { id:'t_fz_doc_sea', text:'聊海上疾病', reply:'海上最怕两件事——败血和海盐入伤。老夫专研过防盐水腐伤的秘法，效果还不错。', relDelta:5, intelId:'intel_trade_route' },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage',    icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine',   icon:'💊', name:'闽南济世丸', desc:'气血+85', price:27, effect:{ hp:85 } },
      { id:'item_herb_anti',  icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_sea_herb',   icon:'🌊', name:'海底珍草', desc:'内力+30，气血+40', price:50, effect:{ mp:30, hp:40 } },
    ] },
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_trade_route'],
  },

  // ── 腾冲 ──
  tengchong_inn: { id:'tengchong_inn', name:'边陲掌柜', role:'腾冲边陲旅店老板', category:'inn', avatar:'🏘', city:'tengchong', level:23, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['西南极边，腾冲欢迎！','翻过那山就是缅甸了，异域武功最独特！'],
    topics:[
      { id:'t_tc_inn_rest', text:'住店一晚（10两）', reply:'好！边陲小城安静，睡得踏实！', relDelta:5, action:'inn_rest' },
      { id:'t_tc_inn_exotic', text:'打听异域武功', reply:'从缅甸来的武人功法和咱们不一样，以刀术为主，速度极快！南亚功法讲究呼吸，内力运转方式也不同！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_exotic_fruit', icon:'🍌', name:'异域鲜果', desc:'饱食度+40，口渴度-25', price:12, effect:{ food:40, water:25 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 保山 ──
  baoshan_inn: { id:'baoshan_inn', name:'永昌掌柜', role:'保山旅店老板', category:'inn', avatar:'🏘', city:'baoshan', level:28, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:25,
    greetings:['南方丝绸之路，永昌古道在这里！','往来商队都在此歇脚！'],
    topics:[
      { id:'t_bs_inn_rest', text:'住店一晚（10两）', reply:'好！永昌古道商旅多，客房刚打扫干净！', relDelta:5, action:'inn_rest' },
      { id:'t_bs_inn_road', text:'打听往南的路', reply:'从保山往南就是缅甸，往西可进入滇西。这条古道走了几百年，路上有不少古老的武学传承遗留！', relDelta:5, intelId:'intel_treasure_cave' }
    ],
    shop:{ items:[{ id:'item_yunnan_tea', icon:'🍵', name:'云南普洱茶', desc:'口渴度-45，精力+20', price:12, effect:{ water:45, energy:20 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_treasure_cave'] },

  // ── 潮州 ──
  chaozhou_inn: { id:'chaozhou_inn', name:'潮汕掌柜', role:'潮州旅店老板', category:'inn', avatar:'🏘', city:'chaozhou', level:24, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:30,
    greetings:['潮汕人走遍天下，欢迎来访！','海上贸易发达，海商最多！'],
    topics:[
      { id:'t_czh_inn_rest', text:'住店一晚（10两）', reply:'好！潮州美食多，住一晚吃个够！', relDelta:5, action:'inn_rest' },
      { id:'t_czh_inn_local', text:'打听本地情况', reply:'海沙派的人在潮州活动频繁，商船进出都受监控！但也因此，潮州治安还算可以，他们不想把鸡蛋全打破！', relDelta:5, intelId:'intel_trade_route' }
    ],
    shop:{ items:[{ id:'item_chaoshan_food', icon:'🍜', name:'潮汕粿条', desc:'饱食度+42', price:8, effect:{ food:42 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_trade_route'] },

  // ── 钦州 ──
  qinzhou_inn: { id:'qinzhou_inn', name:'南海渔夫', role:'钦州港口旅店老板', category:'inn', avatar:'⚓', city:'qinzhou', level:21, tier:'func', weapon:'wep_dark_knife', armor:'cs_cloth', silver:25,
    greetings:['南海北岸的港口，通往中南半岛！','来自东南亚的武士时常在此上岸！'],
    topics:[
      { id:'t_qz_inn_rest', text:'住店一晚（10两）', reply:'好！港口小店能听海浪入眠，别有一番风味！', relDelta:5, action:'inn_rest' },
      { id:'t_qz_inn_sea', text:'打听南海情况', reply:'往南过了钦州就是广阔的南海！那边的武功和中原大不一样，尤其是东南亚的功夫，以毒和快刀著称！', relDelta:6, intelId:'intel_poison_cult' }
    ],
    shop:{ items:[{ id:'item_nanhai_fish', icon:'🐟', name:'南海鲜鱼', desc:'饱食度+45', price:16, effect:{ food:45 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_poison_cult'] },

  // ── 南海三亚 ──
  nanhai_inn: { id:'nanhai_inn', name:'天涯海客', role:'天涯海角旅店老板', category:'inn', avatar:'🌊', city:'nanhai', level:18, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:35,
    greetings:['天涯海角，江湖尽头！各路逃亡者的最后归宿！','到了这里，就算是世外桃源了！'],
    topics:[
      { id:'t_nh_inn_rest', text:'住店一晚（10两）', reply:'好！天涯海角，睡一晚忘却江湖烦恼！', relDelta:5, action:'inn_rest' },
      { id:'t_nh_inn_exile', text:'了解这里的人', reply:'这里住的大多数是被各方势力追杀的江湖人！有的是大门派叛逃者，有的是犯了江湖律法的！但来了这里，大家都有个默契，不翻旧账！', relDelta:8 }
    ],
    shop:{ items:[{ id:'item_coconut', icon:'🥥', name:'椰子', desc:'口渴度-55，精力+20', price:10, effect:{ water:55, energy:20 } },{ id:'item_seafood', icon:'🦐', name:'南海海鲜', desc:'饱食度+48', price:20, effect:{ food:48 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_local_gossip'] },
  nanhai_exile: { id:'nanhai_exile', name:'流亡高手', role:'隐姓埋名的武林高人', category:'misc', avatar:'⚔', city:'nanhai', level:33, tier:'major', weapon:'wep_iron_sword', armor:'cs_cloth', silver:0,
    greetings:['（不肯透露姓名）来了这里，就是忘了过去！','有些事情，埋在心里就好！'],
    topics:[{ id:'t_nh_exile_teach', text:'讨教武功', reply:'你能来这种地方，必有缘故！老夫隐居多年，倒是有些心法可以传授，算是与有缘人的一份缘分！', relDelta:18, action:'train_skill' }],
    shop:null, quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'], intels:['intel_sect_secret'] },

  // ── 武威凉州 ──
  wuwei_inn: { id:'wuwei_inn', name:'丝路掌柜', role:'凉州旅店老板', category:'inn', avatar:'🏘', city:'wuwei', level:27, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:32,
    greetings:['河西走廊东端，丝路起点！','西域商队经常在此歇脚！'],
    topics:[
      { id:'t_ww_inn_rest', text:'住店一晚（10两）', reply:'好！凉州丝路要道，商队云集，住一晚养精蓄锐！', relDelta:5, action:'inn_rest' },
      { id:'t_ww_inn_silk', text:'打听丝路情况', reply:'西域商队最近少了些，听说玉门关那边有异常！有神秘武人封锁了关卡，不让商队通过！', relDelta:6, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_silk_road_food', icon:'🥩', name:'胡人烤肉', desc:'饱食度+45，精力+15', price:15, effect:{ food:45, energy:15 } },{ id:'item_grape_wine', icon:'🍷', name:'葡萄美酒', desc:'口渴度-45，精力+25', price:18, effect:{ water:45, energy:25 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },
  wuwei_merchant: { id:'wuwei_merchant', name:'胡商赛义德', role:'西域商人', category:'shop', avatar:'🌙', city:'wuwei', level:26, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:150,
    greetings:['西域珍品，只在凉州！','东西方交流，我是中间人！'],
    topics:[{ id:'t_ww_mer_exotic', text:'看看西域货物', reply:'西域宝石、香料、异域武器，应有尽有！', relDelta:6, action:'open_shop' }],
    shop:{ items:[
        { id:'item_exotic_herb', icon:'🌺', name:'西域异草', desc:'气血+65，内力+25', price:45, effect:{ hp:65, mp:25 } },
        { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
      ] },
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general'], intels:['intel_trade_route'] },

  // ── 张掖甘州 ──
  zhangye_inn: { id:'zhangye_inn', name:'祁连山人', role:'张掖旅店老板', category:'inn', avatar:'🏘', city:'zhangye', level:26, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:28,
    greetings:['祁连山下的绿洲，难得的好地方！','丹霞地貌奇特，是西域奇景！'],
    topics:[
      { id:'t_zy_inn_rest', text:'住店一晚（10两）', reply:'好！张掖丹霞美，睡一晚养足精神再去观赏！', relDelta:5, action:'inn_rest' },
      { id:'t_zy_inn_xixia', text:'打听西夏秘宗', reply:'西夏秘宗在张掖有隐秘传承！那些密宗僧侣不轻易露面，但据说练了他们的功法，能引发灵力，与普通内力大不同！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_gansu_lamb', icon:'🥩', name:'甘肃烤羊肉', desc:'饱食度+45，精力+15', price:15, effect:{ food:45, energy:15 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 敦煌 ──
  dunhuang_inn: { id:'dunhuang_inn', name:'莫高守洞人', role:'敦煌旅店老板兼向导', category:'inn', avatar:'🏮', city:'dunhuang', level:18, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:40,
    greetings:['丝路明珠！敦煌莫高窟藏有无数秘密！','沙漠中的绿洲，欢迎补给休整！'],
    topics:[
      { id:'t_dh_inn_rest', text:'住店一晚（10两）', reply:'好！敦煌沙漠绿洲，睡一晚恢复体力！', relDelta:5, action:'inn_rest' },
      { id:'t_dh_inn_caves', text:'打听莫高窟', reply:'莫高窟有735个洞窟，壁画里藏有无数武学心法！据说有高人专门来此研习，从佛法壁画中领悟武学精要！', relDelta:7, intelId:'intel_tianshu' }
    ],
    shop:{ items:[{ id:'item_oasis_water', icon:'💧', name:'绿洲清泉', desc:'口渴度-55', price:8, effect:{ water:55 } },{ id:'item_camel_ration', icon:'🥩', name:'驼队干粮', desc:'饱食度+50，耐储', price:18, effect:{ food:50 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_tianshu'] },
  dunhuang_scholar: { id:'dunhuang_scholar', name:'敦煌研经人', role:'研究莫高窟的奇人', category:'misc', avatar:'📜', city:'dunhuang', level:36, tier:'major', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:0,
    greetings:['莫高窟里的秘密，足够研究一辈子！','壁画中有武学，你信吗？'],
    topics:[{ id:'t_dh_sch_teach', text:'请教壁画武学', reply:'佛教壁画里有极为古老的功法图示！老夫研究二十年，破解了三成，已经非常了不起了！若你有缘，可以传授一二……', relDelta:15, action:'train_skill' }],
    shop:null, quests:['quest_lost_book','quest_scholar_collect_poems','quest_scholar_protect_scroll','quest_daily_copy_errand','quest_poet_odd_client','quest_gossip_plagiarism'], intels:['intel_tianshu'] },

  // ── 玉门关 ──
  yumenguan_inn: { id:'yumenguan_inn', name:'关卡守兵', role:'玉门关戍卫兼旅店管理', category:'inn', avatar:'🏯', city:'yumenguan', level:19, tier:'func', weapon:'wep_uc_spear', armor:'cs_general', silver:40,
    greetings:['春风不度玉门关！出了这里就是西域！','过关要有通行文书，没有的话……就得靠关系了！'],
    topics:[
      { id:'t_ymg_inn_rest', text:'住店一晚（10两）', reply:'好！玉门关外风沙大，休息好了再出关！', relDelta:5, action:'inn_rest' },
      { id:'t_ymg_inn_xiyu', text:'打听西域情况', reply:'玉门关外是大漠，风沙大，危险多！西夏秘宗和昆仑派、逍遥派的弟子常从这里出入，但普通江湖人轻易别去！', relDelta:6, intelId:'intel_road_bandit' }
    ],
    shop:{ items:[{ id:'item_border_ration', icon:'🧆', name:'边关军粮', desc:'饱食度+50，耐储', price:15, effect:{ food:50 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_road_bandit'] },

  // ── 龟兹库车 ──
  guizi_inn: { id:'guizi_inn', name:'西域乐师', role:'龟兹旅店老板', category:'inn', avatar:'🌙', city:'guizi', level:21, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:35,
    greetings:['龟兹，西域音乐之乡！歌舞和武功都是独特的！','密宗在此有古老传承，令人叹为观止！'],
    topics:[
      { id:'t_gz2_inn_rest', text:'住店一晚（10两）', reply:'好！龟兹音乐美，睡一晚听曲入眠！', relDelta:5, action:'inn_rest' },
      { id:'t_gz2_inn_local', text:'了解龟兹武功', reply:'龟兹的密宗武功，以音律为辅助，弹奏乐器时同时运功，能增强内力！江湖上少见，但威力不可小觑！', relDelta:7, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_xiyu_fruit', icon:'🍑', name:'西域鲜果', desc:'饱食度+40，口渴度-20', price:12, effect:{ food:40, water:20 } },{ id:'item_xiyu_wine', icon:'🍷', name:'葡萄酒', desc:'口渴度-45，精力+25', price:18, effect:{ water:45, energy:25 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 西域城邦 ──
  xiyu_city_inn: { id:'xiyu_city_inn', name:'城邦商主', role:'西域城邦旅店掌管人', category:'inn', avatar:'🌙', city:'xiyu_city', level:25, tier:'func', weapon:'wep_blood_saber', armor:'cs_cloth', silver:60,
    greetings:['西域北道的十字路口！东西南北的势力都在这里交汇！','天山派和西夏秘宗在此暗争，要小心！'],
    topics:[
      { id:'t_xy3_inn_rest', text:'住店一晚（10两）', reply:'好！西域城邦繁华，住一晚养足精神再赶路！', relDelta:5, action:'inn_rest' },
      { id:'t_xy3_inn_faction', text:'了解西域势力', reply:'这里有西夏秘宗和天山派两股势力！西夏人掌控商道，天山派掌控山岳。两方一直有摩擦，来往旅人最好不要卷入！', relDelta:6, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_xiyu_fruit', icon:'🍑', name:'西域甜瓜', desc:'饱食度+40，口渴度-30', price:10, effect:{ food:40, water:30 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 和田于阗 ──
  hetian_inn: { id:'hetian_inn', name:'玉商老爷', role:'和田玉石商人兼旅店老板', category:'inn', avatar:'💎', city:'hetian', level:25, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:120,
    greetings:['和田玉，天下最美的玉石！','逍遥派的弟子时常来此，说是寻找一种特殊的玉石用于修炼！'],
    topics:[
      { id:'t_ht_inn_rest', text:'住店一晚（10两）', reply:'好！和田虽远，但小店干净，睡一晚恢复体力再去寻玉不迟！', relDelta:5, action:'inn_rest' },
      { id:'t_ht_inn_xiaoyao', text:'打听逍遥派', reply:'逍遥派弟子来这里是为了找一种冰玉！据说这种玉石含有天然内力，辅助修炼极佳！但逍遥派从不告诉别人具体在哪里找！', relDelta:7, intelId:'intel_sect_secret' }
    ],
    shop:{ items:[{ id:'item_jade_amulet', icon:'💚', name:'和田玉佩', desc:'持有可微增内力上限+10', price:80, effect:{ mp:10 } },{ id:'item_xiyu_fruit', icon:'🍑', name:'西域瓜果', desc:'饱食度+40，口渴度-25', price:12, effect:{ food:40, water:25 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_sect_secret'] },

  // ── 高昌故国 ──
  xizhou_inn: { id:'xizhou_inn', name:'汉人遗民', role:'高昌汉人后代旅店老板', category:'inn', avatar:'🌙', city:'xizhou', level:20, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:30,
    greetings:['高昌故国，汉家在西域的最后据点！','波斯人、胡人、汉人在这里共同生活！'],
    topics:[
      { id:'t_xzh_inn_rest', text:'住店一晚（10两）', reply:'好！高昌故地，汉人后裔开的店，住一晚安心！', relDelta:5, action:'inn_rest' },
      { id:'t_xzh_inn_mingjiao', text:'打听明教西传', reply:'明教从波斯传入中原，据说这座城就是中间站！明教信徒在此留有遗迹，地下室里的壁画记载了圣火令的部分秘密！', relDelta:8, intelId:'intel_tianshu' }
    ],
    shop:{ items:[{ id:'item_persian_spice', icon:'🌶', name:'波斯香料', desc:'无直接效果，可交换物资', price:20, effect:{} },{ id:'item_silk_road_food', icon:'🥩', name:'胡人烤肉', desc:'饱食度+45，精力+15', price:15, effect:{ food:45, energy:15 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_tianshu'] },

// ── 临夏·河州 ──
  linxia_innkeeper: { id:'linxia_innkeeper', name:'马掌柜', role:'回族旅店掌柜', category:'inn', avatar:'🏮', city:'linxia', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:60,
    greetings:['客官请进！临夏乃丝路咽喉，南来北往的客商都在此打尖！','牛肉面、手抓羊肉，敝店样样俱全！'],
    topics:[
      { id:'t_linxia_rest', text:'住店一晚（10两）', reply:'好嘞！上房给你留着，热水毛巾马上就来！牛肉面明早给你端上来！', relDelta:5, action:'inn_rest' },
      { id:'t_linxia_silk', text:'打听丝路行情', reply:'西域商队每月初都经过此地，带来香料、玉石、毛皮。想做买卖，得结交兰州的大商号，他们掌握着货源。', relDelta:5, intelId:'intel_jianghu' }
    ],
    shop:{ items:[{ id:'item_beef_noodle', icon:'🍜', name:'牛肉拉面', desc:'饱食度+50，精力+20', price:12, effect:{ food:50, energy:20 } },{ id:'item_mutton_rice', icon:'🍖', name:'手抓羊肉', desc:'饱食度+60，气血+20', price:20, effect:{ food:60, hp:20 } },{ id:'item_buttered_tea', icon:'☕', name:'酥油茶', desc:'口渴度+50，精力+15', price:8, effect:{ water:50, energy:15 } }] },
    quests:['quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'], intels:['intel_jianghu'] },
  linxia_merchant: { id:'linxia_merchant', name:'韩玉林', role:'西域珠宝商人', category:'shop', avatar:'💎', city:'linxia', level:33, tier:'major', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:300,
    greetings:['在下走遍西域三十年，见过的宝石比你见过的沙子还多！','西夏玉、波斯红宝石、于阗羊脂白玉……只要出得起价，没有我找不来的！'],
    topics:[{ id:'t_linxia_jade', text:'打听西域宝贝', reply:'昆仑山下的和田玉是天下第一！老夫年轻时曾亲赴于阗采玉，那里的采玉人手腕都磨得没了皮……如今老了，只能让徒弟跑腿了。', relDelta:10, intelId:'intel_tianshu' }],
    shop:{ items:[
      { id:'item_jade_bead', icon:'💚', name:'碧玉珠串', desc:'魅力+5，无战斗效果', price:80, effect:{ charm:5 } },
      { id:'item_healing_relic', icon:'🪬', name:'护身玉牌', desc:'气血上限+30', price:120, effect:{ maxHp:30 } },
      { id:'item_respec_pill', icon:'🔄', name:'洗髓易筋丸', desc:'重分配全部自由属性点（不含出身点）', price:300, effect:{respec:true} },
      { id:'item_qi_pill',     icon:'💎', name:'培元丹',   desc:'内力上限永久+20', price:180, effect:{maxMp:20} },
      { id:'item_teleport_scroll', icon:'🏇', name:'千里传音符', desc:'瞬间传送至任意已解锁城市', price:30, effect:{teleport:true} },
      { id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', desc:'养蛐捉蛐必备，每个可容纳1只蛐蛐', icon:'🧺', price:40, effect:{} },
    ]},
    quests:['quest_escort_goods','quest_merchant_stolen_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth','quest_daily_gossip_general'], intels:['intel_tianshu'] },
  linxia_herbalist: { id:'linxia_herbalist', name:'赵大夫', role:'行脚郎中', category:'medicine', avatar:'🌿', city:'linxia', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:80,
    greetings:['高原草药、黄土药材，老夫行医三十年，什么病没见过！','甘肃秦岭一带出产的当归，是疗伤圣药啊！'],
    topics:[{ id:'t_linxia_herb', text:'打听药材来源', reply:'这一带出产黄芪、当归、甘草，是天下最好的药材产地。听说昆仑山顶还有千年雪莲，只是无人能采到！', relDelta:5, intelId:'intel_herb' }],
    shop:{ items:[{ id:'item_danggui', icon:'🌱', name:'当归', desc:'气血+40，疗伤圣药', price:18, effect:{ hp:40 } },{ id:'item_huangqi', icon:'🍃', name:'黄芪', desc:'气血上限+20，持续5分钟', price:25, effect:{ maxHp:20 } },{ id:'item_qingliang_powder', icon:'✨', name:'清凉散', desc:'解除中毒，精力+15', price:30, effect:{ energy:15 } }] },
    quests:['quest_rare_herb','quest_taoist_herb_gather','quest_daily_herbs','quest_daily_gossip_general'], intels:['intel_herb'] },

  // ── 洛阳·古玩铺 ──
  luoyang_antique: {
    id:'luoyang_antique', name:'周知古', role:'洛阳古玩铺掌柜', category:'misc', avatar:'🏺', city:'luoyang', level:40, tier:'major',
    weapon:'wep_wooden_stick', armor:'cs_cloth', silver:500,
    greetings:[
      '老夫走南闯北四十年，见过的奇珍异宝，说三天三夜也说不完！',
      '收的东西三教九流都有，但每一件，都有自己的故事。',
      '客官眼光不错！本铺的东西，放眼中原独此一家！',
    ],
    topics:[{ id:'t_antique_story', text:'请他讲讲藏品', reply:'这块铜镜，是三十年前从一个落魄公子手里收来的。当时他说祖上是皇族，镜子传了七代……真假老夫不管，东西好看就成。', relDelta:8, intelId:'intel_tianshu' }],
    shop:{ items:[
      { id:'col_broken_compass', icon:'🧭', name:'残破罗盘',   desc:'指针已断，不知指向何方。或许曾经引领某位豪侠走遍天下。',        price:25,  effect:{ collectible:true }, rarity:'common',   sellPrice:12 },
      { id:'col_old_portrait',   icon:'🖼️', name:'旧人画像',   desc:'一幅残破的素描人像，背面潦草地写着"勿忘"二字，不知画的是谁。',  price:18,  effect:{ collectible:true }, rarity:'common',   sellPrice:8  },
      { id:'col_copper_mirror',  icon:'🪞', name:'铜镜碎片',   desc:'一块铜镜的碎片，隐约能照出人影。',                             price:20,  effect:{ collectible:true }, rarity:'common',   sellPrice:10 },
      { id:'col_ink_stick',      icon:'🖋️', name:'古墨一锭',   desc:'一锭做工考究的徽墨，散发着淡淡松烟香气。',                     price:60,  effect:{ collectible:true }, rarity:'uncommon', sellPrice:35 },
      { id:'col_chess_piece',    icon:'♟️', name:'象牙棋子',   desc:'一粒象牙雕成的棋子，却是单独一颗将帅，其余棋子不知所踪。',      price:90,  effect:{ collectible:true }, rarity:'uncommon', sellPrice:55 },
      { id:'col_jade_pendant',   icon:'🟢', name:'无字玉佩',   desc:'一块雕工精细的玉佩，正反两面皆无刻字，却散发着温润光泽。',      price:70,  effect:{ collectible:true }, rarity:'uncommon', sellPrice:45 },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'], intels:['intel_tianshu'] },

  // ── 长安·旧书铺 ──
  changan_bookshop: {
    id:'changan_bookshop', name:'文墨先生', role:'长安旧书铺掌柜', category:'misc', avatar:'📚', city:'changan', level:35, tier:'major',
    weapon:'wep_wooden_stick', armor:'cs_cloth', silver:300,
    greetings:[
      '斯文乱世，读书的人越来越少，买书的人更少……',
      '你来寻的是哪类书？武学的我没有，杂学奇谈倒是不少。',
      '书这东西，卖不卖的，主要是遇上有缘人。',
    ],
    topics:[{ id:'t_bookshop_history', text:'打听古籍来源', reply:'这批书是从一个流亡贵族手里盘下来的，说是家传了二百年。老夫也读不懂，但摆在这里看着舒服。', relDelta:10 }],
    shop:{ items:[
      { id:'col_music_score',  icon:'📜', name:'半卷琴谱',   desc:'残缺的古琴曲谱，曲名《断肠》，只剩前半段。',                    price:60,  effect:{ collectible:true }, rarity:'uncommon', sellPrice:38 },
      { id:'col_dice_set',     icon:'🎲', name:'老旧骰子',   desc:'六粒磨损严重的骰子，其中一粒明显做了手脚。赌坊败家子的遗物。',  price:12,  effect:{ collectible:true }, rarity:'common',   sellPrice:5  },
      { id:'col_empty_jug',    icon:'🍶', name:'空酒葫芦',   desc:'酒早喝光了，葫芦里还残留着一股醇香。',                         price:10,  effect:{ collectible:true }, rarity:'common',   sellPrice:4  },
      { id:'col_red_thread',   icon:'🪢', name:'红丝绳结',   desc:'一根打了七个结的红丝绳，每个结据说代表一段情缘。',             price:35,  effect:{ collectible:true }, rarity:'uncommon', sellPrice:20 },
      { id:'col_bronze_bell',  icon:'🔔', name:'铜铃铛',     desc:'小巧的铜铃，轻摇时发出清脆的声响，铃身刻着"平安"二字。',      price:50,  effect:{ collectible:true }, rarity:'uncommon', sellPrice:30 },
    ]},
    quests:['quest_escort_goods','quest_merchant_price_intel','quest_daily_merchant_delivery','quest_gossip_hidden_wealth'], intels:['intel_jianghu'] },

  // ── 扬州·珍品阁（高级收藏，少见+稀有）──
  yangzhou_treasure: {
    id:'yangzhou_treasure', name:'苏宝昌', role:'扬州珍品阁东主', category:'misc', avatar:'💰', city:'yangzhou', level:55, tier:'major',
    weapon:'wep_wooden_stick', armor:'cs_cloth', silver:2000,
    greetings:[
      '扬州富甲天下，苏某的眼光自然也比旁人高一筹。',
      '能进这间阁子的，没一个是普通人——你也不像普通人。',
      '本阁不卖假货，价格自然也不便宜。',
    ],
    topics:[{ id:'t_yangtreas_origin', text:'打听藏品来历', reply:'这枚扳指，原是某门派掌门的遗物。掌门死后，弟子四散，遗物几经辗转到了苏某手里。价值几何，仁者见仁。', relDelta:12, intelId:'intel_tianshu' }],
    shop:{ items:[
      { id:'col_war_flag',      icon:'🚩', name:'残破军旗',   desc:'一面残破的军旗，上面绣着已不可辨认的文字。',                    price:220, effect:{ collectible:true }, rarity:'rare', sellPrice:140 },
      { id:'col_tiger_seal',    icon:'🐅', name:'虎符残件',   desc:'古代虎符的半片，青铜铸成，虎纹清晰。',                          price:320, effect:{ collectible:true }, rarity:'rare', sellPrice:200 },
      { id:'col_silver_hairpin',icon:'📌', name:'折枝银簪',   desc:'一支折断的银簪，折断处整齐，像是有人特意折的。',               price:250, effect:{ collectible:true }, rarity:'rare', sellPrice:160 },
      { id:'col_jade_ring',     icon:'💍', name:'碧玉扳指',   desc:'玉质上乘的扳指，内壁刻着"天下第一"四字。',                    price:380, effect:{ collectible:true }, rarity:'rare', sellPrice:250 },
      { id:'col_letter_sealed', icon:'✉️', name:'密封书信',   desc:'用火漆封口的书信，火漆上印着一个陌生的印章。',                 price:130, effect:{ collectible:true }, rarity:'rare', sellPrice:80  },
    ]},
    quests:['quest_missing_guest','quest_spy_trail','quest_daily_patrol'], intels:['intel_tianshu'] },

  // ══════════════════════════════════════════════════════════
  //  新手村补全 NPCs（2026-04-11）
  // ══════════════════════════════════════════════════════════

  // ── 扬州城 ──────────────────────────────────────────────
  yangzhou_inn: {
    id:'yangzhou_inn', name:'柳三娘', role:'瘦西湖客栈掌柜', category:'inn', avatar:'🏮',
    city:'yangzhou', level:22, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:55,
    greetings:['扬州城里最雅致的客栈，便是奴家这间了。客官请进！','瘦西湖风月无边，客官是从哪条水路来的？','今日湖上起了薄雾，出行可要多添件衣裳。'],
    topics:[
      { id:'t_yz_inn_rest', text:'住店休息', reply:'上房临湖，景色最好！奴家给你留着。', relDelta:5, action:'inn_rest' },
      { id:'t_yz_inn_lake', text:'聊聊瘦西湖', reply:'这湖里的鱼最鲜，钓起来当下酒菜最好。城里盐商多，打听行情得去茶馆。', relDelta:4, intelId:'intel_trade_route' },
      { id:'t_yz_inn_rumor', text:'扬州最近有什么消息？', reply:'城南绸缎庄换了新东家，进了一批西域的货，听说是从海路来的。', relDelta:5, intelId:'intel_trade_route' },
    ],
    shop:{ items:[
      { id:'item_yangzhou_noodle', icon:'🍜', name:'扬州阳春面', desc:'饱食度+42，精力+15', price:10, effect:{ food:42, energy:15 } },
      { id:'item_lotus_root', icon:'🥢', name:'桂花糯米藕', desc:'饱食度+30，口渴度-25', price:8, effect:{ food:30, water:25 } },
      { id:'item_clear_water', icon:'💧', name:'湖心净水', desc:'口渴度-45', price:4, effect:{ water:45 } },
    ]},
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_trade_route'],
  },
  yangzhou_doctor: {
    id:'yangzhou_doctor', name:'回春堂主', role:'扬州回春堂郎中', category:'medicine', avatar:'💊',
    city:'yangzhou', level:36, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:120,
    greetings:['回春堂，妙手回春。先生哪里不舒服？','江南湿热，最易染病，客官要当心。','扬州盐商多应酬，脾胃不和最常见。'],
    topics:[
      { id:'t_yz_doc_heal', text:'求医问诊', reply:'容老夫把把脉……嗯，气血略有亏损，内力稍有不济，不妨事。', relDelta:8, action:'heal' },
      { id:'t_yz_doc_poison', text:'解毒疗伤', reply:'江南蛇虫多，被咬伤了？老夫这儿有上好的解毒丸。', relDelta:6 },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'回春丸', desc:'气血+85', price:28, effect:{ hp:85 } },
      { id:'item_herb_anti', icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_jingqi_pill', icon:'⚪', name:'精气丸', desc:'气血+40，内力+60', price:22, effect:{ hp:40, mp:60 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_cultivation_tip'],
  },
  yangzhou_smith: {
    id:'yangzhou_smith', name:'金大锤', role:'扬州铁匠铺掌柜', category:'blacksmith', avatar:'⚒',
    city:'yangzhou', level:30, tier:'func', weapon:'wep_iron_sword', armor:'cs_general', silver:150,
    greetings:['扬州铁匠铺，江南兵器样样有！','客官要打什么家伙？刀剑枪棒，老金都能来！','这扬州城里的武林人士，都认老金的手艺。'],
    topics:[
      { id:'t_yz_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把家伙拿来，老金看了三十年兵器，眼里不含糊。', relDelta:0, action:'identify_equip' },
      { id:'t_yz_smith_repair', text:'修一修兵器', reply:'兵器磨损了？拿来老金看看，小修小补不在话下。', relDelta:0, action:'repair' },
    ],
    shop:{ items:[
      { id:'item_yangzhou_sword', icon:'⚔', name:'扬州细剑', desc:'攻击+6，轻巧锋利', price:90, effect:{} },
      { id:'item_iron_dagger', icon:'🗡', name:'精铁匕首', desc:'攻击+4，便于隐藏', price:55, effect:{} },
      { id:'item_whetstone', icon:'🪨', name:'磨刀石', desc:'攻击+8，持续5回合', price:10, effect:{ atkBuff:8, turns:5 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels:['intel_trade_route'],
  },

  // ── 京师长安 ────────────────────────────────────────────
  xian_inn: {
    id:'xian_inn', name:'赵掌柜', role:'长安第一客栈掌柜', category:'inn', avatar:'🏮',
    city:'xian', level:28, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:65,
    greetings:['长安城，天子脚下！客官从哪儿来？','本店三十年老店，迎来送往，什么人物没见过！','长安城最近不太平，客官走路可要多加小心。'],
    topics:[
      { id:'t_xian_inn_history', text:'打听长安旧事', reply:'这城里皇帝住的地方最大，然后是各大门派。天地帮和明教最近闹得凶，城里风声紧！', relDelta:6, intelId:'intel_jianghu' },
      { id:'t_xian_inn_road', text:'了解进出城路况', reply:'往东出城就是函谷关，往西是西域方向。城外最近有帮派设卡，走动要小心！', relDelta:5, intelId:'intel_road_bandit' },
      { id:'t_xian_inn_rest', text:'住店休息', reply:'好嘞！上房给你留着，热水毛巾马上就来！', relDelta:5, action:'inn_rest' },
    ],
    shop:{ items:[
      { id:'item_xian_dumpling', icon:'🥟', name:'长安饺子', desc:'饱食度+45，精力+15', price:12, effect:{ food:45, energy:15 } },
      { id:'item_mutton_soup', icon:'🍲', name:'羊肉泡馍', desc:'饱食度+55，精力+20', price:18, effect:{ food:55, energy:20 } },
      { id:'item_hot_water', icon:'☕', name:'热茶', desc:'口渴度-40，精力+10', price:5, effect:{ water:40, energy:10 } },
    ]},
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_road_bandit'],
  },
  xian_doctor: {
    id:'xian_doctor', name:'济世堂主', role:'长安济世堂郎中', category:'medicine', avatar:'💊',
    city:'xian', level:40, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:180,
    greetings:['济世堂，医尽天下苍生。先生哪里不舒服？','长安城风沙大，外感风寒最多见。','江湖人来来往往，伤筋动骨也是常事。'],
    topics:[
      { id:'t_xian_doc_heal', text:'求医问诊', reply:'待老夫细细诊来……嗯，这伤不轻，但还来得及。', relDelta:8, action:'heal' },
      { id:'t_xian_doc_poison', text:'解毒疗伤', reply:'关外来的毒物，老夫见得多，解法了然于胸。', relDelta:6 },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'济世丸', desc:'气血+90', price:30, effect:{ hp:90 } },
      { id:'item_herb_anti', icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_jingqi_pill', icon:'⚪', name:'精气丸', desc:'气血+40，内力+60', price:22, effect:{ hp:40, mp:60 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_cultivation_tip'],
  },
  xian_smith: {
    id:'xian_smith', name:'铁三关', role:'长安铁匠铺掌柜', category:'blacksmith', avatar:'⚒',
    city:'xian', level:35, tier:'func', weapon:'wep_iron_sword', armor:'cs_general', silver:200,
    greetings:['长安铁匠，铸兵器也铸名声！','函谷关外的铁矿石最硬，我打出来的刀最有分量！','江湖人来来往往，我什么兵器都见过。'],
    topics:[
      { id:'t_xian_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把东西拿来看看，老铁三十年经验，真假一眼便知。', relDelta:0, action:'identify_equip' },
      { id:'t_xian_smith_repair', text:'修一修兵器', reply:'磨损了？拿来我看看，能修的老铁绝不推辞。', relDelta:0, action:'repair' },
    ],
    shop:{ items:[
      { id:'item_xian_dao', icon:'⚔', name:'长安长刀', desc:'攻击+7，厚重有力', price:110, effect:{} },
      { id:'item_steel_sword', icon:'🗡', name:'精钢短剑', desc:'攻击+5，轻便适用', price:75, effect:{} },
      { id:'item_whetstone', icon:'🪨', name:'磨刀石', desc:'攻击+8，持续5回合', price:10, effect:{ atkBuff:8, turns:5 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels:['intel_trade_route'],
  },

  // ── 泉州 ────────────────────────────────────────────────
  quanzhou_inn: {
    id:'quanzhou_inn', name:'海客娘', role:'泉州海港客栈掌柜', category:'inn', avatar:'⚓',
    city:'quanzhou', level:18, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:45,
    greetings:['泉州港，天下第一大港！客官是从南洋来的吧？','海风咸腥，客官先喝碗热汤暖暖身子！','从这儿出海，最远能到波斯和阿拉伯！'],
    topics:[
      { id:'t_qz_inn_sea', text:'打听海运情况', reply:'南洋的海沙派最近不安分，出船要小心！不过也有商队愿意付保护费。', relDelta:5, intelId:'intel_trade_route' },
      { id:'t_qz_inn_rest', text:'住店休息', reply:'海边的客房通风凉快，正适合热天！', relDelta:5, action:'inn_rest' },
    ],
    shop:{ items:[
      { id:'item_seafood_noodle', icon:'🍜', name:'海鲜面', desc:'饱食度+42，口渴度-20', price:12, effect:{ food:42, water:20 } },
      { id:'item_dried_fish', icon:'🐟', name:'咸鱼干', desc:'饱食度+35，耐储', price:8, effect:{ food:35 } },
    ]},
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_trade_route'],
  },
  quanzhou_doctor: {
    id:'quanzhou_doctor', name:'南洋医馆主', role:'泉州南洋医馆郎中', category:'medicine', avatar:'💊',
    city:'quanzhou', level:32, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:100,
    greetings:['南洋医术与中原不同，各有长短。','海边湿热，瘴气重，外地客官容易水土不服。','海外奇药我这儿也有，从南洋商队进的货。'],
    topics:[
      { id:'t_qz_doc_heal', text:'求医问诊', reply:'容我看看……嗯，南洋来的毒物老夫也见过不少，解法在手。', relDelta:8, action:'heal' },
      { id:'t_qz_doc_exotic', text:'海外奇药', reply:'南洋有些草药，中原没有，效果独特。不过价钱也不便宜。', relDelta:5 },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'南洋丸药', desc:'气血+80', price:26, effect:{ hp:80 } },
      { id:'item_sea_herb', icon:'🌊', name:'海底珍草', desc:'内力+30，气血+40', price:50, effect:{ mp:30, hp:40 } },
      { id:'item_herb_anti', icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_cultivation_tip'],
  },
  quanzhou_smith: {
    id:'quanzhou_smith', name:'海锻造师', role:'泉州铁匠铺掌柜', category:'blacksmith', avatar:'⚒',
    city:'quanzhou', level:28, tier:'func', weapon:'wep_iron_sword', armor:'cs_general', silver:130,
    greetings:['泉州铁匠，打的兵器要能出海！','海盐腐蚀，普通铁器几天就锈。我这儿的好钢，不怕海风！','南洋客最爱我打的刀，说比他们本地的还结实。'],
    topics:[
      { id:'t_qz_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把家伙拿来看看，南洋的兵器我也见过不少。', relDelta:0, action:'identify_equip' },
      { id:'t_qz_smith_repair', text:'修一修兵器', reply:'出海的人最怕兵器出问题，拿来我给你看看。', relDelta:0, action:'repair' },
    ],
    shop:{ items:[
      { id:'item_sea_dao', icon:'⚔', name:'海防长刀', desc:'攻击+6，防潮防腐', price:100, effect:{} },
      { id:'item_short_sword', icon:'🗡', name:'水手短剑', desc:'攻击+4，轻便防锈', price:65, effect:{} },
      { id:'item_whetstone', icon:'🪨', name:'磨刀石', desc:'攻击+8，持续5回合', price:10, effect:{ atkBuff:8, turns:5 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels:['intel_trade_route'],
  },

  // ── 成都 ────────────────────────────────────────────────
  chengdu_inn: {
    id:'chengdu_inn', name:'陈老板', role:'成都锦官客栈掌柜', category:'inn', avatar:'🏮',
    city:'chengdu', level:24, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:50,
    greetings:['成都，一座来了就不想走的城市！客官请进！','锦官城里武人多，客栈里每天都有新鲜事！','今日天气巴适得很，进来喝杯茶歇歇脚！'],
    topics:[
      { id:'t_cd_inn_sichuan', text:'聊聊天府之国', reply:'蜀道难，但成都富庶。唐门在这一带名声最大，客官若要打听什么，小心为上。', relDelta:6, intelId:'intel_sect_secret' },
      { id:'t_cd_inn_food', text:'打听成都美食', reply:'锦官城里的火锅和串串最有名，不过辣得很，外地客官可别逞强！', relDelta:4, intelId:'intel_trade_route' },
      { id:'t_cd_inn_rest', text:'住店休息', reply:'好嘞！热水、毛巾、上房，一样不少！', relDelta:5, action:'inn_rest' },
    ],
    shop:{ items:[
      { id:'item_chengdu_noodle', icon:'🍜', name:'担担面', desc:'饱食度+42，麻辣开胃', price:10, effect:{ food:42 } },
      { id:'item_sichuan_fish', icon:'🐟', name:'水煮鱼', desc:'饱食度+48，气血+15', price:18, effect:{ food:48, hp:15 } },
      { id:'item_clear_water', icon:'💧', name:'清水', desc:'口渴度-45', price:4, effect:{ water:45 } },
    ]},
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_sect_secret'],
  },
  chengdu_doctor: {
    id:'chengdu_doctor', name:'蜀医馆主', role:'成都蜀医馆郎中', category:'medicine', avatar:'💊',
    city:'chengdu', level:35, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:110,
    greetings:['蜀中医学源远流长，先生哪里不舒服？','成都人爱吃辣，肠胃不好的人最多。','唐门就在附近，中毒解毒是我的专长。'],
    topics:[
      { id:'t_cd_doc_heal', text:'求医问诊', reply:'蜀道难行，外伤最多。老夫这跌打损伤最拿手。', relDelta:8, action:'heal' },
      { id:'t_cd_doc_poison', text:'解毒疗伤', reply:'唐门毒术天下闻名，解毒我也是一绝。', relDelta:7 },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'蜀中丸', desc:'气血+88', price:28, effect:{ hp:88 } },
      { id:'item_herb_anti', icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_jingqi_pill', icon:'⚪', name:'精气丸', desc:'气血+40，内力+60', price:22, effect:{ hp:40, mp:60 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_cultivation_tip'],
  },
  chengdu_smith: {
    id:'chengdu_smith', name:'蜀铁匠', role:'成都铁匠铺掌柜', category:'blacksmith', avatar:'⚒',
    city:'chengdu', level:32, tier:'func', weapon:'wep_iron_sword', armor:'cs_general', silver:160,
    greetings:['蜀中铁器，打出来最结实！','四川山路多，兵器轻便才是正道！','唐门和丐帮的人都来我这儿打家伙。'],
    topics:[
      { id:'t_cd_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把家伙拿来看看，蜀中的兵器我门儿清。', relDelta:0, action:'identify_equip' },
      { id:'t_cd_smith_repair', text:'修一修兵器', reply:'山路颠簸，兵器容易损坏，拿来我给你修。', relDelta:0, action:'repair' },
    ],
    shop:{ items:[
      { id:'item_sichuan_dao', icon:'⚔', name:'蜀中长刀', desc:'攻击+6，轻便适用', price:95, effect:{} },
      { id:'item_short_knife', icon:'🗡', name:'蜀地短刀', desc:'攻击+4，便于携带', price:58, effect:{} },
      { id:'item_whetstone', icon:'🪨', name:'磨刀石', desc:'攻击+8，持续5回合', price:10, effect:{ atkBuff:8, turns:5 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels:['intel_sect_secret'],
  },

  // ── 沧州客栈（镖局掌柜之外的正统客栈）──────────────────
  cangzhou_inn_real: {
    id:'cangzhou_inn_real', name:'张掌柜', role:'沧州武风客栈掌柜', category:'inn', avatar:'🏮',
    city:'cangzhou', level:26, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:45,
    greetings:['沧州武风浓，来这里的客官十个有八个是练家子！','镖师、武林人士，都爱在我这儿落脚。','练武之人伤了饿了，先来店里再说。'],
    topics:[
      { id:'t_cz_inn_wushu', text:'打听沧州武林', reply:'沧州人尚武，镖局最多。附近天地帮的人最近频繁出没，客官若要过路，多加小心！', relDelta:6, intelId:'intel_road_bandit' },
      { id:'t_cz_inn_rest', text:'住店休息', reply:'好！热水备好，客房干净！', relDelta:5, action:'inn_rest' },
    ],
    shop:{ items:[
      { id:'item_cangzhou_food', icon:'🥟', name:'沧州肉饼', desc:'饱食度+48，精力+15', price:12, effect:{ food:48, energy:15 } },
      { id:'item_hot_water', icon:'☕', name:'热茶', desc:'口渴度-40，精力+10', price:5, effect:{ water:40, energy:10 } },
    ]},
    quests:['quest_newbie_first_step','quest_newbie_letter_delivery','quest_newbie_gather_herbs','quest_missing_guest','quest_tavern_debt_chase','quest_daily_deliver','quest_matchmaking_trouble','quest_gossip_haunted_inn','quest_daily_gossip_general'],
    intels:['intel_road_bandit'],
  },

  // ── 襄阳医馆 ───────────────────────────────────────────
  xiangyang_doctor: {
    id:'xiangyang_doctor', name:'回春老医', role:'襄阳济世堂郎中', category:'medicine', avatar:'💊',
    city:'xiangyang', level:38, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:130,
    greetings:['襄阳自古为兵家必争之地，伤者不计其数，老夫这医术也是被逼出来的。','汉水之滨，水土宜人，也易生湿热。','守城将士来我这儿最多，刀枪伤见惯了。'],
    topics:[
      { id:'t_xydoc_heal', text:'求医问诊', reply:'襄阳城的伤患最多，老夫内外兼修，什么都能治。', relDelta:8, action:'heal' },
      { id:'t_xydoc_war', text:'聊守城旧事', reply:'当年郭大侠守城，伤亡无数，老夫的父亲就是那时候学的医。', relDelta:6, intelId:'intel_mingjiao_rise' },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'济世丸', desc:'气血+90', price:30, effect:{ hp:90 } },
      { id:'item_herb_anti', icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_jingqi_pill', icon:'⚪', name:'精气丸', desc:'气血+40，内力+60', price:22, effect:{ hp:40, mp:60 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_cultivation_tip'],
  },

  // ── 明州医馆 + 铁匠铺 ─────────────────────────────────
  mingzhou_doctor: {
    id:'mingzhou_doctor', name:'海医馆主', role:'明州海医馆郎中', category:'medicine', avatar:'💊',
    city:'mingzhou', level:33, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:110,
    greetings:['出海的人最容易受伤，我的医术就是被海水泡出来的。','海上风浪大，骨折骨裂最常见。','南洋来的疾病我也见过不少。'],
    topics:[
      { id:'t_mz_doc_heal', text:'求医问诊', reply:'出海人的伤我最拿手，风湿骨折都不在话下。', relDelta:8, action:'heal' },
      { id:'t_mz_doc_sea', text:'聊海上见闻', reply:'东海上最近有神秘船队出没，不知道是什么来头。', relDelta:5, intelId:'intel_trade_route' },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'海风丸', desc:'气血+82', price:26, effect:{ hp:82 } },
      { id:'item_sea_herb', icon:'🌊', name:'海底珍草', desc:'内力+30，气血+40', price:50, effect:{ mp:30, hp:40 } },
      { id:'item_herb_anti', icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_cultivation_tip'],
  },
  mingzhou_smith: {
    id:'mingzhou_smith', name:'海锤王', role:'明州铁匠铺掌柜', category:'blacksmith', avatar:'⚒',
    city:'mingzhou', level:30, tier:'func', weapon:'wep_iron_sword', armor:'cs_general', silver:140,
    greetings:['出海打渔的、跑船运的，都得在我这儿买好家伙！','海水腐蚀木头也腐蚀铁，我这钢是专门防海水的！','海沙派的人最近老来买刀，也不知道在折腾什么。'],
    topics:[
      { id:'t_mz_smith_identify', text:'🔍 鉴定装备（收费）', reply:'出海人的兵器都有来历，拿来看看我给你把把关。', relDelta:0, action:'identify_equip' },
      { id:'t_mz_smith_repair', text:'修一修兵器', reply:'海水泡过的铁器容易脆，拿来我看看能不能修。', relDelta:0, action:'repair' },
    ],
    shop:{ items:[
      { id:'item_sea_dao', icon:'⚔', name:'海船长刀', desc:'攻击+6，防潮', price:100, effect:{} },
      { id:'item_short_sword', icon:'🗡', name:'水手短剑', desc:'攻击+4，防锈', price:65, effect:{} },
      { id:'item_whetstone', icon:'🪨', name:'磨刀石', desc:'攻击+8，持续5回合', price:10, effect:{ atkBuff:8, turns:5 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels:['intel_trade_route'],
  },

  // ── 岳阳医馆 + 铁匠铺 ─────────────────────────────────
  yueyang_doctor: {
    id:'yueyang_doctor', name:'洞庭医馆主', role:'岳阳济世堂郎中', category:'medicine', avatar:'💊',
    city:'yueyang', level:34, tier:'func', weapon:'wep_wooden_stick', armor:'cs_cloth', silver:115,
    greetings:['洞庭湖浩渺，湿气最重，客官要当心风寒。','水贼多争斗，伤筋动骨来我这儿治的人不少。','岳阳楼边的酒楼醉倒的客人，也常送来我这儿醒酒。'],
    topics:[
      { id:'t_yydoc_heal', text:'求医问诊', reply:'湖边湿气重，我这祛湿化寒的药最拿手。', relDelta:8, action:'heal' },
      { id:'t_yydoc_lake', text:'聊洞庭水贼', reply:'洞庭水贼里也有几个讲义气的，但大多数是亡命之徒。', relDelta:5, intelId:'intel_road_bandit' },
    ],
    shop:{ type:'medicine', items:[
      { id:'item_bandage', icon:'🩹', name:'止血绷带', desc:'气血+50', price:16, effect:{ hp:50 } },
      { id:'item_medicine', icon:'💊', name:'济世丸', desc:'气血+88', price:28, effect:{ hp:88 } },
      { id:'item_herb_anti', icon:'🟢', name:'解毒丸', desc:'解除中毒，气血+20', price:18, effect:{ detox:true, hp:20 } },
      { id:'item_jingqi_pill', icon:'⚪', name:'精气丸', desc:'气血+40，内力+60', price:22, effect:{ hp:40, mp:60 } },
    ]},
    quests:['quest_rare_herb','quest_doctor_missing_patient','quest_antidote_run','quest_daily_medicine_delivery','quest_gossip_fake_patient','quest_daily_gossip_general','quest_fishing_medicine','quest_fishing_daily'],
    intels:['intel_cultivation_tip'],
  },
  yueyang_smith: {
    id:'yueyang_smith', name:'铁二锤', role:'岳阳铁匠铺掌柜', category:'blacksmith', avatar:'⚒',
    city:'yueyang', level:29, tier:'func', weapon:'wep_iron_sword', armor:'cs_general', silver:135,
    greetings:['洞庭湖边打铁，锤声传得远！','水上作战和陆地不同，我这刀更适合船上用！','水贼也来买刀，银子给得爽快，就是不问来历。'],
    topics:[
      { id:'t_yy_smith_identify', text:'🔍 鉴定装备（收费）', reply:'把家伙拿来看看，洞庭湖边的兵器我也见过不少。', relDelta:0, action:'identify_equip' },
      { id:'t_yy_smith_repair', text:'修一修兵器', reply:'水边的兵器最容易锈，拿来我给你看看。', relDelta:0, action:'repair' },
    ],
    shop:{ items:[
      { id:'item_lake_dao', icon:'⚔', name:'洞庭长刀', desc:'攻击+6，轻便耐湿', price:98, effect:{} },
      { id:'item_short_knife', icon:'🗡', name:'渔刀', desc:'攻击+4，船上必备', price:60, effect:{} },
      { id:'item_whetstone', icon:'🪨', name:'磨刀石', desc:'攻击+8，持续5回合', price:10, effect:{ atkBuff:8, turns:5 } },
    ]},
    quests:['quest_iron_ore','quest_smith_stolen_hammer','quest_smith_rare_ore','quest_daily_smith_errand','quest_gossip_mystery_weapon','quest_daily_gossip_general'],
    intels:['intel_trade_route'],
  },

});

