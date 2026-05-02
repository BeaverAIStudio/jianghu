/**
 * minigame-escort.js — 押镖小游戏（v2.0）
 *
 * 新版亮点：
 *  - 字符画队伍行进动画：玩家人物 + 镖车 + 随从横向滚动
 *  - 地形背景随镖路动态切换（平原/山地/水乡/沙漠）
 *  - 每段路程播放行进动画，可按「快进」跳过
 *  - 押镖完成后：真正更新玩家所在城市 + 推进游戏天数
 *  - 随从&马车字符画根据地形和进度变化
 *
 * 与主游戏联动：
 *  - 读取 edS.level / edS.name 判断玩家等级
 *  - 使用 SilverManager 统一管理系统扣除/发放银两
 *  - 押镖声望影响 travelPlayerState.reputation
 *  - 完成后 travelCurrentCity = destCityId，travelRenderLocation() 刷新地图
 *  - 存档键：wuxia_escort_data
 */

/* ═══════════════════════════════════════════
   一、镖路数据
   ═══════════════════════════════════════════ */
const ESCORT_ROUTES = [
  // 简单路线（适合低级玩家）
  {
    id: 'route_cangzhou_kaifeng',
    from: '沧州', to: '开封',
    fromCityId: 'cangzhou', toCityId: 'kaifeng',
    distance: 3,          // 段数（每段一个事件格）
    minLevel: 1,
    difficulty: 1,
    terrain: '平原',
    desc: '平原官道，路途平坦，劫匪偶有出没。',
    cargo: '绸缎匹料',
    baseReward: 80,
    repReward: 5,
    dangerRate: 0.35,     // 出现战斗事件概率
    travelDays: 4,        // 游戏内耗时天数
  },
  {
    id: 'route_kaifeng_luoyang',
    from: '开封', to: '洛阳',
    fromCityId: 'kaifeng', toCityId: 'luoyang',
    distance: 3,
    minLevel: 5,
    difficulty: 1,
    terrain: '平原',
    desc: '中原腹地，商旅繁忙，偶有江湖纠纷。',
    cargo: '铁器农具',
    baseReward: 90,
    repReward: 5,
    dangerRate: 0.35,
    travelDays: 3,
  },
  {
    id: 'route_luoyang_jinyang',
    from: '洛阳', to: '晋阳',
    fromCityId: 'luoyang', toCityId: 'jinyang',
    distance: 4,
    minLevel: 10,
    difficulty: 2,
    terrain: '山地',
    desc: '途经太行山，山匪出没，路况崎岖。',
    cargo: '官府文书',
    baseReward: 150,
    repReward: 8,
    dangerRate: 0.50,
    travelDays: 6,
  },
  {
    id: 'route_kaifeng_cangzhou',
    from: '开封', to: '沧州',
    fromCityId: 'kaifeng', toCityId: 'cangzhou',
    distance: 3,
    minLevel: 8,
    difficulty: 2,
    terrain: '平原',
    desc: '运河沿岸，水匪和路匪均有，需小心行事。',
    cargo: '粮食布匹',
    baseReward: 120,
    repReward: 7,
    dangerRate: 0.45,
    travelDays: 4,
  },
  {
    id: 'route_suzhou_hangzhou',
    from: '苏州', to: '杭州',
    fromCityId: 'suzhou', toCityId: 'hangzhou',
    distance: 3,
    minLevel: 12,
    difficulty: 2,
    terrain: '水乡',
    desc: '江南水网纵横，需换乘船只，水匪时常作乱。',
    cargo: '丝绸珍品',
    baseReward: 160,
    repReward: 8,
    dangerRate: 0.45,
    travelDays: 4,
  },
  {
    id: 'route_jinyang_xian',
    from: '晋阳', to: '西安',
    fromCityId: 'jinyang', toCityId: 'xian',
    distance: 5,
    minLevel: 18,
    difficulty: 3,
    terrain: '山地',
    desc: '穿越秦岭余脉，山高路险，豺狼出没，强盗横行。',
    cargo: '兵器盔甲',
    baseReward: 250,
    repReward: 12,
    dangerRate: 0.55,
    travelDays: 8,
  },
  {
    id: 'route_xian_dunhuang',
    from: '西安', to: '敦煌',
    fromCityId: 'xian', toCityId: 'dunhuang',
    distance: 6,
    minLevel: 28,
    difficulty: 4,
    terrain: '沙漠',
    desc: '丝绸之路西段，风沙恶劣，西域马匪凶悍。',
    cargo: '西域奇珍',
    baseReward: 400,
    repReward: 18,
    dangerRate: 0.60,
    travelDays: 15,
  },
  {
    id: 'route_wuhan_chengdu',
    from: '武汉', to: '成都',
    fromCityId: 'wuhan', toCityId: 'chengdu',
    distance: 5,
    minLevel: 22,
    difficulty: 3,
    terrain: '山地',
    desc: '蜀道艰险，号称"难于上青天"，土匪占山为王。',
    cargo: '蜀锦茶叶',
    baseReward: 300,
    repReward: 14,
    dangerRate: 0.55,
    travelDays: 10,
  },
  {
    id: 'route_hangzhou_guangzhou',
    from: '杭州', to: '广州',
    fromCityId: 'hangzhou', toCityId: 'guangzhou',
    distance: 6,
    minLevel: 30,
    difficulty: 4,
    terrain: '丘陵',
    desc: '沿海商道，海盗帮派势力犬牙交错，一路险象环生。',
    cargo: '香料瓷器',
    baseReward: 450,
    repReward: 20,
    dangerRate: 0.60,
    travelDays: 12,
  },
  // 合肥出发路线
  {
    id: 'route_hefei_nanjing',
    from: '合肥', to: '南京',
    fromCityId: 'hefei', toCityId: 'nanjing',
    distance: 3,
    minLevel: 8,
    difficulty: 2,
    terrain: '平原',
    desc: '江淮平原官道，水网密布，需防备水匪偷袭。',
    cargo: '江淮盐货',
    baseReward: 110,
    repReward: 6,
    dangerRate: 0.40,
    travelDays: 3,
  },
  {
    id: 'route_hefei_wuhan',
    from: '合肥', to: '武汉',
    fromCityId: 'hefei', toCityId: 'wuhan',
    distance: 4,
    minLevel: 12,
    difficulty: 2,
    terrain: '水乡',
    desc: '沿长江而上，水路漫长，江匪时常出没。',
    cargo: '茶叶布匹',
    baseReward: 140,
    repReward: 7,
    dangerRate: 0.45,
    travelDays: 5,
  },
  // 成都出发路线
  {
    id: 'route_chengdu_xian',
    from: '成都', to: '西安',
    fromCityId: 'chengdu', toCityId: 'xian',
    distance: 5,
    minLevel: 20,
    difficulty: 3,
    terrain: '山地',
    desc: '出川入秦，翻越秦岭栈道，山高路险。',
    cargo: '蜀锦药材',
    baseReward: 280,
    repReward: 12,
    dangerRate: 0.50,
    travelDays: 8,
  },
  {
    id: 'route_chengdu_guizhou',
    from: '成都', to: '贵阳',
    fromCityId: 'chengdu', toCityId: 'guiyang',
    distance: 4,
    minLevel: 15,
    difficulty: 3,
    terrain: '山地',
    desc: '川黔古道，苗疆边缘，瘴气毒虫与土匪并存。',
    cargo: '川盐银器',
    baseReward: 200,
    repReward: 9,
    dangerRate: 0.50,
    travelDays: 6,
  },
  // 福州出发路线
  {
    id: 'route_fuzhou_hangzhou',
    from: '福州', to: '杭州',
    fromCityId: 'fuzhou', toCityId: 'hangzhou',
    distance: 4,
    minLevel: 14,
    difficulty: 2,
    terrain: '丘陵',
    desc: '闽浙沿海商道，海沙派势力范围，需谨慎行事。',
    cargo: '茶叶瓷器',
    baseReward: 180,
    repReward: 8,
    dangerRate: 0.45,
    travelDays: 5,
  },
  {
    id: 'route_fuzhou_guangzhou',
    from: '福州', to: '广州',
    fromCityId: 'fuzhou', toCityId: 'guangzhou',
    distance: 5,
    minLevel: 18,
    difficulty: 3,
    terrain: '丘陵',
    desc: '闽粤古道，穿越武夷山脉，山匪与海盗勾结。',
    cargo: '丝绸海味',
    baseReward: 240,
    repReward: 10,
    dangerRate: 0.50,
    travelDays: 7,
  },
];

/* ═══════════════════════════════════════════
   二、随机事件库
   ═══════════════════════════════════════════ */

// 地形标签 → 事件池（非战斗事件）
const ESCORT_EVENTS = {
  // ── 好事 / 中性 ──────────────────────
  good: [
    {
      id: 'ev_merchant',
      icon: '🛒',
      title: '路遇行商',
      desc: '路边一位货郎见你押镖而来，笑着打招呼："侠士，买点东西解解渴？"他拿出几样货物。',
      choices: [
        { text: '购买干粮（-15两，回复精力+30）', cost: 15, effect: { energy: 30 } },
        { text: '婉拒，继续赶路', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_rest',
      icon: '🏡',
      title: '途经村庄',
      desc: '一个宁静小村落，村民热情邀你歇脚，端上热汤热饭招待。',
      choices: [
        { text: '接受款待（休息，精力+40）', cost: 0, effect: { energy: 40 } },
        { text: '谢绝，马不停蹄', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_fellow',
      icon: '🗡',
      title: '路遇同道',
      desc: '一位行走江湖的侠士与你同路，顺便讲起沿途见闻，还分享了些防身的心得。',
      choices: [
        { text: '同行交流（获得少量经验）', cost: 0, effect: { exp: 30 } },
        { text: '礼貌告别，各走各路', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_find_herb',
      icon: '🌿',
      title: '路边野草',
      desc: '细心的你发现路旁长着一丛草药，采下来应急不错。',
      choices: [
        { text: '采集草药（获得止血草×1）', cost: 0, effect: { item: 'herb_zhixuecao' } },
        { text: '不必，继续赶路', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_lucky',
      icon: '💰',
      title: '路边钱袋',
      desc: '你在路边发现一只不知谁遗落的钱袋，里面有些散碎银两。',
      choices: [
        { text: '拾取（+20~40两）', cost: 0, effect: { silver: [20, 40] } },
        { text: '留在原地，等失主来认', cost: 0, effect: { rep: 3 } },
      ],
    },
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"押镖恶搞事件
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'ev_dog_follow',
      icon: '🐕',
      title: '流浪狗跟随',
      desc: '一只脏兮兮的流浪狗一直跟着你的镖队，怎么赶都赶不走。',
      choices: [
        { text: '喂它点干粮（饱食度-10，运气+5）', cost: 0, effect: { food: -10, luck: 5 } },
        { text: '任由它跟着', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_singing_farmer',
      icon: '🎤',
      title: '山歌对唱',
      desc: '对面山头的农夫唱起了山歌，你的镖师们忍不住应和起来。',
      choices: [
        { text: '一起唱！（精力+20，心情大好）', cost: 0, effect: { energy: 20 } },
        { text: '专心赶路', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_strange_fruit',
      icon: '🍎',
      title: '奇异野果',
      desc: '路边长着一棵结满红色果子的树，看起来很诱人。',
      choices: [
        { text: '尝尝看（50%好吃精力+30，50%难吃精力-10）', cost: 0, effect: { gamble: { good: { energy: 30 }, bad: { energy: -10 } } } },
        { text: '不认识的东西不吃', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_lottery_ticket',
      icon: '🎫',
      title: '地上彩票',
      desc: '地上有一张皱巴巴的彩票，不知道有没有中奖。',
      choices: [
        { text: '捡起来看看（10%中100两，90%没中）', cost: 0, effect: { lottery: { chance: 0.1, win: 100 } } },
        { text: '不捡，脏', cost: 0, effect: {} },
      ],
    },
    {
      id: 'ev_fortune_teller',
      icon: '🔮',
      title: '算命先生',
      desc: '路边坐着个算命先生，见你过来喊道："这位镖师，我观你印堂发亮，今日必有奇遇！"',
      choices: [
        { text: '给点银子算一卦（-10两，随机好坏）', cost: 10, effect: { fortune: true } },
        { text: '江湖骗子，不理', cost: 0, effect: {} },
      ],
    },
  ],

  // ── 危险 / 中性 ──────────────────────
  neutral: [
    {
      id: 'ev_rain',
      icon: '🌧',
      title: '忽降大雨',
      desc: '天色骤变，大雨倾盆，道路泥泞难行，不得不放慢脚步。',
      choices: [
        { text: '冒雨前行（精力-20，继续推进）', cost: 0, effect: { energy: -20 } },
        { text: '找地方避雨（耗费时间，但安全）', cost: 0, effect: { delay: 1 } },
      ],
    },
    {
      id: 'ev_bridge_broken',
      icon: '🌊',
      title: '桥梁断裂',
      desc: '前方桥梁因洪水冲垮，需要绕路或想办法渡河。',
      choices: [
        { text: '花钱雇船渡河（-25两）', cost: 25, effect: {} },
        { text: '绕山路绕行（精力-30）', cost: 0, effect: { energy: -30 } },
      ],
    },
    {
      id: 'ev_lost',
      icon: '🗺',
      title: '迷路',
      desc: '山路蜿蜒，不知不觉间走错了方向，耽误了不少时辰。',
      choices: [
        { text: '仔细辨认方向，折返重走', cost: 0, effect: { energy: -15 } },
        { text: '随便找人问路', cost: 0, effect: { delay: 1 } },
      ],
    },
    {
      id: 'ev_toll',
      icon: '🚧',
      title: '关卡盘查',
      desc: '官府关卡拦路盘查，守卒态度强硬，要求检查镖箱。',
      choices: [
        { text: '出示文书，配合检查（耗时）', cost: 0, effect: { delay: 1 } },
        { text: '打点守卒（-30两，立刻放行）', cost: 30, effect: {} },
        { text: '凭气势硬闯（需声望≥60）', cost: 0, effect: { repCheck: 60 } },
      ],
    },
    {
      id: 'ev_sick_horse',
      icon: '🐴',
      title: '驮马受伤',
      desc: '载镖的驮马突然腿软跌倒，伤了蹄子，行进速度大减。',
      choices: [
        { text: '就地包扎，慢慢赶路（精力-10）', cost: 0, effect: { energy: -10 } },
        { text: '花银子买匹新马（-60两）', cost: 60, effect: {} },
      ],
    },
  ],

  // ── 战斗遭遇（通用） ──────────────────
  combat: [
    {
      id: 'ev_bandit_small',
      icon: '⚔',
      title: '路遇小贼',
      desc: '几名毛贼拦路，喝道："此路是我开，此树是我栽，要想过此路，留下买路财！"',
      enemyType: 'bandit',
      enemyCount: [1, 3],
      levelOffset: -3,      // 敌人等级 = 玩家等级 + offset
      fleeChance: 0.70,
      choices: [
        { text: '出手教训他们！', action: 'fight' },
        { text: '花钱破财消灾（-50两）', cost: 50, action: 'pay' },
        { text: '声东击西，趁乱逃走', action: 'flee' },
      ],
    },
    {
      id: 'ev_bandit_gang',
      icon: '💀',
      title: '江湖悍匪',
      desc: '一伙凶悍的山贼从林中杀出，领头者抽刀高喊："今日交出镖货，饶你们一命！"',
      enemyType: 'bandit',
      enemyCount: [3, 6],
      levelOffset: 0,
      fleeChance: 0.45,
      choices: [
        { text: '拼死护镖！', action: 'fight' },
        { text: '丢下一半货物换路通行（报酬-50%）', action: 'sacrifice_cargo' },
        { text: '拼命突围逃跑', action: 'flee' },
      ],
    },
    {
      id: 'ev_rival_escort',
      icon: '🗡',
      title: '同行挑衅',
      desc: '对面来了一支同行镖队，领头镖师横眉冷对："这条路是我们的地盘，识趣的回头！"',
      enemyType: 'bandit',
      enemyCount: [2, 4],
      levelOffset: 2,
      fleeChance: 0.60,
      choices: [
        { text: '以武会友，让他们知道厉害', action: 'fight' },
        { text: '好言相劝，共享这条路', cost: 0, action: 'talk', successRep: 40 },
        { text: '绕道而行（精力-20）', cost: 0, action: 'detour' },
      ],
    },
    {
      id: 'ev_assassin',
      icon: '🥷',
      title: '神秘刺客',
      desc: '暗夜中，一道黑影忽然出现，轻声道："有人花重金买你押的镖——连你的命。"',
      enemyType: 'evil',
      enemyCount: [1, 2],
      levelOffset: 3,
      fleeChance: 0.30,
      choices: [
        { text: '绝不退让，迎战！', action: 'fight' },
        { text: '先稳住，套问幕后主使', action: 'talk', successRep: 0, effect: { intel: true } },
        { text: '虚晃一枪，趁机逃走', action: 'flee' },
      ],
    },
    {
      id: 'ev_beast',
      icon: '🐯',
      title: '猛兽拦路',
      desc: '山道中，一头饥饿的猛虎挡住去路，低吼着向你们逼近！',
      enemyType: 'beast',
      enemyCount: [1, 1],
      levelOffset: -2,
      fleeChance: 0.55,
      choices: [
        { text: '挺身搏虎！', action: 'fight' },
        { text: '扔出食物引开猛虎', cost: 0, action: 'distract', successRate: 0.65 },
        { text: '徐徐后退，绕路通过', action: 'flee' },
      ],
    },
  ],

  // ── 地形专属事件 ──────────────────────
  // 沙漠
  desert: [
    {
      id: 'ev_sandstorm',
      icon: '🏜',
      title: '沙尘暴来袭',
      desc: '天际一片昏黄，沙尘暴席卷而来！必须立刻躲避。',
      choices: [
        { text: '就地用布包裹货物，低头硬撑（精力-35）', cost: 0, effect: { energy: -35 } },
        { text: '发现一块巨岩，紧急躲避（耗时+1）', cost: 0, effect: { delay: 1 } },
      ],
    },
    {
      id: 'ev_water_short',
      icon: '💧',
      title: '水源不足',
      desc: '烈日当空，水囊已见底，再走下去恐怕支撑不住。',
      choices: [
        { text: '忍耐脱水前行（精力-40）', cost: 0, effect: { energy: -40 } },
        { text: '折返找绿洲补水（耗时+1）', cost: 0, effect: { delay: 1, energy: 30 } },
      ],
    },
  ],
  // 水乡
  water: [
    {
      id: 'ev_water_bandit',
      icon: '⛵',
      title: '水贼截船',
      desc: '河面上忽然驶来数只快船，船头竖着"劫"字旗！',
      enemyType: 'bandit',
      enemyCount: [2, 4],
      levelOffset: 0,
      fleeChance: 0.40,
      choices: [
        { text: '拔刀应战！', action: 'fight' },
        { text: '加速划桨逃脱', action: 'flee' },
      ],
    },
    {
      id: 'ev_fog',
      icon: '🌫',
      title: '江面大雾',
      desc: '浓雾弥漫，水路几乎看不见前路，行船极其危险。',
      choices: [
        { text: '摸索前行，小心驾船（精力-15）', cost: 0, effect: { energy: -15 } },
        { text: '靠岸等雾散（耗时+1）', cost: 0, effect: { delay: 1 } },
      ],
    },
  ],
  // 山地
  mountain: [
    {
      id: 'ev_rockfall',
      icon: '⛰',
      title: '山石崩落',
      desc: '头顶轰隆一声，山石滚落，险些砸中镖箱！',
      choices: [
        { text: '死护镖箱，以身挡石（精力-25，镖完好）', cost: 0, effect: { energy: -25 } },
        { text: '弃开镖箱，先保性命（镖箱受损，报酬-20%）', cost: 0, effect: { cargoDmg: 0.2 } },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════
   三、存档与状态管理
   ═══════════════════════════════════════════ */
const ESCORT_SAVE_KEY = 'wuxia_escort_data';

function escortLoad(){
  try{
    return JSON.parse(localStorage.getItem(ESCORT_SAVE_KEY) || 'null');
  }catch(e){ return null; }
}
function escortSave(data){
  try{
    localStorage.setItem(ESCORT_SAVE_KEY, JSON.stringify(data));
  }catch(e){}
}
function escortClear(){
  localStorage.removeItem(ESCORT_SAVE_KEY);
}

// 获取玩家等级（兼容主游戏）
function escortGetPlayerLevel(){
  return (typeof edS !== 'undefined' && edS.level) ? edS.level : 1;
}
function escortGetPlayerName(){
  return (typeof edS !== 'undefined' && edS.name) ? edS.name : '侠士';
}
function escortGetSilver(){
  // 使用统一银两管理器
  return getSilver();
}
function escortAddSilver(amount){
  // 使用统一银两管理器
  addSilver(amount);
  SilverManager.save();
}
function escortGetRep(){
  if(typeof travelPlayerState !== 'undefined') return travelPlayerState.reputation ?? 100;
  return 100;
}
function escortAddRep(delta){
  if(typeof travelPlayerState !== 'undefined'){
    travelPlayerState.reputation = Math.max(0, Math.min(200, (travelPlayerState.reputation ?? 100) + delta));
    if(typeof travelSave === 'function') travelSave();
  }
}

/* ═══════════════════════════════════════════
   四、主界面渲染
   ═══════════════════════════════════════════ */
function openEscortGame(fromCityId){
  const existing = escortLoad();
  // 如果已有进行中的押镖，直接恢复
  if(existing && existing.status === 'active'){
    escortRenderJourney(existing);
    return;
  }

  const playerLevel = escortGetPlayerLevel();
  const silver = escortGetSilver();

  // 只显示从当前城镇出发的路线
  const availRoutes = ESCORT_ROUTES.filter(r => playerLevel >= r.minLevel && r.fromCityId === fromCityId);

  const diffStars = d => '⭐'.repeat(d) + '☆'.repeat(4 - d);
  const terrainIcon = { '平原':'🌾', '山地':'⛰', '水乡':'🌊', '沙漠':'🏜', '丘陵':'🌿' };

  const routeCards = availRoutes.map(r => `
    <div class="esc-route-card" onclick="escortAcceptRoute('${r.id}')">
      <div class="esc-route-header">
        <span class="esc-route-terrain">${terrainIcon[r.terrain]||'🗺'} ${r.terrain}</span>
        <span class="esc-route-diff">${diffStars(r.difficulty)}</span>
      </div>
      <div class="esc-route-title">${r.from} → ${r.to}</div>
      <div class="esc-route-cargo">📦 货物：${r.cargo}</div>
      <div class="esc-route-desc">${r.desc}</div>
      <div class="esc-route-footer">
        <span class="esc-reward">💰 ${r.baseReward}两</span>
        <span class="esc-rep">🏅 声望+${r.repReward}</span>
        <span class="esc-segments">🛣 ${r.distance}段路程</span>
      </div>
    </div>
  `).join('');

  const lockedRoutes = ESCORT_ROUTES.filter(r => playerLevel < r.minLevel && r.fromCityId === fromCityId);
  const lockedCards = lockedRoutes.map(r => `
    <div class="esc-route-card esc-route-locked">
      <div class="esc-route-title">🔒 ${r.from} → ${r.to}</div>
      <div class="esc-route-desc" style="color:#888">需要 Lv${r.minLevel}（当前 Lv${playerLevel}）</div>
    </div>
  `).join('');

  const html = `
    <div id="escortGame" class="esc-container">
      <div class="esc-header">
        <div class="esc-title">⚔ 镖局接单</div>
        <div class="esc-subtitle">选择一条镖路，安全护送货物至目的地</div>
        <div class="esc-player-info">
          ${escortGetPlayerName()} · Lv${playerLevel} &nbsp;|&nbsp; 💰 ${silver}两 &nbsp;|&nbsp; 🏅声望${escortGetRep()}
        </div>
      </div>

      <div class="esc-section-title">📋 可接任务</div>
      <div class="esc-route-list">
        ${availRoutes.length ? routeCards : '<div class="esc-empty">你的等级太低，暂无可接镖路。</div>'}
      </div>

      ${lockedRoutes.length ? `
        <div class="esc-section-title" style="margin-top:16px;color:#aaa">🔒 待解锁</div>
        <div class="esc-route-list">${lockedCards}</div>
      ` : ''}

      <button class="esc-btn-back" onclick="escortClose()">← 返回镖局</button>
    </div>
    ${escortGetStyles()}
  `;

  escortShowPanel(html);
}

/* ═══════════════════════════════════════════
   五·零、事件直接触发押镖（随机选当前城市可用路线，跳过接单界面）
   ═══════════════════════════════════════════ */
function escortStartFromEvent(fromCityId){
  // 如果已有进行中的押镖，直接恢复
  const existing = escortLoad();
  if(existing && existing.status === 'active'){
    escortRenderJourney(existing);
    return;
  }

  const playerLevel = escortGetPlayerLevel();
  const energy = (typeof travelPlayerState !== 'undefined') ? (travelPlayerState.energy||100) : 100;

  // 取当前城市等级可接的路线
  const available = ESCORT_ROUTES.filter(r => r.fromCityId === fromCityId && playerLevel >= r.minLevel);

  if(!available.length){
    // 等级不足，回退到普通接单界面（只会显示"等级太低"的提示）
    openEscortGame(fromCityId);
    return;
  }

  if(energy < 20){
    escortAlert('⚡ 精力不足！押镖前请先休息恢复精力（至少需要20点）。');
    return;
  }

  // 按难度权重随机选一条路线（难度低的优先，更符合"路人求援"的语境）
  const weights = available.map(r => Math.max(1, 5 - r.difficulty));
  const totalW = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalW;
  let chosen = available[available.length - 1];
  for(let i = 0; i < available.length; i++){
    rand -= weights[i];
    if(rand <= 0){ chosen = available[i]; break; }
  }

  // 展示一个简短的确认提示，然后直接开始
  if(typeof showToast === 'function') showToast(`⚔ 接受护送：${chosen.from} → ${chosen.to}，出发！`);
  escortAcceptRoute(chosen.id);
}

/* ═══════════════════════════════════════════
   五、接受镖路，开始押镖
   ═══════════════════════════════════════════ */
function escortAcceptRoute(routeId){
  const route = ESCORT_ROUTES.find(r => r.id === routeId);
  if(!route) return;

  const playerLevel = escortGetPlayerLevel();
  const energy = (typeof travelPlayerState !== 'undefined') ? (travelPlayerState.energy||100) : 100;

  if(energy < 20){
    escortAlert('⚡ 精力不足！押镖前请先休息恢复精力（至少需要20点）。');
    return;
  }

  // 创建押镖状态
  const state = {
    status:       'active',
    routeId:      route.id,
    route:        route,
    segment:      0,             // 当前进行到第几段（0-based）
    cargoIntact:  true,          // 货物是否完好
    cargoMult:    1.0,           // 货物报酬系数
    rewardMult:   1.0,           // 最终报酬系数
    log:          [],            // 旅途日志
    startTime:    Date.now(),
    pendingEvent: null,          // 当前待处理事件
  };

  escortSave(state);
  if(typeof SoundFX!=='undefined') SoundFX.play('escort_start');
  escortRenderJourney(state);
}

/* ═══════════════════════════════════════════
   五·五、字符画押镖行进系统
   ═══════════════════════════════════════════ */

/* ── 地形背景配置 ── */
const ESCORT_TERRAIN_ART = {
  '平原': {
    sky: ['  ☀          *  .   ', '   .   ·   * .    ', '         .    *  .'],
    skyColor: 'linear-gradient(180deg,#1a3a5c 0%,#2a6090 40%,#4a8080 100%)',
    bg:  ['  🌾🌾   🌾🌾🌾  🌿  🌾', '🌾🌾🌿  🌾🌾  🌾🌾🌾 🌾', ' 🌾 🌾🌾🌿  🌾  🌾🌾🌾'],
    fg:  ['━━━━━━━━━━━━━━━━━━━━━━', '  ·  ·    ·    ·   '],
    bgColor: 'linear-gradient(180deg,#1a3a20 60%,#2a5030 100%)',
    roadColor: '#8a7050',
    desc: '官道',
  },
  '山地': {
    sky: ['  *   .    *   .    ·', '   ·    *    .   *  ', '      ·  .  *   .  ·'],
    skyColor: 'linear-gradient(180deg,#0d1a2a 0%,#1a3050 40%,#2a4060 100%)',
    bg:  [' ⛰⛰   🌲⛰⛰  🌲⛰⛰⛰', '⛰🌲⛰🌲  ⛰⛰  🌲⛰⛰🌲', '🌲⛰🌲⛰🌲 ⛰🌲⛰🌲⛰🌲'],
    fg:  ['／＼ ／＼ ／＼ ／＼ ／＼ ', '  🌿  🌱   🌿  🌱   🌿'],
    bgColor: 'linear-gradient(180deg,#1a2a0a 60%,#2a3810 100%)',
    roadColor: '#6a5040',
    desc: '山道',
  },
  '水乡': {
    sky: ['   ☁    ☁  ☁    ☁  ☁', '  ☁  ☁    ☁  ☁  ☁  ', '    ☁  ☁☁    ☁☁  ☁  '],
    skyColor: 'linear-gradient(180deg,#1a3050 0%,#2a5080 40%,#3a7090 100%)',
    bg:  [' 🌊🌊🌊  ⛵  🌊🌊🌊⛵🌊', '🌊⛵🌊🌊🌊  🌊🌊⛵🌊🌊🌊', '🌊🌊🌊⛵🌊🌊🌊🌊⛵🌊🌊🌊'],
    fg:  ['≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈', '  🌿  🍀   🌿  🍀   🌿'],
    bgColor: 'linear-gradient(180deg,#0a2a3a 60%,#0a3a4a 100%)',
    roadColor: '#3a6070',
    desc: '水路',
  },
  '沙漠': {
    sky: ['  ☀              ·  ', '      · .    .      ', '   .        .    ·  '],
    skyColor: 'linear-gradient(180deg,#3a2800 0%,#6a4800 40%,#8a6020 100%)',
    bg:  ['  🏜    🌵  🏜🌵   🏜 ', '🏜🌵🏜   🏜🏜  🌵🏜🏜  ', ' 🏜🏜🌵🏜  🏜🌵🏜🏜🌵🏜'],
    fg:  ['∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿', '   ·    ·     ·    ·'],
    bgColor: 'linear-gradient(180deg,#4a3010 60%,#6a4820 100%)',
    roadColor: '#c09060',
    desc: '沙路',
  },
  '丘陵': {
    sky: ['   ☁  *  ☁   *  ☁   ', ' *  ☁   *  ☁  *  ☁  ', '  ☁  *  ☁  *   ☁  * '],
    skyColor: 'linear-gradient(180deg,#1a2a40 0%,#2a4a70 40%,#3a6060 100%)',
    bg:  [' 🌿🌾  🌳🌿  🌾🌳  🌿🌾', '🌳🌿🌾🌳  🌿🌾🌳🌿  🌾🌳', ' 🌾🌳🌿🌾🌳  🌾🌳🌿🌾🌳'],
    fg:  ['～～～～～～～～～～～～～～～～', '  🌱  🌿   🌱  🌿   🌱'],
    bgColor: 'linear-gradient(180deg,#1a2a10 60%,#2a3a18 100%)',
    roadColor: '#7a6048',
    desc: '丘道',
  },
};

/* ── 队伍字符画 ── */
// 镖车
const ESCORT_CART_ART = [
  ' ╔═══╗',
  ' ║📦 ║',
  '─╚═══╝─',
  '  ●   ●',
];
// 随从（持枪护卫）
const ESCORT_GUARD_ART = [
  ' \\O/',
  '──┼──',
  ' / \\',
];
// 马（驮马）
const ESCORT_HORSE_ART = [
  ' ,\\',
  '(  )',
  '/  \\',
];

/* ── 玩家字符画（从 edS 读取 part 构建，兼容简单模式）── */
function _escortGetPlayerArt(){
  // 尝试读取捏脸数据
  if(typeof edS !== 'undefined' && edS.parts && typeof buildNpcPartsHtml === 'function'){
    // 简化：构建3行字符画
    const head = edS.parts.head || '😐';
    const body = edS.parts.body || '┼';
    return [`  ${head}  `, ' ─┼── ', '  Λ  '];
  }
  // 默认侠客
  return ['  😤 ', '─╋───', ' / \\'];
}

/* ── 镖车+队伍 HTML 字符画（使用等宽CSS布局）── */
function _escortBuildConvoyHtml(terrain, segment, total){
  const pct = total > 0 ? Math.round((segment / total) * 100) : 0;
  const art  = ESCORT_TERRAIN_ART[terrain] || ESCORT_TERRAIN_ART['平原'];
  const playerLines = _escortGetPlayerArt();

  // 队伍：前卫（随从1）+ 玩家 + 镖车（马） + 后卫（随从2）
  // 用HTML div + 绝对定位实现横排
  return `
    <div class="esc-stage" id="escStage">
      <!-- 天空 -->
      <div class="esc-sky" id="escSky" style="background:${art.skyColor}">
        <div class="esc-sky-text" id="escSkyText">${art.sky[0]}</div>
      </div>
      <!-- 背景（远景滚动）-->
      <div class="esc-bg" id="escBg" style="background:${art.bgColor}">
        <div class="esc-bg-scroll" id="escBgScroll">
          <span>${art.bg[0]}&nbsp;&nbsp;${art.bg[0]}&nbsp;&nbsp;</span>
        </div>
        <div class="esc-bg-scroll esc-bg-scroll2" id="escBgScroll2">
          <span>${art.bg[1]}&nbsp;&nbsp;${art.bg[1]}&nbsp;&nbsp;</span>
        </div>
      </div>
      <!-- 地面+道路 -->
      <div class="esc-road" id="escRoad" style="background:${art.roadColor}">
        <div class="esc-road-scroll" id="escRoadScroll">
          <span>${art.fg[0].repeat(4)}</span>
        </div>
      </div>
      <!-- 队伍（字符画人物，横排） -->
      <div class="esc-convoy" id="escConvoy">
        <!-- 前卫 -->
        <div class="esc-unit esc-guard-front" id="escGuardFront">
          <pre class="esc-ascii">${ESCORT_GUARD_ART.join('\n')}</pre>
          <div class="esc-unit-label">护卫</div>
        </div>
        <!-- 玩家 -->
        <div class="esc-unit esc-player-unit" id="escPlayerUnit">
          <pre class="esc-ascii esc-player-ascii">${playerLines.join('\n')}</pre>
          <div class="esc-unit-label" style="color:#f0d060">${escortGetPlayerName()}</div>
        </div>
        <!-- 镖马 + 镖车 -->
        <div class="esc-cart-wrap" id="escCartWrap">
          <pre class="esc-ascii esc-horse-ascii">${ESCORT_HORSE_ART.join('\n')}</pre>
          <pre class="esc-ascii esc-cart-ascii">${ESCORT_CART_ART.join('\n')}</pre>
        </div>
        <!-- 后卫 -->
        <div class="esc-unit esc-guard-rear" id="escGuardRear">
          <pre class="esc-ascii">${ESCORT_GUARD_ART.join('\n')}</pre>
          <div class="esc-unit-label">护卫</div>
        </div>
      </div>
      <!-- 路程标注 -->
      <div class="esc-convoy-label" id="escConvoyLabel">
        <span id="escSegLabel">${segment > 0 ? `第${segment}段` : '出发'}</span>
        <span style="color:#a0c080;margin-left:8px">${art.desc}</span>
        <span style="color:#f0d060;margin-left:8px">${pct}%</span>
      </div>
    </div>
  `;
}

/* ── 行进动画（自动播放，onDone后回调）── */
let _escConvoyTimer = null;

function _escortStartMarch(terrain, onDone){
  const escStage = document.getElementById('escStage');
  if(!escStage){ onDone && onDone(); return; }

  const art = ESCORT_TERRAIN_ART[terrain] || ESCORT_TERRAIN_ART['平原'];
  let frame = 0;

  // 背景滚动（CSS动画已写好，JS只驱动天空文字切换）
  function skyTick(){
    const skytxt = document.getElementById('escSkyText');
    if(skytxt) skytxt.textContent = art.sky[frame % art.sky.length];
    frame++;
  }
  const skyTimer = setInterval(skyTick, 600);

  // 人物行走摆动（给convoy加class触发CSS animation）
  const convoy = document.getElementById('escConvoy');
  if(convoy) convoy.classList.add('esc-marching');

  // 1.8s后完成
  _escConvoyTimer = setTimeout(()=>{
    clearInterval(skyTimer);
    if(convoy) convoy.classList.remove('esc-marching');
    onDone && onDone();
  }, 1800);
}

function _escortStopMarch(){
  if(_escConvoyTimer){ clearTimeout(_escConvoyTimer); _escConvoyTimer = null; }
  const convoy = document.getElementById('escConvoy');
  if(convoy) convoy.classList.remove('esc-marching');
}

/* ── 押镖字符画全屏overlay（行进动画主场景）── */
function escortShowMarchOverlay(state, onDone){
  const route = ESCORT_ROUTES.find(r => r.id === state.routeId);
  if(!route){ onDone && onDone(); return; }

  // 移除旧overlay
  const old = document.getElementById('escortMarchOverlay');
  if(old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'escortMarchOverlay';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9250;
    background:#0a0806;
    display:flex; flex-direction:column;
    align-items:center; justify-content:flex-start;
    overflow:hidden;
  `;

  const convoyHtml = _escortBuildConvoyHtml(route.terrain, state.segment, route.distance);

  overlay.innerHTML = `
    <div class="esc-march-topbar">
      <span style="color:#f0c060;font-weight:bold">${route.from} → ${route.to}</span>
      <span style="color:#a08050;font-size:11px;margin-left:8px">📦 ${route.cargo}</span>
      <button id="escSkipBtn" style="
        margin-left:auto;padding:4px 14px;
        background:rgba(0,0,0,.4);border:1px solid rgba(80,120,80,.4);
        color:rgba(160,200,140,.6);border-radius:4px;
        cursor:pointer;font-size:11px;
      ">快进 ▶</button>
    </div>
    ${convoyHtml}
    ${escortGetMarchStyles()}
  `;

  document.body.appendChild(overlay);

  // 快进按钮
  document.getElementById('escSkipBtn').onclick = ()=>{
    _escortStopMarch();
    overlay.remove();
    onDone && onDone();
  };

  // 启动行进动画
  _escortStartMarch(route.terrain, ()=>{
    overlay.remove();
    onDone && onDone();
  });
}

function escortGetMarchStyles(){
  return `
  <style id="escMarchStyles">
  .esc-march-topbar {
    width:100%; max-width:520px;
    display:flex; align-items:center;
    padding:10px 14px 8px;
    background:rgba(10,8,4,.8);
    border-bottom:1px solid rgba(120,80,30,.4);
    font-size:13px; color:#c0a060;
    flex-shrink:0;
  }
  .esc-stage {
    width:100%; max-width:520px;
    position:relative;
    display:flex; flex-direction:column;
    overflow:hidden;
  }
  .esc-sky {
    height:60px; width:100%;
    display:flex; align-items:center;
    padding:0 8px;
    flex-shrink:0; overflow:hidden;
  }
  .esc-sky-text {
    font-family:'Courier New',monospace;
    font-size:13px; color:rgba(220,240,255,.7);
    white-space:pre; letter-spacing:1px;
    transition: opacity 0.4s;
  }
  .esc-bg {
    height:80px; width:100%;
    overflow:hidden; position:relative;
    flex-shrink:0;
  }
  .esc-bg-scroll {
    position:absolute; top:8px; left:0;
    white-space:nowrap;
    font-size:20px; line-height:1;
    animation: esc-scroll-bg 4s linear infinite;
  }
  .esc-bg-scroll2 {
    top:36px;
    animation: esc-scroll-bg 5.5s linear infinite reverse;
  }
  @keyframes esc-scroll-bg {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .esc-road {
    height:30px; width:100%;
    overflow:hidden; flex-shrink:0;
    position:relative;
    border-top:2px solid rgba(255,220,120,.25);
  }
  .esc-road-scroll {
    position:absolute; top:6px; left:0;
    white-space:nowrap;
    font-family:'Courier New',monospace;
    font-size:13px; color:rgba(255,230,150,.5);
    letter-spacing:2px;
    animation: esc-scroll-road 1.2s linear infinite;
  }
  @keyframes esc-scroll-road {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-28px); }
  }
  /* 队伍容器 */
  .esc-convoy {
    display:flex; align-items:flex-end; justify-content:center;
    gap:8px;
    padding:10px 8px 4px;
    background:rgba(10,8,4,.6);
    min-height:90px;
  }
  .esc-unit {
    display:flex; flex-direction:column; align-items:center;
  }
  .esc-ascii {
    font-family:'Courier New',monospace;
    font-size:13px; line-height:1.3;
    color:#d0c090; margin:0; padding:0;
    text-align:center;
    white-space:pre;
  }
  .esc-player-ascii { color:#f0e060; }
  .esc-horse-ascii  { color:#c0a060; font-size:11px; }
  .esc-cart-ascii   { color:#e0c080; font-size:12px; }
  .esc-cart-wrap {
    display:flex; flex-direction:column; align-items:center;
    gap:0;
  }
  .esc-unit-label {
    font-size:10px; color:#806040; margin-top:2px;
    font-family:sans-serif;
  }
  /* 行走摆动动画 */
  @keyframes esc-walk-bob {
    0%,100%{ transform:translateY(0); }
    50%    { transform:translateY(-3px); }
  }
  @keyframes esc-cart-shake {
    0%,100%{ transform:translateX(0) rotate(0deg); }
    25%    { transform:translateX(-1px) rotate(-0.5deg); }
    75%    { transform:translateX(1px) rotate(0.5deg); }
  }
  .esc-marching .esc-unit {
    animation: esc-walk-bob 0.4s ease-in-out infinite;
  }
  .esc-marching .esc-guard-rear {
    animation-delay: 0.1s;
  }
  .esc-marching .esc-guard-front {
    animation-delay: 0.2s;
  }
  .esc-marching .esc-cart-wrap {
    animation: esc-cart-shake 0.35s ease-in-out infinite;
  }
  /* 路程标注 */
  .esc-convoy-label {
    text-align:center;
    padding:6px 14px;
    font-size:12px; color:#a08050;
    font-family:sans-serif;
    background:rgba(10,6,2,.7);
    border-top:1px solid rgba(100,70,30,.3);
  }
  </style>
  `;
}


function escortRenderJourney(state){
  const route = state.route || ESCORT_ROUTES.find(r => r.id === state.routeId);
  if(!route){ escortClose(); return; }

  const progress = state.segment;
  const total    = route.distance;
  const pct      = Math.round((progress / total) * 100);

  // ── 字符画地形背景 ──
  const art = ESCORT_TERRAIN_ART[route.terrain] || ESCORT_TERRAIN_ART['平原'];

  // 路段进度可视化（文字地图）
  const segNodes = Array.from({ length: total + 1 }, (_, i) => {
    if(i < progress)        return `<span style="color:#80d080">✓</span>`;
    else if(i === progress) return `<span style="color:#f0a040;animation:esc-pulse 1s infinite">⬤</span>`;
    else                    return `<span style="color:#504030">○</span>`;
  }).join(`<span style="color:#5a3a18">─</span>`);

  // 旅途日志（最近5条）
  const logHtml = state.log.slice(-5).map(l =>
    `<div class="esc-log-item ${l.type||''}">${l.icon||'▸'} ${l.text}</div>`
  ).join('');

  const energy = (typeof travelPlayerState !== 'undefined') ? (travelPlayerState.energy||100) : 100;
  const silver = escortGetSilver();
  const estReward = Math.round(route.baseReward * state.rewardMult * state.cargoMult);

  const html = `
    <div id="escortGame" class="esc-container">
      <div class="esc-header">
        <div class="esc-title">⚔ 押镖进行中</div>
        <div class="esc-route-info">${route.from} <span style="color:#f0a040">→</span> ${route.to} &nbsp;|&nbsp; 📦 ${route.cargo}</div>
      </div>

      <!-- 字符画舞台（迷你预览）-->
      <div class="esc-mini-stage" style="background:${art.bgColor}">
        <div class="esc-mini-bg" style="font-size:15px;opacity:0.55;white-space:nowrap;overflow:hidden;padding:4px 8px 0;letter-spacing:2px">
          ${art.bg[progress % art.bg.length]}
        </div>
        <div class="esc-mini-convoy">
          <span class="esc-mini-unit" title="护卫">⚔</span>
          <span class="esc-mini-player" title="${escortGetPlayerName()}" style="color:#f0e060;font-weight:bold">😤</span>
          <span class="esc-mini-cart" title="镖车">🐴📦🐴</span>
          <span class="esc-mini-unit" title="护卫">⚔</span>
        </div>
        <div class="esc-mini-road" style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,220,120,.35);padding:0 8px 4px;overflow:hidden">
          ${art.fg[0]}
        </div>
        <div class="esc-mini-road-label" style="background:${art.roadColor}20;padding:2px 8px;font-size:11px;color:#a08050">
          ${art.desc}·${progress > 0 ? `第${progress}/${total}段` : '出发'}&nbsp;
          <span style="color:#f0a040">${pct}%</span>
        </div>
      </div>

      <!-- 路程节点进度 -->
      <div class="esc-progress-area">
        <div class="esc-progress-label" style="text-align:center;letter-spacing:2px">
          <span style="color:#a08050;font-size:11px">${route.from}</span>
          <span style="margin:0 4px">${segNodes}</span>
          <span style="color:#a08050;font-size:11px">${route.to}</span>
        </div>
        <div class="esc-progress-bar-wrap">
          <div class="esc-progress-bar" style="width:${pct}%"></div>
        </div>
      </div>

      <!-- 状态栏 -->
      <div class="esc-status-bar">
        <span>⚡ ${energy}%</span>
        <span>💰 ${silver}两</span>
        <span>📦 货物：${state.cargoIntact ? (state.cargoMult >= 1 ? '✅完好' : `⚠️${Math.round(state.cargoMult*100)}%`) : '❌损毁'}</span>
        <span>🏅 预估报酬：${estReward}两</span>
      </div>

      <!-- 旅途日志 -->
      ${state.log.length ? `
        <div class="esc-log-wrap">
          <div class="esc-log-title">旅途见闻</div>
          ${logHtml}
        </div>
      ` : ''}

      <!-- 待处理事件 -->
      ${state.pendingEvent ? escortRenderEvent(state) : ''}

      <!-- 行动按钮 -->
      ${!state.pendingEvent ? `
        <div class="esc-actions">
          ${progress < total
            ? `<button class="esc-btn-main" onclick="escortAdvance()">🚶 启程（第${progress+1}/${total}段）</button>`
            : `<button class="esc-btn-main esc-btn-finish" onclick="escortFinish()">🏁 抵达 ${route.to}，领取报酬！</button>`
          }
          <button class="esc-btn-abandon" onclick="escortAbandon()">🚩 放弃押镖</button>
        </div>
      ` : ''}
    </div>
    ${escortGetStyles()}
  `;

  escortShowPanel(html);
}


/* ═══════════════════════════════════════════
   七、推进路段，生成事件
   ═══════════════════════════════════════════ */
function escortAdvance(){
  let state = escortLoad();
  if(!state || state.status !== 'active') return;

  const route = ESCORT_ROUTES.find(r => r.id === state.routeId);
  if(!route) return;

  state.segment++;

  // 生成本段事件
  const event = escortRollEvent(route, state);
  if(event){
    state.pendingEvent = event;
    state.log.push({ icon: event.icon||'❗', text: `遭遇：${event.title}`, type:'event' });
    if(typeof SoundFX!=='undefined') SoundFX.play('escort_ambush');
  } else {
    state.log.push({ icon:'🛤', text:`平安度过第${state.segment}段路程。`, type:'safe' });
  }

  escortSave(state);

  // ── 先播放行进动画，再展示界面 ──
  const savedState = state;
  escortShowMarchOverlay(savedState, ()=>{
    escortRenderJourney(savedState);
  });
}

function escortRollEvent(route, state){
  // ═══════════════════════════════════════════════
  // 护镖"将将胡"系统 - 特殊事件
  // ═══════════════════════════════════════════════
  const luckRoll = Math.random();
  
  // 2%概率：镖车损坏（随机路段，修理费或报酬减少）
  if(luckRoll < 0.02){
    return {
      id: 'ev_cart_broken',
      icon: '🛠️',
      title: '镖车损坏',
      desc: '镖车车轮突然断裂，货物散落一地！必须停下来修理。',
      choices: [
        { text: '花钱修理（-40两，货物完好）', cost: 40, effect: {} },
        { text: '凑合修补（货物受损，报酬-15%）', cost: 0, effect: { cargoDmg: 0.15 } },
      ],
    };
  }
  // 1.5%概率：镖师叛变（战斗难度增加或损失银两）
  else if(luckRoll < 0.035){
    return {
      id: 'ev_guard_betray',
      icon: '🔪',
      title: '镖师叛变',
      desc: '一名护卫突然拔刀相向！原来他是内应，一直在等这个机会！',
      enemyType: 'bandit',
      enemyCount: [2, 3],
      levelOffset: 2,
      fleeChance: 0.30,
      choices: [
        { text: '清理门户！', action: 'fight' },
        { text: '许以重利收买（-60两）', cost: 60, action: 'pay' },
        { text: '趁乱逃跑', action: 'flee' },
      ],
    };
  }
  // 2%概率：意外横财（发现遗失的贵重货物）
  else if(luckRoll < 0.055){
    return {
      id: 'ev_lucky_find',
      icon: '💎',
      title: '意外横财',
      desc: '路边发现一辆翻倒的货车，货主已不见踪影，留下一箱珍贵货物！',
      choices: [
        { text: '据为己有（+80~150两，道德-？）', cost: 0, effect: { silver: [80, 150] } },
        { text: '交给镖局处理（+30两，声望+5）', cost: 0, effect: { silver: [30, 30], rep: 5 } },
      ],
    };
  }
  // 1%概率：神秘贵人（获得额外帮助或奖励）
  else if(luckRoll < 0.065){
    return {
      id: 'ev_mysterious_help',
      icon: '🎭',
      title: '神秘贵人',
      desc: '一位蒙面侠客突然出现，留下一句"此镖我保了"便消失不见，你感到一股暖流涌入体内。',
      choices: [
        { text: '接受馈赠（精力+50，下一场战斗必胜）', cost: 0, effect: { energy: 50, blessed: true } },
      ],
    };
  }

  // 先看是否触发战斗事件
  const hasCombat = Math.random() < route.dangerRate;

  // 地形专属池
  const terrainKey = { '沙漠':'desert', '水乡':'water', '山地':'mountain' }[route.terrain];
  const terrainPool = terrainKey ? (ESCORT_EVENTS[terrainKey] || []) : [];

  if(hasCombat){
    const pool = [...ESCORT_EVENTS.combat];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 30%好事，30%中性，15%地形专属
  const r = Math.random();
  if(r < 0.30){
    const pool = ESCORT_EVENTS.good;
    return pool[Math.floor(Math.random() * pool.length)];
  } else if(r < 0.60){
    const pool = ESCORT_EVENTS.neutral;
    return pool[Math.floor(Math.random() * pool.length)];
  } else if(r < 0.75 && terrainPool.length){
    return terrainPool[Math.floor(Math.random() * terrainPool.length)];
  }
  // 25%无事发生
  return null;
}

/* ═══════════════════════════════════════════
   八、事件渲染
   ═══════════════════════════════════════════ */
function escortRenderEvent(state){
  const ev = state.pendingEvent;
  if(!ev) return '';

  const choicesHtml = ev.choices.map((c, i) => `
    <button class="esc-choice-btn" onclick="escortChoose(${i})">${c.text}</button>
  `).join('');

  return `
    <div class="esc-event-box">
      <div class="esc-event-icon">${ev.icon || '❗'}</div>
      <div class="esc-event-title">${ev.title}</div>
      <div class="esc-event-desc">${ev.desc}</div>
      <div class="esc-choices">${choicesHtml}</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   九、处理玩家选择
   ═══════════════════════════════════════════ */
function escortChoose(choiceIdx){
  let state = escortLoad();
  if(!state || !state.pendingEvent) return;

  const ev     = state.pendingEvent;
  const choice = ev.choices[choiceIdx];
  if(!choice) return;

  const playerLevel = escortGetPlayerLevel();
  const silver      = escortGetSilver();

  // ── 扣钱检查 ──
  if(choice.cost && choice.cost > 0){
    if(silver < choice.cost){
      escortAlert(`💰 银两不足！此选项需要 ${choice.cost} 两，你只有 ${silver} 两。`);
      return;
    }
    escortAddSilver(-choice.cost);
    state.log.push({ icon:'💸', text:`花费 ${choice.cost} 两。`, type:'cost' });
  }

  // ── action 分类处理 ──
  const action = choice.action || 'none';

  if(action === 'fight'){
    // 转入战斗（简化版：用数值博弈模拟）
    if(typeof SoundFX!=='undefined') SoundFX.play('escort_fight');
    escortResolveCombat(state, ev, choice);
    return;
  }
  if(action === 'flee'){
    const success = Math.random() < (ev.fleeChance || 0.5);
    if(success){
      state.log.push({ icon:'💨', text:'成功脱身，虚惊一场。', type:'good' });
    } else {
      // 逃跑失败，被迫战斗，属性略有损失
      state.log.push({ icon:'😓', text:'逃跑失败！被迫应战。', type:'bad' });
      escortResolveCombat(state, ev, choice, true);
      return;
    }
    state.pendingEvent = null;
    escortSave(state);
    escortRenderJourney(state);
    return;
  }
  if(action === 'sacrifice_cargo'){
    state.cargoMult = Math.max(0, state.cargoMult - 0.5);
    state.log.push({ icon:'📦', text:'丢下部分货物，匪徒散去。报酬减半。', type:'bad' });
    state.pendingEvent = null;
    escortSave(state);
    escortRenderJourney(state);
    return;
  }
  if(action === 'talk'){
    const rep = escortGetRep();
    const repCheck = choice.successRep || 0;
    const success = rep >= repCheck || Math.random() < 0.5;
    if(success){
      state.log.push({ icon:'🗣', text:'好言相劝，对方放行。', type:'good' });
      if(choice.effect?.intel) state.log.push({ icon:'📜', text:'得知幕后主使线索。', type:'good' });
    } else {
      state.log.push({ icon:'😤', text:'对方不吃这套，只能硬打！', type:'bad' });
      escortResolveCombat(state, ev, choice, false);
      return;
    }
    state.pendingEvent = null;
    escortSave(state);
    escortRenderJourney(state);
    return;
  }
  if(action === 'detour'){
    if(typeof travelPlayerState !== 'undefined'){
      travelPlayerState.energy = Math.max(0, (travelPlayerState.energy||100) - 20);
      if(typeof travelSave === 'function') travelSave();
    }
    state.log.push({ icon:'🔄', text:'绕道而行，精力-20，安全通过。', type:'neutral' });
    state.pendingEvent = null;
    escortSave(state);
    escortRenderJourney(state);
    return;
  }
  if(action === 'distract'){
    const success = Math.random() < (choice.successRate || 0.6);
    if(success){
      state.log.push({ icon:'🍖', text:'食物引开猛兽，化险为夷！', type:'good' });
    } else {
      state.log.push({ icon:'🐯', text:'猛兽不为所动，只能迎战！', type:'bad' });
      escortResolveCombat(state, ev, choice, false);
      return;
    }
    state.pendingEvent = null;
    escortSave(state);
    escortRenderJourney(state);
    return;
  }
  if(action === 'pay'){
    state.log.push({ icon:'💰', text:'破财消灾，匪徒拿了钱离去。', type:'neutral' });
    state.pendingEvent = null;
    escortSave(state);
    escortRenderJourney(state);
    return;
  }

  // ── 普通效果处理（无战斗） ──
  if(choice.effect){
    const eff = choice.effect;

    // 精力
    if(eff.energy && typeof travelPlayerState !== 'undefined'){
      travelPlayerState.energy = Math.max(0, Math.min(100, (travelPlayerState.energy||100) + eff.energy));
      if(typeof travelSave === 'function') travelSave();
      if(eff.energy > 0) state.log.push({ icon:'⚡', text:`精力+${eff.energy}。`, type:'good' });
      else               state.log.push({ icon:'😓', text:`精力${eff.energy}。`, type:'bad' });
    }

    // 银两随机
    if(eff.silver){
      const amt = Array.isArray(eff.silver)
        ? (eff.silver[0] + Math.floor(Math.random() * (eff.silver[1] - eff.silver[0] + 1)))
        : eff.silver;
      escortAddSilver(amt);
      state.log.push({ icon:'💰', text:`获得 ${amt} 两。`, type:'good' });
    }

    // 经验
    if(eff.exp && typeof addPlayerExp === 'function'){
      addPlayerExp(eff.exp);
      state.log.push({ icon:'✨', text:`获得 ${eff.exp} 点经验。`, type:'good' });
    }

    // 声望
    if(eff.rep) escortAddRep(eff.rep);

    // 延误（仅作记录，不影响进度）
    if(eff.delay) state.log.push({ icon:'⏳', text:'耽误了些时间。', type:'neutral' });

    // 货物损坏
    if(eff.cargoDmg){
      state.cargoMult = Math.max(0, state.cargoMult - eff.cargoDmg);
      state.log.push({ icon:'📦', text:`货物受损，报酬减少 ${Math.round(eff.cargoDmg*100)}%。`, type:'bad' });
    }

    // 声望检查
    if(eff.repCheck){
      const rep = escortGetRep();
      if(rep >= eff.repCheck){
        state.log.push({ icon:'🏅', text:'声望足够，守卒放行。', type:'good' });
      } else {
        // 硬闯失败，变普通过关（耗时）
        state.log.push({ icon:'😣', text:`声望不够（需${eff.repCheck}），被拦下盘查，耽误时间。`, type:'bad' });
      }
    }
  }

  state.pendingEvent = null;
  escortSave(state);
  escortRenderJourney(state);
}

/* ═══════════════════════════════════════════
   十、战斗结算（简化版数值博弈）
   ═══════════════════════════════════════════ */
function escortResolveCombat(state, ev, choice, forced){
  const playerLevel  = escortGetPlayerLevel();
  const enemyLevel   = Math.max(1, playerLevel + (ev.levelOffset || 0));
  const enemyCount   = ev.enemyCount
    ? ev.enemyCount[0] + Math.floor(Math.random() * (ev.enemyCount[1] - ev.enemyCount[0] + 1))
    : 1;

  // 战斗力评分（简化：玩家实力 vs 敌方总量）
  const playerPower  = playerLevel * 10 + (escortGetRep() * 0.1);
  const enemyPower   = enemyLevel * 10 * Math.sqrt(enemyCount);

  // 胜率：玩家强时高，敌方多时低
  const ratio        = playerPower / (playerPower + enemyPower);
  const winChance    = Math.max(0.15, Math.min(0.90, ratio * 1.3));
  
  // ═══════════════════════════════════════════════
  // 护镖战斗"将将胡"系统
  // ═══════════════════════════════════════════════
  const combatLuck = Math.random();
  let specialCombat = null;
  
  // 3%概率：绝境反击（濒死时自动触发，反败为胜）
  if(combatLuck < 0.03){
    specialCombat = 'comeback';
  }
  // 2%概率：以一当十（战斗胜利后获得双倍声望）
  else if(combatLuck < 0.05){
    specialCombat = 'heroic';
  }
  // 2%概率：误伤（战斗胜利但货物受损）
  else if(combatLuck < 0.07){
    specialCombat = 'accident';
  }

  const win          = Math.random() < winChance || specialCombat === 'comeback';

  const enemyDesc    = `${enemyCount}名敌人（约Lv${enemyLevel}）`;

  if(win){
    // 胜利：银两奖励 + 少量精力消耗
    if(typeof SoundFX!=='undefined') SoundFX.play('escort_fight');
    const loot = Math.round(enemyCount * enemyLevel * (3 + Math.random()*4));
    escortAddSilver(loot);
    const energyCost = 10 + Math.floor(Math.random() * 15);
    if(typeof travelPlayerState !== 'undefined'){
      travelPlayerState.energy = Math.max(5, (travelPlayerState.energy||100) - energyCost);
      if(typeof travelSave === 'function') travelSave();
    }
    
    // 特殊战斗结果
    if(specialCombat === 'comeback'){
      escortAddRep(5);
      state.log.push({ icon:'🔥', text:`绝境反击！击败${enemyDesc}！缴获 ${loot} 两，声望+5，精力-${energyCost}！`, type:'good' });
      showToast('🔥 绝境反击！生死关头爆发出惊人战力！', 'legendary');
    }
    else if(specialCombat === 'heroic'){
      escortAddRep(4);
      state.log.push({ icon:'⚔', text:`以一当十！击败${enemyDesc}！缴获 ${loot} 两，声望+4，精力-${energyCost}！`, type:'good' });
      showToast('⚔ 以一当十！威名远播！', 'rare');
    }
    else if(specialCombat === 'accident'){
      state.cargoMult = Math.max(0.3, state.cargoMult - 0.1);
      escortAddRep(2);
      state.log.push({ icon:'⚔', text:`击败${enemyDesc}！缴获 ${loot} 两，声望+2，精力-${energyCost}。但战斗中误伤货物…`, type:'neutral' });
    }
    else {
      escortAddRep(2);
      state.log.push({ icon:'⚔', text:`击败${enemyDesc}！缴获 ${loot} 两，声望+2，精力-${energyCost}。`, type:'good' });
    }
  } else {
    // 失败：货物受损 + 较多精力损失 + 少量银两被抢
    if(typeof SoundFX!=='undefined') SoundFX.play('escort_fail');
    const stolen = Math.min(escortGetSilver(), Math.round(enemyLevel * enemyCount * 2));
    if(stolen > 0) escortAddSilver(-stolen);
    const energyCost = 25 + Math.floor(Math.random() * 20);
    if(typeof travelPlayerState !== 'undefined'){
      travelPlayerState.energy = Math.max(5, (travelPlayerState.energy||100) - energyCost);
      if(typeof travelSave === 'function') travelSave();
    }
    state.cargoMult = Math.max(0.2, state.cargoMult - 0.2);
    escortAddRep(-3);
    state.log.push({ icon:'💥', text:`不敌${enemyDesc}，损失 ${stolen} 两，货物受损，精力-${energyCost}，声望-3。`, type:'bad' });

    // 精力耗尽检查
    const curEnergy = (typeof travelPlayerState !== 'undefined') ? (travelPlayerState.energy||0) : 0;
    if(curEnergy <= 5){
      state.log.push({ icon:'😵', text:'精力耗尽，难以为继……押镖失败。', type:'bad' });
      state.pendingEvent = null;
      state.status = 'failed';
      escortSave(state);
      escortShowResult(state, false, '精力耗尽，无力护送货物抵达。');
      return;
    }
  }

  state.pendingEvent = null;
  escortSave(state);
  escortRenderJourney(state);
}

/* ═══════════════════════════════════════════
   十一、结算
   ═══════════════════════════════════════════ */
function escortFinish(){
  let state = escortLoad();
  if(!state) return;

  const route = ESCORT_ROUTES.find(r => r.id === state.routeId);
  if(!route) return;

  // 货物完好度影响最终报酬
  const finalReward  = Math.round(route.baseReward * state.rewardMult * state.cargoMult);
  const repReward    = Math.round(route.repReward  * state.cargoMult);
  const expReward    = Math.round(route.minLevel * 8 * (1 + (route.difficulty - 1) * 0.3));

  escortAddSilver(finalReward);
  escortAddRep(repReward);
  if(typeof addPlayerExp === 'function') addPlayerExp(expReward);

  state.status = 'done';
  escortSave(state);

  // ── 更新玩家位置 ──
  const destCityId = route.toCityId;
  if(destCityId){
    travelCurrentCity = destCityId;
    // 记录足迹（travelHistory 在 travel.js 中已声明为全局 var）
    if(Array.isArray(travelHistory)){
      // 去重后追加到历史
      travelHistory = travelHistory.filter(id => id !== destCityId);
      travelHistory.unshift(destCityId);
      if(travelHistory.length > 10) travelHistory.length = 10;
    }
    if(typeof travelSave === 'function') travelSave();
  }

  // ── 推进游戏天数（武侠日历系统）──
  const daysElapsed = route.travelDays || route.distance * 2;
  if(typeof edS !== 'undefined' && typeof advanceWuxiaDate === 'function'){
    advanceWuxiaDate(edS, daysElapsed);
    try{ localStorage.setItem('wuxia_editor', JSON.stringify(edS)); }catch(e){}
  }

  const cargoStatus = state.cargoMult >= 1.0
    ? '📦 货物完好无损！'
    : `📦 货物完整度 ${Math.round(state.cargoMult * 100)}%`;

  // ── 到达动画 → 结算界面 ──
  if(typeof SoundFX!=='undefined') SoundFX.play('escort_arrive');

  // ── 任务钩子：押镖成功，检查护送类任务进度 ──
  if(typeof onEscortQuestCheck === 'function'){
    onEscortQuestCheck(state.routeId, route.terrain);
  }

  escortShowArrivalOverlay(route, ()=>{
    escortShowResult(state, true, '', {
      reward: finalReward,
      rep: repReward,
      exp: expReward,
      cargoStatus,
      logCount: state.log.length,
      destCityId,
      daysElapsed,
    });
  });
}

/* ── 抵达城市字符画动画 ── */
function escortShowArrivalOverlay(route, onDone){
  const old = document.getElementById('escortMarchOverlay');
  if(old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'escortMarchOverlay';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9250;
    background:#0a0806;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    overflow:hidden;
  `;

  const destNode = (typeof WORLD_NODES !== 'undefined' && route.toCityId) ? WORLD_NODES[route.toCityId] : null;
  const cityIcon = destNode ? destNode.icon : '🏙';
  const cityName = destNode ? destNode.name : route.to;

  overlay.innerHTML = `
    <div style="text-align:center;padding:20px;">
      <div style="font-size:40px;margin-bottom:10px;animation:esc-arrive-bounce 0.6s ease-out">${cityIcon}</div>
      <div style="font-size:22px;color:#f0d060;font-weight:bold;letter-spacing:3px">${cityName}</div>
      <div style="font-size:13px;color:#a08050;margin-top:6px">押镖队伍安全抵达</div>
      <div style="margin-top:14px;font-family:'Courier New',monospace;font-size:12px;color:#80a060;line-height:1.8">
        ${_escortBuildConvoyLine(route.terrain)}
      </div>
      <div style="margin-top:16px;font-size:11px;color:#606040">进城中……</div>
    </div>
    <style>
      @keyframes esc-arrive-bounce {
        0%  { transform:scale(0.2); opacity:0; }
        60% { transform:scale(1.2); }
        100%{ transform:scale(1);   opacity:1; }
      }
    </style>
  `;

  document.body.appendChild(overlay);

  setTimeout(()=>{
    overlay.remove();
    onDone && onDone();
  }, 2000);
}

/* ── 单行队伍ASCII（用于抵达动画）── */
function _escortBuildConvoyLine(terrain){
  const art = ESCORT_TERRAIN_ART[terrain] || ESCORT_TERRAIN_ART['平原'];
  return `<span title="护卫"> ⚔ </span><span title="玩家" style="color:#f0d060">【${escortGetPlayerName()}】</span><span title="镖车"> 🐴📦 </span><span title="护卫"> ⚔ </span>`;
}

function escortShowResult(state, success, failReason, rewards){
  // ── 成就系统触发 ──
  if(typeof achOnEscort === 'function') achOnEscort(success);

  // ── 主线叙事指引：押镖到达目的地 ──
  if(success && typeof StoryGuide !== 'undefined' && typeof StoryGuide.escort === 'function'){
    const route = ESCORT_ROUTES.find(r => r.id === state.routeId);
    const destCity = route?.to;
    if(destCity) StoryGuide.escort(destCity);
  }

  // ── 播放结算音效 ──
  if(typeof SoundFX!=='undefined') {
    SoundFX.play(success ? 'escort_win' : 'escort_fail');
  }

  const route = ESCORT_ROUTES.find(r => r.id === state.routeId);
  const destCityId = route?.toCityId;

  const html = `
    <div id="escortGame" class="esc-container">
      <div class="esc-result ${success ? 'esc-result-win' : 'esc-result-fail'}">
        <div class="esc-result-icon">${success ? '🏆' : '💔'}</div>
        <div class="esc-result-title">${success ? '押镖成功！' : '押镖失败'}</div>
        <div class="esc-result-route">${route?.from} → ${route?.to}</div>

        ${success ? `
          <div class="esc-result-rewards">
            <div class="esc-reward-row">💰 获得银两：<strong>+${rewards.reward} 两</strong></div>
            <div class="esc-reward-row">🏅 声望提升：<strong>+${rewards.rep}</strong></div>
            <div class="esc-reward-row">✨ 获得经验：<strong>+${rewards.exp}</strong></div>
            <div class="esc-reward-row">${rewards.cargoStatus}</div>
            <div class="esc-reward-row" style="color:#80c0ff">📍 已抵达：<strong>${route?.to}</strong></div>
            <div class="esc-reward-row" style="color:#a0a070">⏳ 耗时：<strong>${rewards.daysElapsed || route?.travelDays || '--'} 天</strong></div>
          </div>
        ` : `
          <div class="esc-result-fail-reason">${failReason}</div>
          <div class="esc-result-tip">失败了也没关系，押镖风险本就如此。养好精力再来！</div>
        `}

        <div class="esc-result-log">
          <div class="esc-log-title">旅途回顾</div>
          ${state.log.slice(-8).map(l => `<div class="esc-log-item ${l.type||''}">${l.icon||'▸'} ${l.text}</div>`).join('')}
        </div>

        <div style="display:flex;gap:10px;margin-top:18px">
          <button class="esc-btn-main" onclick="openEscortGame()">📋 接新任务</button>
          <button class="esc-btn-back" onclick="escortCloseAndRefresh('${destCityId||''}')">← 进城游历</button>
        </div>
      </div>
    </div>
    ${escortGetStyles()}
  `;

  escortShowPanel(html);
  escortClear(); // 清除存档，结算完毕
}

/* ═══════════════════════════════════════════
   十二、放弃押镖
   ═══════════════════════════════════════════ */
function escortAbandon(){
  if(!confirm('确定放弃押镖？放弃将损失声望，且本次无报酬。')) return;

  escortAddRep(-8);
  escortClear();
  escortAlert('你放弃了押镖，声望-8。镖局的人会记得你的……');
  setTimeout(() => escortClose(), 1500);
}

/* ═══════════════════════════════════════════
   十三、UI 工具函数
   ═══════════════════════════════════════════ */
function escortShowPanel(html){
  let panel = document.getElementById('escortPanel');
  if(!panel){
    panel = document.createElement('div');
    panel.id = 'escortPanel';
    panel.style.cssText = `
      position:fixed; inset:0; z-index:9200;
      background:rgba(10,8,5,0.92);
      overflow-y:auto;
      display:flex; align-items:flex-start; justify-content:center;
      padding: 20px 10px;
    `;
    document.body.appendChild(panel);
  }
  panel.innerHTML = html;
}

function escortClose(){
  const panel = document.getElementById('escortPanel');
  if(panel) panel.remove();
  const overlay = document.getElementById('escortMarchOverlay');
  if(overlay) overlay.remove();
}

// 关闭押镖界面，并刷新地图到目标城市
function escortCloseAndRefresh(destCityId){
  escortClose();
  if(destCityId && typeof travelRenderLocation === 'function'){
    travelRenderLocation(destCityId);
  }
}

function escortAlert(msg){
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
    background:#2a1a08; color:#f0c060; border:1px solid #8a6030;
    padding:12px 24px; border-radius:8px; z-index:9999;
    font-size:14px; text-align:center; max-width:300px;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

/* ═══════════════════════════════════════════
   十四、CSS 样式
   ═══════════════════════════════════════════ */
function escortGetStyles(){
  return `
  <style id="escortStyles">
  .esc-container {
    width: 100%; max-width: 520px;
    background: linear-gradient(160deg, #1a1208 0%, #0e0c06 100%);
    border: 1px solid #6a4820;
    border-radius: 12px;
    padding: 0 0 20px;
    color: #d8c090;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    overflow: hidden;
  }
  .esc-header {
    background: linear-gradient(90deg, #2a1a08, #1a1008);
    border-bottom: 1px solid #6a4820;
    padding: 16px 18px 12px;
  }
  .esc-title {
    font-size: 18px; font-weight: bold; color: #f0c060;
    letter-spacing: 2px;
  }
  .esc-subtitle { font-size: 12px; color: #a08050; margin-top: 4px; }
  .esc-player-info { font-size: 13px; color: #c09050; margin-top: 8px; }
  .esc-route-info { font-size: 13px; color: #c09050; margin-top: 6px; }

  .esc-section-title {
    font-size: 13px; color: #f0a040; font-weight: bold;
    padding: 12px 18px 4px; letter-spacing: 1px;
  }
  .esc-route-list {
    padding: 4px 12px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .esc-route-card {
    background: #1e150a;
    border: 1px solid #5a3a18;
    border-radius: 8px;
    padding: 12px 14px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .esc-route-card:hover { border-color: #f0a040; background: #28190a; }
  .esc-route-card.esc-route-locked {
    opacity: 0.5; cursor: not-allowed; pointer-events: none;
  }
  .esc-route-header {
    display: flex; justify-content: space-between;
    font-size: 12px; color: #a08050; margin-bottom: 4px;
  }
  .esc-route-title { font-size: 15px; color: #f0c060; font-weight: bold; margin-bottom: 4px; }
  .esc-route-cargo { font-size: 12px; color: #d0a060; margin-bottom: 4px; }
  .esc-route-desc  { font-size: 12px; color: #a09070; line-height: 1.5; }
  .esc-route-footer {
    display: flex; gap: 12px; margin-top: 8px;
    font-size: 12px; color: #c09050; flex-wrap: wrap;
  }
  .esc-reward { color: #f0d060; }
  .esc-rep    { color: #80c080; }
  .esc-segments { color: #a0b0c0; }

  /* 进度 */
  .esc-progress-area { padding: 10px 18px 0; }
  .esc-progress-label { font-size: 12px; color: #a08050; margin-bottom: 6px; }
  .esc-progress-bar-wrap {
    background: #2a1a08; border-radius: 4px; height: 8px; overflow: hidden;
    border: 1px solid #5a3a18; margin-bottom: 6px;
  }
  .esc-progress-bar {
    background: linear-gradient(90deg, #f0a040, #f0d060);
    height: 100%; transition: width 0.4s ease;
  }

  /* 字符画舞台迷你版 */
  .esc-mini-stage {
    border-bottom: 2px solid rgba(120,80,30,.3);
    overflow: hidden;
    min-height: 78px;
  }
  .esc-mini-convoy {
    display:flex; align-items:center; justify-content:center;
    gap:12px; padding:6px 8px 2px;
    font-size:20px;
  }
  .esc-mini-player {
    font-size:22px;
    animation: esc-mini-walk 0.6s ease-in-out infinite;
  }
  .esc-mini-cart {
    font-size:18px;
    animation: esc-mini-walk 0.5s ease-in-out infinite;
    animation-delay: 0.15s;
  }
  .esc-mini-unit {
    font-size:18px;
    animation: esc-mini-walk 0.65s ease-in-out infinite;
    animation-delay: 0.3s;
  }
  @keyframes esc-mini-walk {
    0%,100%{ transform:translateY(0); }
    50%    { transform:translateY(-4px); }
  }

  @keyframes esc-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* 旧节点样式（保留兼容）*/
  .esc-node { display: flex; flex-direction: column; align-items: center; min-width: 50px; }
  .esc-node-dot { font-size: 14px; }
  .esc-node-label { font-size: 10px; color: #806040; margin-top: 2px; text-align: center; }
  .esc-road-line { flex: 1; height: 2px; background: #5a3a18; min-width: 10px; margin-bottom: 16px; }

  /* 状态栏 */
  .esc-status-bar {
    display: flex; gap: 10px; flex-wrap: wrap;
    padding: 8px 18px;
    background: #160f05;
    border-top: 1px solid #3a2810;
    border-bottom: 1px solid #3a2810;
    font-size: 12px; color: #c09050;
    margin-top: 8px;
  }

  /* 日志 */
  .esc-log-wrap { padding: 10px 18px; }
  .esc-log-title { font-size: 11px; color: #806040; margin-bottom: 6px; letter-spacing: 1px; }
  .esc-log-item {
    font-size: 12px; color: #b09060;
    padding: 3px 0; border-bottom: 1px solid #2a1a08;
  }
  .esc-log-item.good    { color: #80d080; }
  .esc-log-item.bad     { color: #d06060; }
  .esc-log-item.event   { color: #f0c060; }
  .esc-log-item.cost    { color: #c08040; }
  .esc-log-item.neutral { color: #a0a080; }
  .esc-log-item.safe    { color: #80b080; }

  /* 事件框 */
  .esc-event-box {
    margin: 12px 18px;
    background: #1e1508;
    border: 1px solid #8a5020;
    border-radius: 10px;
    padding: 14px 16px;
    animation: esc-fadeIn 0.3s ease;
  }
  @keyframes esc-fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .esc-event-icon  { font-size: 28px; text-align: center; margin-bottom: 6px; }
  .esc-event-title { font-size: 15px; font-weight: bold; color: #f0c060; text-align: center; margin-bottom: 8px; }
  .esc-event-desc  { font-size: 13px; color: #c0a070; line-height: 1.6; margin-bottom: 12px; }
  .esc-choices     { display: flex; flex-direction: column; gap: 7px; }
  .esc-choice-btn  {
    background: #2a1a08; border: 1px solid #6a4020;
    color: #d8c090; padding: 9px 14px;
    border-radius: 6px; cursor: pointer; font-size: 13px;
    text-align: left; transition: border-color 0.2s, background 0.2s;
  }
  .esc-choice-btn:hover { border-color: #f0a040; background: #38220a; }

  /* 操作按钮 */
  .esc-actions { padding: 14px 18px 0; display: flex; flex-direction: column; gap: 8px; }
  .esc-btn-main {
    background: linear-gradient(90deg, #8a5010, #c07020);
    color: #fff8e0; border: none; padding: 12px;
    border-radius: 8px; cursor: pointer; font-size: 14px;
    font-weight: bold; letter-spacing: 1px;
  }
  .esc-btn-main:hover { background: linear-gradient(90deg, #c07020, #f09030); }
  .esc-btn-finish { background: linear-gradient(90deg, #206030, #40a050); }
  .esc-btn-finish:hover { background: linear-gradient(90deg, #40a050, #60c070); }
  .esc-btn-abandon {
    background: transparent; border: 1px solid #6a3020;
    color: #a06040; padding: 8px; border-radius: 6px;
    cursor: pointer; font-size: 12px;
  }
  .esc-btn-abandon:hover { border-color: #d06030; color: #e07040; }
  .esc-btn-back {
    background: #1a1008; border: 1px solid #5a3818;
    color: #a08050; padding: 9px 18px;
    border-radius: 6px; cursor: pointer; font-size: 13px;
    margin: 14px 18px 0;
  }
  .esc-btn-back:hover { border-color: #a08050; color: #d0a060; }

  /* 结算 */
  .esc-result { padding: 24px 18px; text-align: center; }
  .esc-result-win  { }
  .esc-result-fail { }
  .esc-result-icon  { font-size: 48px; margin-bottom: 10px; }
  .esc-result-title { font-size: 22px; font-weight: bold; color: #f0c060; margin-bottom: 6px; }
  .esc-result-route { font-size: 13px; color: #a08050; margin-bottom: 14px; }
  .esc-result-rewards {
    background: #1a1208; border: 1px solid #5a3818;
    border-radius: 8px; padding: 14px; margin-bottom: 14px; text-align: left;
  }
  .esc-reward-row { font-size: 14px; color: #c0a060; padding: 4px 0; }
  .esc-reward-row strong { color: #f0d060; }
  .esc-result-fail-reason { color: #d06060; font-size: 14px; margin-bottom: 8px; }
  .esc-result-tip { color: #806040; font-size: 12px; margin-bottom: 14px; }
  .esc-result-log { text-align: left; margin-top: 14px; }
  .esc-empty { color: #806040; font-size: 13px; padding: 12px; text-align: center; }
  </style>
  `;
}
