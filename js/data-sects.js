const SECTS = [
  // ════════════════════════════════════════
  //  超级门派（tier:supreme）
  // ════════════════════════════════════════
  {
    id:'shaolin',
    name:"少林寺",
    title:"禅武合一 · 天下武学正宗",
    tag:"外功 | 内功 | 拳掌",
    desc:"天下武学正宗，千年古刹。少林武学以刚猛著称，七十二绝技名震江湖。寺中弟子修习禅武合一之道，以强身修心为本，以护佑苍生为任。",
    motto:"外修神通内修禅，禅武合一镇山河",
    emblem:'☸',
    schools:['buddha','force','fist'],
    color:'#f0c040', color2:'#ff9900',
    glow:'rgba(240,192,64,.35)', border:'rgba(240,192,64,.2)',
    bg1:'rgba(240,192,64,.06)', bg2:'rgba(240,192,64,.02)',
    tier:'supreme',
    alignment:'righteous',
    members:"弟子三千，高手如云",
    relations:{
      allies:  ['wudang','huashan','emei','kongtong','kunlun','shengguang','nangong'],
      rivals:  ['tiandibang','xiaoyao','guigu'],
      enemies: ['riyue','xuanming','xuegu','wudu'],
    },
    sigSkills:['bd_l1','bd02','bd05','fo_l1','fi_lf1','fi1g'],
    ascii:`
  卍 南无阿弥陀佛 卍
╔═══════╗
║ (◎_◎) ║
║ 卍卍卍 ║
╠═══╦═══╣
卍━━━┿━━━卍`,
    asciiArt:`
        ▲ 嵩 山 之 巅 ▲
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                  ┃
   ┃  ╭──────╮        ┃
   ┃  │ 少林 │  ☸    ┃
   ┃  │ 寺   │ 天下第 ┃
   ┃  ╰──┬───╯ 一大派 ┃
   ┃  大雄宝殿·藏经阁 ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 千年古刹 · 禅武合一 ══`,
  },
  {
    id:'wudang',
    name:"武当派",
    title:"道法自然 · 以柔克刚",
    tag:"道术 | 剑术 | 风系",
    desc:"道教名山，武学圣地。武当以柔克刚、借力打力著称，武当剑法绵密悠长，太极神功更是天下无双。门中弟子多修身养性，追求道法自然的至高境界。",
    motto:"以柔克刚，四两拨千斤",
    emblem:'☯',
    schools:['tao','sword','wind'],
    color:'#60e8e8', color2:'#00c8d0',
    glow:'rgba(96,232,232,.3)', border:'rgba(96,232,232,.18)',
    bg1:'rgba(96,232,232,.05)', bg2:'rgba(96,232,232,.02)',
    tier:'supreme',
    alignment:'righteous',
    members:"道门弟子两千余人",
    relations:{
      allies:  ['shaolin','huashan','emei','kongtong','kunlun','tianshan','shengguang'],
      rivals:  ['mingjiao','xiaoyao','qingcheng'],
      enemies: ['riyue','xuanming','xuegu','wudu'],
    },
    sigSkills:['ta_l1','ta01','ta02','ta03','sw_l1','wi_l3'],
    ascii:`
☯ ☯ ☯ ☯ ☯ ☯
╔══(^_^)══╗
║  道法自 ║
║  然无为 ║
╚════╦════╝
 ～～─┿─～～`,
    asciiArt:`
       ◇ 武 当 金 顶 ◇
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃    ╭──────╮  ☯     ┃
   ┃    │ 武当 │ 太极无极┃
   ┃    │ 观   │ 道法自然┃
   ┃    ╰──┬───╯        ┃
   ┃  南岩宫·紫霄殿      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 天柱峰 · 以柔克刚 ══`,
  },
  {
    id:'xiaoyao',
    name:"逍遥派",
    title:"天地任遨游 · 逍遥自在",
    tag:"风系 | 命术 | 冰系 | 道术",
    desc:"天山缥缈峰上的神秘门派，行事随心所欲，武功飘逸灵动。门中多为女子，修炼天山折梅手、生死符等绝学，轻功天下第一，与世无争却又名震江湖。",
    motto:"生死符下皆蝼蚁，天山逍遥任我行",
    emblem:'🌀',
    schools:['wind','fate','ice','tao'],
    color:'#c0f0c0', color2:'#60cc60',
    glow:'rgba(192,240,192,.25)', border:'rgba(192,240,192,.15)',
    bg1:'rgba(192,240,192,.04)', bg2:'rgba(192,240,192,.02)',
    tier:'supreme',
    alignment:'neutral',
    members:"门人稀少，皆为天资卓绝之辈",
    relations:{
      allies:  ['taohuadao','guigu'],
      rivals:  ['wudang','tianshan'],
      enemies: ['riyue','xuanming'],
    },
    sigSkills:['wi_l3','wi01','wi06','ft_l1','ft06','ft10'],
    ascii:`
～ ～ ～ ～
 ╭(^‿^)╮
 │逍遥派│
 ╰──┬──╯
～～～～～～`,
    asciiArt:`
       🌀 天 山 灵 鸾 宫 🌀
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮    🌀    ┃
   ┃  │ 逍遥 │  生死自在 ┃
   ┃  │ 派   │  无拘无束┃
   ┃  ╰──┬───╯         ┃
   ┃  灵鹫宫·折梅手      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 天地任遨游 · 逍遥自在 ══`,
  },
  {
    id:'riyue',
    name:"日月神教",
    title:"日月当空 · 教主独尊",
    tag:"火系 | 冰系 | 命术",
    desc:"江湖第一邪道大派，势力遍布天下，与正道各派势同水火。神功绝学有葵花宝典、吸星大法等，门中等级森严，教主独尊，是正道的心腹大患。",
    motto:"日出东方，唯我不败",
    emblem:'☀',
    schools:['fire','ice','fate'],
    color:'#ff8800', color2:'#cc4400',
    glow:'rgba(255,136,0,.35)', border:'rgba(255,136,0,.2)',
    bg1:'rgba(255,136,0,.06)', bg2:'rgba(255,136,0,.02)',
    tier:'supreme',
    alignment:'evil',
    members:"教众数十万，遍布天下",
    relations:{
      allies:  ['xuanming','wudu','xuegu'],
      rivals:  ['mingjiao','tianlong'],
      enemies: ['shaolin','wudang','huashan','emei','kongtong','kunlun','shengguang','nangong','tianshan'],
    },
    sigSkills:['fi_l1','fi04','fi07','ic_l1','ic05','ft06'],
    ascii:`
☀ 日月神教 ☀
╔══════════╗
║ (ω_ω)  ║
║教主万岁  ║
╚══════════╝`,
    asciiArt:`
       ☀ 日 月 神 教 总 坛 ☀
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ╭──────────╮     ┃
   ┃  │  日月神教  │  ☀  ┃
   ┃  │          │千秋万载┃
   ┃  ╰────┬─────╯一统江湖┃
   ┃  黑木崖·十长老·吸星法  ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 日月当空 · 教主独尊 ══`,
  },

  // ════════════════════════════════════════
  //  大型门派（tier:major）
  // ════════════════════════════════════════
  {
    id:'huashan',
    name:"华山派",
    title:"剑气合一 · 西岳至尊",
    tag:"剑术 | 圣系 | 冰系",
    desc:"西岳华山上的名门大派，剑宗与气宗之争曾震动江湖。华山剑法轻灵飘逸，变化无穷，门中弟子多心高气傲，剑道修为不俗，在正道中地位显赫。",
    motto:"剑意凌云，气冲霄汉",
    emblem:'⚔',
    schools:['sword','holy','ice'],
    color:'#80d8ff', color2:'#40b0ff',
    glow:'rgba(64,176,255,.3)', border:'rgba(64,176,255,.18)',
    bg1:'rgba(64,176,255,.05)', bg2:'rgba(64,176,255,.02)',
    tier:'major',
    alignment:'righteous',
    members:"弟子八百余，剑道精英辈出",
    relations:{
      allies:  ['shaolin','wudang','emei','kunlun','nangong'],
      rivals:  ['tiandibang','haisha','xixia'],
      enemies: ['riyue','xuanming','xuegu'],
    },
    sigSkills:['sw_l2','sw01','sw03','ho_l1','ho01','ic_l1'],
    ascii:`
  ✦  ╭──╮  ✦
 ⚔  │ ≡ │  ⚔
    ╠════╣
 ▓▓▓╋════╋▓▓▓
    ╱════╲`,
    asciiArt:`
       ✦ 华 山 论 剑 ✦
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃      ╱╲           ┃
   ┃     ╱剑╲    ⚔     ┃
   ┃    ╱  道 ╲ 剑气凌云┃
   ┃   ╱ 绝 顶 ╲         ┃
   ┃  ╱  苍龙岭 ╲ 悬崖栈道┃
   ┃  思过崖·朝阳峰      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 西岳 · 以快制剑 ══`,
  },
  {
    id:'mingjiao',
    name:"明教",
    title:"圣火焚天 · 波斯正统",
    tag:"火系 | 拳掌 | 外功",
    desc:"源自波斯的神秘教派，以圣火令为信物。明教弟子修炼圣火神功，行事光明磊落却又被江湖称为\"魔教\"。与正道各派恩怨纠缠，亦正亦邪，实力不容小觑。",
    motto:"焚我残躯，圣火照耀大地",
    emblem:'🔥',
    schools:['fire','fist','force'],
    color:'#ff6020', color2:'#ff3000',
    glow:'rgba(255,96,32,.35)', border:'rgba(255,96,32,.2)',
    bg1:'rgba(255,96,32,.06)', bg2:'rgba(255,96,32,.02)',
    tier:'major',
    alignment:'chaotic',
    members:"四法王、三使者、五散人",
    relations:{
      allies:  ['tiandibang','tianlong'],
      rivals:  ['wudu','tangmen','haisha'],
      enemies: ['shaolin','wudang','huashan','emei','riyue','xuegu'],
    },
    sigSkills:['fi_l1','fi01','fi03','fi05','fi_lf1','fo_l1'],
    ascii:`
🔥 圣火令 🔥
╔══╗火╔══╗
║▓▓║光║▓▓║
║▓▓╠══╣▓▓║
╚══╝明╚══╝`,
    asciiArt:`
       🔥 光 明 顶 🔥
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃    ╭──────╮  🔥    ┃
   ┃    │ 明教 │ 圣火燃天┃
   ┃    │ 总坛 ║ 焚我残躯┃
   ┃    ╰──┬───╯        ┃
   ┃  四法王·三使者      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 波斯圣火 · 倚天屠龙 ══`,
  },
  {
    id:'wudu',
    name:"五毒教",
    title:"蛊毒天下 · 百毒不侵",
    tag:"毒系 | 奇门 | 暗影",
    desc:"苗疆神秘门派，以蛊虫毒术闻名天下。门中弟子修炼各种毒功，以毒练功、以毒伤人。万毒窟、炼蛊池是门中禁地，令江湖人士闻风丧胆。",
    motto:"天下奇毒，尽在掌握",
    emblem:'🐍',
    schools:['poison','qimen','shadow'],
    color:'#88ff44', color2:'#44cc00',
    glow:'rgba(136,255,68,.28)', border:'rgba(136,255,68,.18)',
    bg1:'rgba(136,255,68,.05)', bg2:'rgba(136,255,68,.02)',
    tier:'major',
    alignment:'evil',
    members:"教众数千，分布于苗疆各地",
    relations:{
      allies:  ['xuanming','xuegu'],
      rivals:  ['tangmen','qingcheng','mingjiao'],
      enemies: ['shaolin','wudang','emei','tianshan','shengguang'],
    },
    sigSkills:['po_l1','po01','po02','po07','sh_l3','qm_l1'],
    ascii:`
🐍🦂🪲🐸🦟
(⊙_⊙)五毒
卍蛊卍蛊卍
─────────
五毒共生！`,
    asciiArt:`
       🐍 苗 疆 五 仙 🐍
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃    ┌────┐          ┃
   ┃    │五毒│  🐍🦂🪲  ┃
   ┃    │教  │  🐸🦟蛊  ┃
   ┃    └┬───┘ 百毒不侵 ┃
   ┃  万蛇窟·炼蛊池      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 毒虫秘法 · 以毒攻毒 ══`,
  },
  {
    id:'tangmen',
    name:"唐门",
    title:"暗器无双 · 机关算尽",
    tag:"暗影 | 奇门 | 毒系",
    desc:"蜀中唐门以暗器、毒药、机关闻名天下，是江湖中最神秘的门派之一。门中弟子极少在江湖走动，但每次出手必惊天动地，百步之内取人性命。",
    motto:"宁我负天下人，休教天下人负我",
    emblem:'🏹',
    schools:['shadow','qimen','poison'],
    color:'#a080e0', color2:'#8040c0',
    glow:'rgba(160,128,224,.28)', border:'rgba(160,128,224,.18)',
    bg1:'rgba(160,128,224,.05)', bg2:'rgba(160,128,224,.02)',
    tier:'major',
    alignment:'neutral',
    members:"宗族传承，不收外姓弟子",
    relations:{
      allies:  ['guigu','lingxiao'],
      rivals:  ['wudu','qingcheng','haisha'],
      enemies: [],
    },
    sigSkills:['sh_l1','sh01','sh02','sh07','qm_l2','qm02'],
    ascii:`
░(▓_▓)░
暗器天下！
→→→★★★
百步穿杨！
─────────`,
    asciiArt:`
       🏹 唐 门 堡 🏹
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ╭────╮  ┌───┐     ┃
   ┃  │唐门│  │机关│ 🏹  ┃
   ┃  │堡  │  │暗器│ 百步┃
   ┃  ╰┬───╯  └───┘ 穿杨┃
   ┃  飞针阁·毒药室      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 蜀中 · 暗器无双 ══`,
  },
  {
    id:'taohuadao',
    name:"桃花岛",
    title:"落英缤纷 · 聪颖无双",
    tag:"冰系 | 音律 | 道术",
    desc:"东海桃花岛，岛主黄药师武功绝顶，琴棋书画无一不精。桃花岛武学以奇门遁甲、落英神剑掌、玉箫剑法闻名，门中规矩森严，聪颖者方能入门。",
    motto:"桃花影落飞神剑，碧海潮生按玉箫",
    emblem:'🌸',
    schools:['ice','music','tao'],
    color:'#ff88cc', color2:'#ff5599',
    glow:'rgba(255,136,204,.28)', border:'rgba(255,136,204,.18)',
    bg1:'rgba(255,136,204,.05)', bg2:'rgba(255,136,204,.02)',
    tier:'major',
    alignment:'neutral',
    members:"门人不多，皆为天资聪颖者",
    relations:{
      allies:  ['xiaoyao','lingxiao'],
      rivals:  ['shaolin','emei'],
      enemies: ['riyue','xuegu'],
    },
    sigSkills:['ic_l2','ic02','ic07','mu_l2','mu01','mu03'],
    ascii:`
🌸 落 英 🌸
╭(◕‿◕)╮
│ 桃花岛 │
╰──╮──╯
 ～～🌸～～`,
    asciiArt:`
       🌸 东 海 桃 花 岛 🌸
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃    ╭──────╮        ┃
   ┃    │ 桃花 │  🌸    ┃
   ┃    │ 岛   │ 落英缤纷┃
   ┃    ╰──┬───╯ 琴棋书画┃
   ┃  碧海潮生·奇门异术  ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 移花接木 · 聪颖无双 ══`,
  },
  {
    id:'emei',
    name:"峨眉派",
    title:"清心寡欲 · 峨眉天下秀",
    tag:"圣系 | 冰系 | 道术",
    desc:"峨眉山上的女子门派，以九阴真经残篇立派，武学融合佛道两家精华。门中弟子多为女子，修炼清心寡欲之道，九阴神功名震江湖，与少林、武当并称为正派三大支柱。",
    motto:"峨眉天下秀，清心寡欲成大道",
    emblem:'🌺',
    schools:['holy','ice','tao'],
    color:'#ffaad4', color2:'#ff80b0',
    glow:'rgba(255,170,212,.28)', border:'rgba(255,170,212,.18)',
    bg1:'rgba(255,170,212,.05)', bg2:'rgba(255,170,212,.02)',
    tier:'major',
    alignment:'righteous',
    members:"女弟子千余人，高手辈出",
    relations:{
      allies:  ['shaolin','wudang','kunlun','tianshan','shengguang'],
      rivals:  ['tiandibang','mingjiao'],
      enemies: ['wudu','xuegu','riyue'],
    },
    sigSkills:['ho_l2','ho03','ic_l3','ic05','ta_l2','ta03'],
    ascii:`
🌺 峨 眉 🌺
 ╭(≧◡≦)╮
 │ 峨眉派 │
 ╰──┬──╯
🌸─────🌸`,
    asciiArt:`
       🌺 峨 眉 金 顶 🌺
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃   ╭──────╮   🌺    ┃
   ┃   │峨眉派│ 女中豪杰 ┃
   ┃   │     │ 圣洁峰巅 ┃
   ┃   ╰──┬───╯         ┃
   ┃  万年寺·金顶·清音阁  ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 清心寡欲 · 峨眉天下 ══`,
  },
  {
    id:'kongtong',
    name:"崆峒派",
    title:"七伤绝技 · 刚猛霸道",
    tag:"拳掌 | 外功 | 雷系",
    desc:"西北名门，以七伤拳闻名天下。崆峒武学走刚猛一路，伤敌一千自损八百。门中五老各怀绝技，在西北武林中地位举足轻重，与正道各派多有往来。",
    motto:"宁折不弯，七伤绝命",
    emblem:'⛰',
    schools:['fist','force','thunder'],
    color:'#e06040', color2:'#c04020',
    glow:'rgba(224,96,64,.3)', border:'rgba(224,96,64,.18)',
    bg1:'rgba(224,96,64,.05)', bg2:'rgba(224,96,64,.02)',
    tier:'major',
    alignment:'righteous',
    members:"门人千余，五老执掌门户",
    relations:{
      allies:  ['shaolin','wudang','kunlun','nangong'],
      rivals:  ['tianlong','tiandibang'],
      enemies: ['xuanming','xuegu','riyue'],
    },
    sigSkills:['fi_lf1','fi1h','fo01','fo03','th_l1','th02'],
    ascii:`
⛰ 崆 峒 ⛰
╔════════╗
║(ò_ó)拳║
║七伤绝  ║
╚════════╝`,
    asciiArt:`
       ⛰ 崆 峒 山 ⛰
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ╭──────╮         ┃
   ┃  │崆峒派│  ⛰     ┃
   ┃  │     │ 七伤绝技┃
   ┃  ╰──┬───╯ 刚猛霸道┃
   ┃  北地武宗·五老堂    ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 宁折不弯 · 以伤换伤 ══`,
  },
  {
    id:'kunlun',
    name:"昆仑派",
    title:"万剑归宗 · 西域之巅",
    tag:"剑术 | 冰系 | 外功",
    desc:"昆仑山脉上的大派，门中以剑术闻名，昆仑剑法凌厉狠辣，与中原武林多有交流。门中禁地有琼山仙境之说，昆仑弟子常行走江湖，行侠仗义。",
    motto:"昆仑一剑，天下谁敌",
    emblem:'🏔',
    schools:['sword','ice','force'],
    color:'#90d0ff', color2:'#5090d0',
    glow:'rgba(144,208,255,.28)', border:'rgba(144,208,255,.18)',
    bg1:'rgba(144,208,255,.05)', bg2:'rgba(144,208,255,.02)',
    tier:'major',
    alignment:'righteous',
    members:"弟子五百余，遍布西域",
    relations:{
      allies:  ['shaolin','wudang','huashan','tianshan'],
      rivals:  ['xixia','diancang'],
      enemies: ['xuanming','riyue','wudu'],
    },
    sigSkills:['sw_l1','sw03','sw05','ic_l1','ic03','fo_l3'],
    ascii:`
🏔 昆 仑 🏔
 ╭─(^▽^)─╮
 │ 金刚剑 │
 ╰───────╯
❄─────────❄`,
    asciiArt:`
       ❄ 昆 仑 山 巅 ❄
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮         ┃
   ┃  │昆仑派│  ❄     ┃
   ┃  │     │ 万剑归宗┃
   ┃  ╰──┬───╯ 西域之巅┃
   ┃  龙门客栈·玉虚峰    ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 昆仑绝顶 · 万山之祖 ══`,
  },

  // ════════════════════════════════════════
  //  新兴势力（tier:minor）
  // ════════════════════════════════════════
  {
    id:'tiandibang',
    name:"天地帮",
    title:"雷霆万钧 · 霸道江湖",
    tag:"雷系 | 外功 | 拳掌",
    desc:"北方新兴势力，以雷神帮著称。帮中弟子多草莽出身，行事霸道，不拘小节。帮主武功高强，势力扩张迅速，是江湖中不可忽视的一股力量。",
    motto:"雷霆震四方，天地任我行",
    emblem:'⚡',
    schools:['thunder','force','fist'],
    color:'#ffe040', color2:'#ffa000',
    glow:'rgba(255,224,64,.3)', border:'rgba(255,224,64,.18)',
    bg1:'rgba(255,224,64,.05)', bg2:'rgba(255,224,64,.02)',
    tier:'minor',
    alignment:'chaotic',
    members:"帮众数千，势力遍及北方",
    relations:{
      allies:  ['mingjiao','tianlong','haisha'],
      rivals:  ['shaolin','wudang','kongtong'],
      enemies: ['xuegu','xuanming'],
    },
    sigSkills:['th_l1','th01','th02','th05','fo01','fi_lf3'],
    ascii:`
⚡ 天 地 帮 ⚡
╔═══════╗
║ ▓_▓  ║
║ 雷 霆 ║
⚡━━━━━━━⚡`,
    asciiArt:`
       ⚡ 雷 霆 总 坛 ⚡
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃   ╭──────╮         ┃
   ┃   │天地帮│  ⚡     ┃
   ┃   │总坛 │ 雷鸣四野┃
   ┃   ╰──┬───╯         ┃
   ┃  千余帮众·霸道天下   ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 雷霆万钧 · 霸道江湖 ══`,
  },
  {
    id:'guigu',
    name:"鬼谷派",
    title:"算无遗策 · 决胜千里",
    tag:"奇门 | 命术 | 暗影",
    desc:"鬼谷隐世门派，传承鬼谷子遗风，以奇门遁甲、兵法谋略闻名。门中弟子不多但皆为精英，算无遗策，运筹帷幄之中，决胜千里之外。",
    motto:"一怒则诸侯惧，安居则天下息",
    emblem:'🔮',
    schools:['qimen','fate','shadow'],
    color:'#d4b050', color2:'#a08020',
    glow:'rgba(212,176,80,.28)', border:'rgba(212,176,80,.18)',
    bg1:'rgba(212,176,80,.05)', bg2:'rgba(212,176,80,.02)',
    tier:'minor',
    alignment:'neutral',
    members:"门人稀少，皆为智谋之士",
    relations:{
      allies:  ['lingxiao','tangmen','xiaoyao'],
      rivals:  ['riyue','xuanming'],
      enemies: [],
    },
    sigSkills:['qm_l3','qm01','qm08','qm10','ft_l1','ft05'],
    ascii:`
🔮 天机阁 🔮
 ╭(~_~)╮
 │鬼谷子│
 ╰──┬──╯
🔮─────🔮`,
    asciiArt:`
       🔮 鬼 谷 天 机 阁 🔮
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ┌──────┐          ┃
   ┃  │天机阁│  🔮      ┃
   ┃  │     │ 算无遗策  ┃
   ┃  └┬─────┘ 运筹帷幄  ┃
   ┃  奇门遁甲·天命推算    ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 决胜千里 · 天机不可泄 ══`,
  },
  {
    id:'shengguang',
    name:"圣光教",
    title:"圣光普照 · 正道之盾",
    tag:"圣系 | 音律 | 佛法",
    desc:"西方传来的光明神教，以圣光神功驱散邪恶。教中骑士团训练有素，誓要守护苍生。圣光教与正道各派结盟，共同对抗邪道势力。",
    motto:"圣光普照，邪不胜正",
    emblem:'✦',
    schools:['holy','music','buddha'],
    color:'#ffffa0', color2:'#ffdd00',
    glow:'rgba(255,255,128,.28)', border:'rgba(255,255,128,.18)',
    bg1:'rgba(255,255,128,.04)', bg2:'rgba(255,255,128,.02)',
    tier:'minor',
    alignment:'righteous',
    members:"圣骑士团三百余人",
    relations:{
      allies:  ['shaolin','wudang','emei','tianshan'],
      rivals:  ['guigu','xixia'],
      enemies: ['riyue','xuegu','xuanming','wudu'],
    },
    sigSkills:['ho_l1','ho01','ho03','ho04','mu_l2','bd_l2'],
    ascii:`
✦ 圣 光 ✦
╔═══════╗
║ (^‿^) ║
║ ✦圣✦  ║
╚═══════╝`,
    asciiArt:`
       ✦ 圣 光 大 殿 ✦
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ╭──────╮   ✦     ┃
   ┃  │ 圣光 │  圣裁天下┃
   ┃  │ 教   │  邪不胜正┃
   ┃  ╰──┬───╯         ┃
   ┃  圣骑士团·光明神功   ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 圣光普照 · 正道之盾 ══`,
  },
  {
    id:'diancang',
    name:"点苍派",
    title:"苍山如海 · 毒剑双绝",
    tag:"剑术 | 毒系 | 风系",
    desc:"云南点苍山上的剑派，以点苍剑法闻名。门中融合了毒术与剑术，走独树一帜的毒剑双修之路。苍山如海，剑气如虹。",
    motto:"苍山如海，残阳如血",
    emblem:'💠',
    schools:['sword','poison','wind'],
    color:'#70c8b0', color2:'#40a890',
    glow:'rgba(112,200,176,.28)', border:'rgba(112,200,176,.18)',
    bg1:'rgba(112,200,176,.05)', bg2:'rgba(112,200,176,.02)',
    tier:'minor',
    alignment:'neutral',
    members:"弟子数百，分布于云贵高原",
    relations:{
      allies:  ['tangmen','qingcheng'],
      rivals:  ['kunlun','emei'],
      enemies: ['wudu'],
    },
    sigSkills:['sw_l2','sw02','po_l2','po04','wi_l1','wi02'],
    ascii:`
💠 点 苍 💠
 ╭(·_·)╮
 苍山如海
 ╰──┬──╯
～──────～`,
    asciiArt:`
       💠 苍 山 如 海 💠
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮         ┃
   ┃  │点苍派│  💠     ┃
   ┃  │     │ 云贵秘境┃
   ┃  ╰──┬───╯ 毒剑双修┃
   ┃  十九峰·洗马潭      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 苍山如海 · 残阳如血 ══`,
  },
  {
    id:'tianshan',
    name:"天山派",
    title:"冰心玉壶 · 天下无双",
    tag:"冰系 | 道术 | 圣系",
    desc:"天山之上的冰雪门派，修炼冰清玉洁的内功心法。门中以天山六阳掌、折梅手闻名，天山雪莲更是疗伤圣品。门人常隐于雪山之中，不问世事。",
    motto:"冰心玉壶，天山雪莲",
    emblem:'❄',
    schools:['ice','tao','holy'],
    color:'#d0f0ff', color2:'#90d8ff',
    glow:'rgba(208,240,255,.25)', border:'rgba(208,240,255,.15)',
    bg1:'rgba(208,240,255,.04)', bg2:'rgba(208,240,255,.02)',
    tier:'minor',
    alignment:'righteous',
    members:"门人不多，皆在雪山修行",
    relations:{
      allies:  ['shaolin','wudang','emei','kunlun'],
      rivals:  ['xixia','xiaoyao'],
      enemies: ['xuanming','wudu','riyue'],
    },
    sigSkills:['ic_l1','ic02','ic04','ic07','ta_l2','ho_l2'],
    ascii:`
❄ 天 山 ❄
 ╭(~_~)╮
 │天山派│
 ╰──┬──╯
❄══════❄`,
    asciiArt:`
       ❄ 天 山 绝 峰 ❄
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮         ┃
   ┃  │天山派│  ❄     ┃
   ┃  │     │ 冰封万里┃
   ┃  ╰──┬───╯ 雪莲圣地┃
   ┃  冰池·瑶光宫·断崖   ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 冰心玉壶 · 天下无双 ══`,
  },
  {
    id:'xixia',
    name:"西夏密宗",
    title:"天命所归 · 神秘莫测",
    tag:"命术 | 奇门 | 暗影",
    desc:"西夏国的神秘宗教门派，以密宗武学为主，融合了佛教与西域秘术。门中修炼天命推算之术，善于卜卦算命，行事神秘莫测。",
    motto:"天命所归，顺势而为",
    emblem:'🌙',
    schools:['fate','qimen','shadow'],
    color:'#c0a0e0', color2:'#9060c0',
    glow:'rgba(192,160,224,.28)', border:'rgba(192,160,224,.18)',
    bg1:'rgba(192,160,224,.05)', bg2:'rgba(192,160,224,.02)',
    tier:'minor',
    alignment:'neutral',
    members:"密宗修士百余人",
    relations:{
      allies:  ['guigu','diancang'],
      rivals:  ['tianshan','kunlun'],
      enemies: ['riyue'],
    },
    sigSkills:['ft_l1','ft03','ft05','qm_l3','qm05','sh_l1'],
    ascii:`
🌙 西 夏 🌙
 ╭(·▿·)╮
 西域秘宗
 ╰──┬──╯
🌙─────🌙`,
    asciiArt:`
       🌙 西 夏 密 宗 🌙
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ┌──────┐         ┃
   ┃  │西夏秘│  🌙     ┃
   ┃  │ 宗  │ 神秘莫测┃
   ┃  └┬─────┘ 命系预测┃
   ┃  奇门阵法·西域密术    ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 天命所归 · 顺势而为 ══`,
  },
  {
    id:'tianlong',
    name:"天龙寺",
    title:"龙象般若 · 吐蕃密宗",
    tag:"外功 | 拳掌 | 佛法",
    desc:"大理国皇室寺院，以龙象般若功闻名。门中既有佛门高僧，亦有皇室成员，武功融合了佛门与吐蕃秘术，刚猛霸道，是西南武林的重要势力。",
    motto:"龙腾四海，象步千山",
    emblem:'🐉',
    schools:['force','fist','buddha'],
    color:'#e8a000', color2:'#c07800',
    glow:'rgba(232,160,0,.32)', border:'rgba(232,160,0,.2)',
    bg1:'rgba(232,160,0,.06)', bg2:'rgba(232,160,0,.02)',
    tier:'minor',
    alignment:'chaotic',
    members:"僧俗弟子数百人",
    relations:{
      allies:  ['tiandibang','haisha'],
      rivals:  ['mingjiao','kongtong'],
      enemies: ['shaolin','wudang'],
    },
    sigSkills:['fo_l1','fo02','fo03','fi_lf2','fi1a','bd_l1'],
    ascii:`
🐉 天 龙 🐉
╔═══════╗
║(▓_▓)力║
║龙象般若║
╚═══════╝`,
    asciiArt:`
       🐉 龙 象 总 坛 🐉
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ╭──────╮         ┃
   ┃  │天龙帮│  🐉     ┃
   ┃  │     │ 龙象之力┃
   ┃  ╰──┬───╯ 刚猛霸道┃
   ┃  十八罗汉·吐蕃密宗   ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 龙腾四海 · 象步千山 ══`,
  },
  {
    id:'nangong',
    name:"南宫世家",
    title:"礼义廉耻 · 剑道之魂",
    tag:"剑术 | 圣系 | 音律",
    desc:"传承数百年的武林世家，以礼仪传家，剑道闻名。南宫世家弟子讲究礼义廉耻，门风严谨，贵族气质浓厚，是武林中少有的名门正派。",
    motto:"剑者，君子之器也",
    emblem:'🏛',
    schools:['sword','holy','music'],
    color:'#b8d890', color2:'#80b850',
    glow:'rgba(184,216,144,.28)', border:'rgba(184,216,144,.18)',
    bg1:'rgba(184,216,144,.05)', bg2:'rgba(184,216,144,.02)',
    tier:'minor',
    alignment:'righteous',
    members:"南宫一族，子弟三百余人",
    relations:{
      allies:  ['shaolin','wudang','huashan','shengguang'],
      rivals:  ['tiandibang','haisha'],
      enemies: ['riyue','xuegu','xuanming'],
    },
    sigSkills:['sw_l1','sw01','sw04','ho_l1','ho02','mu_l2'],
    ascii:`
🏛 南 宫 🏛
 ╭(^_^)╮
 │南宫派│
 剑典天下
╰───────╯`,
    asciiArt:`
       🏛 南 宫 世 家 🏛
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮         ┃
   ┃  │南宫派│  🏛     ┃
   ┃  │     │ 贵族剑道┃
   ┃  ╰──┬───╯ 礼义廉耻┃
   ┃  世家府邸·藏书万卷    ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 礼义廉耻 · 剑道之魂 ══`,
  },
  {
    id:'xuanming',
    name:"玄冥教",
    title:"玄冥寒掌 · 天下无解",
    tag:"冰系 | 毒系 | 暗影",
    desc:"北方邪道大派，以玄冥神掌和玄冥毒功闻名。门中修炼阴寒之气，出手即带寒毒，中者痛苦不堪。玄冥教与日月神教、五毒教并称为邪道三巨头。",
    motto:"玄冥之下，寸草不生",
    emblem:'⛧',
    schools:['ice','poison','shadow'],
    color:'#7090c0', color2:'#405080',
    glow:'rgba(112,144,192,.3)', border:'rgba(112,144,192,.2)',
    bg1:'rgba(112,144,192,.06)', bg2:'rgba(112,144,192,.02)',
    tier:'minor',
    alignment:'evil',
    members:"教众数千，势力遍及北方",
    relations:{
      allies:  ['riyue','wudu','xuegu'],
      rivals:  ['mingjiao','tianlong'],
      enemies: ['shaolin','wudang','huashan','shengguang','tianshan'],
    },
    sigSkills:['ic_l2','ic03','ic06','po_l1','po02','sh_l2'],
    ascii:`
⛧ 玄 冥 ⛧
╔═══════╗
║(╬▔_▔)║
║玄冥寒掌║
╚═══════╝`,
    asciiArt:`
       ⛧ 玄 冥 鬼 府 ⛧
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ╭──────╮         ┃
   ┃  │玄冥教│  ⛧     ┃
   ┃  │     │ 寒毒入骨┃
   ┃  ╰──┬───╯ 阴冷霸道┃
   ┃  冰魄洞·寒潭·鬼哭谷  ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 玄冥寒掌 · 天下无解 ══`,
  },
  {
    id:'haisha',
    name:"海沙派",
    title:"七杀刀法 · 血染东海",
    tag:"暗影 | 外功 | 雷系",
    desc:"东海沿海的海盗门派，以七杀刀法称雄海上。海沙派弟子凶悍无比，在东南沿海势力庞大，与官府和正道多有冲突，但行事亦正亦邪。",
    motto:"七杀刀出，血染东海",
    emblem:'⚓',
    schools:['shadow','force','thunder'],
    color:'#4090d0', color2:'#206898',
    glow:'rgba(64,144,208,.3)', border:'rgba(64,144,208,.18)',
    bg1:'rgba(64,144,208,.05)', bg2:'rgba(64,144,208,.02)',
    tier:'minor',
    alignment:'chaotic',
    members:"帮众数千，战船百艘",
    relations:{
      allies:  ['tiandibang','tianlong'],
      rivals:  ['tangmen','lingxiao'],
      enemies: ['shaolin','nangong'],
    },
    sigSkills:['sh_l1','sh02','sh06','fo_l2','fo04','th_l2'],
    ascii:`
⚓ 海 沙 ⚓
 ╭(●_●)╮
 七杀刀法
 ╰──┬──╯
〰──────〰`,
    asciiArt:`
       ⚓ 东 海 龙 王 寨 ⚓
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮         ┃
   ┃  │海沙派│  ⚓     ┃
   ┃  │     │ 七杀刀法┃
   ┃  ╰──┬───╯ 东海霸主┃
   ┃  水寨·战船·千堆雪    ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 七杀刀出 · 血染东海 ══`,
  },
  {
    id:'xuegu',
    name:"血骨门",
    title:"血祭苍天 · 骨铸神兵",
    tag:"拳掌 | 外功 | 暗系",
    desc:"以血炼功、以骨铸身的邪道门派，修炼方式极为残忍。血骨门门人通过血祭提升功力，实力强横但路子邪门，是正道的眼中钉。",
    motto:"以我之血，铸不朽骨",
    emblem:'💀',
    schools:['fist','force','dark'],
    color:'#cc2020', color2:'#880000',
    glow:'rgba(204,32,32,.35)', border:'rgba(204,32,32,.22)',
    bg1:'rgba(204,32,32,.07)', bg2:'rgba(204,32,32,.03)',
    tier:'minor',
    alignment:'evil',
    members:"门人不多，皆以血祭提升",
    relations:{
      allies:  ['riyue','xuanming'],
      rivals:  ['wudu'],
      enemies: ['shaolin','shengguang','emei'],
    },
    sigSkills:['fi_lf1','fi1h','fi1j','fo_l2','fo05','sh_l1'],
    ascii:`
💀 血 骨 门 💀
╔══════════╗
║ (×_×) ║
║血炼大成  ║
╚══════════╝`,
    asciiArt:`
       💀 血 骨 炼 狱 💀
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃  ╭──────────╮     ┃
   ┃  │  血骨门   │  💀  ┃
   ┃  │          │以血炼功┃
   ┃  ╰────┬─────╯杀伐决断┃
   ┃  血池·白骨·祭坛      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 血祭苍天 · 骨铸神兵 ══`,
  },
  {
    id:'lingxiao',
    name:"凌霄阁",
    title:"消息通天下 · 剑指凌霄",
    tag:"剑术 | 风系 | 奇门",
    desc:"江湖第一情报组织，以消息灵通著称。凌霄阁收集天下情报，交易于黑白两道，门中剑法也极为精妙，是江湖中不可或缺的一股势力。",
    motto:"天下之事，无所不知",
    emblem:'🏯',
    schools:['sword','wind','qimen'],
    color:'#d0a060', color2:'#a07030',
    glow:'rgba(208,160,96,.3)', border:'rgba(208,160,96,.18)',
    bg1:'rgba(208,160,96,.05)', bg2:'rgba(208,160,96,.02)',
    tier:'minor',
    alignment:'neutral',
    members:"情报网络遍布天下",
    relations:{
      allies:  ['tangmen','guigu','taohuadao'],
      rivals:  ['riyue','tiandibang'],
      enemies: ['xuegu'],
    },
    sigSkills:['sw_l2','sw04','wi_l1','wi03','qm_l2','qm06'],
    ascii:`
🏯 凌 霄 阁 🏯
 ╭(^‿^)─╮
 │ 剑指天 │
 ╰───────╯
─────────────`,
    asciiArt:`
       🏯 凌 霄 之 巅 🏯
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮         ┃
   ┃  │凌霄阁│  🏯     ┃
   ┃  │     │ 凌云九式┃
   ┃  ╰──┬───╯ 消息天下┃
   ┃  天下第一楼·情报中枢  ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 消息通天下 · 剑指凌霄 ══`,
  },
  {
    id:'qingcheng',
    name:"青城派",
    title:"青城天下幽 · 毒剑天下绝",
    tag:"剑术 | 毒系 | 暗影",
    desc:"四川青城山上的剑派，以青城剑法闻名。门中亦有毒术传承，走的是阴险毒辣的路子，与正道各派关系微妙，在江湖中地位独特。",
    motto:"青城天下幽，毒剑天下绝",
    emblem:'🌿',
    schools:['sword','poison','shadow'],
    color:'#60b060', color2:'#30801a',
    glow:'rgba(96,176,96,.28)', border:'rgba(96,176,96,.18)',
    bg1:'rgba(96,176,96,.05)', bg2:'rgba(96,176,96,.02)',
    tier:'minor',
    alignment:'neutral',
    members:"弟子数百，遍布四川",
    relations:{
      allies:  ['diancang','tangmen'],
      rivals:  ['wudang','huashan'],
      enemies: ['wudu'],
    },
    sigSkills:['sw_l3','sw02','po_l2','po03','sh_l3','sh04'],
    ascii:`
🌿 青 城 🌿
 ╭(·_·)╮
 │青城派│
 ╰──┬──╯
🌿─────🌿`,
    asciiArt:`
       🌿 青 城 山 幽 🌿
   ╭━━━━━━━━━━━━━━━━━━╮
   ┃                    ┃
   ┃  ╭──────╮         ┃
   ┃  │青城派│  🌿     ┃
   ┃  │     │ 毒剑双绝┃
   ┃  ╰──┬───╯ 天下之幽┃
   ┃  常道观·祖师殿·前山   ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 青城天下幽 · 毒剑天下绝 ══`,
  },
];

// ════════════════════════════════════════════════
//  门派被动战斗加成
// ════════════════════════════════════════════════
const SECT_PASSIVE_BONUS = {
  shaolin:   { hp:30, def:5, poisonResist:15,  _desc:'金刚护体' },
  wudang:    { mp:40, dodge:3, counterAtk:4,    _desc:'以柔克刚' },
  xiaoyao:   { spd:3, crit:3, mp:25,            _desc:'逍遥自在' },
  riyue:     { atk:6, crit:5, spd:2,            _desc:'葵花极速' },
  huashan:   { crit:6, spd:2, atk:2,            _desc:'剑气无双' },
  mingjiao:  { atk:5, hp:15, crit:2,            _desc:'圣火焚天' },
  wudu:      { poisonAtk:20, poisonResist:25, hp:10, _desc:'百毒不侵' },
  tangmen:   { crit:8, spd:4,                   _desc:'暗器百步' },
  taohuadao: { mp:30, hp:20, cureBonus:10,      _desc:'玉箫音波' },
  emei:      { mp:35, cureBonus:12, dodge:2,    _desc:'峨眉九阳' },
  kongtong:  { atk:7, def:3, hp:10,             _desc:'七伤绝技' },
  kunlun:    { def:6, hp:25, atk:2,             _desc:'昆仑金刚' },
  tiandibang:{ atk:6, hp:20,                    _desc:'雷霆万钧' },
  guigu:     { spd:4, crit:4,                   _desc:'算无遗策' },
  shengguang:{ hp:20, cureBonus:15, def:3,     _desc:'圣光庇佑' },
  diancang:  { atk:3, spd:3, poisonAtk:10,     _desc:'苍山剑气' },
  tianshan:  { def:5, mp:25, iceResist:15,      _desc:'天山冰心' },
  xixia:     { def:4, crit:3, spd:2,            _desc:'西域秘术' },
  tianlong:  { hp:35, def:5, atk:2,             _desc:'龙象般若' },
  nangong:   { atk:4, def:4, cureBonus:5,       _desc:'世家剑典' },
  xuanming:  { atk:4, iceAtk:15, iceResist:10,  _desc:'玄冥寒掌' },
  haisha:    { atk:5, def:2, spd:3,             _desc:'七杀刀法' },
  xuegu:     { atk:8, hp:10,                    _desc:'血炼大法' },
  lingxiao:  { spd:5, crit:3,                   _desc:'凌霄九式' },
  qingcheng: { atk:3, poisonAtk:12, spd:2,     _desc:'毒剑双绝' },
};

// 获取玩家的门派被动加成（返回扁平对象或空对象）
function getSectPassiveBonus(sectId){
  if(!sectId) return {};
  if(typeof sectId === 'object') sectId = (sectId.sect || null);
  let base = SECT_PASSIVE_BONUS[sectId] || {};
  if(typeof edS !== 'undefined' && edS.sectRank){
    const rankMult = SECT_RANK_CFG[edS.sectRank]?.mult || 1;
    if(rankMult > 1){
      const scaled = {};
      for(const [k,v] of Object.entries(base)){
        if(k.startsWith('_')) continue;
        if(['crit','dodge','poisonAtk','poisonResist','iceAtk','iceResist','cureBonus','counterAtk'].includes(k)){
          scaled[k] = v + Math.round(v * (rankMult - 1) * 0.5);
        } else {
          scaled[k] = Math.round(v * rankMult);
        }
      }
      scaled._desc = base._desc + '·' + (SECT_RANK_CFG[edS.sectRank]?.name||'');
      base = scaled;
    }
  }
  return base;
}

// ════════════════════════════════════════════════
//  门派阶级系统
// ════════════════════════════════════════════════
const SECT_RANKS = ['disciple', 'elite', 'elder', 'grand', 'grandmaster'];
const SECT_RANK_CFG = {
  disciple:    { name:'弟子',   icon:'📜', minContrib:0,    mult:1.0,  title:null },
  elite:       { name:'精英',   icon:'⚔',  minContrib:80,   mult:1.15, title:'门派精英' },
  elder:       { name:'长老',   icon:'🏅',  minContrib:250,  mult:1.30, title:'门派长老' },
  grand:       { name:'元老',   icon:'👑',  minContrib:600,  mult:1.50, title:'门派元老' },
  grandmaster: { name:'掌门',   icon:'🏯',  minContrib:1000, mult:2.0,  title:'门派掌门' },
};

function calcSectRank(contrib){
  contrib = contrib || 0;
  if(contrib >= SECT_RANK_CFG.grand.minContrib)  return 'grand';
  if(contrib >= SECT_RANK_CFG.elder.minContrib)  return 'elder';
  if(contrib >= SECT_RANK_CFG.elite.minContrib)  return 'elite';
  return 'disciple';
}

function checkSectRankUp(edSObj){
  if(!edSObj || !edSObj.sect) return false;
  const oldRank = edSObj.sectRank || 'disciple';
  const newRank = calcSectRank(edSObj.sectContrib || 0);
  if(oldRank === newRank) return false;
  edSObj.sectRank = newRank;
  return true;
}

// ════════════════════════════════════════════════
//  门派被动加成渲染
// ════════════════════════════════════════════════
function _renderSectPassiveBonus(sectId, isJoined){
  const sb = SECT_PASSIVE_BONUS[sectId];
  if(!sb) return '';
  const desc = sb._desc || '门派加成';
  const parts = [];
  if(sb.hp)           parts.push(`❤气血+${sb.hp}`);
  if(sb.atk)          parts.push(`⚔攻击+${sb.atk}`);
  if(sb.def)          parts.push(`🛡防御+${sb.def}`);
  if(sb.mp)           parts.push(`💙内力+${sb.mp}`);
  if(sb.crit)         parts.push(`🎯暴击+${sb.crit}%`);
  if(sb.dodge)        parts.push(`💨闪避+${sb.dodge}%`);
  if(sb.spd)          parts.push(`⚡速度+${sb.spd}`);
  if(sb.poisonAtk)    parts.push(`🐍毒攻+${sb.poisonAtk}%`);
  if(sb.poisonResist) parts.push(`💚抗毒+${sb.poisonResist}%`);
  if(sb.iceAtk)       parts.push(`❄冰攻+${sb.iceAtk}%`);
  if(sb.iceResist)    parts.push(`🧊抗冰+${sb.iceResist}%`);
  if(sb.cureBonus)    parts.push(`💖疗效+${sb.cureBonus}%`);
  if(sb.counterAtk)   parts.push(`⚔反击+${sb.counterAtk}`);
  if(!parts.length) return '';
  const activeStyle = isJoined
    ? `background:${(SECTS.find(s=>s.id===sectId)||{}).color||'#80e880'}18;border:1px solid rgba(128,232,128,.25);color:#80e880`
    : '';
  return `
    <div style="margin-top:10px;padding:8px 10px;background:rgba(240,210,100,.05);border:1px dashed rgba(240,200,80,.15);border-radius:6px;${activeStyle}">
      <div style="font-size:10px;color:#e0c060;letter-spacing:1px;margin-bottom:4px">▸ 被动加成 · ${desc} ${isJoined ? '✅已激活' : ''}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px 10px;font-size:11px;color:#d0b070">${parts.map(p=>`<span>${p}</span>`).join('')}</div>
    </div>`;
}

// ════════════════════════════════════════════════
//  门派关系网渲染
// ════════════════════════════════════════════════
function renderSectRelations(sect){
  if(!sect.relations) return '';
  const rel = sect.relations;
  const getSectName = id => {
    const s = SECTS.find(x => x.id === id);
    return s ? s.name : id;
  };
  const hasDynamic = typeof swGetRelation === 'function';
  const REL_LEVEL = [
    { min: 80,  label:'生死之交', icon:'❤',  color:'#ff6090' },
    { min: 50,  label:'亲密盟友', icon:'🤝',  color:'#60d0a0' },
    { min: 20,  label:'友好',     icon:'😊',  color:'#60d060' },
    { min: -20, label:'冷淡',     icon:'😐',  color:'#b0b0b0' },
    { min: -50, label:'敌视',     icon:'😠',  color:'#ff8040' },
    { min: -80, label:'死敌',     icon:'💀',  color:'#ff4040' },
    { min:-999, label:'不共戴天', icon:'🔥',  color:'#ff0040' },
  ];
  function getRelLevel(val){
    for(var i=0;i<REL_LEVEL.length;i++){
      if(val >= REL_LEVEL[i].min) return REL_LEVEL[i];
    }
    return REL_LEVEL[REL_LEVEL.length-1];
  }
  function relBarHtml(val){
    if(!hasDynamic) return '';
    var pct = Math.max(0,Math.min(100,(val+100)/2));
    var barColor = val >= 20 ? '#60d060' : val >= -20 ? '#b0b0b0' : '#ff6060';
    return '<div style="width:50px;height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin-left:4px">' +
      '<div style="width:'+pct+'%;height:100%;background:'+barColor+';border-radius:3px;transition:width .3s"></div></div>';
  }
  var allRelatedIds = [];
  if(rel.allies)  allRelatedIds = allRelatedIds.concat(rel.allies);
  if(rel.rivals)  allRelatedIds = allRelatedIds.concat(rel.rivals);
  if(rel.enemies) allRelatedIds = allRelatedIds.concat(rel.enemies);
  var parts = [];
  if(rel.allies && rel.allies.length){
    var tags = rel.allies.map(id=>{
      var val = hasDynamic ? swGetRelation(sect.id, id) : 0;
      var lv = getRelLevel(val);
      return '<span style="color:#60d060;border:1px solid #60d06044;background:#60d0600d;padding:2px 6px;border-radius:5px;font-size:10px;display:inline-flex;align-items:center;gap:3px">' +
        (hasDynamic ? lv.icon : '') + getSectName(id) + (hasDynamic ? '<span style="color:'+lv.color+';font-size:9px;opacity:.8">'+val+'</span>' : '') +
        '</span>';
    }).join(' ');
    parts.push('<div style="margin-top:8px"><span style="font-size:10px;color:#60d060;opacity:.7">🤝 盟友 </span>' + tags + '</div>');
  }
  if(rel.rivals && rel.rivals.length){
    var tags = rel.rivals.map(id=>{
      var val = hasDynamic ? swGetRelation(sect.id, id) : 0;
      var lv = getRelLevel(val);
      return '<span style="color:#ffaa40;border:1px solid #ffaa4044;background:#ffaa400d;padding:2px 6px;border-radius:5px;font-size:10px;display:inline-flex;align-items:center;gap:3px">' +
        (hasDynamic ? lv.icon : '') + getSectName(id) + (hasDynamic ? '<span style="color:'+lv.color+';font-size:9px;opacity:.8">'+val+'</span>' : '') +
        '</span>';
    }).join(' ');
    parts.push('<div style="margin-top:4px"><span style="font-size:10px;color:#ffaa40;opacity:.7">⚡ 对头 </span>' + tags + '</div>');
  }
  if(rel.enemies && rel.enemies.length){
    var tags = rel.enemies.map(id=>{
      var val = hasDynamic ? swGetRelation(sect.id, id) : 0;
      var lv = getRelLevel(val);
      return '<span style="color:#ff6060;border:1px solid #ff606044;background:#ff60600d;padding:2px 6px;border-radius:5px;font-size:10px;display:inline-flex;align-items:center;gap:3px">' +
        (hasDynamic ? lv.icon : '') + getSectName(id) + (hasDynamic ? '<span style="color:'+lv.color+';font-size:9px;opacity:.8">'+val+'</span>' : '') +
        '</span>';
    }).join(' ');
    parts.push('<div style="margin-top:4px"><span style="font-size:10px;color:#ff6060;opacity:.7">☠ 死敌 </span>' + tags + '</div>');
  }
  if(hasDynamic && allRelatedIds.length > 0){
    var detailParts = allRelatedIds.map(function(id){
      var val = swGetRelation(sect.id, id);
      var lv = getRelLevel(val);
      var pct = Math.max(0,Math.min(100,(val+100)/2));
      var barColor = val >= 50 ? '#60d0a0' : val >= 20 ? '#60d060' : val >= -20 ? '#b0b0b0' : val >= -50 ? '#ff8040' : '#ff4040';
      return '<div style="display:flex;align-items:center;gap:6px;margin-top:4px">' +
        '<span style="width:48px;font-size:10px;color:rgba(220,210,190,.8);text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + getSectName(id) + '</span>' +
        '<div style="flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden">' +
          '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,'+barColor+'88,'+barColor+');border-radius:3px;transition:width .3s"></div>' +
        '</div>' +
        '<span style="width:16px;text-align:center;font-size:9px">' + lv.icon + '</span>' +
        '<span style="width:28px;font-size:10px;color:'+lv.color+';text-align:right">' + val + '</span>' +
      '</div>';
    }).join('');
    parts.push(
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)">' +
        '<div style="font-size:10px;color:rgba(200,170,100,.5);letter-spacing:1px;margin-bottom:4px">▸ 动态好感</div>' +
        detailParts +
        '<div style="font-size:9px;color:var(--text3);margin-top:6px;opacity:.6">好感值受门派事件和战争影响，-100~+100</div>' +
      '</div>'
    );
  }
  if(!parts.length) return '';
  return '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)">' +
    '<div style="font-size:10px;color:rgba(200,170,100,.5);letter-spacing:1px;margin-bottom:2px">▸ 江湖恩怨</div>' +
    parts.join('') +
  '</div>';
}

// ════════════════════════════════════════════════
//  门派贡献商店配置（完整版）
// ════════════════════════════════════════════════
const SECT_CONTRIB_SHOP = {
  // ════════════════════
  //  超级门派
  // ════════════════════
  shaolin: {
    items: [
      { id:'cs_s_frag',    icon:'📜', name:"罗汉拳残本",      desc:"少林七十二绝技残卷·两式",   cost:30,  type:'manual', manualId:'m_bd_partial1',  reqLv:15 },
      { id:'cs_s_compl',   icon:'📖', name:"金刚经完本",       desc:"完整的金刚护体功法·三式",   cost:80,  type:'manual', manualId:'m_bd_complete1', reqLv:28 },
      { id:'cs_s_med',     icon:'💊', name:"少林疗伤丹",       desc:"快速恢复200气血",           cost:25,  type:'consumable' },
      { id:'cs_s_title',   icon:'🏅', name:"少林弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_s_costume', icon:'🟠', name:"少林僧袍",         desc:"门派专属服饰·防御优异",     cost:150, type:'costume', costumeId:'cs_shaolin',  reqLv:5 },
    ]
  },
  wudang: {
    items: [
      { id:'cs_w_frag',    icon:'📜', name:"道门心法残本",     desc:"道门内功心法·两式",         cost:30,  type:'manual', manualId:'m_ta_partial1',  reqLv:14 },
      { id:'cs_w_compl',   icon:'📖', name:"玄真道经完本",     desc:"道家内功完整典籍·三式",     cost:80,  type:'manual', manualId:'m_ta_complete1', reqLv:26 },
      { id:'cs_w_med',     icon:'💊', name:"武当回气丹",        desc:"快速恢复150内力",            cost:25,  type:'consumable' },
      { id:'cs_w_title',   icon:'🏅', name:"武当弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_w_costume', icon:'🔵', name:"武当道袍",          desc:"门派专属服饰·内力提升",     cost:150, type:'costume', costumeId:'cs_wudang',   reqLv:5 },
    ]
  },
  xiaoyao: {
    items: [
      { id:'cs_x_med',     icon:'💊', name:"逍遥归元丹",        desc:"快速恢复200气血",            cost:25,  type:'consumable' },
      { id:'cs_x_title',   icon:'🏅', name:"逍遥弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_x_costume', icon:'🟢', name:"逍遥仙衣",          desc:"门派专属服饰·闪避优异",     cost:150, type:'costume', costumeId:'cs_xiaoyao',  reqLv:5 },
    ]
  },
  riyue: {
    items: [
      { id:'cs_r_med',     icon:'🔥', name:"神教疗伤丹",        desc:"快速恢复200气血",            cost:25,  type:'consumable' },
      { id:'cs_r_title',   icon:'🏅', name:"日月弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_r_costume', icon:'🟠', name:"神教黑袍",          desc:"门派专属服饰·火冰双修",     cost:150, type:'costume', costumeId:'cs_riyue',    reqLv:5 },
    ]
  },

  // ════════════════════
  //  大型门派
  // ════════════════════
  huashan: {
    items: [
      { id:'cs_h_frag',    icon:'📜', name:"剑宗秘要残本",     desc:"剑宗流传入门功法·两式",     cost:30,  type:'manual', manualId:'m_sw_partial1',  reqLv:12 },
      { id:'cs_h_compl',   icon:'📖', name:"御风剑典完本",     desc:"完整剑法典籍·三式进阶",     cost:80,  type:'manual', manualId:'m_sw_complete1', reqLv:25 },
      { id:'cs_h_med',     icon:'💊', name:"华山续命丹",        desc:"快速恢复气血200",            cost:25,  type:'consumable' },
      { id:'cs_h_title',   icon:'🏅', name:"华山弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_h_costume', icon:'🩵', name:"华山剑客袍",       desc:"门派专属服饰·剑系加成",     cost:150, type:'costume', costumeId:'cs_huashan',  reqLv:5 },
    ]
  },
  mingjiao: {
    items: [
      { id:'cs_m_med',     icon:'💊', name:"明教烈火丹",        desc:"快速恢复气血180",            cost:25,  type:'consumable' },
      { id:'cs_m_title',   icon:'🏅', name:"明教弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_m_costume', icon:'🔥', name:"明教烈焰袍",        desc:"门派专属服饰·火系精通",     cost:150, type:'costume', costumeId:'cs_mingjiao', reqLv:5 },
    ]
  },
  wudu: {
    items: [
      { id:'cs_wd_med',    icon:'🐍', name:"五毒疗伤丹",        desc:"快速恢复气血180",            cost:25,  type:'consumable' },
      { id:'cs_wd_title',  icon:'🏅', name:"五毒弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_wd_costume',icon:'🟢', name:"五毒教袍",          desc:"门派专属服饰·毒系精通",     cost:150, type:'costume', costumeId:'cs_wudu',    reqLv:5 },
    ]
  },
  tangmen: {
    items: [
      { id:'cs_t_frag',    icon:'📜', name:"影刺残本",          desc:"影杀门暗刺功法·两式",       cost:30,  type:'manual', manualId:'m_sh_partial1',  reqLv:16 },
      { id:'cs_t_compl',   icon:'📖', name:"鬼影步法完本",      desc:"鬼魅身法完整教程·三式",     cost:80,  type:'manual', manualId:'m_sh_complete1', reqLv:28 },
      { id:'cs_t_med',     icon:'💊', name:"唐门解毒丸",        desc:"解除中毒状态",               cost:25,  type:'consumable' },
      { id:'cs_t_title',   icon:'🏅', name:"唐门弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_t_costume', icon:'🖤', name:"唐门暗器服",        desc:"门派专属服饰·暗器精通",     cost:150, type:'costume', costumeId:'cs_tangmen',  reqLv:5 },
    ]
  },
  taohuadao: {
    items: [
      { id:'cs_th_med',    icon:'🍶', name:"桃花玉露丸",        desc:"快速恢复180气血/内力",      cost:25,  type:'consumable' },
      { id:'cs_th_title',  icon:'🏅', name:"桃花弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_th_costume',icon:'🏷', name:"桃花仙子裙",       desc:"门派专属服饰·冰琴双修",     cost:150, type:'costume', costumeId:'cs_taohuadao', reqLv:5 },
    ]
  },
  emei: {
    items: [
      { id:'cs_e_med',     icon:'💊', name:"峨眉回春丹",        desc:"快速恢复180气血",            cost:25,  type:'consumable' },
      { id:'cs_e_title',   icon:'🏅', name:"峨眉弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_e_costume', icon:'⚪', name:"峨眉素裳",          desc:"门派专属服饰·圣系精通",     cost:150, type:'costume', costumeId:'cs_emei',    reqLv:5 },
    ]
  },
  kongtong: {
    items: [
      { id:'cs_k_med',     icon:'💊', name:"崆峒续筋丹",        desc:"快速恢复气血180",            cost:25,  type:'consumable' },
      { id:'cs_k_title',   icon:'🏅', name:"崆峒弟子称谓",     desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_k_costume', icon:'🟤', name:"崆峒铁布衫",        desc:"门派专属服饰·防御卓绝",     cost:150, type:'costume', costumeId:'cs_kongtong', reqLv:5 },
    ]
  },
  kunlun: {
    items: [
      { id:'cs_ku_med',    icon:'💊', name:"昆仑养气丹",        desc:"快速恢复150内力",            cost:25,  type:'consumable' },
      { id:'cs_ku_title',  icon:'🏅', name:"昆仑弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_ku_costume',icon:'❄️', name:"昆仑雪羽衣",         desc:"门派专属服饰·冰系精通",     cost:150, type:'costume', costumeId:'cs_kunlun',  reqLv:5 },
    ]
  },

  // ════════════════════
  //  新兴势力
  // ════════════════════
  tiandibang: {
    items: [
      { id:'cs_td_med',    icon:'💊', name:"帮派疗伤丹",       desc:"快速恢复气血180",            cost:25,  type:'consumable' },
      { id:'cs_td_title',  icon:'🏅', name:"天地帮众称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_td_costume',icon:'⚫', name:"天地帮战甲",         desc:"门派专属服饰·力雷双修",     cost:150, type:'costume', costumeId:'cs_tiandibang', reqLv:5 },
    ]
  },
  guigu: {
    items: [
      { id:'cs_gg_med',    icon:'💊', name:"鬼谷养神丹",        desc:"快速恢复200内力",            cost:25,  type:'consumable' },
      { id:'cs_gg_title',  icon:'🏅', name:"鬼谷弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_gg_costume',icon:'🔮', name:"鬼谷星象袍",        desc:"门派专属服饰·奇门命修",     cost:150, type:'costume', costumeId:'cs_guigu', reqLv:5 },
    ]
  },
  shengguang: {
    items: [
      { id:'cs_sg_med',    icon:'✨', name:"圣光疗伤丹",        desc:"快速恢复200气血+圣光治疗",   cost:25,  type:'consumable' },
      { id:'cs_sg_title',  icon:'🏅', name:"圣光弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_sg_costume',icon:'⚪', name:"圣光骑士袍",        desc:"门派专属服饰·圣系精通",     cost:150, type:'costume', costumeId:'cs_shengguang', reqLv:5 },
    ]
  },
  diancang: {
    items: [
      { id:'cs_dc_frag',   icon:'📜', name:"蛊毒秘法残本",      desc:"苗疆蛊毒两式绝技",          cost:30,  type:'manual', manualId:'m_po_partial1',  reqLv:17 },
      { id:'cs_dc_med',    icon:'💊', name:"点苍续命丹",        desc:"快速恢复气血180",            cost:25,  type:'consumable' },
      { id:'cs_dc_title',  icon:'🏅', name:"点苍弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_dc_costume',icon:'🎋', name:"点苍剑客袍",        desc:"门派专属服饰·剑毒双修",     cost:150, type:'costume', costumeId:'cs_diancang', reqLv:5 },
    ]
  },
  tianshan: {
    items: [
      { id:'cs_ts_frag',   icon:'📜', name:"天山冰心残卷",     desc:"天山逍遥派冰功入门·两式",   cost:30,  type:'manual', manualId:'m_ic_partial1',  reqLv:16 },
      { id:'cs_ts_med',    icon:'🌸', name:"天山雪莲丸",        desc:"恢复200气血+免疫冰冻",     cost:25,  type:'consumable' },
      { id:'cs_ts_title',  icon:'🏅', name:"天山弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_ts_costume',icon:'🤍', name:"天山雪狐裘",        desc:"门派专属服饰·减速特效",     cost:150, type:'costume', costumeId:'cs_tianshan', reqLv:5 },
    ]
  },
  xixia: {
    items: [
      { id:'cs_xx_med',    icon:'💊', name:"西夏回元丹",        desc:"快速恢复180气血/内力",      cost:25,  type:'consumable' },
      { id:'cs_xx_title',  icon:'🏅', name:"西夏弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_xx_costume',icon:'🟡', name:"西夏密宗袍",        desc:"门派专属服饰·密宗秘法",     cost:150, type:'costume', costumeId:'cs_xixia', reqLv:5 },
    ]
  },
  tianlong: {
    items: [
      { id:'cs_tl_med',    icon:'💊', name:"天龙培元丹",        desc:"快速恢复200气血",            cost:25,  type:'consumable' },
      { id:'cs_tl_title',  icon:'🏅', name:"天龙弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_tl_costume',icon:'🐉', name:"天龙龙袍",           desc:"门派专属服饰·天龙八部",     cost:150, type:'costume', costumeId:'cs_tianlong', reqLv:5 },
    ]
  },
  nangong: {
    items: [
      { id:'cs_ng_med',    icon:'💊', name:"南宫养气丹",        desc:"快速恢复180内力",            cost:25,  type:'consumable' },
      { id:'cs_ng_title',  icon:'🏅', name:"南宫子弟称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_ng_costume',icon:'🏛', name:"南宫世家袍",        desc:"门派专属服饰·剑圣双修",     cost:150, type:'costume', costumeId:'cs_nangong', reqLv:5 },
    ]
  },
  xuanming: {
    items: [
      { id:'cs_xm_med',    icon:'💊', name:"玄冥疗伤丹",        desc:"快速恢复气血180",            cost:25,  type:'consumable' },
      { id:'cs_xm_title',  icon:'🏅', name:"玄冥弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_xm_costume',icon:'⛧', name:"玄冥寒冰袍",        desc:"门派专属服饰·冰毒双修",     cost:150, type:'costume', costumeId:'cs_xuanming', reqLv:5 },
    ]
  },
  haisha: {
    items: [
      { id:'cs_hs_med',    icon:'⚓', name:"海沙疗伤丹",        desc:"快速恢复180气血",            cost:25,  type:'consumable' },
      { id:'cs_hs_title',  icon:'🏅', name:"海沙弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_hs_costume',icon:'🔵', name:"海沙战袍",           desc:"门派专属服饰·力暗双修",     cost:150, type:'costume', costumeId:'cs_haisha', reqLv:5 },
    ]
  },
  xuegu: {
    items: [
      { id:'cs_xg_med',    icon:'💀', name:"血骨疗伤丹",        desc:"快速恢复气血200",            cost:25,  type:'consumable' },
      { id:'cs_xg_title',  icon:'🏅', name:"血骨弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_xg_costume',icon:'🔴', name:"血骨祭袍",           desc:"门派专属服饰·血祭加成",     cost:150, type:'costume', costumeId:'cs_xuegu', reqLv:5 },
    ]
  },
  lingxiao: {
    items: [
      { id:'cs_lx_med',    icon:'💊', name:"凌霄续命丹",        desc:"快速恢复180气血",            cost:25,  type:'consumable' },
      { id:'cs_lx_title',  icon:'🏅', name:"凌霄弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_lx_costume',icon:'🏯', name:"凌霄情报袍",        desc:"门派专属服饰·速度加成",     cost:150, type:'costume', costumeId:'cs_lingxiao', reqLv:5 },
    ]
  },
  qingcheng: {
    items: [
      { id:'cs_qc_med',    icon:'💊', name:"青城疗伤丹",        desc:"快速恢复180气血",            cost:25,  type:'consumable' },
      { id:'cs_qc_title',  icon:'🏅', name:"青城弟子称谓",    desc:"佩戴后身份辨识+10",        cost:15,  type:'title' },
      { id:'cs_qc_costume',icon:'🌿', name:"青城道袍",           desc:"门派专属服饰·剑毒双绝",     cost:150, type:'costume', costumeId:'cs_qingcheng', reqLv:5 },
    ]
  },
};

// ── 渲染贡献商店项目 ──
function _renderSectContribShop(sectId, playerContrib) {
  const shop = SECT_CONTRIB_SHOP[sectId];
  if (!shop || !shop.items || !shop.items.length) return '';
  const edS = (typeof window !== 'undefined' && window.edS) || {};
  const playerLv = edS.level || 1;

  const itemHtml = shop.items.map(item => {
    const locked = playerLv < (item.reqLv || 0);
    const lockedStyle = locked ? 'opacity:.4;cursor:not-allowed' : 'opacity:1;cursor:pointer';
    const canAfford = playerContrib >= item.cost;
    const affordableStyle = !canAfford && !locked ? 'opacity:.5' : '';
    return `
      <div class="cs-item ${locked ? 'cs-locked' : ''}"
        style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(255,255,255,.03);border-radius:6px;margin-bottom:5px;${lockedStyle}${affordableStyle}"
        onclick="${locked ? '' : `window._onSectContribBuy && _onSectContribBuy('${sectId}','${item.id}')`}"
        title="${locked ? `需要 Lv${item.reqLv} 才能购买` : (canAfford ? '点击购买' : '贡献点不足')}"
      >
        <span style="font-size:18px;flex-shrink:0">${item.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;color:#f0d090;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name}${locked ? ' 🔒' : ''}</div>
          <div style="font-size:10px;color:rgba(180,160,120,.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.desc}</div>
        </div>
        <div style="flex-shrink:0;text-align:right">
          <div style="font-size:12px;color:#80e880;font-weight:bold">${item.cost}</div>
          <div style="font-size:9px;color:rgba(180,200,140,.5)">贡献</div>
        </div>
      </div>`;
  }).join('');

  const recallHtml = `
    <div class="cs-item"
      style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(255,100,60,.05);border:1px solid rgba(255,100,60,.15);border-radius:6px;margin-bottom:5px;margin-top:8px;${playerContrib < 10 ? 'opacity:.5;cursor:not-allowed' : 'opacity:1;cursor:pointer'}"
      onclick="window._onSectContribBuy && _onSectContribBuy('${sectId}','item_sect_recall')"
      title="${playerContrib >= 10 ? '点击购买' : '贡献点不足'}"
    >
      <span style="font-size:18px;flex-shrink:0">🏮</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:#ff8866;white-space:nowrap">门派回令</div>
        <div style="font-size:10px;color:rgba(180,160,120,.55);white-space:nowrap">消耗后瞬间传送回本门总舵</div>
      </div>
      <div style="flex-shrink:0;text-align:right">
        <div style="font-size:12px;color:#80e880;font-weight:bold">10</div>
        <div style="font-size:9px;color:rgba(180,200,140,.5)">贡献</div>
      </div>
    </div>`;

  return `
    <div style="margin-top:12px;padding:12px;background:rgba(80,160,80,.06);border:1px solid rgba(80,200,80,.18);border-radius:8px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:12px;color:#80e880;font-weight:bold">⚔ 门派贡献商店</span>
        <span style="font-size:11px;color:#80e880">💰 当前贡献：<b>${playerContrib}</b></span>
      </div>
      <div style="max-height:200px;overflow-y:auto">${itemHtml}${recallHtml}</div>
    </div>`;
}

// ════════════════════════════════════════════════
//  门派志渲染
// ════════════════════════════════════════════════
function renderSectsPage(){
  const grid = document.getElementById('sectsGrid');
  if(!grid) return;
  const edS = (typeof window !== 'undefined' && window.edS) || {};
  const playerSect = edS.sect || null;
  const playerLevel = edS.level || 1;
  const playerContrib = edS.sectContrib || 0;
  grid.innerHTML = SECTS.map(sect=>{
    const sigHtml = (sect.sigSkills||[]).map(id=>{
      const sk=getSkill(id);
      return sk ? `<span class="sect-sig-sk">${sk.icon}${sk.name}</span>` : '';
    }).join('');
    const schoolHtml = sect.schools.map(k=>{
      const sc=SK_SCHOOL_INFO[k];
      return sc ? `<span class="sect-school-tag" style="color:${sc.color};border-color:${sc.color}44;background:${sc.color}0d">${sc.label}</span>` : '';
    }).join('');
    const tierLabel = {supreme:'✦ 超级门派',major:'◆ 大型门派',minor:'◇ 新兴势力'}[sect.tier]||'';
    const alignLabel = {
      righteous: '⚖ 正道',
      neutral:   '〇 中立',
      chaotic:   '⚡ 混乱',
      evil:      '☠ 邪道',
    }[sect.alignment||'neutral']||'〇 中立';
    const alignColor = {
      righteous:'#80d0ff', neutral:'#888', chaotic:'#ffaa40', evil:'#ff6060'
    }[sect.alignment||'neutral']||'#888';

    const isJoined = (playerSect === sect.id);
    const joinBtnHtml = (function(){
      if(isJoined){
        return `<div class="sect-join-btn sect-joined" style="border-color:${sect.color}88;background:${sect.color}15;color:${sect.color}"
          onclick="event.stopPropagation();window._onSectLeaveClick && _onSectLeaveClick('${sect.id}')"
          onmouseover="this.style.background='${sect.color}25';this.style.cursor='pointer';this.querySelector('.leave-hint').style.opacity='1'"
          onmouseout="this.style.background='${sect.color}15';this.style.cursor='default';this.querySelector('.leave-hint').style.opacity='0'">
          ✦ 已加入 · 弟子
          <span class="leave-hint" style="font-size:10px;opacity:0;transition:opacity .2s;margin-left:6px;text-decoration:underline">退出</span>
        </div>`;
      }
      const trialLabel = {
        supreme:'【三关试炼】',
        major:  '【切磋考验】',
        minor:  '【入门试炼】'
      }[sect.tier] || '【试炼】';
      return `<div class="sect-join-btn" onclick="event.stopPropagation();window._onSectJoinClick && _onSectJoinClick('${sect.id}')"
        style="border-color:${sect.color}66;background:linear-gradient(135deg,${sect.color}18,${sect.color2 || sect.color}08);color:${sect.color};cursor:pointer"
        onmouseover="this.style.background='linear-gradient(135deg,${sect.color}35,${sect.color2 || sect.color}20)';this.style.boxShadow='0 0 16px ${sect.glow}'"
        onmouseout="this.style.background='linear-gradient(135deg,${sect.color}18,${sect.color2 || sect.color}08)';this.style.boxShadow='none'"
      >📜 ${trialLabel} 申请加入</div>`;
    })();

    return `<div class="sect-card" data-tier="${sect.tier}" data-sect-id="${sect.id}"
      style="--sc-color:${sect.color};--sc-color2:${sect.color2};--sc-glow:${sect.glow};--sc-border:${sect.border};--sc-bg1:${sect.bg1};--sc-bg2:${sect.bg2}">
      <div class="sect-card-topbar"></div>
      <div class="sect-banner">
        <div class="sect-emblem">${sect.emblem}</div>
        <div class="sect-info">
          <div class="sect-name">${sect.name}</div>
          <div class="sect-title">${sect.title}</div>
          <div class="sect-tag">${sect.tag}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;align-self:flex-start;margin-top:2px">
          <div style="font-size:9px;color:rgba(180,140,60,.3);letter-spacing:1px">${tierLabel}</div>
          <div style="font-size:9px;color:${alignColor};letter-spacing:1px;opacity:.7">${alignLabel}</div>
        </div>
      </div>
      <div class="sect-body">
        <div class="sect-desc">${sect.desc}</div>
        <div class="sect-schools-label">▸ 修炼功法系别</div>
        <div class="sect-schools">${schoolHtml}</div>
        ${sigHtml?`<div class="sect-schools-label" style="margin-top:10px">▸ 代表绝学</div><div class="sect-sig-skills">${sigHtml}</div>`:''}
        ${_renderSectPassiveBonus(sect.id, isJoined)}
        ${renderSectRelations(sect)}
      </div>
      <div class="sect-footer">
        <div class="sect-members">⚔ ${sect.members}</div>
        <div class="sect-motto">「${sect.motto}」</div>
      </div>
      <div class="sect-join-area">${joinBtnHtml}</div>
      ${isJoined ? _renderSectContribShop(sect.id, playerContrib) : ''}
    </div>`;
  }).join('');
}

// ── 门派加入点击回调 ──
window._onSectJoinClick = function(sectId) {
  console.log('[SectTrial] _onSectJoinClick called with sectId:', sectId);
  if(typeof window._doSectTrial === 'function'){
    window._doSectTrial(sectId);
  } else {
    console.error('[SectTrial] _doSectTrial function not found!');
    showToast('门派系统加载中...', 'warn');
  }
};

// ════════════════════════════════════════════════════════════════════════════
//  门派试炼系统
// ════════════════════════════════════════════════════════════════════════════
const _SECT_TRIAL_OPPONENTS = {
  supreme: [
    { name:'入门弟子', level:8,  title:'第一关·外门弟子', desc:'考验基本功', power:0.3 },
    { name:'内门弟子', level:15, title:'第二关·内门精英', desc:'考验武学修为', power:0.5 },
    { name:'守关长老', level:25, title:'第三关·长老考验', desc:'考验综合实力', power:0.75 },
  ],
  major: [
    { name:'门派弟子', level:10, title:'第一关·入门考核', desc:'基础武学测试', power:0.35 },
    { name:'门派师兄', level:18, title:'第二关·师兄切磋', desc:'进阶武学考验', power:0.6 },
  ],
  minor: [
    { name:'门派教习', level:8,  title:'入门试炼', desc:'基础考核', power:0.3 },
  ],
};

function _getSectTrialOpponents(sectId) {
  const sect = SECTS.find(s => s.id === sectId);
  if (!sect) return [];
  const tier = sect.tier || 'minor';
  const baseOpponents = _SECT_TRIAL_OPPONENTS[tier] || _SECT_TRIAL_OPPONENTS.minor;
  const ed = window.edS || {};
  const playerLv = ed.level || 1;
  return baseOpponents.map((opp, index) => ({
    ...opp,
    index: index + 1,
    level: Math.max(opp.level, Math.floor(opp.level + playerLv * 0.1)),
    combatPower: Math.floor(100 * opp.power * (Math.max(opp.level, Math.floor(opp.level + playerLv * 0.1)) / opp.level)),
  }));
}

function _calcTrialWinRate(playerLv, opponentLv, opponentPower) {
  let winRate = 0.5 + ((playerLv - opponentLv) / opponentLv) * 0.15 - opponentPower * 0.3;
  return Math.max(0.15, Math.min(0.85, winRate));
}

window._doSectTrial = function(sectId) {
  const sect = SECTS.find(s => s.id === sectId);
  if (!sect) { showToast('门派数据加载中...', 'warn'); return; }
  const ed = window.edS || {};
  if (ed.sect) { showToast('你已加入门派！', 'info'); return; }
  const opponents = _getSectTrialOpponents(sectId);
  if (opponents.length === 0) { showToast('试炼配置加载中...', 'warn'); return; }
  window._currentSectTrial = {
    sectId: sectId,
    sectName: sect.name || sectId,
    sectColor: sect.color || '#ffffff',
    tier: sect.tier || 'minor',
    currentOpponent: 0,
    opponents: opponents,
    wins: 0,
  };
  _showSectTrialDialog(sectId, sect, opponents);
};

function _showSectTrialDialog(sectId, sect, opponents) {
  const trial = window._currentSectTrial;
  const ed = window.edS || {};
  const playerLv = ed.level || 1;
  const trialNames = { supreme: '三关试炼', major: '切磋考验', minor: '入门试炼' };
  const trialName = trialNames[sect.tier] || '试炼';
  const opponentHtml = opponents.map((opp, i) => {
    const winRate = _calcTrialWinRate(playerLv, opp.level, opp.power);
    const winPercent = Math.round(winRate * 100);
    const winColor = winPercent > 60 ? '#80e880' : (winPercent > 40 ? '#e0d060' : '#ff8080');
    return `<div style="display:flex;align-items:center;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;margin-bottom:8px">
      <div style="width:32px;height:32px;background:${sect.color}30;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;margin-right:12px">⚔</div>
      <div style="flex:1">
        <div style="font-size:13px;color:#e0d0b0;font-weight:bold">${opp.name}</div>
        <div style="font-size:11px;color:rgba(200,180,160,.6)">Lv.${opp.level} · ${opp.desc}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:${winColor};font-weight:bold">胜率 ${winPercent}%</div>
      </div>
    </div>`;
  }).join('');
  const html = `<div id="sectTrialOverlay" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);animation:fadeIn .2s ease">
    <div style="width:min(480px,92vw);max-height:85vh;overflow-y:auto;border-radius:16px;background:linear-gradient(170deg,#1a1520,#0d0a10);border:1px solid ${sect.color}40;box-shadow:0 0 60px rgba(0,0,0,.8),0 0 30px ${sect.color}15;animation:slideUp .25s ease">
      <div style="padding:20px 24px 16px;text-align:center;background:linear-gradient(180deg,${sect.color}12,transparent);border-bottom:1px solid rgba(255,255,255,.05)">
        <div style="font-size:22px;margin-bottom:6px">🏛️ ${sect.name || sectId}</div>
        <div style="font-size:14px;color:${sect.color};letter-spacing:3px;font-weight:bold">${trialName}</div>
        <div style="font-size:11px;color:rgba(200,180,160,.5);margin-top:4px">玩家等级：Lv.${playerLv}</div>
      </div>
      <div style="padding:16px 20px">
        <div style="font-size:12px;color:rgba(200,180,160,.6);margin-bottom:12px;letter-spacing:1px">试炼对手</div>
        <div style="border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px;background:rgba(0,0,0,.2)">${opponentHtml}</div>
      </div>
      <div style="padding:0 20px 16px">
        <div style="font-size:11px;color:rgba(200,180,160,.5);line-height:1.7;text-align:center">试炼共 ${opponents.length} 关，击败所有对手即可加入门派<br>失败可重新挑战</div>
      </div>
      <div style="padding:12px 20px 20px;display:flex;gap:12px;justify-content:center">
        <button onclick="document.getElementById('sectTrialOverlay').remove();delete window._currentSectTrial" style="flex:1;padding:12px 20px;border-radius:10px;border:1px solid rgba(200,180,140,.25);background:rgba(200,180,140,.06);color:rgba(200,180,140,.7);font-size:13px;cursor:pointer;letter-spacing:1px">返回</button>
        <button onclick="_startSectTrialBattle()" style="flex:2;padding:12px 20px;border-radius:10px;border:1px solid ${sect.color}60;background:linear-gradient(135deg,${sect.color}30,${sect.color}15);color:${sect.color};font-size:13px;font-weight:bold;cursor:pointer;letter-spacing:1px;box-shadow:0 0 20px ${sect.color}20">⚔️ 开始试炼</button>
      </div>
    </div>
  </div>`;
  if (!document.getElementById('sectTrialStyles')) {
    const style = document.createElement('style');
    style.id = 'sectTrialStyles';
    style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);
  }
  const existing = document.getElementById('sectTrialOverlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function _startSectTrialBattle() {
  const trial = window._currentSectTrial;
  if (!trial) { showToast('试炼状态异常', 'error'); return; }
  const opponent = trial.opponents[trial.currentOpponent];
  if (!opponent) { showToast('对手数据异常', 'error'); return; }
  const overlay = document.getElementById('sectTrialOverlay');
  if (overlay) overlay.remove();
  const ed = window.edS || {};
  const playerLv = ed.level || 1;
  const winRate = _calcTrialWinRate(playerLv, opponent.level, opponent.power);
  const won = Math.random() < winRate;
  window._pendingSectTrialResult = { won, opponent };
  _showSectTrialBattleResult(trial, opponent, won, winRate);
}

function _showSectTrialBattleResult(trial, opponent, won, winRate) {
  const sect = SECTS.find(s => s.id === trial.sectId);
  const sectColor = sect ? sect.color : '#ffffff';
  const html = `<div id="sectTrialResultOverlay" style="position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.8);backdrop-filter:blur(6px);animation:fadeIn .3s ease">
    <div style="width:min(420px,90vw);border-radius:16px;background:linear-gradient(170deg,#1a1520,#0d0a10);border:1px solid ${won ? '#80e88050' : '#ff606050'};box-shadow:0 0 60px rgba(0,0,0,.8);animation:slideUp .3s ease">
      <div style="padding:28px 24px 20px;text-align:center">
        <div style="font-size:56px;margin-bottom:12px">${won ? '🏆' : '💫'}</div>
        <div style="font-size:18px;color:${won ? '#80e880' : '#ff8888'};font-weight:bold;letter-spacing:3px;margin-bottom:8px">${won ? '挑战成功！' : '挑战失败'}</div>
        <div style="font-size:13px;color:rgba(200,180,160,.7);line-height:1.7">${won ? `你击败了「${opponent.name}」！<br>继续下一关试炼吧！` : `你惜败于「${opponent.name}」...<br>胜率只有 ${Math.round(winRate * 100)}%，多修炼后再来吧。`}</div>
      </div>
      <div style="padding:0 24px 20px;text-align:center">
        <div style="display:inline-flex;align-items:center;gap:16px;padding:12px 20px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06)">
          <span style="font-size:28px">⚔</span>
          <div style="text-align:left">
            <div style="font-size:14px;color:#e0d0b0;font-weight:bold">${opponent.name}</div>
            <div style="font-size:11px;color:rgba(200,180,160,.5)">Lv.${opponent.level} · ${opponent.title}</div>
          </div>
        </div>
      </div>
      <div style="padding:8px 24px 24px;display:flex;gap:12px;justify-content:center">
        ${won ? `<button onclick="_continueSectTrial()" style="flex:1;padding:14px 24px;border-radius:12px;border:1px solid ${sectColor}60;background:linear-gradient(135deg,${sectColor}35,${sectColor}18);color:${sectColor};font-size:14px;font-weight:bold;cursor:pointer;letter-spacing:1px;box-shadow:0 0 25px ${sectColor}25">继续挑战 ${trial.currentOpponent + 2}/${trial.opponents.length} ⚔️</button>` : `<button onclick="_retrySectTrial()" style="flex:1;padding:14px 24px;border-radius:12px;border:1px solid #e0d06060;background:linear-gradient(135deg,#e0d06025,#e0d06010);color:#e0d060;font-size:14px;font-weight:bold;cursor:pointer;letter-spacing:1px">🔄 重新挑战</button>`}
        <button onclick="_cancelSectTrial()" style="padding:14px 20px;border-radius:12px;border:1px solid rgba(200,180,140,.2);background:rgba(200,180,140,.05);color:rgba(200,180,140,.6);font-size:13px;cursor:pointer">返回</button>
      </div>
    </div>
  </div>`;
  const existing = document.getElementById('sectTrialResultOverlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function _continueSectTrial() {
  const trial = window._currentSectTrial;
  if (!trial) { showToast('试炼状态异常', 'error'); return; }
  trial.currentOpponent++;
  trial.wins++;
  const resultOverlay = document.getElementById('sectTrialResultOverlay');
  if (resultOverlay) resultOverlay.remove();
  if (trial.currentOpponent >= trial.opponents.length) {
    _completeSectTrialSuccess(trial);
  } else {
    const opponent = trial.opponents[trial.currentOpponent];
    _showNextTrialDialog(trial, opponent);
  }
}

function _showNextTrialDialog(trial, opponent) {
  const sect = SECTS.find(s => s.id === trial.sectId);
  const sectColor = sect ? sect.color : '#ffffff';
  const ed = window.edS || {};
  const playerLv = ed.level || 1;
  const winRate = _calcTrialWinRate(playerLv, opponent.level, opponent.power);
  const html = `<div id="sectTrialNextOverlay" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.8);backdrop-filter:blur(4px);animation:fadeIn .2s ease">
    <div style="width:min(400px,90vw);border-radius:16px;background:linear-gradient(170deg,#1a1520,#0d0a10);border:1px solid ${sectColor}40;box-shadow:0 0 40px rgba(0,0,0,.7);animation:slideUp .25s ease">
      <div style="padding:24px;text-align:center">
        <div style="font-size:14px;color:rgba(200,180,160,.6);margin-bottom:8px">第 ${trial.currentOpponent} 关完成</div>
        <div style="font-size:22px;color:#80e880;font-weight:bold;margin-bottom:16px">✅ 挑战成功</div>
        <div style="padding:16px;background:rgba(255,255,255,.03);border-radius:12px;margin-bottom:20px">
          <div style="font-size:13px;color:rgba(200,180,160,.5);margin-bottom:12px">下一关对手</div>
          <div style="font-size:18px;color:#e0d0b0;font-weight:bold;margin-bottom:4px">${opponent.name}</div>
          <div style="font-size:12px;color:rgba(200,180,160,.5)">Lv.${opponent.level} · ${opponent.title}</div>
          <div style="margin-top:10px;font-size:13px;color:${winRate > 0.5 ? '#80e880' : (winRate > 0.35 ? '#e0d060' : '#ff8080')}">预估胜率：${Math.round(winRate * 100)}%</div>
        </div>
        <button onclick="_startNextTrialBattle()" style="width:100%;padding:14px;border-radius:12px;border:1px solid ${sectColor}60;background:linear-gradient(135deg,${sectColor}30,${sectColor}15);color:${sectColor};font-size:14px;font-weight:bold;cursor:pointer;letter-spacing:1px">⚔️ 开始第 ${trial.currentOpponent + 1} 关</button>
      </div>
    </div>
  </div>`;
  const existing = document.getElementById('sectTrialNextOverlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function _startNextTrialBattle() {
  const trial = window._currentSectTrial;
  if (!trial) { showToast('试炼状态异常', 'error'); return; }
  const opponent = trial.opponents[trial.currentOpponent];
  if (!opponent) { showToast('对手数据异常', 'error'); return; }
  const nextOverlay = document.getElementById('sectTrialNextOverlay');
  if (nextOverlay) nextOverlay.remove();
  const ed = window.edS || {};
  const playerLv = ed.level || 1;
  const winRate = _calcTrialWinRate(playerLv, opponent.level, opponent.power);
  const won = Math.random() < winRate;
  window._pendingSectTrialResult = { won, opponent };
  _showSectTrialBattleResult(trial, opponent, won, winRate);
}

function _retrySectTrial() {
  const resultOverlay = document.getElementById('sectTrialResultOverlay');
  if (resultOverlay) resultOverlay.remove();
  const trial = window._currentSectTrial;
  if (!trial) return;
  const opponent = trial.opponents[trial.currentOpponent];
  if (!opponent) return;
  const ed = window.edS || {};
  const playerLv = ed.level || 1;
  const winRate = _calcTrialWinRate(playerLv, opponent.level, opponent.power);
  const won = Math.random() < winRate;
  window._pendingSectTrialResult = { won, opponent };
  _showSectTrialBattleResult(trial, opponent, won, winRate);
}

function _cancelSectTrial() {
  ['sectTrialOverlay','sectTrialResultOverlay','sectTrialNextOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  delete window._currentSectTrial;
}

function _completeSectTrialSuccess(trial) {
  const sect = SECTS.find(s => s.id === trial.sectId);
  const sectColor = sect ? sect.color : '#ffffff';
  ['sectTrialResultOverlay','sectTrialNextOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  const html = `<div id="sectTrialSuccessOverlay" style="position:fixed;inset:0;z-index:10002;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);animation:fadeIn .3s ease">
    <div style="width:min(440px,90vw);border-radius:16px;background:linear-gradient(170deg,#1a1520,#0d0a10);border:1px solid ${sectColor}50;box-shadow:0 0 80px ${sectColor}30;animation:slideUp .35s ease;text-align:center">
      <div style="padding:36px 28px 24px">
        <div style="font-size:64px;margin-bottom:16px">🎉</div>
        <div style="font-size:24px;color:${sectColor};font-weight:bold;letter-spacing:4px;margin-bottom:8px">试炼通过！</div>
        <div style="font-size:16px;color:#e0d0b0;font-weight:bold;margin-bottom:6px">${sect ? sect.name : trial.sectId}</div>
        <div style="font-size:13px;color:rgba(200,180,160,.6);line-height:1.7">恭喜你通过了 ${trial.sectName} 的全部 ${trial.opponents.length} 关试炼！<br>现在你已是门派弟子了！</div>
        <div style="margin-top:20px;padding:12px 16px;background:${sectColor}15;border-radius:10px;border:1px solid ${sectColor}30">
          <div style="font-size:11px;color:${sectColor};letter-spacing:1px">✦ 获得门派身份</div>
        </div>
      </div>
      <div style="padding:8px 28px 28px">
        <button onclick="_onSectJoinSuccess('${trial.sectId}')" style="width:100%;padding:14px;border-radius:12px;border:1px solid ${sectColor}60;background:linear-gradient(135deg,${sectColor}35,${sectColor}18);color:${sectColor};font-size:15px;font-weight:bold;cursor:pointer;letter-spacing:2px;box-shadow:0 0 30px ${sectColor}25">🏛 进入门派</button>
      </div>
    </div>
  </div>`;
  const existing = document.getElementById('sectTrialSuccessOverlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function _onSectJoinSuccess(sectId) {
  const sect = SECTS.find(s => s.id === sectId);
  if (typeof window.sectJoin === 'function') {
    window.sectJoin(sectId);
  } else if (typeof sectJoin === 'function') {
    sectJoin(sectId);
  } else {
    const edS = window.edS || {};
    edS.sect = sectId;
    edS.sectRank = 'disciple';
    edS.sectContrib = 0;
    edS.sectJoinedAt = Date.now();
    window.edS = edS;
    if (typeof saveEdS === 'function') saveEdS();
    showToast(`已加入${sect ? sect.name : sectId}！`, 'success');
  }
  ['sectTrialSuccessOverlay','sectTrialResultOverlay','sectTrialNextOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  delete window._currentSectTrial;
  if (typeof renderSectsPage === 'function') renderSectsPage();
}
