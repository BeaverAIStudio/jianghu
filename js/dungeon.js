// ════════════════════════════════════════════════════
//  dungeon.js  地下城系统
//  功能：进入/地图探索/战斗接入/结算/存档
//  version: 24
// ════════════════════════════════════════════════════

// ── 地下城运行状态 ──
let _dungeonState = null;
// {
//   dungeonId,        // 当前地下城ID
//   dungeon,          // 地下城数据对象（引用）
//   map,              // 深拷贝的地图（含cleared状态）
//   pos: [row, col],  // 玩家当前位置
//   clearedRooms,     // 已清理房间数
//   totalBattles,     // 已战斗次数
//   pendingReward,    // 战斗/宝箱待领奖励
//   fromPage,         // 进入前的页面（返回用）
//   stepsSinceRest,   // 距上次自动回血的步数
//   isCompleted,      // 是否已通关
//   lives,            // 剩余命数（默认3）
//   lastRestPos,      // 最近休息点位置 [row,col]（死亡复活用）
// }

// ── 地下城存档Key ──
const DUNGEON_SAVE_KEY = 'wuxia_dungeon_progress';

// 保存地下城进度（仅保存已清理的房间）
function dungeonSave(){
  if(!_dungeonState) return;
  const save = {
    dungeonId: _dungeonState.dungeonId,
    clearedMap: _dungeonState.map.map(row =>
      row ? row.map(cell => cell ? { cleared: cell.cleared } : null) : null
    ),
    pos:          _dungeonState.pos,
    clearedRooms: _dungeonState.clearedRooms,
    totalBattles: _dungeonState.totalBattles,
    isCompleted:  _dungeonState.isCompleted,
    lives:        _dungeonState.lives,         // 【方案A】保存命数
    lastRestPos:  _dungeonState.lastRestPos,   // 【方案A】保存最近休息点
    meditateLeft: _dungeonState.meditateLeft,  // 剩余打坐次数
  };
  try { localStorage.setItem(DUNGEON_SAVE_KEY, JSON.stringify(save)); } catch(e){}
}

// 读取地下城存档
function dungeonLoadSave(){
  try {
    const s = localStorage.getItem(DUNGEON_SAVE_KEY);
    return s ? JSON.parse(s) : null;
  } catch(e){ return null; }
}

// 清除地下城存档
function dungeonClearSave(){
  try { localStorage.removeItem(DUNGEON_SAVE_KEY); } catch(e){}
}

// ─────────────────────────────────────────────────────
//  进入前确认弹窗（方案C）
// ─────────────────────────────────────────────────────
function showDungeonConfirm(dungeonId, fromPage){
  const dungeon = DUNGEON_DB[dungeonId];
  if(!dungeon){ enterDungeon(dungeonId, fromPage); return; }

  const playerLevel = (typeof edS !== 'undefined') ? (edS.level || 1) : 1;
  const diff = playerLevel - dungeon.minLevel;

  // 难度文字与颜色
  let diffText, diffColor, diffEmoji;
  if(diff >= 5){
    diffText  = '适合';  diffColor = '#4ecb71'; diffEmoji = '✅';
  } else if(diff >= 0){
    diffText  = '有挑战'; diffColor = '#f0c060'; diffEmoji = '⚔️';
  } else {
    diffText  = '危险';  diffColor = '#e05040'; diffEmoji = '☠️';
  }

  // 检查是否有存档（续关提示）
  const prevSave = dungeonLoadSave();
  const hasSave  = prevSave && prevSave.dungeonId === dungeonId && !prevSave.isCompleted;
  const livesLeft= hasSave && prevSave.lives !== undefined ? prevSave.lives : 3;
  const livesStr = '❤️'.repeat(livesLeft) + '🖤'.repeat(Math.max(0, 3 - livesLeft));
  const saveHint = hasSave
    ? `<div class="dgc-save-hint">📂 检测到未完成的探索记录，将从上次位置继续（生机：${livesStr}）</div>`
    : `<div class="dgc-save-hint" style="color:rgba(180,140,70,.5)">🆕 全新挑战，初始生机：${livesStr}</div>`;

  // 警告文字（危险时）
  const warnHtml = diff < 0
    ? `<div class="dgc-warn">⚠️ 你的等级（${playerLevel}）低于推荐等级（${dungeon.minLevel}），战斗会相当艰难。</div>`
    : '';

  const html = `
<div class="dgc-overlay" id="dgcOverlay" onclick="if(event.target===this)closeDungeonConfirm()">
  <div class="dgc-box">
    <div class="dgc-header">
      <span class="dgc-icon">${dungeon.icon}</span>
      <div class="dgc-title">${dungeon.name}</div>
    </div>
    <div class="dgc-body">
      <div class="dgc-row">
        <span class="dgc-label">推荐等级</span>
        <span class="dgc-val">Lv${dungeon.minLevel} ~ ${dungeon.maxLevel}</span>
      </div>
      <div class="dgc-row">
        <span class="dgc-label">你的等级</span>
        <span class="dgc-val">Lv${playerLevel}</span>
      </div>
      <div class="dgc-row">
        <span class="dgc-label">难度判定</span>
        <span class="dgc-val" style="color:${diffColor}">${diffEmoji} ${diffText}</span>
      </div>
      <div class="dgc-row">
        <span class="dgc-label">地形</span>
        <span class="dgc-val">${dungeon.terrain || '未知'}</span>
      </div>
      <div class="dgc-row">
        <span class="dgc-label">失败规则</span>
        <span class="dgc-val" style="color:rgba(200,180,120,.8)">3条生机，耗尽后重置</span>
      </div>
    </div>
    <div class="dgc-desc">${dungeon.desc}</div>
    ${saveHint}
    ${warnHtml}
    <div class="dgc-btns">
      <button class="dgc-btn dgc-btn-cancel" onclick="closeDungeonConfirm()">取消</button>
      <button class="dgc-btn dgc-btn-enter" onclick="closeDungeonConfirm();enterDungeon('${dungeonId}','${fromPage||'map'}')">进入探索</button>
    </div>
  </div>
</div>`;

  // 插入 DOM
  const existing = document.getElementById('dgcOverlay');
  if(existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
}

function closeDungeonConfirm(){
  const el = document.getElementById('dgcOverlay');
  if(el) el.remove();
}

// ─────────────────────────────────────────────────────
//  门派巡逻遭遇弹窗
// ─────────────────────────────────────────────────────
// 当前巡逻遭遇上下文（模块级，供 onclick 处理器访问）
let _curPatrolCtx = { dungeonId: null, fromPage: null, ownerId: null, patrolCityId: null };

// factionPatrol: { enemyId, factionName, factionColor }
// cityId: 触发遭遇的城市ID
function _showFactionPatrolEncounter(dungeonId, fromPage, factionPatrol, cityId){
  const { enemyId, factionName, factionColor } = factionPatrol;
  const dungeon = DUNGEON_DB[dungeonId];
  const dungeonName = dungeon ? dungeon.name : '险地';

  // 记录标记（每日遭遇计数）
  if(typeof jhMarkFactionPatrolTriggered === 'function'){
    jhMarkFactionPatrolTriggered();
  }

  // 获取门派owner信息（用于战后声望结算）
  let ownerId = null;
  if(typeof jhGetCityOwner === 'function' && cityId){
    ownerId = jhGetCityOwner(cityId);
  }

  // 保存上下文供 onclick 处理使用
  _curPatrolCtx = { dungeonId, fromPage, ownerId, patrolCityId: cityId };

  // 获取敌人数据
  const enemyDb = (typeof ENEMY_DB !== 'undefined' && ENEMY_DB) || {};
  const enemy = enemyId ? enemyDb[enemyId] : null;
  const enemyName = enemy ? enemy.name : (enemyId || '巡逻弟子');
  const enemyIcon = enemy ? (enemy.icon || '⚔️') : '⚔️';

  // 巡逻弹窗也显示钳制后的等级
  const playerLv = (typeof edS !== 'undefined' ? edS.level : null) || 1;
  const rawLv = enemy ? (enemy.level || 1) : 1;
  const patrolGap = (enemy && enemy.tier === 'boss') ? 8 : 5;
  const displayLv = Math.min(rawLv, playerLv + patrolGap);

  // 叙事文案池（门派名称 + 敌人名动态替换）
  const narrativeLines = [
    `你正要踏入${dungeonName}，前方小径上忽然出现几名身着统一劲装的弟子——是${factionName}的人！`,
    `${factionName}的巡逻队正好在此处设卡，为首的一人喝道：「来者何人，报上名来！」`,
    `${dungeonName}入口处，几名${factionName}弟子正在盘查路人。你恰好撞上了这一幕……`,
    `刚接近${dungeonName}，一队${factionName}的人马便迎了上来，为首弟子目光如炬：「止步，接受检查。」`,
  ];
  const narrative = narrativeLines[Math.floor(Math.random() * narrativeLines.length)];

  const html = `
<div class="fp-overlay" id="fpOverlay" onclick="if(event.target===this)_closeFactionPatrol()">
  <div class="fp-box" onclick="event.stopPropagation()">
    <div class="fp-header">
      <span class="fp-icon">${enemyIcon}</span>
      <div>
        <div class="fp-title">${factionName}巡逻队</div>
        <div class="fp-subtitle" style="color:${factionColor}">${enemyName}在此设卡</div>
      </div>
    </div>
    <div class="fp-narrative">${narrative}</div>
    <div class="fp-enemy-hint">
      <span style="color:${factionColor}">▸</span> ${enemyName}
      ${enemy ? `<span style="color:rgba(180,150,100,.5);font-size:11px"> Lv.${displayLv}</span>` : ''}
    </div>
    <div class="fp-choices">
      <button class="fp-btn fp-btn-fight" onclick="_handleFactionPatrolChoice('fight','${enemyId}','${dungeonId}','${fromPage}')">
        ⚔️ 迎战（进入战斗）
      </button>
      <button class="fp-btn fp-btn-sneak" onclick="_handleFactionPatrolChoice('sneak','${enemyId}','${dungeonId}','${fromPage}')">
        🏃 悄悄绕过去（消耗少量精力）
      </button>
    </div>
  </div>
</div>`;

  // 注入样式
  _injectFactionPatrolStyles();

  // 移除旧的（如果有）
  const old = document.getElementById('fpOverlay');
  if(old) old.remove();

  // 显示
  const overlay = document.createElement('div');
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  // 淡入动画
  const box = overlay.firstElementChild;
  box.style.opacity = '0';
  box.style.transform = 'scale(0.92)';
  requestAnimationFrame(() => {
    box.style.transition = 'opacity .25s, transform .25s';
    box.style.opacity = '1';
    box.style.transform = 'scale(1)';
  });
}

// 处理巡逻遭遇选择
function _handleFactionPatrolChoice(choice, enemyId, dungeonId, fromPage){
  _closeFactionPatrol();
  const ctx = _curPatrolCtx || {};
  if(choice === 'sneak'){
    // 消耗精力并悄悄绕过
    if(typeof edS !== 'undefined'){
      const cost = 5;
      edS.energy = Math.max(0, (typeof edS.energy !== 'undefined' ? edS.energy : 100) - cost);
      if(typeof saveProgress === 'function') saveProgress();
    }
    showToast(`🏃 悄悄绕过了巡逻队，消耗了 5 点精力`);
    // 直接进入地下城
    enterDungeonDirect(dungeonId, fromPage);
  } else {
    // 迎战 → 先打一场，打赢后再 enterDungeon
    _startFactionPatrolBattle(enemyId, dungeonId, fromPage, ctx.ownerId, ctx.patrolCityId);
  }
}

// 启动门派巡逻战斗
// @param ownerId - 城市控制门派ID（用于战后声望结算）
// @param patrolCityId - 触发巡逻遭遇的城市ID
function _startFactionPatrolBattle(enemyId, dungeonId, fromPage, ownerId, patrolCityId){
  const playerChar = _getDungeonPlayerChar();
  if(!playerChar){ showToast('请先创建或选择角色'); return; }

  if(typeof edS !== 'undefined'){
    // ★ 修复（2026-05-04）：直接用 edS.maxHp，不用 edStats()
    playerChar.maxHp = edS.maxHp || playerChar.maxHp || 100;
    // 当前血量：优先 travelPlayerState 百分比 → edS.hp → 满血
    if (typeof travelPlayerState !== 'undefined' && typeof travelPlayerState.hp === 'number') {
      playerChar._currentHp = Math.max(1, Math.round(playerChar.maxHp * travelPlayerState.hp / 100));
    } else if (typeof edS.hp === 'number') {
      playerChar._currentHp = Math.min(edS.hp, playerChar.maxHp);
    } else {
      playerChar._currentHp = playerChar.maxHp || 100;
    }
    playerChar.maxMp = edS.maxMp || playerChar.maxMp || 100;
    playerChar._currentMp = (typeof edS.mp === 'number' && edS.mp <= 99999) ? Math.min(edS.mp, playerChar.maxMp) : (playerChar.maxMp || 100);
  }

  const enemyDb = (typeof ENEMY_DB !== 'undefined' && ENEMY_DB) || {};
  const rawEnemy = enemyId ? enemyDb[enemyId] : null;
  if(!rawEnemy){ showToast('敌人数据异常'); enterDungeonDirect(dungeonId, fromPage); return; }

  // 门派巡逻敌人也受动态等级上限保护
  const playerLvForPatrol = (typeof edS !== 'undefined' ? edS.level : null) || (playerChar.level || 1) || 1;
  const patrolEnemyForScale = { ...rawEnemy };
  const maxPatrolGap = rawEnemy.tier === 'boss' ? 8 : 5;
  const maxPatrolLevel = playerLvForPatrol + maxPatrolGap;
  if ((rawEnemy.level || 1) > maxPatrolLevel) {
    patrolEnemyForScale.level = maxPatrolLevel;
    console.log(`[动态等级] 巡逻敌人等级超标：${rawEnemy.name} Lv${rawEnemy.level} → 钳制为 Lv${maxPatrolLevel}（玩家Lv${playerLvForPatrol}）`);
  }
  const scaledEnemy = (typeof scaleEnemy === 'function')
    ? scaleEnemy(patrolEnemyForScale, playerLvForPatrol)
    : patrolEnemyForScale;
  const enemyChar = _buildEnemyChar(scaledEnemy);

  // 保存当前地下城上下文，战斗结束后恢复
  // 包含 ownerId（门派，用于声望结算）和 patrolCityId（城市，用于声望变化）
  _pendingPatrolBattleCtx = {
    dungeonId, fromPage, _origEnemy: rawEnemy,
    ownerId: ownerId || null,
    patrolCityId: patrolCityId || null
  };

  startWildBattle(playerChar, enemyChar, _onFactionPatrolBattleEnd);
}

// 门派巡逻战斗结束回调
let _pendingPatrolBattleCtx = null;
function _onFactionPatrolBattleEnd(playerWon){
  const ctx = _pendingPatrolBattleCtx;
  _pendingPatrolBattleCtx = null;
  if(!ctx){ return; }

  const { dungeonId, fromPage, _origEnemy, ownerId, patrolCityId } = ctx;
  const origEnemy = _origEnemy || null;
  // 优先读 battle.js 实际发放值，其次用原始值兜底
  const expGain = window._lastBattleExpGain || (origEnemy ? (origEnemy.exp || 10) : 10);
  const silverGain = window._lastBattleSilverGain || (origEnemy ? (origEnemy.silver || 5) : 5);
  // 清除，防止下一战误用旧值
  window._lastBattleExpGain = null;
  window._lastBattleSilverGain = null;

  if(playerWon){
    // ── 打赢 → 银两 + 城市声望变化（经验已由 checkWin() 统一发放）──
    if(silverGain > 0){
      if(typeof SilverManager !== 'undefined'){
        SilverManager.add(silverGain); SilverManager.save();
      } else if(typeof addSilver === 'function'){
        addSilver(silverGain);
      } else if(typeof travelPlayerState !== 'undefined'){
        travelPlayerState.silver = (travelPlayerState.silver || 0) + silverGain;
      }
    }

    // 城市声望变化（仅在被门派控制的城市）
    const cityRepChange = _calcPatrolCityRepChange(ownerId, patrolCityId, true);
    if(cityRepChange !== 0 && typeof jianghuState !== 'undefined'){
      if(!jianghuState.cityRep) jianghuState.cityRep = {};
      if(!jianghuState.cityRep[patrolCityId]){
        jianghuState.cityRep[patrolCityId] = { rep: 0, align: 0 };
      }
      jianghuState.cityRep[patrolCityId].rep = Math.max(0, Math.min(100,
        jianghuState.cityRep[patrolCityId].rep + cityRepChange));
      if(typeof jianghuSave === 'function') jianghuSave();
      const repSign = cityRepChange > 0 ? '+' : '';
      showToast(`⚔️ 击败巡逻队！经验+${expGain}，银两+${silverGain}，城望${repSign}${cityRepChange}`);
      if(typeof townRefreshCityRepBar === 'function') townRefreshCityRepBar();
    } else {
      showToast(`⚔️ 击败巡逻队！获得经验 ${expGain}，银两 ${silverGain} 两`);
    }
    enterDungeonDirect(dungeonId, fromPage);

  } else {
    // ── 输了 → 城市声望降低 ──
    if(typeof edS !== 'undefined' && typeof edS.hp !== 'undefined'){
      // 战斗中已扣血，这里不再额外扣（地下城进入时会处理）
    }
    // 城市声望降低（被门派巡逻队打败，在该城市声望受损）
    if(patrolCityId && typeof jianghuState !== 'undefined'){
      if(!jianghuState.cityRep) jianghuState.cityRep = {};
      if(!jianghuState.cityRep[patrolCityId]){
        jianghuState.cityRep[patrolCityId] = { rep: 0, align: 0 };
      }
      const penalty = -5;
      jianghuState.cityRep[patrolCityId].rep = Math.max(0, Math.min(100,
        jianghuState.cityRep[patrolCityId].rep + penalty));
      if(typeof jianghuSave === 'function') jianghuSave();
      showToast(`💀 被巡逻队击退！城望${penalty}`);
      if(typeof townRefreshCityRepBar === 'function') townRefreshCityRepBar();
    } else {
      showToast(`💀 被巡逻队击退！`);
    }
    enterDungeonDirect(dungeonId, fromPage);
  }
}

/**
 * 计算门派巡逻战斗后的城市声望变化
 * @param {string|null} ownerId - 城市控制门派ID
 * @param {string|null} cityId - 城市ID
 * @param {boolean} playerWon - 玩家是否获胜
 * @returns {number} 声望变化值（负数=降低，正数=增加，0=无变化）
 */
function _calcPatrolCityRepChange(ownerId, cityId, playerWon){
  if(!ownerId || !cityId || typeof jianghuState === 'undefined') return 0;
  const playerSectId = (typeof edS !== 'undefined') ? edS.sectId : null;
  if(!playerSectId) return 0; // 无门派，不影响声望

  const playerSect = (typeof SECTS !== 'undefined')
    ? SECTS.find(s => s.id === playerSectId) : null;
  if(!playerSect) return 0;

  // 玩家门派与城市控制门派的关系
  const playerEnemies = playerSect.relations?.enemies || [];
  const playerAllies = playerSect.relations?.allies || [];
  const isHostile = playerEnemies.includes(ownerId);
  const isAllied = playerAllies.includes(ownerId);

  if(!playerWon) return -5; // 输了默认惩罚

  // 打赢的情况：
  if(isHostile){
    // 玩家门派与城市门派为敌 → 打赢是替天行道，城望微增
    return 2;
  } else if(isAllied){
    // 玩家门派与城市门派为盟友 → 打赢同门巡逻，城望不变
    return 0;
  } else {
    // 无特殊关系 → 得罪了该门派，城望微降
    return -3;
  }
}

// 关闭巡逻遭遇弹窗
function _closeFactionPatrol(){
  const el = document.getElementById('fpOverlay');
  if(el) el.remove();
}

// 注入门派巡逻遭遇弹窗样式
function _injectFactionPatrolStyles(){
  if(document.getElementById('fp-styles')) return;
  const st = document.createElement('style');
  st.id = 'fp-styles';
  st.textContent = `
.fp-overlay {
  position:fixed;inset:0;z-index:910;background:rgba(0,0,0,.88);
  display:flex;align-items:center;justify-content:center;
  padding:16px;box-sizing:border-box;
}
.fp-box {
  background:linear-gradient(160deg,rgba(18,12,4,.98),rgba(8,6,2,.99));
  border:1px solid rgba(180,120,40,.35);border-radius:12px;
  max-width:340px;width:100%;padding:20px 18px;
  box-shadow:0 8px 40px rgba(0,0,0,.6);
}
.fp-header{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.fp-icon{font-size:38px}
.fp-title{color:#e8c070;font-size:16px;font-weight:bold}
.fp-subtitle{font-size:12px;margin-top:2px}
.fp-narrative{
  color:rgba(200,180,140,.85);font-size:13px;line-height:1.75;
  background:rgba(255,255,255,.03);border-radius:6px;padding:10px 12px;
  margin-bottom:12px;border-left:2px solid rgba(180,120,40,.3);
}
.fp-enemy-hint{
  font-size:13px;color:#c09060;margin-bottom:14px;
  display:flex;align-items:center;gap:6px;
}
.fp-choices{display:flex;flex-direction:column;gap:8px}
.fp-btn{
  width:100%;padding:10px 12px;border-radius:8px;border:none;
  font-size:13px;cursor:pointer;transition:opacity .15s,transform .1s;
}
.fp-btn:hover{opacity:.85;transform:scale(1.01)}
.fp-btn:active{transform:scale(.99)}
.fp-btn-fight{background:linear-gradient(135deg,#8b2020,#6b1010);color:#f0c0a0}
.fp-btn-sneak{background:rgba(60,80,60,.4);color:#a0c0a0;border:1px solid rgba(80,120,80,.3)}
`;
  document.head.appendChild(st);
}

// 直接进入地下城（不触发巡逻遭遇，用于巡逻遭遇选择后的后续入口）
function enterDungeonDirect(dungeonId, fromPage){
  // 手动执行 enterDungeon 核心逻辑（不去重）
  _enterDungeonCore(dungeonId, fromPage);
}

// enterDungeon 核心逻辑（去除巡逻检查）
function _enterDungeonCore(dungeonId, fromPage){
  const dungeon = DUNGEON_DB[dungeonId] || (typeof STORY_DUNGEON_DB !== 'undefined' && STORY_DUNGEON_DB[dungeonId]);
  if(!dungeon){ showToast('找不到该地下城数据'); return; }
  const player = (typeof edS !== 'undefined' && edS && edS.name) ? edS : null;
  const playerLevel = player ? (player.level || 1) : 1;
  if(playerLevel < dungeon.minLevel - 5){
    showToast(`⚠️ 你的等级（${playerLevel}）太低，至少需要 ${dungeon.minLevel - 5} 级才能进入。`);
    return;
  }
  const mapCopy = dungeon.map.map(row =>
    row ? row.map(cell => cell ? Object.assign({}, cell) : null) : null
  );
  let startRow = dungeon.startPos ? dungeon.startPos[0] : 0;
  let startCol = dungeon.startPos ? dungeon.startPos[1] : 0;
  if(!mapCopy[startRow] || !mapCopy[startRow][startCol]){
    outer: for(let r = 0; r < mapCopy.length; r++){
      if(!mapCopy[r]) continue;
      for(let c = 0; c < mapCopy[r].length; c++){
        if(mapCopy[r][c]){ startRow = r; startCol = c; break outer; }
      }
    }
  }
  const prevSave = dungeonLoadSave();
  let initLives = 3;
  let initLastRest = [startRow, startCol];
  if(prevSave && prevSave.dungeonId === dungeonId && !prevSave.isCompleted){
    if(prevSave.clearedMap){
      prevSave.clearedMap.forEach((saveRow, r) => {
        if(!saveRow) return;
        saveRow.forEach((saveCell, c) => {
          if(mapCopy[r] && mapCopy[r][c] && saveCell){
            mapCopy[r][c].cleared = saveCell.cleared;
          }
        });
      });
    }
    if(prevSave.pos){ startRow = prevSave.pos[0]; startCol = prevSave.pos[1]; }
    if(prevSave.lives !== undefined) initLives = prevSave.lives;
    if(prevSave.lastRestPos) initLastRest = prevSave.lastRestPos;
  }
  _dungeonState = {
    dungeonId, dungeon, map: mapCopy,
    pos: [startRow, startCol],
    clearedRooms: prevSave && prevSave.dungeonId === dungeonId ? (prevSave.clearedRooms || 0) : 0,
    totalBattles: prevSave && prevSave.dungeonId === dungeonId ? (prevSave.totalBattles || 0) : 0,
    pendingReward: null,
    fromPage: fromPage || 'map',
    stepsSinceRest: 0, isCompleted: false,
    lives: initLives,
    _initialLives: initLives,
    lastRestPos: initLastRest,
    meditateLeft: (prevSave && prevSave.dungeonId === dungeonId && prevSave.meditateLeft !== undefined)
      ? prevSave.meditateLeft : 3,
  };
  dungeonSave();
  if(typeof playAudio === 'function') playAudio('dungeon_enter');
  window.location.href = 'dungeon.html';
}

// ─────────────────────────────────────────────────────
//  进入地下城
// ─────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────
//  进入地下城
// ─────────────────────────────────────────────────────
function enterDungeon(dungeonId, fromPage){
  const dungeon = DUNGEON_DB[dungeonId] || (typeof STORY_DUNGEON_DB !== 'undefined' && STORY_DUNGEON_DB[dungeonId]);
  if(!dungeon){ showToast('找不到该地下城数据'); return; }

  // 获取玩家角色
  const player = (typeof edS !== 'undefined' && edS && edS.name) ? edS : null;
  const playerLevel = player ? (player.level || 1) : 1;

  // 等级检查
  if(playerLevel < dungeon.minLevel - 5){
    showToast(`⚠️ 你的等级（${playerLevel}）太低，至少需要 ${dungeon.minLevel - 5} 级才能进入。`);
    return;
  }

  // ── 门派巡逻遭遇检查 ──
  // 从地下城的附近城市中找控制势力
  const nearCities = dungeon.nearCities || [];
  let factionPatrol = null;
  for(const cId of nearCities){
    if(typeof jhGetFactionPatrolEnemy === 'function'){
      factionPatrol = jhGetFactionPatrolEnemy(cId, dungeon.minLevel);
      if(factionPatrol) break;
    }
  }
  if(factionPatrol && typeof jhShouldTriggerFactionPatrol === 'function'){
    // 检查是否应该触发（每日上限 + 随机概率）
    const nearCity = nearCities.find(c => jhGetFactionPatrolEnemy(c, dungeon.minLevel));
    if(nearCity && jhShouldTriggerFactionPatrol(nearCity, dungeonId)){
      // 触发门派巡逻遭遇 → 显示选择弹窗
      _showFactionPatrolEncounter(dungeonId, fromPage, factionPatrol, nearCity);
      return;
    }
  }

  // 深拷贝地图（保留原始数据不变）
  const mapCopy = dungeon.map.map(row =>
    row ? row.map(cell => cell ? Object.assign({}, cell) : null) : null
  );

  // 找入口位置
  let startRow = dungeon.startPos ? dungeon.startPos[0] : 0;
  let startCol = dungeon.startPos ? dungeon.startPos[1] : 0;

  // 防御性修复：如果 startPos 落在 null 格（墙壁），自动找第一个非 null 格
  if(!mapCopy[startRow] || !mapCopy[startRow][startCol]){
    outer: for(let r = 0; r < mapCopy.length; r++){
      if(!mapCopy[r]) continue;
      for(let c = 0; c < mapCopy[r].length; c++){
        if(mapCopy[r][c]){ startRow = r; startCol = c; break outer; }
      }
    }
  }


  // 尝试读取未完成的地下城存档
  const prevSave = dungeonLoadSave();
  let initLives    = 3;
  let initLastRest = [startRow, startCol];
  if(prevSave && prevSave.dungeonId === dungeonId && !prevSave.isCompleted){
    // 恢复已清理的房间
    if(prevSave.clearedMap){
      prevSave.clearedMap.forEach((saveRow, r) => {
        if(!saveRow) return;
        saveRow.forEach((saveCell, c) => {
          if(mapCopy[r] && mapCopy[r][c] && saveCell){
            mapCopy[r][c].cleared = saveCell.cleared;
          }
        });
      });
    }
    // 恢复位置/命数/休息点
    if(prevSave.pos) { startRow = prevSave.pos[0]; startCol = prevSave.pos[1]; }
    if(prevSave.lives !== undefined) initLives    = prevSave.lives;
    if(prevSave.lastRestPos)         initLastRest = prevSave.lastRestPos;
  }

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"地牢隐藏房间系统
  // ═══════════════════════════════════════════════════════════════
  // 每层有概率生成隐藏房间和陷阱房
  const HIDDEN_ROOM_CHANCE = 0.05;  // 5%每层有隐藏房
  const TRAP_ROOM_CHANCE = 0.08;    // 8%每层有陷阱房
  
  // 随机添加隐藏房间（在空地中随机选一个变成隐藏宝箱房）
  if(Math.random() < HIDDEN_ROOM_CHANCE){
    const emptyCells = [];
    for(let r = 0; r < mapCopy.length; r++){
      if(!mapCopy[r]) continue;
      for(let c = 0; c < mapCopy[r].length; c++){
        if(mapCopy[r][c] && mapCopy[r][c].type === 'empty'){
          emptyCells.push([r, c]);
        }
      }
    }
    if(emptyCells.length > 0){
      const [hr, hc] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      mapCopy[hr][hc] = {
        type: 'hidden',
        desc: '一堵看似普通的墙壁，但隐约能听到后面有风声...',
        icon: '🧱',
        hiddenReward: true,
        cleared: false
      };
      console.log(`[将将胡] 🧱 隐藏房间生成于 [${hr},${hc}]`);
    }
  }
  
  // 随机添加陷阱房（在战斗房中随机选一个变成陷阱房）
  if(Math.random() < TRAP_ROOM_CHANCE){
    const battleCells = [];
    for(let r = 0; r < mapCopy.length; r++){
      if(!mapCopy[r]) continue;
      for(let c = 0; c < mapCopy[r].length; c++){
        if(mapCopy[r][c] && mapCopy[r][c].type === 'battle'){
          battleCells.push([r, c]);
        }
      }
    }
    if(battleCells.length > 0){
      const [tr, tc] = battleCells[Math.floor(Math.random() * battleCells.length)];
      mapCopy[tr][tc] = {
        type: 'trap',
        desc: '地面上有奇怪的机关痕迹，似乎暗藏杀机...',
        icon: '🕸️',
        trapType: ['spike', 'poison', 'fall', 'arrow'][Math.floor(Math.random() * 4)],
        cleared: false
      };
      console.log(`[将将胡] 🕸️ 陷阱房生成于 [${tr},${tc}]`);
    }
  }
  
  _dungeonState = {
    dungeonId,
    dungeon,
    map: mapCopy,
    pos: [startRow, startCol],
    clearedRooms: prevSave && prevSave.dungeonId === dungeonId ? (prevSave.clearedRooms || 0) : 0,
    totalBatties: prevSave && prevSave.dungeonId === dungeonId ? (prevSave.totalBattles || 0) : 0,
    pendingReward: null,
    fromPage: fromPage || 'map',
    stepsSinceRest: 0,
    isCompleted: false,
    lives: initLives,               // 【方案A】3条命（或存档值）
    _initialLives: initLives,       // 【修复】记录初始命数用于无伤判定
    lastRestPos: initLastRest,      // 最近休息/安全点
    meditateLeft: (prevSave && prevSave.dungeonId === dungeonId && prevSave.meditateLeft !== undefined)
      ? prevSave.meditateLeft : 3,  // 打坐次数（每次地下城3次，休息点可恢复1次）
  };

  // 切换到地下城页面（立即保存，防止刷新丢失命数）
  dungeonSave();
  if (typeof playAudio === 'function') playAudio('dungeon_enter');
  _showDungeonPage();

  // ── 情境任务触发：进入地下城 ──
  if(typeof triggerContextualDungeon === 'function'){
    try{ triggerContextualDungeon(dungeonId); }catch(e){}
  }
  // ── 情境任务触发：首次进入地下城行为 ──
  if(typeof triggerContextualAction === 'function'){
    try{ triggerContextualAction('dungeon_enter'); }catch(e){}
  }
  // ── 事件链触发：进入地下城 ──
  if(typeof checkEventChainTriggers === 'function'){
    try{ checkEventChainTriggers('dungeon', { dungeonId }); }catch(e){}
  }
}

// ─────────────────────────────────────────────────────
//  渲染地下城页面
// ─────────────────────────────────────────────────────
function _showDungeonPage(){
  const ds = _dungeonState;
  if(!ds) return;

  // 检查是否是独立页面模式（dungeon.html）
  const isStandalone = !!document.getElementById('dungeonContainer');
  
  if(isStandalone){
    // 独立页面模式：直接渲染到 dungeonContainer
    _renderDungeonUIStandalone();
    return;
  }

  // 嵌入式模式（ascii-heroes.html）
  const page = document.getElementById('pageDungeon');
  if(!page) return;

  // 切换Tab
  const allTabs = document.querySelectorAll('.tab');
  allTabs.forEach(t => t.classList.remove('active'));
  const dungeonTab = [...allTabs].find(t => t.dataset.page === 'dungeon');
  if(dungeonTab) dungeonTab.classList.add('active');

  // 隐藏所有页面（与 ui-pages.js 的 showPage 保持一致）
  const ALL_PAGE_IDS = ['pageGallery','pageFight','pageEditor','pageSkills',
                        'pageSects','pageWeapons','pageMap','pageDungeon'];
  ALL_PAGE_IDS.forEach(pid => {
    const el = document.getElementById(pid);
    if(el) el.style.display = 'none';
  });
  // 隐藏地图背景粒子
  const mbc = document.getElementById('mapBgCanvas');
  if(mbc) mbc.style.display = 'none';
  page.style.display = 'block';

  _renderDungeonUI();
}

function _renderDungeonUI(){
  const ds = _dungeonState;
  if(!ds){ return; }
  const page = document.getElementById('pageDungeon');
  if(!page) return;

  const dungeon = ds.dungeon;
  const [pr, pc] = ds.pos;

  // ── 获取玩家状态 ──
  const player = (typeof edS !== 'undefined') ? edS : null;
  const playerHp    = player ? (typeof player.hp === 'number' ? player.hp : (player.maxHp || 100)) : 100;
  const playerMaxHp = player ? (player.maxHp || 100)                  : 100;
  const playerMp    = player ? (player.mp    || player.maxMp || 100)  : 100;
  const playerMaxMp = player ? (player.maxMp || 100)                  : 100;
  const hpPct = Math.max(0, Math.min(100, Math.round(playerHp / playerMaxHp * 100)));
  const mpPct = Math.max(0, Math.min(100, Math.round(playerMp / playerMaxMp * 100)));

  const hpColor = hpPct > 60 ? '#4ecb71' : hpPct > 30 ? '#f0c060' : '#e05040';

  // 【方案A】命数显示
  const lives = ds.lives !== undefined ? ds.lives : 3;
  const livesHtml = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives));

  // ── 构建地图格子HTML ──
  const mapRows = ds.map;
  let mapHtml = '<div class="dg-map">';
  for(let row = 0; row < mapRows.length; row++){
    mapHtml += '<div class="dg-map-row">';
    for(let col = 0; col < mapRows[row].length; col++){
      const cell = mapRows[row][col];
      const isPlayer = (row === pr && col === pc);
      const isNull = !cell;

      if(isNull){
        mapHtml += '<div class="dg-cell dg-wall"></div>';
        continue;
      }

      // 是否可到达（与当前位置相邻且中间无墙）
      const isAdjacent = _isAdjacent(pr, pc, row, col, mapRows);
      // 视野：只有相邻1格（上下左右）和当前格可见，其余为迷雾
      // 已清理的格子始终可见（玩家探索过的）
      const isKnown = cell.cleared || isAdjacent || isPlayer;

      let cellClass = 'dg-cell';
      if(isPlayer) cellClass += ' dg-player';
      else if(cell.cleared) cellClass += ' dg-cleared';
      else if(isAdjacent) cellClass += ' dg-adjacent';
      else if(isKnown) cellClass += ' dg-known';
      else cellClass += ' dg-fog';

      let icon = isPlayer ? '🧍' : (!isKnown ? '▓' : ROOM_ICONS[cell.type] || '·');
      if(cell.cleared && !isPlayer) icon = '·';

      const clickable = isAdjacent && !isPlayer;
      const onclick = clickable ? `onclick="dungeonMoveTo(${row},${col})"` : '';
      const title = isKnown ? (cell.desc || cell.type) : '???';

      mapHtml += `<div class="${cellClass}" ${onclick} title="${title}">
        <span class="dg-cell-icon">${icon}</span>
      </div>`;
    }
    mapHtml += '</div>';
  }
  mapHtml += '</div>';

  // ── 当前房间描述 ──
  const curCell = mapRows[pr][pc];
  const curDesc = curCell ? curCell.desc : '';
  const curType = curCell ? curCell.type : 'empty';
  const curIcon = ROOM_ICONS[curType] || '·';

  // ── 可用操作按钮 ──
  let actionHtml = '';
  if(curCell && !curCell.cleared){
    if(curType === 'battle' || curType === 'elite'){
      actionHtml += `<button class="dg-action-btn dg-fight-btn" onclick="dungeonStartBattle()">⚔️ 迎战</button>`;
    } else if(curType === 'boss'){
      actionHtml += `<button class="dg-action-btn dg-boss-btn" onclick="dungeonStartBattle()">💀 挑战BOSS</button>`;
    } else if(curType === 'chest'){
      actionHtml += `<button class="dg-action-btn dg-chest-btn" onclick="dungeonOpenChest()">📦 开箱</button>`;
    } else if(curType === 'trap'){
      actionHtml += `<button class="dg-action-btn dg-trap-btn" onclick="dungeonTriggerTrap()">⚠️ 触碰</button>`;
      actionHtml += `<button class="dg-action-btn" onclick="dungeonDodgeTrap()">🏃 绕开</button>`;
    } else if(curType === 'rest'){
      actionHtml += `<button class="dg-action-btn dg-rest-btn" onclick="dungeonRest()">🔥 休整</button>`;
    } else if(curType === 'event'){
      actionHtml += `<button class="dg-action-btn dg-event-btn" onclick="dungeonTriggerEvent()">❓ 探查</button>`;
    } else if(curType === 'collect'){
      actionHtml += `<button class="dg-action-btn" onclick="dungeonCollect()">⛏️ 采集</button>`;
    } else if(curType === 'hidden'){
      actionHtml += `<button class="dg-action-btn dg-hidden-btn" onclick="dungeonExploreHidden()">🧱 探索</button>`;
      actionHtml += `<button class="dg-action-btn" onclick="dungeonIgnoreHidden()">🚶 离开</button>`;
    }
  }
  // 随时可用：打坐回血（有次数限制）、用药
  const meditateLeft = ds.meditateLeft !== undefined ? ds.meditateLeft : 3;
  const meditateDisabled = meditateLeft <= 0 ? 'disabled style="opacity:.45"' : '';
  actionHtml += `<button class="dg-action-btn dg-meditate-btn" onclick="dungeonMeditate()" ${meditateDisabled}>🧘 打坐 (${meditateLeft})</button>`;
  const healItems = _dungeonGetHealItems();
  if(healItems.length > 0){
    const totalMeds = healItems.reduce((s,i)=>s+(i.qty||1),0);
    const medLabel = healItems.length === 1 ? (healItems[0].icon||'💊')+' 用药' : `💊 用药(${totalMeds})`;
    actionHtml += `<button class="dg-action-btn dg-item-btn" onclick="dungeonUseHealItem()">${medLabel}</button>`;
  }

  // ── 进度 ──
  const totalRooms = ds.map.flat().filter(c => c && c.type !== 'entry').length;
  const progressPct = Math.round(ds.clearedRooms / totalRooms * 100);

  // ── 方向提示 ──
  const dirHint = _getAvailableDirections(pr, pc, mapRows);

  // ── 完整页面渲染 ──
  page.innerHTML = `
<div class="dg-wrap">
  <!-- 顶部标题 -->
  <div class="dg-header">
    <button class="dg-back-btn" onclick="dungeonRetreat()">← 撤退</button>
    <div class="dg-title">
      <span class="dg-icon">${dungeon.icon}</span>
      <span class="dg-name">${dungeon.name}</span>
      <span class="dg-level">Lv${dungeon.minLevel}~${dungeon.maxLevel}</span>
    </div>
    <div class="dg-progress-badge">${ds.clearedRooms}/${totalRooms} 间</div>
  </div>

  <!-- 玩家状态条 -->
  <div class="dg-status-bar">
    <div class="dg-stat-item">
      <span class="dg-stat-label">气血</span>
      <div class="dg-bar-track">
        <div class="dg-bar-fill" style="width:${hpPct}%;background:${hpColor}"></div>
      </div>
      <span class="dg-stat-num">${playerHp}/${playerMaxHp}</span>
    </div>
    <div class="dg-stat-item">
      <span class="dg-stat-label">内力</span>
      <div class="dg-bar-track">
        <div class="dg-bar-fill" style="width:${mpPct}%;background:#5090e0"></div>
      </div>
      <span class="dg-stat-num">${playerMp}/${playerMaxMp}</span>
    </div>
    <div class="dg-stat-item dg-lives-row">
      <span class="dg-stat-label">生机</span>
      <span class="dg-lives-icons">${livesHtml}</span>
    </div>
    <div class="dg-progress-bar">
      <div class="dg-progress-fill" style="width:${progressPct}%"></div>
      <span class="dg-progress-label">探索 ${progressPct}%</span>
    </div>
  </div>

  <!-- 主体：地图 + 当前房间信息 -->
  <div class="dg-main">
    <!-- 地图 -->
    <div class="dg-map-wrap">
      <div class="dg-map-title">地下城地图</div>
      ${mapHtml}
      <div class="dg-dir-hint">${dirHint}</div>
    </div>

    <!-- 当前房间 -->
    <div class="dg-room-panel">
      <div class="dg-room-icon">${curIcon}</div>
      <div class="dg-room-type">${_roomTypeName(curType)}</div>
      <div class="dg-room-desc">${curDesc}</div>

      <!-- 已清理标记 -->
      ${curCell && curCell.cleared && curType !== 'entry' ? '<div class="dg-cleared-badge">✓ 已清理</div>' : ''}

      <!-- 操作按钮 -->
      <div class="dg-actions">${actionHtml}</div>

      <!-- 战斗日志 -->
      <div class="dg-log" id="dgLog"></div>
    </div>
  </div>
</div>`;
}

// 房间类型中文名
function _roomTypeName(type){
  const names = {
    empty:'空地', battle:'战斗', elite:'精英战斗', boss:'BOSS', chest:'宝箱',
    trap:'陷阱', rest:'休息点', event:'随机事件', collect:'采集点', entry:'入口', exit:'出口',
  };
  return names[type] || '未知';
}

// ─────────────────────────────────────────────────────
//  独立页面渲染（dungeon.html）
// ─────────────────────────────────────────────────────
function _renderDungeonUIStandalone(){
  const ds = _dungeonState;
  if(!ds){ return; }
  const container = document.getElementById('dungeonContainer');
  if(!container) return;


  const dungeon = ds.dungeon;
  const [pr, pc] = ds.pos;

  // ── 获取玩家状态 ──
  const player = (typeof edS !== 'undefined') ? edS : null;
  const playerHp    = player ? (typeof player.hp === 'number' ? player.hp : (player.maxHp || 100)) : 100;
  const playerMaxHp = player ? (player.maxHp || 100)                  : 100;
  const playerMp    = player ? (player.mp    || player.maxMp || 100)  : 100;
  const playerMaxMp = player ? (player.maxMp || 100)                  : 100;
  const playerLevel = player ? (player.level || 1) : 1;
  const playerTotalExp = player ? (player.totalExp || 0) : 0;
  const hpPct = Math.max(0, Math.min(100, Math.round(playerHp / playerMaxHp * 100)));
  const mpPct = Math.max(0, Math.min(100, Math.round(playerMp / playerMaxMp * 100)));
  const hpColor = hpPct > 60 ? '#4ecb71' : hpPct > 30 ? '#f0c060' : '#e05040';
  
  // ── 计算经验条 ──
  let expPct = 0, expCur = 0, expNeed = 100;
  if(typeof expNeededForLevel === 'function'){
    const expThisLv = expNeededForLevel(playerLevel);
    const expNextLv = expNeededForLevel(playerLevel + 1);
    expCur = playerTotalExp - expThisLv;
    expNeed = expNextLv - expThisLv;
    expPct = Math.max(0, Math.min(100, Math.round((expCur / expNeed) * 100)));
  } else {
    // fallback: 简单计算
    expCur = playerTotalExp % 100;
    expNeed = 100;
    expPct = expCur;
  }

  // 命数显示
  const lives = ds.lives !== undefined ? ds.lives : 3;
  const livesHtml = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives));

  // ── 构建地图格子HTML ──
  const mapRows = ds.map;
  let mapHtml = '<div class="dg-map">';
  for(let row = 0; row < mapRows.length; row++){
    mapHtml += '<div class="dg-map-row">';
    for(let col = 0; col < mapRows[row].length; col++){
      const cell = mapRows[row][col];
      const isPlayer = (row === pr && col === pc);
      const isNull = !cell;

      if(isNull){
        mapHtml += '<div class="dg-cell dg-wall"></div>';
        continue;
      }

      const isAdjacent = _isAdjacent(pr, pc, row, col, mapRows);
      const isKnown = cell.cleared || isAdjacent || isPlayer;

      let cellClass = 'dg-cell';
      if(isPlayer) cellClass += ' dg-player';
      else if(cell.cleared) cellClass += ' dg-cleared';
      else if(isAdjacent) cellClass += ' dg-adjacent';
      else if(isKnown) cellClass += ' dg-known';
      else cellClass += ' dg-fog';

      let icon = isPlayer ? '🧍' : (!isKnown ? '▓' : (ROOM_ICONS[cell.type] || '·'));
      // 已清理的房间显示为点，但宝箱显示为空箱子
      if(cell.cleared && !isPlayer) {
        icon = (cell.type === 'chest') ? '📭' : '·';
      }

      const clickable = isAdjacent && !isPlayer;
      const onclick = clickable ? `onclick="dungeonMoveTo(${row},${col})"` : '';
      const title = isKnown ? (cell.desc || cell.type) : '???';

      mapHtml += `<div class="${cellClass}" ${onclick} title="${title}">
        <span class="dg-cell-icon">${icon}</span>
      </div>`;
    }
    mapHtml += '</div>';
  }
  mapHtml += '</div>';

  // ── 当前房间描述 ──
  const curCell = mapRows[pr][pc];
  const curDesc = curCell ? curCell.desc : '';
  const curType = curCell ? curCell.type : 'empty';
  let curIcon = ROOM_ICONS[curType] || '·';
  
  // 宝箱房：使用字符画宝箱代替emoji
  let chestAsciiHtml = '';
  if(curType === 'chest' && curCell){
    curIcon = ''; // 不使用emoji
    if(!curCell.cleared){
      // 未开启的宝箱
      chestAsciiHtml = `
      <div class="dg-chest-ascii" style="font-family:'Courier New',monospace;font-size:10px;line-height:1.2;color:#c09050;text-align:center;white-space:pre;margin:10px 0;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));">
        ╭──────────╮
        │  ▓▓▓▓▓▓  │
        │ ▓▓▓▓▓▓▓▓ │
        │ ▓▓  🔒  ▓▓ │
        │ ▓▓▓▓▓▓▓▓ │
        ╰────┬┬────╯
             ││
      </div>`;
    } else {
      // 已开启的宝箱（空箱子）
      chestAsciiHtml = `
      <div class="dg-chest-ascii" style="font-family:'Courier New',monospace;font-size:10px;line-height:1.2;color:#888;text-align:center;white-space:pre;margin:10px 0;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));">
        ╭──────────╮
        │          │
        │          │
        │   空     │
        │          │
        ╰────┬┬────╯
             ││
      </div>`;
    }
  }

  // ── 可用操作按钮 ──
  let actionHtml = '';
  // 宝箱房：未开启时显示开箱按钮
  if(curType === 'chest' && curCell && !curCell.cleared){
    actionHtml += `<button class="dg-action-btn dg-chest-btn" onclick="dungeonOpenChest()">📦 开箱</button>`;
  }
  // 陷阱房：显示触碰/绕开按钮
  if(curType === 'trap' && curCell && !curCell.cleared){
    actionHtml += `<button class="dg-action-btn dg-trap-btn" onclick="dungeonTriggerTrap()">⚠️ 触碰</button>`;
    actionHtml += `<button class="dg-action-btn" onclick="dungeonDodgeTrap()">🏃 绕开</button>`;
  }
  // 战斗房：显示迎战按钮（用于手动触发）
  if((curType === 'battle' || curType === 'elite' || curType === 'boss') && curCell && !curCell.cleared){
    const btnText = curType === 'boss' ? '💀 挑战BOSS' : '⚔️ 迎战';
    actionHtml += `<button class="dg-action-btn dg-fight-btn" onclick="dungeonStartBattle()">${btnText}</button>`;
  }
  // 休息房：显示休整按钮
  if(curType === 'rest' && curCell && !curCell.cleared){
    actionHtml += `<button class="dg-action-btn dg-rest-btn" onclick="dungeonRest()">🔥 休整</button>`;
  }
  // 事件房：显示探查按钮
  if(curType === 'event' && curCell && !curCell.cleared){
    actionHtml += `<button class="dg-action-btn dg-event-btn" onclick="dungeonTriggerEvent()">❓ 探查</button>`;
  }
  // 采集房：显示采集按钮
  if(curType === 'collect' && curCell && !curCell.cleared){
    actionHtml += `<button class="dg-action-btn" onclick="dungeonCollect()">⛏️ 采集</button>`;
  }
  // 隐藏房：显示探索/离开按钮
  if(curType === 'hidden' && curCell && !curCell.cleared){
    actionHtml += `<button class="dg-action-btn dg-hidden-btn" onclick="dungeonExploreHidden()">🧱 探索</button>`;
    actionHtml += `<button class="dg-action-btn" onclick="dungeonIgnoreHidden()">🚶 离开</button>`;
  }
  // 随时可用：打坐回血（有次数限制）

  const meditateLeft = ds.meditateLeft !== undefined ? ds.meditateLeft : 3;
  const meditateDisabled = meditateLeft <= 0 ? 'disabled style="opacity:.45"' : '';
  actionHtml += `<button class="dg-action-btn dg-meditate-btn" onclick="dungeonMeditate()" ${meditateDisabled}>🧘 打坐 (${meditateLeft})</button>`;
  const healItemsSA = _dungeonGetHealItems();
  if(healItemsSA.length > 0){
    const totalMedsSA = healItemsSA.reduce((s,i)=>s+(i.qty||1),0);
    const medLabelSA = healItemsSA.length === 1 ? (healItemsSA[0].icon||'💊')+' 用药' : `💊 用药(${totalMedsSA})`;
    actionHtml += `<button class="dg-action-btn dg-item-btn" onclick="dungeonUseHealItem()">${medLabelSA}</button>`;
  }

  // ── 进度 ──
  const totalRooms = ds.map.flat().filter(c => c && c.type !== 'entry').length;
  const progressPct = Math.round(ds.clearedRooms / totalRooms * 100);

  // ── 方向提示 ──
  const dirHint = _getAvailableDirections(pr, pc, mapRows);

  // ── 渲染到独立页面容器 ──
  container.innerHTML = `
<div class="dg-wrap">
  <!-- 顶部标题 -->
  <div class="dg-header">
    <button class="dg-back-btn" onclick="dungeonRetreat()">← 撤退</button>
    <div class="dg-title">
      <span class="dg-icon">${dungeon.icon}</span>
      <span class="dg-name">${dungeon.name}</span>
      <span class="dg-level">Lv${dungeon.minLevel}~${dungeon.maxLevel}</span>
    </div>
    <div class="dg-progress-badge">${ds.clearedRooms}/${totalRooms} 间</div>
  </div>

  <!-- 玩家状态条 -->
  <div class="dg-status-bar">
    <div class="dg-stat-item">
      <span class="dg-stat-label">气血</span>
      <div class="dg-bar-track">
        <div class="dg-bar-fill" style="width:${hpPct}%;background:${hpColor}"></div>
      </div>
      <span class="dg-stat-num">${playerHp}/${playerMaxHp}</span>
    </div>
    <div class="dg-stat-item">
      <span class="dg-stat-label">内力</span>
      <div class="dg-bar-track">
        <div class="dg-bar-fill" style="width:${mpPct}%;background:#5090e0"></div>
      </div>
      <span class="dg-stat-num">${playerMp}/${playerMaxMp}</span>
    </div>
    <div class="dg-stat-item dg-lives-row">
      <span class="dg-stat-label">生机</span>
      <span class="dg-lives-icons">${livesHtml}</span>
    </div>
    <div class="dg-stat-item">
      <span class="dg-stat-label">经验</span>
      <div class="dg-bar-track">
        <div class="dg-bar-fill" style="width:${expPct}%;background:linear-gradient(90deg,#d4a030,#f0c060)"></div>
      </div>
      <span class="dg-stat-num">Lv${playerLevel} ${expCur}/${expNeed}</span>
    </div>
    <div class="dg-progress-bar">
      <div class="dg-progress-fill" style="width:${progressPct}%"></div>
      <span class="dg-progress-label">探索 ${progressPct}%</span>
    </div>
  </div>

  <!-- 主体：地图 + 当前房间信息 -->
  <div class="dg-main">
    <!-- 地图 -->
    <div class="dg-map-wrap">
      <div class="dg-map-title">地下城地图</div>
      ${mapHtml}
      <div class="dg-dir-hint">${dirHint}</div>
    </div>

    <!-- 当前房间 -->
    <div class="dg-room-panel">
      <div class="dg-room-icon">${curIcon}</div>
      ${chestAsciiHtml}
      <div class="dg-room-type">${_roomTypeName(curType)}</div>
      <div class="dg-room-desc">${curDesc}</div>

      <!-- 已清理标记 -->
      ${curCell && curCell.cleared && curType !== 'entry' ? '<div class="dg-cleared-badge">✓ 已清理</div>' : ''}

      <!-- 操作按钮 -->
      <div class="dg-actions">${actionHtml}</div>

      <!-- 战斗日志 -->
      <div class="dg-log" id="dgLog"></div>
    </div>
  </div>
</div>`;
}

// ─────────────────────────────────────────────────────
//  移动逻辑
// ─────────────────────────────────────────────────────
function _isAdjacent(pr, pc, row, col, mapRows){
  // 只能上下左右移动一格（不可斜向）
  const dr = Math.abs(row - pr);
  const dc = Math.abs(col - pc);
  
  // 距离为0：站在原地，允许
  if(dr === 0 && dc === 0) return true;
  
  // 距离不为1：不允许
  if(dr + dc !== 1) return false;
  
  // 目标格必须存在
  if(!mapRows[row]) return false;
  if(!mapRows[row][col]) return false;
  return true;
}

function _getAvailableDirections(pr, pc, mapRows){
  const dirs = [];
  const checks = [
    { dr:-1, dc:0, label:'↑ 上' },
    { dr:1,  dc:0, label:'↓ 下' },
    { dr:0,  dc:-1,label:'← 左' },
    { dr:0,  dc:1, label:'→ 右' },
  ];
  for(const d of checks){
    const nr = pr + d.dr, nc = pc + d.dc;
    if(mapRows[nr] && mapRows[nr][nc]){
      const cell = mapRows[nr][nc];
      const icon = cell.cleared ? '·' : (ROOM_ICONS[cell.type] || '?');
      dirs.push(`${d.label}(${icon})`);
    }
  }
  return dirs.length ? dirs.join('　') : '四面皆路已尽';
}

// 防止重复移动的标志
let _isMoving = false;

function dungeonMoveTo(row, col){
  // 防止重复触发
  if(_isMoving) return;
  
  const ds = _dungeonState;
  if(!ds) {
    console.error('[dungeonMoveTo] _dungeonState 为空');
    return;
  }

  const [pr, pc] = ds.pos;
  
  const isAdj = _isAdjacent(pr, pc, row, col, ds.map);
  if(!isAdj){
    showToast('只能移动到相邻房间');
    return;
  }
  
  // 如果点击的是当前位置，不做任何操作
  if(pr === row && pc === col) return;
  
  _isMoving = true;

  // 如果当前房间有未清理的战斗，不允许离开
  const curCell = ds.map[pr][pc];
  if(curCell && !curCell.cleared &&
     (curCell.type === 'battle' || curCell.type === 'elite' || curCell.type === 'boss')){
    showToast('⚠️ 此处有敌人，必须先战斗才能离开！');
    _isMoving = false;  // 【修复】提前 return 时重置移动标志
    return;
  }

  ds.pos = [row, col];
  ds.stepsSinceRest++;

  // 自动回血检测
  _checkAutoRest();

  // 根据页面模式调用正确的渲染函数
  const isStandalone = !!document.getElementById('dungeonContainer');
  if(isStandalone){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }

  // 进入房间后自动处理
  _onEnterRoom(row, col, isStandalone);
  
  // 重置移动标志（延迟一点，防止快速点击）
  setTimeout(() => { _isMoving = false; }, 300);
}

function _onEnterRoom(row, col, isStandalone){
  const ds = _dungeonState;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared) return;

  // 【修复】根据页面模式选择正确的渲染函数
  const renderFn = isStandalone ? _renderDungeonUIStandalone : _renderDungeonUI;

  // 自动触发房间事件（无需点击按钮）
  if(cell.type === 'battle' || cell.type === 'elite' || cell.type === 'boss'){
    // 战斗房：自动进入战斗
    _dgLog(`⚔️ 遭遇敌人！${cell.desc}`);
    setTimeout(() => dungeonStartBattle(), 500);
  } else if(cell.type === 'chest'){
    // 宝箱房：不自动开箱，让玩家手动点击
    _dgLog(`📦 发现宝箱！${cell.desc}`);
    // 显示开箱按钮，等待玩家操作
    renderFn();
  } else if(cell.type === 'trap'){
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"陷阱房系统
    // ═══════════════════════════════════════════════════════════════
    _dgLog(`⚠️ 触发陷阱！${cell.desc}`);
    setTimeout(() => dungeonTriggerTrap(cell.trapType), 500);
  } else if(cell.type === 'hidden'){
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"隐藏房间系统
    // ═══════════════════════════════════════════════════════════════
    _dgLog(`🧱 发现可疑的墙壁！${cell.desc}`);
    // 显示探索按钮
    renderFn();
  } else if(cell.type === 'rest'){
    // 休息房：自动休息
    _dgLog(`🔥 发现休息点！${cell.desc}`);
    setTimeout(() => dungeonRest(), 500);
  } else if(cell.type === 'event'){
    // 事件房：自动触发事件
    _dgLog(`❓ 发现异常！${cell.desc}`);
    setTimeout(() => dungeonTriggerEvent(), 500);
  } else if(cell.type === 'empty'){
    // 空房间：直接标记为已清理
    cell.cleared = true;
    ds.clearedRooms++;
    _dgLog(`· 安全通过`);
    renderFn();
  }
  
  // ═══════════════════════════════════════════════════════════════
  //  地下城"将将胡"恶搞事件（5%概率在进入房间时触发）
  // ═══════════════════════════════════════════════════════════════
  const gagRoll = Math.random();
  if (gagRoll < 0.05 && cell.type !== 'boss') {
    const gagEvents = [
      { id: 'slippery_floor', name: '地板湿滑', icon: '😰' },
      { id: 'bat_attack', name: '蝙蝠袭击', icon: '🦇' },
      { id: 'weird_noise', name: '奇怪声音', icon: '👂' },
      { id: 'falling_rock', name: '落石', icon: '🪨' },
      { id: 'ghost_light', name: '鬼火', icon: '👻' },
      { id: 'treasure_hint', name: '藏宝图', icon: '🗺️' }
    ];
    const gagEvent = gagEvents[Math.floor(Math.random() * gagEvents.length)];
    
    setTimeout(() => {
      _dungeonTriggerGagEvent(gagEvent);
    }, 800);
  }
}

// ─────────────────────────────────────────────────────
//  自动小量回血（每N个房间）
// ─────────────────────────────────────────────────────
function _checkAutoRest(){
  const ds = _dungeonState;
  if(!ds) return;
  const interval = ds.dungeon.restInterval || 3;
  if(ds.stepsSinceRest >= interval){
    ds.stepsSinceRest = 0;
    const healPct = ds.dungeon.restHealPct || 0.08;
    _dungeonHealPlayer(healPct, '自动回血');
  }
}

function _dungeonHealPlayer(pct, reason){
  if(typeof edS === 'undefined') return 0;
  const maxHp = edS.maxHp || 100;
  const healAmt = Math.round(maxHp * pct);
  edS.hp = Math.min(maxHp, (edS.hp || maxHp) + healAmt);
  if(typeof saveProgress === 'function') saveProgress();
  _dgLog(`💚 ${reason}，恢复 ${healAmt} 点气血`);
  return healAmt;
}

// ─────────────────────────────────────────────────────
//  战斗接入
// ─────────────────────────────────────────────────────
function dungeonStartBattle(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell) return;

  const enemyId = cell.enemyId;
  const enemyDb = (typeof ENEMY_DB !== 'undefined' && ENEMY_DB) || (typeof window !== 'undefined' && window.ENEMY_DB) || {};
  const storyEnemyDb = (typeof STORY_ENEMY_DB !== 'undefined' && STORY_ENEMY_DB) || {};
  const enemy = enemyId ? (enemyDb[enemyId] || storyEnemyDb[enemyId]) : null;

  if(!enemy){
    showToast('敌人数据缺失');
    return;
  }

  // 获取玩家角色（cp_self 或当前选中角色）
  const playerChar = _getDungeonPlayerChar();
  if(!playerChar){ showToast('请先创建或选择角色'); return; }

  // 同步玩家当前血量（从 edS 读取实际血量）
  if(typeof edS !== 'undefined'){
    // ★ 修复（2026-05-04）：直接用 edS.maxHp，不用 edStats()
    playerChar.maxHp = edS.maxHp || playerChar.maxHp || 100;
    // 当前血量：优先 travelPlayerState 百分比 → edS.hp → 满血
    if (typeof travelPlayerState !== 'undefined' && typeof travelPlayerState.hp === 'number') {
      playerChar._currentHp = Math.max(1, Math.round(playerChar.maxHp * travelPlayerState.hp / 100));
    } else if (typeof edS.hp === 'number') {
      playerChar._currentHp = Math.min(edS.hp, playerChar.maxHp);
    } else {
      playerChar._currentHp = playerChar.maxHp || 100;
    }
    playerChar.maxMp = edS.maxMp || playerChar.maxMp || 100;
    playerChar._currentMp = (typeof edS.mp === 'number' && edS.mp <= 99999) ? Math.min(edS.mp, playerChar.maxMp) : (playerChar.maxMp || 100);
  }

  // 缩放敌人等级（用 edS.level 而非 playerChar.level，因为 cp_self 没有 level 字段）
  // 地下城模式：所有怪物等级都动态调整（包括elite/boss）
  const playerLevelForScale = (typeof edS !== 'undefined' ? edS.level : null) || 1;

  // ═══════════════════════════════════════════════════════════════════
  //  动态等级上限：敌人原始等级不能远超玩家等级
  //  用 cell.type（格子类型）判断怪物档位，而非 enemy.tier（数据里没有'boss'）
  // ═══════════════════════════════════════════════════════════════════
  const cellType = cell.type || 'battle';
  const MAX_DUNGEON_GAP = {
    boss:   3,  // BOSS房：最多比玩家高3级（BOSS房必须保持一定威胁）
    elite:  3,  // 精英房：最多比玩家高3级
    battle: 2,  // 普通战斗房：最多比玩家高2级
    trap:   2,  // 陷阱房（如有怪物）
  };
  const maxGap = MAX_DUNGEON_GAP[cellType] || MAX_DUNGEON_GAP.battle;
  const maxAllowedLevel = playerLevelForScale + maxGap;
  // 下限：至少比玩家高1级（避免1级玩家打0级怪）
  const minAllowedLevel = Math.max(1, playerLevelForScale - 1);

  // 克隆敌人数据，修改其 level 用于 scaleEnemy 重新计算
  const enemyForScale = { ...enemy };
  // 双向钳制：把敌人等级限制在 [minAllowedLevel, maxAllowedLevel] 范围内
  const origLevel = enemy.level || 1;
  if (origLevel > maxAllowedLevel || origLevel < minAllowedLevel) {
    enemyForScale.level = Math.max(minAllowedLevel, Math.min(maxAllowedLevel, origLevel));
    if (origLevel > maxAllowedLevel) {
      console.log(`[动态等级] 地下城敌人等级超标：${enemy.name} Lv${origLevel} → 钳制为 Lv${enemyForScale.level}（玩家Lv${playerLevelForScale}）`);
    }
  }

  // 标记已钳制，scaleEnemy 内部将跳过 displayLevel 随机化
  enemyForScale._dungeonClamped = true;

  const scaledEnemy = (typeof scaleEnemy === 'function')
    ? scaleEnemy(enemyForScale, playerLevelForScale, true)
    : enemyForScale;

  // 兜底钳制：scaleEnemy 如果仍生成了越界等级，强制修正
  if (scaledEnemy.level > maxAllowedLevel) {
    scaledEnemy.level = maxAllowedLevel;
  }
  if (scaledEnemy.level < minAllowedLevel) {
    scaledEnemy.level = minAllowedLevel;
  }

  // 世界事件难度加成（叠加到缩放后属性）
  const dungeonId = ds.dungeonId;
  if (typeof weGetDungeonMod === 'function' && dungeonId) {
    const tierBonus = weGetDungeonMod(dungeonId, scaledEnemy.level || 1);
    if (tierBonus > 0) {
      const weMod = 1 + tierBonus * 0.08; // 每级+8%
      scaledEnemy.hp     = Math.round(scaledEnemy.hp     * weMod);
      scaledEnemy.atk   = Math.round(scaledEnemy.atk    * weMod);
      scaledEnemy.def   = Math.round((scaledEnemy.def||0) * weMod);
      scaledEnemy._weBonus = tierBonus;
    }
  }

  // 构建战斗敌人对象（兼容battle.js格式）
  const enemyChar = _buildEnemyChar(scaledEnemy);

  // 记录地下城战斗上下文，战斗结束后回调
  _pendingDungeonBattleCell = { row, col, enemy: scaledEnemy };

  // 调用 startWildBattle（在本文件末尾实现）
  startWildBattle(playerChar, enemyChar, _onDungeonBattleEnd);
}

// 战斗结束回调
function _onDungeonBattleEnd(playerWon){
  const ds = _dungeonState;
  if(!ds) return;

  if(!playerWon){
    // 【方案A】扣一条命，而非直接清零
    ds.lives = (ds.lives || 1) - 1;

    if(ds.lives <= 0){
      // 命数耗尽，真正失败
      showToast('💀 气力耗尽，探索失败……地下城进度已重置。');
      dungeonClearSave();
      _dungeonState = null;
      setTimeout(() => _returnFromDungeon(), 2500);
      return;
    }

    // 还有命：从最近休息点复活，回复50%血+30%内力
    const [revR, revC] = ds.lastRestPos || ds.dungeon.startPos || [0,0];
    ds.pos = [revR, revC];
    if(typeof edS !== 'undefined'){
      const maxHp = edS.maxHp || 100;
      const maxMp = edS.maxMp || 100;
      edS.hp = Math.round(maxHp * 0.50);
      edS.mp = Math.round(maxMp * 0.30);
      if(typeof saveProgress === 'function') saveProgress();
    }
    dungeonSave();
    const livesLeft = ds.lives;
    const livesStr  = '❤️'.repeat(livesLeft) + '🖤'.repeat(3 - livesLeft);
    showToast(`💀 战败了！从最近的安全点复活，剩余生机：${livesStr}`);
    setTimeout(() => _showDungeonPage(), 1800);
    return;
  }

  // 玩家胜利
  const ctx = _pendingDungeonBattleCell;
  if(ctx){
    const { row, col, enemy } = ctx;
    const cell = ds.map[row][col];
    if(cell){
      cell.cleared = true;
      ds.clearedRooms++;
      ds.totalBattles++;
    }
    _pendingDungeonBattleCell = null;

    // 经验已由 checkWin() 统一发放；此处只处理银两
    // 读取 battle.js 实际发放的值（含加成），而非 enemy 原始值
    const expGain = window._lastBattleExpGain || (enemy ? (enemy.exp || 0) : 0);
    const silverGain = window._lastBattleSilverGain || (enemy ? (enemy.silver || 0) : 0);
    if(silverGain > 0){
      if(typeof SilverManager !== 'undefined'){
        SilverManager.add(silverGain); SilverManager.save();
      } else if(typeof addSilver === 'function'){
        addSilver(silverGain);
      } else if(typeof travelPlayerState !== 'undefined'){
        travelPlayerState.silver = (travelPlayerState.silver || 0) + silverGain;
      }
    }
    // 用完清除，防止下一战读到旧值
    window._lastBattleExpGain = null;
    window._lastBattleSilverGain = null;

    // ── 动态任务进度更新 ──
    if (typeof updateQuestProgressOnKill === 'function') {
      updateQuestProgressOnKill(enemy.name, enemy.tier);
    }

    // 战胜后自动恢复5%血 + 3%内力
    if(typeof edS !== 'undefined'){
      const maxHp = edS.maxHp || 100;
      const maxMp = edS.maxMp || 100;
      const autoHeal  = Math.round(maxHp * 0.05);
      const autoMpHeal= Math.round(maxMp * 0.03);
      edS.hp = Math.min(maxHp, (edS.hp || maxHp) + autoHeal);
      edS.mp = Math.min(maxMp, (edS.mp || maxMp) + autoMpHeal);
      if(typeof saveProgress === 'function') saveProgress();
    }

    // 检查是否BOSS
    if(cell && cell.type === 'boss'){
      _onDungeonBossKilled(row, col);
    } else {
      showToast(`✅ 战胜！获得 ${expGain} 经验，${silverGain} 两银子`);
      dungeonSave();
      if(typeof achOnRoomClear === 'function') achOnRoomClear();
      setTimeout(() => _showDungeonPage(), 500);
    }
  } else {
    setTimeout(() => _showDungeonPage(), 500);
  }
}

let _pendingDungeonBattleCell = null;

// BOSS击杀处理
function _onDungeonBossKilled(row, col){
  const ds = _dungeonState;
  ds.isCompleted = true;
  dungeonClearSave();

  // ── 成就系统触发 ──
  // 【修复】noDeathLives 应在进入时记录，而非 BOSS 击杀时再取（此时 lives 已可能被扣减）
  // 由于进入时未单独保存初始命数，此处用 isCompleted 标记 + lives>0 近似判断无伤通关
  const noDamageClear = _dungeonState.lives >= (_dungeonState._initialLives || 3);
  if(typeof achOnDungeonClear === 'function'){
    // 传入 lives > 0 表示至少存活（非完美无伤，但已通关）
    achOnDungeonClear(_dungeonState.lives > 0);
  }

  const reward = ds.dungeon.bossReward || {};
  let rewardLines = ['🏆 地下城通关！'];

  // 经验（已在外层发放 enemy.exp，这里是额外奖励）
  if(reward.exp){
    if(typeof gainExp === 'function') gainExp(reward.exp);
    rewardLines.push(`✨ 额外奖励：${reward.exp} 经验`);
  }
  if(reward.silver){
    if(typeof SilverManager !== 'undefined'){
      SilverManager.add(reward.silver);
      SilverManager.save();
    } else if(typeof addSilver === 'function') {
      addSilver(reward.silver);
    }
    rewardLines.push(`💰 银两：${reward.silver} 两`);
  }
  if(reward.items && reward.items.length){
    reward.items.forEach(item => {
      // chance 字段：未定义默认 100%；roll 成功才发放
      if(item.chance == null || Math.random() < item.chance){
        _dungeonAddItem(item.id, item.qty);
        // 显示中文名而非 raw ID
        const meta = (typeof ENEMY_DROP_ITEMS !== 'undefined') ? ENEMY_DROP_ITEMS[item.id] : null;
        const name = (meta && meta.name) ? meta.name : item.id;
        const icon  = (meta && meta.icon)  ? meta.icon  : '📦';
        rewardLines.push(`${icon} ${name} ×${item.qty}`);
      }
    });
  }

  // 秘籍掉落
  if(reward.manualChance && Math.random() < reward.manualChance){
    if(typeof onBattleWinCheckManual === 'function'){
      onBattleWinCheckManual({ _stats:{ level: ds.dungeon.minLevel }, _npcTier:'elite' });
    }
    rewardLines.push('📜 获得武学秘籍！');
  }

  // 主线道具
  if(reward.specialReward){
    _dungeonAddItem(reward.specialReward, 1);
    rewardLines.push(`🔑 获得关键道具！`);
  }

  // 解锁新地下城
  if(reward.unlocks && reward.unlocks.length){
    // 将解锁信息存入存档
    let unlocked; try{ unlocked=JSON.parse(localStorage.getItem('wuxia_dungeon_unlocked') || '[]'); }catch(e){ unlocked=[]; }
    reward.unlocks.forEach(id => { if(!unlocked.includes(id)) unlocked.push(id); });
    localStorage.setItem('wuxia_dungeon_unlocked', JSON.stringify(unlocked));
    rewardLines.push(`🗝️ 解锁了新地下城！`);
  }

  if(typeof saveProgress === 'function') saveProgress();

  // ── 境界真气：BOSS击杀额外奖励 ─────────────────────
  if(typeof addRealmQi === 'function'){
    const qiGain = Math.round(15 + (ds.dungeon?.level || 1) * 2);
    addRealmQi(qiGain, 'boss');
    rewardLines.push(`💠 真气 +${qiGain}`);
  }

  // 城市争夺系统
  if(typeof ccOnDungeonComplete === 'function'){
    const currentCity = (typeof travelPlayerState !== 'undefined' && travelPlayerState.currentCity)
      ? travelPlayerState.currentCity
      : (typeof _cityId !== 'undefined' ? _cityId : '');
    const dgnId = ds.dungeon?.id || ds.dungeonId || '';
    ccOnDungeonComplete(dgnId, currentCity);
  }

  // ── 门派秘境通关处理 ──
  if(ds.dungeon && ds.dungeon._isSectRealm && typeof onRealmCleared === 'function'){
    onRealmCleared();
    const realmDrops = ds.dungeon._realmDrops || {};
    const realmDiff = ds.dungeon._realmDiff || 'normal';
    const contrib = (realmDrops.contrib && realmDrops.contrib[realmDiff]) || 0;
    if(contrib > 0) rewardLines.push('🏛 门派贡献 +' + contrib);
    const fameMap = { normal:20, hard:50, nightmare:100 };
    rewardLines.push('⭐ 江湖声望 +' + (fameMap[realmDiff] || 20));
  }

  // ── 主线推进：将通关地下城名存入 sessionStorage，回到 town.html 时触发 SGDungeon ──
  {
    const dgnName = ds.dungeon?.name || ds.dungeonId || '';
    if(dgnName) sessionStorage.setItem('wuxia_story_dungeon_cleared', dgnName);
  }

  // 在地下城地图上显示出口
  ds.map[row][col].type = 'exit';

  // 弹出通关弹窗
  _showDungeonClearModal(rewardLines.join('\n'));
}

// 通关弹窗
function _showDungeonClearModal(rewardText){
  const modal = document.createElement('div');
  modal.className = 'dg-clear-modal';
  modal.innerHTML = `
<div class="dg-clear-box">
  <div class="dg-clear-title">🏆 地下城通关！</div>
  <div class="dg-clear-dungeon">${_dungeonState.dungeon.name}</div>
  <pre class="dg-clear-rewards">${rewardText}</pre>
  <div id="dungeonClearCountdown" style="margin:12px 0;color:#ffd700;font-size:14px;">3秒后自动返回城镇...</div>
</div>`;
  document.body.appendChild(modal);

  // 自动倒计时返回城镇
  let countdown = 3;
  const countdownEl = document.getElementById('dungeonClearCountdown');
  window._dungeonClearTimer = setInterval(() => {
    countdown--;
    if (countdownEl) {
      countdownEl.textContent = `${countdown}秒后自动返回城镇...`;
    }
    if (countdown <= 0) {
      clearInterval(window._dungeonClearTimer);
      window._dungeonClearTimer = null;
      modal.remove();
      dungeonExit(); // 返回城镇并重置地下城
    }
  }, 1000);
}

// ─────────────────────────────────────────────────────
//  宝箱
// ─────────────────────────────────────────────────────
function dungeonOpenChest(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared){ showToast('宝箱已开'); return; }
  
  // 播放开箱音效
  if (typeof playAudio === 'function') playAudio('chest_open');

  // ═══════════════════════════════════════════════════════════════
  //  地下城"将将胡"系统 - 宝箱房
  // ═══════════════════════════════════════════════════════════════
  const luckRoll = Math.random();
  let specialEvent = null;
  let adjustedTier = cell.lootTier || 'common';
  
  // 3%概率：隐藏宝藏（宝箱品质+1级）
  if(luckRoll < 0.03){
    specialEvent = 'hidden_treasure';
    const upgradeMap = { common:'uncommon', uncommon:'rare', rare:'epic', epic:'legendary', legendary:'legendary' };
    adjustedTier = upgradeMap[adjustedTier] || adjustedTier;
    _dgLog('✨ 你发现了宝箱中的隐藏夹层！');
  }
  // 2%概率：宝箱陷阱（宝箱怪！）
  else if(luckRoll < 0.05){
    specialEvent = 'mimic';
    _dgLog('⚠️ 不好！宝箱突然张开血盆大口！');
    _dungeonTriggerMimicBattle();
    return;
  }
  // 1%概率：神秘商人（宝箱中藏着神秘卷轴，召唤商人）
  else if(luckRoll < 0.06){
    specialEvent = 'mystery_merchant';
    _dgLog('📜 宝箱中藏着一张神秘的召唤卷轴！');
    _dungeonSummonMerchant();
    return;
  }

  const tier = adjustedTier;
  const loot = dungeonRollChestLoot(tier);

  // 获取奖励信息
  let rewardInfo = { id: loot.id, qty: loot.qty, name: '', meta: null };
  if(loot.id === 'silver'){
    rewardInfo.name = `${loot.qty} 两银子`;
    rewardInfo.meta = { icon: '💰', name: '银子' };
  } else {
    // 查找物品信息（优先用地下城专用物品数据库）
    let meta = (typeof DUNGEON_ITEM_DB !== 'undefined') ? DUNGEON_ITEM_DB[loot.id] : null;
    // 如果没找到，尝试从 ENEMY_DROP_ITEMS 查找
    if(!meta){
      meta = (typeof ENEMY_DROP_ITEMS !== 'undefined') ? ENEMY_DROP_ITEMS[loot.id] : null;
    }
    // 如果没找到，尝试从 COLLECTIBLE_DB 查找收藏品
    if(!meta && typeof COLLECTIBLE_DB !== 'undefined'){
      meta = COLLECTIBLE_DB[loot.id];
    }
    // 如果没找到，尝试从 CRAFT_ITEMS 查找材料
    if(!meta && typeof CRAFT_ITEMS !== 'undefined'){
      const craftItem = CRAFT_ITEMS[loot.id];
      if(craftItem){
        meta = { name: craftItem.name, icon: craftItem.icon || '📦', desc: craftItem.desc };
      }
    }
    // 如果没找到，尝试从 CONSUMABLE_ITEMS 查找消耗品
    if(!meta && typeof CONSUMABLE_ITEMS !== 'undefined'){
      const consumable = CONSUMABLE_ITEMS[loot.id];
      if(consumable){
        meta = { name: consumable.name, icon: consumable.icon || '💊', desc: consumable.desc };
      }
    }
    if(meta){
      rewardInfo.name = `${meta.name} ×${loot.qty}`;
      rewardInfo.meta = meta;
    } else {
      rewardInfo.name = `${loot.id} ×${loot.qty}`;
      // 为未知物品设置默认图标
      rewardInfo.meta = { icon: '📦', name: loot.id };
    }
  }

  // 播放开箱动画（独立页面模式）
  if(typeof playChestAnimation === 'function'){
    playChestAnimation(rewardInfo);

    // 延迟执行实际奖励和清理（等动画播放完）
    setTimeout(() => {
      _dungeonAddItem(loot.id, loot.qty);
      cell.cleared = true;
      ds.clearedRooms++;
      dungeonSave();
      _dgLog(`📦 打开宝箱，获得了 ${rewardInfo.name}！`);
    }, 2000);

    // 延迟刷新UI（等动画关闭后）
    setTimeout(() => {
      _renderDungeonUIStandalone();
    }, 2200);
  } else {
    // 无动画支持：直接开箱
    _dungeonAddItem(loot.id, loot.qty);
    cell.cleared = true;
    ds.clearedRooms++;
    dungeonSave();
    showToast(`📦 开箱获得：${rewardInfo.name}`);
    _dgLog(`📦 打开宝箱，获得了 ${rewardInfo.name}！`);
    _renderDungeonUIStandalone();
  }
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"陷阱系统：多种陷阱类型
// ═══════════════════════════════════════════════════════════════
const TRAP_TYPES = {
  spike:   { name: '地刺陷阱', icon: '🔺', dmgMult: [0.10, 0.20], effect: 'bleed', msg: '锋利的地刺从地面弹出！' },
  poison:  { name: '毒雾陷阱', icon: '☠️', dmgMult: [0.05, 0.12], effect: 'poison', msg: '绿色毒雾从四面八方涌出！' },
  fall:    { name: '落穴陷阱', icon: '🕳️', dmgMult: [0.15, 0.25], effect: 'stun', msg: '地板突然塌陷，你跌入深坑！' },
  arrow:   { name: '暗箭陷阱', icon: '🏹', dmgMult: [0.08, 0.18], effect: 'none', msg: '墙壁中射出数支暗箭！' },
};

function dungeonTriggerTrap(trapType){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared) return;
  
  // 获取陷阱类型
  const type = trapType || cell.trapType || 'spike';
  const trapInfo = TRAP_TYPES[type] || TRAP_TYPES.spike;
  
  // 计算伤害（有波动）
  const [minDmg, maxDmg] = trapInfo.dmgMult;
  const dmgMult = minDmg + Math.random() * (maxDmg - minDmg);
  const dmg = Math.round((edS.maxHp || 100) * dmgMult);
  
  if(typeof edS !== 'undefined'){
    edS.hp = Math.max(1, (edS.hp || edS.maxHp) - dmg);
    
    // 附加效果
    if(trapInfo.effect === 'poison'){
      edS._poisoned = { turns: 3, dmgPerTurn: Math.round(dmg * 0.1) };
      showToast(`☠️ 中毒了！接下来3回合每回合损失${edS._poisoned.dmgPerTurn}气血`, 'warning');
    } else if(trapInfo.effect === 'stun'){
      edS._stunned = true;
      showToast(`😵 摔晕了！下回合无法行动`, 'warning');
    }
    
    if(typeof saveProgress === 'function') saveProgress();
  }
  
  cell.cleared = true;
  ds.clearedRooms++;
  dungeonSave();
  
  showToast(`${trapInfo.icon} ${trapInfo.msg} 受到 ${dmg} 点伤害！`, 'warning');
  _dgLog(`${trapInfo.icon} 触发${trapInfo.name}！气血 -${dmg}`);
  
  // 根据页面模式调用正确的渲染函数
  const isStandaloneTrap = !!document.getElementById('dungeonContainer');
  if(isStandaloneTrap){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

function dungeonDodgeTrap(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared) return;

  // 绕开消耗体力，有成功率
  const playerSpd = (typeof edS !== 'undefined') ? (edS.spd || 8) : 8;
  const chance = Math.min(0.85, 0.45 + playerSpd * 0.015);
  if(Math.random() < chance){
    const energyCost = 15;
    if(typeof edS !== 'undefined' && edS.energy !== undefined){
      edS.energy = Math.max(0, edS.energy - energyCost);
      if(typeof saveProgress === 'function') saveProgress();
    }
    cell.cleared = true;
    ds.clearedRooms++;
    dungeonSave();
    showToast(`✅ 成功绕开陷阱！消耗精力 ${energyCost}`);
    _dgLog(`✅ 身法灵动，绕过了陷阱！精力 -${energyCost}`);
  } else {
    // 绕开失败还是触发了
    const dmg = Math.round((edS.maxHp || 100) * 0.05);
    if(typeof edS !== 'undefined'){
      edS.hp = Math.max(1, (edS.hp || edS.maxHp) - dmg);
      if(typeof saveProgress === 'function') saveProgress();
    }
    showToast(`😓 绕行失败，仍触发了陷阱！受到 ${dmg} 伤害。`);
    _dgLog(`😓 绕行失败，气血 -${dmg}`);
    cell.cleared = true;
    ds.clearedRooms++;
    dungeonSave();
  }
  // 根据页面模式调用正确的渲染函数
  const isStandaloneDodge = !!document.getElementById('dungeonContainer');
  if(isStandaloneDodge){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

// ═══════════════════════════════════════════════════════════════
//  地下城"将将胡"恶搞事件处理
// ═══════════════════════════════════════════════════════════════
function _dungeonTriggerGagEvent(gagEvent) {
  const ds = _dungeonState;
  if (!ds) return;
  
  const gagEffects = {
    slippery_floor: () => {
      _dgLog('😰 地板湿滑，你滑了一跤！');
      showToast('😰 地板湿滑，你滑了一跤！但发现地上有东西...', 'warning');
      // 损失一点气血，但可能发现小奖励
      if (typeof edS !== 'undefined') {
        const dmg = Math.max(1, Math.floor((edS.maxHp || 100) * 0.03));
        edS.hp = Math.max(1, (edS.hp || edS.maxHp) - dmg);
      }
      // 30%概率发现小奖励
      if (Math.random() < 0.3) {
        const silver = 10 + Math.floor(Math.random() * 20);
        if (typeof SilverManager !== 'undefined') {
          SilverManager.add(silver);
          SilverManager.save();
        }
        setTimeout(() => showToast(`💰 在地上发现了 ${silver} 两银子！`, 'rare'), 500);
      }
    },
    bat_attack: () => {
      _dgLog('🦇 一群蝙蝠飞过！');
      showToast('🦇 一群蝙蝠飞过，你慌乱中挥舞武器...', 'warning');
      // 无实际伤害，纯剧情
    },
    weird_noise: () => {
      _dgLog('👂 墙壁里传出奇怪的声音...');
      showToast('👂 你听到墙壁里有奇怪的声音，像是有人在笑？', 'rare');
      // 纯剧情，增加氛围
    },
    falling_rock: () => {
      _dgLog('🪨 小心落石！');
      showToast('🪨 一块石头从头顶落下！你及时躲开了。', 'warning');
      // 无伤害，纯剧情
    },
    ghost_light: () => {
      _dgLog('👻 一团鬼火飘过...');
      showToast('👻 一团幽蓝的鬼火飘过，你感觉背后发凉。', 'rare');
      // 纯剧情，增加恐怖氛围
    },
    treasure_hint: () => {
      _dgLog('🗺️ 墙上刻着奇怪的符号...');
      showToast('🗺️ 你发现墙上刻着像是藏宝图的符号！', 'rare');
      // 给一点小奖励
      const silver = 20 + Math.floor(Math.random() * 30);
      if (typeof SilverManager !== 'undefined') {
        SilverManager.add(silver);
        SilverManager.save();
      }
      setTimeout(() => showToast(`💰 按图索骥，你找到了 ${silver} 两银子！`, 'rare'), 500);
    }
  };
  
  const effect = gagEffects[gagEvent.id];
  if (effect) effect();
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"隐藏房间探索系统
// ═══════════════════════════════════════════════════════════════
function dungeonExploreHidden(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared || cell.type !== 'hidden') return;
  
  // 探索成功率（基于悟性）
  const playerInt = (typeof edS !== 'undefined') ? ((edS.originPts?.int || 0) + (edS.primaryPts?.int || 0)) : 10;
  const baseChance = 0.40;
  const successChance = Math.min(0.90, baseChance + playerInt * 0.02);
  
  if(Math.random() < successChance){
    // ═══════════════════════════════════════════════════════════════
    //  地下城"将将胡"系统 - 隐藏房间
    // ═══════════════════════════════════════════════════════════════
    const luckRoll = Math.random();
    let specialEvent = null;
    
    // 2%概率：密室（额外获得一件稀有物品）
    if(luckRoll < 0.02){
      specialEvent = 'secret_room';
    }
    // 1%概率：前人遗骸（获得装备+武学笔记）
    else if(luckRoll < 0.03){
      specialEvent = 'remains';
    }
    // 1%概率：机关暗道（直接通往下一层/出口）
    else if(luckRoll < 0.04){
      specialEvent = 'secret_passage';
    }
    
    // 成功发现隐藏宝藏
    const rewards = [
      { type: 'silver', min: 50, max: 150, icon: '💰', msg: '发现了一袋银两！' },
      { type: 'exp', min: 30, max: 80, icon: '✨', msg: '领悟了武学心得！' },
      { type: 'item', pool: ['item_herb_gancao', 'item_iron_ore', 'item_rare_jade'], icon: '📦', msg: '找到了珍稀材料！' },
      { type: 'manual', icon: '📜', msg: '发现了一本秘籍！' },
    ];
    
    // 特殊事件调整奖励池
    if(specialEvent === 'remains'){
      rewards.push({ type: 'equip', tier: 'rare', icon: '⚔️', msg: '发现了前人遗留的装备！' });
      rewards.push({ type: 'exp', min: 100, max: 200, icon: '📖', msg: '从武学笔记中领悟了许多！' });
    }
    
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    switch(reward.type){
      case 'silver':
        const silver = reward.min + Math.floor(Math.random() * (reward.max - reward.min));
        if(typeof SilverManager !== 'undefined'){
          SilverManager.add(silver);
          SilverManager.save();
        }
        showToast(`${reward.icon} ${reward.msg} +${silver}两`, 'rare');
        _dgLog(`${reward.icon} 探索成功！获得 ${silver} 两银子`);
        break;
      case 'exp':
        const exp = reward.min + Math.floor(Math.random() * (reward.max - reward.min));
        if(typeof giveExp === 'function') giveExp(exp);
        showToast(`${reward.icon} ${reward.msg} +${exp}经验`, 'exp');
        _dgLog(`${reward.icon} 探索成功！获得 ${exp} 经验`);
        break;
      case 'item':
        const itemId = reward.pool[Math.floor(Math.random() * reward.pool.length)];
        if(typeof craftBagAdd === 'function') craftBagAdd(itemId, 1);
        showToast(`${reward.icon} ${reward.msg}`, 'rare');
        _dgLog(`${reward.icon} 探索成功！获得 ${itemId}`);
        break;
      case 'manual':
        if(typeof MANUAL_DB !== 'undefined'){
          const manuals = Object.keys(MANUAL_DB).filter(m => !MANUAL_DB[m].reqSect);
          const manual = manuals[Math.floor(Math.random() * manuals.length)];
          if(typeof addManualToPlayer === 'function') addManualToPlayer(manual);
          showToast(`${reward.icon} ${reward.msg}`, 'rare');
          _dgLog(`${reward.icon} 探索成功！获得秘籍 ${manual}`);
        }
        break;
      case 'equip':
        // 前人遗骸获得装备
        const qualities = ['common', 'uncommon', 'rare'];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        showToast(`${reward.icon} ${reward.msg}（${quality}）`, 'legendary');
        _dgLog(`${reward.icon} 探索成功！获得前人遗留的${quality}装备`);
        break;
    }
    
    // 特殊事件额外处理
    if(specialEvent === 'secret_room'){
      showToast('💎 发现密室！额外获得一件稀有物品！', 'legendary');
      _dgLog('💎 发现密室！额外获得一件稀有物品');
      _dungeonAddItem('item_rare_jade', 1);
    }
    else if(specialEvent === 'remains'){
      showToast('⚰️ 发现前人遗骸，获得装备和武学心得！', 'legendary');
      _dgLog('⚰️ 发现前人遗骸，获得装备和武学心得');
    }
    else if(specialEvent === 'secret_passage'){
      showToast('🚪 发现机关暗道！可以直接离开地下城！', 'legendary');
      _dgLog('🚪 发现机关暗道！可以直接离开地下城');
      // 提供离开选项
      setTimeout(() => {
        if(confirm('发现机关暗道！是否直接离开地下城？')){
          dungeonExit();
        }
      }, 500);
    }
  } else {
    // 探索失败，墙壁倒塌造成轻微伤害
    const dmg = Math.round((edS.maxHp || 100) * 0.05);
    if(typeof edS !== 'undefined'){
      edS.hp = Math.max(1, (edS.hp || edS.maxHp) - dmg);
      if(typeof saveProgress === 'function') saveProgress();
    }
    showToast(`😓 探索失败，墙壁倒塌！受到 ${dmg} 伤害`, 'warning');
    _dgLog(`😓 探索失败，气血 -${dmg}`);
  }
  
  cell.cleared = true;
  ds.clearedRooms++;
  dungeonSave();
  
  // 根据页面模式调用正确的渲染函数
  const isStandaloneHidden = !!document.getElementById('dungeonContainer');
  if(isStandaloneHidden){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

function dungeonIgnoreHidden(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared) return;
  
  cell.cleared = true;
  ds.clearedRooms++;
  dungeonSave();
  
  showToast('🚶 你决定不冒险，离开了这片可疑的区域');
  _dgLog('🚶 放弃了探索可疑的墙壁');
  
  // 根据页面模式调用正确的渲染函数
  const isStandaloneIgnore = !!document.getElementById('dungeonContainer');
  if(isStandaloneIgnore){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

// ─────────────────────────────────────────────────────
//  休息点
// ─────────────────────────────────────────────────────
function dungeonRest(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared){ showToast('已经休整过了'); return; }

  // 【方案A】记录最近休息点（复活用）
  ds.lastRestPos = [row, col];

  // 治疗音效
  if (typeof playAudio === 'function') playAudio('heal');

  // 【方案B】回血从20%→40%，内力从15%→30%
  const healAmt = _dungeonHealPlayer(0.40, '在休息点休整');
  if(typeof edS !== 'undefined'){
    const maxMp = edS.maxMp || 100;
    const mpHeal = Math.round(maxMp * 0.30);
    edS.mp = Math.min(maxMp, (edS.mp || maxMp) + mpHeal);
    _dgLog(`💙 内力恢复 ${mpHeal}`);
    if(typeof saveProgress === 'function') saveProgress();
  }

  // 休息点恢复1次打坐机会（上限3次）
  const maxMeditate = 3;
  if(ds.meditateLeft < maxMeditate){
    ds.meditateLeft = Math.min(maxMeditate, ds.meditateLeft + 1);
    _dgLog(`🧘 休息后打坐次数恢复，当前剩余：${ds.meditateLeft} 次`);
  }

  cell.cleared = true;
  ds.clearedRooms++;
  dungeonSave();
  // 根据页面模式调用正确的渲染函数
  const isStandaloneRest = !!document.getElementById('dungeonContainer');
  if(isStandaloneRest){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

// ─────────────────────────────────────────────────────
//  随机事件
// ─────────────────────────────────────────────────────
function dungeonTriggerEvent(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared) return;

  // 随机选一个事件
  const ev = DUNGEON_EVENTS[Math.floor(Math.random() * DUNGEON_EVENTS.length)];
  _showDungeonEventModal(ev, row, col);
}

function _showDungeonEventModal(ev, row, col){
  const modal = document.createElement('div');
  modal.className = 'dg-event-modal';
  modal.id = 'dgEventModal';

  let choicesHtml = ev.choices.map((c, i) =>
    `<button class="dg-choice-btn" onclick="dungeonEventChoice(${i})">${c.text}</button>`
  ).join('');

  modal.innerHTML = `
<div class="dg-event-box">
  <div class="dg-event-title">${ev.title}</div>
  <div class="dg-event-desc">${ev.desc}</div>
  <div class="dg-event-choices">${choicesHtml}</div>
</div>`;
  modal.dataset.evId = ev.id;
  modal.dataset.row  = row;
  modal.dataset.col  = col;
  document.body.appendChild(modal);
}

function dungeonEventChoice(choiceIdx){
  const modal = document.getElementById('dgEventModal');
  if(!modal) return;
  const evId = modal.dataset.evId;
  const row  = parseInt(modal.dataset.row);
  const col  = parseInt(modal.dataset.col);
  modal.remove();

  const ev = DUNGEON_EVENTS.find(e => e.id === evId);
  if(!ev) return;
  const choice = ev.choices[choiceIdx];
  if(!choice) return;

  // 概率判定
  let success = true;
  if(choice.chance !== undefined){
    success = Math.random() < choice.chance;
  }

  const resultText = success ? choice.result : (choice.failResult || '失败了……');
  const reward = success ? choice.reward : (choice.failReward || {});

  // 处理奖励
  if(reward.exp && typeof gainExp === 'function') gainExp(reward.exp);
  if(reward.silver) addSilver(reward.silver);
  if(reward.item) _dungeonAddItem(reward.item, 1);
  if(reward.lootTier){
    const loot = dungeonRollChestLoot(reward.lootTier);
    _dungeonAddItem(loot.id, loot.qty);
  }
  // 处理代价
  if(choice.cost){
    const cost = choice.cost;
    if(cost.silver){
      if(typeof spendSilver === 'function'){
        spendSilver(cost.silver, 'dungeon_event');
      } else if(typeof SilverManager !== 'undefined'){
        SilverManager.spend(cost.silver);
        SilverManager.save();
      } else if(typeof edS !== 'undefined'){
        edS.silver = Math.max(0, (edS.silver || 0) - cost.silver);
      }
    }
    if(cost.hp && typeof edS !== 'undefined') edS.hp = Math.max(1, (edS.hp||100) - cost.hp);
    if(cost.mp && typeof edS !== 'undefined') edS.mp = Math.max(0, (edS.mp||100) - cost.mp);
    if(cost.energy && typeof edS !== 'undefined') edS.energy = Math.max(0, (edS.energy||100) - cost.energy);
    if(cost.item && typeof edS !== 'undefined'){
      const bag = edS.bag || [];
      const itemId = cost.item;
      const qty = cost.qty || 1;
      const idx = bag.findIndex(b => b && b.id === itemId);
      if(idx >= 0){
        if(bag[idx].qty > qty) bag[idx].qty -= qty;
        else bag.splice(idx, 1);
      }
    }
  }
  if(!success && choice.failCost){
    const fc = choice.failCost;
    if(fc.silver){
      if(typeof spendSilver === 'function'){
        spendSilver(fc.silver, 'dungeon_event_fail');
      } else if(typeof SilverManager !== 'undefined'){
        SilverManager.spend(fc.silver);
        SilverManager.save();
      } else if(typeof edS !== 'undefined'){
        edS.silver = Math.max(0, (edS.silver || 0) - fc.silver);
      }
    }
    if(fc.hp && typeof edS !== 'undefined') edS.hp = Math.max(1, (edS.hp||100) - fc.hp);
    if(fc.mp && typeof edS !== 'undefined') edS.mp = Math.max(0, (edS.mp||100) - fc.mp);
  }

  if(typeof saveProgress === 'function') saveProgress();

  // 标记房间已清理
  const ds = _dungeonState;
  if(ds){
    const cell = ds.map[row][col];
    if(cell){ cell.cleared = true; ds.clearedRooms++; }
    dungeonSave();
  }

  showToast(resultText);
  _dgLog(resultText);
  // 根据页面模式调用正确的渲染函数
  const isStandaloneEvent = !!document.getElementById('dungeonContainer');
  if(isStandaloneEvent){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

function _getDungeonItemMeta(itemId){
  const enemyDropMeta = (typeof ENEMY_DROP_ITEMS !== 'undefined' && ENEMY_DROP_ITEMS)
    ? ENEMY_DROP_ITEMS[itemId]
    : null;
  const collectibleMeta = (typeof COLLECTIBLE_DB !== 'undefined' && COLLECTIBLE_DB)
    ? COLLECTIBLE_DB[itemId]
    : null;
  // 优先用地下城专用物品数据库
  const dungeonMeta = (typeof DUNGEON_ITEM_DB !== 'undefined' && DUNGEON_ITEM_DB)
    ? DUNGEON_ITEM_DB[itemId]
    : null;
  return dungeonMeta || enemyDropMeta || collectibleMeta || null;
}

function _getDungeonItemLabel(itemId, qty){
  const meta = _getDungeonItemMeta(itemId);
  const icon = meta?.icon ? `${meta.icon} ` : '';
  const name = meta?.name || itemId;
  return qty !== undefined ? `${icon}${name} ×${qty}` : `${icon}${name}`;
}

function dungeonCollect(){
  const ds = _dungeonState;
  if(!ds) return;
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(!cell || cell.cleared || cell.type !== 'collect') return;

  const entries = (typeof getDungeonRoomCollectEntries === 'function')
    ? getDungeonRoomCollectEntries(ds.dungeonId)
    : [];
  if(!entries.length){
    showToast('这里没有可采的资源。');
    return;
  }

  const gains = [];
  entries.forEach(entry => {
    if(!entry?.id) return;
    const chance = entry.chance == null ? 1 : entry.chance;
    if(Math.random() > chance) return;
    const minQty = Math.max(1, entry.minQty || 1);
    const maxQty = Math.max(minQty, entry.maxQty || minQty);
    const qty = minQty + Math.floor(Math.random() * (maxQty - minQty + 1));
    gains.push({ id: entry.id, qty });
  });

  if(!gains.length){
    const fallback = entries[Math.floor(Math.random() * entries.length)];
    const qty = Math.max(1, fallback?.minQty || 1);
    gains.push({ id: fallback.id, qty });
  }

  gains.forEach(gain => _dungeonAddItem(gain.id, gain.qty));
  cell.cleared = true;
  ds.clearedRooms++;
  dungeonSave();
  if(typeof saveProgress === 'function') saveProgress();

  // ── 动态任务进度更新 ──
  if (typeof updateCollectProgress === 'function') {
    gains.forEach(gain => {
      const meta = (typeof COLLECTIBLE_DB !== 'undefined') ? COLLECTIBLE_DB[gain.id] : null;
      const itemName = meta?.name || gain.id;
      updateCollectProgress(itemName);
    });
  }

  const rewardText = gains.map(gain => _getDungeonItemLabel(gain.id, gain.qty)).join('、');
  showToast(`⛏️ 采集获得：${rewardText}`);
  _dgLog(`⛏️ 你采集到了 ${rewardText}`);

  const isStandaloneCollect = !!document.getElementById('dungeonContainer');
  if(isStandaloneCollect){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

// ─────────────────────────────────────────────────────
//  打坐回血 / 用药
// ─────────────────────────────────────────────────────

function dungeonMeditate(){
  if(typeof edS === 'undefined') return;
  const ds = _dungeonState;
  if(!ds) return;

  // 次数检查
  if(ds.meditateLeft <= 0){
    showToast('🧘 打坐次数已用尽，在休息点可恢复1次');
    return;
  }

  const maxHp = edS.maxHp || 100;
  const maxMp = edS.maxMp || 100;

  // 【方案B】打坐：回复25%血和35%内力（原15%/20%）
  const hpHeal = Math.round(maxHp * 0.25);
  const mpHeal = Math.round(maxMp * 0.35);
  edS.hp = Math.min(maxHp, (edS.hp||maxHp) + hpHeal);
  edS.mp = Math.min(maxMp, (edS.mp||maxMp) + mpHeal);

  ds.meditateLeft--;
  dungeonSave();
  if(typeof saveProgress === 'function') saveProgress();

  const leftTip = ds.meditateLeft > 0 ? `（剩余${ds.meditateLeft}次）` : `（已用尽，需至休息点补充）`;

  // ── 境界真气：打坐获得真气 ─────────────────────
  if(typeof addRealmQi === 'function'){
    const qiGain = (typeof REALM_QI_SOURCES !== 'undefined')
      ? REALM_QI_SOURCES.specialLocationCultivate()
      : Math.round(20 + Math.random() * 30);
    addRealmQi(qiGain, 'cultivate');
  }

  showToast(`🧘 打坐调息，气血 +${hpHeal}，内力 +${mpHeal} ${leftTip}`);
  _dgLog(`🧘 打坐调息。气血 +${hpHeal}，内力 +${mpHeal}。剩余打坐次数：${ds.meditateLeft}`);
  // 根据页面模式调用正确的渲染函数
  const isStandaloneMeditate = !!document.getElementById('dungeonContainer');
  if(isStandaloneMeditate){
    _renderDungeonUIStandalone();
  } else {
    _renderDungeonUI();
  }
}

// ──────────────────────────────────────────────────────────
//  地下城用药系统（支持全部消耗品背包）
//  消耗品存储在 consumableBag（wuxia_consumables localStorage）
//  凡有 effect.hp / effect.mp / effect.detox 的物品均可在地下城使用
// ──────────────────────────────────────────────────────────

// 从 consumableBag 收集所有恢复类物品（hp/mp/detox）
function _dungeonGetHealItems(){
  const items = [];
  // 读合成/商店消耗品背包
  if(typeof consumableBagLoad === 'function'){
    const cBag = consumableBagLoad();
    cBag.forEach(item => {
      if(!item || !item.effect) return;
      const ef = item.effect;
      if(ef.hp || ef.mp || ef.detox){
        items.push({ ...item, _source:'consumable' });
      }
    });
  }
  // 向后兼容：旧版 edS.bag 里可能有老式药品
  if(typeof edS !== 'undefined'){
    const oldIds = ['item_elixir_low','item_elixir_mid','item_elixir_high',
                    'item_herb_common','item_herb_rare','item_antidote','item_elixir'];
    (edS.bag || []).forEach(item => {
      if(item && oldIds.includes(item.id)){
        // 包装成统一格式
        const hp_pct = { item_elixir_high:0.40, item_elixir_mid:0.25, item_elixir_low:0.15,
                         item_herb_rare:0.20, item_herb_common:0.10, item_antidote:0.10, item_elixir:0.20 };
        const pct = hp_pct[item.id] || 0.15;
        const maxHp = edS.maxHp || 100;
        const hpAmt = Math.round(maxHp * pct);
        items.push({
          id: item.id, qty: item.qty,
          name: item.name || item.id.replace('item_',''),
          icon: item.icon || '🍵',
          desc: item.desc || `恢复气血 ${hpAmt}`,
          effect: { hp: hpAmt },
          _source: 'edsbag'
        });
      }
    });
  }
  return items;
}

function _dungeonHasHealItem(){
  return _dungeonGetHealItems().length > 0;
}

// 实际执行使用一个消耗品（按 source 从对应背包扣除）
function _dungeonApplyConsumable(itemId, source){
  if(typeof edS === 'undefined') return;
  let item = null;

  if(source === 'consumable' && typeof consumableBagLoad === 'function'){
    const cBag = consumableBagLoad();
    item = cBag.find(i => i && i.id === itemId);
    if(!item){ showToast('物品已不存在'); return; }
    if(typeof consumableBagConsume === 'function') consumableBagConsume(itemId, 1);
    else {
      item.qty--;
      if(item.qty <= 0) cBag.splice(cBag.indexOf(item), 1);
      localStorage.setItem('wuxia_consumables', JSON.stringify(cBag));
    }
  } else if(source === 'edsbag'){
    const bag = edS.bag || [];
    const idx = bag.findIndex(b => b && b.id === itemId);
    if(idx < 0){ showToast('物品已不存在'); return; }
    item = bag[idx];
    if(item.qty > 1) item.qty--;
    else bag.splice(idx, 1);
    edS.bag = bag;
  } else { return; }

  // 应用效果
  const ef = item.effect || {};
  const maxHp = edS.maxHp || 100;
  const maxMp = edS.maxMp || edS.mp || 100;
  let logParts = [];

  if(ef.hp){
    const gain = Math.min(ef.hp, maxHp - (edS.hp || 0));
    edS.hp = Math.min(maxHp, (edS.hp || 0) + ef.hp);
    if(gain > 0) logParts.push(`气血 +${gain}`);
  }
  if(ef.mp){
    const gain = Math.min(ef.mp, maxMp - (edS.mp || 0));
    edS.mp = Math.min(maxMp, (edS.mp || 0) + ef.mp);
    if(gain > 0) logParts.push(`内力 +${gain}`);
  }
  if(ef.detox){
    if(edS.poisoned) edS.poisoned = false;
    logParts.push('解毒');
  }

  if(typeof saveProgress === 'function') saveProgress();
  const name = item.name || itemId;
  const icon = item.icon || '💊';
  showToast(`${icon} 服用【${name}】，${logParts.join('、') || '无效果'}`);
  _dgLog(`${icon} 服用【${name}】，${logParts.join('、')}`);

  // 关闭面板，刷新UI
  const panel = document.getElementById('dg-item-panel');
  if(panel) panel.remove();
  const isStandalone = !!document.getElementById('dungeonContainer');
  if(isStandalone) _renderDungeonUIStandalone();
  else _renderDungeonUI();
}

// 弹出药品选择面板
function dungeonUseHealItem(){
  const healItems = _dungeonGetHealItems();
  if(!healItems.length){ showToast('背包中没有可用的药品'); return; }

  // 如果只有一种，直接用最优的（hp最大的）
  if(healItems.length === 1){
    _dungeonApplyConsumable(healItems[0].id, healItems[0]._source);
    return;
  }

  // 多种药：弹出选择面板
  const existing = document.getElementById('dg-item-panel');
  if(existing){ existing.remove(); return; } // 再次点击关闭

  const panel = document.createElement('div');
  panel.id = 'dg-item-panel';
  panel.className = 'dg-item-panel';

  const maxHp = (typeof edS !== 'undefined') ? (edS.maxHp || 100) : 100;
  const maxMp = (typeof edS !== 'undefined') ? (edS.maxMp || 100) : 100;

  let listHtml = '';
  healItems.forEach(item => {
    const ef = item.effect || {};
    let effDesc = [];
    if(ef.hp)  effDesc.push(`<span class="dip-hp">气血+${ef.hp}</span>`);
    if(ef.mp)  effDesc.push(`<span class="dip-mp">内力+${ef.mp}</span>`);
    if(ef.detox) effDesc.push(`<span class="dip-detox">解毒</span>`);
    listHtml += `
<div class="dip-row" onclick="_dungeonApplyConsumable('${item.id}','${item._source}')">
  <span class="dip-icon">${item.icon || '💊'}</span>
  <div class="dip-info">
    <div class="dip-name">${item.name || item.id} <span class="dip-qty">×${item.qty}</span></div>
    <div class="dip-eff">${effDesc.join(' ')}</div>
  </div>
  <button class="dip-use-btn">用</button>
</div>`;
  });

  panel.innerHTML = `
<div class="dip-header">
  <span>🎒 选择药品</span>
  <button class="dip-close" onclick="document.getElementById('dg-item-panel')?.remove()">✕</button>
</div>
<div class="dip-list">${listHtml}</div>`;

  // 挂到地下城容器
  const container = document.getElementById('dungeonContainer') || document.getElementById('dungeonPanel');
  if(container){ container.style.position='relative'; container.appendChild(panel); }
  else document.body.appendChild(panel);
}

// ─────────────────────────────────────────────────────
//  撤退 / 离开
// ─────────────────────────────────────────────────────
function dungeonRetreat(){
  const ds = _dungeonState;
  if(!ds) return;

  const modal = document.createElement('div');
  modal.className = 'dg-event-modal';
  modal.innerHTML = `
<div class="dg-event-box">
  <div class="dg-event-title">⚠️ 撤退确认</div>
  <div class="dg-event-desc">撤退后此次探索进度将<b>全部清零</b>，下次需要从头开始。确定撤退？</div>
  <div class="dg-event-choices">
    <button class="dg-choice-btn" onclick="if(window._dungeonClearTimer){clearInterval(window._dungeonClearTimer);window._dungeonClearTimer=null;} dungeonDoRetreat();this.closest('.dg-event-modal').remove()">确定撤退</button>
    <button class="dg-choice-btn" onclick="this.closest('.dg-event-modal').remove()">继续探索</button>
  </div>
</div>`;
  document.body.appendChild(modal);
}

function dungeonDoRetreat(){
  dungeonClearSave();
  _dungeonState = null;
  showToast('撤退成功。地下城进度已重置。');
  // 返回地图页
  _returnFromDungeon();
}

function dungeonExit(){
  _dungeonState = null;
  // 【修复】离开时清档，避免残留存档导致下次进入异常
  dungeonClearSave();
  _returnFromDungeon();
}

function _returnFromDungeon(){
  // 检查是否是独立页面模式（dungeon.html）
  const isStandalonePage = window.location.pathname.includes('dungeon.html');

  if(isStandalonePage){
    // 独立页面模式：直接跳转回 town.html
    window.location.href = 'town.html';
    return;
  }

  // 内嵌模式：隐藏所有页面，显示地图页
  const allTabs = document.querySelectorAll('.tab');
  allTabs.forEach(t => t.classList.remove('active'));

  // 隐藏所有页面
  const ALL_PAGE_IDS = ['pageGallery','pageFight','pageEditor','pageSkills',
                        'pageSects','pageWeapons','pageMap','pageDungeon'];
  ALL_PAGE_IDS.forEach(pid => {
    const el = document.getElementById(pid);
    if(el) el.style.display = 'none';
  });

  // 返回地图页
  const mapPage = document.getElementById('pageMap');
  const mapTab  = [...allTabs].find(t => t.dataset.page === 'map');
  if(mapPage) mapPage.style.display = 'block';
  if(mapTab)  mapTab.classList.add('active');

  // 刷新地图（如果有此函数）
  if(typeof renderTravelMap === 'function') renderTravelMap();
}

// ─────────────────────────────────────────────────────
//  辅助
// ─────────────────────────────────────────────────────
function _dgLog(text){
  const el = document.getElementById('dgLog');
  if(!el) return;
  const p = document.createElement('div');
  p.className = 'dg-log-line';
  p.textContent = text;
  el.insertBefore(p, el.firstChild);
  // 最多显示10条
  while(el.children.length > 10) el.removeChild(el.lastChild);
}

// ═══════════════════════════════════════════════════════════════
//  地下城"将将胡"系统 - 宝箱怪战斗
// ═══════════════════════════════════════════════════════════════
function _dungeonTriggerMimicBattle(){
  const ds = _dungeonState;
  if(!ds) return;
  
  // 创建宝箱怪敌人
  const mimicEnemy = {
    id: 'enemy_mimic',
    name: '宝箱怪',
    icon: '📦',
    level: (typeof edS !== 'undefined' ? edS.level : 1) + 2,
    hp: 150,
    maxHp: 150,
    atk: 25,
    def: 15,
    spd: 12,
    desc: '伪装成宝箱的怪物，会吞噬贪婪的冒险者！',
    drops: [
      { id: 'silver', qty: 100 },
      { id: 'item_rare_jade', chance: 0.3 },
      { id: 'item_mystery_box', chance: 0.1 }
    ]
  };
  
  showToast('⚠️ 宝箱怪现身！准备战斗！', 'warning');
  
  // 延迟后进入战斗
  setTimeout(() => {
    const playerChar = _getDungeonPlayerChar();
    if(!playerChar){ showToast('请先创建或选择角色'); return; }
    
    // 同步玩家血量
    if(typeof edS !== 'undefined'){
      // ★ 修复（2026-05-04）：直接用 edS.maxHp，不用 edStats()
      playerChar.maxHp = edS.maxHp || playerChar.maxHp || 100;
      playerChar._currentHp = (typeof travelPlayerState !== 'undefined' && typeof travelPlayerState.hp === 'number')
        ? Math.max(1, Math.round(playerChar.maxHp * travelPlayerState.hp / 100))
        : ((typeof edS.hp === 'number') ? Math.min(edS.hp, playerChar.maxHp) : playerChar.maxHp);
    }
    
    const enemyChar = _buildEnemyChar(mimicEnemy);
    _pendingDungeonBattleCell = { row: ds.pos[0], col: ds.pos[1], enemy: mimicEnemy, isMimic: true };
    startWildBattle(playerChar, enemyChar, _onDungeonBattleEnd);
  }, 800);
}

// ═══════════════════════════════════════════════════════════════
//  地下城"将将胡"系统 - 神秘商人
// ═══════════════════════════════════════════════════════════════
function _dungeonSummonMerchant(){
  const ds = _dungeonState;
  if(!ds) return;
  
  // 神秘商品池
  const mysteryGoods = [
    { id: 'item_hp_potion_large', name: '大还丹', icon: '💊', price: 50, desc: '恢复50%气血' },
    { id: 'item_mp_potion_large', name: '聚气散', icon: '💧', price: 40, desc: '恢复50%内力' },
    { id: 'item_escape_rope', name: '遁地符', icon: '📜', price: 100, desc: '立即离开地下城' },
    { id: 'item_luck_charm', name: '幸运符', icon: '🍀', price: 80, desc: '下一场战斗暴击+20%' },
    { id: 'item_rare_ore', name: '玄铁', icon: '⬛', price: 120, desc: '稀有锻造材料' },
    { id: 'mystery_weapon', name: '神秘武器', icon: '⚔️', price: 200, desc: '随机品质武器' }
  ];
  
  // 随机选3个商品
  const shuffled = [...mysteryGoods].sort(() => Math.random() - 0.5);
  const goods = shuffled.slice(0, 3);
  
  // 构建商人弹窗
  const goodsHtml = goods.map((g, i) => `
    <div class="dm-goods-item" onclick="_dungeonBuyFromMerchant(${i})" style="
      padding:10px;margin:5px 0;background:rgba(60,50,30,.8);border:1px solid #a08040;
      border-radius:8px;cursor:pointer;transition:all .2s;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:24px;">${g.icon}</span>
        <div style="flex:1;">
          <div style="font-weight:bold;color:#d4b060;">${g.name}</div>
          <div style="font-size:11px;color:#a09070;">${g.desc}</div>
        </div>
        <div style="color:#f0c060;font-weight:bold;">${g.price}💰</div>
      </div>
    </div>
  `).join('');
  
  const html = `
    <div class="dm-overlay" id="dmOverlay" style="
      position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;
      display:flex;align-items:center;justify-content:center;">
      <div class="dm-box" style="
        background:linear-gradient(180deg,#2a2010,#1a1508);border:2px solid #a08040;
        border-radius:12px;padding:20px;max-width:400px;width:90%;color:#d4c4a0;">
        <div style="text-align:center;margin-bottom:15px;">
          <div style="font-size:40px;">🧙‍♂️</div>
          <div style="font-size:18px;font-weight:bold;color:#ffd700;">神秘商人</div>
          <div style="font-size:12px;color:#a09070;">"有缘人，我这里有你需要的东西..."</div>
        </div>
        <div class="dm-goods-list">${goodsHtml}</div>
        <div style="text-align:center;margin-top:15px;padding-top:15px;border-top:1px solid rgba(160,128,64,.3);">
          <div style="font-size:12px;color:#a09070;margin-bottom:10px;">
            持有银两：${(typeof edS !== 'undefined' ? edS.silver : 0) || 0}💰
          </div>
          <button onclick="_dungeonCloseMerchant()" style="
            padding:8px 20px;background:rgba(160,60,60,.8);border:1px solid #c08060;
            border-radius:6px;color:#e0c0b0;cursor:pointer;">离开</button>
        </div>
      </div>
    </div>
  `;
  
  // 保存商品数据供购买函数使用
  window._dungeonMerchantGoods = goods;
  
  const existing = document.getElementById('dmOverlay');
  if(existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  
  // 标记房间已清理
  const [row, col] = ds.pos;
  const cell = ds.map[row][col];
  if(cell){
    cell.cleared = true;
    ds.clearedRooms++;
    dungeonSave();
  }
}

// 购买神秘商人商品
function _dungeonBuyFromMerchant(index){
  const goods = window._dungeonMerchantGoods;
  if(!goods || !goods[index]) return;
  
  const item = goods[index];
  const currentSilver = (typeof edS !== 'undefined' ? edS.silver : 0) || 0;
  
  if(currentSilver < item.price){
    showToast('💰 银两不足！', 'error');
    return;
  }
  
  // 扣钱
  if (typeof spendSilver === 'function') {
    spendSilver(item.price, 'dungeon_merchant');
  } else {
    if(typeof edS !== 'undefined'){
      edS.silver = Math.max(0, (edS.silver || 0) - item.price);
    }
    if(typeof travelPlayerState !== 'undefined'){
      travelPlayerState.silver = Math.max(0, (travelPlayerState.silver || 0) - item.price);
    }
    if(typeof saveProgress === 'function') saveProgress();
    if(typeof editorSave === 'function') editorSave();
  }
  
  // 发放物品
  if(item.id === 'mystery_weapon'){
    // 随机武器
    const qualities = ['common', 'uncommon', 'rare', 'epic'];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    showToast(`⚔️ 获得${quality}品质神秘武器！`, 'rare');
    _dgLog(`⚔️ 从神秘商人处购得神秘武器（${quality}）`);
  } else {
    _dungeonAddItem(item.id, 1);
    showToast(`📦 获得 ${item.name}！`, 'success');
    _dgLog(`📦 从神秘商人处购得 ${item.name}`);
  }
  
  // 更新显示
  _dungeonCloseMerchant();
  _dungeonSummonMerchant(); // 重新打开刷新银两显示
}

function _dungeonCloseMerchant(){
  const el = document.getElementById('dmOverlay');
  if(el) el.remove();
  delete window._dungeonMerchantGoods;
}

function _dungeonAddItem(itemId, qty){
  if(itemId === 'silver'){
    if(typeof addSilver === 'function'){
      // addSilver（SilverManager 或 minigame-cricket.js 的封装）已内置 save
      addSilver(qty);
    } else {
      // 独立模式降级：直接修改银两并保存
      const newSilver = (edS?.silver || travelPlayerState?.silver || 0) + qty;
      if(typeof edS !== 'undefined' && edS){
        edS.silver = newSilver;
      }
      if(typeof travelPlayerState !== 'undefined' && travelPlayerState){
        travelPlayerState.silver = newSilver;
      }
      // 尝试保存（独立地下城模式）
      if(typeof saveProgress === 'function') saveProgress();
      if(typeof editorSave === 'function') editorSave();
      // 尝试更新 UI 银两显示
      const silverEl = document.getElementById('dungeonSilver') || document.getElementById('travelSilver');
      if(silverEl) silverEl.textContent = newSilver + '两';
    }
    return;
  }
  // 查找物品元数据（优先级：DUNGEON_ITEM_DB > ENEMY_DROP_ITEMS > 装备模板 > CRAFT_MATERIAL_NAMES）
  let meta = (typeof getItemMeta === 'function') ? getItemMeta(itemId) : null;
  let type = meta?.type || '';
  // 额外检查装备模板（WEAPONS / COSTUMES 数组）
  if (!type && typeof WEAPONS !== 'undefined') {
    const _tpl = WEAPONS.find(w => w.id === itemId);
    if (_tpl) { type = 'weapon'; meta = _tpl; }
  }
  if (!type && typeof COSTUMES !== 'undefined') {
    const _tpl = COSTUMES.find(c => c.id === itemId);
    if (_tpl) { type = 'costume'; meta = _tpl; }
  }
  if (!type) type = 'consumable';

  if(type === 'collectible' || type === 'material'){
    // 材料/收藏品 → 合成材料背包
    if(typeof injectDropToCraftBag === 'function'){
      injectDropToCraftBag(itemId, qty, meta);
    } else {
      craftBagAdd(itemId, qty, meta);
    }
  } else if(type === 'consumable'){
    // 消耗品 → 消耗品背包
    const item = {
      id: itemId,
      name: meta?.name || itemId,
      icon: meta?.icon || '📦',
      desc: meta?.desc || '',
      effect: meta?.effect || {},
    };
    consumableBagAdd(item, qty);
    if(typeof _tryRefreshTownBag === 'function') _tryRefreshTownBag();
  } else if(type === 'weapon' || type === 'costume' || type === 'accessory'){
    // 装备 → 生成实例入装备背包
    if(typeof createEquipInst === 'function' && typeof edS !== 'undefined' && typeof bagAddInst === 'function'){
      const inst = createEquipInst(type, itemId);
      if(inst){ bagAddInst(inst); }
    } else {
      // 降级：放入 edS.bag
      if(typeof edS !== 'undefined' && edS){
        if(!edS.bag) edS.bag = [];
        const existing = edS.bag.find(b => b && b.id === itemId);
        if(existing){ existing.qty = (existing.qty||1) + qty; }
        else { edS.bag.push({ id: itemId, qty }); }
      }
    }
    if(typeof refreshTownBag === 'function') refreshTownBag();
    if(typeof _bagRefreshTabBadges === 'function') _bagRefreshTabBadges();
  } else {
    // 其他类型默认进消耗品背包
    const item = { id: itemId, name: meta?.name || itemId, icon: meta?.icon || '📦', desc: meta?.desc || '', effect: meta?.effect || {} };
    consumableBagAdd(item, qty);
    if(typeof _tryRefreshTownBag === 'function') _tryRefreshTownBag();
  }
}

// ─────────────────────────────────────────────────────
//  经验值处理（统一走主等级系统 level-system.js）
//  原 edS.exp 线性系统已废弃，经验全量合并到 edS.totalExp 二次曲线
// ─────────────────────────────────────────────────────
function gainExp(amount){
  // 直接路由到主系统，保留函数签名兼容所有旧调用点
  if(typeof addPlayerExp === 'function'){
    addPlayerExp(amount, '地下城战斗');
  }
}

// 计算指定等级所需总经验（已废弃，仅供遗留引用兼容）
function getExpForLevel(level){
  if(typeof totalExpForLevel === 'function'){
    return totalExpForLevel(level);
  }
  // 兜底：旧线性公式（永远不会走到，除非 level-system 未加载）
  if(level <= 1) return 0;
  let total = 0;
  for(let i = 2; i <= level; i++) total += i * 50;
  return total;
}

function _getDungeonPlayerChar(){
  // 优先用 cp_self（自定义角色），其次用第一个可用角色
  if(typeof CHARS === 'undefined') return null;
  const selfChar = CHARS.find(c => c.id === 'cp_self');
  if(selfChar && selfChar.name) return selfChar;
  return CHARS[0] || null;
}

function _generateEnemyTitle(enemy) {
  const tier = enemy.tier;
  const type = enemy.type;
  const level = enemy.level;
  
  // 精英怪称号池
  const eliteTitles = {
    boss: ['天下无敌', '魔王降世', '血手人屠', '武林至尊', '一代宗师'],
    evil: ['杀气腾腾', '万毒弥漫', '魔气冲天', '血腥屠夫', '邪道巨擘'],
    assassin: ['暗影杀手', '鬼影无踪', '夺命无常', '血衣刺客', '暗夜君王'],
    ghost: ['幽冥鬼王', '阴魂不散', '鬼哭神嚎', '百鬼夜行', '冥界使者'],
    bandit: ['啸聚山林', '打家劫舍', '绿林好汉', '山寨大王', '劫富济贫'],
  };
  
  // 头目怪称号池
  const majorTitles = {
    boss: ['一方霸主', '威震四方', '独步武林', '剑气纵横', '雷霆万钧'],
    evil: ['心狠手辣', '恶贯满盈', '毒辣心肠', '凶神恶煞', '恶名昭彰'],
    assassin: ['来去无踪', '暗箭伤人', '致命一击', '影舞者', '死亡宣告'],
    ghost: ['阴风阵阵', '鬼魅魍魉', '魂魄收割', '幽灵行者', '冥河摆渡'],
    bandit: ['占山为王', '路见不平', '劫财不劫色', '江湖草莽', '绿林豪杰'],
    beast: ['凶猛异常', '野性难驯', '獠牙利爪', '嗜血成性', '山林之王'],
  };
  
  // 普通怪称号池（低阶）
  const funcTitles = {
    boss: ['初出茅庐', '小有名气'],
    evil: ['为非作歹', '心术不正'],
    assassin: ['新手刺客', '暗影学徒'],
    ghost: ['游魂野鬼', '孤魂野鬼'],
    bandit: ['小喽啰', '毛贼', '散兵', '流寇'],
    beast: ['野兽', '猛兽'],
  };
  
  // 根据类型和等级选择称号
  let titlePool;
  if (tier === 'elite') {
    titlePool = eliteTitles[type] || eliteTitles.bandit;
  } else if (tier === 'major') {
    titlePool = majorTitles[type] || majorTitles.bandit;
  } else {
    titlePool = funcTitles[type] || funcTitles.bandit;
  }
  
  // 基于敌人ID哈希选择固定称号
  const hash = enemy.id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  const titleIndex = Math.abs(hash) % titlePool.length;
  const title = titlePool[titleIndex];
  
  return title ? `「${title}」Lv${level}` : (enemy.icon||'⚔') + ' Lv' + level;
}

function _buildEnemyChar(enemy){
  // 将野怪数据转成 battle.js 可用的对象（与 buildEnemyForFight 保持格式一致）
  const typeColor = {
    beast:'#c08040', bandit:'#a07050', evil:'#a040c0',
    assassin:'#8080e0', ghost:'#60e0c0', boss:'#ff6040'
  };
  const tierColor = { func:'#a08060', major:'#ffd060', elite:'#ff8060' };
  const col = tierColor[enemy.tier] || typeColor[enemy.type] || '#c09060';

  const skillObjs = (enemy.skills || []).map(sid => {
    if(typeof sid !== 'string') return sid;
    if(typeof SKILL_LIB !== 'undefined'){
      // SKILL_LIB 是以学派为key的对象，遍历找技能
      for(const school of Object.values(SKILL_LIB)){
        const sk = Array.isArray(school) ? school.find(s => s.id === sid) : null;
        if(sk) return sk;
      }
    }
    return { id: sid, name: sid, mpCost: 0 };
  }).filter(Boolean);

  // 生成称号
  const enemyTitle = _generateEnemyTitle(enemy);

  return {
    id:       '_enemy_' + enemy.id,
    name:     enemy.name,
    title:    enemyTitle,
    tag:      enemy.tier || 'func',
    tagColor: col,
    color:    col,
    maxHp:    enemy.hp,
    atk:      enemy.atk,
    def:      enemy.def  || 0,
    speedN:   enemy.spd  || 8,
    crit:     enemy.crit || 5,
    dodge:    enemy.dodge|| 3,
    mp:       enemy.mp   || 0,
    maxMp:    enemy.mp   || 0,
    exp:      enemy.exp  || 0,  // 基础经验值，供 calcBattleExp 读取
    // ── 字符画多状态 ──
    stand:  enemy.stand || enemy.avatar || enemy.icon || '👾',
    attack: Array.isArray(enemy.attack) ? enemy.attack : (enemy.attack ? [enemy.attack] : []),
    heavy:  Array.isArray(enemy.heavy)  ? enemy.heavy  : (enemy.heavy  ? [enemy.heavy]  : []),
    hit:    Array.isArray(enemy.hit)    ? enemy.hit    : (enemy.hit    ? [enemy.hit]    : []),
    down:   enemy.down || '',
    parts:  null,  // 敌人用 stand 文本渲染，不走 ED_PARTS 部件系统
    skills: skillObjs,
    tier:         enemy.tier || 'func',
    level:        enemy.level || 1,  // 供 checkWin() calcBattleExp 读取
    _isEnemy:     true,
    _isWildEnemy: true,
    _enemyTier:   enemy.tier,
    _enemyType:   enemy.type,
    _enemyLevel:  enemy.level,
    _enemyData:   enemy,
    // 不设 _skipBattleExp：经验统一由 checkWin() 用 calcBattleExp 公式发放
  };
}

// ════════════════════════════════════════════════════
//  startWildBattle — 野外/地下城战斗正式接入
//  取代 travel.js 中的降级逻辑
//  callback(playerWon: bool) 在战斗结束后调用
// ════════════════════════════════════════════════════
function startWildBattle(playerChar, enemyChar, callback){
  if(!playerChar || !enemyChar){
    showToast('战斗角色数据异常');
    if(callback) callback(false);
    return;
  }

  // 确保敌人有完整属性
  if(!enemyChar.maxHp) enemyChar.maxHp = enemyChar.totalHp || enemyChar.hp || 100;
  if(!enemyChar.skills || !Array.isArray(enemyChar.skills)){
    enemyChar.skills = [];
  }
  // skills 要转成 SKILL_LIB 对象
  enemyChar.skills = enemyChar.skills.map(s => {
    if(typeof s === 'string'){
      return (typeof SKILL_LIB !== 'undefined' && SKILL_LIB[s]) ? SKILL_LIB[s] : { id:s, name:'???', mpCost:0 };
    }
    return s;
  }).filter(Boolean);

  // 记录战斗完成回调（挂在全局，battle.js checkWin 完成后取用）
  window._wildBattleCallback = callback;

  // 设置 LH/RH 后跳到战斗页
  LH = playerChar;
  RH = enemyChar;

  // 同步玩家当前血量（不满血进入战斗）
  if(typeof edS !== 'undefined'){
    LH.maxHp = edS.maxHp || LH.maxHp || 100;
    // 当前血量：优先 travelPlayerState 百分比 → edS.hp → 满血
    if (typeof travelPlayerState !== 'undefined' && typeof travelPlayerState.hp === 'number') {
      LH._currentHp = Math.max(1, Math.round(LH.maxHp * travelPlayerState.hp / 100));
    } else {
      LH._currentHp = edS.hp || LH.maxHp;
    }
  }

  // 找战斗Tab
  const allTabs = document.querySelectorAll('.tab');
  const fightTab = [...allTabs].find(t => t.textContent.includes('武斗场'));
  showPage('fight', fightTab);
  
  // 隐藏选将区，显示地下城提示
  const pickSection = document.querySelector('.pick-section');
  const dungeonOnly = document.getElementById('dungeonFightOnly');
  if(pickSection) pickSection.style.display = 'none';
  if(dungeonOnly) dungeonOnly.style.display = 'block';
  
  resetFight();

  // 将玩家血量设为当前（不满血），battle.js的 lHp 默认 = LH.maxHp，需要修正
  if(typeof LH._currentHp === 'number'){
    lHp = LH._currentHp;
    updateBars();
  }

  // 在战斗Log中加入提示
  const logEl = document.getElementById('bLog');
  if(logEl){
    const header = document.createElement('div');
    header.style.cssText = 'text-align:center;padding:8px 0 4px;color:#e08040;font-size:11px;letter-spacing:2px;';
    header.textContent = `─── 野外遭遇：${enemyChar.name} ───`;
    logEl.appendChild(header);
  }

  // 改写 winLayer 按钮：战胜/战败后有「返回」按钮
  _patchWinLayerForWild(enemyChar.name);
}

// 临时改写胜负弹窗按钮（野外战斗专用）
function _patchWinLayerForWild(enemyName){
  const winLayer = document.getElementById('winLayer');
  if(!winLayer) return;
  // 等待弹窗显示再改写（checkWin 会 setTimeout 800ms）
  const observer = new MutationObserver(() => {
    if(winLayer.classList.contains('on')){
      observer.disconnect();
      const btnWrap = winLayer.querySelector('.win-box > div:last-child');
      if(!btnWrap) return;
      const playerWon = lHp > 0;
      btnWrap.innerHTML = `
        <button class="win-btn" onclick="_afterWildBattle(${playerWon})">
          ${playerWon ? '🏃 继续探索' : '💀 返回'}
        </button>`;

      // 同步血量到 edS（战斗结束后）
      if(typeof edS !== 'undefined'){
        edS.hp = Math.max(1, Math.round(lHp));
        if(typeof saveProgress === 'function') saveProgress();
      }
    }
  });
  observer.observe(winLayer, { attributes: true, attributeFilter: ['class'] });
}

function _afterWildBattle(playerWon){
  closeWin();
  const cb = window._wildBattleCallback;
  window._wildBattleCallback = null;
  if(cb) cb(playerWon);
}

// ════════════════════════════════════════════════════
//  startBattleInNewPage — 从城镇/NPC页面跳转到独立战斗页面
//  用于 town.html → battle.html 的战斗跳转
// ════════════════════════════════════════════════════
function startBattleInNewPage(playerChar, enemyChar, returnUrl, callback){
  if(!playerChar || !enemyChar){
    showToast('战斗角色数据异常');
    if(callback) callback(false);
    return;
  }

  // 确保敌人有完整属性
  if(!enemyChar.maxHp) enemyChar.maxHp = enemyChar.totalHp || enemyChar.hp || 100;
  if(!enemyChar.skills || !Array.isArray(enemyChar.skills)){
    enemyChar.skills = [];
  }
  // skills 要转成 SKILL_LIB 对象
  enemyChar.skills = enemyChar.skills.map(s => {
    if(typeof s === 'string'){
      return (typeof SKILL_LIB !== 'undefined' && SKILL_LIB[s]) ? SKILL_LIB[s] : { id:s, name:'???', mpCost:0 };
    }
    return s;
  }).filter(Boolean);

  // 强制从 edS 同步玩家数据（确保使用最新存档数据）
  if(typeof edS !== 'undefined'){
    // ★ 修复（2026-05-04）：直接用 edS.maxHp，不用 edStats()
    playerChar.maxHp = edS.maxHp || playerChar.maxHp || 100;
    // 当前血量：优先 travelPlayerState 百分比 → edS.hp → playerChar 已有值
    if (typeof travelPlayerState !== 'undefined' && typeof travelPlayerState.hp === 'number') {
      playerChar._currentHp = Math.max(1, Math.round(playerChar.maxHp * travelPlayerState.hp / 100));
    } else if (typeof edS.hp === 'number') {
      playerChar._currentHp = Math.min(edS.hp, playerChar.maxHp);
    }
    playerChar.maxMp = edS.maxMp || playerChar.maxMp || 100;
    if (typeof edS.mp === 'number' && edS.mp <= 99999) {
      playerChar._currentMp = Math.min(edS.mp, playerChar.maxMp);
    }
  }

  // 构建战斗上下文
  const battleContext = {
    player: {
      id: playerChar.id,
      name: playerChar.name,
      title: playerChar.title,
      maxHp: playerChar.maxHp,
      atk: playerChar.atk,
      def: playerChar.def,
      crit: playerChar.crit,
      dodge: playerChar.dodge,
      maxMp: playerChar.maxMp,
      speedN: playerChar.speedN,
      speed: playerChar.speed,
      color: playerChar.color,
      stand: playerChar.stand,
      attack: playerChar.attack,
      heavy: playerChar.heavy,
      hit: playerChar.hit,
      down: playerChar.down,
      skillIds: playerChar.skillIds || ['cm01','cm02','cm03'],
      _currentHp: playerChar._currentHp || playerChar.maxHp,
      // 玩家捏脸数据（供 battle.html 渲染角色立绘）
      parts:     playerChar.parts || null,
      custom:    playerChar.custom || null,
      useCustom: playerChar.useCustom || null,
      tag:       playerChar.tag || null,
      tagColor:  playerChar.tagColor || null,
    },
    enemy: {
      id: enemyChar.id || 'enemy_' + Date.now(),
      name: enemyChar.name,
      title: enemyChar.title || '敌人',
      maxHp: enemyChar.maxHp,
      atk: enemyChar.atk,
      def: enemyChar.def,
      crit: enemyChar.crit,
      dodge: enemyChar.dodge,
      maxMp: enemyChar.maxMp,
      speedN: enemyChar.speedN,
      speed: enemyChar.speed,
      color: enemyChar.color,
      stand: enemyChar.stand,
      attack: enemyChar.attack,
      heavy: enemyChar.heavy,
      hit: enemyChar.hit,
      down: enemyChar.down,
      skills: enemyChar.skills,
      tier: enemyChar.tier || 'func',
      level: enemyChar.level || enemyChar._enemyLevel || 1,  // 供 checkWin() 读取
      icon: enemyChar.icon,
      _isEnemy: true,
      // 保存类型信息用于重新生成称号
      _enemyType: enemyChar._enemyType || enemyChar.type,
      _enemyTier: enemyChar._enemyTier || enemyChar.tier,
      _enemyLevel: enemyChar._enemyLevel || enemyChar.level,
      // NPC 特有字段（供 battle.js buildFighterEl 渲染 NPC 立绘）
      _isNpc:     enemyChar._isNpc || false,
      _npcId:     enemyChar._npcId || null,
      _npcInstId: enemyChar._npcInstId || null,
      parts:      enemyChar.parts || null,
      tag:        enemyChar.tag || null,
      tagColor:   enemyChar.tagColor || null,
    },
    returnUrl: returnUrl || 'town.html',
    timestamp: Date.now(),
    // ── 主线 BOSS 登场动画标记 ──
    // 若当前主线节点是 boss 类型且目标名与敌人名匹配，则传入 _storyBossName
    _storyBossName: (function(){
      try {
        if(typeof StoryGuide === 'undefined') return null;
        const beat = StoryGuide.current && StoryGuide.current();
        if(!beat || beat.type !== 'boss') return null;
        const bname = enemyChar.name || '';
        if(!bname) return null;
        // 名字相互包含则认为匹配
        if(bname.includes(beat.target) || beat.target.includes(bname)){
          return bname;
        }
      } catch(e){}
      return null;
    })()
  };

  // 保存战斗上下文到 sessionStorage
  sessionStorage.setItem('battleContext', JSON.stringify(battleContext));

  // ★ 同步玩家当前血量到 sessionStorage（battle.html 需要读取）
  // ★ 修复（2026-05-05）：写入 sessionStorage 前检查脏值
  if (playerChar._currentHp != null) {
    const _safeCurHp = (typeof playerChar._currentHp === 'number' && playerChar._currentHp >= 0 && playerChar._currentHp <= 99999) ? playerChar._currentHp : 0;
    sessionStorage.setItem('wuxia_dungeon_player_hp', String(Math.round(_safeCurHp)));
    sessionStorage.setItem('wuxia_dungeon_player_maxhp', String(Math.round(playerChar.maxHp || 100)));
  }
  if (playerChar._currentMp != null) {
    // ★ 修复（2026-05-05）：当前值不能超过 maxMp，防止比例 >1 导致翻倍
    const _safeCurMp = (typeof playerChar._currentMp === 'number' && playerChar._currentMp >= 0 && playerChar._currentMp <= 99999) ? Math.min(playerChar._currentMp, playerChar.maxMp) : 0;
    sessionStorage.setItem('wuxia_dungeon_player_mp', String(Math.round(_safeCurMp)));
    sessionStorage.setItem('wuxia_dungeon_player_maxmp', String(Math.round(playerChar.maxMp || 100)));
  }
  
  // 保存回调函数引用（序列化不了，用全局变量）
  window._pendingBattleCallback = callback;
  
  // ── 战斗前同步背包（确保 battle.html 能加载到最新背包）──
  if (typeof edS !== 'undefined' && edS) {
    try {
      if (typeof bagSave === 'function') bagSave();
      else localStorage.setItem('wuxia_bag', JSON.stringify(edS.bag || []));
      const _edRaw = localStorage.getItem('wuxia_editor');
      if (_edRaw) {
        const _edD = JSON.parse(_edRaw);
        _edD.bag = edS.bag || [];
        localStorage.setItem('wuxia_editor', JSON.stringify(_edD));
      }
    } catch(e) { console.warn('[startBattleInNewPage] 同步背包失败:', e); }
  }

  // 跳转到战斗页面前先清掉上一界面的残留音效
  if (typeof clearGameAudio === 'function') clearGameAudio();
  window.location.href = 'battle.html';
}


// ─────────────────────────────────────────────────────
//  地图侧边栏：显示附近地下城入口
//  在 travel-render.js 或 npc-logic.js 的城市面板中调用
// ─────────────────────────────────────────────────────
function renderDungeonEntrances(cityId, containerEl){
  if(!containerEl) return;
  if(typeof edS === 'undefined'){ containerEl.innerHTML = ''; return; }

  const playerLevel = edS.level || 1;
  const dungeons = getAvailableDungeons(cityId, playerLevel);
  let unlockedIds; try{ unlockedIds=JSON.parse(localStorage.getItem('wuxia_dungeon_unlocked') || '[]'); }catch(e){ unlockedIds=[]; }

  // 过滤：minLevel > 15 的地下城需要解锁才显示（或通过主线）
  const visible = dungeons.filter(d =>
    d.minLevel <= 15 || unlockedIds.includes(d.id) || d.isMainQuestDungeon
  );

  if(visible.length === 0){
    containerEl.innerHTML = '<div style="color:rgba(180,150,80,.4);font-size:11px;text-align:center;padding:10px 0">附近暂无可探索的险地</div>';
    return;
  }

  const html = visible.map(d => {
    const tooLow = playerLevel < d.minLevel;
    const levelStr = `Lv${d.minLevel}~${d.maxLevel}`;

    // 【方案C】难度标注：适合/有挑战/危险/未知
    const diff = playerLevel - d.minLevel; // 正数=玩家高于推荐，负数=低于推荐
    let diffTag = '';
    if(!tooLow){
      if(diff >= 5){
        diffTag = `<span class="dg-diff-tag dg-diff-easy">适合</span>`;
      } else if(diff >= 0){
        diffTag = `<span class="dg-diff-tag dg-diff-normal">有挑战</span>`;
      } else {
        diffTag = `<span class="dg-diff-tag dg-diff-hard">危险</span>`;
      }
    }

    return `
<div class="dg-entrance" onclick="${tooLow ? `showToast('等级不足，需要 ${d.minLevel} 级')` : `showDungeonConfirm('${d.id}','map')`}">
  <span class="dg-ent-icon">${d.icon}</span>
  <div class="dg-ent-info">
    <div class="dg-ent-name">${d.name} <span class="dg-ent-level ${tooLow?'dg-low':''}">${levelStr}</span>${diffTag}</div>
    <div class="dg-ent-desc">${d.desc.substring(0,30)}…</div>
  </div>
  <span class="dg-ent-arrow">${tooLow ? '🔒' : '▶'}</span>
</div>`;
  }).join('');

  containerEl.innerHTML = `<div class="dg-entrance-title">⚔️ 附近险地</div>${html}`;
}

// ════════════════════════════════════════════════════
//  开箱动画 - 华丽字符画版本
// ════════════════════════════════════════════════════
function playChestAnimation(reward){
  const overlay = document.getElementById('chestOverlay');
  const chestAscii = document.getElementById('chestAscii');
  const chestAsciiOpen = document.getElementById('chestAsciiOpen');
  const chestReward = document.getElementById('chestReward');
  const chestRewardIcon = document.getElementById('chestRewardIcon');
  const chestRewardName = document.getElementById('chestRewardName');
  const chestRewardQty = document.getElementById('chestRewardQty');
  const chestGetText = document.getElementById('chestGetText');
  const chestClose = document.getElementById('chestClose');

  if(!overlay){
    console.error('[playChestAnimation] 找不到chestOverlay元素');
    return;
  }

  // 重置动画状态
  chestAscii.classList.remove('opening');
  chestAsciiOpen.classList.remove('show');
  chestReward.classList.remove('show');
  chestGetText.classList.remove('show');
  chestClose.classList.remove('show');

  // 设置奖励内容
  let icon = '🎁';
  let name = '神秘物品';
  let qty = reward.qty || 1;

  // 优先使用meta信息
  if(reward.meta){
    if(reward.meta.icon) icon = reward.meta.icon;
    if(reward.meta.name) name = reward.meta.name;
  }
  // 其次使用reward.name
  else if(reward.name){
    name = reward.name;
    // 根据ID判断图标
    if(reward.id){
      if(reward.id.includes('silver') || reward.id.includes('coin')) icon = '💰';
      else if(reward.id.includes('herb') || reward.id.includes('grass')) icon = '🌿';
      else if(reward.id.includes('ore') || reward.id.includes('stone') || reward.id.includes('iron')) icon = '⛏️';
      else if(reward.id.includes('cloth') || reward.id.includes('fabric')) icon = '🧵';
      else if(reward.id.includes('fish')) icon = '🐟';
      else if(reward.id.includes('manual') || reward.id.includes('book') || reward.id.includes('scroll')) icon = '📜';
      else if(reward.id.includes('weapon') || reward.id.includes('sword') || reward.id.includes('blade')) icon = '⚔️';
      else if(reward.id.includes('armor') || reward.id.includes('shield')) icon = '🛡️';
      else if(reward.id.includes('pill') || reward.id.includes('dan') || reward.id.includes('elixir')) icon = '💊';
      else if(reward.id.includes('wine') || reward.id.includes('liquor') || reward.id.includes('alcohol')) icon = '🍶';
      else if(reward.id.includes('food') || reward.id.includes('meat') || reward.id.includes('bread')) icon = '🍖';
      else if(reward.id.includes('gem') || reward.id.includes('crystal') || reward.id.includes('jade')) icon = '💎';
      else if(reward.id.includes('wood') || reward.id.includes('log') || reward.id.includes('timber')) icon = '🪵';
      else if(reward.id.includes('leather') || reward.id.includes('hide') || reward.id.includes('pelt')) icon = '🟫';
      else if(reward.id.includes('col_')) icon = '🏺'; // 收藏品
    }
  }

  chestRewardIcon.textContent = icon;
  chestRewardName.textContent = name;
  chestRewardQty.textContent = '×' + qty;

  // 显示覆盖层
  overlay.classList.add('active');

  // 动画序列
  // 1. 宝箱震动并打开
  setTimeout(() => {
    chestAscii.classList.add('opening');
  }, 400);

  // 2. 显示打开的宝箱
  setTimeout(() => {
    chestAsciiOpen.classList.add('show');
  }, 900);

  // 3. 显示"获得战利品！"文字
  setTimeout(() => {
    chestGetText.classList.add('show');
  }, 1200);

  // 4. 显示奖励
  setTimeout(() => {
    chestReward.classList.add('show');
  }, 1400);

  // 5. 显示关闭按钮
  setTimeout(() => {
    chestClose.classList.add('show');
  }, 2200);
}

function closeChestAnimation(){
  const overlay = document.getElementById('chestOverlay');
  if(!overlay) return;

  overlay.classList.remove('active');

  // 延迟重置动画状态
  setTimeout(() => {
    const chestAscii = document.getElementById('chestAscii');
    const chestAsciiOpen = document.getElementById('chestAsciiOpen');
    const chestReward = document.getElementById('chestReward');
    const chestGetText = document.getElementById('chestGetText');
    const chestClose = document.getElementById('chestClose');
    if(chestAscii) chestAscii.classList.remove('opening');
    if(chestAsciiOpen) chestAsciiOpen.classList.remove('show');
    if(chestReward) chestReward.classList.remove('show');
    if(chestGetText) chestGetText.classList.remove('show');
    if(chestClose) chestClose.classList.remove('show');
  }, 400);
}

// ── window 导出（供 HTML inline onclick 调用）──
window._dungeonApplyConsumable = _dungeonApplyConsumable;
window.dungeonUseHealItem       = dungeonUseHealItem;

