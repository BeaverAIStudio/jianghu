// ════════════════════════════════════════════════════
//  data-enemies-animated.js  野外敌人数据库（多状态动画版）
//  包括：猛兽 / 强盗山贼 / 邪道散兵 / 刺客 / 特殊BOSS
//  格式与 NPC_DB 战斗字段兼容（stand/attack/heavy/hit/down）
// ════════════════════════════════════════════════════

// ── 敌人分类常量 ──
const ENEMY_TYPES = {
  BEAST:    'beast',    // 猛兽：狼/虎/熊/蛇/毒虫等
  BANDIT:   'bandit',   // 强盗山贼
  EVIL:     'evil',     // 邪道散兵（血骨门/玄冥/日月等）
  ASSASSIN: 'assassin', // 刺客
  GHOST:    'ghost',    // 邪灵/幻象（特殊地形）
  BOSS:     'boss',     // 野外BOSS（稀有遭遇）
};

// ── 地形→敌人类型偏好 ──
const TERRAIN_ENEMY_WEIGHT = {
  '平原':     { beast:15, bandit:35, evil:30, assassin:10, ghost:5,  boss:5  },
  '山地':     { beast:35, bandit:30, evil:15, assassin:10, ghost:5,  boss:5  },
  '高山':     { beast:40, bandit:20, evil:15, assassin:10, ghost:10, boss:5  },
  '丛林':     { beast:45, bandit:20, evil:15, assassin:10, ghost:5,  boss:5  },
  '沙漠绿洲': { beast:20, bandit:40, evil:15, assassin:15, ghost:5,  boss:5  },
  '草原':     { beast:30, bandit:35, evil:15, assassin:10, ghost:5,  boss:5  },
  '冰原':     { beast:50, bandit:10, evil:15, assassin:5,  ghost:15, boss:5  },
  '水乡':     { beast:15, bandit:45, evil:20, assassin:10, ghost:5,  boss:5  },
  '海岸':     { beast:10, bandit:50, evil:20, assassin:10, ghost:5,  boss:5  },
};

// ────────────────────────────────────────────────
//  ENEMY_DB  野外敌人数据（多状态动画版）
//  新增字段：
//    stand/attack/heavy/hit/down : 多状态字符画
//    parts                        : 部件系统
// ────────────────────────────────────────────────
const ENEMY_DB = {

  // ══════════════════════════════════════
  //  一、猛兽类（左右方向，奔跑姿态）
  // ══════════════════════════════════════

  // ── Lv3 入门猛兽：饿狼 ──
  wolf: {
    id:'wolf', name:'山野饿狼', type:'beast', icon:'🐺',
    stand:'    ◎_◎  ~~~\n   ╱狼╲   \n  ╱ ▓▓ ╲  \n  ▓    ▓',
    attack:['    ◎_◎  ~~~    爪!\n   ╱狼╲       \n  ╱ ▓▓ ╲      \n  ▓    ▓','    ◎_◎爪!~~~ \n   ╱狼╲       \n  ╱ ▓▓ ╲      \n  ▓    ▓'],
    heavy:'   ~~~~~~~\n    ◎_◎\n   ╱狼╲\n  ╱▓▓▓▓╲\n ▓      ▓',
    hit:['    ◎>◉  ~~~\n   ╱狼╲   \n  ╱ ▓▓ ╲  \n  ▓    ▓','    ◉<◎  ~~~\n   ╱狼╲   \n  ╱ ▓▓ ╲  \n  ▓    ▓'],
    down:'   (◎─◎)\n    狼\n   ▓▓▓▓',
    parts:{head:1, body:'狼', arms:3, legs:4, aura:2},
    level:3, tier:'func',
    hp:110, atk:12, def:3, spd:12, mp:0,
    skills:['fi_lf1'],
    drops:[
      { id:'item_wolf_pelt',   chance:0.45, minQty:1, maxQty:1 },
      { id:'item_wolf_fang',   chance:0.30, minQty:1, maxQty:2 },
    ],
    exp:20, silver:0,
    terrain:['山地','平原','草原'],
    minLevel:1,
    desc:'群狼扑来，眼神凶狠，护着领地不让外人踏足！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv8 野猪 ──
  wild_boar: {
    id:'wild_boar', name:'山野野猪', type:'beast', icon:'🐗',
    stand:'    ●_●  ▓▓▓\n   ╱猪╲   ▓\n  ╱ ▓▓ ╲  ▓\n ▓      ▓',
    attack:['    ●_●  ▓▓▓    撞!\n   ╱猪╲       ▓\n  ╱ ▓▓ ╲      ▓\n ▓      ▓','    ●_●撞!▓▓▓ \n   ╱猪╲       ▓\n  ╱ ▓▓ ╲      ▓\n ▓      ▓'],
    heavy:'   ▓▓▓▓▓▓▓\n    ●_●\n   ╱猪╲\n  ╱▓▓▓▓╲\n ▓      ▓',
    hit:['    ●>◉  ▓▓▓\n   ╱猪╲   ▓\n  ╱ ▓▓ ╲  ▓\n ▓      ▓','    ◉<●  ▓▓▓\n   ╱猪╲   ▓\n  ╱ ▓▓ ╲  ▓\n ▓      ▓'],
    down:'   (●─●)\n    猪\n   ▓▓▓▓',
    parts:{head:1, body:'猪', arms:3, legs:4, aura:2},
    level:8, tier:'func',
    hp:320, atk:28, def:8, spd:8, mp:0,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      { id:'item_boar_meat',   chance:0.50, minQty:1, maxQty:2 },
      { id:'item_boar_tusk',   chance:0.35, minQty:1, maxQty:2 },
    ],
    exp:45, silver:5,
    terrain:['山地','平原','丛林'],
    minLevel:1,
    desc:'野猪獠牙锋利，横冲直撞，皮糙肉厚不好对付！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv12 猛虎 ──
  tiger_normal: {
    id:'tiger_normal', name:'猛虎', type:'beast', icon:'🐯',
    stand:'   ╔◎_◎╗ ═══\n   ║虎  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓',
    attack:['   ╔◎_◎╗ ═══    扑!\n   ║虎  ║        \n  ╔╝ ▓▓ ╚╗       \n  ▓      ▓','   ╔◎_◎扑!═══ \n   ║虎  ║        \n  ╔╝ ▓▓ ╚╗       \n  ▓      ▓'],
    heavy:'  ═════════\n   ╔◎_◎╗\n   ║虎  ║\n  ╔╝▓▓▓▓╚╗\n  ▓      ▓',
    hit:['   ╔◎>◎╗ ═══\n   ║虎  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓','   ╔◎<◎╗ ═══\n   ║虎  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓'],
    down:'  (╔◎─◎╗)\n    虎\n   ▓▓▓▓',
    parts:{head:1, body:'虎', arms:3, legs:4, aura:2},
    level:12, tier:'func',
    hp:480, atk:42, def:12, spd:18, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      { id:'item_tiger_skin',  chance:0.40, minQty:1, maxQty:1 },
      { id:'item_tiger_bone',  chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:75, silver:12,
    terrain:['山地','丛林','平原'],
    minLevel:1,
    desc:'猛虎下山，气势汹汹，一扑一剪威力惊人！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv15 巨狼首领（major）──
  wolf_alpha: {
    id:'wolf_alpha', name:'巨狼首领', type:'beast', icon:'🐺',
    stand:'   ◎⊙_⊙◎ ●●●\n   ╱狼王╲   ●\n  ╱ ▓▓▓ ╲   ●\n ●       ●',
    attack:['   ◎⊙_⊙◎ ●●●    爪!\n   ╱狼王╲       ●\n  ╱ ▓▓▓ ╲       ●\n ●       ●','   ◎⊙_⊙爪!●●● \n   ╱狼王╲       ●\n  ╱ ▓▓▓ ╲       ●\n ●       ●'],
    heavy:'  ●●●●●●●●●\n   ◎⊙_⊙◎\n   ╱狼王╲\n  ╱▓▓▓▓▓╲\n ●       ●',
    hit:['   ◎⊙>◉◎ ●●●\n   ╱狼王╲   ●\n  ╱ ▓▓▓ ╲   ●\n ●       ●','   ◎◉<⊙◎ ●●●\n   ╱狼王╲   ●\n  ╱ ▓▓▓ ╲   ●\n ●       ●'],
    down:'  (◎⊙─⊙◎)\n    狼王\n   ▓▓▓▓▓▓',
    parts:{head:1, body:'狼王', arms:3, legs:4, aura:2},
    level:15, tier:'major',
    hp:850, atk:55, def:15, spd:20, mp:0,
    skills:['fi_lf1','fi_hf1','as_1','as_2'],
    drops:[
      { id:'item_alpha_pelt',  chance:0.55, minQty:1, maxQty:1 },
      { id:'item_alpha_fang',  chance:0.40, minQty:2, maxQty:3 },
      { id:'item_beast_core',  chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:150, silver:35,
    terrain:['山地','平原','草原'],
    minLevel:1,
    desc:'狼群首领，体型巨大，目光如炬，统领群狼围攻猎物！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv18 黑背熊 ──
  black_bear: {
    id:'black_bear', name:'黑背熊', type:'beast', icon:'🐻',
    stand:'   ▓●_●▓ ▓▓\n   ╱熊  ╲   ▓\n  ╱ ▓▓▓ ╲   ▓\n ▓       ▓',
    attack:['   ▓●_●▓ ▓▓    掌!\n   ╱熊  ╲       ▓\n  ╱ ▓▓▓ ╲       ▓\n ▓       ▓','   ▓●_●掌!▓▓  \n   ╱熊  ╲       ▓\n  ╱ ▓▓▓ ╲       ▓\n ▓       ▓'],
    heavy:'  ▓▓▓▓▓▓▓▓▓▓\n   ▓●_●▓\n   ╱熊  ╲\n  ╱▓▓▓▓▓╲\n ▓       ▓',
    hit:['   ▓●>◉▓ ▓▓\n   ╱熊  ╲   ▓\n  ╱ ▓▓▓ ╲   ▓\n ▓       ▓','   ▓◉<●▓ ▓▓\n   ╱熊  ╲   ▓\n  ╱ ▓▓▓ ╲   ▓\n ▓       ▓'],
    down:'  (▓●─●▓)\n    熊\n   ▓▓▓▓▓▓',
    parts:{head:1, body:'熊', arms:3, legs:4, aura:2},
    level:18, tier:'func',
    hp:620, atk:48, def:20, spd:6, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      { id:'item_bear_paw',    chance:0.35, minQty:1, maxQty:2 },
      { id:'item_bear_gall',   chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:95, silver:18,
    terrain:['山地','丛林','平原'],
    minLevel:1,
    desc:'黑背熊力大无穷，一掌能拍碎岩石，皮糙肉厚极难对付！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv22 雪豹 ──
  snow_leopard: {
    id:'snow_leopard', name:'雪豹', type:'beast', icon:'🐆',
    stand:'   ╔◉_◉╗ ═══\n   ║豹  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓',
    attack:['   ╔◉_◉╗ ═══    袭!\n   ║豹  ║        \n  ╔╝ ▓▓ ╚╗       \n  ▓      ▓','   ╔◉_◉袭!═══ \n   ║豹  ║        \n  ╔╝ ▓▓ ╚╗       \n  ▓      ▓'],
    heavy:'  ══════════\n   ╔◉_◉╗\n   ║豹  ║\n  ╔╝▓▓▓▓╚╗\n  ▓      ▓',
    hit:['   ╔◉>◉╗ ═══\n   ║豹  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓','   ╔◉<◉╗ ═══\n   ║豹  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓'],
    down:'  (╔◉─◉╗)\n    豹\n   ▓▓▓▓',
    parts:{head:1, body:'豹', arms:3, legs:4, aura:2},
    level:22, tier:'func',
    hp:720, atk:58, def:14, spd:28, mp:0,
    skills:['fi_lf1','fi_hf1','as_1','as_2'],
    drops:[
      { id:'item_leopard_pelt', chance:0.38, minQty:1, maxQty:1 },
    ],
    exp:120, silver:25,
    terrain:['冰原','高山'],
    minLevel:1,
    desc:'雪豹行踪诡秘，速度极快，在雪地中如鱼得水！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv28 冰原雪狼 ──
  snow_wolf: {
    id:'snow_wolf', name:'冰原雪狼', type:'beast', icon:'🐺',
    stand:'   ❄◉_◉❄ ❄❄❄\n   ╱冰狼╲   ❄\n  ╱ ▓▓▓ ╲   ❄\n ❄       ❄',
    attack:['   ❄◉_◉❄ ❄❄❄    爪!\n   ╱冰狼╲       ❄\n  ╱ ▓▓▓ ╲       ❄\n ❄       ❄','   ❄◉_◉爪!❄❄❄ \n   ╱冰狼╲       ❄\n  ╱ ▓▓▓ ╲       ❄\n ❄       ❄'],
    heavy:'  ❄❄❄❄❄❄❄❄❄❄\n   ❄◉_◉❄\n   ╱冰狼╲\n  ╱▓▓▓▓▓╲\n ❄       ❄',
    hit:['   ❄◉>◉❄ ❄❄❄\n   ╱冰狼╲   ❄\n  ╱ ▓▓▓ ╲   ❄\n ❄       ❄','   ❄◉<◉❄ ❄❄❄\n   ╱冰狼╲   ❄\n  ╱ ▓▓▓ ╲   ❄\n ❄       ❄'],
    down:'  (❄◉─◉❄)\n    冰狼\n   ❄❄❄❄❄❄',
    parts:{head:1, body:'冰狼', arms:3, legs:4, aura:2},
    level:28, tier:'func',
    hp:880, atk:68, def:18, spd:24, mp:0,
    skills:['fi_lf1','fi_hf1','as_1','as_2','ice_1'],
    drops:[
      { id:'item_ice_wolf_pelt', chance:0.42, minQty:1, maxQty:1 },
      { id:'item_frost_fang',    chance:0.28, minQty:1, maxQty:2 },
    ],
    exp:155, silver:35,
    terrain:['冰原'],
    minLevel:1,
    desc:'冰原雪狼浑身散发着寒气，利爪带有冰霜之力！',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════
  //  二、胡人散兵类（燕山猎场专用）
  //  使用模板系统：portrait + weapon + armor → 动态生成字符画
  // ══════════════════════════════════════

  // ── Lv5 胡人散兵 ──
  hunter_thief: buildEnemyFromTemplate(
    {
      id:'hunter_thief', name:'胡人散兵', type:'bandit', icon:'🏹',
      level:5, tier:'func',
      hp:220, atk:22, def:6, spd:14, mp:0,
      skills:['as_1','fi_lf1'],
      drops:[
        { id:'item_cloth',       chance:0.40, minQty:1, maxQty:2 },
        { id:'item_iron_ore',    chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:28, silver:8,
      terrain:['山地','草原'],
      minLevel:1,
      desc:'胡人散兵骑射娴熟，在猎场中神出鬼没，专劫过往行人！',
      aggro:true, alignment:'evil',
    },
    { portrait:'hunter', weapon:'wep_uc_spear', armor:'cs_hunter' }
  ),

  // ── Lv15 燕山猎王（BOSS）──
  hunter_boss: buildEnemyFromTemplate(
    {
      id:'hunter_boss', name:'燕山猎王', type:'boss', icon:'👑',
      level:15, tier:'elite',
      hp:1200, atk:75, def:20, spd:22, mp:0,
      skills:['as_1','as_2','fi_lf1','fi_hf1','as_3'],
      drops:[
        { id:'item_hunter_bow',  chance:0.35, minQty:1, maxQty:1 },
        { id:'item_cloth',       chance:0.60, minQty:2, maxQty:4 },
        { id:'item_iron_ore',    chance:0.45, minQty:2, maxQty:3 },
        { id:'item_beast_core',  chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:280, silver:85,
      terrain:['山地','草原'],
      minLevel:1,
      desc:'【燕山猎王】胡人散兵首领，骑射双绝，统领猎场所有散兵！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_long_spear', armor:'cs_general' }
  ),

  // ══════════════════════════════════════
  //  三、山贼类（狼牙谷等地下城）
  //  使用模板系统：portrait + weapon + armor → 动态生成字符画
  // ══════════════════════════════════════

  // ── Lv4 山贼喽啰 ──
  bandit_foot: buildEnemyFromTemplate(
    {
      id:'bandit_foot', name:'山贼喽啰', type:'bandit', icon:'🗡',
      level:4, tier:'func',
      hp:115, atk:12, def:4, spd:8, mp:5,
      skills:['ge_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:1, maxQty:3 },
        { id:'item_crude_blade', chance:0.15, minQty:1, maxQty:1 },
      ],
      exp:18, silver:5,
      terrain:['山地','平原'],
      minLevel:1,
      desc:'山寨里最底层的小喽啰，拿着生锈的刀子，胆子比刀还小。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv7 山贼弓手 ──
  bandit_archer: buildEnemyFromTemplate(
    {
      id:'bandit_archer', name:'山贼弓手', type:'bandit', icon:'🏹',
      level:7, tier:'func',
      hp:190, atk:22, def:5, spd:11, mp:0,
      skills:['wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:1, maxQty:3 },
        { id:'item_iron_token',  chance:0.10, minQty:1, maxQty:1 },
      ],
      exp:30, silver:8,
      terrain:['山地'],
      minLevel:3,
      desc:'爬上了箭楼的山贼，拉弓瞄准时眼神还算准。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'archer', weapon:'wep_uc_spear', armor:'cs_cloth' }
  ),

  // ── Lv10 山贼头目 ──
  bandit_chief_low: buildEnemyFromTemplate(
    {
      id:'bandit_chief_low', name:'山贼头目', type:'bandit', icon:'⚔',
      level:10, tier:'func',
      hp:260, atk:28, def:12, spd:9, mp:20,
      skills:['da_l1','ge_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.80, minQty:5, maxQty:15 },
        { id:'item_iron_token',  chance:0.30, minQty:1, maxQty:1 },
        { id:'item_crude_blade', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:80, silver:20,
      terrain:['山地'],
      minLevel:5,
      desc:'山寨里管事的头目，一身腱子肉，手里的朴刀砍坏了三把。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_ranger' }
  ),

  // ── Lv12 狼王（major）──
  wolf_king: {
    id:'wolf_king', name:'狼王', type:'beast', icon:'🐺',
    stand:'   ◎⊙_⊙◎ ●●●\n   ╱狼王╲   ●\n  ╱ ▓▓▓ ╲   ●\n ●       ●',
    attack:['   ◎⊙_⊙◎ ●●●    爪!\n   ╱狼王╲       ●\n  ╱ ▓▓▓ ╲       ●\n ●       ●','   ◎⊙_⊙爪!●●● \n   ╱狼王╲       ●\n  ╱ ▓▓▓ ╲       ●\n ●       ●'],
    heavy:'  ●●●●●●●●●\n   ◎⊙_⊙◎\n   ╱狼王╲\n  ╱▓▓▓▓▓╲\n ●       ●',
    hit:['   ◎⊙>◉◎ ●●●\n   ╱狼王╲   ●\n  ╱ ▓▓▓ ╲   ●\n ●       ●','   ◎◉<⊙◎ ●●●\n   ╱狼王╲   ●\n  ╱ ▓▓▓ ╲   ●\n ●       ●'],
    down:'  (◎⊙─⊙◎)\n    狼王\n   ▓▓▓▓▓▓',
    parts:{head:1, body:'狼王', arms:3, legs:4, aura:2},
    level:12, tier:'major',
    hp:240, atk:22, def:10, spd:14, mp:0,
    skills:['fi_lf1','wi_l1'],
    drops:[
      { id:'item_wolf_pelt', chance:0.80, minQty:1, maxQty:2 },
      { id:'item_wolf_fang', chance:0.60, minQty:1, maxQty:2 },
      { id:'item_beast_core',chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:160, silver:0,
    terrain:['山地','高山'],
    minLevel:6,
    desc:'统领整个狼群的狼王，体型是普通山狼的两倍，嗥叫声能震动山谷！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv16 黑风大当家（BOSS）──
  bandit_boss: buildEnemyFromTemplate(
    {
      id:'bandit_boss', name:'黑风大当家', type:'bandit', icon:'⚔',
      level:16, tier:'major',
      hp:310, atk:27, def:12, spd:10, mp:30,
      skills:['da_l1','da01','ge01','fo_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.00, minQty:20, maxQty:40 },
        { id:'item_iron_token',  chance:0.50, minQty:1,  maxQty:1 },
        { id:'item_crude_blade', chance:0.30, minQty:1,  maxQty:1 },
      ],
      exp:280, silver:60,
      terrain:['山地'],
      minLevel:8,
      desc:'纵横关中多年的山贼大当家，双斧挥舞如风车，手下三百弟兄无不俯首帖耳。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_blood_saber', armor:'cs_general' }
  ),

  // ── Lv9 野猪（狼牙谷用）──
  boar: {
    id:'boar', name:'野猪', type:'beast', icon:'🐗',
    stand:'   (°o°)  \n   ╱猪╲   \n    ╰╯    ',
    attack:['   (°o°)  撞!\n   ╱猪╲   \n    ╰╯    ','   (°o°)撞!\n   ╱猪╲   \n    ╰╯    '],
    heavy:'   (°益°)  \n   ╱猪╲   \n    ╰╯    ',
    hit:['   (>.<)  \n   ╱猪╲   \n    ╰╯    ','   (<.>)  \n   ╱猪╲   \n    ╰╯    '],
    down:'   (×o×)\n    野猪\n   ▓▓▓▓',
    parts:{head:1, body:'猪', arms:3, legs:4, aura:2},
    level:9, tier:'func',
    hp:135, atk:14, def:6, spd:7, mp:0,
    skills:['fo_l1'],
    drops:[
      { id:'item_wolf_pelt', chance:0.35, minQty:1, maxQty:1 },
    ],
    exp:38, silver:0,
    terrain:['山地','丛林','平原'],
    minLevel:3,
    desc:'一头横冲直撞的野猪，发起怒来连树都能顶断。',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════
  //  四、强盗山贼类（从旧文件迁移）
  // ══════════════════════════════════════

  // ── Lv5 落草汉 ──
  bandit_rogue: buildEnemyFromTemplate(
    {
      id:'bandit_rogue', name:'落草汉', type:'bandit', icon:'🗡',
      level:5, tier:'func',
      hp:199, atk:20, def:7, spd:9, mp:10,
      skills:['da_l1','ge_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.80, minQty:5, maxQty:20 },
        { id:'item_crude_blade', chance:0.15, minQty:1, maxQty:1  },
        { id:'col_dice_set',     chance:0.06, minQty:1, maxQty:1  },
      ],
      exp:30, silver:6,
      terrain:['平原','山地'],
      minLevel:1,
      desc:'"此路是我开，此树是我栽！"几个汉子持刀横在路上。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv13 老匪 ──
  bandit_veteran: buildEnemyFromTemplate(
    {
      id:'bandit_veteran', name:'老匪', type:'bandit', icon:'🗡',
      level:13, tier:'func',
      hp:257, atk:33, def:13, spd:10, mp:20,
      skills:['da_l1','da01','ge01'],
      drops:[
        { id:'item_copper_coin',  chance:0.90, minQty:15, maxQty:50 },
        { id:'item_crude_blade',  chance:0.25, minQty:1, maxQty:1   },
        { id:'item_iron_token',   chance:0.10, minQty:1, maxQty:1   },
        { id:'col_empty_jug',     chance:0.08, minQty:1, maxQty:1   },
        { id:'col_red_thread',    chance:0.04, minQty:1, maxQty:1   },
      ],
      exp:88, silver:22,
      terrain:['平原','山地'],
      minLevel:6,
      desc:'一个满脸横肉的老匪，身上伤疤数不清，刀法粗糙但凶狠。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_blood_saber', armor:'cs_ranger' }
  ),

  // ── Lv25 断刀张（major）──
  bandit_chief_cangzhou: buildEnemyFromTemplate(
    {
      id:'bandit_chief_cangzhou', name:'断刀张', type:'bandit', icon:'⚔',
      level:25, tier:'major',
      hp:492, atk:66, def:22, spd:11, mp:40,
      skills:['da_l1','da01','da02','ge01','ge02'],
      drops:[
        { id:'item_copper_coin',  chance:1.0,  minQty:100, maxQty:200 },
        { id:'wep_uc_dao',        chance:0.60, minQty:1, maxQty:1    },
        { id:'item_bandit_seal',  chance:1.0,  minQty:1, maxQty:1    },
        { id:'col_tiger_seal',    chance:0.10, minQty:1, maxQty:1    },
        { id:'col_war_flag',      chance:0.06, minQty:1, maxQty:1    },
      ],
      exp:360, silver:150,
      terrain:['山地'],
      minLevel:15,
      desc:'「断刀张」，沧州西部绿林第一恶匪，左手断了半根指，右手刀却快如闪电。',
      aggro:true, alignment:'chaotic',
      questRef: 'sq_bandit_hideout',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_general' }
  ),

  // ── Lv40 绿林大当家（major）──
  bandit_warlord: buildEnemyFromTemplate(
    {
      id:'bandit_warlord', name:'绿林大当家', type:'bandit', icon:'⚔',
      level:40, tier:'major',
      hp:612, atk:86, def:30, spd:12, mp:50,
      skills:['da_l1','da02','da03','ge01','ge02','ge03'],
      drops:[
        { id:'item_copper_coin',  chance:1.0,  minQty:150, maxQty:300 },
        { id:'wep_uc_dao',        chance:0.40, minQty:1, maxQty:1     },
        { id:'item_iron_token',   chance:0.60, minQty:1, maxQty:1     },
        { id:'col_jade_ring',     chance:0.08, minQty:1, maxQty:1     },
        { id:'col_sect_tablet',   chance:0.04, minQty:1, maxQty:1     },
      ],
      exp:520, silver:220,
      terrain:['山地','平原'],
      minLevel:30,
      desc:'此人自封"大当家"，盘踞一方十余年，旗下数百喽啰，称霸四方。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_general' }
  ),

  // ══════════════════════════════════════
  //  五、海沙帮（水域专属）
  // ══════════════════════════════════════

  // ── Lv15 海沙水寇 ──
  haisha_pirate: buildEnemyFromTemplate(
    {
      id:'haisha_pirate', name:'海沙帮水寇', type:'bandit', icon:'⚓',
      level:15, tier:'func',
      hp:247, atk:35, def:12, spd:11, mp:15,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin',  chance:0.85, minQty:20, maxQty:60 },
        { id:'item_damp_cargo',   chance:0.20, minQty:1, maxQty:1  },
      ],
      exp:98, silver:32,
      terrain:['水乡','海岸'],
      minLevel:8,
      desc:'海沙帮水寇，驾着乌篷船而来，船头站着刀光闪闪的匪徒。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_haisha' }
  ),

  // ── Lv28 海沙队长 ──
  haisha_captain: buildEnemyFromTemplate(
    {
      id:'haisha_captain', name:'海沙帮水寇队长', type:'bandit', icon:'⚓',
      level:28, tier:'major',
      hp:516, atk:67, def:25, spd:12, mp:50,
      skills:['da_l1','da02','ge01','ge02','wi_l1'],
      drops:[
        { id:'item_copper_coin',  chance:1.0,  minQty:80, maxQty:160 },
        { id:'wep_uc_dao',        chance:0.50, minQty:1, maxQty:1    },
        { id:'item_haisha_token', chance:1.0,  minQty:1, maxQty:1    },
        { id:'col_bronze_bell',   chance:0.10, minQty:1, maxQty:1    },
      ],
      exp:410, silver:180,
      terrain:['水乡','海岸'],
      minLevel:18,
      desc:'海沙帮在大运河一带的头领，手下数十名水寇，横行水道多年。',
      aggro:true, alignment:'chaotic',
      questRef: 'sq_haisha_blockade',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_haisha2' }
  ),

  // ══════════════════════════════════════
  //  六、邪道散兵（血骨门/玄冥教/日月神教）
  // ══════════════════════════════════════

  // ── Lv10 血骨门小喽啰 ──
  xuegu_ruffian: buildEnemyFromTemplate(
    {
      id:'xuegu_ruffian', name:'血骨门小喽啰', type:'evil', icon:'💀',
      level:10, tier:'func',
      hp:223, atk:26, def:8, spd:10, mp:20,
      skills:['da_l1','da01','da_l2'],
      drops:[
        { id:'item_copper_coin',     chance:0.70, minQty:10, maxQty:30 },
        { id:'item_xuegu_emblem',    chance:0.20, minQty:1, maxQty:1   },
      ],
      exp:56, silver:12,
      terrain:['平原','山地'],
      minLevel:5,
      desc:'血骨门门徒，面露凶光，手持骨制弯刀，身上有刺青。',
      aggro:true, alignment:'evil',
      questRef: 'sq_xuegu_terrorize',
    },
    { portrait:'cultist', weapon:'wep_dark_knife', armor:'cs_xuegu' }
  ),

  // ── Lv30 血骨门追命使 ──
  xuegu_elite_songshan: buildEnemyFromTemplate(
    {
      id:'xuegu_elite_songshan', name:'血骨门追命使', type:'evil', icon:'💀',
      level:30, tier:'major',
      hp:558, atk:75, def:28, spd:13, mp:80,
      skills:['da_l1','da02','da03','po_l1','po01'],
      drops:[
        { id:'item_copper_coin',     chance:1.0,  minQty:60, maxQty:120 },
        { id:'item_xuegu_emblem',    chance:0.80, minQty:1, maxQty:1    },
        { id:'wep_rare_xuegu_blade', chance:0.30, minQty:1, maxQty:1    },
      ],
      exp:460, silver:160,
      terrain:['高山','山地'],
      minLevel:20,
      desc:'血骨门专司追杀叛徒和探子的精锐，三人一组，以骨制符文增强战力，极为危险。',
      aggro:true, alignment:'evil',
      questRef: 'mq_act2_songshan',
    },
    { portrait:'cultist', weapon:'wep_ghost_blade', armor:'cs_xuegu2' }
  ),

  // ── Lv42 血骨门护法 ──
  xuegu_guardian: buildEnemyFromTemplate(
    {
      id:'xuegu_guardian', name:'血骨门护法', type:'evil', icon:'💀',
      level:42, tier:'major',
      hp:628, atk:90, def:35, spd:11, mp:120,
      skills:['da_l1','da03','da04','da05','po01','po03'],
      drops:[
        { id:'item_copper_coin',     chance:1.0,  minQty:100, maxQty:200 },
        { id:'item_xuegu_emblem',    chance:1.0,  minQty:1, maxQty:1     },
        { id:'wep_rare_xuegu_blade', chance:0.45, minQty:1, maxQty:1     },
      ],
      exp:660, silver:280,
      terrain:['山地','高山'],
      minLevel:32,
      desc:'血骨门七大护法之一，身着骨甲，以暗器和毒刃配合，令人防不胜防。',
      aggro:true, alignment:'evil',
      questRef: 'mq_act3_boss',
    },
    { portrait:'chief', weapon:'wep_blood_saber', armor:'cs_xuegu2' }
  ),

  // ── Lv22 玄冥教奸细 ──
  xuanming_spy: buildEnemyFromTemplate(
    {
      id:'xuanming_spy', name:'玄冥教奸细', type:'evil', icon:'🌑',
      level:22, tier:'func',
      hp:257, atk:47, def:10, spd:18, mp:60,
      skills:['da_l1','da_l2','da01','da03'],
      drops:[
        { id:'item_copper_coin',      chance:0.80, minQty:20, maxQty:50  },
        { id:'item_xuanming_code',    chance:0.60, minQty:1, maxQty:1    },
      ],
      exp:175, silver:55,
      terrain:['山地','平原'],
      minLevel:14,
      desc:'玄冥教负责渗透工作的细作，伪装成普通行人，出手时如鬼魅。',
      aggro:false, alignment:'evil',
      questRef: 'sq_xuanming_intel',
    },
    { portrait:'assassin', weapon:'wep_dark_knife', armor:'cs_assassin' }
  ),

  // ── Lv35 玄冥教杀手 ──
  xuanming_assassin_wudang: buildEnemyFromTemplate(
    {
      id:'xuanming_assassin_wudang', name:'玄冥教杀手', type:'assassin', icon:'🌑',
      level:35, tier:'major',
      hp:543, atk:83, def:18, spd:22, mp:100,
      skills:['da_l1','da02','da03','da04','da_l2','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin',      chance:1.0,  minQty:50, maxQty:100  },
        { id:'item_xuanming_code',    chance:0.90, minQty:1, maxQty:1     },
        { id:'wep_rare_dark_blade',   chance:0.25, minQty:1, maxQty:1     },
      ],
      exp:560, silver:200,
      terrain:['高山'],
      minLevel:25,
      desc:'玄冥教的精锐杀手，在武当后山设伏，身法极快，毒药淬刃。',
      aggro:true, alignment:'evil',
      questRef: 'mq_act2_wudang',
    },
    { portrait:'assassin', weapon:'wep_ghost_blade', armor:'cs_ep_shadow' }
  ),

  // ── Lv18 黑衣刺客 ──
  shadow_killer: buildEnemyFromTemplate(
    {
      id:'shadow_killer', name:'黑衣刺客', type:'assassin', icon:'🗡',
      level:18, tier:'func',
      hp:196, atk:51, def:6, spd:22, mp:50,
      skills:['da_l1','da02','da_l2','da04'],
      drops:[
        { id:'item_copper_coin',  chance:0.80, minQty:30, maxQty:80  },
        { id:'item_poison_dart',  chance:0.50, minQty:2, maxQty:5    },
        { id:'item_dark_token',   chance:0.20, minQty:1, maxQty:1    },
      ],
      exp:155, silver:58,
      terrain:['平原','山地'],
      minLevel:10,
      desc:'一道黑影从树上跃下，白刃闪过！来者蒙脸，身手异常敏捷。',
      aggro:true, alignment:'evil',
    },
    { portrait:'assassin', weapon:'wep_dark_knife', armor:'cs_assassin' }
  ),

  // ── Lv28 赏金猎人 ──
  bounty_hunter: buildEnemyFromTemplate(
    {
      id:'bounty_hunter', name:'赏金猎人', type:'assassin', icon:'⚔',
      level:28, tier:'major',
      hp:464, atk:71, def:18, spd:19, mp:60,
      skills:['sw_l1','sw01','sw02','da_l2','da03'],
      drops:[
        { id:'item_copper_coin',     chance:1.0,  minQty:50, maxQty:120  },
        { id:'item_bounty_scroll',   chance:0.60, minQty:1, maxQty:1     },
        { id:'wep_iron_sword',       chance:0.30, minQty:1, maxQty:1     },
      ],
      exp:390, silver:140,
      terrain:['平原','山地','水乡'],
      minLevel:18,
      desc:'受人雇佣的刺客，见人就问"你可是赏格榜上那位"，收了银子必然下手。',
      aggro:false, alignment:'chaotic',
    },
    { portrait:'assassin', weapon:'wep_iron_sword', armor:'cs_ranger' }
  ),

  // ── Lv44 影杀堂杀手 ──
  shadow_master: buildEnemyFromTemplate(
    {
      id:'shadow_master', name:'影杀堂杀手', type:'assassin', icon:'🗡',
      level:44, tier:'major',
      hp:580, atk:110, def:14, spd:28, mp:120,
      skills:['da_l1','da03','da04','da05','da_l2','wi_l1','wi02'],
      drops:[
        { id:'item_copper_coin',  chance:1.0,  minQty:100, maxQty:200  },
        { id:'item_poison_dart',  chance:0.70, minQty:3, maxQty:8      },
        { id:'item_dark_token',   chance:0.60, minQty:1, maxQty:1      },
      ],
      exp:720, silver:300,
      terrain:['平原','山地'],
      minLevel:34,
      desc:'影杀堂的顶级杀手，无声无息地出现，一击致命——他已经接了你的首级悬赏。',
      aggro:true, alignment:'evil',
    },
    { portrait:'assassin', weapon:'wep_ghost_blade', armor:'cs_ep_shadow' }
  ),

  // ══════════════════════════════════════
  //  七、野兽类扩展（毒虫/猛禽/异兽）
  // ══════════════════════════════════════

  // ── Lv6 毒蛇 ──
  poison_snake: {
    id:'poison_snake', name:'毒蛇', type:'beast', icon:'🐍',
    stand:'     ◎_◎  \n    ╱蛇╲   \n   ╱▓▓▓╲  \n  ▓     ▓',
    attack:['     ◎_◎     咬!\n    ╱蛇╲       \n   ╱▓▓▓╲      \n  ▓     ▓','     ◎_◎咬!   \n    ╱蛇╲       \n   ╱▓▓▓╲      \n  ▓     ▓'],
    heavy:'    ~~~~~~~\n     ◎_◎\n    ╱蛇╲\n   ╱▓▓▓╲\n  ▓     ▓',
    hit:['     ◎>◎  \n    ╱蛇╲   \n   ╱▓▓▓╲  \n  ▓     ▓','     ◎<◎  \n    ╱蛇╲   \n   ╱▓▓▓╲  \n  ▓     ▓'],
    down:'    (◎─◎)\n     蛇\n   ▓▓▓▓',
    parts:{head:1, body:'蛇', arms:3, legs:4, aura:2},
    level:6, tier:'func',
    hp:140, atk:16, def:3, spd:15, mp:0,
    skills:['po_l1'],
    drops:[
      { id:'item_snake_skin', chance:0.40, minQty:1, maxQty:1 },
      { id:'item_snake_venom', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:22, silver:3,
    terrain:['丛林','山地'],
    minLevel:1,
    desc:'草丛中突然窜出的毒蛇，獠牙滴着毒液，被咬中可不是闹着玩的！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv11 毒蜘蛛 ──
  poison_spider: {
    id:'poison_spider', name:'毒蜘蛛', type:'beast', icon:'🕷',
    stand:'    ◉_◉  \n   ╱蛛╲   \n  ╱│││╲  \n   ╰╯╰╯',
    attack:['    ◉_◉     蛰!\n   ╱蛛╲       \n  ╱│││╲      \n   ╰╯╰╯','    ◉_◉蛰!   \n   ╱蛛╲       \n  ╱│││╲      \n   ╰╯╰╯'],
    heavy:'   ~~~~~~~~\n    ◉_◉\n   ╱蛛╲\n  ╱│││╲\n   ╰╯╰╯',
    hit:['    ◉>◉  \n   ╱蛛╲   \n  ╱│││╲  \n   ╰╯╰╯','    ◉<◉  \n   ╱蛛╲   \n  ╱│││╲  \n   ╰╯╰╯'],
    down:'   (◉─◉)\n    蛛\n   ▓▓▓▓',
    parts:{head:1, body:'蛛', arms:3, legs:4, aura:2},
    level:11, tier:'func',
    hp:195, atk:24, def:5, spd:12, mp:0,
    skills:['po_l1','po01'],
    drops:[
      { id:'item_spider_silk', chance:0.35, minQty:1, maxQty:2 },
      { id:'item_spider_venom', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:38, silver:6,
    terrain:['丛林','山地'],
    minLevel:1,
    desc:'拳头大小的毒蜘蛛，八条腿爬得飞快，毒丝能让人麻痹！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv20 雪鹰 ──
  snow_eagle: {
    id:'snow_eagle', name:'雪鹰', type:'beast', icon:'🦅',
    stand:'   ╔◉_◉╗ ═══\n   ║鹰  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓',
    attack:['   ╔◉_◉╗ ═══    啄!\n   ║鹰  ║        \n  ╔╝ ▓▓ ╚╗       \n  ▓      ▓','   ╔◉_◉啄!═══ \n   ║鹰  ║        \n  ╔╝ ▓▓ ╚╗       \n  ▓      ▓'],
    heavy:'  ══════════\n   ╔◉_◉╗\n   ║鹰  ║\n  ╔╝▓▓▓▓╚╗\n  ▓      ▓',
    hit:['   ╔◉>◉╗ ═══\n   ║鹰  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓','   ╔◉<◉╗ ═══\n   ║鹰  ║   \n  ╔╝ ▓▓ ╚╗  \n  ▓      ▓'],
    down:'  (╔◉─◉╗)\n    鹰\n   ▓▓▓▓',
    parts:{head:1, body:'鹰', arms:3, legs:4, aura:2},
    level:20, tier:'func',
    hp:450, atk:52, def:10, spd:25, mp:0,
    skills:['as_1','as_2'],
    drops:[
      { id:'item_eagle_feather', chance:0.40, minQty:1, maxQty:2 },
      { id:'item_eagle_talon', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:95, silver:20,
    terrain:['冰原','高山'],
    minLevel:1,
    desc:'雪山之巅的雪鹰，双翼展开足有丈余，俯冲时如白色闪电！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv14 沙漠蜥蜴 ──
  desert_lizard: {
    id:'desert_lizard', name:'沙漠蜥蜴', type:'beast', icon:'🦎',
    stand:'    ●_●  \n   ╱蜥╲   \n  ╱▓▓▓▓╲  \n ▓      ▓',
    attack:['    ●_●     咬!\n   ╱蜥╲       \n  ╱▓▓▓▓╲      \n ▓      ▓','    ●_●咬!   \n   ╱蜥╲       \n  ╱▓▓▓▓╲      \n ▓      ▓'],
    heavy:'   ~~~~~~~~\n    ●_●\n   ╱蜥╲\n  ╱▓▓▓▓╲\n ▓      ▓',
    hit:['    ●>●  \n   ╱蜥╲   \n  ╱▓▓▓▓╲  \n ▓      ▓','    ●<●  \n   ╱蜥╲   \n  ╱▓▓▓▓╲  \n ▓      ▓'],
    down:'   (●─●)\n    蜥\n   ▓▓▓▓',
    parts:{head:1, body:'蜥', arms:3, legs:4, aura:2},
    level:14, tier:'func',
    hp:320, atk:35, def:12, spd:10, mp:0,
    skills:['fi_lf1'],
    drops:[
      { id:'item_lizard_scale', chance:0.35, minQty:1, maxQty:2 },
      { id:'item_lizard_tail', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:55, silver:10,
    terrain:['沙漠绿洲'],
    minLevel:1,
    desc:'沙漠中的巨蜥，皮糙肉厚，能在沙地下潜伏数日等待猎物！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv24 丛林猛兽 ──
  jungle_beast: {
    id:'jungle_beast', name:'丛林猛兽', type:'beast', icon:'🐗',
    stand:'   ▓◉_◉▓ ▓▓\n   ╱兽  ╲   ▓\n  ╱ ▓▓▓ ╲   ▓\n ▓       ▓',
    attack:['   ▓◉_◉▓ ▓▓    扑!\n   ╱兽  ╲       ▓\n  ╱ ▓▓▓ ╲       ▓\n ▓       ▓','   ▓◉_◉扑!▓▓  \n   ╱兽  ╲       ▓\n  ╱ ▓▓▓ ╲       ▓\n ▓       ▓'],
    heavy:'  ▓▓▓▓▓▓▓▓▓▓\n   ▓◉_◉▓\n   ╱兽  ╲\n  ╱▓▓▓▓▓╲\n ▓       ▓',
    hit:['   ▓◉>◉▓ ▓▓\n   ╱兽  ╲   ▓\n  ╱ ▓▓▓ ╲   ▓\n ▓       ▓','   ▓◉<◉▓ ▓▓\n   ╱兽  ╲   ▓\n  ╱ ▓▓▓ ╲   ▓\n ▓       ▓'],
    down:'  (▓◉─◉▓)\n    兽\n   ▓▓▓▓▓▓',
    parts:{head:1, body:'兽', arms:3, legs:4, aura:2},
    level:24, tier:'func',
    hp:580, atk:62, def:16, spd:18, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      { id:'item_beast_pelt', chance:0.40, minQty:1, maxQty:1 },
      { id:'item_beast_fang', chance:0.25, minQty:1, maxQty:2 },
    ],
    exp:125, silver:28,
    terrain:['丛林'],
    minLevel:1,
    desc:'热带雨林中的凶猛野兽，形似虎豹，獠牙利爪，是丛林中的霸主！',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════
  //  八、山贼类扩展
  // ══════════════════════════════════════

  // ── Lv8 山贼探子 ──
  bandit_scout: buildEnemyFromTemplate(
    {
      id:'bandit_scout', name:'山贼探子', type:'bandit', icon:'👁',
      level:8, tier:'func',
      hp:165, atk:20, def:5, spd:14, mp:0,
      skills:['as_1','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.50, minQty:3, maxQty:8 },
        { id:'item_crude_blade', chance:0.10, minQty:1, maxQty:1 },
      ],
      exp:25, silver:6,
      terrain:['山地','平原'],
      minLevel:1,
      desc:'山贼派出的探子，身手敏捷，专门侦查过往商队的行踪。',
      aggro:false, alignment:'chaotic',
    },
    { portrait:'archer', weapon:'wep_uc_spear', armor:'cs_cloth' }
  ),

  // ── Lv14 山贼大头目 ──
  bandit_chief: buildEnemyFromTemplate(
    {
      id:'bandit_chief', name:'山贼大头目', type:'bandit', icon:'⚔',
      level:14, tier:'func',
      hp:340, atk:38, def:15, spd:10, mp:30,
      skills:['da_l1','da01','ge01','ge02'],
      drops:[
        { id:'item_copper_coin', chance:0.90, minQty:20, maxQty:50 },
        { id:'item_iron_token', chance:0.25, minQty:1, maxQty:1 },
        { id:'item_crude_blade', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:120, silver:35,
      terrain:['山地'],
      minLevel:8,
      desc:'山寨中的大头目，统领数十名山贼，刀法凶狠，心狠手辣。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_iron_sword', armor:'cs_ranger' }
  ),

  // ── Lv12 拦路强盗 ──
  highway_robber: buildEnemyFromTemplate(
    {
      id:'highway_robber', name:'拦路强盗', type:'bandit', icon:'🗡',
      level:12, tier:'func',
      hp:280, atk:32, def:10, spd:11, mp:15,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:10, maxQty:30 },
        { id:'item_crude_blade', chance:0.15, minQty:1, maxQty:1 },
      ],
      exp:65, silver:18,
      terrain:['平原','山地'],
      minLevel:5,
      desc:'"此路是我开，留下买路财！"专门在官道上抢劫过往行人的强盗。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv22 强盗头子 ──
  highway_robber_boss: buildEnemyFromTemplate(
    {
      id:'highway_robber_boss', name:'强盗头子', type:'bandit', icon:'⚔',
      level:22, tier:'major',
      hp:480, atk:55, def:18, spd:12, mp:40,
      skills:['da_l1','da02','ge01','ge02','fo_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:50, maxQty:100 },
        { id:'item_iron_token', chance:0.40, minQty:1, maxQty:1 },
        { id:'wep_uc_dao', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:220, silver:65,
      terrain:['平原','山地'],
      minLevel:15,
      desc:'一伙强盗的首领，武艺高强，手下有数十名亡命之徒。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_blood_saber', armor:'cs_general' }
  ),

  // ── Lv18 逃兵 ──
  deserter: buildEnemyFromTemplate(
    {
      id:'deserter', name:'逃兵', type:'bandit', icon:'⚔',
      level:18, tier:'func',
      hp:220, atk:26, def:9, spd:10, mp:20,
      skills:['da_l1','da01','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:15, maxQty:40 },
        { id:'item_iron_token', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:95, silver:28,
      terrain:['平原','山地','水乡'],
      minLevel:10,
      desc:'从军营中逃出的士兵，带着兵器流落江湖，为了生存不择手段。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_ranger' }
  ),

  // ── Lv30 逃兵头目 ──
  deserter_boss: buildEnemyFromTemplate(
    {
      id:'deserter_boss', name:'逃兵头目', type:'bandit', icon:'⚔',
      level:30, tier:'major',
      hp:360, atk:42, def:14, spd:12, mp:50,
      skills:['da_l1','da02','da03','ge01','ge02','fo_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:80, maxQty:150 },
        { id:'item_iron_token', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_iron_sword', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:320, silver:95,
      terrain:['平原','山地'],
      minLevel:20,
      desc:'一群逃兵的头领，曾是军中校尉，武艺精湛，统领着数十名亡命之徒。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_long_spear', armor:'cs_general' }
  ),

  // ── Lv16 沙漠强盗 ──
  desert_bandit: buildEnemyFromTemplate(
    {
      id:'desert_bandit', name:'沙漠强盗', type:'bandit', icon:'🏜',
      level:16, tier:'func',
      hp:310, atk:38, def:12, spd:13, mp:15,
      skills:['da_l1','as_1','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:15, maxQty:35 },
        { id:'item_damp_cargo', chance:0.15, minQty:1, maxQty:1 },
      ],
      exp:85, silver:25,
      terrain:['沙漠绿洲'],
      minLevel:8,
      desc:'沙漠中的马贼，骑着快马在绿洲间穿梭，劫掠过往商队。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_spear', armor:'cs_hunter' }
  ),

  // ── Lv26 沙漠刺客 ──
  desert_assassin: buildEnemyFromTemplate(
    {
      id:'desert_assassin', name:'沙漠刺客', type:'assassin', icon:'🗡',
      level:26, tier:'func',
      hp:280, atk:58, def:8, spd:24, mp:60,
      skills:['da_l1','da02','da_l2','as_1','as_2'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:30, maxQty:70 },
        { id:'item_poison_dart', chance:0.30, minQty:1, maxQty:3 },
      ],
      exp:165, silver:50,
      terrain:['沙漠绿洲'],
      minLevel:18,
      desc:'来自西域的刺客，擅长潜行和暗杀，在沙漠中如鬼魅般难以捉摸。',
      aggro:true, alignment:'evil',
    },
    { portrait:'assassin', weapon:'wep_dark_knife', armor:'cs_assassin' }
  ),

  // ── Lv35 沙漠霸主 ──
  desert_boss: buildEnemyFromTemplate(
    {
      id:'desert_boss', name:'沙漠霸主', type:'boss', icon:'👑',
      level:35, tier:'major',
      hp:720, atk:82, def:25, spd:15, mp:80,
      skills:['da_l1','da02','da03','as_1','as_2','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_iron_token', chance:0.60, minQty:1, maxQty:1 },
        { id:'wep_ghost_blade', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:420, silver:130,
      terrain:['沙漠绿洲'],
      minLevel:25,
      desc:'沙漠马贼的大当家，控制着丝绸之路上的数处绿洲，势力庞大。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_general' }
  ),

  // ── Lv10 竹林盗贼 ──
  bamboo_thief: buildEnemyFromTemplate(
    {
      id:'bamboo_thief', name:'竹林盗贼', type:'bandit', icon:'🎋',
      level:10, tier:'func',
      hp:155, atk:18, def:6, spd:14, mp:15,
      skills:['da_l1','as_1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:10, maxQty:25 },
        { id:'item_crude_blade', chance:0.12, minQty:1, maxQty:1 },
      ],
      exp:55, silver:15,
      terrain:['丛林'],
      minLevel:5,
      desc:'藏匿在竹林中的盗贼，熟悉地形，常在竹林中设伏劫掠路人。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv20 竹林大盗 ──
  bamboo_boss: buildEnemyFromTemplate(
    {
      id:'bamboo_boss', name:'竹林大盗', type:'bandit', icon:'🎋',
      level:20, tier:'major',
      hp:290, atk:32, def:10, spd:16, mp:40,
      skills:['da_l1','da02','as_1','as_2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:50, maxQty:100 },
        { id:'item_iron_token', chance:0.35, minQty:1, maxQty:1 },
        { id:'wep_uc_dao', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:195, silver:60,
      terrain:['丛林'],
      minLevel:12,
      desc:'竹林盗贼的首领，武艺高强，在竹林中神出鬼没，官府多次围剿都无功而返。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_blood_saber', armor:'cs_ranger' }
  ),

  // ── Lv13 水域水贼 ──
  water_thief: buildEnemyFromTemplate(
    {
      id:'water_thief', name:'水贼', type:'bandit', icon:'⚓',
      level:6, tier:'func',
      hp:140, atk:16, def:5, spd:10, mp:10,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:12, maxQty:30 },
        { id:'item_damp_cargo', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:70, silver:20,
      terrain:['水乡','海岸'],
      minLevel:6,
      desc:'在水道上活动的水贼，驾着小船劫掠过往商船，水性极佳。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_spear', armor:'cs_haisha' }
  ),

  // ── Lv23 水域恶霸 ──
  water_boss: buildEnemyFromTemplate(
    {
      id:'water_boss', name:'水域恶霸', type:'bandit', icon:'⚓',
      level:23, tier:'major',
      hp:325, atk:36, def:12, spd:13, mp:45,
      skills:['da_l1','da02','ge01','ge02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:60, maxQty:120 },
        { id:'item_haisha_token', chance:0.40, minQty:1, maxQty:1 },
        { id:'wep_uc_dao', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:250, silver:80,
      terrain:['水乡','海岸'],
      minLevel:15,
      desc:'一伙水贼的头领，控制着一段 waterways，手下有数十名水贼。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_haisha2' }
  ),

  // ── Lv15 码头盗贼 ──
  dock_thief: buildEnemyFromTemplate(
    {
      id:'dock_thief', name:'码头盗贼', type:'bandit', icon:'⚓',
      level:15, tier:'func',
      hp:290, atk:34, def:11, spd:13, mp:15,
      skills:['da_l1','as_1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:15, maxQty:35 },
        { id:'item_damp_cargo', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:80, silver:24,
      terrain:['水乡','海岸'],
      minLevel:8,
      desc:'在码头活动的盗贼，趁着夜色偷取货物，身手敏捷。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv25 码头头目 ──
  dock_boss: buildEnemyFromTemplate(
    {
      id:'dock_boss', name:'码头头目', type:'bandit', icon:'⚓',
      level:25, tier:'major',
      hp:560, atk:62, def:19, spd:14, mp:50,
      skills:['da_l1','da02','as_1','as_2','ge01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:70, maxQty:140 },
        { id:'item_iron_token', chance:0.45, minQty:1, maxQty:1 },
        { id:'wep_uc_dao', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:290, silver:95,
      terrain:['水乡','海岸'],
      minLevel:16,
      desc:'码头一带的地头蛇，控制着码头的地下交易，手下众多。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_blood_saber', armor:'cs_general' }
  ),

  // ── Lv11 盐场小贼 ──
  salt_thief: buildEnemyFromTemplate(
    {
      id:'salt_thief', name:'盐场小贼', type:'bandit', icon:'🧂',
      level:11, tier:'func',
      hp:145, atk:17, def:5, spd:11, mp:10,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:8, maxQty:20 },
        { id:'item_crude_blade', chance:0.10, minQty:1, maxQty:1 },
      ],
      exp:48, silver:12,
      terrain:['水乡','海岸'],
      minLevel:5,
      desc:'在盐场偷盐的小贼，趁着守卫不注意偷取官盐贩卖。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv21 盐场大盗 ──
  salt_boss: buildEnemyFromTemplate(
    {
      id:'salt_boss', name:'盐场大盗', type:'bandit', icon:'🧂',
      level:21, tier:'major',
      hp:275, atk:31, def:10, spd:12, mp:35,
      skills:['da_l1','da02','ge01','ge02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:50, maxQty:100 },
        { id:'item_iron_token', chance:0.35, minQty:1, maxQty:1 },
        { id:'wep_uc_dao', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:180, silver:55,
      terrain:['水乡','海岸'],
      minLevel:12,
      desc:'专门盗窃官盐的大盗，组织严密，与官府斗智斗勇多年。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_iron_sword', armor:'cs_ranger' }
  ),

  // ── Lv17 私盐贩子 ──
  salt_field_thief: buildEnemyFromTemplate(
    {
      id:'salt_field_thief', name:'私盐贩子', type:'bandit', icon:'🧂',
      level:17, tier:'func',
      hp:320, atk:38, def:12, spd:11, mp:20,
      skills:['da_l1','ge01','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:20, maxQty:45 },
        { id:'item_damp_cargo', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:105, silver:32,
      terrain:['水乡','海岸'],
      minLevel:10,
      desc:'贩卖私盐的贩子，为了躲避官府缉拿，常常携带兵器防身。',
      aggro:false, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_spear', armor:'cs_cloth' }
  ),

  // ── Lv27 盐场霸主 ──
  salt_field_boss: buildEnemyFromTemplate(
    {
      id:'salt_field_boss', name:'盐场霸主', type:'bandit', icon:'🧂',
      level:27, tier:'major',
      hp:600, atk:70, def:20, spd:13, mp:55,
      skills:['da_l1','da02','da03','ge01','ge02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:90, maxQty:180 },
        { id:'item_iron_token', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_blood_saber', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:340, silver:110,
      terrain:['水乡','海岸'],
      minLevel:18,
      desc:'控制一方盐场的地下霸主，私盐生意做得风生水起，势力庞大。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_general' }
  ),

  // ══════════════════════════════════════
  //  九、邪道类扩展（血骨门/玄冥教/日月神教）
  // ══════════════════════════════════════

  // ── Lv20 血骨门士兵 ──
  blood_bone_soldier: buildEnemyFromTemplate(
    {
      id:'blood_bone_soldier', name:'血骨门士兵', type:'evil', icon:'💀',
      level:20, tier:'func',
      hp:380, atk:45, def:14, spd:11, mp:35,
      skills:['da_l1','da01','da_l2','po01'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:25, maxQty:55 },
        { id:'item_xuegu_emblem', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:115, silver:35,
      terrain:['山地','平原'],
      minLevel:12,
      desc:'血骨门的普通士兵，身披骨甲，手持骨制兵器，凶残嗜血。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_dark_knife', armor:'cs_xuegu' }
  ),

  // ── Lv32 血骨门精英守卫 ──
  blood_bone_elite_guard: buildEnemyFromTemplate(
    {
      id:'blood_bone_elite_guard', name:'血骨门精英守卫', type:'evil', icon:'💀',
      level:32, tier:'func',
      hp:520, atk:68, def:22, spd:12, mp:65,
      skills:['da_l1','da02','da03','po01','po02'],
      drops:[
        { id:'item_copper_coin', chance:0.90, minQty:50, maxQty:100 },
        { id:'item_xuegu_emblem', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_rare_xuegu_blade', chance:0.15, minQty:1, maxQty:1 },
      ],
      exp:280, silver:85,
      terrain:['山地','高山'],
      minLevel:22,
      desc:'血骨门的精锐守卫，负责守卫重要据点，武艺高强，心狠手辣。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_ghost_blade', armor:'cs_xuegu2' }
  ),

  // ── Lv38 血骨门大祭司 ──
  blood_bone_high_priest: buildEnemyFromTemplate(
    {
      id:'blood_bone_high_priest', name:'血骨门大祭司', type:'evil', icon:'💀',
      level:38, tier:'major',
      hp:680, atk:85, def:28, spd:13, mp:100,
      skills:['da_l1','da03','da04','po01','po02','po03','da_l2'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:80, maxQty:160 },
        { id:'item_xuegu_emblem', chance:0.70, minQty:1, maxQty:1 },
        { id:'wep_rare_xuegu_blade', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:420, silver:140,
      terrain:['山地','高山'],
      minLevel:28,
      desc:'血骨门的大祭司，精通血骨邪术，能操控死尸作战，极为恐怖。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_blood_saber', armor:'cs_xuegu2' }
  ),

  // ── Lv45 血骨门副门主 ──
  blood_bone_vice_master: buildEnemyFromTemplate(
    {
      id:'blood_bone_vice_master', name:'血骨门副门主', type:'boss', icon:'👑',
      level:45, tier:'elite',
      hp:1200, atk:120, def:35, spd:15, mp:150,
      skills:['da_l1','da03','da04','da05','po01','po02','po03','da_l2','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:150, maxQty:300 },
        { id:'item_xuegu_emblem', chance:1.0, minQty:2, maxQty:3 },
        { id:'wep_epic_xuegu_blade', chance:0.25, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:750, silver:280,
      terrain:['山地','高山'],
      minLevel:35,
      desc:'血骨门副门主，仅次于门主的恐怖存在，血骨邪功已臻化境！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_epic_xuegu' }
  ),

  // ── Lv50 血骨门祭坛主 ──
  blood_bone_altar_master: buildEnemyFromTemplate(
    {
      id:'blood_bone_altar_master', name:'血骨门祭坛主', type:'boss', icon:'👑',
      level:50, tier:'elite',
      hp:1500, atk:140, def:40, spd:16, mp:180,
      skills:['da_l1','da04','da05','po01','po02','po03','po04','da_l2','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:200, maxQty:400 },
        { id:'item_xuegu_emblem', chance:1.0, minQty:3, maxQty:5 },
        { id:'wep_epic_xuegu_blade', chance:0.35, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:950, silver:380,
      terrain:['山地','高山'],
      minLevel:40,
      desc:'血骨门祭坛之主，掌控着血骨门最邪恶的祭祀仪式，实力深不可测！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_legendary_saber', armor:'cs_epic_xuegu' }
  ),

  // ── Lv25 玄冥教信徒 ──
  xuanming_cultist: buildEnemyFromTemplate(
    {
      id:'xuanming_cultist', name:'玄冥教信徒', type:'evil', icon:'🌑',
      level:25, tier:'func',
      hp:340, atk:48, def:12, spd:15, mp:55,
      skills:['da_l1','da01','da_l2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:30, maxQty:65 },
        { id:'item_xuanming_code', chance:0.35, minQty:1, maxQty:1 },
      ],
      exp:145, silver:45,
      terrain:['山地','平原'],
      minLevel:16,
      desc:'玄冥教的普通信徒，修炼玄冥邪功，身法诡异，出手阴毒。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_dark_knife', armor:'cs_xuanming' }
  ),

  // ── Lv30 玄冥教弟子 ──
  xuanming_disciple: buildEnemyFromTemplate(
    {
      id:'xuanming_disciple', name:'玄冥教弟子', type:'evil', icon:'🌑',
      level:30, tier:'func',
      hp:420, atk:58, def:15, spd:17, mp:70,
      skills:['da_l1','da02','da_l2','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:0.80, minQty:40, maxQty:80 },
        { id:'item_xuanming_code', chance:0.45, minQty:1, maxQty:1 },
      ],
      exp:195, silver:60,
      terrain:['山地','高山'],
      minLevel:20,
      desc:'玄冥教的核心弟子，玄冥神功已有小成，实力不容小觑。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_ghost_blade', armor:'cs_xuanming' }
  ),

  // ── Lv40 玄冥教使者 ──
  xuanming_envoy: buildEnemyFromTemplate(
    {
      id:'xuanming_envoy', name:'玄冥教使者', type:'evil', icon:'🌑',
      level:40, tier:'major',
      hp:620, atk:82, def:22, spd:20, mp:95,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:70, maxQty:140 },
        { id:'item_xuanming_code', chance:0.60, minQty:1, maxQty:1 },
        { id:'wep_rare_dark_blade', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:380, silver:125,
      terrain:['山地','高山'],
      minLevel:30,
      desc:'玄冥教派出的使者，负责传达教主的命令，武艺高强，地位尊贵。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_dark_knife', armor:'cs_xuanming2' }
  ),

  // ── Lv48 玄冥教BOSS ──
  xuanming_boss: buildEnemyFromTemplate(
    {
      id:'xuanming_boss', name:'玄冥教长老', type:'boss', icon:'👑',
      level:48, tier:'elite',
      hp:1100, atk:115, def:32, spd:22, mp:140,
      skills:['da_l1','da03','da04','da05','da_l2','wi_l1','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:150, maxQty:280 },
        { id:'item_xuanming_code', chance:0.90, minQty:2, maxQty:3 },
        { id:'wep_epic_dark_blade', chance:0.28, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:680, silver:250,
      terrain:['高山'],
      minLevel:38,
      desc:'玄冥教的长老，玄冥神功已臻大成，是教中顶尖高手之一！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_epic_xuanming' }
  ),

  // ── Lv35 玄冥教双煞 ──
  xuanming_twin_frost: buildEnemyFromTemplate(
    {
      id:'xuanming_twin_frost', name:'玄冥教双煞', type:'boss', icon:'👑',
      level:35, tier:'major',
      hp:850, atk:95, def:25, spd:18, mp:110,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_xuanming_code', chance:0.70, minQty:1, maxQty:2 },
        { id:'wep_rare_dark_blade', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:480, silver:160,
      terrain:['高山'],
      minLevel:25,
      desc:'玄冥教著名的双煞，两人配合默契，玄冥寒气令人防不胜防！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_dark_knife', armor:'cs_xuanming2' }
  ),

  // ── Lv42 玄冥教幽灵监工 ──
  xuanming_ghost_overseer: buildEnemyFromTemplate(
    {
      id:'xuanming_ghost_overseer', name:'玄冥教幽灵监工', type:'evil', icon:'👻',
      level:42, tier:'major',
      hp:580, atk:78, def:20, spd:24, mp:90,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:60, maxQty:120 },
        { id:'item_xuanming_code', chance:0.55, minQty:1, maxQty:1 },
      ],
      exp:350, silver:115,
      terrain:['高山'],
      minLevel:32,
      desc:'玄冥教秘密基地的监工，神出鬼没，专门处置逃跑的俘虏。',
      aggro:true, alignment:'evil',
    },
    { portrait:'assassin', weapon:'wep_ghost_blade', armor:'cs_ep_shadow' }
  ),

  // ── Lv28 日月神教守卫 ──
  riyue_guardian: buildEnemyFromTemplate(
    {
      id:'riyue_guardian', name:'日月神教守卫', type:'evil', icon:'☀',
      level:28, tier:'func',
      hp:460, atk:62, def:18, spd:14, mp:60,
      skills:['da_l1','da02','da_l2'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:40, maxQty:85 },
        { id:'item_riyue_token', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:210, silver:65,
      terrain:['山地','平原'],
      minLevel:18,
      desc:'日月神教的守卫，忠心耿耿，誓死保卫神教。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_iron_sword', armor:'cs_riyue' }
  ),

  // ── Lv38 日月神教火卫 ──
  riyue_fire_guard: buildEnemyFromTemplate(
    {
      id:'riyue_fire_guard', name:'日月神教火卫', type:'evil', icon:'🔥',
      level:38, tier:'func',
      hp:580, atk:78, def:22, spd:16, mp:80,
      skills:['da_l1','da02','da03','da_l2','fi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.85, minQty:55, maxQty:110 },
        { id:'item_riyue_token', chance:0.45, minQty:1, maxQty:1 },
      ],
      exp:320, silver:95,
      terrain:['山地','高山'],
      minLevel:28,
      desc:'日月神教的火卫，修炼火焰功法，攻击带有灼烧效果。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_blood_saber', armor:'cs_riyue2' }
  ),

  // ── Lv20 圣火教守卫 ──
  holy_fire_guard: buildEnemyFromTemplate(
    {
      id:'holy_fire_guard', name:'圣火教守卫', type:'evil', icon:'🔥',
      level:20, tier:'func',
      hp:360, atk:42, def:13, spd:12, mp:40,
      skills:['da_l1','da01','fi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:25, maxQty:55 },
        { id:'item_fire_token', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:110, silver:32,
      terrain:['山地','平原'],
      minLevel:12,
      desc:'圣火教的守卫，信奉圣火，武功路数刚猛霸道。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_uc_dao', armor:'cs_fire' }
  ),

  // ── Lv32 光明左使 ──
  bright_left_envoy: buildEnemyFromTemplate(
    {
      id:'bright_left_envoy', name:'光明左使', type:'boss', icon:'☀',
      level:32, tier:'major',
      hp:720, atk:88, def:24, spd:18, mp:95,
      skills:['da_l1','da02','da03','da_l2','fi_l1','fi01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:80, maxQty:160 },
        { id:'item_riyue_token', chance:0.55, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:380, silver:120,
      terrain:['山地','高山'],
      minLevel:22,
      desc:'日月神教光明左使，地位崇高，武功深不可测。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_riyue2' }
  ),

  // ── Lv22 五毒教弟子 ──
  five_poison_disciple: buildEnemyFromTemplate(
    {
      id:'five_poison_disciple', name:'五毒教弟子', type:'evil', icon:'🦂',
      level:22, tier:'func',
      hp:320, atk:45, def:11, spd:16, mp:50,
      skills:['da_l1','da01','po_l1','po01'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:30, maxQty:65 },
        { id:'item_poison_dart', chance:0.35, minQty:1, maxQty:3 },
      ],
      exp:130, silver:40,
      terrain:['丛林','山地'],
      minLevel:14,
      desc:'五毒教的弟子，擅长用毒，身上常带着各种毒虫。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_dark_knife', armor:'cs_wudu' }
  ),

  // ── Lv35 五毒教长老 ──
  five_poison_elder: buildEnemyFromTemplate(
    {
      id:'five_poison_elder', name:'五毒教长老', type:'evil', icon:'🦂',
      level:35, tier:'major',
      hp:580, atk:75, def:20, spd:18, mp:85,
      skills:['da_l1','da02','da03','po_l1','po01','po02','po03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:70, maxQty:140 },
        { id:'item_poison_dart', chance:0.55, minQty:2, maxQty:5 },
        { id:'wep_rare_dagger', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:360, silver:115,
      terrain:['丛林','山地'],
      minLevel:25,
      desc:'五毒教的长老，毒功已臻化境，杀人于无形。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_wudu2' }
  ),

  // ── Lv45 五毒教BOSS ──
  five_poison_boss: buildEnemyFromTemplate(
    {
      id:'five_poison_boss', name:'五毒教教主', type:'boss', icon:'👑',
      level:45, tier:'elite',
      hp:1050, atk:110, def:30, spd:20, mp:130,
      skills:['da_l1','da03','da04','po_l1','po01','po02','po03','po04'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:140, maxQty:280 },
        { id:'item_poison_dart', chance:0.70, minQty:3, maxQty:8 },
        { id:'wep_epic_dagger', chance:0.25, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:620, silver:220,
      terrain:['丛林','山地'],
      minLevel:35,
      desc:'五毒教教主，五毒神功独步天下，是江湖上人人闻之色变的毒王！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_legendary_dagger', armor:'cs_epic_wudu' }
  ),

  // ── Lv25 明教弟子 ──
  mingjiao_soldier: buildEnemyFromTemplate(
    {
      id:'mingjiao_soldier', name:'明教弟子', type:'evil', icon:'🔥',
      level:25, tier:'func',
      hp:380, atk:52, def:15, spd:14, mp:55,
      skills:['da_l1','da02','fi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:35, maxQty:75 },
        { id:'item_mingjiao_token', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:155, silver:48,
      terrain:['山地','平原'],
      minLevel:16,
      desc:'明教的普通弟子，信奉明尊，武功路数刚猛。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_iron_sword', armor:'cs_mingjiao' }
  ),

  // ── Lv40 明教长老 ──
  mingjiao_elder: buildEnemyFromTemplate(
    {
      id:'mingjiao_elder', name:'明教长老', type:'evil', icon:'🔥',
      level:40, tier:'major',
      hp:650, atk:85, def:24, spd:17, mp:90,
      skills:['da_l1','da02','da03','fi_l1','fi01','fi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:75, maxQty:150 },
        { id:'item_mingjiao_token', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:400, silver:130,
      terrain:['山地','高山'],
      minLevel:30,
      desc:'明教的长老，武功高强，在教中地位崇高。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_mingjiao2' }
  ),

  // ══════════════════════════════════════
  //  十、士兵/守卫类（铜人阵/禁军/昆仑入侵者）
  // ══════════════════════════════════════

  // ── Lv18 铜人 ──
  copper_protector: buildEnemyFromTemplate(
    {
      id:'copper_protector', name:'铜人', type:'bandit', icon:'🥉',
      level:18, tier:'func',
      hp:480, atk:38, def:28, spd:6, mp:0,
      skills:['fi_lf1','fi_hf1'],
      drops:[
        { id:'item_copper_coin', chance:0.50, minQty:20, maxQty:40 },
        { id:'item_copper_ingot', chance:0.30, minQty:1, maxQty:2 },
      ],
      exp:85, silver:25,
      terrain:['山地'],
      minLevel:10,
      desc:'少林寺铜人阵中的铜人，刀枪不入，力大无穷，是少林武学的试金石。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'default', weapon:'wep_iron_sword', armor:'cs_copper' }
  ),

  // ── Lv28 铜人罗汉 ──
  copper_arhat: buildEnemyFromTemplate(
    {
      id:'copper_arhat', name:'铜人罗汉', type:'bandit', icon:'🥉',
      level:28, tier:'func',
      hp:720, atk:58, def:38, spd:8, mp:0,
      skills:['fi_lf1','fi_hf1','fo_l1','fo01'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:40, maxQty:80 },
        { id:'item_copper_ingot', chance:0.45, minQty:2, maxQty:4 },
      ],
      exp:165, silver:55,
      terrain:['山地'],
      minLevel:18,
      desc:'铜人阵中的高级铜人，形似罗汉，招式精妙，防御惊人。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'default', weapon:'wep_long_spear', armor:'cs_copper2' }
  ),

  // ── Lv38 铜人守护者 ──
  copper_guardian: buildEnemyFromTemplate(
    {
      id:'copper_guardian', name:'铜人守护者', type:'boss', icon:'🥉',
      level:38, tier:'major',
      hp:1100, atk:85, def:50, spd:10, mp:0,
      skills:['fi_lf1','fi_hf1','fo_l1','fo01','fo02','fo03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_copper_ingot', chance:0.60, minQty:3, maxQty:6 },
        { id:'item_shaolin_seal', chance:0.35, minQty:1, maxQty:1 },
      ],
      exp:420, silver:140,
      terrain:['山地'],
      minLevel:28,
      desc:'铜人阵的守护者，是阵法的核心，实力堪比少林高僧！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_copper3' }
  ),

  // ── Lv25 禁军士兵 ──
  imperial_guard: buildEnemyFromTemplate(
    {
      id:'imperial_guard', name:'禁军士兵', type:'bandit', icon:'⚔',
      level:25, tier:'func',
      hp:420, atk:52, def:18, spd:12, mp:30,
      skills:['da_l1','da01','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:35, maxQty:75 },
        { id:'item_imperial_token', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:145, silver:45,
      terrain:['平原','山地'],
      minLevel:16,
      desc:'大内禁军，装备精良，训练有素，是朝廷的精锐部队。',
      aggro:true, alignment:'lawful',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_imperial' }
  ),

  // ── Lv38 禁军统领 ──
  imperial_chief_guard: buildEnemyFromTemplate(
    {
      id:'imperial_chief_guard', name:'禁军统领', type:'boss', icon:'👑',
      level:38, tier:'major',
      hp:780, atk:88, def:28, spd:14, mp:65,
      skills:['da_l1','da02','da03','ge01','ge02','fo_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:90, maxQty:180 },
        { id:'item_imperial_token', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:380, silver:125,
      terrain:['平原','山地'],
      minLevel:28,
      desc:'禁军中的高级将领，武艺高强，统领一方禁军。',
      aggro:true, alignment:'lawful',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_imperial2' }
  ),

  // ── Lv30 昆仑入侵者 ──
  kunlun_invader: buildEnemyFromTemplate(
    {
      id:'kunlun_invader', name:'昆仑入侵者', type:'evil', icon:'⚔',
      level:30, tier:'func',
      hp:480, atk:62, def:18, spd:15, mp:50,
      skills:['da_l1','da02','da_l2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:45, maxQty:90 },
        { id:'item_kunlun_token', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:195, silver:60,
      terrain:['高山','冰原'],
      minLevel:20,
      desc:'从昆仑山下来的入侵者，武功诡异，手段狠辣。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_iron_sword', armor:'cs_kunlun' }
  ),

  // ── Lv42 昆仑武尊 ──
  kunlun_warlord: buildEnemyFromTemplate(
    {
      id:'kunlun_warlord', name:'昆仑武尊', type:'boss', icon:'👑',
      level:42, tier:'major',
      hp:850, atk:95, def:26, spd:18, mp:85,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:110, maxQty:220 },
        { id:'item_kunlun_token', chance:0.55, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:480, silver:160,
      terrain:['高山','冰原'],
      minLevel:32,
      desc:'昆仑派的高手，武功已臻化境，是昆仑入侵者的首领。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_kunlun2' }
  ),

  // ── Lv35 西域入侵者首领 ──
  tibet_invader_chief: buildEnemyFromTemplate(
    {
      id:'tibet_invader_chief', name:'西域入侵者首领', type:'boss', icon:'👑',
      level:35, tier:'major',
      hp:780, atk:88, def:24, spd:16, mp:75,
      skills:['da_l1','da02','da03','as_1','as_2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:95, maxQty:190 },
        { id:'item_tibet_token', chance:0.45, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:420, silver:140,
      terrain:['高山','平原'],
      minLevel:25,
      desc:'西域入侵者的首领，武功高强，手下有众多西域武士。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_long_spear', armor:'cs_tibet' }
  ),

  // ── Lv28 外敌入侵者 ──
  outer_invader: buildEnemyFromTemplate(
    {
      id:'outer_invader', name:'外敌入侵者', type:'evil', icon:'⚔',
      level:28, tier:'func',
      hp:460, atk:58, def:17, spd:14, mp:45,
      skills:['da_l1','da02','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:40, maxQty:85 },
        { id:'item_invader_token', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:175, silver:55,
      terrain:['平原','山地'],
      minLevel:18,
      desc:'来自外域的入侵者，装备精良，武功路数与中土大不相同。',
      aggro:true, alignment:'evil',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_invader' }
  ),

  // ── Lv20 贪官污吏 ──
  corrupt_official: buildEnemyFromTemplate(
    {
      id:'corrupt_official', name:'贪官污吏', type:'bandit', icon:'💰',
      level:20, tier:'func',
      hp:320, atk:35, def:12, spd:9, mp:25,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.90, minQty:50, maxQty:100 },
        { id:'item_corrupt_evidence', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:95, silver:40,
      terrain:['平原','水乡'],
      minLevel:12,
      desc:'贪官污吏，欺压百姓，中饱私囊，身边常带着护卫。',
      aggro:false, alignment:'evil',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ══════════════════════════════════════
  //  十一、古墓/亡灵类
  // ══════════════════════════════════════

  // ── Lv22 古墓亡灵士兵 ──
  ancient_undead_soldier: buildEnemyFromTemplate(
    {
      id:'ancient_undead_soldier', name:'古墓亡灵士兵', type:'ghost', icon:'💀',
      level:22, tier:'func',
      hp:380, atk:48, def:15, spd:8, mp:40,
      skills:['da_l1','da01','da_l2'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:25, maxQty:55 },
        { id:'item_ancient_bone', chance:0.35, minQty:1, maxQty:2 },
      ],
      exp:115, silver:35,
      terrain:['山地'],
      minLevel:14,
      desc:'古墓中复活的亡灵士兵，身披腐朽的铠甲，手持锈迹斑斑的兵器。',
      aggro:true, alignment:'evil',
    },
    { portrait:'default', weapon:'wep_rusty_sword', armor:'cs_ancient' }
  ),

  // ── Lv32 古墓剑卫 ──
  ancient_sword_guardian: buildEnemyFromTemplate(
    {
      id:'ancient_sword_guardian', name:'古墓剑卫', type:'ghost', icon:'⚔',
      level:32, tier:'func',
      hp:560, atk:72, def:22, spd:12, mp:65,
      skills:['da_l1','da02','da03','da_l2','sw_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:50, maxQty:100 },
        { id:'item_ancient_bone', chance:0.50, minQty:1, maxQty:3 },
        { id:'item_ancient_sword_frag', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:265, silver:80,
      terrain:['山地'],
      minLevel:22,
      desc:'古墓中守护主墓室的剑卫，生前是绝世剑客，死后仍守护着墓主。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_ancient_sword', armor:'cs_ancient2' }
  ),

  // ── Lv15 鬼魂 Lv1 ──
  ghost_lv1: buildEnemyFromTemplate(
    {
      id:'ghost_lv1', name:'游魂', type:'ghost', icon:'👻',
      level:15, tier:'func',
      hp:220, atk:32, def:6, spd:18, mp:50,
      skills:['da_l1','da_l2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.40, minQty:15, maxQty:35 },
        { id:'item_ghost_essence', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:75, silver:22,
      terrain:['山地','丛林'],
      minLevel:8,
      desc:'游荡在世间的孤魂野鬼，没有意识，只有本能地攻击生者。',
      aggro:true, alignment:'evil',
    },
    { portrait:'default', weapon:'wep_dark_knife', armor:'cs_ghost' }
  ),

  // ── Lv28 鬼魂 Lv2 ──
  ghost_lv2: buildEnemyFromTemplate(
    {
      id:'ghost_lv2', name:'厉鬼', type:'ghost', icon:'👻',
      level:28, tier:'func',
      hp:420, atk:58, def:12, spd:22, mp:80,
      skills:['da_l1','da02','da_l2','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:35, maxQty:75 },
        { id:'item_ghost_essence', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:185, silver:58,
      terrain:['山地','丛林'],
      minLevel:18,
      desc:'怨气极重的厉鬼，拥有强大的灵力，能操控阴气攻击敌人。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_ghost_blade', armor:'cs_ghost2' }
  ),

  // ── Lv35 鬼城武士 ──
  ghost_city_warrior: buildEnemyFromTemplate(
    {
      id:'ghost_city_warrior', name:'鬼城武士', type:'ghost', icon:'👻',
      level:35, tier:'func',
      hp:540, atk:72, def:18, spd:16, mp:70,
      skills:['da_l1','da02','da03','da_l2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:50, maxQty:100 },
        { id:'item_ghost_essence', chance:0.45, minQty:1, maxQty:2 },
      ],
      exp:280, silver:85,
      terrain:['山地'],
      minLevel:25,
      desc:'酆都鬼城中的武士亡灵，身披古代战甲，守护着鬼城的秘密。',
      aggro:true, alignment:'evil',
    },
    { portrait:'bandit', weapon:'wep_ancient_sword', armor:'cs_ghost3' }
  ),

  // ── Lv25 古墓僵尸 ──
  tomb_zombie: buildEnemyFromTemplate(
    {
      id:'tomb_zombie', name:'古墓僵尸', type:'ghost', icon:'🧟',
      level:25, tier:'func',
      hp:520, atk:48, def:25, spd:5, mp:0,
      skills:['fi_lf1','po_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.50, minQty:30, maxQty:65 },
        { id:'item_zombie_flesh', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:135, silver:40,
      terrain:['山地'],
      minLevel:16,
      desc:'古墓中复活的僵尸，身体僵硬但力大无穷，带有尸毒。',
      aggro:true, alignment:'evil',
    },
    { portrait:'default', weapon:'wep_rusty_sword', armor:'cs_zombie' }
  ),

  // ── Lv38 盗墓贼 ──
  // ── 邙山地宫专用低等级敌人（替代原本的Lv38 tomb_raider）────────────
  // ── Lv7 墓穴拾荒者（func，邙山地宫一楼/二楼早期怪）───────────────
  tomb_weak: buildEnemyFromTemplate(
    {
      id:'tomb_weak', name:'墓穴拾荒者', type:'bandit', icon:'🕯',
      level:7, tier:'func',
      hp:95, atk:11, def:3, spd:11, mp:0,
      skills:['da_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:8, maxQty:18 },
        { id:'item_ancient_artifact', chance:0.08, minQty:1, maxQty:1 },
      ],
      exp:32, silver:8,
      terrain:['山地'],
      minLevel:1,
      desc:'趁乱溜进古墓捡拾陪葬品的无赖，胆小怕事，一见势头不对就跑。',
      aggro:false, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dagger', armor:'cs_cloth' }
  ),

  // ── Lv12 墓穴小贼（func，邙山地宫中期怪）────────────────────
  tomb_thief: buildEnemyFromTemplate(
    {
      id:'tomb_thief', name:'墓穴小贼', type:'bandit', icon:'⛏',
      level:12, tier:'func',
      hp:265, atk:30, def:10, spd:14, mp:10,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:15, maxQty:35 },
        { id:'item_ancient_artifact', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:62, silver:16,
      terrain:['山地'],
      minLevel:6,
      desc:'有几分经验的盗墓贼，知道避开墓中机关，贪财而狠辣。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dagger', armor:'cs_cloth' }
  ),

  // ── Lv15 古墓守墓人（major，邙山地宫精英怪）───────────────────
  tomb_warden: buildEnemyFromTemplate(
    {
      id:'tomb_warden', name:'古墓守墓人', type:'evil', icon:'💀',
      level:15, tier:'major',
      hp:460, atk:30, def:12, spd:10, mp:55,
      skills:['da_l1','da02','ge01','ic_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.80, minQty:25, maxQty:60 },
        { id:'item_ghost_jade', chance:0.20, minQty:1, maxQty:1 },
        { id:'item_ancient_artifact', chance:0.25, minQty:1, maxQty:2 },
      ],
      exp:145, silver:42,
      terrain:['山地'],
      minLevel:10,
      desc:'被邪法控制的守墓人，早已丧失神智，只知杀光一切闯入者。',
      aggro:true, alignment:'evil',
    },
    { portrait:'bandit', weapon:'wep_uc_dagger', armor:'cs_cloth' }
  ),

  // ── Lv18 墓穴鬼王（elite，邙山地宫BOSS）──────────────────────
  tomb_boss_new: buildEnemyFromTemplate(
    {
      id:'tomb_boss_new', name:'墓穴鬼王', type:'boss', icon:'👹',
      level:18, tier:'elite',
      hp:1100, atk:78, def:28, spd:14, mp:90,
      skills:['da_l1','da02','da03','ge01','ic_l1','ic01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:60, maxQty:120 },
        { id:'item_ghost_jade', chance:0.55, minQty:1, maxQty:2 },
        { id:'item_ancient_artifact', chance:0.45, minQty:1, maxQty:2 },
        { id:'item_beast_core', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:420, silver:130,
      terrain:['山地'],
      minLevel:12,
      desc:'邙山地宫深处的恶灵统领，怨气冲天，生前或是盗墓贼首领，死后化为厉鬼守护墓穴。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_uc_dagger', armor:'cs_cloth' }
  ),

  tomb_raider: buildEnemyFromTemplate(
    {
      id:'tomb_raider', name:'盗墓贼', type:'bandit', icon:'⛏',
      level:38, tier:'func',
      hp:480, atk:68, def:16, spd:18, mp:45,
      skills:['da_l1','da02','as_1','as_2'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:55, maxQty:110 },
        { id:'item_ancient_artifact', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:245, silver:75,
      terrain:['山地'],
      minLevel:28,
      desc:'专业的盗墓贼，熟悉各种古墓机关，身手敏捷。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_dark_knife', armor:'cs_tomb_raider' }
  ),

  // ── Lv45 亡灵之王 ──
  undead_king: buildEnemyFromTemplate(
    {
      id:'undead_king', name:'亡灵之王', type:'boss', icon:'👑',
      level:45, tier:'elite',
      hp:1200, atk:105, def:35, spd:14, mp:120,
      skills:['da_l1','da03','da04','da_l2','wi_l1','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:150, maxQty:300 },
        { id:'item_ghost_essence', chance:0.70, minQty:2, maxQty:4 },
        { id:'wep_epic_ghost_blade', chance:0.25, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:680, silver:240,
      terrain:['山地'],
      minLevel:35,
      desc:'古墓中最强大的亡灵，生前是一方霸主，死后仍保持着强大的力量！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_legendary_saber', armor:'cs_epic_ghost' }
  ),

  // ══════════════════════════════════════
  //  十二、机关兽类
  // ══════════════════════════════════════

  // ── Lv24 机关兽 ──
  mechanism_beast: buildEnemyFromTemplate(
    {
      id:'mechanism_beast', name:'机关兽', type:'beast', icon:'🤖',
      level:24, tier:'func',
      hp:580, atk:55, def:28, spd:10, mp:0,
      skills:['fi_lf1','fi_hf1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:35, maxQty:75 },
        { id:'item_mechanism_part', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:155, silver:48,
      terrain:['山地'],
      minLevel:15,
      desc:'墨家机关术制造的机关兽，身形如虎，由精铁打造，力大无穷。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'default', weapon:'wep_iron_sword', armor:'cs_mechanism' }
  ),

  // ── Lv32 机关人偶 ──
  mechanism_doll: buildEnemyFromTemplate(
    {
      id:'mechanism_doll', name:'机关人偶', type:'bandit', icon:'🎎',
      level:32, tier:'func',
      hp:520, atk:62, def:22, spd:16, mp:0,
      skills:['da_l1','da02','as_1','as_2'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:45, maxQty:95 },
        { id:'item_mechanism_part', chance:0.45, minQty:1, maxQty:3 },
      ],
      exp:220, silver:68,
      terrain:['山地'],
      minLevel:22,
      desc:'精密的机关人偶，外形似人，动作灵活，能使用各种兵器。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_mechanism2' }
  ),

  // ── Lv42 机关城主 ──
  mechanism_castle_lord: buildEnemyFromTemplate(
    {
      id:'mechanism_castle_lord', name:'机关城主', type:'boss', icon:'👑',
      level:42, tier:'major',
      hp:950, atk:95, def:35, spd:14, mp:0,
      skills:['fi_lf1','fi_hf1','da_l1','da02','da03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:120, maxQty:240 },
        { id:'item_mechanism_part', chance:0.60, minQty:2, maxQty:5 },
        { id:'item_mechanism_core', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:520, silver:175,
      terrain:['山地'],
      minLevel:32,
      desc:'机关城的核心守护者，是墨家机关术的巅峰之作，威力惊人！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_mechanism3' }
  ),

  // ══════════════════════════════════════
  //  十三、水族类（水域/海底）
  // ══════════════════════════════════════

  // ── Lv16 湖底鱼人 ──
  lake_fishman: buildEnemyFromTemplate(
    {
      id:'lake_fishman', name:'湖底鱼人', type:'beast', icon:'🐟',
      level:16, tier:'func',
      hp:320, atk:38, def:12, spd:14, mp:25,
      skills:['da_l1','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:20, maxQty:45 },
        { id:'item_fish_scale', chance:0.35, minQty:1, maxQty:2 },
      ],
      exp:85, silver:26,
      terrain:['水乡','海岸'],
      minLevel:8,
      desc:'生活在湖底的鱼人，半人半鱼，能在水中自由呼吸，使用鱼骨制成的武器。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'default', weapon:'wep_bone_spear', armor:'cs_fishman' }
  ),

  // ── Lv28 虾兵 ──
  water_shrimp_soldier: buildEnemyFromTemplate(
    {
      id:'water_shrimp_soldier', name:'虾兵', type:'beast', icon:'🦐',
      level:28, tier:'func',
      hp:480, atk:58, def:18, spd:16, mp:40,
      skills:['da_l1','da02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:40, maxQty:85 },
        { id:'item_shrimp_shell', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:185, silver:58,
      terrain:['水乡','海岸'],
      minLevel:18,
      desc:'水中的虾兵，身披硬壳，手持三叉戟，是水族的普通士兵。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'bandit', weapon:'wep_trident', armor:'cs_shrimp' }
  ),

  // ── Lv35 蟹将 ──
  water_crab_general: buildEnemyFromTemplate(
    {
      id:'water_crab_general', name:'蟹将', type:'beast', icon:'🦀',
      level:35, tier:'func',
      hp:680, atk:75, def:32, spd:10, mp:55,
      skills:['da_l1','da02','da03','fi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:60, maxQty:120 },
        { id:'item_crab_shell', chance:0.45, minQty:1, maxQty:2 },
      ],
      exp:320, silver:98,
      terrain:['水乡','海岸'],
      minLevel:25,
      desc:'水中的蟹将，身披坚甲，双螯锋利无比，是水族的高级将领。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_giant_claw', armor:'cs_crab' }
  ),

  // ── Lv42 龙王 ──
  river_dragon_king: buildEnemyFromTemplate(
    {
      id:'river_dragon_king', name:'河龙王', type:'boss', icon:'🐉',
      level:42, tier:'major',
      hp:1100, atk:105, def:30, spd:18, mp:100,
      skills:['da_l1','da02','da03','da04','wi_l1','wi01','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:140, maxQty:280 },
        { id:'item_dragon_scale', chance:0.50, minQty:1, maxQty:2 },
        { id:'item_dragon_pearl', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:580, silver:200,
      terrain:['水乡','海岸'],
      minLevel:32,
      desc:'一方水域的龙王，掌控着江河湖海，法力无边！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_dragon_spear', armor:'cs_dragon' }
  ),

  // ── Lv38 水贼首领 ──
  water_pirate_chief: buildEnemyFromTemplate(
    {
      id:'water_pirate_chief', name:'水贼首领', type:'boss', icon:'⚓',
      level:38, tier:'major',
      hp:820, atk:88, def:24, spd:16, mp:75,
      skills:['da_l1','da02','da03','as_1','as_2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_haisha_token', chance:0.55, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:450, silver:150,
      terrain:['水乡','海岸'],
      minLevel:28,
      desc:'一伙水贼的大首领，控制着大片水域，势力庞大。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_haisha2' }
  ),

  // ── Lv32 珊瑚美人鱼 ──
  coral_mermaid: buildEnemyFromTemplate(
    {
      id:'coral_mermaid', name:'珊瑚美人鱼', type:'beast', icon:'🧜',
      level:32, tier:'func',
      hp:460, atk:55, def:15, spd:20, mp:70,
      skills:['da_l1','da02','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:45, maxQty:95 },
        { id:'item_coral_branch', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:235, silver:72,
      terrain:['海岸'],
      minLevel:22,
      desc:'生活在珊瑚礁中的美人鱼，歌声能迷惑人心，擅长水系法术。',
      aggro:false, alignment:'neutral',
    },
    { portrait:'default', weapon:'wep_coral_staff', armor:'cs_mermaid' }
  ),

  // ── Lv40 珊瑚长老 ──
  coral_elder: buildEnemyFromTemplate(
    {
      id:'coral_elder', name:'珊瑚长老', type:'beast', icon:'🧜',
      level:40, tier:'major',
      hp:720, atk:82, def:22, spd:18, mp:90,
      skills:['da_l1','da02','da03','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:0.85, minQty:70, maxQty:140 },
        { id:'item_coral_branch', chance:0.50, minQty:1, maxQty:3 },
        { id:'item_pearl', chance:0.25, minQty:1, maxQty:2 },
      ],
      exp:380, silver:125,
      terrain:['海岸'],
      minLevel:30,
      desc:'珊瑚礁中的长老，活了数百年，掌控着强大的水系法术。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_coral_staff', armor:'cs_coral_elder' }
  ),

  // ── Lv45 珊瑚鲨卫 ──
  coral_shark_guard: buildEnemyFromTemplate(
    {
      id:'coral_shark_guard', name:'珊瑚鲨卫', type:'beast', icon:'🦈',
      level:45, tier:'func',
      hp:850, atk:95, def:28, spd:22, mp:60,
      skills:['da_l1','da02','da03','as_1','as_2'],
      drops:[
        { id:'item_copper_coin', chance:0.80, minQty:85, maxQty:170 },
        { id:'item_shark_tooth', chance:0.45, minQty:1, maxQty:3 },
      ],
      exp:480, silver:160,
      terrain:['海岸'],
      minLevel:35,
      desc:'守护珊瑚礁的鲨卫，身形巨大，牙齿锋利如刀，是珊瑚海域的守护者。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'bandit', weapon:'wep_shark_tooth', armor:'cs_shark' }
  ),

  // ── Lv50 珊瑚海王 ──
  coral_sea_king: buildEnemyFromTemplate(
    {
      id:'coral_sea_king', name:'珊瑚海王', type:'boss', icon:'👑',
      level:50, tier:'elite',
      hp:1400, atk:125, def:35, spd:20, mp:130,
      skills:['da_l1','da03','da04','da05','wi_l1','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:180, maxQty:360 },
        { id:'item_coral_branch', chance:0.65, minQty:2, maxQty:5 },
        { id:'item_sea_king_crown', chance:0.30, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:850, silver:320,
      terrain:['海岸'],
      minLevel:40,
      desc:'珊瑚海域的霸主，统御着整片珊瑚海，实力深不可测！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_trident', armor:'cs_sea_king' }
  ),

  // ══════════════════════════════════════
  //  十四、冰火/特殊元素类
  // ══════════════════════════════════════

  // ── Lv30 冰原鬼魂 ──
  ice_ghost: buildEnemyFromTemplate(
    {
      id:'ice_ghost', name:'冰原鬼魂', type:'ghost', icon:'❄',
      level:30, tier:'func',
      hp:480, atk:62, def:16, spd:18, mp:70,
      skills:['da_l1','da02','da_l2','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:40, maxQty:85 },
        { id:'item_ice_essence', chance:0.35, minQty:1, maxQty:2 },
      ],
      exp:205, silver:65,
      terrain:['冰原'],
      minLevel:20,
      desc:'冰原上冻死的亡魂，怨气凝结成冰，能操控寒冰攻击。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_ice_blade', armor:'cs_ice_ghost' }
  ),

  // ── Lv38 冰宫守护者 ──
  ice_palace_guardian: buildEnemyFromTemplate(
    {
      id:'ice_palace_guardian', name:'冰宫守护者', type:'boss', icon:'❄',
      level:38, tier:'major',
      hp:920, atk:92, def:30, spd:16, mp:95,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:110, maxQty:220 },
        { id:'item_ice_essence', chance:0.50, minQty:1, maxQty:3 },
        { id:'item_ice_core', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:480, silver:165,
      terrain:['冰原'],
      minLevel:28,
      desc:'冰宫的守护者，由万年寒冰凝聚而成，刀枪不入，寒气逼人！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_ice_sword', armor:'cs_ice_guardian' }
  ),

  // ── Lv45 冰原霸主 ──
  ice_boss: buildEnemyFromTemplate(
    {
      id:'ice_boss', name:'冰原霸主', type:'boss', icon:'❄',
      level:45, tier:'elite',
      hp:1250, atk:115, def:35, spd:18, mp:120,
      skills:['da_l1','da03','da04','da05','wi_l1','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:160, maxQty:320 },
        { id:'item_ice_essence', chance:0.65, minQty:2, maxQty:4 },
        { id:'item_ice_core', chance:0.35, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:720, silver:280,
      terrain:['冰原'],
      minLevel:35,
      desc:'冰原上的霸主，掌控着极寒之力，是冰原上最强大的存在！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_frost_blade', armor:'cs_ice_king' }
  ),

  // ── Lv35 火焰狂信徒 ──
  fire_fanatic: buildEnemyFromTemplate(
    {
      id:'fire_fanatic', name:'火焰狂信徒', type:'evil', icon:'🔥',
      level:35, tier:'func',
      hp:520, atk:72, def:18, spd:16, mp:70,
      skills:['da_l1','da02','fi_l1','fi01','fi02'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:55, maxQty:110 },
        { id:'item_fire_essence', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:285, silver:88,
      terrain:['山地','平原'],
      minLevel:25,
      desc:'崇拜火焰的狂信徒，能操控火焰，性格暴躁，极具攻击性。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_fire_sword', armor:'cs_fire_cult' }
  ),

  // ── Lv42 火焰冠军 ──
  fire_champion: buildEnemyFromTemplate(
    {
      id:'fire_champion', name:'火焰冠军', type:'boss', icon:'🔥',
      level:42, tier:'major',
      hp:880, atk:98, def:26, spd:18, mp:95,
      skills:['da_l1','da02','da03','fi_l1','fi01','fi02','fi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:120, maxQty:240 },
        { id:'item_fire_essence', chance:0.55, minQty:1, maxQty:3 },
        { id:'item_fire_core', chance:0.28, minQty:1, maxQty:1 },
      ],
      exp:520, silver:185,
      terrain:['山地'],
      minLevel:32,
      desc:'火焰教派的冠军战士，火焰功法已臻大成，是教中的顶尖高手！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_inferno_blade', armor:'cs_fire_champion' }
  ),

  // ── Lv48 邪火BOSS ──
  evil_fire_boss: buildEnemyFromTemplate(
    {
      id:'evil_fire_boss', name:'邪火魔君', type:'boss', icon:'🔥',
      level:48, tier:'elite',
      hp:1300, atk:125, def:32, spd:20, mp:140,
      skills:['da_l1','da03','da04','da05','fi_l1','fi02','fi03','fi04'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:180, maxQty:360 },
        { id:'item_fire_essence', chance:0.70, minQty:2, maxQty:5 },
        { id:'item_fire_core', chance:0.35, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:780, silver:300,
      terrain:['山地'],
      minLevel:38,
      desc:'邪火教派的最高领袖，掌控着毁灭性的邪火之力，是江湖上人人闻之色变的魔头！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_inferno_blade', armor:'cs_fire_lord' }
  ),

  // ── Lv40 冰火阴阳BOSS ──
  ice_fire_yin_yang_boss: buildEnemyFromTemplate(
    {
      id:'ice_fire_yin_yang_boss', name:'冰火阴阳使', type:'boss', icon:'☯',
      level:40, tier:'major',
      hp:980, atk:95, def:28, spd:20, mp:110,
      skills:['da_l1','da02','da03','fi_l1','fi01','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:130, maxQty:260 },
        { id:'item_fire_essence', chance:0.45, minQty:1, maxQty:2 },
        { id:'item_ice_essence', chance:0.45, minQty:1, maxQty:2 },
        { id:'item_yin_yang_orb', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:560, silver:195,
      terrain:['山地','冰原'],
      minLevel:30,
      desc:'同时掌控冰火两种力量的神秘存在，阴阳调和，实力惊人！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_yin_yang_sword', armor:'cs_yin_yang' }
  ),

  // ══════════════════════════════════════
  //  十五、华山剑派类
  // ══════════════════════════════════════

  // ── Lv25 华山剑派弟子 ──
  huashan_sword_disciple: buildEnemyFromTemplate(
    {
      id:'huashan_sword_disciple', name:'华山剑派弟子', type:'bandit', icon:'⚔',
      level:25, tier:'func',
      hp:400, atk:55, def:16, spd:16, mp:50,
      skills:['sw_l1','sw01','sw02','da_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:35, maxQty:75 },
        { id:'item_huashan_token', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:155, silver:48,
      terrain:['山地'],
      minLevel:16,
      desc:'华山剑派的弟子，剑法凌厉，身手敏捷，是正派中的精英。',
      aggro:false, alignment:'lawful',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_huashan' }
  ),

  // ── Lv38 华山剑派高手 ──
  huashan_sword_master: buildEnemyFromTemplate(
    {
      id:'huashan_sword_master', name:'华山剑派高手', type:'boss', icon:'⚔',
      level:38, tier:'major',
      hp:720, atk:88, def:24, spd:22, mp:85,
      skills:['sw_l1','sw01','sw02','sw03','da_l1','da02','as_1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:85, maxQty:170 },
        { id:'item_huashan_token', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:400, silver:135,
      terrain:['山地'],
      minLevel:28,
      desc:'华山剑派的高手，剑法已臻化境，是华山派的中流砥柱。',
      aggro:false, alignment:'lawful',
    },
    { portrait:'chief', weapon:'wep_dragon_sword', armor:'cs_huashan2' }
  ),

  // ── Lv32 剑岛守卫 ──
  sword_island_guard: buildEnemyFromTemplate(
    {
      id:'sword_island_guard', name:'剑岛守卫', type:'bandit', icon:'⚔',
      level:32, tier:'func',
      hp:560, atk:72, def:20, spd:18, mp:60,
      skills:['sw_l1','sw01','sw02','da_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:50, maxQty:100 },
        { id:'item_sword_island_token', chance:0.35, minQty:1, maxQty:1 },
      ],
      exp:255, silver:78,
      terrain:['山地','海岸'],
      minLevel:22,
      desc:'剑岛的守卫，剑法精妙，守护着剑岛的秘密。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_sword_island' }
  ),

  // ── Lv45 剑岛守护者 ──
  sword_island_guardian: buildEnemyFromTemplate(
    {
      id:'sword_island_guardian', name:'剑岛守护者', type:'boss', icon:'⚔',
      level:45, tier:'major',
      hp:950, atk:108, def:30, spd:24, mp:100,
      skills:['sw_l1','sw01','sw02','sw03','sw04','da_l1','da02','as_1','as_2'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:140, maxQty:280 },
        { id:'item_sword_island_token', chance:0.60, minQty:1, maxQty:1 },
        { id:'wep_epic_sword', chance:0.28, minQty:1, maxQty:1 },
      ],
      exp:620, silver:220,
      terrain:['山地','海岸'],
      minLevel:35,
      desc:'剑岛的守护者，剑法通神，是剑岛最强的守护者！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_legendary_sword', armor:'cs_sword_island2' }
  ),

  // ── Lv35 剑宗大师 ──
  blade_master: buildEnemyFromTemplate(
    {
      id:'blade_master', name:'剑宗大师', type:'boss', icon:'⚔',
      level:35, tier:'major',
      hp:780, atk:92, def:22, spd:24, mp:85,
      skills:['sw_l1','sw01','sw02','sw03','da_l1','da02','as_1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:95, maxQty:190 },
        { id:'item_blade_token', chance:0.45, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:420, silver:145,
      terrain:['山地'],
      minLevel:25,
      desc:'剑宗的大师，剑法已臻化境，是剑宗的中流砥柱。',
      aggro:false, alignment:'lawful',
    },
    { portrait:'chief', weapon:'wep_dragon_sword', armor:'cs_blade' }
  ),

  // ── Lv42 剑宗守护者 ──
  blade_guardian: buildEnemyFromTemplate(
    {
      id:'blade_guardian', name:'剑宗守护者', type:'boss', icon:'⚔',
      level:42, tier:'major',
      hp:920, atk:105, def:28, spd:26, mp:100,
      skills:['sw_l1','sw01','sw02','sw03','sw04','da_l1','da02','da03','as_1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:120, maxQty:240 },
        { id:'item_blade_token', chance:0.55, minQty:1, maxQty:1 },
        { id:'wep_epic_sword', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:550, silver:195,
      terrain:['山地'],
      minLevel:32,
      desc:'剑宗的守护者，剑法通神，守护着剑宗的秘密。',
      aggro:true, alignment:'lawful',
    },
    { portrait:'chief', weapon:'wep_legendary_sword', armor:'cs_blade2' }
  ),

  // ── Lv48 剑宗宗师 ──
  blade_grandmaster: buildEnemyFromTemplate(
    {
      id:'blade_grandmaster', name:'剑宗宗师', type:'boss', icon:'👑',
      level:48, tier:'elite',
      hp:1150, atk:125, def:32, spd:28, mp:120,
      skills:['sw_l1','sw01','sw02','sw03','sw04','sw05','da_l1','da02','da03','as_1','as_2'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:160, maxQty:320 },
        { id:'item_blade_token', chance:0.70, minQty:1, maxQty:2 },
        { id:'wep_legendary_sword', chance:0.30, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:750, silver:280,
      terrain:['山地'],
      minLevel:38,
      desc:'剑宗的宗师，剑法已臻化境，是江湖上最顶尖的剑客之一！',
      aggro:false, alignment:'lawful',
    },
    { portrait:'chief', weapon:'wep_legendary_sword', armor:'cs_blade3' }
  ),

  // ══════════════════════════════════════
  //  十六、草原/马贼类
  // ══════════════════════════════════════

  // ── Lv18 草原骑手 ──
  steppe_rider: buildEnemyFromTemplate(
    {
      id:'steppe_rider', name:'草原骑手', type:'bandit', icon:'🏇',
      level:18, tier:'func',
      hp:360, atk:42, def:14, spd:18, mp:25,
      skills:['as_1','as_2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:25, maxQty:55 },
        { id:'item_horse_hair', chance:0.25, minQty:1, maxQty:2 },
      ],
      exp:105, silver:32,
      terrain:['草原'],
      minLevel:10,
      desc:'草原上的骑手，骑术精湛，来去如风，擅长骑射。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'hunter', weapon:'wep_uc_spear', armor:'cs_steppe' }
  ),

  // ── Lv28 草原勇士 ──
  steppe_champion: buildEnemyFromTemplate(
    {
      id:'steppe_champion', name:'草原勇士', type:'bandit', icon:'🏇',
      level:28, tier:'func',
      hp:520, atk:65, def:20, spd:20, mp:45,
      skills:['as_1','as_2','da_l1','da02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:45, maxQty:95 },
        { id:'item_horse_hair', chance:0.35, minQty:1, maxQty:3 },
      ],
      exp:210, silver:65,
      terrain:['草原'],
      minLevel:18,
      desc:'草原上的勇士，武艺高强，是部落中的佼佼者。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_long_spear', armor:'cs_steppe2' }
  ),

  // ── Lv38 草原霸主 ──
  steppe_warlord: buildEnemyFromTemplate(
    {
      id:'steppe_warlord', name:'草原霸主', type:'boss', icon:'👑',
      level:38, tier:'major',
      hp:850, atk:95, def:28, spd:22, mp:75,
      skills:['as_1','as_2','da_l1','da02','da03','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_horse_hair', chance:0.45, minQty:2, maxQty:4 },
        { id:'wep_rare_spear', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:450, silver:155,
      terrain:['草原'],
      minLevel:28,
      desc:'草原上的霸主，统领着数万骑兵，是草原上最强大的存在！',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_spear', armor:'cs_steppe3' }
  ),

  // ── Lv15 马贼 ──
  horse_thief: buildEnemyFromTemplate(
    {
      id:'horse_thief', name:'马贼', type:'bandit', icon:'🏇',
      level:15, tier:'func',
      hp:185, atk:22, def:8, spd:16, mp:20,
      skills:['as_1','da_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:20, maxQty:45 },
        { id:'item_horse_hair', chance:0.20, minQty:1, maxQty:2 },
      ],
      exp:80, silver:25,
      terrain:['草原','平原'],
      minLevel:8,
      desc:'专门偷马的贼人，骑术不错，常在草原上游荡。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_spear', armor:'cs_steppe' }
  ),

  // ── Lv25 马贼头子 ──
  horse_boss: buildEnemyFromTemplate(
    {
      id:'horse_boss', name:'马贼头子', type:'bandit', icon:'🏇',
      level:25, tier:'major',
      hp:325, atk:36, def:12, spd:18, mp:45,
      skills:['as_1','as_2','da_l1','da02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:60, maxQty:120 },
        { id:'item_horse_hair', chance:0.35, minQty:1, maxQty:3 },
        { id:'wep_uc_spear', chance:0.15, minQty:1, maxQty:1 },
      ],
      exp:195, silver:62,
      terrain:['草原','平原'],
      minLevel:15,
      desc:'一伙马贼的头子，手下有数十名马贼，专门劫掠过往商队。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_long_spear', armor:'cs_steppe2' }
  ),

  // ══════════════════════════════════════
  //  十七、武当叛徒/密探类
  // ══════════════════════════════════════

  // ── Lv20 武当密探 ──
  wudang_spy: buildEnemyFromTemplate(
    {
      id:'wudang_spy', name:'武当密探', type:'assassin', icon:'🗡',
      level:20, tier:'func',
      hp:320, atk:42, def:12, spd:18, mp:45,
      skills:['sw_l1','as_1','as_2'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:25, maxQty:55 },
        { id:'item_wudang_token', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:105, silver:32,
      terrain:['山地'],
      minLevel:12,
      desc:'武当派派出的密探，负责调查江湖上的各种事件。',
      aggro:false, alignment:'lawful',
    },
    { portrait:'assassin', weapon:'wep_iron_sword', armor:'cs_wudang' }
  ),

  // ── Lv32 武当叛徒 ──
  wudang_traitor: buildEnemyFromTemplate(
    {
      id:'wudang_traitor', name:'武当叛徒', type:'evil', icon:'⚔',
      level:32, tier:'func',
      hp:520, atk:68, def:18, spd:20, mp:70,
      skills:['sw_l1','sw01','sw02','da_l1','da02'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:50, maxQty:100 },
        { id:'item_wudang_token', chance:0.35, minQty:1, maxQty:1 },
      ],
      exp:235, silver:72,
      terrain:['山地'],
      minLevel:22,
      desc:'背叛武当的弟子，偷学了武当秘籍后逃离，武功不弱。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_iron_sword', armor:'cs_wudang2' }
  ),

  // ══════════════════════════════════════
  //  十八、毒蛊/苗疆类
  // ══════════════════════════════════════

  // ── Lv30 苗蛊巫师 ──
  miao_gu_shaman: buildEnemyFromTemplate(
    {
      id:'miao_gu_shaman', name:'苗蛊巫师', type:'evil', icon:'🦂',
      level:30, tier:'func',
      hp:460, atk:58, def:15, spd:14, mp:75,
      skills:['po_l1','po01','po02','da_l1','da02'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:45, maxQty:95 },
        { id:'item_gu_poison', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:210, silver:65,
      terrain:['丛林'],
      minLevel:20,
      desc:'苗疆的蛊术巫师，擅长使用各种毒蛊，令人防不胜防。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_dark_knife', armor:'cs_miao' }
  ),

  // ── Lv42 苗蛊之王 ──
  miao_gu_king: buildEnemyFromTemplate(
    {
      id:'miao_gu_king', name:'苗蛊之王', type:'boss', icon:'👑',
      level:42, tier:'major',
      hp:950, atk:95, def:26, spd:18, mp:110,
      skills:['po_l1','po01','po02','po03','da_l1','da02','da03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:120, maxQty:240 },
        { id:'item_gu_poison', chance:0.55, minQty:2, maxQty:4 },
        { id:'item_gu_king_heart', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:520, silver:185,
      terrain:['丛林'],
      minLevel:32,
      desc:'苗疆蛊术的最高统治者，蛊术已臻化境，是江湖上人人闻之色变的蛊王！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_miao2' }
  ),

  // ── Lv28 瘴气僵尸 ──
  miasma_zombie: buildEnemyFromTemplate(
    {
      id:'miasma_zombie', name:'瘴气僵尸', type:'ghost', icon:'🧟',
      level:28, tier:'func',
      hp:580, atk:52, def:28, spd:4, mp:0,
      skills:['fi_lf1','po_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:35, maxQty:75 },
        { id:'item_miasma_essence', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:165, silver:50,
      terrain:['丛林'],
      minLevel:18,
      desc:'瘴气中诞生的僵尸，身体僵硬但力大无穷，带有致命瘴毒。',
      aggro:true, alignment:'evil',
    },
    { portrait:'default', weapon:'wep_rusty_sword', armor:'cs_miasma' }
  ),

  // ── Lv38 瘴气之王 ──
  miasma_king: buildEnemyFromTemplate(
    {
      id:'miasma_king', name:'瘴气之王', type:'boss', icon:'👑',
      level:38, tier:'major',
      hp:920, atk:85, def:35, spd:8, mp:85,
      skills:['fi_lf1','fi_hf1','po_l1','po01','po02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:110, maxQty:220 },
        { id:'item_miasma_essence', chance:0.50, minQty:1, maxQty:3 },
        { id:'item_miasma_core', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:460, silver:165,
      terrain:['丛林'],
      minLevel:28,
      desc:'瘴气之地的统治者，掌控着致命的瘴气，是丛林中最危险的存在！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_miasma_blade', armor:'cs_miasma2' }
  ),

  // ── Lv35 骨名子 ──
  bone_mingzi: buildEnemyFromTemplate(
    {
      id:'bone_mingzi', name:'骨名子', type:'ghost', icon:'💀',
      level:35, tier:'func',
      hp:520, atk:72, def:18, spd:16, mp:60,
      skills:['da_l1','da02','da_l2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:55, maxQty:110 },
        { id:'item_bone_fragment', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:280, silver:85,
      terrain:['山地'],
      minLevel:25,
      desc:'由无数骨骼拼凑而成的怪物，行动诡异，攻击力惊人。',
      aggro:true, alignment:'evil',
    },
    { portrait:'default', weapon:'wep_bone_spear', armor:'cs_bone' }
  ),

  // ── Lv40 蛊名子 ──
  gu_ming_zi: buildEnemyFromTemplate(
    {
      id:'gu_ming_zi', name:'蛊名子', type:'ghost', icon:'🦂',
      level:40, tier:'major',
      hp:680, atk:88, def:22, spd:18, mp:85,
      skills:['po_l1','po01','po02','po03','da_l1','da02'],
      drops:[
        { id:'item_copper_coin', chance:0.80, minQty:75, maxQty:150 },
        { id:'item_gu_essence', chance:0.45, minQty:1, maxQty:2 },
      ],
      exp:380, silver:125,
      terrain:['丛林'],
      minLevel:30,
      desc:'由无数毒蛊凝聚而成的怪物，浑身散发着剧毒，触之即死。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_gu_blade', armor:'cs_gu' }
  ),

  // ══════════════════════════════════════
  //  十九、走私者/运河类
  // ══════════════════════════════════════

  // ── Lv22 走私者守卫 ──
  smuggler_guard: buildEnemyFromTemplate(
    {
      id:'smuggler_guard', name:'走私者守卫', type:'bandit', icon:'⚓',
      level:22, tier:'func',
      hp:380, atk:48, def:15, spd:13, mp:30,
      skills:['da_l1','da02','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:30, maxQty:65 },
        { id:'item_smuggled_goods', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:125, silver:38,
      terrain:['水乡','海岸'],
      minLevel:14,
      desc:'走私团伙的守卫，负责保护走私货物，身手不错。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_smuggler' }
  ),

  // ── Lv32 走私者船长 ──
  smuggler_captain: buildEnemyFromTemplate(
    {
      id:'smuggler_captain', name:'走私者船长', type:'bandit', icon:'⚓',
      level:32, tier:'func',
      hp:580, atk:72, def:22, spd:15, mp:55,
      skills:['da_l1','da02','da03','ge01','ge02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.80, minQty:55, maxQty:110 },
        { id:'item_smuggled_goods', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:245, silver:78,
      terrain:['水乡','海岸'],
      minLevel:22,
      desc:'走私船的船长，控制着一条走私路线，手下有众多走私者。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_iron_sword', armor:'cs_smuggler2' }
  ),

  // ── Lv40 走私者头目 ──
  smuggler_boss: buildEnemyFromTemplate(
    {
      id:'smuggler_boss', name:'走私者头目', type:'boss', icon:'👑',
      level:40, tier:'major',
      hp:850, atk:92, def:28, spd:17, mp:80,
      skills:['da_l1','da02','da03','as_1','as_2','ge01','ge02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_smuggled_goods', chance:0.55, minQty:1, maxQty:3 },
        { id:'item_smuggler_map', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:420, silver:145,
      terrain:['水乡','海岸'],
      minLevel:30,
      desc:'走私团伙的大头目，控制着数条走私路线，势力庞大。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_smuggler3' }
  ),

  // ── Lv20 运河守卫 ──
  canal_guard: buildEnemyFromTemplate(
    {
      id:'canal_guard', name:'运河守卫', type:'bandit', icon:'⚓',
      level:20, tier:'func',
      hp:340, atk:42, def:14, spd:12, mp:25,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:25, maxQty:55 },
        { id:'item_canal_token', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:100, silver:30,
      terrain:['水乡'],
      minLevel:12,
      desc:'运河上的守卫，负责维护运河秩序，但有时也会被收买。',
      aggro:false, alignment:'neutral',
    },
    { portrait:'bandit', weapon:'wep_uc_spear', armor:'cs_canal' }
  ),

  // ── Lv30 运河武士 ──
  canal_warrior: buildEnemyFromTemplate(
    {
      id:'canal_warrior', name:'运河武士', type:'bandit', icon:'⚓',
      level:30, tier:'func',
      hp:520, atk:65, def:20, spd:14, mp:50,
      skills:['da_l1','da02','ge01','ge02'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:45, maxQty:95 },
        { id:'item_canal_token', chance:0.35, minQty:1, maxQty:1 },
      ],
      exp:205, silver:65,
      terrain:['水乡'],
      minLevel:20,
      desc:'运河上的武士，武艺高强，是运河势力的中坚力量。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'bandit', weapon:'wep_iron_sword', armor:'cs_canal2' }
  ),

  // ── Lv38 运河霸主 ──
  canal_overlord: buildEnemyFromTemplate(
    {
      id:'canal_overlord', name:'运河霸主', type:'boss', icon:'👑',
      level:38, tier:'major',
      hp:820, atk:90, def:26, spd:16, mp:75,
      skills:['da_l1','da02','da03','ge01','ge02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:95, maxQty:190 },
        { id:'item_canal_token', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:420, silver:150,
      terrain:['水乡'],
      minLevel:28,
      desc:'运河上的霸主，控制着整段运河，是水路上的土皇帝！',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_canal3' }
  ),

  // ══════════════════════════════════════
  //  二十、丝绸之路/西域类
  // ══════════════════════════════════════

  // ── Lv25 丝绸之路邪教徒 ──
  silk_road_cultist: buildEnemyFromTemplate(
    {
      id:'silk_road_cultist', name:'丝绸之路邪教徒', type:'evil', icon:'☪',
      level:25, tier:'func',
      hp:400, atk:52, def:16, spd:14, mp:50,
      skills:['da_l1','da02','da_l2'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:35, maxQty:75 },
        { id:'item_cult_relic', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:145, silver:45,
      terrain:['沙漠绿洲'],
      minLevel:16,
      desc:'丝绸之路上活动的邪教徒，信奉异域邪教，武功诡异。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_iron_sword', armor:'cs_silk' }
  ),

  // ── Lv35 丝绸之路刺客 ──
  silk_road_assassin: buildEnemyFromTemplate(
    {
      id:'silk_road_assassin', name:'丝绸之路刺客', type:'assassin', icon:'🗡',
      level:35, tier:'func',
      hp:480, atk:78, def:14, spd:24, mp:70,
      skills:['da_l1','da02','da03','as_1','as_2','da_l2'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:60, maxQty:120 },
        { id:'item_assassin_blade', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:285, silver:88,
      terrain:['沙漠绿洲'],
      minLevel:25,
      desc:'丝绸之路上活动的刺客，来自西域，暗杀技术高超。',
      aggro:true, alignment:'evil',
    },
    { portrait:'assassin', weapon:'wep_dark_knife', armor:'cs_silk2' }
  ),

  // ══════════════════════════════════════
  //  二十一、古墓/宝藏类
  // ══════════════════════════════════════

  // ── Lv42 古墓守护者 ──
  tomb_guardian_spirit: buildEnemyFromTemplate(
    {
      id:'tomb_guardian_spirit', name:'古墓守护灵', type:'ghost', icon:'👻',
      level:42, tier:'major',
      hp:780, atk:88, def:24, spd:20, mp:95,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:0.85, minQty:85, maxQty:170 },
        { id:'item_guardian_essence', chance:0.45, minQty:1, maxQty:2 },
      ],
      exp:420, silver:145,
      terrain:['山地'],
      minLevel:32,
      desc:'古墓中守护宝藏的灵体，拥有强大的灵力，是古墓最后的守护者。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'cultist', weapon:'wep_ghost_blade', armor:'cs_tomb_guardian' }
  ),

  // ── Lv48 古墓BOSS ──
  tomb_boss: buildEnemyFromTemplate(
    {
      id:'tomb_boss', name:'古墓之主', type:'boss', icon:'👑',
      level:48, tier:'elite',
      hp:1250, atk:118, def:35, spd:18, mp:130,
      skills:['da_l1','da03','da04','da05','da_l2','wi_l1','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:170, maxQty:340 },
        { id:'item_tomb_relic', chance:0.60, minQty:1, maxQty:2 },
        { id:'wep_epic_ghost_blade', chance:0.28, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:780, silver:295,
      terrain:['山地'],
      minLevel:38,
      desc:'古墓的真正主人，死后化为强大的亡灵，守护着墓中的绝世宝藏！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_legendary_saber', armor:'cs_tomb_lord' }
  ),

  // ── Lv28 低阶鬼王 ──
  ghost_boss_low: buildEnemyFromTemplate(
    {
      id:'ghost_boss_low', name:'低阶鬼王', type:'boss', icon:'👑',
      level:28, tier:'major',
      hp:680, atk:75, def:22, spd:16, mp:75,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:75, maxQty:150 },
        { id:'item_ghost_essence', chance:0.50, minQty:1, maxQty:2 },
        { id:'item_ghost_king_core', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:320, silver:115,
      terrain:['山地','丛林'],
      minLevel:18,
      desc:'一方鬼魂的统治者，掌控着众多游魂，是鬼域中的小霸主。',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_ghost_blade', armor:'cs_ghost_king' }
  ),

  // ══════════════════════════════════════
  //  二十二、其他特殊敌人
  // ══════════════════════════════════════

  // ── Lv18 黑道妖道 ──
  dark_taoist: buildEnemyFromTemplate(
    {
      id:'dark_taoist', name:'黑道妖道', type:'evil', icon:'☯',
      level:18, tier:'func',
      hp:340, atk:38, def:14, spd:12, mp:55,
      skills:['da_l1','da01','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:25, maxQty:55 },
        { id:'item_taoist_charm', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:95, silver:28,
      terrain:['山地','平原'],
      minLevel:10,
      desc:'堕入邪道的道士，修炼邪术，能驱使鬼怪，危害一方。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_taoist_sword', armor:'cs_dark_taoist' }
  ),

  // ── Lv32 黑道妖道大师 ──
  dark_taoist_master: buildEnemyFromTemplate(
    {
      id:'dark_taoist_master', name:'黑道妖道大师', type:'boss', icon:'☯',
      level:32, tier:'major',
      hp:720, atk:78, def:24, spd:16, mp:95,
      skills:['da_l1','da02','da03','wi_l1','wi01','wi02','wi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:85, maxQty:170 },
        { id:'item_taoist_charm', chance:0.45, minQty:1, maxQty:2 },
        { id:'item_dark_taoist_manual', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:380, silver:135,
      terrain:['山地','平原'],
      minLevel:22,
      desc:'黑道妖道中的大师级人物，邪术高深，能召唤强大的鬼怪助战！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_dark_taoist_sword', armor:'cs_dark_taoist2' }
  ),

  // ── Lv20 雷霆恶魔 ──
  thunder_demon: buildEnemyFromTemplate(
    {
      id:'thunder_demon', name:'雷霆恶魔', type:'ghost', icon:'⚡',
      level:20, tier:'func',
      hp:380, atk:48, def:14, spd:18, mp:60,
      skills:['da_l1','da02','da_l2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:30, maxQty:65 },
        { id:'item_thunder_essence', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:115, silver:35,
      terrain:['山地'],
      minLevel:12,
      desc:'由雷霆之力凝聚而成的恶魔，能操控雷电，攻击力惊人。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_thunder_blade', armor:'cs_thunder' }
  ),

  // ── Lv30 雷霆弟子 ──
  thunder_disciple: buildEnemyFromTemplate(
    {
      id:'thunder_disciple', name:'雷霆弟子', type:'evil', icon:'⚡',
      level:30, tier:'func',
      hp:520, atk:68, def:18, spd:20, mp:75,
      skills:['da_l1','da02','da03','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:0.75, minQty:50, maxQty:100 },
        { id:'item_thunder_essence', chance:0.40, minQty:1, maxQty:2 },
      ],
      exp:220, silver:68,
      terrain:['山地'],
      minLevel:20,
      desc:'修炼雷霆功法的弟子，能操控雷电之力，攻击力惊人。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_thunder_sword', armor:'cs_thunder2' }
  ),

  // ── Lv25 魔鬼信徒 ──
  devil_follower: buildEnemyFromTemplate(
    {
      id:'devil_follower', name:'魔鬼信徒', type:'evil', icon:'😈',
      level:25, tier:'func',
      hp:400, atk:52, def:16, spd:14, mp:55,
      skills:['da_l1','da02','da_l2'],
      drops:[
        { id:'item_copper_coin', chance:0.65, minQty:35, maxQty:75 },
        { id:'item_devil_token', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:145, silver:45,
      terrain:['山地','平原'],
      minLevel:16,
      desc:'信奉魔鬼的信徒，为了获得力量不惜出卖灵魂，武功诡异。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_dark_knife', armor:'cs_devil' }
  ),

  // ── Lv35 魔鬼冠军 ──
  devil_champion: buildEnemyFromTemplate(
    {
      id:'devil_champion', name:'魔鬼冠军', type:'boss', icon:'😈',
      level:35, tier:'major',
      hp:780, atk:88, def:24, spd:18, mp:85,
      skills:['da_l1','da02','da03','da_l2','fi_l1','fi01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:95, maxQty:190 },
        { id:'item_devil_token', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:400, silver:140,
      terrain:['山地','平原'],
      minLevel:25,
      desc:'魔鬼教派的冠军战士，获得了魔鬼赐予的力量，实力强大！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_devil_blade', armor:'cs_devil2' }
  ),

  // ── Lv45 魔鬼之王 ──
  devil_king: buildEnemyFromTemplate(
    {
      id:'devil_king', name:'魔鬼之王', type:'boss', icon:'👑',
      level:45, tier:'elite',
      hp:1200, atk:118, def:35, spd:20, mp:130,
      skills:['da_l1','da03','da04','da05','da_l2','fi_l1','fi02','fi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:170, maxQty:340 },
        { id:'item_devil_token', chance:0.70, minQty:2, maxQty:3 },
        { id:'wep_epic_devil_blade', chance:0.28, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:780, silver:295,
      terrain:['山地'],
      minLevel:35,
      desc:'魔鬼教派的最高领袖，与魔鬼签订了契约，获得了毁天灭地的力量！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_legendary_devil_blade', armor:'cs_devil3' }
  ),

  // ── Lv25 白鳞女皇 ──
  white_scale_queen: buildEnemyFromTemplate(
    {
      id:'white_scale_queen', name:'白鳞女皇', type:'boss', icon:'👑',
      level:25, tier:'major',
      hp:620, atk:72, def:22, spd:20, mp:70,
      skills:['da_l1','da02','da_l2','po_l1','po01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:70, maxQty:140 },
        { id:'item_white_scale', chance:0.45, minQty:1, maxQty:2 },
        { id:'item_queen_venom', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:280, silver:95,
      terrain:['丛林'],
      minLevel:15,
      desc:'白鳞蛇族的女皇，浑身覆盖着白色鳞片，毒液能瞬间致命！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_venom_fang', armor:'cs_white_scale' }
  ),

  // ── Lv35 西夏英灵 ──
  western_xia_spirit: buildEnemyFromTemplate(
    {
      id:'western_xia_spirit', name:'西夏英灵', type:'ghost', icon:'👻',
      level:35, tier:'func',
      hp:580, atk:78, def:20, spd:16, mp:70,
      skills:['da_l1','da02','da03','wi_l1','wi01'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:60, maxQty:120 },
        { id:'item_xia_relic', chance:0.35, minQty:1, maxQty:1 },
      ],
      exp:310, silver:98,
      terrain:['沙漠绿洲'],
      minLevel:25,
      desc:'西夏国灭亡后留下的英灵，守护着西夏的遗迹，对入侵者毫不留情。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'cultist', weapon:'wep_ancient_sword', armor:'cs_xia' }
  ),

  // ── Lv30 水龙神 ──
  water_dragon_god: buildEnemyFromTemplate(
    {
      id:'water_dragon_god', name:'水龙神', type:'boss', icon:'🐉',
      level:30, tier:'major',
      hp:850, atk:85, def:26, spd:20, mp:95,
      skills:['da_l1','da02','da03','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:90, maxQty:180 },
        { id:'item_dragon_scale', chance:0.45, minQty:1, maxQty:2 },
        { id:'item_water_dragon_pearl', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:380, silver:135,
      terrain:['水乡','海岸'],
      minLevel:20,
      desc:'水域中的龙神，掌控着江河湖海，法力无边，是水族的最高统治者！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_dragon_spear', armor:'cs_water_dragon' }
  ),

  // ── Lv35 雷音寺方丈 ──
  leiyin_abbot: buildEnemyFromTemplate(
    {
      id:'leiyin_abbot', name:'雷音寺方丈', type:'boss', icon:'🙏',
      level:35, tier:'major',
      hp:780, atk:82, def:28, spd:14, mp:100,
      skills:['fo_l1','fo01','fo02','fo03','da_l1','da02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:95, maxQty:190 },
        { id:'item_buddhist_relic', chance:0.45, minQty:1, maxQty:1 },
        { id:'item_sutra', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:420, silver:150,
      terrain:['山地'],
      minLevel:25,
      desc:'雷音寺的方丈，佛法高深，武功盖世，是佛门中的顶尖高手！',
      aggro:false, alignment:'lawful',
    },
    { portrait:'chief', weapon:'wep_buddhist_staff', armor:'cs_leiyin' }
  ),

  // ── Lv40 炼狱霸主 ──
  purgatory_overlord: buildEnemyFromTemplate(
    {
      id:'purgatory_overlord', name:'炼狱霸主', type:'boss', icon:'👑',
      level:40, tier:'elite',
      hp:1100, atk:105, def:32, spd:18, mp:120,
      skills:['da_l1','da03','da04','da05','fi_l1','fi02','fi03'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:140, maxQty:280 },
        { id:'item_purgatory_flame', chance:0.55, minQty:1, maxQty:2 },
        { id:'wep_epic_fire_blade', chance:0.25, minQty:1, maxQty:1 },
        { id:'item_beast_core', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:620, silver:235,
      terrain:['山地'],
      minLevel:30,
      desc:'炼狱中的霸主，掌控着炼狱之火，是地狱中最强大的存在之一！',
      aggro:true, alignment:'evil',
    },
    { portrait:'chief', weapon:'wep_inferno_blade', armor:'cs_purgatory' }
  ),

  // ── Lv20 桃花阵灵 ──
  peach_array_spirit: buildEnemyFromTemplate(
    {
      id:'peach_array_spirit', name:'桃花阵灵', type:'ghost', icon:'🌸',
      level:20, tier:'func',
      hp:360, atk:45, def:14, spd:18, mp:55,
      skills:['da_l1','da02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:30, maxQty:65 },
        { id:'item_peach_blossom', chance:0.35, minQty:1, maxQty:2 },
      ],
      exp:115, silver:35,
      terrain:['丛林'],
      minLevel:12,
      desc:'桃花阵中诞生的阵灵，美丽而危险，能操控桃花迷惑敌人。',
      aggro:true, alignment:'neutral',
    },
    { portrait:'default', weapon:'wep_peach_branch', armor:'cs_peach' }
  ),

  // ── Lv38 桃花岛主 ──
  peach_island_master: buildEnemyFromTemplate(
    {
      id:'peach_island_master', name:'桃花岛主', type:'boss', icon:'🌸',
      level:38, tier:'major',
      hp:850, atk:92, def:26, spd:22, mp:95,
      skills:['da_l1','da02','da03','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_peach_blossom', chance:0.50, minQty:2, maxQty:4 },
        { id:'item_peach_island_token', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:480, silver:175,
      terrain:['丛林'],
      minLevel:28,
      desc:'桃花岛的主人，精通奇门遁甲，武功高强，是江湖上的传奇人物！',
      aggro:false, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_peach_wood_sword', armor:'cs_peach_master' }
  ),

  // ── Lv18 野宗弟子 ──
  wild_sect_disciple: buildEnemyFromTemplate(
    {
      id:'wild_sect_disciple', name:'野宗弟子', type:'bandit', icon:'⚔',
      level:18, tier:'func',
      hp:340, atk:42, def:14, spd:14, mp:30,
      skills:['da_l1','da02'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:25, maxQty:55 },
        { id:'item_wild_sect_token', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:95, silver:28,
      terrain:['山地','平原'],
      minLevel:10,
      desc:'野宗的普通弟子，武功杂而不精，但人数众多。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_wild' }
  ),

  // ── Lv30 野宗宗主 ──
  wild_sect_master: buildEnemyFromTemplate(
    {
      id:'wild_sect_master', name:'野宗宗主', type:'boss', icon:'👑',
      level:30, tier:'major',
      hp:720, atk:75, def:22, spd:16, mp:70,
      skills:['da_l1','da02','da03','ge01','ge02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:80, maxQty:160 },
        { id:'item_wild_sect_token', chance:0.45, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:340, silver:115,
      terrain:['山地','平原'],
      minLevel:20,
      desc:'野宗的宗主，虽然门派不大，但个人武艺高强，在江湖上也有一定名气。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_iron_sword', armor:'cs_wild2' }
  ),

  // ── Lv15 宝塔盗贼 ──
  pagoda_thief: buildEnemyFromTemplate(
    {
      id:'pagoda_thief', name:'宝塔盗贼', type:'bandit', icon:'⛏',
      level:15, tier:'func',
      hp:280, atk:35, def:11, spd:14, mp:20,
      skills:['da_l1','as_1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:20, maxQty:45 },
        { id:'item_ancient_artifact', chance:0.15, minQty:1, maxQty:1 },
      ],
      exp:75, silver:22,
      terrain:['山地'],
      minLevel:8,
      desc:'专门盗窃宝塔宝物的盗贼，身手敏捷，熟悉各种机关。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv28 宝塔蛇妖 ──
  pagoda_snake_demon: buildEnemyFromTemplate(
    {
      id:'pagoda_snake_demon', name:'宝塔蛇妖', type:'beast', icon:'🐍',
      level:28, tier:'func',
      hp:520, atk:62, def:18, spd:20, mp:60,
      skills:['da_l1','da02','po_l1','po01'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:45, maxQty:95 },
        { id:'item_snake_demon_pearl', chance:0.30, minQty:1, maxQty:1 },
      ],
      exp:210, silver:65,
      terrain:['山地'],
      minLevel:18,
      desc:'宝塔中修炼成精的蛇妖，能化为人形，毒液致命。',
      aggro:true, alignment:'evil',
    },
    { portrait:'cultist', weapon:'wep_venom_fang', armor:'cs_snake_demon' }
  ),

  // ── Lv38 宝塔BOSS ──
  pagoda_boss: buildEnemyFromTemplate(
    {
      id:'pagoda_boss', name:'宝塔之主', type:'boss', icon:'👑',
      level:38, tier:'major',
      hp:880, atk:95, def:28, spd:18, mp:95,
      skills:['da_l1','da02','da03','da_l2','wi_l1','wi01','wi02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:110, maxQty:220 },
        { id:'item_pagoda_relic', chance:0.50, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:480, silver:175,
      terrain:['山地'],
      minLevel:28,
      desc:'宝塔的真正主人，守护着塔中的绝世武功秘籍，实力深不可测！',
      aggro:true, alignment:'neutral',
    },
    { portrait:'chief', weapon:'wep_pagoda_sword', armor:'cs_pagoda' }
  ),

  // ── Lv12 渡船盗贼 ──
  ferry_thief: buildEnemyFromTemplate(
    {
      id:'ferry_thief', name:'渡船盗贼', type:'bandit', icon:'⚓',
      level:12, tier:'func',
      hp:240, atk:30, def:10, spd:12, mp:15,
      skills:['da_l1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:15, maxQty:35 },
        { id:'item_crude_blade', chance:0.10, minQty:1, maxQty:1 },
      ],
      exp:60, silver:18,
      terrain:['水乡'],
      minLevel:6,
      desc:'在渡口抢劫的盗贼，趁着夜色劫掠过往行人。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv22 渡船BOSS ──
  ferry_boss: buildEnemyFromTemplate(
    {
      id:'ferry_boss', name:'渡船霸王', type:'bandit', icon:'⚓',
      level:22, tier:'major',
      hp:480, atk:55, def:17, spd:14, mp:45,
      skills:['da_l1','da02','ge01','ge02'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:60, maxQty:120 },
        { id:'item_iron_token', chance:0.35, minQty:1, maxQty:1 },
        { id:'wep_uc_dao', chance:0.15, minQty:1, maxQty:1 },
      ],
      exp:195, silver:62,
      terrain:['水乡'],
      minLevel:14,
      desc:'控制渡口的霸王，收取高额渡费，手下有众多打手。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_iron_sword', armor:'cs_ferry' }
  ),

  // ── Lv14 渔船盗贼 ──
  fishing_thief: buildEnemyFromTemplate(
    {
      id:'fishing_thief', name:'渔船盗贼', type:'bandit', icon:'🎣',
      level:14, tier:'func',
      hp:260, atk:32, def:10, spd:13, mp:15,
      skills:['da_l1','as_1'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:18, maxQty:40 },
        { id:'item_fish', chance:0.30, minQty:1, maxQty:2 },
      ],
      exp:70, silver:20,
      terrain:['水乡','海岸'],
      minLevel:7,
      desc:'伪装成渔民的盗贼，趁着夜色劫掠其他渔船。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_spear', armor:'cs_cloth' }
  ),

  // ── Lv24 渔场BOSS ──
  fishing_boss: buildEnemyFromTemplate(
    {
      id:'fishing_boss', name:'渔场霸主', type:'bandit', icon:'🎣',
      level:24, tier:'major',
      hp:520, atk:58, def:18, spd:15, mp:50,
      skills:['da_l1','da02','as_1','as_2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:65, maxQty:130 },
        { id:'item_fish', chance:0.50, minQty:2, maxQty:5 },
        { id:'wep_uc_spear', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:225, silver:72,
      terrain:['水乡','海岸'],
      minLevel:15,
      desc:'控制一方渔场的霸主，收取高额渔税，手下有众多打手。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_trident', armor:'cs_fishing' }
  ),

  // ── Lv16 画舫盗贼 ──
  boat_thief: buildEnemyFromTemplate(
    {
      id:'boat_thief', name:'画舫盗贼', type:'bandit', icon:'🚢',
      level:16, tier:'func',
      hp:195, atk:24, def:8, spd:14, mp:20,
      skills:['da_l1','as_1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:22, maxQty:48 },
        { id:'item_luxury_goods', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:88, silver:26,
      terrain:['水乡'],
      minLevel:9,
      desc:'在画舫上行窃的盗贼，趁着宾客醉酒时偷取财物。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv26 画舫BOSS ──
  boat_boss: buildEnemyFromTemplate(
    {
      id:'boat_boss', name:'画舫之主', type:'bandit', icon:'🚢',
      level:26, tier:'major',
      hp:360, atk:40, def:13, spd:16, mp:55,
      skills:['da_l1','da02','as_1','as_2','ge01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:75, maxQty:150 },
        { id:'item_luxury_goods', chance:0.40, minQty:1, maxQty:2 },
        { id:'wep_iron_sword', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:265, silver:85,
      terrain:['水乡'],
      minLevel:17,
      desc:'画舫的真正主人，表面上是富商，实际上是水贼头子。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_boat' }
  ),

  // ── Lv20 赌徒打手 ──
  gambler_thug: buildEnemyFromTemplate(
    {
      id:'gambler_thug', name:'赌徒打手', type:'bandit', icon:'🎲',
      level:20, tier:'func',
      hp:340, atk:42, def:14, spd:12, mp:20,
      skills:['da_l1','fi_lf1'],
      drops:[
        { id:'item_copper_coin', chance:0.70, minQty:30, maxQty:65 },
        { id:'item_dice', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:100, silver:30,
      terrain:['平原','水乡'],
      minLevel:12,
      desc:'赌坊的打手，专门处理赖账的赌徒，拳头很硬。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv32 赌坊BOSS ──
  gambler_boss: buildEnemyFromTemplate(
    {
      id:'gambler_boss', name:'赌坊老板', type:'boss', icon:'🎲',
      level:32, tier:'major',
      hp:720, atk:78, def:24, spd:14, mp:65,
      skills:['da_l1','da02','da03','fi_lf1','fi_hf1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:100, maxQty:200 },
        { id:'item_gold_dice', chance:0.35, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:360, silver:125,
      terrain:['平原','水乡'],
      minLevel:22,
      desc:'赌坊的老板，表面上和气生财，实际上心狠手辣，控制着地下赌业。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_gambler' }
  ),

  // ── Lv18 矿区恶棍 ──
  mine_thug: buildEnemyFromTemplate(
    {
      id:'mine_thug', name:'矿区恶棍', type:'bandit', icon:'⛏',
      level:18, tier:'func',
      hp:360, atk:42, def:15, spd:10, mp:15,
      skills:['da_l1','fi_lf1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:25, maxQty:55 },
        { id:'item_iron_ore', chance:0.35, minQty:1, maxQty:2 },
      ],
      exp:95, silver:28,
      terrain:['山地'],
      minLevel:10,
      desc:'矿区中的恶棍，强占矿脉，欺压矿工，无恶不作。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_pickaxe', armor:'cs_mine' }
  ),

  // ── Lv28 矿区BOSS ──
  mine_boss: buildEnemyFromTemplate(
    {
      id:'mine_boss', name:'矿主', type:'boss', icon:'⛏',
      level:28, tier:'major',
      hp:680, atk:72, def:24, spd:12, mp:55,
      skills:['da_l1','da02','fi_lf1','fi_hf1','ge01'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:90, maxQty:180 },
        { id:'item_iron_ore', chance:0.55, minQty:2, maxQty:4 },
        { id:'item_gold_ore', chance:0.25, minQty:1, maxQty:1 },
      ],
      exp:320, silver:105,
      terrain:['山地'],
      minLevel:18,
      desc:'矿区的实际控制者，拥有私人武装，是当地的地头蛇。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_mine2' }
  ),

  // ── Lv15 经书盗贼 ──
  scripture_thief: buildEnemyFromTemplate(
    {
      id:'scripture_thief', name:'经书盗贼', type:'bandit', icon:'📜',
      level:15, tier:'func',
      hp:280, atk:35, def:11, spd:14, mp:20,
      skills:['da_l1','as_1'],
      drops:[
        { id:'item_copper_coin', chance:0.55, minQty:20, maxQty:45 },
        { id:'item_stolen_scripture', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:78, silver:24,
      terrain:['山地','平原'],
      minLevel:8,
      desc:'专门盗窃佛经道藏的盗贼，据说背后有神秘买家。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_cloth' }
  ),

  // ── Lv28 盗经头目 ──
  scripture_thief_lord: buildEnemyFromTemplate(
    {
      id:'scripture_thief_lord', name:'盗经头目', type:'boss', icon:'📜',
      level:28, tier:'major',
      hp:620, atk:68, def:22, spd:16, mp:55,
      skills:['da_l1','da02','as_1','as_2','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:80, maxQty:160 },
        { id:'item_stolen_scripture', chance:0.45, minQty:1, maxQty:2 },
        { id:'item_ancient_manual', chance:0.18, minQty:1, maxQty:1 },
      ],
      exp:310, silver:105,
      terrain:['山地','平原'],
      minLevel:18,
      desc:'专门组织盗窃经书的大盗，武功高强，行踪诡秘。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_iron_sword', armor:'cs_scripture' }
  ),

  // ── Lv22 海沙BOSS ──
  haisha_boss: buildEnemyFromTemplate(
    {
      id:'haisha_boss', name:'海沙帮主', type:'boss', icon:'⚓',
      level:22, tier:'major',
      hp:680, atk:75, def:22, spd:16, mp:65,
      skills:['da_l1','da02','da03','ge01','ge02','wi_l1'],
      drops:[
        { id:'item_copper_coin', chance:1.0, minQty:90, maxQty:180 },
        { id:'item_haisha_token', chance:0.55, minQty:1, maxQty:1 },
        { id:'wep_rare_sword', chance:0.20, minQty:1, maxQty:1 },
      ],
      exp:350, silver:120,
      terrain:['水乡','海岸'],
      minLevel:14,
      desc:'海沙帮的帮主，控制着大运河上的水贼势力，是水上的一方霸主！',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'chief', weapon:'wep_dragon_saber', armor:'cs_haisha3' }
  ),

  // ── Lv17 水域恶棍 ──
  water_thug: buildEnemyFromTemplate(
    {
      id:'water_thug', name:'水域恶棍', type:'bandit', icon:'⚓',
      level:17, tier:'func',
      hp:340, atk:40, def:13, spd:12, mp:20,
      skills:['da_l1','fi_lf1'],
      drops:[
        { id:'item_copper_coin', chance:0.60, minQty:22, maxQty:48 },
        { id:'item_damp_cargo', chance:0.22, minQty:1, maxQty:1 },
      ],
      exp:92, silver:28,
      terrain:['水乡','海岸'],
      minLevel:10,
      desc:'在水域活动的恶棍，欺压渔民，收取保护费，无恶不作。',
      aggro:true, alignment:'chaotic',
    },
    { portrait:'bandit', weapon:'wep_uc_dao', armor:'cs_haisha' }
  ),

}; // END ENEMY_DB

// ── 动态等级缩放（普通怪随玩家等级浮动，BOSS/elite 保持原等级）─────────
// isDungeon: 是否为地下城模式。地下城内所有怪物等级都动态调整；NPC战斗时elite/boss保持原等级
function scaleEnemy(enemy, playerLevel, isDungeon = false) {
  if (!enemy) return null;

  // 地下城模式且已由外部钳制等级：直接使用钳制后的等级，不再随机
  if (enemy._dungeonClamped) {
    const clampedLevel = enemy.level || 1;
    const diff = playerLevel - clampedLevel;
    let ratio;
    // 地下城钳制模式下，低等级面对高等级怪时削弱更激进
    if      (diff <= -8) ratio = 0.40;
    else if (diff <= -5) ratio = 0.55;
    else if (diff <= -2) ratio = 0.70;
    else if (diff <=  1) ratio = 0.85;
    else if (diff <=  4) ratio = 1.00;
    else if (diff <=  9) ratio = 1.10;
    else                 ratio = 1.25;

    const result = {
      ...enemy,
      level: clampedLevel,
      hp:    Math.round(enemy.hp    * ratio),
      atk:   Math.round(enemy.atk   * ratio),
      def:   Math.round(enemy.def   * ratio),
      mp:    Math.round((enemy.mp || 0) * ratio),
      exp:   Math.round(enemy.exp   * ratio),
      silver: Math.round((enemy.silver || 0) * ratio),
      _scaled: true,
      _scaledRatio: ratio,
    };
    delete result._dungeonClamped; // 清理标记
    return result;
  }

  const diff = playerLevel - (enemy.level || 1);
  let ratio;
  if      (diff <= -10) ratio = 0.70;
  else if (diff <=  -5) ratio = 0.85;
  else if (diff <=   4) ratio = 1.00;
  else if (diff <=   9) ratio = 1.15;
  else if (diff <=  19) ratio = 1.35;
  else                  ratio = 1.60;

  let displayLevel;
  // 地下城模式：所有怪物等级都动态调整；NPC模式：elite/boss保持原等级
  if (!isDungeon && (enemy.tier === 'elite' || enemy.tier === 'boss')) {
    displayLevel = enemy.level || 1;
  } else {
    const offset = Math.round((Math.random() - 0.5) * 6); // -3 ~ +3
    displayLevel = Math.max(1, playerLevel + offset);
  }

  return {
    ...enemy,
    level: displayLevel,
    hp:    Math.round(enemy.hp    * ratio),
    atk:   Math.round(enemy.atk   * ratio),
    def:   Math.round(enemy.def   * ratio),
    mp:    Math.round((enemy.mp || 0) * ratio),
    exp:   Math.round(enemy.exp   * ratio),
    silver: Math.round((enemy.silver || 0) * ratio),
    _scaled: true,
    _scaledRatio: ratio,
  };
}

// 导出（Node.js / 浏览器兼容）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ENEMY_DB, ENEMY_TYPES, TERRAIN_ENEMY_WEIGHT, scaleEnemy };
} else if (typeof window !== 'undefined') {
  window.ENEMY_DB = ENEMY_DB;
  window.ENEMY_TYPES = ENEMY_TYPES;
  window.TERRAIN_ENEMY_WEIGHT = TERRAIN_ENEMY_WEIGHT;
  window.scaleEnemy = scaleEnemy;
}
