// ════════════════════════════════════════════════════════════
// tip-system.js — 新手提示 & 关键系统首次发现通知
// 在玩家首次触发某系统时显示引导提示
// 存储：localStorage key = 'wuxia_tips'
// ════════════════════════════════════════════════════════════

'use strict';

const TIPS_DB = {
  // ── 境界系统提示 ──────────────────────────────
  realm_breakthrough: {
    icon: '⚡',
    color: '#88ddff',
    title: '境界突破！',
    content: '你的真气已满足突破条件！\n\n点击状态栏中的「⚡突破」按钮，尝试突破到更高境界。\n境界越高，真气上限越高，突破成功率越低。突破失败会消耗部分气血，请谨慎。',
    once: true, // 只显示一次
  },
  realm_first: {
    icon: '💠',
    color: '#88ddff',
    title: '境界系统已激活',
    content: '你已迈入后天境界！\n\n在城镇中闭关修炼（消耗精力），或在战斗、修炼秘籍时积累真气。\n真气满后可在状态栏突破，境界越高属性越强！',
    once: true,
  },
  // ── 善恶值系统提示 ──────────────────────────
  karma_positive: {
    icon: '🌟',
    color: '#33cc88',
    title: '侠名渐盛',
    content: '你的善恶值已进入「侠肝义胆」阶段！\n\n正道NPC对你的好感提升，邪道势力开始忌惮你。\n继续行侠仗义，声名远播时，整个江湖都会记住你的名字。',
    once: true,
    condition: (k) => k >= 20 && k < 50,
  },
  karma_negative: {
    icon: '💀',
    color: '#dd4422',
    title: '恶名在外',
    content: '你的善恶值已进入「作恶多端」阶段！\n\n正道NPC对你嗤之以鼻，邪道势力开始接纳你。\n继续作恶，你将成为江湖公敌——但也可能在黑道闯出一片天地。',
    once: true,
    condition: (k) => k <= -20,
  },
  karma_extreme_good: {
    icon: '🌟',
    color: '#22ddaa',
    title: '一代宗师',
    content: '你的善恶值达到了「一代宗师」！\n\n这是江湖中最高的侠名。\n整个江湖都敬仰你，正道以你为荣，邪道闻风丧胆。',
    once: true,
    condition: (k) => k >= 80,
  },
  karma_extreme_evil: {
    icon: '💀',
    color: '#cc1111',
    title: '恶贯满盈',
    content: '你的善恶值达到了「恶貫滿盈」！\n\n这是江湖中最大的恶名。\n正道武林联合追杀你，邪道枭雄视你为眼中钉——你已是整个江湖的公敌。',
    once: true,
    condition: (k) => k <= -80,
  },
  // ── 装备耐久提示 ─────────────────────────────
  equip_dur_low: {
    icon: '⚠️',
    color: '#ffaa33',
    title: '装备耐久告急',
    content: '你的装备耐久已降至50%以下！\n\n装备属性正在衰减，请尽快找铁匠修理。\n耐久耗尽后，该装备的战斗加成将完全失效。',
    once: false, // 可以多次显示
    condition: () => {
      if (typeof edS === 'undefined' || !edS.bag) return false;
      return edS.bag.some(i => {
        if (i._dur === undefined || i._dur === null) return false;
        const max = (typeof getEquipMaxDur === 'function') ? getEquipMaxDur(i) : 100;
        return i._dur / max < 0.5;
      });
    },
  },
  // ── 赏金任务提示 ─────────────────────────────
  bounty_first: {
    icon: '📋',
    color: '#ffd060',
    title: '赏金榜开放！',
    content: '赏金榜已解锁！\n\n完成赏金任务可获得大量银两和经验，还能提升城市声望。\n每天零点自动刷新，优质委托不要错过。',
    once: true,
  },
  // ── 地下城提示 ───────────────────────────────
  dungeon_first: {
    icon: '🏰',
    color: '#c080f0',
    title: '险地入口开放',
    content: '你发现了地下城入口！\n\n地下城中藏着更强大的敌人和稀有宝物。\n挑战BOSS可获得真气，加速境界突破。但要做好充分准备再进入。',
    once: true,
  },
  // ── 门派提示 ──────────────────────────────────
  // 注：此提示不由 checkTips() 自动触发，改为在 _onSectTrialSuccess 中手动调用
  sect_join: {
    icon: '⚔️',
    color: '#60a8ff',
    title: '门派已加入',
    content: '你已成功加入门派！\n\n门派有专属功法商店和门派任务。\n门派比武可获得荣誉，荣誉可在门派商店兑换稀有物品。',
    once: true,
    condition: function(){ return false; }, // 禁止 checkTips() 自动触发
  },
  // ── 境界系统开放提示 ─────────────────────────
  realm_unlocked: {
    icon: '💠',
    color: '#88ddff',
    title: '境界系统已解锁',
    content: '境界突破功能已开放！\n\n在城镇状态栏可以看到你的当前境界和真气进度。\n参与战斗、修炼秘籍、闭关修炼都可以积累真气，真气满后突破到更高境界。',
    once: true,
  },
};

// 读取已显示过的提示
function _tipGetShown() {
  try {
    return JSON.parse(localStorage.getItem('wuxia_tips') || '{}');
  } catch {
    return {};
  }
}

function _tipMarkShown(key) {
  const shown = _tipGetShown();
  shown[key] = true;
  localStorage.setItem('wuxia_tips', JSON.stringify(shown));
}

// 检查并显示符合条件的提示
function checkTips() {
  if (typeof edS === 'undefined') return;
  const shown = _tipGetShown();

  for (const [key, tip] of Object.entries(TIPS_DB)) {
    if (tip.once && shown[key]) continue; // 已显示过且只显示一次

    // 条件检查
    if (tip.condition) {
      try {
        if (!tip.condition(edS.karma)) continue;
      } catch {
        continue;
      }
    }

    // 满足条件，显示提示
    showTip(key, tip);
    if (tip.once) _tipMarkShown(key);
    break; // 每次只显示一个提示
  }
}

// 显示单个提示（toast 风格）
function showTip(key, tip) {
  tip = tip || TIPS_DB[key];
  if (!tip) return;

  // 遵守 once 规则：已显示过则不再显示
  if (tip.once) {
    const shown = _tipGetShown();
    if (shown[key]) return;
  }

  if (typeof showToast === 'function') {
    const toastContent = `${tip.icon} ${tip.title}：${tip.content.split('\n')[0]}`;
    showToast(toastContent, 'info', 5000);
  }

  // 如果有详细描述，创建详情弹窗
  if (typeof renderTipDetail === 'function') {
    setTimeout(() => renderTipDetail(key), 500);
  }
}

// 显示提示详情弹窗
function renderTipDetail(key) {
  const tip = TIPS_DB[key];
  if (!tip) return;

  // 检查是否已存在
  if (document.getElementById('tip-detail-overlay')) return;

  const lines = tip.content.split('\n').map(l => {
    if (l.startsWith('•')) return `<div style="color:#c8d8c0;font-size:12px;line-height:1.7;padding-left:4px">${l}</div>`;
    return `<div style="color:#d0b090;font-size:12px;line-height:1.7">${l}</div>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.id = 'tip-detail-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:8899;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = `
    <div style="background:linear-gradient(180deg,rgba(8,12,20,.98),rgba(4,6,12,.99));border:1px solid ${tip.color}44;border-radius:12px;max-width:340px;width:100%;padding:20px;box-shadow:0 8px 40px rgba(0,0,0,.9)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="font-size:26px">${tip.icon}</span>
        <div>
          <div style="font-size:15px;color:${tip.color};font-weight:bold">${tip.title}</div>
          <div style="font-size:10px;color:${tip.color}88;letter-spacing:2px;margin-top:2px">提示</div>
        </div>
      </div>
      <div style="margin-bottom:18px">${lines}</div>
      <div style="display:flex;gap:8px;justify-content:center">
        <button onclick="closeTipDetail()" style="padding:7px 24px;border-radius:6px;border:1px solid ${tip.color}66;background:${tip.color}18;color:${tip.color};font-size:12px;cursor:pointer;font-weight:bold">知道了</button>
      </div>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeTipDetail(); });
  document.body.appendChild(overlay);
}

function closeTipDetail() {
  const el = document.getElementById('tip-detail-overlay');
  if (el) el.remove();
}

// 触发某类提示检查（供外部在关键时机调用）
function triggerTipCheck(category) {
  checkTips();
}

// ── 导出 ─────────────────────────────────────────────
window.checkTips        = checkTips;
window.showTip         = showTip;
window.renderTipDetail = renderTipDetail;
window.closeTipDetail  = closeTipDetail;
window.triggerTipCheck = triggerTipCheck;
window.TIPS_DB         = TIPS_DB;
