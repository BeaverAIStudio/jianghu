/**
 * story-audio.js - 剧情音效提示系统
 * 无需实际音频文件，使用Web Audio API生成音效
 */

(function() {
  'use strict';

  // ==================== 音频上下文 ====================
  const StoryAudio = {
    ctx: null,
    enabled: true,
    volume: 0.3,

    // 初始化
    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = localStorage.getItem('wuxia_audio_enabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('wuxia_audio_volume') || '0.3');
      } catch (e) {
        console.warn('[StoryAudio] 音频上下文初始化失败:', e);
        this.enabled = false;
      }
    },

    // 确保上下文已启动
    ensureContext() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    // 播放音效
    play(type) {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();

      const generators = {
        'achievement': () => this.generateAchievementSound(),
        'boss_appear': () => this.generateBossSound(),
        'victory': () => this.generateVictorySound(),
        'defeat': () => this.generateDefeatSound(),
        'level_up': () => this.generateLevelUpSound(),
        'item_get': () => this.generateItemSound(),
        'dialogue': () => this.generateDialogueSound(),
        'transition': () => this.generateTransitionSound(),
        'alert': () => this.generateAlertSound(),
        'secret': () => this.generateSecretSound()
      };

      const generator = generators[type];
      if (generator) {
        generator();
      }
    },

    // 成就解锁音效 - 上升的音阶
    generateAchievementSound() {
      const now = this.ctx.currentTime;
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      frequencies.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(this.volume * 0.3, now + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.4);
      });
    },

    // BOSS登场音效 - 低沉震撼
    generateBossSound() {
      const now = this.ctx.currentTime;
      
      // 低频轰鸣
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.exponentialRampToValueAtTime(30, now + 2);
      
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.5);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
      
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      
      osc1.start(now);
      osc1.stop(now + 3);
      
      // 高音点缀
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(880, now + 0.5);
      osc2.frequency.exponentialRampToValueAtTime(220, now + 1.5);
      
      gain2.gain.setValueAtTime(0, now + 0.5);
      gain2.gain.linearRampToValueAtTime(this.volume * 0.2, now + 0.7);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 2);
      
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      
      osc2.start(now + 0.5);
      osc2.stop(now + 2);
    },

    // 胜利音效 - 欢快的和弦
    generateVictorySound() {
      const now = this.ctx.currentTime;
      const chords = [
        [523.25, 659.25, 783.99], // C major
        [659.25, 783.99, 987.77], // E minor
        [783.99, 987.77, 1174.66] // G major
      ];
      
      chords.forEach((chord, i) => {
        chord.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now + i * 0.3);
          gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + i * 0.3 + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.3 + 0.8);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.start(now + i * 0.3);
          osc.stop(now + i * 0.3 + 1);
        });
      });
    },

    // 失败音效 - 低沉下降
    generateDefeatSound() {
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 1.5);
      
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2);
    },

    // 升级音效 - 清脆的铃声
    generateLevelUpSound() {
      const now = this.ctx.currentTime;
      
      [0, 0.1, 0.2].forEach((delay, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 880 + i * 220;
        
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(this.volume * 0.3, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.5);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.6);
      });
    },

    // 获得物品音效 - 清脆的叮当声
    generateItemSound() {
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.51, now); // E6
      osc.frequency.exponentialRampToValueAtTime(2637.02, now + 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.5);
    },

    // 对话音效 - 轻柔的提示音
    generateDialogueSound() {
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 440;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.2);
    },

    // 转场音效 - 滑音效果
    generateTransitionSound() {
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.5);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.linearRampToValueAtTime(2000, now + 0.5);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, now + 0.1);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.6);
    },

    // 警告音效 - 急促的高音
    generateAlertSound() {
      const now = this.ctx.currentTime;
      
      [0, 0.15, 0.3].forEach(delay => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.value = 880;
        
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(this.volume * 0.2, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.15);
      });
    },

    // 隐藏发现音效 - 神秘的和声
    generateSecretSound() {
      const now = this.ctx.currentTime;
      
      const frequencies = [329.63, 415.30, 493.88, 659.25]; // E4, G#4, B4, E5
      
      frequencies.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(this.volume * 0.2, now + i * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 1.5);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 2);
      });
    },

    // 设置音量
    setVolume(vol) {
      this.volume = Math.max(0, Math.min(1, vol));
      localStorage.setItem('wuxia_audio_volume', this.volume);
    },

    // 开关音效
    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('wuxia_audio_enabled', this.enabled);
      return this.enabled;
    },

    // 显示设置面板
    showSettings() {
      const overlay = document.createElement('div');
      overlay.className = 'cinema-overlay';
      overlay.style.zIndex = '100001';
      overlay.innerHTML = `
        <div style="background: #1a1a2e; padding: 30px; border-radius: 12px; text-align: center; min-width: 300px;">
          <h3 style="color: #f0c060; margin-bottom: 20px;">🔊 音效设置</h3>
          
          <div style="margin-bottom: 20px;">
            <label style="color: #aaa; display: block; margin-bottom: 10px;">音效开关</label>
            <button id="audio-toggle-btn" style="
              padding: 10px 30px;
              border: none;
              border-radius: 6px;
              background: ${this.enabled ? '#4ecb71' : '#e74c3c'};
              color: white;
              cursor: pointer;
              font-size: 14px;
            ">${this.enabled ? '✓ 已开启' : '✗ 已关闭'}</button>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="color: #aaa; display: block; margin-bottom: 10px;">音量: <span id="volume-value">${Math.round(this.volume * 100)}%</span></label>
            <input type="range" id="volume-slider" min="0" max="100" value="${this.volume * 100}" style="width: 200px;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="color: #aaa; display: block; margin-bottom: 10px;">测试音效</label>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button class="test-sound-btn" data-sound="achievement" style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">成就</button>
              <button class="test-sound-btn" data-sound="victory" style="padding: 5px 10px; background: #4ecb71; color: white; border: none; border-radius: 4px; cursor: pointer;">胜利</button>
              <button class="test-sound-btn" data-sound="item_get" style="padding: 5px 10px; background: #f0c060; color: black; border: none; border-radius: 4px; cursor: pointer;">物品</button>
              <button class="test-sound-btn" data-sound="boss_appear" style="padding: 5px 10px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">BOSS</button>
            </div>
          </div>
          
          <button class="cinema-btn" onclick="this.closest('.cinema-overlay').remove()">关闭</button>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // 绑定事件
      const toggleBtn = overlay.querySelector('#audio-toggle-btn');
      toggleBtn.onclick = () => {
        const enabled = this.toggle();
        toggleBtn.textContent = enabled ? '✓ 已开启' : '✗ 已关闭';
        toggleBtn.style.background = enabled ? '#4ecb71' : '#e74c3c';
      };
      
      const volumeSlider = overlay.querySelector('#volume-slider');
      const volumeValue = overlay.querySelector('#volume-value');
      volumeSlider.oninput = (e) => {
        const vol = e.target.value / 100;
        this.setVolume(vol);
        volumeValue.textContent = Math.round(vol * 100) + '%';
      };
      
      overlay.querySelectorAll('.test-sound-btn').forEach(btn => {
        btn.onclick = () => {
          this.play(btn.dataset.sound);
        };
      });
    }
  };

  // ==================== 音效触发钩子 ====================
  
  // 挂钩到成就系统
  const originalShowUnlockToast = StoryAchievementManager?.showUnlockToast;
  if (originalShowUnlockToast) {
    StoryAchievementManager.showUnlockToast = function(ach) {
      StoryAudio.play('achievement');
      return originalShowUnlockToast.call(this, ach);
    };
  }

  // 挂钩到动画系统
  const originalPlay = StoryCinema?.play;
  if (originalPlay) {
    StoryCinema.play = async function(cinemaId) {
      // 根据动画类型播放对应音效
      if (cinemaId.includes('boss')) {
        StoryAudio.play('boss_appear');
      } else if (cinemaId.includes('victory')) {
        StoryAudio.play('victory');
      } else if (cinemaId.includes('defeat')) {
        StoryAudio.play('defeat');
      } else if (cinemaId.includes('secret')) {
        StoryAudio.play('secret');
      } else {
        StoryAudio.play('transition');
      }
      
      return originalPlay.call(this, cinemaId);
    };
  }

  // 挂钩到收集系统
  const originalShowCollectAnimation = StoryCollection?.showCollectAnimation;
  if (originalShowCollectAnimation) {
    StoryCollection.showCollectAnimation = function(itemId) {
      StoryAudio.play('item_get');
      return originalShowCollectAnimation.call(this, itemId);
    };
  }

  // ==================== 导出 ====================
  window.StoryAudio = StoryAudio;
  
  // 便捷函数
  window.playStorySound = function(type) {
    StoryAudio.play(type);
  };
  
  window.showAudioSettings = function() {
    StoryAudio.showSettings();
  };

  // 初始化
  StoryAudio.init();
  
  console.log('[StoryAudio] 剧情音效系统已加载');
  console.log('[StoryAudio] 可用命令: playStorySound(type), showAudioSettings()');

})();
