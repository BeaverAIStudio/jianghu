/**
 * story-cinema.js - 剧情过场动画系统
 * 字符画电影式过场，让剧情更有史诗感
 */

(function() {
  'use strict';

  // ==================== ASCII 动画资源库 ====================
  const ASCII_CINEMA = {
    // ── 第一幕：踏入江湖 ──────────────────────────────
    act1_opening: {
      title: '序章 · 乱世起',
      frames: [
        {
          text: `
    ☁️              ☁️         ☁️
         ☁️    🏔️    ☁️
    ☁️         /│\\        ☁️
             / │ \\
    🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲🌲
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          【大齐·边疆】
          战火纷飞，民不聊生
          
    江湖，即将卷入一场浩劫...
          `,
          duration: 3000,
          type: 'narration'
        },
        {
          text: `
        🏯
       /||\\
      / || \\
     /  ||  \\
    ═══════════════
    │   洛 阳 城   │
    │  繁华依旧    │
    ═══════════════
         │    │
    👤   │    │   👤
   行商  │    │  侠客
    
    你，一个无名小卒
    带着一身武艺，踏入这座古城...
          `,
          duration: 3500,
          type: 'scene'
        },
        {
          text: `
    📜✉️
    ╔═══════════════════════╗
    ║  【神秘来信】          ║
    ║                       ║
    ║  「玄悟大师失踪」      ║
    ║  「玄铁令重现江湖」    ║
    ║                       ║
    ║  署名：鹤隐           ║
    ╚═══════════════════════╝
    
    命运的齿轮，开始转动...
          `,
          duration: 4000,
          type: 'dialogue'
        }
      ],
      bgm: 'melancholic',
      transition: 'fade'
    },

    // ── 第二幕：风云初动 ──────────────────────────────
    act2_rising: {
      title: '第二幕 · 风云初动',
      frames: [
        {
          text: `
    ⚡ 风云变色 ⚡
    
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
    🌑  ☁️    ☁️    ☁️  🌑
    🌑    ⚡        ⚡    🌑
    🌑      ╔══╗      🌑
    🌑      ║玄║      🌑
    🌑      ║铁║      🌑
    🌑      ║令║      🌑
    🌑      ╚══╝      🌑
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
    
    传说中的玄铁令，一分为三
    散落江湖...
          `,
          duration: 3500,
          type: 'narration'
        },
        {
          text: `
    ⛰️ 嵩山 ⛰️      🏔️ 武当 🏔️      🗻 昆仑 🗻
    ╱╲╱╲╱╲          ╱╲╱╲╱╲          ╱╲╱╲╱╲
    ╱  ╲╱  ╲        ╱  ╲╱  ╲        ╱  ╲╱  ╲
    ╱ 🗝️ ╲        ╱ 🗝️ ╲        ╱ 🗝️ ╲
    
    三大碎片，藏于三处秘境
    血骨门已派出追命使...
          `,
          duration: 4000,
          type: 'scene'
        },
        {
          text: `
    👤 鹤隐
    ╔══════════════════════════╗
    ║  "玄铁令乃上古封印之钥    ║
    ║   若落入骨冥子之手...     ║
    ║   天下将大乱！"          ║
    ╚══════════════════════════╝
         \\   🦅   /
          \\     /
           \\   /
            \\ /
             👤
    
    神秘老者鹤隐，究竟是敌是友？
          `,
          duration: 4500,
          type: 'dialogue'
        }
      ],
      bgm: 'tense',
      transition: 'slide'
    },

    // ── 第三幕：三魔暗涌 ──────────────────────────────
    act3_darkness: {
      title: '第三幕 · 三魔暗涌',
      frames: [
        {
          text: `
    🔥 三魔联盟 🔥
    
         💀血骨门💀
        ╱    │    \\
       ╱     │     \\
      ╱      │      \\
    ☠️      ☠️      ☠️
  玄冥教   日月神教   血骨门
    
    三大邪派，歃血为盟
    意图解开上古封印！
          `,
          duration: 4000,
          type: 'narration'
        },
        {
          text: `
    ⚔️ 正道会盟 ⚔️
    
       🏯少林  🏯武当  🏯峨眉
         \\      │      /
          \\     │     /
           \\    │    /
            \\   │   /
             \\  │  /
              \\ │ /
               🏯
            正道联盟
    
    正邪两道，即将正面交锋...
          `,
          duration: 4000,
          type: 'scene'
        },
        {
          text: `
    🎭 内鬼浮现 🎭
    
    正道联盟中，有人暗中通敌！
    
    👤👤👤👤🎭👤👤👤👤
         ↑
       内鬼在此
    
    信任崩塌，联盟面临分裂...
          `,
          duration: 4500,
          type: 'suspense'
        }
      ],
      bgm: 'ominous',
      transition: 'dissolve'
    },

    // ── 第四幕：联盟裂隙 ──────────────────────────────
    act4_fracture: {
      title: '第四幕 · 至暗时刻',
      frames: [
        {
          text: `
    💔 联盟裂隙 💔
    
    曾经的盟友，如今刀剑相向...
    
    ⚔️
    👤══════💥══════👤
    少林            武当
    
    "玄悟失踪，必是武当所为！"
    "少林才是幕后黑手！"
          `,
          duration: 4000,
          type: 'conflict'
        },
        {
          text: `
    🌑 孤身潜入 🌑
    
    你独自前往幽州黑市...
    
    🌃🌃🌃🌃🌃🌃🌃🌃🌃🌃
    🌃   🏮    🏮     🌃
    🌃      👤        🌃
    🌃  👥      👥     🌃
    🌃    黑市街道     🌃
    🌃🌃🌃🌃🌃🌃🌃🌃🌃🌃
    
    每一步都可能是陷阱...
          `,
          duration: 4500,
          type: 'stealth'
        },
        {
          text: `
    📜 三魔密约 📜
    
    你终于找到了那份密约！
    
    ╔═══════════════════════╗
    ║  【三魔密约】          ║
    ║                       ║
    ║  一、共夺玄铁令        ║
    ║  二、同解上古封印      ║
    ║  三、瓜分天下          ║
    ║                       ║
    ║  立约人：骨冥子       ║
    ╚═══════════════════════╝
    
    真相大白！
          `,
          duration: 5000,
          type: 'revelation'
        }
      ],
      bgm: 'suspense',
      transition: 'cut'
    },

    // ── 第五幕：决战天下 ──────────────────────────────
    act5_climax: {
      title: '第五幕 · 决战天下',
      frames: [
        {
          text: `
    ⚔️ 决战前夜 ⚔️
    
    正道联盟，重整旗鼓
    
    🏇🏇🏇🏇🏇🏇🏇🏇🏇🏇
    🏇   🏇   🏇   🏇   🏇
    🏇 少林 🏇 武当 🏇 峨眉 🏇
    🏇   🏇   🏇   🏇   🏇
    🏇🏇🏇🏇🏇🏇🏇🏇🏇🏇
    
    千军万马，直捣血骨门！
          `,
          duration: 4000,
          type: 'epic'
        },
        {
          text: `
    💀 血骨门总坛 💀
    
    ╔═══════════════════════════════╗
    ║                               ║
    ║     💀 血骨门总坛 💀          ║
    ║                               ║
    ║   ☠️  ☠️  ☠️  ☠️  ☠️        ║
    ║   护  护  护  护  护        ║
    ║   法  法  法  法  法        ║
    ║                               ║
    ║         👹                  ║
    ║       骨冥子                ║
    ║                               ║
    ╚═══════════════════════════════╝
    
    最终决战，一触即发！
          `,
          duration: 4500,
          type: 'boss_approach'
        },
        {
          text: `
    🔥 玄铁令 · 完整 🔥
    
    三块碎片，终于合一！
    
        ╔═══════════╗
        ║  ╔═════╗  ║
        ║  ║ 玄 ║  ║
        ║  ║ 铁 ║  ║
        ║  ║ 令 ║  ║
        ║  ╚═════╝  ║
        ╚═══════════╝
           ⚡⚡⚡
    
    封印之力，即将重现...
          `,
          duration: 5000,
          type: 'climax'
        }
      ],
      bgm: 'battle_epic',
      transition: 'flash'
    },

    // ── 第六幕：余波未平 ──────────────────────────────
    act6_finale: {
      title: '终章 · 新秩序',
      frames: [
        {
          text: `
    🌅 战后余波 🌅
    
    血骨门覆灭，骨冥子伏诛
    
    🏯🏯🏯🏯🏯🏯🏯🏯🏯🏯
    🏯  废墟中的血骨门  🏯
    🏯                  🏯
    🏯   💀 已覆灭 💀   🏯
    🏯🏯🏯🏯🏯🏯🏯🏯🏯🏯
    
    但江湖，真的平静了吗？
          `,
          duration: 4000,
          type: 'aftermath'
        },
        {
          text: `
    🏆 武林新序 🏆
    
    你因功被封为：
    
    ╔═══════════════════════╗
    ║                       ║
    ║   【 武林盟副盟主 】   ║
    ║                       ║
    ║   号令正道，维护江湖   ║
    ║                       ║
    ╚═══════════════════════╝
    
    新的时代，即将开启...
          `,
          duration: 4500,
          type: 'reward'
        },
        {
          text: `
    🔮 北疆迷云 🔮
    
    然而，在遥远的北疆...
    
    ❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️
    ❄️    🏔️🗻🏔️     ❄️
    ❄️      ⚡        ❄️
    ❄️   封印之地异变   ❄️
    ❄️❄️❄️❄️❄️❄️❄️❄️❄️❄️
    
    鹤隐老者的牺牲，真的封印了邪恶吗？
    
    【未完待续...】
          `,
          duration: 6000,
          type: 'teaser'
        }
      ],
      bgm: 'bittersweet',
      transition: 'fade_slow'
    },

    // ── BOSS登场动画 ─────────────────────────────────
    boss_gumingzi: {
      title: '血骨门主 · 骨冥子',
      frames: [
        {
          text: `
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
    🌑                    🌑
    🌑     黑雾弥漫...     🌑
    🌑                    🌑
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
          `,
          duration: 2000,
          type: 'buildup'
        },
        {
          text: `
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
    🌑      👁️  👁️       🌑
    🌑        ═══        🌑
    🌑       ╱   ╲       🌑
    🌑      ╱     ╲      🌑
    🌑     ╱       ╲     🌑
    🌑    ╱    💀    ╲    🌑
    🌑   ╱  血神经·噬魂  ╲   🌑
    🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
    
    💀 骨冥子 登场 💀
          `,
          duration: 3000,
          type: 'boss_reveal'
        },
        {
          text: `
    ╔══════════════════════════════════╗
    ║  💀 骨冥子                       ║
    ║     血骨门门主                   ║
    ║                                  ║
    ║  "玄铁令，终将属于我！"          ║
    ║                                  ║
    ║  "待我解开上古封印，              ║
    ║   这天下，便是我的！"            ║
    ║                                  ║
    ╚══════════════════════════════════╝
          `,
          duration: 4000,
          type: 'boss_taunt'
        }
      ],
      bgm: 'boss_theme',
      transition: 'shake'
    },

    boss_xuegu_elite: {
      title: '血骨门 · 追命使',
      frames: [
        {
          text: `
    🌑 阴影中，一双血红的眼睛睁开... 🌑
    
        👤
       ╱│╲
      ╱ │ ╲
      │🩸│
      ╲ │ ╱
       ╲│╱
    
    血骨门追命使，奉命取你性命！
          `,
          duration: 3000,
          type: 'boss_reveal'
        }
      ],
      bgm: 'mini_boss',
      transition: 'flash'
    },

    boss_ancient_golem: {
      title: '上古石魔',
      frames: [
        {
          text: `
    ⛰️ 石窟震动 ⛰️
    
    千年封印，正在松动...
          `,
          duration: 2000,
          type: 'buildup'
        },
        {
          text: `
        🗿🗿🗿
       🗿👁️🗿👁️🗿
        🗿═══🗿
       🗿│   │🗿
      🗿 │   │ 🗿
     🗿  │   │  🗿
    🗿🗿🗿🗿🗿🗿🗿
    
    上古石魔，苏醒！
    
    金刚不坏，唯有风系可破...
          `,
          duration: 4000,
          type: 'boss_reveal'
        }
      ],
      bgm: 'ancient',
      transition: 'rumble'
    },

    // ── 剧情结算动画 ─────────────────────────────────
    victory: {
      title: '胜利',
      frames: [
        {
          text: `
    ✨✨✨✨✨✨✨✨✨✨
    ✨   🎉 胜 利 🎉   ✨
    ✨✨✨✨✨✨✨✨✨✨
    
    敌人倒下了...
          `,
          duration: 2000,
          type: 'victory'
        },
        {
          text: `
    🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊
    🎊                🎊
    🎊   经验 +XXX    🎊
    🎊   银两 +XXX    🎊
    🎊                🎊
    🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊
          `,
          duration: 3000,
          type: 'reward'
        }
      ],
      bgm: 'victory',
      transition: 'sparkle'
    },

    defeat: {
      title: '败北',
      frames: [
        {
          text: `
    💀💀💀💀💀💀💀💀💀💀
    💀                💀
    💀   你倒下了...   💀
    💀                💀
    💀💀💀💀💀💀💀💀💀💀
    
    但江湖路远，来日方长...
          `,
          duration: 4000,
          type: 'defeat'
        }
      ],
      bgm: 'defeat',
      transition: 'fade'
    },

    // ── 转场动画 ─────────────────────────────────────
    transition_chapter: {
      title: '章节转场',
      frames: [
        {
          text: `
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    ▓                    ▓
    ▓     第 X 幕        ▓
    ▓                    ▓
    ▓    章节名称        ▓
    ▓                    ▓
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
          `,
          duration: 3000,
          type: 'chapter_card'
        }
      ],
      bgm: 'transition',
      transition: 'wipe'
    }
  };

  // ==================== 动画播放器 ====================
  const CinemaPlayer = {
    // 当前播放状态
    isPlaying: false,
    currentCinema: null,
    currentFrame: 0,
    container: null,
    
    // 初始化
    init() {
      this.injectStyles();
    },

    // 注入样式
    injectStyles() {
      if (document.getElementById('cinema-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'cinema-styles';
      style.textContent = `
        /* 电影院模式容器 */
        .cinema-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Courier New', monospace;
        }
        
        /* 画面区域 */
        .cinema-screen {
          width: 90%;
          max-width: 800px;
          height: 70vh;
          background: #0a0a0a;
          border: 3px solid #333;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        /* ASCII 画面 */
        .cinema-frame {
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.4;
          white-space: pre;
          text-align: center;
          animation: cinema-fade-in 0.5s ease;
        }
        
        @keyframes cinema-fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* 特殊效果 */
        .cinema-frame.shake {
          animation: cinema-shake 0.5s ease;
        }
        
        @keyframes cinema-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .cinema-frame.flash {
          animation: cinema-flash 0.3s ease;
        }
        
        @keyframes cinema-flash {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(2); }
        }
        
        /* 标题 */
        .cinema-title {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: #f0c060;
          font-size: 18px;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(240, 192, 96, 0.5);
          opacity: 0;
          animation: cinema-title-in 1s ease 0.5s forwards;
        }
        
        @keyframes cinema-title-in {
          to { opacity: 1; }
        }
        
        /* 控制栏 */
        .cinema-controls {
          margin-top: 20px;
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .cinema-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: #ccc;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        
        .cinema-btn:hover {
          background: rgba(255,255,255,0.2);
          color: #fff;
        }
        
        .cinema-skip {
          position: absolute;
          bottom: 20px;
          right: 20px;
          color: #666;
          font-size: 12px;
          cursor: pointer;
          background: none;
          border: none;
        }
        
        .cinema-skip:hover {
          color: #999;
        }
        
        /* 进度条 */
        .cinema-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.1);
        }
        
        .cinema-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #f0c060, #ff6060);
          transition: width 0.3s ease;
        }
        
        /* 类型标签 */
        .cinema-type-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .cinema-type-badge.narration { background: rgba(100,149,237,0.3); color: #6495ed; }
        .cinema-type-badge.scene { background: rgba(60,179,113,0.3); color: #3cb371; }
        .cinema-type-badge.dialogue { background: rgba(240,192,96,0.3); color: #f0c060; }
        .cinema-type-badge.boss { background: rgba(220,20,60,0.3); color: #dc143c; }
        .cinema-type-badge.victory { background: rgba(255,215,0,0.3); color: #ffd700; }
        
        /* 跳过提示 */
        .cinema-hint {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          color: #666;
          font-size: 12px;
          opacity: 0.7;
        }
      `;
      document.head.appendChild(style);
    },

    // 播放过场动画
    play(cinemaId, options = {}) {
      return new Promise((resolve) => {
        const cinema = ASCII_CINEMA[cinemaId];
        if (!cinema) {
          console.error('[Cinema] 找不到动画:', cinemaId);
          resolve();
          return;
        }

        this.isPlaying = true;
        this.currentCinema = cinema;
        this.currentFrame = 0;
        this.onComplete = resolve;

        // 创建容器
        this.container = document.createElement('div');
        this.container.className = 'cinema-overlay';
        this.container.innerHTML = `
          <div class="cinema-screen">
            <div class="cinema-title">${cinema.title || ''}</div>
            <div class="cinema-frame" id="cinema-frame"></div>
            <div class="cinema-type-badge" id="cinema-badge"></div>
            <div class="cinema-progress">
              <div class="cinema-progress-bar" id="cinema-progress"></div>
            </div>
          </div>
          <div class="cinema-controls">
            <button class="cinema-btn" onclick="StoryCinema.skip()">⏭ 跳过</button>
          </div>
          <div class="cinema-hint">按 ESC 跳过动画</div>
        `;
        
        document.body.appendChild(this.container);
        
        // ESC键跳过
        this.escHandler = (e) => {
          if (e.key === 'Escape') this.skip();
        };
        document.addEventListener('keydown', this.escHandler);

        // 开始播放
        this.playFrame();
      });
    },

    // 播放单帧
    playFrame() {
      if (!this.isPlaying || !this.currentCinema) return;
      
      const frame = this.currentCinema.frames[this.currentFrame];
      if (!frame) {
        this.end();
        return;
      }

      // 更新画面
      const frameEl = this.container.querySelector('#cinema-frame');
      const badgeEl = this.container.querySelector('#cinema-badge');
      const progressEl = this.container.querySelector('#cinema-progress');
      
      frameEl.textContent = frame.text;
      frameEl.className = 'cinema-frame ' + (this.currentCinema.transition || '');
      
      // 类型标签
      if (frame.type) {
        badgeEl.textContent = frame.type;
        badgeEl.className = 'cinema-type-badge ' + frame.type;
      }
      
      // 进度条
      const progress = ((this.currentFrame + 1) / this.currentCinema.frames.length) * 100;
      progressEl.style.width = progress + '%';

      // 定时下一帧
      setTimeout(() => {
        this.currentFrame++;
        this.playFrame();
      }, frame.duration || 3000);
    },

    // 跳过动画
    skip() {
      this.end();
    },

    // 结束播放
    end() {
      this.isPlaying = false;
      
      if (this.escHandler) {
        document.removeEventListener('keydown', this.escHandler);
      }
      
      if (this.container) {
        this.container.remove();
        this.container = null;
      }
      
      if (this.onComplete) {
        this.onComplete();
        this.onComplete = null;
      }
    }
  };

  // ==================== 便捷函数 ====================
  
  // 播放幕间动画
  function playActCinema(actNumber) {
    const cinemaId = `act${actNumber}_opening`;
    if (actNumber === 2) return CinemaPlayer.play('act2_rising');
    if (actNumber === 3) return CinemaPlayer.play('act3_darkness');
    if (actNumber === 4) return CinemaPlayer.play('act4_fracture');
    if (actNumber === 5) return CinemaPlayer.play('act5_climax');
    if (actNumber === 6) return CinemaPlayer.play('act6_finale');
    return CinemaPlayer.play(cinemaId);
  }

  // 播放BOSS登场
  function playBossCinema(bossId) {
    const map = {
      'npc_gumingzi': 'boss_gumingzi',
      'enemy_xuegu_elite': 'boss_xuegu_elite',
      'enemy_ancient_golem': 'boss_ancient_golem'
    };
    const cinemaId = map[bossId] || 'boss_xuegu_elite';
    return CinemaPlayer.play(cinemaId);
  }

  // 播放胜利/失败
  function playVictoryCinema() {
    return CinemaPlayer.play('victory');
  }

  function playDefeatCinema() {
    return CinemaPlayer.play('defeat');
  }

  // 播放章节转场
  function playChapterTransition(act, title) {
    const cinema = ASCII_CINEMA.transition_chapter;
    cinema.frames[0].text = cinema.frames[0].text
      .replace('第 X 幕', `第 ${act} 幕`)
      .replace('章节名称', title);
    return CinemaPlayer.play('transition_chapter');
  }

  // ==================== 导出 ====================
  window.StoryCinema = {
    play: (id) => CinemaPlayer.play(id),
    playAct: playActCinema,
    playBoss: playBossCinema,
    playVictory: playVictoryCinema,
    playDefeat: playDefeatCinema,
    playChapter: playChapterTransition,
    skip: () => CinemaPlayer.skip(),
    isPlaying: () => CinemaPlayer.isPlaying
  };

  // 初始化
  CinemaPlayer.init();
  console.log('[StoryCinema] 剧情过场动画系统已加载');

})();
