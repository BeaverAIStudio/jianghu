const SECTS = [
  {
    id:'shaolin',
    name:'少林寺',
    title:'禅武合一 · 天下第一大派',
    emblem:'☸',
    tag:'佛法无边',
    desc:'坐落于嵩山之巅，千年古刹，武功修为天下无双。以佛法为根，以武功为用，讲究厚积薄发、金刚不坏。弟子以仁义为本，纵是打遍天下，亦不忘普度众生。',
    motto:'武以载道，止戈为武',
    schools:['buddha','force','fist'],
    color:'#f0c040', color2:'#ff9900',
    glow:'rgba(240,192,64,.35)', border:'rgba(240,192,64,.2)',
    bg1:'rgba(240,192,64,.06)', bg2:'rgba(240,192,64,.02)',
    tier:'supreme',
    alignment:'righteous',
    members:'三千僧兵',
    relations:{
      allies:  ['wudang','huashan','emei','kongtong','kunlun','shengguang','nangong'],  // 正道同盟
      rivals:  ['tiandibang','xiaoyao','guigu'],                                         // 立场不同，时有摩擦
      enemies: ['riyue','xuanming','xuegu','wudu'],                                      // 正邪死仇
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
    name:'武当派',
    title:'道法自然 · 以柔克刚',
    emblem:'☯',
    tag:'太极无极',
    desc:'坐落于武当山，以道家思想为根基，太极拳法举世无双。讲究以柔克刚、借力打力。剑法绵柔中暗含杀机，天道自然，无为而无不为。',
    motto:'道可道，非常道',
    schools:['tao','sword','wind'],
    color:'#60e8e8', color2:'#00c8d0',
    glow:'rgba(96,232,232,.3)', border:'rgba(96,232,232,.18)',
    bg1:'rgba(96,232,232,.05)', bg2:'rgba(96,232,232,.02)',
    tier:'supreme',
    alignment:'righteous',
    members:'七侠五义',
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
    id:'huashan',
    name:'华山派',
    title:'华山论剑 · 剑道极致',
    emblem:'⚔',
    tag:'剑道无双',
    desc:'华山险峻之上，剑气凌云。华山派剑法刚猛精纯，一剑在手，破万法。弟子悟性极高，剑道即禅道，以剑悟道，以道驭剑，达到剑我合一之境界。',
    motto:'剑走偏锋，以快制胜',
    schools:['sword','holy','ice'],
    color:'#80d8ff', color2:'#40b0ff',
    glow:'rgba(64,176,255,.3)', border:'rgba(64,176,255,.18)',
    bg1:'rgba(64,176,255,.05)', bg2:'rgba(64,176,255,.02)',
    tier:'major',
    alignment:'righteous',
    members:'华山五老',
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
   ┃    ╱  道 ╲  剑气凌云┃
   ┃   ╱ 绝 顶 ╲         ┃
   ┃  ╱  苍龙岭 ╲ 悬崖栈道┃
   ┃  思过崖·朝阳峰      ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 西岳 · 以快制剑 ══`,
  },
  {
    id:'mingjiao',
    name:'明教',
    title:'明尊光明 · 圣火燃天',
    emblem:'🔥',
    tag:'圣火令',
    desc:'源自波斯明教，尊奉光明之神。教众以烈火为圣，倚天屠龙威震天下。火焰功法威力惊人，一旦激发，可焚烬万物。教义光明磊落，不屈不挠。',
    motto:'焚我残躯，熊熊圣火',
    schools:['fire','fist','force'],
    color:'#ff6020', color2:'#ff3000',
    glow:'rgba(255,96,32,.35)', border:'rgba(255,96,32,.2)',
    bg1:'rgba(255,96,32,.06)', bg2:'rgba(255,96,32,.02)',
    tier:'major',
    alignment:'chaotic',
    members:'四法王三使者',
    relations:{
      allies:  ['tiandibang','tianlong'],                                // 混乱同路人
      rivals:  ['wudu','tangmen','haisha'],                              // 势力摩擦
      enemies: ['shaolin','wudang','huashan','emei','riyue','xuegu'],    // 与正道为敌；与日月神教争夺势力
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
    name:'五毒教',
    title:'五毒共生 · 百毒不侵',
    emblem:'🐍',
    tag:'苗疆秘法',
    desc:'深居苗疆，以蛊术毒法称霸一方。五毒——蛇、蜈蚣、蝎子、蟾蜍、壁虎，皆可入药为毒。门中功法奇异诡谲，百毒不侵，以毒攻毒乃正宗心法。',
    motto:'以毒攻毒，百毒不侵',
    schools:['poison','qimen','shadow'],
    color:'#88ff44', color2:'#44cc00',
    glow:'rgba(136,255,68,.28)', border:'rgba(136,255,68,.18)',
    bg1:'rgba(136,255,68,.05)', bg2:'rgba(136,255,68,.02)',
    tier:'major',
    alignment:'evil',
    members:'五毒童子',
    relations:{
      allies:  ['xuanming','xuegu'],                          // 邪道同盟
      rivals:  ['tangmen','qingcheng','mingjiao'],            // 毒系竞争
      enemies: ['shaolin','wudang','emei','tianshan','shengguang'], // 正道剿毒
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
    name:'唐门',
    title:'暗器天下第一 · 百步穿杨',
    emblem:'🏹',
    tag:'暗器无双',
    desc:'四川唐门，暗器天下第一。飞针走线，步步杀机。门中弟子个个身藏数十件暗器，能于百步之外取人性命。机关术与毒药亦是一绝，令人防不胜防。',
    motto:'百步穿杨，一击毙命',
    schools:['shadow','qimen','poison'],
    color:'#a080e0', color2:'#8040c0',
    glow:'rgba(160,128,224,.28)', border:'rgba(160,128,224,.18)',
    bg1:'rgba(160,128,224,.05)', bg2:'rgba(160,128,224,.02)',
    tier:'major',
    alignment:'neutral',
    members:'唐门三老',
    relations:{
      allies:  ['guigu','lingxiao'],                        // 同为情报/技术流
      rivals:  ['wudu','qingcheng','haisha'],               // 暗器vs毒 的竞争
      enemies: [],                                           // 中立不主动结仇
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
    name:'桃花岛',
    title:'聪颖无双 · 奇门异术',
    emblem:'🌸',
    tag:'落英神剑',
    desc:'东海之上，桃花盛开之处。岛主黄老邪才学绝世，琴棋书画无一不精，武功亦达化境。岛中弟子聪颖过人，落英神剑掌法飘逸，冰心玉壶之道独步天下。',
    motto:'移花接木，无中生有',
    schools:['ice','music','tao'],
    color:'#ff88cc', color2:'#ff5599',
    glow:'rgba(255,136,204,.28)', border:'rgba(255,136,204,.18)',
    bg1:'rgba(255,136,204,.05)', bg2:'rgba(255,136,204,.02)',
    tier:'major',
    alignment:'neutral',
    members:'黄老邪门下',
    relations:{
      allies:  ['xiaoyao','lingxiao'],                      // 同为飘逸自在派
      rivals:  ['shaolin','emei'],                          // 被正统门派不太认可
      enemies: ['riyue','xuegu'],                           // 曾遭神教劫掠
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
    id:'xiaoyao',
    name:'逍遥派',
    title:'逍遥天地 · 无拘无束',
    emblem:'🌀',
    tag:'生死自在',
    desc:'逍遥子所创，门人寥寥，却各个惊才绝艳。天山折梅手、小无相功，皆是绝世武学。讲究逍遥自在，随心所欲，以虚御实，以无驭有，天地任遨游。',
    motto:'逍遥天地，自在人间',
    schools:['wind','fate','ice','tao'],
    color:'#c0f0c0', color2:'#60cc60',
    glow:'rgba(192,240,192,.25)', border:'rgba(192,240,192,.15)',
    bg1:'rgba(192,240,192,.04)', bg2:'rgba(192,240,192,.02)',
    tier:'supreme',
    alignment:'neutral',
    members:'三位传人',
    relations:{
      allies:  ['taohuadao','guigu'],                       // 同为奇学派
      rivals:  ['wudang','tianshan'],                       // 内功路数相近，互相较劲
      enemies: ['riyue','xuanming'],                        // 曾被神教算计
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
    id:'tiandibang',
    name:'天地帮',
    title:'雷霆万钧 · 霸道天下',
    emblem:'⚡',
    tag:'雷鸣四野',
    desc:'江湖新兴势力，以武力称霸一方。帮众个个身强力壮，雷系功法震天动地。行事霸道，却也义气为先。誓要横扫江湖，创下一番霸业。',
    motto:'雷霆所至，无不臣服',
    schools:['thunder','force','fist'],
    color:'#ffe040', color2:'#ffa000',
    glow:'rgba(255,224,64,.3)', border:'rgba(255,224,64,.18)',
    bg1:'rgba(255,224,64,.05)', bg2:'rgba(255,224,64,.02)',
    tier:'minor',
    alignment:'chaotic',
    members:'千余帮众',
    relations:{
      allies:  ['mingjiao','tianlong','haisha'],            // 混乱势力联盟
      rivals:  ['shaolin','wudang','meng_qiubai_faction'],  // 与正道有摩擦
      enemies: ['xuegu','xuanming'],                        // 帮众屡被邪道暗算
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
    name:'鬼谷门',
    title:'算无遗策 · 运筹帷幄',
    emblem:'🔮',
    tag:'天机不可泄',
    desc:'神秘莫测，行事低调。门主鬼谷子精通奇门遁甲，天命推算，算尽天下英雄。弟子出山必成大器，纵横天下，谋略无双。所谓天机不可泄露，一旦出手，必有万全之策。',
    motto:'运筹帷幄，决胜千里',
    schools:['qimen','fate','shadow'],
    color:'#d4b050', color2:'#a08020',
    glow:'rgba(212,176,80,.28)', border:'rgba(212,176,80,.18)',
    bg1:'rgba(212,176,80,.05)', bg2:'rgba(212,176,80,.02)',
    tier:'minor',
    alignment:'neutral',
    members:'寥寥数人',
    relations:{
      allies:  ['lingxiao','tangmen','xiaoyao'],            // 情报/奇学派往来
      rivals:  ['riyue','xuanming'],                        // 被邪道忌惮
      enemies: [],                                           // 从不主动结仇
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
    name:'圣光教',
    title:'光明正道 · 圣裁天下',
    emblem:'✦',
    tag:'圣光庇佑',
    desc:'以圣光信仰为根基，弟子皆修圣系神功。圣光斩邪、圣愈疗伤，治愈与毁灭并存。行走天下，扶危济困，以圣光之名裁决邪恶，乃江湖正道之一。',
    motto:'圣光普照，邪不胜正',
    schools:['holy','music','buddha'],
    color:'#ffffa0', color2:'#ffdd00',
    glow:'rgba(255,255,128,.28)', border:'rgba(255,255,128,.18)',
    bg1:'rgba(255,255,128,.04)', bg2:'rgba(255,255,128,.02)',
    tier:'minor',
    alignment:'righteous',
    members:'圣骑士团',
    relations:{
      allies:  ['shaolin','wudang','emei','tianshan'],      // 正道联盟
      rivals:  ['guigu','xixia'],                           // 预言/神秘路线不认可
      enemies: ['riyue','xuegu','xuanming','wudu'],         // 邪道宿敌
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

  // ─────────────────────────────────────────
  {
    id:'emei',
    name:'峨眉派',
    title:'女中豪杰 · 圣洁峰巅',
    emblem:'🌺',
    tag:'峨眉九阳',
    desc:'峨眉山巅，女侠辈出。功法兼收并蓄，融佛道两家之长，内功深厚，招式灵动优美。弟子修行极严，心性纯净，战则如仙鹤凌空，退则如白鹤守松，令天下男儿汗颜。',
    motto:'清心寡欲，峨眉天下',
    schools:['holy','ice','tao'],
    color:'#ffaad4', color2:'#ff80b0',
    glow:'rgba(255,170,212,.28)', border:'rgba(255,170,212,.18)',
    bg1:'rgba(255,170,212,.05)', bg2:'rgba(255,170,212,.02)',
    tier:'major',
    alignment:'righteous',
    members:'百余女弟子',
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
    name:'崆峒派',
    title:'七伤绝技 · 北地武宗',
    emblem:'🌪',
    tag:'七伤拳法',
    desc:'坐镇崆峒山，北地武林之宗。以七伤拳法和崆峒五老为根基，刚猛霸道，以伤换伤，胜则一击毙命。门中弟子无不是血性男儿，宁死不屈，豪情万丈。',
    motto:'伤我七分，换你十分',
    schools:['fist','force','thunder'],
    color:'#e06040', color2:'#c04020',
    glow:'rgba(224,96,64,.3)', border:'rgba(224,96,64,.18)',
    bg1:'rgba(224,96,64,.05)', bg2:'rgba(224,96,64,.02)',
    tier:'major',
    alignment:'righteous',
    members:'崆峒五老',
    relations:{
      allies:  ['shaolin','wudang','kunlun','nangong'],
      rivals:  ['tianlong','tiandibang'],                   // 北方势力摩擦
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
   ┃  │崆峒派│  🌪     ┃
   ┃  │     │ 七伤绝技┃
   ┃  ╰──┬───╯ 刚猛霸道┃
   ┃  北地武宗·五老堂    ┃
   ┃                    ┃
   ╰━━━━━━━━━━━━━━━━━━╯
   ══ 宁折不弯 · 以伤换伤 ══`,
  },
  {
    id:'kunlun',
    name:'昆仑派',
    title:'雪域高原 · 金刚剑法',
    emblem:'🏔',
    tag:'昆仑绝顶',
    desc:'昆仑山巅，积雪千年。昆仑派剑法霸气厚重，如山岳压人，难以抵挡。兼修冰系内功，以西域奇功辅助，号称"昆仑三圣"，于武林地位举足轻重。',
    motto:'高山仰止，景行行止',
    schools:['sword','ice','force'],
    color:'#90d0ff', color2:'#5090d0',
    glow:'rgba(144,208,255,.28)', border:'rgba(144,208,255,.18)',
    bg1:'rgba(144,208,255,.05)', bg2:'rgba(144,208,255,.02)',
    tier:'major',
    alignment:'righteous',
    members:'昆仑三圣',
    relations:{
      allies:  ['shaolin','wudang','huashan','tianshan'],
      rivals:  ['xixia','diancang'],                        // 西域/西南路线之争
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
   ══ 昆仑绝顶 · 万山之祖 ══`
  },
  {
    id:'diancang',
    name:'点苍派',
    title:'云贵秘境 · 苍山剑法',
    emblem:'💠',
    tag:'苍山如海',
    desc:'云南点苍山，世外武学高地。点苍派武功融合了南疆秘术与中原剑法，自成一格。擅长毒剑双修，以轻灵的步法配合诡异的剑招，令人难以捉摸。',
    motto:'苍山如海，残阳如血',
    schools:['sword','poison','wind'],
    color:'#70c8b0', color2:'#40a890',
    glow:'rgba(112,200,176,.28)', border:'rgba(112,200,176,.18)',
    bg1:'rgba(112,200,176,.05)', bg2:'rgba(112,200,176,.02)',
    tier:'minor',
    alignment:'neutral',
    members:'苍派三老',
    relations:{
      allies:  ['tangmen','qingcheng'],                     // 同为南路毒剑派
      rivals:  ['kunlun','emei'],                           // 南北剑法之争
      enemies: ['wudu'],                                     // 被五毒教劫持过弟子
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
   ══ 苍山如海 · 残阳如血 ══`
  },
  {
    id:'tianshan',
    name:'天山派',
    title:'天山雪莲 · 冰封绝技',
    emblem:'❄',
    tag:'天山六阳掌',
    desc:'天山高峰，万年冰雪。派中绝学以冰系内力为根，六阳掌寒气入体，可冻结敌方经脉。修炼之人须在极寒之地打熬筋骨，方能练就通体冰凉、刀枪不入之躯。',
    motto:'冰心玉壶，天下无双',
    schools:['ice','tao','holy'],
    color:'#d0f0ff', color2:'#90d8ff',
    glow:'rgba(208,240,255,.25)', border:'rgba(208,240,255,.15)',
    bg1:'rgba(208,240,255,.04)', bg2:'rgba(208,240,255,.02)',
    tier:'minor',
    alignment:'righteous',
    members:'天山童姥',
    relations:{
      allies:  ['shaolin','wudang','emei','kunlun'],
      rivals:  ['xixia','xiaoyao'],                         // 西域/逍遥路线竞争
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
   ══ 冰心玉壶 · 天下无双 ══`
  },
  {
    id:'xixia',
    name:'西夏秘宗',
    title:'西域绝学 · 神秘莫测',
    emblem:'🌙',
    tag:'西域秘法',
    desc:'来自西域的神秘门派，功法迥异于中原武学，以命系预测与奇门阵法为主。弟子修习西域密宗，内外兼修，阴阳调和。传说西夏秘宗能够预知未来，令人闻风丧胆。',
    motto:'天命所归，顺势而为',
    schools:['fate','qimen','shadow'],
    color:'#c0a0e0', color2:'#9060c0',
    glow:'rgba(192,160,224,.28)', border:'rgba(192,160,224,.18)',
    bg1:'rgba(192,160,224,.05)', bg2:'rgba(192,160,224,.02)',
    tier:'minor',
    alignment:'neutral',
    members:'密宗三法王',
    relations:{
      allies:  ['guigu','diancang'],                        // 同为神秘/预言派
      rivals:  ['tianshan','kunlun'],                       // 西域路线之争
      enemies: ['riyue'],                                    // 神教曾吞并西夏据点
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
   ══ 天命所归 · 顺势而为 ══`
  },
  {
    id:'tianlong',
    name:'天龙帮',
    title:'龙象并进 · 天下无敌',
    emblem:'🐉',
    tag:'龙象般若功',
    desc:'源自吐蕃密宗的龙象般若功，修至大成可与金刚护体相媲美，力量惊人。帮主以龙象之力横扫武林，帮众虽少，却个个武功深不可测。行事刚猛直接，不屑于阴谋诡计。',
    motto:'龙腾四海，象步千山',
    schools:['force','fist','buddha'],
    color:'#e8a000', color2:'#c07800',
    glow:'rgba(232,160,0,.32)', border:'rgba(232,160,0,.2)',
    bg1:'rgba(232,160,0,.06)', bg2:'rgba(232,160,0,.02)',
    tier:'minor',
    alignment:'chaotic',
    members:'龙象十八罗汉',
    relations:{
      allies:  ['tiandibang','haisha'],                     // 混乱势力同盟
      rivals:  ['mingjiao','kongtong'],                     // 势力地盘争夺
      enemies: ['shaolin','wudang'],                        // 多次被正道讨伐
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
    name:'南宫世家',
    title:'世家贵族 · 剑道风雅',
    emblem:'🏛',
    tag:'南宫剑典',
    desc:'中原名门世家，数百年积累底蕴深厚。南宫剑典精妙绝伦，攻守兼备，优雅如诗。弟子个个出身高贵，学识渊博，剑法里暗含儒家道义，以礼击人，以仁克敌。',
    motto:'礼义廉耻，剑道之魂',
    schools:['sword','holy','music'],
    color:'#b8d890', color2:'#80b850',
    glow:'rgba(184,216,144,.28)', border:'rgba(184,216,144,.18)',
    bg1:'rgba(184,216,144,.05)', bg2:'rgba(184,216,144,.02)',
    tier:'minor',
    alignment:'righteous',
    members:'南宫家族',
    relations:{
      allies:  ['shaolin','wudang','huashan','shengguang'],
      rivals:  ['tiandibang','haisha'],                     // 瞧不起草莽帮派
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
    name:'玄冥教',
    title:'阴冷霸道 · 玄冥二老',
    emblem:'⛧',
    tag:'玄冥神掌',
    desc:'以玄冥寒掌为绝学，一旦中招，寒毒侵入经脉，九死一生。教众行事阴毒，武功邪异，擅长以冰毒双修令对手苦不堪言。虽被中原正道所不齿，实力却不容小觑。',
    motto:'玄冥寒掌，天下无解',
    schools:['ice','poison','shadow'],
    color:'#7090c0', color2:'#405080',
    glow:'rgba(112,144,192,.3)', border:'rgba(112,144,192,.2)',
    bg1:'rgba(112,144,192,.06)', bg2:'rgba(112,144,192,.02)',
    tier:'minor',
    alignment:'evil',
    members:'玄冥二老',
    relations:{
      allies:  ['riyue','wudu','xuegu'],                    // 邪道轴心
      rivals:  ['mingjiao','tianlong'],                     // 势力摩擦
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
    name:'海沙派',
    title:'东海霸主 · 刀法无双',
    emblem:'⚓',
    tag:'海沙七杀刀',
    desc:'盘踞东海，以水战和刀法称雄。海沙七杀刀刚猛激烈，如海浪滔天，势不可挡。帮众多为水贼出身，豪放不羁，行走于海陆之间，令沿海商船无不闻风色变。',
    motto:'七杀刀出，血染东海',
    schools:['shadow','force','thunder'],
    color:'#4090d0', color2:'#206898',
    glow:'rgba(64,144,208,.3)', border:'rgba(64,144,208,.18)',
    bg1:'rgba(64,144,208,.05)', bg2:'rgba(64,144,208,.02)',
    tier:'minor',
    alignment:'chaotic',
    members:'三千海贼',
    relations:{
      allies:  ['tiandibang','tianlong'],                   // 混乱江湖同路人
      rivals:  ['tangmen','lingxiao'],                      // 东南地盘争夺
      enemies: ['shaolin','nangong'],                       // 屡受正道讨伐
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
   ══ 七杀刀出 · 血染东海 ══`
  },
  {
    id:'riyue',
    name:'日月神教',
    title:'日月当空 · 教主独尊',
    emblem:'☀',
    tag:'葵花宝典',
    desc:'教主威凛天下，日月神教雄踞中原。以葵花宝典和吸星大法震慑群雄，弟子众多，势力庞大。日月互补，阴阳相济，内功修为深不见底，江湖中无人敢轻易招惹。',
    motto:'千秋万载，一统江湖',
    schools:['fire','ice','fate'],
    color:'#ff8800', color2:'#cc4400',
    glow:'rgba(255,136,0,.35)', border:'rgba(255,136,0,.2)',
    bg1:'rgba(255,136,0,.06)', bg2:'rgba(255,136,0,.02)',
    tier:'supreme',
    alignment:'evil',
    members:'教众十万',
    relations:{
      allies:  ['xuanming','wudu','xuegu'],                 // 邪道帝国核心
      rivals:  ['mingjiao','tianlong'],                     // 争夺江湖霸权
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
  {
    id:'xuegu',
    name:'血骨门',
    title:'以血炼功 · 杀伐决断',
    emblem:'💀',
    tag:'血炼大法',
    desc:'以血液为媒，行炼体强化之道。修习血骨功法者，皮肉坚韧如铁，力量倍增，但每次施展皆须以血为引。行事果决狠辣，从不拖泥带水，江湖中著名的杀手门派。',
    motto:'血祭苍天，骨铸神兵',
    schools:['fist','force','dark'],
    color:'#cc2020', color2:'#880000',
    glow:'rgba(204,32,32,.35)', border:'rgba(204,32,32,.22)',
    bg1:'rgba(204,32,32,.07)', bg2:'rgba(204,32,32,.03)',
    tier:'minor',
    alignment:'evil',
    members:'百名血骨士',
    relations:{
      allies:  ['riyue','xuanming'],                        // 邪道轴心
      rivals:  ['wudu'],                                    // 邪道内部竞争
      enemies: ['shaolin','shengguang','emei'],             // 正道讨伐对象
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
    name:'凌霄阁',
    title:'凌云之志 · 天下第一楼',
    emblem:'🏯',
    tag:'凌霄九式',
    desc:'中原情报第一站，以消息买卖为生，却也练就了一身高强武功。凌霄九式剑法配合灵活的身法，攻守自如。阁中高手精通多种武学，随机应变乃其最大优势。',
    motto:'消息通天下，剑指凌霄阁',
    schools:['sword','wind','qimen'],
    color:'#d0a060', color2:'#a07030',
    glow:'rgba(208,160,96,.3)', border:'rgba(208,160,96,.18)',
    bg1:'rgba(208,160,96,.05)', bg2:'rgba(208,160,96,.02)',
    tier:'minor',
    alignment:'neutral',
    members:'三十六名阁主',
    relations:{
      allies:  ['tangmen','guigu','taohuadao'],             // 情报/技术流
      rivals:  ['riyue','tiandibang'],                      // 情报被威胁/地盘摩擦
      enemies: ['xuegu'],                                    // 血骨门屡次刺杀阁主
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
    name:'青城派',
    title:'青城天下幽 · 毒剑双绝',
    emblem:'🌿',
    tag:'青城十九剑',
    desc:'青城山幽深险峻，青城派以毒剑双修著称。剑法阴险诡谲，剑上常淬有奇毒，令对手防不胜防。门中弟子行事低调阴沉，然武功深厚，在武林中有着不可忽视的地位。',
    motto:'青城天下幽，毒剑天下绝',
    schools:['sword','poison','shadow'],
    color:'#60b060', color2:'#30801a',
    glow:'rgba(96,176,96,.28)', border:'rgba(96,176,96,.18)',
    bg1:'rgba(96,176,96,.05)', bg2:'rgba(96,176,96,.02)',
    tier:'minor',
    alignment:'neutral',
    members:'青城四秀',
    relations:{
      allies:  ['diancang','tangmen'],                      // 毒剑同路
      rivals:  ['wudang','huashan'],                        // 剑法路线之争，正道不太认可
      enemies: ['wudu'],                                    // 五毒教侵入四川地盘
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
   ══ 青城天下幽 · 毒剑天下绝 ══`
  },
];

// ════════════════════════════════════════════════
//  门派被动战斗加成
//  每个门派提供 2~3 项特色加成，在 calcFinalStats 中注入玩家属性
//  加成克制但可感知，让不同门派"手感"明显不同
// ════════════════════════════════════════════════
const SECT_PASSIVE_BONUS = {
  // ── 超级门派：3项加成 ──
  shaolin:   { hp:30, def:5, poisonResist:15,  _desc:'金刚护体' },
  wudang:    { mp:40, dodge:3, counterAtk:4,    _desc:'以柔克刚' },
  xiaoyao:   { spd:3, crit:3, mp:25,            _desc:'逍遥自在' },
  riyue:     { atk:6, crit:5, spd:2,             _desc:'葵花极速' },

  // ── 大型门派：2~3项加成 ──
  huashan:   { crit:6, spd:2, atk:2,            _desc:'剑气无双' },
  mingjiao:  { atk:5, hp:15, crit:2,            _desc:'圣火焚天' },
  wudu:      { poisonAtk:20, poisonResist:25, hp:10, _desc:'百毒不侵' },
  tangmen:   { crit:8, spd:4,                   _desc:'暗器百步' },
  taohuadao: { mp:30, hp:20, cureBonus:10,      _desc:'玉箫音波' },
  emei:      { mp:35, cureBonus:12, dodge:2,    _desc:'峨眉九阳' },
  kongtong:  { atk:7, def:3, hp:10,             _desc:'七伤绝技' },
  kunlun:    { def:6, hp:25, atk:2,             _desc:'昆仑金刚' },

  // ── 新兴势力：2项加成 ──
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
  // 兼容：如果传入的是 edS 对象，自动取 .sect
  if(typeof sectId === 'object') sectId = (sectId.sect || null);
  let base = SECT_PASSIVE_BONUS[sectId] || {};
  // 阶级系数：高阶级获得额外加成倍率（在 battle.js 中已注入基础值，这里做乘法）
  if(typeof edS !== 'undefined' && edS.sectRank){
    const rankMult = SECT_RANK_CFG[edS.sectRank]?.mult || 1;
    if(rankMult > 1){
      const scaled = {};
      for(const [k,v] of Object.entries(base)){
        if(k.startsWith('_')) continue;
        // 百分比类属性（crit/dodge等）不加倍，避免溢出
        if(['crit','dodge','poisonAtk','poisonResist','iceAtk','iceResist','cureBonus','counterAtk'].includes(k)){
          scaled[k] = v + Math.round(v * (rankMult - 1) * 0.5); // 半倍率增长
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
//  贡献值达到阈值后自动升级，不同阶级提供称号+加成系数
// ════════════════════════════════════════════════
const SECT_RANKS = ['disciple', 'elite', 'elder', 'grand', 'grandmaster']; // 弟子→精英→长老→元老→掌门
const SECT_RANK_CFG = {
  disciple:    { name:'弟子',   icon:'📜', minContrib:0,    mult:1.0,  title:null },
  elite:       { name:'精英',   icon:'⚔',  minContrib:80,   mult:1.15, title:'门派精英' },
  elder:       { name:'长老',   icon:'🏅',  minContrib:250,  mult:1.30, title:'门派长老' },
  grand:       { name:'元老',   icon:'👑',  minContrib:600,  mult:1.50, title:'门派元老' },
  grandmaster: { name:'掌门',   icon:'🏯',  minContrib:1000, mult:2.0,  title:'门派掌门' },
};

// 根据贡献值计算当前阶级
function calcSectRank(contrib){
  contrib = contrib || 0;
  if(contrib >= SECT_RANK_CFG.grand.minContrib)  return 'grand';
  if(contrib >= SECT_RANK_CFG.elder.minContrib)  return 'elder';
  if(contrib >= SECT_RANK_CFG.elite.minContrib)  return 'elite';
  return 'disciple';
}

// 检查并更新阶级（返回是否升级了）
function checkSectRankUp(edSObj){
  if(!edSObj || !edSObj.sect) return false;
  const oldRank = edSObj.sectRank || 'disciple';
  const newRank = calcSectRank(edSObj.sectContrib || 0);
  if(oldRank === newRank) return false;
  edSObj.sectRank = newRank;
  return true; // 升级了！调用方应弹窗提示
}


// ════════════════════════════════════════════════
//  门派被动加成渲染（门派志卡片中展示）
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
//  门派关系网渲染辅助（含动态好感值+声望等级）
// ════════════════════════════════════════════════
function renderSectRelations(sect){
  if(!sect.relations) return '';
  const rel = sect.relations;
  const getSectName = id => {
    const s = SECTS.find(x => x.id === id);
    return s ? s.name : id;
  };

  // ── 动态好感值相关 ──
  const hasDynamic = typeof swGetRelation === 'function';

  // 声望等级映射：好感值 → 等级信息
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

  // 好感值条HTML
  function relBarHtml(val){
    if(!hasDynamic) return '';
    var pct = Math.max(0,Math.min(100,(val+100)/2));
    var barColor = val >= 20 ? '#60d060' : val >= -20 ? '#b0b0b0' : '#ff6060';
    return '<div style="width:50px;height:5px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;margin-left:4px">' +
      '<div style="width:'+pct+'%;height:100%;background:'+barColor+';border-radius:3px;transition:width .3s"></div></div>';
  }

  // 收集所有相关门派ID
  var allRelatedIds = [];
  if(rel.allies)  allRelatedIds = allRelatedIds.concat(rel.allies);
  if(rel.rivals)  allRelatedIds = allRelatedIds.concat(rel.rivals);
  if(rel.enemies) allRelatedIds = allRelatedIds.concat(rel.enemies);

  var parts = [];

  // ── 静态关系标签 ──
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

  // ── 动态好感值详细面板 ──
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
//  门派贡献商店配置
// ════════════════════════════════════════════════
const SECT_CONTRIB_SHOP = {
  // ── 少林寺 ──
  shaolin: {
    items: [
      { id:'cs_s_frag',   icon:'📜', name:'罗汉拳残本',       desc:'少林七十二绝技之一残卷，含两式护体功法',  cost:30,  type:'manual', manualId:'m_bd_partial1',   reqLv:15 },
      { id:'cs_s_compl',  icon:'📖', name:'金刚经完本',        desc:'完整的金刚护体功法，三式佛门绝学',           cost:80,  type:'manual', manualId:'m_bd_complete1',  reqLv:28 },
      { id:'cs_s_med',    icon:'💊', name:'大还丹',            desc:'少林秘制丹药，服用后恢复全部气血',           cost:25,  type:'consumable' },
      { id:'cs_s_title',  icon:'🏅', name:'少林俗家弟子',      desc:'少林寺俗家弟子称号，江湖中人另眼相看',       cost:15,  type:'title' },
    ]
  },
  // ── 武当派 ──
  wudang: {
    items: [
      { id:'cs_w_frag',   icon:'📜', name:'道门心法残本',      desc:'道门内功心法残卷，两式以柔制刚',            cost:30,  type:'manual', manualId:'m_ta_partial1',   reqLv:14 },
      { id:'cs_w_compl',  icon:'📖', name:'玄真道经完本',       desc:'道家内功完整典籍，三式玄妙功法',            cost:80,  type:'manual', manualId:'m_ta_complete1',  reqLv:26 },
      { id:'cs_w_med',    icon:'💊', name:'武当回元丹',         desc:'武当秘制丹药，恢复大量内力',                 cost:25,  type:'consumable' },
      { id:'cs_w_title',  icon:'🏅', name:'武当俗家弟子',       desc:'武当派俗家弟子称号',                        cost:15,  type:'title' },
    ]
  },
  // ── 华山派 ──
  huashan: {
    items: [
      { id:'cs_h_frag',   icon:'📜', name:'剑宗秘要残本',      desc:'剑宗流传的入门功法，两式犀利剑招',          cost:30,  type:'manual', manualId:'m_sw_partial1',   reqLv:12 },
      { id:'cs_h_compl',  icon:'📖', name:'御风剑典完本',      desc:'完整剑法典籍，三式进阶剑招',                cost:80,  type:'manual', manualId:'m_sw_complete1',  reqLv:25 },
      { id:'cs_h_med',    icon:'💊', name:'华山续命丹',         desc:'华山秘药，恢复气血与内力',                   cost:25,  type:'consumable' },
      { id:'cs_h_title',  icon:'🏅', name:'华山外门弟子',       desc:'华山派外门弟子称号',                         cost:15,  type:'title' },
    ]
  },
  // ── 明教 ──
  mingjiao: {
    items: [
      { id:'cs_m_frag',   icon:'📜', name:'烈火心法残本',      desc:'明教火功残本，两式攻守兼备',                cost:30,  type:'manual', manualId:'m_fi_partial1',   reqLv:15 },
      { id:'cs_m_compl',  icon:'📖', name:'圣火令功法完本',    desc:'明教圣火令附带完整火功',                    cost:80,  type:'manual', manualId:'m_fi_complete1',  reqLv:26 },
      { id:'cs_m_med',    icon:'💊', name:'圣火丹',             desc:'明教秘制，恢复全部内力并短暂提升攻击',       cost:25,  type:'consumable' },
      { id:'cs_m_title',  icon:'🏅', name:'明教烈火使',        desc:'明教烈火使者称号',                           cost:15,  type:'title' },
    ]
  },
  // ── 逍遥派 ──
  xiaoyao: {
    items: [
      { id:'cs_x_frag',   icon:'📜', name:'寒冰入门残卷',      desc:'天山冰功入门残页',                           cost:30,  type:'manual', manualId:'m_ic_partial1',   reqLv:16 },
      { id:'cs_x_med',    icon:'💊', name:'天山雪莲',           desc:'天山特产，服用后内力大增',                   cost:25,  type:'consumable' },
      { id:'cs_x_title',  icon:'🏅', name:'逍遥外门弟子',      desc:'逍遥派外门弟子称号',                         cost:15,  type:'title' },
    ]
  },
  // ── 崆峒派 ──
  kongtong: {
    items: [
      { id:'cs_k_frag',   icon:'📜', name:'天雷功残本',        desc:'崆峒雷法残本，两式天雷绝技',                cost:30,  type:'manual', manualId:'m_th_partial1',   reqLv:16 },
      { id:'cs_k_med',    icon:'💊', name:'七伤丹药',           desc:'崆峒秘药，服用后大幅恢复气血',               cost:25,  type:'consumable' },
      { id:'cs_k_title',  icon:'🏅', name:'崆峒外门弟子',      desc:'崆峒派外门弟子称号',                         cost:15,  type:'title' },
    ]
  },
  // ── 昆仑派 ──
  kunlun: {
    items: [
      { id:'cs_ku_frag',  icon:'📜', name:'昆仑基础剑诀',      desc:'昆仑派入门剑法残卷',                         cost:30,  type:'manual', manualId:'m_sw_partial1',   reqLv:12 },
      { id:'cs_ku_med',   icon:'💊', name:'昆仑雪参',           desc:'昆仑特产药材，恢复大量气血',                  cost:25,  type:'consumable' },
      { id:'cs_ku_title', icon:'🏅', name:'昆仑外门弟子',     desc:'昆仑派外门弟子称号',                         cost:15,  type:'title' },
    ]
  },
  // ── 峨眉派 ──
  emei: {
    items: [
      { id:'cs_e_frag',   icon:'📜', name:'峨眉基础剑法',      desc:'峨眉派入门剑法残卷',                         cost:30,  type:'manual', manualId:'m_sw_partial1',   reqLv:12 },
      { id:'cs_e_med',    icon:'💊', name:'峨眉断续膏',         desc:'峨眉秘制金创药，恢复大量气血',                cost:25,  type:'consumable' },
      { id:'cs_e_title',  icon:'🏅', name:'峨眉外门弟子',       desc:'峨眉派外门弟子称号',                         cost:15,  type:'title' },
    ]
  },
  // ── 唐门 ──
  tangmen: {
    items: [
      { id:'cs_t_frag',   icon:'📜', name:'影刺残本',          desc:'唐门暗刺功法残本，两式暗杀绝技',             cost:30,  type:'manual', manualId:'m_sh_partial1',   reqLv:16 },
      { id:'cs_t_compl',  icon:'📖', name:'鬼影步法完本',       desc:'唐门鬼影步完整教程',                         cost:80,  type:'manual', manualId:'m_sh_complete1',  reqLv:28 },
      { id:'cs_t_med',    icon:'💊', name:'唐门解毒丸',         desc:'唐门秘制解药，可解除中毒状态',               cost:25,  type:'consumable' },
      { id:'cs_t_title',  icon:'🏅', name:'唐门外门弟子',       desc:'唐门外门弟子称号',                           cost:15,  type:'title' },
    ]
  },
  // ── 其他中小门派通用 ──
  tiandibang: {
    items: [
      { id:'cs_td_med',   icon:'💊', name:'天地大力丸',         desc:'天地帮秘制，服用后力量短暂提升',             cost:25,  type:'consumable' },
      { id:'cs_td_title', icon:'🏅', name:'天地帮弟子',        desc:'天地帮弟子称号',                              cost:15,  type:'title' },
    ]
  },
  taohuadao: {
    items: [
      { id:'cs_th_med',   icon:'🍶', name:'桃花酿',             desc:'桃花岛特产，大幅恢复气血与精力',              cost:25,  type:'consumable' },
      { id:'cs_th_title', icon:'🏅', name:'桃花岛弟子',         desc:'桃花岛弟子称号',                              cost:15,  type:'title' },
    ]
  },
  xuegu: {
    items: [
      { id:'cs_xg_med',   icon:'💊', name:'血骨丹',             desc:'血骨门秘制丹药，大幅恢复气血',                cost:25,  type:'consumable' },
      { id:'cs_xg_title', icon:'🏅', name:'血骨门弟子',         desc:'血骨门弟子称号',                              cost:15,  type:'title' },
    ]
  },
  xuanming: {
    items: [
      { id:'cs_xm_med',   icon:'💊', name:'玄冥寒冰丹',         desc:'玄冥教秘药，恢复内力并短暂抗寒',             cost:25,  type:'consumable' },
      { id:'cs_xm_title', icon:'🏅', name:'玄冥教弟子',         desc:'玄冥教弟子称号',                              cost:15,  type:'title' },
    ]
  },
  tianshan: {
    items: [
      { id:'cs_ts_frag',  icon:'📜', name:'天山冰心完本',       desc:'天山逍遥派冰功完整典籍',                      cost:80,  type:'manual', manualId:'m_ic_complete1',  reqLv:27 },
      { id:'cs_ts_med',   icon:'🌸', name:'天山雪莲',           desc:'天山特产，服用后内力大增',                   cost:25,  type:'consumable' },
      { id:'cs_ts_title',  icon:'🏅', name:'天山派弟子',        desc:'天山派弟子称号',                              cost:15,  type:'title' },
    ]
  },
  nangong: {
    items: [
      { id:'cs_ng_med',   icon:'💊', name:'南宫续命丹',         desc:'南宫世家秘药，恢复大量气血',                  cost:25,  type:'consumable' },
      { id:'cs_ng_title', icon:'🏅', name:'南宫世家弟子',      desc:'南宫世家弟子称号',                            cost:15,  type:'title' },
    ]
  },
  lingxiao: {
    items: [
      { id:'cs_lx_med',   icon:'📜', name:'情报密册',           desc:'凌霄楼情报合集，任务中获得额外线索',          cost:25,  type:'consumable' },
      { id:'cs_lx_title', icon:'🏅', name:'凌霄楼线人',         desc:'凌霄楼线人称号',                              cost:15,  type:'title' },
    ]
  },
  guigu: {
    items: [
      { id:'cs_gg_med',   icon:'📜', name:'鬼谷秘策',           desc:'鬼谷门谋略手册，提升任务奖励',                cost:25,  type:'consumable' },
      { id:'cs_gg_title', icon:'🏅', name:'鬼谷门弟子',         desc:'鬼谷门弟子称号',                              cost:15,  type:'title' },
    ]
  },
  haisha: {
    items: [
      { id:'cs_hs_med',   icon:'💊', name:'海沙疗伤丹',          desc:'海沙派秘药，恢复大量气血',                    cost:25,  type:'consumable' },
      { id:'cs_hs_title', icon:'🏅', name:'海沙派弟子',         desc:'海沙派弟子称号',                              cost:15,  type:'title' },
    ]
  },
  shengguang: {
    items: [
      { id:'cs_sg_med',   icon:'💊', name:'圣光治愈符',         desc:'圣光教治愈符，解除异常状态',                  cost:25,  type:'consumable' },
      { id:'cs_sg_title', icon:'🏅', name:'圣光教信徒',         desc:'圣光教信徒称号',                              cost:15,  type:'title' },
    ]
  },
  diancang: {
    items: [
      { id:'cs_dc_frag',  icon:'📜', name:'蛊毒秘法残本',       desc:'点苍毒系残本，两式毒功',                      cost:30,  type:'manual', manualId:'m_po_partial1',   reqLv:17 },
      { id:'cs_dc_med',   icon:'💊', name:'点苍解毒药',         desc:'点苍派解毒药',                               cost:25,  type:'consumable' },
      { id:'cs_dc_title', icon:'🏅', name:'点苍派弟子',         desc:'点苍派弟子称号',                              cost:15,  type:'title' },
    ]
  },
  qingcheng: {
    items: [
      { id:'cs_qc_med',   icon:'💊', name:'青城金创药',         desc:'青城派金创药，恢复大量气血',                  cost:25,  type:'consumable' },
      { id:'cs_qc_title', icon:'🏅', name:'青城派弟子',         desc:'青城派弟子称号',                              cost:15,  type:'title' },
    ]
  },
  xixia: {
    items: [
      { id:'cs_xx_med',   icon:'💊', name:'西夏金刚丹',          desc:'西夏秘宗金刚丹，大幅提升防御',               cost:25,  type:'consumable' },
      { id:'cs_xx_title', icon:'🏅', name:'西夏秘宗弟子',       desc:'西夏秘宗弟子称号',                            cost:15,  type:'title' },
    ]
  },
  tianlong: {
    items: [
      { id:'cs_tl_med',   icon:'💊', name:'天龙培元丹',         desc:'天龙帮培元丹，恢复气血并提升下次攻击',       cost:25,  type:'consumable' },
      { id:'cs_tl_title', icon:'🏅', name:'天龙帮弟子',         desc:'天龙帮弟子称号',                              cost:15,  type:'title' },
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

  // ── 所有门派商店追加门派回令（消耗品，传送回本门总舵）──
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

    // ── 门派加入状态判定 ──
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
      // 未加入：显示申请按钮
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

// ── 门派加入点击回调（由 town.html 注入逻辑）──
window._onSectJoinClick = function(sectId) {
  if(typeof window._doSectTrial === 'function'){
    window._doSectTrial(sectId);
  } else {
    showToast('门派系统加载中...', 'warn');
  }
};


// ════════════════════════════════════════════════
//  角色数据（全部升级为更复杂的多行字符造型）
// ════════════════════════════════════════════════
