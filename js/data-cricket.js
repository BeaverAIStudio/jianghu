/**
 * data-cricket.js — 蛐蛐小游戏扩展数据
 * 包含神兽城市映射、神兽专属声音池、神兽稀有池
 */
const LEGEND_CITY_BREED = {
  guangzhou:         { breedId:'south_sea_dragon',    tip:'南海龙帝 · 蛰伏于珠江之底' },
  xiyu_city:          { breedId:'wuzang_demon',         tip:'乌斯魔王 · 蛰伏于大漠深处' },
  xuanming_base:      { breedId:'ice_king',              tip:'极北冰帝 · 蛰伏于冰原秘境' },
  manhuang:           { breedId:'desert_god',            tip:'大漠狂神 · 蛰伏于蛮荒绝地' },
  tiandibang_fort:    { breedId:'fortress_overlord',    tip:'霸寨天王 · 蛰伏于山寨深处' },
  xuegu_fort:         { breedId:'blood_bone_king',       tip:'血骨冥王 · 蛰伏于血炼禁地' },
};

// 神兽声音（比 epic 更稀有、更震撼）
const LEGENDARY_SOUNDS = [
  { sound:'⚡⚡⚡　雷鸣低吼　⚡⚡⚡', style:'color:#ffd700;font-size:18px;font-weight:bold;text-shadow:0 0 10px #ffd700,0 0 20px #ff8c00', css:'color:#ffd700;text-shadow:0 0 8px #ffd700' },
  { sound:'🐉🔥🐉　龙吟九天　🐉🔥🐉', style:'color:#ff4500;font-size:18px;font-weight:bold;text-shadow:0 0 10px #ff4500,0 0 20px #dc143c', css:'color:#ff4500;text-shadow:0 0 8px #ff4500' },
  { sound:'☠　死寂……　☠', style:'color:#8b0000;font-size:18px;font-weight:bold;text-shadow:0 0 10px #8b0000', css:'color:#8b0000;text-shadow:0 0 8px #8b0000' },
  { sound:'🌊⚡🌊　沧海怒涛　🌊⚡🌊', style:'color:#00bfff;font-size:18px;font-weight:bold;text-shadow:0 0 10px #00bfff,0 0 20px #1e90ff', css:'color:#00bfff;text-shadow:0 0 8px #00bfff' },
  { sound:'💀🌑💀　万籁俱寂　💀🌑💀', style:'color:#4a0080;font-size:18px;font-weight:bold;text-shadow:0 0 10px #4a0080,0 0 20px #8b00ff', css:'color:#8b00ff;text-shadow:0 0 8px #8b00ff' },
  { sound:'🌪☠🌪　风卷亡魂　🌪☠🌪', style:'color:#cd853f;font-size:18px;font-weight:bold;text-shadow:0 0 10px #cd853f,0 0 20px #8b4513', css:'color:#cd853f;text-shadow:0 0 8px #cd853f' },
];

// 神兽品种池（rare=6，用于胜率计算）
const LEGENDARY_RARE_POOL = [
  'south_sea_dragon', 'wuzang_demon', 'ice_king', 'desert_god',
  'fortress_overlord', 'blood_bone_king'
];

// 神兽专属捕捉难度系数（比 epic 更难）
const LEGEND_CATCH_DIFFICULTY = 0.15; // 15% 基础捕捉成功率

// 6 只神兽数据（备用，防止主文件未加载）
if (typeof CRICKET_BREEDS !== 'undefined') {
  const LEGEND_BREEDS = [
    { id:'south_sea_dragon',     name:'南海龙帝',    legend:true, rare:6, atk:26, def:16, spd:18, hp:120, stamina:190, regen:12, personality:'agile',    skill:'龙啸沧海',  skillDesc:'三段连击+海浪推拒，每击伤害递增', regions:['guangzhou'],        color:'#006994' },
    { id:'wuzang_demon',         name:'乌斯魔王',    legend:true, rare:6, atk:28, def:10, spd:22, hp:110, stamina:170, regen:10, personality:'berserk',  skill:'天葬轮回',  skillDesc:'每次击杀后满血复活并ATK+3（上限3次）', regions:['xiyu_city'],       color:'#7b0030' },
    { id:'ice_king',             name:'极北冰帝',    legend:true, rare:6, atk:22, def:20, spd:12, hp:130, stamina:210, regen:14, personality:'guardian', skill:'万里冰封',  skillDesc:'冻结全场，双方速度归零2回合', regions:['xuanming_base'],   color:'#4fc3f7' },
    { id:'desert_god',           name:'大漠狂神',    legend:true, rare:6, atk:30, def:8,  spd:16, hp:100, stamina:155, regen:8,  personality:'fierce',   skill:'沙暴吞天',  skillDesc:'先手即死特效，但HP越低命中率越低', regions:['manhuang'],        color:'#d4a017' },
    { id:'fortress_overlord',    name:'霸寨天王',    legend:true, rare:6, atk:24, def:18, spd:10, hp:125, stamina:200, regen:11, personality:'steady',   skill:'雷霆万钧',  skillDesc:'召唤天雷，每回合额外造成对方最大HP10%的伤害', regions:['tiandibang_fort'], color:'#7e3800' },
    { id:'blood_bone_king',      name:'血骨冥王',    legend:true, rare:6, atk:25, def:15, spd:14, hp:115, stamina:180, regen:12, personality:'cunning',  skill:'血咒锁魂',  skillDesc:'诅咒对手：每次行动损失10%当前HP，持续至一方倒下', regions:['xuegu_fort'],      color:'#8b0000' },
  ];
  // 合并到主品种池（去重）
  const existingIds = new Set(CRICKET_BREEDS.map(b => b.id));
  LEGEND_BREEDS.forEach(b => { if (!existingIds.has(b.id)) CRICKET_BREEDS.push(b); });
}
