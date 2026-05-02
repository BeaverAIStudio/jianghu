/**
 * ============================================================================
 * StoryGuide 集成接口层
 * ============================================================================
 *
 * 设计原则：零侵入，只提供手动调用接口
 * - 不自动初始化
 * - 不覆盖任何全局函数
 * - 不监听任何游戏事件
 * - 所有调用都是手动触发
 *
 * 使用方式（在任意游戏代码中手动调用）：
 *
 *   // 初始化并启动（一次）
 *   StoryGuide.init();
 *   StoryGuide.start();
 *
 *   // 进城后检查指引（travel 类型自动轮询检测，也可手动调用）
 *   StoryGuideIntegration.onCityEntered('洛阳');
 *
 *   // NPC 对话后调用
 *   StoryGuideIntegration.onNpcTalk('鹤隐');
 *
 *   // 地下城通关后调用
 *   StoryGuideIntegration.onDungeonComplete('血骨门总坛');
 *
 *   // BOSS 击败后调用
 *   StoryGuideIntegration.onBossDefeated('骨冥子');
 *
 *   // 显示/隐藏指引卡
 *   StoryGuideIntegration.showHint();
 *   StoryGuideIntegration.hideHint();
 *
 * ============================================================================
 */

const StoryGuideIntegration = {

  /**
   * 初始化游戏代码端的集成
   * 调用一次即可，之后每次进城/对话/通关时调用对应方法
   */
  init() {
    console.log('[StoryGuide-Integration] 集成接口已就绪');
    console.log('  调用 StoryGuide.init() 和 StoryGuide.start() 启动指引');
    return this;
  },

  /**
   * 玩家进入城市后调用
   * travel 类型节点会自动轮询检测；此方法用于主动触发一次检查
   */
  onCityEntered(cityName) {
    if (typeof window.StoryGuide !== 'undefined' && window.StoryGuide._poll) {
      // travel 类型节点通过轮询检测城市，手动触发一次即时检查（快于等待8秒轮询）
      try { window.StoryGuide._poll(); } catch(e) {}
    }
  },

  /**
   * 玩家与 NPC 对话后调用（推荐在 NPC 对话关闭时调用）
   * 参数传入当前 NPC 名称
   */
  onNpcTalk(npcName) {
    if (typeof window.StoryGuide !== 'undefined' && window.StoryGuide.talk) {
      window.StoryGuide.talk(npcName);
    }
  },

  /**
   * 玩家通关地下城后调用
   * 参数传入地下城名称
   */
  onDungeonComplete(dungeonName) {
    if (typeof window.StoryGuide !== 'undefined' && window.StoryGuide.dungeon) {
      window.StoryGuide.dungeon(dungeonName);
    }
  },

  /**
   * 玩家击败 BOSS 后调用
   * 参数传入 BOSS 名称
   */
  onBossDefeated(bossName) {
    if (typeof window.StoryGuide !== 'undefined' && window.StoryGuide.boss) {
      window.StoryGuide.boss(bossName);
    }
  },

  /**
   * 显示指引卡
   */
  showHint() {
    if (typeof window.StoryGuide !== 'undefined' && window.StoryGuide.show) {
      window.StoryGuide.show();
    }
  },

  /**
   * 隐藏指引卡
   */
  hideHint() {
    if (typeof window.StoryGuide !== 'undefined' && window.StoryGuide.hide) {
      window.StoryGuide.hide();
    }
  },

  /**
   * 获取当前指引状态（调试用）
   */
  status() {
    if (typeof window.StoryGuide !== 'undefined' && window.StoryGuide.debug) {
      return window.StoryGuide.debug();
    }
    return null;
  },
};

// 全局导出
window.StoryGuideIntegration = StoryGuideIntegration;
window.SGI = StoryGuideIntegration;  // 短别名

console.log('[StoryGuide-Integration] 集成接口层已加载（需手动 init）');
