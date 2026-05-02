// ════════════════════════════════════════════════════
//  enemy-avatar-generator.js
//  敌人类型多状态字符画生成器
//  按玩家/NPC风格（stand/attack/heavy/hit/down）
// ════════════════════════════════════════════════════

// 敌人类型模板库
const AVATAR_TEMPLATES = {
  // ── 野兽类 ──
  beast: {
    // 狼型
    wolf: {
      stand: (opts={}) => `  ${opts.marks || '~~'}
 ╭${opts.eyes || '◎_◎'}╮
 ${opts.body || '（狼）'}
 ╰──┬──╯
${opts.feet || '~~┿~~'}`,
      attack: (opts={}) => [` ╭${opts.eyes || '◎_◎'}╮\n${opts.attackMark || '─'}${opts.body || '（狼）'}${opts.attackMark || '爪'}\n ╰──┬──╯`,
                          ` ╭${opts.eyes || '◎_◎'}╮\n ${opts.body || '（狼）'}\n ╰──┬──╯${opts.attackMark || '─爪'}`],
      heavy: (opts={}) => ` ${(opts.marks || '~~').repeat(3)}\n╭${opts.eyes || '◎_◎'}╮\n│${opts.body || '（狼）'}│\n╰─┬─╯\n${opts.feet || '~~'}━━┿━━${opts.feet || '~~'}`,
      hit: (opts={}) => [` ╭${opts.hitEyes || '◎_◉'}╮\n>${opts.body || '（狼）'}\n ╰──┬──╯`,
                        ` ╭${opts.hitEyes || '◉_◎'}╮\n ${opts.body || '（狼）'}<\n ╰──┬──╯`],
      down: (opts={}) => ` (${opts.downEyes || '◎─◎'})\n ${opts.body || '（狼）'}\n ══════`,
      parts: {head:2, body:'（狼）', arms:3, legs:4, aura:5}
    },
    
    // 虎型
    tiger: {
      stand: (opts={}) => `  ${opts.marks || '══'}
 ╭${opts.eyes || '◉‿◉'}╮
 ${opts.body || '（虎）'}
 ╰──┬──╯
${opts.feet || '══┿══'}`,
      attack: (opts={}) => [` ╭${opts.eyes || '◉‿◉'}╮\n${opts.attackMark || '─'}${opts.body || '（虎）'}${opts.attackMark || '扑'}\n ╰──┬──╯`,
                          ` ╭${opts.eyes || '◉‿◉'}╮\n ${opts.body || '（虎）'}\n ╰──┬──╯${opts.attackMark || '─扑'}`],
      heavy: (opts={}) => ` ${(opts.marks || '══').repeat(3)}\n╭${opts.eyes || '◉‿◉'}╮\n│${opts.body || '（虎）'}│\n╰─┬─╯\n${opts.feet || '══'}━━┿━━${opts.feet || '══'}`,
      hit: (opts={}) => [` ╭${opts.hitEyes || '◉_◉'}╮\n>${opts.body || '（虎）'}\n ╰──┬──╯`,
                        ` ╭${opts.hitEyes || '◉_◉'}╮\n ${opts.body || '（虎）'}<\n ╰──┬──╯`],
      down: (opts={}) => ` (${opts.downEyes || '◉─◉'})\n ${opts.body || '（虎）'}\n ══════`,
      parts: {head:2, body:'（虎）', arms:3, legs:4, aura:5}
    },
    
    // 熊型
    bear: {
      stand: (opts={}) => `  ${opts.marks || '▓▓'}
 ╭${opts.eyes || '●_●'}╮
 ${opts.body || '（熊）'}
 ╰──┬──╯
${opts.feet || '▓▓┿▓▓'}`,
      attack: (opts={}) => [` ╭${opts.eyes || '●_●'}╮\n${opts.attackMark || '─'}${opts.body || '（熊）'}${opts.attackMark || '掌'}\n ╰──┬──╯`,
                          ` ╭${opts.eyes || '●_●'}╮\n ${opts.body || '（熊）'}\n ╰──┬──╯${opts.attackMark || '─掌'}`],
      heavy: (opts={}) => ` ${(opts.marks || '▓▓').repeat(3)}\n╭${opts.eyes || '●_●'}╮\n│${opts.body || '（熊）'}│\n╰─┬─╯\n${opts.feet || '▓▓'}━━┿━━${opts.feet || '▓▓'}`,
      hit: (opts={}) => [` ╭${opts.hitEyes || '●﹏●'}╮\n>${opts.body || '（熊）'}\n ╰──┬──╯`,
                        ` ╭${opts.hitEyes || '●﹏●'}╮\n ${opts.body || '（熊）'}<\n ╰──┬──╯`],
      down: (opts={}) => ` (${opts.downEyes || '●─●'})\n ${opts.body || '（熊）'}\n ══════`,
      parts: {head:1, body:'（熊）', arms:2, legs:3, aura:4}
    }
  },
  
  // ── 人形类 ──
  human: {
    // 普通山贼
    bandit: {
      stand: (opts={}) => `  ${opts.marks || '  '}
 ╭${opts.eyes || '⊙_⊙'}╮
 ${opts.body || '（贼）'}
 ╰──┬──╯
${opts.feet || '  ┿  '}`,
      attack: (opts={}) => [` ╭${opts.eyes || '⊙_⊙'}╮\n${opts.attackMark || '─'}${opts.body || '（贼）'}${opts.attackMark || '刀'}\n ╰──┬──╯`,
                          ` ╭${opts.eyes || '⊙_⊙'}╮\n ${opts.body || '（贼）'}\n ╰──┬──╯${opts.attackMark || '─刀'}`],
      heavy: (opts={}) => ` ${(opts.marks || '  ')}\n╭${opts.eyes || '⊙_⊙'}╮\n│${opts.body || '（贼）'}│\n╰─┬─╯\n${opts.feet || '  '}━━┿━━${opts.feet || '  '}`,
      hit: (opts={}) => [` ╭${opts.hitEyes || '⊙﹏⊙'}╮\n>${opts.body || '（贼）'}\n ╰──┬──╯`,
                        ` ╭${opts.hitEyes || '⊙﹏⊙'}╮\n ${opts.body || '（贼）'}<\n ╰──┬──╯`],
      down: (opts={}) => ` (${opts.downEyes || '⊙─⊙'})\n ${opts.body || '（贼）'}\n ══════`,
      parts: {head:4, body:'（贼）', arms:5, legs:6, aura:7}
    },
    
    // 精英战士
    elite: {
      stand: (opts={}) => `  ${opts.marks || '☯☯'}
 ╭${opts.eyes || '◉_◉'}╮
 ${opts.body || '（武）'}
 ╰──┬──╯
${opts.feet || '☯┿☯'}`,
      attack: (opts={}) => [` ╭${opts.eyes || '◉_◉'}╮\n${opts.attackMark || '─'}${opts.body || '（武）'}${opts.attackMark || '斩'}\n ╰──┬──╯`,
                          ` ╭${opts.eyes || '◉_◉'}╮\n ${opts.body || '（武）'}\n ╰──┬──╯${opts.attackMark || '─斩'}`],
      heavy: (opts={}) => ` ${(opts.marks || '☯☯')}\n╭${opts.eyes || '◉_◉'}╮\n│${opts.body || '（武）'}│\n╰─┬─╯\n${opts.feet || '☯☯'}━━┿━━${opts.feet || '☯☯'}`,
      hit: (opts={}) => [` ╭${opts.hitEyes || '◉_◉'}╮\n>${opts.body || '（武）'}\n ╰──┬──╯`,
                        ` ╭${opts.hitEyes || '◉_◉'}╮\n ${opts.body || '（武）'}<\n ╰──┬──╯`],
      down: (opts={}) => ` (${opts.downEyes || '◉─◉'})\n ${opts.body || '（武）'}\n ══════`,
      parts: {head:3, body:'（武）', arms:4, legs:5, aura:6}
    }
  },
  
  // ── 亡灵类 ──
  undead: {
    stand: (opts={}) => `  ${opts.marks || '☠☠'}
 ╭${opts.eyes || '◈_◈'}╮
 ${opts.body || '（亡）'}
 ╰──┬──╯
${opts.feet || '☠┿☠'}`,
    attack: (opts={}) => [` ╭${opts.eyes || '◈_◈'}╮\n${opts.attackMark || '─'}${opts.body || '（亡）'}${opts.attackMark || '魂'}\n ╰──┬──╯`,
                        ` ╭${opts.eyes || '◈_◈'}╮\n ${opts.body || '（亡）'}\n ╰──┬──╯${opts.attackMark || '─魂'}`],
    heavy: (opts={}) => ` ${(opts.marks || '☠☠')}\n╭${opts.eyes || '◈_◈'}╮\n│${opts.body || '（亡）'}│\n╰─┬─╯\n${opts.feet || '☠☠'}━━┿━━${opts.feet || '☠☠'}`,
    hit: (opts={}) => [` ╭${opts.hitEyes || '◈﹏◈'}╮\n>${opts.body || '（亡）'}\n ╰──┬──╯`,
                      ` ╭${opts.hitEyes || '◈﹏◈'}╮\n ${opts.body || '（亡）'}<\n ╰──┬──╯`],
    down: (opts={}) => ` (${opts.downEyes || '◈─◈'})\n ${opts.body || '（亡）'}\n ══════`,
    parts: {head:2, body:'（亡）', arms:3, legs:4, aura:5}
  },
  
  // ── 机关类 ──
  mechanism: {
    stand: (opts={}) => `  ${opts.marks || '⚙⚙'}
 ╭${opts.eyes || 'Θ_Θ'}╮
 ${opts.body || '（机）'}
 ╰──┬──╯
${opts.feet || '⚙┿⚙'}`,
    attack: (opts={}) => [` ╭${opts.eyes || 'Θ_Θ'}╮\n${opts.attackMark || '─'}${opts.body || '（机）'}${opts.attackMark || '械'}\n ╰──┬──╯`,
                        ` ╭${opts.eyes || 'Θ_Θ'}╮\n ${opts.body || '（机）'}\n ╰──┬──╯${opts.attackMark || '─械'}`],
    heavy: (opts={}) => ` ${(opts.marks || '⚙⚙')}\n╭${opts.eyes || 'Θ_Θ'}╮\n│${opts.body || '（机）'}│\n╰─┬─╯\n${opts.feet || '⚙⚙'}━━┿━━${opts.feet || '⚙⚙'}`,
    hit: (opts={}) => [` ╭${opts.hitEyes || 'Θ﹏Θ'}╮\n>${opts.body || '（机）'}\n ╰──┬──╯`,
                      ` ╭${opts.hitEyes || 'Θ﹏Θ'}╮\n ${opts.body || '（机）'}<\n ╰──┬──╯`],
    down: (opts={}) => ` (${opts.downEyes || 'Θ─Θ'})\n ${opts.body || '（机）'}\n ══════`,
    parts: {head:1, body:'（机）', arms:2, legs:3, aura:4}
  }
};

// 敌人生成器函数
function generateEnemyAvatar(enemyData) {
  const { type, tier, icon, level } = enemyData;
  
  // 根据敌人类型选择模板
  let template;
  let bodyText;
  
  switch(type) {
    case 'beast':
      if (icon === '🐺' || name.includes('狼')) {
        template = AVATAR_TEMPLATES.beast.wolf;
        bodyText = '（狼）';
      } else if (icon === '🐯' || icon === '🐅' || name.includes('虎')) {
        template = AVATAR_TEMPLATES.beast.tiger;
        bodyText = '（虎）';
      } else if (icon === '🐻' || icon === '🐗' || name.includes('熊') || name.includes('猪')) {
        template = AVATAR_TEMPLATES.beast.bear;
        bodyText = '（熊）';
      } else {
        template = AVATAR_TEMPLATES.beast.wolf; // 默认
        bodyText = '（兽）';
      }
      break;
      
    case 'bandit':
      template = AVATAR_TEMPLATES.human.bandit;
      bodyText = '（贼）';
      break;
      
    case 'evil':
    case 'assassin':
      if (tier === 'elite') {
        template = AVATAR_TEMPLATES.human.elite;
        bodyText = '（武）';
      } else {
        template = AVATAR_TEMPLATES.human.bandit;
        bodyText = '（恶）';
      }
      break;
      
    case 'ghost':
    case 'undead':
      template = AVATAR_TEMPLATES.undead;
      bodyText = '（亡）';
      break;
      
    case 'boss':
      if (name && (name.includes('机关') || name.includes('铜人'))) {
        template = AVATAR_TEMPLATES.mechanism;
        bodyText = '（机）';
      } else if (tier === 'elite') {
        template = AVATAR_TEMPLATES.human.elite;
        bodyText = '（王）';
      } else {
        template = AVATAR_TEMPLATES.human.bandit;
        bodyText = '（魁）';
      }
      break;
      
    default:
      template = AVATAR_TEMPLATES.human.bandit;
      bodyText = '（敌）';
  }
  
  // 根据等级和tier调整眼睛和标记
  const levelMark = getLevelMark(level);
  const tierMark = getTierMark(tier);
  
  const options = {
    eyes: getEyesByTier(tier, type),
    hitEyes: getHitEyesByTier(tier),
    downEyes: getDownEyesByTier(tier),
    marks: levelMark,
    attackMark: tierMark,
    feet: levelMark,
    body: bodyText
  };
  
  return {
    stand: template.stand(options),
    attack: template.attack(options),
    heavy: template.heavy(options),
    hit: template.hit(options),
    down: template.down(options),
    parts: template.parts
  };
}

// 根据等级获取标记
function getLevelMark(level) {
  if (level >= 60) return '☠☠';
  if (level >= 40) return '☯☯';
  if (level >= 25) return '✦✦';
  if (level >= 15) return '●●';
  return '~~';
}

// 根据tier获取攻击标记
function getTierMark(tier) {
  switch(tier) {
    case 'elite': return '☠';
    case 'major': return '●';
    default: return '─';
  }
}

// 根据tier获取眼睛表情
function getEyesByTier(tier, type) {
  if (type === 'beast') {
    switch(tier) {
      case 'elite': return '⊙_⊙';
      case 'major': return '◉_◉';
      default: return '◎_◎';
    }
  }
  
  switch(tier) {
    case 'elite': return '◉_◉';
    case 'major': return '⊙_⊙';
    default: return '◈_◈';
  }
}

function getHitEyesByTier(tier) {
  switch(tier) {
    case 'elite': return '◉﹏◉';
    case 'major': return '⊙﹏⊙';
    default: return '◈﹏◈';
  }
}

function getDownEyesByTier(tier) {
  switch(tier) {
    case 'elite': return '◉─◉';
    case 'major': return '⊙─⊙';
    default: return '◈─◈';
  }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateEnemyAvatar, AVATAR_TEMPLATES };
} else if (typeof window !== 'undefined') {
  window.EnemyAvatarGenerator = { generateEnemyAvatar, AVATAR_TEMPLATES };
}
