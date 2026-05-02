// npc-data-map.js — 任务库 / 情报库 / 城镇NPC映射表
// 自动从 npc-data.js 拆分生成

// ════════════════════════════════════════════════════
//  任务数据库 QUEST_DB
//  任务字段说明：
//  ── 基础字段 ──
//  id          任务唯一ID
//  name        任务名
//  icon        图标
//  desc        任务描述
//  type        任务类型: 'travel'|'kill'|'fetch'|'talk'|'combat'|'deliver'
//  reward      { silver, exp, rel, item, manual, intel, fame }
//  rewardText  奖励描述文本
//  ── 任务链/步骤 ──
//  chain       所属连环任务链ID（如果有）
//  chainStep   在链中的步骤序号（1开始）
//  nextQuest   完成后解锁的下一个任务ID（连环任务专用）
//  prevQuest   前置任务ID（需要先完成才能接此任务）
//  ── 重复任务 ──
//  repeatable  true=可重复接取
//  cooldownDays  重置冷却天数（游戏内天数）
//  repeatReward  重复完成时的奖励（通常低于首次）
//  ── 完成条件 ──
//  targetNpcId   击杀类目标NPC ID
//  targetName    目标名称（显示用）
//  targetCityId  目标所在城市ID
//  triggerCity   到达此城市触发完成
//  ── 其他 ──
//  minRel      接取所需最低好感度（默认-100）
//  minLevel    接取所需最低等级（默认1）
// ════════════════════════════════════════════════════
const QUEST_DB = {

  // ══════════════════════════════════════════════════
  //  零、新手引导任务链（等级1-3可接，友好NPC专属）
  // ══════════════════════════════════════════════════


  // ─── 新手链 N：初入江湖 ───
  // 发布者：客栈掌柜/旅店老板
  // 节奏：先在本地探索（地下城）→ 熟悉战斗 → 再出城旅行
  quest_newbie_first_step: {
    id:'quest_newbie_first_step', name:'【新手】附近探险',
    icon:'⚔️', type:'fetch',
    chain:'chain_newbie_n', chainStep:1,
    minRel: 0, minLevel: 1, maxLevel: 5,
    desc:'【新手引导】掌柜说城外险地最近闹贼，附近商旅被劫苦不堪言。他请你进去清剿几个山贼，缴几把贼刀回来作为证明。打赢了有额外赏钱！',
    reward:{ silver:15, exp:30, rel:15 }, rewardText:'15两 + 经验 + 好感度',
    nextQuest:'quest_newbie_letter_delivery',
    targetItem: 'item_crude_blade',  // 山贼掉落的粗制刀（无需改掉落表）
    targetName: '粗制刀',
    targetCount: 2,
  },
  quest_newbie_letter_delivery: {
    id:'quest_newbie_letter_delivery', name:'【新手】捎封信',
    icon:'✉️', type:'deliver',
    chain:'chain_newbie_n', chainStep:2,
    minRel: 0, minLevel: 1, maxLevel: 5,
    // desc 由接取时动态生成（根据发起城市查 DELIVER_NPC_MAP），此处作兜底
    desc:'【新手引导】掌柜有封家书想托人送给城中大夫，看你办事靠谱，请你跑这一趟。送到后记得回来复命。',
    reward:{ silver:20, exp:20, rel:20 }, rewardText:'20两 + 经验 + 好感度',
    nextQuest:'quest_newbie_gather_herbs',
    targetCityId: null,   // 接取时由 npcAcceptQuest 动态写入 questOverrides
    targetNpcId:  null,   // 接取时动态写入
    targetName: '城中大夫',
  },
  quest_newbie_gather_herbs: {
    id:'quest_newbie_gather_herbs', name:'【新手】城外转转',
    icon:'🌿', type:'travel',
    chain:'chain_newbie_n', chainStep:3,
    minRel: 0, minLevel: 1, maxLevel: 5,
    desc:'【新手引导】掌柜说城外不远处有片草地，风景不错，让你去转转，顺便感受一下这里的风土人情，回来聊聊见闻即可。',
    reward:{ silver:18, exp:30, rel:15, item:'item_herb_blood' }, rewardText:'18两 + 经验 + 活血草×1',
    triggerCity: null,
  },

  // ─── 新手链 W：武艺启蒙 ───
  // 发布者：武馆/铁匠
  // 特点：教战斗基础、奖励武器
  quest_newbie_sparring: {
    id:'quest_newbie_sparring', name:'【新手】切磋武艺',
    icon:'🥋', type:'combat',
    chain:'chain_newbie_w', chainStep:1,
    minRel: 0, minLevel: 1, maxLevel: 5,
    desc:'【新手引导】武师见你骨骼清奇，想指点你几招。和他切磋一场，无论输赢都能学到东西。',
    reward:{ silver:10, exp:40, rel:20 }, rewardText:'10两 + 大量经验 + 好感度',
    nextQuest:'quest_newbie_weapon_trial',
  },
  quest_newbie_weapon_trial: {
    id:'quest_newbie_weapon_trial', name:'【新手】试炼兵器',
    icon:'⚔️', type:'fetch',
    chain:'chain_newbie_w', chainStep:2,
    minRel: 0, minLevel: 1, maxLevel: 5,
    desc:'【新手引导】武师想考验你的实战能力，他让你去城外找些野兔练练手，顺便带3块野兔肉回来做下酒菜。',
    reward:{ silver:25, exp:25, rel:15 }, rewardText:'25两 + 经验 + 好感度',
    targetItem:'item_meat_rabbit',
    targetName:'野兔肉',
    targetCount: 3,
  },

  // ══════════════════════════════════════════════════
  //  一、通用单次任务（各职业NPC专属）
  // ══════════════════════════════════════════════════

  // ── 客栈系 ──
  quest_missing_guest: {
    id:'quest_missing_guest', name:'失踪的旅客',
    icon:'🔍', type:'travel',
    minRel: 10,
    desc:'旅店昨夜有位书生住下，今晨发现人不见了，随身包袱还在。掌柜怀疑与城西那帮道上的人有关，求你帮忙去查探一番。',
    reward:{ silver:25, exp:20, rel:20 }, rewardText:'25两银子 + 好感度',
    triggerCity: null, // 旅行一次即触发完成
  },

  // ── 郎中系 ──
  quest_rare_herb: {
    id:'quest_rare_herb', name:'寻找百年灵芝',
    icon:'🍄', type:'travel',
    minRel: 10,
    desc:'有位重病患者急需一株百年灵芝方能续命，山野之中方有此物。神医求你出山代为寻访，若能寻到，必有重谢。',
    reward:{ silver:40, exp:25, item:'item_herb_qi', rel:25 }, rewardText:'40两 + 参须片 + 好感度',
    triggerCity: null,
  },

  // ── 铁匠系 ──
  quest_iron_ore: {
    id:'quest_iron_ore', name:'铁矿石原料',
    icon:'⛏', type:'travel',
    minRel: 20,
    desc:'铁匠要打一批神兵利器，急需玄铁矿石，但矿山最近被一群流寇占据。你若能去清剿，事成后给你铸一件趁手兵器。',
    reward:{ silver:55, exp:35, rel:30 }, rewardText:'55两银子 + 铁匠好感度',
    triggerCity: null,
  },

  // ── 乞丐/花子系 ──
  quest_beg_food: {
    id:'quest_beg_food', name:'一碗热饭',
    icon:'🍚', type:'deliver',
    minRel: 0,
    desc:'这位老叫花已饿了整整三天，只盼着一顿热饭。他说，吃饱了有个大秘密要告诉你……',
    reward:{ silver:0, intel:'intel_tianshu', rel:25 }, rewardText:'绝密情报 + 好感度',
  },

  // ── 隐士/老侠系 ──
  quest_test_talent: {
    id:'quest_test_talent', name:'武学天赋考验',
    icon:'⚔', type:'combat',
    minRel: 30,
    desc:'归隐老侠阅人无数，想亲眼见识你的武学根骨。只需和他切磋一场，若能撑过十招，他将传你一套独门心法。',
    reward:{ silver:0, exp:60, rel:35 }, rewardText:'武学指点 + 大量经验',
  },

  // ── 商人系 ──
  quest_escort_goods: {
    id:'quest_escort_goods', name:'押送货物',
    icon:'📦', type:'travel',
    minRel: 10,
    desc:'掌柜有批贵重货物需押送至邻城，雇的镖师临时出了事，情急之下只好请你出手，酬劳绝不会亏待你。',
    reward:{ silver:90, exp:30, rel:25 }, rewardText:'90两银子',
    triggerCity: null,
  },

  // ── 门派长老系 ──
  quest_sect_mission: {
    id:'quest_sect_mission', name:'门派要务',
    icon:'🏯', type:'travel',
    minRel: 40, reqSect: true,
    desc:'门派有一项紧急要务，需人亲往外地处置。掌门点了你的名——这是门派对你的器重，好生完成，不可辜负。',
    reward:{ silver:70, exp:60, rel:45, contrib:10 }, rewardText:'70两银子 + 大量声誉 + 10贡献',
    triggerCity: null,
  },

  // ── 酒馆系 ──
  quest_drunk_brawl: {
    id:'quest_drunk_brawl', name:'醉鬼闹事',
    icon:'🍺', type:'combat',
    minRel: 0,
    desc:'几个喝醉了酒的流氓在酒馆里动手打砸，掌柜被逼得无奈，求你出手镇压，事成后请你喝个痛快。',
    reward:{ silver:15, exp:25, rel:20 }, rewardText:'15两 + 请客喝酒',
  },

  // ── 医馆附加 ──
  quest_antidote_run: {
    id:'quest_antidote_run', name:'解毒急件',
    icon:'💊', type:'travel',
    minRel: 10,
    desc:'山上寺庙有位武僧中了奇毒，郎中配好了解药，但自己行动不便，恳请你替他送去。要快——耽误了是要出人命的。',
    reward:{ silver:35, exp:30, rel:30 }, rewardText:'35两 + 好感度',
    triggerCity: null,
  },

  // ── 江湖侦探/情报系 ──
  quest_spy_trail: {
    id:'quest_spy_trail', name:'暗中追踪',
    icon:'🕵', type:'travel',
    minRel: 30,
    desc:'城中疑有奸细，却无确凿证据。需要你悄悄跟踪一个可疑人物，查明其底细，带回消息即可，不必动手。',
    reward:{ silver:60, exp:40, rel:30 }, rewardText:'60两 + 好感度',
    triggerCity: null,
  },

  // ── 护卫/将领系 ──
  quest_patrol_road: {
    id:'quest_patrol_road', name:'护送商队',
    icon:'🛡', type:'travel',
    minRel: 20,
    desc:'一支商队要穿越险要路段，途中常有山贼劫道。将领希望你随队保护，到达目的地后厚酬。',
    reward:{ silver:100, exp:45, rel:30 }, rewardText:'100两银子',
    triggerCity: null,
  },

  // ── 渡口/船夫系 ──
  quest_river_pirate: {
    id:'quest_river_pirate', name:'清剿水贼',
    icon:'⚓', type:'travel',
    minRel: 20,
    desc:'黄河上近来出了一帮水贼，拦截过往船只，弄得渡口生意萧条。船夫托你帮忙去收拾那群家伙，事成后免费送你过河。',
    reward:{ silver:50, exp:40, rel:25 }, rewardText:'50两 + 免费渡河',
    triggerCity: null,
  },

  // ── 学者/书生系 ──
  quest_lost_book: {
    id:'quest_lost_book', name:'寻回古籍',
    icon:'📚', type:'kill',
    minRel: 20,
    desc:'书生遗失了一册珍贵古籍，据说被城里的混混拿走换了酒钱。帮他追回来，他愿意以书中记载的武学心得相赠。',
    reward:{ silver:0, exp:50, rel:40, manual:'m_cm_frag1' }, rewardText:'武学心得残卷 + 好感度',
    targetEnemyType:'bandit', targetTier:'func',
    targetName:'城中混混', targetCount:1,
  },

  // ── 诗人/艺人系 ──
  quest_song_request: {
    id:'quest_song_request', name:'一曲相托',
    icon:'🎵', type:'travel',
    minRel: 10,
    desc:'游吟诗人听闻某处有位奇人精通失传曲谱，想请你代为打探，若能带回只言片语，他愿以珍藏的江湖图赠你。',
    reward:{ silver:30, exp:35, rel:35 }, rewardText:'30两 + 好感度',
    triggerCity: null,
  },

  // ── 武馆/武师系 ──
  quest_dojo_challenge: {
    id:'quest_dojo_challenge', name:'武馆扬名',
    icon:'🥊', type:'combat',
    minRel: 20,
    desc:'武馆近来被附近混混骚扰，名声受损。师傅希望你挑战那些捣乱的人，以武扬名，让武馆重振威风。',
    reward:{ silver:60, exp:70, rel:40 }, rewardText:'60两 + 经验丰厚',
  },

  // ═══════════════════════════════════════════════
  //  二、日常任务模板（4个通用模板，由系统动态生成实例）
  // ═══════════════════════════════════════════════

  // 模板1：击杀类日常 - 清剿
  quest_daily_kill: {
    id:'quest_daily_kill', name:'【日常】清剿恶徒',
    icon:'⚔️', type:'kill',
    minRel: 10, minLevel: 5,
    desc:'【可重复】附近出没的恶徒滋扰百姓，官府悬赏缉拿。',
    reward:{ silver:40, exp:30, rel:6 }, rewardText:'40两 + 经验',
    repeatable: true, cooldownDays: 2,
    // 目标由系统按城市附近敌人生成
  },

  // 模板2：采集类日常 - 收集物资
  quest_daily_collect: {
    id:'quest_daily_collect', name:'【日常】收集物资',
    icon:'📦', type:'collect',
    minRel: 0,
    desc:'【可重复】城中商户需要一批物资，去附近险地采集即可换取酬劳。',
    reward:{ silver:30, exp:20, rel:5 }, rewardText:'30两 + 经验',
    repeatable: true, cooldownDays: 2,
    // 目标物品由系统按城市资源生成
  },

  // 模板3：送达类日常 - 送信送货
  quest_daily_deliver: {
    id:'quest_daily_deliver', name:'【日常】急件送达',
    icon:'📨', type:'deliver',
    minRel: 0,
    // desc 由接取时动态生成（根据发起城市查 DELIVER_NPC_MAP），此处作兜底
    desc:'【可重复】有一批急件需要送往本城指定收件人，送到即可领取酬劳。',
    reward:{ silver:35, exp:18, rel:5 }, rewardText:'35两 + 经验',
    repeatable: true, cooldownDays: 2,
    targetCityId: null, // 接取时由 npcAcceptQuest 动态写入 questOverrides
    targetNpcId:  null, // 接取时动态写入
    targetName: '收件人',
  },

  // 模板4：探索类日常 - 附近巡查
  quest_daily_explore: {
    id:'quest_daily_explore', name:'【日常】外出巡查',
    icon:'🌿', type:'travel',
    minRel: 0, minLevel: 3,
    desc:'【可重复】去附近城镇走走，打探消息，回来汇报即可。',
    reward:{ silver:25, exp:22, rel:4 }, rewardText:'25两 + 经验',
    repeatable: true, cooldownDays: 2,
    triggerCity: null,
  },


  // ═══════════════════════════════════════════════
  //  三、连环任务链 A：江湖恩仇录
  //  发布者：luoyang_inn (洛阳客栈掌柜) 的进阶任务链
  //  前置：quest_missing_guest 已完成
  // ═══════════════════════════════════════════════

  chain_inn_a1: {
    id:'chain_inn_a1', name:'旅客的下落',
    icon:'🔍', type:'travel',
    chain:'chain_inn', chainStep:1,
    prevQuest:'quest_missing_guest',
    nextQuest:'chain_inn_a2',
    desc:'【连环·一】根据你查回的线索，失踪旅客竟被城西天地帮的人软禁，正关押在附近。前往邻近城镇打探更多线索，再来汇报。',
    reward:{ silver:40, exp:35, rel:15 }, rewardText:'40两 + 经验',
    triggerCity: null,
  },
  chain_inn_a2: {
    id:'chain_inn_a2', name:'天地帮的把柄',
    icon:'🗡', type:'kill',
    chain:'chain_inn', chainStep:2,
    prevQuest:'chain_inn_a1',
    nextQuest:'chain_inn_a3',
    desc:'【连环·二】你查到了天地帮在此地的据点头目，旅客正被他扣押以换取一笔赎金。干掉这个家伙，救出旅客！',
    reward:{ silver:80, exp:60, rel:20 },
    rewardText:'80两 + 经验',
    targetNpcId:'npc_tiandibang_toll',
    targetName:'天地帮据点头目',
    targetCityId: null,
  },
  chain_inn_a3: {
    id:'chain_inn_a3', name:'旅客的谢礼',
    icon:'🎁', type:'talk',
    chain:'chain_inn', chainStep:3,
    prevQuest:'chain_inn_a2',
    desc:'【连环·三·终】旅客脱险后感激涕零，说自己其实是一名江湖信使，随身携带着一份重要情报。他愿意将这份情报交给你，作为回报。',
    reward:{ silver:0, exp:80, rel:40, intel:'intel_tianshu' },
    rewardText:'绝密情报 + 大量好感',
  },

  // ═══════════════════════════════════════════════
  //  连环任务链 B：神医的考验
  //  发布者：郎中NPC 的进阶任务链
  //  前置：quest_rare_herb 已完成
  // ═══════════════════════════════════════════════

  chain_doc_b1: {
    id:'chain_doc_b1', name:'百草之中寻奇毒',
    icon:'🍵', type:'fetch',
    chain:'chain_doc', chainStep:1,
    prevQuest:'quest_rare_herb',
    nextQuest:'chain_doc_b2',
    desc:'【连环·一】神医说，救活那位患者还差一味解毒之药，但此药极为罕见。请你前往深山一带寻访，旅途中留意奇异草药。',
    reward:{ silver:50, exp:40, rel:20 }, rewardText:'50两 + 经验',
    triggerCity: null,
  },
  chain_doc_b2: {
    id:'chain_doc_b2', name:'劫药的贼人',
    icon:'⚔', type:'kill',
    chain:'chain_doc', chainStep:2,
    prevQuest:'chain_doc_b1',
    nextQuest:'chain_doc_b3',
    desc:'【连环·二】你带回了草药，却遭到一伙人拦截——原来五毒教的人也在觊觎这味解药，以便研制更强的蛊毒。干掉他们，护住药材！',
    reward:{ silver:70, exp:70, rel:25 }, rewardText:'70两 + 经验',
    targetNpcId:'npc_wudu_experiment',
    targetName:'五毒教弟子',
    targetCityId: null,
  },
  chain_doc_b3: {
    id:'chain_doc_b3', name:'神医的传承',
    icon:'📜', type:'talk',
    chain:'chain_doc', chainStep:3,
    prevQuest:'chain_doc_b2',
    desc:'【连环·三·终】患者得救，神医大受感动。他说，自己这一生所学，无人继承，今日见你侠义心肠，愿以一套医道心法相赠，既可疗伤，亦可克毒。',
    reward:{ silver:0, exp:120, rel:50, manual:'m_ta_frag1' },
    rewardText:'道系医功残卷 + 大量好感',
  },

  // ═══════════════════════════════════════════════
  //  连环任务链 C：铁匠与神剑
  //  发布者：铁匠NPC 的进阶任务链
  //  前置：quest_iron_ore 已完成
  // ═══════════════════════════════════════════════

  chain_smith_c1: {
    id:'chain_smith_c1', name:'神兵的传说',
    icon:'⚒', type:'travel',
    chain:'chain_smith', chainStep:1,
    prevQuest:'quest_iron_ore',
    nextQuest:'chain_smith_c2',
    desc:'【连环·一】铁匠在矿石中发现了一块传说中的陨铁碎片，却缺少锻造方法。他听闻西边某处有位老匠人掌握着古法，托你去打听。',
    reward:{ silver:60, exp:50, rel:20 }, rewardText:'60两 + 经验',
    triggerCity: null,
  },
  chain_smith_c2: {
    id:'chain_smith_c2', name:'失落的锻造图',
    icon:'🗺', type:'kill',
    chain:'chain_smith', chainStep:2,
    prevQuest:'chain_smith_c1',
    nextQuest:'chain_smith_c3',
    desc:'【连环·二】老匠人曾有一份失传的锻造秘图，但据说被强盗抢走了。追上那伙强盗头目，把锻造图夺回来！',
    reward:{ silver:80, exp:60, rel:25 }, rewardText:'80两 + 经验',
    targetNpcId:'npc_bandit_chief_cangzhou',
    targetName:'强盗头目', targetCount:1,
    targetCityId: null,
  },
  chain_smith_c3: {
    id:'chain_smith_c3', name:'玄铁神兵',
    icon:'⚔', type:'talk',
    chain:'chain_smith', chainStep:3,
    prevQuest:'chain_smith_c2',
    desc:'【连环·三·终】铁匠得到锻造图，历经三日三夜，终于以陨铁铸成了一柄神兵。这把剑只能属于为他寻回材料的你，连同秘技一同收下！',
    reward:{ silver:200, exp:150, rel:60, manual:'m_sw_rare1' }, rewardText:'200两 + 天下剑谱孤本 + 大量好感',
  },

  // ═══════════════════════════════════════════════
  //  连环任务链 D：隐士的衣钵
  //  发布者：隐居老侠NPC 的进阶任务链
  //  前置：quest_test_talent 已完成
  // ═══════════════════════════════════════════════

  chain_hermit_d1: {
    id:'chain_hermit_d1', name:'旧日恩仇',
    icon:'🗡', type:'talk',
    chain:'chain_hermit', chainStep:1,
    prevQuest:'quest_test_talent',
    nextQuest:'chain_hermit_d2',
    desc:'【连环·一】老侠今日主动叫住你，神情凝重。他说有一件往事压在心头多年，徒弟当年的叛逃，让他从此隐居。他需要知道那个叛徒现在何处。',
    reward:{ silver:0, exp:60, rel:25 }, rewardText:'经验 + 好感',
    triggerCity: null,
  },
  chain_hermit_d2: {
    id:'chain_hermit_d2', name:'背叛者的末路',
    icon:'⚔', type:'kill',
    chain:'chain_hermit', chainStep:2,
    prevQuest:'chain_hermit_d1',
    nextQuest:'chain_hermit_d3',
    desc:'【连环·二】你查到了叛徒的下落——他如今是邪道门派的一员打手，在某处横行。老侠无法亲去，只能托你替他了结这段恩仇。',
    reward:{ silver:100, exp:100, rel:30 }, rewardText:'100两 + 经验',
    targetNpcId:'npc_xuegu_ruffian',
    targetName:'叛徒·变节者',
    targetCityId: null,
  },
  chain_hermit_d3: {
    id:'chain_hermit_d3', name:'老侠的衣钵',
    icon:'📖', type:'talk',
    chain:'chain_hermit', chainStep:3,
    prevQuest:'chain_hermit_d2',
    desc:'【连环·三·终】恩仇了结，老侠沉默良久，终于开口："我这一身功夫，本来要带进棺材里。今日见你，倒改了主意。"他将毕生绝学倾囊相授。',
    reward:{ silver:0, exp:200, rel:70, manual:'m_sw_partial1' },
    rewardText:'高级秘籍 + 大量好感',
  },

  // ═══════════════════════════════════════════════
  //  连环任务链 E：商人的秘密
  //  发布者：商人NPC 的进阶任务链
  //  前置：quest_escort_goods 已完成
  // ═══════════════════════════════════════════════

  chain_merchant_e1: {
    id:'chain_merchant_e1', name:'账目里的秘密',
    icon:'📊', type:'travel',
    chain:'chain_merchant', chainStep:1,
    prevQuest:'quest_escort_goods',
    nextQuest:'chain_merchant_e2',
    desc:'【连环·一】掌柜私下找你，说货物平安送达后发现账目对不上——有人在动手脚。他怀疑收货方有问题，托你去那边暗中打探。',
    reward:{ silver:80, exp:50, rel:20 }, rewardText:'80两 + 经验',
    triggerCity: null,
  },
  chain_merchant_e2: {
    id:'chain_merchant_e2', name:'黑吃黑的内幕',
    icon:'🗡', type:'kill',
    chain:'chain_merchant', chainStep:2,
    prevQuest:'chain_merchant_e1',
    nextQuest:'chain_merchant_e3',
    desc:'【连环·二】你查出收货方伙同江湖帮派截留货款，且已拿到账本，正欲灭口。先发制人，干掉那个幕后主使，夺回账本！',
    reward:{ silver:120, exp:80, rel:30 }, rewardText:'120两 + 经验',
    targetNpcId:'npc_tiandibang_boss',
    targetName:'幕后主使',
    targetCityId: null,
  },
  chain_merchant_e3: {
    id:'chain_merchant_e3', name:'掌柜的感谢',
    icon:'🎁', type:'talk',
    chain:'chain_merchant', chainStep:3,
    prevQuest:'chain_merchant_e2',
    desc:'【连环·三·终】账本追回，掌柜感激涕零，把被扣押的货款如数拿了出来，加倍作为谢礼。他还说，往后你在他这里购物，永远七折。',
    reward:{ silver:300, exp:100, rel:60 }, rewardText:'300两巨赏 + 永久好感',
  },

  // ══════════════════════════════════════════════════
  //  四、职业专属任务（按NPC类型批量分配）
  // ══════════════════════════════════════════════════

  // ── 酒馆掌柜(tavern) ──
  quest_tavern_troublemaker: {
    id:'quest_tavern_troublemaker', name:'地头蛇来收保护费',
    icon:'🍺', type:'combat', minRel: 20,
    desc:'本地一股地头蛇三天两头来酒馆闹事，逼着掌柜缴纳"保护费"。掌柜忍无可忍，请你出面教训这帮人，让他们再也不敢踏足此地。',
    reward:{ silver:35, exp:30, rel:25 }, rewardText:'35两银子 + 好感度',
  },
  quest_tavern_lost_recipe: {
    id:'quest_tavern_lost_recipe', name:'失传的陈年酒方',
    icon:'📜', type:'travel', minRel: 10,
    desc:'酒馆祖传秘方被多年前一个食客偷走，据说辗转落入某处山寨。掌柜只求你打探一番，能带回抄本更好，事成后请你喝一坛陈年老酒。',
    reward:{ silver:20, exp:25, rel:30 }, rewardText:'20两 + 陈年好酒相赠',
    triggerCity: null,
  },
  quest_tavern_debt_chase: {
    id:'quest_tavern_debt_chase', name:'追讨赊账',
    icon:'💰', type:'travel', minRel: 15,
    desc:'有个常客赊酒喝，一走就是三个月，账单压着整整五十两。掌柜托你去他最后露面的城镇找人讨债，追回多少算多少，事成分你两成。',
    reward:{ silver:10, exp:20, rel:20 }, rewardText:'追回银两的两成 + 好感度',
    triggerCity: null,
  },
  quest_daily_tavern_supply: {
    id:'quest_daily_tavern_supply', name:'【日常】打杂帮工',
    icon:'🔄', type:'collect', minRel: 0,
    desc:'【可重复】酒馆需要一批野味食材招待客人，采集5只野兔即可换取酬劳。',
    reward:{ silver:25, exp:15, rel:5 }, rewardText:'25两银子（每次）',
    repeatable: true, cooldownDays: 3,
    repeatReward:{ silver:25, exp:15, rel:5 },
    targetItem:'item_meat_rabbit',
    targetName:'野兔肉',
    targetCount: 5,
  },

  // ── 郎中/医馆(doctor) 附加 ──
  quest_doctor_missing_patient: {
    id:'quest_doctor_missing_patient', name:'失踪的病人',
    icon:'🔍', type:'travel', minRel: 15,
    desc:'一个重症病人突然从医馆失踪，他身上的奇毒还未解清，拖延下去必死无疑。郎中担忧不已，请你去城外找寻，或许是神志不清跑到郊外去了。',
    reward:{ silver:30, exp:25, rel:25 }, rewardText:'30两 + 好感度',
    triggerCity: null,
  },
  quest_doctor_poison_sample: {
    id:'quest_doctor_poison_sample', name:'采集毒虫样本',
    icon:'🐍', type:'fetch', minRel: 25,
    desc:'郎中研制新解毒药，急需一只活的蜈蚣王和几枚毒蝎，这些东西藏在山野暗处，若敢去捉，郎中愿以新配的护体丹药作酬。',
    reward:{ silver:0, exp:30, item:'item_jiedu_pill', rel:30 }, rewardText:'解毒丸 × 2 + 好感度',
    targetItem:'item_venom_sac', targetName:'毒虫毒囊', targetCount:2,
  },
  // ── 铁匠(smith) 附加 ──
  quest_smith_stolen_hammer: {
    id:'quest_smith_stolen_hammer', name:'被盗的祖传铁锤',
    icon:'🔨', type:'kill', minRel: 20,
    desc:'铁匠的祖传打铁神锤被贼人盗走，没了它打出来的铁器总差一口气。据说贼人还在城外游荡，请你追上去，把锤子夺回来。',
    reward:{ silver:40, exp:30, rel:30 }, rewardText:'40两 + 铁匠好感度',
    targetEnemyType:'bandit', targetTier:'func',
    targetName:'持锤贼人', targetCount:1,
  },
  quest_smith_rare_ore: {
    id:'quest_smith_rare_ore', name:'秘境玄铁',
    icon:'⛏', type:'travel', minRel: 30,
    desc:'铁匠听说深山某处有一脉天然玄铁矿，品质远胜寻常矿石，但那里有野兽出没。请你前往打探虚实，若能带回一块样矿，重金酬谢。',
    reward:{ silver:70, exp:50, rel:30 }, rewardText:'70两银子 + 铸造材料',
    triggerCity: null,
  },
  // ── 门派长老/宗师(elder/master) ──
  quest_elder_rogue_disciple: {
    id:'quest_elder_rogue_disciple', name:'叛出门墙的弟子',
    icon:'⚔', type:'kill', minRel: 50, reqSect: true,
    desc:'门派一名弟子因不满规矩，盗走本门功法秘笈叛逃，如今在江湖上为非作歹，败坏门派声誉。长老命你将其拿回，若死硬不从，格杀勿论。',
    reward:{ silver:60, exp:60, rel:40, contrib:15 }, rewardText:'60两银子 + 大量好感度 + 15贡献',
    targetEnemyType:'fighter', targetTier:'func', targetName:'江湖浪人',
  },
  quest_elder_verify_outsider: {
    id:'quest_elder_verify_outsider', name:'验明外来者身份',
    icon:'🔍', type:'travel', minRel: 30, reqSect: true,
    desc:'近日有陌生人在本派驻地附近转悠，行迹鬼祟，长老怀疑是别派奸细。请你暗中跟踪，弄清其来路，回来汇报即可。',
    reward:{ silver:35, exp:35, rel:25, contrib:5 }, rewardText:'35两 + 好感度 + 5贡献',
    triggerCity: null,
  },
  quest_elder_ancient_tome: {
    id:'quest_elder_ancient_tome', name:'追寻失传典籍',
    icon:'📚', type:'travel', minRel: 60, reqSect: true,
    desc:'本派一册失传百年的功法典籍，据情报线索辗转流传至某处。长老希望你代为追访，若能寻回，门派将以重礼相赠，甚至传你一套绝学。',
    reward:{ silver:50, exp:100, rel:60, contrib:20, manual:'m_bd_frag1' }, rewardText:'50两 + 武学秘籍残卷 + 大量好感度 + 20贡献',
    triggerCity: null,
  },
  // ── 武僧/道士(monk/taoist) ──
  quest_monk_demon_banish: {
    id:'quest_monk_demon_banish', name:'驱邪除魔',
    icon:'☯', type:'combat', minRel: 20,
    desc:'附近有一处废宅，近来传出阴森怪声，村民惶恐不安，无法耕作。寺中长老命你前往查探，若是野兽便驱赶，若真遇上邪祟，将其斩灭。',
    reward:{ silver:30, exp:40, rel:30 }, rewardText:'30两 + 佛门功法传授',
  },
  quest_monk_pilgrim_escort: {
    id:'quest_monk_pilgrim_escort', name:'护送香客',
    icon:'🙏', type:'travel', minRel: 10,
    desc:'一批虔诚香客要翻山礼佛，途中山路险峻，听说近来有山贼出没。寺僧请你随行护送，保香客平安到达，功德无量。',
    reward:{ silver:20, exp:30, rel:35 }, rewardText:'20两 + 佛家秘方',
    triggerCity: null,
  },
  quest_taoist_herb_gather: {
    id:'quest_taoist_herb_gather', name:'采集天材地宝',
    icon:'🌿', type:'fetch', minRel: 15,
    desc:'道观炼制丹药所需天材地宝，需前往深山采集。道士年迈腿脚不便，请你代劳，采回后可得一枚辛苦炼制的培元丹。',
    reward:{ silver:0, exp:45, item:'item_peiyuan_pill', rel:35 }, rewardText:'培元丹 × 2 + 好感度',
    targetItem:'item_herb_gancao', targetName:'甘草', targetCount:3,
  },
  // ── 剑客/武侠(swordsman/hero/martial) ──
  quest_swordsman_duel_honor: {
    id:'quest_swordsman_duel_honor', name:'江湖约战',
    icon:'⚔', type:'combat', minRel: 30,
    desc:'这位剑客已多年未遇值得一战的对手，听闻你的名号，特来下战书。他说：若你能撑过三十招，他将传你一式绝学。输赢都是朋友，来！',
    reward:{ silver:0, exp:80, rel:40 }, rewardText:'武学传授 + 大量经验',
  },
  quest_swordsman_settle_grudge: {
    id:'quest_swordsman_settle_grudge', name:'恩仇未了',
    icon:'🗡', type:'travel', minRel: 40,
    desc:'这位剑客有一桩多年悬案：当年仇家借刀杀人，真正主使却逍遥法外。如今线索浮出水面，他独力难追，请你同往另一城打探，定要水落石出。',
    reward:{ silver:80, exp:60, rel:40 }, rewardText:'80两 + 高额好感度',
    triggerCity: null,
  },
  // ── 守将/统领/将领(guard/commander/general) ──
  quest_guard_spy_hunt: {
    id:'quest_guard_spy_hunt', name:'缉拿奸细',
    icon:'🕵', type:'kill', minRel: 40,
    desc:'军情显示城中潜伏着一名敌方奸细，已将机密情报传递数次。守将需要你以平民身份暗中行动，锁定目标后当场拿下或击毙，不得走脱。',
    reward:{ silver:100, exp:60, rel:40 }, rewardText:'100两银子 + 好感度',
    targetNpcId:'npc_spy_agent', targetName:'潜伏奸细',
  },
  quest_guard_bandit_clear: {
    id:'quest_guard_bandit_clear', name:'清剿山贼',
    icon:'⚔', type:'kill', minRel: 30,
    desc:'城郊山岭近来盗匪猖獗，袭扰百姓，守将抽不出兵力，希望你带头去剿，凡斩获匪首者，官府重赏，另发通行令牌。',
    reward:{ silver:120, exp:70, rel:40 }, rewardText:'120两银子 + 官府令牌',
    targetNpcId:'npc_bandit_chief', targetName:'山贼头目',
  },
  quest_guard_patrol_border: {
    id:'quest_guard_patrol_border', name:'边境巡察',
    icon:'🛡', type:'travel', minRel: 20,
    desc:'近来边境附近出现不明武装人员踪迹，守将需你乔装成过路客，沿边境要道巡查一圈，记录可疑动向后回营汇报。',
    reward:{ silver:70, exp:45, rel:30 }, rewardText:'70两银子 + 好感度',
    triggerCity: null,
  },
  // ── 镖师/护卫(escort/bounty) ──
  quest_escort_rescue: {
    id:'quest_escort_rescue', name:'劫镖案',
    icon:'📦', type:'kill', minRel: 35,
    desc:'镖局一批货物遭人劫持，押镖兄弟被打伤，人质困在山中。镖头悬赏请你出手解救——追上劫匪，杀一条血路，把人和货都带回来。',
    reward:{ silver:130, exp:80, rel:40 }, rewardText:'130两银子 + 镖局好感度',
    targetNpcId:'npc_bandit_chief', targetName:'劫镖头目',
  },
  quest_escort_reconnaissance: {
    id:'quest_escort_reconnaissance', name:'事前踩点',
    icon:'🗺', type:'travel', minRel: 15,
    desc:'镖局有批重要货物明日要走北路，据说近来有强贼在那一带打劫。镖头请你提前走一趟踩踩路，记下险要地段，回来好做部署。',
    reward:{ silver:50, exp:30, rel:25 }, rewardText:'50两银子',
    triggerCity: null,
  },
  // ── 船夫/渡口(boatman/ferryman) ──
  quest_ferryman_find_cargo: {
    id:'quest_ferryman_find_cargo', name:'水底的宝货',
    icon:'⚓', type:'travel', minRel: 20,
    desc:'船夫上次渡河时货船翻覆，沉了一批贵重货物在河底浅处，自己不敢下水。请你代为下水打捞，捞回的货物可分你三成。',
    reward:{ silver:60, exp:35, rel:30 }, rewardText:'货物三成 + 好感度',
    triggerCity: null,
  },
  quest_ferryman_river_patrol: {
    id:'quest_ferryman_river_patrol', name:'清剿水贼',
    icon:'⚔', type:'kill', minRel: 30,
    desc:'河道近来出现一帮水贼，专门打劫过往渡船，弄得船夫们人心惶惶。请你沿河扫荡这批水贼，除掉他们的头目。',
    reward:{ silver:80, exp:55, rel:35 }, rewardText:'80两银子 + 免费渡河特权',
    targetNpcId:'npc_river_pirate_boss', targetName:'水贼头目',
  },
  // ── 诗人/书生/文人(poet/scholar) ──
  quest_scholar_collect_poems: {
    id:'quest_scholar_collect_poems', name:'访寻题壁诗',
    icon:'📜', type:'travel', minRel: 15,
    desc:'书生正在整理一部诗集，听闻某处古驿和名楼墙上有江湖游侠题诗，想请你代为抄录一份带回，感谢你的辛苦。',
    reward:{ silver:25, exp:30, rel:35 }, rewardText:'25两 + 武学心得一则',
    triggerCity: null,
  },
  quest_scholar_protect_scroll: {
    id:'quest_scholar_protect_scroll', name:'护送孤本',
    icon:'📚', type:'travel', minRel: 30,
    desc:'书生偶得一册孤本秘籍，要送往某城典藏。怕路上不安全，恳请你随行护送，事成后你可抄录其中一章心法留存。',
    reward:{ silver:30, exp:50, rel:35 }, rewardText:'30两 + 武学心法抄本',
    triggerCity: null,
  },
  // ── 商人掌柜(merchant/boss) 附加 ──
  quest_merchant_stolen_goods: {
    id:'quest_merchant_stolen_goods', name:'追回被盗货物',
    icon:'📦', type:'kill', minRel: 30,
    desc:'商人一批货物被强盗半路劫走，据线报贼人已在城外据点。请你出手追缴，货物完璧归赵，除不了贼也要捎回半数货物。',
    reward:{ silver:100, exp:60, rel:35 }, rewardText:'100两银子 + 好感度',
    targetNpcId:'npc_bandit_chief', targetName:'劫货强盗',
  },
  quest_merchant_price_intel: {
    id:'quest_merchant_price_intel', name:'刺探竞争对手',
    icon:'🕵', type:'travel', minRel: 20,
    desc:'商场如战场，掌柜怀疑对面商行在压价抢生意，想弄清楚他们的进货渠道。请你去那边城镇打听打听，消息值钱，必有厚报。',
    reward:{ silver:55, exp:30, rel:25 }, rewardText:'55两银子',
    triggerCity: null,
  },
  // ── 乞丐/叫花(beggar) 附加 ──
  quest_beggar_secret_passage: {
    id:'quest_beggar_secret_passage', name:'地下暗道的秘密',
    icon:'🕳', type:'travel', minRel: 25,
    desc:'老叫花在城里乞讨多年，意外发现一条通往城外的古老暗道，里面似乎藏着什么。他腿脚不便，希望你前去探个究竟，有什么发现来告诉他。',
    reward:{ silver:0, exp:40, rel:30 }, rewardText:'江湖情报 + 好感度',
    triggerCity: null,
  },
  // ── 隐士/归隐侠客(hermit) 附加 ──
  quest_hermit_seek_material: {
    id:'quest_hermit_seek_material', name:'寻访天材炼药',
    icon:'🌿', type:'fetch', minRel: 40,
    desc:'老隐士正在为自己炼制最后一炉延寿丹，缺少几样奇材，深山秘境方有此物，但他已不宜远行。请你代为采集，事成后传你一套心法。',
    reward:{ silver:0, exp:80, rel:45, manual:'m_cm_complete1' }, rewardText:'天下武学总纲完本 + 好感度',
    targetItem:'item_spirit_stone', targetName:'灵蕴石', targetCount:2,
  },
  quest_hermit_old_friend: {
    id:'quest_hermit_old_friend', name:'故人消息',
    icon:'🕊', type:'travel', minRel: 25,
    desc:'老隐士有个多年未见的故交，听说在某处落脚。他想知道老友是否安在，请你代为打探一下，带回消息即可，好坏都告诉他。',
    reward:{ silver:30, exp:30, rel:35 }, rewardText:'30两 + 好感度',
    triggerCity: null,
  },

  // ── 茶馆/饮食(tea/hotpot/food) ──
  quest_teahouse_gossip: {
    id:'quest_teahouse_gossip', name:'茶客的委托',
    icon:'🍵', type:'travel', minRel: 10,
    desc:'茶馆里常聚着各路江湖人，茶老板无意间听到一个茶客谈起某件奇事，怀疑其中有隐情。请你去他说的那个方向打探一番，回来告诉茶老板。',
    reward:{ silver:20, exp:25, rel:20 }, rewardText:'20两 + 江湖情报',
    triggerCity: null,
  },
  // ── 老兵/退役将士(veteran) ──
  quest_veteran_war_relic: {
    id:'quest_veteran_war_relic', name:'战场旧物',
    icon:'🪖', type:'travel', minRel: 25,
    desc:'老兵当年在某地大战中遗落了一把刻有战功的腰刀，战后回去找已物是人非。他想在有生之年把那刀找回来，请你代他走一趟寻访。',
    reward:{ silver:40, exp:40, rel:40 }, rewardText:'40两 + 好感度',
    triggerCity: null,
  },
  quest_veteran_teach_move: {
    id:'quest_veteran_teach_move', name:'传授军中杀法',
    icon:'⚔', type:'combat', minRel: 40,
    desc:'老兵当年征战百场，身怀数十招实战杀法，如今愿传授有缘人。你只需和他过上几招，让他见识你的实力，他便倾囊相授。',
    reward:{ silver:0, exp:75, rel:35 }, rewardText:'军中秘术传授 + 大量经验',
  },
  // ── 向导/猎人/农夫(guide/farmer/hunter) ──
  quest_guide_mountain_path: {
    id:'quest_guide_mountain_path', name:'开辟新路',
    icon:'🗺', type:'travel', minRel: 20,
    desc:'向导要为商队勘察一条捷径翻山，但山中最近有巨熊出没，一个人不敢进去。请你同行护卫，路途虽险，事成后传你山地穿行心得。',
    reward:{ silver:50, exp:45, rel:30 }, rewardText:'50两 + 探路心得',
    triggerCity: null,
  },
  // ══════════════════════════════════════════════════
  //  五、趣味诙谐任务链
  // ══════════════════════════════════════════════════

  // ─── 趣味链 F：掌柜的相亲噩梦 ───
  // 发布者：客栈掌柜 / 茶馆掌柜
  // 前置：无（直接可接，minRel: 20）
  quest_matchmaking_trouble: {
    id:'quest_matchmaking_trouble', name:'掌柜要相亲',
    icon:'💌', type:'travel', minRel: 20,
    desc:'掌柜今天一脸愁苦，悄悄把你拉到一边："兄弟，我娘给我定了门亲事，对方据说是邻镇一个有钱员外的闺女……但我听说那位小姐脾气大得很，你帮我去打探打探虚实？"',
    reward:{ silver:15, exp:20, rel:20 }, rewardText:'15两 + 好感度',
    nextQuest:'chain_matchmaking_f1',
    triggerCity: null,
  },
  chain_matchmaking_f1: {
    id:'chain_matchmaking_f1', name:'员外家的奇葩要求',
    icon:'😅', type:'talk',
    chain:'chain_matchmaking', chainStep:1,
    prevQuest:'quest_matchmaking_trouble',
    nextQuest:'chain_matchmaking_f2',
    desc:'【连环·一】你打探回来，员外提了三个相亲条件：一、要能喝下三坛烈酒不倒；二、要会背百首诗；三、身高不得低于六尺。掌柜听完脸都绿了……但他娘说：小事，你都能办到！\n\n掌柜求你帮他去找个会背诗的书生突击培训，赶在相亲前把一百首诗装进脑子里。',
    reward:{ silver:0, exp:30, rel:20 }, rewardText:'经验 + 好感',
    triggerCity: null,
  },
  chain_matchmaking_f2: {
    id:'chain_matchmaking_f2', name:'相亲现场翻车',
    icon:'🤦', type:'combat',
    chain:'chain_matchmaking', chainStep:2,
    prevQuest:'chain_matchmaking_f1',
    nextQuest:'chain_matchmaking_f3',
    desc:'【连环·二】相亲当天，员外家摆了满桌子菜，气氛正好——然后另一个求亲的壮汉踢门而入，扬言"谁要娶我心上人就揍谁"！\n\n掌柜瞪着你："你是保镖，你上！"',
    reward:{ silver:50, exp:50, rel:30 }, rewardText:'50两 + 经验',
    targetName:'砸场子的壮汉',
    targetCityId: null,
  },
  chain_matchmaking_f3: {
    id:'chain_matchmaking_f3', name:'皆大欢喜（大概）',
    icon:'🎊', type:'talk',
    chain:'chain_matchmaking', chainStep:3,
    prevQuest:'chain_matchmaking_f2',
    desc:'【连环·三·终】壮汉被你打跑，员外拍案叫绝，当场拍板同意这门亲事。\n掌柜的娘乐开了花，掌柜本人却面如死灰——"她说了，嫁过来第一件事就是把酒馆改成绣庄……"\n他还是塞给你一包银子："谢谢……我想我需要独处一会儿。"',
    reward:{ silver:80, exp:80, rel:50 }, rewardText:'80两巨赏 + 大量好感（掌柜欠你一个人情）',
  },

  // ─── 趣味链 G：武林第一吃货大赛 ───
  // 发布者：食肆老板 / 茶馆掌柜
  // 前置：无（minRel: 15）
  quest_foodie_contest_intro: {
    id:'quest_foodie_contest_intro', name:'江湖吃货争霸赛',
    icon:'🍖', type:'travel', minRel: 15,
    desc:'食肆老板兴奋地拉着你："本城下个月要办"武林第一吃货大赛"！入围要先提交一道招牌菜，评委是本地有名的大胃王！\n老板想参赛扬名，但比赛规定参赛者必须亲自出赛——他自己太胖，走几步就喘……他想让你"冒名顶替"，替他去打听一下赛制和报名条件。"',
    reward:{ silver:10, exp:15, rel:15 }, rewardText:'10两 + 好感度',
    nextQuest:'chain_foodie_g1',
    triggerCity: null,
  },
  chain_foodie_g1: {
    id:'chain_foodie_g1', name:'打探大胃王的底细',
    icon:'🕵', type:'travel',
    chain:'chain_foodie', chainStep:1,
    prevQuest:'quest_foodie_contest_intro',
    nextQuest:'chain_foodie_g2',
    desc:'【连环·一】你打听回来：现任卫冕冠军外号"铁胃罗汉"，据说一顿能吃三头猪，且有神秘"排毒功"使胃永远空着。他来自某处寺庙，练功心法说不定能打听到。\n老板："那你赶紧去查！我要先他一步找到破解之法！"',
    reward:{ silver:20, exp:30, rel:20 }, rewardText:'20两 + 经验',
    triggerCity: null,
  },
  chain_foodie_g2: {
    id:'chain_foodie_g2', name:'大赛当日奇遇',
    icon:'🏆', type:'combat',
    chain:'chain_foodie', chainStep:2,
    prevQuest:'chain_foodie_g1',
    nextQuest:'chain_foodie_g3',
    desc:'【连环·二】比赛当天，老板突然发现"铁胃罗汉"居然私下在食物里掺了催吐药，想让对手中招。\n老板怒了："这不是武德！你去揭穿他、打他一顿，为吃货界争口气！"',
    reward:{ silver:60, exp:60, rel:30 }, rewardText:'60两 + 经验',
    targetName:'铁胃罗汉',
    targetCityId: null,
  },
  chain_foodie_g3: {
    id:'chain_foodie_g3', name:'新任武林吃货盟主',
    icon:'🎖', type:'talk',
    chain:'chain_foodie', chainStep:3,
    prevQuest:'chain_foodie_g2',
    desc:'【连环·三·终】铁胃罗汉被打倒，作弊行为被揭发，当场取消资格。老板以"精神冠军"之名领走奖杯，泪流满面地把奖金全塞给你：\n"你就是我的英雄！今后在我这里，你吃饭，永远免单！"\n\n……好吧，实际上他只给了你永久八折优惠，但他说这话时眼神是真诚的。',
    reward:{ silver:100, exp:100, rel:60 }, rewardText:'100两 + 永久好感（此NPC永久八折）',
  },

  // ─── 趣味链 H：诗人的奇葩甲方 ───
  // 发布者：文人书生
  // 前置：无（minRel: 15）
  quest_poet_odd_client: {
    id:'quest_poet_odd_client', name:'甲方大人降临',
    icon:'📝', type:'travel', minRel: 15,
    desc:'书生一脸菜色地告诉你："我接了个大单，给某个土豪员外写一首祝寿诗，润笔费极丰厚。但这位员外要求颇多：诗里必须有他的名字、他的马、他的胖猫，还要押韵、要大气、要感人……同时不能超过二十个字。"\n"我已经愁秃了半边头，你帮我去打探一下那员外最近心情，看看能不能通融通融。"',
    reward:{ silver:12, exp:15, rel:15 }, rewardText:'12两 + 好感度',
    nextQuest:'chain_poet_h1',
    triggerCity: null,
  },
  chain_poet_h1: {
    id:'chain_poet_h1', name:'员外追加要求',
    icon:'😤', type:'talk',
    chain:'chain_poet', chainStep:1,
    prevQuest:'quest_poet_odd_client',
    nextQuest:'chain_poet_h2',
    desc:'【连环·一】你去员外家打探，不巧碰上员外正在发火——上一个给他写诗的先生，居然把他的名字写错了一个字！\n员外火冒三丈，当即追加要求：诗里还要有他新买的金鱼，另外必须用"龙"字开头，因为他觉得自己命格贵重。\n书生听完差点昏过去，哭着求你想个办法拖延交稿时间。',
    reward:{ silver:15, exp:25, rel:20 }, rewardText:'15两 + 经验',
    triggerCity: null,
  },
  chain_poet_h2: {
    id:'chain_poet_h2', name:'诗稿被人抢了',
    icon:'😱', type:'kill',
    chain:'chain_poet', chainStep:2,
    prevQuest:'chain_poet_h1',
    nextQuest:'chain_poet_h3',
    desc:'【连环·二】书生历尽千辛写完了诗，刚誊好，却被一个竞争对手书生雇了泼皮来抢稿！\n"我辛苦七天七夜的心血啊！！"书生手指颤抖，"你去追回来，我求你了！"',
    reward:{ silver:40, exp:40, rel:25 }, rewardText:'40两 + 经验',
    targetName:'抢稿泼皮',
    targetCityId: null,
  },
  chain_poet_h3: {
    id:'chain_poet_h3', name:'员外拍案叫绝',
    icon:'🎉', type:'talk',
    chain:'chain_poet', chainStep:3,
    prevQuest:'chain_poet_h2',
    desc:'【连环·三·终】稿子追回来了，书生战战兢兢把诗献给员外。\n员外看了足足一炷香时间，然后猛地一拍桌子——\n"妙！绝妙！龙字开头，猫马鱼全有，还押韵，还感人！此人真乃当世第一才子！"\n书生如释重负地瘫在椅子上，把润笔费的三成塞给你："你……你就是我的福星。"',
    reward:{ silver:70, exp:90, rel:55 }, rewardText:'70两润笔分成 + 大量好感',
  },

  // ══════════════════════════════════════════════════
  //  六、八卦系统：可重复「打听八卦」+ 各色八卦情报
  // ══════════════════════════════════════════════════

  // ── 通用每日八卦（所有NPC可分配，可重复）──
  quest_daily_gossip_general: {
    id:'quest_daily_gossip_general', name:'【日常】打听江湖八卦',
    icon:'👂', type:'travel', minRel: 5,
    desc:'【可重复】江湖消息满天飞，你凑上去和这位闲聊，请他说说最近城里城外有什么稀奇事。帮他跑趟小差，他就把听来的八卦统统告诉你。',
    reward:{ silver:8, exp:10, rel:3 }, rewardText:'8两 + 江湖八卦一则',
    repeatable: true, cooldownDays: 2,
    repeatReward:{ silver:8, exp:10, rel:3 }, triggerCity: null,
  },

  // ── 酒馆八卦（tavern/inn NPC）──
  quest_gossip_tavern_fight: {
    id:'quest_gossip_tavern_fight', name:'打架是怎么引起的',
    icon:'🍷', type:'travel', minRel: 10,
    desc:'三天前酒馆里发生了一场大乱斗，桌椅打碎了七张，据说起因是有人在另一人的酒里偷偷加了催笑散……事情蔓延出去，现在全城人都想知道那人是谁。掌柜托你出去打探打探，回来讲给他听解解闷。',
    reward:{ silver:12, exp:18, rel:15 }, rewardText:'12两 + 掌柜爆料一则',
    repeatable: true, cooldownDays: 5,
    triggerCity: null,
  },
  quest_gossip_secret_admirer: {
    id:'quest_gossip_secret_admirer', name:'暗恋信的主人是谁',
    icon:'💘', type:'travel', minRel: 15,
    desc:'掌柜捡到一封落款是"痴心人"的情书，信里写着要约"城东杨柳树下的姑娘"……偏偏他店里有三个姑娘都在城东住过。掌柜好奇心大发，托你去暗中打探，究竟是哪位佳人的仰慕者。',
    reward:{ silver:10, exp:15, rel:18 }, rewardText:'10两 + 情报 + 好感',
    triggerCity: null,
  },

  // ── 郎中八卦（doctor NPC）──
  quest_gossip_fake_patient: {
    id:'quest_gossip_fake_patient', name:'装病的富贵人家',
    icon:'🤒', type:'travel', minRel: 10,
    desc:'城中某位员外三天两头找郎中"看病"，每次都说自己奄奄一息，但郎中发现他脉象强健得很——这位员外到底在图什么？郎中觉得里面有奇事，托你去暗中调查一番。',
    reward:{ silver:20, exp:20, rel:20 }, rewardText:'20两 + 奇闻一则',
    repeatable: true, cooldownDays: 7,
    triggerCity: null,
  },

  // ── 铁匠八卦（smith NPC）──
  quest_gossip_mystery_weapon: {
    id:'quest_gossip_mystery_weapon', name:'不明来历的兵器',
    icon:'🗡', type:'travel', minRel: 10,
    desc:'有人带了把来历不明的古刀来铁匠铺修缮，修完就走了，留下一个奇怪的记号。铁匠越看越觉得这刀不寻常，托你去那人出没的方向打探一下来历。',
    reward:{ silver:15, exp:20, rel:18 }, rewardText:'15两 + 武器来历情报',
    triggerCity: null,
  },

  // ── 茶馆八卦（tea/teahouse NPC）──
  quest_gossip_tea_scandal: {
    id:'quest_gossip_tea_scandal', name:'茶馆奇闻录',
    icon:'🍵', type:'travel', minRel: 5,
    desc:'茶馆是天下第一消息集散地，今日有茶客言之凿凿说，最近某处江湖门派内部出了大丑事——掌门弟子们为争一张椅子，在大殿里大打出手。掌柜让你去核实这则八卦，若属实，他要写成话本。',
    reward:{ silver:10, exp:15, rel:12 }, rewardText:'10两 + 话本一册（珍藏版八卦）',
    repeatable: true, cooldownDays: 4,
    triggerCity: null,
  },
  quest_gossip_hidden_wealth: {
    id:'quest_gossip_hidden_wealth', name:'城里藏了个富翁',
    icon:'💰', type:'travel', minRel: 15,
    desc:'茶客传言：城里有个穿破烂、天天蹲墙根的老头，实际上是个坐拥万贯的隐形富翁，只是极其吝啬，从不露财。掌柜将信将疑，让你去查证此事。若是真的，这则八卦能卖个好价钱。',
    reward:{ silver:18, exp:20, rel:20 }, rewardText:'18两 + 八卦情报',
    triggerCity: null,
  },

  // ── 书生文人八卦（scholar/poet NPC）──
  quest_gossip_plagiarism: {
    id:'quest_gossip_plagiarism', name:'武林抄袭第一案',
    icon:'📖', type:'travel', minRel: 10,
    desc:'书生气愤地告诉你：城里某位"才子"新出了一本诗集，轰动一时——但他发现其中有三首简直和三年前某位无名诗人的作品一模一样！他要你帮忙去证实，找到那位原作者，给"才子"一个大难堪。',
    reward:{ silver:15, exp:25, rel:20 }, rewardText:'15两 + 文坛情报',
    triggerCity: null,
  },

  // ── 乞丐叫花八卦（beggar NPC）──
  quest_gossip_beggar_network: {
    id:'quest_gossip_beggar_network', name:'叫花帮情报网',
    icon:'👁', type:'travel', minRel: 10,
    desc:'叫花说："我们这行，走遍城里城外，没有我们不知道的事。最近我发现了个大秘密——城里某条街的地下，似乎有人在挖什么。你帮我去那几条街的外围打探打探，我们来分析分析。"',
    reward:{ silver:8, exp:20, rel:18 }, rewardText:'8两 + 秘密情报',
    repeatable: true, cooldownDays: 5,
    triggerCity: null,
  },

  // ── 通用猎奇八卦（向导/老兵/隐士等）──
  quest_gossip_weird_duel: {
    id:'quest_gossip_weird_duel', name:'史上最离奇的比武',
    icon:'⚔', type:'travel', minRel: 10,
    desc:'据说附近曾发生过一场奇特的比武：两个高手约架，结果两人打了整整一天，不分胜负——因为他们约定输了的要请赢家吃饭，可两人都怕花钱，于是死活不肯认输。你去帮忙打探这个故事的后续，带回来当晚上的谈资。',
    reward:{ silver:10, exp:18, rel:15 }, rewardText:'10两 + 奇闻一则',
    repeatable: true, cooldownDays: 6,
    triggerCity: null,
  },
  quest_gossip_haunted_inn: {
    id:'quest_gossip_haunted_inn', name:'闹鬼客栈的真相',
    icon:'👻', type:'travel', minRel: 20,
    desc:'城郊有家客栈据说最近连续三天夜里有人听见奇怪声响，住客吓得纷纷退房。掌柜生意大跌，愁眉苦脸——有人说闹鬼，有人说是有贼，也有人说根本是掌柜在炒作。你去查查真相，顺带解除他的烦恼。',
    reward:{ silver:25, exp:30, rel:22 }, rewardText:'25两 + 情报',
    triggerCity: null,
  },
  quest_gossip_noodle_rivalry: {
    id:'quest_gossip_noodle_rivalry', name:'面馆大战',
    icon:'🍜', type:'travel', minRel: 5,
    desc:'城里两家面馆掐架已经半年，互相在门口贴大字报骂对方的面不正宗，还雇人去对方店里找茬。今天终于要约定"以面论英雄"——找来十位食客盲测，输了的要永远关门。你去凑热闹，顺带带些情报回来，绝对有趣。',
    reward:{ silver:5, exp:12, rel:10 }, rewardText:'5两 + 好吃的面条一碗（+饱食度）',
    repeatable: true, cooldownDays: 7,
    triggerCity: null,
  },

  // ══════════════════════════════════════════════════
  //  九、护送任务 (type: 'escort')
  //  完成条件：成功完成一次押镖小游戏（指定路线或任意路线）
  // ══════════════════════════════════════════════════

  // ── 镖局系 ──
  quest_escort_debut: {
    id:'quest_escort_debut', name:'初出茅庐押头镖',
    icon:'🛡', type:'escort',
    minRel: 0, minLevel: 1,
    desc:'镖局掌柜见你身手不凡，想让你试试押镖的差事。不拘路线，完成一趟押镖平安送达即可，算是入行考验。',
    reward:{ silver:30, exp:40, rel:25 }, rewardText:'30两 + 经验 + 好感度',
    targetCount: 1,          // 需要成功押镖次数
    targetRoute: null,       // null = 任意路线均可
  },
  quest_escort_plains: {
    id:'quest_escort_plains', name:'平原急送',
    icon:'📦', type:'escort',
    minRel: 10, minLevel: 5,
    desc:'有批紧急货物要走平原官道，前路不太平，掌柜点名请你护送。需走一条平原路线，安全送达方算完成。',
    reward:{ silver:60, exp:50, rel:20 }, rewardText:'60两 + 经验',
    targetCount: 1,
    targetTerrain: '平原',   // 需要平原地形路线
  },
  quest_escort_mountain: {
    id:'quest_escort_mountain', name:'山路险镖',
    icon:'⛰', type:'escort',
    minRel: 20, minLevel: 15,
    desc:'一批机密货物要穿越山地送往远城，路途险峻，寻常镖师不敢接。你若愿意走这趟山路押镖，报酬翻倍。',
    reward:{ silver:120, exp:80, rel:30 }, rewardText:'120两 + 丰厚经验',
    targetCount: 1,
    targetTerrain: '山地',
    repeatable: true, cooldownDays: 5,
  },
  quest_escort_veteran: {
    id:'quest_escort_veteran', name:'百战老镖师的考验',
    icon:'🏅', type:'escort',
    minRel: 40, minLevel: 20,
    desc:'老镖师行走江湖三十年，想找个接班人。他要你押满三趟镖不失手，证明实力。完成后传授你一身独门走镖心法。',
    reward:{ silver:200, exp:150, rel:50, manual:'m_cm_frag1' }, rewardText:'200两 + 武学碎片 + 大量好感',
    targetCount: 3,          // 需要连续成功3次
    targetRoute: null,
  },

  // ── 日常镖局任务 ──
  quest_escort_daily: {
    id:'quest_escort_daily', name:'【日常】今日一镖',
    icon:'🛡', type:'escort',
    minRel: 5, minLevel: 3,
    desc:'【可重复】镖局每日均有差事派出，完成任意一趟押镖即可领取日常酬劳。',
    reward:{ silver:45, exp:30, rel:5 }, rewardText:'45两 + 经验',
    repeatable: true, cooldownDays: 2,
    targetCount: 1,
    targetRoute: null,
  },

  // ══════════════════════════════════════════════════
  //  十、钓鱼任务 (type: 'fishing')
  //  完成条件：钓到指定鱼种 × 指定数量（自动检测背包/钓鱼记录）
  // ══════════════════════════════════════════════════

  // ── 郎中系 ──
  quest_fishing_medicine: {
    id:'quest_fishing_medicine', name:'郎中需要鱼',
    icon:'🎣', type:'fishing',
    minRel: 10, minLevel: 1,
    desc:'郎中配药需要新鲜鲤鱼作为引子，城外河里便有，但他自己不会钓鱼。帮他钓来3条鲤鱼，他给你配一剂补药。',
    reward:{ silver:20, exp:25, rel:20 }, rewardText:'20两 + 好感度',
    targetFish: 'carp',      // 目标鱼种ID（null=任意鱼）
    targetFishName: '鲤鱼',
    targetCount: 3,
  },
  quest_fishing_mandarin: {
    id:'quest_fishing_mandarin', name:'鳜鱼宴',
    icon:'🍽', type:'fishing',
    minRel: 20, minLevel: 8,
    desc:'酒馆掌柜想做一道招牌鳜鱼宴，苦于没有新鲜食材。帮他钓来2条鳜鱼，他请你免费大吃一顿，还给一笔辛苦钱。',
    reward:{ silver:40, exp:35, rel:25 }, rewardText:'40两 + 免费鳜鱼宴',
    targetFish: 'mandarin',
    targetFishName: '鳜鱼',
    targetCount: 2,
  },
  quest_fishing_golden: {
    id:'quest_fishing_golden', name:'传说中的金鲤',
    icon:'🌟', type:'fishing',
    minRel: 30, minLevel: 15,
    desc:'老渔翁垂钓一生，唯独未曾见过金鲤。他说金鲤是吉兆，只要钓到一条带来给他看看，他愿传授你独门钓技。',
    reward:{ silver:80, exp:60, rel:40 }, rewardText:'80两 + 钓鱼秘法',
    targetFish: 'golden_carp',
    targetFishName: '金鲤',
    targetCount: 1,
  },

  // ── 通用/日常 ──
  quest_fishing_daily: {
    id:'quest_fishing_daily', name:'【日常】今日渔获',
    icon:'🎣', type:'fishing',
    minRel: 0, minLevel: 1,
    desc:'【可重复】酒馆今天缺鱼，帮他们钓5条鱼（任何种类皆可），按条数给酬劳。',
    reward:{ silver:30, exp:20, rel:4 }, rewardText:'30两 + 经验',
    repeatable: true, cooldownDays: 1,
    targetFish: null,        // 任意鱼
    targetFishName: '鱼',
    targetCount: 5,
  },
  quest_fishing_big: {
    id:'quest_fishing_big', name:'大鱼猎手',
    icon:'🦈', type:'fishing',
    minRel: 15, minLevel: 10,
    desc:'码头有人打赌，说本地无人能钓到鲟鱼。你若钓到一条，赌注全归你，还能在渔夫圈里扬名立万。',
    reward:{ silver:70, exp:50, rel:30, fame:5 }, rewardText:'70两 + 声望',
    targetFish: 'sturgeon',
    targetFishName: '鲟鱼',
    targetCount: 1,
  },

  // ══════════════════════════════════════════════════
  //  十一、斗蛐蛐任务 (type: 'cricket')
  //  完成条件：斗蛐蛐胜场数 ≥ targetWins（可跨局累计）
  // ══════════════════════════════════════════════════

  // ── 赌坊系 ──
  quest_cricket_debut: {
    id:'quest_cricket_debut', name:'初入蛐蛐场',
    icon:'🦗', type:'cricket',
    minRel: 0, minLevel: 1,
    desc:'赌坊老板说，新手想在这儿混，先赢三场蛐蛐比赛再说。赢满三场，有好处。',
    reward:{ silver:25, exp:30, rel:20 }, rewardText:'25两 + 入场资格',
    targetWins: 3,
  },
  quest_cricket_streak: {
    id:'quest_cricket_streak', name:'蛐蛐连赢五场',
    icon:'🏆', type:'cricket',
    minRel: 10, minLevel: 3,
    desc:'坊主要见识真正高手，出题考验：连赢五场蛐蛐比赛（总胜场累计即可），证明你的虫子不是花架子。',
    reward:{ silver:60, exp:50, rel:30 }, rewardText:'60两 + 赌坊声誉',
    targetWins: 5,
  },
  quest_cricket_champion: {
    id:'quest_cricket_champion', name:'蛐蛐擂台夺冠',
    icon:'👑', type:'cricket',
    minRel: 25, minLevel: 5,
    desc:'一年一度的蛐蛐擂台赛即将开幕，坊主押注你夺冠。赢满十场，你和坊主二八分账，另有冠军头衔。',
    reward:{ silver:150, exp:100, rel:50, fame:10 }, rewardText:'150两 + 声望 + 蛐蛐冠军头衔',
    targetWins: 10,
  },
  quest_cricket_daily: {
    id:'quest_cricket_daily', name:'【日常】今日斗虫',
    icon:'🦗', type:'cricket',
    minRel: 0, minLevel: 1,
    desc:'【可重复】赌坊今日有斗蛐蛐活动，赢两场就有日常酬劳拿。',
    reward:{ silver:35, exp:20, rel:4 }, rewardText:'35两 + 经验',
    repeatable: true, cooldownDays: 1,
    targetWins: 2,
  },
  quest_cricket_master: {
    id:'quest_cricket_master', name:'虫王之路',
    icon:'🐲', type:'cricket',
    minRel: 40, minLevel: 8,
    desc:'江湖中有位"虫王"隐居于此，声称三十年从未在蛐蛐场落败。他愿意传你养虫绝技——前提是你先赢满二十场，证明有这个资格。',
    reward:{ silver:300, exp:200, rel:60, manual:'m_uc_frag1' }, rewardText:'300两 + 武学残卷 + 虫王传承',
    targetWins: 20,
  },

};

// ════════════════════════════════════════════════════
//  动态阵营任务模板库
//  根据 NPC 阵营 + 玩家关系 动态生成任务，不写死在 NPC.quests 中
//  任务 ID 格式：aq_{npcId}_{templateKey}
//  type: 'kill' | 'fetch' | 'protect' | 'travel'
// ════════════════════════════════════════════════════
const ALIGNMENT_QUEST_TEMPLATES = {

  // ── 仇敌委托：击杀自己的对头 ──
  kill_rival_npc: {
    type:    'kill',
    minRel:   30,        // 至少友好以上才委托（对立派系帮手）
    targetAlign: 'enemy', // 目标的阵营与发布方是死敌关系
    icon:    '⚔',
    nameTemplate:   (issuer, target) => `除掉${target.name}`,
    descTemplate:   (issuer, target) => `${issuer.name}托付道："${target.name}此人是我等心头大患，你若能将其除去，我必有重谢。"`,
    rewardSilver:   (targetTier) => ({ func:40, major:100, elite:250 }[targetTier] || 60),
    rewardExp:      (targetTier) => ({ func:30, major:80,  elite:200 }[targetTier] || 50),
    rewardRel:      35,
    rewardText:     (targetTier) => `银两奖励 + 好感度`,
  },

  // ── 邪道/混乱 NPC 的试探性脏活：先混熟，再发这种任务 ──
  // 设计要求：初始好感度时不能直接出现“去杀谁”的任务，因此至少要到“相识”后才会触发
  harass_npc: {
    type:    'kill',
    minRel:   20,        // 至少相识后才可接，避免初见就发杀人委托
    maxRel:   39,        // 太熟以后会转入更正式的委托，而不是这种试探性脏活
    issuerAlign: ['evil','chaotic'],  // 只有邪道/混乱才发
    targetAlign: 'ally', // 目标是发布方的盟友阵营相对面（找正道NPC麻烦）
    icon:    '🗡',
    nameTemplate:   (issuer, target) => `给${issuer.name}立功`,
    descTemplate:   (issuer, target) => `${issuer.name}斜眼看你："既然你不是${target.name}那路人，不如替我去给他们添点麻烦，干成了你在我这里自然好说话。"`,
    rewardSilver:   (targetTier) => ({ func:30, major:80, elite:180 }[targetTier] || 50),
    rewardExp:      (targetTier) => ({ func:25, major:60, elite:150 }[targetTier] || 40),
    rewardRel:      25,
    rewardText:     (targetTier) => `银两奖励 + 好感度`,
  },

  // ── 友好 NPC 委托：消灭来骚扰的邪道 NPC ──
  protect_ally: {
    type:    'kill',
    minRel:  20,
    issuerAlign: ['righteous','neutral'],
    targetAlign: 'threat', // 目标是对发布方有威胁的阵营（邪道/混乱）
    icon:    '🛡',
    nameTemplate:   (issuer, target) => `驱逐${target.name}`,
    descTemplate:   (issuer, target) => `${issuer.name}面露忧色："${target.name}在附近横行，我等深受其扰，若侠士能替我们解决此患，感激不尽。"`,
    rewardSilver:   (targetTier) => ({ func:35, major:90, elite:220 }[targetTier] || 55),
    rewardExp:      (targetTier) => ({ func:30, major:70, elite:180 }[targetTier] || 45),
    rewardRel:      30,
    rewardText:     (targetTier) => `银两奖励 + 好感度`,
  },

  // ── 声誉任务：证明实力（对玩家等级有要求）──
  prove_strength: {
    type:    'kill',
    minRel:   20,
    issuerAlign: ['righteous','neutral','chaotic','evil'], // 所有阵营都可能发
    targetAlign: 'any_hostile',  // 任意敌对 NPC
    icon:    '🏆',
    nameTemplate:   (issuer, target) => `江湖考验`,
    descTemplate:   (issuer, target) => `${issuer.name}审视你片刻："你说你是走江湖的，江湖中人要凭本事说话。去会一会${target.name}，拿到证明再来。"`,
    rewardSilver:   (targetTier) => ({ func:25, major:70, elite:160 }[targetTier] || 45),
    rewardExp:      (targetTier) => ({ func:40, major:100, elite:250 }[targetTier] || 60),
    rewardRel:      20,
    rewardText:     (targetTier) => `经验 + 好感度`,
  },
};

// 阵营 → 死敌阵营映射（用于找 kill 任务的目标 NPC）
const ALIGN_ENEMY_MAP = {
  righteous: ['evil','chaotic'],
  neutral:   ['evil'],
  chaotic:   ['righteous'],
  evil:      ['righteous','neutral'],
};

// ── 情报数据库 ──
const INTEL_DB = {
  intel_mingjiao_rise: { id:'intel_mingjiao_rise', type:'event', label:'江湖动态',
    text:'日月神教近日大动干戈，听说其教主修炼成了失传绝学，武林各派人心惶惶，纷纷闭关备战。' },
  intel_road_bandit: { id:'intel_road_bandit', type:'tip', label:'路况情报',
    text:'近日往东的官道不太平，有山贼出没，建议绕道南路，虽远些，却安全得多。' },
  intel_kunlun_sword: { id:'intel_kunlun_sword', type:'secret', label:'秘闻',
    text:'昆仑山顶有一把千年寒铁铸成的神剑，据传能以一击破万法。但昆仑派守护甚严，外人难以窥见。' },
  intel_local_gossip: { id:'intel_local_gossip', type:'rumor', label:'街头八卦',
    text:'城西王员外最近深夜频繁出行，有人见过他与一黑衣人密谈，那黑衣人腰间配刀，明显是道上的人。' },
  intel_treasure_cave: { id:'intel_treasure_cave', type:'tip', label:'宝藏线索',
    text:'往东三十里的山洞里，据说有前朝侠客留下的宝藏。老叟年迈去不了，就告诉你了，好好找找！' },
  intel_tianshu: { id:'intel_tianshu', type:'secret', label:'绝密情报',
    text:'坊间传言天书残卷现世，各大门派暗中争抢。据说残卷共分三册，分散在三大圣地，谁得全册便能领悟无上神功。' },
  intel_poison_cult: { id:'intel_poison_cult', type:'event', label:'江湖动态',
    text:'五毒教最近下山活动频繁，多处出现中毒事件，不知是否有什么大计划。武林各派已收到预警，提高戒备。' },
  intel_cultivation_tip: { id:'intel_cultivation_tip', type:'tip', label:'修炼心得',
    text:'据老侠所言，内力修炼最忌急躁。每日卯时打坐一柱香，持之以恒，三年可得大成。快刀捷径皆是歪门邪道。' },
  intel_trade_route: { id:'intel_trade_route', type:'event', label:'商道情报',
    text:'北方战事吃紧，丝绸、茶叶价格暴涨。若有余钱，可囤积南方物资，待战事平息时高价出售。' },
  intel_sect_secret: { id:'intel_sect_secret', type:'secret', label:'门派内情',
    text:'本派内部有传言，数十年前有叛徒带走了半部武学秘笈，至今下落不明。掌门悬赏寻找，奖赏丰厚。' },
};

// ══════════════════════════════════════════════════════════
//  各小城镇 / 据点 具名 NPC（逐城补全）
// ══════════════════════════════════════════════════════════

// ── 郑州补充NPC（杂货商人，npc-data-misc.js 未定义）──────
Object.assign(NPC_DB, {
  zhengzhou_shop: { id:'zhengzhou_shop', name:'胡老计', role:'杂货商人', category:'shop', avatar:'🛒',
    city:'zhengzhou', level:6, tier:'func', weapon:'wep_none', armor:'cs_cloth', silver:50,
    greetings:['南来北往的客人都在我这里补给！','杂货齐全，价格公道！'],
    topics:[{ id:'t_zz_shop_news', text:'打听消息', reply:'听说最近开封城里有江湖大事，好几路人马往那儿汇集，好像要争什么宝贝！', relDelta:3, intelId:'intel_mingjiao_rise' }],
    shop:{ items:[{ id:'item_dry_food', icon:'🥮', name:'干粮', desc:'饱食度+30', price:5, effect:{ food:30 } },{ id:'item_water_bag', icon:'🫗', name:'水袋', desc:'口渴度+40', price:4, effect:{ water:40 } },{ id:'item_torch', icon:'🕯', name:'火折子', desc:'常备物品', price:3, effect:{} }] },
    quests:[], intels:['intel_mingjiao_rise'] },
});



// ══════════════════════════════════════════════════════════
//  通用路人 NPC（用于无具名NPC的兜底城市）
//  role 刻意避开 SVC_ROLE_FILTERS 关键词，确保不被服务按钮过滤
// ══════════════════════════════════════════════════════════
Object.assign(NPC_DB, {

  // 通用江湖侠客（城镇闲逛）
  generic_wanderer: {
    id:'generic_wanderer', name:'江湖过客', role:'浪迹侠士', category:'misc', avatar:'🗡️',
    city:'luoyang', level:10, tier:'func',
    weapon:'wep_iron_sword', armor:'cs_cloth', silver:30,
    greetings:{
      hostile:['眼神不对，你是来找事的？走开！','别靠近，否则别怪我不客气。'],
      guarded:['你是何方人士？这里不是随便闲聊的地方。','陌生人，有何贵干？'],
      neutral:['哟，也是走江湖的？此地风土如何，你可曾打听过？','江湖路远，一个人漂泊着实辛苦。'],
      friendly:['老朋友！好久不见，江湖上可有什么新鲜事？','你来了！正好，我这里听说了些消息，你要不要听一听？'],
      close:['兄弟，有什么事直说，别客气！','你我相识已久，有话直说便是。'],
    },
    topics:[
      { id:'t_gw_jianghu', text:'打听江湖消息', reply:'最近各路人马蠢蠢欲动，江湖上暗流涌动，你我须小心些。', relDelta:2 },
      { id:'t_gw_travel', text:'聊聊旅途见闻', reply:'走遍南北，见过的风景多了，心里反而空落落的。你呢，你要去哪儿？', relDelta:3 },
    ],
    quests:[], intels:[],
  },

  // 通用老学究（小镇常见）
  generic_scholar: {
    id:'generic_scholar', name:'落魄文人', role:'游历学士', category:'misc', avatar:'📜',
    city:'luoyang', level:8, tier:'func',
    weapon:'wep_none', armor:'cs_cloth', silver:20,
    greetings:{
      hostile:['竖子！无礼至极！','你这般行事，枉为武林中人！'],
      guarded:['呃……有什么事吗？在下只是一个读书人。','你……你来做什么？'],
      neutral:['唉，世道艰难，连读书人也要行走江湖了。','朋友，此地可有书肆？在下欲购些史籍。'],
      friendly:['哦，你来了？我正好有些心得想与人分享。','好巧！我方才还在想，若有人能讲讲各地典故就好了。'],
      close:['先生！幸好遇见你，我有话与你细谈。','老友，坐下说，咱们慢慢聊。'],
    },
    topics:[
      { id:'t_gs_history', text:'请教当地典故', reply:'此地历史颇为悠久，据传当年有奇人在此留下绝学，可惜如今已无人知晓了。', relDelta:3 },
      { id:'t_gs_tip', text:'询问修炼心得', reply:'修炼之道在于持之以恒，万不可贪多求快。每日打坐静思，方是正道。', relDelta:2 },
    ],
    quests:[], intels:['intel_cultivation_tip'],
  },

  // 通用老农/地方百姓
  generic_villager: {
    id:'generic_villager', name:'本地居民', role:'朴实乡民', category:'misc', avatar:'👴',
    city:'luoyang', level:5, tier:'func',
    weapon:'wep_none', armor:'cs_cloth', silver:10,
    greetings:{
      hostile:['你这外乡人，不要在这里惹事！','快走快走，别打扰我们！'],
      guarded:['客人，你找谁？','这里没什么好看的，你是路过的吗？'],
      neutral:['外乡来的客人哪，此地不太平，多加小心哦。','哎呦，又来了个走江湖的，你们这些人……'],
      friendly:['哟，又见面了！这里还住得习惯吗？','认识你真好，江湖上的人总有些有趣的故事。'],
      close:['你来啦！快进来坐，今日我家婆娘做了好吃的。','老朋友，来了就别走，好好待几天！'],
    },
    topics:[
      { id:'t_gv_local', text:'询问本地情况', reply:'我们这小地方没什么大事，就是偶尔有外地人来，带来些江湖消息，听着新鲜。', relDelta:3 },
      { id:'t_gv_rumor', text:'打听近况传闻', reply:'最近镇上来了几个面生的人，鬼头鬼脑的，不知道在打什么主意。', relDelta:2 },
    ],
    quests:[], intels:[],
  },

  // 通用行脚商人（小镇出现）
  generic_peddler: {
    id:'generic_peddler', name:'行脚货郎', role:'走方货郎', category:'shop', avatar:'🎒',
    city:'luoyang', level:6, tier:'func',
    weapon:'wep_none', armor:'cs_cloth', silver:60,
    greetings:{
      hostile:['你！你想抢劫？！我可是认识衙门的！','别乱来，我这里没有值钱的东西！'],
      guarded:['客官，看看货吗？别光看不买哟。','哎，买货不买货？'],
      neutral:['走南闯北卖货，今日来到此地，客官可需要什么？','货真价实，不买也罢，看看总无妨！'],
      friendly:['老主顾来啦！今儿进了些新货，要看看吗？','哎呀是你！上次那个东西用得还顺手吗？'],
      close:['兄台，你来得正好，我给你留了件好东西！','朋友，这批货刚到，给你优惠！'],
    },
    topics:[
      { id:'t_gp_trade', text:'打听货物行情', reply:'最近北边战事，丝绸涨了不少，茶叶也贵了。咱小本买卖，难哟。', relDelta:2, intelId:'intel_trade_route' },
      { id:'t_gp_road', text:'询问路况', reply:'我走过好些地方，这条路还算安全，就是天黑后别走，听说有强盗出没。', relDelta:3 },
    ],
    shop:{
      items:[
        { id:'item_dry_food', icon:'🥮', name:'干粮', desc:'饱食度+30', price:6, effect:{ food:30 } },
        { id:'item_water_bag', icon:'🫗', name:'水袋', desc:'口渴度+40', price:5, effect:{ water:40 } },
        { id:'item_torch', icon:'🕯', name:'火折子', desc:'常备物品', price:4, effect:{} },
        { id:'item_cricket_jar', icon:'🏺', name:'蛐蛐罐', desc:'用于装蛐蛐', price:15, effect:{} },
      ]
    },
    quests:[], intels:['intel_trade_route'],
  },

  // 通用江湖女侠
  generic_swordswoman: {
    id:'generic_swordswoman', name:'女侠', role:'剑术练家子', category:'misc', avatar:'⚔️',
    city:'luoyang', level:15, tier:'func',
    weapon:'wep_uc_iron_sword', armor:'cs_cloth', silver:40,
    greetings:{
      hostile:['你这人眼神不善，我没功夫理你。','走开！'],
      guarded:['你是什么来头？报上名来。','打量什么，没见过女侠吗？'],
      neutral:['哦，你也是行走江湖的？此地功夫如何，比试一番？','遇见同道，幸会幸会。'],
      friendly:['是你啊，最近练功有没有长进？','朋友，好久不见，你看起来厉害多了！'],
      close:['总算见到你了！我这里有些事想问你。','好友，终于等到你了！'],
    },
    topics:[
      { id:'t_gsw_duel', text:'切磋武艺心得', reply:'剑术之道，在于以柔克刚，借力打力。一味蛮攻，终是下乘。', relDelta:4 },
      { id:'t_gsw_sect', text:'打听各派武学', reply:'各门各派皆有独到之处，刀剑之道殊途同归，最终拼的还是心境。', relDelta:2 },
    ],
    quests:[], intels:[],
  },
});

// ── 城镇 → NPC 映射 ──
// 已命名城池直接列出具名 NPC ID；其余城池用兜底逻辑生成
const NAMED_CITY_NPCS = {
  // ── 洛阳城 (capital) ──
  luoyang:  ['luoyang_inn','luoyang_doctor','luoyang_smith','luoyang_tavern','luoyang_beggar','luoyang_merchant','luoyang_swordwoman','npc_luoyang_postmaster'],
  // ── 长安城 (capital) ──
  xian:     ['xian_inn','xian_doctor','xian_smith','xian_tavern','xian_swordmaster','xian_merchant'],
  // ── 幽州·燕京 (capital) ──
  youzhou:  ['youzhou_inn','youzhou_doctor','youzhou_smith','youzhou_tavern','youzhou_spy','youzhou_merchant','youzhou_swordwoman'],
  // ── 扬州城 (capital) ──
  yangzhou: ['yangzhou_inn','yangzhou_doctor','yangzhou_smith','yangzhou_tavern','yangzhou_guard','yangzhou_merchant'],
  // ── 成都城 (capital) ──
  chengdu:  ['chengdu_inn','chengdu_doctor','chengdu_smith','chengdu_tavern','chengdu_tangmen','chengdu_merchant','chengdu_escort_woman'],
  // ── 金陵·南京 (capital) ──
  nanjing:  ['nanjing_inn','nanjing_doctor','nanjing_smith','nanjing_tavern','nanjing_hermit','nanjing_merchant','nanjing_poetess'],
  // ── 郑州 (minor · 中原要道) ──
  zhengzhou: ['zhengzhou_inn','zhengzhou_merchant'],
  // ── 开封城 (major) ──
  kaifeng:  ['kaifeng_inn','kaifeng_doctor','kaifeng_smith','kaifeng_tavern','kaifeng_merchant','kaifeng_escort_woman'],
  // ── 沧州 (major) ──
  cangzhou: ['cangzhou_inn','cangzhou_doctor','cangzhou_smith','cangzhou_tavern','cangzhou_merchant','cangzhou_escort_woman'],
  // ── 汉中城 (major) ──
  hanzhong: ['hanzhong_inn','hanzhong_smith','hanzhong_tavern','hanzhong_doctor','hanzhong_escort_woman'],
  // ── 少林寺 (sect · supreme) ──
  shaolin_temple: ['shaolin_elder','shaolin_monk','shaolin_smith'],
  // ── 华山·剑宗峰 (sect · major) ──
  huashan_sect: ['huashan_elder','huashan_swordsman'],
  // ── 武当山·紫霄宫 (sect · major) ──
  wudang_peak: ['wudang_elder','wudang_taoist'],
  // ── 日月神教·圣殿 (sect · supreme) ──
  riyue_sect: ['riyue_envoy','riyue_merchant'],
  // ── 襄阳城 (major · 湖北) ──
  xiangyang: ['xiangyang_inn','xiangyang_doctor','xiangyang_smith','xiangyang_general','xiangyang_merchant'],
  // ── 武当山镇 (minor · 武当脚下) ──
  wudang_town: ['wudang_town_inn','wudang_town_doctor'],
  // ── 晋阳城 (major · 山西) ──
  jinyang: ['jinyang_inn','jinyang_smith','jinyang_tavern','jinyang_escort','jinyang_embroidery'],
  // ── 潼关 (major · 险关) ──
  tongguan: ['tongguan_inn','tongguan_guard','tongguan_smith','tongguan_tea'],
  // ── 兰州 (major · 丝路) ──
  lanzhou: ['lanzhou_inn','lanzhou_merchant','lanzhou_ferryman','lanzhou_martial'],
  // ── 大同 (major · 北方军镇) ──
  datong: ['datong_inn','datong_smith','datong_tavern','datong_veteran'],
  // ── 雁门关 (major · 北境边关) ──
  yanmen: ['yanmen_inn','yanmen_commander','yanmen_shop'],
  // ── 重庆渝州 (major · 山城码头) ──
  chongqing: ['chongqing_inn','chongqing_boss','chongqing_hotpot','chongqing_boatman','chongqing_teawoman'],
  // ── 大理城 (major · 南天佛国) ──
  dali: ['dali_inn','dali_monk','dali_doctor','dali_swordsman'],
  // ── 徐州 (major · 江淮要冲) ──
  xuzhou: ['xuzhou_inn','xuzhou_commander','xuzhou_smith','xuzhou_hero'],
  // ── 苏州 (major · 江南水乡) ──
  suzhou: ['suzhou_inn','suzhou_doctor','suzhou_smith','suzhou_merchant','suzhou_silk_woman','suzhou_poet'],
  // ── 杭州 (major · 西湖胜地) ──
  hangzhou: ['hangzhou_inn','hangzhou_swordsman','hangzhou_doctor','hangzhou_tea_woman','hangzhou_merchant'],
  // ── 荆州城 (major · 古兵家必争) ──
  jingzhou: ['jingzhou_inn','jingzhou_general','jingzhou_smith','jingzhou_strategist'],
  // ── 武汉·武昌 (major · 九省通衢) ──
  wuhan: ['wuhan_inn','wuhan_hero','wuhan_doctor','wuhan_merchant'],
  // ── 长沙 (major · 楚地中心) ──
  changsha: ['changsha_inn','changsha_swordwoman','changsha_merchant'],
  // ── 广州 (major · 岭南港城) ──
  guangzhou: ['guangzhou_inn','guangzhou_hero','guangzhou_merchant','guangzhou_herbalist','guangzhou_dancer'],
  // ── 灵州·银川 (major · 西夏故都) ──
  yinzhou: ['yinzhou_inn','yinzhou_monk','yinzhou_guard','yinzhou_shamaness'],
  // ── 辽阳·上京 (major · 契丹重镇) ──
  liaoyang: ['liaoyang_inn','liaoyang_archer','liaoyang_smith'],
  // ── 草原王庭 (major · 游牧王庭) ──
  caoyuan: ['caoyuan_inn','caoyuan_khan','caoyuan_shaman'],
  // ── 日月城 (major · 神教附属城) ──
  riyue_city: ['riyue_city_inn','riyue_city_agent','riyue_city_smith','riyue_city_priestess'],
  // ── 门派据点 ──
  // 唐门·暗器总堂
  tangmen_hall: ['tangmen_elder','tangmen_merchant'],
  // 峨眉派·金顶禅院
  emei_sect: ['emei_elder','emei_disciple','emei_swordswoman'],
  // 逍遥仙境·逍遥派
  xiaoyao_grotto: ['xiaoyao_elder','xiaoyao_healer'],
  // 五毒教·蛊毒圣地
  wudu_sect: ['wudu_shaman','wudu_doctor'],
  // 崆峒派·问道宫
  kongtong_peak: ['kongtong_elder','kongtong_disciple'],
  // 昆仑派·万年雪宫
  kunlun_sect: ['kunlun_elder'],
  // 凌霄楼·凌霄阁
  lingxiao_tower: ['lingxiao_broker','lingxiao_agent'],
  // 天雷寨·天地帮总舵
  tiandibang_fort: ['tiandibang_boss','tiandibang_smith'],
  // 桃花堂·东邪总坛
  taohua_hall: ['taohua_elder','taohua_disciple'],
  // 血炼堡·血骨门
  xuegu_fort: ['xuegu_boss','xuegu_smith'],
  // 玄冥殿·玄冥教
  xuanming_hall: ['xuanming_elder'],
  // 天山雪宫·天山派
  tianshan_sect: ['tianshan_elder'],
  // 南宫庄园·南宫世家
  nangong_manor: ['nangong_elder','nangong_steward'],
  // 鬼谷门·幽洞
  guigu_valley: ['guigu_master'],
  // 海沙岛·海沙派
  haisha_island: ['haisha_boss','haisha_merchant'],
  // 圣光圣殿·圣光教
  shengguang_temple: ['shengguang_elder','shengguang_healer'],
  // 点苍派·苍云剑阁
  diancang_peak: ['diancang_elder'],
  // 青城派·天师洞
  qingcheng_peak: ['qingcheng_elder'],
  // 西夏皇宫·西夏秘宗
  xixia_palace: ['xixia_lawking'],
  // 龙象堂·天龙帮
  tianlong_stronghold: ['tianlong_boss','tianlong_ferryman'],

  // ── 嵩山 ──
  songshan: ['songshan_inn','songshan_doctor','songshan_merchant','songshan_herb'],
  // ── 汝州 ──
  ruzhou: ['ruzhou_inn','ruzhou_doctor'],
  // ── 汲县 ──
  jixian: ['jixian_inn','jixian_merchant'],
  // ── 洛南 ──
  luonan: ['luonan_inn','luonan_hermit'],
  // ── 商州 ──
  shangzhou: ['shangzhou_inn','shangzhou_smith'],
  // ── 彬州 ──
  bin_zhou: ['bin_zhou_inn'],
  // ── 蒲州 ──
  puzhou: ['puzhou_inn','puzhou_merchant'],
  // ── 华阴县 ──
  huayin: ['huayin_inn','huayin_guide'],
  // ── 华州 ──
  huazhou: ['huazhou_inn','huazhou_smith'],
  // ── 安阳 ──
  anyang: ['anyang_inn','anyang_scholar'],
  // ── 海仓港 ──
  haicang: ['haicang_inn','haicang_merchant'],
  // ── 桃花岛渡口 ──
  taohuadao_coast: ['taohuadao_coast_inn'],
  // ── 桃花岛 ──
  taohuadao: ['taohuadao_villager','taohuadao_fisher'],
  // ── 明州 ──
  mingzhou: ['mingzhou_inn','mingzhou_doctor','mingzhou_smith','mingzhou_smuggler'],
  // ── 南阳 ──
  nanyang: ['nanyang_inn','nanyang_scholar'],
  // ── 沙市 ──
  shashi: ['shashi_inn'],
  // ── 信阳 ──
  xinyang: ['xinyang_inn'],
  // ── 合肥 ──
  hefei: ['hefei_inn','hefei_merchant','hefei_guild'],
  // ── 庐州 ──
  luzhou: ['luzhou_inn'],
  // ── 岳阳楼 ──
  yueyang: ['yueyang_inn','yueyang_doctor','yueyang_smith','yueyang_poet'],
  // ── 九江 ──
  jiujiang: ['jiujiang_inn'],
  // ── 南昌 ──
  nanchang: ['nanchang_inn','nanchang_merchant'],
  // ── 衡阳 ──
  hengyang: ['hengyang_inn','hengyang_swordsman'],
  // ── 张家界 ──
  zhangjiajie: ['zhangjiajie_inn'],
  // ── 恩施 ──
  enshi: ['enshi_inn','enshi_herbalist'],
  // ── 广元 ──
  guangyuan: ['guangyuan_inn'],
  // ── 唐州城 ──
  tangzhou: ['tangzhou_inn','tangzhou_smith'],
  // ── 峨眉山 ──
  emei_shan: ['emei_shan_inn','emei_shan_monk'],
  // ── 乐山 ──
  leshan: ['leshan_inn','leshan_doctor'],
  // ── 达州 ──
  dazhou: ['dazhou_inn'],
  // ── 宜宾 ──
  yibin: ['yibin_inn'],
  // ── 松潘 ──
  songpan: ['songpan_inn'],
  // ── 贵阳 ──
  guiyang: ['guiyang_inn'],
  // ── 苗疆村寨 ──
  wudu_miao: ['wudu_miao_shaman','wudu_miao_merchant'],
  // ── 桂林 ──
  guilin: ['guilin_inn','guilin_guide'],
  // ── 丽江 ──
  lijiang: ['lijiang_inn'],
  // ── 赣州 ──
  ganzhou: ['ganzhou_inn'],
  // ── 福州 ──
  fuzhou: ['fuzhou_inn','fuzhou_doctor','fuzhou_merchant','fuzhou_guild'],
  // ── 腾冲 ──
  tengchong: ['tengchong_inn'],
  // ── 保山 ──
  baoshan: ['baoshan_inn'],
  // ── 潮州 ──
  chaozhou: ['chaozhou_inn'],
  // ── 钦州 ──
  qinzhou: ['qinzhou_inn'],
  // ── 南海三亚 ──
  nanhai: ['nanhai_inn','nanhai_exile'],
  // ── 武威凉州 ──
  wuwei: ['wuwei_inn','wuwei_merchant'],
  // ── 张掖甘州 ──
  zhangye: ['zhangye_inn'],
  // ── 敦煌 ──
  dunhuang: ['dunhuang_inn','dunhuang_scholar'],
  // ── 玉门关 ──
  yumenguan: ['yumenguan_inn'],
  // ── 龟兹库车 ──
  guizi: ['guizi_inn'],
  // ── 西域城邦 ──
  xiyu_city: ['xiyu_city_inn'],
  // ── 和田于阗 ──
  hetian: ['hetian_inn'],
  // ── 高昌故国 ──
  xizhou: ['xizhou_inn'],
  // ── 临夏·河州 ──
  linxia: ['linxia_innkeeper','linxia_merchant','linxia_herbalist'],
};

const WORLD_NODE_NPCS = {};
(function buildNodeNpcs(){
  // 用于判断某城市是否有足够非服务类 NPC（不被 SVC_ROLE_FILTERS 过滤的NPC）
  // 服务类 role 关键词与 SVC_ROLE_FILTERS 同步
  const SVC_ROLE_KEYWORDS = ['掌柜','旅店','客栈','驿馆','郎中','大夫','神医','医',
    '铁匠','锻造','铸兵','铸剑','刀匠','军械','铁器','武器铺','暗器铺','刀剑铺','兵器','剑师',
    '酒馆','酒','酒家','镖局','镖头','护镖','商人','杂货','商贾','草药店','药铺','棋社','棋'];

  function isServiceNpc(npcId){
    const npc = NPC_DB[npcId];
    if(!npc) return false;
    const role = (npc.role||'').toLowerCase();
    return SVC_ROLE_KEYWORDS.some(k => role.includes(k));
  }

  // ★ 守卫：WORLD_NODES 定义在 data-world.js，battle.html 未加载该文件
  if(typeof WORLD_NODES !== 'undefined' && WORLD_NODES){
    Object.values(WORLD_NODES).forEach(node=>{
    if(NAMED_CITY_NPCS[node.id]){
      const named = NAMED_CITY_NPCS[node.id];
      // 检查是否有非服务类 NPC（不会被过滤的）
      const hasNonService = named.some(id => !isServiceNpc(id));
      if(hasNonService){
        // 已有非服务类NPC，直接使用
        WORLD_NODE_NPCS[node.id] = named;
      } else {
        // 全是服务类NPC，追加通用路人保证至少有一个可见NPC
        const extra = node.tier === 'capital' ? ['generic_wanderer','generic_swordswoman','luoyang_beggar']
                    : node.tier === 'major'   ? ['generic_wanderer','generic_swordswoman']
                    : ['generic_wanderer'];
        WORLD_NODE_NPCS[node.id] = [...named, ...extra];
      }
      return;
    }
    // 兜底：按 tier 分配通用路人 NPC
    // 注意：不使用服务型NPC（掌柜/郎中/铁匠等），它们会被 SVC_ROLE_FILTERS 过滤
    const list = [];
    if(node.type === 'sect_location'){
      list.push('generic_wanderer','generic_scholar');
    } else if(node.tier === 'capital'){
      list.push('generic_wanderer','generic_swordswoman','generic_scholar','generic_peddler','luoyang_beggar');
    } else if(node.tier === 'major'){
      list.push('generic_wanderer','generic_swordswoman','generic_peddler');
    } else if(node.tier === 'minor'){
      list.push('generic_wanderer','generic_villager');
    } else {
      list.push('generic_villager');
    }
    WORLD_NODE_NPCS[node.id] = list;
  });
  } // end WORLD_NODES guard
})();

