/**
 * ============================================================================
 * 《血骨门之乱》主线深度成就与收集系统 - StoryAchievementsExtended
 * ============================================================================
 * 与主线剧情深度绑定的成就系统，包含剧情成就、收集品、称号、隐藏要素
 * ============================================================================
 */

(function() {
  'use strict';

  // ==================== 存储键 ====================
  const STORAGE_KEY = 'story_achievements_ext';
  const COLLECTION_KEY = 'story_collection';

  // ==================== 剧情成就数据库 ====================
  const STORY_ACHIEVEMENTS = {
    // ========== 第一幕成就 ==========
    'sa_first_step': {
      id: 'sa_first_step',
      name: '初入江湖',
      description: '收到鹤隐的神秘来信，踏上江湖之路',
      icon: '📜',
      category: '剧情',
      act: 1,
      secret: false,
      reward: { title: '江湖新秀', attr: { str: 1, dex: 1 } }
    },
    'sa_meet_mentor': {
      id: 'sa_meet_mentor',
      name: '师徒之缘',
      description: '在破庙中初识鹤隐',
      icon: '🦢',
      category: '剧情',
      act: 1,
      secret: false,
      reward: { title: '有缘人', attr: { wis: 2 } }
    },
    'sa_cangzhou_explorer': {
      id: 'sa_cangzhou_explorer',
      name: '沧州探查者',
      description: '发现血骨门在沧州的秘密据点',
      icon: '🔍',
      category: '探索',
      act: 1,
      secret: false,
      reward: { exp: 500 }
    },
    'sa_first_blood': {
      id: 'sa_first_blood',
      name: '初战告捷',
      description: '首次击败血骨门弟子',
      icon: '⚔️',
      category: '战斗',
      act: 1,
      secret: false,
      reward: { item: 'item_blood_bone_token' }
    },
    'sa_night_watcher': {
      id: 'sa_night_watcher',
      name: '夜行者',
      description: '在沧州完成夜间潜入任务',
      icon: '🌙',
      category: '探索',
      act: 1,
      secret: true,
      condition: '在夜间时段完成潜入',
      reward: { skill: 'stealth_bonus' }
    },

    // ========== 第二幕成就 ==========
    'sa_fragment_hunter': {
      id: 'sa_fragment_hunter',
      name: '碎片猎人',
      description: '获得第一块玄铁令碎片',
      icon: '💎',
      category: '剧情',
      act: 2,
      secret: false,
      reward: { attr: { str: 2, con: 1 } }
    },
    'sa_fragment_collector': {
      id: 'sa_fragment_collector',
      name: '碎片收集者',
      description: '集齐三块玄铁令碎片',
      icon: '✨',
      category: '剧情',
      act: 2,
      secret: false,
      reward: { title: '天命之人', attr: { all: 1 } }
    },
    'sa_nangong_savior': {
      id: 'sa_nangong_savior',
      name: '南宫救星',
      description: '成功解救南宫世家',
      icon: '🛡️',
      category: '剧情',
      act: 2,
      secret: false,
      reward: { relation: { npc_nangong_lie: 20 } }
    },
    'sa_fragment_resist': {
      id: 'sa_fragment_resist',
      name: '意志坚定',
      description: '抵抗住玄铁令碎片的侵蚀',
      icon: '🧘',
      category: '隐藏',
      act: 2,
      secret: true,
      condition: '在碎片侵蚀事件中选择抵抗',
      reward: { attr: { wis: 3 }, title: '心如止水' }
    },
    'sa_fragment_embrace': {
      id: 'sa_fragment_embrace',
      name: '力量渴求',
      description: '接受玄铁令碎片的力量',
      icon: '🔥',
      category: '隐藏',
      act: 2,
      secret: true,
      condition: '在碎片侵蚀事件中选择接受力量',
      reward: { attr: { str: 3 }, title: '力量追求者' }
    },
    'sa_speed_runner': {
      id: 'sa_speed_runner',
      name: '迅雷不及',
      description: '在3天内收集齐所有碎片',
      icon: '⚡',
      category: '挑战',
      act: 2,
      secret: true,
      condition: '3天内完成第二幕',
      reward: { title: '风驰电掣', attr: { dex: 3 } }
    },

    // ========== 第三幕成就 ==========
    'sa_league_member': {
      id: 'sa_league_member',
      name: '正道中人',
      description: '参加正道联盟大会',
      icon: '🤝',
      category: '剧情',
      act: 3,
      secret: false,
      reward: { reputation: { faction_good: 10 } }
    },
    'sa_leader_accept': {
      id: 'sa_leader_accept',
      name: '众望所归',
      description: '接受盟主之位',
      icon: '👑',
      category: '剧情',
      act: 3,
      secret: false,
      reward: { title: '武林盟主候选人', attr: { cha: 2 } }
    },
    'sa_leader_decline': {
      id: 'sa_leader_decline',
      name: '谦逊礼让',
      description: '推辞盟主之位',
      icon: '🙏',
      category: '剧情',
      act: 3,
      secret: false,
      reward: { title: '谦谦君子', attr: { wis: 2 } }
    },
    'sa_traitor_revealed': {
      id: 'sa_traitor_revealed',
      name: '火眼金睛',
      description: '识破内鬼身份',
      icon: '👁️',
      category: '剧情',
      act: 3,
      secret: false,
      reward: { attr: { wis: 2 } }
    },
    'sa_peacemaker': {
      id: 'sa_peacemaker',
      name: '和事佬',
      description: '成功调解正道联盟内部矛盾',
      icon: '☯️',
      category: '隐藏',
      act: 3,
      secret: true,
      condition: '在联盟大会上成功调解所有冲突',
      reward: { title: '和事佬', attr: { cha: 3 } }
    },

    // ========== 第四幕成就 ==========
    'sa_undercover_start': {
      id: 'sa_undercover_start',
      name: '深入虎穴',
      description: '开始潜入血骨门总坛',
      icon: '🕵️',
      category: '剧情',
      act: 4,
      secret: false,
      reward: { skill: 'disguise_master' }
    },
    'sa_undercover_disguise': {
      id: 'sa_undercover_disguise',
      name: '伪装大师',
      description: '以伪装身份潜入',
      icon: '🎭',
      category: '隐藏',
      act: 4,
      secret: true,
      condition: '选择伪装路线并成功',
      reward: { title: '千面郎君', attr: { dex: 2 } }
    },
    'sa_undercover_infiltrate': {
      id: 'sa_undercover_infiltrate',
      name: '渗透专家',
      description: '以渗透方式潜入',
      icon: '🐍',
      category: '隐藏',
      act: 4,
      secret: true,
      condition: '选择渗透路线并成功',
      reward: { title: '无形之影', attr: { dex: 2 } }
    },
    'sa_undercover_direct': {
      id: 'sa_undercover_direct',
      name: '正面突破',
      description: '以正面方式潜入',
      icon: '💪',
      category: '隐藏',
      act: 4,
      secret: true,
      condition: '选择正面路线并成功',
      reward: { title: '勇者无畏', attr: { str: 2 } }
    },
    'sa_meet_lengyue': {
      id: 'sa_meet_lengyue',
      name: '月下相会',
      description: '与冷月秘密会面',
      icon: '🌙',
      category: '剧情',
      act: 4,
      secret: false,
      reward: { relation: { npc_leng_yue: 15 } }
    },
    'sa_moral_test_pass': {
      id: 'sa_moral_test_pass',
      name: '慈悲为怀',
      description: '在道德考验中选择宽恕',
      icon: '❤️',
      category: '隐藏',
      act: 4,
      secret: true,
      condition: '放过血骨门弟子',
      reward: { moral: 10, title: '仁者无敌' }
    },
    'sa_moral_test_fail': {
      id: 'sa_moral_test_fail',
      name: '斩草除根',
      description: '在道德考验中选择击杀',
      icon: '⚔️',
      category: '隐藏',
      act: 4,
      secret: true,
      condition: '击杀血骨门弟子',
      reward: { moral: -10, title: '铁血无情' }
    },
    'sa_xuanming_deal': {
      id: 'sa_xuanming_deal',
      name: '与虎谋皮',
      description: '与玄冥教达成密约',
      icon: '🤝',
      category: '剧情',
      act: 4,
      secret: false,
      reward: { relation: { faction_xuanming: 10 } }
    },

    // ========== 第五幕成就 ==========
    'sa_final_battle': {
      id: 'sa_final_battle',
      name: '决战时刻',
      description: '进入最终决战',
      icon: '⚔️',
      category: '剧情',
      act: 5,
      secret: false,
      reward: { exp: 1000 }
    },
    'sa_truth_revealed': {
      id: 'sa_truth_revealed',
      name: '真相大白',
      description: '了解骨冥子的过去',
      icon: '💡',
      category: '剧情',
      act: 5,
      secret: false,
      reward: { title: '真相追寻者', attr: { wis: 1 } }
    },
    'sa_choice_reject': {
      id: 'sa_choice_reject',
      name: '自力更生',
      description: '最终选择拒绝玄铁令',
      icon: '✊',
      category: '结局',
      act: 5,
      secret: false,
      reward: { title: '自力更生', attr: { str: 3, con: 2 } }
    },
    'sa_choice_borrow': {
      id: 'sa_choice_borrow',
      name: '借力打力',
      description: '最终选择借用玄铁令',
      icon: '⚡',
      category: '结局',
      act: 5,
      secret: false,
      reward: { title: '借力打力', attr: { str: 2, dex: 2, con: 2 } }
    },
    'sa_choice_sacrifice': {
      id: 'sa_choice_sacrifice',
      name: '舍生取义',
      description: '最终选择牺牲自己',
      icon: '🔥',
      category: '结局',
      act: 5,
      secret: false,
      reward: { title: '武林烈士', attr: { all: 2 } }
    },
    'sa_gumingzi_defeated': {
      id: 'sa_gumingzi_defeated',
      name: '魔头伏诛',
      description: '击败骨冥子',
      icon: '☠️',
      category: '剧情',
      act: 5,
      secret: false,
      reward: { exp: 2000, item: 'item_gumingzi_ring' }
    },
    'sa_no_damage': {
      id: 'sa_no_damage',
      name: '无伤通关',
      description: '击败骨冥子且不受伤害',
      icon: '🛡️',
      category: '挑战',
      act: 5,
      secret: true,
      condition: '满血击败骨冥子',
      reward: { title: '无伤大师', attr: { dex: 5 } }
    },

    // ========== 第六幕成就 ==========
    'sa_victory': {
      id: 'sa_victory',
      name: '江湖太平',
      description: '完成主线剧情',
      icon: '🏆',
      category: '剧情',
      act: 6,
      secret: false,
      reward: { title: '武林英雄', attr: { all: 3 } }
    },
    'sa_ending_hermit': {
      id: 'sa_ending_hermit',
      name: '隐世高人',
      description: '达成隐世结局',
      icon: '🏔️',
      category: '结局',
      act: 6,
      secret: false,
      reward: { title: '隐世高人', attr: { wis: 5 } }
    },
    'sa_ending_master': {
      id: 'sa_ending_master',
      name: '开派祖师',
      description: '达成开派结局',
      icon: '🏛️',
      category: '结局',
      act: 6,
      secret: false,
      reward: { title: '开派祖师', attr: { cha: 5 } }
    },
    'sa_ending_leader': {
      id: 'sa_ending_leader',
      name: '武林盟主',
      description: '达成盟主结局',
      icon: '👑',
      category: '结局',
      act: 6,
      secret: false,
      reward: { title: '武林盟主', attr: { cha: 3, str: 2 } }
    },
    'sa_ending_evil': {
      id: 'sa_ending_evil',
      name: '堕入魔道',
      description: '达成魔道结局',
      icon: '👿',
      category: '隐藏结局',
      act: 6,
      secret: true,
      condition: '道德值-80以下通关',
      reward: { title: '魔道至尊', attr: { str: 5 } }
    },
    'sa_north_hint': {
      id: 'sa_north_hint',
      name: '北疆迷云',
      description: '发现北疆的线索',
      icon: '❄️',
      category: '隐藏',
      act: 6,
      secret: true,
      condition: '观看完整结局动画',
      reward: { hint: '二周目解锁北疆剧情' }
    },

    // ========== 综合成就 ==========
    'sa_complete_all': {
      id: 'sa_complete_all',
      name: '血骨终结者',
      description: '完成所有主线任务',
      icon: '🎯',
      category: '综合',
      act: 0,
      secret: false,
      reward: { title: '血骨终结者', attr: { all: 5 } }
    },
    'sa_all_choices': {
      id: 'sa_all_choices',
      name: '体验派',
      description: '体验所有关键抉择',
      icon: '🎭',
      category: '综合',
      act: 0,
      secret: true,
      condition: '多周目体验所有选择',
      reward: { title: '体验派玩家' }
    },
    'sa_all_endings': {
      id: 'sa_all_endings',
      name: '全结局收集',
      description: '达成所有结局',
      icon: '📚',
      category: '综合',
      act: 0,
      secret: true,
      condition: '达成8种不同结局',
      reward: { title: '剧情大师', attr: { all: 10 } }
    },
    'sa_perfect_run': {
      id: 'sa_perfect_run',
      name: '完美通关',
      description: '道德80+、完成所有隐藏任务、无伤击败骨冥子',
      icon: '💎',
      category: '终极',
      act: 0,
      secret: true,
      condition: '最完美的一周目',
      reward: { title: '完美侠客', attr: { all: 10 }, item: 'item_perfect_sword' }
    },
    'sa_speed_master': {
      id: 'sa_speed_master',
      name: '速通大师',
      description: '7天内完成主线',
      icon: '⏱️',
      category: '挑战',
      act: 0,
      secret: true,
      condition: '7天内通关',
      reward: { title: '速通大师' }
    }
  };

  // ==================== 收集品数据库 ====================
  const COLLECTIBLES = {
    // 信件类
    'col_letter_heyin': {
      id: 'col_letter_heyin',
      name: '鹤隐的亲笔信',
      description: '一切的开始，泛黄的信纸上写着江湖大难将至',
      icon: '📜',
      category: '信件',
      act: 1,
      location: '初始获得'
    },
    'col_letter_fragment': {
      id: 'col_letter_fragment',
      name: '碎片研究笔记',
      description: '关于玄铁令碎片的神秘笔记',
      icon: '📋',
      category: '信件',
      act: 2,
      location: '第二幕获得'
    },
    'col_letter_traitor': {
      id: 'col_letter_traitor',
      name: '内鬼的密信',
      description: '正道联盟内鬼与血骨门的通信',
      icon: '📨',
      category: '信件',
      act: 3,
      location: '第三幕获得'
    },

    // 碎片类
    'col_fragment_kaifeng': {
      id: 'col_fragment_kaifeng',
      name: '开封碎片',
      description: '在开封获得的玄铁令碎片，散发着诡异的光芒',
      icon: '💎',
      category: '碎片',
      act: 2,
      location: '开封地下城'
    },
    'col_fragment_yangzhou': {
      id: 'col_fragment_yangzhou',
      name: '扬州碎片',
      description: '南宫世家世代守护的碎片',
      icon: '💎',
      category: '碎片',
      act: 2,
      location: '扬州'
    },
    'col_fragment_liangzhou': {
      id: 'col_fragment_liangzhou',
      name: '凉州碎片',
      description: '从玄冥教手中夺回的碎片',
      icon: '💎',
      category: '碎片',
      act: 2,
      location: '凉州'
    },
    'col_fragment_complete': {
      id: 'col_fragment_complete',
      name: '完整的玄铁令',
      description: '集齐三块碎片后的完整玄铁令',
      icon: '✨',
      category: '碎片',
      act: 5,
      location: '最终决战'
    },

    // 密约类
    'col_deal_xuanming': {
      id: 'col_deal_xuanming',
      name: '玄冥密约',
      description: '与玄冥教达成的秘密协议',
      icon: '📜',
      category: '密约',
      act: 4,
      location: '潜入任务'
    },
    'col_deal_riyue': {
      id: 'col_deal_riyue',
      name: '日月盟书',
      description: '与日月神教的盟约',
      icon: '📜',
      category: '密约',
      act: 4,
      location: '潜入任务（可选）'
    },

    // 记忆类
    'col_memory_gumingzi': {
      id: 'col_memory_gumingzi',
      name: '骨冥子的记忆',
      description: '了解骨冥子过去的真相',
      icon: '💭',
      category: '记忆',
      act: 5,
      location: '最终决战对话'
    },
    'col_memory_heyin': {
      id: 'col_memory_heyin',
      name: '鹤隐的往事',
      description: '鹤隐年轻时的故事',
      icon: '💭',
      category: '记忆',
      act: 6,
      location: '结局后对话'
    },

    // 隐藏类
    'col_hidden_north': {
      id: 'col_hidden_north',
      name: '北疆地图',
      description: '指向北方神秘之地的古老地图',
      icon: '🗺️',
      category: '隐藏',
      act: 6,
      location: '结局动画',
      secret: true
    },
    'col_hidden_true_boss': {
      id: 'col_hidden_true_boss',
      name: '幕后黑手的线索',
      description: '暗示真正反派的蛛丝马迹',
      icon: '🔍',
      category: '隐藏',
      act: 6,
      location: '完美通关',
      secret: true
    }
  };

  // ==================== 称号系统 ====================
  const TITLES = {
    // 剧情称号
    '江湖新秀': { attr: { str: 1, dex: 1 }, description: '初入江湖的新人' },
    '有缘人': { attr: { wis: 2 }, description: '与鹤隐有缘之人' },
    '天命之人': { attr: { all: 1 }, description: '被玄铁令选中的人' },
    '武林盟主候选人': { attr: { cha: 2 }, description: '有望成为盟主的人' },
    '谦谦君子': { attr: { wis: 2 }, description: '谦逊有礼的君子' },
    '自力更生': { attr: { str: 3, con: 2 }, description: '依靠自己的力量' },
    '借力打力': { attr: { str: 2, dex: 2, con: 2 }, description: '善于借用外力' },
    '武林烈士': { attr: { all: 2 }, description: '为江湖牺牲的英雄' },
    '武林英雄': { attr: { all: 3 }, description: '拯救江湖的英雄' },
    '隐世高人': { attr: { wis: 5 }, description: '隐居山林的世外高人' },
    '开派祖师': { attr: { cha: 5 }, description: '开宗立派的祖师' },
    '武林盟主': { attr: { cha: 3, str: 2 }, description: '统领武林的盟主' },
    '魔道至尊': { attr: { str: 5 }, description: '魔道至高无上的存在' },

    // 隐藏称号
    '心如止水': { attr: { wis: 3 }, description: '不受外物所动' },
    '力量追求者': { attr: { str: 3 }, description: '追求极致力量' },
    '风驰电掣': { attr: { dex: 3 }, description: '速度如风' },
    '和事佬': { attr: { cha: 3 }, description: '善于调解矛盾' },
    '千面郎君': { attr: { dex: 2 }, description: '伪装大师' },
    '无形之影': { attr: { dex: 2 }, description: '渗透专家' },
    '勇者无畏': { attr: { str: 2 }, description: '勇敢无畏' },
    '仁者无敌': { attr: {}, description: '以仁德服人' },
    '铁血无情': { attr: {}, description: '冷酷无情' },
    '无伤大师': { attr: { dex: 5 }, description: '战斗无伤' },

    // 综合称号
    '血骨终结者': { attr: { all: 5 }, description: '终结血骨门的人' },
    '完美侠客': { attr: { all: 10 }, description: '完美的江湖侠客' },
    '剧情大师': { attr: { all: 10 }, description: '精通剧情的人' },
    '体验派玩家': { attr: {}, description: '体验所有内容的玩家' },
    '速通大师': { attr: {}, description: '快速通关的高手' }
  };

  // ==================== 核心类 ====================
  class StoryAchievementsExtended {
    constructor() {
      this.achievements = this._loadAchievements();
      this.collection = this._loadCollection();
      this.currentTitles = [];
    }

    // ==================== 存储管理 ====================
    _loadAchievements() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    }

    _saveAchievements() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.achievements));
    }

    _loadCollection() {
      try {
        return JSON.parse(localStorage.getItem(COLLECTION_KEY)) || {};
      } catch {
        return {};
      }
    }

    _saveCollection() {
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(this.collection));
    }

    // ==================== 成就管理 ====================
    
    /**
     * 解锁成就
     */
    unlock(achievementId, showToast = true) {
      if (this.achievements[achievementId]) return false;

      const achievement = STORY_ACHIEVEMENTS[achievementId];
      if (!achievement) return false;

      this.achievements[achievementId] = {
        unlockedAt: Date.now(),
        ...achievement
      };
      this._saveAchievements();

      // 应用奖励
      this._applyReward(achievement.reward);

      // 显示提示
      if (showToast && typeof window.showToast === 'function') {
        window.showToast(`🏆 解锁成就：${achievement.name}`, 'achievement');
      }

      // 检查综合成就
      this._checkCompositeAchievements();

      return true;
    }

    /**
     * 检查是否已解锁
     */
    isUnlocked(achievementId) {
      return !!this.achievements[achievementId];
    }

    /**
     * 获取成就信息
     */
    getAchievement(achievementId) {
      return STORY_ACHIEVEMENTS[achievementId] || null;
    }

    /**
     * 获取所有成就
     */
    getAllAchievements() {
      return Object.values(STORY_ACHIEVEMENTS);
    }

    /**
     * 获取已解锁成就
     */
    getUnlockedAchievements() {
      return Object.keys(this.achievements).map(id => ({
        ...STORY_ACHIEVEMENTS[id],
        unlockedAt: this.achievements[id].unlockedAt
      }));
    }

    /**
     * 按幕次获取成就
     */
    getAchievementsByAct(actNum) {
      return Object.values(STORY_ACHIEVEMENTS).filter(a => a.act === actNum);
    }

    /**
     * 获取完成度
     */
    getCompletionRate() {
      const total = Object.keys(STORY_ACHIEVEMENTS).length;
      const unlocked = Object.keys(this.achievements).length;
      return { total, unlocked, percentage: Math.round((unlocked / total) * 100) };
    }

    // ==================== 收集品管理 ====================

    /**
     * 添加收集品
     */
    addCollectible(collectibleId, showToast = true) {
      if (this.collection[collectibleId]) return false;

      const item = COLLECTIBLES[collectibleId];
      if (!item) return false;

      this.collection[collectibleId] = {
        obtainedAt: Date.now(),
        ...item
      };
      this._saveCollection();

      if (showToast && typeof window.showToast === 'function') {
        window.showToast(`📦 获得收集品：${item.name}`, 'info');
      }

      return true;
    }

    /**
     * 检查是否已获得
     */
    hasCollectible(collectibleId) {
      return !!this.collection[collectibleId];
    }

    /**
     * 获取所有收集品
     */
    getAllCollectibles() {
      return Object.values(COLLECTIBLES);
    }

    /**
     * 获取已收集物品
     */
    getCollectedItems() {
      return Object.keys(this.collection).map(id => ({
        ...COLLECTIBLES[id],
        obtainedAt: this.collection[id].obtainedAt
      }));
    }

    /**
     * 按类别获取收集品
     */
    getCollectiblesByCategory(category) {
      return Object.values(COLLECTIBLES).filter(c => c.category === category);
    }

    // ==================== 称号管理 ====================

    /**
     * 装备称号
     */
    equipTitle(titleName) {
      const title = TITLES[titleName];
      if (!title) return false;

      // 检查是否已解锁对应成就
      const achievement = Object.values(STORY_ACHIEVEMENTS).find(a => 
        a.reward && a.reward.title === titleName
      );
      if (achievement && !this.isUnlocked(achievement.id)) {
        return false;
      }

      if (!this.currentTitles.includes(titleName)) {
        this.currentTitles.push(titleName);
        this._applyTitleEffect(title);
      }

      return true;
    }

    /**
     * 卸下称号
     */
    unequipTitle(titleName) {
      const idx = this.currentTitles.indexOf(titleName);
      if (idx > -1) {
        this.currentTitles.splice(idx, 1);
        return true;
      }
      return false;
    }

    /**
     * 获取可用称号
     */
    getAvailableTitles() {
      const unlockedTitles = [];
      Object.values(STORY_ACHIEVEMENTS).forEach(a => {
        if (a.reward && a.reward.title && this.isUnlocked(a.id)) {
          unlockedTitles.push({
            name: a.reward.title,
            ...TITLES[a.reward.title]
          });
        }
      });
      return unlockedTitles;
    }

    // ==================== 奖励应用 ====================

    _applyReward(reward) {
      if (!reward) return;

      // 属性奖励
      if (reward.attr) {
        if (reward.attr.all) {
          // 全属性加成
          ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(attr => {
            // 这里应该调用游戏属性系统
            console.log(`[Achievement] 属性加成: ${attr} +${reward.attr.all}`);
          });
        } else {
          Object.entries(reward.attr).forEach(([attr, value]) => {
            console.log(`[Achievement] 属性加成: ${attr} +${value}`);
          });
        }
      }

      // 经验奖励
      if (reward.exp) {
        console.log(`[Achievement] 经验奖励: +${reward.exp}`);
      }

      // 道具奖励
      if (reward.item) {
        console.log(`[Achievement] 道具奖励: ${reward.item}`);
      }

      // 技能奖励
      if (reward.skill) {
        console.log(`[Achievement] 技能奖励: ${reward.skill}`);
      }

      // 声望奖励
      if (reward.reputation) {
        Object.entries(reward.reputation).forEach(([faction, value]) => {
          console.log(`[Achievement] 声望奖励: ${faction} +${value}`);
        });
      }

      // 关系奖励
      if (reward.relation) {
        Object.entries(reward.relation).forEach(([npc, value]) => {
          console.log(`[Achievement] 关系奖励: ${npc} +${value}`);
        });
      }

      // 道德值奖励
      if (reward.moral) {
        console.log(`[Achievement] 道德值变化: ${reward.moral > 0 ? '+' : ''}${reward.moral}`);
      }
    }

    _applyTitleEffect(title) {
      if (title.attr) {
        if (title.attr.all) {
          ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(attr => {
            console.log(`[Title] 称号加成: ${attr} +${title.attr.all}`);
          });
        } else {
          Object.entries(title.attr).forEach(([attr, value]) => {
            console.log(`[Title] 称号加成: ${attr} +${value}`);
          });
        }
      }
    }

    // ==================== 综合成就检查 ====================

    _checkCompositeAchievements() {
      const unlocked = Object.keys(this.achievements);

      // 检查是否完成所有主线
      const mainQuests = [
        'sa_first_step', 'sa_meet_mentor', 'sa_cangzhou_explorer',
        'sa_fragment_collector', 'sa_nangong_savior',
        'sa_league_member', 'sa_traitor_revealed',
        'sa_undercover_start', 'sa_xuanming_deal',
        'sa_final_battle', 'sa_gumingzi_defeated', 'sa_victory'
      ];
      if (mainQuests.every(id => unlocked.includes(id))) {
        this.unlock('sa_complete_all', false);
      }
    }

    // ==================== 数据统计 ====================

    getStats() {
      const completion = this.getCompletionRate();
      const collected = Object.keys(this.collection).length;
      const totalCollectibles = Object.keys(COLLECTIBLES).length;

      return {
        achievements: completion,
        collectibles: {
          collected,
          total: totalCollectibles,
          percentage: Math.round((collected / totalCollectibles) * 100)
        },
        titles: {
          equipped: this.currentTitles.length,
          available: this.getAvailableTitles().length
        }
      };
    }

    // ==================== 导出/导入 ====================

    exportData() {
      return {
        achievements: this.achievements,
        collection: this.collection,
        currentTitles: this.currentTitles,
        exportedAt: Date.now()
      };
    }

    importData(data) {
      if (data.achievements) {
        this.achievements = data.achievements;
        this._saveAchievements();
      }
      if (data.collection) {
        this.collection = data.collection;
        this._saveCollection();
      }
      if (data.currentTitles) {
        this.currentTitles = data.currentTitles;
      }
      return true;
    }

    // ==================== 重置 ====================

    reset() {
      this.achievements = {};
      this.collection = {};
      this.currentTitles = [];
      this._saveAchievements();
      this._saveCollection();
    }
  }

  // ==================== 全局实例 ====================
  let instance = null;

  const StoryAchievementsExtendedAPI = {
    // 获取/创建实例
    getInstance() {
      if (!instance) {
        instance = new StoryAchievementsExtended();
      }
      return instance;
    },

    // 快捷方法
    unlock(id) { return this.getInstance().unlock(id); },
    isUnlocked(id) { return this.getInstance().isUnlocked(id); },
    addCollectible(id) { return this.getInstance().addCollectible(id); },
    hasCollectible(id) { return this.getInstance().hasCollectible(id); },
    equipTitle(name) { return this.getInstance().equipTitle(name); },
    getStats() { return this.getInstance().getStats(); },

    // 常量
    ACHIEVEMENTS: STORY_ACHIEVEMENTS,
    COLLECTIBLES: COLLECTIBLES,
    TITLES: TITLES
  };

  // 暴露到全局
  window.StoryAchievementsExtended = StoryAchievementsExtendedAPI;
  window.StoryAchievementsExtendedClass = StoryAchievementsExtended;

  console.log('[StoryAchievementsExtended] 主线成就系统已加载');
  console.log(`- 成就数: ${Object.keys(STORY_ACHIEVEMENTS).length}`);
  console.log(`- 收集品数: ${Object.keys(COLLECTIBLES).length}`);
  console.log(`- 称号数: ${Object.keys(TITLES).length}`);

})();