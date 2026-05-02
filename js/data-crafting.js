// ════════════════════════════════════════════════════
//  data-crafting.js  合成系统配方数据
//  分类：丹药 / 毒器 / 强化材料 / 特殊道具 / 顶级秘药
// ════════════════════════════════════════════════════

// ── 合成台类型 ──
const CRAFT_STATIONS = {
  basic:    { id:'basic',    name:'🏮 杂货铺案台', desc:'基础材料合成，任意村镇可用', level:1 },
  alchemy:  { id:'alchemy',  name:'⚗️ 炼药炉',    desc:'炼制丹药，需找炼丹NPC或药房', level:10 },
  forge:    { id:'forge',    name:'🔨 铸造台',    desc:'铸造强化装备，需找铁匠铺', level:15 },
  poison:   { id:'poison',   name:'🧪 毒器台',    desc:'配制毒器，五毒教或黑市可用', level:20 },
  mystical: { id:'mystical', name:'✨ 秘法炉',    desc:'炼制顶级秘药，需宗师级炼丹师', level:40 },
};

// ── 合成配方总表 ──
// 每条配方：
//   id        : 配方唯一ID
//   name      : 配方名
//   icon      : 图标
//   station   : 合成台类型
//   category  : 分类（显示用）
//   level     : 所需炼制等级（玩家等级）
//   desc      : 配方描述
//   materials : [{ id, qty }]  消耗材料
//   result    : { id, name, icon, qty, effect }  产出
//   exp       : 合成获得经验
//   special   : 特殊效果说明（可选）

const CRAFT_RECIPES = [

  // ══════════════════════════════════════════════════
  //  一、基础丹药（杂货铺案台，低等级）
  // ══════════════════════════════════════════════════

  {
    id:'craft_huoxueyao',
    name:'活血药丸', icon:'💊', station:'basic', category:'基础丹药', level:1,
    desc:'将活血草研磨成丸，对轻微外伤疗效显著。',
    materials:[ {id:'item_herb_blood', qty:2} ],
    result:{ id:'item_huoxue_pill', name:'活血药丸', icon:'💊', qty:2,
             effect:{hp:60}, sellPrice:14,
             desc:'活血化瘀，恢复气血60。比直接嚼草更有效。' },
    exp:5
  },

  {
    id:'craft_peiyuanyao',
    name:'培元丹', icon:'🔵', station:'basic', category:'基础丹药', level:1,
    desc:'将参须片炼制成丸，补气益血，初学者常备。',
    materials:[ {id:'item_herb_qi', qty:2} ],
    result:{ id:'item_peiyuan_pill', name:'培元丹', icon:'🔵', qty:2,
             effect:{mp:100}, sellPrice:28,
             desc:'大补内力，恢复内力100。' },
    exp:5
  },

  {
    id:'craft_jieduyao',
    name:'解毒丸', icon:'🟢', station:'basic', category:'基础丹药', level:3,
    desc:'以蛇胆为引，加入三味解毒草药，可解一般毒素。',
    materials:[ {id:'item_snake_gall', qty:1}, {id:'item_herb_blood', qty:1} ],
    result:{ id:'item_jiedu_pill', name:'解毒丸', icon:'🟢', qty:2,
             effect:{detox:true, hp:20}, sellPrice:30,
             desc:'立即解除中毒状态，顺带恢复气血20。' },
    exp:8
  },

  {
    id:'craft_qishengyao',
    name:'起生丹', icon:'🌟', station:'basic', category:'基础丹药', level:5,
    desc:'以熊掌为药引，配以活血草，炼制成大补之药。',
    materials:[ {id:'item_bear_paw', qty:1}, {id:'item_herb_blood', qty:3} ],
    result:{ id:'item_qisheng_pill', name:'起生丹', icon:'🌟', qty:1,
             effect:{hp:200, mp:50}, sellPrice:80,
             desc:'大补气血200，内力50，效果卓著。' },
    exp:20
  },

  {
    id:'craft_jingqiyao',
    name:'精气丸', icon:'⚪', station:'basic', category:'基础丹药', level:3,
    desc:'研磨活血草与参须片，配制成既补气又补血的全能药丸。',
    materials:[ {id:'item_herb_blood', qty:1}, {id:'item_herb_qi', qty:1} ],
    result:{ id:'item_jingqi_pill', name:'精气丸', icon:'⚪', qty:2,
             effect:{hp:40, mp:60}, sellPrice:20,
             desc:'同时恢复气血40和内力60，适合连战时补给。' },
    exp:8
  },

  {
    id:'craft_qinggeng_soup',
    name:'清补鲜蔬羹', icon:'🥣', station:'basic', category:'基础丹药', level:4,
    desc:'将莲藕、竹笋与鲜蔬慢火熬成清补羹汤，适合作为历练后的温和补给。',
    materials:[ {id:'item_lotus_root', qty:2}, {id:'item_bamboo_shoot', qty:1}, {id:'item_vegetable_fresh', qty:2} ],
    result:{ id:'item_qinggeng_soup', name:'清补鲜蔬羹', icon:'🥣', qty:2,
             effect:{hp:90, mp:60}, sellPrice:32,
             desc:'荷香清润、竹鲜回甘，恢复气血90与内力60。' },
    exp:10
  },

  {
    id:'craft_shencao_powder',
    name:'参草培元散', icon:'🌿', station:'basic', category:'基础丹药', level:6,
    desc:'以甘草调和药性，再佐以人参提气，能在战后稳稳回补元气。',
    materials:[ {id:'item_herb_gancao', qty:3}, {id:'item_herb_renshen', qty:1} ],
    result:{ id:'item_shencao_powder', name:'参草培元散', icon:'🌿', qty:2,
             effect:{hp:60, mp:180}, sellPrice:72,
             desc:'调和诸药、补益中气，恢复气血60与内力180。' },
    exp:18
  },

  // ══════════════════════════════════════════════════
  //  二、战斗增益药（炼药炉，中等等级）
  // ══════════════════════════════════════════════════

  {
    id:'craft_kuixue_pill',
    name:'魁血丹', icon:'🔴', station:'alchemy', category:'战斗增益', level:10,
    desc:'以虎骨为引，炼制能在短时间内大幅提升攻击力的猛药。',
    materials:[ {id:'item_tiger_bone', qty:1}, {id:'item_herb_blood', qty:2} ],
    result:{ id:'item_kuixue_pill', name:'魁血丹', icon:'🔴', qty:1,
             effect:{atkBuff:15, turns:5}, sellPrice:95,
             desc:'服下后攻击力+15，持续5回合。' },
    exp:25
  },

  {
    id:'craft_tiepi_pill',
    name:'铁皮丸', icon:'🛡️', station:'alchemy', category:'战斗增益', level:10,
    desc:'以熊皮为引，炼制能短时强化防御的护体丹药。',
    materials:[ {id:'item_bear_hide', qty:1}, {id:'item_herb_qi', qty:2} ],
    result:{ id:'item_tiepi_pill', name:'铁皮丸', icon:'🛡️', qty:1,
             effect:{defBuff:15, turns:5}, sellPrice:90,
             desc:'服下后防御力+15，持续5回合。' },
    exp:25
  },

  {
    id:'craft_jufeng_pill',
    name:'聚风丸', icon:'🌀', station:'alchemy', category:'战斗增益', level:12,
    desc:'以冰晶为核，配合内功心法研磨而成，服后身轻如燕。',
    materials:[ {id:'item_ice_crystal', qty:1}, {id:'item_herb_qi', qty:2} ],
    result:{ id:'item_jufeng_pill', name:'聚风丸', icon:'🌀', qty:1,
             effect:{speedBuff:10, turns:4}, sellPrice:100,
             desc:'服下后速度+10，持续4回合，追击加成显著。' },
    exp:28
  },

  {
    id:'craft_baimai_pill',
    name:'百脉通丹', icon:'💛', station:'alchemy', category:'战斗增益', level:15,
    desc:'以兽核为主料，开通全身穴道，使内力运转更加顺畅。',
    materials:[ {id:'item_beast_core', qty:1}, {id:'item_herb_qi', qty:3} ],
    result:{ id:'item_baimai_pill', name:'百脉通丹', icon:'💛', qty:1,
             effect:{mpBuff:50, atkBuff:8, turns:6}, sellPrice:150,
             desc:'内力上限临时+50，攻击力+8，持续6回合。' },
    exp:40
  },

  {
    id:'craft_da_huoxue',
    name:'大还丹', icon:'❤️', station:'alchemy', category:'战斗增益', level:20,
    desc:'以灵石为引，精炼十味草药，炼制出可迅速恢复大量气血的金丹。',
    materials:[ {id:'item_spirit_stone', qty:1}, {id:'item_herb_blood', qty:4}, {id:'item_tiger_bone', qty:1} ],
    result:{ id:'item_da_huoxue', name:'大还丹', icon:'❤️', qty:1,
             effect:{hp:500}, sellPrice:350,
             desc:'服下立即恢复气血500，危机时刻的救命仙丹。' },
    exp:60
  },

  {
    id:'craft_da_peiyuan',
    name:'大培元丹', icon:'💙', station:'alchemy', category:'战斗增益', level:20,
    desc:'以灵石为炉心，精炼十味补气药材，炼出顶级补气仙丹。',
    materials:[ {id:'item_spirit_stone', qty:1}, {id:'item_herb_qi', qty:4}, {id:'item_bear_paw', qty:1} ],
    result:{ id:'item_da_peiyuan', name:'大培元丹', icon:'💙', qty:1,
             effect:{mp:400}, sellPrice:320,
             desc:'服下立即恢复内力400。内功高手首选。' },
    exp:60
  },

  {
    id:'craft_xiongdan_pill',
    name:'熊胆宁神丸', icon:'🟢', station:'alchemy', category:'战斗增益', level:12,
    desc:'取熊胆苦寒之性压火定神，再以甘草调和，能稳住鏖战后的紊乱内息。',
    materials:[ {id:'item_bear_gall', qty:1}, {id:'item_herb_gancao', qty:2}, {id:'item_herb_qi', qty:1} ],
    result:{ id:'item_xiongdan_pill', name:'熊胆宁神丸', icon:'🟢', qty:1,
             effect:{detox:true, hp:80, mp:140}, sellPrice:120,
             desc:'清火定胆，解除中毒并恢复气血80、内力140。' },
    exp:26
  },

  {
    id:'craft_leiwen_pill',
    name:'雷纹暴气丹', icon:'⚡', station:'alchemy', category:'战斗增益', level:28,
    desc:'把雷霆核中的躁烈之力封入灵石纹路，服下后真气奔涌，攻势如雷。',
    materials:[ {id:'item_thunder_core', qty:1}, {id:'item_spirit_stone', qty:1}, {id:'item_herb_qi', qty:2} ],
    result:{ id:'item_leiwen_pill', name:'雷纹暴气丹', icon:'⚡', qty:1,
             effect:{speedBuff:12, atkBuff:10, turns:5}, sellPrice:480,
             desc:'服下后速度+12、攻击+10，持续5回合。' },
    exp:82
  },

  {
    id:'craft_canghai_pill',
    name:'沧海凝珠露', icon:'💧', station:'alchemy', category:'战斗增益', level:30,
    desc:'以水灵珠柔化药性，再佐以补气活血二草，适合强者连战后的整段回补。',
    materials:[ {id:'item_water_pearl', qty:2}, {id:'item_herb_blood', qty:2}, {id:'item_herb_qi', qty:2} ],
    result:{ id:'item_canghai_pill', name:'沧海凝珠露', icon:'💧', qty:1,
             effect:{hp:220, mp:260}, sellPrice:560,
             desc:'服下后恢复气血220与内力260，如潮水回涌。' },
    exp:90
  },

  {
    id:'craft_liusha_pill',
    name:'流沙护元散', icon:'🟤', station:'alchemy', category:'战斗增益', level:32,
    desc:'西域医家以流沙晶入药，能令真气沉稳下坠，硬扛重击时尤见功效。',
    materials:[ {id:'item_sand_crystal', qty:2}, {id:'item_herb_gancao', qty:2}, {id:'item_herb_blood', qty:1} ],
    result:{ id:'item_liusha_pill', name:'流沙护元散', icon:'🟤', qty:1,
             effect:{defBuff:18, dodgeBuff:10, turns:6}, sellPrice:520,
             desc:'服下后防御+18、闪避+10%，持续6回合。' },
    exp:94
  },

  // ══════════════════════════════════════════════════
  //  三、毒器（毒器台，需一定等级）
  // ══════════════════════════════════════════════════

  {
    id:'craft_putong_du',
    name:'普通毒针', icon:'🪡', station:'poison', category:'毒器', level:8,
    desc:'以毒囊配合粗制刀片，简单淬毒，制成可投掷的毒针。',
    materials:[ {id:'item_venom_sac', qty:1}, {id:'item_crude_blade', qty:2} ],
    result:{ id:'item_poison_dart', name:'毒针', icon:'🪡', qty:5,
             effect:{special:'dart_ammo', dot_dmg:15, dot_turns:3}, sellPrice:12,
             desc:'投出后使目标中毒，每回合受到15点毒伤，持续3回合。' },
    exp:15
  },

  {
    id:'craft_judu_dart',
    name:'剧毒飞镖', icon:'☠️', station:'poison', category:'毒器', level:18,
    desc:'以蛊虫毒液加工，制成致命飞镖，五毒教秘传工艺。',
    materials:[ {id:'item_venom_sac', qty:2}, {id:'item_wudu_insect', qty:1} ],
    result:{ id:'item_judu_dart', name:'剧毒飞镖', icon:'☠️', qty:3,
             effect:{special:'dart_ammo', dot_dmg:40, dot_turns:5}, sellPrice:45,
             desc:'剧毒飞镖，每回合造成40点毒伤，持续5回合，解毒难度高。' },
    exp:40
  },

  {
    id:'craft_poison_smoke',
    name:'毒烟弹', icon:'💨', station:'poison', category:'毒器', level:15,
    desc:'将毒囊制成爆炸性毒烟，使敌人全场中毒。',
    materials:[ {id:'item_venom_sac', qty:3}, {id:'item_snake_scale', qty:2} ],
    result:{ id:'item_poison_smoke', name:'毒烟弹', icon:'💨', qty:2,
             effect:{special:'aoe_poison', dot_dmg:20, dot_turns:3}, sellPrice:60,
             desc:'投出后释放毒烟，使场上所有敌人中毒，持续3回合。' },
    exp:35
  },

  {
    id:'craft_anxi_powder',
    name:'安息散', icon:'😴', station:'poison', category:'毒器', level:12,
    desc:'制造催眠药粉，迷倒对手，适合夜行者和刺客。',
    materials:[ {id:'item_snake_gall', qty:2}, {id:'item_venom_sac', qty:1} ],
    result:{ id:'item_anxi_powder', name:'安息散', icon:'😴', qty:2,
             effect:{special:'stun', stun_turns:2}, sellPrice:55,
             desc:'撒出后使目标眩晕2回合，无法行动。' },
    exp:28
  },

  // ══════════════════════════════════════════════════
  //  四、强化材料（铸造台）
  // ══════════════════════════════════════════════════

  {
    id:'craft_gangpao',
    name:'钢甲护具', icon:'🥋', station:'forge', category:'强化材料', level:15,
    desc:'以熊皮和虎骨锻造，制成坚固护具，大幅提升防御。',
    materials:[ {id:'item_bear_hide', qty:2}, {id:'item_tiger_bone', qty:1} ],
    result:{ id:'item_gangpao', name:'钢甲护具', icon:'🥋', qty:1,
             effect:{defBuff:25, hpBuff:100, turns:999}, sellPrice:200,
             type:'equip_mat',
             desc:'装备后防御+25，气血上限+100。【消耗品式护具，不占装备栏】' },
    exp:50
  },

  {
    id:'craft_qingyi_cloth',
    name:'轻身锦衣', icon:'👘', station:'forge', category:'强化材料', level:12,
    desc:'以蟒鳞和雪豹皮编织，轻盈坚韧，提升身法与速度。',
    materials:[ {id:'item_snake_scale', qty:2}, {id:'item_leopard_pelt', qty:1} ],
    result:{ id:'item_qingyi_cloth', name:'轻身锦衣', icon:'👘', qty:1,
             effect:{speedBuff:8, dodgeBuff:8, turns:999}, sellPrice:280,
             type:'equip_mat',
             desc:'装备后速度+8，闪避+8%。【消耗品式护具，不占装备栏】' },
    exp:45
  },

  {
    id:'craft_xuantie_core',
    name:'玄铁精华', icon:'⚙️', station:'forge', category:'强化材料', level:25,
    desc:'以玄铁碎片熔炼提纯，得到极为稀有的铸造材料。',
    materials:[ {id:'item_beast_core', qty:3}, {id:'item_spirit_stone', qty:1} ],
    result:{ id:'item_xuantie_core', name:'玄铁精华', icon:'⚙️', qty:1,
             type:'upgrade_mat', sellPrice:600,
             desc:'【升级材料】用于强化武器或防具，使其品质提升一个等级。' },
    exp:80,
    special:'可对任意武器/防具使用，升级成功率80%'
  },

  {
    id:'craft_poison_blade_coat',
    name:'毒刃涂层', icon:'🗡️', station:'forge', category:'强化材料', level:20,
    desc:'以毒囊和蛊虫毒液炼制而成，涂抹在武器上使攻击附带中毒效果。',
    materials:[ {id:'item_venom_sac', qty:2}, {id:'item_wudu_insect', qty:1}, {id:'item_snake_gall', qty:1} ],
    result:{ id:'item_poison_blade_coat', name:'毒刃涂层', icon:'🗡️', qty:2,
             type:'weapon_coat', sellPrice:120,
             desc:'【武器强化材料】涂抹后武器攻击附带中毒效果，持续5回合。' },
    exp:45
  },

  {
    id:'craft_tietai_guard',
    name:'铁胎护心镜', icon:'🛡️', station:'forge', category:'强化材料', level:10,
    desc:'先以河泥塑模，再把铁矿烧打成镜胚，适合江湖人贴身护体。',
    materials:[ {id:'item_iron_ore', qty:4}, {id:'item_river_mud', qty:2} ],
    result:{ id:'item_tietai_guard', name:'铁胎护心镜', icon:'🛡️', qty:1,
             effect:{defBuff:12, hpBuff:80, turns:999}, sellPrice:168,
             type:'equip_mat',
             desc:'装备后防御+12，气血上限+80。【消耗品式护具，不占装备栏】' },
    exp:24
  },

  {
    id:'craft_lingyun_pendant',
    name:'灵蕴宝佩', icon:'📿', station:'forge', category:'强化材料', level:28,
    desc:'以稀有宝石为心、灵石为引，打磨成能稳神聚气的护身佩饰。',
    materials:[ {id:'item_rare_gem', qty:2}, {id:'item_spirit_stone', qty:2} ],
    result:{ id:'item_lingyun_pendant', name:'灵蕴宝佩', icon:'📿', qty:1,
             effect:{luck_bonus:18, dodgeBuff:10, turns:999}, sellPrice:1600,
             type:'equip_mat',
             desc:'装备后气运+18，闪避+10%。【消耗品式佩饰，不占装备栏】' },
    exp:95
  },

  {
    id:'craft_langya_charm',
    name:'狼牙护符', icon:'🦷', station:'forge', category:'强化材料', level:6,
    desc:'把狼牙以皮绳串结成符，山野猎户常用来稳脚程、避野兽。',
    materials:[ {id:'item_wolf_pelt', qty:1}, {id:'item_wolf_fang', qty:2} ],
    result:{ id:'item_langya_charm', name:'狼牙护符', icon:'🦷', qty:1,
             effect:{speedBuff:4, dodgeBuff:4, turns:999}, sellPrice:68,
             type:'equip_mat',
             desc:'装备后速度+4，闪避+4%。【消耗品式护符，不占装备栏】' },
    exp:14
  },

  {
    id:'craft_yazhui_bracer',
    name:'野猪牙臂扣', icon:'🦴', station:'forge', category:'强化材料', level:8,
    desc:'以獠牙磨成臂扣，再衬上厚布，粗犷却结实，适合初入江湖的硬拼打法。',
    materials:[ {id:'item_boar_tusk', qty:2}, {id:'item_cloth', qty:1} ],
    result:{ id:'item_yazhui_bracer', name:'野猪牙臂扣', icon:'🦴', qty:1,
             effect:{atkBuff:6, hpBuff:50, turns:999}, sellPrice:96,
             type:'equip_mat',
             desc:'装备后攻击+6，气血上限+50。【消耗品式护具，不占装备栏】' },
    exp:18
  },

  {
    id:'craft_huwei_cloak',
    name:'虎纹披风', icon:'🐯', station:'forge', category:'强化材料', level:14,
    desc:'以虎皮做面、狼牙压边，披上后自有几分山君威势。',
    materials:[ {id:'item_tiger_skin', qty:1}, {id:'item_wolf_fang', qty:2}, {id:'item_cloth', qty:2} ],
    result:{ id:'item_huwei_cloak', name:'虎纹披风', icon:'🐯', qty:1,
             effect:{atkBuff:12, dodgeBuff:6, turns:999}, sellPrice:210,
             type:'equip_mat',
             desc:'装备后攻击+12，闪避+6%。【消耗品式披风，不占装备栏】' },
    exp:38
  },

  {
    id:'craft_langwang_mantle',
    name:'狼王威氅', icon:'🐺', station:'forge', category:'强化材料', level:16,
    desc:'取巨狼首领王皮为底，再以狼王獠牙压边，穿上后步伐迅猛，野性逼人。',
    materials:[ {id:'item_alpha_pelt', qty:1}, {id:'item_alpha_fang', qty:2}, {id:'item_cloth', qty:1} ],
    result:{ id:'item_langwang_mantle', name:'狼王威氅', icon:'🐺', qty:1,
             effect:{speedBuff:10, atkBuff:8, dodgeBuff:6, turns:999}, sellPrice:268,
             type:'equip_mat',
             desc:'装备后速度+10，攻击+8，闪避+6%。【消耗品式披氅，不占装备栏】' },
    exp:52
  },

  {
    id:'craft_tongxin_link',
    name:'铜心连枢', icon:'⚙️', station:'forge', category:'强化材料', level:22,
    desc:'把铜芯磨成细密联动机括，再嵌入灵石稳住运转，适合做成随身护具的骨架。',
    materials:[ {id:'item_copper_core', qty:2}, {id:'item_iron_ore', qty:2}, {id:'item_spirit_stone', qty:1} ],
    result:{ id:'item_tongxin_link', name:'铜心连枢', icon:'⚙️', qty:1,
             effect:{defBuff:10, speedBuff:8, hpBuff:120, turns:999}, sellPrice:520,
             type:'equip_mat',
             desc:'装备后防御+10，速度+8，气血上限+120。【消耗品式机关骨架，不占装备栏】' },
    exp:76
  },

  {
    id:'craft_frostwolf_cloak',
    name:'霜狼雪裘', icon:'🧥', station:'forge', category:'强化材料', level:24,
    desc:'以冰狼皮毛覆身、霜牙固边，成衣后轻灵而不失御寒之力。',
    materials:[ {id:'item_ice_wolf_pelt', qty:1}, {id:'item_frost_fang', qty:2}, {id:'item_ice_crystal', qty:1} ],
    result:{ id:'item_frostwolf_cloak', name:'霜狼雪裘', icon:'🧥', qty:1,
             effect:{speedBuff:12, dodgeBuff:12, hpBuff:80, turns:999}, sellPrice:620,
             type:'equip_mat',
             desc:'装备后速度+12，闪避+12%，气血上限+80。【消耗品式寒裘，不占装备栏】' },
    exp:88
  },

  {
    id:'craft_blaze_coat',
    name:'炽焰淬刃层', icon:'🔥', station:'forge', category:'强化材料', level:32,
    desc:'先熔火晶，再以焰魄锁住火性，涂在兵刃上便能留下灼热余劲。',
    materials:[ {id:'item_fire_crystal', qty:2}, {id:'item_flame_essence', qty:1}, {id:'item_spirit_stone', qty:1} ],
    result:{ id:'item_blaze_coat', name:'炽焰淬刃层', icon:'🔥', qty:1,
             type:'weapon_coat', sellPrice:880,
             desc:'【武器强化材料】涂抹后武器攻击附带灼烧之力，持续5回合。' },
    exp:110
  },

  {
    id:'craft_tianji_core',
    name:'天机机枢匣', icon:'⚙️', station:'forge', category:'强化材料', level:35,
    desc:'把机关核心拆解重组，再嵌入宝石与灵石，可做成随身运转的小型机枢。',
    materials:[ {id:'item_mechanism_core', qty:1}, {id:'item_rare_gem', qty:1}, {id:'item_spirit_stone', qty:1} ],
    result:{ id:'item_tianji_core', name:'天机机枢匣', icon:'⚙️', qty:1,
             effect:{luck_bonus:12, speedBuff:8, turns:999}, sellPrice:1250,
             type:'equip_mat',
             desc:'装备后气运+12，速度+8。【消耗品式机关佩饰，不占装备栏】' },
    exp:130
  },

  // ══════════════════════════════════════════════════
  //  五、特殊功能道具
  // ══════════════════════════════════════════════════

  {
    id:'craft_compass',
    name:'罗盘', icon:'🧭', station:'basic', category:'特殊道具', level:5,
    desc:'以特殊矿石制成指南之器，可在迷路时指引方向，探索地图。',
    materials:[ {id:'item_iron_token', qty:3}, {id:'item_ghost_jade', qty:1} ],
    result:{ id:'item_compass', name:'江湖罗盘', icon:'🧭', qty:1,
             effect:{reveal_map:true}, sellPrice:80,
             desc:'使用后揭开周围3格地图，探索险地时特别有用。' },
    exp:12
  },

  {
    id:'craft_jieri_bundle',
    name:'节礼包', icon:'🎁', station:'basic', category:'特殊道具', level:1,
    desc:'精心挑选的礼品，用于送给NPC增进关系。',
    materials:[ {id:'item_western_silk', qty:1}, {id:'item_bear_paw', qty:1} ],
    result:{ id:'item_jieri_bundle', name:'节礼包', icon:'🎁', qty:1,
             effect:{rel_bonus:20, silver:0}, sellPrice:0,
             desc:'送给NPC可提升好感度+20，比普通礼物效果好得多。' },
    exp:5
  },

  {
    id:'craft_wenmo_gift',
    name:'文墨礼盒', icon:'🧧', station:'basic', category:'特殊道具', level:10,
    desc:'将松烟墨与各地特产搭配成礼盒，最适合拿去拜访读书人或讲究体面的江湖前辈。',
    materials:[ {id:'item_ink_songyan', qty:1}, {id:'item_local_specialty', qty:2} ],
    result:{ id:'item_wenmo_gift', name:'文墨礼盒', icon:'🧧', qty:1,
             effect:{rel_bonus:35, silver:0}, sellPrice:0,
             desc:'送给NPC可提升好感度+35，尤其适合文雅或有身份的人物。' },
    exp:12
  },

  {
    id:'craft_lucky_charm',
    name:'气运符', icon:'🔮', station:'basic', category:'特殊道具', level:8,
    desc:'以鬼玉和骨灰研磨，配合特殊祭炼，制成提升气运的符咒。',
    materials:[ {id:'item_ghost_jade', qty:2}, {id:'item_ghost_bone', qty:1} ],
    result:{ id:'item_lucky_charm', name:'气运符', icon:'🔮', qty:1,
             effect:{luck_bonus:15, duration_days:3}, sellPrice:150,
             desc:'使用后气运+15，持续3天游戏内时间，增加稀有掉落概率。' },
    exp:20
  },

  {
    id:'craft_revive_pill',
    name:'续命丸', icon:'💗', station:'alchemy', category:'特殊道具', level:25,
    desc:'以灵石和混沌精粹炼制，能在生死关头自动触发，续一口气。',
    materials:[ {id:'item_spirit_stone', qty:2}, {id:'item_chaos_essence', qty:1} ],
    result:{ id:'item_revive_pill', name:'续命丸', icon:'💗', qty:1,
             effect:{auto_revive:true, revive_hp:0.3}, sellPrice:2000,
             desc:'携带时，一旦气血降至0自动发动，以30%气血复活。每场战斗只触发一次。' },
    exp:120,
    special:'地下城生机系统扩展：消耗1个续命丸相当于+1生机'
  },

  {
    id:'craft_yemu_charm',
    name:'夜幕匿形符', icon:'🌘', station:'alchemy', category:'特殊道具', level:34,
    desc:'将暗晶磨粉、鬼玉定魂，再以灵石引气祭炼，能短时遮掩行迹、催旺险地奇机。',
    materials:[ {id:'item_dark_crystal', qty:2}, {id:'item_ghost_jade', qty:1}, {id:'item_spirit_stone', qty:1} ],
    result:{ id:'item_yemu_charm', name:'夜幕匿形符', icon:'🌘', qty:1,
             effect:{luck_bonus:18, duration_days:2}, sellPrice:880,
             desc:'使用后气运+18，持续2天游戏内时间，更容易撞见稀有掉落与奇遇。' },
    exp:108
  },

  // ══════════════════════════════════════════════════
  //  六、顶级秘药（秘法炉，高等级）
  // ══════════════════════════════════════════════════

  {
    id:'craft_nine_turn',
    name:'九转金丹', icon:'⭐', station:'mystical', category:'顶级秘药', level:40,
    desc:'传说中的绝世丹药，以真龙鳞甲为引，七七四十九天炼制而成。',
    materials:[
      {id:'item_dragon_scale',   qty:1},
      {id:'item_chaos_essence',  qty:2},
      {id:'item_spirit_stone',   qty:5},
      {id:'item_turtle_shell',   qty:1}
    ],
    result:{ id:'item_nine_turn_pill', name:'九转金丹', icon:'⭐', qty:1,
             effect:{hp:2000, mp:1000, permAtk:10, permDef:5}, sellPrice:99999,
             desc:'服下后恢复全部气血内力，并永久提升攻击+10，防御+5。传说之物。' },
    exp:500,
    special:'成功率仅60%，失败消耗所有材料，但获得"练丹失败"成就'
  },

  {
    id:'craft_dragon_blood_pill',
    name:'龙血丹', icon:'🐉', station:'mystical', category:'顶级秘药', level:35,
    desc:'以真龙鳞甲配合鹿角和灵石，炼制出融合龙族血脉之力的绝世丹药。',
    materials:[
      {id:'item_dragon_scale',  qty:1},
      {id:'item_deer_antler',   qty:1},
      {id:'item_spirit_stone',  qty:3}
    ],
    result:{ id:'item_dragon_blood_pill', name:'龙血丹', icon:'🐉', qty:1,
             effect:{hp:1000, atkBuff:30, defBuff:20, turns:10}, sellPrice:8000,
             desc:'气血+1000，攻击+30，防御+20，持续10回合，龙族血脉觉醒之感。' },
    exp:300,
    special:'服用后角色模型临时出现龙气光效'
  },

  {
    id:'craft_ice_soul_pill',
    name:'冰魄丹', icon:'❄️', station:'mystical', category:'顶级秘药', level:30,
    desc:'以万年龟甲和冰晶为主料，凝结天地寒气，炼成极寒仙丹。',
    materials:[
      {id:'item_turtle_shell', qty:1},
      {id:'item_ice_crystal',  qty:5},
      {id:'item_deer_antler',  qty:1}
    ],
    result:{ id:'item_ice_soul_pill', name:'冰魄丹', icon:'❄️', qty:1,
             effect:{mp:600, speedBuff:15, dodgeBuff:15, turns:8}, sellPrice:5000,
             desc:'内力+600，速度+15，闪避+15，持续8回合，仿佛化身冰雪精灵。' },
    exp:250
  },

  {
    id:'craft_chaos_core',
    name:'混沌内丹', icon:'⚫', station:'mystical', category:'顶级秘药', level:45,
    desc:'将两颗混沌精粹融合为一，凝炼成超越常规的内力结晶体。',
    materials:[
      {id:'item_chaos_essence', qty:3},
      {id:'item_spirit_stone',  qty:8},
      {id:'item_beast_core',    qty:5}
    ],
    result:{ id:'item_chaos_core', name:'混沌内丹', icon:'⚫', qty:1,
             effect:{permMp:100, permAtk:15, permSpd:5}, sellPrice:50000,
             desc:'服下后永久提升内力上限+100，攻击+15，速度+5。宗师之境的突破之物。' },
    exp:800,
    special:'每个角色只能服用一次，重复服用无效'
  },

  // ══════════════════════════════════════════════════
  //  六、蛐蛐笼（杂货铺案台）
  // ══════════════════════════════════════════════════
  {
    id:'craft_cricket_cage_basic',
    name:'竹编蛐蛐罐', icon:'🧺', station:'basic', category:'特殊道具', level:1,
    desc:'用细竹条编成的小罐，透气养蛐，可容纳1只蛐蛐。',
    materials:[ {id:'item_bamboo', qty:3}, {id:'item_herb_gancao', qty:1} ],
    result:{ id:'item_cricket_cage_basic', name:'竹编蛐蛐罐', icon:'🧺', qty:1,
             sellPrice:30,
             desc:'蛐蛐恢复速度+10%，每场战斗后体力恢复+3。' },
    exp:8
  },
  {
    id:'craft_cricket_cage_fine',
    name:'精制蛐蛐笼', icon:'🏮', station:'basic', category:'特殊道具', level:5,
    desc:'以上好紫竹编制，配有小水槽，蛐蛐住得舒适，可容纳1只蛐蛐。',
    materials:[ {id:'item_bamboo', qty:5}, {id:'item_river_mud', qty:2}, {id:'item_herb_gancao', qty:2} ],
    result:{ id:'item_cricket_cage_fine', name:'精制蛐蛐笼', icon:'🏮', qty:1,
             sellPrice:120,
             desc:'蛐蛐恢复速度+25%，每场战斗后体力恢复+8、血量恢复+5，攻/防/速各+1。' },
    exp:20
  },
  {
    id:'craft_cricket_cage_premium',
    name:'上等斗蛐金笼', icon:'🪗', station:'forge', category:'特殊道具', level:15,
    desc:'以金丝竹为骨、玉石为底制成，顶级斗蛐玩家才有资格使用，可容纳1只蛐蛐。',
    materials:[ {id:'item_bamboo', qty:8}, {id:'item_iron_ore', qty:3}, {id:'item_beast_core', qty:1} ],
    result:{ id:'item_cricket_cage_premium', name:'上等斗蛐金笼', icon:'🪗', qty:1,
             sellPrice:800,
             desc:'蛐蛐恢复速度翻倍，每场战斗后体力恢复+15、血量恢复+12，攻/防/速各+3。' },
    exp:80
  },

];

// ── 按分类分组（UI渲染用）──
const CRAFT_CATEGORIES = [
  { id:'基础丹药',   icon:'💊', color:'#60c880', desc:'简单材料合成，初级炼药' },
  { id:'战斗增益',   icon:'⚔️', color:'#ff6040', desc:'提升战斗属性的强化药物' },
  { id:'毒器',       icon:'☠️', color:'#80e040', desc:'配制各类毒器和暗器' },
  { id:'强化材料',   icon:'🔨', color:'#c0a040', desc:'用于铸造或升级装备的材料' },
  { id:'特殊道具',   icon:'🔮', color:'#8060ff', desc:'具有特殊效果的功能性道具' },
  { id:'顶级秘药',   icon:'⭐', color:'#ffe040', desc:'传说级丹药，材料稀缺，效果惊人' },
  { id:'蛐蛐用具',   icon:'🦗', color:'#80c040', desc:'养蛐、斗蛐所需的专用道具' },
];

// ── 辅助函数：根据ID查配方 ──
function getCraftRecipe(id){
  return CRAFT_RECIPES.find(r => r.id === id) || null;
}

// ── 辅助函数：获取某分类的所有配方 ──
function getCraftByCategory(cat){
  return CRAFT_RECIPES.filter(r => r.category === cat);
}

// ── 辅助函数：获取玩家能解锁的配方（按等级） ──
function getAvailableRecipes(playerLevel){
  return CRAFT_RECIPES.filter(r => playerLevel >= r.level);
}
