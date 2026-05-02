// ═══════════════════════════════════════════════════════════════════
//  quest-procedural.js  —  动态任务管理器
//  负责：生成、更新、刷新动态任务
// ═══════════════════════════════════════════════════════════════════

// ── 每日活跃系统 ───────────────────────────────────────────────────
// 活跃度分段：每完成一个赏金任务计1分，每日上限10分
// 分段奖励：3分/5分/7分/10分各一档，共4个宝箱
const DAILY_ACTIVITY_LEVELS = [3, 5, 7, 10];
const DAILY_ACTIVITY_REWARDS = [
  { level: 3,  silver: 30,  exp: 20,  item: null,                               label: '初窥门径', icon: '📦', dropPool: [
    { name:'草药', icon:'🌿', type:'consumable', templateId:'item_herb_common', effect:{hp:20} },
    { name:'山泉水', icon:'💧', type:'consumable', templateId:'item_spring_water', effect:{mp:15} },
    { name:'铁矿石', icon:'🪨', type:'material', templateId:'item_iron_ore' },
  ]},
  { level: 5,  silver: 60,  exp: 40,  item: null,                               label: '小有所成', icon: '🎁', dropPool: [
    { name:'金疮药', icon:'🩹', type:'consumable', templateId:'item_jinchuang', effect:{hp:35} },
    { name:'狼皮', icon:'🐺', type:'material', templateId:'item_wolf_pelt' },
    { name:'铜钱袋', icon:'💰', type:'material', templateId:'item_copper_coin' },
  ]},
  { level: 7,  silver: 80,  exp: 60,  item: null,                               label: '渐入佳境', icon: '💎', dropPool: [
    { name:'金疮药(大)', icon:'💊', type:'consumable', templateId:'item_jinchuang_g', effect:{hp:80} },
    { name:'银锭', icon:'🪙', type:'material', templateId:'item_silver_coin' },
    { name:'功法残页', icon:'📜', type:'collectible', templateId:'item_manual_fragment' },
  ]},
  { level: 10, silver: 150, exp: 100, item: null,                              label: '登峰造极', icon: '👑', dropPool: [
    { name:'天外陨铁', icon:'☄️', type:'material', templateId:'item_meteorite_iron' },
    { name:'天机令·残', icon:'🏅', type:'accessory', templateId:'item_tianji_ling_frag', affixes:[{key:'repBonus',value:30}] },
    { name:'血骨令牌·残', icon:'🩸', type:'collectible', templateId:'item_xuegu_token_frag' },
  ]},
];
const DAILY_ACTIVITY_KEY = 'wuxia_daily_activity';

// ── 动态任务状态 ──
const ProceduralQuestState = {
  bounties: [],
  dailies: [],
  encounters: [],
  lastBountyRefreshDay: 0,   // 基于 edS.gameDay 刷新
  lastDailyRefreshDay: 0,    // 基于 edS.gameDay 刷新
  lastEncounterCheck: 0,
  STORAGE_KEY: 'wuxia_procedural_quests',
};

// ── 每日活跃状态 ──
let _dailyActivity = {
  points: 0,           // 当日活跃积分
  claims: {},          // level -> true（已领取）
  lastDate: '',        // 'YYYY-MM-DD' 记录日期
};

// ── 初始化 ──
function initProceduralQuestSystem() {
  loadProceduralQuestState();
  checkAndRefreshQuests();
  loadDailyActivity();
  tickDailyActivity();
}

// ── 加载/保存 ──
function loadProceduralQuestState() {
  try {
    const saved = localStorage.getItem(ProceduralQuestState.STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      ProceduralQuestState.bounties = data.bounties || [];
      ProceduralQuestState.dailies = data.dailies || [];
      // 兼容旧存档的时间戳字段（直接置0，下次进城必然刷新）
      ProceduralQuestState.lastBountyRefreshDay = data.lastBountyRefreshDay ?? data.lastBountyRefresh ?? 0;
      ProceduralQuestState.lastDailyRefreshDay  = data.lastDailyRefreshDay  ?? data.lastDailyRefresh  ?? 0;
    }
  } catch (e) { console.warn('加载动态任务失败:', e); }
}

function saveProceduralQuestState() {
  try {
    localStorage.setItem(ProceduralQuestState.STORAGE_KEY, JSON.stringify({
      bounties: ProceduralQuestState.bounties,
      dailies: ProceduralQuestState.dailies,
      lastBountyRefreshDay: ProceduralQuestState.lastBountyRefreshDay,
      lastDailyRefreshDay: ProceduralQuestState.lastDailyRefreshDay,
    }));
  } catch (e) { console.warn('保存动态任务失败:', e); }
}

// ── 刷新检查 ──
function checkAndRefreshQuests() {
  // 获取当前游戏天数（防御：兜底0）
  const todayIdx = (typeof edS !== 'undefined' && edS.gameDay != null) ? edS.gameDay : 0;
  const playerLevel = (typeof edS !== 'undefined' ? edS.level : 1) || 1;
  const currentCity = (typeof travelPlayerState !== 'undefined' ? travelPlayerState.currentCity : null) || 'luoyang';

  // 通缉令：每过1个游戏天即刷新（跟随 edS.gameDay）
  if (todayIdx > ProceduralQuestState.lastBountyRefreshDay) {
    refreshBounties(playerLevel, currentCity);
    ProceduralQuestState.lastBountyRefreshDay = todayIdx;
  }

  // 每日任务：每过1个游戏天即刷新（跟随 edS.gameDay）
  if (todayIdx > ProceduralQuestState.lastDailyRefreshDay) {
    refreshDailies(playerLevel, currentCity);
    ProceduralQuestState.lastDailyRefreshDay = todayIdx;
  }

  cleanupExpiredQuests();
  saveProceduralQuestState();
}

// ════════════════════════════════════════════════════════
//  每日活跃系统
// ════════════════════════════════════════════════════════

function loadDailyActivity() {
  try {
    const raw = localStorage.getItem(DAILY_ACTIVITY_KEY);
    if (raw) _dailyActivity = JSON.parse(raw);
    // 跨日重置
    const today = _todayStr();
    if (_dailyActivity.lastDate !== today) {
      _dailyActivity = { points: 0, claims: {}, lastDate: today };
      saveDailyActivity();
    }
  } catch (e) {
    _dailyActivity = { points: 0, claims: {}, lastDate: _todayStr() };
  }
}

function saveDailyActivity() {
  localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(_dailyActivity));
}

function _todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/** 每次完成赏金任务时调用，累加活跃积分 */
function addDailyActivityPoint() {
  if (_dailyActivity.points >= 10) return;
  _dailyActivity.points = Math.min(10, _dailyActivity.points + 1);
  saveDailyActivity();
  // 刷新状态栏显示（若可用）
  if (typeof refreshDailyActivityUI === 'function') refreshDailyActivityUI();
  // 检查是否有新可领取奖励
  if (typeof checkDailyActivityNotify === 'function') checkDailyActivityNotify();
}

/** 零点检查：每日首次操作时检查是否跨日 */
function tickDailyActivity() {
  const today = _todayStr();
  if (_dailyActivity.lastDate !== today) {
    _dailyActivity = { points: 0, claims: {}, lastDate: today };
    saveDailyActivity();
  }
}

/** 尝试领取某档奖励 */
function claimDailyActivity(level) {
  if (_dailyActivity.points < level) return false;
  if (_dailyActivity.claims[level]) return false;
  const reward = DAILY_ACTIVITY_REWARDS.find(r => r.level === level);
  if (!reward) return false;
  _dailyActivity.claims[level] = true;
  if (typeof addSilver === 'function') addSilver(reward.silver);
  if (typeof addPlayerExp === 'function') {
    addPlayerExp(reward.exp, '活跃奖励');
  }
  // 活跃宝箱物品掉落
  let dropMsg = '';
  if (reward.dropPool && reward.dropPool.length > 0 && typeof edS !== 'undefined') {
    if (!edS.bag) edS.bag = [];
    // 从掉落池随机选1个物品
    const drop = reward.dropPool[Math.floor(Math.random() * reward.dropPool.length)];
    const bagItem = {
      instId: 'daily_' + level + '_' + Date.now(),
      type: drop.type,
      templateId: drop.templateId,
      name: drop.name,
      icon: drop.icon,
      identified: true,
      affixes: drop.affixes || [],
      effect: drop.effect || undefined
    };
    edS.bag.push(bagItem);
    if (typeof bagSave === 'function') bagSave();
    dropMsg = ` 物品:${drop.icon}${drop.name}`;
  }
  saveDailyActivity();
  if (typeof showToast === 'function') {
    showToast(`🎉 活跃奖励：${reward.label}！银两+${reward.silver} 经验+${reward.exp}${dropMsg}`);
  }
  return true;
}

/** 获取当前活跃状态（供 UI 调用） */
function getDailyActivityState() {
  return {
    points: _dailyActivity.points,
    claims: { ..._dailyActivity.claims },
    canClaim: DAILY_ACTIVITY_LEVELS.filter(l => _dailyActivity.points >= l && !_dailyActivity.claims[l]),
    allClaimed: DAILY_ACTIVITY_LEVELS.every(l => _dailyActivity.claims[l]),
    levels: DAILY_ACTIVITY_LEVELS,
    rewards: DAILY_ACTIVITY_REWARDS,
  };
}

/** 渲染每日活跃区块 HTML */
function renderDailyActivity() {
  const st = getDailyActivityState();
  let html = '<div class="da-section">';
  html += `<div class="da-title">🔥 每日活跃 · ${st.points}/10分</div>`;
  // 进度条
  html += `<div class="da-bar-wrap"><div class="da-bar-fill" style="width:${st.points*10}%"></div></div>`;
  // 四个档位
  html += '<div class="da-levels">';
  st.levels.forEach((level, i) => {
    const r = st.rewards[i];
    const claimed = st.claims[level];
    const unlocked = st.points >= level;
    const cls = claimed ? 'da-level-claimed' : unlocked ? 'da-level-unlocked' : 'da-level-locked';
    const icon = claimed ? '✓' : r.icon;
    const onclick = (unlocked && !claimed)
      ? `onclick="claimDailyActivity(${level})"`
      : '';
    const cursor = (unlocked && !claimed) ? 'cursor:pointer' : '';
    html += `<div class="da-level ${cls}" style="${cursor}" ${onclick}>
      <div class="da-level-icon">${icon}</div>
      <div class="da-level-info">
        <div class="da-level-name">${r.label}</div>
        <div class="da-level-req">${level}分</div>
      </div>
      ${claimed ? '<div class="da-level-check">✓</div>' : ''}
    </div>`;
  });
  html += '</div>';
  html += '</div>';
  return html;
}

// ── 刷新通缉令 ──
function refreshBounties(playerLevel, city) {
  const claimable = ProceduralQuestState.bounties.filter(q => q.status === 'done' && !q.claimed);
  const newCount = Math.min(3, 5 - claimable.length);
  
  for (let i = 0; i < newCount; i++) {
    const quest = generateBountyQuest(playerLevel, city);
    if (quest) ProceduralQuestState.bounties.push(quest);
  }
  
  const now = Date.now();
  ProceduralQuestState.bounties = ProceduralQuestState.bounties.filter(q => 
    !q.expireTime || q.expireTime > now || (q.status === 'done' && !q.claimed)
  );
}

// ── 刷新每日 ──
function refreshDailies(playerLevel, city) {
  ProceduralQuestState.dailies = generateDailyQuests(playerLevel, city, 3);
}

// ── 清理过期 ──
function cleanupExpiredQuests() {
  const now = Date.now();
  ProceduralQuestState.bounties = ProceduralQuestState.bounties.filter(q => 
    !q.expireTime || q.expireTime > now || (q.status === 'done' && !q.claimed)
  );
  ProceduralQuestState.dailies = ProceduralQuestState.dailies.filter(q => 
    !q.expireTime || q.expireTime > now || (q.status === 'done' && !q.claimed)
  );
}

// ── 更新击杀进度 ──
function updateQuestProgressOnKill(enemyType, enemyTier) {
  let updated = false;
  
  ProceduralQuestState.bounties.forEach(q => {
    if (q.type === 'kill' && q.status !== 'done' && !q.claimed) {
      if (q.targetType === enemyTier || q.targetType === enemyType) {
        q.count = (q.count || 0) + 1;
        if (q.count >= q.required) q.status = 'done';
        updated = true;
      }
    }
  });
  
  ProceduralQuestState.dailies.forEach(q => {
    if (q.type === 'kill' && q.status !== 'done' && !q.claimed) {
      if (q.enemy === enemyType) {
        q.count = (q.count || 0) + 1;
        if (q.count >= q.required) q.status = 'done';
        updated = true;
      }
    }
  });
  
  if (updated) saveProceduralQuestState();
}

// ── 更新采集进度 ──
function updateCollectProgress(itemName) {
  let updated = false;
  
  [...ProceduralQuestState.dailies, ...ProceduralQuestState.bounties].forEach(q => {
    if (q.type === 'collect' && q.status !== 'done' && !q.claimed) {
      if (q.item === itemName || itemName.includes(q.item)) {
        q.count = (q.count || 0) + 1;
        if (q.count >= q.required) q.status = 'done';
        updated = true;
      }
    }
  });
  
  if (updated) saveProceduralQuestState();
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"动态任务奖励系统
// ═══════════════════════════════════════════════════════════════
const QUEST_JIANGHU_EVENTS = {
  windfall: {
    id: 'windfall', chance: 0.04, icon: '💰', title: '意外之财',
    desc: '任务委托人心情大好，额外给了赏钱',
    effect: (silver) => ({ silver: Math.round(silver * 2), exp: 0, msg: '💰 意外之财！委托人额外给了双倍银两！' }),
  },
  generous: {
    id: 'generous', chance: 0.05, icon: '🎁', title: '慷慨委托人',
    desc: '委托人很满意，多给了经验奖励',
    effect: (silver, exp) => ({ silver: 0, exp: Math.round(exp * 1.5), msg: '🎁 慷慨委托人！额外获得50%经验！' }),
  },
  tightfisted: {
    id: 'tightfisted', chance: 0.05, icon: '💸', title: '委托人手头紧',
    desc: '委托人似乎手头不宽裕，奖励打了折扣',
    effect: (silver, exp) => ({ silver: Math.round(silver * 0.6), exp: Math.round(exp * 0.7), msg: '💸 委托人手头紧，奖励减少了...' }),
  },
  bonusItem: {
    id: 'bonusItem', chance: 0.03, icon: '✨', title: '额外谢礼',
    desc: '委托人额外赠送了一件物品',
    effect: () => ({ item: true, msg: '✨ 委托人额外赠送了一件谢礼！' }),
  },
};

function _checkQuestJianghuEvent(baseSilver, baseExp) {
  const roll = Math.random();
  let cumulative = 0;
  
  for (const key in QUEST_JIANGHU_EVENTS) {
    const evt = QUEST_JIANGHU_EVENTS[key];
    cumulative += evt.chance;
    if (roll < cumulative) {
      return { ...evt, result: evt.effect(baseSilver, baseExp) };
    }
  }
  return null;
}

function _showQuestJianghuEvent(event, finalRewards) {
  if (typeof showToast !== 'function') return;
  
  const rarityColors = {
    windfall: '#ffd700',
    generous: '#4ecdc4',
    tightfisted: '#ff6b6b',
    bonusItem: '#a78bfa',
  };
  
  const color = rarityColors[event.id] || '#d4c4a0';
  
  // 创建特殊弹窗
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: linear-gradient(135deg, rgba(30,25,20,0.98), rgba(40,35,30,0.98));
    border: 2px solid ${color}; border-radius: 16px; padding: 24px;
    max-width: 360px; width: 90%; z-index: 10000;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${color}40;
    animation: questEventPop 0.4s ease-out;
  `;
  
  popup.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">${event.icon}</div>
      <div style="font-size: 20px; font-weight: bold; color: ${color}; margin-bottom: 8px;">${event.title}</div>
      <div style="font-size: 14px; color: #a09070; margin-bottom: 16px;">${event.desc}</div>
      <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px; margin-bottom: 16px;">
        <div style="font-size: 13px; color: #d4c4a0;">${event.result.msg}</div>
        ${event.result.silver ? `<div style="font-size: 12px; color: #ffd700; margin-top: 8px;">💰 银两: ${finalRewards.silver}两</div>` : ''}
        ${event.result.exp ? `<div style="font-size: 12px; color: #4ecdc4; margin-top: 4px;">✨ 经验: ${finalRewards.exp}点</div>` : ''}
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: linear-gradient(90deg, ${color}40, ${color}20);
        border: 1px solid ${color}; color: ${color}; padding: 10px 24px;
        border-radius: 8px; cursor: pointer; font-size: 14px;
      ">确认</button>
    </div>
  `;
  
  // 添加动画样式
  if (!document.getElementById('quest-event-anim')) {
    const style = document.createElement('style');
    style.id = 'quest-event-anim';
    style.textContent = `
      @keyframes questEventPop {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.05); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(popup);
  
  // 3秒后自动关闭
  setTimeout(() => popup.remove(), 3000);
}

// ── 领取奖励 ──
function claimProceduralQuest(questId) {
  let quest = null, source = '';
  
  quest = ProceduralQuestState.bounties.find(q => q.id === questId);
  if (quest) source = 'bounties';
  else {
    quest = ProceduralQuestState.dailies.find(q => q.id === questId);
    if (quest) source = 'dailies';
  }
  
  if (!quest || quest.status !== 'done' || quest.claimed) {
    return { success: false, message: '无法领取' };
  }
  
  quest.claimed = true;
  
  // 活跃积分 +1（赏金任务完成）
  addDailyActivityPoint();
  
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"任务奖励随机事件
  // ═══════════════════════════════════════════════════════════════
  const baseSilver = quest.reward.silver || 0;
  const baseExp = quest.reward.exp || 0;
  let finalSilver = baseSilver;
  let finalExp = baseExp;
  let bonusItem = null;
  
  const jhEvent = _checkQuestJianghuEvent(baseSilver, baseExp);
  if (jhEvent) {
    if (jhEvent.result.silver) finalSilver = jhEvent.result.silver;
    if (jhEvent.result.exp) finalExp = jhEvent.result.exp;
    if (jhEvent.result.item) {
      // 随机奖励物品
      const bonusItems = [
        { id: 'item_heal_low', name: '金疮药', icon: '🩹' },
        { id: 'item_food_ration', name: '干粮', icon: '🥖' },
        { id: 'item_drink_water', name: '清水', icon: '💧' },
        { id: 'item_elixir_low', name: '小还丹', icon: '💊' },
      ];
      bonusItem = bonusItems[Math.floor(Math.random() * bonusItems.length)];
    }
    
    // 显示事件弹窗
    setTimeout(() => {
      _showQuestJianghuEvent(jhEvent, { silver: finalSilver, exp: finalExp });
    }, 300);
  }
  
  if (finalSilver > 0 && typeof addSilver === 'function') addSilver(finalSilver);
  if (finalExp > 0 && typeof addPlayerExp === 'function') {
    addPlayerExp(finalExp, '赏金任务');
  }
  if (bonusItem && typeof consumableBagAdd === 'function') {
    consumableBagAdd(bonusItem.id, 1);
    setTimeout(() => showToast(`📦 获得额外谢礼：${bonusItem.icon}${bonusItem.name}！`, 'success'), 600);
  }
  
  if (source === 'bounties') ProceduralQuestState.bounties = ProceduralQuestState.bounties.filter(q => q.id !== questId);
  else ProceduralQuestState.dailies = ProceduralQuestState.dailies.filter(q => q.id !== questId);
  
  saveProceduralQuestState();
  return { success: true, rewards: { silver: finalSilver, exp: finalExp, item: bonusItem } };
}

// ── 尝试触发奇遇 ──
function tryTriggerEncounter(zone) {
  const now = Date.now();
  if (now - (ProceduralQuestState.lastEncounterCheck || 0) < 30 * 60 * 1000) return null;
  if (Math.random() > 0.3) return null;
  
  ProceduralQuestState.lastEncounterCheck = now;
  const playerLevel = typeof edS !== 'undefined' ? (edS.level || 1) : 1;
  return triggerRandomEncounter(playerLevel, zone);
}

// ── 渲染任务列表 ──
function renderProceduralQuests() {
  let html = '';
  
  if (ProceduralQuestState.bounties.length) {
    html += '<div class="quest-section"><div class="section-title" style="color:#ff6b6b">🔴 通缉令</div>';
    ProceduralQuestState.bounties.forEach(q => {
      const prog = q.count !== undefined ? `${q.count}/${q.required}` : '';
      const done = q.status === 'done';
      let actionBtn = '';
      if (done && !q.claimed) {
        actionBtn = `<button class="btn-claim" onclick="claimProceduralQuest('${q.id}')">🎁 领取</button>`;
      } else if (!done && q.type === 'duel' && !q.duelPending) {
        actionBtn = `<button class="btn-claim" style="background:rgba(200,80,0,.5);border-color:#ff8040" onclick="startDuelQuest('${q.id}')">⚔️ 出战</button>`;
      } else if (!done && q.type === 'escort') {
        actionBtn = `<button class="btn-claim" style="background:rgba(0,120,80,.5);border-color:#40ff80;font-size:10px" onclick="showToast&&showToast('🛡 抵达目标城市后自动完成护送', \'info\')">🛡 护送中</button>`;
      }
      const typeTag = q.type === 'duel' ? '<span style="color:#ff8040;font-size:10px">⚔️决斗</span>' :
                      q.type === 'escort' ? '<span style="color:#40ff80;font-size:10px">🛡护送</span>' : '';
      html += `<div class="quest-item ${done ? 'quest-done' : ''}">
        <div class="quest-title">${typeTag} ${q.title}</div>
        <div class="quest-desc">${q.desc}</div>
        <div class="quest-meta">
          <span>🎁 ${q.reward.silver}两 / ${q.reward.exp}经验</span>
          ${prog ? `<span>[${prog}]</span>` : ''}
          ${actionBtn}
        </div>
      </div>`;
    });
    html += '</div>';
  }
  
  if (ProceduralQuestState.dailies.length) {
    html += '<div class="quest-section"><div class="section-title" style="color:#4ecdc4">📋 每日委托</div>';
    ProceduralQuestState.dailies.forEach(q => {
      const done = q.status === 'done';
      let actionBtn = '';
      if (done && !q.claimed) {
        actionBtn = `<button class="btn-claim" onclick="claimProceduralQuest('${q.id}')">🎁 领取</button>`;
      } else if (!done && q.type === 'duel' && !q.duelPending) {
        actionBtn = `<button class="btn-claim" style="background:rgba(200,80,0,.5);border-color:#ff8040" onclick="startDuelQuest('${q.id}')">⚔️ 出战</button>`;
      } else if (!done && q.type === 'escort') {
        actionBtn = `<button class="btn-claim" style="background:rgba(0,120,80,.5);border-color:#40ff80;font-size:10px" onclick="showToast&&showToast('🛡 前往目标城市即可完成护送', \'info\')">🛡 查看</button>`;
      }
      const typeTag = q.type === 'duel' ? '<span style="color:#ff8040;font-size:10px">⚔️决斗 </span>' :
                      q.type === 'escort' ? '<span style="color:#40ff80;font-size:10px">🛡护送 </span>' : '';
      html += `<div class="quest-item ${done ? 'quest-done' : ''}">
        <div class="quest-title">${typeTag}${q.desc.split('：')[0]}</div>
        <div class="quest-desc">${q.desc}</div>
        <div class="quest-meta">
          <span>🎁 ${q.reward.silver}两 / ${q.reward.exp}经验</span>
          <span>[${q.count}/${q.required}]</span>
          ${actionBtn}
        </div>
      </div>`;
    });
    html += '</div>';
  }
  
  return html || '<div class="empty-msg">暂无动态任务</div>';
}

// ── 获取统计 ──
function getProceduralQuestStats() {
  const bounties = ProceduralQuestState.bounties;
  const dailies = ProceduralQuestState.dailies;
  
  return {
    total: bounties.length + dailies.length,
    available: [...bounties, ...dailies].filter(q => q.status !== 'done').length,
    completable: [...bounties, ...dailies].filter(q => q.status === 'done' && !q.claimed).length,
    claimed: [...bounties, ...dailies].filter(q => q.claimed).length
  };
}

// ── 暴露给 onclick 使用 ──
window.renderDailyActivity      = renderDailyActivity;
window.getDailyActivityState    = getDailyActivityState;
window.claimDailyActivity       = claimDailyActivity;
window.loadDailyActivity        = loadDailyActivity;
window.refreshDailyActivityUI   = refreshDailyActivityUI;

/** 检查是否有可领取的活跃奖励并提示（赏金任务完成时调用） */
function checkDailyActivityNotify() {
  const st = getDailyActivityState();
  if (st.canClaim.length > 0) {
    if (typeof showToast === 'function') {
      showToast(`🎁 活跃奖励可领取！完成 ${st.points} 赏金，去领奖励吧`);
    }
  }
}
window.checkDailyActivityNotify = checkDailyActivityNotify;

/** 刷新状态栏活跃度进度条（由 townRefreshStatus 调用） */
function refreshDailyActivityUI() {
  const wrap = document.getElementById('tsbDailyActWrap');
  const bar  = document.getElementById('tsbDaBar');
  const lbl  = document.getElementById('tsbDaLabel');
  const note = document.getElementById('tsbDaCanClaim');
  if (!wrap || !bar || !lbl) return;
  const st = getDailyActivityState();
  const pct = st.points * 10;
  bar.style.width = pct + '%';
  lbl.textContent = `🔥 今日活跃 ${st.points}/10`;
  wrap.style.display = 'block';
  if (note) {
    note.style.display = st.canClaim.length > 0 ? 'inline' : 'none';
  }
}

// ════════════════════════════════════════════════════════
//  护送任务（escort）触发与完成系统
// ════════════════════════════════════════════════════════

/**
 * 尝试触发护送任务进度
 * 当玩家进入新城市时调用（city = 目标城市id）
 */
function tryCompleteEscortQuest(arrivalCity) {
  let updated = false;
  const allQuests = [...ProceduralQuestState.bounties, ...ProceduralQuestState.dailies];
  allQuests.forEach(q => {
    if (q.type !== 'escort' || q.status === 'done' || q.claimed) return;
    // 判断到达城市是否匹配（宽松匹配：包含目标城市关键词）
    const target = (q.toCity || q.desc || '').toLowerCase();
    const arrival = arrivalCity.toLowerCase();
    const cityMap = {
      luoyang:'洛阳', kaifeng:'开封', yangzhou:'扬州', hangzhou:'杭州',
      cangzhou:'沧州', chengdu:'成都', changan:'长安', youzhou:'幽州',
      suzhou:'苏州', dalis:'大理', nanjing:'南京',
    };
    const targetCn = cityMap[arrivalCity] || arrivalCity;
    if (target.includes(targetCn) || target.includes(arrivalCity)) {
      q.status = 'done';
      q.count = 1;
      updated = true;
      if (typeof showToast === 'function') {
        showToast(`🛡 护送完成！${q.desc.slice(0,20)}… 可以领取赏金了`, 'good');
      }
    }
  });
  if (updated) saveProceduralQuestState();
}

/**
 * 护送任务出发时，显示叙事弹窗
 * 在接取护送任务后、离开城市前调用
 */
function showEscortDepartNarrative(quest) {
  if (!quest || quest.type !== 'escort') return;
  const narratives = [
    `你接下了护送委托。被护送者整理好行囊，满怀感激地看着你："有劳少侠一路照看了。"`,
    `委托人拱手道："前路凶险，少侠请多留神。"你点头，迈步出发。`,
    `被护送者略显紧张，但见你一副成竹在胸的样子，渐渐放松了些。`,
    `"少侠名声在外，有你护送，某家放心多了。"委托人笑道，随即一同上路。`,
  ];
  const text = narratives[Math.floor(Math.random() * narratives.length)];
  if (typeof showToast === 'function') showToast(`🛡 ${text}`, 'info', 3500);
}

// ════════════════════════════════════════════════════════
//  擂台决斗（duel）触发与完成系统
// ════════════════════════════════════════════════════════

/**
 * 接受擂台任务后触发战斗
 * 生成一个对应等级的擂台对手并开始战斗
 */
function startDuelQuest(questId) {
  const allQuests = [...ProceduralQuestState.bounties, ...ProceduralQuestState.dailies];
  const q = allQuests.find(q => q.id === questId);
  if (!q || q.type !== 'duel') return;
  if (q.status === 'done' || q.claimed) {
    if (typeof showToast === 'function') showToast('此擂台挑战已完成');
    return;
  }

  // 显示决斗开场白
  const narratives = [
    q.duelNarrative,
    '对方抱拳行礼后，缓缓拉开了架势，眼神中带着不容小觑的锐气。',
    '擂台之上，观众纷纷叫好。对手凛然而立，等待你的出击。',
    '一阵锣声响起，决斗正式开始！',
  ].filter(Boolean);
  const narrative = narratives[Math.floor(Math.random() * narratives.length)];
  if (typeof showToast === 'function') showToast(`⚔️ 擂台：${narrative}`, 'warn', 3000);

  // 标记为"进行中"，等待战斗胜利后完成
  q.duelPending = true;
  saveProceduralQuestState();

  // 触发战斗（与对应等级NPC战斗）
  const playerLevel = (typeof edS !== 'undefined' ? edS.level : 1) || 1;
  const tier = q.enemy || 'func';
  setTimeout(() => {
    if (typeof triggerDuelBattle === 'function') {
      triggerDuelBattle(questId, tier, playerLevel, q);
    } else {
      // 兜底：如果没有专用战斗函数，直接触发普通战斗
      if (typeof showToast === 'function') showToast('⚔️ 前往险地挑战擂台对手！', 'warn');
    }
  }, 3200);
}

/**
 * 战斗胜利后完成决斗任务
 * 在 battle.js 的 checkWin 中调用
 */
function completeDuelQuest() {
  let updated = false;
  const allQuests = [...ProceduralQuestState.bounties, ...ProceduralQuestState.dailies];
  allQuests.forEach(q => {
    if (q.type !== 'duel' || !q.duelPending || q.status === 'done') return;
    q.status = 'done';
    q.count = 1;
    q.duelPending = false;
    updated = true;
    if (typeof showToast === 'function') {
      showToast(`🏆 擂台胜利！任务完成，可领取赏金！`, 'good');
    }
    addDailyActivityPoint();
    checkDailyActivityNotify();
  });
  if (updated) saveProceduralQuestState();
  return updated;
}

window.tryCompleteEscortQuest = tryCompleteEscortQuest;
window.showEscortDepartNarrative = showEscortDepartNarrative;
window.startDuelQuest = startDuelQuest;
window.completeDuelQuest = completeDuelQuest;
