/**
 * minigame-arena.js — 江湖擂台 v1.0 ✨华丽字符画版
 */

const ARENA_KEY = 'wuxia_arena_data';

// 擂台数据
let arenaState = {
  streak: 0,
  todayWins: 0,
  lastFightDay: -1,
  opponent: null,
};

// NPC池
const ARENA_NPC_POOL = [
  { tier:'func', name:'铁掌帮弟子', level:8, weapon:'wep_iron_palm', armor:'cs_iron', sect:'wudu' },
  { tier:'func', name:'青城剑客', level:12, weapon:'wep_sword', armor:'cs_silk', sect:'qingcheng' },
  { tier:'func', name:'江湖散人', level:15, weapon:'wep_sabre', armor:'cs_cloth', sect:'wulin' },
  { tier:'major', name:'华山剑客', level:25, weapon:'wep_sw_sword', armor:'cs_silk', sect:'huashan' },
  { tier:'major', name:'唐门弟子', level:28, weapon:'wep_dart', armor:'cs_leather', sect:'tangmen' },
  { tier:'major', name:'昆仑刀客', level:32, weapon:'wep_sabre', armor:'cs_iron', sect:'kunlun' },
  { tier:'elite', name:'逍遥派高手', level:45, weapon:'wep_fan', armor:'cs_silk', sect:'xiaoyao' },
  { tier:'elite', name:'桃花岛传人', level:48, weapon:'wep_jade_flute', armor:'cs_silk', sect:'taohuadao' },
];

// 打开擂台
function openArena(cityId) {
  if (typeof edS === 'undefined') { showToast && showToast('无法读取玩家数据'); return; }
  if (!edS.gameDay) edS.gameDay = 0;
  arenaLoad();

  if (edS.gameDay !== arenaState.lastFightDay) {
    arenaState.todayWins = 0;
  }

  arenaGenerateOpponent();

  // 每次打开时检测擂台战斗结果（从 battle.html 返回时）
  checkArenaBattleReturn();

  arenaRender();
}

// ══ 检测擂台战斗结果：从 battle.html 返回时调用 ══
function checkArenaBattleReturn() {
  const resultRaw = sessionStorage.getItem('wuxia_arena_battle_result');
  if (!resultRaw) return;

  try {
    const result = JSON.parse(resultRaw);
    sessionStorage.removeItem('wuxia_arena_battle_result');
    sessionStorage.removeItem('wuxia_arena_from_battle');
    sessionStorage.removeItem('wuxia_arena_battle_context');

    if (result.won) {
      // 延迟调用，让页面先渲染完毕
      setTimeout(() => arenaOnVictory(), 100);
    } else {
      setTimeout(() => arenaOnDefeat(), 100);
    }
  } catch (e) {
    console.error('[arena] 解析战斗结果失败:', e);
  }
}

// 生成对手
function arenaGenerateOpponent() {
  const playerLevel = edS.level || 1;
  const difficultyBoost = Math.floor(arenaState.streak / 3);
  const targetLevel = Math.min(playerLevel + rand(-2, 3) + difficultyBoost, 60);
  
  let pool;
  if (targetLevel < 20) pool = ARENA_NPC_POOL.filter(n => n.tier === 'func');
  else if (targetLevel < 40) pool = ARENA_NPC_POOL.filter(n => n.tier === 'major');
  else pool = ARENA_NPC_POOL.filter(n => n.tier === 'elite');
  
  const template = pool[rand(0, pool.length - 1)];
  
  arenaState.opponent = {
    id: 'arena_' + Date.now(),
    name: template.name,
    level: Math.max(1, targetLevel),
    tier: template.tier,
    weapon: template.weapon,
    armor: template.armor,
    hp: 150 + targetLevel * 12,
    maxHp: 150 + targetLevel * 12,
  };
}

// 渲染界面
function arenaRender() {
  const opp = arenaState.opponent;
  if (!opp) return;
  
  const html = `
    <div class="arena-overlay">
      <div class="arena-container">
        <div class="arena-banner">
          <div class="arena-banner-line">╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮</div>
          <div class="arena-banner-line">┃　　⚔️ 江湖擂台 · 以武会友 ⚔️　　┃</div>
          <div class="arena-banner-line">╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯</div>
        </div>
        
        <div class="arena-ring">
          <div class="arena-ring-line">╔═══════════════════════════╗</div>
          <div class="arena-ring-line">║　　【比武切磋 · 点到为止】　　║</div>
          <div class="arena-ring-line">╠═══════════════════════════╣</div>
          <div class="arena-ring-line">║　　　　█▀▀▀▀█　　█▀▀▀▀█　　　　║</div>
          <div class="arena-ring-line">║　　　　█　擂　█　　█　台　█　　　　║</div>
          <div class="arena-ring-line">║　　　　█▄▄▄▄█　　█▄▄▄▄█　　　　║</div>
          <div class="arena-ring-line">╠═══════════════════════════╣</div>
          <div class="arena-ring-line">║　　👥 观众如潮 👥 喝彩震天　　║</div>
          <div class="arena-ring-line">╚═══════════════════════════╝</div>
        </div>
        
        <div class="arena-combatants">
          <div class="arena-opponent">
            <div class="arena-npc-portrait">${arenaGeneratePortrait(opp.tier)}</div>
            <div class="arena-npc-name">${opp.name}</div>
            <div class="arena-npc-level">Lv.${opp.level} · ${getTierName(opp.tier)}</div>
            <div class="arena-npc-hp">❤️ ${opp.hp}/${opp.maxHp}</div>
          </div>
          
          <div class="arena-vs">VS</div>
          
          <div class="arena-player">
            <div class="arena-player-portrait">
              <pre class="ft-ascii" style="font-size:10px;line-height:10px">${edBuild()}</pre>
            </div>
            <div class="arena-player-name">${edS.name || '你'}</div>
            <div class="arena-player-level">Lv.${edS.level || 1}</div>
            <div class="arena-player-hp">❤️ ${edS.hp || 100}%</div>
          </div>
        </div>
        
        <div class="arena-reward-info">
          <div class="arena-streak">🔥 连胜: <strong>${arenaState.streak}</strong> 场</div>
          <div class="arena-reward">💰 彩头: <strong>${arenaCalcReward(arenaState.streak).silver}</strong> 两</div>
        </div>
        
        <div class="arena-actions">
          <button class="arena-btn arena-btn-fight" onclick="arenaStartBattle()">⚔️ 开始切磋</button>
          <button class="arena-btn" onclick="arenaShowRules()">📜 规则</button>
          <button class="arena-btn" onclick="arenaClose()">🚪 离开</button>
        </div>
        
        <div class="arena-today-stats">今日: ${arenaState.todayWins} 胜 | 连胜: ${arenaState.streak} 场</div>
      </div>
    </div>
  `;
  
  const popup = document.createElement('div');
  popup.id = 'arenaPopup';
  popup.innerHTML = html;
  document.body.appendChild(popup);
  arenaInjectStyles();
}

// 生成立绘
function arenaGeneratePortrait(tier) {
  const portraits = {
    func: `╭━┳━╮\n┃◉┃◉┃\n╰━┻━╯`,
    major: `╭━━━━━╮\n┃◈ ▲ ◈┃\n╰━┳━╱╲━┳━╯`,
    elite: `╭━━━━━━━━━╮\n┃◉ ▲▼ ◉┃\n╰━┳━╱╲━┳━╯`,
  };
  const portrait = portraits[tier] || portraits.func;
  return `<pre class="ft-ascii" style="font-size:10px;line-height:10px">${portrait}</pre>`;
}

// 开始战斗
function arenaStartBattle() {
  const btn = document.querySelector('.arena-btn-fight');
  if (btn) btn.disabled = true;
  
  const overlay = document.createElement('div');
  overlay.className = 'arena-prepare-overlay';
  overlay.innerHTML = `
    <div class="arena-prepare-text">准备切磋...</div>
    <div class="arena-prepare-countdown">3</div>
  `;
  
  const container = document.querySelector('.arena-container');
  container.appendChild(overlay);
  
  let count = 3;
  const timer = setInterval(() => {
    count--;
    const el = overlay.querySelector('.arena-prepare-countdown');
    if (count > 0) {
      el.textContent = count;
    } else {
      clearInterval(timer);
      overlay.remove();
      arenaLaunchBattle();
    }
  }, 1000);
}

// 启动战斗：保存上下文，跳转到 battle.html 进行切磋
function arenaLaunchBattle() {
  const opp = arenaState.opponent;

  // ── 构建擂台战斗上下文 ──
  const arenaContext = {
    player: {
      id: 'cp_self',
      name: edS.name || '你',
      title: '切磋者',
      maxHp: edS.maxHp || 150,
      hp: edS.hp || edS.maxHp || 150,
      atk: edS.atk || 20,
      def: edS.def || 10,
      crit: edS.crit || 0.1,
      dodge: edS.dodge || 0.05,
      maxMp: edS.maxMp || 80,
      mp: edS.mp || edS.maxMp || 80,
      speed: edS.speed || 10,
      speedN: edS.speedN || 1,
      color: edS.color || '#60c8ff',
      stand: edS.stand,
      attack: edS.attack || 1,
      heavy: edS.heavy || 1,
      hit: edS.hit || 0.95,
      down: edS.down,
      skillIds: edS.skillIds || ['cm01','cm02','cm03'],
      _currentHp: edS.hp || edS.maxHp || 150,
    },
    enemy: {
      id: opp.id,
      name: opp.name,
      title: getTierName(opp.tier),
      maxHp: opp.maxHp,
      hp: opp.maxHp,
      atk: Math.round((edS.atk || 20) * 0.8 + opp.level * 1.5),
      def: Math.round((edS.def || 10) * 0.8 + opp.level * 0.8),
      crit: 0.08,
      dodge: 0.04,
      maxMp: 60,
      mp: 60,
      speed: opp.level * 0.5,
      speedN: 1,
      color: opp.tier === 'elite' ? '#ff8060' : opp.tier === 'major' ? '#ffd060' : '#a08060',
      level: opp.level,
      tier: opp.tier,
      weapon: opp.weapon,
      armor: opp.armor,
      skills: [],
      drops: [],
    }
  };

  // 保存擂台战斗上下文
  sessionStorage.setItem('wuxia_arena_battle_context', JSON.stringify(arenaContext));

  // 播放战斗开始音效
  if (typeof SoundFX !== 'undefined') {
    SoundFX.play('battle_start');
  }

  // 跳转到 battle.html 进行擂台切磋
  window.location.href = 'battle.html?mode=arena';
}

// 胜利
function arenaOnVictory() {
  arenaState.streak++;
  arenaState.todayWins++;
  arenaState.lastFightDay = edS.gameDay || 0;
  
  // ═══════════════════════════════════════════════
  // 擂台"将将胡"系统
  // ═══════════════════════════════════════════════
  const luckRoll = Math.random();
  let specialEvent = null;
  
  // 3%概率：观众喝彩（额外声望+50%）
  if(luckRoll < 0.03){
    specialEvent = 'crowd_cheer';
  }
  // 2%概率：暗器偷袭（气血-10%，但获得额外银两赔偿）
  else if(luckRoll < 0.05){
    specialEvent = 'sneak_attack';
  }
  // 1%概率：连胜奖励翻倍（第5场以上触发）
  else if(luckRoll < 0.06 && arenaState.streak >= 5){
    specialEvent = 'streak_bonus';
  }
  
  // ═══════════════════════════════════════════════
  // 擂台"将将胡"恶搞事件（5%总概率）
  // ═══════════════════════════════════════════════
  const gagRoll = Math.random();
  if (gagRoll < 0.05 && !specialEvent) {
    const gagEvents = ['opponent_stomachache', 'egg_throw', 'slipped_banana', 
                       'fan_girl', 'wardrobe_malfunction', 'wrong_opponent'];
    specialEvent = gagEvents[Math.floor(Math.random() * gagEvents.length)];
    
    const gagMessages = {
      opponent_stomachache: { title: '😰 对手肚子痛！', msg: '对手突然捂着肚子："等等！我去个茅厕！"', type: 'rare' },
      egg_throw: { title: '🥚 鸡蛋袭击！', msg: '观众朝你扔鸡蛋！但你帅气地躲开了！', type: 'warning' },
      slipped_banana: { title: '🍌 踩到香蕉皮！', msg: '你踩到香蕉皮滑了一跤，反而躲过了致命一击！', type: 'rare' },
      fan_girl: { title: '😍 狂热粉丝！', msg: '一位女粉丝冲上台送你手帕，你顿时充满力量！', type: 'rare' },
      wardrobe_malfunction: { title: '👖 衣服开裂！', msg: '你的衣服在战斗中裂开了，对手愣神被你抓住机会！', type: 'warning' },
      wrong_opponent: { title: '😵 打错人了！', msg: '你发现自己打错了人，但对方说"没事，继续！"', type: 'rare' }
    };
    
    const gagMsg = gagMessages[specialEvent];
    showToast(gagMsg.title + ' ' + gagMsg.msg, gagMsg.type);
  }
  
  const reward = arenaCalcReward(arenaState.streak - 1);
  
  // 应用特殊事件效果
  if(specialEvent === 'crowd_cheer'){
    reward.reputation = Math.round(reward.reputation * 1.5);
    showToast('👏 观众喝彩！你的精彩表现赢得了满堂彩！', 'rare');
  }
  else if(specialEvent === 'sneak_attack'){
    // 气血损失
    if(typeof edS !== 'undefined'){
      const dmg = Math.floor((edS.maxHp || 100) * 0.10);
      edS.hp = Math.max(1, (edS.hp || edS.maxHp || 100) - dmg);
    }
    // 但获得赔偿
    reward.silver = Math.round(reward.silver * 1.3);
    showToast('🗡️ 暗器偷袭！你受了伤，但对方赔偿了医药费！', 'warning');
  }
  else if(specialEvent === 'streak_bonus'){
    reward.silver = reward.silver * 2;
    reward.exp = reward.exp * 2;
    reward.reputation = reward.reputation * 2;
    showToast('🌟 连胜传奇！双倍奖励！', 'legendary');
  }
  // 恶搞事件奖励调整
  else if(specialEvent === 'opponent_stomachache'){
    reward.exp = Math.round(reward.exp * 1.3);
    showToast('😰 趁虚而入！经验+30%！', 'rare');
  }
  else if(specialEvent === 'fan_girl'){
    reward.reputation = Math.round(reward.exp * 1.5);
    showToast('😍 魅力加成！声望+50%！', 'rare');
  }
  else if(specialEvent === 'wardrobe_malfunction'){
    reward.silver = Math.round(reward.silver * 1.2);
    showToast('👖 意外之财！赏金+20%！', 'rare');
  }
  
  addSilver(reward.silver);
  if (typeof jhAddFame === 'function') {
    jhAddFame(reward.reputation, 0);
  }
  
  arenaSave();
  setTimeout(() => arenaShowResult('victory', reward, null, specialEvent), 500);
}

// 失败
function arenaOnDefeat() {
  const lostStreak = arenaState.streak;
  arenaState.streak = 0;
  arenaState.lastFightDay = edS.gameDay || 0;
  arenaSave();
  setTimeout(() => arenaShowResult('defeat', null, lostStreak), 500);
}

// 计算奖励
function arenaCalcReward(streak) {
  const rewards = {
    silver: [15, 25, 40, 60, 85, 115, 150, 190, 235, 285],
    exp: [20, 30, 45, 65, 90, 120, 155, 195, 240, 290],
    reputation: [5, 8, 12, 18, 25, 35, 48, 64, 83, 105],
  };
  const idx = Math.min(streak, rewards.silver.length - 1);
  return {
    silver: rewards.silver[idx],
    exp: rewards.exp[idx],
    reputation: rewards.reputation[idx],
  };
}

// 显示结果
function arenaShowResult(type, reward, lostStreak, specialEvent) {
  // ── 成就系统触发 ──
  if(typeof achOnArenaWin === 'function' && type === 'victory') achOnArenaWin();

  // 播放音效
  if (typeof SoundFX !== 'undefined') {
    if (type === 'victory') {
      SoundFX.play('battle_victory');
    } else {
      SoundFX.play('battle_defeat');
    }
  }
  
  // 特殊事件提示
  let specialHtml = '';
  if(specialEvent === 'crowd_cheer'){
    specialHtml = '<div style="color:#ffd700;margin:10px 0;">👏 观众喝彩！声望+50%</div>';
  }
  else if(specialEvent === 'sneak_attack'){
    specialHtml = '<div style="color:#ff6b6b;margin:10px 0;">🗡️ 遭遇暗器偷袭！气血-10%，但获得赔偿</div>';
  }
  else if(specialEvent === 'streak_bonus'){
    specialHtml = '<div style="color:#ff00ff;margin:10px 0;font-size:18px;">🌟 连胜传奇！双倍奖励！</div>';
  }
  // ═══════════════════════════════════════════════
  // 擂台"将将胡"恶搞事件显示
  // ═══════════════════════════════════════════════
  else if(specialEvent === 'opponent_stomachache'){
    specialHtml = '<div style="color:#90ee90;margin:10px 0;">😰 对手肚子痛！趁虚而入！经验+30%</div>';
  }
  else if(specialEvent === 'egg_throw'){
    specialHtml = '<div style="color:#ffa500;margin:10px 0;">🥚 鸡蛋袭击！但你帅气地躲开了！</div>';
  }
  else if(specialEvent === 'slipped_banana'){
    specialHtml = '<div style="color:#ffd700;margin:10px 0;">🍌 踩到香蕉皮！因祸得福！</div>';
  }
  else if(specialEvent === 'fan_girl'){
    specialHtml = '<div style="color:#ff69b4;margin:10px 0;">😍 狂热粉丝助威！声望+50%</div>';
  }
  else if(specialEvent === 'wardrobe_malfunction'){
    specialHtml = '<div style="color:#87ceeb;margin:10px 0;">👖 衣服开裂！对手愣神！赏金+20%</div>';
  }
  else if(specialEvent === 'wrong_opponent'){
    specialHtml = '<div style="color:#dda0dd;margin:10px 0;">😵 打错人了！但对方很配合！</div>';
  }
  
  const html = type === 'victory' ? `
    <div class="arena-result-overlay">
      <div class="arena-result victory">
        <div class="arena-result-title">🎉 胜利！</div>
        <div class="arena-result-streak">连胜: ${arenaState.streak} 场</div>
        ${specialHtml}
        <div class="arena-result-rewards">
          <div class="reward-row">💰 +${reward.silver} 两</div>
          <div class="reward-row">⚔️ +${reward.exp} 经验</div>
          <div class="reward-row">⭐ +${reward.reputation} 声望</div>
        </div>
        <div class="arena-result-actions">
          <button class="arena-btn" onclick="arenaRegenerateOpponent()">继续挑战</button>
          <button class="arena-btn" onclick="arenaClose()">离开</button>
        </div>
      </div>
    </div>
  ` : `
    <div class="arena-result-overlay">
      <div class="arena-result defeat">
        <div class="arena-result-title">💔 惜败</div>
        <div class="arena-result-streak-lost">连胜终结: ${lostStreak} 场</div>
        <div class="arena-result-actions">
          <button class="arena-btn" onclick="arenaRegenerateOpponent()">挑战新人</button>
          <button class="arena-btn" onclick="arenaClose()">离开</button>
        </div>
      </div>
    </div>
  `;
  
  const container = document.querySelector('.arena-container');
  container.innerHTML = html;
}

// 重新生成对手
function arenaRegenerateOpponent() {
  arenaGenerateOpponent();
  const popup = document.getElementById('arenaPopup');
  if (popup) popup.remove();
  arenaRender();
}

// 显示规则
function arenaShowRules() {
  alert('📜 擂台规则 📜\n\n1. 切磋武艺，点到为止，不会死亡\n2. 胜利可获得声望、经验和银两\n3. 连胜越多，奖励越丰厚\n4. 每日战绩和连胜记录会保存');
}

// 关闭擂台
function arenaClose() {
  const popup = document.getElementById('arenaPopup');
  if (popup) popup.remove();
  if (typeof travelRenderLocation === 'function') {
    travelRenderLocation();
  }
}

// 保存/加载
function arenaSave() {
  try {
    const saveData = {
      streak: arenaState.streak,
      todayWins: arenaState.todayWins,
      lastFightDay: edS?.gameDay || 0,
      saveDay: new Date().toDateString(),
    };
    localStorage.setItem(ARENA_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('擂台数据保存失败:', e);
  }
}

function arenaLoad() {
  try {
    const raw = localStorage.getItem(ARENA_KEY);
    if (!raw) return;
    
    const data = JSON.parse(raw);
    const today = new Date().toDateString();
    
    if (data.saveDay !== today) {
      arenaState.todayWins = 0;
    } else {
      arenaState.todayWins = data.todayWins || 0;
    }
    
    arenaState.streak = data.streak || 0;
    arenaState.lastFightDay = data.lastFightDay || -1;
  } catch (e) {
    console.error('擂台数据加载失败:', e);
  }
}

// 工具函数
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTierName(tier) {
  const names = { func: '普通', major: '精英', elite: '高手' };
  return names[tier] || '未知';
}

// 注入样式
function arenaInjectStyles() {
  if (document.getElementById('arena-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'arena-styles';
  style.textContent = `
    .arena-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.85); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      animation: arenaFadeIn 0.3s ease;
    }
    .arena-container {
      width: 90%; max-width: 800px; max-height: 90vh;
      background: linear-gradient(135deg, #1a0f08 0%, #2c1810 100%);
      border: 3px solid #d4a017; border-radius: 12px; padding: 25px;
      overflow-y: auto; box-shadow: 0 0 40px rgba(212,160,23,0.3);
    }
    .arena-banner-line {
      text-align: center; color: #d4a017; font-weight: bold;
      text-shadow: 0 0 10px rgba(212,160,23,0.5); margin: 5px 0;
      font-family: 'SimSun', monospace;
    }
    .arena-ring-line {
      text-align: center; color: #c08030; font-family: 'SimSun', monospace;
      margin: 2px 0; font-size: 14px;
    }
    .arena-combatants {
      display: flex; justify-content: space-around; align-items: center;
      margin: 30px 0; flex-wrap: wrap; gap: 20px;
    }
    .arena-opponent, .arena-player {
      flex: 1; min-width: 250px; text-align: center;
      background: rgba(0,0,0,0.3); border-radius: 8px; padding: 15px;
      border: 1px solid rgba(212,160,23,0.3);
    }
    .arena-vs {
      font-size: 36px; font-weight: bold; color: #d4a017;
      text-shadow: 0 0 15px rgba(212,160,23,0.7);
    }
    .arena-actions {
      display: flex; justify-content: center; gap: 15px;
      margin-top: 25px; flex-wrap: wrap;
    }
    .arena-btn {
      padding: 12px 24px; font-size: 16px; font-weight: bold;
      border: 2px solid #d4a017;
      background: linear-gradient(135deg, #2c1810 0%, #3a2418 100%);
      color: #f0c060; border-radius: 8px; cursor: pointer;
      transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .arena-btn:hover {
      transform: translateY(-2px); box-shadow: 0 6px 15px rgba(212,160,23,0.4);
      border-color: #f0c060; color: #fff;
    }
    .arena-btn-fight { border-color: #ff6b6b; color: #ff6b6b; }
    .arena-btn-fight:hover {
      border-color: #ff8787; color: #fff; box-shadow: 0 6px 15px rgba(255,107,107,0.4);
    }
    .arena-result-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.9); display: flex;
      align-items: center; justify-content: center;
    }
    .arena-result {
      text-align: center; padding: 30px;
      background: linear-gradient(135deg, #1a0f08 0%, #2c1810 100%);
      border: 3px solid #d4a017; border-radius: 12px;
      box-shadow: 0 0 30px rgba(212,160,23,0.5);
    }
    .arena-result.victory { border-color: #4caf50; }
    .arena-result.defeat { border-color: #ff6b6b; }
    .arena-result-title { font-size: 32px; font-weight: bold; margin-bottom: 20px; }
    .arena-result.victory .arena-result-title { color: #4caf50; }
    .arena-result.defeat .arena-result-title { color: #ff6b6b; }
    @keyframes arenaFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
