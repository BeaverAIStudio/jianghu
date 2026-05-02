/**
 * minigame-cardflip.js — 天机阁·翻牌鉴宝 v1.0
 *
 * 玩法：3×3 九宫格暗牌逐张翻，翻到煞牌全盘归零
 *   - 入场 50 两，每翻一张 +20 两
 *   - 翻越多 → 稀有度越高 → 但煞牌概率也涨
 *   - 气运(fate)属性影响避开煞牌的概率
 *   - 翻满 9 张保底 rare+ 装备
 */

/* ═══════════════════════════════════════════
   一、常量 & 数据
   ═══════════════════════════════════════════ */

const CF_VERSION = '1.0';
const CF_ENTRY_FEE = 50;       // 入场费
const CF_FLIP_COST = 20;       // 每翻一张追加费
const CF_GRID_SIZE = 9;        // 3×3

// 煞牌概率：翻第N张时触发煞牌的概率（不含第9张，翻满9张0%煞牌）
// 1-3张: 低风险，4-6张: 中风险，7-8张: 高风险
const CF_SHA_PROB = [0, 0.08, 0.10, 0.14, 0.18, 0.22, 0.28, 0.34, 0];

// 每阶段翻出的奖励稀有度权重
// 阶段1 (1-3): common/uncommon 为主
// 阶段2 (4-6): uncommon/rare
// 阶段3 (7-8): rare/epic
// 阶段4 (9):   epic/legendary 保底
const CF_REWARD_TIERS = {
  early:   { common:40, uncommon:35, rare:18, epic:5,  legendary:2  },  // 1-3
  mid:     { common:20, uncommon:30, rare:30, epic:15, legendary:5  },  // 4-6
  late:    { common:5,  uncommon:15, rare:35, epic:30, legendary:15 },  // 7-8
  finale:  { common:0,  uncommon:0,  rare:20, epic:50, legendary:30 },  // 9
};

// 奖励类型权重（每个阶段不同）
const CF_REWARD_TYPE = {
  early:   { silver:35, consumable:30, material:25, equip:10 },
  mid:     { silver:25, consumable:25, material:25, equip:25 },
  late:    { silver:15, consumable:20, material:25, equip:40 },
  finale:  { silver:10, consumable:10, material:10, equip:70 },
};

// 奖励类型下的具体物品池
const CF_CONSUMABLE_POOL = [
  { id:'potion_hp_s', name:'小还丹',   desc:'恢复气血50',  rarity:'common',    value:15 },
  { id:'potion_hp_m', name:'还丹',     desc:'恢复气血150', rarity:'uncommon',  value:40 },
  { id:'potion_mp_s', name:'聚气丹',   desc:'恢复内力50',  rarity:'common',    value:15 },
  { id:'potion_mp_m', name:'凝神丹',   desc:'恢复内力150', rarity:'uncommon',  value:40 },
  { id:'potion_cure', name:'解毒散',   desc:'解除中毒',    rarity:'common',    value:20 },
  { id:'pill_vigor',  name:'大力丸',   desc:'攻击+5 持续3场',rarity:'uncommon', value:50 },
  { id:'pill_iron',   name:'铁骨丹',   desc:'防御+5 持续3场',rarity:'uncommon', value:50 },
  { id:'elixir_qi',   name:'气海灵液', desc:'内力上限+10',  rarity:'rare',      value:120 },
  { id:'elixir_hp',   name:'血菩提',   desc:'气血上限+20',  rarity:'rare',      value:120 },
  { id:'pill_luck',   name:'天命丹',   desc:'气运+1',       rarity:'epic',      value:300 },
];

const CF_MATERIAL_POOL = [
  { id:'mat_iron',     name:'铁矿石',   rarity:'common',    value:8 },
  { id:'mat_copper',   name:'铜矿石',   rarity:'common',    value:10 },
  { id:'mat_silk',     name:'蚕丝',     rarity:'common',    value:12 },
  { id:'mat_herbs',    name:'草药',     rarity:'common',    value:10 },
  { id:'mat_steel',    name:'精钢',     rarity:'uncommon',  value:25 },
  { id:'mat_silver',   name:'银丝',     rarity:'uncommon',  value:30 },
  { id:'mat_jade',     name:'碧玉',     rarity:'rare',      value:80 },
  { id:'mat_crystal',  name:'冰晶石',   rarity:'rare',      value:80 },
  { id:'mat_dragon',   name:'龙鳞铁',   rarity:'epic',      value:200 },
  { id:'mat_phoenix',  name:'凤羽丝',   rarity:'epic',      value:200 },
];

// 银两奖励范围 [min, max]
const CF_SILVER_RANGES = {
  early:   [10, 30],
  mid:     [25, 60],
  late:    [40, 100],
  finale:  [80, 200],
};

// 煞牌字符画
const CF_SHA_ART = [
  '  ╭━━━━━╮  ',
  '  ┃☠   ☠┃  ',
  '  ┃  ✖  ┃  ',
  '  ┃煞 牌┃  ',
  '  ╰━━━━━╯  ',
];

// 卡背字符画
const CF_CARD_BACK = [
  '╔═══════╗',
  '║ ░░░░░ ║',
  '║ ░天░ ░ ║',
  '║ ░机░ ░ ║',
  '║ ░阁░ ░ ║',
  '║ ░░░░░ ║',
  '╚═══════╝',
];

// 天机阁掌柜字符画
const CF_KEEPER_ART = {
  name: '盲仙',
  title: '天机阁掌柜',
  color: '#b088e0',
  glowColor: 'rgba(176,136,224,0.5)',
  lines: [
    '     ╭━━━━━╮     ',
    '     ┃◈   ◈┃     ',
    '     ┃  △  ┃     ',
    '     ┃─────┃     ',
    '   ╭━┻━━━━━┻━╮   ',
    '   ┃  天·机·阁 ┃   ',
    '   ┃  知·天·命 ┃   ',
    '   ╰━┳━━━┳━━╯   ',
    '    ╭┻╮ ╭┻╮    ',
    '    ┃ ┃ ┃ ┃    ',
    '    ╰─╯ ╰─╯    ',
  ],
  quotes: [
    '「天机不可泄露……但银子可以。」',
    '「九牌之中，一念天堂，一念地狱。」',
    '「翻不翻？翻到煞牌可就一场空了。」',
    '「气运之人，自有天助。」',
    '「老朽眼盲，但看得见你的银两。」',
    '「最后一张无煞，这是规矩。」',
    '「翻满九张，必出珍品。你有这个胆量？」',
  ],
};

// 稀有度颜色表
const CF_RARITY_COLORS = {
  common:    { color:'#b0b0b0', glow:'rgba(176,176,176,0.3)',  label:'凡品', tag:'#8a8a8a' },
  uncommon:  { color:'#4ec94e', glow:'rgba(78,201,78,0.4)',    label:'良品', tag:'#3da53d' },
  rare:      { color:'#4ea8f5', glow:'rgba(78,168,245,0.4)',   label:'珍品', tag:'#3090d0' },
  epic:      { color:'#b060e0', glow:'rgba(176,96,224,0.4)',   label:'极品', tag:'#9050c0' },
  legendary: { color:'#f5a623', glow:'rgba(245,166,35,0.5)',   label:'神品', tag:'#d08010' },
};

/* ═══════════════════════════════════════════
   二、存档
   ═══════════════════════════════════════════ */

const CF_SAVE_KEY = 'wuxia_cardflip_data';
function _cfLoad() {
  try { return JSON.parse(localStorage.getItem(CF_SAVE_KEY)||'null')||{}; } catch(e) { return {}; }
}
function _cfSave(data) {
  try { localStorage.setItem(CF_SAVE_KEY, JSON.stringify(data)); } catch(e) {}
}

/* ═══════════════════════════════════════════
   三、工具函数
   ═══════════════════════════════════════════ */

function _cfPlayerSilver() {
  return getSilver();
}
function _cfAddSilver(delta) {
  addSilver(delta);
  SilverManager.save();
}
function _cfPlayerFate() {
  try {
    if (typeof edS !== 'undefined' && edS.primaryStats) return edS.primaryStats.fate || 0;
    if (typeof travelPlayerState !== 'undefined') return travelPlayerState.fate || 0;
  } catch(e) {}
  return 0;
}
function _cfPlayerName() {
  try { return (typeof edS!=='undefined'&&edS.name)?edS.name:'侠客'; } catch(e){ return '侠客'; }
}

// 按权重随机选一个key
function _cfWeightedPick(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((s,[,w])=>s+w, 0);
  let rnd = Math.random()*total;
  for (const [k,w] of entries) { rnd-=w; if(rnd<=0) return k; }
  return entries[entries.length-1][0];
}

// 获取当前阶段
function _cfGetTier(flipped) {
  if (flipped <= 3) return 'early';
  if (flipped <= 6) return 'mid';
  if (flipped <= 8) return 'late';
  return 'finale';
}

// 根据稀有度权重选一个稀有度
function _cfRollRarity(tier) {
  const weights = CF_REWARD_TIERS[tier];
  return _cfWeightedPick(weights);
}

// 选奖励类型
function _cfRollRewardType(tier) {
  const weights = CF_REWARD_TYPE[tier];
  return _cfWeightedPick(weights);
}

// 生成翻牌奖励
function _cfGenerateReward(flipped) {
  const tier = _cfGetTier(flipped);
  const rarity = _cfRollRarity(tier);
  const type = _cfRollRewardType(tier);

  switch(type) {
    case 'silver': {
      const [lo, hi] = CF_SILVER_RANGES[tier];
      // 高稀有度 = 更高额银两
      const mult = rarity==='epic'?2 : rarity==='legendary'?3.5 : rarity==='rare'?1.5 : 1;
      const amount = Math.round((lo + Math.floor(Math.random()*(hi-lo+1))) * mult);
      return { type:'silver', rarity, name:`${amount}两银子`, desc:`获得${amount}两`, amount, value:amount };
    }
    case 'consumable': {
      // 按稀有度筛选
      const pool = CF_CONSUMABLE_POOL.filter(c=>c.rarity===rarity);
      if (!pool.length) {
        // fallback：随机选一个不低于该稀有度的
        const fallback = CF_CONSUMABLE_POOL.filter(c=>{
          const order = ['common','uncommon','rare','epic'];
          return order.indexOf(c.rarity) <= order.indexOf(rarity);
        });
        const pick = fallback[Math.floor(Math.random()*fallback.length)] || CF_CONSUMABLE_POOL[0];
        return { type:'consumable', rarity:pick.rarity, name:pick.name, desc:pick.desc, itemId:pick.id, value:pick.value };
      }
      const pick = pool[Math.floor(Math.random()*pool.length)];
      return { type:'consumable', rarity, name:pick.name, desc:pick.desc, itemId:pick.id, value:pick.value };
    }
    case 'material': {
      const pool = CF_MATERIAL_POOL.filter(m=>m.rarity===rarity);
      if (!pool.length) {
        const fallback = CF_MATERIAL_POOL.filter(m=>{
          const order = ['common','uncommon','rare','epic'];
          return order.indexOf(m.rarity) <= order.indexOf(rarity);
        });
        const pick = fallback[Math.floor(Math.random()*fallback.length)] || CF_MATERIAL_POOL[0];
        return { type:'material', rarity:pick.rarity, name:pick.name, desc:'合成材料', itemId:pick.id, value:pick.value };
      }
      const pick = pool[Math.floor(Math.random()*pool.length)];
      return { type:'material', rarity, name:pick.name, desc:'合成材料', itemId:pick.id, value:pick.value };
    }
    case 'equip': {
      // 使用现有的 dropRandomEquip 但指定稀有度
      const equipType = Math.random()<0.6 ? 'weapon' : 'costume';
      return { type:'equip', rarity, name:'装备', desc: rarity==='legendary'?'传说装备':rarity==='epic'?'史诗装备':rarity==='rare'?'稀有装备':'精良装备', equipType, value:0 };
    }
  }
  return { type:'silver', rarity:'common', name:'1两银子', desc:'聊胜于无', amount:1, value:1 };
}

// 判定煞牌（含气运修正）
function _cfCheckSha(flipped) {
  const baseProb = CF_SHA_PROB[flipped] || 0;
  if (baseProb <= 0) return false;
  // 气运每点降低 2% 煞牌概率，最多降低一半
  const fate = _cfPlayerFate();
  const reduction = Math.min(fate * 0.02, baseProb * 0.5);
  const finalProb = Math.max(0, baseProb - reduction);
  return Math.random() < finalProb;
}

// 把奖励实际发给玩家
function _cfGrantReward(reward) {
  try {
    switch(reward.type) {
      case 'silver':
        _cfAddSilver(reward.amount);
        break;
      case 'consumable':
        // 写入消耗品背包
        if (typeof consumableBagAdd === 'function') {
          consumableBagAdd({ id:reward.itemId, name:reward.name, desc:reward.desc, icon:_cfItemIcon(reward.type) }, 1);
        } else {
          // fallback：给等价银两
          _cfAddSilver(reward.value || 10);
        }
        break;
      case 'material':
        // 写入合成材料背包
        if (typeof craftBagAdd === 'function') {
          craftBagAdd(reward.itemId, 1);
        } else if (typeof consumableBagAdd === 'function') {
          consumableBagAdd({ id:reward.itemId, name:reward.name, desc:reward.desc, icon:_cfItemIcon(reward.type) }, 1);
        } else {
          _cfAddSilver(reward.value || 10);
        }
        break;
      case 'equip':
        // 用 dropRandomEquip 生成装备实例并放入背包
        if (typeof dropRandomEquip === 'function' && typeof bagAddInst === 'function') {
          const inst = dropRandomEquip(reward.equipType);
          if (inst) {
            bagAddInst(inst);
            reward.name = inst.name || inst.templateId || '装备';
            reward.instId = inst.instId;
          }
        } else {
          // fallback：给银两
          _cfAddSilver(reward.value || 30);
        }
        break;
    }
  } catch(e) {
    console.warn('[CardFlip] grantReward error:', e);
    // fallback：给银两
    _cfAddSilver(reward.value || 10);
  }
}

// 物品图标
function _cfItemIcon(type) {
  return type==='consumable'?'💊':type==='material'?'💎':'📦';
}

// 生成9张牌的内容（含1张煞牌位置 + 8张奖励）
function _cfGenerateCards() {
  const cards = [];
  // 煞牌位置：1-8之间随机（第9张不可能是煞牌）
  const shaPos = Math.floor(Math.random()*8) + 1; // 1-8

  for (let i = 1; i <= 9; i++) {
    if (i === shaPos) {
      cards.push({ index:i, isSha:true, reward:null, flipped:false });
    } else {
      cards.push({ index:i, isSha:false, reward:_cfGenerateReward(i), flipped:false });
    }
  }
  return cards;
}

/* ═══════════════════════════════════════════
   四、游戏状态
   ═══════════════════════════════════════════ */

let _cfState = null; // 当前游戏会话

function _cfNewGame() {
  _cfState = {
    cards: _cfGenerateCards(),
    flipped: 0,           // 已翻牌数
    totalCost: CF_ENTRY_FEE, // 累计花费
    rewards: [],           // 已获得的奖励
    gameOver: false,       // 是否结束（煞牌或全翻完）
    result: null,          // 'sha' | 'complete'
  };
}

/* ═══════════════════════════════════════════
   五、主界面渲染
   ═══════════════════════════════════════════ */

function _cfRenderMain() {
  const panel = document.getElementById('cardflipPanel');
  if (!panel || !_cfState) return;

  const silver = _cfPlayerSilver();
  const quote = CF_KEEPER_ART.quotes[Math.floor(Math.random()*CF_KEEPER_ART.quotes.length)];

  let rewardListHtml = _cfState.rewards.map(r => {
    const rc = CF_RARITY_COLORS[r.rarity] || CF_RARITY_COLORS.common;
    const typeIcon = r.type==='silver'?'🪙':r.type==='consumable'?'💊':r.type==='material'?'💎':'⚔';
    return `<div class="cf-reward-item" style="border-color:${rc.tag};">
      <span class="cf-reward-icon">${typeIcon}</span>
      <span class="cf-reward-name" style="color:${rc.color};">${r.name}</span>
      <span class="cf-reward-rarity" style="color:${rc.tag};">${rc.label}</span>
    </div>`;
  }).join('');

  // 卡牌网格
  let gridHtml = _cfState.cards.map((card, idx) => {
    if (card.flipped) {
      if (card.isSha) {
        return `<div class="cf-card cf-card-sha">${CF_SHA_ART.map(l=>`<div>${l}</div>`).join('')}</div>`;
      } else {
        const rc = CF_RARITY_COLORS[card.reward.rarity] || CF_RARITY_COLORS.common;
        const typeIcon = card.reward.type==='silver'?'🪙':card.reward.type==='consumable'?'💊':card.reward.type==='material'?'💎':'⚔';
        return `<div class="cf-card cf-card-flipped" style="border-color:${rc.color};box-shadow:0 0 12px ${rc.glow};">
          <div class="cf-card-icon">${typeIcon}</div>
          <div class="cf-card-name" style="color:${rc.color};">${card.reward.name}</div>
          <div class="cf-card-rarity" style="color:${rc.tag};">${rc.label}</div>
        </div>`;
      }
    } else {
      const nextCost = _cfState.flipped === 0 ? 0 : CF_FLIP_COST;
      const canAfford = silver >= nextCost;
      const clickable = !_cfState.gameOver && canAfford;
      return `<div class="cf-card cf-card-back ${clickable?'cf-card-clickable':''}" 
        ${clickable?`onclick="cfFlipCard(${idx})"`:''}>
        ${CF_CARD_BACK.map(l=>`<div>${l}</div>`).join('')}
      </div>`;
    }
  }).join('');

  // 状态信息
  const nextCost = _cfState.flipped === 0 ? 0 : CF_FLIP_COST;
  const canFlip = !_cfState.gameOver && silver >= nextCost;
  const shaProb = _cfState.flipped < 9 ? Math.round((CF_SHA_PROB[_cfState.flipped+1]||0)*100) : 0;
  const fate = _cfPlayerFate();
  const adjShaProb = shaProb > 0 ? Math.max(0, shaProb - Math.round(Math.min(fate*2, shaProb*0.5))) : 0;

  // 结果横幅
  let resultHtml = '';
  if (_cfState.result === 'sha') {
    resultHtml = `<div class="cf-result-banner cf-result-sha">
      <div class="cf-result-big">💀 煞牌！</div>
      <div class="cf-result-sub">天意如此，所获皆空……</div>
    </div>`;
  } else if (_cfState.result === 'complete') {
    resultHtml = `<div class="cf-result-banner cf-result-complete">
      <div class="cf-result-big">🎊 九牌全翻！</div>
      <div class="cf-result-sub">天命所归，宝物尽收！</div>
    </div>`;
  }

  panel.innerHTML = `
<div class="cf-overlay" id="cfOverlay">
  <!-- 流光背景 -->
  <div class="cf-bg-shimmer"></div>
  <!-- 背景粒子 -->
  <div class="cf-particle-layer" id="cfParticleLayer"></div>

  <div class="cf-main" id="cfMain">
    <!-- 顶部标题栏 -->
    <div class="cf-header">
      <div class="cf-header-top">
        <div class="cf-title-wrap">
          <span class="cf-title-deco">✦</span>
          <span class="cf-title">🎴 天机阁</span>
          <span class="cf-title-deco">✦</span>
        </div>
        <button class="cf-close-btn" onclick="closeCardFlipGame()">✕</button>
      </div>
      <div class="cf-subtitle">九牌藏宝，一煞归空 · 翻满九张必出珍品</div>
    </div>

    <div class="cf-body">
      <!-- 左侧：掌柜 + 信息 -->
      <div class="cf-left">
        <div class="cf-keeper-wrap">
          <div class="cf-keeper-art" style="color:${CF_KEEPER_ART.color};--glow:${CF_KEEPER_ART.glowColor};">
            ${CF_KEEPER_ART.lines.map(l=>`<div>${l}</div>`).join('')}
          </div>
          <div class="cf-keeper-name" style="color:${CF_KEEPER_ART.color};">${CF_KEEPER_ART.name}</div>
          <div class="cf-keeper-title">${CF_KEEPER_ART.title}</div>
          <div class="cf-keeper-quote">${quote}</div>
        </div>

        <div class="cf-stats">
          <div class="cf-stat-row">
            <span class="cf-stat-label">身上银两</span>
            <span class="cf-stat-val cf-silver">🪙 ${silver}</span>
          </div>
          <div class="cf-stat-row">
            <span class="cf-stat-label">已翻牌数</span>
            <span class="cf-stat-val">${_cfState.flipped} / 9</span>
          </div>
          <div class="cf-stat-row">
            <span class="cf-stat-label">累计花费</span>
            <span class="cf-stat-val cf-neg">${_cfState.totalCost} 两</span>
          </div>
          <div class="cf-stat-row">
            <span class="cf-stat-label">气运</span>
            <span class="cf-stat-val" style="color:#e0c060;">✦ ${fate}</span>
          </div>
          ${shaProb > 0 ? `
          <div class="cf-stat-row cf-stat-sha">
            <span class="cf-stat-label">煞牌概率</span>
            <span class="cf-stat-val cf-sha-color">${adjShaProb}%</span>
          </div>` : ''}
        </div>

        <!-- 已获奖励 -->
        ${_cfState.rewards.length > 0 ? `
        <div class="cf-reward-section">
          <div class="cf-reward-title">已获宝物</div>
          <div class="cf-reward-list">${rewardListHtml}</div>
        </div>` : ''}
      </div>

      <!-- 右侧：卡牌区 -->
      <div class="cf-right">
        ${resultHtml}
        <div class="cf-grid">${gridHtml}</div>

        ${!_cfState.gameOver ? `
        <div class="cf-action-section">
          ${_cfState.flipped === 0 ? `
            <button class="cf-start-btn" onclick="cfStartFlip()" ${silver<CF_ENTRY_FEE?'disabled':''}>
              🎴 入场翻牌（${CF_ENTRY_FEE}两）
            </button>
            ${silver<CF_ENTRY_FEE?'<div class="cf-broke-hint">💸 银两不足</div>':''}
            <button class="cf-leave-btn" onclick="closeCardFlipGame()">离开天机阁</button>
          ` : `
            <div class="cf-flip-info">
              下一张翻牌费：<strong>${CF_FLIP_COST}两</strong>
              ${shaProb>0?`｜煞牌概率：<span class="cf-sha-color">${adjShaProb}%</span>`:'｜<span style="color:#4ec94e;">煞牌已过，安心翻牌</span>'}
            </div>
            <div class="cf-btn-row">
              <button class="cf-flip-btn" onclick="cfContinueFlip()" ${!canFlip?'disabled':''}>
                🎴 继续翻牌
              </button>
              <button class="cf-cashout-btn" onclick="cfCashOut()">
                💰 收手离开
              </button>
            </div>
            ${!canFlip&&silver<nextCost?'<div class="cf-broke-hint">💸 银两不足继续翻牌</div>':''}
          `}
        </div>` : `
        <div class="cf-action-section">
          <div class="cf-btn-row">
            <button class="cf-restart-btn" onclick="cfRestart()">
              🎴 再来一局
            </button>
            <button class="cf-cashout-btn" onclick="closeCardFlipGame()">
              离开天机阁
            </button>
          </div>
        </div>`}
      </div>
    </div>
  </div>
</div>`;

  // 启动背景粒子
  _cfStartAmbientParticles();
}

/* ═══════════════════════════════════════════
   六、游戏逻辑
   ═══════════════════════════════════════════ */

// 开始翻第一张（扣入场费）
function cfStartFlip() {
  if (!_cfState) return;
  const silver = _cfPlayerSilver();
  if (silver < CF_ENTRY_FEE) { _cfShowToast('银两不足！'); return; }
  _cfAddSilver(-CF_ENTRY_FEE);
  if(typeof SoundFX!=='undefined') SoundFX.play('dice_bet');

  // 翻第一张
  _cfDoFlip(0);
}

// 继续翻牌（扣追加费）
function cfContinueFlip() {
  if (!_cfState || _cfState.gameOver) return;
  const silver = _cfPlayerSilver();
  if (silver < CF_FLIP_COST) { _cfShowToast('银两不足！'); return; }
  _cfAddSilver(-CF_FLIP_COST);
  _cfState.totalCost += CF_FLIP_COST;
  if(typeof SoundFX!=='undefined') SoundFX.play('dice_bet');

  // 找到下一张未翻的牌
  const nextIdx = _cfState.cards.findIndex(c => !c.flipped);
  if (nextIdx === -1) return;
  _cfDoFlip(nextIdx);
}

// 收手离开（保留已获奖励）
function cfCashOut() {
  if (!_cfState) return;
  // 奖励已经即时发放了，直接标记结束
  _cfState.gameOver = true;
  _cfState.result = 'cashout';

  if(typeof SoundFX!=='undefined') SoundFX.play('dice_win');
  _cfShowToast(`收手！获得${_cfState.rewards.length}件宝物`);

  // 成就
  if(typeof achOnCardFlip === 'function') achOnCardFlip('cashout', _cfState.rewards);

  _cfRenderMain();
}

// 执行翻牌
function _cfDoFlip(idx) {
  const card = _cfState.cards[idx];
  if (!card || card.flipped || _cfState.gameOver) return;

  _cfState.flipped++;
  card.flipped = true;

  // ═══════════════════════════════════════════════
  // 天机阁"将将胡"系统
  // ═══════════════════════════════════════════════
  const luckRoll = Math.random();
  let specialEvent = null;
  
  // 2%概率：记忆闪现（自动揭示下一张是否为煞牌）
  if(luckRoll < 0.02){
    specialEvent = 'memory_flash';
  }
  // 3%概率：机关陷阱（翻到假煞牌，损失当前回合费用但不结束游戏）
  else if(luckRoll < 0.05){
    specialEvent = 'fake_sha';
  }
  // 1%概率：宝藏房（该牌奖励品质自动+1级）
  else if(luckRoll < 0.06){
    specialEvent = 'treasure_room';
  }
  
  // ═══════════════════════════════════════════════
  // 天机阁"将将胡"恶搞事件（5%总概率）
  // ═══════════════════════════════════════════════
  const gagRoll = Math.random();
  if (gagRoll < 0.05 && !specialEvent) {
    const gagEvents = ['keeper_prank', 'twin_cards', 'swap_positions', 'god_of_wealth', 'bad_luck', 'x_ray_eyes'];
    specialEvent = gagEvents[Math.floor(Math.random() * gagEvents.length)];
    
    const gagMessages = {
      keeper_prank: { title: '😈 掌柜恶作剧！', msg: '盲仙坏笑："吓到了吧？这不是煞牌~"', type: 'rare' },
      twin_cards: { title: '👯 双胞胎牌！', msg: '两张牌长得一模一样！奖励翻倍！', type: 'rare' },
      swap_positions: { title: '🔄 乾坤大挪移！', msg: '牌的位置突然交换了！', type: 'warning' },
      god_of_wealth: { title: '💰 财神附体！', msg: '财神爷路过，随手撒了点银子！', type: 'legendary' },
      bad_luck: { title: '😰 霉运当头！', msg: '你今天踩到狗屎了吗？煞牌概率翻倍！', type: 'warning' },
      x_ray_eyes: { title: '👁️ 透视眼！', msg: '你突然能看穿所有牌了！（虽然只有一秒）', type: 'rare' }
    };
    
    const gagMsg = gagMessages[specialEvent];
    _cfShowToast(gagMsg.title + ' ' + gagMsg.msg);
    
    // 恶搞事件特殊效果
    if (specialEvent === 'swap_positions') {
      // 乾坤大挪移：交换两张未翻牌的位置
      _cfSwapCardPositions();
    } else if (specialEvent === 'bad_luck') {
      // 霉运当头：煞牌概率临时翻倍
      _cfState._badLuckActive = true;
    } else if (specialEvent === 'god_of_wealth') {
      // 财神附体：直接给银两
      const bonusSilver = 50 + Math.floor(Math.random() * 100);
      _cfAddSilver(bonusSilver);
    }
  }

  // 先判断煞牌
  if (card.isSha && _cfCheckSha(_cfState.flipped)) {
    // 机关陷阱：假煞牌，只损失费用不结束
    if(specialEvent === 'fake_sha'){
      _cfShowToast('⚠️ 机关陷阱！幸好只是虚惊一场！');
      if(typeof SoundFX!=='undefined') SoundFX.play('dice_land');
      // 生成一个安慰奖
      card.reward = _cfGenerateReward(Math.max(1, _cfState.flipped - 1));
      const reward = card.reward;
      if (reward) {
        _cfGrantReward(reward);
        _cfState.rewards.push(reward);
      }
      _cfRenderMain();
      return;
    }
    
    // 触发煞牌！
    _cfState.gameOver = true;
    _cfState.result = 'sha';
    if(typeof SoundFX!=='undefined') SoundFX.play('dice_lose');
    _cfSpawnShaExplosion();

    // 扣回所有已发奖励（银两扣回，物品从背包移除）
    _cfRevokeAllRewards();

    if(typeof achOnCardFlip === 'function') achOnCardFlip('sha', _cfState.rewards);
    _cfRenderMain();
    return;
  }

  // 煞牌被气运避开 → 变成空牌
  if (card.isSha && !_cfCheckSha(_cfState.flipped)) {
    // 虽然是煞牌但气运躲过了，变成普通奖励
    card.isSha = false;
    card.reward = _cfGenerateReward(_cfState.flipped);
    _cfShowToast('✦ 气运护体，煞牌化宝！');
    if(typeof SoundFX!=='undefined') SoundFX.play('dice_big');
  }

  // 宝藏房：奖励品质+1
  if(specialEvent === 'treasure_room' && card.reward){
    const rarityUp = { common:'uncommon', uncommon:'rare', rare:'epic', epic:'legendary', legendary:'legendary' };
    const newRarity = rarityUp[card.reward.rarity] || card.reward.rarity;
    if(newRarity !== card.reward.rarity){
      card.reward.rarity = newRarity;
      card.reward.value = Math.round(card.reward.value * 1.5);
      _cfShowToast('💎 宝藏房！奖励品质提升！');
      if(typeof SoundFX!=='undefined') SoundFX.play('dice_big');
    }
  }

  // 发放奖励
  const reward = card.reward;
  if (reward) {
    _cfGrantReward(reward);
    _cfState.rewards.push(reward);
    if(typeof SoundFX!=='undefined') SoundFX.play('dice_land');
  }

  // 记忆闪现：揭示下一张
  if(specialEvent === 'memory_flash'){
    const nextIdx = _cfState.cards.findIndex(c => !c.flipped);
    if(nextIdx !== -1){
      const nextCard = _cfState.cards[nextIdx];
      if(nextCard.isSha){
        _cfShowToast('🔮 记忆闪现！下一张是煞牌！小心！');
      } else {
        _cfShowToast('🔮 记忆闪现！下一张安全！');
      }
    }
  }

  // 检查是否翻满9张
  if (_cfState.flipped >= 9) {
    _cfState.gameOver = true;
    _cfState.result = 'complete';
    if(typeof SoundFX!=='undefined') SoundFX.play('dice_big');
    _cfSpawnCompleteCelebration();
    if(typeof achOnCardFlip === 'function') achOnCardFlip('complete', _cfState.rewards);
  }

  _cfRenderMain();
}

// 翻指定位置的牌（从卡背点击）
function cfFlipCard(idx) {
  if (!_cfState || _cfState.gameOver) return;
  const card = _cfState.cards[idx];
  if (card.flipped) return;

  if (_cfState.flipped === 0) {
    cfStartFlip();
  } else {
    cfContinueFlip();
  }
}

// 扣回所有奖励（煞牌惩罚）
function _cfRevokeAllRewards() {
  for (const r of _cfState.rewards) {
    try {
      switch(r.type) {
        case 'silver':
          _cfAddSilver(-r.amount);
          break;
        case 'consumable':
          if (typeof consumableBagConsume === 'function') {
            consumableBagConsume(r.itemId, 1);
          } else {
            // 无法精确扣回，扣等价银两
            _cfAddSilver(-(r.value || 10));
          }
          break;
        case 'material':
          if (typeof craftBagConsume === 'function') {
            craftBagConsume(r.itemId, 1);
          } else if (typeof consumableBagConsume === 'function') {
            consumableBagConsume(r.itemId, 1);
          } else {
            _cfAddSilver(-(r.value || 10));
          }
          break;
        case 'equip':
          if (r.instId && typeof bagRemoveInst === 'function') {
            bagRemoveInst(r.instId);
          } else {
            _cfAddSilver(-(r.value || 30));
          }
          break;
      }
    } catch(e) {
      console.warn('[CardFlip] revokeReward error:', e);
    }
  }
  _cfState.rewards = [];
}

// 重新开始
function cfRestart() {
  if (_cfAmbientTimer) { clearInterval(_cfAmbientTimer); _cfAmbientTimer=null; }
  _cfNewGame();
  _cfRenderMain();
}

// ═══════════════════════════════════════════════
// 天机阁"将将胡"恶搞事件辅助函数
// ═══════════════════════════════════════════════

// 乾坤大挪移：交换两张未翻牌的位置
function _cfSwapCardPositions() {
  const unflipped = _cfState.cards.map((c, i) => ({ card: c, idx: i })).filter(x => !x.card.flipped);
  if (unflipped.length >= 2) {
    // 随机选两张交换
    const idx1 = Math.floor(Math.random() * unflipped.length);
    let idx2 = Math.floor(Math.random() * unflipped.length);
    while (idx2 === idx1) idx2 = Math.floor(Math.random() * unflipped.length);
    
    const pos1 = unflipped[idx1].idx;
    const pos2 = unflipped[idx2].idx;
    
    // 交换卡片数据
    const temp = _cfState.cards[pos1];
    _cfState.cards[pos1] = _cfState.cards[pos2];
    _cfState.cards[pos2] = temp;
    
    // 更新index
    _cfState.cards[pos1].index = pos1 + 1;
    _cfState.cards[pos2].index = pos2 + 1;
  }
}

/* ═══════════════════════════════════════════
   七、粒子特效
   ═══════════════════════════════════════════ */

let _cfAmbientTimer = null;
let _cfAmbientPool = [];
const _CF_MAX_PARTICLES = 12;

function _cfStartAmbientParticles() {
  if (_cfAmbientTimer) clearInterval(_cfAmbientTimer);
  _cfAmbientTimer = setInterval(()=>{
    const layer = document.getElementById('cfParticleLayer');
    if (!layer) { clearInterval(_cfAmbientTimer); return; }
    
    if (_cfAmbientPool.length >= _CF_MAX_PARTICLES) {
      const old = _cfAmbientPool.shift();
      if (old && old.parentNode) old.remove();
    }
    
    const el = document.createElement('span');
    el.className = 'cf-ambient';
    el.textContent = Math.random()<0.5?'✦':'⊹';
    el.style.cssText=`left:${Math.random()*100}%;animation-duration:${4+Math.random()*5}s;font-size:${0.5+Math.random()*0.5}em;`;
    layer.appendChild(el);
    _cfAmbientPool.push(el);
    
    setTimeout(()=>{
      const idx = _cfAmbientPool.indexOf(el);
      if(idx > -1) _cfAmbientPool.splice(idx, 1);
      if(el.parentNode) el.remove();
    }, 10000);
  }, 900);
}

function _cfStopAmbientParticles() {
  if (_cfAmbientTimer) {
    clearInterval(_cfAmbientTimer);
    _cfAmbientTimer = null;
  }
  _cfAmbientPool.forEach(el => { if(el.parentNode) el.remove(); });
  _cfAmbientPool = [];
}

function _cfSpawnShaExplosion() {
  const overlay = document.getElementById('cfOverlay');
  if (!overlay) return;
  const emojis = ['💀','☠','⚔','🔥','💥','👁','🩸'];
  for (let i = 0; i < 25; i++) {
    setTimeout(()=>{
      const el = document.createElement('div');
      el.className = 'cf-explosion-particle';
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      const angle = Math.random()*360;
      const dist = 60 + Math.random()*180;
      el.style.cssText = `left:50%;top:50%;font-size:${1+Math.random()*1.2}em;--angle:${angle}deg;--dist:${dist}px;animation-duration:${0.8+Math.random()*0.8}s;`;
      overlay.appendChild(el);
      setTimeout(()=>el.remove(), 2000);
    }, i*25);
  }
  // 震屏
  const main = document.querySelector('.cf-main');
  if (main) { main.style.animation='cf-shake-heavy 0.5s ease-out'; setTimeout(()=>{main.style.animation='';},600); }
}

function _cfSpawnCompleteCelebration() {
  const overlay = document.getElementById('cfOverlay');
  if (!overlay) return;
  const emojis = ['🎊','🎉','✨','🌟','⭐','💫','🏆','👑','🪙'];
  for (let i = 0; i < 40; i++) {
    setTimeout(()=>{
      const el = document.createElement('div');
      el.className = 'cf-explosion-particle';
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      const angle = Math.random()*360;
      const dist = 80 + Math.random()*200;
      el.style.cssText = `left:50%;top:50%;font-size:${1+Math.random()*1.5}em;--angle:${angle}deg;--dist:${dist}px;animation-duration:${1+Math.random()*1}s;`;
      overlay.appendChild(el);
      setTimeout(()=>el.remove(), 2500);
    }, i*30);
  }
  // 金币雨
  for (let i = 0; i < 20; i++) {
    setTimeout(()=>{
      const el = document.createElement('div');
      el.className = 'cf-coin-rain';
      el.textContent = '🪙';
      el.style.cssText = `left:${Math.random()*100}%;animation-duration:${1.5+Math.random()*1.5}s;font-size:${0.8+Math.random()*0.8}em;`;
      overlay.appendChild(el);
      setTimeout(()=>el.remove(), 3500);
    }, i*50);
  }
}

/* ═══════════════════════════════════════════
   八、CSS 样式
   ═══════════════════════════════════════════ */

function _cfGetStyles() {
  return `<style id="cfStyles">
/* ── 全屏遮罩 ── */
.cf-overlay {
  position:fixed;inset:0;z-index:3000;
  background:linear-gradient(160deg,#08001a 0%,#120028 35%,#0a001e 70%,#040010 100%);
  display:flex;justify-content:center;align-items:flex-start;
  padding:10px 0;
  overflow-y:auto;-webkit-overflow-scrolling:touch;
  font-family:'Courier New','Noto Sans SC',monospace;
}

/* ── 流光背景 ── */
.cf-bg-shimmer {
  position:absolute;inset:0;pointer-events:none;overflow:hidden;
  background:repeating-linear-gradient(
    -45deg,
    transparent 0px, transparent 40px,
    rgba(120,60,200,0.03) 40px, rgba(120,60,200,0.03) 80px
  );
  animation:cf-shimmer-move 10s linear infinite;
}
@keyframes cf-shimmer-move {
  from{background-position:0 0}
  to{background-position:160px 160px}
}

/* ── 粒子层 ── */
.cf-particle-layer {
  position:absolute;inset:0;pointer-events:none;overflow:hidden;
}
.cf-ambient {
  position:absolute;top:-20px;
  animation:cf-ambient-fall linear forwards;
  opacity:0.35;pointer-events:none;color:#b088e0;
}
@keyframes cf-ambient-fall {
  0%{top:-20px;opacity:0.4;transform:translateX(0) rotate(0deg);}
  100%{top:110%;opacity:0;transform:translateX(calc(-30px + 60px * var(--r,0.5))) rotate(360deg);}
}

/* ── 主容器 ── */
.cf-main {
  width:min(96vw,900px);
  background:
    radial-gradient(ellipse at 20% 20%, rgba(80,20,140,0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(40,10,80,0.3) 0%, transparent 50%),
    linear-gradient(160deg,#140030 0%,#1e0050 50%,#0e0020 100%);
  border:2px solid #7040a0;
  border-radius:14px;
  box-shadow:
    0 0 60px rgba(120,60,200,0.4),
    0 0 120px rgba(80,30,140,0.2),
    inset 0 0 80px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(180,120,240,0.15);
  overflow:visible;position:relative;
}

/* ── 顶部标题 ── */
.cf-header {
  background:linear-gradient(90deg,#200050,#401080,#5020a0,#401080,#200050);
  padding:10px 12px 10px;text-align:center;
  border-bottom:2px solid rgba(160,100,220,0.5);
  position:relative;box-shadow:0 4px 20px rgba(0,0,0,0.5);
}
.cf-header-top{display:flex;align-items:center;justify-content:center;position:relative;}
.cf-title-wrap{display:flex;align-items:center;justify-content:center;gap:12px;}
.cf-title-deco{color:#d0a0ff;font-size:1em;animation:cf-glow 2s ease-in-out infinite;}
.cf-title{font-size:1.2em;font-weight:bold;color:#d0a0ff;text-shadow:0 0 15px rgba(208,160,255,0.8);letter-spacing:0.08em;white-space:nowrap;}
.cf-subtitle{font-size:0.78em;color:#a080c0;margin-top:6px;opacity:0.85;}
.cf-close-btn{position:absolute;right:0;top:50%;transform:translateY(-50%);background:linear-gradient(135deg,rgba(120,30,160,0.8),rgba(80,20,120,0.8));border:1px solid #b060e0;color:#e0c0ff;border-radius:8px;width:36px;height:36px;cursor:pointer;font-size:1.1em;font-weight:bold;transition:all 0.2s;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.5);}
.cf-close-btn:hover{background:rgba(200,60,255,0.6);box-shadow:0 0 12px rgba(160,80,220,0.5);}
.cf-leave-btn{background:rgba(60,20,80,0.5);border:1px solid #604080;color:#a080c0;border-radius:8px;padding:8px 18px;cursor:pointer;font-size:0.85em;margin-top:8px;transition:all 0.2s;}
.cf-leave-btn:hover{background:rgba(100,40,140,0.5);color:#d0a0ff;}

/* ── Body ── */
.cf-body{display:flex;gap:0;min-height:480px;}

/* ── 左栏 ── */
.cf-left{
  width:180px;min-width:160px;
  background:linear-gradient(180deg,rgba(15,5,30,0.7),rgba(8,2,18,0.8));
  border-right:1px solid rgba(120,60,180,0.35);
  padding:14px 10px;
  display:flex;flex-direction:column;align-items:center;gap:10px;
  overflow-y:auto;
}
.cf-keeper-wrap{text-align:center;width:100%;}
.cf-keeper-art{font-size:0.68em;line-height:1.3;font-family:'Courier New',monospace;white-space:pre;text-shadow:0 0 8px var(--glow,rgba(176,136,224,0.5));animation:cf-keeper-idle 5s ease-in-out infinite;}
@keyframes cf-keeper-idle{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}
.cf-keeper-name{font-size:0.78em;font-weight:bold;margin-top:6px;color:#b088e0;}
.cf-keeper-title{font-size:0.68em;color:#8060a0;margin-top:1px;}
.cf-keeper-quote{font-size:0.66em;color:#9070b0;text-align:center;font-style:italic;padding:5px 4px;border:1px solid rgba(120,60,180,0.3);border-radius:4px;background:rgba(0,0,0,0.35);line-height:1.5;margin-top:4px;}

/* ── 统计 ── */
.cf-stats{width:100%;background:rgba(0,0,0,0.3);border-radius:6px;padding:7px 8px;}
.cf-stat-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:0.7em;}
.cf-stat-label{color:#8060a0;}
.cf-stat-val{font-weight:bold;color:#d0c0e0;}
.cf-silver{color:#f5c842;}
.cf-neg{color:#ff7070;}
.cf-sha-color{color:#ff4060;text-shadow:0 0 6px rgba(255,64,96,0.5);}
.cf-stat-sha{border-top:1px solid rgba(255,64,96,0.2);padding-top:4px;margin-top:4px;}

/* ── 已获奖励 ── */
.cf-reward-section{width:100%;margin-top:6px;}
.cf-reward-title{font-size:0.72em;color:#b088e0;font-weight:bold;margin-bottom:5px;}
.cf-reward-list{display:flex;flex-direction:column;gap:3px;max-height:180px;overflow-y:auto;}
.cf-reward-item{display:flex;align-items:center;gap:4px;font-size:0.68em;padding:3px 5px;border-radius:4px;border-left:3px solid;background:rgba(0,0,0,0.3);}
.cf-reward-icon{font-size:1em;}
.cf-reward-name{flex:1;}
.cf-reward-rarity{font-size:0.85em;}

/* ── 右栏 ── */
.cf-right{flex:1;padding:16px;display:flex;flex-direction:column;align-items:center;gap:12px;background:radial-gradient(ellipse at 50% 0%,rgba(60,20,100,0.4),transparent 60%),rgba(10,4,20,0.45);}

/* ── 卡牌网格 ── */
.cf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:min(100%,400px);margin:0 auto;}

/* ── 单张卡牌 ── */
.cf-card{
  aspect-ratio:0.72;
  border-radius:10px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-family:'Courier New',monospace;
  transition:all 0.25s;
  position:relative;
  padding:6px;
}

/* ── 卡背 ── */
.cf-card-back{
  background:linear-gradient(160deg,#1a0040,#2a1060,#1a0040);
  border:2px solid #6040a0;
  color:#9070c0;font-size:0.72em;line-height:1.3;
  white-space:pre;text-align:center;
  box-shadow:0 2px 10px rgba(0,0,0,0.4),inset 0 0 20px rgba(80,40,140,0.15);
}
.cf-card-back::after{
  content:'';position:absolute;inset:3px;border-radius:7px;
  border:1px solid rgba(160,120,220,0.2);pointer-events:none;
}
.cf-card-clickable{cursor:pointer;border-color:#9060d0;}
.cf-card-clickable:hover{
  border-color:#c090f0;transform:translateY(-4px);
  box-shadow:0 6px 20px rgba(120,60,200,0.5),0 0 15px rgba(160,100,240,0.3);
}
.cf-card-clickable:active{transform:translateY(-1px);}

/* ── 翻开的牌 ── */
.cf-card-flipped{
  background:linear-gradient(160deg,#0e0030,#180040);
  border:2px solid;
  animation:cf-flip-in 0.4s cubic-bezier(0.34,1.56,0.64,1);
  text-align:center;
}
@keyframes cf-flip-in{from{transform:scale(0.5) rotateY(90deg);opacity:0;}to{transform:scale(1) rotateY(0);opacity:1;}}
.cf-card-icon{font-size:1.6em;margin-bottom:2px;}
.cf-card-name{font-size:0.72em;font-weight:bold;margin-bottom:2px;word-break:break-all;}
.cf-card-rarity{font-size:0.62em;}

/* ── 煞牌 ── */
.cf-card-sha{
  background:linear-gradient(160deg,#300010,#400015,#300010);
  border:2px solid #ff4060;
  color:#ff4060;font-size:0.62em;line-height:1.3;
  white-space:pre;text-align:center;
  box-shadow:0 0 20px rgba(255,64,96,0.4),inset 0 0 20px rgba(255,0,30,0.15);
  animation:cf-sha-in 0.5s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes cf-sha-in{from{transform:scale(0.3) rotate(180deg);opacity:0;}to{transform:scale(1) rotate(0);opacity:1;}}

/* ── 操作区 ── */
.cf-action-section{width:100%;text-align:center;margin-top:8px;}
.cf-start-btn{
  padding:12px 32px;border-radius:10px;cursor:pointer;font-size:1em;
  background:linear-gradient(135deg,#4010a0,#6020c0);
  border:2px solid #9060e0;color:#e0c0ff;font-weight:bold;
  transition:all 0.25s;letter-spacing:0.05em;
  box-shadow:0 4px 15px rgba(80,30,160,0.4);
}
.cf-start-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 8px 25px rgba(100,40,180,0.6);border-color:#b080f0;}
.cf-start-btn:disabled{opacity:0.4;cursor:not-allowed;}

.cf-flip-info{font-size:0.78em;color:#b090d0;margin-bottom:8px;}
.cf-btn-row{display:flex;gap:10px;justify-content:center;}

.cf-flip-btn{
  padding:10px 22px;border-radius:8px;cursor:pointer;font-size:0.88em;
  background:linear-gradient(135deg,#4010a0,#6020c0);
  border:2px solid #9060e0;color:#e0c0ff;font-weight:bold;
  transition:all 0.2s;
  box-shadow:0 4px 12px rgba(80,30,160,0.3);
}
.cf-flip-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 18px rgba(100,40,180,0.5);}
.cf-flip-btn:disabled{opacity:0.35;cursor:not-allowed;}

.cf-cashout-btn{
  padding:10px 22px;border-radius:8px;cursor:pointer;font-size:0.88em;
  background:rgba(60,30,80,0.5);border:1px solid #6040a0;color:#b090d0;
  transition:all 0.2s;
}
.cf-cashout-btn:hover{background:rgba(80,40,100,0.6);color:#d0b0f0;transform:scale(1.03);}

.cf-restart-btn{
  padding:12px 28px;border-radius:8px;cursor:pointer;font-size:0.92em;
  background:linear-gradient(135deg,#4010a0,#6020c0);
  border:2px solid #9060e0;color:#e0c0ff;font-weight:bold;
  transition:all 0.2s;
  box-shadow:0 4px 12px rgba(80,30,160,0.3);
}
.cf-restart-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(100,40,180,0.5);}

.cf-broke-hint{font-size:0.75em;color:#ff7070;text-align:center;margin-top:6px;}

/* ── 结果横幅 ── */
.cf-result-banner{width:100%;text-align:center;padding:12px 8px;border-radius:10px;margin-bottom:8px;animation:cf-banner-in 0.5s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes cf-banner-in{from{transform:scale(0.6) translateY(-30px);opacity:0;}to{transform:scale(1) translateY(0);opacity:1;}}
.cf-result-big{font-size:1.3em;font-weight:bold;margin-bottom:3px;}
.cf-result-sub{font-size:0.8em;opacity:0.85;}
.cf-result-sha{background:linear-gradient(135deg,rgba(100,10,20,0.5),rgba(60,5,10,0.5));border:1px solid rgba(255,60,80,0.6);color:#ff6080;box-shadow:0 0 20px rgba(255,40,60,0.3);}
.cf-result-complete{background:linear-gradient(135deg,rgba(100,80,0,0.5),rgba(60,40,0,0.5));border:1px solid rgba(245,200,66,0.6);color:#f5c842;box-shadow:0 0 20px rgba(245,200,66,0.3);}

/* ── 爆炸粒子 ── */
.cf-explosion-particle{position:absolute;pointer-events:none;transform-origin:center;animation:cf-explode ease-out forwards;z-index:20;}
@keyframes cf-explode{0%{transform:translate(-50%,-50%) rotate(0) translateX(0);opacity:1;}100%{transform:translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist));opacity:0;}}

/* ── 金币雨 ── */
.cf-coin-rain{position:absolute;pointer-events:none;animation:cf-coin-fall ease-in forwards;z-index:10;}
@keyframes cf-coin-fall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}}

/* ── 震屏 ── */
@keyframes cf-shake-heavy{
  0%,100%{transform:none;}
  10%{transform:translateX(-12px) rotate(-3deg);}
  20%{transform:translateX(12px) rotate(3deg);}
  30%{transform:translateX(-10px) translateY(-4px);}
  40%{transform:translateX(10px) translateY(4px);}
  50%{transform:translateX(-8px);}
  60%{transform:translateX(8px);}
  70%{transform:translateX(-4px);}
  80%{transform:translateX(4px);}
}

/* ── 呼吸光 ── */
@keyframes cf-glow{0%,100%{text-shadow:0 0 4px currentColor;}50%{text-shadow:0 0 14px currentColor,0 0 28px currentColor;}}

/* ── Toast ── */
.cf-toast{
  position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
  background:linear-gradient(135deg,rgba(40,15,60,0.95),rgba(20,8,30,0.95));
  border:1px solid rgba(160,100,220,0.6);color:#d0a0ff;
  padding:9px 20px;border-radius:22px;font-size:0.86em;z-index:4000;
  box-shadow:0 4px 20px rgba(0,0,0,0.6),0 0 15px rgba(120,60,200,0.2);
  animation:cf-toast-in 0.3s ease-out,cf-toast-out 0.3s ease-in 2.3s forwards;
}
@keyframes cf-toast-in{from{opacity:0;transform:translateX(-50%) translateY(12px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
@keyframes cf-toast-out{from{opacity:1;}to{opacity:0;}}

/* ── 响应式 ── */
@media(max-width:640px){
  .cf-body{flex-direction:column;min-height:auto;}
  .cf-left{width:100%;min-width:auto;flex-direction:row;flex-wrap:wrap;gap:8px;padding:10px;}
  .cf-keeper-wrap{width:auto;flex:1;min-width:140px;}
  .cf-stats{width:auto;flex:1;min-width:140px;}
  .cf-reward-section{width:100%;}
  .cf-grid{width:min(100%,320px);}
  .cf-main{width:100%;border-radius:0;min-height:auto;}
  .cf-header{padding:8px 10px;}
  .cf-title{font-size:1em;}
  .cf-subtitle{font-size:0.7em;}
}
</style>`;
}

/* ═══════════════════════════════════════════
   九、Toast
   ═══════════════════════════════════════════ */

function _cfShowToast(msg) {
  const old = document.querySelector('.cf-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className='cf-toast'; t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2900);
}

/* ═══════════════════════════════════════════
   十、入口 & 关闭
   ═══════════════════════════════════════════ */

function openCardFlipGame(cityId) {
  if (!document.getElementById('cfStyles')) {
    document.head.insertAdjacentHTML('beforeend', _cfGetStyles());
  }
  let panel = document.getElementById('cardflipPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id='cardflipPanel';
    document.body.appendChild(panel);
  }
  _cfNewGame();
  _cfRenderMain();
}

function closeCardFlipGame() {
  if (_cfAmbientTimer) { clearInterval(_cfAmbientTimer); _cfAmbientTimer=null; }
  const panel = document.getElementById('cardflipPanel');
  if (panel) panel.remove();
  const toast = document.querySelector('.cf-toast');
  if (toast) toast.remove();
  // 清除残留粒子
  document.querySelectorAll('.cf-explosion-particle,.cf-coin-rain').forEach(e=>e.remove());
  _cfState = null;
}

/* ═══════════════════════════════════════════
   十一、全局暴露
   ═══════════════════════════════════════════ */
window.openCardFlipGame  = openCardFlipGame;
window.closeCardFlipGame = closeCardFlipGame;
window.cfStartFlip       = cfStartFlip;
window.cfContinueFlip    = cfContinueFlip;
window.cfCashOut         = cfCashOut;
window.cfFlipCard        = cfFlipCard;
window.cfRestart         = cfRestart;
