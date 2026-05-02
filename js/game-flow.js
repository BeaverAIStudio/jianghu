// ════════════════════════════════════════════════════════════════
//  game-flow.js  游戏流程管理系统
//  负责：主菜单、新手引导、任务指引、功能解锁
// ════════════════════════════════════════════════════════════════

// ── 游戏全局状态 ──
const GAME_STATE_KEY = 'wuxia_game_state';
const PLAYER_PROFILE_KEY = 'wuxia_player_profile';  // 独立存档：玩家名称+核心属性
let gameState = {
  isNewPlayer: true,          // 是否新玩家
  currentMainQuest: 'mq_act1_start',  // 当前主线任务
  unlockedFeatures: [],       // 已解锁功能
  tutorialStep: 0,            // 新手引导步骤
  playTime: 0,                // 游戏时长（分钟）
  lastSaveTime: null,         // 最后存档时间
};

// ════════════════════════════════════════════════════════════════
//  统一银两管理系统 - 解决两套银两状态问题
// ════════════════════════════════════════════════════════════════

/**
 * 统一银两管理器
 * 所有银两操作必须通过此模块进行，自动同步两套状态
 * 优先使用 travelPlayerState.silver 作为主存储
 */
const SilverManager = {
  // 获取当前银两（优先从 travelPlayerState，其次 edS，最后默认200）
  get() {
    // 优先使用 travelPlayerState（旅行/城市界面）
    if (typeof travelPlayerState !== 'undefined' && travelPlayerState.silver !== undefined) {
      return travelPlayerState.silver;
    }
    // 其次使用 edS（战斗/编辑器系统）
    if (typeof edS !== 'undefined' && edS.silver !== undefined) {
      return edS.silver;
    }
    return 200; // 默认值
  },

  // 设置银两（同步两套状态）
  set(value) {
    const newValue = Math.max(0, Math.min(99999, Math.floor(value)));
    
    // 同步到 travelPlayerState
    if (typeof travelPlayerState !== 'undefined') {
      travelPlayerState.silver = newValue;
    }
    
    // 同步到 edS
    if (typeof edS !== 'undefined') {
      edS.silver = newValue;
    }
    
    return newValue;
  },

  // 增加银两（正数）或减少（负数）
  add(delta) {
    const current = this.get();
    const newVal = this.set(current + delta);
    this.save();  // 持久化到 localStorage
    return newVal;
  },

  // 检查是否足够
  has(amount) {
    return this.get() >= amount;
  },

  // 消费银两（返回是否成功）
  spend(amount) {
    if (!this.has(amount)) return false;
    this.add(-amount);
    return true;
  },

  // 保存银两状态
  save() {
    // 保存 travelPlayerState
    if (typeof travelSave === 'function') {
      travelSave();
    }
    // 保存 edS
    if (typeof editorSave === 'function') {
      editorSave();
    } else if (typeof saveGameState === 'function') {
      saveGameState();
    }
  },

  // 从存档恢复时同步两套状态
  sync() {
    const travelSilver = (typeof travelPlayerState !== 'undefined') ? travelPlayerState.silver : undefined;
    const edSilver = (typeof edS !== 'undefined') ? edS.silver : undefined;
    
    // 如果两者都有值，取最大值（防止数据丢失）
    if (travelSilver !== undefined && edSilver !== undefined) {
      const maxSilver = Math.max(travelSilver, edSilver);
      this.set(maxSilver);
    }
    // 如果只有一个有值，同步到另一个
    else if (travelSilver !== undefined) {
      this.set(travelSilver);
    }
    else if (edSilver !== undefined) {
      this.set(edSilver);
    }
  }
};

// 全局快捷函数（方便调用）
function getSilver() { return SilverManager.get(); }
function setSilver(v) { return SilverManager.set(v); }
function addSilver(delta) { return SilverManager.add(delta); }
function hasSilver(amount) { return SilverManager.has(amount); }
function spendSilver(amount) { return SilverManager.spend(amount); }

// ── 功能解锁配置 ──
const FEATURE_UNLOCKS = [
  // 基础功能（默认解锁）
  { id: 'combat',     name: '武斗场',      level: 1,  desc: '基础战斗系统', default: true },
  { id: 'travel',     name: '江湖舆图',    level: 1,  desc: '旅行探索系统', default: true },
  { id: 'inn',        name: '旅店',        level: 1,  desc: '住宿恢复', default: true },
  { id: 'shop',       name: '商店',        level: 1,  desc: '购买物品', default: true },
  { id: 'hospital',   name: '医馆',        level: 1,  desc: '治疗伤势', default: true },
  
  // 等级解锁功能
  { id: 'dungeon',    name: '险地探索',    level: 3,  desc: '地下城挑战', hint: '等级达到3级解锁' },
  { id: 'fishing',    name: '钓鱼',        level: 5,  desc: '垂钓玩法', hint: '等级达到5级解锁', terrain: '水域' },
  { id: 'gambling',   name: '赌坊',        level: 8,  desc: '猜大小游戏', hint: '等级达到8级解锁', city: '大城市' },
  { id: 'arena',      name: '江湖擂台',    level: 10, desc: '比武切磋', hint: '等级达到10级解锁' },
  { id: 'pitchpot',   name: '酒馆投壶',    level: 12, desc: '投掷游戏', hint: '等级达到12级解锁', city: '有酒馆的城市' },
  { id: 'cricket',    name: '斗蛐蛐',      level: 15, desc: '斗蛐蛐游戏', hint: '等级达到15级解锁', city: '大城市' },
  { id: 'go',         name: '棋社对弈',    level: 18, desc: '五子棋游戏', hint: '等级达到18级解锁，需要悟性≥30', city: '有棋社的城市', reqWisdom: 30 },
  { id: 'herbalism',  name: '采药制药',    level: 22, desc: '采集炼制', hint: '等级达到22级解锁', city: '草药店城市' },
  { id: 'forge',      name: '打铁锻造',    level: 25, desc: '武器打造', hint: '等级达到25级解锁', city: '铁匠铺城市' },
  { id: 'escort',     name: '护镖任务',    level: 30, desc: '押镖玩法', hint: '等级达到30级解锁' },
  { id: 'sect',       name: '门派系统',    level: 5,  desc: '加入门派', hint: '等级达到5级解锁' },
  { id: 'crafting',   name: '炼物阁',      level: 12, desc: '合成系统', hint: '等级达到12级解锁' },
  { id: 'blacksmith', name: '铁匠铺',      level: 1,  desc: '装备强化', default: true },
  { id: 'market',     name: '集市',        level: 1,  desc: '交易市场', default: true },
  { id: 'guild',      name: '镖局',        level: 30, desc: '镖局任务', hint: '等级达到30级解锁' },
  { id: 'tavern',     name: '酒馆',        level: 8,  desc: '酒馆服务', hint: '等级达到8级解锁' },
  { id: 'chess',      name: '棋社',        level: 18, desc: '棋社对弈', hint: '等级达到18级解锁', reqWisdom: 30 },
];

// ── 保存/加载游戏状态 ──
function saveGameState() {
  try {
    gameState.lastSaveTime = new Date().toISOString();
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    localStorage.setItem(TRAVEL_STATE_KEY, JSON.stringify({
      city: travelCurrentCity,
      history: travelHistory,
      eventLog: travelEventLog,
      state: travelPlayerState,
    }));
    if (typeof edS !== 'undefined') {
      localStorage.setItem('wuxia_editor', JSON.stringify(edS));
    }
    // 独立保存玩家档案（名称+核心属性），确保跨页面可靠读取
    if (typeof edS !== 'undefined') {
      try {
        const profile = {
          name: edS.name || '',
          level: edS.level || 1,
          hp: edS.hp || 0,
          maxHp: edS.maxHp || 0,
          mp: edS.mp || 0,
          maxMp: edS.maxMp || 0,
          silver: getSilver(), // 使用统一银两管理器获取
          totalExp: edS.totalExp || 0, // 保存经验值
        };
        localStorage.setItem(PLAYER_PROFILE_KEY, JSON.stringify(profile));
      } catch(e) {}
    }
    // 同时保存到 wuxia_player_progress（确保兼容性）
    if (typeof edS !== 'undefined') {
      try {
        const progress = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
        progress.level = edS.level || 1;
        progress.totalExp = edS.totalExp || 0;
        progress.primaryPts = edS.primaryPts;
        progress.freePoints = edS.freePoints;
        progress.fate = edS.fate;
        if (edS.originPts) progress.originPts = edS.originPts;
        localStorage.setItem('wuxia_player_progress', JSON.stringify(progress));
      } catch(e) {}
    }
    showToast('[OK] 游戏已保存', 2000);
  } catch (e) {
    console.error('保存失败:', e);
  }
}

function loadGameState() {
  try {
    // 加载游戏流程状态
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      gameState = Object.assign(gameState, loaded);
    }
    
    // 加载旅行状态
    travelLoad();
    
    // 加载角色状态（跳过 getter 属性避免 setter-only 报错）
    if (typeof edS !== 'undefined') {
      const edRaw = localStorage.getItem('wuxia_editor');
      if (edRaw) {
        const edData = JSON.parse(edRaw);
        // edS.weaponId / edS.costumeId 是只读 getter，Object.assign 不能覆盖
        // 改为逐字段赋值，跳过 getter
        const getterKeys = [];
        const desc = Object.getOwnPropertyDescriptors(edS);
        for (const k of Object.keys(desc)) {
          if (typeof desc[k].get === 'function' && typeof desc[k].set !== 'function') getterKeys.push(k);
        }
        for (const [k, v] of Object.entries(edData)) {
          if (!getterKeys.includes(k)) edS[k] = v;
        }
      }
      // 独立恢复玩家档案（优先级最高，确保 name 可靠）
      const profileRaw = localStorage.getItem(PLAYER_PROFILE_KEY);
      if (profileRaw) {
        try {
          const profile = JSON.parse(profileRaw);
          if (profile.name) edS.name = profile.name;
        } catch(e) {}
      }
    }
    
    // 同步银两状态（统一管理系统）
    SilverManager.sync();
    
    return true;
  } catch (e) {
    console.error('加载失败:', e);
    return false;
  }
}

// ── 检查功能是否解锁 ──
function isFeatureUnlocked(featureId) {
  const feature = FEATURE_UNLOCKS.find(f => f.id === featureId);
  if (!feature) return false;
  
  // 默认解锁的功能
  if (feature.default) return true;
  
  // 检查等级要求
  const playerLevel = typeof edS !== 'undefined' ? (edS.level || 1) : 1;
  if (playerLevel < feature.level) return false;
  
  // 检查悟性要求（棋社等）
  if (feature.reqWisdom && typeof edS !== 'undefined') {
    // 悟性 = int（智力）+ wis（意志相关）
    const wisdom = (edS.int || 0) + (edS.wis || 0) + (edS.originPts?.inner || 0);
    if (wisdom < feature.reqWisdom) return false;
  }
  
  // 检查是否已在解锁列表中
  if (gameState.unlockedFeatures.includes(featureId)) return true;
  
  // 等级满足且没有其他特殊限制，自动解锁
  return true;
}

// ── 获取功能解锁信息 ──
function getFeatureUnlockInfo(featureId) {
  const feature = FEATURE_UNLOCKS.find(f => f.id === featureId);
  if (!feature) return null;
  
  const playerLevel = typeof edS !== 'undefined' ? (edS.level || 1) : 1;
  const isUnlocked = isFeatureUnlocked(featureId);
  
  return {
    ...feature,
    isUnlocked,
    levelRequired: feature.level,
    playerLevel,
    canUnlock: playerLevel >= feature.level && !isUnlocked
  };
}

// ── 检查并自动解锁功能（在升级时调用）──
function checkAndAutoUnlockFeatures() {
  const playerLevel = typeof edS !== 'undefined' ? (edS.level || 1) : 1;
  let newUnlocks = [];
  
  for (const feature of FEATURE_UNLOCKS) {
    if (feature.default) continue; // 跳过默认解锁的
    if (gameState.unlockedFeatures.includes(feature.id)) continue; // 已解锁
    
    // 检查等级条件
    if (playerLevel >= feature.level) {
      // 检查其他条件
      let canUnlock = true;
      
      if (feature.reqWisdom && typeof edS !== 'undefined') {
        const wisdom = (edS.int || 0) + (edS.wis || 0) + (edS.originPts?.inner || 0);
        if (wisdom < feature.reqWisdom) canUnlock = false;
      }
      
      if (canUnlock) {
        gameState.unlockedFeatures.push(feature.id);
        newUnlocks.push(feature);
      }
    }
  }
  
  // 如果有新解锁的功能，显示提示
  if (newUnlocks.length > 0) {
    saveGameState();
    // 延迟显示解锁提示
    setTimeout(() => {
      for (const feature of newUnlocks) {
        showToast(`✨ 解锁新功能：${feature.name} - ${feature.desc}`, 4000);
      }
    }, 1000);
  }
  
  return newUnlocks;
}

// ── 解锁功能 ──
function unlockFeature(featureId) {
  if (!gameState.unlockedFeatures.includes(featureId)) {
    gameState.unlockedFeatures.push(featureId);
    const feature = FEATURE_UNLOCKS.find(f => f.id === featureId);
    if (feature) {
      showToast(`✨ 解锁新功能：${feature.name}`, 3000);
      // 播放解锁特效
      if (typeof SoundFX !== 'undefined') {
        SoundFX.play('unlock');
      }
    }
    saveGameState();
  }
}

// ── 游戏主菜单 ──
function showMainMenu() {
  // 检查是否有存档
  const hasSave = localStorage.getItem(GAME_STATE_KEY) !== null;
  
  const overlay = document.createElement('div');
  overlay.id = 'mainMenuOverlay';
  overlay.className = 'sq-overlay';
  overlay.style.background = 'rgba(0,0,0,.95)';
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:500px;text-align:center">
      <div style="font-size:48px;margin-bottom:20px;color:#f0c060;font-family:monospace">+!+</div>
      <div style="font-size:28px;color:#ffd060;letter-spacing:4px;margin-bottom:10px">江湖将将胡</div>
      <div style="font-size:12px;color:rgba(200,170,80,.5);letter-spacing:2px;margin-bottom:30px">
        · 字符武侠 · 奇遇江湖 · 江湖百态 · 侠骨柔情 ·
      </div>
      
      <div style="display:flex;flex-direction:column;gap:12px;max-width:300px;margin:0 auto">
        ${hasSave ? `
          <button class="mqn-btn mqn-btn-ok" onclick="continueGame()" style="font-size:14px;padding:14px">
            [>] 继续江湖路
            <div style="font-size:10px;opacity:.6;margin-top:4px">上次存档: ${gameState.lastSaveTime ? new Date(gameState.lastSaveTime).toLocaleString('zh-CN') : '暂无'}</div>
          </button>
          <button class="mqn-btn" onclick="startNewGameWithOrigin()" style="font-size:14px;padding:14px;background:rgba(40,30,10,.8)">
            [*] 重新开始
          </button>
        ` : `
          <button class="mqn-btn mqn-btn-ok" onclick="startNewGameWithOrigin()" style="font-size:14px;padding:16px;font-size:16px">
            [>>] 初入江湖
          </button>
        `}
        
        <button class="mqn-btn" onclick="showGameHelp()" style="font-size:12px;padding:10px;background:rgba(30,50,70,.5)">
          [?] 游戏说明
        </button>
      </div>
      
      <div style="margin-top:30px;font-size:10px;color:rgba(150,120,60,.4);line-height:1.6">
        按 Esc 键可快速保存游戏
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
}

// ── 开始新游戏 ──
function startNewGame() {
  // ── 清空所有存档 Key（新号重开必须全清，防止旧数据残留）──
  const WUXIA_KEYS = [
    GAME_STATE_KEY,          // wuxia_game_state
    TRAVEL_STATE_KEY,        // wuxia_travel
    PLAYER_PROFILE_KEY,      // wuxia_player_profile
    'wuxia_editor',          // 角色属性
    'wuxia_bag',             // 主背包
    'wuxia_craft_bag',       // 合成背包
    'wuxia_consumables',     // 消耗品
    'wuxia_inv',             // 旧版背包兼容
    'wuxia_npc_state',       // NPC关系 + 任务状态（核心！）
    'wuxia_main_quest',      // 主线任务进度
    'wuxia_side_quests',     // 支线任务进度
    'wuxia_sect_chains',     // 门派任务链进度
    'wuxia_achievements',    // 成就
    'wuxia_jianghu_state',   // 江湖奇遇/声望/通缉
    'wuxia_player_progress', // 等级/功法/技能熟练度
    'wuxia_dungeon_unlocked',// 地下城解锁
    'wuxia_travel_history',  // 已到访城市
    'wuxia_origin_data',     // 出身数据
    'wuxia_fishing_v4',      // 钓鱼记录
    'wuxia_cricket',         // 蟋蟀记录
    'wuxia_mount',           // 坐骑
    'wuxia_owned_mounts',    // 已拥有的坐骑列表
    'wuxia_cc',              // 角色捏脸存档（多号）
    'wuxia_save',            // 完整存档（dungeon.html使用）
    'wuxia_dungeon_progress',// 地下城进度
    'wuxia_procedural_quests',// 随机任务
    'wuxia_npc_requests',    // NPC委托
    'wuxia_city_enc_state',  // 城市奇遇状态
    'wuxia_encounter_state', // 旅途奇遇状态
    'wuxia_gambling_data',   // 赌坊数据
    'wuxia_pitchpot_data',   // 投壶数据
    'wuxia_leaderboard_player_id', // 排行榜ID
    'wuxia_ma_state',        // 师徒系统
    'wuxia_sworn_state',     // 结拜系统
    'wuxia_romance_state',   // 情缘系统
    'wuxia_daily_activity',  // 每日活跃
    'wuxia_story_guide',     // 主线叙事指引进度
    'wuxia_pets',            // 宠物系统
    'wuxia_sect_champ',      // 门派比武大会状态
    'wuxia_sect_ranklog',    // 门派比武阶级日志
    'wuxia_grandmaster',     // 掌门传承状态
    'wuxia_town_tutorial_done', // 城镇引导完成标记
    'wuxia_signin_state',       // 每日签到状态（重新开也要重置）
  ];
  WUXIA_KEYS.forEach(k => localStorage.removeItem(k));
  
  // ── 清理带日期的动态键（擂台击败记录、任务板完成记录等）──
  const keysToRemove = [];
  for(let i = 0; i < localStorage.length; i++){
    const key = localStorage.key(i);
    if(key && key.startsWith('wuxia_')){
      // 清理所有带日期的动态键
      if(key.match(/^wuxia_arena_defeated_\d{4}-\d{2}-\d{2}$/) ||
         key.match(/^wuxia_board_done_\w+_\d{4}-\d{2}-\d{2}$/) ||
         key.match(/^wuxia_daily_\w+_\d{4}-\d{2}-\d{2}$/)){
        keysToRemove.push(key);
      }
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
  if(keysToRemove.length > 0){
    console.log('[startNewGame] 清理动态存档键:', keysToRemove.length, '个');
  }

  // ── 内存中重置 npcState（避免页面不刷新时旧数据残留）──
  if(typeof npcState !== 'undefined'){
    npcState.relations   = {};
    npcState.quests      = {};
    npcState.readIntels  = {};
    npcState.interactCounts = {};
    npcState.lastInteractDay = {};
    npcState.topicsDone  = {};
    npcState.questDoneFor = {};
    npcState.alignQuests = {};
    npcState.questLastDone = {};
    npcState.questChainUnlock = {};
    npcState.deaths      = {};
    npcState.npcInsts    = {};
    npcState.giftTopics  = {};
  }

  // 重置游戏状态
  gameState = {
    isNewPlayer: true,
    currentMainQuest: 'mq_act1_start',
    unlockedFeatures: ['combat', 'travel', 'fishing', 'gambling', 'cricket'],
    tutorialStep: 0,
    playTime: 0,
    lastSaveTime: null,
  };
  
  // 重置旅行状态
  travelCurrentCity = 'luoyang';
  travelHistory = ['luoyang'];
  travelEventLog = [];
  travelPlayerState = {
    silver: 200,
    hp: 100,
    energy: 100,
    food: 100,    // 饱食度（0=饿死，100=饱腹）
    water: 100,   // 口渴度（0=渴死，100=不渴）
    buffs: [],
    reputation: 100,
    wantedBy: [],
  };
  
  // 重置角色状态（创建默认角色）
  if (typeof edS !== 'undefined') {
    edS.level = 1;
    edS.exp = 0;
    edS.hp = 150;
    edS.maxHp = 150;
    edS.mp = 50;
    edS.maxMp = 50;
    edS.skills = [];
    edS.bag = [];
  }
  // 使用统一银两管理器初始化
  setSilver(200);
  
  // 关闭菜单
  const menu = document.getElementById('mainMenuOverlay');
  if (menu) menu.remove();
  
  // 进入捏脸工坊
  showPage('editor');
  
  // 显示新手欢迎
  setTimeout(() => {
    showNewPlayerWelcome();
  }, 500);
}

// ── 继续游戏 ──
function continueGame() {
  // 彻底停止主菜单BGM+SFX
  if (window._menuSFX && window._menuSFX.destroy) window._menuSFX.destroy();
  if (window._menuBgmStop) window._menuBgmStop(false);

  if (loadGameState()) {
    const menu = document.getElementById('mainMenuOverlay');
    if (menu) menu.remove();
    
    // 如果在 ascii-heroes.html 中，直接渲染地图
    if (typeof showPage === 'function' && typeof travelRenderLocation === 'function' && document.getElementById('travelLocPanel')) {
      showPage('map');
      travelRenderLocation(travelCurrentCity);
      showToast('>> 欢迎回到江湖', 2000);
    } else {
      // 在 index.html 中：跳转到 town.html
      window.location.href = 'town.html';
    }
  } else {
    showToast('[X] 存档加载失败', 2000);
  }
}

// ── 新玩家欢迎 ──
function showNewPlayerWelcome() {
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:450px">
      <div style="font-size:48px;margin-bottom:20px;color:#f0c060;font-family:monospace">/|\\</div>
      <div style="font-size:20px;color:#ffd060;letter-spacing:2px;margin-bottom:16px">初入江湖</div>
      
      <div style="font-size:12px;color:#d0b090;line-height:1.8;margin-bottom:24px;text-align:left">
        <div style="margin-bottom:12px">欢迎你，年轻的侠客。在这个江湖中，牌运与武运并存，机遇与危险同在。</div>
        
        <div style="border-left:2px solid rgba(240,192,96,.3);padding-left:12px;margin:16px 0">
          <div style="color:#ffd080;margin-bottom:8px">*> 你的第一个目标：</div>
          <div>前往 [!] 捏脸工坊，创建你的江湖身份</div>
        </div>
        
        <div style="border-left:2px solid rgba(240,192,96,.3);padding-left:12px;margin:16px 0">
          <div style="color:#ffd080;margin-bottom:8px">== 主线使命：</div>
          <div>调查《血骨门之乱》，寻找传说中的玄铁令</div>
        </div>
        
        <div style="border-left:2px solid rgba(240,192,96,.3);padding-left:12px;margin:16px 0">
          <div style="color:#ffd080;margin-bottom:8px">(!) 游戏提示：</div>
          <div>• 按 <b style="color:#fff">Esc</b> 键快速保存游戏</div>
          <div>• 点击右上角的 <b style="color:#fff">[?] 任务指引</b> 查看当前目标</div>
          <div>• 在 ~~ 江湖舆图中自由探索</div>
        </div>
      </div>
      
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove(); startTutorial()">
          开始冒险
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
}

// ── 新手引导（开发页 ascii-heroes.html）──
function startTutorial() {
  if (!gameState.isNewPlayer) return;
  
  const steps = [
    {
      title: '[!] 捏脸工坊',
      content: '创建你的江湖身份，分配属性点，选择出身和初始武学。',
      target: '[onclick*="editor"]',
      position: 'bottom'
    },
    {
      title: '+! 武斗场',
      content: '在这里测试你的战斗技能，熟悉战斗机制。',
      target: '[onclick*="fight"]',
      position: 'bottom'
    },
    {
      title: '~~ 江湖舆图',
      content: '正式开始你的江湖之旅，探索世界、接取任务、提升实力。',
      target: '[onclick*="map"]',
      position: 'bottom'
    }
  ];
  
  let currentStep = 0;
  
  function showStep() {
    if (currentStep >= steps.length) {
      gameState.isNewPlayer = false;
      gameState.tutorialStep = 999;
      saveGameState();
      showToast('[OK] 新手引导完成！', 3000);
      return;
    }
    
    const step = steps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      element.style.boxShadow = '0 0 20px #ffd060';
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'all 0.3s';
      
      const tip = document.createElement('div');
      tip.className = 'tutorial-tip';
      tip.innerHTML = `
        <div style="font-size:14px;color:#ffd060;margin-bottom:8px">${step.title}</div>
        <div style="font-size:11px;color:#d0b090;line-height:1.6;margin-bottom:12px">${step.content}</div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="mqn-btn" style="font-size:10px;padding:6px 12px" onclick="this.closest('.tutorial-tip').remove()">
            跳过引导
          </button>
          <button class="mqn-btn mqn-btn-ok" style="font-size:10px;padding:6px 12px" onclick="nextTutorialStep()">
            ${currentStep === steps.length - 1 ? '完成' : '下一步'}
          </button>
        </div>
      `;
      
      const rect = element.getBoundingClientRect();
      tip.style.position = 'fixed';
      tip.style.left = rect.left + rect.width / 2 - 150 + 'px';
      tip.style.top = rect.bottom + 10 + 'px';
      tip.style.zIndex = '1000';
      tip.style.background = 'rgba(10,8,20,.98)';
      tip.style.border = '1px solid rgba(240,192,96,.3)';
      tip.style.borderRadius = '8px';
      tip.style.padding = '12px';
      tip.style.width = '300px';
      tip.style.boxShadow = '0 8px 32px rgba(0,0,0,.8)';
      
      document.body.appendChild(tip);
      window.currentTutorialTip = tip;
      window.currentTutorialElement = element;
    }
  }
  
  window.nextTutorialStep = function() {
    if (window.currentTutorialTip) window.currentTutorialTip.remove();
    if (window.currentTutorialElement) {
      window.currentTutorialElement.style.boxShadow = '';
      window.currentTutorialElement.style.transform = '';
    }
    currentStep++;
    gameState.tutorialStep = currentStep;
    saveGameState();
    setTimeout(showStep, 500);
  };
  
  showStep();
}

// ════════════════════════════════════════════════════════════════
//  城镇新手引导（town.html 专用 · 第2步）
//  在 townInit 末尾调用：if (gameState.isNewPlayer && gameState.tutorialStep < 10) startTownTutorial();
//  tutorialStep 0-9 = ascii-heroes 阶段（或已跳过）
//  tutorialStep 10 = 城镇引导待开始
//  tutorialStep 20+ = 城镇引导进行中
//  tutorialStep 999 = 全部完成
// ════════════════════════════════════════════════════════════════

const TOWN_TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: '欢迎来到洛阳',
    icon: '🏯',
    content: '这里是你的起始之城——洛阳。\n\n上方显示你的等级、银两和气血。\n中间是城镇场景和服务入口。\n下方是NPC列表，可以和他们对话、接任务、买东西。',
    target: null,          // 居中弹窗，不指向特定元素
    spot: null,
  },
  {
    id: 'services',
    title: '城镇服务',
    icon: '🏪',
    content: '城镇服务分为几类，点击即可使用：\n\n【基础服务】\n• 🏠 客栈 — 住宿休息，恢复气血精力\n• 🏥 医馆 — 疗伤治病\n• 🔨 铁匠铺 — 购买装备或锻造\n• 🛒 杂货铺 — 购买消耗品和材料\n\n【小游戏】\n• 🎣 垂钓 — 休闲玩法，可钓稀有鱼\n• 🎲 赌坊 — 小赌怡情\n• 🦗 斗蛐蛐 — 蛐蛐对战（大城市）\n• 🌿 捉蛐蛐 — 野外捕捉蛐蛐\n• 🎴 天机阁 — 翻牌博运气（大城市）\n• ⚔ 擂台 — 挑战武者（大城市）\n• ⌸ 投壶 — 投壶小游戏（需酒馆）\n\n【其他】\n• 📋 赏金榜 — 接悬赏赚银两\n\n右下角「赏金榜」始终可见，其他按钮按城市规模显示。',
    target: '#townServices',
    spot: '#townServices',
    preferTop: true,   // 气泡固定显示在顶部区域，网页版不会太靠下
  },
  {
    id: 'npc',
    title: '江湖人物',
    icon: '👥',
    content: '这里是城镇里的NPC。\n\n点击任意NPC可以：\n• 与他们对话，了解江湖消息\n• 接取任务，获得经验和银两\n• 在商店购买装备和物资\n• 选择「随便聊聊」，听他们说些江湖闲话\n\n不同NPC有不同的职业和性格，多聊聊会有收获！',
    target: '#townNpcList',
    spot: '#townNpcList',
  },
  {
    id: 'quest',
    title: '任务系统',
    icon: '📋',
    content: '点击底部的「! 任务」按钮，查看你接取的所有任务。\n\n任务分为主线任务和支线任务。\n完成任务可以获得经验、银两、装备等奖励。\n\n右上角徽章数字 = 进行中 + 待领取的任务数。',
    target: '#townQuestBtn',
    spot: '#townQuestBtn',
  },
  {
    id: 'exit',
    title: '闯荡江湖',
    icon: '🗺',
    content: '准备好了吗？\n\n点击「▶ 出城闯江湖」，选择目的地前往其他城市。\n旅途中可能遇到奇遇和敌人。\n\n按 Esc 键可以随时保存进度。\n\n祝你在江湖中闯出一番名堂！',
    target: '#townExitBtn',
    spot: '#townExitBtn',
  },
];

/** 创建聚光灯遮罩 */
function _ttCreateOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'ttOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;transition:box-shadow .4s;';
  document.body.appendChild(overlay);
  return overlay;
}

/** 高亮指定元素（聚光灯效果） */
function _ttSpotlight(overlay, spotEl) {
  if (!spotEl) {
    overlay.style.boxShadow = 'inset 0 0 0 9999px rgba(0,0,0,.7)';
    return;
  }
  const r = spotEl.getBoundingClientRect();
  const pad = 6;
  overlay.style.boxShadow =
    `inset 0 0 0 ${r.top - pad}px rgba(0,0,0,.7),` +
    `inset 0 ${r.top + r.height + pad}px 0 ${window.innerHeight - r.top - r.height - pad}px rgba(0,0,0,.7),` +
    `inset 0 0 0 ${r.left - pad}px rgba(0,0,0,.7),` +
    `inset ${r.right + pad}px 0 0 ${window.innerWidth - r.right - pad}px rgba(0,0,0,.7)`;
}

/** 创建引导气泡 */
function _ttCreateBubble(step, stepIdx, totalSteps, onNext, onSkip) {
  const bubble = document.createElement('div');
  bubble.id = 'ttBubble';
  bubble.style.cssText = 'position:fixed;z-index:9999;width:310px;' +
    'background:rgba(10,8,20,.97);border:1px solid rgba(240,192,96,.35);border-radius:10px;' +
    'padding:16px;box-shadow:0 12px 48px rgba(0,0,0,.9);pointer-events:auto;' +
    'font-family:inherit;';

  const isLast = stepIdx >= totalSteps - 1;
  const lines = step.content.split('\n').map(l => {
    if (l.startsWith('•')) return `<div style="color:#c8d8c0;font-size:12px;line-height:1.7;padding-left:4px">${l}</div>`;
    return `<div style="color:#d0b090;font-size:12px;line-height:1.7">${l}</div>`;
  }).join('');

  bubble.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <span style="font-size:22px">${step.icon}</span>
      <div>
        <div style="font-size:14px;color:#ffd060;font-weight:bold">${step.title}</div>
        <div style="font-size:10px;color:rgba(240,192,96,.4)">${stepIdx + 1} / ${totalSteps}</div>
      </div>
    </div>
    <div style="margin-bottom:14px">${lines}</div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button id="ttSkipBtn" style="padding:6px 14px;border-radius:5px;border:1px solid rgba(160,140,100,.25);background:transparent;color:#a09080;font-size:11px;cursor:pointer">跳过引导</button>
      <button id="ttNextBtn" style="padding:6px 18px;border-radius:5px;border:1px solid rgba(240,192,96,.4);background:rgba(240,192,96,.12);color:#ffd060;font-size:11px;cursor:pointer;font-weight:bold">${isLast ? '开始冒险' : '下一步'}</button>
    </div>
  `;

  document.body.appendChild(bubble);

  // 绑定事件
  bubble.querySelector('#ttSkipBtn').onclick = onSkip;
  bubble.querySelector('#ttNextBtn').onclick = onNext;

  return bubble;
}

/** 定位气泡到目标元素旁边 */
function _ttPositionBubble(bubble, targetEl, preferTop) {
  if (!targetEl) {
    // 居中定位
    bubble.style.left = (window.innerWidth / 2 - 155) + 'px';
    bubble.style.top = (window.innerHeight / 2 - 120) + 'px';
    return;
  }
  const r = targetEl.getBoundingClientRect();
  const bw = 310, bh = bubble.offsetHeight || 200;
  const gap = 12;

  // 强制顶部模式：气泡固定显示在视口上部（距顶40px）
  if (preferTop) {
    bubble.style.left = Math.max(8, Math.min(window.innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + 'px';
    bubble.style.top = '40px';
    return;
  }

  // 优先放在目标上方；如果上方空间不够则放下方
  if (r.top > bh + gap + 20) {
    bubble.style.left = Math.max(8, Math.min(window.innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + 'px';
    bubble.style.top = (r.top - bh - gap) + 'px';
  } else {
    bubble.style.left = Math.max(8, Math.min(window.innerWidth - bw - 8, r.left + r.width / 2 - bw / 2)) + 'px';
    bubble.style.top = (r.bottom + gap) + 'px';
  }
}

/** 清除所有引导DOM */
function _ttCleanup() {
  const els = document.querySelectorAll('#ttOverlay, #ttBubble, .tt-arrow');
  els.forEach(el => el.remove());
  // 清除高亮
  if (window._ttSpotEl) {
    window._ttSpotEl.style.outline = '';
    window._ttSpotEl.style.outlineOffset = '';
    window._ttSpotEl = null;
  }
}

/** 城镇新手引导入口 */
function startTownTutorial() {
  // 确保在 town.html 环境下
  if (!document.getElementById('townRoot')) return;

  // 动态城市名（#townCityName 在 townInit 时已设置为实际出身城市）
  const cityName = document.getElementById('townCityName')?.textContent || '洛阳';
  const steps = TOWN_TUTORIAL_STEPS.map((s, i) => {
    if (i === 0) {
      return { ...s, title: '欢迎来到' + cityName };
    }
    return s;
  });
  const overlay = _ttCreateOverlay();
  
  // 恢复之前的进度（如果引导进行中）
  let currentStep = 0;
  if (gameState.tutorialStep >= 20 && gameState.tutorialStep < 999) {
    const savedStep = gameState.tutorialStep - 20;
    if (savedStep >= 0 && savedStep < steps.length) {
      currentStep = savedStep;
    }
  }

  function show(stepIndex) {
    // 清理上一步
    _ttCleanup();
    if (stepIndex >= steps.length) {
      _ttFinish();
      return;
    }
    const step = steps[stepIndex];
    const targetEl = step.target ? document.querySelector(step.target) : null;
    const spotEl = step.spot ? document.querySelector(step.spot) : null;

    // 聚光灯
    _ttSpotlight(overlay, spotEl);
    if (spotEl) {
      spotEl.style.outline = '2px solid rgba(240,192,96,.6)';
      spotEl.style.outlineOffset = '3px';
      spotEl.style.transition = 'outline .3s';
      window._ttSpotEl = spotEl;
    }

    // 气泡
    const bubble = _ttCreateBubble(step, stepIndex, steps.length, () => {
      gameState.tutorialStep = 20 + stepIndex + 1;
      saveGameState();
      show(stepIndex + 1);
    }, () => {
      _ttFinish();
    });

    // 延迟定位（等气泡渲染完计算高度）；preferTop 模式固定在顶部
    requestAnimationFrame(() => {
      _ttPositionBubble(bubble, targetEl, step.preferTop);
    });
  }

  function _ttFinish() {
    _ttCleanup();
    gameState.isNewPlayer = false;
    gameState.tutorialStep = 999;
    saveGameState();
    // 独立标记城镇引导完成，不受战斗引导 tutorialStep 影响
    localStorage.setItem('wuxia_town_tutorial_done', '1');
    if (typeof showToast === 'function') showToast('✨ 新手引导完成！祝江湖旅途愉快', 3000);
  }

  // 窗口大小变化时重新定位
  window._ttOnResize = () => {
    const bubble = document.getElementById('ttBubble');
    const stepIdx = (gameState.tutorialStep >= 20 && gameState.tutorialStep < 999) 
      ? Math.min(gameState.tutorialStep - 20, steps.length - 1) 
      : 0;
    const step = steps[stepIdx];
    if (bubble && step) {
      const targetEl = step.target ? document.querySelector(step.target) : null;
      _ttPositionBubble(bubble, targetEl);
      _ttSpotlight(overlay, step.spot ? document.querySelector(step.spot) : null);
    }
  };
  window.addEventListener('resize', window._ttOnResize);

  // 记住清理函数
  window._ttDestroy = () => {
    if (window._ttOnResize) { window.removeEventListener('resize', window._ttOnResize); window._ttOnResize = null; }
    _ttCleanup();
  };

  // 如果从未开始过城镇引导，设置初始状态
  if (gameState.tutorialStep < 20) {
    gameState.tutorialStep = 20;
    saveGameState();
  }
  show(currentStep);
}

// ── 任务指引面板 ──
function showQuestGuidancePanel() {
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  
  // 获取当前主线任务
  const currentQuest = getCurrentMainQuest ? getCurrentMainQuest() : null;
  const questDesc = currentQuest ? QUEST_NARRATE[currentQuest.id] : null;
  
  // 获取推荐行动
  const suggestions = generateQuestSuggestions();
  
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:480px">
      <div style="font-size:24px;color:#ffd060;margin-bottom:16px;letter-spacing:2px">[?] 任务指引</div>
      
      ${currentQuest ? `
        <div style="margin-bottom:20px">
          <div style="font-size:14px;color:#ffd080;margin-bottom:8px">*> 当前主线</div>
          <div style="font-size:12px;color:#d0b090;line-height:1.6;background:rgba(5,4,14,.5);padding:12px;border-radius:6px;border-left:3px solid #ffd060">
            <div style="font-weight:bold;margin-bottom:4px">${currentQuest.name}</div>
            <div style="opacity:.8">${questDesc ? questDesc.tip : currentQuest.desc}</div>
          </div>
        </div>
      ` : ''}
      
      <div style="margin-bottom:20px">
        <div style="font-size:14px;color:#ffd080;margin-bottom:8px">(!) 推荐行动</div>
        <div style="display:flex;flex-direction:gap:8px">
          ${suggestions.map(s => `
            <div style="background:rgba(5,4,14,.5);padding:10px;border-radius:6px;border:1px solid rgba(240,192,96,.2);margin-bottom:8px">
              <div style="font-size:12px;color:#ffd060;margin-bottom:4px">${s.title}</div>
              <div style="font-size:11px;color:#b0a080;opacity:.8">${s.desc}</div>
              ${s.action ? `<button class="mqn-btn" style="font-size:10px;padding:4px 8px;margin-top:6px" onclick="${s.action}">前往</button>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;color:#a09070;margin-bottom:20px">
        <div>+! 等级: ${typeof edS !== 'undefined' ? (edS.level || 1) : 1}</div>
        <div>$= 银两: ${typeof travelPlayerState !== 'undefined' ? travelPlayerState.silver : 200}两</div>
        <div>(*) 气血: ${typeof travelPlayerState !== 'undefined' ? travelPlayerState.hp : 100}%</div>
        <div>(>) 精力: ${typeof travelPlayerState !== 'undefined' ? travelPlayerState.energy : 100}%</div>
      </div>
      
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">关闭</button>
        <button class="mqn-btn" onclick="saveGameState()">[OK] 快速存档</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
}

// ── 生成推荐行动 ──
function generateQuestSuggestions() {
  const suggestions = [];
  const level = typeof edS !== 'undefined' ? (edS.level || 1) : 1;
  const hp = typeof travelPlayerState !== 'undefined' ? (travelPlayerState.hp || 100) : 100;
  const energy = typeof travelPlayerState !== 'undefined' ? (travelPlayerState.energy || 100) : 100;
  
  // 根据状态推荐
  if (hp < 30) {
    suggestions.push({
      title: '[~] 休息恢复',
      desc: '气血过低，建议找旅店休息',
      action: "travelRestAtInn()"
    });
  }

  if (energy < 20) {
    suggestions.push({
      title: '[+] 打坐恢复',
      desc: '精力不足，需要恢复',
      action: "travelRestAtInn()"
    });
  }

  // 根据等级推荐
  if (level < 3) {
    suggestions.push({
      title: '+! 武斗场练习',
      desc: '提升等级，熟悉战斗',
      action: "window.location.href='battle.html'"
    });

    suggestions.push({
      title: '~~ 探索周边',
      desc: '前往附近城市，触发事件',
      action: "showPage('map')"
    });
  } else if (level < 10) {
    suggestions.push({
      title: '+! 险地探索',
      desc: '挑战地下城，获得装备',
      action: "showPage('map')"
    });
  }

  // 主线任务推荐
  const currentQuest = getCurrentMainQuest ? getCurrentMainQuest() : null;
  if (currentQuest && currentQuest.tip) {
    suggestions.push({
      title: '== 推进主线',
      desc: currentQuest.tip,
      action: "showMainQuestPanel()"
    });
  }

  // 如果没有建议，给通用建议
  if (suggestions.length === 0) {
    suggestions.push({
      title: '~~ 自由探索',
      desc: '在江湖中寻找新的机遇',
      action: "showPage('map')"
    });
  }
  
  return suggestions.slice(0, 3); // 最多显示3个
}

// ── 游戏帮助 ──
function showGameHelp() {
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:520px;max-height:80vh;overflow-y:auto">
      <div style="font-size:24px;color:#ffd060;margin-bottom:16px;letter-spacing:2px">[?] 游戏说明</div>
      
      <div style="text-align:left;font-size:11px;color:#d0b090;line-height:1.8">
        <div style="margin-bottom:16px">
          <div style="font-size:13px;color:#ffd080;margin-bottom:8px">*> 游戏目标</div>
          <div>在这个开放的武侠世界中，你可以：</div>
          <ul style="margin:8px 0;padding-left:20px">
            <li>推进主线剧情《血骨门之乱》，寻找玄铁令</li>
            <li>加入门派，学习绝世武学</li>
            <li>探索56座地下城，收集稀有装备</li>
            <li>体验丰富的小游戏和支线任务</li>
            <li>成为一代宗师，名扬天下</li>
          </ul>
        </div>
        
        <div style="margin-bottom:16px">
          <div style="font-size:13px;color:#ffd080;margin-bottom:8px">## 基础操作</div>
          <ul style="margin:8px 0;padding-left:20px">
            <li>点击顶部的标签切换不同界面</li>
            <li>在~~江湖舆图中点击城市进行移动</li>
            <li>点击服务按钮使用城市功能</li>
            <li>按 <b>Esc</b> 键快速保存游戏</li>
            <li>点击[?]任务指引查看当前目标</li>
          </ul>
        </div>
        
        <div style="margin-bottom:16px">
          <div style="font-size:13px;color:#ffd080;margin-bottom:8px">+! 核心系统</div>
          <ul style="margin:8px 0;padding-left:20px">
            <li><b>战斗系统</b>：在武斗场或野外与敌人战斗</li>
            <li><b>旅行系统</b>：在江湖中移动，触发随机事件</li>
            <li><b>门派系统</b>：加入25个门派之一，学习专属武学</li>
            <li><b>地下城</b>：探索险地，获得稀有奖励</li>
            <li><b>小游戏</b>：钓鱼、赌坊、擂台、投壶、棋社、采药、锻造</li>
          </ul>
        </div>
        
        <div style="margin-bottom:16px">
          <div style="font-size:13px;color:#ffd080;margin-bottom:8px">(!) 新手建议</div>
          <ul style="margin:8px 0;padding-left:20px">
            <li>先完成新手引导，熟悉基本操作</li>
            <li>前期多战斗提升等级，获得银两和装备</li>
            <li>注意精力值，耗尽后需要休息恢复</li>
            <li>完成主线任务解锁更多内容</li>
            <li>加入门派学习强力武学</li>
          </ul>
        </div>
      </div>
      
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">关闭</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
}

// ── 自动保存 ──
function setupAutoSave() {
  // 每5分钟自动保存
  setInterval(() => {
    if (gameState.lastSaveTime) {
      const lastSave = new Date(gameState.lastSaveTime);
      const now = new Date();
      const minutesSinceSave = (now - lastSave) / (1000 * 60);
      
      if (minutesSinceSave > 5) {
        saveGameState();
      }
    }
  }, 60 * 1000); // 每分钟检查一次
}

// ── 初始化游戏流程系统 ──
function initGameFlow() {
  // 延迟显示主菜单弹窗（仅在需要时手动调用）
  // 注：index.html 主界面已承担主菜单角色，此弹窗不再自动弹出
  setTimeout(() => {
    showMainMenu();
  }, 1000);
  
  // 设置自动保存
  setupAutoSave();
  
  // 设置快捷键
  setupHotkeys();
}

// ── 静默初始化（仅设置自动保存和快捷键，不弹窗）──
function initGameFlowSilent() {
  setupAutoSave();
  setupHotkeys();
}

// ── 快捷键设置 ──
function setupHotkeys() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      saveGameState();
    }
    if (e.key === 'g' && e.ctrlKey) {
      e.preventDefault();
      showQuestGuidancePanel();
    }
  });
}

window.initGameFlowSilent = initGameFlowSilent;

// ── 页面加载后不再自动弹主菜单 ──
// index.html 的主界面已承担主菜单角色，initGameFlowSilent 由 index.html 主动调用
// showMainMenu() 保留为备用，可通过 window.showMainMenu() 手动调用

// ── 导出全局函数（供HTML调用） ──
window.showMainMenu = showMainMenu;
window.startNewGame = startNewGame;
window.continueGame = continueGame;
window.showQuestGuidancePanel = showQuestGuidancePanel;
window.showGameHelp = showGameHelp;

// ── editorSave：saveGameState 的语义别名，供其他模块调用 ──
// 多处代码用 typeof editorSave === 'function' 检查后调用，需确保此函数存在
window.editorSave = saveGameState;