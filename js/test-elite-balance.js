// 高级别精英NPC战斗平衡测试工具
// 在浏览器控制台中运行

(function() {
  'use strict';
  
  console.clear();
  console.log('═'.repeat(70));
  console.log('高级别精英NPC战斗平衡分析');
  console.log('═'.repeat(70));
  
  // 查找所有Lv90+的elite NPC
  const eliteNpcs = [];
  const npcFiles = [NPC_DB, NPC_DATA_CAPITAL, NPC_DATA_CENTRAL, NPC_DATA_SECTS];
  
  npcFiles.forEach((db, idx) => {
    if (!db) return;
    Object.entries(db).forEach(([id, npc]) => {
      if (npc.tier === 'elite' && npc.level >= 90) {
        eliteNpcs.push({
          id: id,
          name: npc.name || id,
          level: npc.level,
          city: npc.city || '未知',
          weapon: npc.weapon,
          armor: npc.armor
        });
      }
    });
  });
  
  if (eliteNpcs.length === 0) {
    console.log('❌ 未找到Lv90+ elite NPC');
    return;
  }
  
  console.log(`\n✓ 找到 ${eliteNpcs.length} 个Lv90+ elite NPC:`);
  eliteNpcs.forEach(npc => {
    console.log(`  - ${npc.name} (Lv${npc.level}) @ ${npc.city}`);
  });
  
  // 模拟战斗分析
  console.log('\n' + '═'.repeat(70));
  console.log('战斗胜率预测分析');
  console.log('═'.repeat(70));
  
  const playerLevels = [80, 85, 90, 95, 100];
  
  eliteNpcs.forEach(npc => {
    console.log(`\n【${npc.name}】 Lv${npc.level} (elite)`);
    console.log('─'.repeat(70));
    
    // 初始化NPC战斗数据
    const npcInstId = `test_${npc.id}`;
    if (typeof initNpcCombat === 'function') {
      initNpcCombat(npc.id, npcInstId, {
        level: npc.level,
        tier: 'elite',
        lvMin: npc.level,
        lvMax: npc.level,
        silverMin: 100,
        silverMax: 300
      });
      
      const npcStats = getNpcCombatStats(npcInstId);
      if (!npcStats) {
        console.log('  ❌ 无法获取NPC战斗数据');
        return;
      }
      
      playerLevels.forEach(plv => {
        // 模拟玩家属性（假设有装备）
        const playerHp = 150 + plv * 3 + 50; // 基础 + 等级成长 + 装备
        const playerAtk = 15 + int(plv * 0.8) + 20; // 基础 + 等级成长 + 装备
        const playerDef = 10 + int(plv * 0.5) + 15; // 基础 + 等级成长 + 装备
        const playerCrit = min(10 + 15, 45); // 基础 + 装备
        const playerDodge = min(8 + 12, 35); // 基础 + 装备
        const playerSpd = 8 + plv * 0.1 + 2; // 基础 + 等级成长 + 装备
        
        // 简化战斗模拟
        const playerDmgPerTurn = max(1, playerAtk - npcStats.def / 2);
        const npcDmgPerTurn = max(1, npcStats.atk - playerDef / 2);
        
        // 考虑暴击（简化计算）
        const playerAvgDmg = playerDmgPerTurn * (1 + min(playerCrit, 40) / 100 * 0.5);
        const npcAvgDmg = npcDmgPerTurn * (1 + min(npcStats.crit, 40) / 100 * 0.5);
        
        // 计算击杀所需回合数
        const turnsToKillNpc = Math.ceil(npcStats.maxHp / playerAvgDmg);
        const turnsToKillPlayer = Math.ceil(playerHp / npcAvgDmg);
        
        // 估算胜率（简化模型）
        let winRate = 0;
        if (turnsToKillNpc < turnsToKillPlayer) {
          winRate = 0.6 + (turnsToKillPlayer - turnsToKillNpc) * 0.05;
        } else if (turnsToKillNpc > turnsToKillPlayer) {
          winRate = 0.3 - (turnsToKillNpc - turnsToKillPlayer) * 0.03;
        } else {
          winRate = 0.45;
        }
        
        // 速度因素
        if (playerSpd > npcStats.spd + 5) {
          winRate += 0.1;
        } else if (npcStats.spd > playerSpd + 5) {
          winRate -= 0.1;
        }
        
        winRate = Math.max(0.05, Math.min(0.95, winRate));
        
        // 评估
        let rating, color;
        if (winRate < 0.05) {
          rating = "极低 (<5%)";
          color = "#ff4444";
        } else if (winRate < 0.10) {
          rating = "过低 (5-10%)";
          color = "#ff8844";
        } else if (winRate < 0.15) {
          rating = "偏低 (10-15%)";
          color = "#ffcc44";
        } else if (winRate < 0.25) {
          rating = "适中 (15-25%)";
          color = "#44ff44";
        } else {
          rating = "过高 (>25%)";
          color = "#4444ff";
        }
        
        console.log(`  玩家Lv${plv}: 胜率 ${(winRate * 100).toFixed(1)}% %c${rating}`, `color:${color}`);
      });
    }
  });
  
  console.log('\n' + '═'.repeat(70));
  console.log('平衡调整建议');
  console.log('═'.repeat(70));
  console.log('\n当前elite倍率: 2.4 (固定)');
  console.log('建议采用动态倍率，随等级增加而降低:');
  console.log('  Lv50-70:  倍率 2.4 (保持)');
  console.log('  Lv71-85:  倍率 2.2 (-8%)');
  console.log('  Lv86-100: 倍率 2.0 (-17%)');
  console.log('\n或调整基础属性成长:');
  console.log('  - maxHp: 2.2 → 1.8/级 (elite)');
  console.log('  - atk:   0.35 → 0.28/级 (elite)');
  console.log('\n目标: Lv90+ elite NPC vs Lv90-100玩家 → 胜率10-20%');
  
  // 辅助函数
  function int(x) { return Math.floor(x); }
  function min(a, b) { return Math.min(a, b); }
  function max(a, b) { return Math.max(a, b); }
  
})();
