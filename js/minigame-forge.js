/**
 * 打铁锻造小游戏
 * minigame-forge.js v1.0
 * 
 * QTE节奏游戏，打造/强化装备
 */

let forgeState = {
    mode: 'forge', // 'forge' | 'upgrade'
    currentWeapon: null,
    isForging: false,
    
    // QTE状态
    cursorPos: 0,
    cursorSpeed: 3,
    targets: [],
    hits: [],
    perfectZones: [],
    
    // 锻造结果
    quality: null,
    successCount: 0,
    totalStrikes: 0,
    
    // 动画
    animation: null,
    sparks: []
};

// ==================== 武器模板 ====================
const WEAPON_TEMPLATES = [
    {
        id: 'iron_sword',
        name: '铁剑',
        icon: '⚔️',
        type: 'sword',
        tier: 'common',
        materials: { iron_ore: 3, wood: 1 },
        baseStats: { attack: 15, durability: 100 }
    },
    {
        id: 'steel_sword',
        name: '钢剑',
        icon: '⚔️',
        rarity: 'uncommon',
        type: 'sword',
        tier: 'uncommon',
        materials: { iron_ore: 5, coal: 2, leather: 1 },
        baseStats: { attack: 25, durability: 150 }
    },
    {
        id: 'dagger',
        name: '匕首',
        icon: '🗡️',
        type: 'dagger',
        tier: 'common',
        materials: { iron_ore: 2, wood: 1 },
        baseStats: { attack: 10, crit_chance: 5, durability: 80 }
    },
    {
        id: 'spear',
        name: '长枪',
        icon: '🔱',
        type: 'spear',
        tier: 'common',
        materials: { iron_ore: 2, wood: 3 },
        baseStats: { attack: 20, range: 2, durability: 120 }
    },
    {
        id: 'battle_axe',
        name: '战斧',
        icon: '🪓',
        type: 'axe',
        tier: 'uncommon',
        materials: { iron_ore: 6, wood: 2, leather: 2 },
        baseStats: { attack: 35, durability: 180 }
    },
    {
        id: 'war_hammer',
        name: '战锤',
        icon: '🔨',
        type: 'hammer',
        tier: 'uncommon',
        materials: { iron_ore: 8, wood: 1, leather: 1 },
        baseStats: { attack: 40, stun_chance: 15, durability: 200 }
    }
];

// ==================== 初始化 ====================
function openForge(cityId) {
    if (!cityId) {
        console.error('openForge: cityId is required');
        return;
    }
    
    // 获取当前城市
    const worldData = getWorldData();
    const city = worldData[cityId];
    if (!city) {
        console.error('openForge: city not found:', cityId);
        return;
    }
    
    // 初始化状态
    forgeState.mode = 'forge';
    forgeState.currentWeapon = null;
    forgeState.isForging = false;
    forgeState.quality = null;
    
    // 渲染界面
    forgeRender();
}

// ==================== 界面渲染 ====================
function forgeRender() {
    const html = `
        <div class="forge-container">
            <div class="forge-header">
                <div class="forge-banner">🔨 铁匠铺 · 神兵锻造 🔨</div>
                <div class="forge-subtitle">千锤百炼，方成绝世神兵</div>
            </div>
            
            <div class="forge-mode-tabs">
                <button class="forge-tab ${forgeState.mode === 'forge' ? 'active' : ''}" 
                        onclick="forgeSetMode('forge')">
                    ⚔️ 打造兵器
                </button>
                <button class="forge-tab ${forgeState.mode === 'upgrade' ? 'active' : ''}" 
                        onclick="forgeSetMode('upgrade')">
                    ⬆️ 强化装备
                </button>
            </div>
            
            ${forgeState.mode === 'forge' ? forgeRenderForge() : forgeRenderUpgrade()}
        </div>
    `;
    
    showDialog({
        title: '铁匠铺 - 神兵锻造',
        content: html,
        width: 900,
        height: 650,
        onClose: () => {
            forgeStopForging();
        }
    });
}

function forgeSetMode(mode) {
    forgeState.mode = mode;
    forgeStopForging();
    forgeRender();
}

// ==================== 打造界面 ====================
function forgeRenderForge() {
    return `
        <div class="forge-forge">
            <div class="forge-weapon-list">
                <div class="forge-list-title">可打造兵器</div>
                <div class="forge-weapons">
                    ${WEAPON_TEMPLATES.map(weapon => {
                        const canForge = forgeCanForge(weapon);
                        return `
                            <div class="forge-weapon-card ${forgeState.currentWeapon === weapon.id ? 'selected' : ''} ${!canForge ? 'disabled' : ''}"
                                 onclick="forgeSelectWeapon('${weapon.id}')">
                                <div class="forge-weapon-header">
                                    <div class="forge-weapon-icon">${weapon.icon}</div>
                                    <div class="forge-weapon-name">${weapon.name}</div>
                                    <div class="forge-weapon-tier ${weapon.tier}">${forgeGetTierName(weapon.tier)}</div>
                                </div>
                                <div class="forge-weapon-stats">
                                    ${Object.entries(weapon.baseStats).map(([stat, value]) => 
                                        `<div class="forge-stat">${forgeGetStatName(stat)}: +${value}</div>`
                                    ).join('')}
                                </div>
                                <div class="forge-materials">
                                    ${Object.entries(weapon.materials).map(([matId, amount]) => {
                                        const hasAmount = forgeGetMaterialCount(matId);
                                        return `<div class="forge-material ${hasAmount >= amount ? '' : 'missing'}">
                                            ${forgeGetMaterialIcon(matId)} ${forgeGetMaterialName(matId)}: ${hasAmount}/${amount}
                                        </div>`;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div class="forge-forge-panel">
                ${forgeState.currentWeapon && !forgeState.isForging ? `
                    <div class="forge-selected-weapon">
                        ${forgeRenderForgeInterface()}
                    </div>
                ` : forgeState.isForging ? `
                    <div class="forge-forging-interface">
                        ${forgeRenderForgingInterface()}
                    </div>
                ` : '<div class="forge-no-weapon">请选择要打造的兵器</div>'}
                
                <div class="forge-inventory">
                    <div class="forge-inventory-title">材料背包</div>
                    <div class="forge-inventory-grid">
                        ${forgeRenderMaterialBag()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function forgeRenderForgeInterface() {
    const weapon = WEAPON_TEMPLATES.find(w => w.id === forgeState.currentWeapon);
    if (!weapon) return '';
    
    return `
        <div class="forge-weapon-detail">
            <div class="forge-weapon-icon-large">${weapon.icon}</div>
            <div class="forge-weapon-info">
                <div class="forge-weapon-name-large">${weapon.name}</div>
                <div class="forge-weapon-tier-large ${weapon.tier}">${forgeGetTierName(weapon.tier)}</div>
            </div>
        </div>
        
        <div class="forge-preview">
            <div class="forge-preview-title">兵器预览</div>
            <div class="forge-preview-stats">
                ${Object.entries(weapon.baseStats).map(([stat, value]) => 
                    `<div class="forge-preview-stat">${forgeGetStatName(stat)}: +${value}</div>`
                ).join('')}
            </div>
        </div>
        
        <div class="forge-material-cost">
            <div class="forge-cost-title">所需材料</div>
            <div class="forge-cost-list">
                ${Object.entries(weapon.materials).map(([matId, amount]) => {
                    const hasAmount = forgeGetMaterialCount(matId);
                    return `<div class="forge-cost-item ${hasAmount >= amount ? '' : 'missing'}">
                        ${forgeGetMaterialIcon(matId)} ${forgeGetMaterialName(matId)} × ${amount}
                    </div>`;
                }).join('')}
            </div>
        </div>
        
        <div class="forge-controls">
            <div class="forge-quality-info">
                <div class="forge-quality-tip">🎯 锻造准确度决定兵器品质</div>
                <div class="forge-quality-levels">
                    <span class="forge-quality-common">普通</span> → 
                    <span class="forge-quality-uncommon">优质</span> → 
                    <span class="forge-quality-rare">完美</span> → 
                    <span class="forge-quality-legendary">传说</span>
                </div>
            </div>
            
            <button class="forge-start-btn ${forgeCanForge(WEAPON_TEMPLATES.find(w => w.id === forgeState.currentWeapon)) ? '' : 'disabled'}" 
                    onclick="forgeStartForging()" 
                    ${forgeCanForge(WEAPON_TEMPLATES.find(w => w.id === forgeState.currentWeapon)) ? '' : 'disabled'}>
                ${forgeCanForge(WEAPON_TEMPLATES.find(w => w.id === forgeState.currentWeapon)) ? '🔨 开始锻造' : '材料不足'}
            </button>
        </div>
    `;
}

function forgeRenderForgingInterface() {
    return `
        <div class="forge-anvil-scene">
            <div class="forge-anvil-visual">
                <div class="forge-anvil">🔥 🔥 🔥</div>
                <div class="forge-anvil-base">
                    ⚫⚫⚫⚫⚫
                    ⚫🔨🔨🔨⚫
                    ⚫🔨⬜🔨⚫
                    ⚫🔨🔨🔨⚫
                    ⚫⚫⚫⚫⚫
                </div>
                <div class="forge-sparks" id="forge-sparks">
                    ${forgeState.sparks.map(spark => 
                        `<div class="forge-spark" style="left: ${spark.x}%; top: ${spark.y}%; animation-delay: ${spark.delay}s;">✨</div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="forge-qte-bar">
                <div class="forge-qte-track">
                    <div class="forge-perfect-zones">
                        ${forgeState.perfectZones.map((zone, i) => 
                            `<div class="forge-perfect-zone" style="left: ${zone.start}%; width: ${zone.width}%"></div>`
                        ).join('')}
                    </div>
                    <div class="forge-target-zones">
                        ${forgeState.targets.map((target, i) => 
                            `<div class="forge-target-zone" style="left: ${target}%;" id="target-${i}"></div>`
                        ).join('')}
                    </div>
                    <div class="forge-cursor" id="forge-cursor" style="left: ${forgeState.cursorPos}%"></div>
                </div>
                <div class="forge-qte-controls">
                    <div class="forge-instruction">🎯 按 空格键 在目标区域敲击！</div>
                    <div class="forge-progress">
                        进度: ${forgeState.successCount}/${forgeState.totalStrikes} 次完美敲击
                    </div>
                </div>
            </div>
            
            <div class="forge-forging-controls">
                <button class="forge-stop-btn" onclick="forgeStopForging()">停止锻造</button>
            </div>
        </div>
    `;
}

// ==================== 强化界面 ====================
function forgeRenderUpgrade() {
    return `
        <div class="forge-upgrade">
            <div class="forge-upgrade-info">
                <div class="forge-upgrade-title">强化装备</div>
                <div class="forge-upgrade-desc">🔥 千锤百炼，提升装备属性 🔥</div>
                <div class="forge-upgrade-tip">选择要强化的装备（开发中）</div>
            </div>
            
            <div class="forge-upgrade-preview">
                <div class="forge-preview-item">
                    <div class="forge-item-icon">⚔️</div>
                    <div class="forge-item-info">
                        <div class="forge-item-name">铁剑 +0</div>
                        <div class="forge-item-stats">
                            <div class="forge-stat">攻击: +15</div>
                        </div>
                    </div>
                </div>
                
                <div class="forge-upgrade-arrow">⬇️</div>
                
                <div class="forge-preview-item">
                    <div class="forge-item-icon">⚔️</div>
                    <div class="forge-item-info">
                        <div class="forge-item-name">铁剑 +1</div>
                        <div class="forge-item-stats">
                            <div class="forge-stat">攻击: +18 (+3)</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="forge-upgrade-cost">
                <div class="forge-cost-title">强化费用</div>
                <div class="forge-cost-list">
                    <div class="forge-cost-item">💰 银两: 100</div>
                    <div class="forge-cost-item">⚫ 铁矿: ×2</div>
                    <div class="forge-cost-item">🔥 煤炭: ×1</div>
                </div>
            </div>
            
            <div class="forge-upgrade-controls">
                <button class="forge-upgrade-btn disabled">开始强化（开发中）</button>
            </div>
            
            <div class="forge-upgrade-note">
                💡 强化有成功率，失败可能降级或损坏装备
            </div>
        </div>
    `;
}

// ==================== 锻造逻辑 ====================
function forgeSelectWeapon(weaponId) {
    if (forgeState.isForging) return;
    
    forgeState.currentWeapon = weaponId;
    forgeRender();
}

function forgeCanForge(weapon) {
    for (const [matId, amount] of Object.entries(weapon.materials)) {
        const hasAmount = forgeGetMaterialCount(matId);
        if (hasAmount < amount) return false;
    }
    return true;
}

function forgeStartForging() {
    if (!forgeState.currentWeapon || forgeState.isForging) return;
    
    const weapon = WEAPON_TEMPLATES.find(w => w.id === forgeState.currentWeapon);
    if (!forgeCanForge(weapon)) return;
    
    // 消耗材料
    for (const [matId, amount] of Object.entries(weapon.materials)) {
        forgeConsumeMaterial(matId, amount);
    }
    
    // 播放锻造开始音效
    if (typeof SoundFX !== 'undefined') {
        SoundFX.play('forge_start');
    }
    
    // 初始化QTE状态
    forgeState.isForging = true;
    forgeState.cursorPos = 0;
    forgeState.cursorSpeed = 3;
    forgeState.successCount = 0;
    forgeState.totalStrikes = 8; // 总共8次敲击
    forgeState.hits = [];
    forgeState.sparks = [];
    
    // 生成目标区域和完美区域
    forgeGenerateTargets();
    
    // 开始游戏循环
    forgeStartGameLoop();
    
    // 监听键盘事件
    document.addEventListener('keydown', forgeHandleKeyPress);
    
    forgeRender();
}

function forgeStopForging() {
    if (!forgeState.isForging) return;
    
    forgeState.isForging = false;
    forgeState.quality = null;
    forgeState.currentWeapon = null;
    
    if (forgeState.animation) {
        cancelAnimationFrame(forgeState.animation);
        forgeState.animation = null;
    }
    
    document.removeEventListener('keydown', forgeHandleKeyPress);
}

function forgeGenerateTargets() {
    forgeState.targets = [];
    forgeState.perfectZones = [];
    
    for (let i = 0; i < forgeState.totalStrikes; i++) {
        // 随机生成目标位置（10-90%之间）
        const targetPos = 15 + Math.random() * 70;
        forgeState.targets.push(targetPos);
        
        // 完美区域（目标位置±3%）
        forgeState.perfectZones.push({
            start: targetPos - 3,
            width: 6
        });
    }
}

function forgeStartGameLoop() {
    let lastTime = performance.now();
    
    function loop(now) {
        if (!forgeState.isForging) return;
        
        const delta = now - lastTime;
        if (delta >= 16) { // 约60fps
            lastTime = now;
            
            // 移动光标（根据时间差调整速度）
            forgeState.cursorPos += forgeState.cursorSpeed * (delta / 16);
            
            // 边界反弹
            if (forgeState.cursorPos >= 95 || forgeState.cursorPos <= 5) {
                forgeState.cursorSpeed = -forgeState.cursorSpeed;
            }
            
            // 更新光标位置
            const cursor = document.getElementById('forge-cursor');
            if (cursor) {
                cursor.style.left = forgeState.cursorPos + '%';
            }
            
            // 生成火花（降低频率）
            if (Math.random() < 0.1) {
                forgeState.sparks.push({
                    x: 30 + Math.random() * 40,
                    y: 60 + Math.random() * 20,
                    delay: Math.random() * 0.5
                });
                
                // 限制火花数量
                if (forgeState.sparks.length > 20) {
                    forgeState.sparks = forgeState.sparks.slice(-15);
                }
            }
        }
        
        forgeState.animation = requestAnimationFrame(loop);
    }
    
    forgeState.animation = requestAnimationFrame(loop);
}

function forgeHandleKeyPress(event) {
    if (!forgeState.isForging) return;
    
    if (event.code === 'Space') {
        event.preventDefault();
        forgeStrike();
    }
}

function forgeStrike() {
    const currentTarget = forgeState.targets[forgeState.hits.length];
    if (currentTarget === undefined) return;
    
    // 计算准确度
    const distance = Math.abs(forgeState.cursorPos - currentTarget);
    let accuracy = 'miss';
    
    if (distance <= 3) {
        accuracy = 'perfect'; // 完美（±3%）
        forgeState.successCount++;
    } else if (distance <= 8) {
        accuracy = 'good'; // 良好（±8%）
    } else if (distance <= 15) {
        accuracy = 'ok'; // 一般（±15%）
    }
    
    forgeState.hits.push({
        pos: forgeState.cursorPos,
        target: currentTarget,
        distance: distance,
        accuracy: accuracy
    });
    
    // 播放敲击音效
    if (typeof SoundFX !== 'undefined') {
        if (accuracy === 'perfect') {
            SoundFX.play('forge_perfect');
        } else {
            SoundFX.play('forge_hit');
        }
    }
    
    // 显示击中效果
    forgeShowHitEffect(accuracy);
    
    // 检查是否完成
    if (forgeState.hits.length >= forgeState.totalStrikes) {
        setTimeout(() => forgeCompleteForging(), 500);
    }
}

function forgeShowHitEffect(accuracy) {
    const colors = {
        perfect: '#ffd700',
        good: '#7cb97c',
        ok: '#a0b0a0',
        miss: '#ff7c7c'
    };
    
    showBanner('锻造', 
        accuracy === 'perfect' ? '⚡ 完美一击！' :
        accuracy === 'good' ? '✨ 精准命中！' :
        accuracy === 'ok' ? '💫 击中了！' : '❌ 偏离目标',
        accuracy === 'perfect' || accuracy === 'good' ? 'success' : 'warning'
    );
}

function forgeCompleteForging() {
    forgeStopForging();
    
    const perfectHits = forgeState.hits.filter(h => h.accuracy === 'perfect').length;
    const goodHits = forgeState.hits.filter(h => h.accuracy === 'good').length;
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"锻造系统：运气影响最终品质
    // ═══════════════════════════════════════════════════════════════
    // 基础品质判定
    let baseQuality;
    if (perfectHits >= 6) {
        baseQuality = 'legendary'; // 传说（6+完美）
    } else if (perfectHits >= 4 || perfectHits + goodHits >= 6) {
        baseQuality = 'rare'; // 完美（4完美 或 6优良）
    } else if (perfectHits >= 2 || perfectHits + goodHits >= 4) {
        baseQuality = 'uncommon'; // 优良（2完美 或 4优良）
    } else {
        baseQuality = 'common'; // 普通
    }
    
    // ═══════════════════════════════════════════════════════════════
    //  锻造"将将胡"系统扩展
    // ═══════════════════════════════════════════════════════════════
    const luckRoll = Math.random();
    let quality = baseQuality;
    let specialEvent = null;
    
    // 2%概率：神匠附体（无视打击质量，直接最高品质+特殊词条）
    if (luckRoll < 0.02) {
        quality = 'legendary';
        forgeState._specialEnchant = _rollForgeEnchant();
        specialEvent = 'god_smith';
        setTimeout(() => showBanner('🔥 神匠附体！', '冥冥之中有神助！传世之作诞生！', 'legendary'), 600);
    }
    // 3%概率：材料爆裂（材料额外消耗，但品质+2级）
    else if (luckRoll < 0.05) {
        const upgradeMap2 = { common: 'rare', uncommon: 'legendary', rare: 'legendary', legendary: 'legendary' };
        quality = upgradeMap2[baseQuality];
        specialEvent = 'material_burst';
        setTimeout(() => showBanner('💥 材料爆裂！', '材料在烈火中升华！品质暴涨！', 'rare'), 600);
    }
    // 5%概率大成功（品质+1）
    else if (luckRoll < 0.10) {
        const upgradeMap = { common: 'uncommon', uncommon: 'rare', rare: 'legendary', legendary: 'legendary' };
        quality = upgradeMap[baseQuality];
        specialEvent = 'great_success';
        setTimeout(() => showBanner('大成功！', '🔥 神来之笔！武器品质意外提升！', 'rare'), 600);
    }
    // 8%概率失败（品质-1，common直接碎）
    else if (luckRoll < 0.18 && perfectHits < 3) {
        const downgradeMap = { legendary: 'rare', rare: 'uncommon', uncommon: 'common', common: 'broken' };
        quality = downgradeMap[baseQuality];
        if (quality === 'broken') {
            setTimeout(() => {
                showBanner('锻造失败', '💔 武器在锻造过程中断裂了...', 'error');
                forgeShowBrokenResult();
            }, 600);
            return;
        }
        specialEvent = 'flaw';
        setTimeout(() => showBanner('锻造瑕疵', '⚠️ 火候掌握不当，品质有所下降', 'warning'), 600);
    }
    // 3%概率出现特殊词条
    else if (luckRoll > 0.92 && luckRoll <= 0.95) {
        forgeState._specialEnchant = _rollForgeEnchant();
        specialEvent = 'enchant';
        setTimeout(() => showBanner('特殊词条', `✨ 武器获得了特殊属性：${forgeState._specialEnchant.name}`, 'rare'), 600);
    }
    // 1%概率：传世之作（legendary品质+双词条+专属名字）
    else if (luckRoll > 0.98 && baseQuality === 'legendary') {
        quality = 'legendary';
        forgeState._specialEnchant = _rollForgeEnchant();
        forgeState._secondEnchant = _rollForgeEnchant();
        specialEvent = 'masterpiece';
        setTimeout(() => showBanner('🏆 传世之作！', '千锤百炼，名器出世！', 'legendary'), 600);
    }
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"锻造恶搞事件触发（5%总概率）
    // ═══════════════════════════════════════════════════════════════
    const gagRoll = Math.random();
    if (gagRoll < 0.05 && !specialEvent) {
        const gagEvents = ['singing_sword', 'hot_potato', 'talking_weapon', 'rainbow_metal', 
                          'shrinking_weapon', 'stinky_forge', 'lucky_hammer', 'chicken_weapon'];
        const selectedGag = gagEvents[Math.floor(Math.random() * gagEvents.length)];
        specialEvent = selectedGag;
        
        const gagMessages = {
            singing_sword: { title: '🎵 会唱歌的剑！', msg: '锻造时剑身发出"啦啦啦~"的奇怪歌声...', type: 'rare' },
            hot_potato: { title: '🥔 烫手山芋！', msg: '武器出炉时烫得你差点扔掉！但品质意外不错！', type: 'warning' },
            talking_weapon: { title: '💬 话痨武器！', msg: '这把武器一直在碎碎念："轻点用！"', type: 'rare' },
            rainbow_metal: { title: '🌈 彩虹金属！', msg: '金属变成了彩虹色，闪瞎了铁匠的眼！', type: 'rare' },
            shrinking_weapon: { title: '📏 缩水武器！', msg: '武器出炉后缩水了...但攻击力反而更高？', type: 'warning' },
            stinky_forge: { title: '💨 臭气熏天！', msg: '锻造产生了奇怪气味，方圆十里的人都在捂鼻子...', type: 'warning' },
            lucky_hammer: { title: '🍀 幸运锤击！', msg: '锤子飞出去却打出了完美一击！这就是运气！', type: 'rare' },
            chicken_weapon: { title: '🐔 鸡飞狗跳！', msg: '一只鸡飞进炉子，武器获得了"鸡鸣"特效！', type: 'rare' }
        };
        
        const gagMsg = gagMessages[selectedGag];
        setTimeout(() => showBanner(gagMsg.title, gagMsg.msg, gagMsg.type), 600);
        
        // 恶搞事件特殊效果
        if (selectedGag === 'singing_sword') {
            // 会唱歌的剑：魅力+5
            if (typeof edS !== 'undefined' && edS.playerAttributes) {
                edS.playerAttributes.charm = (edS.playerAttributes.charm || 50) + 5;
            }
        } else if (selectedGag === 'hot_potato') {
            // 烫手山芋：品质随机波动
            const qualities = ['common', 'uncommon', 'rare', 'legendary'];
            quality = qualities[Math.floor(Math.random() * qualities.length)];
        } else if (selectedGag === 'shrinking_weapon') {
            // 缩水武器：名字加"迷你"前缀，攻击+20%
            forgeState._shrinkingEffect = true;
        } else if (selectedGag === 'lucky_hammer') {
            // 幸运锤击：品质至少稀有
            if (quality === 'common' || quality === 'uncommon') quality = 'rare';
        } else if (selectedGag === 'chicken_weapon') {
            // 鸡飞狗跳：添加"鸡鸣"特效
            forgeState._chickenEffect = true;
        }
    }
    
    forgeState._specialEvent = specialEvent;
    
    forgeState.quality = quality;
    
    // 播放锻造完成音效
    if (typeof SoundFX !== 'undefined') {
        SoundFX.play('forge_complete');
    }
    
    // 创建武器
    const weapon = WEAPON_TEMPLATES.find(w => w.id === forgeState.currentWeapon);
    const forgedWeapon = forgeCreateWeapon(weapon, quality);
    
    // 显示结果
    setTimeout(() => {
        forgeShowResult(forgedWeapon, quality);
    }, 500);
}

function forgeCreateWeapon(template, quality) {
    const qualityMultipliers = {
        common: 1.0,
        uncommon: 1.2,
        rare: 1.5,
        legendary: 2.0
    };
    
    const multiplier = qualityMultipliers[quality] || 1.0;
    
    const weapon = {
        id: template.id + '_' + Date.now(),
        templateId: template.id,
        name: template.name,
        icon: template.icon,
        type: template.type,
        tier: quality,
        forged: true,
        forgedBy: 'player',
        forgedQuality: quality,
        stats: {}
    };
    
    // 应用品质加成
    for (const [stat, value] of Object.entries(template.baseStats)) {
        weapon.stats[stat] = Math.floor(value * multiplier);
    }
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"特殊词条应用
    // ═══════════════════════════════════════════════════════════════
    if (forgeState._specialEnchant) {
        weapon.enchant = forgeState._specialEnchant;
        weapon.name = weapon.name + '·' + forgeState._specialEnchant.name;
        
        // 应用词条效果
        if (forgeState._specialEnchant.effect === 'atk') {
            weapon.stats.attack = (weapon.stats.attack || 0) + forgeState._specialEnchant.value;
        } else if (forgeState._specialEnchant.effect === 'spd') {
            weapon.stats.spd = (weapon.stats.spd || 0) + forgeState._specialEnchant.value;
        } else {
            // 其他效果存入特殊属性
            weapon.stats[forgeState._specialEnchant.effect] = forgeState._specialEnchant.value;
        }
    }
    
    // 传世之作：双词条
    if (forgeState._secondEnchant) {
        weapon.secondEnchant = forgeState._secondEnchant;
        weapon.name = '传世·' + weapon.name + '·' + forgeState._secondEnchant.name;
        
        // 应用第二条词条效果
        if (forgeState._secondEnchant.effect === 'atk') {
            weapon.stats.attack = (weapon.stats.attack || 0) + forgeState._secondEnchant.value;
        } else if (forgeState._secondEnchant.effect === 'spd') {
            weapon.stats.spd = (weapon.stats.spd || 0) + forgeState._secondEnchant.value;
        } else {
            weapon.stats[forgeState._secondEnchant.effect] = (weapon.stats[forgeState._secondEnchant.effect] || 0) + forgeState._secondEnchant.value;
        }
    }
    
    // 神匠附体/材料爆裂专属名字
    if (forgeState._specialEvent === 'god_smith') {
        weapon.name = '神匠·' + weapon.name;
    } else if (forgeState._specialEvent === 'material_burst') {
        weapon.name = '爆炎·' + weapon.name;
    }
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"锻造恶搞效果应用
    // ═══════════════════════════════════════════════════════════════
    if (forgeState._specialEvent === 'singing_sword') {
        weapon.name = '歌唱·' + weapon.name;
        weapon.stats.charm = (weapon.stats.charm || 0) + 5;
    } else if (forgeState._specialEvent === 'talking_weapon') {
        weapon.name = '话痨·' + weapon.name;
        weapon.stats.wisdom = (weapon.stats.wisdom || 0) + 3;
    } else if (forgeState._specialEvent === 'rainbow_metal') {
        weapon.name = '彩虹·' + weapon.name;
        weapon.stats.luck = (weapon.stats.luck || 0) + 5;
    } else if (forgeState._specialEvent === 'shrinking_weapon') {
        weapon.name = '迷你·' + weapon.name;
        weapon.stats.attack = Math.floor((weapon.stats.attack || 0) * 1.2);
    } else if (forgeState._specialEvent === 'stinky_forge') {
        weapon.name = '臭臭·' + weapon.name;
        weapon.stats.poisonChance = (weapon.stats.poisonChance || 0) + 15;
    } else if (forgeState._specialEvent === 'chicken_weapon') {
        weapon.name = '鸡鸣·' + weapon.name;
        weapon.stats.critChance = (weapon.stats.critChance || 0) + 10;
    }
    
    // 清空临时状态
    forgeState._specialEnchant = null;
    forgeState._secondEnchant = null;
    forgeState._shrinkingEffect = null;
    forgeState._chickenEffect = null;
    
    return weapon;
}

function forgeShowResult(weapon, quality) {
  // ── 成就系统触发 ──
  if(typeof achOnForge === 'function') achOnForge(quality);

  // ── 情境任务触发：锻造行为（系统自动判断首次） ──
  if(typeof triggerContextualAction === 'function'){
    try{ triggerContextualAction('forge'); }catch(e){}
  }

  const qualityNames = {
        common: '普通',
        uncommon: '优质',
        rare: '完美',
        legendary: '传说'
    };
    
    const qualityColors = {
        common: '#a0a0a0',
        uncommon: '#7cb97c',
        rare: '#9c7cff',
        legendary: '#ff7c7c'
    };
    
    const html = `
        <div class="forge-result">
            <div class="forge-result-title">🎉 锻造完成！</div>
            <div class="forge-weapon-display">
                <div class="forge-weapon-icon-huge">${weapon.icon}</div>
                <div class="forge-weapon-name" style="color: ${qualityColors[quality]}">
                    ${weapon.name}
                </div>
                <div class="forge-weapon-quality" style="color: ${qualityColors[quality]}">
                    ${qualityNames[quality]}品质
                </div>
            </div>
            
            <div class="forge-result-stats">
                ${Object.entries(weapon.stats).map(([stat, value]) => 
                    `<div class="forge-result-stat">${forgeGetStatName(stat)}: +${value}</div>`
                ).join('')}
            </div>
            
            <div class="forge-result-controls">
                <button class="forge-continue-btn" onclick="forgeFinish()">继续锻造</button>
            </div>
        </div>
    `;
    
    // 更新对话框内容
    const dialogContent = document.querySelector('.dialog-content');
    if (dialogContent) {
        const container = dialogContent.querySelector('.forge-container');
        if (container) {
            container.innerHTML = html;
        }
    }
    
    // 添加到装备背包
    setTimeout(() => {
        if (typeof edS === 'undefined') return;
        if (!edS.bags) edS.bags = {};
        if (!edS.bags.wuxia_equipment) edS.bags.wuxia_equipment = { items: {}, maxSlots: 50 };
        
        edS.bags.wuxia_equipment.items[weapon.id] = weapon;
        
        showBanner('获得装备', `${weapon.icon} ${weapon.name} 已添加到装备背包`, 'success');
    }, 1000);
}

function forgeFinish() {
    forgeRender();
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"锻造特殊系统
// ═══════════════════════════════════════════════════════════════

// ── 特殊词条池（扩展版）──
const FORGE_ENCHANTS = [
    // 基础词条
    { id: 'keen', name: '锋利', effect: 'critChance', value: 5, desc: '暴击率+5%', tier: 'common' },
    { id: 'vampiric', name: '吸血', effect: 'lifeSteal', value: 3, desc: '攻击吸血3%', tier: 'uncommon' },
    { id: 'swift', name: '迅捷', effect: 'spd', value: 2, desc: '速度+2', tier: 'common' },
    { id: 'heavy', name: '沉重', effect: 'atk', value: 10, desc: '攻击+10，速度-1', tier: 'common' },
    { id: 'lucky', name: '幸运', effect: 'luk', value: 3, desc: '运气+3', tier: 'uncommon' },
    { id: 'poison', name: '淬毒', effect: 'poisonChance', value: 10, desc: '10%概率使敌人中毒', tier: 'rare' },
    { id: 'stun', name: '震荡', effect: 'stunChance', value: 8, desc: '8%概率眩晕敌人', tier: 'rare' },
    { id: 'durable', name: '坚韧', effect: 'durability', value: 50, desc: '耐久+50', tier: 'common' },
    // 新增高级词条
    { id: 'fierce', name: '狂暴', effect: 'berserk', value: 15, desc: '气血低于30%时攻击+15%', tier: 'epic' },
    { id: 'guardian', name: '守护', effect: 'guard', value: 10, desc: '受到伤害-10%', tier: 'epic' },
    { id: 'phoenix', name: '涅槃', effect: 'reborn', value: 1, desc: '每场战斗1次，濒死时恢复10%气血', tier: 'legendary' },
    { id: 'thunder', name: '雷霆', effect: 'thunder', value: 20, desc: '20%概率触发雷霆，额外造成30伤害', tier: 'epic' },
    { id: 'frost', name: '霜寒', effect: 'frost', value: 15, desc: '15%概率冻结敌人1回合', tier: 'epic' },
    { id: 'flame', name: '烈焰', effect: 'flame', value: 25, desc: '25%概率灼烧，每回合-5气血', tier: 'rare' },
    { id: 'wind', name: '疾风', effect: 'doubleStrike', value: 10, desc: '10%概率连击', tier: 'epic' },
    { id: 'shadow', name: '暗影', effect: 'shadow', value: 12, desc: '夜间战斗攻击+12%', tier: 'uncommon' },
    { id: 'holy', name: '神圣', effect: 'holy', value: 8, desc: '对邪恶阵营伤害+8%', tier: 'rare' },
    { id: 'cursed', name: '诅咒', effect: 'curse', value: 5, desc: '攻击时5%概率诅咒敌人（全属性-5%）', tier: 'rare' },
];

// ── 锻造特殊事件（扩展版）──
const FORGE_SPECIAL_EVENTS = {
    // 原有事件
    god_smith: { id: 'god_smith', name: '神匠附体', icon: '🔥', desc: '冥冥之中有神助！', color: '#ffd700' },
    material_burst: { id: 'material_burst', name: '材料爆裂', icon: '💥', desc: '材料在烈火中升华！', color: '#ff6b6b' },
    great_success: { id: 'great_success', name: '大成功', icon: '✨', desc: '神来之笔！', color: '#4ecdc4' },
    flaw: { id: 'flaw', name: '锻造瑕疵', icon: '⚠️', desc: '火候掌握不当', color: '#ff8c42' },
    enchant: { id: 'enchant', name: '特殊词条', icon: '🔮', desc: '获得特殊属性', color: '#a78bfa' },
    masterpiece: { id: 'masterpiece', name: '传世之作', icon: '🏆', desc: '千锤百炼，名器出世！', color: '#ffd700' },
    // 新增事件
    soul_infusion: { id: 'soul_infusion', name: '器灵觉醒', icon: '👻', desc: '武器诞生了微弱的意识...', color: '#9b59b6' },
    elemental_fusion: { id: 'elemental_fusion', name: '元素共鸣', icon: '🌟', desc: '天地元素汇聚于此！', color: '#3498db' },
    ancient_secret: { id: 'ancient_secret', name: '古卷启示', icon: '📜', desc: '锻造中领悟了古法！', color: '#e74c3c' },
    dragon_blessing: { id: 'dragon_blessing', name: '龙气加持', icon: '🐉', desc: '似有龙吟之声！', color: '#f1c40f' },
    meteor_strike: { id: 'meteor_strike', name: '陨铁天成', icon: '☄️', desc: '天外陨铁融入其中！', color: '#95a5a6' },
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"锻造恶搞事件
    // ═══════════════════════════════════════════════════════════════
    singing_sword: { id: 'singing_sword', name: '会唱歌的剑', icon: '🎵', desc: '这把剑锻造时发出了奇怪的歌声...', color: '#ff69b4' },
    hot_potato: { id: 'hot_potato', name: '烫手山芋', icon: '🥔', desc: '武器出炉时烫得你差点扔掉！', color: '#ff4500' },
    talking_weapon: { id: 'talking_weapon', name: '话痨武器', icon: '💬', desc: '这把武器似乎有很多话要说...', color: '#00ced1' },
    rainbow_metal: { id: 'rainbow_metal', name: '彩虹金属', icon: '🌈', desc: '金属在烈火中变成了彩虹色！', color: '#ff1493' },
    shrinking_weapon: { id: 'shrinking_weapon', name: '缩水武器', icon: '📏', desc: '武器出炉后...怎么变小了？', color: '#9370db' },
    stinky_forge: { id: 'stinky_forge', name: '臭气熏天', icon: '💨', desc: '锻造过程中产生了奇怪的气味...', color: '#556b2f' },
    lucky_hammer: { id: 'lucky_hammer', name: '幸运锤击', icon: '🍀', desc: '锤子不小心飞出去，却打出了完美一击！', color: '#32cd32' },
    chicken_weapon: { id: 'chicken_weapon', name: '鸡飞狗跳', icon: '🐔', desc: '一只鸡飞进了锻造炉，武器获得了奇怪的力量...', color: '#ffa500' },
};

// ── 按品质抽取词条 ──
function _rollForgeEnchant(tier = 'random') {
    let pool = FORGE_ENCHANTS;
    if (tier !== 'random') {
        pool = FORGE_ENCHANTS.filter(e => e.tier === tier);
        if (pool.length === 0) pool = FORGE_ENCHANTS;
    }
    // 高品质词条概率更低
    const weights = pool.map(e => {
        switch(e.tier) {
            case 'common': return 10;
            case 'uncommon': return 6;
            case 'rare': return 3;
            case 'epic': return 1.5;
            case 'legendary': return 0.5;
            default: return 5;
        }
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    for (let i = 0; i < pool.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return pool[i];
    }
    return pool[pool.length - 1];
}

// ── 获取特殊事件描述 ──
function _getForgeEventDesc(eventId) {
    const evt = FORGE_SPECIAL_EVENTS[eventId];
    return evt ? `${evt.icon} ${evt.name}：${evt.desc}` : '';
}

// ── 显示锻造失败结果 ──
function forgeShowBrokenResult() {
    const html = `
        <div class="forge-result">
            <div class="forge-result-title" style="color:#ff6060">💔 锻造失败</div>
            <div class="forge-weapon-display">
                <div class="forge-weapon-icon-huge" style="filter:grayscale(100%)">⚔️</div>
                <div class="forge-weapon-name" style="color:#888">武器断裂</div>
                <div class="forge-weapon-quality" style="color:#ff6060">材料尽毁</div>
            </div>
            <div class="forge-result-desc" style="color:#aaa;margin:16px 0">
                锻造过程中火候失控，武器在锤下断裂成碎片...<br>
                材料已无法回收，只能重新收集。
            </div>
            <div class="forge-result-controls">
                <button class="forge-continue-btn" onclick="forgeFinish()">接受现实</button>
            </div>
        </div>
    `;
    
    const dialogContent = document.querySelector('.dialog-content');
    if (dialogContent) {
        const container = dialogContent.querySelector('.forge-container');
        if (container) {
            container.innerHTML = html;
        }
    }
}

// ==================== 材料系统 ====================
function forgeGetMaterialCount(matId) {
    const craftBag = (typeof edS !== 'undefined' && edS.bags?.wuxia_craft_bag) || { items: {} };
    return craftBag.items[matId] || 0;
}

function forgeGetMaterialIcon(matId) {
    const icons = {
        iron_ore: '⚫',
        wood: '🪵',
        leather: '🦬',
        coal: '⬛'
    };
    return icons[matId] || '⚫';
}

function forgeGetMaterialName(matId) {
    const names = {
        iron_ore: '铁矿',
        wood: '木材',
        leather: '皮革',
        coal: '煤炭'
    };
    return names[matId] || matId;
}

function forgeConsumeMaterial(matId, amount) {
    if (typeof edS === 'undefined') return;
    const craftBag = edS.bags?.wuxia_craft_bag || { items: {} };
    if (!craftBag.items[matId]) craftBag.items[matId] = 0;
    craftBag.items[matId] = Math.max(0, craftBag.items[matId] - amount);
}

function forgeRenderMaterialBag() {
    const materials = ['iron_ore', 'wood', 'leather', 'coal'];
    
    return materials.map(matId => {
        const count = forgeGetMaterialCount(matId);
        if (count === 0) return '';
        
        return `
            <div class="forge-material-item">
                <div class="forge-material-icon">${forgeGetMaterialIcon(matId)}</div>
                <div class="forge-material-name">${forgeGetMaterialName(matId)}</div>
                <div class="forge-material-count">x${count}</div>
            </div>
        `;
    }).join('');
}

// ==================== 工具函数 ====================
function forgeGetTierName(tier) {
    const names = {
        common: '普通',
        uncommon: '稀有',
        rare: '珍贵',
        legendary: '传说'
    };
    return names[tier] || '未知';
}

function forgeGetStatName(stat) {
    const names = {
        attack: '攻击',
        durability: '耐久',
        crit_chance: '暴击率',
        range: '射程',
        stun_chance: '眩晕率'
    };
    return names[stat] || stat;
}

function forgeGetQualityName(quality) {
    const names = {
        common: '普通',
        uncommon: '优质',
        rare: '完美',
        legendary: '传说'
    };
    return names[quality] || '未知';
}

function showBanner(title, message, type = 'info') {
    if (typeof showGameBanner === 'function') {
        showGameBanner(title, message, type);
    } else {
        alert(`${title}: ${message}`);
    }
}

function showDialog(config) {
    if (typeof showGameDialog === 'function') {
        showGameDialog(config);
    } else {
        alert(config.content);
    }
}

function getWorldData() {
    if (typeof WORLD_DATA !== 'undefined') return WORLD_DATA;
    return {};
}

// 打铁锻造系统已加载