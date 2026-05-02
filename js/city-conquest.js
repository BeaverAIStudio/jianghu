// ════════════════════════════════════════════════════════════════════
//  city-conquest.js  城市控制争夺系统
//  玩家通过三阶段任务链影响城市归属，改变商店价格和敌人生成概率
//
//  三个可争夺城市：
//    沧州  cangzhou  — 镖局重镇，天地帮觊觎（驱逐/扶持）
//    开封  kaifeng   — 中原枢纽，玄冥教渗透（肃清邪道）
//    扬州  yangzhou  — 江南商都，海沙派挑衅（扶植/中立）
//
//  任务链结构：
//    stage 1: 情报/踩点（talk/collect）
//    stage 2: 破坏/斗争（kill/dungeon）
//    stage 3: 决战/定局（kill，可能触发势力换位）
//
//  存档键：wuxia_city_conquest
// ════════════════════════════════════════════════════════════════════

'use strict';

// ── 存档 ───────────────────────────────────────────────────────────
const CC_KEY = 'wuxia_city_conquest';

function ccLoad() {
  try { return JSON.parse(localStorage.getItem(CC_KEY) || '{}'); }
  catch(e) { return {}; }
}
function ccSave(data) {
  localStorage.setItem(CC_KEY, JSON.stringify(data));
}

// ── 任务链数据库 ────────────────────────────────────────────────────
const CC_CHAINS = {

  // ════════════════════════════════════════════════════════════════
  // 沧州争夺链：天地帮渗透镖局重镇
  // ════════════════════════════════════════════════════════════════
  cangzhou: {
    cityId: 'cangzhou',
    label: '沧州归属之争',
    desc: '天地帮暗中渗透沧州镖局，意图将此镖师重镇纳入囊中。正道侠士能否将其驱逐？',
    initiatorNpc: 'cangzhou_escort_woman',  // 沧州女镖师
    requiredFame: 15,                        // 触发所需全局声望
    stages: [
      {
        id: 'cc_cangzhou_1',
        stageNum: 1,
        icon: '🔍',
        name: '镖局暗流',
        type: 'collect',
        desc: '沧州镖局老掌柜托你暗中调查：近来护镖队频繁遭劫，但劫匪似乎专门挑镖局内部人员知晓的路线下手……你需要收集三份"内鬼证据"。',
        targetItem: 'evidence_tiandibang_spy',
        targetCount: 3,
        targetItemName: '天地帮内鬼证据',
        targetCity: 'cangzhou',
        reward: { exp: 300, silver: 80, cityRep: { cangzhou: 8 } },
        narrative: {
          accept: '「老朽已在沧州扎根三十年……这些年从未见过这般蹊跷。你若有心，帮我查清此事，沧州镖界感激不尽。」',
          complete: '三份证据摆在眼前，白纸黑字——天地帮在镖局安插了三名内鬼，专门打探贵镖路线。',
        },
        nextStage: 'cc_cangzhou_2',
      },
      {
        id: 'cc_cangzhou_2',
        stageNum: 2,
        icon: '⚔',
        name: '驱逐爪牙',
        type: 'kill',
        desc: '证据确凿！你需要逐一击退驻扎在沧州周边、负责接应内鬼的天地帮小队，斩断他们的据点联络。',
        targetEnemyType: 'bandit_veteran',  // 天地帮老兵
        targetCount: 5,
        targetCity: 'cangzhou',
        dungeonHint: '在沧州附近的天地帮据点中可以找到他们。',
        reward: { exp: 500, silver: 120, cityRep: { cangzhou: 12 } },
        narrative: {
          accept: '「内鬼已被我们秘密扣押。但天地帮在城外还有人手，必须一并清除，否则后患无穷！」',
          complete: '五名天地帮精锐倒在你刀下。沧州城外的空气似乎也清新了几分。',
        },
        nextStage: 'cc_cangzhou_3',
      },
      {
        id: 'cc_cangzhou_3',
        stageNum: 3,
        icon: '💥',
        name: '帮主伏诛',
        type: 'kill',
        desc: '天地帮沧州分舵舵主亲自出马！此人坐镇幽州堡垒多年，武艺高强、手段毒辣。今日决战，输赢将决定沧州的未来！',
        targetNpcId: 'bandit_chief_cangzhou',
        targetName: '天地帮沧州分舵主',
        targetCity: 'cangzhou',
        reward: { exp: 800, silver: 300, fame: 15, cityRep: { cangzhou: 20 } },
        isFinal: true,
        newOwner: 'neutral',  // 完成后城市归属→中立（镖局自治）
        ownerChangeName: '沧州镖局自治',
        narrative: {
          accept: '「你是真正的侠客！此战若胜，沧州从此只认镖局的规矩，不受任何帮派摆布！」',
          complete: '帮主仰面倒地，天地帮在沧州的势力就此瓦解。老掌柜热泪盈眶——沧州，终于回来了。',
          ownerChange: '🏯 沧州归属变更：天地帮势力撤出，沧州镖局宣告自治。商路恢复，价格回落正常。',
        },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 开封争夺链：玄冥教渗透中原枢纽
  // ════════════════════════════════════════════════════════════════
  kaifeng: {
    cityId: 'kaifeng',
    label: '开封暗战',
    desc: '玄冥教以商贾为掩护，悄然渗透开封各大行会。若任其坐大，中原最繁华的城市将沦为邪道根据地。',
    initiatorNpc: 'kaifeng_inn',
    requiredFame: 25,
    stages: [
      {
        id: 'cc_kaifeng_1',
        stageNum: 1,
        icon: '🕵',
        name: '商道暗棋',
        type: 'talk',
        desc: '开封客栈掌柜低声告诉你：城内几家大商号最近频繁往来于行会和一处可疑宅院之间。追查此事或许能找到玄冥教的线索。你需要拜访三位知情人。',
        targetNpcs: ['kaifeng_inn', 'kaifeng_doctor', 'kaifeng_smith'],
        targetNpcNames: ['悦来客栈', '仁济医馆', '龙虎铁铺'],
        targetCity: 'kaifeng',
        topicId: 'topic_kaifeng_spy',
        topicText: '询问「可疑商号」',
        reward: { exp: 250, silver: 60, cityRep: { kaifeng: 8 } },
        narrative: {
          accept: '「你是外来客，反而不引人注意。帮我问问这几处……玄冥教的人最恨别人盯着他们。」',
          complete: '三条线索汇成一处：玄冥教暗探藏匿于城北的「万和商号」，以药材为掩护，秘密传递情报。',
        },
        nextStage: 'cc_kaifeng_2',
      },
      {
        id: 'cc_kaifeng_2',
        stageNum: 2,
        icon: '🔥',
        name: '捣毁据点',
        type: 'dungeon',
        desc: '万和商号是玄冥教的秘密联络站！你潜入暗探据点，击退守卫，搜查机密文件。只有彻底破坏这个据点，才能斩断玄冥教在开封的情报网。',
        targetDungeonId: 'dungeon_kaifeng_hideout',  // 开封附近城区地下城
        targetDungeonName: '万和商号地下室',
        targetCity: 'kaifeng',
        reward: { exp: 600, silver: 180, cityRep: { kaifeng: 15 } },
        narrative: {
          accept: '「玄冥教的密函里写着他们意图控制开封行会，坐收财货——这不只是江湖事，是要祸乱民生！」',
          complete: '据点燃起大火，机密文件尽数落入你手。玄冥教在开封的情报网宣告瓦解。',
        },
        nextStage: 'cc_kaifeng_3',
      },
      {
        id: 'cc_kaifeng_3',
        stageNum: 3,
        icon: '☠',
        name: '玄冥使者',
        type: 'kill',
        desc: '玄冥教派出「冥使」级高手亲赴开封追查！此人修习玄冥神掌，出手阴毒，据说已将多名侠士打成废人。今日之战，有进无退！',
        targetNpcId: 'xuanming_spy',
        targetName: '玄冥冥使',
        targetCity: 'kaifeng',
        reward: { exp: 1000, silver: 400, fame: 20, cityRep: { kaifeng: 25 } },
        isFinal: true,
        newOwner: 'neutral',
        ownerChangeName: '开封商界自治',
        narrative: {
          accept: '「杀了他——只有这样，玄冥教才会收手，开封才能重归太平！」',
          complete: '冥使轰然倒地，玄冥神掌化于无形。开封城内，商号重新竖起旗帜，百姓额手称庆。',
          ownerChange: '🏯 开封归属变更：玄冥教势力被驱逐，开封商界重归正道。市面繁荣，物价恢复。',
        },
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // 扬州争夺链：海沙派挑战南宫世家
  // ════════════════════════════════════════════════════════════════
  yangzhou: {
    cityId: 'yangzhou',
    label: '扬州水陆之争',
    desc: '海沙派沿运河北上，意图染指江南最富裕的城市扬州。南宫世家向外寻求援手——你是否愿意站在正道一边？',
    initiatorNpc: 'yangzhou_merchant',
    requiredFame: 30,
    stages: [
      {
        id: 'cc_yangzhou_1',
        stageNum: 1,
        icon: '⛵',
        name: '运河警讯',
        type: 'collect',
        desc: '扬州城外运河上出现大批海沙派船只！你需要拦截三名海沙派信使，截取他们的行动密令，弄清海沙派的真实意图。',
        targetItem: 'haisha_order_scroll',
        targetCount: 3,
        targetItemName: '海沙派密令',
        targetCity: 'yangzhou',
        reward: { exp: 350, silver: 100, cityRep: { yangzhou: 10 } },
        narrative: {
          accept: '「南宫世家在扬州立基百年，绝不允许任何人染指！侠士若肯出手相助，重谢！」',
          complete: '三份密令合在一处，清晰展示了海沙派的围城计划：封锁水路、断绝粮草、逼南宫出城议和。',
        },
        nextStage: 'cc_yangzhou_2',
      },
      {
        id: 'cc_yangzhou_2',
        stageNum: 2,
        icon: '🚢',
        name: '截断水路',
        type: 'kill',
        desc: '海沙派在运河上布下哨船，截断扬州补给！你需要击沉哨船、击退海沙水手，打通补给路线。',
        targetEnemyType: 'haisha_pirate',
        targetCount: 8,
        targetCity: 'yangzhou',
        dungeonHint: '运河沿岸和扬州附近水域是海沙派活跃区域。',
        reward: { exp: 700, silver: 200, cityRep: { yangzhou: 18 } },
        narrative: {
          accept: '「运河一通，扬州便无后顾之忧。但海沙派不会善罢甘休——他们的首领必然亲自出马！」',
          complete: '八名海沙水手落水，哨船连续燃起火光。扬州城头的百姓发出欢呼。',
        },
        nextStage: 'cc_yangzhou_3',
      },
      {
        id: 'cc_yangzhou_3',
        stageNum: 3,
        icon: '⚓',
        name: '海沙帮主',
        type: 'kill',
        desc: '海沙帮帮主亲率精锐水军兵临扬州！此人精通水战，身法如游鱼，是你从未遇过的对手。今日江面之上，只能有一个赢家！',
        targetNpcId: 'haisha_captain',
        targetName: '海沙帮帮主·金浪',
        targetCity: 'yangzhou',
        reward: { exp: 1200, silver: 500, fame: 25, cityRep: { yangzhou: 30 } },
        isFinal: true,
        newOwner: 'nangong',   // 完成后南宫世家稳固控制权（原本就是）
        ownerChangeName: '南宫世家稳固统治',
        narrative: {
          accept: '「此战若胜，江南水路百年无忧！南宫世家愿与天下侠义之士共享扬州繁华！」',
          complete: '帮主落败，仰天大笑，率残部撤回运河。扬州码头上，船帮鸣笛致意——今日之后，再无人敢小觑南宫世家。',
          ownerChange: '🏯 扬州归属稳固：南宫世家击退海沙派，扬州繁荣更胜往昔。与南宫相关商品享受额外折扣。',
        },
      },
    ],
  },
};

// ── 城市争夺"将将胡"特殊事件池 ─────────────────────────────────────
const CC_JIANGHU_EVENTS = {
  unexpectedReinforcement: {
    id: 'unexpectedReinforcement',
    chance: 0.05,
    icon: '🏇',
    title: '意外援军',
    desc: '关键时刻，一支神秘援军突然出现，助你扭转战局！',
    effect: (reward) => ({ reward: { ...reward, exp: Math.floor(reward.exp * 1.5), fame: (reward.fame || 0) + 10 }, msg: '🏇 意外援军！经验+50%，声望+10！' }),
  },
  spyDefection: {
    id: 'spyDefection',
    chance: 0.04,
    icon: '🕵️',
    title: '叛徒投诚',
    desc: '敌方阵营中有人暗中投诚，带来了重要情报和物资！',
    effect: (reward) => ({ reward: { ...reward, silver: reward.silver + 200, cityRepBonus: 10 }, msg: '🕵️ 叛徒投诚！银两+200，城市声望额外+10！' }),
  },
  decisiveBattle: {
    id: 'decisiveBattle',
    chance: 0.03,
    icon: '⚔️',
    title: '决战时刻',
    desc: '你抓住敌方破绽，一击定乾坤！',
    effect: (reward) => ({ reward: { ...reward, exp: reward.exp * 2, fame: (reward.fame || 0) + 15 }, msg: '⚔️ 决战时刻！经验翻倍，声望+15！' }),
  },
  cityGratitude: {
    id: 'cityGratitude',
    chance: 0.02,
    icon: '🎁',
    title: '全城感恩',
    desc: '你的义举传遍全城，百姓纷纷献上谢礼！',
    effect: (reward) => ({ reward: { ...reward, silver: reward.silver + 500, fame: (reward.fame || 0) + 25 }, msg: '🎁 全城感恩！银两+500，声望+25！' }),
  },
};

// ── 任务链进度查询 ──────────────────────────────────────────────────

/** 获取某城市争夺链的当前进度 */
function ccGetProgress(cityId) {
  const data = ccLoad();
  return data[cityId] || { currentStage: null, completed: [] };
}

/** 检查并触发城市争夺"将将胡"事件 */
function _checkCcJianghuEvent(eventType, ...args) {
  const evt = CC_JIANGHU_EVENTS[eventType];
  if (!evt) return null;
  if (Math.random() < evt.chance) {
    return { ...evt, result: evt.effect(...args) };
  }
  return null;
}

/** 检查某阶段是否已完成 */
function ccIsStageComplete(cityId, stageId) {
  return ccGetProgress(cityId).completed.includes(stageId);
}

/** 检查整条链是否已完成 */
function ccIsChainComplete(cityId) {
  const chain = CC_CHAINS[cityId];
  if(!chain) return false;
  const prog = ccGetProgress(cityId);
  return chain.stages.every(s => prog.completed.includes(s.id));
}

// ── 触发入口：进城检测 ─────────────────────────────────────────────

/**
 * 进城时检查是否有可触发的争夺任务链（供 town.html 的 _onTownArrival 调用）
 * @param {string} cityId
 */
function ccOnEnterCity(cityId) {
  const chain = CC_CHAINS[cityId];
  if(!chain) return;

  // 检查整条链是否已完成
  if(ccIsChainComplete(cityId)) return;

  // 检查声望门槛
  const fame = (typeof jianghuState !== 'undefined' && jianghuState.reputation)
    ? (jianghuState.reputation.fame || 0)
    : 0;
  if(fame < chain.requiredFame) return;

  // 检查是否已经开始（有当前阶段或已完成部分阶段）
  const prog = ccGetProgress(cityId);

  // 未开始 → 3秒后显示引导提示
  if(!prog.currentStage && prog.completed.length === 0) {
    setTimeout(() => _ccShowChainIntro(cityId, chain), 3000);
    return;
  }

  // 已开始 → 检查当前阶段是否可以完成（根据类型自动检测）
  if(prog.currentStage) {
    const stage = chain.stages.find(s => s.id === prog.currentStage);
    if(stage) _ccCheckStageProgress(cityId, stage);
  }
}

// ── 任务链介绍弹窗 ──────────────────────────────────────────────────

function _ccShowChainIntro(cityId, chain) {
  // 防止重复显示
  const data = ccLoad();
  if(data[cityId]?.introShown) return;
  data[cityId] = data[cityId] || {};
  data[cityId].introShown = true;
  ccSave(data);

  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="cc-intro-box">
      <div class="cc-intro-header">
        <span class="cc-intro-icon">🏯</span>
        <span class="cc-intro-label">城市势力事件</span>
      </div>
      <div class="cc-intro-title">${chain.label}</div>
      <div class="cc-intro-desc">${chain.desc}</div>
      <div class="cc-intro-stages">
        ${chain.stages.map((s,i) => `
          <div class="cc-stage-preview">
            <span class="cc-stage-num">${i+1}</span>
            <span class="cc-stage-name">${s.icon} ${s.name}</span>
          </div>
        `).join('')}
      </div>
      <div class="cc-intro-tip">与 <b>${_ccGetNpcName(chain.initiatorNpc)}</b> 对话，了解详情并接取任务。</div>
      <div class="cc-intro-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">知道了</button>
        <button class="mqn-btn mqn-btn-panel" onclick="this.closest('.sq-overlay').remove(); ccShowPanel('${cityId}')">📋 查看任务</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function _ccGetNpcName(npcId) {
  if(typeof NPC_DB !== 'undefined' && NPC_DB[npcId]) return NPC_DB[npcId].name || npcId;
  if(typeof NAMED_CITY_NPCS !== 'undefined') {
    for(const city of Object.values(NAMED_CITY_NPCS)){
      if(city[npcId]) return city[npcId].name || npcId;
      for(const npc of Object.values(city)){
        if(npc && npc.id === npcId) return npc.name || npcId;
      }
    }
  }
  return npcId;
}

// ── 接取任务 ────────────────────────────────────────────────────────

/**
 * 接取某城市争夺链的下一阶段任务
 * @param {string} cityId
 */
function ccAcceptNextStage(cityId) {
  const chain = CC_CHAINS[cityId];
  if(!chain) return;

  const prog = ccGetProgress(cityId);

  // 找出第一个未完成的阶段
  const nextStage = chain.stages.find(s => !prog.completed.includes(s.id));
  if(!nextStage) {
    showToast('🏆 ' + chain.label + ' 全部完成！');
    return;
  }

  // 如果已有进行中的阶段且不同，不重复接取
  if(prog.currentStage && prog.currentStage !== nextStage.id) {
    showToast(`当前任务「${_ccGetStageById(cityId, prog.currentStage)?.name || ''}」正在进行中。`);
    return;
  }

  // 保存进度
  const data = ccLoad();
  data[cityId] = data[cityId] || {};
  data[cityId].currentStage = nextStage.id;
  ccSave(data);

  // 显示接取叙事
  _ccShowStageAccept(nextStage);
}

function _ccShowStageAccept(stage) {
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="cc-stage-box">
      <div class="cc-stage-header">
        <span>${stage.icon}</span>
        <span class="cc-stage-title">第${stage.stageNum}阶段：${stage.name}</span>
      </div>
      <div class="cc-stage-desc">${stage.desc}</div>
      <div class="cc-stage-quote">"${stage.narrative.accept}"</div>
      <div class="cc-stage-goal">
        <span class="cc-goal-label">🎯 目标</span>
        <span class="cc-goal-text">${_ccGetStageGoalText(stage)}</span>
      </div>
      <div class="cc-stage-reward">
        <span>📦 奖励：经验+${stage.reward.exp} · 银两+${stage.reward.silver}
        ${stage.reward.fame ? ' · 声望+'+stage.reward.fame : ''}</span>
      </div>
      <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">立刻出发！</button>
    </div>
  `;
  document.body.appendChild(overlay);

  if(typeof showToast === 'function') showToast(`📋 接取：${stage.name}`);
}

function _ccGetStageGoalText(stage) {
  if(stage.type === 'collect') return `收集 ${stage.targetItemName} × ${stage.targetCount}`;
  if(stage.type === 'kill') return `击败 ${stage.targetName || (stage.targetEnemyType && '目标敌人')} × ${stage.targetCount || 1}`;
  if(stage.type === 'talk') return `拜访 ${stage.targetNpcNames ? stage.targetNpcNames.join('、') : '指定NPC'}`;
  if(stage.type === 'dungeon') return `探索 ${stage.targetDungeonName}`;
  return stage.desc;
}

function _ccGetStageById(cityId, stageId) {
  return CC_CHAINS[cityId]?.stages.find(s => s.id === stageId) || null;
}

// ── 进度检查（自动检测完成条件） ─────────────────────────────────────

function _ccCheckStageProgress(cityId, stage) {
  // talk 类型：检查三个 NPC 是否都对话过（通过 npcTopicsDone 检测）
  if(stage.type === 'talk' && stage.targetNpcs) {
    const npcState = typeof npcStateLoad === 'function' ? npcStateLoad() : {};
    const allDone = stage.targetNpcs.every(npcId => {
      const ns = npcState[npcId];
      return ns && ns.topicsDone && ns.topicsDone.includes(stage.topicId);
    });
    if(allDone) ccCompleteStage(cityId, stage.id);
  }
  // collect/kill/dungeon 类型：通过外部调用 ccOnKill/ccOnCollect 触发
}

// ── 外部调用接口 ─────────────────────────────────────────────────────

/**
 * 击杀敌人时调用（由战斗结算处触发）
 * @param {string} killedNpcId 击杀的 NPC ID（精确匹配）
 * @param {string} killedEnemyType 敌人类型（用于 targetEnemyType 模糊匹配）
 * @param {string} cityId 当前所在城市
 */
function ccOnKill(killedNpcId, killedEnemyType, cityId) {
  for(const [cId, chain] of Object.entries(CC_CHAINS)){
    const prog = ccGetProgress(cId);
    if(!prog.currentStage) continue;

    const stage = chain.stages.find(s => s.id === prog.currentStage);
    if(!stage || stage.type !== 'kill') continue;

    // 精确 NPC 击杀（isFinal 阶段 boss）
    if(stage.targetNpcId && stage.targetNpcId === killedNpcId){
      ccCompleteStage(cId, stage.id);
      return;
    }

    // 类型击杀（需要在对应城市）
    if(stage.targetEnemyType && stage.targetEnemyType === killedEnemyType
       && cityId === chain.cityId){
      _ccIncrKillCount(cId, stage.id, stage.targetCount || 1);
    }
  }
}

/**
 * 收集道具时调用
 * @param {string} itemId 道具ID
 * @param {number} count 数量
 */
function ccOnCollect(itemId, count) {
  for(const [cId, chain] of Object.entries(CC_CHAINS)){
    const prog = ccGetProgress(cId);
    if(!prog.currentStage) continue;

    const stage = chain.stages.find(s => s.id === prog.currentStage);
    if(!stage || stage.type !== 'collect' || stage.targetItem !== itemId) continue;

    _ccIncrCollectCount(cId, stage.id, count, stage.targetCount);
  }
}

/**
 * 完成地下城时调用
 * @param {string} dungeonId 地下城ID
 */
function ccOnDungeonComplete(dungeonId) {
  for(const [cId, chain] of Object.entries(CC_CHAINS)){
    const prog = ccGetProgress(cId);
    if(!prog.currentStage) continue;

    const stage = chain.stages.find(s => s.id === prog.currentStage);
    if(!stage || stage.type !== 'dungeon') continue;
    if(stage.targetDungeonId && stage.targetDungeonId !== dungeonId) continue;

    ccCompleteStage(cId, stage.id);
  }
}

// ── 击杀/收集计数 ───────────────────────────────────────────────────

function _ccIncrKillCount(cityId, stageId, required) {
  const data = ccLoad();
  data[cityId] = data[cityId] || {};
  data[cityId].killCount = data[cityId].killCount || {};
  data[cityId].killCount[stageId] = (data[cityId].killCount[stageId] || 0) + 1;
  ccSave(data);

  const current = data[cityId].killCount[stageId];
  if(typeof showToast === 'function'){
    showToast(`⚔️ 进度：${current}/${required}`);
  }
  if(current >= required) ccCompleteStage(cityId, stageId);
}

function _ccIncrCollectCount(cityId, stageId, addCount, required) {
  const data = ccLoad();
  data[cityId] = data[cityId] || {};
  data[cityId].collectCount = data[cityId].collectCount || {};
  data[cityId].collectCount[stageId] = (data[cityId].collectCount[stageId] || 0) + addCount;
  ccSave(data);

  const current = data[cityId].collectCount[stageId];
  if(typeof showToast === 'function'){
    showToast(`📦 进度：${current}/${required}`);
  }
  if(current >= required) ccCompleteStage(cityId, stageId);
}

// ── 阶段完成 ────────────────────────────────────────────────────────

/**
 * 完成当前阶段，发放奖励，检查是否最终阶段
 * @param {string} cityId
 * @param {string} stageId
 */
function ccCompleteStage(cityId, stageId) {
  const chain = CC_CHAINS[cityId];
  if(!chain) return;

  const stage = chain.stages.find(s => s.id === stageId);
  if(!stage) return;

  // 防止重复完成
  const prog = ccGetProgress(cityId);
  if(prog.completed.includes(stageId)) return;

  // 【将将胡】检查特殊事件
  let jianghuEvent = null;
  let rewardMod = { ...stage.reward };

  // 意外援军
  const reinforceEvt = _checkCcJianghuEvent('unexpectedReinforcement', rewardMod);
  if(reinforceEvt){
    rewardMod = reinforceEvt.result.reward;
    jianghuEvent = reinforceEvt;
  }

  // 叛徒投诚
  const spyEvt = _checkCcJianghuEvent('spyDefection', rewardMod);
  if(spyEvt){
    rewardMod = spyEvt.result.reward;
    if(spyEvt.result.reward.cityRepBonus && rewardMod.cityRep){
      for(const cId of Object.keys(rewardMod.cityRep)){
        rewardMod.cityRep[cId] += spyEvt.result.reward.cityRepBonus;
      }
    }
    jianghuEvent = spyEvt;
  }

  // 决战时刻（仅最终阶段）
  if(stage.isFinal){
    const decisiveEvt = _checkCcJianghuEvent('decisiveBattle', rewardMod);
    if(decisiveEvt){
      rewardMod = decisiveEvt.result.reward;
      jianghuEvent = decisiveEvt;
    }
  }

  // 全城感恩（仅最终阶段）
  if(stage.isFinal){
    const gratitudeEvt = _checkCcJianghuEvent('cityGratitude', rewardMod);
    if(gratitudeEvt){
      rewardMod = gratitudeEvt.result.reward;
      jianghuEvent = gratitudeEvt;
    }
  }

  // 保存完成状态
  const data = ccLoad();
  data[cityId] = data[cityId] || {};
  data[cityId].completed = data[cityId].completed || [];
  data[cityId].completed.push(stageId);
  data[cityId].currentStage = null;  // 清除当前阶段
  ccSave(data);

  // 发放奖励（使用修改后的奖励）
  _ccGrantReward(rewardMod);

  // 显示完成叙事
  _ccShowStageComplete(cityId, stage, chain, jianghuEvent, rewardMod);
}

function _ccGrantReward(reward) {
  if(!reward) return;
  if(reward.exp && typeof giveExp === 'function') giveExp(reward.exp);
  if(reward.silver && typeof addSilver === 'function') addSilver(reward.silver);
  if(reward.fame && typeof jianghuState !== 'undefined' && jianghuState.reputation){
    jianghuState.reputation.fame = (jianghuState.reputation.fame || 0) + reward.fame;
    if(typeof jianghuSave === 'function') jianghuSave();
  }
  // 城市声望奖励
  if(reward.cityRep && typeof jianghuState !== 'undefined'){
    jianghuState.cityRep = jianghuState.cityRep || {};
    for(const [cId, val] of Object.entries(reward.cityRep)){
      jianghuState.cityRep[cId] = jianghuState.cityRep[cId] || { rep: 0, align: 0 };
      jianghuState.cityRep[cId].rep = Math.min(100, (jianghuState.cityRep[cId].rep || 0) + val);
      jianghuState.cityRep[cId].align = Math.min(100, (jianghuState.cityRep[cId].align || 0) + Math.round(val * 0.5));
    }
    if(typeof jianghuSave === 'function') jianghuSave();
  }
}

function _ccShowStageComplete(cityId, stage, chain, jianghuEvent, rewardMod) {
  const isFinal = stage.isFinal;
  const finalReward = rewardMod || stage.reward;

  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="cc-complete-box${isFinal ? ' cc-complete-final' : ''}">
      <div class="cc-complete-header">
        ${isFinal ? '<span class="cc-final-badge">🏆 任务链完成</span>' : ''}
        <span class="cc-complete-icon">${stage.icon}</span>
        <span class="cc-complete-title">${stage.name} 完成！</span>
      </div>
      <div class="cc-complete-quote">"${stage.narrative.complete}"</div>
      ${isFinal ? `<div class="cc-owner-change">${stage.narrative.ownerChange}</div>` : ''}
      ${jianghuEvent ? `
      <div style="margin:12px 0;padding:10px;background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.3);border-radius:8px;text-align:center">
        <div style="font-size:24px;margin-bottom:4px">${jianghuEvent.icon}</div>
        <div style="font-size:13px;color:#ffd700;font-weight:bold">✨ 将将胡 · ${jianghuEvent.title}</div>
        <div style="font-size:11px;color:#e0d0a0;margin-top:4px">${jianghuEvent.desc}</div>
        ${jianghuEvent.result && jianghuEvent.result.msg ? `<div style="font-size:11px;color:#80e880;margin-top:4px">${jianghuEvent.result.msg}</div>` : ''}
      </div>` : ''}
      <div class="cc-complete-rewards">
        <span class="cc-reward-item">✨ 经验 +${finalReward.exp}</span>
        <span class="cc-reward-item">💰 银两 +${finalReward.silver}</span>
        ${finalReward.fame ? `<span class="cc-reward-item">⭐ 声望 +${finalReward.fame}</span>` : ''}
        ${Object.entries(finalReward.cityRep||{}).map(([c,v]) => `<span class="cc-reward-item">🏯 城望 +${v}</span>`).join('')}
      </div>
      ${!isFinal ? `<div class="cc-next-hint">下一阶段：${chain.stages[stage.stageNum]?.name || '即将开始'}</div>` : ''}
      <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()${isFinal ? '' : '; ccShowPanel(\''+cityId+'\')'}">
        ${isFinal ? '江湖在望！' : '查看下一阶段'}
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  // 最终阶段：触发城市归属变更
  if(isFinal && stage.newOwner) {
    _ccChangeCityOwner(cityId, stage.newOwner, stage.ownerChangeName);
  }

  // 最终阶段：检查成就（所有争夺链全完成→特殊成就）
  if(isFinal) _ccCheckConquestAchievements();
}

// ── 城市归属变更 ─────────────────────────────────────────────────────

function _ccChangeCityOwner(cityId, newOwner, changeName) {
  // 更新 data-world.js 中的城市配置（运行时修改）
  if(typeof WORLD_CITIES !== 'undefined' && WORLD_CITIES[cityId]){
    WORLD_CITIES[cityId].cityOwner = newOwner;
  }
  // 同步存档
  const data = ccLoad();
  data[cityId] = data[cityId] || {};
  data[cityId].ownerChanged = true;
  data[cityId].finalOwner = newOwner;
  ccSave(data);

  // 触发世界事件通知
  if(typeof weAddEvent === 'function' && typeof WE_TIER !== 'undefined'){
    weAddEvent('we_city_control_change', WE_TIER.MEDIUM, {
      cityId: cityId,
      newOwner: newOwner,
      changeName: changeName,
    });
  }

  if(typeof showToast === 'function'){
    showToast(`🏯 ${changeName}`);
  }
}

// ── 成就检查 ─────────────────────────────────────────────────────────

function _ccCheckConquestAchievements() {
  const allComplete = Object.keys(CC_CHAINS).every(cId => ccIsChainComplete(cId));
  if(allComplete && typeof _unlockAchievement === 'function'){
    // 三城争夺全部完成的成就（需在 achievements.js 中添加）
    _unlockAchievement('ach_city_conqueror');
  }
}

// ── 争夺任务面板 ─────────────────────────────────────────────────────

/**
 * 打开城市争夺任务面板（可在 NPC 对话或城市UI中调用）
 * @param {string} cityId 可选，若传入则直接展示该城市；否则显示总览
 */
function ccShowPanel(cityId) {
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';

  const chainsToShow = cityId ? [CC_CHAINS[cityId]] : Object.values(CC_CHAINS);

  const chainsHtml = chainsToShow.filter(Boolean).map(chain => {
    const prog = ccGetProgress(chain.cityId);
    const isComplete = ccIsChainComplete(chain.cityId);
    const currentStage = prog.currentStage ? chain.stages.find(s => s.id === prog.currentStage) : null;
    const nextStage = chain.stages.find(s => !prog.completed.includes(s.id));

    const stagesHtml = chain.stages.map((s, i) => {
      const done = prog.completed.includes(s.id);
      const active = prog.currentStage === s.id;
      return `
        <div class="cc-panel-stage ${done ? 'cc-ps-done' : active ? 'cc-ps-active' : 'cc-ps-locked'}">
          <span class="cc-ps-icon">${done ? '✅' : active ? '⚡' : '🔒'}</span>
          <span class="cc-ps-name">${s.icon} ${s.name}</span>
          ${active ? '<span class="cc-ps-badge">进行中</span>' : ''}
        </div>
      `;
    }).join('');

    // 按钮逻辑
    let btnHtml = '';
    if(isComplete){
      btnHtml = '<div class="cc-panel-done">🏆 已完成</div>';
    } else if(currentStage){
      btnHtml = `<button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">继续任务</button>`;
    } else if(nextStage){
      btnHtml = `<button class="mqn-btn mqn-btn-ok" onclick="ccAcceptNextStage('${chain.cityId}'); this.closest('.sq-overlay').remove()">接取任务</button>`;
    }

    return `
      <div class="cc-panel-chain">
        <div class="cc-panel-city-name">🏯 ${chain.label}</div>
        <div class="cc-panel-desc">${chain.desc}</div>
        <div class="cc-panel-stages">${stagesHtml}</div>
        ${btnHtml}
      </div>
    `;
  }).join('<hr style="border-color:rgba(255,200,100,.2);margin:12px 0">');

  overlay.innerHTML = `
    <div class="cc-panel-box">
      <div class="cc-panel-title">⚔️ 城市势力争夺</div>
      <div class="cc-panel-subtitle">影响城市归属，改变江湖格局</div>
      <div class="cc-panel-content">${chainsHtml}</div>
      <button class="mqn-btn" style="width:100%;margin-top:8px" onclick="this.closest('.sq-overlay').remove()">关闭</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ── 初始化：载入存档时恢复城市归属 ──────────────────────────────────

/**
 * 游戏初始化时调用，根据存档恢复城市归属变更
 */
function ccRestoreCityOwners() {
  const data = ccLoad();
  for(const [cityId, state] of Object.entries(data)){
    if(state.ownerChanged && state.finalOwner){
      if(typeof WORLD_CITIES !== 'undefined' && WORLD_CITIES[cityId]){
        WORLD_CITIES[cityId].cityOwner = state.finalOwner;
      }
    }
  }
}

// 自动执行：模块加载时恢复
if(typeof WORLD_CITIES !== 'undefined'){
  ccRestoreCityOwners();
}
