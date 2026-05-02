// skill-effects.js — 技能特效映射系统
// 将290个回合制技能映射到弹幕游戏特效
// ════════════════════════════════════════════════════

// ════════════════════════════════════════════════════
//  特效类型定义
// ════════════════════════════════════════════════════
const EFFECT_TYPES = {
  // 基础投射物
  projectile:   { label: '投射物',   desc: '发射弹幕攻击敌人' },
  multi:        { label: '多重投射', desc: '同时发射多个弹幕' },
  homing:       { label: '追踪弹幕', desc: '自动追踪敌人的弹幕' },
  pierce:       { label: '穿透弹幕', desc: '可穿透多个敌人' },
  
  // 范围效果
  aoe:          { label: '范围伤害', desc: '对区域内所有敌人造成伤害' },
  burst:        { label: '爆发',     desc: '以自身为中心的爆炸' },
  laser:        { label: '激光',     desc: '贯穿全屏的直线攻击' },
  
  // 持续效果
  orbit:        { label: '环绕',     desc: '围绕自身旋转的攻击' },
  field:        { label: '领域',     desc: '持续影响一片区域' },
  dot:          { label: '持续伤害', desc: '随时间持续造成伤害' },
  
  // 位移效果
  dash:         { label: '冲刺',     desc: '快速移动并造成伤害' },
  teleport:     { label: '瞬移',     desc: '瞬间移动到目标位置' },
  blink:        { label: '闪烁',     desc: '短距离闪烁攻击' },
  
  // 防御/辅助
  shield:       { label: '护盾',     desc: '吸收伤害的防护' },
  heal:         { label: '治疗',     desc: '恢复生命值' },
  buff:         { label: '增益',     desc: '提升自身属性' },
  cleanse:      { label: '净化',     desc: '清除负面状态' },
  
  // 控制效果
  stun:         { label: '眩晕',     desc: '使敌人无法行动' },
  slow:         { label: '减速',     desc: '降低敌人速度' },
  silence:      { label: '沉默',     desc: '阻止敌人使用技能' },
  
  // 特殊效果
  execute:      { label: '处决',     desc: '对低血量敌人造成额外伤害' },
  reflect:      { label: '反弹',     desc: '反弹敌人的攻击' },
  lifesteal:    { label: '吸血',     desc: '造成伤害的同时恢复生命' },
  summon:       { label: '召唤',     desc: '召唤辅助单位' },
};

// ════════════════════════════════════════════════════
//  视觉特效配置 - 按学派定义
// ════════════════════════════════════════════════════
const SCHOOL_VISUALS = {
  // 剑系 - 蓝色/银色，剑气效果
  sword: {
    color: '#40b0ff',
    glow: '#80d0ff',
    symbol: '⚔',
    trail: '─',
    hitEffect: 'slash',
    particles: ['✦', '✧', '◆'],
    chargeColor: '#60c8ff',
    projectileType: 'sword',
  },
  
  // 佛系 - 金色/黄色，佛光效果
  buddha: {
    color: '#f0c060',
    glow: '#ffe8a0',
    symbol: '卍',
    trail: '✦',
    hitEffect: 'bloom',
    particles: ['卍', '✦', '★'],
    chargeColor: '#ffd060',
    projectileType: 'buddha',
  },
  
  // 道系 - 青色/蓝绿色，太极效果
  tao: {
    color: '#60e8e8',
    glow: '#a0ffff',
    symbol: '☯',
    trail: '～',
    hitEffect: 'ripple',
    particles: ['☯', '～', '○'],
    chargeColor: '#80ffff',
    projectileType: 'taiji',
  },
  
  // 力系 - 橙色/棕色，冲击效果
  force: {
    color: '#e09050',
    glow: '#ffb070',
    symbol: '👊',
    trail: '═',
    hitEffect: 'impact',
    particles: ['💥', '▓', '█'],
    chargeColor: '#ff9040',
    projectileType: 'force',
  },
  
  // 暗系 - 紫色/黑色，暗影效果
  shadow: {
    color: '#8080a0',
    glow: '#b0b0e0',
    symbol: '▓',
    trail: '░',
    hitEffect: 'darkness',
    particles: ['░', '▒', '▓'],
    chargeColor: '#6060a0',
    projectileType: 'dark',
  },
  
  // 毒系 - 绿色，毒气效果
  poison: {
    color: '#88ff44',
    glow: '#aaff66',
    symbol: '☠',
    trail: '∿',
    hitEffect: 'poison',
    particles: ['☠', '🐍', '∿'],
    chargeColor: '#66ff33',
    projectileType: 'poison',
  },
  
  // 冰系 - 冰蓝色，冰霜效果
  ice: {
    color: '#80c0ff',
    glow: '#b0e0ff',
    symbol: '❄',
    trail: '∴',
    hitEffect: 'freeze',
    particles: ['❄', '✧', '∴'],
    chargeColor: '#a0d8ff',
    projectileType: 'ice',
  },
  
  // 火系 - 红色/橙色，火焰效果
  fire: {
    color: '#ff7030',
    glow: '#ff9040',
    symbol: '🔥',
    trail: '≈',
    hitEffect: 'burn',
    particles: ['🔥', '✦', '≈'],
    chargeColor: '#ff5020',
    projectileType: 'fire',
  },
  
  // 雷系 - 黄色，雷电效果
  thunder: {
    color: '#ffe040',
    glow: '#ffff80',
    symbol: '⚡',
    trail: '╱',
    hitEffect: 'shock',
    particles: ['⚡', '✦', '╱'],
    chargeColor: '#ffff60',
    projectileType: 'lightning',
  },
  
  // 风系 - 浅绿色，风刃效果
  wind: {
    color: '#80e080',
    glow: '#a0f0a0',
    symbol: '～',
    trail: '≋',
    hitEffect: 'wind',
    particles: ['～', '≋', '🍃'],
    chargeColor: '#60e060',
    projectileType: 'wind',
  },
  
  // 圣系 - 白色/金色，圣光效果
  holy: {
    color: '#ffffc0',
    glow: '#fffff0',
    symbol: '✦',
    trail: '✧',
    hitEffect: 'holy',
    particles: ['✦', '✧', '★'],
    chargeColor: '#ffffe0',
    projectileType: 'holy',
  },
  
  // 通用 - 灰白色
  common: {
    color: '#c0b0a0',
    glow: '#e0d0c0',
    symbol: '●',
    trail: '·',
    hitEffect: 'hit',
    particles: ['·', '∘', '○'],
    chargeColor: '#d0c0b0',
    projectileType: 'normal',
  },
  
  // 拳系 - 深橙色，拳风效果
  fist: {
    color: '#e8a040',
    glow: '#ffc060',
    symbol: '👊',
    trail: '▓',
    hitEffect: 'impact',
    particles: ['👊', '💥', '▓'],
    chargeColor: '#ffb040',
    projectileType: 'force',
  },
  
  // 奇门系 - 青绿色，机关效果
  qimen: {
    color: '#90c090',
    glow: '#b0e0b0',
    symbol: '🔯',
    trail: '◈',
    hitEffect: 'trap',
    particles: ['🔯', '◈', '⚙'],
    chargeColor: '#a0d0a0',
    projectileType: 'trap',
  },
  
  // 琴系 - 粉紫色，音波效果
  music: {
    color: '#d080d0',
    glow: '#f0a0f0',
    symbol: '♪',
    trail: '♫',
    hitEffect: 'sound',
    particles: ['♪', '♫', '♬'],
    chargeColor: '#e090e0',
    projectileType: 'sound',
  },
  
  // 命系 - 棕黄色，命运效果
  fate: {
    color: '#d4a850',
    glow: '#f0c870',
    symbol: '⚖',
    trail: '◐',
    hitEffect: 'fate',
    particles: ['⚖', '◐', '🔮'],
    chargeColor: '#e8c060',
    projectileType: 'fate',
  },
};

// ════════════════════════════════════════════════════
//  技能效果类型映射 - 将回合制技能类型映射到弹幕效果
// ════════════════════════════════════════════════════
const SKILL_TYPE_MAPPING = {
  // 伤害类 → 投射物/范围伤害
  damage: {
    baseEffect: 'projectile',
    getVariant: (skill) => {
      if (skill.hits > 1) return 'multi';
      if (skill.alwaysHit) return 'homing';
      if (skill.multiplier > 2) return 'pierce';
      return 'projectile';
    }
  },
  
  // 处决类 → 强力投射物/激光
  execute: {
    baseEffect: 'laser',
    getVariant: (skill) => {
      if (skill.selfDmgPct) return 'burst';
      return 'pierce';
    }
  },
  
  // 持续伤害 → 领域/毒雾
  dot: {
    baseEffect: 'field',
    getVariant: (skill) => {
      if (skill.hits > 1) return 'multi';
      return 'field';
    }
  },
  
  // 眩晕类 → 控制弹幕
  stun: {
    baseEffect: 'projectile',
    getVariant: (skill) => 'stun'
  },
  
  // 治疗类 → 治疗光环
  heal: {
    baseEffect: 'heal',
    getVariant: () => 'heal'
  },
  
  // 护盾类 → 护盾环绕
  shield: {
    baseEffect: 'shield',
    getVariant: () => 'orbit'
  },
  
  // 增益类 → 光环/强化
  buff: {
    baseEffect: 'buff',
    getVariant: (skill) => {
      if (skill.defBuff && skill.defBuff > 0.5) return 'shield';
      return 'buff';
    }
  },
  
  // 减益类 → 削弱弹幕
  debuff: {
    baseEffect: 'projectile',
    getVariant: () => 'slow'
  },
};

// ════════════════════════════════════════════════════
//  弹幕技能配置生成器
// ════════════════════════════════════════════════════
function generateDanmakuConfig(skill, school) {
  const visual = SCHOOL_VISUALS[school] || SCHOOL_VISUALS.common;
  const typeMapping = SKILL_TYPE_MAPPING[skill.type] || SKILL_TYPE_MAPPING.damage;
  const variant = typeMapping.getVariant(skill);
  
  // 基础配置
  const config = {
    id: skill.id,
    name: skill.name,
    icon: skill.icon,
    school: skill.school,
    qi: Math.max(15, Math.floor(skill.mpCost * 0.8)),
    cd: Math.max(2, skill.cd),
    desc: skill.desc,
    visual: visual,
  };
  
  // 根据效果类型生成具体配置
  switch (typeMapping.baseEffect) {
    case 'projectile':
      config.effect = variant === 'multi' ? 'multi_projectile' : 'projectile';
      config.projectile = {
        type: visual.projectileType,
        count: skill.hits || 1,
        speed: 10 + (skill.cd < 5 ? 4 : 0),
        dmgMult: skill.multiplier || 1.0,
        pierce: variant === 'pierce',
        homing: variant === 'homing',
        spread: skill.hits > 1 ? 30 : 0,
      };
      break;
      
    case 'laser':
      config.effect = 'laser';
      config.laser = {
        width: skill.multiplier > 3 ? 2 : 1,
        length: 25,
        duration: skill.multiplier > 3 ? 2 : 1.2,
        dmgPerSec: skill.multiplier || 1.5,
      };
      break;
      
    case 'field':
      config.effect = 'field';
      config.field = {
        radius: 4 + (skill.dotDur || 5) * 0.3,
        duration: skill.dotDur || 5,
        dotDmg: skill.dotDmg || 0.04,
        type: visual.projectileType,
      };
      break;
      
    case 'heal':
      config.effect = 'heal';
      config.heal = {
        amount: Math.floor((skill.healPct || 0.2) * 100),
        healPct: skill.healPct || 0.2,
        cleanse: skill.cleanse || false,
      };
      break;
      
    case 'shield':
      config.effect = 'shield';
      config.shield = {
        blocks: 3,
        duration: skill.shieldDur || 5,
        dmgReduce: skill.defBuff || 0.5,
        type: visual.projectileType,
      };
      break;
      
    case 'buff':
      config.effect = 'buff';
      config.buff = {
        type: skill.atkBuff ? 'atk' : 'def',
        val: skill.atkBuff || skill.defBuff || 0.3,
        duration: skill.buffDur || 5,
      };
      break;
  }
  
  return config;
}

// ════════════════════════════════════════════════════
//  预生成的弹幕技能数据库（从290个技能生成）
// ════════════════════════════════════════════════════
const GENERATED_DANMAKU_SKILLS = {};

// ════════════════════════════════════════════════════
//  特效渲染函数
// ════════════════════════════════════════════════════
const SkillEffects = {
  // 蓄力特效
  renderCharge(ctx, x, y, progress, visual) {
    const particles = 8;
    const radius = 20 + progress * 15;
    
    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2 + progress * Math.PI;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      const size = 3 + progress * 4;
      
      ctx.fillStyle = visual.chargeColor;
      ctx.globalAlpha = 0.6 + progress * 0.4;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 中心光环
    ctx.strokeStyle = visual.glow;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  },
  
  // 弹幕尾迹
  renderTrail(ctx, x, y, history, visual) {
    if (!history || history.length < 2) return;
    
    ctx.strokeStyle = visual.color;
    ctx.lineWidth = 2;
    
    for (let i = 1; i < history.length; i++) {
      const alpha = i / history.length * 0.5;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(history[i-1].x, history[i-1].y);
      ctx.lineTo(history[i].x, history[i].y);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  },
  
  // 命中特效
  renderHit(ctx, x, y, type, visual, isCrit) {
    const colors = {
      slash: [visual.color, '#ffffff'],
      bloom: [visual.glow, visual.color],
      ripple: ['#ffffff', visual.color],
      impact: ['#ff8040', '#ffffff'],
      darkness: ['#404040', '#808080'],
      poison: ['#88ff44', '#44aa22'],
      freeze: ['#c0e8ff', '#ffffff'],
      burn: ['#ff6020', '#ff9040'],
      shock: ['#ffff80', '#ffffff'],
      wind: ['#a0f0a0', '#ffffff'],
      holy: ['#fffff0', '#ffffc0'],
      sound: [visual.color, '#ffffff'],
      hit: [visual.color, '#ffffff'],
    };

    // 琴系音效触发
    if(type === 'sound' && typeof playAudio === 'function'){
      playAudio('skill');
    }
    
    const colorPair = colors[type] || colors.hit;
    const particleCount = isCrit ? 16 : 8;
    
    // 爆炸粒子
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const dist = 10 + Math.random() * 20;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      
      ctx.fillStyle = colorPair[i % 2];
      ctx.globalAlpha = 0.8 - (dist / 40);
      ctx.beginPath();
      ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 暴击额外特效
    if (isCrit) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.stroke();
      
      // 星形爆发
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + Math.cos(angle) * 40,
          y + Math.sin(angle) * 40
        );
        ctx.stroke();
      }
    }
    
    ctx.globalAlpha = 1;
  },
  
  // 技能名称大字显示
  renderSkillName(ctx, x, y, name, color) {
    ctx.save();
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 发光阴影
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name, x, y);
    
    // 主文字
    ctx.shadowBlur = 5;
    ctx.fillStyle = color;
    ctx.fillText(name, x, y);
    
    ctx.restore();
  },
  
  // 冲击波效果
  renderShockwave(ctx, x, y, radius, color, progress) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 * (1 - progress);
    ctx.globalAlpha = 1 - progress;
    
    ctx.beginPath();
    ctx.arc(x, y, radius * progress, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  },
  
  // 屏幕震动效果
  applyScreenShake(canvas, intensity) {
    const shakeX = (Math.random() - 0.5) * intensity;
    const shakeY = (Math.random() - 0.5) * intensity;
    canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
    
    setTimeout(() => {
      canvas.style.transform = '';
    }, 50);
  },
};

// ════════════════════════════════════════════════════
//  导出
// ════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EFFECT_TYPES,
    SCHOOL_VISUALS,
    SKILL_TYPE_MAPPING,
    generateDanmakuConfig,
    SkillEffects,
  };
}
