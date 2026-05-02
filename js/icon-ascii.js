// icon-ascii.js — 统一字符画图标库
// 替换所有表情符号为风格一致的ASCII艺术
// 风格：使用 ▔▀▄█▂▃▅ 等方块字符 + 简单线条符号

const ASCII_ICONS = {
  // ═══════════════════════════════════════════
  // 功能/建筑图标 (用于城市服务按钮)
  // ═══════════════════════════════════════════
  
  // 旅店 — 屋顶+门
  inn: { 
    art: '╭─┬─╮\n│▓▓▓│\n╰─┴─╯', 
    single: '⌂',
    label: '旅店' 
  },
  
  // 商店 — 货架
  shop: { 
    art: '┌─┬─┐\n│█│█│\n└─┴─┘', 
    single: '▤',
    label: '商店' 
  },
  
  // 铁匠 — 铁砧+锤子
  blacksmith: { 
    art: ' ▓▓ \n╱██╲\n ▔▔ ', 
    single: '⚒',
    label: '铁匠' 
  },
  
  // 集市 — 摊位
  market: { 
    art: '╱▀▀╲\n│货│\n└──┘', 
    single: '⛺',
    label: '集市' 
  },
  
  // 镖局 — 旗帜
  guild: { 
    art: '▓▓▓\n▓▓▓\n│ │', 
    single: '⚑',
    label: '镖局' 
  },
  
  // 医馆 — 十字
  hospital: { 
    art: ' ▓▓ \n▓██▓\n ▓▓ ', 
    single: '+',
    label: '医馆' 
  },
  
  // 草药店 — 草药
  herbalism: { 
    art: ' ╱╲ \n╱☘╲\n ▔▔ ', 
    single: '☘',
    label: '草药店' 
  },
  
  // 铁匠铺 — 锻造
  forge: { 
    art: ' ▓▓\n╱██╲\n ▔▔ ', 
    single: '⚒',
    label: '铁匠铺' 
  },
  
  // 酒馆 — 酒坛
  tavern: { 
    art: '╭──╮\n│酒│\n╰──╯', 
    single: '☕',
    label: '酒馆' 
  },
  
  // 棋社 — 棋盘
  chess: { 
    art: '┌┬┬┐\n├┼┼┤\n└┴┴┘', 
    single: '◈',
    label: '棋社' 
  },
  
  // ═══════════════════════════════════════════
  // 小游戏图标
  // ═══════════════════════════════════════════
  
  // 赌坊 — 骰子
  gambling: { 
    art: '┌───┐\n│ ● │\n└───┘', 
    single: '⚀',
    label: '赌坊' 
  },
  
  // 钓鱼 — 鱼竿+鱼
  fishing: { 
    art: '╱─╲\n│ ◊│\n╲─╱', 
    single: '⌇',
    label: '垂钓' 
  },
  
  // 擂台 — 比武台
  arena: { 
    art: '╔═══╗\n║武║\n╚═══╝', 
    single: '⚔',
    label: '擂台' 
  },
  
  // 投壶 — 壶+箭
  pitchpot: { 
    art: ' ╱╲ \n╭──╮\n│  │', 
    single: '⌸',
    label: '投壶' 
  },
  
  // 斗蛐蛐 — 蟋蟀
  cricket: { 
    art: '  ╱╲\n ╱◉╲\n╱    ╲', 
    single: '≋',
    label: '斗蛐蛐' 
  },
  
  // ═══════════════════════════════════════════
  // 状态图标 (用于状态栏)
  // ═══════════════════════════════════════════
  
  // 气血/生命 — 心形
  hp: { 
    art: '▓▓▓\n▓▓▓\n ▓ ', 
    single: '♥',
    label: '气血' 
  },
  
  // 内力 — 气旋
  mp: { 
    art: ' ◎ \n◉◉◉\n ◎ ', 
    single: '◎',
    label: '内力' 
  },
  
  // 精力 — 闪电
  energy: { 
    art: ' ╱╲\n╱  ╲\n  ╱ ', 
    single: '⚡',
    label: '精力' 
  },
  
  // 饱食度 — 米饭碗
  food: { 
    art: ' ▓▓ \n╱饭╲\n╰──╯', 
    single: '▣',
    label: '饱食' 
  },
  
  // 口渴度 — 水滴
  water: { 
    art: ' ▓ \n▓▓▓\n ▓ ', 
    single: '💧',
    label: '口渴' 
  },
  
  // 银两 — 铜钱
  silver: { 
    art: ' ╭─╮\n│钱│\n ╰─╯', 
    single: '◎',
    label: '银两' 
  },
  
  // 经验 — 星星
  exp: { 
    art: ' ▲ \n▲▲▲\n ▲ ', 
    single: '★',
    label: '经验' 
  },
  
  // 等级 — 阶梯
  level: { 
    art: '  ▓\n ▓▓\n▓▓▓', 
    single: '▲',
    label: '等级' 
  },
  
  // ═══════════════════════════════════════════
  // 物品类型图标
  // ═══════════════════════════════════════════
  
  // 武器 — 剑
  weapon: { 
    art: ' ▓\n▓▓▓\n ▓', 
    single: '⚔',
    label: '武器' 
  },
  
  // 护甲 — 盾牌
  armor: { 
    art: '╭──╮\n│██│\n╰──╯', 
    single: '🛡',
    label: '护甲' 
  },
  
  // 秘籍 — 书卷
  manual: { 
    art: '┌─┐\n│书│\n└─┘', 
    single: '📜',
    label: '秘籍' 
  },
  
  // 药品 — 药瓶
  potion: { 
    art: ' ╭╮\n│药│\n╰─╯', 
    single: '⚱',
    label: '药品' 
  },
  
  // 材料 — 矿石
  material: { 
    art: '╱▓╲\n▓▓▓\n╲▓╱', 
    single: '◆',
    label: '材料' 
  },
  
  // 食物 — 肉
  food_item: { 
    art: ' ╱▓╲\n▓▓▓▓\n ╰─╯', 
    single: '☖',
    label: '食物' 
  },
  
  // ═══════════════════════════════════════════
  // 界面控件图标
  // ═══════════════════════════════════════════
  
  // 背包
  bag: { 
    art: '╭──╮\n│  │\n╰──╯', 
    single: '☐',
    label: '背包' 
  },
  
  // 任务
  quest: { 
    art: '┌─┐\n│！│\n└─┘', 
    single: '!',
    label: '任务' 
  },
  
  // 地图
  map: { 
    art: '┌┬┐\n├┼┤\n└┴┘', 
    single: '▦',
    label: '地图' 
  },
  
  // 出城/战斗
  exit: { 
    art: '▶▶▶', 
    single: '▶',
    label: '出城' 
  },
  
  // 关闭
  close: { 
    art: '╳', 
    single: '×',
    label: '关闭' 
  },
  
  // 返回
  back: { 
    art: '◀', 
    single: '←',
    label: '返回' 
  },
  
  // 确认/完成
  confirm: { 
    art: '✓', 
    single: '✓',
    label: '确认' 
  },
  
  // 锁定
  locked: { 
    art: '┌─┐\n│▓│\n└─┘', 
    single: '🔒',
    label: '锁定' 
  },
  
  // 声音
  sound: { 
    art: '▶)', 
    single: '♪',
    label: '声音' 
  },
  
  // 静音
  mute: { 
    art: '▶)╱', 
    single: '◌',
    label: '静音' 
  },
  
  // ═══════════════════════════════════════════
  // 门派图标
  // ═══════════════════════════════════════════
  
  // 少林
  sect_shaolin: { 
    art: '卍', 
    single: '卍',
    label: '少林' 
  },
  
  // 武当
  sect_wudang: { 
    art: '☯', 
    single: '☯',
    label: '武当' 
  },
  
  // 华山
  sect_huashan: { 
    art: '▲', 
    single: '▲',
    label: '华山' 
  },
  
  // 明教
  sect_mingjiao: { 
    art: '☀', 
    single: '☀',
    label: '明教' 
  },
  
  // 五毒
  sect_wudu: { 
    art: '☠', 
    single: '☠',
    label: '五毒' 
  },
  
  // 唐门
  sect_tangmen: { 
    art: '◈', 
    single: '◈',
    label: '唐门' 
  },
  
  // 桃花岛
  sect_taohua: { 
    art: '✿', 
    single: '✿',
    label: '桃花岛' 
  },
  
  // 逍遥
  sect_xiaoyao: { 
    art: '～', 
    single: '～',
    label: '逍遥' 
  },
  
  // ═══════════════════════════════════════════
  // 品质/稀有度图标
  // ═══════════════════════════════════════════
  
  // 普通
  rarity_common: { 
    art: '●', 
    single: '●',
    label: '普通' 
  },
  
  // 优秀
  rarity_uncommon: { 
    art: '◆', 
    single: '◆',
    label: '优秀' 
  },
  
  // 稀有
  rarity_rare: { 
    art: '★', 
    single: '★',
    label: '稀有' 
  },
  
  // 史诗
  rarity_epic: { 
    art: '✦', 
    single: '✦',
    label: '史诗' 
  },
  
  // 传说
  rarity_legendary: { 
    art: '✹', 
    single: '✹',
    label: '传说' 
  },
};

// ═══════════════════════════════════════════
// 便捷获取函数
// ═══════════════════════════════════════════

/**
 * 获取图标（返回单行字符）
 * @param {string} key - 图标键名
 * @param {string} fallback - 回退字符
 * @returns {string}
 */
function getIcon(key, fallback = '?') {
  const icon = ASCII_ICONS[key];
  return icon ? icon.single : fallback;
}

/**
 * 获取图标艺术字（多行）
 * @param {string} key - 图标键名
 * @returns {string|null}
 */
function getIconArt(key) {
  const icon = ASCII_ICONS[key];
  return icon ? icon.art : null;
}

/**
 * 获取图标标签
 * @param {string} key - 图标键名
 * @returns {string}
 */
function getIconLabel(key) {
  const icon = ASCII_ICONS[key];
  return icon ? icon.label : key;
}

/**
 * 创建带图标的按钮HTML
 * @param {string} iconKey - 图标键名
 * @param {string} text - 按钮文字
 * @param {string} onclick - 点击事件
 * @param {Object} options - 额外选项
 * @returns {string}
 */
function createIconButton(iconKey, text, onclick, options = {}) {
  const icon = getIcon(iconKey, '·');
  const { className = '', locked = false } = options;
  const lockIcon = locked ? '<span class="ascii-lock">' + getIcon('locked') + '</span>' : '';
  return `<button class="ascii-btn ${className}" onclick="${onclick}">${lockIcon}<span class="ascii-icon">${icon}</span> ${text}</button>`;
}

/**
 * 创建图标标签HTML
 * @param {string} iconKey - 图标键名
 * @param {string} text - 标签文字
 * @returns {string}
 */
function createIconLabel(iconKey, text) {
  const icon = getIcon(iconKey, '·');
  return `<span class="ascii-label"><span class="ascii-icon">${icon}</span> ${text}</span>`;
}

// ═══════════════════════════════════════════
// 导出（兼容模块化和全局）
// ═══════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ASCII_ICONS, getIcon, getIconArt, getIconLabel, createIconButton, createIconLabel };
}
