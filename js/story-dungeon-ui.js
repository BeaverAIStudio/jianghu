/**
 * ============================================================================
 * 剧情地下城UI系统 - StoryDungeonUI
 * ============================================================================
 * 
 * 功能：
 * 1. 剧情地下城专属界面
 * 2. BOSS战剧情演出
 * 3. 地下城与剧情进度联动UI
 * 4. 剧情奖励展示
 * 
 * 使用方法：
 *   <script src="js/story-dungeon-ui.js"></script>
 *   StoryDungeonUI.showDungeonList();
 * 
 * ============================================================================
 */

const StoryDungeonUI = {
  // 当前状态
  currentDungeon: null,
  currentBoss: null,
  dialogueQueue: [],
  isShowingDialogue: false,
  
  // ═════════════════════════════════════════════════════════════════════════
  // 初始化
  // ═════════════════════════════════════════════════════════════════════════
  
  init() {
    this.injectStyles();
    console.log('[StoryDungeonUI] 剧情地下城UI系统初始化完成');
    return this;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 样式注入
  // ═════════════════════════════════════════════════════════════════════════
  
  injectStyles() {
    if (document.getElementById('story-dungeon-styles')) return;
    
    const styles = `
      /* 剧情地下城列表 */
      .story-dungeon-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .story-dungeon-header {
        text-align: center;
        margin-bottom: 30px;
        padding: 20px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 12px;
        border: 2px solid #e94560;
      }
      
      .story-dungeon-header h2 {
        color: #e94560;
        margin: 0 0 10px 0;
        font-size: 28px;
        text-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
      }
      
      .story-dungeon-header p {
        color: #a0a0a0;
        margin: 0;
      }
      
      .story-dungeon-progress {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 15px;
        flex-wrap: wrap;
      }
      
      .progress-item {
        background: rgba(233, 69, 96, 0.2);
        padding: 8px 16px;
        border-radius: 20px;
        color: #e94560;
        font-size: 14px;
      }
      
      /* 幕次分组 */
      .story-act-section {
        margin-bottom: 30px;
      }
      
      .story-act-header {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        background: linear-gradient(90deg, #0f3460 0%, transparent 100%);
        border-left: 4px solid #e94560;
        margin-bottom: 15px;
        border-radius: 0 8px 8px 0;
      }
      
      .story-act-header h3 {
        margin: 0;
        color: #fff;
        font-size: 20px;
      }
      
      .story-act-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }
      
      .story-act-status.locked {
        background: #333;
        color: #888;
      }
      
      .story-act-status.available {
        background: #e94560;
        color: #fff;
      }
      
      .story-act-status.completed {
        background: #4ecca3;
        color: #1a1a2e;
      }
      
      /* 地下城卡片 */
      .story-dungeon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
      }
      
      .story-dungeon-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
        border-radius: 12px;
        padding: 20px;
        border: 2px solid #533483;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
      }
      
      .story-dungeon-card:hover:not(.locked) {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
        border-color: #e94560;
      }
      
      .story-dungeon-card.locked {
        opacity: 0.6;
        cursor: not-allowed;
        filter: grayscale(0.8);
      }
      
      .story-dungeon-card.completed {
        border-color: #4ecca3;
      }
      
      .story-dungeon-card.completed::after {
        content: '✓';
        position: absolute;
        top: 10px;
        right: 10px;
        background: #4ecca3;
        color: #1a1a2e;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      
      .dungeon-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      
      .dungeon-info h4 {
        margin: 0 0 10px 0;
        color: #fff;
        font-size: 18px;
      }
      
      .dungeon-desc {
        color: #a0a0a0;
        font-size: 14px;
        margin: 0 0 15px 0;
        line-height: 1.5;
      }
      
      .dungeon-meta {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      
      .dungeon-meta span {
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .dungeon-level {
        background: #e94560;
        color: #fff;
      }
      
      .dungeon-floors {
        background: #533483;
        color: #fff;
      }
      
      .dungeon-locked-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #888;
      }
      
      /* BOSS战界面 */
      .story-boss-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .story-boss-container {
        width: 90%;
        max-width: 1000px;
        background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
        border-radius: 20px;
        border: 3px solid #e94560;
        overflow: hidden;
      }
      
      .story-boss-header {
        background: linear-gradient(90deg, #e94560 0%, #533483 100%);
        padding: 30px;
        text-align: center;
      }
      
      .story-boss-header h2 {
        margin: 0;
        color: #fff;
        font-size: 32px;
        text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      }
      
      .story-boss-header .boss-title {
        color: rgba(255, 255, 255, 0.8);
        font-size: 18px;
        margin-top: 10px;
      }
      
      .story-boss-content {
        padding: 30px;
      }
      
      .boss-ascii-art {
        text-align: center;
        font-family: monospace;
        font-size: 14px;
        color: #e94560;
        margin-bottom: 20px;
        white-space: pre;
        line-height: 1.2;
      }
      
      .boss-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .boss-stat-item {
        background: rgba(0, 0, 0, 0.3);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
      }
      
      .boss-stat-item .stat-label {
        color: #888;
        font-size: 12px;
        margin-bottom: 5px;
      }
      
      .boss-stat-item .stat-value {
        color: #e94560;
        font-size: 24px;
        font-weight: bold;
      }
      
      .boss-mechanic-box {
        background: rgba(233, 69, 96, 0.1);
        border: 1px solid #e94560;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      
      .boss-mechanic-box h4 {
        margin: 0 0 10px 0;
        color: #e94560;
      }
      
      .boss-mechanic-box p {
        margin: 0;
        color: #ccc;
        line-height: 1.6;
      }
      
      .boss-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
      }
      
      .boss-btn {
        padding: 15px 40px;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s;
      }
      
      .boss-btn.challenge {
        background: linear-gradient(135deg, #e94560 0%, #533483 100%);
        color: #fff;
      }
      
      .boss-btn.challenge:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
      }
      
      .boss-btn.retreat {
        background: #333;
        color: #888;
      }
      
      /* 剧情对话系统 */
      .story-dialogue-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10001;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 40px;
      }
      
      .story-dialogue-box {
        width: 100%;
        max-width: 900px;
        background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
        border: 3px solid #e94560;
        border-radius: 16px;
        padding: 30px;
        position: relative;
      }
      
      .dialogue-speaker {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
      }
      
      .speaker-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e94560 0%, #533483 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
      }
      
      .speaker-info h4 {
        margin: 0;
        color: #e94560;
        font-size: 20px;
      }
      
      .speaker-info span {
        color: #888;
        font-size: 14px;
      }
      
      .dialogue-text {
        color: #fff;
        font-size: 18px;
        line-height: 1.8;
        min-height: 80px;
      }
      
      .dialogue-text.typing::after {
        content: '|';
        animation: blink 1s infinite;
      }
      
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      
      .dialogue-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
      
      .dialogue-next-btn {
        padding: 10px 30px;
        background: #e94560;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      }
      
      /* 剧情奖励界面 */
      .story-reward-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .story-reward-container {
        text-align: center;
        animation: rewardAppear 0.5s ease;
      }
      
      @keyframes rewardAppear {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .reward-title {
        font-size: 36px;
        color: #e94560;
        margin-bottom: 30px;
        text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
      }
      
      .reward-items {
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 30px;
      }
      
      .reward-item {
        background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
        border: 2px solid #4ecca3;
        border-radius: 12px;
        padding: 20px;
        min-width: 150px;
      }
      
      .reward-item .item-icon {
        font-size: 48px;
        margin-bottom: 10px;
      }
      
      .reward-item .item-name {
        color: #fff;
        font-size: 16px;
        margin-bottom: 5px;
      }
      
      .reward-item .item-desc {
        color: #888;
        font-size: 12px;
      }
      
      .reward-close-btn {
        padding: 15px 50px;
        background: linear-gradient(135deg, #e94560 0%, #533483 100%);
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        cursor: pointer;
      }
      
      /* 响应式 */
      @media (max-width: 768px) {
        .story-dungeon-grid {
          grid-template-columns: 1fr;
        }
        
        .boss-stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .boss-actions {
          flex-direction: column;
        }
      }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'story-dungeon-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 显示地下城列表
  // ═════════════════════════════════════════════════════════════════════════
  
  showDungeonList(containerId = 'story-dungeon-list') {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }
    
    const dungeons = StoryDungeons.getAllDungeons();
    const completedDungeons = StoryDungeons.state.completedDungeons;
    
    // 按幕次分组
    const dungeonsByAct = {};
    dungeons.forEach(d => {
      if (!dungeonsByAct[d.storyAct]) dungeonsByAct[d.storyAct] = [];
      dungeonsByAct[d.storyAct].push(d);
    });
    
    let html = `
      <div class="story-dungeon-container">
        <div class="story-dungeon-header">
          <h2>🏯 主线剧情地下城</h2>
          <p>探索《血骨门之乱》的专属地下城，体验史诗剧情</p>
          <div class="story-dungeon-progress">
            <span class="progress-item">已完成: ${completedDungeons.length}/${dungeons.filter(d => !d.isNGPlusOnly).length}</span>
            <span class="progress-item">当前幕: 第${this.getCurrentAct()}幕</span>
          </div>
        </div>
    `;
    
    // 按幕次渲染
    Object.keys(dungeonsByAct).sort((a, b) => a - b).forEach(act => {
      const actDungeons = dungeonsByAct[act];
      const isCompleted = actDungeons.every(d => completedDungeons.includes(d.id));
      const isAvailable = actDungeons.some(d => this.isDungeonAvailable(d));
      
      let statusClass = 'locked';
      let statusText = '未解锁';
      if (isCompleted) {
        statusClass = 'completed';
        statusText = '已完成';
      } else if (isAvailable) {
        statusClass = 'available';
        statusText = '进行中';
      }
      
      html += `
        <div class="story-act-section">
          <div class="story-act-header">
            <h3>第${act}幕${act === 7 ? ' (二周目)' : ''}</h3>
            <span class="story-act-status ${statusClass}">${statusText}</span>
          </div>
          <div class="story-dungeon-grid">
      `;
      
      actDungeons.forEach(dungeon => {
        const isUnlocked = this.isDungeonAvailable(dungeon);
        const isDone = completedDungeons.includes(dungeon.id);
        html += this.renderDungeonCard(dungeon, isUnlocked, isDone);
      });
      
      html += '</div></div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // 绑定点击事件
    this.bindDungeonCardEvents(container);
    
    return container;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 渲染地下城卡片
  // ═════════════════════════════════════════════════════════════════════════
  
  renderDungeonCard(dungeon, isUnlocked, isCompleted) {
    const lockedClass = isUnlocked ? '' : 'locked';
    const completedClass = isCompleted ? 'completed' : '';
    const lockedOverlay = isUnlocked ? '' : '<div class="dungeon-locked-overlay">🔒 完成前置任务解锁</div>';
    
    return `
      <div class="story-dungeon-card ${lockedClass} ${completedClass}" data-dungeon="${dungeon.id}">
        <div class="dungeon-icon">${dungeon.icon}</div>
        <div class="dungeon-info">
          <h4>${dungeon.name}</h4>
          <p class="dungeon-desc">${dungeon.desc}</p>
          <div class="dungeon-meta">
            <span class="dungeon-level">Lv.${dungeon.minLevel}-${dungeon.maxLevel}</span>
            ${dungeon.floors > 1 ? `<span class="dungeon-floors">${dungeon.floors}层</span>` : ''}
          </div>
        </div>
        ${lockedOverlay}
      </div>
    `;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 绑定卡片事件
  // ═════════════════════════════════════════════════════════════════════════
  
  bindDungeonCardEvents(container) {
    container.querySelectorAll('.story-dungeon-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        const dungeonId = card.dataset.dungeon;
        this.enterDungeon(dungeonId);
      });
    });
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 进入地下城
  // ═════════════════════════════════════════════════════════════════════════
  
  enterDungeon(dungeonId) {
    const dungeon = StoryDungeons.getDungeon(dungeonId);
    if (!dungeon) return;
    
    this.currentDungeon = dungeon;
    
    // 触发进入剧情动画
    if (dungeon.storySettings?.introCinema) {
      console.log(`[StoryDungeonUI] 播放进入动画: ${dungeon.storySettings.introCinema}`);
    }
    
    // 显示BOSS战界面（如果是BOSS房）
    if (dungeon.map) {
      const bossRoom = dungeon.map.flat().find(r => r?.type === 'boss');
      if (bossRoom) {
        this.showBossBattle(bossRoom.enemyId);
      }
    }
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 显示BOSS战界面
  // ═════════════════════════════════════════════════════════════════════════
  
  showBossBattle(bossId) {
    const boss = StoryDungeons.getBoss(bossId);
    if (!boss) return;
    
    this.currentBoss = boss;
    
    const overlay = document.createElement('div');
    overlay.className = 'story-boss-overlay';
    overlay.id = 'story-boss-overlay';
    
    const asciiArt = this.getBossAsciiArt(bossId);
    
    overlay.innerHTML = `
      <div class="story-boss-container">
        <div class="story-boss-header">
          <h2>⚔️ ${boss.name}</h2>
          <p class="boss-title">${boss.title}</p>
        </div>
        <div class="story-boss-content">
          <div class="boss-ascii-art">${asciiArt}</div>
          <div class="boss-stats-grid">
            <div class="boss-stat-item">
              <div class="stat-label">等级</div>
              <div class="stat-value">${boss.level}</div>
            </div>
            <div class="boss-stat-item">
              <div class="stat-label">气血</div>
              <div class="stat-value">${boss.hp}</div>
            </div>
            <div class="boss-stat-item">
              <div class="stat-label">攻击</div>
              <div class="stat-value">${boss.atk}</div>
            </div>
            <div class="boss-stat-item">
              <div class="stat-label">防御</div>
              <div class="stat-value">${boss.def}</div>
            </div>
          </div>
          <div class="boss-mechanic-box">
            <h4>⚡ 特殊机制</h4>
            <p>${boss.specialMechanic}</p>
          </div>
          <div class="boss-actions">
            <button class="boss-btn challenge" onclick="StoryDungeonUI.startBossBattle()">挑战BOSS</button>
            <button class="boss-btn retreat" onclick="StoryDungeonUI.closeBossBattle()">暂时撤退</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 播放BOSS登场对话
    if (boss.introDialogue) {
      setTimeout(() => this.showDialogue(boss.introDialogue), 500);
    }
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 获取BOSS ASCII艺术
  // ═════════════════════════════════════════════════════════════════════════
  
  getBossAsciiArt(bossId) {
    const arts = {
      boss_blood_wolf: `
    /\\___/\\
   (  o o  )
   /   *   \\
  (  *   *  )
   |  ||  |
   (__||__)
      `,
      boss_fragment_guardian: `
    ⚔️ 阎罗 ⚔️
    ╔═══════╗
    ║ ◉   ◉ ║
    ║   ▽   ║
    ║ ════  ║
    ╚═══════╝
      `,
      boss_gumingzi_final: `
   ♰ 骨冥子 ♰
    ╔═══════╗
    ║ ◈   ◈ ║
    ║   ※   ║
    ║ █████ ║
    ╚═══════╝
    血债血偿
      `,
      boss_true_villain: `
   ❄️ 北疆魔尊 ❄️
    ╔═══════╗
    ║ ◉   ◉ ║
    ║   ◈   ║
    ║ █████ ║
    ╚═══════╝
   千年怨恨
      `,
    };
    return arts[bossId] || `
    👹 BOSS 👹
    ╔═══════╗
    ║ ◉   ◉ ║
    ║   ▽   ║
    ║ ════  ║
    ╚═══════╝
    `;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 开始BOSS战
  // ═════════════════════════════════════════════════════════════════════════
  
  startBossBattle() {
    if (!this.currentBoss) return;
    
    // 关闭BOSS界面
    this.closeBossBattle();
    
    // 进入战斗
    console.log(`[StoryDungeonUI] 开始BOSS战: ${this.currentBoss.name}`);
    
    // 这里应该调用战斗系统
    // 保存当前BOSS信息到sessionStorage供战斗系统使用
    sessionStorage.setItem('story_boss_battle', JSON.stringify({
      bossId: this.currentBoss.id,
      dungeonId: this.currentDungeon?.id,
    }));
    
    // 触发战斗
    if (typeof startStoryBossBattle === 'function') {
      startStoryBossBattle(this.currentBoss.id);
    }
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 关闭BOSS战界面
  // ═════════════════════════════════════════════════════════════════════════
  
  closeBossBattle() {
    const overlay = document.getElementById('story-boss-overlay');
    if (overlay) {
      overlay.remove();
    }
    this.currentBoss = null;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 显示对话
  // ═════════════════════════════════════════════════════════════════════════
  
  showDialogue(dialogueList) {
    this.dialogueQueue = [...dialogueList];
    this.showNextDialogue();
  },
  
  showNextDialogue() {
    if (this.dialogueQueue.length === 0) {
      this.closeDialogue();
      return;
    }
    
    const dialogue = this.dialogueQueue.shift();
    this.isShowingDialogue = true;
    
    // 创建或获取对话框
    let overlay = document.getElementById('story-dialogue-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'story-dialogue-overlay';
      overlay.id = 'story-dialogue-overlay';
      document.body.appendChild(overlay);
    }
    
    const speakerName = this.getSpeakerName(dialogue.speaker);
    const speakerIcon = this.getSpeakerIcon(dialogue.speaker);
    
    overlay.innerHTML = `
      <div class="story-dialogue-box">
        <div class="dialogue-speaker">
          <div class="speaker-avatar">${speakerIcon}</div>
          <div class="speaker-info">
            <h4>${speakerName}</h4>
            <span>${this.getSpeakerTitle(dialogue.speaker)}</span>
          </div>
        </div>
        <div class="dialogue-text typing" id="dialogue-text"></div>
        <div class="dialogue-actions">
          <button class="dialogue-next-btn" onclick="StoryDungeonUI.showNextDialogue()">继续</button>
        </div>
      </div>
    `;
    
    // 打字机效果
    this.typeText(dialogue.text, 'dialogue-text');
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 打字机效果
  // ═════════════════════════════════════════════════════════════════════════
  
  typeText(text, elementId, speed = 50) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let i = 0;
    element.textContent = '';
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.classList.remove('typing');
      }
    };
    
    type();
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 关闭对话
  // ═════════════════════════════════════════════════════════════════════════
  
  closeDialogue() {
    const overlay = document.getElementById('story-dialogue-overlay');
    if (overlay) {
      overlay.remove();
    }
    this.isShowingDialogue = false;
    this.dialogueQueue = [];
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 获取说话者信息
  // ═════════════════════════════════════════════════════════════════════════
  
  getSpeakerName(speaker) {
    const names = {
      boss: this.currentBoss?.name || 'BOSS',
      player: '你',
      narrator: '旁白',
      heyin: '鹤隐',
      lengyue: '冷月',
      nangong: '南宫烈',
    };
    return names[speaker] || speaker;
  },
  
  getSpeakerIcon(speaker) {
    const icons = {
      boss: '👹',
      player: '🗡️',
      narrator: '📖',
      heyin: '🦩',
      lengyue: '🌙',
      nangong: '🔥',
    };
    return icons[speaker] || '💬';
  },
  
  getSpeakerTitle(speaker) {
    const titles = {
      boss: this.currentBoss?.title || '',
      player: '江湖侠客',
      narrator: '',
      heyin: '江湖隐士',
      lengyue: '玄冥教圣女',
      nangong: '南宫家主',
    };
    return titles[speaker] || '';
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 显示奖励
  // ═════════════════════════════════════════════════════════════════════════
  
  showRewards(rewards) {
    const overlay = document.createElement('div');
    overlay.className = 'story-reward-overlay';
    overlay.id = 'story-reward-overlay';
    
    let itemsHtml = '';
    if (rewards.items) {
      itemsHtml = rewards.items.map(item => `
        <div class="reward-item">
          <div class="item-icon">📦</div>
          <div class="item-name">${item.name || item.id}</div>
          <div class="item-desc">${item.desc || ''}</div>
        </div>
      `).join('');
    }
    
    overlay.innerHTML = `
      <div class="story-reward-container">
        <h2 class="reward-title">🎉 通关奖励</h2>
        <div class="reward-items">
          ${itemsHtml}
          <div class="reward-item">
            <div class="item-icon">✨</div>
            <div class="item-name">${rewards.exp} 经验</div>
          </div>
          <div class="reward-item">
            <div class="item-icon">💰</div>
            <div class="item-name">${rewards.silver} 银两</div>
          </div>
        </div>
        <button class="reward-close-btn" onclick="StoryDungeonUI.closeRewards()">领取奖励</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
  },
  
  closeRewards() {
    const overlay = document.getElementById('story-reward-overlay');
    if (overlay) {
      overlay.remove();
    }
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 工具函数
  // ═════════════════════════════════════════════════════════════════════════
  
  getCurrentAct() {
    // 从StoryMainQuest获取当前幕次
    if (typeof StoryMainQuest !== 'undefined') {
      const quest = StoryMainQuest.getCurrentQuest();
      return quest?.act || 1;
    }
    return 1;
  },
  
  isDungeonAvailable(dungeon) {
    // 检查二周目限制
    if (dungeon.isNGPlusOnly) {
      // 检查是否二周目
      return false; // 默认不开放
    }
    
    // 检查前置任务
    if (dungeon.requiredQuest) {
      // 需要与StoryMainQuest集成
      return true; // 默认可用
    }
    
    return true;
  },
  
  // ═════════════════════════════════════════════════════════════════════════
  // 战斗结果处理
  // ═════════════════════════════════════════════════════════════════════════
  
  onBossDefeat(bossId) {
    const boss = StoryDungeons.getBoss(bossId);
    if (!boss) return;
    
    // 播放击败对话
    if (boss.defeatDialogue) {
      this.showDialogue(boss.defeatDialogue);
    }
    
    // 显示奖励
    const dungeon = this.currentDungeon;
    if (dungeon?.bossReward) {
      setTimeout(() => this.showRewards(dungeon.bossReward), 2000);
    }
    
    // 标记完成
    StoryDungeons.completeBoss(bossId);
    if (dungeon) {
      StoryDungeons.completeDungeon(dungeon.id);
    }
  },
  
  onBossVictory(bossId) {
    // 玩家被BOSS击败
    const boss = StoryDungeons.getBoss(bossId);
    console.log(`[StoryDungeonUI] 玩家被 ${boss?.name} 击败`);
    
    // 显示失败提示
    alert(`你被 ${boss?.name} 击败了！请提升实力后再来挑战。`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// 自动初始化
// ═══════════════════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.StoryDungeonUI = StoryDungeonUI;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StoryDungeonUI.init());
  } else {
    StoryDungeonUI.init();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 导出
// ═══════════════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StoryDungeonUI };
}
