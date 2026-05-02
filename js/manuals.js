// manuals.js — 武学秘籍系统
// 依赖: data-manuals.js, data-skills.js, skill-proficiency.js, editor.js

// ════════════════════════════════════════════════
//  存储键与读写
// ════════════════════════════════════════════════
const MANUALS_KEY = 'wuxia_manuals';

// 秘籍背包 = [{ manualId, obtained }]（obtained: ISO时间戳）
// 已学技能 = 附在 wuxia_player_progress.learnedSkills = ['sw01','ta02',...]
// 装备技能 = 附在 wuxia_player_progress.equippedSkills = ['sw01','ta02',...]（战斗中可用）

// ══════════════════════════════════════════════════════════════════
//  ✦ 技能装备槽系统 ✦
// ══════════════════════════════════════════════════════════════════

/**
 * 获取当前等级对应的技能装备槽数量
 * @returns {number} 装备槽数量 (3-7)
 */
function getSkillSlotCount() {
  const playerLv = (typeof edS !== 'undefined' && edS.level) ? edS.level : 1;
  if (playerLv >= 91) return 7;
  if (playerLv >= 61) return 6;
  if (playerLv >= 31) return 5;
  if (playerLv >= 11) return 4;
  return 3;
}

/**
 * 获取装备槽扩展数量（来自心法/装备/天赋）
 * @returns {number} 额外槽数
 */
function getExtraSkillSlots() {
  let extra = 0;

  // ── ① 心法加成 ──
  // 某些高阶心法/传承提供额外技能槽
  // 当前：检查已装备的门派服装 special 是否含「技能槽」关键词（向后兼容）
  // 未来：当游戏加入独立心法系统后，在此读取心法表的 skillSlotBonus
  try {
    if (typeof edS !== 'undefined' && edS.costumeInstId) {
      const inst = bagFindInst(edS.costumeInstId);
      if (inst && inst.type === 'costume') {
        const tpl = typeof getInstTemplate === 'function' ? getInstTemplate(inst) : null;
        if (tpl && tpl.skillSlotBonus) extra += tpl.skillSlotBonus;
        // 特殊护体心法提供 +1 槽（如少林金刚护体）
        if (tpl && tpl.special && /技能槽|额外槽|多一格/.test(tpl.special)) extra += 1;
      }
    }
  } catch(e) {}

  // ── ② 装备加成（如「武学腰带」）──
  // 检查已装备的配饰/道具是否有 skillSlotBonus
  try {
    if (typeof edS !== 'undefined') {
      // 配饰槽
      if (edS.accessoryInstId) {
        const inst = bagFindInst(edS.accessoryInstId);
        if (inst) {
          const tpl = typeof getInstTemplate === 'function' ? getInstTemplate(inst) : null;
          if (tpl && tpl.skillSlotBonus) extra += tpl.skillSlotBonus;
        }
      }
      // 特殊道具（护符/令牌等）提供的加成
      if (edS.bag) {
        edS.bag.forEach(item => {
          if (item.type === 'item' && item.affixes) {
            item.affixes.forEach(affix => {
              if (affix.key === 'skillSlotBonus') extra += (affix.value || 0);
            });
          }
        });
      }
    }
  } catch(e) {}

  // ── ③ 天赋加成 ──
  // 当前天赋系统（talentId）尚未实现；预留接口
  // 未来：读取 edS.talentSlots 或天赋表，累加对应技能槽加成
  try {
    if (typeof edS !== 'undefined' && edS.talentId) {
      // const talentExtra = (TALENT_DB && TALENT_DB[edS.talentId] && TALENT_DB[edS.talentId].skillSlotBonus) || 0;
      // extra += talentExtra;  // 解开后放开此行
    }
  } catch(e) {}

  return extra;
}

/**
 * 获取总装备槽数量
 * @returns {number} 总槽数
 */
function getTotalSkillSlots() {
  return getSkillSlotCount() + getExtraSkillSlots();
}

/**
 * 获取已装备的技能列表
 * @returns {string[]} 技能ID数组
 */
function getEquippedSkills() {
  try {
    const p = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    return p.equippedSkills || [];
  } catch (e) { return []; }
}

/**
 * 保存装备的技能列表
 * @param {string[]} skillIds 技能ID数组
 */
function saveEquippedSkills(skillIds) {
  try {
    const p = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    p.equippedSkills = skillIds.slice(0, getTotalSkillSlots());
    localStorage.setItem('wuxia_player_progress', JSON.stringify(p));
  } catch (e) {}
}

/**
 * 装备一个技能
 * @param {string} skillId 技能ID
 * @returns {Object} { success: boolean, reason: string }
 */
function equipSkill(skillId) {
  const equipped = getEquippedSkills();
  const maxSlots = getTotalSkillSlots();

  // 检查是否已装备
  if (equipped.includes(skillId)) {
    return { success: false, reason: '该技能已装备' };
  }

  // 检查槽位是否已满
  if (equipped.length >= maxSlots) {
    return { success: false, reason: `装备槽已满（${maxSlots}/${maxSlots}）` };
  }

  // 检查是否已学会
  const learned = getLearnedSkills();
  const isDefault = isDefaultSkill(skillId);
  if (!learned.has(skillId) && !isDefault) {
    return { success: false, reason: '未学会该技能' };
  }

  // 装备技能
  equipped.push(skillId);
  saveEquippedSkills(equipped);
  return { success: true, reason: '' };
}

/**
 * 卸下技能
 * @param {string} skillId 技能ID
 */
function unequipSkill(skillId) {
  const equipped = getEquippedSkills();
  const newEquipped = equipped.filter(id => id !== skillId);
  saveEquippedSkills(newEquipped);
}

/**
 * 检查是否为默认开放技能
 * @param {string} skillId 技能ID
 * @returns {boolean}
 */
function isDefaultSkill(skillId) {
  const skill = getSkill(skillId);
  if (!skill) return false;
  // 通用系全部 + 各系 _l 入门技
  return skill.school === '通用' || skillId.includes('_l');
}

/**
 * 获取战斗中可用的技能列表（已装备的技能）
 * @returns {Object[]} 技能对象数组
 */
function getCombatSkills() {
  const equippedIds = getEquippedSkills();
  return equippedIds.map(id => getSkill(id)).filter(Boolean);
}

// ══════════════════════════════════════════════════════════════════
//  ✦ 武器-学派绑定系统 ✦
//  装备什么武器，就只能使用该武器对应的学派技能
// ══════════════════════════════════════════════════════════════════

// 武器类别 → 学派映射
const WEAPON_CAT_SCHOOLS = {
  '剑': ['sword', 'common'],           // 剑 → 剑系
  '刀': ['force', 'common'],           // 刀 → 力系
  '枪矛': ['sword', 'force', 'common'], // 枪矛 → 剑系+力系
  '棍杖': ['force', 'qimen', 'common'], // 棍杖 → 力系+奇门
  '拳套': ['fist', 'force', 'common'],  // 拳套 → 拳系+力系
  '暗器': ['shadow', 'poison', 'common'], // 暗器 → 暗系+毒系
  '法器': ['tao', 'buddha', 'holy', 'common'], // 法器 → 道/佛/圣
  '乐器': ['music', 'common'],         // 乐器 → 琴系
};

// 武器类型 → 学派映射（更细粒度）
const WEAPON_TYPE_SCHOOLS = {
  '长剑': ['sword', 'common'],
  '短剑': ['sword', 'shadow', 'common'],
  '重剑': ['sword', 'force', 'common'],
  '软剑': ['sword', 'wind', 'common'],
  '单刀': ['force', 'common'],
  '双刀': ['force', 'shadow', 'common'],
  '长刀': ['force', 'common'],
  '枪': ['sword', 'force', 'common'],
  '矛': ['sword', 'force', 'common'],
  '棍': ['force', 'qimen', 'common'],
  '杖': ['force', 'tao', 'common'],
  '禅杖': ['buddha', 'force', 'common'],
  '拳套': ['fist', 'force', 'common'],
  '指虎': ['fist', 'shadow', 'common'],
  '铁爪': ['fist', 'poison', 'common'],
  '飞镖': ['shadow', 'common'],
  '袖箭': ['shadow', 'poison', 'common'],
  '弓箭': ['shadow', 'common'],
  '弩': ['shadow', 'qimen', 'common'],
  '铜铃': ['tao', 'common'],
  '佛珠': ['buddha', 'common'],
  '法器': ['holy', 'tao', 'buddha', 'common'],
  '琴': ['music', 'common'],
  '箫': ['music', 'common'],
  '笛': ['music', 'common'],
};

/**
 * 获取当前武器支持的学派列表
 * @returns {string[]} 学派key数组
 */
function getWeaponAllowedSchools() {
  // 获取当前装备的武器
  const weaponInstId = (typeof edS !== 'undefined') ? edS.weaponInstId : null;
  if (!weaponInstId) {
    // 无武器时默认允许拳系+通用
    return ['fist', 'force', 'common'];
  }

  // 查找武器模板
  const weaponTpl = (typeof getInstTemplate === 'function')
    ? getInstTemplate(weaponInstId)
    : null;

  if (!weaponTpl) {
    return ['fist', 'force', 'common'];
  }

  // 优先使用武器的 schools 字段
  if (weaponTpl.schools && weaponTpl.schools.length > 0) {
    // 确保通用系始终可用
    const schools = [...weaponTpl.schools];
    if (!schools.includes('common')) {
      schools.push('common');
    }
    return schools;
  }

  // 否则根据武器类型查找
  const typeSchools = WEAPON_TYPE_SCHOOLS[weaponTpl.type];
  if (typeSchools) {
    return typeSchools;
  }

  // 最后根据武器类别查找
  const catSchools = WEAPON_CAT_SCHOOLS[weaponTpl.cat];
  if (catSchools) {
    return catSchools;
  }

  // 默认允许通用系
  return ['common'];
}

/**
 * 检查技能是否被当前武器允许
 * @param {string} skillId 技能ID
 * @returns {boolean}
 */
function isSkillAllowedByWeapon(skillId) {
  const skill = getSkill(skillId);
  if (!skill) return false;

  // 获取技能的学派key
  const skillSchool = getSkillSchool(skillId);

  // 获取武器允许的学派
  const allowedSchools = getWeaponAllowedSchools();

  return allowedSchools.includes(skillSchool);
}

/**
 * 获取武器允许的技能列表（从已学会的技能中筛选）
 * @returns {Object[]} 允许使用的技能对象数组
 */
function getWeaponAllowedSkills() {
  const learned = getLearnedSkills();
  const allowedSchools = getWeaponAllowedSchools();

  // 从已学会的技能中筛选
  const allowedSkills = [];
  learned.forEach(skillId => {
    const skill = getSkill(skillId);
    if (!skill) return;

    const skillSchool = getSkillSchool(skillId);
    if (allowedSchools.includes(skillSchool)) {
      allowedSkills.push(skill);
    }
  });

  // 同时包含默认开放的技能
  Object.values(SKILL_LIB).forEach(arr => {
    arr.forEach(skill => {
      if (skill.school === '通用' || skill.id.includes('_l')) {
        const skillSchool = getSkillSchool(skill.id);
        if (allowedSchools.includes(skillSchool) && !allowedSkills.find(s => s.id === skill.id)) {
          allowedSkills.push(skill);
        }
      }
    });
  });

  return allowedSkills;
}

/**
 * 获取武器学派限制提示文本
 * @returns {string}
 */
function getWeaponSchoolRestrictionText() {
  const allowedSchools = getWeaponAllowedSchools();
  const schoolNames = allowedSchools
    .filter(s => s !== 'common')
    .map(s => getSchoolName(s));

  if (schoolNames.length === 0) {
    return '当前武器：仅通用技能';
  }

  return `当前武器：${schoolNames.join('、')}技能可用`;
}

/**
 * 获取武器类别中文名
 * @param {string} cat 类别key
 * @returns {string}
 */
function getWeaponCatName(cat) {
  const names = {
    '剑': '剑类', '刀': '刀类', '枪矛': '枪矛类',
    '棍杖': '棍杖类', '拳套': '拳套类',
    '暗器': '暗器类', '法器': '法器类', '乐器': '乐器类'
  };
  return names[cat] || cat;
}

/**
 * 获取装备槽状态文本
 * @returns {string} 如 "4/5"
 */
function getSkillSlotText() {
  const equipped = getEquippedSkills();
  const max = getTotalSkillSlots();
  return `${equipped.length}/${max}`;
}

function manualsLoad(){
  try{ return JSON.parse(localStorage.getItem(MANUALS_KEY)||'[]'); }
  catch(e){ return []; }
}
function manualsSave(list){
  localStorage.setItem(MANUALS_KEY, JSON.stringify(list));
}

// 获取玩家已学技能集合
function getLearnedSkills(){
  try{
    const p = JSON.parse(localStorage.getItem('wuxia_player_progress')||'{}');
    return new Set(p.learnedSkills || []);
  }catch(e){ return new Set(); }
}
function saveLearnedSkills(set){
  try{
    const p = JSON.parse(localStorage.getItem('wuxia_player_progress')||'{}');
    p.learnedSkills = [...set];
    localStorage.setItem('wuxia_player_progress', JSON.stringify(p));
  }catch(e){}
}

// 将一个 manualId 加入秘籍背包（不重复）
function addManualToBag(manualId){
  const list = manualsLoad();
  const m = MANUAL_DB[manualId];
  if(!m) return false;
  // 同一本秘籍允许重复持有（可作为稀有物品交易），但学习后自动消耗
  list.push({ manualId, obtained: new Date().toISOString() });
  manualsSave(list);
  return true;
}

// 获取秘籍背包（含模板信息）
function getManualsInBag(){
  const list = manualsLoad();
  return list.map(entry=>{
    const tpl = MANUAL_DB[entry.manualId];
    return tpl ? { ...entry, tpl } : null;
  }).filter(Boolean);
}

// ════════════════════════════════════════════════
//  学习条件检测
// ════════════════════════════════════════════════
function checkManualRequirements(manualId){
  const m = MANUAL_DB[manualId];
  if(!m) return { ok:false, reason:'秘籍不存在' };

  // 等级检测
  const playerLv = (typeof edS !== 'undefined' && edS.level) ? edS.level : 1;
  if(m.reqLv && playerLv < m.reqLv){
    return { ok:false, reason:`需要达到 ${m.reqLv} 级（当前 ${playerLv} 级）` };
  }

  // 熟练度档位检测
  if(m.reqProf){
    const school = m.school;
    const tier = (typeof getProfTier==='function') ? getProfTier(school) : { name:'入门' };
    const tierOrder = { '入门':0,'小成':1,'大成':2,'炉火纯青':3,'登峰造极':4,'化境':5 };
    const reqOrder = tierOrder[m.reqProf] ?? 0;
    const curOrder = tierOrder[tier.name] ?? 0;
    if(curOrder < reqOrder){
      return { ok:false, reason:`需要 ${school} 达到「${m.reqProf}」境界（当前「${tier.name}」）` };
    }
  }

  // 门派检测
  if(m.reqSect){
    const playerSect = (typeof edS !== 'undefined') ? (edS.sect || null) : null;
    if(playerSect !== m.reqSect){
      const sectName = (typeof SECTS !== 'undefined' && SECTS[m.reqSect]) ? SECTS[m.reqSect].name : m.reqSect;
      return { ok:false, reason:`需要加入「${sectName}」方可修习` };
    }
  }

  return { ok:true, reason:'' };
}

// ════════════════════════════════════════════════
//  学习秘籍
// ════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
//  功法"将将胡"系统 - 特殊修炼事件
// ═══════════════════════════════════════════════════════════════
const MANUAL_JIANGHU_EVENTS = {
  // 顿悟：直接学会额外技能
  enlightenment: {
    id: 'enlightenment',
    chance: 0.05, // 5%
    icon: '💡',
    title: '武学顿悟',
    desc: '修炼之际，你突然灵光一闪，领悟了更深层的奥义！',
  },
  // 走火入魔：损失气血但获得额外熟练度
  deviation: {
    id: 'deviation',
    chance: 0.03, // 3%
    icon: '🔥',
    title: '走火入魔',
    desc: '修炼时气息紊乱，险些走火入魔，但你也因此获得了意外的领悟...',
  },
  // 融会贯通：学派熟练度大幅提升
  mastery: {
    id: 'mastery',
    chance: 0.04, // 4%
    icon: '⚡',
    title: '融会贯通',
    desc: '你对这门武学的理解更上一层楼，达到了融会贯通的境界！',
  },
  // 意外突破：获得临时属性加成
  breakthrough: {
    id: 'breakthrough',
    chance: 0.02, // 2%
    icon: '🌟',
    title: '意外突破',
    desc: '修炼中你突破了自身极限，获得了短暂的实力提升！',
  },
};

function learnManual(bagIndex){
  const list = manualsLoad();
  const entry = list[bagIndex];
  if(!entry) return;
  const m = MANUAL_DB[entry.manualId];
  if(!m) return;

  const check = checkManualRequirements(entry.manualId);
  if(!check.ok){
    showToast(`❌ 无法修习：${check.reason}`);
    return;
  }

  const learned = getLearnedSkills();
  const newSkills = (m.skills || []).filter(sid => !learned.has(sid));

  if(newSkills.length === 0){
    showToast('你已经掌握此秘籍中的所有招式了。');
    // 仍消耗秘籍（已学透，秘籍化为灰烬）
    list.splice(bagIndex, 1);
    manualsSave(list);
    renderManualsPanel();
    return;
  }

  // ═══════════════════════════════════════════════════════════════
  //  功法"将将胡"系统 - 特殊事件检查
  // ═══════════════════════════════════════════════════════════════
  let specialEvent = null;
  for (const [key, event] of Object.entries(MANUAL_JIANGHU_EVENTS)) {
    if (Math.random() < event.chance) {
      specialEvent = event;
      break;
    }
  }

  // 学习技能
  newSkills.forEach(sid => learned.add(sid));

  // 应用特殊事件效果
  let extraMsg = '';
  if (specialEvent) {
    switch (specialEvent.id) {
      case 'enlightenment':
        // 顿悟：额外获得一个随机技能（同门派）
        const schoolSkills = Object.values(SKILL_LIB || {}).flat().filter(s => s.school === m.school && !learned.has(s.id));
        if (schoolSkills.length > 0) {
          const bonusSkill = schoolSkills[Math.floor(Math.random() * schoolSkills.length)];
          learned.add(bonusSkill.id);
          extraMsg = `💡 顿悟！额外领悟【${bonusSkill.name}】！`;
        }
        break;
      case 'deviation':
        // 走火入魔：损失气血，但熟练度+100
        if (typeof edS !== 'undefined') {
          const hpLoss = Math.floor(edS.maxHp * 0.15);
          edS.hp = Math.max(1, edS.hp - hpLoss);
          extraMsg = `🔥 走火入魔！气血-${hpLoss}，但熟练度+100！`;
        }
        if (m.school && typeof addProficiency === 'function') {
          addProficiency(m.school, 100);
        }
        break;
      case 'mastery':
        // 融会贯通：熟练度+150
        if (m.school && typeof addProficiency === 'function') {
          addProficiency(m.school, 150);
        }
        extraMsg = '⚡ 融会贯通！学派熟练度+150！';
        break;
      case 'breakthrough':
        // 意外突破：临时攻击+15%，持续5场战斗
        window._manualAtkBuff = { value: 15, turns: 5 };
        extraMsg = '🌟 意外突破！攻击力+15%，持续5场战斗！';
        break;
    }
  }

  saveLearnedSkills(learned);

  // 消耗秘籍
  list.splice(bagIndex, 1);
  manualsSave(list);

  // 熟练度加成：学习后给对应学派+50熟练度（触发升档提示）
  if(m.school && typeof addProficiency === 'function'){
    addProficiency(m.school, 50);
  }

  // 显示学习动画
  showManualLearnAnimation(m, newSkills, specialEvent, extraMsg);
  setTimeout(renderManualsPanel, 600);

  // ── 境界真气：修习秘籍获得真气 ─────────────────────
  if(typeof addRealmQi === 'function'){
    const qiGain = (typeof REALM_QI_SOURCES !== 'undefined')
      ? REALM_QI_SOURCES.manualPractice(m.reqLv || 1)
      : Math.round(5 + (m.reqLv || 1) * 3);
    addRealmQi(qiGain, 'manual');
    showToast(`💠 修习成功，真气+${qiGain}`, 'info');
  }

  // 刷新技能选择器（让新技能可被选用）
  if(typeof cpRefreshSkillSelector === 'function') cpRefreshSkillSelector();
}

// ── 学习动画 ──
function showManualLearnAnimation(manual, newSkillIds, specialEvent, extraMsg){
  const rarity = MANUAL_RARITY[manual.rarity] || MANUAL_RARITY.fragment;

  // 获取技能详情
  const allSkills = (typeof SKILL_LIB !== 'undefined')
    ? Object.values(SKILL_LIB).flat()
    : [];
  const skillDetails = newSkillIds.map(sid=>{
    const sk = allSkills.find(s=>s.id===sid);
    return sk ? `${sk.icon} <b>${sk.name}</b>（${sk.school}·${sk.desc?.slice(0,20)||''}…）` : sid;
  });

  // 特殊事件样式
  const jianghuStyle = specialEvent ? `
    <style>
      @keyframes jianghuGlow {
        0%,100%{box-shadow:0 0 20px ${specialEvent.id === 'deviation' ? '#ff4444' : '#ffd060'};}
        50%{box-shadow:0 0 40px ${specialEvent.id === 'deviation' ? '#ff6666' : '#ffec8b'};}
      }
    </style>
  ` : '';

  const overlay = document.createElement('div');
  overlay.id = 'manualLearnOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,.85);display:flex;flex-direction:column;
    align-items:center;justify-content:center;z-index:9999;
    animation:fadeIn .3s ease;
  `;
  overlay.innerHTML = `
    <style>
      @keyframes bookGlow {
        0%{transform:scale(.8) rotate(-5deg);opacity:0;}
        30%{transform:scale(1.2) rotate(3deg);opacity:1;}
        60%{transform:scale(1.05) rotate(-1deg);}
        100%{transform:scale(1) rotate(0deg);}
      }
      @keyframes skillReveal {
        from{transform:translateX(-30px);opacity:0;}
        to{transform:translateX(0);opacity:1;}
      }
    </style>
    ${jianghuStyle}
    ${specialEvent ? `
    <div style="margin-bottom:15px;text-align:center;">
      <span style="font-size:10px;color:${specialEvent.id === 'deviation' ? '#ff6060' : '#ffd060'};border:1px solid ${specialEvent.id === 'deviation' ? '#ff6060' : '#ffd060'};padding:2px 10px;border-radius:20px;">将将胡</span>
    </div>
    ` : ''}
    <div style="font-size:64px;animation:bookGlow .6s ease forwards;margin-bottom:12px;${specialEvent ? 'animation:bookGlow .6s ease forwards,jianghuGlow 2s ease infinite;' : ''}">${specialEvent ? specialEvent.icon : rarity.icon}</div>
    <div style="color:${rarity.color};font-size:20px;font-weight:bold;margin-bottom:4px;letter-spacing:3px;text-shadow:0 0 12px ${rarity.color}88">${manual.name}</div>
    <div style="color:rgba(200,180,120,.6);font-size:12px;margin-bottom:20px">${manual.flavor}</div>
    ${specialEvent ? `
    <div style="color:${specialEvent.id === 'deviation' ? '#ff6060' : '#ffd060'};font-size:16px;margin-bottom:12px;font-weight:bold;text-shadow:0 0 10px ${specialEvent.id === 'deviation' ? '#ff6060' : '#ffd060'}66;">
      ${specialEvent.title}
    </div>
    <div style="color:rgba(200,180,120,.8);font-size:12px;margin-bottom:16px;max-width:300px;text-align:center;font-style:italic;">
      ${specialEvent.desc}
    </div>
    ` : ''}
    <div style="color:#80ff88;font-size:14px;margin-bottom:16px;letter-spacing:2px">✨ 习得招式 ✨</div>
    <div style="display:flex;flex-direction:column;gap:8px;max-width:320px">
      ${skillDetails.map((s,i)=>`
        <div style="color:#e8d5a3;font-size:13px;background:rgba(255,255,255,.05);
          padding:8px 16px;border-radius:8px;border:1px solid rgba(255,200,80,.2);
          animation:skillReveal .4s ${.1+i*.12}s ease both">${s}</div>
      `).join('')}
    </div>
    ${extraMsg ? `
    <div style="color:${specialEvent && specialEvent.id === 'deviation' ? '#ff6060' : '#ffd060'};font-size:13px;margin-top:16px;padding:10px 16px;background:rgba(255,255,255,.08);border-radius:8px;border:1px solid ${specialEvent && specialEvent.id === 'deviation' ? '#ff6060' : '#ffd060'}44;">
      ${extraMsg}
    </div>
    ` : ''}
    <div style="color:rgba(160,140,100,.5);font-size:11px;margin-top:24px">点击任意处继续</div>
  `;
  overlay.onclick = ()=> overlay.remove();
  document.body.appendChild(overlay);
  setTimeout(()=> overlay.remove(), 5000);
}

// ════════════════════════════════════════════════
//  战斗掉落
// ════════════════════════════════════════════════
// 根据敌人等级和tier随机掉落秘籍
// 调用时机：战斗胜利后
function tryDropManual(enemyLevel, enemyTier){
  // 基础掉落概率
  let dropChance = 0.04; // func：4%
  if(enemyTier === 'major')  dropChance = 0.10;
  if(enemyTier === 'elite')  dropChance = 0.25;

  // 气运影响
  const fate = (typeof edS !== 'undefined' && edS.fate) ? edS.fate : 10;
  dropChance *= (1 + fate * 0.015); // fate20=+30%，fate5=+7.5%

  if(Math.random() > dropChance) return null;

  // 按等级筛选并加权随机
  const pool = MANUAL_DROP_POOL.filter(m=>{
    const lvOk = !m.reqLv || m.reqLv <= enemyLevel + 5;
    // elite限制：只掉complete以上
    if(enemyTier === 'elite'){
      return lvOk && ['complete','rare','legendary'].includes(m.rarity);
    }
    if(enemyTier === 'major'){
      return lvOk && ['fragment','partial','complete'].includes(m.rarity);
    }
    return lvOk && ['fragment','partial'].includes(m.rarity);
  });

  if(!pool.length) return null;

  const totalW = pool.reduce((s,m)=>s+m.dropWeight,0);
  let r = Math.random() * totalW;
  for(const m of pool){
    r -= m.dropWeight;
    if(r <= 0) return m;
  }
  return pool[pool.length-1];
}

// 战斗胜利后调用（添加到 battle.js 的 checkWin 胜利分支）
function onBattleWinCheckManual(enemy){
  const lv = (enemy._stats && enemy._stats.level) ? enemy._stats.level : (enemy.level || 20);
  const tier = enemy._npcTier || 'func';
  const dropped = tryDropManual(lv, tier);
  if(!dropped) return;
  addManualToBag(dropped.id);
  const rarity = MANUAL_RARITY[dropped.rarity];
  showToast(`📜 获得武学秘籍：${rarity.icon}【${dropped.name}】！`);
}

// ════════════════════════════════════════════════
//  UI — 秘籍背包面板
// ════════════════════════════════════════════════
const MANUAL_SCHOOL_COLORS = {
  '剑系':'#40b0ff','佛系':'#f0c040','道系':'#60e8e8','力系':'#e09050',
  '暗系':'#b060ff','毒系':'#80ff40','冰系':'#80d8ff','火系':'#ff6020',
  '雷系':'#ffe060','风系':'#80ffcc','圣系':'#fff0a0','通用':'#e8d5a3',
  '拳系':'#f0a060','奇门':'#c8a0ff','琴系':'#ffa0cc','命理':'#a0ffd0',
};

function renderManualsPanel(){
  const el = document.getElementById('manualsBagPanel');
  if(!el) return;

  const bag = getManualsInBag();
  const learned = getLearnedSkills();
  const allSkills = (typeof SKILL_LIB !== 'undefined') ? Object.values(SKILL_LIB).flat() : [];

  if(bag.length === 0){
    el.innerHTML = `
      <div style="text-align:center;padding:30px 0;color:rgba(160,140,100,.4)">
        <div style="font-size:32px;margin-bottom:8px">📜</div>
        <div style="font-size:12px;letter-spacing:2px">尚无秘籍</div>
        <div style="font-size:10px;margin-top:8px;opacity:.6">击败强敌或完成任务可获得武学秘籍</div>
      </div>`;
    return;
  }

  el.innerHTML = bag.map((entry, idx)=>{
    const m = entry.tpl;
    const rarity = MANUAL_RARITY[m.rarity] || MANUAL_RARITY.fragment;
    const schoolColor = MANUAL_SCHOOL_COLORS[m.school] || '#e8d5a3';
    const check = checkManualRequirements(m.id);

    // 技能预览
    const skillsHtml = (m.skills || []).map(sid=>{
      const sk = allSkills.find(s=>s.id===sid);
      const isLearned = learned.has(sid);
      return sk
        ? `<span class="manual-skill-tag ${isLearned?'learned':''}" title="${sk.desc||''}">${sk.icon}${sk.name}${isLearned?' ✓':''}</span>`
        : '';
    }).join('');

    // 按钮状态
    const btnLabel = check.ok ? '📖 修习' : '🔒 条件不足';
    const btnStyle = check.ok
      ? `background:rgba(${parseInt(schoolColor.slice(1,3),16)},${parseInt(schoolColor.slice(3,5),16)},${parseInt(schoolColor.slice(5,7),16)},.2);border-color:${schoolColor}44;color:${schoolColor};cursor:pointer`
      : `background:rgba(80,60,40,.2);border-color:rgba(120,100,60,.2);color:rgba(160,140,100,.4);cursor:not-allowed`;

    return `
      <div class="manual-card rarity-${m.rarity}" style="--rarity-color:${rarity.color}">
        <div class="manual-card-header">
          <span class="manual-icon" style="color:${rarity.color}">${rarity.icon}</span>
          <div class="manual-name-block">
            <div class="manual-name" style="color:${rarity.color}">${m.name}</div>
            <div class="manual-meta">
              <span class="manual-rarity-tag" style="color:${rarity.color}">${rarity.label}</span>
              <span class="manual-school-tag" style="color:${schoolColor}">${m.school}</span>
            </div>
          </div>
        </div>
        <div class="manual-desc">${m.desc}</div>
        <div class="manual-flavor">${m.flavor}</div>
        <div class="manual-skills-row">${skillsHtml}</div>
        ${m.reqLv||m.reqProf||m.reqSect ? `
          <div class="manual-reqs">
            ${m.reqLv?`<span class="req-tag">Lv.${m.reqLv}</span>`:''}
            ${m.reqProf?`<span class="req-tag">${m.school}${m.reqProf}</span>`:''}
            ${m.reqSect?`<span class="req-tag">门派专属</span>`:''}
          </div>` : ''}
        ${!check.ok ? `<div class="manual-fail-reason">⚠ ${check.reason}</div>` : ''}
        <div class="manual-btn-row">
          <button class="manual-learn-btn" style="${btnStyle}"
            ${check.ok?`onclick="learnManual(${idx})"`:''}>
            ${btnLabel}
          </button>
          <button class="manual-discard-btn" onclick="discardManual(${idx})" title="丢弃此秘籍">🗑</button>
        </div>
      </div>
    `;
  }).join('');
}

// 丢弃秘籍
function discardManual(bagIndex){
  const list = manualsLoad();
  if(!list[bagIndex]) return;
  const m = MANUAL_DB[list[bagIndex].manualId];
  if(!confirm(`确定丢弃「${m?.name||''}」？此操作不可撤回。`)) return;
  list.splice(bagIndex, 1);
  manualsSave(list);
  renderManualsPanel();
  showToast('已丢弃秘籍。');
}

// 获取已学技能（供技能选择器使用）
function getAllAvailableSkillIds(){
  // 默认开放：通用系全部 + 各系 _l 入门技
  const defaults = new Set();
  if(typeof SKILL_LIB !== 'undefined'){
    Object.values(SKILL_LIB).forEach(arr=>{
      arr.forEach(sk=>{
        if(sk.id.includes('_l') || sk.school === '通用') defaults.add(sk.id);
      });
    });
  }
  const learned = getLearnedSkills();
  // 合并默认 + 已学
  return new Set([...defaults, ...learned]);
}

// ── 秘籍商店（NPC出售高价秘籍）──
// 供 npc-logic.js 的 npcBuyItem 调用
function buyManualFromNpc(manualId){
  const m = MANUAL_DB[manualId];
  if(!m){ showToast('秘籍不存在！'); return false; }
  addManualToBag(manualId);
  const rarity = MANUAL_RARITY[m.rarity];
  showToast(`${rarity.icon} 购得秘籍：【${m.name}】，请在武学秘籍页修习！`);
  renderManualsPanel();
  return true;
}

// ── 秘籍标签数量（供背包页显示红点）──
function getManualsCount(){
  return manualsLoad().length;
}

// ── 渲染已学技能总览（在技能选择器旁增加展示）──
function renderLearnedSkillsOverview(){
  const el = document.getElementById('learnedSkillsOverview');
  if(!el) return;
  const learned = getLearnedSkills();
  if(learned.size === 0){
    el.innerHTML = `<div style="color:rgba(160,140,100,.4);font-size:11px;padding:8px 0">尚未从秘籍中学习任何招式</div>`;
    return;
  }
  const allSkills = Object.values(SKILL_LIB||{}).flat();
  const learnedSkills = allSkills.filter(s=>learned.has(s.id));
  const bySchool = {};
  learnedSkills.forEach(sk=>{
    if(!bySchool[sk.school]) bySchool[sk.school]=[];
    bySchool[sk.school].push(sk);
  });
  el.innerHTML = Object.entries(bySchool).map(([school, skills])=>{
    const color = MANUAL_SCHOOL_COLORS[school]||'#e8d5a3';
    return `
      <div style="margin-bottom:6px">
        <span style="color:${color};font-size:11px;margin-right:6px">${school}</span>
        ${skills.map(sk=>`
          <span title="${sk.desc||''}" style="display:inline-block;background:rgba(255,255,255,.06);
            border:1px solid ${color}22;padding:1px 6px;border-radius:4px;
            margin:2px;font-size:10px;color:${color}bb">${sk.icon}${sk.name}</span>
        `).join('')}
      </div>`;
  }).join('');
}

// ── 帮助框开关 ──
function toggleManualsHelp(){
  const box = document.getElementById('manualsHelpBox');
  if(!box) return;
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}
