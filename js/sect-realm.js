// ════════════════════════════════════════════════════
//  sect-realm.js  门派秘境副本系统
//  功能：门派专属秘境入口、程序化地图生成、难度分层、
//        秘境专属掉落（门派功法碎片、稀有装备、贡献奖励）
//  version: 1
// ════════════════════════════════════════════════════

;(function(){
'use strict';

// ═══════════════════════════════════════════════════
//  一、秘境数据库（25门派×3难度 = 75种配置）
// ═══════════════════════════════════════════════════

/**
 * 秘境配置表
 * key = 门派ID，value = 秘境主题配置
 * 每个秘境包含3个难度：normal / hard / nightmare
 */
const SECT_REALM_DB = {
  // ─── 超级门派 ───
  shaolin: {
    name: '达摩洞',
    icon: '🙏',
    desc: '少林后山传说中的达摩面壁之处，洞中刻有七十二绝技石壁，机缘者方可参悟。',
    theme: 'temple',
    terrain: '山洞',
    enemyPool: {
      battle: ['stone_monk','iron_munk','shaolin_puppet','buddha_guardian'],
      elite: ['arhat_spirit','dharma_stone_warrior'],
      boss:  ['dharma_shadow','diamond_arhat'],
    },
    specialRule: 'no_weapon_bonus', // 佛门试炼，兵器加成减半
    drops: {
      manuals: ['bd_l1','bd02','bd05','fo_l1','fi_lf1'],
      equip:   { type:'armor', rarity:'epic', name:'袈裟护甲' },
      contrib: { normal:15, hard:35, nightmare:60 },
    },
  },
  wudang: {
    name: '紫霄秘境',
    icon: '☯',
    desc: '武当山紫霄宫后方的隐秘山谷，太极阴阳二气在此交汇，蕴藏道家至高心法。',
    theme: 'forest',
    terrain: '山谷',
    enemyPool: {
      battle: ['taoist_spirit','yin_yang_puppet','wind_sword phantom','cloud_serpent'],
      elite: ['taiji_spirit_guard','xuanwu_manifestation'],
      boss:  ['yin_yang_overlord','zhenwu_divine_tortoise'],
    },
    specialRule: 'mana_regen', // 道法充沛，内力回复速度+50%
    drops: {
      manuals: ['ta_l1','ta01','ta02','sw_l1','wi_l3'],
      equip:   { type:'weapon', rarity:'epic', name:'太极剑' },
      contrib: { normal:15, hard:35, nightmare:60 },
    },
  },
  huashan: {
    name: '华山绝壁',
    icon: '⛰️',
    desc: '华山自古一条路，绝壁之上的剑冢埋藏历代剑宗的佩剑与剑意残片。',
    theme: 'mountain',
    terrain: '绝壁',
    enemyPool: {
      battle: ['sword_phantom','cliff_demon','stone_sword_guard','wind_blade'],
      elite: ['sword_grandmaster_ghost','blade_storm_spirit'],
      boss:  ['sword_emperor_wraith','huashan_sword_god'],
    },
    drops: {
      manuals: ['sw_l1','sw01','sw02','sw03','sw04'],
      equip:   { type:'weapon', rarity:'legendary', name:'华山镇岳剑' },
      contrib: { normal:15, hard:35, nightmare:60 },
    },
  },
  riyue: {
    name: '日月神殿',
    icon: '🌑',
    desc: '日月神教总坛地下的上古祭坛，据说封印着一位绝世魔头。',
    theme: 'dark',
    terrain: '地下祭坛',
    enemyPool: {
      battle: ['dark_cultist','shadow_assassin','blood_sorcerer','void_wraith'],
      elite: ['inquisitor_ghost','nether_knight'],
      boss:  ['ren_woxing_shadow','dark_emperor_soul'],
    },
    specialRule: 'life_steal', // 敌人有吸血效果
    drops: {
      manuals: ['sh_l1','sh01','sh02','da_l1','po_l1'],
      equip:   { type:'weapon', rarity:'legendary', name:'黑木令刀' },
      contrib: { normal:15, hard:35, nightmare:60 },
    },
  },

  // ─── 大型门派 ───
  mingjiao: {
    name: '圣火秘窟',
    icon: '🔥',
    desc: '昆仑山深处的明教秘密圣殿，圣火千年不灭，火中暗藏高深功法。',
    theme: 'fire',
    terrain: '熔岩洞窟',
    enemyPool: {
      battle: ['fire_guardian','lava_lizard','flame_cultist','ember_spirit'],
      elite: ['fire_vortex_lord','inferno_paladin'],
      boss:  ['holy_fire_demon_king','yang_xiao_fire_aspect'],
    },
    drops: {
      manuals: ['fi_l1','fi1g','fi_lf1','fi_lf3'],
      equip:   { type:'armor', rarity:'epic', name:'圣火令甲' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  wudu: {
    name: '万毒渊',
    icon: '🐍',
    desc: '五毒教圣地深处的万丈深渊，瘴气弥漫，剧毒生物横行。',
    theme: 'swamp',
    terrain: '毒沼深渊',
    enemyPool: {
      battle: ['venomous_spider','poison_toad','acid_serpent','miasma_wraith'],
      elite: ['centipede_king','toxic_butterfly_demon'],
      boss:  ['five_venom_ancestor','poison_dragon_serpent'],
    },
    specialRule: 'poison_terrain', // 每场战斗结束中毒概率30%
    drops: {
      manuals: ['po_l1','po01','po02','po03'],
      equip:   { type:'accessory', rarity:'rare', name:'百毒避珠' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  tangmen: {
    name: '暴雨梨花阵',
    icon: '🗡️',
    desc: '唐门核心机关迷宫，内藏暗器与毒雾，步步惊心。',
    theme: 'mechanical',
    terrain: '机关迷宫',
    enemyPool: {
      battle: ['tang_trap_mech','poison_dart_puppet','blade_wheel_guard','hidden_arbalest'],
      elite: ['storm_pearl_mechanism','thousand_arrow_turret'],
      boss:  ['tang_weapon_grandmaster','pearl_rain_emperor'],
    },
    specialRule: 'trap_heavy', // 陷阱伤害翻倍
    drops: {
      manuals: ['sh_l1','sh01','sh_lf1','sh_lf3'],
      equip:   { type:'accessory', rarity:'epic', name:'暴雨梨花针匣' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  taohuadao: {
    name: '桃花迷阵',
    icon: '🌸',
    desc: '桃花岛主设下的奇门遁甲大阵，入阵者若不懂阵法，永远困于花海之中。',
    theme: 'illusion',
    terrain: '幻境花海',
    enemyPool: {
      battle: ['illusion_fairy','petal_demon','mirror_phantom','thorn_vine'],
      elite: ['blossom_spirit_king','jade_flute_sorceress'],
      boss:  ['island_master_phantom','peach_blossom_deity'],
    },
    specialRule: 'confusion', // 随机混乱，攻击有20%概率打自己
    drops: {
      manuals: ['ic_l1','ic01','wi_l1','wi_l2'],
      equip:   { type:'accessory', rarity:'epic', name:'碧玉笛' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  xiaoyao: {
    name: '琅嬛福地',
    icon: '📚',
    desc: '传说中逍遥派的无崖子藏书之所，天下武学秘籍尽汇于此。',
    theme: 'ancient',
    terrain: '古洞藏书阁',
    enemyPool: {
      battle: ['book_wraith','ink_demon','scroll_guardian','knowledge_spirit'],
      elite: ['forbidden_spell_caster','ancient_sage_phantom'],
      boss:  ['wuyazi_inheritance','lingbo_weibu_master'],
    },
    drops: {
      manuals: ['wi_l1','wi_l2','wi_l3','qm_l1','qm03'],
      equip:   { type:'accessory', rarity:'legendary', name:'逍遥游玉佩' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  emei: {
    name: '金顶剑冢',
    icon: '🌺',
    desc: '峨眉金顶之下的天然剑冢，灵气氤氲，历代峨眉高手的佩剑在此沉睡。',
    theme: 'ice',
    terrain: '灵剑之冢',
    enemyPool: {
      battle: ['frost_sword_maiden','crystal_guardian','snow_petal_spirit','ice_crane'],
      elite: ['golden_summit_sword_queen','lotus_paladin'],
      boss:  ['emei_matriarch_spirit','nine_yang_sword_maiden'],
    },
    drops: {
      manuals: ['ic_l1','ic01','ic02','ic03','ho_l1'],
      equip:   { type:'weapon', rarity:'epic', name:'峨眉霜刃剑' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  kongtong: {
    name: '七伤碑林',
    icon: '⚡',
    desc: '崆峒山后方的石碑林，碑上刻有七伤拳谱残篇，碑中封印的怨灵日夜游荡。',
    theme: 'ruins',
    terrain: '古碑林',
    enemyPool: {
      battle: ['stone_tablet_guard','thunder_wraith','crumbling_warrior','qi_shang_ghost'],
      elite: ['seven_harm_specter','stone_general'],
      boss:  ['kongtong_ancestor_spirit','five_thunder_overlord'],
    },
    drops: {
      manuals: ['th_l1','th01','th02','th05'],
      equip:   { type:'weapon', rarity:'rare', name:'七伤拳套' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  kunlun: {
    name: '昆仑镜台',
    icon: '💎',
    desc: '昆仑山巅的神秘镜台，据说能映照出修行者内心深处的执念与恐惧。',
    theme: 'mystic',
    terrain: '云端镜台',
    enemyPool: {
      battle: ['mirror_clone','ice_phantom','cloud_warrior','frost_archer'],
      elite: ['ice_mirror_doppelganger','frost_fairy_queen'],
      boss:  ['kunlun_mirror_lord','eternal_frost_emperor'],
    },
    specialRule: 'mirror_match', // BOSS复制玩家属性
    drops: {
      manuals: ['sw_l1','ic_l1','sw_lf1','sw_lf3'],
      equip:   { type:'armor', rarity:'epic', name:'昆仑冰蚕丝甲' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  xuegu: {
    name: '血海炼狱',
    icon: '🩸',
    desc: '血骨门的禁忌之地，无数冤魂汇聚成的血色湖泊，弥漫着令人窒息的血腥气息。',
    theme: 'blood',
    terrain: '血色地宫',
    enemyPool: {
      battle: ['blood_golem','soul_devourer','bone_crawler','crimson_phantom'],
      elite: ['blood_demon_lord','soul_reaver'],
      boss:  ['blood_bone_ancestor','crimson_nightmare'],
    },
    specialRule: 'life_steal', // 敌人吸血
    drops: {
      manuals: ['po_l1','da_l1','sh_l1','da_lf1'],
      equip:   { type:'weapon', rarity:'epic', name:'血饮魔刀' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  diancang: {
    name: '点苍剑湖',
    icon: '🌊',
    desc: '苍山洱海之间的神秘剑湖，湖底沉眠着一把上古神剑。',
    theme: 'water',
    terrain: '水下剑湖',
    enemyPool: {
      battle: ['water_spirit','lake_guardian','ripple_sword_fish','coral_demon'],
      elite: ['tide_sword_master','storm_whale'],
      boss:  ['diancang_sword_lake_spirit','aqua_dragon'],
    },
    drops: {
      manuals: ['sw_l1','sw_lf1','wi_l1','wi_l3'],
      equip:   { type:'weapon', rarity:'rare', name:'点苍飞瀑剑' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },
  xuanming: {
    name: '玄冥冰牢',
    icon: '❄️',
    desc: '玄冥教最深处，千年寒冰铸造的牢狱，关押着无数得罪过教主的江湖人士。',
    theme: 'ice_dark',
    terrain: '冰封牢狱',
    enemyPool: {
      battle: ['frozen_prisoner','ice_chain_guard','dark_ice_wraith','frost_necromancer'],
      elite: ['xuanming_ice_lord','frozen_behemoth'],
      boss:  ['xuanming_two_elders','absolute_zero_overlord'],
    },
    specialRule: 'freeze_floor', // 冰面打滑
    drops: {
      manuals: ['ic_l1','ic_lf1','ic_lf3','po_l1'],
      equip:   { type:'armor', rarity:'epic', name:'玄冥冰蚕甲' },
      contrib: { normal:12, hard:28, nightmare:50 },
    },
  },

  // ─── 小型门派 ───
  tianshan: {
    name: '天池灵境',
    icon: '🏔️',
    desc: '天山之巅的天池，灵气充沛，是修炼冰系功法的绝佳之地。',
    theme: 'snow',
    terrain: '天池秘境',
    enemyPool: {
      battle: ['snow_fox_spirit','ice_shard_golem','frost_willow','glacier_crab'],
      elite: ['heavenly_fox_queen','blizzard_elemental'],
      boss:  ['tianshan_sword_fairy','eternal_snow_sage'],
    },
    drops: {
      manuals: ['ic_l1','ic01','ic02'],
      equip:   { type:'accessory', rarity:'rare', name:'天山雪莲坠' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  xixia: {
    name: '贺兰秘窟',
    icon: '🐎',
    desc: '贺兰山中的西夏皇族秘窟，埋藏着失落的西夏武学典籍。',
    theme: 'desert_ruins',
    terrain: '沙漠古窟',
    enemyPool: {
      battle: ['desert_mummy','sand_warrior','scarab_swarm','dust_devil'],
      elite: ['pharaoh_spirit','sandstorm_colossus'],
      boss:  ['xia_royal_guardian','desert_dragon_king'],
    },
    drops: {
      manuals: ['fo_l1','fi_l1','th_l1'],
      equip:   { type:'armor', rarity:'rare', name:'西夏金铠' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  tianlong: {
    name: '天龙石林',
    icon: '🐉',
    desc: '大理天龙寺后的奇石林，每块巨石上都刻有一式六脉神剑的剑意。',
    theme: 'stone',
    terrain: '奇石林',
    enemyPool: {
      battle: ['stone_dragon_pup','buddha_stone_guard','lotus_mantis','crane_demon'],
      elite: ['six_meridian_spirit','dragon_stone_colossus'],
      boss:  ['tianlong_monk_sage','dragon_meridian_lord'],
    },
    drops: {
      manuals: ['bd_l1','bd02','bd_lf1','bd_lf3'],
      equip:   { type:'weapon', rarity:'rare', name:'六脉无形剑' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  nangong: {
    name: '南宫暗殿',
    icon: '🎭',
    desc: '南宫世家地下深处，暗殿中机关重重，埋藏家族秘宝。',
    theme: 'trap',
    terrain: '暗器机关殿',
    enemyPool: {
      battle: ['hidden_blade_mech','shadow_puppet','poison_needle_turret','dark_servant'],
      elite: ['nangong_elite_assassin','trap_master'],
      boss:  ['nangong_patriarch_phantom','shadow_weaver_lord'],
    },
    drops: {
      manuals: ['sh_l1','sh01','sh_lf1'],
      equip:   { type:'accessory', rarity:'rare', name:'南宫暗器袋' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  haisha: {
    name: '碧波龙宫',
    icon: '🦈',
    desc: '海外黑鲨帮总部附近的海底宫殿，传说中有龙王遗宝。',
    theme: 'ocean',
    terrain: '海底宫殿',
    enemyPool: {
      battle: ['shark_warrior','sea_serpent','coral_golem','jellyfish_mage'],
      elite: ['kraken_spawn','tsunami_elemental'],
      boss:  ['shark_king_leviathan','sea_dragon_lord'],
    },
    drops: {
      manuals: ['wi_l1','wi_l2','wi_l3'],
      equip:   { type:'armor', rarity:'rare', name:'龙鳞水靠' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  lingxiao: {
    name: '凌霄剑冢',
    icon: '🌀',
    desc: '凌霄城上方的神秘剑冢，旋转的剑阵守护着一位绝世剑客的遗物。',
    theme: 'wind',
    terrain: '天空剑冢',
    enemyPool: {
      battle: ['wind_blade_spirit','flying_sword_puppet','storm_hawk','gale_phantom'],
      elite: ['cyclone_sword_master','thunder_hawk_king'],
      boss:  ['lingxiao_sword_emperor','storm_overlord'],
    },
    drops: {
      manuals: ['sw_l1','sw01','sw02'],
      equip:   { type:'weapon', rarity:'rare', name:'凌霄御风剑' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  qingcheng: {
    name: '青城幽谷',
    icon: '🌿',
    desc: '青城山深处的幽谷，青城剑法与自然之力交融，暗藏隐世高人的修炼遗迹。',
    theme: 'forest',
    terrain: '幽深密林',
    enemyPool: {
      battle: ['forest_phantom','bamboo_spirit','mist_puppet','vine_snake'],
      elite: ['qingcheng_sword_ghost','ancient_tree_demon'],
      boss:  ['qingcheng_hermit_spirit','forest_realm_lord'],
    },
    drops: {
      manuals: ['sw_l1','sw_lf1','ta_l1'],
      equip:   { type:'weapon', rarity:'rare', name:'青城松风剑' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  guigu: {
    name: '鬼谷迷阵',
    icon: '🔮',
    desc: '鬼谷门祖师留下的奇门遁甲大阵，阵中时间流速紊乱，空间错位。',
    theme: 'illusion',
    terrain: '迷幻阵法',
    enemyPool: {
      battle: ['time_phantom','space_rift_mage','divination_spirit','fate_weaver'],
      elite: ['qimen_dunjia_guard','chronos_apparition'],
      boss:  ['guigu_master_illusion','destiny_overlord'],
    },
    specialRule: 'confusion',
    drops: {
      manuals: ['qm_l1','qm03','ft_l1','ft05'],
      equip:   { type:'accessory', rarity:'epic', name:'天机罗盘' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  tiandibang: {
    name: '雷霆地宫',
    icon: '⚡',
    desc: '天地帮总坛下方的地宫，雷电之力汇聚于此，常人难以靠近。',
    theme: 'thunder',
    terrain: '雷电地宫',
    enemyPool: {
      battle: ['thunder_beast','lightning_elemental','spark_golem','storm_soldier'],
      elite: ['thunder_giant','lightning_vortex_lord'],
      boss:  ['tiandi_thunder_overlord','heaven_earth_tyrant'],
    },
    drops: {
      manuals: ['th_l1','th01','th02'],
      equip:   { type:'weapon', rarity:'rare', name:'天雷锤' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
  shengguang: {
    name: '圣光秘殿',
    icon: '✦',
    desc: '圣光教总坛的地下圣殿，圣光之力在此凝聚为实体，净化一切邪恶。',
    theme: 'holy',
    terrain: '圣光殿堂',
    enemyPool: {
      battle: ['holy_knight_spirit','light_elemental','judgment_angel','sacred_guardian'],
      elite: ['seraph_warrior','divine_judge'],
      boss:  ['holy_archon','radiance_lord'],
    },
    drops: {
      manuals: ['ho_l1','ho01','ho03','mu_l2'],
      equip:   { type:'armor', rarity:'rare', name:'圣光战甲' },
      contrib: { normal:10, hard:22, nightmare:40 },
    },
  },
};

// ═══════════════════════════════════════════════════
//  二、难度配置
// ═══════════════════════════════════════════════════

const REALM_DIFF = {
  normal:    { label:'普通', icon:'📖', mult:1.0,  gridSize:[3,4], battles:4, elites:1, chests:2,  bossExtraHp:0,    color:'#80e880' },
  hard:      { label:'困难', icon:'⚔️', mult:1.5,  gridSize:[3,5], battles:6, elites:2, chests:2,  bossExtraHp:0.3,  color:'#f0c040' },
  nightmare: { label:'噩梦', icon:'💀', mult:2.2,  gridSize:[4,5], battles:8, elites:3, chests:3,  bossExtraHp:0.6,  color:'#ff5050' },
};

// ═══════════════════════════════════════════════════
//  三、存档与状态
// ═══════════════════════════════════════════════════

const REALM_SAVE_KEY = 'wuxia_sect_realm';

/**
 * 获取秘境存档
 * 格式：{ sectId, weeklyClears: { normal:N, hard:N, nightmare:N }, lastWeek: 'YYYY-WW' }
 */
function realmLoadSave(){
  try {
    const s = localStorage.getItem(REALM_SAVE_KEY);
    return s ? JSON.parse(s) : null;
  } catch(e){ return null; }
}

function realmSaveSave(data){
  try { localStorage.setItem(REALM_SAVE_KEY, JSON.stringify(data)); } catch(e){}
}

/** 获取当前周标识 */
function _getWeekKey(){
  const d = new Date();
  const oneJan = new Date(d.getFullYear(),0,1);
  const week = Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + String(week).padStart(2,'0');
}

/** 获取本周已通关次数 */
function _getWeeklyClears(sectId, diff){
  const save = realmLoadSave();
  if(!save || save.sectId !== sectId) return 0;
  if(save.lastWeek !== _getWeekKey()) return 0; // 新周重置
  return (save.weeklyClears && save.weeklyClears[diff]) || 0;
}

/** 记录通关 */
function _recordClear(sectId, diff){
  const save = realmLoadSave() || { sectId, weeklyClears:{}, lastWeek:'' };
  save.sectId = sectId;
  save.lastWeek = _getWeekKey();
  if(!save.weeklyClears) save.weeklyClears = {};
  save.weeklyClears[diff] = (save.weeklyClears[diff] || 0) + 1;
  realmSaveSave(save);
}

/** 周限制：普通3次，困难2次，噩梦1次 */
const WEEKLY_LIMITS = { normal:3, hard:2, nightmare:1 };

// ═══════════════════════════════════════════════════
//  四、程序化地图生成
// ═══════════════════════════════════════════════════

/**
 * 为指定门派+难度生成一个地下城数据对象
 * 返回值直接兼容 DUNGEON_DB 的格式
 */
function generateSectRealm(sectId, diff){
  const cfg = SECT_REALM_DB[sectId];
  if(!cfg) return null;

  const diffCfg = REALM_DIFF[diff];
  if(!diffCfg) return null;

  const [rows, cols] = diffCfg.gridSize;

  // ── 获取门派等级范围 ──
  let minLv, maxLv;
  const sectObj = (typeof SECTS !== 'undefined') ? SECTS.find(s => s.id === sectId) : null;
  const tier = sectObj ? sectObj.tier : 'minor';
  if(tier === 'supreme'){
    minLv = diff === 'normal' ? 30 : diff === 'hard' ? 50 : 70;
    maxLv = minLv + 30;
  } else if(tier === 'major'){
    minLv = diff === 'normal' ? 25 : diff === 'hard' ? 45 : 65;
    maxLv = minLv + 25;
  } else {
    minLv = diff === 'normal' ? 20 : diff === 'hard' ? 40 : 60;
    maxLv = minLv + 20;
  }

  // ── 构建空网格 ──
  const map = [];
  for(let r = 0; r < rows; r++){
    map.push(new Array(cols).fill(null));
  }

  // ── 可用位置（排除入口和出口）──
  const allPos = [];
  for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
      allPos.push([r, c]);
    }
  }
  // 打乱
  for(let i = allPos.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [allPos[i], allPos[j]] = [allPos[j], allPos[i]];
  }

  // 入口（左上角）和出口（右下角）
  const entryPos = [0, 0];
  const exitPos = [rows - 1, cols - 1];

  // 移除入口和出口位置
  const usedSet = new Set();
  usedSet.add(entryPos[0] + ',' + entryPos[1]);
  usedSet.add(exitPos[0] + ',' + exitPos[1]);

  map[entryPos[0]][entryPos[1]] = { type:'entry', cleared:true, desc:'秘境入口，' + cfg.name + '的神秘气息扑面而来' };

  // ── 分配房间 ──
  const _pick = (pool) => pool[Math.floor(Math.random() * pool.length)];
  const freePos = allPos.filter(p => !usedSet.has(p[0] + ',' + p[1]));

  // 需要放置的房间列表
  const roomPlan = [];
  // Boss 放在出口旁边
  roomPlan.push({ type:'boss', pos: exitPos, force:true });

  // 战斗房
  for(let i = 0; i < diffCfg.battles; i++){
    roomPlan.push({ type:'battle' });
  }
  // 精英房
  for(let i = 0; i < diffCfg.elites; i++){
    roomPlan.push({ type:'elite' });
  }
  // 宝箱房
  for(let i = 0; i < diffCfg.chests; i++){
    roomPlan.push({ type:'chest' });
  }
  // 陷阱（1-2个）
  const trapCount = diff === 'nightmare' ? 2 : 1;
  for(let i = 0; i < trapCount; i++){
    roomPlan.push({ type:'trap' });
  }
  // 休息点
  roomPlan.push({ type:'rest' });
  // 事件
  roomPlan.push({ type:'event' });

  // 随机分配位置
  let posIdx = 0;
  roomPlan.forEach(rp => {
    if(rp.force){
      // Boss 放在出口位置
      const [br, bc] = rp.pos;
      const bossPool = cfg.enemyPool.boss;
      map[br][bc] = {
        type: 'boss',
        cleared: false,
        enemyId: _pick(bossPool),
        lootTier: diff === 'nightmare' ? 'legendary' : diff === 'hard' ? 'epic' : 'rare',
        desc: '【' + cfg.name + '守护者】最深处，一股恐怖的气息笼罩四周',
      };
      // 出口放在 Boss 旁边的空位
      // 找一个boss旁边的空位放exit
      for(const [dr, dc] of [[0,1],[1,0],[-1,0],[0,-1]]){
        const nr = br + dr, nc = bc + dc;
        if(nr >= 0 && nr < rows && nc >= 0 && nc < cols && !map[nr][nc]){
          map[nr][nc] = { type:'exit', cleared:false, desc: cfg.name + '的出口，通关！' };
          break;
        }
      }
      return;
    }

    // 找一个空闲位置
    while(posIdx < freePos.length){
      const [pr, pc] = freePos[posIdx++];
      if(usedSet.has(pr + ',' + pc)) continue;
      usedSet.add(pr + ',' + pc);

      switch(rp.type){
        case 'battle': {
          const pool = cfg.enemyPool.battle;
          map[pr][pc] = {
            type: 'battle',
            cleared: false,
            enemyId: _pick(pool),
            desc: cfg.name + '中，' + _pickBattleDesc(cfg.theme),
          };
          break;
        }
        case 'elite': {
          const pool = cfg.enemyPool.elite;
          map[pr][pc] = {
            type: 'elite',
            cleared: false,
            enemyId: _pick(pool),
            lootTier: diff === 'nightmare' ? 'epic' : 'rare',
            desc: cfg.name + '中，一股强大的气息弥漫',
          };
          break;
        }
        case 'chest': {
          const tiers = ['common','uncommon','rare'];
          map[pr][pc] = {
            type: 'chest',
            cleared: false,
            lootTier: diff === 'nightmare' ? 'epic' : tiers[Math.floor(Math.random()*tiers.length)],
            desc: '角落中有一个被遗忘的宝箱',
          };
          break;
        }
        case 'trap': {
          const descs = [
            '地面暗藏机关！小心！',
            '墙壁上的暗格忽然弹出暗器！',
            '脚下的石板突然下陷！',
          ];
          map[pr][pc] = { type:'trap', cleared:false, desc: _pick(descs) };
          break;
        }
        case 'rest': {
          map[pr][pc] = { type:'rest', cleared:false, desc: '一处安静的角落，可以稍作休整' };
          break;
        }
        case 'event': {
          const eventDescs = [
            '地上刻着奇异的文字，似乎记载着某种功法口诀……',
            '墙壁上有一幅画像，画中之人似乎在向你招手。',
            '一阵微风拂过，带来了远方若有若无的诵经声……',
            '地面上散落着前人的遗物，似乎可以翻找一番。',
          ];
          map[pr][pc] = { type:'event', cleared:false, desc: _pick(eventDescs) };
          break;
        }
      }
      break;
    }
  });

  // 确保 exit 存在（如果boss旁边没放成功，直接放在最后一行）
  let hasExit = false;
  for(let r = 0; r < rows && !hasExit; r++){
    for(let c = 0; c < cols && !hasExit; c++){
      if(map[r][c] && map[r][c].type === 'exit') hasExit = true;
    }
  }
  if(!hasExit){
    // 在末尾找一个空位
    for(let r = rows - 1; r >= 0; r--){
      for(let c = cols - 1; c >= 0; c--){
        if(!map[r][c]){
          map[r][c] = { type:'exit', cleared:false, desc: cfg.name + '的出口' };
          hasExit = true;
          break;
        }
      }
      if(hasExit) break;
    }
  }

  // 计算奖励
  const expMult   = diffCfg.mult;
  const baseExp   = tier === 'supreme' ? 3000 : tier === 'major' ? 2000 : 1200;
  const baseSilver= tier === 'supreme' ? 500  : tier === 'major' ? 350  : 200;

  // 构建地下城ID
  const dungeonId = 'realm_' + sectId + '_' + diff + '_' + Date.now();

  return {
    id:       dungeonId,
    name:     cfg.name,
    icon:     cfg.icon,
    desc:     cfg.desc,
    theme:    cfg.theme,
    minLevel: minLv,
    maxLevel: maxLv,
    nearCities: [], // 门派秘境不从城市进入
    terrain:  cfg.terrain,
    floors:   1,
    specialRule: cfg.specialRule || null,
    map:      map,
    startPos: entryPos,
    bossReward: {
      exp:    Math.round(baseExp * expMult),
      silver: Math.round(baseSilver * expMult),
      items:  [
        { id: 'item_spirit_stone', qty: diff === 'nightmare' ? 5 : diff === 'hard' ? 3 : 2 },
      ],
      manualChance: diff === 'nightmare' ? 0.40 : diff === 'hard' ? 0.25 : 0.15,
    },
    unlocks: [],
    restInterval: 2,
    restHealPct:  0.10,
    // ── 秘境专属标记 ──
    _isSectRealm: true,
    _sectId: sectId,
    _realmDiff: diff,
    _realmDrops: cfg.drops,
  };
}

/** 战斗房描述文本池 */
function _pickBattleDesc(theme){
  const descs = {
    temple:   ['铜人守卫在此巡视','佛像后有异动','石壁上的经文忽然发出金光','地下传来诵经声'],
    forest:   ['树林中闪过一道黑影','落叶纷飞中暗藏杀机','溪流旁有伏兵','古树洞中探出一双眼睛'],
    mountain: ['悬崖边的山道上有人把守','山风呼啸间暗器袭来','巨石后面藏着敌人','山脊上有弓箭手埋伏'],
    dark:     ['黑暗中传来低沉的笑声','烛火忽明忽灭，四周杀气弥漫','地面上刻着诡异的符文','阴影中走出一个黑衣人'],
    fire:     ['火焰屏障挡住了去路','岩浆池旁站着一个火衣人','地面上燃烧着不灭的圣火','热浪扑面，暗有伏兵'],
    swamp:    ['毒雾中传来嘶嘶声','泥沼中有什么在蠕动','毒蛇盘踞在树枝上','腐烂的气息中走出一个身影'],
    mechanical:['机关转动的声音此起彼伏','地板下暗藏弩箭','墙壁上弹出了数十根钢针','齿轮咬合间，一个铁傀儡走出'],
    illusion: ['眼前出现了海市蜃楼','花丛中传来悦耳的歌声','镜面中映出一个陌生身影','迷雾中似乎有人在招手'],
    ancient:  ['古旧的书架忽然倒塌','竹简上浮现出文字','墨迹在空气中凝聚成形','古卷的封面上画着奇怪的图案'],
    ice:      ['冰面下有什么在游动','冰柱忽然碎裂','寒风呼啸中走出一个身影','冰壁上倒映出一个白色的影子'],
    ruins:    ['断壁残垣中传来脚步声','石碑上刻满了经文','碎石堆下压着什么东西','废墟深处传来金属碰撞声'],
    mystic:   ['镜面中映出另一个自己','水晶球散发出迷蒙的光','空间在这里变得扭曲','时间似乎在这里凝固了'],
    blood:    ['血红色的池水冒出气泡','血腥味弥漫四周','地面上的血迹忽然流动起来','无数冤魂在空中盘旋'],
    water:    ['水中有什么在游动','水花四溅，暗有伏兵','水草间藏着一个身影','湖面上浮现出诡异的波纹'],
    ocean:    ['暗流涌动，方向不定','深海中传来鲸鸣','珊瑚丛中闪过一道黑影','海底洞穴中似乎有东西在移动'],
    snow:     ['暴风雪中隐约有身影','雪地上有奇怪的足迹','冰晶在空中凝聚成形','雪崩的余响中走出一个人影'],
    wind:     ['狂风中难以站稳','飞沙走石间暗藏杀机','龙卷风中传来兵器碰撞声','高空中有影子掠过'],
    trap:     ['地板下传来机械运转声','墙壁上嵌满了暗器','天花板上有尖刺缓缓降下','整个走廊都是机关'],
    thunder:  ['闪电击中了地面','电弧在空中噼啪作响','雷声中有人影闪过','地面上的符文发出电光'],
    holy:     ['圣光忽然变得刺眼','光环中走出一个身影','祈祷的声音回荡四周','一道金光劈开了前方的路'],
    ice_dark: ['寒冰牢笼中传来哀嚎','冻结的锁链忽然断裂','冰霜在空气中蔓延','黑暗中一双红色眼睛睁开'],
    desert_ruins:['沙尘暴中隐约有建筑','木乃伊从沙中钻出','沙丘下有东西在移动','金字塔入口前站着守卫'],
    stone:    ['巨石忽然移动','石林间传来回声','岩石中嵌着一把古剑','石台上刻着复杂的阵法'],
  };
  const pool = descs[theme] || descs.mountain;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════════════════
//  五、秘境入口逻辑
// ═══════════════════════════════════════════════════

/**
 * 检查玩家是否可以进入秘境
 * 条件：已加入门派 + 达到等级要求 + 本周次数未用完
 */
function canEnterRealm(sectId, diff){
  // 门派配置检查
  const cfg = SECT_REALM_DB[sectId];
  if(!cfg) return { ok:false, msg:'该门派没有秘境' };

  // 玩家门派检查
  const ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect || ed.sect !== sectId){
    return { ok:false, msg:'只有本门弟子才能进入秘境' };
  }

  // 等级检查
  const playerLv = ed.level || 1;
  const tier = (typeof SECTS !== 'undefined')
    ? (SECTS.find(s => s.id === sectId) || {}).tier || 'minor'
    : 'minor';
  const minLv = tier === 'supreme'
    ? (diff === 'normal' ? 30 : diff === 'hard' ? 50 : 70)
    : tier === 'major'
      ? (diff === 'normal' ? 25 : diff === 'hard' ? 45 : 65)
      : (diff === 'normal' ? 20 : diff === 'hard' ? 40 : 60);

  if(playerLv < minLv){
    return { ok:false, msg:'需要等级 Lv.' + minLv + '，你当前 Lv.' + playerLv };
  }

  // 周次数检查
  const clears = _getWeeklyClears(sectId, diff);
  const limit = WEEKLY_LIMITS[diff];
  if(clears >= limit){
    return { ok:false, msg:'本周' + diffCfg_label(diff) + '次数已用完（' + limit + '次/周）' };
  }

  return { ok:true, minLv };
}

function diffCfg_label(diff){
  return REALM_DIFF[diff] ? REALM_DIFF[diff].label : diff;
}

/**
 * 进入秘境
 * 生成动态地图 → 注册到 DUNGEON_DB → 调用 enterDungeon
 */
function enterSectRealm(sectId, diff){
  const check = canEnterRealm(sectId, diff);
  if(!check.ok){
    if(typeof showToast === 'function') showToast(check.msg, 'warn');
    return;
  }

  // 生成秘境
  const dungeon = generateSectRealm(sectId, diff);
  if(!dungeon){
    if(typeof showToast === 'function') showToast('秘境生成失败', 'error');
    return;
  }

  // 临时注册到 DUNGEON_DB（不影响已有数据）
  if(typeof DUNGEON_DB !== 'undefined'){
    DUNGEON_DB[dungeon.id] = dungeon;
  }

  // 记录通关回调（在dungeon完成时处理秘境专属奖励）
  _pendingRealmClear = { sectId, diff, dungeonId: dungeon.id };

  // 进入地下城
  if(typeof enterDungeon === 'function'){
    enterDungeon(dungeon.id, 'sect');
  } else {
    if(typeof showToast === 'function') showToast('地下城系统未加载', 'error');
  }
}

// ── 秘境通关处理 ──
let _pendingRealmClear = null;

/**
 * 秘境通关后调用
 * 由 dungeon 完成流程触发（在 dungeonComplete 后检查 _pendingRealmClear）
 */
function onRealmCleared(){
  if(!_pendingRealmClear) return;
  const { sectId, diff } = _pendingRealmClear;
  _pendingRealmClear = null;

  // 记录周通关
  _recordClear(sectId, diff);

  // 增加门派贡献
  const cfg = SECT_REALM_DB[sectId];
  if(cfg && cfg.drops && cfg.drops.contrib){
    const contrib = cfg.drops.contrib[diff] || 0;
    if(contrib > 0 && typeof edS !== 'undefined'){
      edS.sectContrib = (edS.sectContrib || 0) + contrib;
      if(typeof saveProgress === 'function') saveProgress();
      if(typeof showToast === 'function'){
        showToast('门派贡献 +' + contrib + '（' + diffCfg_label(diff) + '秘境通关）', 'ok');
      }
    }
  }

  // 江湖声望
  if(typeof jhAddFame === 'function'){
    const fameMap = { normal:20, hard:50, nightmare:100 };
    jhAddFame(fameMap[diff] || 20);
  }
}

// ═══════════════════════════════════════════════════
//  六、秘境 UI 渲染（供 sect.html 调用）
// ═══════════════════════════════════════════════════

/**
 * 渲染秘境面板
 * @param {Object} sect - 当前门派对象
 * @param {HTMLElement} container - 渲染目标容器
 */
function renderRealmPanel(sect){
  if(!sect) return;

  const container = document.getElementById('tab-realm');
  if(!container) return;

  const cfg = SECT_REALM_DB[sect.id];
  if(!cfg){
    container.innerHTML = '<div class="sect-library-empty" style="padding:30px 16px">' +
      '<div style="font-size:28px;margin-bottom:10px">🏚</div>' +
      '<div style="font-size:13px;color:var(--text3)">此门派暂无秘境</div></div>';
    return;
  }

  const diffs = ['normal','hard','nightmare'];
  let html = '';

  // ── 秘境标题区 ──
  html += '<div class="realm-header" style="text-align:center;padding:16px 0 12px">';
  html += '<div style="font-size:32px">' + cfg.icon + '</div>';
  html += '<div style="font-size:18px;font-weight:bold;color:' + (sect.color || '#f0c060') + ';margin-top:6px">' + cfg.name + '</div>';
  html += '<div style="font-size:12px;color:var(--text3);margin-top:4px;max-width:300px;margin-left:auto;margin-right:auto">' + cfg.desc + '</div>';
  if(cfg.specialRule){
    const ruleLabels = {
      'no_weapon_bonus': '⚔ 兵器加成减半',
      'mana_regen': '💫 内力回复+50%',
      'poison_terrain': '🐍 每战后30%概率中毒',
      'life_steal': '🩸 敌人具有吸血效果',
      'trap_heavy': '🎯 陷阱伤害翻倍',
      'confusion': '🌀 20%概率自伤',
      'freeze_floor': '❄️ 冰面打滑',
      'mirror_match': '🪞 BOSS复制你的属性',
    };
    html += '<div style="margin-top:8px;font-size:11px;color:#ffaa40">' + (ruleLabels[cfg.specialRule] || cfg.specialRule) + '</div>';
  }
  html += '</div>';

  // ── 难度选择卡片 ──
  html += '<div class="realm-diffs" style="display:flex;flex-direction:column;gap:10px;padding:0 8px">';

  diffs.forEach(function(diff){
    const dc = REALM_DIFF[diff];
    const clears = _getWeeklyClears(sect.id, diff);
    const limit = WEEKLY_LIMITS[diff];
    const isLocked = clears >= limit;

    // 等级检查
    const tier = sect.tier || 'minor';
    const minLv = tier === 'supreme'
      ? (diff === 'normal' ? 30 : diff === 'hard' ? 50 : 70)
      : tier === 'major'
        ? (diff === 'normal' ? 25 : diff === 'hard' ? 45 : 65)
        : (diff === 'normal' ? 20 : diff === 'hard' ? 40 : 60);
    const playerLv = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;
    const lvOk = playerLv >= minLv;

    const canEnter = !isLocked && lvOk;

    html += '<div class="realm-diff-card" style="' +
      'background:' + (canEnter ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.02)') + ';' +
      'border:1px solid ' + (canEnter ? dc.color + '40' : 'rgba(255,255,255,.06)') + ';' +
      'border-radius:10px;padding:14px 16px;' +
      (canEnter ? '' : 'opacity:.5;') +
    '">';

    // 头部：难度名 + 状态
    html += '<div style="display:flex;justify-content:space-between;align-items:center">';
    html += '<div style="display:flex;align-items:center;gap:8px">';
    html += '<span style="font-size:20px">' + dc.icon + '</span>';
    html += '<span style="font-weight:bold;color:' + dc.color + ';font-size:15px">' + dc.label + '</span>';
    html += '</div>';

    // 状态标签
    if(isLocked){
      html += '<span style="font-size:10px;color:#ff6060;background:#ff606018;padding:2px 8px;border-radius:8px">本周已满</span>';
    } else if(!lvOk){
      html += '<span style="font-size:10px;color:#ffaa40;background:#ffaa4018;padding:2px 8px;border-radius:8px">需Lv.' + minLv + '</span>';
    } else {
      html += '<span style="font-size:10px;color:#80e880;background:#80e88018;padding:2px 8px;border-radius:8px">可挑战</span>';
    }
    html += '</div>';

    // 信息行
    html += '<div style="margin-top:8px;display:flex;gap:16px;font-size:11px;color:var(--text3)">';
    html += '<span>推荐等级 Lv.' + minLv + '+</span>';
    html += '<span>次数 ' + clears + '/' + limit + '/周</span>';
    html += '<span>地图 ' + dc.gridSize[0] + '×' + dc.gridSize[1] + '</span>';
    html += '</div>';

    // 奖励预览
    const contrib = cfg.drops.contrib[diff] || 0;
    html += '<div style="margin-top:6px;font-size:11px;color:rgba(200,180,120,.7)">';
    html += '🎁 通关奖励：经验×' + dc.mult + ' · 贡献+' + contrib;
    if(cfg.drops.equip){
      html += ' · ' + (cfg.drops.equip.name || '') + '（' + (cfg.drops.equip.rarity || '') + '）';
    }
    html += '</div>';

    // 进入按钮
    if(canEnter){
      html += '<button onclick="enterSectRealm(\'' + sect.id + '\',\'' + diff + '\')" ' +
        'style="margin-top:10px;width:100%;padding:8px 0;border:none;border-radius:6px;' +
        'background:' + dc.color + '20;color:' + dc.color + ';font-size:13px;cursor:pointer;' +
        'font-weight:bold;letter-spacing:1px">' +
        '进入 ' + dc.label + '秘境</button>';
    }

    html += '</div>';
  });

  html += '</div>';

  // ── 底部提示 ──
  html += '<div style="text-align:center;padding:14px 8px;font-size:10px;color:var(--text3);opacity:.5">';
  html += '每周一重置挑战次数 · 仅本门弟子可进入 · 通关获得门派贡献</div>';

  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════
//  七、导出（挂载到全局）
// ═══════════════════════════════════════════════════

window.SECT_REALM_DB     = SECT_REALM_DB;
window.REALM_DIFF        = REALM_DIFF;
window.WEEKLY_LIMITS     = WEEKLY_LIMITS;
window.generateSectRealm = generateSectRealm;
window.enterSectRealm    = enterSectRealm;
window.canEnterRealm     = canEnterRealm;
window.renderRealmPanel  = renderRealmPanel;
window.onRealmCleared    = onRealmCleared;
window.realmLoadSave     = realmLoadSave;
window.realmSaveSave     = realmSaveSave;
window._getWeeklyClears  = _getWeeklyClears;

})();
