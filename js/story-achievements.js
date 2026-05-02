/**
 * story-achievements.js - 剧情专属成就系统
 * 《血骨门之乱》主线剧情成就
 */

(function() {
  'use strict';

  // ==================== 剧情成就数据库 ====================
  const STORY_ACHIEVEMENTS = {
    // ── 主线进度成就 ────────────────────────────────────
    ach_story_act1: {
      id: 'ach_story_act1',
      name: '踏入江湖',
      desc: '完成主线第一幕：踏入江湖',
      icon: '🌅',
      category: 'story_main',
      condition: () => {
        const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        const completed = mainQuest.completedQuests || [];
        return completed.some(q => q.startsWith('mq_act1'));
      },
      reward: { exp: 500, fame: 10 }
    },
    
    ach_story_act2: {
      id: 'ach_story_act2',
      name: '风云初动',
      desc: '完成主线第二幕：风云初动',
      icon: '⚡',
      category: 'story_main',
      condition: () => {
        const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        const completed = mainQuest.completedQuests || [];
        return completed.some(q => q.startsWith('mq_act2'));
      },
      reward: { exp: 800, fame: 15 }
    },
    
    ach_story_act3: {
      id: 'ach_story_act3',
      name: '三魔暗涌',
      desc: '完成主线第三幕：三魔暗涌',
      icon: '🌑',
      category: 'story_main',
      condition: () => {
        const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        const completed = mainQuest.completedQuests || [];
        return completed.some(q => q.startsWith('mq_act3'));
      },
      reward: { exp: 1000, fame: 20 }
    },
    
    ach_story_act4: {
      id: 'ach_story_act4',
      name: '至暗时刻',
      desc: '完成主线第四幕：联盟裂隙',
      icon: '💔',
      category: 'story_main',
      condition: () => {
        const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        const completed = mainQuest.completedQuests || [];
        return completed.some(q => q.startsWith('mq_act4'));
      },
      reward: { exp: 1200, fame: 25 }
    },
    
    ach_story_act5: {
      id: 'ach_story_act5',
      name: '决战天下',
      desc: '完成主线第五幕：血骨门决战',
      icon: '⚔️',
      category: 'story_main',
      condition: () => {
        const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        const completed = mainQuest.completedQuests || [];
        return completed.some(q => q.startsWith('mq_act5'));
      },
      reward: { exp: 2000, fame: 50, title: '正道栋梁' }
    },
    
    ach_story_complete: {
      id: 'ach_story_complete',
      name: '血骨门之乱',
      desc: '完成主线全部六幕剧情',
      icon: '🏆',
      category: 'story_main',
      rarity: 'epic',
      condition: () => {
        const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        const completed = mainQuest.completedQuests || [];
        return ['mq_act6_new_order', 'mq_act6_new_threat', 'mq_act6_north'].every(q => 
          completed.includes(q)
        );
      },
      reward: { exp: 5000, fame: 100, title: '武林传奇' }
    },

    // ── 剧情地下城成就 ─────────────────────────────────
    ach_dungeon_cangzhou: {
      id: 'ach_dungeon_cangzhou',
      name: '沧州救星',
      desc: '完成剧情地下城：沧州暗巷',
      icon: '🏮',
      category: 'story_dungeon',
      condition: () => {
        const completed = JSON.parse(localStorage.getItem('wuxia_story_dungeons') || '[]');
        return completed.includes('sd_cangzhou_hideout');
      },
      reward: { exp: 600, fame: 15 }
    },
    
    ach_dungeon_songshan: {
      id: 'ach_dungeon_songshan',
      name: '石窟探秘',
      desc: '完成剧情地下城：嵩山石窟',
      icon: '⛰️',
      category: 'story_dungeon',
      condition: () => {
        const completed = JSON.parse(localStorage.getItem('wuxia_story_dungeons') || '[]');
        return completed.includes('sd_songshan_grotto');
      },
      reward: { exp: 800, fame: 20 }
    },
    
    ach_dungeon_youzhou: {
      id: 'ach_dungeon_youzhou',
      name: '潜入者',
      desc: '完成剧情地下城：幽州总部（未被全面发现）',
      icon: '🥷',
      category: 'story_dungeon',
      condition: () => {
        const completed = JSON.parse(localStorage.getItem('wuxia_story_dungeons') || '[]');
        const stats = JSON.parse(localStorage.getItem('wuxia_dungeon_stats') || '{}');
        return completed.includes('sd_youzhou_headquarters') && 
               stats.youzhou_stealth === 'perfect';
      },
      reward: { exp: 1500, fame: 30, title: '神行太保' }
    },
    
    ach_dungeon_final: {
      id: 'ach_dungeon_final',
      name: '血骨门终结者',
      desc: '完成最终剧情地下城：血骨门总坛',
      icon: '💀',
      category: 'story_dungeon',
      rarity: 'epic',
      condition: () => {
        const completed = JSON.parse(localStorage.getItem('wuxia_story_dungeons') || '[]');
        return completed.includes('sd_final_bloodgate');
      },
      reward: { exp: 3000, fame: 80, title: '血骨门终结者' }
    },

    // ── BOSS击杀成就 ───────────────────────────────────
    ach_boss_gumingzi: {
      id: 'ach_boss_gumingzi',
      name: '骨冥子杀手',
      desc: '击败血骨门主骨冥子',
      icon: '👹',
      category: 'story_boss',
      rarity: 'epic',
      condition: () => {
        const kills = JSON.parse(localStorage.getItem('wuxia_boss_kills') || '[]');
        return kills.includes('npc_gumingzi');
      },
      reward: { exp: 2000, fame: 50 }
    },
    
    ach_boss_ancient_golem: {
      id: 'ach_boss_ancient_golem',
      name: '破石者',
      desc: '击败上古石魔',
      icon: '🗿',
      category: 'story_boss',
      condition: () => {
        const kills = JSON.parse(localStorage.getItem('wuxia_boss_kills') || '[]');
        return kills.includes('enemy_ancient_golem');
      },
      reward: { exp: 1000, fame: 25 }
    },
    
    ach_boss_all_elites: {
      id: 'ach_boss_all_elites',
      name: '追命使克星',
      desc: '击败所有血骨门追命使',
      icon: '☠️',
      category: 'story_boss',
      condition: () => {
        const kills = JSON.parse(localStorage.getItem('wuxia_boss_kills') || '[]');
        const required = ['enemy_xuegu_elite', 'enemy_zhuihun', 'enemy_xueren'];
        return required.every(id => kills.includes(id));
      },
      reward: { exp: 1500, fame: 30, title: '追命使克星' }
    },

    // ── 支线成就 ───────────────────────────────────────
    ach_side_all_sanmo: {
      id: 'ach_side_all_sanmo',
      name: '三魔猎手',
      desc: '完成所有三魔联盟支线任务',
      icon: '🔥',
      category: 'story_side',
      condition: () => {
        const completed = JSON.parse(localStorage.getItem('wuxia_side_quests') || '[]');
        const required = ['side_xuegu_intimidation', 'side_xuanming_infiltration', 'side_riyue_spies'];
        return required.every(q => completed.includes(q));
      },
      reward: { exp: 1200, fame: 25 }
    },
    
    ach_side_grudge: {
      id: 'ach_side_grudge',
      name: '恩怨分明',
      desc: '完成旧日仇敌支线，了结十年恩怨',
      icon: '⚔️',
      category: 'story_side',
      condition: () => {
        const completed = JSON.parse(localStorage.getItem('wuxia_side_quests') || '[]');
        return completed.includes('side_old_grudge');
      },
      reward: { exp: 800, fame: 15, title: '恩怨分明' }
    },

    // ── 收集成就 ───────────────────────────────────────
    ach_collect_all_shards: {
      id: 'ach_collect_all_shards',
      name: '玄铁令重组',
      desc: '收集全部三块玄铁令碎片',
      icon: '🗝️',
      category: 'story_collect',
      condition: () => {
        const collected = JSON.parse(localStorage.getItem('wuxia_story_collection') || '[]');
        return ['shard_xuantie_1', 'shard_xuantie_2', 'shard_xuantie_3']
          .every(s => collected.includes(s));
      },
      reward: { exp: 1500, fame: 30 }
    },
    
    ach_collect_secret: {
      id: 'ach_collect_secret',
      name: '考古学家',
      desc: '发现隐藏收集品：鹤隐的日记',
      icon: '📖',
      category: 'story_collect',
      rarity: 'rare',
      condition: () => {
        const collected = JSON.parse(localStorage.getItem('wuxia_story_collection') || '[]');
        return collected.includes('secret_heyin_diary');
      },
      reward: { exp: 1000, fame: 20, title: '考古学家' }
    },

    // ── 道德路线成就 ───────────────────────────────────
    ach_morality_hero: {
      id: 'ach_morality_hero',
      name: '正道之光',
      desc: '道德值达到+100，成为正道楷模',
      icon: '✨',
      category: 'story_morality',
      rarity: 'epic',
      condition: () => {
        const branch = JSON.parse(localStorage.getItem('wuxia_story_branch') || '{}');
        return (branch.morality || 0) >= 100;
      },
      reward: { exp: 2000, fame: 50, title: '正道之光' }
    },
    
    ach_morality_villain: {
      id: 'ach_morality_villain',
      name: '邪道至尊',
      desc: '道德值达到-100，成为邪道霸主',
      icon: '🖤',
      category: 'story_morality',
      rarity: 'epic',
      condition: () => {
        const branch = JSON.parse(localStorage.getItem('wuxia_story_branch') || '{}');
        return (branch.morality || 0) <= -100;
      },
      reward: { exp: 2000, fame: 50, title: '邪道至尊' }
    },

    // ── 结局成就 ───────────────────────────────────────
    ach_ending_hero: {
      id: 'ach_ending_hero',
      name: '武林盟主',
      desc: '达成完美结局：武林盟主',
      icon: '👑',
      category: 'story_ending',
      rarity: 'legendary',
      condition: () => {
        const endings = JSON.parse(localStorage.getItem('wuxia_endings') || '[]');
        return endings.includes('ending_hero');
      },
      reward: { exp: 5000, fame: 100, title: '武林盟主' }
    },
    
    ach_ending_dark: {
      id: 'ach_ending_dark',
      name: '魔道至尊',
      desc: '达成邪道结局：魔道至尊',
      icon: '💀',
      category: 'story_ending',
      rarity: 'legendary',
      condition: () => {
        const endings = JSON.parse(localStorage.getItem('wuxia_endings') || '[]');
        return endings.includes('ending_dark_lord');
      },
      reward: { exp: 5000, fame: 100, title: '魔道至尊' }
    },
    
    ach_ending_sage: {
      id: 'ach_ending_sage',
      name: '隐世高人',
      desc: '达成隐藏结局：隐世高人',
      icon: '🍃',
      category: 'story_ending',
      rarity: 'legendary',
      condition: () => {
        const endings = JSON.parse(localStorage.getItem('wuxia_endings') || '[]');
        return endings.includes('ending_sage');
      },
      reward: { exp: 5000, fame: 100, title: '隐世高人' }
    },
    
    ach_all_endings: {
      id: 'ach_all_endings',
      name: '全结局收集',
      desc: '达成所有四种结局',
      icon: '🎭',
      category: 'story_ending',
      rarity: 'legendary',
      condition: () => {
        const endings = JSON.parse(localStorage.getItem('wuxia_endings') || '[]');
        return ['ending_hero', 'ending_dark_lord', 'ending_sage', 'ending_tragic']
          .every(e => endings.includes(e));
      },
      reward: { exp: 10000, fame: 200, title: '剧情大师' }
    },

    // ── 特殊成就 ───────────────────────────────────────
    ach_no_death: {
      id: 'ach_no_death',
      name: '一命通关',
      desc: '完成主线剧情且从未死亡',
      icon: '💪',
      category: 'story_special',
      rarity: 'legendary',
      condition: () => {
        const stats = JSON.parse(localStorage.getItem('wuxia_story_stats') || '{}');
        const completed = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        return completed.isComplete && stats.deathCount === 0;
      },
      reward: { exp: 3000, fame: 50, title: '不死传说' }
    },
    
    ach_speed_run: {
      id: 'ach_speed_run',
      name: '速通大师',
      desc: '在30天内完成主线剧情',
      icon: '⚡',
      category: 'story_special',
      rarity: 'epic',
      condition: () => {
        const stats = JSON.parse(localStorage.getItem('wuxia_story_stats') || '{}');
        return stats.completedDays && stats.completedDays <= 30;
      },
      reward: { exp: 2000, fame: 40, title: '速通大师' }
    },
    
    ach_pacifist: {
      id: 'ach_pacifist',
      name: '仁者无敌',
      desc: '完成主线且击杀数少于50',
      icon: '🕊️',
      category: 'story_special',
      rarity: 'epic',
      condition: () => {
        const stats = JSON.parse(localStorage.getItem('wuxia_story_stats') || '{}');
        const completed = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
        return completed.isComplete && (stats.killCount || 0) < 50;
      },
      reward: { exp: 3000, fame: 60, title: '仁者无敌' }
    }
  };

  // ==================== 剧情称号系统 ====================
  const STORY_TITLES = {
    // 主线称号
    '正道栋梁': {
      desc: '完成主线第五幕',
      bonus: { str: 2, con: 2 }
    },
    '武林传奇': {
      desc: '完成全部主线剧情',
      bonus: { str: 3, dex: 3, con: 3, int: 3, wis: 3, cha: 3 }
    },
    '武林盟主': {
      desc: '达成完美结局',
      bonus: { str: 5, cha: 10 }
    },
    '魔道至尊': {
      desc: '达成邪道结局',
      bonus: { str: 10, cha: -5 }
    },
    '隐世高人': {
      desc: '达成隐藏结局',
      bonus: { wis: 10, int: 5 }
    },
    
    // 战斗称号
    '血骨门终结者': {
      desc: '完成最终地下城',
      bonus: { str: 5, con: 5 }
    },
    '追命使克星': {
      desc: '击败所有追命使',
      bonus: { dex: 5 }
    },
    '神行太保': {
      desc: '完美潜入幽州总部',
      bonus: { dex: 8 }
    },
    
    // 道德称号
    '正道之光': {
      desc: '道德值+100',
      bonus: { cha: 10 }
    },
    '邪道至尊': {
      desc: '道德值-100',
      bonus: { str: 10 }
    },
    
    // 特殊称号
    '不死传说': {
      desc: '一命通关',
      bonus: { con: 10 }
    },
    '速通大师': {
      desc: '30天内通关',
      bonus: { dex: 5, int: 5 }
    },
    '仁者无敌': {
      desc: '低击杀通关',
      bonus: { wis: 10, cha: 5 }
    },
    '剧情大师': {
      desc: '全结局收集',
      bonus: { int: 10, wis: 10 }
    }
  };

  // ==================== 成就管理器 ====================
  const StoryAchievementManager = {
    // 获取所有成就
    getAll() {
      return STORY_ACHIEVEMENTS;
    },

    // 检查单个成就
    check(achId) {
      const ach = STORY_ACHIEVEMENTS[achId];
      if (!ach) return false;
      
      // 检查是否已解锁
      const unlocked = this.getUnlocked();
      if (unlocked.includes(achId)) return false;
      
      // 检查条件
      if (ach.condition && ach.condition()) {
        this.unlock(achId);
        return true;
      }
      
      return false;
    },

    // 检查所有成就
    checkAll() {
      const newUnlocks = [];
      for (const [id, ach] of Object.entries(STORY_ACHIEVEMENTS)) {
        if (this.check(id)) {
          newUnlocks.push(ach);
        }
      }
      return newUnlocks;
    },

    // 解锁成就
    unlock(achId) {
      const ach = STORY_ACHIEVEMENTS[achId];
      if (!ach) return;
      
      const unlocked = this.getUnlocked();
      if (!unlocked.includes(achId)) {
        unlocked.push(achId);
        localStorage.setItem('wuxia_story_achievements', JSON.stringify(unlocked));
        
        // 发放奖励
        this.grantReward(ach);
        
        // 显示解锁提示
        this.showUnlockToast(ach);
        
        console.log('[StoryAchievement] 解锁成就:', ach.name);
      }
    },

    // 发放奖励
    grantReward(ach) {
      if (!ach.reward) return;
      
      // 经验
      if (ach.reward.exp) {
        // 这里需要调用游戏的经验系统
        console.log('[StoryAchievement] 获得经验:', ach.reward.exp);
      }
      
      // 声望
      if (ach.reward.fame) {
        console.log('[StoryAchievement] 获得声望:', ach.reward.fame);
      }
      
      // 称号
      if (ach.reward.title) {
        this.grantTitle(ach.reward.title);
      }
    },

    // 授予称号
    grantTitle(titleName) {
      const titles = JSON.parse(localStorage.getItem('wuxia_titles') || '[]');
      if (!titles.includes(titleName)) {
        titles.push(titleName);
        localStorage.setItem('wuxia_titles', JSON.stringify(titles));
        console.log('[StoryAchievement] 获得称号:', titleName);
      }
    },

    // 显示解锁提示
    showUnlockToast(ach) {
      const rarityColors = {
        common: '#95a5a6',
        rare: '#3498db',
        epic: '#9b59b6',
        legendary: '#f1c40f'
      };
      
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 15%;
        right: 20px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 2px solid ${rarityColors[ach.rarity] || rarityColors.common};
        border-radius: 12px;
        padding: 15px 20px;
        color: white;
        z-index: 99999;
        animation: ach-slide-in 0.5s ease;
        max-width: 300px;
      `;
      toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 36px;">${ach.icon}</div>
          <div>
            <div style="color: ${rarityColors[ach.rarity] || rarityColors.common}; font-size: 12px; text-transform: uppercase;">
              ${ach.rarity || 'common'} 成就解锁
            </div>
            <div style="font-weight: bold; font-size: 16px; margin: 4px 0;">${ach.name}</div>
            <div style="color: #888; font-size: 12px;">${ach.desc}</div>
          </div>
        </div>
      `;
      
      // 添加动画样式
      if (!document.getElementById('ach-anim-style')) {
        const style = document.createElement('style');
        style.id = 'ach-anim-style';
        style.textContent = `
          @keyframes ach-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = 'ach-slide-in 0.5s ease reverse forwards';
        setTimeout(() => toast.remove(), 500);
      }, 4000);
    },

    // 获取已解锁成就
    getUnlocked() {
      return JSON.parse(localStorage.getItem('wuxia_story_achievements') || '[]');
    },

    // 获取称号属性加成
    getTitleBonus(titleName) {
      return STORY_TITLES[titleName]?.bonus || {};
    },

    // 显示成就面板
    showAchievementPanel() {
      const unlocked = this.getUnlocked();
      const categories = {};
      
      // 分类
      Object.entries(STORY_ACHIEVEMENTS).forEach(([id, ach]) => {
        if (!categories[ach.category]) {
          categories[ach.category] = [];
        }
        categories[ach.category].push({ ...ach, id, isUnlocked: unlocked.includes(id) });
      });
      
      // 创建面板
      const overlay = document.createElement('div');
      overlay.className = 'cinema-overlay';
      overlay.style.zIndex = '100000';
      overlay.innerHTML = `
        <div style="width: 90%; max-width: 800px; max-height: 85vh; overflow-y: auto; background: #1a1a2e; border-radius: 12px; padding: 25px;">
          <h2 style="text-align: center; color: #f0c060; margin-bottom: 10px;">🏆 剧情成就</h2>
          <div style="text-align: center; color: #888; margin-bottom: 25px;">
            ${unlocked.length} / ${Object.keys(STORY_ACHIEVEMENTS).length} 已解锁
          </div>
          
          ${Object.entries(categories).map(([cat, achs]) => `
            <div style="margin-bottom: 25px;">
              <div style="color: #6495ed; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; border-bottom: 1px solid rgba(100,149,237,0.3); padding-bottom: 8px;">
                ${cat.replace('story_', '').toUpperCase()}
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
                ${achs.map(ach => `
                  <div style="
                    background: ${ach.isUnlocked ? 'rgba(240,192,96,0.1)' : 'rgba(100,100,100,0.1)'};
                    border: 1px solid ${ach.isUnlocked ? (ach.rarity === 'legendary' ? '#f1c40f' : ach.rarity === 'epic' ? '#9b59b6' : '#f0c060') : '#444'};
                    border-radius: 8px;
                    padding: 12px;
                    opacity: ${ach.isUnlocked ? 1 : 0.6};
                  ">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                      <div style="font-size: 28px;">${ach.isUnlocked ? ach.icon : '🔒'}</div>
                      <div style="flex: 1;">
                        <div style="color: ${ach.isUnlocked ? '#fff' : '#666'}; font-weight: bold; font-size: 14px;">
                          ${ach.isUnlocked ? ach.name : '???'}
                        </div>
                        ${ach.isUnlocked && ach.rarity ? `
                          <div style="font-size: 10px; color: ${ach.rarity === 'legendary' ? '#f1c40f' : ach.rarity === 'epic' ? '#9b59b6' : '#888'}; text-transform: uppercase;">
                            ${ach.rarity}
                          </div>
                        ` : ''}
                      </div>
                    </div>
                    <div style="color: ${ach.isUnlocked ? '#aaa' : '#555'}; font-size: 12px; line-height: 1.4;">
                      ${ach.isUnlocked ? ach.desc : '完成特定条件解锁'}
                    </div>
                    ${ach.isUnlocked && ach.reward ? `
                      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <div style="color: #4ecb71; font-size: 11px;">
                          ${ach.reward.exp ? `✨ ${ach.reward.exp} 经验` : ''}
                          ${ach.reward.fame ? ` · 🏆 ${ach.reward.fame} 声望` : ''}
                          ${ach.reward.title ? ` · 👑 ${ach.reward.title}` : ''}
                        </div>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          
          <div style="text-align: center; margin-top: 20px;">
            <button class="cinema-btn" onclick="this.closest('.cinema-overlay').remove()">关闭</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
    }
  };

  // ==================== 导出 ====================
  window.StoryAchievementManager = StoryAchievementManager;
  window.STORY_TITLES = STORY_TITLES;
  
  // 便捷函数
  window.checkStoryAchievements = function() {
    return StoryAchievementManager.checkAll();
  };
  
  window.showStoryAchievements = function() {
    StoryAchievementManager.showAchievementPanel();
  };

  // 定期检查成就
  setInterval(() => {
    StoryAchievementManager.checkAll();
  }, 30000); // 每30秒检查一次

  console.log('[StoryAchievements] 剧情成就系统已加载');
  console.log('[StoryAchievements] 可用命令: checkStoryAchievements(), showStoryAchievements()');

})();
