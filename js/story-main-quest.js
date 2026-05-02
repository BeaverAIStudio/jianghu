/**
 * ============================================================================
 * 纯叙事指引系统 - StoryGuide
 * ============================================================================
 *
 * 核心设计：
 * - 不是任务系统，是故事叙述指引
 * - 只有"当前叙事节点"，没有"已完成任务"列表
 * - 玩家自然游戏到条件满足，叙事自动推进
 * - 完全独立 localStorage，不触碰任何游戏数据
 *
 * 使用方式：
 *   StoryGuide.init();    // 初始化（不自动）
 *   StoryGuide.start();   // 开始指引（启动轮询）
 *   StoryGuide.stop();    // 暂停
 *
 * 控制台快捷：
 *   SG.talk('鹤隐')       // 模拟NPC对话触发
 *   SG.dungeon('血骨门总坛') // 模拟地下城完成
 *   SG.boss('骨冥子')     // 模拟BOSS击败
 *   SG.show() / SG.hide() // 显示/隐藏指引卡
 *   SG.debug()            // 调试状态
 *   SG.reset()            // 重置从头开始
 *
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// 故事章节数据库（独立数据，与 QUEST_DB / MAIN_QUEST_CHAIN 完全无关）
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 章节结构：
 *   chapters[chapterId] = {
 *     id, title,        // 章节ID和标题
 *     beats: [beatId, ...],  // 该章节包含的叙事节点ID顺序
 *     prev, next        // 章节链（用于显示章节进度）
 *   }
 *
 * 叙事节点结构：
 *   beats[beatId] = {
 *     id, chapter,      // 节点ID和所属章节
 *     title,            // 节点标题
 *     narrative,        // 叙述文字（进入时显示）
 *     hint,             // 指引提示（持续显示直到完成）
 *     type,             // 'travel' | 'talk' | 'dungeon' | 'boss' | 'narrate'
 *     target,           // 检测目标（城市名/NPC名/地下城名/BOSS名）
 *     nextBeat,         // 完成后的下一个节点ID（null=章节结束）
 *     nextChapter,      // 章节结束后下一章ID（null=故事完结）
 *   }
 */

const STORY_CHAPTERS = {
  ch1: {
    id: 'ch1', title: '第一章 · 血雨腥风',
    beats: ['b1_1', 'b1_2', 'b1_3', 'b1_4'],
    prev: null, next: 'ch2',
  },
  ch2: {
    id: 'ch2', title: '第二章 · 玄铁迷踪',
    beats: ['b2_1', 'b2_2', 'b2_3', 'b2_4', 'b2_5'],
    prev: 'ch1', next: 'ch3',
  },
  ch3: {
    id: 'ch3', title: '第三章 · 正道会盟',
    beats: ['b3_1', 'b3_2', 'b3_3', 'b3_4'],
    prev: 'ch2', next: 'ch4',
  },
  ch4: {
    id: 'ch4', title: '第四章 · 孤身潜入',
    beats: ['b4_1', 'b4_2', 'b4_3', 'b4_4'],
    prev: 'ch3', next: 'ch5',
  },
  ch5: {
    id: 'ch5', title: '第五章 · 决战血骨门',
    beats: ['b5_1', 'b5_2', 'b5_3', 'b5_4'],
    prev: 'ch4', next: 'ch6',
  },
  ch6: {
    id: 'ch6', title: '第六章 · 江湖新序',
    beats: ['b6_1', 'b6_2', 'b6_3', 'b6_4'],
    prev: 'ch5', next: null,
  },
};

/* ══════════════════════════════════════════════════════════════
 *  角色立绘映射表 - STORY_CHAR_PORTRAITS
 *  每个 key 为主说话人名前缀，匹配 speaker 字段
 *  ascii: 默认帧（4行ASCII字符画）
 *  frames: 多帧循环数组（呼吸/浮动微动画），每帧4行
 *  effect: CSS 特效类名（触发额外光效/粒子）
 *  支持同一角色的不同姿态变体（通过 mood 后缀选择）
 * ══════════════════════════════════════════════════════════════ */
const STORY_CHAR_PORTRAITS = {

  // ── 旁白：卷轴样式 · 缓慢打开 ──
  '旁白': {
    color: '#7090a8',
    effect: 'sg-portrait-narrate',
    ascii: [
      '  ╔════════╗',
      '  ║ 📜 卷  ║',
      '  ║  史  记 ║',
      '  ╚════════╝',
    ],
    frames: [
      ['  ╔════════╗', '  ║ 📜 卷  ║', '  ║  史  记 ║', '  ╚════════╝'],
      ['  ╔════════╗', '  ║📜 卷  ║', '  ║ 史  记  ║', '  ╚════════╝'],
      ['  ╔════════╗', '  ║ 📜卷  ║', '  ║  史  记 ║', '  ╚════════╝'],
    ],
  },

  // ── 鹤隐：白发隐者 · 头发飘动 + 仙气 ──
  '鹤隐': {
    color: '#80c880',
    effect: 'sg-portrait-xian',
    ascii: [
      '  ≋≋≋≋≋',
      '  ☯(⊙)☯',
      '  ╭───╮',
      '  ╰┤ ├╯',
    ],
    frames: [
      ['  ≋≋≋≋≋', '  ☯(⊙)☯', '  ╭───╮', '  ╰┤ ├╯'],
      ['   ≋≋≋≋', '  ☯(⊙)☯', '  ╭───╮', '  ╰┤ ├╯'],
      ['≋≋≋≋≋  ', '  ☯(⊙)☯', '  ╭───╮', '  ╰┤ ├╯'],
      ['  ≋≋≋≋≋', '  ☯(⊙)☯', '  ╭───╮', '  ╰┤├ ╯'],
    ],
    // 传书变体：手持信件轻微抖动
    letter: {
      ascii: [
        '  ≋≋≋≋≋',
        '  ☯(⊙)☯',
        '  ╭≈≈╮',
        '  📜├',
      ],
      frames: [
        ['  ≋≋≋≋≋', '  ☯(⊙)☯', '  ╭≈≈╮', '  📜├'],
        ['  ≋≋≋≋≋', '  ☯(⊙)☯', '  ╭≈≈╮', '  📜├ '],
        ['  ≋≋≋≋≋', '  ☯(⊙)☯', '  ╭≈≈╮', '  📜├'],
        ['  ≋≋≋≋≋', '  ☯(⊙)☯', '  ╭≈≈╮', ' 📜├ '],
      ],
    },
  },

  // ── 你（玩家）：侠客 · 战斗姿态微动 ──
  '你': {
    color: '#e0e0e0',
    effect: 'sg-portrait-hero',
    ascii: [
      '  ∩∩∩',
      '  (O)',
      ' ┤▎├',
      '  ││',
    ],
    frames: [
      ['  ∩∩∩', '  (O)', ' ┤▎├', '  ││'],
      ['  ∩∩∩', '  (O)', '┤ ▎├', '  ││'],
      ['  ∩∩∩', '  (O)', ' ┤▎├ ', '  ││'],
      ['  ∩∩∩', '  (O)', '  ┤▎├', ' ╱ ╲'],
    ],
    // 心中独白变体：半透明虚线呼吸
    inner: {
      ascii: [
        '  ∩∩∩',
        '  (O)',
        ' ┤··├',
        '  ··',
      ],
      frames: [
        ['  ∩∩∩', '  (O)', ' ┤··├', '  ··'],
        ['  ∩∩∩', '  (O)', '┤ ··├', '  ··'],
        ['  ∩∩∩', '  (O)', ' ┤··├', '  · '],
        ['  ∩∩∩', '  (O)', '┤ ··├', '  ··'],
      ],
    },
  },

  // ── 骨冥子：骷髅魔主 · 邪气涌动 + 红光脉冲 ──
  '骨冥子': {
    color: '#e06060',
    effect: 'sg-portrait-evil',
    ascii: [
      '   ☠️',
      ' ╱|│|╲',
      '  ════',
      ' ║💀💀║',
    ],
    frames: [
      ['   ☠️', ' ╱|│|╲', '  ════', ' ║💀💀║'],
      ['  ▼☠️▼', ' ╱|│|╲', '  ════', ' ║💀💀║'],
      ['   ☠️', '╱|││|╲', '  ════', ' ║💀💀║'],
      ['  ▼☠️▼', ' ╱|⊙|╲', '  ════', ' ║💀💀║'],
    ],
    // 冷笑变体：双目发光
    cold: {
      ascii: [
        '  ▼☠️▼',
        ' ╱|⊙|╲',
        '  ════',
        ' ║💀💀║',
      ],
      frames: [
        ['  ▼☠️▼', ' ╱|⊙|╲', '  ════', ' ║💀💀║'],
        ['  ▼☠️▼', '╱|◉◉|╲', '  ════', ' ║💀💀║'],
        ['  ▼☠️▼', ' ╱|⊙|╲', '  ════', ' ║💀💀║'],
        ['  ▼☠️▼', '╱|◉◉|╲', '  ════', '║💀💀║'],
      ],
    },
  },

  // ── 少林方丈：武僧金身 · 佛光微动 ──
  '少林方丈': {
    color: '#80c880',
    effect: 'sg-portrait-holy',
    ascii: [
      '  ▓▓▓▓',
      ' (◎▓◎)',
      ' ╭██╮',
      ' ╰袈╯',
    ],
    frames: [
      ['  ▓▓▓▓', ' (◎▓◎)', ' ╭██╮', ' ╰袈╯'],
      [' ✦▓▓▓✦', ' (◎▓◎)', ' ╭██╮', ' ╰袈╯'],
      ['▓▓▓▓▓▓', ' (◎▓◎)', ' ╭██╮', ' ╰袈╯'],
      [' ✦▓▓▓✦', ' (◎▓◎)', ' ╭██╮', ' ╰袈╯'],
    ],
    // 沉声变体：佛光收束
    stern: {
      ascii: [
        '  ▓▓▓▓',
        ' (◎_◎)',
        ' ╭██╮',
        ' ╰██╯',
      ],
      frames: [
        ['  ▓▓▓▓', ' (◎_◎)', ' ╭██╮', ' ╰██╯'],
        ['▓▓▓▓▓▓', ' (◎_◎)', ' ╭██╮', ' ╰██╯'],
        ['  ▓▓▓▓', ' (◎_◎)', '╭███╮', '╰███╯'],
        ['  ▓▓▓▓', ' (◎_◎)', ' ╭██╮', ' ╰██╯'],
      ],
    },
  },

  // ── 武当掌门：道袍拂尘 · 太极旋转 ──
  '武当掌门': {
    color: '#80c880',
    effect: 'sg-portrait-tao',
    ascii: [
      '  ☯☯☯',
      '  (⊙)',
      ' ╭☯▏╮',
      ' ╰══╯',
    ],
    frames: [
      ['  ☯☯☯', '  (⊙)', ' ╭☯▏╮', ' ╰══╯'],
      [' ☯☯☯☯', '  (⊙)', ' ╭☯▏╮', ' ╰══╯'],
      ['☯☯☯☯  ', '  (⊙)', ' ╭☯▏╮', ' ╰══╯'],
      [' ☯☯☯☯', '  (⊙)', ' ╭☯▏╮', ' ╰══╯'],
    ],
    // 苦笑 / 颤声变体
    bitter: {
      ascii: [
        '  ☯☯☯',
        '  (⊙_⊙)',
        ' ╭☯▏╮',
        ' ╰··╯',
      ],
      frames: [
        ['  ☯☯☯', '  (⊙_⊙)', ' ╭☯▏╮', ' ╰··╯'],
        ['  ☯☯☯', ' (⊙·_⊙)', ' ╭☯▏╮', ' ╰··╯'],
        ['  ☯☯☯', '  (⊙_⊙)', ' ╭☯▏╮', ' ╰··╯'],
        ['  ☯☯☯', '  (⊙·_·⊙)', '╭☯▏╮', ' ╰··╯'],
      ],
    },
  },

  // ── 华山掌门：剑客冷峻 · 剑光闪烁 ──
  '华山掌门': {
    color: '#80c880',
    effect: 'sg-portrait-sword',
    ascii: [
      '  ╔═╗',
      '  [O]',
      ' ╱▎▏╲',
      '  ⚔  ',
    ],
    frames: [
      ['  ╔═╗', '  [O]', ' ╱▎▏╲', '  ⚔  '],
      ['  ╔═╗', '  [O]', ' ╱▎▏╲', '  ⚔✦ '],
      ['  ╔═╗', '  [O]', '╱▎▏╲', '  ✦⚔  '],
      ['  ╔═╗', '  [O]', ' ╱▎▏╲', '  ⚔✦ '],
    ],
    // 冷笑变体
    cold: {
      ascii: [
        '  ╔═╗',
        '  [¬]',
        ' ╱▎▏╲',
        '  ⚔⚔',
      ],
      frames: [
        ['  ╔═╗', '  [¬]', ' ╱▎▏╲', '  ⚔⚔'],
        ['  ╔═╗', '  [¬]', ' ╱▎▏╲', ' ⚔⚔⚔'],
        ['  ╔═╗', '  [¬]', '╱▎▏╲', '  ⚔⚔'],
        ['  ╔═╗', '  [¬]', ' ╱▎▏╲', ' ⚔✦⚔'],
      ],
    },
  },

  // ── 无尘道长：叛徒道人 · 暗影游动 ──
  '无尘道长': {
    color: '#c89060',
    effect: 'sg-portrait-shadow',
    ascii: [
      '  ☯☯☯',
      '  (⊙)',
      ' ╭─╮',
      ' ╰🗡╯',
    ],
    frames: [
      ['  ☯☯☯', '  (⊙)', ' ╭─╮', ' ╰🗡╯'],
      ['  ☯☯☯', '  (⊙)', '╭─╮', ' ╰🗡╯'],
      ['  ☯☯☯', '  (⊙)', ' ╭─╮', '╰🗡╯'],
      ['  ☯☯☯', '  (⊙)', '╭─╮ ', ' ╰🗡╯'],
    ],
    // 苦笑变体
    bitter: {
      ascii: [
        '  ☯☯☯',
        '  (◡_◡)',
        ' ╭─╮',
        ' ╰🗡╯',
      ],
      frames: [
        ['  ☯☯☯', '  (◡_◡)', ' ╭─╮', ' ╰🗡╯'],
        ['  ☯☯☯', ' (◡·_◡)', ' ╭─╮', ' ╰🗡╯'],
        ['  ☯☯☯', '  (◡_◡)', '╭─╮', ' ╰🗡╯'],
        ['  ☯☯☯', '  (◡_◡)', ' ╭─╮', '╰🗡╯'],
      ],
    },
  },

  // ── 白眉毒手：凶恶掮客 · 毒雾弥漫 ──
  '白眉毒手': {
    color: '#c89060',
    effect: 'sg-portrait-poison',
    ascii: [
      '  ∧∧∧',
      ' (◕_◕)',
      ' ┤▓▓├',
      '  ▓▓ ',
    ],
    frames: [
      ['  ∧∧∧', ' (◕_◕)', ' ┤▓▓├', '  ▓▓ '],
      [' ∧∧∧ ', ' (◕_◕)', '┤▓▓├', ' ▓▓ ▓'],
      ['  ∧∧∧', ' (◕_◕)', ' ┤▓▓├', '  ▓▓ '],
      [' ∧∧∧∧', ' (◕_◕)', '┤▓▓├', ' ▓ ▓▓'],
    ],
  },

  // ── 血骨门众：黑袍骷髅 · 煞气翻涌 ──
  '血骨门': {
    color: '#c06060',
    effect: 'sg-portrait-evil',
    ascii: [
      '  ▓▓▓',
      '  (☠)',
      '  ▓▓▓',
      '  ▓▓▓',
    ],
    frames: [
      ['  ▓▓▓', '  (☠)', '  ▓▓▓', '  ▓▓▓'],
      ['▓▓▓▓▓', '  (☠)', '▓▓▓▓▓', '▓▓▓▓▓'],
      ['  ▓▓▓', '  (☠)', '  ▓▓▓', '  ▓▓▓'],
      ['▓▓▓▓▓', '  (☠)', '▓▓▓▓▓', '  ▓▓▓'],
    ],
  },
};

/**
 * 根据说话人名获取角色立绘
 * @param {string} speaker - 说话人全名（如"鹤隐"、"骨冥子（冷笑）"）
 * @returns {{ color: string, ascii: string[], frames?: string[][], effect?: string } | null}
 */
function getStoryCharPortrait(speaker) {
  if (!speaker) return null;
  // 匹配逻辑：遍历映射表 key，取最长匹配
  let best = null;
  let bestLen = 0;
  for (const key of Object.keys(STORY_CHAR_PORTRAITS)) {
    if (speaker.startsWith(key) && key.length > bestLen) {
      bestLen = key.length;
      best = STORY_CHAR_PORTRAITS[key];
    }
  }
  if (!best) return null;

  // 检查是否有特殊变体
  const variant = speaker.slice(bestLen).replace(/[（()）/）]/g, '').trim();
  const variantMap = {
    '传书': 'letter',
    '心中': 'inner',
    '低语': 'stern',
    '喝道': null,
    '沉声': 'stern',
    '冷笑': 'cold',
    '颤声': 'bitter',
    '苦笑': 'bitter',
  };
  const vKey = variantMap[variant];
  const src = (vKey && best[vKey]) ? best[vKey] : best;
  return {
    color: best.color,
    ascii: src.ascii,
    frames: src.frames || best.frames || null,
    effect: src.effect || best.effect || null,
  };
}

const STORY_BEATS = {

  // ══════════════════════════════════════════════════════
  // 第一章 · 血雨腥风
  // ══════════════════════════════════════════════════════

  b1_1: {
    id: 'b1_1', chapter: 'ch1',
    title: '神秘来信',
    mood: 'mystery',   // mystery | tense | solemn | battle | dark | warm | triumph | epilogue
    narrative: '一封洛阳来的密信，打破了江湖的宁静。信上只有八个字——\n\n"血骨门复出，速来。"',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '你收到了一封火漆封印的密信，火漆印记是一只展翅白鹤——江湖人称"鹤隐"的标志。' },
      { speaker: '旁白', avatar: '📜', text: '信纸泛黄，墨迹苍劲，短短八字，却重如千斤：\n\n"血骨门复出，速来。"' },
      { speaker: '旁白', avatar: '📜', text: '血骨门……那是二十年前令整个中原江湖谈之色变的魔门。据说已被六大正道门派联手剿灭。\n\n如今，它真的又回来了？' },
      { speaker: '你（心中）', avatar: '🧍', text: '鹤隐前辈……他是谁？为什么会找上我？\n\n不管如何，洛阳，必须走一趟。' },
    ],
    hint: '前往洛阳城',
    type: 'travel', target: '洛阳',
    nextBeat: 'b1_2', nextChapter: null,
  },

  b1_2: {
    id: 'b1_2', chapter: 'ch1',
    title: '初遇鹤隐',
    mood: 'solemn',
    narrative: '洛阳客栈二楼，一位鹤发童颜的老者独坐窗边，茶杯在他手中纹丝不动，目光却如刀锋般扫过你。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '客栈二楼的雅室内，老人独自而坐。窗外洛阳街市喧嚣，他却像是与那繁华隔绝在另一个世界。' },
      { speaker: '鹤隐', avatar: '🧓', text: '你来了。\n\n坐下，我不喜欢说话时有人站着。' },
      { speaker: '你', avatar: '🧍', text: '鹤隐前辈，您的信——血骨门真的复出了？' },
      { speaker: '鹤隐', avatar: '🧓', text: '……不只是复出。\n\n二十年前，那一战，我们以为彻底斩草除根。但骨冥子没死，他只是在蛰伏。\n\n如今，他联合了玄冥教和日月神教，要找一件东西。' },
      { speaker: '你', avatar: '🧍', text: '什么东西？' },
      { speaker: '鹤隐', avatar: '🧓', text: '玄铁令。\n\n此事说来话长。你先替我做一件事——沧州城外，有血骨门一处秘密据点，我需要知道他们在那里到底藏着什么。' },
      { speaker: '你（心中）', avatar: '🧍', text: '这个老人，话不多，却句句像是掷地有声。我说不清为什么，但我信他。' },
    ],
    hint: '与鹤隐对话',
    type: 'talk', target: '鹤隐',
    nextBeat: 'b1_3', nextChapter: null,
  },

  b1_3: {
    id: 'b1_3', chapter: 'ch1',
    title: '沧州暗查',
    mood: 'tense',
    narrative: '沧州城外，山谷深处——血骨门的一处秘密据点藏在这里，守卫森严，杀气弥漫。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '沧州城外十里，一处废弃的山寨内，灯火幽幽，隐约可见身着黑袍之人来来往往。' },
      { speaker: '旁白', avatar: '📜', text: '骨门弟子的标志——左胸处绣着一枚白骨骷髅。\n\n你屏住呼吸，悄然靠近……' },
      { speaker: '血骨门哨兵（低语）', avatar: '☠️', text: '……三天后，玄铁令第一块碎片就要在开封城黑市上流转，门主已经派人去截了……' },
      { speaker: '旁白', avatar: '📜', text: '你在据点内找到了一份帛书，上面记录着血骨门各地联络点，以及一个名字——\n\n"南宫烈"。' },
      { speaker: '你（心中）', avatar: '🧍', text: '南宫家……扬州最大的武器世家。他们跟血骨门有勾连？\n\n这份帛书，得带回去给鹤隐前辈看。' },
    ],
    hint: '进入沧州血骨门据点',
    type: 'dungeon', target: '沧州血骨门据点',
    nextBeat: 'b1_4', nextChapter: null,
  },

  b1_4: {
    id: 'b1_4', chapter: 'ch1',
    title: '回报鹤隐',
    mood: 'solemn',
    narrative: '你将帛书和监听到的情报带回洛阳。鹤隐展开帛书，沉默良久，那双深邃的眼中，第一次出现了一丝不安。',
    dialogues: [
      { speaker: '你', avatar: '🧍', text: '鹤隐前辈，据点里的人说——玄铁令第一块碎片要在开封黑市流转，而且……我找到了这个。' },
      { speaker: '鹤隐', avatar: '🧓', text: '……南宫烈。\n\n（长久的沉默）\n\n我早该想到的。他是血骨门二十年前埋下的暗棋。' },
      { speaker: '你', avatar: '🧍', text: '玄铁令到底是什么？为什么所有人都想要它？' },
      { speaker: '鹤隐', avatar: '🧓', text: '玄铁令，共三块，由上古战神铸于天外陨铁之上。相传集齐三块者，可得天下兵器认主，武功倍增十倍。\n\n这是传说——也是骨冥子真正想要的力量。' },
      { speaker: '鹤隐', avatar: '🧓', text: '好孩子，你做到了第一步。\n\n但接下来的路，才是真正的险途。' },
    ],
    hint: '返回洛阳向鹤隐汇报',
    type: 'talk', target: '鹤隐',
    nextBeat: null, nextChapter: 'ch2',
  },

  // ══════════════════════════════════════════════════════
  // 第二章 · 玄铁迷踪
  // ══════════════════════════════════════════════════════

  b2_1: {
    id: 'b2_1', chapter: 'ch2',
    title: '追踪碎片',
    mood: 'mystery',
    narrative: '玄铁令第一块碎片正在开封黑市流转——你必须赶在血骨门之前夺得它。',
    dialogues: [
      { speaker: '鹤隐', avatar: '🧓', text: '开封黑市，三天后的午夜。碎片的持有者是个叫"白眉毒手"的江湖掮客。\n\n你去，拿到碎片。不管用什么方法。' },
      { speaker: '你', avatar: '🧍', text: '血骨门的人呢？' },
      { speaker: '鹤隐', avatar: '🧓', text: '他们会去。你得比他们快。\n\n记住——那块碎片绝不能落入骨冥子手中。一旦三块合一……江湖将永无宁日。' },
      { speaker: '旁白', avatar: '📜', text: '开封城，繁华之下暗流涌动。黑市的入口隐藏在运河边一座破旧的茶楼地下……' },
    ],
    hint: '前往开封',
    type: 'travel', target: '开封',
    nextBeat: 'b2_2', nextChapter: null,
  },

  b2_2: {
    id: 'b2_2', chapter: 'ch2',
    title: '开封黑市',
    mood: 'tense',
    narrative: '地下黑市灯火昏黄，各色人等混杂其中，血腥气与铜臭气交织。你摸清了"白眉毒手"的位置——但血骨门的人，也到了。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '地下市集内，各种违禁器械、禁书秘籍明码标价。角落里，一个满脸横肉、眉毛雪白的中年男子正把玩着一块乌黑的铁片。' },
      { speaker: '白眉毒手', avatar: '🧔', text: '嘿，又来买家了？这块玄铁，价高者得——哈哈哈……' },
      { speaker: '旁白', avatar: '📜', text: '话音未落，黑市大门被踢开，几名身着黑袍、骷髅印记的血骨门弟子鱼贯而入。' },
      { speaker: '血骨门弟子（喝道）', avatar: '☠️', text: '所有人趴下！玄铁令碎片，交出来！' },
      { speaker: '你（心中）', avatar: '🧍', text: '来不及了，只能硬闯——' },
    ],
    hint: '进入开封黑市',
    type: 'dungeon', target: '开封黑市',
    nextBeat: 'b2_3', nextChapter: null,
  },

  b2_3: {
    id: 'b2_3', chapter: 'ch2',
    title: '扬州暗局',
    mood: 'dark',
    narrative: '第二块碎片在扬州——南宫家的手中。但南宫家与血骨门的关系，远比你想象得更深。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '扬州，南宫家宅邸。\n\n表面上，这是江南最大的武器铸造世家；但在高墙之后，另一副面孔正在显现。' },
      { speaker: '鹤隐（传书）', avatar: '🧓', text: '南宫烈与骨冥子有二十年的旧约。南宫家暗地里一直是血骨门的军械供应者。\n\n第二块碎片就在南宫家密库。小心——里面的人，不全是人。' },
      { speaker: '你（心中）', avatar: '🧍', text: '"不全是人"……这话什么意思？\n\n进去就知道了。' },
      { speaker: '旁白', avatar: '📜', text: '南宫家密库深处，阴气弥漫，除了大批练入邪功的血骨门死士，还有一些……更诡异的存在。' },
    ],
    hint: '进入扬州南宫世家',
    type: 'dungeon', target: '扬州南宫世家',
    nextBeat: 'b2_4', nextChapter: null,
  },

  b2_4: {
    id: 'b2_4', chapter: 'ch2',
    title: '凉州风沙',
    mood: 'tense',
    narrative: '最后一块碎片，在凉州大漠深处的一处古遗迹中。沙暴遮天蔽日，血骨门的精锐已经出发。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '凉州，烟尘滚滚。大漠之中，一处千年前的武者遗迹埋藏着第三块玄铁令碎片。' },
      { speaker: '鹤隐（传书）', avatar: '🧓', text: '骨冥子亲自派出了"七煞"中的两位坐镇。此去凶险万分。\n\n若实在不敌，宁可毁了碎片，也不能让他们得手。' },
      { speaker: '你', avatar: '🧍', text: '明白。' },
      { speaker: '旁白', avatar: '📜', text: '黄沙漫天，遗迹入口处竖着两根白骨堆成的柱子——那是血骨门的警告，也是他们的傲慢。\n\n你深吸一口气，踏入其中。' },
    ],
    hint: '进入凉州沙漠',
    type: 'dungeon', target: '凉州沙漠',
    nextBeat: 'b2_5', nextChapter: null,
  },

  b2_5: {
    id: 'b2_5', chapter: 'ch2',
    title: '碎片齐聚',
    mood: 'solemn',
    narrative: '三块碎片落入手中。回到洛阳，鹤隐将它们轻轻拼合——刹那间，一股难以言喻的气息弥漫开来。',
    dialogues: [
      { speaker: '鹤隐', avatar: '🧓', text: '……都拿到了。\n\n（他将三块碎片在桌上拼合，一声轻响，原本锈迹斑斑的碎片竟然无缝合一）\n\n好……这就是玄铁令的真面目。' },
      { speaker: '你', avatar: '🧍', text: '它……发光了。' },
      { speaker: '鹤隐', avatar: '🧓', text: '玄铁令会感应持有者的武学修为。你摸一下。' },
      { speaker: '旁白', avatar: '📜', text: '你伸手触碰，指尖传来一阵灼热，随即是无尽的平静。仿佛千百位武者的意志在一瞬间流过。' },
      { speaker: '鹤隐', avatar: '🧓', text: '现在你知道骨冥子为何不惜一切了。\n\n但问题是——玄铁令不能消毁，只能藏。而骨冥子已经嗅到了我们的气息。\n\n必须联合正道各派，彻底将他们覆灭。' },
    ],
    hint: '返回洛阳找鹤隐',
    type: 'talk', target: '鹤隐',
    nextBeat: null, nextChapter: 'ch3',
  },

  // ══════════════════════════════════════════════════════
  // 第三章 · 正道会盟
  // ══════════════════════════════════════════════════════

  b3_1: {
    id: 'b3_1', chapter: 'ch3',
    title: '三魔密约',
    mood: 'dark',
    narrative: '血骨门、玄冥教、日月神教——三大邪魔势力秘密结盟，正道各派腹背受敌。只有联合，才有胜算。',
    dialogues: [
      { speaker: '鹤隐', avatar: '🧓', text: '我截到了一份密报。骨冥子与玄冥教主、日月神教圣女，在半个月前于燕山密谈，正式结盟。\n\n他们称之为——"三魔盟约"。' },
      { speaker: '你', avatar: '🧍', text: '三家联手……正道各派能应付吗？' },
      { speaker: '鹤隐', avatar: '🧓', text: '单打独斗，没有一家能赢。但若能以少林为首，召集武当、华山、昆仑等各派共同出兵，未必没有胜算。\n\n我已经向少林方丈修书，他同意在嵩山少林寺举行会盟。\n\n你去，代表我出席，说服各派掌门。' },
      { speaker: '你（心中）', avatar: '🧍', text: '这个老人，从来不亲自出面。他到底是什么人……\n\n但此刻，这不重要。' },
    ],
    hint: '前往少林寺',
    type: 'travel', target: '少林',
    nextBeat: 'b3_2', nextChapter: null,
  },

  b3_2: {
    id: 'b3_2', chapter: 'ch3',
    title: '少林会盟',
    mood: 'solemn',
    narrative: '少林寺大雄宝殿，晨钟未歇，各派掌门已齐聚于此。气氛凝重，暗流涌动——并非所有人都愿意同舟共济。',
    dialogues: [
      { speaker: '少林方丈', avatar: '🙏', text: '诸位同道，三魔结盟，乃百年未有之大患。老衲已请得鹤隐先生遣此位年轻侠士前来，将形势如实相告。' },
      { speaker: '华山掌门（冷笑）', avatar: '⚔️', text: '老方丈，鹤隐此人神龙见首不见尾，他说的话，当真能信？' },
      { speaker: '你', avatar: '🧍', text: '三块玄铁令碎片，此刻就在我这里。三魔结盟的密约抄本，我也有一份。\n\n华山掌门若有疑虑，可以亲眼看。' },
      { speaker: '旁白', avatar: '📜', text: '大殿内沉默片刻，随后是窃窃私语。那份密约让所有人的神色都变了。' },
      { speaker: '少林方丈', avatar: '🙏', text: '好。既然铁证如山，诸位——可愿与我少林，共击三魔？' },
      { speaker: '旁白', avatar: '📜', text: '一片静默。\n\n然后，武当掌门起身，拱手一揖。其余各派，也陆续起身……' },
    ],
    hint: '与少林方丈对话',
    type: 'talk', target: '少林方丈',
    nextBeat: 'b3_3', nextChapter: null,
  },

  b3_3: {
    id: 'b3_3', chapter: 'ch3',
    title: '内鬼浮现',
    mood: 'dark',
    narrative: '会盟当夜，少林达摩院遭人潜入，多处机密文书被盗。内鬼就在各派代表之中——你必须揪出他。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '会盟刚定，子夜时分，少林达摩院突然传来惊呼。一名武僧倒在血泊中，多份要机密的联络名单不见踪影。' },
      { speaker: '少林方丈（沉声）', avatar: '🙏', text: '……贼人潜入了达摩院。那份名单若落入三魔之手，各派卧底将全数暴露。\n\n老衲请你去查——我们内部，有人通敌。' },
      { speaker: '你（心中）', avatar: '🧍', text: '会盟刚结成，就出了内鬼。\n\n骨冥子的人，已经埋进正道各派了。' },
      { speaker: '旁白', avatar: '📜', text: '少林寺内，处处灯影摇曳，却暗藏刀光。\n\n内鬼，就在你身边某处。' },
    ],
    hint: '调查内鬼',
    type: 'dungeon', target: '少林内鬼',
    nextBeat: 'b3_4', nextChapter: null,
  },

  b3_4: {
    id: 'b3_4', chapter: 'ch3',
    title: '真相大白',
    mood: 'solemn',
    narrative: '内鬼被揭穿——竟是武当派的无尘道长，已潜伏多年的血骨门暗棋。真相令所有人震惊，却也让正道联盟更加团结。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '当证据摆在面前，无尘道长的神色僵住了。片刻后，他苦笑一声：' },
      { speaker: '无尘道长（苦笑）', avatar: '🗡️', text: '……我以为我能瞒过所有人。\n\n二十年了。骨冥子救了我的命，我也还了他二十年。这笔账，算清了。' },
      { speaker: '武当掌门（颤声）', avatar: '⛰️', text: '无尘……我真没想到……' },
      { speaker: '少林方丈', avatar: '🙏', text: '阿弥陀佛。\n\n（对你）这份心意，老衲记下了。\n\n正道联盟，今日真正成立。各派同心，方能破此劫难。' },
      { speaker: '你（心中）', avatar: '🧍', text: '骨冥子在江湖中埋下了多少枚棋子……\n\n而我，也不过是另一枚棋——只是，我选择了自己落下的位置。' },
    ],
    hint: '内鬼已除，前往嵩山少林寺',
    type: 'travel', target: '少林',
    nextBeat: null, nextChapter: 'ch4',
  },

  // ══════════════════════════════════════════════════════
  // 第四章 · 孤身潜入
  // ══════════════════════════════════════════════════════

  b4_1: {
    id: 'b4_1', chapter: 'ch4',
    title: '孤身深入',
    mood: 'tense',
    narrative: '正道联盟已成，但骨冥子的主力还在暗处。鹤隐传来密令：幽州，有血骨门最大的秘密。',
    dialogues: [
      { speaker: '鹤隐（传书）', avatar: '🧓', text: '正道联盟虽成，但若贸然出兵，只怕三魔联盟以逸待劳，正道反损兵折将。\n\n我需要你先去幽州，摸清骨冥子的最终部署。一个人去，悄无声息。' },
      { speaker: '你', avatar: '🧍', text: '一个人……' },
      { speaker: '鹤隐（传书）', avatar: '🧓', text: '你有这个能耐。\n\n幽州城外，有血骨门最大的一处中转据点。三魔联盟最终行动的密约，就藏在那里。' },
      { speaker: '旁白', avatar: '📜', text: '幽州，天下险地之一。\n\n而你，要一个人踏进那片虎狼之地。' },
    ],
    hint: '前往幽州',
    type: 'travel', target: '幽州',
    nextBeat: 'b4_2', nextChapter: null,
  },

  b4_2: {
    id: 'b4_2', chapter: 'ch4',
    title: '虎穴深处',
    mood: 'dark',
    narrative: '幽州郊外的山谷中，血骨门据点戒备森严，三步一岗，五步一哨。但越是重兵把守，越说明其中藏着要命的秘密。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '夜色如墨，幽州城外的山谷中火把林立。巡逻的血骨门弟子个个修为不低，眼神警觉。' },
      { speaker: '旁白', avatar: '📜', text: '你潜入据点深处，踏过层层封锁，终于在一间石室内发现了——' },
      { speaker: '旁白', avatar: '📜', text: '一张羊皮地图，上面标注着正道各派所有要害：少林粮道、武当水源、华山通道……\n\n以及一个日期，墨迹鲜红，触目惊心：\n\n"七日后，总攻。"' },
      { speaker: '你（心中）', avatar: '🧍', text: '七天……\n\n时间不多了。' },
    ],
    hint: '进入幽州据点',
    type: 'dungeon', target: '幽州据点',
    nextBeat: 'b4_3', nextChapter: null,
  },

  b4_3: {
    id: 'b4_3', chapter: 'ch4',
    title: '铁证在手',
    mood: 'tense',
    narrative: '密约和地图到手，但撤退的路已被切断。你必须强行突围，带着这份可以扭转战局的证据，回到武当。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '警报声响彻山谷，血骨门弟子四面合围。\n\n你握紧那份密约，屏住呼吸——' },
      { speaker: '旁白', avatar: '📜', text: '杀出去。' },
      { speaker: '旁白', avatar: '📜', text: '一路拼杀，遍体鳞伤，终于甩开追兵，奔上武当山方向的官道。\n\n怀中那份密约，安然无恙。' },
      { speaker: '你（心中）', avatar: '🧍', text: '七天。\n\n只有七天了，必须让所有人知道。' },
    ],
    hint: '带密约返回武当',
    type: 'travel', target: '武当',
    nextBeat: 'b4_4', nextChapter: null,
  },

  b4_4: {
    id: 'b4_4', chapter: 'ch4',
    title: '倒计时开始',
    mood: 'solemn',
    narrative: '武当山，武当掌门展开密约，沉默良久。七天——留给正道联盟备战的，只有七天。',
    dialogues: [
      { speaker: '武当掌门', avatar: '⛰️', text: '……七日后总攻。\n\n（他抬起头，眼中有悲有怒）\n\n你是怎么出来的？' },
      { speaker: '你', avatar: '🧍', text: '靠腿。' },
      { speaker: '武当掌门（苦笑）', avatar: '⛰️', text: '好孩子。\n\n这份密约，老道我会在今夜连夜飞鸽传书各派掌门。正道联盟，要先发制人——不能等到第七天。' },
      { speaker: '你', avatar: '🧍', text: '骨冥子在哪？' },
      { speaker: '武当掌门', avatar: '⛰️', text: '沧州，血骨门总坛。\n\n他一直在那里。等待着他认为万无一失的那一刻。' },
      { speaker: '你（心中）', avatar: '🧍', text: '沧州。\n\n兜兜转转，终究还是要回到那里——只是这次，是去终结这一切。' },
    ],
    hint: '与武当掌门对话',
    type: 'talk', target: '武当掌门',
    nextBeat: null, nextChapter: 'ch5',
  },

  // ══════════════════════════════════════════════════════
  // 第五章 · 决战血骨门
  // ══════════════════════════════════════════════════════

  b5_1: {
    id: 'b5_1', chapter: 'ch5',
    title: '兵临城下',
    mood: 'battle',
    narrative: '正道联盟的旗帜飘扬在沧州城外。骨冥子提前察觉，已将所有力量收缩回总坛。决战，就在此刻。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '沧州平野之上，正道联盟六大门派的旗帜迎风展开。\n\n这是二十年来，中原武林前所未有的团结。' },
      { speaker: '少林方丈', avatar: '🙏', text: '骨冥子已退守总坛，命玄冥教和日月神教殿后。\n\n此战，各派轮番攻入，但总坛核心，需要一人独自深入，直取骨冥子。' },
      { speaker: '旁白', avatar: '📜', text: '所有目光，都落在了你的身上。' },
      { speaker: '你', avatar: '🧍', text: '……我去。' },
      { speaker: '少林方丈', avatar: '🙏', text: '阿弥陀佛。\n\n去吧，孩子。我们在外面替你拖住其余人。' },
    ],
    hint: '前往沧州',
    type: 'travel', target: '沧州',
    nextBeat: 'b5_2', nextChapter: null,
  },

  b5_2: {
    id: 'b5_2', chapter: 'ch5',
    title: '总坛攻略',
    mood: 'battle',
    narrative: '血骨门总坛，一处建在悬崖峭壁间的要塞。正道联盟的先锋已与外围敌军交战，你需要从侧翼突破，杀入核心。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '总坛外城，厮杀声震天。\n\n你从侧翼的暗道切入，一路砍翻守门弟子，向内层深入。' },
      { speaker: '旁白', avatar: '📜', text: '每进一步，守卫就强一分。走廊两侧，是一排排骷髅装饰，无声诉说着血骨门的残忍。' },
      { speaker: '旁白', avatar: '📜', text: '你杀穿外坛，来到内坛入口。\n\n一块黑色石碑刻着四个字：\n\n"来者，死地。"' },
      { speaker: '你（心中）', avatar: '🧍', text: '……那就进去。' },
    ],
    hint: '进入血骨门总坛',
    type: 'dungeon', target: '血骨门总坛',
    nextBeat: 'b5_3', nextChapter: null,
  },

  b5_3: {
    id: 'b5_3', chapter: 'ch5',
    title: '七煞当道',
    mood: 'battle',
    narrative: '内坛七名"七煞"守将轮番阻截，每一位都是独当一面的顶尖高手。你杀穿重重阻碍，鲜血浸透衣衫，终于踏入骨冥子的大殿。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '七煞，是骨冥子亲自调教的七名顶级杀手，个个修炼着以伤换伤的血骨神功。' },
      { speaker: '旁白', avatar: '📜', text: '你一路过关斩将，身上的伤口不断增加，但脚步从未停下。' },
      { speaker: '旁白', avatar: '📜', text: '最后一名七煞倒下时，一片沉寂。\n\n前方，是一扇镶嵌着无数骸骨的巨大石门。' },
      { speaker: '旁白', avatar: '📜', text: '门后，有人在笑。\n\n那笑声，低沉而悠远，仿佛早已等候多时：\n\n"……终于来了。"' },
    ],
    hint: '深入血骨门总坛',
    type: 'dungeon', target: '血骨门总坛深处',
    nextBeat: 'b5_4', nextChapter: null,
  },

  b5_4: {
    id: 'b5_4', chapter: 'ch5',
    title: '决战骨冥子',
    mood: 'battle',
    narrative: '骨冥子——那个操纵了整个阴谋、潜伏了二十年的男人，终于出现在你眼前。他手持玄铁令残片，散发着让人窒息的煞气。',
    dialogues: [
      { speaker: '骨冥子', avatar: '💀', text: '……很好。你比我预想中更出色。\n\n鹤隐挑了一枚好棋。' },
      { speaker: '你', avatar: '🧍', text: '还我玄铁令。今日，血骨门，灭。' },
      { speaker: '骨冥子（冷笑）', avatar: '💀', text: '灭？\n\n孩子，你以为你赢了，但你不知道——我才是那枚真正的棋，而下棋的人……并不是鹤隐。' },
      { speaker: '你（心中）', avatar: '🧍', text: '他在说什么……？\n\n不，先把他打倒，再问。' },
      { speaker: '旁白', avatar: '📜', text: '骨冥子双掌一合，黑色的煞气如海潮涌来。\n\n你深吸一口气，全力以赴——' },
    ],
    hint: '击败骨冥子',
    type: 'boss', target: '骨冥子',
    nextBeat: null, nextChapter: 'ch6',
  },

  // ══════════════════════════════════════════════════════
  // 第六章 · 江湖新序
  // ══════════════════════════════════════════════════════

  b6_1: {
    id: 'b6_1', chapter: 'ch6',
    title: '风雨之后',
    mood: 'warm',
    narrative: '骨冥子倒下了。血骨门的旗帜从总坛上坠落，正道联盟的欢呼声响彻沧州平野。\n\n但骨冥子临死前说的那句话，像根刺，扎在你心底。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '总坛外，正道联盟将士高呼胜利。\n\n血骨门群龙无首，玄冥教和日月神教见势不妙，纷纷撤退。三魔联盟，就此瓦解。' },
      { speaker: '你（心中）', avatar: '🧍', text: '……赢了。\n\n但骨冥子那句话："下棋的人，并不是鹤隐。"\n\n这是什么意思？' },
      { speaker: '旁白', avatar: '📜', text: '你站在总坛废墟之上，望着渐渐亮起的晨光，心中有一种说不清的感觉——\n\n这场棋局，远没有结束。' },
    ],
    hint: '返回洛阳',
    type: 'travel', target: '洛阳',
    nextBeat: 'b6_2', nextChapter: null,
  },

  b6_2: {
    id: 'b6_2', chapter: 'ch6',
    title: '庆功夜宴',
    mood: 'warm',
    narrative: '洛阳城中，万家灯火，庆功宴席摆满了街头。百姓们不知道这场胜利背后有多少血，只知道江湖，又太平了。',
    dialogues: [
      { speaker: '旁白', avatar: '📜', text: '洛阳城张灯结彩，鞭炮声不断。\n\n各大门派掌门齐聚宴席，言笑晏晏。少林方丈亲自举杯，为所有在此役中浴血之人祝酒。' },
      { speaker: '少林方丈', avatar: '🙏', text: '此战告捷，首功在于此位年轻侠士！\n\n（对你）老衲未问过你的名字，今日当着天下武林之面——你愿受老衲一拜吗？' },
      { speaker: '旁白', avatar: '📜', text: '大殿内，一片寂静。\n\n所有人看向你，等待你的回答。' },
      { speaker: '你（心中）', avatar: '🧍', text: '喧嚣中，我却觉得心里有什么空落落的。\n\n骨冥子说的那句话，一直还在脑子里绕。' },
    ],
    hint: '参加庆功宴',
    type: 'narrate', target: null,
    nextBeat: 'b6_3', nextChapter: null,
  },

  b6_3: {
    id: 'b6_3', chapter: 'ch6',
    title: '鹤隐的告别',
    mood: 'epilogue',
    narrative: '宴后三更，鹤隐将你拉到城外，背对着洛阳灯火，他开口说出了一句你从未料到的话。',
    dialogues: [
      { speaker: '鹤隐', avatar: '🧓', text: '好孩子……做得很好。\n\n但有一件事，我该早些告诉你了。' },
      { speaker: '你', avatar: '🧍', text: '骨冥子说，真正下棋的人不是你。\n\n那是什么意思？' },
      { speaker: '鹤隐', avatar: '🧓', text: '……（长久的沉默）\n\n他说的，是真的。' },
      { speaker: '你', avatar: '🧍', text: '什么？' },
      { speaker: '鹤隐', avatar: '🧓', text: '骨冥子是棋子，我是棋子，你也是棋子。\n\n真正想要玄铁令的人，在北疆。他布下这盘局，已经不止二十年了。' },
      { speaker: '你（心中）', avatar: '🧍', text: '……北疆。\n\n从来没有人对我提过北疆。' },
    ],
    hint: '与鹤隐道别',
    type: 'talk', target: '鹤隐',
    nextBeat: 'b6_4', nextChapter: null,
  },

  b6_4: {
    id: 'b6_4', chapter: 'ch6',
    title: '新的征途',
    mood: 'epilogue',
    narrative: '"真正的幕后黑手，在北疆。"\n\n鹤隐的身影消失在夜色里。洛阳城的灯火依旧灿烂，但你知道——江湖的故事，才刚刚开始。',
    dialogues: [
      { speaker: '鹤隐', avatar: '🧓', text: '北疆的局，比这场更深，更险。\n\n你愿意继续走下去吗？' },
      { speaker: '你', avatar: '🧍', text: '……我已经走到这里了。' },
      { speaker: '鹤隐', avatar: '🧓', text: '（微微一笑）\n\n好。\n\n那就去吧。北疆，有人在等你。' },
      { speaker: '旁白', avatar: '📜', text: '鹤隐的身影渐渐消失在夜色之中，只剩下满天星斗，和那永不平静的江湖。\n\n你转身，望向北方。' },
      { speaker: '旁白', avatar: '📜', text: '江湖路远，刀剑无情。\n\n但你走过了血与火，你知道——你不是一个人在这条路上。\n\n【第一卷 · 终】' },
    ],
    hint: '新的冒险即将开始……',
    type: 'narrate', target: null,
    nextBeat: null, nextChapter: null,
  },
};


// ═══════════════════════════════════════════════════════════════════════════
// 纯叙事指引管理器
// ═══════════════════════════════════════════════════════════════════════════

const StoryGuide = {

  // 独立存储键（与所有游戏系统完全隔离）
  STORAGE_KEY: 'wuxia_story_guide',

  // 内部状态
  state: null,

  // 轮询定时器
  _pollTimer: null,

  // 当前显示的指引卡
  _cardEl: null,
  _cardTimer: null,

  // ══════════════════════════════════════════════════════
  // 生命周期（手动调用，不自动）
  // ══════════════════════════════════════════════════════

  /**
   * 初始化：加载状态，创建UI
   */
  init() {
    this._load();
    this._buildStyles();
    this._render();
    console.log('[StoryGuide] 初始化完成');
    return this;
  },

  /**
   * 开始指引：启动轮询 + 显示指引卡
   */
  start() {
    // 防御：确保 state 已初始化（若 start 在 init 前被调用）
    if (!this.state) this._load();
    this.stop();
    // 每8秒轮询一次
    this._pollTimer = setInterval(() => this._poll(), 8000);

    // 首次开始（站在第一个节点且从未显示过序章）时，先播放序章过场
    const isFirstStart = (this.state.currentBeat === 'b1_1' && !this.state.introDone);
    if (isFirstStart && typeof StoryCS !== 'undefined' && typeof CUTSCENE_TRIGGERS !== 'undefined') {
      const t = CUTSCENE_TRIGGERS['game_start'];
      if (t) {
        this.state.introDone = true;
        this._save();
        StoryCS.play(t.csId, () => {
          this._poll();
          console.log('[StoryGuide] 序章过场结束，指引启动');
        }, t.flash);
        console.log('[StoryGuide] 指引已启动（序章过场中）');
        return this;
      }
    }

    // 立即执行一次
    this._poll();
    console.log('[StoryGuide] 指引已启动');
    return this;
  },

  /**
   * 暂停指引（不销毁状态，不隐藏卡片）
   */
  stop() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  },

  /**
   * 重置：从第一章重新开始
   */
  reset() {
    this.stop();
    localStorage.removeItem(this.STORAGE_KEY);
    this._initState();
    this._save();
    this._render();
    this.start();
  },

  // ══════════════════════════════════════════════════════
  // 状态管理（独立 localStorage）
  // ══════════════════════════════════════════════════════

  _load() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        this.state = JSON.parse(raw);
        // 数据校验：确保当前节点存在
        if (!STORY_BEATS[this.state.currentBeat]) {
          this._initState();
        }
      } catch(e) {
        this._initState();
      }
    } else {
      this._initState();
    }
  },

  _initState() {
    this.state = {
      currentBeat: 'b1_1',    // 当前叙事节点ID
      narrativeShown: false,  // 当前节点叙述文字是否已显示过
    };
    this._save();
  },

  _save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch(e) {}
  },

  // ══════════════════════════════════════════════════════
  // 查询接口
  // ══════════════════════════════════════════════════════

  /** 获取当前叙事节点 */
  current() {
    if (!this.state) return null;
    return STORY_BEATS[this.state.currentBeat] || null;
  },

  /** 获取当前章节 */
  currentChapter() {
    const beat = this.current();
    if (!beat) return null;
    return STORY_CHAPTERS[beat.chapter] || null;
  },

  /** 获取当前进度描述 */
  progress() {
    const beat = this.current();
    if (!beat) return '故事已完结';
    const ch = this.currentChapter();
    const chBeats = ch ? ch.beats : [];
    const idx = chBeats.indexOf(beat.id);
    return `${ch ? ch.title : ''} · 第${idx + 1}幕（共${chBeats.length}幕）`;
  },

  /** 获取当前指引（hint） */
  hint() {
    const beat = this.current();
    return beat ? beat.hint : null;
  },

  // ══════════════════════════════════════════════════════
  // 轮询核心（每8秒自动调用）
  // ══════════════════════════════════════════════════════

  _poll() {
    const beat = this.current();
    if (!beat) return;

    // narrate 类型：自动推进（叙述节点）
    if (beat.type === 'narrate') {
      // 叙述节点：到达城市或对话后自动显示一段话，然后推进
      const city = this._getCurrentCity();
      if (city && this._cityMatches(city, this._narrateTargetCity(beat))) {
        this._advance(beat);
      }
      return;
    }

    // travel 类型：玩家到达目标城市
    if (beat.type === 'travel') {
      const city = this._getCurrentCity();
      if (city && this._cityMatches(city, beat.target)) {
        this._advance(beat);
      }
    }
  },

  /**
   * 模拟/手动触发NPC对话
   * 在NPC对话框关闭后调用，或在任何需要的地方调用
   */
  talk(npcName) {
    const beat = this.current();
    if (!beat || beat.type !== 'talk') return;
    if (npcName && beat.target && (npcName.includes(beat.target) || beat.target.includes(npcName))) {
      this._advance(beat);
    }
  },

  /**
   * 模拟/手动触发地下城完成
   * 在地下城通关后调用
   */
  dungeon(dungeonName) {
    const beat = this.current();
    if (!beat || beat.type !== 'dungeon') return;
    if (dungeonName && beat.target && (dungeonName.includes(beat.target) || beat.target.includes(dungeonName))) {
      // 检查是否有完成前特殊过场（如 b2_5_before = 玄铁令真相）
      const beforeKey = beat.id + '_before';
      const beforeTrigger = (typeof CUTSCENE_TRIGGERS !== 'undefined') ? CUTSCENE_TRIGGERS[beforeKey] : null;
      if (beforeTrigger && typeof StoryCS !== 'undefined' && !this.state['cs_' + beforeKey + '_done']) {
        this.state['cs_' + beforeKey + '_done'] = true;
        this._save();
        StoryCS.play(beforeTrigger.csId, () => this._advance(beat), beforeTrigger.flash);
      } else {
        this._advance(beat);
      }
    }
  },

  /**
   * 模拟/手动触发BOSS击败
   * 在BOSS战胜利后调用
   */
  boss(bossName) {
    const beat = this.current();
    if (!beat || beat.type !== 'boss') return;
    if (bossName && beat.target && (bossName.includes(beat.target) || beat.target.includes(bossName))) {
      // 检查是否有决战前过场（b5_4_before = 骨冥子出场动画）
      const beforeKey = beat.id + '_before';
      const beforeTrigger = (typeof CUTSCENE_TRIGGERS !== 'undefined') ? CUTSCENE_TRIGGERS[beforeKey] : null;
      if (beforeTrigger && typeof StoryCS !== 'undefined' && !this.state['cs_' + beforeKey + '_done']) {
        this.state['cs_' + beforeKey + '_done'] = true;
        this._save();
        StoryCS.play(beforeTrigger.csId, () => this._advance(beat), beforeTrigger.flash);
      } else {
        this._advance(beat);
      }
    }
  },

  /**
   * 模拟/手动触发押镖到达
   * 在护镖小游戏成功后调用，传入目的地城市名
   */
  escort(destinationCity) {
    const beat = this.current();
    if (!beat || beat.type !== 'escort') return;
    if (destinationCity && beat.target && (destinationCity.includes(beat.target) || beat.target.includes(destinationCity))) {
      this._advance(beat);
    }
  },

  // ══════════════════════════════════════════════════════
  // 推进核心（条件满足后自动调用）
  // ══════════════════════════════════════════════════════

  _advance(beat) {
    // 防止重复推进
    if (this.state.currentBeat !== beat.id) return;

    // travel 类型：到达目标城市直接推进，不弹窗
    if (beat.type === 'travel') {
      this._moveToNext(beat);
      return;
    }

    // 其他类型（narrate/talk/dungeon/boss）：显示对话框，翻完后推进
    if (!this.state.narrativeShown) {
      this.state.narrativeShown = true;
      this._save();
      // 对话翻完后直接 _moveToNext
      this._showNarrative(beat, () => {
        this._moveToNext(beat);
      });
      return;
    }

    // 已显示过（极端情况兜底），直接推进
    this._moveToNext(beat);
  },

  _moveToNext(beat) {
    // 重置显示标记
    this.state.narrativeShown = false;

    // ── 过场：节点完成后（章节结束过渡） ─────────────
    const doneTrigger = (typeof CUTSCENE_TRIGGERS !== 'undefined')
      ? CUTSCENE_TRIGGERS[beat.id + '_done']
      : null;

    // 检查是否有下一节点
    if (beat.nextBeat && STORY_BEATS[beat.nextBeat]) {
      this.state.currentBeat = beat.nextBeat;
      this._save();
      // 节点完成过场（如玄铁令真相 b2_5_done）
      if (doneTrigger && typeof StoryCS !== 'undefined') {
        StoryCS.play(doneTrigger.csId, () => {
          this._flashAdvance(() => this._onNewBeat(STORY_BEATS[beat.nextBeat], '章节继续'));
        }, doneTrigger.flash);
      } else {
        this._flashAdvance(() => this._onNewBeat(STORY_BEATS[beat.nextBeat], '章节继续'));
      }
    } else if (beat.nextChapter && STORY_CHAPTERS[beat.nextChapter]) {
      // 章节结束，过渡到下一章
      const firstBeatId = STORY_CHAPTERS[beat.nextChapter].beats[0];
      this.state.currentBeat = firstBeatId;
      this._save();
      // 章节结束过场
      if (doneTrigger && typeof StoryCS !== 'undefined') {
        StoryCS.play(doneTrigger.csId, () => {
          this._flashAdvance(() => this._onChapterTransition(beat.nextChapter));
        }, doneTrigger.flash);
      } else {
        this._flashAdvance(() => this._onChapterTransition(beat.nextChapter));
      }
    } else {
      // 故事完结
      if (doneTrigger && typeof StoryCS !== 'undefined') {
        StoryCS.play(doneTrigger.csId, () => this._onStoryEnd(), doneTrigger.flash);
      } else {
        this._onStoryEnd();
      }
    }
  },

  /** 节点推进扫屏动画（带颜色渐变，更有电影感） */
  _flashAdvance(callback) {
    // 获取当前 beat 的 mood accent 色
    const beat = this.current();
    const moodColors = {
      mystery:'#1a0030', tense:'#1a000a', solemn:'#00091a',
      battle:'#1a0800', dark:'#0d0000', warm:'#1a0e00',
      triumph:'#001a06', epilogue:'#1a1400',
    };
    const bg = (beat && moodColors[beat.mood]) ? moodColors[beat.mood] : '#000';

    const flash = document.createElement('div');
    flash.id = 'sg-flash';
    flash.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:${bg};z-index:9997;pointer-events:none;
      opacity:0;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.transition = 'opacity 0.18s ease';
      flash.style.opacity = '1';
      setTimeout(() => {
        callback();
        setTimeout(() => {
          flash.style.transition = 'opacity 0.25s ease';
          flash.style.opacity = '0';
          setTimeout(() => flash.remove(), 260);
        }, 90);
      }, 180);
    });
  },

  _onNewBeat(beat, subtitle) {
    this._render();
    // 新节点进入时显示叙事（对话框翻完后不自动推进，推进已在_advance的onDone里处理）
    this._showNarrative(beat, null);
    // 更新面板内指引 banner（若任务面板正在打开）
    this._refreshCard();
    // ── 节点推进后刷新NPC列表，使剧情NPC（鹤隐等）立刻出现/消失 ──
    try {
      if (typeof renderCityNpcs === 'function' && typeof travelCurrentCity !== 'undefined' && travelCurrentCity) {
        renderCityNpcs(travelCurrentCity);
      }
    } catch(e) {}
  },


  _onChapterTransition(newChapterId) {
    const newChapter = STORY_CHAPTERS[newChapterId];
    const newBeat = STORY_BEATS[this.state.currentBeat];
    this._showTransition(newChapter, newBeat);
    this._render();
  },

  _onStoryEnd() {
    this._showEnd();
    this._hideCard();
  },

  // ══════════════════════════════════════════════════════
  // UI 渲染
  // ══════════════════════════════════════════════════════

  _buildStyles() {
    if (document.getElementById('sg-styles')) return;
    const style = document.createElement('style');
    style.id = 'sg-styles';
    style.textContent = `
      /* ══════════════════════════════════════════
         任务面板内嵌主线指引区块
      ══════════════════════════════════════════ */
      #sg-quest-banner {
        position: relative;
        background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
        border: 1.5px solid rgba(233,69,96,0.6);
        border-radius: 10px;
        padding: 12px 14px;
        margin-bottom: 12px;
        overflow: hidden;
        animation: sg-card-breathe 3s ease-in-out infinite;
        cursor: pointer;
      }
      #sg-quest-banner:active { opacity: 0.85; }
      @keyframes sg-card-breathe {
        0%,100% { box-shadow: 0 4px 18px rgba(233,69,96,0.15), inset 0 0 16px rgba(233,69,96,0.03); border-color: rgba(233,69,96,0.5); }
        50%      { box-shadow: 0 6px 28px rgba(233,69,96,0.32), inset 0 0 24px rgba(233,69,96,0.07); border-color: rgba(233,69,96,0.85); }
      }
      /* 顶部装饰扫光线 */
      #sg-quest-banner::before {
        content: '';
        position: absolute; top: 0; left: -60%; right: 160%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,215,0,0.6), transparent);
        animation: sg-card-scan 4s linear infinite;
        pointer-events: none;
      }
      @keyframes sg-card-scan {
        0%   { left: -60%; right: 160%; }
        100% { left: 100%; right: -60%; }
      }
      #sg-quest-banner .sg-chapter-tag {
        font-size: 10px; color: #ffd700; letter-spacing: 1px;
        margin-bottom: 5px;
        display: flex; align-items: center; gap: 6px;
      }
      #sg-quest-banner .sg-chapter-tag::before {
        content: '';
        display: inline-block; width: 18px; height: 1px;
        background: linear-gradient(90deg, transparent, #ffd700);
      }
      #sg-quest-banner .sg-beat-title {
        font-size: 13px; font-weight: bold; color: #fff;
        margin-bottom: 7px; line-height: 1.3;
      }
      #sg-quest-banner .sg-hint-bar {
        display: flex; align-items: center; gap: 8px;
        background: rgba(233,69,96,0.1);
        border: 1px solid rgba(233,69,96,0.2);
        border-radius: 6px; padding: 6px 10px;
        font-size: 12px; color: #ff8fa3;
      }
      #sg-quest-banner .sg-hint-icon { font-size: 13px; flex-shrink: 0; }
      #sg-quest-banner .sg-banner-footer {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 7px;
      }
      #sg-quest-banner .sg-progress {
        font-size: 9px; color: rgba(255,255,255,0.3);
      }
      #sg-quest-banner .sg-banner-tap {
        font-size: 10px; color: rgba(233,69,96,0.6);
        letter-spacing: 0.5px;
      }

      /* ══════════════════════════════════════════
         RPG 对话框主体
      ══════════════════════════════════════════ */
      #sg-dialog {
        position: fixed; left: 0; right: 0; bottom: 0;
        z-index: 9990;
        pointer-events: none;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        transform: translateY(100%);
        transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
      }
      #sg-dialog.sg-dialog-show {
        transform: translateY(0);
        pointer-events: auto;
      }

      /* ── 情绪主题色变量 ── */
      #sg-dialog { --sg-accent: #e94560; --sg-glow: rgba(233,69,96,0.25); --sg-particle: #e94560; }
      #sg-dialog[data-mood="mystery"]  { --sg-accent: #9b59b6; --sg-glow: rgba(155,89,182,0.28); --sg-particle: #9b59b6; }
      #sg-dialog[data-mood="tense"]    { --sg-accent: #e94560; --sg-glow: rgba(233,69,96,0.30); --sg-particle: #ff4070; }
      #sg-dialog[data-mood="solemn"]   { --sg-accent: #4a9eff; --sg-glow: rgba(74,158,255,0.25); --sg-particle: #4a9eff; }
      #sg-dialog[data-mood="battle"]   { --sg-accent: #ff6b35; --sg-glow: rgba(255,107,53,0.32); --sg-particle: #ff9f35; }
      #sg-dialog[data-mood="dark"]     { --sg-accent: #c0392b; --sg-glow: rgba(192,57,43,0.30); --sg-particle: #8b0000; }
      #sg-dialog[data-mood="warm"]     { --sg-accent: #f39c12; --sg-glow: rgba(243,156,18,0.25); --sg-particle: #ffd700; }
      #sg-dialog[data-mood="triumph"]  { --sg-accent: #2ecc71; --sg-glow: rgba(46,204,113,0.25); --sg-particle: #2ecc71; }
      #sg-dialog[data-mood="epilogue"] { --sg-accent: #ffd700; --sg-glow: rgba(255,215,0,0.22); --sg-particle: #ffd700; }

      /* 背景蒙层 */
      #sg-dialog-bg {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, transparent 100%);
        z-index: 9989;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.45s ease;
      }
      #sg-dialog-bg.sg-dialog-show { opacity: 1; }

      /* ── 环境粒子层（canvas，绝对覆盖） ── */
      #sg-dialog-particles {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none;
        z-index: 9988;
        opacity: 0;
        transition: opacity 0.6s ease;
      }
      #sg-dialog-particles.sg-dialog-show { opacity: 1; }

      /* 顶部章节标题条 */
      #sg-dialog-header {
        text-align: center; padding: 0 16px 4px;
        opacity: 0; transform: translateY(-6px);
        transition: opacity 0.4s 0.15s, transform 0.4s 0.15s;
      }
      #sg-dialog.sg-dialog-show #sg-dialog-header { opacity: 1; transform: translateY(0); }
      #sg-dialog-header .sg-dh-chapter {
        display: inline-block;
        font-size: 10px; color: var(--sg-accent); letter-spacing: 2px;
        padding: 3px 14px;
        background: rgba(0,0,0,0.65);
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.08);
        text-shadow: 0 0 8px var(--sg-accent);
      }
      #sg-dialog-header .sg-dh-beat {
        font-size: 12px; color: rgba(255,255,255,0.5);
        margin-left: 7px;
      }
      #sg-dialog-header .sg-dh-mood {
        font-size: 10px; padding: 2px 8px;
        border: 1px solid; border-radius: 10px;
        margin-left: 8px; flex-shrink: 0;
        letter-spacing: 1px;
      }

      /* 主对话盒 */
      #sg-dialog-box {
        margin: 0 10px 10px;
        background: linear-gradient(180deg, rgba(6,6,18,0.98) 0%, rgba(10,10,26,0.99) 100%);
        border: 1.5px solid var(--sg-accent);
        border-radius: 14px;
        box-shadow: 0 -10px 50px var(--sg-glow), inset 0 1px 0 rgba(255,255,255,0.05);
        overflow: hidden;
        transition: border-color 0.4s, box-shadow 0.4s;
      }
      /* 顶部流光accent线 */
      #sg-dialog-box::before {
        content: '';
        display: block; height: 2px;
        background: linear-gradient(90deg, transparent 0%, var(--sg-accent) 40%, var(--sg-accent) 60%, transparent 100%);
        background-size: 200% 100%;
        animation: sg-accent-flow 3s linear infinite;
        opacity: 0.9;
      }
      @keyframes sg-accent-flow {
        0%   { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }

      /* 说话人行（立绘区） */
      #sg-dialog-speaker-row {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 16px 6px;
      }
      /* 角色立绘框（ASCII 字符画风格） */
      #sg-dialog-avatar {
        width: 64px; height: auto;
        min-height: 56px;
        background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
        border: 2px solid var(--sg-accent);
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; line-height: 1.35; flex-shrink: 0;
        font-family: 'Courier New', Courier, monospace;
        box-shadow: 0 0 16px var(--sg-glow), inset 0 0 10px rgba(0,0,0,0.3);
        transition: border-color 0.3s, box-shadow 0.3s, transform 0.2s;
        position: relative; overflow: hidden;
        padding: 4px 2px;
      }
      /* 立绘框内部扫光 */
      #sg-dialog-avatar::after {
        content: '';
        position: absolute; top: -50%; left: -50%;
        width: 40%; height: 200%;
        background: linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent);
        transform: rotate(20deg);
        animation: sg-avatar-shine 4s ease-in-out infinite;
      }
      @keyframes sg-avatar-shine {
        0%,70%  { left: -50%; opacity: 0; }
        75%     { opacity: 1; }
        100%    { left: 120%; opacity: 0; }
      }
      /* 说话时立绘轻微弹跳 */
      #sg-dialog-avatar.sg-speaking {
        animation: sg-avatar-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
      }
      @keyframes sg-avatar-pop {
        0%   { transform: scale(0.88); }
        100% { transform: scale(1.0); }
      }

      /* ═══ 角色特效 CSS 类 ═══ */
      /* 旁白·卷轴微光 */
      #sg-dialog-avatar.sg-portrait-narrate {
        box-shadow: 0 0 20px rgba(112,144,168,0.4), inset 0 0 12px rgba(112,144,168,0.1);
        animation: sg-portrait-glow 3s ease-in-out infinite;
      }
      /* 鹤隐·仙气缭绕 */
      #sg-dialog-avatar.sg-portrait-xian {
        box-shadow: 0 0 24px rgba(128,200,128,0.5), 0 0 48px rgba(128,200,128,0.15), inset 0 0 12px rgba(128,200,128,0.1);
        animation: sg-portrait-float 2.5s ease-in-out infinite, sg-portrait-glow 4s ease-in-out infinite;
      }
      /* 玩家·侠客微光 */
      #sg-dialog-avatar.sg-portrait-hero {
        box-shadow: 0 0 20px rgba(224,224,224,0.3), inset 0 0 10px rgba(224,224,224,0.08);
        animation: sg-portrait-float 2s ease-in-out infinite;
      }
      /* 骨冥子·邪气 */
      #sg-dialog-avatar.sg-portrait-evil {
        box-shadow: 0 0 24px rgba(224,96,96,0.6), 0 0 48px rgba(224,96,96,0.2), inset 0 0 14px rgba(224,96,96,0.15);
        animation: sg-portrait-evil-pulse 1.8s ease-in-out infinite;
      }
      /* 少林·佛光 */
      #sg-dialog-avatar.sg-portrait-holy {
        box-shadow: 0 0 28px rgba(128,200,128,0.5), 0 0 56px rgba(255,215,0,0.15), inset 0 0 14px rgba(255,215,0,0.1);
        animation: sg-portrait-halo 2.2s ease-in-out infinite;
      }
      /* 武当·太极旋转 */
      #sg-dialog-avatar.sg-portrait-tao {
        box-shadow: 0 0 22px rgba(128,200,128,0.4), inset 0 0 10px rgba(128,200,128,0.1);
        animation: sg-portrait-float 3s ease-in-out infinite;
      }
      /* 华山·剑光 */
      #sg-dialog-avatar.sg-portrait-sword {
        box-shadow: 0 0 22px rgba(128,200,128,0.4), 0 0 6px rgba(200,220,255,0.6) inset;
        animation: sg-portrait-sword-flash 1.2s ease-in-out infinite;
      }
      /* 无尘·暗影 */
      #sg-dialog-avatar.sg-portrait-shadow {
        box-shadow: 0 0 20px rgba(200,144,96,0.4), 0 0 40px rgba(0,0,0,0.5), inset 0 0 14px rgba(0,0,0,0.3);
        animation: sg-portrait-shadow-drift 3s ease-in-out infinite;
      }
      /* 白眉·毒雾 */
      #sg-dialog-avatar.sg-portrait-poison {
        box-shadow: 0 0 22px rgba(200,144,96,0.4), 0 0 44px rgba(100,200,100,0.15), inset 0 0 10px rgba(100,200,100,0.1);
        animation: sg-portrait-float 2.8s ease-in-out infinite, sg-portrait-poison-flicker 2s ease-in-out infinite;
      }

      /* ═══ 角色特效 keyframes ═══ */
      @keyframes sg-portrait-glow {
        0%, 100% { filter: brightness(1); }
        50%      { filter: brightness(1.15); }
      }
      @keyframes sg-portrait-float {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-3px); }
      }
      @keyframes sg-portrait-evil-pulse {
        0%, 100% { filter: brightness(1) saturate(1); }
        25%      { filter: brightness(1.2) saturate(1.3); }
        50%      { filter: brightness(0.9) saturate(0.8); }
        75%      { filter: brightness(1.15) saturate(1.2); }
      }
      @keyframes sg-portrait-halo {
        0%, 100% { box-shadow: 0 0 28px rgba(128,200,128,0.5), 0 0 56px rgba(255,215,0,0.15), inset 0 0 14px rgba(255,215,0,0.1); }
        50%      { box-shadow: 0 0 36px rgba(128,200,128,0.6), 0 0 72px rgba(255,215,0,0.25), inset 0 0 18px rgba(255,215,0,0.15); }
      }
      @keyframes sg-portrait-sword-flash {
        0%, 80%, 100% { filter: brightness(1); }
        90%              { filter: brightness(1.4); }
      }
      @keyframes sg-portrait-shadow-drift {
        0%, 100% { transform: translateX(0); opacity: 1; }
        50%      { transform: translateX(2px); opacity: 0.85; }
      }
      @keyframes sg-portrait-poison-flicker {
        0%, 100% { filter: hue-rotate(0deg); }
        33%      { filter: hue-rotate(15deg); }
        66%      { filter: hue-rotate(-10deg); }
      }
      /* 说话人名 */
      #sg-dialog-speaker {
        font-size: 13px; font-weight: bold;
        color: var(--sg-accent);
        letter-spacing: 1.5px; flex: 1;
        text-shadow: 0 0 8px var(--sg-glow);
        transition: color 0.3s, text-shadow 0.3s;
      }
      #sg-dialog-speaker.sg-spk-in {
        animation: sg-spk-pop 0.25s ease;
      }
      @keyframes sg-spk-pop {
        0%   { opacity: 0; transform: translateX(-6px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      /* 页码 */
      #sg-dialog-pages {
        font-size: 10px; color: rgba(255,255,255,0.2);
        flex-shrink: 0;
      }

      /* 对话文字区 */
      #sg-dialog-text {
        font-size: 14px; color: #e8e8f0; line-height: 1.9;
        white-space: pre-line;
        padding: 2px 18px 14px;
        min-height: 72px;
        transition: color 0.3s;
      }
      /* 旁白风格 */
      #sg-dialog.sg-narrator #sg-dialog-text {
        color: #7090a8; font-style: italic;
        text-indent: 1em;
      }
      #sg-dialog.sg-narrator #sg-dialog-avatar { opacity: 0.55; border-style: dashed; }

      /* 内心独白（玩家）风格 */
      #sg-dialog.sg-inner #sg-dialog-text {
        color: #ffd080; font-style: italic;
      }

      /* 打字机光标 */
      #sg-dialog-text.typing::after {
        content: '▌';
        animation: sg-blink 0.65s step-end infinite;
      }
      /* 不同说话人的光标颜色 */
      #sg-dialog.sg-narrator #sg-dialog-text.typing::after,
      #sg-dialog.sg-inner  #sg-dialog-text.typing::after { color: inherit; }
      @keyframes sg-blink { 50% { opacity: 0; } }

      /* battle/tense 打字时文字微抖 */
      #sg-dialog[data-mood="battle"] #sg-dialog-text.typing,
      #sg-dialog[data-mood="tense"]  #sg-dialog-text.typing {
        animation: sg-text-shake 0.08s linear infinite;
      }
      @keyframes sg-text-shake {
        0%,100% { transform: translateX(0); }
        25%     { transform: translateX(0.5px); }
        75%     { transform: translateX(-0.5px); }
      }

      /* 按钮区 */
      #sg-dialog-actions {
        display: flex; gap: 8px;
        padding: 0 14px 14px;
      }
      #sg-dialog-skip {
        flex: 1; padding: 9px 0;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 8px;
        color: rgba(255,255,255,0.30); font-size: 12px;
        cursor: pointer; font-family: inherit;
        transition: all 0.2s;
      }
      #sg-dialog-skip:hover { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.28); }
      #sg-dialog-next {
        flex: 2; padding: 9px 0;
        background: rgba(255,255,255,0.04);
        border: 1.5px solid var(--sg-accent);
        border-radius: 8px;
        color: var(--sg-accent); font-size: 13px; font-weight: bold;
        cursor: pointer; font-family: inherit;
        text-align: center;
        box-shadow: 0 0 14px var(--sg-glow);
        transition: all 0.2s;
        position: relative; overflow: hidden;
      }
      #sg-dialog-next::after {
        content: '';
        position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
        background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
        transition: none;
      }
      #sg-dialog-next:hover::after { left: 150%; transition: left 0.4s ease; }
      #sg-dialog-next:hover { background: rgba(255,255,255,0.09); transform: scale(1.02); }
      #sg-dialog-next.sg-pulse {
        animation: sg-pulse 1.6s ease-in-out infinite;
      }
      @keyframes sg-pulse {
        0%,100% { box-shadow: 0 0 12px var(--sg-glow); }
        50%     { box-shadow: 0 0 28px var(--sg-glow), 0 0 10px var(--sg-accent); }
      }

      /* ── 旁白弹窗兼容 ── */
      #sg-narrative {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.78);
        display: flex; align-items: center; justify-content: center;
        z-index: 9990; opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
      }
      #sg-narrative.sg-narrative-show { opacity: 1; pointer-events: auto; }
      #sg-narrative-box {
        max-width: 440px; width: 90%;
        background: linear-gradient(135deg, #0d0d20, #1a1a2e);
        border: 1.5px solid rgba(233,69,96,0.5);
        border-radius: 14px; padding: 28px 24px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.6), 0 0 40px rgba(233,69,96,0.1);
      }
      #sg-narrative-box .sg-n-title { font-size: 11px; color: #ffd700; letter-spacing: 2px; margin-bottom: 12px; }
      #sg-narrative-box .sg-n-text {
        font-size: 14px; color: #e8e8f0; line-height: 1.9;
        white-space: pre-line; margin-bottom: 18px; min-height: 60px;
      }
      #sg-narrative-box .sg-n-text.typing::after { content: '▌'; color: #ffd700; animation: sg-blink 0.8s step-end infinite; }
      #sg-narrative-box .sg-n-btn {
        display: block; width: 100%; padding: 10px;
        background: rgba(233,69,96,0.15); border: 1px solid rgba(233,69,96,0.4);
        border-radius: 8px; color: #ff8fa3; font-size: 13px;
        cursor: pointer; text-align: center; transition: background 0.2s; font-family: inherit;
      }
      #sg-narrative-box .sg-n-btn:hover { background: rgba(233,69,96,0.25); }

      /* ══════════════════════════════════════════
         章节过渡（毛刺故障艺术 + 电影风）
      ══════════════════════════════════════════ */
      #sg-transition {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: #000;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        z-index: 9998; opacity: 0;
        pointer-events: none;
        transition: opacity 0.7s ease;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        overflow: hidden;
      }
      #sg-transition.sg-transition-show { opacity: 1; pointer-events: auto; }
      /* 毛刺扫线 */
      #sg-transition::before, #sg-transition::after {
        content: '';
        position: absolute; left: 0; right: 0; height: 2px;
        background: rgba(255,215,0,0.5);
        opacity: 0;
        animation: sg-glitch-line 0.12s step-end infinite;
      }
      #sg-transition::before { top: 30%; animation-delay: 0.04s; }
      #sg-transition::after  { top: 60%; animation-delay: 0.09s; }
      @keyframes sg-glitch-line {
        0%,80%,100% { opacity: 0; transform: scaleX(0); }
        10%         { opacity: 0.6; transform: scaleX(1); }
        40%         { opacity: 0.3; transform: scaleX(0.6) translateX(10px); }
      }
      /* 竖向毛刺块 */
      #sg-transition .sg-t-glitch {
        position: absolute; top: 0; width: 3px; height: 100%;
        background: rgba(255,255,255,0.04);
        animation: sg-t-gblock 0.2s step-end infinite;
      }
      #sg-transition .sg-t-glitch:nth-child(1) { left: 20%; animation-delay: 0.02s; }
      #sg-transition .sg-t-glitch:nth-child(2) { left: 55%; animation-delay: 0.11s; }
      #sg-transition .sg-t-glitch:nth-child(3) { left: 80%; animation-delay: 0.07s; }
      @keyframes sg-t-gblock {
        0%,60%,100% { opacity: 0; }
        30%         { opacity: 1; transform: scaleY(0.3) translateY(60%); }
      }
      /* 装饰横线（伸展动效） */
      #sg-transition .sg-t-line {
        width: 60px; height: 1px;
        background: linear-gradient(90deg, transparent, #ffd700, transparent);
        margin-bottom: 18px;
        opacity: 0; transform: scaleX(0);
        transition: opacity 0.5s 0.25s, transform 0.6s 0.25s;
      }
      #sg-transition.sg-transition-show .sg-t-line { opacity: 1; transform: scaleX(1); }
      #sg-transition .sg-t-chapter {
        font-size: 11px; color: #ffd700; letter-spacing: 5px;
        text-transform: uppercase; margin-bottom: 14px;
        opacity: 0; transform: translateY(8px);
        transition: opacity 0.6s 0.4s, transform 0.6s 0.4s;
        text-shadow: 0 0 12px rgba(255,215,0,0.6);
      }
      #sg-transition.sg-transition-show .sg-t-chapter { opacity: 1; transform: translateY(0); }
      #sg-transition .sg-t-title {
        font-size: 28px; color: #fff; font-weight: bold;
        margin-bottom: 22px; letter-spacing: 3px;
        opacity: 0; transform: translateY(12px);
        transition: opacity 0.6s 0.7s, transform 0.6s 0.7s;
        text-shadow: 0 2px 24px rgba(255,255,255,0.2);
      }
      #sg-transition.sg-transition-show .sg-t-title { opacity: 1; transform: translateY(0); }
      #sg-transition .sg-t-summary {
        max-width: 300px; text-align: center;
        font-size: 13px; color: rgba(255,255,255,0.42); line-height: 1.85;
        opacity: 0; transition: opacity 0.7s 1.1s;
      }
      #sg-transition.sg-transition-show .sg-t-summary { opacity: 1; }
      /* 底部进度条 */
      #sg-transition .sg-t-bar {
        position: absolute; bottom: 0; left: 0;
        height: 2px;
        background: linear-gradient(90deg, #ffd700, transparent);
        width: 0%; opacity: 0;
        transition: opacity 0.3s 0.5s;
      }
      #sg-transition.sg-transition-show .sg-t-bar {
        opacity: 1;
        animation: sg-t-bar-fill 4.2s linear 0.5s forwards;
      }
      @keyframes sg-t-bar-fill { 0% { width: 0%; } 100% { width: 100%; } }

      /* ══════════════════════════════════════════
         故事完结画面
      ══════════════════════════════════════════ */
      #sg-end {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(ellipse at center, #0a0818 0%, #000 100%);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        z-index: 9999; opacity: 0;
        pointer-events: none;
        transition: opacity 1.2s ease;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        overflow: hidden;
      }
      #sg-end.sg-end-show { opacity: 1; pointer-events: auto; }
      /* 落幕星光背景 */
      #sg-end::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(circle at 30% 40%, rgba(255,215,0,0.04) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(155,89,182,0.04) 0%, transparent 50%);
        animation: sg-end-glow 4s ease-in-out infinite alternate;
      }
      @keyframes sg-end-glow {
        0%   { opacity: 0.5; }
        100% { opacity: 1; }
      }
      #sg-end .sg-e-title {
        font-size: 26px; color: #ffd700; font-weight: bold;
        margin-bottom: 12px;
        text-shadow: 0 0 20px rgba(255,215,0,0.4);
        animation: sg-end-title-in 1.5s ease forwards;
        opacity: 0;
      }
      @keyframes sg-end-title-in {
        0%   { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      #sg-end .sg-e-sub {
        font-size: 14px; color: rgba(255,255,255,0.45);
        margin-bottom: 32px;
        opacity: 0; animation: sg-end-title-in 1.5s 0.5s ease forwards;
      }
      #sg-end .sg-e-btn {
        padding: 11px 30px;
        background: rgba(233,69,96,0.12); border: 1px solid rgba(233,69,96,0.4);
        border-radius: 8px; color: #ff8fa3; font-size: 13px;
        cursor: pointer; font-family: inherit;
        transition: background 0.2s, transform 0.15s;
        opacity: 0; animation: sg-end-title-in 1.5s 1s ease forwards;
      }
      #sg-end .sg-e-btn:hover { background: rgba(233,69,96,0.28); transform: scale(1.04); }

      /* ═══ 增强版结尾 ══════════════════════════════════════ */
      .sge-inner {
        max-width: 420px;
        margin: 0 auto;
        padding: 20px 16px 40px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .sge-title-block { text-align: center; margin-bottom: 4px; }
      .sge-tag {
        font-size: 10px; color: #ffd700; letter-spacing: 4px;
        text-transform: uppercase; margin-bottom: 10px;
        opacity: 0; animation: sg-end-title-in 1s 0.2s ease forwards;
        text-shadow: 0 0 10px rgba(255,215,0,.5);
      }
      .sge-title {
        font-size: 24px; color: #ffd700; font-weight: bold;
        text-shadow: 0 0 24px rgba(255,215,0,.5);
        margin-bottom: 8px;
        opacity: 0; animation: sg-end-title-in 1.2s 0.4s ease forwards;
      }
      .sge-sub {
        font-size: 13px; color: rgba(255,255,255,.4);
        opacity: 0; animation: sg-end-title-in 1.2s 0.8s ease forwards;
      }

      /* 人物结局 */
      .sge-cast-grid {
        display: flex; gap: 10px; justify-content: center;
        flex-wrap: wrap;
        opacity: 0; animation: sg-end-title-in 1s 1.2s ease forwards;
      }
      .sge-cast-item {
        display: flex; flex-direction: column; align-items: center; gap: 4px;
        min-width: 60px;
      }
      .sge-cast-avatar {
        width: 44px; height: 44px; border-radius: 10px; border: 2px solid;
        display: flex; align-items: center; justify-content: center; font-size: 20px;
        box-shadow: 0 0 12px rgba(255,255,255,.1);
      }
      .sge-cast-name { font-size: 11px; font-weight: bold; }
      .sge-cast-fate { font-size: 9px; color: #888; text-align: center; max-width: 70px; }

      /* 章节回顾 */
      .sge-chapters {
        display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;
        opacity: 0; animation: sg-end-title-in 1s 1.6s ease forwards;
      }
      .sge-ch-stat {
        font-size: 10px; padding: 3px 8px;
        border: 1px solid; border-radius: 20px;
        color: rgba(255,255,255,.5);
      }
      .sge-total {
        font-size: 11px; color: rgba(255,215,0,.6);
        text-align: center;
        opacity: 0; animation: sg-end-title-in 1s 2s ease forwards;
      }

      /* 悬念预告 */
      .sge-teaser {
        background: rgba(155,89,182,.08);
        border: 1px solid rgba(155,89,182,.2);
        border-radius: 12px; padding: 14px 18px;
        opacity: 0; animation: sg-end-title-in 1.2s 2.3s ease forwards;
      }
      .sge-teaser-label {
        font-size: 10px; color: #9b59b6; letter-spacing: 2px;
        margin-bottom: 6px;
      }
      .sge-teaser-text {
        font-size: 15px; color: #c090ff; font-style: italic;
        margin-bottom: 6px;
        text-shadow: 0 0 12px rgba(155,89,182,.4);
      }
      .sge-teaser-hint {
        font-size: 11px; color: rgba(200,184,144,.45);
        line-height: 1.5;
      }

      /* 操作按钮 */
      .sge-actions {
        display: flex; gap: 10px; justify-content: center;
        opacity: 0; animation: sg-end-title-in 1s 2.8s ease forwards;
      }
      .sge-btn-replay, .sge-btn-story {
        padding: 10px 20px; border-radius: 8px;
        font-size: 12px; cursor: pointer; font-family: inherit;
        border: 1px solid; transition: all .2s;
      }
      .sge-btn-replay {
        background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.15); color: #aaa;
      }
      .sge-btn-replay:hover { background: rgba(233,69,96,.15); border-color: rgba(233,69,96,.4); color: #e06060; }
      .sge-btn-story {
        background: rgba(155,89,182,.15); border-color: rgba(155,89,182,.4); color: #9b59b6;
      }
      .sge-btn-story:hover { background: rgba(155,89,182,.28); }
      .sge-btn-replay:active, .sge-btn-story:active { transform: scale(.96); }
    `;
    document.head.appendChild(style);
  },

  _render() {
    this._removeCard();
    if (this.current()) {
      this._createCard();
    }
  },

  _removeCard() {
    // 浮动卡已废弃；清理面板内 banner（若存在）
    const banner = document.getElementById('sg-quest-banner');
    if (banner) banner.remove();
    this._cardEl = null;
    if (this._cardTimer) {
      clearTimeout(this._cardTimer);
      this._cardTimer = null;
    }
  },



  _createCard() {
    // 改为更新任务面板内的 #sg-quest-banner（面板打开时才有效）
    // 不再创建浮动卡片；内容在 townOpenQuests -> _tqBuildHtml 里静态生成，
    // 这里只更新已存在的 banner（若面板已打开）
    this._refreshBanner();
  },

  /** 刷新任务面板内嵌的主线指引 banner（若面板正在打开） */
  _refreshBanner() {
    const banner = document.getElementById('sg-quest-banner');
    if (!banner) return; // 面板未打开，无需更新
    const beat = this.current();
    if (!beat) { banner.remove(); return; }
    const ch = this.currentChapter();
    const progress = this.progress();
    const titleEl = banner.querySelector('.sg-beat-title');
    const hintEl  = banner.querySelector('.sg-hint-bar');
    const chapEl  = banner.querySelector('.sg-chapter-tag');
    const progEl  = banner.querySelector('.sg-progress');
    if (titleEl) titleEl.textContent = beat.title;
    if (hintEl)  hintEl.innerHTML = `<span class="sg-hint-icon">${this._typeIcon(beat.type)}</span><span>${beat.hint}</span>`;
    if (chapEl)  chapEl.textContent = ch ? ch.title : '';
    if (progEl)  progEl.textContent = progress;
  },



  /** 收起/展开卡片（浮动卡已废弃，现仅关闭弹出层） */
  _toggleCollapse() {
    // 清理立绘帧动画定时器
    if (this._portraitTimer) { clearInterval(this._portraitTimer); this._portraitTimer = null; }
    // 关闭对话框/蒙层/粒子层/叙述弹窗
    ['sg-dialog','sg-dialog-bg','sg-dialog-particles','sg-narrative'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'sg-dialog-particles' && el._sgStop) el._sgStop();
        el.remove();
      }
    });
  },



  _refreshCard() {
    // 改为更新面板内 banner
    this._refreshBanner();
  },

  /** 显示指引（面板内嵌，无浮动卡需要 show） */
  show() {
    // 面板内嵌方案：不需要额外 show；打开任务面板时自动渲染
  },

  /** 隐藏指引（面板内嵌，无浮动卡需要 hide） */
  hide() {
    // 面板内嵌方案：不需要额外 hide
  },



  /** 点击指引卡查看当前节点对话回顾（纯展示，不推进） */
  _showDetail(beat) {
    this._openDialogBox(beat, null, /*isReview*/ true);
  },

  /**
   * 节点推进时调用——先播一个极短的 mood 入场闪光，再打开对话框
   * @param {object} beat - 叙事节点
   * @param {function|null} onDone - 全部对话翻完后的回调
   */
  _showNarrative(beat, onDone) {
    // mood 对应的入场光晕色（上边缘短暂扫光）
    const moodGlow = {
      mystery:'rgba(155,89,182,0.5)', tense:'rgba(233,69,96,0.6)',
      solemn:'rgba(74,158,255,0.5)', battle:'rgba(255,107,53,0.65)',
      dark:'rgba(192,57,43,0.55)', warm:'rgba(243,156,18,0.5)',
      triumph:'rgba(46,204,113,0.5)', epilogue:'rgba(255,215,0,0.55)',
    };
    const moodColors = {
      mystery:'#9b59b6', tense:'#e74c3c', solemn:'#4a9eff', battle:'#ff6b35',
      dark:'#8b0000', warm:'#f39c12', triumph:'#2ecc71', epilogue:'#ffd700',
    };
    const moodLabels = {
      mystery:'悬疑', tense:'紧张', solemn:'庄重', battle:'激战',
      dark:'黑暗', warm:'温情', triumph:'胜利', epilogue:'终章',
    };
    const glow = moodGlow[beat.mood] || 'rgba(233,69,96,0.5)';
    const mc = moodColors[beat.mood] || '#888';
    const ml = moodLabels[beat.mood] || '';

    // 顶部光晕扫线（极短，150ms，纯装饰）
    const flashLine = document.createElement('div');
    flashLine.style.cssText = `
      position:fixed;top:0;left:0;right:0;height:3px;
      background:linear-gradient(90deg,transparent,${glow},transparent);
      z-index:9995;pointer-events:none;opacity:0;
      transition:opacity 0.08s ease;
    `;
    document.body.appendChild(flashLine);
    requestAnimationFrame(() => {
      flashLine.style.opacity = '1';
      setTimeout(() => {
        flashLine.style.transition = 'opacity 0.15s ease';
        flashLine.style.opacity = '0';
        setTimeout(() => {
          flashLine.remove();
          this._openDialogBox(beat, onDone, /*isReview*/ false);
        }, 150);
      }, 80);
    });
  },

  /**
   * 核心 RPG 对话框（沉浸感升级版）
   * @param {object} beat
   * @param {function|null} onDone  - 全部翻完后回调（null则不推进）
   * @param {boolean} isReview     - 回顾模式
   */
  _openDialogBox(beat, onDone, isReview) {
    // 移除旧的
    ['sg-dialog','sg-dialog-bg','sg-dialog-particles'].forEach(id => {
      const old = document.getElementById(id);
      if (old) old.remove();
    });

    const dialogues = beat.dialogues && beat.dialogues.length
      ? beat.dialogues
      : [{ speaker: '旁白', avatar: '📜', text: beat.narrative }];


    const mood = beat.mood || 'mystery';
    const moodLabels = { mystery:'悬疑', tense:'紧张', solemn:'庄重', battle:'激战', dark:'黑暗', warm:'温情', triumph:'胜利', epilogue:'终章' };
    const moodColors = { mystery:'#9b59b6', tense:'#e74c3c', solemn:'#4a9eff', battle:'#ff6b35', dark:'#8b0000', warm:'#f39c12', triumph:'#2ecc71', epilogue:'#ffd700' };
    const ml = moodLabels[mood] || '';
    const mc = moodColors[mood] || '#9b59b6';
    const ch = this.currentChapter();
    let pageIdx = 0;
    let typing = false;
    let typeTimer = null;

    // ── 粒子层（canvas） ────────────────────────────────
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'sg-dialog-particles';
    particleCanvas.width  = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    document.body.appendChild(particleCanvas);
    requestAnimationFrame(() => particleCanvas.classList.add('sg-dialog-show'));
    this._startParticles(particleCanvas, mood);

    // ── 背景蒙层 ────────────────────────────────────────
    const bg = document.createElement('div');
    bg.id = 'sg-dialog-bg';
    document.body.appendChild(bg);
    requestAnimationFrame(() => bg.classList.add('sg-dialog-show'));

    // ── 对话框主体 ──────────────────────────────────────
    const el = document.createElement('div');
    el.id = 'sg-dialog';
    el.setAttribute('data-mood', mood);
    el.innerHTML = `
      <div id="sg-dialog-header">
        <span class="sg-dh-chapter">${ch ? ch.title : ''}</span>
        <span class="sg-dh-beat">${beat.title}</span>
        ${ml ? `<span class="sg-dh-mood" style="color:${mc};border-color:${mc}50;background:${mc}18">【${ml}】</span>` : ''}
      </div>
      <div id="sg-dialog-box">
        <div id="sg-dialog-speaker-row">
          <div id="sg-dialog-avatar"></div>
          <div id="sg-dialog-speaker"></div>
          <div id="sg-dialog-pages"></div>
        </div>
        <div id="sg-dialog-text"></div>
        <div id="sg-dialog-actions">
          <button id="sg-dialog-skip">${isReview ? '关闭' : '跳过'}</button>
          <button id="sg-dialog-next">▶ 继续</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    const avatarEl = el.querySelector('#sg-dialog-avatar');
    const speakerEl = el.querySelector('#sg-dialog-speaker');
    const pagesEl   = el.querySelector('#sg-dialog-pages');
    const textEl    = el.querySelector('#sg-dialog-text');
    const nextBtn   = el.querySelector('#sg-dialog-next');
    const skipBtn   = el.querySelector('#sg-dialog-skip');

    // 关闭函数
    const closeDialog = () => {
      if (typeTimer) clearTimeout(typeTimer);
      if (this._portraitTimer) { clearInterval(this._portraitTimer); this._portraitTimer = null; }
      this._stopParticles(particleCanvas);
      el.classList.remove('sg-dialog-show');
      bg.classList.remove('sg-dialog-show');
      particleCanvas.classList.remove('sg-dialog-show');
      setTimeout(() => { el.remove(); bg.remove(); particleCanvas.remove(); }, 420);
    };

    // 渲染一页对话
    const renderPage = (idx) => {
      const d = dialogues[idx];
      if (!d) return;

      const isNarrator = (d.speaker === '旁白');
      const isPlayer   = (d.speaker === '你' || d.speaker === '你（心中）');
      const isInner    = (d.speaker && d.speaker.includes('（心中）'));
      el.classList.toggle('sg-narrator', isNarrator);

      // 说话人颜色：旁白=蓝灰 / 玩家内心=金黄 / 主角=白色 / 敌方=红色 / 正道=翠绿
      const spkStyle = isNarrator
        ? 'color:#7090a8;font-style:italic'
        : isInner
          ? 'color:#ffd700;font-style:italic'
          : d.speaker && d.speaker.includes('骨冥子') || d.speaker && d.speaker.includes('血骨门')
            ? 'color:#e06060'
            : d.speaker && d.speaker.includes('鹤隐') || d.speaker && d.speaker.includes('方丈') || d.speaker && d.speaker.includes('掌门')
              ? 'color:#80c880'
              : 'color:var(--sg-accent)';

      // 立绘弹跳动效 + ASCII 帧动画渲染
      // 先清除上一轮帧动画定时器
      if (this._portraitTimer) { clearInterval(this._portraitTimer); this._portraitTimer = null; }
      // 清除上一轮特效类
      avatarEl.className = avatarEl.className.replace(/sg-portrait-\S+/g, '').trim();

      avatarEl.classList.remove('sg-speaking');
      void avatarEl.offsetWidth; // reflow
      const portrait = getStoryCharPortrait(d.speaker);
      if (portrait) {
        // 使用 ASCII 立绘，颜色跟随角色
        const preStyle = 'margin:0;font-size:12px;line-height:1.35;font-family:\'Courier New\',Courier,monospace;color:' + portrait.color;
        const frames = portrait.frames || null;
        if (frames && frames.length > 1) {
          // 多帧循环动画
          let frameIdx = 0;
          const preEl = document.createElement('pre');
          preEl.setAttribute('style', preStyle);
          preEl.textContent = frames[0].join('\n');
          avatarEl.innerHTML = '';
          avatarEl.appendChild(preEl);
          this._portraitTimer = setInterval(() => {
            frameIdx = (frameIdx + 1) % frames.length;
            if (preEl.parentNode) preEl.textContent = frames[frameIdx].join('\n');
          }, 900);
        } else {
          avatarEl.innerHTML = '<pre style="' + preStyle + '">' + portrait.ascii.join('\n') + '</pre>';
        }
        avatarEl.style.borderColor = portrait.color;
        // 如果有特效类，加入（CSS effect 类自己控制 box-shadow）
        if (portrait.effect) {
          avatarEl.classList.add(portrait.effect);
          avatarEl.style.boxShadow = ''; // CSS 类接管 shadow
        } else {
          avatarEl.style.boxShadow = '0 0 16px ' + portrait.color + '40, inset 0 0 10px rgba(0,0,0,0.3)';
        }
      } else {
        // 回退到 emoji
        avatarEl.innerHTML = '';
        avatarEl.textContent = d.avatar || '•';
        avatarEl.style.borderColor = '';
        avatarEl.style.boxShadow = '';
      }
      avatarEl.classList.add('sg-speaking');

      // 角色切换时：在立绘位置触发一小波彩色粒子
      if (portrait && particleCanvas._sgBurst) {
        const rect = avatarEl.getBoundingClientRect();
        particleCanvas._sgBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, portrait.color, 8);
      }

      // 说话人滑入 + 颜色
      speakerEl.classList.remove('sg-spk-in');
      void speakerEl.offsetWidth;
      speakerEl.textContent = d.speaker;
      speakerEl.setAttribute('style', spkStyle);
      speakerEl.classList.add('sg-spk-in');

      pagesEl.textContent = `${idx + 1} / ${dialogues.length}`;

      // 每段可独立定义 mood
      if (d.mood) {
        el.setAttribute('data-mood', d.mood);
        // 同步切换粒子颜色
        if (particleCanvas._sgMoodChange) particleCanvas._sgMoodChange(d.mood);
      }

      // 文字区样式：旁白斜体 / 内心独白金色斜体 / 其他默认
      textEl.classList.toggle('sg-inner', isInner);
      if (isNarrator) {
        textEl.setAttribute('style', 'color:#7090a8;font-style:italic;text-indent:1em');
      } else if (isInner) {
        textEl.setAttribute('style', 'color:#ffd080;font-style:italic');
      } else {
        textEl.setAttribute('style', '');
      }
      textEl.textContent = '';
      textEl.classList.add('typing');
      nextBtn.classList.remove('sg-pulse');
      nextBtn.textContent = '▌ 跳过打字';

      typing = true;
      let i = 0;
      const text = d.text;
      // battle/tense 下打字速度更快（紧张感）
      const speed = isNarrator ? 26 : (['battle','tense'].includes(el.getAttribute('data-mood')) ? 22 : 30);

      const typeChar = () => {
        if (i < text.length) {
          textEl.textContent += text[i++];
          typeTimer = setTimeout(typeChar, speed);
        } else {
          typing = false;
          textEl.classList.remove('typing');
          const isLast = (idx === dialogues.length - 1);
          nextBtn.textContent = isLast ? (isReview ? '关闭' : '✦ 完成') : '继续 ▶';
          nextBtn.classList.add('sg-pulse');
        }
      };
      setTimeout(typeChar, 180);
    };

    // 下一页/完成
    const advancePage = () => {
      if (typing) {
        if (typeTimer) clearTimeout(typeTimer);
        typing = false;
        textEl.classList.remove('typing');
        textEl.textContent = dialogues[pageIdx].text;
        const isLast = (pageIdx === dialogues.length - 1);
        nextBtn.textContent = isLast ? (isReview ? '关闭' : '✦ 完成') : '继续 ▶';
        nextBtn.classList.add('sg-pulse');
        return;
      }

      pageIdx++;
      if (pageIdx < dialogues.length) {
        renderPage(pageIdx);
      } else {
        closeDialog();
        if (!isReview && typeof onDone === 'function') {
          setTimeout(onDone, 340);
        }
      }
    };

    nextBtn.addEventListener('click', advancePage);
    skipBtn.addEventListener('click', () => {
      if (typeTimer) clearTimeout(typeTimer);
      closeDialog();
      if (!isReview && typeof onDone === 'function') {
        setTimeout(onDone, 340);
      }
    });
    textEl.addEventListener('click', advancePage);

    requestAnimationFrame(() => el.classList.add('sg-dialog-show'));
    renderPage(0);
  },

  // ──────────────────────────────────────────────────────
  // 粒子引擎（轻量Canvas）
  // ──────────────────────────────────────────────────────

  /** 根据 mood 启动对应粒子效果 */
  _startParticles(canvas, mood) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 粒子配置：各 mood 风格
    const configs = {
      mystery:  { count:55, color:'#9b59b6', colorAlt:'#6c3483', type:'float',  size:[1,3],  speed:[0.2,0.8],  alpha:[0.15,0.5] },
      tense:    { count:40, color:'#e94560', colorAlt:'#ff2255', type:'spark',  size:[1,2.5],speed:[0.8,2.2],  alpha:[0.2,0.6]  },
      solemn:   { count:50, color:'#4a9eff', colorAlt:'#1a6eff', type:'float',  size:[1,2],  speed:[0.15,0.6], alpha:[0.12,0.4] },
      battle:   { count:70, color:'#ff6b35', colorAlt:'#ffaa35', type:'ember',  size:[1,3],  speed:[1.0,3.0],  alpha:[0.3,0.8]  },
      dark:     { count:35, color:'#8b0000', colorAlt:'#c0392b', type:'drip',   size:[1,2],  speed:[0.5,1.5],  alpha:[0.2,0.5]  },
      warm:     { count:60, color:'#ffd700', colorAlt:'#f39c12', type:'float',  size:[1,2.5],speed:[0.2,0.7],  alpha:[0.15,0.45]},
      triumph:  { count:65, color:'#2ecc71', colorAlt:'#27ae60', type:'rise',   size:[1,3],  speed:[0.4,1.2],  alpha:[0.2,0.55] },
      epilogue: { count:80, color:'#ffd700', colorAlt:'#fff4a0', type:'star',   size:[1,3],  speed:[0.1,0.5],  alpha:[0.1,0.6]  },
    };
    const cfg = configs[mood] || configs.mystery;

    // 初始化粒子
    const W = canvas.width;
    const H = canvas.height;
    const particles = [];
    for (let i = 0; i < cfg.count; i++) {
      particles.push(this._makeParticle(cfg, W, H, true));
    }

    let running = true;
    canvas._sgStop = () => { running = false; };
    // 角色切换时的粒子爆发
    const bursts = [];
    canvas._sgBurst = (cx, cy, color, count) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = 1.5 + Math.random() * 2.5;
        bursts.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2,
          alpha: 0.7 + Math.random() * 0.3,
          color: color,
          life: 30 + Math.random() * 20,
          dead: false,
        });
      }
    };
    canvas._sgMoodChange = (newMood) => {
      const nc = configs[newMood];
      if (nc) {
        particles.forEach((p, i) => {
          const nc2 = configs[newMood] || cfg;
          p.color = Math.random() > 0.5 ? nc2.color : nc2.colorAlt;
        });
      }
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        this._updateParticle(p, cfg, W, H);
        this._drawParticle(ctx, p, cfg);
        // 死亡则重生
        if (p.dead) particles[i] = this._makeParticle(cfg, W, H, false);
      }
      // 渲染角色切换爆发粒子
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.96;
        b.vy *= 0.96;
        b.alpha -= 0.02;
        b.life--;
        if (b.life <= 0 || b.alpha <= 0) { bursts.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, b.alpha);
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * (b.alpha / 0.8), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },

  /** 停止粒子 */
  _stopParticles(canvas) {
    if (canvas && canvas._sgStop) canvas._sgStop();
  },

  /** 生成一个粒子 */
  _makeParticle(cfg, W, H, scattered) {
    const r = (a, b) => a + Math.random() * (b - a);
    const p = {
      x: r(0, W),
      y: scattered ? r(0, H) : (cfg.type === 'drip' ? r(0, H * 0.6) : H + 10),
      size: r(cfg.size[0], cfg.size[1]),
      alpha: r(cfg.alpha[0], cfg.alpha[1]),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      speed: r(cfg.speed[0], cfg.speed[1]),
      vx: r(-0.4, 0.4),
      life: r(80, 200),
      maxLife: 200,
      color: Math.random() > 0.5 ? cfg.color : cfg.colorAlt,
      dead: false,
      angle: r(0, Math.PI * 2),
      angleSpeed: r(-0.02, 0.02),
    };
    if (cfg.type === 'ember') {
      p.vy = -r(cfg.speed[0], cfg.speed[1]);
      p.vx = r(-1.5, 1.5);
    } else if (cfg.type === 'drip') {
      p.vy = r(cfg.speed[0], cfg.speed[1]);
    } else if (cfg.type === 'rise') {
      p.vy = -r(cfg.speed[0], cfg.speed[1]);
    } else if (cfg.type === 'spark') {
      p.vx = r(-2, 2);
      p.vy = r(-2, 2);
    } else {
      // float / star
      p.vy = -r(cfg.speed[0], cfg.speed[1]) * 0.5;
    }
    return p;
  },

  /** 更新粒子状态 */
  _updateParticle(p, cfg, W, H) {
    p.x += p.vx;
    p.y += p.vy;
    p.angle += p.angleSpeed;
    p.life--;

    // 闪烁
    p.alpha += p.alphaDir * 0.008;
    if (p.alpha >= cfg.alpha[1]) p.alphaDir = -1;
    if (p.alpha <= cfg.alpha[0]) p.alphaDir = 1;

    // 边界处理 & 死亡判断
    if (cfg.type === 'drip' && p.y > H + 10) p.dead = true;
    else if (cfg.type === 'ember' && (p.y < -10 || p.alpha < 0.02)) p.dead = true;
    else if (cfg.type === 'rise' && p.y < -10) p.dead = true;
    else if (p.life <= 0) p.dead = true;
    else if (p.x < -10) p.x = W + 10;
    else if (p.x > W + 10) p.x = -10;
  },

  /** 绘制单个粒子 */
  _drawParticle(ctx, p, cfg) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.strokeStyle = p.color;

    if (cfg.type === 'star') {
      // 四角星
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      const s = p.size;
      ctx.moveTo(0, -s*1.8); ctx.lineTo(s*0.4, -s*0.4);
      ctx.lineTo(s*1.8, 0);  ctx.lineTo(s*0.4, s*0.4);
      ctx.lineTo(0, s*1.8);  ctx.lineTo(-s*0.4, s*0.4);
      ctx.lineTo(-s*1.8, 0); ctx.lineTo(-s*0.4, -s*0.4);
      ctx.closePath();
      ctx.fill();
    } else if (cfg.type === 'drip') {
      // 小液滴
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      // 拖尾
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x, p.y - p.size - p.size * 2);
      ctx.lineWidth = p.size * 0.6;
      ctx.globalAlpha *= 0.4;
      ctx.stroke();
    } else {
      // 圆形（通用）
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  },

  _showTransition(newChapterId) {
    const newChapter = STORY_CHAPTERS[newChapterId];
    if (!newChapter) return;

    const summaryMap = {
      ch2: '玄铁令的踪迹，将把你带向三座城市……',
      ch3: '正道会盟，却藏着不为人知的内鬼……',
      ch4: '孤身深入虎穴，只为取得那份铁证……',
      ch5: '决战时刻，血与铁的终章……',
      ch6: '风雨之后，是新的江湖。',
    };
    const summary = summaryMap[newChapterId] || '';

    const el = document.createElement('div');
    el.id = 'sg-transition';
    el.innerHTML = `
      <div class="sg-t-glitch"></div>
      <div class="sg-t-glitch"></div>
      <div class="sg-t-glitch"></div>
      <div class="sg-t-line"></div>
      <div class="sg-t-chapter">— 新章节 —</div>
      <div class="sg-t-title">${newChapter.title}</div>
      ${summary ? `<div class="sg-t-summary">${summary}</div>` : ''}
      <div class="sg-t-bar"></div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('sg-transition-show'));
    setTimeout(() => {
      el.classList.remove('sg-transition-show');
      setTimeout(() => el.remove(), 800);
    }, 4200);
  },

  _showEnd() {
    // 统计各章完成情况
    const chapters = Object.values(STORY_CHAPTERS);
    const chStats = chapters.map(ch => {
      const beatCount = (ch.beats || []).length;
      return { title: ch.title, count: beatCount };
    });
    const totalBeats = chStats.reduce((s, c) => s + c.count, 0);

    // 关键人物结局
    const castSummary = [
      { avatar:'🧓', name:'鹤隐',     fate:'悄然离去，下落成谜',     color:'#4a9eff' },
      { avatar:'💀', name:'骨冥子',    fate:'血骨门覆灭，邪不胜正',   color:'#e74c3c' },
      { avatar:'🙏', name:'少林方丈',  fate:'正道盟主，武林安定',     color:'#f39c12' },
      { avatar:'⛰️', name:'武当掌门',  fate:'联盟元老，再现和平',    color:'#1abc9c' },
      { avatar:'🧍', name:'你',        fate:'江湖路远，征途未止',     color:'#ffd700' },
    ];

    let castHtml = castSummary.map(c => `
      <div class="sge-cast-item">
        <div class="sge-cast-avatar" style="border-color:${c.color};color:${c.color}">${c.avatar}</div>
        <div class="sge-cast-name" style="color:${c.color}">${c.name}</div>
        <div class="sge-cast-fate">${c.fate}</div>
      </div>`).join('');

    let chStatsHtml = chStats.map((c, i) =>
      `<span class="sge-ch-stat" style="border-color:${['#9b59b6','#e67e22','#3498db','#e74c3c','#e91e63','#ffd700'][i]||'#ccc'}50">
        ${c.title}（${c.count}幕）
      </span>`
    ).join('');

    const el = document.createElement('div');
    el.id = 'sg-end';
    el.innerHTML = `
      <!-- 星光粒子 canvas -->
      <canvas id="sge-particles" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0"></canvas>

      <div class="sge-inner" style="position:relative;z-index:1;text-align:center;display:flex;flex-direction:column;align-items:center;gap:0">

        <!-- 标题 -->
        <div class="sge-title-block">
          <div class="sge-tag">第一卷 · 完</div>
          <div class="sge-title">🏆 血雨腥风 · 终章</div>
          <div class="sge-sub">江湖的故事，从未真正结束……</div>
        </div>

        <!-- 人物结局 -->
        <div class="sge-cast-grid">${castHtml}</div>

        <!-- 章节回顾 -->
        <div class="sge-chapters">${chStatsHtml}</div>
        <div class="sge-total">共 ${totalBeats} 幕 · 全部完成 ✦</div>

        <!-- 悬念 -->
        <div class="sge-teaser">
          <div class="sge-teaser-label">🔮 下一卷预告</div>
          <div class="sge-teaser-text">"真正的幕后黑手，在北疆……"</div>
          <div class="sge-teaser-hint">鹤隐的身影消失在夜色里。江湖路远，征途未止。</div>
        </div>

        <!-- 按钮 -->
        <div class="sge-actions">
          <button class="sge-btn-replay" onclick="StoryGuide.reset(); document.getElementById('sg-end').remove();">🔄 再走一遍</button>
          <button class="sge-btn-story" onclick="document.getElementById('sg-end').remove();if(typeof townOpenStoryPanel==='function')townOpenStoryPanel();">📜 看剧情回顾</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('sg-end-show'));

    // 粒子动画
    setTimeout(() => this._runEndParticles(), 100);
  },

  /** 结尾粒子 */
  _runEndParticles() {
    const canvas = document.getElementById('sge-particles');
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.5 + 0.2,
      drift: (Math.random() - 0.5) * 0.3,
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,${Math.floor(Math.random()*100+155)},${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    // 存储以便清理
    canvas._animId = animId;
  },

  /**
   * 生成任务面板内嵌主线指引区块的 HTML（供 _tqBuildHtml 调用）
   * 返回空字符串表示主线未激活或已结束
   */
  buildBannerHtml() {
    const beat = this.current();
    if (!beat) return '';
    const ch = this.currentChapter();
    const progress = this.progress();
    const icon = this._typeIcon(beat.type);
    const chTitle = ch ? ch.title : '';
    const moodColors = {
      mystery:'#9b59b6', tense:'#e74c3c', solemn:'#4a9eff', battle:'#ff6b35',
      dark:'#8b0000', warm:'#f39c12', triumph:'#2ecc71', epilogue:'#ffd700',
    };
    const moodLabels = {
      mystery:'悬疑', tense:'紧张', solemn:'庄重', battle:'激战',
      dark:'黑暗', warm:'温情', triumph:'胜利', epilogue:'终章',
    };
    const mc = moodColors[beat.mood] || '#888';
    const ml = moodLabels[beat.mood] || '';
    return `<div id="sg-quest-banner" onclick="StoryGuide._showDetail(StoryGuide.current())">
      <div class="sg-chapter-tag">${chTitle}${ml ? `<span style="color:${mc};font-size:9px;margin-left:6px">[${ml}]</span>` : ''}</div>
      <div class="sg-beat-title" style="color:${mc}">📜 ${beat.title}</div>
      <div class="sg-hint-bar">
        <span class="sg-hint-icon">${icon}</span>
        <span>${beat.hint}</span>
      </div>
      <div class="sg-banner-footer">
        <span class="sg-progress">${progress}</span>
        <span class="sg-banner-tap">点击查看详情 ▸</span>
      </div>
    </div>`;
  },

  _hideCard() {
    this._removeCard();
  },



  // ══════════════════════════════════════════════════════
  // 辅助工具
  // ══════════════════════════════════════════════════════

  _typeIcon(type) {
    return { travel:'📍', talk:'💬', dungeon:'⚔️', boss:'👹', escort:'🛡', narrate:'📖' }[type] || '•';
  },

  _cityMatches(cityId, targetName) {
    if (!cityId || !targetName) return false;
    // cityId 可能是英文ID（如'luoyang'）或中文名（如'洛阳城'）
    // targetName 是中文名（如'洛阳'）
    try {
      if (typeof WORLD_NODES !== 'undefined') {
        // 策略1：找到当前城市节点，对比 name 是否含 targetName
        const node = WORLD_NODES[cityId];
        if (node) {
          const name = node.name.replace('城','').replace('寺','').replace('山','').replace('关','').replace('镇','');
          const tn = targetName.replace('城','').replace('寺','').replace('山','').replace('关','').replace('镇','');
          if (name === tn || name.includes(tn) || tn.includes(name)) return true;
        }
        // 策略2：遍历 WORLD_NODES 找匹配的 name
        for (const id in WORLD_NODES) {
          const n = WORLD_NODES[id];
          const nodeName = n.name.replace('城','').replace('寺','').replace('山','').replace('关','').replace('镇','').replace('·','').replace('·','');
          const tn2 = targetName.replace('城','').replace('寺','').replace('山','').replace('关','').replace('镇','').replace('·','').replace('·','');
          if ((id === cityId || id === targetName) &&
              (nodeName === tn2 || nodeName.includes(tn2) || tn2.includes(nodeName))) {
            return true;
          }
        }
      }
    } catch(e) {}
    // 回退：直接比较（双方先去除"城"字再比较）
    const cn = cityId.replace('城','').trim();
    const tn = targetName.replace('城','').trim();
    return cn === tn || cn.includes(tn) || tn.includes(cn);
  },

  _narrateTargetCity(beat) {
    // narrate 类型中隐含了城市信息（从 hint 推断或 nextBeat 推断）
    // 简单策略：读取下一个 beat 的 target
    const next = beat.nextBeat ? STORY_BEATS[beat.nextBeat] : null;
    return next?.target || null;
  },

  _getCurrentCity() {
    try {
      // 优先用全局变量 travelCurrentCity（城市ID，如 'luoyang'）
      if (typeof travelCurrentCity !== 'undefined' && travelCurrentCity) {
        return travelCurrentCity;
      }
      // 备用：读 WORLD_NODES 的 name（中文城市名）
      if (typeof WORLD_NODES !== 'undefined' && typeof travelCurrentCity !== 'undefined' && WORLD_NODES[travelCurrentCity]) {
        return WORLD_NODES[travelCurrentCity].name;
      }
    } catch(e) {}
    return null;
  },

  // ══════════════════════════════════════════════════════
  // 调试工具
  // ══════════════════════════════════════════════════════

  debug() {
    console.log('═══ StoryGuide 调试 ═══');
    console.log('当前节点:', this.current());
    console.log('当前章节:', this.currentChapter());
    console.log('进度:', this.progress());
    console.log('完整状态:', this.state);
    return this.state;
  },

  /** 跳转到指定节点（调试用） */
  jump(beatId) {
    if (!STORY_BEATS[beatId]) { console.warn('[StoryGuide] 未知节点:', beatId); return; }
    this.state.currentBeat = beatId;
    this.state.narrativeShown = false;
    this._save();
    this._onNewBeat(STORY_BEATS[beatId], '跳转');
  },
};


// ═══════════════════════════════════════════════════════════════════════════
// 全局导出
// ═══════════════════════════════════════════════════════════════════════════

window.StoryGuide = StoryGuide;
window.SG = StoryGuide;  // 短别名

// 手动触发接口（供游戏代码调用）
window.SGTalk    = (n) => StoryGuide.talk(n);
window.SGDungeon = (n) => StoryGuide.dungeon(n);
window.SGBoss    = (n) => StoryGuide.boss(n);

console.log('[StoryGuide] 纯叙事指引模块已加载（需手动 init + start）');
