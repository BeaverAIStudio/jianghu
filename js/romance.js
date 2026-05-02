/* ================================================================
 *  romance.js  —  情缘系统（独立模块）
 *  ──────────────────────────────────────────────────────────────────
 *  核心规则：
 *    · 玩家可与 JIANGHU_NPC_DB 中异性具名NPC发展情缘
 *    · 告白条件：好感≥75 + 专属事件完成 + 未有其他情缘
 *    · 情缘阶段：倾心 → 伴侣 → 白首（3阶段）
 *    · 每日互动：赠花/对饮/赏月/比武/琴棋（好感+亲密度）
 *    · 情缘加成：战斗属性、特殊招式、剧情触发
 *    · 分手：好感跌破30自动触发，或主动分手
 *  存储键：localStorage 'romance_state'
 *  全局入口：window.ROM = { ... }
 * ================================================================ */
;(function(){
'use strict';

/* ── 常量 ──────────────────────────────────────────────────────── */
const ROM_KEY = 'romance_state';

const ROM_STAGE = {
  CRUSH   : 'crush',    // 倾心（告白成功后）
  LOVER   : 'lover',    // 伴侣（亲密度≥50）
  SOULMATE: 'soulmate', // 白首（亲密度≥100 + 好感≥95 + 完成专属剧情）
};

const ROM_STATUS = {
  ACTIVE  : 'active',
  BROKEN  : 'broken',   // 分手
};

/* 情缘阶段名称 */
const ROM_STAGE_LABEL = {
  crush   : '💕 倾心',
  lover   : '❤️ 伴侣',
  soulmate: '💍 白首',
};

/* ── 情缘"将将胡"特殊事件池 ──────────────────────────────────── */
const ROM_JIANGHU_EVENTS = {
  loveAtFirstSight: {
    id: 'loveAtFirstSight',
    chance: 0.05,
    icon: '💘',
    title: '一见钟情',
    desc: '四目相对的瞬间，仿佛前世相识……',
    effect: (baseChance) => ({ chance: Math.min(baseChance + 0.3, 0.98), msg: '💘 一见钟情！成功率大幅提升！' }),
  },
  harmony: {
    id: 'harmony',
    chance: 0.04,
    icon: '🎭',
    title: '情投意合',
    desc: '今日互动，心有灵犀，默契十足……',
    effect: (gain, intGain) => ({ gain: gain * 2, intGain: intGain * 2, msg: '🎭 情投意合！互动效果翻倍！' }),
  },
  misunderstandingResolved: {
    id: 'misunderstandingResolved',
    chance: 0.03,
    icon: '🌈',
    title: '误会冰释',
    desc: '曾经的隔阂在这一刻烟消云散……',
    effect: () => ({ relBonus: 15, msg: '🌈 误会冰释！好感大幅提升！' }),
  },
  loveToken: {
    id: 'loveToken',
    chance: 0.02,
    icon: '🎁',
    title: '定情信物',
    desc: 'TA将一件珍贵之物赠与你，作为定情之物……',
    effect: () => ({ item: { id: 'item_love_token', name: '定情信物', desc: '承载深情厚意的珍贵之物' }, msg: '🎁 获得定情信物！' }),
  },
};

/* 每日互动池 */
const ROM_DAILY_ACTIONS = {
  give_flower: {
    label: '🌹 赠花', gain: 3, intGain: 5,
    narr: [
      '${name}接过花，嘴角微微上扬。',
      '花瓣飘落在${name}肩头，TA低头一笑。',
      '"这花……倒是别致。"${name}轻声说道。',
    ],
  },
  drink: {
    label: '🍶 对饮', gain: 4, intGain: 4,
    narr: [
      '两人对坐饮酒，${name}面色微红，话多了起来。',
      '"再饮一杯。"${name}举杯，眼神比平时温柔了几分。',
      '月下对饮，${name}轻声说起了一段往事。',
    ],
  },
  moonwatch: {
    label: '🌙 赏月', gain: 5, intGain: 8,
    narr: [
      '月光洒在${name}脸上，TA望着远方出神。',
      '"你看那月，像不像……"${name}欲言又止。',
      '两人并肩而坐，月光无声，胜过千言万语。',
    ],
  },
  spar: {
    label: '⚔️ 切磋', gain: 3, intGain: 3,
    narr: [
      '切磋数招，${name}收势而立："你的功力又精进了。"',
      '"来吧！"${name}眼中闪过一丝兴奋，剑如飞虹。',
      '一番较量后，${name}递来一杯茶："承让。"',
    ],
  },
  music: {
    label: '🎵 琴棋', gain: 4, intGain: 6,
    narr: [
      '${name}抚琴一曲，余音袅袅，让人心旷神怡。',
      '两人对弈，${name}落子如飞，却有意让你半子。',
      '"这一手妙啊。"${name}笑道，眼中满是欣赏。',
    ],
  },
  walk: {
    label: '🌿 携手游', gain: 4, intGain: 6,
    narr: [
      '两人并肩走在山间小路，清风拂面。',
      '${name}指着一朵野花："你看，像不像你？"',
      '走了许久，${name}忽然停下，回头看你。',
    ],
  },
  cook: {
    label: '🍲 下厨', gain: 3, intGain: 5,
    narr: [
      '你亲手做了一道菜，${name}尝了一口，微微点头。',
      '"味道不错。"${name}说得很平淡，但碗已见底。',
      '厨房烟火气里，两人相视而笑。',
    ],
  },
};

/* 告白叙事池 */
const ROM_CONFESSION = {
  success: [
    '${name}沉默良久，终于轻声道："好……从今以后，我便是你的人了。"',
    '${name}抬起头，眼中泛着微光："我不善言辞……但，我愿与你同行江湖。"',
    '"你知道吗……"${name}的声音低了下去，"其实，我等你这句话很久了。"',
    '${name}转过身去，肩膀微微颤抖——你在她身后轻轻握住了她的手。',
  ],
  fail: [
    '${name}摇了摇头："我……还不能。给我些时间。"',
    '"别……"${name}退了一步，"我们还是做朋友吧。"',
    '${name}低下头，避开你的目光："你是个好人，但……"',
  ],
  reject_sect: [
    '${name}面色复杂："正邪不两立……你我之间，终究隔着太多。"',
    '"身份之别，你当知我难处。"${name}转过身去，声音有些沙哑。',
  ],
  break_narr: [
    '${name}深吸一口气："也许……我们不该再继续了。"',
    '"罢了。"${name}松开了你的手，"江湖路远，各自珍重。"',
    '雨从天降，${name}转身走入雨中，没有回头。',
  ],
};

/* ── 状态 ──────────────────────────────────────────────────────── */
let _st = {
  partners    : [],  // [{npcId, name, title, sect, avatar, date, status, stage, intimacy}]
  confLog     : [],  // [{npcId, action, date}] 告白/分手日志
  dailyInteract: {}, // { 'npcId_action': date }
  storyDone   : {},  // { npcId: { key: true }} 专属剧情完成标记
  milestones  : [],  // 里程碑记录
};

/* ── 存档 ──────────────────────────────────────────────────────── */
function _romLoad(){
  try{
    const raw = localStorage.getItem(ROM_KEY);
    if(raw) _st = JSON.parse(raw);
  } catch(e){ console.warn('[ROM] load err', e); }
  if(!_st || !_st.partners) _st = {
    partners:[], confLog:[], dailyInteract:{}, storyDone:{}, milestones:[]
  };
}

function _romSave(){
  try{ localStorage.setItem(ROM_KEY, JSON.stringify(_st)); }
  catch(e){ console.warn('[ROM] save err', e); }
}

/* ── 工具 ──────────────────────────────────────────────────────── */
function _getToday(){ return new Date().toISOString().slice(0,10); }

function _toast(msg, type){
  if(typeof townToast === 'function') townToast(msg);
  else if(typeof showToast === 'function') showToast(msg, type);
  else console.log('[ROM]', msg);
}

function _pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

function _fillTpl(tpl, vars){
  return tpl.replace(/\$\{(\w+)\}/g, (_, k) => vars[k] || '');
}

function _getNpc(npcId){
  if(typeof JIANGHU_NPC_DB !== 'undefined' && JIANGHU_NPC_DB[npcId])
    return JIANGHU_NPC_DB[npcId];
  return null;
}

function _getPlayerGender(){
  if(typeof edS !== 'undefined'){
    // editor state
    if(edS.origin && edS.origin.gender) return edS.origin.gender;
    const saved = localStorage.getItem('wuxia_origin_data');
    if(saved){
      try{
        const o = JSON.parse(saved);
        if(o.gender) return o.gender;
      } catch(e){}
    }
  }
  return null;
}

function _getRel(npcId){
  if(typeof jhGetRel === 'function') return jhGetRel(npcId);
  return null;
}

function _getRelVal(npcId){
  const r = _getRel(npcId);
  return r ? (r.val || 0) : 0;
}

function _getActivePartner(npcId){
  return _st.partners.find(p => p.npcId === npcId && p.status === ROM_STATUS.ACTIVE) || null;
}

function _getActiveCount(){
  return _st.partners.filter(p => p.status === ROM_STATUS.ACTIVE).length;
}

function _getActivePartners(){
  return _st.partners.filter(p => p.status === ROM_STATUS.ACTIVE);
}

function _usedToday(key){
  return _st.dailyInteract[key] === _getToday();
}

/* ════════════════════════════════════════════════════════════════
 *  核心API
 * ════════════════════════════════════════════════════════════════ */

/** 检查能否向NPC告白 */
function romCanConfess(npcId){
  const npc = _getNpc(npcId);
  if(!npc) return { ok:false, msg:'此人不在江湖中。' };

  // 必须是异性
  const pg = _getPlayerGender();
  if(!pg) return { ok:false, msg:'你尚未设定出身，无法发展情缘。' };
  if(npc.gender === pg) return { ok:false, msg:'情缘需异性方可。' };

  // 好感门槛
  const rel = _getRelVal(npcId);
  if(rel < 75) return { ok:false, msg:`好感不足（需≥75，当前${rel}）。` };

  // 已有情缘
  if(_getActivePartner(npcId)) return { ok:false, msg:`你与${npc.name}已有情缘。` };

  // 正邪阵营冲突（但冷月纱等特殊NPC可以突破）
  if(npc.align && typeof edS !== 'undefined' && edS.align){
    if((npc.align === 'evil' && edS.align === 'good') ||
       (npc.align === 'good' && edS.align === 'evil')){
      // 冷月纱等特殊NPC可以无视阵营（好感≥85时）
      if(rel >= 85 && (npcId === 'npc_leng_yuesha' || npcId === 'npc_bai_luochen')){
        // 可以突破
      } else {
        return { ok:false, msg:'正邪殊途……除非好感极高或有特殊机缘。' };
      }
    }
  }

  return { ok:true };
}

/** 检查并触发情缘"将将胡"事件 */
function _checkRomJianghuEvent(eventType, ...args){
  const evt = ROM_JIANGHU_EVENTS[eventType];
  if(!evt) return null;
  if(Math.random() < evt.chance){
    return { ...evt, result: evt.effect(...args) };
  }
  return null;
}

/** 执行告白 */
function romConfess(npcId){
  const check = romCanConfess(npcId);
  if(!check.ok){
    _toast(check.msg, 'err');
    return false;
  }

  const npc = _getNpc(npcId);
  const rel = _getRelVal(npcId);

  // 成功率：好感75→40%，80→55%，85→70%，90→85%，95→95%
  let chance = 0.4 + (rel - 75) * 0.11;
  chance = Math.min(chance, 0.95);

  // 冷月纱特殊加成：完成过她的专属任务 chain_success
  if(npcId === 'npc_leng_yuesha' && _st.storyDone['npc_leng_yuesha_ice_skill']){
    chance = Math.min(chance + 0.2, 0.98);
  }

  // 【将将胡】检查"一见钟情"事件
  let jianghuEvent = _checkRomJianghuEvent('loveAtFirstSight', chance);
  if(jianghuEvent){
    chance = jianghuEvent.result.chance;
  }

  const success = Math.random() < chance;

  if(success){
    _st.partners.push({
      npcId,
      name  : npc.name,
      title : npc.title || '',
      sect  : npc.sect || '',
      avatar: npc.avatar || '',
      align : npc.align || 'neutral',
      date  : _getToday(),
      status: ROM_STATUS.ACTIVE,
      stage : ROM_STAGE.CRUSH,
      intimacy: 0,
    });
    _st.confLog.push({ npcId, action:'confess', date:_getToday(), result:'success' });
    _romSave();

    // 同步江湖关系
    if(typeof jhGetRel === 'function' && typeof REL_TYPE !== 'undefined'){
      const r = _getRel(npcId);
      if(r){
        r.type = REL_TYPE.LOVER;
        if(typeof jhChangeRel === 'function') jhChangeRel(npcId, 5, '情缘缔结');
        else r.val = Math.min(100, r.val + 5);
        if(typeof jianghuSave === 'function') jianghuSave();
      }
    }

    // 声名
    if(typeof jhAddFame === 'function') jhAddFame(80, 15);

    // 恩仇
    if(typeof jhAddGrievance === 'function'){
      jhAddGrievance({ type:'romance', target:npcId, targetName:npc.name,
        reason:`与${npc.name}（${npc.title}）情缘缔结，从此江湖路，并肩行` });
    }

    // 成就检测
    if(typeof achCheck === 'function'){
      try{ achCheck('ach_rom_first_love'); } catch(e){}
      // 冷月纱专属隐藏成就
      if(npcId === 'npc_leng_yuesha'){
        try{ achCheck('ach_rom_lore_yuesha'); } catch(e){}
      }
    }

    const narr = _fillTpl(_pick(ROM_CONFESSION.success), { name: npc.name });
    
    // 【将将胡】显示特殊事件弹窗
    if(jianghuEvent){
      _showRomJianghuModal(jianghuEvent, npc);
    }
    
    _showConfessionModal(npc, narr, true);
    _toast(`💕 情缘缔结！${npc.name}答应了你！`);
    return true;
  } else {
    _st.confLog.push({ npcId, action:'confess', date:_getToday(), result:'fail' });
    _romSave();

    // 失败不扣好感（或轻微扣3点表示尴尬）
    if(typeof jhChangeRel === 'function') jhChangeRel(npcId, -3, '告白失败');

    const narr = _fillTpl(_pick(ROM_CONFESSION.fail), { name: npc.name });
    _showConfessionModal(npc, narr, false);
    _toast(`${npc.name}婉拒了你……`, 'err');
    return false;
  }
}

/** 分手 */
function romBreakup(npcId){
  const p = _getActivePartner(npcId);
  if(!p){ _toast('此人与你并无情缘。', 'err'); return; }

  p.status = ROM_STATUS.BROKEN;
  _st.confLog.push({ npcId, action:'breakup', date:_getToday() });
  _romSave();

  // 同步关系
  if(typeof jhGetRel === 'function'){
    const r = _getRel(npcId);
    if(r){
      r.type = 'stranger';
      if(typeof jhChangeRel === 'function') jhChangeRel(npcId, -30, '情缘破裂');
      else r.val = Math.max(r.val - 30, -50);
      if(typeof jianghuSave === 'function') jianghuSave();
    }
  }

  const narr = _fillTpl(_pick(ROM_CONFESSION.break_narr), { name: p.name });
  _showNarrModal(p.name, narr, '💔 情断');
  _toast(`💔 与${p.name}的情缘已了……`, 'err');
}

/** 获取情缘信息 */
function romGetPartner(npcId){
  return _getActivePartner(npcId);
}

/** 获取所有情缘 */
function romGetAll(){
  return _getActivePartners();
}

/* ── 亲密度与阶段升级 ─────────────────────────────────────────── */

/** 加亲密度 */
function romAddIntimacy(npcId, amount){
  const p = _getActivePartner(npcId);
  if(!p) return;

  p.intimacy = (p.intimacy || 0) + amount;

  // 阶段升级检查
  _checkStageUp(p);
  _romSave();
}

/** 检查阶段升级 */
function _checkStageUp(p){
  const rel = _getRelVal(p.npcId);
  const oldStage = p.stage;

  if(p.intimacy >= 100 && rel >= 95 && _st.storyDone[p.npcId + '_final']){
    p.stage = ROM_STAGE.SOULMATE;
  } else if(p.intimacy >= 50){
    p.stage = ROM_STAGE.LOVER;
  } else {
    p.stage = ROM_STAGE.CRUSH;
  }

  if(p.stage !== oldStage){
    const npc = _getNpc(p.npcId);
    const labels = ROM_STAGE_LABEL;
    const label = labels[p.stage] || p.stage;
    _toast(`${label}！你与${p.name}的关系更进一步！`);

    _st.milestones.push({ npcId:p.npcId, stage:p.stage, date:_getToday() });

    // 阶段升级奖励
    if(p.stage === ROM_STAGE.LOVER){
      // 伴侣：攻击+3，防御+2
      if(typeof jhAddFame === 'function') jhAddFame(100, 20);
      if(typeof achCheck === 'function'){
        try{ achCheck('ach_rom_lover'); } catch(e){}
      }
    }
    if(p.stage === ROM_STAGE.SOULMATE){
      // 白首：全属性+2，声名+200
      if(typeof jhAddFame === 'function') jhAddFame(200, 40);
      if(typeof achCheck === 'function'){
        try{ achCheck('ach_rom_soulmate'); } catch(e){}
      }
    }
  }
}

/* ── 每日互动 ─────────────────────────────────────────────────── */

/** 获取可用互动列表 */
function romGetDailyActions(npcId){
  const p = _getActivePartner(npcId);
  if(!p) return [];

  const today = _getToday();
  return Object.entries(ROM_DAILY_ACTIONS).map(([key, act]) => {
    const fullKey = npcId + '_' + key;
    const used = _st.dailyInteract[fullKey] === today;
    return { ...act, key, used, fullKey };
  });
}

/** 执行每日互动 */
function romDoDaily(npcId, actionKey){
  const p = _getActivePartner(npcId);
  if(!p){ _toast('此人与你并无情缘。', 'err'); return null; }

  const act = ROM_DAILY_ACTIONS[actionKey];
  if(!act){ _toast('未知互动。', 'err'); return null; }

  const fullKey = npcId + '_' + actionKey;
  if(_usedToday(fullKey)){
    _toast('今日已与此人互动过了。', 'err');
    return null;
  }

  // 记录
  _st.dailyInteract[fullKey] = _getToday();

  let gain = act.gain;
  let intGain = act.intGain;
  let jianghuEvent = null;

  // 【将将胡】检查"情投意合"事件
  const harmonyEvt = _checkRomJianghuEvent('harmony', gain, intGain);
  if(harmonyEvt){
    gain = harmonyEvt.result.gain;
    intGain = harmonyEvt.result.intGain;
    jianghuEvent = harmonyEvt;
  }

  // 【将将胡】检查"定情信物"事件（仅在伴侣及以上阶段触发）
  if(p.stage !== ROM_STAGE.CRUSH){
    const tokenEvt = _checkRomJianghuEvent('loveToken');
    if(tokenEvt){
      jianghuEvent = tokenEvt;
      // 添加信物到背包（如果存在背包系统）
      if(typeof addItemToBag === 'function'){
        addItemToBag(tokenEvt.result.item);
      }
    }
  }

  // 加好感+亲密度
  if(typeof jhChangeRel === 'function') jhChangeRel(npcId, gain, actionKey);
  romAddIntimacy(npcId, intGain);

  const narr = _fillTpl(_pick(act.narr), { name: p.name });

  _romSave();

  // 【将将胡】显示特殊事件弹窗
  if(jianghuEvent){
    const npc = _getNpc(npcId);
    _showRomJianghuModal(jianghuEvent, npc);
  }

  return { narr, gain, intGain, jianghuEvent };
}

/* ── 好感暴跌检测（被动分手）─────────────────────────────────── */

/** 在 jhChangeRel 之后调用，检测情缘是否需要降级 */
function romOnRelChange(npcId, newRel){
  const p = _getActivePartner(npcId);
  if(!p) return;

  // 【将将胡】检查"误会冰释"事件（仅在好感下降时可能触发转机）
  if(newRel < _getRelVal(npcId)){
    const resolveEvt = _checkRomJianghuEvent('misunderstandingResolved');
    if(resolveEvt){
      // 触发误会冰释，好感大幅回升
      if(typeof jhChangeRel === 'function'){
        jhChangeRel(npcId, resolveEvt.result.relBonus, '误会冰释');
      }
      const npc = _getNpc(npcId);
      _showRomJianghuModal(resolveEvt, npc);
      _toast(`🌈 与${p.name}的误会冰释，感情更进一步！`);
      return; // 不执行降级检查
    }
  }

  if(newRel < 30){
    // 好感跌破30，强制分手
    _toast(`💔 ${p.name}对你失望透顶，情缘已了……`, 'err');
    romBreakup(npcId);
  } else if(newRel < 50 && p.stage !== ROM_STAGE.CRUSH){
    // 好感跌破50，降级
    p.stage = ROM_STAGE.CRUSH;
    _romSave();
  }
}

/* ── 情缘加成（战斗用）────────────────────────────────────── */

/** 获取情缘战斗加成 */
function romGetBattleBonus(){
  const partners = _getActivePartners();
  if(partners.length === 0) return null;

  let bonus = { atk:0, def:0, spd:0, hp:0, crit:0, expMult:1, desc:'' };

  partners.forEach(p => {
    const intMod = Math.floor((p.intimacy || 0) / 25); // 每25点亲密度+1
    bonus.atk += intMod;
    bonus.def += Math.floor(intMod * 0.7);
    bonus.spd += Math.floor(intMod * 0.5);
    bonus.hp += intMod * 15;

    if(p.stage === ROM_STAGE.SOULMATE){
      bonus.atk += 3;
      bonus.def += 2;
      bonus.spd += 1;
      bonus.hp += 50;
      bonus.crit += 3;  // 白首：暴击+3%
      bonus.expMult += 0.05; // 白首：经验+5%
    } else if(p.stage === ROM_STAGE.LOVER){
      bonus.atk += 1;
      bonus.def += 1;
      bonus.hp += 20;
      bonus.crit += 1;  // 伴侣：暴击+1%
      bonus.expMult += 0.03; // 伴侣：经验+3%
    }
  });

  if(bonus.atk > 0 || bonus.def > 0){
    const parts = [];
    if(bonus.atk) parts.push(`攻+${bonus.atk}`);
    if(bonus.def) parts.push(`防+${bonus.def}`);
    if(bonus.spd) parts.push(`速+${bonus.spd}`);
    if(bonus.hp)  parts.push(`血+${bonus.hp}`);
    if(bonus.crit) parts.push(`暴击+${bonus.crit}%`);
    bonus.desc = '💕情缘加成：' + parts.join(' ');
  }

  return bonus.desc ? bonus : null;
}

/* ── 冷月纱特殊情缘 ─────────────────────────────────────────── */

/** 标记冷月纱学冰魄心法（情缘前置） */
function romMarkIceSkill(npcId){
  _st.storyDone['npc_leng_yuesha_ice_skill'] = true;
  _romSave();
}

/** 检查冷月纱情缘前置是否完成 */
function romHasIceSkillPre(){
  return !!_st.storyDone['npc_leng_yuesha_ice_skill'];
}

/* ── NPC对话面板渲染 ─────────────────────────────────────────── */

/** 渲染NPC面板中的情缘按钮 */
function romRenderNpcActions(npcId){
  const npc = _getNpc(npcId);
  if(!npc) return '';

  // 不是异性NPC就不显示
  const pg = _getPlayerGender();
  if(!pg || npc.gender === pg) return '';

  const rel = _getRelVal(npcId);
  const p = _getActivePartner(npcId);
  let html = '';

  if(p){
    // 已有情缘 —— 显示每日互动
    const actions = romGetDailyActions(npcId);
    if(actions.length > 0){
      html += `<div style="color:#ff6b9d;font-size:11px;text-align:center;margin-bottom:4px">${ROM_STAGE_LABEL[p.stage]} 亲密度：${p.intimacy || 0}</div>`;
      html += actions.map(a => {
        if(a.used){
          return `<button class="npc-rel-action" disabled style="opacity:.4;cursor:not-allowed; border:1px solid rgba(255,107,157,.3)">${a.label} <span style="color:#888;font-size:10px">（今日已用）</span></button>`;
        }
        return `<button class="npc-rel-action" style="border:1px solid rgba(255,107,157,.3)" onclick="ROM.doDaily('${npcId}','${a.key}')">${a.label} <span style="color:#ff6b9d;font-size:10px">(+${a.gain}好 +${a.intGain}亲)</span></button>`;
      }).join('');
      html += `<button class="npc-rel-action" style="color:#c06060;border:1px solid rgba(255,96,96,.2)" onclick="if(confirm('确定要与${p.name}分手吗？此操作不可撤销。'))ROM.breakup('${npcId}')">💔 分手</button>`;
    }
  } else if(rel >= 60){
    // 好感够高，显示告白按钮
    const check = romCanConfess(npcId);
    if(check.ok){
      let extraTip = '';
      if(npcId === 'npc_leng_yuesha' && !_st.storyDone['npc_leng_yuesha_ice_skill']){
        extraTip = ' <span style="color:#a0c0ff;font-size:10px">（学习冰魄心法可大幅提升成功率）</span>';
      }
      html += `<div style="margin-top:4px;text-align:center"><button class="npc-rel-action" style="border:1px solid rgba(255,107,157,.4);color:#ff6b9d" onclick="ROM.confess('${npcId}')">💕 告白${extraTip}</button></div>`;
    } else {
      html += `<div style="margin-top:4px;text-align:center;color:#a88;font-size:10px">💕 ${check.msg}</div>`;
    }
  }

  return html;
}

/* ── 情缘录面板 ──────────────────────────────────────────────── */

function romShowPanel(){
  const partners = _getActivePartners();
  const broken = _st.partners.filter(p => p.status === ROM_STATUS.BROKEN);

  let html = `<div style="background:rgba(20,10,25,.95);color:#e0d0e8;border:1px solid rgba(255,107,157,.25);border-radius:12px;padding:16px;max-width:420px;margin:auto;font-size:13px;max-height:80vh;overflow-y:auto">`;

  // 标题
  html += `<div style="text-align:center;font-size:16px;color:#ff6b9d;margin-bottom:12px">💕 情缘录</div>`;

  if(partners.length === 0){
    html += `<div style="text-align:center;color:#807080;padding:20px 0">尚无情缘。与江湖中异性NPC好感≥75后可告白。</div>`;
  } else {
    partners.forEach(p => {
      const npc = _getNpc(p.npcId);
      const rel = _getRelVal(p.npcId);
      const stageLabel = ROM_STAGE_LABEL[p.stage] || p.stage;
      const intNext = p.stage === ROM_STAGE.CRUSH ? 50 : (p.stage === ROM_STAGE.LOVER ? 100 : 'MAX');
      const stageDesc = p.stage === ROM_STAGE.CRUSH
        ? `亲密度达到${intNext}升级为伴侣`
        : p.stage === ROM_STAGE.LOVER
        ? `亲密度达到${intNext} + 好感≥95 + 完成专属剧情升级为白首`
        : '已达最高阶段';

      html += `<div style="margin-bottom:12px;padding:10px;border:1px solid rgba(255,107,157,.2);border-radius:8px;background:rgba(255,107,157,.05)">`;
      html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">`;
      html += `<span style="font-size:20px">${npc ? npc.avatar : '❓'}</span>`;
      html += `<div><div style="color:#ff6b9d;font-weight:600">${p.name}</div>`;
      html += `<div style="font-size:11px;color:#a090a8">${p.title}${p.sect ? ' · ' + p.sect : ''}</div></div>`;
      html += `<div style="margin-left:auto;font-size:12px">${stageLabel}</div>`;
      html += `</div>`;
      html += `<div style="font-size:11px;color:#c0b0c8">好感：${rel} · 亲密度：${p.intimacy || 0}/${intNext}</div>`;
      html += `<div style="font-size:10px;color:#807090;margin-top:2px">❧ ${stageDesc}</div>`;
      html += `</div>`;
    });
  }

  // 分手记录
  if(broken.length > 0){
    html += `<div style="margin-top:12px;border-top:1px solid rgba(255,107,157,.1);padding-top:8px">`;
    html += `<div style="font-size:11px;color:#806070;margin-bottom:4px">💔 已了情缘</div>`;
    broken.forEach(p => {
      html += `<div style="font-size:11px;color:#908090">${p.name}（${p.date}）</div>`;
    });
    html += `</div>`;
  }

  // 情缘须知
  html += `<div style="margin-top:12px;border-top:1px solid rgba(255,107,157,.1);padding-top:8px;font-size:10px;color:#706080">`;
  html += `· 只能与异性具名江湖NPC发展情缘<br>`;
  html += `· 告白需好感≥75（正邪NPC需≥85或完成特殊剧情）<br>`;
  html += `· 好感跌破30自动分手，每日互动加深亲密度<br>`;
  html += `· 情缘阶段：倾心 → 伴侣（亲密度≥50）→ 白首（亲密度≥100）`;
  html += `</div>`;

  html += `<div style="text-align:center;margin-top:12px"><button class="npc-rel-action" onclick="this.closest('.npc-dialog-overlay,.rom-overlay')?.remove()">关闭</button></div>`;
  html += `</div>`;

  // 使用通用弹窗
  const overlay = document.createElement('div');
  overlay.className = 'npc-dialog-overlay rom-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);animation:fadeIn .3s';
  overlay.innerHTML = html;
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ── 弹窗 ──────────────────────────────────────────────────────── */

function _showConfessionModal(npc, narr, success){
  const title = success ? '💕 倾心相许' : '🌧️ 婉言相拒';
  const titleColor = success ? '#ff6b9d' : '#a090a0';
  const html = `
    <div style="background:rgba(20,10,25,.96);color:#e0d0e8;border:1px solid rgba(255,107,157,.3);border-radius:12px;padding:20px;max-width:380px;margin:auto;text-align:center">
      <div style="font-size:32px;margin-bottom:8px">${npc.avatar || '💕'}</div>
      <div style="font-size:16px;color:${titleColor};font-weight:600;margin-bottom:12px">${title}</div>
      <div style="font-size:12px;color:#c0b0c8;margin-bottom:4px">${npc.name}（${npc.title}）</div>
      <div style="font-size:13px;color:#d0c0d8;margin:12px 0;line-height:1.6;font-style:italic">${narr}</div>
      <button class="npc-rel-action" onclick="this.closest('.npc-dialog-overlay,.rom-overlay')?.remove()">继续</button>
    </div>`;
  _showModal(html);
}

function _showNarrModal(name, narr, title){
  const html = `
    <div style="background:rgba(20,10,25,.96);color:#e0d0e8;border:1px solid rgba(255,107,157,.2);border-radius:12px;padding:20px;max-width:380px;margin:auto;text-align:center">
      <div style="font-size:16px;color:#c06060;font-weight:600;margin-bottom:12px">${title}</div>
      <div style="font-size:12px;color:#c0b0c8;margin-bottom:4px">${name}</div>
      <div style="font-size:13px;color:#d0c0d8;margin:12px 0;line-height:1.6;font-style:italic">${narr}</div>
      <button class="npc-rel-action" onclick="this.closest('.npc-dialog-overlay,.rom-overlay')?.remove()">继续</button>
    </div>`;
  _showModal(html);
}

/** 【将将胡】显示情缘特殊事件弹窗 */
function _showRomJianghuModal(evt, npc){
  const html = `
    <div style="background:rgba(40,10,30,.96);color:#e0d0e8;border:2px solid rgba(255,107,157,.6);border-radius:12px;padding:20px;max-width:380px;margin:auto;text-align:center;box-shadow:0 0 30px rgba(255,107,157,.3)">
      <div style="font-size:14px;color:#ff6b9d;margin-bottom:8px">✨ 将将胡 · 情缘奇遇 ✨</div>
      <div style="font-size:36px;margin-bottom:8px">${evt.icon}</div>
      <div style="font-size:18px;color:#ff8ab0;font-weight:600;margin-bottom:8px">${evt.title}</div>
      <div style="font-size:12px;color:#c0b0c8;margin-bottom:4px">${npc.name}（${npc.title}）</div>
      <div style="font-size:13px;color:#d0c0d8;margin:12px 0;line-height:1.6;font-style:italic">${evt.desc}</div>
      ${evt.result && evt.result.msg ? `<div style="font-size:12px;color:#ffd700;margin-top:8px;padding:6px;background:rgba(255,215,0,.1);border-radius:6px">${evt.result.msg}</div>` : ''}
      <button class="npc-rel-action" style="margin-top:12px;border-color:rgba(255,107,157,.5)" onclick="this.closest('.npc-dialog-overlay,.rom-overlay')?.remove()">铭记此刻</button>
    </div>`;
  _showModal(html);
}

function _showModal(innerHtml){
  const overlay = document.createElement('div');
  overlay.className = 'npc-dialog-overlay rom-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9600;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);animation:fadeIn .3s';
  overlay.innerHTML = innerHtml;
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ── 每日重置检查 ─────────────────────────────────────────────── */
function romOnNewDay(){
  // 清理过期的每日互动记录（保留今天的）
  const today = _getToday();
  Object.keys(_st.dailyInteract).forEach(k => {
    if(_st.dailyInteract[k] !== today) delete _st.dailyInteract[k];
  });
  _romSave();
}

/* ── 初始化 ──────────────────────────────────────────────────────── */
_romLoad();
romOnNewDay();

/* ════════════════════════════════════════════════════════════════
 *  全局导出
 * ════════════════════════════════════════════════════════════════ */
window.ROM = {
  canConfess  : romCanConfess,
  confess     : romConfess,
  breakup     : romBreakup,
  getPartner  : romGetPartner,
  getAll      : romGetAll,
  getDaily    : romGetDailyActions,
  doDaily     : romDoDaily,
  onRelChange : romOnRelChange,
  getBattleBonus: romGetBattleBonus,
  renderNpcActions: romRenderNpcActions,
  showPanel   : romShowPanel,
  markIceSkill: romMarkIceSkill,
  hasIceSkill : romHasIceSkillPre,
  _st         : () => _st, // 调试用
};

// 自动注入 CSS
;(function _romInjectStyles(){
  const s = document.createElement('style');
  s.textContent = `
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .rom-overlay .npc-rel-action {
      background: rgba(255,107,157,.08);
      border: 1px solid rgba(255,107,157,.25);
      color: #e0c0d0;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      margin: 3px;
      transition: all .2s;
    }
    .rom-overlay .npc-rel-action:hover {
      background: rgba(255,107,157,.15);
      border-color: rgba(255,107,157,.4);
    }
  `;
  document.head.appendChild(s);
})();

})();
