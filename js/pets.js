/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  宠物系统核心逻辑 - pets.js
 *  江湖将将胡 · 灵宠系统
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
//  全局状态
// ═══════════════════════════════════════════════════════════════════════════════
let PET_STATE = {
  pets: [],           // 拥有的宠物列表
  activePetId: null,  // 当前出战的宠物ID
  petBag: [],         // 宠物道具背包
  lastFeedTime: 0,    // 上次喂食时间
  lastPlayTime: 0,    // 上次玩耍时间
  version: '1.0'
};

// ═══════════════════════════════════════════════════════════════════════════════
//  存储键名
// ═══════════════════════════════════════════════════════════════════════════════
const PET_STORAGE_KEY = 'wuxia_pets';

// ═══════════════════════════════════════════════════════════════════════════════
//  初始化宠物系统
// ═══════════════════════════════════════════════════════════════════════════════
function initPetSystem() {
  _petLoadState();
  console.log('[宠物系统] 初始化完成，拥有宠物数:', PET_STATE.pets.length);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  存档/读档
// ═══════════════════════════════════════════════════════════════════════════════
function _petSaveState() {
  try {
    localStorage.setItem(PET_STORAGE_KEY, JSON.stringify(PET_STATE));
  } catch (e) {
    console.error('[宠物系统] 存档失败:', e);
  }
}

function _petLoadState() {
  try {
    const saved = localStorage.getItem(PET_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      PET_STATE = { ...PET_STATE, ...parsed };
    }
  } catch (e) {
    console.error('[宠物系统] 读档失败:', e);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  创建宠物实例
// ═══════════════════════════════════════════════════════════════════════════════
function createPetInstance(petId, customName = null) {
  const template = PET_DB[petId];
  if (!template) {
    console.error('[宠物系统] 未知宠物ID:', petId);
    return null;
  }

  const rarity = PET_RARITY[template.rarity] || PET_RARITY.COMMON;
  
  return {
    instanceId: 'pet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    petId: petId,
    name: customName || template.name,
    level: 1,
    exp: 0,
    maxExp: getPetExpForLevel(1),
    
    // 当前属性（基础值 + 成长）
    stats: { ...template.baseStats },
    
    // 状态
    satiety: 80,        // 饱食度 0-100
    happiness: 80,      // 快乐度 0-100
    loyalty: 50,        // 忠诚度 0-100
    hp: template.baseStats.hp,
    maxHp: template.baseStats.hp,
    
    // 技能
    skills: [...template.skills],

    // 装备槽 { amulet: equipId|null, armor: equipId|null, mount: equipId|null }
    equips: { amulet: null, armor: null, mount: null },

    // 进化相关
    evolvedFrom: null,   // 进化来源宠物ID（null=未进化）
    evolvedTimes: 0,     // 已进化次数

    // 其他
    caughtDate: Date.now(),
    battlesWon: 0,
    itemsGathered: 0,
    isActive: false
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物ID映射表（简化ID -> 完整ID）
// ═══════════════════════════════════════════════════════════════════════════════
const PET_ID_MAP = {
  'wolf': 'pet_wolf',
  'tiger': 'pet_tiger',
  'bear': 'pet_bear',
  'dragon': 'pet_dragon',
  'bunny': 'pet_rabbit',
  'rabbit': 'pet_rabbit',
  'deer': 'pet_deer',
  'fox': 'pet_fox',
  'phoenix': 'pet_phoenix',
  'squirrel': 'pet_squirrel',
  'mole': 'pet_mole',
  'monkey': 'pet_monkey',
  'turtle': 'pet_turtle',
  'snake': 'pet_snake',
  'panda': 'pet_panda',
  'kirin': 'pet_kirin',
  'eagle': 'pet_phoenix', // 猎鹰映射到雏凤（类似鸟类）
};

// ═══════════════════════════════════════════════════════════════════════════════
//  获取完整宠物ID
// ═══════════════════════════════════════════════════════════════════════════════
function _getFullPetId(simpleId) {
  return PET_ID_MAP[simpleId] || simpleId;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  添加宠物（简化接口，供奇遇事件调用）
// ═══════════════════════════════════════════════════════════════════════════════
function petAdd(simpleId, customName = null) {
  const fullId = _getFullPetId(simpleId);
  return petCatch(fullId, customName);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  获取宠物
// ═══════════════════════════════════════════════════════════════════════════════
function petCatch(petId, customName = null) {
  const template = PET_DB[petId];
  if (!template) return { success: false, msg: '未知宠物' };

  // 检查是否已有同类型宠物（可选限制）
  const existing = PET_STATE.pets.find(p => p.petId === petId);
  if (existing) {
    return { success: false, msg: `你已经有一只${template.name}了` };
  }

  // 检查宠物栏位（最多10只）
  if (PET_STATE.pets.length >= 10) {
    return { success: false, msg: '宠物栏已满（最多10只）' };
  }

  const pet = createPetInstance(petId, customName);
  if (!pet) return { success: false, msg: '创建宠物失败' };

  PET_STATE.pets.push(pet);
  _petSaveState();

  return { 
    success: true, 
    msg: `成功获得 ${pet.name}！`,
    pet: pet
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  释放宠物
// ═══════════════════════════════════════════════════════════════════════════════
function petRelease(instanceId) {
  const idx = PET_STATE.pets.findIndex(p => p.instanceId === instanceId);
  if (idx === -1) return { success: false, msg: '宠物不存在' };

  const pet = PET_STATE.pets[idx];
  const name = pet.name;

  // 如果是出战宠物，先收回
  if (PET_STATE.activePetId === instanceId) {
    petRecall();
  }

  PET_STATE.pets.splice(idx, 1);
  _petSaveState();

  return { success: true, msg: `${name} 已放生` };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  出战/召回宠物
// ═══════════════════════════════════════════════════════════════════════════════
function petDeploy(instanceId) {
  // 先召回当前出战的
  if (PET_STATE.activePetId) {
    petRecall();
  }

  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };

  // 检查状态
  if (pet.satiety <= 0) {
    return { success: false, msg: `${pet.name} 太饿了，无法出战` };
  }
  if (pet.happiness <= 0) {
    return { success: false, msg: `${pet.name} 不开心，不想出战` };
  }

  pet.isActive = true;
  PET_STATE.activePetId = instanceId;
  _petSaveState();

  return { success: true, msg: `${pet.name} 开始跟随你！`, pet: pet };
}

function petRecall() {
  if (!PET_STATE.activePetId) return { success: false, msg: '没有出战的宠物' };

  const pet = PET_STATE.pets.find(p => p.instanceId === PET_STATE.activePetId);
  if (pet) {
    pet.isActive = false;
  }
  
  PET_STATE.activePetId = null;
  _petSaveState();

  return { success: true, msg: pet ? `${pet.name} 已召回` : '宠物已召回' };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  获取当前出战宠物
// ═══════════════════════════════════════════════════════════════════════════════
function petGetActive() {
  if (!PET_STATE.activePetId) return null;
  return PET_STATE.pets.find(p => p.instanceId === PET_STATE.activePetId) || null;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  喂食
// ═══════════════════════════════════════════════════════════════════════════════
function petFeed(instanceId, foodId) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };

  const template = PET_DB[pet.petId];
  const food = PET_FOODS[foodId];
  if (!food) return { success: false, msg: '未知食物' };

  // 检查是否是宠物喜欢的食物类型
  const isFavorite = template.food === foodId;
  const satietyGain = isFavorite ? food.satiety * 1.5 : food.satiety;
  const happinessGain = isFavorite ? food.happiness * 1.5 : food.happiness;
  const loyaltyGain = isFavorite ? 5 : 2;

  pet.satiety = Math.min(100, pet.satiety + satietyGain);
  pet.happiness = Math.min(100, pet.happiness + happinessGain);
  pet.loyalty = Math.min(100, pet.loyalty + loyaltyGain);
  
  PET_STATE.lastFeedTime = Date.now();
  _petSaveState();

  return { 
    success: true, 
    msg: `${pet.name} 吃得很开心！${isFavorite ? '（最爱！）' : ''}`,
    gains: { satiety: satietyGain, happiness: happinessGain, loyalty: loyaltyGain }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  玩耍
// ═══════════════════════════════════════════════════════════════════════════════
function petPlay(instanceId) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };

  pet.happiness = Math.min(100, pet.happiness + 20);
  pet.loyalty = Math.min(100, pet.loyalty + 3);
  
  PET_STATE.lastPlayTime = Date.now();
  _petSaveState();

  return { 
    success: true, 
    msg: `你和 ${pet.name} 玩得很开心！`,
    gains: { happiness: 20, loyalty: 3 }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  治疗
// ═══════════════════════════════════════════════════════════════════════════════
function petHeal(instanceId, amount) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };

  const healed = Math.min(amount, pet.maxHp - pet.hp);
  pet.hp += healed;
  _petSaveState();

  return { 
    success: true, 
    msg: `${pet.name} 恢复了 ${healed} 点生命`,
    healed: healed
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物装备管理
// ═══════════════════════════════════════════════════════════════════════════════

/** 获取宠物装备属性加成总和 */
function petGetEquipBonus(pet) {
  const bonus = { atk: 0, def: 0, hp: 0, spd: 0, int: 0 };
  if (!pet || !pet.equips) return bonus;
  for (const [slot, equipId] of Object.entries(pet.equips)) {
    if (equipId && PET_EQUIPS[equipId]) {
      const eq = PET_EQUIPS[equipId];
      if (eq.stats) {
        for (const [stat, val] of Object.entries(eq.stats)) {
          if (bonus[stat] !== undefined) bonus[stat] += val;
        }
      }
    }
  }
  return bonus;
}

/** 穿戴装备到指定槽位 */
function petEquipItem(instanceId, equipId) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };
  if (!PET_EQUIPS[equipId]) return { success: false, msg: '无效装备' };
  const equip = PET_EQUIPS[equipId];
  if (!PET_EQUIP_SLOTS.includes(equip.slot)) return { success: false, msg: '无效装备槽' };

  const oldEquipId = pet.equips[equip.slot];
  pet.equips[equip.slot] = equipId;
  // 重新计算 maxHp（基于装备加成）
  const bonus = petGetEquipBonus(pet);
  const baseHp = pet.stats.hp + bonus.hp;
  pet.maxHp = baseHp;
  if (pet.hp > pet.maxHp) pet.hp = pet.maxHp;

  _petSaveState();
  return {
    success: true,
    msg: `${pet.name} 装备了 ${PET_EQUIP_NAMES[equip.slot].icon} ${equip.name}`,
    oldEquipId: oldEquipId
  };
}

/** 卸下指定槽位装备 */
function petUnequipItem(instanceId, slot) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };
  if (!PET_EQUIP_SLOTS.includes(slot)) return { success: false, msg: '无效装备槽' };
  if (!pet.equips[slot]) return { success: false, msg: '该槽位没有装备' };

  const oldEquipId = pet.equips[slot];
  pet.equips[slot] = null;
  const bonus = petGetEquipBonus(pet);
  const baseHp = pet.stats.hp + bonus.hp;
  pet.maxHp = baseHp;
  if (pet.hp > pet.maxHp) pet.hp = pet.maxHp;

  _petSaveState();
  return { success: true, msg: `${pet.name} 卸下了 ${PET_EQUIP_NAMES[slot].icon}`, oldEquipId: oldEquipId };
}

/** 获取可穿戴装备列表（按槽位分组） */
function petGetEquipOptions(petId) {
  const options = {};
  for (const slot of PET_EQUIP_SLOTS) {
    options[slot] = Object.values(PET_EQUIPS).filter(e => e.slot === slot);
  }
  return options;
}

/** 获取已穿戴的装备详情 */
function petGetEquippedItems(pet) {
  if (!pet || !pet.equips) return {};
  const result = {};
  for (const [slot, equipId] of Object.entries(pet.equips)) {
    result[slot] = equipId ? PET_EQUIPS[equipId] : null;
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  宠物进化系统
// ═══════════════════════════════════════════════════════════════════════════════

/** 检查宠物是否可以进化 */
function petCanEvolve(pet) {
  if (!pet) return { can: false, reason: '宠物不存在' };
  const evoTree = PET_EVOLUTIONS[pet.petId];
  if (!evoTree || !evoTree.evolveTo) return { can: false, reason: '该宠物无法继续进化' };
  const nextForm = Object.values(evoTree.evolveTo)[0]; // 第一进化形态
  if (pet.level < nextForm.levelReq) return { can: false, reason: `需要达到 ${nextForm.levelReq} 级才能进化（当前 ${pet.level} 级）` };
  // 检查道具（需要从玩家背包扣除）
  if (typeof edS !== 'undefined' && Array.isArray(edS.bag)) {
    for (const req of nextForm.items) {
      const count = edS.bag.filter(i => i.templateId === req.id).length;
      if (count < req.count) return { can: false, reason: `需要 ${req.count} 个 ${PET_ITEMS[req.id]?.name || req.id}（背包不足）` };
    }
  }
  return { can: true, nextForm: nextForm };
}

/** 执行宠物进化 */
function petEvolve(instanceId) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };
  const check = petCanEvolve(pet);
  if (!check.can) return { success: false, msg: check.reason };

  const evoTree = PET_EVOLUTIONS[pet.petId];
  const nextForm = Object.values(evoTree.evolveTo)[0];

  // 扣除进化道具
  if (typeof edS !== 'undefined' && Array.isArray(edS.bag)) {
    for (const req of nextForm.items) {
      for (let i = 0; i < req.count; i++) {
        const idx = edS.bag.findIndex(it => it.templateId === req.id);
        if (idx >= 0) edS.bag.splice(idx, 1);
      }
    }
    if (typeof bagSave === 'function') bagSave();
  }

  const oldPetId = pet.petId;
  const oldName = pet.name;

  // 更新宠物ID和名称
  const newPetId = Object.keys(evoTree.evolveTo)[0];
  const newTemplate = PET_DB[newPetId];
  pet.petId = newPetId;
  pet.name = nextForm.name;
  pet.evolvedFrom = oldPetId;
  pet.evolvedTimes = (pet.evolvedTimes || 0) + 1;

  // 属性飞跃：基础属性 × 成长系数
  const template = PET_DB[oldPetId];
  const newBase = newTemplate.baseStats;
  const oldBase = template.baseStats;
  const mult = nextForm.statsMult;
  pet.stats = {
    atk: Math.floor(oldBase.atk * mult.atk),
    def: Math.floor(oldBase.def * mult.def),
    hp: Math.floor(oldBase.hp * mult.hp),
    spd: Math.floor(oldBase.spd * mult.spd),
    int: Math.floor(oldBase.int * mult.int),
  };

  // 添加新技能（如果宠物还没有）
  if (nextForm.newSkill && !pet.skills.includes(nextForm.newSkill)) {
    pet.skills.push(nextForm.newSkill);
  }

  // 重置 maxHp 并回满
  const bonus = petGetEquipBonus(pet);
  pet.maxHp = pet.stats.hp + bonus.hp;
  pet.hp = pet.maxHp;

  // 保留装备（不重置）
  _petSaveState();

  return {
    success: true,
    msg: `🎉 ${oldName} 进化为 ${nextForm.name}！属性大幅提升！`,
    newPetId: newPetId,
    newName: nextForm.name
  };
}

/** 获取宠物进化信息（用于UI显示） */
function petGetEvolveInfo(pet) {
  if (!pet) return null;
  const evoTree = PET_EVOLUTIONS[pet.petId];
  if (!evoTree) return null;
  const nextForms = evoTree.evolveTo;
  if (!nextForms) return { canEvolve: false, reason: '已达最高形态' };
  const nextForm = Object.values(nextForms)[0];
  const check = petCanEvolve(pet);
  return {
    canEvolve: check.can,
    reason: check.reason,
    nextForm: nextForm,
    levelReq: nextForm.levelReq,
    items: nextForm.items
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  改名
// ═══════════════════════════════════════════════════════════════════════════════
function petRename(instanceId, newName) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };
  if (!newName || newName.trim().length === 0) {
    return { success: false, msg: '名字不能为空' };
  }
  if (newName.length > 10) {
    return { success: false, msg: '名字不能超过10个字' };
  }

  const oldName = pet.name;
  pet.name = newName.trim();
  _petSaveState();

  return { success: true, msg: `${oldName} 改名为 ${pet.name}` };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  获得经验
// ═══════════════════════════════════════════════════════════════════════════════
function petGainExp(instanceId, exp, source = '') {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return { success: false, msg: '宠物不存在' };

  const template = PET_DB[pet.petId];
  const rarity = PET_RARITY[template.rarity] || PET_RARITY.COMMON;
  
  // 稀有度影响经验获取
  const adjustedExp = Math.floor(exp * rarity.expMod);
  
  pet.exp += adjustedExp;
  
  // 检查升级
  let leveledUp = false;
  let levelsGained = 0;
  
  while (pet.exp >= pet.maxExp && pet.level < rarity.maxLvl) {
    pet.exp -= pet.maxExp;
    pet.level++;
    levelsGained++;
    leveledUp = true;
    
    // 升级提升属性
    _petLevelUpStats(pet);
    
    pet.maxExp = getPetExpForLevel(pet.level);
  }

  _petSaveState();

  return {
    success: true,
    expGained: adjustedExp,
    leveledUp: leveledUp,
    levelsGained: levelsGained,
    currentLevel: pet.level,
    msg: leveledUp 
      ? `${pet.name} 升到了 ${pet.level} 级！` 
      : `${pet.name} 获得 ${adjustedExp} 经验${source ? '（' + source + '）' : ''}`
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  升级属性提升
// ═══════════════════════════════════════════════════════════════════════════════
function _petLevelUpStats(pet) {
  const template = PET_DB[pet.petId];
  const growth = PET_TYPES[template.type].statGrowth;
  
  pet.stats.atk += Math.floor(template.baseStats.atk * 0.1 * growth.atk);
  pet.stats.def += Math.floor(template.baseStats.def * 0.1 * growth.def);
  pet.stats.hp += Math.floor(template.baseStats.hp * 0.1 * growth.hp);
  pet.stats.spd += Math.floor(template.baseStats.spd * 0.1 * growth.spd);
  pet.stats.int += Math.floor(template.baseStats.int * 0.1 * growth.int);
  
  // 恢复满血
  pet.maxHp = pet.stats.hp;
  pet.hp = pet.maxHp;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  战斗辅助 - 宠物攻击
// ═══════════════════════════════════════════════════════════════════════════════
function petBattleAttack(pet, enemy) {
  if (!pet || pet.hp <= 0) return null;

  const template = PET_DB[pet.petId];
  
  // 计算伤害
  const baseDmg = pet.stats.atk;
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2
  const damage = Math.floor(baseDmg * randomFactor);
  
  // 消耗饱食度
  pet.satiety = Math.max(0, pet.satiety - 2);
  
  // 随机使用技能
  let skillUsed = null;
  if (pet.skills.length > 0 && Math.random() < 0.3) {
    const skillId = pet.skills[Math.floor(Math.random() * pet.skills.length)];
    skillUsed = PET_SKILLS[skillId];
  }

  _petSaveState();

  return {
    damage: damage,
    skill: skillUsed,
    msg: skillUsed 
      ? `${pet.name} 使用 ${skillUsed.name} 造成 ${damage} 伤害！`
      : `${pet.name} 造成 ${damage} 伤害！`
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  战斗辅助 - 宠物辅助
// ═══════════════════════════════════════════════════════════════════════════════
function petBattleSupport(pet, player) {
  if (!pet || pet.hp <= 0) return null;

  const template = PET_DB[pet.petId];
  const type = template.type;
  
  let result = null;
  
  if (type === 'SUPPORT') {
    // 辅助型：治疗或BUFF
    const healAmount = Math.floor(pet.stats.int * 0.5);
    result = {
      type: 'heal',
      amount: healAmount,
      msg: `${pet.name} 为你恢复 ${healAmount} 点生命！`
    };
  } else if (type === 'COMBAT') {
    // 战斗型：给主人加攻击BUFF
    result = {
      type: 'buff',
      stat: 'atk',
      amount: Math.floor(pet.stats.atk * 0.2),
      msg: `${pet.name} 的咆哮提升了你的斗志！`
    };
  } else if (type === 'SPECIAL') {
    // 特殊型：随机效果
    const effects = ['heal', 'buff', 'cleanse'];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    if (effect === 'heal') {
      result = {
        type: 'heal',
        amount: Math.floor(pet.stats.int * 0.3),
        msg: `${pet.name} 施展神秘力量为你恢复生命！`
      };
    } else if (effect === 'buff') {
      result = {
        type: 'buff',
        stat: 'spd',
        amount: Math.floor(pet.stats.spd * 0.2),
        msg: `${pet.name} 让你感觉身轻如燕！`
      };
    }
  }

  // 消耗饱食度
  pet.satiety = Math.max(0, pet.satiety - 1);
  _petSaveState();

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  战斗结束结算
// ═══════════════════════════════════════════════════════════════════════════════
function petBattleEnd(won) {
  const pet = petGetActive();
  if (!pet) return;

  // 获得经验
  const expGain = won ? 20 + Math.floor(Math.random() * 10) : 5;
  petGainExp(pet.instanceId, expGain, won ? '战斗胜利' : '战斗参与');

  if (won) {
    pet.battlesWon++;
  }

  // 降低快乐度
  pet.happiness = Math.max(0, pet.happiness - 5);
  
  _petSaveState();
}

// ═══════════════════════════════════════════════════════════════════════════════
//  采集辅助
// ═══════════════════════════════════════════════════════════════════════════════
function petGatherAssist(pet) {
  if (!pet || pet.satiety <= 20) return null;

  const template = PET_DB[pet.petId];
  if (template.type !== 'GATHER') return null;

  // 30%概率额外获得物品
  if (Math.random() < 0.3) {
    pet.satiety = Math.max(0, pet.satiety - 5);
    pet.itemsGathered++;
    pet.happiness = Math.min(100, pet.happiness + 5);
    _petSaveState();
    
    return {
      bonus: true,
      msg: `${pet.name} 帮你找到了额外的物品！`
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  获取所有宠物列表（用于UI显示）
// ═══════════════════════════════════════════════════════════════════════════════
function petGetAll() {
  return PET_STATE.pets.map(p => {
    const template = PET_DB[p.petId];
    const rarity = PET_RARITY[template.rarity];
    return {
      ...p,
      template: template,
      rarityInfo: rarity,
      typeInfo: PET_TYPES[template.type],
      ascii: getPetAscii(template.ascii, 'idle')
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  获取宠物详细信息
// ═══════════════════════════════════════════════════════════════════════════════
function petGetDetail(instanceId) {
  const pet = PET_STATE.pets.find(p => p.instanceId === instanceId);
  if (!pet) return null;

  const template = PET_DB[pet.petId];
  const rarity = PET_RARITY[template.rarity];
  const type = PET_TYPES[template.type];

  // 获取技能详情
  const skills = pet.skills.map(sid => PET_SKILLS[sid]).filter(Boolean);

  return {
    ...pet,
    template: template,
    rarityInfo: rarity,
    typeInfo: type,
    skills: skills,
    ascii: getPetAscii(template.ascii, 'idle'),
    foodInfo: PET_FOODS[template.food]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  时间流逝更新（饱食度/快乐度自然下降）
// ═══════════════════════════════════════════════════════════════════════════════
function petTimeUpdate() {
  const now = Date.now();
  const hoursPassed = (now - (PET_STATE.lastFeedTime || now)) / (1000 * 60 * 60);
  
  if (hoursPassed >= 1) {
    PET_STATE.pets.forEach(pet => {
      // 每小时下降
      pet.satiety = Math.max(0, pet.satiety - 5);
      pet.happiness = Math.max(0, pet.happiness - 3);
      
      // 如果太饿，忠诚度也会下降
      if (pet.satiety <= 0) {
        pet.loyalty = Math.max(0, pet.loyalty - 2);
      }
    });
    
    _petSaveState();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  导出
// ═══════════════════════════════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initPetSystem,
    petCatch,
    petRelease,
    petDeploy,
    petRecall,
    petGetActive,
    petFeed,
    petPlay,
    petHeal,
    petRename,
    petGainExp,
    petBattleAttack,
    petBattleSupport,
    petBattleEnd,
    petGatherAssist,
    petGetAll,
    petGetDetail,
    petTimeUpdate,
    // 新增：装备系统
    petEquipItem,
    petUnequipItem,
    petGetEquipBonus,
    petGetEquipOptions,
    petGetEquippedItems,
    PET_EQUIPS,
    PET_EQUIP_SLOTS,
    PET_EQUIP_NAMES,
    // 新增：进化系统
    petCanEvolve,
    petEvolve,
    petGetEvolveInfo,
    PET_EVOLUTIONS,
    PET_STATE
  };
}
