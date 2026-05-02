/**
 * ============================================================================
 * story-cutscenes.js  主线剧情过场动画系统
 * ============================================================================
 *
 * 用法：
 *   StoryCS.play('cs_intro')           // 播放序章过场
 *   StoryCS.play('cs_ch1_end', cb)     // 播放完后执行回调
 *   StoryCS.skip()                     // 强制跳过当前过场
 *
 * 触发时机（由 story-main-quest.js 调用）：
 *   序章   → cs_intro         游戏开始后立即播放世界背景
 *   第一章结束 → cs_ch1_end   第一块玄铁令线索浮现
 *   第二章结束 → cs_ch2_end   三块碎片合璧，玄铁令显形
 *   第三章结束 → cs_ch3_end   正道会盟成立，内鬼伏法
 *   第四章结束 → cs_ch4_end   潜入得到密约，决战在即
 *   第五章结束 → cs_ch5_end   骨冥子落败，玄铁令封印
 *   第六章结束 → cs_ch6_end   尾声·北疆来信（全局通关）
 *   特殊     → cs_boss_gumingzi   骨冥子决战前出场动画
 *   特殊     → cs_xuantie_reveal  玄铁令真相大白
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════
//  过场数据库  CUTSCENE_DB
//  每条过场包含：帧序列 + 台词序列 + 音效标记
// ═══════════════════════════════════════════════════════

const CUTSCENE_DB = {

  // ──────────────────────────────────────────────────────
  //  序章  ·  江湖，乱了
  // ──────────────────────────────────────────────────────
  cs_intro: {
    id: 'cs_intro',
    title: '序章 · 江湖，乱了',
    skippable: true,
    frames: [
      {
        art: [
          '                                          ',
          '   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ',
          '   ░                                ░   ',
          '   ░   天下三分，烽烟四起。          ░   ',
          '   ░                                ░   ',
          '   ░        大齐，将衰。            ░   ',
          '   ░                                ░   ',
          '   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ',
          '                                          ',
        ],
        caption: '天下三分，烽烟四起。大齐王朝历经百年，国祚将衰……',
        delay: 2200,
      },
      {
        art: [
          '                                          ',
          '        🏔  嵩山少林  🏔               ',
          '                                          ',
          '   ┌──────────────────────────────────┐  ',
          '   │  ⛪⛪⛪  少林寺  ⛪⛪⛪       │  ',
          '   │           ↑                      │  ',
          '   │    钟鼓楼  |  大雄宝殿           │  ',
          '   │           |                      │  ',
          '   │  ⚔ 正道联盟  ⚔                 │  ',
          '   │  少林·武当·华山·昆仑……       │  ',
          '   └──────────────────────────────────┘  ',
          '                                          ',
        ],
        caption: '少林武当领衔正道，百年来守护武林太平。',
        delay: 2200,
      },
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║  ☠  三  魔  联  盟  ☠         ║  ',
          '   ╠══════════════════════════════════╣  ',
          '   ║                                  ║  ',
          '   ║   血骨门  ─────  骨冥子         ║  ',
          '   ║   玄冥教  ─────  冰魄宫主       ║  ',
          '   ║   日月神教 ────  左右护法       ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '血骨门、玄冥教、日月神教，秘密结盟，图谋颠覆武林秩序。',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '        ✨  玄  铁  令  ✨             ',
          '                                          ',
          '   ╔══╗    ╔══╗    ╔══╗             ',
          '   ║碎║    ║碎║    ║碎║             ',
          '   ║片║    ║片║    ║片║             ',
          '   ║①║    ║②║    ║③║             ',
          '   ╚══╝    ╚══╝    ╚══╝             ',
          '    ↓       ↓       ↓               ',
          '   ╔════════════════════╗            ',
          '   ║   👁  玄铁令  👁  ║            ',
          '   ║  号令天下兵器之王  ║            ',
          '   ╚════════════════════╝            ',
          '                                          ',
        ],
        caption: '玄铁令——传说可号令天下兵器，武功倍增。三魔联盟为之疯狂。',
        delay: 2600,
      },
      {
        art: [
          '                                          ',
          '   ┌──────────────────────────────────┐  ',
          '   │                                  │  ',
          '   │          你，踏入江湖。           │  ',
          '   │                                  │  ',
          '   │   命运的齿轮，从这一刻开始转动。  │  ',
          '   │                                  │  ',
          '   └──────────────────────────────────┘  ',
          '                                          ',
          '               [ 按任意处继续 ]           ',
          '                                          ',
        ],
        caption: '一切，从你踏入江湖的那一天起，悄然改变……',
        delay: 999999, // 等待用户点击
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  第一章结束  ·  锦囊开启
  // ──────────────────────────────────────────────────────
  cs_ch1_end: {
    id: 'cs_ch1_end',
    title: '第一章终 · 锦囊的秘密',
    skippable: true,
    frames: [
      {
        art: [
          '                                    ',
          '   ╔══════════════════════════╗   ',
          '   ║   📦  钟 恒 的 锦 囊   ║   ',
          '   ╚══════════════════════════╝   ',
          '                                    ',
          '         ┌──────────┐              ',
          '         │  🔩 锦囊 │              ',
          '         │  缓缓开启│              ',
          '         └────┬─────┘              ',
          '              │                    ',
          '              ▼                    ',
          '         【 残缺地图 】            ',
          '                                    ',
        ],
        caption: '锦囊开启——里面是一张破旧的残缺地图，以及一行字……',
        delay: 2000,
      },
      {
        art: [
          '                                          ',
          '   ┌──────────────────────────────────┐  ',
          '   │                                  │  ',
          '   │   ▓░░░░░░░░░░░░░░░░░░░░░░░░░▓   │  ',
          '   │   ░  〔 残 缺 地 图 〕     ░   │  ',
          '   │   ░                          ░   │  ',
          '   │   ░   ？─────开封            ░   │  ',
          '   │   ░         │                ░   │  ',
          '   │   ░       扬州               ░   │  ',
          '   │   ░         │                ░   │  ',
          '   │   ░       凉州？？？         ░   │  ',
          '   │   ░                          ░   │  ',
          '   │   ▓░░░░░░░░░░░░░░░░░░░░░░░░░▓   │  ',
          '   │                                  │  ',
          '   └──────────────────────────────────┘  ',
        ],
        caption: '地图上隐约可见三处标记：开封、扬州、凉州——三块玄铁令碎片的所在！',
        delay: 2600,
      },
      {
        art: [
          '                                          ',
          '   ┌──────────────────────────────────┐  ',
          '   │                                  │  ',
          '   │      🧙 鹤隐的声音响起……        │  ',
          '   │                                  │  ',
          '   │  「三块碎片——血骨门已经出发了。 │  ',
          '   │   我们的时间，不多了……」         │  ',
          '   │                                  │  ',
          '   └──────────────────────────────────┘  ',
          '                                          ',
          '        第一章 · 血雨腥风  ✓ 完成        ',
          '                                          ',
          '        ➤  第二章 · 玄铁迷踪  开启       ',
          '                                          ',
        ],
        caption: '追查三块碎片，方能阻止骨冥子的阴谋。',
        delay: 999999,
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  第二章结束  ·  玄铁令显形
  // ──────────────────────────────────────────────────────
  cs_ch2_end: {
    id: 'cs_ch2_end',
    title: '第二章终 · 玄铁令，现世！',
    skippable: true,
    frames: [
      {
        art: [
          '                                          ',
          '     ≋≋≋≋≋     ╔══╗    ╔══╗    ╔══╗   ',
          '     ☯(⊙)☯      ║碎║    ║碎║    ║碎║   ',
          '     ╭───╮       ║片║    ║片║    ║片║   ',
          '     ╰┤ ├╯       ║①║    ║②║    ║③║   ',
          '       ││         ╚══╝    ╚══╝    ╚══╝   ',
          '                                    ',
          '       三 块 碎 片 已 齐 聚         ',
          '                                    ',
          '      鹤隐的双手，微微颤抖着……     ',
          '                                    ',
        ],
        caption: '三块碎片终于集于一处。鹤隐的双手微微颤抖……',
        delay: 2200,
      },
      {
        art: [
          '                                          ',
          '          ✨✨✨✨✨✨✨✨✨✨           ',
          '        ✨                    ✨         ',
          '      ✨    ╔══════════╗      ✨       ',
          '    ✨      ║          ║        ✨     ',
          '    ✨      ║  👁玄铁令 ║        ✨     ',
          '    ✨      ║          ║        ✨     ',
          '      ✨    ╚══════════╝      ✨       ',
          '        ✨                    ✨         ',
          '          ✨✨✨✨✨✨✨✨✨✨           ',
          '                                          ',
          '          碎片合璧，金光乍现！            ',
          '                                          ',
        ],
        caption: '碎片合璧！一股难以名状的力量从令牌上涌出，震得周围空气颤抖！',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║                                  ║  ',
          '   ║   「此令……竟真的存在……」         ║  ',
          '   ║                                  ║  ',
          '   ║     鹤隐神色骤变，低声说：        ║  ',
          '   ║                                  ║  ',
          '   ║   「玄铁令的力量，无人能独吞。   ║  ',
          '   ║    但骨冥子……他不会放弃的。」    ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '玄铁令真实存在。但它究竟是宝物，还是诅咒？',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║  正道必须联合！联手抵御三魔联盟！║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
          '     ┌─────────────────────────────┐     ',
          '     │  前往少林寺，召开正道会盟！  │     ',
          '     └─────────────────────────────┘     ',
          '                                          ',
          '        第二章 · 玄铁迷踪  ✓ 完成        ',
          '                                          ',
          '        ➤  第三章 · 正道会盟  开启       ',
          '                                          ',
        ],
        caption: '时不我待——正道必须联合，阻止骨冥子得到玄铁令的全部力量！',
        delay: 999999,
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  第三章结束  ·  内鬼落网，正道成盟
  // ──────────────────────────────────────────────────────
  cs_ch3_end: {
    id: 'cs_ch3_end',
    title: '第三章终 · 正道，一心',
    skippable: true,
    frames: [
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║   ⛩️  少林寺大雄宝殿  ⛩️        ║  ',
          '   ╠══════════════════════════════════╣  ',
          '   ║                                  ║  ',
          '   ║  少林方丈：「内奸已揪出，         ║  ',
          '   ║              各派当合力。」        ║  ',
          '   ║                                  ║  ',
          '   ║  武当掌门：「血骨门一日不灭，     ║  ',
          '   ║              江湖一日不宁。」      ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '内奸落网，各派掌门齐聚少林大殿，商议联盟事宜。',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   ┌──────────────────────────────────┐  ',
          '   │                                  │  ',
          '   │    🗡  正  道  会  盟  🗡       │  ',
          '   │                                  │  ',
          '   │  少林  武当  华山  昆仑  峨眉   │  ',
          '   │                                  │  ',
          '   │  ──────────────────────────   │  ',
          '   │                                  │  ',
          '   │   联 合 印 记 已 盖 下 ✓        │  ',
          '   │                                  │  ',
          '   └──────────────────────────────────┘  ',
          '                                          ',
        ],
        caption: '五大正道门派联合印记落下——正道会盟，正式成立！',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '     但鹤隐在你耳边低语：                 ',
          '                                          ',
          '   ≋≋≋  ──「会盟虽成，但三魔联盟已      ',
          '   ☯(⊙)     探知了正道的底牌……」       ',
          '   ╭──╮                                ',
          '   ╰┤ ├╯  ──「我需要一个人，独自潜入   ',
          '     ││      敌巢，取得密约原件。」       ',
          '                                          ',
          '         他望向你。                       ',
          '                  ∩∩∩                    ',
          '                  (O)                     ',
          '                  ┤ ├                     ',
          '                                          ',
        ],
        caption: '鹤隐的眼神落在你身上——只有你，才能完成这个任务。',
        delay: 999999,
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  第四章结束  ·  密约在手，决战在即
  // ──────────────────────────────────────────────────────
  cs_ch4_end: {
    id: 'cs_ch4_end',
    title: '第四章终 · 铁证如山',
    skippable: true,
    frames: [
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║  📜  三  魔  密  约  📜        ║  ',
          '   ╠══════════════════════════════════╣  ',
          '   ║                                  ║  ',
          '   ║  【甲方】血骨门  门主：骨冥子    ║  ',
          '   ║  【乙方】玄冥教  宫主：冰魄      ║  ',
          '   ║  【丙方】日月神教 教主：……      ║  ',
          '   ║                                  ║  ',
          '   ║  约定：三家联手，以玄铁令称霸……  ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '密约在手！三魔联盟的罪证，白纸黑字，铁证如山。',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   武当掌门接过密约，眼中精光一闪：       ',
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║                                  ║  ',
          '   ║  「有此铁证，江湖各派皆无退路。  ║  ',
          '   ║                                  ║  ',
          '   ║   总攻，就在三日后。             ║  ',
          '   ║                                  ║  ',
          '   ║   沧州——血骨门总坛。」           ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '决战，定在三日后。目标——沧州，血骨门总坛！',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   ┌──────────────────────────────────┐  ',
          '   │                                  │  ',
          '   │   沧州  ←──  正道联军出发        │  ',
          '   │                                  │  ',
          '   │      ██████████████████          │  ',
          '   │      █  血骨门总坛  █            │  ',
          '   │      ██████████████████          │  ',
          '   │                                  │  ',
          '   │   最终决战，即将打响！            │  ',
          '   │                                  │  ',
          '   └──────────────────────────────────┘  ',
          '                                          ',
          '        第四章 · 孤身潜入  ✓ 完成        ',
          '        ➤  第五章 · 决战血骨门  开启     ',
          '                                          ',
        ],
        caption: '正道联军浩浩荡荡，向沧州进发。这一战，将终结一切……',
        delay: 999999,
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  骨冥子决战前出场  ·  BOSS登场动画
  // ──────────────────────────────────────────────────────
  cs_boss_gumingzi: {
    id: 'cs_boss_gumingzi',
    title: '骨冥子 · 现身',
    skippable: false, // 不可跳过，增强仪式感
    frames: [
      {
        art: [
          '                                          ',
          '   ████████████████████████████████████  ',
          '   █                                  █  ',
          '   █    黑暗中，一道身影缓缓走出……    █  ',
          '   █                                  █  ',
          '   ████████████████████████████████████  ',
          '                                          ',
        ],
        caption: '黑暗中，脚步声由远及近……',
        delay: 1800,
      },
      {
        art: [
          '                                          ',
          '          ☠️ 血 骨 门 门 主 ☠️         ',
          '                                          ',
          '            ╱|│|╲                        ',
          '           ╱ │   │ ╲                     ',
          '          ╱  │ 👁 │  ╲                  ',
          '         ╱═══╪═══╪═══╲                   ',
          '           ╱ ╲   ╱ ╲                     ',
          '    ════════════════════════              ',
          '    ║  骨冥子 · 第四十代门主  ║           ',
          '    ════════════════════════              ',
          '      血骨神功  ·  江湖第一恶人           ',
          '                                          ',
        ],
        caption: '骨冥子——血骨门第四十代门主，身负血魔内功，江湖第一恶人。',
        delay: 2200,
      },
      {
        art: [
          '                                          ',
          '   「哈哈哈……终于来了。」                   ',
          '                                          ',
          '              ╱|│|╲                       ',
          '             ╱ │👁│ ╲                      ',
          '            ╱  │   │  ╲                   ',
          '           ╱═══╪═══╪═══╲                  ',
          '             ╱ ╲ ╱ ╲                       ',
          '              ▓▓▓▓▓                        ',
          '         ╭─── 玄铁令 ───╮                 ',
          '         ╰─── 👁 ✨ 👁 ───╯                ',
          '                                          ',
          '         骨冥子缓缓转过身——               ',
          '                                          ',
        ],
        caption: '他手中——竟已握有玄铁令！',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '              ╱|│|╲                       ',
          '             ╱ │▼▼│ ╲                      ',
          '            ╱  │   │  ╲                   ',
          '           ╱═══╪═══╪═══╲                  ',
          '             ╱ ╲ ╱ ╲                       ',
          '              ▓▓▓▓▓                        ',
          '             █╱   ╲█                       ',
          '            煞气如潮                         ',
          '   ────────────────────────────────────  ',
          '                                          ',
          '         ⚔  决  战  开  始  ⚔          ',
          '                                          ',
          '   ────────────────────────────────────  ',
          '                                          ',
        ],
        caption: '骨冥子的眼中没有任何情感。这是最强的敌人——也是最后的敌人。',
        delay: 2600,
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  第五章结束  ·  骨冥子落败，玄铁令封印
  // ──────────────────────────────────────────────────────
  cs_ch5_end: {
    id: 'cs_ch5_end',
    title: '第五章终 · 封印重启',
    skippable: true,
    frames: [
      {
        art: [
          '                                          ',
          '   骨冥子跌落在地——                       ',
          '                                          ',
          '          ╱│╲                             ',
          '         ╱ │ ╲                            ',
          '    ☠️ ╱  │   ╲  👁                       ',
          '       ╲ ╱ ╲ ╱                             ',
          '        ▓▓▓▓▓                              ',
          '         ═════                             ',
          '       「……不可能……」                       ',
          '                                          ',
          '            ┌──────┐                       ',
          '            │玄铁令│→→→                    ',
          '            └──────┘                       ',
          '                                          ',
        ],
        caption: '骨冥子败了。眼中，第一次出现了恐惧。',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   鹤隐缓步走来，拾起玄铁令——            ',
          '                                          ',
          '     ≋≋≋≋≋      ✨ 玄铁令 ✨          ',
          '     ☯(⊙)☯        ┌────┐                ',
          '     ╭───╮         │令  │                ',
          '     ╰┤ ├╯         │牌  │                ',
          '       ││           └──┬─┘                ',
          '                  ✨封印启动✨             ',
          '                                          ',
          '   光芒逐渐黯淡，扭曲的力量被封印。       ',
          '                                          ',
          '   ══════════════════════════════════    ',
          '                                          ',
          '              【 封印完成 】               ',
          '                                          ',
        ],
        caption: '鹤隐将玄铁令的力量重新封印——此物太危险，不能落入任何人之手。',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║                                  ║  ',
          '   ║   正道联军：「胜了！」             ║  ',
          '   ║                                  ║  ',
          '   ╠══════════════════════════════════╣  ',
          '   ║                                  ║  ',
          '   ║   血骨门——覆灭。                 ║  ',
          '   ║   玄冥教——溃散。                 ║  ',
          '   ║   日月神教——仓皇北逃。           ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '三魔联盟瓦解。江湖，终于重归平静……',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   但是……                                ',
          '                                          ',
          '         ╱│╲                             ',
          '        ╱ │ ╲                            ',
          '   ☠️ ╱  │···│  ╲                        ',
          '      ╲ ╱·╲ ╱                             ',
          '       ▓▓▓▓▓                              ',
          '   「北疆……那里……才……」                  ',
          '   「是……真正的……」                       ',
          '                                          ',
          '              💀                          ',
          '          气绝身亡。                      ',
          '                                          ',
          '        第五章 · 决战血骨门  ✓ 完成      ',
          '        ➤  第六章 · 江湖新序  开启       ',
          '                                          ',
        ],
        caption: '北疆……骨冥子死前的最后一句话，让所有人不寒而栗。',
        delay: 999999,
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  第六章结束  ·  尾声·新的开始
  // ──────────────────────────────────────────────────────
  cs_ch6_end: {
    id: 'cs_ch6_end',
    title: '尾声 · 江湖路，仍未尽',
    skippable: false,
    frames: [
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║                                  ║  ',
          '   ║   洛阳城，庆功宴。               ║  ',
          '   ║                                  ║  ',
          '   ║   灯火通明，笑语不断，           ║  ',
          '   ║   江湖难得的太平。               ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
          '            🎆 🎇 🎆                    ',
          '                                          ',
        ],
        caption: '洛阳城的庆功宴，彻夜未息。这一刻，属于所有守护江湖的人。',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   宴后，你找到鹤隐。                     ',
          '   他负手而立，望着北方的天际。           ',
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║                                  ║  ',
          '   ║   「骨冥子死前说的那句话……        ║  ',
          '   ║                                  ║  ',
          '   ║    北疆。」                        ║  ',
          '   ║                                  ║  ',
          '   ║   「比骨冥子更古老的恐怖，        ║  ',
          '   ║    正在那里苏醒。」               ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '鹤隐的话，让欢庆的气氛骤然凝固。',
        delay: 2600,
      },
      {
        art: [
          '                                          ',
          '   鹤隐转身，将一封信递给你：             ',
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║  📜  北疆密报                    ║  ',
          '   ╠══════════════════════════════════╣  ',
          '   ║                                  ║  ',
          '   ║  「极北之地，有古寺。             ║  ',
          '   ║   古寺中，封印着某样东西。        ║  ',
          '   ║   骨冥子此生，皆为此物服务。」    ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '北疆……比玄铁令更古老，比骨冥子更可怕的存在？',
        delay: 2600,
      },
      {
        art: [
          '                                          ',
          '   你望向北方——                          ',
          '                                          ',
          '                  ·  ·  ·                 ',
          '                ·        ·               ',
          '              ·    ☁ 北疆   ·            ',
          '            ·    地平线      ·            ',
          '                                          ',
          '            ∩∩∩                           ',
          '            (O)│                           ',
          '           ┤  │├                          ',
          '            ╱││╲                           ',
          '          ════════                         ',
          '                                          ',
          '   ══════════════════════════════════    ',
          '                                          ',
          '       第一章  ·  完                     ',
          '                                          ',
          '       新的旅途，从北疆开始……            ',
          '                                          ',
          '   ══════════════════════════════════    ',
          '                                          ',
          '           〖 感谢游玩江湖将将胡 〗       ',
          '                                          ',
        ],
        caption: '江湖的故事，从未真正结束。',
        delay: 999999,
      },
    ],
  },

  // ──────────────────────────────────────────────────────
  //  玄铁令真相大白  ·  特殊过场（鹤隐解读令牌）
  // ──────────────────────────────────────────────────────
  cs_xuantie_reveal: {
    id: 'cs_xuantie_reveal',
    title: '玄铁令的真相',
    skippable: true,
    frames: [
      {
        art: [
          '                                          ',
          '   鹤隐手持合璧后的玄铁令，               ',
          '   沉默良久。                             ',
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║   👁  玄  铁  令  👁            ║  ',
          '   ╠══════════════════════════════════╣  ',
          '   ║                                  ║  ',
          '   ║   令牌背面，隐约有文字浮现……     ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '令牌上，有文字浮现……',
        delay: 2000,
      },
      {
        art: [
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║                                  ║  ',
          '   ║   「此令乃封印之钥。             ║  ',
          '   ║                                  ║  ',
          '   ║    北疆冰原，有古寺。            ║  ',
          '   ║    古寺之下，有封印。            ║  ',
          '   ║    封印之中，有……」              ║  ',
          '   ║                                  ║  ',
          '   ║         文字到此中断。            ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '玄铁令不是武器——它是封印的钥匙！',
        delay: 2400,
      },
      {
        art: [
          '                                          ',
          '   鹤隐面色骤变：                         ',
          '                                          ',
          '   ╔══════════════════════════════════╗  ',
          '   ║                                  ║  ',
          '   ║  「骨冥子寻找玄铁令……            ║  ',
          '   ║   并非为了号令天下兵器……         ║  ',
          '   ║                                  ║  ',
          '   ║   他，想要解开北疆的封印！」      ║  ',
          '   ║                                  ║  ',
          '   ╚══════════════════════════════════╝  ',
          '                                          ',
        ],
        caption: '真相大白！骨冥子的目的，远比所有人想象的更加可怕。',
        delay: 999999,
      },
    ],
  },
};


// ═══════════════════════════════════════════════════════
//  过场动画播放器  StoryCS
// ═══════════════════════════════════════════════════════

const StoryCS = (() => {

  // ── 内部状态 ────────────────────────────────────────
  let _playing    = false;   // 是否正在播放
  let _csId       = null;    // 当前过场ID
  let _frameIdx   = 0;       // 当前帧序号
  let _timer      = null;    // 自动推进定时器
  let _callback   = null;    // 播放完成回调
  let _overlay    = null;    // DOM：全屏遮罩
  let _container  = null;    // DOM：内容容器
  let _skipBtn    = null;    // DOM：跳过按钮

  // ── 样式注入 ─────────────────────────────────────────
  function _buildStyles() {
    if (document.getElementById('story-cs-style')) return;
    const style = document.createElement('style');
    style.id = 'story-cs-style';
    style.textContent = `
      /* ─── 过场遮罩 ─── */
      #story-cs-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        animation: cs-fade-in 0.4s ease;
      }
      @keyframes cs-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* ─── 标题栏 ─── */
      #story-cs-title {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 13px;
        color: #888;
        letter-spacing: 2px;
        white-space: nowrap;
        font-family: monospace;
      }

      /* ─── 字符画区 ─── */
      #story-cs-art {
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        line-height: 1.55;
        color: #e8e0c0;
        white-space: pre;
        text-align: center;
        padding: 0 12px;
        max-width: 480px;
        animation: cs-art-in 0.35s ease;
        text-shadow: 0 0 8px rgba(200,180,100,0.4);
      }
      @keyframes cs-art-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ─── 台词区 ─── */
      #story-cs-caption {
        margin-top: 18px;
        font-size: 14px;
        color: #c8b870;
        max-width: 400px;
        text-align: center;
        line-height: 1.7;
        padding: 0 16px;
        min-height: 42px;
        animation: cs-caption-in 0.5s ease 0.15s both;
        font-family: sans-serif;
      }
      @keyframes cs-caption-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* ─── 帧进度条 ─── */
      #story-cs-progress {
        position: absolute;
        bottom: 52px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
      }
      .cs-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: #444;
        transition: background 0.3s;
      }
      .cs-dot.active { background: #c8b870; }

      /* ─── 点击提示 ─── */
      #story-cs-tap {
        position: absolute;
        bottom: 16px;
        right: 20px;
        font-size: 12px;
        color: #666;
        font-family: monospace;
        animation: cs-blink 1.2s infinite;
      }
      @keyframes cs-blink {
        0%,100% { opacity: 1; }
        50%      { opacity: 0.2; }
      }

      /* ─── 跳过按钮 ─── */
      #story-cs-skip {
        position: absolute;
        top: 12px;
        right: 16px;
        font-size: 12px;
        color: #555;
        cursor: pointer;
        font-family: monospace;
        padding: 4px 8px;
        border: 1px solid #333;
        border-radius: 4px;
        background: transparent;
        transition: color 0.2s, border-color 0.2s;
      }
      #story-cs-skip:hover { color: #aaa; border-color: #666; }

      /* ─── 章节过渡闪屏 ─── */
      #story-cs-flash {
        position: fixed;
        inset: 0;
        z-index: 99998;
        background: #fff;
        pointer-events: none;
        animation: cs-flash 0.5s ease forwards;
      }
      @keyframes cs-flash {
        0%   { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── 构建DOM ──────────────────────────────────────────
  function _buildDOM(cs) {
    _overlay = document.createElement('div');
    _overlay.id = 'story-cs-overlay';

    // 标题
    const titleEl = document.createElement('div');
    titleEl.id = 'story-cs-title';
    titleEl.textContent = cs.title;

    // 字符画
    const artEl = document.createElement('pre');
    artEl.id = 'story-cs-art';

    // 台词
    const captionEl = document.createElement('div');
    captionEl.id = 'story-cs-caption';

    // 帧进度
    const progressEl = document.createElement('div');
    progressEl.id = 'story-cs-progress';
    for (let i = 0; i < cs.frames.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'cs-dot' + (i === 0 ? ' active' : '');
      dot.dataset.idx = i;
      progressEl.appendChild(dot);
    }

    // 点击提示
    const tapEl = document.createElement('div');
    tapEl.id = 'story-cs-tap';
    tapEl.textContent = '[ 点击继续 ]';

    // 跳过按钮
    if (cs.skippable) {
      _skipBtn = document.createElement('button');
      _skipBtn.id = 'story-cs-skip';
      _skipBtn.textContent = '跳过 »';
      _skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        _end();
      });
      _overlay.appendChild(_skipBtn);
    }

    _overlay.appendChild(titleEl);
    _overlay.appendChild(artEl);
    _overlay.appendChild(captionEl);
    _overlay.appendChild(progressEl);
    _overlay.appendChild(tapEl);

    // 点击推进
    _overlay.addEventListener('click', () => _nextFrame());

    _container = { artEl, captionEl, progressEl };
    document.body.appendChild(_overlay);
  }

  // ── 渲染指定帧 ───────────────────────────────────────
  function _renderFrame(cs, idx) {
    const frame = cs.frames[idx];
    if (!frame) return;

    // 更新字符画
    const artEl = document.getElementById('story-cs-art');
    if (artEl) {
      artEl.style.animation = 'none';
      artEl.offsetHeight; // reflow
      artEl.style.animation = '';
      artEl.textContent = frame.art.join('\n');
    }

    // 更新台词
    const captionEl = document.getElementById('story-cs-caption');
    if (captionEl) {
      captionEl.style.animation = 'none';
      captionEl.offsetHeight;
      captionEl.style.animation = '';
      captionEl.textContent = frame.caption;
    }

    // 更新进度点
    const dots = document.querySelectorAll('.cs-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });

    // 清除旧定时器
    if (_timer) { clearTimeout(_timer); _timer = null; }

    // 自动推进（delay < 9000 才自动，否则等待点击）
    if (frame.delay < 9000) {
      _timer = setTimeout(() => _nextFrame(), frame.delay);
    }
  }

  // ── 推进到下一帧 ─────────────────────────────────────
  function _nextFrame() {
    if (!_playing) return;
    const cs = CUTSCENE_DB[_csId];
    if (!cs) return;

    if (_timer) { clearTimeout(_timer); _timer = null; }

    _frameIdx++;
    if (_frameIdx >= cs.frames.length) {
      _end();
    } else {
      _renderFrame(cs, _frameIdx);
    }
  }

  // ── 结束过场 ─────────────────────────────────────────
  function _end() {
    if (_timer) { clearTimeout(_timer); _timer = null; }
    _playing = false;

    // 淡出
    if (_overlay) {
      _overlay.style.transition = 'opacity 0.4s';
      _overlay.style.opacity = '0';
      setTimeout(() => {
        if (_overlay && _overlay.parentNode) {
          _overlay.parentNode.removeChild(_overlay);
        }
        _overlay = null;
        _container = null;
        _skipBtn = null;
        const cb = _callback;
        _callback = null;
        if (cb) cb();
      }, 420);
    } else {
      const cb = _callback;
      _callback = null;
      if (cb) cb();
    }
  }

  // ── 章节过渡闪屏效果 ────────────────────────────────
  function _flash(cb) {
    const el = document.createElement('div');
    el.id = 'story-cs-flash';
    document.body.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (cb) cb();
    }, 500);
  }

  // ─────────────────────────────────────────────────────
  //  公开 API
  // ─────────────────────────────────────────────────────
  return {

    /**
     * 播放过场动画
     * @param {string} csId   CUTSCENE_DB 中的 key
     * @param {Function} [cb] 播放完毕后的回调
     * @param {boolean} [flash] 是否在播放前闪屏（章节过渡用）
     */
    play(csId, cb, flash) {
      if (_playing) {
        console.warn('[StoryCS] 已有过场在播放，跳过：', csId);
        if (cb) cb();
        return;
      }
      const cs = CUTSCENE_DB[csId];
      if (!cs) {
        console.warn('[StoryCS] 找不到过场：', csId);
        if (cb) cb();
        return;
      }

      _buildStyles();

      const _doPlay = () => {
        _playing = true;
        _csId = csId;
        _frameIdx = 0;
        _callback = cb || null;
        _buildDOM(cs);
        _renderFrame(cs, 0);
        console.log('[StoryCS] 播放过场：', csId);
      };

      if (flash) {
        _flash(_doPlay);
      } else {
        _doPlay();
      }
    },

    /**
     * 强制跳过当前过场
     */
    skip() {
      if (_playing) _end();
    },

    /**
     * 查询是否正在播放
     */
    isPlaying() { return _playing; },

    /**
     * 获取所有过场ID列表（调试用）
     */
    list() { return Object.keys(CUTSCENE_DB); },

    /**
     * 预览某个过场（控制台调试）
     */
    preview(csId) { this.play(csId, () => console.log('[StoryCS] 预览结束：', csId)); },
  };

})();

// 暴露到全局（调试用）
if (typeof window !== 'undefined') {
  window.StoryCS = StoryCS;
}

// ═══════════════════════════════════════════════════════
//  过场触发映射  CUTSCENE_TRIGGERS
//  定义各叙事节点 beatId 对应的过场时机
//  'before' = 进入节点前播放
//  'after'  = 节点完成后播放（章节结束过场）
// ═══════════════════════════════════════════════════════
const CUTSCENE_TRIGGERS = {
  // 故事开始（第一次 start）
  game_start:  { csId: 'cs_intro',            when: 'before', flash: false },

  // 章节结束过场
  b1_4_done:   { csId: 'cs_ch1_end',           when: 'after',  flash: true  },
  b2_5_done:   { csId: 'cs_ch2_end',           when: 'after',  flash: true  },
  b3_4_done:   { csId: 'cs_ch3_end',           when: 'after',  flash: true  },
  b4_4_done:   { csId: 'cs_ch4_end',           when: 'after',  flash: true  },
  b5_4_done:   { csId: 'cs_ch5_end',           when: 'after',  flash: true  },
  b6_4_done:   { csId: 'cs_ch6_end',           when: 'after',  flash: false },

  // BOSS决战前出场
  b5_4_before: { csId: 'cs_boss_gumingzi',     when: 'before', flash: false },

  // 特殊节点：玄铁令真相
  b2_5_before: { csId: 'cs_xuantie_reveal',    when: 'before', flash: false },
};

// Node.js 导出（测试用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CUTSCENE_DB, StoryCS, CUTSCENE_TRIGGERS };
}
