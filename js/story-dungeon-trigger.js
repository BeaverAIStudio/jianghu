// ════════════════════════════════════════════════════
//  story-dungeon-trigger.js  剧情地下城触发系统
//  将主线任务与剧情地下城关联
// ════════════════════════════════════════════════════

// ── 剧情地下城触发检查 ──────────────────────────────

/** 检查主线任务是否为剧情地下城类型 */
function isStoryDungeonQuest(questId) {
  const quest = MAIN_QUEST_CHAIN[questId];
  return quest && quest.type === 'dungeon' && quest.dungeonId;
}

/** 获取当前主线任务关联的剧情地下城 */
function getCurrentStoryDungeon() {
  const cur = getCurrentMainQuest();
  if (!cur || cur.type !== 'dungeon' || !cur.dungeonId) return null;
  
  return {
    quest: cur,
    dungeon: STORY_DUNGEON_DB[cur.dungeonId],
  };
}

/** 检查是否可以在当前城市进入剧情地下城 */
function canEnterStoryDungeonAtCity(cityId) {
  const sd = getCurrentStoryDungeon();
  if (!sd) return { can: false, reason: '当前没有可进入的剧情地下城' };
  
  const { quest, dungeon } = sd;
  
  // 检查城市匹配
  if (quest.triggerCity && quest.triggerCity !== cityId) {
    return { 
      can: false, 
      reason: `需要前往 ${quest.triggerCity} 才能进入`,
      targetCity: quest.triggerCity,
    };
  }
  
  // 检查进入条件
  const check = canEnterStoryDungeon(dungeon.id);
  if (!check.can) return check;
  
  return { can: true, quest, dungeon };
}

/** 显示剧情地下城进入提示 */
function showStoryDungeonPrompt(cityId) {
  const check = canEnterStoryDungeonAtCity(cityId);
  if (!check.can) {
    if (check.targetCity) {
      showToast(`📜 主线任务：前往 ${check.targetCity} 继续剧情`);
    }
    return;
  }
  
  const { quest, dungeon } = check;
  
  // 显示特殊的剧情地下城提示
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.id = 'story-dungeon-prompt';
  
  const isFinal = dungeon.type === STORY_DUNGEON_TYPE.FINAL;
  
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:500px;animation:slideIn 0.3s ease">
      <div class="mqn-act-badge" style="color:${isFinal ? '#ff6060' : '#80d8ff'};border-color:rgba(128,216,255,.3)">
        ${isFinal ? '☠️ 终章决战' : `📜 第${quest.act}幕剧情`}
      </div>
      <div class="mqn-title" style="font-size:22px;margin:16px 0">
        ${dungeon.icon} ${dungeon.name}
      </div>
      <div class="mqn-desc" style="color:rgba(200,200,200,.9);line-height:1.6;margin-bottom:16px">
        ${dungeon.desc}
      </div>
      
      ${dungeon.narrative?.enter ? `
        <div class="mqn-scene" style="background:rgba(0,0,0,.3);padding:16px;border-radius:8px;margin-bottom:20px">
          <div style="color:#d0b870;font-size:13px;margin-bottom:10px">📍 ${dungeon.narrative.enter.scene}</div>
          ${dungeon.narrative.enter.lines.map(line => `
            <div style="color:rgba(255,255,255,.85);margin:6px 0;padding-left:12px;border-left:2px solid rgba(128,216,255,.3);font-size:14px;line-height:1.5">
              ${line}
            </div>
          `).join('')}
          ${dungeon.narrative.enter.tip ? `
            <div style="color:#80d8ff;margin-top:12px;font-size:13px">💡 ${dungeon.narrative.enter.tip}</div>
          ` : ''}
        </div>
      ` : ''}
      
      <div style="background:rgba(255,200,80,.1);padding:12px;border-radius:6px;margin-bottom:20px">
        <div style="color:#f0c060;font-size:12px;margin-bottom:6px">🎮 特殊机制</div>
        <div style="color:rgba(255,255,255,.7);font-size:13px">
          ${dungeon.floors ? `多层地下城：共 ${dungeon.floors} 层` : '单层地下城'}
          ${dungeon.specialMechanic ? ` · ${dungeon.specialMechanic.name}` : ''}
        </div>
      </div>
      
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="document.getElementById('story-dungeon-prompt').remove()">
          稍后再来
        </button>
        <button class="mqn-btn mqn-btn-panel" onclick="enterStoryDungeonFromPrompt('${dungeon.id}')">
          ${isFinal ? '☠️ 进入决战' : '🗡️ 进入剧情'}
        </button>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from { transform:translateY(-20px);opacity:0; }
        to { transform:translateY(0);opacity:1; }
      }
    </style>
  `;
  
  document.body.appendChild(overlay);
}

/** 从提示弹窗进入剧情地下城 */
function enterStoryDungeonFromPrompt(dungeonId) {
  document.getElementById('story-dungeon-prompt')?.remove();
  
  // 保存当前页面以便返回
  const fromPage = window.location.pathname.includes('town.html') ? 'town.html' : 'travel.html';
  
  // 进入剧情地下城
  enterStoryDungeon(dungeonId, fromPage);
}

// ── 城镇界面集成 ────────────────────────────────────

/** 在城镇界面注入剧情地下城入口 */
function injectStoryDungeonEntry(cityId) {
  const check = canEnterStoryDungeonAtCity(cityId);
  if (!check.can) {
    // 如果有目标城市提示，显示指引
    if (check.targetCity) {
      _showStoryDungeonGuide(check.targetCity);
    }
    return;
  }
  
  const { dungeon } = check;
  
  // 检查是否已存在入口
  if (document.getElementById('storyDungeonEntry')) return;
  
  // 找到服务按钮容器
  const container = document.getElementById('tlServices') || document.getElementById('cityServices');
  if (!container) return;
  
  const isFinal = dungeon.type === STORY_DUNGEON_TYPE.FINAL;
  
  const btn = document.createElement('button');
  btn.id = 'storyDungeonEntry';
  btn.className = `tl-service-btn ${isFinal ? 'story-dungeon-final' : 'story-dungeon-entry'}`;
  btn.innerHTML = `
    <span class="svc-icon">${dungeon.icon}</span>
    <span class="svc-name">${isFinal ? '终章决战' : '剧情'}</span>
  `;
  btn.title = `${dungeon.name} - 点击进入`;
  btn.onclick = () => showStoryDungeonPrompt(cityId);
  
  // 添加特殊样式
  btn.style.cssText = isFinal 
    ? 'background:linear-gradient(135deg,#ff4040,#ff6060);color:white;border-color:#ff8080;animation:pulse 2s infinite'
    : 'background:linear-gradient(135deg,#4080ff,#60a0ff);color:white;border-color:#80c0ff';
  
  // 插入到第一位
  container.insertBefore(btn, container.firstChild);
  
  // 添加脉冲动画
  if (!document.getElementById('story-dungeon-anim')) {
    const style = document.createElement('style');
    style.id = 'story-dungeon-anim';
    style.textContent = `
      @keyframes pulse {
        0%,100% { box-shadow:0 0 0 0 rgba(255,64,64,0.4); }
        50% { box-shadow:0 0 0 10px rgba(255,64,64,0); }
      }
    `;
    document.head.appendChild(style);
  }
}

/** 显示剧情地下城指引（当需要前往其他城市时） */
function _showStoryDungeonGuide(targetCity) {
  // 检查是否已存在指引
  if (document.getElementById('storyDungeonGuide')) return;
  
  const container = document.getElementById('tlLocation') || document.getElementById('cityInfo');
  if (!container) return;
  
  const guide = document.createElement('div');
  guide.id = 'storyDungeonGuide';
  guide.className = 'story-dungeon-guide';
  guide.innerHTML = `
    <span style="color:#f0c060">📜 主线任务：前往 ${targetCity} 继续剧情</span>
  `;
  guide.style.cssText = 'background:rgba(240,192,96,.1);padding:8px 12px;border-radius:4px;margin-top:8px;font-size:13px';
  
  container.appendChild(guide);
}

// ── 剧情地下城完成处理 ──────────────────────────────

/** 剧情地下城完成后的处理 */
function onStoryDungeonComplete(dungeonId, result) {
  const dungeon = STORY_DUNGEON_DB[dungeonId];
  if (!dungeon) return;
  
  // 标记完成
  completeStoryDungeon(dungeonId);
  
  // 显示完成剧情
  if (dungeon.narrative?.complete) {
    _showStoryDungeonCompleteNarrative(dungeon.narrative.complete);
  }
  
  // 推进主线
  if (dungeon.bindQuest) {
    advanceMainQuest(dungeon.bindQuest);
  }
  
  // 触发成就
  if (dungeon.type === STORY_DUNGEON_TYPE.FINAL) {
    if (typeof achCheck === 'function') {
      achCheck('ach_story_complete');
    }
  }
}

/** 显示剧情地下城完成叙事 */
function _showStoryDungeonCompleteNarrative(narrative) {
  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:520px">
      <div class="mqn-act-badge" style="color:#4ecb71;border-color:rgba(78,203,113,.3)">
        ✅ 剧情完成
      </div>
      <div class="mqn-title" style="font-size:20px;margin:16px 0">
        ${narrative.scene}
      </div>
      <div class="mqn-scene" style="background:rgba(0,0,0,.3);padding:16px;border-radius:8px;margin-bottom:20px">
        ${narrative.lines.map(line => `
          <div style="color:rgba(255,255,255,.9);margin:8px 0;padding-left:12px;border-left:2px solid rgba(78,203,113,.3);font-size:14px;line-height:1.6">
            ${line}
          </div>
        `).join('')}
      </div>
      ${narrative.rewardText ? `
        <div style="background:rgba(78,203,113,.1);padding:12px;border-radius:6px;margin-bottom:20px">
          <div style="color:#4ecb71;font-size:13px">🎁 任务奖励</div>
          <div style="color:rgba(255,255,255,.8);font-size:14px;margin-top:6px">${narrative.rewardText}</div>
        </div>
      ` : ''}
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">
          继续前行
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ── 初始化钩子 ──────────────────────────────────────

/** 初始化剧情地下城触发系统 */
function initStoryDungeonTrigger() {
  // 挂钩到城镇加载完成事件
  const originalLoadTown = window.loadTown || window.townInit;
  if (originalLoadTown) {
    window.loadTown = function(...args) {
      const result = originalLoadTown.apply(this, args);
      // 城镇加载完成后检查剧情地下城
      const cityId = args[0] || new URLSearchParams(window.location.search).get('city');
      if (cityId) {
        setTimeout(() => injectStoryDungeonEntry(cityId), 500);
      }
      return result;
    };
  }
  
  // 挂钩到旅行渲染
  const originalRenderLocation = window.travelRenderLocation;
  if (originalRenderLocation) {
    window.travelRenderLocation = function(cityId) {
      originalRenderLocation(cityId);
      setTimeout(() => injectStoryDungeonEntry(cityId), 300);
    };
  }
  
  console.log('[剧情地下城] 触发系统已初始化');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStoryDungeonTrigger);
} else {
  initStoryDungeonTrigger();
}

// ════════════════════════════════════════════════════
//  导出
// ════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isStoryDungeonQuest,
    getCurrentStoryDungeon,
    canEnterStoryDungeonAtCity,
    showStoryDungeonPrompt,
    onStoryDungeonComplete,
  };
}

// ════════════════════════════════════════════════════
//  StoryDungeonTrigger 全局对象（供UI模块使用）
// ════════════════════════════════════════════════════
window.StoryDungeonTrigger = {
  // 获取当前可用的剧情地下城列表
  getAvailableDungeons() {
    const dungeons = [];
    
    // 获取当前主线任务
    const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
    const currentQuestId = mainQuest.currentQuestId;
    
    if (!currentQuestId || !window.MAIN_QUEST_DB) return dungeons;
    
    const quest = window.MAIN_QUEST_DB[currentQuestId];
    if (!quest || quest.type !== 'dungeon' || !quest.dungeonId) return dungeons;
    
    const dungeon = window.STORY_DUNGEON_DB?.[quest.dungeonId];
    if (!dungeon) return dungeons;
    
    // 检查是否已完成
    const completed = JSON.parse(localStorage.getItem('wuxia_story_dungeons') || '[]');
    if (completed.includes(quest.dungeonId)) return dungeons;
    
    dungeons.push({
      id: quest.dungeonId,
      name: dungeon.name,
      desc: dungeon.desc,
      act: dungeon.act,
      isFinal: dungeon.isFinal || false,
      questId: currentQuestId
    });
    
    return dungeons;
  },
  
  // 进入剧情地下城
  enterStoryDungeon(dungeonId) {
    const dungeon = window.STORY_DUNGEON_DB?.[dungeonId];
    if (!dungeon) {
      console.error('[StoryDungeonTrigger] 地下城不存在:', dungeonId);
      return false;
    }
    
    // 保存剧情地下城上下文
    const context = {
      dungeonId: dungeonId,
      isStoryDungeon: true,
      act: dungeon.act,
      layer: 0,
      stealthLevel: 0,
      defeatedBosses: [],
      startTime: Date.now()
    };
    sessionStorage.setItem('wuxia_story_dungeon', JSON.stringify(context));
    
    // 跳转到地下城页面
    window.location.href = 'dungeon.html';
    return true;
  },
  
  // 检查是否可以进入
  canEnter(dungeonId) {
    const dungeon = window.STORY_DUNGEON_DB?.[dungeonId];
    if (!dungeon) return false;
    
    // 检查是否已完成
    const completed = JSON.parse(localStorage.getItem('wuxia_story_dungeons') || '[]');
    if (completed.includes(dungeonId)) return false;
    
    // 检查主线任务是否匹配
    const mainQuest = JSON.parse(localStorage.getItem('wuxia_main_quest') || '{}');
    const currentQuestId = mainQuest.currentQuestId;
    
    if (!currentQuestId) return false;
    
    const quest = window.MAIN_QUEST_DB?.[currentQuestId];
    if (!quest || quest.dungeonId !== dungeonId) return false;
    
    return true;
  }
};
