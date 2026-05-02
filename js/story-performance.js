/**
 * ============================================================================
 * 《血骨门之乱》剧情演出系统 - StoryPerformance
 * ============================================================================
 * 提供丰富的剧情过场表现：分镜、特效、镜头语言、情绪渲染
 * 支持：打字机效果、分屏对话、场景切换、情绪滤镜
 * ============================================================================
 */

(function() {
  'use strict';

  // ==================== 演出配置 ====================
  const PERFORMANCE_CONFIG = {
    // 打字机效果
    typewriter: {
      charDelay: 50,      // 每个字符延迟(ms)
      commaDelay: 200,    // 逗号停顿
      periodDelay: 400,   // 句号停顿
      ellipsisDelay: 600  // 省略号停顿
    },

    // 场景切换
    transition: {
      fadeDuration: 800,      // 淡入淡出时长
      slideDuration: 600,     // 滑动时长
      zoomDuration: 1000,     // 缩放时长
      shakeDuration: 300      // 震动时长
    },

    // 情绪滤镜
    filters: {
      'normal': { filter: 'none', animation: null },
      'dark': { filter: 'brightness(0.5) contrast(1.2)', animation: 'pulse 3s infinite' },
      'flashback': { filter: 'sepia(0.6) brightness(0.8)', animation: null },
      'dream': { filter: 'blur(2px) saturate(0.5)', animation: 'float 4s ease-in-out infinite' },
      'tense': { filter: 'contrast(1.3) saturate(1.2)', animation: 'shake 0.5s infinite' },
      'epic': { filter: 'brightness(1.1) saturate(1.3)', animation: 'glow 2s infinite' },
      'romantic': { filter: 'brightness(1.1) hue-rotate(-10deg)', animation: 'softPulse 3s infinite' },
      'horror': { filter: 'brightness(0.4) contrast(1.5) grayscale(0.3)', animation: 'flicker 2s infinite' }
    },

    // 分镜模板
    shots: {
      'close_up': { scale: 1.5, focus: 'center', duration: 3000 },
      'medium_shot': { scale: 1.0, focus: 'center', duration: 4000 },
      'wide_shot': { scale: 0.8, focus: 'center', duration: 5000 },
      'over_shoulder': { scale: 1.1, focus: 'left', duration: 3500 },
      'bird_eye': { scale: 0.6, focus: 'center', duration: 4000 },
      'worm_eye': { scale: 1.3, focus: 'bottom', duration: 3000 },
      'dutch_angle': { scale: 1.0, focus: 'center', rotate: 5, duration: 3000 },
      'rack_focus': { scale: 1.0, focus: 'transition', duration: 4000 }
    }
  };

  // ==================== 场景特效库 ====================
  const SCENE_EFFECTS = {
    // 天气效果
    'rain': {
      type: 'weather',
      className: 'sp-rain-effect',
      particles: 100,
      css: `
        .sp-rain-effect {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .sp-rain-drop {
          position: absolute;
          width: 1px;
          height: 20px;
          background: linear-gradient(transparent, rgba(174,194,224,0.6));
          animation: spRainFall linear infinite;
        }
        @keyframes spRainFall {
          to { transform: translateY(100vh); }
        }
      `
    },

    'snow': {
      type: 'weather',
      className: 'sp-snow-effect',
      particles: 50,
      css: `
        .sp-snow-effect {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .sp-snow-flake {
          position: absolute;
          width: 6px; height: 6px;
          background: white;
          border-radius: 50%;
          opacity: 0.8;
          animation: spSnowFall linear infinite;
        }
        @keyframes spSnowFall {
          to { 
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }
      `
    },

    'fog': {
      type: 'weather',
      className: 'sp-fog-effect',
      css: `
        .sp-fog-effect {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(200,200,200,0.3) 0%,
            transparent 30%,
            transparent 70%,
            rgba(200,200,200,0.3) 100%
          );
          pointer-events: none;
          animation: spFogMove 8s ease-in-out infinite;
        }
        @keyframes spFogMove {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `
    },

    // 氛围效果
    'fireflies': {
      type: 'ambient',
      className: 'sp-fireflies-effect',
      particles: 30,
      css: `
        .sp-fireflies-effect {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .sp-firefly {
          position: absolute;
          width: 4px; height: 4px;
          background: #ffff99;
          border-radius: 50%;
          box-shadow: 0 0 10px #ffff99;
          animation: spFireflyFloat 4s ease-in-out infinite;
        }
        @keyframes spFireflyFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.8; }
          25% { transform: translate(20px, -30px); opacity: 1; }
          50% { transform: translate(-10px, -50px); opacity: 0.6; }
          75% { transform: translate(30px, -20px); opacity: 0.9; }
        }
      `
    },

    'blood_moon': {
      type: 'ambient',
      className: 'sp-blood-moon',
      css: `
        .sp-blood-moon {
          position: absolute;
          top: 10%; right: 10%;
          width: 100px; height: 100px;
          background: radial-gradient(circle, #ff4444 0%, #aa0000 70%, transparent 100%);
          border-radius: 50%;
          box-shadow: 0 0 50px #ff0000;
          animation: spBloodMoonPulse 3s ease-in-out infinite;
        }
        @keyframes spBloodMoonPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `
    },

    // 战斗效果
    'screen_shake': {
      type: 'combat',
      css: `
        .sp-screen-shake {
          animation: spScreenShake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes spScreenShake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60% { transform: translate3d(6px, 0, 0); }
        }
      `
    },

    'impact_flash': {
      type: 'combat',
      css: `
        .sp-impact-flash {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: white;
          opacity: 0;
          pointer-events: none;
          animation: spImpactFlash 0.3s ease-out;
        }
        @keyframes spImpactFlash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `
    },

    // 魔法效果
    'magical_circle': {
      type: 'magic',
      className: 'sp-magic-circle',
      css: `
        .sp-magic-circle {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 300px; height: 300px;
          border: 3px solid rgba(100,200,255,0.6);
          border-radius: 50%;
          animation: spMagicCircleSpin 10s linear infinite;
        }
        .sp-magic-circle::before,
        .sp-magic-circle::after {
          content: '';
          position: absolute;
          border: 2px solid rgba(100,200,255,0.4);
          border-radius: 50%;
        }
        .sp-magic-circle::before {
          top: 10%; left: 10%; right: 10%; bottom: 10%;
          animation: spMagicCircleSpin 7s linear infinite reverse;
        }
        .sp-magic-circle::after {
          top: 25%; left: 25%; right: 25%; bottom: 25%;
          animation: spMagicCircleSpin 5s linear infinite;
        }
        @keyframes spMagicCircleSpin {
          to { transform: rotate(360deg); }
        }
      `
    },

    'dark_energy': {
      type: 'magic',
      className: 'sp-dark-energy',
      css: `
        .sp-dark-energy {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(100,0,100,0.3) 0%,
            transparent 70%
          );
          animation: spDarkEnergyPulse 2s ease-in-out infinite;
        }
        @keyframes spDarkEnergyPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }
      `
    }
  };

  // ==================== 核心类 ====================
  class StoryPerformance {
    constructor(container) {
      this.container = container || document.body;
      this.currentScene = null;
      this.isPlaying = false;
      this.effects = [];
      this._injectStyles();
    }

    // 注入CSS样式
    _injectStyles() {
      if (document.getElementById('sp-styles')) return;

      const style = document.createElement('style');
      style.id = 'sp-styles';
      style.textContent = `
        /* 基础容器 */
        .sp-scene-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1a1a2e;
        }

        /* 背景层 */
        .sp-background {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: cover;
          background-position: center;
          transition: all 0.8s ease;
        }

        /* 角色层 */
        .sp-character {
          position: absolute;
          transition: all 0.5s ease;
        }

        .sp-character.left { left: 10%; bottom: 0; }
        .sp-character.right { right: 10%; bottom: 0; }
        .sp-character.center { left: 50%; transform: translateX(-50%); bottom: 0; }

        .sp-character.silhouette {
          filter: brightness(0) blur(1px);
        }

        /* 对话框 */
        .sp-dialogue-box {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 800px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(20,20,40,0.95));
          border: 2px solid #4a4a6a;
          border-radius: 10px;
          padding: 20px;
          color: #fff;
          font-size: 18px;
          line-height: 1.6;
          z-index: 100;
        }

        .sp-speaker-name {
          color: #gold;
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .sp-dialogue-text {
          min-height: 60px;
        }

        .sp-cursor {
          display: inline-block;
          width: 3px;
          height: 20px;
          background: #fff;
          margin-left: 5px;
          animation: spCursorBlink 0.8s infinite;
        }

        @keyframes spCursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* 分镜指示器 */
        .sp-shot-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          color: #fff;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          z-index: 200;
        }

        /* 情绪滤镜层 */
        .sp-filter-layer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          transition: all 0.5s ease;
        }

        /* 转场效果 */
        .sp-transition-fade {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.8s ease;
        }

        .sp-transition-fade.active {
          opacity: 1;
        }

        /* 特效层 */
        .sp-effects-layer {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        /* 选项按钮 */
        .sp-choice-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 300;
        }

        .sp-choice-btn {
          background: linear-gradient(135deg, #2a2a4a, #1a1a2e);
          border: 2px solid #4a4a6a;
          color: #fff;
          padding: 15px 30px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          min-width: 300px;
          text-align: center;
        }

        .sp-choice-btn:hover {
          background: linear-gradient(135deg, #3a3a5a, #2a2a3e);
          border-color: #6a6a8a;
          transform: scale(1.02);
        }

        /* 情绪动画 */
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes glow {
          0%, 100% { filter: brightness(1.1); }
          50% { filter: brightness(1.3); }
        }

        @keyframes softPulse {
          0%, 100% { filter: brightness(1.1); }
          50% { filter: brightness(1.2); }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
    }

    // ==================== 场景管理 ====================
    
    /**
     * 创建场景容器
     */
    createScene(config = {}) {
      const scene = document.createElement('div');
      scene.className = 'sp-scene-container';
      
      // 背景层
      if (config.background) {
        const bg = document.createElement('div');
        bg.className = 'sp-background';
        bg.style.backgroundImage = `url(${config.background})`;
        scene.appendChild(bg);
      }

      // 特效层
      const effectsLayer = document.createElement('div');
      effectsLayer.className = 'sp-effects-layer';
      scene.appendChild(effectsLayer);

      // 角色层
      const characterLayer = document.createElement('div');
      characterLayer.className = 'sp-character-layer';
      scene.appendChild(characterLayer);

      // 滤镜层
      const filterLayer = document.createElement('div');
      filterLayer.className = 'sp-filter-layer';
      scene.appendChild(filterLayer);

      // 对话框
      if (config.dialogue !== false) {
        const dialogueBox = document.createElement('div');
        dialogueBox.className = 'sp-dialogue-box';
        dialogueBox.innerHTML = `
          <div class="sp-speaker-name"></div>
          <div class="sp-dialogue-text"><span class="sp-text-content"></span><span class="sp-cursor"></span></div>
        `;
        scene.appendChild(dialogueBox);
      }

      // 转场层
      const transition = document.createElement('div');
      transition.className = 'sp-transition-fade';
      scene.appendChild(transition);

      this.container.appendChild(scene);
      this.currentScene = scene;
      return scene;
    }

    /**
     * 添加角色
     */
    addCharacter(image, position = 'center', options = {}) {
      if (!this.currentScene) return;

      const charLayer = this.currentScene.querySelector('.sp-character-layer');
      const char = document.createElement('div');
      char.className = `sp-character ${position}`;
      if (options.silhouette) char.classList.add('silhouette');
      
      char.innerHTML = `<img src="${image}" alt="character" style="max-height: 80vh;">`;
      charLayer.appendChild(char);

      return char;
    }

    /**
     * 移除角色
     */
    removeCharacter(position) {
      if (!this.currentScene) return;
      const char = this.currentScene.querySelector(`.sp-character.${position}`);
      if (char) {
        char.style.opacity = '0';
        setTimeout(() => char.remove(), 500);
      }
    }

    // ==================== 打字机效果 ====================

    /**
     * 打字机显示文本
     */
    async typewrite(text, options = {}) {
      const { speed = 1, onComplete } = options;
      const textContainer = this.currentScene?.querySelector('.sp-text-content');
      if (!textContainer) return;

      const config = PERFORMANCE_CONFIG.typewriter;
      const delay = config.charDelay / speed;

      textContainer.textContent = '';
      this.isPlaying = true;

      for (let i = 0; i < text.length; i++) {
        if (!this.isPlaying) break;

        const char = text[i];
        textContainer.textContent += char;

        // 计算停顿时间
        let waitTime = delay;
        if (char === '，' || char === ',') waitTime = config.commaDelay;
        else if (char === '。' || char === '.' || char === '！' || char === '!') {
          waitTime = config.periodDelay;
        } else if (char === '…') waitTime = config.ellipsisDelay;

        await this._sleep(waitTime);
      }

      this.isPlaying = false;
      onComplete && onComplete();
    }

    /**
     * 跳过打字机动画
     */
    skipTypewrite() {
      this.isPlaying = false;
    }

    // ==================== 对话框 ====================

    /**
     * 显示对话
     */
    async showDialogue(speaker, text, options = {}) {
      const nameEl = this.currentScene?.querySelector('.sp-speaker-name');
      if (nameEl) nameEl.textContent = speaker;

      await this.typewrite(text, options);
    }

    /**
     * 隐藏对话框
     */
    hideDialogue() {
      const dialogueBox = this.currentScene?.querySelector('.sp-dialogue-box');
      if (dialogueBox) {
        dialogueBox.style.opacity = '0';
        dialogueBox.style.transform = 'translateX(-50%) translateY(20px)';
      }
    }

    /**
     * 显示对话框
     */
    showDialogueBox() {
      const dialogueBox = this.currentScene?.querySelector('.sp-dialogue-box');
      if (dialogueBox) {
        dialogueBox.style.opacity = '1';
        dialogueBox.style.transform = 'translateX(-50%) translateY(0)';
      }
    }

    // ==================== 特效 ====================

    /**
     * 添加特效
     */
    addEffect(effectId) {
      const effect = SCENE_EFFECTS[effectId];
      if (!effect || !this.currentScene) return;

      // 注入样式
      if (effect.css && !document.getElementById(`sp-effect-${effectId}`)) {
        const style = document.createElement('style');
        style.id = `sp-effect-${effectId}`;
        style.textContent = effect.css;
        document.head.appendChild(style);
      }

      const effectsLayer = this.currentScene.querySelector('.sp-effects-layer');
      const el = document.createElement('div');
      el.className = effect.className || '';

      // 粒子效果
      if (effect.particles) {
        for (let i = 0; i < effect.particles; i++) {
          const particle = document.createElement('div');
          particle.className = effect.className.replace('-effect', '-drop').replace('-effect', '-flake').replace('-effect', '-fly');
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 5 + 's';
          particle.style.animationDuration = (3 + Math.random() * 4) + 's';
          el.appendChild(particle);
        }
      }

      effectsLayer.appendChild(el);
      this.effects.push({ id: effectId, element: el });
      return el;
    }

    /**
     * 移除特效
     */
    removeEffect(effectId) {
      const idx = this.effects.findIndex(e => e.id === effectId);
      if (idx > -1) {
        this.effects[idx].element.remove();
        this.effects.splice(idx, 1);
      }
    }

    /**
     * 清除所有特效
     */
    clearEffects() {
      this.effects.forEach(e => e.element.remove());
      this.effects = [];
    }

    // ==================== 滤镜 ====================

    /**
     * 设置情绪滤镜
     */
    setFilter(filterName) {
      const filter = PERFORMANCE_CONFIG.filters[filterName];
      if (!filter || !this.currentScene) return;

      const filterLayer = this.currentScene.querySelector('.sp-filter-layer');
      filterLayer.style.filter = filter.filter;
      filterLayer.style.animation = filter.animation;
    }

    /**
     * 清除滤镜
     */
    clearFilter() {
      if (!this.currentScene) return;
      const filterLayer = this.currentScene.querySelector('.sp-filter-layer');
      filterLayer.style.filter = 'none';
      filterLayer.style.animation = 'none';
    }

    // ==================== 转场 ====================

    /**
     * 淡入淡出转场
     */
    async fadeTransition(callback) {
      const transition = this.currentScene?.querySelector('.sp-transition-fade');
      if (!transition) return;

      // 淡出
      transition.classList.add('active');
      await this._sleep(PERFORMANCE_CONFIG.transition.fadeDuration);

      // 执行回调
      callback && callback();

      // 淡入
      transition.classList.remove('active');
      await this._sleep(PERFORMANCE_CONFIG.transition.fadeDuration);
    }

    /**
     * 切换场景
     */
    async changeScene(newBackground, options = {}) {
      await this.fadeTransition(() => {
        const bg = this.currentScene?.querySelector('.sp-background');
        if (bg) bg.style.backgroundImage = `url(${newBackground})`;
        
        // 清除角色和特效
        const charLayer = this.currentScene?.querySelector('.sp-character-layer');
        if (charLayer) charLayer.innerHTML = '';
        this.clearEffects();
        
        if (options.filter) this.setFilter(options.filter);
      });
    }

    // ==================== 选择支 ====================

    /**
     * 显示选择支
     */
    showChoices(choices) {
      return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'sp-choice-container';

        choices.forEach((choice, index) => {
          const btn = document.createElement('button');
          btn.className = 'sp-choice-btn';
          btn.textContent = choice.text;
          btn.onclick = () => {
            container.remove();
            resolve(index);
          };
          container.appendChild(btn);
        });

        this.currentScene?.appendChild(container);
      });
    }

    // ==================== 工具方法 ====================

    _sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 销毁场景
     */
    destroy() {
      this.clearEffects();
      if (this.currentScene) {
        this.currentScene.remove();
        this.currentScene = null;
      }
    }
  }

  // ==================== 静态API ====================
  const StoryPerformanceAPI = {
    // 创建演出实例
    create(container) {
      return new StoryPerformance(container);
    },

    // 快速播放场景
    async playScene(sceneConfig, container) {
      const performance = new StoryPerformance(container);
      performance.createScene(sceneConfig);
      
      if (sceneConfig.filter) performance.setFilter(sceneConfig.filter);
      if (sceneConfig.effects) {
        sceneConfig.effects.forEach(effect => performance.addEffect(effect));
      }

      return performance;
    },

    // 获取配置
    getConfig() {
      return PERFORMANCE_CONFIG;
    },

    // 获取特效列表
    getEffects() {
      return Object.keys(SCENE_EFFECTS);
    },

    // 获取滤镜列表
    getFilters() {
      return Object.keys(PERFORMANCE_CONFIG.filters);
    },

    // 常量
    EFFECTS: SCENE_EFFECTS,
    CONFIG: PERFORMANCE_CONFIG
  };

  // 暴露到全局
  window.StoryPerformance = StoryPerformanceAPI;
  window.StoryPerformanceClass = StoryPerformance;

  console.log('[StoryPerformance] 剧情演出系统已加载');
  console.log(`- 特效数: ${Object.keys(SCENE_EFFECTS).length}`);
  console.log(`- 滤镜数: ${Object.keys(PERFORMANCE_CONFIG.filters).length}`);

})();