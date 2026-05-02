/**
 * 采药制药小游戏
 * minigame-herbalism.js v1.0
 * 
 * 野外采药 + 制药配方系统
 */

let herbalismState = {
    mode: 'gather', location: null, herbs: [], selectedRecipe: null, craftingAmount: 1,
    gatherTarget: null, gatherProgress: 0, animation: null,
    craftBag: null, consumables: null
};

const HERB_TYPES = {
    wild_grass: { name: '野草', icon: '🌿', rarity: 'common', terrain: ['grassland', 'plain'], value: 1 },
    dandelion: { name: '蒲公英', icon: '🌼', rarity: 'common', terrain: ['grassland', 'plain'], value: 2 },
    mugwort: { name: '艾草', icon: '🌾', rarity: 'common', terrain: ['grassland', 'hill'], value: 2 },
    mountain_fungus: { name: '山菌', icon: '🍄', rarity: 'uncommon', terrain: ['forest', 'mountain'], value: 3 },
    wild_ginseng: { name: '野山参', icon: '🌱', rarity: 'uncommon', terrain: ['forest', 'mountain'], value: 5 },
    chrysanthemum: { name: '野菊花', icon: '🏵️', rarity: 'uncommon', terrain: ['hill', 'mountain'], value: 4 },
    snow_lotus: { name: '雪莲', icon: '🌸', rarity: 'rare', terrain: ['snow', 'mountain'], value: 10 },
    ganoderma: { name: '灵芝', icon: '🍄', rarity: 'rare', terrain: ['forest', 'cave'], value: 12 },
    cordyceps: { name: '虫草', icon: '🐛', rarity: 'rare', terrain: ['snow', 'mountain'], value: 15 },
    snake_herb: { name: '蛇涎草', icon: '🐍', rarity: 'rare', terrain: ['swamp', 'cave'], value: 8 },
    spider_flower: { name: '蜘蛛花', icon: '🕷️', rarity: 'uncommon', terrain: ['forest', 'cave'], value: 6 },
    ghost_fungus: { name: '鬼面菇', icon: '👻', rarity: 'rare', terrain: ['cave', 'swamp'], value: 10 },
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"采药恶搞草药
    // ═══════════════════════════════════════════════════════════════
    stinky_weed: { name: '臭臭草', icon: '💩', rarity: 'common', terrain: ['swamp', 'plain'], value: 0, desc: '闻起来像...算了，不想描述' },
    itchy_leaf: { name: '痒痒叶', icon: '🌿', rarity: 'common', terrain: ['grassland', 'forest'], value: 1, desc: '碰到就会痒痒' },
    sneeze_powder: { name: '喷嚏粉', icon: '🤧', rarity: 'uncommon', terrain: ['hill', 'mountain'], value: 3, desc: '一闻就打喷嚏' },
    crying_onion: { name: '哭泣洋葱', icon: '😢', rarity: 'common', terrain: ['grassland', 'plain'], value: 2, desc: '切它的时候你会哭' },
    laughing_mushroom: { name: '笑菇', icon: '🍄', rarity: 'rare', terrain: ['forest', 'cave'], value: 8, desc: '吃了会忍不住笑' },
    love_potion_herb: { name: '相思草', icon: '💕', rarity: 'rare', terrain: ['grassland', 'hill'], value: 10, desc: '据说能让人一见钟情...其实是心理作用' },
    bald_moss: { name: '秃头苔', icon: '👨‍🦲', rarity: 'uncommon', terrain: ['cave', 'swamp'], value: 4, desc: '外形像秃头，别问为什么' },
    hiccup_root: { name: '打嗝根', icon: '🫢', rarity: 'common', terrain: ['forest', 'hill'], value: 2, desc: '吃了会不停打嗝' },
    glow_worm_grass: { name: '荧光草', icon: '✨', rarity: 'uncommon', terrain: ['cave', 'forest'], value: 5, desc: '晚上会发光，当手电筒用' },
    talking_flower: { name: '话痨花', icon: '🌺', rarity: 'epic', terrain: ['forest', 'mountain'], value: 20, desc: '据说会说话...其实是风吹的' },
};

const RECIPES = [
    { id: 'basic_hp_pill', name: '小还丹', icon: '💊', rarity: 'common',
        ingredients: { wild_grass: 2, dandelion: 1 },
        result: { item: 'basic_hp_pill', amount: 1, effects: { hp: 30 } } },
    { id: 'medium_hp_pill', name: '还魂丹', icon: '💊', rarity: 'uncommon',
        ingredients: { wild_ginseng: 1, mugwort: 2, dandelion: 1 },
        result: { item: 'medium_hp_pill', amount: 1, effects: { hp: 60 } } },
    { id: 'basic_mp_pill', name: '聚气丹', icon: '💊', rarity: 'common',
        ingredients: { mugwort: 2, wild_grass: 1 },
        result: { item: 'basic_mp_pill', amount: 1, effects: { mp: 25 } } },
    { id: 'antidote', name: '解毒丹', icon: '🧪', rarity: 'uncommon',
        ingredients: { dandelion: 2, mugwort: 2, spider_flower: 1 },
        result: { item: 'antidote', amount: 2, effects: { cure_poison: true } } }
];

function openHerbalism(cityId) {
    if (!cityId) return;
    const worldData = getWorldData();
    const city = worldData[cityId];
    if (!city) return;
    if (typeof edS === 'undefined') { if(typeof showToast==='function') showToast('无法读取玩家数据'); return; }
    
    herbalismState.craftBag = edS.bags?.wuxia_craft_bag || { items: {}, maxSlots: 50 };
    herbalismState.consumables = edS.bags?.wuxia_consumables || { items: {}, maxSlots: 50 };
    herbalismState.location = city;
    herbalismState.mode = 'gather';
    herbalismState.gatherTarget = null;
    herbalismState.gatherProgress = 0;
    herbalismState.animation = null;
    
    herbalismRender();
}

function herbalismRender() {
    const html = `
        <div class="herbalism-container">
            <div class="herbalism-header">
                <div class="herbalism-banner">🌿 采药制药 · 医仙传承 🌿</div>
                <div class="herbalism-location">${herbalismState.location.name}</div>
            </div>
            <div class="herbalism-mode-tabs">
                <button class="herbalism-tab ${herbalismState.mode === 'gather' ? 'active' : ''}" 
                        onclick="herbalismSetMode('gather')">🌿 野外采药</button>
                <button class="herbalism-tab ${herbalismState.mode === 'craft' ? 'active' : ''}" 
                        onclick="herbalismSetMode('craft')">🧪 炼制丹药</button>
            </div>
            ${herbalismState.mode === 'gather' ? herbalismRenderGather() : herbalismRenderCraft()}
        </div>
    `;
    
    showDialog({
        title: `采药制药 - ${herbalismState.location.name}`,
        content: html,
        width: 850, height: 600,
        onClose: () => { if (herbalismState.animation) clearTimeout(herbalismState.animation); }
    });
}

function herbalismSetMode(mode) {
    herbalismState.mode = mode;
    if (mode === 'craft') {
        herbalismState.gatherTarget = null; herbalismState.gatherProgress = 0;
        if (herbalismState.animation) { clearTimeout(herbalismState.animation); herbalismState.animation = null; }
    }
    herbalismRender();
}

function herbalismRenderGather() {
    const terrain = herbalismState.location.terrain || 'plain';
    const availableHerbs = herbalismGetAvailableHerbs(terrain);
    
    return `
        <div class="herbalism-gather">
            <div class="herbalism-gather-scene">
                <div class="herbalism-scene-title">${herbalismGetTerrainName(terrain)} · 草药分布</div>
                <div class="herbalism-terrain-visual">${herbalismGetTerrainVisual(terrain)}</div>
                <div class="herbalism-herbs-grid">
                    ${availableHerbs.map(herb => `
                        <div class="herbalism-herb-card ${herbalismState.gatherTarget === herb.id ? 'selected' : ''}"
                             onclick="herbalismSelectHerb('${herb.id}')">
                            <div class="herbalism-herb-icon">${herb.icon}</div>
                            <div class="herbalism-herb-name">${herb.name}</div>
                            <div class="herbalism-herb-rarity ${herb.rarity}">${herbalismGetRarityName(herb.rarity)}</div>
                            <div class="herbalism-herb-chance">出现率: ${herb.chance}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="herbalism-gather-panel">
                <div class="herbalism-current-target">
                    ${herbalismState.gatherTarget ? `
                        <div class="herbalism-target-info">
                            <div class="herbalism-target-icon">${HERB_TYPES[herbalismState.gatherTarget].icon}</div>
                            <div class="herbalism-target-name">${HERB_TYPES[herbalismState.gatherTarget].name}</div>
                            <div class="herbalism-target-progress">
                                <div class="herbalism-progress-bar">
                                    <div class="herbalism-progress-fill" style="width: ${herbalismState.gatherProgress}%"></div>
                                </div>
                                <div class="herbalism-progress-text">${herbalismState.gatherProgress}%</div>
                            </div>
                        </div>
                        <button class="herbalism-gather-btn" 
                                onclick="herbalismStartGathering()" 
                                ${herbalismState.gatherProgress > 0 ? 'disabled' : ''}>
                            ${herbalismState.gatherProgress > 0 ? '采集中...' : '开始采集'}
                        </button>
                    ` : '<div class="herbalism-no-target">请选择要采集的草药</div>'}
                </div>
                <div class="herbalism-inventory">
                    <div class="herbalism-inventory-title">草药背包</div>
                    <div class="herbalism-inventory-grid">${herbalismRenderCraftBag()}</div>
                </div>
            </div>
        </div>
    `;
}

function herbalismRenderCraft() {
    return `
        <div class="herbalism-craft">
            <div class="herbalism-recipe-list">
                <div class="herbalism-list-title">可炼制丹方</div>
                <div class="herbalism-recipes">
                    ${RECIPES.map(recipe => {
                        const canCraft = herbalismCanCraft(recipe);
                        return `
                            <div class="herbalism-recipe-card ${herbalismState.selectedRecipe === recipe.id ? 'selected' : ''} ${!canCraft ? 'disabled' : ''}"
                                 onclick="herbalismSelectRecipe('${recipe.id}')">
                                <div class="herbalism-recipe-header">
                                    <div class="herbalism-recipe-icon">${recipe.icon}</div>
                                    <div class="herbalism-recipe-name">${recipe.name}</div>
                                    <div class="herbalism-recipe-rarity ${recipe.rarity}">${herbalismGetRarityName(recipe.rarity)}</div>
                                </div>
                                <div class="herbalism-recipe-desc">${recipe.desc}</div>
                                <div class="herbalism-recipe-ingredients">
                                    ${Object.entries(recipe.ingredients).map(([herbId, amount]) => {
                                        const hasAmount = herbalismState.craftBag.items[herbId] || 0;
                                        return `<div class="herbalism-ingredient ${hasAmount >= amount ? '' : 'missing'}">
                                            ${HERB_TYPES[herbId]?.icon || '🌿'} ${HERB_TYPES[herbId]?.name || herbId}: ${hasAmount}/${amount}
                                        </div>`;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <div class="herbalism-craft-panel">
                ${herbalismState.selectedRecipe ? `
                    <div class="herbalism-selected-recipe">
                        <div class="herbalism-recipe-detail">
                            <div class="herbalism-recipe-icon-large">${RECIPES.find(r => r.id === herbalismState.selectedRecipe).icon}</div>
                            <div class="herbalism-recipe-info">
                                <div class="herbalism-recipe-name-large">${RECIPES.find(r => r.id === herbalismState.selectedRecipe).name}</div>
                                <div class="herbalism-recipe-desc-large">${RECIPES.find(r => r.id === herbalismState.selectedRecipe).desc}</div>
                            </div>
                        </div>
                        <div class="herbalism-craft-controls">
                            <div class="herbalism-amount-control">
                                <label>炼制数量：</label>
                                <button class="herbalism-amount-btn" onclick="herbalismAdjustAmount(-1)">-</button>
                                <input type="number" class="herbalism-amount-input" 
                                       value="${herbalismState.craftingAmount}" 
                                       min="1" max="99" 
                                       onchange="herbalismSetAmount(this.value)">
                                <button class="herbalism-amount-btn" onclick="herbalismAdjustAmount(1)">+</button>
                            </div>
                            <button class="herbalism-craft-btn ${herbalismCanCraft(RECIPES.find(r => r.id === herbalismState.selectedRecipe)) ? '' : 'disabled'}" 
                                    onclick="herbalismCraft()" 
                                    ${herbalismCanCraft(RECIPES.find(r => r.id === herbalismState.selectedRecipe)) ? '' : 'disabled'}>
                                ${herbalismCanCraft(RECIPES.find(r => r.id === herbalismState.selectedRecipe)) ? '开始炼制' : '材料不足'}
                            </button>
                        </div>
                    </div>
                ` : '<div class="herbalism-no-recipe">请选择一个丹方</div>'}
                <div class="herbalism-inventory">
                    <div class="herbalism-inventory-title">草药背包</div>
                    <div class="herbalism-inventory-grid">${herbalismRenderCraftBag()}</div>
                </div>
            </div>
        </div>
    `;
}

function herbalismGetAvailableHerbs(terrain) {
    const herbs = [];
    for (const [herbId, herb] of Object.entries(HERB_TYPES)) {
        if (herb.terrain.includes(terrain)) {
            const chance = herb.rarity === 'common' ? 60 : herb.rarity === 'uncommon' ? 30 : 10;
            herbs.push({ ...herb, id: herbId, chance });
        }
    }
    return herbs;
}

function herbalismGetTerrainName(terrain) {
    const names = { grassland: '草原', plain: '平原', hill: '丘陵', forest: '森林', mountain: '山地', snow: '雪山', swamp: '沼泽', cave: '洞穴' };
    return names[terrain] || '未知地形';
}

function herbalismGetTerrainVisual(terrain) {
    const visuals = {
        grassland: '🌾🌾🌾🌾🌾\n🌿🌱🌿🌱🌿\n🌾🌾🌾🌾🌾',
        plain: '🌱🌱🌱🌱🌱\n🌿🌿🌿🌿🌿\n🌱🌱🌱🌱🌱',
        forest: '🌲🌲🌲🌲🌲\n🌿🌱🌿🌱🌿\n🌲🌲🌲🌲🌲',
        mountain: '⛰️⛰️⛰️⛰️⛰️\n🏔️🏔️🏔️🏔️🏔️\n🌿🌱🌿🌱🌿'
    };
    return visuals[terrain] || '🌿🌱🌿🌱🌿';
}

function herbalismSelectHerb(herbId) {
    if (herbalismState.gatherProgress > 0) return;
    herbalismState.gatherTarget = herbId;
    herbalismState.gatherProgress = 0;
    herbalismRender();
}

function herbalismStartGathering() {
    if (!herbalismState.gatherTarget || herbalismState.gatherProgress > 0) return;
    herbalismState.gatherProgress = 10;
    // ── 采集开始音效 ──
    if (typeof SoundFX !== 'undefined') SoundFX.play('gather_start');
    herbalismState.animation = setTimeout(() => herbalismProgressGathering(), 300);
    herbalismRender();
}

function herbalismProgressGathering() {
    if (!herbalismState.gatherTarget) return;
    herbalismState.gatherProgress += Math.random() * 15 + 10;
    
    if (herbalismState.gatherProgress >= 100) {
        herbalismCompleteGathering();
    } else {
        herbalismState.animation = setTimeout(() => herbalismProgressGathering(), 300);
        herbalismRender();
    }
}

function herbalismCompleteGathering() {
    const herbId = herbalismState.gatherTarget;
    const herb = HERB_TYPES[herbId];
    if (!herb) return;
    
    // ═══════════════════════════════════════════════
    // 采药"将将胡"系统
    // ═══════════════════════════════════════════════
    const luckRoll = Math.random();
    let specialEvent = null;
    
    // 4%概率：珍稀草药（品质+1级，common变uncommon等）
    if(luckRoll < 0.04){
        specialEvent = 'rare_herb';
    }
    // 3%概率：毒草陷阱（中毒，气血-10%）
    else if(luckRoll < 0.07){
        specialEvent = 'poison_trap';
    }
    // 2%概率：采药事故（被毒虫咬伤，气血-5%，但获得额外草药）
    else if(luckRoll < 0.09){
        specialEvent = 'accident';
    }
    // 1%概率：千年灵药（双倍数量+额外经验）
    else if(luckRoll < 0.10){
        specialEvent = 'miracle_herb';
    }
    
    // ═══════════════════════════════════════════════════════════════
    //  "将将胡"采药恶搞事件
    // ═══════════════════════════════════════════════════════════════
    // 3%概率：踩到狗屎（运气+10，但浑身臭烘烘）
    else if(luckRoll < 0.13){
        specialEvent = 'dog_poop';
    }
    // 2%概率：被蜜蜂追（逃跑时撞到了稀有草药）
    else if(luckRoll < 0.15){
        specialEvent = 'bee_chase';
    }
    // 2%概率：挖到别人的私房钱
    else if(luckRoll < 0.17){
        specialEvent = 'hidden_money';
    }
    // 1.5%概率：草药成精了（会说话）
    else if(luckRoll < 0.185){
        specialEvent = 'talking_herb';
    }
    // 1%概率：被当成偷菜贼
    else if(luckRoll < 0.195){
        specialEvent = 'mistaken_thief';
    }
    // 0.5%概率：遇到采药仙子
    else if(luckRoll < 0.20){
        specialEvent = 'herb_fairy';
    }
    
    const baseChance = herb.rarity === 'common' ? 80 : herb.rarity === 'uncommon' ? 60 : 40;
    const luckBonus = ((typeof edS !== 'undefined' && edS.playerAttributes?.luck) || 50) / 2;
    const totalChance = Math.min(95, baseChance + luckBonus);
    const success = Math.random() * 100 < totalChance;
    
    if (success) {
        // 处理特殊事件
        if(specialEvent === 'poison_trap'){
            // 毒草陷阱：获得草药但中毒
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId]++;
            
            // 玩家中毒
            if(typeof edS !== 'undefined'){
                const poisonDmg = Math.floor((edS.maxHp || 100) * 0.10);
                edS.hp = Math.max(1, (edS.hp || edS.maxHp || 100) - poisonDmg);
            }
            
            showBanner('☠️ 毒草陷阱！', `获得 ${herb.icon} ${herb.name}，但中毒了！气血-${poisonDmg || '??'}`, 'warning');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_poison');
        }
        else if(specialEvent === 'accident'){
            // 采药事故：获得双倍草药但受伤
            const qty = 2;
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId] += qty;
            
            // 玩家受伤
            if(typeof edS !== 'undefined'){
                const dmg = Math.floor((edS.maxHp || 100) * 0.05);
                edS.hp = Math.max(1, (edS.hp || edS.maxHp || 100) - dmg);
            }
            
            showBanner('🩹 采药事故', `被毒虫咬伤！但意外发现${qty}株${herb.name}`, 'rare');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_accident');
        }
        else if(specialEvent === 'miracle_herb'){
            // 千年灵药：双倍数量+额外经验
            const qty = 2;
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId] += qty;
            
            const bonusExp = herb.value * 5;
            if (typeof edS !== 'undefined') edS.exp = (edS.exp || 0) + bonusExp;
            
            showBanner('🌟 千年灵药！', `获得 ${herb.icon} ${herb.name} x${qty}！经验+${bonusExp}`, 'legendary');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_miracle');
        }
        // ═══════════════════════════════════════════════════════════════
        //  "将将胡"采药恶搞事件处理
        // ═══════════════════════════════════════════════════════════════
        else if(specialEvent === 'dog_poop'){
            // 踩到狗屎：运气+10，但浑身臭烘烘
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId]++;
            
            if(typeof edS !== 'undefined'){
                edS._dogPoopBuff = { luk: 10, duration: 5, desc: '踩到狗屎的运气' };
            }
            
            showBanner('💩 踩到狗屎！', `获得 ${herb.icon} ${herb.name}，运气+10！（虽然臭烘烘的）`, 'rare');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_funny');
        }
        else if(specialEvent === 'bee_chase'){
            // 被蜜蜂追：逃跑时撞到稀有草药
            const bonusHerbId = 'wild_ginseng';
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId]++;
            if (!herbalismState.craftBag.items[bonusHerbId]) herbalismState.craftBag.items[bonusHerbId] = 0;
            herbalismState.craftBag.items[bonusHerbId]++;
            
            if(typeof edS !== 'undefined'){
                const beeDmg = Math.floor((edS.maxHp || 100) * 0.03);
                edS.hp = Math.max(1, (edS.hp || edS.maxHp || 100) - beeDmg);
            }
            
            showBanner('🐝 蜜蜂追击！', `被蜜蜂追得满山跑，意外撞到了野山参！气血-3%`, 'rare');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_funny');
        }
        else if(specialEvent === 'hidden_money'){
            // 挖到私房钱
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId]++;
            
            const foundMoney = 20 + Math.floor(Math.random() * 30);
            if(typeof SilverManager !== 'undefined') SilverManager.add(foundMoney);
            
            showBanner('💰 意外之财！', `挖草药时挖到一个破陶罐，里面有${foundMoney}两银子！`, 'legendary');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_funny');
        }
        else if(specialEvent === 'talking_herb'){
            // 草药成精
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId] += 3; // 成精的草药给3个
            
            const herbQuotes = [
                '"大侠饶命！我修炼了三百年啊！"',
                '"别拔我！我告诉你哪里有宝藏！"',
                '"哎哟！轻点！我的老腰！"',
                '"你把我拔了，谁给山神爷爷熬汤？"',
            ];
            const quote = herbQuotes[Math.floor(Math.random() * herbQuotes.length)];
            
            showBanner('🗣️ 草药说话！', `${herb.icon} ${herb.name}突然开口：${quote}\n你吓得手一抖，多拔了两株！`, 'legendary');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_funny');
        }
        else if(specialEvent === 'mistaken_thief'){
            // 被当成偷菜贼
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId]++;
            
            showBanner('👨‍🌾 误会一场！', `老农举着锄头追了你三条街，最后发现这不是他的地...尴尬地送你一株${herb.name}`, 'warning');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_funny');
        }
        else if(specialEvent === 'herb_fairy'){
            // 遇到采药仙子
            const bonusHerbs = ['ganoderma', 'snow_lotus', 'cordyceps'];
            const bonusHerbId = bonusHerbs[Math.floor(Math.random() * bonusHerbs.length)];
            if (!herbalismState.craftBag.items[bonusHerbId]) herbalismState.craftBag.items[bonusHerbId] = 0;
            herbalismState.craftBag.items[bonusHerbId] += 2;
            
            showBanner('🧚 采药仙子！', `一位白衣仙子飘然而至："看你心诚，送你两株仙草。"然后消失了...`, 'legendary');
            if (typeof SoundFX !== 'undefined') SoundFX.play('gather_miracle');
        }
        else {
            // 正常采集或珍稀草药
            let qty = 1;
            let displayHerb = herb;
            
            if(specialEvent === 'rare_herb'){
                // 品质提升
                const upgradeMap = { common: 'uncommon', uncommon: 'rare', rare: 'rare' };
                const newRarity = upgradeMap[herb.rarity];
                if(newRarity){
                    // 寻找同类型更高品质的草药
                    const terrain = herbalismState.location.terrain || 'plain';
                    const betterHerbs = Object.entries(HERB_TYPES).filter(([id, h]) => 
                        h.rarity === newRarity && h.terrain.includes(terrain)
                    );
                    if(betterHerbs.length > 0){
                        const [betterId, betterHerb] = betterHerbs[Math.floor(Math.random() * betterHerbs.length)];
                        displayHerb = { ...betterHerb, id: betterId };
                        herbId = betterId;
                    }
                }
                showBanner('✨ 珍稀发现！', `发现品质更好的草药！`, 'rare');
            }
            
            if (!herbalismState.craftBag.items[herbId]) herbalismState.craftBag.items[herbId] = 0;
            herbalismState.craftBag.items[herbId] += qty;
            
            // 播放采集成功音效
            if (typeof SoundFX !== 'undefined') {
                SoundFX.play(specialEvent === 'rare_herb' ? 'gather_rare' : 'gather_success');
            }
            
            const rarityLabel = specialEvent === 'rare_herb' ? '【珍稀】' : '';
            showBanner('采集成功', `获得 ${displayHerb.icon} ${displayHerb.name}${rarityLabel} x${qty}`, 'success');
            if (typeof edS !== 'undefined') edS.exp = (edS.exp || 0) + displayHerb.value * 2;
        }
        
        if (typeof addLogEntry === 'function') addLogEntry(`在${herbalismState.location.name}采集到${herb.name}`, 'herbalism');
    } else {
        // 播放采集失败音效
        if (typeof SoundFX !== 'undefined') {
            SoundFX.play('gather_fail');
        }
        
        showBanner('采集失败', '未能找到草药，再试一次吧', 'warning');
    }
    
    herbalismState.gatherTarget = null;
    herbalismState.gatherProgress = 0;
    herbalismState.animation = null;
    herbalismRender();
}

function herbalismSelectRecipe(recipeId) {
    herbalismState.selectedRecipe = recipeId;
    herbalismState.craftingAmount = 1;
    herbalismRender();
}

function herbalismCanCraft(recipe) {
    for (const [herbId, amount] of Object.entries(recipe.ingredients)) {
        const hasAmount = herbalismState.craftBag.items[herbId] || 0;
        if (hasAmount < amount) return false;
    }
    return true;
}

function herbalismAdjustAmount(delta) {
    const newAmount = Math.max(1, Math.min(99, herbalismState.craftingAmount + delta));
    herbalismState.craftingAmount = newAmount;
    herbalismRender();
}

function herbalismSetAmount(value) {
    const amount = parseInt(value) || 1;
    herbalismState.craftingAmount = Math.max(1, Math.min(99, amount));
    herbalismRender();
}

function herbalismCraft() {
    if (!herbalismState.selectedRecipe) return;
    const recipe = RECIPES.find(r => r.id === herbalismState.selectedRecipe);
    if (!recipe || !herbalismCanCraft(recipe)) return;
    
    const times = herbalismState.craftingAmount;
    
    for (const [herbId, amount] of Object.entries(recipe.ingredients)) {
        const hasAmount = herbalismState.craftBag.items[herbId] || 0;
        if (hasAmount < amount * times) {
            showBanner('材料不足', `${HERB_TYPES[herbId].name} 数量不足`, 'warning');
            return;
        }
    }
    
    for (const [herbId, amount] of Object.entries(recipe.ingredients)) {
        herbalismState.craftBag.items[herbId] -= amount * times;
        if (herbalismState.craftBag.items[herbId] <= 0) delete herbalismState.craftBag.items[herbId];
    }
    
    const resultItem = recipe.result.item;
    const resultAmount = recipe.result.amount * times;
    
    if (!herbalismState.consumables.items[resultItem]) herbalismState.consumables.items[resultItem] = 0;
    herbalismState.consumables.items[resultItem] += resultAmount;

    // 同步到 wuxia_consumables（背包通用存储）
    _herbSyncToConsumableBag(resultItem, resultAmount);

    const expGain = recipe.rarity === 'common' ? 20 : recipe.rarity === 'uncommon' ? 40 : 60;
    if (typeof edS !== 'undefined') edS.exp = (edS.exp || 0) + expGain * times;
    
    // 播放炼制成功音效
    if (typeof SoundFX !== 'undefined') {
        SoundFX.play('craft_success');
    }
    
    showBanner('炼制成功', `获得 ${recipe.icon} ${recipe.name} x${resultAmount}`, 'success');
    if (typeof addLogEntry === 'function') addLogEntry(`成功炼制${recipe.name} x${resultAmount}`, 'herbalism');

    // ── 成就系统触发 ──
    if(typeof achOnHerbCraft === 'function') achOnHerbCraft(recipe.rarity || 'common');
    
    herbalismRender();
}

function herbalismRenderCraftBag() {
    const items = [];
    for (const [itemId, amount] of Object.entries(herbalismState.craftBag.items || {})) {
        if (amount > 0) {
            const herb = HERB_TYPES[itemId];
            if (herb) items.push({ ...herb, id: itemId, amount });
        }
    }
    
    if (items.length === 0) return '<div class="herbalism-empty-bag">背包为空</div>';
    
    return items.map(item => `
        <div class="herbalism-bag-item">
            <div class="herbalism-bag-icon">${item.icon}</div>
            <div class="herbalism-bag-name">${item.name}</div>
            <div class="herbalism-bag-amount">x${item.amount}</div>
        </div>
    `).join('');
}

function herbalismGetRarityName(rarity) {
    const names = { common: '普通', uncommon: '稀有', rare: '珍贵', legendary: '传说' };
    return names[rarity] || '未知';
}

// ── 草药制品同步到 wuxia_consumables（背包通用存储）──
function _herbSyncToConsumableBag(itemId, addedQty) {
    // 查找该草药制品的元数据（从 RECIPES 找）
    const recipe = RECIPES.find(r => r.result && r.result.item === itemId);
    if(!recipe) return;
    try {
        const bag = JSON.parse(localStorage.getItem('wuxia_consumables') || '[]');
        const idx = bag.findIndex(e => e.id === itemId);
        if(idx >= 0) {
            bag[idx].qty = (bag[idx].qty || 0) + addedQty;
        } else {
            bag.push({ id: itemId, name: recipe.name, icon: recipe.icon || '🌿',
                desc: '炼制药品', qty: addedQty });
        }
        localStorage.setItem('wuxia_consumables', JSON.stringify(bag));
        // 通知城镇背包刷新
        if(typeof window.refreshTownBag === 'function') window.refreshTownBag();
    } catch(e) { console.error('[herbalism] sync error:', e); }
}

function showBanner(title, message, type = 'info') {
    if (typeof showGameBanner === 'function') showGameBanner(title, message, type);
    else alert(`${title}: ${message}`);
}

function showDialog(config) {
    if (typeof showGameDialog === 'function') showGameDialog(config);
    else alert(config.content);
}

function getWorldData() {
    if (typeof WORLD_DATA !== 'undefined') return WORLD_DATA;
    return {};
}

// 采药制药系统已加载