// ════════════════════════════════════════════════════════════════════
//  master-apprentice.js  ·  师徒系统（独立于门派）
//  ──────────────────────────────────────────────────────────────────
//  核心规则：
//    · 一人可有多位师父、多位弟子（多对多）
//    · 拜师条件：好感≥60 + 玩家等级≤师父等级+5
//    · 收徒条件：好感≥60 + 玩家等级≥弟子等级+10
//    · 师徒日常：教学（经验）、赠送、切磋
//    · 出师：弟子等级≥师父等级-2 时可触发
//  存储键：localStorage 'ma_state'
//  全局入口：window.MA = { ... }
// ════════════════════════════════════════════════════════════════════
;(function(){
'use strict';

/* ── 常量 ──────────────────────────────────────────────────────── */
const MA_KEY = 'ma_state';

const MA_STATUS = {
  ACTIVE    : 'active',    // 正常师徒
  GRADUATED : 'graduated', // 已出师
  BROKEN    : 'broken',    // 已断绝
};

/* 师徒日常教学类型 */
const TEACH_TYPES = {
  EXP    : 'exp',      // 经验传授
  INNER  : 'inner',    // 内力修炼指导
  TIP    : 'tip',      // 武学心得（经验+少量声名）
  GIFT   : 'gift',     // 赠送物品
};

/* 教学池 —— 每种教学类型的叙事模板 */
const TEACH_NARRATIVES = {
  exp: [
    '${master}盘膝而坐，将毕生所学娓娓道来。你听得如痴如醉，功力暗暗增长。',
    '${master}以一招"云龙三现"演示攻守之道，你顿悟了不少。',
    '${master}翻出一本泛黄的剑谱："这一招我参悟了十年，你拿去看吧。"',
    '${master}与你对坐论武，从招式到内力，从身法到心法，受益匪浅。',
  ],
  inner: [
    '${master}引你入定，将一股纯净内力渡入你经脉，帮你疏通了一处淤堵。',
    '${master}教你一套吐纳之法："气息要细、长、匀，心静则气顺。"',
    '${master}带你闭关半日，以深厚的内力为你护法，你感觉内力更加充沛了。',
  ],
  tip: [
    '${master}拍拍你的肩膀："武林之道，不在于力，在于心。记住这句话。"',
    '${master}与你饮茶论道，谈起当年行走江湖的往事，你感触良多。',
    '"年轻人，别急。"${master}淡淡说道，"功夫是熬出来的，不是练出来的。"',
  ],
  gift: [
    '${master}从怀中取出一物："这个留给你，或许日后有用。"',
    '${master}翻了翻储物袋，找出一块不错的材料递给你："收着吧。"',
  ],
};

// ═══════════════════════════════════════════════════════════════
//  师徒"将将胡"系统 - 特殊教学事件
// ═══════════════════════════════════════════════════════════════
const MA_JIANGHU_EVENTS = {
  // 顿悟：获得双倍经验
  enlightenment: {
    id: 'enlightenment',
    chance: 0.05, // 5%
    icon: '💡',
    title: '顿悟',
    desc: '师父的一句话让你茅塞顿开，武学境界瞬间提升！',
    effect: (baseExp) => ({ exp: baseExp * 2, msg: '✨ 顿悟！获得双倍经验！' }),
  },
  // 奇遇：师父带你游历
  adventure: {
    id: 'adventure',
    chance: 0.03, // 3%
    icon: '🏔️',
    title: '师徒奇遇',
    desc: '师父带你去了一处隐秘之地，你获得了意想不到的收获！',
    effect: (baseExp) => {
      const bonus = 30 + Math.floor(Math.random() * 50);
      return { exp: baseExp + bonus, msg: `🏔️ 师徒奇遇！额外获得${bonus}经验！`, extraItem: true };
    },
  },
  // 指点迷津：突破瓶颈
  guidance: {
    id: 'guidance',
    chance: 0.02, // 2%
    icon: '🧭',
    title: '指点迷津',
    desc: '师父看出了你的武学瓶颈，亲自为你指点...',
    effect: (baseExp) => {
      // 恢复全部精力
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.energy = 100;
        if (typeof travelSave === 'function') travelSave();
      }
      return { exp: baseExp, msg: '🧭 指点迷津！精力完全恢复！', restoreEnergy: true };
    },
  },
  // 传承秘技：获得特殊技能加成
  secretSkill: {
    id: 'secretSkill',
    chance: 0.01, // 1%
    icon: '🔮',
    title: '传承秘技',
    desc: '师父将一门不传之秘传授于你！',
    effect: (baseExp) => {
      // 临时攻击加成
      return { exp: baseExp * 3, msg: '🔮 传承秘技！攻击力临时+20%，持续3场战斗！', atkBuff: 20 };
    },
  },
};

/* ── 状态 ──────────────────────────────────────────────────────── */
let _st = {
  masters   : [],  // [{npcId, name, title, sect, date, status}]
  apprentices : [],  // [{npcId, name, title, sect, date, status}]
  teachLog  : {},  // { npcId: { lastDate:'YYYY-MM-DD', countToday:N } }
  gradLog   : [],  // [{npcId, name, date}] 出师记录
  settings  : { maxMasters: 5, maxApprentices: 3 },
};

/* ── 存取 ──────────────────────────────────────────────────────── */
function maLoad(){
  try {
    const raw = localStorage.getItem(MA_KEY);
    if(raw){
      const s = JSON.parse(raw);
      _st.masters     = s.masters     || [];
      _st.apprentices = s.apprentices || [];
      _st.teachLog    = s.teachLog    || {};
      _st.gradLog     = s.gradLog     || [];
      if(s.settings) Object.assign(_st.settings, s.settings);
    }
  } catch(e){ console.warn('[MA] load error', e); }
}

function maSave(){
  try {
    localStorage.setItem(MA_KEY, JSON.stringify(_st));
  } catch(e){ console.warn('[MA] save error', e); }
}

/* ── 辅助 ──────────────────────────────────────────────────────── */
function getToday(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getPlayerLevel(){
  if(typeof edS !== 'undefined' && edS.level) return edS.level;
  return 1;
}

/** 获取 NPC 信息（同时兼容城镇NPC和江湖NPC） */
function getNpcInfo(npcId){
  // 优先查城镇NPC
  if(typeof NPC_DB !== 'undefined' && NPC_DB[npcId]){
    const n = NPC_DB[npcId];
    return {
      name: n.name || npcId,
      title: n.title || '',
      sect: n.sect || _inferSect(npcId) || '',
      level: n.level || n.combat?.level || 20,
    };
  }
  // 再查江湖NPC
  if(typeof JIANGHU_NPC_DB !== 'undefined' && JIANGHU_NPC_DB[npcId]){
    const n = JIANGHU_NPC_DB[npcId];
    return {
      name: n.name || npcId,
      title: n.title || '',
      sect: n.sect || '',
      level: n.level || 30,
    };
  }
  return null;
}

/** 根据 npcId 反推门派（用于城镇NPC） */
function _inferSect(npcId){
  if(typeof _getNpcSectId === 'function'){
    const sectId = _getNpcSectId(npcId);
    if(sectId && typeof SECT_DB !== 'undefined' && SECT_DB[sectId]){
      return SECT_DB[sectId].name || '';
    }
  }
  return '';
}

/** 获取 NPC 好感（同时兼容两套系统） */
function getNpcRelVal(npcId){
  if(typeof getNpcRel === 'function'){
    return getNpcRel(npcId);
  }
  if(typeof jhGetRel === 'function'){
    const r = jhGetRel(npcId);
    return r ? (r.val || 0) : 0;
  }
  return 0;
}

/** Toast 适配（town.html 用 townToast，其他页面用 showToast） */
function _toast(msg, type){
  if(typeof townToast === 'function') townToast(msg);
  else if(typeof showToast === 'function') showToast(msg, type);
  else console.log('[MA]', msg);
}

/** 随机选取数组元素 */
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

/* ── 核心：拜师 ──────────────────────────────────────────────── */

/**
 * 检查是否可以拜某NPC为师
 * @returns {{ok:boolean, msg:string}}
 */
function canBecomeApprentice(npcId){
  const info = getNpcInfo(npcId);
  if(!info) return { ok:false, msg:'无法获取该人物信息。' };

  // 已有师徒关系？
  const existing = _st.masters.find(m => m.npcId === npcId && m.status === MA_STATUS.ACTIVE);
  if(existing) return { ok:false, msg:`你已经是${info.name}的弟子了。` };

  // 已出师？
  const graduated = _st.masters.find(m => m.npcId === npcId && m.status === MA_STATUS.GRADUATED);
  if(graduated) return { ok:false, msg:`你已从${info.name}门下出师。` };

  // 上限
  const activeCount = _st.masters.filter(m => m.status === MA_STATUS.ACTIVE).length;
  if(activeCount >= _st.settings.maxMasters){
    return { ok:false, msg:`你已有${activeCount}位师父，无法再拜师（上限${_st.settings.maxMasters}位）。` };
  }

  // 好感检查
  const rel = getNpcRelVal(npcId);
  if(rel < 60){
    return { ok:false, msg:`与${info.name}的好感度不足（当前${rel}，需≥60）。` };
  }

  // 等级检查：玩家不能比师父高太多
  const pLv = getPlayerLevel();
  if(pLv > info.level + 5){
    return { ok:false, msg:`你的等级（Lv${pLv}）已超过${info.name}（Lv${info.level}），无需拜师。` };
  }

  return { ok:true, msg:`可以向${info.name}拜师。` };
}

/**
 * 执行拜师
 */
function doBecomeApprentice(npcId){
  const check = canBecomeApprentice(npcId);
  if(!check.ok){
    _toast(check.msg, 'err');
    return false;
  }

  const info = getNpcInfo(npcId);
  _st.masters.push({
    npcId,
    name : info.name,
    title: info.title,
    sect : info.sect,
    date : getToday(),
    status: MA_STATUS.ACTIVE,
  });
  maSave();

  // 同步更新江湖/城镇NPC关系类型
  _syncRelType(npcId, 'student');

  _toast(`📚 拜师成功！${info.name}（${info.title || info.sect}）收你为弟子！`);

  // 江湖恩怨记录
  _addGrievance('apprentice', npcId, info.name, `拜${info.name}为师`);

  return true;
}

/* ── 核心：收徒 ──────────────────────────────────────────────── */

function canTakeApprentice(npcId){
  const info = getNpcInfo(npcId);
  if(!info) return { ok:false, msg:'无法获取该人物信息。' };

  const existing = _st.apprentices.find(a => a.npcId === npcId && a.status === MA_STATUS.ACTIVE);
  if(existing) return { ok:false, msg:`${info.name}已经是你的弟子了。` };

  const graduated = _st.apprentices.find(a => a.npcId === npcId && a.status === MA_STATUS.GRADUATED);
  if(graduated) return { ok:false, msg:`${info.name}已从你门下出师。` };

  const activeCount = _st.apprentices.filter(a => a.status === MA_STATUS.ACTIVE).length;
  if(activeCount >= _st.settings.maxApprentices){
    return { ok:false, msg:`你已有${activeCount}位弟子，无法再收徒（上限${_st.settings.maxApprentices}位）。` };
  }

  const rel = getNpcRelVal(npcId);
  if(rel < 60){
    return { ok:false, msg:`与${info.name}的好感度不足（当前${rel}，需≥60）。` };
  }

  // 收徒：玩家必须比弟子高至少10级
  const pLv = getPlayerLevel();
  if(pLv < info.level + 10){
    return { ok:false, msg:`你的等级（Lv${pLv}）不足以收${info.name}（Lv${info.level}）为徒（需高出10级以上）。` };
  }

  return { ok:true, msg:`可以收${info.name}为徒。` };
}

function doTakeApprentice(npcId){
  const check = canTakeApprentice(npcId);
  if(!check.ok){
    _toast(check.msg, 'err');
    return false;
  }

  const info = getNpcInfo(npcId);
  _st.apprentices.push({
    npcId,
    name : info.name,
    title: info.title,
    sect : info.sect,
    date : getToday(),
    status: MA_STATUS.ACTIVE,
  });
  maSave();

  _syncRelType(npcId, 'teacher');

  _toast(`📚 收徒成功！${info.name}（${info.title || info.sect}）拜入你门下！`);

  _addGrievance('apprentice', npcId, info.name, `收${info.name}为徒`);

  return true;
}

/* ── 核心：出师 ──────────────────────────────────────────────── */

/**
 * 检查弟子是否可以出师
 * @param {string} npcId - 弟子的 NPC ID
 */
function canGraduate(npcId){
  const app = _st.apprentices.find(a => a.npcId === npcId && a.status === MA_STATUS.ACTIVE);
  if(!app) return { ok:false, msg:'该NPC不是你的在册弟子。' };

  const info = getNpcInfo(npcId);
  const pLv = getPlayerLevel();
  // 出师条件：弟子等级已接近师父水平
  if(info.level > pLv - 2){
    return { ok:false, msg:`${info.name}（Lv${info.level}）尚需历练，等你等级更高些再考虑出师之事。` };
  }

  return { ok:true, msg:`${info.name}已学有所成，可以出师了。` };
}

function doGraduate(npcId){
  const check = canGraduate(npcId);
  if(!check.ok){
    _toast(check.msg, 'err');
    return false;
  }

  const app = _st.apprentices.find(a => a.npcId === npcId && a.status === MA_STATUS.ACTIVE);
  app.status = MA_STATUS.GRADUATED;

  _st.gradLog.push({ npcId, name: app.name, date: getToday() });
  maSave();

  _toast(`🎓 ${app.name}已出师！师徒情谊永存。`);

  // 出师奖励：经验 + 声名
  const pLv = getPlayerLevel();
  const expReward = Math.floor(50 + pLv * 8);
  if(typeof addPlayerExp === 'function'){
    addPlayerExp(expReward, '出师奖励');
  } else if(typeof edS !== 'undefined'){
    edS.exp = (edS.exp || 0) + expReward;
  }

  // 江湖传闻
  if(typeof weAddEvent === 'function'){
    weAddEvent({
      tier: (typeof WE_TIER !== 'undefined') ? WE_TIER.MEDIUM : 2,
      text: `${_getPlayerName()}的弟子${app.name}学成出师，江湖人称名师出高徒。`,
    });
  }

  return true;
}

/* ── 核心：断绝师徒 ──────────────────────────────────────────── */

function breakBond(npcId){
  let found = false;

  const m = _st.masters.find(x => x.npcId === npcId && x.status === MA_STATUS.ACTIVE);
  if(m){
    m.status = MA_STATUS.BROKEN;
    found = true;
    // 断绝师徒：好感大幅下降
    _adjustRel(npcId, -40);
  }

  const a = _st.apprentices.find(x => x.npcId === npcId && x.status === MA_STATUS.ACTIVE);
  if(a){
    a.status = MA_STATUS.BROKEN;
    found = true;
    _adjustRel(npcId, -40);
  }

  if(found){
    maSave();
    _toast('💔 师徒缘分已尽。', 'err');
  }

  return found;
}

/* ── 师徒日常：教学 ──────────────────────────────────────────── */

/**
 * 向师父求教 / 指导弟子
 * @param {string} npcId
 * @param {'master'|'apprentice'} role - 对方是我的师父还是弟子
 */
function dailyTeach(npcId, role){
  const today = getToday();

  // 每日次数检查
  if(!_st.teachLog[npcId]) _st.teachLog[npcId] = { lastDate:'', count:0 };
  const log = _st.teachLog[npcId];
  if(log.lastDate === today && log.count >= 2){
    _toast('⚠️ 今日已向此人请教过两次，改日再来吧。', 'err');
    return;
  }

  const info = getNpcInfo(npcId);
  if(!info) return;

  const pLv = getPlayerLevel();

  // ═══════════════════════════════════════════════════════════════
  //  师徒"将将胡"系统 - 特殊事件检查
  // ═══════════════════════════════════════════════════════════════
  let specialEvent = null;
  for (const [key, event] of Object.entries(MA_JIANGHU_EVENTS)) {
    if (Math.random() < event.chance) {
      specialEvent = event;
      break;
    }
  }

  // 随机教学类型
  const types = Object.keys(TEACH_TYPES);
  const teachType = pick(types);
  const narrative = pick(TEACH_NARRATIVES[teachType]).replace(/\$\{master\}/g, info.name);

  // 计算基础奖励
  let rewardText = '';
  let expGain = 0;

  switch(teachType){
    case 'exp':
      expGain = Math.floor(15 + info.level * 2 + Math.random() * 10);
      break;

    case 'inner':
      expGain = Math.floor(10 + info.level * 1.5);
      break;

    case 'tip':
      expGain = Math.floor(8 + info.level);
      break;

    case 'gift':
      expGain = Math.floor(5 + info.level * 0.5);
      break;
  }

  // 应用特殊事件效果
  if (specialEvent) {
    const result = specialEvent.effect(expGain);
    expGain = result.exp;
    rewardText = result.msg;

    // 额外物品奖励
    if (result.extraItem && typeof craftBagAdd === 'function') {
      const items = ['item_herb_gancao', 'item_iron_ore', 'item_rare_jade'];
      const itemId = items[Math.floor(Math.random() * items.length)];
      craftBagAdd(itemId, 1);
      let itemName = itemId;
      if (typeof getItemMeta === 'function') {
        const meta = getItemMeta(itemId);
        if (meta && meta.name) itemName = (meta.icon || '') + meta.name;
      } else if (typeof CRAFT_MATERIAL_NAMES !== 'undefined' && CRAFT_MATERIAL_NAMES[itemId]) {
        const m = CRAFT_MATERIAL_NAMES[itemId];
        itemName = (m.icon || '') + m.name;
      }
      rewardText += ` 📦 获得${itemName}！`;
    }

    // 攻击buff
    if (result.atkBuff) {
      window._maAtkBuff = { value: result.atkBuff, turns: 3 };
    }

    // 显示特殊事件弹窗
    _showJianghuTeachDialog(info, specialEvent, narrative, rewardText);
  } else {
    // 普通奖励处理
    switch(teachType){
      case 'exp':
        if(typeof addPlayerExp === 'function') addPlayerExp(expGain, `师父${info.name}传授`);
        rewardText = `经验 +${expGain}`;
        break;
      case 'inner':
        if(typeof addPlayerExp === 'function') addPlayerExp(expGain, `内力修炼·${info.name}指导`);
        rewardText = `内力修炼进步，经验 +${expGain}`;
        break;
      case 'tip':
        if(typeof addPlayerExp === 'function') addPlayerExp(expGain, `武学心得·${info.name}`);
        rewardText = `经验 +${expGain}，心得「${_randomWisdom()}」`;
        break;
      case 'gift':
        const silver = Math.floor(20 + info.level * 3 + Math.random() * 30);
        if (typeof addSilver === 'function') {
          addSilver(silver);
        } else if (typeof edS !== 'undefined') {
          edS.silver = (edS.silver || 0) + silver;
          if (typeof saveProgress === 'function') saveProgress();
          if (typeof editorSave === 'function') editorSave();
        }
        rewardText = `获得银两 +${silver}`;
        break;
    }
    _showTeachDialog(info, teachType, narrative, rewardText);
  }

  // 更新日志
  log.lastDate = today;
  log.count++;
  maSave();

  // 好感微增
  _adjustRel(npcId, 2);
}

/* ── 师徒加成（战斗相关） ────────────────────────────────────── */

/**
 * 获取师徒加成倍率（战斗时调用）
 * @param {string|null} allyNpcId - 战斗中的友方NPC（如果有）
 * @returns {{ atkMult:number, defMult:number, expMult:number, desc:string }}
 */
function getMasterApprenticeBonus(allyNpcId){
  let atkMult = 1.0, defMult = 1.0, expMult = 1.0;
  let desc = '';

  // 1. 有师父在场 → 攻击+5%
  if(allyNpcId && _st.masters.some(m => m.npcId === allyNpcId && m.status === MA_STATUS.ACTIVE)){
    atkMult = 1.05;
    desc = '师徒协力·攻击+5%';
  }

  // 2. 有弟子在场 → 防御+3%
  if(allyNpcId && _st.apprentices.some(a => a.npcId === allyNpcId && a.status === MA_STATUS.ACTIVE)){
    defMult = 1.03;
    desc += (desc ? '，' : '') + '弟子守护·防御+3%';
  }

  // 3. 有活跃师徒关系 → 经验+8%
  const activeMasters = _st.masters.filter(m => m.status === MA_STATUS.ACTIVE).length;
  if(activeMasters > 0){
    expMult = 1.0 + Math.min(activeMasters * 0.08, 0.24); // 每位师父+8%，上限24%
    if(activeMasters === 1) desc += (desc ? '，' : '') + '名师指导·经验+8%';
    else desc += (desc ? '，' : '') + `多位师父指导·经验+${Math.round(Math.min(activeMasters * 8, 24))}%`;
  }

  // ── 将将胡：师徒手牌羁绊 ──
  // 有师父时，师父学派手牌伤害+10%
  const masterSchoolBonus = _getMasterSchoolCardBonus();
  if(masterSchoolBonus > 0){
    desc += (desc ? '，' : '') + `🀄 师门心法·手牌伤害+${Math.round(masterSchoolBonus * 100)}%`;
  }

  return { atkMult, defMult, expMult, desc, masterSchoolBonus };
}

/** 获取师父学派手牌伤害加成 */
function _getMasterSchoolCardBonus(){
  if(typeof getPlayerSectBonus !== 'function') return 0;
  const sb = getPlayerSectBonus();
  if(!sb) return 0;
  // 师父与玩家同门派时，手牌伤害+10%
  const mySect = (typeof edS !== 'undefined') ? edS.sect : null;
  if(!mySect || !_st.masters || _st.masters.length === 0) return 0;
  // 简化：只要有活跃师父就给10%手牌伤害加成
  const hasActiveMaster = _st.masters.some(function(m){ return m.status === MA_STATUS.ACTIVE; });
  return hasActiveMaster ? 0.10 : 0;
}

/* ── UI 渲染 ──────────────────────────────────────────────────── */

/**
 * 渲染师徒面板HTML（用于嵌入 town.html / sect.html 的Tab）
 */
function renderPanel(){
  const activeMasters = _st.masters.filter(m => m.status === MA_STATUS.ACTIVE);
  const activeApps   = _st.apprentices.filter(a => a.status === MA_STATUS.ACTIVE);
  const graduated    = [..._st.masters.filter(m => m.status === MA_STATUS.GRADUATED),
                        ..._st.apprentices.filter(a => a.status === MA_STATUS.GRADUATED)];
  const broken       = [..._st.masters.filter(m => m.status === MA_STATUS.BROKEN),
                        ..._st.apprentices.filter(a => a.status === MA_STATUS.BROKEN)];

  let html = `<div class="ma-panel">`;

  // 标题
  html += `<div class="ma-header">
    <h3>📚 师徒录</h3>
    <span class="ma-count">师父 ${activeMasters.length}/${_st.settings.maxMasters} · 弟子 ${activeApps.length}/${_st.settings.maxApprentices}</span>
  </div>`;

  // 我的师父
  html += `<div class="ma-section">
    <div class="ma-section-title">👨‍🏫 我的师父</div>`;
  if(activeMasters.length === 0){
    html += `<div class="ma-empty">尚无师父。与NPC好感达到60以上后，可请求拜师。</div>`;
  } else {
    activeMasters.forEach(m => {
      const today = getToday();
      const teachLog = _st.teachLog[m.npcId];
      const teachCount = (teachLog && teachLog.lastDate === today) ? teachLog.count : 0;
      html += `<div class="ma-card">
        <div class="ma-card-header">
          <span class="ma-name">${m.name}</span>
          ${m.title ? `<span class="ma-title">${m.title}</span>` : ''}
          ${m.sect ? `<span class="ma-sect">[${m.sect}]</span>` : ''}
        </div>
        <div class="ma-card-info">拜师日期：${m.date}</div>
        <div class="ma-card-actions">
          <button class="ma-btn ma-btn-teach" onclick="MA.dailyTeach('${m.npcId}','master')" ${teachCount >= 2 ? 'disabled' : ''}>
            📖 请教${teachCount >= 2 ? '（今日已满）' : `（${2-teachCount}/2）`}
          </button>
          <button class="ma-btn ma-btn-break" onclick="MA.confirmBreak('${m.npcId}','${m.name}')">💔 断绝师徒</button>
        </div>
      </div>`;
    });
  }
  html += `</div>`;

  // 我的弟子
  html += `<div class="ma-section">
    <div class="ma-section-title">🧑‍🎓 我的弟子</div>`;
  if(activeApps.length === 0){
    html += `<div class="ma-empty">尚无弟子。好感60以上且等级高出对方10级以上，可收为弟子。</div>`;
  } else {
    activeApps.forEach(a => {
      const today = getToday();
      const teachLog = _st.teachLog[a.npcId];
      const teachCount = (teachLog && teachLog.lastDate === today) ? teachLog.count : 0;
      const info = getNpcInfo(a.npcId);
      const canGrad = info && info.level <= getPlayerLevel() - 2;
      html += `<div class="ma-card">
        <div class="ma-card-header">
          <span class="ma-name">${a.name}</span>
          ${a.title ? `<span class="ma-title">${a.title}</span>` : ''}
          ${a.sect ? `<span class="ma-sect">[${a.sect}]</span>` : ''}
          ${info ? `<span class="ma-level">Lv${info.level}</span>` : ''}
        </div>
        <div class="ma-card-info">收徒日期：${a.date}</div>
        <div class="ma-card-actions">
          <button class="ma-btn ma-btn-teach" onclick="MA.dailyTeach('${a.npcId}','apprentice')" ${teachCount >= 2 ? 'disabled' : ''}>
            📖 指导${teachCount >= 2 ? '（今日已满）' : `（${2-teachCount}/2）`}
          </button>
          ${canGrad ? `<button class="ma-btn ma-btn-grad" onclick="MA.confirmGraduate('${a.npcId}','${a.name}')">🎓 让其出师</button>` : ''}
          <button class="ma-btn ma-btn-break" onclick="MA.confirmBreak('${a.npcId}','${a.name}')">💔 断绝师徒</button>
        </div>
      </div>`;
    });
  }
  html += `</div>`;

  // 出师记录
  if(graduated.length > 0){
    html += `<div class="ma-section ma-section-closed">
      <div class="ma-section-title">📜 出师记录</div>
      <div class="ma-list">
        ${graduated.map(g => `<div class="ma-list-item">${g.name}（${g.date}）</div>`).join('')}
      </div>
    </div>`;
  }

  html += `</div>`;
  return html;
}

/**
 * 在 NPC 对话面板中渲染师徒相关按钮
 * @param {string} npcId
 * @returns {string} HTML 片段（空字符串表示无可用操作）
 */
function renderNpcActions(npcId){
  const info = getNpcInfo(npcId);
  if(!info) return '';

  const btns = [];
  const pLv = getPlayerLevel();
  const rel = getNpcRelVal(npcId);

  // 检查是否已经是师父/弟子
  const isMaster = _st.masters.some(m => m.npcId === npcId && m.status === MA_STATUS.ACTIVE);
  const isApprentice = _st.apprentices.some(a => a.npcId === npcId && a.status === MA_STATUS.ACTIVE);
  const isGraduated = [..._st.masters, ..._st.apprentices].some(x => x.npcId === npcId && x.status === MA_STATUS.GRADUATED);

  if(isMaster){
    // 已是师父 → 教学按钮
    const today = getToday();
    const teachLog = _st.teachLog[npcId];
    const teachCount = (teachLog && teachLog.lastDate === today) ? teachLog.count : 0;
    btns.push(`<button class="npc-rel-action" onclick="MA.dailyTeach('${npcId}','master')" ${teachCount >= 2 ? 'disabled' : ''}>📖 请教（${2-teachCount}/2）</button>`);
  } else if(isApprentice){
    // 已是弟子 → 指导按钮
    const today = getToday();
    const teachLog = _st.teachLog[npcId];
    const teachCount = (teachLog && teachLog.lastDate === today) ? teachLog.count : 0;
    btns.push(`<button class="npc-rel-action" onclick="MA.dailyTeach('${npcId}','apprentice')" ${teachCount >= 2 ? 'disabled' : ''}>📖 指导（${2-teachCount}/2）</button>`);

    // 检查出师
    const canGrad = info.level <= pLv - 2;
    if(canGrad){
      btns.push(`<button class="npc-rel-action" onclick="MA.confirmGraduate('${npcId}','${info.name}')">🎓 让其出师</button>`);
    }
  } else if(isGraduated){
    btns.push(`<span class="ma-status-grad">🎓 已出师</span>`);
  } else {
    // 无师徒关系 → 检查是否可以拜师/收徒
    if(rel >= 60){
      if(pLv <= info.level + 5){
        // 可以拜师
        btns.push(`<button class="npc-rel-action" onclick="MA.confirmBecomeApprentice('${npcId}','${info.name}')">📚 拜师</button>`);
      }
      if(pLv >= info.level + 10){
        // 可以收徒
        btns.push(`<button class="npc-rel-action" onclick="MA.confirmTakeApprentice('${npcId}','${info.name}')">📚 收徒</button>`);
      }
    }
  }

  return btns.join('');
}

/* ── UI 辅助弹窗 ──────────────────────────────────────────────── */

function _showTeachDialog(info, type, narrative, rewardText){
  const typeLabels = { exp:'经验传授', inner:'内力修炼', tip:'武学心得', gift:'赠礼' };
  const typeIcons  = { exp:'📈', inner:'🧘', tip:'💡', gift:'🎁' };

  const overlay = document.createElement('div');
  overlay.className = 'ma-overlay';
  overlay.innerHTML = `
    <div class="ma-dialog">
      <div class="ma-dialog-header">
        <span class="ma-dialog-icon">${typeIcons[type] || '📖'}</span>
        <span class="ma-dialog-title">${typeLabels[type] || '教学'}</span>
      </div>
      <div class="ma-dialog-body">
        <p class="ma-narrative">${narrative}</p>
        <div class="ma-reward">${rewardText}</div>
      </div>
      <button class="ma-dialog-close" onclick="this.closest('.ma-overlay').remove()">知道了</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
}

// ═══════════════════════════════════════════════════════════════
//  师徒"将将胡"系统 - 特殊事件弹窗
// ═══════════════════════════════════════════════════════════════
function _showJianghuTeachDialog(info, event, narrative, rewardText){
  const overlay = document.createElement('div');
  overlay.className = 'ma-overlay';
  overlay.innerHTML = `
    <div class="ma-dialog" style="border: 2px solid #ffd060;">
      <div class="ma-dialog-header" style="background: linear-gradient(90deg, #2a2010, #3d3020);">
        <span style="font-size:10px;color:#ffd060;border:1px solid #ffd060;padding:2px 8px;border-radius:20px;margin-right:8px;">将将胡</span>
        <span class="ma-dialog-icon">${event.icon}</span>
        <span class="ma-dialog-title" style="color:#ffd060;">${event.title}</span>
      </div>
      <div class="ma-dialog-body">
        <p class="ma-narrative" style="color:#d4c4a0;">${narrative}</p>
        <p class="ma-narrative" style="color:#ffd060;font-style:italic;margin:10px 0;">${event.desc}</p>
        <div class="ma-reward" style="background:rgba(255,208,96,0.15);border-color:#ffd060;color:#ffd060;">${rewardText}</div>
      </div>
      <button class="ma-dialog-close" onclick="this.closest('.ma-overlay').remove()" style="background:rgba(255,208,96,0.2);color:#ffd060;border-color:#ffd060;">受益匪浅！</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
}

function confirmBecomeApprentice(npcId, name){
  _showConfirm(
    `📚 拜师请求`,
    `你确定要拜${name}为师吗？<br>拜师后，你将可以每日向师父请教两次。`,
    () => doBecomeApprentice(npcId)
  );
}

function confirmTakeApprentice(npcId, name){
  _showConfirm(
    `📚 收徒请求`,
    `你确定要收${name}为徒吗？<br>收徒后，你可以每日指导弟子两次。`,
    () => doTakeApprentice(npcId)
  );
}

function confirmGraduate(npcId, name){
  _showConfirm(
    `🎓 出师仪式`,
    `${name}已学有所成，你确定让其出师吗？<br>出师后将获得经验奖励，江湖传闻也将记载此事。`,
    () => doGraduate(npcId)
  );
}

function confirmBreak(npcId, name){
  _showConfirm(
    `💔 断绝师徒`,
    `你确定要与${name}断绝师徒关系吗？<br><span style="color:#e05050">此操作不可撤销，好感度将大幅下降。</span>`,
    () => breakBond(npcId)
  );
}

function _showConfirm(title, body, onConfirm){
  const overlay = document.createElement('div');
  overlay.className = 'ma-overlay';
  overlay.innerHTML = `
    <div class="ma-dialog ma-dialog-confirm">
      <div class="ma-dialog-header">
        <span class="ma-dialog-title">${title}</span>
      </div>
      <div class="ma-dialog-body">${body}</div>
      <div class="ma-dialog-actions">
        <button class="ma-btn ma-btn-cancel" onclick="this.closest('.ma-overlay').remove()">取消</button>
        <button class="ma-btn ma-btn-confirm" id="_ma_confirm_btn">确定</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#_ma_confirm_btn').addEventListener('click', () => {
    overlay.remove();
    onConfirm();
  });
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
}

/* ── 私有辅助 ──────────────────────────────────────────────── */

function _getPlayerName(){
  if(typeof edS !== 'undefined' && edS.name) return edS.name;
  return '少侠';
}

function _syncRelType(npcId, role){
  // 城镇NPC系统
  if(typeof jianghuState !== 'undefined' && jianghuState.npcRelations){
    if(!jianghuState.npcRelations[npcId]) jianghuState.npcRelations[npcId] = {};
    if(role === 'student') jianghuState.npcRelations[npcId].type = (typeof REL_TYPE !== 'undefined') ? REL_TYPE.STUDENT : 'student';
    if(role === 'teacher') jianghuState.npcRelations[npcId].type = (typeof REL_TYPE !== 'undefined') ? REL_TYPE.TEACHER : 'teacher';
    if(typeof jianghuSave === 'function') jianghuSave();
  }
  // 江湖NPC系统
  if(typeof JIANGHU_NPC_DB !== 'undefined' && JIANGHU_NPC_DB[npcId]){
    const rel = typeof jhGetRel === 'function' ? jhGetRel(npcId) : null;
    if(rel && typeof REL_TYPE !== 'undefined'){
      if(role === 'student') rel.type = REL_TYPE.STUDENT;
      if(role === 'teacher') rel.type = REL_TYPE.TEACHER;
      if(typeof jianghuSave === 'function') jianghuSave();
    }
  }
}

function _adjustRel(npcId, delta){
  if(typeof jhAdjustRel === 'function'){
    jhAdjustRel(npcId, delta);
  } else if(typeof setNpcRel === 'function'){
    const cur = getNpcRelVal(npcId);
    setNpcRel(npcId, Math.max(-100, Math.min(100, cur + delta)));
  }
}

function _addGrievance(type, npcId, name, reason){
  if(typeof jhAddGrievance === 'function'){
    jhAddGrievance({ type:'bond', target:npcId, targetName:name, reason });
  }
}

function _randomWisdom(){
  const pool = [
    '心静则剑明',
    '以柔克刚，以退为进',
    '知己知彼，百战不殆',
    '无招胜有招',
    '武道之极，在于无我',
    '剑在人在，剑亡人亡',
    '行云流水，自然而然',
    '一力降十会',
    '以意御气，以气御剑',
    '不求胜人，但求胜己',
  ];
  return pick(pool);
}

/* ── 样式注入 ──────────────────────────────────────────────── */

function _injectStyles(){
  if(document.getElementById('ma-styles')) return;
  const style = document.createElement('style');
  style.id = 'ma-styles';
  style.textContent = `
    .ma-panel { max-width:600px; margin:0 auto; padding:12px; }
    .ma-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid #3a3a4a; }
    .ma-header h3 { margin:0; color:#f0c060; font-size:18px; }
    .ma-count { color:#888; font-size:13px; }

    .ma-section { margin-bottom:16px; }
    .ma-section-title { font-size:15px; font-weight:bold; color:#c0c0c0; margin-bottom:8px; padding-left:4px;
      border-left:3px solid #f0c060; }
    .ma-section-closed { opacity:0.6; }
    .ma-empty { color:#666; font-style:italic; font-size:13px; padding:8px 4px; }

    .ma-card { background:#1e1e2e; border:1px solid #2a2a3a; border-radius:8px; padding:10px 12px; margin-bottom:8px;
      transition:border-color .2s; }
    .ma-card:hover { border-color:#f0c060; }
    .ma-card-header { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
    .ma-name { color:#e0e0e0; font-weight:bold; font-size:15px; }
    .ma-title { color:#a0a0a0; font-size:12px; }
    .ma-sect { color:#f0c060; font-size:12px; }
    .ma-level { color:#80d0ff; font-size:12px; }
    .ma-card-info { color:#888; font-size:12px; margin:4px 0 6px; }
    .ma-card-actions { display:flex; gap:6px; flex-wrap:wrap; }

    .ma-btn { background:#2a2a3a; border:1px solid #3a3a4a; color:#c0c0c0; padding:4px 10px; border-radius:4px;
      cursor:pointer; font-size:13px; transition:all .15s; }
    .ma-btn:hover:not(:disabled) { background:#3a3a4a; border-color:#f0c060; color:#fff; }
    .ma-btn:disabled { opacity:0.4; cursor:not-allowed; }
    .ma-btn-break { color:#e05050; border-color:#5a2a2a; }
    .ma-btn-break:hover:not(:disabled) { background:#4a1a1a; border-color:#e05050; }
    .ma-btn-grad { color:#f0c060; border-color:#4a3a1a; }
    .ma-btn-grad:hover:not(:disabled) { background:#3a2a0a; border-color:#f0c060; }

    .ma-list { padding-left:8px; }
    .ma-list-item { color:#888; font-size:13px; padding:2px 0; }
    .ma-status-grad { color:#f0c060; font-size:12px; font-style:italic; }

    .ma-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center;
      justify-content:center; z-index:10000; animation:maFadeIn .2s; }
    .ma-dialog { background:#1a1a2e; border:1px solid #3a3a4a; border-radius:12px; padding:20px;
      max-width:420px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,0.5); }
    .ma-dialog-confirm { max-width:380px; }
    .ma-dialog-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
    .ma-dialog-icon { font-size:24px; }
    .ma-dialog-title { color:#f0c060; font-size:17px; font-weight:bold; }
    .ma-dialog-body { margin-bottom:16px; }
    .ma-narrative { color:#d0d0d0; font-size:14px; line-height:1.7; }
    .ma-reward { color:#80d080; font-size:14px; margin-top:8px; font-weight:bold; }
    .ma-dialog-close { display:block; width:100%; background:#f0c060; color:#1a1a2e; border:none; padding:8px;
      border-radius:6px; cursor:pointer; font-size:14px; font-weight:bold; transition:background .15s; }
    .ma-dialog-close:hover { background:#ffd080; }
    .ma-dialog-actions { display:flex; gap:8px; }
    .ma-dialog-actions .ma-btn-cancel { flex:1; padding:8px; text-align:center; }
    .ma-dialog-actions .ma-btn-confirm { flex:1; padding:8px; text-align:center; background:#f0c060; color:#1a1a2e;
      border-color:#f0c060; font-weight:bold; }
    .ma-dialog-actions .ma-btn-confirm:hover { background:#ffd080; }

    @keyframes maFadeIn { from{opacity:0} to{opacity:1} }
  `;
  document.head.appendChild(style);
}

/* ── 初始化 ──────────────────────────────────────────────────── */

function init(){
  maLoad();
  _injectStyles();
}

// 自动初始化
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ── 暴露全局接口 ──────────────────────────────────────────── */
window.MA = {
  // 状态查询
  getMasters     : () => _st.masters.filter(m => m.status === MA_STATUS.ACTIVE),
  getApprentices : () => _st.apprentices.filter(a => a.status === MA_STATUS.ACTIVE),
  getGraduated   : () => _st.gradLog,
  isActiveMaster : (npcId) => _st.masters.some(m => m.npcId === npcId && m.status === MA_STATUS.ACTIVE),
  isActiveApprentice: (npcId) => _st.apprentices.some(a => a.npcId === npcId && a.status === MA_STATUS.ACTIVE),

  // 检查
  canBecomeApprentice,
  canTakeApprentice,
  canGraduate,

  // 执行
  doBecomeApprentice,
  doTakeApprentice,
  doGraduate,
  breakBond,

  // 日常
  dailyTeach,

  // 加成
  getMasterApprenticeBonus,

  // UI
  renderPanel,
  renderNpcActions,

  // 确认弹窗
  confirmBecomeApprentice,
  confirmTakeApprentice,
  confirmGraduate,
  confirmBreak,

  // 存储
  reload: maLoad,
};

})();
