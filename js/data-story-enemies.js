// ════════════════════════════════════════════════════
//  data-story-enemies.js  剧情专属BOSS敌人数据
//  《血骨门之乱》剧情地下城专用敌人
// ════════════════════════════════════════════════════

// ── 剧情BOSS常量 ────────────────────────────────────
const STORY_BOSS = {
  // 第一幕：沧州暗战
  XUEGU_ZHUAZHUA: 'xuegu_zhuazhua',      // 追命使·血爪
  
  // 第二幕：嵩山石窟
  STONE_DEMON: 'boss_stone_demon',       // 上古石魔
  
  // 第四幕：幽州潜入
  XUEGU_ZHUIHUN: 'xuegu_zhuihun',        // 追命使·追魂
  XUEREN: 'boss_xueren',                 // 副门主·血刃
  
  // 第五幕：最终决战
  XUEGU_GENERAL: 'boss_xuegu_general',   // 血骨门大将
  XUEGU_GUIDAO: 'boss_xuegu_guidao',     // 护法·鬼刀
  XUEGU_QIANSHOU: 'boss_xuegu_qianshou', // 护法·千手
  GUMINGZI_P1: 'boss_gumingzi_phase1',   // 骨冥子·第一阶段
  GUMINGZI_P2: 'boss_gumingzi_phase2',   // 骨冥子·第二阶段
};

// ── 剧情BOSS扩展数据 ────────────────────────────────
// 这些敌人只在剧情地下城中出现，不在普通地下城刷新
const STORY_ENEMY_DB = {

  // ════════════════════════════════════════════════════
  //  第一幕BOSS
  // ════════════════════════════════════════════════════

  xuegu_zhuazhua: {
    id: 'xuegu_zhuazhua',
    name: '追命使·血爪',
    title: '血骨门沧州负责人',
    tag: '爪功阴毒',
    tagColor: '#ff6060',
    
    // 基础属性（Lv8-12）
    level: 10,
    maxHp: 280,
    atk: 32,
    def: 12,
    speedN: 9,
    crit: 0.15,
    dodge: 0.08,
    
    // 战斗AI
    ai: 'aggressive',  // 侵略型：优先攻击
    skills: ['claw_poison', 'blood_drain'],
    
    // 特殊机制
    mechanic: {
      name: '血毒',
      description: '每次攻击有30%概率使目标中毒，每回合损失5%气血',
      trigger: 'onAttack',
      chance: 0.3,
      effect: { type: 'poison', damagePercent: 0.05, duration: 3 },
    },
    
    // 掉落
    drops: [
      { id: 'item_antidote', chance: 1.0, qty: 3 },
      { id: 'item_xuegu_claw', chance: 0.3 },  // 血爪（材料）
      { id: 'item_iron_ore', chance: 0.8, qty: 5 },
    ],
    
    // 战斗台词
    lines: {
      enter: ['又一个来送死的。正好，门主需要更多「材料」……'],
      hp50: ['有点本事……但还不够！'],
      hp25: ['该死……你究竟是谁！'],
      defeat: ['门主……不会放过你的……'],
    },
  },

  // ════════════════════════════════════════════════════
  //  第二幕BOSS
  // ════════════════════════════════════════════════════

  boss_stone_demon: {
    id: 'boss_stone_demon',
    name: '上古石魔',
    title: '封印中的邪物',
    tag: '金刚不坏',
    tagColor: '#808080',
    
    level: 20,
    maxHp: 800,
    atk: 45,
    def: 35,  // 极高防御
    speedN: 4,  // 极慢
    crit: 0.05,
    dodge: 0,
    
    ai: 'tank',  // 坦克型：高防慢速
    skills: ['stone_slam', 'earthquake'],
    
    mechanic: {
      name: '金刚之躯',
      description: '受到的所有伤害减少50%，但速度极慢',
      trigger: 'passive',
      effect: { damageReduction: 0.5 },
    },
    
    // 弱点：使用特定技能可破防
    weakness: {
      skillType: 'wind',  // 风系技能可无视50%防御
      effect: '无视50%防御',
    },
    
    drops: [
      { id: 'item_stone_heart', chance: 1.0 },  // 石魔核心
      { id: 'item_xuantie_shard1', chance: 1.0 },  // 必掉碎片
      { id: 'item_ancient_stone', chance: 0.5, qty: 3 },
    ],
    
    lines: {
      enter: ['玄……铁……令……'],
      hp50: ['吼——！！'],
      hp25: ['不……可……能……'],
      defeat: ['封……印……'],
    },
  },

  xuegu_zhuihun: {
    id: 'xuegu_zhuihun',
    name: '追命使·追魂',
    title: '血骨门嵩山负责人',
    tag: '追魂夺命',
    tagColor: '#ff4040',
    
    level: 22,
    maxHp: 450,
    atk: 48,
    def: 18,
    speedN: 12,
    crit: 0.2,
    dodge: 0.15,
    
    ai: 'assassin',  // 刺客型：高暴击高闪避
    skills: ['shadow_strike', 'soul_drain'],
    
    mechanic: {
      name: '追魂',
      description: '对气血低于30%的目标伤害翻倍',
      trigger: 'onAttack',
      condition: 'targetHpPercent < 0.3',
      effect: { damageMultiplier: 2 },
    },
    
    drops: [
      { id: 'item_soul_crystal', chance: 0.5 },
      { id: 'item_xuegu_token', chance: 0.8 },
    ],
    
    lines: {
      enter: ['又来一个送死的。封印需要更多血祭……'],
      hp50: ['你的灵魂……很美味……'],
      defeat: ['门主……会为我报仇的……'],
    },
  },

  // ════════════════════════════════════════════════════
  //  第四幕BOSS
  // ════════════════════════════════════════════════════

  boss_xueren: {
    id: 'boss_xueren',
    name: '副门主·血刃',
    title: '血骨门第二高手',
    tag: '血刃无情',
    tagColor: '#ff0000',
    
    level: 42,
    maxHp: 1200,
    atk: 85,
    def: 35,
    speedN: 11,
    crit: 0.25,
    dodge: 0.12,
    
    ai: 'berserker',  // 狂战士型：血越少越强
    skills: ['blood_blade', 'berserk_rage', 'life_steal'],
    
    mechanic: {
      name: '血怒',
      description: '气血每降低10%，攻击力和暴击率提升5%',
      trigger: 'passive',
      effect: { 
        atkBonusPerHp10: 0.05,
        critBonusPerHp10: 0.05,
      },
    },
    
    // 二阶段
    phase2: {
      trigger: 'hp25',
      name: '血刃狂暴',
      buff: { atkBonus: 0.3, speedBonus: 3, critBonus: 0.15 },
      lines: ['哈哈哈！让你见识真正的血刃！'],
    },
    
    drops: [
      { id: 'item_blood_blade', chance: 0.2 },  // 血刃（传说武器）
      { id: 'item_xuegu_heart', chance: 0.5 },
      { id: 'item_demon_pact_copy', chance: 1.0 },
    ],
    
    lines: {
      enter: ['哈哈哈！果然有人上钩了！'],
      hp50: ['有点意思……但还不够！'],
      phase2: ['让你见识真正的血刃！'],
      defeat: ['不可能……我是血骨门副门主……'],
    },
  },

  // ════════════════════════════════════════════════════
  //  第五幕BOSS - 四大护法
  // ════════════════════════════════════════════════════

  boss_xuegu_general: {
    id: 'boss_xuegu_general',
    name: '血骨门大将',
    title: '镇守第二防线',
    tag: '万夫莫敌',
    tagColor: '#ff6060',
    
    level: 48,
    maxHp: 1500,
    atk: 78,
    def: 45,
    speedN: 8,
    crit: 0.1,
    dodge: 0.05,
    
    ai: 'tank',
    skills: ['heavy_strike', 'armor_break'],
    
    mechanic: {
      name: '军阵',
      description: '每回合召唤一个血骨门弟子助战',
      trigger: 'onTurn',
      effect: { summon: 'xuegu_foot' },
    },
    
    drops: [
      { id: 'item_general_armor', chance: 0.3 },
      { id: 'item_xuegu_medal', chance: 0.8 },
    ],
    
    lines: {
      enter: ['想要过去？先踏过我的尸体！'],
      defeat: ['防线……被突破了……'],
    },
  },

  boss_xuegu_guidao: {
    id: 'boss_xuegu_guidao',
    name: '护法·鬼刀',
    title: '血骨门四大护法',
    tag: '鬼刀无形',
    tagColor: '#804040',
    
    level: 50,
    maxHp: 1000,
    atk: 95,
    def: 25,
    speedN: 14,
    crit: 0.3,
    dodge: 0.2,
    
    ai: 'assassin',
    skills: ['ghost_blade', 'phantom_step'],
    
    mechanic: {
      name: '鬼影',
      description: '每3回合进入隐身状态，下次攻击必暴击且无法被闪避',
      trigger: 'onTurn',
      interval: 3,
      effect: { stealth: true, nextCrit: 1, nextUnavoidable: true },
    },
    
    drops: [
      { id: 'item_ghost_blade', chance: 0.25 },
    ],
    
    lines: {
      enter: ['鬼刀出鞘，见血封喉！'],
      defeat: ['鬼刀……断了……'],
    },
  },

  boss_xuegu_qianshou: {
    id: 'boss_xuegu_qianshou',
    name: '护法·千手',
    title: '血骨门四大护法',
    tag: '千手毒师',
    tagColor: '#40ff40',
    
    level: 50,
    maxHp: 900,
    atk: 70,
    def: 30,
    speedN: 10,
    crit: 0.15,
    dodge: 0.1,
    
    ai: 'mage',  // 法师型：技能伤害
    skills: ['poison_cloud', 'heal', 'toxic_sting'],
    
    mechanic: {
      name: '毒域',
      description: '战斗开始时释放毒雾，每回合对所有敌人造成中毒伤害',
      trigger: 'onBattleStart',
      effect: { type: 'poison_field', damage: 20 },
    },
    
    drops: [
      { id: 'item_poison_manual', chance: 0.3 },
      { id: 'item_antidote', chance: 1.0, qty: 10 },
    ],
    
    lines: {
      enter: ['尝尝我的千手毒功！'],
      defeat: ['毒……反噬了……'],
    },
  },

  // ════════════════════════════════════════════════════
  //  最终BOSS - 骨冥子
  // ════════════════════════════════════════════════════

  boss_gumingzi_phase1: {
    id: 'boss_gumingzi_phase1',
    name: '骨冥子',
    title: '血骨门门主',
    tag: '血神经',
    tagColor: '#ff0000',
    
    level: 55,
    maxHp: 2500,
    atk: 100,
    def: 40,
    speedN: 12,
    crit: 0.2,
    dodge: 0.15,
    
    ai: 'boss',
    skills: ['bone_claw', 'blood_waves', 'soul_drain'],
    
    mechanic: {
      name: '血神经·噬魂',
      description: '每次造成伤害的20%转化为自身气血恢复',
      trigger: 'onDealDamage',
      effect: { lifeSteal: 0.2 },
    },
    
    // 转阶段
    phaseTransition: {
      trigger: 'hp30',
      nextPhase: 'boss_gumingzi_phase2',
      lines: ['哈哈哈！逼我到这个地步……让你见识真正的血神经！'],
    },
    
    drops: [],  // 第一阶段不掉落
    
    lines: {
      enter: ['你终于来了……我等你很久了。'],
      hp50: ['不错……但还不够！'],
      phaseTransition: ['让你见识真正的血神经！'],
    },
  },

  boss_gumingzi_phase2: {
    id: 'boss_gumingzi_phase2',
    name: '骨冥子·血神经全开',
    title: '血骨门门主·真身',
    tag: '血神经·大成',
    tagColor: '#ff0040',
    
    level: 55,
    maxHp: 3000,  // 满血复活
    atk: 130,
    def: 35,
    speedN: 15,
    crit: 0.35,
    dodge: 0.2,
    
    ai: 'berserker',
    skills: ['blood_explosion', 'bone_storm', 'immortal_blood'],
    
    mechanic: {
      name: '不死血身',
      description: '每回合恢复5%最大气血，但受到的伤害增加20%',
      trigger: 'onTurn',
      effect: { healPercent: 0.05, damageTakenBonus: 0.2 },
    },
    
    // 濒死爆发
    finalStand: {
      trigger: 'hp10',
      effect: { atkBonus: 0.5, critBonus: 0.3 },
      lines: ['就算是死……我也要拉你陪葬！'],
    },
    
    drops: [
      { id: 'item_xuantie_complete', chance: 1.0 },
      { id: 'item_blood_sutra', chance: 0.5 },  // 血神经秘籍
      { id: 'item_legendary_material', chance: 0.8, qty: 5 },
    ],
    
    lines: {
      enter: ['哈哈哈！这才是真正的力量！'],
      hp50: ['不可能……我不会输！'],
      finalStand: ['就算是死……我也要拉你陪葬！'],
      defeat: ['不……不可能……我是……天下无敌的……'],
    },
  },
};

// ── 剧情敌人实例化函数 ──────────────────────────────

/** 创建剧情BOSS实例 */
function createStoryBossInstance(bossId, playerLevel) {
  const template = STORY_ENEMY_DB[bossId];
  if (!template) return null;
  
  // 根据玩家等级动态调整
  const levelDiff = playerLevel - template.level;
  const scale = Math.max(0.8, Math.min(1.5, 1 + levelDiff * 0.05));
  
  return {
    ...template,
    maxHp: Math.floor(template.maxHp * scale),
    hp: Math.floor(template.maxHp * scale),
    atk: Math.floor(template.atk * scale),
    def: Math.floor(template.def * scale),
    
    // 战斗状态
    currentPhase: 1,
    hasTriggeredPhase2: false,
    hasTriggeredFinalStand: false,
    
    // 战斗AI状态
    aiState: {
      turnCount: 0,
      stealthActive: false,
      nextAttackCrit: false,
      nextAttackUnavoidable: false,
    },
  };
}

/** 获取BOSS台词 */
function getBossLine(bossId, trigger) {
  const boss = STORY_ENEMY_DB[bossId];
  if (!boss || !boss.lines) return null;
  return boss.lines[trigger] || null;
}

/** 检查BOSS机制触发 */
function checkBossMechanic(boss, trigger, context) {
  const mechanic = boss.mechanic;
  if (!mechanic || mechanic.trigger !== trigger) return null;
  
  switch (trigger) {
    case 'onAttack':
      if (mechanic.chance && Math.random() > mechanic.chance) return null;
      return mechanic.effect;
      
    case 'onTurn':
      boss.aiState.turnCount++;
      if (mechanic.interval && boss.aiState.turnCount % mechanic.interval !== 0) return null;
      return mechanic.effect;
      
    case 'onDealDamage':
      return mechanic.effect;
      
    case 'onBattleStart':
      return mechanic.effect;
      
    case 'passive':
      return mechanic.effect;
      
    default:
      return null;
  }
}

/** 检查阶段转换 */
function checkPhaseTransition(boss) {
  if (!boss.phaseTransition) return null;
  
  const hpPercent = boss.hp / boss.maxHp;
  const triggerPercent = parseInt(boss.phaseTransition.trigger.replace('hp', '')) / 100;
  
  if (hpPercent <= triggerPercent && !boss.hasTriggeredPhase2) {
    boss.hasTriggeredPhase2 = true;
    return boss.phaseTransition;
  }
  
  // 检查濒死爆发
  if (boss.finalStand && hpPercent <= 0.1 && !boss.hasTriggeredFinalStand) {
    boss.hasTriggeredFinalStand = true;
    return {
      type: 'finalStand',
      ...boss.finalStand,
    };
  }
  
  return null;
}

// ════════════════════════════════════════════════════
//  剧情地下城小怪数据
//  按幕分组，与 story-dungeons.js 里的 enemyId 一一对应
// ════════════════════════════════════════════════════
const STORY_MOB_DB = {

  // ──────────────────────────────────────────────────
  //  第一幕：沧州血骨门据点
  //  enemies: xuegu_recruit / xuegu_fighter / xuegu_elite
  // ──────────────────────────────────────────────────

  xuegu_recruit: {
    id:'xuegu_recruit', name:'血骨门弟子', type:'human', icon:'👤',
    stand:'   ┌◉_◉┐\n   │弟 子│\n  ┌┘ ░░ └┐\n  └──────┘',
    attack:['   ┌◉_◉┐  !\n   │弟 子│刀\n  ┌┘ ░░ └┐\n  └──────┘'],
    heavy:'  ══════════\n   ┌◉_◉┐\n   │弟 子│\n  ┌┘░░░░└┐',
    hit:['   ┌◉>◉┐\n   │弟 子│\n  ┌┘ ░░ └┐\n  └──────┘'],
    down:'  (┌◉─◉┐)\n   弟 子\n  ░░░░',
    parts:{head:1,body:'弟',arms:2,legs:3,aura:1},
    level:8, tier:'func',
    hp:180, atk:22, def:8, spd:10, mp:0,
    skills:['fi_lf1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:5, maxQty:15},
      {id:'item_xuegu_token', chance:0.15},
    ],
    exp:30, silver:10,
    desc:'初入血骨门的普通弟子，训练有素但经验不足。',
    aggro:true, alignment:'evil',
  },

  xuegu_fighter: {
    id:'xuegu_fighter', name:'血骨门武士', type:'human', icon:'⚔️',
    stand:'   ╔◉_◉╗\n   ║武 士║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝',
    attack:['   ╔◉_◉╗  斩!\n   ║武 士║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝'],
    heavy:'  ══════════\n   ╔◉_◉╗\n   ║武 士║\n  ╔╝▒▒▒▒╚╗',
    hit:['   ╔◉>◉╗\n   ║武 士║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝'],
    down:'  (╔◉─◉╗)\n   武 士\n  ▒▒▒▒',
    parts:{head:1,body:'武',arms:3,legs:4,aura:2},
    level:12, tier:'func',
    hp:320, atk:36, def:16, spd:12, mp:0,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:15, maxQty:30},
      {id:'item_xuegu_token', chance:0.3},
      {id:'item_iron_ore',    chance:0.2, minQty:1, maxQty:2},
    ],
    exp:55, silver:20,
    desc:'血骨门的正式武士，持刀功法纯熟，需小心其重击。',
    aggro:true, alignment:'evil',
  },

  xuegu_elite: {
    id:'xuegu_elite', name:'血骨门精英', type:'human', icon:'🗡️',
    stand:'   ╠◉⊙◉╣\n   ║精 英║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠◉⊙◉╣  破!\n   ║精 英║\n  ╠╝ ██ ╚╣\n  ╚══════╝'],
    heavy:'  ██████████\n   ╠◉⊙◉╣\n   ║精 英║\n  ╠╝████╚╣',
    hit:['   ╠◉>⊙╣\n   ║精 英║\n  ╠╝ ██ ╚╣\n  ╚══════╝'],
    down:'  (╠◉─◉╣)\n   精 英\n  ████',
    parts:{head:2,body:'精',arms:4,legs:4,aura:3},
    level:18, tier:'major',
    hp:580, atk:56, def:28, spd:14, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      {id:'item_silver_coin',   chance:0.9, minQty:30, maxQty:60},
      {id:'item_xuegu_token',   chance:0.6},
      {id:'item_iron_ore',      chance:0.4, minQty:2, maxQty:4},
      {id:'item_blood_token',   chance:0.1},
    ],
    exp:100, silver:35,
    desc:'血骨门中的佼佼者，身手敏捷，刀法凌厉。',
    aggro:true, alignment:'evil',
  },

  // ──────────────────────────────────────────────────
  //  第二幕：开封地下黑市
  //  enemies: blackmarket_guard / blackmarket_thug / xuegu_agent / blackmarket_boss
  // ──────────────────────────────────────────────────

  blackmarket_guard: {
    id:'blackmarket_guard', name:'黑市打手', type:'human', icon:'🪓',
    stand:'   ┌●_●┐\n   │打 手│\n  ┌┘ ░░ └┐\n  └──────┘',
    attack:['   ┌●_●┐  砸!\n   │打 手│\n  ┌┘ ░░ └┐\n  └──────┘'],
    heavy:'  ══════════\n   ┌●_●┐\n   │打 手│\n  ┌┘░░░░└┐',
    hit:['   ┌●>●┐\n   │打 手│\n  ┌┘ ░░ └┐'],
    down:'  (┌●─●┐)\n   打 手\n  ░░░░',
    parts:{head:1,body:'打',arms:3,legs:3,aura:1},
    level:22, tier:'func',
    hp:400, atk:46, def:18, spd:11, mp:0,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:20, maxQty:40},
      {id:'item_rope',        chance:0.2},
    ],
    exp:70, silver:25,
    desc:'黑市雇来的看门打手，粗壮有力，靠拳头说话。',
    aggro:true, alignment:'neutral',
  },

  blackmarket_thug: {
    id:'blackmarket_thug', name:'街头地痞', type:'human', icon:'🔪',
    stand:'   ┌◎_◎┐\n   │地 痞│\n  ┌┘ ░░ └┐\n  └──────┘',
    attack:['   ┌◎_◎┐  刺!\n   │地 痞│\n  ┌┘ ░░ └┐'],
    heavy:'  ══════════\n   ┌◎_◎┐\n   │地 痞│',
    hit:['   ┌◎>◎┐\n   │地 痞│\n  ┌┘ ░░ └┐'],
    down:'  (┌◎─◎┐)\n   地 痞\n  ░░░░',
    parts:{head:1,body:'地',arms:2,legs:3,aura:1},
    level:20, tier:'func',
    hp:280, atk:40, def:10, spd:16, mp:0,
    skills:['fi_lf1','as_1'],
    drops:[
      {id:'item_silver_coin', chance:0.8, minQty:10, maxQty:25},
    ],
    exp:50, silver:15,
    desc:'混迹黑市的街头地痞，出手偷袭，专攻要害。',
    aggro:true, alignment:'neutral',
  },

  xuegu_agent: {
    id:'xuegu_agent', name:'血骨门密探', type:'human', icon:'🕵️',
    stand:'   ╔●_●╗\n   ║密 探║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝',
    attack:['   ╔●_●╗  暗!\n   ║密 探║暗器'],
    heavy:'  ██████████\n   ╔●_●╗\n   ║密 探║',
    hit:['   ╔●>●╗\n   ║密 探║\n  ╔╝ ▒▒ ╚╗'],
    down:'  (╔●─●╗)\n   密 探\n  ▒▒▒▒',
    parts:{head:2,body:'密',arms:3,legs:4,aura:2},
    level:24, tier:'func',
    hp:350, atk:52, def:14, spd:18, mp:0,
    skills:['fi_lf1','as_1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:25, maxQty:50},
      {id:'item_xuegu_token', chance:0.25},
      {id:'item_poison_dart', chance:0.3, minQty:1, maxQty:3},
    ],
    exp:80, silver:30,
    desc:'血骨门潜伏在黑市的密探，擅长使用暗器和毒素。',
    aggro:true, alignment:'evil',
  },

  blackmarket_boss: {
    id:'blackmarket_boss', name:'金算盘', type:'human', icon:'🧮',
    stand:'   ╠●⊙●╣\n   ║金算盘║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠●⊙●╣  掷!\n   ║金算盘║暗器'],
    heavy:'  ██████████\n   ╠●⊙●╣\n   ║金算盘║',
    hit:['   ╠●>⊙╣\n   ║金算盘║\n  ╠╝ ██ ╚╣'],
    down:'  (╠●─●╣)\n   金算盘\n  ████',
    parts:{head:2,body:'金',arms:4,legs:4,aura:3},
    level:28, tier:'major',
    hp:720, atk:65, def:22, spd:15, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      {id:'item_silver_coin', chance:1.0, minQty:80, maxQty:150},
      {id:'item_black_market_badge', chance:0.8},
    ],
    exp:140, silver:80,
    desc:'黑市头目，外表圆滑，实则心狠手辣，惯用金算盘作暗器。',
    aggro:true, alignment:'neutral',
  },

  // ──────────────────────────────────────────────────
  //  第二幕：扬州南宫世家密室
  //  enemies: nangong_guardian / nangong_elite
  // ──────────────────────────────────────────────────

  nangong_guardian: {
    id:'nangong_guardian', name:'南宫机关人', type:'construct', icon:'🤖',
    stand:'   ╔▣_▣╗\n   ║机关人║\n  ╔╝ ▓▓ ╚╗\n  ╚══════╝',
    attack:['   ╔▣_▣╗  击!\n   ║机关人║'],
    heavy:'  ██████████\n   ╔▣_▣╗\n   ║机关人║',
    hit:['   ╔▣>▣╗\n   ║机关人║\n  ╔╝ ▓▓ ╚╗'],
    down:'  (╔▣─▣╗)\n   机关人\n  ▓▓▓▓',
    parts:{head:1,body:'机',arms:4,legs:4,aura:1},
    level:26, tier:'func',
    hp:500, atk:48, def:30, spd:7, mp:0,
    skills:['fi_hf1'],
    drops:[
      {id:'item_iron_ore',    chance:0.6, minQty:2, maxQty:5},
      {id:'item_gear_part',   chance:0.3, minQty:1, maxQty:2},
    ],
    exp:85, silver:0,
    desc:'南宫世家祖传的机关傀儡，防御极高但速度迟缓。',
    aggro:true, alignment:'neutral',
  },

  nangong_elite: {
    id:'nangong_elite', name:'铁甲卫', type:'human', icon:'🛡️',
    stand:'   ╠▣⊙▣╣\n   ║铁甲卫║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠▣⊙▣╣  斩!\n   ║铁甲卫║'],
    heavy:'  ██████████\n   ╠▣⊙▣╣\n   ║铁甲卫║',
    hit:['   ╠▣>⊙╣\n   ║铁甲卫║\n  ╠╝ ██ ╚╣'],
    down:'  (╠▣─▣╣)\n   铁甲卫\n  ████',
    parts:{head:2,body:'铁',arms:5,legs:5,aura:3},
    level:32, tier:'major',
    hp:900, atk:70, def:50, spd:9, mp:0,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_iron_ore',   chance:0.8, minQty:3, maxQty:6},
      {id:'item_gear_part',  chance:0.5, minQty:1, maxQty:3},
      {id:'item_nangong_badge', chance:0.15},
    ],
    exp:160, silver:20,
    desc:'南宫家机关统领，铠甲如铁墙，长枪势大力沉。',
    aggro:true, alignment:'neutral',
  },

  // ──────────────────────────────────────────────────
  //  第二幕：凉州沙漠遗迹
  //  enemies: desert_bandit / desert_scorpion / desert_spirit
  //           xuanming_agent / xuanming_elite / xuegu_commander
  // ──────────────────────────────────────────────────

  desert_bandit: {
    id:'desert_bandit', name:'沙漠马贼', type:'human', icon:'🏜️',
    stand:'   ┌◎_◎┐\n   │马 贼│\n  ┌┘ ░░ └┐\n  └──────┘',
    attack:['   ┌◎_◎┐  劈!\n   │马 贼│'],
    heavy:'  ══════════\n   ┌◎_◎┐\n   │马 贼│',
    hit:['   ┌◎>◎┐\n   │马 贼│\n  ┌┘ ░░ └┐'],
    down:'  (┌◎─◎┐)\n   马 贼\n  ░░░░',
    parts:{head:1,body:'贼',arms:3,legs:3,aura:1},
    level:28, tier:'func',
    hp:380, atk:50, def:14, spd:13, mp:0,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin', chance:0.8, minQty:20, maxQty:50},
      {id:'item_desert_cloth', chance:0.3},
    ],
    exp:75, silver:30,
    desc:'横行沙漠的马贼，刀法彪悍，靠劫掠商队为生。',
    aggro:true, alignment:'neutral',
  },

  desert_scorpion: {
    id:'desert_scorpion', name:'巨型毒蝎', type:'beast', icon:'🦂',
    stand:'   ╔◉_◉╗\n   ║毒 蝎║\n  ╔╝ ▓▓ ╚╗  ≋≋\n  ╚══════╝',
    attack:['   ╔◉_◉╗  蛰!\n   ║毒 蝎║≋≋'],
    heavy:'  ≋≋≋≋≋≋≋≋\n   ╔◉_◉╗\n   ║毒 蝎║',
    hit:['   ╔◉>◉╗\n   ║毒 蝎║\n  ╔╝ ▓▓ ╚╗'],
    down:'  (╔◉─◉╗)\n   毒 蝎\n  ▓▓▓▓',
    parts:{head:1,body:'蝎',arms:3,legs:6,aura:2},
    level:30, tier:'func',
    hp:420, atk:44, def:20, spd:14, mp:0,
    skills:['fi_lf1'],
    drops:[
      {id:'item_scorpion_poison', chance:0.5, minQty:1, maxQty:2},
      {id:'item_scorpion_claw',   chance:0.3},
      {id:'item_antidote',        chance:0.2},
    ],
    exp:90, silver:0,
    desc:'沙漠中的巨型毒蝎，尾刺剧毒，一击使人中毒。',
    aggro:true, alignment:'neutral',
  },

  desert_spirit: {
    id:'desert_spirit', name:'沙漠怨灵', type:'ghost', icon:'👻',
    stand:'   ╔☯_☯╗\n   ║怨 灵║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝',
    attack:['   ╔☯_☯╗  噬!\n   ║怨 灵║'],
    heavy:'  ▒▒▒▒▒▒▒▒\n   ╔☯_☯╗\n   ║怨 灵║',
    hit:['   ╔☯>☯╗\n   ║怨 灵║\n  ╔╝ ▒▒ ╚╗'],
    down:'  (╔☯─☯╗)\n   怨 灵\n  ▒▒▒▒',
    parts:{head:0,body:'灵',arms:0,legs:0,aura:4},
    level:32, tier:'func',
    hp:340, atk:58, def:8, spd:20, mp:50,
    skills:['fi_lf1','as_1'],
    drops:[
      {id:'item_ghost_crystal', chance:0.4, minQty:1, maxQty:2},
      {id:'item_ancient_coin',  chance:0.2},
    ],
    exp:110, silver:0,
    desc:'遗迹中封印的怨灵，穿透防御，速度飘忽难以捉摸。',
    aggro:true, alignment:'evil',
  },

  xuanming_agent: {
    id:'xuanming_agent', name:'玄冥教密探', type:'human', icon:'🌑',
    stand:'   ╔●_●╗\n   ║玄冥探║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝',
    attack:['   ╔●_●╗  冰!\n   ║玄冥探║寒气'],
    heavy:'  ░░░░░░░░░\n   ╔●_●╗\n   ║玄冥探║',
    hit:['   ╔●>●╗\n   ║玄冥探║\n  ╔╝ ▒▒ ╚╗'],
    down:'  (╔●─●╗)\n   玄冥探\n  ▒▒▒▒',
    parts:{head:2,body:'玄',arms:3,legs:4,aura:2},
    level:33, tier:'func',
    hp:380, atk:60, def:16, spd:17, mp:30,
    skills:['fi_lf1','as_1'],
    drops:[
      {id:'item_silver_coin',   chance:0.8, minQty:30, maxQty:60},
      {id:'item_xuanming_token', chance:0.2},
      {id:'item_frost_shard',   chance:0.25},
    ],
    exp:95, silver:40,
    desc:'玄冥教的渗透密探，擅长冰系功法，行踪诡秘。',
    aggro:true, alignment:'evil',
  },

  xuanming_elite: {
    id:'xuanming_elite', name:'玄冥护法', type:'human', icon:'❄️',
    stand:'   ╠●⊙●╣\n   ║玄冥护║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠●⊙●╣  冻!\n   ║玄冥护║冰刃'],
    heavy:'  ░░░░░░░░░░\n   ╠●⊙●╣\n   ║玄冥护║',
    hit:['   ╠●>⊙╣\n   ║玄冥护║\n  ╠╝ ██ ╚╣'],
    down:'  (╠●─●╣)\n   玄冥护\n  ████',
    parts:{head:2,body:'玄',arms:4,legs:5,aura:3},
    level:38, tier:'major',
    hp:700, atk:78, def:32, spd:15, mp:50,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      {id:'item_silver_coin',    chance:0.9, minQty:50, maxQty:100},
      {id:'item_xuanming_token', chance:0.4},
      {id:'item_frost_shard',    chance:0.5, minQty:1, maxQty:3},
    ],
    exp:180, silver:60,
    desc:'玄冥教的高级护法，冰功大成，寒气逼人，防御极强。',
    aggro:true, alignment:'evil',
  },

  xuegu_commander: {
    id:'xuegu_commander', name:'血骨门指挥官', type:'human', icon:'⚔️',
    stand:'   ╠◉⊙◉╣\n   ║指挥官║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠◉⊙◉╣  令!\n   ║指挥官║'],
    heavy:'  ██████████\n   ╠◉⊙◉╣\n   ║指挥官║',
    hit:['   ╠◉>⊙╣\n   ║指挥官║\n  ╠╝ ██ ╚╣'],
    down:'  (╠◉─◉╣)\n   指挥官\n  ████',
    parts:{head:2,body:'指',arms:4,legs:5,aura:3},
    level:40, tier:'major',
    hp:850, atk:85, def:40, spd:13, mp:0,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:60, maxQty:120},
      {id:'item_xuegu_token', chance:0.5},
      {id:'item_command_token', chance:0.2},
    ],
    exp:200, silver:70,
    desc:'血骨门野战指挥官，作战经验丰富，善用阵型压制。',
    aggro:true, alignment:'evil',
  },

  // ──────────────────────────────────────────────────
  //  第三幕：少林禁地调查
  //  enemies: shaolin_traitor / xuegu_infiltrator / xuanming_spy
  //           riyue_agent / traitor_elite
  // ──────────────────────────────────────────────────

  shaolin_traitor: {
    id:'shaolin_traitor', name:'叛道少林僧', type:'human', icon:'☯️',
    stand:'   ╔◉_◉╗\n   ║叛 僧║\n  ╔╝ ▓▓ ╚╗\n  ╚══════╝',
    attack:['   ╔◉_◉╗  掌!\n   ║叛 僧║'],
    heavy:'  ██████████\n   ╔◉_◉╗\n   ║叛 僧║',
    hit:['   ╔◉>◉╗\n   ║叛 僧║\n  ╔╝ ▓▓ ╚╗'],
    down:'  (╔◉─◉╗)\n   叛 僧\n  ▓▓▓▓',
    parts:{head:2,body:'僧',arms:4,legs:4,aura:2},
    level:36, tier:'func',
    hp:500, atk:68, def:28, spd:12, mp:30,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin', chance:0.7, minQty:30, maxQty:60},
      {id:'item_traitor_note', chance:0.2},
    ],
    exp:110, silver:30,
    desc:'被收买的少林弟子，心虚气短，但少林武功仍不可小觑。',
    aggro:true, alignment:'evil',
  },

  xuegu_infiltrator: {
    id:'xuegu_infiltrator', name:'血骨渗透者', type:'human', icon:'🎭',
    stand:'   ╔◎_◎╗\n   ║渗透者║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝',
    attack:['   ╔◎_◎╗  刺!\n   ║渗透者║暗'],
    heavy:'  ██████████\n   ╔◎_◎╗\n   ║渗透者║',
    hit:['   ╔◎>◎╗\n   ║渗透者║\n  ╔╝ ▒▒ ╚╗'],
    down:'  (╔◎─◎╗)\n   渗透者\n  ▒▒▒▒',
    parts:{head:2,body:'渗',arms:3,legs:4,aura:2},
    level:38, tier:'func',
    hp:420, atk:72, def:18, spd:19, mp:0,
    skills:['fi_lf1','as_1'],
    drops:[
      {id:'item_silver_coin', chance:0.8, minQty:35, maxQty:70},
      {id:'item_xuegu_token', chance:0.35},
      {id:'item_fake_monk_robe', chance:0.1},
    ],
    exp:120, silver:45,
    desc:'伪装成僧人潜入少林的血骨门特工，暗器出手致命。',
    aggro:true, alignment:'evil',
  },

  xuanming_spy: {
    id:'xuanming_spy', name:'玄冥冰僧', type:'human', icon:'🕵️',
    stand:'   ╔●_●╗\n   ║冰 僧║\n  ╔╝ ░░ ╚╗\n  ╚══════╝',
    attack:['   ╔●_●╗  冰!\n   ║冰 僧║'],
    heavy:'  ░░░░░░░░░░\n   ╔●_●╗\n   ║冰 僧║',
    hit:['   ╔●>●╗\n   ║冰 僧║\n  ╔╝ ░░ ╚╗'],
    down:'  (╔●─●╗)\n   冰 僧\n  ░░░░',
    parts:{head:2,body:'冰',arms:3,legs:4,aura:2},
    level:39, tier:'func',
    hp:440, atk:70, def:20, spd:16, mp:40,
    skills:['fi_lf1','as_1'],
    drops:[
      {id:'item_silver_coin',    chance:0.8, minQty:35, maxQty:75},
      {id:'item_xuanming_token', chance:0.3},
      {id:'item_spy_note',       chance:0.15},
    ],
    exp:125, silver:50,
    desc:'伪装成游方僧人的玄冥教间谍，在少林内暗中策动。',
    aggro:true, alignment:'evil',
  },

  riyue_agent: {
    id:'riyue_agent', name:'日月神教密探', type:'human', icon:'☀️',
    stand:'   ╔◎_◎╗\n   ║日月探║\n  ╔╝ ▒▒ ╚╗\n  ╚══════╝',
    attack:['   ╔◎_◎╗  刺!\n   ║日月探║'],
    heavy:'  ▓▓▓▓▓▓▓▓▓\n   ╔◎_◎╗\n   ║日月探║',
    hit:['   ╔◎>◎╗\n   ║日月探║\n  ╔╝ ▒▒ ╚╗'],
    down:'  (╔◎─◎╗)\n   日月探\n  ▒▒▒▒',
    parts:{head:2,body:'日',arms:3,legs:4,aura:2},
    level:37, tier:'func',
    hp:410, atk:66, def:16, spd:18, mp:0,
    skills:['fi_lf1','as_1'],
    drops:[
      {id:'item_silver_coin',  chance:0.8, minQty:30, maxQty:65},
      {id:'item_riyue_token',  chance:0.25},
    ],
    exp:115, silver:40,
    desc:'日月神教派来的密探，机警灵活，专门破坏正道势力。',
    aggro:true, alignment:'evil',
  },

  traitor_elite: {
    id:'traitor_elite', name:'戒律堂叛徒', type:'human', icon:'⛩️',
    stand:'   ╠◉⊙◉╣\n   ║戒律叛║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠◉⊙◉╣  破!\n   ║戒律叛║'],
    heavy:'  ██████████\n   ╠◉⊙◉╣\n   ║戒律叛║',
    hit:['   ╠◉>⊙╣\n   ║戒律叛║\n  ╠╝ ██ ╚╣'],
    down:'  (╠◉─◉╣)\n   戒律叛\n  ████',
    parts:{head:2,body:'律',arms:4,legs:5,aura:3},
    level:42, tier:'major',
    hp:780, atk:80, def:38, spd:14, mp:30,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      {id:'item_silver_coin',    chance:0.9, minQty:50, maxQty:100},
      {id:'item_traitor_note',   chance:0.4},
      {id:'item_shaolin_manual', chance:0.08},
    ],
    exp:190, silver:65,
    desc:'少林戒律堂的叛徒副手，深谙少林戒律破绽，专攻要害。',
    aggro:true, alignment:'evil',
  },

  // ──────────────────────────────────────────────────
  //  第四幕：幽州血骨门秘密据点
  //  enemies: xuegu_guard / xuanming_guard / riyue_elite
  //           alliance_guard / xuanming_commander
  //  （xuegu_elite/xuegu_commander 上面已定义）
  // ──────────────────────────────────────────────────

  xuegu_guard: {
    id:'xuegu_guard', name:'血骨门卫兵', type:'human', icon:'🛡️',
    stand:'   ╔◉_◉╗\n   ║卫 兵║\n  ╔╝ ▓▓ ╚╗\n  ╚══════╝',
    attack:['   ╔◉_◉╗  挡!\n   ║卫 兵║'],
    heavy:'  ██████████\n   ╔◉_◉╗\n   ║卫 兵║',
    hit:['   ╔◉>◉╗\n   ║卫 兵║\n  ╔╝ ▓▓ ╚╗'],
    down:'  (╔◉─◉╗)\n   卫 兵\n  ▓▓▓▓',
    parts:{head:2,body:'卫',arms:4,legs:4,aura:2},
    level:40, tier:'func',
    hp:620, atk:70, def:45, spd:10, mp:0,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:40, maxQty:80},
      {id:'item_xuegu_token', chance:0.3},
    ],
    exp:130, silver:50,
    desc:'血骨门据点的精锐卫兵，铠甲厚重，持长枪据守。',
    aggro:true, alignment:'evil',
  },

  xuanming_guard: {
    id:'xuanming_guard', name:'玄冥冰卫', type:'human', icon:'🧊',
    stand:'   ╔●_●╗\n   ║冰 卫║\n  ╔╝ ░░ ╚╗\n  ╚══════╝',
    attack:['   ╔●_●╗  冻!\n   ║冰 卫║'],
    heavy:'  ░░░░░░░░░░\n   ╔●_●╗\n   ║冰 卫║',
    hit:['   ╔●>●╗\n   ║冰 卫║\n  ╔╝ ░░ ╚╗'],
    down:'  (╔●─●╗)\n   冰 卫\n  ░░░░',
    parts:{head:2,body:'冰',arms:4,legs:4,aura:2},
    level:42, tier:'func',
    hp:580, atk:72, def:35, spd:13, mp:30,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin',    chance:0.9, minQty:40, maxQty:85},
      {id:'item_xuanming_token', chance:0.25},
      {id:'item_frost_shard',    chance:0.3, minQty:1, maxQty:2},
    ],
    exp:140, silver:55,
    desc:'玄冥教派驻据点的冰系护卫，攻防均衡，寒气伤人。',
    aggro:true, alignment:'evil',
  },

  riyue_elite: {
    id:'riyue_elite', name:'日月神教精锐', type:'human', icon:'🌗',
    stand:'   ╠◎⊙◎╣\n   ║日月精║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠◎⊙◎╣  击!\n   ║日月精║'],
    heavy:'  ▓▓▓▓▓▓▓▓▓▓\n   ╠◎⊙◎╣\n   ║日月精║',
    hit:['   ╠◎>⊙╣\n   ║日月精║\n  ╠╝ ██ ╚╣'],
    down:'  (╠◎─◎╣)\n   日月精\n  ████',
    parts:{head:2,body:'日',arms:4,legs:5,aura:3},
    level:44, tier:'major',
    hp:750, atk:82, def:30, spd:16, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:55, maxQty:110},
      {id:'item_riyue_token', chance:0.4},
    ],
    exp:185, silver:65,
    desc:'日月神教黑木崖的精锐使者，刚猛迅捷，来势凶猛。',
    aggro:true, alignment:'evil',
  },

  alliance_guard: {
    id:'alliance_guard', name:'三魔联合精锐', type:'human', icon:'☠️',
    stand:'   ╠◈⊙◈╣\n   ║联合精║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠◈⊙◈╣  破!\n   ║联合精║'],
    heavy:'  ████████████\n   ╠◈⊙◈╣\n   ║联合精║',
    hit:['   ╠◈>⊙╣\n   ║联合精║\n  ╠╝ ██ ╚╣'],
    down:'  (╠◈─◈╣)\n   联合精\n  ████',
    parts:{head:3,body:'联',arms:5,legs:5,aura:4},
    level:46, tier:'major',
    hp:820, atk:88, def:42, spd:15, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      {id:'item_silver_coin',    chance:0.9, minQty:60, maxQty:120},
      {id:'item_alliance_badge', chance:0.3},
    ],
    exp:210, silver:80,
    desc:'三魔联盟从各教精挑细选的联合精锐，协同作战，难以单挑。',
    aggro:true, alignment:'evil',
  },

  xuanming_commander: {
    id:'xuanming_commander', name:'玄冥教指挥官', type:'human', icon:'🌨️',
    stand:'   ╠●⊙●╣\n   ║玄冥令║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠●⊙●╣  冰!\n   ║玄冥令║冰芒'],
    heavy:'  ░░░░░░░░░░░░\n   ╠●⊙●╣\n   ║玄冥令║',
    hit:['   ╠●>⊙╣\n   ║玄冥令║\n  ╠╝ ██ ╚╣'],
    down:'  (╠●─●╣)\n   玄冥令\n  ████',
    parts:{head:3,body:'玄',arms:5,legs:5,aura:4},
    level:48, tier:'major',
    hp:880, atk:90, def:38, spd:14, mp:60,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin',    chance:0.9, minQty:65, maxQty:130},
      {id:'item_xuanming_token', chance:0.5},
      {id:'item_ice_shard',      chance:0.4, minQty:2, maxQty:4},
    ],
    exp:220, silver:90,
    desc:'玄冥教的高阶指挥官，冰功极深，可冰封周围空气令敌人行动迟缓。',
    aggro:true, alignment:'evil',
  },

  // ──────────────────────────────────────────────────
  //  第五幕：血骨门总坛
  //  enemies: xuegu_captain / xuegu_elder
  //  （xuegu_elite/xuanming_elite/riyue_elite/xuegu_general 已定义）
  // ──────────────────────────────────────────────────

  xuegu_captain: {
    id:'xuegu_captain', name:'血手修罗', type:'human', icon:'🩸',
    stand:'   ╠◉⊙◉╣\n   ║血手修║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠◉⊙◉╣  爪!\n   ║血手修║血爪'],
    heavy:'  ████████████\n   ╠◉⊙◉╣\n   ║血手修║',
    hit:['   ╠◉>⊙╣\n   ║血手修║\n  ╠╝ ██ ╚╣'],
    down:'  (╠◉─◉╣)\n   血手修\n  ████',
    parts:{head:3,body:'血',arms:5,legs:5,aura:4},
    level:52, tier:'major',
    hp:1100, atk:95, def:44, spd:16, mp:0,
    skills:['fi_lf1','fi_hf1','as_1'],
    drops:[
      {id:'item_silver_coin', chance:0.9, minQty:80, maxQty:160},
      {id:'item_xuegu_token', chance:0.6},
      {id:'item_blood_crystal', chance:0.2},
    ],
    exp:250, silver:100,
    desc:'总坛第一层的堂主，外号血手修罗，双手染血无数。',
    aggro:true, alignment:'evil',
  },

  xuegu_elder: {
    id:'xuegu_elder', name:'血魔老人', type:'human', icon:'💀',
    stand:'   ╠◉☠◉╣\n   ║血魔老║\n  ╠╝ ██ ╚╣\n  ╚══════╝',
    attack:['   ╠◉☠◉╣  噬!\n   ║血魔老║血魔掌'],
    heavy:'  ████████████\n   ╠◉☠◉╣\n   ║血魔老║',
    hit:['   ╠◉>☠╣\n   ║血魔老║\n  ╠╝ ██ ╚╣'],
    down:'  (╠◉─☠╣)\n   血魔老\n  ████',
    parts:{head:3,body:'血',arms:5,legs:5,aura:5},
    level:58, tier:'major',
    hp:1400, atk:108, def:50, spd:12, mp:40,
    skills:['fi_lf1','fi_hf1'],
    drops:[
      {id:'item_silver_coin',   chance:0.9, minQty:100, maxQty:200},
      {id:'item_xuegu_token',   chance:0.7},
      {id:'item_blood_crystal', chance:0.4},
      {id:'item_elder_robe',    chance:0.1},
    ],
    exp:320, silver:130,
    desc:'血骨门数十年的长老，血魔掌功已达化境，一掌能夺人精血。',
    aggro:true, alignment:'evil',
  },
};

// ── 合并到 STORY_ENEMY_DB ──────────────────────────
// 让 dungeonStartBattle fallback 时能统一查到所有剧情敌人
Object.assign(STORY_ENEMY_DB, STORY_MOB_DB);

// ════════════════════════════════════════════════════
//  导出
// ════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STORY_ENEMY_DB, STORY_MOB_DB, STORY_BOSS, createStoryBossInstance };
}
