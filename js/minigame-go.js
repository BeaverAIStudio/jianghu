/**
 * 棋社对弈 - 五子棋小游戏
 * minigame-go.js v2.1
 * 
 * 15x15五子棋（原围棋改版）
 * 特色：字符画棋盘，多级AI，修心养性
 */

// ==================== 对手列表 ====================
const GO_OPPONENTS = [
    { name: '棋社童子', level: 1,  location: '小镇棋社', skill: 1, ai: 'random',   desc: '初学五子，落子随意' },
    { name: '棋社学徒', level: 5,  location: '县城棋院', skill: 2, ai: 'basic',    desc: '略知棋理，懂得堵截' },
    { name: '棋社教习', level: 10, location: '州府棋院', skill: 3, ai: 'basic',    desc: '攻守兼备，经验老道' },
    { name: '五子好手', level: 15, location: '名城棋社', skill: 4, ai: 'advanced', desc: '棋力不俗，善于布局' },
    { name: '五子名士', level: 20, location: '京畿棋院', skill: 5, ai: 'advanced', desc: '名动一方，杀招凌厉' },
    { name: '棋坛国手', level: 25, location: '国手堂',   skill: 6, ai: 'expert',   desc: '棋艺通神，滴水不漏' }
];

// ==================== 游戏状态 ====================
let goGameState = {
    board: null,           // 15x15棋盘
    currentPlayer: 'b',    // 'b'=黑棋, 'w'=白棋
    lastMove: null,        // 最后一步坐标
    gameOver: false,
    winner: null,          // 'b','w','draw'
    winLine: null,         // 获胜五子坐标数组
    history: [],           // 棋谱记录
    moveCount: 0,          // 总手数（平局判断用）
    
    // 对手信息
    opponent: null,
    isPlayerTurn: true,
    _aiScheduled: false    // 防止AI重复调度
};

// ==================== 初始化 ====================
function openGoGame(cityId) {
    if (!cityId) {
        console.error('openGoGame: cityId is required');
        return;
    }
    
    // 检查悟性
    const wisdom = edS.playerAttributes?.wisdom || 50;
    if (wisdom < 30) {
        showBanner('悟性不足', '你的悟性不足30，难以领悟棋道。', 'warning');
        return;
    }
    
    goShowOpponentSelect();
}

// ==================== 对手选择界面 ====================
function goShowOpponentSelect() {
    const isMobile = window.innerWidth < 600;
    const playerLevel = edS.level || 1;
    
    let opponentCards = '';
    GO_OPPONENTS.forEach((opp, idx) => {
        const stars = '★'.repeat(opp.skill) + '☆'.repeat(6 - opp.skill);
        const isUnlocked = playerLevel >= opp.level;
        const lockStyle = isUnlocked ? '' : 'opacity:0.4;pointer-events:none;';
        const lockTag = isUnlocked ? '' : `<div style="color:#ff6b6b;font-size:11px;margin-top:2px;">🔒 需要等级 ${opp.level}</div>`;
        
        opponentCards += `
            <div class="go-opp-card ${isUnlocked ? 'go-opp-unlocked' : 'go-opp-locked'}" 
                 style="${lockStyle}"
                 onclick="${isUnlocked ? `goStartGame(${idx})` : ''}">
                <div class="go-opp-name">${opp.name}</div>
                <div class="go-opp-stars">${stars}</div>
                <div class="go-opp-loc">${opp.location}</div>
                <div class="go-opp-desc">${opp.desc}</div>
                ${lockTag}
            </div>
        `;
    });
    
    const html = `
        ${goStyles}
        <div class="go-container">
            <div class="go-header">
                <div class="go-banner">♟️ 五子棋 ♟️</div>
                <div style="font-size:12px;color:#b0a090;margin-top:4px;">选择对手 · 等级 ${playerLevel}</div>
            </div>
            
            <div class="go-opp-grid">
                ${opponentCards}
            </div>
            
            <div style="text-align:center;margin-top:10px;">
                <button class="go-btn" onclick="goClose()">离开棋社</button>
            </div>
        </div>
    `;
    
    showDialog({
        title: '棋社对弈',
        content: html,
        width: isMobile ? window.innerWidth - 12 : 520,
        height: isMobile ? window.innerHeight - 12 : Math.min(560, window.innerHeight - 16)
    });
}

function goStartGame(oppIdx) {
    goGameState.opponent = GO_OPPONENTS[oppIdx];
    goInitGame();
    goRender();
}

function goInitGame() {
    goGameState.board = Array(15).fill(null).map(() => Array(15).fill(null));
    goGameState.currentPlayer = 'b';
    goGameState.lastMove = null;
    goGameState.gameOver = false;
    goGameState.winner = null;
    goGameState.winLine = null;
    goGameState.history = [];
    goGameState.moveCount = 0;
    goGameState.isPlayerTurn = true;
    goGameState._aiScheduled = false;
    
    // ═══════════════════════════════════════════════
    // 五子棋"将将胡"系统 - 初始化
    // ═══════════════════════════════════════════════
    const luckRoll = Math.random();
    goGameState.specialEvent = null;
    
    // 3%概率：神之一手（玩家下一步棋自动找到最佳位置）
    if(luckRoll < 0.03){
        goGameState.specialEvent = 'divine_move';
        goGameState.divineMoveAvailable = true;
    }
    // 2%概率：昏招（AI有概率下出明显坏棋）
    else if(luckRoll < 0.05){
        goGameState.specialEvent = 'blunder';
        goGameState.blunderChance = 0.25; // 25%概率昏招
    }
    // 1%概率：棋魂附体（连续3回合，玩家评分+50%）
    else if(luckRoll < 0.06){
        goGameState.specialEvent = 'possession';
        goGameState.possessionTurns = 3;
    }
    
    // ═══════════════════════════════════════════════
    // 五子棋"将将胡"恶搞事件（5%总概率）
    // ═══════════════════════════════════════════════
    const gagRoll = Math.random();
    if (gagRoll < 0.05 && !goGameState.specialEvent) {
        const gagEvents = ['living_stones', 'cat_attack', 'wind_blow', 'coffee_spill', 'wrong_piece'];
        goGameState.specialEvent = gagEvents[Math.floor(Math.random() * gagEvents.length)];
        
        const gagMessages = {
            living_stones: '🪨 棋子活了！黑白棋子突然开始互相追逐...',
            cat_attack: '🐱 猫打翻棋盘！一只野猫跳上棋盘，棋子撒了一地！',
            wind_blow: '💨 大风刮过！棋子被吹得移位了...',
            coffee_spill: '☕ 咖啡洒了！对手手抖把咖啡洒在棋盘上...',
            wrong_piece: '🎲 拿错棋子！对手不小心拿成了骰子！'
        };
        
        if (typeof showToast === 'function') {
            showToast(gagMessages[goGameState.specialEvent], 'rare');
        }
        
        // 恶搞事件特殊处理
        if (goGameState.specialEvent === 'cat_attack') {
            // 猫打翻棋盘：随机移动一些棋子
            goApplyCatChaos();
        } else if (goGameState.specialEvent === 'wind_blow') {
            // 大风：随机移除1-3个棋子
            goApplyWindEffect();
        } else if (goGameState.specialEvent === 'coffee_spill') {
            // 咖啡：AI下一回合必定昏招
            goGameState.coffeeEffect = true;
        }
    }
    
    if(goGameState.specialEvent && typeof showToast === 'function'){
        const eventNames = {
            divine_move: '✨ 神之一手！冥冥之中自有天助...',
            blunder: '😵 对手今天状态不佳，似乎会犯糊涂...',
            possession: '🔥 棋魂附体！今日棋力大增！'
        };
        if (eventNames[goGameState.specialEvent]) {
            showToast(eventNames[goGameState.specialEvent], 'rare');
        }
    }
    
    if (typeof addLogEntry === 'function' && goGameState.opponent) {
        addLogEntry(`前往${goGameState.opponent.location}与${goGameState.opponent.name}对弈五子棋`, 'go');
    }
}

// ==================== 界面渲染 ====================
function _goCellSize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 600;
    // 15格棋盘 + 坐标列
    const maxBoardPx = isMobile
        ? vw - 40
        : Math.min(vw * 0.42, vh - 180);
    return Math.max(16, Math.min(30, Math.floor(maxBoardPx / 16)));
}

function goRender() {
    const cs = _goCellSize();
    const stoneFontSize = Math.max(12, cs - 6);
    const isMobile = window.innerWidth < 600;
    const g = goGameState;

    const html = `
        <div class="go-container">
            <div class="go-header">
                <div class="go-banner">♟️ 五子棋 ♟️</div>
            </div>
            
            <div class="go-opponent-info">
                <span class="go-opponent-name">${g.opponent.name}</span>
                <span class="go-opponent-level">${'★'.repeat(g.opponent.skill)} · ${g.opponent.location}</span>
            </div>
            
            <div class="go-board-container">
                <div class="go-board">
                    ${goRenderBoard(cs, stoneFontSize)}
                </div>
                
                <div class="go-sidebar">
                    <div class="go-current-player">
                        ${g.currentPlayer === 'b' ? '⚫ 黑棋（你）' : '⚪ 白棋（AI）'}
                        ${g.isPlayerTurn && !g.gameOver ? ' ← 请落子' : ''}
                        ${!g.isPlayerTurn && !g.gameOver ? ' 思考中...' : ''}
                    </div>
                    
                    <div class="go-score">
                        <div>第 ${g.moveCount + 1} 手</div>
                        <div>⚫ ${g.history.filter(h => h.player === 'b').length} 子 · ⚪ ${g.history.filter(h => h.player === 'w').length} 子</div>
                    </div>
                    
                    <div class="go-rules ${isMobile ? 'go-hide-mobile' : ''}">
                        <div class="go-rule-title">📋 规则</div>
                        <div class="go-rule">执黑先行，轮流落子</div>
                        <div class="go-rule">横竖斜连成五子即胜</div>
                        <div class="go-rule">棋盘落满无胜者则平</div>
                    </div>
                    
                    <div class="go-controls">
                        <button class="go-btn" onclick="goResign()" ${g.gameOver ? 'disabled' : ''}>认输</button>
                        <button class="go-btn" onclick="goClose()">离开</button>
                    </div>
                </div>
            </div>
            
            ${g.gameOver ? goRenderGameOver() : ''}
        </div>
    `;
    
    showDialog({
        title: `与${g.opponent.name}对弈五子棋`,
        content: html,
        width: isMobile ? window.innerWidth - 12 : 800,
        height: isMobile ? window.innerHeight - 12 : Math.min(660, window.innerHeight - 16)
    });
    
    // AI回合调度：只调度一次
    if (!g.isPlayerTurn && !g.gameOver && !g._aiScheduled) {
        g._aiScheduled = true;
        setTimeout(() => goAIThink(), 800);
    }
}

function goRenderBoard(cs, stoneFontSize) {
    const g = goGameState;
    let html = '<div class="go-coords">';
    
    // 列坐标 (A-O)
    html += '<div class="go-row">';
    html += `<div class="go-corner" style="width:${cs}px;height:${cs}px"></div>`;
    for (let x = 0; x < 15; x++) {
        html += `<div class="go-coord-col" style="width:${cs}px;height:${cs}px">${String.fromCharCode(65 + x)}</div>`;
    }
    html += '</div>';
    
    // 棋盘行
    for (let y = 0; y < 15; y++) {
        html += '<div class="go-row">';
        html += `<div class="go-coord-row" style="width:${cs}px;height:${cs}px">${15 - y}</div>`;
        
        for (let x = 0; x < 15; x++) {
            const stone = g.board[y][x];
            const isLastMove = g.lastMove && g.lastMove.x === x && g.lastMove.y === y;
            const isWinCell = g.winLine && g.winLine.some(c => c[0] === x && c[1] === y);
            
            // 星位点
            const stars = [[3,3],[3,7],[3,11],[7,3],[7,7],[7,11],[11,3],[11,7],[11,11]];
            const isStar = stars.some(s => s[0] === x && s[1] === y);
            
            let className = 'go-cell';
            if (isLastMove) className += ' go-last-move';
            if (isWinCell) className += ' go-win-cell';
            
            let content = '';
            if (stone === 'b') content = '●';
            else if (stone === 'w') content = '○';
            else if (isStar && !stone) content = '·';
            
            html += `<div class="${className}" style="width:${cs}px;height:${cs}px;font-size:${stoneFontSize}px" onclick="goClickCell(${x},${y})">${content}</div>`;
        }
        
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

function goRenderGameOver() {
    const g = goGameState;
    // ── 游戏结束音效 ──
    if (typeof SoundFX !== 'undefined') SoundFX.play(g.winner === 'b' ? 'victory' : 'game_over');
    // ── 成就系统触发 ──
    if(typeof achOnChessWin === 'function' && g.winner === 'b') achOnChessWin(g.opponent ? g.opponent.skill : 1);
    
    let titleText, titleColor;
    
    if (g.winner === 'b') {
        titleText = '🏆 黑棋胜！';
        titleColor = '#d4af37';
    } else if (g.winner === 'w') {
        titleText = '白棋胜';
        titleColor = '#b0a090';
    } else {
        titleText = '⚔️ 平局';
        titleColor = '#b0a090';
    }
    
    let rewardHtml = '';
    if (g.winner === 'b') {
        const expGain = 30 + g.opponent.skill * 10;
        const repGain = 5 + g.opponent.skill * 2;
        const silverGain = 20 + g.opponent.skill * 15;
        
        edS.exp = (edS.exp || 0) + expGain;
        edS.reputation = (edS.reputation || 0) + repGain;
        addSilver(silverGain);
        SilverManager.save();
        
        rewardHtml = `
            <div class="go-reward">
                <div class="go-reward-title">🏆 胜利奖励</div>
                <div>经验 +${expGain}</div>
                <div>声望 +${repGain}</div>
                <div>银两 +${silverGain}</div>
            </div>
        `;
    }
    
    // 输了或平局也给悟性
    if (g.winner !== 'b' && edS.playerAttributes?.wisdom) {
        edS.playerAttributes.wisdom = Math.min(100, edS.playerAttributes.wisdom + 1);
        rewardHtml += '<div class="go-reward">虽败犹荣，悟性+1</div>';
    }
    // 赢了也给悟性
    if (g.winner === 'b' && edS.playerAttributes?.wisdom) {
        edS.playerAttributes.wisdom = Math.min(100, edS.playerAttributes.wisdom + 1);
    }
    
    return `
        <div class="go-game-over">
            <div class="go-winner" style="color:${titleColor}">${titleText}</div>
            <div class="go-final-score">共 ${g.moveCount} 手</div>
            ${rewardHtml}
            <div class="go-game-over-controls">
                <button class="go-btn" onclick="goShowOpponentSelect()">再来一局</button>
                <button class="go-btn" onclick="goClose()">离开</button>
            </div>
        </div>
    `;
}

// ==================== 游戏逻辑 ====================
function goClickCell(x, y) {
    const g = goGameState;
    if (!g.isPlayerTurn || g.gameOver) return;
    if (g.currentPlayer !== 'b') return;
    if (g.board[y][x] !== null) return;
    
    // ═══════════════════════════════════════════════
    // 五子棋"将将胡"系统 - 神之一手
    // ═══════════════════════════════════════════════
    if(g.specialEvent === 'divine_move' && g.divineMoveAvailable){
        // 计算最佳位置
        const bestMove = goFindBestMove();
        if(bestMove && (bestMove.x !== x || bestMove.y !== y)){
            // 玩家点的不是最佳位置，但神之一手会引导到最佳位置
            x = bestMove.x;
            y = bestMove.y;
            showToast('✨ 神之一手引导你落在此处！', 'rare');
        }
        g.divineMoveAvailable = false;
    }
    
    // 落子
    g.board[y][x] = 'b';
    g.lastMove = { x, y };
    g.moveCount++;
    g.history.push({ x, y, player: 'b' });
    
    // 棋魂附体回合递减
    if(g.specialEvent === 'possession' && g.possessionTurns > 0){
        g.possessionTurns--;
        if(g.possessionTurns === 0){
            showToast('棋魂附体效果消退', 'info');
        }
    }
    
    // 音效
    if (typeof SoundFX !== 'undefined') SoundFX.play('place_stone');
    
    // 检查胜负
    const win = goCheckWin(x, y, 'b');
    if (win) {
        g.gameOver = true;
        g.winner = 'b';
        g.winLine = win;
        goRender();
        return;
    }
    
    // 平局
    if (g.moveCount >= 225) {
        g.gameOver = true;
        g.winner = 'draw';
        goRender();
        return;
    }
    
    // 切换到AI
    g.currentPlayer = 'w';
    g.isPlayerTurn = false;
    goRender();
}

// 寻找最佳落子位置（用于神之一手）
function goFindBestMove() {
    const g = goGameState;
    const empties = [];
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 15; x++) {
            if (g.board[y][x] === null && goHasNeighbor(x, y, 2)) {
                empties.push({ x, y });
            }
        }
    }
    if (empties.length === 0) return null;
    
    let bestScore = -1;
    let bestMoves = [];
    const ai = 'b', human = 'w';
    
    for (const p of empties) {
        const atk = goEvalPoint(p.x, p.y, ai);
        const def = goEvalPoint(p.x, p.y, human);
        const total = goScoreCombine(atk, def);
        
        if (total > bestScore) {
            bestScore = total;
            bestMoves = [p];
        } else if (total === bestScore) {
            bestMoves.push(p);
        }
    }
    
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function goResign() {
    const g = goGameState;
    if (g.gameOver) return;
    if (!confirm('确定要认输吗？')) return;
    g.gameOver = true;
    g.winner = 'w';
    goRender();
}

function goClose() {
    const g = goGameState;
    if (!g.gameOver && g.history.length > 0) {
        if (!confirm('棋局尚未结束，确定要离开吗？')) return;
    }
    g._aiScheduled = false;
    closeDialog();
}

// ==================== 五子胜负判定 ====================
function goCheckWin(x, y, player) {
    // 四个方向：横、竖、左斜、右斜
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    
    for (const [dx, dy] of dirs) {
        const line = [[x, y]];
        
        // 正方向
        for (let i = 1; i < 5; i++) {
            const nx = x + dx * i, ny = y + dy * i;
            if (nx < 0 || nx >= 15 || ny < 0 || ny >= 15) break;
            if (goGameState.board[ny][nx] !== player) break;
            line.push([nx, ny]);
        }
        
        // 反方向
        for (let i = 1; i < 5; i++) {
            const nx = x - dx * i, ny = y - dy * i;
            if (nx < 0 || nx >= 15 || ny < 0 || ny >= 15) break;
            if (goGameState.board[ny][nx] !== player) break;
            line.push([nx, ny]);
        }
        
        if (line.length >= 5) return line;
    }
    
    return null;
}

// ==================== AI系统 ====================
function goAIThink() {
    const g = goGameState;
    
    // 守卫
    if (g.gameOver || g.isPlayerTurn) {
        g._aiScheduled = false;
        return;
    }
    
    g._aiScheduled = false;
    
    // 先渲染"思考中"状态
    goRender();
    
    // 延迟后实际落子（期间用户可能关闭弹窗，再次检查）
    setTimeout(() => {
        if (g.gameOver || g.isPlayerTurn) return;
        
        const move = goGenerateAIMove();
        
        if (move) {
            g.board[move.y][move.x] = 'w';
            g.lastMove = { x: move.x, y: move.y };
            g.moveCount++;
            g.history.push({ x: move.x, y: move.y, player: 'w' });
            
            const win = goCheckWin(move.x, move.y, 'w');
            if (win) {
                g.gameOver = true;
                g.winner = 'w';
                g.winLine = win;
                goRender();
                return;
            }
        }
        
        // 平局
        if (g.moveCount >= 225) {
            g.gameOver = true;
            g.winner = 'draw';
            goRender();
            return;
        }
        
        // 切换回合
        g.currentPlayer = 'b';
        g.isPlayerTurn = true;
        goRender();
    }, 600 + Math.random() * 600);
}

function goGenerateAIMove() {
    const aiType = goGameState.opponent.ai;
    const g = goGameState;
    
    // ═══════════════════════════════════════════════
    // 五子棋"将将胡"系统 - 昏招
    // ═══════════════════════════════════════════════
    if(g.specialEvent === 'blunder' && Math.random() < g.blunderChance){
        // AI下昏招：随机选择一个非最优位置
        const empties = [];
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                if (g.board[y][x] === null && goHasNeighbor(x, y, 3)) {
                    empties.push({ x, y });
                }
            }
        }
        if (empties.length > 0) {
            const blunderMove = empties[Math.floor(Math.random() * empties.length)];
            showToast('😵 对手昏招！错失良机！', 'rare');
            return blunderMove;
        }
    }
    
    // ═══════════════════════════════════════════════
    // 五子棋"将将胡"恶搞 - 咖啡效果
    // ═══════════════════════════════════════════════
    if(g.coffeeEffect){
        g.coffeeEffect = false;
        // AI必定下昏招
        const empties = [];
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                if (g.board[y][x] === null) {
                    empties.push({ x, y });
                }
            }
        }
        if (empties.length > 0) {
            const coffeeMove = empties[Math.floor(Math.random() * empties.length)];
            showToast('☕ 咖啡影响！对手手抖下错位置！', 'rare');
            return coffeeMove;
        }
    }
    
    // 获取所有空位
    const empties = [];
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 15; x++) {
            if (g.board[y][x] === null) {
                empties.push({ x, y });
            }
        }
    }
    
    if (empties.length === 0) return null;
    
    // 第一手下天元附近
    if (g.moveCount === 0) {
        const center = 7;
        // 天元或周围随机
        const offsets = [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
        const pick = offsets[Math.floor(Math.random() * offsets.length)];
        return { x: center + pick[0], y: center + pick[1] };
    }
    
    // 过滤出已有棋子附近的空位（减少搜索范围）
    const candidates = empties.filter(p => goHasNeighbor(p.x, p.y, 2));
    const pool = candidates.length > 0 ? candidates : empties;
    
    if (aiType === 'random') {
        return goAIRandom(pool);
    } else if (aiType === 'basic') {
        return goAIBasic(pool);
    } else if (aiType === 'advanced') {
        return goAIAdvanced(pool);
    } else {
        // expert: 进阶AI + 两步前瞻
        return goAIExpert(pool);
    }
}

// 检查附近是否有棋子（distance格内）
function goHasNeighbor(x, y, dist) {
    const g = goGameState;
    for (let dy = -dist; dy <= dist; dy++) {
        for (let dx = -dist; dx <= dist; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < 15 && ny >= 0 && ny < 15 && g.board[ny][nx] !== null) {
                return true;
            }
        }
    }
    return false;
}

// ==================== AI 评估系统 ====================

/**
 * 分析某方向上的棋型（模拟player在x,y落子后）
 * 返回 { count, openEnds, space } — 连子数、开放端数、跳子后的空间
 */
function goAnalyzeDir(x, y, player, dx, dy) {
    const g = goGameState;
    let count = 1;       // 包含(x,y)本身
    let openEnds = 0;    // 0/1/2 开放端
    let jumpCount = 0;   // 跳子后的连子数（如 X_XX）

    // 正方向扫描
    let posBlocked = false;
    for (let i = 1; i <= 5; i++) {
        const nx = x + dx * i, ny = y + dy * i;
        if (nx < 0 || nx >= 15 || ny < 0 || ny >= 15) { posBlocked = true; break; }
        const c = g.board[ny][nx];
        if (c === player) {
            count++;
        } else if (c === null) {
            openEnds++;
            // 继续看跳子：空格后面还有没有己方棋子
            if (i <= 2) { // 只看跳一格
                const nx2 = x + dx * (i + 1), ny2 = y + dy * (i + 1);
                if (nx2 >= 0 && nx2 < 15 && ny2 >= 0 && ny2 < 15 && g.board[ny2][nx2] === player) {
                    jumpCount = 1;
                    for (let j = i + 2; j <= 5; j++) {
                        const nx3 = x + dx * j, ny3 = y + dy * j;
                        if (nx3 < 0 || nx3 >= 15 || ny3 < 0 || ny3 >= 15) break;
                        if (g.board[ny3][nx3] === player) jumpCount++;
                        else break;
                    }
                }
            }
            break;
        } else {
            posBlocked = true;
            break;
        }
    }

    // 反方向扫描
    let negBlocked = false;
    for (let i = 1; i <= 5; i++) {
        const nx = x - dx * i, ny = y - dy * i;
        if (nx < 0 || nx >= 15 || ny < 0 || ny >= 15) { negBlocked = true; break; }
        const c = g.board[ny][nx];
        if (c === player) {
            count++;
        } else if (c === null) {
            openEnds++;
            break;
        } else {
            negBlocked = true;
            break;
        }
    }

    return { count, openEnds, posBlocked, negBlocked, jumpCount };
}

/**
 * 评估某位置对某方的价值（假设player在此处落子）
 * 不修改棋盘，纯分析
 */
function goEvalPoint(x, y, player) {
    const g = goGameState;
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    let score = 0;
    let fours = 0;       // 冲四/活四数量
    let liveThrees = 0;  // 活三数量

    for (const [dx, dy] of dirs) {
        const { count, openEnds, jumpCount } = goAnalyzeDir(x, y, player, dx, dy);
        const total = count + jumpCount; // 跳子也算连子潜力

        if (count >= 5) {
            score += 1000000;  // 成五，必杀
        } else if (count === 4) {
            if (openEnds >= 1) {
                score += 50000;  // 冲四（至少一端开放就能成五）
                fours++;
            }
            // 两端封死=死四，无分
        } else if (count === 3) {
            if (openEnds === 2) {
                score += 5000;   // 活三（两端开放，下一步可变活四）
                liveThrees++;
            } else if (openEnds === 1) {
                score += 200;    // 眠三
            }
        } else if (count === 2) {
            if (openEnds === 2) {
                score += 150;    // 活二
            } else if (openEnds === 1) {
                score += 15;     // 眠二
            }
        } else if (count === 1) {
            if (openEnds === 2) score += 10;
            else if (openEnds === 1) score += 2;
        }

        // 跳子加分（如 X_XX → 跳活三/跳冲四）
        if (jumpCount >= 1 && count + jumpCount >= 3 && openEnds >= 1) {
            if (count + jumpCount >= 4) {
                score += 3000;  // 跳冲四
                fours++;
            } else {
                score += 800;   // 跳活三
                liveThrees++;
            }
        }
    }

    // 组合威胁加分
    if (fours >= 2) score += 80000;       // 双四（必杀）
    if (fours >= 1 && liveThrees >= 1) score += 60000;  // 四三（必杀）
    if (liveThrees >= 2) score += 40000;  // 双活三（几乎必杀）

    return score;
}

/**
 * 评估位置的综合得分（攻防一体）
 * @param {number} attackScore - AI进攻得分
 * @param {number} defendScore - 防守得分（堵对方）
 */
function goScoreCombine(attack, defend) {
    // 进攻优先，但防守权重也不低
    // 关键：对方有杀棋时防守分数会被拉高，自然堵
    if (attack >= 1000000) return attack * 2;    // 自己能成五，最高优先
    if (defend >= 1000000) return defend * 1.9;  // 堵对方成五
    if (attack >= 80000) return attack * 1.8;    // 自己组合杀
    if (defend >= 80000) return defend * 1.7;    // 堵对方组合杀
    if (attack >= 50000) return attack * 1.5;    // 自己冲四
    if (defend >= 50000) return defend * 1.4;    // 堵对方冲四
    return attack * 1.05 + defend;
}

// 随机AI
function goAIRandom(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
}

// 基础AI：能赢就赢，防对方赢，否则评分
function goAIBasic(pool) {
    const g = goGameState;
    const ai = 'w', human = 'b';

    // 1. AI能成五？
    for (const p of pool) {
        g.board[p.y][p.x] = ai;
        const win = goCheckWin(p.x, p.y, ai);
        g.board[p.y][p.x] = null;
        if (win) return p;
    }

    // 2. 堵对方成五？
    for (const p of pool) {
        g.board[p.y][p.x] = human;
        const win = goCheckWin(p.x, p.y, human);
        g.board[p.y][p.x] = null;
        if (win) return p;
    }

    // 3. 评分选择（基础AI进攻权重低，更容易防守漏人）
    let bestScore = -1;
    let bestMoves = [];

    for (const p of pool) {
        const atk = goEvalPoint(p.x, p.y, ai);
        const def = goEvalPoint(p.x, p.y, human);
        const total = atk * 0.8 + def;  // 基础AI进攻打折，偏向防守

        if (total > bestScore) {
            bestScore = total;
            bestMoves = [p];
        } else if (total === bestScore) {
            bestMoves.push(p);
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

// 进阶AI：评分选择最优位置（攻守兼备）
function goAIAdvanced(pool) {
    const g = goGameState;
    const ai = 'w', human = 'b';

    // 1. AI能成五？
    for (const p of pool) {
        g.board[p.y][p.x] = ai;
        const win = goCheckWin(p.x, p.y, ai);
        g.board[p.y][p.x] = null;
        if (win) return p;
    }

    // 2. 堵对方成五？
    for (const p of pool) {
        g.board[p.y][p.x] = human;
        const win = goCheckWin(p.x, p.y, human);
        g.board[p.y][p.x] = null;
        if (win) return p;
    }

    // 3. 评分选择（进阶AI攻守均衡）
    let bestScore = -1;
    let bestMoves = [];

    for (const p of pool) {
        const atk = goEvalPoint(p.x, p.y, ai);
        const def = goEvalPoint(p.x, p.y, human);
        const total = goScoreCombine(atk, def);

        if (total > bestScore) {
            bestScore = total;
            bestMoves = [p];
        } else if (total === bestScore) {
            bestMoves.push(p);
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

// 专家AI：进阶评分 + 两步前瞻（找必杀棋）
function goAIExpert(pool) {
    const g = goGameState;
    const ai = 'w', human = 'b';

    // 1. AI能成五？
    for (const p of pool) {
        g.board[p.y][p.x] = ai;
        const win = goCheckWin(p.x, p.y, ai);
        g.board[p.y][p.x] = null;
        if (win) return p;
    }

    // 2. 堵对方成五？
    for (const p of pool) {
        g.board[p.y][p.x] = human;
        const win = goCheckWin(p.x, p.y, human);
        g.board[p.y][p.x] = null;
        if (win) return p;
    }

    // 3. 两步前瞻：AI走一步后，下一步能否必杀？
    let forcedWinMove = null;
    for (const p of pool) {
        g.board[p.y][p.x] = ai;
        const atkAfterFirst = goEvalPoint_forced(p.x, p.y, ai);
        if (atkAfterFirst >= 80000) {
            if (goIsForcedWin(p, ai, human)) {
                g.board[p.y][p.x] = null;
                forcedWinMove = p;
                break;
            }
        }
        g.board[p.y][p.x] = null;
    }
    if (forcedWinMove) return forcedWinMove;

    // 4. 评分选择（进阶评分 + 中心位置微调）
    let bestScore = -1;
    let bestMoves = [];

    for (const p of pool) {
        const atk = goEvalPoint(p.x, p.y, ai);
        const def = goEvalPoint(p.x, p.y, human);
        const total = goScoreCombine(atk, def);

        // 中心位置微调（同等分数时偏好中心）
        const centerBonus = (7 - Math.abs(p.x - 7)) + (7 - Math.abs(p.y - 7));
        const finalScore = total * 10 + centerBonus;

        if (finalScore > bestScore) {
            bestScore = finalScore;
            bestMoves = [p];
        } else if (finalScore === bestScore) {
            bestMoves.push(p);
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

// 评估某位置对某方的威胁等级（仅用于expert前瞻）
function goEvalPoint_forced(x, y, player) {
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    let fours = 0, liveThrees = 0;
    for (const [dx, dy] of dirs) {
        const { count, openEnds } = goAnalyzeDir(x, y, player, dx, dy);
        if (count >= 5) return 1000000;
        if (count === 4 && openEnds >= 1) fours++;
        if (count === 3 && openEnds === 2) liveThrees++;
    }
    if (fours >= 2) return 80000;
    if (fours >= 1 && liveThrees >= 1) return 60000;
    if (liveThrees >= 2) return 40000;
    return 0;
}

// 验证AI在firstMove落子后，是否形成对方无法同时防守的必杀局面
function goIsForcedWin(firstMove, ai, human) {
    const g = goGameState;
    const winPoints = [];
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 15; x++) {
            if (g.board[y][x] !== null) continue;
            g.board[y][x] = ai;
            if (goCheckWin(x, y, ai)) winPoints.push({ x, y });
            g.board[y][x] = null;
        }
    }
    return winPoints.length >= 2;
}

// ==================== CSS样式 ====================
const goStyles = `
    <style>
        .go-container {
            font-family: 'Microsoft YaHei', sans-serif;
            color: #e0d5c7;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            padding: 10px;
            border-radius: 10px;
            border: 2px solid #8b7355;
            box-shadow: 0 0 20px rgba(139, 115, 85, 0.3);
            overflow: hidden;
            max-height: 100%;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .go-container::-webkit-scrollbar { display: none; }
        
        .go-header { text-align: center; margin-bottom: 8px; }
        
        .go-banner {
            font-size: 18px;
            font-weight: bold;
            color: #d4af37;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        
        .go-opponent-info {
            text-align: center;
            margin-bottom: 8px;
            padding: 6px 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
        }
        .go-opponent-name { font-size: 14px; font-weight: bold; color: #d4af37; }
        .go-opponent-level { font-size: 12px; color: #b0a090; }
        
        .go-board-container {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        
        .go-board {
            background: #deb887;
            padding: 6px;
            border-radius: 5px;
            border: 2px solid #8b4513;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
            flex-shrink: 0;
        }
        
        .go-coords {
            font-family: monospace;
            font-size: 10px;
            color: #333;
        }
        
        .go-row { display: flex; }
        
        .go-corner, .go-coord-col, .go-coord-row {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #5d4037;
            font-weight: bold;
        }
        
        .go-cell {
            background: #deb887;
            border: 1px solid #c4a265;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.15s;
            box-sizing: border-box;
            user-select: none;
        }
        .go-cell:hover { background: rgba(139, 115, 85, 0.35); }
        
        .go-cell.go-last-move {
            background: rgba(255, 215, 0, 0.3);
            box-shadow: 0 0 4px rgba(255, 215, 0, 0.5);
        }
        .go-cell.go-win-cell {
            background: rgba(255, 50, 50, 0.35);
            box-shadow: 0 0 6px rgba(255, 50, 50, 0.6);
        }
        
        .go-sidebar {
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 120px;
            max-width: 180px;
        }
        
        .go-current-player {
            padding: 6px 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            text-align: center;
            font-size: 13px;
            font-weight: bold;
        }
        
        .go-score {
            padding: 6px 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            font-size: 12px;
            line-height: 1.5;
        }
        
        .go-rules {
            padding: 6px 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            font-size: 11px;
            line-height: 1.3;
        }
        .go-rule-title { font-weight: bold; color: #d4af37; margin-bottom: 3px; }
        .go-rule { color: #b0a090; margin-bottom: 1px; }
        
        .go-controls { display: flex; gap: 6px; }
        
        .go-btn {
            flex: 1;
            padding: 7px 8px;
            background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
            color: #e0d5c7;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.2s;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            white-space: nowrap;
        }
        .go-btn:hover {
            background: linear-gradient(135deg, #a0522d 0%, #8b4513 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        }
        .go-btn:disabled {
            background: #555;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .go-game-over {
            margin-top: 10px;
            padding: 12px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            text-align: center;
            border: 2px solid #d4af37;
        }
        .go-winner {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 6px;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .go-final-score {
            font-size: 14px;
            color: #e0d5c7;
            margin-bottom: 8px;
        }
        .go-reward {
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border: 1px solid #d4af37;
            border-radius: 5px;
            padding: 10px;
            margin: 8px 0;
        }
        .go-reward-title {
            font-size: 14px;
            font-weight: bold;
            color: #d4af37;
            margin-bottom: 6px;
        }
        .go-reward > div {
            margin-bottom: 3px;
            color: #e0d5c7;
            font-size: 12px;
        }
        .go-game-over-controls {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-top: 8px;
        }

        /* 对手选择卡片 */
        .go-opp-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 4px 0;
        }
        .go-opp-card {
            background: rgba(0, 0, 0, 0.4);
            border: 2px solid #555;
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }
        .go-opp-card:hover {
            border-color: #d4af37;
            background: rgba(212, 175, 55, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
        }
        .go-opp-locked {
            cursor: not-allowed;
            border-color: #444;
        }
        .go-opp-name {
            font-size: 14px;
            font-weight: bold;
            color: #d4af37;
            margin-bottom: 3px;
        }
        .go-opp-stars {
            font-size: 11px;
            color: #d4af37;
            margin-bottom: 2px;
            letter-spacing: 1px;
        }
        .go-opp-loc {
            font-size: 11px;
            color: #b0a090;
            margin-bottom: 2px;
        }
        .go-opp-desc {
            font-size: 11px;
            color: #999;
            line-height: 1.3;
        }

        @media (max-width: 600px) {
            .go-opp-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 6px;
            }
            .go-opp-card { padding: 8px; }
            .go-opp-name { font-size: 13px; }
            .go-board-container {
                flex-direction: column;
                align-items: center;
            }
            .go-sidebar {
                width: 100%;
                max-width: none;
                flex-direction: row;
                flex-wrap: wrap;
            }
            .go-sidebar > * { flex: 1 1 auto; min-width: 80px; }
            .go-controls { flex-wrap: wrap; }
            .go-btn { font-size: 13px; padding: 8px 12px; }
            .go-hide-mobile { display: none; }
        }
    </style>
`;

// 注入样式
if (!document.getElementById('go-styles')) {
    const el = document.createElement('div');
    el.id = 'go-styles';
    el.innerHTML = goStyles;
    document.head.appendChild(el);
}

// ═══════════════════════════════════════════════
// 五子棋"将将胡"恶搞事件处理函数
// ═══════════════════════════════════════════════

// 猫打翻棋盘效果：随机移动一些棋子
function goApplyCatChaos() {
    const g = goGameState;
    const stones = [];
    // 收集所有棋子
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 15; x++) {
            if (g.board[y][x] !== null) {
                stones.push({ x, y, player: g.board[y][x] });
                g.board[y][x] = null;
            }
        }
    }
    // 随机重新放置（保持原有棋子数量）
    for (const stone of stones) {
        let attempts = 0;
        while (attempts < 50) {
            const nx = Math.floor(Math.random() * 15);
            const ny = Math.floor(Math.random() * 15);
            if (g.board[ny][nx] === null) {
                g.board[ny][nx] = stone.player;
                break;
            }
            attempts++;
        }
    }
}

// 大风效果：随机移除1-3个棋子
function goApplyWindEffect() {
    const g = goGameState;
    const stones = [];
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 15; x++) {
            if (g.board[y][x] !== null) {
                stones.push({ x, y });
            }
        }
    }
    // 随机移除1-3个
    const removeCount = Math.min(stones.length, 1 + Math.floor(Math.random() * 3));
    for (let i = 0; i < removeCount; i++) {
        if (stones.length === 0) break;
        const idx = Math.floor(Math.random() * stones.length);
        const stone = stones.splice(idx, 1)[0];
        g.board[stone.y][stone.x] = null;
    }
}

// ==================== 工具函数 ====================
function showBanner(title, message, type) {
    if (typeof showGameBanner === 'function') showGameBanner(title, message, type);
    else alert(`${title}: ${message}`);
}

function showDialog(config) {
    if (typeof showGameDialog === 'function') showGameDialog(config);
    else alert(config.content);
}

function closeDialog() {
    if (typeof closeGameDialog === 'function') closeGameDialog();
}

// 棋社对弈（五子棋）系统已加载
