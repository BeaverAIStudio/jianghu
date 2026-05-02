// ════════════════════════════════════════════════════════════════
//  origin-generator.js  出身生成系统 v305
//  负责：工作室Logo动画、出生起名、出身背景、随机事件链、属性影响
//  v305：修复BGM听不到问题（AudioContext预热+音量提升3~4倍）
//  v304：扩充成长事件（72→120），大幅增加负面事件比例，江湖更坎坷
//  v302：增大字号适配手机、字符画自适应缩放+呼吸微动画+氛围粒子增强
//  v301：修复模板字符串内反引号转义
//  v300：全自动出身动画+16种出身+12段事件链+外貌自动生成
// ════════════════════════════════════════════════════════════════

const ORIGIN_KEY = 'wuxia_origin_data';

// ── 游戏信息 ──
const GAME_INFO = {
  name: '江湖将将胡',
  subtitle: 'Jianghu Jiang Jiang Hu',
  logo: [
    '╔═════════════════════════════════════════════════════════════════════════════════╗',
    '║                                                                                 ║',
    '║   ▄▄         ▄    ▄▄  ██  ▄▄▄▄▄     █   ▄█          █   ▄█          █    ▄▄▄▄▄  ║',
    '║    ▀▀ ▀▀▀██▀▀▀     ▀▄▄██▄ █   █  █▄ █ ▄█▀▀▀▀██   █▄ █ ▄█▀▀▀▀██   ▄▄▄█▄▄▄ █   █  ║',
    '║  ▄▄      ██      █▄   ██  ██▄██   █▀█    ███▀     █▀█    ███▀       █    █▀▀▀█  ║',
    '║   ▀▀     ██        ▀ ▄██▄ █   █    ▄█  █▀▀  █      ▄█  █▀▀  █     ▄██▄▄  █   █  ║',
    '║    ▄▄    ██        ▄ █  █ █▀▀▀█   ▄▀█ ▀▀▀▀▀▀█▀▀   ▄▀█ ▀▀▀▀▀▀█▀▀   █   █ ██▀▀▀█  ║',
    '║   ▄█     ██       █  █▀▀█▄█   █  ▀  █   █▄  █    ▀  █   █▄  █     █▀▀██ █    █  ║',
    '║  ▄█  ██████████  █▀  ▀  ▄█  ▄▄█     █      ▄█       █      ▄█     ▀   ██▀  ▄▄█  ║',
    '║                         ▀           ▀               ▀                           ║',
    '║                                                                                 ║',
    '╚═════════════════════════════════════════════════════════════════════════════════╝',
  ],
};

const STUDIO_INFO = {
  name: '河狸AI游戏工作室',
  subtitle: 'Beaver AI Game Studio',
};

// ── 出身背景（16种） ──
const FAMILY_BACKGROUNDS = [
  {
    id: 'blacksmith',
    name: '铁匠世家',
    familySurnames: ['张', '赵', '王', '刘'],
    profession: '铁匠',
    hometown: '沧州',
    baseStats: { str: 2, con: 1 },
    description: '世代以打铁为生，你从小在炉火旁长大，耳濡目染之下练就了过人的臂力。父亲常说：好刀好剑皆由火中淬炼而来。',
    bonus: '力量+2，体质+1',
    portrait: 'forge',
  },
  {
    id: 'scholar',
    name: '书香门第',
    familySurnames: ['林', '苏', '沈', '柳'],
    profession: '书生',
    hometown: '杭州',
    baseStats: { int: 2, cha: 1 },
    description: '家中藏书万卷，自幼饱读诗书。父亲是当地有名的才子，母亲出身名门，琴棋书画样样精通。你虽体弱，却心智过人。',
    bonus: '悟性+2，魅力+1',
    portrait: 'scholar',
  },
  {
    id: 'martial',
    name: '武林世家',
    familySurnames: ['杨', '岳', '萧', '秦'],
    profession: '武人',
    hometown: '襄阳',
    baseStats: { str: 1, agi: 1, con: 1 },
    description: '祖上出过三位武林高手，家族世代习武。家传拳法虽非绝世武学，却是扎实根基。你自幼闻鸡起舞，打下了一身好筋骨。',
    bonus: '力量+1，速度+1，体质+1',
    portrait: 'martial',
  },
  {
    id: 'merchant',
    name: '商贾之家',
    familySurnames: ['钱', '周', '吴', '郑'],
    profession: '商人',
    hometown: '扬州',
    baseStats: { cha: 2, luk: 1 },
    description: '家中经营绸缎庄，往来皆是富贵人家。你自幼见多识广，善于察言观色，懂得人情世故。不过纨绔子弟的标签也一直跟着你。',
    bonus: '魅力+2，运气+1',
    portrait: 'merchant',
  },
  {
    id: 'farmer',
    name: '农家子弟',
    familySurnames: ['李', '陈', '黄', '何'],
    profession: '农夫',
    hometown: '成都',
    baseStats: { con: 2, luk: 1 },
    description: '面朝黄土背朝天，日出而作日落而息。农家生活虽然清苦，却也养成了你吃苦耐劳的性子。田野间的自在奔跑给了你强健的体魄。',
    bonus: '体质+2，运气+1',
    portrait: 'farmer',
  },
  {
    id: 'doctor',
    name: '医者世家',
    familySurnames: ['华', '白', '温', '薛'],
    profession: '大夫',
    hometown: '大理',
    baseStats: { int: 1, con: 1, cha: 1 },
    description: '祖传医术名震一方，父亲悬壶济世从不收穷苦之人的药钱。你从小在药圃中长大，辨识百草，耳濡目染之下对医理颇有心得。',
    bonus: '悟性+1，体质+1，魅力+1',
    portrait: 'doctor',
  },
  {
    id: 'orphan',
    name: '孤儿流浪',
    familySurnames: ['阿', '小', '无名'],
    profession: '流浪儿',
    hometown: '洛阳',
    baseStats: { agi: 2, luk: 1 },
    description: '你不记得父母是谁，从小在街头巷尾摸爬滚打。偷过馒头、挨过打、睡过破庙。苦难没有击垮你，反而让你变得机警灵敏。',
    bonus: '速度+2，运气+1',
    portrait: 'orphan',
  },
  {
    id: 'official',
    name: '官宦子弟',
    familySurnames: ['韩', '宋', '曹', '方'],
    profession: '官家',
    hometown: '京城',
    baseStats: { int: 1, cha: 2 },
    description: '父亲在朝廷为官，家中规矩森严。你自幼请了最好的先生教导文武，虽养尊处优却也有真才实学。可惜好景不长，一场变故让家族没落……',
    bonus: '悟性+1，魅力+2',
    portrait: 'official',
  },
  {
    id: 'pirate',
    name: '海寇之后',
    familySurnames: ['郑', '马', '侯', '罗'],
    profession: '海寇',
    hometown: '泉州',
    baseStats: { str: 1, agi: 1, luk: 1 },
    description: '父亲曾是东海之上令商船闻风丧胆的海寇头子。后来金盆洗手在泉州港开了间酒馆，但那股子桀骜不驯的劲儿刻在了你骨子里。你从小在海边长大，风浪中练就了一副好胆识。',
    bonus: '力量+1，速度+1，运气+1',
    portrait: 'pirate',
  },
  {
    id: 'performer',
    name: '江湖戏班',
    familySurnames: ['程', '梅', '荀', '尚'],
    profession: '戏子',
    hometown: '苏州',
    baseStats: { cha: 2, agi: 1 },
    description: '你生在一个走南闯北的江湖戏班里，生旦净末丑样样在行。戏台上是才子佳人，戏台下是风餐露宿。你学会了察颜观色、逢场作戏，也学会了用唱腔藏住眼泪。',
    bonus: '魅力+2，速度+1',
    portrait: 'performer',
  },
  {
    id: 'hunter',
    name: '深山猎户',
    familySurnames: ['段', '穆', '石', '龚'],
    profession: '猎户',
    hometown: '晋阳',
    baseStats: { agi: 2, str: 1 },
    description: '祖辈三代以打猎为生，住在太行山深处。你从小跟着父亲上山下套、追踪猎物，练就了鹰一般的眼睛和猎豹一般的速度。山林就是你的家，飞禽走兽都逃不过你的目光。',
    bonus: '速度+2，力量+1',
    portrait: 'hunter',
  },
  {
    id: 'beggar',
    name: '丐帮子弟',
    familySurnames: ['洪', '鲁', '解', '白'],
    profession: '乞丐',
    hometown: '开封',
    baseStats: { con: 1, luk: 2 },
    description: '你出生在丐帮一个分舵中，打记事起就跟着帮中长辈沿街乞讨。虽然衣衫褴褛，但丐帮有自己的规矩和义气。你在市井中摸爬滚打，学会了忍辱负重，也见识了人间冷暖。',
    bonus: '体质+1，运气+2',
    portrait: 'beggar',
  },
  {
    id: 'monk',
    name: '佛门弃婴',
    familySurnames: ['释', '觉', '慧', '空'],
    profession: '小沙弥',
    hometown: '嵩山',
    baseStats: { int: 2, con: 1 },
    description: '你是被丢弃在少林寺山门前的一个寒冬清晨被老方丈捡回来的。在晨钟暮鼓中长大，扫地挑水、抄经打坐，日子清苦却安宁。你虽未正式剃度，但佛法已融入骨髓。',
    bonus: '悟性+2，体质+1',
    portrait: 'monk',
  },
  {
    id: 'boatman',
    name: '船家后人',
    familySurnames: ['江', '河', '沈', '渡'],
    profession: '船夫',
    hometown: '岳阳',
    baseStats: { con: 2, agi: 1 },
    description: '世代在洞庭湖上以摆渡为生。你从小在摇晃的船板上长大，风里来雨里去，练就了过人的平衡感和坚韧的筋骨。洞庭湖的日升月落、渔歌唱晚，是你最美的记忆。',
    bonus: '体质+2，速度+1',
    portrait: 'boatman',
  },
  {
    id: 'fisherman',
    name: '渔村少年',
    familySurnames: ['海', '渔', '波', '澜'],
    profession: '渔民',
    hometown: '明州',
    baseStats: { con: 1, str: 1, luk: 1 },
    description: '东海之滨的小渔村，日出撒网、日落归港。你从小在浪涛中嬉戏，十二岁便能独自驾船出海。大海教会了你敬畏自然，也给了你宽广的胸怀和朴实的心性。',
    bonus: '体质+1，力量+1，运气+1',
    portrait: 'fisherman',
  },
  {
    id: 'musician',
    name: '流浪乐师',
    familySurnames: ['琴', '萧', '钟', '乐'],
    profession: '乐师',
    hometown: '洛阳',
    baseStats: { int: 1, cha: 2 },
    description: '父亲是远近闻名的琴师，一把古琴弹尽悲欢离合。你继承了父亲的音乐天赋，三岁识谱、五岁抚琴。琴声里有山川河流、有爱恨情仇，你从中读懂了常人看不到的世界。',
    bonus: '悟性+1，魅力+2',
    portrait: 'musician',
  },
];

// ═══════════════════════════════════════════════════════════════
//  "将将胡"夭折事件表：生死无常，有些孩子活不到成年
// ═══════════════════════════════════════════════════════════════
const TRAGIC_DEATH_EVENTS = [
  {
    id: 'death_plague',
    event: '瘟疫夺命',
    description: '一场突如其来的瘟疫席卷了你的家乡。你高烧不退，浑身起满红疹。大夫摇着头说没救了。母亲在床边哭了三天三夜，最终你在她的怀里咽下了最后一口气。',
    maxAge: 5,
    season: '那年春天',
  },
  {
    id: 'death_flood',
    event: '洪水溺亡',
    description: '暴雨下了整整七天，河水决堤。你还没来得及逃上屋顶，就被卷入了浊浪之中。最后一刻，你看到父亲拼命向你游来，但一切都太晚了。',
    maxAge: 8,
    season: '那年夏天',
  },
  {
    id: 'death_bandits',
    event: '山匪屠村',
    description: '一伙山匪洗劫了你的村庄。你躲在米缸里，透过缝隙看到父母倒在血泊中。你被发现了，刀光一闪，世界陷入了永恒的黑暗。',
    maxAge: 12,
    season: '那年秋天',
  },
  {
    id: 'death_famine',
    event: '饥荒饿死',
    description: '大旱三年，颗粒无收。家里最后一点存粮也吃完了，你开始吃树皮、吃泥土。肚子胀得像鼓，却越来越瘦。那个冬天，你再也没有醒来。',
    maxAge: 10,
    season: '那年冬天',
  },
  {
    id: 'death_accident',
    event: '意外身亡',
    description: '你只是想去够树上的风筝，脚下一滑，从屋顶摔了下来。没有痛苦，只是一瞬间的黑暗。大人们说，这是命。',
    maxAge: 7,
    season: '那年午后',
  },
  {
    id: 'death_poison',
    event: '误食毒物',
    description: '后山的野果看起来很诱人，你摘了一把塞进嘴里。很快，肚子像被刀绞一样疼。你吐着白沫，在送往医馆的路上停止了呼吸。',
    maxAge: 6,
    season: '那年盛夏',
  },
  {
    id: 'death_fire',
    event: '火灾殒命',
    description: '半夜被浓烟呛醒，整个房子都在燃烧。你哭喊着找父母，但火势太大，根本逃不出去。浓烟吞噬了你的意识，火焰吞噬了你的身躯。',
    maxAge: 9,
    season: '那年冬夜',
  },
  {
    id: 'death_wolf',
    event: '野狼袭击',
    description: '你独自去后山采蘑菇，遇到了一匹饿狼。它盯着你，你也盯着它。你转身想跑，但它比你更快。最后的记忆是喉咙上传来的剧痛。',
    maxAge: 8,
    season: '那年黄昏',
  },
];

// ── 夭折概率配置 ──
// 古代逻辑：年龄越小越容易夭折（婴儿/幼儿期最危险）
const DEATH_CHANCE = {
  base: 0.08,      // 基础8%（1岁时最高）
  ageDecay: 0.007, // 每增加一岁-0.7%（逐渐降低）
  lukProtect: 0.005, // 每点运气-0.5%
  minChance: 0.003, // 最低0.3%
};

// ═══════════════════════════════════════════════════════════════
//  "将将胡"奇遇事件表：极低概率触发的特殊经历
// ═══════════════════════════════════════════════════════════════
const WONDER_EVENTS = [
  {
    id: 'wonder_mystic_master',
    event: '偶遇隐世高人',
    description: '一个雨夜，一位白发老者敲开你家的门借宿。他见你根骨奇特，便传了你一套呼吸吐纳之法。第二天醒来，老者已不见踪影，只留下一张写着"缘"字的纸条。',
    effects: { str: 1, agi: 1, con: 1, int: 1 },
    appearance: 'martial_aura',
    mood: 'mysterious',
    minAge: 8,
  },
  {
    id: 'wonder_spirit_beast',
    event: '灵兽认主',
    description: '深山中，一只通体雪白的狐狸突然出现在你面前。它没有逃跑，反而亲昵地蹭了蹭你的裤脚。从那以后，你总能感觉到它的存在，仿佛多了一个看不见的守护者。',
    effects: { luk: 3, cha: 2 },
    appearance: 'wild',
    mood: 'lucky',
    minAge: 5,
  },
  {
    id: 'wonder_ancient_tomb',
    event: '误入古墓得传承',
    description: '你追逐一只野兔掉进了一个深坑，却发现这是一座古墓。在墓室的墙壁上，你看到了一套完整的武学图谱。虽然当时不懂，但那些招式深深刻在了你的脑海里。',
    effects: { str: 2, agi: 2, int: 1 },
    appearance: 'sword_intent',
    mood: 'mysterious',
    minAge: 10,
  },
  {
    id: 'wonder_divine_medicine',
    event: '误食天材地宝',
    description: '饥饿难耐时，你摘了一颗散发着异香的野果吃下。顿时一股热流从丹田升起，浑身经脉仿佛被打通一般。虽然过程痛苦万分，但醒来后你发现自己脱胎换骨。',
    effects: { con: 3, hp: 20 },
    appearance: 'blush',
    mood: 'lucky',
    minAge: 3,
  },
  {
    id: 'wonder_demon_encounter',
    event: '夜遇魔头',
    description: '月圆之夜，一个黑影闯入你的房间。就在你以为必死无疑时，那魔头却只是盯着你看了许久，最后留下一句"有意思"便消失不见。从那以后，你偶尔会做一些奇怪的梦。',
    effects: { int: 2, cha: -1, luk: 2 },
    appearance: 'dark_aura',
    mood: 'scary',
    minAge: 7,
  },
  {
    id: 'wonder_fallen_immortal',
    event: '谪仙托梦',
    description: '连续七夜，同一个白衣女子出现在你梦中。她不言不语，只是在你面前舞剑。醒来后，你发现自己竟能模仿出那剑法的几分神韵。',
    effects: { agi: 2, int: 2 },
    appearance: 'elegant',
    mood: 'mysterious',
    minAge: 6,
  },
  {
    id: 'wonder_karmic_debt',
    event: '前世因果',
    description: '一位游方道士见到你后大惊失色，连称"像，太像了"。他说你与他一位故人年轻时一模一样，硬要送你一块玉佩。戴上玉佩后，你偶尔会闪过一些不属于自己的记忆碎片。',
    effects: { luk: 2, int: 1, cha: 1 },
    appearance: 'mystic_mark',
    mood: 'mysterious',
    minAge: 5,
  },
  {
    id: 'wonder_blood_awakening',
    event: '血脉觉醒',
    description: '一次重伤后，你的血液突然变得滚烫。伤口愈合速度快得惊人，力量也比从前大了许多。父母看你的眼神变得复杂，仿佛有什么秘密瞒着你。',
    effects: { str: 3, con: 2 },
    appearance: 'battle_hardened',
    mood: 'proud',
    minAge: 12,
  },
  {
    id: 'wonder_buddha_blessing',
    event: '佛光普照',
    description: '随父母进香时，寺庙的佛像突然发出金光。所有人都跪下了，只有你呆呆地站着。老和尚说你有佛缘，赠你一串念珠。从那以后，你的心境格外平和。',
    effects: { int: 2, con: 2, cha: 1 },
    appearance: 'serene',
    mood: 'happy',
    minAge: 4,
  },
  {
    id: 'wonder_demon_pact',
    event: '与魔交易',
    description: '绝境之中，一个声音在你脑海中响起："想要力量吗？"你答应了。虽然不知道代价是什么，但你确实活了下来，而且变得比从前强大。只是偶尔，你会听到那个声音在耳边低语。',
    effects: { str: 2, agi: 2, int: 2, cha: -2 },
    appearance: 'dark_aura',
    mood: 'dark',
    minAge: 10,
  },
];

// ── 获取适合当前年龄的奇遇事件 ──
function _getWonderEvent(age, background) {
  // 过滤出适合当前年龄的事件
  const valid = WONDER_EVENTS.filter(w => !w.minAge || age >= w.minAge);
  // 根据出身背景调整概率（某些出身更容易触发特定奇遇）
  const weighted = valid.map(w => {
    let weight = 1;
    // 武林世家更容易触发武学相关奇遇
    if (background.id === 'martial' && (w.id.includes('master') || w.id.includes('tomb'))) weight = 2;
    // 书香门第更容易触发仙缘相关奇遇
    if (background.id === 'scholar' && (w.id.includes('immortal') || w.id.includes('dream'))) weight = 2;
    // 商贾之家更容易触发因果相关奇遇
    if (background.id === 'merchant' && w.id.includes('karma')) weight = 2;
    return { ...w, weight };
  });
  
  // 按权重随机选择
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const w of weighted) {
    roll -= w.weight;
    if (roll <= 0) return w;
  }
  return weighted[0];
}

// ── 合并两个事件的效果 ──
function _mergeEffects(eff1, eff2) {
  const merged = { ...eff1 };
  for (const [key, val] of Object.entries(eff2 || {})) {
    merged[key] = (merged[key] || 0) + val;
  }
  return merged;
}

// ── 随机成长事件（按年龄段，12段，每段10事件） ──
const RANDOM_EVENTS = {
  age_1: [
    {
      event: '襁褓中高烧不退',
      description: '出生不到三个月，一场突如其来的高烧差点要了你的小命。整整三天三夜，母亲守在床前寸步不离。奇迹般地，你退烧了，但从此留下了苍白肤色的印记。',
      effects: { con: 1, int: 1 },
      appearance: 'pale',
      mood: 'sad',
    },
    {
      event: '被路过的僧人摸顶',
      description: '一位化缘的僧人路过家门口，见襁褓中的你便停下了脚步。他念了一声佛号，伸手在你头顶轻抚三下："此子慧根深厚。"说罢飘然而去，再无踪影。',
      effects: { int: 1 },
      appearance: 'calm_eyes',
      mood: 'mysterious',
    },
    {
      event: '天生异瞳',
      description: '你睁开眼睛的那一刻，接生婆吓了一跳——左眼黑色，右眼琥珀色。村里人议论纷纷，有人说你是不祥之兆，也有人说你天赋异禀。母亲把你抱得更紧了。',
      effects: { int: 1, luk: 1 },
      appearance: 'heterochromia',
      mood: 'mysterious',
    },
    {
      event: '落地便啼声洪亮',
      description: '别的婴儿出生时都是嘤嘤哭泣，你却发出了一声震耳欲聋的啼哭，整条街的狗都被惊得叫了起来。接生婆笑着说："这孩子肺活量了不得！"',
      effects: { str: 1, con: 1 },
      appearance: 'bold_brow',
      mood: 'proud',
    },
    {
      event: '家中失火幸免于难',
      description: '在你满月那天夜里，厨房的油灯引发了大火。父亲抱着你从火海中冲出，而你居然在浓烟中睡得香甜。事后有人说，这孩子命大。',
      effects: { luk: 2 },
      appearance: 'resilient',
      mood: 'scary',
    },
    {
      event: '邻家恶犬亲近你',
      description: '村口那条凶猛的看门狗，见到你却乖得像只小猫，不仅摇尾巴还主动舔你的手。村里老人说，这孩子身上有股特别的气息，连畜生都亲近。',
      effects: { cha: 1, luk: 1 },
      appearance: 'gentle',
      mood: 'warm',
    },
    {
      event: '母亲产后大病',
      description: '生你之后母亲一病不起，整日卧床不起。家中请了三个大夫都摇头叹气。你被交给了年迈的奶奶照顾，很少能听到母亲的声音。',
      effects: { con: -1, luk: -1, int: 1 },
      appearance: 'quiet',
      mood: 'sad',
    },
    {
      event: '被遗弃在寺庙门前',
      description: '一个风雪之夜，你被人裹在一块旧布中放在了山门前。方丈清晨开门发现了你，你冻得浑身发紫但仍在微弱地哭泣。方丈叹了口气，将你抱了进去。',
      effects: { con: -1, int: 1, luk: -1 },
      appearance: 'thin',
      mood: 'sad',
    },
    {
      event: '夜里常莫名啼哭不止',
      description: '你几乎每个夜晚都会啼哭到天亮，无论怎么哄都不停。邻居家不堪其扰，有人在背后说这孩子怕是中了邪。父亲急得四处求神拜佛。',
      effects: { con: 1, luk: -1, cha: -1 },
      appearance: 'restless',
      mood: 'scary',
    },
    {
      event: '被算命先生断言坎坷',
      description: '一位游方的瞎眼算命先生路过你家，摸了摸你的手纹后说："此子命数多舛，一生风雨，但若能熬过去，必成大器。"父亲脸色铁青，追出门外时老者已不知所踪。',
      effects: { luk: -2, int: 1 },
      appearance: 'mysterious_eyes',
      mood: 'mysterious',
    },
  ],
  age_3: [
    {
      event: '贪玩摔断了腿',
      description: '你三岁时因为爬树摔断了腿，虽然痊愈了但留下了一些后遗症。这段经历让你更加珍惜健康。走路时左腿微跛，但你从不因此自卑。',
      effects: { agi: -1, con: 1 },
      appearance: 'limp',
      mood: 'sad',
    },
    {
      event: '偷吃仙人果',
      description: '你在后山发现了一棵奇异的果树，偷偷摘了几个果子吃下。当晚你浑身发热，仿佛体内有什么东西被点燃了。',
      effects: { str: 1, mp: 10 },
      appearance: 'blush',
      mood: 'lucky',
    },
    {
      event: '遇到流浪道士',
      description: '一位衣衫褴褛的道士路过你家门前，看了你一眼说："此子根骨不凡。"然后留下一本破旧的小册子便飘然而去。你太小，看不懂上面的字。',
      effects: { int: 1 },
      appearance: null,
      mood: 'mysterious',
    },
    {
      event: '发高烧说胡话',
      description: '一场来势汹汹的病让你高烧七日不退。昏迷中你喃喃自语，说的都是些奇怪的人名和地名。病好后你什么都不记得了，但眼神中多了一丝不属于三岁孩童的深邃。',
      effects: { int: 2, con: -1 },
      appearance: 'deep_eyes',
      mood: 'mysterious',
    },
    {
      event: '和村霸孩子打架',
      description: '村头恶霸家的胖儿子抢了你的糖，你二话不说冲上去就咬了他一口。虽然被揍了一顿，但从那以后再没人敢欺负你。父亲看到你嘴角的血，沉默了半晌，然后笑了。',
      effects: { str: 1, con: 1, cha: -1 },
      appearance: 'scar_face',
      mood: 'proud',
    },
    {
      event: '在后山迷路一夜',
      description: '你追着一只野兔跑进了深山，直到天黑也没找到回家的路。你在山洞里缩成一团过了一夜。第二天清晨，一只母鹿领着你走出了山林。从此你总觉得自己和大自然格外亲近。',
      effects: { luk: 2, int: 1 },
      appearance: 'wild',
      mood: 'scary',
    },
    {
      event: '被大孩子欺负抢走了食物',
      description: '村子里几个比你大的孩子经常抢你的吃的。有一次他们把你推倒在地，抢走了你手里仅有的半个馒头。你蹲在地上哭了好久，从那以后你学会了藏东西。',
      effects: { cha: -1, luk: -1, agi: 1 },
      appearance: 'wary',
      mood: 'sad',
    },
    {
      event: '目睹家中牲畜被偷',
      description: '半夜里你家唯一的母鸡被人偷走了。父亲追出去半里地没追上，回来后坐在门槛上抽了一夜的旱烟。你虽然还小，却莫名感到一阵心酸。',
      effects: { luk: -1, con: 1, int: 1 },
      appearance: 'serious',
      mood: 'angry',
    },
    {
      event: '掉进冰窟窿险些溺亡',
      description: '冬日里你在河边玩耍，脚下的薄冰突然碎裂，整个人掉进了冰冷的河水中。等大人把你捞上来时，你已经冻得嘴唇发紫、失去意识。三天后才退了烧，但此后你格外怕冷。',
      effects: { con: -1, agi: 1, luk: 1 },
      appearance: 'pale',
      mood: 'scary',
    },
    {
      event: '被母亲训后偷偷跑出家门',
      description: '因为你打碎了邻居家的碗，母亲狠狠训了你一顿。你赌气跑出了家门，在村外的破庙里躲了一下午。天黑了又冷又饿，最后还是自己偷偷溜了回去。母亲红着眼抱着你，什么也没说。',
      effects: { con: 1, cha: -1 },
      appearance: 'stubborn',
      mood: 'sad',
    },
  ],
  age_4: [
    {
      event: '启蒙读书识字',
      description: '母亲开始教你认字。你学得极快，三岁识百字，四岁能读简册。邻里都说这孩子是神童，母亲只是微笑不语。',
      effects: { int: 2 },
      appearance: 'elegant',
      mood: 'happy',
    },
    {
      event: '目睹邻里争吵',
      description: '隔壁两家因为地界的事吵得不可开交，甚至动了刀子。你躲在门后看着这一切，小小的心里种下了对争斗的恐惧和好奇。',
      effects: { int: 1, con: 1 },
      appearance: 'serious',
      mood: 'angry',
    },
    {
      event: '被毒蛇咬伤',
      description: '在草丛中玩耍时被一条青竹蛇咬了一口。幸好父亲懂得解毒之法，用嘴吸出毒血后又敷上草药。你的小腿上留下了一道疤痕，像一条蜿蜒的小蛇。',
      effects: { con: 1, agi: -1 },
      appearance: 'snake_scar',
      mood: 'scary',
    },
    {
      event: '发现古墓入口',
      description: '你在后山的一个山洞深处发现了一道石门，上面刻满了看不懂的文字。你把这事告诉了父亲，父亲脸色大变，拉着你就走，再也不让你去那里。',
      effects: { luk: 1, int: 1 },
      appearance: 'curious',
      mood: 'mysterious',
    },
    {
      event: '帮母亲分担家务',
      description: '看到母亲每天操劳，你开始学着扫地、洗碗、喂鸡。虽然做得歪歪扭扭，但母亲每次看到都笑着说："我家的孩子最懂事了。"',
      effects: { cha: 1, con: 1 },
      appearance: 'kind',
      mood: 'warm',
    },
    {
      event: '摔碎传家之宝',
      description: '你不小心打碎了父亲珍藏的一个瓷瓶，父亲沉默了很久，最后只说了一句："碎了就碎了吧。"那天的晚饭特别安静，你躲在角落里哭了一个晚上。',
      effects: { cha: -1, int: 1 },
      appearance: 'guilty',
      mood: 'sad',
    },
    {
      event: '家人生重病无钱医治',
      description: '家中长辈突然病重，请来的大夫说要十两银子的药材费。家里东拼西凑只凑出了三两，父亲蹲在门口抽了一整夜的旱烟。最终是邻里凑了份子才渡过难关。',
      effects: { luk: -1, int: 1, cha: 1 },
      appearance: 'worried',
      mood: 'sad',
    },
    {
      event: '被诬陷偷了邻家鸡蛋',
      description: '邻家婆娘丢了三个鸡蛋，硬说是你偷的。你被拽着耳朵在村口罚站了一个时辰。后来发现是她自家的鸡跑到别人院子里下蛋去了，却没人跟你道歉。',
      effects: { cha: -1, con: 1, luk: -1 },
      appearance: 'wronged',
      mood: 'angry',
    },
    {
      event: '目睹乞丐在雪夜冻死路边',
      description: '那年冬天格外寒冷，你在路边看到一具被雪覆盖的身体。父亲告诉你那是一个死去的乞丐。你第一次明白了"死"是什么意思，好几天没睡好觉。',
      effects: { int: 1, con: -1, luk: -1 },
      appearance: 'haunted',
      mood: 'scary',
    },
    {
      event: '在溪边捡到生锈的铜剑',
      description: '你在溪边玩耍时摸到了一把半截没入泥中的短剑，虽然锈迹斑斑，但握在手里莫名觉得踏实。你把它藏在了床底下，谁也没告诉。',
      effects: { str: 1, luk: 1 },
      appearance: 'eager',
      mood: 'excited',
    },
  ],
  age_5: [
    {
      event: '被野狼追赶',
      description: '你在村外玩耍时遇到了一匹野狼，拼命跑回家。这次经历让你明白了什么是恐惧，也激发了求生本能。你的脸上被树枝划了一道痕迹。',
      effects: { agi: 1, con: 1 },
      appearance: 'scar_face',
      mood: 'scary',
    },
    {
      event: '启蒙读书',
      description: '父亲请来了村里的老秀才教你识字。你学得很快，不到半年就能读懂简单的书册了。',
      effects: { int: 1 },
      appearance: null,
      mood: 'happy',
    },
    {
      event: '染上风寒',
      description: '那年冬天特别冷，你染上了严重的风寒，差点没能挺过来。大病一场后，你的身体反而更强壮了。',
      effects: { con: 2, agi: -1 },
      appearance: 'pale',
      mood: 'sad',
    },
    {
      event: '梦到武林秘籍',
      description: '连续三个夜晚，你都做了同一个梦——一本泛黄的古书在空中翻页，每一页都画着一个人形拳法图。醒来后你居然能比划出几个招式。母亲说你是在说梦话。',
      effects: { str: 1, int: 1 },
      appearance: 'focused',
      mood: 'mysterious',
    },
    {
      event: '收留一只流浪猫',
      description: '你在雨中发现了一只瘦骨嶙峋的小花猫，偷偷把它带回家藏在床底下。后来被父亲发现了，本以为会被骂，没想到父亲只是叹了口气说："养着吧。"',
      effects: { cha: 1 },
      appearance: 'gentle',
      mood: 'warm',
    },
    {
      event: '被人贩子盯上',
      description: '一个面目和善的陌生人拿着糖来哄你，你本能地感到不安，转身就跑。事后得知那是一个人贩子，全村都心有余悸。从此你的警觉性远超同龄人。',
      effects: { agi: 1, luk: 2 },
      appearance: 'alert',
      mood: 'scary',
    },
    {
      event: '家中遭了旱灾颗粒无收',
      description: '那一年大旱，地里的庄稼全都枯死了。一家人只能靠挖野菜、啃树皮度日。你饿得前胸贴后背，晚上肚子叫得整夜睡不着。',
      effects: { con: -1, str: -1, luk: -1, int: 1 },
      appearance: 'thin',
      mood: 'sad',
    },
    {
      event: '被学堂先生用戒尺打手心',
      description: '因为你上课打瞌睡，先生用戒尺狠狠打了你十下手心。手掌肿得像馒头一样，回家连筷子都拿不住。你偷偷发誓以后再也不打瞌睡了。',
      effects: { con: 1, int: 1, cha: -1 },
      appearance: 'disciplined',
      mood: 'angry',
    },
    {
      event: '好朋友跟着父母搬走了',
      description: '你最要好的玩伴，隔壁家的小虎，因为他爹在别处找到了活计要搬走。你追着马车跑了半里地，最后蹲在路边哭得喘不过气来。',
      effects: { cha: -1, luk: -1, int: 1 },
      appearance: 'lonely',
      mood: 'sad',
    },
    {
      event: '跟着父亲学会了游泳',
      description: '那年夏天酷热难耐，父亲带你去村口的河里教游泳。你呛了无数次水，但最终学会了。父亲说："学会游泳，一辈子都不会淹死。"',
      effects: { con: 1, agi: 1, str: 1 },
      appearance: 'tanned',
      mood: 'happy',
    },
  ],
  age_7: [
    {
      event: '入学堂考核出类拔萃',
      description: '镇上的学堂开课了，你凭借过人的天赋在入学考核中名列前茅。先生当众夸赞你，说你是百年难遇的好苗子。你虽然高兴，但也引来了一些同学的嫉妒。',
      effects: { int: 2, cha: -1 },
      appearance: 'elegant',
      mood: 'proud',
    },
    {
      event: '大病初愈悟透生死',
      description: '一场瘟疫席卷了村子，你也不幸染病。在生与死的边缘挣扎了半个月，你终于挺了过来。但同村有好几个孩子没能扛过去。你第一次懂得了生命的脆弱。',
      effects: { con: 1, int: 2 },
      appearance: 'mature_eyes',
      mood: 'sad',
    },
    {
      event: '偷看大人练武被抓',
      description: '你多次偷偷看镇上的武师练功，终于有一次被发现了。武师不但没生气，反而考校了你的筋骨，说："是个好材料，要不要跟我学？"',
      effects: { str: 1, agi: 1 },
      appearance: 'eager',
      mood: 'excited',
    },
    {
      event: '交到一个奇怪的朋友',
      description: '你在河边遇到了一个浑身脏兮兮的乞丐小孩，两人一见如故。他教你翻墙、偷果子、爬树，还给了你一枚奇怪的铜牌，说以后凭这个就能找到他。',
      effects: { agi: 1, luk: 1, cha: 1 },
      appearance: 'mischievous',
      mood: 'happy',
    },
    {
      event: '目睹朝廷官兵抓人',
      description: '一队官兵冲进村子抓走了邻居家的壮丁，说是征去修城墙。邻居妻子抱着孩子在路边哭得撕心裂肺。你躲在门后，攥紧了拳头。',
      effects: { str: 1, con: 1 },
      appearance: 'angry_brow',
      mood: 'angry',
    },
    {
      event: '吃下奇异蘑菇',
      description: '你在山上采到了一丛颜色鲜艳的蘑菇，鬼使神差地吃了几朵。随后你开始产生幻觉，看到了漫天飞舞的蝴蝶和会说话的石头。清醒后你的感知变得异常敏锐。',
      effects: { int: 2, agi: 1, con: -1 },
      appearance: 'dilated_eyes',
      mood: 'mysterious',
    },
    {
      event: '父亲因欠债被打断腿',
      description: '父亲借了高利贷做小买卖赔了个精光，债主上门逼债时打断了父亲的一条腿。你亲眼看着父亲被两个壮汉拖出门外，母亲在身后哭得瘫倒在地。',
      effects: { str: 1, luk: -2, con: -1 },
      appearance: 'angry_eyes',
      mood: 'angry',
    },
    {
      event: '在学堂被孤立排挤',
      description: '因为你家境贫寒、穿着破旧，学堂里的富家子弟们组成了小团体排挤你。你的课本被人撕了，座位被人泼了墨水。你咬着牙一声不吭，但心里下定了变强的决心。',
      effects: { int: 1, cha: -2, con: 1 },
      appearance: 'stoic',
      mood: 'sad',
    },
    {
      event: '从树上跌落摔断手臂',
      description: '你为了掏鸟窝爬上了村口最高的那棵老槐树，脚下一滑从三丈高处摔了下来。左臂粉碎性骨折，整条胳膊被夹板固定了两个月。',
      effects: { agi: -1, str: -1, con: 1 },
      appearance: 'slim_arm',
      mood: 'sad',
    },
    {
      event: '偷听江湖人谈论秘闻',
      description: '你躲在客栈后院，听到了两个江湖客的对话。他们提到了一个叫做"血骨门"的门派，以及一个隐藏在深山中的宝藏。你虽然听不太懂，但把这些话牢牢记在了心里。',
      effects: { int: 2, luk: 1 },
      appearance: 'curious',
      mood: 'mysterious',
    },
  ],
  age_8: [
    {
      event: '偷学武艺',
      description: '镇上来了一位武师开馆授徒，你偷偷趴在墙头看了一个月，竟无师自通学会了基本的拳脚功夫。',
      effects: { str: 1, agi: 1 },
      appearance: null,
      mood: 'proud',
    },
    {
      event: '救下一只受伤的小兽',
      description: '你在山林中发现了受伤的小鹿，精心照料它直到康复。小鹿临走前用头蹭了蹭你的手心。此后你总觉得与动物格外亲近。',
      effects: { cha: 1, luk: 1 },
      appearance: null,
      mood: 'warm',
    },
    {
      event: '目睹江湖仇杀',
      description: '你在河边玩耍时亲眼看到两个黑衣人在此厮杀，其中一人被一刀斩下了头颅。鲜血染红了河水。那个画面在你脑海中挥之不去。',
      effects: { int: 1, con: 1 },
      appearance: 'cold_eyes',
      mood: 'scary',
    },
    {
      event: '被雷击中侥幸存活',
      description: '一场暴风雨中，一道闪电劈中了你身边的大树，电流穿过你的身体。你没死，但头发被烧焦了一片。更奇怪的是，你发现自己在黑暗中能隐约看到物体的轮廓。',
      effects: { luk: 2, agi: 1, con: -1 },
      appearance: 'burnt_hair',
      mood: 'scary',
    },
    {
      event: '帮老中医采药三年',
      description: '镇上的老中医看你聪慧好学，收你做了采药童子。三年间你踏遍山野，认识了数百种草药。老中医临终前把一本手抄药典传给了你。',
      effects: { int: 2, con: 1 },
      appearance: 'herbal_scent',
      mood: 'warm',
    },
    {
      event: '被诬陷偷窃遭毒打',
      description: '富家公子丢了玉佩，硬说是你偷的。你被打得皮开肉绽扔在大街上。后来玉佩在他自己的书桌抽屉里被找到，可没有人跟你道歉。',
      effects: { con: 2, cha: -1 },
      appearance: 'scar_body',
      mood: 'angry',
    },
    {
      event: '亲眼看到父亲被人当众羞辱',
      description: '父亲在集市上卖菜时撞了一个纨绔子弟，那人扇了父亲两耳光还踩烂了菜筐。你冲上去想拼命，被父亲一把拽住。回家的路上，父亲一句话也没说，但你看得到他手在发抖。',
      effects: { str: 2, luk: -1, cha: -1 },
      appearance: 'fierce',
      mood: 'angry',
    },
    {
      event: '染上了疥疮被同学嘲笑',
      description: '你浑身长了密密麻麻的疥疮，奇痒无比。同学们远远躲着你，有人还给你起了"癞皮狗"的外号。你每天用草药熬水洗身，整整三个月才好。',
      effects: { con: 1, cha: -2, int: 1 },
      appearance: 'scarred',
      mood: 'sad',
    },
    {
      event: '跟着猎人进山差点走丢',
      description: '村里的老猎人带你进山打猎，你追着一头受伤的野猪跑进了密林深处。等意识到迷路时天已经黑了，你在树上蹲了一夜，听着狼嚎瑟瑟发抖。',
      effects: { agi: 1, con: 1, luk: -1 },
      appearance: 'wild',
      mood: 'scary',
    },
    {
      event: '暴雨引发洪水冲毁了家',
      description: '连续下了三天暴雨，山洪暴发冲垮了你们家的土墙，粮食和家当全部被泥水泡了。一家人挤在祠堂里住了半个月，靠着村里人的接济度日。',
      effects: { luk: -2, con: 1, cha: 1 },
      appearance: 'weathered',
      mood: 'sad',
    },
    {
      event: '捡到一把生锈短刀',
      description: '你在河边捞鱼时，从淤泥里摸出了一把锈迹斑斑的短刀。刀柄已经腐朽，但刀刃还算完整。你把它带回家，用沙石一点一点磨去铁锈，那是你第一件属于自己的武器。',
      effects: { luk: 1, items: [{ id: 'item_herb_medicine', name: '粗制金疮药', icon: '🩹', desc: '用野草简单制成的外伤药', effect: { hp: 30 }, qty: 2 }] },
      appearance: 'determined',
      mood: 'excited',
    },
    {
      event: '受伤后得人馈赠',
      description: '你学武时不慎摔伤，一位路过的游方郎中见你年纪小却颇有毅力，不收分文给你包扎伤口，临走还留了两包草药。你牢牢记住了那份无私的善意。',
      effects: { cha: 1, items: [{ id: 'item_herb_medicine', name: '粗制金疮药', icon: '🩹', desc: '郎中留下的草药包', effect: { hp: 30 }, qty: 2 }, { id: 'item_herbs', name: '草药', icon: '🌿', desc: '野外采集的普通草药', effect: { hp: 15 }, qty: 1 }] },
      appearance: 'grateful',
      mood: 'warm',
    },
  ],
  age_10: [
    {
      event: '参加科举县试获头名',
      description: '十岁的你在县试中力压一众年长的童生，拿到了头名。主考官惊叹你的文采，破例接见了你。父亲骄傲得眼泪都快掉下来了。',
      effects: { int: 3, cha: 1 },
      appearance: 'elegant',
      mood: 'proud',
    },
    {
      event: '家庭突遭变故',
      description: '父亲在外出做生意时遭遇山贼，货物被洗劫一空，还断了一条腿。家里的日子一下从宽裕变得紧巴。你不得不开始帮着操持家务。',
      effects: { con: 2, cha: 1, luk: -1 },
      appearance: 'mature',
      mood: 'sad',
    },
    {
      event: '发现父亲隐藏的武功秘籍',
      description: '你在阁楼上翻到了一本泛黄的册子，里面画满了人形拳法图解。原来父亲年轻时也曾习武！你偷偷按照上面的图练了一个月，感觉浑身充满了力量。',
      effects: { str: 2, agi: 1 },
      appearance: 'martial_aura',
      mood: 'excited',
    },
    {
      event: '被高人暗中指点',
      description: '你在城隍庙前看人下棋时，一位白须老者突然在你耳边低语了三句话。你似懂非懂，但回家后反复琢磨，忽然有一种茅塞顿开的感觉。',
      effects: { int: 2 },
      appearance: 'serene',
      mood: 'mysterious',
    },
    {
      event: '被恶霸欺凌后发誓变强',
      description: '镇上的恶霸看上了你家的铺面，放话要你父亲三天内搬走。父亲低下了头，而你攥紧了拳头。那天晚上你对着月光发誓：总有一天，绝不会再让任何人欺负你和家人。',
      effects: { str: 2, con: 1 },
      appearance: 'determined_eyes',
      mood: 'angry',
    },
    {
      event: '救治受伤的江湖人',
      description: '你在河边发现了一个浑身是血的中年人，奄奄一息。你把他拖回家，用父亲教的简单手法替他止血包扎。那人醒来后留下一句话："你的救命之恩，来日必报。"然后便消失在夜色中。',
      effects: { cha: 1, luk: 2 },
      appearance: 'righteous',
      mood: 'lucky',
    },
    {
      event: '被同窗陷害赶出学堂',
      description: '学堂的富家公子与你有过节，偷偷把一本禁书塞进了你的书箱，然后向先生告发。先生不分青红皂白将你逐出了学堂。你抱着书箱站在雨中，一言不发地离开了。',
      effects: { int: 1, luk: -1, cha: -1, con: 1 },
      appearance: 'stoic',
      mood: 'angry',
    },
    {
      event: '母亲积劳成疾病逝',
      description: '多年来操劳过度，母亲终于倒下了。她躺在病榻上拉着你的手说："孩子，要好好活着。"那天夜里下着雨，母亲走了。你跪在灵前哭到声音嘶哑，从此再也听不到那声"回来吃饭了"。',
      effects: { luk: -2, cha: -1, int: 1, con: 1 },
      appearance: 'mournful',
      mood: 'sad',
    },
    {
      event: '被土匪劫持后趁机逃脱',
      description: '你独自走山路时遇到了一伙山匪。他们绑了你准备向家里索要赎金。趁看守打盹的空隙，你咬断了绳结从后窗翻出去，在荆棘丛中滚了好几圈才逃了出来。浑身伤痕累累。',
      effects: { agi: 2, con: -1, luk: 1 },
      appearance: 'scar_body',
      mood: 'scary',
    },
    {
      event: '在废墟中找到一枚古钱币',
      description: '村子旁边塌了一堵旧墙，你在碎砖中发现了一枚刻着奇怪纹路的古铜钱。你把它挂在脖子上，总觉得它有一种说不清的凉意，握在手中时格外安心。',
      effects: { luk: 1, int: 1 },
      appearance: 'amulet',
      mood: 'mysterious',
    },
    {
      event: '帮人跑腿得了赏钱',
      description: '镇上的商铺掌柜见你机灵，叫你帮忙跑了几趟送货的活儿。你每次都准时交差，从未出过岔子。一个月下来攒了一小袋铜钱，那是你人生中第一次靠自己挣来的钱。',
      effects: { cha: 1, silver: 50 },
      appearance: 'diligent',
      mood: 'happy',
    },
    {
      event: '帮官府破了一个小案子',
      description: '你无意间目击了一起盗窃，把经过如实告知县衙捕头。捕头大人破案后颇为欣慰，按规矩给了你一份赏银，拍着你的肩说："小子，将来不得了。"',
      effects: { luk: 1, silver: 80 },
      appearance: 'observant',
      mood: 'excited',
    },
  ],
  age_12: [
    {
      event: '拜入武馆',
      description: '你对武术越来越痴迷，终于说服父母让你拜入镇上武馆。虽然学的是最基础的拳法，但你的进步令师父刮目相看。',
      effects: { str: 1, agi: 1, con: 1 },
      appearance: null,
      mood: 'excited',
    },
    {
      event: '偶遇江湖奇人',
      description: '一位白发老者在茶馆独酌，你被他的气质所吸引。老者见你聪明伶俐，教了你一套呼吸吐纳之法后便不知所踪。',
      effects: { int: 2, mp: 20 },
      appearance: null,
      mood: 'mysterious',
    },
    {
      event: '家族遭遇劫难',
      description: '一伙山贼趁夜袭击了你们村子，烧杀抢掠。你亲眼看着邻居家的房子被大火吞噬，从此心中种下了惩恶扬善的种子。',
      effects: { str: 1, con: 1, cha: -1 },
      appearance: 'serious',
      mood: 'angry',
    },
    {
      event: '在武馆比武中崭露头角',
      description: '武馆举办年度比武大会，你以最小年龄参赛，竟连胜三场打进了前四。最后一招虽然惜败，但你那股不服输的劲头让所有人都记住了你。',
      effects: { str: 1, agi: 2 },
      appearance: 'confident',
      mood: 'proud',
    },
    {
      event: '被推荐参加少年科举',
      description: '你的文章被县令看到，破例推荐你参加府里的少年科举。虽然最终没能高中，但你的才华得到了多位文人墨客的认可，为你打开了更广阔的世界。',
      effects: { int: 2, cha: 2 },
      appearance: 'refined',
      mood: 'excited',
    },
    {
      event: '误入秘洞获得奇遇',
      description: '你在山里追一只受伤的白狐，不知不觉走进了一个隐秘的山洞。洞壁上刻满了武学图谱和晦涩的文字。你在洞中待了三天三夜，出来后似乎对武学有了全新的理解。',
      effects: { str: 1, int: 1, agi: 1, mp: 15 },
      appearance: 'mystic_mark',
      mood: 'mysterious',
    },
    {
      event: '师父因事被仇家追杀致死',
      description: '教了你两年功夫的师父，被昔年的仇家找上门来。你亲眼看到师父以一敌三，最终力竭而亡。他倒下的最后一刻向你使了个眼色，示意你快跑。你拼命地跑，泪水模糊了视线。',
      effects: { str: 2, luk: -2, con: 1 },
      appearance: 'cold_eyes',
      mood: 'angry',
    },
    {
      event: '练功走火入魔伤了经脉',
      description: '你急于求成，偷偷加练了一整夜的内功。第二天天亮时你口吐鲜血，浑身经脉像被火烧一样疼。养了大半年才勉强恢复，但内力根基受到了损伤。',
      effects: { con: -1, agi: -1, int: 2, mp: -10 },
      appearance: 'sickly',
      mood: 'sad',
    },
    {
      event: '被师兄们联手欺负',
      description: '武馆里的几个师兄嫉妒你进步太快，趁师父不在时把你堵在柴房里打了一顿。你被打得鼻青脸肿却硬是没掉一滴眼泪。从那以后，你练功更加刻苦。',
      effects: { con: 2, cha: -1, str: 1 },
      appearance: 'tough',
      mood: 'angry',
    },
    {
      event: '在寺庙中偶然翻到佛经',
      description: '你在一座破败的小庙中避雨，无意间翻到了一卷残破的佛经。上面的经文你大多看不懂，但其中几句偈语如电击一般直入脑海，让你对世间万物有了不同的理解。',
      effects: { int: 2, luk: 1 },
      appearance: 'serene',
      mood: 'inspired',
    },
    {
      event: '得到一本残缺武学手抄本',
      description: '武馆中一个行将辞世的老师父，把一本手抄的武学笔记悄悄塞给了你。"这是老夫年轻时抄的，你有缘，就留给你吧。"你连夜苦读，将其中最基础的一套拳法背得滚瓜烂熟。',
      effects: { str: 1, skills: [{ id: 'fo_l1', name: '直拳' }] },
      appearance: 'determined',
      mood: 'inspired',
    },
    {
      event: '在街头见过路高手出手',
      description: '你在街头看到一位游侠儿拔刀相助，三两下制服了一群泼皮。那流畅的身法和刀势让你目瞪口呆。你连夜将记忆中的动作比划了无数遍，竟记住了几招皮毛。',
      effects: { agi: 1, skills: [{ id: 'sw_l1', name: '横斩' }] },
      appearance: 'sharp_eyes',
      mood: 'excited',
    },
  ],
  age_14: [
    {
      event: '第一次走夜路',
      description: '为了给生病的母亲请大夫，你独自一人走了十里夜路。月光下的山路阴森可怖，你几次想回头，但一想到病床上的母亲，咬着牙走完了全程。那一夜，你长大了。',
      effects: { con: 2, luk: 1 },
      appearance: 'resolute',
      mood: 'determined',
    },
    {
      event: '初尝酒滋味',
      description: '你偷喝了父亲藏在柜子里的酒，辣得你直咳嗽。但那股辛辣过后的温热感，让你觉得大人的世界似乎也没那么遥不可及。从此你对酒有了一种说不清的亲近。',
      effects: { cha: 1, str: 1 },
      appearance: 'bold',
      mood: 'happy',
    },
    {
      event: '被师父责罚罚站一夜',
      description: '因为偷懒没练功，师父罚你在雪地里站了一整夜。第二天你的双腿冻得失去知觉，但师父说你扛过来了，说明你有习武的天赋。你不知道该恨他还是该谢他。',
      effects: { con: 2, agi: -1 },
      appearance: 'tough',
      mood: 'sad',
    },
    {
      event: '遇险被少侠相救',
      description: '你在山里遇到一头黑熊，吓得动弹不得。千钧一发之际，一位路过的少年侠客飞身而至，一掌击退了黑熊。他拍拍你的肩膀说："小子，路还长。"你目送他的背影消失在山间。',
      effects: { agi: 1, int: 1 },
      appearance: 'reverent',
      mood: 'lucky',
    },
    {
      event: '与青梅竹马分别',
      description: '和你从小一起长大的邻家女孩要随家人搬到远方去了。临别那天她送了你一只亲手缝的荷包，红着脸说："你……你别忘了我就好。"你攥着荷包站在路口，看着马车渐渐消失在尘土中。',
      effects: { cha: 1, int: 1 },
      appearance: 'nostalgic',
      mood: 'sad',
    },
    {
      event: '保护弱小遭受报复',
      description: '你看到几个大孩子在欺负一个哑巴小孩，挺身而出打了一架。虽然打赢了，但第二天那几个大孩子的家长带着棍子找上门来。你替那个哑巴小孩挨了一顿打，但一点都不后悔。',
      effects: { str: 1, con: 1, cha: 2 },
      appearance: 'righteous',
      mood: 'determined',
    },
    {
      event: '被情所伤心灰意冷',
      description: '你暗恋了半年的村中姑娘，在元宵灯会上被你看到她与别的男子牵手同行。你回到家中把自己关在房间里三天没出来。父亲在门外站了一夜，最后只说了句："这世上没有过不去的坎。"',
      effects: { cha: -2, int: 1, con: 1 },
      appearance: 'melancholy',
      mood: 'sad',
    },
    {
      event: '被卷入帮派争斗受了刀伤',
      description: '你在城里买东西时无意间撞见两个帮派的人火拼，一把飞刀擦过你的肩膀留下了一道血淋淋的口子。你捂着伤口逃到了巷子里，自己撕下衣襟简单包扎，疼得冷汗直流。',
      effects: { con: 1, agi: 1, luk: -1 },
      appearance: 'shoulder_scar',
      mood: 'scary',
    },
    {
      event: '家中唯一的长辈也病故了',
      description: '继母亲之后，一直照顾你的爷爷也在这个冬天走了。家中只剩你一个人，空荡荡的屋子里只剩风声。你独自办完了丧事，从此真正成了一个孤身一人的人。',
      effects: { luk: -2, con: -1, int: 2 },
      appearance: 'solitary',
      mood: 'sad',
    },
    {
      event: '在悬崖边顿悟了呼吸法门',
      description: '你坐在悬崖边对着落日发呆，忽然一阵风吹来，你下意识地按照某种节奏调整呼吸，竟然感觉到体内有一股暖流在流动。虽然只是一瞬间的感受，但你知道自己摸到了什么门槛。',
      effects: { int: 1, con: 1, mp: 15 },
      appearance: 'serene',
      mood: 'inspired',
    },
    {
      event: '跟随郎中学了几天简单医术',
      description: '邻村的老郎中见你聪明好学，教了你几天如何辨认常见草药和处理外伤。你学得认真，老先生临走前把自己备用的药囊留给了你，叮嘱你"出门在外，平安最重要"。',
      effects: { int: 1, items: [{ id: 'item_herb_medicine', name: '粗制金疮药', icon: '🩹', desc: '老郎中留下的金疮药', effect: { hp: 30 }, qty: 3 }, { id: 'item_restore_pill', name: '恢复丹', icon: '💊', desc: '基础恢复丹药', effect: { hp: 50 }, qty: 1 }] },
      appearance: 'gentle',
      mood: 'warm',
    },
    {
      event: '帮一户富商找回了走失的孩子',
      description: '一个商贾的孩子在集市上走散，你凭着细心和腿脚灵活，在天黑前找到了孩子。那商贾感激不尽，硬塞给你一包银两，还备了一顿酒菜款待你。',
      effects: { cha: 1, luk: 1, silver: 100 },
      appearance: 'kind',
      mood: 'happy',
    },
  ],
  age_15: [
    {
      event: '初入江湖',
      description: '十五岁的你背着简单的行囊离开了家乡。父亲送你到村口，只说了一句话："江湖险恶，保重。"你头也不回地踏上了旅途。',
      effects: { agi: 1, luk: 1 },
      appearance: null,
      mood: 'determined',
    },
    {
      event: '被高手点拨',
      description: '你在旅途中遇到一位独臂剑客，两人一见如故。他看你根基不错，花了一个月教你剑法基础，临别时说："你的路还很长。"',
      effects: { str: 1, int: 1, agi: 1 },
      appearance: null,
      mood: 'inspired',
    },
    {
      event: '身陷险境',
      description: '你不慎落入贼人圈套，被打得遍体鳞伤扔在荒野。一位路过的老尼姑救了你，用银针为你疗伤，还传授了一套轻身功夫。',
      effects: { con: 1, agi: 2, hp: -20 },
      appearance: 'scar_body',
      mood: 'lucky',
    },
    {
      event: '在酒楼打赢了地痞',
      description: '一个醉酒的地痞在酒楼里调戏女子，旁人皆不敢言。你忍无可忍，一脚将他踹飞出门外。酒楼里顿时一片叫好声，你第一次尝到了行侠仗义的滋味。',
      effects: { str: 1, cha: 2 },
      appearance: 'heroic',
      mood: 'proud',
    },
    {
      event: '迷失方向误入禁区',
      description: '你在大雾中迷了路，误闯进了一座被遗弃的古堡。古堡中机关重重，你差点命丧其中。但最终你从一面墙壁的暗门逃了出来，还捡到了一枚刻着神秘纹路的令牌。',
      effects: { luk: 2, int: 1 },
      appearance: 'wary',
      mood: 'scary',
    },
    {
      event: '结识一生挚友',
      description: '在一家破旧的客栈中，你遇到了一个和你年纪相仿的少年。两人因为一碗阳春面结缘，聊了一整夜。他说他要去寻找失散多年的姐姐，而你要闯荡江湖。你们约定日后相见。',
      effects: { cha: 2, luk: 1 },
      appearance: 'bright_eyes',
      mood: 'happy',
    },
    {
      event: '身上银两被偷个精光',
      description: '你在客栈投宿时被一个妙手空空的扒手偷光了全部盘缠。身无分文的你只好帮客栈洗碗三天抵了房钱。从此你睡觉时总把手放在钱袋子上。',
      effects: { luk: -2, agi: 1, int: 1 },
      appearance: 'cautious',
      mood: 'sad',
    },
    {
      event: '被人下毒差点丧命',
      description: '你在路边摊喝了一碗馄饨就倒地不起。醒来时发现身上值钱的东西都被搜刮一空。好在毒素不深，你靠着自己的体质硬扛了过来。从此你对陌生人的食物格外警惕。',
      effects: { con: -1, luk: -1, agi: 1, int: 1 },
      appearance: 'wary',
      mood: 'scary',
    },
    {
      event: '被诬为小偷遭全城追打',
      description: '一个真正的飞贼作案后嫁祸于你，你被几十个人追着满城跑。你翻墙爬屋顶、跳进臭水沟才侥幸逃脱。等风头过去后你才敢露面，但"小偷"的名声已经传遍了那座城。',
      effects: { agi: 2, cha: -2, luk: -1 },
      appearance: 'disheveled',
      mood: 'angry',
    },
    {
      event: '在荒庙中遇到奇书',
      description: '你在一座无人看管的荒庙中过夜，在佛像后面发现了一本藏匿多年的武学笔记。虽然残缺不全，但上面记载的内功心法令你如获至宝。你花了三个月参悟其中的奥秘。',
      effects: { int: 2, mp: 20 },
      appearance: 'mystic_mark',
      mood: 'mysterious',
    },
    {
      event: '家人为你准备了出行行囊',
      description: '离家那天，父母彻夜未眠。母亲把家中最后一点积蓄塞进你的行囊，父亲亲手缝了一件厚实的衣裳。你背起这份沉甸甸的爱，踏上了漫漫江湖路。',
      effects: { cha: 1, silver: 120, items: [{ id: 'item_journey_ration', name: '旅途干粮', icon: '🥖', desc: '母亲准备的干粮', effect: { food: 35 }, qty: 3 }] },
      appearance: 'grateful',
      mood: 'warm',
    },
    {
      event: '路边救了一名昏倒的游侠',
      description: '你在官道边发现一名浑身是血的游侠昏倒在道旁。你为他包扎伤口、守了一夜。次日他醒来，感激地将随身携带的一包银两和几颗丹药留给了你，说："侠义当报，记住这个道理。"',
      effects: { luk: 2, silver: 80, items: [{ id: 'item_restore_pill', name: '恢复丹', icon: '💊', desc: '游侠留下的丹药', effect: { hp: 50 }, qty: 2 }] },
      appearance: 'righteous',
      mood: 'warm',
    },
  ],
  age_17: [
    {
      event: '在武斗场一鸣惊人',
      description: '你参加了一个江湖武斗场的小型比武，面对一个个比你年长的对手，你以一套自创的拳法连胜五场。观战的几位前辈纷纷向你投来赞赏的目光。',
      effects: { str: 2, agi: 1, cha: 1 },
      appearance: 'battle_hardened',
      mood: 'proud',
    },
    {
      event: '恩师辞世',
      description: '教导你多年的师父在一次外出中与强敌交手，身负重伤。你赶到时他已奄奄一息。师父最后传授了你一招绝学，便含笑而逝。你跪在他的坟前守了三天三夜。',
      effects: { str: 2, int: 1, mp: 30 },
      appearance: 'mourning',
      mood: 'sad',
    },
    {
      event: '获得第一匹坐骑',
      description: '你在集市上用攒了半年的银两买了一匹枣红马。虽然只是一匹普通的马，但当你骑上它驰骋在旷野上时，第一次感受到了风从耳畔呼啸而过的自由。',
      effects: { agi: 2, luk: 1 },
      appearance: 'windblown',
      mood: 'happy',
    },
    {
      event: '被冤枉入狱三天',
      description: '你被一伙栽赃的人陷害，关进了大牢三天。在阴暗潮湿的牢房里，你见到了人间最丑恶的嘴脸。三天后真相大白，你被释放了，但心中多了一份对这个世道的清醒认知。',
      effects: { con: 2, int: 2, cha: -1 },
      appearance: 'cold_eyes',
      mood: 'angry',
    },
    {
      event: '偶遇隐世高人传功',
      description: '你在瀑布后修炼时，一位白发老者不知何时出现在你身后。他看了你练功片刻，指出了三处破绽。随后你按照他的指点调整内息运行路线，顿觉功力大进。当你回头时，老者已不知所踪。',
      effects: { str: 1, agi: 1, int: 1, mp: 20 },
      appearance: 'serene',
      mood: 'mysterious',
    },
    {
      event: '第一次心动',
      description: '你在元宵灯会上遇到了一个撑着油纸伞的姑娘。灯火映在她的脸上，美得让你忘了呼吸。你们隔着人群对视了一瞬，然后她消失在了人海中。你找了一整晚，却再也没有见到她。那一瞬间的心动，你记了一辈子。',
      effects: { cha: 2, int: 1 },
      appearance: 'romantic',
      mood: 'inspired',
    },
    {
      event: '在比武中被高手废掉一臂功力',
      description: '你一时冲动向一个路过的中年剑客发起挑战，结果三招之内就被震飞出去。经脉受损，右臂三个月举不起剑。那人说："年轻人，江湖不是逞勇斗狠的地方。"',
      effects: { str: -1, agi: -1, int: 2, con: 1 },
      appearance: 'injured',
      mood: 'sad',
    },
    {
      event: '唯一的挚友死在自己怀里',
      description: '当年在客栈结义的兄弟，在一次截杀中为了掩护你中了一刀。你抱着他跑到最近的镇子时已经来不及了。他临死前说："替我……去看看我姐……"你把他的剑埋在了他身边。',
      effects: { str: 1, luk: -2, cha: -1, int: 1 },
      appearance: 'grief_stricken',
      mood: 'sad',
    },
    {
      event: '被仇家追杀跳崖逃生',
      description: '一伙来历不明的人突然找上门来，你寡不敌众被逼到了悬崖边。万般无奈之下你纵身一跃，幸运地落入崖下的深潭。你在山洞中躲了七天，靠着喝山泉和吃野果活了下来。',
      effects: { agi: 2, con: -1, luk: 1 },
      appearance: 'wild',
      mood: 'scary',
    },
    {
      event: '在破庙中悟出了一套刀法',
      description: '你在一座荒废的古庙中避雨时，看到墙上的壁画描绘着一副刀法图。你对着壁画反复比划，忽然灵光一闪，将之前零散的武学知识融会贯通，自创了一套朴拙却实用的刀法。',
      effects: { str: 2, int: 1, mp: 10 },
      appearance: 'martial_aura',
      mood: 'inspired',
    },
    {
      event: '比武夺魁得了彩头',
      description: '你参加一场江湖比武，以黑马之姿连克六名对手。主办的老前辈喜欢你，除了奖银还特意把自己珍藏多年的一瓶金疮药作为额外赠礼，说："年轻人，去闯吧。"',
      effects: { str: 1, agi: 1, silver: 150, items: [{ id: 'item_herb_medicine', name: '粗制金疮药', icon: '🩹', desc: '比武奖品', effect: { hp: 30 }, qty: 3 }] },
      appearance: 'battle_hardened',
      mood: 'proud',
    },
    {
      event: '路遇隐世高人点拨',
      description: '你在山路上遇到一位自称"无名散人"的老者，两人随口聊了几句武学，你说的几个见解令老人眼前一亮。他随手写了几行字塞给你："这招式练好了，够用。"你研习三日，竟真的悟出了门道。',
      effects: { int: 2, skills: [{ id: 'bd_l1', name: '普通一掌' }], silver: 0 },
      appearance: 'sharp_eyes',
      mood: 'mysterious',
    },
  ],
  age_18: [
    {
      event: '立下江湖志',
      description: '十八岁的你在洛阳城头吹着夜风，回望来时的路。那个三岁摔断腿的孩子、那个八岁偷学武艺的少年，如今已初具侠客的模样。你暗暗立誓——要在这江湖中闯出一番名堂。',
      effects: { cha: 1, int: 1 },
      appearance: null,
      mood: 'determined',
    },
    {
      event: '结交好友',
      description: '在一家客栈中，你遇到了一位志趣相投的年轻人，两人一见如故，在月下畅饮到天明。他将成为你日后行走江湖的重要伙伴。',
      effects: { cha: 2, luk: 1 },
      appearance: null,
      mood: 'happy',
    },
    {
      event: '得到第一把兵器',
      description: '你用攒了很久的银两在铁匠铺买了一把朴刀。虽然不是什么名器，但握在手中有一种踏实的感觉。从此你的行囊中多了几分底气。',
      effects: { str: 1 },
      appearance: null,
      mood: 'proud',
      item: '朴素朴刀',
    },
    {
      event: '击败地方恶霸扬名',
      description: '你单人独剑挑战了盘踞一方的恶霸。一场恶战后你虽然伤痕累累，但最终将恶霸打翻在地。围观的人群爆发出雷鸣般的喝彩声。你的名字第一次在江湖中流传。',
      effects: { str: 2, cha: 2, con: 1 },
      appearance: 'battle_scar',
      mood: 'proud',
    },
    {
      event: '卷入江湖恩怨',
      description: '你在途中无意间目睹了一场门派间的暗杀，被迫卷入了一场江湖纷争。为了自保，你必须变得更强。你告别了安逸的生活，正式踏上了充满未知的江湖之路。',
      effects: { str: 1, agi: 1, int: 1, luk: -1 },
      appearance: 'vigilant',
      mood: 'determined',
    },
    {
      event: '在风雨中领悟剑意',
      description: '你在暴风雨中独自练剑，电闪雷鸣间忽然有所感悟。剑随心动，心随剑走——你在那一刻触碰到了传说中的"剑意"门槛。虽然只是皮毛，但你的剑法从此脱胎换骨。',
      effects: { str: 1, int: 2, agi: 1, mp: 25 },
      appearance: 'sword_intent',
      mood: 'inspired',
    },
    {
      event: '被信任之人出卖',
      description: '你最信任的同行伙伴暗中与仇家勾结，设下圈套将你卖给了一伙杀手。你拼死突围，身中三刀才逃了出来。从此你不再轻易相信任何人，眼中多了一层戒备。',
      effects: { con: 1, cha: -2, agi: 1, luk: -1 },
      appearance: 'cynical',
      mood: 'angry',
    },
    {
      event: '身染重疾差点死去',
      description: '在长途跋涉中你染上了严重的肺疾，高烧不退、咳血不止。一位采药老人用祖传的药方救了你一命。你在病榻上躺了整整两个月，身体虚弱得连走路都费劲。',
      effects: { con: -2, str: -1, int: 2 },
      appearance: 'frail',
      mood: 'sad',
    },
    {
      event: '在刑场亲眼看到无辜者被斩',
      description: '你路过一座县城时，恰好看到一群百姓围观行刑。一个据说被人栽赃的年轻人被当众斩首。人群中有人偷偷抹泪，但更多的人麻木地围观。你攥紧了拳头，心中的怒火烧得你无法平静。',
      effects: { str: 2, luk: -1, cha: -1 },
      appearance: 'indignant',
      mood: 'angry',
    },
    {
      event: '在一处古战场悟到了杀意',
      description: '你路过一片传说中的古战场，遍地白骨、刀痕累累。站在尸骨之间，一股无形的杀意直冲头顶。你在那一刻理解了何为生死一线，何为剑气凌云。你的眼神变得锐利如刀。',
      effects: { str: 2, int: 1, con: 1 },
      appearance: 'battle_hardened',
      mood: 'determined',
    },
    {
      event: '受恩师临别赠银',
      description: '传授过你武艺的老前辈听说你要出发闯荡江湖，特意叫你去了一趟。他把自己一直不舍得用的那点积蓄大半塞给你，只说："保命要紧，钱没了可以再赚。"你红了眼眶，接过钱袋，郑重叩头。',
      effects: { cha: 1, silver: 200 },
      appearance: 'grateful',
      mood: 'warm',
    },
    {
      event: '出发前在祠堂发誓',
      description: '离乡之前，你独自在祠堂里点了一炷香，对着祖宗牌位默默许下誓言。你从角落里的木箱翻出了父亲当年用过的旧刀，虽然刀柄已经开裂，但刀刃依然锋利。你擦净它，挂上腰间，踏出了家门。',
      effects: { str: 1, luk: 1, items: [{ id: 'item_herb_medicine', name: '粗制金疮药', icon: '🩹', desc: '出门前备好的跌打药', effect: { hp: 30 }, qty: 2 }, { id: 'item_journey_ration', name: '旅途干粮', icon: '🥖', desc: '祠堂香案前备下的干粮', effect: { food: 35 }, qty: 2 }] },
      appearance: 'resolute',
      mood: 'determined',
    },
  ],
};

// ════════════════════════════════════════════════════════════════
//  字符画场景系统 v200
//  每个年龄段有独特的场景、多帧动画、氛围粒子
// ════════════════════════════════════════════════════════════════

/**
 * 场景动画数据：每个年龄段对应一个场景
 * frames: 字符画帧数组，通过定时器逐帧切换
 * ambient: 氛围粒子（飘花/落叶/萤火虫等）
 * moodOverlay: 根据事件mood叠加特效
 */

// ════════════════════════════════════════════════════════════════
//  角色 ASCII 多帧动画 sprite（叠加在场景背景上）
//  每个 sprite 有 idle/walk/fight/rest 四个动作帧
//  showNextEvent 根据 age + mood 自动选择并循环播放
// ════════════════════════════════════════════════════════════════
const CHARACTER_SPRITES = {

  // ── 婴儿期 1-3岁：摇篮里的宝宝 ──
  baby: {
    mood: { idle: 0, sad: 1, happy: 2 },
    frames: [
      // idle: 安静睡着
      [
        '        ╭───╮        ',
        '       │ ⊙_⊙│        ',
        '       │  ω  │        ',
        '       ╰──┬──╯        ',
        '       ╭──┴──╮        ',
        '      ═╧═════╧═       ',
      ],
      // sad: 哇哇大哭
      [
        '        ╭───╮        ',
        '       │ ×_×│        ',
        '       │  ω  │        ',
        '       ╰──┬──╯        ',
        '       ╭──┴──╮        ',
        '      ═╧═════╧═       ',
      ],
      // happy: 咯咯笑
      [
        '        ╭───╮        ',
        '       │ ▽▽ │        ',
        '       │  ω  │        ',
        '       ╰──┬──╯        ',
        '       ╭──┴──╮        ',
        '      ═╧═════╧═       ',
      ],
    ],
  },

  // ── 幼儿期 3-6岁：小小的身影 ──
  child: {
    mood: { idle: 0, walk: 1, fight: 2, sad: 3, happy: 4 },
    frames: [
      // idle: 站
      [
        '    ╭───╮              ',
        '    │ ◕‿◕│   ──┤@├──   ',
        '    ╰─┬─╯              ',
        '   ╭──┴──╮             ',
        '   │     │             ',
        '  ═╧═   ═╧═            ',
      ],
      // walk: 走路
      [
        '    ╭───╮              ',
        '    │ ◕‿◕│   ──┤@├──   ',
        '    ╰─┬─╯              ',
        '   ╭──┴──╮             ',
        '  ═╧═    │             ',
        '   │   ═╧═            ',
      ],
      // fight: 举起小拳头
      [
        '    ╭───╮              ',
        '    │ ◕ω◕│   ──┤@├──   ',
        '    ╰─┬─╯              ',
        '   ╭──┴──╮             ',
        '   │ ⚔  ↑│             ',
        '  ═╧═   ═╧═            ',
      ],
      // sad: 垂头
      [
        '    ╭───╮              ',
        '    │ ·_·│   ──┤@├──   ',
        '    ╰─┬─╯              ',
        '   ╭──┴──╮             ',
        '   │     │             ',
        '  ═╧═   ═╧═            ',
      ],
      // happy: 举手欢呼
      [
        '    ╭───╮              ',
        '    │ ▲‿▲│   ──┤@├──   ',
        '    ╰─┬─╯              ',
        '   ↑ │                ',
        '   │╭┴──╮             ',
        '  ═╧═   ═╧═            ',
      ],
    ],
  },

  // ── 少年期 7-12岁：初露锋芒 ──
  youth: {
    mood: { idle: 0, walk: 1, fight: 2, sad: 3, happy: 4, angry: 5 },
    frames: [
      // idle: 站立
      [
        '       ╭───╮                ',
        '       │ ◉_◉│  ══╤═╤══      ',
        '       ╰─┬─╯    ║ ║         ',
        '      ╭──┴──╮   ║ ║         ',
        '      │ ⚔  │              ',
        '     ═╧═  ═╧═   ══╧═╧══      ',
      ],
      // walk: 迈步
      [
        '       ╭───╮                ',
        '       │ ◉_◉│  ══╤═╤══      ',
        '       ╰─┬─╯    ║ ║         ',
        '      ╭──┴──╮   ║ ║         ',
        '     ═╧═    │              ',
        '      │   ═╧═   ══╧═╧══      ',
      ],
      // fight: 持剑起手式
      [
        '       ╭───╮                ',
        '       │ ◉_◉│  ══╤═╤══      ',
        '       ╰─┬─╯    ║ ║         ',
        '      ╭──┴──╮   ║ ║         ',
        '      │⚔ ══↑│              ',
        '     ═╧═  ═╧═   ══╧═╧══      ',
      ],
      // sad: 垂袖
      [
        '       ╭───╮                ',
        '       │ ·_·│  ══╤═╤══      ',
        '       ╰─┬─╯    ║ ║         ',
        '      ╭──┴──╮   ║ ║         ',
        '      │ ⚔  │              ',
        '     ═╧═  ═╧═   ══╧═╧══      ',
      ],
      // happy: 抬头挺胸
      [
        '       ╭───╮                ',
        '       │ ≧◡≦│  ══╤═╤══      ',
        '       ╰─┬─╯    ║ ║         ',
        '      ╭──┴──╮   ║ ║         ',
        '      │ ⚔  │              ',
        '     ═╧═  ═╧═   ══╧═╧══      ',
      ],
      // angry: 怒目
      [
        '       ╭───╮                ',
        '       │ ⚡_⚡│  ══╤═╤══      ',
        '       ╰─┬─╯    ║ ║         ',
        '      ╭──┴──╮   ║ ║         ',
        '      │ ⚔  │              ',
        '     ═╧═  ═╧═   ══╧═╧══      ',
      ],
    ],
  },

  // ── 青年期 13-17岁：江湖少年 ──
  teen: {
    mood: { idle: 0, walk: 1, fight: 2, sad: 3, happy: 4, angry: 5, deadly: 6 },
    frames: [
      // idle: 负手而立
      [
        '        ╭───╮                    ',
        '        │ ◉_◉│  ═══╤═╤════      ',
        '        ╰─┬─╯    ║     ║         ',
        '       ╭──┴──╮  ║     ║         ',
        '       │ ⚔  │              ',
        '      ═╧═  ═╧═  ═══╧═╧════      ',
      ],
      // walk: 江湖行步
      [
        '        ╭───╮                    ',
        '        │ ◉_◉│  ═══╤═╤════      ',
        '        ╰─┬─╯    ║     ║         ',
        '       ╭──┴──╮  ║     ║         ',
        '      ═╧═    │              ',
        '       │   ═╧═  ═══╧═╧════      ',
      ],
      // fight: 剑出鞘
      [
        '        ╭───╮                    ',
        '        │ ◉_◉│  ═══╤═╤════      ',
        '        ╰─┬─╯    ║     ║         ',
        '       ╭──┴──╮  ║     ║         ',
        '       │⚔ ══↑│              ',
        '      ═╧═  ═╧═  ═══╧═╧════      ',
      ],
      // sad: 望月兴叹
      [
        '        ╭───╮                    ',
        '        │ ·_·│  ═══╤═╤════      ',
        '        ╰─┬─╯    ║     ║         ',
        '       ╭──┴──╮  ║     ║         ',
        '       │ ⚔  │              ',
        '      ═╧═  ═╧═  ═══╧═╧════      ',
      ],
      // happy: 春风得意
      [
        '        ╭───╮                    ',
        '        │ ≧▽≦│  ═══╤═╤════      ',
        '        ╰─┬─╯    ║     ║         ',
        '       ╭──┴──╮  ║     ║         ',
        '       │ ⚔  │              ',
        '      ═╧═  ═╧═  ═══╧═╧════      ',
      ],
      // angry: 怒发冲冠
      [
        '        ╭───╮                    ',
        '        │ ⚡⚡│  ═══╤═╤════      ',
        '        ╰─┬─╯    ║     ║         ',
        '       ╭──┴──╮  ║     ║         ',
        '       │⚔⚔⚔↑│              ',
        '      ═╧═  ═╧═  ═══╧═╧════      ',
      ],
      // deadly: 杀意凛然
      [
        '        ╭───╮                    ',
        '        │ ◈_◈│  ═══╤═╤════      ',
        '        ╰─┬─╯    ║     ║         ',
        '       ╭──┴──╮  ║     ║         ',
        '       │⚔⚔⚔↑│              ',
        '      ═╧═  ═╧═  ═══╧═╧════      ',
      ],
    ],
  },
};

// mood → 动画帧名
const MOOD_TO_ANIM = {
  sad:        'sad',
  scary:      'fight',
  angry:      'angry',
  happy:      'happy',
  inspired:   'happy',
  lucky:      'happy',
  proud:      'happy',
  mysterious: 'fight',
  warm:       'happy',
  lonely:     'sad',
  deadly:     'deadly',
};

// 根据年龄确定角色类型
function getSpriteType(age) {
  if (age <= 3)  return 'baby';
  if (age <= 6)  return 'child';
  if (age <= 12) return 'youth';
  return 'teen';
}

// 根据 age + mood 获取对应的帧索引数组（返回两个帧用于动画切换）
function getSpriteFrames(age, mood) {
  var type = getSpriteType(age);
  var moodMap = CHARACTER_SPRITES[type].mood;
  var animName = MOOD_TO_ANIM[mood] || 'idle';
  var frameIdx = moodMap[animName] !== undefined ? moodMap[animName] : 0;
  var frames = CHARACTER_SPRITES[type].frames;
  // 返回两个帧：当前 mood 帧和 idle 帧（用于动画切换）
  var currentFrame = frames[frameIdx];
  var idleFrame = frames[moodMap['idle'] !== undefined ? moodMap['idle'] : 0];
  return [currentFrame, idleFrame];
}

const AGE_SCENE_ART = {
  // ── 1岁：襁褓 ──
  1: {
    bgColor: '#080508',
    accentColor: '#ff6688',
    frames: [
`    ·    ·    ·    ·
  ·    ·    ·    ·
    ✧    ✧    ✧    ✧
  ·    ·    ·    ·
  ╔════════════════════╗
  ║  ~~~ 温暖的家 ~~~  ║
  ║                    ║
  ║    ╭──────────╮   ║
  ║    │  ∧_∧    │   ║
  ║    │ ( ⌒ω⌒) │   ║
  ║    │  /つつ   │   ║
  ║    │  👶     │   ║
  ║    ╰──────────╯   ║
  ║   ✿  ✿  ✿  ✿    ║
  ╚════════════════════╝
   ～～ 岁月静好 ～～`,
`    ·    ·    ·    ·
  ·    ·    ·    ·
    ✧    ✧    ✧    ✧
  ·    ·    ·    ·
  ╔════════════════════╗
  ║  ~~~ 摇篮曲 ~~~  ║
  ║                    ║
  ║    ╭──────────╮   ║
  ║    │  ∧_∧    │   ║
  ║    │ ( -ω-)  │   ║
  ║    │  /つつ   │   ║
  ║    │  💤💤   │   ║
  ║    ╰──────────╯   ║
  ║   ♪ ～ ♪ ～ ♪    ║
  ╚════════════════════╝
   ～～ 安然入睡 ～～`,
`    ·    ✧    ·    ✧
  ✧    ·    ✧    ·
    ·    ·    ·    ·
  ·    ✧    ·    ✧
  ╔════════════════════╗
  ║  ~~~ 初见世界 ~~~ ║
  ║                    ║
  ║    ╭──────────╮   ║
  ║    │  ∧_∧    │   ║
  ║    │ (≧▽≦)  │   ║
  ║    │  /つつ   │   ║
  ║    │  ✨✨    │   ║
  ║    ╰──────────╯   ║
  ║   · 咿咿呀呀 ·   ║
  ╚════════════════════╝
   ～～ 世界真大 ～～`,
    ],
    ambient: {
      type: 'stars',
      particles: ['✧', '·', '✦', '·', '🌟', '✨'],
      speed: 3000,
      color: 'rgba(255,100,136,0.5)',
    },
  },

  // ── 3岁：温馨院落 ──
  3: {
    bgColor: '#0a0505',
    accentColor: '#ff8866',
    frames: [
// 帧1：黄昏小院
`       , , , , , , , ,
    , , , , , , , , , , ,
  , ,   ☁  ☁    ☁   , ,
   , , , , , , , , , , , ,
  ┌──────────────────────┐
  │    🌸          🌸     │
  │         ∧_∧          │
  │        ( ⌒ω⌒)  🌺   │
  │    🐱  / つ  つ  🌷  │
  │       |      |       │
  │       ヽ  つ   つ     │
  │  🌿     ~~~~    🌿   │
  │ ═════════════════════ │
  │  家  庭  小  院       │
  └──────────────────────┘
  ░░░░░░░░░░░░░░░░░░░░░░░`,
// 帧2：孩子在玩耍
`       , , , , , , , ,
    , , , , , , , , , , ,
  , ,   ☁  ☁    ☁   , ,
   , , , , , , , , , , , ,
  ┌──────────────────────┐
  │    🌸          🌸     │
  │              ∧_∧     │
  │   🧸      ( ⌒ω⌒)  🌺│
  │    🌷    / つ  つ    │
  │         |   ✦   |    │
  │         ヽ  つ   つ   │
  │  🌿     ~~~~~~   🌿  │
  │ ═════════════════════ │
  │    快 乐 时 光        │
  └──────────────────────┘
  ░░░░░░░░░░░░░░░░░░░░░░░`,
    // 帧3：妈妈出来找
`       , , , , , , , ,
    , , , , , , , , , , ,
  , ,   ☁  ☁    ☁   , ,
   , , , , , , , , , , , ,
  ┌──────────────────────┐
  │    🌸          🌸     │
  │  ∧_∧    ∧_∧         │
  │ (´・ω・\`) ( ⌒ω⌒ )  🌺│
  │ /  つ  /  つ  つ     │
  │ |  ✦  |      |      │
  │  ヽ つ   ヽ  つ   つ  │
  │  🌿   "回来吃饭啦~" 🌿│
  │ ═════════════════════ │
  │    温 馨 一 刻        │
  └──────────────────────┘
  ░░░░░░░░░░░░░░░░░░░░░░░`,
    ],
    ambient: {
      type: 'sakura',
      particles: ['🌸', '✿', '❀', '·', '🌷', '🩷'],
      speed: 3000,
      color: 'rgba(255,180,200,0.6)',
    },
  },

  // ── 4岁：山野/河边 ──
  4: {
    bgColor: '#050808',
    accentColor: '#88bbdd',
    frames: [
`   ☁  ☁     ☁  ☁
  ☁    ☁   ☁    ☁
╔═══════════════════════╗
║   ～ ～ ～ ～ ～ ～  ║
║ ～ 山 间 小 溪 ～  ║
║～～～～～～～～～～～～～║
║  ～  🐟  🐟  ～  🐟 ║
║  ∧_∧               ║
║ (・ω・)  蹲在水边     ║
║ /つつ   "好多鱼！"   ║
║ |  ✦  |              ║
║ ヽ  つ               ║
╚═══════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░`,
`   ☁  ☁     ☁  ☁
  ☁    ☁   ☁    ☁
╔═══════════════════════╗
║   ～ ～ ～ ～ ～ ～  ║
║ ～ 竹 林 深 处 ～  ║
║～～～～～～～～～～～～～║
║  🎋  🎋  ∧_∧  🎋 🎋 ║
║       (≧▽≦)         ║
║      /つ  つ         ║
║      | 竹  马 |       ║
║      ヽ  つ           ║
║  "驾！驾！"          ║
╚═══════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░`,
`   ☁  ☁     ☁  ☁
  ☁    ☁   ☁    ☁
╔═══════════════════════╗
║   ～ ～ ～ ～ ～ ～  ║
║ ～ 暮 色 村 庄 ～  ║
║～～～～～～～～～～～～～║
║  🏠 ∧_∧   ∧_∧ 🏠  ║
║    (・ω・)(・ω・)    ║
║    /つ  つ/つ  つ    ║
║    |捉|  |迷|       ║
║    ヽつ  ヽ  つ      ║
║    "天黑了，回家吧"   ║
╚═══════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░`,
    ],
    ambient: {
      type: 'leaves',
      particles: ['🍃', '·', '✧', '·'],
      speed: 3000,
      color: 'rgba(120,180,220,0.4)',
    },
  },

  // ── 5岁：学堂/书斋 ──
  5: {
    bgColor: '#050808',
    accentColor: '#66cc88',
    frames: [
// 帧1：私塾课堂
`     ╔══════════════════════════╗
     ║      ╱╲   ╱╲   ╱╲       ║
     ║     ╱  ╲ ╱  ╲ ╱  ╲      ║
     ║    ╱ 恩 ╲╱ 师 ╲╱ 上 ╲    ║
     ║   ╱ 师 座╲      ╱        ║
     ║  ┌────────────────────┐   ║
     ║  │  📖  📚  📜  🖌️   │   ║
     ║  │                    │   ║
     ║  │   ∧_∧  ∧_∧ ∧_∧    │   ║
     ║  │  (・ω・)(・ω・)(・ω・)│   ║
     ║  │  /つつ /つつ /つつ  │   ║
     ║  │  │读│ │书│ │文│    │   ║
     ║  │  ヽつ  ヽつ  ヽつ   │   ║
     ║  │                    │   ║
     ║  └────────────────────┘   ║
     ║  ~~~ 琅琅读书声 ~~~       ║
     ╚══════════════════════════╝`,
// 帧2：认真写字
`     ╔══════════════════════════╗
     ║      ╱╲   ╱╲   ╱╲       ║
     ║     ╱  ╲ ╱  ╲ ╱  ╲      ║
     ║    ╱ 恩 ╲╱ 师 ╲╱ 上 ╲    ║
     ║   ╱ 师 座╲      ╱        ║
     ║  ┌────────────────────┐   ║
     ║  │  📖  📚  📜  🖌️   │   ║
     ║  │                    │   ║
     ║  │   ∧_∧  ∧_∧ ∧_∧    │   ║
     ║  │  (・ω・)(・ω・)(・ω・)│   ║
     ║  │  /つつ /つつ /つつ  │   ║
     ║  │  │写│ │字│ │✦│    │   ║
     ║  │  ヽつ  ヽつ  ヽつ   │   ║
     ║  │                    │   ║
     ║  └────────────────────┘   ║
     ║  "人之初，性本善..."      ║
     ╚══════════════════════════╝`,
// 帧3：偷偷打瞌睡
`     ╔══════════════════════════╗
     ║      ╱╲   ╱╲   ╱╲       ║
     ║     ╱  ╲ ╱  ╲ ╱  ╲      ║
     ║    ╱ 恩 ╲╱ 师 ╲╱ 上 ╲    ║
     ║   ╱ 师 座╲      ╱        ║
     ║  ┌────────────────────┐   ║
     ║  │  📖  📚  📜  🖌️   │   ║
     ║  │                    │   ║
     ║  │   ∧_∧  ∧_∧ ∧_∧    │   ║
     ║  │  (・ω・)(-ω-)(・ω・) │   ║
     ║  │  /つつ /つつ /つつ  │   ║
     ║  │  │zZ│ │💤│ │文│    │   ║
     ║  │  ヽつ  ヽつ  ヽつ   │   ║
     ║  │                    │   ║
     ║  └────────────────────┘   ║
     ║   "那个打瞌睡的！站起来！" ║
     ╚══════════════════════════╝`,
    ],
    ambient: {
      type: 'dust',
      particles: ['·', '◦', '✧', '·'],
      speed: 4000,
      color: 'rgba(180,200,220,0.4)',
    },
  },

  // ── 7岁：山水之间 ──
  7: {
    bgColor: '#060808',
    accentColor: '#77ccaa',
    frames: [
`    ☁      ☁
  ～ ～ ～ ～ ～ ～
～ ～ ～ ～ ～ ～ ～
⛰ ⛰ ～ ～ ～ ⛰ ⛰
⛰ ⛰ ～ 🏠 ～ ⛰ ⛰
⛰  ╲  ∧_∧  ╱  ⛰
⛰    ╲(・ω・)╱   ⛰
⛰     ╲/つつ╱    ⛰
⛰⛰   |  ✦  |   ⛰⛰
⛰    ヽ  つ      ⛰
⛰  ··· 山中岁月 ··· ⛰
⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰`,
`    ☁      ☁
  ～ ～ ～ ～ ～ ～
～ ～ ～ ～ ～ ～ ～
⛰ ⛰ ～ ～ ～ ⛰ ⛰
⛰ ⛰ ～ 🏠 ～ ⛰ ⛰
⛰  ╲  ∧_∧  ╱  ⛰
⛰    ╲(≧▽≦)╱   ⛰
⛰  🐦╲/つつ╱🦋   ⛰
⛰⛰   | ★  |   ⛰⛰
⛰    ヽ  つ      ⛰
⛰  ··· 追鸟少年 ··· ⛰
⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰`,
`    ☁      ☁
  ～ ～ ～ ～ ～ ～
～ ～ ～ ～ ～ ～ ～
⛰ ⛰ ～ ～ ～ ⛰ ⛰
⛰ ⛰ ～ 🏠 ～ ⛰ ⛰
⛰  ╲  ∧_∧  ╱  ⛰
⛰    ╲(-ω-)╱   ⛰
⛰   🌙 ╲/zzz╱🌙   ⛰
⛰⛰   | 💤 |   ⛰⛰
⛰    ヽ  つ      ⛰
⛰  ··· 夜 读 经 书· ⛰
⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰⛰`,
    ],
    ambient: {
      type: 'leaves',
      particles: ['🍃', '🌿', '✧', '·'],
      speed: 2800,
      color: 'rgba(100,200,160,0.5)',
    },
  },

  // ── 8岁：田野/山林 ──
  8: {
    bgColor: '#050a05',
    accentColor: '#88cc44',
    frames: [
// 帧1：青山绿野
`    ☁      ☁         ☁
      ～  ～  ～  ～
   ～  ～  ～  ～  ～  ～
 🌲🌲🌲  ～  ～  ～  🌲🌲🌲
🌲    🌲 ～  ～  ～ 🌲    🌲
🌲     🌲            🌲     🌲
🌲      ╲    ∧_∧    ╱      🌲
🌲  🦋    ╲  (・ω・) ╱   🦋  🌲
 🌲        ╲/  つ  つ╱        🌲
  🌲🌲🌲   | ✦  ✦ |   🌲🌲🌲
    🌲     ヽ  つ   つ     🌲
    🌲      ~~~~~~~       🌲
╔═══════════════════════════════╗
║  🦗  🌸  🐛  🍃  🦋  🌿  🐝  ║
╚═══════════════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░`,
// 帧2：追蝴蝶
`    ☁      ☁         ☁
      ～  ～  ～  ～
   ～  ～  ～  ～  ～  ～
 🌲🌲🌲  ～  ～  ～  🌲🌲🌲
🌲    🌲 ～  ～  ～ 🌲    🌲
🌲     🌲            🌲     🌲
🌲      ╲    ∧_∧    ╱      🌲
🌲       ╲ (≧▽≦) ╱  🦋→   🌲
 🌲        ╲/ つ  つ╱        🌲
  🌲🌲🌲   | ✦  ✦ |   🌲🌲🌲
    🌲     ヽ  つ   つ     🌲
    🌲   "蝴蝶别跑！"  🌲
╔═══════════════════════════════╗
║  🦗  🌸  🐛  🍃  🦋  🌿  🐝  ║
╚═══════════════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░`,
// 帧3：发现秘密基地
`    ☁      ☁         ☁
      ～  ～  ～  ～
   ～  ～  ～  ～  ～  ～
 🌲🌲🌲  ～  ～  ～  🌲🌲🌲
🌲    🌲 ～  ～  ～ 🌲    🌲
🌲     🌲  ╔══════╗  🌲     🌲
🌲      ╲  ║  ?  ║ ╱      🌲
🌲       ╲ ║ ∧_∧ ║╱        🌲
 🌲        ╲║(・ω・)║        🌲
  🌲🌲🌲   ║/つ  つ║  🌲🌲🌲
    🌲     ║ ✨✨✨ ║     🌲
    🌲     ╚══════╝    🌲
╔═══════════════════════════════╗
║  "这里以后就是我的秘密基地！"  ║
╚═══════════════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░`,
    ],
    ambient: {
      type: 'leaves',
      particles: ['🍃', '🌿', '🍂', '·'],
      speed: 2500,
      color: 'rgba(120,200,80,0.5)',
    },
  },

  // ── 10岁：书院/城郭 ──
  10: {
    bgColor: '#080608',
    accentColor: '#dd9944',
    frames: [
`  ╔══════════════════════════╗
  ║   · 州 府 书 院 ·       ║
  ║  ┌────────────────────┐   ║
  ║  │  📜  📚  🖌️  📜  │   ║
  ║  │                    │   ║
  ║  │ ∧_∧  ∧_∧  ∧_∧ ∧_∧│   ║
  ║  │(・ω・)(-ω-)(・ω·)(・ω)│
  ║  │/つつ  /zzz /つつ/つ  │
  ║  │|写文| |睡| |背书||算|│
  ║  │ ヽつ  ヽつ  ヽつ ヽつ│   ║
  ║  │                    │   ║
  ║  │  "人之初，性本善…"  │   ║
  ║  └────────────────────┘   ║
  ║  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ║
  ╚══════════════════════════╝`,
`  ╔══════════════════════════╗
  ║   · 城 墙 之 上 ·       ║
  ║                          ║
  ║  ∧_∧                    ║
  ║ (・ω・)  眺望远方        ║
  ║ /つ  つ                  ║
  ║ |城墙|   ～ ～ ～ ～    ║
  ║ ヽ  つ   ～  ～  ～     ║
  ║                          ║
  ║  "爹说，城墙外面就是江湖"║
  ║     "总有一天我要去看看"  ║
  ║                          ║
  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
  ╚══════════════════════════╝`,
`  ╔══════════════════════════╗
  ║   · 夜 间 偷 练 ·       ║
  ║                          ║
  ║      🌙         🌙      ║
  ║    ∧_∧                 ║
  ║   (≧▽≦)  比划拳脚      ║
  ║   /╱  ╲   💨           ║
  ║   │  出拳 │            ║
  ║   ヽ  つ              ║
  ║      ✦  ✦  ✦          ║
  ║   "这一招……好像对了"   ║
  ║                          ║
  ║  ░░░░░░░░░░░░░░░░░░  ║
  ╚══════════════════════════╝`,
    ],
    ambient: {
      type: 'dust',
      particles: ['·', '◦', '✧', '·'],
      speed: 3500,
      color: 'rgba(220,150,60,0.4)',
    },
  },

  // ── 12岁：习武/街巷 ──
  12: {
    bgColor: '#080505',
    accentColor: '#cc8844',
    frames: [
// 帧1：武馆练功
`  ╔════════════════════════════╗
  ║   ⚔  武 馆 · 练 功 场  ⚔  ║
  ║  ┌──────────────────────┐   ║
  ║  │  ╔══╗    🏮    ╔══╗  │   ║
  ║  │  ║拳║          ║剑║  │   ║
  ║  │  ╚══╝          ╚══╝  │   ║
  ║  │                      │   ║
  ║  │   ∧_∧   ∧_∧   ∧_∧  │   ║
  ║  │  ( ⌒ω) ( ⌒ω) ( ⌒ω) │   ║
  ║  │  /╱  ╲ /╱  ╲ /╱  ╲  │   ║
  ║  │  │出拳││踢腿││扎马│ │   ║
  ║  │  ヽ  つ ヽ  つ ヽ  つ  │   ║
  ║  │                      │   ║
  ║  │   嘭！啪！喝！哈！    │   ║
  ║  └──────────────────────┘   ║
  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
  ╚════════════════════════════╝`,
// 帧2：师父指导
`  ╔══════════════════════════╗
  ║   ⚔  武 馆 · 练 功 场  ⚔  ║
  ║  ┌──────────────────────┐   ║
  ║  │  ╔══╗    🏮    ╔══╗  │   ║
  ║  │  ║拳║          ║剑║  │   ║
  ║  │  ╚══╝          ╚══╝  │   ║
  ║  │                      │   ║
  ║  │  ＞︿＜    ∧_∧   ∧_∧  │   ║
  ║  │ / ⌒ヽ  (・ω・)(・ω・)│   ║
  ║  │/ ○   ＼/つ  つ/つ  つ │   ║
  ║  │|  ▽    || ✦  || ✦  │   ║
  ║  │|        ||    ||    |   ║
  ║  │  "重心再低一些！"     │   ║
  ║  │                      │   ║
  ║  └──────────────────────┘   ║
  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
  ╚════════════════════════════╝`,
// 帧3：比武切磋
`  ╔══════════════════════════╗
  ║   ⚔  武 馆 · 切 磋 台  ⚔  ║
  ║  ┌──────────────────────┐   ║
  ║  │  ╔══╗    🏮    ╔══╗  │   ║
  ║  │  ║拳║          ║剑║  │   ║
  ║  │  ╚══╝          ╚══╝  │   ║
  ║  │                      │   ║
  ║  │   ∧_∧      ∧_∧      │   ║
  ║  │  (≧▽≦)！←→(⌒▽⌒)！  │   ║
  ║  │  /╱  ╲  →/╱  ╲      │   ║
  ║  │  │    │  ││    │      │   ║
  ║  │  ヽ  つ  ヽ ヽ  つ     │   ║
  ║  │     💥  嘭！          │   ║
  ║  │   "好！进步很大！"     │   ║
  ║  │                      │   ║
  ║  └──────────────────────┘   ║
  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
  ╚════════════════════════════╝`,
    ],
    ambient: {
      type: 'sparks',
      particles: ['✦', '✧', '·', '💥', '🔥', '⚡'],
      speed: 2000,
      color: 'rgba(255,160,60,0.6)',
    },
  },

  // ── 14岁：雨中独行 ──
  14: {
    bgColor: '#060810',
    accentColor: '#6699cc',
    frames: [
`  ·    ·    ·    ·    ·
·  ·    ·  🌧️  ·    ·  ·
·    ·    ·    ·    ·    ·
    ·   ·    ·   ·
  ～～～～～～～～～～～～
  ～ ～ ～ ～ ～ ～ ～
～～ ∧_∧ ～ ～ ～ ～ ～
～ (・ω·) 冒雨独行 ～
～ /つ  つ ～ ～ ～ ～ ～
～～|背包|～～～～～～～～
～～ ヽ つ ～ ～ ～ ～ ～
～ ～ ～ ～ ～ ～ ～ ～
～～～ 风雨兼程 ～～～～
░░░░░░░░░░░░░░░░░░░░░`,
`  ·    ·    ·    ·    ·
·  ·    ·  🌧️  ·    ·  ·
·    ·    ·    ·    ·    ·
    ·   ·    ·   ·
  ～～～～～～～～～～～～
  ～ ～ ～ ～ ～ ～ ～
～～ ∧_∧ ～ ～ ～ ～ ～
～ (⌒ω⌒) 咬紧牙关 ～
～ /つ  つ ～ ～ ～ ～ ～
～～|坚定|～～～～～～～～
～～ ヽ つ ～ ～ ～ ～ ～
～ ～ ～ ～ ～ ～ ～ ～
～～～ 不会停下 ～～～～
░░░░░░░░░░░░░░░░░░░░░`,
`  ·    ·    ·    ·    ·
·  ·    ·    ·    ·  ·  ·
·    ·    🌙  ·    ·    ·
    ·   ·    ·   ·
  ～～～～～～～～～～～～
  ～ ～ ～ ～ ～ ～ ～
～～∧_∧ ～ ～ ～ ～ ～ ～
～ ( -ω- ) 气喘吁吁 ～
～ /つ  つ ～ ～ ～ ～ ～
～～|雨停|～～～～～～～～
～～ ヽ  つ ～ ～ ～ ～ ～
～ ～ ～ ～ ～ ～ ～ ～
～～～ 雨过天晴 ～～～～
░░░░░░░░░░░░░░░░░░░░░`,
    ],
    ambient: {
      type: 'rain',
      particles: ['💧', '·', '🌧️', '·'],
      speed: 2000,
      color: 'rgba(100,150,200,0.6)',
    },
  },

  // ── 15岁：江湖旅途 ──
  15: {
    bgColor: '#080508',
    accentColor: '#aa88ff',
    frames: [
// 帧1：踏上旅途
`    ✦    ·    ✦         ·
  ·        ✦    ·   ✦
    ·   ✦        ·     ✦
       ☁    ☁    ☁
   🌙                      🌙
        ／＼  ／＼  ／＼
       ／  ＼／  ＼／  ＼
  ～～／    ～    ～    ＼～～～～
 ～～／  🌲🌲🌲🌲🌲🌲🌲🌲  ＼～～
～～／                    ＼～～～
  ～│  🏚️  🛤️  🏚️  🛤️  │～
  ～│ ∧_∧               │～
～～│( ⌒ω⌒)  背着行囊   │～～
  ～│/ つ  つ  独自行走  │～
～～││ 行囊 │  向远方    │～～
  ～ ヽ  つ              ～
～～～～～～～～～～～～～～～～～～
 ░░░░░░░░░░░░░░░░░░░░░░░░░░`,
// 帧2：客栈歇脚
`    ✦    ·    ✦         ·
  ·        ✦    ·   ✦
    ·   ✦        ·     ✦
       ☁    ☁    ☁
   🌙                      🌙
  ╔═══════════════════════════╗
  ║   🏮 客 栈 🏮              ║
  ║  ┌───────────────────────┐ ║
  ║  │  🍵  🍶  🥟  🍜  🍶  🍵│ ║
  ║  │                       │ ║
  ║  │ ∧_∧    ∧_∧    ∧_∧    │ ║
  ║  │(・ω・) ( ⌒ω) (・ω・)  │ ║
  ║  │/つ  つ /つ  つ/つ  つ  │ ║
  ║  ││饮茶│ │饮酒│ │吃饭│  │ ║
  ║  │ ヽ  つ  ヽ  つ ヽ  つ   │ ║
  ║  │                       │ ║
  ║  │  "老板，再来一壶酒！"   │ ║
  ║  └───────────────────────┘ ║
  ╚═══════════════════════════╝
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`,
// 帧3：月下独行
`    ·    ✦    ·    ✦    ·
  ✦      ·    ✦      ·    ✦
    ·      🌕      ·
       ·   ·   ·   ·
   ·    ·   ·   ·    ·
   ·   ·    ·    ·   ·
  ·         ／＼         ·
 ·       ／    ＼       ·
       ／ ∧_∧    ＼
     ／  ( ⌒ω⌒)    ＼
   ／    /  つ  つ     ＼
  │    |  🎒    |      │
  │    ヽ  つ             │
  │     ～～～～           │
  │   脚步回响在月光下     │
  │                        │
～～～～～～～～～～～～～～～～～～
 ░░░░░░░░░░░░░░░░░░░░░░░░░░`,
    ],
    ambient: {
      type: 'stars',
      particles: ['✦', '·', '✧', '·'],
      speed: 3500,
      color: 'rgba(180,160,255,0.5)',
    },
  },

  // ── 17岁：深夜修炼 ──
  17: {
    bgColor: '#08050a',
    accentColor: '#bb77ff',
    frames: [
`  ✦  ·  ✦  ·  ✦  ·  ✦
·  ✦  ·  ✦  ·  ✦  ·  ✦
  ·  ✦  ·  🌙  ·  ✦
  ╔═════════════════════╗
  ║  ·绝 壁 之 巅·   ║
  ║                    ║
  ║    ∧_∧    ✦  ✦   ║
  ║   ( ⌒ω⌒) 修炼中   ║
  ║   /╱  ╲   💫     ║
  ║   │ 调息 │        ║
  ║   ヽ  つ          ║
  ║       ╲ ╱         ║
  ║      崖 · 崖      ║
  ║  ░░░░░░░░░░░░░   ║
  ╚═════════════════════╝
   · 万籁俱寂 · 内力涌动 ·`,
`  ✦  ·  ✦  ·  ✦  ·  ✦
·  ✦  ·  ✦  ·  ✦  ·  ✦
  ·  ✦  ·  🌙  ·  ✦
  ╔═════════════════════╗
  ║  ·古 剑 遗 迹·   ║
  ║                    ║
  ║    ∧_∧    ⚔  ⚔   ║
  ║   (≧▽≦)  领悟！   ║
  ║   /╱  ╲   ✨✨    ║
  ║   │ 剑意 │   ✦    ║
  ║   ヽ  つ     ✧   ║
  ║    · 剑气纵横 ·   ║
  ║      ╱   ╲       ║
  ║  ░░░░░░░░░░░░░   ║
  ╚═════════════════════╝
   · 霍然开朗 · 突破瓶颈 ·`,
`  ✦  ·  ✦  ·  ✦  ·  ✦
·  ✦  ·  ✦  ·  ✦  ·  ✦
  ·  ✦  ·  🌕  ·  ✦
  ╔═════════════════════╗
  ║  ·黎 明 破 晓·   ║
  ║                    ║
  ║    ∧_∧    ☀       ║
  ║   ( ⌒ω⌒)  睁眼    ║
  ║   /╱  ╲   🌅     ║
  ║   │ 充实 │        ║
  ║   ヽ  つ          ║
  ║  ═════════════    ║
  ║  ║  山  水  间  ║  ║
  ║  ═════════════    ║
  ╚═════════════════════╝
   · 晨光熹微 · 功力大进 ·`,
    ],
    ambient: {
      type: 'stars',
      particles: ['✦', '✧', '💫', '·'],
      speed: 2500,
      color: 'rgba(180,120,255,0.5)',
    },
  },

  // ── 18岁：少年英豪 ──
  18: {
    bgColor: '#0a0508',
    accentColor: '#ffd700',
    frames: [
// 帧1：城楼远眺
`  ✦  ·  ✦  ·  ✦  ·  ✦  ·  ✦
·  ✦  ·  ✦  ·  ✦  ·  ✦  ·  ✦
  ·  ✦  ·  🌕  ·  ✦  ·  ✦
╔═════════════════════════════════╗
║  城  ║                     ║  城  ║
║  门  ║ ∧_∧  背负行囊      ║  门  ║
║  楼  ║( ⌒ω⌒) 眺望远方    ║  楼  ║
║  ·   ║/  つ  つ  剑在腰间  ║  ·   ║
║  🏮  ║│  ⚔️   │           ║  🏮  ║
║  ·   ║ ヽ  つ              ║  ·   ║
║      ║  │ │               ║      ║
╠══════╩═════════════════════╩══════╣
║  ┌──┐    ┌──┐    ┌──┐    ┌──┐   ║
║  │家│    │铺│    │馆│    │塔│   ║
║  └──┘    └──┘    └──┘    └──┘   ║
║ ～～～～～～～～～～～～～～～～～  ║
║  洛阳城 · 江湖路从此开始         ║
╚═════════════════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`,
// 帧2：拔剑立志
`  ✦  ·  ✦  ·  ✦  ·  ✦  ·  ✦
·  ✦  ·  ✦  ·  ✦  ·  ✦  ·  ✦
  ·  ✦  ·  🌕  ·  ✦  ·  ✦
╔═════════════════════════════════╗
║  城  ║        ⚔️          ║  城  ║
║  门  ║  ＞︿＜  ══╸    ║  门  ║
║  楼  ║ / ⌒ヽ  ║锋    ║  楼  ║
║  ·   ║/ ○  ＼ ║芒    ║  ·   ║
║  🏮  ║│  ▽   │║万    ║  🏮  ║
║  ·   ║│      │║丈    ║  ·   ║
║      ║ ヽ  つ  ║       ║      ║
╠══════╩═════════════════════╩══════╣
║  ┌──┐    ┌──┐    ┌──┐    ┌──┐   ║
║  │家│    │铺│    │馆│    │塔│   ║
║  └──┘    └──┘    └──┘    └──┘   ║
║ ～～～～～～～～～～～～～～～～～  ║
║   "此剑在手，天下我有！"       ║
╚═════════════════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`,
// 帧3：踏入江湖
`  ✦  ·  ✦  ·  ✦  ·  ✦  ·  ✦
·  ✦  ·  ✦  ·  ✦  ·  ✦  ·  ✦
  ·  ✦  ·  🌕  ·  ✦  ·  ✦
      ╱  江湖路远  ＼
    ╱  少年侠客行   ＼
   ╱  ╱╲  ╱╲  ╱╲    ＼
  ╱   ╱  ╲╱  ╲╱  ╲     ＼
 ╱    ∧_∧    ⚔️     ∧_∧   ＼
│    ( ⌒ω⌒)   ·   ( ⌒ω⌒)   │
│    /  つ  つ  →  /  つ  つ   │
│    │              │          │
│    ヽ  つ         ヽ  つ      │
│        → 踏入江湖 →          │
│                              │
╔════════════════════════════════╗
║ ·少年英豪· 江湖故事由此展开· ║
╚════════════════════════════════╝
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`,
    ],
    ambient: {
      type: 'golden',
      particles: ['✦', '⭐', '✧', '·', '🌟', '💫'],
      speed: 2000,
      color: 'rgba(255,215,0,0.5)',
    },
  },
};

/**
 * 根据事件mood叠加额外的视觉元素
 */
const MOOD_EFFECTS = {
  sad: { overlay: 'rgba(40,0,0,0.3)', particles: ['💧', '·', '💧'] },
  lucky: { overlay: 'rgba(0,40,0,0.2)', particles: ['🍀', '✨', '🌟'] },
  mysterious: { overlay: 'rgba(0,0,40,0.3)', particles: ['🌙', '✧', '·'] },
  scary: { overlay: 'rgba(40,0,40,0.3)', particles: ['💀', '⚡', '·'] },
  happy: { overlay: 'rgba(0,40,40,0.2)', particles: ['🌸', '🎉', '·'] },
  proud: { overlay: 'rgba(40,30,0,0.2)', particles: ['🔥', '💪', '·'] },
  warm: { overlay: 'rgba(40,20,0,0.2)', particles: ['💛', '🦌', '·'] },
  angry: { overlay: 'rgba(50,0,0,0.3)', particles: ['🔥', '💥', '·'] },
  excited: { overlay: 'rgba(0,30,40,0.2)', particles: ['⚡', '✨', '·'] },
  inspired: { overlay: 'rgba(20,0,40,0.2)', particles: ['💫', '✨', '·'] },
  determined: { overlay: 'rgba(30,20,0,0.2)', particles: ['💪', '⭐', '·'] },
};

// ════════════════════════════════════════════════════════════════
//  字符画帧动画引擎
// ════════════════════════════════════════════════════════════════

let _sceneAnimTimer = null;
let _artBreatheTimer = null;
let _ambientTimer = null;
let _sceneAnimTimerList = []; // 额外的 interval timer（如角色 sprite 循环）
let _ambientParticles = [];
let _currentFrame = 0;

/**
 * 氛围粒子系统（增强版：更多粒子、正弦飘动、闪烁、大小脉动）
 */
function createAmbientParticles(container, ambient) {
  _ambientParticles = [];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'ambient-particle';
    const char = ambient.particles[Math.floor(Math.random() * ambient.particles.length)];
    p.textContent = char;
    const sz = 10 + Math.random() * 12;
    p.style.cssText = `
      position:absolute;
      font-size:${sz}px;
      opacity:0;
      pointer-events:none;
      left:${Math.random() * 100}%;
      top:${-10 - Math.random() * 20}%;
      z-index:2;
      transition: none;
      filter: blur(${Math.random() > 0.6 ? 1 : 0}px);
      color: ${ambient.color || 'inherit'};
    `;
    container.appendChild(p);
    _ambientParticles.push({
      el: p,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      speed: 0.2 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.2,
      delay: Math.random() * 3000,
      size: sz,
      phase: Math.random() * Math.PI * 2,       // 闪烁相位
      swayPhase: Math.random() * Math.PI * 2,   // 飘动相位
      swayAmp: 0.3 + Math.random() * 0.8,       // 飘动幅度
      swayFreq: 0.5 + Math.random() * 1.5,      // 飘动频率
      blinkSpeed: 1 + Math.random() * 2,        // 闪烁速度
    });
  }

  // 启动粒子动画
  let lastTime = 0;
  let globalTime = 0;
  function animateParticles(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    globalTime += dt / 1000;

    _ambientParticles.forEach(particle => {
      particle.delay -= dt;
      if (particle.delay > 0) return;

      particle.y += particle.speed * (dt / 100);
      // 正弦波飘动（水平方向）
      particle.swayPhase += particle.swayFreq * dt / 1000;
      const swayOffset = Math.sin(particle.swayPhase) * particle.swayAmp;
      particle.x += particle.drift * (dt / 100) + swayOffset * (dt / 100);

      if (particle.y > 110) {
        particle.y = -10 - Math.random() * 20;
        particle.x = Math.random() * 100;
        particle.delay = Math.random() * 800;
      }
      if (particle.x < -5) particle.x = 105;
      if (particle.x > 105) particle.x = -5;

      // 渐入渐出 + 闪烁
      const fade = particle.y < 5 ? (particle.y + 10) / 15 :
                   particle.y > 90 ? (100 - particle.y) / 10 : 1;
      const blink = 0.6 + 0.4 * Math.sin(globalTime * particle.blinkSpeed + particle.phase);
      particle.el.style.opacity = Math.max(0, Math.min(1, fade * 0.8 * blink));

      // 大小微脉动
      const sizePulse = 1 + Math.sin(globalTime * 0.8 + particle.phase) * 0.15;
      particle.el.style.fontSize = (particle.size * sizePulse) + 'px';

      particle.el.style.left = particle.x + '%';
      particle.el.style.top = particle.y + '%';
    });

    _ambientTimer = requestAnimationFrame(animateParticles);
  }
  _ambientTimer = requestAnimationFrame(animateParticles);
}

/**
 * 停止所有动画
 */
function stopSceneAnimations() {
  if (_sceneAnimTimer) { clearInterval(_sceneAnimTimer); _sceneAnimTimer = null; }
  if (_ambientTimer) { cancelAnimationFrame(_ambientTimer); _ambientTimer = null; }
  if (_artBreatheTimer) { cancelAnimationFrame(_artBreatheTimer); _artBreatheTimer = null; }
  _ambientParticles = [];
  document.querySelectorAll('.ambient-particle').forEach(el => el.remove());
  _currentFrame = 0;
  // 清理额外注册的角色 sprite timer
  if (_sceneAnimTimerList) { _sceneAnimTimerList.forEach(clearInterval); _sceneAnimTimerList = []; }
}

/**
 * 自适应缩放字符画到屏幕宽度
 */
function scaleSceneArtToFit() {
  const scaleEl = document.getElementById('sceneArtScale');
  const containerEl = document.getElementById('sceneArtContainer');
  const artEl = document.getElementById('sceneArt');
  if (!scaleEl || !containerEl || !artEl) return;
  const containerW = containerEl.clientWidth;
  const artW = artEl.scrollWidth;
  if (artW > containerW) {
    const s = containerW / artW;
    scaleEl.style.transform = `scale(${s})`;
    scaleEl.style.width = artW + 'px';
    // 缩放后补偿高度
    const artH = artEl.scrollHeight;
    scaleEl.parentElement.style.height = (artH * s) + 'px';
  } else {
    scaleEl.style.transform = '';
    scaleEl.style.width = '';
    scaleEl.parentElement.style.height = '';
  }
}

/**
 * 启动场景帧循环 + 微动画
 */
function startSceneFrameLoop(sceneArtEl, frames, speed) {
  _currentFrame = 0;
  const showFrame = () => {
    if (!sceneArtEl || !sceneArtEl.isConnected) return;
    const frame = frames[_currentFrame % frames.length];
    sceneArtEl.textContent = frame;
    // 缩放适配
    setTimeout(scaleSceneArtToFit, 10);
    // 帧切换效果：先缩小再恢复，带轻微摇摆
    sceneArtEl.style.transition = 'opacity 0.3s ease, transform 0.5s ease';
    sceneArtEl.style.opacity = '0';
    sceneArtEl.style.transform = 'scale(0.97) translateY(2px)';
    setTimeout(() => {
      sceneArtEl.style.opacity = '1';
      sceneArtEl.style.transform = 'scale(1) translateY(0)';
    }, 80);
    _currentFrame++;
  };
  showFrame(); // 立即显示第一帧
  _sceneAnimTimer = setInterval(showFrame, speed || 3500);

  // 字符画呼吸微动画：轻微上下浮动+发光脉动
  startArtBreathingAnimation(sceneArtEl);
}

/**
 * 字符画呼吸/脉动微动画（持续运行，让画面有生命感）
 */
function startArtBreathingAnimation(artEl) {
  if (!artEl || !artEl.isConnected) return;
  let phase = 0;
  const breathe = () => {
    if (!artEl || !artEl.isConnected) return;
    phase += 0.015;
    const yShift = Math.sin(phase) * 1.5; // 轻微上下浮动
    const glow = 0.3 + Math.sin(phase * 0.7) * 0.15; // 发光脉动
    artEl.style.transform = `translateY(${yShift}px)`;
    artEl.style.filter = `drop-shadow(0 0 ${6 + glow * 8}px ${getComputedStyle(artEl).color}33)`;
    _artBreatheTimer = requestAnimationFrame(breathe);
  };
  if (_artBreatheTimer) cancelAnimationFrame(_artBreatheTimer);
  _artBreatheTimer = requestAnimationFrame(breathe);
}

/**
 * 字符画文字打字机效果
 */
function typewriterEffect(element, text, speed, callback) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
    } else {
      clearInterval(timer);
      if (callback) callback();
    }
  }, speed || 40);
  return timer;
}

// ════════════════════════════════════════════════════════════════
//  出身生成器
// ════════════════════════════════════════════════════════════════

let originData = null;
let currentEventIndex = 0;
let eventChain = [];
// 出生场景临时数据（起名阶段用）
let birthPrelim = null; // { background, surname, gender }

// ── 随机名字池 ──
const GIVEN_NAME_POOL = {
  male: ['天明', '云飞', '逸风', '子轩', '浩然', '凌霄', '长风', '惊鸿', '破军', '踏雪',
         '无痕', '寒星', '青衫', '苍云', '笑天', '醉月', '剑心', '飞羽', '墨白', '玄清',
         '承志', '景行', '怀瑾', '清风', '一鸣'],
  female: ['如烟', '素心', '梦蝶', '紫霞', '清露', '月华', '凌波', '飞雪', '幽兰', '含烟',
           '碧瑶', '雪落', '红绫', '若曦', '青鸾', '秋水', '映月', '紫嫣', '霜华', '凝霜',
           '婉清', '沐晴', '念卿', '灵犀', '落雁'],
};

// ── 父母称呼数据（按出身） ──
const PARENT_TITLES = {
  blacksmith: { father: '铁匠老爹', mother: '铁匠娘' },
  scholar:    { father: '父亲大人', mother: '母亲大人' },
  martial:    { father: '师父父亲', mother: '母亲' },
  merchant:   { father: '爹爹', mother: '娘亲' },
  farmer:     { father: '爹', mother: '娘' },
  doctor:     { father: '爹爹', mother: '娘亲' },
  orphan:     { father: '收留你的老伯', mother: '邻家大娘' },
  official:   { father: '父亲大人', mother: '母亲' },
  pirate:     { father: '当家的', mother: '掌柜的' },
  performer:  { father: '班主爹', mother: '花旦娘' },
  hunter:     { father: '猎人爹', mother: '山里的娘' },
  beggar:     { father: '帮中长老', mother: '帮中师姑' },
  monk:       { father: '方丈师父', mother: '知客师太' },
  boatman:    { father: '船老大', mother: '船娘' },
  fisherman:  { father: '渔夫爹', mother: '渔家娘' },
  musician:   { father: '琴师爹', mother: '乐娘' },
};

// ════════════════════════════════════════════════════════════════
//  出生场景字符画
// ════════════════════════════════════════════════════════════════
const BIRTH_SCENE_ART = [
  // 帧1：产房内
  `        ╭─────────────────────────╮
        │         ☆  ☆  ☆         │
        │       ☆   ✦   ☆         │
        │                         │
        │    ∧_∧        ∧_∧      │
        │   (⊙o⊙)    (´・ω・\`)   │
        │    |  |   ╭─┤  ┤╮     │
        │    ヽ ヽ   │ 💫 ││     │
        │          ╰─────╯│     │
        │         (  👶  )│     │
        │          ╰────╯ │     │
        │                 │     │
        │  ~~~ 🏠 ${'家'} ~~~       │
        ╰─────────────────────────╯`,

  // 帧2：婴儿啼哭
  `        ╭─────────────────────────╮
        │         ☆  ☆  ☆         │
        │       ☆   ✦   ☆         │
        │                         │
        │    ∧_∧        ∧_∧      │
        │   (⊙o⊙)    (>_<)       │
        │    |  |   ╭─┤  ┤╮     │
        │    ヽ ヽ   │ 💫 ││     │
        │          ╰─────╯│     │
        │         (  👶  )│     │
        │         /"哇~~"\\│     │
        │          ╰────╯ │     │
        │                 │     │
        │  ~~~ 喜得贵子 ~~~      │
        ╰─────────────────────────╯`,

  // 帧3：温柔怀抱
  `        ╭─────────────────────────╮
        │         ✧  ✧  ✧         │
        │       ✧   💕   ✧         │
        │                         │
        │    ∧_∧                  │
        │   (´・ω・\`)  ╭───────╮ │
        │    |  |     │  👶    │ │
        │    ヽ ヽ     │  ~  ~  │ │
        │            ╰─────────╯ │
        │         ✿  ✿  ✿       │
        │                         │
        │                         │
        │   ~ 温暖的家 ~          │
        ╰─────────────────────────╯`,
];

// ════════════════════════════════════════════════════════════════
//  第一步半：出生场景 — 全自动播放（无玩家交互）
// ════════════════════════════════════════════════════════════════

/**
 * 出生场景 + 自动起名
 * 流程：字符画动画展示出生 → 父母对话自动播放 → 父母自动取名 → 自动进入出身介绍
 */
function showBirthScene() {
  stopSceneAnimations();
  if (!birthPrelim) return;

  const bg = birthPrelim.background;
  const surname = birthPrelim.surname;
  const gender = birthPrelim.gender;
  const genderText = gender === 'female' ? '千金' : '公子';
  const parent = PARENT_TITLES[bg.id] || { father: '父亲', mother: '母亲' };
  const genderAdj = gender === 'female' ? '乖巧的' : '虎头虎脑的';

  // 自动取名
  const namePool = GIVEN_NAME_POOL[gender];
  const givenName = namePool[Math.floor(Math.random() * namePool.length)];
  const fullName = surname + givenName;

  const overlay = document.createElement('div');
  overlay.id = 'birthOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:#000;z-index:9999;display:flex;align-items:center;justify-content:center;
    flex-direction:column;
  `;

  overlay.innerHTML = `
    <div id="birthContent" style="max-width:480px;padding:30px;text-align:center;
      opacity:0;transition:opacity 1.5s ease">

      <!-- 出生场景字符画 -->
      <div style="font-size:11px;color:rgba(240,192,96,.4);letter-spacing:3px;margin-bottom:16px">
        · ${bg.hometown} · ${bg.name} ·
      </div>

      <div id="birthArt" style="font-family:'Courier New',monospace;font-size:11px;line-height:1.2;
        color:#e8d5a3;white-space:pre;margin:0 auto 20px;transition:opacity 0.5s ease">
${BIRTH_SCENE_ART[0]}
      </div>

      <!-- 父母对话区 -->
      <div id="birthDialogue" style="opacity:0;transition:opacity 0.8s ease 1.5s">
        <div style="background:rgba(240,192,96,.05);border:1px solid rgba(240,192,96,.15);
          border-radius:8px;padding:16px;margin-bottom:16px;text-align:left">
          <div style="font-size:10px;color:rgba(240,192,96,.5);letter-spacing:2px;margin-bottom:10px">
            · 喜得${genderText} ·
          </div>
          <div id="birthNarration" style="font-size:12px;color:#d0b090;line-height:2">
            ${gender === 'female'
              ? `${bg.hometown}${bg.name}的一户${bg.profession}人家，今晨喜得千金。<br>${parent.father}抱着${genderAdj}小女儿，满脸慈爱。`
              : `${bg.hometown}${bg.name}的一户${bg.profession}人家，今晨喜得贵子。<br>${parent.father}抱着${genderAdj}小家伙，满脸慈爱。`}
          </div>
        </div>

        <!-- 父母对话气泡 -->
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
          <div style="background:rgba(60,40,20,.4);border-radius:8px;padding:10px 14px;
            text-align:left;position:relative">
            <div style="font-size:9px;color:rgba(240,192,96,.5);margin-bottom:4px">${parent.father}</div>
            <div id="fatherDialogue" style="font-size:12px;color:#d0b090;line-height:1.6">
              ${_birthFatherDialogue(bg, gender)}
            </div>
          </div>
          <div style="background:rgba(40,30,60,.4);border-radius:8px;padding:10px 14px;
            text-align:left;position:relative">
            <div style="font-size:9px;color:rgba(200,180,220,.5);margin-bottom:4px">${parent.mother}</div>
            <div id="motherDialogue" style="font-size:12px;color:#c0b0d0;line-height:1.6">
              ${_birthMotherDialogue(bg, gender)}
            </div>
          </div>
        </div>

        <!-- 赐名区域（自动展示） -->
        <div id="birthNaming" style="opacity:0;transition:opacity 0.8s ease">
          <div style="font-size:14px;color:#ffd060;margin-bottom:12px;letter-spacing:2px">
            ✍ 赐名
          </div>
          <div style="font-size:12px;color:#d0b090;line-height:1.8;text-align:left;
            background:rgba(240,192,96,.04);border-radius:8px;padding:14px">
            <span style="color:rgba(240,192,96,.5)">${parent.father}：</span>
            "就叫 <span style="color:#ffd060;font-size:14px;font-weight:bold">${fullName}</span> 吧！${_birthFatherPickComment(fullName, gender)}"
            <br><br>
            <span style="color:rgba(200,180,220,.5)">${parent.mother}：</span>
            "<span style="color:#ffd060">${fullName}</span>……真好听。"
          </div>
        </div>

        <!-- 名字确认（自动展示） -->
        <div id="birthConfirm" style="opacity:0;transition:opacity 0.8s ease;margin-top:16px">
          <div style="font-size:15px;color:#ffd060;letter-spacing:3px;
            text-shadow:0 0 20px rgba(255,215,0,0.3)">
            ${fullName}
          </div>
          <div style="font-size:11px;color:rgba(200,170,80,.4);margin-top:8px">
            从此，你的故事正式开始。
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 淡入
  setTimeout(() => {
    document.getElementById('birthContent').style.opacity = '1';
  }, 200);

  // 出生音效 + 心跳 + 出生BGM
  setTimeout(() => {
    if(typeof originSfxBirthCry==='function') originSfxBirthCry();
    if(typeof originSfxHeartbeat==='function') originSfxHeartbeat();
    if(typeof originBgmPlay==='function') originBgmPlay('birth');
  }, 600);
  // 额外心跳
  setTimeout(() => { if(typeof originSfxHeartbeat==='function') originSfxHeartbeat(); }, 1400);

  // 字符画帧动画
  let birthFrame = 0;
  const birthArtEl = () => document.getElementById('birthArt');
  const birthTimer = setInterval(() => {
    const el = birthArtEl();
    if (!el) { clearInterval(birthTimer); return; }
    birthFrame = (birthFrame + 1) % BIRTH_SCENE_ART.length;
    el.style.opacity = '0';
    setTimeout(() => {
      const el2 = birthArtEl();
      if (el2) {
        el2.textContent = BIRTH_SCENE_ART[birthFrame];
        el2.style.opacity = '1';
      }
    }, 500);
  }, 4000);
  window._birthTimer = birthTimer;

  // 自动播放时间线
  // 2.2秒后：显示对话
  setTimeout(() => {
    const naming = document.getElementById('birthNaming');
    const dialogue = document.getElementById('birthDialogue');
    if (naming) naming.style.opacity = '1';
    if (dialogue) dialogue.style.opacity = '1';
  }, 2200);

  // 5秒后：显示赐名
  setTimeout(() => {
    const naming = document.getElementById('birthNaming');
    if (naming) naming.style.opacity = '1';
    if(typeof originSfxNaming==='function') originSfxNaming();
  }, 5000);

  // 7秒后：显示名字确认
  setTimeout(() => {
    const confirm = document.getElementById('birthConfirm');
    if (confirm) confirm.style.opacity = '1';
    if(typeof originSfxStatReveal==='function') originSfxStatReveal();
  }, 7000);

  // 9.5秒后：自动进入事件链
  setTimeout(() => {
    clearInterval(window._birthTimer);
    if(typeof originSfxTransition==='function') originSfxTransition();
    fadeOutAndRemove(overlay, 1200, () => {
      finalizeOrigin(fullName, surname, givenName);
      ensureOriginBackdrop();
      currentEventIndex = 0;
      showNextEvent();
    });
  }, 9500);
}

/** 父亲的初始对话 */
function _birthFatherDialogue(bg, gender) {
  const lines = {
    blacksmith: [
      '我这把铁锤打了三十年，今天打的不是刀剑，是做了父亲！',
      '孩子，爹希望你像淬过的好钢一样，硬骨头！',
    ],
    scholar: [
      '"山不在高，有仙则名。"孩子，愿你腹有诗书气自华。',
      '不求你高官厚禄，但愿你知书达理，一生坦荡。',
    ],
    martial: [
      '洪钟响起，天地为证！这孩子骨骼清奇，将来定是练武的好苗子。',
      '爹的刀法还没传人，就指望你了。',
    ],
    merchant: [
      '做生意的算盘打得精，可这孩子的前程，不是算盘算得出来的。',
      '为父希望你胸怀天下，不止于这一方店铺。',
    ],
    farmer: [
      '娃儿啊，咱家祖祖辈辈都在这块地上刨食，可你不同……',
      '你眼里有光，爹年轻时也有过。',
    ],
    doctor: [
      '济世救人，悬壶天下。孩子，你生在药香之中。',
      '爹用了一辈子药方，今天最对症的，是你的降生。',
    ],
    orphan: [
      '"这孩子被丢在门口，冻得直哆嗦……唉，天寒地冻的。"',
      '"可怜的娃，罢了，留下吧。"',
    ],
    official: [
      '官场沉浮，如履薄冰。孩子，你生来便带着这世间的风雨。',
      '为父不指望你继承官位，只愿你平安一生。',
    ],
    pirate: [
      '老子当年纵横东海，如今洗了手……就靠你了。',
      '孩子，海寇也罢，渔民也罢，记住——命是自己的。',
    ],
    performer: [
      '唱了一辈子的戏，没想到自己当爹这出，比什么都精彩。',
      '孩子，以后戏台上爹给你配最好的行头。',
    ],
    hunter: [
      '打了半辈子猎，这回猎到个娃娃，哈哈！',
      '孩子，山里的风雪养人，你将来一定有出息。',
    ],
    beggar: [
      '咱丐帮虽然穷，可规矩不能丢。这孩子，是咱帮的希望。',
      '孩子，记住咱帮的规矩——忠义二字不能忘。',
    ],
    monk: [
      '阿弥陀佛，缘起缘灭，一切皆有定数。这孩子与佛有缘。',
      '贫僧虽不能给你世间荣华，但能给你一颗安宁的心。',
    ],
    boatman: [
      '在洞庭湖上漂了一辈子，没想到漂来了个小家伙。',
      '孩子，记住，风浪再大，船不能翻。',
    ],
    fisherman: [
      '大海给了咱家一口饭吃，如今又送来一个娃，老天有眼啊。',
      '孩子，等你长大了，爹教你出海打鱼，那才是男人的活法。',
    ],
    musician: [
      '孩子，爹这辈子只会弹琴，但爹希望你的未来，比琴声更动听。',
      '这孩子的哭声……怎么听着像宫调？天生学琴的料！',
    ],
  };
  const pool = lines[bg.id] || lines.farmer;
  return pool[0];
}

/** 母亲的初始对话 */
function _birthMotherDialogue(bg, gender) {
  const lines = {
    blacksmith: [
      '孩子他爹，别光顾着乐了，快去烧水！',
      '小手小脚的，跟个瓷娃娃似的……',
    ],
    scholar: [
      '书香门第又添一丁，往后读书有人陪了。',
      '愿孩子一生平安顺遂。',
    ],
    martial: [
      '看这孩子握拳的力气，像极了你年轻的时候。',
      '习武也好，行走江湖也罢，平安就好。',
    ],
    merchant: [
      '孩子他爹，你别搁那儿感怀了，快来给孩子取名呀。',
      '长得真俊，以后肯定招人喜欢。',
    ],
    farmer: [
      '娃儿长得真壮实，以后肯定是个好劳力……不对，是能干大事的人。',
      '咱家祖坟冒青烟了！',
    ],
    doctor: [
      '接生大夫都说母子平安，真是谢天谢地。',
      '身上有一股淡淡的药香味，是个有福气的孩子。',
    ],
    orphan: [
      '"这孩子……看着怪让人心疼的。"',
      '"先喂口米汤吧，别饿坏了。"',
    ],
    official: [
      '老爷，孩子哭了，快来看。',
      '这孩子命硬，以后一定有出息。',
    ],
    pirate: [
      '当家的，你那海上的脾性收一收，别吓着孩子。',
      '长得像你，一股子不服输的劲儿。',
    ],
    performer: [
      '这孩子的嗓子真亮！将来一定是个好角儿。',
      '班主，给咱孩子取个响亮的艺名吧。',
    ],
    hunter: [
      '山里的日子苦了点，但咱的孩子不比别人差。',
      '长得虎头虎脑的，一看就是个结实娃。',
    ],
    beggar: [
      '孩子，咱虽然穷，但活得有骨气。',
      '别怕，娘在这呢，谁也不能欺负你。',
    ],
    monk: [
      '阿弥陀佛，这孩子命里有佛缘。',
      '师父，这孩子就托付给您了。',
    ],
    boatman: [
      '在船上生孩子可真是折腾人……',
      '但愿这孩子以后一生顺风顺水。',
    ],
    fisherman: [
      '孩子，以后你爹带你出海，你就知道了，大海有多美。',
      '海风咸了点，但吹着舒服。',
    ],
    musician: [
      '孩子他爹，快弹一曲给孩子听嘛。',
      '这孩子在娘肚子里就听着琴声，出来肯定有灵性。',
    ],
  };
  const pool = lines[bg.id] || lines.farmer;
  return pool[0];
}

/** 父亲随机取名的评论 */
function _birthFatherPickComment(fullName, gender) {
  const comments = gender === 'female'
    ? ['清雅脱俗，不愧是我家的闺女。', '如花似玉，日后定是美人。', '好名字！温婉大气。']
    : ['响亮！掷地有声，好名字！', '浩气长存，这名字配得上我儿。', '妙哉！日后必定名扬天下。'];
  return comments[Math.floor(Math.random() * comments.length)];
}

/** 确认名字后父亲的评论 */
function _birthNameComment(fullName, bg) {
  const comments = {
    blacksmith: '像一把刚出炉的好剑，锋芒毕露！',
    scholar: '日后定能青史留名！',
    martial: '这名字一听就是个侠客！',
    merchant: '走遍天下也不怕被人忘了！',
    farmer: '朴实中透着不凡，好！',
    doctor: '悬壶济世，医者仁心。',
    orphan: '好名字，以后跟着我姓吧。',
    official: '大气！不愧是我的孩子。',
    pirate: '像海上的风暴一样，响亮！',
    performer: '这名字，配得上最好的戏台！',
    hunter: '山里的孩子，就得有个山里人的名字！',
    beggar: '名字响亮，以后一定能出人头地！',
    monk: '阿弥陀佛，好名字，自带佛缘。',
    boatman: '像湖上的风一样自由，好！',
    fisherman: '像大海一样宽广，不错！',
    musician: '这名字，读起来就像一首曲子。',
  };
  return comments[bg.id] || '好名字！';
}

/** 生成取名建议标签 */
function _generateSuggestions(surname, gender) {
  const pool = GIVEN_NAME_POOL[gender];
  // 随机选4个不重复的建议
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, 4);
  return picks.map(name => `
    <button data-suggest="${name}" style="
      background:rgba(240,192,96,.06);border:1px solid rgba(240,192,96,.15);
      border-radius:12px;padding:5px 12px;color:#c0a070;font-size:12px;
      cursor:pointer;transition:all 0.2s ease;letter-spacing:1px"
      onmouseover="this.style.borderColor='rgba(240,192,96,.4)';this.style.color='#ffd060'"
      onmouseout="this.style.borderColor='rgba(240,192,96,.15)';this.style.color='#c0a070'">
      ${surname}${name}
    </button>
  `).join('');
}

/**
 * 第一步：生成出身背景（不含名字）
 */
function generateBackground() {
  const background = FAMILY_BACKGROUNDS[Math.floor(Math.random() * FAMILY_BACKGROUNDS.length)];
  const surname = background.familySurnames[Math.floor(Math.random() * background.familySurnames.length)];
  const isFemale = Math.random() > 0.5;
  const gender = isFemale ? 'female' : 'male';

  birthPrelim = { background, surname, gender };
  return birthPrelim;
}

/**
 * 用名字补完出身数据
 */
function finalizeOrigin(fullName, surname, givenName) {
  const data = birthPrelim;
  if (!data) return;

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"式事件链生成：命运无常，像麻将凑牌
  // ═══════════════════════════════════════════════════════════════
  eventChain = [];
  const baseAges = ['age_1', 'age_3', 'age_4', 'age_5', 'age_7', 'age_8', 'age_10', 'age_12', 'age_14', 'age_15', 'age_17', 'age_18'];
  
  // ── 1. 气运影响：运气好的玩家更容易触发奇遇 ──
  const playerLuk = (data.background.baseStats?.luk || 0);
  const fateBonus = playerLuk * 0.02; // 每点运气+2%奇遇概率
  
  // ── 2. 随机决定年龄段处理 ──
  const processedAges = [];
  let skipCount = 0;
  let repeatCount = 0;
  let wonderCount = 0;
  
  for (let i = 0; i < baseAges.length; i++) {
    const age = baseAges[i];
    const ageNum = parseInt(age.replace('age_', ''));
    
    // 随机决定这一年发生什么：
    // - 80% 正常经历一个事件
    // - 10% 跳过（这一年平平淡淡）
    // - 8% 重复（这一年发生两件大事）
    // - 2% + fateBonus 奇遇（特殊事件替代）
    const roll = Math.random();
    
    if (roll < 0.10) {
      // 跳过：这一年无事发生
      skipCount++;
      eventChain.push({ 
        age: ageNum, 
        event: '平淡岁月',
        description: '这一年平平淡淡，没有什么特别的事情发生。日子就像溪水一样静静流淌。',
        effects: {},
        appearance: null,
        mood: 'calm',
        isSkipped: true
      });
    } else if (roll < 0.18) {
      // 重复：这一年发生两件大事
      repeatCount++;
      const events = RANDOM_EVENTS[age];
      if (events && events.length >= 2) {
        // 选两个不同的事件
        const idx1 = Math.floor(Math.random() * events.length);
        let idx2 = Math.floor(Math.random() * (events.length - 1));
        if (idx2 >= idx1) idx2++;
        const ev1 = events[idx1];
        const ev2 = events[idx2];
        
        eventChain.push({
          age: ageNum,
          event: ev1.event + ' + ' + ev2.event,
          description: `这一年格外精彩。先是${ev1.event}，${ev1.description}紧接着又发生了${ev2.event}，${ev2.description}`,
          effects: _mergeEffects(ev1.effects, ev2.effects),
          appearance: ev1.appearance || ev2.appearance,
          mood: ev1.mood || ev2.mood,
          isDouble: true
        });
      } else {
        // 事件不够，只选一个
        const event = events[Math.floor(Math.random() * events.length)];
        eventChain.push({ age: ageNum, ...event });
      }
    } else if (roll < 0.20 + fateBonus) {
      // 奇遇：特殊事件
      wonderCount++;
      const wonder = _getWonderEvent(ageNum, data.background);
      eventChain.push({ age: ageNum, ...wonder, isWonder: true });
    } else {
      // 正常：随机选一个事件
      const events = RANDOM_EVENTS[age];
      if (!events || events.length === 0) continue;
      const event = events[Math.floor(Math.random() * events.length)];
      eventChain.push({ age: ageNum, ...event });
    }
    
    processedAges.push(age);
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"夭折判定：生死无常（年龄越小越危险）
    // ═══════════════════════════════════════════════════════════════
    // 计算当前夭折概率：基础高，随年龄递减
    const deathChance = Math.max(
      DEATH_CHANCE.minChance,
      DEATH_CHANCE.base - (i * DEATH_CHANCE.ageDecay) - (playerLuk * DEATH_CHANCE.lukProtect)
    );
    
    if (Math.random() < deathChance && ageNum < 18) {
      // 夭折了！选择一个合适的夭折事件
      const validDeaths = TRAGIC_DEATH_EVENTS.filter(d => ageNum <= d.maxAge);
      if (validDeaths.length > 0) {
        const death = validDeaths[Math.floor(Math.random() * validDeaths.length)];
        eventChain.push({
          age: ageNum,
          ...death,
          isDeath: true,
          deathChance: deathChance, // 记录概率供显示
        });
        console.log(`[将将胡] ⚠️ 夭折于${ageNum}岁：${death.event}（概率${(deathChance*100).toFixed(1)}%）`);
        // 解锁夭折成就
        unlockDeathAchievement(death);
        break; // 事件链结束
      }
    }
  }
  
  // 记录"将将胡"统计
  const died = eventChain.some(e => e.isDeath);
  console.log(`[将将胡] 出身生成统计：跳过${skipCount}年，双事件${repeatCount}年，奇遇${wonderCount}次${died ? '，⚠️ 夭折' : ''}`);

  // 计算总属性
  const totalStats = { str: 0, agi: 0, con: 0, int: 0, cha: 0, luk: 0 };
  for (const [key, val] of Object.entries(data.background.baseStats)) {
    totalStats[key] = (totalStats[key] || 0) + val;
  }
  for (const event of eventChain) {
    if (event.effects) {
      for (const [key, val] of Object.entries(event.effects)) {
        if (['str', 'agi', 'con', 'int', 'cha', 'luk'].includes(key)) {
          totalStats[key] = (totalStats[key] || 0) + val;
        }
      }
    }
  }

  // 收集外貌特征和物品
  const appearances = [];
  const items = [];
  for (const event of eventChain) {
    if (event.appearance) appearances.push(event.appearance);
    if (event.item) items.push(event.item);
  }

  originData = {
    background: data.background,
    surname,
    givenName,
    fullName,
    gender: data.gender,
    hometown: data.background.hometown,
    eventChain,
    totalStats,
    appearances,
    items,
    createdAt: new Date().toISOString(),
  };

  return originData;
}

function saveOriginData() {
  if (!originData) return;
  localStorage.setItem(ORIGIN_KEY, JSON.stringify(originData));
}

function loadOriginData() {
  const raw = localStorage.getItem(ORIGIN_KEY);
  if (raw) {
    try { return (originData = JSON.parse(raw)); }
    catch (e) { return null; }
  }
  return null;
}

// ════════════════════════════════════════════════════════════════
//  出身动画音频系统  v100  BGM + SFX
//  纯 Web Audio API 合成，无需外部音频文件
// ════════════════════════════════════════════════════════════════

// ── AudioContext 共享 ──
let _originACtx = null;
let _originACtxReady = false;

function _originGetACtx() {
  if (!_originACtx) {
    _originACtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_originACtx.state === 'suspended') {
    const p = _originACtx.resume();
    if (p && p.then) p.then(() => { _originACtxReady = true; });
  } else {
    _originACtxReady = true;
  }
  return _originACtx;
}

/** 在用户交互上下文中预热 AudioContext（必须从 click/touch handler 调用） */
function originAudioPreheat() {
  try {
    const ctx = _originGetACtx();
    if (ctx.state === 'suspended') ctx.resume();
    // 播放一个极短的静音音符来"激活"音频上下文
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.01, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
    _originACtxReady = true;
  } catch (e) {}
}

function cleanupOriginAudio() {
  try {
    if (typeof originBgmStop === 'function') originBgmStop(true);
    if (_originACtx && _originACtx.state !== 'closed') {
      _originACtx.close();
    }
  } catch (e) {}
  _originACtx = null;
  _originACtxReady = false;
}
window.cleanupOriginAudio = cleanupOriginAudio;
window.addEventListener('pagehide', cleanupOriginAudio);
window.addEventListener('beforeunload', cleanupOriginAudio);

// ── 五声音阶频率表（D宫调，江湖风） ──

const _O_BGM_NOTES = [
  73.42,   // D2
  82.41,   // E2
  92.50,   // F#2
  110.00,  // A2
  123.47,  // B2
  146.83,  // D3
  164.81,  // E3
  185.00,  // F#3
  220.00,  // A3
  246.94,  // B3
  293.66,  // D4  宫
  329.63,  // E4  商
  369.99,  // F#4 角
  440.00,  // A4  徵
  493.88,  // B4  羽
  587.33,  // D5  高宫
  659.25,  // E5  高商
  739.99,  // F#5 高角
  880.00,  // A5  高徵
  987.77,  // B5  高羽
];

// ── BGM 主题定义 ──

// 主题1：Logo开场 — 大气、庄重、武侠感
const _O_BGM_LOGO_MELODY = [
  [10,1.0], [12,0.8], [14,1.2], [12,0.6], [10,0.8], [11,0.6], [9,0.8],
  [8,1.0], [10,0.6], [12,1.2], [14,0.8], [15,1.4], [14,0.6], [12,0.8],
  [10,0.8], [9,0.6], [8,0.8], [6,0.6], [8,1.0], [10,0.8], [9,0.6], [7,0.8],
  [6,1.0], [7,0.6], [8,0.8], [10,1.2], [12,0.8], [14,0.6], [15,1.6],
];
const _O_BGM_LOGO_BASS = [
  [5, 2.8], [8, 2.8], [10, 2.8], [5, 2.8],
  [7, 2.8], [10, 2.8], [8, 2.8], [5, 2.8],
  [10, 2.8], [8, 2.8], [7, 2.8], [5, 2.8],
];

// 主题2：出生场景 — 温暖摇篮曲（慢速、低音区、柔和）
const _O_BGM_BIRTH_MELODY = [
  [8,1.2], [9,0.8], [10,1.4], [9,0.8], [8,1.0], [6,0.6], [5,1.0],
  [6,1.2], [8,0.8], [9,1.4], [8,0.6], [6,1.0], [5,0.8], [6,1.6],
  [8,1.0], [10,0.8], [12,1.2], [10,0.8], [8,1.0], [6,0.6], [5,1.0],
  [6,0.8], [8,1.2], [6,0.6], [5,0.8], [6,1.6],
];
const _O_BGM_BIRTH_BASS = [
  [2, 3.2], [5, 3.2], [4, 3.2], [2, 3.2],
  [0, 3.2], [2, 3.2], [5, 3.2], [2, 3.2],
];

// 主题3：出身介绍 — 沉思叙事风（中速、中音区）
const _O_BGM_INTRO_MELODY = [
  [8,1.0], [10,0.8], [12,1.0], [10,0.6], [8,0.8], [7,0.6], [8,1.0],
  [6,0.8], [8,1.2], [10,0.8], [12,1.0], [10,0.6], [8,1.0], [6,0.8],
  [7,1.0], [8,0.6], [10,1.2], [8,0.8], [6,1.0], [5,0.6], [6,1.0],
  [8,0.8], [10,1.0], [12,1.4], [10,0.8], [8,1.6],
];
const _O_BGM_INTRO_BASS = [
  [2, 3.0], [4, 3.0], [5, 3.0], [2, 3.0],
  [0, 3.0], [2, 3.0], [4, 3.0], [2, 3.0],
];

// 主题4a：事件链 - 平静/童年（明亮、欢快）
const _O_BGM_EVENT_CALM_MELODY = [
  [8,0.6], [10,0.5], [12,0.8], [10,0.4], [8,0.6], [10,0.5], [12,0.8], [14,1.0],
  [12,0.6], [10,0.5], [8,0.8], [6,0.5], [8,0.6], [10,0.8], [12,1.0],
  [10,0.6], [12,0.5], [14,0.8], [12,0.4], [10,0.6], [8,0.5], [10,0.8], [12,1.0],
  [8,0.6], [10,0.5], [12,0.8], [10,0.4], [8,1.2],
];
const _O_BGM_EVENT_CALM_BASS = [
  [2, 2.4], [5, 2.4], [4, 2.4], [2, 2.4],
  [0, 2.4], [2, 2.4], [5, 2.4], [2, 2.4],
];

// 主题4b：事件链 - 神秘/冒险（偏暗、缓慢）
const _O_BGM_EVENT_MYST_MELODY = [
  [6,1.0], [5,0.8], [6,1.2], [8,0.6], [7,0.8], [6,0.6], [5,1.0],
  [4,0.8], [5,1.0], [6,1.4], [5,0.6], [4,0.8], [3,0.6], [5,1.2],
  [6,1.0], [7,0.8], [6,1.2], [5,0.6], [4,1.0], [3,0.8], [5,1.6],
];
const _O_BGM_EVENT_MYST_BASS = [
  [0, 3.0], [2, 3.0], [3, 3.0], [0, 3.0],
  [4, 3.0], [2, 3.0], [0, 3.0], [2, 3.0],
];

// 主题5：完成总结 — 壮丽、成就感（上行、明亮）
const _O_BGM_COMPLETE_MELODY = [
  [8,0.8], [10,0.6], [12,1.0], [14,0.8], [15,1.2], [14,0.6], [12,0.8],
  [10,0.8], [12,1.0], [14,1.2], [15,0.8], [17,1.4], [15,0.6], [14,0.8],
  [12,0.8], [14,1.0], [15,1.2], [14,0.8], [12,0.6], [10,1.0], [12,1.6],
  [10,0.8], [12,0.6], [14,1.0], [15,0.8], [14,1.2], [12,1.6],
];
const _O_BGM_COMPLETE_BASS = [
  [5, 2.6], [8, 2.6], [10, 2.6], [5, 2.6],
  [7, 2.6], [10, 2.6], [8, 2.6], [5, 2.6],
];

// ── BGM 播放状态 ──
let _oBgmTimer     = null;
let _oBgmTimerBass = null;
let _oBgmVolume    = 0.06;
let _oBgmMasterGain = null;
let _oBgmMelodyIdx  = 0;
let _oBgmBassIdx    = 0;
let _oBgmCurrentTheme = null; // 'logo'|'birth'|'intro'|'calm'|'myst'|'complete'

/** 获取当前主题的旋律/低音数据 */
function _oBgmGetThemeData(theme) {
  const map = {
    logo:     { mel: _O_BGM_LOGO_MELODY,     bas: _O_BGM_LOGO_BASS,     speed: 0.50, vol: 0.22 },
    birth:    { mel: _O_BGM_BIRTH_MELODY,    bas: _O_BGM_BIRTH_BASS,    speed: 0.70, vol: 0.16 },
    intro:    { mel: _O_BGM_INTRO_MELODY,    bas: _O_BGM_INTRO_BASS,    speed: 0.55, vol: 0.18 },
    calm:     { mel: _O_BGM_EVENT_CALM_MELODY, bas: _O_BGM_EVENT_CALM_BASS, speed: 0.45, vol: 0.16 },
    myst:     { mel: _O_BGM_EVENT_MYST_MELODY, bas: _O_BGM_EVENT_MYST_BASS, speed: 0.60, vol: 0.15 },
    complete: { mel: _O_BGM_COMPLETE_MELODY, bas: _O_BGM_COMPLETE_BASS, speed: 0.45, vol: 0.22 },
  };
  return map[theme] || map.intro;
}

/** 播放一个古琴风格音符 */
function _oBgmNote(freq, dur, vol, delay) {
  delay = delay || 0;
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime + delay;
    const master = _oBgmMasterGain || ctx.destination;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    // 颤音（古琴拨弦感）
    const vib = ctx.createOscillator();
    const vibG = ctx.createGain();
    vib.frequency.setValueAtTime(5.5, t);
    vibG.gain.setValueAtTime(2.0, t);
    vib.connect(vibG);
    vibG.connect(osc.frequency);
    vib.start(t);
    vib.stop(t + dur + .1);

    // 包络：快起慢落
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(vol, t + Math.min(.035, dur * .08));
    env.gain.setValueAtTime(vol * .85, t + dur * .25);
    env.gain.exponentialRampToValueAtTime(vol * .4, t + dur * .7);
    env.gain.exponentialRampToValueAtTime(.001, t + dur);

    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + dur + .05);

    // 泛音共鸣
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);
    const env2 = ctx.createGain();
    env2.gain.setValueAtTime(0, t);
    env2.gain.linearRampToValueAtTime(vol * .12, t + .02);
    env2.gain.exponentialRampToValueAtTime(.001, t + dur * .5);
    osc2.connect(env2);
    env2.connect(master);
    osc2.start(t);
    osc2.stop(t + dur * .5 + .05);
  } catch (e) {}
}

/** 低音伴奏音符 */
function _oBgmBassNote(freq, dur, vol, delay) {
  delay = delay || 0;
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime + delay;
    const master = _oBgmMasterGain || ctx.destination;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(vol, t + .1);
    env.gain.setValueAtTime(vol * .9, t + dur * .4);
    env.gain.exponentialRampToValueAtTime(.001, t + dur);

    osc.connect(env);
    env.connect(master);
    osc.start(t);
    osc.stop(t + dur + .05);
  } catch (e) {}
}

/** 切换并启动BGM（无缝切换） */
function originBgmPlay(theme) {
  try {
    // 确保 AudioContext 已就绪
    _originGetACtx();
    if (!_originACtxReady && _originACtx && _originACtx.state === 'suspended') {
      _originACtx.resume().then(() => { _originACtxReady = true; originBgmPlay(theme); });
      return;
    }

    const data = _oBgmGetThemeData(theme);
    if (!data) return;

    // 如果正在播放同一主题，不重复启动
    if (_oBgmCurrentTheme === theme && _oBgmTimer) return;

    // 停止当前BGM
    originBgmStop(true);

    _oBgmCurrentTheme = theme;
    _oBgmVolume = data.vol;

    const ctx = _originGetACtx();
    _oBgmMasterGain = ctx.createGain();
    // masterGain 只做淡入/淡出控制，值为1.0，让音符自己控制音量
    _oBgmMasterGain.gain.setValueAtTime(0, ctx.currentTime);
    _oBgmMasterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + .6);
    _oBgmMasterGain.connect(ctx.destination);

    const NOTE_DUR = data.speed;
    const mel = data.mel;
    const bas = data.bas;
    const melTotal = mel.reduce((s, n) => s + n[1], 0) * NOTE_DUR;
    const basTotal = bas.reduce((s, n) => s + n[1], 0) * NOTE_DUR;

    _oBgmMelodyIdx = 0;
    _oBgmBassIdx = 0;

    function scheduleMel() {
      if (!_oBgmMasterGain) return;
      const note = mel[_oBgmMelodyIdx];
      const freq = _O_BGM_NOTES[note[0]];
      const dur = note[1] * NOTE_DUR;
      _oBgmNote(freq, dur, _oBgmVolume * 1.3);
      _oBgmMelodyIdx = (_oBgmMelodyIdx + 1) % mel.length;
    }

    scheduleMel();
    _oBgmTimer = setInterval(scheduleMel, melTotal / mel.length * 1000);

    function scheduleBas() {
      if (!_oBgmMasterGain) return;
      const note = bas[_oBgmBassIdx];
      const freq = _O_BGM_NOTES[note[0]];
      const dur = note[1] * NOTE_DUR;
      _oBgmBassNote(freq, dur, _oBgmVolume * .45);
      _oBgmBassIdx = (_oBgmBassIdx + 1) % bas.length;
    }

    scheduleBas();
    _oBgmTimerBass = setInterval(scheduleBas, basTotal / bas.length * 1000);
  } catch (e) {}
}

/** 停止BGM（支持立即或淡出） */
function originBgmStop(instant) {
  try {
    if (_oBgmMasterGain && !instant) {
      const ctx = _originGetACtx();
      _oBgmMasterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + .7);
    }
    const delay = instant ? 0 : 800;
    setTimeout(() => {
      if (_oBgmTimer)     { clearInterval(_oBgmTimer);     _oBgmTimer = null; }
      if (_oBgmTimerBass) { clearInterval(_oBgmTimerBass); _oBgmTimerBass = null; }
      _oBgmMasterGain = null;
    }, delay);
    if (instant) {
      if (_oBgmTimer)     { clearInterval(_oBgmTimer);     _oBgmTimer = null; }
      if (_oBgmTimerBass) { clearInterval(_oBgmTimerBass); _oBgmTimerBass = null; }
      _oBgmMasterGain = null;
    }
    _oBgmCurrentTheme = null;
  } catch (e) {}
}

/** 根据mood决定事件链BGM主题 */
function originBgmEventTheme(mood) {
  if (mood === 'mysterious' || mood === 'sad' || mood === 'dark') return 'myst';
  return 'calm';
}

// ── 音效系统 (SFX) ──

/** 通用音符播放 */
function _oSfxTone(freq, dur, vol, type, delay) {
  delay = delay || 0;
  type = type || 'sine';
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(vol, t + .01);
    env.gain.exponentialRampToValueAtTime(.001, t + dur);
    osc.connect(env);
    env.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + .02);
  } catch (e) {}
}

/** SFX：场景转场（柔和下行扫频） */
function originSfxTransition() {
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + .4);
    const env = ctx.createGain();
    env.gain.setValueAtTime(.18, t);
    env.gain.exponentialRampToValueAtTime(.001, t + .5);
    osc.connect(env);
    env.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + .55);
    // 叠加一个和声
    _oSfxTone(600, .4, .10, 'sine', .05);
    _oSfxTone(400, .45, .08, 'sine', .1);
  } catch (e) {}
}

/** SFX：淡入音（上行轻柔叮咚） */
function originSfxFadeIn() {
  _oSfxTone(440, .15, .12, 'sine');
  _oSfxTone(554, .15, .10, 'sine', .08);
  _oSfxTone(659, .2, .08, 'sine', .16);
}

/** SFX：淡出音（下行轻柔） */
function originSfxFadeOut() {
  _oSfxTone(659, .15, .10, 'sine');
  _oSfxTone(554, .15, .08, 'sine', .08);
  _oSfxTone(440, .2, .06, 'sine', .16);
}

/** SFX：打字机声（极轻微的"嘀"声） */
function originSfxTypewriter() {
  _oSfxTone(1200 + Math.random() * 400, .04, .05, 'square');
}

/** SFX：属性揭示（上行琶音） */
function originSfxStatReveal() {
  const notes = [293.66, 369.99, 440, 587.33];
  notes.forEach((f, i) => _oSfxTone(f, .25, .12, 'sine', i * .08));
}

/** SFX：赐名/重要时刻（钟声回响） */
function originSfxNaming() {
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime;
    // 主钟声
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    const env = ctx.createGain();
    env.gain.setValueAtTime(.22, t);
    env.gain.exponentialRampToValueAtTime(.001, t + 1.5);
    osc.connect(env);
    env.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.6);
    // 泛音
    _oSfxTone(1046.5, 1.0, .08, 'sine', .01);
    _oSfxTone(783.99, .8, .05, 'sine', .02);
    // 回声
    setTimeout(() => {
      _oSfxTone(523.25, .8, .08, 'sine');
      _oSfxTone(1046.5, .5, .04, 'sine', .02);
    }, 300);
  } catch (e) {}
}

/** SFX：年龄段切换（竹笛/箫吹奏感） */
function originSfxAgeChange() {
  _oSfxTone(587.33, .3, .12, 'sine');
  _oSfxTone(659.25, .25, .10, 'sine', .12);
  _oSfxTone(587.33, .4, .08, 'sine', .24);
}

/** SFX：完成（华丽的上升和弦） */
function originSfxComplete() {
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime;
    const chords = [
      [293.66, 369.99, 440.00],   // Dm
      [440.00, 554.37, 659.25],   // Am (高八度思路)
      [587.33, 739.99, 880.00],   // Dm 高
    ];
    chords.forEach((chord, ci) => {
      chord.forEach(f => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + ci * .35);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t + ci * .35);
        env.gain.linearRampToValueAtTime(.10, t + ci * .35 + .05);
        env.gain.exponentialRampToValueAtTime(.001, t + ci * .35 + 1.2);
        osc.connect(env);
        env.connect(ctx.destination);
        osc.start(t + ci * .35);
        osc.stop(t + ci * .35 + 1.3);
      });
    });
  } catch (e) {}
}

/** SFX：Logo出现（庄严低音钟） */
function originSfxLogoAppear() {
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime;
    [130.81, 164.81, 196.00].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * .15);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t + i * .15);
      env.gain.linearRampToValueAtTime(.18, t + i * .15 + .05);
      env.gain.exponentialRampToValueAtTime(.001, t + i * .15 + 1.0);
      osc.connect(env);
      env.connect(ctx.destination);
      osc.start(t + i * .15);
      osc.stop(t + i * .15 + 1.1);
    });
  } catch (e) {}
}

/** SFX：出生啼哭（模拟婴儿哭声的下行滑音） */
function originSfxBirthCry() {
  try {
    const ctx = _originGetACtx();
    const t = ctx.currentTime;
    // 三声短促下滑
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600 + i * 50, t + i * .35);
      osc.frequency.exponentialRampToValueAtTime(350, t + i * .35 + .25);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t + i * .35);
      env.gain.linearRampToValueAtTime(.08, t + i * .35 + .02);
      env.gain.setValueAtTime(.06, t + i * .35 + .12);
      env.gain.exponentialRampToValueAtTime(.001, t + i * .35 + .28);
      // 低通滤波柔化锯齿波
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, t + i * .35);
      osc.connect(filter);
      filter.connect(env);
      env.connect(ctx.destination);
      osc.start(t + i * .35);
      osc.stop(t + i * .35 + .3);
    }
  } catch (e) {}
}

/** SFX：心跳声 */
function originSfxHeartbeat() {
  const ctx = _originGetACtx();
  // 低频双击
  _oSfxTone(60, .12, .18, 'sine');
  _oSfxTone(55, .1, .14, 'sine', .15);
}


// ════════════════════════════════════════════════════════════════
//  动画系统（UI流程）
// ════════════════════════════════════════════════════════════════

/**
 * 第一步：游戏Logo动画（江湖将将胡 字符画LOGO）
 */
function showStudioAnimation() {
  stopSceneAnimations();

  const overlay = document.createElement('div');
  overlay.id = 'studioOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:#000;z-index:10000;
    display:flex;align-items:center;justify-content:center;
    flex-direction:column;
  `;

  overlay.innerHTML = `
    <div id="studioContent" style="opacity:0;text-align:center;transition:opacity 1.5s ease">
      <div id="studioLogo" style="font-family:'Courier New',monospace;font-size:clamp(3px,1.8vw,10px);color:#f0c060;
        white-space:pre;line-height:1.3;margin-bottom:30px;letter-spacing:1px;
        max-width:100vw;overflow-x:auto">
${GAME_INFO.logo.join('\n')}
      </div>
      <div id="studioName" style="font-size:14px;color:rgba(240,192,96,.35);letter-spacing:3px;
        opacity:0;transition:opacity 1s ease 0.5s">
        ${STUDIO_INFO.name}
      </div>
      <div id="studioSub" style="font-size:9px;color:rgba(240,192,96,.2);letter-spacing:2px;
        opacity:0;transition:opacity 1s ease 1s;margin-top:6px">
        ${STUDIO_INFO.subtitle}
      </div>
    </div>
    <div id="studioSkip" style="position:absolute;bottom:30px;font-size:10px;
      color:rgba(150,120,60,.3);opacity:0;transition:opacity 0.5s ease">
      点击任意处继续
    </div>
  `;

  document.body.appendChild(overlay);

  setTimeout(() => { document.getElementById('studioContent').style.opacity = '1'; }, 300);
  // Logo出现 BGM
  setTimeout(() => {
    if(typeof originBgmPlay==='function') originBgmPlay('logo');
  }, 400);
  setTimeout(() => {
    document.getElementById('studioName').style.opacity = '1';
    document.getElementById('studioSub').style.opacity = '1';
    document.getElementById('studioSkip').style.opacity = '1';
  }, 800);

  const goNext = () => {
    if (!document.getElementById('studioOverlay')) return;
    if(typeof originSfxFadeOut==='function') originSfxFadeOut();
    fadeOutAndRemove(overlay, 800, () => { showBirthScene(); });
  };

  overlay.addEventListener('click', goNext);
  setTimeout(goNext, 5000);
}

/**
 * 第二步：出身介绍界面（自动播放，无需点击）
 */
function showOriginIntro() {
  stopSceneAnimations();
  const data = originData;
  if (!data) return;

  const overlay = document.createElement('div');
  overlay.id = 'originOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:linear-gradient(180deg, #000 0%, #0a0510 50%, #0f0a1a 100%);
    z-index:9999;display:flex;align-items:center;justify-content:center;
  `;

  const genderText = data.gender === 'female' ? '女' : '男';
  const portraitArt = generatePortraitArt(data);

  overlay.innerHTML = `
    <div id="originContent" style="max-width:480px;padding:30px;text-align:center;
      opacity:0;transition:opacity 1.2s ease">

      <div style="font-size:11px;color:rgba(240,192,96,.4);letter-spacing:4px;margin-bottom:20px">
        · 你的故事 ·
      </div>

      <div id="originPortrait" style="font-size:10px;line-height:1.2;color:#e8d5a3;
        white-space:pre;margin:0 auto 20px;display:inline-block;
        opacity:0;transition:opacity 1s ease 0.3s">
${portraitArt}
      </div>

      <div id="originInfo" style="opacity:0;transition:opacity 0.8s ease 0.8s">
        <div style="font-size:22px;color:#ffd060;letter-spacing:3px;margin-bottom:6px">
          ${data.fullName}
        </div>
        <div style="font-size:11px;color:rgba(200,170,80,.6);margin-bottom:16px">
          ${genderText} · ${data.hometown} · ${data.background.name}
        </div>

        <div style="background:rgba(240,192,96,.05);border:1px solid rgba(240,192,96,.15);
          border-radius:8px;padding:16px;margin-bottom:16px;text-align:left">
          <div style="font-size:10px;color:rgba(240,192,96,.5);letter-spacing:2px;margin-bottom:8px">
            · 出身背景 ·
          </div>
          <div style="font-size:12px;color:#d0b090;line-height:2">
            ${data.background.description}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:20px">
          ${formatStatDisplay(data.totalStats)}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  setTimeout(() => { document.getElementById('originContent').style.opacity = '1'; }, 200);
  // 淡入音效 + 介绍BGM
  setTimeout(() => {
    if(typeof originSfxFadeIn==='function') originSfxFadeIn();
    if(typeof originBgmPlay==='function') originBgmPlay('intro');
  }, 300);
  setTimeout(() => { document.getElementById('originPortrait').style.opacity = '1'; }, 500);
  setTimeout(() => {
    document.getElementById('originInfo').style.opacity = '1';
  }, 1000);

  // 5秒后自动进入事件链
  setTimeout(() => {
    if(typeof originSfxTransition==='function') originSfxTransition();
    fadeOutAndRemove(overlay, 800, () => {
      ensureOriginBackdrop();
      currentEventIndex = 0;
      showNextEvent();
    });
  }, 5000);
}

/**
 * 持久黑幕
 */
function ensureOriginBackdrop() {
  if (document.getElementById('originBackdrop')) return;
  const backdrop = document.createElement('div');
  backdrop.id = 'originBackdrop';
  backdrop.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:#000;z-index:9998;pointer-events:none;
  `;
  document.body.appendChild(backdrop);
}

function removeOriginBackdrop() {
  const el = document.getElementById('originBackdrop');
  if (el) el.remove();
}

/**
 * 第三步：事件链展示 — 带字符画场景动画（自动播放，无需点击）
 */
function showNextEvent() {
  stopSceneAnimations();
  ensureOriginBackdrop();

  if (currentEventIndex >= eventChain.length) {
    showOriginComplete();
    return;
  }

  const event = eventChain[currentEventIndex];
  
  // ═══════════════════════════════════════════════════════════════
  //  夭折事件特殊处理
  // ═══════════════════════════════════════════════════════════════
  if (event.isDeath) {
    showDeathScene(event);
    return;
  }
  
  const ageNum = event.age;
  const scene = AGE_SCENE_ART[ageNum] || AGE_SCENE_ART[3];
  const moodEffect = MOOD_EFFECTS[event.mood] || {};
  const moodEmoji = getMoodEmoji(event.mood);

  // 创建场景容器
  const overlay = document.createElement('div');
  overlay.id = 'eventOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:${scene.bgColor || '#000'};z-index:9999;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    overflow:hidden;
  `;

  // mood滤镜层
  const moodOverlayHTML = moodEffect.overlay ? `
    <div id="moodOverlay" style="position:absolute;top:0;left:0;width:100%;height:100%;
      background:${moodEffect.overlay};z-index:3;pointer-events:none;opacity:0;
      transition:opacity 1.5s ease"></div>
  ` : '';

  // 粒子容器
  const particleContainerHTML = `
    <div id="ambientContainer" style="position:absolute;top:0;left:0;width:100%;height:100%;
      z-index:2;pointer-events:none;overflow:hidden"></div>
  `;

  // mood粒子容器
  const moodParticleHTML = `
    <div id="moodParticleContainer" style="position:absolute;top:0;left:0;width:100%;height:100%;
      z-index:4;pointer-events:none;overflow:hidden"></div>
  `;

  overlay.innerHTML = `
    ${particleContainerHTML}
    ${moodOverlayHTML}
    ${moodParticleHTML}

    <div id="eventContent" style="max-width:560px;width:92%;padding:16px 20px;
      text-align:center;opacity:0;z-index:5;position:relative">

      <!-- 年龄标题 -->
      <div id="ageTitle" style="margin-bottom:14px;opacity:0">
        <div style="font-size:13px;color:rgba(255,255,255,.25);letter-spacing:6px;margin-bottom:4px">
          · 第${currentEventIndex + 1}章 ·
        </div>
        <div style="font-size:42px;color:${scene.accentColor};letter-spacing:6px;
          text-shadow:0 0 30px ${scene.accentColor}44, 0 0 60px ${scene.accentColor}22">
          ${ageNum}岁
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,.15);margin-top:4px">
          ${'─'.repeat(24)}
        </div>
      </div>

      <!-- 字符画场景 -->
      <div id="sceneArtContainer" style="opacity:0;transition:opacity 1.2s ease;
        margin-bottom:14px;position:relative;overflow:hidden">
        <div id="sceneArtScale" style="transform-origin:top center">
          <pre id="sceneArt" class="origin-scene-art" style="font-family:'Courier New',monospace;font-size:11px;
            line-height:1.25;color:${scene.accentColor}cc;white-space:pre;
            text-align:center;margin:0 auto;padding:0 8px;
            text-shadow:0 0 8px ${scene.accentColor}33;
            filter:drop-shadow(0 0 2px ${scene.accentColor}22)"></pre>
          <!-- 角色 sprite 动画层 -->
          <div id="charSpriteOverlay" style="
            position:absolute;bottom:0;right:10%;
            font-family:'Courier New',monospace;font-size:11px;
            line-height:1.25;white-space:pre;color:${scene.accentColor};
            text-shadow:0 0 6px ${scene.accentColor}66;
            pointer-events:none;opacity:0;
            transition:opacity 0.8s ease">
            <pre id="charSpriteEl"></pre>
          </div>
        </div>
      </div>

      <!-- 事件标题 -->
      <div id="eventTitle" style="opacity:0;transform:translateY(8px);margin-bottom:10px">
        <span style="font-size:20px;color:#e8d5a3;letter-spacing:2px">
          ${moodEmoji} ${event.event}
        </span>
      </div>

      <!-- 事件描述（打字机效果） -->
      <div id="eventDesc" style="font-size:15px;color:#b0a090;line-height:2;
        padding:14px 18px;background:rgba(255,255,255,.02);border-radius:8px;
        border-left:3px solid ${scene.accentColor}33;
        margin-bottom:14px;min-height:60px;text-align:left;opacity:0"></div>

      <!-- 属性变化 -->
      <div id="eventEffects" style="opacity:0;margin-bottom:14px">
        ${formatEffectsText(event.effects) ? `
          <div style="font-size:14px;color:#70c070;padding:10px 18px;
            background:rgba(50,200,80,.05);border-radius:6px;border:1px solid rgba(50,200,80,.15);
            display:inline-block">
            ${formatEffectsText(event.effects)}
          </div>
        ` : ''}
      </div>

      <!-- 进度指示 -->
      <div id="eventFooter" style="opacity:0">
        <div style="font-size:13px;color:rgba(255,255,255,.2);margin-bottom:12px">
          ${'·'.repeat(currentEventIndex)}${'○'}${'·'.repeat(eventChain.length - currentEventIndex - 1)}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // ── 依次淡入各元素 ──
  const content = document.getElementById('eventContent');

  // 事件链BGM（根据mood选择主题）
  if(typeof originBgmPlay==='function') {
    originBgmPlay(originBgmEventTheme(event.mood));
  }
  // 年龄切换音效
  setTimeout(() => {
    if(typeof originSfxAgeChange==='function') originSfxAgeChange();
  }, 200);

  setTimeout(() => {
    content.style.transition = 'opacity 0.6s ease';
    content.style.opacity = '1';
  }, 100);

  // 1. 年龄标题
  setTimeout(() => {
    const ageTitle = document.getElementById('ageTitle');
    if (ageTitle) {
      ageTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      ageTitle.style.opacity = '1';
      ageTitle.style.transform = 'translateY(0)';
    }
  }, 300);

  // 2. 字符画场景
  setTimeout(() => {
    const sceneContainer = document.getElementById('sceneArtContainer');
    if (sceneContainer) {
      sceneContainer.style.opacity = '1';
      const sceneArtEl = document.getElementById('sceneArt');
      if (sceneArtEl && scene.frames) {
        startSceneFrameLoop(sceneArtEl, scene.frames, 3000);
      }
    }
  }, 600);

  // 2b. 角色 sprite 多帧动画
  setTimeout(() => {
    const overlay = document.getElementById('charSpriteOverlay');
    const el = document.getElementById('charSpriteEl');
    if (!overlay || !el) return;
    overlay.style.opacity = '1';

    var frames = getSpriteFrames(ageNum, event.mood);
    var fc = 0;
    // 拼成多行字符串
    el.textContent = frames.join('\n');

    // 快速帧循环：每隔 550ms 切换两帧
    var spriteTimer = setInterval(function() {
      if (!el || !el.isConnected) { clearInterval(spriteTimer); return; }
      fc = 1 - fc; // 在 0 和 1 之间切换
      var f = frames[fc];
      el.textContent = f ? f.join('\n') : '';
    }, 550);
    _sceneAnimTimerList.push(spriteTimer);
  }, 700);

  // 3. 启动氛围粒子
  setTimeout(() => {
    const container = document.getElementById('ambientContainer');
    if (container && scene.ambient) {
      createAmbientParticles(container, scene.ambient);
    }
  }, 800);

  // 4. mood滤镜
  setTimeout(() => {
    const moodOvl = document.getElementById('moodOverlay');
    if (moodOvl) moodOvl.style.opacity = '1';

    const moodContainer = document.getElementById('moodParticleContainer');
    if (moodContainer && moodEffect.particles) {
      createMoodParticles(moodContainer, moodEffect.particles, scene.accentColor);
    }
  }, 1000);

  // 5. 事件标题（上移淡入）
  setTimeout(() => {
    const title = document.getElementById('eventTitle');
    if (title) {
      title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }
  }, 1200);

  // 6. 事件描述（打字机效果）
  let typewriterDone = false;
  setTimeout(() => {
    const desc = document.getElementById('eventDesc');
    if (desc) {
      desc.style.opacity = '1';
      desc.style.color = '#b0a090';
      // 描述区轻微呼吸发光
      desc.style.transition = 'box-shadow 2s ease';
      desc.style.boxShadow = `0 0 15px ${scene.accentColor}08, inset 0 0 20px rgba(0,0,0,.3)`;
      const timer = typewriterEffect(desc, event.description, 30, () => {
        typewriterDone = true;
      });
      // 打字机音效（每隔几个字播放一次，避免过于密集）
      if(typeof originSfxTypewriter==='function') {
        const twSfxTimer = setInterval(() => {
          if (typewriterDone) { clearInterval(twSfxTimer); return; }
          originSfxTypewriter();
        }, 180);
      }
      // 打字机最大等待时间5秒
      setTimeout(() => { typewriterDone = true; }, 5000);
    } else {
      typewriterDone = true;
    }
  }, 1500);

  // 7. 属性变化 + 音效
  setTimeout(() => {
    const effects = document.getElementById('eventEffects');
    if (effects) {
      effects.style.transition = 'opacity 0.6s ease';
      effects.style.opacity = '1';
      if(formatEffectsText(event.effects) && typeof originSfxStatReveal==='function') {
        originSfxStatReveal();
      }
    }
  }, 2500);

  // 8. 底部进度
  setTimeout(() => {
    const footer = document.getElementById('eventFooter');
    if (footer) {
      footer.style.transition = 'opacity 0.6s ease';
      footer.style.opacity = '1';
    }
  }, 2800);

  // 自动播放：描述完成后4秒自动切换下一个事件
  setTimeout(() => {
    const checkAndAdvance = () => {
      if (typewriterDone) {
        stopSceneAnimations();
        const content = document.getElementById('eventContent');
        if (content) {
          content.style.transition = 'opacity 0.5s ease';
          content.style.opacity = '0';
        }
        setTimeout(() => {
          overlay.remove();
          currentEventIndex++;
          showNextEvent();
        }, 500);
      } else {
        setTimeout(checkAndAdvance, 300);
      }
    };
    checkAndAdvance();
  }, 7000);
}

/**
 * mood专属粒子（较少、较大、带光晕）
 */
function createMoodParticles(container, particles, accentColor) {
  const count = 5;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const char = particles[Math.floor(Math.random() * particles.length)];
    p.textContent = char;
    const startX = Math.random() * 100;
    const startY = 10 + Math.random() * 80;
    const dur = 4 + Math.random() * 4;

    p.style.cssText = `
      position:absolute;
      font-size:${14 + Math.random() * 10}px;
      left:${startX}%;
      top:${startY}%;
      opacity:0;
      pointer-events:none;
      animation: moodFloat_${i} ${dur}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      filter: drop-shadow(0 0 6px ${accentColor}66);
    `;

    // 动态创建keyframes
    const style = document.createElement('style');
    const dx = (Math.random() - 0.5) * 40;
    const dy = -10 - Math.random() * 30;
    style.textContent = `
      @keyframes moodFloat_${i} {
        0% { opacity:0; transform:translate(0,0) scale(0.5); }
        30% { opacity:0.8; }
        70% { opacity:0.6; }
        100% { opacity:0; transform:translate(${dx}px,${dy}px) scale(1.2); }
      }
    `;
    document.head.appendChild(style);
    container.appendChild(p);
  }
}

/**
 * 夭折场景展示——生命戛然而止
 */
function showDeathScene(deathEvent) {
  stopSceneAnimations();
  ensureOriginBackdrop();
  
  // 死亡场景配色：黑白灰
  const deathColor = '#666';
  const accentColor = '#444';
  
  const overlay = document.createElement('div');
  overlay.id = 'deathOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
    z-index:9999;display:flex;align-items:center;justify-content:center;
    overflow:hidden;
  `;
  
  overlay.innerHTML = `
    <div id="deathContent" style="max-width:520px;width:92%;padding:20px;
      text-align:center;opacity:0;z-index:5;position:relative">
      
      <!-- 夭折标题 -->
      <div id="deathTitle" style="margin-bottom:20px;opacity:0">
        <div style="font-size:13px;color:rgba(255,255,255,.2);letter-spacing:6px;margin-bottom:8px">
          · ${deathEvent.season} ·
        </div>
        <div style="font-size:48px;color:#666;letter-spacing:8px;
          text-shadow:0 0 40px #000, 0 0 80px #333">
          ⚰️
        </div>
        <div style="font-size:28px;color:#888;margin-top:12px;letter-spacing:4px">
          ${deathEvent.event}
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,.1);margin-top:8px">
          ${'─'.repeat(20)}
        </div>
      </div>
      
      <!-- 死亡描述 -->
      <div id="deathDesc" style="font-size:15px;color:#999;line-height:2.2;
        padding:20px 24px;background:rgba(0,0,0,.3);border-radius:8px;
        border-left:3px solid #444;border-right:3px solid #444;
        margin-bottom:24px;text-align:left;opacity:0">
      </div>
      
      <!-- 生命统计 -->
      <div id="deathStats" style="opacity:0;margin-bottom:24px">
        <div style="font-size:14px;color:#777;padding:12px 20px;
          background:rgba(255,255,255,.03);border-radius:6px;
          display:inline-block;border:1px solid rgba(255,255,255,.08)">
          <div style="margin-bottom:6px">享年 <span style="color:#aaa;font-size:18px">${deathEvent.age}</span> 岁</div>
          <div style="font-size:12px;color:#555">夭折概率 ${(deathEvent.deathChance * 100).toFixed(1)}%</div>
        </div>
      </div>
      
      <!-- 重新开始按钮 -->
      <div id="deathAction" style="opacity:0">
        <button onclick="restartOriginWithDeath()" style="
          background:rgba(200,80,80,.1);border:1px solid rgba(200,80,80,.3);
          border-radius:8px;padding:12px 32px;color:#c08080;font-size:15px;
          cursor:pointer;transition:all 0.3s ease;letter-spacing:2px"
          onmouseover="this.style.borderColor='rgba(200,80,80,.6)';this.style.color='#e0a0a0'"
          onmouseout="this.style.borderColor='rgba(200,80,80,.3)';this.style.color='#c08080'">
          🔄 转世重来
        </button>
        <div style="font-size:11px;color:#555;margin-top:12px">
          江湖路远，下辈子再见
        </div>
      </div>
    </div>
    
    <!-- 飘落的纸钱效果 -->
    <div id="paperMoneyContainer" style="position:absolute;top:0;left:0;width:100%;height:100%;
      z-index:2;pointer-events:none;overflow:hidden"></div>
  `;
  
  document.body.appendChild(overlay);
  
  // 播放哀伤BGM
  if(typeof originBgmPlay==='function') {
    originBgmPlay('myst');
  }
  
  // 淡入内容
  setTimeout(() => {
    const content = document.getElementById('deathContent');
    if(content) {
      content.style.transition = 'opacity 1s ease';
      content.style.opacity = '1';
    }
  }, 200);
  
  // 标题淡入
  setTimeout(() => {
    const title = document.getElementById('deathTitle');
    if(title) {
      title.style.transition = 'opacity 1s ease';
      title.style.opacity = '1';
    }
  }, 500);
  
  // 描述打字机
  setTimeout(() => {
    const desc = document.getElementById('deathDesc');
    if(desc) {
      desc.style.opacity = '1';
      typewriterEffect(desc, deathEvent.description, 40);
    }
  }, 1000);
  
  // 统计淡入
  setTimeout(() => {
    const stats = document.getElementById('deathStats');
    if(stats) {
      stats.style.transition = 'opacity 0.8s ease';
      stats.style.opacity = '1';
    }
  }, 2500);
  
  // 按钮淡入
  setTimeout(() => {
    const action = document.getElementById('deathAction');
    if(action) {
      action.style.transition = 'opacity 0.8s ease';
      action.style.opacity = '1';
    }
  }, 3500);
  
  // 纸钱飘落效果
  setTimeout(() => {
    const container = document.getElementById('paperMoneyContainer');
    if(container) createPaperMoneyEffect(container);
  }, 800);
}

/**
 * 夭折成就解锁
 */
function unlockDeathAchievement(deathEvent) {
  // 通用夭折成就
  unlockAchievement('death_early', {
    name: '英年早逝',
    desc: '在江湖开始前就已结束',
    rarity: 'rare',
    icon: '⚰️'
  });
  
  // 特定死因成就
  const causeAchievements = {
    'death_plague': { id: 'death_plague', name: '天妒红颜', desc: '瘟疫无情，夺你性命', icon: '😷' },
    'death_flood': { id: 'death_flood', name: '浊浪吞生', desc: '洪水无情，卷入深渊', icon: '🌊' },
    'death_bandits': { id: 'death_bandits', name: '刀下亡魂', desc: '山匪屠村，命丧刀下', icon: '🔪' },
    'death_famine': { id: 'death_famine', name: '饿殍千里', desc: '饥荒之年，饿死街头', icon: '🍂' },
    'death_accident': { id: 'death_accident', name: '飞来横祸', desc: '意外身亡，命薄如纸', icon: '💀' },
    'death_poison': { id: 'death_poison', name: '毒发身亡', desc: '误食毒物，七窍流血', icon: '🍄' },
    'death_fire': { id: 'death_fire', name: '浴火不归', desc: '火灾殒命，化为灰烬', icon: '🔥' },
    'death_wolf': { id: 'death_wolf', name: '狼口余生...未遂', desc: '野狼袭击，葬身兽腹', icon: '🐺' },
  };
  
  const ach = causeAchievements[deathEvent.id];
  if (ach) {
    unlockAchievement(ach.id, {
      name: ach.name,
      desc: ach.desc,
      rarity: 'epic',
      icon: ach.icon
    });
  }
}

/**
 * 解锁成就（独立存档，不受重新开始影响）
 * 使用独立 key: wuxia_global_achievements
 */
function unlockAchievement(id, data) {
  // 尝试多种可能的成就系统接口
  if (typeof window !== 'undefined') {
    // 方式1: 全局 achUnlock 函数
    if (typeof window.achUnlock === 'function') {
      window.achUnlock(id, data);
      return;
    }
    // 方式2: 全局 achievementUnlock 函数
    if (typeof window.achievementUnlock === 'function') {
      window.achievementUnlock(id, data);
      return;
    }
  }
  
  // 方式3: 独立存档（不受重新开始影响）
  try {
    const key = 'wuxia_global_achievements'; // 独立 key，与角色存档分离
    const saved = localStorage.getItem(key);
    let achs = saved ? JSON.parse(saved) : {};
    if (!achs[id]) {
      achs[id] = { ...data, unlockedAt: Date.now(), unlockCount: 1 };
      localStorage.setItem(key, JSON.stringify(achs));
      console.log(`[成就解锁] ${data.icon} ${data.name}: ${data.desc}`);
      // 尝试显示Toast
      if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
        window.showToast(`🏆 成就解锁: ${data.icon} ${data.name}`, 'achievement');
      }
    } else {
      // 已解锁过，增加计数但不重复提示
      achs[id].unlockCount = (achs[id].unlockCount || 1) + 1;
      achs[id].lastUnlockAt = Date.now();
      localStorage.setItem(key, JSON.stringify(achs));
      console.log(`[成就重复] ${data.icon} ${data.name}（第${achs[id].unlockCount}次）`);
    }
  } catch (e) {
    console.log('[成就] 存储失败:', e);
  }
}

/**
 * 纸钱飘落效果
 */
function createPaperMoneyEffect(container) {
  const chars = ['冥', '钱', '纸', '祭', '奠', '悼'];
  for(let i = 0; i < 15; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.textContent = chars[Math.floor(Math.random() * chars.length)];
      const startX = Math.random() * 100;
      const dur = 6 + Math.random() * 4;
      p.style.cssText = `
        position:absolute;
        font-size:${12 + Math.random() * 8}px;
        left:${startX}%;
        top:-20px;
        color:rgba(100,100,100,${0.3 + Math.random() * 0.3});
        text-shadow:0 0 4px rgba(100,100,100,.2);
        animation:paperFall ${dur}s linear forwards;
        pointer-events:none;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000);
    }, i * 400);
  }
  
  // 添加CSS动画
  if(!document.getElementById('paperMoneyStyle')) {
    const style = document.createElement('style');
    style.id = 'paperMoneyStyle';
    style.textContent = `
      @keyframes paperFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 0.5; }
        100% { transform: translateY(100vh) rotate(${Math.random() > 0.5 ? '' : '-'}360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * 夭折后重新开始
 */
function restartOriginWithDeath() {
  // 清理
  const overlay = document.getElementById('deathOverlay');
  if(overlay) {
    overlay.style.transition = 'opacity 0.8s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 800);
  }
  removeOriginBackdrop();
  
  // 重置数据
  currentEventIndex = 0;
  eventChain = [];
  originData = null;
  birthPrelim = null;
  
  // 停止BGM
  if(typeof originBgmStop==='function') originBgmStop(true);
  
  // 重新开始
  setTimeout(() => {
    generateBackground();
    showStudioAnimation();
  }, 1000);
}

/**
 * 第四步：出身完成总结（自动播放，无需点击）
 */
function showOriginComplete() {
  stopSceneAnimations();
  const data = originData;

  saveOriginData();
  if (typeof edS !== 'undefined') {
    applyOriginStats(data);
    // 出身结算页展示的角色形象，应与随后正式存档进 wuxia_editor 的当前外观一致
    autoAssignAppearance();
  }
  const finalPortraitArt = (typeof edBuildStageAscii === 'function')
    ? edBuildStageAscii(typeof edS !== 'undefined' ? edS : null)
    : ((typeof edBuild === 'function') ? edBuild() : generatePortraitArt(data));


  const overlay = document.createElement('div');
  overlay.id = 'completeOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:linear-gradient(180deg, #000 0%, #0a0510 40%, #0f0a1a 100%);
    z-index:9999;display:flex;align-items:center;justify-content:center;
  `;

  // 金色粒子容器
  overlay.innerHTML = `
    <div id="completeParticles" style="position:absolute;top:0;left:0;width:100%;height:100%;
      z-index:1;pointer-events:none;overflow:hidden"></div>

    <div id="completeContent" style="max-width:500px;padding:30px;text-align:center;opacity:0;z-index:2;position:relative">

      <div style="font-size:40px;margin-bottom:16px;filter:drop-shadow(0 0 20px rgba(255,215,0,0.4))">⚔️</div>
      <div style="font-size:24px;color:#ffd060;letter-spacing:4px;margin-bottom:6px;
        text-shadow:0 0 30px rgba(255,215,0,0.2)">
        少年英豪
      </div>
      <div style="font-size:11px;color:rgba(200,170,80,.4);letter-spacing:2px;margin-bottom:24px">
        · 出身已定 · 江湖路远 ·
      </div>

      <!-- 最终形象展示 -->
      <div id="finalPortrait" style="font-size:10px;line-height:1.2;color:#e8d5a3;
        white-space:pre;margin:0 auto 16px;display:inline-block;opacity:0;
        transition:opacity 1s ease 0.3s">${finalPortraitArt}</div>


      <div style="font-size:15px;color:#ffd060;letter-spacing:3px;margin-bottom:4px">
        ${data.fullName}
      </div>
      <div style="font-size:11px;color:rgba(200,170,80,.5);margin-bottom:20px">
        ${data.gender === 'female' ? '女' : '男'} · ${data.hometown} · ${data.background.name}
      </div>

      <!-- 成长历程回顾 -->
      <div style="background:rgba(240,192,96,.05);border:1px solid rgba(240,192,96,.12);
        border-radius:10px;padding:16px;margin-bottom:16px;text-align:left;max-height:180px;overflow-y:auto">
        <div style="font-size:10px;color:rgba(240,192,96,.5);letter-spacing:2px;margin-bottom:8px">
          · 成长历程 ·
        </div>
        <div style="font-size:11px;color:#a09080;line-height:2.2">
          ${data.eventChain.map((e, i) => `
            <div style="display:flex;gap:8px;align-items:baseline">
              <span style="color:#ffd060;min-width:32px;font-size:10px">${e.age}岁</span>
              <span style="color:#c0a080">${getMoodEmoji(e.mood)} ${e.event}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:16px">
        ${formatStatDisplay(data.totalStats)}
      </div>

      ${(() => {
        // 汇总出身事件中的银两/物品/技能奖励
        let bonusSilver = 0;
        const bonusItems = [];
        const bonusSkills = [];
        for (const ev of data.eventChain) {
          const ef = ev.effects || {};
          if (ef.silver) bonusSilver += ef.silver;
          if (ef.items) {
            for (const it of ef.items) {
              const ex = bonusItems.find(b => b.id === it.id);
              if (ex) ex.qty = (ex.qty || 1) + (it.qty || 1);
              else bonusItems.push({ ...it, qty: it.qty || 1 });
            }
          }
          if (ef.skills) {
            for (const sk of ef.skills) {
              if (!bonusSkills.find(s => s.id === sk.id)) bonusSkills.push(sk);
            }
          }
        }
        const hasAny = bonusSilver > 0 || bonusItems.length > 0 || bonusSkills.length > 0;
        if (!hasAny) return '';
        const rows = [];
        if (bonusSilver > 0) rows.push(`<span style="color:#ffd060">💰 银两 ×${bonusSilver}</span>`);
        for (const it of bonusItems) rows.push(`<span>${it.icon || '📦'} ${it.name} ×${it.qty}</span>`);
        for (const sk of bonusSkills) rows.push(`<span style="color:#88ccff">📖 ${sk.name}</span>`);
        return `
          <div style="background:rgba(100,200,100,.05);border:1px solid rgba(100,200,100,.15);
            border-radius:8px;padding:12px 16px;margin-bottom:16px;text-align:left">
            <div style="font-size:10px;color:rgba(100,200,100,.6);letter-spacing:2px;margin-bottom:8px">
              🎒 出身所得
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#90c090">
              ${rows.join('')}
            </div>
          </div>
        `;
      })()}

      <div style="font-size:10px;color:rgba(150,120,60,.25);margin-top:8px">
        你的江湖故事，由此开始……
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 淡入
  setTimeout(() => {
    document.getElementById('completeContent').style.opacity = '1';
    document.getElementById('completeContent').style.transition = 'opacity 1s ease';
  }, 200);

  // 完成音效 + 壮丽BGM
  setTimeout(() => {
    if(typeof originSfxComplete==='function') originSfxComplete();
    if(typeof originBgmPlay==='function') originBgmPlay('complete');
  }, 400);

  // 最终形象
  setTimeout(() => {
    const portrait = document.getElementById('finalPortrait');
    if (portrait) portrait.style.opacity = '1';
    if(typeof originSfxStatReveal==='function') originSfxStatReveal();
  }, 600);

  // 金色粒子
  setTimeout(() => {
    const container = document.getElementById('completeParticles');
    if (container) {
      createAmbientParticles(container, {
        type: 'golden',
        particles: ['✦', '⭐', '✧', '·'],
        speed: 2000,
        color: 'rgba(255,215,0,0.5)',
      });
    }
  }, 500);

  // 6秒后自动进入游戏
  setTimeout(() => {
    stopSceneAnimations();
    if(typeof originSfxFadeOut==='function') originSfxFadeOut();
    fadeOutAndRemove(overlay, 800, () => {
      if(typeof originBgmStop==='function') originBgmStop();
      const backdrop = document.getElementById('originBackdrop');
      if (backdrop) {
        backdrop.style.transition = 'opacity 0.3s ease';
        backdrop.style.opacity = '0';
        setTimeout(() => removeOriginBackdrop(), 300);
      }
      enterMainGame();
    });
  }, 6000);
}

// ════════════════════════════════════════════════════════════════
//  辅助函数
// ════════════════════════════════════════════════════════════════

function fadeOutAndRemove(element, duration, callback) {
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = '0';
  setTimeout(() => {
    element.remove();
    if (callback) callback();
  }, duration);
}

function getMoodEmoji(mood) {
  const map = {
    sad: '😢', lucky: '🍀', mysterious: '🌙', scary: '😨',
    happy: '😊', proud: '😤', warm: '💛', angry: '🔥',
    excited: '✨', inspired: '💫', determined: '💪',
  };
  return map[mood] || '📖';
}

function formatStatDisplay(stats) {
  const names = {
    str: '力量', agi: '速度', con: '体质',
    int: '悟性', cha: '魅力', luk: '运气',
  };
  let html = '';
  for (const [key, name] of Object.entries(names)) {
    const val = stats[key] || 0;
    const color = val > 0 ? '#70c070' : val < 0 ? '#ff6655' : '#606060';
    const sign = val > 0 ? '+' : '';
    html += `
      <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
        border-radius:6px;padding:6px 8px">
        <div style="font-size:9px;color:#808080;margin-bottom:2px">${name}</div>
        <div style="font-size:16px;font-weight:bold;color:${color}">${sign}${val}</div>
      </div>
    `;
  }
  return html;
}

function formatEffectsText(effects) {
  if (!effects) return '';
  const names = {
    str: '力量', agi: '速度', con: '体质',
    int: '悟性', cha: '魅力', luk: '运气',
    hp: '气血', mp: '内力',
  };
  const parts = [];
  for (const [key, val] of Object.entries(effects)) {
    if (key === 'silver') {
      parts.push(`💰 银两+${val}`);
    } else if (key === 'items') {
      // val 是数组：[{id, name, icon, qty}]
      for (const it of val) {
        parts.push(`${it.icon || '📦'} ${it.name}×${it.qty || 1}`);
      }
    } else if (key === 'skills') {
      // val 是数组：[{id, name}]
      for (const sk of val) {
        parts.push(`📖 习得【${sk.name}】`);
      }
    } else {
      const name = names[key] || key;
      const sign = val > 0 ? '+' : '';
      parts.push(`${name}${sign}${val}`);
    }
  }
  return '📈 ' + parts.join('  ');
}

function generatePortraitArt(data) {
  const isFemale = data.gender === 'female';
  const bg = data.background;
  const apps = data.appearances || [];

  // 根据出身选择基础模板
  const originTemplates = {
    blacksmith: { male: 'forge_m', female: 'forge_f' },
    scholar:    { male: 'book_m', female: 'book_f' },
    martial:    { male: 'war_m', female: 'war_f' },
    merchant:   { male: 'rich_m', female: 'rich_f' },
    farmer:     { male: 'farm_m', female: 'farm_f' },
    doctor:     { male: 'doc_m', female: 'doc_f' },
    orphan:     { male: 'stray_m', female: 'stray_f' },
    official:   { male: 'noble_m', female: 'noble_f' },
    pirate:     { male: 'sea_m', female: 'sea_f' },
    performer:  { male: 'stage_m', female: 'stage_f' },
    hunter:     { male: 'hunt_m', female: 'hunt_f' },
    beggar:     { male: 'beg_m', female: 'beg_f' },
    monk:       { male: 'monk_m', female: 'monk_f' },
    boatman:    { male: 'boat_m', female: 'boat_f' },
    fisherman:  { male: 'fish_m', female: 'fish_f' },
    musician:   { male: 'music_m', female: 'music_f' },
  };

  // 检查特殊外貌特征
  const hasScar = apps.includes('scar_face') || apps.includes('battle_scar');
  const hasCold = apps.includes('cold_eyes') || apps.includes('vigilant');
  const hasPale = apps.includes('pale') || apps.includes('mature_eyes');
  const hasMystic = apps.includes('mystic_mark') || apps.includes('sword_intent') || apps.includes('martial_aura');

  // 角色画模板库
  const templates = {
    // === 男性模板 ===
    forge_m: hasScar
      ? `    ╭──╮\n   (×_×)\n  /╱╲╲╲\n |  ▓  |\n |锤.铁|\n  ╲  ╱`
      : `    ╭──╮\n   (╬_╬)\n  /╱╲╲╲\n |  ▓  |\n |火.铁|\n  ╲  ╱`,
    book_m: hasPale
      ? `   ☯(O)☯\n   ╱    ╲\n  | 书  |\n  | 卷  |\n  ╲____╱`
      : `   ☯(O)☯\n   ╱    ╲\n  | 笔  |\n  | 墨  |\n  ╲____╱`,
    war_m: hasCold
      ? `  ╔[O]╗\n  (>_<)\n  ╱│ │╲\n ╱ ⚔ ╲\n│ 霸  │`
      : `  ╔[O]╗\n  (O_O)\n  ╱│ │╲\n ╱ ⚔ ╲\n│ 侠  │`,
    rich_m: `  ∧__∧\n ( ◡  )\n  ╱╱╲╲\n | 金 |\n  ╲__╱`,
    farm_m: `  (O_O)\n  /│  │\\\n | 扁担|\n /  │  \\\n    ～`,
    doc_m: ` ☯(O)☯\n  /  ╲\n |药笼|\n |银针|\n  ╲  ╱`,
    stray_m: hasScar
      ? `  (⊙_⊙)\n / ╲ ╲\n| 破  衣|\n|  袋  |\n ╲  ╱`
      : `  (⊙_⊙)\n / ╲ ╲\n|  萧  瑟|\n|  瑟  |\n ╲  ╱`,
    noble_m: `  ╔[O]╗\n  (¬_¬)\n  ╱│  │╲\n | 玉佩 |\n  ╲__╱`,
    sea_m: hasScar
      ? `  ▼(O)▼\n /╳  ╳\\\n| 桅杆 |\n| 波浪 |\n ～海～`
      : `  ▼(O)▼\n /╲  ╱\\\n| 舵轮 |\n| 波浪 |\n ～海～`,
    stage_m: `  ≋≋≋\n (≧▽≦)\n /╱  ╲╲\n| 水袖 |\n|  ·  |`,
    hunt_m: `  ◇(O)◇\n /╱  ╲╲\n| 弓.箭|\n| 草笠 |\n  ～  `,
    beg_m: `  (×_×)\n / ≈ ≈ \\\n| 破碗 |\n| 竹杖 |\n  ╲  ╱`,
    monk_m: `╭(◎)╮\n  │ │\n  │卍│\n  │ │\n 南无`,
    boat_m: `  (O_O)\n /╱  ╲╲\n| 橹  |\n| 篷  |\n  ～  `,
    fish_m: `  (O_O)\n /╱  ╲╲\n| 网  |\n| 鱼  |\n  ～  `,
    music_m: `  ≋≋≋\n (´ω\`)\n /╱  ╲╲\n| 古琴 |\n| 音  |`,

    // === 女性模板 ===
    forge_f: `  ≋≋\n (・ω・)\n/つ 火つ\\\n|  锤  |\n ヽ  つ `,
    book_f: `  ≋≋\n (・ω・)\n/つ 笔つ\\\n|  墨  |\n ヽ  つ `,
    war_f: hasCold
      ? `  ≋≋\n (¬_¬)\n/つ 剑つ\\\n|  侠  |\n ヽ  つ `
      : `  ≋≋\n (・ω・)\n/つ 剑つ\\\n|  剑  |\n ヽ  つ `,
    rich_f: `  ≋≋\n (◡◡)\n/つ 玉つ\\\n|  钗  |\n ヽ  つ `,
    farm_f: `  ≋≋\n (・ω・)\n/つ 竹つ\\\n|  筐  |\n ヽ  つ `,
    doc_f: `  ≋≋\n (・ω・)\n/つ 药つ\\\n|  香  |\n ヽ  つ `,
    stray_f: `  ≋≋\n (・ω・)\n/つ 破つ\\\n|  衣  |\n ヽ  つ `,
    noble_f: `  ≋≋\n (◡◡)\n/つ 凤つ\\\n|  冠  |\n ヽ  つ `,
    sea_f: `  ≋≋\n (≧▽≦)\n/つ 刀つ\\\n|  风  |\n ヽ  つ `,
    stage_f: `  ≋≋\n (≧▽≦)\n/つ 扇つ\\\n|  袖  |\n ヽ  つ `,
    hunt_f: `  ≋≋\n (・ω・)\n/つ 弓つ\\\n|  箭  |\n ヽ  つ `,
    beg_f: `  ≋≋\n (・ω・)\n/つ 破つ\\\n|  碗  |\n ヽ  つ `,
    monk_f: `  ≋≋\n (・ω・)\n/つ 念つ\\\n|  珠  |\n ヽ  つ `,
    boat_f: `  ≋≋\n (・ω・)\n/つ 橹つ\\\n|  篷  |\n ヽ  つ `,
    fish_f: `  ≋≋\n (・ω・)\n/つ 网つ\\\n|  鱼  |\n ヽ  つ `,
    music_f: `  ≋≋\n (・ω・)\n/つ 琴つ\\\n|  箫  |\n ヽ  つ `,
  };

  const key = originTemplates[bg.id] || (isFemale ? 'farm_f' : 'farm_m');
  let art = templates[key] || (isFemale ? templates.farm_f : templates.farm_m);

  // 神秘特征叠加标记
  if (hasMystic) {
    art = `  ✦✧✦\n${art}\n  ✧✦✧`;
  }

  return art;
}

function applyOriginStats(data) {
  if (!data || typeof edS === 'undefined') return;

  // ── 1. 写入出身6维属性（str/agi/con/int/cha/luk）──
  for (const [key, val] of Object.entries(data.totalStats)) {
    const statMap = { str: 'str', agi: 'agi', con: 'con', int: 'int', cha: 'cha', luk: 'luk' };
    if (statMap[key]) {
      edS[statMap[key]] = (edS[statMap[key]] || 0) + val;
    }
  }

  // ── 2. 出身属性 → 五维根骨自动换算 ──
  // 武侠逻辑：力量→劲力，体质→体魄，速度→身法，悟性→内息，魅力→心志
  // 运气→不影响五维，只影响隐藏气运（fate）
  const originPts = {
    vigor: Math.max(0, edS.str || 0),
    tough: Math.max(0, edS.con || 0),
    swift: Math.max(0, edS.agi || 0),
    inner: Math.max(0, edS.int || 0),
    will:  Math.max(0, edS.cha || 0),
  };
  edS.primaryPts = { vigor: 0, tough: 0, swift: 0, inner: 0, will: 0 };
  // 出身转换的点数不算入"自由点"（这些是天赋，不可重置）
  edS.originPts = { ...originPts };

  // ── 3. 运算→气运（fate）──
  edS.fate = Math.min(20, 5 + Math.max(0, edS.luk || 0) * 2);

  // ── 4. 写入角色名（全游戏通用字段）──
  edS.name = data.fullName;

  edS.origin = {
    background: data.background.id,
    surname: data.surname,
    fullName: data.fullName,
    gender: data.gender,
    hometown: data.hometown,
    events: data.eventChain.map(e => e.event),
  };

  // 出身hometown是中文城市名，travelCurrentCity需要WORLD_NODES的英文id
  const HOMETOWN_TO_ID = {
    '沧州': 'cangzhou', '杭州': 'hangzhou', '襄阳': 'xiangyang',
    '扬州': 'yangzhou', '成都': 'chengdu', '大理': 'dali',
    '洛阳': 'luoyang', '京城': 'youzhou', '泉州': 'fuzhou',
    '苏州': 'suzhou', '晋阳': 'jinyang', '开封': 'kaifeng',
    '嵩山': 'songshan', '岳阳': 'yueyang', '明州': 'mingzhou',
  };
  const hometownId = HOMETOWN_TO_ID[data.hometown] || 'luoyang';

  travelCurrentCity = hometownId;
  travelHistory = [hometownId];

  // ── 5. 根据出身属性计算初始气血/内力/精力 ──
  // 利用 calcPrimaryBonus 换算出身点数→战斗属性
  const originBonus = (typeof calcPrimaryBonus === 'function')
    ? calcPrimaryBonus(originPts) : {};
  // 基础底盘（editor.js edStats base） + 出身加点加成
  const initHp = 150 + (originBonus.hp || 0);
  const initMp = 100 + (originBonus.mp || 0);
  edS.maxHp = initHp; edS.hp = initHp;
  edS.maxMp = initMp; edS.mp = initMp;
  // 精力：体质越高初始精力越多（base 100 + con×3，上限120）
  const initEnergy = Math.min(120, 100 + Math.max(0, edS.con || 0) * 3);
  if (typeof travelPlayerState !== 'undefined') {
    travelPlayerState.energy = initEnergy;
    travelPlayerState.food   = 100;
    travelPlayerState.water  = 100;
  }

  // ── 6. 初始化游戏时间（新存档从甲子年正月初一开始）──
  edS.gameYear = 1;   // 甲子年
  edS.gameMonth = 1;  // 正月
  edS.gameDay = 1;    // 初一

  // ── 7. 根据出身设定初始善恶值 ──
  const BACKGROUND_KARMA = {
    doctor:    5,   // 悬壶济世
    farmer:    3,   // 质朴善良
    scholar:   2,   // 知书达理
    martial:   0,   // 中立
    blacksmith:0,   // 中立
    official:  1,   // 守规矩
    orphan:    0,   // 亦正亦邪
    merchant:  -2,  // 利益为上
    pirate:    -10, // 父辈为寇
  };
  edS.karma = BACKGROUND_KARMA[data.background.id] ?? 0;

  // ── 8. 遍历事件链，写入银两 / 物品 / 初始技能奖励 ──
  let bonusSilver = 0;
  const bonusItems = [];   // 消耗品列表 [{id, name, icon, qty, effect}]
  const bonusSkills = [];  // 技能ID列表 [string]

  for (const event of data.eventChain) {
    const ef = event.effects || {};
    if (ef.silver) bonusSilver += ef.silver;
    if (ef.items) {
      for (const it of ef.items) {
        const existing = bonusItems.find(b => b.id === it.id);
        if (existing) existing.qty = (existing.qty || 1) + (it.qty || 1);
        else bonusItems.push({ ...it, qty: it.qty || 1 });
      }
    }
    if (ef.skills) {
      for (const sk of ef.skills) {
        if (!bonusSkills.includes(sk.id)) bonusSkills.push(sk.id);
      }
    }
  }

  // 写入银两奖励（叠加到初始银两200上）
  if (bonusSilver > 0 && typeof addSilver === 'function') {
    addSilver(bonusSilver);
  }

  // 写入物品奖励（进消耗品背包）
  if (bonusItems.length > 0 && typeof consumableBagAdd === 'function') {
    for (const it of bonusItems) {
      consumableBagAdd({
        id: it.id,
        name: it.name,
        icon: it.icon || '📦',
        desc: it.desc || '',
        effect: it.effect || {},
      }, it.qty || 1);
    }
  }

  // 写入技能奖励（追加到 edS.skills）
  if (bonusSkills.length > 0 && typeof edS !== 'undefined') {
    if (!edS.skills) edS.skills = [];
    for (const sid of bonusSkills) {
      if (!edS.skills.includes(sid)) edS.skills.push(sid);
    }
  }

  if (typeof saveGameState === 'function') {
    saveGameState();
  }
  // 保存旅行状态（当前城市 = 出身地），确保跨页面跳转后 town.html 能读取
  if (typeof travelSave === 'function') {
    travelSave();
  }
}

function enterMainGame() {
  // 自动分配外貌（基于出身和事件链）
  autoAssignAppearance();
  
  // 标记出身流程完成，城镇引导待开始
  if (typeof gameState !== 'undefined') {
    gameState.tutorialStep = 10;  // 10 = 城镇引导待开始
    if (typeof saveGameState === 'function') saveGameState();
  }

  // 跳转到新手村城镇界面（手机优化版）
  // 检查是否在 ascii-heroes.html 中（有 pageMap DOM 元素）
  if (typeof showPage === 'function' && document.getElementById('pageMap')) {
    showPage('map');
    if (typeof travelRenderLocation === 'function') {
      travelRenderLocation(travelCurrentCity);
    }
  } else {
    // 在 index.html 中：跳转到 town.html
    window.location.href = 'town.html';
  }
}

/**
 * 根据出身和事件链自动分配角色外貌（ED_PARTS部件）
 */
function autoAssignAppearance() {
  if (typeof edS === 'undefined' || !originData) return;

  const bg = originData.background;
  const gender = originData.gender;
  const appearances = originData.appearances || [];

  // 出身对应的默认外貌映射
  const originPartsMap = {
    blacksmith:  { head: 1, body: 0, arms: 6, legs: 0, aura: 0 },   // 方头, 侠客, 铁拳, 马步
    scholar:     { head: 5, body: 14, arms: 14, legs: 3, aura: 0 },  // 帽+胡, 书生, 书卷, 盘腿
    martial:     { head: 11, body: 0, arms: 1, legs: 0, aura: 5 },  // 王者盔, 侠客, 长剑, 马步, 剑气
    merchant:    { head: 0, body: 4, arms: 0, legs: 5, aura: 0 },   // 圆头, 轻盈, 空手, 腾空
    farmer:      { head: 0, body: 1, arms: 8, legs: 1, aura: 0 },   // 圆头, 宽体, 棍棒, 丁字步
    doctor:      { head: 4, body: 13, arms: 7, legs: 3, aura: 4 },  // 道士, 流浪, 拂尘, 盘腿, 万毒
    orphan:      { head: 8, body: 13, arms: 0, legs: 5, aura: 0 },  // 鬼脸, 流浪, 空手, 腾空
    official:    { head: 11, body: 9, arms: 1, legs: 0, aura: 0 },  // 王者盔, 披风, 长剑, 马步
    pirate:      { head: 13, body: 6, arms: 1, legs: 4, aura: 11 }, // 魔王, 裸背, 长剑, 弓步, 血腥
    performer:   { head: 15, body: 8, arms: 5, legs: 10, aura: 0 }, // 长发, 斗篷, 折扇, 踏云
    hunter:      { head: 3, body: 4, arms: 4, legs: 6, aura: 0 },   // 武僧, 轻盈, 弓箭, 飞奔
    beggar:      { head: 7, body: 13, arms: 8, legs: 10, aura: 0 }, // 凶相, 流浪, 棍棒, 踏云
    monk:        { head: 3, body: 5, arms: 3, legs: 3, aura: 2 },   // 武僧, 弓腰, 禅杖, 盘腿, 南无佛
    boatman:     { head: 0, body: 1, arms: 12, legs: 4, aura: 0 },  // 圆头, 宽体, 长枪, 弓步
    fisherman:   { head: 6, body: 1, arms: 8, legs: 7, aura: 0 },   // 骷髅, 宽体, 棍棒, 莲花
    musician:    { head: 15, body: 10, arms: 14, legs: 3, aura: 8 },// 长发, 羽衣, 书卷, 盘腿, 烈焰
  };

  // 获取出身默认部件
  let parts = { ...originPartsMap[bg.id] } || { head: 0, body: 0, arms: 0, legs: 0, aura: 0 };

  // 根据事件链中的appearance标签微调外貌
  for (const app of appearances) {
    switch (app) {
      case 'scar_face':  parts.head = 9; break;    // 凶相
      case 'cold_eyes':  parts.head = 10; break;   // 傲娇
      case 'pale':       parts.head = 7; break;    // 鬼脸
      case 'serious':    parts.head = 10; break;   // 傲娇
      case 'scar_body':  parts.body = 6; break;    // 裸背
      case 'elegant':    parts.head = 15; break;   // 长发
      case 'bold_brow':  parts.head = 9; break;    // 凶相
      case 'wild':       parts.body = 4; break;    // 轻盈
      case 'battle_hardened': parts.body = 8; break; // 斗篷
      case 'sword_intent':   parts.aura = 5; break; // 剑气
      case 'martial_aura':   parts.aura = 5; break; // 剑气
      case 'heterochromia':  parts.head = 7; break; // 鬼脸（异瞳）
      case 'battle_scar':    parts.body = 6; break; // 裸背
      case 'vigilant':       parts.head = 10; break; // 傲娇
      case 'mourning':       parts.aura = 11; break; // 血腥
      case 'burnt_hair':     parts.head = 12; break; // 龙头
      case 'mystic_mark':    parts.aura = 14; break; // 符文
      // ── 新增奖励事件用到的 appearance ──
      case 'determined':     parts.head = 10; break; // 傲娇→坚毅眼神
      case 'grateful':       parts.aura = 8; break;  // 烈焰光环→感激暖意
      case 'diligent':       parts.body = 2; break;  // 正装→勤恳形象
      case 'observant':      parts.head = 10; break; // 傲娇→锐利观察眼
      case 'kind':           parts.aura = 8; break;  // 烈焰光环→温和气息
      case 'gentle':         parts.aura = 8; break;  // 烈焰光环→温柔气息
      case 'sharp_eyes':     parts.head = 10; break; // 傲娇→犀利眼神
      case 'righteous':      parts.aura = 5; break;  // 剑气→正义之气
      case 'resolute':       parts.head = 9; break;  // 凶相→决绝神情
      case 'proud':          parts.aura = 5; break;  // 剑气→自豪气势
    }
  }

  // 女性覆盖：长发头型 + 更柔美身型
  if (gender === 'female') {
    if (parts.head <= 2) parts.head = 15; // 长发
    if (parts.body === 1) parts.body = 4; // 宽体→轻盈
    if (parts.body === 6) parts.body = 8; // 裸背→斗篷
    if (parts.aura === 11) parts.aura = 10; // 血腥→仙云
  }

  // 确保部件索引在合法范围内
  for (const key of ['head', 'body', 'arms', 'legs', 'aura']) {
    const maxIdx = ED_PARTS[key].length - 1;
    if (parts[key] > maxIdx) parts[key] = 0;
    if (parts[key] < 0) parts[key] = 0;
  }

  // 写入角色状态
  edS.parts = parts;
  edS.useCustom = { head: false, body: false, arms: false, legs: false, aura: false };

  // 保存
  if (typeof saveGameState === 'function') {
    saveGameState();
  }
}

// ════════════════════════════════════════════════════════════════
//  对接 game-flow.js
// ════════════════════════════════════════════════════════════════

const _originalStartNewGame = window.startNewGame;

window.startNewGameWithOrigin = function() {
  // 进入出身流程前，先把旧界面遗留音效全部清掉
  if (typeof clearGameAudio === 'function') {
    clearGameAudio();
  } else {
    if (window._menuSFX && window._menuSFX.destroy) window._menuSFX.destroy();
    if (window._menuBgmStop) window._menuBgmStop(false);
  }

  // 在用户交互上下文中预热 AudioContext（必须在 click handler 内调用）
  if(typeof originAudioPreheat==='function') originAudioPreheat();


  // 清理所有残留
  stopSceneAnimations();
  ['studioOverlay','originOverlay','eventOverlay','completeOverlay','originBackdrop','birthOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  // 清理动态keyframes
  document.querySelectorAll('style').forEach(s => {
    if (s.textContent && s.textContent.includes('moodFloat_')) s.remove();
  });

  localStorage.removeItem(GAME_STATE_KEY);
  localStorage.removeItem(TRAVEL_STATE_KEY);
  localStorage.removeItem('wuxia_editor');
  localStorage.removeItem(PLAYER_PROFILE_KEY);
  localStorage.removeItem('wuxia_bag');
  localStorage.removeItem('wuxia_craft_bag');
  localStorage.removeItem('wuxia_consumables');
  localStorage.removeItem('wuxia_story_guide');
  localStorage.removeItem('wuxia_town_tutorial_done'); // 城镇引导完成标记
  localStorage.removeItem(ORIGIN_KEY);
  // 补充清理其他独立存档（与 startNewGame 保持一致）
  localStorage.removeItem('wuxia_player_progress');  // 等级/功法/技能熟练度
  localStorage.removeItem('wuxia_cricket');           // 蛐蛐记录（通用key）
  localStorage.removeItem('wuxia_fishing_v4');        // 钓鱼记录
  localStorage.removeItem('wuxia_pets');              // 宠物系统
  localStorage.removeItem('wuxia_npc_state');         // NPC关系+任务状态
  localStorage.removeItem('wuxia_main_quest');        // 主线任务
  localStorage.removeItem('wuxia_side_quests');       // 支线任务
  localStorage.removeItem('wuxia_jianghu_state');     // 江湖奇遇/声望
  localStorage.removeItem('wuxia_dungeon_unlocked');  // 地下城解锁
  localStorage.removeItem('wuxia_dungeon_progress');   // 地下城进度
  localStorage.removeItem('wuxia_achievements');      // 成就
  localStorage.removeItem('wuxia_gambling_data');      // 赌坊数据
  localStorage.removeItem('wuxia_pitchpot_data');     // 投壶数据
  localStorage.removeItem('wuxia_daily_activity');    // 每日活跃
  localStorage.removeItem('wuxia_mount');             // 坐骑
  localStorage.removeItem('wuxia_owned_mounts');      // 已拥有坐骑列表
  localStorage.removeItem('wuxia_sect_chains');      // 门派任务链
  localStorage.removeItem('wuxia_ma_state');          // 师徒系统
  localStorage.removeItem('wuxia_sworn_state');      // 结拜系统
  localStorage.removeItem('wuxia_romance_state');    // 情缘系统
  localStorage.removeItem('wuxia_encounter_state');  // 旅途奇遇
  localStorage.removeItem('wuxia_city_enc_state');   // 城市奇遇
  localStorage.removeItem('wuxia_npc_requests');      // NPC委托
  localStorage.removeItem('wuxia_sect_champ');        // 门派比武大会
  localStorage.removeItem('wuxia_sect_ranklog');     // 门派比武记录
  localStorage.removeItem('wuxia_grandmaster');      // 掌门传承
  localStorage.removeItem('wuxia_town_tutorial_done');
  localStorage.removeItem('wuxia_procedural_quests');// 随机任务
  localStorage.removeItem('wuxia_leaderboard_player_id'); // 排行榜ID
  // 清理基于旧角色名的蛐蛐 key（通用 key 清理后，尝试用旧名猜测key）
  const oldProfile = JSON.parse(localStorage.getItem('wuxia_player_profile') || '{}');
  if (oldProfile.name) {
    const oldCricketKey = 'wuxia_cricket_' + oldProfile.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    localStorage.removeItem(oldCricketKey);
  }

  if (typeof gameState !== 'undefined') {
    gameState = {
      isNewPlayer: true,
      currentMainQuest: 'mq_act1_start',
      unlockedFeatures: ['combat', 'travel', 'fishing', 'gambling', 'cricket'],
      tutorialStep: 0,
      playTime: 0,
      lastSaveTime: null,
    };
  }

  if (typeof travelCurrentCity !== 'undefined') {
    travelCurrentCity = 'luoyang';
    travelHistory = ['luoyang'];
    travelEventLog = [];
    travelPlayerState = { silver: 200, hp: 100, energy: 100, food: 100, water: 100, buffs: [], reputation: 100, wantedBy: [] };
    // 同步银两到统一管理系统
    if (typeof setSilver === 'function') setSilver(200);
  }

  if (typeof edS !== 'undefined') {
    edS.level = 1; edS.exp = 0;
    // 使用统一银两管理器初始化
    setSilver(200);
    edS.skills = []; edS.bag = [];
    edS.str = 0; edS.agi = 0; edS.con = 0; edS.int = 0; edS.cha = 0; edS.luk = 0;
    // hp/mp/energy 将在 applyOriginStats() 中根据出身属性计算
    edS.hp = 0; edS.maxHp = 0; edS.mp = 0; edS.maxMp = 0;
    // 境界重置（将在完成出身后由 loadRealmState 重新初始化）
    edS.realm = undefined;
  }

  document.querySelectorAll('.sq-overlay').forEach(el => el.remove());
  const menu = document.getElementById('mainMenuOverlay');
  if (menu) menu.remove();

  currentEventIndex = 0;
  eventChain = [];
  originData = null;
  birthPrelim = null;

  generateBackground();
  showStudioAnimation();
};

// ════════════════════════════════════════════════════════════════
//  导出
// ════════════════════════════════════════════════════════════════
window.showStudioAnimation = showStudioAnimation;
window.showOriginIntro = showOriginIntro;
window.showBirthScene = showBirthScene;
window.generateOrigin = finalizeOrigin;
window.generateBackground = generateBackground;
window.startNewGameWithOrigin = window.startNewGameWithOrigin;
window.originAudioPreheat = originAudioPreheat;
window.ORIGIN_KEY = ORIGIN_KEY;

// 出身生成系统已加载
