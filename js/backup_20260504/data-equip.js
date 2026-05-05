const COSTUMES = [

  // ══ 门派服装（25套）══
  // ★ rare档 defBonus/hpBonus 已按新底盘(HP≈860)重设：HP+150~200，DEF+18~30
  {id:'cs_shaolin',    name:'少林僧袍',    icon:'🟠', rarity:'rare',
   sectId:'shaolin',   color:'#e8a040',
   defBonus:28, hpBonus:180, mpBonus:80,atkBonus:6,critBonus:2,dodgeBonus:0,speedBonus:0,
   schoolBonus:{buddha:0.15, force:0.08},
   desc:'少林寺传承千年的武僧袈裟，以金丝镶边，防御卓绝，内力运转更为流畅。',
   special:'【金刚护体】佛系技能伤害+15%，受到伤害时有10%概率抵消',
   parts:{head:3, body:'禅', arms:3, legs:0, aura:2}},

  {id:'cs_wudang',     name:'武当道袍',    icon:'🔵', rarity:'rare',
   sectId:'wudang',    color:'#60d8d8',
   defBonus:18, hpBonus:140, mpBonus:220,atkBonus:4,critBonus:4,dodgeBonus:10,speedBonus:2,
   schoolBonus:{tao:0.15, wind:0.08},
   desc:'武当派专属道袍，以天蚕丝织就，轻盈飘逸，穿上后内力提升显著。',
   special:'【太极玄功】道系技能伤害+15%，每回合恢复少量内力',
   parts:{head:4, body:'道', arms:7, legs:1, aura:3}},

  {id:'cs_xiaoyao',    name:'逍遥仙衣',    icon:'🟢', rarity:'rare',
   sectId:'xiaoyao',   color:'#80f0c0',
   defBonus:16, hpBonus:160, mpBonus:240,atkBonus:4,critBonus:6,dodgeBonus:14,speedBonus:4,
   schoolBonus:{wind:0.18, ice:0.10},
   desc:'逍遥派秘传仙衣，以异域布料裁制，穿上后身轻如燕，步法飘逸无比。',
   special:'【天地逍遥】风系技能伤害+18%，闪避率+14%',
   parts:{head:8, body:'逍', arms:14, legs:9, aura:10}},

  {id:'cs_riyue',      name:'日月神衣',    icon:'🔴', rarity:'rare',
   sectId:'riyue',     color:'#ff8820',
   defBonus:22, hpBonus:160, mpBonus:140,atkBonus:10,critBonus:8,dodgeBonus:4,speedBonus:2,
   schoolBonus:{fire:0.18, force:0.10},
   desc:'日月神教圣火衣，以圣火炼制，刀枪不入，火焰不侵，威势凌人。',
   special:'【圣火护体】火系技能伤害+18%，有8%概率反弹伤害',
   parts:{head:9, body:'圣', arms:15, legs:4, aura:7}},

  {id:'cs_huashan',    name:'华山剑客袍',  icon:'🩵', rarity:'rare',
   sectId:'huashan',   color:'#80d8ff',
   defBonus:18, hpBonus:150, mpBonus:140,atkBonus:8,critBonus:10,dodgeBonus:8,speedBonus:3,
   schoolBonus:{sword:0.12, holy:0.06},
   desc:'华山派弟子标配，以上等青布裁制，剑气纵横，彰显名门气度。',
   special:'【剑气纵横】剑系技能伤害+12%，暴击率+6%',
   parts:{head:2, body:'华', arms:1, legs:4, aura:5}},

  {id:'cs_mingjiao',   name:'明教烈焰袍',  icon:'🔥', rarity:'rare',
   sectId:'mingjiao',  color:'#ff6020',
   defBonus:16, hpBonus:160, mpBonus:120,atkBonus:12,critBonus:8,dodgeBonus:2,speedBonus:2,
   schoolBonus:{fire:0.12, force:0.08},
   desc:'明教弟子战袍，以火蚕丝织就，烈焰不侵，身处火中亦无伤，士气高昂。',
   special:'【圣火令】火系技能伤害+12%，攻击力+8%',
   parts:{head:9, body:'明', arms:15, legs:6, aura:7}},

  {id:'cs_wudu',       name:'五毒藤甲衣',  icon:'💚', rarity:'rare',
   sectId:'wudu',      color:'#80e060',
   defBonus:20, hpBonus:150, mpBonus:120,atkBonus:6,critBonus:6,dodgeBonus:14,speedBonus:3,
   schoolBonus:{poison:0.15, shadow:0.08},
   desc:'五毒教以百年藤蔓编制，毒虫不噬，刀剑难伤，蕴藏百毒之气。',
   special:'【百毒不侵】毒系技能伤害+15%，自身免疫中毒状态',
   parts:{head:7, body:'毒', arms:13, legs:13, aura:6}},

  {id:'cs_tangmen',    name:'唐门暗器服',  icon:'🖤', rarity:'rare',
   sectId:'tangmen',   color:'#a080c0',
   defBonus:12, hpBonus:130, mpBonus:120,atkBonus:10,critBonus:12,dodgeBonus:16,speedBonus:5,
   schoolBonus:{shadow:0.15, qimen:0.10},
   desc:'唐门专制暗器服，内藏数十个暗格，可存放各式暗器，出手迅捷无比。',
   special:'【暗器精通】暗器（影系）技能伤害+15%，攻速+10%',
   parts:{head:5, body:'唐', arms:9, legs:6, aura:4}},

  {id:'cs_taohuadao',  name:'桃花仙子裙',  icon:'🩷', rarity:'rare',
   sectId:'taohuadao', color:'#ffaacc',
   defBonus:14, hpBonus:180, mpBonus:180,atkBonus:4,critBonus:8,dodgeBonus:10,speedBonus:2,
   schoolBonus:{ice:0.12, music:0.12},
   desc:'桃花岛特制粉衫，以千年桃木精华染就，穿上后魅力大增，令对手心神荡漾。',
   special:'【桃花迷阵】冰/琴系技能伤害+12%，有10%概率魅惑对手',
   parts:{head:14, body:'桃', arms:8, legs:8, aura:10}},

  {id:'cs_emei',       name:'峨眉素裳',    icon:'⚪', rarity:'rare',
   sectId:'emei',      color:'#e8e8ff',
   defBonus:18, hpBonus:160, mpBonus:180,atkBonus:4,critBonus:4,dodgeBonus:6,speedBonus:2,
   schoolBonus:{holy:0.15, tao:0.08},
   desc:'峨眉派尼姑素裳，以天山雪丝织就，纯白如雪，圣气护身，邪魔不侵。',
   special:'【圣光护体】圣系技能伤害+15%，受到攻击时有8%概率反弹',
   parts:{head:15, body:'眉', arms:7, legs:9, aura:10}},

  {id:'cs_kongtong',   name:'崆峒铁布衫',  icon:'🟤', rarity:'rare',
   sectId:'kongtong',  color:'#c08060',
   defBonus:32, hpBonus:180, mpBonus:80,atkBonus:12,critBonus:5,dodgeBonus:0,speedBonus:-3,
   schoolBonus:{force:0.15, thunder:0.08},
   desc:'崆峒派独门护体功夫外化于衣，以精铁丝缝制，防御奇高，适合力系高手。',
   special:'【铁布衫】防御+32，力系技能伤害+15%',
   parts:{head:9, body:'崆', arms:6, legs:0, aura:4}},

  {id:'cs_kunlun',     name:'昆仑雪羽衣',  icon:'❄️', rarity:'rare',
   sectId:'kunlun',    color:'#aaddff',
   defBonus:20, hpBonus:150, mpBonus:170,atkBonus:6,critBonus:5,dodgeBonus:6,speedBonus:2,
   schoolBonus:{ice:0.15, sword:0.08},
   desc:'昆仑山顶雪鹰羽毛制成，轻盈保暖，寒气护体，剑招更显飘逸。',
   special:'【寒冰护体】冰系技能伤害+15%，有12%概率冻结对手',
   parts:{head:2, body:'昆', arms:1, legs:4, aura:9}},

  {id:'cs_tiandibang', name:'天地帮战甲',  icon:'⚫', rarity:'rare',
   sectId:'tiandibang',color:'#888888',
   defBonus:28, hpBonus:160, mpBonus:60,atkBonus:10,critBonus:5,dodgeBonus:2,speedBonus:1,
   schoolBonus:{force:0.10, thunder:0.10},
   desc:'天地帮精铁锻造战甲，粗犷厚实，适合力量型战士，防御极为出色。',
   special:'【铁甲重击】力/雷系技能伤害+10%，防御+28',
   parts:{head:9, body:'帮', arms:6, legs:0, aura:8}},

  {id:'cs_guigu',      name:'鬼谷星象袍',  icon:'🔮', rarity:'rare',
   sectId:'guigu',     color:'#8866cc',
   defBonus:14, hpBonus:130, mpBonus:260,atkBonus:5,critBonus:6,dodgeBonus:10,speedBonus:3,
   schoolBonus:{qimen:0.18, fate:0.15},
   desc:'鬼谷门传承星象袍，以七星布局绣制，穿上后奇门心算更加精准，命格加持。',
   special:'【纵横捭阖】奇门/命系技能伤害+18%，技能冷却-10%',
   parts:{head:5, body:'谷', arms:14, legs:9, aura:14}},

  {id:'cs_shengguang', name:'圣光铠甲',    icon:'✨', rarity:'rare',
   sectId:'shengguang',color:'#ffffaa',
   defBonus:28, hpBonus:200, mpBonus:120,atkBonus:4,critBonus:2,dodgeBonus:4,speedBonus:1,
   schoolBonus:{holy:0.18, force:0.08},
   desc:'圣光教以神光铸造的神圣铠甲，圣气护身，令邪恶望而生畏。',
   special:'【神圣护佑】圣系技能伤害+18%，受伤后有15%概率回血',
   parts:{head:8, body:'光', arms:12, legs:0, aura:1}},

  {id:'cs_diancang',   name:'点苍剑客袍',  icon:'🩶', rarity:'rare',
   sectId:'diancang',  color:'#9999bb',
   defBonus:18, hpBonus:150, mpBonus:140,atkBonus:8,critBonus:8,dodgeBonus:10,speedBonus:3,
   schoolBonus:{sword:0.12, poison:0.08},
   desc:'点苍派弟子标准服饰，以苍山青石染就，剑意凛然，颇有大理名门气韵。',
   special:'【苍山剑气】剑/毒系技能伤害+12%，暴击率+5%',
   parts:{head:2, body:'苍', arms:1, legs:1, aura:13}},

  {id:'cs_tianshan',   name:'天山雪狐裘',  icon:'🤍', rarity:'rare',
   sectId:'tianshan',  color:'#cceeee',
   defBonus:20, hpBonus:160, mpBonus:170,atkBonus:5,critBonus:5,dodgeBonus:8,speedBonus:2,
   schoolBonus:{ice:0.15, holy:0.08},
   desc:'以天山雪狐皮毛制成，极寒之地穿戴如春，自带冰寒之气护体。',
   special:'【天山冰气】冰系技能伤害+15%，有10%概率减速对手',
   parts:{head:1, body:'山', arms:0, legs:0, aura:9}},

  {id:'cs_xixia',      name:'西夏密宗袍',  icon:'🟡', rarity:'rare',
   sectId:'xixia',     color:'#ddaa44',
   defBonus:16, hpBonus:150, mpBonus:220,atkBonus:6,critBonus:6,dodgeBonus:8,speedBonus:2,
   schoolBonus:{fate:0.15, qimen:0.10},
   desc:'西夏秘宗传承宝袍，以金线绣制密宗符文，穿上后奇门异术更加神妙。',
   special:'【密宗秘法】命/奇门系技能伤害+15%，有8%概率预知对手下一招',
   parts:{head:5, body:'夏', arms:14, legs:9, aura:14}},

  {id:'cs_tianlong',   name:'天龙龙袍',    icon:'🐉', rarity:'rare',
   sectId:'tianlong',  color:'#ff6644',
   defBonus:26, hpBonus:200, mpBonus:120,atkBonus:12,critBonus:4,dodgeBonus:0,speedBonus:0,
   schoolBonus:{force:0.18, fire:0.10},
   desc:'天龙帮帮主御赐龙袍，以龙鳞织就，威势凌人，令敌胆寒。',
   special:'【龙威】力/火系技能伤害+18%，攻击力+12%',
   parts:{head:11, body:'龙', arms:6, legs:7, aura:15}},

  {id:'cs_nangong',    name:'南宫世家礼袍', icon:'🏅', rarity:'rare',
   sectId:'nangong',   color:'#ddbb66',
   defBonus:18, hpBonus:170, mpBonus:150,atkBonus:8,critBonus:8,dodgeBonus:6,speedBonus:2,
   schoolBonus:{sword:0.12, holy:0.08},
   desc:'南宫世家传家礼袍，以金丝镶边，贵气逼人，名门世家风范尽显。',
   special:'【世家风范】剑/圣系技能伤害+12%，气血上限+150',
   parts:{head:5, body:'宫', arms:1, legs:1, aura:5}},

  {id:'cs_xuanming',   name:'玄冥双煞袍',  icon:'💜', rarity:'rare',
   sectId:'xuanming',  color:'#8844cc',
   defBonus:18, hpBonus:150, mpBonus:220,atkBonus:6,critBonus:6,dodgeBonus:6,speedBonus:2,
   schoolBonus:{ice:0.15, shadow:0.12},
   desc:'玄冥教双煞秘袍，以极北寒冰之气浸染，穿上后寒意透骨，令对手瑟瑟发抖。',
   special:'【玄冥寒气】冰/影系技能伤害+15%，攻击附带减速',
   parts:{head:6, body:'冥', arms:10, legs:0, aura:9}},

  {id:'cs_haisha',     name:'海沙帮战甲',  icon:'🟫', rarity:'rare',
   sectId:'haisha',    color:'#cc9966',
   defBonus:24, hpBonus:180, mpBonus:60,atkBonus:10,critBonus:5,dodgeBonus:6,speedBonus:2,
   schoolBonus:{shadow:0.12, force:0.10},
   desc:'海沙帮以沙漠铁矿打造，粗犷耐用，在沙场上久经考验的战甲。',
   special:'【沙场老手】影/力系技能伤害+12%，防御+24',
   parts:{head:1, body:'沙', arms:2, legs:6, aura:4}},

  {id:'cs_xuegu',      name:'血骨血衣',    icon:'❤️', rarity:'rare',
   sectId:'xuegu',     color:'#cc2222',
   defBonus:14, hpBonus:280, mpBonus:80,atkBonus:12,critBonus:6,dodgeBonus:2,speedBonus:0,
   schoolBonus:{shadow:0.18, force:0.08},
   desc:'血骨门以战场血肉淬炼，穿上此衣气血大增，愈战愈勇，越受伤越强。',
   special:'【血煞】影系技能伤害+18%，气血低于30%时攻击力+20%',
   parts:{head:6, body:'骨', arms:11, legs:0, aura:11}},

  {id:'cs_lingxiao',   name:'凌霄阁飞羽衣', icon:'🩵', rarity:'rare',
   sectId:'lingxiao',  color:'#88ccff',
   defBonus:16, hpBonus:150, mpBonus:170,atkBonus:6,critBonus:8,dodgeBonus:10,speedBonus:3,
   schoolBonus:{sword:0.12, wind:0.10},
   desc:'凌霄阁以仙鹤羽毛织就，穿上后轻如无物，身法飘逸，剑招更添灵动。',
   special:'【凌云御剑】剑/风系技能伤害+12%，闪避率+10%',
   parts:{head:2, body:'霄', arms:1, legs:6, aura:13}},

  {id:'cs_qingcheng',  name:'青城道袍',    icon:'🌿', rarity:'rare',
   sectId:'qingcheng', color:'#66aa66',
   defBonus:18, hpBonus:150, mpBonus:150,atkBonus:6,critBonus:6,dodgeBonus:8,speedBonus:3,
   schoolBonus:{poison:0.12, tao:0.10},
   desc:'青城派道袍，以青城山草药染就，自带药香，穿上后毒功更为深厚。',
   special:'【青城毒道】毒/道系技能伤害+12%，有10%概率使对手中毒',
   parts:{head:2, body:'青', arms:1, legs:1, aura:6}},

  // ══ 通用套装（5套）══
  {id:'cs_xia',        name:'江湖侠客袍',  icon:'⚔️', rarity:'common',
   sectId:null,         color:'#c8a060',
   defBonus:8, hpBonus:60, mpBonus:60,
   schoolBonus:{},
   desc:'走遍江湖的侠客常见装束，简洁耐用，攻守均衡，适合各路英雄。',
   special:'【侠义之心】防御+8，各项基础属性均衡提升',
   parts:{head:0, body:'││', arms:1, legs:4, aura:0}},

  {id:'cs_assassin',   name:'刺客夜行衣',  icon:'🌑', rarity:'rare',
   sectId:null,         color:'#445566',
   defBonus:14, hpBonus:140, mpBonus:160,atkBonus:6,critBonus:10,dodgeBonus:14,speedBonus:3,
   schoolBonus:{shadow:0.10},
   desc:'专为刺客设计的全黑夜行服，吸光藏形，夜间几乎隐形，出手如鬼魅。',
   special:'【夜行无踪】影系技能伤害+10%，暴击率+10%，闪避+14%',
   parts:{head:5, body:'║║', arms:9, legs:6, aura:4}},

  {id:'cs_general',    name:'战将铁铠',    icon:'🛡️', rarity:'rare',
   sectId:null,         color:'#8899aa',
   defBonus:38, hpBonus:200, mpBonus:60,atkBonus:6,critBonus:0,dodgeBonus:0,speedBonus:-3,
   schoolBonus:{force:0.08},
   desc:'沙场征战的将军铠甲，以百炼精铁锻就，防御极高，刀剑难伤。',
   special:'【铁甲将军】防御+38，力系伤害+8%，受伤时有12%概率格挡',
   parts:{head:11, body:'甲', arms:6, legs:7, aura:4}},

  {id:'cs_scholar',    name:'书生青衫',    icon:'📖', rarity:'common',
   sectId:null,         color:'#88aabb',
   defBonus:5, hpBonus:60, mpBonus:250,
   schoolBonus:{qimen:0.10, fate:0.10, music:0.10},
   desc:'手无缚鸡之力的文人装束，然内力深厚，奇门命理无一不精。',
   special:'【才高八斗】内力上限+250，奇门/命/琴系技能伤害+10%',
   parts:{head:0, body:'书', arms:14, legs:3, aura:14}},

  {id:'cs_merchant',   name:'富商锦袍',    icon:'💰', rarity:'common',
   sectId:null,         color:'#ddaa44',
   defBonus:6, hpBonus:80, mpBonus:80,
   schoolBonus:{},
   desc:'江湖富商出行时的华贵锦袍，以上等蜀锦制成，财气护体，逢凶化吉。',
   special:'【财运加身】气血上限+80，战斗结束后多获得20%银两',
   parts:{head:10, body:'锦', arms:5, legs:1, aura:0}},

  // ══ 传说级服装（legendary · 10套）══
  // ★ legendary档：HP+350~420，DEF+40~55，ATK/CRIT大幅强化
  {id:'cs_lg_shaolin',  name:'达摩祖师袈裟',  icon:'🟠', rarity:'legendary',
   sectId:'shaolin',    color:'#ffd060',
   defBonus:50, hpBonus:400, mpBonus:250,atkBonus:12,critBonus:5,dodgeBonus:2,speedBonus:0,
   schoolBonus:{buddha:0.28, force:0.18},
   desc:'少林初祖达摩西渡所穿袈裟，以金刚线织就，千年不腐，护佑持者身如金刚、不受外邪侵扰。',
   special:'【金刚不坏】佛系技能伤害+28%，受击伤害减少20%，每回合恢复气血3%',
   parts:{head:5, body:'禅', arms:3, legs:0, aura:12}},

  {id:'cs_lg_wudang',   name:'真武玄天道袍',   icon:'🔵', rarity:'legendary',
   sectId:'wudang',     color:'#60d8ff',
   defBonus:35, hpBonus:320, mpBonus:450,atkBonus:8,critBonus:10,dodgeBonus:16,speedBonus:4,
   schoolBonus:{tao:0.28, wind:0.18},
   desc:'武当祖师真武大帝降世时遗留的玄天道袍，阴阳鱼纹流转不息，内藏太极之妙，与天地同脉。',
   special:'【太极归元】道/风系技能伤害+28%，内力恢复+20%，闪避率+16%',
   parts:{head:4, body:'道', arms:14, legs:9, aura:11}},

  {id:'cs_lg_riyue',    name:'日月乾坤袍',     icon:'🔴', rarity:'legendary',
   sectId:'riyue',      color:'#ffaa40',
   defBonus:40, hpBonus:360, mpBonus:300,atkBonus:18,critBonus:16,dodgeBonus:8,speedBonus:3,
   schoolBonus:{fire:0.28, force:0.18},
   desc:'日月神教镇教之宝，以日精月华炼就，外绣金乌玉兔相抱，光明烈焰与无尽暗影化于一袍。',
   special:'【日月同辉】火/力系技能伤害+28%，暴击率+16%，必杀技伤害×1.3',
   parts:{head:9, body:'日', arms:6, legs:4, aura:13}},

  {id:'cs_lg_xiaoyao',  name:'御风逍遥仙袍',   icon:'🟢', rarity:'legendary',
   sectId:'xiaoyao',    color:'#80ffcc',
   defBonus:28, hpBonus:280, mpBonus:520,atkBonus:6,critBonus:12,dodgeBonus:26,speedBonus:7,
   schoolBonus:{wind:0.28, ice:0.20},
   desc:'逍遥派祖师无名老翁亲手缝制的传世仙袍，以九天玄风为经、北海冰霜为纬，穿之身心两忘，来去无踪。',
   special:'【逍遥御风】风/冰系技能伤害+28%，闪避率+26%，移速最快',
   parts:{head:8, body:'逍', arms:15, legs:9, aura:14}},

  {id:'cs_lg_xuanming', name:'玄冥寒冰战甲',   icon:'🟣', rarity:'legendary',
   sectId:'xuanming',   color:'#9955ee',
   defBonus:45, hpBonus:340, mpBonus:420,atkBonus:10,critBonus:8,dodgeBonus:8,speedBonus:1,
   schoolBonus:{ice:0.28, shadow:0.22},
   desc:'玄冥教历代教主专用战甲，以万年玄冥寒铁锻造，内嵌紫影晶，冷气入骨，令百毒不侵、冰煞护体。',
   special:'【玄冥寒煞】冰/影系技能伤害+28%，对敌持续施加冻伤，防御+30%',
   parts:{head:6, body:'冥', arms:10, legs:0, aura:10}},

  {id:'cs_lg_tianzhan', name:'天罗雷霆战甲',    icon:'⚡', rarity:'legendary',
   sectId:'tiandibang', color:'#88ccff',
   defBonus:55, hpBonus:380, mpBonus:220,atkBonus:16,critBonus:10,dodgeBonus:2,speedBonus:1,
   schoolBonus:{thunder:0.28, force:0.18},
   desc:'天地帮历代帮主传承之战甲，以雷胆矿石锻造，恒有电芒流转，穿上后力拔山河，雷霆万钧。',
   special:'【天罗雷霆】雷/力系技能伤害+28%，攻击时有25%概率附加雷电震慑效果',
   parts:{head:11, body:'雷', arms:6, legs:7, aura:13}},

  {id:'cs_lg_taohua',   name:'仙子桃花霓裳',   icon:'🌸', rarity:'legendary',
   sectId:'taohuadao',  color:'#ffbbdd',
   defBonus:26, hpBonus:340, mpBonus:420,atkBonus:8,critBonus:14,dodgeBonus:18,speedBonus:5,
   schoolBonus:{ice:0.22, music:0.25},
   desc:'桃花堂传世仙裳，以万年桃花为底、凤尾蚕丝织就，笼有淡淡桃花仙气，令见者心神摇曳、难以抵御。',
   special:'【桃花仙境】冰/琴系技能伤害+25%，对异性敌人额外施加魅惑效果，闪避+18%',
   parts:{head:9, body:'花', arms:15, legs:4, aura:10}},

  {id:'cs_lg_xuegu',    name:'百骸血魔战袍',    icon:'🩸', rarity:'legendary',
   sectId:'xuegu',      color:'#cc3333',
   defBonus:32, hpBonus:560, mpBonus:200,atkBonus:20,critBonus:12,dodgeBonus:4,speedBonus:1,
   schoolBonus:{shadow:0.28, force:0.15},
   desc:'血骨门历代宗主以生死之力炼成的战袍，以万人白骨研磨成粉混入血丝织就，杀气无尽、令鬼神胆寒。',
   special:'【血魔噬魂】影/力系技能伤害+28%，攻击时吸取对方10%气血，气血越低攻击越高',
   parts:{head:6, body:'血', arms:5, legs:7, aura:13}},

  {id:'cs_lg_shengguang',name:'圣光天使铠',     icon:'✨', rarity:'legendary',
   sectId:'shengguang', color:'#ffffcc',
   defBonus:52, hpBonus:450, mpBonus:280,atkBonus:10,critBonus:8,dodgeBonus:8,speedBonus:2,
   schoolBonus:{holy:0.30, fate:0.15},
   desc:'圣光教大祭司穿用的天使铠甲，以神光凝炼、圣力护身，令邪魔不侵、百煞不入，神圣光辉令人目眩。',
   special:'【圣光护佑】圣/命系技能伤害+30%，受到致命伤时有30%概率以圣盾抵消一次',
   parts:{head:11, body:'圣', arms:3, legs:7, aura:15}},

  {id:'cs_lg_kongtong', name:'七伤玄铁重铠',    icon:'🟤', rarity:'legendary',
   sectId:'kongtong',   color:'#cc9966',
   defBonus:60, hpBonus:420, mpBonus:240,atkBonus:18,critBonus:8,dodgeBonus:0,speedBonus:-4,
   schoolBonus:{force:0.28, thunder:0.18},
   desc:'崆峒派祖师七伤老人所锻玄铁重铠，重达百斤，以崆峒秘法将七种伤力融入甲中，穿上后力大无穷。',
   special:'【七伤凝力】力/雷系技能伤害+28%，防御+60，每次受击积累怒气，满怒下一击必暴击',
   parts:{head:11, body:'崆', arms:6, legs:7, aura:10}},

  // ══ 史诗级服装（epic · 8套）══
  // ★ epic档：HP+260~340，DEF+30~50，ATK/CRIT中等强化
  {id:'cs_ep_shadow',   name:'幽冥夜行铠',     icon:'🌑', rarity:'epic',
   sectId:null,          color:'#9966cc',
   defBonus:30, hpBonus:280, mpBonus:300,atkBonus:12,critBonus:14,dodgeBonus:20,speedBonus:6,
   schoolBonus:{shadow:0.18, poison:0.12},
   desc:'暗杀行会密传之铠，以夜晶和幽墨织制，融入百种毒物精华，穿上后如影随形、近乎隐身。',
   special:'【幽冥隐袭】影/毒系技能伤害+18%，背刺伤害×1.5，闪避+20%',
   parts:{head:2, body:'║║', arms:5, legs:6, aura:8}},

  {id:'cs_ep_iron',     name:'玄铁龙鳞甲',     icon:'🔩', rarity:'epic',
   sectId:null,          color:'#8899bb',
   defBonus:55, hpBonus:340, mpBonus:140,atkBonus:14,critBonus:5,dodgeBonus:0,speedBonus:-1,
   schoolBonus:{force:0.15, thunder:0.10},
   desc:'百炼玄铁以龙鳞纹锻制的重甲，坚不可摧，以厚重换来无与伦比的防御，乃军中猛将之选。',
   special:'【铁甲无敌】力/雷系技能伤害+15%，防御+55，受击减伤30%（闪避为0）',
   parts:{head:11, body:'铁', arms:6, legs:7, aura:5}},

  {id:'cs_ep_wind',     name:'御风飞羽战袍',   icon:'💨', rarity:'epic',
   sectId:null,          color:'#88ddff',
   defBonus:22, hpBonus:260, mpBonus:340,atkBonus:8,critBonus:10,dodgeBonus:18,speedBonus:7,
   schoolBonus:{wind:0.18, ice:0.12},
   desc:'以凤羽和灵鸟尾羽织制的战袍，穿上后身轻如燕，步法绝伦，风系内力运转速度加倍。',
   special:'【御风疾步】风/冰系技能伤害+18%，速度+7，每3回合免费施放一次疾风步',
   parts:{head:8, body:'风', arms:15, legs:9, aura:9}},

  {id:'cs_ep_fire',     name:'炎龙焚天战甲',   icon:'🔥', rarity:'epic',
   sectId:null,          color:'#ff7733',
   defBonus:40, hpBonus:300, mpBonus:280,atkBonus:18,critBonus:12,dodgeBonus:3,speedBonus:1,
   schoolBonus:{fire:0.20, thunder:0.12},
   desc:'以炎龙骨熔炼锻造的战甲，常年灼热，穿上后如同引燃自身，火力大增，令人望而生畏。',
   special:'【炎龙焚天】火/雷系技能伤害+20%，攻击时有20%概率附加灼烧，暴击率+12%',
   parts:{head:9, body:'炎', arms:6, legs:4, aura:12}},

  {id:'cs_ep_buddha',   name:'菩提金身袈裟',   icon:'🌕', rarity:'epic',
   sectId:null,          color:'#ffdd88',
   defBonus:42, hpBonus:380, mpBonus:320,atkBonus:6,critBonus:5,dodgeBonus:5,speedBonus:0,
   schoolBonus:{buddha:0.20, holy:0.15},
   desc:'经过百年加持的金身袈裟，以菩提树叶研磨金液浸染，佛光护身，令持有者身入佛境、心无杂念。',
   special:'【菩提金身】佛/圣系技能伤害+20%，每回合恢复气血4%，减少受到的暴击伤害',
   parts:{head:5, body:'佛', arms:3, legs:0, aura:12}},

  {id:'cs_ep_poison',   name:'百毒不侵锦袍',   icon:'🐍', rarity:'epic',
   sectId:null,          color:'#88cc66',
   defBonus:25, hpBonus:280, mpBonus:340,atkBonus:10,critBonus:10,dodgeBonus:12,speedBonus:4,
   schoolBonus:{poison:0.22, shadow:0.12},
   desc:'五毒宗秘传锦袍，以五大奇毒炼制，穿者百毒不侵，更能以毒攻毒，向敌人散发毒气。',
   special:'【百毒加身】毒/影系技能伤害+22%，受到毒伤害时免疫并反噬，攻击附加中毒效果',
   parts:{head:8, body:'毒', arms:15, legs:6, aura:8}},

  {id:'cs_ep_qimen',    name:'奇门星象法袍',   icon:'⭐', rarity:'epic',
   sectId:null,          color:'#cc88ff',
   defBonus:20, hpBonus:250, mpBonus:460,atkBonus:6,critBonus:8,dodgeBonus:10,speedBonus:3,
   schoolBonus:{qimen:0.22, fate:0.18},
   desc:'鬼谷门传世法袍，绣有二十八星宿图文，以日月星辰之气灌注，穿上后奇门遁甲推演如有神助。',
   special:'【奇门星象】奇门/命系技能伤害+22%，技能CD缩减15%，暴击时附加困惑效果',
   parts:{head:4, body:'奇', arms:14, legs:9, aura:11}},

  {id:'cs_ep_sword',    name:'天剑流光护甲',   icon:'💠', rarity:'epic',
   sectId:null,          color:'#88bbff',
   defBonus:32, hpBonus:300, mpBonus:260,atkBonus:16,critBonus:16,dodgeBonus:10,speedBonus:4,
   schoolBonus:{sword:0.22, wind:0.12},
   desc:'以折断的天外陨铁剑碎片打造的轻甲，锋锐之气长存于甲中，穿上后剑意自生，攻击快如闪电。',
   special:'【天剑流光】剑/风系技能伤害+22%，暴击率+16%，速度+4，出手速度提升',
   parts:{head:1, body:'剑', arms:14, legs:9, aura:9}},

  // ══ 神器级服装（mythic · 5套）══
  // ★ mythic档：HP+450~550，DEF+55~70，全面强化
  {id:'cs_tianzhan',   name:'天战神铠',     icon:'⚡', rarity:'mythic',
   sectId:null,         color:'#aaddff',
   defBonus:70, hpBonus:500, mpBonus:300,
   schoolBonus:{force:0.25, thunder:0.20, sword:0.15},
   desc:'上古战神遗留的神铠，以天外陨铁锻就，融入百位武林宗师的毕生内力，穿上后战意滔天，无可匹敌。',
   special:'【战神降世】全系技能伤害+15%，防御+70，每回合恢复气血5%',
   parts:{head:11, body:'战', arms:6, legs:7, aura:15}},

  {id:'cs_xuanhuang',  name:'玄黄混沌袍',   icon:'🌌', rarity:'mythic',
   sectId:null,         color:'#9966ff',
   defBonus:45, hpBonus:380, mpBonus:580,
   schoolBonus:{tao:0.25, fate:0.25, qimen:0.20},
   desc:'开天辟地之时天地玄黄之气所凝，道、命、奇门三系融为一体，穿上后洞悉天机，万法归宗。',
   special:'【混沌归元】道/命/奇门系技能伤害+25%，技能冷却-20%',
   parts:{head:4, body:'玄', arms:14, legs:9, aura:14}},

  {id:'cs_fenghuang',  name:'凤凰涅槃羽衣',  icon:'🔥', rarity:'mythic',
   sectId:null,         color:'#ff8844',
   defBonus:38, hpBonus:460, mpBonus:360,
   schoolBonus:{fire:0.28, holy:0.20, wind:0.15},
   desc:'神鸟凤凰涅槃时羽毛幻化而成，以圣火永燃，穿上后生命力极为旺盛，烈焰护身，死而复生。',
   special:'【凤凰涅槃】火/圣系技能伤害+28%，气血归零时有一次复活并恢复50%',
   parts:{head:9, body:'凤', arms:15, legs:4, aura:7}},

  {id:'cs_bingpo',     name:'冰魄玄冰战甲',   icon:'❄️', rarity:'mythic',
   sectId:null,         color:'#88eeff',
   defBonus:60, hpBonus:420, mpBonus:450,
   schoolBonus:{ice:0.30, shadow:0.18, poison:0.12},
   desc:'万年寒潭底部凝结的冰魄所铸，寒意入骨，百毒不侵，触之立冻，天下攻击皆减三成。',
   special:'【万年冰魄】冰/影系技能伤害+30%，使对手攻击力降低15%，有20%概率冻结',
   parts:{head:6, body:'冰', arms:10, legs:0, aura:9}},

  {id:'cs_jiulong',    name:'九龙至尊袍',    icon:'🐉', rarity:'mythic',
   sectId:null,         color:'#ffd060',
   defBonus:55, hpBonus:480, mpBonus:400,
   schoolBonus:{force:0.22, fire:0.22, thunder:0.18, sword:0.15},
   desc:'九条真龙之鳞编织而成，金光璀璨，龙威凛冽，穿上后令万物臣服，天地同威。',
   special:'【九龙至尊】力/火/雷系技能伤害+22%，暴击率+20%，暴击伤害×1.5',
   parts:{head:9, body:'龙', arms:6, legs:7, aura:15}},

  // ══ 精品级服装（uncommon · 20套）══
  // ★ uncommon档：HP+100~140，DEF+10~20
  // ── 通用精品（10套）──
  {id:'cs_wulin',      name:'武林布衣',      icon:'🥋', rarity:'uncommon',
   sectId:null,         color:'#aa8866',
   defBonus:12, hpBonus:100, mpBonus:80,
   schoolBonus:{force:0.06},
   desc:'江湖中随处可见的武林习武服，结实耐磨，束腰便于发力，适合初出茅庐的武者。',
   special:'【勤练不辍】力系伤害+6%，经验获取+10%',
   parts:{head:0, body:'║║', arms:3, legs:3, aura:0}},

  {id:'cs_youxia',     name:'游侠轻甲',      icon:'🏹', rarity:'uncommon',
   sectId:null,         color:'#996644',
   defBonus:16, hpBonus:110, mpBonus:110,
   schoolBonus:{shadow:0.08, wind:0.06},
   desc:'游走四方的侠客轻甲，皮革与锁链混编，攻守兼备，便于长途跋涉。',
   special:'【四海为家】影/风系伤害+8%，移动速度+8%',
   parts:{head:1, body:'║║', arms:2, legs:6, aura:0}},

  {id:'cs_hunter',     name:'猎人皮甲',      icon:'🦊', rarity:'uncommon',
   sectId:null,         color:'#886633',
   defBonus:18, hpBonus:120, mpBonus:70,
   schoolBonus:{poison:0.08, shadow:0.06},
   desc:'深山老猎人的兽皮甲，以猛兽皮革精制，耐磨防穿刺，带有野性气息。',
   special:'【野性直觉】毒/影系伤害+8%，闪避率+6%',
   parts:{head:1, body:'兽', arms:0, legs:3, aura:0}},

  {id:'cs_monk_robe',  name:'行脚僧衲衣',    icon:'🟤', rarity:'uncommon',
   sectId:null,         color:'#bb8855',
   defBonus:10, hpBonus:110, mpBonus:170,
   schoolBonus:{buddha:0.10, tao:0.06},
   desc:'云游四方的行脚僧所穿纳衣，百衲而成，虽破旧却蕴含深厚佛气，心静则力强。',
   special:'【百衲禅心】佛/道系伤害+10%，受到攻击时内力+5',
   parts:{head:3, body:'衲', arms:7, legs:1, aura:2}},

  {id:'cs_ranger',     name:'侦察皮衣',      icon:'🌿', rarity:'uncommon',
   sectId:null,         color:'#558855',
   defBonus:14, hpBonus:105, mpBonus:105,
   schoolBonus:{wind:0.08, poison:0.06},
   desc:'擅长山林潜行的斥候装束，以草木染就，与丛林融为一体，出奇制胜。',
   special:'【林间隐匿】风/毒系伤害+8%，先手攻击伤害+15%',
   parts:{head:1, body:'林', arms:0, legs:3, aura:13}},

  {id:'cs_swordsman',  name:'剑客青袍',      icon:'🗡️', rarity:'uncommon',
   sectId:null,         color:'#7799bb',
   defBonus:12, hpBonus:100, mpBonus:140,
   schoolBonus:{sword:0.10, wind:0.06},
   desc:'漂泊剑客的标志性青色长袍，飘逸潇洒，剑意自现，颇有几分仙气。',
   special:'【剑意凌云】剑/风系伤害+10%，出招速度+8%',
   parts:{head:2, body:'剑', arms:1, legs:4, aura:5}},

  {id:'cs_soldier',    name:'军营战袍',      icon:'⚔️', rarity:'uncommon',
   sectId:null,         color:'#887744',
   defBonus:22, hpBonus:130, mpBonus:70,
   schoolBonus:{force:0.08, thunder:0.06},
   desc:'军营标配战袍，以粗麻加皮革缝制，虽不华贵却经久耐用，沙场检验。',
   special:'【军旅磨砺】力/雷系伤害+8%，防御+22',
   parts:{head:9, body:'军', arms:6, legs:0, aura:4}},

  {id:'cs_taoist_grey',name:'灰袍道士服',    icon:'⭕', rarity:'uncommon',
   sectId:null,         color:'#999988',
   defBonus:10, hpBonus:90, mpBonus:190,
   schoolBonus:{tao:0.10, fate:0.08},
   desc:'云游道士的灰色道袍，朴实无华，却蕴含道家清净之气，令内力循环更加顺畅。',
   special:'【清净无为】道/命系伤害+10%，每回合恢复内力3点',
   parts:{head:4, body:'袍', arms:7, legs:9, aura:3}},

  {id:'cs_fisherman',  name:'渔夫蓑衣',      icon:'🎣', rarity:'uncommon',
   sectId:null,         color:'#778855',
   defBonus:8, hpBonus:120, mpBonus:130,
   schoolBonus:{tao:0.08, fate:0.08},
   desc:'隐居江边的高人常穿蓑衣，看似普通却洞察世事，万物皆是道，随遇而安。',
   special:'【随遇而安】道/命系伤害+8%，战斗中减少30%恐慌效果',
   parts:{head:0, body:'蓑', arms:14, legs:3, aura:0}},

  {id:'cs_beggar',     name:'乞丐百衲衣',    icon:'🧤', rarity:'uncommon',
   sectId:null,         color:'#887766',
   defBonus:6, hpBonus:140, mpBonus:110,
   schoolBonus:{force:0.08, shadow:0.08},
   desc:'丐帮弟子的百衲破衣，虽破烂却每一块布都沾染过打架厮杀的气息，越打越勇。',
   special:'【越挫越勇】力/影系伤害+8%，气血越低攻击力越高（最高+20%）',
   parts:{head:0, body:'丐', arms:2, legs:3, aura:0}},

  // ── 门派专属精品（10套）──
  {id:'cs_tiandibang2',name:'天地帮精锐甲',  icon:'⚫', rarity:'uncommon',
   sectId:'tiandibang',color:'#aaaaaa',
   defBonus:30, hpBonus:160, mpBonus:80,
   schoolBonus:{force:0.12, thunder:0.10},
   desc:'天地帮精锐队员特制铁甲，比普通战甲更为厚实，甲叶间嵌入雷石，雷系功法更加有力。',
   special:'【雷霆铁甲】力/雷系技能伤害+12%，防御+30，格挡率+10%',
   parts:{head:11, body:'帮', arms:6, legs:0, aura:8}},

  {id:'cs_diancang2',  name:'点苍剑仙袍',    icon:'🩶', rarity:'uncommon',
   sectId:'diancang',  color:'#aabbcc',
   defBonus:18, hpBonus:130, mpBonus:160,
   schoolBonus:{sword:0.14, poison:0.10},
   desc:'点苍派资深弟子才能得到的剑仙袍，以大理白石磨粉染就，剑毒合一，精妙无比。',
   special:'【剑毒合璧】剑/毒系技能伤害+14%，暴击附带中毒效果',
   parts:{head:2, body:'苍', arms:1, legs:1, aura:13}},

  {id:'cs_haisha2',    name:'海沙帮精铁甲',  icon:'🟫', rarity:'uncommon',
   sectId:'haisha',    color:'#ddaa77',
   defBonus:26, hpBonus:170, mpBonus:70,
   schoolBonus:{shadow:0.14, force:0.10},
   desc:'海沙帮以西域沙漠特产玄铁打造，沙粒嵌入甲缝，摩擦时产生独特磨伤效果。',
   special:'【沙场铁甲】影/力系技能伤害+14%，防御+26，攻击附带流血效果概率+8%',
   parts:{head:1, body:'沙', arms:2, legs:6, aura:4}},

  {id:'cs_qingcheng2', name:'青城毒道袍',    icon:'🌿', rarity:'uncommon',
   sectId:'qingcheng', color:'#88cc88',
   defBonus:18, hpBonus:130, mpBonus:170,
   schoolBonus:{poison:0.15, tao:0.12},
   desc:'青城派毒道双修者的进阶道袍，以百毒浸染青城茶叶再织，毒道交融，别有意境。',
   special:'【毒道一体】毒/道系技能伤害+15%，中毒效果强化+20%',
   parts:{head:2, body:'青', arms:1, legs:1, aura:6}},

  {id:'cs_xuegu2',     name:'血骨煞气战甲',  icon:'❤️', rarity:'uncommon',
   sectId:'xuegu',     color:'#ee4444',
   defBonus:14, hpBonus:300, mpBonus:100,
   schoolBonus:{shadow:0.20, force:0.10},
   desc:'血骨门高阶战甲，以敌人鲜血浸泡百日，穿上后煞气弥漫，令对手胆寒三分。',
   special:'【嗜血煞神】影系伤害+20%，气血低于50%时攻击力额外+15%',
   parts:{head:6, body:'骨', arms:11, legs:0, aura:11}},

  {id:'cs_nangong2',   name:'南宫世家战袍',  icon:'🏅', rarity:'uncommon',
   sectId:'nangong',   color:'#eeccaa',
   defBonus:18, hpBonus:150, mpBonus:155,
   schoolBonus:{sword:0.14, holy:0.10},
   desc:'南宫世家专为上阵杀敌设计的战袍，贵气而不失威武，兼顾门面与实战。',
   special:'【世家铁骑】剑/圣系技能伤害+14%，气血上限+150',
   parts:{head:5, body:'宫', arms:1, legs:1, aura:5}},

  {id:'cs_kongtong2',  name:'崆峒玄铁战甲',  icon:'🟤', rarity:'uncommon',
   sectId:'kongtong',  color:'#cc9966',
   defBonus:35, hpBonus:170, mpBonus:100,
   schoolBonus:{force:0.18, thunder:0.10},
   desc:'崆峒派以玄铁精制的进阶战甲，远比铁布衫更为厚实，穿上后如铜墙铁壁。',
   special:'【玄铁战甲】防御+35，力/雷系技能伤害+18%，格挡后反弹小量伤害',
   parts:{head:9, body:'崆', arms:6, legs:0, aura:4}},

  {id:'cs_emei2',      name:'峨眉金丝霓裳',  icon:'⚪', rarity:'uncommon',
   sectId:'emei',      color:'#ddddff',
   defBonus:18, hpBonus:150, mpBonus:200,
   schoolBonus:{holy:0.18, tao:0.10},
   desc:'峨眉派以蜀中金蚕丝精制，霓裳如仙，穿上后圣气流转，令邪魔不敢近身。',
   special:'【霓裳护圣】圣/道系技能伤害+18%，受伤后有12%概率反弹',
   parts:{head:15, body:'眉', arms:7, legs:9, aura:10}},

  {id:'cs_lingxiao2',  name:'凌霄阁御风袍',  icon:'🩵', rarity:'uncommon',
   sectId:'lingxiao',  color:'#99ddff',
   defBonus:16, hpBonus:130, mpBonus:200,
   schoolBonus:{sword:0.14, wind:0.12},
   desc:'凌霄阁御风袍，以天上九霄云雾织就，穿上后身如无物，御风而行，剑招飘逸绝伦。',
   special:'【御风凌云】剑/风系技能伤害+14%，闪避率+12%，攻速+8%',
   parts:{head:2, body:'霄', arms:1, legs:6, aura:13}},

  {id:'cs_tianshan2',  name:'天山雪莲战袍',  icon:'🤍', rarity:'uncommon',
   sectId:'tianshan',  color:'#bbeeee',
   defBonus:20, hpBonus:150, mpBonus:200,
   schoolBonus:{ice:0.18, holy:0.10},
   desc:'天山派以雪莲花瓣精制的战袍，清香永驻，寒意护体，使对手攻击时心生迟疑。',
   special:'【雪莲冰魄】冰/圣系技能伤害+18%，每回合有10%概率冻结对手1回合',
   parts:{head:1, body:'山', arms:0, legs:0, aura:9}},

  // ══ 凡品级服装（common · 5套）══
  // ★ common档：HP+40~60，DEF+3~6
  {id:'cs_cloth',      name:'粗布麻衣',      icon:'👕', rarity:'common',
   sectId:null,         color:'#aaaaaa',
   defBonus:3, hpBonus:40, mpBonus:30,
   schoolBonus:{},
   desc:'最普通不过的粗布麻衣，毫无特别之处，胜在结实耐磨，价格低廉。',
   special:'【朴实无华】气血+40，无其他加成',
   parts:{head:0, body:' ║ ', arms:0, legs:3, aura:0}},

  {id:'cs_straw',      name:'蓑草斗笠装',    icon:'🌾', rarity:'common',
   sectId:null,         color:'#bbaa77',
   defBonus:4, hpBonus:50, mpBonus:40,
   schoolBonus:{tao:0.04},
   desc:'农家蓑衣加斗笠，防雨防晒，虽是粗物，却蕴含田园自然之气。',
   special:'【田园自在】道系伤害+4%，气血恢复速度略微提升',
   parts:{head:0, body:'草║衣', arms:0, legs:3, aura:0}},

  {id:'cs_torn_robe',  name:'破旧道袍',      icon:'🩹', rarity:'common',
   sectId:null,         color:'#887755',
   defBonus:4, hpBonus:40, mpBonus:70,
   schoolBonus:{tao:0.04, fate:0.04},
   desc:'不知经历多少风雨的破旧道袍，缝了又缝补了又补，却有一种历经沧桑的气质。',
   special:'【沧桑阅历】道/命系伤害+4%，内力+70',
   parts:{head:4, body:'旧║袍', arms:7, legs:1, aura:0}},

  {id:'cs_hemp',       name:'麻布练功服',    icon:'🥊', rarity:'common',
   sectId:null,         color:'#998877',
   defBonus:5, hpBonus:55, mpBonus:55,
   schoolBonus:{force:0.05},
   desc:'专门用来练功的麻布服，宽松耐磨，便于各种高难度动作，是武者最常见的练功服。',
   special:'【勤学苦练】力系伤害+5%，经验获取+5%',
   parts:{head:0, body:' ╫ ', arms:3, legs:3, aura:0}},

  {id:'cs_strip',      name:'江湖褴褛衫',    icon:'🪢', rarity:'common',
   sectId:null,         color:'#997766',
   defBonus:3, hpBonus:45, mpBonus:35,
   schoolBonus:{},
   desc:'刚出道的江湖新人最常见的衣着，虽然寒酸，但每一个大侠都曾有过这样的开始。',
   special:'【初出茅庐】无特殊加成，胜在便宜耐穿',
   parts:{head:0, body:'╎║╎', arms:0, legs:3, aura:0}},
];

// ══════════════════════════════════════════════════════════════════
//  ✦ 配饰数据 — 蛐蛐笼（第三装备槽）✦
// ══════════════════════════════════════════════════════════════════
// type: 'accessory' | 装备槽: edS.accessoryInstId
// cageStats: { staminaRegen=每场战斗后体力恢复, hpRegen=每场战斗后气血恢复,
//              speedBoost=攻/防/速加成, slots=蛐蛐容量（叠放）}
// 配饰不受鉴定影响，直接使用模板属性
const ACCESSORIES = [

  // ── 凡品蛐蛐笼 ──
  { id:'acc_cricket_basic',   name:'竹编蛐蛐罐',
    icon:'🧺', rarity:'common',  color:'#a0a060',
    desc:'用细竹条编成的小罐，透气养蛐。蛐蛐恢复速度+10%，每场战斗后体力恢复+3。',
    cageStats:{ staminaRegen:3,  hpRegen:0,   speedBoost:0, slots:1 },
  },

  // ── 精品蛐蛐笼 ──
  { id:'acc_cricket_fine',    name:'精制蛐蛐笼',
    icon:'🏮', rarity:'uncommon',color:'#c08040',
    desc:'以上好紫竹编制，配有小水槽。蛐蛐恢复速度+25%，每场战斗后体力恢复+8、血量恢复+5，攻/防/速各+1。',
    cageStats:{ staminaRegen:8,  hpRegen:5,   speedBoost:1, slots:1 },
  },

  // ── 精良蛐蛐笼 ──
  { id:'acc_cricket_premium', name:'上等斗蛐金笼',
    icon:'🪗', rarity:'rare',    color:'#ffd060',
    desc:'以金丝竹为骨、玉石为底，顶级斗蛐玩家的象征。蛐蛐恢复速度翻倍，每场战斗后体力恢复+15、血量恢复+12，攻/防/速各+3。',
    cageStats:{ staminaRegen:15, hpRegen:12,  speedBoost:3, slots:1 },
  },

  // ── 武学腰带（技能槽扩展） ──
  { id:'acc_martial_belt',    name:'武学腰带',
    icon:'🟫', rarity:'epic',   color:'#c080f0',
    skillSlotBonus: 1,
    desc:'武林中流传的特殊腰带，内衬夹层中藏有前辈武学心得。装备后技能槽+1。',
  },

];

// 稀有度配色（复用武器的 WEP_RARITY 后定义）
const CS_RARITY = {
  mythic:   {label:'神器',color:'#aaddff',glow:'rgba(180,220,255,.45)',border:'rgba(160,210,255,.3)', bg:'rgba(160,210,255,.07)',order:0},
  legendary:{label:'传说',color:'#ffd060',glow:'rgba(255,208,96,.35)', border:'rgba(255,208,96,.25)',bg:'rgba(255,208,96,.06)', order:1},
  epic:     {label:'史诗',color:'#c080f0',glow:'rgba(192,128,240,.35)',border:'rgba(192,128,240,.25)',bg:'rgba(192,128,240,.06)',order:2},
  rare:     {label:'精良',color:'#60b8ff',glow:'rgba(96,184,255,.35)', border:'rgba(96,184,255,.25)',bg:'rgba(96,184,255,.06)', order:3},
  uncommon: {label:'精品',color:'#60e090',glow:'rgba(96,224,144,.3)',  border:'rgba(96,224,144,.2)', bg:'rgba(96,224,144,.05)', order:4},
  common:   {label:'普通',color:'#a0a0a0',glow:'rgba(160,160,160,.2)', border:'rgba(160,160,160,.15)',bg:'rgba(160,160,160,.03)',order:5},
};

// 获取角色当前服装（自定义角色读 edS.costumeId）
function getCharCostume(charId){
  if(charId && (charId==='cp_self'||charId.startsWith('cc'))){
    const cid = (typeof edS !== 'undefined' && edS.costumeId) || null;
    return cid ? COSTUMES.find(c=>c.id===cid)||null : null;
  }
  return null;
}

// ════════════════════════════════════════════════
//  ✦ 武器数据 WEAPONS — 天下神兵录 ✦
// ════════════════════════════════════════════════
// rarity: legendary/epic/rare/common
// atkBonus: 攻击加成（绝对值，叠加到角色atk）
// atkPct: 攻击加成百分比（乘在atk上）
// critBonus: 暴击概率加成
// special: 特殊效果描述
// specialKey: 特殊效果机制标识
// ══════════════════════════════════════════════════════════════════
//  完整武器库  六档稀有度 × 八大类别
//  mythic(神器) > legendary(传说) > epic(史诗) > rare(精良) > uncommon(精品) > common(凡品)
//  类别：剑 / 刀 / 枪矛 / 棍杖 / 拳套 / 暗器 / 法器 / 乐器
// ══════════════════════════════════════════════════════════════════
const WEAPONS = [

  // ╔══════════════════════════════╗
  // ║  🌟 神器  mythic             ║
  // ╚══════════════════════════════╝

  // ── 剑 ──
  {id:'wep_m_xuanyuan',name:'轩辕天剑',icon:'🌟',type:'长剑',cat:'剑',rarity:'mythic',
   atkBonus:90,critBonus:.28,defBonus:14,hpBonus:160,mpBonus:120,dodgeBonus:10,speedBonus:4,
   desc:'上古轩辕黄帝佩剑，斩妖除魔，开天辟地。剑鸣一声，万魔俯首，神明侧目，气贯长虹。',
   special:'【剑临天下】每次攻击附带雷电链，额外连锁伤害2个目标各60%，技能CD减少30%',specialKey:'xuanyuan_chain',
   color:'#ffffff',color2:'#aaddff',glow:'rgba(200,230,255,.7)',border:'rgba(200,240,255,.5)',bg1:'rgba(200,230,255,.1)',
   schools:['sword','thunder','holy']},

  // ── 刀 ──
  {id:'wep_m_chaos_saber',name:'混沌魔刀',icon:'🔴',type:'大刀',cat:'刀',rarity:'mythic',
   atkBonus:100,critBonus:.22,defBonus:0,hpBonus:260,mpBonus:0,dodgeBonus:0,speedBonus:2,
   desc:'鸿蒙之初混沌所生，刀气吞噬万物，触者形神俱灭，非魔道绝顶者不能驾驭。',
   special:'【混沌噬魂】每击有30%概率吸收对方20%当前气血为己用，本场攻击持续叠加+2%',specialKey:'chaos_drain',
   color:'#cc0044',color2:'#660022',glow:'rgba(200,0,60,.7)',border:'rgba(200,0,60,.5)',bg1:'rgba(200,0,60,.1)',
   schools:['dark','force','fist']},

  // ── 枪矛 ──
  {id:'wep_m_divine_spear',name:'开天神枪',icon:'⚡',type:'长矛',cat:'枪矛',rarity:'mythic',
   atkBonus:95,critBonus:.25,defBonus:8,hpBonus:200,mpBonus:70,dodgeBonus:6,speedBonus:-3,
   desc:'盘古开天辟地之枪，一枪刺出，天地变色，山河震颤，神魔皆惧，号称天下第一兵器。',
   special:'【天地一击】每5次攻击必定触发，造成500%伤害无视防御，眩晕2秒',specialKey:'divine_spear_proc',
   color:'#ffee00',color2:'#cc8800',glow:'rgba(255,230,0,.7)',border:'rgba(255,220,0,.5)',bg1:'rgba(255,220,0,.1)',
   schools:['thunder','holy','sword']},

  // ── 棍杖 ──
  {id:'wep_m_ruyi',name:'如意金箍棒',icon:'🪄',type:'法杖',cat:'棍杖',rarity:'mythic',
   atkBonus:92,critBonus:.20,defBonus:12,hpBonus:120,mpBonus:260,dodgeBonus:8,speedBonus:3,
   desc:'东海龙宫定海神针，大圣专属。可大可小，可轻可重，一棒横扫三界，无物不破。',
   special:'【七十二变】每次使用技能后随机额外叠加1种系别BUFF，持续10秒',specialKey:'ruyi_transform',
   color:'#ffaa00',color2:'#cc6600',glow:'rgba(255,170,0,.7)',border:'rgba(255,170,0,.5)',bg1:'rgba(255,170,0,.1)',
   schools:['force','thunder','fist']},

  // ── 暗器 ──
  {id:'wep_m_heaven_dart',name:'天外流星',icon:'💫',type:'暗器',cat:'暗器',rarity:'mythic',
   atkBonus:72,critBonus:.38,defBonus:0,hpBonus:0,mpBonus:90,dodgeBonus:25,speedBonus:8,
   desc:'陨铁所铸，夹带天地法则，投出后自动追踪，无论对方身法多高超皆无从躲避。',
   special:'【必中天罚】攻击100%命中且无法闪避，暴击时额外造成100%伤害并触发"天罚"眩晕3秒',specialKey:'heaven_must_hit',
   color:'#aaccff',color2:'#6688cc',glow:'rgba(160,200,255,.7)',border:'rgba(160,200,255,.5)',bg1:'rgba(160,200,255,.1)',
   schools:['shadow','qimen','thunder']},

  // ── 拳套 ──
  {id:'wep_m_dragon_fist',name:'龙爪天罡手',icon:'🐉',type:'拳套',cat:'拳套',rarity:'mythic',
   atkBonus:85,critBonus:.22,defBonus:16,hpBonus:240,mpBonus:0,dodgeBonus:6,speedBonus:5,
   desc:'上古龙族真气凝铸而成，拳出龙吟，气劲凌空，每击皆如龙爪横空，所向披靡。',
   special:'【龙吟破天】拳系技能伤害+80%，每击有25%概率附加龙威DEBUFF（对方攻防各-15%持续3回合）',specialKey:'dragon_fist_proc',
   color:'#ff6600',color2:'#cc3300',glow:'rgba(255,100,0,.7)',border:'rgba(255,100,0,.5)',bg1:'rgba(255,100,0,.1)',
   schools:['fist','force','thunder']},

  // ── 法器 ──
  {id:'wep_m_chaos_bead',name:'混元珠',icon:'🌀',type:'法器',cat:'法器',rarity:'mythic',
   atkBonus:78,critBonus:.18,defBonus:20,hpBonus:150,mpBonus:300,dodgeBonus:4,speedBonus:2,
   desc:'鸿蒙混元之气凝结而成，内含无量道法，可收天地万物，护体如山，攻则如渊。',
   special:'【混元无极】每回合自动回复5%气血+5%内力，使用道/佛系技能伤害+60%',specialKey:'chaos_bead_regen',
   color:'#8844ff',color2:'#4400cc',glow:'rgba(136,68,255,.7)',border:'rgba(136,68,255,.5)',bg1:'rgba(136,68,255,.1)',
   schools:['tao','buddha','holy']},

  // ── 乐器 ──
  {id:'wep_m_ling_xiao_qin',name:'凌霄九音琴',icon:'🎼',type:'乐器',cat:'乐器',rarity:'mythic',
   atkBonus:65,critBonus:.22,defBonus:14,hpBonus:90,mpBonus:240,dodgeBonus:10,speedBonus:8,
   desc:'凌霄阁绝传神器，九根弦各含天地一音，合奏时声震九霄，令听者魂魄俱震，生死随心。',
   special:'【九音轮回】琴系技能效果+100%，每次使用技能有40%概率使对方进入乱斗状态（随机行动3秒）',specialKey:'nine_sound_chaos',
   color:'#dd88ff',color2:'#aa44cc',glow:'rgba(220,136,255,.7)',border:'rgba(220,136,255,.5)',bg1:'rgba(220,136,255,.1)',
   schools:['music','shadow','holy']},

  // ╔══════════════════════════════╗
  // ║  ✦ 传说  legendary           ║
  // ╚══════════════════════════════╝
  // ★ legendary档：atkBonus +55~75，critBonus 0.12~0.20

  // ── 剑 ──
  {id:'wep_heaven_sword',unique:true,name:'倚天剑',icon:'⚔',type:'长剑',cat:'剑',rarity:'legendary',
   atkBonus:62,critBonus:.18,defBonus:10,hpBonus:100,mpBonus:60,dodgeBonus:8,speedBonus:3,
   desc:'武林至尊，宝刀屠龙。号令天下，莫敢不从。剑气纵横三万里，一剑光寒十九洲。',
   special:'【剑气一闪】每击有25%概率额外造成50%伤害，暴击时剑气贯穿',specialKey:'sword_flash',
   color:'#ffd060',color2:'#ff9000',glow:'rgba(255,208,96,.4)',border:'rgba(255,208,96,.25)',bg1:'rgba(255,208,96,.07)',
   schools:['sword']},
  {id:'wep_taiji_sword',unique:true,name:'太极剑',icon:'☯',type:'软剑',cat:'剑',rarity:'legendary',
   atkBonus:50,critBonus:.15,defBonus:12,hpBonus:70,mpBonus:160,dodgeBonus:18,speedBonus:4,
   desc:'武当镇派之宝，剑走偏锋，以柔克刚。剑意似流水，触之则化，攻之无懈。',
   special:'【太极化劲】受到攻击时有30%概率自动格挡，减少40%伤害并反弹15%',specialKey:'auto_parry',
   color:'#60d0d8',color2:'#20a0a8',glow:'rgba(96,208,216,.3)',border:'rgba(96,208,216,.18)',bg1:'rgba(96,208,216,.05)',
   schools:['tao','sword']},
  {id:'wep_cold_light',unique:true,name:'寒光剑',icon:'❄',type:'长剑',cat:'剑',rarity:'legendary',
   atkBonus:55,critBonus:.17,defBonus:7,hpBonus:70,mpBonus:90,dodgeBonus:12,speedBonus:4,
   desc:'以千年寒铁锻造，剑身散发幽寒之气，触之如坠冰窟，令对手武功尽废。',
   special:'【寒气入骨】攻击使对方攻击力-10%（叠加最多-30%），暴击概率+12%',specialKey:'chill_atk',
   color:'#90c8ff',color2:'#4080d0',glow:'rgba(144,200,255,.3)',border:'rgba(144,200,255,.18)',bg1:'rgba(144,200,255,.05)',
   schools:['ice','sword']},

  // ── 刀 ──
  {id:'wep_dragon_saber',unique:true,name:'屠龙刀',icon:'🗡',type:'大刀',cat:'刀',rarity:'legendary',
   atkBonus:72,critBonus:.14,defBonus:5,hpBonus:180,mpBonus:0,dodgeBonus:0,speedBonus:2,
   desc:'与倚天剑并称天下第一，刀气磅礴，无坚不摧，斩龙之刃，力压万古。',
   special:'【斩龙之刃】重击时必定暴击，暴击伤害额外+50%',specialKey:'heavy_crit_bonus',
   color:'#ff8020',color2:'#cc4000',glow:'rgba(255,128,32,.4)',border:'rgba(255,128,32,.25)',bg1:'rgba(255,128,32,.07)',
   schools:['force','fist']},
  {id:'wep_ghost_blade',unique:true,name:'幽冥鬼头刀',icon:'💀',type:'大刀',cat:'刀',rarity:'legendary',
   atkBonus:65,critBonus:.12,defBonus:0,hpBonus:130,mpBonus:40,dodgeBonus:6,speedBonus:3,
   desc:'阴间鬼铁所铸，刀身吸魂，对方每受一击精神力-5%，积累至0时陷入惊恐。',
   special:'【夺魂一斩】每次攻击积累「魂印」，累计5层触发「鬼判」造成300%真实伤害',specialKey:'soul_stack',
   color:'#aa2244',color2:'#660020',glow:'rgba(170,34,68,.4)',border:'rgba(170,34,68,.25)',bg1:'rgba(170,34,68,.07)',
   schools:['dark','fist']},

  // ── 枪矛 ──
  {id:'wep_sun_spear',unique:true,name:'日月神矛',icon:'☀',type:'长矛',cat:'枪矛',rarity:'legendary',
   atkBonus:58,critBonus:.1,defBonus:5,hpBonus:120,mpBonus:60,dodgeBonus:3,speedBonus:-3,
   desc:'日月神教镇教之矛，矛身融合日火与月寒两种极端之力，阴阳调和，威力无穷。',
   special:'【日月交辉】每3次攻击必定触发，造成220%伤害必定暴击',specialKey:'sun_moon_proc',
   color:'#ff8800',color2:'#0088cc',glow:'rgba(255,136,0,.3)',border:'rgba(255,136,0,.18)',bg1:'rgba(255,136,0,.05)',
   schools:['fire','ice']},
  {id:'wep_dragon_lance',unique:true,name:'龙胆亮银枪',icon:'🔱',type:'长枪',cat:'枪矛',rarity:'legendary',
   atkBonus:55,critBonus:.12,defBonus:7,hpBonus:90,mpBonus:50,dodgeBonus:10,speedBonus:-3,
   desc:'赵云名枪，浑银打就，枪出如龙，百万军中七进七出，无人能挡。',
   special:'【百鸟朝凤】枪系连击技能额外追加1~2次攻击，每次追加80%伤害',specialKey:'lance_multi',
   color:'#ccddff',color2:'#8899cc',glow:'rgba(200,210,255,.35)',border:'rgba(200,210,255,.22)',bg1:'rgba(200,210,255,.06)',
   schools:['sword','wind']},

  // ── 棍杖 ──
  {id:'wep_nine_ring',unique:true,name:'九环禅杖',icon:'🪝',type:'禅杖',cat:'棍杖',rarity:'legendary',
   atkBonus:52,critBonus:.06,defBonus:10,hpBonus:150,mpBonus:100,dodgeBonus:2,speedBonus:-3,
   desc:'少林寺传世法器，九个铁环震颤作响，每击轰然如雷，破开一切邪魔外道。',
   special:'【金刚降魔】使用佛系技能回复额外5%气血，格挡时反震震晕1秒',specialKey:'buddha_heal',
   color:'#d4a050',color2:'#a06010',glow:'rgba(212,160,80,.3)',border:'rgba(212,160,80,.18)',bg1:'rgba(212,160,80,.05)',
   schools:['buddha','force']},
  {id:'wep_fire_staff',unique:true,name:'赤炎神杖',icon:'🔥',type:'法杖',cat:'棍杖',rarity:'legendary',
   atkBonus:56,critBonus:.1,defBonus:5,hpBonus:60,mpBonus:140,dodgeBonus:3,speedBonus:-3,
   desc:'火焰山炽焰真火凝铸，杖身常燃永不息，挥出时烈焰席卷，焦土千里。',
   special:'【烈焰灼天】火系技能伤害+45%，每次攻击附加燃烧（每秒3%气血持续5秒）',specialKey:'fire_burn_amp',
   color:'#ff5500',color2:'#cc2200',glow:'rgba(255,85,0,.4)',border:'rgba(255,85,0,.25)',bg1:'rgba(255,85,0,.07)',
   schools:['fire','thunder']},

  // ── 暗器 ──
  {id:'wep_phoenix_feather',unique:true,name:'凤翎神针',icon:'🪶',type:'暗器',cat:'暗器',rarity:'legendary',
   atkBonus:45,critBonus:.28,defBonus:2,hpBonus:0,mpBonus:60,dodgeBonus:22,speedBonus:7,
   desc:'轻如鸿毛，快如闪电。凤凰一族遗羽，沾之必中，神速无双，天下第一暗器。',
   special:'【凤羽连珠】攻击必定命中，有35%概率连续再攻击一次',specialKey:'double_strike',
   color:'#ff80c0',color2:'#cc4090',glow:'rgba(255,128,192,.35)',border:'rgba(255,128,192,.22)',bg1:'rgba(255,128,192,.06)',
   schools:['shadow','qimen']},

  // ── 拳套 ──
  {id:'wep_xuanming_palm',unique:true,name:'玄冥寒铁鞭',icon:'⛓',type:'软鞭',cat:'拳套',rarity:'legendary',
   atkBonus:54,critBonus:.08,defBonus:4,hpBonus:90,mpBonus:60,dodgeBonus:8,speedBonus:4,
   desc:'以玄冥寒铁锻造，触之寒毒入骨，令中招者经脉冰封，九死一生。',
   special:'【冰封寒毒】每次攻击有40%概率附加冰毒（每回合-4%气血持续5秒）',specialKey:'ice_poison',
   color:'#70a8e0',color2:'#3060a0',glow:'rgba(112,168,224,.35)',border:'rgba(112,168,224,.22)',bg1:'rgba(112,168,224,.06)',
   schools:['ice','poison']},

  // ── 法器 ──
  {id:'wep_divine_qin',unique:true,name:'焦尾琴',icon:'🎵',type:'乐器',cat:'乐器',rarity:'legendary',
   atkBonus:48,critBonus:.16,defBonus:6,hpBonus:40,mpBonus:120,dodgeBonus:8,speedBonus:7,
   desc:'蔡邕以焦尾木所制，音色绝世无双。琴声一响，百鬼辟易，令听者魂飞魄散，武功全失。',
   special:'【天籁弦音】琴系技能伤害+40%，有50%概率眩晕0.5秒',specialKey:'music_amp',
   color:'#c060d0',color2:'#8020a0',glow:'rgba(192,96,208,.35)',border:'rgba(192,96,208,.22)',bg1:'rgba(192,96,208,.06)',
   schools:['music']},
  {id:'wep_thunder_drum',unique:true,name:'雷霆战鼓',icon:'🥁',type:'法器',cat:'法器',rarity:'legendary',
   atkBonus:52,critBonus:.1,defBonus:5,hpBonus:120,mpBonus:90,dodgeBonus:2,speedBonus:7,
   desc:'擂鼓声如雷霆，令敌军胆战心惊，战意崩溃。持此鼓者，气势倍增，战力大涨。',
   special:'【雷鸣天震】每次普攻20%触发，对敌造成15%最大气血的雷系伤害',specialKey:'thunder_proc',
   color:'#ffe040',color2:'#d09000',glow:'rgba(255,224,64,.3)',border:'rgba(255,224,64,.18)',bg1:'rgba(255,224,64,.05)',
   schools:['thunder']},

  // ╔══════════════════════════════╗
  // ║  ◆ 史诗  epic                ║
  // ╚══════════════════════════════╝

  // ── 剑 ──
  {id:'wep_xuanming_sword',name:'玄冥剑',icon:'🗡',type:'长剑',cat:'剑',rarity:'epic',
   atkBonus:38,critBonus:.1,defBonus:4,hpBonus:50,mpBonus:70,dodgeBonus:10,speedBonus:4,
   desc:'以玄铁铸就，暗含道家玄妙，剑出如水，无形无迹，令对手摸不着路数。',
   special:'【玄妙无形】15%概率完全回避对方攻击，并立即反击一次',specialKey:'xuanming_evade',
   color:'#6688aa',color2:'#334466',glow:'rgba(100,136,170,.3)',border:'rgba(100,136,170,.18)',bg1:'rgba(100,136,170,.05)',
   schools:['tao','sword']},
  {id:'wep_wind_blade',name:'风羽剑',icon:'🌿',type:'轻剑',cat:'剑',rarity:'epic',
   atkBonus:35,critBonus:.18,defBonus:2,hpBonus:0,mpBonus:50,dodgeBonus:18,speedBonus:8,
   desc:'轻如鸿毛，快如风中之羽，攻击速度极快，连击能力天下无双。',
   special:'【风羽连击】每次攻击额外追加一次35%伤害的风刃',specialKey:'wind_trace',
   color:'#80e0a0',color2:'#30c060',glow:'rgba(128,224,160,.25)',border:'rgba(128,224,160,.15)',bg1:'rgba(128,224,160,.04)',
   schools:['wind','sword']},
  {id:'wep_holy_cross',name:'圣光十字剑',icon:'✝',type:'圣器',cat:'剑',rarity:'epic',
   atkBonus:38,critBonus:.08,defBonus:8,hpBonus:90,mpBonus:80,dodgeBonus:4,speedBonus:2,
   desc:'圣光教圣骑士配剑，注入圣光信仰，斩邪辟魔，愈伤疗毒。',
   special:'【圣光庇护】每次使用圣系技能额外回复3%气血，对暗系敌人伤害+30%',specialKey:'holy_regen',
   color:'#ffffa0',color2:'#e0d060',glow:'rgba(255,255,128,.25)',border:'rgba(255,255,128,.15)',bg1:'rgba(255,255,128,.04)',
   schools:['holy','sword']},

  // ── 刀 ──
  {id:'wep_poison_fan',name:'五毒扇',icon:'🪭',type:'扇形暗器',cat:'刀',rarity:'epic',
   atkBonus:35,critBonus:.16,defBonus:2,hpBonus:0,mpBonus:60,dodgeBonus:15,speedBonus:6,
   desc:'五毒教镇教之宝，扇面嵌有蛇毒虫胆，轻轻挥动即可散布致命毒雾，无声无息。',
   special:'【五毒雾】普攻有50%概率中毒（每回合3%气血持续4秒）',specialKey:'poison_auto',
   color:'#88ee44',color2:'#44aa00',glow:'rgba(136,238,68,.3)',border:'rgba(136,238,68,.18)',bg1:'rgba(136,238,68,.05)',
   schools:['poison','shadow']},
  {id:'wep_blood_saber',name:'血煞弯刀',icon:'🔴',type:'弯刀',cat:'刀',rarity:'epic',
   atkBonus:45,critBonus:.1,defBonus:1,hpBonus:120,mpBonus:0,dodgeBonus:2,speedBonus:2,
   desc:'西域血石铸就，刀身常有血气缭绕，越杀越强，越见血光越是杀意旺盛。',
   special:'【嗜血】每次造成伤害后攻击力+2%，本场最多叠加25层（+50%）',specialKey:'blood_stack',
   color:'#cc3322',color2:'#881111',glow:'rgba(204,51,34,.3)',border:'rgba(204,51,34,.18)',bg1:'rgba(204,51,34,.05)',
   schools:['force','dark']},

  // ── 枪矛 ──
  {id:'wep_meteor_hammer',name:'流星锤',icon:'💣',type:'锤',cat:'枪矛',rarity:'epic',
   atkBonus:50,critBonus:.06,defBonus:3,hpBonus:80,mpBonus:0,dodgeBonus:0,speedBonus:0,
   desc:'双锤互击，势如流星坠地，一击之下山崩地裂。力大无穷者方能驾驭此等重兵。',
   special:'【流星坠地】重击伤害额外+30%，有20%概率眩晕1秒',specialKey:'stun_heavy',
   color:'#d06020',color2:'#a03000',glow:'rgba(208,96,32,.3)',border:'rgba(208,96,32,.18)',bg1:'rgba(208,96,32,.05)',
   schools:['force','fist']},
  {id:'wep_ice_lance',name:'玄冰寒刺',icon:'🧊',type:'冰枪',cat:'枪矛',rarity:'epic',
   atkBonus:42,critBonus:.12,defBonus:5,hpBonus:60,mpBonus:80,dodgeBonus:0,speedBonus:-2,
   desc:'以万年玄冰打磨而成，枪尖刺出冰雾弥漫，中招者行动迟缓，最终结冰无法动弹。',
   special:'【冰封】每次攻击有35%概率使目标减速（行动间隔+50%持续2秒），暴击时必定冻结1秒',specialKey:'ice_slow',
   color:'#99ddff',color2:'#3399cc',glow:'rgba(153,221,255,.3)',border:'rgba(153,221,255,.18)',bg1:'rgba(153,221,255,.05)',
   schools:['ice']},

  // ── 棍杖 ──
  {id:'wep_iron_staff',name:'铁禅棍',icon:'🥢',type:'棍',cat:'棍杖',rarity:'epic',
   atkBonus:40,critBonus:.06,defBonus:7,hpBonus:80,mpBonus:60,dodgeBonus:0,speedBonus:-2,
   desc:'少林七十二艺配套棍法，以棍代剑，以刚克刚，棍法横扫如意。',
   special:'【金刚护体】力系技能伤害+15%，受击时有10%概率完全抵消伤害',specialKey:'force_amp',
   color:'#c08040',color2:'#805010',glow:'rgba(192,128,64,.25)',border:'rgba(192,128,64,.15)',bg1:'rgba(192,128,64,.04)',
   schools:['force','buddha']},
  {id:'wep_thunder_staff',name:'落雷神棍',icon:'⚡',type:'雷杖',cat:'棍杖',rarity:'epic',
   atkBonus:44,critBonus:.1,defBonus:4,hpBonus:50,mpBonus:90,dodgeBonus:0,speedBonus:-2,
   desc:'雷峰塔顶被雷电千次劈中的古木所制，常年雷电不断，挥出时雷光迸发，威慑九方。',
   special:'【雷电连锁】攻击有25%概率触发雷电，对目标周边额外溅射2次各40%伤害',specialKey:'thunder_chain',
   color:'#ffdd00',color2:'#cc8800',glow:'rgba(255,220,0,.3)',border:'rgba(255,220,0,.18)',bg1:'rgba(255,220,0,.05)',
   schools:['thunder','force']},

  // ── 暗器 ──
  {id:'wep_flying_dart',name:'唐门飞刀',icon:'🎯',type:'暗器',cat:'暗器',rarity:'epic',
   atkBonus:35,critBonus:.20,defBonus:1,hpBonus:0,mpBonus:40,dodgeBonus:10,speedBonus:6,
   desc:'唐门三寸小飞刀，百步之外取人首级，极速无声，有去无回。',
   special:'【三刀连发】攻击必定命中，有25%概率连射第二刀（50%额外伤害），5%三连发',specialKey:'double_dart',
   color:'#9070d0',color2:'#6040a0',glow:'rgba(144,112,208,.25)',border:'rgba(144,112,208,.15)',bg1:'rgba(144,112,208,.04)',
   schools:['shadow','qimen']},
  {id:'wep_poison_arrow',name:'碧毒神箭',icon:'🏹',type:'弓箭',cat:'暗器',rarity:'epic',
   atkBonus:38,critBonus:.17,defBonus:0,hpBonus:0,mpBonus:60,dodgeBonus:8,speedBonus:0,
   desc:'以千年碧蛇毒液浸泡三年的箭矢，射出时绿光闪烁，中者毒发难以抑制。',
   special:'【穿心箭毒】每箭必定附加剧毒（每秒5%气血持续8秒），暴击时双重中毒',specialKey:'poison_arrow_proc',
   color:'#44cc44',color2:'#228800',glow:'rgba(68,204,68,.3)',border:'rgba(68,204,68,.18)',bg1:'rgba(68,204,68,.05)',
   schools:['poison','shadow']},

  // ── 拳套 ──
  {id:'wep_iron_glove',name:'霸王铁拳',icon:'🥊',type:'铁拳',cat:'拳套',rarity:'epic',
   atkBonus:48,critBonus:.07,defBonus:8,hpBonus:80,mpBonus:0,dodgeBonus:0,speedBonus:3,
   desc:'以精铁铸造的重拳套，一拳打出声如炸雷，令骨肉俱碎，无任何防具可以抵挡。',
   special:'【破甲重击】忽视对方20%防御，有15%概率造成眩晕',specialKey:'armor_break',
   color:'#888888',color2:'#555555',glow:'rgba(136,136,136,.3)',border:'rgba(136,136,136,.18)',bg1:'rgba(136,136,136,.05)',
   schools:['fist','force']},
  {id:'wep_fire_glove',name:'烈焰焚天拳',icon:'🔥',type:'拳套',cat:'拳套',rarity:'epic',
   atkBonus:44,critBonus:.1,defBonus:4,hpBonus:50,mpBonus:70,dodgeBonus:0,speedBonus:3,
   desc:'注入火焰真气的拳套，每一拳皆带火焰冲击波，点火燃烧，所向披靡。',
   special:'【烈焰冲拳】拳系技能附加燃烧效果，每次命中额外+25%火焰伤害',specialKey:'fire_fist_proc',
   color:'#ff6600',color2:'#cc3300',glow:'rgba(255,102,0,.3)',border:'rgba(255,102,0,.18)',bg1:'rgba(255,102,0,.05)',
   schools:['fire','fist']},

  // ── 法器 ──
  {id:'wep_tao_mirror',name:'乾坤照妖镜',icon:'🪞',type:'法器',cat:'法器',rarity:'epic',
   atkBonus:36,critBonus:.1,defBonus:12,hpBonus:80,mpBonus:90,dodgeBonus:0,speedBonus:0,
   desc:'道家至宝，可照出一切妖魔鬼怪真身。对邪道之人伤害倍增，且能破解一切幻术。',
   special:'【照妖破幻】对暗/毒系敌人伤害+40%，免疫对方的迷惑/眩晕效果',specialKey:'mirror_reveal',
   color:'#aaddcc',color2:'#669988',glow:'rgba(170,221,204,.3)',border:'rgba(170,221,204,.18)',bg1:'rgba(170,221,204,.05)',
   schools:['tao','holy']},
  {id:'wep_soul_bell',name:'幽冥魂铃',icon:'🔔',type:'法器',cat:'法器',rarity:'epic',
   atkBonus:36,critBonus:.13,defBonus:6,hpBonus:50,mpBonus:80,dodgeBonus:0,speedBonus:0,
   desc:'地府索魂之物，铃声一响魂魄震颤，令生灵恐惧，精神防御全面崩溃。',
   special:'【索魂铃声】每次攻击有20%概率使敌方进入恐惧（攻防各-20%持续3秒）',specialKey:'soul_fear',
   color:'#8866cc',color2:'#552299',glow:'rgba(136,102,204,.3)',border:'rgba(136,102,204,.18)',bg1:'rgba(136,102,204,.05)',
   schools:['dark','qimen']},

  // ╔══════════════════════════════╗
  // ║  ◇ 精良  rare                ║
  // ╚══════════════════════════════╝

  // ── 剑 ──
  {id:'wep_silver_sword',name:'银光剑',icon:'⚔',type:'长剑',cat:'剑',rarity:'rare',
   atkBonus:28,critBonus:.08,defBonus:3,hpBonus:40,mpBonus:40,dodgeBonus:6,speedBonus:2,
   desc:'名门正派弟子佩剑，以精银锻造，剑气凛然，攻守兼备，是中级剑客的标配。',
   special:'【剑气护体】剑系技能伤害+12%，格挡时回复少量气血',specialKey:'sword_shield',
   color:'#ccddee',color2:'#8899aa',glow:'rgba(200,220,238,.25)',border:'rgba(200,220,238,.15)',bg1:'rgba(200,220,238,.04)',
   schools:['sword']},
  {id:'wep_peach_stick',name:'打狗棒',icon:'🪵',type:'棍',cat:'剑',rarity:'rare',
   atkBonus:30,critBonus:.08,defBonus:2,hpBonus:30,mpBonus:30,dodgeBonus:10,speedBonus:4,
   desc:'丐帮帮主信物，以此棍法可打天下狗，实则剑法精妙，变化万千。',
   special:'【打狗棒法】风系技能额外移动加速，闪避概率+15%',specialKey:'dodge_wind',
   color:'#a0c060',color2:'#60900a',glow:'rgba(160,192,96,.25)',border:'rgba(160,192,96,.15)',bg1:'rgba(160,192,96,.04)',
   schools:['wind']},

  // ── 刀 ──
  {id:'wep_wolf_fang',name:'狼牙棒',icon:'🏏',type:'钝器',cat:'刀',rarity:'rare',
   atkBonus:34,critBonus:.04,defBonus:3,hpBonus:50,mpBonus:0,dodgeBonus:0,speedBonus:5,
   desc:'铁钉遍布，一击之下血肉横飞，防御极高者也难以抵挡此等凶器。',
   special:'【流血】有15%概率造成流血（每回合2%气血持续5回合）',specialKey:'bleed',
   color:'#b06030',color2:'#804020',glow:'rgba(176,96,48,.25)',border:'rgba(176,96,48,.15)',bg1:'rgba(176,96,48,.04)',
   schools:['force']},
  {id:'wep_dark_knife',name:'夺命血刃',icon:'🔪',type:'短刀',cat:'刀',rarity:'rare',
   atkBonus:28,critBonus:.14,defBonus:1,hpBonus:0,mpBonus:20,dodgeBonus:8,speedBonus:3,
   desc:'暗门杀手专用，双刃开锋，伤口难以愈合，专克要害，一刀见血。',
   special:'【必中要害】暴击率+12%，暴击时造成流血（每回合4%气血持续4回合）',specialKey:'vital_strike',
   color:'#cc4444',color2:'#882222',glow:'rgba(204,68,68,.25)',border:'rgba(204,68,68,.15)',bg1:'rgba(204,68,68,.04)',
   schools:['shadow','dark']},

  // ── 枪矛 ──
  {id:'wep_long_spear',name:'丈八蛇矛',icon:'🔱',type:'长矛',cat:'枪矛',rarity:'rare',
   atkBonus:33,critBonus:.06,defBonus:5,hpBonus:40,mpBonus:0,dodgeBonus:0,speedBonus:-2,
   desc:'张飞惯用的长矛，矛尖如毒蛇，挥舞时虎虎生风，一夫当关万夫莫开。',
   special:'【横扫千军】攻击所有敌人，伤害各80%，有10%概率击退',specialKey:'sweep_all',
   color:'#ccaa66',color2:'#996633',glow:'rgba(204,170,102,.25)',border:'rgba(204,170,102,.15)',bg1:'rgba(204,170,102,.04)',
   schools:['force','sword']},

  // ── 棍杖 ──
  {id:'wep_staff_wind',name:'降魔杖',icon:'🥢',type:'棍',cat:'棍杖',rarity:'rare',
   atkBonus:28,critBonus:.05,defBonus:5,hpBonus:40,mpBonus:50,dodgeBonus:0,speedBonus:-2,
   desc:'道家降魔法杖，以山中古木所制，灌注正气，专克妖邪，每击带有驱邪之效。',
   special:'【驱邪降魔】道系技能伤害+12%，对暗系/毒系敌人额外+20%伤害',specialKey:'tao_exorcist',
   color:'#aa8855',color2:'#775533',glow:'rgba(170,136,85,.25)',border:'rgba(170,136,85,.15)',bg1:'rgba(170,136,85,.04)',
   schools:['tao','buddha']},

  // ── 暗器 ──
  {id:'wep_silver_needle',name:'银针',icon:'🪡',type:'暗器',cat:'暗器',rarity:'rare',
   atkBonus:22,critBonus:.20,defBonus:1,hpBonus:0,mpBonus:20,dodgeBonus:12,speedBonus:5,
   desc:'细如发丝，毒如蛇蝎。黄蓉最爱的暗器，精准无比，令对手防不胜防。',
   special:'【毒针精准】暴击率+18%，暴击时必定中毒',specialKey:'poison_crit',
   color:'#e8e8e8',color2:'#a0a0a0',glow:'rgba(220,220,220,.25)',border:'rgba(220,220,220,.15)',bg1:'rgba(220,220,220,.04)',
   schools:['shadow','poison']},
  {id:'wep_iron_dart',name:'铁蒺藜',icon:'⭐',type:'暗器',cat:'暗器',rarity:'rare',
   atkBonus:25,critBonus:.16,defBonus:0,hpBonus:0,mpBonus:0,dodgeBonus:10,speedBonus:5,
   desc:'四角铁器，无论如何落地皆有一角朝上，撒出一片令对方寸步难行，且各含倒刺。',
   special:'【漫天蒺藜】每次攻击附带减速效果（移动速度-30%，持续3秒）',specialKey:'slow_dart',
   color:'#99aacc',color2:'#667799',glow:'rgba(153,170,204,.25)',border:'rgba(153,170,204,.15)',bg1:'rgba(153,170,204,.04)',
   schools:['shadow','qimen']},

  // ── 拳套 ──
  {id:'wep_iron_fist_rare',name:'铁砂掌',icon:'🥋',type:'拳套',cat:'拳套',rarity:'rare',
   atkBonus:30,critBonus:.07,defBonus:6,hpBonus:40,mpBonus:30,dodgeBonus:0,speedBonus:3,
   desc:'长期以铁砂锤练，掌力雄浑刚猛，一掌拍出声若雷鸣，内功修为越深威力越大。',
   special:'【铁砂重击】拳系技能每次攻击有10%概率造成骨折（对方攻击力-20%持续5秒）',specialKey:'iron_sand_break',
   color:'#ccaa88',color2:'#886644',glow:'rgba(204,170,136,.25)',border:'rgba(204,170,136,.15)',bg1:'rgba(204,170,136,.04)',
   schools:['fist','force']},

  // ── 法器 ──
  {id:'wep_tao_charm',name:'道家符箓',icon:'📜',type:'法器',cat:'法器',rarity:'rare',
   atkBonus:24,critBonus:.08,defBonus:8,hpBonus:50,mpBonus:70,dodgeBonus:0,speedBonus:0,
   desc:'以天师道法绘制的符纸，一张点燃即可化为法力，护身、攻敌两相宜。',
   special:'【符咒爆裂】道系技能使用后必定附加一个随机BUFF（攻击/防御/速度+15%，持续8秒）',specialKey:'tao_random_buff',
   color:'#ffdd88',color2:'#cc9933',glow:'rgba(255,221,136,.25)',border:'rgba(255,221,136,.15)',bg1:'rgba(255,221,136,.04)',
   schools:['tao','holy']},

  // ── 乐器 ──
  {id:'wep_jade_flute',name:'碧玉箫',icon:'🎶',type:'乐器',cat:'乐器',rarity:'rare',
   atkBonus:22,critBonus:.08,defBonus:4,hpBonus:30,mpBonus:60,dodgeBonus:6,speedBonus:2,
   desc:'以西域碧玉雕成，音色清越如天外来音，一曲奏罢令人心旷神怡或肝胆俱裂。',
   special:'【碧玉妙音】琴系技能效果+25%，有15%概率使敌方陷入迷醉（攻击力-15%）',specialKey:'jade_flute_charm',
   color:'#88ccaa',color2:'#449966',glow:'rgba(136,204,170,.25)',border:'rgba(136,204,170,.15)',bg1:'rgba(136,204,170,.04)',
   schools:['music']},

  // ╔══════════════════════════════╗
  // ║  ★ 精品  uncommon            ║
  // ╚══════════════════════════════╝

  // ── 剑 ──
  {id:'wep_uc_iron_sword',name:'精铁长剑',icon:'⚔',type:'长剑',cat:'剑',rarity:'uncommon',
   atkBonus:20,critBonus:.05,defBonus:2,hpBonus:20,mpBonus:20,dodgeBonus:4,speedBonus:1,
   desc:'用精铁打造，工艺考究，比普通铁剑锋利数倍，是有志青年的入门配剑。',
   special:'剑系技能伤害+8%',specialKey:'sword_amp_s',
   color:'#99aacc',color2:'#667799',glow:'rgba(153,170,204,.2)',border:'rgba(153,170,204,.12)',bg1:'rgba(153,170,204,.03)',
   schools:['sword']},

  // ── 刀 ──
  {id:'wep_uc_dao',name:'雁翎刀',icon:'🗡',type:'单刀',cat:'刀',rarity:'uncommon',
   atkBonus:22,critBonus:.04,defBonus:1,hpBonus:15,mpBonus:0,dodgeBonus:3,speedBonus:1,
   desc:'刀型如雁翎，轻巧灵活，攻击快速，是军中常见制式武器，经由老师傅精心打磨。',
   special:'刀系攻击有8%概率连击一次（50%伤害）',specialKey:'dao_combo_s',
   color:'#aabb99',color2:'#778866',glow:'rgba(170,187,153,.2)',border:'rgba(170,187,153,.12)',bg1:'rgba(170,187,153,.03)',
   schools:['force']},

  // ── 枪矛 ──
  {id:'wep_uc_spear',name:'红缨枪',icon:'🔱',type:'长枪',cat:'枪矛',rarity:'uncommon',
   atkBonus:21,critBonus:.04,defBonus:3,hpBonus:15,mpBonus:0,dodgeBonus:0,speedBonus:-1,
   desc:'缨红枪亮，武将标配，枪法入门之选，攻击范围宽，练好枪法路不远。',
   special:'枪刺伤害+10%',specialKey:'spear_amp_s',
   color:'#cc6644',color2:'#994422',glow:'rgba(204,102,68,.2)',border:'rgba(204,102,68,.12)',bg1:'rgba(204,102,68,.03)',
   schools:['force','sword']},

  // ── 棍杖 ──
  {id:'wep_uc_bamboo_staff',name:'竹节棍',icon:'🥢',type:'棍',cat:'棍杖',rarity:'uncommon',
   atkBonus:19,critBonus:.03,defBonus:3,hpBonus:20,mpBonus:30,dodgeBonus:0,speedBonus:-1,
   desc:'以老竹制成，韧性十足，轻便好用，棍法入门首选，打出去有一股清风之气。',
   special:'每回合有5%概率回复少量内力',specialKey:'bamboo_regen',
   color:'#99bb77',color2:'#668844',glow:'rgba(153,187,119,.2)',border:'rgba(153,187,119,.12)',bg1:'rgba(153,187,119,.03)',
   schools:['wind','force']},

  // ── 暗器 ──
  {id:'wep_uc_dart',name:'铜飞镖',icon:'🎯',type:'暗器',cat:'暗器',rarity:'uncommon',
   atkBonus:18,critBonus:.12,defBonus:0,hpBonus:0,mpBonus:10,dodgeBonus:8,speedBonus:4,
   desc:'铜制飞镖三枚一组，重心经过精确计算，投掷稳准狠，是暗器入门必备。',
   special:'暴击率+10%',specialKey:'dart_crit_s',
   color:'#bbaa77',color2:'#887744',glow:'rgba(187,170,119,.2)',border:'rgba(187,170,119,.12)',bg1:'rgba(187,170,119,.03)',
   schools:['shadow']},

  // ── 拳套 ──
  {id:'wep_uc_glove',name:'皮护手',icon:'🥊',type:'拳套',cat:'拳套',rarity:'uncommon',
   atkBonus:20,critBonus:.03,defBonus:4,hpBonus:20,mpBonus:0,dodgeBonus:0,speedBonus:2,
   desc:'以厚牛皮制成的护拳，保护关节同时增加拳力，是拳法入门必备装备。',
   special:'拳系技能伤害+8%',specialKey:'fist_amp_s',
   color:'#bb9966',color2:'#886633',glow:'rgba(187,153,102,.2)',border:'rgba(187,153,102,.12)',bg1:'rgba(187,153,102,.03)',
   schools:['fist']},

  // ── 法器 ──
  {id:'wep_uc_scroll',name:'道经一卷',icon:'📜',type:'法器',cat:'法器',rarity:'uncommon',
   atkBonus:18,critBonus:.05,defBonus:4,hpBonus:10,mpBonus:40,dodgeBonus:0,speedBonus:0,
   desc:'抄录道家经典的竹简，内含简单的道法符文，持之可以修身养性，略通法术。',
   special:'道/佛系技能内力消耗-10%',specialKey:'tao_cost_reduce',
   color:'#ddcc99',color2:'#aa9966',glow:'rgba(221,204,153,.2)',border:'rgba(221,204,153,.12)',bg1:'rgba(221,204,153,.03)',
   schools:['tao','buddha']},

  // ── 乐器 ──
  {id:'wep_uc_erhu',name:'二胡',icon:'🎵',type:'乐器',cat:'乐器',rarity:'uncommon',
   atkBonus:18,critBonus:.04,defBonus:2,hpBonus:10,mpBonus:35,dodgeBonus:4,speedBonus:1,
   desc:'江湖说书人常用，两根弦拉出世间百态，音色悠扬，使用时令人心情稳定。',
   special:'琴系技能效果+15%，每回合恢复少量内力',specialKey:'erhu_regen',
   color:'#cc9966',color2:'#996633',glow:'rgba(204,153,102,.2)',border:'rgba(204,153,102,.12)',bg1:'rgba(204,153,102,.03)',
   schools:['music']},

  // ╔══════════════════════════════╗
  // ║  · 凡品  common              ║
  // ╚══════════════════════════════╝

  {id:'wep_iron_sword',name:'铁剑',icon:'⚔',type:'长剑',cat:'剑',rarity:'common',
   atkBonus:12,critBonus:.02,defBonus:0,hpBonus:0,mpBonus:0,dodgeBonus:2,speedBonus:0,
   desc:'普通铁剑，坚固耐用，江湖入门兵器，价廉物美。',special:'无特殊效果，胜在可靠',specialKey:'',
   color:'#8899bb',color2:'#556688',glow:'rgba(136,153,187,.18)',border:'rgba(136,153,187,.1)',bg1:'rgba(136,153,187,.02)',schools:['sword']},
  {id:'wep_wooden_stick',name:'木棍',icon:'🪵',type:'棍',cat:'棍杖',rarity:'common',
   atkBonus:8,critBonus:.01,defBonus:0,hpBonus:0,mpBonus:0,dodgeBonus:0,speedBonus:0,
   desc:'山间随手折来的木棍，简陋但不失为趁手的武器，打架够用。',special:'无特殊效果',specialKey:'',
   color:'#a08060',color2:'#7a6040',glow:'rgba(160,128,96,.18)',border:'rgba(160,128,96,.1)',bg1:'rgba(160,128,96,.02)',schools:[]},
  {id:'wep_short_knife',name:'匕首',icon:'🔪',type:'短刀',cat:'刀',rarity:'common',
   atkBonus:10,critBonus:.05,defBonus:0,hpBonus:0,mpBonus:0,dodgeBonus:3,speedBonus:1,
   desc:'短小轻便，适合近身搏击，暗器杀手的入门配备，价格亲民。',special:'暴击率+5%',specialKey:'',
   color:'#998899',color2:'#776677',glow:'rgba(153,136,153,.18)',border:'rgba(153,136,153,.1)',bg1:'rgba(153,136,153,.02)',schools:[]},
  {id:'wep_iron_fist',name:'铁拳套',icon:'🥊',type:'拳套',cat:'拳套',rarity:'common',
   atkBonus:13,critBonus:.02,defBonus:1,hpBonus:0,mpBonus:0,dodgeBonus:0,speedBonus:2,
   desc:'铁制护手，强化拳击力度，拳师专用装备，铁打的功夫铁打的拳。',special:'拳系技能伤害+5%',specialKey:'fist_amp',
   color:'#c07030',color2:'#904010',glow:'rgba(192,112,48,.18)',border:'rgba(192,112,48,.1)',bg1:'rgba(192,112,48,.02)',schools:['fist']},
  {id:'wep_bamboo_flute',name:'竹箫',icon:'🎶',type:'乐器',cat:'乐器',rarity:'common',
   atkBonus:9,critBonus:.03,defBonus:0,hpBonus:0,mpBonus:15,dodgeBonus:2,speedBonus:0,
   desc:'以翠竹削成，音色清脆，可作武器也可奏曲，多才多艺，江湖游侠爱用。',special:'琴系技能效果+10%',specialKey:'',
   color:'#b0d0a0',color2:'#80a870',glow:'rgba(176,208,160,.18)',border:'rgba(176,208,160,.1)',bg1:'rgba(176,208,160,.02)',schools:['music']},
  {id:'wep_stone_bow',name:'猎弓',icon:'🏹',type:'弓箭',cat:'暗器',rarity:'common',
   atkBonus:11,critBonus:.04,defBonus:0,hpBonus:0,mpBonus:0,dodgeBonus:4,speedBonus:1,
   desc:'猎户常用的木弓，拉力适中，精准度够用，百步之内可以瞄准目标。',special:'弓系攻击射程优势，对远程目标伤害+10%',specialKey:'',
   color:'#aa8855',color2:'#775522',glow:'rgba(170,136,85,.18)',border:'rgba(170,136,85,.1)',bg1:'rgba(170,136,85,.02)',schools:['shadow']},
  {id:'wep_hand_bell',name:'铜铃',icon:'🔔',type:'法器',cat:'法器',rarity:'common',
   atkBonus:8,critBonus:.02,defBonus:1,hpBonus:0,mpBonus:20,dodgeBonus:0,speedBonus:0,
   desc:'道观中常见的铜铃，摇动时声响清脆，略有聚气之效，初入道门的弟子标配。',special:'每场战斗开始时内力回复5点',specialKey:'',
   color:'#ccaa55',color2:'#997722',glow:'rgba(204,170,85,.18)',border:'rgba(204,170,85,.1)',bg1:'rgba(204,170,85,.02)',schools:['tao']},
];

// 武器稀有度配置（六档）
const WEP_RARITY = {
  mythic:    {label:'🌟 神器',color:'#ffffff',border:'rgba(220,240,255,.6)',bg1:'rgba(200,220,255,.12)',order:0},
  legendary: {label:'✦ 传说', color:'#ffd060',border:'rgba(255,208,96,.3)', bg1:'rgba(255,208,96,.08)',order:1},
  epic:      {label:'◆ 史诗', color:'#c060ff',border:'rgba(192,96,255,.25)',bg1:'rgba(192,96,255,.07)',order:2},
  rare:      {label:'◇ 精良', color:'#4488ff',border:'rgba(64,136,255,.22)',bg1:'rgba(64,136,255,.06)', order:3},
  uncommon:  {label:'★ 精品', color:'#44cc88',border:'rgba(68,204,136,.2)', bg1:'rgba(68,204,136,.05)',order:4},
  common:    {label:'· 凡品', color:'#aaaaaa',border:'rgba(170,170,170,.18)',bg1:'rgba(170,170,170,.04)',order:5},
};

// ════════════════════════════════════════════════
//  ✦ 装备实例 + 背包系统（D2风格）
// ════════════════════════════════════════════════
//
//  核心思路：每件装备掉落/获得时生成一个"实例"，
//  实例有唯一 instId，绑定到模板(templateId)，
//  拥有自己独立的词条列表。
//  背包里存的是实例数组，装备=把实例绑到身上。
//
//  装备实例结构：
//  {
//    instId:    'wi_1748xxxx',       // 唯一实例ID（weapon instance / costume instance）
//    type:      'weapon'|'costume',  // 装备类型
//    templateId: 'wep_heaven_sword', // 对应 WEAPONS/COSTUMES 的 id
//    identified: false,              // 是否已鉴定
//    affixes:   [],                  // 词条数组（鉴定后填充）
//  }
// ════════════════════════════════════════════════

// 稀有度对应词条数量范围 [min, max]
// 词条数范围 [min, max]：数量在此区间内均匀随机，每次鉴定都不一样
const RARITY_AFFIX_COUNT = {
  mythic:    [3, 7],   // 3~7条，有时平凡有时逆天
  legendary: [2, 6],   // 2~6条
  epic:      [1, 4],   // 1~4条
  rare:      [1, 3],   // 1~3条
  uncommon:  [0, 2],   // 0~2条，有时白板有时有惊喜
  common:    [0, 0],   // 凡品永远无词条
};

// 词条池：每条有 id/label/stat/min/max/suffix/tier(1=强力 2=普通 3=弱)
const AFFIX_POOL = [
  // ── 攻击类（Lv50裸装ATK≈207；tier3≈5%/tier2≈10%/tier1≈20%提升）──
  {id:'a_atk_s',    label:'锋利',   stat:'atkBonus',   min:5,  max:12, suffix:'攻击',  tier:3},
  {id:'a_atk_m',    label:'精锻',   stat:'atkBonus',   min:12, max:25, suffix:'攻击',  tier:2},
  {id:'a_atk_l',    label:'无双',   stat:'atkBonus',   min:25, max:50, suffix:'攻击',  tier:1},
  // ── 暴击类（保持百分比，感知明显即可）──
  {id:'a_crit_s',   label:'敏锐',   stat:'critBonus',  min:2,  max:5,  suffix:'%暴击', tier:3, isPercent:true},
  {id:'a_crit_m',   label:'精准',   stat:'critBonus',  min:5,  max:10, suffix:'%暴击', tier:2, isPercent:true},
  {id:'a_crit_l',   label:'必杀',   stat:'critBonus',  min:10, max:20, suffix:'%暴击', tier:1, isPercent:true},
  // ── 气血类（Lv50裸装HP≈860；tier3≈3%/tier2≈8%/tier1≈18%）──
  {id:'a_hp_s',     label:'强健',   stat:'hpBonus',    min:20, max:50, suffix:'气血',  tier:3},
  {id:'a_hp_m',     label:'雄浑',   stat:'hpBonus',    min:50, max:110,suffix:'气血',  tier:2},
  {id:'a_hp_l',     label:'万钧',   stat:'hpBonus',    min:110,max:220,suffix:'气血',  tier:1},
  // ── 防御类（Lv50裸装DEF≈75；tier3≈5%/tier2≈12%/tier1≈26%）──
  {id:'a_def_s',    label:'坚固',   stat:'defBonus',   min:3,  max:8,  suffix:'防御',  tier:3},
  {id:'a_def_m',    label:'铁壁',   stat:'defBonus',   min:8,  max:18, suffix:'防御',  tier:2},
  {id:'a_def_l',    label:'金刚',   stat:'defBonus',   min:18, max:35, suffix:'防御',  tier:1},
  // ── 内力类（Lv50裸装MP≈200；tier3≈10%/tier2≈25%/tier1≈55%）──
  {id:'a_mp_s',     label:'灵动',   stat:'mpBonus',    min:15, max:35, suffix:'内力',  tier:3},
  {id:'a_mp_m',     label:'深厚',   stat:'mpBonus',    min:35, max:80, suffix:'内力',  tier:2},
  {id:'a_mp_l',     label:'玄奥',   stat:'mpBonus',    min:80, max:160,suffix:'内力',  tier:1},
  // ── 闪避类（百分比，上限50%；tier3/2/1渐进）──
  {id:'a_dodge_s',  label:'轻盈',   stat:'dodgeBonus', min:2,  max:5,  suffix:'%闪避', tier:3, isPercent:true},
  {id:'a_dodge_m',  label:'飘逸',   stat:'dodgeBonus', min:5,  max:10, suffix:'%闪避', tier:2, isPercent:true},
  {id:'a_dodge_l',  label:'鬼影',   stat:'dodgeBonus', min:10, max:20, suffix:'%闪避', tier:1, isPercent:true},
  // ── 速度类（感知明显即可）──
  {id:'a_spd_s',    label:'迅捷',   stat:'speedBonus', min:2,  max:4,  suffix:'速度',  tier:3},
  {id:'a_spd_m',    label:'疾风',   stat:'speedBonus', min:4,  max:7,  suffix:'速度',  tier:2},
  {id:'a_spd_l',    label:'追魂',   stat:'speedBonus', min:6,  max:12,  suffix:'速度',  tier:1},

  // ── 特殊效果类（不直接加数值，而是触发战斗中的被动效果）──
  // 这些词缀通过 battle.js 的 _equipEffects 读取并应用
  // 吸血：攻击时恢复伤害的一定比例
  {id:'e_lifesteal_s',  label:'嗜血',    stat:'lifesteal',  min:3,  max:5,  suffix:'%吸血',  tier:3, isPercent:true, desc:'攻击时恢复3-5%伤害的气血'},
  {id:'e_lifesteal_m',  label:'饮血',    stat:'lifesteal',  min:5,  max:10, suffix:'%吸血',  tier:2, isPercent:true, desc:'攻击时恢复5-10%伤害的气血'},
  {id:'e_lifesteal_l',  label:'血魔',    stat:'lifesteal',  min:10, max:18, suffix:'%吸血',  tier:1, isPercent:true, desc:'攻击时恢复10-18%伤害的气血'},
  // 反击：受击时概率反弹伤害
  {id:'e_counter_s',    label:'坚韧',    stat:'counter',    min:5,  max:8,  suffix:'%反击',  tier:3, isPercent:true, desc:'受击时5-8%概率反弹50%伤害'},
  {id:'e_counter_m',    label:'刚烈',    stat:'counter',    min:8,  max:15, suffix:'%反击',  tier:2, isPercent:true, desc:'受击时8-15%概率反弹50%伤害'},
  {id:'e_counter_l',    label:'以牙还牙',stat:'counter',    min:15,max:25, suffix:'%反击',  tier:1, isPercent:true, desc:'受击时15-25%概率反弹50%伤害'},
  // 灼烧：攻击时概率附加灼烧DOT
  {id:'e_burn_s',       label:'火附',    stat:'burn',       min:5,  max:8,  suffix:'%灼烧',  tier:3, isPercent:true, desc:'攻击时5-8%概率灼烧敌人，每回合-8气血'},
  {id:'e_burn_m',       label:'烈焰',    stat:'burn',       min:8,  max:15, suffix:'%灼烧',  tier:2, isPercent:true, desc:'攻击时8-15%概率灼烧敌人，每回合-12气血'},
  {id:'e_burn_l',       label:'焚天',    stat:'burn',       min:15,max:25, suffix:'%灼烧',  tier:1, isPercent:true, desc:'攻击时15-25%概率灼烧敌人，每回合-18气血'},
  // 中毒：攻击时概率附加中毒DOT
  {id:'e_poison_s',     label:'淬毒',    stat:'poisonTick', min:5,  max:8,  suffix:'%中毒',  tier:3, isPercent:true, desc:'攻击时5-8%概率中毒敌人，每回合-6气血'},
  {id:'e_poison_m',     label:'剧毒',    stat:'poisonTick', min:8,  max:15, suffix:'%中毒',  tier:2, isPercent:true, desc:'攻击时8-15%概率中毒敌人，每回合-10气血'},
  // 冰冻：攻击时概率冻结敌人（跳过回合）
  {id:'e_freeze_s',     label:'寒意',    stat:'freeze',     min:3,  max:5,  suffix:'%冰冻',  tier:3, isPercent:true, desc:'攻击时3-5%概率冻结敌人1回合'},
  {id:'e_freeze_m',     label:'寒霜',    stat:'freeze',     min:5,  max:10, suffix:'%冰冻',  tier:2, isPercent:true, desc:'攻击时5-10%概率冻结敌人1回合'},
  // 护盾：战斗开始时获得护盾
  {id:'e_shield_s',     label:'灵护',    stat:'shield',     min:30, max:50, suffix:'护盾',  tier:3, desc:'战斗开始时获得30-50点护盾'},
  {id:'e_shield_m',     label:'金钟罩',  stat:'shield',     min:50, max:100,suffix:'护盾',  tier:2, desc:'战斗开始时获得50-100点护盾'},
  {id:'e_shield_l',     label:'不灭体',  stat:'shield',     min:100,max:200,suffix:'护盾',  tier:1, desc:'战斗开始时获得100-200点护盾'},
  // 经验加成
  {id:'e_exp_s',        label:'悟性',    stat:'expBoost',   min:3,  max:5,  suffix:'%经验',  tier:3, isPercent:true, desc:'战斗经验+3-5%'},
  {id:'e_exp_m',        label:'慧根',    stat:'expBoost',   min:5,  max:10, suffix:'%经验',  tier:2, isPercent:true, desc:'战斗经验+5-10%'},
  {id:'e_exp_l',        label:'天纵之才',stat:'expBoost',   min:10,max:20, suffix:'%经验',  tier:1, isPercent:true, desc:'战斗经验+10-20%'},
  // 银两加成
  {id:'e_silver_s',     label:'聚财',    stat:'silverBoost', min:5,  max:10, suffix:'%银两',  tier:3, isPercent:true, desc:'战斗银两+5-10%'},
  {id:'e_silver_m',     label:'财运',    stat:'silverBoost', min:10,max:20, suffix:'%银两',  tier:2, isPercent:true, desc:'战斗银两+10-20%'},
  // 连击：攻击时概率额外攻击一次
  {id:'e_double_s',     label:'疾影',    stat:'doubleStrike',min:3, max:5,  suffix:'%连击',  tier:2, isPercent:true, desc:'攻击时3-5%概率追加一次普攻'},
  {id:'e_double_l',     label:'残影',    stat:'doubleStrike',min:5, max:12, suffix:'%连击',  tier:1, isPercent:true, desc:'攻击时5-12%概率追加一次普攻'},
];

// ════════════════════════════════════════════════════════════════
//  负面词条池（大凶日鉴定有概率出现）
// ════════════════════════════════════════════════════════════════
const NEGATIVE_AFFIX_POOL = [
  // ── 攻击惩罚 ──
  {id:'n_atk_s',    label:'钝刃',   stat:'atkBonus',   min:-5,  max:-2,  suffix:'攻击',  tier:3, isNegative:true},
  {id:'n_atk_m',    label:'锈蚀',   stat:'atkBonus',   min:-12, max:-5,  suffix:'攻击',  tier:2, isNegative:true},
  {id:'n_atk_l',    label:'残破',   stat:'atkBonus',   min:-25, max:-12, suffix:'攻击',  tier:1, isNegative:true},
  // ── 暴击惩罚 ──
  {id:'n_crit_s',   label:'笨拙',   stat:'critBonus',  min:-3,  max:-1,  suffix:'%暴击', tier:3, isPercent:true, isNegative:true},
  {id:'n_crit_m',   label:'迟钝',   stat:'critBonus',  min:-6,  max:-3,  suffix:'%暴击', tier:2, isPercent:true, isNegative:true},
  {id:'n_crit_l',   label:'昏聩',   stat:'critBonus',  min:-10, max:-5,  suffix:'%暴击', tier:1, isPercent:true, isNegative:true},
  // ── 气血惩罚 ──
  {id:'n_hp_s',     label:'虚弱',   stat:'hpBonus',    min:-30, max:-10, suffix:'气血',  tier:3, isNegative:true},
  {id:'n_hp_m',     label:'病态',   stat:'hpBonus',    min:-60, max:-25, suffix:'气血',  tier:2, isNegative:true},
  {id:'n_hp_l',     label:'衰竭',   stat:'hpBonus',    min:-120,max:-50, suffix:'气血',  tier:1, isNegative:true},
  // ── 防御惩罚 ──
  {id:'n_def_s',    label:'脆弱',   stat:'defBonus',   min:-5,  max:-2,  suffix:'防御',  tier:3, isNegative:true},
  {id:'n_def_m',    label:'疏松',   stat:'defBonus',   min:-10, max:-4,  suffix:'防御',  tier:2, isNegative:true},
  {id:'n_def_l',    label:'崩解',   stat:'defBonus',   min:-20, max:-8,  suffix:'防御',  tier:1, isNegative:true},
  // ── 内力惩罚 ──
  {id:'n_mp_s',     label:'枯竭',   stat:'mpBonus',    min:-25, max:-10, suffix:'内力',  tier:3, isNegative:true},
  {id:'n_mp_m',     label:'干涸',   stat:'mpBonus',    min:-50, max:-20, suffix:'内力',  tier:2, isNegative:true},
  {id:'n_mp_l',     label:'虚无',   stat:'mpBonus',    min:-100,max:-40, suffix:'内力',  tier:1, isNegative:true},
  // ── 闪避惩罚 ──
  {id:'n_dodge_s',  label:'笨重',   stat:'dodgeBonus', min:-3,  max:-1,  suffix:'%闪避', tier:3, isPercent:true, isNegative:true},
  {id:'n_dodge_m',  label:'僵直',   stat:'dodgeBonus', min:-6,  max:-3,  suffix:'%闪避', tier:2, isPercent:true, isNegative:true},
  {id:'n_dodge_l',  label:'迟缓',   stat:'dodgeBonus', min:-10, max:-5,  suffix:'%闪避', tier:1, isPercent:true, isNegative:true},
  // ── 速度惩罚 ──
  {id:'n_spd_s',    label:'滞涩',   stat:'speedBonus', min:-3,  max:-1,  suffix:'速度',  tier:3, isNegative:true},
  {id:'n_spd_m',    label:'拖沓',   stat:'speedBonus', min:-5,  max:-2,  suffix:'速度',  tier:2, isNegative:true},
  {id:'n_spd_l',    label:'凝滞',   stat:'speedBonus', min:-8,  max:-4,  suffix:'速度',  tier:1, isNegative:true},
  // ── 特殊诅咒 ──
  {id:'n_curse_1',  label:'招灾',   stat:'curse',      min:1,   max:1,   suffix:'诅咒',  tier:1, isNegative:true, desc:'战斗中更容易被暴击'},
  {id:'n_curse_2',  label:'破财',   stat:'curse',      min:1,   max:1,   suffix:'诅咒',  tier:1, isNegative:true, desc:'战斗后银两损失10%'},
  {id:'n_curse_3',  label:'厄运',   stat:'curse',      min:1,   max:1,   suffix:'诅咒',  tier:1, isNegative:true, desc:'奇遇触发概率降低20%'},
];

const AFFIX_GROUPS = ['atkBonus','critBonus','hpBonus','defBonus','mpBonus','dodgeBonus','speedBonus',
  'lifesteal','counter','burn','poisonTick','freeze','shield','expBoost','silverBoost','doubleStrike'];
// tier1=强力词条，tier2=普通，tier3=弱小
// 高稀有度可出高tier，低稀有度只能出弱词条（但词条数浮动很大）
const RARITY_MAX_TIER = { mythic:3, legendary:3, epic:3, rare:3, uncommon:3, common:0 };

// 稀有度掉落权重（数字越大越容易出）
const RARITY_DROP_WEIGHT = {
  common:40, uncommon:28, rare:16, epic:9, legendary:5, mythic:2
};

/**
 * 滚动词条（D2风格）
 * @param {string} rarity
 * @returns {Array}
 */
// 各稀有度的tier权重 [tier1强, tier2中, tier3弱]
// 稀有度越高，强力词条（tier1）越容易出
const RARITY_TIER_WEIGHT = {
  mythic:    [5, 3, 1],   // 神器：强词条为主
  legendary: [4, 3, 2],   // 传说：强词条较多
  epic:      [2, 4, 3],   // 史诗：中等为主
  rare:      [1, 3, 4],   // 精良：弱/中为主
  uncommon:  [0, 2, 5],   // 精品：基本是弱词条
  common:    [0, 0, 0],
};

function rollAffixes(rarity){
  const [minC, maxC] = RARITY_AFFIX_COUNT[rarity] || [0,0];
  if(maxC === 0) return [];
  
  // 获取黄历信息
  let goodMod = 1.0;
  let badMod = 1.0;
  let fortuneName = '平';
  if (typeof getAlmanacModifier === 'function' && typeof edS !== 'undefined') {
    goodMod = getAlmanacModifier(edS, 'good');
    badMod = getAlmanacModifier(edS, 'bad');
    if (typeof getAlmanacFortune === 'function') {
      const fortune = getAlmanacFortune(edS);
      fortuneName = fortune.name;
    }
  }
  
  // 应用黄历修正：吉日增加词条数量概率，凶日减少
  let countBonus = 0;
  // 吉日：有概率额外获得词条；凶日：有概率减少词条
  if (goodMod > 1 && Math.random() < (goodMod - 1) * 0.5) {
    countBonus = 1; // 吉日额外+1词条
  } else if (goodMod < 1 && Math.random() < (1 - goodMod) * 0.5) {
    countBonus = -1; // 凶日可能-1词条
  }
  
  // 词条数在[min,max]内随机，惊喜感来自大范围
  let count = minC + Math.floor(Math.random()*(maxC-minC+1)) + countBonus;
  count = Math.max(0, Math.min(maxC + 1, count)); // 限制在合理范围内
  if(count === 0) return []; // uncommon 有可能0条（白板惊吓）
  
  const tierWeights = RARITY_TIER_WEIGHT[rarity] || [1,3,3];
  
  // 应用黄历修正：吉日增加高tier词条概率
  let adjustedTierWeights = [...tierWeights];
  // 吉日：tier1权重增加，tier3权重减少；凶日相反
  if (goodMod !== 1.0) {
    const shift = (goodMod - 1) * 2; // 大吉+1.0，大凶-1.0
    adjustedTierWeights[0] = Math.max(1, tierWeights[0] + shift * 2); // tier1
    adjustedTierWeights[1] = Math.max(1, tierWeights[1] + shift * 0.5); // tier2
    adjustedTierWeights[2] = Math.max(1, tierWeights[2] - shift * 2); // tier3
  }
  
  // 计算负面词条概率（大凶日概率最高）
  let negativeProb = 0;
  if (fortuneName === '大凶') {
    negativeProb = 0.40; // 大凶日40%概率出负面词条
  } else if (fortuneName === '凶') {
    negativeProb = 0.20; // 凶日20%概率
  } else if (fortuneName === '平') {
    negativeProb = 0.05; // 平日5%概率
  } else {
    negativeProb = 0; // 吉日不出负面词条
  }
  
  const shuffledGroups = [...AFFIX_GROUPS].sort(()=>Math.random()-.5).slice(0, count);
  const result = [];
  for(const stat of shuffledGroups){
    // 判断是否出负面词条
    const isNegative = Math.random() < negativeProb;
    
    if (isNegative) {
      // 抽取负面词条
      let negPool = NEGATIVE_AFFIX_POOL.filter(a => a.stat === stat || a.stat === 'curse');
      if (!negPool.length) negPool = NEGATIVE_AFFIX_POOL;
      const chosen = negPool[Math.floor(Math.random() * negPool.length)];
      const value = chosen.min + Math.floor(Math.random() * (chosen.max - chosen.min + 1));
      result.push({
        id: chosen.id,
        label: chosen.label,
        stat: chosen.stat,
        value: value,
        suffix: chosen.suffix,
        tier: chosen.tier,
        isPercent: !!chosen.isPercent,
        isNegative: true,
        desc: chosen.desc || ''
      });
    } else {
      // 正常抽取正面词条
      // 先用tier权重决定这条词条抽哪个tier
      const tierTotal = adjustedTierWeights[0]+adjustedTierWeights[1]+adjustedTierWeights[2];
      let rnd = Math.random()*tierTotal;
      let targetTier = 3;
      if(rnd < adjustedTierWeights[0]) targetTier = 1;
      else if(rnd < adjustedTierWeights[0]+adjustedTierWeights[1]) targetTier = 2;
      // 优先抽目标tier，没有则降级
      let pool = AFFIX_POOL.filter(a=>a.stat===stat && a.tier===targetTier);
      if(!pool.length) pool = AFFIX_POOL.filter(a=>a.stat===stat);
      if(!pool.length) continue;
      const chosen = pool[Math.floor(Math.random()*pool.length)];
      
      // 应用黄历修正：吉日词条数值更高
      let valueRange = chosen.max - chosen.min + 1;
      let valueBias = 0;
      // 吉日偏向高值，凶日偏向低值
      valueBias = Math.floor((goodMod - 1) * valueRange * 0.3);
      let value = chosen.min + Math.floor(Math.random()*valueRange) + valueBias;
      value = Math.max(chosen.min, Math.min(chosen.max, value)); // 限制在范围内
      
      result.push({id:chosen.id, label:chosen.label, stat:chosen.stat, value, suffix:chosen.suffix, tier:chosen.tier, isPercent:!!chosen.isPercent});
    }
  }
  return result;
}

/**
 * 创建一个装备实例（未鉴定）
 * @param {'weapon'|'costume'|'accessory'} type
 * @param {string} templateId  WEAPONS/COSTUMES/ACCESSORIES 的 id
 * @returns {Object} 装备实例
 */
function createEquipInst(type, templateId){
  let tpl = null;
  if(type==='weapon')     tpl = WEAPONS.find(w=>w.id===templateId);
  else if(type==='costume') tpl = COSTUMES.find(c=>c.id===templateId);
  else if(type==='accessory') tpl = (typeof ACCESSORIES !== 'undefined') ? ACCESSORIES.find(a=>a.id===templateId) : null;
  if(!tpl) return null;
  const prefix = type==='weapon' ? 'wi' : type==='costume' ? 'ci' : 'ai';
  // 武器/服装掉落时为"未鉴定"状态，需要鉴定才能获得随机词条
  // 配饰直接已鉴定，使用模板属性即可
  const needsIdentify = (type === 'weapon' || type === 'costume');
  return {
    instId:     `${prefix}_${Date.now()}_${Math.floor(Math.random()*9999)}`,
    type,
    templateId,
    identified: !needsIdentify,
    affixes:    [],
  };
}

/**
 * 鉴定一个装备实例（填充词条）
 * @param {string} instId  装备实例ID
 */
function identifyInst(instId){
  const inst = bagFindInst(instId);
  if(!inst) return;
  if(inst.identified) { showFloatTip('此装备已经鉴定过了。'); return; }
  const tpl = inst.type==='weapon'
    ? WEAPONS.find(w=>w.id===inst.templateId)
    : COSTUMES.find(c=>c.id===inst.templateId);
  if(!tpl) {
    showFloatTip('⚠️ 装备模板数据异常，无法鉴定！');
    return;
  }
  inst.affixes   = rollAffixes(tpl.rarity);
  inst.identified = true;
  bagSave();
  // 同步到 wuxia_editor，确保战斗系统能读取到鉴定后的词条
  if (typeof editorSave === 'function') {
    editorSave();
  } else if (typeof saveGameState === 'function') {
    saveGameState();
  }
  renderBagPanel();
  // 如果当前装备正是这件，刷新捏脸工坊装备栏
  if(typeof edS !== 'undefined' && (edS.weaponInstId === instId || edS.costumeInstId === instId)){
    cpRefreshWeaponSelector();
    cpRefreshCostumeSelector();
  }

  // ── 鉴定结果展示 ──
  const tierColor = {1:'#ffd700',2:'#80d8ff',3:'#a0e0a0'};
  const names = inst.affixes.map(a => {
    if (a.isNegative) {
      return `<span style="color:#e74c3c">${a.label}${a.value<0?a.value:'+'+a.value}${a.suffix||''}</span>`;
    }
    const c = tierColor[a.tier] || '#ffd060';
    return `<span style="color:${c}">${a.label}+${a.value}${a.suffix||''}</span>`;
  }).join(' · ');
  
  // 检查是否有负面词条
  const hasNegative = inst.affixes.some(a => a.isNegative);
  const negativeCount = inst.affixes.filter(a => a.isNegative).length;
  const affixCount = inst.affixes.length;
  const hasTier1 = inst.affixes.some(a => a.tier === 1 && !a.isNegative);
  
  let msg;
  if (hasNegative) {
    msg = `⚠️ 【${tpl.name}】鉴定完成！发现${negativeCount}条负面词条：${names}`;
  } else if (affixCount >= 4) {
    msg = `🌟 【${tpl.name}】逆天词条！${affixCount}条词条：${names}`;
    if(typeof playAudio === 'function') playAudio('levelup'); // 用升级音效替代
  } else if (affixCount >= 2 && hasTier1) {
    msg = `✨ 【${tpl.name}】极品词条！${affixCount}条词条：${names}`;
  } else if (inst.affixes.length) {
    msg = `✦ 【${tpl.name}】鉴定成功！获得${affixCount}条词条：${names}`;
  } else {
    msg = `✦ 【${tpl.name}】鉴定完毕，此乃凡品，无特殊词条。`;
  }
  showFloatTip(msg);
  if (typeof playAudio === 'function' && affixCount < 4) playAudio('identify');
}
const BAG_KEY = 'wuxia_bag';

function bagLoad(){
  try{ return JSON.parse(localStorage.getItem(BAG_KEY)||'[]'); }
  catch(e){ return []; }
}
function bagSave(){
  if(typeof edS === 'undefined') return;
  localStorage.setItem(BAG_KEY, JSON.stringify(edS.bag||[]));
}
/** 在背包中查找实例 */
function bagFindInst(instId){
  return (typeof edS !== 'undefined' && edS.bag) ? edS.bag.find(i=>i.instId===instId) || null : null;
}
/** 往背包加入实例，返回加入的实例 */
function bagAddInst(inst){
  if(typeof edS === 'undefined') return inst;
  if(!edS.bag) edS.bag = [];
  edS.bag.push(inst);
  bagSave();
  return inst;
}
/** 从背包移除实例 */
function bagRemoveInst(instId){
  if(typeof edS === 'undefined' || !edS.bag) return;
  edS.bag = edS.bag.filter(i=>i.instId!==instId);
  bagSave();
}

// ─── 随机掉落一件装备（按权重选稀有度 + 随机模板）─
function dropRandomEquip(type){
  // 按权重选稀有度
  const entries = Object.entries(RARITY_DROP_WEIGHT);
  const total   = entries.reduce((s,[,w])=>s+w, 0);
  let rnd = Math.random()*total;
  let rarity = 'common';
  for(const [r,w] of entries){ rnd-=w; if(rnd<=0){rarity=r;break;} }
  // 从对应稀有度+类型里随机选模板
  const pool = (type==='weapon' ? WEAPONS : COSTUMES).filter(t=>t.rarity===rarity);
  if(!pool.length) return null;
  const tpl = pool[Math.floor(Math.random()*pool.length)];
  return createEquipInst(type, tpl.id);
}

/** 获取某个装备实例的词条（已鉴定返回数组，未鉴定返回null） */
function getInstAffixes(instId){
  const inst = bagFindInst(instId);
  if(!inst || !inst.identified) return null;
  return inst.affixes || [];
}

/** 从实例ID获取装备模板 */
function getInstTemplate(instId){
  const inst = bagFindInst(instId);
  if(!inst) return null;
  if(inst.type==='weapon')    return WEAPONS.find(w=>w.id===inst.templateId) || null;
  if(inst.type==='costume')   return COSTUMES.find(c=>c.id===inst.templateId) || null;
  if(inst.type==='accessory') return (typeof ACCESSORIES !== 'undefined') ? ACCESSORIES.find(a=>a.id===inst.templateId) || null : null;
  return null;
}

// ── 兼容旧接口（calcFinalStats 里调用 getItemAffixes，改为读实例） ──
function getItemAffixes(type, templateId){
  // 在背包+装备中查找，优先当前已装备的实例
  let instId = null;
  if(typeof edS !== 'undefined') {
    if(type==='weapon')    instId = edS.weaponInstId;
    else if(type==='costume') instId = edS.costumeInstId;
    else if(type==='accessory') instId = edS.accessoryInstId;
  }
  if(!instId) return null;
  const inst = bagFindInst(instId);
  if(!inst || !inst.identified) return null;
  return inst.affixes || [];
}

/** 渲染词条HTML */
function renderAffixesHtml(affixes, compact){
  if(!affixes || !affixes.length) return '';
  const tierColor = {1:'#ffd060',2:'#80d8ff',3:'#a0e0a0'};
  if(compact){
    return `<div class="affix-line compact">${
      affixes.map(a=>`<span style="color:${tierColor[a.tier]||'#ccc'}">${a.label}+${a.value}${a.suffix}</span>`).join(' ')
    }</div>`;
  }
  return affixes.map(a=>`
    <div class="affix-row" style="--af-color:${tierColor[a.tier]||'#ccc'}">
      <span class="affix-label">${a.label}</span>
      <span class="affix-val">+${a.value}${a.suffix}</span>
    </div>`).join('');
}

/** 浮字提示 */
function showFloatTip(html){
  let el = document.getElementById('globalFloatTip');
  if(!el){
    el = document.createElement('div');
    el.id = 'globalFloatTip';
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9999;pointer-events:none;text-align:center;font-size:12px;letter-spacing:1px;transition:opacity .4s;padding:8px 18px;border-radius:10px;background:rgba(4,3,15,.9);border:1px solid rgba(255,208,96,.25);color:#e8d090;max-width:320px;line-height:1.6;';
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(()=>{ el.style.opacity='0'; }, 3200);
}

// 角色默认武器绑定
const CHAR_WEAPON = {
  // 超级门派

  shaolin_d:    'wep_nine_ring',
  wudang_d:     'wep_taiji_sword',
  xiaoyao_d:    'wep_jade_flute',
  riyue_d:      'wep_m_chaos_blade',
  // 大型门派
  huashan_d:    'wep_heaven_sword',
  mingjiao_d:   'wep_iron_fist',
  wudu_d:       'wep_poison_fan',
  tangmen_d:    'wep_silver_needle',
  taohuadao_d:  'wep_cold_light',
  emei_d:       'wep_uc_iron_sword',
  kongtong_d:   'wep_iron_fist',
  kunlun_d:     'wep_uc_iron_sword',
  // 新兴势力
  tiandibang_d: 'wep_wooden_stick',
  guigu_d:      'wep_short_knife',
  shengguang_d: 'wep_uc_iron_sword',
  diancang_d:   'wep_uc_iron_sword',
  tianshan_d:   'wep_uc_iron_sword',
  xixia_d:      'wep_short_knife',
  tianlong_d:   'wep_wooden_stick',
  nangong_d:    'wep_uc_iron_sword',
  xuanming_d:   'wep_short_knife',
  haisha_d:     'wep_uc_dao',
  xuegu_d:      'wep_wooden_stick',
  lingxiao_d:   'wep_uc_iron_sword',
  qingcheng_d:  'wep_uc_iron_sword',
};
// ────────────────────────────────────────────────
//  武器ASCII字符艺术图标
// ────────────────────────────────────────────────
const WEP_ASCII = {
  // 剑：竖立长剑形态
  '剑': [
    '  /\\  ',
    ' /  \\ ',
    ' |  | ',
    ' |  | ',
    '_|  |_',
    ' \\__/ ',
    '  ||  ',
    '  ||  ',
  ],
  // 刀：横向弯刀
  '刀': [
    '     _',
    '  __/ )',
    ' /  _/ ',
    '(  / )',
    ' \\/_/ ',
    ' /|   ',
    '/_|   ',
    '  |   ',
  ],
  // 枪矛：带矛头的长柄
  '枪矛': [
    '  /\\  ',
    ' /  \\ ',
    '/    \\',
    '\\  / /',
    ' \\/ / ',
    '  |/  ',
    '  |   ',
    '  |   ',
  ],
  // 棍杖：直杖带顶饰
  '棍杖': [
    ' (*)  ',
    '  |   ',
    '  |   ',
    '  |   ',
    '  |   ',
    '  |   ',
    '  |   ',
    ' _|_  ',
  ],
  // 暗器：飞镖/针形
  '暗器': [
    '   *  ',
    '  /|\\ ',
    ' / | \\',
    '/  |  \\',
    '\\  |  /',
    ' \\ | /',
    '  \\|/ ',
    '   *  ',
  ],
  // 拳套：握拳形状
  '拳套': [
    ' ___  ',
    '/   \\ ',
    '|ooo| ',
    '|___| ',
    '|   | ',
    '|___| ',
    ' \\_/  ',
    '      ',
  ],
  // 法器：八卦法轮
  '法器': [
    ' _____',
    '/  |  \\',
    '|- O -|',
    '|  |  |',
    '\\__|__/',
    '   |   ',
    '  ( )  ',
    '   |   ',
  ],
  // 乐器：琴弦图案
  '乐器': [
    ' _____ ',
    '/|||||\\',
    '| | | |',
    '| | | |',
    '|_|_|_|',
    '   |   ',
    '  ( )  ',
    '   ~   ',
  ],
};

// 单行简化符号（用于小图标场景）
const WEP_ASCII_MINI = {
  '剑':  '丨',
  '刀':  '刀',
  '枪矛':'矛',
  '棍杖':'木',
  '暗器':'✦',
  '拳套':'拳',
  '法器':'◎',
  '乐器':'♪',
};

// 生成ASCII武器图标HTML（大图）
function getWepAsciiHtml(cat, color){
  const lines = WEP_ASCII[cat] || WEP_ASCII['剑'];
  const c = color || '#80b8ff';
  return `<pre class="wep-ascii-art" style="color:${c}">${lines.join('\n')}</pre>`;
}
// 生成迷你字符符号
function getWepMiniSymbol(cat){
  return WEP_ASCII_MINI[cat] || '◇';
}

// ────────────────────────────────────────────────
//  服装ASCII字符艺术图标（按门派风格分组）
// ────────────────────────────────────────────────
const COS_ASCII = {
  // 佛/禅系（少林、峨眉、圣光）— 袈裟/莲花
  buddha: [
    ' _/\\_ ',
    '( ☯  )',
    ' |  | ',
    '/|  |\\',
    '| || |',
    '\\|  |/',
    ' \\  / ',
    '  \\/  ',
  ],
  // 道系（武当、逍遥、青城）— 道袍/太极
  tao: [
    ' _____ ',
    '/ ☯   \\',
    '| |   |',
    '|  \\_/ ',
    '|  /\\  ',
    '| /  | ',
    '\\_____/',
    '  | |  ',
  ],
  // 火/圣（日月、明教）— 火焰战袍
  fire: [
    ' /\\  /\\',
    '/  \\/  \\',
    '\\  /\\  /',
    ' \\/  \\/ ',
    ' |    | ',
    '/|    |\\',
    '\\|    |/',
    ' \\____/ ',
  ],
  // 剑侠（华山、逍遥、崆峒、昆仑）— 侠客袍
  sword: [
    '  /|\\  ',
    ' / | \\ ',
    '/  |  \\',
    '|--+--|',
    '\\  |  /',
    ' \\ | / ',
    '  \\|/  ',
    '  _|_  ',
  ],
  // 毒/暗（五毒、唐门、玄冥）— 藤甲/暗袍
  dark: [
    ' ====  ',
    '//  \\\\ ',
    '||~~|| ',
    '||  || ',
    '\\\\__// ',
    ' \\__/  ',
    ' |  |  ',
    '_|__|_ ',
  ],
  // 柔/花（桃花岛、峨眉、点苍）— 轻纱长裙
  soft: [
    '  /~~\\  ',
    ' /    \\ ',
    '| ~  ~ |',
    '|      |',
    ' \\~~~~/ ',
    '  \\__/  ',
    '  |  |  ',
    ' /|  |\\ ',
  ],
  // 武/力（天龙、海沙、血骨）— 铁甲重铠
  armor: [
    ' _____ ',
    '|=====|',
    '|  _  |',
    '| | | |',
    '|=|=|=|',
    '|  _  |',
    '|_____|',
    ' |   | ',
  ],
  // 奇/仙（逍遥、天山、西夏）— 仙鹤袍
  fairy: [
    '  /^\\  ',
    ' /   \\ ',
    '| *  * |',
    '|  --  |',
    ' \\    / ',
    '  \\  /  ',
    ' __\\/__  ',
    '/       \\',
  ],
  // 江湖/通用（天地帮、鬼谷、凌霄、南宫）— 普通劲装
  common: [
    ' _____ ',
    '/     \\',
    '|  △  |',
    '|     |',
    '|_____|',
    ' |   | ',
    ' |   | ',
    '_|___|_',
  ],
};

// 门派 → 服装风格 映射
const SECT_COS_STYLE = {
  shaolin:'buddha', emei:'buddha', shengguang:'buddha',
  wudang:'tao', qingcheng:'tao',
  xiaoyao:'tao', tianshan:'fairy', xixia:'fairy',
  riyue:'fire', mingjiao:'fire',
  huashan:'sword', kongtong:'sword', kunlun:'sword',
  wudu:'dark', tangmen:'dark', xuanming:'dark',
  taohuadao:'soft', diancang:'soft',
  tianlong:'armor', haisha:'armor', xuegu:'armor',
  tiandibang:'common', guigu:'common', lingxiao:'common', nangong:'common',
};

// 服装迷你符号（用于小图标）
const COS_ASCII_MINI = {
  buddha:'袈', tao:'道', fire:'焰', sword:'侠',
  dark:'甲', soft:'裙', armor:'铠', fairy:'仙', common:'衣',
};

// 获取服装风格（根据 sectId）
function getCosStyle(cs){
  if(!cs) return 'common';
  return SECT_COS_STYLE[cs.sectId] || 'common';
}

// 生成ASCII服装图标HTML（大图）
function getCosAsciiHtml(cs, color){
  const style = getCosStyle(cs);
  const lines = COS_ASCII[style] || COS_ASCII.common;
  const c = color || (cs && cs.color) || '#c080e0';
  return `<pre class="cos-ascii-art" style="color:${c}">${lines.join('\n')}</pre>`;
}

// 生成迷你服装字符
function getCosMiniSymbol(cs){
  const style = getCosStyle(cs);
  return COS_ASCII_MINI[style] || '衣';
}

function getCharWeapon(charId){
  // 自定义角色（捏脸出战 cp_self 或存档角色 cc...）：从 edS.weaponId 或存档里读
  if(charId && (charId === 'cp_self' || charId.startsWith('cc'))){
    const wid = (() => {
      // 优先当前编辑状态（包含刚刚选好的武器）
      if(typeof edS !== 'undefined' && edS.weaponId) return edS.weaponId;
      // 其次查存档（cc... 系列）
      const saved = JSON.parse(localStorage.getItem('wuxia_cc')||'[]');
      const rec = saved.find(s=>s.id===charId);
      return rec?.weaponId || null;
    })();
    if(wid) return WEAPONS.find(w=>w.id===wid) || null;
    return null;
  }
  
  // 敌人武器处理
  if(charId && charId.startsWith('_enemy_')){
    const enemyId = charId.replace('_enemy_', '');
    const enemy = (typeof ENEMY_DB !== 'undefined' && ENEMY_DB[enemyId]) || 
                  (typeof ENEMIES !== 'undefined' && ENEMIES.find(e => e.id === enemyId));
    // 野兽类敌人没有武器
    if(enemy && enemy.type === 'beast'){
      return null;
    }
    // 其他敌人：有配置就用配置，否则返回null（不再默认给武器）
    const wid = CHAR_WEAPON[charId];
    return wid ? (WEAPONS.find(w=>w.id===wid) || null) : null;
  }
  
  // 群英谱角色默认武器
  const wid = CHAR_WEAPON[charId];
  return WEAPONS.find(w=>w.id===wid) || WEAPONS.find(w=>w.rarity==='common') || WEAPONS[0];
}

// ══════════════════════════════════════════════
// 武器 → 手臂部件索引映射
// ED_PARTS.arms 索引：0空手 1长剑 2双刀 3禅杖 4弓箭 5折扇
//   6铁拳 7拂尘 8棍棒 9飞镖 10双节 11钩镰 12长枪 13毒针 14书卷 15火焰
// ══════════════════════════════════════════════
const WEP_TO_ARMS = {
  // ── 神器 ──
  wep_m_xuanyuan:      1,  // 轩辕天剑→长剑
  wep_m_chaos_saber:   2,  // 混沌魔刀→双刀
  wep_m_divine_spear:  12, // 开天神枪→长枪
  wep_m_ruyi:          8,  // 如意金箍棒→棍棒
  wep_m_heaven_dart:   9,  // 天外流星→飞镖
  wep_m_dragon_fist:   6,  // 龙爪天罡手→铁拳
  wep_m_chaos_bead:    7,  // 混元珠→拂尘(法器)
  wep_m_ling_xiao_qin: 14, // 凌霄九音琴→书卷

  // ── 传说 ──
  wep_heaven_sword:    1,  // 倚天剑→长剑
  wep_taiji_sword:     1,  // 太极剑→长剑
  wep_cold_light:      1,  // 寒光剑→长剑
  wep_dragon_saber:    2,  // 屠龙刀→双刀
  wep_ghost_blade:     2,  // 幽冥鬼头刀→双刀
  wep_sun_spear:       12, // 日月神矛→长枪
  wep_dragon_lance:    12, // 龙胆亮银枪→长枪
  wep_nine_ring:       3,  // 九环禅杖→禅杖
  wep_fire_staff:      8,  // 赤炎神杖→棍棒
  wep_phoenix_feather: 9,  // 凤翎神针→飞镖
  wep_xuanming_palm:   10, // 玄冥寒铁鞭→双节
  wep_divine_qin:      14, // 焦尾琴→书卷
  wep_thunder_drum:    8,  // 雷霆战鼓→棍棒

  // ── 史诗 ──
  wep_xuanming_sword:  1,  // 玄冥剑→长剑
  wep_wind_blade:      1,  // 风羽剑→长剑
  wep_holy_cross:      1,  // 圣光十字剑→长剑
  wep_poison_fan:      5,  // 五毒扇→折扇
  wep_blood_saber:     2,  // 血煞弯刀→双刀
  wep_meteor_hammer:   6,  // 流星锤→铁拳
  wep_ice_lance:       12, // 玄冰寒刺→长枪
  wep_iron_staff:      8,  // 铁禅棍→棍棒
  wep_thunder_staff:   8,  // 落雷神棍→棍棒
  wep_flying_dart:     9,  // 唐门飞刀→飞镖
  wep_poison_arrow:    4,  // 碧毒神箭→弓箭
  wep_iron_glove:      6,  // 霸王铁拳→铁拳
  wep_fire_glove:      6,  // 烈焰焚天拳→铁拳
  wep_tao_mirror:      7,  // 乾坤照妖镜→拂尘
  wep_soul_bell:       7,  // 幽冥魂铃→拂尘

  // ── 精良 ──
  wep_silver_sword:    1,  // 银光剑→长剑
  wep_peach_stick:     8,  // 打狗棒→棍棒
  wep_wolf_fang:       8,  // 狼牙棒→棍棒
  wep_dark_knife:      9,  // 夺命血刃→飞镖
  wep_long_spear:      12, // 丈八蛇矛→长枪
  wep_staff_wind:      3,  // 降魔杖→禅杖
  wep_silver_needle:   13, // 银针→毒针
  wep_iron_dart:       9,  // 铁蒺藜→飞镖
  wep_iron_fist_rare:  6,  // 铁砂掌→铁拳
  wep_tao_charm:       14, // 道家符箓→书卷
  wep_jade_flute:      31, // 碧玉箫→持箫

  // ── 精品 ──
  wep_uc_iron_sword:   1,  // 精铁长剑→长剑
  wep_uc_dao:          2,  // 雁翎刀→双刀
  wep_uc_spear:        12, // 红缨枪→长枪
  wep_uc_bamboo_staff: 8,  // 竹节棍→棍棒
  wep_uc_dart:         9,  // 铜飞镖→飞镖
  wep_uc_glove:        6,  // 皮护手→铁拳
  wep_uc_scroll:       14, // 道经一卷→书卷
  wep_uc_erhu:         14, // 二胡→书卷

  // ── 凡品 ──
  wep_iron_sword:      1,  // 铁剑→长剑
  wep_wooden_stick:    8,  // 木棍→棍棒
  wep_short_knife:     9,  // 匕首→飞镖
  wep_iron_fist:       6,  // 铁拳套→铁拳
  wep_bamboo_flute:    31, // 竹箫→持箫
  wep_stone_bow:       4,  // 猎弓→弓箭
  wep_hand_bell:       7,  // 铜铃→拂尘
};

/**
 * 根据武器ID返回对应的 ED_PARTS.arms 索引
 * 如果没有映射则返回 null（保持原有手臂）
 */
function getWepArmsIdx(weaponId){
  if(!weaponId) return null;
  const idx = WEP_TO_ARMS[weaponId];
  return idx !== undefined ? idx : null;
}

// ════════════════════════════════════════════════
//  ✦ 技能-武器适配系统 ✦
// ════════════════════════════════════════════════
// 技能school中文名 → 武器schools key 映射
const SCHOOL_TO_WEP = {
  '剑系':   ['sword'],
  '佛系':   ['buddha','force'],
  '道系':   ['tao','sword'],
  '力系':   ['force','fist'],
  '暗系':   ['shadow','qimen'],
  '毒系':   ['poison','shadow'],
  '冰系':   ['ice'],
  '火系':   ['fire'],
  '雷系':   ['thunder','force'],
  '风系':   ['wind','sword'],
  '圣系':   ['holy'],
  '通用':   [],           // 通用系任何武器都算匹配
  '拳系':   ['fist','force'],
  '奇门系': ['qimen','shadow'],
  '琴系':   ['music'],
  '命系':   ['fate','qimen'],
};

/**
 * 检查角色当前武器与技能是否匹配
 * @returns {string} 'perfect' | 'match' | 'mismatch' | 'any'
 *   perfect  = 武器schools完全包含技能school（最佳匹配）
 *   match    = 部分匹配（武器schools有交集）
 *   mismatch = 不匹配
 *   any      = 通用系，任何武器都行
 */
function checkWepSkillMatch(charId, skSchool){
  if(!skSchool || skSchool==='通用') return 'any';
  const wep = getCharWeapon(charId);
  if(!wep || !wep.schools || wep.schools.length===0) return 'mismatch';
  const required = SCHOOL_TO_WEP[skSchool] || [];
  if(required.length===0) return 'any';
  // 检查武器schools和required是否有交集
  const hasMatch = required.some(r => wep.schools.includes(r));
  if(!hasMatch) return 'mismatch';
  // 检查是否完美匹配（武器schools包含所有required）
  const perfect = required.every(r => wep.schools.includes(r));
  return perfect ? 'perfect' : 'match';
}

// 技能适配加成/减益倍率
const WEP_SKILL_MULT = {
  perfect:  1.25,   // 完美匹配：+25%伤害
  match:    1.10,   // 部分匹配：+10%伤害
  any:      1.0,    // 通用：无加减
  mismatch: 0.65,   // 不匹配：-35%伤害
};
const WEP_SKILL_TIP = {
  perfect:  { icon:'⚔✨', text:'趁手神兵，威力大增！', cls:'lh' },
  match:    { icon:'⚔',   text:'武器相合，略有加持', cls:'ls' },
  any:      { icon:'',    text:'', cls:'' },
  mismatch: { icon:'⚠',  text:'武器与技能不合，威力大减！', cls:'lm' },
};

// ════════════════════════════════════════════════
//  武器志渲染
// ════════════════════════════════════════════════
let _wepFilter='all';
// ════════════════════════════════════════════════
//  江湖世界 · 城镇坐标节点系统
//  坐标系：x=东西（正东+），y=南北（正南+）
//  单位：里（1格≈1天路程）
//  每个节点含 roads:{N,S,E,W} 记录相邻节点ID及距离
// ════════════════════════════════════════════════

// ────────────────────────────────────────────────
//  地点 ASCII 场景图库
//  按 sceneKey 索引，也可按 node.type/tier/terrain 自动选取
// ────────────────────────────────────────────────
