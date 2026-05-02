// npc-combat.js — NPC战斗属性 / 装备实例 / 死亡重生 / 击杀确认
// 依赖: npc-data.js, npc-logic.js
// version: 2

// ── NPC 角色类型 → 战斗基底（将将胡版）──
// roleType 决定等级范围和属性倾向
// 设计原则：HP高/ATK适中 → 敌人耐打但不秒杀，让牌序博弈有空间
const NPC_ROLE_COMBAT = {
  // 功能性 NPC（低等级，有基本武装）
  inn_keeper:       { lvMin:5,  lvMax:15, tier:'func',   silverMin:10, silverMax:40,  armorTier:'common'  },
  doctor:           { lvMin:8,  lvMax:18, tier:'func',   silverMin:20, silverMax:60,  armorTier:'uncommon'},
  blacksmith:       { lvMin:10, lvMax:20, tier:'func',   silverMin:15, silverMax:50,  armorTier:'uncommon'},
  tavern_girl:      { lvMin:3,  lvMax:10, tier:'func',   silverMin:5,  silverMax:20,  armorTier:'common'  },
  old_beggar:       { lvMin:1,  lvMax:8,  tier:'func',   silverMin:1,  silverMax:10,  armorTier:'common'  },
  merchant:         { lvMin:5,  lvMax:15, tier:'func',   silverMin:50, silverMax:200, armorTier:'uncommon'},
  // 重要 NPC（中高等级）
  kung_fu_master:   { lvMin:40, lvMax:65, tier:'major',  silverMin:30, silverMax:100, armorTier:'rare'    },
  sect_elder:       { lvMin:55, lvMax:80, tier:'major',  silverMin:50, silverMax:150, armorTier:'rare'    },
  // 顶级 NPC（需要在 NPC_DB 固定 NPC 中手动配置）
  // tier:'elite' 由各地固定 NPC 专属配置
};

// ── 按等级和 tier 计算基础战斗属性 ──
// 先用 primary-stats.js 的五维换算，再叠加tier倍率
// roleStyle 影响属性偏向（fighter/monk/taoist/swordsman/assassin等）
// ★ 返回值包含 primaryPts 字段，供 statMult 直接读取（不再反推）
function calcNpcBaseStats(level, tier, roleStyle){
  const lv = Math.max(1, level);

  // 用基础属性系统生成NPC五维（已按tier专精化）
  let primaryPts;
  if(typeof calcNpcPrimaryStats === 'function'){
    primaryPts = calcNpcPrimaryStats(lv, tier, roleStyle || 'default');
  } else {
    // fallback：均衡分配
    const base = Math.round(lv * 3);
    primaryPts = { vigor:base, tough:base, swift:Math.round(base*0.8), inner:base, will:Math.round(base*0.8) };
  }

  // 五维→战斗属性换算（同 calcPrimaryBonus）
  let bonus;
  if(typeof calcPrimaryBonus === 'function'){
    bonus = calcPrimaryBonus(primaryPts);
  } else {
    bonus = { hp:0, atk:0, def:0, spd:0, dodge:0, mp:0, crit:0 };
  }

  // 基础底盘（等级线性成长，已压缩——更多来自五维换算）
  // ★ 将将胡版（2026-04-28）：卡牌系统玩家每牌=连环3连，DPS爆炸
  //   → 降低敌人ATK（单次打人不痛），大幅提升HP（更耐打/持久博弈）
  //   ATK回到原版，HP整体×1.8
  const base = {
    maxHp:  72 + lv * 14.4, // 底盘血量×1.8：Lv10≈217，Lv50≈792，Lv100≈1512
    atk:    5  + lv * 1.0,   // 底盘攻击回到原版：单次不痛，靠连环积少成多
    def:    2  + lv * 0.5,   // 底盘防御：Lv50≈27,  Lv100≈52
    crit:   5,               // 基础暴击5%，靠心志/内息加
    dodge:  3,               // 基础闪避3%，靠身法加
    spd:    5  + lv * 0.08,  // 底盘速度：Lv50≈9,   Lv100≈13
    maxMp:  30 + lv * 4,     // 底盘内力：Lv50≈230, Lv100≈430
  };

  // 叠加五维换算结果
  // ★ 将将胡版（2026-04-28）：tier倍率配合新HP/ATK比例
  //   func: 1.25，major: 1.40
  //   elite 动态倍率：Lv50-70=2.2 | Lv71-85=2.0 | Lv86+=1.8
  //   设计原则：敌人高HP低ATK → 持久博弈，而非一波秒
  let tierMult;
  if(tier === 'elite'){
    // 动态elite倍率：等级越高倍率越低
    if(lv <= 70) tierMult = 2.2;
    else if(lv <= 85) tierMult = 2.0;
    else tierMult = 1.8;
  } else {
    tierMult = { func:1.25, major:1.40 }[tier] || 1.0;
  }
  return {
    maxHp:  Math.round((base.maxHp  + bonus.hp)   * tierMult),
    atk:    Math.round((base.atk    + bonus.atk)   * tierMult),
    def:    Math.round((base.def    + bonus.def)   * tierMult),
    crit:   Math.min(40, Math.round((base.crit  + bonus.crit)  * tierMult)),  // 上限40%
    dodge:  Math.min(30, Math.round((base.dodge + bonus.dodge) * tierMult)),  // 上限30%
    spd:    Math.round(((base.spd   + bonus.spd)   * tierMult) * 10) / 10,
    maxMp:  Math.round((base.maxMp  + bonus.mp)    * tierMult),
    // ★ 附带真实五维，供战斗系统 statMult 直接使用，避免反推误差
    primaryPts,
  };
}

// ── 全局神器所有权注册表（键=武器id，值='player'|npcId）──
// 每次 npcState 加载时从 npcState.uniqueOwners 恢复
function getUniqueOwners(){
  return npcState.uniqueOwners || (npcState.uniqueOwners = {});
}

// 检查神器是否可被某 NPC 持有（玩家或其他活着的 NPC 没有拿）
function canNpcHoldUnique(wepId, npcInstId){
  const owners = getUniqueOwners();
  const cur = owners[wepId];
  if(!cur || cur === npcInstId) return true; // 未被占有，或就是它自己
  return false;
}

// 登记神器归属
function registerUniqueOwner(wepId, ownerId){
  const owners = getUniqueOwners();
  owners[wepId] = ownerId;
  npcStateSave();
}
function releaseUniqueOwner(wepId){
  const owners = getUniqueOwners();
  delete owners[wepId];
  npcStateSave();
}

// ── 为 NPC 生成鉴定好的武器实例 ──
// weaponId: 指定武器模板（null = 按等级/tier随机）
// npcTier: 'func'|'major'|'elite'，决定随机稀有度范围
function createNpcWeaponInst(npcInstId, weaponId, level, npcTier){
  // 确定武器模板
  let tpl = null;
  if(weaponId){
    tpl = WEAPONS.find(w=> w.id === weaponId);
    // 若指定的武器是神器(unique)但已被占用，降级为随机
    if(tpl && tpl.unique && !canNpcHoldUnique(tpl.id, npcInstId)){
      tpl = null;
    }
  }
  if(!tpl){
    // 按等级+tier决定稀有度池
    // elite: 一定概率持有 mythic/legendary；major: epic/legendary
    let rarityPool;
    if(npcTier === 'elite'){
      rarityPool = ['legendary','mythic']; // BOSS 持有传说/神器
    } else if(npcTier === 'major'){
      rarityPool = level >= 70 ? ['legendary','epic'] :
                   level >= 50 ? ['epic','rare'] : ['rare','epic'];
    } else {
      // func NPC
      rarityPool = level >= 70 ? ['epic','legendary'] :
                   level >= 45 ? ['rare','epic'] :
                   level >= 25 ? ['uncommon','rare'] : ['common','uncommon'];
    }
    const candidates = WEAPONS.filter(w=>{
      if(!rarityPool.includes(w.rarity)) return false;
      if(w.unique && !canNpcHoldUnique(w.id, npcInstId)) return false;
      return true;
    });
    tpl = candidates[Math.floor(Math.random()*candidates.length)] || WEAPONS[0];
  }
  if(!tpl) return null;

  // 生成实例（直接鉴定，按稀有度给词条）
  const inst = createEquipInst('weapon', tpl.id);
  if(!inst) return null;
  inst.identified = true;
  inst.npcOwner = npcInstId; // 标记归属

  // 如果是神器，登记唯一归属
  if(tpl.unique) registerUniqueOwner(tpl.id, npcInstId);

  // 补词条（common 无词条；elite NPC补满词条）
  if(tpl.rarity !== 'common' && (!inst.affixes || inst.affixes.length === 0)){
    inst.affixes = rollNpcAffixes(tpl.rarity);
  }
  return inst;
}

// ── 为 NPC 生成鉴定好的防具实例 ──
// npcTier: 'func'|'major'|'elite'，elite持有legendary/epic，major持有epic/rare
function createNpcArmorInst(npcInstId, armorId, armorTier, level, npcTier){
  let tpl = null;
  if(armorId){
    tpl = COSTUMES.find(c=> c.id === armorId);
  }
  if(!tpl){
    // elite: legendary/epic；major: epic/rare；func: 按armorTier
    let rarityPool;
    if(npcTier === 'elite'){
      rarityPool = ['legendary','epic'];
    } else if(npcTier === 'major'){
      rarityPool = level >= 60 ? ['epic','rare'] : ['rare','uncommon'];
    } else {
      rarityPool = armorTier === 'rare'    ? ['rare','uncommon'] :
                   armorTier === 'uncommon' ? ['uncommon','common'] : ['common'];
    }
    const candidates = COSTUMES.filter(c=> rarityPool.includes(c.rarity));
    tpl = candidates[Math.floor(Math.random()*candidates.length)] || COSTUMES[0];
  }
  if(!tpl) return null;

  const inst = createEquipInst('costume', tpl.id);
  if(!inst) return null;
  inst.identified = true;
  inst.npcOwner = npcInstId;

  if(tpl.rarity !== 'common' && (!inst.affixes || inst.affixes.length === 0)){
    inst.affixes = rollNpcAffixes(tpl.rarity);
  }
  return inst;
}

// ── NPC 实例注册表（存储活跃 NPC 的武器/防具实例 id）──

// ── 词条随机（复用 data-equip.js 的 AFFIX_POOL）──
function rollNpcAffixes(rarity){
  const count = rarity === 'legendary' ? 4 :
                rarity === 'epic'      ? 3 :
                rarity === 'rare'      ? 2 :
                rarity === 'uncommon'  ? 1 : 0;
  if(!count || typeof AFFIX_POOL === 'undefined') return [];
  const pool = Object.entries(AFFIX_POOL);
  const picked = [];
  const usedAttrs = new Set();
  for(let i=0; i<count && pool.length; i++){
    const avail = pool.filter(([attr])=> !usedAttrs.has(attr));
    if(!avail.length) break;
    const [attr, tiers] = avail[Math.floor(Math.random()*avail.length)];
    const tierIdx = rarity === 'legendary' ? 2 :
                    rarity === 'epic'      ? Math.min(2, Math.floor(Math.random()*2)+1) :
                    rarity === 'rare'      ? Math.min(1, Math.floor(Math.random()*2)) : 0;
    const tier = tiers[tierIdx] || tiers[tiers.length-1];
    picked.push({ attr, ...tier });
    usedAttrs.add(attr);
  }
  return picked;
}

// ── NPC 实例注册表（存储活跃 NPC 的武器/防具实例 id）──
// 格式：npcState.npcInsts[npcInstId] = { weaponInstId, armorInstId, silver, level }
function getNpcInst(npcInstId){
  if(typeof npcState === 'undefined') return null;
  if(!npcState.npcInsts) npcState.npcInsts = {};
  return npcState.npcInsts[npcInstId];
}
function setNpcInst(npcInstId, data){
  if(typeof npcState === 'undefined') return;
  if(!npcState.npcInsts) npcState.npcInsts = {};
  npcState.npcInsts[npcInstId] = data;
  if(typeof npcStateSave === 'function') npcStateSave();
}

// ── 初始化一个 NPC 的战斗数据（首次遇到时调用）──
// npcInstId = npcId (通用模板) 或 cityId+'_'+npcId (固定 NPC)
function initNpcCombat(npcId, npcInstId, overrides){
  if(getNpcInst(npcInstId)) return; // 已经初始化过

  // 从 NPC_DB 中读取 NPC 基础配置（weapon/armor/level/tier）
  const npcDef = (typeof NPC_DB !== 'undefined') ? NPC_DB[npcId] : null;

  const roleConf = NPC_ROLE_COMBAT[npcId] || NPC_ROLE_COMBAT.inn_keeper;
  const tier   = overrides?.tier   || npcDef?.tier   || roleConf.tier;

  // 固定等级优先用 NPC_DB 配置的 level
  let level;
  if(overrides?.level){
    level = overrides.level;
  } else if(npcDef?.level){
    // NPC_DB 中已配置等级：以该值为中心 ±5 随机
    const base = npcDef.level;
    level = base + Math.floor(Math.random() * 11) - 5;
    level = Math.max(1, level);
  } else {
    const lvMin = overrides?.lvMin || roleConf.lvMin;
    const lvMax = overrides?.lvMax || roleConf.lvMax;
    level = lvMin + Math.floor(Math.random()*(lvMax-lvMin+1));
  }

  // 判断是否为野兽类敌人（beast类型没有装备）
  const isBeast = npcDef?.type === 'beast';

  // 装备优先级：overrides > NPC_DB.weapon > 随机
  // 野兽类敌人不创建武器装备
  const weaponId = isBeast ? null : (overrides?.weaponId || npcDef?.weapon || null);
  const armorId  = isBeast ? null : (overrides?.armorId  || npcDef?.armor  || null);

  // BOSS(elite) 级别：若没有固定装备，从 legendary/mythic 中随机
  // major 级别：若没有固定装备，从 epic/legendary 中随机
  const effectiveTier = tier;

  const wepInst = isBeast ? null : createNpcWeaponInst(npcInstId, weaponId, level, effectiveTier);
  const armInst = isBeast ? null : createNpcArmorInst(npcInstId, armorId, roleConf.armorTier, level, effectiveTier);

  // 把实例暂存到 bag 的一个 NPC 专属命名空间（不占玩家背包）
  if(!npcState.npcBag) npcState.npcBag = {};
  if(wepInst) npcState.npcBag[wepInst.instId] = wepInst;
  if(armInst) npcState.npcBag[armInst.instId] = armInst;

  const silverMin = overrides?.silverMin ?? roleConf.silverMin;
  const silverMax = overrides?.silverMax ?? roleConf.silverMax;
  const silver = silverMin + Math.floor(Math.random()*(silverMax-silverMin+1));

  setNpcInst(npcInstId, {
    npcId, level, tier,
    weaponInstId: wepInst?.instId || null,
    armorInstId:  armInst?.instId || null,
    silver,
    stats: calcNpcBaseStats(level, tier, typeof inferNpcRoleStyle==='function' ? inferNpcRoleStyle(npcDef?.role||npcId) : 'default'),
  });
}

// ── 获取 NPC 完整战斗属性（含装备加成）──
function getNpcCombatStats(npcInstId){
  const inst = getNpcInst(npcInstId);
  if(!inst) return null;
  const base = inst.stats;
  const wepInst = inst.weaponInstId && npcState.npcBag?.[inst.weaponInstId];
  const armInst = inst.armorInstId  && npcState.npcBag?.[inst.armorInstId];

  // 累加装备词条
  function sumAffixAttr(equipInst, attr){
    if(!equipInst?.affixes) return 0;
    return equipInst.affixes.reduce((s,a)=> a.attr===attr ? s+a.val : s, 0);
  }

  const wepTpl = wepInst ? WEAPONS.find(w=> w.id === wepInst.templateId) : null;
  const armTpl = armInst ? COSTUMES.find(c=> c.id === armInst.templateId) : null;

  return {
    level:  inst.level,
    tier:   inst.tier,
    maxHp:  base.maxHp  + (wepTpl?.hpBonus||0) + (armTpl?.hpBonus||0) + sumAffixAttr(wepInst,'hpBonus') + sumAffixAttr(armInst,'hpBonus'),
    atk:    base.atk    + (wepTpl?.atkBonus||0) + (armTpl?.atkBonus||0) + sumAffixAttr(wepInst,'atkBonus') + sumAffixAttr(armInst,'atkBonus'),
    def:    base.def    + (wepTpl?.defBonus||0) + (armTpl?.defBonus||0) + sumAffixAttr(wepInst,'defBonus') + sumAffixAttr(armInst,'defBonus'),
    crit:   Math.min(75, base.crit + ((wepTpl?.critBonus||0)*100) + ((armTpl?.critBonus||0)*100) + sumAffixAttr(wepInst,'critBonus') + sumAffixAttr(armInst,'critBonus')),
    dodge:  Math.min(50, base.dodge + ((wepTpl?.dodgeBonus||0)*100) + ((armTpl?.dodgeBonus||0)*100)),
    spd:    base.spd    + (wepTpl?.speedBonus||0) + (armTpl?.speedBonus||0),
    maxMp:  base.maxMp  + (wepTpl?.mpBonus||0) + (armTpl?.mpBonus||0),
    weapon: wepTpl || null,
    armor:  armTpl || null,
    weaponInst: wepInst || null,
    armorInst:  armInst || null,
    silver: inst.silver,
  };
}

// ── NPC 死亡冷却时间配置（游戏内天数）──
const NPC_RESPAWN_DAYS = {
  func:   3,   // 功能性 NPC：3天后新 NPC 顶替
  major:  14,  // 重要 NPC：14天
  elite:  -1,  // 精英/BOSS：永久死亡（-1）
};

// ── 杀死 NPC：掉落处理 + 记录死亡时间 ──
function killNpc(npcId, npcInstId, cityId){
  npcStateLoad();
  const inst = getNpcInst(npcInstId);
  if(!inst){ showToast('对方已经倒下了'); return; }

  // 好感影响：挚友被杀额外扣名誉，并给出提示
  const relBeforeKill = (typeof getNpcRel === 'function') ? getNpcRel(npcId) : 0;
  if(relBeforeKill >= 80){
    showToast(`😢 ${NPC_DB[npcId]?.name||'对方'}曾是你的至交，此举大失江湖道义！声誉大幅下降！`);
    if(travelPlayerState.reputation !== undefined) travelPlayerState.reputation = Math.max(0, travelPlayerState.reputation - 30);
  } else if(relBeforeKill >= 60){
    showToast(`此人曾是你的朋友，江湖中人会如何看你？`);
    if(travelPlayerState.reputation !== undefined) travelPlayerState.reputation = Math.max(0, travelPlayerState.reputation - 15);
  }

  const drops = [];

  // 1. 武器掉落
  if(inst.weaponInstId && npcState.npcBag?.[inst.weaponInstId]){
    const wepInst = npcState.npcBag[inst.weaponInstId];
    const tpl = WEAPONS.find(w=> w.id === wepInst.templateId);
    // 从 npcBag 移动到玩家背包
    delete wepInst.npcOwner;
    bagAddInst(wepInst);
    delete npcState.npcBag[inst.weaponInstId];
    if(tpl?.unique) releaseUniqueOwner(tpl.id); // 释放神器归属 → 注册给玩家
    drops.push(`⚔ ${tpl?.name || '武器'}（已鉴定）`);
  }

  // 2. 防具掉落
  if(inst.armorInstId && npcState.npcBag?.[inst.armorInstId]){
    const armInst = npcState.npcBag[inst.armorInstId];
    const tpl = COSTUMES.find(c=> c.id === armInst.templateId);
    delete armInst.npcOwner;
    bagAddInst(armInst);
    delete npcState.npcBag[inst.armorInstId];
    drops.push(`🥋 ${tpl?.name || '防具'}（已鉴定）`);
  }

  // 3. 银两掉落
  if(inst.silver > 0){
    SilverManager.add(inst.silver);
    SilverManager.save();
    drops.push(`💰 ${inst.silver} 两银子`);
  }

  // 4. 记录死亡状态
  const tier = inst.tier || 'func';
  const cooldownDays = NPC_RESPAWN_DAYS[tier] ?? 3;
  if(!npcState.deaths) npcState.deaths = {};
  const deathRec = {
    npcId,
    cityId,
    tier,
    killedAt: Date.now(),              // 真实时间戳（毫秒）
    respawnDays: cooldownDays,         // 游戏内天数冷却（-1 = 永久）
    // 游戏内时间由 edS.gameDay 决定，这里也记录当前游戏日
    killedGameDay: edS?.gameDay || 0,
  };
  // elite NPC 永久死亡：生成动态替代者接替其位置
  if(tier === 'elite' && cooldownDays === -1){
    const origNpc = NPC_DB[npcId];
    const rpl = generateReplacementNpc(origNpc);
    if(rpl){
      deathRec.replacement = rpl;
      // 延迟提示（战斗结算后1秒）
      setTimeout(()=>{
        showToast(`📢 江湖传言：${rpl.name} 已接替了${NPC_DB[npcId]?.name || npcId}的位置！`, 'info');
      }, 1800);
    }
  }
  npcState.deaths[npcInstId] = deathRec;

  // 5. 清理 NPC 实例
  delete npcState.npcInsts[npcInstId];
  npcStateSave();

  // 6. 更新好感度（变成仇敌）
  changeNpcRel(npcId, -100);

  // 7. （经验已由 battle.js checkWin() 统一发放，此处不重复）

  // 8. 声誉惩罚 + 门派通缉
  _applyKillReputation(NPC_DB[npcId], inst, cityId);

  // 8. 提示掉落
  const npcName = NPC_DB[npcId]?.name || npcId;
  if(drops.length){
    showToast(`击败 ${npcName}！获得：${drops.join('、')}`);
  } else {
    showToast(`击败 ${npcName}！对方身无长物。`);
  }

  // 9. 检查是否完成了某个击杀类委托任务
  if(typeof onKillNpcCheckQuests === 'function'){
    onKillNpcCheckQuests(npcId);
  }
  // 检查主线任务击杀
  if(typeof checkMainQuestKill === 'function'){
    checkMainQuestKill(npcId);
  }

  // 10. 刷新城镇 NPC 列表
  if(cityId) setTimeout(()=> renderCityNpcs(cityId), 300);
}

// ── 击杀声誉系统（阵营感知版）─────────────────────────────────
//
// 核心逻辑：
//   正道玩家 × 邪道NPC → 加声誉，不触发通缉（正义诛邪）
//   正道玩家 × 正道NPC → 扣声誉，被正道门派通缉
//   正道玩家 × 中立NPC → 轻扣声誉，被该门派通缉
//   邪道玩家 × 邪道NPC → 仅轻扣声誉（内部仇杀），被邪道通缉
//   邪道玩家 × 正道NPC → 扣声誉（江湖公愤），被正道通缉
//   邪道玩家 × 中立NPC → 扣声誉，被该门派通缉
//   中立玩家 × 任意     → 扣声誉，被该门派通缉（维持旧逻辑）

// 各 tier 基础声誉变化量（正值=加，负值=扣）
// 实际值会根据玩家与被杀目标的阵营关系做修正
const KILL_REP_BASE = {
  func:  -15,
  major: -30,
  elite: -60,
};

// 城市→门派映射（击杀该城NPC会被该门派通缉）
// sectId 用于读取 data-sects.js 中的 alignment
const KILL_CITY_SECT = {
  // 正道门派
  shaolin_temple:  { name:'少林寺',   sectId:'shaolin'   },
  wudang_peak:     { name:'武当派',   sectId:'wudang'    },
  huashan_sect:    { name:'华山派',   sectId:'huashan'   },
  emei_sect:       { name:'峨眉派',   sectId:'emei'      },
  kongtong_peak:   { name:'崆峒派',   sectId:'kongtong'  },
  diancang_peak:   { name:'点苍派',   sectId:'diancang'  },
  qingcheng_peak:  { name:'青城派',   sectId:'qingcheng' },
  tianshan_sect:   { name:'天山派',   sectId:'tianshan'  },
  xiaoyao_grotto:  { name:'逍遥派',   sectId:'xiaoyao'   },
  wutai_temple:    { name:'五台山',   sectId:'shaolin'   },
  shengguang_temple:{ name:'圣光教',  sectId:'shengguang'},
  nangong_estate:  { name:'南宫世家', sectId:'nangong'   },
  kunlun_peak:     { name:'昆仑派',   sectId:'kunlun'    },
  // 邪道门派
  riyue_sect:      { name:'日月神教', sectId:'riyue'     },
  wudutang_hall:   { name:'五毒教',   sectId:'wudu'      },
  xuanming_hall:   { name:'玄冥教',   sectId:'xuanming'  },
  xuegu_fort:      { name:'血骨门',   sectId:'xuegu'     },
  // 混乱门派
  tianlei_fort:    { name:'天雷寨',   sectId:'tiandibang'},
  tiandibang_fort: { name:'天地帮',   sectId:'tiandibang'},
  haishadao:       { name:'海沙帮',   sectId:'haisha'    },
  longxiang_temple:{ name:'龙象堂',   sectId:'longxiang' },
  xixia_palace:    { name:'西夏宫廷', sectId:'xixia'     },
  // 中立门派
  tangmen_hall:    { name:'唐门',     sectId:'tangmen'   },
  taohua_hall:     { name:'桃花岛',   sectId:'taohuadao' },
  linxiao_tower:   { name:'凌霄楼',   sectId:'lingxiao'  },
  guigu_cave:      { name:'鬼谷门',   sectId:'guigu'     },
};

// 通缉持续天数（游戏内天数）
const WANTED_DAYS = { func: 7, major: 20, elite: -1 /* 永久 */ };

/** 获取门派阵营（righteous/neutral/chaotic/evil） */
function _getSectAlignById(sectId){
  if(!sectId) return 'neutral';
  if(typeof SECTS !== 'undefined'){
    const s = SECTS.find(x => x.id === sectId);
    if(s && s.alignment) return s.alignment;
  }
  return 'neutral';
}

/** 获取玩家阵营得分（-100~+100），>30=正道，<-30=邪道 */
function _getPlayerAlignScore(){
  if(typeof jianghuState !== 'undefined'){
    return jianghuState.reputation?.alignment || 0;
  }
  return 0;
}

function _applyKillReputation(npc, inst, cityId){
  if(!travelPlayerState) return;
  const tier = inst?.tier || npc?.tier || 'func';

  // ── 判断被杀NPC的阵营 ──────────────────────────────────────
  // 优先用 npc 对象字段，其次从城市→门派查
  let victimAlign = 'neutral';
  if(npc?.alignment){
    victimAlign = npc.alignment;
  } else if(npc?.sect){
    victimAlign = _getSectAlignById(npc.sect);
  } else {
    const cityEntry = KILL_CITY_SECT[cityId];
    if(cityEntry) victimAlign = _getSectAlignById(cityEntry.sectId);
  }

  // ── 获取玩家阵营 ────────────────────────────────────────────
  const playerAlignScore = _getPlayerAlignScore();
  const isPlayerRighteous = playerAlignScore >= 30;
  const isPlayerEvil      = playerAlignScore <= -30;

  // ── 计算声誉变化 ────────────────────────────────────────────
  let repDelta = KILL_REP_BASE[tier] ?? -15;

  if(victimAlign === 'evil'){
    if(isPlayerRighteous){
      // 正道诛邪：加声誉！
      repDelta = Math.abs(repDelta) * 0.8;   // +12/+24/+48
    } else if(isPlayerEvil){
      // 邪道内部仇杀：轻扣
      repDelta = Math.round(repDelta * 0.4); // -6/-12/-24
    }
    // 中立玩家杀邪道：维持原扣值
  } else if(victimAlign === 'righteous'){
    if(isPlayerEvil){
      // 邪道打正道：加重惩罚（正道公愤）
      repDelta = Math.round(repDelta * 1.3);
    }
    // 正道玩家打正道/中立玩家打正道：维持原扣值
  } else if(victimAlign === 'chaotic'){
    // 混乱门派：轻微扣
    repDelta = Math.round(repDelta * 0.7);
  }

  travelPlayerState.reputation = Math.max(0, Math.min(200,
    (travelPlayerState.reputation ?? 100) + repDelta
  ));

  // ── 判断是否触发通缉 ─────────────────────────────────────────
  const cityEntry = KILL_CITY_SECT[cityId] || null;
  const sectName  = cityEntry?.name || null;
  const sectId    = cityEntry?.sectId || null;

  // 正道玩家诛邪：不被通缉（行侠仗义，无需追责）
  const skipWanted = (isPlayerRighteous && victimAlign === 'evil');

  if(sectName && !skipWanted){
    if(!travelPlayerState.wantedBy) travelPlayerState.wantedBy = [];
    const curDay = (typeof edS !== 'undefined' ? edS.gameDay : 0) || 0;
    const existing = travelPlayerState.wantedBy.find(w=> w.sectName === sectName);
    const expDays = WANTED_DAYS[tier] ?? 7;
    const tierLabel = tier==='elite'?'精英':tier==='major'?'重要':'普通';

    if(existing){
      existing.killCount = (existing.killCount||0) + 1;
      if(expDays === -1 || existing.expireDay === -1){
        existing.expireDay = -1;
      } else {
        existing.expireDay = Math.max(existing.expireDay, curDay + expDays + existing.killCount * 5);
      }
      existing.reason = `击杀${tierLabel}成员 ×${existing.killCount}`;
    } else {
      travelPlayerState.wantedBy.push({
        sectId,
        sectName,
        sectAlign: victimAlign,   // ← 新增：记录通缉方阵营，UI用
        reason: `击杀${tierLabel}成员`,
        killCount: 1,
        expireDay: expDays === -1 ? -1 : curDay + expDays,
      });
    }
  }

  travelSave();

  // ── 提示文本 ─────────────────────────────────────────────────
  const repNow = travelPlayerState.reputation;
  let repMsg = '';
  if(repDelta > 0){
    // 加声誉
    if(repNow >= 160) repMsg = `⚔️ 正义诛邪！声誉 +${repDelta}`;
    else              repMsg = `✅ 铲除邪恶，声誉 +${repDelta}`;
  } else {
    if(repNow < 20)       repMsg = '⚠️ 你已成为天下公敌！';
    else if(repNow < 50)  repMsg = '⚠️ 你在江湖中恶名昭彰！';
    else if(repNow < 80)  repMsg = '⚠️ 你的声誉已大受损伤！';
    else                   repMsg = `声誉 ${repDelta}`;
  }

  const wantedMsg = (sectName && !skipWanted)
    ? `\n${sectName}已将你列为通缉要犯！`
    : '';

  setTimeout(()=> showToast(repMsg + wantedMsg, repDelta > 0 ? 'good' : 'warn'), 600);

  // 同步刷新UI声誉栏（如果有）
  if(typeof renderReputationBar === 'function') renderReputationBar();
}

// ── 检查 NPC 是否已死亡（且未到重生时间）──
function isNpcDead(npcInstId){
  npcStateLoad();
  if(!npcState.deaths) return false;
  const rec = npcState.deaths[npcInstId];
  if(!rec) return false;
  if(rec.respawnDays === -1) return true; // 永久死亡

  // 基于游戏内天数判断
  const curGameDay = edS?.gameDay || 0;
  if((curGameDay - rec.killedGameDay) >= rec.respawnDays){
    // 已到重生时间 → 清除死亡记录，允许重新初始化
    delete npcState.deaths[npcInstId];
    npcStateSave();
    return false;
  }
  return true;
}

// ── 获取 NPC 剩余重生天数 ──
function getNpcRespawnDaysLeft(npcInstId){
  if(!npcState.deaths) return 0;
  const rec = npcState.deaths[npcInstId];
  if(!rec) return 0;
  if(rec.respawnDays === -1) return -1;
  const curGameDay = edS?.gameDay || 0;
  return Math.max(0, rec.respawnDays - (curGameDay - rec.killedGameDay));
}

// ── 渲染 NPC 卡片时加入死亡/重生状态 ──
// 在 renderCityNpcs 中调用前检查
function getNpcCardStatus(npcInstId){
  if(isNpcDead(npcInstId)){
    const left = getNpcRespawnDaysLeft(npcInstId);
    return left === -1 ? 'dead_perm' : 'dead_respawn';
  }
  return 'alive';
}

// ── 显示 NPC 战斗属性面板（对话弹窗中的「动手」按钮触发）──
function openNpcFightPanel(npcId, npcInstId, cityId){
  npcStateLoad();
  // 确保已初始化战斗数据
  initNpcCombat(npcId, npcInstId);
  const cs = getNpcCombatStats(npcInstId);
  if(!cs){ showToast('无法发起战斗'); return; }

  const npc = NPC_DB[npcId];
  const tierLabel = { func:'', major:'<span style="color:#ffd060">★ 重要</span>', elite:'<span style="color:#ff8080">◆ BOSS</span>' }[cs.tier] || '';
  const wepName = cs.weapon ? `${cs.weapon.icon}${cs.weapon.name}` : '徒手';
  const armName = cs.armor  ? `${cs.armor.icon}${cs.armor.name}`  : '布衣';

  // 稀有度颜色
  const RARITY_COL = { mythic:'#aaddff', legendary:'#ffd060', epic:'#c080f0', rare:'#60b8ff', uncommon:'#60e090', common:'#a0a0a0' };
  const wepCol = cs.weapon ? (RARITY_COL[cs.weapon.rarity] || '#c8e8c8') : '#c8e8c8';
  const armCol = cs.armor  ? (RARITY_COL[cs.armor.rarity]  || '#c8e8c8') : '#c8e8c8';

  // 技能列表
  const skillHtml = (typeof renderNpcSkillList === 'function')
    ? renderNpcSkillList(npc, cs.tier)
    : '';

  // 好感效果提示
  const relForFight = (typeof getNpcRel === 'function') ? getNpcRel(npcId) : 0;
  let relFightTip = '';
  if(relForFight <= -60){
    relFightTip = `<div style="background:rgba(200,40,40,.2);border:1px solid #ff4040;color:#ff8080;font-size:11px;padding:5px 10px;border-radius:5px;margin:6px 0;text-align:center">
      😡 仇敌！对方怒气冲冠，攻击力+15%</div>`;
  } else if(relForFight <= -20){
    relFightTip = `<div style="background:rgba(180,80,20,.15);border:1px solid #ff8060;color:#ffaa80;font-size:11px;padding:5px 10px;border-radius:5px;margin:6px 0;text-align:center">
      😤 对方对你有敌意，攻击力+8%</div>`;
  } else if(relForFight >= 80){
    relFightTip = `<div style="background:rgba(20,120,60,.2);border:1px solid #60d080;color:#80ffa0;font-size:11px;padding:5px 10px;border-radius:5px;margin:6px 0;text-align:center">
      😢 对方是你的至交好友，下手可能留情（攻击-10%）</div>`;
  } else if(relForFight >= 60){
    relFightTip = `<div style="background:rgba(20,100,50,.15);border:1px solid #50c070;color:#a0e0a0;font-size:11px;padding:5px 10px;border-radius:5px;margin:6px 0;text-align:center">
      🤝 对方是你的朋友，攻击力-5%</div>`;
  }

  const html = `
<div style="padding:16px;color:#c8e8c8;font-size:13px;line-height:2">
  <div style="text-align:center;font-size:15px;margin-bottom:8px;color:#ffdd80">
    ${npc?.avatar||'👤'} <b>${npc?.name||npcId}</b> ${tierLabel}
    <span style="font-size:11px;color:#80a080;margin-left:6px">Lv.${cs.level}</span>
  </div>
  ${relFightTip}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-bottom:8px">
    <span>❤ 气血：<b style="color:#ff8080">${cs.maxHp}</b></span>
    <span>⚔ 攻击：<b style="color:#ffcc60">${cs.atk}</b></span>
    <span>🛡 防御：<b style="color:#80c0ff">${cs.def}</b></span>
    <span>💫 暴击：<b style="color:#ffaa40">${cs.crit}%</b></span>
    <span>🌀 闪避：<b style="color:#80ffaa">${cs.dodge}%</b></span>
    <span>💰 身上：<b style="color:#ffe080">${cs.silver}两</b></span>
  </div>
  <div style="border-top:1px solid rgba(80,160,80,.3);padding-top:8px;font-size:12px">
    <span style="color:${wepCol}">${wepName}</span>
    <span style="color:rgba(160,180,160,.5)"> | </span>
    <span style="color:${armCol}">${armName}</span>
  </div>
  ${skillHtml ? `<div style="margin-top:6px;font-size:11px;color:rgba(160,180,160,.5)">武学：</div>
  <div class="npc-skill-tags" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:3px">${skillHtml}</div>` : ''}
  <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
    <button onclick="startNpcBattle('${npcId}','${npcInstId}','${cityId}')"
      style="background:rgba(180,40,40,.7);border:1px solid #ff6060;color:#ffa0a0;padding:7px 20px;border-radius:6px;cursor:pointer;font-size:13px">
      ⚔ 出手
    </button>
    <button onclick="document.getElementById('npcFightPanel').remove()"
      style="background:rgba(40,60,40,.7);border:1px solid rgba(80,160,80,.4);color:#a0c8a0;padding:7px 20px;border-radius:6px;cursor:pointer;font-size:13px">
      算了
    </button>
  </div>
</div>`;

  let panel = document.getElementById('npcFightPanel');
  if(!panel){
    panel = document.createElement('div');
    panel.id = 'npcFightPanel';
    panel.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(5,20,10,.95);border:1px solid rgba(180,40,40,.5);border-radius:10px;z-index:10010;min-width:260px;max-width:320px;box-shadow:0 0 30px rgba(180,40,40,.3)';
    document.body.appendChild(panel);
  }
  panel.innerHTML = html;
}

// ── 确认击杀 NPC（战斗胜利后调用）──
function confirmKillNpc(npcId, npcInstId, cityId){
  document.getElementById('npcFightPanel')?.remove();
  // 关闭 NPC 对话弹窗
  document.getElementById('npcDialogOverlay')?.remove();
  killNpc(npcId, npcInstId, cityId);
  travelRenderIndex?.();
}

// ── 发起 NPC 战斗（动手 → 演武场 → 胜利后结算）──
function startNpcBattle(npcId, npcInstId, cityId){
  // 关闭面板 + NPC 对话框
  document.getElementById('npcFightPanel')?.remove();
  if(typeof closeNpcDialog === 'function') closeNpcDialog();
  else document.getElementById('npcDialogOverlay')?.remove();

  // 动手即清零好感（你都对我动手了还能是好朋友吗）
  if(typeof changeNpcRel === 'function'){
    changeNpcRel(npcId, -100, '你向对方出手');
  }

  const npc = NPC_DB[npcId];
  const cs  = getNpcCombatStats(npcInstId);
  if(!npc || !cs){
    showToast('NPC 数据异常，无法发起战斗');
    return;
  }

  // ── 1. 构建 NPC 战斗角色（兼容 battle.js 格式）──
  const tierColor = { func:'#a0c880', major:'#ffd060', elite:'#ff6040' };
  const npcColor  = tierColor[cs.tier] || '#c8e8c8';

  // NPC 技能：从 npc 的 topics 的 action 中提取，或直接用通用技能
  const npcSkillIds = (npc.skills || []);
  const npcSkillObjs = npcSkillIds.map(sid => {
    if(typeof SKILL_LIB !== 'undefined'){
      for(const school of Object.values(SKILL_LIB)){
        const sk = Array.isArray(school) ? school.find(s => s.id === sid) : null;
        if(sk) return { ...sk, key: String(npcSkillIds.indexOf(sid)+1) };
      }
    }
    return { id: sid, name: sid, mpCost: 0 };
  }).filter(Boolean);

  // NPC 字符画：用 npc-portraits.js 的部件系统（与对话弹窗一致）
  // parts 字段设为 npcId，battle.js buildFighterEl 里的 parts 分支会处理
  let npcParts = null;
  if(typeof buildNpcPartIndices === 'function'){
    npcParts = buildNpcPartIndices(npc);
  }

  const npcChar = {
    id:       '_npc_' + npcId,
    name:     npc.name,
    title:    (npc.avatar || '👤') + ' ' + (npc.role || '江湖人'),
    tag:      cs.tier,
    tagColor: npcColor,
    color:    npcColor,
    level:    cs.level,
    maxHp:    cs.maxHp,
    atk:      cs.atk,
    def:      cs.def,
    crit:     cs.crit,
    dodge:    cs.dodge,
    speedN:   cs.spd || 8,
    mp:       cs.maxMp,
    maxMp:    cs.maxMp,
    // 字符画：NPC 走 parts 部件系统（与对话弹窗一致）
    stand:    null,   // 由 buildFighterEl 的 parts 分支处理
    attack:   [],
    heavy:    [],
    hit:      [],
    down:     '',
    parts:    npcParts,   // 部件索引，buildFighterEl 的 ch.parts 分支渲染
    skills:   npcSkillObjs,
    tier:     cs.tier,
    _isNpc:   true,
    _npcId:   npcId,
    _npcInstId: npcInstId,
    _npcCityId: cityId,
    _npcTier:   cs.tier,
    // 好感修正：仇敌+15%攻，至交-10%攻
    _relMod: (()=>{
      const rel = (typeof getNpcRel === 'function') ? getNpcRel(npcId) : 0;
      if(rel <= -60) return 1.15;
      if(rel <= -20) return 1.08;
      if(rel >= 80)  return 0.90;
      if(rel >= 60)  return 0.95;
      return 1.0;
    })(),
  };
  // 应用好感攻击修正
  npcChar.atk = Math.round(npcChar.atk * npcChar._relMod);

  // ── 2. 构建玩家角色（从存档读取，而非 CHARS 内置角色数组）──
  // ★ 先保存运行时的当前血量/内力（hydrateEdSFromEditorSave 会用 localStorage 覆盖掉）
  const _savedHp = (typeof edS !== 'undefined' && typeof edS.hp === 'number') ? edS.hp : null;
  const _savedMp = (typeof edS !== 'undefined' && typeof edS.mp === 'number') ? edS.mp : null;
  const _savedTravelHp = (typeof travelPlayerState !== 'undefined') ? travelPlayerState.hp : null;

  let playerChar = null;
  if (typeof buildPlayerCharFromStorage === 'function') {
    playerChar = buildPlayerCharFromStorage();
  }
  // 恢复运行时血量（被 buildPlayerCharFromStorage → hydrateEdSFromEditorSave 覆盖了）
  if (_savedHp !== null && typeof edS !== 'undefined') edS.hp = _savedHp;
  if (_savedMp !== null && typeof edS !== 'undefined') edS.mp = _savedMp;

  // 兜底：直接从 edS 构建
  if (!playerChar && typeof edS !== 'undefined') {
    const stats = (typeof edStats === 'function') ? edStats() : {};
    playerChar = {
      id: 'cp_self',
      name: edS.name || '无名侠',
      title: edS.title || '江湖客',
      tag: edS.tag || '江湖侠客',
      tagColor: edS.color || '#c0a070',
      color: edS.color || '#c0a070',
      maxHp: stats.hp || edS.maxHp || 200,
      atk: stats.atk || edS.atk || 30,
      def: stats.def || edS.def || 10,
      crit: stats.crit || edS.crit || 10,
      dodge: stats.dodge || edS.dodge || 5,
      maxMp: stats.mp || edS.maxMp || 100,
      speedN: stats.spd || edS.speedN || 8,
      parts: edS.parts || {},
      custom: edS.custom || {},
      useCustom: edS.useCustom || {},
      weaponInstId: edS.weaponInstId || null,
      weaponId: edS.weaponId || null,
      costumeInstId: edS.costumeInstId || null,
      skillIds: ['cm01','cm02','cm03'],
    };
  }
  if(!playerChar){
    showToast('请先创建或选择角色');
    return;
  }

  // 同步玩家当前血量（用 edStats() 实时值作为 maxHp，当前血量优先从 edS.hp → travelPlayerState.hp 百分比 → 满血）
  if(typeof edS !== 'undefined'){
    const realStats = (typeof edStats === 'function') ? edStats() : {};
    playerChar.maxHp = realStats.hp || playerChar.maxHp || 100;
    playerChar.maxMp = realStats.mp || playerChar.maxMp || 100;
    // 当前血量：优先 travelPlayerState（实际运行时百分比），其次 edS.hp，最后满血
    let curHp = playerChar.maxHp;
    if (_savedTravelHp !== null && typeof _savedTravelHp === 'number') {
      curHp = Math.round(playerChar.maxHp * _savedTravelHp / 100);
    } else if (typeof edS.hp === 'number') {
      curHp = Math.min(edS.hp, playerChar.maxHp);
    }
    playerChar._currentHp = Math.max(1, curHp);
    let curMp = playerChar.maxMp;
    if (typeof edS.mp === 'number') {
      curMp = Math.min(edS.mp, playerChar.maxMp);
    }
    playerChar._currentMp = Math.max(0, curMp);
    // 同步其他属性（确保与实时值一致）
    playerChar.atk = realStats.atk || playerChar.atk || 30;
    playerChar.def = realStats.def || playerChar.def || 10;
    playerChar.crit = realStats.crit || playerChar.crit || 10;
    playerChar.dodge = realStats.dodge || playerChar.dodge || 5;
    playerChar.speedN = realStats.spd || playerChar.speedN || 8;
    playerChar.speed = playerChar.speedN >= 10 ? '极快' : playerChar.speedN >= 9 ? '快' : playerChar.speedN >= 8 ? '中' : playerChar.speedN >= 7 ? '慢' : '极慢';
  }

  // ── 3. 发起战斗，胜利才执行击杀结算 ──
  // 检测当前页面：如果在 battle.html，使用 startWildBattle；否则使用 startBattleInNewPage
  const isBattlePage = window.location.pathname.includes('battle.html');
  
  if (isBattlePage) {
    // 在战斗页面内，直接使用 startWildBattle
    if (typeof startWildBattle !== 'function') {
      showToast('战斗系统未加载');
      return;
    }
    startWildBattle(playerChar, npcChar, function (playerWon) {
      _handleNpcBattleResult(npcId, npcInstId, cityId, npc.name, cs.silver, playerWon);
    });
  } else {
    // 在其他页面（如 town.html），跳转到独立战斗页面
    if (typeof startBattleInNewPage !== 'function') {
      showToast('战斗系统未加载');
      return;
    }
    startBattleInNewPage(playerChar, npcChar, 'town.html?city=' + cityId, function (playerWon) {
      _handleNpcBattleResult(npcId, npcInstId, cityId, npc.name, cs.silver, playerWon);
    });
  }
}

/**
 * 处理 NPC 战斗结果（统一回调）
 */
function _handleNpcBattleResult(npcId, npcInstId, cityId, npcName, npcSilver, playerWon) {
  if (playerWon) {
    // 玩家胜利：执行 NPC 击杀结算
    confirmKillNpc(npcId, npcInstId, cityId);
    // 好感大幅下降（主动攻击）
    if (typeof changeNpcRel === 'function') {
      changeNpcRel(npcId, -50, '你击败了对方');
    }
    // 获取 NPC 身上银两
    if (npcSilver > 0) {
      addSilver(npcSilver);
      SilverManager.save();
      showToast(`💰 搜刮 ${npcName} 身上 ${npcSilver} 两银子`);
    }
  } else {
    // 玩家落败：NPC 存活，好感微降
    if (typeof changeNpcRel === 'function') {
      changeNpcRel(npcId, -10, '你向对方出手');
    }
    showToast(`被 ${npcName} 击败，落荒而逃...`);
    // 返回地图/城市
    if (typeof travelRenderIndex === 'function') travelRenderIndex();
  }
}


// ══════════════════════════════════════════════════════════════════
//  动态替代者生成系统（方案B）
//  精英 NPC 永久死亡后，随机生成同职业同门派的新江湖人接替其位置
//  替代者数据存储在 npcState.deaths[npcInstId].replacement
// ══════════════════════════════════════════════════════════════════

// ── 江湖人名库：按性别分组 ──
const _NPC_NAME_BANK = {
  // 姓氏
  surnames: ['赵','钱','孙','李','周','吴','郑','王','冯','陈','褚','卫','蒋','沈','韩','杨',
             '朱','秦','尤','许','何','吕','施','张','孔','曹','严','华','金','魏','陶','姜',
             '戚','谢','邹','喻','柏','水','窦','章','云','苏','潘','葛','奚','范','彭','郎',
             '鲁','韦','昌','马','苗','凤','花','方','俞','任','袁','柳','酆','鲍','史','唐'],
  // 男性名
  maleNames: ['天峰','剑豪','云飞','长风','破军','烈火','怒涛','横刀','孤鹰','落霞',
              '百战','锋芒','铁骨','凌云','踏雪','追魂','穿云','裂石','断浪','崩天',
              '无双','纵横','霸图','烽烟','雷鸣','虎啸','龙吟','独步','称雄','傲世',
              '风烈','铁血','枭雄','煞气','寒锋','死战','破敌','杀神','魔刃','天煞'],
  // 女性名
  femaleNames: ['芸儿','霜华','雪妍','玉莹','冰蝶','凌霜','幽兰','碧云','飞燕','含烟',
                '清溪','落梅','漫雪','素心','月华','红绡','翠微','香凝','烟雨','花影',
                '灵犀','蕊心','璇玑','星辰','霓裳','云裳','惊鸿','紫鸢','银杏','青荷'],
  // 绰号（可选，30%概率附加）
  nicknames: ['无敌','天下第一','江湖鬼才','七杀','断肠','百胜','阎王','不败',
              '刀绝','剑痴','拳无对','毒手','鬼影','血衣','铁甲','冷面',
              '笑面','醉剑','疯刀','狂魔','铁掌','神算','幽灵','煞星'],
};

// ── 门派/城市 → 对应形象风格（影响 avatar 图标和问候语库） ──
const _SECT_STYLE = {
  shaolin:    { avatars:['🧑‍🦲','👨','👴'], style:'佛门', align:'正道' },
  wudang:     { avatars:['🧙','👨‍🦳','🧓'], style:'道家', align:'正道' },
  huashan:    { avatars:['🧑','👨','👨‍🦱'], style:'剑宗', align:'正道' },
  emei:       { avatars:['👩','👩‍🦱','🧕'],  style:'峨眉', align:'正道' },
  kongtong:   { avatars:['🧙‍♂️','👨','🧔'], style:'道门', align:'正道' },
  diancang:   { avatars:['🧑','👨‍🦱','👩'], style:'苍云', align:'正道' },
  qingcheng:  { avatars:['🧙','👨','🧔'],   style:'青城', align:'正道' },
  tianshan:   { avatars:['👩‍🦳','👩','🧕'],  style:'天山', align:'正道' },
  xiaoyao:    { avatars:['🧙','🧑','👩'],   style:'逍遥', align:'正道' },
  nangong:    { avatars:['🧑','👨‍💼','👩‍💼'], style:'世家', align:'正道' },
  kunlun:     { avatars:['🧙‍♂️','👨‍🦳','👴'], style:'昆仑', align:'正道' },
  shengguang: { avatars:['👨‍🦳','👩‍🦳','🧙'], style:'圣光', align:'正道' },
  riyue:      { avatars:['😈','👺','🥷'],   style:'神教', align:'邪道' },
  wudu:       { avatars:['🧟','👺','😈'],   style:'毒教', align:'邪道' },
  xuanming:   { avatars:['👻','🧟','👺'],   style:'玄冥', align:'邪道' },
  xuegu:      { avatars:['💀','😈','🧟'],   style:'血骨', align:'邪道' },
  tiandibang: { avatars:['😤','💪','🧔'],   style:'帮众', align:'混乱' },
  default:    { avatars:['🧑','👨','👩'],   style:'江湖', align:'中立' },
};

// ── 门派风格 → 角色问候语模板 ──
const _REPLACE_GREETINGS = {
  佛门:   ['阿弥陀佛，后会有期。', '江湖孽缘，且看缘法。', '少林有令，不可轻易造次！'],
  道家:   ['无量天尊，道法自然！', '武当武学，天下第一！', '太极生两仪，两仪生四象！'],
  剑宗:   ['剑道无涯，且看本座！', '华山论剑，天下英豪皆来朝！', '剑出如虹，谁能挡我！'],
  峨眉:   ['峨眉天下秀，武学亦如此！', '妙峰拈花，杀机其中！', '女中豪杰，非同凡响！'],
  道门:   ['道可道，非常道！', '七伤拳出，无人能挡！', '崆峒山上，武学通玄！'],
  苍云:   ['点苍剑毒，天下无解！', '苍云剑法，飘逸无双！', '大理山川，育我武学！'],
  青城:   ['青城天下幽，我偏要让你见识见识！', '阴沉之法，方为江湖正道！'],
  天山:   ['雪宫森严，来者留步！', '冰寒天地，武学无双！', '天山武学，非比寻常！'],
  逍遥:   ['逍遥自在，天地任我行！', '北冥之力，吞吐万象！', '随心所欲，此乃逍遥！'],
  世家:   ['南宫世家，名门正派！', '家学渊源，不可小觑！'],
  昆仑:   ['昆仑正派，武学高深！', '西域之地，育出真英雄！'],
  圣光:   ['圣光普照，驱逐黑暗！', '信仰之力，无坚不摧！'],
  神教:   ['日月神教，威震江湖！', '教主有令，谁敢不从！', '教中高手如云，区区外人！'],
  毒教:   ['五毒教的人，你惹不起！', '毒法天下第一，来尝尝！', '苗疆秘法，让你见识！'],
  玄冥:   ['玄冥神功，寒冰彻骨！', '冰寒之力，无人能挡！', '玄冥教的人，谁也别想跑！'],
  血骨:   ['血骨门，进来容易出去难！', '血炼大法，越战越强！', '你的血，将成为俺的养料！'],
  帮众:   ['天地帮，北方第一帮！', '爷们儿的地盘，规矩大！', '有本事就来打一架！'],
  江湖:   ['江湖险恶，小心为妙！', '行走江湖，靠的是真本事！', '路见不平，拔刀相助！'],
};

// ── 随机取名 ──
function _randomNpcName(sectId){
  const bank = _NPC_NAME_BANK;
  const style = _SECT_STYLE[sectId] || _SECT_STYLE.default;
  // 女性门派（峨眉/天山）偏向女名，否则偏向男名（80%概率）
  const isFemale = (sectId === 'emei' || sectId === 'tianshan')
    ? (Math.random() < 0.9)
    : (Math.random() < 0.2);
  const namePool = isFemale ? bank.femaleNames : bank.maleNames;
  const surname  = bank.surnames[Math.floor(Math.random() * bank.surnames.length)];
  const given    = namePool[Math.floor(Math.random() * namePool.length)];
  // 30%概率追加绰号
  if(Math.random() < 0.3){
    const nick = bank.nicknames[Math.floor(Math.random() * bank.nicknames.length)];
    return `"${nick}"${surname}${given}`;
  }
  return surname + given;
}

// ── 主函数：为一个 elite NPC 死亡位置生成替代者 ──
// origNpc: NPC_DB 中的原始NPC对象
// returns: replacement 对象（存入 deaths 记录）
function generateReplacementNpc(origNpc){
  if(!origNpc) return null;

  // 推断门派sectId：从 city 字段查 KILL_CITY_SECT，fallback 从 npc.sect 字段
  const cityEntry  = KILL_CITY_SECT[origNpc.city] || null;
  const sectId     = origNpc.sect || (cityEntry ? cityEntry.sectId : null) || 'default';
  const sectStyle  = _SECT_STYLE[sectId] || _SECT_STYLE.default;

  const name    = _randomNpcName(sectId);
  const avatar  = sectStyle.avatars[Math.floor(Math.random() * sectStyle.avatars.length)];
  const style   = sectStyle.style;
  const greetPool = _REPLACE_GREETINGS[style] || _REPLACE_GREETINGS['江湖'];
  const greetings = [
    greetPool[Math.floor(Math.random() * greetPool.length)],
    `${name}接任此地，江湖事依旧照办！`,
    `前任已逝，本座继承其位！`,
  ];

  // 等级在原始 NPC 等级 ± 10 内随机（降低5~15%以示"继承者"稍弱）
  const origLevel  = origNpc.level || 60;
  const levelMin   = Math.max(1, origLevel - 15);
  const levelMax   = origLevel - 5;
  const level      = levelMin + Math.floor(Math.random() * (levelMax - levelMin + 1));

  // 职业描述
  const roleMap = {
    正道:'正道高手', 邪道:'邪道头目', 混乱:'江湖枭雄', 中立:'江湖强者'
  };
  const role = roleMap[sectStyle.align] || '江湖强者';

  return {
    name,
    avatar,
    role,
    level,
    tier: 'major',          // 替代者降为 major（比 elite 弱一级）
    sect: sectId,
    greetings,
    topics:[
      { id:'rpl_t1', text:'你是何人？',
        reply:`在下${name}，奉命驻守此地。前任已故，江湖事由本座接手！` },
      { id:'rpl_t2', text:'此地还有何事？',
        reply:`江湖争斗，生死有命。此处武学传承未断，有意者可来切磋！` },
      { id:'rpl_t3', text:'切磋武艺',
        reply:`正好！本座正需热身！（摆出架势）来吧！`, action:'spar_fight' },
    ],
    quests: [],   // 替代者无专属任务
    intels: [],
    createdAt: Date.now(),
  };
}

// ── 读取某个 npcInstId 对应的替代者数据 ──
// 若该位置有永久死亡记录且已生成替代者，返回替代者对象，否则返回 null
function getReplacementNpc(npcInstId){
  npcStateLoad();
  if(!npcState.deaths) return null;
  const rec = npcState.deaths[npcInstId];
  if(!rec || rec.respawnDays !== -1) return null; // 只有永久死亡才有替代者
  return rec.replacement || null;
}

// ── 触发替代者实例初始化（战斗用）──
// 替代者使用动态 npcInstId: npcInstId + '_rpl'
function initReplacementCombat(npcInstId, rplData){
  const rplInstId = npcInstId + '_rpl';
  if(getNpcInst(rplInstId)) return rplInstId; // 已初始化
  const level = rplData.level || 55;
  const tier  = rplData.tier || 'major';
  initNpcCombat('_replacement_npc_', rplInstId, {
    level, tier,
    lvMin: level - 5, lvMax: level + 5,
    silverMin: 100, silverMax: 300,
  });
  return rplInstId;
}




