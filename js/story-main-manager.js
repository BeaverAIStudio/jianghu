/**
 * ============================================================================
 * 主线剧情管理器扩展 - StoryMainManager
 * ============================================================================
 * 
 * 扩展功能：
 * - 43个主线任务管理
 * - 阵营声望系统
 * - NPC关系系统
 * - 剧情时间线
 * - 剧情回顾功能
 * - 多结局判定
 * 
 * ============================================================================
 */

const StoryMainManager = {
  // 存储键
  STORAGE_KEY: 'wuxia_main_quest_extended',
  FACTION_KEY: 'wuxia_story_factions',
  NPC_REL_KEY: 'wuxia_story_npc_relations',
  TIMELINE_KEY: 'wuxia_story_timeline',
  HISTORY_KEY: 'wuxia_story_history',

  // 当前状态
  state: null,
  factions: null,
  npcRelations: null,
  timeline: null,

  // ═════════════════════════════════════════════════════════════════════════
  // 初始化
  // ═════════════════════════════════════════════════════════════════════════

  init() {
    this.loadAllData();
    console.log('[StoryMainManager] 初始化完成');
    console.log(`[StoryMainManager] 当前任务: ${this.getCurrentQuest()?.name || '无'}`);
    console.log(`[StoryMainManager] 道德值: ${this.state?.morality || 0}`);
    return this;
  },

  loadAllData() {
    // 加载任务状态
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.state = JSON.parse(saved);
    } else {
      this.state = this.getInitialState();
    }

    // 加载阵营声望
    const savedFactions = localStorage.getItem(this.FACTION_KEY);
    if (savedFactions) {
      this.factions = JSON.parse(savedFactions);
    } else {
      this.factions = this.getInitialFactions();
    }

    // 加载NPC关系
    const savedNpc = localStorage.getItem(this.NPC_REL_KEY);
    if (savedNpc) {
      this.npcRelations = JSON.parse(savedNpc);
    } else {
      this.npcRelations = this.getInitialNpcRelations();
    }

    // 加载时间线
    const savedTimeline = localStorage.getItem(this.TIMELINE_KEY);
    if (savedTimeline) {
      this.timeline = JSON.parse(savedTimeline);
    } else {
      this.timeline = this.getInitialTimeline();
    }
  },

  getInitialState() {
    return {
      currentQuestId: 'mq_act1_start',
      completedQuests: [],
      startTime: Date.now(),
      playTime: 0,
      choices: {},
      morality: 0,
      currentAct: 1,
      ngPlus: false,
      ngPlusCount: 0,
      unlockedContent: [],
      ending: null,
    };
  },

  getInitialFactions() {
    return {
      righteous: { reputation: 0, rank: 'stranger' },
      evil: { reputation: 0, rank: 'stranger' },
      neutral: { reputation: 0, rank: 'stranger' },
      chaotic: { reputation: 0, rank: 'stranger' },
    };
  },

  getInitialNpcRelations() {
    const relations = {};
    if (typeof STORY_NPC_RELATIONSHIPS !== 'undefined') {
      for (const [id, npc] of Object.entries(STORY_NPC_RELATIONSHIPS)) {
        relations[id] = {
          relation: npc.initialRelation,
          maxRelation: npc.maxRelation,
          met: false,
          events: [],
        };
      }
    }
    return relations;
  },

  getInitialTimeline() {
    return {
      currentDay: 1,
      currentPhase: 'prologue',
      completedPhases: [],
      events: [],
    };
  },

  saveAll() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    localStorage.setItem(this.FACTION_KEY, JSON.stringify(this.factions));
    localStorage.setItem(this.NPC_REL_KEY, JSON.stringify(this.npcRelations));
    localStorage.setItem(this.TIMELINE_KEY, JSON.stringify(this.timeline));
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 任务管理
  // ═════════════════════════════════════════════════════════════════════════

  getCurrentQuest() {
    const data = typeof MAIN_QUEST_DATA_EXTENDED !== 'undefined' 
      ? MAIN_QUEST_DATA_EXTENDED 
      : (typeof MAIN_QUEST_DATA !== 'undefined' ? MAIN_QUEST_DATA : {});
    return data[this.state.currentQuestId];
  },

  getQuestById(questId) {
    const data = typeof MAIN_QUEST_DATA_EXTENDED !== 'undefined' 
      ? MAIN_QUEST_DATA_EXTENDED 
      : (typeof MAIN_QUEST_DATA !== 'undefined' ? MAIN_QUEST_DATA : {});
    return data[questId];
  },

  getAllQuests() {
    const data = typeof MAIN_QUEST_DATA_EXTENDED !== 'undefined' 
      ? MAIN_QUEST_DATA_EXTENDED 
      : (typeof MAIN_QUEST_DATA !== 'undefined' ? MAIN_QUEST_DATA : {});
    return Object.values(data);
  },

  getQuestsByAct(act) {
    return this.getAllQuests().filter(q => q.act === act);
  },

  getProgress() {
    const allQuests = this.getAllQuests();
    const total = allQuests.length;
    const completed = this.state.completedQuests.length;
    const currentAct = this.getCurrentQuest()?.act || 1;
    const actQuests = this.getQuestsByAct(currentAct);
    const actCompleted = actQuests.filter(q => this.isQuestCompleted(q.id)).length;

    return {
      total,
      completed,
      percent: Math.round((completed / total) * 100),
      currentAct,
      actTotal: actQuests.length,
      actCompleted,
      actPercent: Math.round((actCompleted / actQuests.length) * 100),
    };
  },

  isQuestCompleted(questId) {
    return this.state.completedQuests.includes(questId);
  },

  isQuestAvailable(questId) {
    const quest = this.getQuestById(questId);
    if (!quest) return false;
    if (this.isQuestCompleted(questId)) return false;

    // 检查前置任务
    if (quest.prev) {
      if (Array.isArray(quest.prev)) {
        // 多个前置任务，完成任意一个即可
        if (!quest.prev.some(prevId => this.isQuestCompleted(prevId))) {
          return false;
        }
      } else {
        if (!this.isQuestCompleted(quest.prev)) {
          return false;
        }
      }
    }

    return true;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 任务完成
  // ═════════════════════════════════════════════════════════════════════════

  completeQuest(questId, options = {}) {
    const quest = this.getQuestById(questId);
    if (!quest) {
      console.error('[StoryMainManager] 任务不存在:', questId);
      return false;
    }

    // 检查前置条件
    if (!this.isQuestAvailable(questId)) {
      console.warn('[StoryMainManager] 任务不可用:', questId);
      return false;
    }

    console.log(`[StoryMainManager] 完成任务: ${quest.name}`);

    // 标记完成
    if (!this.state.completedQuests.includes(questId)) {
      this.state.completedQuests.push(questId);
    }

    // 更新道德值
    if (quest.rewards?.morality) {
      this.updateMorality(quest.rewards.morality);
    }

    // 更新阵营声望
    if (quest.rewards?.factionRep) {
      for (const [faction, value] of Object.entries(quest.rewards.factionRep)) {
        this.updateFactionRep(faction, value);
      }
    }

    // 更新NPC关系
    if (quest.rewards?.npcRelation) {
      for (const [npcId, value] of Object.entries(quest.rewards.npcRelation)) {
        this.updateNpcRelation(npcId, value);
      }
    }

    // 记录到历史
    this.addToHistory({
      type: 'quest_complete',
      questId,
      questName: quest.name,
      timestamp: Date.now(),
    });

    // 推进到下一任务
    if (quest.next && !options.skipNext) {
      this.state.currentQuestId = quest.next;
      this.state.currentAct = this.getCurrentQuest()?.act || this.state.currentAct;

      // 播放动画
      const nextQuest = this.getCurrentQuest();
      if (nextQuest?.cinema && window.StoryCinema) {
        setTimeout(() => StoryCinema.play(nextQuest.cinema), 500);
      }
    } else if (quest.isFinal) {
      // 最终任务
      this.onStoryComplete(quest);
    }

    this.saveAll();
    this.updateUI();

    return true;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 选择系统
  // ═════════════════════════════════════════════════════════════════════════

  makeChoice(choiceId, choiceData) {
    console.log(`[StoryMainManager] 做出选择: ${choiceId}`);

    this.state.choices[choiceId] = {
      ...choiceData,
      timestamp: Date.now(),
    };

    // 更新道德值
    if (choiceData.morality) {
      this.updateMorality(choiceData.morality);
    }

    // 记录到历史
    this.addToHistory({
      type: 'choice',
      choiceId,
      choiceData,
      timestamp: Date.now(),
    });

    // 推进到下一任务
    if (choiceData.next) {
      this.state.currentQuestId = choiceData.next;
      this.saveAll();
      this.updateUI();
    }

    return true;
  },

  getChoice(choiceId) {
    return this.state.choices[choiceId];
  },

  hasMadeChoice(choiceId) {
    return choiceId in this.state.choices;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 道德值系统
  // ═════════════════════════════════════════════════════════════════════════

  updateMorality(delta) {
    const oldValue = this.state.morality;
    this.state.morality = Math.max(-100, Math.min(100, this.state.morality + delta));
    console.log(`[StoryMainManager] 道德值: ${oldValue} -> ${this.state.morality}`);

    // 检查道德值变化事件
    if (oldValue <= 50 && this.state.morality > 50) {
      this.triggerEvent('morality_righteous');
    } else if (oldValue >= -50 && this.state.morality < -50) {
      this.triggerEvent('morality_evil');
    }

    return this.state.morality;
  },

  getMorality() {
    return this.state.morality;
  },

  getMoralityLevel() {
    const m = this.state.morality;
    if (m >= 80) return 'saint';
    if (m >= 50) return 'righteous';
    if (m >= 20) return 'good';
    if (m > -20) return 'neutral';
    if (m > -50) return 'bad';
    if (m > -80) return 'evil';
    return 'demon';
  },

  getMoralityTitle() {
    const titles = {
      saint: '圣人',
      righteous: '侠义之士',
      good: '善良之人',
      neutral: '中立之人',
      bad: '心术不正',
      evil: '邪道中人',
      demon: '魔头',
    };
    return titles[this.getMoralityLevel()];
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 阵营声望系统
  // ═════════════════════════════════════════════════════════════════════════

  updateFactionRep(factionId, delta) {
    if (!this.factions[factionId]) return;

    const oldRep = this.factions[factionId].reputation;
    this.factions[factionId].reputation += delta;
    this.factions[factionId].reputation = Math.max(-100, Math.min(100, this.factions[factionId].reputation));

    // 更新等级
    this.updateFactionRank(factionId);

    console.log(`[StoryMainManager] ${factionId} 声望: ${oldRep} -> ${this.factions[factionId].reputation}`);
    return this.factions[factionId].reputation;
  },

  updateFactionRank(factionId) {
    const rep = this.factions[factionId].reputation;
    const ranks = [
      { threshold: -80, rank: 'hated', name: '仇恨' },
      { threshold: -50, rank: 'hostile', name: '敌对' },
      { threshold: -20, rank: 'unfriendly', name: '冷淡' },
      { threshold: 20, rank: 'stranger', name: '陌生' },
      { threshold: 50, rank: 'friendly', name: '友好' },
      { threshold: 80, rank: 'honored', name: '尊敬' },
      { threshold: 100, rank: 'exalted', name: '崇拜' },
    ];

    for (const r of ranks) {
      if (rep <= r.threshold) {
        this.factions[factionId].rank = r.rank;
        this.factions[factionId].rankName = r.name;
        break;
      }
    }
  },

  getFactionRep(factionId) {
    return this.factions[factionId] || { reputation: 0, rank: 'stranger' };
  },

  // ═════════════════════════════════════════════════════════════════════════
  // NPC关系系统
  // ═════════════════════════════════════════════════════════════════════════

  updateNpcRelation(npcId, delta, event = null) {
    if (!this.npcRelations[npcId]) return;

    const npc = this.npcRelations[npcId];
    npc.relation = Math.max(-100, Math.min(npc.maxRelation, npc.relation + delta));
    npc.met = true;

    if (event) {
      npc.events.push({
        event,
        delta,
        timestamp: Date.now(),
      });
    }

    console.log(`[StoryMainManager] ${npcId} 关系: ${npc.relation}`);
    return npc.relation;
  },

  getNpcRelation(npcId) {
    return this.npcRelations[npcId] || { relation: 0, met: false };
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 结局判定
  // ═════════════════════════════════════════════════════════════════════════

  getEnding() {
    const morality = this.state.morality;
    const choices = this.state.choices;

    // 特殊结局判定
    if (choices['mq_act5_final_choice']?.id === 'seal_together') {
      return {
        type: 'sacrifice',
        name: '壮烈牺牲',
        description: '你与骨冥子同归于尽，用生命封印了玄铁令',
        title: '武林烈士',
        cinema: 'ending_sacrifice',
      };
    }

    if (choices['mq_act6_rewards']?.id === 'humble') {
      return {
        type: 'hermit',
        name: '隐世高人',
        description: '你推辞封赏，选择隐居山林',
        title: '隐世高人',
        cinema: 'ending_sage',
      };
    }

    if (choices['mq_act6_rewards']?.id === 'negotiate') {
      return {
        type: 'sect_founder',
        name: '开派祖师',
        description: '你建立了新的门派，成为武林第三股力量',
        title: '开派祖师',
        cinema: 'ending_hero',
      };
    }

    // 道德结局
    if (morality >= 80) {
      return {
        type: 'hero',
        name: '武林盟主',
        description: '你以高尚的品德和强大的实力，成为武林公认的领袖',
        title: '武林盟主',
        cinema: 'ending_hero',
      };
    } else if (morality >= 50) {
      return {
        type: 'righteous',
        name: '正道守护者',
        description: '你坚守正道，成为武林正义的守护者',
        title: '正道守护者',
        cinema: 'ending_hero',
      };
    } else if (morality <= -80) {
      return {
        type: 'demon_lord',
        name: '魔道至尊',
        description: '你堕入魔道，成为新的武林威胁',
        title: '魔道至尊',
        cinema: 'ending_dark_lord',
      };
    } else if (morality <= -50) {
      return {
        type: 'evil',
        name: '邪道霸主',
        description: '你为达目的不择手段，令正邪两道都忌惮三分',
        title: '邪道霸主',
        cinema: 'ending_dark_lord',
      };
    }

    // 默认结局
    return {
      type: 'normal',
      name: '江湖侠客',
      description: '你完成了使命，在武林中留下了自己的传说',
      title: '江湖侠客',
      cinema: 'ending_hero',
    };
  },

  onStoryComplete(finalQuest) {
    const ending = this.getEnding();
    this.state.ending = ending;

    console.log('[StoryMainManager] 剧情完成！结局:', ending.name);

    // 播放结局动画
    if (window.StoryCinema) {
      StoryCinema.play(ending.cinema);
    }

    // 解锁成就
    if (window.StoryAchievements) {
      StoryAchievements.unlock(`ending_${ending.type}`);
    }

    // 显示完成面板
    this.showCompletePanel(ending);

    this.saveAll();
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 剧情回顾
  // ═════════════════════════════════════════════════════════════════════════

  addToHistory(entry) {
    const history = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
    history.push(entry);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  },

  getHistory() {
    return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
  },

  showStoryReview() {
    const history = this.getHistory();
    const progress = this.getProgress();
    const ending = this.state.ending;

    const dialog = document.createElement('div');
    dialog.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        overflow: auto;
      " onclick="this.remove()">
        <div style="
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 2px solid #e94560;
          border-radius: 16px;
          padding: 32px;
          max-width: 700px;
          width: 90%;
          max-height: 80vh;
          overflow: auto;
          color: #fff;
        " onclick="event.stopPropagation()">
          <h2 style="color: #e94560; text-align: center; margin-bottom: 24px;">📜 剧情回顾</h2>
          
          <div style="margin-bottom: 24px;">
            <h3 style="color: #ffd700; margin-bottom: 12px;">总体进度</h3>
            <div style="background: #333; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
              <div style="width: ${progress.percent}%; height: 100%; background: linear-gradient(90deg, #e94560, #ff6b6b);"></div>
            </div>
            <p style="text-align: center; color: #888;">${progress.completed}/${progress.total} 任务 (${progress.percent}%)</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="color: #ffd700; margin-bottom: 12px;">道德值</h3>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="flex: 1; background: #333; height: 12px; border-radius: 6px; position: relative;">
                <div style="position: absolute; left: 50%; top: -4px; bottom: -4px; width: 2px; background: #fff;"></div>
                <div style="position: absolute; left: ${50 + (this.state.morality / 2)}%; top: 0; bottom: 0; width: 4px; background: ${this.state.morality >= 0 ? '#2ecc71' : '#e74c3c'}; transform: translateX(-50%);"></div>
              </div>
              <span style="color: ${this.state.morality >= 0 ? '#2ecc71' : '#e74c3c'}; font-weight: bold;">${this.state.morality}</span>
            </div>
            <p style="text-align: center; color: #888; margin-top: 8px;">${this.getMoralityTitle()}</p>
          </div>

          ${ending ? `
          <div style="margin-bottom: 24px; padding: 16px; background: rgba(233, 69, 96, 0.1); border-radius: 8px;">
            <h3 style="color: #ffd700; margin-bottom: 8px;">结局</h3>
            <p style="font-size: 18px; font-weight: bold; color: #e94560; margin-bottom: 8px;">${ending.name}</p>
            <p style="color: #aaa;">${ending.description}</p>
            <p style="color: #ffd700; margin-top: 8px;">获得称号：${ending.title}</p>
          </div>
          ` : ''}

          <div style="margin-bottom: 24px;">
            <h3 style="color: #ffd700; margin-bottom: 12px;">关键选择</h3>
            ${Object.entries(this.state.choices).map(([id, choice]) => `
              <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
                <p style="color: #aaa; font-size: 12px;">${new Date(choice.timestamp).toLocaleDateString()}</p>
                <p style="color: #fff;">${choice.text || id}</p>
                ${choice.morality ? `<span style="color: ${choice.morality > 0 ? '#2ecc71' : '#e74c3c'}; font-size: 12px;">${choice.morality > 0 ? '+' : ''}${choice.morality} 道德</span>` : ''}
              </div>
            `).join('')}
          </div>

          <button onclick="this.closest('[style*=fixed]').remove()" style="
            width: 100%;
            background: #e94560;
            color: #fff;
            border: none;
            padding: 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          ">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);
  },

  // ═════════════════════════════════════════════════════════════════════════
  // UI更新
  // ═════════════════════════════════════════════════════════════════════════

  updateUI() {
    // 触发全局事件
    window.dispatchEvent(new CustomEvent('storyMainUpdated', {
      detail: {
        quest: this.getCurrentQuest(),
        progress: this.getProgress(),
        morality: this.state.morality,
      }
    }));
  },

  showCompletePanel(ending) {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
      ">
        <div style="
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 3px solid #ffd700;
          border-radius: 24px;
          padding: 48px;
          max-width: 500px;
          text-align: center;
          color: #fff;
          animation: completePulse 2s ease-in-out infinite;
        ">
          <div style="font-size: 64px; margin-bottom: 24px;">🏆</div>
          <h1 style="color: #ffd700; margin-bottom: 16px; font-size: 32px;">剧情通关！</h1>
          <p style="font-size: 20px; color: #e94560; margin-bottom: 16px; font-weight: bold;">${ending.name}</p>
          <p style="color: #aaa; line-height: 1.6; margin-bottom: 24px;">${ending.description}</p>
          <p style="color: #ffd700; margin-bottom: 32px;">获得称号：<strong>${ending.title}</strong></p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            <button onclick="StoryMainManager.showStoryReview(); this.closest('[style*=fixed]').remove();" style="
              background: #4a90d9;
              color: #fff;
              border: none;
              padding: 14px 28px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">📜 剧情回顾</button>
            <button onclick="StoryMainManager.startNewGamePlus();" style="
              background: #e94560;
              color: #fff;
              border: none;
              padding: 14px 28px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">🔄 二周目</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes completePulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }
      </style>
    `;
    document.body.appendChild(dialog);
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 二周目
  // ═════════════════════════════════════════════════════════════════════════

  startNewGamePlus() {
    // 保存通关数据
    const completedData = {
      completedQuests: this.state.completedQuests,
      choices: this.state.choices,
      morality: this.state.morality,
      ending: this.state.ending,
      completeTime: Date.now(),
      playTime: this.state.playTime,
    };

    const ngPlusHistory = JSON.parse(localStorage.getItem('wuxia_ngplus_history') || '[]');
    ngPlusHistory.push(completedData);
    localStorage.setItem('wuxia_ngplus_history', JSON.stringify(ngPlusHistory));

    // 重置但保留部分数据
    this.state = {
      ...this.getInitialState(),
      ngPlus: true,
      ngPlusCount: ngPlusHistory.length,
      unlockedContent: this.getUnlockedContent(ngPlusHistory),
      keptTitles: [this.state.ending?.title].filter(Boolean),
    };

    this.factions = this.getInitialFactions();
    this.npcRelations = this.getInitialNpcRelations();
    this.timeline = this.getInitialTimeline();

    this.saveAll();
    window.location.reload();
  },

  getUnlockedContent(history) {
    const unlocked = [];
    // 根据通关次数解锁内容
    if (history.length >= 1) unlocked.push('hard_mode');
    if (history.length >= 2) unlocked.push('secret_ending');
    if (history.length >= 3) unlocked.push('developer_mode');
    return unlocked;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 调试
  // ═════════════════════════════════════════════════════════════════════════

  debug() {
    console.log('=== 主线剧情管理器调试 ===');
    console.log('当前任务:', this.getCurrentQuest()?.name);
    console.log('进度:', this.getProgress());
    console.log('道德值:', this.state.morality, this.getMoralityTitle());
    console.log('阵营声望:', this.factions);
    console.log('NPC关系:', this.npcRelations);
    console.log('选择记录:', this.state.choices);
    console.log('========================');
    return {
      state: this.state,
      factions: this.factions,
      npcRelations: this.npcRelations,
      progress: this.getProgress(),
    };
  },

  jumpTo(questId) {
    if (!this.getQuestById(questId)) {
      console.error('[StoryMainManager] 任务不存在:', questId);
      return false;
    }

    this.state.currentQuestId = questId;
    this.saveAll();
    this.updateUI();
    console.log('[StoryMainManager] 跳转到任务:', questId);
    return true;
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.FACTION_KEY);
    localStorage.removeItem(this.NPC_REL_KEY);
    localStorage.removeItem(this.TIMELINE_KEY);
    localStorage.removeItem(this.HISTORY_KEY);
    this.loadAllData();
    this.updateUI();
    console.log('[StoryMainManager] 数据已重置');
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 全局导出
// ═══════════════════════════════════════════════════════════════════════════

window.StoryMainManager = StoryMainManager;

// 调试命令
window.smmDebug = () => StoryMainManager.debug();
window.smmJump = (id) => StoryMainManager.jumpTo(id);
window.smmReset = () => StoryMainManager.reset();
window.smmReview = () => StoryMainManager.showStoryReview();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => StoryMainManager.init(), 500);
});

console.log('[StoryMainManager] 模块已加载');
