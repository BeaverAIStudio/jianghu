// ═══════════════════════════════════════════════════════════════════════════════
//  dungeon-rooms-enhanced.js  地下城房间探索增强系统
//  功能：扩展事件类型、NPC互动、特殊房间机制
//  version: 18
// ═══════════════════════════════════════════════════════════════════════════════

// ── 统一渲染辅助函数（自动区分独立页面/嵌入式模式） ──
function _renderDungeonUIAuto(){
  const isStandalone = !!document.getElementById('dungeonContainer');
  return isStandalone ? _renderDungeonUIStandalone() : _renderDungeonUI();
}

// ───────────────────────────────────────────────────────────────────────────────
//  宝箱物品名称映射表（用于显示物品名称而不是ID）
// ───────────────────────────────────────────────────────────────────────────────
const CHEST_ITEM_NAMES = {
  // 基础材料
  'item_cloth': { name: '粗布', icon: '🧵' },
  'item_iron_ore': { name: '铁矿石', icon: '⛏️' },
  'item_herb_common': { name: '普通草药', icon: '🌿' },
  'item_herb_rare': { name: '珍稀草药', icon: '🍃' },
  'item_spirit_stone': { name: '灵石', icon: '💎' },
  'item_chaos_essence': { name: '混沌精华', icon: '⚫' },
  'item_dragon_scale': { name: '龙鳞', icon: '🐉' },
  'item_gem': { name: '宝石', icon: '💎' },
  'item_rare_gem': { name: '稀有宝石', icon: '💠' },
  'item_mythic_gem': { name: '神话宝石', icon: '🔮' },
  // 丹药
  'item_elixir_low': { name: '低级丹药', icon: '💊' },
  'item_elixir_mid': { name: '中级丹药', icon: '💊' },
  'item_elixir_high': { name: '高级丹药', icon: '💊' },
  // 收藏品（common）
  'col_broken_compass': { name: '破损罗盘', icon: '🧭' },
  'col_old_portrait': { name: '旧画像', icon: '🖼️' },
  'col_worn_sandal': { name: '破旧草鞋', icon: '👡' },
  'col_empty_jug': { name: '空酒壶', icon: '🍶' },
  // 收藏品（uncommon）
  'col_dice_set': { name: '骰子套装', icon: '🎲' },
  'col_copper_mirror': { name: '铜镜', icon: '🪞' },
  'col_clay_figurine': { name: '陶俑', icon: '🏺' },
  'col_red_thread': { name: '红绳', icon: '🧶' },
  'col_bronze_bell': { name: '铜铃', icon: '🔔' },
  'col_music_score': { name: '乐谱', icon: '🎵' },
  // 收藏品（rare）
  'col_jade_pendant': { name: '玉佩', icon: '🔷' },
  'col_chess_piece': { name: '棋子', icon: '♟️' },
  'col_ink_stick': { name: '墨锭', icon: '⚫' },
  'col_silver_hairpin': { name: '银簪', icon: '📌' },
  'col_sect_tablet': { name: '门派令牌', icon: '🏛️' },
  'col_letter_sealed': { name: '密信', icon: '📜' },
  // 收藏品（epic）
  'col_tiger_seal': { name: '虎符', icon: '🐅' },
  'col_jade_ring': { name: '玉戒指', icon: '💍' },
  'col_war_flag': { name: '战旗', icon: '🚩' },
  'col_jade_buddha': { name: '玉佛', icon: '🙏' },
  'col_ancient_coin': { name: '古钱币', icon: '🪙' },
  'col_moonstone': { name: '月光石', icon: '🌙' },
  'col_scroll_painting': { name: '卷轴画', icon: '🖼️' },
  // 收藏品（legendary）
  'col_phoenix_feather': { name: '凤凰羽', icon: '🪶' },
  'col_jade_token_dragon': { name: '龙纹玉牌', icon: '🐲' },
  'col_broken_sword': { name: '断剑', icon: '🗡️' },
  'col_anon_portrait': { name: '无名画像', icon: '👤' },
  'col_cracked_bell': { name: '裂钟', icon: '🔔' },
  // 银两
  'silver': { name: '银子', icon: '💰' },
};

// ───────────────────────────────────────────────────────────────────────────────
//  扩展事件数据库
// ───────────────────────────────────────────────────────────────────────────────
const DUNGEON_EVENTS_ENHANCED = [
  // ===== 商人/交易类 =====
  {
    id: 'ev_merchant_enhanced',
    title: '💰 神秘行商',
    desc: '一个背着大包裹的神秘商人出现在你面前，他的货物看起来来路不正，但品质不错。',
    choices: [
      { text: '购买补给（消耗50两）', cost: { silver: 50 }, reward: { item: 'item_elixir_low', qty: 2, exp: 30 }, result: '买到了一些药品和补给。' },
      { text: '高价购买稀有物品（消耗200两）', cost: { silver: 200 }, reward: { lootTier: 'rare', exp: 50 }, result: '商人神秘一笑，拿出了一件好东西！' },
      { text: '打劫他！', chance: 0.4, reward: { silver: 150, lootTier: 'uncommon' }, failCost: { hp: 80 }, result: '【成功】你抢到了一些财物！', failResult: '【失败】商人是个隐藏高手，你被狠狠教训了一顿！' },
      { text: '不交易，离开', reward: {}, result: '商人耸耸肩，消失在阴影中。' },
    ],
  },
  {
    id: 'ev_gambler',
    title: '🎲 地下赌局',
    desc: '几个江湖人士正在角落里赌钱，看起来手气不错。',
    choices: [
      { text: '小赌怡情（50两）', chance: 0.5, reward: { silver: 100 }, failCost: { silver: 50 }, result: '【赢】手气不错，赢了一些银子！', failResult: '【输】运气不佳，输掉了赌注。' },
      { text: '大赌伤身（200两）', chance: 0.35, reward: { silver: 500, exp: 100 }, failCost: { silver: 200 }, result: '【大赢】 jackpot！大赚一笔！', failResult: '【大输】血本无归……' },
      { text: '旁观学习', reward: { exp: 50 }, result: '观察了一会儿，学到了一些赌术技巧。' },
      { text: '举报给守卫（正道）', reward: { rep: 20, exp: 80 }, result: '守卫赶来驱散了赌局，你获得了侠名。' },
    ],
  },
  
  // ===== 武学/修炼类 =====
  {
    id: 'ev_meditation_spot',
    title: '🧘 灵气汇聚之地',
    desc: '这个房间的气流异常，似乎是一处天然的修炼宝地。',
    choices: [
      { text: '打坐修炼（恢复大量内力）', reward: { mpHeal: 0.6, exp: 100 }, result: '在此地修炼，内力大增！' },
      { text: '参悟武学', chance: 0.5, reward: { skillProfBonus: 1.0, exp: 200 }, failReward: { exp: 50 }, result: '【顿悟】对武学有了新的理解！', failResult: '有所感悟，但不够深刻。' },
      { text: '采集灵气精华', reward: { item: 'item_spirit_stone', qty: 1 }, result: '收集了一些灵气凝结的晶石。' },
    ],
  },
  {
    id: 'ev_sparring_ghost',
    title: '👻 武者残魂',
    desc: '一位古代武者的残魂在此徘徊，似乎在寻找传人。',
    choices: [
      { text: '接受挑战（战斗）', chance: 0.6, reward: { exp: 300, lootTier: 'rare' }, failCost: { hp: 100 }, result: '【胜利】战胜了残魂，获得了传承！', failResult: '【失败】残魂太过强大，你受了重伤。' },
      { text: '恭敬请教', chance: 0.4, reward: { skillProfBonus: 0.8, exp: 150 }, failReward: { exp: 50 }, result: '【成功】残魂传授了你一招半式。', failResult: '残魂摇头，你的资质不够……' },
      { text: '恭敬退避', reward: {}, result: '残魂没有为难你，让你通过了。' },
    ],
  },
  
  // ===== 探索/发现类 =====
  {
    id: 'ev_hidden_cache',
    title: '🔍 隐蔽的储藏点',
    desc: '你发现了一个被巧妙隐藏的储藏点，可能是前人留下的。',
    choices: [
      { text: '仔细搜查', chance: 0.7, reward: { lootTier: 'uncommon', exp: 80 }, failReward: { silver: 20 }, result: '找到了一些有用的物品！', failResult: '只找到一些零钱。' },
      { text: '破解机关', chance: 0.5, reward: { lootTier: 'rare', item: 'item_trap_parts', qty: 3 }, failCost: { hp: 40 }, result: '【成功】机关破解，发现了更好的东西！', failResult: '【失败】触发了机关！' },
      { text: '标记位置，以后再来', reward: {}, result: '你记下了这个位置。' },
    ],
  },
  {
    id: 'ev_underground_river',
    title: '💧 地下暗河',
    desc: '一条地下暗河横亘在前，水流湍急。',
    choices: [
      { text: '游泳渡过', chance: 0.6, reward: { exp: 100 }, failCost: { hp: 30, energy: 20 }, result: '【成功】顺利游到了对岸。', failResult: '【失败】被水流冲走，受了些伤。' },
      { text: '寻找浅滩', chance: 0.4, reward: { exp: 50 }, failCost: { energy: 30 }, result: '【成功】找到了可以涉水而过的地方。', failResult: '【失败】找了很久也没找到，浪费了体力。' },
      { text: '饮用河水', reward: { hpHeal: 0.15, mpHeal: 0.2 }, result: '河水清凉甘甜，恢复了一些状态。' },
    ],
  },
  
  // ===== 遭遇/互动类 =====
  {
    id: 'ev_lost_adventurer',
    title: '🤝 迷路的冒险者',
    desc: '一个看起来迷路多日的冒险者，见到你如同见到救星。',
    choices: [
      { text: '分享食物和水', cost: { item: 'item_herb_common', qty: 1 }, reward: { rep: 15, exp: 100, intel: true }, result: '他感激不尽，分享了前方的情报。' },
      { text: '带他一起离开', reward: { rep: 25, exp: 150 }, result: '你们一起找到了出口，他重重酬谢了你。' },
      { text: '给他指路', reward: { rep: 5, exp: 30 }, result: '简单指了方向，他匆匆离去。' },
      { text: '趁火打劫', reward: { silver: 80 }, result: '你抢走了他的财物……侠义值下降。' },
    ],
  },
  {
    id: 'ev_strange_altar',
    title: '⛩️ 古老祭坛',
    desc: '一个散发着诡异气息的古老祭坛，上面刻着你无法理解的符文。',
    choices: [
      { text: '虔诚祭拜', chance: 0.5, reward: { buff: 'blessing', exp: 100 }, failCost: { hp: 20 }, result: '【成功】获得了神秘的祝福！', failResult: '【失败】祭坛没有任何反应。' },
      { text: '尝试解读符文', chance: 0.4, reward: { exp: 200, item: 'item_chaos_essence', qty: 1 }, failCost: { mp: 50 }, result: '【成功】解读出了一些古老的秘密！', failResult: '【失败】精神消耗过度。' },
      { text: '破坏祭坛（邪道）', reward: { item: 'item_spirit_stone', qty: 2 }, result: '你破坏了祭坛，获得了一些灵石碎片。' },
      { text: '敬而远之', reward: {}, result: '你绕开了这个诡异的地方。' },
    ],
  },
  
  // ===== 陷阱/危险类 =====
  {
    id: 'ev_poison_gas',
    title: '☠️ 毒雾弥漫',
    desc: '前方区域弥漫着诡异的绿色毒雾，看起来极其危险。',
    choices: [
      { text: '屏息快速通过', chance: 0.5, reward: { exp: 80 }, failCost: { hp: 60 }, result: '【成功】快速通过了毒雾区！', failResult: '【失败】吸入了一些毒气！' },
      { text: '使用解毒药', cost: { item: 'item_antidote', qty: 1 }, reward: { exp: 50 }, result: '服用解毒药后安全通过。' },
      { text: '寻找其他路线', cost: { energy: 25 }, reward: {}, result: '绕了一大圈，避开了毒雾。' },
      { text: '采集毒雾样本', chance: 0.6, reward: { item: 'item_poison_extract', qty: 2 }, failCost: { hp: 40 }, result: '【成功】采集到了毒雾精华。', failResult: '【失败】采集时被毒气所伤！' },
    ],
  },
  {
    id: 'ev_cave_in',
    title: '🪨 塌方危险',
    desc: '头顶传来不祥的声响，这个区域随时可能塌方！',
    choices: [
      { text: '快速奔跑通过', chance: 0.6, reward: { exp: 100 }, failCost: { hp: 80 }, result: '【成功】在塌方前冲了过去！', failResult: '【失败】被落石砸中！' },
      { text: '寻找支撑点', chance: 0.4, reward: { exp: 150, item: 'item_iron_ore', qty: 3 }, failCost: { hp: 40 }, result: '【成功】加固了通道，还发现了矿石！', failResult: '【失败】没能找到合适的支撑点。' },
      { text: '原路返回', cost: { energy: 30 }, reward: {}, result: '你选择了安全起见，原路返回。' },
    ],
  },
  
  // ===== 特殊/奇遇类 =====
  {
    id: 'ev_time_anomaly',
    title: '⏳ 时空异常',
    desc: '这个区域的时间流速似乎不正常，你感觉在这里待了很久，但可能只过了一瞬间。',
    choices: [
      { text: '静心感悟', reward: { exp: 300, skillProfBonus: 1.5 }, result: '在时空异常中修炼，获得了大量经验！' },
      { text: '快速离开', reward: {}, result: '你不敢久留，迅速离开了这个诡异的地方。' },
      { text: '探索异常源头', chance: 0.3, reward: { item: 'item_chaos_essence', qty: 2, exp: 200 }, failCost: { hp: 50, mp: 50 }, result: '【成功】发现了时空裂隙，获得了混沌精华！', failResult: '【失败】被时空乱流所伤！' },
    ],
  },
  {
    id: 'ev_mirror_room',
    title: '🪞 镜之房间',
    desc: '房间里布满了镜子，每个镜子中都映照出不同的景象。',
    choices: [
      { text: '凝视主镜', chance: 0.5, reward: { exp: 200, buff: 'insight' }, failCost: { mp: 40 }, result: '【成功】从镜中看到了一些未来的片段！', failResult: '【失败】精神受到了冲击。' },
      { text: '打破镜子（邪道）', reward: { item: 'item_gem', qty: 1, silver: 100 }, result: '镜子破碎，你获得了镜中的宝物。' },
      { text: '仔细研究', reward: { exp: 100 }, result: '研究了一会儿，有了一些发现。' },
      { text: '直接离开', reward: {}, result: '这些镜子让你感到不安，你选择了离开。' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
//  NPC遭遇数据库
// ───────────────────────────────────────────────────────────────────────────────
const DUNGEON_NPC_ENCOUNTERS = [
  {
    id: 'npc_wandering_swordsman',
    name: '游侠剑客',
    icon: '⚔️',
    desc: '一位独行的剑客，看起来实力不俗。',
    type: 'neutral',
    choices: [
      { text: '切磋武艺（友好战斗）', type: 'spar', reward: { exp: 200, skillProfBonus: 0.5 }, result: '切磋一番，各有所得。' },
      { text: '请教剑法', reward: { skillProfBonus: 0.8, exp: 100 }, result: '剑客指点了几招，受益匪浅。' },
      { text: '交换情报', reward: { intel: true, exp: 50 }, result: '互相分享了地下城的情报。' },
      { text: '挑战他（生死战）', type: 'fight', reward: { exp: 400, lootTier: 'rare' }, result: '一场激战！' },
    ],
  },
  {
    id: 'npc_exiled_monk',
    name: '流亡僧人',
    icon: '🧘',
    desc: '一位被逐出师门的僧人，正在寻找救赎之路。',
    type: 'friendly',
    choices: [
      { text: '听他讲述往事', reward: { exp: 80, rep: 10 }, result: '僧人讲述了他的故事，你获得了一些感悟。' },
      { text: '为他治疗', cost: { mp: 30 }, reward: { rep: 20, exp: 100, item: 'item_buddhist_beads', qty: 1 }, result: '僧人感激地赠予你一串佛珠。' },
      { text: '邀请他同行', reward: { companion: 'exiled_monk', exp: 50 }, result: '僧人同意暂时与你同行。' },
    ],
  },
  {
    id: 'npc_treasure_hunter',
    name: '寻宝猎人',
    icon: '💎',
    desc: '一个专业的寻宝者，对地下城了如指掌。',
    type: 'neutral',
    choices: [
      { text: '购买情报（100两）', cost: { silver: 100 }, reward: { intel: true, mapReveal: 3 }, result: '他告诉你几个隐藏房间的位置。' },
      { text: '合作探索', reward: { lootTier: 'uncommon', exp: 150 }, result: '你们合作找到了一些宝物。' },
      { text: '雇佣他（300两）', cost: { silver: 300 }, reward: { companion: 'treasure_hunter', lootBonus: 0.2 }, result: '他同意为你效力一段时间。' },
    ],
  },
  {
    id: 'npc_mysterious_stranger',
    name: '神秘人',
    icon: '🎭',
    desc: '一个戴着面具的神秘人物，看不清面容。',
    type: 'mysterious',
    choices: [
      { text: '询问来意', chance: 0.5, reward: { quest: true, exp: 100 }, failReward: {}, result: '【成功】他给了你一项神秘任务。', failResult: '他沉默不语。' },
      { text: '交易', reward: { shop: 'mystery', exp: 50 }, result: '他展示了一些稀奇古怪的物品。' },
      { text: '警惕地离开', reward: {}, result: '你感觉到这个人很危险，选择了离开。' },
    ],
  },
  {
    id: 'npc_injured_guard',
    name: '受伤的守卫',
    icon: '🛡️',
    desc: '一位受了重伤的地下城守卫，正在艰难地支撑着。',
    type: 'friendly',
    choices: [
      { text: '救治他', cost: { item: 'item_elixir_low', qty: 1 }, reward: { rep: 30, exp: 150, intel: true }, result: '守卫感激地告诉你BOSS的弱点。' },
      { text: '帮他包扎', reward: { rep: 15, exp: 80 }, result: '简单处理后，守卫能自己行动了。' },
      { text: '询问发生了什么', reward: { exp: 50, intel: true }, result: '守卫告诉你前方有强大的敌人。' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
//  特殊房间效果
// ───────────────────────────────────────────────────────────────────────────────
const SPECIAL_ROOM_EFFECTS = {
  // 祝福祭坛
  blessing_altar: {
    name: '祝福祭坛',
    icon: '✨',
    desc: '古老的祭坛散发着神圣的光芒。',
    effect: (player) => {
      const buff = {
        type: 'blessing',
        name: '神圣祝福',
        duration: 5,
        stats: { str: 5, con: 5, luck: 10 },
      };
      applyBuff(buff);
      return '获得了神圣祝福，全属性提升！';
    },
  },
  
  // 诅咒之地
  cursed_ground: {
    name: '诅咒之地',
    icon: '💀',
    desc: '这片区域充满了不祥的气息。',
    effect: (player) => {
      const debuff = {
        type: 'curse',
        name: '地下城诅咒',
        duration: 3,
        stats: { str: -3, con: -3 },
      };
      applyDebuff(debuff);
      return '受到了地下城诅咒，属性下降！';
    },
  },
  
  // 生命之泉
  life_spring: {
    name: '生命之泉',
    icon: '💧',
    desc: '一汪清澈的泉水，散发着生命的气息。',
    effect: (player) => {
      const heal = Math.round((player.maxHp || 100) * 0.5);
      player.hp = Math.min(player.maxHp, (player.hp || player.maxHp) + heal);
      return `生命之泉恢复了 ${heal} 点气血！`;
    },
  },
  
  // 魔力漩涡
  mana_vortex: {
    name: '魔力漩涡',
    icon: '🔮',
    desc: '空气中充满了浓郁的魔力。',
    effect: (player) => {
      const mpRestore = Math.round((player.maxMp || 100) * 0.6);
      player.mp = Math.min(player.maxMp, (player.mp || player.maxMp) + mpRestore);
      return `魔力漩涡恢复了 ${mpRestore} 点内力！`;
    },
  },
  
  // 训练场
  training_ground: {
    name: '古代训练场',
    icon: '🏋️',
    desc: '这里曾经是武者训练的地方，还残留着修炼的气息。',
    effect: (player) => {
      const expGain = 150;
      if (typeof gainExp === 'function') gainExp(expGain);
      return `在训练场修炼，获得了 ${expGain} 经验！`;
    },
  },
};

// ───────────────────────────────────────────────────────────────────────────────
//  增强的事件处理函数
// ───────────────────────────────────────────────────────────────────────────────

// 合并基础事件和增强事件
function getAllDungeonEvents() {
  const baseEvents = typeof DUNGEON_EVENTS !== 'undefined' ? DUNGEON_EVENTS : [];
  return [...baseEvents, ...DUNGEON_EVENTS_ENHANCED];
}

// 触发增强事件
function dungeonTriggerEventEnhanced() {
  const ds = _dungeonState;
  if (!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if (!cell || cell.cleared) return;

  // 根据地下城类型和等级选择合适的事件
  const allEvents = getAllDungeonEvents();
  const dungeon = ds.dungeon;
  
  // 根据地下城等级过滤事件
  let availableEvents = allEvents;
  if (dungeon.minLevel < 20) {
    // 低级地下城：只使用基础事件
    availableEvents = allEvents.filter(e => 
      ['ev_merchant', 'ev_inscription', 'ev_trap_disarm', 'ev_secret_room', 'ev_wounded_enemy'].includes(e.id)
    );
  } else if (dungeon.minLevel < 50) {
    // 中级地下城：使用基础和部分增强事件
    availableEvents = allEvents.filter(e => 
      !['ev_time_anomaly', 'ev_mirror_room'].includes(e.id)
    );
  }
  // 高级地下城：所有事件都可用

  const ev = availableEvents[Math.floor(Math.random() * availableEvents.length)];
  _showDungeonEventModalEnhanced(ev, row, col);
}

// 显示增强的事件弹窗
function _showDungeonEventModalEnhanced(ev, row, col) {
  const modal = document.createElement('div');
  modal.className = 'dg-event-modal';
  modal.id = 'dgEventModal';

  let choicesHtml = ev.choices.map((c, i) => {
    let costText = '';
    if (c.cost) {
      const costs = [];
      if (c.cost.silver) costs.push(`${c.cost.silver}两`);
      if (c.cost.hp) costs.push(`${c.cost.hp}气血`);
      if (c.cost.mp) costs.push(`${c.cost.mp}内力`);
      if (c.cost.energy) costs.push(`${c.cost.energy}精力`);
      if (c.cost.item) costs.push('物品');
      if (costs.length) costText = `<span class="dg-cost">[消耗: ${costs.join(', ')}]</span>`;
    }
    if (c.chance !== undefined) {
      costText += `<span class="dg-chance">[成功率: ${Math.round(c.chance * 100)}%]</span>`;
    }
    return `<button class="dg-choice-btn" onclick="dungeonEventChoiceEnhanced(${i})">${c.text}${costText}</button>`;
  }).join('');

  modal.innerHTML = `
<div class="dg-event-box">
  <div class="dg-event-title">${ev.title}</div>
  <div class="dg-event-desc">${ev.desc}</div>
  <div class="dg-event-choices">${choicesHtml}</div>
</div>`;
  modal.dataset.evId = ev.id;
  modal.dataset.row = row;
  modal.dataset.col = col;
  document.body.appendChild(modal);
}

// 处理增强事件选择
function dungeonEventChoiceEnhanced(choiceIdx) {
  const modal = document.getElementById('dgEventModal');
  if (!modal) return;
  const evId = modal.dataset.evId;
  const row = parseInt(modal.dataset.row);
  const col = parseInt(modal.dataset.col);
  modal.remove();

  const allEvents = getAllDungeonEvents();
  const ev = allEvents.find(e => e.id === evId);
  if (!ev) return;
  const choice = ev.choices[choiceIdx];
  if (!choice) return;

  // 检查消耗是否足够
  if (choice.cost) {
    const cost = choice.cost;
    if (cost.silver && typeof edS !== 'undefined') {
      const currentSilver = SilverManager.get();
      if (currentSilver < cost.silver) {
        showToast(`银两不足！需要 ${cost.silver} 两`);
        return;
      }
    }
    if (cost.item && typeof edS !== 'undefined') {
      const bag = edS.bag || [];
      const hasItem = bag.some(b => b && b.id === cost.item && b.qty >= (cost.qty || 1));
      if (!hasItem) {
        showToast(`背包中没有所需的物品！`);
        return;
      }
    }
  }

  // 概率判定
  let success = true;
  if (choice.chance !== undefined) {
    success = Math.random() < choice.chance;
  }

  const resultText = success ? choice.result : (choice.failResult || '失败了……');
  const reward = success ? choice.reward : (choice.failReward || {});

  // 处理消耗
  if (choice.cost) {
    const cost = choice.cost;
    if (cost.silver) {
      SilverManager.spend(cost.silver);
      SilverManager.save();
    }
    if (cost.hp && typeof edS !== 'undefined') edS.hp = Math.max(1, (edS.hp || 100) - cost.hp);
    if (cost.mp && typeof edS !== 'undefined') edS.mp = Math.max(0, (edS.mp || 100) - cost.mp);
    if (cost.energy && typeof edS !== 'undefined') edS.energy = Math.max(0, (edS.energy || 100) - cost.energy);
    if (cost.item && typeof edS !== 'undefined') {
      const bag = edS.bag || [];
      const idx = bag.findIndex(b => b && b.id === cost.item);
      if (idx >= 0) {
        if (bag[idx].qty > (cost.qty || 1)) bag[idx].qty -= (cost.qty || 1);
        else bag.splice(idx, 1);
      }
    }
  }

  // 处理失败代价
  if (!success && choice.failCost) {
    const fc = choice.failCost;
    if (fc.hp && typeof edS !== 'undefined') edS.hp = Math.max(1, (edS.hp || 100) - fc.hp);
    if (fc.mp && typeof edS !== 'undefined') edS.mp = Math.max(0, (edS.mp || 100) - fc.mp);
    if (fc.silver) {
      SilverManager.spend(fc.silver);
      SilverManager.save();
    }
  }

  // 处理奖励
  if (reward.exp && typeof gainExp === 'function') gainExp(reward.exp);
  if (reward.silver) {
    SilverManager.add(reward.silver);
    SilverManager.save();
  }
  if (reward.item) _dungeonAddItem(reward.item, reward.qty || 1);
  if (reward.lootTier) {
    const loot = dungeonRollChestLoot(reward.lootTier);
    _dungeonAddItem(loot.id, loot.qty);
  }
  if (reward.hpHeal && typeof edS !== 'undefined') {
    const heal = Math.round((edS.maxHp || 100) * reward.hpHeal);
    edS.hp = Math.min(edS.maxHp, (edS.hp || edS.maxHp) + heal);
  }
  if (reward.mpHeal && typeof edS !== 'undefined') {
    const mpRestore = Math.round((edS.maxMp || 100) * reward.mpHeal);
    edS.mp = Math.min(edS.maxMp, (edS.mp || edS.maxMp) + mpRestore);
  }
  if (reward.skillProfBonus && typeof addSkillProficiency === 'function') {
    addSkillProficiency('martial', reward.skillProfBonus);
  }
  if (reward.buff) {
    // 应用buff效果
    showToast(`获得了增益效果：${reward.buff}`);
  }

  if (typeof saveProgress === 'function') saveProgress();

  // 标记房间已清理
  const ds = _dungeonState;
  if (ds) {
    const cell = ds.map[row][col];
    if (cell) { cell.cleared = true; ds.clearedRooms++; }
    dungeonSave();
  }

  showToast(resultText);
  _dgLog(resultText);
  _renderDungeonUIAuto();
}

// ───────────────────────────────────────────────────────────────────────────────
//  NPC遭遇处理
// ───────────────────────────────────────────────────────────────────────────────

// 触发NPC遭遇
function dungeonTriggerNpcEncounter() {
  const ds = _dungeonState;
  if (!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if (!cell || cell.cleared) return;

  // 根据地下城等级选择合适的NPC
  let availableNpcs = DUNGEON_NPC_ENCOUNTERS;
  const dungeon = ds.dungeon;
  if (dungeon.minLevel < 20) {
    availableNpcs = DUNGEON_NPC_ENCOUNTERS.filter(n => 
      ['npc_injured_guard', 'npc_exiled_monk'].includes(n.id)
    );
  }

  const npc = availableNpcs[Math.floor(Math.random() * availableNpcs.length)];
  _showNpcEncounterModal(npc, row, col);
}

// 显示NPC遭遇弹窗
function _showNpcEncounterModal(npc, row, col) {
  const modal = document.createElement('div');
  modal.className = 'dg-event-modal';
  modal.id = 'dgNpcModal';

  let choicesHtml = npc.choices.map((c, i) => {
    let typeClass = '';
    if (c.type === 'fight') typeClass = 'dg-choice-danger';
    if (c.type === 'spar') typeClass = 'dg-choice-friendly';
    return `<button class="dg-choice-btn ${typeClass}" onclick="dungeonNpcChoice(${i})">${c.text}</button>`;
  }).join('');

  modal.innerHTML = `
<div class="dg-event-box">
  <div class="dg-event-title">${npc.icon} ${npc.name}</div>
  <div class="dg-event-desc">${npc.desc}</div>
  <div class="dg-event-choices">${choicesHtml}</div>
</div>`;
  modal.dataset.npcId = npc.id;
  modal.dataset.row = row;
  modal.dataset.col = col;
  document.body.appendChild(modal);
}

// 处理NPC选择
function dungeonNpcChoice(choiceIdx) {
  const modal = document.getElementById('dgNpcModal');
  if (!modal) return;
  const npcId = modal.dataset.npcId;
  const row = parseInt(modal.dataset.row);
  const col = parseInt(modal.dataset.col);
  modal.remove();

  const npc = DUNGEON_NPC_ENCOUNTERS.find(n => n.id === npcId);
  if (!npc) return;
  const choice = npc.choices[choiceIdx];
  if (!choice) return;

  // 处理战斗类型选择
  if (choice.type === 'fight' || choice.type === 'spar') {
    // 启动战斗
    _startNpcBattle(npc, choice);
    return;
  }

  // 处理普通奖励
  if (choice.reward) {
    const reward = choice.reward;
    if (reward.exp && typeof gainExp === 'function') gainExp(reward.exp);
    if (reward.silver) {
      if (typeof addSilver === 'function') addSilver(reward.silver);
    }
    if (reward.item) _dungeonAddItem(reward.item, reward.qty || 1);
    if (reward.skillProfBonus && typeof addSkillProficiency === 'function') {
      addSkillProficiency('martial', reward.skillProfBonus);
    }
  }

  showToast(choice.result || '互动完成');
  _dgLog(choice.result || '互动完成');

  // 标记房间已清理
  const ds = _dungeonState;
  if (ds) {
    const cell = ds.map[row][col];
    if (cell) { cell.cleared = true; ds.clearedRooms++; }
    dungeonSave();
    _renderDungeonUIAuto();
  }
}

// 启动NPC战斗
function _startNpcBattle(npc, choice) {
  // 构建NPC敌人数据
  const enemyData = {
    id: npc.id,
    name: npc.name,
    icon: npc.icon,
    level: (typeof edS !== 'undefined' ? (edS.level || 1) : 1) + (choice.type === 'fight' ? 2 : 0),
    hp: choice.type === 'fight' ? 150 : 100,
    maxHp: choice.type === 'fight' ? 150 : 100,
    atk: choice.type === 'fight' ? 25 : 15,
    def: choice.type === 'fight' ? 15 : 10,
    spd: 12,
    exp: choice.reward?.exp || 100,
    silver: choice.type === 'fight' ? 50 : 20,
    frames: {
      stand: [npc.icon],
      attack: [npc.icon, '💥'],
      hit: ['😵'],
      down: ['💀'],
    },
  };

  const ds = _dungeonState;
  const [row, col] = ds.pos;
  
  // 记录战斗上下文
  _pendingDungeonBattleCell = { 
    row, 
    col, 
    enemy: enemyData,
    isNpcBattle: true,
    npcChoice: choice,
  };

  // 获取玩家角色
  const playerChar = _getDungeonPlayerChar();
  const enemyChar = _buildEnemyChar(enemyData);

  // 启动战斗
  startWildBattle(playerChar, enemyChar, _onNpcBattleEnd);
}

// NPC战斗结束回调
function _onNpcBattleEnd(playerWon) {
  const ctx = _pendingDungeonBattleCell;
  if (!ctx || !ctx.isNpcBattle) {
    // 不是NPC战斗，使用原回调
    _onDungeonBattleEnd(playerWon);
    return;
  }

  const ds = _dungeonState;
  if (!ds) return;

  if (!playerWon) {
    // NPC战斗失败也扣命
    ds.lives = (ds.lives || 1) - 1;
    if (ds.lives <= 0) {
      showToast('💀 气力耗尽，探索失败……');
      dungeonClearSave();
      _dungeonState = null;
      setTimeout(() => _returnFromDungeon(), 2500);
      return;
    }
    
    const [revR, revC] = ds.lastRestPos || ds.dungeon.startPos || [0, 0];
    ds.pos = [revR, revC];
    if (typeof edS !== 'undefined') {
      const maxHp = edS.maxHp || 100;
      const maxMp = edS.maxMp || 100;
      edS.hp = Math.round(maxHp * 0.50);
      edS.mp = Math.round(maxMp * 0.30);
    }
    dungeonSave();
    showToast(`💀 战败！剩余生机：${'❤️'.repeat(ds.lives)}`);
    setTimeout(() => _showDungeonPage(), 1800);
    return;
  }

  // 胜利处理
  const { row, col, npcChoice } = ctx;
  const cell = ds.map[row][col];
  if (cell) {
    cell.cleared = true;
    ds.clearedRooms++;
  }
  _pendingDungeonBattleCell = null;

  // 给予奖励
  const reward = npcChoice.reward || {};
  if (reward.exp && typeof gainExp === 'function') gainExp(reward.exp);
  if (reward.silver && typeof addSilver === 'function') addSilver(reward.silver);
  if (reward.lootTier) {
    const loot = dungeonRollChestLoot(reward.lootTier);
    _dungeonAddItem(loot.id, loot.qty);
  }
  if (reward.item) _dungeonAddItem(reward.item, reward.qty || 1);

  // 战后恢复
  if (typeof edS !== 'undefined') {
    const maxHp = edS.maxHp || 100;
    const maxMp = edS.maxMp || 100;
    edS.hp = Math.min(maxHp, (edS.hp || maxHp) + Math.round(maxHp * 0.05));
    edS.mp = Math.min(maxMp, (edS.mp || maxMp) + Math.round(maxMp * 0.03));
  }

  showToast(npcChoice.result || '战斗胜利！');
  dungeonSave();
  setTimeout(() => _showDungeonPage(), 500);
}

// ───────────────────────────────────────────────────────────────────────────────
//  特殊房间处理
// ───────────────────────────────────────────────────────────────────────────────

// 触发特殊房间效果
function dungeonTriggerSpecialRoom() {
  const ds = _dungeonState;
  if (!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if (!cell || cell.cleared || !cell.specialType) return;

  const effect = SPECIAL_ROOM_EFFECTS[cell.specialType];
  if (!effect) return;

  const player = typeof edS !== 'undefined' ? edS : null;
  if (!player) return;

  const result = effect.effect(player);
  showToast(result);
  _dgLog(result);

  cell.cleared = true;
  ds.clearedRooms++;
  dungeonSave();
  _renderDungeonUIAuto();
}

// ───────────────────────────────────────────────────────────────────────────────
//  增强的宝箱系统
// ───────────────────────────────────────────────────────────────────────────────

// 增强开箱 - 添加陷阱宝箱机制
function dungeonOpenChestEnhanced() {
  const ds = _dungeonState;
  if (!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if (!cell || cell.cleared) { showToast('宝箱已开'); return; }

  // 检查是否是陷阱宝箱（10%概率）
  if (cell.isTrapChest || Math.random() < 0.1) {
    _handleTrapChest(cell, row, col);
    return;
  }

  // 普通宝箱
  const tier = cell.lootTier || 'common';
  const loot = dungeonRollChestLoot(tier);

  // 准备奖励信息 - 查找物品名称（优先使用CHEST_ITEM_NAMES映射表）
  let itemName, itemIcon;
  
  // 首先检查CHEST_ITEM_NAMES映射表
  const chestItem = CHEST_ITEM_NAMES[loot.id];
  if (chestItem) {
    itemName = loot.id === 'silver' ? `${loot.qty} 两${chestItem.name}` : `${chestItem.name} ×${loot.qty}`;
    itemIcon = chestItem.icon;
  } else {
    // 回退到其他数据源（优先用地下城专用物品数据库）
    let meta = (typeof DUNGEON_ITEM_DB !== 'undefined') ? DUNGEON_ITEM_DB[loot.id] : null;
    if (!meta) meta = (typeof ENEMY_DROP_ITEMS !== 'undefined') ? ENEMY_DROP_ITEMS[loot.id] : null;
    if (!meta && typeof COLLECTIBLE_DB !== 'undefined') {
      meta = COLLECTIBLE_DB[loot.id];
    }
    if (meta) {
      itemName = `${meta.name} ×${loot.qty}`;
      itemIcon = meta.icon || '📦';
    } else {
      // 最后回退到ID显示
      itemName = `${loot.id} ×${loot.qty}`;
      itemIcon = '📦';
    }
  }
  const label = `${itemIcon} ${itemName}`;
  const rewardInfo = { name: itemName, icon: itemIcon, qty: loot.qty, tier: tier };

  // 播放开箱动画（如果可用）
  if (typeof playChestAnimation === 'function') {
    playChestAnimation(rewardInfo);

    // 延迟执行实际奖励和清理（等动画播放完）
    setTimeout(() => {
      _dungeonAddItem(loot.id, loot.qty);
      cell.cleared = true;
      ds.clearedRooms++;
      dungeonSave();
    }, 2000);

    // 延迟隐藏宝箱并显示提示（保留奖励展示）
    setTimeout(() => {
      // 只隐藏宝箱部分，保留奖励展示让玩家看到获得了什么
      const chestWrapper = document.getElementById('chestWrapper');
      const chestParticles = document.querySelector('.chest-particles');
      const chestRays = document.querySelector('.chest-rays');
      if(chestWrapper) chestWrapper.style.display = 'none';
      if(chestParticles) chestParticles.style.display = 'none';
      if(chestRays) chestRays.style.display = 'none';
      
      // 显示获得提示
      showToast(`📦 获得：${label}`, 3000); // 显示3秒
      _dgLog(`📦 打开宝箱，获得了 ${label}！`);
    }, 2200);

    // 延迟刷新UI（等动画关闭后）
    setTimeout(() => {
      _renderDungeonUIAuto();
    }, 2800);
  } else {
    // 无动画支持：直接开箱
    _dungeonAddItem(loot.id, loot.qty);
    cell.cleared = true;
    ds.clearedRooms++;
    dungeonSave();
    showToast(`📦 开箱获得：${label}`);
    _dgLog(`📦 打开宝箱，获得了 ${label}！`);
    _renderDungeonUIAuto();
  }
}

// 处理陷阱宝箱
function _handleTrapChest(cell, row, col) {
  const ds = _dungeonState;
  
  // 显示陷阱宝箱弹窗
  const modal = document.createElement('div');
  modal.className = 'dg-event-modal';
  modal.id = 'dgTrapChestModal';
  
  modal.innerHTML = `
<div class="dg-event-box">
  <div class="dg-event-title" style="color:#e05040">⚠️ 陷阱宝箱！</div>
  <div class="dg-event-desc">这个宝箱看起来有些不对劲……可能是陷阱！</div>
  <div class="dg-event-choices">
    <button class="dg-choice-btn" onclick="dungeonTrapChestChoice('open')">强行打开</button>
    <button class="dg-choice-btn" onclick="dungeonTrapChestChoice('disarm')">尝试拆除陷阱</button>
    <button class="dg-choice-btn" onclick="dungeonTrapChestChoice('leave')">离开</button>
  </div>
</div>`;
  modal.dataset.row = row;
  modal.dataset.col = col;
  document.body.appendChild(modal);
}

// 陷阱宝箱选择
function dungeonTrapChestChoice(action) {
  const modal = document.getElementById('dgTrapChestModal');
  if (!modal) return;
  const row = parseInt(modal.dataset.row);
  const col = parseInt(modal.dataset.col);
  modal.remove();

  const ds = _dungeonState;
  const cell = ds.map[row][col];

  if (action === 'leave') {
    showToast('你选择了安全起见，离开了这个可疑的宝箱。');
    return;
  }

  if (action === 'open') {
    // 强行打开 - 必定触发陷阱
    const dmg = Math.round((edS.maxHp || 100) * 0.15);
    edS.hp = Math.max(1, (edS.hp || edS.maxHp) - dmg);
    
    // 但还是能获得奖励
    const tier = cell.lootTier || 'common';
    const loot = dungeonRollChestLoot(tier);
    _dungeonAddItem(loot.id, loot.qty);
    
    cell.cleared = true;
    ds.clearedRooms++;
    dungeonSave();
    
    showToast(`💥 触发陷阱！受到 ${dmg} 伤害，但获得了战利品。`);
    _dgLog(`💥 强行打开宝箱触发陷阱！气血 -${dmg}`);
    _renderDungeonUIAuto();
    return;
  }

  if (action === 'disarm') {
    // 尝试拆除 - 身法检定
    const playerSpd = (typeof edS !== 'undefined') ? (edS.spd || 8) : 8;
    const chance = Math.min(0.8, 0.4 + playerSpd * 0.02);

    if (Math.random() < chance) {
      // 成功拆除
      const tier = cell.lootTier || 'common';
      const loot = dungeonRollChestLoot(tier);
      _dungeonAddItem(loot.id, loot.qty);

      cell.cleared = true;
      ds.clearedRooms++;
      dungeonSave();

      showToast(`✅ 成功拆除陷阱！获得了宝箱中的物品。`);
      _dgLog(`✅ 巧妙拆除陷阱，获得战利品！`);
    } else {
      // 拆除失败
      const dmg = Math.round((edS.maxHp || 100) * 0.1);
      edS.hp = Math.max(1, (edS.hp || edS.maxHp) - dmg);

      showToast(`😓 拆除失败！受到 ${dmg} 伤害，宝箱也损坏了。`);
      _dgLog(`😓 拆除陷阱失败！气血 -${dmg}`);

      cell.cleared = true;
      ds.clearedRooms++;
      dungeonSave();
    }
    _renderDungeonUIAuto();
  }
}

// ───────────────────────────────────────────────────────────────────────────────
//  初始化：覆盖原函数
// ───────────────────────────────────────────────────────────────────────────────

// 保存原函数引用
const _originalDungeonTriggerEvent = typeof dungeonTriggerEvent === 'function' ? dungeonTriggerEvent : null;
const _originalDungeonOpenChest = typeof dungeonOpenChest === 'function' ? dungeonOpenChest : null;

// 覆盖为增强版本
dungeonTriggerEvent = dungeonTriggerEventEnhanced;
dungeonOpenChest = dungeonOpenChestEnhanced;

// 地下城房间探索增强系统已加载
