/**
 * minigame-gambling.js — 江湖赌坊「醉仙楼」v2.0 ✨华丽版
 *
 * 升级内容：
 *  - 庄家立绘升级：更高更精细的字符画，呼吸光效
 *  - 骰子升级：更大更精细，揭示时逐帧旋转动画
 *  - 金币粒子雨：赢钱时漫天金币飞舞
 *  - 震屏效果：豹子爆发时全屏抖动
 *  - 流光背景：背景有动态流光扫过
 *  - 豹子大演出：专属全屏爆炸特效
 *  - 碗盖豪华动画：蒸汽粒子+碗盖飞离
 *  - 灯笼摇曳+烛火闪烁氛围
 */

/* ═══════════════════════════════════════════
   一、常量 & 数据
   ═══════════════════════════════════════════ */

const GB_VERSION = '2.0';
const GB_BET_LEVELS = [5, 10, 50, 100, 500];

// 庄家字符画（升级版 - 更高更精细）
const GB_DEALER_ART = {
  iron_abacus: {
    name: '铁算盘老金',
    title: '赌坊庄主',
    color: '#d4a017',
    glowColor: 'rgba(212,160,23,0.5)',
    lines: [
      '      ╭━━━━━╮      ',
      '      ┃◈   ◈┃      ',
      '      ┃  ▽  ┃      ',
      '      ┃─────┃      ',
      '    ╭━┻━━━━━┻━╮    ',
      '    ┃ 算·盘·算 ┃    ',
      '    ┃ 珠·不·离 ┃    ',
      '    ┃ 身·富·贵 ┃    ',
      '    ╰━┳━━━┳━━╯    ',
      '    ╭━┻╮ ╭┻━╮    ',
      '    ┃  ┃ ┃  ┃    ',
      '    ╰──╯ ╰──╯    ',
    ],
    quote: [
      '「本庄公平公正，童叟无欺。」',
      '「赌技不精，怨不得庄家。」',
      '「今日手气不错嘛！」',
      '「再来一局？本庄奉陪到底。」',
      '「算盘一拨，输赢自知。」',
    ],
    idleAnim: 'gb-dealer-abacus',
  },
  fat_boss: {
    name: '胖虎掌柜',
    title: '东家',
    color: '#e07b39',
    glowColor: 'rgba(224,123,57,0.5)',
    lines: [
      '    ╭━━━━━━━╮    ',
      '    ┃◕  ▔  ◕┃    ',
      '    ┃   ▔▔  ┃    ',
      '    ┃  ╰▽╯  ┃    ',
      '  ╭━┻━━━━━━━┻━╮  ',
      '  ┃  大  富  贵 ┃  ',
      '  ┃  财  源  广 ┃  ',
      '  ╰━┳━━━━━┳━━╯  ',
      '  ╭━┻━╮  ╭┻━╮  ',
      '  ┃   ┃  ┃  ┃  ',
      '  ╰━━━╯  ╰──╯  ',
    ],
    quote: [
      '「哈哈哈，大爷您来啦！本店有礼！」',
      '「手气手气，手气最重要！」',
      '「赢了就跑？再坐坐嘛！」',
      '「小的招待不周，多担待！」',
      '「今日赌坊开门红，大家都有好彩头！」',
    ],
    idleAnim: 'gb-dealer-bounce',
  },
  thin_ghost: {
    name: '鬼脸薛三',
    title: '赌坊把头',
    color: '#7ecfb3',
    glowColor: 'rgba(126,207,179,0.5)',
    lines: [
      '     ╭━━━━━╮     ',
      '     ┃╯   ╰┃     ',
      '     ┃  ω  ┃     ',
      '     ┃~~~~~┃     ',
      '   ╭━┻━━━━━┻━╮   ',
      '   ┃  ≋≋≋≋≋  ┃   ',
      '   ┃  鬼·见·愁 ┃   ',
      '   ╰━┳━━━┳━━╯   ',
      '     ╭┻╮ ╭┻╮     ',
      '     ┃ ┃ ┃ ┃     ',
      '     ╰─╯ ╰─╯     ',
    ],
    quote: [
      '「嘿嘿，又来送银子？」',
      '「庄家永远不亏的，懂吗？」',
      '「运气嘛……哈哈哈……」',
      '「嘿……您今天手气真好，真的。」',
      '「鬼见愁从不说谎——今天庄家赢定了。」',
    ],
    idleAnim: 'gb-dealer-sway',
  },
  madam: {
    name: '红袖娘子',
    title: '赌坊花魁',
    color: '#e05a7a',
    glowColor: 'rgba(224,90,122,0.5)',
    lines: [
      '     ╭━━━━━╮     ',
      '     ┃♡   ♡┃     ',
      '     ┃  ‿  ┃     ',
      '     ┃~~~~~┃     ',
      '   ╭━┻━━━━━┻━╮   ',
      '   ┃ ≋红 袖≋ ┃   ',
      '   ┃  赌坊主  ┃   ',
      '   ┃  百花争  ┃   ',
      '   ╰━┳━━━┳━━╯   ',
      '    ╭┻━╮╭━┻╮    ',
      '    ╰━━╯╰━━╯    ',
    ],
    quote: [
      '「公子，来试试手气？奴家陪你。」',
      '「赢了请奴家喝茶嘛~」',
      '「哎呀，手气不好呢~再来一局？」',
      '「再来一局，说不定就赢回来了~」',
      '「今夜月色正好，公子何不放手一搏？」',
    ],
    idleAnim: 'gb-dealer-float',
  },
};

// 骰子字符画（升级版 - 更大更精细，带数字标注）
const GB_DICE_ART = [
  // 1点
  ['╔═══════╗',
   '║       ║',
   '║       ║',
   '║   ●   ║',
   '║       ║',
   '║       ║',
   '╚═══════╝'],
  // 2点
  ['╔═══════╗',
   '║  ●    ║',
   '║       ║',
   '║       ║',
   '║       ║',
   '║    ●  ║',
   '╚═══════╝'],
  // 3点
  ['╔═══════╗',
   '║  ●    ║',
   '║       ║',
   '║   ●   ║',
   '║       ║',
   '║    ●  ║',
   '╚═══════╝'],
  // 4点
  ['╔═══════╗',
   '║  ● ●  ║',
   '║       ║',
   '║       ║',
   '║       ║',
   '║  ● ●  ║',
   '╚═══════╝'],
  // 5点
  ['╔═══════╗',
   '║  ● ●  ║',
   '║       ║',
   '║   ●   ║',
   '║       ║',
   '║  ● ●  ║',
   '╚═══════╝'],
  // 6点
  ['╔═══════╗',
   '║  ● ●  ║',
   '║       ║',
   '║  ● ●  ║',
   '║       ║',
   '║  ● ●  ║',
   '╚═══════╝'],
];

// 骰子旋转动画帧（多帧，更流畅）
const GB_DICE_SPIN_FRAMES = [
  ['╔═══════╗','║╲     ╱║','║ ╲   ╱ ║','║  ╲ ╱  ║','║   ╳   ║','║  ╱ ╲  ║','╚═══════╝'],
  ['╔═══════╗','║ ─ ─ ─ ║','║       ║','║ ─ ─ ─ ║','║       ║','║ ─ ─ ─ ║','╚═══════╝'],
  ['╔═══════╗','║╱     ╲║','║ ╱   ╲ ║','║╱     ╲║','║╲     ╱║','║ ╲   ╱ ║','╚═══════╝'],
  ['╔═══════╗','║░░░░░░░║','║░░░░░░░║','║░░░░░░░║','║░░░░░░░║','║░░░░░░░║','╚═══════╝'],
  ['╔═══════╗','║▒▒▒▒▒▒▒║','║▒▒▒▒▒▒▒║','║▒▒▒▒▒▒▒║','║▒▒▒▒▒▒▒║','║▒▒▒▒▒▒▒║','╚═══════╝'],
  ['╔═══════╗','║▓▓▓▓▓▓▓║','║▓▓▓▓▓▓▓║','║▓▓▓▓▓▓▓║','║▓▓▓▓▓▓▓║','║▓▓▓▓▓▓▓║','╚═══════╝'],
  ['╔═══════╗','║│ │ │ │║','║│ │ │ │║','║│ │ │ │║','║│ │ │ │║','║│ │ │ │║','╚═══════╝'],
  ['╔═══════╗','║  ★ ★  ║','║★     ★║','║  ★ ★  ║','║★     ★║','║  ★ ★  ║','╚═══════╝'],
];

// 碗盖字符画（升级版）
const GB_BOWL_CLOSED = [
  '    ╔══════════════╗    ',
  '  ╔═╩══════════════╩═╗  ',
  '  ║  ≋  ≋  ≋  ≋  ≋  ║  ',
  '  ║  ～  ～  ～  ～  ║  ',
  '  ╚═══════════════════╝  ',
  '  ╚═══════════════════╝  ',
];
const GB_BOWL_SHAKING = [
  '  ╔════════════════╗  ',
  '╔═╩════════════════╩═╗',
  '║  ≋ ≋  ≋ ≋  ≋ ≋  ║',
  '║  ～  ～  ～  ～   ║',
  '╚═════════════════════╝',
  '╚═════════════════════╝',
];
const GB_BOWL_LIFTING = [
  ' ╔══════════════════╗ ',
  '╔╩══════════════════╩╗',
  '║    ≋  ≋  ≋  ≋     ║',
  '╚══════════════════════╝',
  '                       ',
  '                       ',
];
const GB_BOWL_OPEN = [
  ' ↑↑  开！！开！！  ↑↑ ',
  '╔═══════════════════╗',
  '║                   ║',
  '╚═══════════════════╝',
  '                     ',
  '                     ',
];

/* ═══════════════════════════════════════════
   二、存档
   ═══════════════════════════════════════════ */

const GB_SAVE_KEY = 'wuxia_gambling_data';
function _gbLoad() {
  try { return JSON.parse(localStorage.getItem(GB_SAVE_KEY)||'null')||{}; } catch(e) { return {}; }
}
function _gbSave(data) {
  try { localStorage.setItem(GB_SAVE_KEY, JSON.stringify(data)); } catch(e) {}
}

/* ═══════════════════════════════════════════
   三、工具函数
   ═══════════════════════════════════════════ */

function _gbPlayerSilver() {
  // 使用统一银两管理器
  return getSilver();
}
function _gbAddSilver(delta) {
  // 使用统一银两管理器
  addSilver(delta);
  SilverManager.save();
}
function _gbPlayerName() {
  try { return (typeof edS!=='undefined'&&edS.name)?edS.name:'侠客'; } catch(e){ return '侠客'; }
}
function _gbRandDealer() {
  const keys = Object.keys(GB_DEALER_ART);
  return keys[Math.floor(Math.random()*keys.length)];
}
function _gbRollDice() {
  return [
    Math.floor(Math.random()*6)+1,
    Math.floor(Math.random()*6)+1,
    Math.floor(Math.random()*6)+1,
  ];
}
function _gbDiceTotal(dice){ return dice[0]+dice[1]+dice[2]; }
function _gbIsTriplet(dice){ return dice[0]===dice[1]&&dice[1]===dice[2]; }
function _gbIsBig(t){ return t>=11&&t<=17; }
function _gbIsSmall(t){ return t>=4&&t<=10; }

/* ═══════════════════════════════════════════
   四、粒子系统
   ═══════════════════════════════════════════ */

// 金币雨粒子
function _gbSpawnCoinRain(count) {
  const overlay = document.getElementById('gbOverlay');
  if (!overlay) return;
  const coins = ['🪙','💰','✨','⭐','💛'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'gb-coin-particle';
      el.textContent = coins[Math.floor(Math.random()*coins.length)];
      el.style.cssText = `
        left:${Math.random()*100}%;
        top:-30px;
        font-size:${0.9+Math.random()*0.8}em;
        animation-duration:${1.2+Math.random()*1.5}s;
        animation-delay:${Math.random()*0.3}s;
      `;
      overlay.appendChild(el);
      setTimeout(()=>el.remove(), 3000);
    }, i * 40);
  }
}

// 蒸汽粒子（摇骰时）
function _gbSpawnSteam() {
  const bowlWrap = document.getElementById('gbBowlWrap');
  if (!bowlWrap) return;
  const rect = bowlWrap.getBoundingClientRect();
  const overlay = document.getElementById('gbOverlay');
  if (!overlay) return;
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'gb-steam-particle';
      const baseX = rect.left + rect.width/2 + (Math.random()-0.5)*60;
      el.style.cssText = `
        left:${baseX}px;
        top:${rect.top - 10}px;
        font-size:${0.7+Math.random()*0.4}em;
        animation-duration:${0.8+Math.random()*0.6}s;
      `;
      el.textContent = '〰';
      overlay.appendChild(el);
      setTimeout(()=>el.remove(), 1500);
    }, i*80);
  }
}

// 豹子爆炸粒子
function _gbSpawnTripletExplosion() {
  const overlay = document.getElementById('gbOverlay');
  if (!overlay) return;
  const emojis = ['💥','✨','🌟','⭐','💫','🎆','🎇','🏆','👑','🎊','🎉'];
  for (let i = 0; i < 30; i++) {
    setTimeout(()=>{
      const el = document.createElement('div');
      el.className = 'gb-explosion-particle';
      el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      const angle = Math.random()*360;
      const dist = 80 + Math.random()*200;
      el.style.cssText = `
        left:50%;top:50%;
        font-size:${1+Math.random()*1.2}em;
        --angle:${angle}deg;
        --dist:${dist}px;
        animation-duration:${0.8+Math.random()*0.8}s;
      `;
      overlay.appendChild(el);
      setTimeout(()=>el.remove(), 2000);
    }, i*30);
  }
}

// 震屏效果
function _gbShakeScreen(intensity) {
  const main = document.querySelector('.gb-main');
  if (!main) return;
  main.style.animation = `gb-shake-${intensity||'normal'} 0.5s ease-out`;
  setTimeout(()=>{ main.style.animation=''; }, 600);
}

/* ═══════════════════════════════════════════
   五、字符画构建
   ═══════════════════════════════════════════ */

function _gbBuildDiceHtml(face, highlight, triplet) {
  const art = (face==='spin')
    ? GB_DICE_SPIN_FRAMES[Math.floor(Math.random()*GB_DICE_SPIN_FRAMES.length)]
    : GB_DICE_ART[face-1];
  let color, bg, shadow, border;
  if (triplet) {
    color='#f5c842'; bg='rgba(245,200,66,0.18)';
    shadow='0 0 18px rgba(245,200,66,0.9), 0 0 6px rgba(245,200,66,0.5)';
    border='2px solid rgba(245,200,66,0.7)';
  } else if (highlight) {
    color='#7bffa0'; bg='rgba(123,255,160,0.12)';
    shadow='0 0 12px rgba(123,255,160,0.7)';
    border='1px solid rgba(123,255,160,0.5)';
  } else {
    color='#c8b89a'; bg='rgba(255,255,255,0.04)';
    shadow='none'; border='1px solid rgba(200,160,96,0.25)';
  }
  return `<div class="gb-dice" style="color:${color};background:${bg};box-shadow:${shadow};border:${border};">${art.map(l=>`<div>${l}</div>`).join('')}</div>`;
}

function _gbBuildDealerHtml(dealerId) {
  const d = GB_DEALER_ART[dealerId]||GB_DEALER_ART.iron_abacus;
  const quote = d.quote[Math.floor(Math.random()*d.quote.length)];
  return `
    <div class="gb-dealer-wrap">
      <div class="gb-dealer-art ${d.idleAnim}" style="color:${d.color};--glow:${d.glowColor};">
        ${d.lines.map(l=>`<div>${l}</div>`).join('')}
      </div>
      <div class="gb-dealer-name" style="color:${d.color};">${d.name}</div>
      <div class="gb-dealer-title">${d.title}</div>
      <div class="gb-dealer-quote">${quote}</div>
    </div>`;
}

function _gbBuildBowlHtml(lines, extraClass) {
  return `<div class="gb-bowl ${extraClass||''}">${lines.map(l=>`<div>${l}</div>`).join('')}</div>`;
}

/* ═══════════════════════════════════════════
   六、主界面渲染
   ═══════════════════════════════════════════ */

function _gbRenderMain(state) {
  const panel = document.getElementById('gamblingPanel');
  if (!panel) return;

  const silver  = _gbPlayerSilver();
  const dealer  = state.dealer||'iron_abacus';
  const streak  = state.streak||0;
  const total   = state.totalWon||0;
  const curBet  = state.bet||GB_BET_LEVELS[0];

  let streakHtml = '';
  if (streak>=3) streakHtml=`<div class="gb-streak">🔥 连赢${streak}局！手气大旺！</div>`;
  else if (streak<=-3) streakHtml=`<div class="gb-streak gb-streak-bad">💀 连输${Math.abs(streak)}局……</div>`;

  panel.innerHTML = `
<div class="gb-overlay" id="gbOverlay">
  <!-- 流光背景 -->
  <div class="gb-bg-shimmer"></div>
  <!-- 装饰粒子容器 -->
  <div class="gb-particle-layer" id="gbParticleLayer"></div>

  <!-- 背景装饰 -->
  <div class="gb-bg-deco">
    <div class="gb-lantern gb-lantern-l">🏮<div class="gb-lantern-glow"></div></div>
    <div class="gb-lantern gb-lantern-r">🏮<div class="gb-lantern-glow"></div></div>
    <div class="gb-candle gb-candle-tl">🕯</div>
    <div class="gb-candle gb-candle-tr">🕯</div>
    <div class="gb-candle gb-candle-bl">🕯</div>
    <div class="gb-candle gb-candle-br">🕯</div>
    <div class="gb-bg-coins">
      ${Array(8).fill(0).map((_,i)=>`<span class="gb-bg-coin" style="left:${5+i*12}%;animation-delay:${i*0.4}s;">🪙</span>`).join('')}
    </div>
  </div>

  <div class="gb-main" id="gbMain">
    <!-- 顶部标题栏 -->
    <div class="gb-header">
      <div class="gb-title-wrap">
        <span class="gb-title-deco">✦</span>
        <span class="gb-title">🎲 醉仙楼 · 猜大小</span>
        <span class="gb-title-deco">✦</span>
      </div>
      <div class="gb-subtitle">三枚骰子 · 大（11-17）小（4-10）· 豹子（三同）赔24倍</div>
      <button class="gb-close-btn" onclick="closeGamblingGame()">✕ 离开</button>
    </div>

    <div class="gb-body">
      <!-- 左侧：庄家立绘 -->
      <div class="gb-left">
        ${_gbBuildDealerHtml(dealer)}
        ${streakHtml}
        <div class="gb-stats">
          <div class="gb-stat-row">
            <span class="gb-stat-label">本局盈亏</span>
            <span class="gb-stat-val ${total>=0?'gb-pos':'gb-neg'}">${total>=0?'+':''}${total}两</span>
          </div>
          <div class="gb-stat-row">
            <span class="gb-stat-label">身上银两</span>
            <span class="gb-stat-val gb-silver">🪙 ${silver}</span>
          </div>
        </div>
      </div>

      <!-- 中间：骰子舞台 -->
      <div class="gb-center">
        <!-- 碗盖区域 -->
        <div class="gb-bowl-wrap" id="gbBowlWrap">
          ${_gbBuildBowlHtml(GB_BOWL_CLOSED)}
        </div>

        <!-- 骰子区（初始隐藏） -->
        <div class="gb-dice-row" id="gbDiceRow" style="display:none;">
          <div id="gbDice0">${_gbBuildDiceHtml(1,false,false)}</div>
          <div id="gbDice1">${_gbBuildDiceHtml(1,false,false)}</div>
          <div id="gbDice2">${_gbBuildDiceHtml(1,false,false)}</div>
        </div>
        <div class="gb-dice-total" id="gbDiceTotal" style="display:none;"></div>

        <!-- 结果横幅 -->
        <div id="gbResultBanner"></div>

        <!-- 下注区 -->
        <div class="gb-bet-section" id="gbBetSection">
          <div class="gb-bet-label">⬇ 下注金额（两）</div>
          <div class="gb-bet-levels">
            ${GB_BET_LEVELS.map(v=>`
              <button class="gb-bet-chip ${v===curBet?'gb-bet-active':''}"
                onclick="gbSetBet(${v})" id="gbChip${v}">
                <span class="chip-val">${v}</span>
              </button>`).join('')}
          </div>

          <div class="gb-choice-label">⬇ 押注选择</div>
          <div class="gb-choices">
            <button class="gb-choice-btn gb-choice-big" onclick="gbBet('big')"
              ${silver<curBet?'disabled':''}>
              <div class="choice-icon">🔴</div>
              <div class="choice-title">大</div>
              <div class="choice-range">11 ─ 17点</div>
              <div class="choice-odds">赔率 1:1</div>
            </button>
            <button class="gb-choice-btn gb-choice-small" onclick="gbBet('small')"
              ${silver<curBet?'disabled':''}>
              <div class="choice-icon">🔵</div>
              <div class="choice-title">小</div>
              <div class="choice-range">4 ─ 10点</div>
              <div class="choice-odds">赔率 1:1</div>
            </button>
            <button class="gb-choice-btn gb-choice-trip" onclick="gbBet('triplet')"
              ${silver<curBet*5?'disabled':''}>
              <div class="choice-icon">👑</div>
              <div class="choice-title">豹！</div>
              <div class="choice-range">三同点</div>
              <div class="choice-odds">赔率 1:24</div>
            </button>
          </div>
          ${silver<curBet?'<div class="gb-broke-hint">💸 银两不足，请降低下注额</div>':''}
          <div class="gb-quick-row">
            <button class="gb-quick-btn" onclick="gbDoubleDown()">×2 加倍</button>
            <button class="gb-quick-btn gb-quick-all" onclick="gbBetMax()">🎰 MAX</button>
          </div>
        </div>
      </div>

      <!-- 右侧：记录 -->
      <div class="gb-right">
        <div class="gb-log-title">📋 开盘记录</div>
        <div class="gb-log" id="gbLog">
          ${(state.log||[]).slice(-12).reverse().map(l=>`
            <div class="gb-log-item ${l.win?'log-win':'log-lose'}">
              <span class="log-result">${l.win?'✓':'✗'}</span>
              <span class="log-dice">${l.dice.join('-')}</span>
              <span class="log-bet">${l.choice==='big'?'大':l.choice==='small'?'小':'豹'}</span>
              <span class="log-delta ${l.win?'gb-pos':'gb-neg'}">${l.win?'+':'-'}${Math.abs(l.delta)}</span>
            </div>`).join('')||'<div class="gb-log-empty">尚无记录</div>'}
        </div>
        <!-- 统计 -->
        <div class="gb-log-stats" id="gbLogStats">
          ${_gbCalcStats(state.log||[])}
        </div>
      </div>
    </div>
  </div>
</div>`;

  // 启动背景环境粒子
  _gbStartAmbientParticles();
}

function _gbCalcStats(log) {
  if (!log.length) return '<div class="gb-stat-empty">──</div>';
  const wins = log.filter(l=>l.win).length;
  const rate = Math.round(wins/log.length*100);
  return `
    <div class="gb-mini-stat">胜率 <span class="${rate>=50?'gb-pos':'gb-neg'}">${rate}%</span></div>
    <div class="gb-mini-stat">共 ${log.length} 局</div>`;
}

// 环境装饰粒子（持续飘浮金币）- 优化版：限制最大粒子数
let _gbAmbientTimer = null;
let _gbAmbientPool = []; // 对象池复用
const _GB_MAX_PARTICLES = 15; // 最大粒子数限制

function _gbStartAmbientParticles() {
  if (_gbAmbientTimer) clearInterval(_gbAmbientTimer);
  _gbAmbientTimer = setInterval(()=>{
    const layer = document.getElementById('gbParticleLayer');
    if (!layer) { clearInterval(_gbAmbientTimer); return; }
    
    // 限制最大粒子数
    if (_gbAmbientPool.length >= _GB_MAX_PARTICLES) {
      const old = _gbAmbientPool.shift();
      if (old && old.parentNode) old.remove();
    }
    
    const el = document.createElement('span');
    el.className = 'gb-ambient-coin';
    el.textContent = Math.random()<0.6?'🪙':'✨';
    el.style.cssText=`left:${Math.random()*100}%;animation-duration:${4+Math.random()*4}s;font-size:${0.6+Math.random()*0.5}em;`;
    layer.appendChild(el);
    _gbAmbientPool.push(el);
    
    // 动画结束后从池和DOM中移除
    setTimeout(()=>{
      const idx = _gbAmbientPool.indexOf(el);
      if(idx > -1) _gbAmbientPool.splice(idx, 1);
      if(el.parentNode) el.remove();
    }, 9000);
  }, 800); // 稍微降低频率 600ms -> 800ms
}

function _gbStopAmbientParticles() {
  if (_gbAmbientTimer) {
    clearInterval(_gbAmbientTimer);
    _gbAmbientTimer = null;
  }
  // 清理现有粒子
  _gbAmbientPool.forEach(el => { if(el.parentNode) el.remove(); });
  _gbAmbientPool = [];
}

/* ═══════════════════════════════════════════
   七、游戏逻辑
   ═══════════════════════════════════════════ */

function gbSetBet(amount) {
  const silver = _gbPlayerSilver();
  const clamped = Math.max(GB_BET_LEVELS[0], Math.min(amount, silver, GB_BET_LEVELS[GB_BET_LEVELS.length-1]));
  let state = _gbLoad();
  state.bet = clamped;
  _gbSave(state);
  _gbRenderMain(state);
}

function gbDoubleDown() {
  let state = _gbLoad();
  const cur = state.bet||GB_BET_LEVELS[0];
  const idx = GB_BET_LEVELS.indexOf(cur);
  const next = GB_BET_LEVELS[Math.min(idx+1, GB_BET_LEVELS.length-1)];
  const silver = _gbPlayerSilver();
  if (next<=silver) { state.bet=next; _gbSave(state); _gbRenderMain(state); }
  else _gbShowToast('已是最高档！');
}

function gbBetMax() {
  const silver = _gbPlayerSilver();
  const max = GB_BET_LEVELS.filter(v=>v<=silver).pop()||GB_BET_LEVELS[0];
  let state = _gbLoad();
  state.bet = max;
  _gbSave(state);
  _gbRenderMain(state);
}

function gbBet(choice) {
  let state = _gbLoad();
  const betAmt = state.bet||GB_BET_LEVELS[0];
  const silver  = _gbPlayerSilver();
  const actualBet = choice==='triplet'?betAmt*5:betAmt;
  if (silver<actualBet) { _gbShowToast('银两不足！'); return; }
  _gbAddSilver(-actualBet);
  if(typeof SoundFX!=='undefined') SoundFX.play('dice_bet');
  // 传入 actualBet 用于计算净盈亏（豹子5倍押注需正确统计）
  _gbStartRollAnim(choice, betAmt, actualBet, state);
}

function _gbStartRollAnim(choice, betAmt, actualBet, state) {
  const betSec = document.getElementById('gbBetSection');
  if (betSec) betSec.style.display='none';

  const bowlWrap = document.getElementById('gbBowlWrap');
  const diceRow  = document.getElementById('gbDiceRow');
  const diceTotal= document.getElementById('gbDiceTotal');
  const banner   = document.getElementById('gbResultBanner');

  if (bowlWrap) { bowlWrap.innerHTML = _gbBuildBowlHtml(GB_BOWL_CLOSED); bowlWrap.style.display='block'; }
  if (diceRow)  diceRow.style.display='none';
  if (diceTotal) diceTotal.style.display='none';
  if (banner)   banner.innerHTML='';

  // 摇骰动画：碗盖左右抖动 + 蒸汽粒子
  if(typeof SoundFX!=='undefined') SoundFX.play('dice_roll');
  let frame=0, dir=1;
  const totalFrames=18;
  const rollInterval = setInterval(()=>{
    frame++;
    if (bowlWrap) {
      const shift = dir*(2+Math.random()*5);
      const rot   = dir*(1+Math.random()*4);
      bowlWrap.style.transform=`rotate(${rot}deg) translateX(${shift}px)`;
      // 切换晃动字符画
      if (frame%3===0) bowlWrap.innerHTML = _gbBuildBowlHtml(GB_BOWL_SHAKING,'gb-bowl-shake');
      dir *= -1;
    }
    // 每5帧蒸汽
    if (frame%5===0) _gbSpawnSteam();
    if (frame>=totalFrames) {
      clearInterval(rollInterval);
      if (bowlWrap) bowlWrap.style.transform='';
      _gbRevealResult(choice, betAmt, actualBet, state);
    }
  }, 90);
}

function _gbRevealResult(choice, betAmt, actualBet, state) {
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"赌坊系统：连庄运势 + 幸运事件
  // ═══════════════════════════════════════════════════════════════
  let dice  = _gbRollDice();
  let total = _gbDiceTotal(dice);
  let isTrp = _gbIsTriplet(dice);
  let isBig = _gbIsBig(total);
  
  // 连庄运势影响（连胜/连败会积累运势）
  const streak = state.streak || 0;
  let luckMod = 0;
  if (streak >= 3) luckMod = 0.05;      // 连胜3+：+5%胜率
  else if (streak >= 5) luckMod = 0.08; // 连胜5+：+8%胜率
  else if (streak <= -3) luckMod = -0.05; // 连败3+：-5%胜率
  else if (streak <= -5) luckMod = -0.08; // 连败5+：-8%胜率
  
  // 3%概率"赌神附体"（强制获胜）
  let godMode = false;
  if (Math.random() < 0.03 + luckMod) {
    godMode = true;
    // 根据选择强制生成获胜骰子
    if (choice === 'big') {
      dice = [4, 4, 4]; // 大但不是豹子
      total = 12;
      isTrp = false;
      isBig = true;
    } else if (choice === 'small') {
      dice = [2, 2, 2]; // 小但不是豹子
      total = 6;
      isTrp = false;
      isBig = false;
    } else if (choice === 'triplet') {
      const trpVal = Math.floor(Math.random() * 6) + 1;
      dice = [trpVal, trpVal, trpVal];
      total = trpVal * 3;
      isTrp = true;
    }
  }
  
  // 2%概率"霉运当头"（强制失败）
  let badLuck = false;
  if (!godMode && Math.random() < 0.02 - luckMod) {
    badLuck = true;
    // 根据选择强制生成失败骰子
    if (choice === 'big') {
      dice = [1, 2, 3]; // 小
      total = 6;
      isTrp = false;
      isBig = false;
    } else if (choice === 'small') {
      dice = [5, 5, 5]; // 大但不是豹子（因为押的是小）
      total = 15;
      isTrp = false;
      isBig = true;
    } else if (choice === 'triplet') {
      dice = [3, 4, 5]; // 不是豹子
      total = 12;
      isTrp = false;
      isBig = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"赌坊恶搞事件
  // ═══════════════════════════════════════════════════════════════
  let funnyEvent = null;
  const funnyRoll = Math.random();
  if (!godMode && !badLuck && funnyRoll < 0.05) {
    const funnyEvents = [
      {
        id: 'cat_jump',
        name: '野猫捣乱',
        icon: '🐱',
        desc: '一只野猫突然跳上赌桌，打翻了骰子！',
        effect: () => {
          // 重新摇骰子
          dice = _gbRollDice();
          total = _gbDiceTotal(dice);
          isTrp = _gbIsTriplet(dice);
          isBig = _gbIsBig(total);
          return { msg: '🐱 一只野猫跳上赌桌打翻了骰子！庄家只好重新摇...', reroll: true };
        }
      },
      {
        id: 'dealer_sneeze',
        name: '庄家喷嚏',
        icon: '🤧',
        desc: '庄家突然打了个喷嚏，骰子飞了出去！',
        effect: () => {
          dice = _gbRollDice();
          total = _gbDiceTotal(dice);
          isTrp = _gbIsTriplet(dice);
          isBig = _gbIsBig(total);
          return { msg: '🤧 庄家阿嚏一声！骰子飞到了隔壁桌...重新摇！', reroll: true };
        }
      },
      {
        id: 'lucky_charm',
        name: '护身符显灵',
        icon: '🧿',
        desc: '你口袋里的护身符突然发热...',
        effect: () => {
          // 50%概率变好，50%概率变坏
          if (Math.random() < 0.5) {
            // 变好：强制生成接近获胜的骰子
            if (choice === 'big') {
              dice = [4, 5, 3]; total = 12; isTrp = false; isBig = true;
            } else if (choice === 'small') {
              dice = [2, 3, 1]; total = 6; isTrp = false; isBig = false;
            } else {
              dice = [2, 2, 3]; total = 7; isTrp = false; isBig = false;
            }
            return { msg: '🧿 你的护身符发出微光！运气似乎变好了...', lucky: true };
          } else {
            return { msg: '🧿 你的护身符发出微光...然后灭了。什么都没发生。', lucky: false };
          }
        }
      },
      {
        id: 'drunk_player',
        name: '醉汉闹事',
        icon: '🍺',
        desc: '一个醉汉拍着你的肩膀："兄弟，信我，押大！"',
        effect: () => {
          return { msg: '🍺 醉汉在你耳边胡言乱语...你决定不理他。', noEffect: true };
        }
      },
      {
        id: 'wind_blow',
        name: '妖风阵阵',
        icon: '💨',
        desc: '一阵怪风吹过，蜡烛忽明忽暗...',
        effect: () => {
          // 随机改变一个骰子
          const changeIdx = Math.floor(Math.random() * 3);
          dice[changeIdx] = Math.floor(Math.random() * 6) + 1;
          total = _gbDiceTotal(dice);
          isTrp = _gbIsTriplet(dice);
          isBig = _gbIsBig(total);
          return { msg: '💨 一阵妖风吹过，骰子好像动了一下...', changed: true };
        }
      },
      {
        id: 'lucky_coin',
        name: '铜钱落地',
        icon: '🪙',
        desc: '你的一枚铜钱掉在地上，正面朝上！',
        effect: () => {
          // 小幅增加获胜概率：改变一个骰子为更有利的值
          if (choice === 'big' && total < 11) {
            dice[0] = Math.min(6, dice[0] + 1);
          } else if (choice === 'small' && total > 9) {
            dice[0] = Math.max(1, dice[0] - 1);
          }
          total = _gbDiceTotal(dice);
          isTrp = _gbIsTriplet(dice);
          isBig = _gbIsBig(total);
          return { msg: '🪙 铜钱正面朝上！鸿运当头！', lucky: true };
        }
      },
      {
        id: 'bird_fly',
        name: '飞鸟入屋',
        icon: '🐦',
        desc: '一只鸟从窗户飞了进来，在赌坊里乱窜！',
        effect: () => {
          return { msg: '🐦 一只麻雀飞进来，在众人头顶盘旋三圈后飞出...这是吉兆吗？', noEffect: true };
        }
      },
      {
        id: 'dealer_wink',
        name: '庄家眨眼',
        icon: '😉',
        desc: '庄家对你眨了眨眼...',
        effect: () => {
          // 30%概率暗示正确，70%概率误导
          if (Math.random() < 0.3) {
            return { msg: '😉 庄家对你使了个眼色...似乎在暗示什么。', hint: true };
          } else {
            return { msg: '😉 庄家对你眨了眨眼...然后继续摇骰子。', noEffect: true };
          }
        }
      },
    ];
    funnyEvent = funnyEvents[Math.floor(Math.random() * funnyEvents.length)];
    if (funnyEvent && funnyEvent.effect) {
      funnyEvent.result = funnyEvent.effect();
    }
  }

  let won=false, payout=0;
  if (choice==='big')     { won=isBig&&!isTrp; payout=betAmt*2; }
  if (choice==='small')   { won=!isBig&&!isTrp; payout=betAmt*2; }
  if (choice==='triplet') { won=isTrp; payout=betAmt*25; }

  // delta = 净盈亏（押注时已扣除 actualBet，赢了返回 payout）
  const delta = won ? (payout - actualBet) : -actualBet;
  if (won) _gbAddSilver(payout);

  // 更新存档
  if (won) state.streak = Math.max(state.streak||0, 0)+1;
  else     state.streak = Math.min(state.streak||0, 0)-1;
  state.totalWon = (state.totalWon||0)+delta;
  state.log = state.log||[];
  state.log.push({dice, choice, win:won, delta:Math.abs(delta), ts:Date.now()});
  if (state.log.length>50) state.log.shift();
  _gbSave(state);

  // ── 成就系统触发 ──
  if(typeof achOnGamble === 'function') achOnGamble(won, state.streak||0);

  const bowlWrap = document.getElementById('gbBowlWrap');

  // 阶段1：碗盖半开（0.15s）
  setTimeout(()=>{
    if (bowlWrap) { bowlWrap.innerHTML=_gbBuildBowlHtml(GB_BOWL_LIFTING,'gb-bowl-lift'); bowlWrap.style.transform=''; }
  }, 150);

  // 阶段2：碗盖全开，骰子出现（0.5s）
  setTimeout(()=>{
    if(typeof SoundFX!=='undefined') SoundFX.play('dice_land');
    if (bowlWrap) bowlWrap.innerHTML=_gbBuildBowlHtml(GB_BOWL_OPEN,'gb-bowl-open');
    const diceRow=document.getElementById('gbDiceRow');
    if (diceRow) {
      diceRow.style.display='flex';
      diceRow.innerHTML=[0,1,2].map(i=>`<div id="gbDice${i}" class="gb-dice-reveal-wrap">${_gbBuildDiceHtml('spin',false,false)}</div>`).join('');
    }
  }, 500);

  // 阶段3：骰子逐个揭示（每隔220ms）
  [0,1,2].forEach((i)=>{
    setTimeout(()=>{
      const el=document.getElementById(`gbDice${i}`);
      if (el) {
        el.innerHTML=_gbBuildDiceHtml(dice[i], won&&!isTrp, isTrp);
        el.classList.add('gb-dice-pop');
      }
      if (i===2) {
        const totEl=document.getElementById('gbDiceTotal');
        if (totEl) {
          totEl.style.display='block';
          totEl.innerHTML = isTrp
            ? `<span class="gb-total-triplet">🎊 豹子！ ${total}点 🎊</span>`
            : `<span class="gb-total ${isBig?'gb-big':'gb-small'}">${isBig?'🔴 大':'🔵 小'} — ${total}点</span>`;
        }
      }
    }, 700+i*220);
  });

  // 阶段4：结果横幅 + 特效（1.4s）
  setTimeout(()=>{
    const banner=document.getElementById('gbResultBanner');
    if (banner) banner.innerHTML = _gbBuildResultBanner(won, Math.abs(delta), isTrp&&won, godMode, badLuck);

    // 特效
    if (isTrp && won) {
      _gbSpawnTripletExplosion();
      _gbShakeScreen('heavy');
      _gbSpawnCoinRain(50);
      _gbShowTripletCelebration(total);
      if(typeof SoundFX!=='undefined') SoundFX.play('dice_big');
    } else if (won) {
      _gbSpawnCoinRain(20);
      _gbShakeScreen('light');
      if(typeof SoundFX!=='undefined') SoundFX.play('dice_win');
    } else {
      _gbShakeScreen('lose');
      if(typeof SoundFX!=='undefined') SoundFX.play('dice_lose');
    }

    _gbTriggerSideEffects(state, won, delta);

    setTimeout(()=>_gbRenderMain(state), won&&isTrp?3200:2000);
  }, 1450);
}

function _gbBuildResultBanner(won, delta, isTrip, godMode, badLuck) {
  // "将将胡"特殊事件显示
  if (godMode) {
    return `<div class="gb-result-banner gb-banner-godmode">
      <div class="gb-banner-big">🎰 赌神附体！</div>
      <div class="gb-banner-sub">天意如此，势不可挡！</div>
      <div class="gb-banner-amount gb-pos">+${delta} 两</div>
    </div>`;
  }
  if (badLuck) {
    return `<div class="gb-result-banner gb-banner-badluck">
      <div class="gb-banner-big">🌧️ 霉运当头</div>
      <div class="gb-banner-sub">时运不济，改日再来……</div>
      <div class="gb-banner-amount gb-neg">-${delta} 两</div>
    </div>`;
  }
  if (isTrip) {
    return `<div class="gb-result-banner gb-banner-triplet">
      <div class="gb-banner-big">💥 豹子！豹子！豹子！💥</div>
      <div class="gb-banner-sub">恭喜大爷，天降横财！</div>
      <div class="gb-banner-amount gb-pos">+${delta} 两</div>
    </div>`;
  }
  if (won) {
    return `<div class="gb-result-banner gb-banner-win">
      <div class="gb-banner-big">🏆 赢了！</div>
      <div class="gb-banner-sub">银两入袋，好手气！</div>
      <div class="gb-banner-amount gb-pos">+${delta} 两</div>
    </div>`;
  }
  return `<div class="gb-result-banner gb-banner-lose">
    <div class="gb-banner-big">💸 输了……</div>
    <div class="gb-banner-sub">胜败乃兵家常事，再来！</div>
    <div class="gb-banner-amount gb-neg">-${delta} 两</div>
  </div>`;
}

// 豹子庆典全屏文字
function _gbShowTripletCelebration(total) {
  const overlay = document.getElementById('gbOverlay');
  if (!overlay) return;
  const el = document.createElement('div');
  el.className = 'gb-triplet-flash';
  el.innerHTML = `<div class="gb-triplet-flash-text">👑 豹子！${total}点 👑</div>
    <div class="gb-triplet-flash-sub">赔率 1:24 · 横财天降！</div>`;
  overlay.appendChild(el);
  setTimeout(()=>el.remove(), 2500);
}

/* ═══════════════════════════════════════════
   八、联动系统
   ═══════════════════════════════════════════ */

function _gbTriggerSideEffects(state, won, delta) {
  const silver = _gbPlayerSilver();
  if (state.streak>=3 && won) {
    try {
      if (typeof npcState!=='undefined'&&typeof npcAddAffinity==='function') {
        const recentNpcs=Object.keys(npcState.affinity||{});
        if (recentNpcs.length>0) {
          npcAddAffinity(recentNpcs[recentNpcs.length-1], 5);
          _gbShowToast('好手气！附近的人对你刮目相看！');
        }
      }
    } catch(e){}
  }
  if (silver<=0) {
    setTimeout(()=>{
      _gbShowDialog('💰 囊中羞涩',
        `${_gbPlayerName()}，你已经身无分文了！\n\n据说城中有个叫「黑鱼帮」的组织愿意放高利贷……\n但借钱容易还钱难，江湖险恶，且行且珍惜。`);
    }, 2500);
  }
  if (won&&delta>0&&(state.totalWon||0)>500&&!state._warnedBig) {
    state._warnedBig=true; _gbSave(state);
    setTimeout(()=>_gbShowToast('⚠️ 赢势过猛，赌坊伙计眼神不善……小心官府耳目！'), 2200);
  }
}

/* ═══════════════════════════════════════════
   九、CSS 样式（华丽版）
   ═══════════════════════════════════════════ */

function _gbGetStyles() {
  return `<style id="gbStyles">
/* ── 全屏遮罩 ── */
.gb-overlay {
  position:fixed;inset:0;z-index:3000;
  background:linear-gradient(160deg,#120400 0%,#200a00 35%,#150600 70%,#0a0200 100%);
  display:flex;align-items:center;justify-content:center;
  font-family:'Courier New','Noto Sans SC',monospace;
  overflow:auto;
}

/* ── 流光背景 ── */
.gb-bg-shimmer {
  position:absolute;inset:0;pointer-events:none;overflow:hidden;
  background:repeating-linear-gradient(
    -45deg,
    transparent 0px, transparent 40px,
    rgba(200,100,20,0.03) 40px, rgba(200,100,20,0.03) 80px
  );
  animation:gb-shimmer-move 8s linear infinite;
}
@keyframes gb-shimmer-move {
  from{background-position:0 0}
  to{background-position:160px 160px}
}

/* ── 粒子层 ── */
.gb-particle-layer {
  position:absolute;inset:0;pointer-events:none;overflow:hidden;
}

/* ── 装饰 ── */
.gb-bg-deco { position:absolute;inset:0;pointer-events:none;overflow:hidden; }
.gb-lantern {
  position:absolute;top:10px;font-size:2.8em;
  animation:gb-lantern-swing 3.5s ease-in-out infinite;
}
.gb-lantern-l{left:20px;animation-delay:0s;}
.gb-lantern-r{right:20px;animation-delay:1.8s;}
.gb-lantern-glow {
  position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:40px;height:40px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,120,30,0.35),transparent 70%);
  animation:gb-glow-pulse 2s ease-in-out infinite;
}
@keyframes gb-lantern-swing {
  0%,100%{transform:rotate(-10deg);}50%{transform:rotate(10deg);}
}
@keyframes gb-glow-pulse {
  0%,100%{opacity:0.6;transform:translateX(-50%) scale(1);}
  50%{opacity:1;transform:translateX(-50%) scale(1.3);}
}
.gb-candle {
  position:absolute;font-size:1.4em;
  animation:gb-candle-flicker 1.8s ease-in-out infinite;
}
.gb-candle-tl{top:60px;left:60px;}
.gb-candle-tr{top:60px;right:60px;animation-delay:0.7s;}
.gb-candle-bl{bottom:60px;left:60px;animation-delay:1.1s;}
.gb-candle-br{bottom:60px;right:60px;animation-delay:0.3s;}
@keyframes gb-candle-flicker {
  0%,100%{transform:scale(1);opacity:0.9;}
  30%{transform:scale(0.95) skewX(2deg);opacity:0.7;}
  60%{transform:scale(1.05) skewX(-1deg);opacity:1;}
}
.gb-bg-coins {
  position:absolute;bottom:0;left:0;right:0;height:60px;pointer-events:none;
}
.gb-bg-coin {
  position:absolute;bottom:8px;font-size:1em;
  animation:gb-bg-coin-float 5s ease-in-out infinite;
  opacity:0.25;
}
@keyframes gb-bg-coin-float {
  0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}
}

/* ── 环境漂浮粒子 ── */
.gb-ambient-coin {
  position:absolute;top:-20px;
  animation:gb-ambient-fall linear forwards;
  opacity:0.45;pointer-events:none;
}
@keyframes gb-ambient-fall {
  0%{top:-20px;opacity:0.5;transform:translateX(0) rotate(0deg);}
  100%{top:110%;opacity:0;transform:translateX(calc(-30px + 60px * var(--r,0.5))) rotate(360deg);}
}

/* ── 金币雨 ── */
.gb-coin-particle {
  position:absolute;pointer-events:none;
  animation:gb-coin-fall ease-in forwards;
  z-index:10;
}
@keyframes gb-coin-fall {
  0%{transform:translateY(0) rotate(0deg);opacity:1;}
  100%{transform:translateY(100vh) rotate(720deg);opacity:0;}
}

/* ── 蒸汽 ── */
.gb-steam-particle {
  position:fixed;pointer-events:none;
  color:rgba(200,200,200,0.6);
  animation:gb-steam-rise ease-out forwards;
  z-index:10;
}
@keyframes gb-steam-rise {
  0%{transform:translateY(0) scale(1);opacity:0.7;}
  100%{transform:translateY(-60px) scale(1.8);opacity:0;}
}

/* ── 爆炸粒子（豹子） ── */
.gb-explosion-particle {
  position:absolute;pointer-events:none;
  transform-origin:center;
  animation:gb-explode ease-out forwards;
  z-index:20;
}
@keyframes gb-explode {
  0%{transform:translate(-50%,-50%) rotate(0) translateX(0);opacity:1;}
  100%{transform:translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist));opacity:0;}
}

/* ── 豹子闪屏 ── */
.gb-triplet-flash {
  position:absolute;inset:0;z-index:30;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:rgba(0,0,0,0.6);
  animation:gb-triplet-flash-in 0.3s ease-out, gb-triplet-flash-out 0.5s ease-in 2s forwards;
  pointer-events:none;
}
.gb-triplet-flash-text {
  font-size:2.2em;font-weight:bold;color:#f5c842;
  text-shadow:0 0 30px rgba(245,200,66,1), 0 0 60px rgba(245,200,66,0.6);
  animation:gb-glow-pulse 0.5s ease-in-out infinite;
  letter-spacing:0.1em;
}
.gb-triplet-flash-sub {
  font-size:1.1em;color:#ffaa20;margin-top:12px;
  text-shadow:0 0 10px rgba(255,170,32,0.8);
}
@keyframes gb-triplet-flash-in { from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);} }
@keyframes gb-triplet-flash-out{ from{opacity:1;}to{opacity:0;} }

/* ── 震屏 ── */
@keyframes gb-shake-light {
  0%,100%{transform:none;}
  20%{transform:translateX(-4px) rotate(-1deg);}
  40%{transform:translateX(4px) rotate(1deg);}
  60%{transform:translateX(-3px);}
  80%{transform:translateX(3px);}
}
@keyframes gb-shake-normal {
  0%,100%{transform:none;}
  15%{transform:translateX(-8px) rotate(-2deg);}
  30%{transform:translateX(8px) rotate(2deg);}
  45%{transform:translateX(-6px) translateY(-3px);}
  60%{transform:translateX(6px) translateY(3px);}
  75%{transform:translateX(-4px);}
  90%{transform:translateX(4px);}
}
@keyframes gb-shake-heavy {
  0%,100%{transform:none;}
  10%{transform:translateX(-14px) rotate(-3deg);}
  20%{transform:translateX(14px) rotate(3deg);}
  30%{transform:translateX(-12px) translateY(-5px);}
  40%{transform:translateX(12px) translateY(5px);}
  50%{transform:translateX(-10px) rotate(-2deg);}
  60%{transform:translateX(10px) rotate(2deg);}
  70%{transform:translateX(-6px);}
  80%{transform:translateX(6px);}
  90%{transform:translateX(-3px);}
}
@keyframes gb-shake-lose {
  0%,100%{transform:none;}
  25%{transform:translateX(-5px) translateY(2px);}
  75%{transform:translateX(5px) translateY(-2px);}
}

/* ── 主容器 ── */
.gb-main {
  width:min(96vw,860px);
  background:
    radial-gradient(ellipse at 20% 20%, rgba(120,50,5,0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(80,30,5,0.3) 0%, transparent 50%),
    linear-gradient(160deg,#1e0a02 0%,#2e1206 50%,#1a0800 100%);
  border:2px solid #8a5015;
  border-radius:14px;
  box-shadow:
    0 0 60px rgba(200,100,20,0.5),
    0 0 120px rgba(150,50,10,0.3),
    inset 0 0 80px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,180,60,0.15);
  overflow:hidden;
  position:relative;
}

/* ── 顶部标题 ── */
.gb-header {
  background:linear-gradient(90deg,#3a0e00,#6e2a00,#8a3800,#6e2a00,#3a0e00);
  padding:14px 16px 10px;
  text-align:center;
  border-bottom:2px solid rgba(200,120,30,0.5);
  position:relative;
  box-shadow:0 4px 20px rgba(0,0,0,0.5);
}
.gb-title-wrap { display:flex;align-items:center;justify-content:center;gap:12px; }
.gb-title-deco { color:#f5c842;font-size:1em;animation:gb-glow 2s ease-in-out infinite; }
.gb-title {
  font-size:1.5em;font-weight:bold;color:#f5c842;
  text-shadow:0 0 15px rgba(245,200,66,0.8),0 0 30px rgba(245,200,66,0.4);
  letter-spacing:0.12em;
}
.gb-subtitle{font-size:0.78em;color:#c8a060;margin-top:6px;opacity:0.85;}
.gb-close-btn {
  position:absolute;top:10px;right:12px;
  background:linear-gradient(135deg,rgba(180,50,20,0.4),rgba(120,20,0,0.4));
  border:1px solid #c05020;color:#ff9070;
  border-radius:6px;padding:5px 12px;cursor:pointer;font-size:0.85em;
  transition:all 0.2s;
}
.gb-close-btn:hover{background:rgba(255,100,50,0.4);transform:scale(1.05);}

/* ── Body ── */
.gb-body { display:flex;gap:0;min-height:500px; }

/* ── 左栏 ── */
.gb-left {
  width:168px;min-width:150px;
  background:linear-gradient(180deg,rgba(25,8,0,0.7),rgba(15,5,0,0.8));
  border-right:1px solid rgba(150,80,20,0.35);
  padding:14px 10px;
  display:flex;flex-direction:column;align-items:center;gap:10px;
}
.gb-dealer-wrap{text-align:center;width:100%;}
.gb-dealer-art {
  font-size:0.68em;line-height:1.3;
  font-family:'Courier New',monospace;
  white-space:pre;
  text-shadow:0 0 8px var(--glow,rgba(212,160,23,0.5));
  filter:drop-shadow(0 0 4px var(--glow,rgba(212,160,23,0.3)));
}
/* 四种庄家idle动画 */
.gb-dealer-abacus { animation:gb-dealer-abacus-idle 4s ease-in-out infinite; }
@keyframes gb-dealer-abacus-idle {
  0%,100%{transform:translateY(0) rotate(0deg);}
  50%{transform:translateY(-4px) rotate(0.5deg);}
}
.gb-dealer-bounce { animation:gb-dealer-bounce-idle 0.9s ease-in-out infinite; }
@keyframes gb-dealer-bounce-idle {
  0%,100%{transform:translateY(0) scaleY(1);}
  50%{transform:translateY(-5px) scaleY(0.97);}
}
.gb-dealer-sway { animation:gb-dealer-sway-idle 3s ease-in-out infinite; }
@keyframes gb-dealer-sway-idle {
  0%,100%{transform:rotate(0deg);}
  25%{transform:rotate(2deg);}
  75%{transform:rotate(-2deg);}
}
.gb-dealer-float { animation:gb-dealer-float-idle 5s ease-in-out infinite; }
@keyframes gb-dealer-float-idle {
  0%,100%{transform:translateY(0) scale(1);}
  33%{transform:translateY(-3px) scale(1.01);}
  66%{transform:translateY(-5px) scale(1.01);}
}
.gb-dealer-name{font-size:0.78em;font-weight:bold;margin-top:6px;}
.gb-dealer-title{font-size:0.68em;color:#a08060;margin-top:1px;}
.gb-dealer-quote {
  font-size:0.68em;color:#907050;text-align:center;
  font-style:italic;padding:5px 4px;
  border:1px solid rgba(140,80,20,0.3);border-radius:4px;
  background:rgba(0,0,0,0.35);line-height:1.5;
  margin-top:4px;
}
.gb-streak{
  font-size:0.76em;color:#f5c842;text-align:center;
  animation:gb-glow 1.2s ease-in-out infinite;
}
.gb-streak-bad{color:#ff7070;}
@keyframes gb-glow {
  0%,100%{text-shadow:0 0 4px currentColor;}
  50%{text-shadow:0 0 14px currentColor,0 0 28px currentColor;}
}
.gb-stats{width:100%;background:rgba(0,0,0,0.3);border-radius:6px;padding:7px 8px;}
.gb-stat-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:0.7em;}
.gb-stat-label{color:#907050;}
.gb-stat-val{font-weight:bold;}
.gb-pos{color:#7bffa0;}
.gb-neg{color:#ff7070;}
.gb-silver{color:#f5c842;}

/* ── 中栏：骰子舞台 ── */
.gb-center {
  flex:1;padding:16px 14px;
  display:flex;flex-direction:column;align-items:center;gap:10px;
  background:
    radial-gradient(ellipse at 50% 0%,rgba(80,30,5,0.4),transparent 60%),
    rgba(15,5,0,0.45);
}

/* 碗盖 */
.gb-bowl-wrap{text-align:center;transition:transform 0.12s;}
.gb-bowl {
  font-family:'Courier New',monospace;
  font-size:0.85em;line-height:1.5;
  color:#c8a060;
  text-shadow:0 0 6px rgba(200,160,96,0.5);
}
.gb-bowl-shake{animation:gb-bowl-shake-anim 0.15s ease-in-out;}
@keyframes gb-bowl-shake-anim{
  0%,100%{transform:none;}50%{transform:translateX(4px) rotate(2deg);}
}
.gb-bowl-lift{animation:gb-bowl-lift-anim 0.3s ease-out;color:#f5c842;}
@keyframes gb-bowl-lift-anim{
  from{transform:translateY(0);}to{transform:translateY(-6px);}
}
.gb-bowl-open{color:#f5c842;animation:gb-bowl-open-anim 0.25s ease-out;}
@keyframes gb-bowl-open-anim{
  from{transform:scale(0.95);}to{transform:scale(1);}
}

/* 骰子行 */
.gb-dice-row{display:flex;gap:14px;justify-content:center;margin:4px 0;}
.gb-dice {
  font-family:'Courier New',monospace;
  font-size:0.86em;line-height:1.4;
  white-space:pre;        /* 保留空格，骰子字符画不折行 */
  display:inline-block;   /* 宽度由内容决定，不撑满容器 */
  padding:7px 10px;border-radius:8px;
  transition:all 0.3s;
}
.gb-dice-reveal-wrap{animation:gb-dice-appear 0.3s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes gb-dice-appear {
  from{transform:scale(0.5) rotate(-30deg) translateY(-20px);opacity:0;}
  to{transform:scale(1) rotate(0) translateY(0);opacity:1;}
}
.gb-dice-pop{animation:gb-dice-pop-anim 0.4s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes gb-dice-pop-anim{
  0%{transform:scale(1);}40%{transform:scale(1.25);}100%{transform:scale(1);}
}

/* 点数显示 */
.gb-dice-total{font-size:1.15em;font-weight:bold;letter-spacing:0.05em;animation:gb-dice-appear 0.3s ease-out;}
.gb-big   {color:#ff8c42;text-shadow:0 0 10px rgba(255,140,66,0.8);}
.gb-small {color:#42c8ff;text-shadow:0 0 10px rgba(66,200,255,0.8);}
.gb-total-triplet {
  color:#f5c842;font-size:1.3em;
  text-shadow:0 0 20px rgba(245,200,66,1),0 0 40px rgba(245,200,66,0.6);
  animation:gb-glow 0.5s ease-in-out infinite;
}

/* 结果横幅 */
.gb-result-banner {
  width:100%;text-align:center;padding:10px 8px;
  border-radius:10px;
  animation:gb-banner-in 0.5s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes gb-banner-in{
  from{transform:scale(0.6) translateY(-30px);opacity:0;}
  to{transform:scale(1) translateY(0);opacity:1;}
}
.gb-banner-big{font-size:1.2em;font-weight:bold;margin-bottom:3px;}
.gb-banner-sub{font-size:0.8em;opacity:0.85;margin-bottom:4px;}
.gb-banner-amount{font-size:1.35em;font-weight:bold;}
.gb-banner-win {
  background:linear-gradient(135deg,rgba(0,120,50,0.4),rgba(0,80,30,0.4));
  border:1px solid rgba(60,200,100,0.5);color:#7bffa0;
  box-shadow:0 0 20px rgba(60,200,100,0.25),inset 0 0 20px rgba(0,0,0,0.3);
}
.gb-banner-lose {
  background:linear-gradient(135deg,rgba(120,30,0,0.4),rgba(80,10,0,0.4));
  border:1px solid rgba(200,60,30,0.5);color:#ff9070;
}
.gb-banner-triplet {
  background:linear-gradient(135deg,rgba(150,120,0,0.5),rgba(100,70,0,0.5));
  border:2px solid rgba(245,200,66,0.8);color:#f5c842;
  box-shadow:0 0 30px rgba(245,200,66,0.6),0 0 60px rgba(245,200,66,0.3),
             inset 0 0 20px rgba(0,0,0,0.3);
  animation:gb-triplet-banner-pulse 0.6s ease-in-out infinite alternate;
}
@keyframes gb-triplet-banner-pulse{
  from{box-shadow:0 0 30px rgba(245,200,66,0.6);}
  to{box-shadow:0 0 50px rgba(245,200,66,0.9),0 0 80px rgba(245,200,66,0.4);}
}

/* ── 下注区 ── */
.gb-bet-section{width:100%;}
.gb-bet-label,.gb-choice-label{font-size:0.76em;color:#a08060;margin-bottom:7px;text-align:center;}
.gb-bet-levels{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;}
.gb-bet-chip {
  width:48px;height:48px;border-radius:50%;
  border:2px solid #7a5020;
  background:radial-gradient(circle at 35% 35%,#6a4020,#2a1200);
  color:#c8a060;font-size:0.78em;font-weight:bold;
  cursor:pointer;transition:all 0.2s;
  display:flex;align-items:center;justify-content:center;
  box-shadow:inset 0 1px 0 rgba(255,200,100,0.15),0 2px 6px rgba(0,0,0,0.4);
}
.gb-bet-chip:hover{border-color:#f5c842;transform:scale(1.12);}
.gb-bet-active {
  border-color:#f5c842!important;
  background:radial-gradient(circle at 35% 35%,#9a7030,#5a3800)!important;
  color:#f5c842!important;
  box-shadow:0 0 14px rgba(245,200,66,0.7),inset 0 1px 0 rgba(255,220,120,0.2)!important;
  transform:scale(1.15);
}
.gb-choices{display:flex;gap:10px;justify-content:center;}
.gb-choice-btn {
  flex:1;max-width:120px;padding:12px 8px;
  border-radius:10px;cursor:pointer;
  border:2px solid transparent;
  transition:all 0.22s;text-align:center;
  position:relative;overflow:hidden;
}
.gb-choice-btn::before {
  content:'';position:absolute;top:-50%;left:-50%;
  width:200%;height:200%;
  background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.06) 50%,transparent 70%);
  transform:translateX(-100%);
  transition:transform 0.4s;
}
.gb-choice-btn:hover:not(:disabled)::before{transform:translateX(100%);}
.gb-choice-btn:hover:not(:disabled){transform:translateY(-5px);box-shadow:0 8px 24px rgba(0,0,0,0.5);}
.gb-choice-btn:disabled{opacity:0.32;cursor:not-allowed;}
.gb-choice-big {
  background:linear-gradient(160deg,#8a2800,#3a1000);
  border-color:rgba(200,64,32,0.7);color:#ff9060;
  box-shadow:0 4px 15px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,150,100,0.12);
}
.gb-choice-big:hover:not(:disabled){border-color:#ff7040;box-shadow:0 8px 25px rgba(200,80,30,0.5);}
.gb-choice-small {
  background:linear-gradient(160deg,#004888,#001840);
  border-color:rgba(32,96,200,0.7);color:#60a8ff;
  box-shadow:0 4px 15px rgba(0,0,0,0.4),inset 0 1px 0 rgba(100,180,255,0.12);
}
.gb-choice-small:hover:not(:disabled){border-color:#4090ff;box-shadow:0 8px 25px rgba(30,80,200,0.5);}
.gb-choice-trip {
  background:linear-gradient(160deg,#644800,#281c00);
  border-color:rgba(160,110,20,0.8);color:#f5c842;
  box-shadow:0 4px 15px rgba(0,0,0,0.4),inset 0 1px 0 rgba(245,200,66,0.12);
  animation:gb-trip-btn-glow 2s ease-in-out infinite;
}
@keyframes gb-trip-btn-glow{
  0%,100%{box-shadow:0 4px 15px rgba(0,0,0,0.4);}
  50%{box-shadow:0 4px 20px rgba(200,150,20,0.4),0 0 30px rgba(200,150,20,0.15);}
}
.gb-choice-trip:hover:not(:disabled){border-color:#f5c842;box-shadow:0 8px 25px rgba(200,150,20,0.6);}
.choice-icon{font-size:1.4em;margin-bottom:2px;}
.choice-title{font-size:1.5em;font-weight:bold;line-height:1;}
.choice-range{font-size:0.72em;opacity:0.8;margin:3px 0;}
.choice-odds{font-size:0.68em;opacity:0.65;}
.gb-broke-hint{font-size:0.75em;color:#ff7070;text-align:center;margin-top:6px;}
.gb-quick-row{display:flex;gap:8px;justify-content:center;margin-top:10px;}
.gb-quick-btn {
  padding:6px 14px;border-radius:6px;cursor:pointer;font-size:0.76em;
  background:rgba(80,40,5,0.5);border:1px solid rgba(160,100,30,0.45);
  color:#c8a060;transition:all 0.2s;
}
.gb-quick-btn:hover{background:rgba(120,60,5,0.65);color:#f5c842;transform:scale(1.05);}
.gb-quick-all{border-color:rgba(200,150,30,0.5);color:#f5c842;}

/* ── 右栏：记录 ── */
.gb-right {
  width:148px;min-width:130px;
  background:linear-gradient(180deg,rgba(25,8,0,0.7),rgba(15,5,0,0.8));
  border-left:1px solid rgba(150,80,20,0.35);
  padding:10px 8px;
  display:flex;flex-direction:column;gap:6px;
}
.gb-log-title{font-size:0.76em;color:#a08060;font-weight:bold;}
.gb-log{flex:1;overflow-y:auto;font-size:0.68em;}
.gb-log-item{
  display:flex;gap:3px;align-items:center;
  padding:3px 2px;border-bottom:1px solid rgba(120,70,20,0.2);
}
.gb-log-item.log-win{color:#7bffa0;}
.gb-log-item.log-lose{color:#ff9070;}
.log-result{font-size:0.9em;}
.log-dice{flex:1;font-size:0.85em;}
.log-bet{font-size:0.85em;}
.log-delta{font-size:0.85em;}
.gb-log-empty{font-size:0.72em;color:#907050;font-style:italic;padding:6px 0;}
.gb-log-stats{font-size:0.7em;color:#907050;padding-top:4px;border-top:1px solid rgba(120,70,20,0.3);}
.gb-mini-stat{margin-bottom:2px;}
.gb-stat-empty{color:#504030;}

/* ── Toast ── */
.gb-toast {
  position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
  background:linear-gradient(135deg,rgba(50,25,0,0.95),rgba(30,12,0,0.95));
  border:1px solid rgba(180,100,30,0.6);
  color:#f5c842;padding:9px 20px;border-radius:22px;
  font-size:0.86em;z-index:4000;
  box-shadow:0 4px 20px rgba(0,0,0,0.6),0 0 15px rgba(200,100,20,0.2);
  animation:gb-toast-in 0.3s ease-out,gb-toast-out 0.3s ease-in 2.3s forwards;
}
@keyframes gb-toast-in{from{opacity:0;transform:translateX(-50%) translateY(12px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
@keyframes gb-toast-out{from{opacity:1;}to{opacity:0;}}

/* ── Dialog ── */
.gb-dialog-mask{
  position:fixed;inset:0;z-index:3500;
  background:rgba(0,0,0,0.75);
  display:flex;align-items:center;justify-content:center;
}
.gb-dialog{
  background:linear-gradient(160deg,#2a1200,#1a0800);
  border:2px solid #8a5010;border-radius:12px;
  padding:22px 26px;max-width:320px;text-align:center;
  color:#c8a060;
  box-shadow:0 0 40px rgba(0,0,0,0.8),0 0 20px rgba(150,80,20,0.3);
}
.gb-dialog h3{color:#f5c842;margin:0 0 12px;text-shadow:0 0 10px rgba(245,200,66,0.5);}
.gb-dialog p{font-size:0.88em;line-height:1.7;white-space:pre-line;}
.gb-dialog-close{
  margin-top:16px;padding:7px 22px;
  background:linear-gradient(135deg,rgba(120,60,0,0.7),rgba(80,30,0,0.7));
  border:1px solid #a06030;color:#f5c842;border-radius:8px;cursor:pointer;
  transition:all 0.2s;
}
.gb-dialog-close:hover{background:rgba(160,80,0,0.8);}
</style>`;
}

/* ═══════════════════════════════════════════
   十、Toast & Dialog
   ═══════════════════════════════════════════ */

function _gbShowToast(msg) {
  const old = document.querySelector('.gb-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className='gb-toast'; t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2900);
}

function _gbShowDialog(title, body) {
  const mask = document.createElement('div');
  mask.className='gb-dialog-mask';
  mask.innerHTML=`<div class="gb-dialog">
    <h3>${title}</h3><p>${body}</p>
    <button class="gb-dialog-close" onclick="this.closest('.gb-dialog-mask').remove()">知道了</button>
  </div>`;
  document.body.appendChild(mask);
}

/* ═══════════════════════════════════════════
   十一、入口 & 关闭
   ═══════════════════════════════════════════ */

function openGamblingGame(cityId) {
  if (!document.getElementById('gbStyles')) {
    document.head.insertAdjacentHTML('beforeend', _gbGetStyles());
  }
  let panel = document.getElementById('gamblingPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id='gamblingPanel';
    document.body.appendChild(panel);
  }
  let state = _gbLoad();
  if (!state.dealer) state.dealer = _gbRandDealer();
  // 每次进入重置本局
  state.totalWon=0; state.streak=state.streak||0;
  state._warnedBig=false;
  if (!state.bet) state.bet=GB_BET_LEVELS[0];
  _gbSave(state);
  _gbRenderMain(state);
  // ── 赌坊BGM ──
  if (typeof BgmManager !== 'undefined') BgmManager.play('casino');
}

function closeGamblingGame() {
  if (_gbAmbientTimer) { clearInterval(_gbAmbientTimer); _gbAmbientTimer=null; }
  const panel = document.getElementById('gamblingPanel');
  if (panel) panel.innerHTML='';
  const toast = document.querySelector('.gb-toast');
  if (toast) toast.remove();
  // ── 恢复城镇BGM ──
  if (typeof BgmManager !== 'undefined') BgmManager.play('townMellow');
}

/* ═══════════════════════════════════════════
   十二、全局暴露
   ═══════════════════════════════════════════ */
window.openGamblingGame  = openGamblingGame;
window.closeGamblingGame = closeGamblingGame;
window.gbSetBet          = gbSetBet;
window.gbBet             = gbBet;
window.gbDoubleDown      = gbDoubleDown;
window.gbBetMax          = gbBetMax;
