/* ================================================================
 *  sworn-brother.js  —  结拜系统（独立于门派）
 *  存储键：localStorage('sworn_state')
 *  最多 3 位义兄弟/义姐妹
 * ================================================================ */

// ── 状态 ──
const SWORN_MAX    = 3;
const SWORN_KEY    = 'sworn_state';
const SWORN_STATUS = { ACTIVE: 'active', BROKEN: 'broken' };

let _ss = null; // sworn state

// ── 存档 ──
function swornLoad(){
  try{
    const raw = localStorage.getItem(SWORN_KEY);
    if(raw) _ss = JSON.parse(raw);
  } catch(e){ console.warn('[SWORN] load err', e); }
  if(!_ss || !_ss.brothers) _ss = { brothers:[], oathLog:[], dailyBond:{} };
}

function swornSave(){
  try{ localStorage.setItem(SWORN_KEY, JSON.stringify(_ss)); }
  catch(e){ console.warn('[SWORN] save err', e); }
}

// ── 工具 ──
function getToday(){ return new Date().toISOString().slice(0,10); }

function _toast(msg, type){
  if(typeof townToast === 'function') townToast(msg);
  else if(typeof showToast === 'function') showToast(msg, type);
  else console.log('[SWORN]', msg);
}

/** 获取NPC信息（兼容城镇NPC + 江湖NPC） */
function getNpcInfo(npcId){
  if(typeof NPC_DB !== 'undefined' && NPC_DB[npcId]){
    return NPC_DB[npcId];
  }
  if(typeof JIANGHU_NPC_DB !== 'undefined' && JIANGHU_NPC_DB[npcId]){
    return JIANGHU_NPC_DB[npcId];
  }
  return null;
}

/** 获取NPC好感（兼容两套系统） */
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

/** 获取玩家等级 */
function getPlayerLevel(){
  if(typeof edS !== 'undefined') return edS.level || 1;
  return 1;
}

// 初始化
swornLoad();

/* ================================================================
 *  核心API
 * ================================================================ */

/** 检查能否结拜 */
function swornCanBond(npcId){
  const npc = getNpcInfo(npcId);
  if(!npc) return { ok:false, msg:'此人不在江湖中。' };

  const rel = getNpcRelVal(npcId);
  if(rel < 65) return { ok:false, msg:`好感不足（需≥65，当前${rel}）。` };

  const activeCount = _ss.brothers.filter(b => b.status === SWORN_STATUS.ACTIVE).length;
  if(activeCount >= SWORN_MAX) return { ok:false, msg:`已有${activeCount}位义兄弟/姐妹，最多${SWORN_MAX}位。` };

  const existing = _ss.brothers.find(b => b.npcId === npcId && b.status === SWORN_STATUS.ACTIVE);
  if(existing) return { ok:false, msg:`你与${npc.name}已是结拜兄弟/姐妹。` };

  // 检查品行冲突（邪道+正道不能结拜）
  if(npc.align && typeof edS !== 'undefined' && edS.align){
    if((npc.align === 'evil' && edS.align === 'good') ||
       (npc.align === 'good' && edS.align === 'evil')){
      return { ok:false, msg:'正邪不两立，无法结拜。' };
    }
  }

  return { ok:true };
}

/** 执行结拜 */
function swornBond(npcId){
  const check = swornCanBond(npcId);
  if(!check.ok){ _toast(check.msg, 'err'); return false; }

  const npc = getNpcInfo(npcId);
  const isJianghu = !!(typeof JIANGHU_NPC_DB !== 'undefined' && JIANGHU_NPC_DB[npcId]);

  _ss.brothers.push({
    npcId,
    name  : npc.name,
    title : npc.title || '',
    sect  : npc.sect || '',
    align : npc.align || 'neutral',
    source: isJianghu ? 'jianghu' : 'town',
    date  : getToday(),
    status: SWORN_STATUS.ACTIVE,
    bondLevel: 1,  // 结义等级，影响加成
  });
  swornSave();

  // 同步江湖NPC关系类型
  if(isJianghu && typeof jhGetRel === 'function'){
    const rel = jhGetRel(npcId);
    if(rel){
      rel.type = (typeof REL_TYPE !== 'undefined') ? REL_TYPE.BROTHER : 'brother';
      rel.val = Math.max(rel.val, 80);
      if(typeof jianghuSave === 'function') jianghuSave();
    }
    // 声名奖励
    if(typeof jhAddFame === 'function') jhAddFame(50, 10);
    // 恩仇
    if(typeof jhAddGrievance === 'function'){
      jhAddGrievance({ type:'bond', target:npcId, targetName:npc.name,
        reason:`与${npc.name}（${npc.title}）义结金兰，生死与共` });
    }
  }

  // 同步城镇NPC关系
  if(!isJianghu && typeof setNpcRel === 'function'){
    setNpcRel(npcId, Math.max(getNpcRelVal(npcId), 80), '义结金兰');
  }

  _toast(`🩸 义结金兰！${npc.name}与你歃血为盟，生死与共！`);

  // 弹出金兰谱仪式
  setTimeout(() => swornShowCeremony(npc, npcId), 500);
  return true;
}

/** 断绝结义 */
function swornBreak(npcId){
  const bro = _ss.brothers.find(b => b.npcId === npcId && b.status === SWORN_STATUS.ACTIVE);
  if(!bro){ _toast('此人与你并无结义。', 'err'); return; }

  bro.status = SWORN_STATUS.BROKEN;
  _ss.oathLog.push({ npcId, name:bro.name, action:'broken', date:getToday() });
  swornSave();

  // 同步关系
  if(bro.source === 'jianghu' && typeof jhGetRel === 'function'){
    const rel = jhGetRel(npcId);
    if(rel){
      rel.type = 'stranger';
      rel.val = Math.max(rel.val - 30, -50);
      if(typeof jianghuSave === 'function') jianghuSave();
    }
  }

  _toast(`💔 与${bro.name}的结义已断。恩断义绝。`, 'err');
}

/** 查找结义信息 */
function swornGetBro(npcId){
  return _ss.brothers.find(b => b.npcId === npcId && b.status === SWORN_STATUS.ACTIVE) || null;
}

/** 获取所有活跃结义 */
function swornGetActive(){
  return _ss.brothers.filter(b => b.status === SWORN_STATUS.ACTIVE);
}

/** 是否为结义兄弟 */
function swornIsBrother(npcId){
  return !!_ss.brothers.find(b => b.npcId === npcId && b.status === SWORN_STATUS.ACTIVE);
}

/* ================================================================
 *  结义加成系统
 * ================================================================ */

/** 获取结义总加成 */
function swornGetBonuses(){
  const bros = swornGetActive();
  let atkBonus = 0, defBonus = 0, expBonus = 0, critBonus = 0;
  bros.forEach(b => {
    const lv = b.bondLevel || 1;
    atkBonus  += Math.floor(lv * 1.5);   // 每级+1.5攻击
    defBonus  += Math.floor(lv * 1.0);   // 每级+1防御
    expBonus  += Math.floor(lv * 0.5);   // 每级+0.5%经验
    critBonus += Math.floor(lv * 0.3);   // 每级+0.3%暴击
  });
  // ── 将将胡：结拜手牌羁绊 ──
  // 每位结拜兄弟+1手牌上限（最多3位=+3）
  const cardLimitBonus = Math.min(bros.length, 3);
  return { atkBonus, defBonus, expBonus, critBonus, count: bros.length, cardLimitBonus };
}

/** 战斗时结义兄弟增援（调用方：battle.js） */
function swornBattleAssist(enemy){
  const bros = swornGetActive();
  if(!bros.length) return null;

  // 30%概率触发增援（每多1位+10%）
  const chance = 30 + (bros.length - 1) * 10;
  if(Math.random() * 100 > chance) return null;

  const helper = bros[Math.floor(Math.random() * bros.length)];
  const dmg = Math.floor(getPlayerLevel() * (1.5 + (helper.bondLevel || 1) * 0.5));
  return {
    name  : helper.name,
    title : helper.title,
    damage: dmg,
    flavor: [
      `「${helper.name}突然杀出，一招${_randomSkill()}命中${enemy}！」`,
      `「${helper.name}从暗处冲出：'兄弟，我来了！'」`,
      `「${helper.name}如影随形，趁隙偷袭${enemy}！伤势+${dmg}」`,
    ][Math.floor(Math.random()*3)],
  };
}

function _randomSkill(){
  const skills = ['凌空一击','侧翼突刺','回旋斩','借力打力','暗影偷袭','并肩作战'];
  return skills[Math.floor(Math.random()*skills.length)];
}

/* ================================================================
 *  每日互动
 * ================================================================ */

/** 与结义兄弟对饮/切磋 */
function swornDailyBond(npcId){
  const bro = swornGetBro(npcId);
  if(!bro){ _toast('此人不是你的结义兄弟。', 'err'); return; }

  const today = getToday();
  if(_ss.dailyBond[today] && _ss.dailyBond[today].includes(npcId)){
    _toast('今日已与此人切磋过。', 'err'); return;
  }

  if(!_ss.dailyBond[today]) _ss.dailyBond[today] = [];
  _ss.dailyBond[today].push(npcId);

  // ═══════════════════════════════════════════════════════════════
  //  结拜"将将胡"系统 - 特殊事件检查
  // ═══════════════════════════════════════════════════════════════
  let specialEvent = null;
  for (const [key, event] of Object.entries(SWORN_JIANGHU_EVENTS)) {
    if (Math.random() < event.chance) {
      specialEvent = event;
      break;
    }
  }

  // 随机事件
  const roll = Math.random();
  let result = '';
  let baseValue = 0;

  if(roll < 0.3){
    // 对饮 → 恢复气血
    baseValue = Math.floor(getPlayerLevel() * 3);
    if(typeof edS !== 'undefined') edS.hp = Math.min((edS.maxHp||200), (edS.hp||0) + baseValue);
    result = `🍶 与${bro.name}对饮三杯，气血恢复${baseValue}。`;
  } else if(roll < 0.6){
    // 切磋 → 经验
    baseValue = Math.floor(20 + getPlayerLevel() * 2);
    if(typeof addPlayerExp === 'function') addPlayerExp(baseValue, '兄弟切磋');
    else if(typeof edS !== 'undefined') edS.exp = (edS.exp||0) + baseValue;
    result = `⚔️ 与${bro.name}切磋武艺，获得经验${baseValue}。`;
  } else if(roll < 0.85){
    // 互赠 → 好感+结义等级
    bro.bondLevel = Math.min(10, (bro.bondLevel||1) + 1);
    if(typeof setNpcRel === 'function') setNpcRel(npcId, getNpcRelVal(npcId) + 2, '兄弟互赠');
    else if(typeof jhRelChange === 'function') jhRelChange(npcId, 2, '兄弟互赠');
    result = `🎁 与${bro.name}互赠信物，结义更深（等级${bro.bondLevel}）。`;
  } else {
    // 倾心交谈 → 获取情报
    result = `💬 ${bro.name}与你彻夜长谈，透露了一些江湖秘闻...`;
    // 触发江湖传闻
    if(typeof weAddEvent === 'function'){
      weAddEvent({
        tier: 'common',
        title: `来自${bro.name}的情报`,
        text: `${bro.name}告诉你：${_randomIntel(bro)}`,
        source: `结义兄弟·${bro.name}`,
      });
    }
  }

  // 应用特殊事件效果
  if (specialEvent) {
    const effectResult = specialEvent.effect(baseValue);

    // 效果翻倍
    if (effectResult.value !== baseValue) {
      if (roll < 0.3 && typeof edS !== 'undefined') {
        // 对饮效果翻倍
        const extraHeal = effectResult.value - baseValue;
        edS.hp = Math.min((edS.maxHp||200), (edS.hp||0) + extraHeal);
      } else if (roll < 0.6 && typeof addPlayerExp === 'function') {
        // 经验翻倍
        addPlayerExp(effectResult.value - baseValue, '兄弟同心');
      }
    }

    // 结义等级提升
    if (effectResult.levelUp) {
      bro.bondLevel = Math.min(10, (bro.bondLevel||1) + 1);
    }

    // 战斗buff
    if (effectResult.battleBuff) {
      window._swornBattleBuff = { value: 30, turns: 1 };
    }

    // 银两奖励
    if (effectResult.silver) {
      if (typeof addSilver === 'function') {
        addSilver(effectResult.silver);
      } else if (typeof edS !== 'undefined') {
        edS.silver = (edS.silver || 0) + effectResult.silver;
        if (typeof saveProgress === 'function') saveProgress();
        if (typeof editorSave === 'function') editorSave();
      }
    }

    // 显示特殊事件
    _showSwornJianghuModal(bro, specialEvent, effectResult.msg);
  } else {
    _toast(result);
  }

  swornSave();
  return result;
}

// ═══════════════════════════════════════════════════════════════
//  结拜"将将胡"系统 - 特殊事件弹窗
// ═══════════════════════════════════════════════════════════════
function _showSwornJianghuModal(bro, event, msg){
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML = `
    <div style="background:linear-gradient(180deg,#2a2010,#1a1508);border:2px solid #ff9fc8;border-radius:12px;padding:20px;max-width:360px;width:90%;color:#d4c4a0;font-family:serif;">
      <div style="text-align:center;margin-bottom:15px;">
        <span style="font-size:10px;color:#ff9fc8;border:1px solid #ff9fc8;padding:2px 8px;border-radius:20px;">将将胡</span>
      </div>
      <div style="text-align:center;margin-bottom:15px;">
        <div style="font-size:36px;margin-bottom:8px;">${event.icon}</div>
        <div style="font-size:18px;font-weight:bold;color:#ff9fc8;">${event.title}</div>
        <div style="font-size:12px;color:#a09070;margin-top:5px;">${event.desc}</div>
      </div>
      <div style="background:rgba(255,159,200,.1);border:1px solid rgba(255,159,200,.3);border-radius:8px;padding:12px;margin:15px 0;text-align:center;color:#ff9fc8;font-weight:bold;">
        ${msg}
      </div>
      <div style="text-align:center;color:#888;font-size:11px;margin-bottom:15px;">
        结义兄弟：${bro.name}
      </div>
      <button onclick="this.closest('div').parentElement.remove()" style="width:100%;padding:10px;background:rgba(255,159,200,.2);border:1px solid #ff9fc8;border-radius:6px;color:#ff9fc8;cursor:pointer;font-family:serif;">兄弟情深！</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
}

function _randomIntel(bro){
  const intel = [
    `最近${bro.sect || bro.title}附近出没了不少可疑人物。`,
    '听说西北方向有一座秘境即将开启。',
    '有个叫"铁掌帮"的势力最近在扩张地盘。',
    `我打听到${bro.name}的一个仇家最近在某个城市落脚了。`,
    '集市上出现了一批来路不明的兵器，品质不俗。',
    '最近江湖上有个绝世高手在四处挑战各派弟子。',
  ];
  return intel[Math.floor(Math.random()*intel.length)];
}

// ═══════════════════════════════════════════════════════════════
//  结拜"将将胡"系统 - 特殊结义事件
// ═══════════════════════════════════════════════════════════════
const SWORN_JIANGHU_EVENTS = {
  // 兄弟同心：获得双倍效果
  unity: {
    id: 'unity',
    chance: 0.05, // 5%
    icon: '🤝',
    title: '兄弟同心',
    desc: '你们心意相通，武学交流事半功倍！',
    effect: (baseValue) => ({ value: baseValue * 2, msg: '🤝 兄弟同心！效果翻倍！' }),
  },
  // 义薄云天：结义等级直接提升
  loyalty: {
    id: 'loyalty',
    chance: 0.03, // 3%
    icon: '☁️',
    title: '义薄云天',
    desc: '你们的义气感动了天地，结义更加深厚！',
    effect: (baseValue) => ({ value: baseValue, levelUp: true, msg: '☁️ 义薄云天！结义等级+1！' }),
  },
  // 生死与共：获得特殊战斗加成
  lifeDeath: {
    id: 'lifeDeath',
    chance: 0.02, // 2%
    icon: '⚔️',
    title: '生死与共',
    desc: '你们立下同生共死的誓言，战斗力大增！',
    effect: (baseValue) => ({ value: baseValue, battleBuff: true, msg: '⚔️ 生死与共！下一场战斗攻击力+30%！' }),
  },
  // 江湖救急：兄弟送来急需物资
  rescue: {
    id: 'rescue',
    chance: 0.04, // 4%
    icon: '🆘',
    title: '江湖救急',
    desc: '兄弟得知你近况不佳，特意送来物资！',
    effect: (baseValue) => {
      const silver = 50 + Math.floor(Math.random() * 100);
      return { value: baseValue, silver: silver, msg: `🆘 江湖救急！兄弟送来${silver}两银子！` };
    },
  },
};

/** 清理过期的每日记录 */
function swornCleanDaily(){
  const today = getToday();
  const keys = Object.keys(_ss.dailyBond);
  keys.forEach(k => { if(k !== today) delete _ss.dailyBond[k]; });
  swornSave();
}

/* ================================================================
 *  NPC面板按钮渲染
 * ================================================================ */

/** 生成结拜按钮HTML（供 npc-logic.js hook调用） */
function SWORN_renderNpcActions(npcId){
  const bro = swornGetBro(npcId);
  let html = '';

  if(bro){
    // 已结义 → 显示互动按钮
    html += `<button onclick="swornDailyBond('${npcId}');renderNpcRelActions('${npcId}')"
      style="margin:3px 2px;padding:4px 10px;border:1px solid #ff9fc8;border-radius:4px;
      background:rgba(255,159,200,.1);color:#ff9fc8;cursor:pointer;font-size:12px">
      🍶 对饮切磋</button>`;
    html += `<button onclick="if(confirm('确定要与${bro.name}断绝结义吗？')){swornBreak('${npcId}');renderNpcRelActions('${npcId}')}"
      style="margin:3px 2px;padding:4px 10px;border:1px solid #666;border-radius:4px;
      background:rgba(255,50,50,.08);color:#cc6666;cursor:pointer;font-size:12px">
      💔 断义</button>`;
    html += `<span style="font-size:11px;color:#ff9fc8;margin-left:4px">
      义兄弟·结义Lv.${bro.bondLevel||1}</span>`;
  } else {
    // 未结义 → 显示结拜按钮（需好感≥65）
    const rel = getNpcRelVal(npcId);
    const canBond = rel >= 65;
    if(canBond){
      const activeCount = _ss.brothers.filter(b => b.status === SWORN_STATUS.ACTIVE).length;
      const full = activeCount >= SWORN_MAX;
      html += `<button onclick="swornBond('${npcId}');renderNpcRelActions('${npcId}')"
        style="margin:3px 2px;padding:4px 10px;border:1px solid #ff9fc8;border-radius:4px;
        background:rgba(255,159,200,.15);color:#ff9fc8;cursor:pointer;font-size:12px;${full?'opacity:.4':''}"
        ${full?'disabled title="结义已满(最多'+SWORN_MAX+'位)"':''}>
        🩸 义结金兰${full?' (已满)':''}</button>`;
    }
  }

  return html;
}

/* ================================================================
 *  金兰谱仪式弹窗
 * ================================================================ */

function swornShowCeremony(npc, npcId){
  if(typeof townModalOpen !== 'function') return;

  const bond = swornGetBro(npcId) || {};
  const rankTitles = ['','','老二','老三','老四'];
  const idx = _ss.brothers.filter(b => b.status === SWORN_STATUS.ACTIVE).length;
  const rankText = idx <= 1 ? '大哥/大姐' : (rankTitles[idx] || `第${idx}位`);

  const html = `
  <div style="text-align:center;padding:20px 10px;max-width:380px;margin:auto;font-family:serif">
    <!-- 装饰 -->
    <div style="font-size:28px;margin-bottom:8px">🩸🏮🩸</div>
    <h2 style="color:#ff9fc8;margin:0 0 4px;font-size:20px">义 结 金 兰</h2>
    <p style="color:#998;font-size:12px;margin:0 0 16px">焚香歃血 · 生死与共</p>

    <!-- 金兰谱内容 -->
    <div style="background:rgba(255,159,200,.06);border:1px solid rgba(255,159,200,.2);
      border-radius:8px;padding:16px;margin-bottom:16px;text-align:left">
      <p style="color:#c8a840;font-size:13px;margin:0 0 10px;text-align:center">
        ──── 金 兰 谱 ────</p>
      <p style="color:#ddd;font-size:13px;margin:0 0 8px">
        吾等虽非同族同姓，然志同道合、肝胆相照。</p>
      <p style="color:#ddd;font-size:13px;margin:0 0 8px">
        今歃血为盟，义结金兰，自此后——</p>
      <p style="color:#ff9fc8;font-size:14px;margin:0 0 12px;text-align:center;font-weight:bold">
        有福同享，有难同当，<br>恩仇共担，生死不离！</p>
      <div style="border-top:1px dashed rgba(255,159,200,.3);padding-top:10px;color:#bbb;font-size:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span>📜 结义日期：${getToday()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span>🗡️ 大哥/大姐：你</span>
          <span>${rankText}：${npc.name}（${npc.title || npc.sect || ''}）</span>
        </div>
      </div>
    </div>

    <!-- 效果说明 -->
    <div style="text-align:left;font-size:12px;color:#aaa;margin-bottom:16px;
      background:rgba(255,255,255,.03);border-radius:6px;padding:10px">
      <p style="margin:0 0 4px;color:#ff9fc8">结义加成：</p>
      <p style="margin:0">⚔️ 攻击+${Math.floor(1.5)} / 🛡️ 防御+1 / 📖 经验+0.5% / 💥 暴击+0.3%（每级）</p>
      <p style="margin:4px 0 0">每日可与兄弟对饮切磋，提升结义等级。</p>
      <p style="margin:2px 0 0">战斗中有概率触发兄弟增援。</p>
    </div>

    <button onclick="townModalClose()" style="padding:8px 28px;border:1px solid #ff9fc8;
      border-radius:6px;background:rgba(255,159,200,.15);color:#ff9fc8;cursor:pointer;font-size:14px">
      结义已成 ✨</button>
  </div>`;

  townModalOpen('金兰谱', html);
}

/* ================================================================
 *  结义录面板（城镇入口）
 * ================================================================ */

function swornShowPanel(){
  if(typeof townModalOpen !== 'function'){
    alert('请在城镇中使用此功能。'); return;
  }

  const bros = swornGetActive();
  const bonuses = swornGetBonuses();
  const brokenCount = _ss.brothers.filter(b => b.status === SWORN_STATUS.BROKEN).length;

  let broListHtml = '';
  if(bros.length === 0){
    broListHtml = `<div style="text-align:center;padding:30px;color:#888">
      <p style="font-size:32px;margin:0 0 10px">🩸</p>
      <p>尚无结义兄弟/姐妹</p>
      <p style="font-size:12px;margin-top:6px">与NPC好感达到65以上，即可义结金兰</p>
    </div>`;
  } else {
    bros.forEach(b => {
      broListHtml += `
      <div style="display:flex;align-items:center;padding:10px;margin-bottom:8px;
        background:rgba(255,159,200,.06);border:1px solid rgba(255,159,200,.15);border-radius:8px">
        <div style="flex:1">
          <div style="color:#ff9fc8;font-size:14px;font-weight:bold">${b.name}
            <span style="color:#888;font-size:11px;font-weight:normal">（${b.title || b.sect || '江湖'}）</span>
          </div>
          <div style="color:#aaa;font-size:11px;margin-top:3px">
            结义日：${b.date} · 结义Lv.${b.bondLevel||1} · 来源：${b.source==='jianghu'?'江湖':'城镇'}
          </div>
        </div>
        <div style="display:flex;gap:4px">
          <button onclick="swornDailyBond('${b.npcId}');swornShowPanel()"
            style="padding:4px 8px;border:1px solid #ff9fc8;border-radius:4px;
            background:rgba(255,159,200,.1);color:#ff9fc8;cursor:pointer;font-size:11px">🍶 互动</button>
          <button onclick="if(confirm('确定断绝与${b.name}的结义？')){swornBreak('${b.npcId}');swornShowPanel()}"
            style="padding:4px 8px;border:1px solid #666;border-radius:4px;
            background:rgba(255,50,50,.06);color:#cc6666;cursor:pointer;font-size:11px">💔</button>
        </div>
      </div>`;
    });
  }

  // 历史记录
  let historyHtml = '';
  const history = _ss.brothers.filter(b => b.status === SWORN_STATUS.BROKEN);
  if(history.length > 0){
    historyHtml = `<details style="margin-top:12px">
      <summary style="color:#666;font-size:12px;cursor:pointer">过往结义（${history.length}）</summary>
      ${history.map(b => `<div style="color:#555;font-size:11px;padding:4px 0">
        ${b.name}（${b.title||''}）· 结义 ${b.date} · 断义 ${b.oathLog ? b.oathLog.find(o=>o.npcId===b.npcId)?.date || '?' : '?'}</div>`).join('')}
    </details>`;
  }

  const html = `
  <div style="max-width:420px;margin:auto;padding:10px">
    <h3 style="color:#ff9fc8;margin:0 0 4px;text-align:center">🩸 结义录</h3>
    <p style="color:#888;font-size:12px;margin:0 0 12px;text-align:center">
      义结金兰 · 生死与共（${bros.length}/${SWORN_MAX}）</p>

    <!-- 加成总览 -->
    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;justify-content:center">
      ${[
        ['⚔️', `攻击+${bonuses.atkBonus}`, '#ff8060'],
        ['🛡️', `防御+${bonuses.defBonus}`, '#60a0ff'],
        ['📖', `经验+${bonuses.expBonus}%`, '#a0ff60'],
        ['💥', `暴击+${bonuses.critBonus}%`, '#ffcc00'],
      ].map(([icon, text, color]) => `
        <div style="background:rgba(255,255,255,.04);border:1px solid ${color}33;
          border-radius:6px;padding:6px 10px;text-align:center;min-width:80px">
          <div style="font-size:16px">${icon}</div>
          <div style="font-size:11px;color:${color};margin-top:2px">${text}</div>
        </div>`).join('')}
    </div>

    <!-- 兄弟列表 -->
    ${broListHtml}
    ${historyHtml}
  </div>`;

  townModalOpen('结义录', html);
}

/* ================================================================
 *  江湖事件：结义兄弟相关
 * ================================================================ */

/** 结义兄弟求助事件（NPC主动找你） */
function swornEventBrotherHelp(){
  const bros = swornGetActive();
  if(!bros.length) return null;

  if(Math.random() > 0.25) return null; // 25%触发

  const bro = bros[Math.floor(Math.random() * bros.length)];
  const events = [
    {
      title: `${bro.name}来信求助`,
      text: `收到${bro.name}的飞鸽传书：\n\n"兄弟，我在${_randomPlace()}遭遇仇家围攻，速来相助！"\n\n前去帮助可以获得${bro.name}的好感和结义经验。`,
      choices: [
        { text: '立即前往', result: 'help' },
        { text: '暂且不管', result: 'ignore' },
      ],
    },
    {
      title: `${bro.name}邀你共饮`,
      text: `${bro.name}差人送来消息：\n\n"今晚明月楼，老地方，我请客！"\n\n与兄弟对饮可恢复精力和气血。`,
      choices: [
        { text: '欣然赴约', result: 'drink' },
        { text: '今日不便', result: 'ignore' },
      ],
    },
    {
      title: `${bro.name}送来情报`,
      text: `${bro.name}传来密信：\n\n"${_randomIntel(bro)}"\n\n记入江湖情报。`,
      choices: [
        { text: '记下情报', result: 'intel' },
      ],
    },
  ];

  return events[Math.floor(Math.random() * events.length)];
}

function _randomPlace(){
  const places = ['破庙','荒野','山道','渡口','古林','城门外','客栈','竹林'];
  return places[Math.floor(Math.random()*places.length)];
}

/* ================================================================
 *  导出 / 全局接口
 * ================================================================ */

window.SW = {
  canBond       : swornCanBond,
  bond          : swornBond,
  breakBond     : swornBreak,
  getBro        : swornGetBro,
  getActive     : swornGetActive,
  isBrother     : swornIsBrother,
  getBonuses    : swornGetBonuses,
  battleAssist  : swornBattleAssist,
  dailyBond     : swornDailyBond,
  cleanDaily    : swornCleanDaily,
  showPanel     : swornShowPanel,
  showCeremony  : swornShowCeremony,
  renderNpcActions : SWORN_renderNpcActions,
  eventBrotherHelp : swornEventBrotherHelp,
};

// 暴露独立函数（供 onclick 直接调用）
window.swornBond = swornBond;
window.swornBreak = swornBreak;
window.swornDailyBond = swornDailyBond;
window.swornShowPanel = swornShowPanel;
window.swornGetBonuses = swornGetBonuses;
window.swornBattleAssist = swornBattleAssist;

// 结拜系统已加载
