// ════════════════════════════════════════════════════
//  data-enemies.js  野外敌人数据库
//  包括：猛兽 / 强盗山贼 / 邪道散兵 / 刺客 / 特殊BOSS
//  格式与 NPC_DB 战斗字段兼容（可直接送入 battle.js）
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
//  ENEMY_DB  野外敌人数据
//  字段说明：
//    id / name / type / icon / level / tier
//    avatar         : 文字字符画（战斗界面右侧）
//    hp/atk/def/spd : 基础战斗属性（scale 时 ×玩家等级系数）
//    skills         : 技能ID列表（从 SKILL_LIB 取）
//    drops          : [{ id, chance, minQty, maxQty }]
//    exp / silver   : 击杀奖励
//    terrain        : 偏好地形（可多个）
//    minLevel       : 玩家等级下限（低于不出现）
//    desc           : 遭遇描述
//    aggro          : 是否主动攻击（true）
//    alignment      : 阵营（影响击杀后的声誉/任务）
// ────────────────────────────────────────────────
// ★ 兼容：如果 data-enemies.js 已定义 ENEMY_DB，则合并而非覆盖
if(typeof ENEMY_DB !== 'undefined'){
  Object.assign(ENEMY_DB, {

  // ══════════════════════════════════════
  //  一、猛兽类
  // ══════════════════════════════════════

  // ── Lv3 入门猛兽 ──
  wolf: {
    id:'wolf', name:'山野饿狼', type:'beast', icon:'🐺',
    avatar:`  ／＼
 (°ᴥ°)>
  ╰┘`,
    level:3, tier:'func',
    //  玩家Lv3: hp158/atk17/def11  → func目标: hp×1.1~1.5 / atk×1.0~1.3
    hp:175, atk:18, def:4, spd:12, mp:0,
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

  // ── Lv8 野猪 (新增，填补Lv5-12空白) ──
  wild_boar: {
    id:'wild_boar', name:'山野野猪', type:'beast', icon:'🐗',
    avatar:` (°o°)
 /猪猪\\
  ╰╯`,
    level:8, tier:'func',
    //  玩家Lv8: hp178/atk22/def13.5 → func: hp×1.2
    hp:215, atk:22, def:8, spd:8, mp:0,
    skills:['fo_l1'],
    drops:[
      { id:'item_wolf_pelt',  chance:0.40, minQty:1, maxQty:1 },  // 用皮毛代替猪皮
    ],
    exp:40, silver:0,
    terrain:['山地','丛林','平原'],
    minLevel:3,
    desc:'一头棕黑色的野猪从灌木中撞出，两根獠牙顶天立地！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv12 普通猛虎 ──
  tiger_normal: {
    id:'tiger_normal', name:'猛虎', type:'beast', icon:'🐯',
    avatar:` /\\/\\
(>ω<)
 \\||/`,
    level:12, tier:'func',
    //  玩家Lv12: hp194/atk26/def15.5 → func: hp×1.3 atk×1.2
    hp:252, atk:31, def:10, spd:11, mp:0,
    skills:['fi_lf1','fr_l1'],
    drops:[
      { id:'item_tiger_skin',  chance:0.50, minQty:1, maxQty:1 },
      { id:'item_tiger_bone',  chance:0.35, minQty:1, maxQty:1 },
    ],
    exp:80, silver:0,
    terrain:['山地','丛林','高山'],
    minLevel:6,
    desc:'猛虎横卧山道，发出低沉咆哮，背后的山林一片死寂。',
    aggro:true, alignment:'neutral',
  },

  // ── Lv15 巨狼首领（major，hp×2.0）──
  wolf_alpha: {
    id:'wolf_alpha', name:'巨狼首领', type:'beast', icon:'🐺',
    avatar:` /\\/\\
(⊙ᴥ⊙)
 \\╰╯/`,
    level:15, tier:'major',
    //  玩家Lv15: hp206/atk29/def17 → major: hp×2.1 atk×1.5
    hp:432, atk:44, def:14, spd:15, mp:0,
    skills:['fi_lf1','fi1g','ge_l1'],
    drops:[
      { id:'item_wolf_pelt',    chance:0.90, minQty:2, maxQty:3 },
      { id:'item_wolf_fang',    chance:0.80, minQty:2, maxQty:4 },
      { id:'item_beast_core',   chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:130, silver:30,
    terrain:['山地','平原'],
    minLevel:8,
    desc:'狼群首领，体型如牛，一声嚎叫群狼应和——此地是它的领地！',
    aggro:true, alignment:'neutral',
    questRef: 'sq_beast_wolf_pack',
  },

  // ── Lv18 黑背熊 ──
  black_bear: {
    id:'black_bear', name:'黑背熊', type:'beast', icon:'🐻',
    avatar:` (\\/)
(°°)
/|  |\\`,
    level:18, tier:'func',
    //  玩家Lv18: hp218/atk32/def18.5 → func: hp×1.3 atk×1.2
    hp:283, atk:38, def:20, spd:6, mp:0,
    skills:['fo_l1','fo01'],
    drops:[
      { id:'item_bear_hide',  chance:0.55, minQty:1, maxQty:1 },
      { id:'item_bear_paw',   chance:0.30, minQty:1, maxQty:2 },
    ],
    exp:115, silver:0,
    terrain:['山地','丛林'],
    minLevel:10,
    desc:'黑熊猛地从树后窜出，熊掌一巴下来能拍碎磐石！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv20 嵩山白额虎（major，hp×2.0）──
  tiger_songshan: {
    id:'tiger_songshan', name:'嵩山白额虎', type:'beast', icon:'🐯',
    avatar:` /\\/\\
(★ω★)
 \\╪╪/`,
    level:20, tier:'major',
    //  玩家Lv20: hp226/atk34/def19.5 → major: hp×2.2 atk×1.6
    hp:497, atk:54, def:20, spd:13, mp:0,
    skills:['fi_lf1','fr_l1','fr01'],
    drops:[
      { id:'item_tiger_skin',  chance:0.95, minQty:1, maxQty:1 },
      { id:'item_tiger_bone',  chance:0.90, minQty:2, maxQty:3 },
      { id:'item_beast_core',  chance:0.40, minQty:1, maxQty:1 },
    ],
    exp:270, silver:0,
    terrain:['高山'],
    minLevel:12,
    desc:'嵩山的白额大虎，额上天然白斑，据说已在此活了三十年，通了灵性。',
    aggro:true, alignment:'neutral',
    questRef: 'sq_tiger_mountain',
  },

  // ── Lv22 巨蟒（major，hp×2.0）──
  giant_snake: {
    id:'giant_snake', name:'巨蟒', type:'beast', icon:'🐍',
    avatar:` ~~~~
~Ω~
S~~~~`,
    level:22, tier:'major',
    //  玩家Lv22: hp234/atk36/def20.5 → major: hp×2.0 atk×1.3
    hp:468, atk:47, def:16, spd:9, mp:40,
    skills:['po_l1','po01','po02'],
    drops:[
      { id:'item_snake_scale',  chance:0.60, minQty:2, maxQty:4 },
      { id:'item_snake_gall',   chance:0.40, minQty:1, maxQty:1 },
      { id:'item_venom_sac',    chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:200, silver:0,
    terrain:['丛林','水乡'],
    minLevel:14,
    desc:'林间草木无声，足下忽觉冰凉——回头，一条丈余长的大蟒正盯着你！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv6 毒蛛群（Lv3→6，补足hp）──
  poison_spider: {
    id:'poison_spider', name:'毒蛛群', type:'beast', icon:'🕷',
    avatar:`  oOo
o(ó_ò)o
  oOo`,
    level:6, tier:'func',
    //  玩家Lv6: hp170/atk20/def12.5 → func: hp×1.1
    hp:187, atk:18, def:4, spd:14, mp:20,
    skills:['po_l1'],
    drops:[
      { id:'item_venom_sac',   chance:0.50, minQty:1, maxQty:2 },
    ],
    exp:28, silver:0,
    terrain:['丛林','高山'],
    minLevel:2,
    desc:'蛛网从四面张开，无数毒蛛齐齐落下——这是它们的巢穴！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv30 冰原雪狼（major，hp×2.0）──
  ice_wolf: {
    id:'ice_wolf', name:'冰原雪狼', type:'beast', icon:'🐺',
    avatar:`  /\\/\\
 (◑◑)>
  ╰❄╯`,
    level:30, tier:'major',
    //  玩家Lv30: hp266/atk44/def24.5 → major: hp×2.0 atk×1.5
    hp:532, atk:66, def:22, spd:18, mp:30,
    skills:['fi_lf1','ic_l1','ic01'],
    drops:[
      { id:'item_wolf_pelt',    chance:0.70, minQty:1, maxQty:2 },
      { id:'item_ice_crystal',  chance:0.45, minQty:1, maxQty:2 },
    ],
    exp:240, silver:0,
    terrain:['冰原'],
    minLevel:20,
    desc:'冰原上的雪白巨狼，毛发如冰，呼出的雾气能把人冻住。',
    aggro:true, alignment:'neutral',
  },

  // ── Lv38 草原雄狮（新增，填补Lv30-45空白）──
  steppe_lion: {
    id:'steppe_lion', name:'草原雄狮', type:'beast', icon:'🦁',
    avatar:` /\\●/\\
(≧ω≦)
 ╰══╯`,
    level:38, tier:'major',
    //  玩家Lv38: hp298/atk52/def28.5 → major: hp×2.2
    hp:655, atk:78, def:28, spd:16, mp:0,
    skills:['fi_lf1','fr_l1','fr01','fo01'],
    drops:[
      { id:'item_tiger_skin',   chance:0.65, minQty:1, maxQty:1 },  // 狮皮借用虎皮
      { id:'item_beast_core',   chance:0.35, minQty:1, maxQty:1 },
    ],
    exp:380, silver:0,
    terrain:['草原','沙漠绿洲'],
    minLevel:28,
    desc:'西域草原的霸主，鬣毛如云，一爪足以粉碎岩石——它已经盯上你了！',
    aggro:true, alignment:'neutral',
  },

  // ── Lv45 山岭猛熊（major，大等级猛兽）──
  mountain_bear: {
    id:'mountain_bear', name:'山岭老熊', type:'beast', icon:'🐻',
    avatar:` (\\●/)
(●_●)
/|#|\\`,
    level:45, tier:'major',
    //  玩家Lv45: hp326/atk59/def32 → major: hp×2.3
    hp:750, atk:90, def:38, spd:5, mp:0,
    skills:['fo_l1','fo01','fo02'],
    drops:[
      { id:'item_bear_hide',   chance:0.80, minQty:1, maxQty:2 },
      { id:'item_bear_paw',    chance:0.55, minQty:1, maxQty:2 },
      { id:'item_beast_core',  chance:0.50, minQty:1, maxQty:1 },
    ],
    exp:560, silver:0,
    terrain:['山地','高山'],
    minLevel:35,
    desc:'深山老林里盘踞多年的巨熊，毛色如铁，传说中它曾把一面山壁拍塌。',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════
  //  二、强盗山贼类
  // ══════════════════════════════════════

  // ── Lv5 落草汉（func，hp×1.2）──
  bandit_rogue: {
    id:'bandit_rogue', name:'落草汉', type:'bandit', icon:'🗡',
    avatar:` (°▽°)
  |刀|
 / \\`,
    level:5, tier:'func',
    //  玩家Lv5: hp166/atk19 → func: hp×1.2
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

  // ── Lv13 老匪（func，hp×1.3）──
  bandit_veteran: {
    id:'bandit_veteran', name:'老匪', type:'bandit', icon:'🗡',
    avatar:` (>_<)
 |刀×|
 / \\`,
    level:13, tier:'func',
    //  玩家Lv13: hp198/atk27 → func: hp×1.3 atk×1.2
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

  // ── Lv25 断刀张（major，hp×2.0）──
  bandit_chief_cangzhou: {
    id:'bandit_chief_cangzhou', name:'断刀张', type:'bandit', icon:'⚔',
    avatar:` (✖_✖)
 ||刀刀
 /\\ `,
    level:25, tier:'major',
    //  玩家Lv25: hp246/atk39 → major: hp×2.0 atk×1.7
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

  // ── Lv15 海沙水寇（func，hp×1.2）──
  haisha_pirate: {
    id:'haisha_pirate', name:'海沙帮水寇', type:'bandit', icon:'⚓',
    avatar:` (^_^)/
  |桨|
 ~波~`,
    level:15, tier:'func',
    //  玩家Lv15: hp206/atk29 → func: hp×1.2
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

  // ── Lv28 海沙队长（major，hp×2.0）──
  haisha_captain: {
    id:'haisha_captain', name:'海沙帮水寇队长', type:'bandit', icon:'⚓',
    avatar:` (≥▽≤)
 |锚|⚓
 ~海~`,
    level:28, tier:'major',
    //  玩家Lv28: hp258/atk42 → major: hp×2.0 atk×1.6
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

  // ── Lv20 天地帮收费头目（major，hp×1.8）──
  tiandibang_toll: {
    id:'tiandibang_toll', name:'天地帮收费头目', type:'bandit', icon:'🪙',
    avatar:` (≧益≦)
 |棍|棍
 /  \\`,
    level:20, tier:'major',
    //  玩家Lv20: hp226/atk34 → major: hp×1.8 atk×1.5
    hp:407, atk:51, def:18, spd:10, mp:30,
    skills:['st_l1','st01','ge01'],
    drops:[
      { id:'item_copper_coin',  chance:1.0,  minQty:60, maxQty:120 },
      { id:'item_tiandi_token', chance:1.0,  minQty:1, maxQty:1    },
    ],
    exp:265, silver:100,
    terrain:['平原','山地'],
    minLevel:12,
    desc:'天地帮在汉中道上的"收税官"，横眉立目，收起保护费来理直气壮。',
    aggro:true, alignment:'chaotic',
    questRef: 'sq_tiandibang_toll',
  },

  // ── Lv17 西域马匪（func，hp×1.1）──
  desert_marauder: {
    id:'desert_marauder', name:'西域马匪', type:'bandit', icon:'🐴',
    avatar:` /人人
(＞▽＜)
  ╝╝`,
    level:17, tier:'func',
    //  玩家Lv17: hp214/atk31 → func: hp×1.2 atk×1.3
    hp:257, atk:40, def:13, spd:14, mp:15,
    skills:['da_l1','da01','wi_l1'],
    drops:[
      { id:'item_copper_coin',  chance:0.85, minQty:20, maxQty:60 },
      { id:'item_western_silk', chance:0.20, minQty:1, maxQty:2   },
    ],
    exp:118, silver:42,
    terrain:['沙漠绿洲','草原'],
    minLevel:9,
    desc:'一队西域打扮的马匪从沙丘后杀出，弓弩齐发！',
    aggro:true, alignment:'chaotic',
  },

  // ── Lv40 绿林大当家（major，新增，填Lv30-50断层）──
  bandit_warlord: {
    id:'bandit_warlord', name:'绿林大当家', type:'bandit', icon:'⚔',
    avatar:` (>_<)
 |双刀|
  /|\\`,
    level:40, tier:'major',
    //  玩家Lv40: hp306/atk54 → major: hp×2.0
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

  // ══════════════════════════════════════
  //  三、邪道散兵（血骨门/玄冥教/日月神教）
  // ══════════════════════════════════════

  // ── Lv10 血骨门小喽啰（func，hp×1.2）──
  xuegu_ruffian: {
    id:'xuegu_ruffian', name:'血骨门小喽啰', type:'evil', icon:'💀',
    avatar:` (☠_☠)
 |骨刀|
  ╱╲`,
    level:10, tier:'func',
    //  玩家Lv10: hp186/atk24 → func: hp×1.2
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

  // ── Lv30 血骨门追命使（major，hp×2.1）──
  xuegu_elite_songshan: {
    id:'xuegu_elite_songshan', name:'血骨门追命使', type:'evil', icon:'💀',
    avatar:` (☠☠☠)
 |骨|骨|
  ╱╲╱`,
    level:30, tier:'major',
    //  玩家Lv30: hp266/atk44 → major: hp×2.1 atk×1.7
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

  // ── Lv22 玄冥奸细（func，hp×1.1）──
  xuanming_spy: {
    id:'xuanming_spy', name:'玄冥教奸细', type:'evil', icon:'🌑',
    avatar:` (•̀ᴗ•́)
 |暗|钩|
  └┘`,
    level:22, tier:'func',
    //  玩家Lv22: hp234/atk36 → func: hp×1.1 atk×1.3
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

  // ── Lv35 玄冥教杀手（major，hp×1.9）──
  xuanming_assassin_wudang: {
    id:'xuanming_assassin_wudang', name:'玄冥教杀手', type:'assassin', icon:'🌑',
    avatar:` (⊙ᗜ⊙)
 |暗刃|
  |||`,
    level:35, tier:'major',
    //  玩家Lv35: hp286/atk49 → major: hp×1.9 atk×1.7
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

  // ── Lv18 日月神教细作（func，hp×1.1）──
  riyue_spy_changan: {
    id:'riyue_spy_changan', name:'日月神教细作', type:'evil', icon:'🌙',
    avatar:` (ò_ó)
 |金钩|
  ╱ ╲`,
    level:18, tier:'func',
    //  玩家Lv18: hp218/atk32 → func: hp×1.1 atk×1.25
    hp:240, atk:40, def:12, spd:15, mp:40,
    skills:['da_l1','da01','da02'],
    drops:[
      { id:'item_copper_coin',     chance:0.75, minQty:20, maxQty:50  },
      { id:'item_riyue_token',     chance:0.55, minQty:1, maxQty:1    },
    ],
    exp:138, silver:48,
    terrain:['平原'],
    minLevel:10,
    desc:'日月神教的情报人员，潜伏在长安城内，收集各派动态。',
    aggro:false, alignment:'evil',
    questRef: 'sq_riyue_spy',
  },

  // ── Lv16 五毒教弟子（func，hp×1.2）──
  wudu_experiment: {
    id:'wudu_experiment', name:'五毒教弟子', type:'evil', icon:'☠',
    avatar:` (•ω•)
 |毒蛊|
  ~蛊~`,
    level:16, tier:'func',
    //  玩家Lv16: hp210/atk30 → func: hp×1.2 atk×1.1
    hp:252, atk:33, def:10, spd:12, mp:60,
    skills:['po_l1','po01','po02'],
    drops:[
      { id:'item_venom_sac',      chance:0.70, minQty:1, maxQty:2  },
      { id:'item_antidote_recipe',chance:0.40, minQty:1, maxQty:1  },
      { id:'item_wudu_insect',    chance:0.30, minQty:1, maxQty:1  },
    ],
    exp:108, silver:28,
    terrain:['丛林','山地'],
    minLevel:8,
    desc:'五毒教弟子，随身携带各类毒虫，在苗疆一带进行秘密实验。',
    aggro:true, alignment:'evil',
    questRef: 'sq_poison_village',
  },

  // ── Lv42 血骨门护法（major，新增，Lv30-55段邪道精英）──
  xuegu_guardian: {
    id:'xuegu_guardian', name:'血骨门护法', type:'evil', icon:'💀',
    avatar:` (☠═☠)
 ‖骨|骨‖
  ╱╪╲`,
    level:42, tier:'major',
    //  玩家Lv42: hp314/atk56 → major: hp×2.0
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

  // ══════════════════════════════════════
  //  四、刺客（高速/高爆发）
  // ══════════════════════════════════════

  // ── Lv18 黑衣刺客（func，刺客型：高atk/高spd/低hp）──
  shadow_killer: {
    id:'shadow_killer', name:'黑衣刺客', type:'assassin', icon:'🗡',
    avatar:`(▸▾◂)
 |◈刃◈|
  └─┘`,
    level:18, tier:'func',
    //  玩家Lv18: hp218/atk32 → 刺客定位：hp略低(×0.9)，atk极高(×1.6)，spd极高
    //  注：刺客是高爆发设计，允许hp稍低，但spd/atk要突出
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

  // ── Lv28 赏金猎人（major，高速高爆发）──
  bounty_hunter: {
    id:'bounty_hunter', name:'赏金猎人', type:'assassin', icon:'⚔',
    avatar:` (○口○)
 |剑|匕|
  ╱ ╲`,
    level:28, tier:'major',
    //  玩家Lv28: hp258/atk42 → major: hp×1.8，atk×1.7
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

  // ── Lv44 影杀堂杀手（major，新增高等级刺客）──
  shadow_master: {
    id:'shadow_master', name:'影杀堂杀手', type:'assassin', icon:'🗡',
    avatar:`(◈▾◈)
 ‖◈刃◈‖
  ╰═╯`,
    level:44, tier:'major',
    //  玩家Lv44: hp322/atk58 → major: hp×1.8 atk×1.9
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

  // ══════════════════════════════════════
  //  五、邪灵/异象（特殊地形专属）
  // ══════════════════════════════════════

  // ── Lv13 荒野游魂（func，hp×1.1；零防御为特色）──
  ghost_wanderer: {
    id:'ghost_wanderer', name:'荒野游魂', type:'ghost', icon:'👻',
    avatar:`  ))(
 (ᗒᗩᗕ)
 ~飘~`,
    level:13, tier:'func',
    //  玩家Lv13: hp198/atk27 → 游魂: hp×1.1，atk×1.0；无防御是特色
    hp:218, atk:27, def:0, spd:18, mp:80,
    skills:['da_l2','da_l1','da03'],
    drops:[
      { id:'item_ghost_jade',   chance:0.35, minQty:1, maxQty:1  },
    ],
    exp:72, silver:0,
    terrain:['高山','冰原'],
    minLevel:7,
    desc:'深夜山道，一团鬼火从乱石堆中飘来……',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════
  //  （续）猛兽类 · 高等级
  // ══════════════════════════════════════

  // ── Lv50 雪域神鹰（func，高山/冰原专属）──
  snow_eagle: {
    id:'snow_eagle', name:'雪域神鹰', type:'beast', icon:'🦅',
    avatar:` /\\___/\\
(°>  <°)
  \\===/ `,
    level:50, tier:'func',
    // 玩家Lv50: hp346/atk64/def34 → func: hp×1.2 atk×1.1
    hp:415, atk:70, def:22, spd:24, mp:0,
    skills:['wi_l1','wi01','fi_lf1'],
    drops:[
      { id:'item_eagle_feather',  chance:0.70, minQty:1, maxQty:3 },
      { id:'item_beast_core',     chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:1250, silver:0,
    terrain:['高山','冰原'],
    minLevel:38,
    desc:'雪峰上盘旋的巨鹰，展翅宽逾两丈，爪力能抓碎岩石。',
    aggro:true, alignment:'neutral',
  },

  // ── Lv58 冰原雪豹（major，冰原/高山）──
  snow_leopard: {
    id:'snow_leopard', name:'冰原雪豹', type:'beast', icon:'🐆',
    avatar:` /\\ ● /\\
(◎ ^ ◎)
 ╰═══╯ `,
    level:58, tier:'major',
    // 玩家Lv58: hp378/atk72/def38 → major: hp×2.1 atk×1.6
    hp:793, atk:115, def:45, spd:26, mp:0,
    skills:['fi_lf1','fr_l1','fr02','wi01'],
    drops:[
      { id:'item_leopard_pelt',   chance:0.80, minQty:1, maxQty:1 },
      { id:'item_beast_core',     chance:0.45, minQty:1, maxQty:1 },
      { id:'item_ice_crystal',    chance:0.35, minQty:1, maxQty:2 },
    ],
    exp:3600, silver:0,
    terrain:['冰原','高山'],
    minLevel:45,
    desc:'冰原上的顶级猎手，毛色如雪，速度快到几乎看不清身形，一扑便能将人拍飞。',
    aggro:true, alignment:'neutral',
  },

  // ── Lv68 荒漠巨蜥（major，沙漠专属）──
  desert_lizard: {
    id:'desert_lizard', name:'荒漠巨蜥', type:'beast', icon:'🦎',
    avatar:` |^^^^|
(=oooo=)
 \_____/ `,
    level:68, tier:'major',
    // 玩家Lv68: hp418/atk82/def44 → major: hp×2.2 atk×1.6
    hp:919, atk:131, def:55, spd:12, mp:40,
    skills:['po_l1','po02','po03','fo_l1','fo02'],
    drops:[
      { id:'item_lizard_scale',   chance:0.75, minQty:2, maxQty:4 },
      { id:'item_venom_sac',      chance:0.40, minQty:1, maxQty:2 },
      { id:'item_beast_core',     chance:0.35, minQty:1, maxQty:1 },
    ],
    exp:4900, silver:0,
    terrain:['沙漠绿洲'],
    minLevel:55,
    desc:'西域荒漠中的上古巨蜥，体长丈余，口吐剧毒，据说已在此沙漠活了百年。',
    aggro:true, alignment:'neutral',
  },

  // ── Lv80 万年神龟（major，水乡/高山，超高防御）──
  ancient_turtle: {
    id:'ancient_turtle', name:'万年神龟', type:'beast', icon:'🐢',
    avatar:`  ___
 /|||\\
|○_○|
 \\===/ `,
    level:80, tier:'major',
    // 玩家Lv80: hp466/atk94/def54 → major: hp×2.5 atk×1.3 def极高
    hp:1165, atk:122, def:120, spd:4, mp:80,
    skills:['fo_l1','fo02','fo03','ge_l1','ge03'],
    drops:[
      { id:'item_turtle_shell',   chance:0.90, minQty:1, maxQty:1 },
      { id:'item_beast_core',     chance:0.55, minQty:1, maxQty:2 },
      { id:'item_spirit_stone',   chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:6800, silver:0,
    terrain:['水乡','高山'],
    minLevel:65,
    desc:'传说中活了万年的灵龟，龟壳坚硬无比，正道武林视其为祥瑞，贸然攻击者死伤惨重。',
    aggro:false, alignment:'neutral',
  },

  // ── Lv95 天山神鹿（major，冰原稀有）──
  heavenly_deer: {
    id:'heavenly_deer', name:'天山神鹿', type:'beast', icon:'🦌',
    avatar:`  ||  ||
 (ʘᗜʘ)
  / * \\ `,
    level:95, tier:'major',
    // 玩家Lv95: hp526/atk109/def62 → major: hp×2.0 atk×1.4
    hp:1052, atk:152, def:65, spd:30, mp:120,
    skills:['ic_l1','ic02','ic03','wi_l1','wi02','wi03'],
    drops:[
      { id:'item_deer_antler',    chance:0.85, minQty:1, maxQty:1 },
      { id:'item_spirit_stone',   chance:0.50, minQty:1, maxQty:2 },
      { id:'item_beast_core',     chance:0.60, minQty:1, maxQty:2 },
    ],
    exp:9500, silver:0,
    terrain:['冰原'],
    minLevel:80,
    desc:'天山顶的神鹿，双角如冰，踩雪无痕——逍遥派的弟子视其为圣物，猎者慎之。',
    aggro:false, alignment:'neutral',
  },

  // ── Lv110 混沌古熊（elite，高山极罕见）──
  chaos_bear: {
    id:'chaos_bear', name:'混沌古熊', type:'beast', icon:'🐻',
    avatar:` (╬●_●)
‖⊕BEAR⊕‖
 ╰═══╯ `,
    level:110, tier:'elite',
    // 玩家Lv110: hp586/atk124/def70 → elite: hp×5 atk×1.8
    hp:2930, atk:223, def:140, spd:8, mp:200,
    skills:['fo_l1','fo03','fo04','fo05','ge_l1','ge03','ge04'],
    drops:[
      { id:'item_bear_hide',      chance:1.0,  minQty:2, maxQty:3 },
      { id:'item_beast_core',     chance:1.0,  minQty:2, maxQty:3 },
      { id:'item_spirit_stone',   chance:0.70, minQty:1, maxQty:2 },
      { id:'item_chaos_essence',  chance:0.30, minQty:1, maxQty:1 },
    ],
    exp:16500, silver:200,
    terrain:['高山'],
    minLevel:95,
    desc:'上古时代遗留的变异巨熊，皮毛如铁，传说它身上流淌着混沌之气，近身者如入炼狱。',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════
  //  （续）邪道精英 · 高等级
  // ══════════════════════════════════════

  // ── Lv52 日月神教长老（major）──
  riyue_elder: {
    id:'riyue_elder', name:'日月神教长老', type:'evil', icon:'🌙',
    avatar:` (◐◑◐)
 ‖月|日‖
  ╱═╲ `,
    level:52, tier:'major',
    // 玩家Lv52: hp354/atk66/def35 → major: hp×2.0 atk×1.6
    hp:708, atk:106, def:42, spd:18, mp:160,
    skills:['th_l1','th02','th03','da_l2','da04','wi02'],
    drops:[
      { id:'item_copper_coin',    chance:1.0,  minQty:200, maxQty:400 },
      { id:'item_riyue_token',    chance:1.0,  minQty:1, maxQty:1    },
      { id:'wep_rare_dark_blade', chance:0.35, minQty:1, maxQty:1    },
    ],
    exp:2600, silver:380,
    terrain:['平原','山地'],
    minLevel:40,
    desc:'日月神教四大长老之一，金衣黑袍，内力深厚，出手如雷霆。',
    aggro:true, alignment:'evil',
    questRef: 'sq_riyue_spy',
  },

  // ── Lv65 玄冥教主坛使者（major）──
  xuanming_emissary: {
    id:'xuanming_emissary', name:'玄冥教主坛使者', type:'evil', icon:'🌑',
    avatar:` (⊙▽⊙)
 |暗|令|
  ╰═╯ `,
    level:65, tier:'major',
    // 玩家Lv65: hp406/atk79/def42 → major: hp×2.0 atk×1.7
    hp:812, atk:134, def:50, spd:24, mp:200,
    skills:['da_l1','da04','da05','da_l2','wi_l1','wi03','po02','po03'],
    drops:[
      { id:'item_copper_coin',     chance:1.0,  minQty:250, maxQty:500 },
      { id:'item_xuanming_code',   chance:1.0,  minQty:1, maxQty:1    },
      { id:'wep_rare_dark_blade',  chance:0.50, minQty:1, maxQty:1    },
    ],
    exp:4250, silver:500,
    terrain:['山地','高山'],
    minLevel:50,
    desc:'玄冥教主坛的信使，身着黑袍，行踪诡秘，专职传递教主密令，武功极为高深。',
    aggro:true, alignment:'evil',
  },

  // ── Lv78 血骨门坛主（major）──
  xuegu_altar_master: {
    id:'xuegu_altar_master', name:'血骨门坛主', type:'evil', icon:'💀',
    avatar:` (☠═☠═☠)
 ‖骨|甲|骨‖
  ╱══╲ `,
    level:78, tier:'major',
    // 玩家Lv78: hp458/atk92/def53 → major: hp×2.2 atk×1.7
    hp:1008, atk:156, def:68, spd:14, mp:220,
    skills:['da_l1','da04','da05','po02','po03','po04','ge_l1','ge03'],
    drops:[
      { id:'item_copper_coin',     chance:1.0,  minQty:300, maxQty:600 },
      { id:'item_xuegu_emblem',    chance:1.0,  minQty:1, maxQty:1    },
      { id:'wep_rare_xuegu_blade', chance:0.60, minQty:1, maxQty:1    },
      { id:'item_spirit_stone',    chance:0.25, minQty:1, maxQty:1    },
    ],
    exp:6250, silver:600,
    terrain:['山地','高山'],
    minLevel:62,
    desc:'血骨门管辖一方的坛主，手持九节骨鞭，修习了骨冥子亲传的禁忌功法，半人半鬼。',
    aggro:true, alignment:'evil',
  },

  // ── Lv90 日月神教圣使（elite）──
  riyue_saint: {
    id:'riyue_saint', name:'日月神教圣使', type:'evil', icon:'🌙',
    avatar:` (◑▼◐)
‖圣|月|令‖
 ─═════─ `,
    level:90, tier:'elite',
    // 玩家Lv90: hp506/atk104/def60 → elite: hp×4 atk×2.0
    hp:2024, atk:208, def:95, spd:20, mp:300,
    skills:['th_l1','th03','th04','th05','da_l2','da05','wi03','wi04'],
    drops:[
      { id:'item_copper_coin',    chance:1.0,  minQty:400, maxQty:800 },
      { id:'item_riyue_token',    chance:1.0,  minQty:1, maxQty:1    },
      { id:'item_spirit_stone',   chance:0.55, minQty:1, maxQty:2    },
      { id:'item_chaos_essence',  chance:0.20, minQty:1, maxQty:1    },
    ],
    exp:10800, silver:800,
    terrain:['平原','山地'],
    minLevel:75,
    desc:'日月神教最高战力之一，以金月玄功修至化境，据说能以意志操控闪电，令敌胆寒。',
    aggro:true, alignment:'evil',
  },

  // ── Lv105 血骨门副门主（elite）──
  xuegu_vice_master: {
    id:'xuegu_vice_master', name:'血骨门副门主', type:'evil', icon:'💀',
    avatar:` (☠☯☠)
‖骨|命|令‖
─══════─ `,
    level:105, tier:'elite',
    // 玩家Lv105: hp566/atk119/def67 → elite: hp×4.5 atk×2.0
    hp:2547, atk:238, def:130, spd:16, mp:350,
    skills:['da_l1','da05','po_l1','po04','po05','ge_l1','ge04','ge05','da_l2','wi04'],
    drops:[
      { id:'item_copper_coin',     chance:1.0,  minQty:500, maxQty:1000 },
      { id:'item_xuegu_emblem',    chance:1.0,  minQty:2, maxQty:3     },
      { id:'item_chaos_essence',   chance:0.40, minQty:1, maxQty:2     },
      { id:'item_spirit_stone',    chance:0.60, minQty:1, maxQty:2     },
    ],
    exp:14700, silver:1000,
    terrain:['山地','高山'],
    minLevel:90,
    desc:'骨冥子座下第一护法，修习了「噬骨大法」，身上骨骼已尽数化为武器，见者无不色变。',
    aggro:true, alignment:'evil',
    questRef: 'mq_act3_boss',
  },

  // ══════════════════════════════════════
  //  （续）刺客 · 高等级
  // ══════════════════════════════════════

  // ── Lv55 影杀堂首席杀手（major）──
  shadow_grandmaster: {
    id:'shadow_grandmaster', name:'影杀堂首席杀手', type:'assassin', icon:'🗡',
    avatar:`(◈▼◈)
‖◈影◈刃◈‖
 ╰══╯ `,
    level:55, tier:'major',
    // 玩家Lv55: hp366/atk69/def37 → major: hp×1.8 atk×2.0 (刺客风格)
    hp:659, atk:138, def:22, spd:34, mp:160,
    skills:['da_l1','da04','da05','da_l2','wi_l1','wi02','wi03'],
    drops:[
      { id:'item_copper_coin',  chance:1.0,  minQty:200, maxQty:400  },
      { id:'item_poison_dart',  chance:0.80, minQty:5, maxQty:12     },
      { id:'item_dark_token',   chance:0.80, minQty:1, maxQty:2      },
      { id:'item_spirit_stone', chance:0.15, minQty:1, maxQty:1      },
    ],
    exp:3000, silver:420,
    terrain:['平原','山地'],
    minLevel:42,
    desc:'影杀堂传说中的顶级杀手，据说他从未失手——但也没有任何人知道他的真实面目。',
    aggro:true, alignment:'evil',
  },

  // ── Lv75 黑市死士（major）──
  black_market_killer: {
    id:'black_market_killer', name:'黑市死士', type:'assassin', icon:'⚔',
    avatar:` (●▾●)
 |双暗刃|
  ╱ ╲ `,
    level:75, tier:'major',
    // 玩家Lv75: hp446/atk89/def50 → major: hp×1.9 atk×2.0 (刺客风格)
    hp:847, atk:178, def:28, spd:38, mp:200,
    skills:['da_l1','da05','da_l2','wi_l1','wi03','wi04','po03'],
    drops:[
      { id:'item_copper_coin',  chance:1.0,  minQty:300, maxQty:600  },
      { id:'item_dark_token',   chance:1.0,  minQty:2, maxQty:3      },
      { id:'item_spirit_stone', chance:0.30, minQty:1, maxQty:1      },
    ],
    exp:5600, silver:600,
    terrain:['平原','山地','水乡'],
    minLevel:60,
    desc:'来自黑市最神秘组织的死士，为金钱不惜一切，携带各类机关毒器，是江湖中最危险的人。',
    aggro:false, alignment:'evil',
  },

  // ── Lv100 鬼影杀神（elite）──
  ghost_assassin: {
    id:'ghost_assassin', name:'鬼影杀神', type:'assassin', icon:'🗡',
    avatar:`(⊗▾⊗)
‖鬼|影|杀‖
─══════─`,
    level:100, tier:'elite',
    // 玩家Lv100: hp546/atk114/def65 → elite: hp×3.5 atk×2.5 (刺客)
    hp:1911, atk:285, def:45, spd:48, mp:280,
    skills:['da_l1','da05','da_l2','wi_l1','wi05','po03','po04','po05'],
    drops:[
      { id:'item_copper_coin',  chance:1.0,  minQty:400, maxQty:800  },
      { id:'item_dark_token',   chance:1.0,  minQty:2, maxQty:4      },
      { id:'item_chaos_essence',chance:0.35, minQty:1, maxQty:2      },
      { id:'item_spirit_stone', chance:0.55, minQty:1, maxQty:2      },
    ],
    exp:12500, silver:900,
    terrain:['平原','山地'],
    minLevel:85,
    desc:'传说中的鬼影杀神，只要报价够高，帝王将相也不能幸免，他的存在是整个江湖的噩梦。',
    aggro:true, alignment:'evil',
  },

  // ══════════════════════════════════════
  //  （续）邪灵/幻象 · 高等级
  // ══════════════════════════════════════

  // ── Lv62 古战场厉鬼（major，冰原/高山专属）──
  ancient_wraith: {
    id:'ancient_wraith', name:'古战场厉鬼', type:'ghost', icon:'👻',
    avatar:`  ))((
 (⊗ᗩ⊗)
  ~古~`,
    level:62, tier:'major',
    // 玩家Lv62: hp394/atk76/def41 → major: hp×2.0 atk×1.5 def=0(幽灵特性)
    hp:788, atk:114, def:0, spd:28, mp:250,
    skills:['da_l2','da04','da05','th02','th03'],
    drops:[
      { id:'item_ghost_jade',   chance:0.60, minQty:1, maxQty:2  },
      { id:'item_spirit_stone', chance:0.30, minQty:1, maxQty:1  },
    ],
    exp:3700, silver:0,
    terrain:['高山','冰原'],
    minLevel:50,
    desc:'古战场上战死的亡魂，怨气凝结成形，无防御却能穿透铠甲直击魂魄，令人不寒而栗。',
    aggro:true, alignment:'neutral',
  },

  // ── Lv85 千年怨灵（elite，极罕见）──
  ancient_spirit: {
    id:'ancient_spirit', name:'千年怨灵', type:'ghost', icon:'👻',
    avatar:`  )))
 (⊙◎⊙)
  ~冤~`,
    level:85, tier:'elite',
    // 玩家Lv85: hp486/atk99/def57 → elite: hp×3.5 def=0 atk×2.2
    hp:1701, atk:218, def:0, spd:35, mp:400,
    skills:['da_l2','da05','th_l1','th04','th05','ic04','ic05'],
    drops:[
      { id:'item_ghost_jade',   chance:1.0,  minQty:2, maxQty:4  },
      { id:'item_spirit_stone', chance:0.60, minQty:1, maxQty:2  },
      { id:'item_chaos_essence',chance:0.25, minQty:1, maxQty:1  },
    ],
    exp:9500, silver:0,
    terrain:['高山','冰原'],
    minLevel:70,
    desc:'凝聚了千年怨气的上古邪灵，无形无质，毫无防御，却能以纯粹的恐怖摧毁人的意志。',
    aggro:true, alignment:'neutral',
  },

  // ── Lv115 混沌幽魂（elite，极顶级怪）──
  chaos_wraith: {
    id:'chaos_wraith', name:'混沌幽魂', type:'ghost', icon:'👻',
    avatar:` )))◎(((
(⊗━━━⊗)
  ~混沌~`,
    level:115, tier:'elite',
    // 玩家Lv115: hp606/atk129/def72 → elite: hp×4 def=0 atk×2.5
    hp:2424, atk:323, def:0, spd:40, mp:500,
    skills:['da_l2','da05','th_l1','th05','ic05','wi05','ge05'],
    drops:[
      { id:'item_ghost_jade',   chance:1.0,  minQty:3, maxQty:5  },
      { id:'item_chaos_essence',chance:0.60, minQty:1, maxQty:2  },
      { id:'item_spirit_stone', chance:0.80, minQty:2, maxQty:3  },
    ],
    exp:18500, silver:0,
    terrain:['高山','冰原'],
    minLevel:100,
    desc:'不知来自何处的混沌幽魂，连逍遥派掌门也对其束手无策，只能封印于天山深处。',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════
  //  六、野外BOSS（稀有，等级高）
  // ══════════════════════════════════════

  // ── Lv70 西域神兽（rare BOSS，沙漠绿洲）──
  desert_behemoth: {
    id:'desert_behemoth', name:'西域神兽', type:'boss', icon:'🦁',
    avatar:` /\\●●/\\
(≋▼≋)
 ╰═══╯`,
    level:70, tier:'elite',
    hp:4500, atk:175, def:90, spd:18, mp:200,
    skills:['fo_l1','fo04','fo05','fi_lf1','fr04','wi04'],
    drops:[
      { id:'item_beast_core',    chance:1.0,  minQty:3, maxQty:5 },
      { id:'item_spirit_stone',  chance:1.0,  minQty:2, maxQty:3 },
      { id:'item_western_gift',  chance:1.0,  minQty:1, maxQty:1 },
      { id:'item_copper_coin',   chance:1.0,  minQty:800, maxQty:1200 },
    ],
    exp:7000, silver:800,
    terrain:['沙漠绿洲'],
    minLevel:55,
    desc:'西域传说中的神兽，如狮如熊，鬣毛金光，百年一现，目击者无不视之为祥瑞与凶兆。',
    aggro:false, alignment:'neutral',
  },

  // ── Lv88 昆仑真龙（rare BOSS，高山/冰原）──
  kunlun_true_dragon: {
    id:'kunlun_true_dragon', name:'昆仑真龙', type:'boss', icon:'🐉',
    avatar:`  龙  吟
 (◉▽◉)
  ╲═╱`,
    level:88, tier:'elite',
    hp:6000, atk:220, def:120, spd:22, mp:400,
    skills:['ic_l1','ic04','ic05','th_l1','th04','th05','wi_l1','wi04','wi05'],
    drops:[
      { id:'item_dragon_scale',  chance:1.0,  minQty:3, maxQty:5 },
      { id:'item_chaos_essence', chance:1.0,  minQty:2, maxQty:3 },
      { id:'item_spirit_stone',  chance:1.0,  minQty:3, maxQty:5 },
      { id:'item_copper_coin',   chance:1.0,  minQty:1200, maxQty:2000 },
    ],
    exp:11000, silver:1200,
    terrain:['冰原','高山'],
    minLevel:72,
    desc:'昆仑山脉深处蛰伏的远古真龙，鳞甲如星，吐息可冻千里，昆仑派将其视为守护神，轻易不踏入其领地。',
    aggro:false, alignment:'neutral',
  },

  // ── Lv120 天地凶鬼·混沌煞（final BOSS级别）──
  chaos_demon: {
    id:'chaos_demon', name:'混沌煞·天地凶鬼', type:'boss', icon:'👹',
    avatar:`  凶  煞
(☯✖☯)
 ─═══─`,
    level:120, tier:'elite',
    hp:12000, atk:350, def:200, spd:28, mp:600,
    skills:['da_l1','da05','po04','po05','th04','th05','ic05','ge04','ge05','wi05','fr05','fo05'],
    drops:[
      { id:'item_chaos_essence', chance:1.0,  minQty:3, maxQty:5 },
      { id:'item_spirit_stone',  chance:1.0,  minQty:4, maxQty:8 },
      { id:'item_dragon_scale',  chance:1.0,  minQty:2, maxQty:3 },
      { id:'item_copper_coin',   chance:1.0,  minQty:2000, maxQty:3000 },
    ],
    exp:20000, silver:2000,
    terrain:['高山'],
    minLevel:105,
    desc:'天地间积累千万年的邪气凝聚而成的混沌煞体，无形无相，集所有武学之大成——这是武林最终的考验。',
    aggro:true, alignment:'evil',
  },

  // ══════════════════════════════════════════════════════════
  //  地下城专属怪物（补全地下城 enemyId 引用）
  //  分组：山贼系 / 幽灵系 / 五毒系 / 明教系 / 玄冥系 / 血骨系 / 西域系 / 冰原系
  // ══════════════════════════════════════════════════════════

  // ──── 山贼系 ────────────────────────────────────────

  // Lv4 山贼喽啰（func，地下城新手区基础炮灰）
  bandit_foot: {
    id:'bandit_foot', name:'山贼喽啰', type:'bandit', icon:'🗡',
    avatar:` (>_<)
  |刀|
  / \\`,
    level:4, tier:'func',
    hp:185, atk:18, def:6, spd:8, mp:5,
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

  // Lv7 山贼弓手（func，中程输出，地下城弓楼专用）
  bandit_archer: {
    id:'bandit_archer', name:'山贼弓手', type:'bandit', icon:'🏹',
    avatar:` (^_^)
  )弓(
  / \\`,
    level:7, tier:'func',
    hp:190, atk:22, def:5, spd:11, mp:0,
    skills:['wi_l1'],   // 风系入门：远程箭矢
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

  // Lv12 狼王（major，狼牙谷精英怪）
  wolf_king: {
    id:'wolf_king', name:'狼王', type:'beast', icon:'🐺',
    avatar:` /＼＊
(⊙ᴥ⊙)
 ╰╯王`,
    level:12, tier:'major',
    hp:380, atk:34, def:14, spd:14, mp:0,
    skills:['fi_lf1','wi_l1'],
    drops:[
      { id:'item_wolf_pelt', chance:0.80, minQty:1, maxQty:2 },
      { id:'item_wolf_fang', chance:0.60, minQty:1, maxQty:2 },
      { id:'item_beast_core',chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:160, silver:0,
    terrain:['山地','高山'],
    minLevel:6,
    desc:'统领整个狼群的狼王，体型是普通山狼的两倍，嗥叫声能震动山谷，麾下群狼闻声便会疯狂攻击。',
    aggro:true, alignment:'neutral',
  },

  // Lv9 野猪（func，山地近战，比 wild_boar 略弱）
  boar: {
    id:'boar', name:'野猪', type:'beast', icon:'🐗',
    avatar:` (°o°)
 /猪\\
  ╰╯`,
    level:9, tier:'func',
    hp:220, atk:23, def:9, spd:7, mp:0,
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

  // Lv10 山贼头目（func，小BOSS级）
  bandit_chief_low: {
    id:'bandit_chief_low', name:'山贼头目', type:'bandit', icon:'⚔',
    avatar:` (>_<)
 |刀×|
  /|\\`,
    level:10, tier:'func',
    hp:260, atk:28, def:12, spd:9, mp:20,
    skills:['da_l1','ge_l1','ge01'],
    drops:[
      { id:'item_copper_coin', chance:0.80, minQty:5, maxQty:15 },
      { id:'item_iron_token',  chance:0.30, minQty:1, maxQty:1  },
      { id:'item_crude_blade', chance:0.20, minQty:1, maxQty:1  },
    ],
    exp:80, silver:20,
    terrain:['山地'],
    minLevel:5,
    desc:'山寨里管事的头目，一身腱子肉，手里的朴刀砍坏了三把。',
    aggro:true, alignment:'chaotic',
  },

  // Lv16 山贼大当家（major，新手区BOSS）
  bandit_boss: {
    id:'bandit_boss', name:'黑风大当家', type:'bandit', icon:'⚔',
    avatar:` (╬>▽<)
 ┃斧┃斧
  /|\\`,
    level:16, tier:'major',
    hp:490, atk:42, def:18, spd:10, mp:30,
    skills:['da_l1','da01','ge01','fo_l1'],
    drops:[
      { id:'item_copper_coin', chance:1.00, minQty:20, maxQty:40 },
      { id:'item_iron_token',  chance:0.50, minQty:1,  maxQty:1  },
      { id:'item_crude_blade', chance:0.30, minQty:1,  maxQty:1  },
    ],
    exp:280, silver:60,
    terrain:['山地'],
    minLevel:8,
    desc:'纵横关中多年的山贼大当家，双斧挥舞如风车，手下三百弟兄无不俯首帖耳。',
    aggro:true, alignment:'chaotic',
  },

  // ──── 幽灵系 ────────────────────────────────────────

  // Lv14 游荡怨灵（func，幽魂祠基础怪）
  ghost_lv1: {
    id:'ghost_lv1', name:'游荡怨灵', type:'ghost', icon:'👻',
    avatar:`  ~幽~
 (゜゜゜)
  ~~~`,
    level:14, tier:'func',
    hp:230, atk:30, def:6, spd:13, mp:40,
    skills:['da_l1','ic_l1'],
    drops:[
      { id:'item_ghost_jade', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:95, silver:0,
    terrain:['平原','山地'],
    minLevel:8,
    desc:'数百年前的亡魂，久久不肯消散，因怨念太深而化为厉鬼。',
    aggro:true, alignment:'evil',
  },

  // Lv20 古庙守魂（major，幽魂祠精英）
  ghost_lv2: {
    id:'ghost_lv2', name:'古庙守魂', type:'ghost', icon:'👻',
    avatar:`  ━幽━
(◉_◉)
 ╲|╱`,
    level:20, tier:'major',
    hp:460, atk:48, def:10, spd:14, mp:80,
    skills:['ic_l1','ic01','da_l1'],
    drops:[
      { id:'item_ghost_jade', chance:0.45, minQty:1, maxQty:2 },
    ],
    exp:240, silver:0,
    terrain:['平原'],
    minLevel:12,
    desc:'死守古庙的凶魂，已在此镇守千年，任何闯入禁地者都是它的猎物。',
    aggro:true, alignment:'evil',
  },

  // Lv28 千年凶煞（elite，幽魂祠BOSS）
  ghost_boss_low: {
    id:'ghost_boss_low', name:'千年凶煞', type:'ghost', icon:'💀',
    avatar:` ☠ ━ ☠
(◎ᴥ◎)
 ╲煞╱`,
    level:28, tier:'elite',
    hp:1100, atk:68, def:18, spd:15, mp:150,
    skills:['ic_l1','ic01','ic02','da01'],
    drops:[
      { id:'item_ghost_jade',  chance:0.80, minQty:2, maxQty:3 },
      { id:'item_ghost_bone',  chance:0.50, minQty:1, maxQty:2 },
    ],
    exp:850, silver:0,
    terrain:['平原'],
    minLevel:15,
    desc:'被古庙封印千年的煞气之主，阴气冲天，举手投足间冰冷彻骨。',
    aggro:true, alignment:'evil',
  },

  // ──── 五毒系 ────────────────────────────────────────

  // Lv15 毒蛇（func，沼泽近战）
  poison_snake: {
    id:'poison_snake', name:'沼泽毒蛇', type:'beast', icon:'🐍',
    avatar:`  ~~~~
 (°_°)>
~~~~~`,
    level:15, tier:'func',
    hp:245, atk:32, def:7, spd:14, mp:0,
    skills:['to_l1'],    // 毒系入门：淬毒一击
    drops:[
      { id:'item_snake_scale', chance:0.40, minQty:1, maxQty:1 },
      { id:'item_snake_gall',  chance:0.25, minQty:1, maxQty:1 },
      { id:'item_venom_sac',   chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:110, silver:0,
    terrain:['丛林','水乡'],
    minLevel:8,
    desc:'沼泽里潜伏的巨型毒蛇，咬上一口毒性发作，半个时辰内必须解毒。',
    aggro:true, alignment:'neutral',
  },

  // Lv18 五毒教弟子（func，沼泽常规怪）
  five_poison_disciple: {
    id:'five_poison_disciple', name:'五毒教外门弟子', type:'evil', icon:'🧪',
    avatar:` (^▽^)
 |蛊壶|
  / \\`,
    level:18, tier:'func',
    hp:295, atk:36, def:10, spd:10, mp:40,
    skills:['to_l1','to01'],
    drops:[
      { id:'item_venom_sac',   chance:0.30, minQty:1, maxQty:1 },
      { id:'item_wudu_insect', chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:150, silver:10,
    terrain:['丛林'],
    minLevel:10,
    desc:'五毒教最底层的外门弟子，腰间挂着蛊壶，路上随时放毒是他们的拿手好戏。',
    aggro:true, alignment:'evil',
  },

  // Lv28 五毒教长老（major，沼泽精英）
  five_poison_elder: {
    id:'five_poison_elder', name:'五毒教长老', type:'evil', icon:'🧪',
    avatar:` (≧益≦)
 |百毒|
  /|\\`,
    level:28, tier:'major',
    hp:630, atk:58, def:16, spd:11, mp:100,
    skills:['to_l1','to01','to02'],
    drops:[
      { id:'item_venom_sac',      chance:0.60, minQty:1, maxQty:2 },
      { id:'item_antidote_recipe',chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:520, silver:40,
    terrain:['丛林'],
    minLevel:18,
    desc:'五毒教的长老级人物，精通百种蛊毒，被他盯上几乎没有生还的可能。',
    aggro:true, alignment:'evil',
  },

  // Lv38 五毒坛主（elite，沼泽BOSS）
  five_poison_boss: {
    id:'five_poison_boss', name:'五毒坛主·蛊圣', type:'evil', icon:'☠',
    avatar:` ☠~毒~☠
(≧毒≦)
 ╲蛊╱`,
    level:38, tier:'elite',
    hp:1650, atk:82, def:26, spd:12, mp:200,
    skills:['to_l1','to01','to02','to03'],
    drops:[
      { id:'item_venom_sac',      chance:1.00, minQty:2, maxQty:4 },
      { id:'item_antidote_recipe',chance:0.40, minQty:1, maxQty:1 },
      { id:'item_beast_core',     chance:0.30, minQty:1, maxQty:1 },
    ],
    exp:1800, silver:120,
    terrain:['丛林'],
    minLevel:25,
    desc:'五毒教此地坛主，号称「蛊圣」，随手一挥便是千虫扑面，沼泽中无人敢惹。',
    aggro:true, alignment:'evil',
  },

  // ──── 明教系 ────────────────────────────────────────

  // Lv30 明教火卫（func，火焰窟常规怪）
  mingjiao_soldier: {
    id:'mingjiao_soldier', name:'明教火卫', type:'evil', icon:'🔥',
    avatar:` (≥▽≤)
 |火剑|
  / \\`,
    level:30, tier:'func',
    hp:520, atk:58, def:18, spd:10, mp:60,
    skills:['fr_l1','fr01'],
    drops:[
      { id:'item_iron_token',  chance:0.40, minQty:1, maxQty:1 },
    ],
    exp:380, silver:20,
    terrain:['山地'],
    minLevel:20,
    desc:'明教中负责守护圣火的武卫，手持火炬与火剑，眼神狂热。',
    aggro:true, alignment:'chaotic',
  },

  // Lv45 明教长老（major，火焰窟精英）
  mingjiao_elder: {
    id:'mingjiao_elder', name:'明教坐坛长老', type:'evil', icon:'🔥',
    avatar:` (╬≧益≦)
 ┃圣火┃
  /|\\`,
    level:45, tier:'major',
    hp:1050, atk:95, def:32, spd:11, mp:160,
    skills:['fr_l1','fr01','fr02'],
    drops:[
      { id:'item_beast_core',  chance:0.35, minQty:1, maxQty:1 },
      { id:'item_iron_token',  chance:0.50, minQty:1, maxQty:1 },
    ],
    exp:1400, silver:80,
    terrain:['山地'],
    minLevel:32,
    desc:'明教坐坛长老，火系功法已臻大成，能以意念驾驭烈火，战场上如一团行走的火球。',
    aggro:true, alignment:'chaotic',
  },

  // Lv58 圣火大护法（elite，火焰窟BOSS）
  evil_fire_boss: {
    id:'evil_fire_boss', name:'明教圣火大护法', type:'evil', icon:'🔥',
    avatar:` 🔥护法🔥
(≧炎≦)
 ╲圣╱`,
    level:58, tier:'elite',
    hp:2800, atk:130, def:52, spd:12, mp:300,
    skills:['fr_l1','fr01','fr02','fr03'],
    drops:[
      { id:'item_beast_core',   chance:0.60, minQty:1, maxQty:2 },
      { id:'item_spirit_stone', chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:4200, silver:200,
    terrain:['山地'],
    minLevel:40,
    desc:'明教圣火大护法，是火焰窟的最高守护者。他的火焰功法已臻化境，全身烈焰，刀枪不入。',
    aggro:true, alignment:'chaotic',
  },

  // ──── 玄冥系 ────────────────────────────────────────

  // Lv35 玄冥教徒（func，玄冥主坛常规怪）
  xuanming_disciple: {
    id:'xuanming_disciple', name:'玄冥教徒', type:'evil', icon:'🌑',
    avatar:` (°_°)
 |暗刃|
  / \\`,
    level:35, tier:'func',
    hp:610, atk:68, def:22, spd:12, mp:70,
    skills:['da_l1','da01','ic_l1'],
    drops:[
      { id:'item_dark_token',     chance:0.30, minQty:1, maxQty:1 },
      { id:'item_xuanming_code',  chance:0.08, minQty:1, maxQty:1 },
    ],
    exp:600, silver:25,
    terrain:['山地','平原'],
    minLevel:25,
    desc:'玄冥教普通教徒，身着暗灰色教袍，行事阴鸷，擅长夜间偷袭。',
    aggro:true, alignment:'evil',
  },

  // Lv55 玄冥特使（major，玄冥主坛精英）
  xuanming_envoy: {
    id:'xuanming_envoy', name:'玄冥教特使', type:'evil', icon:'🌑',
    avatar:` (≧_≦)
 |寒冰剑|
  /|\\`,
    level:55, tier:'major',
    hp:1350, atk:112, def:40, spd:14, mp:180,
    skills:['ic_l1','ic01','ic02','da01'],
    drops:[
      { id:'item_dark_token',     chance:0.55, minQty:1, maxQty:2 },
      { id:'item_ice_crystal',    chance:0.30, minQty:1, maxQty:1 },
      { id:'item_xuanming_code',  chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:2800, silver:120,
    terrain:['山地'],
    minLevel:40,
    desc:'玄冥教教主派遣的特使，冰寒内力深不可测，走过的地方常留下一片霜迹。',
    aggro:true, alignment:'evil',
  },

  // Lv75 玄冥教主（elite，玄冥主坛BOSS）
  xuanming_boss: {
    id:'xuanming_boss', name:'玄冥教主·寒渊子', type:'evil', icon:'❄',
    avatar:` ❄寒渊子❄
(◉_◉)
 ╲玄冥╱`,
    level:75, tier:'elite',
    hp:4500, atk:188, def:85, spd:15, mp:500,
    skills:['ic_l1','ic01','ic02','ic03','da01','da02'],
    drops:[
      { id:'item_ice_crystal',    chance:1.00, minQty:2, maxQty:4 },
      { id:'item_spirit_stone',   chance:0.35, minQty:1, maxQty:1 },
      { id:'item_xuanming_code',  chance:1.00, minQty:1, maxQty:1 },
    ],
    exp:9500, silver:500,
    terrain:['山地'],
    minLevel:55,
    desc:'玄冥教教主「寒渊子」，冰系武功天下第一，传说他的目光能将活人冻结成冰雕。',
    aggro:true, alignment:'evil',
  },

  // ──── 血骨系（地下城专属） ──────────────────────────

  // Lv40 血骨门士兵（func，血骨要塞常规怪）
  blood_bone_soldier: {
    id:'blood_bone_soldier', name:'血骨门卫兵', type:'evil', icon:'💀',
    avatar:` (>_<)
 |骨刃|
  / \\`,
    level:40, tier:'func',
    hp:700, atk:78, def:28, spd:10, mp:50,
    skills:['da_l1','da01'],
    drops:[
      { id:'item_xuegu_emblem', chance:0.20, minQty:1, maxQty:1 },
      { id:'item_iron_token',   chance:0.35, minQty:1, maxQty:1 },
    ],
    exp:780, silver:30,
    terrain:['山地'],
    minLevel:28,
    desc:'血骨门的普通卫兵，骨甲护身，手持骨刃，对来犯者格杀勿论。',
    aggro:true, alignment:'evil',
  },

  // Lv70 血骨坛主（major，血骨要塞精英）
  blood_bone_altar_master: {
    id:'blood_bone_altar_master', name:'血骨门坛主', type:'evil', icon:'💀',
    avatar:` (✖_✖)
 ┃骨令┃
  /|\\`,
    level:70, tier:'major',
    hp:2800, atk:155, def:68, spd:12, mp:280,
    skills:['da_l1','da01','da02','to01'],
    drops:[
      { id:'item_xuegu_emblem', chance:0.70, minQty:1, maxQty:2 },
      { id:'item_spirit_stone', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:7800, silver:300,
    terrain:['山地'],
    minLevel:55,
    desc:'驻守血骨要塞的坛主级人物，见血不皱眉，手握生死大权，麾下数百弟子唯命是从。',
    aggro:true, alignment:'evil',
  },

  // Lv95 血骨门副门主（elite，血骨要塞强力精英）
  blood_bone_vice_master: {
    id:'blood_bone_vice_master', name:'血骨门副门主·血刃', type:'evil', icon:'☠',
    avatar:` ☠血刃☠
(≧☠≦)
 ╲骨令╱`,
    level:95, tier:'elite',
    hp:7200, atk:258, def:138, spd:14, mp:600,
    skills:['da_l1','da01','da02','da03','to01','to02'],
    drops:[
      { id:'item_xuegu_emblem',   chance:1.00, minQty:2, maxQty:3 },
      { id:'item_spirit_stone',   chance:0.50, minQty:1, maxQty:2 },
      { id:'item_chaos_essence',  chance:0.10, minQty:1, maxQty:1 },
    ],
    exp:18000, silver:800,
    terrain:['山地'],
    minLevel:75,
    desc:'血骨门二号人物「血刃」，号称杀人从不用第二刀，是骨冥子最倚重的打手。',
    aggro:true, alignment:'evil',
  },

  // ──── 西域系 ────────────────────────────────────────

  // Lv20 西域沙匪（func，西域古城常规怪）
  desert_bandit: {
    id:'desert_bandit', name:'西域沙匪', type:'bandit', icon:'🏜',
    avatar:` (°▽°)/
 |弯刀|
  / \\`,
    level:20, tier:'func',
    hp:340, atk:42, def:13, spd:12, mp:15,
    skills:['da_l1','wi_l1'],
    drops:[
      { id:'item_western_silk', chance:0.20, minQty:1, maxQty:1 },
      { id:'item_copper_coin',  chance:0.60, minQty:3, maxQty:8 },
    ],
    exp:220, silver:15,
    terrain:['沙漠绿洲'],
    minLevel:12,
    desc:'西域古城中的沙匪，骑术精湛，惯用弯刀，让往来商队闻风丧胆。',
    aggro:true, alignment:'chaotic',
  },

  // Lv38 西域刺客（major，西域古城精英）
  desert_assassin: {
    id:'desert_assassin', name:'西域暗刃客', type:'assassin', icon:'🗡',
    avatar:` (°_°)
  ╲刃╱
  / \\`,
    level:38, tier:'major',
    hp:780, atk:92, def:25, spd:18, mp:80,
    skills:['da_l1','da01','wi_l1','wi01'],
    drops:[
      { id:'item_dark_token',   chance:0.40, minQty:1, maxQty:1 },
      { id:'item_western_gift', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:1100, silver:60,
    terrain:['沙漠绿洲'],
    minLevel:28,
    desc:'受雇于神秘势力的西域暗刃客，身法奇快，擅长从背后偷袭，出手必取人性命。',
    aggro:true, alignment:'chaotic',
  },

  // Lv60 西域古城守护神兽（elite，西域古城BOSS）
  desert_boss: {
    id:'desert_boss', name:'西域古城守护兽', type:'boss', icon:'🦂',
    avatar:` 🦂蝎王🦂
(◉_◉)
 ╲古城╱`,
    level:60, tier:'elite',
    hp:3200, atk:148, def:72, spd:16, mp:350,
    skills:['to_l1','to01','to02','wi01'],
    drops:[
      { id:'item_beast_core',   chance:0.80, minQty:1, maxQty:2 },
      { id:'item_spirit_stone', chance:0.25, minQty:1, maxQty:1 },
      { id:'item_western_gift', chance:0.50, minQty:1, maxQty:2 },
    ],
    exp:5500, silver:400,
    terrain:['沙漠绿洲'],
    minLevel:45,
    desc:'封印在西域古城地下的远古守护神兽，形如巨蝎，毒液腐蚀一切，沉睡千年后被入侵者惊醒。',
    aggro:true, alignment:'neutral',
  },

  // ──── 冰原系 ────────────────────────────────────────

  // Lv28 冰原雪狼（func，天山常规怪）
  snow_wolf: {
    id:'snow_wolf', name:'冰原雪狼', type:'beast', icon:'🐺',
    avatar:`  /＼
 (°ω°)>
  ╰╯❄`,
    level:28, tier:'func',
    hp:520, atk:55, def:16, spd:15, mp:0,
    skills:['ic_l1','wi_l1'],
    drops:[
      { id:'item_wolf_pelt',   chance:0.50, minQty:1, maxQty:1 },
      { id:'item_ice_crystal', chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:420, silver:0,
    terrain:['冰原','高山'],
    minLevel:18,
    desc:'天山冰原上的雪狼，皮毛厚实洁白，在暴风雪中突袭，爪牙带着寒冰之力。',
    aggro:true, alignment:'neutral',
  },

  // Lv42 冰幽鬼（major，天山冰窟精英）
  ice_ghost: {
    id:'ice_ghost', name:'冰幽鬼', type:'ghost', icon:'❄',
    avatar:`  ━❄━
 (◎_◎)
  ~冰~`,
    level:42, tier:'major',
    hp:920, atk:88, def:28, spd:16, mp:160,
    skills:['ic_l1','ic01','ic02'],
    drops:[
      { id:'item_ice_crystal', chance:0.55, minQty:1, maxQty:2 },
      { id:'item_ghost_jade',  chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:1350, silver:0,
    terrain:['冰原','高山'],
    minLevel:30,
    desc:'冻死在天山的武者怨魂，冰冷的怨念化为驱不散的冰雾，触之彻骨寒。',
    aggro:true, alignment:'evil',
  },

  // Lv65 天山冰魄（elite，天山冰窟BOSS）
  ice_boss: {
    id:'ice_boss', name:'天山冰魄·极寒灵', type:'ghost', icon:'🌨',
    avatar:` 🌨极寒灵🌨
(◉冰◉)
 ╲魄╱`,
    level:65, tier:'elite',
    hp:3800, atk:160, def:80, spd:17, mp:500,
    skills:['ic_l1','ic01','ic02','ic03','wi01'],
    drops:[
      { id:'item_ice_crystal',  chance:1.00, minQty:2, maxQty:4 },
      { id:'item_spirit_stone', chance:0.30, minQty:1, maxQty:1 },
      { id:'item_deer_antler',  chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:7000, silver:200,
    terrain:['冰原','高山'],
    minLevel:50,
    desc:'天山万年冰封中孕育的极寒灵魂，不死不灭，每一次触碰都能冻结血液。逍遥派弟子视它为天山的守护者，轻易不敢惊动。',
    aggro:true, alignment:'neutral',
  },

  // ══════════════════════════════════════════════════════════
  //  新增地下城专属怪物（补全29个地下城）
  //  分组：少林系 / 华山系 / 邙山系 / 黄河系 / 太湖系 / 桃花岛系
  //       昆仑系 / 唐门系 / 雷峰塔系 / 西夏系 / 天地帮系
  // ══════════════════════════════════════════════════════════

  // ──── 少林系（木人巷）──────────────────────────────────

  // Lv12 铜人甲（func，少林木人巷基础怪）
  copper_guardian: {
    id:'copper_guardian', name:'铜人甲', type:'boss', icon:'🤖',
    avatar:`  🤖🤖
 (⚙_⚙)
  ╰╯`,
    level:12, tier:'func',
    hp:380, atk:35, def:20, spd:6, mp:0,
    skills:['st_l1','st01'],
    drops:[
      { id:'item_iron_token', chance:0.25, minQty:1, maxQty:1 },
      { id:'item_spirit_stone', chance:0.05, minQty:1, maxQty:1 },
    ],
    exp:110, silver:15,
    terrain:['山地'],
    minLevel:8,
    desc:'少林机关术制造的铜人守卫，全身铜甲，拳脚刚猛，虽无生命但战斗力惊人。',
    aggro:true, alignment:'righteous',
  },

  // Lv18 铜人护法（major，木人巷精英）
  copper_protector: {
    id:'copper_protector', name:'铜人护法', type:'boss', icon:'🛡',
    avatar:`  🛡🛡
 (Θ_Θ)
  /|\`,
    level:18, tier:'major',
    hp:680, atk:58, def:35, spd:7, mp:30,
    skills:['st_l1','st01','st02','fo_l1'],
    drops:[
      { id:'item_iron_token', chance:0.45, minQty:1, maxQty:2 },
      { id:'item_spirit_stone', chance:0.10, minQty:1, maxQty:1 },
    ],
    exp:280, silver:35,
    terrain:['山地'],
    minLevel:12,
    desc:'木人巷深处的护法铜人，机关更为精密，能施展少林基础武学，是通往藏经阁的最后考验。',
    aggro:true, alignment:'righteous',
  },

  // Lv22 铜人罗汉（elite，木人巷BOSS）
  copper_arhat: {
    id:'copper_arhat', name:'铜人罗汉·金身', type:'boss', icon:'◆',
    avatar:` ◆金身◆
(Θ罗汉Θ)
 少林 `,
    level:22, tier:'elite',
    hp:1600, atk:88, def:55, spd:8, mp:80,
    skills:['st_l1','st02','st03','fo_l1','fo01'],
    drops:[
      { id:'item_iron_token', chance:0.80, minQty:2, maxQty:3 },
      { id:'item_spirit_stone', chance:0.25, minQty:1, maxQty:1 },
      { id:'item_bear_paw', chance:0.30, minQty:1, maxQty:1 }
    ],
    exp:850, silver:80,
    terrain:['山地'],
    minLevel:15,
    desc:'少林镇寺之宝——铜人罗汉，金身不坏，集少林武学之大成。传闻能战胜它的人，才有资格进入藏经阁。',
    aggro:true, alignment:'righteous'
  },

  // ──── 华山系（思过崖）──────────────────────────────────

  // Lv20 剑宗弟子（func，华山思过崖基础怪）
  huashan_sword_disciple: {
    id:'huashan_sword_disciple', name:'剑宗弟子', type:'evil', icon:'⚔',
    avatar:` (^_^)\n |剑剑|\n  / \\`,
    level:20, tier:'func',
    hp:460, atk:48, def:14, spd:13, mp:40,
    skills:['sw_l1','sw01'],
    drops:[
      { id:'item_iron_token', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:180, silver:20,
    terrain:['高山'],
    minLevel:12,
    desc:'华山剑宗的弟子，剑法凌厉，在思过崖上苦修剑道，对闯入者绝不留情。',
    aggro:true, alignment:'chaotic',
  },

  // Lv28 剑宗长老·风无痕（elite，思过崖BOSS）
  huashan_sword_master: {
    id:'huashan_sword_master', name:'剑宗长老·风无痕', type:'boss', icon:'🗡',
    avatar:` 剑宗☯\n(◉剑◉)\n ╲风无痕╱`,
    level:28, tier:'elite',
    hp:2200, atk:118, def:38, spd:16, mp:150,
    skills:['sw_l1','sw01','sw02','sw03','wi_l1'],
    drops:[
      { id:'item_iron_token', chance:0.70, minQty:2, maxQty:3 },
      { id:'item_spirit_stone', chance:0.20, minQty:1, maxQty:1 },
      { id:'item_beast_core', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:1400, silver:120,
    terrain:['高山'],
    minLevel:18,
    desc:'华山剑宗长老风无痕，剑法已臻化境，在思过崖隐居多年。若能得其指点，剑道必能大增——但前提是你能接下他一百招。',
    aggro:true, alignment:'chaotic',
  },

  // ──── 邙山系（王陵）──────────────────────────────────

  // Lv25 古墓僵尸（func，邙山王陵基础怪）
  tomb_zombie: {
    id:'tomb_zombie', name:'古墓僵尸', type:'ghost', icon:'🧟',
    avatar:`  🧟\n (×_×)\n  ╰┴╯`,
    level:25, tier:'func',
    hp:520, atk:45, def:12, spd:7, mp:0,
    skills:['da_l1','da01'],
    drops:[
      { id:'item_ghost_jade', chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:200, silver:0,
    terrain:['平原'],
    minLevel:15,
    desc:'邙山古墓中苏醒的僵尸，身披腐朽铠甲，行动迟缓但力大无穷，被怨气驱使着攻击活人。',
    aggro:true, alignment:'evil',
  },

  // Lv32 千年尸兵（major，王陵精英）
  ancient_undead_soldier: {
    id:'ancient_undead_soldier', name:'千年尸兵', type:'ghost', icon:'💀',
    avatar:` 💀💀
(⊙死亡⊙)
  ╱╲`,
    level:32, tier:'major',
    hp:980, atk:72, def:24, spd:8, mp:30,
    skills:['da_l1','da01','da02','ic_l1'],
    drops:[
      { id:'item_ghost_jade', chance:0.35, minQty:1, maxQty:2 },
      { id:'item_ghost_bone', chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:480, silver:0,
    terrain:['plain'],
    minLevel:20,
    desc:'守护王陵的古代士兵，死后被咒法复活，虽为亡灵但保留着生前武艺，长枪如林，阵法严明。',
    aggro:true, alignment:'evil',
  },

  // Lv38 墓道守灵（major，王陵守护）
  tomb_guardian_spirit: {
    id:'tomb_guardian_spirit', name:'墓道守灵', type:'ghost', icon:'👻',
    avatar:` 守灵
(◉_◉)
 ╲墓╱`,
    level:38, tier:'major',
    hp:1250, atk:88, def:32, spd:12, mp:120,
    skills:['da_l1','da02','da03','ic01','ic02'],
    drops:[
      { id:'item_ghost_jade', chance:0.50, minQty:1, maxQty:2 },
      { id:'item_ghost_bone', chance:0.25, minQty:1, maxQty:1 },
      { id:'item_spirit_stone', chance:0.08, minQty:1, maxQty:1 },
    ],
    exp:850, silver:0,
    terrain:['plain'],
    minLevel:25,
    desc:'王陵墓道的守护灵，半透明的魂体在墓道中飘荡，对闯入者发出凄厉尖啸，声波能震碎心神。',
    aggro:true, alignment:'evil',
  },

  // Lv42 千年尸王（elite，王陵BOSS）
  undead_king: {
    id:'undead_king', name:'千年尸王·幽冥君', type:'boss', icon:'👑',
    avatar:` 👑王👑
(☠幽冥☠)
 ╲千年╱`,
    level:42, tier:'elite',
    hp:3200, atk:138, def:65, spd:9, mp:200,
    skills:['da_l1','da02','da03','da04','ic02','ic03'],
    drops:[
      { id:'item_ghost_jade', chance:1.00, minQty:2, maxQty:4 },
      { id:'item_ghost_bone', chance:0.70, minQty:1, maxQty:2 },
      { id:'item_spirit_stone', chance:0.25, minQty:1, maxQty:1 },
      { id:'item_beast_core', chance:0.30, minQty:1, maxQty:1 },
    ],
    exp:2800, silver:150,
    terrain:['plain'],
    minLevel:30,
    desc:'邙山王陵之主，千年不腐的古代君王，身穿腐朽龙袍，手持幽冥宝剑，怨气冲天。传说他生前求长生不得，死后化为尸王，誓要拉所有活人陪葬。',
    aggro:true, alignment:'evil',
  },

  // ──── 黄河系（水府）──────────────────────────────────

  // Lv28 水府虾兵（func，黄河水府基础怪）
  water_shrimp_soldier: {
    id:'water_shrimp_soldier', name:'水府虾兵', type:'beast', icon:'🦐',
    avatar:`  🦐
 (○_○)
  ╰┴╯`,
    level:28, tier:'func',
    hp:580, atk:52, def:14, spd:14, mp:20,
    skills:['da_l1','wi_l1'],
    drops:[
      { id:'item_snake_scale', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:280, silver:12,
    terrain:['水乡'],
    minLevel:18,
    desc:'黄河水府中的虾兵，身披透明铠甲，手持三叉戟，在水中灵活异常，能掀起漩涡困敌。',
    aggro:true, alignment:'neutral',
  },

  // Lv35 水府蟹将（major，水府精英）
  water_crab_general: {
    id:'water_crab_general', name:'水府蟹将', type:'beast', icon:'🦀',
    avatar:` 🦀🦀
(⊙威猛⊙)
  ╱╲`,
    level:35, tier:'major',
    hp:1100, atk:82, def:42, spd:10, mp:50,
    skills:['da_l1','da01','da02','fo_l1'],
    drops:[
      { id:'item_snake_scale', chance:0.40, minQty:2, maxQty:3 },
      { id:'item_beast_core', chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:650, silver:30,
    terrain:['水乡'],
    minLevel:25,
    desc:'蟹将是水府的精锐，巨钳如铁钳，能夹断精钢，甲壳坚硬如盾，是虾兵的统领。',
    aggro:true, alignment:'neutral',
  },

  // Lv45 河底妖龙王（elite，水府BOSS）
  river_dragon_king: {
    id:'river_dragon_king', name:'河底妖龙王·敖洪', type:'boss', icon:'🐉',
    avatar:` 龙 王
(◉龙◉)
 ╲敖洪╱`,
    level:45, tier:'elite',
    hp:4200, atk:168, def:75, spd:18, mp:350,
    skills:['da_l1','da02','da03','da04','wi_l1','wi02','wi03'],
    drops:[
      { id:'item_beast_core', chance:0.80, minQty:2, maxQty:3 },
      { id:'item_spirit_stone', chance:0.30, minQty:1, maxQty:1 },
      { id:'item_dragon_scale', chance:0.20, minQty:1, maxQty:1 },
      { id:'item_snake_gall', chance:0.40, minQty:2, maxQty:3 },
    ],
    exp:3800, silver:250,
    terrain:['水乡'],
    minLevel:35,
    desc:'黄河水府之主妖龙王敖洪，本为龙族旁支，因犯错被贬至黄河。千年修炼，已能操控水脉，掀起滔天巨浪。他的龙宫藏有无数珍宝，但也有无数水妖守护。',
    aggro:true, alignment:'neutral',
  },

  // ──── 太湖系（湖底宫）──────────────────────────────────

  // Lv33 湖底鱼人（func，太湖湖底宫基础怪）
  lake_fishman: {
    id:'lake_fishman', name:'湖底鱼人', type:'beast', icon:'🐟',
    avatar:`  🐟
 (◎_◎)
  ╰┴╯`,
    level:33, tier:'func',
    hp:650, atk:62, def:16, spd:15, mp:30,
    skills:['da_l1','wi_l1','wi01'],
    drops:[
      { id:'item_snake_scale', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:320, silver:18,
    terrain:['水乡'],
    minLevel:22,
    desc:'太湖深处的鱼人，人身鱼尾，鳞片闪烁，能在水下自由呼吸，使用水弹攻击入侵者。',
    aggro:true, alignment:'neutral',
  },

  // Lv48 水龙神（elite，太湖湖底宫BOSS）
  water_dragon_god: {
    id:'water_dragon_god', name:'水龙神·共工', type:'boss', icon:'🐲',
    avatar:` 水神
(◉水◉)
 ╲共工╱`,
    level:48, tier:'elite',
    hp:4800, atk:185, def:82, spd:20, mp:400,
    skills:['da_l1','da02','da03','da04','da05','wi_l1','wi02','wi03','wi04'],
    drops:[
      { id:'item_beast_core', chance:1.00, minQty:2, maxQty:4 },
      { id:'item_spirit_stone', chance:0.35, minQty:1, maxQty:1 },
      { id:'item_dragon_scale', chance:0.25, minQty:1, maxQty:2 },
      { id:'item_snake_gall', chance:0.50, minQty:2, maxQty:4 },
    ],
    exp:4200, silver:280,
    terrain:['水乡'],
    minLevel:35,
    desc:'太湖湖底宫的主宰水龙神共工，上古水神后裔，掌控太湖万千水系。龙宫金碧辉煌，但机关重重，更有水龙神亲自镇守，数百年来无人能从宫中取走珍宝。',
    aggro:true, alignment:'neutral',
  },

  // ──── 桃花岛系（奇门阵）───────────────────────────────

  // Lv18 桃花阵灵（func，桃花岛奇门阵基础怪）
  peach_array_spirit: {
    id:'peach_array_spirit', name:'桃花阵灵', type:'ghost', icon:'🌸',
    avatar:`  🌸
 (◕_◕)
  ~~~`,
    level:18, tier:'func',
    hp:420, atk:42, def:8, spd:16, mp:60,
    skills:['wi_l1','wi01'],
    drops:[
      { id:'item_ghost_jade', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:150, silver:10,
    terrain:['丛林'],
    minLevel:12,
    desc:'桃花岛奇门阵中诞生的阵灵，由桃花瘴气凝聚而成，身形飘忽，能施展幻术迷惑敌人。',
    aggro:true, alignment:'neutral',
  },

  // Lv26 岛主花千影（elite，桃花岛BOSS）
  peach_island_master: {
    id:'peach_island_master', name:'岛主·花千影', type:'boss', icon:'🌺',
    avatar:` 岛主
(◉影◉)
 ╲花千影╱`,
    level:26, tier:'elite',
    hp:2800, atk:128, def:35, spd:22, mp:250,
    skills:['wi_l1','wi01','wi02','wi03','wi04'],
    drops:[
      { id:'item_ghost_jade', chance:0.80, minQty:2, maxQty:3 },
      { id:'item_spirit_stone', chance:0.25, minQty:1, maxQty:1 },
      { id:'item_beast_core', chance:0.30, minQty:1, maxQty:1 },
    ],
    exp:2200, silver:180,
    terrain:['丛林'],
    minLevel:18,
    desc:'桃花岛神秘岛主花千影，精通奇门遁甲和音律武学，以一曲《桃花幻音曲》名震江湖。她的奇门阵变化莫测，能困住宗师级高手。若能破阵，可得她亲传音律武学。',
    aggro:true, alignment:'neutral',
  },

  // ──── 昆仑系（光明顶密道）─────────────────────────────

  // Lv42 圣火守卫（func，昆仑光明顶密道基础怪）
  holy_fire_guard: {
    id:'holy_fire_guard', name:'圣火守卫', type:'evil', icon:'🔥',
    avatar:` 🔥🔥
(⊙火⊙)
  /|\`,
    level:42, tier:'func',
    hp:750, atk:78, def:28, spd:11, mp:60,
    skills:['fr_l1','fr01'],
    drops:[
      { id:'item_iron_token', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:420, silver:25,
    terrain:['山地'],
    minLevel:30,
    desc:'守护光明顶密道的明教守卫，全身笼罩在火焰中，对明教忠心耿耿，誓死守卫圣火。',
    aggro:true, alignment:'chaotic',
  },

  // Lv55 光明左使（elite，光明顶密道BOSS）
  bright_left_envoy: {
    id:'bright_left_envoy', name:'光明左使·炎烈', type:'boss', icon:'☀',
    avatar:` 左使
(◉炎◉)
 ╲炎烈╱`,
    level:55, tier:'elite',
    hp:3800, atk:198, def:88, spd:14, mp:400,
    skills:['fr_l1','fr01','fr02','fr03','fr04','da_l1','da02','da03'],
    drops:[
      { id:'item_beast_core', chance:0.80, minQty:2, maxQty:3 },
      { id:'item_spirit_stone', chance:0.30, minQty:1, maxQty:1 },
      { id:'item_dragon_scale', chance:0.15, minQty:1, maxQty:1 },
    ],
    exp:3600, silver:250,
    terrain:['山地'],
    minLevel:40,
    desc:'明教光明左使炎烈，四大法王之首，掌控圣火令，火焰功法已臻化境。他镇守光明顶密道最深处，是进入明教总坛的最后一道关卡。',
    aggro:true, alignment:'chaotic',
  },

  // ──── 唐门系（机关堡）─────────────────────────────────

  // Lv48 机关人偶（func，唐门机关堡基础怪）
  mechanism_doll: {
    id:'mechanism_doll', name:'机关人偶', type:'boss', icon:'🎎',
    avatar:` 🎎🎎
(Θ_Θ)
  ╰╯`,
    level:48, tier:'func',
    hp:820, atk:82, def:35, spd:8, mp:0,
    skills:['da_l1','ge_l1'],
    drops:[
      { id:'item_iron_token', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:520, silver:22,
    terrain:['山地'],
    minLevel:35,
    desc:'唐门机关堡中的木制人偶，内藏精密的齿轮机关，能施展基础的拳脚功夫，是唐门弟子的练功靶子，但对入侵者同样致命。',
    aggro:true, alignment:'neutral',
  },

  // Lv58 机关兽（major，机关堡精英）
  mechanism_beast: {
    id:'mechanism_beast', name:'机关兽', type:'boss', icon:'🦾',
    avatar:` 🦾🦾
(Θ野兽Θ)
  ╱╲`,
    level:58, tier:'major',
    hp:1550, atk:128, def:65, spd:12, mp:80,
    skills:['da_l1','da01','da02','ge_l1','ge01'],
    drops:[
      { id:'item_iron_token', chance:0.45, minQty:1, maxQty:2 },
      { id:'item_spirit_stone', chance:0.10, minQty:1, maxQty:1 },
    ],
    exp:950, silver:50,
    terrain:['山地'],
    minLevel:45,
    desc:'唐门高级机关兽，虎型铁甲，爪牙锋利，机关驱动使其动作迅猛，口中还能喷射毒箭，是机关堡的中坚力量。',
    aggro:true, alignment:'neutral',
  },

  // Lv65 机关堡主（elite，机关堡BOSS）
  mechanism_castle_lord: {
    id:'mechanism_castle_lord', name:'机关堡主·千机子', type:'boss', icon:'⚙',
    avatar:` 堡主
(◉机◉)
 ╲千机子╱`,
    level:65, tier:'elite',
    hp:4200, atk:208, def:108, spd:14, mp:500,
    skills:['da_l1','da02','da03','da04','da05','ge_l1','ge01','ge02','ge03','po01','po02'],
    drops:[
      { id:'item_beast_core', chance:1.00, minQty:2, maxQty:4 },
      { id:'item_spirit_stone', chance:0.35, minQty:1, maxQty:1 },
      { id:'item_dark_token', chance:0.50, minQty:2, maxQty:3 },
      { id:'item_venom_sac', chance:0.40, minQty:2, maxQty:4 },
    ],
    exp:4800, silver:350,
    terrain:['山地'],
    minLevel:50,
    desc:'唐门机关堡堡主千机子，唐门第一机关师，能同时操控七十二种机关暗器。他的机关堡是唐门最高机密的所在地，内有无数致命机关。若能破堡，可得唐门绝世暗器图谱。',
    aggro:true, alignment:'neutral',
  },

  // ──── 雷峰塔系（地宫）───────────────────────────────

  // Lv38 塔中蛇妖（func，雷峰塔地宫基础怪）
  pagoda_snake_demon: {
    id:'pagoda_snake_demon', name:'塔中蛇妖', type:'ghost', icon:'🐍',
    avatar:`  🐍🐍
(⊙蛇⊙)
  ╱╲`,
    level:38, tier:'func',
    hp:720, atk:72, def:18, spd:15, mp:60,
    skills:['po_l1','po01','wi_l1'],
    drops:[
      { id:'item_venom_sac', chance:0.30, minQty:1, maxQty:1 },
      { id:'item_snake_scale', chance:0.25, minQty:1, maxQty:1 },
    ],
    exp:460, silver:20,
    terrain:['平原'],
    minLevel:28,
    desc:'雷峰塔中封印的蛇妖，人身蛇尾，能口吐毒雾，尾巴如鞭，被高僧镇压千年，怨气极重。',
    aggro:true, alignment:'evil',
  },

  // Lv52 白鳞妖后（elite，雷峰塔地宫BOSS）
  white_scale_queen: {
    id:'white_scale_queen', name:'白鳞妖后·素姬', type:'boss', icon:'👑',
    avatar:` 妖后
(◉鳞◉)
 ╲素姬╱`,
    level:52, tier:'elite',
    hp:3600, atk:188, def:55, spd:20, mp:400,
    skills:['po_l1','po01','po02','po03','po04','wi_l1','wi02','wi03','wi04'],
    drops:[
      { id:'item_beast_core', chance:0.80, minQty:2, maxQty:3 },
      { id:'item_spirit_stone', chance:0.35, minQty:1, maxQty:1 },
      { id:'item_venom_sac', chance:1.00, minQty:3, maxQty:5 },
      { id:'item_dragon_scale', chance:0.20, minQty:1, maxQty:1 },
    ],
    exp:4200, silver:300,
    terrain:['平原'],
    minLevel:38,
    desc:'雷峰塔地宫的主宰白鳞妖后素姬，本是修行千年的白蛇，因触犯天条被镇于塔下。千年封印使她的妖力更加凝练，毒术登峰造极。她的内丹是炼制解毒圣药的至宝。',
    aggro:true, alignment:'evil',
  },

  // ──── 西夏系（皇宫密道）───────────────────────────────

  // Lv72 西夏国师残魂（elite，西夏皇宫密道BOSS）
  western_xia_spirit: {
    id:'western_xia_spirit', name:'西夏国师·残魂', type:'ghost', icon:'👻',
    avatar:` 国师
(◉魂◉)
 ╲西夏╱`,
    level:72, tier:'elite',
    hp:5200, atk:228, def:95, spd:16, mp:500,
    skills:['th_l1','th02','th03','th04','da_l1','da02','da03','da04','da05','wi_l1','wi02'],
    drops:[
      { id:'item_beast_core', chance:1.00, minQty:3, maxQty:4 },
      { id:'item_spirit_stone', chance:0.40, minQty:1, maxQty:2 },
      { id:'item_chaos_essence', chance:0.20, minQty:1, maxQty:1 },
      { id:'item_western_gift', chance:0.60, minQty:2, maxQty:4 },
    ],
    exp:6800, silver:450,
    terrain:['plain'],
    minLevel:55,
    desc:'西夏国师死后残魂，生前精通奇门遁甲与咒术，死后魂魄不散，化为密道守护者。他的残魂中蕴含着西夏皇室的惊天秘密与绝世武功，但同时也带着深深的怨念与诅咒。',
    aggro:true, alignment:'evil',
  },

  // ──── 天地帮系（雷音寺）───────────────────────────────

  // Lv48 雷音寺住持（elite，天地帮雷音寺BOSS）
  leiyin_abbot: {
    id:'leiyin_abbot', name:'雷音寺住持·雷鸣', type:'boss', icon:'⚡',
    avatar:` 住持
(◉雷◉)
 ╲雷鸣╱`,
    level:48, tier:'elite',
    hp:3400, atk:168, def:72, spd:14, mp:350,
    skills:['th_l1','th02','th03','th04','da_l1','da02','da03','da04'],
    drops:[
      { id:'item_beast_core', chance:0.80, minQty:2, maxQty:3 },
      { id:'item_spirit_stone', chance:0.30, minQty:1, maxQty:1 },
      { id:'item_dark_token', chance:0.50, minQty:2, maxQty:3 },
      { id:'item_tiandi_token', chance:0.80, minQty:2, maxQty:4 },
    ],
    exp:3800, silver:280,
    terrain:['plain','山地'],
    minLevel:35,
    desc:'天地帮雷音寺住持雷鸣，修炼雷音神功，能召唤天雷，声如洪钟。雷音寺是天地帮的重要据点，雷鸣更是帮中顶尖高手。他的雷音禅杖重达百斤，挥舞时风雷之声震耳欲聋。',
    aggro:true, alignment:'chaotic',
  },

  // ──── 主线BOSS（骨冥子别名） ──────────────────────────

  // 血骨要塞终极BOSS（骨冥子的地下城版引用）
  gu_ming_zi: {
    id:'gu_ming_zi', name:'骨冥子', type:'boss', icon:'💀',
    avatar:`  骨  冥
 (☠ ☠ ☠)
  ╲|骨令|╱
 ─═════─`,
    level:100, tier:'elite',
    hp:12000, atk:320, def:180, spd:20, mp:800,
    skills:['da_l1','da01','da02','da03','ic01','ic02','to01','to02'],
    drops:[
      { id:'item_xuegu_emblem',  chance:1.00, minQty:1, maxQty:1 },
      { id:'item_spirit_stone',  chance:1.00, minQty:2, maxQty:3 },
      { id:'item_chaos_essence', chance:0.50, minQty:1, maxQty:1 },
      { id:'item_xuantie_shard3',chance:1.00, minQty:1, maxQty:1 },
    ],
    exp:25000, silver:2000,
    terrain:['山地'],
    minLevel:85,
    desc:'血骨门门主「骨冥子」，在血骨要塞最深处等待着武林中最强的挑战者。三魔联盟的缔造者，玄铁令的觊觎者，这场江湖风波的幕后黑手。',
    aggro:true, alignment:'evil',
    questRef:'mq_act3_boss',
  },

  // ── 原有 gumingzi 条目（保留，野外遭遇版）──
  gumingzi: {
    id:'npc_gumingzi', name:'骨冥子', type:'boss', icon:'💀',
    avatar:`  骨  冥
 (☠ ☠ ☠)
  ╲|骨令|╱
 ─═════─`,
    level:60, tier:'elite',
    hp:3000, atk:150, def:60, spd:15, mp:300,
    skills:['da_l1','da02','da03','da04','da05','po01','po02','po03','ge_l1','ge02','ge03'],
    drops:[
      { id:'item_xuantie_shard3',  chance:1.0,  minQty:1, maxQty:1 },  // 剧情道具
      { id:'wep_mythic_bone_blade',chance:1.0,  minQty:1, maxQty:1 },
      { id:'item_copper_coin',     chance:1.0,  minQty:500, maxQty:800 },
    ],
    exp:3000, silver:500,
    terrain:['山地'],
    minLevel:45,
    desc:'血骨门门主「骨冥子」，身穿黑金骨甲，眼神如死灰——他就是这场风波的根源。',
    aggro:true, alignment:'evil',
    questRef: 'mq_act3_boss',
  },

});
} else {
  const ENEMY_DB = {


// ── 掉落物品描述（补充未在 data-equip.js 中定义的） ──
const ENEMY_DROP_ITEMS = {
  item_wolf_pelt:     { id:'item_wolf_pelt',     name:'狼皮',       icon:'🐾', type:'material', sellPrice:15, desc:'野狼皮毛，可制轻甲，也可卖给皮货商。' },
  item_wolf_fang:     { id:'item_wolf_fang',     name:'狼牙',       icon:'🦷', type:'material', sellPrice:8,  desc:'锋利的狼牙，可用于炼制药物或打造项链。' },
  item_alpha_pelt:    { id:'item_alpha_pelt',    name:'狼王皮',     icon:'🐺', type:'material', sellPrice:95, desc:'巨狼首领留下的厚实王皮，兼具韧性与威势，是做披氅的上等材料。' },
  item_alpha_fang:    { id:'item_alpha_fang',    name:'狼王獠牙',   icon:'🦷', type:'material', sellPrice:42, desc:'比寻常狼牙更长更硬，常被匠人拿去做压边护符或威吓饰件。' },
  item_tiger_skin:    { id:'item_tiger_skin',    name:'虎皮',       icon:'🐯', type:'material', sellPrice:80, desc:'纹路清晰的虎皮，极品皮草，值钱。' },
  item_tiger_bone:    { id:'item_tiger_bone',    name:'虎骨',       icon:'🦴', type:'material', sellPrice:50, desc:'入药极佳，也是强化铠甲的好材料。' },
  item_bear_hide:     { id:'item_bear_hide',     name:'熊皮',       icon:'🐻', type:'material', sellPrice:60, desc:'厚实的熊皮，制成铠甲防御奇高。' },
  item_bear_paw:      { id:'item_bear_paw',      name:'熊掌',       icon:'🐾', type:'material', sellPrice:40, desc:'珍贵食材，也是补血回气的好药引。' },
  item_bear_gall:     { id:'item_bear_gall',     name:'熊胆',       icon:'🟢', type:'material', sellPrice:58, desc:'苦寒之性极重，能清火定胆，也是高阶宁神药的关键药引。' },
  item_boar_tusk:     { id:'item_boar_tusk',     name:'野猪獠牙',   icon:'🦴', type:'material', sellPrice:18, desc:'粗厚锋利的獠牙，常被山民磨成臂扣或粗犷护具。' },
  item_snake_scale:   { id:'item_snake_scale',   name:'蟒鳞',       icon:'🐍', type:'material', sellPrice:25, desc:'坚硬的蟒蛇鳞片，可打造轻便鳞甲。' },
  item_snake_gall:    { id:'item_snake_gall',    name:'蛇胆',       icon:'💊', type:'material', sellPrice:35, desc:'解毒功效奇佳，也可直接食用提升内力。' },
  item_venom_sac:     { id:'item_venom_sac',     name:'毒囊',       icon:'⚗', type:'material', sellPrice:30, desc:'毒虫的毒液囊，五毒教收购价极高。' },
  item_beast_core:    { id:'item_beast_core',    name:'兽核',       icon:'💎', type:'material', sellPrice:120, desc:'凝结了猛兽精气的晶核，传说中珍稀之物，炼制神兵的好材料。' },
  item_ice_crystal:   { id:'item_ice_crystal',   name:'冰晶',       icon:'❄', type:'material', sellPrice:45, desc:'冰原雪狼体内凝结的冰晶，寒气逼人，可用于炼制冰系武器。' },
  item_ice_wolf_pelt: { id:'item_ice_wolf_pelt', name:'冰狼皮',     icon:'🐺', type:'material', sellPrice:210, desc:'覆着寒霜的冰狼皮毛，轻而保暖，是寒地护具的珍材。' },
  item_frost_fang:    { id:'item_frost_fang',    name:'霜牙',       icon:'🦷', type:'material', sellPrice:85, desc:'冰狼口中的寒牙，触手生凉，常被用来固边或封存寒性。' },
  item_ghost_jade:    { id:'item_ghost_jade',    name:'鬼玉',       icon:'💚', type:'material', sellPrice:90, desc:'游魂凝结的碧绿宝玉，有淡淡荧光，据说有辟邪之效。' },
  item_ghost_bone:    { id:'item_ghost_bone',    name:'鬼骨',       icon:'🦴', type:'material', sellPrice:40, desc:'厉鬼凝聚的骨质残片，寒气逼人，是炼制降灵符箓的材料。' },
  item_bandit_token:  { id:'item_bandit_token',  name:'山贼令牌',   icon:'🎴', type:'material', sellPrice:18, desc:'山贼头目的令牌，积攒足够可换取赏金，也是走私品的通行证。' },
  item_copper_coin:   { id:'item_copper_coin',   name:'铜钱',       icon:'🪙', type:'currency', sellPrice:0,  desc:'普通铜钱，积少成多。' },
  item_crude_blade:   { id:'item_crude_blade',   name:'粗制刀',     icon:'🗡', type:'weapon_mat', sellPrice:5, desc:'做工粗糙的劣质刀，卖给铁匠还能换几个铜子。' },
  item_iron_token:    { id:'item_iron_token',    name:'铁质令牌',   icon:'🎴', type:'material', sellPrice:20, desc:'某个帮派的令牌，认识的人或许愿意出价收购。' },
  item_bandit_seal:   { id:'item_bandit_seal',   name:'断刀张印鉴', icon:'🔏', type:'quest',    sellPrice:0,  desc:'沧州匪首"断刀张"的印鉴，可交给知府领赏。' },
  item_haisha_token:  { id:'item_haisha_token',  name:'海沙帮令牌', icon:'⚓', type:'quest',    sellPrice:0,  desc:'海沙帮水寇队长的令牌，可作为任务完成证明。' },
  item_tiandi_token:  { id:'item_tiandi_token',  name:'天地帮令牌', icon:'🪙', type:'quest',    sellPrice:0,  desc:'天地帮的收费凭证，可交给商会领赏。' },
  item_xuegu_emblem:  { id:'item_xuegu_emblem',  name:'血骨门徽记', icon:'💀', type:'quest',    sellPrice:0,  desc:'血骨门弟子的标志，正道门派见了都想销毁。' },
  item_xuanming_code: { id:'item_xuanming_code', name:'玄冥暗语书', icon:'📓', type:'quest',    sellPrice:0,  desc:'记录了玄冥教联络暗号的小册子，武当派极为需要。' },
  item_riyue_token:   { id:'item_riyue_token',   name:'日月令牌',   icon:'🌙', type:'quest',    sellPrice:0,  desc:'日月神教细作的身份令牌，是追查情报网的关键证据。' },
  item_wudu_insect:   { id:'item_wudu_insect',   name:'蛊虫样本',   icon:'🪲', type:'quest',    sellPrice:0,  desc:'五毒教用于实验的蛊虫，医者看了能研制出解药。' },
  item_antidote_recipe:{id:'item_antidote_recipe',name:'解蛊秘方',  icon:'📜', type:'quest',    sellPrice:0,  desc:'五毒教弟子身上搜出的解蛊方子，可救中蛊之人。' },
  item_poison_dart:   { id:'item_poison_dart',   name:'毒针',       icon:'🪡', type:'consumable',sellPrice:12, desc:'淬了毒的暗器，扔出后可使目标中毒。' },
  item_dark_token:    { id:'item_dark_token',    name:'暗刺令',     icon:'🎴', type:'material', sellPrice:35, desc:'黑市上流通的刺客接单令牌，持令者在黑市有优惠。' },
  item_bounty_scroll: { id:'item_bounty_scroll', name:'悬赏书',     icon:'📜', type:'material', sellPrice:20, desc:'一张悬赏令，上面写着某人的名字……不知道是不是你。' },
  item_western_silk:  { id:'item_western_silk',  name:'西域丝绸',   icon:'🧣', type:'material', sellPrice:55, desc:'色彩鲜艳的西域丝绸，中原富商极为追捧。' },
  item_western_gift:  { id:'item_western_gift',  name:'西域特产',   icon:'🎁', type:'material', sellPrice:80, desc:'一包西域香料和珠宝，护镖成功后商队的谢礼。' },
  item_damp_cargo:    { id:'item_damp_cargo',    name:'受潮货物',   icon:'📦', type:'material', sellPrice:10, desc:'从水寇手里缴获的受潮货物，能卖几个钱。' },
  item_xuantie_shard3:{ id:'item_xuantie_shard3',name:'玄铁令（三）',icon:'🔩', type:'quest',   sellPrice:0,  desc:'玄铁令的最后一块碎片，持此物者，骨冥子必置你于死地。' },
  item_xuanwu_missing:{ id:'item_xuanwu_missing',name:'玄悟失踪线索',icon:'📜',type:'quest',   sellPrice:0,  desc:'有关少林达摩院首座玄悟大师失踪的线索情报。' },

  // ── 草药类（合成配方所用）──
  item_herb_blood:    { id:'item_herb_blood',    name:'活血草',     icon:'🌿', type:'material', sellPrice:6,    desc:'活血化瘀的草药，遍布山野，是炼制气血丹的基础药材。' },
  item_herb_qi:       { id:'item_herb_qi',       name:'聚气草',     icon:'🍃', type:'material', sellPrice:9,    desc:'聚拢天地灵气的药草，服之可恢复内力，是内功修炼者的常备药材。' },
  item_herb_common:   { id:'item_herb_common',   name:'普通草药',   icon:'🌱', type:'material', sellPrice:4,    desc:'山间常见草药，无特殊效用，但可用于多种基础丹药的炼制。' },
  item_herb_rare:     { id:'item_herb_rare',     name:'珍稀药草',   icon:'🌸', type:'material', sellPrice:35,   desc:'深山秘境中才能找到的稀有药草，是高级丹药的关键材料。' },
  item_herb_gancao:   { id:'item_herb_gancao',   name:'甘草',       icon:'🌾', type:'material', sellPrice:5,    desc:'味甘性平的药草，可调和诸药，是炼制丹药的常用辅料。' },
  item_herb_renshen:  { id:'item_herb_renshen',  name:'人参',       icon:'🥕', type:'material', sellPrice:45,   desc:'补气养血的珍贵药材，生长于深山老林，价值不菲。' },

  // ── 矿石/基础材料（合成/宝箱所用）──
  item_iron_ore:      { id:'item_iron_ore',      name:'铁矿石',     icon:'🪨', type:'material', sellPrice:8,    desc:'普通铁矿石，是打造各类兵器和护甲的基础材料。' },
  item_ore_iron:      { id:'item_ore_iron',      name:'铁矿石',     icon:'⛏️', type:'material', sellPrice:8,    desc:'从矿山开采出的铁矿石，是铁匠打造兵器护甲的原材料。' },
  item_refined_iron:  { id:'item_refined_iron',  name:'精铁',       icon:'⚙️', type:'material', sellPrice:35,   desc:'经过反复锤炼的精铁，质地纯净坚硬，是强化兵器的核心材料。' },
  item_xuantie:       { id:'item_xuantie',       name:'玄铁',       icon:'🌑', type:'material', sellPrice:120,  desc:'传说中的稀世玄铁，玄色如墨，坚硬无比，强化神兵必备。' },
  item_cloth:         { id:'item_cloth',         name:'布料',       icon:'🧵', type:'material', sellPrice:5,    desc:'普通棉麻布料，可用于制作轻便衣物和简单护具。' },
  item_gem:           { id:'item_gem',           name:'宝石',       icon:'💎', type:'material', sellPrice:80,   desc:'普通宝石，可用于装点武器或作为礼品，市面上时常见到。' },
  item_rare_gem:      { id:'item_rare_gem',      name:'稀有宝石',   icon:'💠', type:'material', sellPrice:250,  desc:'色泽纯正、成色上佳的稀有宝石，珠宝商人争相收购。' },
  item_mythic_gem:    { id:'item_mythic_gem',    name:'神话宝石',   icon:'🔮', type:'material', sellPrice:1500, desc:'传说中神灵遗落的宝石，内含神秘能量，是最顶级的宝物材料。' },
  item_elixir_low:    { id:'item_elixir_low',    name:'下品丹药',   icon:'💊', type:'consumable',sellPrice:20,  desc:'品质一般的丹药，可恢复少量气血。' },
  item_elixir_mid:    { id:'item_elixir_mid',    name:'中品丹药',   icon:'🔵', type:'consumable',sellPrice:60,  desc:'品质不错的丹药，可恢复中量气血和内力。' },
  item_elixir_high:   { id:'item_elixir_high',   name:'上品丹药',   icon:'🌟', type:'consumable',sellPrice:200, desc:'极品丹药，恢复效果卓著，高手争相求购。' },

  // ── 高等级新增材料 ──
  item_eagle_feather:  { id:'item_eagle_feather',  name:'神鹰翎羽',   icon:'🪶', type:'material', sellPrice:55,   desc:'雪域神鹰的翎羽，坚韧如钢，可用于制造轻型暗器，也是炼制轻甲的上等材料。' },
  item_leopard_pelt:   { id:'item_leopard_pelt',   name:'雪豹皮',     icon:'🐆', type:'material', sellPrice:180,  desc:'冰原雪豹的皮毛，纯白如雪，罕见至极，制成轻甲速度大增。' },
  item_lizard_scale:   { id:'item_lizard_scale',   name:'巨蜥鳞',     icon:'🦎', type:'material', sellPrice:90,   desc:'荒漠巨蜥的硬鳞，耐热防毒，是西域铠甲匠人梦寐以求的材料。' },
  item_turtle_shell:   { id:'item_turtle_shell',   name:'万年龟甲',   icon:'🐢', type:'material', sellPrice:350,  desc:'万年神龟的龟壳碎片，防御力冠绝天下，据说用它铸造的护甲可挡神兵利器。' },
  item_deer_antler:    { id:'item_deer_antler',    name:'天山神鹿角', icon:'🦌', type:'material', sellPrice:280,  desc:'天山神鹿的鹿角，寒气逼人，内含冰雪精华，逍遥派用它炼制顶级冰系法宝。' },
  item_fire_crystal:   { id:'item_fire_crystal',   name:'火晶',       icon:'🔥', type:'material', sellPrice:180,  desc:'炽热矿脉里孕出的赤红结晶，常被熔成淬刃涂层或烈性火器。' },
  item_flame_essence:  { id:'item_flame_essence',  name:'焰魄',       icon:'✨', type:'material', sellPrice:320,  desc:'火域深处凝成的焰心精魄，能把寻常火性稳定成可驾驭的兵刃余劲。' },
  item_mechanism_core: { id:'item_mechanism_core', name:'机关核心',   icon:'⚙️', type:'material', sellPrice:260,  desc:'古代机关兽残留下来的机枢核心，拆解后可做成高阶佩饰与机括部件。' },
  item_water_pearl:    { id:'item_water_pearl',    name:'水灵珠',     icon:'💧', type:'material', sellPrice:240,  desc:'深水灵气凝成的珠子，柔润绵长，最适合做成续战回补类药露。' },
  item_thunder_core:   { id:'item_thunder_core',   name:'雷霆核',     icon:'⚡', type:'material', sellPrice:360,  desc:'雷殛之地残留的躁烈核心，稍有不慎便会走火，炼药锻兵都要老手操持。' },
  item_sand_crystal:   { id:'item_sand_crystal',   name:'流沙晶',     icon:'🟤', type:'material', sellPrice:210,  desc:'沙海深层磨出来的晶核，质地沉稳，常用于护体类药散与稳固机关。' },
  item_copper_core:    { id:'item_copper_core',    name:'铜芯',       icon:'🟠', type:'material', sellPrice:150,  desc:'机巧造物内层拆出的铜制核心，导力平稳，适合做联动机括与护具骨架。' },
  item_dark_crystal:   { id:'item_dark_crystal',   name:'暗晶',       icon:'🌑', type:'material', sellPrice:420,  desc:'阴脉深处结出的黑色晶体，能敛息藏锋，也常被术士做成夜行灵符。' },
  item_spirit_stone:   { id:'item_spirit_stone',   name:'灵石',       icon:'💠', type:'material', sellPrice:500,  desc:'天地灵气凝结而成的石块，是炼制神兵和高级丹药的核心材料，价值连城。' },
  item_chaos_essence:  { id:'item_chaos_essence',  name:'混沌精粹',   icon:'⚫', type:'material', sellPrice:1200, desc:'混沌之气凝结的结晶，极为罕见，据传可用于突破内力极限，是宗师级武者的终极追求。' },
  item_dragon_scale:   { id:'item_dragon_scale',   name:'真龙鳞甲',   icon:'🐉', type:'material', sellPrice:2000, desc:'昆仑真龙脱落的鳞片，坚如神铁，附有寒冰之力，是传说中至宝材料，任何铸造师见之都会双手颤抖。' },

  // ── 日常任务材料 ──
  item_meat_rabbit:    { id:'item_meat_rabbit',    name:'野兔肉',     icon:'🐇', type:'material', sellPrice:6,    desc:'野兔的鲜肉，可烹饪成美味佳肴，也可直接食用充饥。' },
  item_river_mud:      { id:'item_river_mud',      name:'河泥',       icon:'🟫', type:'material', sellPrice:2,    desc:'河底的淤泥，可用于修补堤坝或制作陶器。' },
  item_ink_songyan:    { id:'item_ink_songyan',    name:'松烟墨',     icon:'⬛', type:'material', sellPrice:25,   desc:'以松烟制成的上等墨锭，书写流畅，色泽浓郁，是文人墨客的珍爱之物。' },
  item_local_specialty:{ id:'item_local_specialty',name:'地方特产',   icon:'📦', type:'material', sellPrice:15,   desc:'各地特色的土产货物，在异地往往能卖出好价钱。' },
  item_leftover_food:  { id:'item_leftover_food',  name:'剩饭',       icon:'🍚', type:'material', sellPrice:1,    desc:'餐馆剩余的饭菜，虽不值钱，但可救济乞丐或喂猪。' },
  item_vegetable_fresh:{ id:'item_vegetable_fresh',name:'新鲜蔬菜',   icon:'🥬', type:'material', sellPrice:4,    desc:'刚从地里采摘的新鲜蔬菜，清脆可口，营养丰富。' },
  item_wild_meat:      { id:'item_wild_meat',      name:'野味',       icon:'🦌', type:'material', sellPrice:12,   desc:'山林中猎获的野生动物肉，肉质鲜美，是酒楼的抢手货。' },

  // ══════════════════════════════════════════════
  //  收藏品 — 无实用效果，只可欣赏或高价变卖
  //  type:'collectible'  rarity: common/uncommon/rare/epic/legendary
  // ══════════════════════════════════════════════

  // ── 普通收藏（common，山贼/喽啰掉落）──
  col_broken_compass:  { id:'col_broken_compass',  name:'残破罗盘',     icon:'🧭', type:'collectible', rarity:'common',    sellPrice:12,   desc:'指针已断，不知指向何方。或许曾经引领某位豪侠走遍天下，如今却沦为废物。' },
  col_old_portrait:    { id:'col_old_portrait',    name:'旧人画像',     icon:'🖼️', type:'collectible', rarity:'common',    sellPrice:8,    desc:'一幅残破的素描人像，背面潦草地写着"勿忘"二字，不知画的是谁。' },
  col_copper_mirror:   { id:'col_copper_mirror',   name:'铜镜碎片',     icon:'🪞', type:'collectible', rarity:'common',    sellPrice:10,   desc:'一块铜镜的碎片，隐约能照出人影。江湖传言镜中可见鬼，多半是讹传。' },
  col_dice_set:        { id:'col_dice_set',         name:'老旧骰子',     icon:'🎲', type:'collectible', rarity:'common',    sellPrice:5,    desc:'六粒磨损严重的骰子，其中一粒明显做了手脚。赌坊败家子的遗物。' },
  col_worn_sandal:     { id:'col_worn_sandal',      name:'独只草鞋',     icon:'👡', type:'collectible', rarity:'common',    sellPrice:3,    desc:'只剩一只的草鞋，鞋底磨穿了个洞。另一只不知丢在哪条江湖路上。' },
  col_clay_figurine:   { id:'col_clay_figurine',    name:'泥塑小人',     icon:'🪆', type:'collectible', rarity:'common',    sellPrice:6,    desc:'路边摊贩卖的泥塑玩意，捏的是个挥刀的武将。小孩子喜欢，大人不屑。' },
  col_empty_jug:       { id:'col_empty_jug',        name:'空酒葫芦',     icon:'🍶', type:'collectible', rarity:'common',    sellPrice:4,    desc:'酒早喝光了，葫芦里还残留着一股醇香。不知主人是大侠还是醉鬼。' },

  // ── 少见收藏（uncommon，稍强敌人掉落）──
  col_jade_pendant:    { id:'col_jade_pendant',     name:'无字玉佩',     icon:'🟢', type:'collectible', rarity:'uncommon',  sellPrice:45,   desc:'一块雕工精细的玉佩，正反两面皆无刻字，却散发着温润光泽，显然出自富贵人家。' },
  col_music_score:     { id:'col_music_score',      name:'半卷琴谱',     icon:'📜', type:'collectible', rarity:'uncommon',  sellPrice:38,   desc:'残缺的古琴曲谱，曲名《断肠》，只剩前半段。据说奏完后半段者无不落泪。' },
  col_chess_piece:     { id:'col_chess_piece',      name:'象牙棋子',     icon:'♟️', type:'collectible', rarity:'uncommon',  sellPrice:55,   desc:'一粒象牙雕成的棋子，却是单独一颗将帅，其余棋子不知所踪。棋局已散，人已不在。' },
  col_red_thread:      { id:'col_red_thread',       name:'红丝绳结',     icon:'🪢', type:'collectible', rarity:'uncommon',  sellPrice:20,   desc:'一根打了七个结的红丝绳，每个结据说代表一段情缘。你不知道该羡慕还是同情。' },
  col_bronze_bell:     { id:'col_bronze_bell',      name:'铜铃铛',       icon:'🔔', type:'collectible', rarity:'uncommon',  sellPrice:30,   desc:'小巧的铜铃，轻摇时发出清脆的声响。铃身刻着"平安"二字，主人却死在了战斗里。' },
  col_ink_stick:       { id:'col_ink_stick',        name:'古墨一锭',     icon:'🖋️', type:'collectible', rarity:'uncommon',  sellPrice:35,   desc:'一锭做工考究的徽墨，散发着淡淡松烟香气。用它写字，笔迹百年不褪。' },

  // ── 稀有收藏（rare，精英/boss掉落）──
  col_silver_hairpin:  { id:'col_silver_hairpin',   name:'折枝银簪',     icon:'📌', type:'collectible', rarity:'rare',      sellPrice:160,  desc:'一支折断的银簪，折断处整齐，像是有人特意折的。发丝的残留证明曾有人珍藏它多年。' },
  col_sect_tablet:     { id:'col_sect_tablet',      name:'门派铭牌',     icon:'🏅', type:'collectible', rarity:'rare',      sellPrice:120,  desc:'某个已覆灭门派的宗师铭牌，门派名字已磨损殆尽，只余两个字：「永誓」。' },
  col_tiger_seal:      { id:'col_tiger_seal',       name:'虎符残件',     icon:'🐅', type:'collectible', rarity:'rare',      sellPrice:200,  desc:'古代虎符的半片，青铜铸成，虎纹清晰。合上另半片可调兵数万——但你永远找不到另一半了。' },
  col_letter_sealed:   { id:'col_letter_sealed',    name:'密封书信',     icon:'✉️', type:'collectible', rarity:'rare',      sellPrice:80,   desc:'用火漆封口的书信，火漆上印着一个陌生的印章。你犹豫了很久，最终还是没有拆开。' },
  col_jade_ring:       { id:'col_jade_ring',        name:'碧玉扳指',     icon:'💍', type:'collectible', rarity:'rare',      sellPrice:250,  desc:'玉质上乘的扳指，内壁刻着"天下第一"四字。主人大概确实曾是——也大概不是。' },
  col_war_flag:        { id:'col_war_flag',          name:'残破军旗',     icon:'🚩', type:'collectible', rarity:'rare',      sellPrice:140,  desc:'一面残破的军旗，上面绣着已不可辨认的文字。曾有多少人跟在这面旗帜后冲锋陷阵。' },

  // ── 精品收藏（epic，高等精英掉落）──
  col_jade_buddha:     { id:'col_jade_buddha',      name:'翡翠佛像',     icon:'🛕', type:'collectible', rarity:'epic',      sellPrice:600,  desc:'一尊巴掌大小的翡翠佛像，雕工出神入化，据说是百年前一位高僧所赠。见过它的人无不赞叹。' },
  col_scroll_painting: { id:'col_scroll_painting',  name:'名家山水卷',   icon:'🎨', type:'collectible', rarity:'epic',      sellPrice:800,  desc:'一幅已泛黄的山水画卷，落款已看不清，但笔法超凡，流传坊间说是某位已逝的画圣之作。' },
  col_ancient_coin:    { id:'col_ancient_coin',     name:'先朝金铢',     icon:'🏺', type:'collectible', rarity:'epic',      sellPrice:450,  desc:'上古时代的金铸货币，正面刻着神兽纹样，背面是一排已失传的古文。学者愿出高价。' },
  col_moonstone:       { id:'col_moonstone',        name:'月华宝石',     icon:'🌙', type:'collectible', rarity:'epic',      sellPrice:700,  desc:'夜间会发出淡蓝色荧光的宝石，据说是月宫陨落的碎片。没人能证明这一点，但也没人能否认。' },
  col_phoenix_feather: { id:'col_phoenix_feather',  name:'疑似凤羽',     icon:'🦚', type:'collectible', rarity:'epic',      sellPrice:1000, desc:'一根绚丽的羽毛，五色俱全，灼灼生辉。是凤凰真迹还是孔雀羽毛？你说不准，但它确实很美。' },

  // ── 传说收藏（legendary，BOSS专属，极低概率）──
  col_broken_sword:    { id:'col_broken_sword',     name:'独孤断剑',     icon:'⚔️', type:'collectible', rarity:'legendary', sellPrice:5000, desc:'一把断为两截的残剑，剑身铭文已磨平，但握在手中仍有一股无名气劲传来。剑魂未散，剑意长存。' },
  col_jade_token_dragon:{ id:'col_jade_token_dragon',name:'龙纹玉令',    icon:'🐲', type:'collectible', rarity:'legendary', sellPrice:3000, desc:'一枚雕有五爪金龙的玉令，背面刻着「奉天承运」。是皇室遗物还是赝品？无人能断。' },
  col_black_chess_board:{ id:'col_black_chess_board',name:'万年乌木棋盘',icon:'♟️', type:'collectible', rarity:'legendary', sellPrice:8000, desc:'一整块万年乌木雕成的棋盘，盘面纹理自然形成了三十六路阵法图。传说坐在此棋盘前下棋者，必能悟道。' },
  col_anon_portrait:   { id:'col_anon_portrait',    name:'无名英雄画像', icon:'🖼️', type:'collectible', rarity:'legendary', sellPrice:2000, desc:'一幅绢本丹青，画中人负剑而立，神情豪迈。画上无署名无题记，但见过它的武林人士无不肃然起敬，仿佛认识这个人。' },
  col_cracked_bell:    { id:'col_cracked_bell',     name:'破碎晚钟',     icon:'🔔', type:'collectible', rarity:'legendary', sellPrice:4500, desc:'少林寺某座已毁古刹的铜钟碎片，钟声虽已沉默，指尖轻抚时耳边仍能隐约听到遥远的钟鸣，回荡在岁月深处。' },
};

// ── 按地形+等级获取推荐野外敌人列表 ──────────────
/**
 * @param {string} terrain  地形类型
 * @param {number} playerLevel 玩家等级
 * @param {string} [enemyType] 可选指定类型（beast/bandit/evil等）
 * @returns {Array} 适合遭遇的敌人ID列表
 */
function getEnemiesByTerrain(terrain, playerLevel, enemyType){
  const weights = TERRAIN_ENEMY_WEIGHT[terrain] || TERRAIN_ENEMY_WEIGHT['平原'];
  return Object.values(ENEMY_DB).filter(e => {
    if(e.minLevel && playerLevel < e.minLevel) return false;
    if(enemyType && e.type !== enemyType) return false;
    if(e.terrain && e.terrain.length && !e.terrain.includes(terrain)) return false;
    // boss 只在稀有情况下出现
    if(e.tier === 'elite') return false;
    return true;
  });
}

/**
 * 加权随机选择一个野外遭遇敌人
 * @param {string} terrain
 * @param {number} playerLevel
 * @returns {Object|null} 敌人对象
 */
function pickRandomEnemy(terrain, playerLevel){
  const weights = TERRAIN_ENEMY_WEIGHT[terrain] || TERRAIN_ENEMY_WEIGHT['平原'];
  // 按类型权重分层抽
  const typePool = [];
  Object.entries(weights).forEach(([type, w]) => {
    if(type === 'boss') return; // boss 不在普通随机池
    for(let i=0; i<w; i++) typePool.push(type);
  });
  const chosenType = typePool[Math.floor(Math.random()*typePool.length)];
  const candidates = getEnemiesByTerrain(terrain, playerLevel, chosenType);
  if(!candidates.length) return null;
  return candidates[Math.floor(Math.random()*candidates.length)];
}

/** 根据敌人数据 + 玩家等级生成缩放后的实际属性
 *
 * 缩放逻辑（基于等级差，不用除法避免负缩放）：
 *   diff = playerLv - enemyLv
 *   diff <= -10 : ratio 0.70  （敌人远高于玩家，属性按7成出——玩家太菜才遇上可别打）
 *   diff -9~-5  : ratio 0.85
 *   diff -4~+4  : ratio 1.00  （同等级，原始属性）
 *   diff +5~+9  : ratio 1.15  （玩家高5-9级，敌人略强化，保有挑战）
 *   diff +10~+19: ratio 1.35
 *   diff >= +20 : ratio 1.60  （玩家远高于敌人，敌人自动变精英形态，别刷低级怪）
 */
function scaleEnemy(enemy, playerLevel){
  if(!enemy) return null;
  const diff = playerLevel - (enemy.level || 1);
  let ratio;
  if(diff <= -10)      ratio = 0.70;
  else if(diff <= -5)  ratio = 0.85;
  else if(diff <= 4)   ratio = 1.00;
  else if(diff <= 9)   ratio = 1.15;
  else if(diff <= 19)  ratio = 1.35;
  else                 ratio = 1.60;


  // 等级动态化：所有等级敌人（func/major/elite/boss）都动态化
  // 防止低级玩家遭遇远超自身等级的高难度敌人
  let displayLevel;
  if(enemy.tier === 'elite' || enemy.tier === 'boss'){
    // BOSS/精英：最多比玩家高8级（保持一定挑战性）
    const maxGap = 8;
    displayLevel = Math.min(enemy.level || 1, playerLevel + maxGap);
  } else if(enemy.tier === 'major'){
    // major：大侠怪，最多比玩家高5级
    displayLevel = Math.min(enemy.level || 1, playerLevel + 5);
  } else {
    // 普通(func)：随玩家等级 ±3 随机波动
    const offset = Math.round((Math.random() - 0.5) * 6); // -3 ~ +3
    displayLevel = Math.max(1, playerLevel + offset);
  }

  return {
    ...enemy,
    level: displayLevel,
    hp:     Math.round(enemy.hp    * ratio),
    atk:    Math.round(enemy.atk   * ratio),
    def:    Math.round(enemy.def   * ratio),
    mp:     Math.round((enemy.mp||0) * ratio),
    exp:    Math.round(enemy.exp   * ratio),
    silver: Math.round((enemy.silver||0) * ratio),
    // 速度不随等级缩放——速度由 spd 值固定决定追击概率
    _scaled: true,
    _scaledRatio: ratio,
  };
}
