// npc-logic.js — 持久化 / 渲染 / 对话 / 商店 / 任务 / 关系互动
// 依赖: npc-data.js

// ── 玩家关系/任务/情报持久化 ──
const NPC_STATE_KEY = 'wuxia_npc_state';
let npcState = {
  relations:{},
  quests:{},
  readIntels:{},
  interactCounts:{},  // { npcId: { gift_silver:n, joke:n, treat_meal:n } }  终身次数
  lastInteractDay:{}, // { npcId_action: dayIndex }  每日冷却
  topicsDone:{},      // { npcId_topicId: true }      话题已触发过
  giftTopics:{},      // { npcId: topicObj }          送礼临时解锁的话题
  questDoneFor:{},    // { npcId: true }              是否完成过该NPC至少一个任务
  alignQuests:{},     // { questId: questObj }        动态阵营任务缓存
  questLastDone:{},   // { questId: gameDay }         重复任务上次完成的游戏天数
  questChainUnlock:{},// { chainId_step: true }       连环任务解锁状态
  lastDecayDay: 0,   // 上次好感衰减时的游戏天数（用于统一时间基准）
};

function npcStateLoad(){
  try{
    const raw = localStorage.getItem(NPC_STATE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      if(d){
        // 兼容旧存档：补齐新字段（含 npc-combat.js 需要的 deaths/npcInsts）
        npcState = Object.assign({
          relations:{}, interactCounts:{}, lastInteractDay:{}, topicsDone:{},
          giftTopics:{}, questDoneFor:{}, alignQuests:{},
          questLastDone:{}, questChainUnlock:{},
          deaths:{}, npcInsts:{}, npcMoods:{}, lastDecayDay:0
        }, d);
        // 确保 relations 不为空（旧存档可能没有）
        if(!npcState.relations) npcState.relations = {};
        // 确保 deaths/npcInsts 不为 null/undefined（旧存档可能存了 null）
        if(!npcState.deaths)  npcState.deaths  = {};
        if(!npcState.npcInsts) npcState.npcInsts = {};
      }
    }
  }catch(e){}
}
function npcStateSave(){
  localStorage.setItem(NPC_STATE_KEY, JSON.stringify(npcState));
}

// ── NPC 阵营系统：根据 NPC 所属门派/职业 推断阵营
// alignment: 'righteous' | 'neutral' | 'chaotic' | 'evil'
function getNpcAlignment(npcId){
  const npc = NPC_DB[npcId];
  if(!npc) return 'neutral';
  // 1. NPC 本身有 alignment 字段
  if(npc.alignment) return npc.alignment;
  // 2. 根据所属门派推断
  if(npc.sect){
    const sect = (typeof SECTS !== 'undefined') ? SECTS.find(s=>s.id===npc.sect) : null;
    if(sect && sect.alignment) return sect.alignment;
  }
  // 3. 根据城市所属门派推断（门派据点NPC）
  if(npc.city && typeof WORLD_NODES !== 'undefined'){
    const node = WORLD_NODES[npc.city];
    if(node && node.sects && node.sects.length > 0){
      const sectId = node.sects[0];
      const sect = (typeof SECTS !== 'undefined') ? SECTS.find(s=>s.id===sectId) : null;
      if(sect && sect.alignment) return sect.alignment;
    }
  }
  // 4. 角色职业关键词推断
  const role = (npc.role||'').toLowerCase();
  if(/盗|贼|匪|盗贼|刺客|杀手|海盗/.test(npc.role)) return 'evil';
  if(/官|衙|捕快|知府|太守|皇|朝廷/.test(npc.role)) return 'neutral';
  return 'neutral';
}

// ── 计算 NPC 与玩家的初始好感基准值
// 规则：玩家善恶（edS.karma -100~100）× NPC阵营 → 初始值
function calcNpcInitRel(npcId){
  // 优先从 edS.karma 读取（karma-system.js），向后兼容 jianghuState
  let playerAlign = 0;
  if (typeof edS !== 'undefined' && edS.karma !== undefined && edS.karma !== null) {
    playerAlign = edS.karma;
  } else if (typeof jianghuState !== 'undefined' && jianghuState.reputation) {
    playerAlign = jianghuState.reputation.alignment || 0;
  }
  const npcAlign = getNpcAlignment(npcId);

  // 玩家善恶值分档
  const isRighteous = playerAlign >= 30;    // 侠义之人
  const isEvil      = playerAlign <= -30;   // 邪道之人
  const isNeutral   = !isRighteous && !isEvil;

  switch(npcAlign){
    case 'righteous':
      if(isRighteous) return 15;   // 惺惺相惜
      if(isEvil)      return -40;  // 正邪不两立 → 仇敌起点
      return 0;                    // 陌路
    case 'evil':
      if(isEvil)      return 15;   // 同道中人
      if(isRighteous) return -40;  // 势不两立 → 仇敌起点
      return -10;                  // 略有戒备
    case 'chaotic':
      if(isEvil)      return 10;   // 还算合拍
      if(isRighteous) return -15;  // 不太顺眼
      return 0;
    case 'neutral':
    default:
      return 0;                    // 陌路，一视同仁
  }
}

// 获取/初始化与某 NPC 的关系值（-100~100）
// 首次访问时根据阵营计算初始值，而非直接给 0
function getNpcRel(npcId){
  if(npcState.relations[npcId] === undefined){
    npcState.relations[npcId] = calcNpcInitRel(npcId);
  }
  return npcState.relations[npcId];
}

function changeNpcRel(npcId, delta){
  console.log('[changeNpcRel] 被调用, npcId=', npcId, 'delta=', delta, new Error().stack);
  const cur = getNpcRel(npcId);
  // 阶段软上限：好感 ≥ 60 需完成过该NPC至少1个任务
  let cap = 100;
  if(!npcState.questDoneFor[npcId]) cap = 59;
  const next = Math.max(-100, Math.min(cap, cur + delta));
  npcState.relations[npcId] = next;
  npcStateSave();
}
function _changeNpcRelDirect(npcId, delta){
  console.log('[_changeNpcRelDirect] 被调用, npcId=', npcId, 'delta=', delta, new Error().stack);
  const cur = getNpcRel(npcId);
  npcState.relations[npcId] = Math.max(-100, Math.min(100, cur + delta));
  npcStateSave();
}

// ── 高好感福利检查（每次打开对话低概率触发）──
// 好感90+：15%概率主动送礼或提供情报
// 好感100：标记"知己"，额外展示庇护选项
const _highRelBenefitCooldown = {}; // npcId -> lastGameDay
function _checkHighRelBenefits(npcId, npc, rel){
  if(rel < 90) return;
  // 每个游戏天最多触发一次
  const today = (typeof edS !== 'undefined' && edS.gameDay != null) ? edS.gameDay : 0;
  if(_highRelBenefitCooldown[npcId] === today) return;

  // 好感100知己称号展示（每天第一次开对话弹一次提示）
  if(rel >= 100){
    _highRelBenefitCooldown[npcId] = today;
    // 10%概率庇护提示
    if(Math.random() < 0.10){
      const shelterMsgs = [
        `${npc.name}悄悄对你说："少侠，若有一天你被官府追捕，来找我，我会安排你藏身。"`,
        `${npc.name}压低声音："你我已是至交。若你遭难，某愿以身家性命相保。"`,
        `${npc.name}握住你的手："江湖险恶，若你有难，我家的后门永远为你敞开。"`,
      ];
      const msg = shelterMsgs[Math.floor(Math.random()*shelterMsgs.length)];
      setTimeout(()=> showToast && showToast(`✦ 知己：${msg}`, 'info', 5000), 800);
      return;
    }
  }

  // 好感90+：15%概率主动送礼或情报
  if(Math.random() > 0.15) return;
  _highRelBenefitCooldown[npcId] = today;

  const roll = Math.random();
  if(roll < 0.55){
    // 送礼：给玩家一点银两
    const silver = 10 + Math.floor(Math.random() * 20);
    if(typeof SilverManager !== 'undefined'){
      SilverManager.add(silver);
      SilverManager.save();
    }
    const giftMsgs = [
      `${npc.name}笑道："今日心情好，这点银子你拿去花。"`,
      `${npc.name}悄悄塞给你一包银两："出门在外，手头宽裕些好。"`,
      `${npc.name}道："上次你帮了我，一直没机会答谢，这${silver}两算我的心意。"`,
      `${npc.name}从袖中摸出银两："拿着，别客气，朋友之间嘛。"`,
    ];
    setTimeout(()=> showToast && showToast(`🎁 ${giftMsgs[Math.floor(Math.random()*giftMsgs.length)]}（+${silver}两）`, 'good', 4000), 600);
  } else {
    // 主动提供情报（加好感积累感）
    const intelMsgs = [
      `${npc.name}凑近你耳边："听说近日${['少林','武当','华山','丐帮','明教'][Math.floor(Math.random()*5)]}有大事要发生，你留心些。"`,
      `${npc.name}道："最近${['北边','东边','西域','江南'][Math.floor(Math.random()*4)]}闹得厉害，贸然去了小心遭殃。"`,
      `${npc.name}压低声音："我听说城外有个宝藏，不过守卫颇多，你自己掂量。"`,
      `${npc.name}道："告诉你个秘密——城里某处有卖好东西的地方，外人不知道的。"`,
    ];
    const exp = 15 + Math.floor(Math.random()*15);
    if(typeof edS !== 'undefined' && typeof gainExp === 'function') gainExp(exp);
    setTimeout(()=> showToast && showToast(`📜 ${intelMsgs[Math.floor(Math.random()*intelMsgs.length)]}（+${exp}经验）`, 'info', 4500), 600);
  }
}

// ── 每日天数索引（以游戏内天数为准，无则用自然日）
function _getTodayIndex(){
  // 优先用游戏内天数（edS.gameDay 是 numeric 游戏天数）
  if(typeof edS !== 'undefined' && edS.gameDay != null) return edS.gameDay;
  // 次选 travelPlayerState.day（如果存在的话）
  if(typeof travelPlayerState !== 'undefined' && travelPlayerState.day) return travelPlayerState.day;
  // 退回：用自然日期字符串做 key
  return new Date().toISOString().slice(0,10);
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"NPC好感系统：送礼有惊喜也有惊吓
// ═══════════════════════════════════════════════════════════════
// ── 闲聊/赠礼互动的递减表（终身次数 → 好感增量）
const REL_INTERACT_TABLE = {
  gift_silver:  [6, 4, 2, 1, 0],      // 5两银子
  joke:         [4, 2, 1, 0],          // 讲笑话
  treat_meal:   [12, 8, 4, 2, 0],      // 请吃饭10两
  gift_item:    [4, 3, 2, 1, 1, 0],    // 赠送合心意的实物礼物
};

// ═══════════════════════════════════════════════════════════════
//  "将将胡"NPC好感系统扩展：更多互动事件
// ═══════════════════════════════════════════════════════════════
// ── 扩展互动随机事件 ──
const REL_LUCK_EVENTS = {
  // 原有事件
  hit_it_off: {
    chance: 0.08,  // 8%概率
    name: '特别投缘',
    icon: '💕',
    desc: '你们一见如故，相谈甚欢',
    mult: 2.0,
    message: (gain) => `💕 特别投缘！好感+${gain}（双倍！）`
  },
  backfire: {
    chance: 0.05,  // 5%概率
    name: '适得其反',
    icon: '💢',
    desc: '你的举动引起了对方的反感',
    mult: -0.5,
    message: (gain) => `💢 适得其反！好感${gain}（搞砸了！）`
  },
  pleasant_surprise: {
    chance: 0.03,  // 3%概率
    name: '意外之喜',
    icon: '✨',
    desc: '对方回赠了你一份礼物',
    mult: 1.0,
    bonusItem: true,
    message: (gain) => `✨ 意外之喜！好感+${gain}，对方还回赠了礼物！`
  },
  // 新增事件
  deep_conversation: {
    chance: 0.04,  // 4%概率
    name: '促膝长谈',
    icon: '🍵',
    desc: '你们聊得很投机，话题深入',
    mult: 1.5,
    bonusIntel: true, // 额外获得情报
    message: (gain) => `🍵 促膝长谈！好感+${gain}（1.5倍），还获得了江湖情报！`
  },
  misunderstanding: {
    chance: 0.03,  // 3%概率
    name: '误会一场',
    icon: '😰',
    desc: '你的好意被误解了',
    mult: -0.3,
    message: (gain) => `😰 误会一场！好感${gain}（略有下降）`
  },
  shared_memory: {
    chance: 0.025, // 2.5%概率
    name: '共同回忆',
    icon: '📸',
    desc: '你们发现有过相似的经历',
    mult: 2.5,
    unlockTopic: true, // 解锁新话题
    message: (gain) => `📸 共同回忆！好感+${gain}（2.5倍），解锁了新话题！`
  },
  awkward_silence: {
    chance: 0.035, // 3.5%概率
    name: '冷场尴尬',
    icon: '😅',
    desc: '一时找不到话题，气氛有些尴尬',
    mult: 0.5,
    message: (gain) => `😅 冷场尴尬...好感只+${gain}（减半）`
  },
  favor_returned: {
    chance: 0.02,  // 2%概率
    name: '投桃报李',
    icon: '🎁',
    desc: '对方非常感激，回赠了珍贵礼物',
    mult: 1.0,
    bonusRareItem: true, // 回赠稀有物品
    message: (gain) => `🎁 投桃报李！好感+${gain}，对方回赠了珍贵礼物！`
  },
  life_lesson: {
    chance: 0.015, // 1.5%概率
    name: '人生指点',
    icon: '📖',
    desc: '对方传授了你一些人生经验',
    mult: 1.0,
    bonusExp: true, // 获得经验
    message: (gain) => `📖 人生指点！好感+${gain}，你获得了经验值！`
  },
  secret_shared: {
    chance: 0.01,  // 1%概率
    name: '推心置腹',
    icon: '🔐',
    desc: '对方向你吐露了一个秘密',
    mult: 3.0,
    unlockSecretQuest: true, // 解锁隐藏任务
    message: (gain) => `🔐 推心置腹！好感+${gain}（三倍！），对方透露了一个秘密！`
  },
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"NPC好感恶搞事件
  // ═══════════════════════════════════════════════════════════════
  bad_breath: {
    chance: 0.025,  // 2.5%概率
    name: '口臭攻击',
    icon: '😷',
    desc: '对方刚吃了大蒜...',
    mult: 0.3,
    message: (gain) => `😷 对方刚吃了大蒜！你强忍着不适继续交谈...好感只+${gain}（太臭了！）`
  },
  fashion_disaster: {
    chance: 0.02,  // 2%概率
    name: '穿搭灾难',
    icon: '👔',
    desc: '你的穿搭让对方无法接受',
    mult: -0.2,
    message: (gain) => `👔 对方看着你的穿搭直摇头："少侠，你这品味..."好感${gain}（被嫌弃了！）`
  },
  bad_joke: {
    chance: 0.03,  // 3%概率
    name: '冷笑话',
    icon: '🥶',
    desc: '你讲了个超冷的笑话',
    mult: 0.4,
    message: (gain) => `🥶 你讲了个笑话，对方愣了三秒，干笑了两声...好感只+${gain}（好冷...）`
  },
  sudden_dance: {
    chance: 0.015, // 1.5%概率
    name: '即兴尬舞',
    icon: '💃',
    desc: '你突然跳起舞来',
    mult: 0.6,
    message: (gain) => `💃 你一时兴起跳了段舞，对方看得目瞪口呆...好感只+${gain}（太尴尬了！）`
  },
  food_poisoning: {
    chance: 0.01,  // 1%概率
    name: '食物中毒',
    icon: '🤢',
    desc: '你请对方吃的饭有问题',
    mult: -0.8,
    message: (gain) => `🤢 对方吃完你请的饭后脸色发绿...好感${gain}（你下毒了吗？！）`
  },
  twin_meeting: {
    chance: 0.008, // 0.8%概率
    name: '认错人',
    icon: '👯',
    desc: '对方把你认成了别人',
    mult: 1.0,
    bonusMistaken: true,
    message: (gain) => `👯 对方激动地说："二狗子！你怎么来了！"然后发现认错了人...好感+${gain}（好尴尬但挺有趣）`
  },
  sudden_proposal: {
    chance: 0.005, // 0.5%概率
    name: '突然求婚',
    icon: '💍',
    desc: '气氛到了，你脱口而出...',
    mult: -1.0,
    message: (gain) => `💍 你一时冲动说"嫁给我吧"！对方愣住，然后给了你一巴掌...好感${gain}（太唐突了！）`
  },
  fortune_telling: {
    chance: 0.012, // 1.2%概率
    name: '算命大师',
    icon: '🔮',
    desc: '对方突然要给你算命',
    mult: 1.2,
    bonusFortune: true,
    message: (gain) => `🔮 对方给你算了一卦："少侠，你命里缺我！"好感+${gain}（这是什么套路？）`
  },
  sneeze_in_face: {
    chance: 0.018, // 1.8%概率
    name: '喷嚏攻击',
    icon: '🤧',
    desc: '你突然打了个喷嚏',
    mult: 0.2,
    message: (gain) => `🤧 阿嚏！你打了个喷嚏，正好喷在对方脸上...好感只+${gain}（太丢人了！）`
  },
  shared_enemy: {
    chance: 0.02,  // 2%概率
    name: '共同敌人',
    icon: '😈',
    desc: '你们发现都讨厌同一个人',
    mult: 1.8,
    message: (gain) => `😈 你们发现都讨厌隔壁村的王二狗！相见恨晚！好感+${gain}（敌人的敌人就是朋友！）`
  },
};

// ── 回赠物品池 ──
const REL_GIFT_ITEMS = {
  common: [
    { id: 'item_food_ration', name: '干粮', icon: '🥖' },
    { id: 'item_drink_water', name: '清水', icon: '💧' },
    { id: 'item_heal_low', name: '金疮药', icon: '🩹' },
  ],
  uncommon: [
    { id: 'item_elixir_low', name: '小还丹', icon: '💊' },
    { id: 'item_wine_jar', name: '老酒', icon: '🍶' },
    { id: 'item_tea_leaf', name: '茶叶', icon: '🍃' },
  ],
  rare: [
    { id: 'item_elixir_mid', name: '大还丹', icon: '💊' },
    { id: 'item_scroll_random', name: '随机功法残卷', icon: '📜' },
    { id: 'item_gem_low', name: '低级宝石', icon: '💎' },
  ],
};

// ── 检查"将将胡"互动事件 ──
function _checkRelLuckEvent(){
  const roll = Math.random();
  let cumulative = 0;
  for(const [key, event] of Object.entries(REL_LUCK_EVENTS)){
    cumulative += event.chance;
    if(roll < cumulative) return { key, ...event };
  }
  return null; // 无事发生
}

// ── 获取回赠物品 ──
function _getRelGiftItem(rarity = 'common') {
  const pool = REL_GIFT_ITEMS[rarity] || REL_GIFT_ITEMS.common;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── 应用互动事件效果 ──
function _applyRelEventEffect(event, npcId, baseGain) {
  const result = { gain: baseGain, messages: [], items: [], unlocks: [] };
  
  // 计算实际好感变化
  result.gain = Math.round(baseGain * event.mult);
  
  // 额外奖励
  if (event.bonusItem) {
    const item = _getRelGiftItem('common');
    result.items.push(item);
    if (typeof consumableBagAdd === 'function') {
      consumableBagAdd(item.id, 1);
    }
  }
  
  if (event.bonusRareItem) {
    const item = _getRelGiftItem(Math.random() < 0.3 ? 'rare' : 'uncommon');
    result.items.push(item);
    if (typeof consumableBagAdd === 'function') {
      consumableBagAdd(item.id, 1);
    }
  }
  
  if (event.bonusIntel && typeof addIntel === 'function') {
    addIntel('random', 1);
    result.messages.push('获得江湖情报×1');
  }
  
  if (event.bonusExp && typeof addPlayerExp === 'function') {
    const expGain = 20 + Math.floor(Math.random() * 30);
    addPlayerExp(expGain, '人生指点');
    result.messages.push(`获得经验+${expGain}`);
  }
  
  if (event.unlockTopic) {
    result.unlocks.push('new_topic');
    result.messages.push('解锁新话题');
  }
  
  if (event.unlockSecretQuest) {
    result.unlocks.push('secret_quest');
    result.messages.push('解锁隐藏任务线索');
  }
  
  return result;
}

const NPC_GIFT_ITEM_TAGS = {
  item_alpha_pelt:    ['pelt','martial','raretrade'],
  item_alpha_fang:    ['fang','martial'],
  item_bear_gall:     ['medicinal','raretrade'],
  item_snake_gall:    ['medicinal','fang'],
  item_boar_tusk:     ['fang','martial'],
  item_ice_wolf_pelt: ['pelt','martial','raretrade'],
  item_frost_fang:    ['fang','mystic','martial'],
  item_fire_crystal:  ['ore','flame','raretrade'],
  item_flame_essence: ['flame','mystic','raretrade'],
  item_mechanism_core:['mechanism','ore','raretrade'],
  item_water_pearl:   ['pearl','medicinal','mystic'],
  item_thunder_core:  ['thunder','ore','raretrade'],
  item_sand_crystal:  ['ore','medicinal'],
  item_copper_core:   ['mechanism','ore'],
  item_dark_crystal:  ['dark','mystic','raretrade'],
  item_spirit_stone:  ['mystic','raretrade'],
  item_ghost_jade:    ['dark','mystic','raretrade'],
  item_beast_core:    ['mystic','martial','raretrade'],
  item_leopard_pelt:  ['pelt','martial','raretrade'],
  item_eagle_feather: ['martial','raretrade'],
  item_dragon_scale:  ['mystic','martial','raretrade'],
  item_iron_ore:      ['ore'],
  item_herb_gancao:   ['herb','medicinal'],
  item_river_mud:     ['oddity','medicinal'],
};

const NPC_GIFT_ROLE_PREFS = [
  {
    match:/郎中|神医|名医|医师|大夫|药师|毒医|毒师|巫医|跌打|杏林/,
    followupFlavor:'healer',
    label:'珍药药引与灵性之物',
    love:['medicinal','herb','pearl','mystic'],
    like:['raretrade'],
    questHint:'对方掂了掂礼物，语气松了些，像是愿意把一桩病案托付给你。',
    thanksLoved:[
      '这味材料来得正好，我正愁缺这一手。',
      '好，好，这样的东西入药最稳当，你这份心意我记下了。'
    ],
    thanksLiked:[
      '这东西虽不算绝品，却也正用得上。',
      '收下了，改日若有病家急需，说不定还要靠它救命。'
    ]
  },
  {
    match:/铁匠|刀匠|铸剑|铸兵|工匠|机关|巧匠|匠/,
    followupFlavor:'smith',
    label:'矿材机括与烈性矿晶',
    love:['ore','mechanism','flame','thunder'],
    like:['martial','raretrade'],
    questHint:'对方摩挲着材料，像是想起了手头那桩缺料的活计。',
    thanksLoved:[
      '好料！这一下真能上炉见火了。',
      '成，这材料够硬，正合我手头那件家伙什。'
    ],
    thanksLiked:[
      '这东西拿来试火候倒是不错。',
      '先收着，赶上赶工的时候正好派上用场。'
    ]
  },
  {
    match:/镖师|捕头|捕快|将军|护院|武师|拳师|刀客|剑客|猎户|游侠|豪客|镖头|镖局/,
    followupFlavor:'escort',
    label:'皮骨獠牙与硬派猎材',
    love:['pelt','fang','martial','thunder'],
    like:['ore','raretrade'],
    questHint:'对方掂量着这份硬货，像是愿意与你谈一桩刀口上的差事。',
    thanksLoved:[
      '这玩意儿够硬气，带在路上正合适。',
      '好东西，真要走镖拼命时，这种货最顶用。'
    ],
    thanksLiked:[
      '嗯，倒是件实用的行路货。',
      '行，这份礼不轻，我收下。'
    ]
  },
  {
    match:/书生|先生|谋士|隐士|道人|方士|术士|相士|说书|探子|密探|驿站|管事/,
    followupFlavor:'scholar',
    label:'异材灵物与阴脉奇珍',
    love:['mystic','dark','raretrade'],
    like:['pearl','pelt'],
    questHint:'对方眼神一动，像是想起了一件不便在大庭广众下明说的事。',
    thanksLoved:[
      '此物不俗，倒有几分值得深谈的意思。',
      '你竟舍得把这等东西拿出来……有意思。'
    ],
    thanksLiked:[
      '收下了，多少算是一份诚意。',
      '此物可留，可谈的事也就多了一分。'
    ]
  },
  {
    match:/僧|和尚|住持|方丈|道长|道姑|师太|真人|师父/,
    followupFlavor:'monk',
    label:'清修药材与温养灵物',
    love:['herb','medicinal','mystic'],
    like:['pearl','raretrade'],
    questHint:'对方念了声善哉，似乎愿意再与你谈一桩善后之事。',
    thanksLoved:[
      '此物清正温养，贫道正可拿来济人。',
      '善哉，这份心意比物件本身更难得。'
    ],
    thanksLiked:[
      '收下了，日后或可用在救人之时。',
      '多谢施赠，这份缘法贫僧记住了。'
    ]
  },
  {
    match:/丐帮|老叟|乞丐|乞儿|扒手|盗|贼|黑市|线人/,
    followupFlavor:'underworld',
    label:'好转手的稀罕货与阴路奇材',
    love:['raretrade','dark','fang'],
    like:['pelt','martial'],
    questHint:'对方收起礼物，压低了声音，像是准备另外开个话头。',
    thanksLoved:[
      '嘿，这东西可值钱，也够稀罕，算你会做人。',
      '好货！这下老叫花子可有门路周转了。'
    ],
    thanksLiked:[
      '不错，至少不是拿破烂糊弄我。',
      '行，老汉收下了，有些话也不是不能说。'
    ]
  },
  {
    match:/掌柜|客栈|酒馆|酒家|小二|商人|老板|首富/,
    followupFlavor:'merchant',
    label:'能镇店面又有转手余地的稀货',
    love:['raretrade','pearl','pelt'],
    like:['medicinal','ore'],
    questHint:'对方眼里多了几分亲近，像是终于肯把手头买卖说给你听。',
    thanksLoved:[
      '这东西摆在店里镇台面都够了，真是有心。',
      '好货，留着自用体面，转手也不亏。'
    ],
    thanksLiked:[
      '嗯，这礼送得还算讲究。',
      '成，给足了面子，往后好说话。'
    ]
  },
  {
    match:/乐师|琴师|舞姬|歌女|花魁|伶人/,
    followupFlavor:'performer',
    label:'体面华贵的珠玉奇珍',
    love:['pearl','raretrade','mystic'],
    like:['pelt'],
    questHint:'对方收下礼物后，眉眼都柔了些，似乎肯多说一句内情。',
    thanksLoved:[
      '这礼雅致，我喜欢。',
      '有这份眼力，倒不像寻常粗人。'
    ],
    thanksLiked:[
      '倒是件能见人的好物。',
      '多谢，这份礼我收得顺心。'
    ]
  },
];

const NPC_GIFT_FOLLOWUP_FLAVORS = {
  default: {
    questText: ({ questName }) => questName ? `追问「${questName}」` : '追问那桩差事',
    questReply: ({ questName }) => questName
      ? `对方压低声音道："既然你这么会做人，我这里正有一桩差事——${questName}。细节我已替你备好，去任务页看看。"`
      : '对方点了点头："你既懂礼数，我这里正好有件事想托付你。去任务页看看详情吧。"',
    intelText: () => '请他细说那条消息',
    intelReply: ({ intelText }) => `对方见你识趣，便把声音压得更低了些："${intelText}"`,
    warmText: () => '顺着刚才的话问下去',
    warmReply: ({ npcName }) => `${npcName}语气缓了不少："礼我收了。你这人还算懂分寸，往后若真有事来问，我也不会像先前那样把话说死。"`,
    warmRelDelta: 2,
  },
  healer: {
    questText: ({ questName }) => questName ? `追问「${questName}」病案` : '追问那桩病案',
    questReply: ({ questName }) => questName
      ? `对方把药包往袖里一拢，低声道："正有个棘手病案拖着没下文——${questName}。该去哪里、要备什么药材，我都给你记在任务页里了。"`
      : '对方压低嗓音道："我这里正卡着一桩病案，缺人跑腿也缺药引。你去任务页看看，我把能交代的都写下了。"',
    intelText: () => '请他细说那味药引',
    intelReply: ({ intelText }) => `对方捻着药材边角，压低嗓音道："${intelText}"`,
    warmText: () => '顺着药案问下去',
    warmReply: ({ npcName }) => `${npcName}看了你一眼，语气温和了些："你懂人情，也懂分寸。往后若有疑难病案来问，我不会再拿寻常话打发你。"`,
  },
  smith: {
    questText: ({ questName }) => questName ? `追问「${questName}」缺料活` : '追问那桩缺料活',
    questReply: ({ questName }) => questName
      ? `对方把料子在掌心一掂，咧嘴道："炉上正卡着一件活——${questName}。缺什么料、去哪儿取，我都给你列进任务页了。"`
      : '对方敲了敲铁砧道："我手头有件活正缺料，也缺个能办事的人。去任务页看看，我把门路都写明了。"',
    intelText: () => '请他细说那炉边消息',
    intelReply: ({ intelText }) => `对方往炉火边偏了偏头，低声道："${intelText}"`,
    warmText: () => '顺着炉上的事问下去',
    warmReply: ({ npcName }) => `${npcName}敲了敲铁砧："你这礼送得实在。往后若有铸造上的门道，我愿意多跟你透两句。"`,
  },
  escort: {
    questText: ({ questName }) => questName ? `追问「${questName}」这趟差事` : '追问那趟路上的事',
    questReply: ({ questName }) => questName
      ? `对方抬手压了压刀鞘，沉声道："路上正缺个靠得住的人——${questName}。路线、麻烦、接头处，都在任务页里。"`
      : '对方把声音压低了些："我这边正有一趟不太平的活，得找个站得住的人。去任务页看看路线和细节。"',
    intelText: () => '请他细说路上的风声',
    intelReply: ({ intelText }) => `对方扫了眼四周，低声道："${intelText}"`,
    warmText: () => '顺着刀口上的事问下去',
    warmReply: ({ npcName }) => `${npcName}点了点头："你这人还算站得住。以后若真有押镖、探路的险活，我会先想到你。"`,
  },
  scholar: {
    questText: ({ questName }) => questName ? `追问「${questName}」这件隐事` : '追问那件隐秘差事',
    questReply: ({ questName }) => questName
      ? `对方拢了拢衣袖，淡淡道："此事不便张扬——${questName}。我把能说的都留在任务页里，你自己去看。"`
      : '对方目光微动："这事不宜在大庭广众下说。我已把可交代的都记在任务页里，你自去细看。"',
    intelText: () => '请他把那条口风说透',
    intelReply: ({ intelText }) => `对方沉吟片刻，慢慢道："${intelText}"`,
    warmText: () => '顺着话缝问下去',
    warmReply: ({ npcName }) => `${npcName}笑意浅了些，却不再防你："既然你懂轻重，有些话我便不必再绕着说。"`,
  },
  monk: {
    questText: ({ questName }) => questName ? `追问「${questName}」这桩善后事` : '追问那桩善后事',
    questReply: ({ questName }) => questName
      ? `对方合十低声道："近来正有一桩善后之事无人照看——${questName}。去任务页看看，若愿意出手，也是积一分善缘。"`
      : '对方轻声念了句善哉："我这里有桩善后之事，需要个肯出力的人。详情我已放在任务页里，你可自去看看。"',
    intelText: () => '请他细说那段因果',
    intelReply: ({ intelText }) => `对方轻声道了句善哉，随即低声道："${intelText}"`,
    warmText: () => '顺着缘由问下去',
    warmReply: ({ npcName }) => `${npcName}微微颔首："你这份心意不在轻重，在于来得正。往后若有因果未了，我愿与你多说两句。"`,
  },
  underworld: {
    questText: ({ questName }) => questName ? `追问「${questName}」这条路子` : '顺着黑话继续问',
    questReply: ({ questName }) => questName
      ? `对方把礼物往怀里一收，嘿了一声："既然你懂规矩，这条路子就让你沾一手——${questName}。去哪儿碰头、找谁递话，任务页里写着。"`
      : '对方先左右看了两眼，这才压低声音："你既会做人，那我也给你指条路。去任务页看，我把该避的人和该走的口子都写下了。"',
    intelText: () => '请他把黑话讲明',
    intelReply: ({ intelText }) => `对方贴近了些，几乎是从牙缝里挤出一句："${intelText}"`,
    warmText: () => '顺着口风继续挖',
    warmReply: ({ npcName }) => `${npcName}咧嘴一笑："行，你这人能处。有些不上台面的话，往后我也肯先知会你一声。"`,
  },
  merchant: {
    questText: ({ questName }) => questName ? `追问「${questName}」这笔买卖` : '追问那笔买卖',
    questReply: ({ questName }) => questName
      ? `对方指尖轻敲桌案："正好有笔买卖缺个稳妥人接手——${questName}。来路、去处、价码，我都写在任务页里了。"`
      : '对方把礼物收进柜后，笑道："既然你给足了面子，我这里正好有笔买卖想让你接。细节都在任务页里。"',
    intelText: () => '请他细说这桩行情',
    intelReply: ({ intelText }) => `对方把声音压到柜台后头："${intelText}"`,
    warmText: () => '顺着买卖问下去',
    warmReply: ({ npcName }) => `${npcName}笑着把礼物收好："给足了面子，买卖就好谈。往后有什么路子，我会先给你留个口信。"`,
  },
  performer: {
    questText: ({ questName }) => questName ? `追问「${questName}」台后的事` : '追问台后的那桩事',
    questReply: ({ questName }) => questName
      ? `对方将礼物收入袖中，眼波一转："这份人情我认。正有一桩不便在台前明说的事——${questName}。细节都留在任务页里，你去看。"`
      : '对方收了笑，轻声道："有些事只适合在幕后说。我把能交代的都写进任务页里，你去看便知。"',
    intelText: () => '请他细说台后的内情',
    intelReply: ({ intelText }) => `对方敛了笑意，轻声道："${intelText}"`,
    warmText: () => '顺着话头再问一句',
    warmReply: ({ npcName }) => `${npcName}眉眼柔了些："你这礼送得体面，我也不拿场面话敷衍你。往后若有内情，我会让你先知道。"`,
  },
};

function _uniqueStrings(list){
  return [...new Set((list || []).filter(Boolean))];
}

function getNpcGiftProfile(npc){
  const explicit = npc?.giftPrefs || null;
  const base = NPC_GIFT_ROLE_PREFS.find(p => p.match.test(npc?.role || '')) || null;
  const followupFlavor = explicit?.followupFlavor || base?.followupFlavor || 'default';
  const profile = {
    label: explicit?.label || base?.label || '',
    love: [...(base?.love || [])],
    like: [...(base?.like || [])],
    thanksLoved: [...(base?.thanksLoved || [])],
    thanksLiked: [...(base?.thanksLiked || [])],
    questHint: explicit?.questHint || base?.questHint || '',
    followupFlavor,
    followup: Object.assign({}, NPC_GIFT_FOLLOWUP_FLAVORS.default || {}, NPC_GIFT_FOLLOWUP_FLAVORS[followupFlavor] || {}, explicit?.followup || {}),
  };
  if(explicit){
    if(Array.isArray(explicit.love)) profile.love.push(...explicit.love);
    if(Array.isArray(explicit.like)) profile.like.push(...explicit.like);
    if(Array.isArray(explicit.thanksLoved)) profile.thanksLoved.push(...explicit.thanksLoved);
    if(Array.isArray(explicit.thanksLiked)) profile.thanksLiked.push(...explicit.thanksLiked);
    if(explicit.label) profile.label = explicit.label;
    if(explicit.questHint) profile.questHint = explicit.questHint;
    if(explicit.followupFlavor) profile.followupFlavor = explicit.followupFlavor;
  }
  profile.love = _uniqueStrings(profile.love);
  profile.like = _uniqueStrings(profile.like.filter(tag => !profile.love.includes(tag)));
  profile.thanksLoved = _uniqueStrings(profile.thanksLoved);
  profile.thanksLiked = _uniqueStrings(profile.thanksLiked);
  return profile;
}

function getNpcGiftBaseState(npcId){
  const dayKey = npcId + '_gift_item';
  const today = _getTodayIndex();
  const usedToday = (npcState.lastInteractDay || {})[dayKey] === today;
  const table = REL_INTERACT_TABLE.gift_item || [];
  const done = ((npcState.interactCounts || {})[npcId] || {}).gift_item || 0;
  const baseGain = done < table.length ? table[done] : 0;
  let reason = '';
  if(usedToday) reason = '今日已经送过礼了';
  else if(baseGain <= 0) reason = '对方已把你的礼数视作寻常';
  return { usedToday, done, baseGain, reason };
}

function _npcGiftValueTier(meta){
  const price = meta?.sellPrice || 0;
  if(price >= 1000) return 6;
  if(price >= 400) return 5;
  if(price >= 200) return 4;
  if(price >= 80) return 3;
  if(price >= 30) return 2;
  return 1;
}

function _npcGiftPick(lines, fallback){
  const pool = (lines || []).filter(Boolean);
  if(!pool.length) return fallback || '';
  return pool[Math.floor(Math.random() * pool.length)] || fallback || '';
}

function _resolveNpcGiftFollowupValue(value, context, fallback){
  if(typeof value === 'function'){
    try {
      return value(context) || fallback || '';
    } catch(_err){
      return fallback || '';
    }
  }
  return value || fallback || '';
}

function _trimNpcIntelText(text, limit){
  const str = String(text || '').replace(/\s+/g, ' ').trim();
  if(!str) return '';
  const max = limit || 34;
  return str.length > max ? (str.slice(0, max) + '…') : str;
}

function _setNpcSpeechBubble(text){
  const bubble = document.querySelector('.npc-speech-bubble .npc-speech-text');
  if(bubble && text) bubble.textContent = `「${text}」`;
}

function _getNpcGiftTopicStore(){
  if(!npcState.giftTopics) npcState.giftTopics = {};
  return npcState.giftTopics;
}

function _clearNpcGiftFollowupTopic(npcId, shouldSave){
  const store = _getNpcGiftTopicStore();
  if(!store[npcId]) return;
  delete store[npcId];
  if(shouldSave !== false) npcStateSave();
}

function _getNpcGiftFollowupTopic(npcId){
  const topic = _getNpcGiftTopicStore()[npcId];
  if(!topic) return null;
  const today = _getTodayIndex();
  if(topic.expiresDay !== undefined && topic.expiresDay < today){
    _clearNpcGiftFollowupTopic(npcId);
    return null;
  }
  return topic;
}

function _saveNpcGiftFollowupTopic(npcId, topic){
  if(!npcId || !topic) return null;
  const store = _getNpcGiftTopicStore();
  store[npcId] = topic;
  npcStateSave();
  return topic;
}

function _getNpcGiftAvailableQuestIds(npcId, cityId){
  const npc = NPC_DB[npcId];
  if(!npc) return [];
  const currentCityId = cityId || _curCityId || npc.city || null;
  const dynQuests = currentCityId ? genAlignmentQuests(npcId, currentCityId) : [];
  const allQuestIds = [...(npc.quests || []), ...dynQuests.map(q => q.id)];
  return [...new Set(allQuestIds.filter(qid => {
    const q = getAnyQuest(qid);
    if(!q) return false;
    if(getQuestStatus(qid) !== 'available') return false;
    return isQuestAvailable(qid, npcId, currentCityId);
  }))];
}

function _buildNpcGiftFollowupTopic(npcId, gift, beforeRel, afterRel, beforeQuestIds, afterQuestIds){
  const npc = NPC_DB[npcId];
  if(!npc || !gift) return null;

  const profile = getNpcGiftProfile(npc);
  const followup = profile.followup || NPC_GIFT_FOLLOWUP_FLAVORS.default || {};
  const today = _getTodayIndex();
  const base = {
    expiresDay: today + 1,
    relDelta: 0,
  };
  const newlyUnlocked = (afterQuestIds || []).filter(qid => !(beforeQuestIds || []).includes(qid));

  if(newlyUnlocked.length > 0){
    const firstQuest = getAnyQuest(newlyUnlocked[0]);
    const context = {
      npc,
      npcName: npc.name,
      role: npc.role || '',
      gift,
      beforeRel,
      afterRel,
      profile,
      quest: firstQuest || null,
      questName: firstQuest?.name || '',
    };
    return {
      ...base,
      id: `gift_followup_quest_${today}`,
      text: _resolveNpcGiftFollowupValue(
        followup.questText,
        context,
        firstQuest?.name ? `追问「${firstQuest.name}」` : '追问那桩差事'
      ),
      reply: _resolveNpcGiftFollowupValue(
        followup.questReply,
        context,
        firstQuest?.name
          ? `对方压低声音道："既然你这么会做人，我这里正有一桩差事——${firstQuest.name}。细节我已替你备好，去任务页看看。"`
          : '对方点了点头："你既懂礼数，我这里正好有件事想托付你。去任务页看看详情吧。"'
      ),
      action: 'open_quest_tab',
    };
  }

  if(gift.matchType === 'love' && Array.isArray(npc.intels) && npc.intels.length && typeof INTEL_DB !== 'undefined'){
    const intelId = npc.intels.find(iid => INTEL_DB[iid]);
    const intel = intelId ? INTEL_DB[intelId] : null;
    if(intel?.text){
      const context = {
        npc,
        npcName: npc.name,
        role: npc.role || '',
        gift,
        beforeRel,
        afterRel,
        profile,
        intel,
        intelId,
        intelText: intel.text,
        intelLabel: intel.label || '消息',
      };
      return {
        ...base,
        id: `gift_followup_intel_${today}`,
        text: _resolveNpcGiftFollowupValue(followup.intelText, context, '请他细说那条消息'),
        reply: _resolveNpcGiftFollowupValue(
          followup.intelReply,
          context,
          `对方见你识趣，便把声音压得更低了些："${intel.text}"`
        ),
        intelId,
        action: 'open_intel_tab',
      };
    }
  }

  if(beforeRel < 20 && afterRel >= 20){
    const context = {
      npc,
      npcName: npc.name,
      role: npc.role || '',
      gift,
      beforeRel,
      afterRel,
      profile,
    };
    return {
      ...base,
      id: `gift_followup_warm_${today}`,
      text: _resolveNpcGiftFollowupValue(followup.warmText, context, '顺着刚才的话问下去'),
      reply: _resolveNpcGiftFollowupValue(
        followup.warmReply,
        context,
        `${npc.name}语气缓了不少："礼我收了。你这人还算懂分寸，往后若真有事来问，我也不会像先前那样把话说死。"`
      ),
      relDelta: Number.isFinite(followup.warmRelDelta) ? followup.warmRelDelta : 2,
    };
  }

  return null;
}

function _getNpcDialogStage(rel){
  return rel <= -60 ? 'hostile'
    : rel <= -20 ? 'guarded'
    : rel >= 80 ? 'close'
    : rel >= 60 ? 'friendly'
    : 'neutral';
}

function _getNpcTopicDoneKey(npcId, topicId){
  return npcId + '_' + topicId;
}

function _isNpcTopicDone(npcId, topicId){
  return !!(npcState.topicsDone && npcState.topicsDone[_getNpcTopicDoneKey(npcId, topicId)]);
}

function _pickNpcStageValue(source, rel){
  if(source === undefined || source === null) return null;
  if(Array.isArray(source)){
    return source.length ? source[Math.floor(Math.random() * source.length)] : null;
  }
  if(typeof source !== 'object') return source;

  const stage = _getNpcDialogStage(rel);
  const stagePools = {
    hostile: [source.hostile, source.guarded, source.neutral, source.default],
    guarded: [source.guarded, source.neutral, source.default],
    neutral: [source.neutral, source.default, source.friendly],
    friendly:[source.friendly, source.neutral, source.default],
    close:   [source.close, source.friendly, source.neutral, source.default],
  }[stage] || [source.default, source.neutral];

  for(const candidate of stagePools){
    if(Array.isArray(candidate) && candidate.length){
      return candidate[Math.floor(Math.random() * candidate.length)];
    }
    if(candidate !== undefined && candidate !== null && candidate !== '') return candidate;
  }
  return null;
}

function _pickNpcGreeting(npc, rel){
  return _pickNpcStageValue(npc?.greetings, rel) || '';
}

function _getNpcDialogRuleList(rule, singleKey, multiKey){
  if(Array.isArray(rule?.[multiKey])) return rule[multiKey].filter(Boolean);
  return rule?.[singleKey] ? [rule[singleKey]] : [];
}

function _normalizeNpcQuestStateRule(entry){
  if(!entry) return null;
  if(typeof entry === 'string') return { questId:entry, statuses:['claimed'] };
  if(typeof entry !== 'object') return null;
  const questId = entry.questId || entry.id || entry.quest;
  if(!questId) return null;
  const statuses = Array.isArray(entry.statuses)
    ? entry.statuses.filter(Boolean)
    : [entry.status || entry.state].filter(Boolean);
  return { questId, statuses };
}

function _matchesNpcQuestStateRule(entry){
  const rule = _normalizeNpcQuestStateRule(entry);
  if(!rule) return false;
  const curStatus = getQuestStatus(rule.questId);
  if(!rule.statuses.length) return curStatus === 'claimed';
  return rule.statuses.includes(curStatus);
}

function _npcDialogRuleMatches(rule, npcId, rel){
  if(!rule) return false;
  if(rule.minRel && rel < rule.minRel) return false;
  if(Number.isFinite(rule.maxRel) && rel > rule.maxRel) return false;

  const requires = _getNpcDialogRuleList(rule, 'requiresTopic', 'requiresTopics');
  if(requires.some(reqId => !_isNpcTopicDone(npcId, reqId))) return false;

  const excludes = _getNpcDialogRuleList(rule, 'excludesTopic', 'excludesTopics');
  if(excludes.some(reqId => _isNpcTopicDone(npcId, reqId))) return false;

  const requiresQuestStates = _getNpcDialogRuleList(rule, 'requiresQuestState', 'requiresQuestStates');
  if(requiresQuestStates.some(entry => !_matchesNpcQuestStateRule(entry))) return false;

  const excludesQuestStates = _getNpcDialogRuleList(rule, 'excludesQuestState', 'excludesQuestStates');
  if(excludesQuestStates.some(entry => _matchesNpcQuestStateRule(entry))) return false;

  // ── 门派归属检查：requiresSect:'sect_id' 时，玩家必须已加入该门派 ──
  if(rule.requiresSect){
    const edS = window.edS || {};
    if(edS.sect !== rule.requiresSect) return false;
  }
  if(rule.excludesSect){
    const edS = window.edS || {};
    if(edS.sect === rule.excludesSect) return false;
  }

  return true;
}


function _resolveNpcGreeting(npc, npcId, rel){
  // ── 叛门专属台词：玩家叛出了该NPC所属门派 ──
  const betrayalGreeting = _getBetrayalGreeting(npc, npcId, rel);
  if(betrayalGreeting) return betrayalGreeting;

  const override = Array.isArray(npc?.greetingOverrides)
    ? npc.greetingOverrides.find(rule => _npcDialogRuleMatches(rule, npcId, rel))
    : null;
  const greetingSource = override
    ? (override.greetings ?? override.textStages ?? override.text)
    : npc?.greetings;

  // 心情问候优先于普通问候（心情越强烈越优先）
  const mood = typeof getMoodGreeting === 'function' ? getMoodGreeting(npcId, rel, null) : null;
  if(mood && mood.level >= 2) {
    // 心情强烈时直接用心情问候
    return mood.text;
  }
  if(mood && mood.level === 1) {
    // 心情轻微时：30%概率心情问候
    if(Math.random() < 0.30) return mood.text;
  }

  let greeting = _pickNpcStageValue(greetingSource, rel) || '';

  // 世界事件对 NPC 对话的动态影响（追加后缀）
  if(greeting && typeof weGetNpcGreetingModifier === 'function'){
    const mod = weGetNpcGreetingModifier(npcId);
    if(mod) greeting = greeting.replace(/[。！？…]?\s*$/, '') + '，' + mod.trim() + '。';
  }

  // 善恶值对 NPC 态度的影响（善恶极端时追加特殊修饰语）
  if(greeting && typeof getKarmaDialogueModifier === 'function'){
    const npcAlign = getNpcAlignment(npcId);
    const karmaMod = getKarmaDialogueModifier(npcAlign, edS.karma || 0);
    if(karmaMod) greeting = greeting.replace(/[。！？…]?\s*$/, '') + '，' + karmaMod.trim() + '。';
  }

  return greeting;
}

/**
 * 叛门专属台词：玩家叛出了 npc.sect 对应门派时返回专属文案
 */
function _getBetrayalGreeting(npc, npcId, rel){
  if(!npc || !npc.sect) return null;
  const edS = window.edS;
  if(!edS || !Array.isArray(edS.banishedSects)) return null;
  if(!edS.banishedSects.includes(npc.sect)) return null;

  // 检查冷却是否还在（冷却期内才显示叛徒台词）
  if(!edS.sectLeaveCooldown || edS.sectLeaveCooldown <= Date.now()) return null;

  // 按当前好感阶段返回不同程度的"记恨"文案
  const npcName = npc.name || npcId;
  const sectNpc = npc;

  // 文案池（按好感分档）
  const hostilePool = [
    `${npcName}冷冷地看了你一眼，别过脸去，什么都没说。`,
    `"叛徒还有脸来？"${npcName}的眼神像刀。`,
    `${npcName}向旁边挪了挪步，像是避开了什么脏东西。`
  ];
  const guardedPool = [
    `${npcName}神色冷淡："你找我有什么事？"`,
    `"……说话就说话，废话少说。"${npcName}不看你的眼睛。`,
    `${npcName}叹了一口气，没有平时那种热络的神情。`
  ];

  if(rel <= 0){
    return hostilePool[Math.floor(Math.random() * hostilePool.length)];
  } else if(rel < 20){
    return guardedPool[Math.floor(Math.random() * guardedPool.length)];
  }
  return null; // 好感恢复到20+后，不再显示叛徒专属台词
}

function _resolveNpcTopicText(tp, npcId, rel){
  const done = npcId && tp?.id ? _isNpcTopicDone(npcId, tp.id) : false;
  if(done){
    const doneStageText = _pickNpcStageValue(tp?.doneTextStages, rel);
    if(doneStageText) return doneStageText;
    if(tp?.doneText) return tp.doneText;
  }
  return _pickNpcStageValue(tp?.textStages, rel) || tp?.text || '';
}

function _resolveNpcTopicReply(tp, npcId, rel){
  const done = npcId && tp?.id ? _isNpcTopicDone(npcId, tp.id) : false;
  if(done){
    const repeatStageReply = _pickNpcStageValue(tp?.repeatReplyStages, rel);
    if(repeatStageReply) return repeatStageReply;
    if(tp?.repeatReply) return tp.repeatReply;
  }
  return _pickNpcStageValue(tp?.replyStages, rel) || tp?.reply || '';
}

function _npcTopicRequirementsMet(tp, npcId, rel){
  return _npcDialogRuleMatches(tp, npcId, rel);
}

function _getNpcDialogTopics(npcId, rel){
  const npc = NPC_DB[npcId];
  if(!npc) return [];
  const baseTopics = (npc.topics || []).filter(tp => {
    if(tp.once && _isNpcTopicDone(npcId, tp.id)) return false;
    if(!_npcTopicRequirementsMet(tp, npcId, rel)) return false;
    return true;
  });

  // ── 门派任务链话题 ──
  // 检查是否需要插入门派任务链话题
  let chainTopics = [];
  const playerSect = (typeof edS !== 'undefined') ? (edS.sect || null) : null;
  const npcSect = _getNpcSectId(npcId);

  if(
    npcSect &&
    playerSect === npcSect &&
    typeof SECT_CHAINS !== 'undefined' &&
    SECT_CHAINS[npcSect] &&
    npc.chainTopics
  ){
    const chainQuest = getCurrentSectChainQuest(npcSect);
    if(chainQuest && !isSectChainCompleted(npcSect)){
      // 只有第一章才显示门派任务链话题
      if(getSectChainProgress(npcSect).currentStep === 0){
        chainTopics = [npc.chainTopics.topic];
      }
    }
  }

  const followup = _getNpcGiftFollowupTopic(npcId);
  if(!followup || !_npcDialogRuleMatches(followup, npcId, rel)) return [...chainTopics, ...baseTopics];
  return [...chainTopics, { ...followup, giftFollowup:true }, ...baseTopics];
}


function renderNpcChatChoicesHtml(npcId, rel){
  const npc = NPC_DB[npcId];
  const topicBtns = _getNpcDialogTopics(npcId, rel).map(tp => {
    const suffix = tp.giftFollowup
      ? ' <span style="color:#d8b860;font-size:10px">（送礼解锁）</span>'
      : '';
    return `<button class="npc-chat-choice" onclick="npcDoTopic('${tp.id}','${npcId}')">${_resolveNpcTopicText(tp, npcId, rel)}${suffix}</button>`;
  }).join('');

  // ── 「随便聊聊」按钮：在任何阶段都可点，输出无功利闲话 ──
  const chitchatBtn = `<button class="npc-chat-choice npc-chitchat-btn" onclick="npcDoChitchat('${npcId}')" style="opacity:.65;font-style:italic">随便聊聊…</button>`;

  // ── 医馆NPC自动添加治疗服务按钮 ──
  let healBtn = '';
  if(npc && npc.category === 'medicine'){
    healBtn = `<button class="npc-chat-choice" onclick="npcDoTopic('heal_service','${npcId}')" style="background:rgba(60,120,60,.25);border-color:rgba(100,200,100,.4)">💊 求医问诊</button>`;
  }

  // ── 铁匠NPC自动添加强化装备按钮 ──
  let enhanceBtn = '';
  let repairBtn = '';
  if(npc && npc.category === 'blacksmith'){
    enhanceBtn = `<button class="npc-chat-choice" onclick="closeNpcDialog();showNpcEnhancePanel()" style="background:rgba(255,120,20,.18);border-color:rgba(255,160,40,.5)">⚒️ 强化装备</button>`;
    repairBtn = `<button class="npc-chat-choice" onclick="closeNpcDialog();showNpcRepairPanel()" style="background:rgba(100,160,200,.18);border-color:rgba(100,200,255,.5)">🔧 修理装备</button>`;
  }

  // ── 高城市声望解锁专属对话选项 ──
  let repExtraBtn = '';
  if(typeof jhHasExclusiveDialogue === 'function' && typeof travelCurrentCity !== 'undefined' && travelCurrentCity){
    const npcCity = npc ? (npc.city || npcId.replace(/_[a-z_]+$/,'')) : null;
    // NPC 所属城市与玩家当前城市匹配，或 NPC 在当前城市
    if(jhHasExclusiveDialogue(travelCurrentCity)){
      const { tier } = (typeof jhGetRepBenefits === 'function') ? jhGetRepBenefits(travelCurrentCity) : { tier: { title:'默默无闻', color:'#808080' } };
      if(tier.min >= 40){
        repExtraBtn = '<button class="npc-chat-choice" onclick="npcDoExclusiveTopic(\'' + npcId + '\')" ' +
          'style="background:rgba(' + (tier.min>=80 ? '255,200,40' : tier.min>=60 ? '180,100,240' : '80,160,255') + ',.18);border-color:rgba(' + (tier.min>=80 ? '255,220,60' : tier.min>=60 ? '200,120,255' : '100,180,255') + ',.45)">' +
          (tier.min>=80 ? '🏆' : tier.min>=60 ? '⭐' : '🌟') + ' ' +
          (tier.min>=80 ? '请求协助' : tier.min>=60 ? '询问近况' : '打听消息') +
          '</button>';
      }
    }
  }

  return topicBtns + healBtn + enhanceBtn + repairBtn + repExtraBtn + chitchatBtn;
}



// 高城市声望专属对话处理（对应 renderNpcChatChoicesHtml 中的 repExtraBtn）
function npcDoExclusiveTopic(npcId){
  if(typeof jhGetRepTier !== 'function' || typeof jhGetRepBenefits !== 'function') return;
  const cityId = (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : null;
  if(!cityId) return;
  const { rep, tier, benefits } = jhGetRepBenefits(cityId);
  const npc = NPC_DB[npcId];
  const npcName = npc ? npc.name : '这位';
  const npcCity = npc ? npc.city : '';
  const rel = getNpcRel(npcId);
  let reply = '';
  if(tier.min >= 80){
    const msgs = [
      npcName + '深深一揖："大侠在此城威名远扬，小人有要事相求。"',
      npcName + '眼中一亮："您来得正好！城中有一件为难之事……"',
      npcName + '恭敬道："大侠之名如雷贯耳，在下有一不情之请。"',
      npcName + '满脸堆笑："城主都提起过您！今日有缘，还望相助。"',
    ];
    reply = msgs[Math.floor(Math.random() * msgs.length)];
    if(typeof npcReqTryTrigger === 'function' && npcCity === cityId){
      npcReqTryTrigger(npcId);
    }
  } else if(tier.min >= 60){
    const msgs = [
      npcName + '点头道："您在此城有口皆碑，我便直说了——"',
      npcName + '客气道："原来是您！有些事旁人不方便说，我便告诉您吧。"',
      npcName + '微微一笑："您名声在外，这些话我只对您说……"',
      npcName + '压低声音："江湖上的事您或许已知，但我这儿还有些消息……"',
    ];
    reply = msgs[Math.floor(Math.random() * msgs.length)];
  } else {
    const msgs = [
      npcName + '点头道："原来您在此城小有名气，久仰久仰。"',
      npcName + '客气道："您在这城里也有些人脉了，幸会幸会。"',
      npcName + '笑道："听说过您，看来是个做大事的人。"',
    ];
    reply = msgs[Math.floor(Math.random() * msgs.length)];
  }
  const bgColor = tier.min >= 80 ? '255,200,40' : tier.min >= 60 ? '180,100,240' : '80,160,255';
  const borderColor = tier.min >= 80 ? '255,220,60' : tier.min >= 60 ? '200,120,255' : '100,180,255';
  const choiceBox = document.querySelector('.npc-chat-choices');
  if(choiceBox){
    const infoEl = document.createElement('div');
    infoEl.style.cssText = 'background:rgba(' + bgColor + ',.1);border:1px solid rgba(' + borderColor + ',.3);border-radius:8px;padding:10px 14px;margin-bottom:10px;font-size:11px;color:#c0b880;line-height:1.6;text-align:center';
    infoEl.innerHTML = reply;
    choiceBox.insertBefore(infoEl, choiceBox.firstChild);
    setTimeout(function(){
      if(infoEl.parentNode){ infoEl.style.transition='opacity .5s'; infoEl.style.opacity='0'; }
      setTimeout(function(){ if(infoEl.parentNode) infoEl.remove(); }, 600);
    }, 4000);
  }
  if(typeof adjustNpcRel === 'function'){
    adjustNpcRel(npcId, Math.floor(tier.min / 20));
  }
  log('💬 ' + npcName + '（城望：' + tier.title + '）', 'lm');
}

function _refreshNpcChatChoices(npcId){
  const box = document.querySelector('.npc-chat-choices');
  if(box) box.innerHTML = renderNpcChatChoicesHtml(npcId, getNpcRel(npcId));
}

// 根据 NPC 的 city 字段反查其所属门派 ID
function _getNpcSectId(npcId){
  const npc = NPC_DB[npcId];
  if(!npc || !npc.city) return null;
  // 检查 city 是否为门派据点（sect_location 类型）
  if(typeof WORLD_NODES !== 'undefined'){
    const node = WORLD_NODES[npc.city];
    if(node && node.type === 'sect_location' && node.sects && node.sects.length){
      return node.sects[0];
    }
  }
  // 降级：从 NPC ID 前缀推断（如 shaolin_abbot → shaolin）
  const prefixMatch = npcId.match(/^([a-z]+)_/);
  if(prefixMatch && typeof SECTS !== 'undefined' && SECTS.find(s=>s.id===prefixMatch[1])){
    return prefixMatch[1];
  }
  return null;
}

function _switchNpcTabByName(label){
  const tabs = document.querySelectorAll('.npc-tab');
  tabs.forEach((t, i) => {
    if(t.textContent.includes(label)) npcSwitchTab(t, i);
  });
}

function _getNpcGiftFeedback(npcId, gift, beforeRel, afterRel, cityId, beforeQuestIds, afterQuestIds){
  const npc = NPC_DB[npcId];
  if(!npc || !gift) return { bubble:'', extraToasts:[] };
  const profile = getNpcGiftProfile(npc);
  const isLoved = gift.matchType === 'love';
  const giftName = gift.meta?.name || '这件礼物';
  const fallbackBubble = isLoved
    ? `${giftName}正合我用，这份人情我记下了。`
    : `${giftName}倒也实用，我收下了。`;
  const bubble = _npcGiftPick(isLoved ? profile.thanksLoved : profile.thanksLiked, fallbackBubble);
  const extraToasts = [];
  const newlyUnlocked = (afterQuestIds || []).filter(qid => !(beforeQuestIds || []).includes(qid));
  const followupTopic = _buildNpcGiftFollowupTopic(npcId, gift, beforeRel, afterRel, beforeQuestIds, afterQuestIds);

  if(followupTopic) _saveNpcGiftFollowupTopic(npcId, followupTopic);

  if(newlyUnlocked.length > 0){
    const firstQuest = getAnyQuest(newlyUnlocked[0]);
    extraToasts.push(profile.questHint || `${npc.name}看你的眼神缓和了不少，像是有事想托付你。`);
    extraToasts.push(firstQuest?.name
      ? `📜 新委托线索：${firstQuest.name}，去任务页看看。`
      : '📜 对方似乎愿意把一桩新差事交给你，去任务页看看。');
  } else if(isLoved && Array.isArray(npc.intels) && npc.intels.length && typeof INTEL_DB !== 'undefined'){
    const intelId = npc.intels.find(iid => INTEL_DB[iid]);
    const intel = intelId ? INTEL_DB[intelId] : null;
    if(intel?.text){
      const label = intel.label || '口风';
      extraToasts.push(`💬 ${npc.name}压低声音：${label}——${_trimNpcIntelText(intel.text, 34)}`);
    }
  } else if(beforeRel < 20 && afterRel >= 20){
    extraToasts.push(`💬 ${npc.name}对你明显亲近了些，再聊聊，或许能听到更多实话。`);
  }

  if(followupTopic?.text){
    extraToasts.push(`💡 可继续追问：${followupTopic.text}`);
  }

  return { bubble, extraToasts };
}


function evaluateNpcGift(npcId, itemId){
  const npc = NPC_DB[npcId];
  if(!npc || !itemId) return null;
  const meta = (typeof getItemMeta === 'function' && getItemMeta(itemId))
    || (typeof ENEMY_DROP_ITEMS !== 'undefined' ? ENEMY_DROP_ITEMS[itemId] : null);
  if(!meta) return null;

  const profile = getNpcGiftProfile(npc);
  if(!profile.love.length && !profile.like.length) return null;

  const itemTags = [...new Set([
    ...(NPC_GIFT_ITEM_TAGS[itemId] || []),
    meta.type === 'collectible' ? 'raretrade' : '',
    (meta.sellPrice || 0) >= 200 ? 'raretrade' : ''
  ].filter(Boolean))];

  const loved = itemTags.find(tag => profile.love.includes(tag));
  const liked = itemTags.find(tag => profile.like.includes(tag));
  if(!loved && !liked) return null;

  const matchType = loved ? 'love' : 'like';
  const valueTier = _npcGiftValueTier(meta);
  const bonus = Math.max(1, valueTier - 1) + (loved ? 4 : 2);
  const reaction = loved ? '对方眼神一亮，显然正合心意' : '看得出对方颇有兴趣';
  const note = loved
    ? `这件${meta.name}正对${npc.role}的胃口。`
    : `${npc.role}对这类东西向来用得上。`;

  return {
    itemId,
    meta,
    bonus,
    reaction,
    note,
    matchType,
    matchedTag: loved || liked,
    profile,
    score: (loved ? 100 : 60) + valueTier,
  };
}

function getNpcGiftOptions(npcId){
  if(typeof craftBagLoad !== 'function') return [];
  const bag = craftBagLoad().filter(entry => (entry.qty || 0) > 0);
  if(!bag.length) return [];
  const state = getNpcGiftBaseState(npcId);
  return bag.map(entry => {
    const eva = evaluateNpcGift(npcId, entry.id);
    if(!eva) return null;
    return {
      ...eva,
      qty: entry.qty || 0,
      gain: state.baseGain > 0 ? Math.min(18, state.baseGain + eva.bonus) : 0,
    };
  }).filter(Boolean)
    .sort((a,b) => (b.score - a.score) || (b.gain - a.gain) || (b.qty - a.qty))
    .slice(0, 2);
}


function renderNpcRelActionsHtml(npcId, rel){
  const REL_THRESHOLD = {
    gift_silver: -60,
    joke: -20,
    treat_meal: -20,
  };
  const LOCKED_TIP = {
    gift_silver: '仇敌拒绝一切',
    joke: '此人对你心存戒备，不想搭理',
    treat_meal: '此人不屑与你同桌',
  };
  const relActions = [
    { label:'赠送银两（5两）', action:'gift_silver', cost:5 },
    { label:'讲个笑话', action:'joke', cost:0 },
    { label:'请吃一顿（10两）', action:'treat_meal', cost:10 },
  ];

  const basicHtml = relActions.map(a => {
    const threshold = REL_THRESHOLD[a.action] ?? -20;
    if(rel <= threshold){
      const lockTip = LOCKED_TIP[a.action] || '关系太差';
      return `<button class="npc-rel-action" disabled style="opacity:.4;cursor:not-allowed" title="${lockTip}">${a.label} <span style="color:#ff8060;font-size:10px">🚫 ${lockTip}</span></button>`;
    }
    const table = REL_INTERACT_TABLE[a.action] || [];
    const done = ((npcState.interactCounts || {})[npcId] || {})[a.action] || 0;
    const remGain = done < table.length ? table[done] : 0;
    const dayKey = npcId + '_' + a.action;
    const usedToday = (npcState.lastInteractDay || {})[dayKey] === _getTodayIndex();
    let tip = '';
    if(usedToday) tip = ' <span style="color:#888;font-size:10px">（今日已用）</span>';
    else if(remGain === 0) tip = ' <span style="color:#888;font-size:10px">（已无效）</span>';
    else tip = ` <span style="color:#a0d080;font-size:10px">(+${remGain})</span>`;
    return `<button class="npc-rel-action" onclick="npcRelAction('${a.action}','${npcId}')">${a.label}${tip}</button>`;
  }).join('');

  const profile = getNpcGiftProfile(NPC_DB[npcId]);
  const giftState = getNpcGiftBaseState(npcId);
  const giftOptions = rel <= -60 ? [] : getNpcGiftOptions(npcId);
  const followupTopic = _getNpcGiftFollowupTopic(npcId);
  let giftHtml = '';
  let followupHtml = '';

  if(profile.label){
    if(rel <= -60){
      giftHtml = `<div style="margin-top:6px;color:#a88;font-size:11px;text-align:center">🎁 此人正在气头上，连实物礼都不肯收。</div>`;
    } else if(giftOptions.length > 0){
      const header = `<div style="margin-top:8px;color:rgba(220,200,140,.78);font-size:11px;text-align:center">🎁 偏爱：${profile.label}</div>`;
      const btns = giftOptions.map(opt => {
        const icon = opt.meta?.icon || '🎁';
        const name = opt.meta?.name || opt.itemId;
        const suffix = giftState.reason
          ? ` <span style="color:#888;font-size:10px">（${giftState.reason}）</span>`
          : ` <span style="color:#a0d080;font-size:10px">(+${opt.gain})</span>`;
        const disabled = giftState.reason ? ' disabled style="opacity:.45;cursor:not-allowed"' : '';
        return `<button class="npc-rel-action"${disabled} title="${opt.note}" onclick="npcRelAction('gift_item','${npcId}','${opt.itemId}')">赠${icon}${name}×1${suffix}</button>`;
      }).join('');
      giftHtml = `${header}${btns}`;
    } else if(typeof craftBagLoad === 'function'){
      giftHtml = `<div style="margin-top:6px;color:#888;font-size:11px;text-align:center">🎁 此人偏爱${profile.label}，你背包里暂时没有合心意的礼物。</div>`;
    }
  }

  if(followupTopic){
    followupHtml = `<div style="margin-top:8px;padding:8px 10px;border:1px solid rgba(216,184,96,.28);border-radius:8px;background:rgba(80,56,18,.18)">
      <div style="margin-bottom:6px;color:#d8b860;font-size:11px;text-align:center">💬 送礼后对方松了口，可继续顺势追问</div>
      <button class="npc-rel-action" onclick="npcDoTopic('${followupTopic.id}','${npcId}')">${followupTopic.text}</button>
    </div>`;
  }

  // 师徒系统按钮（master-apprentice.js）
  let maHtml = '';
  if(typeof MA !== 'undefined' && MA.renderNpcActions){
    maHtml = MA.renderNpcActions(npcId);
    if(maHtml) maHtml = `<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(240,192,96,.15)">${maHtml}</div>`;
  }

  // 结拜系统按钮（sworn-brother.js）
  let swHtml = '';
  if(typeof SW !== 'undefined' && SW.renderNpcActions){
    swHtml = SW.renderNpcActions(npcId);
    if(swHtml) swHtml = `<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,159,200,.15)">${swHtml}</div>`;
  }

  // 情缘系统按钮（romance.js）
  let romHtml = '';
  if(typeof ROM !== 'undefined' && ROM.renderNpcActions){
    romHtml = ROM.renderNpcActions(npcId);
    if(romHtml) romHtml = `<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(255,107,157,.15)">${romHtml}</div>`;
  }

  return basicHtml + giftHtml + followupHtml + maHtml + swHtml + romHtml;
}



// 获取某互动本次能加的好感（同时检查每日冷却）
// 返回 { gain, reason } reason不为空说明被限制
function getNpcInteractGain(npcId, action){
  const table = REL_INTERACT_TABLE[action];
  if(!table) return { gain:0, reason:'未知行为' };

  // 每日冷却检查
  const dayKey = npcId + '_' + action;
  const today = _getTodayIndex();
  if(npcState.lastInteractDay[dayKey] === today){
    return { gain:0, reason:'今日已与对方有过此番互动，明日再来吧。' };
  }

  // 终身次数
  if(!npcState.interactCounts[npcId]) npcState.interactCounts[npcId] = {};
  const done = npcState.interactCounts[npcId][action] || 0;
  const gain = done < table.length ? table[done] : 0;

  if(gain === 0){
    return { gain:0, reason:'对方已对此习以为常，不再在意。' };
  }
  return { gain, reason:'' };
}

// 消耗一次互动次数 + 记录今日已用
function consumeNpcInteract(npcId, action){
  if(!npcState.interactCounts[npcId]) npcState.interactCounts[npcId] = {};
  npcState.interactCounts[npcId][action] = (npcState.interactCounts[npcId][action] || 0) + 1;
  npcState.lastInteractDay[npcId + '_' + action] = _getTodayIndex();
  npcStateSave();
}

// 标记完成了某NPC的任务（解锁好感60+上限）
function markQuestDoneFor(npcId){
  npcState.questDoneFor[npcId] = true;
  npcStateSave();
  // 成就触发
  if(typeof achOnQuestComplete === 'function') achOnQuestComplete();
}

// ── 好感自然衰减 ──
// 每次旅行抵达新城市时调用：对"离开的城市"的NPC执行衰减
// 基于 gameDay 差值计算流逝天数（统一时间基准，不再依赖传入 days 参数）
const REL_DECAY_RATE = {
  // 每天衰减量（按当前好感阶段）
  // 陌路及以下不衰减；友善每天-0.5；挚友每天-0.3（越铁的关系越耐久）
  friend: 0.5,   // rel 20~59
  love:   0.3,   // rel 60~100
};
function npcDecayOnTravel(leavingCityId){
  if(!leavingCityId) return;
  npcStateLoad();

  // 计算从上次衰减到现在的游戏天数差
  const lastDecay = npcState.lastDecayDay || 0;
  const todayIdx  = _getTodayIndex(); // 已包含 gameDay 优先逻辑
  const daysPassed = Math.max(0, todayIdx - lastDecay);
  if(daysPassed <= 0) return; // 同一天，不重复衰减

  const npcIds = (typeof WORLD_NODE_NPCS !== 'undefined') ? (WORLD_NODE_NPCS[leavingCityId] || []) : [];
  if(!npcIds.length) return;

  let changed = false;
  npcIds.forEach(npcId => {
    const rel = getNpcRel(npcId);
    if(rel < 20) return; // 陌路及以下不衰减

    let rate = rel >= 60 ? REL_DECAY_RATE.love : REL_DECAY_RATE.friend;
    // 气运加成：气运高的玩家关系更耐久（衰减减少最多40%）
    const fate = (typeof edS !== 'undefined' ? (edS.fate || 10) : 10);
    const fateBonus = Math.min(0.4, (fate - 10) * 0.02); // fate=10基准，每+1减少2%衰减
    rate = rate * (1 - fateBonus);

    const decay = Math.round(rate * daysPassed * 10) / 10;
    if(decay > 0){
      const newRel = Math.max(20, rel - decay);
      npcState.relations[npcId] = newRel;
      changed = true;
    }
  });
  if(changed){
    npcState.lastDecayDay = todayIdx; // 记录本次衰减时的游戏日
    npcStateSave();
  }
}

// ════════════════════════════════════════════════════
//  任务状态管理（支持连环/重复任务）
// ════════════════════════════════════════════════════

// 获取任务原始存档状态: null / 'available' / 'active' / 'done' / 'claimed'
function getQuestStatus(questId){
  return npcState.quests[questId] || 'available';
}
function setQuestStatus(questId, status){
  npcState.quests[questId] = status;
  npcStateSave();
}

/**
 * 判断一个任务当前对玩家是否「可见/可接取」
 * 综合考虑：连环前置、重复冷却、好感门槛
 */
function isQuestAvailable(questId, npcId, cityId){
  const q = getAnyQuest(questId);
  if(!q) return false;
  const status = getQuestStatus(questId);

  // ── 重复任务：检查冷却 ──
  if(q.repeatable){

    if(status === 'active') return true; // 进行中的直接可见
    if(status === 'done')   return true; // 等待领奖
    // 检查是否在冷却中
    const lastDone = npcState.questLastDone?.[questId] || 0;
    const cooldown = q.cooldownDays || 3;
    const curDay   = _getTodayIndex();
    if(typeof curDay === 'number'){
      if(curDay - lastDone < cooldown) return false; // 冷却中
    }
    return true; // 冷却结束，恢复 available
  }

  // ── 连环任务：检查前置 ──
  if(q.prevQuest){
    const prevStatus = getQuestStatus(q.prevQuest);
    if(prevStatus !== 'claimed') return false; // 前置未完成
  }

  // ── 好感门槛 ──
  if(q.minRel && npcId){
    const rel = getNpcRel(npcId);
    if(rel < q.minRel) return false;
  }

  // ── 门派归属限制：reqSect 为 true 时必须已加入某门派 ──
  if(q.reqSect){
    const edS = window.edS || {};
    if(!edS.sect) return false; // 尚未加入任何门派
  }

  // ── 当前城市若无法产出任务物品，则不显示/不派发该类任务 ──
  if(!_canQuestSpawnInCity(q, cityId)) return false;

  // ── 一次性任务已完成则不再显示 ──
  if(status === 'claimed' && !q.repeatable) return false;


  return true;
}

/**
 * 获取任务对玩家的「显示状态标签」
 * 重复任务在冷却中时显示特殊标签
 */
function getQuestDisplayStatus(questId){
  const q = getAnyQuest(questId);
  if(!q) return 'available';
  const raw = getQuestStatus(questId);

  if(q.repeatable && (raw === 'claimed' || raw === 'available')){
    const lastDone = npcState.questLastDone?.[questId] || 0;
    const cooldown = q.cooldownDays || 3;
    const curDay   = _getTodayIndex();
    if(typeof curDay === 'number'){
      const left = cooldown - (curDay - lastDone);
      if(left > 0) return 'cooldown_' + left; // 冷却中 N 天
    }
    return 'available'; // 冷却结束
  }
  return raw;
}



// ════════════════════════════════════════════════════
//  动态阵营任务系统
//  根据 NPC 阵营 + 玩家关系 实时生成击杀/保护类任务
//  生成的任务存入 npcState.alignQuests，不污染 QUEST_DB
// ════════════════════════════════════════════════════

/**
 * 为某个 NPC 生成当前可用的动态阵营任务列表
 * 每次打开对话框时调用，结果缓存到 npcState.alignQuests
 * @returns {Array} 任务对象数组（与 QUEST_DB 格式兼容）
 */
function genAlignmentQuests(npcId, cityId){
  if(typeof ALIGNMENT_QUEST_TEMPLATES === 'undefined') return [];
  const npc = NPC_DB[npcId];
  if(!npc) return [];

  const rel        = getNpcRel(npcId);
  const npcAlign   = getNpcAlignment(npcId);
  const enemyAligns = (typeof ALIGN_ENEMY_MAP !== 'undefined')
    ? (ALIGN_ENEMY_MAP[npcAlign] || []) : [];

  // 从当前城市（及相邻城市）收集候选目标 NPC
  // 目标候选：与 npc 阵营对立 的 NPC
  const candidateTargets = _collectTargetCandidates(npcId, cityId, npcAlign, enemyAligns);
  if(!candidateTargets.length) return [];

  const result = [];

  // 遍历模板，判断是否满足条件
  Object.entries(ALIGNMENT_QUEST_TEMPLATES).forEach(([tplKey, tpl]) => {
    // 关系门槛
    if(rel < tpl.minRel) return;
    if(tpl.maxRel !== undefined && rel > tpl.maxRel) return;
    // 发布方阵营限制
    if(tpl.issuerAlign && !tpl.issuerAlign.includes(npcAlign)) return;

    // 从候选目标中按 targetAlign 规则筛选
    const targets = candidateTargets.filter(t => {
      if(tpl.targetAlign === 'enemy')       return enemyAligns.includes(t.align);
      if(tpl.targetAlign === 'ally')        return t.align === npcAlign;
      if(tpl.targetAlign === 'threat')      return ['evil','chaotic'].includes(t.align);
      if(tpl.targetAlign === 'any_hostile') return t.align !== npcAlign;
      return true;
    });
    if(!targets.length) return;

    // 选一个目标（优先 major/elite，随机取其中一个）
    const preferred = targets.filter(t=> t.tier !== 'func');
    const target    = preferred.length ? preferred[Math.floor(Math.random()*preferred.length)]
                                       : targets[Math.floor(Math.random()*targets.length)];

    const questId = `aq_${npcId}_${tplKey}`;

    // 已有的任务沿用（避免每次重新生成覆盖进度）
    if(!npcState.alignQuests) npcState.alignQuests = {};
    if(!npcState.alignQuests[questId]){
      npcState.alignQuests[questId] = {
        id:        questId,
        type:      tpl.type,
        icon:      tpl.icon,
        name:      tpl.nameTemplate(npc, target.npc),
        desc:      tpl.descTemplate(npc, target.npc),
        rewardText: tpl.rewardText(target.tier),
        reward: {
          silver: tpl.rewardSilver(target.tier),
          exp:    tpl.rewardExp(target.tier),
          rel:    tpl.rewardRel,
        },
        issuerNpcId: npcId,
        targetNpcId: target.id,
        targetName:  target.npc.name,
        targetTier:  target.tier,
        targetCityId: target.cityId,
      };
      npcStateSave();
    }

    result.push(npcState.alignQuests[questId]);
  });

  return result;
}

/**
 * 在当前城市及附近城市收集潜在击杀目标 NPC
 * 只考虑活着的 NPC
 */
function _collectTargetCandidates(issuerNpcId, cityId, issuerAlign, enemyAligns){
  if(typeof NPC_DB === 'undefined' || typeof WORLD_NODE_NPCS === 'undefined') return [];

  const candidates = [];
  // 收集范围：当前城市 + 地图上所有城市（距离不做限制，游戏中能去就行）
  const allCityIds = Object.keys(WORLD_NODE_NPCS);

  allCityIds.forEach(cid => {
    const npcIds = WORLD_NODE_NPCS[cid] || [];
    npcIds.forEach(tid => {
      if(tid === issuerNpcId) return;  // 不能把自己当目标
      const tnpc = NPC_DB[tid];
      if(!tnpc) return;
      const tAlign = getNpcAlignment(tid);
      // 只选对立阵营
      if(!enemyAligns.includes(tAlign) && tAlign !== issuerAlign) return;
      // 排除已死亡的
      const instId = cid + '_' + tid;
      if(typeof isNpcDead === 'function' && isNpcDead(instId)) return;

      candidates.push({
        id:     tid,
        npc:    tnpc,
        align:  tAlign,
        tier:   tnpc.tier || 'func',
        cityId: cid,
      });
    });
  });
  return candidates;
}

/** 获取动态任务对象（兼容 QUEST_DB 查询） */
function getAlignQuestById(questId){
  return npcState.alignQuests?.[questId] || null;
}

/** 统一任务查询：先查 QUEST_DB，再查动态任务 */
function getAnyQuest(questId){
  return (typeof QUEST_DB !== 'undefined' && QUEST_DB[questId])
    || getAlignQuestById(questId)
    || null;
}

function _isQuestTargetItemMatch(haveItemId, needItemId){
  if(typeof isDungeonQuestItemMatch === 'function'){
    return isDungeonQuestItemMatch(haveItemId, needItemId);
  }
  return haveItemId === needItemId;
}

function _inferEnemyMetaFromId(enemyId){
  const id = String(enemyId || '').toLowerCase();
  if(!id) return null;
  const meta = {};

  if(/bandit|robber|pirate|thief|deserter|outlaw|raider/.test(id)) meta.type = 'bandit';
  else if(/assassin|killer/.test(id)) meta.type = 'assassin';
  else if(/wolf|boar|bear|tiger|snake|spider|scorpion|hound|eagle|hawk/.test(id)) meta.type = 'beast';
  else if(/evil|cult|poison|wudu/.test(id)) meta.type = 'evil';

  if(/_boss|boss|chief|captain|warlord|leader/.test(id)) meta.tier = 'major';
  else if(/elite/.test(id)) meta.tier = 'elite';
  else if(meta.type) meta.tier = 'func';

  return Object.keys(meta).length ? meta : null;
}

function _getEnemyMetaById(enemyId){
  const enemyDb = (typeof ENEMY_DB !== 'undefined' && ENEMY_DB) || (typeof window !== 'undefined' && window.ENEMY_DB) || null;
  return (enemyDb && enemyId && enemyDb[enemyId]) || _inferEnemyMetaFromId(enemyId);
}

function _isQuestKillMatch(q, killedNpcId){
  if(!q || !killedNpcId) return false;
  if(q.targetNpcId && q.targetNpcId === killedNpcId) return true;

  const enemy = _getEnemyMetaById(killedNpcId);
  if(!enemy) return false;

  const targetTypes = Array.isArray(q.targetEnemyTypes)
    ? q.targetEnemyTypes
    : (q.targetEnemyType ? [q.targetEnemyType] : []);
  if(targetTypes.length){
    if(!enemy.type || !targetTypes.includes(enemy.type)) return false;
  }

  if(q.targetTier && enemy.tier !== q.targetTier) return false;

  const targetTags = Array.isArray(q.targetEnemyTags)
    ? q.targetEnemyTags
    : (q.targetEnemyTag ? [q.targetEnemyTag] : []);
  if(targetTags.length){
    const enemyTags = Array.isArray(enemy.tags) ? enemy.tags : [];
    if(!targetTags.some(tag => enemyTags.includes(tag))) return false;
  }

  return targetTypes.length > 0 || targetTags.length > 0;
}

function _canQuestSpawnInCity(q, cityId){

  if(!q || !cityId) return true;
  if((q.type !== 'fetch' && q.type !== 'collect') || !q.targetItem) return true;
  if(typeof canCityProvideQuestItem !== 'function') return true;
  return canCityProvideQuestItem(cityId, q.targetItem);
}

function _getQuestBagMatchedQty(targetItem){
  if(!targetItem) return 0;
  if(typeof craftBagLoad === 'function'){
    return craftBagLoad().reduce((sum, entry) => {
      return sum + (_isQuestTargetItemMatch(entry?.id, targetItem) ? (entry.qty || 0) : 0);
    }, 0);
  }
  return typeof craftBagGetQty === 'function' ? craftBagGetQty(targetItem) : 0;
}

function _consumeQuestBagMatchedItems(targetItem, needQty){
  if(!targetItem || needQty <= 0) return true;
  if(typeof craftBagLoad !== 'function' || typeof craftBagSave !== 'function'){
    return typeof craftBagConsume === 'function' ? craftBagConsume(targetItem, needQty) : false;
  }

  const bag = craftBagLoad();
  let left = needQty;
  bag.forEach(entry => {
    if(left <= 0) return;
    if(!_isQuestTargetItemMatch(entry?.id, targetItem)) return;
    const used = Math.min(left, entry.qty || 0);
    entry.qty -= used;
    left -= used;
  });

  if(left > 0) return false;

  craftBagSave(bag.filter(entry => (entry.qty || 0) > 0));
  return true;
}

/** 获取某连环任务链的总步骤数 */
function _getChainTotalSteps(chainId){

  if(typeof QUEST_DB === 'undefined') return 1;
  return Object.values(QUEST_DB).filter(q => q.chain === chainId).length || 1;
}

/**
 * 击杀 NPC 后检查是否完成了某个 kill 类任务
 * 同时处理：动态阵营任务 + QUEST_DB 中的 kill 类连环/静态任务
 */
function onKillNpcCheckQuests(killedNpcId){
  let anyDone = false;

  // ── 检查动态阵营任务 ──
  if(npcState.alignQuests){
    Object.values(npcState.alignQuests).forEach(q => {
      if(q.type !== 'kill') return;
      if(!_isQuestKillMatch(q, killedNpcId)) return;
      const status = getQuestStatus(q.id);
      if(status === 'active'){
        setQuestStatus(q.id, 'done');
        showToast(`📋 任务完成：${q.name} → 回去找 ${NPC_DB[q.issuerNpcId]?.name||'委托人'} 领取奖励`);
        anyDone = true;
      }
    });
  }

  // ── 检查 QUEST_DB 中的 kill 类任务（含连环任务链）──
  if(typeof QUEST_DB !== 'undefined'){
    Object.values(QUEST_DB).forEach(q => {
      if(q.type !== 'kill') return;
      if(!_isQuestKillMatch(q, killedNpcId)) return;
      const status = getQuestStatus(q.id);
      if(status === 'active'){
        setQuestStatus(q.id, 'done');
        if(q.chain){
          showToast(`📋 连环任务进度：${q.name} 完成 → 回去领奖`);
        } else {
          showToast(`📋 任务完成：${q.name} → 回去领取奖励`);
        }
        anyDone = true;
      }
    });
  }

  // ── 检查赏金任务击杀进度 ──
  const bounties = (npcState._dailyBounties || []);
  bounties.forEach(b => {
    if(b.type !== 'kill') return;
    const instId = b.instanceId;
    const status = getQuestStatus(instId);
    if(status !== 'active') return;

    // 检查是否匹配目标
    let matched = false;
    if(b.enemyId && b.enemyId === killedNpcId) matched = true;
    if(!matched && b.enemyType){
      const killedNpc = NPC_DB[killedNpcId];
      if(killedNpc){
        const role = (killedNpc.role || '').toLowerCase();
        if(role.includes(b.enemyType)) matched = true;
      }
    }
    if(!matched && b.bossElite){
      // 首领级赏金：任意 major/elite tier NPC 击杀都算
      const killedNpc = NPC_DB[killedNpcId];
      if(killedNpc && ['major','elite'].includes(killedNpc.tier)) matched = true;
    }
    if(!matched) return;

    const qty   = b.qty || 1;
    const progKey = instId + '_prog';
    const prog  = (npcState.quests?.[progKey] || 0) + 1;
    if(!npcState.quests) npcState.quests = {};
    npcState.quests[progKey] = prog;
    npcStateSave();

    if(prog >= qty){
      setQuestStatus(instId, 'done');
      showToast(`🏆 赏金目标达成：${b.nameTpl} → 可领取赏金！`);
    } else {
      showToast(`⚔️ 赏金进度：${prog}/${qty} — ${b.nameTpl}`);
    }
    anyDone = true;
  });

  // ── 检查情境任务击杀进度 ──
  const ctxQuests = getContextualQuests();
  ctxQuests.forEach(q => {
    if(q.type !== 'kill') return;
    if(getQuestStatus(q.id) !== 'active') return;
    // 检查目标匹配
    let matched = false;
    if(q.targetNpcId && q.targetNpcId === killedNpcId) matched = true;
    if(!matched && q.targetTier){
      const killedNpc = NPC_DB[killedNpcId];
      if(killedNpc && killedNpc.tier === q.targetTier) matched = true;
    }
    if(!matched && q.targetType){
      const killedNpc = NPC_DB[killedNpcId];
      if(killedNpc && (killedNpc.role||'').toLowerCase().includes(q.targetType)) matched = true;
    }
    if(!matched) return;
    // 更新进度
    updateContextualProgress(q.id, 1);
  });

  if(anyDone) npcStateSave();
}


// 情报是否已读
function isIntelRead(intelId){ return !!npcState.readIntels[intelId]; }
function markIntelRead(intelId){ npcState.readIntels[intelId] = true; npcStateSave(); }

// ── 渲染城镇 NPC 列表 ──
// 服务类型与NPC角色的映射（用于过滤已在顶部服务按钮中显示的NPC）
const SVC_ROLE_FILTERS = {
  tavern:     ['酒馆','酒','酒家'],           // 酒馆掌柜
  blacksmith: ['铁匠','锻造','铸兵','铸剑','刀匠','军械','铁器','武器铺','暗器铺','刀剑铺','兵器','剑师'],  // 铁匠（覆盖所有铁匠类role）
  inn:        ['掌柜','旅店','客栈','驿馆'], // 旅店掌柜
  hospital:   ['郎中','大夫','神医','医'],    // 医生
  guild:      ['镖局','镖头','护镖'],         // 镖局
  shop:       ['商人','杂货','商贾'],         // 商人
  herbalism:  ['草药店','药铺'],              // 草药店
  forge:      ['铁匠铺','锻造'],              // 铁匠铺
  chess:      ['棋社','棋'],                  // 棋社
};

// 检查NPC是否应被过滤（因为已有对应的服务按钮）
function shouldFilterNpcByService(npc, cityId){
  const node = WORLD_NODES[cityId];
  if(!node || !node.services) return false;

  // 豁免：携带新手引导任务的NPC必须显示（玩家需要点击对话触发引导）
  if((npc.quests||[]).some(qid => qid.startsWith('quest_newbie_'))) return false;

  // 豁免：非纯功能性NPC（major/elite/boss 有独立剧情，不能过滤）
  // 只过滤 tier=func 的纯服务型NPC
  if(npc.tier && npc.tier !== 'func') return false;

  // 豁免：有任务或情报的NPC（有内容可交互，不能隐藏）
  if((npc.quests||[]).length > 0) return false;
  if((npc.intels||[]).length > 0) return false;

  const npcRole = (npc.role || '').toLowerCase();
  for(const svc of node.services){
    const filters = SVC_ROLE_FILTERS[svc];
    if(filters && filters.some(k => npcRole.includes(k))){
      return true; // 该NPC角色已有对应服务按钮，过滤掉
    }
  }
  return false;
}

function renderCityNpcs(cityId){
  npcStateLoad();
  const el = document.getElementById('tlNpcs');
  if(!el){ return; }
  const npcIds = WORLD_NODE_NPCS[cityId] || [];
  if(!npcIds.length){ el.innerHTML = ''; return; }

  const cards = npcIds.map(npcId=>{
    const npc = NPC_DB[npcId];
    if(!npc){ return ''; }
    
    // 过滤：如果该NPC角色已有对应的服务按钮，则不显示在列表中
    const filtered = shouldFilterNpcByService(npc, cityId);
    if(filtered){ return ''; }
    
    const npcInstId = cityId+'_'+npcId;
    const deadStatus = getNpcCardStatus(npcInstId);
    const rel = getNpcRel(npcId);
    const relLv = getNpcRelLevel(rel);

    // 死亡状态：显示灰色 + 重生倒计时 / 替代者卡片
    if(deadStatus !== 'alive'){
      // 检查是否有动态替代者（仅 elite 永久死亡才有）
      const rpl = (typeof getReplacementNpc === 'function') ? getReplacementNpc(npcInstId) : null;
      if(rpl){
        // 显示替代者卡片（可点击对话）
        return `<div class="tl-npc-card" onclick="openReplacementNpcDialog('${npcInstId}','${cityId}')">
          <div class="tl-npc-avatar" style="color:#c08060">${rpl.avatar}</div>
          <div class="tl-npc-info">
            <div class="tl-npc-name" style="color:#e8c080">${rpl.name}</div>
            <div class="tl-npc-title-badge" style="color:#c09060;border-color:#a07040;background:rgba(160,100,60,0.2)">${rpl.role} <span style="opacity:.7">·继任</span></div>
          </div>
          <div class="tl-npc-rel" style="color:#a08060;font-size:11px">陌路</div>
        </div>`;
      }
      const left = getNpcRespawnDaysLeft(npcInstId);
      const deadLabel = left === -1 ? '已陨落' : `${left}天后`;
      return `<div class="tl-npc-card" style="opacity:.4;filter:grayscale(1);pointer-events:none">
        <div class="tl-npc-avatar" style="color:#666">💀</div>
        <div class="tl-npc-info">
          <div class="tl-npc-name" style="color:#888">${npc.name}</div>
          <div class="tl-npc-title-badge" style="color:#666;border-color:#444;background:rgba(60,60,60,0.2)">${deadLabel}</div>
        </div>
        <div class="tl-npc-rel" style="color:#555">已死亡</div>
      </div>`;
    }

    // 检查是否有未完成任务/新解锁连环任务/重复任务到期/未读情报
    const hasDone  = (npc.quests||[]).some(qid => getQuestStatus(qid) === 'done');
    const hasQuest = !hasDone && (npc.quests||[]).some(qid => {
      const raw = getQuestStatus(qid);
      if(raw === 'active') return false; // 进行中不显示!
      return isQuestAvailable(qid, npcId, cityId);
    });

    const hasNewIntel = (npc.intels||[]).some(iid=> !isIntelRead(iid));
    let badge = '';
    if(hasDone)         badge = `<span class="tl-npc-badge badge-done">✓</span>`;
    else if(hasQuest)   badge = `<span class="tl-npc-badge badge-quest">!</span>`;
    else if(hasNewIntel)badge = `<span class="tl-npc-badge badge-news">?</span>`;

    return `<div class="tl-npc-card" onclick="openNpcDialog('${npcId}','${cityId}')">
      <div class="tl-npc-avatar" style="color:${relLv.color}">${npc.avatar}</div>
      <div class="tl-npc-info">
        <div class="tl-npc-name">${npc.name}</div>
        <div class="tl-npc-title-badge">${npc.role}</div>
      </div>
      <div class="tl-npc-rel ${relLv.cls}">${relLv.label}</div>
      ${badge}
    </div>`;
  }).join('');

  // ── 剧情NPC插入：检查StoryGuide当前节点，若目标在当前城市则插到列表最前面 ──
  let storyNpcCard = '';
  if(typeof StoryGuide !== 'undefined' && typeof STORY_NPCS !== 'undefined'){
    const beat = StoryGuide.current && StoryGuide.current();
    if(beat && beat.type === 'talk' && beat.target){
      // 找到 STORY_NPCS 中名字匹配的剧情NPC
      const sNpc = Object.values(STORY_NPCS).find(n => n.name === beat.target || beat.target.includes(n.name));
      if(sNpc){
        // beat 对应的城市：优先用 beatCityMap 固定映射，否则用 sNpc.city 默认值
        const beatCityMap = {
          b1_2: 'luoyang', b1_4: 'luoyang', b2_5: 'luoyang',
          b3_2: 'shaolin_temple', b6_3: 'luoyang',
        };
        const requiredCity = beatCityMap[beat.id] || sNpc.city;
        if(requiredCity === cityId){
          storyNpcCard = `<div class="tl-npc-card" onclick="openStoryNpcDialog('${sNpc.id}','${cityId}')"
            style="border-color:rgba(240,192,40,.45);background:rgba(40,30,10,.6);position:relative">
            <div style="position:absolute;top:3px;right:4px;font-size:9px;color:#f0d060;opacity:.8">⭐主线</div>
            <div class="tl-npc-avatar" style="color:#f0d060">${sNpc.avatar}</div>
            <div class="tl-npc-info">
              <div class="tl-npc-name" style="color:#f0d060">${sNpc.name}</div>
              <div class="tl-npc-title-badge" style="color:#c0a040;border-color:#806020">${sNpc.role}</div>
            </div>
            <div class="tl-npc-rel" style="color:#f0c030;font-size:11px">！对话</div>
          </div>`;
        }
      }
    }
  }

  // 若所有NPC都被过滤，补充通用路人作兜底
  const hasVisibleCard = cards.trim().length > 0;
  if(!hasVisibleCard){
    console.warn('[renderCityNpcs] 所有NPC被过滤，启用兜底通用NPC。cityId='+cityId);
    // 尝试从 NPC_DB 直接渲染通用路人
    const fallbackIds = ['generic_wanderer','generic_villager','generic_scholar'];
    const fallbackCards = fallbackIds.map(npcId=>{
      const npc = NPC_DB[npcId];
      if(!npc) return '';
      const rel = getNpcRel(npcId);
      const relLv = getNpcRelLevel(rel);
      return `<div class="tl-npc-card" onclick="openNpcDialog('${npcId}','${cityId}')">
        <div class="tl-npc-avatar" style="color:${relLv.color}">${npc.avatar}</div>
        <div class="tl-npc-info">
          <div class="tl-npc-name">${npc.name}</div>
          <div class="tl-npc-title-badge">${npc.role}</div>
        </div>
        <div class="tl-npc-rel ${relLv.cls}">${relLv.label}</div>
      </div>`;
    }).join('');
    el.innerHTML = `<div class="tl-npcs-label">城中人物</div><div class="tl-npc-list">${storyNpcCard}${fallbackCards}</div>`;
    return;
  }

  el.innerHTML = `<div class="tl-npcs-label">城中人物</div><div class="tl-npc-list">${storyNpcCard}${cards}</div>`;
}

// ── 打开 NPC 对话弹窗 ──
let _curNpcId = null, _curCityId = null;

function openNpcDialog(npcId, cityId){
  npcStateLoad();
  _curNpcId = npcId; _curCityId = cityId;
  if (typeof playAudio === 'function') playAudio('npc_talk');
  const npc = NPC_DB[npcId];
  if(!npc) return;
  const rel = getNpcRel(npcId);
  const relLv = getNpcRelLevel(rel);
  const relPct = Math.round((rel + 100) / 2); // 0~100 用于进度条

  // ── 好感高好处：好感90+小概率主动送礼/情报；好感100展示知己标记 ──
  _checkHighRelBenefits(npcId, npc, rel);

  // 问候语：按关系阶段与已聊过的话题动态切换
  const greeting = _resolveNpcGreeting(npc, npcId, rel);


  // 构建标签页
  const tabs = ['对话','任务','情报','关系'];
  if(npc.shop) tabs.splice(2,0,'商店');

  const tabHtml = tabs.map((t,i)=>`<button class="npc-tab${i===0?' active':''}" data-tab="${i}" onclick="npcSwitchTab(this,${i})">${t}</button>`).join('');

  // ① 对话面板
  // 仇敌/敌意：顶部加警告横幅
  let hostileBanner = '';
  if(rel <= -60){
    hostileBanner = `<div style="background:rgba(200,40,40,.18);border:1px solid #ff4040;color:#ff8080;font-size:11px;padding:6px 10px;border-radius:6px;margin-bottom:8px;text-align:center">
      ⚔️ 此人视你为仇敌，随时可能拔刀相向！</div>`;
  } else if(rel <= -20){
    hostileBanner = `<div style="background:rgba(180,80,20,.18);border:1px solid #ff8060;color:#ffaa80;font-size:11px;padding:6px 10px;border-radius:6px;margin-bottom:8px;text-align:center">
      😤 此人对你心存戒备，言辞可能不友善。</div>`;
  } else if(rel >= 60){
    hostileBanner = `<div style="background:rgba(20,120,60,.18);border:1px solid #60d080;color:#80ffa0;font-size:11px;padding:6px 10px;border-radius:6px;margin-bottom:8px;text-align:center">
      🤝 老朋友了，此人愿意为你多透露一些。</div>`;
  }
  const choiceHtml = renderNpcChatChoicesHtml(npcId, rel);

  // ── 送信/送货：检查是否有需要在此NPC处完成的 deliver 委托/任务 ──
  let deliverBanner = '';
  do {
    // ① npcReqState 委托型（req_inn_letter / req_smith_delivery 等）
    if(typeof npcReqState !== 'undefined' && Array.isArray(npcReqState.pending)){
      const pendingDeliver = npcReqState.pending.filter(r => {
        if(r.type !== 'deliver') return false;
        // 优先：targetNpcId 精准匹配
        if(r.targetNpcId && r.targetNpcId === npcId) return true;
        // 次选：targetCityId + targetRole 角色匹配（兼容旧数据）
        if(r.targetCityId && r.targetCityId !== cityId) return false;
        if(!r.targetRole) return false;
        const ROLE_MAP = { doctor:'doctor', guild:'guild_escort', smith:'blacksmith',
                           inn:'innkeeper', merchant:'merchant', tavern:'tavern_keeper' };
        const npcRole = npc.role || '';
        return (npcRole === r.targetRole || npcRole === ROLE_MAP[r.targetRole] || npcId.includes(r.targetRole));
      });
      if(pendingDeliver.length > 0){
        const req = pendingDeliver[0];
        const toName = req.targetNpcName || npc.name;
        deliverBanner = `<div style="background:rgba(240,192,40,.1);border:1px solid rgba(240,192,40,.35);border-radius:8px;padding:8px 12px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px">
          <span style="font-size:11px;color:#f0d060">📬 「${req.npcName}」托你传递的信件 → ${toName}</span>
          <button onclick="npcReqDeliverToNpc('${req.instanceId}')" style="background:rgba(240,192,40,.2);border:1px solid rgba(240,192,40,.5);color:#f0d060;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;white-space:nowrap">📮 送达</button>
        </div>`;
        break;
      }
    }
    // ② QUEST_DB 任务型（quest_newbie_letter_delivery / quest_daily_deliver）
    {
      const activeQuestIds = Object.entries(npcState.quests || {})
        .filter(([,s]) => s === 'active').map(([id]) => id);
      const activeDelivers = activeQuestIds.filter(qid => {
        const aq = getAnyQuest(qid);
        if(!aq || aq.type !== 'deliver') return false;
        // targetNpcId 精准匹配
        if(aq.targetNpcId && aq.targetNpcId === npcId) return true;
        // targetCityId 匹配且在同一城市（无 targetNpcId 时模糊匹配）
        if(aq.targetCityId && aq.targetCityId === cityId && !aq.targetNpcId) return true;
        return false;
      });
      if(activeDelivers.length > 0){
        const qid = activeDelivers[0];
        const aq  = getAnyQuest(qid);
        const toName = aq.targetName || npc.name;
        deliverBanner = `<div style="background:rgba(240,192,40,.1);border:1px solid rgba(240,192,40,.35);border-radius:8px;padding:8px 12px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px">
          <span style="font-size:11px;color:#f0d060">📬 你手持急件，需在此处完成送达 → ${toName}</span>
          <button onclick="npcQuestDeliverHere('${qid}')" style="background:rgba(240,192,40,.2);border:1px solid rgba(240,192,40,.5);color:#f0d060;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;white-space:nowrap">📮 送达</button>
        </div>`;
        break;
      }
    }
  } while(false);

  const panelChat = `${deliverBanner}${hostileBanner}<div class="npc-speech-bubble"><div class="npc-speech-text">${greeting}</div></div>
    <div class="npc-chat-choices">${choiceHtml}</div>`;


  // ② 任务面板
  // 合并静态任务 + 动态阵营任务
  const staticQuestIds = npc.quests || [];
  const dynQuests      = genAlignmentQuests(npcId, cityId);
  const dynQuestIds    = dynQuests.map(q => q.id);
  const allQuestIds    = [...staticQuestIds, ...dynQuestIds];

  // ── 任务可见性过滤规则 ──
  // 1. 条件不满足（好感/前置链）→ 不显示
  // 2. 重复任务（repeatable）→ 单独收集，全部显示（冷却中也显示）
  // 3. 一次性任务：进行中/待领奖各取最多1条，可接受的只取优先级最高的1条
  //    优先级：done > active > available（按 allQuestIds 顺序取第一条）

  const repeatQuestIds = [];   // 重复任务（全部显示）
  const doneQuestIds   = [];   // 一次性：待领奖
  const activeQuestIds = [];   // 一次性：进行中
  const availableQuestIds = []; // 一次性：可接受

  for(const qid of allQuestIds){
    const q = getAnyQuest(qid);
    if(!q) continue;
    const raw = getQuestStatus(qid);

    // 重复任务单独处理
    if(q.repeatable){
      // 冷却中也显示（让玩家知道何时可再接）
      const disp = getQuestDisplayStatus(qid);
      const inCooldown = disp.startsWith('cooldown_');
      if(raw === 'active' || raw === 'done' || raw === 'available' || inCooldown){
        repeatQuestIds.push(qid);
      }
      continue;
    }

    // 一次性任务：已完成则不显示
    if(raw === 'claimed') continue;

    // 进行中/待领奖：始终可见（不做条件检查）
    if(raw === 'done'){ doneQuestIds.push(qid); continue; }
    if(raw === 'active'){ activeQuestIds.push(qid); continue; }

    // 可接受：必须满足所有条件才显示（好感/前置链/等级/城市产出等）
    if(q.minRel && getNpcRel(npcId) < q.minRel) continue;
    if(!isQuestAvailable(qid, npcId, cityId)) continue;
    availableQuestIds.push(qid);

  }

  // 一次性任务：严格串联——只显示当前最高优先级1条
  // 有待领奖 → 只显示待领奖；有进行中 → 只显示进行中；否则才显示可接受
  let onceQuestIds = [];
  if(doneQuestIds.length){
    onceQuestIds = [doneQuestIds[0]];
  } else if(activeQuestIds.length){
    onceQuestIds = [activeQuestIds[0]];
  } else if(availableQuestIds.length){
    onceQuestIds = [availableQuestIds[0]];
  }

  const visibleQuestIds = [...onceQuestIds, ...repeatQuestIds];

  // ── 任务面板顶部：好感度状态栏 ──
  const relVal = rel; // rel 已在外层计算
  // 好感分档标签
  let relLabel, relColor;
  if(relVal >= 80){ relLabel = '挚友'; relColor = '#80ffa0'; }
  else if(relVal >= 60){ relLabel = '知交'; relColor = '#60d890'; }
  else if(relVal >= 40){ relLabel = '熟识'; relColor = '#c8d860'; }
  else if(relVal >= 20){ relLabel = '相识'; relColor = '#d8b840'; }
  else if(relVal >= 0) { relLabel = '陌路'; relColor = '#a0a0a0'; }
  else if(relVal >= -20){ relLabel = '疏远'; relColor = '#d07040'; }
  else { relLabel = '仇敌'; relColor = '#ff6060'; }

  // 下一个好感门槛
  const REL_THRESHOLDS = [0, 10, 20, 30, 40, 60, 80, 100];
  const nextThreshold = REL_THRESHOLDS.find(t => t > relVal) || 100;
  const prevThreshold = [...REL_THRESHOLDS].reverse().find(t => t <= relVal) || 0;
  const barPct = nextThreshold > prevThreshold
    ? Math.round((relVal - prevThreshold) / (nextThreshold - prevThreshold) * 100)
    : 100;
  // 当前进行中任务数
  const curActiveCount = countActiveQuests();
  const atLimit = curActiveCount >= MAX_ACTIVE_QUESTS;
  const activeCountHint = `<span style="font-size:10px;color:${atLimit?'#ff8060':'rgba(160,200,160,.6)'}">
    📋 进行中任务：${curActiveCount}/${MAX_ACTIVE_QUESTS}${atLimit?' （已达上限，需完成或放弃后才能接新任务）':''}
  </span>`;

  const questHeaderHtml = `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(0,0,0,.25);border-radius:8px;margin-bottom:10px;border:1px solid rgba(255,255,255,.06)">
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:11px;color:rgba(200,180,140,.7)">💛 与${npc.name}的好感</span>
          <span style="font-size:12px;font-weight:bold;color:${relColor}">${relLabel}（${relVal > 0 ? '+' : ''}${relVal}）</span>
        </div>
        <div style="height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${barPct}%;background:${relColor};border-radius:2px;transition:width .3s"></div>
        </div>
        <div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px;align-items:center">
          ${activeCountHint}
        </div>
      </div>
    </div>`;

  const questHtml = visibleQuestIds.map(qid => {
    const q = getAnyQuest(qid);
    if(!q) return '';
    const rawStatus   = getQuestStatus(qid);
    const dispStatus  = getQuestDisplayStatus(qid);

    // 解析冷却状态（重复任务）
    const isCooldown = dispStatus.startsWith('cooldown_');
    const cooldownLeft = isCooldown ? parseInt(dispStatus.split('_')[1]) : 0;

    // 状态标签文字和CSS
    let statusLabel, statusCls;
    if(isCooldown){
      statusLabel = `冷却${cooldownLeft}天`;
      statusCls = 'qs-claimed';
    } else {
      statusLabel = {available:'可接取',active:'进行中',done:'可领奖',claimed:'已完成'}[rawStatus] || '可接取';
      statusCls   = {available:'qs-available',active:'qs-active',done:'qs-done',claimed:'qs-claimed'}[rawStatus] || 'qs-available';
    }

    // 连环任务链标记
    let chainBadge = '';
    if(q.chain){
      const totalSteps = _getChainTotalSteps(q.chain);
      chainBadge = `<span style="font-size:9px;color:#c8a840;border:1px solid rgba(200,168,64,.4);background:rgba(80,60,0,.3);padding:1px 5px;border-radius:3px;margin-left:4px">🔗 ${q.chainStep}/${totalSteps}</span>`;
    }
    // 重复任务标记
    let repeatBadge = '';
    if(q.repeatable){
      repeatBadge = `<span style="font-size:9px;color:#60d0ff;border:1px solid rgba(96,208,255,.3);background:rgba(0,40,60,.3);padding:1px 5px;border-radius:3px;margin-left:4px">🔄 可重复</span>`;
    }
    // 等级限制标记
    let levelBadge = '';
    const playerLevel = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;
    if(q.minLevel || q.maxLevel){
      const minL = q.minLevel || 1;
      const maxL = q.maxLevel || '∞';
      const isLocked = (q.minLevel && playerLevel < q.minLevel) || (q.maxLevel && playerLevel > q.maxLevel);
      const lockIcon = isLocked ? '🔒' : '';
      levelBadge = `<span style="font-size:9px;color:${isLocked?'#ff6060':'#a0a0a0'};border:1px solid ${isLocked?'rgba(255,96,96,.4)':'rgba(160,160,160,.3)'};background:rgba(${isLocked?'60,0,0':'40,40,40'},.3);padding:1px 5px;border-radius:3px;margin-left:4px">${lockIcon}Lv${minL}-${maxL}</span>`;
    }

    // kill 类：显示目标信息
    let targetHint = '';
    if(q.type === 'kill' && q.targetName && rawStatus !== 'claimed'){
      const tCity = q.targetCityId ? (
        typeof WORLD_NODES !== 'undefined'
          ? (WORLD_NODES[q.targetCityId]?.name || q.targetCityId)
          : q.targetCityId
      ) : '江湖各处';
      const tierLabel = { func:'', major:'（重要）', elite:'（精英）' }[q.targetTier] || '';
      targetHint = `<div class="npc-quest-target">🎯 目标：${q.targetName}${tierLabel} · ${tCity}</div>`;
    }
    // fetch/collect 类：显示物品信息
    else if((q.type === 'fetch' || q.type === 'collect') && q.targetItem && rawStatus !== 'claimed'){
      const itemName = q.targetName || '未知物品';
      const itemCount = q.targetCount || 1;
      targetHint = `<div class="npc-quest-target">📦 需要：${itemName} ×${itemCount}</div>`;
    }
    // deliver 类：显示送达目标
    else if(q.type === 'deliver' && q.targetName && rawStatus !== 'claimed'){
      const tCity = q.targetCityId ? (
        typeof WORLD_NODES !== 'undefined'
          ? (WORLD_NODES[q.targetCityId]?.name || q.targetCityId)
          : q.targetCityId
      ) : '指定地点';
      targetHint = `<div class="npc-quest-target">📮 送达：${q.targetName} · ${tCity}</div>`;
    }

    // 按钮逻辑
    let btn = '';
    if(isCooldown){
      btn = `<button class="npc-quest-btn" disabled>冷却中（还剩${cooldownLeft}天）</button>`;
    } else if(rawStatus === 'available'){
      btn = `<button class="npc-quest-btn" onclick="npcAcceptQuest('${qid}')">接受任务</button>`;
    } else if(rawStatus === 'active'){
      let progressBtn = '';
      if(q.type === 'kill' && q.targetName)
        progressBtn = `<button class="npc-quest-btn" disabled>等待击杀：${q.targetName}…</button>`;
      else if(q.type === 'travel')
        progressBtn = `<button class="npc-quest-btn" disabled>旅行途中完成…</button>`;
      else if((q.type === 'fetch' || q.type === 'collect') && q.targetName)
        progressBtn = `<button class="npc-quest-btn" disabled>收集物品：${q.targetName}…</button>`;
      else if(q.type === 'deliver' && q.targetName){
        // deliver任务：如果当前城市就是目标城市，显示"立即送达"按钮
        const currentCityId = typeof _curCityId !== 'undefined' ? _curCityId : null;
        if(q.targetCityId && currentCityId === q.targetCityId){
          progressBtn = `<button class="npc-quest-btn" onclick="npcCompleteDeliverQuest('${qid}')">📮 立即送达</button>`;
        } else {
          progressBtn = `<button class="npc-quest-btn" disabled>送达：${q.targetName}…</button>`;
        }
      }
      else
        progressBtn = `<button class="npc-quest-btn" disabled>进行中…</button>`;
      const abandonBtn = `<button class="npc-quest-btn npc-quest-btn-abandon" onclick="npcAbandonQuest('${qid}')">放弃任务</button>`;
      btn = `<div style="display:flex;gap:6px;flex-wrap:wrap">${progressBtn}${abandonBtn}</div>`;
    } else if(rawStatus === 'done'){
      btn = `<button class="npc-quest-btn" onclick="npcClaimQuest('${qid}')">领取奖励</button>`;
    } else {
      btn = `<span style="font-size:10px;color:rgba(160,160,160,.4)">已完成</span>`;
    }

    return `<div class="npc-quest-item">
      <div class="npc-quest-header">
        <span class="npc-quest-icon">${q.icon}</span>
        <span class="npc-quest-name">${q.name}</span>
        ${chainBadge}${repeatBadge}${levelBadge}
        <span class="npc-quest-status ${statusCls}">${statusLabel}</span>
      </div>
      <div class="npc-quest-desc">${q.desc}</div>
      ${targetHint}
      <div class="npc-quest-reward">🎁 奖励：${q.rewardText}</div>
      ${btn}
    </div>`;
  }).join('');
  const panelQuest = `${questHeaderHtml}` + (questHtml
    ? `<div class="npc-quest-list">${questHtml}</div>`
    : `<div style="color:rgba(160,180,160,.4);font-size:12px;padding:20px 0;text-align:center">暂无可接任务</div>`);



  // ③ 商店面板（可选）
  let panelShop = '';
  if(npc.shop){
    if(rel <= -60){
      // 仇敌：拒绝交易
      const refusals = [
        `"${npc.name}眯起眼睛，冷声道：「滚！你这种人，休想从我这里买到任何东西。」"`,
        `"${npc.name}拍案而起：「你有脸来？给我出去！」"`,
        `"${npc.name}冷哼一声，转过身去，根本不想看你。"`,
        `"「做你的春秋大梦吧。」${npc.name}轻蔑地看了你一眼，闭上了嘴。"`,
      ];
      const refuseText = refusals[Math.floor(Math.random()*refusals.length)];
      panelShop = `<div style="text-align:center;padding:30px 16px;">
        <div style="font-size:28px;margin-bottom:12px;">⚔️</div>
        <div style="color:#ff6060;font-size:13px;line-height:1.8;margin-bottom:16px;">${refuseText}</div>
        <div style="color:rgba(200,140,100,.6);font-size:11px;">此人视你为仇敌，不会与你交易。<br>改善关系后方可购物。</div>
      </div>`;
    } else {
      // 商店折扣：6档（敌意加价/陌路正价/友善九折/挚友八折/深交七折/知己六折）
      let discount, discountLabel;
      if(rel <= -20)     { discount = 1.10; discountLabel = '⚠ 加价一成'; }
      else if(rel < 20)  { discount = 1.00; discountLabel = ''; }
      else if(rel < 60)  { discount = 0.90; discountLabel = '友善 九折'; }
      else if(rel < 80)  { discount = 0.80; discountLabel = '挚友 八折'; }
      else if(rel < 100) { discount = 0.70; discountLabel = '深交 七折'; }
      else               { discount = 0.60; discountLabel = '✦ 知己 六折'; }
      // 城市声望价格调整（门派控制城市折扣/加价）
      let cityPriceMod = 1.0, cityPriceLabel = '', cityPriceColor = '';
      if(typeof jhGetCityPriceMod === 'function' && cityId){
        cityPriceMod = jhGetCityPriceMod(cityId);
        if(cityPriceMod < 1.0){
          cityPriceLabel = '🏰 九折';
          cityPriceColor = '#80ff80';
        } else if(cityPriceMod > 1.0){
          cityPriceLabel = '🏰 议价难';
          cityPriceColor = '#ff8080';
        }
      }
      // 世界事件价格调整
      const wePriceMod = (typeof weGetPriceMod === 'function') ? weGetPriceMod(npc.shop.type, cityId) : 1.0;
      // 获取玩家门派（用于门派限制判定）
      const _playerSect = (typeof edS !== 'undefined') ? (edS.sect || null) : null;
      const itemHtml = (npc.shop.items||[]).map((item, idx)=>{
        const realPrice = Math.round(item.price * discount * cityPriceMod * wePriceMod);
        // 价格颜色：综合折扣效果（绿=优惠，红=贵）
        const totalMod = discount * cityPriceMod * wePriceMod;
        const priceColor = totalMod < 1 ? '#80ff80' : totalMod > 1 ? '#ff8080' : '';

        // ── 门派限制检查（仅对功法类商品）──
        let _locked = false, _lockTip = '', _reqSectName = '';
        if(item.effect && item.effect.manual && typeof MANUAL_DB !== 'undefined'){
          const _m = MANUAL_DB[item.effect.manual];
          if(_m && _m.reqSect){
            if(_playerSect !== _m.reqSect){
              _locked = true;
              _reqSectName = (typeof SECTS !== 'undefined' && SECTS[_m.reqSect]) ? SECTS[_m.reqSect].name : _m.reqSect;
              _lockTip = `需加入「${_reqSectName}」`;
            }
          }
        }

        // 组合折扣标签（关系折扣 + 城市声望）
        let _tagHtml = '';
        if(_locked){
          _tagHtml = '<span class="npc-shop-discount" style="background:rgba(120,60,20,.45);color:#e8a050">🔒 门派限定</span>';
        } else {
          const _tags = [];
          if(discountLabel){
            const _relColor = discount > 1 ? 'background:rgba(180,40,40,.4);color:#ff8080' : '';
            _tags.push(`<span class="npc-shop-discount" style="${_relColor}">${discountLabel}</span>`);
          }
          if(cityPriceLabel){
            const _cityBg = cityPriceMod > 1 ? 'background:rgba(180,40,40,.4);color:#ff8080' : 'background:rgba(20,100,40,.4);color:#80ff80';
            _tags.push(`<span class="npc-shop-discount" style="${_cityBg}">${cityPriceLabel}</span>`);
          }
          _tagHtml = _tags.join('');
        }
        return `<div class="npc-shop-item${_locked?' npc-shop-locked':''}"
                     data-shop-idx="${idx}" data-item-id="${item.id}" data-npc-id="${npcId}"
                     data-price="${realPrice}" ${_locked?`data-locked="1" data-lock-reason="${_lockTip}"`:''}
                     style="${_locked?'opacity:.55;pointer-events:none':''}">
          ${_tagHtml}
          <div class="npc-shop-item-icon">${item.icon}</div>
          <div class="npc-shop-item-name">${item.name}${_locked ? ' 🔒' : ''}</div>
          <div class="npc-shop-item-desc">${item.desc}</div>
          ${_locked
            ? `<div class="npc-shop-item-price" style="color:#e8a050">🔒 ${_lockTip}</div>`
            : `<div class="npc-shop-item-price" style="${priceColor?'color:'+priceColor:''}">💰 ${realPrice}两</div>`
          }
        </div>`;
      }).join('');
      // 城市价格效果横幅
      let cityBannerHtml = '';
      if(cityPriceMod < 1.0 && cityPriceLabel){
        cityBannerHtml = `<div style="background:rgba(20,100,40,.18);border:1px solid #40a060;color:#80ffa0;font-size:11px;padding:5px 10px;border-radius:6px;margin-bottom:10px;text-align:center">
          🏰 ${cityPriceLabel} — 此城对你所在阵营颇为友善，购物享有折扣！</div>`;
      } else if(cityPriceMod > 1.0 && cityPriceLabel){
        cityBannerHtml = `<div style="background:rgba(180,40,40,.18);border:1px solid #c04040;color:#ff8080;font-size:11px;padding:5px 10px;border-radius:6px;margin-bottom:10px;text-align:center">
          🏰 ${cityPriceLabel} — 此城对外人颇有戒心，议价困难！</div>`;
      }
      // 世界事件横幅
      let weBannerHtml = '';
      if(wePriceMod < 1.0){
        weBannerHtml = `<div style="background:rgba(40,60,140,.18);border:1px solid #4060c0;color:#80a0ff;font-size:11px;padding:5px 10px;border-radius:6px;margin-bottom:10px;text-align:center">
          🌍 江湖动荡，物价因世道变化而波动！</div>`;
      } else if(wePriceMod > 1.0){
        weBannerHtml = `<div style="background:rgba(140,40,40,.18);border:1px solid #c04040;color:#ff8080;font-size:11px;padding:5px 10px;border-radius:6px;margin-bottom:10px;text-align:center">
          🌍 江湖风云变幻，物价因动乱而上涨！</div>`;
      }
      
      // ═══════════════════════════════════════════════════════════════
      //  "将将胡"神秘商人系统
      // ═══════════════════════════════════════════════════════════════
      const MYSTERY_MERCHANT_CHANCE = 0.01; // 1%概率出现
      let mysteryHtml = '';
      if(Math.random() < MYSTERY_MERCHANT_CHANCE && rel >= 0){
        const mysteryItems = _generateMysteryItems();
        if(mysteryItems.length > 0){
          mysteryHtml = _buildMysteryMerchantHtml(mysteryItems, discount, cityPriceMod, wePriceMod);
          if(typeof showToast === 'function'){
            showToast('🎭 神秘商人出现了！他带来了稀世珍品…', 'rare');
          }
        }
      }
      
      const buyPanelHtml = `<div class="npc-shop-grid" id="npcShopGrid">${cityBannerHtml}${weBannerHtml}${mysteryHtml}${itemHtml || '<div style="text-align:center;padding:24px;color:rgba(160,150,80,.35)">货架空空</div>'}</div>`;
      // 出售面板：显示玩家可出售物品
      const sellPanelHtml = _buildNpcSellPanel(npcId, rel);
      // 商店内子Tab
      panelShop = `
      <div class="npc-shop-subtabs">
        <button class="npc-shop-subtab active" id="npcSubTabBuy" onclick="_switchShopSubTab('buy')">🛒 购买</button>
        <button class="npc-shop-subtab" id="npcSubTabSell" onclick="_switchShopSubTab('sell')">📤 出售</button>
      </div>
      <div class="npc-shop-subcontent">
        <div id="npcShopBuyContent" class="npc-shop-subpage active">${buyPanelHtml}</div>
        <div id="npcShopSellContent" class="npc-shop-subpage">${sellPanelHtml}</div>
      </div>`;
    }
  }

  // ④ 情报面板
  const intelHtml = (npc.intels||[]).map(iid=>{
    const intel = INTEL_DB[iid];
    if(!intel) return '';
    const isNew = !isIntelRead(iid);
    markIntelRead(iid);
    const typeCls = {rumor:'intel-rumor',event:'intel-event',secret:'intel-secret',tip:'intel-tip'}[intel.type]||'intel-tip';
    return `<div class="npc-intel-item${isNew?' new-intel':''}">
      <span class="npc-intel-type ${typeCls}">${intel.label}${isNew?' ★':''}</span>
      <div>${intel.text}</div>
    </div>`;
  }).join('');
  const panelIntel = intelHtml ? `<div class="npc-intel-list">${intelHtml}</div>`
    : `<div style="color:rgba(160,180,160,.4);font-size:12px;padding:20px 0;text-align:center">暂无特别消息</div>`;

  // ⑤ 关系面板
  // relColor 已在第630行由 let relColor 声明并赋值（与 relLv.color 一致）
  const relPctBar = relPct;
  const relBarColor = rel < -20 ? '#ff6060' : rel < 20 ? '#80a080' : rel < 60 ? '#80d080' : '#ff9fc8';

  const relActHtml = renderNpcRelActionsHtml(npcId, rel);

  // 软上限提示
  const capTip = !npcState.questDoneFor?.[npcId] && rel >= 55
    ? `<div style="color:#c8a020;font-size:11px;margin:6px 0 2px;text-align:center">💬 完成任务方能深化情谊（突破友善上限）</div>`
    : '';

  // 阵营标签
  const npcAlignVal = getNpcAlignment(npcId);
  const alignInfo = {
    righteous: { label:'◆ 正道', color:'#80d0ff', tip:'正道人士，侠义之人更受欢迎' },
    evil:      { label:'◆ 邪道', color:'#ff6060', tip:'邪道势力，侠义之人天生不受待见' },
    chaotic:   { label:'◆ 混乱', color:'#ffaa40', tip:'行事无常，难以预测立场' },
    neutral:   { label:'◆ 中立', color:'#a0a0a0', tip:'一视同仁，不问正邪' },
  }[npcAlignVal] || { label:'◆ 中立', color:'#a0a0a0', tip:'一视同仁' };
  const initRel = calcNpcInitRel(npcId);
  const initRelTip = npcState.relations[npcId] !== undefined && initRel !== 0
    ? `（初始${initRel > 0 ? '+'+initRel : initRel}，因阵营影响）`
    : '';
  const alignBadge = `<div style="display:flex;align-items:center;gap:6px;margin:6px 0 4px;font-size:11px">
    <span style="color:${alignInfo.color};border:1px solid ${alignInfo.color}44;background:${alignInfo.color}11;padding:2px 7px;border-radius:8px">${alignInfo.label}</span>
    <span style="color:rgba(180,180,160,.6)">${alignInfo.tip}${initRelTip}</span>
  </div>`;

  const panelRel = `<div class="npc-rel-detail">
    <div class="npc-rel-name">${npc.name}</div>
    ${alignBadge}
    <div class="npc-rel-meter">
      <div class="npc-rel-track-big"><div class="npc-rel-fill-big" style="width:${relPctBar}%;background:${relBarColor}"></div></div>
      <div class="npc-rel-value" style="color:${relColor}">${rel > 0?'+':''}${rel}</div>
    </div>
    <div class="npc-rel-desc" id="npcRelDesc">${getNpcRelDesc(npcId, rel)}</div>
    ${capTip}
    <div class="npc-rel-actions" id="npcRelActions">${relActHtml}</div>
  </div>`;


  // 拼装所有面板（顺序必须与 tabs 数组一致：对话→任务→[商店]→情报→关系）
  const panels = [panelChat, panelQuest];
  if(npc.shop) panels.push(panelShop);
  panels.push(panelIntel, panelRel);

  const panelHtml = panels.map((p,i)=>`<div class="npc-panel${i===0?' active':''}" id="npcPanel${i}">${p}</div>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'npc-dialog-overlay';
  overlay.id = 'npcDialogOverlay';
  // 确保战斗数据已初始化（首次打开弹窗时）
  initNpcCombat(npcId, cityId+'_'+npcId);
  const npcInstId = cityId+'_'+npcId;
  const combatStats = getNpcCombatStats(npcInstId);
  const lvLabel = combatStats ? `<span style="font-size:10px;color:#80a060;margin-left:4px">Lv.${combatStats.level}</span>` : '';

  // 生成NPC字符画（ft-animated 部件动画）
  const cosStyle = (typeof getNpcCosStyle === 'function') ? getNpcCosStyle(npc.armor) : {color:'#aaaaaa'};
  const npcColor = cosStyle.color || '#aaaaaa';
  const portraitHtml = (typeof buildNpcPartsHtml === 'function')
    ? buildNpcPartsHtml(npc, npcColor)
    : `<pre>${(typeof getNpcPortrait === 'function') ? getNpcPortrait(npc) : ''}</pre>`;

  // 头顶装饰已由 buildNpcPartsHtml ft-aura 行（门派格言/护甲符文）承担

  // 根据好感度决定字符画动画心情
  const moodCls = rel >= 60 ? 'mood-happy' : rel <= -20 ? 'mood-angry' : '';

  // 武器/护甲显示名
  const wepName = npc.weapon ? ((typeof WEAPONS!=='undefined'&&WEAPONS.find(w=>w.id===npc.weapon))||{name:npc.weapon}).name : '赤手空拳';
  const cosName = npc.armor ? ((typeof COSTUMES!=='undefined'&&COSTUMES.find(c=>c.id===npc.armor))||{name:npc.armor}).name : '布衣';
  const wepSym  = typeof getNpcWepSym==='function' ? getNpcWepSym(npc.weapon) : '⚔';

  overlay.innerHTML = `<div class="npc-dialog-box" onclick="event.stopPropagation()">

    <!-- 左侧字符画栏 -->
    <div class="npc-dialog-left">
      <div class="npc-dialog-portrait-wrap" style="color:${npcColor}">
        <div class="npc-dialog-portrait ft-animated ${moodCls}" style="color:${npcColor};filter:drop-shadow(0 0 8px ${npcColor})">${portraitHtml}</div>
      </div>
      <div class="npc-dialog-name">${npc.name}${lvLabel}</div>
      <div class="npc-dialog-title">${npc.role}</div>
      <div class="npc-dialog-rel-bar">
        <div class="npc-rel-track"><div class="npc-rel-fill" style="width:${relPct}%;background:${relBarColor}"></div></div>
        <span style="color:${relColor}">${relLv.label}</span>
      </div>
      <div class="npc-dialog-equip-row">
        <span title="${npc.weapon||'无武器'}">${wepSym} ${wepName}</span>
        <span class="npc-equip-label">🥋 ${cosName}</span>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="npc-dialog-right">
      <div class="npc-dialog-right-header">
        <span class="npc-dialog-right-title">· 江湖一隅 ·</span>
        <button class="npc-dialog-close" onclick="closeNpcDialog()">✕</button>
      </div>
      <div class="npc-tabs">${tabHtml}</div>
      <div class="npc-tab-content">${panelHtml}</div>
      <div class="npc-dialog-footer">
        <button onclick="openNpcFightPanel('${npcId}','${npcInstId}','${cityId}')"
          style="background:rgba(120,20,20,.55);border:1px solid rgba(200,60,60,.35);color:#ffaaaa;padding:5px 14px;border-radius:5px;cursor:pointer;font-size:12px">
          ⚔ 动手
        </button>
      </div>
    </div>

  </div>`;
  overlay.onclick = closeNpcDialog;
  document.body.appendChild(overlay);

  // 商店物品事件委托（替代 inline onclick，彻底避免事件冒泡问题）
  setTimeout(()=>{
    const grid = document.getElementById('npcShopGrid');
    if(grid){
      grid.addEventListener('click', e=>{
        const item = e.target.closest('.npc-shop-item');
        if(!item) return;
        e.stopPropagation();
        const {itemId, npcId, price} = item.dataset;
        npcBuyItem(itemId, npcId, Number(price));
      });
    }
  }, 0);

  // 关闭后刷新 NPC 列表（更新好感度显示）
  overlay._onclose = ()=> renderCityNpcs(cityId);
}

function closeNpcDialog(){
  const el = document.getElementById('npcDialogOverlay');
  if(el){ if(el._onclose) el._onclose(); el.remove(); }
  _curNpcId = null; _curCityId = null;
}

// ── 打开剧情专属NPC对话弹窗（鹤隐等 storyOnly NPC）──
// 关闭后自动触发 SGTalk，推进主线指引
window.openStoryNpcDialog = function(npcId, cityId){
  if(typeof STORY_NPCS === 'undefined' || !STORY_NPCS[npcId]) return;
  const npc = STORY_NPCS[npcId];

  // 关闭已有弹窗（触发 _onclose 回调）
  const old = document.getElementById('npcDialogOverlay');
  if(old){ if(old._onclose) old._onclose(); old.remove(); }

  // 取当前剧情节点的 narrative 作对话内容
  const beat = (typeof StoryGuide !== 'undefined') ? StoryGuide.current && StoryGuide.current() : null;
  const narrative = beat ? beat.narrative : '';
  const greetings = npc.greetings || [];
  const greeting  = greetings[Math.floor(Math.random() * greetings.length)] || `「有缘人，我们又见面了。」`;

  const overlay = document.createElement('div');
  overlay.id = 'npcDialogOverlay';
  overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);z-index:9000;display:flex;align-items:center;justify-content:center`;
  overlay.innerHTML = `
  <div onclick="event.stopPropagation()" style="background:rgba(15,10,5,.95);border:1px solid rgba(240,192,40,.45);max-width:340px;width:92%;border-radius:12px;padding:20px 18px;position:relative">
    <div style="position:absolute;top:8px;right:12px;font-size:10px;color:#f0d060;opacity:.7">⭐ 主线角色</div>
    <button onclick="closeNpcDialog()" style="position:absolute;top:6px;left:12px;background:none;border:none;color:#a08060;font-size:18px;cursor:pointer">✕</button>
    <div style="display:flex;align-items:center;gap:12px;margin:16px 0 12px">
      <div style="font-size:42px">${npc.avatar}</div>
      <div>
        <div style="color:#f0d060;font-size:16px;font-weight:bold">${npc.name}</div>
        <div style="color:#a08060;font-size:12px">${npc.role}</div>
      </div>
    </div>
    ${narrative ? `<div style="color:#c0a060;font-size:13px;line-height:1.7;background:rgba(30,20,10,.5);border-radius:6px;padding:10px 12px;margin-bottom:12px;border-left:2px solid rgba(240,192,40,.3)">${narrative}</div>` : ''}
    <div style="color:#e8c080;font-size:13px;line-height:1.8;font-style:italic;margin-bottom:14px">${greeting}</div>
    <div style="display:flex;justify-content:flex-end">
      <button onclick="closeNpcDialog()" style="background:rgba(240,192,40,.2);border:1px solid rgba(240,192,40,.5);color:#f0d060;border-radius:6px;padding:6px 18px;font-size:13px;cursor:pointer">告辞</button>
    </div>
  </div>`;

  overlay.onclick = closeNpcDialog;
  document.body.appendChild(overlay);

  // 关闭时触发 StoryGuide.talk 推进主线
  overlay._onclose = () => {
    if(typeof StoryGuide !== 'undefined') StoryGuide.talk(npc.name);
    if(typeof renderCityNpcs === 'function') renderCityNpcs(cityId);
  };
};

// ── 打开替代者对话弹窗（动态生成的接替NPC）──
// origNpcInstId: 原 elite NPC 的 npcInstId（用于读取 replacement 数据）
// cityId: 城市ID
function openReplacementNpcDialog(origNpcInstId, cityId){
  npcStateLoad();
  const rpl = (typeof getReplacementNpc === 'function') ? getReplacementNpc(origNpcInstId) : null;
  if(!rpl){ showToast('该人物已不在此地'); return; }

  const rplInstId = origNpcInstId + '_rpl';
  // 初始化战斗数据
  if(typeof initReplacementCombat === 'function'){
    initReplacementCombat(origNpcInstId, rpl);
  }

  const greeting = rpl.greetings[Math.floor(Math.random() * rpl.greetings.length)];
  const topicsHtml = rpl.topics.map(t=>`
    <div class="npc-topic" onclick="rplDoTopic('${t.id}','${origNpcInstId}','${cityId}')">
      ${t.text}
    </div>`).join('');

  const overlay = document.createElement('div');
  overlay.id = 'npcDialogOverlay';
  overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.72);z-index:9000;display:flex;align-items:center;justify-content:center`;
  overlay.innerHTML = `
  <div class="npc-dialog-box" style="background:rgba(15,10,5,.92);border:1px solid rgba(180,100,30,.4);max-width:360px;width:92%;border-radius:10px;padding:18px 16px;position:relative" onclick="event.stopPropagation()">
    <button onclick="closeNpcDialog()" style="position:absolute;top:8px;right:12px;background:none;border:none;color:#a08060;font-size:18px;cursor:pointer">✕</button>

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="font-size:36px">${rpl.avatar}</div>
      <div>
        <div style="color:#e8c080;font-size:15px;font-weight:bold">${rpl.name}</div>
        <div style="color:#a08060;font-size:12px">${rpl.role}
          <span style="color:#887060;font-size:10px">（继任）</span>
          <span style="color:#8080a0;font-size:10px;margin-left:8px">Lv.${rpl.level}</span>
        </div>
      </div>
    </div>

    <div style="color:#c8b080;font-size:13px;line-height:1.6;background:rgba(60,40,10,.3);border-radius:6px;padding:10px 12px;margin-bottom:12px;border-left:2px solid rgba(180,120,30,.4)">
      「${greeting}」
    </div>

    <div style="margin-bottom:12px">
      <div style="color:#a08060;font-size:11px;margin-bottom:6px">── 话题 ──</div>
      ${topicsHtml}
    </div>

    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button onclick="openRplFightPanel('${origNpcInstId}','${cityId}')"
        style="background:rgba(120,20,20,.55);border:1px solid rgba(200,60,60,.35);color:#ffaaaa;padding:5px 14px;border-radius:5px;cursor:pointer;font-size:12px">
        ⚔ 动手
      </button>
    </div>
  </div>`;

  overlay.onclick = closeNpcDialog;
  document.body.appendChild(overlay);
  overlay._onclose = ()=> renderCityNpcs(cityId);
}

// ── 替代者对话选项处理 ──
function rplDoTopic(topicId, origNpcInstId, cityId){
  const rpl = (typeof getReplacementNpc === 'function') ? getReplacementNpc(origNpcInstId) : null;
  if(!rpl) return;
  const t = rpl.topics.find(x => x.id === topicId);
  if(!t) return;
  showToast(`「${t.reply}」`);
  if(t.action === 'spar_fight'){
    setTimeout(()=> openRplFightPanel(origNpcInstId, cityId), 400);
  }
}

// ── 替代者战斗面板 ──
function openRplFightPanel(origNpcInstId, cityId){
  const rpl = (typeof getReplacementNpc === 'function') ? getReplacementNpc(origNpcInstId) : null;
  if(!rpl){ showToast('找不到对手信息'); return; }
  const rplInstId = origNpcInstId + '_rpl';

  // 确保战斗实例存在
  if(typeof initReplacementCombat === 'function'){
    initReplacementCombat(origNpcInstId, rpl);
  }

  const cs = (typeof getNpcCombatStats === 'function') ? getNpcCombatStats(rplInstId) : null;
  if(!cs){ showToast('无法发起战斗'); return; }

  // 关闭弹窗
  document.getElementById('npcDialogOverlay')?.remove();

  // 技能：从通用major技能池随机抽取，或空数组
  const rplSkillObjs = [];
  // 构建NPC字符画parts（用avatar图标做伪npc对象）
  const fakeNpc = { avatar: rpl.avatar, role: rpl.role, id: '_replacement_npc_' };
  let npcParts = null;
  if(typeof buildNpcPartIndices === 'function'){
    npcParts = buildNpcPartIndices(fakeNpc);
  }

  const npcChar = {
    id:       '_rpl_' + origNpcInstId,
    name:     rpl.name,
    title:    (rpl.avatar || '👤') + ' ' + rpl.role,
    tag:      'major',
    tagColor: '#ffd060',
    color:    '#ffd060',
    level:    cs.level,
    maxHp:    cs.maxHp,
    atk:      cs.atk,
    def:      cs.def,
    crit:     cs.crit,
    dodge:    cs.dodge,
    speedN:   cs.spd || 8,
    mp:       cs.maxMp,
    maxMp:    cs.maxMp,
    stand: null, attack:[], heavy:[], hit:[], down:'',
    parts:    npcParts,
    skills:   rplSkillObjs,
    tier:     'major',
    _isNpc:       true,
    _npcId:       '_replacement_npc_',
    _npcInstId:   rplInstId,
    _npcCityId:   cityId,
    _npcTier:     'major',
    _relMod:      1.0,
  };

  const playerChar = (typeof CHARS !== 'undefined')
    ? (CHARS.find(c => c.id === 'cp_self') || CHARS[0])
    : null;
  if(!playerChar){ showToast('请先创建角色'); return; }
  if(typeof startWildBattle !== 'function'){ showToast('战斗系统未加载'); return; }

  startWildBattle(playerChar, npcChar, function(playerWon){
    if(playerWon){
      // 替代者被击败：从deaths中清除 replacement，让位置变回「已陨落」
      npcStateLoad();
      if(npcState.deaths && npcState.deaths[origNpcInstId]){
        const silverDrop = cs.silver || 0;
        if(silverDrop > 0){
          SilverManager.add(silverDrop);
          SilverManager.save();
        }
        // 删除替代者，删除战斗实例
        delete npcState.deaths[origNpcInstId].replacement;
        delete npcState.npcInsts[rplInstId];
        npcStateSave();
        showToast(`击败 ${rpl.name}！继任者已被逐出此地。${silverDrop>0?'获得'+silverDrop+'两银子。':''}`);
      }
      if(typeof renderCityNpcs === 'function') setTimeout(()=> renderCityNpcs(cityId), 300);
      if(typeof travelRenderIndex === 'function') travelRenderIndex();
    } else {
      showToast(`被 ${rpl.name} 击败，落荒而逃...`);
      if(typeof travelRenderIndex === 'function') travelRenderIndex();
    }
  });
}

function npcSwitchTab(btn, idx){
  btn.closest('.npc-dialog-box').querySelectorAll('.npc-tab').forEach((t,i)=> t.classList.toggle('active',i===idx));
  btn.closest('.npc-dialog-box').querySelectorAll('.npc-panel').forEach((p,i)=> p.classList.toggle('active',i===idx));
}

// ── 对话选项处理 ──
function npcDoTopic(topicId, npcId){
  const npc = NPC_DB[npcId];
  if(!npc) return;
  const rel = getNpcRel(npcId);

  // ── 特殊话题：医馆治疗服务 ──
  if(topicId === 'heal_service'){
    const _svcFn = typeof window.travelServiceAction === 'function' ? window.travelServiceAction : null;
    closeNpcDialog();
    _svcFn ? _svcFn('hospital', _curCityId) : showToast('医馆服务暂不可用');
    return;
  }

  const tp = _getNpcDialogTopics(npcId, rel).find(t => t.id === topicId);
  if(!tp) return;
  const isGiftFollowup = !!tp.giftFollowup;
  const topicKey = _getNpcTopicDoneKey(npcId, topicId);
  const alreadyDone = !!npcState.topicsDone[topicKey];
  const replyText = _resolveNpcTopicReply(tp, npcId, rel);

  // 更新对话气泡
  const bubble = document.querySelector('.npc-speech-bubble .npc-speech-text');
  if(bubble) bubble.textContent = replyText;

  // 话题好感：只在首次触发时生效
  if(tp.relDelta && !alreadyDone){
    npcState.topicsDone[topicKey] = true;
    changeNpcRel(npcId, tp.relDelta);
    npcStateSave();
  } else if(!alreadyDone){
    npcState.topicsDone[topicKey] = true;
    npcStateSave();
  }

  if(tp.intelId && !isIntelRead(tp.intelId)) markIntelRead(tp.intelId);

  // 心情任务进度：交互类心情任务对话一次即完成
  if(typeof updateMoodQuestProgress === 'function') {
    updateMoodQuestProgress(npcId, 'talk', 1);
  }

  // 随机心情触发（5%概率）
  if(typeof maybeAddRandomMood === 'function') {
    maybeAddRandomMood(npcId, rel);
  }

  // 执行动作
  if(tp.action){
    const _svcFn = typeof window.travelServiceAction === 'function' ? window.travelServiceAction : null;
    // 兜底：_curCityId 可能因某些调用路径未传 cityId 而为 null/undefined，此时用 travelCurrentCity 或 'luoyang'
    const _resolvedCityId = _curCityId || (typeof travelCurrentCity !== 'undefined' ? travelCurrentCity : null) || 'luoyang';
    if(tp.action === 'inn_rest') { closeNpcDialog(); _svcFn ? _svcFn('inn', _resolvedCityId) : showToast('旅店服务暂不可用'); }
    else if(tp.action === 'heal_hp' || tp.action === 'open_hospital') { closeNpcDialog(); _svcFn ? _svcFn('hospital', _resolvedCityId) : showToast('医馆服务暂不可用'); }
    else if(tp.action === 'go_weapons') { closeNpcDialog(); travelGoWeapons(); }
    else if(tp.action === 'go_skills') { closeNpcDialog(); showPage('skills'); }
    else if(tp.action === 'open_shop') { _switchNpcTabByName('商店'); }
    else if(tp.action === 'open_quest_tab') {
      _switchNpcTabByName('任务');
      showToast('对方把话挑明了，去任务页看看具体委托。');
    }
    else if(tp.action === 'open_intel_tab') {
      _switchNpcTabByName('情报');
      showToast('这条口风已经记下，去情报页细看。');
    }
    else if(tp.action === 'buy_drink') {
      if(!npcSpendSilver(3)) return;
      if(typeof travelPlayerState !== 'undefined') {
        travelPlayerState.energy = Math.min(100, (travelPlayerState.energy||80) + 20);
        if(typeof travelSave === 'function') travelSave();
        if(typeof travelRenderIndex === 'function') travelRenderIndex();
      }
      showToast('喝下竹叶青，精力+20');
    }
    else if(tp.action === 'pay_song') {
      if(!npcSpendSilver(2)) return;
      showToast('歌声悠扬，心情舒畅！');
    }
    else if(tp.action === 'pay_info') {
      if(!npcSpendSilver(5)) return;
    }
    else if(tp.action === 'train_skill') {
      showToast('老侠指点了你一招，感悟良多！');
    }
    else if(tp.action === 'identify_equip') {
      // 打开铁匠鉴定界面
      closeNpcDialog();
      showNpcIdentifyPanel();
    }
    else if(tp.action === 'enhance_equip') {
      closeNpcDialog();
      showNpcEnhancePanel();
    }
    else if(tp.action === 'repair_equip') {
      closeNpcDialog();
      showNpcRepairPanel();
    }
    else if(tp.action === 'open_escort') {
      // 打开护镖小游戏
      closeNpcDialog();
      if(typeof openEscortGame === 'function'){
        const cityId = (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : 'kaifeng';
        openEscortGame(cityId);
      } else {
        showToast('护镖系统加载中...');
      }
    }
    else if(tp.action === 'join_sect' || tp.action === 'sect_trial') {
      // 门派试炼 / 申请加入
      closeNpcDialog();
      const npcSect = (typeof _npcCur !== 'undefined' && _npcCur) ? _getNpcSectId(_npcCur) : null;
      if(npcSect){
        if(typeof window._doSectTrial === 'function'){
          window._doSectTrial(npcSect);
        } else {
          showToast('门派系统加载中...', 'warn');
        }
      } else {
        showToast('此NPC无法引荐门派。', 'warn');
      }
    }
    else if(tp.action === 'start_sect_chain') {
      // 门派专属任务链触发
      const npcSect = _getNpcSectId(npcId);
      if(npcSect && typeof SECT_CHAINS !== 'undefined' && SECT_CHAINS[npcSect]){
        const chainQuest = getCurrentSectChainQuest(npcSect);
        if(chainQuest){
          // 检查是否是第一章
          if(chainQuest.narrative && chainQuest.narrative.accept){
            showNarrativeDialog(chainQuest.narrative.accept, () => {
              advanceSectChain(npcSect);
              showToast(`📜 任务推进：${chainQuest.name}`);
            });
          } else {
            advanceSectChain(npcSect);
            showToast(`📜 任务推进：${chainQuest.name}`);
          }
        } else {
          showToast('门派任务链已完成！', 'info');
        }
      } else {
        showToast('门派任务链数据未加载...', 'warn');
      }
    }
  }
  if(isGiftFollowup){
    _clearNpcGiftFollowupTopic(npcId, false);
    npcStateSave();
    _refreshNpcChatChoices(npcId);
    showToast('你顺着礼数打开了话头。');
  }
  if(tp.relDelta || !alreadyDone) npcUpdateRelBar(npcId);
  if(isGiftFollowup || !alreadyDone || tp.repeatReply || tp.repeatReplyStages || tp.requiresTopic || tp.requiresTopics){
    _refreshNpcChatChoices(npcId);
  }
}


// ════════════════════════════════════════════════════
//  随便聊聊  npcDoChitchat(npcId)
//  无功利闲话，按 NPC 职业 × 好感阶段随机出一条，点了不消耗选项
// ════════════════════════════════════════════════════
function npcDoChitchat(npcId){
  const npc = NPC_DB[npcId];
  if(!npc) return;
  const rel   = getNpcRel(npcId);
  const stage = _getNpcDialogStage(rel);
  const role  = (npc.role || '').toLowerCase();

  // ── 按职业匹配闲话库 ──
  const DB = {
    inn:[ // 掌柜 / 小二
      { stage:['hostile','guarded'], lines:['你要住店？钱先付清。','别堵着门，要住还是不住？','本店规矩——钱货两清。'] },
      { stage:['neutral'],           lines:['今儿风大，刚扫完院子又脏了，唉。','客人来来去去的，有时候连名字都记不住。','最近生意还行，就是柴火涨价了，头疼。'] },
      { stage:['friendly','close'],  lines:['你住的那间，上次有个武林高手也住过，后来传说成名了，你说说，能不能沾点喜气？','我这儿见过的人多了，形形色色——你这身气质，不像一般的江湖人。','说真的，来这儿的客人里，你算好说话的，有些人哎，开口就横。'] },
    ],
    smith:[ // 铁匠
      { stage:['hostile','guarded'], lines:['打铁不打空，要什么说清楚再来。','我这里不闲聊，要打器还是要修？'] },
      { stage:['neutral'],           lines:['这把铁火候差一点，再烧一会儿。','手上的茧是练出来的，没有捷径。','好钢要慢工，急不来。'] },
      { stage:['friendly','close'],  lines:['告诉你个秘密，好铁匠看的不是力气，是火候的感觉，那是只有心里才能感觉到的。','我年轻时走江湖，后来发现打铁比舞刀更踏实，你说怪不怪？','这把刀我打了三天，有时候人做一件事，花的时间比你想的长，但那是值得的。'] },
    ],
    doctor:[ // 医者
      { stage:['hostile','guarded'], lines:['我这里是医馆，不是聊天的地方。','有病治病，没病少打扰，本草还没炮制完。'] },
      { stage:['neutral'],           lines:['药材最近涨价，成本越来越高，也不好意思提价，唉。','草药七分在采，三分在炮制，缺一不可。','今日入了一批好药，品相不错。'] },
      { stage:['friendly','close'],  lines:['学医的人要有一颗静心，见血不惊，见死不乱，这一点比背药典更难。','我见过太多横死的江湖人，说实话，有时候很感慨。保重，是真心话。','人死不了，靠的不只是药，还有那口气——你身体底子不错，好好保养。'] },
    ],
    merchant:[ // 商人
      { stage:['hostile','guarded'], lines:['不买就别堵着摊位。','看货还是聊价？不买别耽误事。'] },
      { stage:['neutral'],           lines:['今儿是集市日，人倒是挺多，就是买的少，看热闹的多。','路上遇到几个劫匪，货没事，人受了点惊，唉。','做生意嘛，靠的是诚信，诚信没了，啥都没了。'] },
      { stage:['friendly','close'],  lines:['我走南闯北这么多年，见过形形色色的人，你这个人，眼里有东西，不是池中物。','说个悄悄话——那个官府的采购，我报了低价，亏本的，但关系要紧。','江湖险，生意也险，其实哪条路都不容易，你说呢？'] },
    ],
    escort:[ // 镖师
      { stage:['hostile','guarded'], lines:['走镖的人话不多，有事直说。','我们镖行规矩多，闲话少说。'] },
      { stage:['neutral'],           lines:['这趟镖走了半个月，人还没回神。','受了点伤，不碍事，习惯了。','路上遇到个高手，多亏绕道，不然麻烦大了。'] },
      { stage:['friendly','close'],  lines:['老一辈说，走镖靠的是义气，我信这个。','这一行，见过生死的人才知道什么叫值。你懂吗？','跑这条路快十年了，每次出发前我都要想一遍，这次能不能回来。你说这算什么？这算人活着。'] },
    ],
    beggar:[ // 乞丐
      { stage:['hostile','guarded'], lines:['你看什么看，没见过穷人？','要给就给，不给走开。'] },
      { stage:['neutral'],           lines:['我到这城里三年了，啥事都见过，你信不信？','今儿那边施粥，去晚了，没抢到。','下雨了又得找地方躲，麻烦。'] },
      { stage:['friendly','close'],  lines:['说起来你别笑，我以前也有钱的，后来……算了，不说这个。','穷有穷的自在，我睡过御花园边上的墙根，也睡过山沟里的柴堆。都睡过来了。','你这个人不嫌我，这我记着，江湖上这种人不多。'] },
    ],
    monk:[ // 僧道
      { stage:['hostile','guarded'], lines:['施主，贫僧在打坐，请勿打扰。','无量天尊，贫道有事在身。'] },
      { stage:['neutral'],           lines:['一花一世界，施主可有所悟？','贫道以为，人之苦，十之八九皆由执念而起。','这几日禅心不静，外面吵闹，难以入定。'] },
      { stage:['friendly','close'],  lines:['施主缘分不浅，贫僧有缘才说这一句：心不贪，路自宽。','你和旁人不同，贫道瞧得出来，杀气虽有，但未起恶念，善哉。','道可道，非常道——贫道年轻时也不信这个，走到今日，才觉字字是真。'] },
    ],
    musician:[ // 乐师
      { stage:['hostile','guarded'], lines:['不听曲子别打扰，曲子钱不便宜。','正调弦，别说话。'] },
      { stage:['neutral'],           lines:['这支曲子我练了两年，还是觉得差点意思。','今天台下听曲的人少，可能是天气不好。','你有没有觉得，有些旋律会让人想起很久以前的事？'] },
      { stage:['friendly','close'],  lines:['我用曲子记事，每到一个地方，都会写一段新的——你来了，我也该记几个音符。','说给你听一个秘密：每次我弹这支曲子，眼眶就会发酸，你可别笑话我。','有些人听了一辈子曲子，一首都不懂。有些人只听一遍，就全懂了。你是哪种？'] },
    ],
    swordsman:[ // 武者 / 侠客
      { stage:['hostile','guarded'], lines:['这里不是说话的地方。','少废话，有本事说刀上见。'] },
      { stage:['neutral'],           lines:['最近武林里不太平，好多人在打探消息。','练了几年剑，越来越觉得厉害的都是些看起来最平常的人。','江湖水深，不知深浅最好少游。'] },
      { stage:['friendly','close'],  lines:['打了这么多年架，你知道什么叫真正的高手吗——是打败你之后，还肯帮你包扎伤口的人。','有一件事我一直记着：第一次生死搏斗，我输了，但活下来了。那之后，我才明白自己为什么练武。','说实话，遇到你之前，我已经很久没觉得谈话有意思了。'] },
    ],
  };

  // 匹配职业关键词
  const ROLE_KEYS = [
    ['inn',       ['掌柜','小二','老板','客栈']],
    ['smith',     ['铁匠','锻造','铸','刀匠','武器']],
    ['doctor',    ['医','郎中','大夫','杏林','药','圣手']],
    ['merchant',  ['商','掌柜','货','贩','布','粮','行商']],
    ['escort',    ['镖','护卫','护镖']],
    ['beggar',    ['乞','丐帮','叫花','乞丐']],
    ['monk',      ['僧','道','和尚','道士','住持','法师','禅','玄']],
    ['musician',  ['乐','琴','笛','歌姬','弹唱','伎']],
    ['swordsman', ['侠','剑','刀客','豪杰','武','镖师','江湖人','好汉']],
  ];

  let matchedKey = null;
  for(const [k, keywords] of ROLE_KEYS){
    if(keywords.some(kw => role.includes(kw) || npc.role?.includes(kw))){
      matchedKey = k; break;
    }
  }

  const pool = DB[matchedKey] || DB['swordsman'];
  // 找到当前阶段的文案组，取 stage 数组含当前阶段的那组
  const validGroups = pool.filter(g => g.stage.includes(stage));
  const group = validGroups.length
    ? validGroups[Math.floor(Math.random() * validGroups.length)]
    : pool[pool.length - 1]; // fallback 到最后一组

  const lines = group?.lines || ['……'];
  const line = lines[Math.floor(Math.random() * lines.length)];

  // 更新气泡
  const bubble = document.querySelector('.npc-speech-bubble .npc-speech-text');
  if(bubble) bubble.textContent = line;
}

window.npcDoChitchat = npcDoChitchat;


// ════════════════════════════════════════════════════
//  任务接受 / 领取 / 旅行推进
// ════════════════════════════════════════════════════

// ── 统计当前进行中的任务数（跨所有任务库） ──
function countActiveQuests(){
  return Object.values(npcState.quests).filter(s => s === 'active').length;
}

const MAX_ACTIVE_QUESTS = 5; // 同时最多接取的任务数

function npcAcceptQuest(questId){
  const q = getAnyQuest(questId);
  if(!q){ showToast('任务数据丢失！'); return; }

  const currentCityId = (typeof _curCityId !== 'undefined') ? _curCityId : null;
  if(!_canQuestSpawnInCity(q, currentCityId)){
    showToast('当前城市附近暂无该任务所需物资，换个地方再问问。');
    return;
  }

  // ── 等级限制检查 ──
  const playerLevel = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;

  if(q.minLevel && playerLevel < q.minLevel){
    showToast(`⚠️ 等级不足：需要 Lv${q.minLevel}（当前 Lv${playerLevel}）`);
    return;
  }
  if(q.maxLevel && playerLevel > q.maxLevel){
    showToast(`⚠️ 等级过高：仅限 Lv${q.maxLevel} 以下（当前 Lv${playerLevel}）`);
    return;
  }

  // ── 任务数上限检查 ──
  if(getQuestStatus(questId) !== 'active'){
    const activeCount = countActiveQuests();
    if(activeCount >= MAX_ACTIVE_QUESTS){
      showToast(`⚠️ 你已同时接取 ${MAX_ACTIVE_QUESTS} 个任务，无法再接！请先完成或放弃已有任务。`);
      return;
    }
  }

  // 重复任务：重置状态为 active
  if(q.repeatable){
    setQuestStatus(questId, 'active');
  } else {
    // 一次性任务：检查前置
    if(q.prevQuest && getQuestStatus(q.prevQuest) !== 'claimed'){
      showToast('需先完成前置任务！');
      return;
    }
    setQuestStatus(questId, 'active');
  }

  // ── deliver 任务：查固定目标表，动态写入目标城市和目标NPC ──
  if(q.type === 'deliver' && currentCityId){
    // 优先查 DELIVER_NPC_MAP（发起城市NPC→目标NPC的固定表）
    let deliverTarget = null;
    if(typeof DELIVER_NPC_MAP !== 'undefined'){
      // 找当前城市发布该任务的 inn/smith NPC
      const cityNpcs = Object.values(typeof NPC_DB !== 'undefined' ? NPC_DB : {})
        .filter(n => n.city === currentCityId && (n.category === 'inn' || n.category === 'blacksmith'));
      for(const n of cityNpcs){
        if(DELIVER_NPC_MAP[n.id]){
          deliverTarget = { npcId: n.id, npcName: n.name, ...DELIVER_NPC_MAP[n.id] };
          break;
        }
      }
    }
    // 兜底：邻近城市随机
    if(!deliverTarget && typeof WORLD_NODES !== 'undefined'){
      const curNode = WORLD_NODES[currentCityId];
      if(curNode && curNode.roads){
        const neighbors = Object.values(curNode.roads).filter(id => id && WORLD_NODES[id]);
        if(neighbors.length > 0){
          const pickedCity = neighbors[Math.floor(Math.random() * neighbors.length)];
          deliverTarget = { targetCityId: pickedCity, targetNpcId: null,
            targetNpcName: WORLD_NODES[pickedCity]?.name + '收件人' };
        }
      }
    }
    if(deliverTarget){
      if(!npcState.questOverrides) npcState.questOverrides = {};
      // 构建任务描述（含具体人名和目标城市）
      const toName = deliverTarget.targetNpcName || '收件人';
      const toCity = deliverTarget.targetCityName || '';
      const letter = deliverTarget.letterDesc || deliverTarget.deliveryDesc || '急件';
      const fromName = deliverTarget.npcName || '掌柜';
      const dynamicDesc = `${fromName}把一封信塞到你手里："这是${letter}，帮我送去${toCity}交给${toName}，事成之后有赏。"`;
      npcState.questOverrides[questId] = {
        targetCityId:  deliverTarget.targetCityId || currentCityId,
        targetNpcId:   deliverTarget.targetNpcId   || null,
        targetName:    toCity ? `${toCity}·${toName}` : toName,
        _dynamicDesc:  dynamicDesc,
      };
      npcStateSave();
    }
  }

  // 连环任务提示
  if(q.chain){
    showToast(`📋 接受连环任务【${q.chainStep}】：${q.name}`);
  } else {
    showToast(`接受任务：${q.name}`);
  }

  closeNpcDialog();
  if (typeof playAudio === 'function') playAudio('quest_accept');
  setTimeout(()=> openNpcDialog(_curNpcId, _curCityId), 50);
}

function npcClaimQuest(questId){
  const q = getAnyQuest(questId);
  if(!q) return;

  // ── 检查 fetch/collect 类型任务的物品提交 ──
  if((q.type === 'fetch' || q.type === 'collect') && q.targetItem){
    const needQty = q.targetCount || 1;
    const haveQty = _getQuestBagMatchedQty(q.targetItem);
    if(haveQty < needQty){
      const itemName = q.targetName || '所需物品';
      showToast(`⚠️ 物品不足：需要 ${itemName} ×${needQty}，当前拥有 ×${haveQty}`);
      return;
    }
    if(!_consumeQuestBagMatchedItems(q.targetItem, needQty)){
      showToast('⚠️ 提交物品失败，请稍后再试');
      return;
    }
    showToast(`📦 提交 ${q.targetName || '物品'} ×${needQty}`);
  }


  const curDay = _getTodayIndex();

  // 重复任务：记录完成天数，恢复为 available（供下次冷却判断）
  if(q.repeatable){
    if(!npcState.questLastDone) npcState.questLastDone = {};
    npcState.questLastDone[questId] = typeof curDay === 'number' ? curDay : 0;
    setQuestStatus(questId, 'claimed'); // claimed+lastDone 共同决定是否冷却
  } else {
    setQuestStatus(questId, 'claimed');
  }

  // 清理运行时覆盖（deliver任务接取时动态分配的 targetCityId 等）
  if(npcState.questOverrides && npcState.questOverrides[questId]){
    delete npcState.questOverrides[questId];
  }

  // 标记完成过该NPC任务（解锁好感60+上限）
  if(_curNpcId){ markQuestDoneFor(_curNpcId); }

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"任务奖励系统：浮动奖励 + 意外之财
  // ═══════════════════════════════════════════════════════════════
  const rew = q.reward || {};
  
  // 计算奖励浮动（±30%）
  const REWARD_VARIANCE = 0.30; // 30%波动
  const luckRoll = Math.random();
  let rewardMult = 0.7 + luckRoll * 0.6; // 0.7 - 1.3
  let luckMsg = '';
  let windfall = false;
  
  // 意外之财：3%概率双倍奖励
  if(luckRoll > 0.97){
    rewardMult = 2.0;
    windfall = true;
    luckMsg = '🍀 意外之财！委托人格外慷慨，奖励翻倍！';
  }
  // 倒霉：5%概率奖励减半
  else if(luckRoll < 0.05){
    rewardMult = 0.5;
    luckMsg = '💸 委托人手头紧，奖励打了折扣…';
  }
  
  // 发放银两（带浮动）
  if(rew.silver){
    const actualSilver = windfall ? rew.silver * 2 : Math.round(rew.silver * rewardMult);
    SilverManager.add(actualSilver);
    SilverManager.save();
    if(luckMsg) showToast(luckMsg);
    if(windfall || rewardMult !== 1.0){
      showToast(`💰 获得 ${actualSilver} 两银子${windfall ? '（双倍！）' : ''}`);
    }
  }
  
  // 发放经验（带浮动）
  if(rew.exp && typeof giveExp === 'function'){
    const actualExp = windfall ? rew.exp * 2 : Math.round(rew.exp * rewardMult);
    giveExp(actualExp);
    if(windfall || rewardMult !== 1.0){
      showToast(`✨ 获得 ${actualExp} 经验${windfall ? '（双倍！）' : ''}`);
    }
  }

  // 好感奖励：优先用 rew.rel，否则按任务难度给默认值
  const minRelTier = q.minRel || 0;
  let relGain;
  if(rew.rel !== undefined){
    relGain = rew.rel;
  } else {
    // 根据 minRel 门槛推算默认好感奖励
    if(minRelTier >= 60)      relGain = 12;  // 精英/机密任务
    else if(minRelTier >= 40) relGain = 10;  // 进阶任务
    else if(minRelTier >= 20) relGain = 8;   // 普通委托
    else if(minRelTier >= 10) relGain = 6;   // 入门委托
    else                      relGain = 5;   // 日常任务
  }
  if(relGain && _curNpcId){ _changeNpcRelDirect(_curNpcId, relGain); }
  if(rew.fame && typeof jianghuState !== 'undefined'){
    jianghuState.reputation = jianghuState.reputation || {};
    jianghuState.reputation.fame = (jianghuState.reputation.fame||0) + rew.fame;
    const cityId = (typeof _curCityId !== 'undefined') ? _curCityId :
                   (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : null;
    if(cityId){
      const cityFame = Math.floor(rew.fame * 0.3);
      if(typeof jhAddCityRep === 'function'){
        jhAddCityRep(cityId, cityFame);
      } else {
        if(!jianghuState.cityRep) jianghuState.cityRep = {};
        if(!jianghuState.cityRep[cityId]) jianghuState.cityRep[cityId] = { rep:0, align:0 };
        jianghuState.cityRep[cityId].rep = Math.min(100, Math.max(0, (jianghuState.cityRep[cityId].rep||0) + cityFame));
      }
    }
    jianghuSave();
    if(typeof townRefreshCityRepBar === 'function') townRefreshCityRepBar();
  }
  // 门派贡献奖励
  if(rew.contrib && typeof edS !== 'undefined'){
    edS.sectContrib = (edS.sectContrib || 0) + rew.contrib;
    if(typeof saveGameState === 'function') saveGameState();
    showToast(`⚔️ 门派贡献 +${rew.contrib}（当前：${edS.sectContrib}）`);
  }

  // 武学秘籍奖励
  if(rew.manual){
    if(typeof addManualToBag === 'function'){
      addManualToBag(rew.manual);
      const mdb = (typeof MANUAL_DB !== 'undefined') ? MANUAL_DB[rew.manual] : null;
      const mrar = (typeof MANUAL_RARITY !== 'undefined' && mdb) ? MANUAL_RARITY[mdb.rarity] : null;
      if(mdb) showToast(`📜 获得武学秘籍：${mrar?mrar.icon:''}【${mdb.name}】！`);
    }
  }
  // 物品奖励
  if(rew.item){
    let inv; try{ inv=JSON.parse(localStorage.getItem('wuxia_inv')||'[]'); }catch(e){ inv=[]; }
    inv.push({id:rew.item, name:rew.item});
    localStorage.setItem('wuxia_inv', JSON.stringify(inv));
  }
  // 情报奖励
  if(rew.intel){ markIntelRead(rew.intel); }

  travelSave();

  // ── 连环任务：解锁下一步 ──
  if(q.nextQuest && !q.repeatable){
    const nxtQ = getAnyQuest(q.nextQuest);
    if(nxtQ){
      // nextQuest 初始为 'available'（getQuestStatus默认值），无需额外操作
      // 但需要确保其prevQuest=此任务，界面刷新后自动显示
      showToast(`✅ 连环任务完成：${q.name}！解锁下一章：${nxtQ.name}`);
    } else {
      showToast(`✅ 任务完成：${q.name}！获得 ${q.rewardText}`);
    }
  } else if(q.chain && !q.nextQuest){
    showToast(`🎉 连环任务【${q.chain}】全部完成！获得 ${q.rewardText}`);
  } else {
    showToast(`✅ 任务完成：${q.name}！获得 ${q.rewardText}`);
  }

  if (typeof playAudio === 'function') playAudio('quest_complete');

  // ── NPC 回访：30%概率触发（延迟2s，避免与对话框冲突）──
  if(typeof npcReqOnQuestComplete === 'function' && _curNpcId && _curCityId){
    setTimeout(() => npcReqOnQuestComplete(questId, _curNpcId, _curCityId), 2000);
  }

  closeNpcDialog();
  setTimeout(()=> openNpcDialog(_curNpcId, _curCityId), 50);
}

// ── 放弃任务（降低好感、重置状态为 available） ──
function npcAbandonQuest(questId){
  const q = getAnyQuest(questId);
  if(!q) return;

  // 已完成/已领奖的任务不能放弃
  const status = getQuestStatus(questId);
  if(status === 'done'){
    showToast('任务已完成，请直接领取奖励！');
    return;
  }
  if(status !== 'active'){
    showToast('该任务当前不在进行中。');
    return;
  }

  // 弹出确认对话框
  const confirmMsg = q.chain
    ? `确定放弃连环任务【${q.name}】？\n连环进度将中断，且会降低与委托人的好感度！`
    : `确定放弃任务【${q.name}】？\n放弃后好感度将下降！`;

  if(!confirm(confirmMsg)) return;

  // ── 好感惩罚：按任务难度扣好感 ──
  const minRelTier = q.minRel || 0;
  let relPenalty;
  if(minRelTier >= 60)      relPenalty = -15;  // 精英/机密任务，背叛代价大
  else if(minRelTier >= 40) relPenalty = -12;
  else if(minRelTier >= 20) relPenalty = -10;
  else if(minRelTier >= 10) relPenalty = -8;
  else                      relPenalty = -6;   // 日常小任务

  if(_curNpcId){ _changeNpcRelDirect(_curNpcId, relPenalty); }

  // 重置任务状态（一次性任务恢复 available，重复任务同）
  setQuestStatus(questId, 'available');

  // 清理运行时覆盖（deliver 任务的动态分配目标城市）
  if(npcState.questOverrides && npcState.questOverrides[questId]){
    delete npcState.questOverrides[questId];
  }

  // 连环任务同时重置整条链的进度到当前步
  // （prevQuest 已 claimed 不影响，只重置当前步）

  const penaltyTxt = relPenalty < 0 ? `好感度 ${relPenalty}` : '';
  showToast(`😤 放弃任务：${q.name}${penaltyTxt ? '，' + penaltyTxt : ''}`);
  if (typeof playAudio === 'function') playAudio('quest_fail');

  closeNpcDialog();
  setTimeout(()=> openNpcDialog(_curNpcId, _curCityId), 50);
}

// ── 立即完成送达类任务（当前城市就是目标城市时）──
function npcCompleteDeliverQuest(questId){
  const q = getAnyQuest(questId);
  if(!q) return;
  if(q.type !== 'deliver') return;
  
  // 检查当前城市是否就是目标城市
  const currentCityId = typeof _curCityId !== 'undefined' ? _curCityId : null;
  if(!q.targetCityId || currentCityId !== q.targetCityId){
    showToast('❌ 当前不在目标城市');
    return;
  }
  
  // ── 送达后直接结算（无需回去找掌柜领奖）──
  const targetName = q.targetNpcId && NPC_DB[q.targetNpcId] 
    ? NPC_DB[q.targetNpcId].name 
    : (q.targetName || '收件人');
  
  // 清理运行时覆盖
  if(npcState.questOverrides && npcState.questOverrides[questId]){
    delete npcState.questOverrides[questId];
  }
  
  // 标记完成过该NPC任务（解锁好感上限）
  if(_curNpcId){ markQuestDoneFor(_curNpcId); }
  
  // 发放奖励（与 npcClaimQuest 相同的逻辑，含浮动 + 意外之财）
  const rew = q.reward || {};
  const luckRoll = Math.random();
  let rewardMult = 0.7 + luckRoll * 0.6;
  let windfall = false;
  if(luckRoll > 0.97){ rewardMult = 2.0; windfall = true; }
  else if(luckRoll < 0.05){ rewardMult = 0.5; }
  
  if(rew.silver){
    const actualSilver = windfall ? rew.silver * 2 : Math.round(rew.silver * rewardMult);
    SilverManager.add(actualSilver);
    SilverManager.save();
  }
  if(rew.exp && typeof giveExp === 'function'){
    const actualExp = windfall ? rew.exp * 2 : Math.round(rew.exp * rewardMult);
    giveExp(actualExp);
  }
  if(rew.rel && _curNpcId){
    const relGain = windfall ? rew.rel * 2 : rew.rel;
    _changeNpcRelDirect(_curNpcId, relGain);
  }
  if(rew.fame && typeof jianghuState !== 'undefined'){
    const cityFame = Math.floor((rew.fame * rewardMult) * 0.3);
    if(!jianghuState.cityRep) jianghuState.cityRep = {};
    if(currentCityId){
      if(!jianghuState.cityRep[currentCityId]) jianghuState.cityRep[currentCityId] = { rep:0, align:0 };
      jianghuState.cityRep[currentCityId].rep = Math.min(100, Math.max(0, (jianghuState.cityRep[currentCityId].rep||0) + cityFame));
    }
    jianghuSave();
  }
  if(rew.contrib && typeof edS !== 'undefined'){
    edS.sectContrib = (edS.sectContrib || 0) + rew.contrib;
    if(typeof saveGameState === 'function') saveGameState();
  }
  
  // 标记为已完成（claimed）—— 不经过 'done' 待领取状态
  setQuestStatus(questId, 'claimed');
  if(q.repeatable){
    const curDay = _getTodayIndex();
    if(!npcState.questLastDone) npcState.questLastDone = {};
    npcState.questLastDone[questId] = typeof curDay === 'number' ? curDay : 0;
  }
  
  // 刷新对话框
  closeNpcDialog();
  setTimeout(()=> openNpcDialog(_curNpcId, _curCityId), 50);
}

// ── 旅行完成后自动推进任务进度 ──
function npcOnTravelComplete(destId){
  npcStateLoad();
  // 遍历 QUEST_DB（含连环链任务）
  const allQdb = typeof QUEST_DB !== 'undefined' ? Object.values(QUEST_DB) : [];
  let anyDone = false;
  allQdb.forEach(q=>{
    if(getQuestStatus(q.id) !== 'active') return;

    // travel 类任务：到达新城市即自动完成并直接发奖，无需回头找NPC
    if(q.type === 'travel'){
      // 找发任务的NPC（用于好感奖励）
      let issuerNpcId = null;
      if(typeof NPC_DB !== 'undefined'){
        for(const nid in NPC_DB){
          if(NPC_DB[nid] && NPC_DB[nid].quests && NPC_DB[nid].quests.includes(q.id)){
            issuerNpcId = nid; break;
          }
        }
      }

      // 标记完成
      const curDay = _getTodayIndex();
      if(q.repeatable){
        if(!npcState.questLastDone) npcState.questLastDone = {};
        npcState.questLastDone[q.id] = typeof curDay === 'number' ? curDay : 0;
      }
      setQuestStatus(q.id, 'claimed');
      if(issuerNpcId) markQuestDoneFor(issuerNpcId);

      // 发放奖励
      const rew = q.reward || {};
      if(rew.silver){ SilverManager.add(rew.silver); SilverManager.save(); }
      if(rew.exp && typeof giveExp === 'function') giveExp(rew.exp);
      if(rew.rel !== undefined && issuerNpcId){
        _changeNpcRelDirect(issuerNpcId, rew.rel);
      } else if(issuerNpcId){
        // 默认好感
        const defaultRel = q.minRel >= 40 ? 10 : q.minRel >= 20 ? 8 : q.minRel >= 10 ? 6 : 5;
        _changeNpcRelDirect(issuerNpcId, defaultRel);
      }
      if(rew.fame && typeof jianghuState !== 'undefined'){
        jianghuState.reputation = jianghuState.reputation || {};
        jianghuState.reputation.fame = (jianghuState.reputation.fame||0) + rew.fame;
      }
      if(rew.contrib && typeof edS !== 'undefined'){
        edS.sectContrib = (edS.sectContrib || 0) + rew.contrib;
        if(typeof editorSave === 'function') editorSave();
        else if(typeof saveGameState === 'function') saveGameState();
      }
      if(rew.item){
        let inv; try{ inv=JSON.parse(localStorage.getItem('wuxia_inv')||'[]'); }catch(e){ inv=[]; }
        inv.push({id:rew.item, name:rew.item});
        localStorage.setItem('wuxia_inv', JSON.stringify(inv));
      }
      if(rew.intel) markIntelRead(rew.intel);

      // 连环任务提示
      if(q.nextQuest && !q.repeatable){
        const nxtQ = getAnyQuest(q.nextQuest);
        showToast(`✅ 任务完成：${q.name}！${nxtQ ? '解锁下一章：'+nxtQ.name : '获得 '+q.rewardText}`);
      } else if(q.chain && !q.nextQuest){
        showToast(`🎉 连环任务【${q.chain}】完成！获得 ${q.rewardText}`);
      } else {
        showToast(`✅ 任务完成：${q.name}！获得 ${q.rewardText}`);
      }
      anyDone = true;

      // 心情系统：完成该NPC任务后，可能触发感激心情
      if(typeof maybeAddGratefulMood === 'function' && issuerNpcId) {
        maybeAddGratefulMood(issuerNpcId);
      }
    }
    
    // deliver 送达类任务：到达目标城市才完成
    else if(q.type === 'deliver'){
      // 检查是否到达目标城市
      if(q.targetCityId && destId === q.targetCityId){
        setQuestStatus(q.id, 'done');
        const targetName = q.targetNpcId && NPC_DB[q.targetNpcId] 
          ? NPC_DB[q.targetNpcId].name 
          : (q.targetName || '收件人');
        // 查找委托人（哪个NPC有这个任务）
        let issuerName = '委托人';
        if(typeof NPC_DB !== 'undefined'){
          for(const npcId in NPC_DB){
            const npc = NPC_DB[npcId];
            if(npc && npc.quests && npc.quests.includes(q.id)){
              issuerName = npc.name || '委托人';
              break;
            }
          }
        }
        showToast(`📋 急件已送达${targetName}处！回去找【${issuerName}】领取奖励`);
        anyDone = true;
      }
    }
    
    // fetch 收集类任务：旅行不自动完成，需要提交物品
    // 暂不支持自动完成，需手动找NPC提交
  });
  // 动态 kill 任务不靠旅行推进（只有真实击杀才算）

  // 保存状态
  if(anyDone){
    npcStateSave();
    if(typeof travelSave === 'function') travelSave();
  }
}

// ── 商店购买（实际执行）──
function npcBuyItemDo(itemId, npcId, price){
  try {
    npcStateLoad();

    // ── 找到商品定义（先于扣款，用于校验）──
    let item = null;
    const npc = NPC_DB[npcId];
    if(npc && npc.shop) item = npc.shop.items.find(i=>i.id===itemId);
    if(!item){ showToast(`⚠️ 商品【${itemId}】数据异常`, 'err'); return; }

    // ── 门派限制校验（功法类商品）──
    if(item.effect && item.effect.manual && typeof MANUAL_DB !== 'undefined'){
      const m = MANUAL_DB[item.effect.manual];
      if(m && m.reqSect){
        const playerSect = (typeof edS !== 'undefined') ? (edS.sect || null) : null;
        if(playerSect !== m.reqSect){
          const sectName = (typeof SECTS !== 'undefined' && SECTS[m.reqSect]) ? SECTS[m.reqSect].name : m.reqSect;
          showToast(`🔒 此秘籍需要加入「${sectName}」方可购买！`, 'warn');
          return; // 不扣款，直接返回
        }
      }
    }

    // ── 检查银两 ──
    const mySilver = (typeof getSilver === 'function') ? getSilver() : (travelPlayerState.silver || 0);
    if(mySilver < price){
      showToast(`💰 银两不足！需要 ${price} 两，你身上只有 ${mySilver} 两`, 'err');
      return;
    }

    // ── 扣款（统一用 SilverManager）──
    if(!SilverManager.spend(price)){
      showToast(`💰 扣款失败（银两不足）`, 'err');
      return;
    }
    SilverManager.save();
    if(typeof travelSave === 'function') travelSave();
    if(typeof townRefreshBar === 'function') townRefreshBar();
    else if(typeof travelRefreshBar === 'function') travelRefreshBar();



    // ── 消耗品（hp/mp/energy/food/detox效果）→ 存背包，不立即消费 ──
    // 永久属性提升（maxHp/maxMp/charm/respec/bagExpand/weapon/costume/manual等）仍走直接使用
    if(item.effect){
      const ef = item.effect;
      const isConsumable = (ef.hp || ef.mp || ef.food || ef.energy || ef.detox) &&
        !ef.maxHp && !ef.maxMp && !ef.charm && !ef.respec && !ef.bagExpand &&
        !ef.weapon && !ef.costume && !ef.manual && !ef.collectible &&
        !ef.teleport && !ef.materialPack && !ef.atkBuff && !ef.defBuff && !ef.speedBuff;
      if(isConsumable){
        if(typeof consumableBagAdd === 'function'){
          consumableBagAdd({ id:item.id, name:item.name, icon:item.icon, desc:item.desc || '',
            effect: item.effect }, 1);
          showToast(`${item.icon} 购得【${item.name}】，已放入背包 ✅`);
        } else {
          showToast(`${item.icon} 购得【${item.name}】✅`);
        }
        if(typeof window.refreshTownBag === 'function') window.refreshTownBag();
        if(typeof travelSave === 'function') travelSave();
        return;
      }
    }

    // ── 物品入背包（空效果/无效果走这里）──
    if(!item.effect || (
      !item.effect.hp && !item.effect.mp && !item.effect.food &&
      !item.effect.energy && !item.effect.silver &&
      !item.effect.atkBuff && !item.effect.defBuff && !item.effect.speedBuff &&
      !item.effect.manual && !item.effect.collectible &&
      !item.effect.weapon && !item.effect.costume &&
      !item.effect.bagExpand && !item.effect.respec &&
      !item.effect.maxHp && !item.effect.maxMp && !item.effect.charm &&
      !item.effect.teleport && !item.effect.materialPack
    )){
      const CAGE_ITEM_IDS = ['item_cricket_cage_basic','item_cricket_cage_fine','item_cricket_cage_premium'];
      if(CAGE_ITEM_IDS.includes(item.id)){
        const accId = {
          'item_cricket_cage_basic':   'acc_cricket_basic',
          'item_cricket_cage_fine':    'acc_cricket_fine',
          'item_cricket_cage_premium': 'acc_cricket_premium',
        }[item.id];
        if(typeof createEquipInst === 'function' && typeof edS !== 'undefined'){
          const inst = createEquipInst('accessory', accId);
          if(inst){
            if(!edS.bag) edS.bag = [];
            edS.bag.push(inst);
            bagSave();
            if(typeof window.refreshTownBag === 'function') window.refreshTownBag();
            showToast(`${item.icon} 购得【${item.name}】，已放入背包装备栏 ✅`);
          } else {
            showToast(`${item.icon} 购得【${item.name}】✅`);
          }
        } else {
          showToast(`${item.icon} 购得【${item.name}】✅`);
        }
        return;
      }
      if(typeof consumableBagAdd === 'function'){
        consumableBagAdd({ id:item.id, name:item.name, icon:item.icon, desc:item.desc || '' }, 1);
        showToast(`${item.icon} 购得【${item.name}】，已收入背包 ✅`);
      } else {
        showToast(`${item.icon} 购得【${item.name}】✅`);
      }
      if(typeof window.refreshTownBag === 'function') window.refreshTownBag();
      return;
    }

      // ── 有效果的物品：直接使用 ──
      const ef = item.effect;
      if(ef.collectible){
        if(typeof injectDropToCraftBag === 'function') injectDropToCraftBag(item.id, 1, item);
        showToast(`${item.icon} 购得收藏品：【${item.name}】，已放入珍奇收藏 ✅`);
      } else if(ef.manual){
        if(typeof buyManualFromNpc === 'function') buyManualFromNpc(ef.manual);
        showToast(`${item.icon} 购得秘籍：【${item.name}】✅`);
      } else {
        if(ef.hp && typeof travelPlayerState !== 'undefined'){
          travelPlayerState.hp = Math.min(100, (travelPlayerState.hp||100) + ef.hp);
          showToast(`${item.icon} 使用${item.name}，气血+${ef.hp} ✅`);
        }
        if(ef.mp){
          if(typeof edS !== 'undefined') edS.mp = Math.min(edS.maxMp||100, (edS.mp||0) + ef.mp);
          showToast(`${item.icon} 使用${item.name}，内力+${ef.mp} ✅`);
        }
        if(ef.food){
          if(typeof travelPlayerState !== 'undefined'){
            travelPlayerState.food = Math.min(100, (travelPlayerState.food ?? 50) + ef.food);
            if(typeof travelSave === 'function') travelSave();
          }
          showToast(`${item.icon} 吃下${item.name}，饱食度+${ef.food} ✅`);
        }
        if(ef.water){
          if(typeof travelPlayerState !== 'undefined'){
            travelPlayerState.water = Math.min(100, (travelPlayerState.water ?? 50) + ef.water);
            if(typeof travelSave === 'function') travelSave();
          }
          showToast(`${item.icon} 饮下${item.name}，口渴度+${ef.water} ✅`);
        }
        if(ef.energy && typeof travelPlayerState !== 'undefined'){
          travelPlayerState.energy = Math.min(100, (travelPlayerState.energy||80) + ef.energy);
          showToast(`${item.icon} 饮下${item.name}，精力+${ef.energy} ✅`);
        }
        if(ef.silver){
          SilverManager.add(ef.silver);
          SilverManager.save();
          showToast(`${item.icon} 兑换成功，获得${ef.silver}两银子 ✅`);
        }
        if(ef.atkBuff) showToast(`${item.icon} 使用${item.name}，攻击临时+${ef.atkBuff} ✅`);
        if(ef.defBuff) showToast(`${item.icon} 使用${item.name}，防御临时+${ef.defBuff} ✅`);
        if(ef.speedBuff) showToast(`${item.icon} 使用${item.name}，速度临时+${ef.speedBuff} ✅`);

        // ── 永久属性提升类效果（一次性使用）──
        if(ef.maxHp){
          if(typeof edS !== 'undefined' && typeof editorSave === 'function'){
            edS.maxHp = (edS.maxHp || 150) + ef.maxHp;
            edS.hp = (edS.hp || edS.maxHp) + ef.maxHp; // 同时回满等量血
            editorSave();
          }
          showToast(`${item.icon} 服用${item.name}，气血上限永久+${ef.maxHp} ✨`);
        }
        if(ef.maxMp){
          if(typeof edS !== 'undefined' && typeof editorSave === 'function'){
            edS.maxMp = (edS.maxMp || 100) + ef.maxMp;
            editorSave();
          }
          showToast(`${item.icon} 服用${item.name}，内力上限永久+${ef.maxMp} ✨`);
        }
        if(ef.charm && typeof travelPlayerState !== 'undefined'){
          // 魅力加成（记录到 travelPlayerState）
          travelPlayerState.charm = (travelPlayerState.charm || 0) + ef.charm;
          showToast(`${item.icon} 使用${item.name}，魅力+${ef.charm} ✨`);
        }

        // ── 装备购买：生成装备实例入背包（未鉴定，需鉴定获得随机词条）──
        if(ef.weapon){
          if(typeof createEquipInst === 'function' && typeof edS !== 'undefined' && typeof bagAddInst === 'function'){
            const inst = createEquipInst('weapon', ef.weapon);
            if(inst){ bagAddInst(inst); showToast(`${item.icon} 购得【${item.name}】，已放入背包装备栏 ⚔️（未鉴定）`); }
            else { showToast(`⚠️ ${item.name} 生成失败`); }
          } else { showToast(`${item.icon} 购得【${item.name}】✅`); }
        }
        if(ef.costume){
          if(typeof createEquipInst === 'function' && typeof edS !== 'undefined' && typeof bagAddInst === 'function'){
            const inst = createEquipInst('costume', ef.costume);
            if(inst){ bagAddInst(inst); showToast(`${item.icon} 购得【${item.name}】，已放入背包装备栏 🥋（未鉴定）`); }
            else { showToast(`⚠️ ${item.name} 生成失败`); }
          } else { showToast(`${item.icon} 购得【${item.name}】✅`); }
        }

        // ── 背包扩容 ──
        if(ef.bagExpand){
          // 扩充消耗品背包容量（通过 localStorage 标记）
          const BAG_EXPAND_KEY = 'wuxia_bag_expanded';
          const expanded = parseInt(localStorage.getItem(BAG_EXPAND_KEY)||'0') + (ef.bagExpand||1);
          localStorage.setItem(BAG_EXPAND_KEY, String(expanded));
          showToast(`${item.icon} 使用${item.name}，背包容量+${ef.bagExpand} 格 🎒`);
        }

        // ── 属性洗炼丹：重分配 freePts ──
        if(ef.respec){
          if(typeof edS !== 'undefined' && typeof editorSave === 'function'){
            const refunded = edS.primaryPts || 0;
            edS.originBonusPts = (edS.originBonusPts || 0) + refunded;
            edS.primaryPts = 0;
            // 重新计算属性
            if(typeof calcPrimaryBonus === 'function') calcPrimaryBonus();
            editorSave();
            showToast(`${item.icon} 服下${item.name}，属性点已重置（返还 ${refunded} 点可重新分配）🔄`);
          } else {
            showToast(`${item.icon} 购得【${item.name}】✅`);
          }
        }

        // ── 传送符：标记可用 ──
        if(ef.teleport){
          const TP_KEY = 'wuxia_teleport Scrolls';
          const count = parseInt(localStorage.getItem(TP_KEY)||'0') + (ef.teleport===true?1:(ef.teleport||1));
          localStorage.setItem(TP_KEY, String(count));
          showToast(`${item.icon} 获得${item.name}×${ef.teleport===true?1:ef.teleport} 🏇`);
        }

        // ── 材料包：注入合成背包 ──
        if(ef.materialPack){
          if(typeof injectDropToCraftBag === 'function'){
            // materialPack 可以是字符串数组或单个材料ID
            const mats = Array.isArray(ef.materialPack) ? ef.materialPack : [ef.materialPack];
            mats.forEach(mid => {
              try{ injectDropToCraftBag(mid, 1); } catch(e){}
            });
            showToast(`${item.icon} 购得【${item.name}】，材料已收入合成背包 🧪`);
          } else {
            showToast(`${item.icon} 购得【${item.name}】✅`);
          }
        }  // materialPack

      }  // else (generic effects)

      if(typeof window.refreshTownBag === 'function') window.refreshTownBag();
      if(typeof window.parent?.townRefreshStatus === 'function') window.parent.townRefreshStatus();
      if (typeof playAudio === 'function') playAudio('shop_buy');
    } catch(e) {
    showToast(`⚠️ 购买异常：${e.message || '未知错误'}`, 'err');
    console.error('[npcBuyItemDo]', e);
  }
}

// ── 商店购买（确认弹窗）──
function npcBuyItem(itemId, npcId, price){

  // 找到商品信息用于显示
  let itemName = itemId, itemIcon = '📦';
  const npc = NPC_DB[npcId];
  if(npc && npc.shop){
    const item = npc.shop.items.find(i=>i.id===itemId);
    if(item){ itemName = item.name; itemIcon = item.icon || '📦'; }
  }
  const mySilver = (typeof getSilver === 'function') ? getSilver() : (travelPlayerState.silver || 0);
  const canAfford = mySilver >= price;

  const bodyHtml = `
  <div class="buy-confirm-card">
    <span class="bcc-icon">${itemIcon}</span>
    <div class="bcc-name">${itemName}</div>
    <div class="bcc-price-row">
      <span class="bcc-price-icon">💰</span>
      <span class="bcc-price">${price}</span>
      <span class="bcc-price-unit">两</span>
    </div>
    <div class="bcc-balance">余额：<strong>${mySilver} 两</strong></div>
    <div class="bcc-divider"></div>
    <div class="bcc-warning${canAfford ? '' : ' show'}" id="buyConfirmTip">
      ⚠️ 银两不足，无法购买！
    </div>
    <div class="bcc-actions">
      <button class="bcc-btn bcc-btn-confirm"
        id="confirmBuyBtn"
        ${canAfford ? '' : 'disabled'}
        onclick="if(typeof townModalClose==='function') townModalClose(null); if(typeof npcBuyItemDo==='function') npcBuyItemDo('${itemId}','${npcId}',${price})">
        ✅ 确认购买
      </button>
      <button class="bcc-btn bcc-btn-cancel"
        onclick="if(typeof townModalClose==='function') townModalClose(null)">
        ❌ 取消
      </button>
    </div>
  </div>
  `;

  if(typeof townModalOpen === 'function'){
    // 使用居中卡片样式
    const overlay = document.getElementById('townModalOverlay');
    if(overlay) overlay.classList.add('confirm-card');
    townModalOpen('🛒 确认购买', bodyHtml);
  } else {
    // 兜底：没有弹窗时直接执行
    if(canAfford){
      npcBuyItemDo(itemId, npcId, price);
    } else {
      showToast(`💰 银两不足！需要 ${price} 两，你身上只有 ${mySilver} 两`, 'err');
    }
  }
}

// ══════════════════════════════════════
//  商店·出售功能
// ══════════════════════════════════════

// 稀有度 → 出售单价倍率（相对于"买价参考值"）
const SELL_RATES = {
  common:    { rate:0.25, label:'凡品' },
  uncommon:  { rate:0.35, label:'精品' },
  rare:      { rate:0.45, label:'稀有' },
  epic:      { rate:0.55, label:'史诗' },
  legendary: { rate:0.70, label:'传说' },
  junk:      { rate:0.05, label:'垃圾' }
};

// 计算物品的出售价（基于稀有度和重量/价值）
function _getSellPrice(item){
  const r = SELL_RATES[item.rarity] || SELL_RATES.common;
  // 基础价格：消耗品按稀有度阶梯
  let base = 2; // 凡品底价
  if(item.rarity==='uncommon') base=5;
  if(item.rarity==='rare')     base=12;
  if(item.rarity==='epic')     base=28;
  if(item.rarity==='legendary')base=60;
  // 材料有 sellPrice 的优先用
  var meta = null;
  if(typeof getItemMeta === 'function') meta = getItemMeta(item.id);
  if(meta && meta.sellPrice) return meta.sellPrice;
  // 消耗品有 effect 的，根据效果加成
  if(item.effect){
    var bonus = (item.effect.food||0) + Math.round((item.effect.hp||0)*0.6);
    if(bonus > 3) base += Math.round(bonus * 0.4);
  }
  return Math.max(1, Math.round(base * r.rate));
}

// 构建出售面板 HTML
function _buildNpcSellPanel(npcId, rel){
  // 收集玩家可出售物品：消耗品 + 材料
  var items = [];
  // 消耗品背包
  if(typeof consumableBagLoad === 'function'){
    consumableBagLoad().forEach(function(e){ if(e && e.qty > 0) items.push({ src:'consumable', ...e }); });
  }
  // 材料背包（排除蛐蛐笼等特殊物品）
  if(typeof craftBagLoad === 'function'){
    var excludeIds = ['item_cricket_cage_basic','item_cricket_cage_fine','item_cricket_cage_premium'];
    craftBagLoad().forEach(function(e){
      if(e && e.qty > 0 && !excludeIds.includes(e.id)) items.push({ src:'craft', ...e });
    });
  }

  // 回填缺失的 name / icon（craft bag 只有 {id, qty}）
  items.forEach(function(item){
    if(!item.name){
      // 材料优先从 CRAFT_MATERIAL_NAMES 查
      if(typeof CRAFT_MATERIAL_NAMES !== 'undefined' && CRAFT_MATERIAL_NAMES[item.id]){
        item.name = CRAFT_MATERIAL_NAMES[item.id].name;
        item.icon = CRAFT_MATERIAL_NAMES[item.id].icon;
      }
      // 消耗品尝试从 FISH_DB 或 getItemMeta 查
      if(!item.name){
        if(typeof FISH_DB !== 'undefined'){
          var fd = FISH_DB.find(function(f){ return f && f.id === item.id; });
          if(fd){ item.name = fd.name; item.icon = fd.icon || '🐟'; }
        }
        if(!item.name && typeof getItemMeta === 'function'){
          var meta = getItemMeta(item.id);
          if(meta && meta.name) item.name = meta.name;
        }
      }
      // 最终兜底
      if(!item.name) item.name = item.id;
      if(!item.icon) item.icon = '📦';
    }
  });

  // 过滤掉仍无法识别的条目
  items = items.filter(function(it){ return it && it.name; });

  if(items.length === 0){
    return `<div style="text-align:center;padding:24px;color:rgba(160,150,80,.35);font-size:12px">
      📦 背包空空，无物可售<br><span style="font-size:10px">钓鱼、采集、击杀怪物可获得可出售之物</span>
    </div>`;
  }

  // 排序：高价值在前
  items.sort(function(a,b){ return _getSellPrice(b) - _getSellPrice(a); });

  var html = '<div class="npc-sell-grid">';
  items.forEach(function(item){
    var price = _getSellPrice(item);
    var rInfo = SELL_RATES[item.rarity] || SELL_RATES.common;
    var rc = { common:'#888',uncommon:'#44cc88',rare:'#60a8ff',epic:'#c080f0',legendary:'#ffd060',junk:'#666'}[item.rarity] || '#888';
    var tag = item.src === 'consumable'
      ? (typeof FISH_DB !== 'undefined' && typeof FISH_DB.find === 'function' && FISH_DB.find(function(f){return f&&f.id===item.id}) ? '🐟 鱼' : '💊 道具')
      : '🧪 材料';
    html += `
    <div class="npc-sell-item" onclick="_npcSellConfirm('${item.id}','${item.name.replace(/'/g,"\\'")}',${price},${item.qty},'${item.src}')">
      <div class="npc-sell-icon">${item.icon||'📦'}</div>
      <div class="npc-sell-info">
        <div class="npc-sell-name" style="color:${rc}">${item.name}</div>
        <div class="npc-sell-meta">
          <span style="background:rgba(255,255,255,.05);padding:1px 5px;border-radius:3px;font-size:9px;color:${rc}">${tag} · ${rInfo.label}</span>
          <span style="margin-left:6px;color:rgba(212,160,23,.7)">×${item.qty}</span>
        </div>
      </div>
      <div class="npc-sell-price">+${price}两</div>
    </div>`;
  });
  html += '</div>';
  // 提示
  html += `<div style="font-size:10px;color:rgba(180,150,80,.3);text-align:center;margin-top:8px;letter-spacing:.5px">
    点击物品出售 · 价格为商行回收价</div>`;

  return html;
}

// 切换商店子Tab（购买 / 出售）
function _switchShopSubTab(tab){
  var buyBtn = document.getElementById('npcSubTabBuy');
  var sellBtn = document.getElementById('npcSubTabSell');
  var buyContent = document.getElementById('npcShopBuyContent');
  var sellContent = document.getElementById('npcShopSellContent');
  if(buyBtn) buyBtn.classList.toggle('active', tab==='buy');
  if(sellBtn) sellBtn.classList.toggle('active', tab==='sell');
  if(buyContent) buyContent.classList.toggle('active', tab==='buy');
  if(sellContent) sellContent.classList.toggle('active', tab==='sell');
}

// 出售确认弹窗（含数量选择器）
function _npcSellConfirm(itemId, itemName, price, qty, src){
  // 用全局变量暂存当前选择的数量，方便按钮 onclick 读取
  window._sellQty = 1;
  var maxQty = qty;
  var safeName = itemName.replace(/'/g, "\\'");
  var bodyHtml = `
  <div class="buy-confirm-card">
    <span class="bcc-icon">📤</span>
    <div class="bcc-name" style="color:#d4a817">出售【${itemName}】</div>
    <div class="bcc-price-row">
      <span class="bcc-price-icon">💰</span>
      <span class="bcc-price" style="color:#64c864" id="sellUnitPrice">${price}</span>
      <span class="bcc-price-unit">两 / 件</span>
    </div>
    <div class="bcc-balance">持有：<strong id="sellMaxQty">${qty}</strong> 件</div>

    <!-- 数量选择器 -->
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin:14px 0 6px;">
      <button onclick="_sellQty=Math.max(1,_sellQty-1);document.getElementById('sellQtyVal').textContent=_sellQty;document.getElementById('sellTotalVal').textContent=_sellQty*${price};"
        style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(200,160,30,.4);background:rgba(180,140,20,.15);color:#e0c060;font-size:18px;cursor:pointer;line-height:1;">−</button>
      <span id="sellQtyVal" style="min-width:40px;text-align:center;font-size:22px;font-weight:bold;color:#f0d870">1</span>
      <button onclick="_sellQty=Math.min(${maxQty},_sellQty+1);document.getElementById('sellQtyVal').textContent=_sellQty;document.getElementById('sellTotalVal').textContent=_sellQty*${price};"
        style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(200,160,30,.4);background:rgba(180,140,20,.15);color:#e0c060;font-size:18px;cursor:pointer;line-height:1;">＋</button>
    </div>
    <div style="text-align:center;font-size:13px;color:rgba(200,180,100,.7);margin-bottom:8px">
      合计：<strong style="color:#64c864;font-size:15px" id="sellTotalVal">${price}</strong> 两
    </div>

    <div class="bcc-divider"></div>
    <div class="bcc-actions">
      <button class="bcc-btn bcc-btn-confirm" id="sellConfirmBtn"
        onclick="if(typeof townModalClose==='function') townModalClose(null); _npcSellDo('${itemId}','${safeName}',${price},window._sellQty,'${src}')">
        ✅ 确认出售
      </button>
      <button class="bcc-btn bcc-btn-cancel"
        onclick="if(typeof townModalClose==='function') townModalClose(null)">
        ❌ 取消
      </button>
    </div>
  </div>`;

  if(typeof townModalOpen === 'function'){
    var overlay = document.getElementById('townModalOverlay');
    if(overlay) overlay.classList.add('confirm-card');
    townModalOpen('📤 确认出售', bodyHtml);
  } else {
    _npcSellDo(itemId, itemName, price, 1, src);
  }
}

// 执行出售
function _npcSellDo(itemId, itemName, price, qty, src){
  try{
    var ok = false;
    if(src === 'consumable' && typeof consumableBagConsume === 'function'){
      ok = consumableBagConsume(itemId, qty);
    } else if(src === 'craft' && typeof craftBagConsume !== 'undefined'){
      // craftBagConsume 可能在 crafting.js 里
      var bag = craftBagLoad();
      var entry = bag.find(function(e){return e.id===itemId;});
      if(entry && entry.qty >= qty){
        entry.qty -= qty;
        if(entry.qty <= 0) bag.splice(bag.indexOf(entry),1);
        craftBagSave(bag);
        ok = true;
      }
    }

    if(!ok){
      showToast(`⚠️ 出售失败，物品不足或不存在`, 'err');
      return;
    }

    // 加银两
    var total = price * qty;
    SilverManager.add(total);
    SilverManager.save();
    if(typeof travelSave === 'function') travelSave();
    if(typeof townRefreshStatus === 'function') townRefreshStatus();

    showToast(`📤 已出售 ${itemName} ×${qty}，获得 ${total} 两银`);

    // 刷新出售面板
    npcStateLoad(); // 确保 _curNpcId 有效
    var rel = getNpcRel(_curNpcId);
    var newPanel = _buildNpcSellPanel(_curNpcId, rel);
    var el = document.getElementById('npcShopSellContent');
    if(el) el.innerHTML = newPanel;

  } catch(err){
    console.error('[NPC Sell]', err);
    showToast(`❌ 出售异常`, 'err');
  }
}

window._switchShopSubTab = _switchShopSubTab;
window._npcSellConfirm = _npcSellConfirm;
window._npcSellDo = _npcSellDo;

// ═══════════════════════════════════════════════════════════════════
//  "将将胡"神秘商人系统
// ═══════════════════════════════════════════════════════════════════

// ── 神秘商人商品池 ──
const MYSTERY_ITEMS_POOL = [
  // 稀有功法残页
  { id: 'myst_manual_frag', icon: '📜', name: '神秘功法残页', desc: '泛黄的古籍残页，似乎记载着某种失传武学', price: 500, rarity: 'rare', effect: { type: 'manual_frag', value: 1 } },
  { id: 'myst_manual_whole', icon: '📖', name: '完整秘籍抄本', desc: '某位前辈手抄的武功秘籍，字迹潦草但内容完整', price: 1200, rarity: 'epic', effect: { type: 'random_manual', value: 1 } },
  // 稀有材料
  { id: 'myst_rare_ore', icon: '💎', name: '天外陨铁', desc: '从天而降的神秘金属，打造神兵利器的绝佳材料', price: 800, rarity: 'rare', effect: { type: 'material', value: 'meteorite_iron' } },
  { id: 'myst_ancient_herb', icon: '🌺', name: '千年灵芝', desc: '传说中能起死回生的仙草', price: 600, rarity: 'rare', effect: { type: 'heal', value: 999 } },
  // 特殊道具
  { id: 'myst_luck_charm', icon: '🍀', name: '转运符', desc: '道士开光过的符咒，据说能改运气', price: 300, rarity: 'uncommon', effect: { type: 'buff', value: 'luck', duration: 86400 } },
  { id: 'myst_map_fragment', icon: '🗺️', name: '藏宝图残片', desc: '某处宝藏地图的一部分', price: 400, rarity: 'uncommon', effect: { type: 'map_frag', value: 1 } },
  { id: 'myst_identity_mask', icon: '🎭', name: '易容面具', desc: '薄如蝉翼的人皮面具，戴上后难以辨认', price: 350, rarity: 'uncommon', effect: { type: 'disguise', duration: 3600 } },
  // 史诗级珍品
  { id: 'myst_epic_weapon', icon: '⚔️', name: '无名古剑', desc: '剑身刻有古老铭文，来历不明但锋利无比', price: 2500, rarity: 'epic', effect: { type: 'equip', slot: 'weapon', tier: 'epic' } },
  { id: 'myst_epic_armor', icon: '🛡️', name: '玄铁宝甲', desc: '以玄铁打造的轻甲，刀枪不入', price: 2200, rarity: 'epic', effect: { type: 'equip', slot: 'armor', tier: 'epic' } },
  { id: 'myst_panacea', icon: '💊', name: '九转还魂丹', desc: '传说中的仙丹，能起死回生', price: 1500, rarity: 'epic', effect: { type: 'revive', value: 1 } },
];

// ── 生成神秘商人商品 ──
function _generateMysteryItems(){
  const count = 2 + Math.floor(Math.random() * 3); // 2-4件商品
  const items = [];
  const used = new Set();
  
  for(let i = 0; i < count; i++){
    // 根据稀有度加权选择
    const roll = Math.random();
    let rarity;
    if(roll < 0.50) rarity = 'uncommon';
    else if(roll < 0.80) rarity = 'rare';
    else rarity = 'epic';
    
    const pool = MYSTERY_ITEMS_POOL.filter(it => it.rarity === rarity && !used.has(it.id));
    if(pool.length === 0) continue;
    
    const item = pool[Math.floor(Math.random() * pool.length)];
    used.add(item.id);
    items.push(item);
  }
  
  return items;
}

// ── 构建神秘商人HTML ──
function _buildMysteryMerchantHtml(items, discount, cityMod, weMod){
  const mysteryItemsHtml = items.map((item, idx) => {
    const realPrice = Math.round(item.price * discount * cityMod * weMod);
    const rarityColor = {
      uncommon: '#80c0ff',
      rare: '#c080ff',
      epic: '#ffc080'
    }[item.rarity] || '#fff';
    
    const rarityLabel = {
      uncommon: '【珍】',
      rare: '【稀】',
      epic: '【绝】'
    }[item.rarity] || '';
    
    return `<div class="npc-shop-item npc-mystery-item" 
                 data-mystery-idx="${idx}" data-item-id="${item.id}" data-price="${realPrice}"
                 style="border-color:${rarityColor};background:rgba(40,30,60,.4)">
      <div class="npc-shop-discount" style="background:rgba(120,80,180,.5);color:${rarityColor}">${rarityLabel}</div>
      <div class="npc-shop-item-icon" style="font-size:28px">${item.icon}</div>
      <div class="npc-shop-item-name" style="color:${rarityColor}">${item.name}</div>
      <div class="npc-shop-item-desc">${item.desc}</div>
      <div class="npc-shop-item-price" style="color:#ffd700">💰 ${realPrice}两</div>
    </div>`;
  }).join('');
  
  return `
    <div style="background:linear-gradient(90deg,rgba(100,60,180,.25),rgba(60,40,100,.25));border:1px solid rgba(180,120,255,.4);border-radius:8px;padding:10px;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:20px">🎭</span>
        <span style="color:#d0a0ff;font-weight:bold">神秘商人的珍品</span>
        <span style="color:rgba(200,160,255,.6);font-size:11px">（仅限本次）</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">
        ${mysteryItemsHtml}
      </div>
    </div>`;
}

// ── 购买神秘商人商品 ──
window._buyMysteryItem = function(itemId, price){
  if(typeof SilverManager !== 'undefined' && SilverManager.get() < price){
    showToast('💰 银两不足！', 'err');
    return;
  }
  
  const item = MYSTERY_ITEMS_POOL.find(it => it.id === itemId);
  if(!item) return;
  
  // 扣款
  if(typeof SilverManager !== 'undefined'){
    SilverManager.add(-price);
    SilverManager.save();
  }
  
  // 发放物品效果
  _applyMysteryItemEffect(item);
  
  showToast(`🎭 购得 ${item.icon} ${item.name}！`, 'rare');
  
  // 移除已购买的商品
  const el = document.querySelector(`[data-item-id="${itemId}"]`);
  if(el) el.style.opacity = '0.3';
};

// ── 应用神秘物品效果 ──
function _applyMysteryItemEffect(item){
  const eff = item.effect;
  if(!eff) return;
  
  switch(eff.type){
    case 'heal':
      if(typeof edS !== 'undefined'){
        edS.hp = Math.min(edS.maxHp || 100, (edS.hp || 0) + eff.value);
        showToast(`❤️ 恢复 ${eff.value} 点气血！`);
      }
      break;
    case 'buff':
      // 存储buff到状态
      if(typeof edS !== 'undefined'){
        edS._mysteryBuffs = edS._mysteryBuffs || {};
        edS._mysteryBuffs[eff.value] = Date.now() + (eff.duration * 1000);
        showToast(`✨ 获得 ${eff.value} 加成，持续${eff.duration/3600}小时！`);
      }
      break;
    case 'material':
      if(typeof craftBagAdd === 'function'){
        craftBagAdd(eff.value, 1);
      }
      break;
    case 'random_manual':
      // 随机给一本功法
      if(typeof MANUAL_DB !== 'undefined'){
        const manuals = Object.keys(MANUAL_DB);
        const randomManual = manuals[Math.floor(Math.random() * manuals.length)];
        if(typeof addManualToPlayer === 'function'){
          addManualToPlayer(randomManual);
        }
        showToast(`📖 获得功法秘籍！`);
      }
      break;
    case 'revive':
      if(typeof edS !== 'undefined'){
        edS._reviveTokens = (edS._reviveTokens || 0) + eff.value;
        showToast(`💊 获得 ${eff.value} 次复活机会！`);
      }
      break;
    default:
      // 其他效果存入背包
      if(typeof craftBagAdd === 'function'){
        craftBagAdd(item.id, 1);
      }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  每日赏金榜系统
//  每天从赏金池中抽取3个悬赏任务，完成后可领取丰厚奖励
// ═══════════════════════════════════════════════════════════════════

// ── 赏金任务模板池 ──
// levelRange: [min, max] 玩家等级区间
// type: kill | collect | escort | fishing | cricket
// tier: func | major | elite
const DAILY_BOUNTY_TEMPLATES = [

  // ── 低级赏金 (Lv1-20) ── 奖励提升约2.5倍
  { id:'bty_lv_bandit3',     icon:'⚔', nameTpl:'通缉：山贼余党',     descTpl:'江湖传闻近日有山贼余党流窜，将其清除可获赏金。',    type:'kill',   tier:'func',   enemyType:'bandit',    qty:3,  silver:90,  exp:50,  rel:3,  levelRange:[1,20] },
  { id:'bty_lv_wolf3',       icon:'🐺', nameTpl:'猎狼：山野狼患',      descTpl:'城外山林中狼群出没，伤及过路商旅，需将其驱逐。',       type:'kill',   tier:'func',   enemyType:'wolf',      qty:3,  silver:80,  exp:45,  rel:2,  levelRange:[1,20] },
  { id:'bty_lv_herb5',       icon:'🌿', nameTpl:'采药：寻常草药',       descTpl:'城中郎中急需一批草药，采集归来可得酬劳。',              type:'collect',tier:'func',   itemType:'herb',        qty:5,  silver:100, exp:55,  rel:3,  levelRange:[1,20] },
  { id:'bty_lv_fishing5',    icon:'🎣', nameTpl:'渔获：河鲜收购',       descTpl:'酒楼掌柜想收购些新鲜河鱼，钓上来直接交货。',             type:'fishing',tier:'func',   fishTier:0,            qty:5,  silver:110, exp:60,  rel:3,  levelRange:[1,20] },
  { id:'bty_lv_cricket3',    icon:'🦗', nameTpl:'斗蛐蛐：连胜挑战',     descTpl:'蛐蛐坊主发起连胜挑战，胜三场可得赏金。',               type:'cricket',tier:'func',   wins:3,                qty:0,  silver:120, exp:65,  rel:4,  levelRange:[1,20] },
  { id:'bty_lv_escort1',     icon:'🛡', nameTpl:'护送：商旅随行',       descTpl:'商队缺少护卫，帮忙护送一趟可得丰厚报酬。',               type:'escort', tier:'func',   escortTier:1,         qty:0,  silver:85,  exp:45,  rel:2,  levelRange:[1,15] },

  // ── 中级赏金 (Lv15-50) ── 奖励提升约2倍
  { id:'bty_mv_banditchief',  icon:'💀', nameTpl:'斩首：山贼头目',      descTpl:'匪首「铁头陀」率众盘踞险地，民怨沸腾，悬赏缉拿！',      type:'kill',   tier:'major',  enemyId:'bandit_chief',qty:1,  silver:280, exp:140, rel:8,  levelRange:[15,50] },
  { id:'bty_mv_robber3',     icon:'⚔', nameTpl:'剿匪：马帮劫匪',       descTpl:'马帮商队屡遭劫掠，官府悬赏剿灭马帮劫匪。',             type:'kill',   tier:'major',  enemyType:'robber',    qty:5,  silver:220, exp:110, rel:6,  levelRange:[15,50] },
  { id:'bty_mv_iron5',       icon:'⛏️', nameTpl:'采矿：精铁收购',        descTpl:'铁匠铺急需精铁，采集归来按质论价。',                   type:'collect',tier:'major',  itemType:'iron',        qty:5,  silver:180, exp:90,  rel:5,  levelRange:[15,50] },
  { id:'bty_mv_bass5',       icon:'🎣', nameTpl:'渔获：鳜鱼佳肴',       descTpl:'酒楼要筹备鳜鱼宴，需上好鳜鱼入菜。',                   type:'fishing',tier:'major',  fishTier:2,            qty:3,  silver:200, exp:100, rel:6,  levelRange:[15,50] },
  { id:'bty_mv_escortgold',  icon:'🛡', nameTpl:'护镖：黄金货物',       descTpl:'富商有一批货物需护送至相邻城镇，报酬丰厚。',             type:'escort', tier:'major',  escortTier:2,         qty:0,  silver:300, exp:150, rel:8,  levelRange:[15,50] },
  { id:'bty_mv_cricket5',    icon:'🦗', nameTpl:'虫王挑战：连胜五局',    descTpl:'蛐蛐场上连胜五场，可获封"虫王挑战者"称号。',          type:'cricket',tier:'major',  wins:5,                qty:0,  silver:280, exp:140, rel:8,  levelRange:[15,50] },

  // ── 高级赏金 (Lv40-100) ── 奖励提升约1.8倍
  { id:'bty_hv_boss3',       icon:'☠', nameTpl:'讨伐：副本BOSS',       descTpl:'据探子回报，险地中有凶名赫赫的BOSS盘踞，悬赏讨伐！',   type:'kill',   tier:'elite',  bossElite:true,        qty:1,  silver:600, exp:300, rel:12, levelRange:[40,100] },
  { id:'bty_hv_cult5',       icon:'🩸', nameTpl:'剿灭：邪派余孽',       descTpl:'邪道中人暗中作乱，正道联盟联合悬赏，剿灭邪派弟子。',   type:'kill',   tier:'elite',  enemyType:'cult',      qty:5,  silver:480, exp:240, rel:10, levelRange:[40,100] },
  { id:'bty_hv_goldfish',    icon:'🎣', nameTpl:'传说渔获：金鳞锦鲤',   descTpl:'江湖传说河中有金色锦鲤出没，能钓得者赏金丰厚！',      type:'fishing',tier:'elite',  fishTier:3,            qty:1,  silver:400, exp:200, rel:8,  levelRange:[40,100] },
  { id:'bty_hv_herbrare',    icon:'🌿', nameTpl:'奇药：天山雪莲',        descTpl:'名医重金求购珍稀药材，据说只有险峰绝壁方能采得。',     type:'collect',tier:'elite',  itemType:'herb_rare',   qty:3,  silver:520, exp:260, rel:10, levelRange:[40,100] },
  { id:'bty_hv_eliteescort', icon:'🛡', nameTpl:'绝境护镖：险象环生',   descTpl:'此镖极为凶险，非艺高胆大者不敢接，赏金亦数倍于常。',  type:'escort', tier:'elite',  escortTier:3,         qty:0,  silver:700, exp:350, rel:15, levelRange:[40,100] },
  { id:'bty_hv_kingcricket', icon:'🦗', nameTpl:'虫王之路：连胜十局',   descTpl:'蛐蛐场最巅峰的挑战——连胜十场，封号"虫王"！',         type:'cricket',tier:'elite',  wins:10,               qty:0,  silver:620, exp:310, rel:12, levelRange:[40,100] },
  { id:'bty_hv_dungeon3',    icon:'🗺️', nameTpl:'探索：险地清扫',        descTpl:'某处险地被流寇占据，悬赏清理其中三层。',              type:'kill',   tier:'elite',  bossElite:true,        qty:3,  silver:550, exp:280, rel:10, levelRange:[45,100] },
];

/**
 * 获取当前玩家的赏金等级档位
 * @returns 'low' | 'mid' | 'high'
 */
function _getBountyTier(){
  const level = (typeof edS !== 'undefined' ? (edS.level || 1) : 1) || 1;
  if(level >= 40) return 'high';
  if(level >= 15) return 'mid';
  return 'low';
}

/**
 * 检查赏金是否需要刷新（游戏天变化时）
 * 如果需要刷新，则从当前档位池中随机抽取3个赏金
 */
function ensureDailyBounties(){
  const today = _getTodayIndex();
  const tier  = _getBountyTier();
  const prev  = npcState._dailyBountyTier || '';

  // 天数变化 或 档位变化（升级） → 刷新赏金
  if(npcState._dailyBountyDay !== today || prev !== tier){
    npcState._dailyBountyDay  = today;
    npcState._dailyBountyTier = tier;
    npcState._dailyBounties   = _genBountiesForTier(tier);
    npcStateSave();
  }
}

/**
 * 从指定档位池生成3个随机赏金
 * 优先同档位，不够时从相邻档位补充
 */
function _genBountiesForTier(tier){
  const level = (typeof edS !== 'undefined' ? (edS.level || 1) : 1) || 1;
  const pools = DAILY_BOUNTY_TEMPLATES.filter(t => {
    return level >= t.levelRange[0] && level <= t.levelRange[1];
  });

  // 如果当前档位池不足3个，向相邻档位补充
  if(pools.length < 3){
    const adjacent = DAILY_BOUNTY_TEMPLATES.filter(t => {
      return Math.abs(level - (t.levelRange[0] + t.levelRange[1]) / 2) <= 30;
    });
    adjacent.forEach(b => { if(!pools.find(p => p.id === b.id)) pools.push(b); });
  }

  // 打乱顺序，取前5个（比原来多2个），并附加唯一实例ID
  const shuffled = pools.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((tpl, idx) => ({
    ...tpl,
    instanceId: `bty_${new Date().toISOString().slice(0,10)}_${idx}_${Date.now()}`,
    // 默认未接受（claimed 表示已完成，active 表示进行中）
    _status: 'available',
  }));
}

/** 获取今日赏金列表（返回带当前状态的赏金对象） */
function getDailyBounties(){
  ensureDailyBounties();
  return (npcState._dailyBounties || []).map(b => {
    // 从 npcState.quests 中读取真实状态（接受后变为 active/done/claimed）
    const realStatus = getQuestStatus(b.instanceId);
    return { ...b, _status: realStatus };
  });
}

/** 获取今日赏金中处于 active/done 状态的数量（用于徽章显示） */
function getActiveBountyCount(){
  return getDailyBounties().filter(b => b._status === 'active' || b._status === 'done').length;
}

/**
 * 接受赏金任务
 * 将赏金注册到 npcState.quests，后续复用现有任务完成逻辑
 */
function acceptBounty(instanceId){
  const bounty = getDailyBounties().find(b => b.instanceId === instanceId);
  if(!bounty){
    if(typeof showToast === 'function') showToast('⚠️ 赏金不存在');
    return;
  }
  if(bounty._status !== 'available'){
    if(typeof showToast === 'function'){
      if(bounty._status === 'active') showToast('此赏金已在进行中');
      else if(bounty._status === 'done') showToast('此赏金已完成，请领取奖励');
      else showToast('该赏金无法接受');
    }
    return;
  }

  // 注册为正式任务
  setQuestStatus(instanceId, 'active');
  if(typeof showToast === 'function') showToast(`📋 赏金已接取：${bounty.nameTpl}`);
  if(typeof townRefreshBountyBadge === 'function') townRefreshBountyBadge();
  if(typeof townRefreshQuestBadge === 'function') townRefreshQuestBadge();
}

/**
 * 根据赏金实例获取兼容的任务对象（供 _tqBuildTargetHtml 等函数使用）
 * 返回值格式与 QUEST_DB 条目兼容
 */
function getBountyAsQuest(instanceId){
  const bounty = getDailyBounties().find(b => b.instanceId === instanceId);
  if(!bounty) return null;
  return {
    id:          bounty.instanceId,
    name:        bounty.nameTpl,
    desc:        bounty.descTpl,
    type:        bounty.type,
    icon:        bounty.icon,
    // 击杀类
    targetNpcId: bounty.enemyId || null,
    targetType:  bounty.enemyType || null,
    targetTier: bounty.tier || null,
    qty:         bounty.qty || 0,
    // 收集类
    targetItemId: bounty.itemType || null,
    // 护送/钓鱼/斗蛐蛐
    escortTier:  bounty.escortTier || null,
    fishTier:    bounty.fishTier || null,
    wins:        bounty.wins || 0,
    bossElite:   bounty.bossElite || false,
    reward: {
      silver: bounty.silver || 0,
      exp:    bounty.exp || 0,
      rel:    bounty.rel || 0,
    },
    rewardText: `${bounty.silver}两 + ${bounty.exp}经验 + ${bounty.rel}好感`,
    issuerNpcId: 'bounty_board', // 赏金榜专用虚拟发布人
    // 赏金任务不过期，不占 QUEST_DB 槽位
    isBounty: true,
  };
}

/**
 * 统一任务查询：先查 QUEST_DB，再查动态任务，最后查赏金
 */
function getAnyQuest(questId){
  if(typeof questId !== 'string') return null;
  // 赏金 ID 格式：bty_YYYY-MM-DD_N_timestamp
  if(questId.startsWith('bty_')){
    return getBountyAsQuest(questId);
  }
  // 情境任务 ID 格式：ctx_xxx 或 ctx_xxx_cityId
  if(npcState.contextualQuests && npcState.contextualQuests[questId]){
    const inst = npcState.contextualQuests[questId];
    return _genContextualQuest(inst.tplId, inst.suffix);
  }
  let q = (typeof QUEST_DB !== 'undefined' && QUEST_DB[questId])
    || getAlignQuestById(questId)
    || null;
  // 合并运行时覆盖（如接取时动态分配的 targetCityId、targetNpcId 等）
  if(q && npcState.questOverrides && npcState.questOverrides[questId]){
    const ov = npcState.questOverrides[questId];
    q = Object.assign({}, q, ov);
    // 若有动态生成的描述，替换原任务 desc
    if(ov._dynamicDesc) q.desc = ov._dynamicDesc;
  }
  return q;
}

// 暴露到 window，供 town.html 调用
window.ensureDailyBounties   = ensureDailyBounties;
window.getDailyBounties      = getDailyBounties;
window.acceptBounty          = acceptBounty;
window.getBountyAsQuest      = getBountyAsQuest;
window.getActiveBountyCount  = getActiveBountyCount;
window.getAnyQuest           = getAnyQuest;

/**
 * 领取赏金奖励
 * @returns {boolean} 是否成功领取
 */
function claimBountyReward(instanceId){
  const bounty = getDailyBounties().find(b => b.instanceId === instanceId);
  if(!bounty){
    if(typeof showToast === 'function') showToast('⚠️ 赏金不存在');
    return false;
  }
  const status = getQuestStatus(instanceId);
  if(status !== 'done' && status !== 'active'){
    if(typeof showToast === 'function') showToast('该赏金尚未完成，无法领取');
    return false;
  }

  // 检查击杀/收集目标是否真的完成了
  if(bounty.type === 'kill' && bounty.qty > 0){
    const prog = npcState.quests?.[instanceId + '_prog'] || 0;
    if(prog < bounty.qty){
      if(typeof showToast === 'function') showToast(`尚未完成全部击杀目标（${prog}/${bounty.qty}）`);
      return false;
    }
  }
  if((bounty.type === 'collect') && bounty.qty > 0){
    const prog = npcState.quests?.[instanceId + '_prog'] || 0;
    if(prog < bounty.qty){
      if(typeof showToast === 'function') showToast(`尚未收集足够物品（${prog}/${bounty.qty}）`);
      return false;
    }
  }

  // 发放奖励
  const rew = {
    silver: bounty.silver || 0,
    exp:    bounty.exp    || 0,
    rel:    bounty.rel    || 0,
  };

  // 加银两
  SilverManager.add(rew.silver);
  SilverManager.save();

  // 加经验
  if(typeof edS !== 'undefined' && typeof addExp === 'function'){
    addExp(rew.exp);
  }

  // 加好感（赏金榜对所有城市的虚拟 NPC 都有好感加成，标记为"赏金联盟"）
  if(rew.rel > 0 && typeof jianghuState !== 'undefined'){
    // 赏金系统不绑定特定NPC，好感加给最近交谈的NPC或随机正派NPC
    // 这里简单记录：不单独加某个NPC好感（赏金任务本身不绑定NPC）
  }

  // 标记完成
  setQuestStatus(instanceId, 'claimed');

  // 每日活跃积分 +1（赏金任务完成）
  if (typeof addDailyActivityPoint === 'function') addDailyActivityPoint();

  // 城市声望 +（基于赏金金额给予城市声望）
  const cityId = (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : null;
  if(cityId && typeof jhAddFame === 'function'){
    const fameAmount = Math.floor(rew.silver / 5); // 银两/5 作为城市声望基础
    if(fameAmount > 0){
      jhAddFame(fameAmount, rew.rel > 0 ? Math.floor(rew.rel / 5) : 0, cityId);
    }
  }

  // 领取成功强化提示
  if(typeof showToast === 'function'){
    // 根据赏金等级使用不同颜色强度
    const tierType = bounty?.tier || 'func';
    const tierColor = tierType === 'elite' ? '#ffd700' : tierType === 'major' ? '#e8b060' : '#80ff80';
    const tierStar  = tierType === 'elite' ? '⭐' : tierType === 'major' ? '★' : '';
    showToast(`${tierStar}🎊 赏金到账！💰${rew.silver}两 + ✨${rew.exp}经验`, 'success');
  }
  if(typeof travelSave === 'function') travelSave();
  if(typeof townRefreshStatus === 'function') townRefreshStatus();

  return true;
}

window.claimBountyReward = claimBountyReward;

// ── 关系互动动作 ──
function npcRelAction(action, npcId, itemId){
  npcStateLoad();
  const rel = getNpcRel(npcId);

  // ── 关系门槛防护（与 UI 保持同步）──
  if((action === 'gift_silver' || action === 'gift_item') && rel <= -60){
    const lines = [
      '对方冷哼一声，将礼物推回你手里。',
      '对方瞪你一眼，连看都不愿多看一眼。',
      '「收你的东西？做梦！」对方拂袖而去。',
    ];
    showToast(lines[Math.floor(Math.random()*lines.length)]);
    return;
  }
  if((action === 'joke' || action === 'treat_meal') && rel <= -20){
    if(action === 'joke'){
      const lines = [
        '对方冷冷地看了你一眼，根本没兴趣听。',
        '「省省吧。」对方侧过脸，不想搭理你。',
        '你讲到一半，对方已经转身走开了。',
      ];
      showToast(lines[Math.floor(Math.random()*lines.length)]);
    } else {
      const lines = [
        '「跟你吃饭？没胃口。」对方头也不抬。',
        '对方皱起眉头，示意你离远一点。',
        '「不必了。」对方语气冷淡，拒绝得干脆。',
      ];
      showToast(lines[Math.floor(Math.random()*lines.length)]);
    }
    return;
  }

  if(action === 'gift_item'){
    const gift = evaluateNpcGift(npcId, itemId);
    if(!gift){
      showToast('你手头没有适合送给此人的礼物。');
      return;
    }
    const haveQty = (typeof craftBagGetMergedQty === 'function')
      ? craftBagGetMergedQty(itemId)
      : (typeof craftBagGetQty === 'function' ? craftBagGetQty(itemId) : 0);
    if(haveQty < 1){
      showToast('这件礼物已经不在背包里了。');
      return;
    }

    const beforeRel = rel;
    const beforeQuestIds = _getNpcGiftAvailableQuestIds(npcId, _curCityId);
    const { gain: baseGain, reason } = getNpcInteractGain(npcId, 'gift_item');
    if(reason){
      showToast(reason);
      return;
    }

    const consumed = (typeof craftBagConsumeMerged === 'function')
      ? craftBagConsumeMerged(itemId, 1)
      : (typeof craftBagConsume === 'function' ? craftBagConsume(itemId, 1) : false);
    if(!consumed){
      showToast('背包里找不到这件礼物。');
      return;
    }

    const icon = gift.meta?.icon || '🎁';
    const name = gift.meta?.name || itemId;
    let actualGain = Math.min(18, baseGain + gift.bonus);
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"NPC好感随机事件
    // ═══════════════════════════════════════════════════════════════
    const luckEvent = _checkRelLuckEvent();
    let luckMsg = '';
    let bonusItem = null;
    
    if(luckEvent){
      actualGain = Math.round(actualGain * luckEvent.mult);
      luckMsg = luckEvent.message(actualGain > 0 ? `+${actualGain}` : `${actualGain}`);
      
      // 意外之喜：回赠礼物
      if(luckEvent.bonusItem && typeof craftBagAdd === 'function'){
        const bonusItems = ['item_herb_gancao', 'item_river_mud', 'item_iron_ore', 'item_alpha_pelt'];
        bonusItem = bonusItems[Math.floor(Math.random() * bonusItems.length)];
        craftBagAdd(bonusItem, 1);
      }
    }
    
    consumeNpcInteract(npcId, 'gift_item');
    changeNpcRel(npcId, actualGain);

    const afterRel = getNpcRel(npcId);
    const afterQuestIds = _getNpcGiftAvailableQuestIds(npcId, _curCityId);
    const feedback = _getNpcGiftFeedback(npcId, gift, beforeRel, afterRel, _curCityId, beforeQuestIds, afterQuestIds);

    // 显示消息
    if(luckMsg){
      showToast(luckMsg);
      if(luckEvent.icon){
        _setNpcSpeechBubble(`${luckEvent.icon} ${luckEvent.desc}`);
      }
    } else {
      showToast(`送出${icon}${name}，${gift.reaction}。好感+${actualGain}${_interactRemainTip(npcId,'gift_item')}`);
    }
    
    if(feedback.bubble && !luckMsg){
      _setNpcSpeechBubble(feedback.bubble);
      showToast(`「${feedback.bubble}」`);
    }
    (feedback.extraToasts || []).forEach(msg => showToast(msg));
    npcUpdateRelBar(npcId);
    return;
  }


  // 获取本次能加的好感（已含每日冷却检查）
  const { gain, reason } = getNpcInteractGain(npcId, action);
  if(reason){
    showToast(reason);
    return;
  }

  if(action==='gift_silver'){
    if(!npcSpendSilver(5)) return;
    consumeNpcInteract(npcId, action);
    if(gain > 0){
      changeNpcRel(npcId, gain);
      showToast(`赠出5两银子，好感+${gain}${_interactRemainTip(npcId,'gift_silver')}`);
    } else {
      showToast('对方已收下银两，神情淡淡，不置可否。');
    }

  } else if(action==='joke'){
    consumeNpcInteract(npcId, action);
    if(gain > 0){
      changeNpcRel(npcId, gain);
      showToast(`讲了个江湖段子，气氛轻松了不少！好感+${gain}${_interactRemainTip(npcId,'joke')}`);
    } else {
      showToast('对方礼貌地笑了笑，段子已不够新鲜了。');
    }

  } else if(action==='treat_meal'){
    if(!npcSpendSilver(10)) return;
    consumeNpcInteract(npcId, action);
    if(gain > 0){
      changeNpcRel(npcId, gain);
      showToast(`共进一餐，关系拉近不少！好感+${gain}${_interactRemainTip(npcId,'treat_meal')}`);
    } else {
      showToast('同桌吃饭，对方已将你视为寻常，不以为意。');
    }
  }
  npcUpdateRelBar(npcId);
}


// 剩余次数提示（若还有剩余则不显示，若已到最后一档则提示）
function _interactRemainTip(npcId, action){
  const table = REL_INTERACT_TABLE[action];
  if(!table) return '';
  const done = (npcState.interactCounts[npcId]||{})[action] || 0;
  const remaining = table.length - done;
  if(remaining <= 1) return '（此举已近极限）';
  return '';
}

// 辅助：花银两
function npcSpendSilver(amount){
  if(!SilverManager.has(amount)){ showToast('银两不足！'); return false; }
  SilverManager.add(-amount);
  SilverManager.save();
  if(typeof travelRenderIndex === 'function') travelRenderIndex();
  return true;
}

// 辅助：刷新弹窗中的关系条
function npcUpdateRelBar(npcId){
  const rel = getNpcRel(npcId);
  const relLv = getNpcRelLevel(rel);
  const relPct = Math.round((rel+100)/2);
  const relBarColor = rel < -20 ? '#ff6060' : rel < 20 ? '#80a080' : rel < 60 ? '#80d080' : '#ff9fc8';
  const fill = document.querySelector('.npc-rel-fill');
  const fillBig = document.querySelector('.npc-rel-fill-big');
  const valEl = document.querySelector('.npc-rel-value');
  const descEl = document.getElementById('npcRelDesc');
  const actEl = document.getElementById('npcRelActions');
  if(fill){ fill.style.width = relPct+'%'; fill.style.background = relBarColor; }
  if(fillBig){ fillBig.style.width = relPct+'%'; fillBig.style.background = relBarColor; }
  if(valEl){ valEl.textContent = (rel>0?'+':'')+rel; valEl.style.color = relLv.color; }
  if(descEl){ descEl.textContent = getNpcRelDesc(npcId, rel); }
  if(actEl){ actEl.innerHTML = renderNpcRelActionsHtml(npcId, rel); }

  // 同步更新字符画心情动画
  const portrait = document.querySelector('.npc-dialog-portrait');
  if(portrait){
    portrait.classList.remove('mood-happy','mood-angry','mood-sad');
    if(rel >= 60)  portrait.classList.add('mood-happy');
    else if(rel <= -20) portrait.classList.add('mood-angry');
  }
}

// 根据好感度生成关系描述
function getNpcRelDesc(npcId, rel){
  const npc = NPC_DB[npcId];
  const name = npc ? npc.name : '对方';
  if(rel <= -60) return `${name}视你为不共戴天之敌，拒绝与你交易，随时可能拔刀。`;
  if(rel <= -20) return `${name}对你心存戒备，言辞冷淡，商铺加价一成。`;
  if(rel <  20)  return `与${name}不过点头之交，无特别感情，按市价交易。`;
  if(rel <  60)  return `${name}将你视为可信朋友，商铺九折优惠，愿意分享情报。`;
  if(rel <  80)  return `${name}对你极为信任，商铺八折优惠，危急时刻或能相助。`;
  return `${name}与你情同手足，商铺八折，战斗中可能主动为你解围！`;
}

// ── Toast 提示 v2（分级 + 队列防堆叠 + 图标自动注入）──
// type: 'ok'|'warn'|'err'|'info'（默认 info）
// 支持纯字符串调用 showToast(msg) 或带类型 showToast(msg,'ok')
// 关键词自动推断 type：
//   ✅ → ok；⚠️/无法/不足/失败/错误/放弃 → warn；☠/被击败/陨落/通缉 → err
const _TOAST_STYLES = {
  ok:   { bg:'rgba(0,40,20,.92)',   border:'rgba(60,220,120,.5)',  color:'#80ffb0', icon:'✓' },
  warn: { bg:'rgba(40,25,0,.92)',   border:'rgba(220,150,40,.5)',  color:'#ffc060', icon:'⚠' },
  err:  { bg:'rgba(40,0,0,.92)',    border:'rgba(220,60,60,.5)',   color:'#ff8080', icon:'✗' },
  info: { bg:'rgba(0,25,40,.92)',   border:'rgba(80,180,220,.4)',  color:'#a0e0ff', icon:'◈' },
};
function _inferToastType(msg){
  if(/✅|成功|获得|完成|接受|领取|赢|\+\d/.test(msg))   return 'ok';
  if(/⚠|无法|不足|失败|错误|放弃|条件|上限|不能|已满/.test(msg)) return 'warn';
  if(/☠|被.*击败|陨落|通缉|危险|死|中毒/.test(msg))    return 'err';
  return 'info';
}
let _toastQueue = [], _toastShowing = false;
function _toastNext(){
  if(!_toastQueue.length){ _toastShowing=false; return; }
  _toastShowing = true;
  const {msg, type} = _toastQueue.shift();
  const st = _TOAST_STYLES[type] || _TOAST_STYLES.info;
  let t = document.getElementById('npcToast');
  if(!t){
    t = document.createElement('div');
    t.id = 'npcToast';
    document.body.appendChild(t);
  }
  t.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(6px);`
    + `background:${st.bg};border:1px solid ${st.border};color:${st.color};`
    + `padding:8px 18px 8px 14px;border-radius:20px;font-size:12px;z-index:9999;pointer-events:none;`
    + `white-space:nowrap;max-width:84vw;text-align:center;`
    + `transition:opacity .25s,transform .25s;opacity:0;`;
  t.innerHTML = `<span style="margin-right:5px;opacity:.8">${st.icon}</span>${msg}`;
  // 淡入
  requestAnimationFrame(()=>{
    t.style.opacity='1';
    t.style.transform='translateX(-50%) translateY(0)';
  });
  clearTimeout(t._timer);
  const dur = type==='err'||type==='warn' ? 2800 : 2100;
  t._timer = setTimeout(()=>{
    t.style.opacity='0';
    t.style.transform='translateX(-50%) translateY(-4px)';
    setTimeout(_toastNext, 300);
  }, dur);
}
function showToast(msg, type){
  if(!type) type = _inferToastType(msg||'');
  // 若正显示相同内容，忽略
  if(_toastQueue.length && _toastQueue[_toastQueue.length-1].msg === msg) return;
  _toastQueue.push({msg, type});
  if(!_toastShowing) _toastNext();
}

// ── NPC 关系描述（好感度等级）──
function getNpcRelLevelDesc(rel){
  return getNpcRelLevel(rel).label;
}


// ════════════════════════════════════════════════════════
//  NPC 战斗属性系统
//  ① NPC 都有等级和战斗数值
//  ② 所有 NPC 持有鉴定好的武器/防具实例
//  ③ 神器全局唯一：若玩家已持有，NPC 不再生成同一件
//  ④ 杀死 NPC → 掉落武器/防具/银两
//  ⑤ 功能性 NPC 死后冷却重生，重要 NPC 永久死亡
// ════════════════════════════════════════════════════════

// 确保关键渲染函数可在全局访问（防止作用域问题）
window.renderCityNpcs = renderCityNpcs;
window.openNpcDialog  = openNpcDialog;
window.closeNpcDialog = closeNpcDialog;
window.npcSwitchTab   = npcSwitchTab;
window.npcDoTopic     = npcDoTopic;
window.npcAcceptQuest = npcAcceptQuest;
window.showNpcIdentifyPanel = showNpcIdentifyPanel;
window.closeNpcIdentifyPanel = closeNpcIdentifyPanel;
window.doNpcIdentify = doNpcIdentify;


// ════════════════════════════════════════════════════════
//  NPC 鉴定服务面板
//  玩家找铁匠NPC鉴定装备
// ════════════════════════════════════════════════════════

// 鉴定费用表（按稀有度）——经济平衡B：原价×1.5~2
const IDENTIFY_COSTS = {
  common:    8,     // 凡品（原5）
  uncommon:  25,   // 普通（原15）
  rare:      50,   // 稀有（原30）
  epic:      100,  // 史诗（原60）
  legendary: 200,  // 传说（原120）
  mythic:    400,  // 神器（原250）
};

const RARITY_COLORS = {
  common: '#a0a0a0',
  uncommon: '#44cc88',
  rare: '#60a8ff',
  epic: '#c080f0',
  legendary: '#ffd060',
  mythic: '#ffffff',
};

function showNpcIdentifyPanel() {
  const unidItems = (edS.bag || []).filter(i => !i.identified && (i.type === 'weapon' || i.type === 'costume'));

  const title = '🔍 鉴定服务';
  let bodyHtml = `
    <div style="padding:12px 8px;font-size:11px">
      <div style="background:rgba(255,200,80,.08);border:1px solid rgba(255,200,80,.15);border-radius:8px;padding:10px 12px;margin-bottom:12px;color:#e8d090">
        <div style="font-size:12px;margin-bottom:4px">⚒️ 铁匠鉴定服务</div>
        <div style="color:rgba(200,180,120,.7);font-size:10px">将装备交由铁匠鉴定，可揭示隐藏的词条属性</div>
      </div>
      <div style="color:rgba(200,180,120,.6);font-size:10px;margin-bottom:8px">💰 当前银两：${SilverManager.get()} 两</div>
  `;

  if (unidItems.length === 0) {
    bodyHtml += `
      <div style="text-align:center;padding:30px 0;color:rgba(180,160,100,.5)">
        <div style="font-size:28px;margin-bottom:8px">📦</div>
        <div>背包中没有需要鉴定的装备</div>
      </div>
    `;
  } else {
    bodyHtml += `<div style="display:flex;flex-direction:column;gap:6px">`;
    unidItems.forEach(inst => {
      const tpl = inst.type === 'weapon'
        ? WEAPONS.find(w => w.id === inst.templateId)
        : COSTUMES.find(c => c.id === inst.templateId);
      if (!tpl) return;

      const rarity = tpl.rarity || 'common';
      const cost = IDENTIFY_COSTS[rarity] || 20;
      const color = RARITY_COLORS[rarity] || '#a0a0a0';
      const canAfford = SilverManager.has(cost);

      bodyHtml += `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:8px;${!canAfford ? 'opacity:.5' : ''}">
          <span style="font-size:20px;color:${tpl.color || color}">${inst.icon || (inst.type === 'weapon' ? '⚔️' : '🥋')}</span>
          <div style="flex:1;min-width:0">
            <div style="color:${tpl.color || color};font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tpl.name}</div>
            <div style="color:${color};font-size:9px">【${rarity.toUpperCase()}】</div>
          </div>
          <div style="color:rgba(200,180,120,.6);font-size:10px;text-align:right">
            <div>鉴定费</div>
            <div style="color:${canAfford ? '#ffd060' : '#ff6060'};font-size:11px">${cost}两</div>
          </div>
          ${canAfford
            ? `<button onclick="doNpcIdentify('${inst.instId}',${cost})" style="background:rgba(255,200,80,.15);border:1px solid rgba(255,200,80,.4);color:#ffd060;padding:4px 10px;border-radius:6px;font-size:10px;cursor:pointer">鉴定</button>`
            : `<button disabled style="background:rgba(100,100,100,.1);border:1px solid rgba(100,100,100,.2);color:rgba(150,150,150,.4);padding:4px 10px;border-radius:6px;font-size:10px">银两不足</button>`
          }
        </div>
      `;
    });
    bodyHtml += `</div>`;
  }

  bodyHtml += `<div style="margin-top:14px;text-align:center"><button onclick="closeNpcIdentifyPanel()" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(200,180,120,.6);padding:6px 20px;border-radius:6px;font-size:11px;cursor:pointer">返回</button></div></div>`;

  // 显示面板
  const overlay = document.createElement('div');
  overlay.id = 'npc-identify-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `
    <div style="background:linear-gradient(180deg,#1a1814 0%,#0e0c0a 100%);border:1px solid rgba(255,200,80,.2);border-radius:12px;max-width:360px;width:100%;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.6)">
      <div style="padding:12px 16px;border-bottom:1px solid rgba(255,200,80,.1);display:flex;align-items:center;justify-content:space-between">
        <span style="color:#ffd060;font-size:13px;font-weight:bold">${title}</span>
        <span onclick="closeNpcIdentifyPanel()" style="color:rgba(200,180,120,.5);cursor:pointer;font-size:18px;line-height:1">&times;</span>
      </div>
      <div id="npc-identify-body">${bodyHtml}</div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function closeNpcIdentifyPanel() {
  const overlay = document.getElementById('npc-identify-overlay');
  if (overlay) overlay.remove();
}

function doNpcIdentify(instId, cost) {
  if (!SilverManager.has(cost)) {
    showToast('银两不足！');
    return;
  }

  // 扣钱
  SilverManager.add(-cost);
  SilverManager.save();

  // 鉴定装备
  const inst = (edS.bag || []).find(i => i.instId === instId);
  if (!inst) {
    showToast('装备不存在！');
    return;
  }

  const tpl = inst.type === 'weapon'
    ? WEAPONS.find(w => w.id === inst.templateId)
    : COSTUMES.find(c => c.id === inst.templateId);

  // 如果找不到模板，提示用户
  if (!tpl) {
    showToast('⚠️ 装备模板数据异常，无法鉴定！');
    return;
  }

  // 使用 data-equip.js 的鉴定函数
  if (typeof rollAffixes !== 'function') {
    showToast('⚠️ 鉴定系统未加载，请刷新页面！');
    return;
  }

  inst.affixes = rollAffixes(tpl.rarity);
  inst.identified = true;

  // 双重保存：wuxia_bag（背包系统）+ wuxia_editor（战斗系统）
  bagSave();
  // 同步到 wuxia_editor，确保战斗系统能读取到鉴定后的词条
  if (typeof editorSave === 'function') {
    editorSave();
  } else if (typeof saveGameState === 'function') {
    saveGameState();
  }

  // 显示结果
  const names = inst.affixes && inst.affixes.length > 0
    ? inst.affixes.map(a => `<span style="color:#ffd060">${a.label || '?'}</span>`).join('·')
    : '无';

  showToast(`✨ 鉴定成功！${tpl.name} 获得词条：${names}`);
  if (typeof playAudio === 'function') playAudio('identify');

  // 刷新面板
  showNpcIdentifyPanel();
  if(typeof travelRenderIndex === 'function') travelRenderIndex();
}
window.npcClaimQuest  = npcClaimQuest;
window.npcAbandonQuest= npcAbandonQuest;
window.npcBuyItemDo   = npcBuyItemDo;

// ════════════════════════════════════════════════════════
//  装备强化系统（Enhanced Equipment Upgrade）
//  铁匠NPC处强化武器/防具，最多+10阶
//  材料：从合成背包消耗铁矿石/精铁/玄铁
//  5阶以上有失败概率，失败不掉阶
// ════════════════════════════════════════════════════════

// 强化配置表：[阶数] → { 材料需求, 银两, 成功率, 每属性加成/阶 }
const ENHANCE_CONFIG = [
  // +0→+1：普通材料，100%成功
  { mat:'item_iron_ore',    matQty:2, silver:30,  successRate:1.00, perAtk:3,  perDef:2,  perHp:20 },
  // +1→+2
  { mat:'item_iron_ore',    matQty:3, silver:50,  successRate:1.00, perAtk:3,  perDef:2,  perHp:20 },
  // +2→+3
  { mat:'item_iron_ore',    matQty:5, silver:80,  successRate:1.00, perAtk:4,  perDef:3,  perHp:25 },
  // +3→+4
  { mat:'item_iron_ore',    matQty:8, silver:120, successRate:0.95, perAtk:4,  perDef:3,  perHp:25 },
  // +4→+5：切换精铁
  { mat:'item_refined_iron',matQty:3, silver:180, successRate:0.90, perAtk:5,  perDef:4,  perHp:30 },
  // +5→+6
  { mat:'item_refined_iron',matQty:5, silver:260, successRate:0.80, perAtk:5,  perDef:4,  perHp:30 },
  // +6→+7
  { mat:'item_refined_iron',matQty:8, silver:360, successRate:0.70, perAtk:6,  perDef:5,  perHp:35 },
  // +7→+8：切换玄铁
  { mat:'item_xuantie',     matQty:3, silver:500, successRate:0.60, perAtk:8,  perDef:6,  perHp:40 },
  // +8→+9
  { mat:'item_xuantie',     matQty:5, silver:700, successRate:0.50, perAtk:8,  perDef:6,  perHp:40 },
  // +9→+10（满阶）
  { mat:'item_xuantie',     matQty:8, silver:1000, successRate:0.40, perAtk:10, perDef:8, perHp:50 },
];

// 材料中文名
const ENHANCE_MAT_NAMES = {
  'item_iron_ore':     { name:'铁矿石',     icon:'🪨' },
  'item_refined_iron': { name:'精铁',       icon:'⚙️' },
  'item_xuantie':      { name:'玄铁',       icon:'🌑' },
};

// 获取装备实例的强化等级
function getEnhLv(inst){ return inst._enhLv || 0; }

// 计算当前强化提供的属性加成（武器 → atk；防具 → def+hp；通用）
function calcEnhBonus(inst){
  const lv = getEnhLv(inst);
  if(lv <= 0) return { atk:0, def:0, hp:0 };
  let atk=0, def=0, hp=0;
  for(let i=0; i<lv; i++){
    const cfg = ENHANCE_CONFIG[i];
    if(!cfg) break;
    atk += cfg.perAtk;
    def += cfg.perDef;
    hp  += cfg.perHp;
  }
  return { atk, def, hp };
}

// 强化面板主入口
function showNpcEnhancePanel() {
  const equipItems = (edS.bag || []).filter(i =>
    (i.type === 'weapon' || i.type === 'costume') && i.identified !== false
  );

  const title = '⚒️ 强化装备';
  let bodyHtml = `
    <div style="padding:12px 8px;font-size:11px">
      <div style="background:rgba(255,120,20,.08);border:1px solid rgba(255,160,40,.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;color:#e8b060">
        <div style="font-size:12px;margin-bottom:4px">⚒️ 铁匠强化台</div>
        <div style="color:rgba(220,170,100,.7);font-size:10px">消耗材料与银两，提升装备属性。强化不会消耗词条，+5以上有失败风险但不掉阶。</div>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:10px;flex-wrap:wrap">
        <span style="color:rgba(200,180,120,.6);font-size:10px">💰 银两：${SilverManager.get()} 两</span>
        ${['item_iron_ore','item_refined_iron','item_xuantie'].map(mid=>{
          const m = ENHANCE_MAT_NAMES[mid];
          const qty = (typeof craftBagGetMergedQty === 'function') ? craftBagGetMergedQty(mid) : 0;
          return `<span style="color:rgba(200,180,120,.6);font-size:10px">${m.icon}${m.name}：${qty}</span>`;
        }).join('')}
      </div>
  `;

  const RL = {mythic:'神器',legendary:'传说',epic:'史诗',rare:'精良',uncommon:'精品',common:'凡品'};
  const RC = {mythic:'#fff',legendary:'#ffd060',epic:'#c080f0',rare:'#60c0ff',uncommon:'#80e080',common:'#c8b888'};

  if (equipItems.length === 0) {
    bodyHtml += `
      <div style="text-align:center;padding:30px 0;color:rgba(180,160,100,.5)">
        <div style="font-size:28px;margin-bottom:8px">📦</div>
        <div>背包中没有可强化的装备</div>
      </div>
    `;
  } else {
    bodyHtml += `<div style="display:flex;flex-direction:column;gap:8px">`;
    equipItems.forEach(inst => {
      const tpl = inst.type === 'weapon'
        ? (typeof WEAPONS !== 'undefined' ? WEAPONS.find(w=>w.id===inst.templateId) : null)
        : (typeof COSTUMES !== 'undefined' ? COSTUMES.find(c=>c.id===inst.templateId) : null);
      if (!tpl) return;

      const lv = getEnhLv(inst);
      const cfg = lv < 10 ? ENHANCE_CONFIG[lv] : null;
      const color = RC[tpl.rarity] || '#c8b888';
      const rarLabel = RL[tpl.rarity] || '';
      const bonus = calcEnhBonus(inst);
      const isEquipped = (inst.type==='weapon' && edS.weaponInstId===inst.instId)
                      || (inst.type==='costume' && edS.costumeInstId===inst.instId);

      // 强化等级展示（彩色）
      const lvColor = lv>=8?'#ffd060':lv>=5?'#ff8040':lv>=3?'#80e080':'rgba(200,180,120,.6)';
      const lvLabel = lv > 0 ? `<span style="color:${lvColor};font-weight:900"> +${lv}</span>` : '';

      // 材料是否足够
      let canEnhance = false, matOk = false, silverOk = false;
      let matName='', matIcon='', matQty=0, matNeed=0, cost=0, successPct=100;
      if(cfg){
        const matMeta = ENHANCE_MAT_NAMES[cfg.mat];
        matName = matMeta?.name || cfg.mat;
        matIcon = matMeta?.icon || '🔹';
        matQty = (typeof craftBagGetMergedQty === 'function') ? craftBagGetMergedQty(cfg.mat) : 0;
        matNeed = cfg.matQty;
        cost = cfg.silver;
        successPct = Math.round(cfg.successRate * 100);
        matOk = matQty >= matNeed;
        silverOk = SilverManager.has(cost);
        canEnhance = matOk && silverOk;
      }

      // 当前bonus展示
      const bonusLine = lv > 0
        ? `<div style="font-size:9px;color:#80e0a0;margin-top:2px">强化加成：攻+${bonus.atk} / 防+${bonus.def} / 血+${bonus.hp}</div>`
        : '';

      bodyHtml += `
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(${lv>=5?'255,160,40':'200,180,120'},.15);border-radius:8px;padding:8px 10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="font-size:18px;min-width:24px;text-align:center;color:${color}">${inst.type==='weapon'?'⚔️':'🛡️'}</div>
            <div style="flex:1;min-width:0">
              <div style="color:${color};font-size:11px">
                ${tpl.name}${lvLabel}
                <span style="color:${color};font-size:8px;margin-left:4px">【${rarLabel}】</span>
                ${isEquipped?'<span style="color:#80ff90;font-size:8px"> ✓</span>':''}
              </div>
              ${bonusLine}
            </div>
            <div style="text-align:right;font-size:9px;color:rgba(200,180,120,.5)">${lv}/10阶</div>
          </div>
          ${cfg ? `
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <div style="flex:1;font-size:9px;color:rgba(200,180,120,.65)">
              ${matIcon}${matName}×${matNeed}
              <span style="color:${matOk?'#80e080':'#ff8060'}">（有${matQty}）</span>
              · 💰${cost}两
              <span style="color:${silverOk?'#80e080':'#ff8060'}">（${silverOk?'足':'不足'}）</span>
              ${successPct < 100 ? `· <span style="color:#ffaa40">成功率${successPct}%</span>` : ''}
              · 强化后：攻+${ENHANCE_CONFIG[lv].perAtk} 防+${ENHANCE_CONFIG[lv].perDef} 血+${ENHANCE_CONFIG[lv].perHp}
            </div>
            ${canEnhance
              ? `<button onclick="doNpcEnhance('${inst.instId}')" style="background:rgba(255,120,20,.25);border:1px solid rgba(255,160,40,.6);color:#ffb060;padding:5px 12px;border-radius:6px;font-size:10px;cursor:pointer;white-space:nowrap">⚒️ 强化 +${lv+1}</button>`
              : `<button disabled style="background:rgba(80,80,80,.1);border:1px solid rgba(100,100,100,.2);color:rgba(150,150,150,.4);padding:5px 12px;border-radius:6px;font-size:10px;white-space:nowrap">${!matOk?'材料不足':'银两不足'}</button>`
            }
          </div>
          ` : `<div style="text-align:center;font-size:10px;color:#ffd060;padding:4px">✦ 已达满阶 +10，装备已臻完美！</div>`}
        </div>
      `;
    });
    bodyHtml += `</div>`;
  }

  bodyHtml += `<div style="margin-top:14px"><button id="enh-mat-toggle" onclick="toggleEnhanceMaterials()" style="background:rgba(255,200,80,.12);border:1px solid rgba(255,200,80,.25);color:#ffd060;padding:7px 16px;border-radius:6px;font-size:11px;cursor:pointer;width:100%;margin-bottom:8px">🪙 购买强化材料</button></div>
    <div id="enh-mat-shop" style="display:none;background:rgba(255,180,60,.05);border:1px solid rgba(255,180,60,.12);border-radius:8px;padding:10px 12px;margin-bottom:8px">
      <div style="color:rgba(200,170,80,.5);font-size:10px;margin-bottom:8px">以下材料可在铁匠处直接购买，用于强化装备</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[
          {mid:'item_iron_ore',     icon:'🪨', name:'铁矿石',   price:18, desc:'基础强化材料'},
          {mid:'item_refined_iron', icon:'⚙️', name:'精铁',     price:65, desc:'进阶强化材料'},
          {mid:'item_xuantie',      icon:'🌑', name:'玄铁',     price:180, desc:'高阶强化材料'},
        ].map(m=>`<div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:16px;min-width:20px;text-align:center">${m.icon}</span>
          <div style="flex:1;min-width:0">
            <div style="color:rgba(220,190,110,.9);font-size:11px">${m.name}</div>
            <div style="color:rgba(160,140,80,.5);font-size:9px">${m.desc}</div>
          </div>
          <span style="color:#ffd060;font-size:10px">💰${m.price}两</span>
          <button onclick="buyEnhanceMaterial('${m.mid}',${m.price})" style="background:rgba(255,180,60,.18);border:1px solid rgba(255,180,60,.4);color:#ffd060;padding:4px 10px;border-radius:5px;font-size:10px;cursor:pointer">购买</button>
        </div>`).join('')}
      </div>
    </div>
    <div style="margin-top:14px;text-align:center"><button onclick="closeNpcEnhancePanel()" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(200,180,120,.6);padding:6px 20px;border-radius:6px;font-size:11px;cursor:pointer">返回</button></div></div>`;

  const overlay = document.createElement('div');
  overlay.id = 'npc-enhance-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `
    <div style="background:linear-gradient(180deg,#1c1510 0%,#0e0a08 100%);border:1px solid rgba(255,160,40,.25);border-radius:12px;max-width:380px;width:100%;max-height:82vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.6)">
      <div style="padding:12px 16px;border-bottom:1px solid rgba(255,160,40,.12);display:flex;align-items:center;justify-content:space-between">
        <span style="color:#ffb060;font-size:13px;font-weight:bold">${title}</span>
        <span onclick="closeNpcEnhancePanel()" style="color:rgba(200,180,120,.5);cursor:pointer;font-size:18px;line-height:1">&times;</span>
      </div>
      <div id="npc-enhance-body">${bodyHtml}</div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ════════════════════════════════════════════════════════════
// 修理装备面板
// ════════════════════════════════════════════════════════════
function showNpcRepairPanel() {
  const equipItems = (edS.bag || []).filter(i =>
    i._dur !== undefined && i._dur !== null &&
    (i.type === 'weapon' || i.type === 'costume') && i.identified !== false
  );
  // 按耐久比例排序（最差的在前面）
  equipItems.sort((a, b) => {
    const ra = (a._dur || 0) / (getEquipMaxDur(a) || 1);
    const rb = (b._dur || 0) / (getEquipMaxDur(b) || 1);
    return ra - rb;
  });

  const RL = {mythic:'神器',legendary:'传说',epic:'史诗',rare:'精良',uncommon:'精品',common:'凡品'};
  const RC = {mythic:'#fff',legendary:'#ffd060',epic:'#c080f0',rare:'#60c0ff',uncommon:'#80e080',common:'#c8b888'};
  const silver = (typeof getSilver === 'function') ? getSilver() : (edS.silver || 0);

  let bodyHtml = `
    <div style="padding:12px 8px;font-size:11px">
      <div style="background:rgba(80,140,200,.08);border:1px solid rgba(100,200,255,.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;color:#88ccff">
        <div style="font-size:12px;margin-bottom:4px">🔧 铁匠修理台</div>
        <div style="color:rgba(160,200,255,.7);font-size:10px">装备耐久越低，战斗属性越弱。耐久耗尽则完全失效，请及时修理。</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span style="color:rgba(200,180,120,.6);font-size:10px">💰 银两：${silver} 两</span>
        <button onclick="doNpcRepairAll()" style="background:rgba(80,160,200,.18);border:1px solid rgba(100,200,255,.4);color:#88ccff;padding:5px 14px;border-radius:6px;font-size:10px;cursor:pointer">🔧 全部修理</button>
      </div>
  `;

  if (equipItems.length === 0) {
    bodyHtml += `
      <div style="text-align:center;padding:30px 0;color:rgba(180,160,100,.5)">
        <div style="font-size:28px;margin-bottom:8px">🛡️</div>
        <div>所有装备耐久完好，无需修理</div>
      </div>
    `;
  } else {
    bodyHtml += `<div style="display:flex;flex-direction:column;gap:8px">`;
    equipItems.forEach(inst => {
      const tpl = inst.type === 'weapon'
        ? (typeof WEAPONS !== 'undefined' ? WEAPONS.find(w=>w.id===inst.templateId) : null)
        : (typeof COSTUMES !== 'undefined' ? COSTUMES.find(c=>c.id===inst.templateId) : null);
      if (!tpl) return;

      const ratio = getEquipDurRatio(inst);
      const { label, color, icon } = getEquipDurLabel(inst);
      const dur = getEquipDur(inst);
      const maxDur = getEquipMaxDur(inst);
      const { cost, durToRepair } = calcRepairCost(inst);
      const rarLabel = RL[tpl.rarity] || '';
      const itemColor = RC[tpl.rarity] || '#c8b888';
      const isEquipped = (inst.type==='weapon' && edS.weaponInstId===inst.instId)
                      || (inst.type==='costume' && edS.costumeInstId===inst.instId);

      const barWidth = Math.round(ratio * 56);
      const canAfford = silver >= cost && cost > 0;

      bodyHtml += `
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(100,200,255,.12);border-radius:8px;padding:8px 10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
            <div style="font-size:18px;min-width:24px;text-align:center;color:${itemColor}">${inst.type==='weapon'?'⚔️':'🛡️'}</div>
            <div style="flex:1;min-width:0">
              <div style="color:${itemColor};font-size:11px">
                ${tpl.name}
                <span style="color:${itemColor};font-size:8px;margin-left:4px">【${rarLabel}】</span>
                ${isEquipped?'<span style="color:#80ff90;font-size:8px"> ✓已穿戴</span>':''}
              </div>
              <div style="display:flex;align-items:center;gap:4px;margin-top:3px">
                <div style="width:56px;height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
                  <div style="width:${barWidth}px;height:100%;background:${color};border-radius:3px;transition:width .3s;"></div>
                </div>
                <span style="font-size:9px;color:${color};white-space:nowrap">${dur}/${maxDur}</span>
                <span style="font-size:9px;color:${color};margin-left:2px">${icon}</span>
              </div>
            </div>
            ${canAfford
              ? `<button onclick="doNpcRepairOne('${inst.instId}')" style="background:rgba(80,160,200,.22);border:1px solid rgba(100,200,255,.5);color:#88ccff;padding:5px 10px;border-radius:6px;font-size:10px;cursor:pointer;white-space:nowrap">修理 💰${cost}两</button>`
              : cost === 0
                ? `<span style="font-size:10px;color:#80e080;white-space:nowrap">${icon} 完好</span>`
                : `<span style="font-size:10px;color:#ff6060;white-space:nowrap">💰不足（需${cost}两）</span>`
            }
          </div>
        </div>
      `;
    });
    bodyHtml += `</div>`;
  }

  bodyHtml += `<div style="margin-top:14px;text-align:center"><button onclick="closeNpcRepairPanel()" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(200,180,120,.6);padding:6px 20px;border-radius:6px;font-size:11px;cursor:pointer">返回</button></div></div>`;

  const overlay = document.createElement('div');
  overlay.id = 'npc-repair-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `
    <div style="background:linear-gradient(180deg,#1a1820 0%,#0e0c10 100%);border:1px solid rgba(100,200,255,.25);border-radius:12px;max-width:380px;width:100%;max-height:82vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.6)">
      <div style="padding:12px 16px;border-bottom:1px solid rgba(100,200,255,.12);display:flex;align-items:center;justify-content:space-between">
        <span style="color:#88ccff;font-size:13px;font-weight:bold">🔧 修理装备</span>
        <span onclick="closeNpcRepairPanel()" style="color:rgba(200,180,120,.5);cursor:pointer;font-size:18px;line-height:1">&times;</span>
      </div>
      <div id="npc-repair-body">${bodyHtml}</div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// 单件修理
function doNpcRepairOne(instId) {
  const inst = (edS.bag || []).find(i => i.instId === instId);
  if (!inst) { showToast('装备未找到', 'warn'); return; }
  const npcId = typeof _npcCur !== 'undefined' ? _npcCur?.id : null;
  const result = repairEquipAtBlacksmith(inst, npcId || 'blacksmith');
  if (!result.ok) {
    showToast(result.msg, 'warn');
    return;
  }
  showToast(`🔧 修理完成，耐久恢复至 ${result.newDur}/${result.maxDur}，消耗 ${result.cost} 两`, 'info');
  // 刷新面板
  const body = document.getElementById('npc-repair-body');
  if (body) {
    // 简单刷新整个面板
    closeNpcRepairPanel();
    setTimeout(() => showNpcRepairPanel(), 100);
  }
}

// 全部修理
function doNpcRepairAll() {
  const npcId = typeof _npcCur !== 'undefined' ? _npcCur?.id : null;
  const result = repairAllAtBlacksmith(npcId || 'blacksmith');
  if (!result.ok) {
    showToast(result.msg, 'warn');
    return;
  }
  showToast(`🔧 全部修理完成（${result.count}件），消耗 ${result.totalCost} 两`, 'info');
  closeNpcRepairPanel();
  setTimeout(() => showNpcRepairPanel(), 100);
}

function closeNpcRepairPanel() {
  const el = document.getElementById('npc-repair-overlay');
  if (el) el.remove();
}

function closeNpcEnhancePanel(){
  const el = document.getElementById('npc-enhance-overlay');
  if(el) el.remove();
}

function doNpcEnhance(instId){
  const inst = (edS.bag || []).find(i => i.instId === instId);
  if(!inst){ showToast('装备不存在！'); return; }

  const lv = getEnhLv(inst);
  if(lv >= 10){ showToast('✦ 此装备已达满阶！'); return; }

  const cfg = ENHANCE_CONFIG[lv];
  if(!cfg){ showToast('强化配置错误'); return; }

  // 检查材料
  const matQty = (typeof craftBagGetMergedQty === 'function') ? craftBagGetMergedQty(cfg.mat) : 0;
  if(matQty < cfg.matQty){
    const m = ENHANCE_MAT_NAMES[cfg.mat];
    showToast(`❌ ${m.icon}${m.name}不足（需${cfg.matQty}，有${matQty}）`);
    return;
  }
  // 检查银两
  if(!SilverManager.has(cfg.silver)){
    showToast(`❌ 银两不足（需${cfg.silver}两）`);
    return;
  }

  // 扣材料和银两
  if(typeof craftBagConsumeMerged === 'function'){
    craftBagConsumeMerged(cfg.mat, cfg.matQty);
  }
  SilverManager.add(-cfg.silver);
  SilverManager.save();

  const tpl = inst.type==='weapon'
    ? (typeof WEAPONS!=='undefined' ? WEAPONS.find(w=>w.id===inst.templateId) : null)
    : (typeof COSTUMES!=='undefined' ? COSTUMES.find(c=>c.id===inst.templateId) : null);
  const tplName = tpl ? tpl.name : '装备';

  // 判断是否成功
  if(Math.random() < cfg.successRate){
    // 成功
    inst._enhLv = lv + 1;
    if(typeof bagSave === 'function') bagSave();
    const bonus = calcEnhBonus(inst);
    showToast(`✨ 强化成功！${tplName} 升至 +${inst._enhLv}！攻+${bonus.atk} 防+${bonus.def} 血+${bonus.hp}`, 'good');
    if(typeof playAudio === 'function') playAudio('forge');
    // 满阶特效
    if(inst._enhLv === 10){
      setTimeout(()=> showToast(`🔥 ${tplName} 达到满阶 +10！装备已臻化境！`, 'good', 4000), 600);
    }
  } else {
    // 失败（不掉阶）
    showToast(`💥 强化失败！${tplName} 保持 +${lv} 阶，材料已消耗。`, 'warn');
    if(typeof playAudio === 'function') playAudio('identify');
  }

  // 刷新面板
  closeNpcEnhancePanel();
  setTimeout(showNpcEnhancePanel, 200);
  // 刷新背包
  if(typeof travelRenderIndex === 'function') travelRenderIndex();
}

// 切换材料商店显隐
function toggleEnhanceMaterials(){
  var el = document.getElementById('enh-mat-shop');
  if(!el) return;
  var shown = el.style.display !== 'none';
  el.style.display = shown ? 'none' : 'block';
  var btn = document.getElementById('enh-mat-toggle');
  if(btn) btn.textContent = shown ? '🪙 购买强化材料' : '✕ 收起材料';
}

// 购买强化材料（添加到合成背包）
function buyEnhanceMaterial(mid, price){
  if(typeof SilverManager === 'undefined' || !SilverManager){
    showToast('银两系统未加载', 'err'); return;
  }
  if(!SilverManager.has(price)){
    showToast('💰 银两不足！需要 ' + price + ' 两', 'err'); return;
  }
  SilverManager.spend(price);
  SilverManager.save();
  if(typeof craftBagAdd === 'function'){
    craftBagAdd(mid);
  } else if(typeof addCraftMaterial === 'function'){
    addCraftMaterial(mid);
  } else {
    if(typeof edS !== 'undefined' && Array.isArray(edS.bag)){
      var instId = Date.now() + '_mat';
      edS.bag.push({ instId: instId, templateId: mid, type:'material', identified:true, quantity:1 });
      if(typeof bagSave === 'function') bagSave();
    }
  }
  var matNames = {'item_iron_ore':'铁矿石','item_refined_iron':'精铁','item_xuantie':'玄铁'};
  showToast('✅ 购买了 ' + (matNames[mid]||mid) + ' ×1（-' + price + '两）', 'good');
  closeNpcEnhancePanel();
  setTimeout(showNpcEnhancePanel, 150);
  if(typeof townRefreshBar === 'function') townRefreshBar();
  else if(typeof travelRefreshBar === 'function') travelRefreshBar();
}

window.showNpcEnhancePanel  = showNpcEnhancePanel;
window.closeNpcEnhancePanel = closeNpcEnhancePanel;
window.doNpcEnhance         = doNpcEnhance;
window.calcEnhBonus         = calcEnhBonus;
window.getEnhLv             = getEnhLv;
window.toggleEnhanceMaterials = toggleEnhanceMaterials;
window.buyEnhanceMaterial    = buyEnhanceMaterial;
window.npcBuyItem     = npcBuyItem;
window.npcRelAction   = npcRelAction;
window.showToast      = showToast;

// ════════════════════════════════════════════════════
//  小游戏任务钩子
//  供 minigame-escort / minigame-fishing / minigame-cricket 调用
// ════════════════════════════════════════════════════

/**
 * 押镖成功后调用
 * @param {string} routeId  刚完成的路线ID（如 'route_cangzhou_kaifeng'）
 * @param {string} terrain  路线地形（'平原'/'山地'/'水乡'等）
 */
function onEscortQuestCheck(routeId, terrain){
  if(typeof QUEST_DB === 'undefined') return;
  npcStateLoad();
  let anyDone = false;
  Object.values(QUEST_DB).forEach(q => {
    if(q.type !== 'escort') return;
    if(getQuestStatus(q.id) !== 'active') return;

    // 地形限制
    if(q.targetTerrain && q.targetTerrain !== terrain) return;
    // 路线限制
    if(q.targetRoute && q.targetRoute !== routeId) return;

    // 累计进度（存在 npcState 中）
    if(!npcState._escortProgress) npcState._escortProgress = {};
    npcState._escortProgress[q.id] = (npcState._escortProgress[q.id] || 0) + 1;
    const progress = npcState._escortProgress[q.id];
    const need = q.targetCount || 1;

    if(progress >= need){
      setQuestStatus(q.id, 'done');
      npcState._escortProgress[q.id] = need; // 锁定不超量
      showToast(`📋 任务完成：${q.name} → 回去找委托人领取奖励`);
      anyDone = true;
    } else {
      showToast(`📋 押镖任务进度：${q.name} ${progress}/${need}`);
    }
  });

  // ── 赏金护送进度 ──
  const bounties = (npcState._dailyBounties || []);
  bounties.forEach(b => {
    if(b.type !== 'escort') return;
    const instId = b.instanceId;
    if(getQuestStatus(instId) !== 'active') return;
    if(!npcState.quests) npcState.quests = {};
    const progKey = instId + '_prog';
    const prog    = (npcState.quests[progKey] || 0) + 1;
    npcState.quests[progKey] = prog;
    npcStateSave();
    setQuestStatus(instId, 'done');
    showToast(`🏆 赏金完成：${b.nameTpl} → 可领取赏金！`);
    anyDone = true;
  });

  if(anyDone) npcStateSave();
}

/**
 * 钓鱼成功钓到一条鱼后调用
 * @param {string} fishId  鱼的ID（如 'carp'）
 * @param {number} qty     本次钓到数量（通常1）
 */
function onFishingQuestCheck(fishId, qty){
  qty = qty || 1;
  if(typeof QUEST_DB === 'undefined') return;
  npcStateLoad();
  let anyDone = false;
  Object.values(QUEST_DB).forEach(q => {
    if(q.type !== 'fishing') return;
    if(getQuestStatus(q.id) !== 'active') return;

    // 鱼种限制（null = 任意鱼均可）
    if(q.targetFish && q.targetFish !== fishId) return;

    // 累计进度
    if(!npcState._fishingProgress) npcState._fishingProgress = {};
    npcState._fishingProgress[q.id] = (npcState._fishingProgress[q.id] || 0) + qty;
    const progress = npcState._fishingProgress[q.id];
    const need = q.targetCount || 1;

    if(progress >= need){
      setQuestStatus(q.id, 'done');
      npcState._fishingProgress[q.id] = need;
      showToast(`📋 任务完成：${q.name} → 回去找委托人领取奖励`);
      anyDone = true;
    } else {
      showToast(`📋 钓鱼任务进度：${q.name} ${progress}/${need}`);
    }
  });

  // ── 赏金钓鱼进度 ──
  const bounties = (npcState._dailyBounties || []);
  bounties.forEach(b => {
    if(b.type !== 'fishing') return;
    const instId = b.instanceId;
    if(getQuestStatus(instId) !== 'active') return;
    if(!npcState.quests) npcState.quests = {};
    const progKey = instId + '_prog';
    const prog    = (npcState.quests[progKey] || 0) + qty;
    npcState.quests[progKey] = prog;
    const need = b.qty || 1;
    if(prog >= need){
      npcState.quests[progKey] = need;
      npcStateSave();
      setQuestStatus(instId, 'done');
      showToast(`🏆 赏金完成：${b.nameTpl} → 可领取赏金！`);
    } else {
      showToast(`🎣 赏金进度：${prog}/${need} — ${b.nameTpl}`);
    }
    anyDone = true;
  });

  if(anyDone) npcStateSave();
}

/**
 * 蛐蛐胜利后调用
 * @param {boolean} won  是否获胜
 */
function onCricketQuestCheck(won){
  if(!won) return;
  if(typeof QUEST_DB === 'undefined') return;
  npcStateLoad();
  let anyDone = false;
  Object.values(QUEST_DB).forEach(q => {
    if(q.type !== 'cricket') return;
    if(getQuestStatus(q.id) !== 'active') return;

    // 累计胜场
    if(!npcState._cricketProgress) npcState._cricketProgress = {};
    npcState._cricketProgress[q.id] = (npcState._cricketProgress[q.id] || 0) + 1;
    const wins = npcState._cricketProgress[q.id];
    const need = q.targetWins || 1;

    if(wins >= need){
      setQuestStatus(q.id, 'done');
      npcState._cricketProgress[q.id] = need;
      showToast(`📋 任务完成：${q.name} → 回去找委托人领取奖励`);
      anyDone = true;
    } else {
      showToast(`📋 斗蛐蛐任务进度：${q.name} ${wins}/${need}`);
    }
  });

  // ── 赏金斗蛐蛐进度 ──
  const bounties = (npcState._dailyBounties || []);
  bounties.forEach(b => {
    if(b.type !== 'cricket') return;
    const instId = b.instanceId;
    if(getQuestStatus(instId) !== 'active') return;
    if(!npcState.quests) npcState.quests = {};
    const progKey = instId + '_wins';
    const wins    = (npcState.quests[progKey] || 0) + 1;
    npcState.quests[progKey] = wins;
    const need = b.wins || 3;
    if(wins >= need){
      npcState.quests[progKey] = need;
      npcStateSave();
      setQuestStatus(instId, 'done');
      showToast(`🏆 赏金完成：${b.nameTpl} → 可领取赏金！`);
    } else {
      showToast(`🦗 赏金进度：${wins}/${need}胜 — ${b.nameTpl}`);
    }
    anyDone = true;
  });

  if(anyDone) npcStateSave();
}

window.onEscortQuestCheck  = onEscortQuestCheck;
window.onFishingQuestCheck = onFishingQuestCheck;
window.onCricketQuestCheck = onCricketQuestCheck;


// ══════════════════════════════════════════════════════════════════
//  ② 情境触发任务系统
//  当玩家处于特定情境（城市/地下城/物品/等级等）时自动出现任务
//  任务实例存入 npcState.contextualQuests，与 QUEST_DB 格式兼容
// ══════════════════════════════════════════════════════════════════

/**
 * 情境任务模板库
 * 格式与 QUEST_DB 兼容，增加以下字段：
 *  trigger.city     到达此城市ID时触发（null=任意城市）
 *  trigger.dungeon  进入此地下城时触发（null=任意地下城）
 *  trigger.level    升级到>=此等级时触发
 *  trigger.firstAction  首次完成此动作时触发（fishing/kill/escort/cricket/forge/smelt/craft/collect）
 *  trigger.item     背包中持有此物品ID时触发
 *  trigger.npcCity  在此城市的NPC对话时触发
 *  once             true=触发一次后不再出现
 *  expireDays       过期天数（从触发开始计算），null=不自动过期
 */
const CONTEXTUAL_QUEST_DB = {

  // ════════════════════════════════════════════
  //  A. 城市专属情境任务（进入某城市时触发）
  // ════════════════════════════════════════════

  // 洛阳：听说城北废墟闹鬼，有人在附近失踪
  ctx_luoyang_haunted: {
    id: 'ctx_luoyang_haunted', name: '【情境】废墟鬼影',
    icon: '👻', type: 'talk',
    desc: '洛阳城的茶馆里有人议论：城北那座废弃宅院，最近夜里总有异响，还有人说见过白影出没。是真是假，去看看便知。',
    reward: { silver: 35, exp: 40, rel: 20 },
    rewardText: '35两 + 经验 + 好感',
    issuerNpcId: 'ctx_luoyang_ghost',
    // 触发条件
    trigger: { city: 'luoyang' },
    // 触发一次后不再出现
    once: true,
    // 该任务目标：找洛阳医馆NPC对话
    targetNpcId: 'kaifeng_doctor', // 动态分配
    targetCityId: 'luoyang',
    targetName: '废墟探查',
    // 送达类：travel一次即完成
  },

  // 开封：江湖传闻城中来了位神秘剑客
  ctx_kaifeng_swordsman: {
    id: 'ctx_kaifeng_swordsman', name: '【情境】神秘剑客',
    icon: '⚔️', type: 'combat',
    desc: '开封酒肆里人声鼎沸，据说最近来了一位来历不明的剑客，逢人便挑战，剑法凌厉，已连胜数场。江湖人称"断魂剑"。你若有兴趣，不妨去会会他。',
    reward: { silver: 60, exp: 80, rel: 25 },
    rewardText: '60两 + 80经验 + 好感',
    issuerNpcId: 'ctx_kaifeng_blade',
    trigger: { city: 'kaifeng' },
    once: true,
    minLevel: 15,
    // 目标：与某NPC切磋
  },

  // 扬州：听说瘦西湖边有人遗落了一把名剑
  ctx_yangzhou_lakesword: {
    id: 'ctx_yangzhou_lakesword', name: '【情境】湖畔名剑',
    icon: '🗡', type: 'fetch',
    desc: '有渔夫在瘦西湖边撒网时，网到一把造型古朴的长剑，剑身上隐约刻着字。消息传开，江湖人士纷纷前往打探。这剑究竟是何来历？',
    reward: { silver: 50, exp: 50, item: 'item_wep_rare_1' },
    rewardText: '50两 + 经验 + 随机武器×1',
    issuerNpcId: 'ctx_yangzhou_fisher',
    trigger: { city: 'yangzhou' },
    once: true,
    minLevel: 10,
    // 目标：去瘦西湖（附近地下城）探索
  },

  // 沧州：听说城外有处矿脉最近有流寇出没
  ctx_cangzhou_bandits: {
    id: 'ctx_cangzhou_bandits', name: '【情境】矿脉流寇',
    icon: '⛏', type: 'kill',
    desc: '沧州铁匠铺最近原料紧张——城外那处铁矿脉被一群流寇占据了，官府暂时无力清剿。有铁匠私下悬赏，请江湖人士出手。',
    reward: { silver: 55, exp: 45, rel: 30 },
    rewardText: '55两 + 铁匠好感',
    issuerNpcId: 'cangzhou_smith',
    trigger: { city: 'cangzhou' },
    once: true,
    targetItemId: 'item_iron_ore',
    targetName: '铁矿',
    targetCount: 5,
    // 触发后自动激活击杀类
  },

  // 杭州：西湖边每逢月圆之夜有乐声飘来
  ctx_hangzhou_lotus: {
    id: 'ctx_hangzhou_lotus', name: '【情境】月夜乐声',
    icon: '🎵', type: 'talk',
    desc: '有船夫说，每到月圆之夜，西湖深处便传来悠扬琴声，有时甚至能看到湖心有小舟漂浮。那琴声听着不像凡俗之物……',
    reward: { silver: 40, exp: 55, rel: 20 },
    rewardText: '40两 + 55经验 + 桃花岛线索',
    issuerNpcId: 'ctx_hangzhou_boatman',
    trigger: { city: 'hangzhou' },
    once: true,
    minLevel: 20,
    // 与杭州客栈NPC对话触发
  },

  // 苏州：听说城内最近有位女子高价收购各类药材
  ctx_suzhou_herb_buyer: {
    id: 'ctx_suzhou_herb_buyer', name: '【情境】神秘收药女',
    icon: '🌿', type: 'deliver',
    desc: '苏州街头最近出现了一位戴着帷帽的女子，出手阔绰，专收珍稀草药。有同行认出她是五毒教的人，但她为何出现在苏州，便不得而知了……',
    reward: { silver: 80, exp: 40, rel: 15 },
    rewardText: '80两 + 五毒教线索',
    issuerNpcId: 'ctx_suzhou_wudou',
    trigger: { city: 'suzhou' },
    once: true,
    minRel: 10,
  },

  // 大理：城中正在举办一年一度的药材集市
  ctx_dali_herb_fair: {
    id: 'ctx_dali_herb_fair', name: '【情境】大理药集',
    icon: '🏮', type: 'fetch',
    desc: '大理城正逢一年一度的药材集市，四方药商云集，珍稀药材应有尽有。若需采购，这是绝佳时机。集市上还有一项活动：展示你最珍稀的药材，有神秘大奖。',
    reward: { silver: 30, exp: 30, item: 'item_herb_qi' },
    rewardText: '30两 + 百年灵芝×1',
    issuerNpcId: 'ctx_dali_merchant',
    trigger: { city: 'dali' },
    once: false, // 每年药集都开
    minLevel: 5,
  },

  // 成都：听说城外有处古迹 recently 出土了什么
  ctx_chengdu_ruins: {
    id: 'ctx_chengdu_ruins', name: '【情境】古迹探秘',
    icon: '🏛', type: 'fetch',
    desc: '成都城外有一处古迹，据说是古蜀国遗址。最近有农夫耕地时挖出了一些造型奇特的陶片，引来不少考古者前往探查。你若感兴趣，不妨去看看。',
    reward: { silver: 45, exp: 50, rel: 15 },
    rewardText: '45两 + 50经验 + 古董×1',
    issuerNpcId: 'ctx_chengdu_farmer',
    trigger: { city: 'chengdu' },
    once: true,
    minLevel: 8,
  },

  // 福州：听说有海商高价收购海外珍品
  ctx_fuzhou_trade: {
    id: 'ctx_fuzhou_trade', name: '【情境】海商悬赏',
    icon: '⚓', type: 'fetch',
    desc: '福州港最近来了一艘波斯商船，船上的海商四处打听"海外奇珍"的下落，据说出的价钱极为丰厚。他还在城里张贴了悬赏令……',
    reward: { silver: 100, exp: 60, rel: 20 },
    rewardText: '100两 + 海商好感',
    issuerNpcId: 'fuzhou_merchant',
    trigger: { city: 'fuzhou' },
    once: false,
    minLevel: 15,
    minRel: 5,
  },

  // 嵩山：少林寺正在举办武林大会的选拔
  ctx_songshan_selection: {
    id: 'ctx_songshan_selection', name: '【情境】少林选拔',
    icon: '🥋', type: 'combat',
    desc: '嵩山少林寺传出消息：三年一度的武林新秀选拔即将开始，各派青年高手均可参加。胜出者不仅能扬名立万，更有少林绝技相授。',
    reward: { silver: 80, exp: 100, rel: 40 },
    rewardText: '80两 + 100经验 + 少林好感',
    issuerNpcId: 'ctx_songshan_monk',
    trigger: { city: 'songshan' },
    once: false,
    minLevel: 20,
    reqSect: false, // 不要求少林弟子，但少林弟子奖励更高
  },

  // 襄阳：听说城里来了位说书先生，讲了一个惊天大秘密
  ctx_xiangyang_storyteller: {
    id: 'ctx_xiangyang_storyteller', name: '【情境】说书惊堂',
    icon: '📖', type: 'talk',
    desc: '襄阳城来了位说书先生，所到之处座无虚席。他讲的故事非同寻常——据说他掌握了一个关于血骨门余孽藏身之处的绝密情报。但此人来去无踪，想找他得碰运气……',
    reward: { silver: 50, exp: 60, intel: 'intel_xuegu_whereabouts' },
    rewardText: '50两 + 60经验 + 绝密情报',
    issuerNpcId: 'ctx_xiangyang_story',
    trigger: { city: 'xiangyang' },
    once: true,
    minLevel: 25,
  },

  // 长安：皇城脚下有位老者出售一种奇怪的东西
  ctx_changan_oldman: {
    id: 'ctx_changan_oldman', name: '【情境】皇城奇货',
    icon: '🎁', type: 'deliver',
    desc: '长安皇城根下，有位衣衫褴褛的老者支着一个小摊，售卖一些来路不明的"奇货"。据说只要你买了他一样东西，他就会告诉你一个惊天秘密。',
    reward: { silver: 0, exp: 80, intel: 'intel_tianjiling' },
    rewardText: '武学指点 + 80经验 + 天机令线索',
    issuerNpcId: 'ctx_changan_stranger',
    trigger: { city: 'changan' },
    once: true,
    minLevel: 30,
  },

  // 幽州：听说北边长城外有异族骑兵出没
  ctx_yanzhou_border: {
    id: 'ctx_yanzhou_border', name: '【情境】边关烽火',
    icon: '🔥', type: 'kill',
    desc: '幽州城防官近日眉头紧锁——据斥候回报，长城以外有异族骑兵活动的迹象。这些人装备精良，来去如风，不知意欲何为。他急需有人出城侦查。',
    reward: { silver: 90, exp: 70, rel: 35, fame: 10 },
    rewardText: '90两 + 70经验 + 边关好感 + 10声望',
    issuerNpcId: 'ctx_yanzhou_general',
    trigger: { city: 'yanzhou' },
    once: false,
    minLevel: 25,
    // 击杀特定敌人类型
    targetType: 'barbarian',
    targetCount: 3,
  },

  // 明州：港口停着一艘无人敢靠近的海船
  ctx_mingzhou_ghostship: {
    id: 'ctx_mingzhou_ghostship', name: '【情境】幽幽灵船',
    icon: '🚢', type: 'talk',
    desc: '明州港近日来了一艘孤零零的大船，桅杆上无帆，甲板上空无一人，却夜夜有灯火摇曳。渔民都说这是鬼船，不敢靠近。但据说船上可能有宝物……',
    reward: { silver: 70, exp: 90, rel: 20 },
    rewardText: '70两 + 90经验 + 航海图×1',
    issuerNpcId: 'ctx_mingzhou_sailor',
    trigger: { city: 'mingzhou' },
    once: true,
    minLevel: 20,
  },

  // ════════════════════════════════════════════
  //  B. 地下城专属情境任务（进入特定地下城时触发）
  // ════════════════════════════════════════════

  // 任意地下城首次进入：触发探索任务
  ctx_any_dungeon_first: {
    id: 'ctx_any_dungeon_first', name: '【情境】初探险地',
    icon: '🗺️', type: 'dungeon',
    desc: '险地入口近在眼前，里面刀光剑影，危机四伏。传说许多高手在此陨落，但也有人在其中发现了旷世秘籍与奇珍异宝。探索一番，或许有意想不到的收获。',
    reward: { silver: 20, exp: 30 },
    rewardText: '20两 + 30经验',
    trigger: { dungeon: '__ANY__' },
    firstAction: 'dungeon_enter',
    once: true,
    // 首次进入任意地下城后即完成
  },

  // ════════════════════════════════════════════
  //  C. 等级/里程碑情境任务
  // ════════════════════════════════════════════

  // 首次升级到Lv5：建议去地下城
  ctx_level5_enter_dungeon: {
    id: 'ctx_level5_enter_dungeon', name: '【情境】初涉险境',
    icon: '🌟', type: 'dungeon',
    desc: '你已升至5级！江湖险恶，但也是时候小试牛刀了。城外附近有几处险地，其中藏着山贼和野兽。去那里历练一番，说不定能找到趁手的装备。',
    reward: { silver: 15, exp: 50 },
    rewardText: '15两 + 50经验',
    trigger: { level: 5 },
    once: true,
    // 任意地下城进入一次即完成
  },

  // 升级到Lv10：建议加入门派
  ctx_level10_join_sect: {
    id: 'ctx_level10_join_sect', name: '【情境】拜入门派',
    icon: '🏯', type: 'talk',
    desc: '你已升至10级！单枪匹马闯江湖终究势单力薄。各大派正值招新之际，若能拜入门下，不仅能学到独门武学，更有师长师兄照应。去各大城市找找门派接引处吧。',
    reward: { silver: 30, exp: 80, rel: 30 },
    rewardText: '30两 + 80经验 + 门派好感',
    trigger: { level: 10 },
    once: true,
    // 与门派接引NPC对话即完成
  },

  // 升级到Lv20：提醒有挑战更强的敌人
  ctx_level20_elite: {
    id: 'ctx_level20_elite', name: '【情境】精英之约',
    icon: '⚡', type: 'kill',
    desc: 'Lv20！你已小有所成，普通的山贼流寇已不在话下。江湖传闻，更强大的精英怪物潜伏在各大险地深处，击败它们能获得更好的装备。此外，赏金榜上的精英赏金值得一试。',
    reward: { silver: 60, exp: 150 },
    rewardText: '60两 + 150经验',
    trigger: { level: 20 },
    once: true,
    targetTier: 'elite',
    targetCount: 1,
  },

  // 升级到Lv40：专属神兵线索
  ctx_level40_custom_weapon: {
    id: 'ctx_level40_custom_weapon', name: '【情境】名匠之约',
    icon: '🗡️', type: 'deliver',
    desc: 'Lv40！你的名号已在江湖上小有名气。传闻铸剑大师欧冶风隐居在某处，他专为有缘人铸造专属神兵。若想获得他的青睐，需先带去足够的珍稀材料，并展示你的实力。',
    reward: { silver: 100, exp: 200 },
    rewardText: '100两 + 200经验 + 专属武器线索',
    trigger: { level: 40 },
    once: true,
  },

  // ════════════════════════════════════════════
  //  D. 行为首次情境任务
  // ════════════════════════════════════════════

  // 首次钓鱼成功
  ctx_first_fishing: {
    id: 'ctx_first_fishing', name: '【情境】江湖第一竿',
    icon: '🎣', type: 'fetch',
    desc: '恭喜你首次钓到鱼！在江河湖海之畔，静静等待鱼儿上钩，是江湖人修身养性的好方法。渔获不仅可以果腹，有些珍稀鱼种还能卖个好价钱。',
    reward: { silver: 10, exp: 20, item: 'item_fish_basic' },
    rewardText: '10两 + 20经验 + 常见鱼×1',
    trigger: { firstAction: 'fishing' },
    once: true,
  },

  // 首次锻造成功
  ctx_first_forge: {
    id: 'ctx_first_forge', name: '【情境】初尝锻造',
    icon: '⚒️', type: 'fetch',
    desc: '你亲手锻造出了第一件装备！锻造之道，博大精深。收集更多矿石和图纸，就能打造出更强的兵器和护甲。厉害的铁匠在江湖中可是香饽饽。',
    reward: { silver: 20, exp: 30, item: 'item_wep_common_1' },
    rewardText: '20两 + 30经验 + 随机武器×1',
    trigger: { firstAction: 'forge' },
    once: true,
  },

  // 首次冶炼成功
  ctx_first_smelt: {
    id: 'ctx_first_smelt', name: '【情境】矿中真金',
    icon: '🪨', type: 'fetch',
    desc: '你成功冶炼出了第一块矿石精华！冶炼是锻造的基础，矿石品质越高，锻造的装备就越精良。多去险地探索，搜集各类珍稀矿石，是成为大师铁匠的必经之路。',
    reward: { silver: 15, exp: 25, item: 'item_iron_ore' },
    rewardText: '15两 + 25经验 + 铁矿×3',
    trigger: { firstAction: 'smelt' },
    once: true,
  },

  // 首次合成成功
  ctx_first_craft: {
    id: 'ctx_first_craft', name: '【情境】合成秘法',
    icon: '🧪', type: 'fetch',
    desc: '合成配方首次调配成功！江湖上流传着各种神秘配方，将不同材料按特定比例混合，便能产生意想不到的效果。更多配方隐藏在险地深处和古籍之中。',
    reward: { silver: 20, exp: 40 },
    rewardText: '20两 + 40经验',
    trigger: { firstAction: 'craft' },
    once: true,
  },

  // ════════════════════════════════════════════
  //  E. 物品持有情境任务（背包中有特定物品时触发）
  // ════════════════════════════════════════════

  // 持有古旧地图
  ctx_item_old_map: {
    id: 'ctx_item_old_map', name: '【情境】古图之谜',
    icon: '🗺️', type: 'talk',
    desc: '你手中这张古旧地图标注着一处隐秘之地，笔迹已有些模糊，但那线路和方位，依稀可辨。找个识货的人看看，或许能解开其中玄机。',
    reward: { silver: 80, exp: 60 },
    rewardText: '80两 + 60经验 + 藏宝图道具',
    trigger: { item: 'item_old_map' },
    once: true,
  },

  // 持有神秘信物
  ctx_item_mysterious_token: {
    id: 'ctx_item_mysterious_token', name: '【情境】信物之谜',
    icon: '🔮', type: 'talk',
    desc: '这枚信物造型奇特，材质不明，上面刻着某种古老符文。江湖之大，或许有人认得此物……带着它去找那些见多识广的老江湖，或许能得到些线索。',
    reward: { silver: 60, exp: 80, rel: 25 },
    rewardText: '60两 + 80经验 + 好感',
    trigger: { item: 'item_mysterious_token' },
    once: true,
  },
};


// ══════════════════════════════════════════════════════════════════
//  情境任务核心逻辑
// ══════════════════════════════════════════════════════════════════

/**
 * 获取情境任务实例（通过模板ID生成）
 * @param {string} tplId  模板ID
 * @param {string} suffix 生成后缀（保证唯一性）
 * @returns {object} 任务对象（与 QUEST_DB 格式兼容）
 */
function _genContextualQuest(tplId, suffix) {
  const tpl = CONTEXTUAL_QUEST_DB[tplId];
  if(!tpl) return null;
  const instanceId = tplId + (suffix ? '_' + suffix : '');
  return {
    id:          instanceId,
    name:        tpl.name,
    icon:        tpl.icon,
    type:        tpl.type,
    desc:        tpl.desc,
    reward:      Object.assign({}, tpl.reward),
    rewardText:  tpl.rewardText,
    issuerNpcId: tpl.issuerNpcId || 'ctx_board',
    targetNpcId:   tpl.targetNpcId   || null,
    targetName:    tpl.targetName    || null,
    targetCityId:  tpl.targetCityId  || null,
    targetItemId:  tpl.targetItemId  || null,
    targetType:    tpl.targetType    || null,
    targetTier:    tpl.targetTier    || null,
    targetCount:   tpl.targetCount   || 1,
    targetWins:    tpl.targetWins    || 0,
    minLevel:      tpl.minLevel      || 1,
    minRel:        tpl.minRel        || 0,
    reqSect:       tpl.reqSect       || false,
    isContextual:  true,
    tplId:         tplId,
    once:          tpl.once          || false,
    expireDays:    tpl.expireDays     || null,
    trigger:       tpl.trigger        || {},
  };
}

/**
 * 初始化 npcState.contextualQuests 存储区
 */
function _ensureContextualQuestsStore() {
  if(!npcState.contextualQuests) npcState.contextualQuests = {};
  if(!npcState.contextualTriggers) npcState.contextualTriggers = {};
}

/**
 * 获取所有已激活的情境任务实例
 */
function getContextualQuests() {
  _ensureContextualQuestsStore();
  return Object.keys(npcState.contextualQuests).map(id => {
    const inst = npcState.contextualQuests[id];
    return _genContextualQuest(inst.tplId, inst.suffix);
  }).filter(Boolean);
}

/**
 * 获取进行中的情境任务数量
 */
function getActiveContextualCount() {
  const quests = getContextualQuests();
  return quests.filter(q => getQuestStatus(q.id) === 'active').length;
}

/**
 * 检查某个情境任务模板是否已经被触发过
 */
function _isContextualTriggered(tplId) {
  _ensureContextualQuestsStore();
  if(npcState.contextualTriggers[tplId]) return true;
  // 检查 once 类型的任务——若已完成/已领取，则视为触发过
  const tpl = CONTEXTUAL_QUEST_DB[tplId];
  if(tpl && tpl.once && npcState.quests[tplId]) return true;
  return false;
}

/**
 * 激活一个情境任务（添加到 npcState.contextualQuests）
 * @param {string} tplId    模板ID
 * @param {string} suffix   生成后缀
 * @param {string} source   触发来源描述
 */
function _activateContextualQuest(tplId, suffix, source) {
  const tpl = CONTEXTUAL_QUEST_DB[tplId];
  if(!tpl) return;

  // once 任务：若已完成则不再激活
  if(tpl.once && npcState.quests[tplId + (suffix ? '_' + suffix : '')]) return;

  // 检查玩家等级要求
  if(tpl.minLevel && typeof edS !== 'undefined' && edS.level < tpl.minLevel) return;

  const instanceId = tplId + (suffix ? '_' + suffix : '');
  _ensureContextualQuestsStore();

  // 已经激活过则跳过
  if(npcState.contextualQuests[instanceId]) return;

  // 标记触发器（once 类型的用于防重）
  npcState.contextualTriggers[tplId] = { time: Date.now(), source };

  // 创建实例
  npcState.contextualQuests[instanceId] = {
    tplId,
    suffix: suffix || '',
    activatedAt: Date.now(),
    source,
  };

  // 设为 available 状态
  npcState.quests[instanceId] = 'available';

  // 提示玩家
  const inst = _genContextualQuest(tplId, suffix);
  if(inst && typeof showToast === 'function') {
    showToast(`📋 情境任务解锁：${inst.name}`, 3500);
  }

  npcStateSave();
}

/**
 * 核心触发检查函数
 * 在进城、进入地下城、升级等时机调用
 *
 * @param {string} context  触发上下文（'city' / 'dungeon' / 'level' / 'action' / 'item'）
 * @param {object} data      上下文数据
 */
function checkContextualTriggers(context, data) {
  npcStateLoad();
  _ensureContextualQuestsStore();

  const today = _getTodayIndex ? _getTodayIndex() : 0;
  const playerLevel = (typeof edS !== 'undefined' && edS.level) ? edS.level : 1;
  const curCityId   = (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : null;

  Object.entries(CONTEXTUAL_QUEST_DB).forEach(([tplId, tpl]) => {
    const trigger = tpl.trigger || {};
    let matched = false;

    switch(context) {
      case 'city': {
        const cityId = data.cityId;
        // 城市触发
        if(trigger.city && trigger.city === cityId) matched = true;
        // 任意城市触发（用于全局探索任务）
        if(trigger.city === '__ANY__' && cityId) matched = true;
        break;
      }
      case 'dungeon': {
        const dungeonId = data.dungeonId;
        if(trigger.dungeon === '__ANY__' && dungeonId) matched = true;
        if(trigger.dungeon && trigger.dungeon === dungeonId) matched = true;
        break;
      }
      case 'level': {
        const lvl = data.level;
        if(trigger.level && lvl >= trigger.level) {
          // 严格触发：只有刚好达到时触发（避免重复）
          if(lvl === trigger.level) matched = true;
        }
        break;
      }
      case 'firstAction': {
        const action = data.action;
        if(trigger.firstAction && trigger.firstAction === action) {
          // 检查是否是首次
          if(!npcState.contextualTriggers['_first_' + action]) {
            matched = true;
          }
        }
        break;
      }
      case 'item': {
        const itemId = data.itemId;
        if(trigger.item && trigger.item === itemId) matched = true;
        break;
      }
      case 'any': {
        // 通用检查：进城时顺便检查所有触发器
        if(trigger.city === curCityId) matched = true;
        if(trigger.city === '__ANY__' && curCityId) matched = true;
        break;
      }
    }

    if(matched) {
      _activateContextualQuest(tplId, data.suffix || cityId || curCityId || String(Date.now()), context + ':' + (data.cityId || data.dungeonId || data.action || ''));
    }
  });

  npcStateSave();
}

/**
 * 公开触发函数（供外部调用）
 */
function triggerContextualCity(cityId) {
  checkContextualTriggers('city', { cityId });
}
function triggerContextualDungeon(dungeonId) {
  checkContextualTriggers('dungeon', { dungeonId });
}
function triggerContextualLevel(level) {
  checkContextualTriggers('level', { level });
}
function triggerContextualAction(action) {
  // 标记首次行为
  npcStateLoad();
  _ensureContextualQuestsStore();
  if(!npcState.contextualTriggers['_first_' + action]) {
    npcState.contextualTriggers['_first_' + action] = { time: Date.now() };
    npcStateSave();
    checkContextualTriggers('firstAction', { action });
  }
}
function triggerContextualItem(itemId) {
  checkContextualTriggers('item', { itemId });
}

/**
 * 修改 getAnyQuest 支持情境任务查询
 * 已在原函数中扩展，无需再改
 */

/**
 * 领取情境任务奖励
 */
function claimContextualReward(instanceId) {
  const q = getAnyQuest(instanceId);
  if(!q || !q.isContextual) {
    if(typeof showToast === 'function') showToast('⚠️ 任务不存在');
    return false;
  }

  const status = getQuestStatus(instanceId);
  if(status !== 'done' && status !== 'active') {
    if(typeof showToast === 'function') showToast('该任务尚未完成');
    return false;
  }

  const rew = q.reward || {};

  // 发放奖励
  if(rew.silver) {
    SilverManager.add(rew.silver);
    SilverManager.save();
  }
  if(rew.exp && typeof addExp === 'function') addExp(rew.exp);
  if(rew.item && typeof craftBagAdd === 'function') craftBagAdd(rew.item, 1);
  if(rew.intel && typeof INTEL_DB !== 'undefined' && typeof jianghuState !== 'undefined') {
    if(!jianghuState.intels) jianghuState.intels = [];
    if(!jianghuState.intels.includes(rew.intel)) jianghuState.intels.push(rew.intel);
  }

  setQuestStatus(instanceId, 'claimed');

  // once 类型的任务在 npcState.contextualTriggers 里标记
  if(q.tplId && CONTEXTUAL_QUEST_DB[q.tplId]?.once) {
    _ensureContextualQuestsStore();
    npcState.contextualTriggers[q.tplId] = { time: Date.now(), done: true };
  }

  // 从列表移除（可选，保留claimed状态在任务面板）
  npcStateSave();

  if(typeof showToast === 'function') {
    showToast(`🎉 情境任务完成！获得 ${rew.silver || 0}两 + ${rew.exp || 0}经验`, 3000);
  }
  if(typeof travelSave === 'function') travelSave();
  if(typeof townRefreshStatus === 'function') townRefreshStatus();

  return true;
}

// ═══════════════════════════════════════════════════════════════════
//  NPC 心情系统
// ═══════════════════════════════════════════════════════════════════

// 心情类型定义
const MOOD_TYPES = {
  neutral:  { emoji:'😐', label:'平静',     color:'#999', rewardMult:1.0 },
  happy:    { emoji:'😊', label:'高兴',     color:'#4caf50', rewardMult:1.2 },
  sad:      { emoji:'😢', label:'悲伤',     color:'#2196f3', rewardMult:1.1 },
  angry:    { emoji:'😠', label:'愤怒',     color:'#f44336', rewardMult:1.0 },
  anxious:  { emoji:'😰', label:'焦虑',     color:'#ff9800', rewardMult:1.1 },
  fearful:  { emoji:'😨', label:'害怕',     color:'#9c27b0', rewardMult:1.0 },
  grateful: { emoji:'🥰', label:'感激',     color:'#e91e63', rewardMult:1.3 },
  trusting: { emoji:'🤝', label:'信任',     color:'#00bcd4', rewardMult:1.2 },
  bored:    { emoji:'😒', label:'烦闷',     color:'#607d8b', rewardMult:1.0 },
  excited:  { emoji:'🤩', label:'兴奋',     color:'#ff5722', rewardMult:1.4 },
  proud:    { emoji:'😤', label:'自豪',     color:'#795548', rewardMult:1.15 },
};

// 心情触发任务模板库
const MOOD_QUEST_TEMPLATES = {
  sad: [
    {
      tplId:'mood_sad_comfort',
      name:'倾听心声',
      desc:'他眼中含泪，似乎有心事……',
      type:'interact',           // 交互类型：对话/送礼/战斗/护送
      moodRequired:'sad',
      minRel:10,
      reward:{ silver:30, exp:40, relDelta:10 },
      action:'talk',             // 对话一次即完成
    },
    {
      tplId:'mood_sad_lost_item',
      name:'遗失之物',
      desc:'他说丢了很重要的东西……',
      type:'collect',
      moodRequired:'sad',
      minRel:20,
      target:'item_common',       // 随机普通物品
      targetCount:1,
      reward:{ silver:45, exp:50, relDelta:15 },
    },
  ],
  angry: [
    {
      tplId:'mood_angry_listen',
      name:'听其诉苦',
      desc:'他怒气冲冲，似乎在找人算账……',
      type:'interact',
      moodRequired:'angry',
      minRel:15,
      reward:{ silver:25, exp:35, relDelta:8 },
      action:'talk',
    },
    {
      tplId:'mood_angry_enemy',
      name:'代为出头',
      desc:'他说有个仇人想找，你愿不愿意帮忙？',
      type:'kill',
      moodRequired:'angry',
      minRel:25,
      targetTier:'func',
      targetCount:1,
      reward:{ silver:60, exp:70, relDelta:20 },
    },
  ],
  anxious: [
    {
      tplId:'mood_anxious_help',
      name:'伸出援手',
      desc:'他坐立不安，似乎遇到了麻烦……',
      type:'interact',
      moodRequired:'anxious',
      minRel:10,
      reward:{ silver:20, exp:30, relDelta:10 },
      action:'talk',
    },
    {
      tplId:'mood_anxious_deliver',
      name:'紧急传讯',
      desc:'他急需把一封急信送到某处……',
      type:'deliver',
      moodRequired:'anxious',
      minRel:15,
      targetCity:'nearby',       // 附近随机城市
      reward:{ silver:50, exp:55, relDelta:15 },
    },
  ],
  fearful: [
    {
      tplId:'mood_fearful_protect',
      name:'护送离开',
      desc:'他说有仇家追杀，想离开此地……',
      type:'escort',
      moodRequired:'fearful',
      minRel:20,
      reward:{ silver:80, exp:90, relDelta:25 },
    },
    {
      tplId:'mood_fearful_guard',
      name:'守护一夜',
      desc:'他害怕仇人找上门，问你能不能陪他度过今晚……',
      type:'interact',
      moodRequired:'fearful',
      minRel:30,
      reward:{ silver:40, exp:45, relDelta:18 },
      action:'talk',
    },
  ],
  grateful: [
    {
      tplId:'mood_grateful_return',
      name:'报答恩情',
      desc:'他说曾受过你的恩惠，想要回礼……',
      type:'interact',
      moodRequired:'grateful',
      minRel:40,
      reward:{ silver:70, exp:60, relDelta:5 },
      action:'talk',
      bonusRelDelta:30,
    },
  ],
  bored: [
    {
      tplId:'mood_bored_story',
      name:'讲述江湖事',
      desc:'他百无聊赖，想听你讲讲江湖见闻……',
      type:'interact',
      moodRequired:'bored',
      minRel:5,
      reward:{ silver:15, exp:25, relDelta:5 },
      action:'talk',
    },
    {
      tplId:'mood_bored_challenge',
      name:'以武会友',
      desc:'他说闷得发慌，想找人切磋武艺……',
      type:'fight',
      moodRequired:'bored',
      minRel:20,
      reward:{ silver:35, exp:40, relDelta:12 },
    },
  ],
  excited: [
    {
      tplId:'mood_excited_share',
      name:'分享喜讯',
      desc:'他兴奋不已，似乎发现了什么有趣的事……',
      type:'interact',
      moodRequired:'excited',
      minRel:10,
      reward:{ silver:30, exp:35, relDelta:12 },
      action:'talk',
    },
  ],
  proud: [
    {
      tplId:'mood_proud_validate',
      name:'认可成就',
      desc:'他引以为傲，希望得到你的认可……',
      type:'interact',
      moodRequired:'proud',
      minRel:25,
      reward:{ silver:40, exp:50, relDelta:15 },
      action:'talk',
    },
  ],
};

// NPC心情持久化存储（挂在npcState上，兼容旧存档）
function _ensureMoodStore() {
  if(!npcState.npcMoods) npcState.npcMoods = {};
}

// 获取NPC当前心情
function getNpcMood(npcId) {
  _ensureMoodStore();
  return npcState.npcMoods[npcId] || { mood:'neutral', level:1, since:Date.now(), active:false };
}

// 设置NPC心情（level:1-5）
function setNpcMood(npcId, mood, level=1, active=false) {
  _ensureMoodStore();
  const prev = npcState.npcMoods[npcId];
  npcState.npcMoods[npcId] = { mood, level, since:Date.now(), active };
  npcStateSave();
  return prev;
}

// 清除NPC心情（回到neutral）
function clearNpcMood(npcId) {
  setNpcMood(npcId, 'neutral', 1, false);
}

// 心情是否活跃（有可接任务）
function isMoodActive(npcId) {
  return getNpcMood(npcId).active;
}

// 获取心情任务的实例ID
function getMoodQuestInstanceId(npcId) {
  return 'mood_' + npcId;
}

// 检查心情触发任务是否可接
function checkMoodQuestAvailable(npcId) {
  const moodData = getNpcMood(npcId);
  if(!moodData.active || moodData.mood === 'neutral') return null;
  if(!MOOD_QUEST_TEMPLATES[moodData.mood]) return null;

  const templates = MOOD_QUEST_TEMPLATES[moodData.mood];
  const rel = getNpcRel(npcId);
  const instanceId = getMoodQuestInstanceId(npcId);

  // 已领取过
  const state = npcState.quests ? npcState.quests[instanceId] : null;
  if(state && (state.status === 'active' || state.status === 'done' || state.status === 'claimed')) return null;

  // 找合适模板（按minRel匹配）
  for(const tpl of templates) {
    if(rel >= tpl.minRel) {
      const rewardMult = MOOD_TYPES[moodData.mood]?.rewardMult || 1.0;
      return { ...tpl, instanceId, moodLevel: moodData.level, rewardMult, npcId };
    }
  }
  return null;
}

// 触发进城时的NPC心情检查（整合：衰减检查 + 新心情生成 + 任务收集）
function checkNpcMoodsOnEnter(cityId) {
  _ensureMoodStore();
  const npcs = Object.values(NPC_DB).filter(n => n.city === cityId);
  const results = [];

  // 心情衰减检查 & 72h自动清除
  for(const npc of npcs) {
    const moodData = npcState.npcMoods[npc.id];
    if(!moodData || moodData.mood === 'neutral') continue;
    const hoursElapsed = (Date.now() - moodData.since) / (1000 * 60 * 60);
    if(hoursElapsed >= 72) { clearNpcMood(npc.id); continue; }
    if(hoursElapsed >= 24) {
      const degrades = Math.floor(hoursElapsed / 24);
      const newLevel = Math.max(1, moodData.level - degrades);
      if(newLevel !== moodData.level) {
        npcState.npcMoods[npc.id].level = newLevel;
        npcStateSave();
      }
    }
  }

  // 20%概率生成新心情
  generateMoodOnEnterCity(cityId);

  // 收集当前有心情+可接任务的NPC
  for(const npc of npcs) {
    const moodData = npcState.npcMoods[npc.id];
    if(!moodData || moodData.mood === 'neutral') continue;
    const questAvailable = checkMoodQuestAvailable(npc.id);
    if(questAvailable) {
      results.push({ npcId: npc.id, npcName: npc.name, mood: moodData.mood, moodLevel: moodData.level, quest: questAvailable });
    }
  }
  return results;
}

// 获取所有当前有活跃心情的NPC
function getActiveMoodNpcs() {
  _ensureMoodStore();
  const results = [];
  for(const npcId in npcState.npcMoods) {
    const moodData = npcState.npcMoods[npcId];
    if(!moodData.active || moodData.mood === 'neutral') continue;
    const npc = NPC_DB[npcId];
    if(!npc) continue;
    const questAvailable = checkMoodQuestAvailable(npcId);
    results.push({
      npcId,
      npcName: npc.name,
      role: npc.role,
      avatar: npc.avatar,
      mood: moodData.mood,
      moodLevel: moodData.level,
      hoursElapsed: Math.floor((Date.now() - moodData.since) / (1000 * 60 * 60)),
      questAvailable,
    });
  }
  return results;
}

// 领取心情任务
function acceptMoodQuest(npcId) {
  const quest = checkMoodQuestAvailable(npcId);
  if(!quest) return false;

  const instanceId = getMoodQuestInstanceId(npcId);
  if(!npcState.quests) npcState.quests = {};
  npcState.quests[instanceId] = { status:'active', tplId:quest.tplId, mood:quest.mood, rewardMult:quest.rewardMult };

  // 标记为已有人接（防止进城重复触发）
  npcState.npcMoods[npcId].accepted = true;
  npcStateSave();
  return true;
}

// 领取心情任务奖励
function claimMoodQuestReward(npcId) {
  const instanceId = getMoodQuestInstanceId(npcId);
  const questState = npcState.quests ? npcState.quests[instanceId] : null;
  if(!questState || questState.status !== 'done') return false;

  const tplId = questState.tplId;
  const mood = questState.mood || 'neutral';
  const rewardMult = questState.rewardMult || 1.0;

  // 从模板找奖励
  let reward = null;
  for(const templates of Object.values(MOOD_QUEST_TEMPLATES)) {
    const tpl = templates.find(t => t.tplId === tplId);
    if(tpl) { reward = tpl.reward; break; }
  }
  if(!reward) return false;

  // 应用心情奖励加成
  const finalReward = {
    silver: Math.round((reward.silver || 0) * rewardMult),
    exp:    Math.round((reward.exp    || 0) * rewardMult),
    relDelta: reward.relDelta || 0,
  };

  // 发放奖励
  if(finalReward.silver > 0 && typeof addSilver === 'function') addSilver(finalReward.silver);
  if(finalReward.exp > 0 && typeof addExp === 'function') addExp(finalReward.exp);
  if(finalReward.relDelta > 0) adjustRelation(npcId, finalReward.relDelta);

  // 心情任务完成 → 清除NPC心情（回归平静）
  clearNpcMood(npcId);

  // 标记claimed
  npcState.quests[instanceId].status = 'claimed';
  npcStateSave();

  if(typeof showToast === 'function') {
    showToast(`🎊 心情任务完成！+${finalReward.silver}两 +${finalReward.exp}经验`, 3000);
  }
  return true;
}

// 更新心情任务进度（对话/击杀/采集/护送等）
function updateMoodQuestProgress(npcId, action, delta=1) {
  const instanceId = getMoodQuestInstanceId(npcId);
  const questState = npcState.quests ? npcState.quests[instanceId] : null;
  if(!questState || questState.status !== 'active') return;

  const tplId = questState.tplId;
  let tpl = null;
  for(const templates of Object.values(MOOD_QUEST_TEMPLATES)) {
    const found = templates.find(t => t.tplId === tplId);
    if(found) { tpl = found; break; }
  }
  if(!tpl) return;

  // 交互类任务：对话一次即完成
  if(tpl.type === 'interact' && action === 'talk') {
    npcState.quests[instanceId].status = 'done';
    npcStateSave();
    if(typeof showToast === 'function') {
      showToast(`💬 ${NPC_DB[npcId]?.name || npcId}的需求已满足，回去领取奖励吧！`, 2500);
    }
    return;
  }

  // 击杀类/其他：累计进度
  const progKey = instanceId + '_prog';
  const prog = ((npcState.quests[progKey] || 0) + delta);
  npcState.quests[instanceId][progKey] = prog;
  const need = tpl.targetCount || 1;
  if(prog >= need) {
    npcState.quests[progKey] = need;
    npcState.quests[instanceId].status = 'done';
    npcStateSave();
    if(typeof showToast === 'function') {
      showToast(`💬 ${NPC_DB[npcId]?.name || npcId}的事情已办完，回去领取奖励！`, 2500);
    }
  } else {
    npcState.quests[progKey] = prog;
    npcStateSave();
  }
}

// 获取心情任务列表（进城时展示）
function getMoodQuests() {
  const npcs = getActiveMoodNpcs();
  const result = [];
  for(const npc of npcs) {
    const instanceId = getMoodQuestInstanceId(npc.npcId);
    const state = npcState.quests ? npcState.quests[instanceId] : null;
    const moodInfo = MOOD_TYPES[npc.mood] || MOOD_TYPES.neutral;
    result.push({
      instanceId,
      npcId: npc.npcId,
      npcName: npc.npcName,
      role: npc.role,
      avatar: npc.avatar,
      mood: npc.mood,
      moodEmoji: moodInfo.emoji,
      moodLabel: moodInfo.label,
      moodColor: moodInfo.color,
      moodLevel: npc.moodLevel,
      hoursElapsed: npc.hoursElapsed,
      status: state?.status || 'available',
      quest: npc.questAvailable,
    });
  }
  return result;
}

// ══════════════════════════════════════════════════════════════
//  ⑤ 事件链任务系统（多阶段分支剧情）
// ══════════════════════════════════════════════════════════════

/**
 * 事件链数据库
 * 每条链有多个阶段(stages)，阶段内有选项(choices)
 * choices记录会影响后续阶段渲染和最终结局
 */
const EVENT_CHAIN_DB = {

  // ── 事件链1：失踪的少侠 ──
  'chain_missing_hero': {
    name: '失踪的少侠',
    desc: '江湖传闻，泰山派的年轻弟子李青云自三日前入城后便下落不明...',
    emoji: '🗡️',
    city: 'kaifeng',         // 主要城市
    minLevel: 10,
    trigger: 'city',         // 进城触发
    once: true,
    stages: [
      {
        stage: 0,
        title: '失踪之谜',
        text: '开封府近日人心惶惶——泰山派弟子李青云三日前入城后便杳无音讯。客栈掌柜说他最后问过去"杏林堂"的路...\n\n你想怎么调查？',
        npcId: null,
        choices: [
          {
            id: 'ask_inn',
            label: '📝 去客栈打听',
            text: '向掌柜询问李青云的详情',
            effect: { setVar: { path: 'innClues', value: true } },
            next: 1,
          },
          {
            id: 'ask_hospital',
            label: '💊 去杏林堂查问',
            text: '既然他去了杏林堂，也许那里有线索',
            effect: { setVar: { path: 'hospitalClues', value: true } },
            next: 1,
          },
          {
            id: 'ask_guild',
            label: '🏛️ 去开封府衙询问',
            text: '官府或许有失踪人口的记录',
            effect: { setVar: { path: 'guildClues', value: true } },
            next: 1,
          },
        ],
      },
      {
        stage: 1,
        title: '线索浮现',
        getText: (chain) => {
          if(chain.vars?.innClues && chain.vars?.hospitalClues) {
            return '你在客栈打听到李青云曾与一蒙面人密谈，又从杏林堂得知他买了解毒药却被人跟踪...\n\n两条线索汇向同一个方向：城南废庙！';
          }
          return '根据线索，李青云入城后行为古怪，似乎在躲避什么人...\n\n无论如何，线索都指向城南的废弃庙宇。';
        },
        npcId: null,
        choices: [
          {
            id: 'go_temple',
            label: '🏚️ 前往废庙调查',
            text: '前往城南废弃庙宇',
            effect: { setVar: { path: 'visitedTemple', value: true } },
            next: 2,
          },
        ],
      },
      {
        stage: 2,
        title: '废庙惊变',
        text: '废庙中一片狼藉，地上有搏斗痕迹！你发现一块绣有"华山"字样的衣角，还有被撕碎的求救信...\n\n突然，黑暗中冲出数名黑衣人！',
        npcId: null,
        enemy: 'func_bandit',  // 触发战斗
        choices: [
          {
            id: 'fight',
            label: '⚔️ 迎战！',
            text: '击退黑衣人',
            effect: { setVar: { path: 'wonFight', value: true }, addRep: { faction: 'bureau', delta: 2 } },
            next: 3,
          },
          {
            id: 'retreat',
            label: '💨 暂时撤退',
            text: '寡不敌众，先撤',
            effect: { setVar: { path: 'retreated', value: true } },
            next: 4,
          },
        ],
      },
      {
        stage: 3,
        title: '深入虎穴',
        text: '击退黑衣人后，你在庙中发现密室入口！\n\n密室中，李青云被铁链锁住，身受重伤但尚有一息。他身旁站着一个熟悉的身影——竟是他的师兄周天成！\n\n"师弟，这些年我待你不薄，你却处处压我一头...今日你死我亡！"\n\n周天成拔剑相向！',
        npcId: null,
        enemy: 'major_huashan_elite',  // 精英战斗
        choices: [
          {
            id: 'save_li',
            label: '🛡️ 舍命救人',
            text: '拼死一击，斩断铁链',
            effect: { setVar: { path: 'savedLi', value: true }, addRep: { faction: 'taishan', delta: 8 } },
            next: 5,
          },
          {
            id: 'capture_zhou',
            label: '⚔️ 先制周天成',
            text: '擒贼先擒王',
            effect: { setVar: { path: 'capturedZhou', value: true }, addRep: { faction: 'bureau', delta: 5 } },
            next: 5,
          },
        ],
      },
      {
        stage: 4,
        title: '再探究竟',
        text: '你撤离废庙后，不甘心就此放弃。\n\n华山派长老恰好在开封，你将线索告知，他大为震惊...\n\n"天成这孩子...唉，我亲自走一趟！"',
        npcId: null,
        choices: [
          {
            id: 'join_rescue',
            label: '🤝 与长老同行',
            text: '联手营救李青云',
            effect: { setVar: { path: 'joinedRescue', value: true }, addRep: { faction: 'taishan', delta: 5 } },
            next: 5,
          },
        ],
      },
      {
        stage: 5,
        title: '正义终章',
        getText: (chain) => {
          if(chain.vars?.savedLi) return '你将李青云救出火海，他的师门对你感激不尽！\n\n周天成被押送官府，华山派上下对你肃然起敬。\n\n从此，江湖上多了一个人人称颂的侠名。';
          if(chain.vars?.capturedZhou) return '你将周天成生擒，解救了被囚的李青云。\n\n开封府将周天成收押，华山派为感谢你的义举，赠你一柄青锋剑！\n\n你为江湖除了一害，名声大振！';
          return '华山长老成功救出李青云，周天成伏法。\n\n虽然你没有亲自参与，但你的线索功不可没！\n\n华山派派人送来谢礼。';
        },
        npcId: null,
        choices: [
          {
            id: 'finish',
            label: '✅ 完成事件',
            text: '领取奖励',
            effect: { complete: true },
            next: -1,
          },
        ],
        rewards: (chain) => {
          if(chain.vars?.savedLi) {
            return { silver: 150, exp: 300, rep: { taishan: 8 }, item: 'wep_rare_sword', itemName: '青锋剑' };
          }
          if(chain.vars?.capturedZhou) {
            return { silver: 120, exp: 250, rep: { bureau: 5 }, item: 'arm_rare_iron', itemName: '精铁护腕' };
          }
          return { silver: 80, exp: 200, rep: { taishan: 3 } };
        },
      },
    ],
  },

  // ── 事件链2：门派血案 ──
  'chain_sect_massacre': {
    name: '门派血案',
    desc: '深夜，少林寺门外发现一名重伤僧人，声称罗汉堂遭袭...',
    emoji: '🩸',
    city: 'luoyang',          // 靠近少林寺
    minLevel: 25,
    trigger: 'city',
    once: true,
    stages: [
      {
        stage: 0,
        title: '血染罗汉',
        text: '深夜时分，一名浑身浴血的少林僧人倒在洛阳城门旁，只说了一句话："罗汉堂...内鬼...师兄...他..."便昏死过去。\n\n你将此事告知少林寺，少林方丈面色凝重...',
        npcId: null,
        choices: [
          {
            id: 'offer_help',
            label: '🙏 主动请缨',
            text: '协助少林调查',
            effect: { setVar: { path: 'helpedShaolin', value: true } },
            next: 1,
          },
          {
            id: 'wait_info',
            label: '⏳ 静待消息',
            text: '先在洛阳打探消息',
            effect: { setVar: { path: 'waitedInfo', value: true } },
            next: 1,
          },
        ],
      },
      {
        stage: 1,
        title: '蛛丝马迹',
        getText: (chain) => {
          const waited = chain.vars?.waitedInfo;
          return waited
            ? '你在城中酒馆听到传言：少林罗汉堂近日与明教有过节，似乎是争夺某件宝物...\n\n又有人提到，受伤僧人被送去了杏林堂。'
            : '少林方丈告诉你：罗汉堂有七名弟子重伤，内鬼尚不明确。\n\n但现场发现了一枚明教的令牌——这是嫁祸，还是真相？';
        },
        npcId: null,
        choices: [
          {
            id: 'check_evidence',
            label: '🔍 勘查现场',
            text: '前往罗汉堂勘查证据',
            effect: { setVar: { path: 'checkedEvidence', value: true } },
            next: 2,
          },
          {
            id: 'visit_hospital',
            label: '💊 探望伤者',
            text: '去杏林堂探望受伤僧人',
            effect: { setVar: { path: 'visitedHospital', value: true } },
            next: 2,
          },
        ],
      },
      {
        stage: 2,
        title: '真相浮现',
        getText: (chain) => {
          const checked = chain.vars?.checkedEvidence;
          const visited = chain.vars?.visitedHospital;
          if(checked && visited) {
            return '你综合了所有线索：现场有明教令牌不假，但令牌上的指纹却是少林弟子的...\n\n内鬼想要嫁祸明教，挑起两派大战！\n\n你锁定嫌疑人：罗汉堂首座玄苦大师的弟子——慧明！';
          }
          return '线索指向两个可能：\n1. 明教确有袭击，但这可能是更大阴谋的一部分\n2. 少林内部有人嫁祸\n\n无论如何，慧明的行踪最近十分可疑...';
        },
        npcId: null,
        choices: [
          {
            id: 'accuse_huiming',
            label: '👆 当众揭发慧明',
            text: '在少林寺当众指认',
            effect: { setVar: { path: 'publicAccusation', value: true } },
            next: 3,
          },
          {
            id: 'secret_catch',
            label: '🥷 暗中抓捕',
            text: '先搜集证据再动手',
            effect: { setVar: { path: 'secretCatch', value: true } },
            next: 3,
          },
        ],
      },
      {
        stage: 3,
        title: '最终对峙',
        getText: (chain) => {
          const pub = chain.vars?.publicAccusation;
          return pub
            ? '你当众揭发慧明，众僧哗然！慧明见事迹败露，暴起伤人，拔刀便砍！\n\n你奋力迎战，将其制服！'
            : '你深夜跟踪慧明，发现他正与城外一人密会——那人竟是明教暗探！\n\n两人发现你后，立刻发动攻击！';
        },
        npcId: null,
        enemy: 'major_shaolin_elite',
        choices: [
          {
            id: 'mercy',
            label: '🕊️ 留他一命',
            text: '制服即可，饶其性命',
            effect: { setVar: { path: 'showedMercy', value: true }, addRep: { faction: 'shaolin', delta: 3 } },
            next: 4,
          },
          {
            id: 'justice',
            label: '⚔️ 严惩不贷',
            text: '依法处置，就地处决',
            effect: { setVar: { path: 'executedJustice', value: true }, addRep: { faction: 'shaolin', delta: 1 } },
            next: 4,
          },
        ],
      },
      {
        stage: 4,
        title: '尘埃落定',
        getText: (chain) => {
          const mercy = chain.vars?.showedMercy;
          const justice = chain.vars?.executedJustice;
          if(mercy) {
            return '慧明被押送罗汉堂受审，明教暗探逃脱。\n\n少林方丈对你的谨慎和仁慈大加赞赏："施主宅心仁厚，少林铭记！"\n\n事件平息后，少林开放了藏经阁一层供你参阅。';
          }
          return '慧明被当场格杀，明教暗探逃之夭夭。\n\n少林虽感激你的帮助，但对你杀伐果断的作风颇有微词...\n\n明教得知此事后，暗中对你记下了仇恨。';
        },
        npcId: null,
        choices: [
          {
            id: 'finish',
            label: '✅ 完成事件',
            text: '领取奖励',
            effect: { complete: true },
            next: -1,
          },
        ],
        rewards: (chain) => {
          const mercy = chain.vars?.showedMercy;
          if(mercy) {
            return { silver: 200, exp: 400, rep: { shaolin: 5 }, item: 'manual_shaolin_basic', itemName: '少林基础拳法' };
          }
          return { silver: 150, exp: 350, rep: { shaolin: 2 }, item: 'arm_shaolin_wood', itemName: '木鱼戒' };
        },
      },
    ],
  },

  // ── 事件链3：隐藏宝藏 ──
  'chain_hidden_treasure': {
    name: '藏宝图之谜',
    desc: '你在旅途中获得一张残缺的古图，上面画着某处的地形...',
    emoji: '🗺️',
    city: null,              // 任意城市均可开始
    minLevel: 15,
    trigger: 'item',         // 持有藏宝图触发
    requiredItem: 'item_treasure_map',
    once: true,
    stages: [
      {
        stage: 0,
        title: '古图现世',
        text: '你手中这张古图残破不全，但依稀可辨：图上标注着"西岳"字样，还有"松间月"三字...\n\n这是通往某处宝藏的线索！第一步，先破解古图的秘密。',
        npcId: null,
        choices: [
          {
            id: 'study_map',
            label: '📖 仔细研究',
            text: '花时间研究古图',
            effect: { setVar: { path: 'studiedMap', value: true }, spendDays: 1 },
            next: 1,
          },
          {
            id: 'ask_scholar',
            label: '🎓 找人鉴定',
            text: '找城中书生帮忙',
            effect: { setVar: { path: 'askedScholar', value: true } },
            next: 1,
          },
        ],
      },
      {
        stage: 1,
        title: '谜底渐显',
        getText: (chain) => {
          return chain.vars?.studiedMap
            ? '你仔细研究，发现图上的松树图形与华山某处地形吻合，"松间月"很可能指的是华山青柯坪！'
            : '书生鉴定后告诉你："此图年代久远，约有百年，图上的松树和月牙暗记...这似乎是华山一派的密语！"';
        },
        npcId: null,
        choices: [
          {
            id: 'go_huashan',
            label: '🏔️ 前往华山',
            text: '前往华山寻找宝藏',
            effect: { setVar: { path: 'wentToHuashan', value: true } },
            next: 2,
          },
        ],
      },
      {
        stage: 2,
        title: '华山寻踪',
        text: '你登上华山，按图索骥，来到青柯坪。\n\n在一棵古松下，你发现一块刻有月牙图案的巨石——机关！\n\n推开巨石，一条幽暗的地道出现在眼前！',
        npcId: null,
        dungeon: 'cave_secret',  // 触发进入秘密洞穴地城
        choices: [
          {
            id: 'enter_cave',
            label: '⬇️ 深入地道',
            text: '带着火把进入地道',
            effect: { setVar: { path: 'enteredCave', value: true } },
            next: 3,
          },
          {
            id: 'gather_friends',
            label: '👥 先寻帮手',
            text: '地道未知，先找帮手',
            effect: { setVar: { path: 'gatheredFriends', value: true }, spendDays: 2 },
            next: 3,
          },
        ],
      },
      {
        stage: 3,
        title: '洞中机关',
        text: '地道尽头是一道石门，门上刻着八个字：\n\n"非正非邪，唯心可入"\n\n门旁有八个凹槽，似乎需要按特定顺序按下...',
        npcId: null,
        choices: [
          {
            id: 'solve_riddle',
            label: '🧩 解开机关',
            text: '破解八字禅机（按"心正邪唯非入可"顺序）',
            effect: { setVar: { path: 'solvedRiddle', value: true } },
            next: 4,
          },
          {
            id: 'force_door',
            label: '💪 强行破门',
            text: '以内力破门',
            effect: { setVar: { path: 'forcedDoor', value: true } },
            next: 4,
          },
        ],
      },
      {
        stage: 4,
        title: '宝藏现世',
        getText: (chain) => {
          const solved = chain.vars?.solvedRiddle;
          const forced = chain.vars?.forcedDoor;
          if(solved) {
            return '石门缓缓开启，里面竟是一位前辈高人的修炼密室！\n\n室中有一柄绝世好剑"倚天"，一本武功秘籍，还有一箱金银！\n\n看来这位前辈早已仙逝，留下遗产等待有缘人。';
          }
          return '你以内力破门，但触发了防御机关！一道毒箭射来，你虽然躲过，但宝藏室中已有部分毒气弥漫...\n\n你抢出了部分财宝和一本残破秘籍，但最好的东西似乎已经被毁了！';
        },
        npcId: null,
        choices: [
          {
            id: 'claim_treasure',
            label: '✅ 领取宝藏',
            text: '领取你的发现',
            effect: { complete: true },
            next: -1,
          },
        ],
        rewards: (chain) => {
          const solved = chain.vars?.solvedRiddle;
          if(solved) {
            return { silver: 500, exp: 500, item: 'wep_elite_ysword', itemName: '倚天剑(残)', item2: 'manual_elite_xuan', itemName2: '玄铁秘籍' };
          }
          return { silver: 200, exp: 300, item: 'arm_treasure_gold', itemName: '鎏金护符', item2: 'manual_elite_xuan', itemName2: '残破秘籍' };
        },
      },
    ],
  },

  // ── 事件链4：江湖恩怨 ──
  'chain_jianghu_grudge': {
    name: '江湖恩怨',
    desc: '江湖两大高手的宿怨，你无意间被卷入其中...',
    emoji: '⚔️',
    city: 'suzhou',
    minLevel: 20,
    trigger: 'city',
    once: true,
    stages: [
      {
        stage: 0,
        title: '两强相争',
        text: '苏州城里人尽皆知：江南第一剑客柳如烟与魔教长老血手人屠有杀父之仇！\n\n今日，两人在太湖边相遇，江湖人纷纷围观...\n\n你路过此地，见两人剑拔弩张。',
        npcId: null,
        choices: [
          {
            id: 'watch',
            label: '👁️ 静观其变',
            text: '旁观这场高手对决',
            effect: { setVar: { path: 'watchedFight', value: true } },
            next: 1,
          },
          {
            id: 'mediate',
            label: '🤝 出面调停',
            text: '试图劝开两人',
            effect: { setVar: { path: 'mediated', value: true } },
            next: 1,
          },
        ],
      },
      {
        stage: 1,
        title: '卷入漩涡',
        getText: (chain) => {
          const watched = chain.vars?.watchedFight;
          return watched
            ? '你静静观战。柳如烟剑招凌厉，血手人屠则以邪功应对...\n\n就在两人即将分出胜负之际，柳如烟突然口吐鲜血——她竟中了毒！\n\n血手人屠冷笑："柳家剑法不过如此！"'
            : '你刚开口调停，血手人屠便怒道："滚开！这是我与柳家的私仇！"\n\n柳如烟却趁机一掌拍向血手人屠，两人战在一处...\n\n混乱中，你意外被卷入！';
        },
        npcId: null,
        choices: [
          {
            id: 'help_liu',
            label: '🛡️ 帮柳如烟',
            text: '出手相助柳如烟',
            effect: { setVar: { path: 'helpedLiu', value: true } },
            next: 2,
          },
          {
            id: 'help_zhu',
            label: '💀 帮血手人屠',
            text: '站在血手人屠一边',
            effect: { setVar: { path: 'helpedZhu', value: true } },
            next: 2,
          },
        ],
      },
      {
        stage: 2,
        title: '情势逆转',
        getText: (chain) => {
          const helpedLiu = chain.vars?.helpedLiu;
          const helpedZhu = chain.vars?.helpedZhu;
          if(helpedLiu) {
            return '你助柳如烟击退血手人屠，但她毒伤发作，已无力再战...\n\n血手人屠逃走前撂下狠话："小子，你坏了我的大事！"\n\n柳如烟托你带她去杏林堂求医。';
          }
          return '你暗中相助，血手人屠将柳如烟打成重伤！\n\n"小子，识相！"他将一个玉瓶扔给你："这是解药，拿去吧。"\n\n柳如烟怨恨地看了你一眼，踉跄离去...';
        },
        npcId: null,
        choices: [
          {
            id: 'escort_liu',
            label: '🏥 护送就医',
            text: '带她去杏林堂',
            effect: { setVar: { path: 'escortedLiu', value: true }, addRep: { faction: 'jianghu', delta: 5 } },
            next: 3,
          },
          {
            id: 'investigate_poison',
            label: '🔍 追查毒源',
            text: '先追查中毒真相',
            effect: { setVar: { path: 'investigatedPoison', value: true } },
            next: 3,
          },
        ],
      },
      {
        stage: 3,
        title: '真相大白',
        getText: (chain) => {
          const escorted = chain.vars?.escortedLiu;
          const investigated = chain.vars?.investigatedPoison;
          if(investigated) {
            return '你追查后发现：柳如烟中的毒，竟是血手人屠三日前就在她茶中下的！\n\n血手人屠为复仇不择手段，实属卑鄙！\n\n你决定将真相告知柳如烟。';
          }
          return '柳如烟在杏林堂得到救治，但她的内力已受损三成。\n\n她握住你的手："今日之恩，柳家没齿难忘！"\n\n她递给你一块柳家令牌："凭此牌，柳家商铺任你取用。"';
        },
        npcId: null,
        choices: [
          {
            id: 'pursue_zhu',
            label: '⚔️ 追杀血手人屠',
            text: '为江湖除害',
            effect: { setVar: { path: 'pursuedZhu', value: true } },
            next: 4,
          },
          {
            id: 'finish_peaceful',
            label: '✅ 和平结束',
            text: '此事就此作罢',
            effect: { complete: true },
            next: -1,
          },
        ],
      },
      {
        stage: 4,
        title: '恩怨终结',
        text: '你一路追踪血手人屠至西域荒野，最终在火焰山脚下将其截住！\n\n一场恶战后，你将其击败！\n\n血手人屠临死前笑道："我死了又如何...我的弟子会替我报仇的..."\n\n你为柳家报了仇，江湖上多了一个传说。',
        npcId: null,
        enemy: 'elite_zhu',
        choices: [
          {
            id: 'finish',
            label: '✅ 完成事件',
            text: '领取奖励',
            effect: { complete: true },
            next: -1,
          },
        ],
        rewards: (chain) => {
          const helpedLiu = chain.vars?.helpedLiu;
          return { silver: 300, exp: 500, rep: { jianghu: 8 }, item: 'wep_elite_liu', itemName: '柳家剑' };
        },
      },
    ],
  },

  // ── 事件链5：门派之争 ──
  'chain_sect_rivalry': {
    name: '门派之争',
    desc: '江湖两大门派因一本秘籍反目成仇，你是唯一的调停者...',
    emoji: '🏯',
    city: 'chengdu',
    minLevel: 30,
    trigger: 'city',
    once: true,
    stages: [
      {
        stage: 0,
        title: '风云再起',
        text: '峨眉派与昆仑派因一本《九阴真经》残页的所有权争执不下！\n\n两派约定三日后在成都青城山比武定归属，胜者得书。\n\n此事若处理不当，必将引发江湖大乱！',
        npcId: null,
        choices: [
          {
            id: 'try_mediate_first',
            label: '🤝 尝试调停',
            text: '先找两派掌门谈谈',
            effect: { setVar: { path: 'triedMediation', value: true } },
            next: 1,
          },
          {
            id: 'investigate_truth',
            label: '🔍 调查真相',
            text: '先弄清秘籍真正归属',
            effect: { setVar: { path: 'investigatedTruth', value: true } },
            next: 1,
          },
        ],
      },
      {
        stage: 1,
        title: '暗流涌动',
        getText: (chain) => {
          const mediation = chain.vars?.triedMediation;
          return mediation
            ? '两派掌门都拒绝对话。峨眉掌门静慈师太："这本残页是我派先辈用命换来的！"\n\n昆仑掌门何足道冷笑："笑话，明明是我昆仑的传承！"\n\n调解无果，比武看来不可避免...'
            : '你深入调查后发现：这本残页原属昆仑不假，但百年前峨眉一位高僧曾与昆仑交换过部分内容...\n\n两派各有道理，这才是纠纷的根源！';
        },
        npcId: null,
        choices: [
          {
            id: 'propose_share',
            label: '📜 提议共享',
            text: '提出两派共研秘籍',
            effect: { setVar: { path: 'proposedShare', value: true } },
            next: 2,
          },
          {
            id: 'let_them_fight',
            label: '⚔️ 旁观比武',
            text: '让他们自己解决',
            effect: { setVar: { path: 'watchedBrawl', value: true } },
            next: 2,
          },
        ],
      },
      {
        stage: 2,
        title: '关键抉择',
        getText: (chain) => {
          const proposed = chain.vars?.proposedShare;
          const watched = chain.vars?.watchedBrawl;
          if(proposed) {
            return '你向两派提出：秘籍由两派共同保管，每五年轮流研读。\n\n两派争执不下，各提出条件...\n\n峨眉：要昆仑先交出保管\n昆仑：要峨眉承认秘籍归属';
          }
          return '比武开始！峨眉剑法飘逸，昆仑掌法刚猛...\n\n战况激烈时，你注意到昆仑弟子中有一人使的招式与峨眉极为相似...\n\n难道秘籍之争背后还有隐情？';
        },
        npcId: null,
        choices: [
          {
            id: 'fair_judgment',
            label: '⚖️ 公正裁判',
            text: '提出公平分配方案',
            effect: { setVar: { path: 'fairJudgment', value: true } },
            next: 3,
          },
          {
            id: 'reveal_secret',
            label: '🗝️ 揭露真相',
            text: '将调查到的真相公之于众',
            effect: { setVar: { path: 'revealedSecret', value: true } },
            next: 3,
          },
        ],
      },
      {
        stage: 3,
        title: '尘埃落定',
        getText: (chain) => {
          const fair = chain.vars?.fairJudgment;
          const revealed = chain.vars?.revealedSecret;
          if(fair) {
            return '你提出折中方案：秘籍由少林寺代为保管，两派均可研读，但不得外传。\n\n两派虽然心有不甘，但在你的威望下勉强同意。\n\n少林寺愿意作为第三方担保。';
          }
          return '你当众揭露真相：百年前，峨眉与昆仑本是一家，后来分道扬镳...\n\n这本残页，其实是两派共同的祖先所创！\n\n两派掌门面面相觑，最终握手言和，共同研习这本秘籍。';
        },
        npcId: null,
        choices: [
          {
            id: 'finish',
            label: '✅ 完成事件',
            text: '领取奖励',
            effect: { complete: true },
            next: -1,
          },
        ],
        rewards: (chain) => {
          const fair = chain.vars?.fairJudgment;
          const revealed = chain.vars?.revealedSecret;
          if(revealed) {
            return { silver: 400, exp: 600, rep: { emei: 5, kunlun: 5 }, item: 'manual_elite_jiuyin', itemName: '九阴残篇拓本' };
          }
          return { silver: 300, exp: 500, rep: { emei: 3, kunlun: 3 } };
        },
      },
    ],
  },

  // ── 事件链6：酒馆秘辛（短链，2-3阶段） ──
  'chain_tavern_secret': {
    name: '酒馆秘辛',
    desc: '江湖酒馆中，你无意间听到一段惊人的对话...',
    emoji: '🍺',
    city: null,
    minLevel: 5,
    trigger: 'action',
    requiredAction: 'tavern_enter',
    once: true,
    stages: [
      {
        stage: 0,
        title: '隔墙有耳',
        text: '你在江湖酒馆落座，忽然听到角落里两人的低语：\n\n"那批货已经到码头了...明天子时...别让人发现..."\n\n他们说的"货"是什么？你决定...',
        npcId: null,
        choices: [
          {
            id: 'eavesdrop_more',
            label: '👂 继续偷听',
            text: '冒险靠近再听',
            effect: { setVar: { path: 'moreInfo', value: true }, risk: { chance: 0.3, failText: '你被发现了！', failEffect: { setVar: { path: 'discovered', value: true } } } },
            next: 1,
          },
          {
            id: 'follow_later',
            label: '🚶 跟踪他们',
            text: '等他们离开后跟踪',
            effect: { setVar: { path: 'followedLater', value: true } },
            next: 1,
          },
          {
            id: 'ignore',
            label: '🍶 不关我事',
            text: '继续喝酒，不理此事',
            effect: { setVar: { path: 'ignored', value: true }, complete: true },
            next: -1,
          },
        ],
      },
      {
        stage: 1,
        title: '真相浮现',
        getText: (chain) => {
          const discovered = chain.vars?.discovered;
          const followed = chain.vars?.followedLater;
          if(discovered) {
            return '你靠得太近，被他们发现了！\n\n两人围上来："哪来的小子，活腻了？"说着便动了手！\n\n你奋力逃脱，但这伙人的背后身份更加神秘了...';
          }
          return '你跟踪他们来到码头仓库，发现这伙人竟是走私盐的铁器贩子！\n\n但更令你震惊的是：领头的人穿着官服——这背后竟有官府撑腰！';
        },
        npcId: null,
        choices: [
          {
            id: 'report_bureau',
            label: '🏛️ 举报官府',
            text: '将此事告知开封府',
            effect: { setVar: { path: 'reported', value: true }, addRep: { faction: 'bureau', delta: 5 } },
            next: 2,
          },
          {
            id: 'deal_shadow',
            label: '💰 暗中交易',
            text: '假装没看见，换点好处',
            effect: { setVar: { path: 'dealt', value: true } },
            next: 2,
          },
        ],
      },
      {
        stage: 2,
        title: '结局',
        getText: (chain) => {
          const reported = chain.vars?.reported;
          return reported
            ? '你将线索提供给开封府，府尹大为震怒，下令彻查！\n\n数日后，官商勾结案告破，朝廷嘉奖了你。\n\n江湖上都知道你是个有正义感的侠士。'
            : '你假装什么都没看见，换来了五十两银子。\n\n但每当夜深人静，你总觉得心里有根刺...\n\n江湖正道，有时候真的很难。';
        },
        npcId: null,
        choices: [
          {
            id: 'finish',
            label: '✅ 完成事件',
            text: '领取奖励',
            effect: { complete: true },
            next: -1,
          },
        ],
        rewards: (chain) => {
          const reported = chain.vars?.reported;
          if(reported) return { silver: 150, exp: 200, rep: { bureau: 8 } };
          return { silver: 50, exp: 50 };
        },
      },
    ],
  },

};

// ── 事件链状态管理 ──

function _getEventChainState(chainId) {
  if(!npcState.eventChains) npcState.eventChains = {};
  return npcState.eventChains[chainId] || null;
}

function _initEventChain(chainId) {
  if(!npcState.eventChains) npcState.eventChains = {};
  npcState.eventChains[chainId] = {
    stage: 0,
    vars: {},         // 记录所有选择结果
    startedAt: Date.now(),
    lastActiveAt: Date.now(),
    status: 'active', // active/completed/abandoned
  };
  npcStateSave();
}

function getEventChainProgress(chainId) {
  const chain = EVENT_CHAIN_DB[chainId];
  const state = _getEventChainState(chainId);
  if(!state) return null;
  return {
    ...chain,
    currentStage: state.stage,
    vars: state.vars,
    status: state.status,
  };
}

function getActiveEventChains() {
  if(!npcState.eventChains) return [];
  return Object.entries(npcState.eventChains)
    .filter(([id, s]) => s.status === 'active')
    .map(([id, s]) => {
      const db = EVENT_CHAIN_DB[id];
      if(!db) return null;
      const stage = db.stages[s.stage];
      const text = stage?.getText ? stage.getText(s) : stage?.text || '';
      return {
        chainId: id,
        name: db.name,
        desc: db.desc,
        emoji: db.emoji,
        currentStage: s.stage,
        totalStages: db.stages.length,
        stageTitle: stage?.title || '',
        text: text.substring(0, 80) + (text.length > 80 ? '...' : ''),
        choices: stage?.choices || [],
        status: s.status,
      };
    })
    .filter(Boolean);
}

function acceptEventChain(chainId) {
  const db = EVENT_CHAIN_DB[chainId];
  if(!db) return null;
  const existing = _getEventChainState(chainId);
  if(existing && existing.status !== 'abandoned') return null; // 已激活或完成

  _initEventChain(chainId);
  return getEventChainProgress(chainId);
}

function makeEventChainChoice(chainId, choiceId) {
  const chain = EVENT_CHAIN_DB[chainId];
  const state = _getEventChainState(chainId);
  if(!chain || !state || state.status !== 'active') return null;

  const stage = chain.stages[state.stage];
  if(!stage) return null;

  const choice = (stage.choices || []).find(c => c.id === choiceId);
  if(!choice) return null;

  // 风险判定
  if(choice.effect?.risk) {
    const roll = Math.random();
    if(roll > choice.effect.risk.chance) {
      // 成功（未触发风险）
    } else {
      // 失败，触发风险效果
      if(choice.effect.risk.failEffect) {
        if(choice.effect.risk.failEffect.setVar) {
          Object.entries(choice.effect.risk.failEffect.setVar).forEach(([k, v]) => {
            state.vars[k] = v;
          });
        }
      }
      // 仍然可以继续
    }
  }

  // 应用效果
  if(choice.effect?.setVar) {
    Object.entries(choice.effect.setVar).forEach(([k, v]) => {
      const keys = k.split('.');
      if(keys.length === 1) {
        state.vars[k] = v;
      }
    });
  }
  if(choice.effect?.addRep && typeof addReputation === 'function') {
    Object.entries(choice.effect.addRep).forEach(([faction, delta]) => {
      addReputation(faction, delta);
    });
  }
  if(choice.effect?.complete) {
    // 领取奖励
    _claimEventChainReward(chainId);
    state.status = 'completed';
    state.lastActiveAt = Date.now();
    npcStateSave();
    return { chainId, done: true };
  }

  // 前进阶段
  const nextStage = choice.next;
  if(nextStage === -1) {
    _claimEventChainReward(chainId);
    state.status = 'completed';
  } else if(nextStage > state.stage) {
    state.stage = nextStage;
  }

  // 战斗阶段
  if(choice.next > 0) {
    const nextStageData = chain.stages[nextStage];
    if(nextStageData?.enemy) {
      state.pendingEnemy = nextStageData.enemy;
      state.pendingChainId = chainId;
      state.pendingChoiceId = choiceId;
    }
  }

  state.lastActiveAt = Date.now();
  npcStateSave();
  return getEventChainProgress(chainId);
}

function _claimEventChainReward(chainId) {
  const chain = EVENT_CHAIN_DB[chainId];
  const state = _getEventChainState(chainId);
  if(!chain) return;

  const rewardFn = chain.stages[chain.stages.length - 1].rewards;
  if(typeof rewardFn !== 'function') return;

  const reward = rewardFn(state);
  if(!reward) return;

  if(reward.silver) addSilver(reward.silver);
  if(reward.exp) addExp(reward.exp);
  if(reward.rep && typeof addReputation === 'function') {
    Object.entries(reward.rep).forEach(([faction, delta]) => {
      addReputation(faction, delta);
    });
  }
  if(reward.item) {
    addItemToBag(reward.item, 1);
    showToast(`🎁 获得：${reward.itemName || reward.item}`);
  }
  if(reward.item2) {
    addItemToBag(reward.item2, 1);
    showToast(`🎁 获得：${reward.itemName2 || reward.item2}`);
  }
}

function checkEventChainTriggers(context, data) {
  if(!npcState.eventChains) npcState.eventChains = {};

  Object.entries(EVENT_CHAIN_DB).forEach(([chainId, chain]) => {
    const existing = npcState.eventChains[chainId];
    if(existing && existing.status !== 'abandoned') return; // 已激活或完成

    let triggered = false;

    switch(chain.trigger) {
      case 'city': {
        const cityId = data.cityId;
        if(cityId && cityId === chain.city) triggered = true;
        break;
      }
      case 'item': {
        const bag = getBagItems();
        if(chain.requiredItem && bag && bag[chain.requiredItem]) triggered = true;
        break;
      }
      case 'action': {
        if(chain.requiredAction && data.action === chain.requiredAction) triggered = true;
        break;
      }
      case 'any': triggered = true; break;
    }

    if(triggered) {
      const edS = typeof getEditorState === 'function' ? getEditorState() : null;
      const lvl = edS?.level || 1;
      if(lvl >= chain.minLevel) {
        // 自动激活
        _initEventChain(chainId);
        if(typeof showToast === 'function') {
          showToast(`✨ 事件链开启：${chain.name} ${chain.emoji}`);
        }
      }
    }
  });

  npcStateSave();
}

// 战斗胜利后继续事件链
function resumeEventChainAfterBattle(chainId, choiceId, won) {
  if(!won) {
    // 战斗失败 - 标记失败状态，但可以让玩家重试
    const state = _getEventChainState(chainId);
    if(state) {
      state.vars.lostBattle = true;
      npcStateSave();
    }
    return;
  }
  // 继续执行选择效果
  makeEventChainChoice(chainId, choiceId);
}

// 公开 API
window.acceptEventChain          = acceptEventChain;
window.makeEventChainChoice       = makeEventChainChoice;
window.getActiveEventChains       = getActiveEventChains;
window.checkEventChainTriggers    = checkEventChainTriggers;
window.resumeEventChainAfterBattle = resumeEventChainAfterBattle;
window.EVENT_CHAIN_DB             = EVENT_CHAIN_DB;

// ══════════════════════════════════════════════════════════════
//  根据心情替换/增强问候语（供 getNpcDialogue 调用）
function getMoodGreeting(npcId, baseRel, currentCity) {
  const moodData = getNpcMood(npcId);
  if(moodData.mood === 'neutral') return null;

  const moodInfo = MOOD_TYPES[moodData.mood];
  const level = moodData.level || 1;
  const npc = NPC_DB[npcId];
  if(!npc || !npc.greetings) return null;

  // 找对应心情的greeting（优先用greetingOverrides里的moodGreetings）
  if(npc.moodGreetings && npc.moodGreetings[moodData.mood]) {
    const greetings = npc.moodGreetings[moodData.mood];
    const idx = Math.floor(Math.random() * greetings.length);
    return { text: greetings[idx], mood: moodData.mood, emoji: moodInfo.emoji, level };
  }

  // 降级：用预设的心情通用问候
  const genericMoodGreetings = {
    sad:     ['他神色黯然，似乎有满腹心事……', '他眼眶微红，像是刚哭过……'],
    angry:   ['他眉头紧锁，满脸怒容……', '他一拳砸在桌上，气得浑身发抖！'],
    anxious: ['他坐立不安，时不时朝门外张望……', '他双手紧握，神色慌张……'],
    fearful: ['他瑟缩在角落，不敢与人对视……', '他浑身发抖，似乎被什么吓坏了……'],
    grateful:['他满脸笑容，一见到你便连连道谢！', '他迎上前来，眼里满是感激……'],
    bored:   ['他百无聊赖地打着哈欠……', '他托着腮，眼神空洞地望着窗外……'],
    excited: ['他兴奋得满脸通红，迫不及待想告诉你什么……', '他两眼放光，拉着你的袖子……'],
    proud:   ['他昂首挺胸，一脸骄傲的神情……', '他忍不住向你炫耀着什么……'],
    happy:   ['他眉开眼笑，看起来心情不错！', '他乐呵呵地跟你打招呼……'],
    trusting:['他朝你点头微笑，目光中满是信任……', '他坦然相迎，显然把你当作了可信赖之人……'],
  };


  const pool = genericMoodGreetings[moodData.mood] || genericMoodGreetings.neutral;
  const idx = Math.floor(Math.random() * pool.length);
  return { text: pool[idx], mood: moodData.mood, emoji: moodInfo.emoji, level };
}

// ── 心情生成引擎（进城/事件触发）─────────────────────────────────
// 心情生成概率：进城时每个城市20%概率，1-2个NPC获得心情
const MOOD_POOL_BY_ROLE = {
  doctor:   ['sad','anxious','grateful','happy'],
  smith:    ['angry','anxious','bored','proud'],
  inn:      ['happy','bored','anxious','grateful'],
  merchant: ['excited','happy','anxious','grateful'],
  tavern:   ['bored','excited','anxious','happy'],
  escort:   ['anxious','fearful','grateful'],
  beggar:   ['sad','grateful','fearful'],
  swordsman:['proud','angry','bored','excited'],
  default:  ['sad','anxious','bored','happy','grateful'],
};

function _pickMoodForNpc(npc) {
  const role = npc.role || '';
  const moodList = (
    MOOD_POOL_BY_ROLE.doctor   ||
    MOOD_POOL_BY_ROLE.merchant ||
    MOOD_POOL_BY_ROLE.default
  );
  // 按职业关键字匹配
  for(const [key, moods] of Object.entries(MOOD_POOL_BY_ROLE)) {
    if(role.includes(key) || (npc.id && npc.id.includes(key))) {
      return moods[Math.floor(Math.random() * moods.length)];
    }
  }
  return MOOD_POOL_BY_ROLE.default[Math.floor(Math.random() * MOOD_POOL_BY_ROLE.default.length)];
}

// 进城时随机生成NPC心情（20%概率，1-2个NPC获得心情）
function generateMoodOnEnterCity(cityId) {
  _ensureMoodStore();
  // 20%概率触发
  if(Math.random() > 0.20) return [];

  const cityNpcs = Object.values(NPC_DB).filter(n => n.city === cityId);
  if(cityNpcs.length === 0) return [];

  // 随机选1-2个NPC
  const count = Math.random() < 0.3 ? 2 : 1;
  const shuffled = cityNpcs.sort(() => Math.random() - 0.5).slice(0, count);
  const results = [];

  for(const npc of shuffled) {
    // 已有活跃心情的跳过
    const existing = npcState.npcMoods[npc.id];
    if(existing && existing.active && existing.mood !== 'neutral') continue;

    const mood = _pickMoodForNpc(npc);
    const level = Math.floor(Math.random() * 3) + 1; // 1-3级
    setNpcMood(npc.id, mood, level, true);

    const moodInfo = MOOD_TYPES[mood] || MOOD_TYPES.neutral;
    results.push({ npcId: npc.id, npcName: npc.name, mood, level, emoji: moodInfo.emoji });

    // 进城时提示
    if(typeof showToast === 'function') {
      setTimeout(() => {
        showToast(`${moodInfo.emoji} 城里${npc.name}看起来${moodInfo.label}……去问问？`, 3000);
      }, 300);
    }
  }
  return results;
}

// 世界事件手动触发NPC心情（供其他系统调用）
function triggerNpcMoodEvent(npcId, mood, level=1) {
  setNpcMood(npcId, mood, level, true);
  const moodInfo = MOOD_TYPES[mood] || MOOD_TYPES.neutral;
  const npc = NPC_DB[npcId];
  if(typeof showToast === 'function' && npc) {
    showToast(`${moodInfo.emoji} ${npc.name}看起来${moodInfo.label}……`, 2500);
  }
}

// 完成NPC任务后，给该NPC添加感激心情（15%概率，level=1-2）
function maybeAddGratefulMood(npcId) {
  const existing = npcState.npcMoods ? npcState.npcMoods[npcId] : null;
  if(existing && existing.active && existing.mood !== 'neutral') return;
  if(Math.random() < 0.15) {
    triggerNpcMoodEvent(npcId, 'grateful', Math.floor(Math.random() * 2) + 1);
  }
}

// NPC交互后随机添加心情（5%概率）
function maybeAddRandomMood(npcId, baseRel) {
  if(Math.random() > 0.05) return;
  const existing = npcState.npcMoods ? npcState.npcMoods[npcId] : null;
  if(existing && existing.active && existing.mood !== 'neutral') return;
  const npc = NPC_DB[npcId];
  if(!npc) return;
  const mood = _pickMoodForNpc(npc);
  const level = Math.floor(Math.random() * 3) + 1;
  setNpcMood(npcId, mood, level, true);
}

// ═══════════════════════════════════════════════════════════════════
//  情境任务进度更新（击杀/收集进度）
// ═══════════════════════════════════════════════════════════════════

function updateContextualProgress(instanceId, delta) {
  if(!npcState.quests) npcState.quests = {};
  const progKey = instanceId + '_prog';
  const prog = (npcState.quests[progKey] || 0) + delta;
  npcState.quests[progKey] = prog;

  const q = getAnyQuest(instanceId);
  const need = q?.targetCount || 1;

  if(prog >= need) {
    npcState.quests[progKey] = need;
    setQuestStatus(instanceId, 'done');

    // 赏金完成：强化通知
    if(instanceId.startsWith('bty_')){
      const bounty = getDailyBounties().find(b => b.instanceId === instanceId);
      const reward = bounty ? (bounty.silver || 0) : 0;
      if(typeof showToast === 'function'){
        // 大额赏金用更醒目的方式提示
        const tierColor = bounty?.tier === 'elite' ? '#ffd700' : bounty?.tier === 'major' ? '#e8b060' : '#80ff80';
        showToast(`🎉 赏金任务完成！💰 ${reward}两 → 回城领取！`, 'good');
      }
      // 赏金榜角标闪烁
      if(typeof townRefreshBountyBadge === 'function') townRefreshBountyBadge();
      // 赏金板内刷新（赏金榜已打开时）
      if(typeof _renderBountyCards === 'function'){
        setTimeout(_renderBountyCards, 100);
      }
    } else {
      // 普通情境任务
      if(typeof showToast === 'function'){
        showToast(`📋 任务完成：${q?.name || instanceId} → 可领取奖励！`, 3000);
      }
    }
  }
  npcStateSave();
}

// ── window 暴露 ──
window.checkContextualTriggers    = checkContextualTriggers;
window.triggerContextualCity      = triggerContextualCity;
window.triggerContextualDungeon   = triggerContextualDungeon;
window.triggerContextualLevel     = triggerContextualLevel;
window.triggerContextualAction    = triggerContextualAction;
window.triggerContextualItem      = triggerContextualItem;
window.getContextualQuests        = getContextualQuests;
window.getActiveContextualCount   = getActiveContextualCount;
window.claimContextualReward      = claimContextualReward;
window.updateContextualProgress   = updateContextualProgress;
// 心情系统
window.getNpcMood                 = getNpcMood;
window.setNpcMood                 = setNpcMood;
window.clearNpcMood              = clearNpcMood;
window.checkNpcMoodsOnEnter       = checkNpcMoodsOnEnter;
window.getActiveMoodNpcs          = getActiveMoodNpcs;
window.acceptMoodQuest            = acceptMoodQuest;
window.claimMoodQuestReward      = claimMoodQuestReward;
window.updateMoodQuestProgress   = updateMoodQuestProgress;
window.getMoodQuests             = getMoodQuests;
window.getMoodGreeting           = getMoodGreeting;
window.generateMoodOnEnterCity   = generateMoodOnEnterCity;
window.triggerNpcMoodEvent       = triggerNpcMoodEvent;
window.maybeAddGratefulMood      = maybeAddGratefulMood;
window.maybeAddRandomMood        = maybeAddRandomMood;



