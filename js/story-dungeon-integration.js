/**
 * ============================================================================
 * 剧情地下城集成系统 - StoryDungeonIntegration
 * ============================================================================
 *
 * 功能：
 * 1. 剧情进度与地下城解锁联动
 * 2. 地下城完成与剧情推进联动
 * 3. 与战斗系统的集成
 * 4. 与成就系统的集成
 *
 * 使用方法：
 *   <script src="js/story-dungeon-integration.js"></script>
 *   StoryDungeonIntegration.init();
 *
 * ============================================================================
 */

const StoryDungeonIntegration = {
  // 存储键
  STORAGE_KEY: 'wuxia_story_dungeon_integration',

  // 当前状态
  state: null,

  // ═════════════════════════════════════════════════════════════════════════
  // 初始化
  // ═════════════════════════════════════════════════════════════════════════

  init() {
    this.loadState();
    this.hookIntoSystems();
    console.log('[StoryDungeonIntegration] 剧情地下城集成系统初始化完成');
    return this;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 状态管理
  // ═════════════════════════════════════════════════════════════════════════

  loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.state = JSON.parse(saved);
    } else {
      this.state = {
        dungeonUnlocks: {}, // 地下城解锁状态
        bossDefeats: {},    // BOSS击败记录
        specialEvents: {},  // 特殊事件触发记录
      };
      this.saveState();
    }
  },

  saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 系统集成钩子
  // ═════════════════════════════════════════════════════════════════════════

  hookIntoSystems() {
    // 钩子1: 监听主线任务进度变化
    this.hookMainQuest();

    // 钩子2: 监听战斗结束
    this.hookBattleSystem();

    // 钩子3: 监听地下城完成
    this.hookDungeonSystem();

    // 钩子4: 监听玩家等级变化
    this.hookPlayerLevel();
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 主线任务钩子
  // ═════════════════════════════════════════════════════════════════════════

  hookMainQuest() {
    // 重写StoryMainQuest的completeQuest方法以添加钩子
    if (typeof StoryMainQuest !== 'undefined') {
      const originalComplete = StoryMainQuest.completeQuest.bind(StoryMainQuest);
      StoryMainQuest.completeQuest = (questId) => {
        const result = originalComplete(questId);
        this.onQuestComplete(questId);
        return result;
      };
      console.log('[StoryDungeonIntegration] 已挂钩主线任务系统');
    }
  },

  onQuestComplete(questId) {
    console.log(`[StoryDungeonIntegration] 任务完成: ${questId}`);

    // 检查是否有对应的地下城解锁
    const dungeon = this.findDungeonByRequiredQuest(questId);
    if (dungeon) {
      this.unlockDungeon(dungeon.id);
      this.showDungeonUnlockNotification(dungeon);
    }

    // 特殊任务处理
    this.handleSpecialQuestCompletion(questId);
  },

  findDungeonByRequiredQuest(questId) {
    return Object.values(STORY_DUNGEON_DB).find(d => d.requiredQuest === questId);
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 战斗系统钩子
  // ═════════════════════════════════════════════════════════════════════════

  hookBattleSystem() {
    // 监听战斗结束事件
    window.addEventListener('battle_end', (e) => {
      const { result, enemyId, isStoryBoss } = e.detail || {};
      if (isStoryBoss && result === 'victory') {
        this.onStoryBossDefeat(enemyId);
      }
    });

    console.log('[StoryDungeonIntegration] 已挂钩战斗系统');
  },

  onStoryBossDefeat(bossId) {
    console.log(`[StoryDungeonIntegration] 剧情BOSS击败: ${bossId}`);

    const boss = StoryDungeons.getBoss(bossId);
    if (!boss) return;

    // 记录击败
    this.state.bossDefeats[bossId] = {
      defeatedAt: Date.now(),
      firstTime: !this.state.bossDefeats[bossId],
    };
    this.saveState();

    // 触发BOSS击败事件
    StoryDungeons.completeBoss(bossId);

    // 显示UI
    if (typeof StoryDungeonUI !== 'undefined') {
      StoryDungeonUI.onBossDefeat(bossId);
    }

    // 推进相关任务
    this.advanceQuestAfterBossDefeat(bossId);

    // 解锁成就
    this.unlockBossAchievements(bossId);
  },

  advanceQuestAfterBossDefeat(bossId) {
    // 查找需要击败此BOSS的任务
    const quests = Object.values(MAIN_QUEST_DATA).filter(q =>
      q.type === 'boss' && q.targetBoss === bossId
    );

    quests.forEach(quest => {
      if (typeof StoryMainQuest !== 'undefined') {
        StoryMainQuest.completeQuest(quest.id);
      }
    });
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 地下城系统钩子
  // ═════════════════════════════════════════════════════════════════════════

  hookDungeonSystem() {
    // 重写DungeonSystem的完成方法
    if (typeof DungeonSystem !== 'undefined') {
      const originalComplete = DungeonSystem.completeDungeon?.bind(DungeonSystem);
      if (originalComplete) {
        DungeonSystem.completeDungeon = (dungeonId) => {
          const result = originalComplete(dungeonId);
          this.onDungeonComplete(dungeonId);
          return result;
        };
      }
    }

    console.log('[StoryDungeonIntegration] 已挂钩地下城系统');
  },

  onDungeonComplete(dungeonId) {
    const dungeon = StoryDungeons.getDungeon(dungeonId);
    if (!dungeon || !dungeon.isStoryDungeon) return;

    console.log(`[StoryDungeonIntegration] 剧情地下城完成: ${dungeonId}`);

    // 记录完成
    StoryDungeons.completeDungeon(dungeonId);

    // 推进相关任务
    this.advanceQuestAfterDungeonComplete(dungeonId);

    // 触发剧情动画
    this.triggerDungeonCinema(dungeon);

    // 解锁成就
    this.unlockDungeonAchievements(dungeonId);
  },

  advanceQuestAfterDungeonComplete(dungeonId) {
    // 查找需要完成此地下城的任务
    const quests = Object.values(MAIN_QUEST_DATA).filter(q =>
      q.type === 'dungeon' && q.dungeonId === dungeonId
    );

    quests.forEach(quest => {
      if (typeof StoryMainQuest !== 'undefined') {
        // 检查前置是否已完成
        if (StoryMainQuest.isQuestCompleted(quest.prev)) {
          StoryMainQuest.completeQuest(quest.id);
        }
      }
    });
  },

  triggerDungeonCinema(dungeon) {
    if (!dungeon.storySettings) return;

    const cinema = dungeon.storySettings.bossCinema || dungeon.storySettings.endingCinema;
    if (cinema && typeof StoryCinema !== 'undefined') {
      console.log(`[StoryDungeonIntegration] 触发剧情动画: ${cinema}`);
      StoryCinema.play(cinema);
    }
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 玩家等级钩子
  // ═════════════════════════════════════════════════════════════════════════

  hookPlayerLevel() {
    // 监听等级变化以解锁地下城
    const checkInterval = setInterval(() => {
      this.checkLevelUnlocks();
    }, 5000);

    console.log('[StoryDungeonIntegration] 已挂钩等级系统');
  },

  checkLevelUnlocks() {
    const playerLevel = this.getPlayerLevel();
    if (!playerLevel) return;

    Object.values(STORY_DUNGEON_DB).forEach(dungeon => {
      if (playerLevel >= dungeon.minLevel && !this.isDungeonUnlocked(dungeon.id)) {
        // 检查前置任务是否已完成
        if (!dungeon.requiredQuest || this.isQuestCompleted(dungeon.requiredQuest)) {
          this.unlockDungeon(dungeon.id);
        }
      }
    });
  },

  getPlayerLevel() {
    // 从玩家状态获取等级
    if (typeof travelPlayerState !== 'undefined') {
      return travelPlayerState.level;
    }
    if (typeof edS !== 'undefined') {
      return edS.level;
    }
    return null;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 地下城解锁管理
  // ═════════════════════════════════════════════════════════════════════════

  unlockDungeon(dungeonId) {
    if (this.state.dungeonUnlocks[dungeonId]) return;

    this.state.dungeonUnlocks[dungeonId] = {
      unlockedAt: Date.now(),
    };
    this.saveState();

    console.log(`[StoryDungeonIntegration] 地下城解锁: ${dungeonId}`);
  },

  isDungeonUnlocked(dungeonId) {
    // 检查是否已解锁
    if (this.state.dungeonUnlocks[dungeonId]) return true;

    // 检查是否已完成
    if (StoryDungeons.state.completedDungeons.includes(dungeonId)) return true;

    // 检查解锁条件
    const dungeon = StoryDungeons.getDungeon(dungeonId);
    if (!dungeon) return false;

    // 检查二周目限制
    if (dungeon.isNGPlusOnly && !this.isNGPlus()) return false;

    // 检查等级要求
    const playerLevel = this.getPlayerLevel();
    if (playerLevel && playerLevel < dungeon.minLevel) return false;

    // 检查前置任务
    if (dungeon.requiredQuest && !this.isQuestCompleted(dungeon.requiredQuest)) {
      return false;
    }

    return true;
  },

  isQuestCompleted(questId) {
    if (typeof StoryMainQuest !== 'undefined') {
      return StoryMainQuest.isQuestCompleted(questId);
    }
    return false;
  },

  isNGPlus() {
    // 检查是否二周目
    const save = localStorage.getItem('wuxia_player_progress');
    if (save) {
      const data = JSON.parse(save);
      return data.isNGPlus === true;
    }
    return false;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 通知系统
  // ═════════════════════════════════════════════════════════════════════════

  showDungeonUnlockNotification(dungeon) {
    const notification = document.createElement('div');
    notification.className = 'dungeon-unlock-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🔓</div>
        <div class="notification-text">
          <h4>新地下城解锁!</h4>
          <p>${dungeon.name}</p>
        </div>
      </div>
    `;

    // 添加样式
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      border: 2px solid #e94560;
      border-radius: 12px;
      padding: 20px;
      z-index: 99999;
      animation: slideIn 0.5s ease;
    `;

    document.body.appendChild(notification);

    // 自动移除
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.5s ease';
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 特殊任务处理
  // ═════════════════════════════════════════════════════════════════════════

  handleSpecialQuestCompletion(questId) {
    const specialHandlers = {
      'mq_act5_boss': () => {
        // 最终BOSS击败后的特殊处理
        this.onFinalBossDefeated();
      },
      'mq_act6_secret': () => {
        // 真结局触发
        this.onTrueEndingTriggered();
      },
    };

    if (specialHandlers[questId]) {
      specialHandlers[questId]();
    }
  },

  onFinalBossDefeated() {
    console.log('[StoryDungeonIntegration] 最终BOSS击败!');

    // 解锁二周目
    this.unlockNGPlus();

    // 显示结局
    if (typeof StoryCinema !== 'undefined') {
      StoryCinema.play('act6_finale');
    }
  },

  onTrueEndingTriggered() {
    console.log('[StoryDungeonIntegration] 真结局触发!');

    // 解锁隐藏地下城
    this.unlockDungeon('story_beijiang_seal');

    // 显示真结局动画
    if (typeof StoryCinema !== 'undefined') {
      StoryCinema.play('true_ending');
    }
  },

  unlockNGPlus() {
    const save = localStorage.getItem('wuxia_player_progress');
    if (save) {
      const data = JSON.parse(save);
      data.isNGPlusUnlocked = true;
      localStorage.setItem('wuxia_player_progress', JSON.stringify(data));
      console.log('[StoryDungeonIntegration] 二周目已解锁!');
    }
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 成就系统集成
  // ═════════════════════════════════════════════════════════════════════════

  unlockBossAchievements(bossId) {
    const achievementMap = {
      'boss_blood_wolf': 'ach_defeat_blood_wolf',
      'boss_fragment_guardian': 'ach_defeat_fragment_guardian',
      'boss_nangong_trial': 'ach_defeat_nangong_trial',
      'boss_desert_guardian': 'ach_defeat_desert_guardian',
      'boss_shaolin_traitor': 'ach_defeat_shaolin_traitor',
      'boss_alliance_commander': 'ach_defeat_alliance_commander',
      'boss_xuegu_gatekeeper': 'ach_defeat_xuegu_gatekeeper',
      'boss_blood_council': 'ach_defeat_blood_council',
      'boss_gumingzi_final': 'ach_defeat_gumingzi',
      'boss_true_villain': 'ach_defeat_true_villain',
    };

    const achievementId = achievementMap[bossId];
    if (achievementId && typeof StoryAchievementsExtended !== 'undefined') {
      StoryAchievementsExtended.unlock(achievementId);
    }
  },

  unlockDungeonAchievements(dungeonId) {
    const achievementMap = {
      'story_cangzhou_hideout': 'ach_clear_cangzhou',
      'story_kaifeng_blackmarket': 'ach_clear_kaifeng',
      'story_yangzhou_nangong': 'ach_clear_yangzhou',
      'story_liangzhou_desert': 'ach_clear_liangzhou',
      'story_shaolin_traitor': 'ach_clear_shaolin',
      'story_youzhou_hideout': 'ach_clear_youzhou',
      'story_xuegu_final': 'ach_clear_xuegu_final',
      'story_beijiang_seal': 'ach_clear_beijiang',
    };

    const achievementId = achievementMap[dungeonId];
    if (achievementId && typeof StoryAchievementsExtended !== 'undefined') {
      StoryAchievementsExtended.unlock(achievementId);
    }

    // 检查全通关成就
    this.checkCompletionAchievements();
  },

  checkCompletionAchievements() {
    const completedDungeons = StoryDungeons.state.completedDungeons;
    const allStoryDungeons = Object.keys(STORY_DUNGEON_DB).filter(id => !STORY_DUNGEON_DB[id].isNGPlusOnly);

    if (completedDungeons.length >= allStoryDungeons.length) {
      if (typeof StoryAchievementsExtended !== 'undefined') {
        StoryAchievementsExtended.unlock('ach_all_dungeons_cleared');
      }
    }
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 战斗启动接口
  // ═════════════════════════════════════════════════════════════════════════

  startStoryBossBattle(bossId) {
    const boss = StoryDungeons.getBoss(bossId);
    if (!boss) {
      console.error(`[StoryDungeonIntegration] 找不到BOSS: ${bossId}`);
      return;
    }

    console.log(`[StoryDungeonIntegration] 启动剧情BOSS战: ${boss.name}`);

    // 准备战斗数据
    const battleData = {
      enemy: {
        id: boss.id,
        name: boss.name,
        level: boss.level,
        hp: boss.hp,
        maxHp: boss.maxHp,
        atk: boss.atk,
        def: boss.def,
        spd: boss.spd,
        crit: boss.crit,
        dodge: boss.dodge,
        skills: boss.skills,
      },
      isStoryBoss: true,
      bossData: boss,
    };

    // 保存到sessionStorage供战斗系统使用
    sessionStorage.setItem('wuxia_story_battle_data', JSON.stringify(battleData));

    // 跳转到战斗页面
    window.location.href = 'battle.html?mode=story_boss&boss=' + bossId;
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 工具函数
  // ═════════════════════════════════════════════════════════════════════════

  getIntegrationStatus() {
    return {
      unlockedDungeons: Object.keys(this.state.dungeonUnlocks).length,
      defeatedBosses: Object.keys(this.state.bossDefeats).length,
      completedDungeons: StoryDungeons.state.completedDungeons.length,
      isNGPlus: this.isNGPlus(),
    };
  },

  resetForNGPlus() {
    this.state.dungeonUnlocks = {};
    this.state.bossDefeats = {};
    this.saveState();
    StoryDungeons.resetForNGPlus();
    console.log('[StoryDungeonIntegration] 已重置为二周目状态');
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 全局函数（供HTML调用）
// ═══════════════════════════════════════════════════════════════════════════

function startStoryBossBattle(bossId) {
  StoryDungeonIntegration.startStoryBossBattle(bossId);
}

function enterStoryDungeon(dungeonId) {
  if (StoryDungeonIntegration.isDungeonUnlocked(dungeonId)) {
    StoryDungeonUI.enterDungeon(dungeonId);
  } else {
    alert('该地下城尚未解锁！');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 自动初始化
// ═══════════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.StoryDungeonIntegration = StoryDungeonIntegration;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StoryDungeonIntegration.init());
  } else {
    StoryDungeonIntegration.init();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 导出
// ═══════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StoryDungeonIntegration };
}
