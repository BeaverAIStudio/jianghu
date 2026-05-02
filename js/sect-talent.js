// ══════════════════════════════════════════════════
//  sect-talent.js  门派天赋树系统
//  功能：
//    1. 25门派各6个天赋节点（3条分支，每条2节点）
//    2. 天赋消耗门派贡献点数解锁
//    3. 天赋提供被动战斗加成、经验加成、特殊能力等
//    4. 可重置天赋（返还贡献点）
//    5. 天赋效果注入 battle.js calcFinalStats
//  version: 1
// ══════════════════════════════════════════════════

;(function(){
'use strict';

// ═══════════════════════════════════════════════════
//  一、天赋配置
// ═══════════════════════════════════════════════════

/**
 * 天赋节点定义规范
 * id: 天赋唯一ID
 * name: 天赋名称
 * icon: 图标
 * desc: 描述
 * branch: 所属分支名（用于UI分组显示）
 * branchIcon: 分支图标
 * cost: 消耗贡献点
 * reqLevel: 需要玩家等级
 * reqTalent: 前置天赋ID（null表示无前置）
 * effect: { 属性名: 数值 }  注入 calcFinalStats
 *   支持属性：atk, def, hp, mp, crit, dodge, spd, poisonAtk, poisonResist, iceAtk, iceResist, cureBonus, counterAtk
 * special: 特殊效果标识
 *   - 'exp_boost': 经验倍率加成（effect.expMult）
 *   - 'silver_boost': 银两倍率加成（effect.silverMult）
 *   - 'durability_save': 装备耐久损耗减少（effect.durabilitySave，百分比）
 *   - 'karma_boost': 善恶值影响加倍（effect.karmaMult）
 */

var SECT_TALENT_TREE = {
  // ── 少林寺 ──
  shaolin: [
    // 分支1：金刚护体（防御路线）
    { id:'st_sl_iron1',   name:'铁布衫',     icon:'🛡', desc:'外功硬功，刀枪不入',         branch:'金刚护体', branchIcon:'🛡', cost:20,  reqLevel:15, reqTalent:null,           effect:{ def:8, hp:20 }, special:null },
    { id:'st_sl_iron2',   name:'金钟罩',     icon:'🔔', desc:'少林绝学，金刚不坏',         branch:'金刚护体', branchIcon:'🛡', cost:60,  reqLevel:30, reqTalent:'st_sl_iron1', effect:{ def:15, hp:50, dodge:2 }, special:'durability_save', _durSave:15 },
    // 分支2：佛门心法（内功路线）
    { id:'st_sl_buddha1', name:'易筋经入门', icon:'📖', desc:'少林内功心法，调理经脉',       branch:'佛门心法', branchIcon:'📖', cost:20,  reqLevel:15, reqTalent:null,           effect:{ mp:30, hp:15 }, special:null },
    { id:'st_sl_buddha2', name:'易筋经大成', icon:'✨', desc:'内力深厚，百毒不侵',           branch:'佛门心法', branchIcon:'📖', cost:60,  reqLevel:35, reqTalent:'st_sl_buddha1', effect:{ mp:50, poisonResist:20 }, special:'karma_boost', _karmaMult:1.3 },
    // 分支3：罗汉拳法（攻击路线）
    { id:'st_sl_fist1',   name:'罗汉拳精通', icon:'👊', desc:'十八罗汉拳法炉火纯青',         branch:'罗汉拳法', branchIcon:'👊', cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:6, spd:2 }, special:null },
    { id:'st_sl_fist2',   name:'大力金刚掌', icon:'💎', desc:'掌力雄浑，碎石裂碑',           branch:'罗汉拳法', branchIcon:'👊', cost:60,  reqLevel:30, reqTalent:'st_sl_fist1', effect:{ atk:12, crit:4 }, special:null },
  ],
  // ── 武当派 ──
  wudang: [
    { id:'st_wd_taiji1',  name:'太极初悟',   icon:'☯',  desc:'领悟太极阴阳之理',           branch:'太极之道', branchIcon:'☯',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ dodge:4, counterAtk:5 }, special:null },
    { id:'st_wd_taiji2',  name:'太极化境',   icon:'🌀', desc:'四两拨千斤，以柔克刚',        branch:'太极之道', branchIcon:'☯',  cost:60,  reqLevel:35, reqTalent:'st_wd_taiji1', effect:{ dodge:6, counterAtk:8, spd:3 }, special:null },
    { id:'st_wd_sword1',  name:'武当剑意',   icon:'⚔',  desc:'剑法飘逸如行云流水',           branch:'武当剑法', branchIcon:'⚔',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:5, crit:3 }, special:null },
    { id:'st_wd_sword2',  name:'真武七截阵', icon:'✨', desc:'七星连环剑法，攻守兼备',       branch:'武当剑法', branchIcon:'⚔',  cost:60,  reqLevel:30, reqTalent:'st_wd_sword1', effect:{ atk:10, def:5, crit:5 }, special:null },
    { id:'st_wd_dao1',    name:'道法自然',   icon:'🌿', desc:'天人合一，内力绵长',           branch:'道门修心', branchIcon:'🌿', cost:20,  reqLevel:15, reqTalent:null,           effect:{ mp:40, cureBonus:8 }, special:null },
    { id:'st_wd_dao2',    name:'纯阳无极功', icon:'☀',  desc:'道家至高内功，生生不息',       branch:'道门修心', branchIcon:'🌿', cost:60,  reqLevel:35, reqTalent:'st_wd_dao1', effect:{ mp:60, cureBonus:15, hp:30 }, special:null },
  ],
  // ── 华山派 ──
  huashan: [
    { id:'st_hs_qf1',     name:'剑气纵横',   icon:'🗡',  desc:'剑气凌云，锋芒毕露',           branch:'剑气纵横', branchIcon:'🗡',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:8, crit:3 }, special:null },
    { id:'st_hs_qf2',     name:'独孤九剑',   icon:'⚡',  desc:'无招胜有招，破尽天下武学',     branch:'剑气纵横', branchIcon:'🗡',  cost:60,  reqLevel:35, reqTalent:'st_hs_qf1', effect:{ atk:14, crit:8, spd:3 }, special:null },
    { id:'st_hs_cf1',     name:'风灵步法',   icon:'💨',  desc:'身法飘逸，来去如风',           branch:'华山身法', branchIcon:'💨',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ spd:5, dodge:3 }, special:null },
    { id:'st_hs_cf2',     name:'紫霞神功',   icon:'🔮', desc:'华山至高内功，威力惊人',       branch:'华山身法', branchIcon:'💨',  cost:60,  reqLevel:30, reqTalent:'st_hs_cf1', effect:{ spd:4, mp:40, atk:5 }, special:null },
    { id:'st_hs_zs1',     name:'思过崖悟道', icon:'🧘',  desc:'华山思过崖静修，悟性大增',     branch:'崖壁顿悟', branchIcon:'🧘',  cost:20,  reqLevel:20, reqTalent:null,           effect:{ hp:20, mp:20 }, special:'exp_boost', _expMult:1.1 },
    { id:'st_hs_zs2',     name:'华山论剑',   icon:'🏆', desc:'论剑天下，气吞山河',           branch:'崖壁顿悟', branchIcon:'🧘',  cost:60,  reqLevel:35, reqTalent:'st_hs_zs1', effect:{ atk:10, crit:5 }, special:'exp_boost', _expMult:1.15 },
  ],
  // ── 明教 ──
  mingjiao: [
    { id:'st_mj_fire1',   name:'圣火初燃',   icon:'🔥', desc:'圣火令入门功法',               branch:'圣火令法', branchIcon:'🔥', cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:7, crit:2 }, special:null },
    { id:'st_mj_fire2',   name:'乾坤大挪移', icon:'🌀', desc:'明教至高神功，移形换位',       branch:'圣火令法', branchIcon:'🔥', cost:60,  reqLevel:35, reqTalent:'st_mj_fire1', effect:{ atk:12, dodge:5, spd:3 }, special:null },
    { id:'st_mj_force1',  name:'烈焰掌',     icon:'✋', desc:'掌力如烈火焚身',               branch:'烈焰外功', branchIcon:'✋', cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:5, hp:25 }, special:null },
    { id:'st_mj_force2',  name:'焚天灭地',   icon:'💥', desc:'火功大成，焚烧万物',           branch:'烈焰外功', branchIcon:'✋', cost:60,  reqLevel:30, reqTalent:'st_mj_force1', effect:{ atk:10, hp:40, crit:4 }, special:null },
    { id:'st_mj_cult1',   name:'光明圣教',   icon:'☀',  desc:'虔诚信仰，内力充沛',           branch:'光明信仰', branchIcon:'☀',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ mp:30, hp:15 }, special:'silver_boost', _silverMult:1.1 },
    { id:'st_mj_cult2',   name:'圣火传承',   icon:'🕯', desc:'千年圣火，薪火相传',           branch:'光明信仰', branchIcon:'☀',  cost:60,  reqLevel:35, reqTalent:'st_mj_cult1', effect:{ mp:50, cureBonus:10, atk:5 }, special:'silver_boost', _silverMult:1.2 },
  ],
  // ── 五毒教 ──
  wudu: [
    { id:'st_wd_ps1',     name:'蛊毒入门',   icon:'🐍',  desc:'苗疆蛊术入门',                branch:'蛊毒秘术', branchIcon:'🐍',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ poisonAtk:15 }, special:null },
    { id:'st_wd_ps2',     name:'万蛊噬心',   icon:'💀',  desc:'蛊毒大成，触之即死',           branch:'蛊毒秘术', branchIcon:'🐍',  cost:60,  reqLevel:35, reqTalent:'st_wd_ps1', effect:{ poisonAtk:30, poisonResist:20 }, special:null },
    { id:'st_wd_bd1',     name:'百毒不侵',   icon:'💚',  desc:'以毒养身，百毒难侵',           branch:'以毒养身', branchIcon:'💚', cost:20,  reqLevel:15, reqTalent:null,           effect:{ poisonResist:20, hp:15 }, special:null },
    { id:'st_wd_bd2',     name:'毒经大成',   icon:'📖',  desc:'毒功通神，百毒之王',           branch:'以毒养身', branchIcon:'💚', cost:60,  reqLevel:30, reqTalent:'st_wd_bd1', effect:{ poisonResist:35, hp:30, mp:25 }, special:null },
    { id:'st_wd_sk1',     name:'暗影突袭',   icon:'🗡',  desc:'苗疆秘法，悄然杀敌',           branch:'苗疆暗术', branchIcon:'🗡',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ spd:4, crit:4 }, special:null },
    { id:'st_wd_sk2',     name:'影蛊术',     icon:'👤',  desc:'分身幻影，令人难辨真假',       branch:'苗疆暗术', branchIcon:'🗡',  cost:60,  reqLevel:30, reqTalent:'st_wd_sk1', effect:{ spd:5, dodge:6, crit:5 }, special:null },
  ],
  // ── 唐门 ──
  tangmen: [
    { id:'st_tm_blade1',  name:'暴雨梨花',   icon:'🌸',  desc:'唐门暗器绝技，万箭齐发',       branch:'暗器绝学', branchIcon:'🌸',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:6, crit:5 }, special:null },
    { id:'st_tm_blade2',  name:'唐门暴雨式', icon:'🎯',  desc:'暴雨梨花针的至高境界',         branch:'暗器绝学', branchIcon:'🌸',  cost:60,  reqLevel:35, reqTalent:'st_tm_blade1', effect:{ atk:10, crit:10, spd:2 }, special:null },
    { id:'st_tm_mech1',   name:'机关精通',   icon:'⚙',  desc:'唐门机关术入门',               branch:'机关暗器', branchIcon:'⚙',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ def:5, dodge:3 }, special:'durability_save', _durSave:20 },
    { id:'st_tm_mech2',   name:'天女散花',   icon:'🎐',  desc:'精巧暗器，全方位覆盖',         branch:'机关暗器', branchIcon:'⚙',  cost:60,  reqLevel:30, reqTalent:'st_tm_mech1', effect:{ atk:8, crit:6, spd:4 }, special:null },
    { id:'st_tm_poison1', name:'毒经研习',   icon:'🧪',  desc:'唐门毒术与暗器配合',           branch:'毒药研习', branchIcon:'🧪', cost:20,  reqLevel:15, reqTalent:null,           effect:{ poisonAtk:12, poisonResist:10 }, special:null },
    { id:'st_tm_poison2', name:'绝情断肠',   icon:'☠',  desc:'唐门最毒之物，见血封喉',       branch:'毒药研习', branchIcon:'🧪', cost:60,  reqLevel:35, reqTalent:'st_tm_poison1', effect:{ poisonAtk:25, poisonResist:15, atk:5 }, special:null },
  ],
  // ── 桃花岛 ──
  taohuadao: [
    { id:'st_th_music1',  name:'玉箫音波',   icon:'🎵',  desc:'音波功法初窥门径',             branch:'音波功法', branchIcon:'🎵',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ mp:25, atk:4 }, special:null },
    { id:'st_th_music2',  name:'碧海潮生曲', icon:'🌊',  desc:'音波功法大成，伤人于无形',     branch:'音波功法', branchIcon:'🎵',  cost:60,  reqLevel:35, reqTalent:'st_th_music1', effect:{ mp:40, atk:8, cureBonus:12 }, special:null },
    { id:'st_th_ice1',    name:'落英神剑',   icon:'🌸',  desc:'桃花剑法飘逸绝伦',             branch:'落英神剑', branchIcon:'🌸',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:6, spd:3, dodge:2 }, special:null },
    { id:'st_th_ice2',    name:'弹指神通',   icon:'👆',  desc:'黄老邪绝技，指力惊人',         branch:'落英神剑', branchIcon:'🌸',  cost:60,  reqLevel:30, reqTalent:'st_th_ice1', effect:{ atk:12, crit:6 }, special:null },
    { id:'st_th_life1',   name:'桃花心法',   icon:'💗',  desc:'桃花岛内功心法',               branch:'桃花心法', branchIcon:'💗', cost:20,  reqLevel:15, reqTalent:null,           effect:{ hp:30, mp:20, cureBonus:5 }, special:null },
    { id:'st_th_life2',   name:'先天功',     icon:'✨',  desc:'天下至高内功之一',              branch:'桃花心法', branchIcon:'💗', cost:60,  reqLevel:35, reqTalent:'st_th_life1', effect:{ hp:50, mp:40, cureBonus:15 }, special:null },
  ],
  // ── 逍遥派 ──
  xiaoyao: [
    { id:'st_xy_ice1',    name:'天山折梅手', icon:'❄',  desc:'逍遥绝学，轻灵飘逸',           branch:'天山武学', branchIcon:'❄',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ atk:6, dodge:4, spd:2 }, special:null },
    { id:'st_xy_ice2',    name:'北冥神功',   icon:'🌊',  desc:'吸人内力为己用',               branch:'天山武学', branchIcon:'❄',  cost:60,  reqLevel:35, reqTalent:'st_xy_ice1', effect:{ mp:60, atk:8, hp:20 }, special:null },
    { id:'st_xy_wind1',   name:'凌波微步',   icon:'💨',  desc:'逍遥步法，踏水无痕',           branch:'逍遥身法', branchIcon:'💨',  cost:20,  reqLevel:15, reqTalent:null,           effect:{ spd:6, dodge:5 }, special:null },
    { id:'st_xy_wind2',   name:'八荒六合',   icon:'🌀',  desc:'身法通神，无人可追',           branch:'逍遥身法', branchIcon:'💨',  cost:60,  reqLevel:30, reqTalent:'st_xy_wind1', effect:{ spd:5, dodge:8, crit:4 }, special:null },
    { id:'st_xy_fate1',   name:'小无相功',   icon:'🔮',  desc:'无形无相，模仿万物',           branch:'无相神功', branchIcon:'🔮', cost:20,  reqLevel:15, reqTalent:null,           effect:{ mp:30, crit:3 }, special:'exp_boost', _expMult:1.1 },
    { id:'st_xy_fate2',   name:'天山大还丹', icon:'💊', desc:'逍遥灵药，起死回生',           branch:'无相神功', branchIcon:'🔮', cost:60,  reqLevel:35, reqTalent:'st_xy_fate1', effect:{ cureBonus:20, hp:40, mp:30 }, special:'exp_boost', _expMult:1.15 },
  ],
  // ── 逍遥派(继续)和其他门派使用通用模板 ──
  // 以下门派使用通用天赋模板，按门派特色微调效果

  // ══ 战法手牌天赋（通用分支，所有12门派均有）══════════════════════════
  // 分支：战法手牌 · 👑
  // 节点按顺序解锁，每节点需前置节点已解锁

  // ── 通用手牌天赋节点定义 ──
  _CARD_TALENT_NODES: [
    { id:'card_seed',   name:'初窥门径', icon:'👑', desc:'学派手牌权重×1.2；摸牌时+5%概率见本学派出牌',         branch:'战法手牌', branchIcon:'👑', cost:100,  reqLevel:10, reqTalent:null,          effect:{ _cardSchoolWeight:0.2 }, special:'_card_school_weight' },
    { id:'card_start',  name:'略知一二', icon:'👑', desc:'每场战斗初始手牌+1（共5张开局）',                      branch:'战法手牌', branchIcon:'👑', cost:300,  reqLevel:15, reqTalent:'card_seed', effect:{ _cardStartDraw:1 },     special:'_card_start_draw' },
    { id:'card_duizi',  name:'渐入佳境', icon:'👑', desc:'对子效果倍率+0.2（×1.5→×1.7）',                        branch:'战法手牌', branchIcon:'👑', cost:700,  reqLevel:20, reqTalent:'card_start',effect:{ _cardDuiziBonus:0.2 },  special:'_card_duizi_mult' },
    { id:'card_hold',   name:'小有所成', icon:'👑', desc:'藏牌蓄势时额外+5%防御（15%→20%，25%→30%）',            branch:'战法手牌', branchIcon:'👑', cost:1400, reqLevel:25, reqTalent:'card_duizi',effect:{ _cardHoldDef:0.05 },   special:'_card_hold_def' },
    { id:'card_hu',     name:'融会贯通', icon:'👑', desc:'门派学派将将胡额外+10%伤害',                             branch:'战法手牌', branchIcon:'👑', cost:2600, reqLevel:30, reqTalent:'card_hold', effect:{ _cardHuAtk:0.10 },     special:'_card_hu_atk' },
    { id:'card_kezi',   name:'登堂入室', icon:'👑', desc:'出本学派刻子时，额外触发一次本学派基础效果',              branch:'战法手牌', branchIcon:'👑', cost:4000, reqLevel:35, reqTalent:'card_hu',   effect:{ _cardKeziDouble:1 },   special:'_card_kezi_double' },
    { id:'card_master', name:'大成',     icon:'👑', desc:'解锁本门绝学手牌（1张专属高威力技能）',                  branch:'战法手牌', branchIcon:'👑', cost:6000, reqLevel:40, reqTalent:'card_kezi', effect:{ _cardUnlockExcl:1 },   special:'_card_unlock_excl' },
  ],

};

// 注入战法手牌天赋节点到各门派树（必须在 SECT_TALENT_TREE 声明完成后执行）
(function(){
  var nodes = SECT_TALENT_TREE._CARD_TALENT_NODES;
  ['shaolin','wudang','huashan','mingjiao','wudu','tangmen','taohua','xiaoyao'].forEach(function(key){
    if(Array.isArray(SECT_TALENT_TREE[key])){
      SECT_TALENT_TREE[key].push.apply(SECT_TALENT_TREE[key], nodes);
    }
  });
})();

function _genGenericTalents(sectId, branches){
  var talents = [];
  branches.forEach(function(br, bi){
    var nodes = br.nodes || (br.branches && br.branches[0] && br.branches[0].nodes);
    if(!nodes || nodes.length < 2) return;
    var baseId = 'st_' + sectId + '_' + bi;
    talents.push({
      id: baseId + '_1', name: nodes[0].name, icon: nodes[0].icon,
      desc: nodes[0].desc, branch: br.name, branchIcon: br.icon,
      cost: 20, reqLevel: 15, reqTalent: null,
      effect: nodes[0].effect, special: nodes[0].special || null,
    });
    talents.push({
      id: baseId + '_2', name: nodes[1].name, icon: nodes[1].icon,
      desc: nodes[1].desc, branch: br.name, branchIcon: br.icon,
      cost: 60, reqLevel: nodes[1].reqLevel || 30, reqTalent: baseId + '_1',
      effect: nodes[1].effect, special: nodes[1].special || null,
    });
  });
  return talents;
}

// 中小门派天赋配置
var GENERIC_TALENTS = {
  tiandibang: [
    { name:'雷霆之力', icon:'⚡', desc:'雷霆功法入门', branches:[{ nodes:[
      { name:'雷霆之力', icon:'⚡', desc:'雷电之力灌注全身', effect:{ atk:8, hp:15 } },
      { name:'雷神降世', icon:'🌩', desc:'雷霆万钧，势不可挡', effect:{ atk:14, crit:5 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'铁骨', icon:'🦴', desc:'横练功夫刀枪不入', effect:{ def:8, hp:20 } },
      { name:'霸体', icon:'💪', desc:'肉身成圣，力大无穷', effect:{ def:12, hp:40, atk:5 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'帮规严明', icon:'📜', desc:'帮众齐心协力', effect:{ mp:15, cureBonus:5 } },
      { name:'天下霸业', icon:'👑', desc:'一统江湖之志', effect:{ atk:8, def:5, hp:25 }, reqLevel:35, special:'exp_boost', _expMult:1.1 },
    ]}]},
  ].map(function(g){ return _genGenericTalents('tiandibang', g.branches); })[0],

  guigu: _genGenericTalents('guigu', [
    { name:'奇门遁甲', icon:'🌀', branches:[{ nodes:[
      { name:'奇门遁甲', icon:'🌀', desc:'奇门阵法入门', effect:{ spd:4, dodge:4 } },
      { name:'天机推演', icon:'🔮', desc:'算无遗策，洞察先机', effect:{ spd:6, crit:6, dodge:5 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'纵横术', icon:'📜', desc:'言辞犀利，攻心为上', effect:{ mp:25, atk:5 } },
      { name:'鬼谷谋略', icon:'🧠', desc:'谋略天下，运筹帷幄', effect:{ mp:40, atk:8, crit:4 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'隐匿术', icon:'👤', desc:'来去无踪', effect:{ spd:5, dodge:3 } },
      { name:'鬼谷秘传', icon:'🌑', desc:'鬼谷至高心法', effect:{ spd:4, atk:6, crit:5 }, reqLevel:35, special:'exp_boost', _expMult:1.1 },
    ]}]},
  ]),

  shengguang: _genGenericTalents('shengguang', [
    { name:'圣光', icon:'✦', branches:[{ nodes:[
      { name:'圣光之力', icon:'✦', desc:'圣光加身', effect:{ hp:25, cureBonus:10 } },
      { name:'圣裁', icon:'⚔', desc:'圣光审判邪恶', effect:{ hp:40, atk:8, cureBonus:12 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'圣愈', icon:'💚', desc:'圣光治愈之术', effect:{ cureBonus:15, mp:20 } },
      { name:'复活', icon:'✨', desc:'圣光起死回生', effect:{ cureBonus:20, mp:35, hp:30 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'信仰', icon:'🙏', desc:'虔诚信仰铸就力量', effect:{ def:6, hp:20 } },
      { name:'圣光庇佑', icon:'🌟', desc:'正义之力庇护全身', effect:{ def:10, hp:35, poisonResist:15 }, reqLevel:30 },
    ]}]},
  ]),

  emei: _genGenericTalents('emei', [
    { name:'峨眉剑法', icon:'🌺', branches:[{ nodes:[
      { name:'峨眉刺', icon:'🌺', desc:'峨眉基础剑法', effect:{ atk:6, spd:2 } },
      { name:'峨眉九阳', icon:'☀', desc:'九阳神功峨眉变种', effect:{ atk:10, hp:25, mp:20 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'冰心诀', icon:'❄', desc:'清心寡欲，心如止水', effect:{ mp:30, cureBonus:8 } },
      { name:'灭绝师太', icon:'💢', desc:'峨眉至高剑法', effect:{ atk:12, crit:6, spd:2 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'女侠风华', icon:'💃', desc:'身法灵动', effect:{ spd:5, dodge:4 } },
      { name:'绝世风华', icon:'👑', desc:'女中豪杰，武学宗师', effect:{ spd:4, dodge:6, crit:4 }, reqLevel:30, special:'exp_boost', _expMult:1.1 },
    ]}]},
  ]),

  kongtong: _genGenericTalents('kongtong', [
    { name:'七伤拳', icon:'🌪', branches:[{ nodes:[
      { name:'七伤入门', icon:'🌪', desc:'七伤拳法初学', effect:{ atk:10, hp:10 } },
      { name:'七伤绝技', icon:'💥', desc:'伤己七分换敌十分', effect:{ atk:18, crit:4 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'崆峒五老', icon:'🏔', desc:'五老真传功法', effect:{ def:8, hp:25 } },
      { name:'北地武宗', icon:'👑', desc:'北地武林之宗', effect:{ def:12, hp:40, atk:5 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'刚猛之道', icon:'💪', desc:'力大无穷', effect:{ atk:6, def:4 } },
      { name:'崆峒铁骨', icon:'🦾', desc:'铁骨铮铮', effect:{ atk:8, def:10, hp:20 }, reqLevel:30 },
    ]}]},
  ]),

  kunlun: _genGenericTalents('kunlun', [
    { name:'昆仑剑法', icon:'🏔', branches:[{ nodes:[
      { name:'昆仑剑意', icon:'🏔', desc:'雪域剑法', effect:{ atk:7, def:5 } },
      { name:'万剑归宗', icon:'⚔', desc:'万剑齐发', effect:{ atk:14, crit:5 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'寒冰内力', icon:'❄', desc:'冰雪之力入体', effect:{ iceAtk:15, mp:20 } },
      { name:'昆仑绝顶', icon:'🏔', desc:'冰封万里', effect:{ iceAtk:25, iceResist:15, def:8 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'西域奇功', icon:'沙漠', desc:'西域秘术入门', effect:{ hp:20, mp:15 } },
      { name:'三圣传说', icon:'🌟', desc:'昆仑三圣真传', effect:{ hp:35, mp:25, atk:5 }, reqLevel:30, special:'exp_boost', _expMult:1.1 },
    ]}]},
  ]),

  diancang: _genGenericTalents('diancang', [
    { name:'苍山剑法', icon:'💠', branches:[{ nodes:[
      { name:'苍山剑气', icon:'💠', desc:'云贵剑法入门', effect:{ atk:6, spd:3 } },
      { name:'苍山如海', icon:'🌊', desc:'剑气如海潮', effect:{ atk:10, spd:4, crit:4 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'毒剑双修', icon:'🐍', desc:'剑上淬毒', effect:{ poisonAtk:15, atk:4 } },
      { name:'苍山毒圣', icon:'☠', desc:'毒剑大成', effect:{ poisonAtk:25, poisonResist:15, atk:6 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'轻灵步法', icon:'🍃', desc:'山间轻功', effect:{ spd:5, dodge:3 } },
      { name:'苍派真传', icon:'📜', desc:'点苍派真传功法', effect:{ spd:4, dodge:5, mp:20 }, reqLevel:30 },
    ]}]},
  ]),

  tianshan: _genGenericTalents('tianshan', [
    { name:'冰系功法', icon:'❄', branches:[{ nodes:[
      { name:'天山雪莲', icon:'🌸', desc:'天山灵药入体', effect:{ hp:30, cureBonus:8 } },
      { name:'天山六阳', icon:'☀', desc:'六阳掌寒气入骨', effect:{ iceAtk:20, hp:25, mp:15 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'冰心玉壶', icon:'💎', desc:'冰心诀入门', effect:{ mp:25, iceResist:10 } },
      { name:'冰封万里', icon:'🏔', desc:'极寒之力', effect:{ iceAtk:30, iceResist:20, mp:20 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'天山童姥', icon:'👵', desc:'天山绝学', effect:{ dodge:4, mp:20 } },
      { name:'灵鹫宫主', icon:'👸', desc:'灵鹫宫至高功法', effect:{ mp:40, hp:25, cureBonus:12 }, reqLevel:30 },
    ]}]},
  ]),

  xixia: _genGenericTalents('xixia', [
    { name:'西域密宗', icon:'🌙', branches:[{ nodes:[
      { name:'密宗初学', icon:'🌙', desc:'西域密宗入门', effect:{ def:6, mp:20 } },
      { name:'密宗大成', icon:'🔮', desc:'密宗至高心法', effect:{ def:10, mp:35, crit:4 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'奇门阵法', icon:'🌀', desc:'奇门阵法入门', effect:{ spd:4, dodge:3 } },
      { name:'天命推算', icon:'⭐', desc:'预知未来', effect:{ spd:5, crit:6, dodge:4 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'阴阳调和', icon:'☯', desc:'阴阳双修', effect:{ hp:20, mp:15 } },
      { name:'西夏秘宝', icon:'💎', desc:'秘宗宝藏', effect:{ hp:30, mp:25, atk:5 }, reqLevel:30, special:'silver_boost', _silverMult:1.15 },
    ]}]},
  ]),

  tianlong: _genGenericTalents('tianlong', [
    { name:'龙象般若', icon:'🐉', branches:[{ nodes:[
      { name:'龙象入门', icon:'🐉', desc:'龙象般若功初学', effect:{ hp:30, def:6 } },
      { name:'龙象大成', icon:'🐲', desc:'力大无穷', effect:{ hp:50, def:10, atk:8 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'吐蕃密宗', icon:'🛕', desc:'吐蕃密宗功夫', effect:{ atk:8, hp:20 } },
      { name:'十八罗汉', icon:'🥊', desc:'罗汉金身', effect:{ atk:12, def:8, hp:30 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'刚猛直接', icon:'⚡', desc:'不屑阴谋', effect:{ atk:6, crit:3 } },
      { name:'龙腾四海', icon:'🌊', desc:'龙象之力横扫武林', effect:{ atk:10, crit:5, spd:3 }, reqLevel:35 },
    ]}]},
  ]),

  nangong: _genGenericTalents('nangong', [
    { name:'南宫剑典', icon:'🏛', branches:[{ nodes:[
      { name:'南宫剑意', icon:'🏛', desc:'世家剑法', effect:{ atk:6, def:4, crit:2 } },
      { name:'南宫剑圣', icon:'⚔', desc:'剑道风雅至极', effect:{ atk:10, def:6, crit:5 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'儒家道义', icon:'📚', desc:'以仁克敌', effect:{ hp:20, cureBonus:8 } },
      { name:'世家底蕴', icon:'👑', desc:'数百年积累', effect:{ hp:30, def:8, mp:20 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'礼义廉耻', icon:'🎭', desc:'贵族风范', effect:{ mp:20, dodge:2 } },
      { name:'南宫传承', icon:'🌟', desc:'千年世家传承', effect:{ mp:30, atk:5, crit:4 }, reqLevel:35, special:'exp_boost', _expMult:1.1 },
    ]}]},
  ]),

  xuanming: _genGenericTalents('xuanming', [
    { name:'玄冥寒掌', icon:'⛧', branches:[{ nodes:[
      { name:'寒掌入门', icon:'⛧', desc:'玄冥寒气初入体', effect:{ iceAtk:15, atk:4 } },
      { name:'玄冥神掌', icon:'❄', desc:'寒毒入骨九死一生', effect:{ iceAtk:30, atk:8, iceResist:10 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'阴毒功法', icon:'☠', desc:'阴毒内力', effect:{ poisonAtk:12, hp:15 } },
      { name:'冰毒双修', icon:'💀', desc:'冰毒合一', effect:{ iceAtk:15, poisonAtk:15, atk:6 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'暗影行踪', icon:'👤', desc:'诡秘行踪', effect:{ spd:4, dodge:4 } },
      { name:'玄冥二老', icon:'👹', desc:'二老真传', effect:{ spd:5, dodge:5, crit:5 }, reqLevel:30 },
    ]}]},
  ]),

  haisha: _genGenericTalents('haisha', [
    { name:'海沙刀法', icon:'⚓', branches:[{ nodes:[
      { name:'七杀刀入门', icon:'⚓', desc:'海沙刀法', effect:{ atk:8, spd:2 } },
      { name:'七杀刀大成', icon:'🌊', desc:'刀势滔天', effect:{ atk:14, spd:3, crit:4 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'水战功法', icon:'💦', desc:'水上功夫', effect:{ dodge:5, spd:3 } },
      { name:'东海霸主', icon:'👑', desc:'海上之王', effect:{ dodge:6, spd:5, atk:5 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'豪放不羁', icon:'🍺', desc:'海量豪饮', effect:{ hp:20, atk:4 } },
      { name:'千堆雪', icon:'❄', desc:'海沙帮至高刀法', effect:{ atk:10, hp:25, crit:5 }, reqLevel:35 },
    ]}]},
  ]),

  riyue: _genGenericTalents('riyue', [
    { name:'葵花宝典', icon:'☀', branches:[{ nodes:[
      { name:'葵花入门', icon:'☀', desc:'葵花宝典初窥', effect:{ spd:5, crit:5 } },
      { name:'葵花大成', icon:'🔥', desc:'天下第一极速', effect:{ spd:8, crit:10, atk:6 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'吸星大法', icon:'🌀', desc:'吸人内力', effect:{ mp:30, hp:15 } },
      { name:'吸星大成', icon:'💫', desc:'内力深不可测', effect:{ mp:50, hp:25, atk:8 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'教主之威', icon:'👑', desc:'教众十万', effect:{ atk:6, def:4, hp:20 } },
      { name:'一统江湖', icon:'🏆', desc:'千秋万载一统江湖', effect:{ atk:10, def:8, hp:35, crit:4 }, reqLevel:35, special:'exp_boost', _expMult:1.15 },
    ]}]},
  ]),

  xuegu: _genGenericTalents('xuegu', [
    { name:'血炼大法', icon:'💀', branches:[{ nodes:[
      { name:'血炼入门', icon:'💀', desc:'以血炼体', effect:{ atk:8, hp:10 } },
      { name:'血炼大成', icon:'🩸', desc:'血肉之躯金刚不坏', effect:{ atk:15, hp:30, crit:3 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'骨铸', icon:'🦴', desc:'骨骼异变', effect:{ def:8, hp:20 } },
      { name:'骨铸神兵', icon:'⚔', desc:'骨骼化为兵刃', effect:{ def:12, hp:30, atk:6 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'杀伐果断', icon:'🔪', desc:'出手即杀', effect:{ atk:6, crit:4 } },
      { name:'血祭苍天', icon:'☠', desc:'血祭之力', effect:{ atk:10, crit:6, spd:3 }, reqLevel:35 },
    ]}]},
  ]),

  lingxiao: _genGenericTalents('lingxiao', [
    { name:'凌霄九式', icon:'🏯', branches:[{ nodes:[
      { name:'凌霄入门', icon:'🏯', desc:'凌霄剑法初学', effect:{ atk:6, spd:3 } },
      { name:'凌霄九式', icon:'✨', desc:'九式连击', effect:{ atk:12, crit:5, spd:4 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'情报高手', icon:'📜', desc:'消息通天下', effect:{ spd:5, dodge:4 } },
      { name:'天下第一楼', icon:'🏙', desc:'情报中枢', effect:{ spd:6, crit:5, dodge:5 }, reqLevel:30, special:'exp_boost', _expMult:1.1 },
    ]},{ nodes:[
      { name:'灵活应变', icon:'🔄', desc:'随机应变', effect:{ dodge:4, crit:3 } },
      { name:'凌云之志', icon:'☁', desc:'武学兼修', effect:{ atk:8, def:6, mp:20 }, reqLevel:30 },
    ]}]},
  ]),

  qingcheng: _genGenericTalents('qingcheng', [
    { name:'青城剑法', icon:'🌿', branches:[{ nodes:[
      { name:'青城入门', icon:'🌿', desc:'青城剑法', effect:{ atk:6, poisonAtk:8 } },
      { name:'青城十九剑', icon:'🗡', desc:'十九剑绝学', effect:{ atk:10, poisonAtk:15, crit:4 }, reqLevel:30 },
    ]},{ nodes:[
      { name:'毒剑', icon:'🐍', desc:'剑上淬毒', effect:{ poisonAtk:15, poisonResist:10 } },
      { name:'毒剑双绝', icon:'☠', desc:'毒剑天下第一', effect:{ poisonAtk:25, poisonResist:15, atk:5 }, reqLevel:35 },
    ]},{ nodes:[
      { name:'青城幽功', icon:'🌙', desc:'幽深功法', effect:{ mp:20, dodge:3 } },
      { name:'天下之幽', icon:'🌲', desc:'青城至高心法', effect:{ mp:30, dodge:5, hp:20 }, reqLevel:30 },
    ]}]},
  ]),
};

// 合并所有门派天赋
Object.keys(GENERIC_TALENTS).forEach(function(sid){
  if(!SECT_TALENT_TREE[sid]){
    SECT_TALENT_TREE[sid] = GENERIC_TALENTS[sid];
  }
});

// ═══════════════════════════════════════════════════
//  二、存档
// ═══════════════════════════════════════════════════

var ST_SAVE_KEY = 'wuxia_sect_talent';

/**
 * 存档结构：
 * {
 *   sectId: string,
 *   unlocked: ['talent_id', ...],  // 已解锁的天赋ID列表
 *   totalSpent: 0,                 // 累计消耗贡献
 * }
 */
function stLoad(){
  try { return JSON.parse(localStorage.getItem(ST_SAVE_KEY) || '{}'); }
  catch(e){ return {}; }
}
function stSave(data){
  try { localStorage.setItem(ST_SAVE_KEY, JSON.stringify(data)); }
  catch(e){}
}

// ═══════════════════════════════════════════════════
//  三、天赋逻辑
// ═══════════════════════════════════════════════════

/** 获取指定门派的天赋树 */
function stGetTree(sectId){
  return SECT_TALENT_TREE[sectId] || [];
}

/** 检查天赋是否已解锁 */
function stIsUnlocked(talentId){
  var save = stLoad();
  return (save.unlocked || []).indexOf(talentId) >= 0;
}

/** 解锁天赋 */
function stUnlockTalent(talentId){
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect){
    if(typeof showToast === 'function') showToast('未加入门派', 'warn');
    return false;
  }

  var tree = stGetTree(ed.sect);
  var talent = tree.find(function(t){ return t.id === talentId; });
  if(!talent){
    if(typeof showToast === 'function') showToast('未知天赋', 'error');
    return false;
  }

  var save = stLoad();

  // 切换门派时重置
  if(save.sectId && save.sectId !== ed.sect){
    save.sectId = ed.sect;
    save.unlocked = [];
    save.totalSpent = 0;
  }

  // 已解锁
  if((save.unlocked || []).indexOf(talentId) >= 0){
    if(typeof showToast === 'function') showToast('已解锁', 'warn');
    return false;
  }

  // 等级检查
  if(ed.level < (talent.reqLevel || 1)){
    if(typeof showToast === 'function') showToast('等级不足，需要 Lv.' + talent.reqLevel, 'warn');
    return false;
  }

  // 前置检查
  if(talent.reqTalent && (save.unlocked || []).indexOf(talent.reqTalent) < 0){
    if(typeof showToast === 'function') showToast('需要先解锁前置天赋', 'warn');
    return false;
  }

  // 贡献检查
  if((ed.sectContrib || 0) < talent.cost){
    if(typeof showToast === 'function') showToast('贡献不足，需要' + talent.cost, 'warn');
    return false;
  }

  // 扣除贡献
  edS.sectContrib = (edS.sectContrib || 0) - talent.cost;
  if(typeof saveProgress === 'function') saveProgress();

  // 记录解锁
  if(!save.unlocked) save.unlocked = [];
  save.unlocked.push(talentId);
  save.sectId = ed.sect;
  save.totalSpent = (save.totalSpent || 0) + talent.cost;
  stSave(save);

  if(typeof showToast === 'function'){
    showToast('🌟 解锁天赋：' + talent.icon + ' ' + talent.name, 'ok');
  }

  // 刷新面板
  var sect = (typeof SECTS !== 'undefined') ? SECTS.find(function(s){ return s.id === ed.sect; }) : null;
  if(sect && typeof renderSectTalentPanel === 'function'){
    renderSectTalentPanel(sect);
  }

  return true;
}

/** 重置天赋（返还80%贡献） */
function stResetTalents(){
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return false;

  var save = stLoad();
  var unlocked = save.unlocked || [];
  if(unlocked.length === 0){
    if(typeof showToast === 'function') showToast('没有已解锁的天赋', 'warn');
    return false;
  }

  // 计算返还（80%）
  var tree = stGetTree(ed.sect);
  var refund = 0;
  unlocked.forEach(function(tid){
    var t = tree.find(function(x){ return x.id === tid; });
    if(t) refund += Math.round(t.cost * 0.8);
  });

  // 返还贡献
  edS.sectContrib = (edS.sectContrib || 0) + refund;
  if(typeof saveProgress === 'function') saveProgress();

  // 清空天赋
  save.unlocked = [];
  save.totalSpent = 0;
  stSave(save);

  if(typeof showToast === 'function'){
    showToast('🔄 天赋已重置，返还 ' + refund + ' 贡献', 'ok');
  }

  // 刷新面板
  var sect = (typeof SECTS !== 'undefined') ? SECTS.find(function(s){ return s.id === ed.sect; }) : null;
  if(sect && typeof renderSectTalentPanel === 'function'){
    renderSectTalentPanel(sect);
  }

  return true;
}

/** 获取所有已解锁天赋的合并效果 */
function stGetAllTalentEffects(){
  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect) return { effects:{}, specials:{} };

  var save = stLoad();
  var unlocked = save.unlocked || [];
  var tree = stGetTree(ed.sect);

  var effects = {};
  var specials = {};

  unlocked.forEach(function(tid){
    var t = tree.find(function(x){ return x.id === tid; });
    if(!t || !t.effect) return;
    Object.keys(t.effect).forEach(function(k){
      effects[k] = (effects[k] || 0) + t.effect[k];
    });
    // 特殊效果
    if(t.special === 'exp_boost') specials.expMult = Math.max(specials.expMult || 1, t._expMult || 1.1);
    if(t.special === 'silver_boost') specials.silverMult = Math.max(specials.silverMult || 1, t._silverMult || 1.1);
    if(t.special === 'durability_save') specials.durabilitySave = Math.max(specials.durabilitySave || 0, t._durSave || 10);
    // 将将胡手牌天赋特殊效果
    if(t.special === '_card_school_weight') specials.cardSchoolWeight = Math.max(specials.cardSchoolWeight || 1, 1 + (t.effect._cardSchoolWeight || 0));
    if(t.special === '_card_start_draw')    specials.cardStartDraw    = (specials.cardStartDraw    || 0) + (t.effect._cardStartDraw    || 0);
    if(t.special === '_card_duizi_mult')     specials.cardDuiziMult    = (specials.cardDuiziMult    || 0) + (t.effect._cardDuiziBonus  || 0);
    if(t.special === '_card_hold_def')       specials.cardHoldDef      = (specials.cardHoldDef      || 0) + (t.effect._cardHoldDef    || 0);
    if(t.special === '_card_hu_atk')         specials.cardHuAtk        = (specials.cardHuAtk        || 0) + (t.effect._cardHuAtk      || 0);
    if(t.special === '_card_kezi_double')    specials.cardKeziDouble  = !!(t.effect._cardKeziDouble);
    if(t.special === '_card_unlock_excl')    specials.cardUnlockExcl  = !!(t.effect._cardUnlockExcl);
    if(t.special === 'karma_boost') specials.karmaMult = Math.max(specials.karmaMult || 1, t._karmaMult || 1.2);
  });

  return { effects: effects, specials: specials };
}

// ═══════════════════════════════════════════════════
//  四、UI 渲染
// ═══════════════════════════════════════════════════

function renderSectTalentPanel(sect){
  var container = document.getElementById('tab-talent');
  if(!container) return;

  var ed = (typeof edS !== 'undefined') ? edS : null;
  if(!ed || !ed.sect){
    container.innerHTML = '<div class="sect-library-empty" style="padding:30px 16px">' +
      '<div style="font-size:28px;margin-bottom:10px">🌟</div>' +
      '<div style="font-size:13px;color:var(--text3)">未加入门派</div></div>';
    return;
  }

  var tree = stGetTree(ed.sect);
  var save = stLoad();
  var unlocked = (save.sectId === ed.sect) ? (save.unlocked || []) : [];

  // 按分支分组
  var branches = {};
  tree.forEach(function(t){
    var bName = t.branch || '其他';
    var bIcon = t.branchIcon || '📌';
    if(!branches[bName]) branches[bName] = { name: bName, icon: bIcon, talents: [] };
    branches[bName].talents.push(t);
  });

  var html = '';

  // 标题
  html += '<div style="text-align:center;padding:12px 0 8px">';
  html += '<div style="font-size:18px;font-weight:bold;color:' + (sect.color || '#f0c060') + '">🌟 门派天赋</div>';
  html += '<div style="font-size:11px;color:var(--text3);margin-top:4px">消耗贡献解锁天赋，获得被动加成</div>';
  html += '<div style="font-size:11px;color:rgba(200,180,120,.7);margin-top:2px">🏛 贡献：' + (ed.sectContrib || 0) + ' · 已解锁 ' + unlocked.length + '/' + tree.length + '</div>';
  html += '</div>';

  // 分支渲染
  Object.keys(branches).forEach(function(bName){
    var br = branches[bName];
    html += '<div style="margin:8px 8px 4px;padding:8px 10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px">';
    html += '<div style="font-size:12px;font-weight:bold;color:rgba(200,180,120,.8)">' + br.icon + ' ' + bName + '</div>';

    br.talents.forEach(function(t){
      var isUnlocked = unlocked.indexOf(t.id) >= 0;
      var canUnlock = !isUnlocked && (ed.sectContrib || 0) >= t.cost && ed.level >= (t.reqLevel || 1);
      // 前置检查
      if(canUnlock && t.reqTalent && unlocked.indexOf(t.reqTalent) < 0) canUnlock = false;

      var borderColor = isUnlocked ? 'rgba(128,232,128,.3)' : (canUnlock ? 'rgba(240,192,96,.3)' : 'rgba(255,255,255,.06)');
      var bgColor = isUnlocked ? 'rgba(128,232,128,.06)' : (canUnlock ? 'rgba(240,192,96,.04)' : 'rgba(255,255,255,.01)');

      html += '<div style="display:flex;align-items:center;gap:8px;padding:8px;margin-top:6px;background:' + bgColor + ';border:1px solid ' + borderColor + ';border-radius:6px;cursor:' + (canUnlock ? 'pointer' : 'default') + '" ' +
        (canUnlock ? 'onclick="stUnlockTalent(\'' + t.id + '\')"' : '') + '>';

      // 图标
      html += '<div style="font-size:20px;width:28px;text-align:center;flex-shrink:0">' +
        (isUnlocked ? '✅' : t.icon) + '</div>';

      // 信息
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="font-size:12px;font-weight:bold;color:' + (isUnlocked ? '#80e880' : (canUnlock ? '#f0c060' : 'var(--text3)')) + '">' + t.name + '</div>';
      html += '<div style="font-size:10px;color:var(--text3);margin-top:2px">' + t.desc + '</div>';

      // 效果
      if(t.effect){
        var effStrs = Object.keys(t.effect).map(function(k){
          var labels = { atk:'⚔攻击', def:'🛡防御', hp:'❤气血', mp:'💙内力', crit:'🎯暴击', dodge:'💨闪避', spd:'⚡速度', poisonAtk:'🐍毒攻', poisonResist:'💚抗毒', iceAtk:'❄冰攻', iceResist:'🧊抗冰', cureBonus:'💖疗效', counterAtk:'⚔反击' };
          return (labels[k]||k) + '+' + t.effect[k];
        }).join(' · ');
        html += '<div style="font-size:9px;color:rgba(200,180,120,.6);margin-top:2px">' + effStrs + '</div>';
      }
      if(t.special === 'exp_boost') html += '<div style="font-size:9px;color:#80d0ff;margin-top:1px">✨ 经验×' + (t._expMult||1.1) + '</div>';
      if(t.special === 'silver_boost') html += '<div style="font-size:9px;color:#f0c060;margin-top:1px">💰 银两×' + (t._silverMult||1.1) + '</div>';
      if(t.special === 'durability_save') html += '<div style="font-size:9px;color:#80e880;margin-top:1px">🔧 耐久损耗-' + (t._durSave||10) + '%</div>';
      if(t.special === 'karma_boost') html += '<div style="font-size:9px;color:#c080ff;margin-top:1px">🌟 善恶影响×' + (t._karmaMult||1.2) + '</div>';

      html += '</div>';

      // 费用/状态
      html += '<div style="flex-shrink:0;text-align:right">';
      if(isUnlocked){
        html += '<div style="font-size:10px;color:#80e880">已解锁</div>';
      } else {
        html += '<div style="font-size:11px;font-weight:bold;color:' + (canUnlock ? '#f0c060' : '#666') + '">' + t.cost + '</div>';
        html += '<div style="font-size:9px;color:var(--text3)">Lv.' + (t.reqLevel||1) + '+</div>';
      }
      html += '</div>';

      html += '</div>';
    });

    html += '</div>';
  });

  // 重置按钮
  if(unlocked.length > 0){
    var tree2 = stGetTree(ed.sect);
    var refund = 0;
    unlocked.forEach(function(tid){
      var t = tree2.find(function(x){ return x.id === tid; });
      if(t) refund += Math.round(t.cost * 0.8);
    });
    html += '<div style="text-align:center;padding:12px 8px">';
    html += '<button onclick="stResetTalents()" style="padding:8px 20px;border:1px solid rgba(255,100,100,.2);border-radius:6px;background:transparent;color:#ff8080;font-size:12px;cursor:pointer">🔄 重置天赋（返还 ' + refund + ' 贡献）</button>';
    html += '</div>';
  }

  // 底部提示
  html += '<div style="text-align:center;padding:8px;font-size:10px;color:var(--text3);opacity:.5">每门派6个天赋 · 3条分支 · 重置返还80%贡献</div>';

  container.innerHTML = html;
}

// ═══════════════════════════════════════════════════
//  五、导出
// ═══════════════════════════════════════════════════

window.SECT_TALENT_TREE      = SECT_TALENT_TREE;
window.stGetTree            = stGetTree;
window.stIsUnlocked         = stIsUnlocked;
window.stUnlockTalent       = stUnlockTalent;
window.stResetTalents       = stResetTalents;
window.stGetAllTalentEffects = stGetAllTalentEffects;
window.renderSectTalentPanel  = renderSectTalentPanel;

})();
