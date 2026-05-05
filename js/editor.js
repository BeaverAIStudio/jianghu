const ED_COLORS=['#40b0ff','#f04040','#f0c060','#40d070','#c080f0','#ff8040','#ff88cc','#80e0e0','#ffffff','#e8d5a3','#88ff44','#ffee44','#ff6688','#44ffcc','#ff9900','#aaddff'];

const ED_PARTS={
  head:[
    {l:'圆头',v:`  (O)  `},{l:'方头',v:`  [O]  `},{l:'斗笠',v:` ∩∩∩\n  (O) `},
    {l:'武僧',v:`╭(◎)╮\n南无`},{l:'道士',v:` ☯(O)☯`},{l:'帽+胡',v:` ∧\n(◕_◕)`},
    {l:'骷髅',v:`  (☠)  `},{l:'鬼脸',v:` (⊙_⊙) `},{l:'笑脸',v:` (◡◡◡) `},
    {l:'凶相',v:` (>▿<)  `},{l:'傲娇',v:` (¬_¬)  `},{l:'王者盔',v:` ╔[O]╗`},
    {l:'龙头',v:`龙(O)龙`},{l:'魔王',v:`▼(O)▼`},{l:'猫耳',v:`∧_∧\n(O_O)`},
    {l:'长发',v:` ≋≋≋\n (O) `},
    // ★ 新增扩展（追加在末尾，保持原始索引 0-15 不变）
    // ══ 武人/特色 ══
    {l:'斗笠+发',v:` ≋∩∩∩\n  (O) `},                            // 斗笠长发客
    {l:'玉冠',v:` ╔═╗\n (⊙) `},                               // 玉冠高人
    {l:'僧帽',v:` ▓▓▓\n(◎▓◎)`},                               // 僧帽遮顶
    {l:'牛角',v:`╱◢◣╲\n (▓▓) `},                              // 牛角战士
    {l:'羽冠',v:` ≋≋≋\n (⊙) `},                               // 羽冠王族
    {l:'兜鍪',v:` ╔█╗\n [O] `},                               // 武将头盔
    {l:'狐面',v:`∧ ∧\n(◠◠)`},                                   // 狐媚面具
    {l:'鹿角',v:`╭╮╭╮\n (◯) `},                               // 鹿角隐者
    // ══ 女性/侠女 ══
    {l:'盘发',v:` ╭∩∩╮\n (◯) `},                               // 盘发少妇
    {l:'蝴蝶',v:` ≋≋≋\n (◕) `},                               // 蝴蝶发饰
    {l:'银簪',v:` ╱│╲\n (⊙) `},                               // 银簪贵妇
    {l:'短髮',v:` ╥╥\n (O) `},                                // 短发干练
    // ══ 鬼怪/特殊 ══
    {l:'厉鬼',v:` ▓▓▓\n (⊙▿⊙) `},                              // 厉鬼面具
    {l:'白骨',v:` ══\n (██) `},                                // 白骨精
    {l:'蛊童',v:` ≋≋≋\n (◉◉) `},                              // 蛊术童子
    {l:'花魁',v:` ≋≋≋\n (◠◡) `},                               // 花魁头饰
    {l:'佛面',v:` ◉◉◉\n  ◠  `},                                  // 佛面金身
    {l:'儒冠',v:` ╔══╗\n [◯] `},                               // 儒冠书生
    {l:'术冠',v:` ╔⊙╗\n (◎) `},                                // 术士符冠
    {l:'圣光',v:` ✦✦✦\n ( ◠ ) `},                              // 圣者光圈
  ],
  body:[
    // ── 基础体型，每种有加有减，总增益基本平衡 ──
    // bonus: {hp, atk, def, crit, dodge, mp, spd}  正=加，负=减
    // ★ 躯干改为两行（上半：胸甲，下半：腰带/下摆），人物显得更高
    {l:'侠客',v:`┤▎▏├\n└──┘`, bonus:{atk:5, dodge:3, def:-3, mp:-15}},       // 攻闪型：劲衫+束腰
    {l:'宽体',v:`█▓▓█\n▀▀▀▀`, bonus:{hp:30, def:5, spd:-2, dodge:-3}},        // 血防型：厚甲+下摆
    {l:'细长',v:`║·║\n╙─╜`, bonus:{mp:30, spd:2, hp:-20, def:-2}},             // 内力型：空灵+细腰
    {l:'魁梧',v:`▓██▓\n████`, bonus:{hp:35, atk:6, def:3, spd:-3, dodge:-4}},  // 力量型：实心+宽腰
    {l:'轻盈',v:`╎  ╎\n╎  ╎`, bonus:{dodge:7, spd:3, hp:-25, def:-4}},          // 速闪型：纤细两行
    {l:'弓腰',v:`╭──╮\n╰──╯`, bonus:{mp:35, crit:4, spd:-2, atk:-3}},           // 内功型：弧身收腰
    {l:'裸背',v:`≋▓▓≋\n▓──▓`, bonus:{atk:10, crit:3, def:-5, mp:-20}},         // 蛮力型：肌肉+腰带
    {l:'斗篷',v:`▌██▐\n▌▄▄▐`, bonus:{def:7, hp:20, spd:-2, crit:-3}},           // 防御型：斗篷下摆
    {l:'披风',v:`◈▎▏◈\n◈──◈`, bonus:{spd:3, dodge:3, mp:15, hp:-20, atk:-3}},  // 游侠型：披风展开
    {l:'锁甲',v:`▦▦▦▦\n▦▦▦▦`, bonus:{def:10, hp:25, spd:-3, dodge:-5, mp:-20}},// 重甲型：满甲两排
    {l:'羽衣',v:`❮羽❯\n❮衣❯`, bonus:{dodge:5, crit:4, spd:2, hp:-20, def:-4}},  // 轻灵型：羽衣两段
    {l:'仙气',v:`✦·✦\n·✦·`, bonus:{mp:45, crit:5, hp:-15, atk:-4, def:-3}},    // 仙体型：浮光散影
    {l:'巨汉',v:`▐███▌\n▐███▌`,bonus:{hp:50, atk:8, def:4, spd:-4, dodge:-6, mp:-20}}, // 霸体型：超宽两行
    {l:'流浪',v:`≈  ≈\n─  ─`, bonus:{spd:4, dodge:4, crit:2, hp:-15, def:-3, mp:-10}},  // 流浪型：破衫飘荡
    {l:'书生',v:`│书│\n│卷│`, bonus:{mp:30, crit:6, atk:-4, def:-3, hp:-10}},    // 文士型：儒衫竖排
    {l:'裸甲',v:`⊟▦▦⊟\n⊟▦▦⊟`, bonus:{def:6, atk:5, hp:15, spd:-2, dodge:-3, mp:-15}},  // 甲战型：甲片两排
    // ★ 新增扩展设计（追加在末尾，保持原始索引不变）
    // ══ 武侠/江湖系 ══
    {l:'劲装',v:`╠▎▏╣\n╠══╣`,bonus:{atk:6,spd:2,def:2,hp:-10,dodge:-2}},                // 紧身武服
    {l:'袍袖',v:`╭▎▏╮\n╰───╯`,bonus:{mp:20,crit:4,dodge:2,atk:-4,def:-2}},             // 宽袍大袖
    {l:'锦衣',v:`╔▎▏╗\n║丝║`,bonus:{hp:10,atk:3,def:2,mp:10,crit:3,spd:-2}},           // 锦绣华服
    {l:'墨染',v:`│▒▒│\n╰──╯`,bonus:{mp:25,crit:5,atk:-5,def:-3,hp:-10}},                 // 文人墨客
    // ══ 盔甲系 ══
    {l:'鳞甲',v:`≋▦▦≋\n≋▦▦≋`,bonus:{def:8,hp:35,spd:-4,dodge:-4,mp:-25}},               // 龙鳞护甲
    {l:'皮甲',v:`╓▒▒╖\n║皮║`,bonus:{def:5,hp:15,spd:1,dodge:2,atk:-2,mp:-5}},           // 皮革轻甲
    {l:'板甲',v:`╔▓▓╗\n╚▓▓╝`,bonus:{def:12,hp:30,spd:-4,dodge:-5,mp:-25}},             // 钢铁板甲
    // ══ 轻盈/敏捷系 ══
    {l:'羽衣',v:`╭羽╮\n╰羽╯`,bonus:{dodge:5,crit:4,spd:2,hp:-20,def:-4}},            // 轻灵羽衣
    // ══ 法系/特殊 ══
    {l:'仙气',v:`✦▎▏✦\n╰·─╯`,bonus:{mp:45,crit:5,hp:-15,atk:-4,def:-3}},               // 仙风道骨
    {l:'道袍',v:`╭☯▏╮\n╰══╯`,bonus:{mp:40,def:2,crit:3,hp:-15,atk:-5,spd:2}},          // 道法自然
    {l:'僧衣',v:`╭██╮\n╰袈╯`,bonus:{def:6,hp:20,mp:10,spd:1,crit:-3,atk:-3}},          // 少林僧衣
    {l:'魔袍',v:`▓▎▏▓\n▓▔▔▓`,bonus:{hp:15,atk:5,crit:4,mp:-10,def:-4}},                // 魔教黑袍
    {l:'霓裳',v:`≋羽≋\n≋≋≋`,bonus:{dodge:6,crit:6,spd:3,hp:-25,def:-6,mp:15}},     // 华丽霓裳
    {l:'暗卫',v:`█▏▎█\n█╬▬█`,bonus:{def:4,hp:20,atk:5,dodge:3,spd:1}},            // 暗卫紧身
    {l:'战姬',v:`╠═▏╣\n║丝║`,bonus:{def:3,hp:15,crit:8,dodge:4,atk:3,spd:2,mp:-10}},   // 女战姬风格
    {l:'隐侠',v:`│░░│\n╰──╯`,bonus:{dodge:8,spd:4,crit:3,hp:-20,def:-5,atk:2}},       // 隐逸侠客
    {l:'术士',v:`╭⊙▏╮\n╰符╯`,bonus:{mp:50,crit:3,def:-2,hp:-15,atk:-8}},              // 术法道袍
    {l:'散人',v:`≈  ≈\n─  ─`,bonus:{spd:4,dodge:4,crit:2,hp:-15,def:-3,mp:-10}},  // 江湖散人
    // ══ 特色 ══
    {l:'蛮兽',v:`▓▎█▓\n█▓▓█`,bonus:{hp:40,atk:10,def:5,spd:-5,dodge:-6,mp:-25}},   // 兽化战士
    {l:'书生',v:`│▒▒│\n│▓▓│`,bonus:{mp:30,crit:6,atk:-4,def:-3,hp:-10}},              // 书生卷轴
    {l:'侠盗',v:`╱▎▏╲\n╲──╱`,bonus:{dodge:6,crit:5,spd:3,atk:3,def:-4,mp:-5}},         // 侠盗夜行
  ],
  arms:[
    // ★ 手臂：9字符宽，lv=左臂（2字符），rv=右臂（2字符），与5字符躯干配合
    // ══ 空手系 ══
    {l:'空手',  v:`╱     ╲`,    lv:`╱ `,     rv:` ╲`},              // 徒手
    {l:'铁拳',  v:`█╱   ╲█`,    lv:`█╱`,     rv:`╲█`},              // 铁拳套
    {l:'指虎',  v:`╔╱   ╲╗`,    lv:`╔╱`,     rv:`╲╗`},              // 指虎护拳
    {l:'臂盾',  v:`▓╱   ╲▓`,    lv:`▓╱`,     rv:`╲▓`},              // 小臂盾
    // ══ 剑系 ══
    {l:'长剑',  v:`╱     ╲⚔`,  lv:`╱ `,     rv:` ╲⚔`},            // 单剑斜挎
    {l:'双剑',  v:`⚔╱   ╲⚔`,   lv:`⚔╱`,    rv:`╲⚔`},              // 双剑交叉
    {l:'匕首',  v:`╱───╲匕`,    lv:`╱ `,     rv:` ╲匕`},            // 短匕横握
    {l:'背剑',  v:`╱     ╲`,    lv:`╱│`,     rv:`│╲`},              // 背剑（肩后）
    {l:'剑舞',  v:`⚔╱   ⚔╲`,  lv:`⚔╱`,    rv:`⚔╲`},              // 剑指双持
    // ══ 刀系 ══
    {l:'单刀',  v:`╱     ╲刀`,  lv:`╱ `,     rv:` ╲刀`},           // 单刀
    {l:'双刀',  v:`刀╱   ╲刀`,  lv:`刀╱`,    rv:`╲刀`},             // 双刀
    {l:'弯刀',  v:`╱     ╲⌒`,   lv:`╱ `,     rv:` ╲⌒`},            // 弯刀
    // ══ 长柄武器 ══
    {l:'长枪',  v:`│╱    ╲`,    lv:`│╱`,     rv:` ╲`},              // 长枪
    {l:'禅杖',  v:`╱     ╲│`,   lv:`╱ `,     rv:` ╲│`},            // 禅杖
    {l:'棍棒',  v:`╱     ╲▌`,   lv:`╱ `,     rv:` ╲▌`},            // 棍棒
    {l:'狼牙棒',v:`╱     ╲▓`,   lv:`╱ `,     rv:` ╲▓`},            // 狼牙棒
    {l:'月牙',  v:`╱     ╲◢`,   lv:`╱ `,     rv:` ╲◢`},            // 月牙戟
    // ══ 远程 ══
    {l:'弓箭',  v:`╱(/🏹)\\  `,  lv:`╱(`,    rv:`/🏹)\ `},           // 弓箭（朝向右侧）
    {l:'飞镖',  v:`╱     ╲✦`,   lv:`╱ `,     rv:` ╲✦`},            // 飞镖
    {l:'暗器',  v:`╱     ╲✧`,   lv:`╱ `,     rv:` ╲✧`},            // 暗器袋
    // ══ 法器/特殊 ══
    {l:'拂尘',  v:`╱～   ╲～`,   lv:`╱～`,    rv:`╲～`},             // 拂尘
    {l:'法杖',  v:`╱     ╲⊙`,   lv:`╱ `,     rv:` ╲⊙`},            // 法杖
    {l:'折扇',  v:`╱     ╲扇`,  lv:`╱ `,     rv:` ╲扇`},            // 折扇
    {l:'双节',  v:`╱     ╲≋`,   lv:`╱ `,     rv:` ╲≋`},            // 双节棍
    {l:'钩镰',  v:`╱     ╲⌣`,   lv:`╱ `,     rv:` ╲⌣`},            // 钩镰
    {l:'毒针',  v:`╱     ╲·`,   lv:`╱ `,     rv:` ╲·`},            // 毒针
    {l:'书卷',  v:`╱     ╲║`,   lv:`╱ `,     rv:` ╲║`},            // 书卷
    {l:'火焰',  v:`🔥╱   ╲🔥`,  lv:`🔥╱`,    rv:`╲🔥`},            // 掌火
    {l:'冰霜',  v:`❄╱   ╲❄`,   lv:`❄╱`,    rv:`╲❄`},              // 掌冰
    {l:'雷电',  v:`⚡╱   ╲⚡`,   lv:`⚡╱`,    rv:`╲⚡`},              // 掌雷
    {l:'锁链',  v:`╱≋≋≋≋╲`,    lv:`╱≋`,     rv:`≋╲`},              // 锁链飞爪

    {l:'持箫', v:`╱     ╲‖`,   lv:`╱ `,     rv:` ‖`},              // 箫/笛竖持（碧玉箫、竹箫）
  ],
  legs:[
    // ★ 腿部两行，每行5字符：上行=大腿，下行=脚步/姿态
    {l:'马步',v:`║  ║\n╱─╲`},                                        // 标准马步
    {l:'丁字',v:`│  │\n╱─  `},                                     // 丁字步立
    {l:'弓步',v:`│  │\n╱   ╲`},                                  // 弓字前冲
    {l:'御剑',v:`║  ║\n╱剑╲`},                                    // 御剑而立
    {l:'铁马',v:`║  ║\n╔╝╚╗`},                                    // 铁马桩步
    {l:'站桩',v:`█▌ ▐█\n██▀▀██`},                           // 金刚站桩
    // ══ 轻盈身法 ══
    {l:'飞奔',v:` ╱  ╲\n─╱─╲`},                                   // 飞奔疾走
    {l:'蜻蜓',v:`╱  ╲\n ╱╲ `},                                   // 蜻蜓点水
    {l:'蛇行',v:` ≋ ≋ \n～步～`},                              // 蛇形步法
    {l:'落叶',v:`╱  ╲\n～──～`},                                  // 落叶飘零
    {l:'踏雪',v:`╱  ╲\n ☽☽`},                                   // 踏雪无痕
    {l:'腾云',v:`↑  ↑\n ↑↑ `},                                   // 腾云驾雾
    // ══ 盘坐/静止 ══
    {l:'盘腿',v:`╭∩∩╮\n(🧘)`},                                    // 盘腿打坐
    {l:'莲花',v:`╭∩∩╮\n🌸_🌸`},                                 // 莲花坐姿
    {l:'跪坐',v:`╭──╮\n(━━)`},                                   // 跪坐礼仪
    {l:'静立',v:`│  │\n└┬┘`},                                    // 静立调息
    {l:'倚栏',v:`│  │\n╲  ╱`},                                   // 倚栏远眺
    // ══ 动态姿势 ══
    {l:'虎步',v:`║  ║\n虎╱╲虎`},                              // 猛虎下山
    {l:'踢腿',v:`│  ╱\n ╱─╮`},                                   // 侧踢飞腿
    {l:'后踢',v:`╱  ╲\n ╲╱`},                                    // 后踢回旋
    {l:'下蹲',v:`╱  ╲\n╯━━╰`},                                   // 蹲防姿态
    {l:'跃起',v:`  ↑  \n ↑↑↑ `},                              // 跃起腾空
    // ══ 特色风格 ══
    {l:'仙踪',v:`≋  ≋\n～──～`},                               // 仙人步法
    {l:'侠影',v:`╱  ╲\n╲  ╱`},                                   // 侠客掠影
    {l:'鬼魅',v:`∕  ∖\n ∕ ∖`},                                   // 鬼魅飘忽
    {l:'战姿',v:`█▌ ▐█\n▓▓▓▓`},                               // 战斗站姿
    {l:'凌波',v:`≋≋≋\n≋≋≋`},                                      // 凌波微步
  ],
  aura:[
    // ★ 气场：单行或双行，9-11字符宽，装饰头顶
    // achId = 对应成就ID，为空则自由选择
    // ══ 无/轻量（基础·自由选）══════════════
    {l:'无',     v:``},                                              // 无气场
    {l:'淡淡光', v:`·  ·  ·`},                                       // 微光环绕
    {l:'灵气',   v:`✦   ✦`},                                         // 灵气浮动
    // ══ 威名/霸气（成就解锁）═══════════════
    {l:'天下无敌',v:`—天下无敌—`,  achId:'ach_win_100'},               // 天下无敌·百战成就
    {l:'杀气腾腾',v:`≋≋杀气≋≋`,  achId:'ach_win_50'},                 // 杀气外露·50战
    {l:'王者气', v:`╔王╗`,       achId:'ach_win_500'},               // 王者霸气·千人斩
    {l:'皇者气', v:`◇◇皇◇◇`,     achId:'ach_fame_1000'},             // 皇者气度·声望千
    // ══ 佛道系（成就解锁）═════════════════
    {l:'南无佛', v:`南无阿弥陀佛`, achId:'ach_sect_shaolin'},         // 佛号光环·少林
    {l:'道法自然',v:`·道法自然·`,  achId:'ach_sect_wudang'},         // 道法自然·武当
    {l:'太极',   v:`☯   ☯`,      achId:'ach_sect_wudang'},         // 太极光环·武当
    {l:'金刚',   v:`═════\n金刚护体`, achId:'ach_sect_shaolin'},     // 金刚护体·少林
    {l:'罗汉',   v:`◉   ◉`,      achId:'ach_sect_shaolin'},         // 罗汉金身·少林
    // ══ 武侠/剑意（成就解锁）═══════════════
    {l:'剑气纵横',v:`──剑气──`,    achId:'ach_win_50'},                // 剑气外放
    {l:'剑意',   v:`……剑……`,     achId:'ach_learn_skill_10'},        // 剑意凝聚·10技能
    {l:'刀意',   v:`≋≋刀≋≋`,     achId:'ach_learn_skill_10'},        // 刀意凌厉
    {l:'拳意',   v:`◆◆拳◆◆`,     achId:'ach_learn_skill_10'},        // 拳意如山
    // ══ 元素系（成就解锁）═════════════════
    {l:'烈焰',   v:`🔥~~~🔥`,     achId:'ach_dungeon_fire'},          // 烈焰缠绕·火系地下城
    {l:'火焰环', v:`╱🔥🔥🔥╲\n ╚═════╝`, achId:'ach_dungeon_fire'},    // 火环护体
    {l:'冰封',   v:`❄❄❄❄`,       achId:'ach_dungeon_ice'},           // 冰霜笼罩·冰系地下城
    {l:'冰晶',   v:`╱❄❄❄❄╲\n ╚═════╝`, achId:'ach_dungeon_ice'},    // 冰晶结界
    {l:'雷霆',   v:`⚡⚡⚡⚡`,     achId:'ach_dungeon_elite'},         // 雷霆万钧·精英猎手
    {l:'雷环',   v:`╱⚡⚡⚡⚡╲\n ╚═════╝`, achId:'ach_dungeon_elite'},  // 雷环护身
    // ══ 毒/蛊（成就解锁）═══════════════════
    {l:'万毒',   v:`🐍毒🐍`,       achId:'ach_sect_wudu'},            // 万毒弥漫·五毒
    {l:'蛊虫',   v:`◉蛊◉`,       achId:'ach_sect_wudu'},            // 蛊虫护体·五毒
    // ══ 仙魔（成就解锁）════════════════════
    {l:'仙云',   v:`☁✦✦✦☁`,     achId:'ach_dungeon_30'},            // 仙云缭绕·地底之王
    {l:'霓光',   v:`≋≋≋≋≋\n 霓 ✦ 羽`,   achId:'ach_quest_50'},         // 霓裳羽衣·义薄云天
    {l:'魔气',   v:`▓▓魔▓▓`,     achId:'ach_sect_mojiao'},           // 魔气笼罩·明教
    {l:'血气',   v:`·血血血·`,    achId:'ach_no_death_dungeon'},      // 血气方刚·完美探险
    {l:'魔焰',   v:`▓▓▓▓▓\n▓魔▓魔▓`,     achId:'ach_kill_boss'},         // 魔焰缠身·弑君者
    {l:'妖气',   v:`≋≋妖≋≋\n≋  ～  ≋`,   achId:'ach_all_t1_dungeons'}, // 妖气弥漫·踏遍初土
    // ══ 特殊（成就解锁）════════════════════
    {l:'哈哈',   v:`哈哈哈哈`,     achId:'ach_gift_50'},               // 哈哈护体·仗义疏财
    {l:'符文',   v:`✧✦✧✦✧`,     achId:'ach_combo_3'},               // 符文护身·连招新手
    {l:'棋局',   v:`╔═╦═╗\n║棋║`,        achId:'ach_minigame_chess_10'}, // 棋局天下·棋社10胜
    {l:'药香',   v:`☘ ☘ ☘`,     achId:'ach_quest_10'},              // 药香四溢·信守承诺
    // ══ 武侠/兵器意境（新·成就解锁）═══════════════
    {l:'掌风',   v:`≋≋掌≋≋`,     achId:'ach_learn_manual_20'},        // 掌风凌厉·武学宗师
    {l:'腿风',   v:`～～腿～～`,    achId:'ach_learn_manual_20'},        // 腿风如风·武学宗师
    {l:'枪意',   v:`││枪││`,     achId:'ach_learn_skill_10'},        // 枪意如龙·10技能
    // ══ 五行属性（新·成就解锁）═════════════════
    {l:'金气',   v:`◆◆金◆◆`,     achId:'ach_collect_item_30'},        // 金气锐利·收藏达人
    {l:'木气',   v:`☘☘木☘☘`,     achId:'ach_collect_item_30'},        // 木气生机·收藏达人
    {l:'水气',   v:`≋≋水≋≋`,     achId:'ach_dungeon_water'},        // 水气灵动·碧波行者
    {l:'火气',   v:`🔥🔥火🔥🔥`,    achId:'ach_dungeon_fire'},         // 火气炽热·烈焰行者
    {l:'土气',   v:`▓▓土▓▓`,     achId:'ach_collect_item_30'},        // 土气厚重·收藏达人
    // ══ 地域特色（新·成就解锁）═════════════════
    {l:'沙暴',   v:`⌒⌒沙⌒⌒`,     achId:'ach_travel_all'},           // 西域沙暴·走遍天下
    {l:'蛊毒',   v:`◉蛊◉◉`,      achId:'ach_sect_wudu'},            // 蛊毒弥漫·五毒弟子（补充蛊虫）
    {l:'海浪',   v:`≋≋≋≋≋\n～海～`,  achId:'ach_dungeon_water'},     // 东海海浪·碧波行者
    {l:'雪雾',   v:`❄❄雪❄❄`,     achId:'ach_dungeon_ice'},          // 北疆雪雾·冰霜旅人
    // ══ 江湖意境（新·成就解锁）═════════════════
    {l:'酒气',   v:`酒～酒～`,     achId:'ach_gift_10'},              // 酒气豪迈·仗义疏财
    {l:'孤影',   v:`╱  ╲\n ╱  ╲`,  achId:'ach_no_damage_win'},        // 孤影侠踪·毫发无伤
    {l:'杀气',   v:`▓▓杀▓▓`,     achId:'ach_win_50'},              // 杀气毕露·锋芒初露（补杀气腾腾）
    {l:'狂气',   v:`狂≋≋≋狂`,     achId:'ach_win_streak_10'},        // 狂气爆发·连胜达人
    // ══ 神话/灵兽（新·成就解锁）═════════════════
    {l:'龙气',   v:`龙◆◆龙`,      achId:'ach_kill_elite'},           // 龙气护体·精英猎手
    {l:'龙吟',   v:`╭龙龙龙╮\n～龙～`,  achId:'ach_pvp_win_20'},         // 龙吟九天·擂台霸主
    {l:'凤羽',   v:`凤≋≋≋凤`,     achId:'ach_kill_boss'},           // 凤羽飘舞·弑君者
    {l:'虎威',   v:`虎▓▓虎`,      achId:'ach_kill_elite'},           // 虎威凛凛·精英猎手
    {l:'麒麟',   v:`◇麟◇麟◇`,     achId:'ach_win_500'},            // 麒麟祥瑞·千人斩
    // ══ 自然/天气（新·成就解锁）═════════════════
    {l:'疾风',   v:`～疾风～`,     achId:'ach_dungeon_wind'},         // 疾风掠影·风之旅人
    {l:'风刃',   v:`╱风╲风╱`,     achId:'ach_dungeon_wind'},         // 风刃无形·风之旅人
    {l:'毒雾',   v:`☠毒☠☠`,      achId:'ach_dungeon_poison'},        // 毒雾缭绕·毒行天下
    {l:'毒息',   v:`蛇蛇毒蛇`,     achId:'ach_dungeon_poison'},        // 毒息内敛·毒行天下
    {l:'神工',   v:`⚒神工⚒`,     achId:'ach_craft_epic'},          // 神工鬼斧·锻造宗师
    {l:'碧波',   v:`≋碧波≋\n≋≋≋≋`,  achId:'ach_dungeon_water'},       // 碧波荡漾·碧波行者
  ],
};

const PART_META=[
  {key:'head',label:'头部造型',icon:'👤'},
  {key:'body',label:'身体/服装',icon:'🧥'},
  {key:'arms',label:'手臂/武器',icon:'🤜'},
  {key:'legs',label:'腿部/步伐',icon:'🦵'},
  {key:'aura',label:'气场/装饰',icon:'✨'},
];

// ══════════════════════════════════════════════════════════════════════════
//  头像框数据库（成就奖励）
//  css:  CSS border + box-shadow 样式
//  achId: 解锁所需的成就ID，为空则默认解锁
// ══════════════════════════════════════════════════════════════════════════
const FRAME_DB = {
  frame_none: {
    id:'frame_none', name:'默认', label:'无边框',
    rarity:'common', achId:null,
    css:``
  },
  // ── 普通/精良 ═─
  frame_blue: {
    id:'frame_blue', name:'蓝色光晕', label:'蓝色光晕',
    rarity:'common', achId:'ach_first_win',
    css:`border:2px solid #40b0ff;box-shadow:0 0 12px rgba(64,176,255,.5),inset 0 0 8px rgba(64,176,255,.2);`
  },
  frame_red: {
    id:'frame_red', name:'血色光环', label:'血色光环',
    rarity:'common', achId:'ach_win_10',
    css:`border:2px solid #f04040;box-shadow:0 0 12px rgba(240,64,64,.5),inset 0 0 8px rgba(240,64,64,.2);`
  },
  frame_green: {
    id:'frame_green', name:'翠绿边框', label:'翠绿边框',
    rarity:'common', achId:'ach_first_dungeon',
    css:`border:2px solid #40d070;box-shadow:0 0 10px rgba(64,208,112,.4),inset 0 0 6px rgba(64,208,112,.15);`
  },
  // ── 稀有 ═─
  frame_purple: {
    id:'frame_purple', name:'紫晶边框', label:'紫晶边框',
    rarity:'rare', achId:'ach_win_50',
    css:`border:2px solid #c060ff;box-shadow:0 0 16px rgba(192,96,255,.6),0 0 32px rgba(192,96,255,.3),inset 0 0 12px rgba(192,96,255,.2);`
  },
  frame_gold: {
    id:'frame_gold', name:'黄金边框', label:'黄金边框',
    rarity:'rare', achId:'ach_quest_10',
    css:`border:2px solid #ffd060;box-shadow:0 0 16px rgba(255,208,96,.7),0 0 32px rgba(255,208,96,.35),inset 0 0 12px rgba(255,208,96,.25);`
  },
  frame_orange: {
    id:'frame_orange', name:'烈焰边框', label:'烈焰边框',
    rarity:'rare', achId:'ach_dungeon_fire',
    css:`border:2px solid #ff8040;box-shadow:0 0 16px rgba(255,128,64,.6),0 0 32px rgba(255,64,0,.3),inset 0 0 10px rgba(255,64,0,.2);`
  },
  frame_ice: {
    id:'frame_ice', name:'寒冰边框', label:'寒冰边框',
    rarity:'rare', achId:'ach_dungeon_ice',
    css:`border:2px solid #88ddff;box-shadow:0 0 16px rgba(136,221,255,.6),0 0 32px rgba(100,180,255,.3),inset 0 0 10px rgba(136,221,255,.2);`
  },
  // ── 史诗 ═─
  frame_legendary: {
    id:'frame_legendary', name:'传奇边框', label:'传奇边框',
    rarity:'epic', achId:'ach_win_100',
    css:`border:2px solid #ffd060;box-shadow:0 0 20px rgba(255,208,96,.8),0 0 40px rgba(255,160,0,.5),0 0 60px rgba(255,80,0,.25),inset 0 0 16px rgba(255,208,96,.3);`
  },
  frame_dark: {
    id:'frame_dark', name:'暗影边框', label:'暗影边框',
    rarity:'epic', achId:'ach_sect_mojiao',
    css:`border:2px solid #8060c0;box-shadow:0 0 20px rgba(128,96,192,.7),0 0 40px rgba(80,40,160,.4),inset 0 0 16px rgba(80,40,160,.3);`
  },
  frame_shaolin: {
    id:'frame_shaolin', name:'金刚边框', label:'金刚边框',
    rarity:'epic', achId:'ach_sect_shaolin',
    css:`border:3px solid #f0c060;box-shadow:0 0 20px rgba(240,192,96,.8),0 0 40px rgba(200,140,40,.5),inset 0 0 16px rgba(240,192,96,.3);`
  },
  // ── 传说/神话 ═─
  frame_mythic: {
    id:'frame_mythic', name:'神话边框', label:'神话边框',
    rarity:'legendary', achId:'ach_win_500',
    css:`border:3px solid #ff6040;box-shadow:0 0 24px rgba(255,96,64,.9),0 0 48px rgba(255,40,0,.6),0 0 72px rgba(200,0,0,.3),inset 0 0 20px rgba(255,96,64,.4);`
  },
  frame_hero: {
    id:'frame_hero', name:'大侠边框', label:'大侠边框',
    rarity:'mythic', achId:'ach_fame_1000',
    css:`border:3px double #ffd060;box-shadow:0 0 28px rgba(255,208,96,1),0 0 56px rgba(255,180,0,.7),0 0 84px rgba(255,120,0,.35),inset 0 0 24px rgba(255,208,96,.5);`
  },
  frame_dragon: {
    id:'frame_dragon', name:'龙纹边框', label:'龙纹边框',
    rarity:'mythic', achId:'ach_all_t1_dungeons',
    css:`border:3px double #40d070;box-shadow:0 0 28px rgba(64,208,112,1),0 0 56px rgba(40,160,80,.7),0 0 84px rgba(0,120,60,.35),inset 0 0 24px rgba(64,208,112,.5);`
  },
};

// ── 解锁检测 ──────────────────────────────────────────────────────────────
function edIsFrameUnlocked(frameId){
  if(frameId === 'frame_none') return true;
  const f = FRAME_DB[frameId];
  if(!f) return false;
  if(!f.achId) return true;
  // achievements.js 可能未加载（battle页面），保守返回true（已装备就显示）
  try{ return achState.unlocked.includes(f.achId); } catch(e){ return true; }
}
function edIsTitleUnlocked(titleId){
  if(titleId === 'title_none') return true;
  const t = TITLE_PLATE_DB[titleId];
  if(!t) return false;
  if(!t.achId) return true;
  try{ return achState.unlocked.includes(t.achId); } catch(e){ return true; }
}
function edIsAuraUnlocked(auraIdx){
  const a = ED_PARTS.aura[auraIdx];
  if(!a || !a.achId) return true;
  try{ return achState.unlocked.includes(a.achId); } catch(e){ return true; }
}

// ══════════════════════════════════════════════════════════════════════════
//  称号牌数据库（成就奖励）
//  title:  显示文字
//  color:  文字颜色
//  achId:  解锁所需成就ID
// ══════════════════════════════════════════════════════════════════════════
const TITLE_PLATE_DB = {
  title_none: {
    id:'title_none', name:'无', label:'无称号',
    rarity:'common', achId:null,
    title:'', color:''
  },
  title_tomb_explorer: {
    id:'title_tomb_explorer', name:'探墓者', label:'「探墓者」',
    rarity:'legendary', achId:'ach_all_t1_dungeons',
    title:'「探墓者」', color:'#c060ff'
  },
  title_battle_master: {
    id:'title_battle_master', name:'百战师', label:'「百战之师」',
    rarity:'epic', achId:'ach_win_100',
    title:'「百战之师」', color:'#f04040'
  },
  title_dungeon_king: {
    id:'title_dungeon_king', name:'地底王', label:'「地底之王」',
    rarity:'legendary', achId:'ach_dungeon_30',
    title:'「地底之王」', color:'#ffd060'
  },
  title_hero: {
    id:'title_hero', name:'大侠', label:'「一代大侠」',
    rarity:'mythic', achId:'ach_fame_1000',
    title:'「一代大侠」', color:'#ffe080'
  },
  title_wudang: {
    id:'title_wudang', name:'武当传人', label:'「武当传人」',
    rarity:'epic', achId:'ach_sect_wudang',
    title:'「武当传人」', color:'#80c0ff'
  },
  title_shaolin: {
    id:'title_shaolin', name:'少林高僧', label:'「少林高僧」',
    rarity:'epic', achId:'ach_sect_shaolin',
    title:'「少林高僧」', color:'#f0c060'
  },
  title_wudu: {
    id:'title_wudu', name:'蛊毒传人', label:'「蛊毒传人」',
    rarity:'rare', achId:'ach_sect_wudu',
    title:'「蛊毒传人」', color:'#60ff80'
  },
  title_mojiao: {
    id:'title_mojiao', name:'明教护法', label:'「明教护法」',
    rarity:'rare', achId:'ach_sect_mojiao',
    title:'「明教护法」', color:'#ff8040'
  },
  title_no_death: {
    id:'title_no_death', name:'无伤侠', label:'「完美探险」',
    rarity:'epic', achId:'ach_no_death_dungeon',
    title:'「完美探险」', color:'#40d0ff'
  },
  title_quest_master: {
    id:'title_quest_master', name:'义侠', label:'「义薄云天」',
    rarity:'rare', achId:'ach_quest_50',
    title:'「义薄云天」', color:'#c0a0e0'
  },
};

const edS={
  parts:{head:0,body:0,arms:0,legs:0,aura:0},
  custom:{head:'',body:'',arms:'',legs:'',aura:''},
  useCustom:{head:false,body:false,arms:false,legs:false,aura:false},
  color:'#f0c060',
  equippedFrame: 'frame_none',   // 当前装备的头像框ID
  equippedTitlePlate: 'title_none', // 当前装备的称号牌ID
  horseId: null,         // 当前坐骑马种key（如'normal'/'redrabbit'，null=无马步行）
  weaponInstId:  null,  // 当前装备的武器实例ID（来自背包）
  costumeInstId: null,  // 当前装备的服装实例ID（来自背包）
  cosOverlay:    {body:'',head:''},  // 服装外观叠加层（不替换默认体型）
  // 向下兼容：weaponId/costumeId 派生自实例（getter）
  get weaponId(){ const inst=bagFindInst(this.weaponInstId); return inst?.templateId||null; },
  get costumeId(){ const inst=bagFindInst(this.costumeInstId); return inst?.templateId||null; },
  armsLocked: false, // true=手动选了手臂，不跟武器自动切换
  bag: [],           // 背包：装备实例数组
  // ── 等级/经验（由 level-system.js 管理）──
  level:    1,       // 当前等级（1-150）
  totalExp: 0,       // 累计总经验值
  // ── 根骨加点（由 primary-stats.js 管理）──
  primaryPts: { vigor:0, tough:0, swift:0, inner:0, will:0 },
  freePoints: 0,     // 剩余未分配点数
  fate:       10,    // 气运（隐藏属性，1-20，创建时随机）
};
// 自定义角色已选技能ID列表（使用装备槽系统，战斗中可用）
// 现在从装备槽系统读取，不再直接维护
function getCpSkillIds() {
  return (typeof getEquippedSkills === 'function') ? getEquippedSkills() : [];
}
function setCpSkillIds(ids) {
  if (typeof saveEquippedSkills === 'function') {
    saveEquippedSkills(ids);
  }
}
// 兼容旧代码的变量（初始化时从装备槽加载）
let cpSkillIds = (typeof getEquippedSkills === 'function') ? getEquippedSkills() : ['cm01','cm02','cm03'];
let edBuilt=false;

function cap(k){return k.charAt(0).toUpperCase()+k.slice(1);}

function edBuild(){
  const get=k=>{
    if(edS.useCustom[k]&&edS.custom[k]) return edS.custom[k];
    return ED_PARTS[k][edS.parts[k]].v;
  };
  const lines=[];
  const aura=get('aura');
  if(aura) lines.push(aura);
  lines.push(get('head'));
  lines.push(get('body'));
  // 手臂：武器装备后自动对应，除非手动锁定
  let armsStr;
  if(!edS.armsLocked && edS.weaponId && !edS.useCustom.arms){
    const idx = getWepArmsIdx(edS.weaponId);
    if(idx !== null && ED_PARTS.arms[idx]){
      armsStr = ED_PARTS.arms[idx].v;
    }
  }
  if(!armsStr) armsStr = get('arms');
  lines.push(armsStr);
  lines.push(get('legs'));
  return lines.filter(l=>l!=='').join('\n');
}

function edGetAvatarState(src){
  const state = src || (typeof edS !== 'undefined' ? edS : {});
  const parts = { head:0, body:0, arms:0, legs:0, aura:0, ...(state.parts || {}) };
  const custom = { head:'', body:'', arms:'', legs:'', aura:'', ...(state.custom || {}) };
  const useCustom = { head:false, body:false, arms:false, legs:false, aura:false, ...(state.useCustom || {}) };
  const bag = Array.isArray(state.bag)
    ? state.bag
    : ((typeof edS !== 'undefined' && Array.isArray(edS.bag)) ? edS.bag : []);
  const weaponInstId = state.weaponInstId ?? null;
  let weaponId = state.weaponId ?? null;
  if(!weaponId && weaponInstId){
    const inst = bag.find(i => i && i.instId === weaponInstId);
    weaponId = inst?.templateId || null;
  }
  if(!weaponId && typeof edS !== 'undefined' && state === edS) weaponId = edS.weaponId || null;
  return {
    parts,
    custom,
    useCustom,
    armsLocked: !!state.armsLocked,
    weaponId,
  };
}

function edBuildStageAscii(src){
  if(typeof ED_PARTS === 'undefined') return '  👤  \n ╱│╲ \n  │  \n ╱ ╲ ';
  const state = edGetAvatarState(src);
  const getPart = k => (state.useCustom[k] && state.custom[k]) ? state.custom[k] : (ED_PARTS[k][state.parts[k]]?.v || '');
  const auraStr = getPart('aura');
  const headStr = getPart('head');
  const bodyStr = getPart('body');
  const legsStr = getPart('legs');
  let armsStr = getPart('arms');
  let armsIdx = (!state.useCustom.arms) ? state.parts.arms : null;
  if(!state.useCustom.arms && !state.armsLocked && state.weaponId && typeof getWepArmsIdx === 'function'){
    const idx = getWepArmsIdx(state.weaponId);
    if(idx !== null && ED_PARTS.arms[idx]){
      armsIdx = idx;
      armsStr = ED_PARTS.arms[idx].v;
    }
  }
  let armL = '', armR = '';
  if(!state.useCustom.arms && armsIdx !== null){
    const data = ED_PARTS.arms[armsIdx];
    if(data && data.lv !== undefined){
      armL = data.lv;
      armR = data.rv || '';
    }
  }
  if(!armL && !armR){
    const line = (armsStr || '').split('\n')[0];
    const chars = [...line];
    const mid = Math.ceil(chars.length / 2);
    armL = chars.slice(0, mid).join('');
    armR = chars.slice(mid).join('');
  }
  const lines = [];
  if(auraStr) lines.push(auraStr);
  lines.push(headStr);
  lines.push(`${armL}${bodyStr}${armR}`);
  lines.push(legsStr);
  return lines.filter(l => l !== '').join('\n') || '  👤  \n ╱│╲ \n  │  \n ╱ ╲ ';
}


function edStats(){
  // body bonus 永远从 parts.body 索引读，不受 useCustom.body（服装覆盖）影响
  // 穿服装只改变视觉（custom.body），不改变体型索引（parts.body）
  const bodyBonus = ED_PARTS.body[edS.parts.body]?.bonus || {};
  // ★ hp底盘 100→150：让裸装玩家能扛2-3刀，战斗延长到3-5轮，闪避/技能CD有意义
  const base = { hp:150, atk:15, def:10, crit:10, dodge:8, mp:100, spd:8 };
  // 叠加等级成长加成（level-system.js 提供）
  const lvBonus = (typeof getPlayerLevelBonus === 'function') ? getPlayerLevelBonus() : {};
  // 叠加根骨加点换算（primary-stats.js 提供）
  // ★ 出身天赋点 + 自由加点 均参与换算
  const allPts = { ...(edS.originPts || {}) };
  // 叠加自由加点（优先级更高，直接覆盖同名字段）
  if (edS.primaryPts) {
    for (const k of ['vigor','tough','swift','inner','will']) {
      if (edS.primaryPts[k]) allPts[k] = (allPts[k] || 0) + edS.primaryPts[k];
    }
  }
  const primaryBonus = (typeof calcPrimaryBonus === 'function')
    ? calcPrimaryBonus(allPts) : {};
  return {
    hp:   base.hp   + (bodyBonus.hp   || 0) + (lvBonus.hp  || 0) + (primaryBonus.hp  || 0),
    atk:  base.atk  + (bodyBonus.atk  || 0) + (lvBonus.atk || 0) + (primaryBonus.atk || 0),
    def:  base.def  + (bodyBonus.def  || 0) + (lvBonus.def || 0) + (primaryBonus.def || 0),
    // crit/dodge：body bonus直接是数值（%），primaryBonus也是%值
    crit: base.crit + (bodyBonus.crit || 0) + (primaryBonus.crit || 0),
    dodge:base.dodge+ (bodyBonus.dodge|| 0) + (primaryBonus.dodge|| 0),
    mp:   base.mp   + (bodyBonus.mp   || 0) + (lvBonus.mp  || 0) + (primaryBonus.mp  || 0),
    spd:  base.spd  + (bodyBonus.spd  || 0) + (lvBonus.spd || 0) + (primaryBonus.spd || 0),
    // 加成摘要文本，用于UI显示（正值绿色，负值红色）
    bonusTags: Object.entries(bodyBonus).map(([k,v])=>{
      const name={hp:'气血',atk:'攻击',def:'防御',crit:'暴击',dodge:'闪避',mp:'内力',spd:'速度'}[k]||k;
      const prefix = v>0?'+':'';
      const suffix = (k==='crit'||k==='dodge') ? '%' : '';
      const color  = v>0 ? '#6f6' : '#f77';
      return `<span style="color:${color}">${name}${prefix}${v}${suffix}</span>`;
    }).join(' '),
  };
}

// 获取单个部件内容
function edGetPart(k){
  if(edS.useCustom[k]&&edS.custom[k]) return edS.custom[k];
  return ED_PARTS[k][edS.parts[k]].v;
}

// 把 arms 拆成左臂/右臂
// 优先读 ED_PARTS.arms[i].lv / .rv 字段；自定义文本则自动对半劈
function edSplitArms(s){
  // 非自定义：读部件定义里的 lv/rv
  if(!edS.useCustom.arms){
    const idx=edS.parts.arms;
    const data=ED_PARTS.arms[idx];
    if(data && data.lv!==undefined){
      return { left: data.lv, right: data.rv||'' };
    }
  }
  // 自定义或没有lv字段：按字符数对半劈
  const line = (s||'').split('\n')[0];
  const chars = [...line];
  const mid = Math.ceil(chars.length / 2);
  return { left: chars.slice(0, mid).join(''), right: chars.slice(mid).join('') };
}

// ── 预览攻击动画演示 ──
let pvAtkTimer=null;

function pvShowDmg(txt,color){
  const wrap=document.querySelector('.preview-ascii-wrap');
  if(!wrap) return;
  const d=document.createElement('div');
  d.className='pv-dmg-pop';
  d.textContent=txt;
  d.style.color=color||edS.color;
  wrap.appendChild(d);
  setTimeout(()=>d.remove(), 820);
}

function pvPlayAtk(type){
  const wrap=document.querySelector('.preview-ascii');
  if(!wrap) return;
  // 清除上一次残留
  if(pvAtkTimer){ clearTimeout(pvAtkTimer); pvAtkTimer=null; }
  wrap.classList.remove('pv-atk','pv-heavy','pv-skill');

  // 攻击时暂停移动动画，攻击结束后恢复
  const prevMove = pvMoveState;
  if(pvMoveState) pvStopMove(true);

  const dur = type==='heavy'? 680 : type==='skill'? 800 : 580;
  const cls = type==='heavy'? 'pv-heavy' : type==='skill'? 'pv-skill' : 'pv-atk';

  // 技能：气场先爆发，再打出
  if(type==='skill'){
    // 气场先闪一下
    const auraEl=document.getElementById('pv-aura');
    if(auraEl){
      auraEl.style.transition='transform .1s,opacity .1s,filter .1s';
      auraEl.style.transform='scale(2.2)';
      auraEl.style.opacity='1';
      auraEl.style.filter=`drop-shadow(0 0 30px ${edS.color})`;
      setTimeout(()=>{
        auraEl.style.transform='';auraEl.style.opacity='';auraEl.style.filter='';
        auraEl.style.transition='';
      }, 250);
    }
    setTimeout(()=>pvShowDmg('✨ 出招！', edS.color), 120);
    // 然后打出身体动作（复用重击）
    setTimeout(()=>{
      wrap.classList.add('pv-heavy');
      pvAtkTimer=setTimeout(()=>{
        wrap.classList.remove('pv-heavy');
        if(prevMove) pvToggleMove(prevMove); else pvRestoreIdle();
      }, 700);
    }, 150);
    return;
  }

  // 普攻/重击飘字

  const dmgLabels={
    normal:['⚔ 出招！','⚔ 快攻！','⚔ 一击！'],
    heavy: ['💥 重击！','💥 强打！','💥 轰！'],
  };
  const labels=dmgLabels[type]||dmgLabels.normal;
  setTimeout(()=>pvShowDmg(labels[Math.floor(Math.random()*labels.length)], type==='heavy'?'#ff8060':edS.color), 180);

  wrap.classList.add(cls);

  // 重击：同时触发屏幕微闪
  if(type==='heavy'){
    const pvWrap=document.querySelector('.preview-ascii-wrap');
    if(pvWrap){
      pvWrap.style.transition='box-shadow .05s';
      pvWrap.style.boxShadow=`0 0 40px ${edS.color}88, inset 0 0 30px ${edS.color}22`;
      setTimeout(()=>{ pvWrap.style.boxShadow=''; pvWrap.style.transition=''; }, 300);
    }
  }

  pvAtkTimer=setTimeout(()=>{
    wrap.classList.remove(cls);
    if(prevMove) pvToggleMove(prevMove); else pvRestoreIdle();
  }, dur);
}

// 攻击动画结束后强制恢复各部件待机动画（通过短暂移除再加回class）
function pvRestoreIdle(){
  // 如果正在移动状态，不恢复待机
  if(pvMoveState) return;
  const ids=['pv-aura','pv-head','pv-body','pv-arm-l','pv-arm-r','pv-legs'];
  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(!el) return;
    // 用 reflow 重启动画
    el.style.animation='none';
    void el.offsetHeight; // 强制重绘
    el.style.animation='';
  });
}

// ══════════════════════════════════════════════
//  移动动画系统（走路 / 跑步 / 骑马）
// ══════════════════════════════════════════════
let pvMoveState = null;   // 当前移动状态：null | 'walk' | 'run' | 'ride'
let pvMoveTimer = null;   // 帧切换定时器
let pvMoveFrame = 0;      // 当前帧序号

const PV_MOVE_CONFIG = {
  walk: { interval: 420, frames: ['pv-walk-a','pv-walk-b'],  cls:'pv-walk-a', horse:false },
  run:  { interval: 220, frames: ['pv-run-a', 'pv-run-b'],   cls:'pv-run-a',  horse:false },
  ride: { interval: 200, frames: ['pv-ride'],                cls:'pv-ride',   horse:true  },
};

// ══════════════════════════════════════════════
//  马匹图鉴 — 5种坐骑，各有体型风格
// ══════════════════════════════════════════════
const HORSE_BREEDS = {

  // 1. 普通马（标准体型）
  normal: {
    name: '普通马', icon: '🐴', color: '#c09050',
    desc: '江湖常见坐骑，忠实可靠',
    travelSpeed: 25,  // 里/时辰，1天12时辰约300里
    interval: 280, walkInterval: 400, runInterval: 180,
    frames: [
`  ,───.  
 ( ◉‿◉)╮
  \\▓▓▓/ 
  ╘═╤═╛ 
  ╱  ╲╲ 
 /    ╲╲`,
`  ,───.  
 ( ◉‿◉)╮
  \\▓▓▓/ 
  ╘═╤═╛ 
  ╱╱  ╲ 
 /╱    ╲`,
    ],
  },

  // 2. 高大战马（高挑修长腿）
  warhorse: {
    name: '高大战马', icon: '🦄', color: '#8080c0',
    desc: '体型魁梧，战场之王，速度惊人',
    travelSpeed: 38,  // 约460里/天，威猛之极
    interval: 220,
    frames: [
`   /▔▔▔\\  
  ( ◣◉◢ ) 
  [█████]  
   ╘══╤══╛ 
   /    \\╲ 
  /      ╲╲
 ╱         ╲`,
`   /▔▔▔\\  
  ( ◣◉◢ ) 
  [█████]  
   ╘══╤══╛ 
  ╱╱    \\ 
 ╱╱      \\
╱          \\`,
    ],
  },

  // 3. 矮胖滇马（宽体矮腿）
  pony: {
    name: '矮胖滇马', icon: '🐎', color: '#a06030',
    desc: '云贵高原的矮马，结实耐力超群',
    travelSpeed: 20,  // 慢但耐力强，山地系数优秀，约240里/天
    interval: 350, walkInterval: 480, runInterval: 240,
    frames: [
` ,─────.
(  ◕ω◕  )
 [▓▓▓▓▓▓]
  ╘══╤══╛
   ╱| |╲ 
  ▔▔  ▔▔ `,
` ,─────.
(  ◕ω◕  )
 [▓▓▓▓▓▓]
  ╘══╤══╛
   |╱ ╲| 
  ▔▔   ▔ `,
    ],
  },

  // 4. 纤细白马（高挑细腿，飘逸）
  white: {
    name: '白龙马', icon: '🌟', color: '#e8e8ff',
    desc: '神驹白龙，鬃毛如银，飘然若仙',
    travelSpeed: 35,  // 约420里/天，飘然神速
    interval: 240,
    frames: [
`   ,─.   
  (✦‿✦)  
  /═══\\  
  ╘═╤═╛  
   / ╲╲  
  /   ╲╲ 
 /     ╲ `,
`   ,─.   
  (✦‿✦)  
  /═══\\  
  ╘═╤═╛  
  ╱╱  \\ 
 ╱╱    \\ 
/       \\`,
    ],
  },

  // 5. 汗血宝马（流线型，最快）
  heavenly: {
    name: '汗血宝马', icon: '🔥', color: '#ff6030',
    desc: '西域神驹，日行千里，鬃毛如火焰',
    travelSpeed: 80,  // 约960里/天，接近"日行千里"传说
    interval: 160,
    frames: [
` ≋,─.≋  
 (◉ω◉)╮ 
 ≋[▰▰▰]≋
  ╘═╤═╛  
  ≋/  ╲╲ 
 ≋/    ╲≋`,
` ≋,─.≋  
 (◉ω◉)╮ 
 ≋[▰▰▰]≋
  ╘═╤═╛  
 ≋╱╱  ╲≋ 
≋╱      ╲`,
    ],
  },

  // 6. 老黄马（矮、胖、步伐慢）
  old: {
    name: '老黄马', icon: '🌾', color: '#b89060',
    desc: '走遍江湖的老伙计，慢悠悠但靠谱',
    travelSpeed: 15,  // 约180里/天，慢悠悠
    interval: 460,
    frames: [
` .─────.
( ˘_˘   )
 [▓▓▓▓▓]
  ╘══╤══╛
   / | \\ 
  ▔  ▔  ▔`,
` .─────.
( ˘_˘   )
 [▓▓▓▓▓]
  ╘══╤══╛
   | / | 
  ▔▔  ▔▔`,
    ],
  },

  // 7. 乌骓马（黑色骏马，项羽坐骑风格）
  black: {
    name: '乌骓马', icon: '🖤', color: '#6060a0',
    desc: '通体漆黑，英气凛然，传说中的霸王坐骑',
    travelSpeed: 42,  // 约500里/天，极速
    interval: 200, walkInterval: 320, runInterval: 130,
    frames: [
`  ,━━━.  
 (◤■◥)╮ 
 ▐█████▌ 
  ╘══╤══╛ 
   /   ╲╲ 
  /     ╲╲`,
`  ,━━━.  
 (◤■◥)╮ 
 ▐█████▌ 
  ╘══╤══╛ 
  ╱╱   \\ 
 ╱╱     \\`,
    ],
  },

  // 8. 踏雪马（白底带雪花纹，轻盈优雅）
  snow: {
    name: '踏雪踏云', icon: '❄', color: '#b0d8ff',
    desc: '白如霜雪，步履轻盈，踏于云端如同飞行',
    travelSpeed: 40,  // 约480里/天，极轻盈
    interval: 210, walkInterval: 310, runInterval: 145,
    frames: [
`  ❄,─.❄ 
  (❄‿❄)  
  /░░░\\  
  ╘═╤═╛  
 ❄ / ╲╲❄ 
  /   ╲╲ `,
`  ❄,─.❄ 
  (❄‿❄)  
  /░░░\\  
  ╘═╤═╛  
 ❄╱╱  \\❄ 
  ╱╱    \\`,
    ],
  },

  // 9. 赤兔马（红色神驹，关羽坐骑）
  redrabbit: {
    name: '赤兔马', icon: '🔴', color: '#e03020',
    desc: '赤如烈焰，神速无双，天下第一名驹',
    travelSpeed: 90,  // 约1080里/天，真正"日行千里"！
    interval: 150, walkInterval: 280, runInterval: 100,
    frames: [
` 火,─.火  
 (◉‼◉)╮ 
 火[▰▰▰]火
  ╘═╤═╛  
 火 /  ╲╲火
  火/    ╲`,
` 火,─.火  
 (◉‼◉)╮ 
 火[▰▰▰]火
  ╘═╤═╛  
火╱╱  ╲火 
 ╱╱    ╲火`,
    ],
  },

  // 10. 花斑马（斑纹马，西域异兽）
  zebra: {
    name: '花斑神骑', icon: '🦓', color: '#c8a060',
    desc: '来自西域的奇异花斑骏马，性烈难驯',
    travelSpeed: 28,  // 约336里/天，中等速度
    interval: 260, walkInterval: 380, runInterval: 170,
    frames: [
`  ,─═─.  
 (▒◉▒◉)╮ 
 ▒[▒▒▒]▒ 
  ╘══╤══╛ 
  ▒ / ╲╲▒ 
  ▒/   ╲╲▒`,
`  ,─═─.  
 (▒◉▒◉)╮ 
 ▒[▒▒▒]▒ 
  ╘══╤══╛ 
  ▒╱╱ ╲▒  
 ▒╱╱   ╲▒`,
    ],
  },

  // 11. 夜光驹（深紫色，神秘光晕）
  phantom: {
    name: '夜光驹', icon: '🌙', color: '#a060e0',
    desc: '月夜中浑身散发幽光，来历成谜的神秘坐骑',
    travelSpeed: 36,  // 约432里/天，夜行如飞
    interval: 230, walkInterval: 360, runInterval: 155,
    frames: [
` ✦,─.✦  
 (✧⊙✧)  
 ✦[◈◈◈]✦ 
  ╘══╤══╛ 
  ✦ /  ╲╲✦
   /    ╲╲`,
` ✦,─.✦  
 (✧⊙✧)  
 ✦[◈◈◈]✦ 
  ╘══╤══╛ 
 ✦╱╱  \\ ✦
  ╱╱    \\`,
    ],
  },

  // 12. 骆驼（西域沙漠坐骑，步伐独特）
  camel: {
    name: '沙漠骆驼', icon: '🐪', color: '#d4a050',
    desc: '沙漠之舟，耐力惊人，西域商旅首选坐骑',
    travelSpeed: 18,  // 约216里/天，慢但沙漠系数不增加
    interval: 420, walkInterval: 550, runInterval: 300,
    frames: [
`  ,──.   
 ( ˇ_ˇ)  
 [▲▓▓▲]  
  ╘═══╛   
  /   \\  
 /     \\
▔       ▔`,
`  ,──.   
 ( ˇ_ˇ)  
 [▲▓▓▲]  
  ╘═══╛   
  | / |  
  |/  |
▔▔    ▔▔`,
    ],
  },
};

// 当前选中马种（默认普通马）
let pvHorseBreed = 'normal';

let pvHorseFrame = 0;
let pvHorseTimer = null;

function pvStartHorse(color){
  const horse = document.getElementById('pv-horse');
  if(!horse) return;
  pvHorseFrame = 0;
  const breed = HORSE_BREEDS[pvHorseBreed] || HORSE_BREEDS.normal;
  horse.style.color = color || breed.color;
  const render = () => {
    horse.textContent = breed.frames[pvHorseFrame % breed.frames.length];
    pvHorseFrame++;
  };
  render();
  pvHorseTimer = setInterval(render, breed.interval);
}
function pvStopHorse(){
  if(pvHorseTimer){ clearInterval(pvHorseTimer); pvHorseTimer=null; }
  const horse = document.getElementById('pv-horse');
  if(horse){ horse.textContent=''; horse.style.display='none'; }
}

// 马种选择器渲染
function renderHorsePicker(){
  const row = document.getElementById('horsePickerRow');
  if(!row) return;
  // 速度文字映射
  const speedLabel = { normal:'普通', warhorse:'极快', pony:'稳健', white:'飘逸', heavenly:'最快', old:'慢悠悠' };
  row.innerHTML = Object.entries(HORSE_BREEDS).map(([key, b]) => {
    const active = pvHorseBreed === key ? 'active' : '';
    // 把hex颜色转为 r,g,b 用于CSS变量
    const hex = b.color.replace('#','');
    const r=parseInt(hex.slice(0,2),16), g=parseInt(hex.slice(2,4),16), bl=parseInt(hex.slice(4,6),16);
    return `<div class="horse-btn ${active}" style="--hb-color:${b.color};--hb-rgb:${r},${g},${bl}"
      onclick="pvSelectBreed('${key}')">
      <div class="horse-btn-icon">${b.icon}</div>
      <div class="horse-btn-name">${b.name}</div>
      <div class="horse-btn-speed">${speedLabel[key]||''}</div>
    </div>`;
  }).join('');
}

// 切换马种
function pvSelectBreed(key){
  pvHorseBreed = key;
  renderHorsePicker();
  // 如果正在骑马，立即切换到新马种，保持当前速度档位
  if(pvRideMode){
    pvStopHorse();
    const horse = document.getElementById('pv-horse');
    if(horse) horse.style.display = 'block';
    // 判断当前速度档位
    const speedType = pvMoveState === 'ride-walk' ? 'walk'
                    : pvMoveState === 'ride-run'  ? 'run'
                    : 'ride';
    if(speedType !== 'ride') pvSetRideSpeed(speedType);
    else pvStartHorse(edS.color);
  }
}

// 显示/隐藏马种选择器
function pvShowHorsePicker(show){
  const el = document.getElementById('horsePicker');
  if(!el) return;
  if(show){ renderHorsePicker(); el.classList.add('visible'); }
  else     { el.classList.remove('visible'); }
}

const PV_MOVE_ALL_CLS = ['pv-walk-a','pv-walk-b','pv-run-a','pv-run-b','pv-ride'];

let pvRideMode = false;   // 是否处于骑马状态

function pvToggleMove(type){
  const wrap = document.querySelector('.preview-ascii');
  if(!wrap) return;

  // ── 骑马状态下点走路/跑步：只换速度，不下马 ──
  if(pvRideMode && (type === 'walk' || type === 'run')){
    // 如果再次点同一个 → 回到标准骑马速度
    if(pvMoveState === 'ride-' + type){
      pvSetRideSpeed('ride');
      return;
    }
    pvSetRideSpeed(type);
    return;
  }

  // 再次点同一个 → 停止，恢复待机
  if(pvMoveState === type){
    pvStopMove();
    return;
  }

  // 停止当前移动
  pvStopMove(true); // silent=true，不恢复待机

  // 高亮按钮
  ['walk','run','ride'].forEach(t=>{
    const btn=document.getElementById('btn-'+t);
    if(btn) btn.classList.toggle('active', t===type);
  });

  pvMoveState = type;
  const cfg = PV_MOVE_CONFIG[type];

  // 骑马：显示马匹，隐藏腿部
  const horse = document.getElementById('pv-horse');
  const legs  = document.getElementById('pv-legs');
  if(horse) horse.style.display = cfg.horse ? 'block' : 'none';
  if(legs)  legs.style.opacity  = cfg.horse ? '0' : '1';

  // 骑马：启动双帧马匹动画
  if(type === 'ride'){
    pvRideMode = true;
    wrap.classList.add('pv-ride');
    pvStartHorse(edS.color);
    pvShowHorsePicker(true);
    pvMoveFrame = 0;
    return;
  }

  // 走路/跑步：定时器切换两帧
  pvMoveFrame = 0;
  const applyFrame = () => {
    PV_MOVE_ALL_CLS.forEach(c => wrap.classList.remove(c));
    wrap.classList.add(cfg.frames[pvMoveFrame % cfg.frames.length]);
    pvMoveFrame++;
  };
  applyFrame();
  pvMoveTimer = setInterval(applyFrame, cfg.interval);
}

// 骑马状态下调整速度档位（walk=慢步/run=奔跑/ride=标准）
function pvSetRideSpeed(speedType){
  const breed = HORSE_BREEDS[pvHorseBreed] || HORSE_BREEDS.normal;
  let interval;
  if(speedType === 'walk')       interval = breed.walkInterval || breed.interval * 1.5;
  else if(speedType === 'run')   interval = breed.runInterval  || breed.interval * 0.6;
  else                           interval = breed.interval;

  // 更新按钮高亮（骑马保持，走/跑也亮）
  const stateKey = speedType === 'ride' ? 'ride' : 'ride-' + speedType;
  pvMoveState = stateKey;
  ['walk','run','ride'].forEach(t=>{
    const btn=document.getElementById('btn-'+t);
    if(!btn) return;
    if(speedType === 'ride')       btn.classList.toggle('active', t==='ride');
    else if(speedType === 'walk')  btn.classList.toggle('active', t==='ride' || t==='walk');
    else if(speedType === 'run')   btn.classList.toggle('active', t==='ride' || t==='run');
  });

  // 重启马帧定时器，用新速度
  if(pvHorseTimer){ clearInterval(pvHorseTimer); pvHorseTimer=null; }
  const horse = document.getElementById('pv-horse');
  if(!horse) return;
  pvHorseFrame = 0;
  const render = () => {
    horse.textContent = breed.frames[pvHorseFrame % breed.frames.length];
    pvHorseFrame++;
  };
  render();
  pvHorseTimer = setInterval(render, interval);

  // 骑手颠簸速度也跟着调（修改CSS animation duration）
  const wrap = document.querySelector('.preview-ascii');
  if(wrap){
    const bobDur = speedType==='run' ? '0.2s' : speedType==='walk' ? '0.5s' : '0.35s';
    const gallopDur = speedType==='run' ? '0.18s' : speedType==='walk' ? '0.48s' : '0.35s';
    const headEl  = document.getElementById('pv-head');
    const bodyEl  = document.getElementById('pv-body');
    if(headEl)  headEl.style.animationDuration  = bobDur;
    if(bodyEl)  bodyEl.style.animationDuration  = gallopDur;
  }
}

function pvStopMove(silent){
  // 清定时器
  if(pvMoveTimer){ clearInterval(pvMoveTimer); pvMoveTimer=null; }
  pvStopHorse();
  pvShowHorsePicker(false);

  const wrap = document.querySelector('.preview-ascii');
  if(wrap) PV_MOVE_ALL_CLS.forEach(c => wrap.classList.remove(c));

  // 隐藏马匹，恢复腿部
  const horse = document.getElementById('pv-horse');
  const legs  = document.getElementById('pv-legs');
  if(horse) horse.style.display = 'none';
  if(legs)  legs.style.opacity  = '1';

  // 重置骑马状态及骑手颠簸速度
  pvRideMode = false;
  const headEl = document.getElementById('pv-head');
  const bodyEl = document.getElementById('pv-body');
  if(headEl) headEl.style.animationDuration = '';
  if(bodyEl) bodyEl.style.animationDuration = '';

  // 清除按钮高亮
  ['walk','run','ride'].forEach(t=>{
    const btn=document.getElementById('btn-'+t);
    if(btn) btn.classList.remove('active');
  });

  pvMoveState = null;
  if(!silent) pvRestoreIdle();
}




function edRefreshPreview(){
  const st=edStats();
  const col=edS.color;

  // 非手臂部件正常逐个更新
  const SIMPLE=['aura','head','body','legs'];
  SIMPLE.forEach(k=>{
    const el=document.getElementById('pv-'+k);
    if(!el) return;
    const txt=edGetPart(k);
    if(el.textContent!==txt) el.textContent=txt;
    el.style.color=col;
    el.style.display=txt?'block':'none';
  });
  // 服装叠加层隐藏（不使用叠加模式）
  const cosOverEl=document.getElementById('pv-cos-overlay');
  if(cosOverEl) cosOverEl.style.display='none';

  // 手臂：拆左右两半填入对应div
  const armsStr=edGetPart('arms');
  const {left:aL, right:aR}=edSplitArms(armsStr);
  const elL=document.getElementById('pv-arm-l');
  const elR=document.getElementById('pv-arm-r');
  if(elL){ if(elL.textContent!==aL) elL.textContent=aL; elL.style.color=col; }
  if(elR){ if(elR.textContent!==aR) elR.textContent=aR; elR.style.color=col; }

  // 同步底部光条和光晕圈颜色
  const stageLine=document.getElementById('edStageLine');
  if(stageLine) stageLine.style.background=`linear-gradient(90deg,transparent,${col},transparent)`;
  const auraRing=document.getElementById('edAuraRing');
  if(auraRing) auraRing.style.background=`radial-gradient(ellipse,${col}88 0%,transparent 70%)`;

  // 同步包裹层CSS变量（顶部聚光灯颜色）
  const wrap=document.querySelector('.preview-ascii-wrap');
  if(wrap){
    wrap.style.setProperty('--stage-beam',col+'18');
  }

  const sg=document.getElementById('edStatGrid');
  if(sg){
    // 计算综合属性：体型基础 + 武器/服装加成（让玩家穿装备时能直观看到变化）
    const wep = edS.weaponId ? WEAPONS.find(w=>w.id===edS.weaponId) : null;
    const cos = edS.costumeId ? COSTUMES.find(c=>c.id===edS.costumeId) : null;
    // 临时构建一个ch对象给calcFinalStats用
    const tmpCh = {
      maxHp: st.hp, atk: st.atk, def: st.def,
      crit: st.crit, dodge: st.dodge, maxMp: st.mp, speedN: st.spd,
    };
    // 手动叠加（单位统一：暴击/闪避全部用整数%显示）
    // 武器：critBonus是小数(0.25=25%)，需×100；dodgeBonus是整数(8=8%)
    // 服装：critBonus/dodgeBonus 均为整数%
    const cosHp    = cos?(cos.hpBonus   ||0):0;
    const cosAtk   = cos?(cos.atkBonus  ||0):0;
    const cosDef   = cos?(cos.defBonus  ||0):0;
    const cosMp    = cos?(cos.mpBonus   ||0):0;
    const cosSpd   = cos?(cos.speedBonus||0):0;
    const cosCrit  = cos?(cos.critBonus ||0):0;   // 整数%
    const cosDodge = cos?(cos.dodgeBonus||0):0;   // 整数%
    const wepAtk   = wep?(wep.atkBonus  ||0):0;
    const wepHp    = wep?(wep.hpBonus   ||0):0;
    const wepDef   = wep?(wep.defBonus  ||0):0;
    const wepMp    = wep?(wep.mpBonus   ||0):0;
    const wepSpd   = wep?(wep.speedBonus||0):0;
    const wepCrit  = wep?Math.round((wep.critBonus||0)*100):0;  // 小数→整数%
    const wepDodge = wep?(wep.dodgeBonus||0):0;                 // 已是整数%
    const totalHp    = st.hp    + cosHp    + wepHp;
    const totalAtk   = st.atk   + cosAtk   + wepAtk;
    const totalDef   = st.def   + cosDef   + wepDef;
    const totalMp    = st.mp    + cosMp    + wepMp;
    const totalSpd   = st.spd   + cosSpd   + wepSpd;
    const totalCrit  = Math.min(75, st.crit  + cosCrit  + wepCrit);
    const totalDodge = Math.min(50, st.dodge + cosDodge + wepDodge);
    // 有装备时显示"综合+差值"，否则只显示基础
    const hasEquip = !!(wep || cos);
    const fmt=(base,total,pct)=>{
      if(!hasEquip) return pct ? `${base}%` : `${base}`;
      const diff = total - base;
      const sign = diff>0?'<span style="color:#6f6">+'+diff+'</span>':diff<0?'<span style="color:#f66">'+diff+'</span>':'';
      return pct ? `${total}%${sign?'<br><small>'+sign+'</small>':''}` : `${total}${sign?'<br><small>'+sign+'</small>':''}`;
    };
    sg.innerHTML=`
      <div class="stat-cell"><div class="stat-cell-val">${fmt(st.hp,totalHp,false)}</div><div class="stat-cell-lbl">气血</div></div>
      <div class="stat-cell"><div class="stat-cell-val">${fmt(st.atk,totalAtk,false)}</div><div class="stat-cell-lbl">攻击</div></div>
      <div class="stat-cell"><div class="stat-cell-val">${fmt(st.def,totalDef,false)}</div><div class="stat-cell-lbl">防御</div></div>
      <div class="stat-cell"><div class="stat-cell-val">${fmt(st.mp,totalMp,false)}</div><div class="stat-cell-lbl">内力</div></div>
      <div class="stat-cell"><div class="stat-cell-val">${fmt(st.crit,totalCrit,true)}</div><div class="stat-cell-lbl">暴击</div></div>
      <div class="stat-cell"><div class="stat-cell-val">${fmt(st.dodge,totalDodge,true)}</div><div class="stat-cell-lbl">闪避</div></div>
      ${(hasEquip && (wepSpd||cosSpd)) ? `<div class="stat-cell" style="grid-column:1/-1"><div class="stat-cell-val">${fmt(st.spd,totalSpd,false)}</div><div class="stat-cell-lbl">速度</div></div>` : ''}
      ${st.bonusTags ? `<div class="stat-bonus-row" style="grid-column:1/-1;font-size:10px;text-align:center;padding:2px 0">体型：${st.bonusTags}</div>` : ''}
    `;
  }

  // ── 头像框 ────────────────────────────────────────
  const pvWrap=document.getElementById('pv-wrap');
  if(pvWrap){
    const frm=FRAME_DB[edS.equippedFrame];
    if(frm && frm.css){
      // 重置后再应用（避免cssText累积导致冲突）
      pvWrap.style.border='';
      pvWrap.style.boxShadow='';
      pvWrap.style.borderRadius='';
      pvWrap.style.padding='';
      // 提取frame CSS的各属性单独设置
      const css=frm.css;
      const m=css.match(/([^:]+):([^;]+)/g)||[];
      m.forEach(decl=>{const[p,v]=decl.split(':').map(s=>s.trim());if(p&&v) pvWrap.style[p]=v;});
    } else {
      pvWrap.style.border='none';
      pvWrap.style.boxShadow='none';
      pvWrap.style.borderRadius='6px';
      pvWrap.style.padding='4px';
    }
  }

  // ── 称号牌 ────────────────────────────────────────
  const tpWrap=document.getElementById('pv-titleplate');
  if(tpWrap){
    const tp=TITLE_PLATE_DB[edS.equippedTitlePlate];
    tpWrap.textContent=tp&&tp.title?tp.title:'';
    tpWrap.style.color=tp&&tp.color?tp.color:'#d0a050';
    tpWrap.style.display=tp&&tp.title?'block':'none';
  }
}


function edInit(){
  // 初始化背包（从localStorage恢复）
  // 优先从 wuxia_bag 恢复，因为事件奖励等物品通过 bagSave() 保存到此处
  const bagFromStorage = bagLoad();
  if(bagFromStorage && bagFromStorage.length > 0){
    edS.bag = bagFromStorage;
  }else if(!edS.bag){
    edS.bag = [];
  }
  // 加载等级/经验存档
  if(typeof loadPlayerProgress === 'function') loadPlayerProgress();
  // 加载熟练度存档
  if(typeof loadProficiency === 'function') loadProficiency();

  if(edBuilt) { cpRefreshSkillSelector(); cpRefreshWeaponSelector(); cpRefreshCostumeSelector(); renderBagPanel();
    if(typeof renderManualsPanel==='function') renderManualsPanel();
    if(typeof renderLearnedSkillsOverview==='function') renderLearnedSkillsOverview();
    renderPlayerExpBar(); return; }
  edBuilt=true;
  // 颜色
  const cr=document.getElementById('edColorRow');
  cr.innerHTML=ED_COLORS.map(c=>`<div class="color-dot${c===edS.color?' sel':''}" style="background:${c}" onclick="edSetColor('${c}')"></div>`).join('');
  // 各部位折叠面板
  const ep=document.getElementById('editPanel');
  const savedCard=ep.querySelector('.saved-card');
  PART_META.forEach(pm=>{
    const card=document.createElement('div');
    card.className='part-card open';
    card.id='pc-'+pm.key;
    card.innerHTML=`
      <div class="part-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="part-head-icon">${pm.icon}</div>
        <div class="part-head-name">${pm.label}</div>
        <div class="part-head-toggle">▶</div>
      </div>
      <div class="part-body">
        <div class="part-options" id="po-${pm.key}"></div>
        <div class="custom-row">
          <textarea class="custom-ta" id="ct-${pm.key}" placeholder="自定义字符（可多行、可用emoji）" rows="2"></textarea>
          <button class="custom-ok" onclick="edCustom('${pm.key}')">应用</button>
        </div>
      </div>`;
    ep.insertBefore(card,savedCard);
    edRenderPartOpts(pm.key);
  });

  // ── 头像框（成就解锁）────────────────────────
  (function buildFrameCard(){
    const card=document.createElement('div');
    card.className='part-card open';
    card.id='pc-frame';
    card.innerHTML=`
      <div class="part-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="part-head-icon">🖼️</div>
        <div class="part-head-name">头像框</div>
        <div class="part-head-sub" id="edFrameCur" style="font-size:9px;color:#ffd060;margin-left:auto;margin-right:8px"></div>
        <div class="part-head-toggle">▶</div>
      </div>
      <div class="part-body">
        <div class="part-options" id="po-frame" style="grid-template-columns:repeat(auto-fill,minmax(70px,1fr))"></div>
      </div>`;
    ep.insertBefore(card,savedCard);
    edRenderFrameOpts();
  })();

  // ── 称号牌（成就解锁）────────────────────────
  (function buildTitleCard(){
    const card=document.createElement('div');
    card.className='part-card open';
    card.id='pc-titleplate';
    card.innerHTML=`
      <div class="part-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="part-head-icon">📜</div>
        <div class="part-head-name">称号牌</div>
        <div class="part-head-sub" id="edTitleCur" style="font-size:9px;color:#ffd060;margin-left:auto;margin-right:8px"></div>
        <div class="part-head-toggle">▶</div>
      </div>
      <div class="part-body">
        <div class="part-options" id="po-titleplate" style="grid-template-columns:repeat(auto-fill,minmax(80px,1fr))"></div>
      </div>`;
    ep.insertBefore(card,savedCard);
    edRenderTitleOpts();
  })();
  edRefreshPreview();
  edRefreshSaved();
  cpRefreshSkillSelector();
  cpRefreshWeaponSelector();
  cpRefreshCostumeSelector();
  renderBagPanel();
  // 秘籍系统
  if(typeof renderManualsPanel==='function') renderManualsPanel();
  if(typeof renderLearnedSkillsOverview==='function') renderLearnedSkillsOverview();
  // 更新秘籍数量标记
  const mBadge = document.getElementById('manualsCountBadge');
  if(mBadge && typeof getManualsCount==='function'){
    const cnt = getManualsCount();
    mBadge.textContent = cnt;
    mBadge.style.display = cnt > 0 ? 'inline-block' : 'none';
  }
}

// ── 自定义角色技能选择器 ──────────────────────
let _cpPoolFilter = 'all';
function cpRefreshSkillSelector(){
  // 同步装备槽系统
  const equippedIds = (typeof getEquippedSkills === 'function') ? getEquippedSkills() : [];
  const maxSlots = (typeof getTotalSkillSlots === 'function') ? getTotalSkillSlots() : 3;
  const slotText = (typeof getSkillSlotText === 'function') ? getSkillSlotText() : `${equippedIds.length}/${maxSlots}`;

  // 获取武器限制
  const weaponAllowedSchools = (typeof getWeaponAllowedSchools === 'function')
    ? getWeaponAllowedSchools()
    : ['common'];
  const weaponRestrictionText = (typeof getWeaponSchoolRestrictionText === 'function')
    ? getWeaponSchoolRestrictionText()
    : '';

  // 过滤按钮
  const pf = document.getElementById('cpPoolFilter');
  if(!pf) return;
  pf.innerHTML = `<button class="cp-pool-filter ${_cpPoolFilter==='all'?'active':''}" onclick="cpSetPoolFilter('all')">全部</button>`
    + Object.entries(SK_SCHOOL_INFO).map(([k,v])=>
      `<button class="cp-pool-filter ${_cpPoolFilter===k?'active':''}" style="${_cpPoolFilter===k?`color:${v.color};border-color:${v.color}`:''}" onclick="cpSetPoolFilter('${k}')">${v.label}</button>`
    ).join('');
  // 已选列表（装备槽）
  const sel = document.getElementById('cpSelectedSkills');
  if(equippedIds.length===0){
    sel.innerHTML = `
      <span style="color:rgba(180,140,60,.3);font-size:11px">从下方选择技能装备到战斗槽（${slotText}）</span>
      <div style="color:#80d8ff;font-size:10px;margin-top:4px;">⚔️ ${weaponRestrictionText}</div>
    `;
  } else {
    sel.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
        ${equippedIds.map(id=>{
          const sk = getSkill(id);
          return sk ? `<div class="cp-sk-chip" onclick="cpRemoveSkill('${id}')" title="点击卸下">${sk.icon} ${sk.name}<span class="rm">✕</span></div>` : '';
        }).join('')}
      </div>
      <div style="color:rgba(200,180,100,.6);font-size:11px;">装备槽：${slotText} ${equippedIds.length >= maxSlots ? '<span style="color:#ff6b6b">（已满）</span>' : ''}</div>
      <div style="color:#80d8ff;font-size:10px;margin-top:4px;">⚔️ ${weaponRestrictionText}</div>
    `;
  }
  // 获取已学技能集合
  const learnedSkills = (typeof getLearnedSkills==='function') ? getLearnedSkills() : new Set();
  // 默认开放技能：通用系全部 + 各系前3个入门技
  const defaultOpen = new Set();
  Object.values(SKILL_LIB).forEach(arr=>{
    arr.forEach(sk=>{ if(sk.id.includes('_l')||sk.school==='通用') defaultOpen.add(sk.id); });
  });

  // 技能池 - 根据武器限制筛选
  const pool = document.getElementById('cpSkillPool');
  let list = _cpPoolFilter==='all' ? SKILL_FLAT : (SKILL_LIB[_cpPoolFilter]||[]);

  // 根据武器学派限制过滤
  list = list.filter(sk => {
    const skillSchool = (typeof getSkillSchool === 'function') ? getSkillSchool(sk.id) : 'common';
    return weaponAllowedSchools.includes(skillSchool);
  });

  pool.innerHTML = list.map(sk=>{
    const isEquipped = equippedIds.includes(sk.id);
    const isFull = !isEquipped && equippedIds.length >= maxSlots;
    const isLearned = learnedSkills.has(sk.id);
    const isDefault = defaultOpen.has(sk.id);
    const isUnlocked = isDefault || isLearned;
    // 状态标记
    const lockedMark = !isUnlocked ? '<span style="font-size:8px;color:rgba(180,120,60,.5);margin-left:2px">📜</span>' : '';
    const learnedMark = isLearned ? '<span style="font-size:8px;color:rgba(80,220,80,.6);margin-left:2px">✓</span>' : '';
    const equippedMark = isEquipped ? '<span style="font-size:8px;color:#f0c060;margin-left:2px">⚔️</span>' : '';
    return `<div class="cp-pool-item ${isEquipped?'selected':''} ${(isFull||!isUnlocked)?'disabled':''}"
      data-skid="${sk.id}"
      title="${isUnlocked ? (sk.desc||'').replace(/"/g,'&quot;') : '需从武学秘籍中学习此招式'}${isEquipped ? ' [已装备]' : ''}"
      style="${!isUnlocked?'opacity:.4;filter:grayscale(.5)':''}${isEquipped?'background:rgba(240,192,96,.15);border-color:rgba(240,192,96,.4)':''}">
      ${sk.icon} ${sk.name}${lockedMark}${learnedMark}${equippedMark}
    </div>`;
  }).join('');

  // 如果没有可用技能，显示提示
  if (list.length === 0) {
    pool.innerHTML = `<div style="color:rgba(180,140,60,.5);font-size:12px;text-align:center;padding:20px;">
      当前武器不支持${_cpPoolFilter==='all'?'任何':SK_SCHOOL_INFO[_cpPoolFilter]?.label||''}技能<br>
      <span style="font-size:10px;color:rgba(180,140,60,.3)">更换武器以使用其他学派技能</span>
    </div>`;
  }

  // 事件委托
  pool.onclick = e=>{
    const item = e.target.closest('.cp-pool-item');
    if(!item) return;
    const sid = item.dataset.skid;

    // 已装备则卸下
    if (item.classList.contains('selected')) {
      cpRemoveSkill(sid);
      return;
    }

    if(item.classList.contains('disabled')) {
      // 检查是槽满还是未解锁
      const lrn2 = (typeof getLearnedSkills==='function') ? getLearnedSkills() : new Set();
      const df2 = new Set();
      Object.values(SKILL_LIB).forEach(arr=>arr.forEach(sk=>{
        if(sk.id.includes('_l')||sk.school==='通用') df2.add(sk.id);
      }));
      if(!df2.has(sid) && !lrn2.has(sid)){
        showToast('此招式需先从武学秘籍中习得！');
      } else {
        const curSlots = (typeof getEquippedSkills === 'function') ? getEquippedSkills().length : 0;
        const max = (typeof getTotalSkillSlots === 'function') ? getTotalSkillSlots() : 3;
        showToast(`装备槽已满（${curSlots}/${max}），请先卸下其他技能`);
      }
      return;
    }

    // 再次验证解锁状态
    const lrn2 = (typeof getLearnedSkills==='function') ? getLearnedSkills() : new Set();
    const df2 = new Set();
    Object.values(SKILL_LIB).forEach(arr=>arr.forEach(sk=>{
      if(sk.id.includes('_l')||sk.school==='通用') df2.add(sk.id);
    }));
    if(!df2.has(sid) && !lrn2.has(sid)){ showToast('此招式需先从武学秘籍中习得！'); return; }
    cpToggleSkill(sid);
  };
}

function cpSetPoolFilter(cat){
  _cpPoolFilter = cat;
  cpRefreshSkillSelector();
}

function cpToggleSkill(id){
  const equipped = (typeof getEquippedSkills === 'function') ? getEquippedSkills() : [];
  const maxSlots = (typeof getTotalSkillSlots === 'function') ? getTotalSkillSlots() : 3;

  if(equipped.includes(id)){
    // 卸下
    if (typeof unequipSkill === 'function') {
      unequipSkill(id);
    }
  } else if(equipped.length < maxSlots){
    // 装备
    if (typeof equipSkill === 'function') {
      const result = equipSkill(id);
      if (!result.success) {
        showToast(result.reason);
      }
    }
  } else {
    showToast(`装备槽已满（${equipped.length}/${maxSlots}）`);
  }
  cpRefreshSkillSelector();
}

function cpRemoveSkill(id){
  if (typeof unequipSkill === 'function') {
    unequipSkill(id);
  }
  cpRefreshSkillSelector();
}


// ── 自定义角色武器选择器 ──────────────────────
let _cpWepFilter = 'all';    // 稀有度筛选
let _cpWepCatFilter = 'all'; // 类别筛选

function cpRefreshWeaponSelector(){
  const filterEl = document.getElementById('cpWepFilter');
  const poolEl   = document.getElementById('cpWepPool');
  const curEl    = document.getElementById('cpWepCurrent');
  if(!filterEl || !poolEl) return;

  const RC = {
    mythic:'#ffffff', legendary:'#ffd060', epic:'#c080f0',
    rare:'#60a8ff', uncommon:'#44cc88', common:'#a0a0a0'
  };
  const RL = {
    mythic:'🌟神器', legendary:'✦传说', epic:'◆史诗',
    rare:'◇精良', uncommon:'★精品', common:'·凡品'
  };
  const cats = ['全部', '剑', '刀', '枪矛', '棍杖', '拳套', '暗器', '法器', '乐器'];
  const rarities = ['all','mythic','legendary','epic','rare','uncommon','common'];

  filterEl.innerHTML =
    `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px">` +
    rarities.map(r=>`
      <div class="cp-wep-filter-btn${_cpWepFilter===r?' active':''}"
           style="${r!=='all'?'border-color:'+RC[r]+'44;color:'+RC[r]+';opacity:.8':''}"
           onclick="cpSetWepFilter('${r}','rarity')">
        ${r==='all'?'全部':RL[r]}
      </div>`).join('') +
    `</div><div style="display:flex;flex-wrap:wrap;gap:4px">` +
    cats.map(c=>`
      <div class="cp-wep-filter-btn${_cpWepCatFilter===(c==='全部'?'all':c)?' active':''}"
           onclick="cpSetWepFilter('${c==='全部'?'all':c}','cat')">
        ${c}
      </div>`).join('') + `</div>`;

  const hex2rgb = h => {
    const c=h.replace('#','');
    return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
  };

  // 从背包里取武器实例
  let bagWeps = (edS.bag||[])
    .filter(i=>i.type==='weapon')
    .map(i=>({ inst:i, tpl:WEAPONS.find(w=>w.id===i.templateId) }))
    .filter(x=>x.tpl);
  // 排序：稀有度高的在前
  bagWeps.sort((a,b)=>{
    const oa=WEP_RARITY[a.tpl.rarity]?.order??9;
    const ob=WEP_RARITY[b.tpl.rarity]?.order??9;
    return oa!==ob ? oa-ob : b.tpl.atkBonus-a.tpl.atkBonus;
  });
  if(_cpWepFilter!=='all')    bagWeps=bagWeps.filter(x=>x.tpl.rarity===_cpWepFilter);
  if(_cpWepCatFilter!=='all') bagWeps=bagWeps.filter(x=>x.tpl.cat===_cpWepCatFilter);

  const noneChip = `<div class="cp-wep-chip none-chip${!edS.weaponInstId?' selected':''}" onclick="cpEquipWeapon(null)">
    <div style="font-size:18px">🚫</div>
    <div class="cp-wep-name">无武器</div>
  </div>`;

  if(bagWeps.length===0){
    poolEl.innerHTML = noneChip + `<div style="color:rgba(180,150,80,.4);font-size:11px;letter-spacing:1px;padding:16px 0;text-align:center;width:100%">背包里没有武器<br><span style="font-size:9px;opacity:.6">在武斗场胜利后可获得装备掉落</span></div>`;
  } else {
    poolEl.innerHTML = noneChip + bagWeps.map(({inst,tpl:w})=>{
      const sel      = edS.weaponInstId===inst.instId ? ' selected' : '';
      const rgb      = hex2rgb(w.color);
      const armsIdx  = getWepArmsIdx(w.id);
      const armsName = armsIdx!==null ? ED_PARTS.arms[armsIdx].l : '';
      const rarityClass = w.rarity==='mythic' ? ' mythic-chip'
                        : w.rarity==='legendary' ? ' legendary-chip' : '';
      const rarColor = RC[w.rarity]||'#aaa';
      const rarLabel = RL[w.rarity]||'';
      const needId   = !inst.identified;
      const unidCls  = needId ? ' unidentified' : '';
      const affixHtml= inst.identified
        ? renderAffixesHtml(inst.affixes, true)
        : `<div class="chip-unid-mark">？未鉴定</div>`;
      return `<div class="cp-wep-chip${sel}${rarityClass}${unidCls}"
        style="--cw-color:${w.color};--cw-glow:${w.glow||'rgba(200,150,80,.3)'};--cw-rgb:${rgb}"
        onclick="cpEquipWeapon('${inst.instId}')"
        title="${w.name}${armsName?'  →手臂:'+armsName:''}  [${w.type}]\n${w.special}">
        <div class="cp-wep-icon">${getWepMiniSymbol(w.cat)}</div>
        <div class="cp-wep-name">${w.name}</div>
        <div class="cp-wep-rarity" style="color:${rarColor}">${rarLabel}</div>
        <div style="font-size:7px;line-height:1.5;color:rgba(220,190,120,.6);text-align:center;margin-top:1px">
          ${w.atkBonus?`<span style="color:rgba(220,160,60,.8)">+${w.atkBonus}攻</span> `:''}${w.critBonus?`<span style="color:rgba(255,140,80,.7)">+${Math.round(w.critBonus*100)}%暴</span>`:''}
          ${(w.defBonus||w.hpBonus)?`<br>${w.defBonus?`<span style="color:rgba(100,180,255,.7)">+${w.defBonus}防</span> `:''}${w.hpBonus?`<span style="color:rgba(100,220,140,.7)">+${w.hpBonus}血</span>`:''}`:``}
          ${(w.mpBonus||w.dodgeBonus||w.speedBonus)?`<br>${w.mpBonus?`<span style="color:rgba(120,160,255,.7)">+${w.mpBonus}力</span> `:''}${w.dodgeBonus?`<span style="color:rgba(200,255,180,.7)">+${w.dodgeBonus}%闪</span> `:''}${w.speedBonus?`<span style="color:rgba(255,230,120,.7)">+${w.speedBonus}速</span>`:''}`:``}
        </div>
        ${armsName?`<div style="font-size:7px;color:rgba(160,220,140,.5);margin-top:1px">✋${armsName}</div>`:''}
        ${affixHtml}
      </div>`;
    }).join('');
  }

  // 当前装备展示
  const curInst = edS.weaponInstId ? bagFindInst(edS.weaponInstId) : null;
  const w = curInst ? WEAPONS.find(x=>x.id===curInst.templateId) : null;
  if(w && curInst){
    const armsIdx  = getWepArmsIdx(w.id);
    const armsName = armsIdx!==null ? ED_PARTS.arms[armsIdx].l : '';
    const rarColor = RC[w.rarity]||'#aaa';
    const rarLabel = RL[w.rarity]||'';
    const needId   = !curInst.identified;
    const affixBlock = curInst.identified
      ? (curInst.affixes?.length ? `<div style="margin-top:6px;padding:0 2px">${renderAffixesHtml(curInst.affixes, false)}</div>` : '')
      : `<div class="unidentified-mask">
            <div class="uid-icon">${getWepMiniSymbol(w.cat)}</div>
            <div class="uid-text">此装备尚未鉴定</div>
            <div class="identify-btn" onclick="identifyInst('${curInst.instId}')">✦ 鉴 定</div>
          </div>`;
    curEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span style="font-size:18px;font-family:'Courier New',monospace;color:${w.color};text-shadow:0 0 8px ${w.glow||'rgba(200,150,80,.5)'}">${getWepMiniSymbol(w.cat)}</span>
        <span style="color:${w.color};font-size:11px;letter-spacing:1px">${w.name}</span>
        <span style="font-size:9px;color:${rarColor};letter-spacing:1px">${rarLabel}</span>
        ${w.atkBonus?`<span style="font-size:9px;color:rgba(200,160,80,.6)">+${w.atkBonus}攻</span>`:''}
        ${w.critBonus?`<span style="font-size:9px;color:rgba(255,150,100,.6)">+${Math.round(w.critBonus*100)}%暴</span>`:''}
        ${w.defBonus?`<span style="font-size:9px;color:rgba(100,180,255,.6)">+${w.defBonus}防</span>`:''}
        ${w.hpBonus?`<span style="font-size:9px;color:rgba(100,220,140,.6)">+${w.hpBonus}血</span>`:''}
        ${w.mpBonus?`<span style="font-size:9px;color:rgba(120,160,255,.6)">+${w.mpBonus}力</span>`:''}
        ${w.dodgeBonus?`<span style="font-size:9px;color:rgba(200,255,180,.6)">+${w.dodgeBonus}%闪</span>`:''}
        ${w.speedBonus?`<span style="font-size:9px;color:rgba(255,230,120,.6)">+${w.speedBonus}速</span>`:''}
        ${armsName?`<span class="cp-arms-sync-tip">🤜→${armsName}</span>`:''}
      </div>
      ${affixBlock}
    `;
  } else {
    curEl.innerHTML = `<span style="color:rgba(200,180,140,.4);font-size:11px;letter-spacing:2px">— 未装备武器 —</span>`;
  }
}

function cpSetWepFilter(val, dimension){
  if(dimension==='rarity') _cpWepFilter = val;
  else _cpWepCatFilter = val;
  cpRefreshWeaponSelector();
}

function cpEquipWeapon(instId){
  edS.weaponInstId = instId;
  const wid = edS.weaponId; // 通过getter获取templateId
  if(wid){
    // 装备武器：解除手臂锁定，武器手臂优先
    const idx = getWepArmsIdx(wid);
    if(idx !== null){
      edS.parts.arms  = idx;
      edS.armsLocked  = false; // 解锁，允许下次切武器时继续自动切换
    }
  } else {
    // 卸下武器：解除锁定，手臂恢复默认（索引0）
    edS.parts.arms = 0;
    edS.armsLocked = false;
  }
  bagSave();
  // ★ 改造（2026-05-05）：统一调用 refreshEquippedStats()，缓存全部属性
  if (typeof refreshEquippedStats === 'function') {
    refreshEquippedStats();
  } else if (typeof getTotalStats === 'function') {
    const newStats = getTotalStats();
    edS.maxHp = newStats.hp;
    edS.maxMp = newStats.mp;
    edS.equippedMaxHp = newStats.hp;
    edS.equippedMaxMp = newStats.mp;
  }
  // 同步保存到 wuxia_editor，确保形象变更持久化
  if (typeof editorSave === 'function') editorSave();
  else if (typeof saveGameState === 'function') saveGameState();
  // ★ 修复（2026-05-05）：同时同步到权威源 wuxia_player_profile，防止刷新后装备状态丢失
  if (typeof WuxiaSave !== 'undefined' && typeof WuxiaSave.saveProfile === 'function') {
    WuxiaSave.saveProfile(edS);
  }
  cpRefreshWeaponSelector();
  edRenderPartOpts('arms');
  edRefreshPreview();
}

// ── 服装选择器 ──────────────────────────────────
let _cpCosFilter = 'all';

function cpRefreshCostumeSelector(){
  const filterEl = document.getElementById('cpCosFilter');
  const poolEl   = document.getElementById('cpCosPool');
  const curEl    = document.getElementById('cpCosCurrent');
  if(!filterEl || !poolEl) return;

  const RC = {mythic:'#aaddff', legendary:'#ffd060', epic:'#c080f0', rare:'#60b8ff', uncommon:'#60e090', common:'#a0a0a0'};
  const RL = {mythic:'神器', legendary:'传说', epic:'史诗', rare:'精良', uncommon:'精品', common:'普通'};
  const rarities = ['all','mythic','legendary','epic','rare','uncommon','common'];

  filterEl.innerHTML = rarities.map(r=>
    `<div class="cp-cos-filter-btn${_cpCosFilter===r?' active':''}"
     style="${r!=='all'?'border-color:'+RC[r]+'44;color:'+RC[r]+';opacity:.8':''}"
     onclick="cpSetCosFilter('${r}')">
      ${r==='all'?'全部':RL[r]}
    </div>`
  ).join('');

  // 从背包取服装实例
  let bagCos = (edS.bag||[])
    .filter(i=>i.type==='costume')
    .map(i=>({ inst:i, tpl:COSTUMES.find(c=>c.id===i.templateId) }))
    .filter(x=>x.tpl);
  bagCos.sort((a,b)=>(CS_RARITY[a.tpl.rarity]?.order??9)-(CS_RARITY[b.tpl.rarity]?.order??9));
  if(_cpCosFilter!=='all') bagCos=bagCos.filter(x=>x.tpl.rarity===_cpCosFilter);

  const noneChip = `<div class="cp-cos-chip none-chip${!edS.costumeInstId?' selected':''}" onclick="cpEquipCostume(null)">
    <div style="font-size:18px">🚫</div>
    <div class="cp-cos-name">无服装</div>
  </div>`;

  if(bagCos.length===0){
    poolEl.innerHTML = noneChip + `<div style="color:rgba(180,150,220,.4);font-size:11px;letter-spacing:1px;padding:16px 0;text-align:center;width:100%">背包里没有服装<br><span style="font-size:9px;opacity:.6">在武斗场胜利后可获得装备掉落</span></div>`;
  } else {
    poolEl.innerHTML = noneChip + bagCos.map(({inst,tpl:cs})=>{
      const ri = CS_RARITY[cs.rarity]||CS_RARITY.common;
      const isSel = edS.costumeInstId===inst.instId;
      const hasSect = !!cs.sectId;
      const sectName = hasSect ? (SECTS.find(s=>s.id===cs.sectId)?.name||cs.sectId) : '';
      const rarityAnimClass = cs.rarity==='mythic'?' mythic-chip': cs.rarity==='legendary'?' legendary-chip':'';
      const needId  = !inst.identified;
      const unidCls = needId ? ' unidentified' : '';
      const affixHtml = inst.identified
        ? renderAffixesHtml(inst.affixes, true)
        : `<div class="chip-unid-mark">？未鉴定</div>`;
      return `<div class="cp-cos-chip${isSel?' selected':''}${rarityAnimClass}${unidCls}"
        style="--cc-color:${ri.color};--cc-glow:${ri.glow}"
        onclick="cpEquipCostume('${inst.instId}')"
        title="${cs.name}\n${cs.desc}\n${cs.special}">
        <div class="cp-cos-icon">${getCosMiniSymbol(cs)}</div>
        <div class="cp-cos-name">${cs.name}</div>
        <div class="cp-cos-rarity" style="color:${ri.color};border:1px solid ${ri.border||ri.color+'33'}">${ri.label}</div>
        ${hasSect?`<div class="cp-cos-sect-lock">🔒${sectName}专属</div>`:''}
        ${affixHtml}
      </div>`;
    }).join('');
  }

  // 当前服装展示
  const curInst = edS.costumeInstId ? bagFindInst(edS.costumeInstId) : null;
  const cur = curInst ? COSTUMES.find(c=>c.id===curInst.templateId) : null;
  if(cur && curInst){
    const ri = CS_RARITY[cur.rarity]||CS_RARITY.common;
    const bonuses = [];
    if(cur.defBonus)   bonuses.push(`🛡️ 防御+${cur.defBonus}`);
    if(cur.hpBonus)    bonuses.push(`❤️ 气血+${cur.hpBonus}`);
    if(cur.mpBonus)    bonuses.push(`💙 内力+${cur.mpBonus}`);
    if(cur.atkBonus)   bonuses.push(`⚔️ 攻击+${cur.atkBonus}`);
    if(cur.critBonus)  bonuses.push(`🎯 暴击+${cur.critBonus}%`);
    if(cur.dodgeBonus) bonuses.push(`💨 闪避+${cur.dodgeBonus}%`);
    if(cur.speedBonus) bonuses.push(`⚡ 速度+${cur.speedBonus}`);
    Object.entries(cur.schoolBonus||{}).forEach(([k,v])=>bonuses.push(`✦ ${k}系+${Math.round(v*100)}%`));
    const affixBlock = curInst.identified
      ? (curInst.affixes?.length ? `<div style="margin-top:6px">${renderAffixesHtml(curInst.affixes, false)}</div>` : '')
      : `<div class="unidentified-mask">
          <div class="uid-text">此服装尚未鉴定</div>
          <div class="identify-btn" onclick="identifyInst('${curInst.instId}')">✦ 鉴 定</div>
        </div>`;
    curEl.innerHTML = `
      <span style="font-size:20px;font-family:'Courier New',monospace;font-weight:900;color:${cur.color};text-shadow:0 0 8px ${ri.glow||cur.color+'88'}">${getCosMiniSymbol(cur)}</span>
      <div style="flex:1">
        <div style="color:${ri.color};font-size:11px;letter-spacing:2px;font-weight:bold">${cur.name}
          <span style="font-size:8px;opacity:.7">【${ri.label}】</span>
        </div>
        <div class="cp-cos-bonuses">${bonuses.join('  ')}</div>
        <div style="font-size:9px;color:rgba(180,150,220,.6);margin-top:2px;letter-spacing:.5px">${cur.special}</div>
        ${affixBlock}
      </div>`;
  } else {
    curEl.innerHTML = `<span style="color:rgba(200,180,140,.4);font-size:11px;letter-spacing:2px">— 未装备服装 —</span>`;
  }
}

function cpSetCosFilter(val){ _cpCosFilter=val; cpRefreshCostumeSelector(); }

function cpEquipCostume(instId){
  edS.costumeInstId = instId;
  const cid = edS.costumeId;
  if(cid){
    const cs = COSTUMES.find(c=>c.id===cid);
    if(cs?.parts){
      // 视觉：服装图案直接替换默认体型显示
      if(typeof cs.parts.body === 'string'){
        edS.custom.body    = cs.parts.body;
        edS.useCustom.body = true;
      }
      if(typeof cs.parts.head === 'string'){
        edS.custom.head    = cs.parts.head;
        edS.useCustom.head = true;
      }
    }
  } else {
    // 脱服装：还原 body/head 为默认体型（数字索引模式）
    edS.useCustom.body = false;
    edS.custom.body    = '';
    edS.useCustom.head = false;
    edS.custom.head    = '';
  }
  // 清空叠加层（不再使用）
  edS.cosOverlay = { body:'', head:'' };
  // ★ 改造（2026-05-05）：统一调用 refreshEquippedStats()，缓存全部属性
  if (typeof refreshEquippedStats === 'function') {
    refreshEquippedStats();
  } else if (typeof getTotalStats === 'function') {
    const newStats = getTotalStats();
    edS.maxHp = newStats.hp;
    edS.maxMp = newStats.mp;
    edS.equippedMaxHp = newStats.hp;
    edS.equippedMaxMp = newStats.mp;
  }
  // 保存形象变更到 wuxia_editor
  if (typeof editorSave === 'function') editorSave();
  else if (typeof saveGameState === 'function') saveGameState();
  // ★ 修复（2026-05-05）：同时同步到权威源 wuxia_player_profile，防止刷新后装备状态丢失
  if (typeof WuxiaSave !== 'undefined' && typeof WuxiaSave.saveProfile === 'function') {
    WuxiaSave.saveProfile(edS);
  }
  cpRefreshCostumeSelector();
  edRefreshPreview();
}




function edRenderPartOpts(k){
  const el=document.getElementById('po-'+k);
  if(!el) return;
  el.innerHTML=ED_PARTS[k].map((o,i)=>{
    let locked = false, lockTip = '';
    // 气场：检查成就锁定
    if(k==='aura' && o.achId){
      locked = !edIsAuraUnlocked(i);
      if(locked){
        try{ const ach = (ACHIEVEMENT_DB[o.achId]||{}); lockTip = ach.name ? `🔒${ach.name}` : '🔒成就解锁'; } catch(e){ lockTip='🔒成就解锁'; }
      }
    }
    const sel = edS.parts[k]===i && !edS.useCustom[k];
    const cls = locked ? 'part-opt locked' : (sel ? 'part-opt sel' : 'part-opt');
    const onClick = locked ? '' : `onclick="edSel('${k}',${i})"`;
    const tip = locked ? ` title="${lockTip}"` : '';
    return `<div class="${cls}" ${onClick}${tip} style="${locked?'opacity:.45;cursor:not-allowed;':''}">${
      locked ? '<span style="font-size:9px;color:#888">🔒</span>' : ''
    }${o.v||'无'}\n<span style="font-size:8px;color:${locked?'#666':'#5a4828'};display:block;margin-top:2px">${o.l}</span></div>`;
  }).join('');
}

function edSel(k,i){
  // 气场锁定检查
  if(k==='aura' && !edIsAuraUnlocked(i)) return;
  edS.parts[k]=i; edS.useCustom[k]=false;
  // 手动选了手臂 → 锁定（无武器时保持选择，装备武器后会自动解锁并跟随武器）
  if(k==='arms'){
    edS.armsLocked = true;
  }
  // 选了body/head：如果当前穿着服装，服装外观继续覆盖显示
  // （底层索引已记录，脱服装后会恢复为该体型）
  if((k==='body'||k==='head') && edS.costumeId){
    const cs = COSTUMES.find(c=>c.id===edS.costumeId);
    if(cs?.parts && typeof cs.parts[k]==='string'){
      edS.custom[k]    = cs.parts[k];
      edS.useCustom[k] = true;
    }
  }
  edRenderPartOpts(k); edRefreshPreview();
  if (typeof editorSave === 'function') editorSave();
  else if (typeof saveGameState === 'function') saveGameState();
}

function edCustom(k){
  const ta=document.getElementById('ct-'+k);
  if(!ta) return;
  const v=ta.value.trim();
  if(!v){edS.useCustom[k]=false;edRefreshPreview();return;}
  edS.custom[k]=v; edS.useCustom[k]=true;
  // 取消预设高亮
  document.querySelectorAll(`#po-${k} .part-opt`).forEach(o=>o.classList.remove('sel'));
  edRefreshPreview();
  if (typeof editorSave === 'function') editorSave();
  else if (typeof saveGameState === 'function') saveGameState();
}

// ── 头像框选择 ─────────────────────────────────────────────────────────
const RARITY_COLORS_ED={ mythic:'#ffffff',legendary:'#ffd060',epic:'#c060ff',rare:'#60a8ff',uncommon:'#44cc88',common:'#a0a0a0' };

function edRenderFrameOpts(){
  const el=document.getElementById('po-frame');
  const cur=document.getElementById('edFrameCur');
  if(!el) return;
  const frames=Object.values(FRAME_DB);
  el.innerHTML=frames.map(f=>{
    const locked=!edIsFrameUnlocked(f.id);
    const sel=edS.equippedFrame===f.id;
    const color=RARITY_COLORS_ED[f.rarity]||'#a0a0a0';
    let lockTip='';
    if(locked&&f.achId){
      try{ const ach=(ACHIEVEMENT_DB[f.achId]||{}); lockTip=ach.name?`🔒${ach.name}`:''; }catch(e){}
    }
    const tip=lockTip?` title="${lockTip}"`:'';
    const style=locked?'opacity:.4;cursor:not-allowed;':'';
    const preview=`<div style="width:38px;height:30px;border-radius:4px;${f.css.replace(/;$/,'')};pointer-events:none"></div>`;
    const extraStyle=sel&&!locked?`border-color:${color};box-shadow:0 0 8px ${color}88;`:'';
    const cls=`part-opt${sel&&!locked?' sel':''}`;
    const onclick=locked?'':` onclick="edSelFrame('${f.id}')"`;
    return `<div class="${cls}"${onclick}${tip} style="${style}${extraStyle}">
  ${locked?'<span style="font-size:9px;color:#666">🔒</span>':''}${preview}
  <span style="font-size:7px;color:${locked?'#666':color};display:block;text-align:center;margin-top:1px">${f.name}</span>
</div>`;
  }).join('');
  if(cur) cur.textContent=(FRAME_DB[edS.equippedFrame]||{}).name||'';
}

function edSelFrame(id){
  if(!edIsFrameUnlocked(id)) return;
  edS.equippedFrame=id;
  edRenderFrameOpts(); edRefreshPreview();
}

// ── 称号牌选择 ─────────────────────────────────────────────────────────
function edRenderTitleOpts(){
  const el=document.getElementById('po-titleplate');
  const cur=document.getElementById('edTitleCur');
  if(!el) return;
  const titles=Object.values(TITLE_PLATE_DB);
  el.innerHTML=titles.map(t=>{
    const locked=!edIsTitleUnlocked(t.id);
    const sel=edS.equippedTitlePlate===t.id;
    const color=RARITY_COLORS_ED[t.rarity]||'#a0a0a0';
    let lockTip='';
    if(locked&&t.achId){
      try{ const ach=(ACHIEVEMENT_DB[t.achId]||{}); lockTip=ach.name?`🔒${ach.name}`:''; }catch(e){}
    }
    const tip=lockTip?` title="${lockTip}"`:'';
    const style=locked?'opacity:.4;cursor:not-allowed;':'';
    const extraStyle=sel&&!locked?`border-color:${color};box-shadow:0 0 8px ${color}88;`:'';
    const cls=`part-opt${sel&&!locked?' sel':''}`;
    const onclick=locked?'':` onclick="edSelTitle('${t.id}')"`;
    return `<div class="${cls}"${onclick}${tip} style="${style}${extraStyle}">
  ${locked?'<span style="font-size:9px;color:#666">🔒</span>':''}
  <span style="font-size:8px;color:${locked?'#666':color};display:block;text-align:center">${t.label||'无'}</span>
</div>`;
  }).join('');
  if(cur){
    const t=TITLE_PLATE_DB[edS.equippedTitlePlate]||{};
    cur.textContent=t.title||'';
  }
}

function edSelTitle(id){
  if(!edIsTitleUnlocked(id)) return;
  edS.equippedTitlePlate=id;
  edRenderTitleOpts(); edRefreshPreview();
}

function edSetColor(c){
  edS.color=c;
  document.querySelectorAll('.color-dot').forEach(d=>d.classList.toggle('sel',d.style.background===c));
  edRefreshPreview();
}


function edRandom(){
  Object.keys(edS.parts).forEach(k=>{ edS.parts[k]=Math.floor(Math.random()*ED_PARTS[k].length); edS.useCustom[k]=false; });
  edS.color=ED_COLORS[Math.floor(Math.random()*ED_COLORS.length)];
  // 随机气场时只选已解锁的
  const unlockedAuras=ED_PARTS.aura.map((_,i)=>i).filter(i=>edIsAuraUnlocked(i));
  edS.parts.aura=unlockedAuras.length>0?unlockedAuras[Math.floor(Math.random()*unlockedAuras.length)]:0;
  edBuilt=false; edInit();
  document.getElementById('edColorRow').querySelectorAll('.color-dot').forEach(d=>d.classList.toggle('sel',d.style.background===edS.color));
}

function edReset(){
  Object.keys(edS.parts).forEach(k=>{ edS.parts[k]=0; edS.useCustom[k]=false; edS.custom[k]=''; });
  edS.color='#f0c060';
  edS.weaponInstId=null; edS.costumeInstId=null; edS.armsLocked=false; edS.bag=[];
  edS.equippedFrame='frame_none'; edS.equippedTitlePlate='title_none';
  edBuilt=false; edInit();
}

function edSave(){
  const name=(document.getElementById('edName')?.value||'').trim()||'无名侠';
  const title=(document.getElementById('edTitle')?.value||'').trim()||'江湖客';
  const ascii=edBuild(); const stats=edStats();
  let saved; try{ saved=JSON.parse(localStorage.getItem('wuxia_cc')||'[]'); }catch(e){ saved=[]; }
  saved.push({id:'cc'+Date.now(),name,title,ascii,color:edS.color,parts:{...edS.parts},custom:{...edS.custom},useCustom:{...edS.useCustom},stats,weaponInstId:edS.weaponInstId||null,costumeInstId:edS.costumeInstId||null,bag:JSON.parse(JSON.stringify(edS.bag||[])),equippedFrame:edS.equippedFrame||'frame_none',equippedTitlePlate:edS.equippedTitlePlate||'title_none'});
  localStorage.setItem('wuxia_cc',JSON.stringify(saved));
  edRefreshSaved();
  const btn=document.querySelector('.pv-btn.save');
  if(btn){const old=btn.textContent;btn.textContent='✅ 已保存！';setTimeout(()=>btn.textContent=old,1300);}
}

function edRefreshSaved(){
  let saved; try{ saved=JSON.parse(localStorage.getItem('wuxia_cc')||'[]'); }catch(e){ saved=[]; }
  const el=document.getElementById('savedGrid');
  if(!el) return;
  if(!saved.length){el.innerHTML='<div class="saved-empty">还没有角色，快去捏一个！</div>';return;}
  el.innerHTML=saved.map(c=>`
    <div class="saved-chip" onclick="edLoad('${c.id}')">
      <div><div class="saved-name" style="color:${c.color}">${c.name}</div><div class="saved-sub">${c.title}</div></div>
      <div class="saved-del" onclick="event.stopPropagation();edDel('${c.id}')">✕</div>
    </div>`).join('');
}

function edLoad(id){
  let saved; try{ saved=JSON.parse(localStorage.getItem('wuxia_cc')||'[]'); }catch(e){ saved=[]; }
  const c=saved.find(x=>x.id===id); if(!c) return;
  Object.assign(edS.parts,c.parts);
  Object.assign(edS.custom,c.custom||{});
  Object.assign(edS.useCustom,c.useCustom||{});
  edS.color=c.color;
  edS.weaponInstId=c.weaponInstId||null;
  edS.costumeInstId=c.costumeInstId||null;
  edS.bag = JSON.parse(JSON.stringify(c.bag||[]));
  edS.equippedFrame=c.equippedFrame||'frame_none';
  edS.equippedTitlePlate=c.equippedTitlePlate||'title_none';
  if(document.getElementById('edName')) document.getElementById('edName').value=c.name;
  if(document.getElementById('edTitle')) document.getElementById('edTitle').value=c.title;
  edBuilt=false; edInit();
}

function edDel(id){
  let saved; try{ saved=JSON.parse(localStorage.getItem('wuxia_cc')||'[]'); }catch(e){ saved=[]; }
  saved=saved.filter(x=>x.id!==id);
  localStorage.setItem('wuxia_cc',JSON.stringify(saved));
  edRefreshSaved();
}

function edFightWith(){
  const name=(document.getElementById('edName')?.value||'').trim()||'无名侠';
  const title=(document.getElementById('edTitle')?.value||'').trim()||'江湖客';
  const ascii=edBuild(); const stats=edStats();
  const tmp={
    id:'cp_self',name,title,tag:'自创英雄',tagColor:edS.color,color:edS.color,
    maxHp:stats.hp, atk:stats.atk, def:stats.def,
    crit:stats.crit,      // 暴击率%（体型加成）
    dodge:stats.dodge,    // 闪避率%（体型加成）
    maxMp:stats.mp,       // 内力上限（体型加成）
    speedN:stats.spd,     // 速度数值（体型加成）
    speed: stats.spd >= 10 ? '极快' : stats.spd >= 9 ? '快' : stats.spd >= 8 ? '中' : stats.spd >= 7 ? '慢' : '极慢',
    desc:'玩家亲手捏制的专属角色',
    stand:ascii,attack:[ascii],heavy:[ascii],hit:[ascii],down:ascii,
    weaponId: edS.weaponId||null,
    skillIds: cpSkillIds||['cm01','cm02','cm03','cm04','cm05','cm06','cm07'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  };
  const idx=CHARS.findIndex(c=>c.id==='cp_self');
  if(idx>=0) CHARS[idx]=tmp; else CHARS.push(tmp);
  LH=tmp;
  RH=CHARS.find(c=>c.id!=='cp_self')||CHARS[0];
  const fightTab=[...document.querySelectorAll('.tab')].find(t=>t.textContent.includes('武斗场'));
  showPage('fight',fightTab);
  setTimeout(()=>resetFight(),80);
}

// ═══════════════════════════════════════════════════════
//  解锁提示（供背包装饰面板使用）
// ═══════════════════════════════════════════════════════
function _auraUnlockHint(achId) {
  if (!achId) return '';
  try {
    var ach = ACHIEVEMENT_DB[achId];
    return ach ? '成就：' + ach.name : achId;
  } catch(e) { return achId; }
}
function _frameUnlockHint(fid) {
  var f = FRAME_DB[fid];
  if (!f || !f.achId) return '';
  try {
    var ach = ACHIEVEMENT_DB[f.achId];
    return ach ? ach.name : f.achId;
  } catch(e) { return f.achId; }
}
function _titleUnlockHint(tid) {
  var t = TITLE_PLATE_DB[tid];
  if (!t || !t.achId) return '';
  try {
    var ach = ACHIEVEMENT_DB[t.achId];
    return ach ? ach.name : t.achId;
  } catch(e) { return t.achId; }
}

// ════════════════════════════════════════════════════════════════════════
//  初始化（仅在有 galleryWrap 时执行，避免 sect.html 等页面干扰）
// ════════════════════════════════════════════════════════════════════════
if (typeof document !== 'undefined') {
  if (document.getElementById('galleryWrap') && typeof renderGallery === 'function') {
    try { renderGallery(); } catch(e) { console.warn('[editor] renderGallery error:', e); }
  }
  if (document.getElementById('fL') && typeof resetFight === 'function') {
    try { resetFight(); } catch(e) { console.warn('[editor] resetFight error:', e); }
  }
}

