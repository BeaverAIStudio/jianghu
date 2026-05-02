// leaderboard.js — 全服排行榜系统 v2.0
// ═══════════════════════════════════════════════════════════════
// v2.0：后端不可用时自动切换到本地模拟排行（AI对手+历史记录）

const LB_API_BASE = 'http://localhost:5000/api'; // 后端 API 地址
const LB_KEY = 'wuxia_leaderboard_player';
const LB_LOCAL_KEY = 'wuxia_leaderboard_local'; // 本地排行缓存
const LB_NPC_SEED_KEY = 'wuxia_leaderboard_npc_seed'; // NPC种子（固定生成同一批对手）

// ── 玩家标识（本地生成唯一ID）──
function lbGetPlayerId() {
  let pid = localStorage.getItem(LB_KEY + '_id');
  if (!pid) {
    pid = 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(LB_KEY + '_id', pid);
  }
  return pid;
}

function lbGetPlayerName() {
  const ed = localStorage.getItem('wuxia_editor');
  if (ed) {
    try {
      const data = JSON.parse(ed);
      return data.name || '无名侠士';
    } catch(e) {}
  }
  return '无名侠士';
}

function lbGetPlayerLevel() {
  const ed = localStorage.getItem('wuxia_editor');
  if (ed) {
    try {
      const data = JSON.parse(ed);
      return data.level || 1;
    } catch(e) {}
  }
  return 1;
}

function lbGetPlayerSect() {
  const ed = localStorage.getItem('wuxia_editor');
  if (ed) {
    try {
      const data = JSON.parse(ed);
      if (data.sect && typeof SECTS !== 'undefined') {
        const sect = SECTS.find(s => s.id === data.sect);
        return sect ? sect.name : data.sect;
      }
    } catch(e) {}
  }
  return '散人';
}

function lbGetPlayerTitle() {
  const ed = localStorage.getItem('wuxia_editor');
  if (ed) {
    try {
      const data = JSON.parse(ed);
      return data.title || '江湖新秀';
    } catch(e) {}
  }
  return '江湖新秀';
}

// ── 获取玩家统计数据 ──
function lbGetPlayerStats() {
  const ed = localStorage.getItem('wuxia_editor');
  let stats = {
    maxHp: 100,
    atk: 10,
    def: 5,
    crit: 0.05,
    dodge: 0.03,
    speed: 10
  };
  
  if (ed) {
    try {
      const data = JSON.parse(ed);
      stats = {
        maxHp: data.maxHp || 100,
        atk: data.atk || 10,
        def: data.def || 5,
        crit: data.crit || 0.05,
        dodge: data.dodge || 0.03,
        speed: data.speed || 10
      };
    } catch(e) {}
  }
  
  // 计算战力值
  stats.power = Math.floor(
    stats.maxHp * 0.5 +
    stats.atk * 10 +
    stats.def * 8 +
    stats.speed * 5 +
    (stats.crit + stats.dodge) * 100
  );
  
  return stats;
}

// ═══════════════════════════════════════════════════════════════
//  本地模拟排行（后端不可用时的 fallback）
// ═══════════════════════════════════════════════════════════════

// 武侠风格NPC名字池
const LB_NPC_NAMES = [
  '独孤求败','西门吹雪','叶孤城','花满楼','陆小凤','楚留香','李寻欢',
  '萧峰','段誉','虚竹','郭靖','杨过','张无忌','令狐冲','韦小宝',
  '乔峰','黄药师','欧阳锋','洪七公','一灯大师','周伯通','王重阳',
  '风清扬','张三丰','冲虚道长','方证大师','左冷禅','岳不群','东方不败',
  '任我行','向问天','任盈盈','林平之','余沧海','木高峰','刘正风',
  '莫大','定闲师太','定逸师太','天门道人','灭绝师太','纪晓芙','殷素素',
  '赵敏','周芷若','小昭','谢逊','黛绮丝','韦一笑','殷天正',
  '青翼蝠王','紫衫龙王','白眉鹰王','金毛狮王','胡一刀','苗人凤',
  '袁承志','夏雪宜','温青青','何铁手','穆人清','归辛树','归二娘',
];

const LB_NPC_TITLES = ['江湖新秀','初出茅庐','小有名气','名声鹊起','江湖豪杰','一代宗师','绝世高手','天下无敌'];
const LB_NPC_SECTS = ['少林派','武当派','华山派','峨眉派','昆仑派','崆峒派','丐帮','明教','逍遥派','天山派','唐门','五毒教','桃花岛','全真教','衡山派'];

// 简单伪随机（seeded，保证同一种子生成同一批NPC）
function _lbSeededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// 获取/初始化NPC种子
function _lbGetNpcSeed() {
  let seed = parseInt(localStorage.getItem(LB_NPC_SEED_KEY));
  if (!seed || isNaN(seed)) {
    seed = Math.floor(Math.random() * 2147483646) + 1;
    localStorage.setItem(LB_NPC_SEED_KEY, String(seed));
  }
  return seed;
}

// 生成模拟NPC数据（基于玩家等级动态缩放）
function _lbGenerateNpcData(type, playerLevel, count) {
  const seed = _lbGetNpcSeed();
  const rng = _lbSeededRandom(seed + type.length * 1000); // 不同榜单不同NPC分布
  const npcs = [];

  for (let i = 0; i < count; i++) {
    const name = LB_NPC_NAMES[Math.floor(rng() * LB_NPC_NAMES.length)];
    const sect = LB_NPC_SECTS[Math.floor(rng() * LB_NPC_SECTS.length)];
    const title = LB_NPC_TITLES[Math.floor(rng() * LB_NPC_TITLES.length)];

    // 等级围绕玩家等级波动（±40级范围）
    const lvVariation = Math.floor(rng() * 80) - 40;
    const npcLevel = Math.max(1, Math.min(120, playerLevel + lvVariation));

    let stats;
    if (type === 'level') {
      stats = { power: npcLevel * 15 + Math.floor(rng() * 200), maxHp: npcLevel * 8 + Math.floor(rng() * 100), atk: npcLevel + Math.floor(rng() * 20) };
    } else if (type === 'power') {
      const power = npcLevel * (15 + Math.floor(rng() * 10));
      stats = { power, maxHp: Math.floor(power * 0.4), atk: Math.floor(power * 0.15) };
    } else if (type === 'hp') {
      const hp = npcLevel * (10 + Math.floor(rng() * 15));
      stats = { power: hp * 2, maxHp: hp, atk: Math.floor(hp * 0.08) };
    } else {
      const atk = npcLevel * (2 + Math.floor(rng() * 5));
      stats = { power: atk * 8, maxHp: Math.floor(atk * 5), atk };
    }

    npcs.push({
      playerId: 'npc_' + i + '_' + seed,
      name,
      level: npcLevel,
      sect,
      title,
      stats,
      timestamp: Date.now() - Math.floor(rng() * 86400000),
    });
  }

  return npcs;
}

// 本地排行数据组装（含玩家自身 + NPC模拟对手）
function _lbGetLocalLeaderboard(type, limit) {
  // 获取玩家数据
  const myData = {
    playerId: lbGetPlayerId(),
    name: lbGetPlayerName(),
    level: lbGetPlayerLevel(),
    sect: lbGetPlayerSect(),
    title: lbGetPlayerTitle(),
    stats: lbGetPlayerStats(),
    timestamp: Date.now(),
  };

  // 生成NPC对手
  const npcs = _lbGenerateNpcData(type, myData.level, limit - 1);

  // 合并并排序
  const all = [myData, ...npcs];
  all.sort((a, b) => {
    const va = lbGetDisplayValue(a, type);
    const vb = lbGetDisplayValue(b, type);
    return vb - va;
  });

  return all.slice(0, limit);
}

// 计算玩家在本地排行中的名次
function _lbGetLocalRank(type, board) {
  const myId = lbGetPlayerId();
  const idx = board.findIndex(p => p.playerId === myId);
  return {
    success: true,
    data: {
      rank: idx >= 0 ? idx + 1 : board.length + 1,
      value: idx >= 0 ? lbGetDisplayValue(board[idx], type) : 0,
      total: board.length,
    }
  };
}

// ═══════════════════════════════════════════════════════════════
//  后端接口（仅在服务器可用时使用）
// ═══════════════════════════════════════════════════════════════

async function lbFetchFromServer(type = 'level', limit = 50) {
  try {
    const response = await fetch(`${LB_API_BASE}/leaderboard?type=${type}&limit=${limit}`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error('获取失败');
    return await response.json();
  } catch(e) {
    return { success: false, data: [] };
  }
}

async function lbFetchRankFromServer(type = 'level') {
  try {
    const response = await fetch(`${LB_API_BASE}/player/rank?playerId=${lbGetPlayerId()}&type=${type}`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error('获取失败');
    return await response.json();
  } catch(e) {
    return { success: false };
  }
}

// ── 上报玩家数据 ──
async function lbSubmitPlayerData() {
  const playerData = {
    playerId: lbGetPlayerId(),
    name: lbGetPlayerName(),
    level: lbGetPlayerLevel(),
    sect: lbGetPlayerSect(),
    title: lbGetPlayerTitle(),
    stats: lbGetPlayerStats(),
    timestamp: Date.now()
  };
  
  try {
    const response = await fetch(`${LB_API_BASE}/player/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData),
      signal: AbortSignal.timeout(3000),
    });
    
    if (!response.ok) throw new Error('提交失败');
    return await response.json();
  } catch(e) {
    // 静默失败，本地排行仍可工作
    return { success: false };
  }
}
// ═══════════════════════════════════════════════════════════════

// ── 显示排行榜主界面 ──
function showLeaderboard() {
  // 先上报当前数据
  lbSubmitPlayerData();
  
  const overlay = document.createElement('div');
  overlay.id = 'leaderboardOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,.92);z-index:500;
    display:flex;align-items:center;justify-content:center;
    padding:20px;overflow-y:auto;
  `;
  
  overlay.innerHTML = `
    <div style="
      background:rgba(5,4,16,.98);border:1px solid rgba(240,192,96,.2);
      border-radius:12px;width:100%;max-width:600px;max-height:90vh;
      display:flex;flex-direction:column;">
      
      <!-- 标题 -->
      <div style="padding:20px 24px;border-bottom:1px solid rgba(240,192,96,.1);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:28px">🏆</span>
            <div>
              <div style="font-size:18px;color:#ffd060;letter-spacing:2px;">江湖排行榜</div>
              <div style="font-size:11px;color:#806040;margin-top:2px;">全服侠士实力排名</div>
            </div>
          </div>
          <button onclick="document.getElementById('leaderboardOverlay').remove()"
            style="background:none;border:none;color:#a08060;font-size:20px;cursor:pointer;padding:4px;">✕</button>
        </div>
      </div>
      
      <!-- 标签页 -->
      <div style="display:flex;gap:0;border-bottom:1px solid rgba(240,192,96,.1);padding:0 24px;">
        <button class="lb-tab active" data-tab="level" onclick="lbSwitchTab('level')"
          style="padding:12px 20px;background:none;border:none;border-bottom:2px solid #f0c060;color:#f0c060;font-family:inherit;font-size:13px;cursor:pointer;">等级榜</button>
        <button class="lb-tab" data-tab="power" onclick="lbSwitchTab('power')"
          style="padding:12px 20px;background:none;border:none;border-bottom:2px solid transparent;color:#806040;font-family:inherit;font-size:13px;cursor:pointer;">战力榜</button>
        <button class="lb-tab" data-tab="hp" onclick="lbSwitchTab('hp')"
          style="padding:12px 20px;background:none;border:none;border-bottom:2px solid transparent;color:#806040;font-family:inherit;font-size:13px;cursor:pointer;">气血榜</button>
        <button class="lb-tab" data-tab="atk" onclick="lbSwitchTab('atk')"
          style="padding:12px 20px;background:none;border:none;border-bottom:2px solid transparent;color:#806040;font-family:inherit;font-size:13px;cursor:pointer;">攻击榜</button>
      </div>
      
      <!-- 我的排名 -->
      <div id="lbMyRank" style="padding:16px 24px;background:rgba(240,192,96,.05);border-bottom:1px solid rgba(240,192,96,.1);">
        <div style="color:#806040;font-size:12px;text-align:center;">正在获取您的排名...</div>
      </div>
      
      <!-- 排行榜列表 -->
      <div id="lbList" style="flex:1;overflow-y:auto;padding:12px 0;max-height:50vh;">
        <div style="text-align:center;padding:40px;color:#604830;">
          <div style="font-size:24px;margin-bottom:8px">⚔</div>
          <div style="font-size:12px;">正在加载排行榜...</div>
        </div>
      </div>
      
      <!-- 底部说明 -->
      <div id="lbFooter" style="padding:12px 24px;border-top:1px solid rgba(240,192,96,.1);font-size:10px;color:#503820;text-align:center;">
        数据每小时更新一次 · 战力根据气血、攻击、防御、速度综合计算
      </div>
    </div>
  `;
  
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  
  // 加载数据
  lbLoadData('level');
}

// ── 切换标签页 ──
function lbSwitchTab(type) {
  // 更新标签样式
  document.querySelectorAll('.lb-tab').forEach(tab => {
    if (tab.dataset.tab === type) {
      tab.style.borderBottomColor = '#f0c060';
      tab.style.color = '#f0c060';
    } else {
      tab.style.borderBottomColor = 'transparent';
      tab.style.color = '#806040';
    }
  });
  
  // 重新加载数据
  lbLoadData(type);
}

// ── 加载排行榜数据（优先后端，失败用本地fallback）──
async function lbLoadData(type) {
  const listEl = document.getElementById('lbList');
  const myRankEl = document.getElementById('lbMyRank');
  
  // 显示加载中
  listEl.innerHTML = `
    <div style="text-align:center;padding:40px;color:#604830;">
      <div style="font-size:24px;margin-bottom:8px">⚔</div>
      <div style="font-size:12px;">正在加载排行榜...</div>
    </div>
  `;

  let board = null;
  let rankResult = null;
  let usedFallback = false;

  // 尝试从后端获取
  try {
    const [lbResult, rankRes] = await Promise.all([
      lbFetchFromServer(type),
      lbFetchRankFromServer(type)
    ]);
    if (lbResult.success && lbResult.data && lbResult.data.length > 0) {
      board = lbResult.data;
      rankResult = rankRes;
    }
  } catch(e) {}

  // 后端失败 → 使用本地 fallback
  if (!board) {
    usedFallback = true;
    board = _lbGetLocalLeaderboard(type, 50);
    rankResult = _lbGetLocalRank(type, board);
  }
  
  // 渲染我的排名
  if (rankResult && rankResult.success && rankResult.data) {
    const r = rankResult.data;
    const rankColor = r.rank <= 3 ? '#ffd060' : (r.rank <= 10 ? '#c0a060' : '#806040');
    const rankIcon = r.rank === 1 ? '👑' : (r.rank === 2 ? '🥈' : (r.rank === 3 ? '🥉' : '⚔'));
    
    myRankEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:20px">${rankIcon}</span>
          <div>
            <div style="font-size:14px;color:${rankColor};font-weight:bold;">我的排名：第 ${r.rank} 名</div>
            <div style="font-size:11px;color:#604830;margin-top:2px;">${r.value || 0} ${lbGetUnit(type)}</div>
          </div>
        </div>
        <div style="font-size:11px;color:#503820;">
          共 ${r.total || '?'} 位侠士${usedFallback ? ' (本地排行)' : ''}
        </div>
      </div>
    `;
  } else {
    myRankEl.innerHTML = `
      <div style="text-align:center;color:#604830;font-size:12px;">
        无法获取您的排名
      </div>
    `;
  }
  
  // 渲染排行榜列表
  if (board && board.length > 0) {
    listEl.innerHTML = board.map((p, i) => lbRenderPlayerRow(p, i + 1, type)).join('');
  } else {
    listEl.innerHTML = `
      <div style="text-align:center;padding:40px;color:#604830;">
        <div style="font-size:24px;margin-bottom:8px">📡</div>
        <div style="font-size:12px;">无法连接到排行榜服务器</div>
        <div style="font-size:10px;margin-top:8px;color:#403020;">请检查网络连接或稍后再试</div>
      </div>
    `;
  }
}

// ── 渲染玩家行 ──
function lbRenderPlayerRow(p, rank, type) {
  const isMe = p.playerId === lbGetPlayerId();
  const bgStyle = isMe 
    ? 'background:rgba(240,192,96,.12);border-left:3px solid #f0c060;' 
    : 'background:none;border-left:3px solid transparent;';
  
  const rankStyle = rank <= 3 
    ? `color:${['#ffd060','#c0c0c0','#cd7f32'][rank-1]};font-weight:bold;` 
    : 'color:#806040;';
  const rankIcon = rank === 1 ? '👑' : (rank === 2 ? '🥈' : (rank === 3 ? '🥉' : rank));
  
  const value = lbGetDisplayValue(p, type);
  
  return `
    <div style="${bgStyle}padding:12px 24px;display:flex;align-items:center;gap:16px;border-bottom:1px solid rgba(240,192,96,.05);">
      <div style="width:40px;text-align:center;font-size:16px;${rankStyle}">${rankIcon}</div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:14px;color:#e8d5a3;font-weight:bold;">${p.name || '无名侠士'}</span>
          ${p.sect ? `<span style="font-size:10px;color:#806040;">[${p.sect}]</span>` : ''}
          ${isMe ? '<span style="font-size:10px;color:#f0c060;background:rgba(240,192,96,.15);padding:1px 6px;border-radius:3px;">我</span>' : ''}
        </div>
        <div style="font-size:11px;color:#604030;">${p.title || '江湖新秀'} · Lv.${p.level || 1}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:14px;color:#f0c060;font-weight:bold;">${value}</div>
        <div style="font-size:10px;color:#604830;">${lbGetUnit(type)}</div>
      </div>
    </div>
  `;
}

// ── 获取显示值 ──
function lbGetDisplayValue(p, type) {
  switch(type) {
    case 'level': return p.level || 1;
    case 'power': return p.stats?.power || 0;
    case 'hp': return p.stats?.maxHp || 100;
    case 'atk': return p.stats?.atk || 10;
    default: return 0;
  }
}

// ── 获取单位 ──
function lbGetUnit(type) {
  switch(type) {
    case 'level': return '级';
    case 'power': return '战力';
    case 'hp': return '气血';
    case 'atk': return '攻击';
    default: return '';
  }
}

// ═══════════════════════════════════════════════════════════════
//  自动上报
// ═══════════════════════════════════════════════════════════════

// ── 定期上报（每30分钟）──
function lbStartAutoSubmit() {
  // 立即上报一次
  lbSubmitPlayerData();
  
  // 每30分钟上报一次
  setInterval(() => {
    lbSubmitPlayerData();
  }, 30 * 60 * 1000);
}

// ── 页面加载时启动自动上报 ──
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // 延迟5秒后启动，避免影响页面加载性能
    setTimeout(lbStartAutoSubmit, 5000);
  });
}

// ═══════════════════════════════════════════════════════════════
//  导出
// ═══════════════════════════════════════════════════════════════

window.showLeaderboard = showLeaderboard;
window.lbSwitchTab = lbSwitchTab;
window.lbSubmitPlayerData = lbSubmitPlayerData;
