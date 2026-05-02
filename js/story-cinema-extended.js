/**
 * story-cinema-extended.js - 剧情过场动画扩展包
 * 更多动画、分支剧情、多结局
 */

(function() {
  'use strict';

  // ==================== 扩展动画资源库 ====================
  const EXTENDED_CINEMA = {
    
    // ── 支线剧情动画 ────────────────────────────────────
    
    // 三魔联盟支线
    side_xuegu_intimidation: {
      title: '支线 · 血骨门恐吓',
      frames: [
        {
          text: `
    🌑 月黑风高夜 🌑
    
    你收到一封血骨门的恐吓信...
    
    ╔═══════════════════════╗
    ║  💀 血骨门 💀          ║
    ║                       ║
    ║  "识相的，就别多管闲事" ║
    ║                       ║
    ║  否则，后果自负...     ║
    ║                       ║
    ╚═══════════════════════╝
    
    信纸边缘，有暗红色的血迹...
          `,
          duration: 4000,
          type: 'side_quest'
        }
      ],
      bgm: 'ominous',
      transition: 'fade'
    },

    side_xuanming_infiltration: {
      title: '支线 · 玄冥教渗透',
      frames: [
        {
          text: `
    ❄️ 玄冥教 ❄️
    
    你发现玄冥教正在渗透正道门派...
    
        🏯
       ╱  ╲
      ╱ 🎭 ╲    ← 内应
     ╱______╲
    
    他们伪装成普通弟子，
    暗中收集情报...
          `,
          duration: 4000,
          type: 'side_quest'
        }
      ],
      bgm: 'suspense',
      transition: 'dissolve'
    },

    // 江湖恩仇支线
    side_old_grudge: {
      title: '支线 · 旧日仇敌',
      frames: [
        {
          text: `
    ⚔️ 十年前的恩怨 ⚔️
    
    那个身影，你永远不会忘记...
    
    👤══════════════💥══════════════👤
       你              他
       
    十年前的那场决斗，
    今日必须有个了断！
          `,
          duration: 4000,
          type: 'side_quest'
        }
      ],
      bgm: 'tense',
      transition: 'flash'
    },

    // ── 门派专属剧情动画 ────────────────────────────────
    
    // 少林
    sect_shaolin_rescue: {
      title: '少林 · 营救玄悟',
      frames: [
        {
          text: `
    🏯 少林寺 🏯
    
    玄悟大师被囚禁在血骨门地牢...
    
    ╔═══════════════════════╗
    ║  🏯 少林寺            ║
    ║                       ║
    ║  "玄悟师兄乃本寺首座   ║
    ║   无论如何也要救回！"  ║
    ║                       ║
    ║     ——方丈           ║
    ╚═══════════════════════╝
          `,
          duration: 4000,
          type: 'sect_quest'
        }
      ],
      bgm: 'righteous',
      transition: 'fade'
    },

    // 武当
    sect_wudang_trial: {
      title: '武当 · 真武试炼',
      frames: [
        {
          text: `
    ☯️ 武当山 · 真武殿 ☯️
    
    清虚真人设下真武七截阵...
    
         ☯️
        ╱│╲
       ☯️ │ ☯️
      ╱   │   ╲
    ☯️────┼────☯️
         │
        ☯️
    
    破此阵者，可得武当真传！
          `,
          duration: 4000,
          type: 'sect_quest'
        }
      ],
      bgm: 'taoist',
      transition: 'dissolve'
    },

    // 血骨门（邪派路线）
    sect_xuegu_betrayal: {
      title: '血骨门 · 背叛正道',
      frames: [
        {
          text: `
    💀 血骨门 💀
    
    你决定加入血骨门...
    
    ╔═══════════════════════╗
    ║  💀 歃血为盟 💀        ║
    ║                       ║
    ║  "从今以后，你就是     ║
    ║   我血骨门的人了。"    ║
    ║                       ║
    ║  ——骨冥子            ║
    ╚═══════════════════════╝
    
    正道？邪道？
    不过是弱肉强食罢了...
          `,
          duration: 5000,
          type: 'sect_quest'
        }
      ],
      bgm: 'evil',
      transition: 'fade_slow'
    },

    // ── 隐藏剧情动画 ────────────────────────────────────
    
    secret_heyin_past: {
      title: '隐藏 · 鹤隐的过去',
      frames: [
        {
          text: `
    🔮 隐藏剧情 🔮
    
    你发现了鹤隐老者的真实身份...
    
    ╔═══════════════════════╗
    ║  三十年前...          ║
    ║                       ║
    ║  鹤隐 = 玄悟的师兄     ║
    ║  当年争夺掌门之位      ║
    ║  一怒之下离开少林      ║
    ║                       ║
    ║  他一直在暗中守护...   ║
    ╚═══════════════════════╝
          `,
          duration: 6000,
          type: 'secret'
        }
      ],
      bgm: 'mystery',
      transition: 'fade'
    },

    secret_xuantie_truth: {
      title: '隐藏 · 玄铁令真相',
      frames: [
        {
          text: `
    🔮 上古秘辛 🔮
    
    玄铁令的真正用途...
    
    ╔═══════════════════════╗
    ║  玄铁令不是钥匙        ║
    ║                       ║
    ║  而是——封印本身！      ║
    ║                       ║
    ║  骨冥子想解开的，       ║
    ║  是一个远古魔神...      ║
    ║                       ║
    ║  鹤隐知道这一切，      ║
    ║  所以他必须阻止...     ║
    ╚══════════════════════╝
          `,
          duration: 7000,
          type: 'secret'
        }
      ],
      bgm: 'revelation',
      transition: 'flash'
    },

    // ── 多结局动画 ──────────────────────────────────────
    
    ending_hero: {
      title: '结局 · 武林盟主',
      frames: [
        {
          text: `
    🏆 完美结局 · 武林盟主 🏆
    
    你击败了骨冥子，拯救了武林！
    
    ╔══════════════════════════════════╗
    ║                                  ║
    ║     👑 武林盟主 👑               ║
    ║                                  ║
    ║   你被封为武林盟主，             ║
    ║   统率正道，维护江湖和平。       ║
    ║                                  ║
    ║   玄铁令被重新封印，             ║
    ║   天下太平...                    ║
    ║                                  ║
    ║   至少，暂时如此。               ║
    ║                                  ║
    ╚══════════════════════════════════╝
          `,
          duration: 6000,
          type: 'ending'
        }
      ],
      bgm: 'triumph',
      transition: 'sparkle'
    },

    ending_dark_lord: {
      title: '结局 · 魔道至尊',
      frames: [
        {
          text: `
    👿 邪道结局 · 魔道至尊 👿
    
    你击败了骨冥子，夺取了玄铁令！
    
    ╔══════════════════════════════════╗
    ║                                  ║
    ║     💀 魔道至尊 💀               ║
    ║                                  ║
    ║   你杀死了骨冥子，               ║
    ║   成为了新的血骨门主。           ║
    ║                                  ║
    ║   玄铁令在你手中，               ║
    ║   你感受到了那股远古的力量...    ║
    ║                                  ║
    ║   天下，即将臣服于你！           ║
    ║                                  ║
    ╚══════════════════════════════════╝
          `,
          duration: 6000,
          type: 'ending'
        }
      ],
      bgm: 'dark_triumph',
      transition: 'dark_flash'
    },

    ending_sage: {
      title: '结局 · 隐世高人',
      frames: [
        {
          text: `
    🍃 隐藏结局 · 隐世高人 🍃
    
    你看透了江湖纷争，选择归隐...
    
    ╔══════════════════════════════════╗
    ║                                  ║
    ║     🍃 隐世高人 🍃               ║
    ║                                  ║
    ║   你将玄铁令交给鹤隐，           ║
    ║   自己则归隐山林。               ║
    ║                                  ║
    ║   江湖上再也没有你的传说，       ║
    ║   只有山林间的清风明月...        ║
    ║                                  ║
    ║   这才是真正的自由。             ║
    ║                                  ║
    ╚══════════════════════════════════╝
          `,
          duration: 6000,
          type: 'ending'
        }
      ],
      bgm: 'peaceful',
      transition: 'fade_slow'
    },

    ending_tragic: {
      title: '结局 · 壮烈牺牲',
      frames: [
        {
          text: `
    💔 悲剧结局 · 壮烈牺牲 💔
    
    你选择了与骨冥子同归于尽...
    
    ╔══════════════════════════════════╗
    ║                                  ║
    ║     ⚔️ 壮烈牺牲 ⚔️               ║
    ║                                  ║
    ║   你用生命封印了玄铁令，         ║
    ║   与骨冥子一同坠入深渊。         ║
    ║                                  ║
    ║   武林得救了，                   ║
    ║   但你再也无法看到明天的太阳...  ║
    ║                                  ║
    ║   英雄，一路走好。               ║
    ║                                  ║
    ╚══════════════════════════════════╝
          `,
          duration: 6000,
          type: 'ending'
        }
      ],
      bgm: 'tragic',
      transition: 'fade'
    },

    // ── 特殊事件动画 ────────────────────────────────────
    
    event_first_kill: {
      title: '首次击杀',
      frames: [
        {
          text: `
    ⚔️ 首杀 ⚔️
    
    你第一次杀人...
    
    👤═══════💀═══════
         倒下
    
    鲜血染红了你的双手，
    这就是江湖...
          `,
          duration: 3000,
          type: 'milestone'
        }
      ],
      bgm: 'solemn',
      transition: 'fade'
    },

    event_master_death: {
      title: '师父之死',
      frames: [
        {
          text: `
    💔 师父！💔
    
    你的师父为了保护你...
    
    👴═══════💥═══════👤
    师父              敌人
    
    "徒儿...快走..."
    
    师父倒下了，
    你的心中燃起了复仇之火...
          `,
          duration: 5000,
          type: 'milestone'
        }
      ],
      bgm: 'tragic',
      transition: 'shake'
    },

    event_love_confession: {
      title: '情定终身',
      frames: [
        {
          text: `
    💕 表白 💕
    
    在月光下，你终于说出了那句话...
    
    🌙
    │
    👤══💕══👤
    你    她/他
    
    "我喜欢你，
     愿意和我一起闯荡江湖吗？"
    
    💕 情定终身 💕
          `,
          duration: 5000,
          type: 'milestone'
        }
      ],
      bgm: 'romantic',
      transition: 'sparkle'
    },

    // ── 场景氛围动画 ────────────────────────────────────
    
    scene_rainy_night: {
      title: '雨夜',
      frames: [
        {
          text: `
    🌧️ 雨夜 🌧️
    
    🌧️🌧️🌧️🌧️🌧️🌧️🌧️🌧️🌧️🌧️
    🌧️                🌧️
    🌧️      🏮        🌧️
    🌧️    客栈        🌧️
    🌧️                🌧️
    🌧️🌧️🌧️🌧️🌧️🌧️🌧️🌧️🌧️🌧️
    
    雨声淅沥，
    适合思考人生...
          `,
          duration: 3000,
          type: 'atmosphere'
        }
      ],
      bgm: 'rain',
      transition: 'fade'
    },

    scene_snow_mountain: {
      title: '雪山',
      frames: [
        {
          text: `
    ❄️ 雪山之巅 ❄️
    
    ❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️
    ❄️   🏔️🗻🏔️    ❄️
    ❄️     ☁️      ❄️
    ❄️    ╱│╲     ❄️
    ❄️   ╱ │ ╲    ❄️
    ❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️
    
    千里冰封，
    万里雪飘...
          `,
          duration: 3000,
          type: 'atmosphere'
        }
      ],
      bgm: 'cold',
      transition: 'fade'
    },

    scene_desert_sunset: {
      title: '大漠落日',
      frames: [
        {
          text: `
    🌅 大漠落日 🌅
    
    🌅═══════════════
    ╱╲    🐫        ╱╲
   ╱  ╲  👤       ╱  ╲
  ╱ 🏜️ ╲        ╱ 🏜️ ╲
 ╱______╲______╱______╲
 
 大漠孤烟直，
 长河落日圆...
          `,
          duration: 3000,
          type: 'atmosphere'
        }
      ],
      bgm: 'desert',
      transition: 'fade'
    }
  };

  // ==================== 剧情分支系统 ====================
  
  const StoryBranchSystem = {
    // 当前分支状态
    state: {
      morality: 0,      //  morality: -100(邪) ~ +100(正)
      sectLoyalty: {},  // 门派忠诚度
      relationships: {}, // NPC关系
      choices: []       // 已做选择
    },

    // 初始化
    init() {
      this.loadState();
    },

    // 加载状态
    loadState() {
      const saved = localStorage.getItem('wuxia_story_branch');
      if (saved) {
        this.state = JSON.parse(saved);
      }
    },

    // 保存状态
    saveState() {
      localStorage.setItem('wuxia_story_branch', JSON.stringify(this.state));
    },

    // 记录选择
    recordChoice(choiceId, effect) {
      this.state.choices.push({
        id: choiceId,
        timestamp: Date.now(),
        effect: effect
      });
      
      // 应用效果
      if (effect.morality) {
        this.state.morality = Math.max(-100, Math.min(100, 
          this.state.morality + effect.morality));
      }
      
      if (effect.sect) {
        this.state.sectLoyalty[effect.sect] = 
          (this.state.sectLoyalty[effect.sect] || 0) + (effect.value || 0);
      }
      
      if (effect.npc) {
        this.state.relationships[effect.npc] = 
          (this.state.relationships[effect.npc] || 0) + (effect.value || 0);
      }
      
      this.saveState();
    },

    // 获取道德倾向
    getMorality() {
      if (this.state.morality > 30) return 'righteous';
      if (this.state.morality < -30) return 'evil';
      return 'neutral';
    },

    // 检查是否可以触发某结局
    canTriggerEnding(endingId) {
      const requirements = {
        'ending_hero': () => this.state.morality > 50,
        'ending_dark_lord': () => this.state.morality < -50,
        'ending_sage': () => this.state.choices.some(c => c.id === 'choice_reject_power'),
        'ending_tragic': () => this.state.choices.some(c => c.id === 'choice_sacrifice')
      };
      
      return requirements[endingId]?.() || false;
    },

    // 获取可用结局
    getAvailableEndings() {
      return [
        'ending_hero',
        'ending_dark_lord', 
        'ending_sage',
        'ending_tragic'
      ].filter(id => this.canTriggerEnding(id));
    },

    // 重置
    reset() {
      this.state = {
        morality: 0,
        sectLoyalty: {},
        relationships: {},
        choices: []
      };
      this.saveState();
    }
  };

  // ==================== 剧情收集品系统 ====================
  
  const StoryCollection = {
    // 收集品数据库
    COLLECTIBLES: {
      // 信件
      'letter_heyin': {
        name: '鹤隐的密信',
        desc: '一封神秘的来信，开启了你的江湖之旅...',
        icon: '📜',
        category: 'letter'
      },
      'letter_threat': {
        name: '血骨门恐吓信',
        desc: '带着血迹的威胁信，边缘有骷髅印记。',
        icon: '📜',
        category: 'letter'
      },
      
      // 碎片
      'shard_xuantie_1': {
        name: '玄铁令碎片（嵩山）',
        desc: '从嵩山石窟中获得的第一块碎片。',
        icon: '🗝️',
        category: 'shard'
      },
      'shard_xuantie_2': {
        name: '玄铁令碎片（武当）',
        desc: '从武当秘境中获得的第二块碎片。',
        icon: '🗝️',
        category: 'shard'
      },
      'shard_xuantie_3': {
        name: '玄铁令碎片（昆仑）',
        desc: '从昆仑冰宫中获得的第三块碎片。',
        icon: '🗝️',
        category: 'shard'
      },
      
      // 密约
      'scroll_sanmo': {
        name: '三魔密约',
        desc: '记录了血骨门、玄冥教、日月神教同盟的密约。',
        icon: '📜',
        category: 'scroll'
      },
      
      // 记忆
      'memory_master': {
        name: '师父的遗言',
        desc: '"徒儿，江湖路远，好自为之..."',
        icon: '💭',
        category: 'memory'
      },
      
      // 隐藏
      'secret_heyin_diary': {
        name: '鹤隐的日记',
        desc: '记录了鹤隐与玄悟的往事，以及玄铁令的真相...',
        icon: '📖',
        category: 'secret',
        hidden: true
      }
    },

    // 获取收集品
    collect(itemId) {
      const collected = this.getCollected();
      if (!collected.includes(itemId)) {
        collected.push(itemId);
        localStorage.setItem('wuxia_story_collection', JSON.stringify(collected));
        
        // 播放获得动画
        this.showCollectAnimation(itemId);
        
        return true;
      }
      return false;
    },

    // 获取已收集列表
    getCollected() {
      return JSON.parse(localStorage.getItem('wuxia_story_collection') || '[]');
    },

    // 显示获得动画
    showCollectAnimation(itemId) {
      const item = this.COLLECTIBLES[itemId];
      if (!item) return;
      
      // 创建获得提示
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #f0c060, #ff6060);
        padding: 20px 40px;
        border-radius: 12px;
        color: white;
        font-size: 16px;
        z-index: 99999;
        animation: collect-pop 0.5s ease;
        text-align: center;
      `;
      toast.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 10px;">${item.icon}</div>
        <div style="font-weight: bold;">获得收集品</div>
        <div>${item.name}</div>
      `;
      
      // 添加动画样式
      if (!document.getElementById('collect-anim-style')) {
        const style = document.createElement('style');
        style.id = 'collect-anim-style';
        style.textContent = `
          @keyframes collect-pop {
            0% { transform: translateX(-50%) scale(0); opacity: 0; }
            50% { transform: translateX(-50%) scale(1.1); }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    },

    // 显示收集品图鉴
    showCollectionBook() {
      const collected = this.getCollected();
      const categories = {};
      
      // 分类整理
      Object.entries(this.COLLECTIBLES).forEach(([id, item]) => {
        if (item.hidden && !collected.includes(id)) return;
        
        if (!categories[item.category]) {
          categories[item.category] = [];
        }
        categories[item.category].push({ id, ...item, collected: collected.includes(id) });
      });
      
      // 创建图鉴界面
      const overlay = document.createElement('div');
      overlay.className = 'cinema-overlay';
      overlay.style.zIndex = '100000';
      overlay.innerHTML = `
        <div style="width: 90%; max-width: 700px; max-height: 80vh; overflow-y: auto; background: #1a1a2e; border-radius: 12px; padding: 20px;">
          <h2 style="text-align: center; color: #f0c060; margin-bottom: 20px;">📚 剧情收集品</h2>
          <div style="text-align: center; color: #888; margin-bottom: 20px;">
            收集进度: ${collected.length} / ${Object.keys(this.COLLECTIBLES).filter(k => !this.COLLECTIBLES[k].hidden).length}
          </div>
          ${Object.entries(categories).map(([cat, items]) => `
            <div style="margin-bottom: 20px;">
              <div style="color: #6495ed; font-size: 14px; margin-bottom: 10px; text-transform: uppercase;">${cat}</div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                ${items.map(item => `
                  <div style="
                    background: ${item.collected ? 'rgba(240,192,96,0.1)' : 'rgba(100,100,100,0.1)'};
                    border: 1px solid ${item.collected ? '#f0c060' : '#444'};
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                    opacity: ${item.collected ? 1 : 0.5};
                  ">
                    <div style="font-size: 32px; margin-bottom: 5px;">${item.collected ? item.icon : '❓'}</div>
                    <div style="color: ${item.collected ? '#fff' : '#666'}; font-size: 13px; font-weight: bold;">
                      ${item.collected ? item.name : '???'}
                    </div>
                    ${item.collected ? `<div style="color: #888; font-size: 11px; margin-top: 5px;">${item.desc}</div>` : ''}
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
  
  // 合并到主动画库
  if (window.ASCII_CINEMA) {
    Object.assign(window.ASCII_CINEMA, EXTENDED_CINEMA);
  }
  
  window.StoryBranchSystem = StoryBranchSystem;
  window.StoryCollection = StoryCollection;
  
  // 便捷函数
  window.playExtendedCinema = function(id) {
    if (window.StoryCinema) {
      return window.StoryCinema.play(id);
    }
  };
  
  window.showCollectionBook = function() {
    StoryCollection.showCollectionBook();
  };
  
  window.getStoryEnding = function() {
    const endings = StoryBranchSystem.getAvailableEndings();
    if (endings.length === 0) return 'ending_hero';
    
    // 根据道德值选择最合适的结局
    const morality = StoryBranchSystem.getMorality();
    if (morality === 'evil' && endings.includes('ending_dark_lord')) {
      return 'ending_dark_lord';
    }
    if (morality === 'righteous' && endings.includes('ending_hero')) {
      return 'ending_hero';
    }
    
    return endings[0];
  };

  // 初始化
  StoryBranchSystem.init();
  
  console.log('[StoryCinema-Extended] 剧情动画扩展包已加载');
  console.log('[StoryCinema-Extended] 可用命令: showCollectionBook(), getStoryEnding()');

})();
