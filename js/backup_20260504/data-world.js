const LOCATION_SCENES = {

  // ── 都城 / 重要城市 ──────────────────────────
  capital:
`   ▄▄▄ ▄▄ ▄▄ ▄▄▄▄▄▄▄▄ ▄▄ ▄▄ ▄▄▄
  █▀▀█▀▀█▀▀█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█▀▀█
  █  █  █  █ 城 ☯ 门 ☯ 楼 █  █  █
  █──█──█──█─────────────█──█──█
 ─┤  ├──┤  ├────┤     ├──┤  ├──┤─
  │ ≡│  │ ≡│    │ ⊡ ⊡ │  │ ≡│  │
──┘  └──┘  └────┘     └──┘  └──┘`,

  city:
`     ▄▄▄▄         ▄▄
   ▄█▀▀▀▀█▄    ▄▄█▀ █▄
  █▀│  ⊞  │▀█─█▀│ ⊞ │█
  █ │     │ █ █ └───┘ █
─ █─┴─────┴─█─█───────█ ─
  │  ≡ ≡ ≡  │ │ ≡ ≡ ≡ │
──┘──────────┘─┘───────┘──`,

  city_minor:
`        ▄▄▄
       █▀▀▀█      ▄
      █│  ⊞│█    ▄█▄
    ──█└───┘█────█   █──
      │  ≡  │    │ ≡ │
   ───┘     └────┘   └───`,

  // ── 门派 ──────────────────────────────────────
  sect_shaolin:
`      ☸    ☸    ☸
    ╔══╗  ╔════╗  ╔══╗
    ║  ║  ║卍 卍║  ║  ║
  ╔═╩══╩══╩════╩══╩══╩═╗
  ║  古  刹  晨  钟  鸣  ║
  ╠══════════════════════╣
  ║    南   无   阿   弥  ║`,

  sect_wudang:
`       ☯         ☯
     ╱▔▔▔╲       ╱▔▔╲
    │ 太极 │─────│玄天│
    │  殿  │     │观  │
   ─╰──────╯─────╰────╯─
     山   势   高   耸
    ─ ─ 云 雾 缭 绕 ─ ─`,

  sect_huashan:
`     ⚔         ⚔
     /\\ \\       / /\\
    /  \\ \\─────/ /  \\
   / 华  \\     / 山  \\
  /  论   \\   /  剑   \\
 /─────────\\ /─────────\\
═══ 剑 气 纵 横 · 险 峰 ═══`,

  sect_mingjiao:
`        🔥  教  🔥
    ╔══════════════╗
    ║  ◆  明  ◆    ║
    ║ ╱╲  尊  ╱╲   ║
    ║╱火 ╲  ╱ 焰╲  ║
    ╚══════════════╝
   ─── 圣 火 令 令 ───`,

  sect_generic:
`    ⊕  ──  门  派  ──  ⊕
    ╔════════════════╗
    ║  武  学  秘  传  ║
    ║─────────────────║
    ║  ⚔  绝  艺  ⚔  ║
    ╚════════════════╝
    · 天 外 有 天 · 人 外 有 人 ·`,

  // ── 特殊地形 ──────────────────────────────────
  mountain:
`       *         *
      /\\\\         /\\\\
     /  \\\\  *    /  \\\\
    / 险 \\\\  \\\\  / 峰 \\\\
   /─────\\\\──\\\\/─────\\\\
  ≡≡ 云 雾 深 锁 · 路 险 ≡≡`,

  desert:
`  ～ ～ ～  🌵  ～ ～ ～ ～
    .  ·  .  ·  .  ·  .
   ·   黄  沙  漫  漫   ·
  . ·  丝  路  悠  远  · .
   ～ ～ ～ ～ ～ ～ ～ ～`,

  water:
`    ≋≋  汴 河  ≋≋≋≋≋≋
  ⊂ 舟 ⊃  ≈≈≈  ⊂ 舟 ⊃
  ～～～～～～～～～～～～
    渔  歌  互  答  声`,

  forest:
`  ♦ 林 ♦  ♦  ♦  ♦ 林 ♦
  |\\|  |\\|  |\\|  |\\|
  |  \\  |  \\|  \\  | \\
 ─┴──┴──┴──┴──┴──┴──┴─
   深 山 老 林 · 幽 径 深`,

  snow:
`  ❄  *  ❄  *  ❄  *  ❄
   ╱▔▔▔╲     ╱▔▔▔╲
  ╱ 冰  ╲───╱  雪  ╲
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  ─── 千 里 冰 封 ───`,

  border:
`  ▦  ▦  ▦ 边 关 要 塞 ▦  ▦
  ╔══╗          ╔══╗
  ║烽║          ║台║
──╢  ╠──────────╢  ╠──
  ║  ║ 戍 守 边 疆║  ║`,
};

// 根据节点自动选取场景图 key
function getLocationSceneKey(node){
  if(node.sceneKey) return node.sceneKey; // 节点手动指定
  const id = node.id || '';
  // ① 优先用节点id在 NODE_SCENES（独立场景图库）里找
  if(typeof NODE_SCENES !== 'undefined' && NODE_SCENES[id]) return '@@node:' + id;
  // ② 回退：门派通用
  if(node.type === 'sect_location') return 'sect_generic';
  // ③ 回退：地形
  const terrain = node.terrain || '';
  if(terrain.includes('沙漠')) return 'desert';
  if(terrain.includes('冰原')) return 'snow';
  if(terrain.includes('密林') || terrain.includes('竹林')) return 'forest';
  if(terrain.includes('水乡') || terrain.includes('海')) return 'water';
  if(terrain.includes('高山') || terrain.includes('山地')) return 'mountain';
  if(terrain.includes('要塞') || terrain.includes('边')) return 'border';
  // ④ 回退：城市等级
  if(node.tier === 'capital') return 'capital';
  if(node.tier === 'major')   return 'city';
  return 'city_minor';
}

// 根据节点类型返回主题 class
function getLocationThemeClass(node){
  if(node.type === 'sect_location') return 'tl-theme-sect';
  if(node.tier === 'capital')       return 'tl-theme-capital';
  if(node.type === 'city' || node.tier === 'major') return 'tl-theme-city';
  // 野外/小地点
  const terrain = node.terrain || '';
  if(terrain.includes('沙漠') || terrain.includes('冰原') ||
     terrain.includes('密林') || terrain.includes('高山')) return 'tl-theme-wild';
  return 'tl-theme-city';
}

const WORLD_NODES = {

  // ══════════════════════════════
  //  中原腹地
  // ══════════════════════════════
  luoyang: {
    id:'luoyang', name:'洛阳城', icon:'🏙', type:'city', tier:'capital',
    x:0, y:0,   // 中原中心，基准坐标
    region:'中原', terrain:'平原',
    desc:'天下之中，洛水之阳。江湖人士汇聚之地，武林大会常在此举行。集市繁华，酒肆林立，消息最灵通。',
    services:['inn','shop','blacksmith','market','hospital','chess','tavern','crafting','stable','poststation'],
    roads:{ N:'jixian', S:'xinyang', E:'kaifeng', W:'luonan', NE:'zhengzhou', NW:'tongguan', SE:'ruzhou', SW:'nanyang' },
    cityOwner:'neutral', // 中立大城，各方势力交汇
  },
  kaifeng: {
    id:'kaifeng', name:'开封城', icon:'🏯', type:'city', tier:'major',
    x:4, y:1,
    region:'中原', terrain:'平原',
    desc:'宋都开封，八方辐辏，水运发达。汴河船只往来不绝，富甲天下。',
    services:['inn','shop','market','hospital','tavern','crafting','stable','poststation'],
    roads:{ N:'cangzhou', S:'songshan', E:'xuzhou', W:'luoyang', NW:'zhengzhou', SW:'ruzhou', SE:'riyue_city' },
    cityOwner:'neutral',
  },
  zhengzhou: {
    id:'zhengzhou', name:'郑州', icon:'🏘', type:'city', tier:'minor',
    x:2, y:-1,
    region:'中原', terrain:'平原',
    desc:'中原要道，南北交通枢纽。商贾往来频繁，是南下荆楚的必经之地。',
    services:['inn','shop'],
    roads:{ N:'jixian', S:'luoyang', E:'kaifeng', W:'luonan', SE:'ruzhou', SW:'nangong_manor' }
  },
  songshan: {
    id:'songshan', name:'嵩山', icon:'⛰', type:'city', tier:'minor',
    x:3, y:2,
    region:'中原·嵩山', terrain:'高山',
    desc:'中岳嵩山，五岳之中。山势巍峨，古木参天，香客武人络绎不绝。山腰有集市，山顶隐隐可见寺庙金顶。',
    services:['inn','shop'],
    roads:{ N:'kaifeng', S:'ruzhou', W:'luoyang', NW:'zhengzhou', SE:'shaolin_temple' }
  },
  shaolin_temple: {
    id:'shaolin_temple', name:'少林寺', icon:'☸', type:'sect_location', tier:'supreme',
    x:3.5, y:2.5,
    region:'中原·嵩山', terrain:'古刹',
    desc:'少林寺千年古刹，武学圣地。武僧巡逻于回廊之间，大雄宝殿香烟袅袅。达摩院、戒律院深处藏有七十二绝技，非少林弟子不得入内。',
    services:['inn','hospital'],
    sects:['shaolin'],
    roads:{ NW:'songshan' },
    cityOwner:'shaolin',
  },
  ruzhou: {
    id:'ruzhou', name:'汝州', icon:'🏘', type:'city', tier:'minor',
    x:2, y:3,
    region:'中原南部', terrain:'丘陵',
    desc:'汝河流域小城，素有"豫南门户"之称。往南可入荆楚，往东可抵颍水。',
    services:['inn','shop'],
    roads:{ N:'zhengzhou', S:'nanyang', E:'songshan', W:'luoyang', SE:'xinyang', SW:'funiu_mt' }
  },
  jixian: {
    id:'jixian', name:'汲县', icon:'🏘', type:'city', tier:'minor',
    x:1, y:-3,
    region:'中原北部', terrain:'平原',
    desc:'黄河南岸小城，水路便利，是连接中原与河北的要道。',
    services:['inn','shop'],
    roads:{ N:'anyang', S:'luoyang', E:'cangzhou', W:'huazhou', SE:'zhengzhou' }
  },

  // ══════════════════════════════
  //  关中 / 西北
  // ══════════════════════════════
  tongguan: {
    id:'tongguan', name:'潼关', icon:'🏯', type:'city', tier:'major',
    x:-4, y:0,
    region:'关中', terrain:'险关',
    desc:'天下第一险关，据山河之险而守。关城高耸，一夫当关万夫莫开。往西便是长安，往东是洛阳。',
    services:['inn','shop','blacksmith','stable','poststation'],
    roads:{ N:'puzhou', S:'shangzhou', E:'luoyang', W:'xian', NW:'luonan' },
    cityOwner:'neutral', // 险关要道，中立
  },
  xian: {
    id:'xian', name:'长安城', icon:'🏯', type:'city', tier:'capital',
    x:-9, y:0,
    region:'关中', terrain:'盆地',
    desc:'大唐古都，龙脉所在。十三朝帝都，关中平原上的绝世繁华。江湖帮派在此明争暗斗，皇城根下刀光剑影。',
    services:['inn','shop','blacksmith','market','hospital','chess','tavern','crafting','stable','poststation'],
    roads:{ N:'bin_zhou', S:'hanzhong', E:'tongguan', W:'lanzhou', NE:'puzhou', SE:'shangzhou' },
    cityOwner:'neutral',
  },
  luonan: {
    id:'luonan', name:'洛南', icon:'🏘', type:'city', tier:'minor',
    x:-2, y:1,
    region:'秦岭北麓', terrain:'山地',
    desc:'秦岭脚下的小城，山货药材丰富。草药商人聚集于此，也是剑客隐居的好地方。',
    services:['inn','shop'],
    roads:{ N:'luoyang', S:'shangzhou', E:'tongguan', W:'xian' }
  },
  shangzhou: {
    id:'shangzhou', name:'商州', icon:'🏘', type:'city', tier:'minor',
    x:-6, y:3,
    region:'秦岭', terrain:'山地',
    desc:'深山古镇，四周林木参天。秦岭中的要道枢纽，连接关中与汉中。',
    services:['inn','shop'],
    roads:{ N:'tongguan', S:'hanzhong', E:'luonan', W:'xian', NW:'xian' }
  },
  hanzhong: {
    id:'hanzhong', name:'汉中城', icon:'🏘', type:'city', tier:'major',
    x:-8, y:7,
    region:'汉中盆地', terrain:'盆地',
    desc:'汉水源头，天府之国北门。蜀道咽喉，历代兵家必争之地。米仓山以南，秦岭以北。',
    services:['inn','shop','blacksmith','market','tavern','stable','poststation'],
    roads:{ N:'xian', NE:'shangzhou', S:'guangyuan' },
  },
  lanzhou: {
    id:'lanzhou', name:'兰州', icon:'🏘', type:'city', tier:'major',
    x:-18, y:0,
    region:'陇右', terrain:'河谷',
    desc:'黄河穿城而过，丝绸之路要冲。西出玉门关的起点，风沙中带着异域气息。',
    services:['inn','shop','market','tavern','stable','poststation'],
    roads:{ N:'wuwei', S:'linxia', E:'xian', W:'wuwei', NE:'bin_zhou', SE:'qingshui', NW:'guangming_peak', SW:'kongtong_mt' }
  },
  bin_zhou: {
    id:'bin_zhou', name:'彬州', icon:'🏘', type:'city', tier:'minor',
    x:-12, y:-3,
    region:'关中北部', terrain:'高原',
    desc:'泾河上游的古城，黄土高坡边缘。是长安通往西北的要道。',
    services:['inn','shop'],
    roads:{ N:'yinzhou', S:'xian', E:'puzhou', W:'lanzhou', SE:'tongguan' }
  },
  puzhou: {
    id:'puzhou', name:'蒲州', icon:'🏘', type:'city', tier:'minor',
    x:-5, y:-3,
    region:'河东', terrain:'平原',
    desc:'黄河东岸渡口，秦晋咽喉。往北可入山西，往南是关中，黄河渡船日夜不歇。',
    services:['inn','shop'],
    roads:{ N:'jinyang', S:'xian', E:'jixian', W:'bin_zhou', SE:'tongguan' }
  },

  // ══════════════════════════════
  //  华山 / 陕西
  // ══════════════════════════════
  huayin: {
    id:'huayin', name:'华阴县', icon:'🏘', type:'city', tier:'minor',
    x:-3, y:-2,
    region:'关中东部·华山脚下', terrain:'平原',
    desc:'华山脚下的小县城，往来香客武人在此落脚歇息。城中旅店食肆林立，夜晚常听得山上传来剑鸣之声。',
    services:['inn','shop'],
    roads:{ N:'puzhou', S:'luonan', E:'tongguan', W:'xian', SE:'luoyang', NE:'huashan_sect' },
    cityOwner:'neutral', // 华山脚下但中立
  },
  huashan_sect: {
    id:'huashan_sect', name:'华山·剑宗峰', icon:'⚔', type:'sect_location', tier:'major',
    x:-2.5, y:-2.5,
    region:'关中东部·华山绝顶', terrain:'险峰',
    desc:'华山天下险，剑气纵横。华山派总坛藏于绝顶之上，下山唯一道路蜿蜒于千丈峭壁之间。气宗剑宗之争延续百年，绝顶论剑令天下英雄魂牵梦萦。',
    services:['inn','hospital'],
    sects:['huashan'],
    roads:{ SW:'huayin' },
    cityOwner:'huashan',
  },
  huazhou: {
    id:'huazhou', name:'华州', icon:'🏘', type:'city', tier:'minor',
    x:-4, y:-2,
    region:'关中', terrain:'平原',
    desc:'华山脚下的繁华市镇，往来侠客颇多。刀剑铺和武馆林立，是习武之人常驻之地。',
    services:['inn','shop','blacksmith'],
    roads:{ N:'puzhou', S:'luonan', E:'huayin', W:'xian', NE:'jixian' }
  },

  // ══════════════════════════════
  //  山西 / 河北
  // ══════════════════════════════
  jinyang: {
    id:'jinyang', name:'晋阳城', icon:'🏯', type:'city', tier:'major',
    x:-5, y:-8,
    region:'山西', terrain:'盆地',
    desc:'晋中腹地，表里山河之形胜。煤铁之乡，兵器锻造业极为发达，天下名刀多出于此。',
    services:['inn','shop','forge','market','tavern','stable','poststation'],
    roads:{ N:'datong', S:'puzhou', E:'cangzhou', W:'fenzhou', SE:'anyang' },
    cityOwner:'neutral',
  },
  datong: {
    id:'datong', name:'大同', icon:'🏯', type:'city', tier:'major',
    x:-4, y:-14,
    region:'山西北部', terrain:'高原',
    desc:'北方军事重镇，紧邻大漠。塞外风沙与中原文明在此交汇，北方武人豪迈剽悍。',
    services:['inn','shop','blacksmith','tavern','stable','poststation'],
    roads:{ N:'yanmen', S:'jinyang', E:'cangzhou', W:'shuozhou', SE:'anyang' }
  },
  yanmen: {
    id:'yanmen', name:'雁门关', icon:'🏯', type:'city', tier:'major',
    x:-3, y:-18,
    region:'北疆', terrain:'险关',
    desc:'天下九塞之首，雁门天险。北邻大漠，契丹铁骑常叩关而来。萧峰曾在此大战群雄。',
    services:['inn','blacksmith','stable','poststation'],
    roads:{ N:'caoyuan', S:'datong', E:'youzhou', W:'shuozhou' }
  },
  cangzhou: {
    id:'cangzhou', name:'沧州', icon:'🏯', type:'city', tier:'major',
    x:5, y:-8,
    region:'河北', terrain:'平原',
    desc:'武风极盛，镖局云集。沧州一带侠士如云，打镖走镖是当地主业，飞刀门在此根深叶茂。',
    services:['inn','shop','forge','guild','hospital','tavern','stable','poststation'],
    roads:{ N:'youzhou', S:'kaifeng', E:'haicang', W:'jinyang', SE:'xuzhou', SW:'anyang', NE:'tiandibang_fort' },
    cityOwner:'neutral', // 镖局重镇，但天地帮在附近
  },
  anyang: {
    id:'anyang', name:'安阳', icon:'🏘', type:'city', tier:'minor',
    x:2, y:-6,
    region:'河北南部', terrain:'平原',
    desc:'殷商古都，甲骨文的故乡。江湖中不少奇门遁甲之术传自此地。',
    services:['inn','shop'],
    roads:{ N:'cangzhou', S:'jixian', E:'xuzhou', W:'jinyang', SE:'kaifeng' }
  },
  youzhou: {
    id:'youzhou', name:'幽州·燕京', icon:'🏯', type:'city', tier:'capital',
    x:6, y:-14,
    region:'北方', terrain:'平原',
    desc:'北方重镇燕京，天龙帮总坛。辽阔北地的政治中心，汉胡杂居，武风剽悍，江湖势力错综复杂。',
    services:['inn','shop','blacksmith','market','hospital','tavern','crafting','stable','poststation'],
    roads:{ N:'yanmen', S:'cangzhou', E:'liaoyang', W:'datong', SE:'xuzhou', NE:'xuegu_fort' },
    cityOwner:'neutral', // 天龙帮在此，但城市本身中立
  },
  haicang: {
    id:'haicang', name:'海仓港', icon:'⚓', type:'city', tier:'minor',
    x:10, y:-6,
    region:'渤海沿岸', terrain:'海港',
    desc:'渤海边的重要港口，海船往来频繁。海沙派在此有分舵，海风咸腥，充满异域风情。',
    services:['inn','shop'],
    roads:{ N:'liaoyang', S:'xuzhou', W:'cangzhou', SW:'anyang' },
    cityOwner:'neutral', // 海沙派有分舵，但港口中立
  },

  // ══════════════════════════════
  //  山东 / 江淮
  // ══════════════════════════════
  xuzhou: {
    id:'xuzhou', name:'徐州', icon:'🏯', type:'city', tier:'major',
    x:8, y:3,
    region:'江淮', terrain:'平原',
    desc:'兵家必争之地，历代征战之所。南临淮水，北接中原，是南北交通要道。',
    services:['inn','shop','blacksmith','market','tavern','stable','poststation'],
    roads:{ N:'cangzhou', S:'yangzhou', E:'haicang', W:'kaifeng', SE:'nanjing', SW:'ruzhou' },
    cityOwner:'neutral',
  },
  yangzhou: {
    id:'yangzhou', name:'扬州城', icon:'🏮', type:'city', tier:'capital',
    x:11, y:8,
    region:'江南', terrain:'水乡',
    desc:'烟花三月下扬州。江南第一繁华地，运河水运汇聚于此。南宫世家总坛，风流才子与侠客同游。',
    services:['inn','shop','market','hospital','chess','tavern','crafting','stable','poststation'],
    sects:['nangong'],
    roads:{ N:'xuzhou', S:'nanjing', E:'suzhou', W:'luzhou', NW:'ruzhou', SW:'hefei', SE:'tianlong_stronghold' },
    cityOwner:'nangong',
  },
  nanjing: {
    id:'nanjing', name:'金陵·南京', icon:'🏙', type:'city', tier:'capital',
    x:9, y:12,
    region:'江南', terrain:'丘陵',
    desc:'六朝金粉地，江南重镇。秦淮河两岸歌舞升平，江湖豪杰与文人雅士共聚于此。',
    services:['inn','shop','market','hospital','tavern','crafting','stable','poststation'],
    roads:{ N:'xuzhou', S:'hangzhou', E:'suzhou', W:'luzhou', NW:'yangzhou', SW:'hefei' },
    cityOwner:'neutral',
  },
  suzhou: {
    id:'suzhou', name:'苏州', icon:'🏮', type:'city', tier:'major',
    x:14, y:12,
    region:'江南', terrain:'水乡',
    desc:'上有天堂，下有苏杭。运河织锦之都，园林幽深，桃花岛往来船只常停于此。',
    services:['inn','shop','blacksmith','market','hospital','chess','tavern','stable','poststation'],
    roads:{ N:'haicang', S:'hangzhou', E:'taohuadao_coast', W:'nanjing', NW:'yangzhou' }
  },
  hangzhou: {
    id:'hangzhou', name:'杭州', icon:'🏮', type:'city', tier:'major',
    x:13, y:15,
    region:'江南', terrain:'水乡',
    desc:'西湖天下景，杭州无处不美。天目山武学传承于此，侠客游山玩水之余，也免不了江湖争斗。',
    services:['inn','shop','market','chess','crafting','stable','poststation','hospital'],
    roads:{ N:'suzhou', S:'mingzhou', E:'taohuadao_coast', W:'nanjing', SW:'hefei', NE:'lingxiao_tower' },
    cityOwner:'neutral',
  },

  // ══════════════════════════════
  //  东海 / 桃花岛
  // ══════════════════════════════
  taohuadao_coast: {
    id:'taohuadao_coast', name:'桃花岛渡口', icon:'🌸', type:'city', tier:'minor',
    x:16, y:13,
    region:'东海沿岸', terrain:'海港',
    desc:'出海至桃花岛的唯一渡口，岛主护送才可上岛。海风习习，桃花瓣常飘落于船头。',
    services:['inn'],
    roads:{ W:'suzhou', N:'haicang', S:'mingzhou' }
  },
  taohuadao: {
    id:'taohuadao', name:'桃花岛', icon:'🌸', type:'city', tier:'minor',
    x:19, y:14,
    region:'东海', terrain:'海岛',
    desc:'东海之上桃花盛开之处，岛上奇花异树芬芳扑鼻。外围有迷阵布设，不识路径者绕行数日仍在原地打转。岛上渔家村落错落有致，落英缤纷。',
    services:['inn','shop'],
    roads:{ W:'taohuadao_coast', E:'taohua_hall' },
    cityOwner:'taohuadao',
  },
  taohua_hall: {
    id:'taohua_hall', name:'桃花堂·东邪总坛', icon:'🌺', type:'sect_location', tier:'major',
    x:20, y:14,
    region:'东海·桃花岛腹地', terrain:'仙岛',
    desc:'落英神剑剑法的发源之地，岛主亲手布下奇门迷阵护卫四周。桃花树下藏有无数机关，堂中珍藏着东邪数十年心血的武学秘典，轻功飞花、奇门遁甲尽在于此。',
    services:['hospital'],
    sects:['taohuadao'],
    roads:{ W:'taohuadao' },
    cityOwner:'taohuadao',
  },
  mingzhou: {
    id:'mingzhou', name:'明州', icon:'🏘', type:'city', tier:'minor',
    x:15, y:18,
    region:'浙东沿海', terrain:'海港',
    desc:'浙东出海门户，海商云集。日月神教部分成员在此有联络点，鱼龙混杂。',
    services:['inn','shop'],
    roads:{ N:'hangzhou', W:'hefei', NW:'nanjing', E:'haisha_island' }
  },

  // ══════════════════════════════
  //  湖北 / 武当
  // ══════════════════════════════
  nanyang: {
    id:'nanyang', name:'南阳', icon:'🏘', type:'city', tier:'minor',
    x:1, y:6,
    region:'南阳盆地', terrain:'盆地',
    desc:'卧龙岗所在，诸葛故里。四面山地环绕，盆地中的繁荣集市，是南下荆楚的必经之地。',
    services:['inn','shop'],
    roads:{ N:'luoyang', S:'xiangyang', E:'ruzhou', W:'hanzhong', NE:'xinyang', SE:'jingzhou' }
  },
  xiangyang: {
    id:'xiangyang', name:'襄阳城', icon:'🏯', type:'city', tier:'major',
    x:2, y:10,
    region:'湖北', terrain:'平原',
    desc:'汉水北岸雄城，历来兵家必争。郭靖曾守城数十年。城内江湖人物众多，消息灵通。',
    services:['inn','shop','blacksmith','market','herbalism','tavern','crafting','stable','poststation'],
    roads:{ N:'nanyang', S:'jingzhou', E:'wuhan', W:'wudang_town', NW:'hanzhong', SE:'xinyang' }
  },
  wudang_town: {
    id:'wudang_town', name:'武当山镇', icon:'☯', type:'city', tier:'minor',
    x:-2, y:10,
    region:'湖北·武当山', terrain:'山地',
    desc:'武当山下的集镇，道家弟子与江湖人士共处。上山需经道门盘查，镇上道观香烟袅袅。',
    services:['inn','shop','hospital'],
    sects:['wudang'],
    roads:{ N:'nanyang', S:'jingzhou', E:'xiangyang', W:'hanzhong', SE:'shashi', NW:'wudang_peak' },
    cityOwner:'wudang',
  },
  jingzhou: {
    id:'jingzhou', name:'荆州城', icon:'🏯', type:'city', tier:'major',
    x:3, y:14,
    region:'湖北', terrain:'平原',
    desc:'古来兵家必争之地，天下咽喉。长江穿城而过，南来北往的船只无不经此。',
    services:['inn','shop','blacksmith','market','tavern','stable','poststation'],
    roads:{ N:'xiangyang', S:'changsha', E:'wuhan', W:'shashi', NW:'wudang_town', SW:'yueyang' }
  },
  wuhan: {
    id:'wuhan', name:'武汉·武昌', icon:'🏯', type:'city', tier:'major',
    x:6, y:14,
    region:'湖北', terrain:'平原',
    desc:'长江汉水交汇之处，武昌鱼闻名遐迩。武林门派在此设有多处据点，商业繁荣，鱼龙混杂。',
    services:['inn','shop','blacksmith','market','tavern','stable','poststation'],
    roads:{ N:'xinyang', S:'jiujiang', E:'hefei', W:'jingzhou', SW:'yueyang', NW:'xiangyang' }
  },
  shashi: {
    id:'shashi', name:'沙市', icon:'🏘', type:'city', tier:'minor',
    x:1, y:15,
    region:'湖北西部', terrain:'平原',
    desc:'长江边的古镇，水运繁忙。往西可入巴蜀，往南通湖南，是长江中游的重要渡口。',
    services:['inn','shop'],
    roads:{ N:'wudang_town', S:'yueyang', E:'jingzhou', W:'enshi', NW:'hanzhong' }
  },
  xinyang: {
    id:'xinyang', name:'信阳', icon:'🏘', type:'city', tier:'minor',
    x:5, y:8,
    region:'豫南', terrain:'丘陵',
    desc:'大别山北麓，是中原进入江淮的要道。山地多出名药，采药人常在此出没。',
    services:['inn','shop'],
    roads:{ N:'ruzhou', S:'wuhan', E:'luzhou', W:'xiangyang', NE:'kaifeng', NW:'luoyang', SE:'hefei', SW:'nanyang' }
  },
  hefei: {
    id:'hefei', name:'合肥', icon:'🏘', type:'city', tier:'minor',
    x:9, y:10,
    region:'江淮', terrain:'平原',
    desc:'合肥周边湖泊众多，是水战要地。镖局和船帮在此竞争激烈。',
    services:['inn','shop','guild'],
    roads:{ N:'xinyang', S:'nanjing', E:'yangzhou', W:'wuhan', SE:'hangzhou' }
  },
  luzhou: {
    id:'luzhou', name:'庐州', icon:'🏘', type:'city', tier:'minor',
    x:7, y:9,
    region:'江淮', terrain:'丘陵',
    desc:'巢湖边的古城，湖中鱼产丰富。江湖人在此休整，酒楼里消息颇多。',
    services:['inn','shop'],
    roads:{ N:'xinyang', S:'hefei', E:'yangzhou', W:'wuhan', SE:'nanjing' }
  },

  // ══════════════════════════════
  //  湖南 / 江西
  // ══════════════════════════════
  yueyang: {
    id:'yueyang', name:'岳阳楼', icon:'🏮', type:'city', tier:'minor',
    x:4, y:17,
    region:'湖南', terrain:'湖滨',
    desc:'洞庭湖畔，范仲淹留文千古。湖面浩渺，洞庭水贼与镖局之间恩怨不断。',
    services:['inn','shop'],
    roads:{ N:'jingzhou', S:'changsha', E:'wuhan', W:'shashi' }
  },
  changsha: {
    id:'changsha', name:'长沙', icon:'🏯', type:'city', tier:'major',
    x:5, y:21,
    region:'湖南', terrain:'盆地',
    desc:'楚地中心，屈原故乡之侧。潇湘武学别具一格，剑舞如诗，凌霄阁在此设有分坛。',
    services:['inn','shop','market','stable','poststation'],
    roads:{ N:'yueyang', S:'hengyang', E:'jiujiang', W:'zhangjiajie', NE:'wuhan' }
  },
  jiujiang: {
    id:'jiujiang', name:'九江', icon:'🏘', type:'city', tier:'minor',
    x:9, y:18,
    region:'江西', terrain:'平原',
    desc:'长江中游要冲，庐山脚下。庐山隐者众多，武功深藏不露，是散修们的圣地。',
    services:['inn','shop'],
    roads:{ N:'wuhan', S:'nanchang', E:'hefei', W:'yueyang' }
  },
  nanchang: {
    id:'nanchang', name:'南昌', icon:'🏘', type:'city', tier:'minor',
    x:11, y:21,
    region:'江西', terrain:'平原',
    desc:'赣江下游的重要城市，南北水运枢纽。武林人士在此鱼龙混杂。',
    services:['inn','shop'],
    roads:{ N:'jiujiang', S:'ganzhou', E:'fuzhou', W:'changsha', NW:'hefei' }
  },
  hengyang: {
    id:'hengyang', name:'衡阳', icon:'🏘', type:'city', tier:'minor',
    x:4, y:25,
    region:'湖南', terrain:'盆地',
    desc:'南岳衡山脚下，道观武馆众多。衡山派虽不在25大门派之列，但剑法也颇有名气。',
    services:['inn','shop'],
    roads:{ N:'changsha', S:'guilin', E:'ganzhou', W:'zhangjiajie', SE:'fuzhou' }
  },
  zhangjiajie: {
    id:'zhangjiajie', name:'张家界', icon:'🏔', type:'city', tier:'minor',
    x:1, y:22,
    region:'湘西', terrain:'奇峰',
    desc:'绝壁奇峰，云雾缭绕。凌霄阁部分弟子隐居于此练功，山石间时有剑光闪过。',
    services:['inn'],
    sects:['lingxiao'],
    roads:{ N:'shashi', S:'hengyang', E:'changsha', W:'enshi' }
  },
  enshi: {
    id:'enshi', name:'恩施', icon:'🏘', type:'city', tier:'minor',
    x:-2, y:18,
    region:'鄂西', terrain:'山地',
    desc:'土家族聚居地，山高林密。隐藏着不少世外高人，也是进入四川的古道之一。',
    services:['inn','shop'],
    roads:{ N:'shashi', S:'zhangjiajie', E:'jingzhou', W:'chongqing' }
  },

  // ══════════════════════════════
  //  四川 / 巴蜀
  // ══════════════════════════════
  guangyuan: {
    id:'guangyuan', name:'广元', icon:'🏘', type:'city', tier:'minor',
    x:-7, y:11,
    region:'四川北部', terrain:'山地',
    desc:'入川第一关，剑门险道的起点。"剑门天下险，一夫守关万夫莫开"，古来兵家必争。',
    services:['inn','shop'],
    roads:{ N:'hanzhong', S:'chengdu', E:'enshi', W:'songpan', SE:'dazhou' }
  },
  chengdu: {
    id:'chengdu', name:'成都', icon:'🏙', type:'city', tier:'capital',
    x:-8, y:17,
    region:'四川', terrain:'盆地',
    desc:'天府之国，成都平原。锦城丝管，茶馆遍布，江湖豪杰安居于此。唐门在此经营产业，势力庞大。',
    services:['inn','shop','blacksmith','market','guild','hospital','herbalism','tavern','crafting','stable','poststation'],
    roads:{ N:'guangyuan', S:'leshan', E:'dazhou', W:'songpan', NE:'hanzhong', SE:'yibin', NW:'qingcheng_mt' },
    cityOwner:'neutral', // 唐门势力庞大，但城市本身中立
  },
  tangzhou: {
    id:'tangzhou', name:'唐州城', icon:'🏹', type:'city', tier:'minor',
    x:-6, y:19,
    region:'四川·唐门', terrain:'山城',
    desc:'四川西南的山城小镇，地势险要，易守难攻。镇上百姓半数与唐门有渊源，暗器铺和药铺扎堆开设，外来武人进城都不敢造次。',
    services:['inn','shop','blacksmith'],
    roads:{ N:'chengdu', S:'luzhou_sz', E:'dazhou', W:'leshan', SE:'yibin', NW:'tangmen_hall' }
  },
  tangmen_hall: {
    id:'tangmen_hall', name:'唐门·暗器总堂', icon:'💀', type:'sect_location', tier:'major',
    x:-6.5, y:18.5,
    region:'四川·唐门山寨', terrain:'山寨',
    desc:'唐门总堂深藏于唐州城外山腰，机关陷阱遍布通道。传说进入唐门者凡三步必有一机关，凡十步必有一暗弩。唐门弟子在此修炼天下第一暗器绝学，飞针走线，百步穿杨。',
    services:['shop'],
    sects:['tangmen'],
    roads:{ SE:'tangzhou' },
    cityOwner:'tangmen',
  },
  emei_shan: {
    id:'emei_shan', name:'峨眉山', icon:'🌄', type:'city', tier:'minor',
    x:-9, y:20,
    region:'四川·峨眉山', terrain:'仙山',
    desc:'峨眉天下秀，金顶云雾缭绕。佛光普照，香客络绎不绝。山道盘旋，奇花异草遍布山间，据说山顶有仙气，内力修炼事半功倍。',
    services:['inn','hospital'],
    roads:{ N:'chengdu', S:'yibin', E:'tangzhou', W:'luding', NE:'leshan', SE:'emei_sect' }
  },
  emei_sect: {
    id:'emei_sect', name:'峨眉派·金顶禅院', icon:'🌺', type:'sect_location', tier:'major',
    x:-8.5, y:20.5,
    region:'四川·峨眉金顶', terrain:'仙山绝顶',
    desc:'峨眉金顶之上，白衣女侠临风而立，倚天剑法天下无双。禅院清幽，梵音绕梁，修炼于此的弟子兼具佛门慈悲与剑客锐气，令人既生敬畏又不忍相犯。',
    services:['hospital'],
    sects:['emei'],
    roads:{ NW:'emei_shan' },
    cityOwner:'emei',
  },
  leshan: {
    id:'leshan', name:'乐山', icon:'🏘', type:'city', tier:'minor',
    x:-7, y:19,
    region:'四川', terrain:'山地',
    desc:'大佛之城，三江汇流。佛门气息浓厚，少林分寺在此传播佛法，兼修武功。',
    services:['inn','shop','hospital'],
    roads:{ N:'chengdu', S:'emei_shan', E:'tangzhou', W:'luding' }
  },
  dazhou: {
    id:'dazhou', name:'达州', icon:'🏘', type:'city', tier:'minor',
    x:-3, y:17,
    region:'四川东部', terrain:'丘陵',
    desc:'巴中盆地的商业重镇，连接四川与湖广的要道。盐商汇聚，也是江湖消息的集散地。',
    services:['inn','shop','market'],
    roads:{ N:'guangyuan', S:'tangzhou', E:'chongqing', W:'chengdu' }
  },
  chongqing: {
    id:'chongqing', name:'重庆·渝州', icon:'🏯', type:'city', tier:'major',
    x:-2, y:19,
    region:'巴蜀', terrain:'山城',
    desc:'两江汇流之地，山城雄立。码头帮会势力庞大，袍哥文化盛行，出入川渝的必经之地。',
    services:['inn','shop','market','stable','poststation'],
    roads:{ N:'dazhou', S:'guiyang', E:'enshi', W:'tangzhou', SE:'zhangjiajie' }
  },
  yibin: {
    id:'yibin', name:'宜宾·戎州', icon:'🏘', type:'city', tier:'minor',
    x:-6, y:23,
    region:'四川南部', terrain:'山地',
    desc:'长江上游第一城，五粮液的产地。酒香弥漫的古城，出川入滇的重要水陆通道。',
    services:['inn','shop'],
    roads:{ N:'emei_shan', S:'guiyang', E:'chongqing', W:'luding' }
  },
  songpan: {
    id:'songpan', name:'松潘', icon:'🏔', type:'city', tier:'minor',
    x:-14, y:13,
    region:'川西高原', terrain:'高原',
    desc:'藏羌交界的古城，雪山草甸相接。逍遥派弟子偶尔出没于此，高原功法在此流传。',
    services:['inn'],
    roads:{ N:'xian', S:'chengdu', E:'guangyuan', W:'litang' },
    cityOwner:'xiaoyao', // 逍遥派势力范围
  },

  // ══════════════════════════════
  //  云贵 / 西南
  // ══════════════════════════════
  guiyang: {
    id:'guiyang', name:'贵阳', icon:'🏘', type:'city', tier:'minor',
    x:0, y:26,
    region:'贵州', terrain:'高原',
    desc:'贵州高原上的集市，少数民族聚居。苗疆秘境的边缘，进入五毒教势力范围的前哨。',
    services:['inn','shop'],
    roads:{ N:'chongqing', S:'wudu_miao', E:'hengyang', W:'lijiang', SE:'guilin' }
  },
  wudu_miao: {
    id:'wudu_miao', name:'苗疆村寨', icon:'🌿', type:'city', tier:'minor',
    x:-1, y:30,
    region:'苗疆', terrain:'密林',
    desc:'苗疆深处的神秘村落，苗族人在此世代繁衍。村中草药奇异，蛊术之声不绝于耳。外来人进村需有引路人，否则极易迷失于密林蛊阵之中。',
    services:['inn','shop','hospital'],
    roads:{ N:'guiyang', S:'dali', E:'guilin', W:'lijiang', NE:'wudu_sect' },
    cityOwner:'wudu', // 五毒教势力范围
  },
  wudu_sect: {
    id:'wudu_sect', name:'五毒教·蛊毒圣地', icon:'🐍', type:'sect_location', tier:'major',
    x:-0.5, y:29.5,
    region:'苗疆·五毒圣地', terrain:'密林深处',
    desc:'五毒教总坛藏于苗疆密林深处，毒雾终年不散，外人踏入必中奇毒。圣坛之内蛊毒遍地，苗女歌声如蛊令人神迷。五毒绝学在此传授，以毒为剑，以蛊制敌。',
    services:['hospital'],
    sects:['wudu'],
    roads:{ SW:'wudu_miao' },
    cityOwner:'wudu',
  },
  dali: {
    id:'dali', name:'大理城', icon:'🌸', type:'city', tier:'major',
    x:-5, y:32,
    region:'云南·大理', terrain:'高原湖滨',
    desc:'苍山洱海，大理国故都。天龙寺藏有绝世武功，段家六脉神剑名满天下。点苍派亦在此地。',
    services:['inn','shop','market','hospital','herbalism','stable','poststation'],
    sects:['diancang'],
    roads:{ N:'lijiang', S:'tengchong', E:'wudu_miao', W:'baoshan', SW:'diancang_mt' },
    cityOwner:'diancang', // 点苍派控制大理地区
  },
  guilin: {
    id:'guilin', name:'桂林', icon:'🏮', type:'city', tier:'minor',
    x:5, y:30,
    region:'广西', terrain:'奇峰',
    desc:'桂林山水甲天下。奇峰怪石，漓江泛舟，是江湖中隐居修炼的绝妙之地。',
    services:['inn','shop'],
    roads:{ N:'hengyang', S:'guangzhou', E:'ganzhou', W:'wudu_miao' }
  },
  guangzhou: {
    id:'guangzhou', name:'广州', icon:'🏙', type:'city', tier:'major',
    x:7, y:36,
    region:'岭南', terrain:'平原',
    desc:'南海之滨的繁华港城，海上丝绸之路起点。东西方贸易汇聚于此，充满异国风情。',
    services:['inn','shop','market','crafting','stable','poststation'],
    roads:{ N:'guilin', S:'nanhai', E:'chaozhou', W:'qinzhou' }
  },
  lijiang: {
    id:'lijiang', name:'丽江', icon:'🏔', type:'city', tier:'minor',
    x:-8, y:30,
    region:'云南', terrain:'高原',
    desc:'纳西古城，玉龙雪山脚下。古老的武学传承在此保留，天高地远，是世外桃源。',
    services:['inn','shop'],
    roads:{ N:'dali', S:'tengchong', E:'guiyang', W:'litang', NE:'chengdu' }
  },
  ganzhou: {
    id:'ganzhou', name:'赣州', icon:'🏘', type:'city', tier:'minor',
    x:10, y:26,
    region:'江西南部', terrain:'丘陵',
    desc:'赣南重镇，客家文化发祥地。山高林密，隐居于此的武林高手不在少数。',
    services:['inn','shop'],
    roads:{ N:'nanchang', S:'guangzhou', E:'fuzhou', W:'hengyang' }
  },
  fuzhou: {
    id:'fuzhou', name:'福州', icon:'🏘', type:'city', tier:'minor',
    x:15, y:23,
    region:'福建', terrain:'丘陵',
    desc:'闽江入海口，东南海港。海商与海盗并存，海沙派在此有重要据点。',
    services:['inn','shop','guild'],
    sects:['haisha'],
    roads:{ N:'nanchang', S:'chaozhou', W:'ganzhou', NW:'hangzhou' },
    cityOwner:'haisha', // 海沙派重要据点
  },

  // ══════════════════════════════
  //  西域 / 西北
  // ══════════════════════════════
  wuwei: {
    id:'wuwei', name:'武威·凉州', icon:'🏘', type:'city', tier:'minor',
    x:-24, y:0,
    region:'河西走廊', terrain:'戈壁',
    desc:'河西走廊东端，古代凉州重镇。丝路商队在此歇脚，西域奇人异士汇聚。',
    services:['inn','shop','market'],
    roads:{ N:'dunhuang', S:'linxia', E:'lanzhou', W:'zhangye', NE:'yinzhou' }
  },
  zhangye: {
    id:'zhangye', name:'张掖·甘州', icon:'🏘', type:'city', tier:'minor',
    x:-32, y:0,
    region:'河西走廊', terrain:'绿洲',
    desc:'祁连山下的绿洲，丹霞地貌奇特。西夏秘宗在此有隐秘传承，异域武功神秘莫测。',
    services:['inn','shop'],
    roads:{ N:'dunhuang', S:'xining', E:'wuwei', W:'dunhuang' }
  },
  dunhuang: {
    id:'dunhuang', name:'敦煌', icon:'🏮', type:'city', tier:'minor',
    x:-42, y:-2,
    region:'西域门户', terrain:'沙漠绿洲',
    desc:'丝绸之路的明珠，莫高窟藏有无数绝世典籍。武林中流传，洞窟深处有上古武功秘笈。',
    services:['inn','shop'],
    roads:{ N:'yumenguan', S:'qinghai', E:'wuwei', W:'yumenguan' }
  },
  yumenguan: {
    id:'yumenguan', name:'玉门关', icon:'🏯', type:'city', tier:'minor',
    x:-50, y:-5,
    region:'西域入口', terrain:'险关',
    desc:'出了玉门关便是西域。春风不度玉门关，黄沙漫漫。西夏秘宗、昆仑派、逍遥派弟子均在此出没。',
    services:['inn'],
    roads:{ N:'caoyuan', S:'qinghai', E:'dunhuang', W:'guizi', NE:'xiyu_city' }
  },
  guizi: {
    id:'guizi', name:'龟兹·库车', icon:'🌙', type:'city', tier:'minor',
    x:-58, y:-2,
    region:'西域', terrain:'绿洲城邦',
    desc:'西域三十六国之一，音乐之乡。西夏秘宗在此留有古老传承，密宗佛法与江湖武功交融。',
    services:['inn','shop'],
    roads:{ N:'xiyu_city', S:'hetian', E:'yumenguan', W:'xizhou' }
  },
  xiyu_city: {
    id:'xiyu_city', name:'西域城邦', icon:'🌙', type:'city', tier:'minor',
    x:-52, y:-10,
    region:'西域北道', terrain:'草原',
    desc:'西域北道上的城邦，突厥与汉人杂居。西夏秘宗和天山派的势力在此交汇，暗流涌动。',
    sects:['xixia','tianshan'],
    services:['inn','shop'],
    roads:{ N:'caoyuan', S:'guizi', E:'yumenguan', W:'hetian' },
    cityOwner:'neutral', // 西夏和天山交汇，中立
  },
  hetian: {
    id:'hetian', name:'和田·于阗', icon:'💎', type:'city', tier:'minor',
    x:-58, y:5,
    region:'西域南道', terrain:'绿洲',
    desc:'玉石之都，于阗美玉天下闻名。逍遥派曾在此地留有分支，功法奇特，与佛法相融。',
    services:['inn','shop'],
    roads:{ N:'guizi', S:'qinghai', E:'yumenguan', W:'xizhou' }
  },
  xizhou: {
    id:'xizhou', name:'高昌故国', icon:'🌙', type:'city', tier:'minor',
    x:-65, y:0,
    region:'西域极西', terrain:'沙漠绿洲',
    desc:'丝路最西端的汉文化据点。波斯商人、胡人武士、汉家侠客在此相遇，是明教西传的中继站。',
    services:['inn','shop'],
    roads:{ N:'caoyuan', S:'hetian', E:'guizi', W:'caoyuan' }
  },
  yinzhou: {
    id:'yinzhou', name:'灵州·银川', icon:'🌙', type:'city', tier:'major',
    x:-16, y:-6,
    region:'西夏', terrain:'平原',
    desc:'西夏故都，平原开阔。昔日西夏王朝在此建立皇城，如今虽已衰落，但遗留的宫殿建筑仍显昔日气派。城中有不少密宗僧侣出没，据说皇宫废墟中藏有惊天秘密。',
    services:['inn','shop','market','stable','poststation'],
    roads:{ N:'caoyuan', S:'lanzhou', E:'bin_zhou', W:'wuwei', SE:'xian', NW:'xixia_palace' },
    cityOwner:'xixia', // 西夏秘宗势力范围
  },
  linxia: {
    id:'linxia', name:'临夏·河州', icon:'🏘', type:'city', tier:'minor',
    x:-20, y:4,
    region:'甘南', terrain:'高原',
    desc:'多民族聚居的要道小城，伊斯兰文化与汉文化交融。武风彪悍，民间高手众多。',
    services:['inn','shop'],
    roads:{ N:'lanzhou', S:'xining', E:'lanzhou', W:'wuwei' }
  },
  xining: {
    id:'xining', name:'西宁', icon:'🏘', type:'city', tier:'minor',
    x:-24, y:6,
    region:'青海', terrain:'高原',
    desc:'青藏高原东缘，高原空气清冽。逍遥派与天山派的弟子在此高原修炼内功，效果极佳。',
    services:['inn','shop'],
    roads:{ N:'linxia', S:'qinghai', E:'linxia', W:'zhangye' }
  },
  qinghai: {
    id:'qinghai', name:'青海湖', icon:'🌊', type:'city', tier:'minor',
    x:-32, y:8,
    region:'青海', terrain:'高原湖泊',
    desc:'天空之镜，高原大泽。周围荒无人烟，逍遥派在湖畔建有仙台，天池绝学在此传授。',
    services:['inn'],
    sects:['xiaoyao'],
    roads:{ N:'xining', S:'litang', E:'xining', W:'dunhuang' },
    cityOwner:'xiaoyao', // 逍遥派在湖畔有仙台
  },
  litang: {
    id:'litang', name:'理塘', icon:'🏔', type:'city', tier:'minor',
    x:-20, y:18,
    region:'川西高原', terrain:'高原',
    desc:'世界上最高的城市之一，藏族文化圣地。昆仑派和逍遥派的弟子在此高原修炼。',
    services:['inn'],
    roads:{ N:'songpan', S:'lijiang', E:'chengdu', W:'qinghai' }
  },

  // ══════════════════════════════
  //  塞外 / 北方草原
  // ══════════════════════════════
  caoyuan: {
    id:'caoyuan', name:'草原王庭', icon:'🐴', type:'city', tier:'major',
    x:-10, y:-24,
    region:'大漠草原', terrain:'草原',
    desc:'北方游牧民族的王庭所在。辽阔草原，骑射无双。玄冥教在此有秘密据点，极寒武功在此修炼。',
    services:['inn','shop','blacksmith','stable','poststation'],
    sects:['xuanming'],
    roads:{ N:'xuanming_base', S:'yanmen', E:'liaoyang', W:'xiyu_city', SE:'youzhou', SW:'yumenguan' },
    cityOwner:'xuanming', // 玄冥教秘密据点
  },
  liaoyang: {
    id:'liaoyang', name:'辽阳·上京', icon:'🏯', type:'city', tier:'major',
    x:10, y:-18,
    region:'辽东', terrain:'平原',
    desc:'契丹重镇，辽国陪都。北方武人汇聚之地，马术弓术天下无双，血骨门在此经营多年。',
    services:['inn','shop','blacksmith','stable','poststation'],
    sects:['xuegu'],
    roads:{ N:'caoyuan', S:'youzhou', W:'datong', SW:'cangzhou' },
    cityOwner:'xuegu', // 血骨门在此经营多年
  },
  xuanming_base: {
    id:'xuanming_base', name:'极北冰原', icon:'🧊', type:'city', tier:'minor',
    x:-10, y:-32,
    region:'北疆极寒', terrain:'冰原',
    desc:'万里冰封的极北荒原，寒风刺骨，白茫茫一片。普通人到此已是极限，但据说冰原深处藏有玄冥教总坛，修炼寒冰内力者以此为圣地，冰天雪地中内力精进神速。',
    services:[],
    roads:{ S:'caoyuan', E:'liaoyang', N:'xuanming_hall' },
    cityOwner:'xuanming',
  },
  xuanming_hall: {
    id:'xuanming_hall', name:'玄冥殿·玄冥教', icon:'⛧', type:'sect_location', tier:'minor',
    x:-10, y:-33,
    region:'北疆极寒·冰原深处', terrain:'冰窟',
    desc:'玄冥教总坛，藏于万年寒冰之中。两扇铁门终年冰封，推开便是刺骨寒意。玄冥二老在此修炼，一掌出去凌寒彻骨，见者无不胆寒。入此地者非冻死即学成绝世武功。',
    services:[],
    sects:['xuanming'],
    roads:{ S:'xuanming_base' },
    cityOwner:'xuanming',
  },
  shuozhou: {
    id:'shuozhou', name:'朔州', icon:'🏘', type:'city', tier:'minor',
    x:-8, y:-16,
    region:'山西北部', terrain:'高原',
    desc:'长城脚下的边塞古城，是中原与草原的交界地带。驻守军士与游牧武士在此对峙。',
    services:['inn','shop'],
    roads:{ N:'datong', S:'jinyang', E:'yanmen', W:'yinzhou' },
    cityOwner:'neutral',
  },

  // ══════════════════════════════
  //  昆仑 / 天山
  // ══════════════════════════════
  kunlun_peak: {
    id:'kunlun_peak', name:'昆仑山', icon:'🏔', type:'city', tier:'minor',
    x:-38, y:12,
    region:'西域·昆仑山', terrain:'雪山',
    desc:'昆仑山横亘万里，雪峰耸立入云。山中奇花异草无数，雪莲遍地，是修炼内力的绝佳圣地。山腰设有休憩所，供攀登者歇脚补给。再往上，便是昆仑派的禁地。',
    services:['inn','hospital'],
    roads:{ N:'hetian', S:'qinghai', E:'xining', W:'hetian', NW:'kunlun_sect' },
    cityOwner:'kunlun', // 昆仑派势力范围
  },
  kunlun_sect: {
    id:'kunlun_sect', name:'昆仑派·万年雪宫', icon:'⛰', type:'sect_location', tier:'major',
    x:-38.5, y:11.5,
    region:'西域·昆仑绝顶', terrain:'雪山极顶',
    desc:'昆仑山主峰绝顶，昆仑三圣剑法发源之地。雪宫外围剑气凛冽，轻功绝顶者方能飞渡于雪峰之间抵达此处。宫中供奉昆仑祖师牌位，历代剑法秘籍珍藏于冰晶书库之中。',
    services:[],
    sects:['kunlun'],
    roads:{ SE:'kunlun_peak' },
    cityOwner:'kunlun',
  },
  tianshan_peak: {
    id:'tianshan_peak', name:'天山', icon:'🏔', type:'city', tier:'minor',
    x:-48, y:-12,
    region:'西域·天山', terrain:'冰雪高峰',
    desc:'天山横亘西域，白雪皑皑，巍峨壮观。雪莲遍山，清泉潺潺，是修炼冰系内力的天然道场。山中有两处隐秘去处，一是逍遥派的仙境，一是天山派的雪宫。',
    services:['inn'],
    roads:{ N:'xiyu_city', S:'hetian', E:'yumenguan', W:'xizhou', SW:'tianshan_sect', NW:'xiaoyao_grotto' },
    cityOwner:'neutral', // 天山和逍遥交汇处
  },
  xiaoyao_grotto: {
    id:'xiaoyao_grotto', name:'逍遥仙境·逍遥派', icon:'🌀', type:'sect_location', tier:'supreme',
    x:-49, y:-13,
    region:'西域·天山深处', terrain:'仙境',
    desc:'天山深处云雾缭绕的仙境，逍遥派在此隐世修行。入口藏于瀑布之后，非逍遥弟子难以寻觅。无崖子曾于此传授天下绝学，逍遥三老各踞一方，聚散离合皆是江湖传奇。',
    services:['inn','hospital'],
    sects:['xiaoyao'],
    roads:{ SE:'tianshan_peak' },
    cityOwner:'xiaoyao',
  },
  wudu: {
    id:'wudu', name:'武都·阴平', icon:'🏘', type:'city', tier:'minor',
    x:-14, y:8,
    region:'甘南山地', terrain:'山地',
    desc:'崆峒山所在地区，道家武派聚集之地。山高路险，却也是连接四川与西北的古道。',
    services:['inn','shop'],
    sects:['kongtong'],
    roads:{ N:'lanzhou', S:'guangyuan', E:'hanzhong', W:'xining' }
  },
  luding: {
    id:'luding', name:'泸定', icon:'🏔', type:'city', tier:'minor',
    x:-12, y:22,
    region:'川西', terrain:'峡谷',
    desc:'大渡河铁索桥横跨于此，是进入西藏的要道。山高谷深，滇藏古道在此交汇。',
    services:['inn'],
    roads:{ N:'chengdu', S:'lijiang', E:'emei_shan', W:'litang' }
  },
  luzhou_sz: {
    id:'luzhou_sz', name:'泸州', icon:'🏘', type:'city', tier:'minor',
    x:-4, y:22,
    region:'四川南部', terrain:'丘陵',
    desc:'长江边的酒城，泸州老窖名扬天下。商贾云集，江湖人士在此饮酒论剑。',
    services:['inn','shop','market'],
    roads:{ N:'dazhou', S:'guiyang', E:'yibin', W:'chongqing' }
  },
  qingshui: {
    id:'qingshui', name:'清水', icon:'🏘', type:'city', tier:'minor',
    x:-14, y:2,
    region:'甘肃东部', terrain:'山地',
    desc:'秦岭支脉间的小城，山泉清澈甘甜。隐士修炼的好地方，崆峒派弟子常在此游历。',
    services:['inn'],
    roads:{ N:'lanzhou', S:'wudu', E:'xian', W:'lanzhou' }
  },
  fenzhou: {
    id:'fenzhou', name:'汾州', icon:'🏘', type:'city', tier:'minor',
    x:-8, y:-10,
    region:'山西中部', terrain:'盆地',
    desc:'汾河流域的古城，黄酒醇香。山西武风极盛，镖局从此地发源。',
    services:['inn','shop'],
    roads:{ N:'jinyang', S:'puzhou', E:'jinyang', W:'shuozhou' }
  },
  tengchong: {
    id:'tengchong', name:'腾冲', icon:'🏘', type:'city', tier:'minor',
    x:-10, y:37,
    region:'云南极西', terrain:'高原',
    desc:'西南极边之地，与缅甸相邻。异域武学传入此地，南亚功法与汉家武术在此交融。',
    services:['inn','shop'],
    roads:{ N:'dali', S:'qinzhou', E:'baoshan', W:'qinzhou' }
  },
  baoshan: {
    id:'baoshan', name:'保山', icon:'🏘', type:'city', tier:'minor',
    x:-7, y:35,
    region:'云南', terrain:'高原',
    desc:'云南西部重镇，古称永昌。南方丝绸之路在此经过，异域风情浓厚。',
    services:['inn','shop'],
    roads:{ N:'dali', S:'tengchong', E:'dali', W:'tengchong' }
  },
  chaozhou: {
    id:'chaozhou', name:'潮州', icon:'🏘', type:'city', tier:'minor',
    x:14, y:33,
    region:'广东', terrain:'平原',
    desc:'岭南门户，潮汕文化发源地。海商众多，海沙派在此活动频繁。',
    services:['inn','shop'],
    roads:{ N:'fuzhou', S:'guangzhou', W:'ganzhou' }
  },
  qinzhou: {
    id:'qinzhou', name:'钦州', icon:'🏘', type:'city', tier:'minor',
    x:2, y:38,
    region:'广西沿海', terrain:'海港',
    desc:'南海北岸的港口，是进入中南半岛的跳板。来自东南亚的武士在此上岸。',
    services:['inn','shop'],
    roads:{ N:'guilin', S:'nanhai', E:'guangzhou', W:'tengchong' }
  },
  nanhai: {
    id:'nanhai', name:'南海·三亚', icon:'🌊', type:'city', tier:'minor',
    x:8, y:42,
    region:'南海', terrain:'海滨',
    desc:'天涯海角，江湖尽头。被江湖追杀者常逃至此，也有人在此另立门户，远离纷争。',
    services:['inn','shop'],
    roads:{ N:'guangzhou', W:'qinzhou', NW:'guilin' }
  },

  // ── 新增门派据点 ─────────────────────────────────

  wudang_peak: {
    id:'wudang_peak', name:'武当山·紫霄宫', icon:'☯', type:'sect_location', tier:'major',
    x:-2, y:11,
    region:'湖北·武当山', terrain:'山地',
    desc:'武当山主峰，紫霄宫高悬云端，太极气息弥漫。武当派以此为根基，道家经典在此传授，云雾中常可见弟子修炼太极拳法，羽化登仙之姿令人叹服。',
    services:['shop','hospital'],
    sects:['wudang'],
    roads:{ S:'wudang_town', N:'nanyang', E:'xiangyang' },
    cityOwner:'wudang',
  },

  guangming_peak: {
    id:'guangming_peak', name:'光明顶', icon:'🏔', type:'city', tier:'minor',
    x:-14, y:2,
    region:'西北·昆仑山脉', terrain:'山地',
    desc:'光明顶是昆仑余脉中最高的山峰，云海茫茫，一览无余。山道险峻，据说只有内力深厚者才能不受高寒所扰登顶。山脚偶有商旅驻扎，山腰以上便极少见到普通人迹。',
    services:['inn'],
    roads:{ E:'lanzhou', SE:'xian', S:'wudu', N:'mingjiao_guangming' },
    cityOwner:'mingjiao', // 明教势力范围
  },
  mingjiao_guangming: {
    id:'mingjiao_guangming', name:'明教·圣火坛', icon:'🔥', type:'sect_location', tier:'major',
    x:-14, y:1,
    region:'西北·光明顶绝顶', terrain:'高峰',
    desc:'光明顶绝顶上的明教圣坛，圣火终年不熄，烈焰映红半边天空。教主令旗一出，四方教众云集响应。光明左右使坐镇两侧，圣火令的秘密深埋于地宫之中，日月相照，威震天下。',
    services:['shop','hospital'],
    sects:['mingjiao'],
    roads:{ S:'guangming_peak' },
    cityOwner:'mingjiao',
  },

  tiandibang_fort: {
    id:'tiandibang_fort', name:'天雷寨·天地帮总舵', icon:'⚡', type:'sect_location', tier:'minor',
    x:14, y:-4,
    region:'河北·沧州以东', terrain:'平原',
    desc:'天地帮以沧州为根基建立的雷霆寨，四周雷法阵纹密布，陌生人进寨便会触发机关。帮中雷系高手云集，日夜操练，誓要一统北方江湖。',
    services:['shop'],
    sects:['tiandibang'],
    roads:{ W:'cangzhou', SW:'youzhou', S:'anyang' },
    cityOwner:'tiandibang',
  },

  funiu_mt: {
    id:'funiu_mt', name:'伏牛山', icon:'⛰', type:'city', tier:'minor',
    x:-6, y:4,
    region:'河南·伏牛山中', terrain:'山地',
    desc:'伏牛山绵延数百里，是中原最幽深的山脉之一。山中药材丰富，猎户偶尔出没。据当地人说，山腹深处有处神秘幽洞，住着一位深谋远虑的隐士，但从无人知晓入口所在。',
    services:['inn'],
    roads:{ E:'luoyang', NE:'ruzhou', SE:'nanyang', W:'guigu_valley' }
  },
  guigu_valley: {
    id:'guigu_valley', name:'鬼谷门·幽洞', icon:'🔮', type:'sect_location', tier:'minor',
    x:-7, y:4,
    region:'河南·伏牛山腹地', terrain:'山洞',
    desc:'深藏于伏牛山腹地的幽深山洞，常年云雾缭绕，外人难以寻访。鬼谷门门主在此推演天机、著书立说，弟子寥寥，却个个足智多谋、出山必成大器。纵横捭阖之术，皆授于此。',
    services:['hospital'],
    sects:['guigu'],
    roads:{ E:'funiu_mt' },
    cityOwner:'guigu',
  },

  shengguang_temple: {
    id:'shengguang_temple', name:'圣光圣殿·圣光教', icon:'✦', type:'sect_location', tier:'minor',
    x:6, y:2,
    region:'河南·开封郊外', terrain:'平原',
    desc:'圣光教在开封城外修建的宏伟圣殿，金色光芒映照四野。教内圣骑士在此修炼圣光神功，以光明之名治愈苦难，也以圣裁之名惩戒邪恶，周围百姓奉若神明。',
    services:['shop','hospital'],
    sects:['shengguang'],
    roads:{ W:'kaifeng', SW:'zhengzhou', S:'ruzhou', SE:'riyue_city' },
    cityOwner:'shengguang',
  },

  kongtong_mt: {
    id:'kongtong_mt', name:'崆峒山', icon:'⛰', type:'city', tier:'minor',
    x:-18, y:2,
    region:'甘肃·平凉', terrain:'山地',
    desc:'崆峒山雄踞西北，奇峰峻岭，古刹林立。山中云雾缭绕，传说黄帝曾在此问道广成子。山道上常见习武之人上下穿行，山腰有茶寮供过路人歇息。',
    services:['inn','shop'],
    roads:{ E:'lanzhou', SE:'xian', NE:'yinzhou', N:'kongtong_peak' }
  },
  kongtong_peak: {
    id:'kongtong_peak', name:'崆峒派·问道宫', icon:'🌪', type:'sect_location', tier:'major',
    x:-18, y:1,
    region:'甘肃·崆峒山顶', terrain:'高峰',
    desc:'崆峒山顶的问道宫，号称北地武林之宗。七伤拳法在此发源，山中石壁镌刻着历代掌门留下的拳谱，刚猛之气扑面而来令人血脉贲张。掌门坐镇于此，问道论武，气吞万里。',
    services:['shop','hospital'],
    sects:['kongtong'],
    roads:{ S:'kongtong_mt' },
    cityOwner:'kongtong',
  },

  diancang_mt: {
    id:'diancang_mt', name:'点苍山', icon:'🏔', type:'city', tier:'minor',
    x:-4, y:33,
    region:'云南·大理', terrain:'山地',
    desc:'点苍山十九峰终年积雪，苍山洱海相映成趣。山间奇花异草繁多，药材丰富，是大理最知名的景致。山路蜿蜒，半山腰有驿站，继续往上便是点苍派的禁地。',
    services:['inn','hospital'],
    roads:{ N:'dali', NE:'lijiang', S:'lijiang', SE:'diancang_peak' }
  },
  diancang_peak: {
    id:'diancang_peak', name:'点苍派·苍云剑阁', icon:'💠', type:'sect_location', tier:'minor',
    x:-3.5, y:33.5,
    region:'云南·点苍山深处', terrain:'山地',
    desc:'点苍山云深之处的苍云剑阁，终年云雾弥漫。点苍派修炼毒剑双绝于此，山中奇花异草皆可入毒。弟子步法如行云流水，剑法飘逸却毒性凛然，令来犯者进退两难。',
    services:['shop','hospital'],
    sects:['diancang'],
    roads:{ NW:'diancang_mt' },
    cityOwner:'diancang',
  },

  tianshan_sect: {
    id:'tianshan_sect', name:'天山雪宫·天山派', icon:'❄', type:'sect_location', tier:'minor',
    x:-36, y:-4,
    region:'西域·天山南麓', terrain:'雪山',
    desc:'天山南麓的万年冰雪之地，天山派雪宫在此矗立。宫中终年冰封，是修炼冰系内力的绝佳之处。天山童姥曾于此独掌门户数十年，令天下武林无人敢犯。',
    services:['hospital'],
    sects:['tianshan'],
    roads:{ E:'tianshan_peak', SE:'hetian', S:'hetian' },
    cityOwner:'tianshan',
  },

  xixia_palace: {
    id:'xixia_palace', name:'西夏皇宫·西夏秘宗', icon:'🌙', type:'sect_location', tier:'minor',
    x:-24, y:-6,
    region:'西夏故地·宁夏', terrain:'荒漠',
    desc:'西夏故国废墟之上，密宗三法王重建了这座神秘宫殿。宫中阵法重重，密宗功法秘典尽藏于此。传说此处埋藏了西夏王朝最后的秘密，令无数江湖人趋之若鹜。',
    services:['shop','hospital'],
    sects:['xixia'],
    roads:{ E:'yinzhou' },
    cityOwner:'xixia',
  },

  tianlong_stronghold: {
    id:'tianlong_stronghold', name:'龙象堂·天龙帮', icon:'🐉', type:'sect_location', tier:'minor',
    x:18, y:16,
    region:'江苏·扬州以南', terrain:'水乡',
    desc:'天龙帮在扬州运河边建立的龙象堂，气势恢宏。帮中修炼龙象般若功的弟子日夜苦练，院中石墩被他们打得满地碎裂。帮主据此号令江南水路，过往商船无不缴纳买路钱。',
    services:['shop'],
    sects:['tianlong'],
    roads:{ N:'yangzhou' },
    cityOwner:'tianlong',
  },

  nangong_manor: {
    id:'nangong_manor', name:'南宫庄园·南宫世家', icon:'🏛', type:'sect_location', tier:'minor',
    x:0, y:2,
    region:'河南·洛阳郊外', terrain:'平原',
    desc:'南宫世家数百年的豪门庄园，亭台楼阁诗情画意。庄中子弟自幼习文练武，南宫剑典书法皆精。来访者需有名帖引荐，否则不得入内——然而凭本事闯入，庄主亦会以礼相待。',
    services:['shop','hospital'],
    sects:['nangong'],
    roads:{ E:'luoyang', N:'jixian', S:'zhengzhou' },
    cityOwner:'nangong',
  },

  haisha_island: {
    id:'haisha_island', name:'海沙岛·海沙派', icon:'⚓', type:'sect_location', tier:'minor',
    x:30, y:18,
    region:'东海·浙江外海', terrain:'海岛',
    desc:'浙江外海的一座险峻岛礁，是海沙派的老巢。七杀刀法在此代代相传，岛上常年刀光剑影。海沙派以此为基，控制着东海航线，往来商船闻海沙之名无不变色。',
    services:['inn','shop'],
    sects:['haisha'],
    roads:{ W:'mingzhou', NW:'suzhou', SW:'hangzhou' },
    cityOwner:'haisha',
  },

  xuegu_fort: {
    id:'xuegu_fort', name:'血炼堡·血骨门', icon:'💀', type:'sect_location', tier:'minor',
    x:12, y:-10,
    region:'河北·幽州北郊', terrain:'荒野',
    desc:'血骨门深藏于幽州北郊的荒僻之地，血炼堡外墙以黑铁铸成，门口常年悬挂江湖仇家的兵器——那是他们炫耀战绩的方式。血炼大法在此秘传，门中充斥着浓烈的血腥之气。',
    services:['hospital'],
    sects:['xuegu'],
    roads:{ S:'youzhou', SW:'cangzhou', W:'datong' },
    cityOwner:'xuegu',
  },

  lingxiao_tower: {
    id:'lingxiao_tower', name:'凌霄楼·凌霄阁', icon:'🏯', type:'sect_location', tier:'minor',
    x:22, y:16,
    region:'浙江·杭州', terrain:'城市',
    desc:'凌霄楼矗立于杭州最繁华之处，是江湖中情报买卖的第一圣地。阁中暗道四通八达，高手如云。凭钱可买消息，凭实力可入内阁，但进了凌霄楼，从来没有秘密可言。',
    services:['inn','shop'],
    sects:['lingxiao'],
    roads:{ W:'hangzhou', N:'suzhou', NW:'nanjing' },
    cityOwner:'lingxiao',
  },

  qingcheng_mt: {
    id:'qingcheng_mt', name:'青城山', icon:'🌄', type:'city', tier:'minor',
    x:-10, y:24,
    region:'四川·成都西北', terrain:'山地',
    desc:'青城山天下幽，古木参天，奇雾弥漫。山中道观林立，香客络绎不绝。山道清幽，溪涧潺潺，是难得的世外桃源。据说山中深处有门派据守，外人轻易不得涉足。',
    services:['inn','hospital'],
    roads:{ E:'chengdu', N:'guangyuan', SE:'tangzhou', SW:'qingcheng_peak' }
  },
  qingcheng_peak: {
    id:'qingcheng_peak', name:'青城派·天师洞', icon:'🌿', type:'sect_location', tier:'minor',
    x:-10.5, y:24.5,
    region:'四川·青城山深处', terrain:'密林',
    desc:'青城山深处的天师洞，是青城派隐匿修炼之所。弟子行事阴沉低调，修炼毒剑双绝。山中处处机关暗弩，外人擅入必遭毒弩招待，活着出去者无不心有余悸。',
    services:['shop','hospital'],
    sects:['qingcheng'],
    roads:{ NE:'qingcheng_mt' },
    cityOwner:'qingcheng',
  },

  riyue_city: {
    id:'riyue_city', name:'日月城', icon:'☀', type:'city', tier:'major',
    x:6, y:6,
    region:'中原·汴梁以南', terrain:'平原',
    desc:'日月神教在中原腹地建立的附属城镇，教众数万遍布四方。城中商贾云集，表面上是繁华集市，实则日月弟子密布其中，是神教在江湖打探消息、收拢人才的前沿据点。',
    services:['inn','shop','market','stable','poststation'],
    roads:{ N:'kaifeng', W:'ruzhou', NW:'zhengzhou', E:'xuzhou', NE:'shengguang_temple', SE:'riyue_sect' },
    cityOwner:'riyue',
  },
  riyue_sect: {
    id:'riyue_sect', name:'日月神教·圣殿', icon:'🌙', type:'sect_location', tier:'supreme',
    x:7, y:7,
    region:'中原·日月圣地', terrain:'圣地',
    desc:'日月神教总坛，气势恢宏，威压四方。教主端坐于日月双轮宝座之上，左右光明使侍奉两侧，四大法王分镇各方。葵花宝典和吸星大法在此秘传，千秋万载之志令天下门派无不侧目。',
    services:['shop','hospital'],
    sects:['riyue'],
    roads:{ NW:'riyue_city' },
    cityOwner:'riyue',
  },
};

// ── 快速工具函数 ──

// 获取节点可前往的所有方向和目标
function getNodeRoads(nodeId){
  const node = WORLD_NODES[nodeId];
  if(!node) return [];
  return Object.entries(node.roads||{}).map(([dir, destId])=>{
    const dest = WORLD_NODES[destId];
    if(!dest) return null;
    return { dir, destId, destName: dest.name, destIcon: dest.icon, destTerrain: dest.terrain, destType: dest.type };
  }).filter(Boolean);
}

// ════════════════════════════════════════════════
//  行路探索引擎  Journey Engine
// ════════════════════════════════════════════════

// ── ASCII场景库（地形 × 时辰） ──
// 每个场景由 sky(天空行), ground(地面层行数组), tint(天色) 三部分组成
const JOURNEY_SCENES = {

  // 平原 - 白天
  平原_day: {
    tint: 'rgba(20,60,40,.15)',
    skyType: 'day_plain',   // 粒子类型：白天晴空
    groundLine: '─',        // 地平线字符
    groundDeco: '`  , ` , , ` , ` ,  , ` , ` , ,  ` ,',   // 装饰行（草地点缀）
    color: '#7cc890',
    ambience: ['🌾 田野间清风徐来，麦浪滚滚。','🐦 远处有农家鸡犬之声。','☀ 阳光和煦，道路平坦宽阔。','🌿 路旁野草青青，偶见野兔出没。'],
  },

  // 平原 - 黄昏
  平原_eve: {
    tint: 'rgba(120,50,0,.22)',
    skyType: 'eve',
    groundLine: '─',
    groundDeco: '` ,   , `  , , ` ,   ` ,  , ` ,  ,',
    color: '#e08030',
    ambience: ['🌅 夕阳西沉，天边云霞绚烂。','🦜 归巢的鸟儿在头顶盘旋。','🕯 远处村落升起袅袅炊烟。','🌾 暮色中，金色麦田如诗如画。'],
  },

  // 平原 - 夜晚
  平原_night: {
    tint: 'rgba(0,0,60,.45)',
    skyType: 'night',
    groundLine: '─',
    groundDeco: '.  .  .   .  . .   .  .   .  .  .  .',
    color: '#6080c0',
    ambience: ['🌙 月色朦胧，夜风轻拂。','🦉 林中有枭声阵阵。','⭐ 繁星满天，指引方向。','🌑 夜行赶路，须防野兽出没。'],
  },

  // 山地 - 白天
  山地_day: {
    tint: 'rgba(20,40,30,.2)',
    skyType: 'day_cloud',
    groundLine: '─',
    groundDeco: '/\\    /\\  /\\      /\\  /\\    /\\  /\\',   // 山峰轮廓行
    color: '#60a060',
    ambience: ['⛰ 山路崎岖，脚步须稳。','🦅 雄鹰盘旋于山顶之上。','🌲 青松翠柏，遮天蔽日。','💨 山风呼啸，云雾弥漫。'],
  },

  // 山地 - 夜晚
  山地_night: {
    tint: 'rgba(0,0,40,.5)',
    skyType: 'night',
    groundLine: '─',
    groundDeco: '/\\    /\\  /\\      /\\  /\\    /\\  /\\',
    color: '#4060a0',
    ambience: ['🌑 夜深山中，虫鸣阵阵。','🐺 远处传来狼嚎声，令人心惊。','🌙 月光映在山石上，如霜如雪。','🦇 蝙蝠划过夜空，悄无声息。'],
  },

  // 高山/仙山
  高山_day: {
    tint: 'rgba(100,140,200,.15)',
    skyType: 'fairy',   // 仙气飘飘
    groundLine: '─',
    groundDeco: '/\\\\   /\\  /\\\\    /\\   /\\\\  /\\  /\\\\',
    color: '#c0e0ff',
    ambience: ['🗻 巍峨群山，云海茫茫。','❄ 山顶积雪终年不化。','🌨 高空飘落细雪，衣袖生寒。','🎋 仙气弥漫，不知置身何处。'],
  },

  // 密林
  密林_day: {
    tint: 'rgba(0,60,20,.25)',
    skyType: 'forest',  // 林间光斑
    groundLine: '─',
    groundDeco: 'Y  Y   Y Y   Y  Y   Y  Y  Y   Y  Y ',
    color: '#40c060',
    ambience: ['🌲 古树参天，遮蔽日光。','🍄 地上长满奇异蘑菇。','🐍 林间传来异响，不知何物。','🌿 草木茂密，气息清新湿润。'],
  },

  // 沙漠
  沙漠绿洲_day: {
    tint: 'rgba(120,80,0,.25)',
    skyType: 'desert',  // 烈日灼热
    groundLine: '~',
    groundDeco: '~  ~ ~~  ~  ~~ ~  ~ ~~  ~  ~ ~~ ~  ',
    color: '#e0b040',
    ambience: ['☀ 烈日炎炎，地面热浪翻滚。','🌵 仙人掌矗立道旁，孤傲挺拔。','🐪 骆驼在沙丘上留下蹄印。','🌊 远处出现海市蜃楼，令人迷惑。'],
  },

  // 雪原/冰原
  冰原_day: {
    tint: 'rgba(180,220,255,.1)',
    skyType: 'snow',    // 飘雪
    groundLine: '─',
    groundDeco: '*   *  *    *  *   *   *  *    *  * ',
    color: '#a0d0ff',
    ambience: ['❄ 雪原茫茫，万里银装。','🌨 细雪轻飘，视线迷蒙。','💨 北风凛冽，寒气刺骨。','🏔 远处冰峰如剑，直刺苍穹。'],
  },

  // 水乡/河谷
  水乡_day: {
    tint: 'rgba(0,60,80,.2)',
    skyType: 'day_cloud',
    groundLine: '≈',
    groundDeco: '~  ~ ≈ ~  ~  ≈~ ~ ≈  ~  ~  ≈ ~  ~ ',
    color: '#60c0d0',
    ambience: ['🌊 江南水乡，烟波浩渺。','🛶 小舟荡漾，渔翁垂钓。','🪷 荷花盛开，清香四溢。','🌧 烟雨迷蒙，如诗如画。'],
  },

  // 草原
  草原_day: {
    tint: 'rgba(20,80,20,.15)',
    skyType: 'day_plain',
    groundLine: '─',
    groundDeco: 'ww  w ww  ww w  ww  w ww  ww w  ww ',
    color: '#80d040',
    ambience: ['🌿 草原辽阔，牧草如茵。','🐎 远处有马群奔腾，蔚为壮观。','💨 草原风大，衣袂飘飘。','☀ 蓝天白云，心旷神怡。'],
  },

};

// ── 地形到场景key的映射（考虑时辰） ──
function jnyGetSceneKey(terrain, phase){
  // phase: 'day'|'eve'|'night'
  const daySuffix = phase === 'night' ? '_night' : (phase === 'eve' ? '_eve' : '_day');
  const terrainMap = {
    平原:'平原', 丘陵:'平原', 盆地:'平原', 河谷:'水乡',
    山地:'山地', 高山:'高山', 仙山:'高山', 险峰:'高山', 险关:'山地', 奇峰:'高山', 峡谷:'山地',
    密林:'密林', 草原:'草原', 水乡:'水乡', 湖滨:'水乡', 海港:'水乡', 海滨:'水乡', 海岛:'水乡',
    沙漠绿洲:'沙漠绿洲', 戈壁:'沙漠绿洲', 绿洲:'沙漠绿洲',
    冰原:'冰原', 高原湖泊:'冰原', 高原:'高山',
    山城:'山地',
  };
  const base = terrainMap[terrain] || '平原';
  const key = base + daySuffix;
  if(JOURNEY_SCENES[key]) return key;
  // 降级：去掉_eve/_night改为_day
  return base + '_day';
}

// ── 玩家字符（根据坐骑/性别） ──
const JOURNEY_PLAYER_FRAMES = {
  foot: [
    ' o \n/|\\\n/ \\',
    ' o \n/|\\\n/‿\\',
  ],
  horse_normal: [
    ' o \n/|\\ 🐴\n───',
    ' o \n\\|/ 🐴\n───',
  ],
  horse_redrabbit: [
    ' o \n/|\\ 🔴\n───',
    ' o \n\\|/ 🔴\n───',
  ],
  horse_heavenly: [
    ' o \n/|\\ 🔥\n───',
    ' o \n\\|/ 🔥\n───',
  ],
  horse_black: [
    ' o \n/|\\ 🖤\n───',
    ' o \n\\|/ 🖤\n───',
  ],
  horse_white: [
    ' o \n/|\\ 🌟\n───',
    ' o \n\\|/ 🌟\n───',
  ],
  horse_snow: [
    ' o \n/|\\ ❄\n───',
    ' o \n\\|/ ❄\n───',
  ],
  horse_phantom: [
    ' o \n/|\\ 🌙\n───',
    ' o \n\\|/ 🌙\n───',
  ],
};

// ── ASCII 水平镜像（左右翻转字符） ──
function asciiMirrorH(str){
  const MIRROR = {
    '(':')', ')':'(',
    '[':']', ']':'[',
    '{':'}', '}':'{',
    '<':'>', '>':'<',
    '╮':'╭', '╭':'╮',
    '╯':'╰', '╰':'╯',
    '╱':'╲', '╲':'╱',
    '/':'\\', '\\':'/',
    '◤':'◥', '◥':'◤',
    '◣':'◢', '◢':'◣',
    '▷':'◁', '◁':'▷',
    '╘':'╛', '╛':'╘',
    '╙':'╜', '╜':'╙',
    '▐':'▌', '▌':'▐',
    '⌐':'¬', '¬':'⌐',
  };
  return str.split('\n').map(line=>{
    return line.split('').reverse().map(c=>MIRROR[c]||c).join('');
  }).join('\n');
}

// ── 在马背上叠加骑手（合并字符串） ──
// horseFrame: 马的多行ASCII字符串（已镜像朝右）
// 骑手插入到马背那行（第2行，▓▓▓/身体行）的上方
function jnyBuildRiderFrame(horseFrame){
  const horseLines = horseFrame.split('\n');
  // 马的结构（镜像后）：行0头顶 行1马头 行2马背 行3马腹 行4-5腿
  // 骑手坐在马背上，应插入在行2之前（行1之后）
  // 找马背行：含 ▓ 或 ░ 或 █ 或 ═ 的第一行（通常是行2）
  let backIdx = 2; // 默认
  for(let i=1;i<horseLines.length;i++){
    if(/[▓░█▰\[\]]/.test(horseLines[i])){ backIdx = i; break; }
  }

  // 取马身最宽行宽度做对齐基准
  const maxW = horseLines.reduce((m,l)=>Math.max(m,l.length),0);
  // 骑手水平偏移：放在马身中偏左（骑手坐在颈背部）
  const riderPad = Math.max(1, Math.floor(maxW * 0.25));
  const pad = ' '.repeat(riderPad);

  // 骑手3行（面朝右）
  const riderLines = [
    pad + ' ô ',   // 头
    pad + '/|>',   // 身体+缰绳
    pad + '/ \\',  // 腿夹马腹（两腿分叉）
  ];

  // 把骑手插入到马背行之前
  const result = [
    ...horseLines.slice(0, backIdx),   // 马头顶 + 马头（backIdx行）
    ...riderLines,                      // 骑手3行
    ...horseLines.slice(backIdx),       // 马背 + 马腹 + 腿
  ];
  return result.join('\n');
}

function jnyGetPlayerFrames(){
  // 安全检查：edS 可能未定义
  if(typeof edS === 'undefined'){
    return { frames: JOURNEY_PLAYER_FRAMES.foot, color: '#c8a878', isHorse: false };
  }

  // ── 1. 检查临时租马（wuxia_mount）优先级最高 ──
  let rentMount = null;
  try {
    const raw = localStorage.getItem('wuxia_mount');
    if(raw){
      const m = JSON.parse(raw);
      if(m && Date.now() < (m.expires||0)) rentMount = m;
    }
  } catch(e){}

  if(rentMount){
    // 租马的 id 就是 breedKey
    const breed = HORSE_BREEDS[rentMount.id];
    if(breed && breed.frames && breed.frames.length){
      return { frames: breed.frames, color: breed.color || '#c09050', isHorse: true, breed };
    }
    // 降级：emoji版
    const icon = breed ? breed.icon : '🐴';
    return { frames: [` ô \n/|> ${icon}\n───`, ` ô \n/|> ${icon}\n───`], color: breed?.color||'#c09050', isHorse: true };
  }

  // ── 2. 检查永久坐骑（edS.horseId）──
  const hKey = edS.horseId;
  if(!hKey) return { frames: JOURNEY_PLAYER_FRAMES.foot, color: '#c8a878', isHorse: false };
  const breed = HORSE_BREEDS[hKey];
  if(breed && breed.frames && breed.frames.length){
    // 保留原始帧（不镜像），由 .jny-player scaleX(-1) 整体翻转使角色面朝右
    return { frames: breed.frames, color: breed.color || '#c09050', isHorse: true, breed };
  }
  // 降级：用emoji简单版
  const icon = breed ? breed.icon : '🐴';
  return { frames: [` ô \n/|> ${icon}\n───`, ` ô \n/|> ${icon}\n───`], color: breed?.color||'#c09050', isHorse: true };
}

// ── 旅途分段文字（根据地形生成） ──
const JOURNEY_NARR_POOL = {
  平原: [
    '晨露未干，踏上官道，脚步轻快。',
    '远望平畴千里，心中豪情自生。',
    '路旁枯树，老鸦数只，凄清中自有一番意境。',
    '过了一个小村落，炊烟袅袅，鸡犬相闻。',
    '道路渐宽，行人渐多，市集的喧嚣隐约传来。',
    '官道两侧，桑田绿意，农人们正辛勤劳作。',
    '一阵风来，衣袂飘飘，身心为之一爽。',
  ],
  山地: [
    '山路曲折，蜿蜒而上，体力消耗甚大。',
    '悬崖边上，一步之遥，须谨慎行走。',
    '山风呼啸，松涛阵阵，别有一番豪迈。',
    '峭壁之间，羊肠小道，前人踩出的足迹。',
    '涧水清澈，掬一口山泉，清凉沁心。',
    '远山叠嶂，云雾缭绕，恍如仙境。',
    '嶙峋怪石，各具异态，江湖奇景。',
  ],
  高山: [
    '山势险峻，登顶俯瞰，天地尽收眼底。',
    '云海之上，如临仙境，心旷神怡。',
    '寒风刺骨，运起内力护体，方才抵御。',
    '积雪深处，步步艰难，每一步都是考验。',
    '仙鹤翩翩，从云端掠过，美不胜收。',
  ],
  密林: [
    '密林幽深，日光难以穿透，如入黑夜。',
    '脚踩落叶，沙沙作响，四周静谧而神秘。',
    '林间有巨石，刻有古人笔墨，难以辨认。',
    '藤蔓遍布，须小心绕行，莫要缠住脚步。',
    '野兽的气息若隐若现，须提高警惕。',
    '发现一处古泉，清凉甘甜，精神为之一振。',
  ],
  沙漠绿洲: [
    '黄沙漫漫，望不到边际，前路渺茫。',
    '烈日灼烧，汗水瞬间蒸发，口渴难耐。',
    '沙丘起伏，行进艰难，每步都是挣扎。',
    '远处出现绿洲，加速赶路，终于到达。',
    '骆驼商队在沙漠中缓缓前行，互相问候。',
  ],
  冰原: [
    '冰天雪地，寒彻入骨，须运功护体。',
    '白雪皑皑，足迹深陷，行进艰难。',
    '远处冰峰如刀，映出冷冽光芒。',
    '北风呼啸，雪粒打在脸上，生疼。',
  ],
  水乡: [
    '水乡风光，画舸渔舟，别有一番清雅。',
    '桥上行人，桥下流水，岁月静好。',
    '荷叶连天碧，荷花别样红，水路如画。',
    '烟雨蒙蒙，伞下独行，思绪万千。',
  ],
  草原: [
    '草原辽阔，天高云淡，心胸顿时开阔。',
    '骏马奔腾于远处，令人心动。',
    '风吹草低见牛羊，一派祥和。',
    '牧歌声声，从远处飘来，悠扬动听。',
  ],
};

function jnyGetNarr(terrain){
  const terrainMap = { 丘陵:'平原', 盆地:'平原', 河谷:'水乡', 峡谷:'山地', 高原:'高山', 仙山:'高山', 险峰:'高山', 险关:'山地', 山城:'山地', 奇峰:'高山', 海港:'水乡', 海岛:'水乡', 海滨:'水乡', 湖滨:'水乡', 戈壁:'沙漠绿洲', 绿洲:'沙漠绿洲', 高原湖泊:'冰原' };
  const base = terrainMap[terrain] || terrain;
  const pool = JOURNEY_NARR_POOL[base] || JOURNEY_NARR_POOL['平原'];
  const shuffled = [...pool].sort(()=>Math.random()-.5);
  return shuffled;
}

// ── 行路小事件库（轻量，只显示文字，不强制弹窗） ──
const JOURNEY_MINI_EVENTS = [
  { w:20, icon:'🌸', text:'路旁野花盛开，微风送香。' },
  { w:18, icon:'🦋', text:'一只蝴蝶停在衣袖上，旋即飞去。' },
  { w:15, icon:'👴', text:'遇一老翁，问路之余叮嘱："前方山路需谨慎。"' },
  { w:12, icon:'⚔',  text:'远处传来打斗声，随后归于平静。' },
  { w:10, icon:'📜', text:'发现路边告示，似乎是江湖通缉令。' },
  { w:8,  icon:'🎵', text:'林中有人吹箫，曲调悠扬飘远。' },
  { w:10, icon:'🦊', text:'一只狐狸从道旁穿过，与你对视片刻。' },
  { w:8,  icon:'☕', text:'路边茶摊正好一杯热茶，解乏提神。' },
  { w:6,  icon:'💎', text:'路边石缝中隐约有光，捡起一看，是块奇石。' },
  { w:5,  icon:'🌪', text:'一阵旋风卷来，尘土飞扬，须捂住口鼻。' },
  { w:7,  icon:'🐦', text:'远处有一只奇鸟，鸣声婉转，从未听过。' },
  { w:4,  icon:'👻', text:'此地似曾相识，不知是否曾经到访……' },
];

function jnyPickMiniEvent(){
  const total = JOURNEY_MINI_EVENTS.reduce((s,e)=>s+e.w, 0);
  let r = Math.random() * total;
  for(const e of JOURNEY_MINI_EVENTS){ r -= e.w; if(r<=0) return e; }
  return JOURNEY_MINI_EVENTS[0];
}

// ── 计算时辰阶段（根据当天进度和段数） ──
function jnyGetPhase(segIdx, totalSegs, fromTerrain){
  // 根据进度粗略模拟时辰变化：早→午→黄昏→夜
  const pct = segIdx / Math.max(1, totalSegs - 1);
  if(pct < 0.5)  return 'day';
  if(pct < 0.75) return 'eve';
  return 'night';
}

// ════════════════════════════════════════════════
//  四季 & 天气系统数据
// ════════════════════════════════════════════════

// 游戏月份（1~12），存于 edS.gameMonth，初次出发随机分配
// 四季划分：春1-3，夏4-6，秋7-9，冬10-12
const SEASON_MAP = {
  1:'spring',2:'spring',3:'spring',
  4:'summer',5:'summer',6:'summer',
  7:'autumn',8:'autumn',9:'autumn',
  10:'winter',11:'winter',12:'winter'
};
const SEASON_INFO = {
  spring:{ label:'春', icon:'🌸', tint:'rgba(255,180,200,.08)', groundTint:'#a8d868', skyTint:'rgba(100,200,120,.06)',
           sunColor:'#ffe588', moonColor:'#d8f0ff', mountainColor:'#70b060',
           weatherPool:['sunny','sunny','cloudy','rain','rain','mist'] },
  summer:{ label:'夏', icon:'☀', tint:'rgba(255,200,50,.12)', groundTint:'#40c840', skyTint:'rgba(30,160,220,.08)',
           sunColor:'#ffee00', moonColor:'#c8e8ff', mountainColor:'#508040',
           weatherPool:['sunny','sunny','sunny','cloudy','rain','thunder'] },
  autumn:{ label:'秋', icon:'🍂', tint:'rgba(200,100,20,.12)', groundTint:'#c8a040', skyTint:'rgba(180,120,40,.08)',
           sunColor:'#ffa040', moonColor:'#ffe8c0', mountainColor:'#a07030',
           weatherPool:['sunny','cloudy','cloudy','wind','rain','mist'] },
  winter:{ label:'冬', icon:'❄', tint:'rgba(180,220,255,.1)', groundTint:'#c8dce8', skyTint:'rgba(140,180,220,.1)',
           sunColor:'#ffd8a0', moonColor:'#e0eeff', mountainColor:'#c0d0e0',
           weatherPool:['sunny','cloudy','snow','snow','snow','wind'] }
};

// 天气定义：id / label / icon / skyType覆盖 / 地面tint / topbar显示
const WEATHER_DEF = {
  sunny:   { label:'晴',  icon:'☀',  skyOverride:null,      groundTintMod:null,   skyTintAdd:null,
             fallType:null,   sunOpacityMod:1.0, moonOpacityMod:1.0, narr:'天朗气清，惠风和畅。' },
  cloudy:  { label:'多云',icon:'⛅', skyOverride:'day_cloud', groundTintMod:null, skyTintAdd:'rgba(60,60,80,.08)',
             fallType:null,   sunOpacityMod:0.6, moonOpacityMod:0.7, narr:'阴云渐起，遮住了半边天色。' },
  rain:    { label:'细雨',icon:'🌧', skyOverride:'rain',      groundTintMod:'rgba(40,60,120,.12)', skyTintAdd:'rgba(20,40,100,.18)',
             fallType:'rain', sunOpacityMod:0.15,moonOpacityMod:0.2, narr:'细雨绵绵，打湿了衣衫。' },
  thunder: { label:'雷雨',icon:'⛈', skyOverride:'thunder',   groundTintMod:'rgba(20,30,80,.2)',  skyTintAdd:'rgba(10,20,80,.28)',
             fallType:'rain', sunOpacityMod:0.0, moonOpacityMod:0.0, narr:'乌云翻滚，雷声隐隐，大雨倾盆！' },
  snow:    { label:'飘雪',icon:'❄',  skyOverride:'snow',      groundTintMod:'rgba(200,220,255,.1)', skyTintAdd:'rgba(160,200,240,.1)',
             fallType:'snow', sunOpacityMod:0.3, moonOpacityMod:0.5, narr:'鹅毛大雪纷飞，天地一片银白。' },
  wind:    { label:'大风',icon:'🌬', skyOverride:'wind',      groundTintMod:null, skyTintAdd:'rgba(100,80,40,.1)',
             fallType:'leaf', sunOpacityMod:0.8, moonOpacityMod:0.8, narr:'北风呼啸，黄沙漫天，睁眼都难。' },
  mist:    { label:'晨雾',icon:'🌫', skyOverride:'mist',      groundTintMod:'rgba(200,220,230,.15)', skyTintAdd:'rgba(180,210,220,.2)',
             fallType:null,   sunOpacityMod:0.4, moonOpacityMod:0.3, narr:'薄雾弥漫，山川如水墨画般朦胧。' },
};

// 天气专属 SKY_ART 补充（rain / thunder / wind / mist）——在 SKY_ART 定义后注入
function _injectWeatherSkyArt(SKY_ART){
  SKY_ART.rain = {
    body: '  ( )\n (' + ' ☁' + ' )\n  ( )',
    bodyColor: '#889aaa',
    clouds: '  (~~~~~~~~)         (~~~~~~~~~)              (~~~~~~~~~)          (~~~~~~~~~)        \n' +
            '(~~~~~~~~~~)(~~~~~~)(~~~~~~~~~~~)  (~~~~~~~~)(~~~~~~~~~~~)(~~~~~~)(~~~~~~~~~~~)(~~~~~~)\n' +
            ' (~~~~~~~~) (~~~~~~) (~~~~~~~~~) (~~~~~~~~~~)(~~~~~~~~~) (~~~~~~) (~~~~~~~~~)(~~~~~~~)',
    cloudColor: 'rgba(140,160,180,0.55)',
    bgColor: 'rgba(0,0,0,0)',
    fall: '|', fallType: 'rain',
    fallColor: 'rgba(140,180,220,0.5)',
  };
  SKY_ART.thunder = {
    body: '  /\\\n (⚡)\n  \\/',
    bodyColor: '#ffffaa',
    clouds: '(~~~~~~~~~~~~~~)        (~~~~~~~~~~~~~~)             (~~~~~~~~~~~~~~)                \n' +
            '(~~~~~~~~~~~~~~)(~~~~~~)(~~~~~~~~~~~~~~) (~~~~~~~~~~~)(~~~~~~~~~~~~~~)(~~~~~~~~~~~~~)\n' +
            ' (~~~~~~~~~~~~) (~~~~~~) (~~~~~~~~~~~~) (~~~~~~~~~~~) (~~~~~~~~~~~~) (~~~~~~~~~~~~~)',
    cloudColor: 'rgba(80,80,120,0.7)',
    bgColor: 'rgba(0,0,0,0)',
    fall: '|', fallType: 'rain',
    fallColor: 'rgba(100,140,200,0.65)',
  };
  SKY_ART.wind = {
    body: '  ~ ~\n~  ~  ~\n  ~ ~',
    bodyColor: '#c8b898',
    clouds: '  ~~~~~  ~~~  ~~~~~      ~~~~  ~~~~~  ~~~   ~~~~~   ~~~  ~~~~~      ~~~~  ~~~~~  ~~~ \n' +
            '~~~~~  ~~~  ~~~~~  ~~~  ~~~~~  ~~~  ~~~~~  ~~~   ~~~~~   ~~~  ~~~~~  ~~~  ~~~~~  ~~~\n' +
            ' ~~~~   ~~  ~~~~~  ~~~~  ~~~  ~~~~~  ~~~~   ~~~  ~~~~~  ~~~   ~~~~~  ~~~  ~~~~  ~~~~',
    cloudColor: 'rgba(180,160,120,0.5)',
    bgColor: 'rgba(0,0,0,0)',
    fall: '~', fallType: 'leaf',
    fallColor: 'rgba(180,160,100,0.45)',
  };
  SKY_ART.mist = {
    body: '  ...\n (☁☁)\n  ...',
    bodyColor: '#c8d8e0',
    clouds: '  ------   ------   ------   ------   ------   ------   ------   ------   ------   -\n' +
            '--------  --------  --------  --------  --------  --------  --------  --------  ----\n' +
            ' ------   ------   ------   ------   ------   ------   ------   ------   ------   ---',
    cloudColor: 'rgba(200,220,230,0.45)',
    bgColor: 'rgba(0,0,0,0)',
  };
}

// ════════════════════════════════════════════════
//  主函数：启动行路探索（替换原 travelMoveTo 的弹窗）
// ════════════════════════════════════════════════
