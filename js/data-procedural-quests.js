// ═══════════════════════════════════════════════════════════════════
//  data-procedural-quests.js  —  动态参数化任务系统
//  任务根据玩家等级、地点、时间动态生成参数
// ═══════════════════════════════════════════════════════════════════

// ── 通缉令任务 ──
const BOUNTY_TEMPLATES = [
  { id: 'bounty_kill_1', type: 'kill', targetType: 'func', baseReward: 30, levelRange: [1, 15], namePool: ['山匪甲', '流寇乙', '草寇丙'], descTemplate: '悬赏缉拿「{name}」，据说在{nameLoc}附近出没。' },
  { id: 'bounty_kill_2', type: 'kill', targetType: 'major', baseReward: 80, levelRange: [15, 30], namePool: ['血刀门弟子', '黑风寨二当家', '魔教外围'], descTemplate: '江湖悬赏「{name}」，此人作恶多端，赏金从优。' },
  { id: 'bounty_kill_3', type: 'kill', targetType: 'elite', baseReward: 200, levelRange: [30, 50], namePool: ['通缉要犯「{name}」', '叛门高手', '亡命宗师'], descTemplate: '最高级别通缉！缉拿「{name}」，务必小心！' },
  { id: 'bounty_collect_1', type: 'collect', itemType: 'herb', count: 5, baseReward: 20, levelRange: [1, 10], namePool: ['止血草', '清热叶', '解毒藤'], descTemplate: '急需{name}入药，采集{name}株即可。' },
  { id: 'bounty_collect_2', type: 'collect', itemType: 'herb', count: 10, baseReward: 50, levelRange: [10, 25], namePool: ['百年灵芝', '天山雪莲', '九转还魂草'], descTemplate: '重金求购{name}，数量有限，先到先得。' },
  { id: 'bounty_escort_1', type: 'escort', baseReward: 40, levelRange: [5, 20], namePool: ['富商', '官家小姐', '落难书生'], descTemplate: '护送{name}安全抵达{toCity}，路途凶险。' },
  { id: 'bounty_escort_2', type: 'escort', baseReward: 100, levelRange: [20, 40], namePool: ['朝廷命官', '武林世家', '名门弟子'], descTemplate: '护送贵客{name}前往{toCity}，报酬丰厚。' },
  { id: 'bounty_duel_1', type: 'duel', targetType: 'func', baseReward: 50, levelRange: [5, 20], namePool: ['武馆馆主', '地方豪杰', '挑衅游侠'], descTemplate: '擂台征战！击败「{name}」，声威大振。' },
  { id: 'bounty_duel_2', type: 'duel', targetType: 'major', baseReward: 120, levelRange: [20, 40], namePool: ['江湖高手', '门派精英', '武林宿将'], descTemplate: '英雄帖！与「{name}」约战，一决高下！' },
  { id: 'bounty_duel_3', type: 'duel', targetType: 'elite', baseReward: 280, levelRange: [35, 55], namePool: ['当世一流高手', '无名宗师', '绝世剑客'], descTemplate: '擂台挑战！「{name}」已连胜十场，无人能破，赏金颇丰！' },
];

// ── 每日委托任务（城市专属） ──
const DAILY_QUEST_TEMPLATES = {
  luoyang: [
    { type: 'collect', desc: '少林寺僧人：寺中缺{count}株解毒草，带至少林寺交付。', item: '解毒草', count: 3, reward: 25 },
    { type: 'kill', desc: '镖局告示：官道附近山贼作乱，击杀{count}名山贼。', enemy: '山贼', count: 5, reward: 30 },
    { type: 'collect', desc: '杏林堂药材告急！征集{count}株名贵药材。', item: '灵芝', count: 3, reward: 40 },
  ],
  kaifeng: [
    { type: 'kill', desc: '开封府衙公告：城内采花大盗为祸，击杀{count}名淫贼。', enemy: '淫贼', count: 3, reward: 35 },
    { type: 'collect', desc: '大相国寺需要{count}块上等精铁打造法器。', item: '精铁', count: 5, reward: 30 },
    { type: 'collect', desc: '皇家园林急需珍稀花卉，征集{count}朵稀有花朵。', item: '牡丹', count: 3, reward: 45 },
  ],
  yangzhou: [
    { type: 'collect', desc: '盐商高价收购{count}条鲜鱼，需江河野生。', item: '鲤鱼', count: 5, reward: 25 },
    { type: 'kill', desc: '瘦西湖水寇为患，击杀{count}名水寇可获报酬。', enemy: '水寇', count: 5, reward: 35 },
    { type: 'collect', desc: '青楼女子求助：需要{count}瓶上等女儿红。', item: '女儿红', count: 2, reward: 30 },
  ],
  hangzhou: [
    { type: 'collect', desc: '西湖龙井茶庄收购{count}两雨前龙井。', item: '龙井', count: 3, reward: 40 },
    { type: 'collect', desc: '雷峰塔下采集{count}株塔下幽兰可镇压邪气。', item: '幽兰', count: 3, reward: 35 },
    { type: 'kill', desc: '钱塘江上江洋大盗出没，击杀{count}名水贼。', enemy: '水贼', count: 4, reward: 45 },
  ],
  cangzhou: [
    { type: 'collect', desc: '镖局急单：需要{count}块精铁护送至关外。', item: '精铁', count: 5, reward: 35 },
    { type: 'kill', desc: '沧州武馆收徒，击杀{count}名踢馆者以证实力。', enemy: '踢馆者', count: 3, reward: 30 },
    { type: 'collect', desc: '燕赵酒家采购{count}坛陈年老酒。', item: '汾酒', count: 3, reward: 35 },
  ],
  chengdu: [
    { type: 'collect', desc: '唐门弟子求购{count}份淬毒材料。', item: '毒草', count: 3, reward: 40 },
    { type: 'collect', desc: '蜀绣坊需要{count}种稀有丝线。', item: '蜀锦', count: 3, reward: 35 },
    { type: 'kill', desc: '峨眉派弟子求助：山下野兽伤人，击杀{count}只。', enemy: '野兽', count: 5, reward: 50 },
  ],
  changan: [
    { type: 'collect', desc: '皇宫内廷急用{count}株千年灵芝！', item: '千年灵芝', count: 1, reward: 80 },
    { type: 'kill', desc: '大理寺通缉要犯，击杀{count}名江湖败类。', enemy: '江湖败类', count: 5, reward: 60 },
    { type: 'collect', desc: '丝绸之路商人需要{count}件防身武器。', item: '短剑', count: 2, reward: 45 },
  ],
  youzhou: [
    { type: 'kill', desc: '边关急报！契丹武士犯境，击杀{count}名敌兵。', enemy: '契丹武士', count: 5, reward: 55 },
    { type: 'collect', desc: '幽州药铺征集{count}株塞外雪莲，可治寒毒。', item: '雪莲', count: 2, reward: 50 },
    { type: 'collect', desc: '军营急需{count}件精铁甲胄。', item: '铁甲', count: 2, reward: 60 },
  ],
  suzhou: [
    { type: 'collect', desc: '苏州绣坊收购{count}件苏绣成品。', item: '苏绣', count: 3, reward: 35 },
    { type: 'collect', desc: '太湖渔民求购{count}条太湖银鱼。', item: '银鱼', count: 5, reward: 25 },
    { type: 'kill', desc: '虎丘剑派弟子：山下有恶霸伤人，击杀{count}名。', enemy: '恶霸', count: 3, reward: 40 },
  ],
  dalis: [
    { type: 'collect', desc: '大理药商收购{count}株南国草药。', item: '南国草', count: 5, reward: 30 },
    { type: 'collect', desc: '段氏皇族需要{count}件上等翡翠饰品。', item: '翡翠', count: 2, reward: 60 },
    { type: 'kill', desc: '大理城外毒虫泛滥，击杀{count}只毒虫。', enemy: '毒虫', count: 5, reward: 35 },
  ],
  // 通用任务（任何城市都可能刷出）
  common: [
    { type: 'collect', desc: '神秘人需要{count}株{name}，放城门口即可。', item: '解毒草', count: 3, reward: 25 },
    { type: 'collect', desc: '某富商悬赏{count}两求购{name}。', item: '鲤鱼', count: 3, reward: 30 },
    { type: 'kill', desc: '江湖救急！击杀{count}名{name}可获赏金。', enemy: '山贼', count: 5, reward: 30 },
    { type: 'escort', desc: '有贵人需护送至{toCity}，报酬{reward}两。', toCity: '长安', count: 1, reward: 50 },
    { type: 'escort', desc: '镖局委托：护送一批货物至{toCity}，路上小心劫匪。', toCity: '洛阳', count: 1, reward: 45 },
    { type: 'escort', desc: '一位老掌柜独自赶路，请护送至{toCity}，他说会厚谢。', toCity: '苏州', count: 1, reward: 40 },
    { type: 'duel', desc: '武馆贴出擂台挑战书，击败馆内高手即可领赏。', enemy: 'major', count: 1, reward: 55, duelNarrative: '武馆弟子摆好架势，眼神凌厉，一副胜券在握的样子。' },
    { type: 'duel', desc: '城中豪杰广发英雄帖，击败本地擂台主可得丰厚赏金。', enemy: 'major', count: 1, reward: 70, duelNarrative: '擂台上的对手抱拳行礼，随即拉开了战斗架势。' },
    { type: 'duel', desc: '江湖好汉设擂比武，只为寻访天下高手，胜者有重金。', enemy: 'func', count: 1, reward: 35, duelNarrative: '对方哈哈一笑："少侠，请赐教！"' },
  ]
};

// ── 随机奇遇模板 ──
const RANDOM_ENCOUNTER_TEMPLATES = [
  // 野外奇遇
  { zone: 'mountains', type: 'choice',
    desc: '山路旁发现一名重伤侠客，他说有要事相托……',
    options: [
      { text: '出手相救', rewards: { silver: 50, exp: 30 }, charmDelta: 5 },
      { text: '给予银两', rewards: { silver: 20 }, charmDelta: 2 },
      { text: '冷漠离去', effect: { charmDelta: -5 } }
    ]
  },
  { zone: 'forest', type: 'choice',
    desc: '林中偶遇一株散发异香的奇花，似乎是罕见灵药……',
    options: [
      { text: '采摘灵药', rewards: { item: '幽林奇花', type: 'herb' }, exp: 15 },
      { text: '留下标记', rewards: { exp: 10 } },
      { text: '小心离开', rewards: { exp: 5 } }
    ]
  },
  { zone: 'river', type: 'choice',
    desc: '河边发现一个神秘包裹，内有银两和一张藏宝图碎片……',
    options: [
      { text: '收下银两', rewards: { silver: 30 } },
      { text: '研究藏宝图', rewards: { item: '藏宝图碎片', type: 'quest' }, exp: 20 },
      { text: '等待失主', rewards: { silver: 100 }, charmDelta: 10, chance: 0.3 }
    ]
  },
  // 城镇奇遇
  { zone: 'market', type: 'choice',
    desc: '街头有人欺负一个卖艺老人……',
    options: [
      { text: '出手相助', rewards: { silver: 20, exp: 20 }, charmDelta: 5 },
      { text: '暗中周旋', rewards: { silver: 15, exp: 10 }, charmDelta: 2 },
      { text: '视而不见', effect: { charmDelta: -3 } }
    ]
  },
  { zone: 'inn', type: 'choice',
    desc: '酒馆角落有人在低声谈论江湖秘辛……',
    options: [
      { text: '偷听情报', rewards: { exp: 15 }, intel: ['secret_bounty'] },
      { text: '大方请酒', rewards: { silver: 10, exp: 15 }, intel: ['secret_bounty', 'secret_sect'] },
      { text: '专心吃饭', rewards: { hp: 20 } }
    ]
  },
  { zone: 'shop', type: 'choice',
    desc: '杂货铺老板神秘兮兮地叫住你，说有一批"特殊货物"……',
    options: [
      { text: '查看货物', rewards: { item: '随机武器', type: 'weapon', rarity: 'rare' } },
      { text: '拒绝离开', rewards: { exp: 5 } },
      { text: '讨价还价', rewards: { silver: -20, item: '稀有物品', rarity: 'epic' } }
    ]
  },
  // 地下城奇遇
  { zone: 'dungeon', type: 'choice',
    desc: '地下城中偶遇一名被困的侠女，她请求帮忙传信……',
    options: [
      { text: '答应传信', rewards: { quest: 'deliver_letter_urgent' } },
      { text: '给她食物', rewards: { silver: 10, exp: 15 } },
      { text: '强行破门', rewards: { exp: 25 }, effect: { hpDelta: -20 } }
    ]
  },
  { zone: 'dungeon', type: 'choice',
    desc: '发现一处隐藏宝箱，但旁边有一只沉睡的守护兽……',
    options: [
      { text: '悄悄开锁', rewards: { silver: 50, item: '稀有装备' }, chance: 0.6 },
      { text: '唤醒击杀', rewards: { silver: 30, item: '史诗装备', exp: 50 } },
      { text: '放弃离开', rewards: {} }
    ]
  },
];

// ── 难度缩放 ──
function scaleRewardByLevel(baseReward, playerLevel, targetLevel) {
  const diff = targetLevel - playerLevel;
  let mult = diff >= 10 ? 1.8 : diff >= 5 ? 1.4 : diff >= 0 ? 1.2 : diff >= -5 ? 1.0 : diff >= -10 ? 0.7 : 0.5;
  return Math.floor(baseReward * mult);
}

// ── 动态生成通缉令 ──
function generateBountyQuest(playerLevel, city) {
  const suitable = BOUNTY_TEMPLATES.filter(t => playerLevel >= t.levelRange[0] && playerLevel <= t.levelRange[1] + 5);
  if (!suitable.length) return null;
  
  const t = suitable[Math.floor(Math.random() * suitable.length)];
  const name = t.namePool[Math.floor(Math.random() * t.namePool.length)];
  const targetLevel = Math.max(1, Math.min(50, playerLevel + Math.floor(Math.random() * 11) - 5));
  const reward = scaleRewardByLevel(t.baseReward, playerLevel, targetLevel);
  
  const zones = { luoyang: '少林寺', kaifeng: '开封城外', yangzhou: '瘦西湖', hangzhou: '钱塘江', cangzhou: '沧州官道', chengdu: '蜀道', changan: '长安郊外', youzhou: '幽州边关' };
  
  return {
    id: `bounty_${Date.now()}`,
    source: 'bounty',
    badge: '🔴',
    title: `通缉：${name}`,
    desc: t.descTemplate.replace('{name}', name).replace('{nameLoc}', zones[city] || '附近'),
    type: t.type,
    targetLevel,
    city,
    reward: { silver: reward, exp: Math.floor(reward * 0.6) },
    targetType: t.targetType,
    targetCount: t.id.includes('3') ? 1 : (t.id.includes('2') ? 1 : 2),
    count: 0,
    required: t.type === 'kill' ? 1 : (t.count || 5),
    expireTime: Date.now() + 24 * 60 * 60 * 1000
  };
}

// ── 生成每日委托 ──
function generateDailyQuests(playerLevel, city, count = 3) {
  const cityTasks = DAILY_QUEST_TEMPLATES[city] || [];
  const commonTasks = DAILY_QUEST_TEMPLATES.common;
  const allTasks = [...cityTasks, ...commonTasks].filter(t => {
    const reqLevel = t.item === '千年灵芝' || t.item === '雪莲' ? 25 : t.item === '翡翠' ? 20 : t.enemy === '契丹武士' ? 20 : 1;
    return playerLevel >= reqLevel;
  });
  
  const selected = allTasks.sort(() => Math.random() - 0.5).slice(0, count);
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
  
  return selected.map((t, i) => {
    const reward = scaleRewardByLevel(t.reward, playerLevel, playerLevel);
    let desc = t.desc.replace('{count}', t.count).replace('{name}', t.item || t.enemy || '');
    if (t.toCity) desc = desc.replace('{toCity}', t.toCity).replace('{reward}', reward);
    
    return {
      id: `daily_${Date.now()}_${i}`,
      source: 'daily',
      badge: '📋',
      title: '每日委托',
      desc: desc,
      type: t.type,
      city,
      item: t.item,
      enemy: t.enemy,
      count: 0,
      required: t.count,
      reward: { silver: reward, exp: Math.floor(reward * 0.5) },
      expireTime: tomorrow.getTime()
    };
  });
}

// ── 触发随机奇遇 ──
function triggerRandomEncounter(playerLevel, zone, existingState) {
  const encounters = RANDOM_ENCOUNTER_TEMPLATES.filter(e => e.zone === zone);
  if (!encounters.length) return null;
  
  const encounter = encounters[Math.floor(Math.random() * encounters.length)];
  
  return {
    id: `encounter_${Date.now()}`,
    source: 'encounter',
    badge: '✨',
    title: '奇遇',
    desc: encounter.desc,
    type: 'choice',
    zone,
    options: encounter.options.map((opt, i) => ({
      index: i,
      text: opt.text,
      preview: opt.rewards ? formatRewardPreview(opt.rewards) : (opt.effect ? '无奖励' : '')
    }))
  };
}

function formatRewardPreview(r) {
  const parts = [];
  if (r.silver) parts.push(`${r.silver}两`);
  if (r.exp) parts.push(`${r.exp}经验`);
  if (r.item) parts.push(r.item);
  return parts.join(' / ') || '?';
}

// ── 执行奇遇选择 ──
function resolveEncounterChoice(encounter, choiceIndex, playerState) {
  const option = RANDOM_ENCOUNTER_TEMPLATES.find(e => e.id === encounter.id || e.zone === encounter.zone)?.options[choiceIndex];
  if (!option) return null;
  
  // 概率判定
  if (option.chance && Math.random() > option.chance) {
    return { result: 'failed', message: '未能成功……', rewards: {} };
  }
  
  const rewards = { ...option.rewards };
  const effects = { ...(option.effect || {}) };
  
  // 应用奖励
  if (rewards.silver) playerState.silver = (playerState.silver || 0) + rewards.silver;
  if (rewards.exp) playerState.exp = (playerState.exp || 0) + rewards.exp;
  if (option.charmDelta) playerState.charm = (playerState.charm || 0) + option.charmDelta;
  if (effects.hpDelta) playerState.hp = Math.max(1, (playerState.hp || 100) + effects.hpDelta);
  
  return {
    result: 'success',
    rewards,
    effects,
    playerState
  };
}
