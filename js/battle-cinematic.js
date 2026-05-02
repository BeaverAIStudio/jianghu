// battle-cinematic.js — 战斗电影演出系统 v1.0
// 依赖：battle.js（LH/RH/log/buildFighterEl等）
// ═══════════════════════════════════════════════

// ── 开场对峙动画 ──────────────────────────────────
// 在 resetFight 之后由 battle.js 调用
// 展示：双侧入场→VS字幕→挑衅台词→开打提示

const BC_VS_ART = `
 ██╗   ██╗███████╗
 ██║   ██║██╔════╝
 ██║   ██║███████╗
 ╚██╗ ██╔╝╚════██║
  ╚████╔╝ ███████║
   ╚═══╝  ╚══════╝`;

// ── NPC 战前台词库（按 tier）──
const BC_TAUNT_LINES = {
  func: [
    '你也配与我动手？',
    '好汉饶命！……不对，打完再说！',
    '今日之事，点到为止！',
    '哼，别怪我出手不留情！',
    '区区来犯，不自量力！',
    '我早就看你不顺眼了！',
    '你走运，撞上我心情好的时候……',
  ],
  major: [
    '江湖险恶，你可有把握？',
    '我已出手百余场，从未落败。',
    '且看你有几分斤两！',
    '有本事便放马过来，我恭候多时了。',
    '刀剑无眼，伤了你莫怪我！',
    '你的眼神告诉我，你没见过真正的高手。',
    '好，今日就让你见识见识！',
    '我的名号你未必听过，但你会记一辈子！',
  ],
  elite: [
    '难得遇到对手……',
    '今日若你能接下我三招，算你过关。',
    '江湖沉浮数十年，今日方遇真对手。',
    '你的气势……有意思。放手一搏！',
    '我已许久未曾全力出手了。',
    '好——让我看看，你究竟有多深！',
    '不见棺材不落泪？我倒要瞧瞧！',
    '今日，是你的幸运，还是厄运？',
  ],
  player: [
    '来吧，放马过来！',
    '胆敢阻我，真不知死活！',
    '看剑！',
    '江湖险路，有我一刀开道！',
    '我的刀不认人，只认胜负！',
    '今日之战，必分高下！',
  ],
};

// 获取随机挑衅台词
function bcGetTauntLine(tier){
  const pool = BC_TAUNT_LINES[tier] || BC_TAUNT_LINES.func;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── 开场叙事语库（按对阵类型）──
const BC_NARRATE = {
  pvp:  ['两雄相遇，必有一战！','天下武林，高下立判！','江湖恩怨，一触即发！'],
  pve_func: ['街头混战，一触即发！','路见不平，拔刀相助！','这等小喽啰，何须多言！'],
  pve_major: ['强者对决，剑拔弩张！','山雨欲来风满楼——','一场硬仗，在所难免！'],
  pve_elite: ['绝世高手，此刻降临！','江湖传说，今日现真身！','千古一遇的对决——'],
  dungeon: ['险地凶兽，寸步不让！','生死之战，毫厘之间！','深渊之中，命运抉择！'],
};

function bcGetNarrate(type){
  const pool = BC_NARRATE[type] || BC_NARRATE.pvp;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── 主开场演出函数 ──
// options: { skipIntro: bool } — 自动战斗时传 skipIntro:true
function showFightIntro(lFighter, rFighter, options = {}){
  if(options.skipIntro) return Promise.resolve();

  return new Promise(resolve => {
    // 创建演出遮罩
    let ov = document.getElementById('bc-intro-overlay');
    if(ov) ov.remove();
    ov = document.createElement('div');
    ov.id = 'bc-intro-overlay';
    ov.className = 'bc-intro-ov';

    // 左侧角色容器
    const lBox = document.createElement('div');
    lBox.className = 'bc-intro-fighter bc-intro-l';
    const lFEl = document.createElement('div');
    lFEl.className = 'fighter ft-animated';
    lFEl.style.color = lFighter.color;
    lFEl.style.filter = `drop-shadow(0 0 18px ${lFighter.color})`;
    buildFighterEl(lFEl, lFighter, false);
    lBox.appendChild(lFEl);

    // 右侧角色容器
    const rBox = document.createElement('div');
    rBox.className = 'bc-intro-fighter bc-intro-r';
    const rFEl = document.createElement('div');
    rFEl.className = 'fighter ft-animated flip';
    rFEl.style.color = rFighter.color;
    rFEl.style.filter = `drop-shadow(0 0 18px ${rFighter.color})`;
    buildFighterEl(rFEl, rFighter, true);
    rBox.appendChild(rFEl);

    // 中央信息
    const center = document.createElement('div');
    center.className = 'bc-intro-center';

    // 确定叙事类型
    let narrateType = 'pvp';
    if(rFighter._isEnemy){
      narrateType = 'dungeon';
    } else if(rFighter._isNpc){
      const tier = rFighter._npcTier || rFighter.tier || 'func';
      narrateType = tier === 'elite' ? 'pve_elite' : tier === 'major' ? 'pve_major' : 'pve_func';
    }
    const narrateLine = bcGetNarrate(narrateType);

    // 左右名字 + tier标签
    const lTier = lFighter._isEnemy ? (lFighter.tier||'func') : 'player';
    const rTier = rFighter._isEnemy ? (rFighter.tier||'func') : (rFighter._npcTier||rFighter.tier||'func');
    const rTierLabel = {func:'', major:'【高手】', elite:'【宗师】'}[rTier] || '';

    center.innerHTML = `
      <div class="bc-intro-narrate">${narrateLine}</div>
      <div class="bc-intro-vs">⚔</div>
      <div class="bc-intro-names">
        <span class="bc-name-l" style="color:${lFighter.color}">${lFighter.name}</span>
        <span class="bc-vs-word">VS</span>
        <span class="bc-name-r" style="color:${rFighter.color}">${rFighter.name}${rTierLabel}</span>
      </div>
    `;

    // 台词气泡（延迟显示）
    const lBubble = document.createElement('div');
    lBubble.className = 'bc-bubble bc-bubble-l';
    lBubble.textContent = bcGetTauntLine(lTier === 'player' ? 'player' : lTier);

    const rBubble = document.createElement('div');
    rBubble.className = 'bc-bubble bc-bubble-r';
    rBubble.textContent = bcGetTauntLine(rTier);

    // 底部提示
    const hint = document.createElement('div');
    hint.className = 'bc-intro-hint';
    hint.textContent = '点击任意处开始战斗';

    ov.appendChild(lBox);
    ov.appendChild(center);
    ov.appendChild(rBox);
    ov.appendChild(lBubble);
    ov.appendChild(rBubble);
    ov.appendChild(hint);
    document.body.appendChild(ov);

    // 入场动画序列
    requestAnimationFrame(()=>{
      ov.classList.add('bc-intro-show');
      setTimeout(()=>{ lBox.classList.add('bc-intro-enter'); }, 80);
      setTimeout(()=>{ rBox.classList.add('bc-intro-enter'); }, 200);
      setTimeout(()=>{ center.classList.add('bc-center-show'); }, 450);
      setTimeout(()=>{ lBubble.classList.add('bc-bubble-show'); }, 900);
      setTimeout(()=>{ rBubble.classList.add('bc-bubble-show'); }, 1150);
      setTimeout(()=>{ hint.classList.add('bc-hint-show'); }, 1600);
    });

    // 点击或超时关闭
    function closeIntro(){
      ov.classList.add('bc-intro-hide');
      setTimeout(()=>{ ov.remove(); resolve(); }, 350);
    }
    ov.addEventListener('click', closeIntro, { once: true });
    // 自动4.5秒后关闭
    setTimeout(closeIntro, 4500);
  });
}

// ── 技能大招演出弹窗 ──────────────────────────────
// 比原 showSkillBig 更华丽：全屏字符画 + 技能名 + 属性光效

const BC_SKILL_ART = {
  // 剑法系
  sword:  `  ／\n ╱ ╲\n╱═══╲\n  ║\n  ║`,
  // 刀法系
  blade:  `╔═══╗\n║▌  ║\n║▌  ║\n╚═══╝\n  ║`,
  // 掌法系
  palm:   `  ┌─┐\n┌─┘ └─┐\n│  ☯  │\n└─┐ ┌─┘\n  └─┘`,
  // 拳法系
  fist:   `  ╔╗\n╔═╝║\n║  ║\n╚══╝\n  ║`,
  // 内功系
  inner:  ` ◉ \n◉ ◉\n ◉ \n│☯│\n└─┘`,
  // 暗器系
  dart:   ` ──►\n──►\n ──►`,
  // 轻功系
  qinggong: `～ ╮\n  ◎\n ╰～\n ～`,
  // 毒系
  poison: ` ☠ \n╔═╗\n║☣║\n╚═╝`,
  // 默认
  default: ` ✦ \n✦ ✦\n ✦ `,
};

// 技能学派 → 对应的字符画 + 颜色
const BC_SKILL_STYLE = {
  '华山剑宗':  { art: 'sword',    color: '#e0f0ff', bgColor: 'rgba(0,60,120,.92)', glow: '#40a0ff' },
  '武当太极':  { art: 'palm',     color: '#80ffcc', bgColor: 'rgba(0,40,40,.92)',  glow: '#20d080' },
  '少林金刚':  { art: 'fist',     color: '#ffd080', bgColor: 'rgba(60,30,0,.92)',  glow: '#ffa020' },
  '峨眉刺客':  { art: 'blade',    color: '#ffb0ff', bgColor: 'rgba(60,0,60,.92)',  glow: '#e060e0' },
  '五毒教':    { art: 'poison',   color: '#a0ff60', bgColor: 'rgba(0,40,0,.92)',   glow: '#60cc00' },
  '逍遥剑':    { art: 'qinggong', color: '#c0f0ff', bgColor: 'rgba(0,30,60,.92)',  glow: '#00bfff' },
  '明教圣火':  { art: 'default',  color: '#ff8040', bgColor: 'rgba(80,20,0,.92)',  glow: '#ff4000' },
  '唐门暗器':  { art: 'dart',     color: '#aaaaaa', bgColor: 'rgba(20,20,30,.92)', glow: '#8888aa' },
  '苍云剑法':  { art: 'sword',    color: '#c0e0ff', bgColor: 'rgba(0,30,80,.92)',  glow: '#6090ff' },
  '天山冰魄':  { art: 'inner',    color: '#b0f8ff', bgColor: 'rgba(0,10,40,.92)',  glow: '#00e8ff' },
  '玄冥神掌':  { art: 'palm',     color: '#aaaaff', bgColor: 'rgba(10,0,40,.92)',  glow: '#8844ff' },
  '血骨功':    { art: 'default',  color: '#ff4444', bgColor: 'rgba(60,0,0,.92)',   glow: '#ff0000' },
  'default':   { art: 'default',  color: '#ffd060', bgColor: 'rgba(30,20,0,.92)',  glow: '#ffc030' },
};

function bcGetSkillStyle(school){
  return BC_SKILL_STYLE[school] || BC_SKILL_STYLE.default;
}

// 技能演出（调用点：execSkill 内，重要技能触发时）
// opts: { side, skillName, school, type, isCrit, comboName, comboIcon, comboDesc }
function showSkillCinematic(opts = {}){
  const { side = 'l', skillName = '???', school = '', type = '', isCrit = false,
          comboName = '', comboIcon = '', comboDesc = '' } = opts;
  const style = bcGetSkillStyle(school);

  let ov = document.getElementById('bc-skill-overlay');
  if(ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'bc-skill-overlay';
  ov.className = 'bc-skill-ov';
  ov.style.setProperty('--bc-bg', style.bgColor);
  ov.style.setProperty('--bc-glow', style.glow);
  ov.style.setProperty('--bc-color', style.color);

  const artLines = (BC_SKILL_ART[style.art] || BC_SKILL_ART.default);

  // 使用者名字
  const caster = side === 'l' ? LH : RH;
  const critLabel = isCrit ? ' 💥暴击！' : '';

  // 组合名称显示在技能名上方
  const comboHtml = comboName
    ? `<div class="bc-combo-name">${comboIcon} ${comboName}</div>`
    : '';

  // 技能名支持多行显示（\n分割）
  const skillNameLines = skillName.includes('\n')
    ? skillName.split('\n').map(line => `<div class="bc-skill-name-line">${line}</div>`).join('')
    : skillName;

  ov.innerHTML = `
    <div class="bc-skill-bg-glow"></div>
    <div class="bc-skill-art">${artLines.replace(/\n/g,'<br>')}</div>
    ${comboHtml}
    <div class="bc-skill-school">${school || '武技'}</div>
    <div class="bc-skill-name">${skillNameLines}${critLabel}</div>
    <div class="bc-skill-caster">${caster.name} 发动！</div>
  `;

  document.body.appendChild(ov);
  requestAnimationFrame(()=>{ ov.classList.add('bc-skill-show'); });

  // 粒子爆炸
  setTimeout(()=>{
    _bcSkillParticles(ov, style.glow);
  }, 150);

  // 自动消失
  setTimeout(()=>{
    ov.classList.add('bc-skill-hide');
    setTimeout(()=>{ if(ov.parentNode) ov.remove(); }, 400);
  }, 900);
}

// 技能粒子
function _bcSkillParticles(container, color){
  const syms = ['✦','★','◆','✸','⚡','◈','⬡','⁕'];
  for(let i = 0; i < 18; i++){
    const p = document.createElement('div');
    p.className = 'bc-skill-particle';
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 120;
    p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
    p.style.left = (30 + Math.random() * 40) + '%';
    p.style.top  = (20 + Math.random() * 40) + '%';
    p.style.color = color;
    p.style.fontSize = (10 + Math.random() * 14) + 'px';
    p.textContent = syms[Math.floor(Math.random() * syms.length)];
    container.appendChild(p);
    setTimeout(()=>{ if(p.parentNode) p.remove(); }, 800);
  }
}

// ── 胜负演出强化 ──────────────────────────────────
// 原 checkWin 结算后调用，展示华丽胜利界面

// 胜者台词库
const BC_WIN_LINES = {
  player: [
    '江湖路，且行且珍重！',
    '不过如此！下一个！',
    '承让了——',
    '哈哈，痛快！痛快！',
    '今日之战，我记下了。',
    '刀剑之争，终有胜负。',
  ],
  npc_func: [
    '……这……怎可能……',
    '认……认输了……',
    '今日栽了，改日再见！',
    '哎哟，算你狠！',
  ],
  npc_major: [
    '……好……好功夫……',
    '今日败于你手，心服口服。',
    '这世上，果然高人辈出……',
    '……我输了。江湖再见！',
  ],
  npc_elite: [
    '……不可思议……你……竟然……',
    '我毕生功夫……败于此……',
    '……你是我见过最强的对手。',
    '……好。今日，是我输了。',
  ],
  enemy: [
    '嗷——！',
    '……！',
    '不……！',
  ],
};

function bcGetWinLine(winner, loser){
  if(winner.id === 'cp_self' || (winner.id && winner.id.startsWith('cc'))){
    return BC_WIN_LINES.player[Math.floor(Math.random() * BC_WIN_LINES.player.length)];
  }
  // NPC获胜 — 玩家输了
  const tier = winner._npcTier || winner.tier || 'func';
  const pool = BC_WIN_LINES['npc_' + tier] || BC_WIN_LINES.npc_func;
  return pool[Math.floor(Math.random() * pool.length)];
}

function bcGetLoserLine(loser, winner){
  if(loser._isEnemy){
    return BC_WIN_LINES.enemy[Math.floor(Math.random() * BC_WIN_LINES.enemy.length)];
  }
  const tier = loser._npcTier || loser.tier || 'func';
  const pool = BC_WIN_LINES['npc_' + tier] || BC_WIN_LINES.npc_func;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── 胜利演出全屏特效 ──
function showVictoryCinematic(winner, loser, rounds, dmgTotal){
  const playerWon = winner.id === 'cp_self' || (winner.id && winner.id.startsWith('cc'));
  const winLine = bcGetWinLine(winner, loser);
  const loserLine = bcGetLoserLine(loser, winner);

  // 创建演出层
  let ov = document.getElementById('bc-victory-ov');
  if(ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'bc-victory-ov';
  ov.className = 'bc-victory-ov';

  // 金色还是红色
  const mainColor = playerWon ? '#ffd060' : '#ff4040';
  const glowColor = playerWon ? 'rgba(255,180,0,.6)' : 'rgba(255,40,40,.6)';
  ov.style.setProperty('--bc-win-color', mainColor);
  ov.style.setProperty('--bc-win-glow', glowColor);

  // 胜利字
  const bigLabel = playerWon ? '⚔ 胜 ⚔' : '💀 落败 💀';
  const subLabel = playerWon ? '武功盖世，天下无敌！' : '今日之败，来日报还！';

  // 勋章（按对手等级）
  const rTier = loser._npcTier || loser.tier || 'func';
  const medalMap = {func: '🥉', major: '🥈', elite: '🏅'};
  const medal = playerWon ? (medalMap[rTier] || '🥉') : '';

  ov.innerHTML = `
    <div class="bc-victory-glow"></div>
    <div class="bc-victory-big">${bigLabel}</div>
    <div class="bc-victory-sub">${subLabel}</div>
    <div class="bc-victory-medal">${medal}</div>
    <div class="bc-victory-quote" style="color:${winner.color}">"${winLine}"</div>
    <div class="bc-victory-loser-quote">${loser.name}：「${loserLine}」</div>
    <div class="bc-victory-stats">共 ${rounds} 回合 · 总伤害 ${dmgTotal}</div>
  `;

  document.body.appendChild(ov);
  requestAnimationFrame(()=>{ ov.classList.add('bc-victory-show'); });

  // 金币/星星粒子雨
  if(playerWon){
    _bcVictoryParticleRain(ov, mainColor);
  }

  // 1.2秒后自动消失（交由 winLayer 接手）
  setTimeout(()=>{
    ov.classList.add('bc-victory-hide');
    setTimeout(()=>{ if(ov.parentNode) ov.remove(); }, 500);
  }, 1800);
}

function _bcVictoryParticleRain(container, color){
  const syms = ['✦','★','◆','✸','🏅','💎','⚡','👑'];
  for(let i = 0; i < 28; i++){
    setTimeout(()=>{
      const p = document.createElement('div');
      p.className = 'bc-rain-particle';
      p.style.left  = Math.random() * 100 + '%';
      p.style.top   = '-20px';
      p.style.color = color;
      p.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
      p.style.animationDelay = '0s';
      p.textContent = syms[Math.floor(Math.random() * syms.length)];
      container.appendChild(p);
      setTimeout(()=>{ if(p.parentNode) p.remove(); }, 2000);
    }, i * 60);
  }
}

// ══════════════════════════════════════════════════════════════════
//  主线 BOSS 专属登场动画  —  Borderlands 风格
//  调用：showBossIntro(bossId)  → 返回 Promise，玩家确认后 resolve
// ══════════════════════════════════════════════════════════════════

/**
 * 主线 BOSS 数据表
 * name       : 显示名（大字）
 * title      : 头衔（小字）
 * subtitle   : 副标（金色警告文字）
 * color      : 主题色（霓虹描边）
 * bgColor    : 背景辐射色
 * art        : ASCII字符画（用\n分行）
 * taunt      : 专属登场台词
 * bgLabel    : 背景烫金大字（装饰层）
 */
const BC_BOSS_DATA = {

  // ════════════════════════════════════════
  //  主线 BOSS
  // ════════════════════════════════════════
  '骨冥子': {
    name:     '骨冥子',
    title:    '血骨门门主',
    subtitle: '⚠ 主线最终BOSS ⚠',
    color:    '#ff2222',
    bgColor:  'rgba(100,0,0,.92)',
    taunt:    '……鹤隐真是好眼光。\n可惜，棋到残局，棋手亦是棋。\n你以为你是猎人——\n其实，你只是最后一颗子。',
    bgLabel:  '血骨',
    art:
`        ☠️
       ╱|│|╲
      ╱ │   │ ╲
     ╱  │ 👁 │  ╲
    ╱═══╪═══╪═══╲
      ╱ ╲   ╱ ╲
     ╱   ╲ ╱   ╲
    ╱▓▓▓▓▓▓▓▓▓▓▓╲
       ║ 💀💀 ║
       ║▓▓▓▓▓▓║
      ╱║ 🦴  🦴 ║╲
     ╱ ╚════════╝ ╲
    ╱   ╱╲   ╱╲   ╲
       ╱  ╲ ╱  ╲`,
  },

  // ════════════════════════════════════════
  //  邪道门派 BOSS
  // ════════════════════════════════════════
  '血骨门副门主': {
    name:     '血刃',
    title:    '血骨门副门主',
    subtitle: '⚠ 副门主 ⚠',
    color:    '#cc2244',
    bgColor:  'rgba(80,0,20,.9)',
    taunt:    '杀人从不用第二刀——\n不是因为仁慈，\n是因为第一刀就够了。',
    bgLabel:  '血刃',
    art:
`          🗡️
         ╱││╲
        ╱ │ │ ╲
       ╱  👁👁  ╲
      ╱    ═══    ╲
     ╱═════════════╲
     ║  ▓ 🩸🩸 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
        ╱│╲  ╱│╲
       ╱ │ ╲╱ │ ╲
      ╱  │  ∧  │  ╲`,
  },

  '玄冥教长老': {
    name:     '寒渊子',
    title:    '玄冥教教主',
    subtitle: '⚠ 教主 ⚠',
    color:    '#44aaff',
    bgColor:  'rgba(0,20,60,.9)',
    taunt:    '你身上的热气……\n在我面前，不过是一缕青烟。\n寒冰之下，万物皆寂。',
    bgLabel:  '玄冥',
    art:
`       ❄️ ❄️ ❄️
        ╱ 👁 ╲
       ╱ ❄👁❄ ╲
      ╱═══════════╲
      ║ ❄️ ▓▓▓ ❄️ ║
      ║  ▓▓▓▓▓▓  ║
      ╚══╪══════╪══╝
        ╱│╲  ╱│╲
       ╱ │ ╲╱ │ ╲
      ❄️  │     │  ❄️`,
  },

  '邪火魔君': {
    name:     '邪火魔君',
    title:    '圣火教主',
    subtitle: '⚠ 教主 ⚠',
    color:    '#ff6600',
    bgColor:  'rgba(60,20,0,.9)',
    taunt:    '圣火不灭，日月长存。\n你敢踏入此地——\n便已签下了生死状。',
    bgLabel:  '圣火',
    art:
`      🔥
     🔥🔥🔥
    ╱ 👁🔥👁 ╲
   ╱  ▓▓▓▓▓▓  ╲
  ╱═════════════╲
  ║  ▓ 🔥🔥 ▓  ║
  ║  ▓▓▓▓▓▓  ║
  ╚══╪══════╪══╝
    ╱│╲  ╱│╲
   ╱ │ ╲╱ │ ╲
  🔥  │     │  🔥`,
  },

  // ════════════════════════════════════════
  //  正道/中立 BOSS
  // ════════════════════════════════════════
  '华山剑派高手': {
    name:     '风无痕',
    title:    '华山剑宗长老',
    subtitle: '⚔ 剑宗试炼 ⚔',
    color:    '#d0d0d0',
    bgColor:  'rgba(30,30,40,.9)',
    taunt:    '华山剑法，一剑开山。\n你若能接我三招——\n便有资格踏上华山之巅。',
    bgLabel:  '剑宗',
    art:
`        🗡️
       ╱││╲
      ╱ │ │ ╲
     ╱  👁👁  ╲
    ╱    ═══    ╲
   ╱═════════════╲
   ║  ▓ ░░░ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  🗡️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
    ╱  │  ∧  │  ╲`,
  },

  '雷音寺方丈': {
    name:     '雷鸣禅师',
    title:    '雷音寺住持',
    subtitle: '🙏 佛门考验 🙏',
    color:    '#ffcc00',
    bgColor:  'rgba(40,30,0,.9)',
    taunt:    '阿弥陀佛。\n贫僧不杀生，但——\n若你执意向前，\n便请接贫僧一记佛光。',
    bgLabel:  '雷音',
    art:
`     ╭──☸️──╮
    ╱  👁👁  ╲
   ╱ ▓▓▓▓▓▓▓▓ ╲
  ╱═════════════╲
  ║  ▓ ☸️☠️ ║
  ║  ▓▓▓▓▓▓  ║
  ╚══╪══════╪══╝
  🙏  ╱│╲  ╱│╲  🙏
     ╱ │ ╲╱ │ ╲
  ⚡  │     │  ⚡`,
  },

  '桃花岛主': {
    name:     '花千影',
    title:    '桃花岛传人',
    subtitle: '🌸 岛主降临 🌸',
    color:    '#ff88cc',
    bgColor:  'rgba(50,10,30,.9)',
    taunt:    '落花有意，流水无情。\n我岛上每一片花瓣，\n都是一把刀。你准备好了吗？',
    bgLabel:  '桃花',
    art:
`  🌸     ╱╲     🌸
       ╱ 👁👁 ╲
  🌸  ╱ ▓▓▓▓▓▓ ╲  🌸
     ╱═════════════╲
     ║  ▓ 🌸🌸 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🌸  ╱│╲  ╱│╲  🌸
     ╱ │ ╲╱ │ ╲
  🌸  │     │  🌸`,
  },

  // ════════════════════════════════════════
  //  奇幻/妖兽 BOSS
  // ════════════════════════════════════════
  '水龙神': {
    name:     '共工',
    title:    '水龙神',
    subtitle: '🐉 古神降临 🐉',
    color:    '#00ccff',
    bgColor:  'rgba(0,20,50,.9)',
    taunt:    '洪荒之力，岂是凡人能挡？\n千年前我撞塌了不周山——\n今日，我便让这江水吞没你。',
    bgLabel:  '水龙',
    art:
`         ~~  ~~  ~~
      ~~  🐉🐉🐉🐉🐉  ~~
    ~~  🐉██████████🐉  ~~
   ~~ 🐉██░░████░░██🐉 ~~
  ~~ 🐉██░░░████░░░██🐉 ~~
  ~~ 🐉██████████████🐉 ~~
   ~~  🐉██░░████░░██🐉  ~~
    ~~  🐉██████████🐉  ~~
      ~~  🐉🐉🐉🐉🐉  ~~
      ~~~~~~~~~~~~~~~
     ~~~~~~~~~~~~~~~~~~`,
  },

  '白鳞女皇': {
    name:     '素姬',
    title:    '白鳞妖后',
    subtitle: '🐍 苗疆蛇皇 🐍',
    color:    '#88ff88',
    bgColor:  'rgba(0,30,10,.9)',
    taunt:    '嘶嘶……\n千年修炼的毒，一滴便可毙命。\n你不是来闯荡的——\n你是来送死的。',
    bgLabel:  '蛇皇',
    art:
`        ╭──🐍──╮
       │ ╱🐍🐍🐍╲ │
       │╱🐍🐍🐍🐍🐍╲│
       │🐍🐍👁🐍👁🐍🐍│
       │╲🐍🐍🐍🐍🐍╱│
       │ ╲🐍🐍🐍╱ │
        ╰──🐍──╯
     🐍🐍🐍🐍🐍🐍🐍🐍🐍
    🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍
   🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍
  🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍🐍`,
  },

  '亡灵之王': {
    name:     '幽冥君',
    title:    '千年尸王',
    subtitle: '💀 亡灵领主 💀',
    color:    '#9966cc',
    bgColor:  'rgba(30,10,40,.9)',
    taunt:    '你以为死亡是终点？\n不……死亡，是永恒的开始。\n而我，便是永恒本身。',
    bgLabel:  '亡灵',
    art:
`    ╔══════════════╗
    ║  ☠️  👑  ☠️  ║
    ║ ┌──────────┐ ║
    ║ │ 👁    👁 │ ║
    ║ │  ╲──╱   │ ║
    ║ └──────────┘ ║
    ╠══════════════╣
    ║ ░░░░░░░░░░░░ ║
    ║ ░▒▓█ 死 █▓▒░ ║
    ║ ░░░░░░░░░░░░ ║
    ╚══════════════╝
    💀💀💀💀💀💀💀💀💀`,
  },

  // ════════════════════════════════════════
  //  门派/帮派 BOSS
  // ════════════════════════════════════════
  '玄冥教双煞': {
    name:     '玄冥双煞',
    title:    '寒血双魔',
    subtitle: '⚠ 双人合击 ⚠',
    color:    '#6688ff',
    bgColor:  'rgba(10,10,50,.9)',
    taunt:    '（寒）你越热，我便越强。\n（血）你越强，我便越嗜血。\n（合）二人同心，天下无敌。',
    bgLabel:  '双煞',
    art:
`    ❄️          🩸
   ╱│╲        ╱│╲
  ╱ 👁╲      ╱👁 ╲
 ╱▓▓▓▓╲    ╱▓▓▓▓╲
 ║ ▓▓ ║    ║ ▓▓ ║
 ╚═╪══╝    ╚═╪══╝
  ╱│╲        ╱│╲
 ╱ │ ╲  ✖  ╱ │ ╲
╱  │  ╲╱╲╱  │  ╲
     ❄️╲  ╱🩸`,
  },

  '光明左使': {
    name:     '炎烈',
    title:    '明教光明左使',
    subtitle: '☀ 四使之首 ☀',
    color:    '#ffaa00',
    bgColor:  'rgba(50,30,0,.9)',
    taunt:    '圣火燃尽之前，\n光明不会降临。\n而我——便是最后的火种。',
    bgLabel:  '光明',
    art:
`     ☀️☀️☀️☀️☀️
      ╱ 👁👁 ╲
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ☀️☀️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  🔥  ╱│╲  ╱│╲  🔥
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '机关城主': {
    name:     '千机子',
    title:    '机关堡堡主',
    subtitle: '⚙ 机关之巅 ⚙',
    color:    '#aa8844',
    bgColor:  'rgba(30,20,10,.9)',
    taunt:    '齿轮咬合，机关万变。\n你面对的不是一个人——\n而是一整座堡垒。',
    bgLabel:  '千机',
    art:
`   ⚙️    ╱││╲    ⚙️
       ╱ ⚙👁⚙ ╲
  ⚙️ ╱ ▓▓▓▓▓▓▓▓ ╲ ⚙️
   ╱═══════════════╲
   ║  ▓ ⚙⚙⚙ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  ⚙️  ╱│╲  ╱│╲  ⚙️
     ╱ │ ╲╱ │ ╲
    ╱  │  ∧  │  ╲`,
  },

  '海沙帮主': {
    name:     '铁锚鲨',
    title:    '海沙帮当家',
    subtitle: '⚓ 东海霸王 ⚓',
    color:    '#44bbcc',
    bgColor:  'rgba(0,30,40,.9)',
    taunt:    '海上的规矩你不懂？\n谁的拳头大，谁就是王。\n而我的拳头——比铁锚还硬。',
    bgLabel:  '海沙',
    art:
`       ⚓
      ╱││╲
     ╱ 👁👁 ╲
    ╱ ▓▓▓▓▓▓ ╲
   ╱═════════════╲
   ║  ▓ 🦷🦷 ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  🦈  ╱│╲  ╱│╲  ⚓
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '沙漠霸主': {
    name:     '孛罗',
    title:    '黄沙魔王',
    subtitle: '🏜 沙漠之神 🏜',
    color:    '#ddaa44',
    bgColor:  'rgba(40,30,0,.9)',
    taunt:    '这片沙漠，埋了无数英雄。\n你的骨头——\n会成为下一座沙丘。',
    bgLabel:  '黄沙',
    art:
`  ☀️   ╱ 👑 ╲   ☀️
     ╱ ☠️👁👁 ╲
    ╱ ▓▓▓▓▓▓▓▓ ╲
   ╱═══════════════╲
   ║  ▓ 🏜️🏜️ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
   🐪  ╱│╲  ╱│╲  🐪
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '铜人罗汉': {
    name:     '金身罗汉',
    title:    '少林铜人阵·终阶',
    subtitle: '🥉 铜人之巅 🥉',
    color:    '#cc9933',
    bgColor:  'rgba(30,25,10,.9)',
    taunt:    '铜皮铁骨，金刚不坏。\n一拳碎山，一掌裂地。\n施主——请赐教。',
    bgLabel:  '铜人',
    art:
`      ╔═ 👁 👁 ═╗
      ║   ═══    ║
      ║ ▓▓▓▓▓▓▓▓ ║
     ╱═════════════╲
     ║ ▓ 👊👊 ▓ ║
     ║ ▓▓▓▓▓▓▓▓ ║
     ╚══╪══════╪══╝
     ═══╪══════╪════
        ║▓▓▓▓▓▓║
        ║▓▓  ▓▓▓║
       ╱╱╱╱    ╲╲╲╲`,
  },

  '西域入侵者首领': {
    name:     '索命罗刹',
    title:    '外道首领',
    subtitle: '⚠ 密宗魔功 ⚠',
    color:    '#cc4444',
    bgColor:  'rgba(40,10,10,.9)',
    taunt:    '密宗秘法，岂是你们中原人能懂的？\n这座密寺……\n从今日起，归我了。',
    bgLabel:  '罗刹',
    art:
`  🔱   ╱ 🔱🔱 ╲   🔱
     ╱ ☠️👁👁☠️ ╲
    ╱ ▓▓▓▓▓▓▓▓ ╲
   ╱═══════════════╲
   ║  ▓ 🔱🔱 ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
      ╱│╲  ╱│╲
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '蛊名子': {
    name:     '蛊名子',
    title:    '五毒教蛊师',
    subtitle: '🦂 蛊毒双绝 🦂',
    color:    '#44cc44',
    bgColor:  'rgba(10,30,10,.9)',
    taunt:    '我的蛊虫闻到了你身上的血味……\n它说——鲜美。\n你确定要继续吗？',
    bgLabel:  '蛊毒',
    art:
` 🦂     ╱ 👁👁 ╲     🦂
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🐛🐛 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🦂  ╱│╲  ╱│╲  🦂
     ╱ │ ╲╱ │ ╲
  🐛  │     │  🐛`,
  },

  '西夏英灵': {
    name:     '残魂',
    title:    '末代国师',
    subtitle: '👻 密宗遗恨 👻',
    color:    '#8888dd',
    bgColor:  'rgba(15,15,40,.9)',
    taunt:    '西夏已亡百年……\n但我的执念，\n比你想象的要漫长得多。',
    bgLabel:  '西夏',
    art:
`   ☁️  ╱ 👁👁 ╲  ☁️
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ☸️☸️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
   ☁️  ╱│╲  ╱│╲  ☁️
     ╱ │ ╲╱ │ ╲
  👻  │     │  👻`,
  },

  // ════════════════════════════════════════
  //  中级 BOSS（特色副本首领）
  // ════════════════════════════════════════
  '天山冰魄': {
    name:     '天山冰魄',
    title:    '冰灵之王',
    subtitle: '❄️ 极寒之主 ❄️',
    color:    '#88ddff',
    bgColor:  'rgba(0,30,50,.9)',
    taunt:    '这里的温度——零下百度。\n你的血液，三息之内就会凝固。\n做好变成冰雕的准备了吗？',
    bgLabel:  '冰魄',
    art:
`  ❄️  ╱ ◇◑◇ ╲  ❄️
    ╱ ▓▓▓▓▓▓ ╲
   ╱═════════════╲
   ║  ▓ ❄️❄️ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
   ❄️  ╱│╲  ╱│╲  ❄️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '墓穴鬼王': {
    name:     '鬼王',
    title:    '千年怨灵',
    subtitle: '💀 古墓之主 💀',
    color:    '#aa88cc',
    bgColor:  'rgba(20,10,30,.9)',
    taunt:    '百年了……终于有人闯进来。\n可惜——\n你进来了，就别想出去。',
    bgLabel:  '鬼王',
    art:
`  💀   ╱ 👁👁 ╲   💀
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 💀💀 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
      ╱│╲  ╱│╲
     ╱ │ ╲╱ │ ╲
  💀  │     │  💀`,
  },

  '苗疆蛊王': {
    name:     '巫蛊婆婆',
    title:    '苗疆蛊王',
    subtitle: '🦋 百岁蛊婆 🦋',
    color:    '#66cc66',
    bgColor:  'rgba(10,25,10,.9)',
    taunt:    '嘻嘻……小姑娘（小伙子），\n老婆子这蛊虫，闻到你的味道了——\n它说，好香。',
    bgLabel:  '蛊王',
    art:
` 🦋    ╱ 👁🦋👁 ╲    🦋
     ╱ ▓▓▓▓▓▓▓▓ ╲
    ╱═══════════════╲
    ║  ▓ 🐛🐛 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
   🐛  ╱│╲  ╱│╲  🐛
     ╱ │ ╲╱ │ ╲
  🦋  │     │  🦋`,
  },

  '武当叛徒': {
    name:     '贪风',
    title:    '武当叛徒',
    subtitle: '⚔ 背道而行 ⚔',
    color:    '#aaaacc',
    bgColor:  'rgba(15,15,30,.9)',
    taunt:    '武当的规矩？哈哈哈……\n规矩是给弱者定的。\n我偷了秘典，练了真功——\n如今谁还拦得住我？',
    bgLabel:  '叛徒',
    art:
`       ⚔️
      ╱││╲
     ╱ 👁👁 ╲
    ╱ ▓▓▓▓▓▓ ╲
   ╱═════════════╲
   ║  ▓ ⚔️⚔️ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  ⚔️  ╱│╲  ╱│╲
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '走私枭雄': {
    name:     '银牙罗',
    title:    '东海走私第一人',
    subtitle: '⚓ 枭雄本色 ⚓',
    color:    '#ccaa44',
    bgColor:  'rgba(30,25,5,.9)',
    taunt:    '白银铸牙——不是装饰，\n是宣告。\n这东海的规矩，我说了算。',
    bgLabel:  '银牙',
    art:
`  ⚓   ╱ 👁👁 ╲   ⚓
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓🦷🦷🦷▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
      ╱│╲  ╱│╲
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '草原霸主': {
    name:     '铁木真格',
    title:    '草原马贼之王',
    subtitle: '🐴 草原之鹰 🐴',
    color:    '#88aa44',
    bgColor:  'rgba(20,25,5,.9)',
    taunt:    '草原上没有墙，\n只有风——和我的马蹄。\n你跑不掉的。',
    bgLabel:  '草原',
    art:
`  🐴   ╱ 👁👁 ╲   🐴
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 🏹🏹 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
   🐴  ╱│╲  ╱│╲  🐴
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '腐骨真人': {
    name:     '腐骨真人',
    title:    '问道阁主',
    subtitle: '🔮 邪丹炼道 🔮',
    color:    '#996633',
    bgColor:  'rgba(25,15,5,.9)',
    taunt:    '百年炼丹……我已炼去了皮肉、\n炼去了贪嗔痴。\n剩下的，只有道。\n和——不死。',
    bgLabel:  '腐骨',
    art:
`  🔥   ╱ 👁👁 ╲   🔥
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ☸️☢️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
      ╱│╲  ╱│╲
     ╱ │ ╲╱ │ ╲
  🔥  │     │  🔥`,
  },

  '瘴气王': {
    name:     '绿化尸',
    title:    '百年瘴气之精',
    subtitle: '🌿 瘴气之源 🌿',
    color:    '#44aa44',
    bgColor:  'rgba(10,25,10,.9)',
    taunt:    '你闻到了吗？\n那是……你的身体在腐烂的味道。\n越呼吸，越接近我。',
    bgLabel:  '瘴气',
    art:
`🌿🌿   ╱ ☠️👁☠️ ╲   🌿🌿
    ╱ ▓▓▓▓▓▓▓▓ ╲
   ╱═══════════════╲
   ║  ▓ ☠️☠️ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  🌿  ╱│╲  ╱│╲  🌿
     ╱ │ ╲╱ │ ╲
  🌿  │     │  🌿`,
  },

  '黄河老龙': {
    name:     '黄河老龙',
    title:    '漕帮寨主',
    subtitle: '🌊 一方水霸 🌊',
    color:    '#6688cc',
    bgColor:  'rgba(10,15,35,.9)',
    taunt:    '黄河水，浑是浑了点——\n但淹死的人，不比你的江湖少。\n在我的地盘，水就是规矩。',
    bgLabel:  '漕帮',
    art:
` ≈≈   ╱ 👁👁 ╲   ≈≈
    ╱ ▓▓▓▓▓▓ ╲
   ╱═════════════╲
   ║  ▓ 🌊🌊 ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  ≈≈  ╱│╲  ╱│╲  ≈≈
     ╱ │ ╲╱ │ ╲
  ≈≈  │     │  ≈≈`,
  },

  // ════════════════════════════════════════
  //  高级 BOSS（精英副本）
  // ════════════════════════════════════════
  '刀剑独孤': {
    name:     '刀剑独孤',
    title:    '昆仑神宫侵占者',
    subtitle: '⚔ 以力破道 ⚔',
    color:    '#cc8844',
    bgColor:  'rgba(30,20,10,.9)',
    taunt:    '昆仑派的祖师算什么？\n他的剑——在我面前，不过是一根铁棍。\n秘宝，我要定了。',
    bgLabel:  '昆仑',
    art:
`  ⚔️     ╱ 👁👁 ╲     🗡️
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ ⚔️🗡️ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  ⚔️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '无剑老人': {
    name:     '无剑老人',
    title:    '剑冢守灵',
    subtitle: '🗡️ 剑道终传 🗡️',
    color:    '#ccccdd',
    bgColor:  'rgba(20,20,25,.9)',
    taunt:    '剑……早已不在手中。\n因为——万物皆剑。\n你若懂了，便是我传人。',
    bgLabel:  '剑冢',
    art:
`  ✨    ╱ 👻👁👻 ╲    ✨
      ╱ ▓▓▓▓▓▓▓▓ ╲
     ╱═══════════════╲
     ║  ▓ ─── ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🗡️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
  ✨  │     │  ✨`,
  },

  '火祭司': {
    name:     '火祭司',
    title:    '炼狱之主',
    subtitle: '🌋 半人半火 🌋',
    color:    '#ff4400',
    bgColor:  'rgba(40,15,0,.9)',
    taunt:    '你看到我身上的火焰了吗？\n这不是火——这是信仰。\n不灭的信仰。',
    bgLabel:  '炼狱',
    art:
` 🔥   ╱ 👁══👁 ╲   🔥
    ╱ ▓▓▓▓▓▓▓▓ ╲
   ╱═══════════════╲
   ║  ▓ 🔥🔥 ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  🔥  ╱│╲  ╱│╲  🔥
     ╱ │ ╲╱ │ ╲
  🔥  │     │  🔥`,
  },

  '无字禅': {
    name:     '无字禅',
    title:    '偷经贼首',
    subtitle: '📖 叛僧归途 📖',
    color:    '#ccaa66',
    bgColor:  'rgba(25,20,10,.9)',
    taunt:    '少林说——偷经者不可恕。\n可他们不知道，\n经书……从来都不是偷的。\n是它自己跑来的。',
    bgLabel:  '无字',
    art:
`  📖   ╱ 👁👁 ╲   📖
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 📖📖 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  📖  ╱│╲  ╱│╲  📖
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '严铁面': {
    name:     '严铁面',
    title:    '腐败阁老',
    subtitle: '🔒 权倾朝野 🔒',
    color:    '#888888',
    bgColor:  'rgba(20,20,20,.9)',
    taunt:    '你以为你是正义的？\n在这诏狱里——\n我说的正义，才是正义。\n而你的命，一文不值。',
    bgLabel:  '诏狱',
    art:
`  🔒   ╱ 👁👁 ╲   🔒
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 📜📜 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
      ╱│╲  ╱│╲
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '碧浪君': {
    name:     '碧浪君',
    title:    '南海鲛王',
    subtitle: '🪸 鲛族之王 🪸',
    color:    '#22ccaa',
    bgColor:  'rgba(0,25,25,.9)',
    taunt:    '陆地人……\n你们总是忘了，大海——\n才是这个世界的主人。',
    bgLabel:  '鲛王',
    art:
` ≈≈   ╱ 👁👁 ╲   ≈≈
    ╱ ▓▓▓▓▓▓ ╲
   ╱═════════════╲
   ║  ▓ 🪸🪸 ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
 ≈≈  ╱│╲  ╱│╲  ≈≈
     ╱ │ ╲╱ │ ╲
  🐬  │     │  🐬`,
  },

  '霹雳尊者': {
    name:     '霹雳尊者',
    title:    '天雷老魔',
    subtitle: '⚡ 雷法入魔 ⚡',
    color:    '#ffee44',
    bgColor:  'rgba(30,30,5,.9)',
    taunt:    '你看天上那道雷吗？\n那不是天罚——那是我的命令。\n现在，轮到你了。',
    bgLabel:  '天雷',
    art:
`  ⚡   ╱ 👁  👁 ╲   ⚡
    ╱ ▓▓▓▓▓▓▓▓ ╲
   ╱═══════════════╲
   ║  ▓ ⚡⚡ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  ⚡  ╱│╲  ╱│╲  ⚡
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '寒骨真人': {
    name:     '寒骨真人',
    title:    '冰封镇守',
    subtitle: '🧊 玄冥寒功第一 🧊',
    color:    '#44ccff',
    bgColor:  'rgba(0,15,35,.9)',
    taunt:    '我在这冰窖里……\n已经站了一百年。\n脚下的冰——都是别人的。\n下一个，是你。',
    bgLabel:  '寒骨',
    art:
` 🧊   ╱ ◇◑◇ ╲   🧊
    ╱ ▓▓▓▓▓▓▓▓ ╲
   ╱═══════════════╲
   ║  ▓ ❄️❄️ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  🧊  ╱│╲  ╱│╲  🧊
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '十三刀绝': {
    name:     '十三刀绝',
    title:    '刀塔塔主',
    subtitle: '🗡️ 无上刀道 🗡️',
    color:    '#dd4444',
    bgColor:  'rgba(30,10,10,.9)',
    taunt:    '千余人登塔，无人见过十三刀。\n你知道为什么吗？\n……因为见过的人，都不在了。',
    bgLabel:  '刀塔',
    art:
`  🗡️    ╱ 👁👁 ╲    🗡️
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🗡️🗡️ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🗡️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '血魔尸王': {
    name:     '血魔尸王',
    title:    '万魔化身',
    subtitle: '😈 不死不灭 😈',
    color:    '#cc0033',
    bgColor:  'rgba(40,0,5,.9)',
    taunt:    '我是万魔的集合——\n每一缕怨气，每一滴血，\n都凝聚在我体内。\n你杀不死死灵。',
    bgLabel:  '万魔',
    art:
`  😈   ╱ 👁💀👁 ╲   😈
     ╱ ▓▓▓▓▓▓▓▓ ╲
    ╱═══════════════╲
    ║  ▓ 🩸🩸 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  😈  ╱│╲  ╱│╲  😈
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '剑意残魂': {
    name:     '剑意残魂',
    title:    '剑谷护法',
    subtitle: '🌟 上古剑仙 🌟',
    color:    '#eeeeff',
    bgColor:  'rgba(15,15,25,.9)',
    taunt:    '千年已过……剑意犹在。\n你带着凡人的傲慢踏入圣地——\n那就让我看看，\n你的剑，够不够格。',
    bgLabel:  '剑仙',
    art:
`  ✨   ╱ 👻👁👻 ╲   ✨
      ╱ ▓▓▓▓▓▓▓▓ ╲
     ╱═══════════════╲
     ║  ▓ 🗡️🗡️ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🗡️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
  ✨  │     │  ✨`,
  },

  '阴阳尸祖': {
    name:     '阴阳尸祖',
    title:    '两仪大魔',
    subtitle: '☯️ 冰火合一 ☯️',
    color:    '#cc66cc',
    bgColor:  'rgba(25,5,25,.9)',
    taunt:    '冰与火，阴与阳——\n你以为它们是对立的？\n在我体内，它们是同一把刀。\n一刀下去，生不如死。',
    bgLabel:  '两仪',
    art:
` 🔥   ╱ 👁  👁 ╲   ❄️
    ╱ ▓▓▓▓▓▓▓▓ ╲
   ╱═══════════════╲
   ║  ▓ ☯️☯️ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  🔥  ╱│╲  ╱│╲  ❄️
     ╱ │ ╲╱ │ ╲
  🔥  │     │  ❄️`,
  },

  // ════════════════════════════════════════
  //  低级/趣味 BOSS
  // ════════════════════════════════════════
  '黑背熊王': {
    name:     '黑背熊王',
    title:    '山中霸主',
    subtitle: '🐻 力大如山 🐻',
    color:    '#886633',
    bgColor:  'rgba(25,18,8,.9)',
    taunt:    '吼——！！\n（翻译：这片山头是我的，你来干什么？）',
    bgLabel:  '熊王',
    art:
`      ╭──🐻──╮
     ╭╯      ╰╮
     │  👁👁  │
     │  ╲══╱  │
     ╰╮      ╭╯
      │ 🐻🐻 │
      │ 🐻🐻 │
    ──╨──────╨──
     ▓▓▓▓▓▓▓▓▓▓`,
  },

  '铁锤孙': {
    name:     '铁锤孙',
    title:    '矿区一霸',
    subtitle: '⛏ 铁锤横行 ⛏',
    color:    '#997744',
    bgColor:  'rgba(25,18,8,.9)',
    taunt:    '这矿里，\n谁拳头大谁说了算。\n而我——有一把大铁锤。',
    bgLabel:  '铁锤',
    art:
`        🔨
       ╱││╲
      ╱ 👁👁 ╲
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 🔨🔨 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
      ╱│╲  ╱│╲
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '截道鬼': {
    name:     '方七害',
    title:    '截道鬼',
    subtitle: '🗡️ 悬赏五百两 🗡️',
    color:    '#aa6633',
    bgColor:  'rgba(25,15,5,.9)',
    taunt:    '五百两？哈！\n我的脑袋值一千两。\n可惜——没人拿得走。',
    bgLabel:  '截道',
    art:
`  🗡️   ╱ 👁👁 ╲   🗡️
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 🗡️🗡️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  🗡️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '钱老狗': {
    name:     '钱老狗',
    title:    '野道门坛主',
    subtitle: '📚 表里不一 📚',
    color:    '#668866',
    bgColor:  'rgba(10,18,10,.9)',
    taunt:    '（推了推眼镜）\n"学而时习之，不亦说乎？"\n……好了，上课结束。\n现在——受死。',
    bgLabel:  '野道',
    art:
`  📚   ╱ 👁👁 ╲   📚
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 📖📖 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  📚  ╱│╲  ╱│╲  📚
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  // ════════════════════════════════════════
  //  补充BOSS（data-enemies.js type=boss 缺失的）
  // ════════════════════════════════════════
  '燕山猎王': {
    name:     '燕山猎王',
    title:    '关外第一猎手',
    subtitle: '🏹 燕山之王 🏹',
    color:    '#88aa44',
    bgColor:  'rgba(20,30,10,.9)',
    taunt:    '燕山深处，猎物无数——\n而你，是最肥的那一个。',
    bgLabel:  '燕山',
    art:
`  🏹     ╱ 👁👁 ╲     🏹
       ╱ ▓▓▓▓▓▓ ╲
      ╱═════════════╲
      ║  ▓ 🏹🏹 ▓  ║
      ║  ▓▓▓▓▓▓  ║
      ╚══╪══════╪══╝
    🏹  ╱│╲  ╱│╲  🏹
       ╱ │ ╲╱ │ ╲
      ╱  │     │  ╲`,
  },

  '血骨门祭坛主': {
    name:     '血骨门祭坛主',
    title:    '血骨门祭坛守护者',
    subtitle: '☠ 祭坛之主 ☠',
    color:    '#aa2244',
    bgColor:  'rgba(50,5,15,.9)',
    taunt:    '血祭坛前，万骨枯——\n你将成为新的祭品。',
    bgLabel:  '祭坛',
    art:
`     ☠️
    ╱ 👁👁 ╲
   ╱ ▓▓▓▓▓▓ ╲
  ╱═════════════╲
  ║  ▓ ☠️☠️ ▓  ║
  ║  ▓▓▓▓▓▓  ║
  ╚══╪══════╪══╝
  🩸  ╱│╲  ╱│╲  🩸
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '五毒教教主': {
    name:     '五毒教教主',
    title:    '五毒圣女',
    subtitle: '🐍 万毒之尊 🐍',
    color:    '#44bb44',
    bgColor:  'rgba(5,25,5,.9)',
    taunt:    '五毒入体，百步倒地——\n你闻到香味了吗？那已是毒。',
    bgLabel:  '五毒',
    art:
` 🐍🐍   ╱ 👁👁 ╲   🐍🐍
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🐍🐍 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🦂   ╱│╲  ╱│╲   🦂
      ╱ │ ╲╱ │ ╲
     ╱  │     │  ╲`,
  },

  '铜人守护者': {
    name:     '铜人守护者',
    title:    '少林铜人阵·守关',
    subtitle: '🥉 金刚不坏 🥉',
    color:    '#cc9933',
    bgColor:  'rgba(30,25,10,.9)',
    taunt:    '铜人阵中，铜皮铁骨——\n想过去？先过我这一关。',
    bgLabel:  '铜人',
    art:
`    ╔═ 👁 👁 ═╗
    ║   ═══    ║
    ║ ▓▓▓▓▓▓▓▓ ║
   ╱═════════════╲
   ║  ▓ ✊✊ ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
      ══╪══╪══
       ║▓▓▓▓║`,
  },

  '禁军统领': {
    name:     '禁军统领',
    title:    '御前侍卫统领',
    subtitle: '🛡 天子亲军 🛡',
    color:    '#cc8844',
    bgColor:  'rgba(30,20,10,.9)',
    taunt:    '大明禁军在此——\n闲杂人等，格杀勿论。',
    bgLabel:  '禁军',
    art:
`  🛡️    ╱ 👁👁 ╲    🛡️
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🛡️🗡️ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🛡️  ╱│╲  ╱│╲  🛡️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '昆仑武尊': {
    name:     '昆仑武尊',
    title:    '昆仑派掌门',
    subtitle: '🏔 昆仑之巅 🏔',
    color:    '#88ccff',
    bgColor:  'rgba(10,20,40,.9)',
    taunt:    '昆仑山上，云深不知处——\n能走到这里，你已不凡。\n但还不够。',
    bgLabel:  '昆仑',
    art:
`  🏔️   ╱ 👁👁 ╲   🏔️
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ⚔️⚔️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  🏔️  ╱│╲  ╱│╲  🏔️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '河龙王': {
    name:     '河龙王',
    title:    '东海龙族',
    subtitle: '🐉 龙王驾到 🐉',
    color:    '#2288cc',
    bgColor:  'rgba(5,20,40,.9)',
    taunt:    '吾乃河中之王——\n凡人，跪下。',
    bgLabel:  '龙王',
    art:
`     ~~  🐉🐉🐉  ~~
  ~~  🐉████████🐉  ~~
  ~~ 🐉██░░████░██🐉 ~~
  ~~ 🐉████████████🐉 ~~
  ~~  🐉██░░████░██🐉  ~~
     ~~  🐉🐉🐉🐉  ~~
      ~~~~~~~~~~~~~~~`,
  },

  '水贼首领': {
    name:     '水贼首领',
    title:    '水匪大当家',
    subtitle: '⚓ 水上霸王 ⚓',
    color:    '#44aaaa',
    bgColor:  'rgba(10,25,30,.9)',
    taunt:    '这片水域——\n我说的算！',
    bgLabel:  '水贼',
    art:
`  ⚓    ╱ 👁👁 ╲    ⚓
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ ⚔️⚓ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  ≈≈  ╱│╲  ╱│╲  ≈≈
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '珊瑚海王': {
    name:     '珊瑚海王',
    title:    '海底霸主',
    subtitle: '🪸 深海之王 🪸',
    color:    '#ff66aa',
    bgColor:  'rgba(30,10,25,.9)',
    taunt:    '海底的规矩你不懂——\n在这里，潮汐听我的。',
    bgLabel:  '珊瑚',
    art:
` ≈≈   ╱ 👁👁 ╲   ≈≈
    ╱ ▓▓▓▓▓▓ ╲
   ╱═════════════╲
   ║  ▓ 🪸🪸 ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  🐠  ╱│╲  ╱│╲  🐠
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '冰宫守护者': {
    name:     '冰宫守护者',
    title:    '极北冰宫守卫',
    subtitle: '❄️ 冰封千年 ❄️',
    color:    '#88ddff',
    bgColor:  'rgba(0,20,40,.9)',
    taunt:    '冰宫之门，岂是凡人能开？\n你的血液，会在三息内凝固。',
    bgLabel:  '冰宫',
    art:
`  ❄️   ╱ ◇◑◇ ╲   ❄️
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ❄️❄️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  ❄️  ╱│╲  ╱│╲  ❄️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '冰原霸主': {
    name:     '冰原霸主',
    title:    '极地之王',
    subtitle: '🌨 冰原领主 🌨',
    color:    '#66ccee',
    bgColor:  'rgba(0,15,35,.9)',
    taunt:    '在这片冰原上——\n温度比我低的，只有尸体。',
    bgLabel:  '冰原',
    art:
`  🌨️   ╱ 👁👁 ╲   🌨️
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ❄️❄️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  🏔️  ╱│╲  ╱│╲  🏔️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '火焰冠军': {
    name:     '火焰冠军',
    title:    '火域试炼冠军',
    subtitle: '🔥 火之王者 🔥',
    color:    '#ff6600',
    bgColor:  'rgba(40,15,0,.9)',
    taunt:    '你踩进了我的领域——\n这里只有灰烬，和败者。',
    bgLabel:  '火焰',
    art:
`  🔥   ╱ 👁══👁 ╲   🔥
     ╱ ▓▓▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 🔥🔥 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  🔥  ╱│╲  ╱│╲  🔥
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '冰火阴阳使': {
    name:     '冰火阴阳使',
    title:    '两仪使者',
    subtitle: '☯️ 冰火双生 ☯️',
    color:    '#cc66cc',
    bgColor:  'rgba(25,5,25,.9)',
    taunt:    '冰与火，相生相克——\n在我体内，它们是同一把刀。',
    bgLabel:  '阴阳',
    art:
`  ❄️   ╱ 👁  👁 ╲   🔥
     ╱ ▓▓▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ☯️☯️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  ❄️  ╱│╲  ╱│╲  🔥
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '剑岛守护者': {
    name:     '剑岛守护者',
    title:    '剑岛隐者',
    subtitle: '⚔ 剑气纵横 ⚔',
    color:    '#aaaacc',
    bgColor:  'rgba(15,15,25,.9)',
    taunt:    '剑岛之上，寸剑为界——\n你越过了，便是死路。',
    bgLabel:  '剑岛',
    art:
`  ⚔️     ╱ 👁👁 ╲     🗡️
       ╱ ▓▓▓▓▓▓ ╲
      ╱═════════════╲
      ║  ▓ ⚔️🗡️ ▓  ║
      ║  ▓▓▓▓▓▓  ║
      ╚══╪══════╪══╝
   ⚔️  ╱│╲  ╱│╲  🗡️
      ╱ │ ╲╱ │ ╲
     ╱  │     │  ╲`,
  },

  '剑宗大师': {
    name:     '剑宗大师',
    title:    '剑宗长老',
    subtitle: '⚔ 剑道宗师 ⚔',
    color:    '#bbbbee',
    bgColor:  'rgba(15,15,25,.9)',
    taunt:    '一剑开天——\n你想看看吗？',
    bgLabel:  '剑宗',
    art:
`  🗡️    ╱ 👁👁 ╲    🗡️
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🗡️🗡️ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🗡️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '剑宗守护者': {
    name:     '剑宗守护者',
    title:    '剑宗护法',
    subtitle: '⚔ 守剑之人 ⚔',
    color:    '#9999cc',
    bgColor:  'rgba(15,15,25,.9)',
    taunt:    '此地乃剑宗圣地——\n无令不得入内。',
    bgLabel:  '剑宗',
    art:
`  ⚔️     ╱ 👁👁 ╲
       ╱ ▓▓▓▓▓▓ ╲
      ╱═════════════╲
      ║  ▓ ⚔️⚔️ ▓  ║
      ║  ▓▓▓▓▓▓  ║
      ╚══╪══════╪══╝
  ⚔️   ╱│╲  ╱│╲   ⚔️
      ╱ │ ╲╱ │ ╲
     ╱  │     │  ╲`,
  },

  '剑宗宗师': {
    name:     '剑宗宗师',
    title:    '剑宗掌门',
    subtitle: '⚔ 一剑破万法 ⚔',
    color:    '#ddddee',
    bgColor:  'rgba(15,15,25,.9)',
    taunt:    '千剑归宗——\n你是来送剑，还是来送命？',
    bgLabel:  '剑宗',
    art:
`  ✨    ╱ 👁👁 ╲    ✨
      ╱ ▓▓▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🗡️🗡️ 🗡️  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🗡️  ╱│╲  ╱│╲  🗡️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '苗蛊之王': {
    name:     '苗蛊之王',
    title:    '蛊毒至尊',
    subtitle: '🦂 蛊王之尊 🦂',
    color:    '#44bb44',
    bgColor:  'rgba(5,25,5,.9)',
    taunt:    '我的蛊虫，闻到了你的恐惧——\n它说……好吃。',
    bgLabel:  '蛊王',
    art:
`  🐛     ╱ 👁👁 ╲     🐛
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🐛🐛 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🦂  ╱│╲  ╱│╲  🦂
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '瘴气之王': {
    name:     '瘴气之王',
    title:    '万年毒瘴',
    subtitle: '☠ 瘴气之源 ☠',
    color:    '#55aa55',
    bgColor:  'rgba(10,25,10,.9)',
    taunt:    '深吸一口——\n这瘴气，比毒还甜。',
    bgLabel:  '瘴气',
    art:
`  🌿🌿   ╱ ☠️👁☠️ ╲   🌿🌿
      ╱ ▓▓▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ ☠️☠️ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  🌿  ╱│╲  ╱│╲  🌿
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '走私者头目': {
    name:     '走私者头目',
    title:    '黑市大枭',
    subtitle: '💰 暗夜之主 💰',
    color:    '#aa8844',
    bgColor:  'rgba(25,20,5,.9)',
    taunt:    '黑白两道，通吃——\n你的命，值多少？',
    bgLabel:  '黑市',
    art:
`  💰    ╱ 👁👁 ╲    💰
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 💰💰 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  ⚓  ╱│╲  ╱│╲  ⚓
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '运河霸主': {
    name:     '运河霸主',
    title:    '漕运之王',
    subtitle: '🌊 运河之主 🌊',
    color:    '#5588bb',
    bgColor:  'rgba(10,15,30,.9)',
    taunt:    '大运河上——\n每一滴水都听我的。',
    bgLabel:  '漕运',
    art:
` ≈≈   ╱ 👁👁 ╲   ≈≈
    ╱ ▓▓▓▓▓▓ ╲
   ╱═════════════╲
   ║  ▓ 🌊🌊 ▓  ║
   ║  ▓▓▓▓▓▓  ║
   ╚══╪══════╪══╝
  ≈≈  ╱│╲  ╱│╲  ≈≈
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '古墓之主': {
    name:     '古墓之主',
    title:    '千年墓灵',
    subtitle: '💀 墓中不死者 💀',
    color:    '#9966cc',
    bgColor:  'rgba(20,10,30,.9)',
    taunt:    '你以为你能活着出去？\n哈哈哈哈哈……',
    bgLabel:  '古墓',
    art:
`  💀   ╱ 👁👁 ╲   💀
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 💀💀 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  💀  ╱│╲  ╱│╲  💀
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '低阶鬼王': {
    name:     '低阶鬼王',
    title:    '幽冥小王',
    subtitle: '👻 百怨之鬼 👻',
    color:    '#8866aa',
    bgColor:  'rgba(20,10,25,.9)',
    taunt:    '嘿嘿嘿……\n你的阳气，好香啊……',
    bgLabel:  '鬼王',
    art:
`  👻   ╱ 👁👁 ╲   👻
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 👻👻 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  👻  ╱│╲  ╱│╲  👻
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '黑道妖道大师': {
    name:     '黑道妖道大师',
    title:    '邪术宗师',
    subtitle: '☯️ 阴阳颠倒 ☯️',
    color:    '#666688',
    bgColor:  'rgba(15,10,25,.9)',
    taunt:    '正道？邪道？\n在你死的那一刻——\n它们没什么区别。',
    bgLabel:  '妖道',
    art:
`  ☯️   ╱ 👁👁 ╲   ☯️
     ╱ ▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ ☯️☢️ ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  ☯️  ╱│╲  ╱│╲  ☯️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '魔鬼冠军': {
    name:     '魔鬼冠军',
    title:    '地府武尊',
    subtitle: '😈 幽冥战神 😈',
    color:    '#cc2244',
    bgColor:  'rgba(30,5,10,.9)',
    taunt:    '地狱竞技场——\n我从未输过。你也不会例外。',
    bgLabel:  '魔鬼',
    art:
`  😈   ╱ 👁💀👁 ╲   😈
     ╱ ▓▓▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 🔥🔥 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  😈  ╱│╲  ╱│╲  😈
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '魔鬼之王': {
    name:     '魔鬼之王',
    title:    '万魔至尊',
    subtitle: '👿 魔界之主 👿',
    color:    '#ff0033',
    bgColor:  'rgba(40,0,5,.9)',
    taunt:    '跪下——\n在魔王面前，众生平等。\n平等的卑微。',
    bgLabel:  '魔王',
    art:
`  👿   ╱ 👁💀👁 ╲   👿
     ╱ ▓▓▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 👿👿 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  🔥  ╱│╲  ╱│╲  🔥
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '炼狱霸主': {
    name:     '炼狱霸主',
    title:    '炼狱之主',
    subtitle: '🌋 地狱业火 🌋',
    color:    '#ff4400',
    bgColor:  'rgba(40,10,0,.9)',
    taunt:    '炼狱之火，焚尽一切——\n包括你的希望。',
    bgLabel:  '炼狱',
    art:
`  🔥   ╱ 👁══👁 ╲   🔥
     ╱ ▓▓▓▓▓▓▓▓ ╲
    ╱═════════════╲
    ║  ▓ 🔥🔥 ▓  ║
    ║  ▓▓▓▓▓▓  ║
    ╚══╪══════╪══╝
  🔥  ╱│╲  ╱│╲  🔥
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '野宗宗主': {
    name:     '野宗宗主',
    title:    '野宗之主',
    subtitle: '⚔ 野路子大师 ⚔',
    color:    '#888866',
    bgColor:  'rgba(20,20,10,.9)',
    taunt:    '名门正派？哈哈哈——\n招式不怕野，管用就行！',
    bgLabel:  '野宗',
    art:
`  ⚔️    ╱ 👁👁 ╲    ⚔️
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ ⚔️🤜 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  ⚔️  ╱│╲  ╱│╲  ⚔️
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '宝塔之主': {
    name:     '宝塔之主',
    title:    '镇塔尊者',
    subtitle: '🗼 七层浮屠 🗼',
    color:    '#ccaa44',
    bgColor:  'rgba(25,20,5,.9)',
    taunt:    '七层宝塔，每一层都是一个考验——\n你能到第几层？',
    bgLabel:  '宝塔',
    art:
`  🗼     ╱ 👁👁 ╲
       ╱ ▓▓▓▓▓▓ ╲
      ╱═════════════╲
      ║  ▓ 🗼🗼 ▓  ║
      ║  ▓▓▓▓▓▓  ║
      ╚══╪══════╪══╝
  🗼   ╱│╲  ╱│╲   🗼
      ╱ │ ╲╱ │ ╲
     ╱  │     │  ╲`,
  },

  '赌坊老板': {
    name:     '赌坊老板',
    title:    '天命赌徒',
    subtitle: '🎲 赌命之人 🎲',
    color:    '#aa6644',
    bgColor:  'rgba(25,15,5,.9)',
    taunt:    '人生如赌——\n我赌你活不过三招。',
    bgLabel:  '赌坊',
    art:
`  🎲    ╱ 👁👁 ╲    🎲
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 🎲🃏 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  💰  ╱│╲  ╱│╲  💰
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '矿主': {
    name:     '矿主',
    title:    '铁矿之主',
    subtitle: '⛏ 铁血矿主 ⛏',
    color:    '#887744',
    bgColor:  'rgba(25,20,8,.9)',
    taunt:    '这片矿山，每一块石头——\n都是我打下来的。',
    bgLabel:  '矿主',
    art:
`  ⛏     ╱ 👁👁 ╲    ⛏
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ ⛏⛏ ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  💎  ╱│╲  ╱│╲  💎
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

  '盗经头目': {
    name:     '盗经头目',
    title:    '偷经贼首',
    subtitle: '📜 经书大盗 📜',
    color:    '#998855',
    bgColor:  'rgba(20,18,8,.9)',
    taunt:    '经书本是天下公器——\n我不过是代为保管罢了。',
    bgLabel:  '盗经',
    art:
`  📜    ╱ 👁👁 ╲    📜
      ╱ ▓▓▓▓▓▓ ╲
     ╱═════════════╲
     ║  ▓ 📜📜 ▓  ║
     ║  ▓▓▓▓▓▓  ║
     ╚══╪══════╪══╝
  📜  ╱│╲  ╱│╲  📜
     ╱ │ ╲╱ │ ╲
    ╱  │     │  ╲`,
  },

};

/**
 * 获取 BOSS 数据（支持模糊匹配）
 */
function bcGetBossData(bossName){
  if(!bossName) return null;
  // 精确匹配
  if(BC_BOSS_DATA[bossName]) return BC_BOSS_DATA[bossName];
  // 模糊匹配
  for(const key of Object.keys(BC_BOSS_DATA)){
    if(bossName.includes(key) || key.includes(bossName)){
      return BC_BOSS_DATA[key];
    }
  }
  return null;
}

/**
 * 主线 BOSS 登场动画
 * @param {string} bossName — BOSS名称（用于查询数据表）
 * @param {object} rFighter — 战斗角色对象（用于 fallback）
 * @returns {Promise}
 */
function showBossIntro(bossName, rFighter){
  // ⚠ arena 判断必须在所有路径之前，无论是 fallback 还是 BC_BOSS_DATA 匹配
  const isArena = (typeof battleMode !== 'undefined' && battleMode === 'arena');

  // 尝试从 BC_BOSS_DATA 获取预定义数据
  let data = bcGetBossData(bossName);
  // NPC 立绘 HTML（当 BC_BOSS_DATA 无匹配且 rFighter 是 NPC 时使用）
  let npcArtHtml = null;

  if(!data){
    // 尝试从 NPC_DB 获取 NPC 立绘
    const npcId = rFighter && rFighter._npcId;
    if(npcId && typeof NPC_DB !== 'undefined' && NPC_DB[npcId]){
      const npc = NPC_DB[npcId];
      if(typeof buildNpcPartsHtml === 'function'){
        npcArtHtml = buildNpcPartsHtml(npc, rFighter.color || npc.color || null);
      }
    }
    // 构建 fallback 数据
    data = {
      name:     rFighter ? rFighter.name : bossName || 'BOSS',
      title:    rFighter ? (rFighter.title || '宗师级') : '宗师级',
      subtitle: isArena ? '⚔ 比武切磋  ⚔' : '⚠ 生死决战  ⚠',
      color:    isArena ? '#b8860b' : '#cc0000',
      bgColor:  isArena ? 'rgba(60,40,0,.9)' : 'rgba(80,0,0,.9)',
      taunt:    isArena ? (rFighter ? (rFighter.taunt || '……请指教，点到为止。') : '……请指教，点到为止。') : (rFighter ? (rFighter.taunt || '……今日，我们一决生死。') : '……今日，我们一决生死。'),
      bgLabel:  rFighter ? (rFighter.title || 'BOSS') : 'BOSS',
      art: npcArtHtml || (
`    ？？？
   ╱？？？╲
  │ ??  ?? │
  │   ？？   │
  ╱╲ ╱？？？╲ ╱╲
 ╱  ╲╱？  ？╲╱  ╲`),
    };
  } else {
    // ⚠ 有 BOSS 预定义数据时，arena 模式强制覆盖 subtitle 和颜色/台词
    if(isArena){
      data = Object.assign({}, data, {
        subtitle: '⚔ 比武切磋  ⚔',
        color:    '#b8860b',
        bgColor:  'rgba(60,40,0,.9)',
        taunt:    rFighter ? (rFighter.taunt || '……请指教，点到为止。') : '……请指教，点到为止。',
      });
    }
  }

  return new Promise(resolve => {
    let ov = document.getElementById('bc-boss-intro-ov');
    if(ov) ov.remove();
    ov = document.createElement('div');
    ov.id = 'bc-boss-intro-ov';
    ov.className = 'bc-boss-ov';
    ov.style.setProperty('--bbc', data.color);
    ov.style.setProperty('--bbc-bg', data.bgColor);

    // ── 层 1：集中线（3组独立运动，manga 风格放射速度线）──
    const speedLinesContainer = document.createElement('div');
    speedLinesContainer.className = 'bc-boss-speedlines-wrap';
    // 组A：顺时针旋转 + 呼吸（第一批）
    const gA = document.createElement('div');
    gA.className = 'bc-boss-slg bc-boss-slg-a';
    gA.innerHTML = _bcBuildSpeedLines(20);
    speedLinesContainer.appendChild(gA);
    // 组B：逆时针旋转 + 交错延迟（第二批）
    const gB = document.createElement('div');
    gB.className = 'bc-boss-slg bc-boss-slg-b';
    gB.innerHTML = _bcBuildSpeedLines(18);
    speedLinesContainer.appendChild(gB);
    // 组C：冲击波扩散（第三批，更长更粗）
    const gC = document.createElement('div');
    gC.className = 'bc-boss-slg bc-boss-slg-c';
    gC.innerHTML = _bcBuildSpeedLines(12, true);
    speedLinesContainer.appendChild(gC);
    ov.appendChild(speedLinesContainer);

    // ── 层 2：斜向速度线扫射 ──
    const slashLines = document.createElement('div');
    slashLines.className = 'bc-boss-slash-lines';
    for(let i = 0; i < 6; i++){
      const sl = document.createElement('div');
      sl.className = 'bc-boss-slash';
      sl.style.top = (10 + i * 15) + '%';
      sl.style.animationDelay = (i * 0.25) + 's';
      slashLines.appendChild(sl);
    }
    ov.appendChild(slashLines);

    // ── 层 3：颗粒噪点叠加 ──
    const noiseLayer = document.createElement('div');
    noiseLayer.className = 'bc-boss-noise';
    ov.appendChild(noiseLayer);

    // ── 层 4：入场白色闪光 ──
    const flashEl = document.createElement('div');
    flashEl.className = 'bc-boss-flash';
    ov.appendChild(flashEl);

    // ── 层 5：能量脉冲环 ──
    const pulseRing = document.createElement('div');
    pulseRing.className = 'bc-boss-pulse-ring';
    ov.appendChild(pulseRing);

    // ── 层 6：背景烫金大字 ──
    const bgWord = document.createElement('div');
    bgWord.className = 'bc-boss-bgword';
    bgWord.textContent = data.bgLabel || data.name;
    ov.appendChild(bgWord);

    // ── 层 7：横向扫光线 ──
    for(let i = 0; i < 4; i++){
      const ln = document.createElement('div');
      ln.className = 'bc-boss-scanline';
      ln.style.top = (15 + i * 22) + '%';
      ln.style.animationDelay = (i * 0.18) + 's';
      ov.appendChild(ln);
    }

    // ── BOSS 字符画 / NPC 立绘（入场凝聚+持续呼吸）──
    const artBox = document.createElement('div');
    artBox.className = 'bc-boss-art';
    if(npcArtHtml){
      // NPC 立绘：包在 ft-animated 内层容器中，避免与 bc-boss-art flex 布局冲突
      const npcWrap = document.createElement('div');
      npcWrap.className = 'ft-animated';
      npcWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1px;';
      npcWrap.innerHTML = npcArtHtml;
      artBox.appendChild(npcWrap);
    } else {
      // 预定义 ASCII art：逐行包裹
      const artLines = data.art.split('\n');
      artLines.forEach((line, i) => {
        const row = document.createElement('span');
        row.className = 'bc-boss-art-line';
        const enterDelay = (i * 0.06);
        const breathDelay = (i * 0.18) % 3.5;
        row.style.animationDelay = enterDelay + 's, ' + (enterDelay + 0.5 + breathDelay) + 's';
        row.textContent = line;
        artBox.appendChild(row);
      });
    }
    ov.appendChild(artBox);

    // ── 中央内容区 ──
    const info = document.createElement('div');
    info.className = 'bc-boss-info';

    const sub = document.createElement('div');
    sub.className = 'bc-boss-subtitle';
    sub.textContent = data.subtitle;

    const nameEl = document.createElement('div');
    nameEl.className = 'bc-boss-name';
    nameEl.textContent = '';

    const titleEl = document.createElement('div');
    titleEl.className = 'bc-boss-title';
    titleEl.textContent = data.title;

    const divEl = document.createElement('div');
    divEl.className = 'bc-boss-divider';

    const tauntEl = document.createElement('div');
    tauntEl.className = 'bc-boss-taunt';
    tauntEl.innerHTML = '';

    const hint = document.createElement('div');
    hint.className = 'bc-boss-hint';
    hint.textContent = '△ 点击迎战 △';

    info.appendChild(sub);
    info.appendChild(nameEl);
    info.appendChild(titleEl);
    info.appendChild(divEl);
    info.appendChild(tauntEl);
    info.appendChild(hint);
    ov.appendChild(info);
    document.body.appendChild(ov);

    // ── 动画序列 ──
    requestAnimationFrame(() => {
      ov.classList.add('bc-boss-show');

      // 白色闪光 → 集中线收缩
      setTimeout(() => {
        flashEl.classList.add('bc-boss-flash-go');
      }, 50);

      // 脉冲环扩散
      setTimeout(() => {
        pulseRing.classList.add('bc-boss-pulse-go');
      }, 100);

      // 字符画震入 + 发光
      setTimeout(() => { artBox.classList.add('bc-boss-art-enter'); }, 150);

      // 二次脉冲
      setTimeout(() => {
        pulseRing.classList.remove('bc-boss-pulse-go');
        void pulseRing.offsetWidth; // 强制 reflow
        pulseRing.classList.add('bc-boss-pulse-go');
        _bcShakeScreen(ov, 12);
      }, 350);

      // 标签滑入
      setTimeout(() => { sub.classList.add('bc-boss-sub-enter'); }, 400);

      // 名字逐字打印
      setTimeout(() => {
        _bcTypewriter(nameEl, data.name, 80);
      }, 700);

      // 头衔渐显
      setTimeout(() => { titleEl.classList.add('bc-boss-title-enter'); }, 1000);
      setTimeout(() => { divEl.classList.add('bc-boss-divider-enter'); }, 1150);

      // 台词逐行显示
      setTimeout(() => {
        const lines = data.taunt.split('\n');
        lines.forEach((line, i) => {
          setTimeout(() => {
            const p = document.createElement('p');
            p.className = 'bc-boss-taunt-line';
            p.style.animationDelay = '0s';
            p.textContent = line;
            tauntEl.appendChild(p);
          }, i * 320);
        });
      }, 1400);

      // 点击提示出现
      const totalDelay = 1400 + data.taunt.split('\n').length * 320 + 400;
      setTimeout(() => { hint.classList.add('bc-boss-hint-show'); }, totalDelay);
    });

    // ── 屏幕震动 ──
    setTimeout(() => { _bcShakeScreen(ov, 10); }, 180);

    // ── 关闭（点击 or 超时7s）──
    function closeBoss(){
      ov.classList.add('bc-boss-hide');
      setTimeout(() => { if(ov.parentNode) ov.remove(); resolve(); }, 500);
    }
    ov.addEventListener('click', closeBoss, { once: true });
    setTimeout(closeBoss, 7200);
  });
}

/** 打字机效果辅助 */
function _bcTypewriter(el, text, intervalMs){
  let i = 0;
  el.classList.add('bc-boss-name-typing');
  const tid = setInterval(() => {
    if(i >= text.length){ clearInterval(tid); return; }
    el.textContent += text[i++];
  }, intervalMs);
}

/** 屏幕震动 */
function _bcShakeScreen(el, intensity){
  let count = 0;
  const maxCount = 10;
  const tid = setInterval(() => {
    if(count++ > maxCount){ el.style.transform = ''; clearInterval(tid); return; }
    const decay = 1 - count / maxCount;
    const dx = (Math.random() - .5) * intensity * decay;
    const dy = (Math.random() - .5) * intensity * .5 * decay;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  }, 35);
}

/** 生成漫画集中线 SVG */
function _bcBuildSpeedLines(count, bold){
  const cx = 50, cy = 50;
  let paths = '';
  for(let i = 0; i < count; i++){
    const angle = (i / count) * 360 + (Math.random() - .5) * 6;
    const rad = angle * Math.PI / 180;
    const innerR = bold ? (12 + Math.random() * 6) : (18 + Math.random() * 8);
    const outerR = bold ? (75 + Math.random() * 35) : (70 + Math.random() * 40);
    const x1 = cx + Math.cos(rad) * innerR;
    const y1 = cy + Math.sin(rad) * innerR;
    const x2 = cx + Math.cos(rad) * outerR;
    const y2 = cy + Math.sin(rad) * outerR;
    const w = bold ? (1.8 + Math.random() * 3) : (0.8 + Math.random() * 2);
    const opacity = bold ? (0.06 + Math.random() * 0.16) : (0.08 + Math.random() * 0.22);
    paths += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(255,255,255,${opacity.toFixed(2)})" stroke-width="${w.toFixed(1)}"/>`;
  }
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

// ── 公共 CSS 注入 ─────────────────────────────────
(function injectBcStyles(){
  if(document.getElementById('bc-styles')) return;
  const style = document.createElement('style');
  style.id = 'bc-styles';
  style.textContent = `
/* ── 开场演出层 ── */
.bc-intro-ov {
  position: fixed; inset: 0; z-index: 800;
  background: rgba(0,0,0,.96);
  display: flex; align-items: center; justify-content: space-around;
  opacity: 0; pointer-events: none;
  transition: opacity .3s;
  font-family: 'Courier New', monospace;
  overflow: hidden;
}
.bc-intro-ov.bc-intro-show { opacity: 1; pointer-events: all; }
.bc-intro-ov.bc-intro-hide { opacity: 0; pointer-events: none; transition: opacity .35s; }

.bc-intro-fighter {
  flex: 0 0 auto;
  display: flex; flex-direction: column; align-items: center;
  opacity: 0; transform: translateX(-80px);
  transition: opacity .4s ease, transform .45s cubic-bezier(.175,.885,.32,1.275);
}
.bc-intro-r { transform: translateX(80px); }
.bc-intro-fighter.bc-intro-enter { opacity: 1; transform: translateX(0); }

.bc-intro-center {
  flex: 0 0 auto; text-align: center;
  opacity: 0; transform: scale(.6);
  transition: opacity .4s, transform .45s cubic-bezier(.175,.885,.32,1.275);
}
.bc-intro-center.bc-center-show { opacity: 1; transform: scale(1); }

.bc-intro-narrate {
  color: rgba(200,160,80,.8);
  font-size: 13px; letter-spacing: 4px; margin-bottom: 14px;
  text-shadow: 0 0 12px rgba(200,160,80,.4);
}
.bc-intro-vs {
  font-size: 52px; line-height: 1;
  text-shadow: 0 0 30px rgba(255,200,80,.7), 0 0 60px rgba(255,200,80,.4);
  animation: bcVsPulse 1s ease-in-out infinite alternate;
}
@keyframes bcVsPulse {
  from { transform: scale(1); text-shadow: 0 0 30px rgba(255,200,80,.7); }
  to   { transform: scale(1.1); text-shadow: 0 0 60px rgba(255,220,100,1); }
}
.bc-intro-names {
  display: flex; align-items: center; gap: 14px;
  margin-top: 10px; font-size: 15px; font-weight: bold; letter-spacing: 3px;
}
.bc-vs-word {
  color: rgba(200,160,80,.7); font-size: 11px; letter-spacing: 4px;
}

/* 台词气泡 */
.bc-bubble {
  position: absolute; bottom: 22%; max-width: 140px;
  background: rgba(30,20,5,.9);
  border: 1px solid rgba(200,160,80,.3);
  border-radius: 6px; padding: 7px 10px;
  font-size: 11px; color: rgba(220,190,120,.9);
  letter-spacing: 1.5px; line-height: 1.6;
  opacity: 0; transform: translateY(10px);
  transition: opacity .3s, transform .35s ease;
}
.bc-bubble-l { left: 12%; }
.bc-bubble-r { right: 12%; }
.bc-bubble.bc-bubble-show { opacity: 1; transform: translateY(0); }
.bc-bubble::before {
  content: '"'; color: rgba(200,160,80,.5);
  font-size: 20px; line-height: 0; vertical-align: -.4em;
  margin-right: 3px;
}

.bc-intro-hint {
  position: absolute; bottom: 6%;
  left: 50%; transform: translateX(-50%);
  font-size: 10px; color: rgba(180,160,100,.3);
  letter-spacing: 4px; opacity: 0;
  transition: opacity .6s;
  animation: bcHintBlink 1.8s ease-in-out infinite;
}
.bc-intro-hint.bc-hint-show { opacity: 1; }
@keyframes bcHintBlink {
  0%,100% { opacity: .3; } 50% { opacity: .8; }
}

/* ── 技能演出层 ── */
.bc-skill-ov {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translateX(-50%) scale(.85);
  z-index: 700;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  pointer-events: none;
  opacity: 0;
  transition: opacity .1s, transform .15s cubic-bezier(.175,.885,.32,1.275);
}
.bc-skill-ov.bc-skill-show {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
.bc-skill-ov.bc-skill-hide {
  opacity: 0;
  transform: translateX(-50%) scale(1.05);
  transition: opacity .4s, transform .4s ease;
}
.bc-skill-ov.bc-skill-show { opacity: 1; transform: scale(1); }
.bc-skill-ov.bc-skill-hide { opacity: 0; transform: scale(1.05); transition: opacity .4s, transform .4s ease; }

.bc-skill-bg-glow {
  display: none;
}

.bc-skill-art {
  font-size: 26px; line-height: 1.3; text-align: center;
  color: var(--bc-color, #ffd060);
  text-shadow: 0 0 8px var(--bc-glow, #ffd060);
  animation: bcArtFloat .5s ease infinite alternate;
  position: relative; z-index: 2;
}
@keyframes bcArtFloat {
  from { transform: translateY(-4px) scale(1); }
  to   { transform: translateY(4px) scale(1.04); }
}

.bc-skill-school {
  font-size: 11px; letter-spacing: 6px;
  color: var(--bc-color, #ffd060); opacity: .6;
  margin-top: 8px; position: relative; z-index: 2;
}
.bc-combo-name {
  font-size: 22px; font-weight: bold; letter-spacing: 6px;
  color: #ffdd44;
  text-shadow: 0 0 16px #ffaa00, 0 0 8px #ff6600;
  margin-top: 8px; position: relative; z-index: 2;
  animation: bcComboPop .4s cubic-bezier(.175,.885,.32,1.275) forwards;
}
@keyframes bcComboPop {
  0%  { transform: scale(.2) rotate(-15deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(3deg); opacity: 1; }
  100%{ transform: scale(1) rotate(0); opacity: 1; }
}
.bc-skill-name {
  font-size: 36px; font-weight: bold; letter-spacing: 8px;
  color: var(--bc-color, #ffd060);
  text-shadow: 0 0 12px var(--bc-glow, rgba(255,208,96,.5));
  animation: bcSkillNamePop .5s cubic-bezier(.175,.885,.32,1.275) forwards;
  position: relative; z-index: 2;
  line-height: 1.3;
}
.bc-skill-name-line {
  display: block;
}
.bc-skill-name-line:first-child {
  color: var(--bc-color, #ffd060);
}
.bc-skill-name-line:last-child {
  color: #ffdd44;
  font-size: 20px;
  text-shadow: 0 0 16px #ffaa00, 0 0 8px #ff6600;
}
@keyframes bcSkillNamePop {
  0%  { transform: scale(.3) rotate(-8deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(2deg); opacity: 1; }
  100%{ transform: scale(1) rotate(0); opacity: 1; }
}

.bc-skill-caster {
  font-size: 12px; color: rgba(220,200,160,.7);
  letter-spacing: 3px; margin-top: 10px;
  position: relative; z-index: 2;
}

.bc-skill-particle {
  position: absolute; pointer-events: none;
  font-size: 14px; font-weight: bold;
  animation: bcSpark .8s ease-out forwards;
}
@keyframes bcSpark {
  0%   { transform: translate(0,0) scale(1.4); opacity: 1; }
  100% { transform: translate(var(--dx),var(--dy)) scale(.1); opacity: 0; }
}

/* ── 胜利演出层 ── */
.bc-victory-ov {
  position: fixed; inset: 0; z-index: 600;
  background: rgba(0,0,0,.96);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity .2s;
  overflow: hidden;
}
.bc-victory-ov.bc-victory-show { opacity: 1; }
.bc-victory-ov.bc-victory-hide { opacity: 0; transition: opacity .5s; }

.bc-victory-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 40%, var(--bc-win-glow, rgba(255,180,0,.4)) 0%, transparent 65%);
}

.bc-victory-big {
  font-size: 56px; font-weight: bold; letter-spacing: 14px;
  color: var(--bc-win-color, #ffd060);
  text-shadow: 0 0 60px var(--bc-win-glow, rgba(255,180,0,.6)), 0 0 120px var(--bc-win-glow);
  animation: bcVictoryBoom .7s cubic-bezier(.175,.885,.32,1.275) forwards;
  position: relative; z-index: 2;
}
@keyframes bcVictoryBoom {
  0%  { transform: scale(.1) rotate(-15deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(2deg);  opacity: 1; }
  100%{ transform: scale(1) rotate(0);        opacity: 1; }
}

.bc-victory-sub {
  font-size: 14px; letter-spacing: 5px;
  color: rgba(200,170,100,.7);
  margin: 10px 0 6px;
  position: relative; z-index: 2;
}
.bc-victory-medal {
  font-size: 40px; margin: 8px 0;
  animation: bcMedalSpin .6s cubic-bezier(.175,.885,.32,1.275) .3s forwards;
  transform: scale(0);
  position: relative; z-index: 2;
}
@keyframes bcMedalSpin {
  0%  { transform: scale(0) rotate(-180deg); }
  100%{ transform: scale(1) rotate(0); }
}
.bc-victory-quote {
  font-size: 18px; letter-spacing: 4px; margin: 12px 0 6px;
  text-shadow: 0 0 20px currentColor;
  position: relative; z-index: 2;
}
.bc-victory-loser-quote {
  font-size: 11px; color: rgba(160,140,100,.5);
  letter-spacing: 2px; font-style: italic;
  position: relative; z-index: 2;
}
.bc-victory-stats {
  font-size: 11px; color: rgba(180,160,100,.4);
  letter-spacing: 3px; margin-top: 12px;
  position: relative; z-index: 2;
}

/* 金粒子雨 */
.bc-rain-particle {
  position: absolute;
  font-size: 16px; font-weight: bold;
  animation: bcRainFall var(--dur, 1.2s) linear forwards;
}
@keyframes bcRainFall {
  0%  { transform: translateY(0) rotate(0deg);   opacity: 1; }
  100%{ transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

/* ══════════════════════════════════════════
   主线 BOSS 登场动画  (Borderlands 风格)
   ══════════════════════════════════════════ */
.bc-boss-ov {
  position: fixed; inset: 0; z-index: 950;
  background: #000;
  display: flex; align-items: center; justify-content: center;
  gap: 0;
  opacity: 0; pointer-events: none;
  transition: opacity .25s;
  font-family: 'Courier New', monospace;
  overflow: hidden;
}
.bc-boss-ov.bc-boss-show  { opacity: 1; pointer-events: all; }
.bc-boss-ov.bc-boss-hide  { opacity: 0; transition: opacity .5s; }

/* ══ 漫画集中线（3组独立运动）══ */
.bc-boss-speedlines-wrap {
  position: absolute; inset: -20%; z-index: 1;
  pointer-events: none;
}
/* 每组的公共样式 */
.bc-boss-slg {
  position: absolute; inset: 0;
  opacity: 0;
}
.bc-boss-slg svg {
  width: 100%; height: 100%;
}

/* 组A：顺时针缓慢旋转 + 呼吸 */
.bc-boss-slg-a {
  animation: bcSlgIn .7s .05s ease-out forwards;
}
.bc-boss-slg-a svg {
  animation: bcSlgSpinCW 45s linear infinite, bcSlgBreath 3s 1s ease-in-out infinite alternate;
}
@keyframes bcSlgSpinCW { to { transform: rotate(360deg); } }
@keyframes bcSlgBreath {
  0%   { opacity: .5; }
  50%  { opacity: .85; }
  100% { opacity: .5; }
}

/* 组B：逆时针旋转 + 延迟入场 + 不同速度 */
.bc-boss-slg-b {
  animation: bcSlgIn .6s .2s ease-out forwards;
}
.bc-boss-slg-b svg {
  animation: bcSlgSpinCCW 55s linear infinite, bcSlgBreathB 2.5s 1.5s ease-in-out infinite alternate;
}
@keyframes bcSlgSpinCCW { to { transform: rotate(-360deg); } }
@keyframes bcSlgBreathB {
  0%   { opacity: .3; }
  100% { opacity: .7; }
}

/* 组C：冲击波扩散（不旋转，从中心向外膨胀收缩）*/
.bc-boss-slg-c {
  animation: bcSlgIn .8s .35s ease-out forwards;
}
.bc-boss-slg-c svg {
  animation: bcSlgPulse 2.8s ease-in-out infinite alternate;
}
@keyframes bcSlgPulse {
  0%   { transform: scale(1);   opacity: .3; }
  50%  { transform: scale(1.15); opacity: .6; }
  100% { transform: scale(1.05); opacity: .35; }
}

/* 集中线入场 */
@keyframes bcSlgIn {
  0%   { opacity: 0; transform: scale(1.6); }
  50%  { opacity: .8; }
  100% { opacity: 1; transform: scale(1); }
}

/* ══ 斜向速度线扫射 ══ */
.bc-boss-slash-lines {
  position: absolute; inset: 0; z-index: 1;
  overflow: hidden; pointer-events: none;
  opacity: 0;
  animation: bcSlashFadeIn .6s .3s ease forwards;
}
@keyframes bcSlashFadeIn { to { opacity: 1; } }
.bc-boss-slash {
  position: absolute; left: -120%;
  width: 60%; height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--bbc, #cc0000) 30%, rgba(255,255,255,.6) 50%, var(--bbc, #cc0000) 70%, transparent);
  transform: rotate(-25deg);
  animation: bcSlashPass 1.8s ease-in-out infinite;
  filter: blur(0.3px);
}
@keyframes bcSlashPass {
  0%   { left: -120%; opacity: 0; }
  8%   { opacity: .8; }
  50%  { opacity: .6; }
  92%  { opacity: .8; }
  100% { left: 220%; opacity: 0; }
}

/* ══ 颗粒噪点 ══ */
.bc-boss-noise {
  position: absolute; inset: 0; z-index: 3;
  opacity: 0;
  pointer-events: none;
  animation: bcNoiseIn 1s .2s ease forwards;
  mix-blend-mode: overlay;
}
@keyframes bcNoiseIn { to { opacity: .12; } }
.bc-boss-noise::before {
  content: '';
  position: absolute; inset: -50%;
  width: 200%; height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  animation: bcNoiseShift .15s steps(4) infinite;
}
@keyframes bcNoiseShift {
  to { background-position: 64px 64px; }
}

/* ══ 入场白色闪光 ══ */
.bc-boss-flash {
  position: absolute; inset: 0; z-index: 10;
  background: radial-gradient(ellipse at 40% 50%, rgba(255,255,255,.95) 0%, transparent 60%);
  opacity: 0; pointer-events: none;
  transition: opacity .08s;
}
.bc-boss-flash.bc-boss-flash-go {
  animation: bcFlashBang .6s ease-out forwards;
}
@keyframes bcFlashBang {
  0%   { opacity: .9; }
  15%  { opacity: .6; }
  40%  { opacity: .15; }
  100% { opacity: 0; }
}

/* ══ 能量脉冲环 ══ */
.bc-boss-pulse-ring {
  position: absolute;
  top: 50%; left: 50%;
  width: 40px; height: 40px;
  border: 2px solid var(--bbc, #cc0000);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0; pointer-events: none;
  z-index: 2;
  box-shadow: 0 0 20px var(--bbc, #cc0000), inset 0 0 20px var(--bbc, #cc0000);
}
.bc-boss-pulse-ring.bc-boss-pulse-go {
  animation: bcPulseBurst .8s ease-out forwards;
}
@keyframes bcPulseBurst {
  0%   { transform: translate(-50%,-50%) scale(0); opacity: .9; }
  30%  { opacity: .6; }
  100% { transform: translate(-50%,-50%) scale(18); opacity: 0; }
}

/* 辐射背景 */
.bc-boss-ov::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 40% 40%, var(--bbc-bg, rgba(80,0,0,.9)) 0%, #000 65%);
  z-index: 0;
}

/* 背景烫金大字 */
.bc-boss-bgword {
  position: absolute;
  font-size: clamp(80px, 22vw, 180px);
  font-weight: 900; letter-spacing: -4px;
  color: transparent;
  -webkit-text-stroke: 1px rgba(180,0,0,.12);
  text-stroke: 1px rgba(180,0,0,.12);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  pointer-events: none; user-select: none;
  animation: bcBgWordPulse 3s ease-in-out infinite alternate;
  white-space: nowrap;
}
@keyframes bcBgWordPulse {
  from { -webkit-text-stroke-color: rgba(180,0,0,.08); }
  to   { -webkit-text-stroke-color: rgba(220,0,0,.22); }
}

/* 横向扫光线 */
.bc-boss-scanline {
  position: absolute; left: -100%; right: -100%; height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--bbc, #cc0000) 50%, transparent 100%);
  opacity: 0;
  animation: bcScanPass 2.2s linear infinite;
}
@keyframes bcScanPass {
  0%   { left: -100%; right: 200%; opacity: 0; }
  5%   { opacity: .7; }
  95%  { opacity: .7; }
  100% { left: 200%; right: -100%; opacity: 0; }
}

/* BOSS 字符画 */
.bc-boss-art {
  position: relative; z-index: 4;
  font-size: clamp(13px, 2.8vw, 20px);
  line-height: 1.35;
  color: var(--bbc, #cc0000);
  text-shadow: 0 0 14px var(--bbc, #cc0000), 0 0 30px var(--bbc, #cc0000);
  white-space: pre;
  display: flex; flex-direction: column; align-items: center;
  opacity: 0; transform: translateX(-60px) scale(.85);
  transition: opacity .45s ease, transform .5s cubic-bezier(.175,.885,.32,1.275);
  margin-right: 3vw;
  flex-shrink: 0;
  filter: saturate(1.4);
}
.bc-boss-art.bc-boss-art-enter {
  opacity: 1; transform: translateX(0) scale(1);
  animation: bcArtFloat 4s ease-in-out infinite, bcArtGlow 2.5s ease-in-out infinite alternate;
}
/* 整体浮动呼吸 */
@keyframes bcArtFloat {
  0%, 100% { transform: translateX(0) translateY(0) scale(1); }
  30%      { transform: translateX(0) translateY(-3px) scale(1.01); }
  50%      { transform: translateX(0) translateY(-5px) scale(1.02); }
  70%      { transform: translateX(0) translateY(-3px) scale(1.01); }
}
@keyframes bcArtGlow {
  0%   { text-shadow: 0 0 10px var(--bbc, #cc0000), 0 0 20px var(--bbc, #cc0000); filter: saturate(1.2) brightness(1); }
  50%  { text-shadow: 0 0 20px var(--bbc, #cc0000), 0 0 40px var(--bbc, #cc0000), 0 0 60px rgba(200,0,0,.3); filter: saturate(1.6) brightness(1.15); }
  100% { text-shadow: 0 0 14px var(--bbc, #cc0000), 0 0 28px var(--bbc, #cc0000); filter: saturate(1.4) brightness(1.05); }
}

/* 每行独立动画 —— 入场逐行凝聚 + 持续呼吸波动 */
.bc-boss-art-line {
  display: block;
  opacity: 0;
  transform: translateY(8px) scaleX(0.7);
  filter: blur(3px) brightness(1.5);
  animation:
    bcArtLineIn 0.5s cubic-bezier(.23,1,.32,1) forwards,
    bcArtLineBreath 3.5s ease-in-out infinite alternate;
}
/* 逐行入场：凝聚成形 */
@keyframes bcArtLineIn {
  0%   { opacity: 0; transform: translateY(8px) scaleX(0.7); filter: blur(3px) brightness(1.5); }
  60%  { opacity: .9; filter: blur(0.5px) brightness(1.1); }
  100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0) brightness(1); }
}
/* 每行持续呼吸：微幅上下浮动 + 亮度波动（入场完成后由 JS delay 触发）*/
@keyframes bcArtLineBreath {
  0%   { transform: translateY(0); text-shadow: 0 0 8px var(--bbc, #cc0000); }
  50%  { transform: translateY(-1.5px); text-shadow: 0 0 18px var(--bbc, #cc0000), 0 0 36px rgba(200,0,0,.3); }
  100% { transform: translateY(0.8px); text-shadow: 0 0 12px var(--bbc, #cc0000); }
}

/* BOSS 字符画战栗抖动（战斗前蓄力感）*/
.bc-boss-art.bc-boss-art-enter .bc-boss-art-line:nth-child(odd) {
  animation:
    bcArtLineIn 0.5s cubic-bezier(.23,1,.32,1) forwards,
    bcArtLineBreath 3.5s ease-in-out infinite alternate,
    bcArtLineShake 5s 2s ease-in-out infinite;
}
@keyframes bcArtLineShake {
  0%, 85%, 100% { transform: translateY(0) translateX(0); }
  88%  { transform: translateY(-0.5px) translateX(0.4px); }
  91%  { transform: translateY(0.5px) translateX(-0.3px); }
  94%  { transform: translateY(-0.3px) translateX(0.5px); }
  97%  { transform: translateY(0.3px) translateX(-0.2px); }
}

/* 右侧信息区 */
.bc-boss-info {
  position: relative; z-index: 5;
  display: flex; flex-direction: column; align-items: flex-start;
  max-width: 52vw;
}

/* 警告副标 */
.bc-boss-subtitle {
  font-size: 11px; letter-spacing: 4px;
  color: var(--bbc, #cc0000);
  background: rgba(200,0,0,.15);
  border: 1px solid var(--bbc, #cc0000);
  border-radius: 2px; padding: 3px 10px;
  margin-bottom: 10px;
  opacity: 0; transform: translateY(-8px);
  transition: opacity .3s, transform .3s ease;
  animation: bcSubtitleBlink 1.4s ease-in-out infinite;
}
.bc-boss-subtitle.bc-boss-sub-enter { opacity: 1; transform: translateY(0); }
@keyframes bcSubtitleBlink {
  0%,100% { box-shadow: 0 0 4px var(--bbc, #cc0000); }
  50%     { box-shadow: 0 0 14px var(--bbc, #cc0000), 0 0 28px rgba(200,0,0,.4); }
}

/* BOSS 名（打字机） */
.bc-boss-name {
  font-size: clamp(32px, 8vw, 56px);
  font-weight: 900; letter-spacing: 8px;
  color: #fff;
  text-shadow: 0 0 40px var(--bbc, #cc0000), 0 0 80px rgba(200,0,0,.4), 2px 2px 0 var(--bbc, #cc0000);
  line-height: 1.1; min-height: 1.2em;
  position: relative;
}
/* 光标动画 */
.bc-boss-name-typing::after {
  content: '|'; color: var(--bbc, #cc0000);
  animation: bcCursorBlink .5s step-end infinite;
}
@keyframes bcCursorBlink {
  0%,100% { opacity: 1; } 50% { opacity: 0; }
}

/* 头衔 */
.bc-boss-title {
  font-size: 13px; letter-spacing: 6px;
  color: rgba(220,160,120,.8);
  margin-top: 4px;
  opacity: 0;
  transition: opacity .4s .1s;
}
.bc-boss-title.bc-boss-title-enter { opacity: 1; }

/* 分割线 */
.bc-boss-divider {
  width: 0; height: 2px;
  background: linear-gradient(90deg, var(--bbc, #cc0000), transparent);
  margin: 10px 0;
  transition: width .5s ease;
}
.bc-boss-divider.bc-boss-divider-enter { width: min(280px, 46vw); }

/* 台词 */
.bc-boss-taunt {
  font-size: 12px; color: rgba(220,190,170,.85);
  line-height: 2; letter-spacing: 2px;
  border-left: 2px solid rgba(200,0,0,.5);
  padding-left: 10px;
}
.bc-boss-taunt-line {
  margin: 0;
  opacity: 0; transform: translateX(-10px);
  animation: bcTauntLine .4s cubic-bezier(.175,.885,.32,1.275) forwards;
}
@keyframes bcTauntLine {
  0%   { opacity: 0; transform: translateX(-10px) scale(.95); }
  60%  { opacity: 1; transform: translateX(2px) scale(1.02); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}

/* 点击提示 */
.bc-boss-hint {
  font-size: 11px; letter-spacing: 5px;
  color: rgba(200,160,100,.3);
  margin-top: 18px;
  opacity: 0;
  transition: opacity .6s;
  animation: bcBossHintBlink 1.6s ease-in-out infinite;
}
.bc-boss-hint.bc-boss-hint-show { opacity: 1; }
@keyframes bcBossHintBlink {
  0%,100% { color: rgba(200,160,100,.3); }
  50%     { color: rgba(200,160,100,.85); }
}
  `;
  document.head.appendChild(style);
})();
