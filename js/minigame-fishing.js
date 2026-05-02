/**
 * minigame-fishing.js — 江湖垂钓 v9
 *
 * v9: 增强飞行鱼线可见性
 *   - stroke-width: 1.5 → 2.5
 *   - stroke颜色: rgba(200,230,255,0.65) → #aaddff
 *   - stroke-dasharray: 400 → 600（匹配路径长度）
 *   - opacity: 0.8→0.3 → 0.9→0.6
 *   - 添加filter: drop-shadow发光效果
 *
 * v8: 修复鱼线重叠
 *   - 抛竿动画期间禁用RAF鱼线更新，避免覆盖飞行鱼线
 *   - 抛竿结束强制重绘idle鱼线，确保单根显示
 *
 * v7: 修复竿重叠（2026-03-31）
 *   - 抛竿开始时清除rodWrap的animation和transform
 *   - 抛竿结束时用requestAnimationFrame分离清除和应用动画
 *   - RAF循环增加判断，避免覆盖正在运行的抛竿/起竿动画
 *
 * v6: 流畅动画版
 *   - 舞台改为 DOM 分层，独立元素各自做 CSS 动画
 *   - 水面波纹：CSS keyframes 持续滚动，60fps 无跳帧
 *   - 浮漂：JS requestAnimationFrame 正弦浮动
 *   - 鱼影：CSS transition translateX 平滑滑入
 *   - 状态切换：只改 CSS class，动画自动过渡
 *   - 背景光晕：CSS transition 渐变
 */

// ═══════════════════════════════════════════════
// 1. 数据
// ═══════════════════════════════════════════════

const FISH_DB = [
  { id:'carp',        name:'鲤鱼',   icon:'🐟', rarity:'common',    weight:[0.5,2.5],  value:5,   minLevel:1,  spots:['river','lake','canal'] },
  { id:'crucian',     name:'鲫鱼',   icon:'🐟', rarity:'common',    weight:[0.2,0.8],  value:3,   minLevel:1,  spots:['river','lake','canal','pond'] },
  { id:'catfish',     name:'鲶鱼',   icon:'🐠', rarity:'common',    weight:[0.5,3.0],  value:8,   minLevel:1,  spots:['river','lake'] },
  { id:'eel',         name:'鳗鱼',   icon:'🐍', rarity:'uncommon',  weight:[0.3,1.5],  value:15,  minLevel:3,  spots:['river','sea'] },
  { id:'snakehead',   name:'乌鱼',   icon:'🐠', rarity:'uncommon',  weight:[0.8,4.0],  value:20,  minLevel:5,  spots:['lake','pond'] },
  { id:'mandarin',    name:'鳜鱼',   icon:'🐡', rarity:'rare',      weight:[0.5,3.5],  value:40,  minLevel:8,  spots:['river','lake'] },
  { id:'trout',       name:'鳟鱼',   icon:'🐡', rarity:'rare',      weight:[0.5,2.0],  value:35,  minLevel:8,  spots:['mountain'] },
  { id:'sturgeon',    name:'鲟鱼',   icon:'🦈', rarity:'rare',      weight:[2.0,8.0],  value:60,  minLevel:12, spots:['river','sea'] },
  { id:'golden_carp', name:'金鲤',   icon:'🌟', rarity:'epic',      weight:[1.0,3.0],  value:150, minLevel:15, spots:['river','lake','pond'] },
  { id:'dragon_fish', name:'龙睛鱼', icon:'🐉', rarity:'legendary', weight:[0.5,1.5],  value:500, minLevel:20, spots:['mountain','lake'] },
  { id:'sword_fish',  name:'剑鱼',   icon:'⚔️', rarity:'epic',      weight:[3.0,10.0], value:200, minLevel:18, spots:['sea'] },
  { id:'puffer',      name:'河豚',   icon:'🐡', rarity:'uncommon',  weight:[0.3,1.5],  value:25,  minLevel:6,  spots:['sea','river'] },
  { id:'jade_shrimp', name:'玉虾',   icon:'🦐', rarity:'uncommon',  weight:[0.1,0.3],  value:18,  minLevel:4,  spots:['pond','canal'] },
  { id:'old_boot',    name:'破靴子', icon:'👢', rarity:'junk',      weight:[0.1,0.1],  value:0,   minLevel:1,  spots:['river','canal','lake','sea','mountain','pond'] },
  { id:'bamboo_hat',  name:'破斗笠', icon:'🎩', rarity:'junk',      weight:[0.1,0.1],  value:0,   minLevel:1,  spots:['river','canal','lake','sea','mountain','pond'] },
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"钓鱼恶搞鱼类
  // ═══════════════════════════════════════════════════════════════
  { id:'can_fish',    name:'罐头鱼', icon:'🥫', rarity:'junk',      weight:[0.3,0.5],  value:1,   minLevel:1,  spots:['river','canal','lake','sea'], desc:'这鱼怎么是铁皮的？' },
  { id:'plastic_bag', name:'塑料袋鱼', icon:'🛍️', rarity:'junk',      weight:[0.1,0.2],  value:0,   minLevel:1,  spots:['river','canal','lake','sea'], desc:'环保大使看了会流泪' },
  { id:'message_bottle', name:'漂流瓶', icon:'🍾', rarity:'uncommon',  weight:[0.2,0.4],  value:10,  minLevel:1,  spots:['sea','lake'], desc:'里面装着...一张"再来一瓶"？' },
  { id:'golden_wrench', name:'金扳手', icon:'🔧', rarity:'epic',      weight:[0.5,1.0],  value:80,  minLevel:5,  spots:['river','canal'], desc:'水管工的马里奥掉落的？' },
  { id:'mermaid_doll', name:'美人鱼玩偶', icon:'🧜', rarity:'rare',      weight:[0.3,0.8],  value:45,  minLevel:3,  spots:['sea','lake'], desc:'塑料做的，但做工还挺精致' },
  { id:'time_fish',   name:'时光鱼', icon:'⏰', rarity:'legendary', weight:[0.1,0.3],  value:300, minLevel:15, spots:['river','lake'], desc:'据说能倒流时间...但只是据说' },
  { id:'noodle_fish', name:'面条鱼', icon:'🍜', rarity:'uncommon',  weight:[0.2,0.5],  value:12,  minLevel:1,  spots:['river','canal'], desc:'这鱼怎么长得跟拉面似的' },
  { id:'dancing_crab', name:'舞蟹', icon:'🦀', rarity:'rare',      weight:[0.5,1.5],  value:50,  minLevel:8,  spots:['sea'], desc:'它会跳街舞！真的！' },
  { id:'invisible_fish', name:'透明鱼', icon:'👻', rarity:'epic',      weight:[0.1,0.3],  value:120, minLevel:12, spots:['river','lake','pond'], desc:'你根本看不见它，但确实钓上来了' },
  { id:'lucky_cat_fish', name:'招财鱼', icon:'🐱', rarity:'legendary', weight:[0.5,1.0],  value:666, minLevel:20, spots:['pond','lake'], desc:'喵~（这鱼会猫叫！）' },
];

const SPOTS_DB = [
  {
    id:'river', name:'山间溪流', icon:'🏔️', minLevel:1,
    desc:'清澈山涧，水声潺潺',
    cities:['xian','luonan','taiyuan','chengdu','dali','lhasa','urumqi','dunhuang'],
    bgSky:'#071410', bgMid:'#0d2418', bgHill:'#0a1e14', waterColor:'#0a3a22', waterDeep:'#041610',
    fish:['carp','crucian','catfish','trout','mandarin','golden_carp','dragon_fish','old_boot'],
    rareExtra: 5,
    skyLines:[
      '  ·  ·  *    ·      ★  · ',
      ' 🌙         ·   ·        ',
      '  🌲🌲  🌲    🌲🌲   🌲 ',
      ' ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    ],
    midLines:[
      '░░░░░░░░░░░░░░░░░░░░░░░░░',
      '  🪨      🪨  🌿  🪨     ',
    ],
    shoreLine: '▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔',
    waterWave1: '#0d4a2a', waterWave2: '#0a3a22',
  },
  {
    id:'lake', name:'烟波湖泊', icon:'🌊', minLevel:1,
    desc:'烟波浩渺，大鱼出没',
    cities:['hangzhou','suzhou','wuhan','kunming','dali'],
    bgSky:'#050f22', bgMid:'#081830', bgHill:'#0a1e3a', waterColor:'#0a2d5a', waterDeep:'#040e20',
    fish:['carp','crucian','catfish','snakehead','mandarin','sturgeon','golden_carp','dragon_fish','old_boot'],
    rareExtra: 8,
    skyLines:[
      ' ★   ·    ★       ·   ★  ',
      '  ☁️  ☁️        ☁️   ·   ',
      ' 🌙              ✨  ·    ',
      '   ·     ·    ·      ·   ',
    ],
    midLines:[
      '░░░░░░░░░░░░░░░░░░░░░░░░░',
      ' ⛰️  ⛰️         ⛰️  ⛰️  ',
    ],
    shoreLine: '〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰〰',
    waterWave1: '#0d3a7a', waterWave2: '#0a2d5a',
  },
  {
    id:'sea', name:'沧海渔港', icon:'⛵', minLevel:5,
    desc:'海风咸腥，大鱼深藏',
    cities:['quanzhou','guangzhou','shanghai','ningbo','qingdao'],
    bgSky:'#020a16', bgMid:'#040e20', bgHill:'#061428', waterColor:'#082040', waterDeep:'#020c18',
    fish:['eel','puffer','sturgeon','sword_fish','golden_carp','old_boot','bamboo_hat'],
    rareExtra: 12,
    skyLines:[
      '  ·   ⭐    ·   ·    ⭐  ',
      ' ⛵        ·       ⛵   ·',
      '    ·   ·      ·         ',
      '  🌊  🌊    🌊   🌊  🌊 ',
    ],
    midLines:[
      '░░░░░░░░░░░░░░░░░░░░░░░░░',
      ' 🏝️        ·       🏝️   ',
    ],
    shoreLine: '～～～～～～～～～～～～～～～～',
    waterWave1: '#0a2a50', waterWave2: '#082040',
  },
  {
    id:'canal', name:'运河码头', icon:'🚤', minLevel:1,
    desc:'船来船往，杂鱼不少',
    cities:['kaifeng','bianjing','luoyang','cangzhou','yangzhou','nanjing'],
    bgSky:'#0c1408', bgMid:'#121c0a', bgHill:'#162010', waterColor:'#1a3a18', waterDeep:'#0a1808',
    fish:['carp','crucian','catfish','eel','jade_shrimp','golden_carp','old_boot','bamboo_hat'],
    rareExtra: 3,
    skyLines:[
      ' 🏮  🏮  🏮  🏮  🏮  🏮',
      '  🚤     🚤          🚤  ',
      '  |      |            |   ',
      '══════════════════════════',
    ],
    midLines:[
      '░░░░░░░░░░░░░░░░░░░░░░░░░',
      ' 🪣   ⚓     🪝   ⚓  🪣 ',
    ],
    shoreLine: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    waterWave1: '#1e4818', waterWave2: '#1a3a18',
  },
  {
    id:'pond', name:'桃花池塘', icon:'🌸', minLevel:1,
    desc:'花瓣飘落，清幽别致',
    cities:['hangzhou','suzhou','yangzhou','nanjing','chengdu','taohuadao'],
    bgSky:'#160620', bgMid:'#1e0a2c', bgHill:'#200d28', waterColor:'#2a1040', waterDeep:'#120620',
    fish:['crucian','snakehead','jade_shrimp','golden_carp','old_boot'],
    rareExtra: 10,
    skyLines:[
      ' 🌸  🌸    🌸  🌸   🌸  ',
      '   🌸    🌸       🌸    ',
      ' 🌺  🌳    🌳  🌺   🌳  ',
      '   🌿  🌿   🌿   🌿    ',
    ],
    midLines:[
      '░░░░░░░░░░░░░░░░░░░░░░░░░',
      ' 🪷   🪷      🪷    🪷  ',
    ],
    shoreLine: '─ · ─ · ─ · ─ · ─ · ─ · ─',
    waterWave1: '#381450', waterWave2: '#2a1040',
  },
];

function getCityFishingItemIds(cityId){
  if(!cityId) return [];
  const itemIds = new Set();
  SPOTS_DB.forEach(spot => {
    if(!Array.isArray(spot?.cities) || !spot.cities.includes(cityId)) return;
    (spot.fish || []).forEach(itemId => {
      if(itemId) itemIds.add(itemId);
    });
  });
  return [...itemIds];
}

const RARITY_COLOR = {

  common:    { label:'普通', color:'#aabbcc', bg:'#0d1e2a', glow:'rgba(100,150,180,0.3)' },
  uncommon:  { label:'少见', color:'#44ffcc', bg:'#0a2a1a', glow:'rgba(40,200,140,0.4)' },
  rare:      { label:'稀有', color:'#8888ff', bg:'#1a0a3a', glow:'rgba(100,80,255,0.4)' },
  epic:      { label:'史诗', color:'#ffaa00', bg:'#2a1800', glow:'rgba(255,160,0,0.5)' },
  legendary: { label:'传说', color:'#ff5555', bg:'#2a0808', glow:'rgba(255,50,50,0.6)' },
  junk:      { label:'垃圾', color:'#666677', bg:'#111118', glow:'rgba(80,80,90,0.2)' },
};

// ═══════════════════════════════════════════════
// 1b. 鱼字符画字典（真正多行ASCII，用\n分隔）
// ═══════════════════════════════════════════════

// ── 鱼字符画设计说明 ──
// approach（游近）：4行侧视图，有鱼头(°>、鱼眼、鱼身鳞片、鱼尾<|)，在水波中游动
// bite（咬钩）：3行，鱼头朝上挣扎，↑表示被钓起方向
// 鱼头统一朝左（向钩子游来），用 (°> 或 <° 表示嘴和眼
// 〰 = 水波背景  ～ = 水面涟漪

// ── 鱼字符画说明 ──
// 鱼从右往左游（朝向钩子），所以鱼头朝左：<°(( 风格
// approach = 纯鱼身，无水波包裹（水波背景由canvas/CSS层负责）
// bite     = 鱼身 + ↑ 挣扎出水

const FISH_ART = {

  // ── 普通鱼 ──────────────────────────────────────
  carp: {                    // 鲤鱼
    color: '#50c878',
    approach: " <°))><  ",
    bite: [
      "  <°))><  ",
      " /|鲤|\\  ↑",
      "〰～～～〰 ",
    ].join('\n'),
  },

  crucian: {                 // 鲫鱼
    color: '#7adb9a',
    approach: " <°)><  ",
    bite: [
      "  <°)><  ",
      " /|鲫|↑  ",
      "〰～～～〰 ",
    ].join('\n'),
  },

  catfish: {                 // 鲶鱼 · 长须
    color: '#a0a060',
    approach: " <·﹏·)須須≋ ",
    bite: [
      " <·﹏·)須須",
      "  |鲶|    ↑",
      "〰～～～～〰 ",
    ].join('\n'),
  },

  eel: {                     // 鳗鱼 · 蛇形
    color: '#60c8a0',
    approach: " <°〜〜〜〜〜 ",
    bite: [
      " <°〜〜〜〜",
      " 〜〜〜〜〜 ↑",
      "〰～～～～〰 ",
    ].join('\n'),
  },

  snakehead: {               // 黑鱼 · 方头
    color: '#4a9a7a',
    approach: " <·¤·\\=== ",
    bite: [
      " <·¤·\\===",
      "  |黑鱼|  ↑",
      "〰～～～～〰 ",
    ].join('\n'),
  },

  jade_shrimp: {             // 玉虾 · 弓背
    color: '#88ddbb',
    approach: " --(°益°) ",
    bite: [
      "  --(°益°) ",
      "   |虾|   ↑",
      "〰～～～～〰 ",
    ].join('\n'),
  },

  puffer: {                  // 河豚 · 圆滚
    color: '#ddaa44',
    approach: " (●_●) ",
    bite: [
      "  ( ●‿●) !!",
      "   |膨|    ↑",
      "〰～～～～〰  ",
    ].join('\n'),
  },

  // ── 少见鱼 ──────────────────────────────────────
  mandarin: {                // 鳜鱼 · 花纹背鳍
    color: '#aa88ff',
    approach: " ♦<°)))★ ",
    bite: [
      " ♦<°)))★♦",
      "  |鳜 |  ↑",
      "〰～★～★〰 ",
    ].join('\n'),
  },

  trout: {                   // 鳟鱼 · 流线
    color: '#88aaff',
    approach: " <°)))>< ",
    bite: [
      "  <°)))>< ",
      "  |鳟 |  ↑",
      "〰～～～～〰 ",
    ].join('\n'),
  },

  sturgeon: {                // 鲟鱼 · 脊刺大体
    color: '#9988cc',
    approach: " <°((((===^ ",
    bite: [
      " <°((((===^",
      " |大 鲟|  ↑",
      "〰～～～～～〰",
    ].join('\n'),
  },

  // ── 稀有鱼 ──────────────────────────────────────
  golden_carp: {             // 金鲤 · 金鳍闪光
    color: '#ffcc00',
    approach: " ✦<°)))★★✦ ",
    bite: [
      " ✨<°)))★★✨",
      "  |金 鲤|  ↑",
      "〰～✨～✨～〰",
    ].join('\n'),
  },

  sword_fish: {              // 剑鱼 · 长剑吻
    color: '#ff8844',
    approach: " ◄——<°(( ",
    bite: [
      " ◄——<°((",
      " |剑 鱼| ↑",
      "〰～～～～〰 ",
    ].join('\n'),
  },

  // ── 传说鱼 ──────────────────────────────────────
  dragon_fish: {             // 龙鱼 · 须髯如龙
    color: '#ff6666',
    approach: " ✨≋龙<·>≋✨ ",
    bite: [
      " ✨≋龙<·>≋✨",
      "   |龙 鱼|  ↑",
      "〰✨～～～✨〰  ",
    ].join('\n'),
  },

  // ── 垃圾 ────────────────────────────────────────
  old_boot: {                // 破靴子
    color: '#887766',
    approach: " [_旧靴子_] ",
    bite: [
      " [_旧靴子_]",
      "   ???    ↑",
      "〰什么鬼～〰",
    ].join('\n'),
  },

  bamboo_hat: {              // 斗笠
    color: '#aa9977',
    approach: " /‾‾笠‾‾\\ ",
    bite: [
      "  /‾‾笠‾‾\\",
      "   漂来的  ↑",
      "〰～～～～〰 ",
    ].join('\n'),
  },
};

// ── 获取当前钓场鱼的字符画 ──────────────────────
function _fsGetCurrentFishArt(){
  const id  = _fs._peekFish;
  const def = {
    color:    '#50c878',
    approach: "  〰〰〰〰〰〰〰〰〰〰〰\n  〰 ><((( º>  〰〰〰\n  〰〰〰〰〰〰〰〰〰〰〰",
    bite:     " ><((( º>!!↑\n〰〰〰〰〰〰\n  ～～～",
  };
  return (id && FISH_ART[id]) ? FISH_ART[id] : def;
}

// ═══════════════════════════════════════════════
// 2. 状态
// ═══════════════════════════════════════════════

let _fs = null;

function _fsLoad(){ try{ return JSON.parse(localStorage.getItem('wuxia_fishing_v4')||'{}'); }catch(e){ return {}; } }
function _fsSave(d){ localStorage.setItem('wuxia_fishing_v4', JSON.stringify(d)); }

function _fsPlayerLevel(){
  if(typeof edS !== 'undefined') return edS.level||1;
  try{ return JSON.parse(localStorage.getItem('wuxia_editor_state')||'{}').level||1; }catch(e){ return 1; }
}

// ═══════════════════════════════════════════════
// 3. 入口
// ═══════════════════════════════════════════════

function openFishingGame(cityId){
  const lv = _fsPlayerLevel();
  const saved = _fsLoad();
  if(!saved.totalCatch) saved.totalCatch = 0;
  if(!saved.records) saved.records = {};
  _fsSave(saved);

  const spots = SPOTS_DB.filter(s => {
    const lvOk = lv >= s.minLevel;
    const cityOk = !cityId || s.cities.includes(cityId);
    return lvOk && cityOk;
  });
  const available = spots.length > 0 ? spots : SPOTS_DB.filter(s => lv >= s.minLevel);
  if(!available.length){ showToast('此处没有适合的钓场……'); return; }

  _fs = { phase:'select', cityId, spots:available, saved };
  _fsRender();
}

function cityHasFishingSpot(cityId){
  return SPOTS_DB.some(s => s.cities.includes(cityId));
}

// ═══════════════════════════════════════════════
// 4. 渲染主控
// ═══════════════════════════════════════════════

function _fsRender(){
  if(!_fs) return;
  switch(_fs.phase){
    case 'select':  _fsShowModal(_fsHtmlSelect()); break;
    case 'casting': _fsShowModal(_fsHtmlCasting()); _fsInitStage(); _fsStartCasting(); break;
    case 'result':  _fsShowModal(_fsHtmlResult()); break;
  }
}

function _fsShowModal(html){
  let m = document.querySelector('.fs-modal');
  if(!m){
    m = document.createElement('div');
    m.className = 'fs-modal';
    m.style.cssText = `position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;font-family:'STKaiti','KaiTi',serif;`;
    document.body.appendChild(m);
  }
  m.innerHTML = `
    <div style="background:linear-gradient(160deg,#070f1a 0%,#050c14 100%);
      border:2px solid #1a3a5a;border-radius:14px;
      width:min(400px,96vw);max-height:96vh;overflow-y:auto;
      box-shadow:0 0 60px rgba(0,100,180,0.25);color:#a0c8e0;">
      <div style="background:linear-gradient(90deg,#08203a,#102840,#08203a);
        padding:10px 16px;border-radius:12px 12px 0 0;
        display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:16px;font-weight:bold;color:#5aceff;">🎣 江湖垂钓</span>
        <button onclick="_fsClose()" style="background:none;border:none;color:#556;
          font-size:22px;cursor:pointer;line-height:1;padding:0 4px;">✕</button>
      </div>
      <div style="padding:12px 14px;">${html}</div>
    </div>
    ${_fsStyles()}`;
}

function _fsClose(){
  _fsClearAll();
  _fs = null;
  document.querySelectorAll('.fs-modal').forEach(e=>e.remove());
}

// ═══════════════════════════════════════════════
// 5. 样式（v6 流畅动画版）
// ═══════════════════════════════════════════════

function _fsStyles(){
  return `<style>
    /* ── 水面波纹持续滚动 ── */
    @keyframes fs-wave-scroll {
      0%   { background-position: 0 0; }
      100% { background-position: 60px 0; }
    }
    /* ── 水面光泽闪烁 ── */
    @keyframes fs-glint {
      0%,100% { opacity:0.35; transform:scaleX(1); }
      50%      { opacity:0.8;  transform:scaleX(1.04); }
    }
    /* ── 浮漂平静浮动（正弦）── */
    @keyframes fs-float {
      0%,100% { transform:translateY(0px) scaleY(1); }
      50%      { transform:translateY(-4px) scaleY(0.92); }
    }
    /* ── 浮漂假咬下沉 ── */
    @keyframes fs-fake-dip {
      0%   { transform:translateY(0px); }
      20%  { transform:translateY(10px); }
      50%  { transform:translateY(12px); }
      75%  { transform:translateY(3px); }
      100% { transform:translateY(0px); }
    }
    /* ── 浮漂真咬猛沉 ── */
    @keyframes fs-bite-dip {
      0%   { transform:translateY(0px) rotate(0deg); }
      15%  { transform:translateY(14px) rotate(-8deg); }
      35%  { transform:translateY(16px) rotate(8deg); }
      55%  { transform:translateY(12px) rotate(-5deg); }
      75%  { transform:translateY(15px) rotate(4deg); }
      100% { transform:translateY(14px) rotate(-3deg); }
    }
    /* ── 水花溅起 ── */
    @keyframes fs-splash {
      0%   { opacity:0; transform:scale(0.3) translateY(4px); }
      25%  { opacity:1; transform:scale(1.2) translateY(-3px); }
      60%  { opacity:0.7; transform:scale(1) translateY(0px); }
      100% { opacity:0; transform:scale(0.8) translateY(2px); }
    }
    /* ── 鱼影游进（从右侧滑入）── */
    @keyframes fs-fish-swim {
      0%,100%{ letter-spacing:1px; }
      50%    { letter-spacing:2px; }
    }
    /* ── 鱼游动摆动（身体S形摆动）── */
    @keyframes fs-fish-swim-sway {
      0%   { transform:translateX(0) translateY(0) rotate(0deg) scaleX(1); }
      20%  { transform:translateX(25px) translateY(-2px) rotate(-3deg) scaleX(0.98); }
      40%  { transform:translateX(50px) translateY(2px) rotate(3deg) scaleX(1.02); }
      60%  { transform:translateX(75px) translateY(-1px) rotate(-2deg) scaleX(0.99); }
      80%  { transform:translateX(100px) translateY(1px) rotate(2deg) scaleX(1.01); }
      100% { transform:translateX(120px) translateY(0) rotate(0deg) scaleX(1); }
    }
    /* ── 鱼疯狂挣扎 ── */
    @keyframes fs-fish-struggle {
      0%,100%{ transform:translateX(0) rotate(0deg) scaleX(1); }
      20%    { transform:translateX(-3px) rotate(-5deg) scaleX(0.95); }
      40%    { transform:translateX(4px) rotate(6deg) scaleX(1.05); }
      60%    { transform:translateX(-2px) rotate(-4deg) scaleX(0.97); }
      80%    { transform:translateX(3px) rotate(4deg) scaleX(1.03); }
    }
    /* ── 咬钩时鱼影在浮漂附近游动 ── */
    @keyframes fs-fish-bite-swim {
      0%,100%{ transform:translateX(0) translateY(0) rotate(0deg) scaleX(1); }
      15%    { transform:translateX(-8px) translateY(-3px) rotate(-8deg) scaleX(0.92); }
      30%    { transform:translateX(5px) translateY(2px) rotate(6deg) scaleX(1.06); }
      45%    { transform:translateX(-12px) translateY(-1px) rotate(-10deg) scaleX(0.88); }
      60%    { transform:translateX(8px) translateY(4px) rotate(8deg) scaleX(1.04); }
      75%    { transform:translateX(-4px) translateY(-2px) rotate(-5deg) scaleX(0.95); }
      90%    { transform:translateX(2px) translateY(1px) rotate(3deg) scaleX(1.02); }
    }
    /* ── 竿弯曲（作用于 #fs-rod-wrap）── */
    @keyframes fs-rod-bend {
      0%,100%{ transform:rotate(0deg); }
      50%    { transform:rotate(1.5deg); }
    }
    /* ── 咬钩时竿大弯抖动（弹簧效果）── */
    @keyframes fs-rod-bite {
      0%     { transform:rotate(0deg) translateY(0) scaleX(1); }
      15%    { transform:rotate(8deg) translateY(2px) scaleX(0.95); }
      30%    { transform:rotate(-3deg) translateY(-1px) scaleX(1.02); }
      45%    { transform:rotate(5deg) translateY(1px) scaleX(0.98); }
      60%    { transform:rotate(-2deg) translateY(0) scaleX(1.01); }
      75%    { transform:rotate(3deg) translateY(0) scaleX(0.99); }
      85%    { transform:rotate(-1deg) translateY(0) scaleX(1.005); }
      100%   { transform:rotate(0deg) translateY(0) scaleX(1); }
    }
    /* ── 舞台光晕脉冲（咬钩）── */
    @keyframes fs-bite-glow {
      0%,100%{ box-shadow:0 0 35px rgba(255,160,0,0.6), 0 0 70px rgba(255,80,0,0.3), inset 0 0 40px rgba(60,20,0,0.5); }
      50%    { box-shadow:0 0 55px rgba(255,200,0,0.95), 0 0 100px rgba(255,80,0,0.6), inset 0 0 50px rgba(80,30,0,0.7); }
    }
    /* ── 按钮咬钩发光抖动（弹簧效果）── */
    @keyframes fs-btn-shake {
      0%     { transform:translateX(0) scale(1.06); }
      12%    { transform:translateX(-8px) scale(1.12); }
      24%    { transform:translateX(6px) scale(1.08); }
      36%    { transform:translateX(-4px) scale(1.1); }
      48%    { transform:translateX(3px) scale(1.07); }
      60%    { transform:translateX(-2px) scale(1.09); }
      72%    { transform:translateX(1px) scale(1.065); }
      84%    { transform:translateX(-0.5px) scale(1.075); }
      100%   { transform:translateX(0) scale(1.06); }
    }
    @keyframes fs-btn-glow {
      0%,100%{ box-shadow:0 0 12px rgba(255,150,0,0.6); }
      50%    { box-shadow:0 0 35px rgba(255,200,0,1), 0 0 60px rgba(255,80,0,0.6); }
    }
    /* ── 钓鱼人物动画 ── */
    @keyframes fs-angler-wait {
      0%,100%{ transform:translateY(0) rotate(0deg); }
      50%    { transform:translateY(1px) rotate(0.5deg); }
    }
    @keyframes fs-angler-bite {
      0%     { transform:translateY(0) rotate(0deg) scale(1); }
      25%    { transform:translateY(-2px) rotate(-1deg) scale(1.02); }
      50%    { transform:translateY(-3px) rotate(1deg) scale(1.03); }
      75%    { transform:translateY(-1px) rotate(-0.5deg) scale(1.01); }
      100%   { transform:translateY(0) rotate(0deg) scale(1); }
    }
    /* ── 结果界面动画 ── */
    @keyframes fs-success {
      0%  { transform:scale(0.92);opacity:0; }
      60% { transform:scale(1.03); }
      100%{ transform:scale(1);opacity:1; }
    }
    @keyframes fs-miss {
      0%,100%{ opacity:1;transform:translateY(0); }
      50%    { opacity:0.5;transform:translateY(-4px); }
    }
    /* ── 气泡上浮 ── */
    @keyframes fs-bubble {
      0%  { transform:translateY(0) scale(1); opacity:0.6; }
      80% { transform:translateY(-18px) scale(1.1); opacity:0.3; }
      100%{ transform:translateY(-22px) scale(0.8); opacity:0; }
    }
    /* ── 天空星星闪烁 ── */
    @keyframes fs-star {
      0%,100%{ opacity:0.5; }
      50%    { opacity:1; text-shadow:0 0 6px #fff; }
    }
    /* ── 花瓣飘落 ── */
    @keyframes fs-petal {
      0%  { transform:translateX(0) translateY(-10px) rotate(0deg); opacity:0.8; }
      100%{ transform:translateX(20px) translateY(30px) rotate(180deg); opacity:0; }
    }
    /* ── 鱼线微颤 ── */
    @keyframes fs-line-tremble {
      0%,100%{ opacity:0.7; transform:scaleX(1); }
      50%    { opacity:1; transform:scaleX(1.01); }
    }
    /* ── 冲击波扩散（起竿成功）── */
    @keyframes fs-shockwave {
      0%   { transform:scale(0.2); opacity:1; border-width:4px; }
      60%  { transform:scale(2.5); opacity:0.5; border-width:2px; }
      100% { transform:scale(4);   opacity:0;   border-width:1px; }
    }
    /* ── 水圈扩散（咬钩）── */
    @keyframes fs-water-ring {
      0%   { transform:scale(0.1) translateX(-50%); opacity:0.9; }
      70%  { transform:scale(1.8) translateX(-50%); opacity:0.4; }
      100% { transform:scale(2.8) translateX(-50%); opacity:0; }
    }
    /* ── 礼花粒子（起竿成功）── */
    @keyframes fs-confetti {
      0%   { transform:translateY(0) rotate(0deg) scale(1); opacity:1; }
      100% { transform:translateY(var(--fy,80px)) rotate(var(--fr,360deg)) scale(0.3); opacity:0; }
    }
    /* ── 鱼飞出水面（起竿）── */
    @keyframes fs-fish-fly {
      0%   { transform:translateY(0) rotate(0deg) scale(1); opacity:1; }
      30%  { transform:translateY(-40px) rotate(-20deg) scale(1.1); opacity:1; }
      70%  { transform:translateY(-80px) rotate(-35deg) scale(1.0); opacity:0.8; }
      100% { transform:translateY(-130px) rotate(-50deg) scale(0.6); opacity:0; }
    }
    /* ── 全屏金色闪光（起竿）── */
    @keyframes fs-flash-gold {
      0%   { opacity:0; }
      15%  { opacity:0.55; }
      100% { opacity:0; }
    }
    /* ── 闪电鱼线（咬钩强化）── */
    @keyframes fs-lightning {
      0%,100%{ opacity:0; }
      10%,30%,60%{ opacity:1; filter:drop-shadow(0 0 6px #ffe000); }
      20%,50%    { opacity:0.3; }
    }
    /* ── 水花大爆炸（起竿）── */
    @keyframes fs-splash-big {
      0%   { opacity:0; transform:scale(0.2) translateY(0); }
      20%  { opacity:1; transform:scale(1.5) translateY(-12px); }
      70%  { opacity:0.6; transform:scale(1.1) translateY(-6px); }
      100% { opacity:0; transform:scale(0.7) translateY(4px); }
    }
    /* ── 咬钩时鱼疯狂挣扎加强版 ── */
    @keyframes fs-fish-struggle-hard {
      0%  { transform:translateX(0) translateY(0) rotate(0deg) scaleX(1); }
      15% { transform:translateX(-5px) translateY(-3px) rotate(-10deg) scaleX(0.92); }
      30% { transform:translateX(6px) translateY(2px) rotate(12deg) scaleX(1.08); }
      45% { transform:translateX(-4px) translateY(-4px) rotate(-8deg) scaleX(0.94); }
      60% { transform:translateX(5px) translateY(1px) rotate(9deg) scaleX(1.06); }
      75% { transform:translateX(-3px) translateY(-2px) rotate(-6deg) scaleX(0.96); }
      100%{ transform:translateX(0) translateY(0) rotate(0deg) scaleX(1); }
    }
    /* ── 起竿成功大字弹入 ── */
    @keyframes fs-catch-pop {
      0%   { transform:scale(0) rotate(-10deg); opacity:0; }
      50%  { transform:scale(1.3) rotate(3deg); opacity:1; }
      75%  { transform:scale(0.95) rotate(-1deg); }
      100% { transform:scale(1) rotate(0deg); opacity:1; }
    }
    /* ── 成功大字持续脉冲 ── */
    @keyframes fs-catch-pulse {
      0%,100%{ text-shadow:0 0 20px #ffcc00, 0 0 40px #ff8800; transform:scale(1); }
      50%    { text-shadow:0 0 40px #fff, 0 0 80px #ffcc00, 0 0 120px #ff4400; transform:scale(1.05); }
    }
    /* ── 结果浮层滑入 ── */
    @keyframes fs-overlay-in {
      0%   { transform:translateY(30px) scale(0.95); opacity:0; }
      60%  { transform:translateY(-4px) scale(1.01); opacity:1; }
      100% { transform:translateY(0) scale(1); opacity:1; }
    }
    /* ── 结果浮层滑出 ── */
    @keyframes fs-overlay-out {
      0%   { transform:translateY(0) scale(1); opacity:1; }
      100% { transform:translateY(20px) scale(0.94); opacity:0; }
    }
    /* ── 空竿浮层摇晃 ── */
    @keyframes fs-miss-overlay {
      0%,100%{ transform:translateX(0); }
      20%   { transform:translateX(-5px); }
      40%   { transform:translateX(5px); }
      60%   { transform:translateX(-3px); }
      80%   { transform:translateX(3px); }
    }
    /* ── 结果浮层样式 ── */
    #fs-result-overlay {
      position:absolute;
      left:8px; right:8px; bottom:8px;
      border-radius:14px;
      padding:12px 14px 10px;
      z-index:30;
      pointer-events:auto;
      animation: fs-overlay-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    /* ── 深水层光晕（approach）── */
    @keyframes fs-deep-glow {
      0%,100%{ opacity:0.3; transform:scaleX(1); }
      50%    { opacity:0.7; transform:scaleX(1.1); }
    }
    /* ── 等鱼氛围：细水涟漪 ── */
    @keyframes fs-idle-ripple {
      0%   { transform:scale(0.05) translateX(-50%); opacity:0.6; }
      70%  { transform:scale(1.4) translateX(-50%); opacity:0.2; }
      100% { transform:scale(2.2) translateX(-50%); opacity:0; }
    }
    /* ── 等鱼氛围：水面漂浮物（枯叶/花瓣/浮萍）── */
    @keyframes fs-leaf-drift {
      0%   { transform:translateX(0) rotate(0deg); opacity:0.8; }
      40%  { transform:translateX(var(--lx,40px)) rotate(var(--lr,15deg)); opacity:0.7; }
      100% { transform:translateX(var(--lx2,80px)) rotate(var(--lr2,30deg)); opacity:0; }
    }
    /* ── 等鱼氛围：水下神秘鱼影 ── */
    @keyframes fs-shadow-fish {
      0%   { transform:translateX(var(--sfx0,-60px)); opacity:0; }
      15%  { opacity:var(--sfop,0.18); }
      80%  { opacity:var(--sfop,0.18); }
      100% { transform:translateX(var(--sfx1,80px)); opacity:0; }
    }
    /* ── 等鱼氛围：水下光斑（阳光折射）── */
    @keyframes fs-sunbeam {
      0%   { transform:scaleX(0.1) skewX(20deg); opacity:0; }
      30%  { transform:scaleX(1) skewX(15deg); opacity:var(--sbo,0.12); }
      70%  { transform:scaleX(0.8) skewX(18deg); opacity:var(--sbo,0.12); }
      100% { transform:scaleX(0.05) skewX(22deg); opacity:0; }
    }
    /* ── 等鱼氛围：蜻蜓/水鸟掠过 ── */
    @keyframes fs-skim {
      0%   { transform:translateX(var(--skx0,-30px)); opacity:0; }
      10%  { opacity:0.9; }
      85%  { opacity:0.8; }
      100% { transform:translateX(var(--skx1,360px)); opacity:0; }
    }
    /* ── 等鱼氛围：浮漂附近细小涟漪（钓线重力）── */
    @keyframes fs-float-ripple {
      0%   { transform:scale(0.1); opacity:0.5; border-width:1px; }
      100% { transform:scale(2.2); opacity:0; border-width:0.5px; }
    }

    /* ══ 抛竿动画（作用于 #fs-rod-wrap，transform-origin在元素上单独设置）══ */
    /* 竿蓄力上扬 */
    @keyframes fs-rod-windup {
      0%   { transform:rotate(0deg); }
      60%  { transform:rotate(-50deg); }
      100% { transform:rotate(-50deg); }
    }
    /* 竿甩出 */
    @keyframes fs-rod-swing {
      0%   { transform:rotate(-50deg); }
      40%  { transform:rotate(22deg); }
      70%  { transform:rotate(8deg); }
      100% { transform:rotate(0deg); }
    }
    /* 飞出的浮漂（独立div，JS驱动translate）*/
    @keyframes fs-bobber-fly {
      0%   { transform:translate(0px, 0px) scale(0.6); opacity:1; }
      45%  { transform:translate(var(--bx1,-70px), var(--by1,-55px)) scale(1); opacity:1; }
      85%  { transform:translate(var(--bx2,-115px), var(--by2,5px)) scale(0.9); opacity:1; }
      100% { transform:translate(var(--bx3,-125px), var(--by3,18px)) scale(0.9); opacity:0.8; }
    }
    /* 鱼线飞出（stroke-dashoffset展开）*/
    @keyframes fs-line-shoot {
      0%   { stroke-dashoffset:600; opacity:0.9; }
      100% { stroke-dashoffset:0;   opacity:0.6; }
    }
    /* ── 浮漂周围水涟漪（idle）── */
    @keyframes fs-ripple-spread {
      0%   { transform:translate(-50%,-50%) scale(0.4); opacity:0.8; }
      50%  { opacity:0.5; }
      100% { transform:translate(-50%,-50%) scale(1.5); opacity:0; }
    }
    /* ── 水下气泡上升 ── */
    @keyframes fs-bubble-rise {
      0%   { transform:translateY(0) scale(1); opacity:0.8; }
      50%  { opacity:0.6; }
      100% { transform:translateY(-60px) scale(1.2); opacity:0; }
    }
    /* ── 水草摆动 ── */
    @keyframes fs-seaweed-sway {
      0%,100%{ transform:rotate(-3deg) scaleY(1); }
      50%    { transform:rotate(3deg) scaleY(1.05); }
    }
    /* ── 萤火虫闪烁飞行 ── */
    @keyframes fs-firefly-glow {
      0%,100%{ opacity:0.3; transform:scale(1); }
      50%    { opacity:1; transform:scale(1.2); }
    }
    @keyframes fs-firefly-fly {
      0%   { transform:translate(0,0); }
      20%  { transform:translate(15px,-10px); }
      40%  { transform:translate(30px,-5px); }
      60%  { transform:translate(45px,-15px); }
      80%  { transform:translate(60px,-8px); }
      100% { transform:translate(80px,-12px); }
    }
    /* ── 云朵飘过天空 ── */
    @keyframes fs-cloud-drift {
      0%   { transform:translateX(-40px); opacity:0; }
      10%  { opacity:0.7; }
      90%  { opacity:0.7; }
      100% { transform:translateX(360px); opacity:0; }
    }
    /* ── 星星闪烁 ── */
    @keyframes fs-star-twinkle {
      0%,100%{ opacity:0.2; transform:scale(1); }
      50%    { opacity:1; transform:scale(1.3); }
    }
    /* 入水水花 */
    @keyframes fs-entry-splash {
      0%   { transform:translate(0,0) scale(0.4); opacity:1; }
      60%  { transform:translate(var(--sx,0px),var(--sy,-18px)) scale(1.1); opacity:0.8; }
      100% { transform:translate(var(--sx,0px),var(--sy2,-28px)) scale(0.4); opacity:0; }
    }
    /* 入水水圈扩散 */
    @keyframes fs-entry-ring {
      0%   { transform:scale(0.1); opacity:0.8; }
      100% { transform:scale(3.5); opacity:0; }
    }

    /* ══ 起竿动画（作用于 #fs-rod-wrap）══ */
    /* 竿猛然上挑后弹簧回弹 */
    @keyframes fs-rod-reel {
      0%     { transform:rotate(0deg); }
      20%    { transform:rotate(-70deg); }
      35%    { transform:rotate(-45deg); }
      50%    { transform:rotate(-58deg); }
      65%    { transform:rotate(-32deg); }
      80%    { transform:rotate(-12deg); }
      90%    { transform:rotate(-4deg); }
      100%   { transform:rotate(0deg); }
    }
    /* 鱼线收缩隐藏 */
    @keyframes fs-line-reel {
      0%   { opacity:1; stroke-width:2; }
      50%  { opacity:0.4; stroke-width:1; }
      100% { opacity:0; stroke-width:0; }
    }
    /* 起竿水花粒子飞出 */
    @keyframes fs-reel-splash {
      0%   { transform:translate(0,0) scale(0.5); opacity:1; }
      50%  { transform:translate(var(--sx,0px),var(--sy,-20px)) scale(1); opacity:0.8; }
      100% { transform:translate(var(--sx,0px),var(--sy2,-35px)) scale(0.3); opacity:0; }
    }
    /* ── 屏幕震动（钓到稀有鱼）── */
    @keyframes fs-shake-screen {
      0%,100%{ transform:translate(0,0); }
      10%,30%,50%,70%,90%{ transform:translate(-2px,-1px); }
      20%,40%,60%,80%{ transform:translate(2px,1px); }
    }
    /* ── 金色粒子爆炸（传奇鱼）── */
    @keyframes fs-particle-burst {
      0%   { transform:translate(0,0) scale(0); opacity:1; }
      50%  { opacity:1; }
      100% { transform:translate(var(--px),var(--py)) scale(1); opacity:0; }
    }
    /* ── 光环扩散（稀有鱼登场）── */
    @keyframes fs-halo-expand {
      0%   { transform:scale(0); opacity:1; }
      50%  { opacity:0.8; }
      100% { transform:scale(2.5); opacity:0; }
    }
    /* ── 文字霓虹闪烁（稀有度展示）── */
    @keyframes fs-text-neon {
      0%,100%{ text-shadow:0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px var(--glow); }
      50%    { text-shadow:0 0 20px currentColor, 0 0 40px var(--glow), 0 0 80px var(--glow), 0 0 120px var(--glow); }
    }
    /* ── 鱼获卡片旋转光效── */
    @keyframes fs-card-shimmer {
      0%   { background-position:-100% 0; }
      100% { background-position:200% 0; }
    }
    /* ── 连击数字飞入── */
    @keyframes fs-combo-in {
      0%   { transform:scale(0) rotate(180deg); opacity:0; }
      50%  { transform:scale(1.2) rotate(0deg); opacity:1; }
      100% { transform:scale(1) rotate(0deg); opacity:1; }
    }

    .fs-btn{
      border:none;border-radius:8px;cursor:pointer;font-family:inherit;
      font-size:14px;font-weight:bold;padding:9px 18px;transition:all .12s;
    }
    .fs-btn:active{transform:scale(0.93);}
    .fs-spot-card{
      border:1.5px solid #1a3a5a;border-radius:10px;padding:10px 13px;
      margin-bottom:8px;cursor:pointer;transition:all .18s;background:#060f1a;
    }
    .fs-spot-card:hover{border-color:#4ab8e0;background:#0a1828;transform:translateY(-2px);}

    /* ── 舞台层 ── */
    #fs-stage {
      position:relative;overflow:hidden;
      border:2px solid #1a3a5a;border-radius:12px;
      height:420px;
      transition: border-color 0.5s, box-shadow 0.5s;
    }
    /* 背景渐变层 */
    #fs-bg {
      position:absolute;inset:0;
      transition: background 0.6s;
      pointer-events:none;
    }
    /* 天空文字层 */
    #fs-sky-layer {
      position:absolute;top:0;left:0;right:0;
      font-family:'Courier New',monospace;font-size:13px;line-height:1.62;
      white-space:pre;padding:6px 5px 0;
      pointer-events:none;
      color:#3a5a6a;
      text-shadow:0 0 8px rgba(80,160,200,0.3);
    }
    /* 钓鱼人层 */
    #fs-angler {
      position:absolute;
      right:14px;
      font-family:'Courier New',monospace;font-size:13px;line-height:1.5;
      white-space:pre;
      pointer-events:none;
      color:#7ab8d0;
      overflow:visible;
      transition: top 0.3s;
      z-index:7;
    }
    /* 鱼线层 */
    #fs-line {
      position:absolute;
      pointer-events:none;
      transition: all 0.3s;
    }
    /* 水面层（纯CSS波浪）*/
    #fs-water-surface {
      position:absolute;left:0;right:0;
      height:28px;
      pointer-events:none;
      overflow:hidden;
    }
    .fs-wave-row {
      width:100%;height:100%;
      font-family:'Courier New',monospace;font-size:13px;
      white-space:nowrap;overflow:hidden;
      letter-spacing:0.5px;
    }
    /* 浮漂 */
    #fs-float {
      position:absolute;
      pointer-events:none;
      z-index:10;
    }
    /* 水下鱼影层 */
    #fs-fish-layer {
      position:absolute;left:0;right:0;
      pointer-events:none;
      transition: opacity 0.3s;
    }
    /* 水花粒子 */
    .fs-splash-particle {
      position:absolute;
      font-size:12px;
      pointer-events:none;
      animation: fs-splash 0.7s ease-out forwards;
      z-index:15;
    }
    /* 气泡 */
    .fs-bubble {
      position:absolute;
      font-size:10px;
      pointer-events:none;
      color:rgba(100,200,255,0.6);
    }
    /* 深水层 */
    #fs-deep {
      position:absolute;left:0;right:0;bottom:0;
      font-family:'Courier New',monospace;font-size:13px;
      white-space:pre;line-height:1.5;
      pointer-events:none;
      color:#0a2a3a;
      padding:0 5px;
    }
    /* 花瓣（桃花池） */
    .fs-petal {
      position:absolute;
      pointer-events:none;
      animation: fs-petal linear forwards;
    }
  </style>`;
}

// ═══════════════════════════════════════════════
// 6. 选钓场界面
// ═══════════════════════════════════════════════

function _fsHtmlSelect(){
  const saved = _fs.saved;
  const totalCatch = saved.totalCatch || 0;
  let html = `<div style="color:#4ab8e0;font-size:12px;margin-bottom:10px;text-align:center;">
    📜 总钓获 <b style="color:#fa0">${totalCatch}</b> 条
  </div>`;

  _fs.spots.forEach(sp => {
    const records = saved.records||{};
    const caught = Object.values(records).filter(r=>r.spot===sp.id).length;
    html += `<div class="fs-spot-card" onclick="_fsPickSpot('${sp.id}')">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-size:15px;font-weight:bold;">${sp.icon} ${sp.name}</span>
        <span style="font-size:10px;color:#556;">已钓 ${caught} 种</span>
      </div>
      <div style="font-size:11px;color:#6a8a9a;margin-bottom:5px;">${sp.desc}</div>
      <div style="font-size:10px;">
        ${sp.fish.filter(id=>FISH_DB.find(f=>f.id===id&&f.rarity!=='junk')).slice(0,5).map(id=>{
          const f=FISH_DB.find(x=>x.id===id);
          return f ? `<span style="color:${RARITY_COLOR[f.rarity].color}">${f.icon}${f.name}</span>` : '';
        }).join(' ')}
      </div>
    </div>`;
  });
  return html;
}

function _fsPickSpot(spotId){
  const spot = SPOTS_DB.find(s=>s.id===spotId);
  if(!spot) return;
  _fs.spot = spot;
  _fs.phase = 'casting';
  _fsRender();
}

// ═══════════════════════════════════════════════
// 7. 钓鱼主界面 HTML 骨架（v6 DOM分层）
// ═══════════════════════════════════════════════

function _fsHtmlCasting(){
  const sp = _fs.spot;
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-size:13px;font-weight:bold;color:#5aceff;">${sp.icon} ${sp.name}</span>
      <button onclick="_fsClose()" style="background:none;border:1px solid #1a3a5a;
        color:#5aceff;border-radius:5px;padding:2px 9px;font-size:11px;cursor:pointer;font-family:inherit;">
        离开
      </button>
    </div>

    <!-- v6 DOM分层舞台 -->
    <div id="fs-stage">
      <!-- 背景渐变 -->
      <div id="fs-bg"></div>
      <!-- 天空/远景/岸边 文字层 -->
      <div id="fs-sky-layer"></div>
      <!-- 钓鱼人+竿 -->
      <div id="fs-angler"></div>
      <!-- 鱼线（SVG）-->
      <svg id="fs-line-svg" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:6;"></svg>
      <!-- 水面 -->
      <div id="fs-water-surface"></div>
      <!-- 浮漂 -->
      <div id="fs-float" style="position:absolute;z-index:10;pointer-events:none;
        font-family:'Courier New',monospace;font-size:12px;line-height:1.2;
        filter:drop-shadow(0 0 4px rgba(255,80,80,0.6));
        animation:fs-float 2.2s ease-in-out infinite;
        transition:left 0.4s,top 0.3s;">
        <span style="color:#ff4444;">│</span><br>
        <span style="color:#ff6666;font-size:10px;">●</span>
      </div>
      <!-- 水下鱼影 -->
      <div id="fs-fish-layer"></div>
      <!-- 深水层 -->
      <div id="fs-deep"></div>
    </div>

    <!-- 起竿按钮（全程显示） -->
    <div style="text-align:center;margin-top:11px;">
      <button id="fs-cast-btn" class="fs-btn" onclick="_fsCastRod()"
        style="background:linear-gradient(135deg,#0d2a40,#152e4a);
        color:#5aceff;border:2px solid #2a5a7a;
        min-width:200px;font-size:16px;letter-spacing:2px;padding:11px 24px;">
        ⬆ 起竿
      </button>
    </div>
  `;
}

// ═══════════════════════════════════════════════
// 8. 舞台初始化（一次性建立DOM结构）
// ═══════════════════════════════════════════════

// ── 获取玩家字符画（支持捏脸系统）──────────────
function _fsGetPlayerArt(){
  if(typeof edBuild === 'function'){
    try{
      const art = edBuild();
      if(art && art.trim()) return { art, color: (typeof edS!=='undefined'?edS.color:null)||'#f0c060' };
    } catch(e){}
  }
  try{
    const saved = JSON.parse(localStorage.getItem('wuxia_cc')||'[]');
    const cc = saved.find(c=>c.id==='cp_self') || saved[0];
    if(cc && cc.ascii) return { art: cc.ascii, color: cc.color||'#f0c060' };
  } catch(e){}
  return null;
}

// ── 生成人物+鱼竿整体HTML ────────────────────────
// 策略：
//   1. 竿：用一个绝对定位 div 模拟斜竿，锚点在人物上半身左肩，竿梢伸向左上
//   2. 人物用 ft-animated 捏脸部件，或 edBuild() 多行文本
//   3. 容器 position:relative，鱼竿在容器内部（不超出stage边界）
//   竿梢端点：#fs-rod-tip，用 getBoundingClientRect 读取真实坐标

function _fsRenderAnglerHtml(playerArt){
  // 竿：从人物左肩出发，向左上方约 70px×45px 伸出
  // 实现方式：一个旋转的窄div（像素线条）
  const rodHtml = `
    <div id="fs-rod-wrap" style="position:absolute;top:0;left:-72px;
      width:76px;height:60px;pointer-events:none;overflow:visible;">
      <!-- 竿身：一条从右下到左上的斜线，用 CSS skew + 旋转实现 -->
      <svg width="76" height="60" style="position:absolute;top:0;left:0;overflow:visible;">
        <defs>
          <linearGradient id="rodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f0d080;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#b07830;stop-opacity:0.7"/>
          </linearGradient>
        </defs>
        <!-- 竿身 -->
        <line x1="2" y1="2" x2="74" y2="58"
          stroke="url(#rodGrad)" stroke-width="2.5" stroke-linecap="round"/>
        <!-- 竿梢高光 -->
        <circle cx="2" cy="2" r="3" fill="#ffe080" opacity="0.9"/>
      </svg>
      <!-- 竿梢端点（鱼线从这里出发）-->
      <div id="fs-rod-tip" style="position:absolute;top:0px;left:0px;
        width:4px;height:4px;border-radius:50%;
        background:#ffe080;
        box-shadow:0 0 5px #ffcc44,0 0 10px #ffaa00;"></div>
    </div>`;

  if(playerArt){
    const color  = playerArt.color || '#f0c060';
    const shadow = color + '88';
    const artHtml = `<pre style="margin:0;font-family:'Courier New',monospace;
      font-size:11px;line-height:1.5;color:${color};
      filter:drop-shadow(0 0 6px ${shadow});
      white-space:pre;">${_fsEscHtml(playerArt.art)}</pre>`;
    return `<div style="position:relative;display:inline-block;">${rodHtml}${artHtml}</div>`;
  } else {
    // 备用字符小人
    const fallback = ` (^·^)\n  卄\n  武\n /  \\`;
    return `<div style="position:relative;display:inline-block;">${rodHtml}<pre style="margin:0;font-family:'Courier New',monospace;font-size:12px;line-height:1.5;color:#f0c060;white-space:pre;">${fallback}</pre></div>`;
  }
}

function _fsEscHtml(s){
  if(!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function _fsInitStage(){
  const sp = _fs.spot;
  if(!sp) return;

  // ── 背景渐变 ──
  const bg = document.getElementById('fs-bg');
  if(bg){
    bg.style.cssText = `position:absolute;inset:0;pointer-events:none;transition:background 0.6s;
      background:linear-gradient(180deg,
        ${sp.bgSky} 0%, ${sp.bgSky} 20%,
        ${sp.bgMid} 20%, ${sp.bgHill} 38%,
        ${sp.waterColor} 58%, ${sp.waterDeep} 100%)`;
  }

  // ── 天空/远景/岸边 ──
  const skyEl = document.getElementById('fs-sky-layer');
  if(skyEl){
    const skyLines = sp.skyLines || ['','','',''];
    const midLines = sp.midLines || ['',''];
    const shore    = sp.shoreLine || '';
    skyEl.textContent = [...skyLines, ...midLines, shore].join('\n');
    skyEl.style.color = sp.id==='pond' ? '#8a5a8a' : (sp.id==='canal' ? '#5a7a5a' : '#3a5a6a');
  }

  // ── 钓鱼人 ──
  const stage = document.getElementById('fs-stage');
  const stageW = stage ? (stage.clientWidth || 320) : 320;
  const stageH = stage ? stage.clientHeight || 420 : 420;

  const playerArt = _fsGetPlayerArt();

  // 水面在56%处
  const surfTop = Math.round(stageH * 0.56);

  // 预估人物高度（等渲染完后会用 getBoundingClientRect 精确修正）
  const artLines = playerArt ? playerArt.art.split('\n').filter(l=>l.trim()).length : 5;
  const artPxH   = artLines * 16 + 6;
  const anglerTop  = surfTop - artPxH - 2;
  const anglerRight = 14;

  // 浮漂：偏左1/3处，水面上
  const floatX = Math.round(stageW * 0.30);
  const floatY = surfTop - 10;

  // 竿梢预估（真实值等DOM渲染后修正）
  // 竿从人物左侧伸出约70px，顶部约anglerTop+4px
  const rodTipX = stageW - anglerRight - 60;
  const rodTipY = anglerTop + 6;

  // 保存到state
  _fs._stageH    = stageH;
  _fs._stageW    = stageW;
  _fs._surfTop   = surfTop;
  _fs._anglerTop = anglerTop;
  _fs._rodTipX   = rodTipX;
  _fs._rodTipY   = rodTipY;
  _fs._floatX    = floatX;
  _fs._floatY    = floatY;

  const anglerEl = document.getElementById('fs-angler');
  if(anglerEl){
    anglerEl.style.top    = anglerTop + 'px';
    anglerEl.style.right  = anglerRight + 'px';
    anglerEl.style.bottom = 'auto';
    anglerEl.style.left   = 'auto';
    anglerEl.innerHTML    = _fsRenderAnglerHtml(playerArt);
  }

  // ── DOM渲染后精确读取竿梢坐标 ──
  // 用两帧延迟确保DOM已布局完成
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const stageEl   = document.getElementById('fs-stage');
      const rodTipEl  = document.getElementById('fs-rod-tip');
      const floatEl2  = document.getElementById('fs-float');
      if(stageEl && rodTipEl){
        const stageRect = stageEl.getBoundingClientRect();
        const tipRect   = rodTipEl.getBoundingClientRect();
        // 竿梢在 stage 坐标系内的位置
        _fs._rodTipX = tipRect.left - stageRect.left + tipRect.width / 2;
        _fs._rodTipY = tipRect.top  - stageRect.top  + tipRect.height / 2;
        // 重画鱼线
        _fsDrawLine(_fs.castPhase === 'bite' ? 'bite' : 'idle');
      }
      if(floatEl2 && stageEl){
        // 浮漂精确贴水面
        const stageRect = stageEl.getBoundingClientRect();
        floatEl2.style.left = _fs._floatX + 'px';
        floatEl2.style.top  = _fs._floatY + 'px';
        floatEl2.style.opacity = '1'; // 确保浮漂可见
      }
    });
  });

  // ── 水面层（CSS波浪）──
  const waterSurf = document.getElementById('fs-water-surface');
  if(waterSurf){
    waterSurf.style.top = surfTop + 'px';
    waterSurf.innerHTML = _fsBuildWaterSurfaceHTML(sp);
  }

  // ── 浮漂初始位置（真实值在 rAF 里修正）──
  const floatEl = document.getElementById('fs-float');
  if(floatEl){
    floatEl.style.left = floatX + 'px';
    floatEl.style.top  = floatY + 'px';
  }

  // ── 水下鱼影层 ──
  const fishLayer = document.getElementById('fs-fish-layer');
  if(fishLayer){
    fishLayer.style.top      = (surfTop + 22) + 'px';
    fishLayer.style.left     = '0';
    fishLayer.style.right    = '0';
    fishLayer.style.padding  = '4px 10px';
    fishLayer.style.height   = '50px';
    fishLayer.style.display  = 'flex';
    fishLayer.style.alignItems = 'center';
    fishLayer.style.overflow = 'hidden';
    fishLayer.textContent    = '';
  }

  // ── 深水层 ──
  const deepEl = document.getElementById('fs-deep');
  if(deepEl){
    const deepTop = Math.round(stageH * 0.78);
    deepEl.style.top    = deepTop + 'px';
    deepEl.style.bottom = '0';
    deepEl.style.color  = sp.waterDeep || '#041610';
    deepEl.innerHTML    = _fsBuildDeepHTML(sp, stageH - deepTop);
  }

  // ── 画初始鱼线 ──
  _fsDrawLine('idle');

  // ── 特殊粒子（桃花/灯笼等）──
  _fsInitParticles(sp, stageH);
}

// ── 水面 HTML（纯CSS动画波浪）──────────────────

function _fsBuildWaterSurfaceHTML(sp){
  // 三行水面，各自用不同速度/颜色的CSS动画
  const w1 = sp.waterWave1 || '#1a4a3a';
  const w2 = sp.waterColor || '#0a3a22';

  // 根据钓场选波浪字符
  let waveChar1, waveChar2, waveChar3;
  switch(sp.id){
    case 'sea':
      waveChar1 = '〰〰～～〰〰～～〰〰～～〰〰～～〰〰～～〰〰';
      waveChar2 = '～～〰〰～～〰〰～～〰〰～～〰〰～～〰〰～～';
      waveChar3 = '≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈';
      break;
    case 'pond':
      waveChar1 = '· · · ～ · · ～ · · · ～ · · ～ · · ·';
      waveChar2 = '～ · ～ · ～ · ～ · · ～ · ～ · ～ · ～';
      waveChar3 = '≈≈≋≈≈≋≈≈≋≈≈≋≈≈≋≈≈≋≈≈≋≈≈≋≈≈≋';
      break;
    case 'canal':
      waveChar1 = '─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─';
      waveChar2 = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
      waveChar3 = '≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈';
      break;
    default:
      waveChar1 = '≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈';
      waveChar2 = '≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋≈≈≈≋≋≋';
      waveChar3 = '～～～～～～～～～～～～～～～～～～～～～～～～～';
  }

  return `
    <div style="height:9px;overflow:hidden;opacity:0.8;">
      <span style="font-family:'Courier New',monospace;font-size:13px;color:${w1};
        display:inline-block;white-space:nowrap;
        animation:fs-wave-scroll ${1.8 + Math.random()*0.6}s linear infinite;">
        ${waveChar1}${waveChar1}
      </span>
    </div>
    <div style="height:9px;overflow:hidden;opacity:0.65;margin-top:1px;">
      <span style="font-family:'Courier New',monospace;font-size:13px;color:${w2};
        display:inline-block;white-space:nowrap;
        animation:fs-wave-scroll ${2.2 + Math.random()*0.6}s linear infinite reverse;">
        ${waveChar2}${waveChar2}
      </span>
    </div>
    <div style="height:9px;overflow:hidden;opacity:0.45;margin-top:1px;">
      <span style="font-family:'Courier New',monospace;font-size:13px;color:${w2};
        display:inline-block;white-space:nowrap;
        animation:fs-wave-scroll ${2.8 + Math.random()*0.8}s linear infinite;">
        ${waveChar3}${waveChar3}
      </span>
    </div>`;
}

// ── 深水HTML ──────────────────────────────────

function _fsBuildDeepHTML(sp, availH){
  const rows = Math.max(2, Math.floor(availH / 20));
  let html = '';
  for(let i=0; i<rows; i++){
    const darkness = Math.min(1, i / rows);
    const opacity  = 0.5 + darkness * 0.5;
    const char     = i < rows*0.4 ? '▒' : (i < rows*0.7 ? '▓' : '█');
    const color    = `rgba(${sp.id==='pond'?'20,5,30':(sp.id==='sea'?'2,10,20':'4,15,10')},${opacity})`;
    html += `<div style="color:${color};font-family:'Courier New',monospace;font-size:13px;line-height:1.4;letter-spacing:0;">`;
    html += char.repeat(28) + '</div>';
  }
  return html;
}

// ── SVG鱼线 ───────────────────────────────────
// 使用 _fs 里已计算好的精确坐标，确保浮漂和竿梢完全对齐

function _fsDrawLine(state){
  const svg = document.getElementById('fs-line-svg');
  if(!svg || !_fs) return;

  // 读取精确坐标
  const rodTipX = _fs._rodTipX || 240;
  const rodTipY = _fs._rodTipY || 150;
  const floatX  = _fs._floatX  || 100;
  const floatY  = _fs._floatY  || 228;

  // 鱼线：从竿梢(右上)到浮漂(左下)，二次贝塞尔曲线
  // 控制点：水平居中，垂直取两点连线的中点往下偏（自然垂弧）
  const cpX = (rodTipX + floatX) * 0.5;
  const cpY = (rodTipY + floatY) * 0.5 + (state === 'bite' ? 18 : 10);

  const opacity = state==='bite' ? '0.9' : '0.6';
  const color   = state==='bite' ? '#ffcc55' : '#88c0d0';
  const width   = state==='bite' ? '2' : '1.2';
  const glow    = state==='bite' ? 'filter:drop-shadow(0 0 3px #ffaa00);' : '';

  svg.innerHTML = `
    <path d="M${rodTipX},${rodTipY} Q${cpX},${cpY} ${floatX},${floatY}"
      stroke="${color}" stroke-width="${width}" fill="none"
      stroke-linecap="round"
      style="${glow}animation:fs-line-tremble 2s ease-in-out infinite;opacity:${opacity}"/>`;
}

// ── 特殊粒子效果 ───────────────────────────────

function _fsInitParticles(sp, stageH){
  const stage = document.getElementById('fs-stage');
  if(!stage) return;

  // 清除旧粒子
  stage.querySelectorAll('.fs-petal, .fs-bubble').forEach(e=>e.remove());

  if(sp.id === 'pond'){
    // 桃花飘落
    for(let i=0; i<5; i++){
      const p = document.createElement('div');
      p.className = 'fs-petal';
      p.textContent = ['🌸','🌺','🌼'][i%3];
      p.style.cssText = `
        left:${10+Math.random()*80}%;
        top:${5+Math.random()*25}%;
        font-size:${10+Math.random()*6}px;
        opacity:${0.4+Math.random()*0.4};
        animation:fs-petal ${3+Math.random()*4}s ${Math.random()*3}s linear infinite;
        z-index:3;`;
      stage.appendChild(p);
    }
  }

  if(sp.id === 'sea'){
    // 海鸥 (纯CSS位移，无setTimeout)
    for(let i=0; i<2; i++){
      const g = document.createElement('div');
      g.className = 'fs-petal';
      g.textContent = '🕊️';
      g.style.cssText = `
        left:${5+i*40}%;top:${8+i*5}%;font-size:12px;opacity:0.5;
        animation:fs-petal ${6+i*2}s ${i*2}s linear infinite;z-index:3;`;
      stage.appendChild(g);
    }
  }
}

// ═══════════════════════════════════════════════
// 9. RAF 动画循环（更新动态元素）
// ═══════════════════════════════════════════════

function _fsAnimLoop(timestamp){
  if(!_fs || _fs.castPhase === 'done') return;

  const t  = timestamp || 0;
  const sp = _fs.spot;
  const phase = _fs.castPhase;

  // ── 浮漂正弦浮动（仅idle/approach时） ──
  const floatEl = document.getElementById('fs-float');
  if(floatEl){
    if(phase === 'idle' || phase === 'approach'){
      // 用JS正弦而非CSS keyframes，可以随时打断
      const bobY = Math.sin(t * 0.0028) * 4;
      const bobScale = 1 + Math.sin(t * 0.004) * 0.05;
      floatEl.style.transform = `translateY(${bobY}px) scale(${bobScale})`;
      floatEl.style.animation = 'none';
      floatEl.style.filter    = 'drop-shadow(0 0 4px rgba(255,80,80,0.5))';

    } else if(phase === 'fake'){
      // CSS动画接管
      floatEl.style.animation = 'fs-fake-dip 0.9s ease-in-out';
      floatEl.style.transform = '';
      floatEl.style.filter    = 'drop-shadow(0 0 8px rgba(100,200,100,0.7))';

    } else if(phase === 'bite'){
      floatEl.style.animation = 'fs-bite-dip 0.55s ease-in-out infinite';
      floatEl.style.transform = '';
      floatEl.style.filter    = 'drop-shadow(0 0 12px rgba(255,200,0,1))';
    }
  }

  // ── 水下鱼影（approach：从右滑入；bite：挣扎）──
  // 注意：transform 全部合并到 <pre> 内，fishLayer 自身不做 transform，避免双层偏移导致重影
  const fishLayer = document.getElementById('fs-fish-layer');
  if(fishLayer){
    // 浮漂X位置：鱼嘴（字符画左端）最终对准这里
    const floatXNow = _fs._floatX || Math.round((_fs._stageW || 320) * 0.30);

    if(phase === 'approach'){
      const progress = _fs._approachStart != null
        ? Math.min(1, (t - _fs._approachStart) / 2400)
        : 0;
      // 鱼从右侧游来，progress=0时在floatX+120px，progress=1时嘴巴正好在floatX
      const slideX = (1 - progress) * 120;
      const wiggle = Math.sin(t * 0.008) * 2;
      const fishArt = _fsGetCurrentFishArt();
      const fc = _fs._currentFishColor || '#2a8a5a';
      fishLayer.style.left     = floatXNow + 'px';
      fishLayer.style.right    = '0';
      fishLayer.style.transform = '';
      fishLayer.style.opacity   = Math.min(1, progress * 3).toString();
      fishLayer.innerHTML = `<pre style="margin:0;display:inline-block;
        transform:translate(${slideX}px,${wiggle}px);
        font-family:'Courier New',monospace;font-size:14px;line-height:1.2;
        color:${fc};filter:drop-shadow(0 0 5px ${fc}aa);
        white-space:nowrap;letter-spacing:1px;">${_fsEscHtml(fishArt.approach)}</pre>`;

    } else if(phase === 'fake'){
      const wiggle = Math.sin(t * 0.01) * 3;
      const fishArt = _fsGetCurrentFishArt();
      const fc = _fs._currentFishColor || '#2a8a5a';
      fishLayer.style.left     = floatXNow + 'px';
      fishLayer.style.right    = '0';
      fishLayer.style.transform = '';
      fishLayer.style.opacity   = '0.9';
      fishLayer.innerHTML = `<pre style="margin:0;display:inline-block;
        transform:translateX(${wiggle}px);
        font-family:'Courier New',monospace;font-size:14px;line-height:1.2;
        color:${fc};white-space:nowrap;letter-spacing:1px;">${_fsEscHtml(fishArt.approach)}</pre>`;

    } else if(phase === 'bite'){
      // bite时继续使用 fishLayer 中的鱼影（之前游动的那个）
      // 让鱼影更明显：提高透明度、改变颜色、停止动画
      const fishArt = _fsGetCurrentFishArt();
      const fc = '#ffcc00'; // 咬钩时鱼影变为金色
      fishLayer.style.opacity = '1';
      // 更新鱼影样式，让它在咬钩时更醒目
      const preEl = fishLayer.querySelector('pre');
      if(preEl) {
        preEl.style.color = fc;
        preEl.style.filter = 'drop-shadow(0 0 12px rgba(255,204,0,0.8))';
        preEl.style.animation = 'fs-fish-struggle 0.4s ease-in-out infinite';
      }

    } else {
      // 恢复approach时的容器样式
      const surfTopNow = _fs._surfTop || 235;
      fishLayer.style.top      = (surfTopNow + 22) + 'px';
      fishLayer.style.left     = '0';
      fishLayer.style.right    = '0';
      fishLayer.style.height   = '50px';
      fishLayer.style.display  = 'flex';
      fishLayer.style.overflow = 'hidden';
      fishLayer.style.opacity  = '0';
      fishLayer.style.transform = '';
      fishLayer.innerHTML       = '';
    }
  }

  // ── 钓鱼人竿角度（bite时竿弯）──
  const rodWrapAnim = document.getElementById('fs-rod-wrap');
  if(rodWrapAnim){
    // 只在没有明确动画运行时才应用bend/bite
    const currentAnim = window.getComputedStyle(rodWrapAnim).animation;
    // 如果已经在执行 fs-rod-windup 或 fs-rod-swing，不干扰
    if(!currentAnim || currentAnim === 'none' || !currentAnim.includes('rod-')){
      rodWrapAnim.style.transformOrigin = 'right bottom';
      if(phase === 'bite'){
        rodWrapAnim.style.animation = 'fs-rod-bite 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite';
      } else {
        rodWrapAnim.style.animation = 'fs-rod-bend 2.5s ease-in-out infinite';
      }
    }
  }

  // ── 钓鱼人物动画（根据阶段不同）──
  const anglerEl = document.getElementById('fs-angler');
  if(anglerEl){
    if(phase === 'bite'){
      // 咬钩时人物有反应
      anglerEl.style.animation = 'fs-angler-bite 0.6s ease-in-out';
      setTimeout(()=>{ if(anglerEl) anglerEl.style.animation = ''; }, 600);
    } else if(phase === 'idle' || phase === 'approach'){
      // 等待时人物轻微呼吸/等待动画
      anglerEl.style.animation = 'fs-angler-wait 3s ease-in-out infinite';
    } else {
      anglerEl.style.animation = '';
    }
  }

  // ── 更新鱼线（bite时加粗变色）──
  // 抛竿动画期间不更新，避免覆盖飞行鱼线
  if(phase !== _fs._lastLinePhase && phase !== 'cast'){
    _fsDrawLine(phase);
    _fs._lastLinePhase = phase;
  }

  // ── 舞台光晕 ──
  const stage = document.getElementById('fs-stage');
  if(stage && phase !== _fs._lastGlowPhase){
    const sp2 = _fs.spot;
    switch(phase){
      case 'idle':
        stage.style.borderColor = '#1a3a5a';
        stage.style.boxShadow   = 'inset 0 0 30px rgba(0,20,60,0.3)';
        stage.style.animation   = '';
        break;
      case 'approach':
        stage.style.borderColor = '#1a6a4a';
        stage.style.boxShadow   = '0 0 14px rgba(40,180,100,0.3), inset 0 0 20px rgba(0,40,20,0.3)';
        stage.style.animation   = '';
        break;
      case 'fake':
        stage.style.borderColor = '#4a9a30';
        stage.style.boxShadow   = '0 0 22px rgba(80,200,30,0.5), inset 0 0 20px rgba(20,60,0,0.3)';
        stage.style.animation   = '';
        break;
      case 'bite':
        stage.style.borderColor = '#ffaa00';
        stage.style.animation   = 'fs-bite-glow 0.7s ease-in-out infinite';
        break;
    }
    _fs._lastGlowPhase = phase;
  }

  _fs._raf = requestAnimationFrame(_fsAnimLoop);
}

// ═══════════════════════════════════════════════
// 10. 状态机
// ═══════════════════════════════════════════════

function _fsStartCasting(){
  _fsClearAll();
  if(typeof SoundFX!=='undefined') SoundFX.play('fish_cast');

  _fs.castPhase = 'idle';
  _fs.fakeCount = 0;
  _fs.fakesTotal = 1 + Math.floor(Math.random() * 3);
  _fs.canCast   = false;
  _fs.biteStart = 0;
  _fs.biteWindow = 1500 + Math.random() * 1000;
  _fs._lastLinePhase = 'idle'; // 设为idle，避免第一次RAF循环时重复绘制idle鱼线
  _fs._lastGlowPhase = '';
  _fs._approachStart = null;

  _fsUpdateBtn(false);

  // 确保浮漂可见（避免重试后浮漂消失）
  const floatEl = document.getElementById('fs-float');
  if(floatEl) floatEl.style.opacity = '1';

  // 注意：RAF循环在抛竿动画结束后才启动，避免在cast期间绘制idle鱼线

  // 抛竿动画，结束后再启动等鱼氛围 & 等鱼计时
  const waitMs = 2000 + Math.random() * 3000;
  // 用两帧延迟确保 DOM 完全渲染后再读取坐标
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      _fsPlayCastAnimation(()=>{
        if(!_fs) return; // 小游戏可能已在回调前关闭
        // 抛竿落水后，绘制idle鱼线
        _fsDrawLine('idle');
        // 启动RAF动画循环
        _fs._raf = requestAnimationFrame(_fsAnimLoop);
        // 启动等鱼氛围特效
        _fsStartAmbient();
        // 再等 waitMs 后鱼开始靠近
        _fs._t1 = setTimeout(() => { if(_fs) _fsStartApproach(); }, waitMs);
      });
    });
  });
}

function _fsStartApproach(){
  if(!_fs || _fs.castPhase === 'done') return;
  _fs.castPhase = 'approach';
  _fs._approachStart = performance.now();

  // 随机抽一条鱼决定水下显示的字符画（不影响最终钓获结果）
  const sp  = _fs.spot;
  const lv  = _fsPlayerLevel();
  const pool = sp.fish.map(id=>FISH_DB.find(f=>f.id===id)).filter(f=>f&&f.minLevel<=lv&&f.rarity!=='junk');
  if(pool.length > 0){
    const peek = pool[Math.floor(Math.random()*pool.length)];
    _fs._peekFish = peek.id;
    _fs._currentFishColor = FISH_ART[peek.id]?.color || '#2a8a5a';
  }

  // approach时额外水下光斑，暗示有鱼靠近
  _fsSpawnSunbeam();
  setTimeout(()=>_fsSpawnSunbeam(), 600);

  const approachMs = 1600 + Math.random() * 1400;
  _fs._t2 = setTimeout(() => _fsNextFake(), approachMs);
}

function _fsNextFake(){
  if(!_fs || _fs.castPhase === 'done') return;

  if(_fs.fakeCount < _fs.fakesTotal){
    _fs.castPhase = 'fake';
    _fs.fakeCount++;

    // 假咬时生成水花
    _fsSpawnSplash(false);

    _fs._t3 = setTimeout(() => {
      if(!_fs || _fs.castPhase === 'done') return;
      _fs.castPhase = 'approach';
      _fs._approachStart = performance.now();
      const nextWait = 900 + Math.random() * 1200;
      _fs._t4 = setTimeout(() => { if(_fs) _fsNextFake(); }, nextWait);
    }, 900);

  } else {
    _fsTrueBite();
  }
}

function _fsTrueBite(){
  if(!_fs) return;
  _fs.castPhase = 'bite';
  _fs.canCast   = true;
  _fs.biteStart = Date.now();
  _fsUpdateBtn(true);
  if(typeof SoundFX!=='undefined') SoundFX.play('fish_bite');

  // 真咬时：大水花 + 水圈扩散 + 鱼线闪电
  // 鱼影继续使用 fishLayer 中的（之前游动的那个）
  _fsSpawnSplash(true);
  _fsSpawnWaterRings();
  _fsLineLightning();
  // 每隔0.45s持续产生水圈，直到咬钩结束
  _fs._biteRingTimer = setInterval(()=>{
    if(!_fs || _fs.castPhase !== 'bite'){ clearInterval(_fs._biteRingTimer); return; }
    _fsSpawnWaterRings();
    _fsSpawnSplash(false);
  }, 450);

  _fs._t5 = setTimeout(() => {
    if(!_fs || !_fs.canCast) return;
    clearInterval(_fs._biteRingTimer);
    _fs.canCast   = false;
    _fs.castPhase = 'idle';
    _fsUpdateBtn(false);
    const nextRound = 1500 + Math.random() * 2000;
    _fs._t1 = setTimeout(() => _fsStartApproach(), nextRound);
  }, _fs.biteWindow);
}

// ── 水花粒子 ──────────────────────────────────

function _fsSpawnSplash(isBig){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;

  const surfTop = _fs._surfTop || 235;
  const count   = isBig ? 5 : 3;

  for(let i=0; i<count; i++){
    const p  = document.createElement('div');
    p.className = 'fs-splash-particle';
    const chars = isBig
      ? ['💦','✨','⊙','○','·']
      : ['○','·','⊙','〰'];
    p.textContent = chars[i % chars.length];
    p.style.cssText = `
      position:absolute;
      left:${35 + (Math.random()-0.5)*20}%;
      top:${surfTop - 5 + (Math.random()-0.5)*10}px;
      font-size:${isBig?14:11}px;
      pointer-events:none;
      animation:fs-splash ${0.5+Math.random()*0.4}s ${i*0.08}s ease-out forwards;
      z-index:15;color:${isBig?'#aaddff':'#88ccaa'};`;
    stage.appendChild(p);
    // 动画结束后自动删除
    setTimeout(() => p.remove(), 1000 + i*80);
  }
}

// ═══════════════════════════════════════════════
// 抛竿动画（进入钓鱼时播放，约1.2s后进入idle）
// ═══════════════════════════════════════════════

function _fsPlayCastAnimation(onDone){
  const stage = document.getElementById('fs-stage');
  const anglerEl = document.getElementById('fs-angler');
  if(!stage || !anglerEl){ onDone && onDone(); return; }

  const rodTipX = _fs._rodTipX || 240;
  const rodTipY = _fs._rodTipY || 60;
  const surfTop = _fs._surfTop || 235;
  const floatX  = _fs._floatX  || 100;

  // 隐藏真实浮漂（动画期间用飞行overlay代替）
  const floatEl = document.getElementById('fs-float');
  if(floatEl) floatEl.style.opacity = '0';

  // ── 找到竿DOM（fs-rod-wrap），只操作它 ──
  const rodWrap = document.getElementById('fs-rod-wrap');

  // 抛竿期间清除所有动画（避免多个竿叠加）
  anglerEl.style.animation = 'none';
  if(rodWrap){
    rodWrap.style.animation = 'none';
    rodWrap.style.transform = ''; // 清除之前的transform
  }

  // 清除idle鱼线（避免抛竿期间显示两根鱼线）
  const svg = document.getElementById('fs-line-svg');
  if(svg) svg.innerHTML = '';

  if(rodWrap){
    // transform-origin 设在竿把根部（右下角）
    rodWrap.style.transformOrigin = 'right bottom';
    rodWrap.style.transition = 'none';

    // 1. 蓄力：竿上扬
    rodWrap.style.animation = 'fs-rod-windup 0.35s ease-out forwards';

    // 2. 甩出：竿猛地挥下
    setTimeout(()=>{
      if(rodWrap) rodWrap.style.animation = 'fs-rod-swing 0.5s cubic-bezier(0.15,1.4,0.4,1) forwards';
    }, 320);
  }

  // 320ms后：飞出浮漂+飞线（与竿子挥下同步）
  setTimeout(()=>{
    // 清除idle鱼线（避免与飞行鱼线重叠）
    if(svg) svg.innerHTML = '';

    // 起始位置：竿梢（从坐标记录）
    const startX = rodTipX;
    const startY = rodTipY;
    const endX   = floatX;
    const endY   = surfTop - 4;
    const dx = endX - startX;
    const dy = endY - startY;

    // 飞行浮漂 div
    const bEl = document.createElement('div');
    bEl.id = 'fs-cast-bobber';
    bEl.style.cssText = `
      position:absolute;
      left:${startX}px; top:${startY}px;
      font-family:'Courier New',monospace;font-size:11px;
      color:#ff6666;line-height:1;
      pointer-events:none; z-index:25;
      --bx1:${dx*0.4}px;  --by1:${dy*0.15-52}px;
      --bx2:${dx*0.82}px; --by2:${dy*0.75-8}px;
      --bx3:${dx}px;      --by3:${dy}px;
      animation:fs-bobber-fly 0.62s cubic-bezier(0.25,0.46,0.45,0.94) forwards;`;
    bEl.innerHTML = `<span style="color:#ff4444;">│</span><br><span style="color:#ff6666;font-size:9px;">●</span>`;
    stage.appendChild(bEl);

    // 飞线：SVG贝塞尔路径展开（复用外部已获取的svg）
    if(svg){
      const ns = 'http://www.w3.org/2000/svg';
      const pathEl = document.createElementNS(ns, 'path');
      const cx = (startX + endX) / 2;
      const cy = Math.min(startY, endY) - 48;
      pathEl.setAttribute('d', `M${startX},${startY} Q${cx},${cy} ${endX},${endY}`);
      pathEl.setAttribute('stroke', '#aaddff');
      pathEl.setAttribute('stroke-width', '2.5');
      pathEl.setAttribute('fill', 'none');
      pathEl.setAttribute('stroke-dasharray', '600');
      pathEl.setAttribute('stroke-dashoffset', '600');
      pathEl.id = 'fs-cast-line';
      pathEl.style.filter = 'drop-shadow(0 0 3px rgba(170, 221, 255, 0.8))';
      pathEl.style.animation = 'fs-line-shoot 0.6s ease-out forwards';
      svg.appendChild(pathEl);
    }
  }, 320);

  // 900ms：浮漂落水水花+水圈，恢复竿/浮漂
  setTimeout(()=>{
    // 清除飞行元素
    const bEl2 = document.getElementById('fs-cast-bobber');
    if(bEl2) bEl2.remove();
    const lEl = document.getElementById('fs-cast-line');
    if(lEl) lEl.remove();

    // 落水水花（4粒向四周散开）
    const splashAngles = [-100, -70, -110, -80, -60];
    ['*','·','°','~','✦'].forEach((ch, i) => {
      const s = document.createElement('div');
      s.textContent = ch;
      const rad = splashAngles[i] * Math.PI / 180;
      const dist = 10 + i * 4;
      s.style.cssText = `
        position:absolute;
        left:${floatX}px; top:${surfTop - 4}px;
        font-size:10px; color:rgba(130,215,255,0.9);
        pointer-events:none; z-index:20;
        --sx:${Math.cos(rad)*dist}px; --sy:${Math.sin(rad)*dist - 10}px; --sy2:${Math.sin(rad)*dist - 20}px;
        animation:fs-entry-splash ${0.38+i*0.04}s ${i*0.03}s ease-out forwards;`;
      stage.appendChild(s);
      setTimeout(()=>s.remove(), 600);
    });

    // 落水水圈（2圈）
    for(let i = 0; i < 2; i++){
      const r = document.createElement('div');
      r.style.cssText = `
        position:absolute;
        left:${floatX - 5}px; top:${surfTop}px;
        width:10px; height:5px;
        border:1px solid rgba(120,210,240,${0.65 - i*0.15});
        border-radius:50%; pointer-events:none; z-index:20;
        animation:fs-entry-ring ${0.45 + i*0.15}s ${i*0.1}s ease-out forwards;`;
      stage.appendChild(r);
      setTimeout(()=>r.remove(), 800);
    }

    // 竿恢复 idle bend（完全清除后重新设置）
    if(rodWrap){
      rodWrap.style.animation = 'none';
      rodWrap.style.transform = '';
      // 用 requestAnimationFrame 确保重排后再应用动画
      requestAnimationFrame(() => {
        if(rodWrap) rodWrap.style.animation = 'fs-rod-bend 2.5s ease-in-out infinite';
      });
    }
    anglerEl.style.animation = 'none';

    // 恢复真实浮漂
    const floatEl2 = document.getElementById('fs-float');
    if(floatEl2){
      floatEl2.style.transition = 'opacity 0.25s';
      floatEl2.style.opacity = '1';
    }

    // 清除SVG确保没有残留（飞行鱼线已在上面移除）
    const svgFinal = document.getElementById('fs-line-svg');
    if(svgFinal) svgFinal.innerHTML = '';

    // idle鱼线将在_startCasting的回调中绘制，避免重复

    onDone && onDone();
  }, 900);
}

// ═══════════════════════════════════════════════
// 起竿动画（按下起竿按钮时播放，约0.6s后处理结果）
// ═══════════════════════════════════════════════

function _fsPlayReelAnimation(onDone){
  const stage = document.getElementById('fs-stage');
  const anglerEl = document.getElementById('fs-angler');
  if(!stage || !anglerEl){ onDone && onDone(); return; }

  const surfTop = _fs._surfTop || 235;
  const floatX  = _fs._floatX  || 100;

  const rodWrap = document.getElementById('fs-rod-wrap');
  const floatEl = document.getElementById('fs-float');
  const svg     = document.getElementById('fs-line-svg');

  // 停掉 idle bend
  anglerEl.style.animation = 'none';

  // 1. 竿猛然上挑（弹簧物理效果，0.9s展现完整回弹）
  if(rodWrap){
    rodWrap.style.transformOrigin = 'right bottom';
    rodWrap.style.animation = 'fs-rod-reel 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
  }

  // 2. 鱼线收缩（SVG里真实的line/path）
  if(svg){
    const lineEl = svg.querySelector('line, path:not(#fs-cast-line)');
    if(lineEl) lineEl.style.animation = 'fs-line-reel 0.4s ease-in forwards';
  }

  // 3. 浮漂向上飞起
  if(floatEl){
    floatEl.style.transition = 'none';
    floatEl.style.animation = 'fs-reel-splash 0.45s ease-out forwards';
  }

  // 4. 入水位置溅起水花（起竿拉出水面）
  setTimeout(()=>{
    ['~','·','*','°'].forEach((ch, i) => {
      const s = document.createElement('div');
      s.textContent = ch;
      const dxArr = [-14, -5, 5, 14];
      const syArr = [-22, -30, -26, -20];
      s.style.cssText = `
        position:absolute;
        left:${floatX + dxArr[i]}px; top:${surfTop}px;
        font-size:11px; color:rgba(130,215,255,0.85);
        pointer-events:none; z-index:20;
        --sx:${dxArr[i]}px; --sy:${syArr[i]}px; --sy2:${syArr[i]-10}px;
        animation:fs-reel-splash ${0.35+i*0.04}s ${i*0.04}s ease-out forwards;`;
      stage.appendChild(s);
      setTimeout(()=>s.remove(), 550);
    });
  }, 60);

  // 5. 动画结束后恢复竿状态，执行回调
  setTimeout(()=>{
    if(rodWrap){
      rodWrap.style.animation = 'none';
      rodWrap.style.transform = '';
    }
    if(floatEl){
      floatEl.style.animation = 'none';
      floatEl.style.opacity = '0';
    }
    anglerEl.style.animation = 'none';
    onDone && onDone();
  }, 520);
}

// ═══════════════════════════════════════════════
// 等鱼氛围特效（idle阶段，低调不抢戏）
// ═══════════════════════════════════════════════

// ── 浮漂细涟漪（钓线入水的自然波纹）──────────

function _fsSpawnIdleRipple(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const floatX  = _fs._floatX  || 100;
  const r = document.createElement('div');
  r.style.cssText = `
    position:absolute;
    left:${floatX}px; top:${surfTop + 1}px;
    width:10px; height:5px;
    border:1px solid rgba(120,200,240,0.45);
    border-radius:50%;
    pointer-events:none;
    transform-origin:left center;
    animation:fs-float-ripple ${0.9 + Math.random()*0.4}s ease-out forwards;
    z-index:7;`;
  stage.appendChild(r);
  setTimeout(()=>r.remove(), 1400);
}

// ── 水面漂浮物（枯叶/花瓣/浮萍，随机飘过）──────

function _fsSpawnLeafDrift(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const stageW  = _fs._stageW  || 320;

  // 漂浮物种类（按钓场带不同特色）
  const spot = _fs.spot ? _fs.spot.id : 'river';
  const leafSets = {
    mountain: ['🍂','🍃','·','~'],
    river:    ['🍃','~','·','🌿'],
    lake:     ['🌿','🍃','·','○'],
    sea:      ['~','·','〰','○'],
    canal:    ['🍂','·','~','○'],
    pond:     ['🌸','🍃','·','🌿'],
  };
  const leaves = leafSets[spot] || leafSets.river;
  const ch = leaves[Math.floor(Math.random() * leaves.length)];

  // 随机从左或右飘来
  const fromLeft = Math.random() > 0.5;
  const startX = fromLeft ? -15 : stageW + 15;
  const driftX = fromLeft ? 60 + Math.random()*80 : -(60 + Math.random()*80);
  const rot    = (Math.random()-0.5)*30;
  const rot2   = (Math.random()-0.5)*50;

  const leaf = document.createElement('div');
  leaf.textContent = ch;
  leaf.style.cssText = `
    position:absolute;
    left:${startX}px;
    top:${surfTop - 2 + (Math.random()-0.5)*5}px;
    font-size:${ch.length===2 ? 10 : 11}px;
    color:rgba(${spot==='pond'?'255,150,150':'120,200,120'},0.55);
    pointer-events:none;
    --lx:${driftX*0.5}px; --lr:${rot}deg;
    --lx2:${driftX}px;   --lr2:${rot2}deg;
    animation:fs-leaf-drift ${3.5+Math.random()*2.5}s linear forwards;
    z-index:7;`;
  stage.appendChild(leaf);
  setTimeout(()=>leaf.remove(), 6500);
}

// ── 水下神秘鱼影（模糊，只在水深层闪过）──────

function _fsSpawnShadowFish(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const stageW  = _fs._stageW  || 320;

  // bite阶段：鱼影直接出现在浮漂附近
  const isBitePhase = _fs.castPhase === 'bite';
  const floatX = _fs._floatX || Math.round(stageW * 0.30);
  
  const fromLeft = Math.random() > 0.5;
  const depth    = isBitePhase ? 15 + Math.random() * 20 : 30 + Math.random() * 50; // bite时更靠近水面
  const fishChars = [
    '<~>','<~~>','><>','><((','>><>','-<->',
    '><(((°>','«~~»','》~《','》=《'
  ];
  const ch = fishChars[Math.floor(Math.random() * fishChars.length)];
  const opacity = isBitePhase ? 0.6 + Math.random() * 0.3 : 0.10 + Math.random() * 0.12; // bite时更明显

  const sfEl = document.createElement('div');
  sfEl.textContent = fromLeft ? ch : ch.split('').reverse().join('');
  
  let startX, animationName, animationDuration;
  if(isBitePhase) {
    // bite时：鱼影在浮漂附近小范围游动
    startX = floatX - 40 + Math.random() * 80;
    animationName = 'fs-fish-bite-swim';
    animationDuration = 2 + Math.random() * 1.5;
  } else {
    // approach时：从屏幕外游进来
    startX = fromLeft ? -50 : stageW + 50;
    animationName = 'fs-fish-swim-sway';
    animationDuration = 3 + Math.random() * 2.5;
  }
  
  sfEl.style.cssText = `
    position:absolute;
    left:${startX}px; top:${surfTop + depth}px;
    font-family:'Courier New',monospace;font-size:${isBitePhase ? 14 : 12}px;
    color:${isBitePhase ? 'rgba(255,200,60,0.9)' : `rgba(60,180,160,${opacity})`};
    filter:${isBitePhase ? 'drop-shadow(0 0 8px rgba(255,200,60,0.7))' : 'blur(1.2px)'};
    pointer-events:none;
    animation:${animationName} ${animationDuration}s ${Math.random()*0.3}s ease-in-out infinite;
    z-index:${isBitePhase ? 12 : 6};`;
  stage.appendChild(sfEl);
  setTimeout(()=>sfEl.remove(), (isBitePhase ? 3500 : 6500));
}

// ── 水下光斑（阳光透过水面折射）──────────────

function _fsSpawnSunbeam(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const stageW  = _fs._stageW  || 320;

  const x = 20 + Math.random() * (stageW - 40);
  const h = 20 + Math.random() * 40;
  const w = 6  + Math.random() * 12;
  const op = 0.07 + Math.random() * 0.07;

  const beam = document.createElement('div');
  beam.style.cssText = `
    position:absolute;
    left:${x}px; top:${surfTop + 10}px;
    width:${w}px; height:${h}px;
    background:linear-gradient(to bottom, rgba(200,240,255,var(--sbo,${op})), transparent);
    pointer-events:none;
    transform-origin:top center;
    --sbo:${op};
    animation:fs-sunbeam ${1.8+Math.random()*1.5}s ${Math.random()*0.8}s ease-in-out forwards;
    z-index:6;`;
  stage.appendChild(beam);
  setTimeout(()=>beam.remove(), 4000);
}

// ── 蜻蜓/飞鸟掠过水面 ──────────────────────

function _fsSpawnSkim(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const stageW  = _fs._stageW  || 320;

  const fromLeft = Math.random() > 0.5;
  const y = surfTop - 12 - Math.random() * 20; // 水面以上一点点
  // 蜻蜓/飞鸟/燕子
  const skimmers = ['🦗','·-·','~^~','-v-','⌒','»'];
  const ch = skimmers[Math.floor(Math.random() * skimmers.length)];

  const el = document.createElement('div');
  el.textContent = ch;
  el.style.cssText = `
    position:absolute;
    left:0px; top:${y}px;
    font-size:${ch.length===2 ? 14 : 11}px;
    color:rgba(160,220,200,0.65);
    pointer-events:none;
    --skx0:${fromLeft ? -30 : stageW+30}px;
    --skx1:${fromLeft ? stageW+30 : -30}px;
    animation:fs-skim ${1.8+Math.random()*1.2}s ${Math.random()*0.3}s linear forwards;
    z-index:9;`;
  stage.appendChild(el);
  setTimeout(()=>el.remove(), 3500);
}

// ── 总调度：idle 氛围主循环（优化版：统一调度器）─────────────────

const _FS_AMBIENT_SCHEDULE = [
  { name: 'ripple', fn: '_fsSpawnIdleRipple', interval: 2000, variance: 1200 },
  { name: 'leaf', fn: '_fsSpawnLeafDrift', interval: 5000, variance: 4000 },
  { name: 'shadowFish', fn: '_fsSpawnShadowFish', interval: 7000, variance: 6000 },
  { name: 'sunbeam', fn: '_fsSpawnSunbeam', interval: 4000, variance: 3000 },
  { name: 'skim', fn: '_fsSpawnSkim', interval: 9000, variance: 7000 },
  { name: 'floatRipple', fn: '_fsSpawnFloatRipple', interval: 3000, variance: 2000 },
  { name: 'bubble', fn: '_fsSpawnBubbles', interval: 4000, variance: 2000 },
  { name: 'seaweed', fn: '_fsSpawnSeaweed', interval: 8000, variance: 4000 },
  { name: 'firefly', fn: '_fsSpawnFirefly', interval: 15000, variance: 10000 },
  { name: 'cloud', fn: '_fsSpawnCloud', interval: 20000, variance: 10000 }
];

function _fsStartAmbient(){
  if(!_fs) return;
  _fsStopAmbient(); // 先清理旧的

  // 初始化调度状态
  _fs._ambientNextTick = {};
  _fs._ambientBaseTime = performance.now();
  
  // 计算每个效果的下次触发时间
  _FS_AMBIENT_SCHEDULE.forEach(s => {
    _fs._ambientNextTick[s.name] = s.interval + Math.random() * s.variance;
  });

  // 统一调度器：每 100ms 检查一次
  _fs._ambientTimer = setInterval(() => {
    if(!_fs || _fs.castPhase === 'done') return;
    const now = performance.now();
    const elapsed = now - _fs._ambientBaseTime;
    
    _FS_AMBIENT_SCHEDULE.forEach(s => {
      if(elapsed >= _fs._ambientNextTick[s.name]) {
        // 触发效果
        const fn = window[s.fn];
        if(typeof fn === 'function') fn();
        // 重新计算下次触发时间
        _fs._ambientNextTick[s.name] = elapsed + s.interval + Math.random() * s.variance;
      }
    });
  }, 100);

  // 开场立即出一波，消除等待感
  setTimeout(()=>_fsSpawnIdleRipple(), 800);
  setTimeout(()=>_fsSpawnSunbeam(), 1200);
  setTimeout(()=>_fsSpawnLeafDrift(), 2500);
  setTimeout(()=>_fsSpawnFloatRipple(), 1500);
  setTimeout(()=>_fsSpawnBubbles(), 2000);
}

function _fsStopAmbient(){
  if(!_fs) return;
  clearInterval(_fs._ambientTimer);
  _fs._ambientTimer = null;
  _fs._ambientNextTick = null;
}

// ── 浮漂周围水涟漪（idle）────────────────────

function _fsSpawnFloatRipple(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const floatX = _fs._floatX || 100;
  const surfTop = _fs._surfTop || 235;
  
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:absolute;
    left:${floatX}px; top:${surfTop + 6}px;
    width:24px; height:24px;
    border:2px solid rgba(100,180,220,0.6);
    border-radius:50%;
    pointer-events:none;
    z-index:8;
    transform:translate(-50%,-50%);
    animation:fs-ripple-spread 2.5s ease-out forwards;`;
  stage.appendChild(ripple);
  setTimeout(()=>ripple.remove(), 2500);
}

// ── 水下气泡上升 ──────────────────────────────

function _fsSpawnBubbles(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const floatX = _fs._floatX || 100;
  const surfTop = _fs._surfTop || 235;
  
  for(let i=0;i<3;i++){
    setTimeout(()=>{
      const bubble = document.createElement('div');
      bubble.textContent = '·';
      const offsetX = (Math.random()-0.5)*40;
      const startY = surfTop + 20 + Math.random()*30;
      bubble.style.cssText = `
        position:absolute;
        left:${floatX + offsetX}px; top:${startY}px;
        font-size:10px;
        color:rgba(150,200,230,0.7);
        pointer-events:none;
        z-index:7;
        animation:fs-bubble-rise 3s ease-out forwards;`;
      stage.appendChild(bubble);
      setTimeout(()=>bubble.remove(), 3000);
    }, i*200);
  }
}

// ── 水草摆动 ────────────────────────────────

function _fsSpawnSeaweed(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const stageW = _fs._stageW || 320;
  
  const seaweeds = ['🌿','🌱','🌾','╱╲','╲╱'];
  const ch = seaweeds[Math.floor(Math.random()*seaweeds.length)];
  
  const weed = document.createElement('div');
  weed.textContent = ch;
  const x = Math.random()*stageW;
  const y = surfTop + 30 + Math.random()*20;
  weed.style.cssText = `
    position:absolute;
    left:${x}px; top:${y}px;
    font-size:12px;
    color:rgba(80,140,100,0.6);
    pointer-events:none;
    z-index:5;
    animation:fs-seaweed-sway 4s ease-in-out infinite;`;
  stage.appendChild(weed);
  setTimeout(()=>weed.remove(), 12000);
}

// ── 萤火虫闪烁飞行 ───────────────────────────

function _fsSpawnFirefly(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const stageW = _fs._stageW || 320;
  
  const firefly = document.createElement('div');
  firefly.textContent = '✦';
  const startX = Math.random()*stageW;
  const startY = 50 + Math.random()*100;
  firefly.style.cssText = `
    position:absolute;
    left:${startX}px; top:${startY}px;
    font-size:8px;
    color:#ffdd66;
    pointer-events:none;
    z-index:16;
    animation:
      fs-firefly-glow 1.5s ease-in-out infinite,
      fs-firefly-fly 8s linear forwards;`;
  stage.appendChild(firefly);
  setTimeout(()=>firefly.remove(), 8000);
}

// ── 云朵飘过天空 ─────────────────────────────

function _fsSpawnCloud(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  
  const cloud = document.createElement('div');
  cloud.textContent = '☁';
  const y = 20 + Math.random()*60;
  const size = 14 + Math.random()*8;
  cloud.style.cssText = `
    position:absolute;
    left:-40px; top:${y}px;
    font-size:${size}px;
    color:rgba(180,200,220,0.4);
    pointer-events:none;
    z-index:3;
    animation:fs-cloud-drift ${25 + Math.random()*15}s linear forwards;`;
  stage.appendChild(cloud);
  setTimeout(()=>cloud.remove(), 45000);
}

// ── 气泡（approach时持续产生）──────────────────

function _fsSpawnBubbles(){
  if(!_fs || _fs.castPhase !== 'approach') return;
  const stage   = document.getElementById('fs-stage');
  const fishLayer = document.getElementById('fs-fish-layer');
  if(!stage || !fishLayer) return;

  const surfTop = _fs._surfTop || 235;
  for(let i=0;i<2;i++){
    const b = document.createElement('div');
    b.className = 'fs-bubble';
    b.textContent = '·';
    b.style.cssText = `
      position:absolute;
      left:${30 + Math.random()*20}%;
      top:${surfTop + 20 + Math.random()*40}px;
      font-size:8px;color:rgba(100,200,255,0.5);
      animation:fs-bubble ${1.2+Math.random()*0.8}s ease-out forwards;
      pointer-events:none;z-index:8;`;
    stage.appendChild(b);
    setTimeout(() => b.remove(), 2200);
  }
}

// ── 水圈扩散（咬钩时浮漂处）──────────────────

function _fsSpawnWaterRings(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const floatX  = _fs._floatX  || 100;
  const colors  = ['rgba(100,220,255,0.7)','rgba(255,200,50,0.5)','rgba(255,255,255,0.4)'];
  for(let i=0; i<3; i++){
    const r = document.createElement('div');
    const c = colors[i];
    r.style.cssText = `
      position:absolute;
      left:${floatX}px; top:${surfTop + 2}px;
      width:${18 + i*14}px; height:${8 + i*5}px;
      border:2px solid ${c};
      border-radius:50%;
      pointer-events:none;
      transform-origin:left center;
      animation:fs-water-ring ${0.6 + i*0.18}s ${i*0.12}s ease-out forwards;
      z-index:12;`;
    stage.appendChild(r);
    setTimeout(()=>r.remove(), 900 + i*200);
  }
}

// ── 鱼线闪电特效（咬钩强化）──────────────────

function _fsLineLightning(){
  const svg = document.getElementById('fs-line');
  if(!svg) return;
  // 给鱼线SVG加上闪烁动画类
  svg.style.animation = 'fs-lightning 0.4s ease-in-out 3';
  setTimeout(()=>{ if(svg) svg.style.animation = ''; }, 1300);
}

// ── 显示咬钩的鱼字符画 ───────────────────────

function _fsShowBitingFish(){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  
  const fishLayer = document.getElementById('fs-fish-layer');
  if(!fishLayer) return;
  
  const floatXNow = _fs._floatX || Math.round((_fs._stageW || 320) * 0.30);
  const surfTopNow = _fs._surfTop || 235;
  const fishArt = _fsGetCurrentFishArt();
  const fc = '#40ffaa'; // 咬钩时鱼的发光颜色
  
  // 显示鱼的bite字符画
  fishLayer.style.top = (surfTopNow + 15) + 'px';
  fishLayer.style.left = floatXNow + 'px';
  fishLayer.style.right = '0';
  fishLayer.style.height = '90px';
  fishLayer.style.display = 'block';
  fishLayer.style.overflow = 'visible';
  fishLayer.style.transform = '';
  fishLayer.style.opacity = '1';
  fishLayer.innerHTML = `<pre style="margin:0;display:inline-block;
    font-family:'Courier New',monospace;font-size:14px;line-height:1.2;
    color:${fc};white-space:pre;letter-spacing:1px;
    filter:drop-shadow(0 0 8px ${fc});animation:fs-fish-struggle-hard 0.28s ease-in-out infinite;">${_fsEscHtml(fishArt.bite)}</pre>`;
}

// ── 起竿成功爆炸特效 ──────────────────────────

function _fsBoomEffect(fc){
  const stage = document.getElementById('fs-stage');
  if(!stage || !_fs) return;
  const surfTop = _fs._surfTop || 235;
  const floatX  = _fs._floatX  || 100;
  const stageW  = _fs._stageW  || 320;

  // 1. 全屏金色闪光层
  const flash = document.createElement('div');
  flash.style.cssText = `
    position:absolute;inset:0;
    background:radial-gradient(ellipse at ${floatX}px ${surfTop}px, rgba(255,220,0,0.45) 0%, rgba(255,80,0,0.15) 50%, transparent 80%);
    pointer-events:none;
    animation:fs-flash-gold 0.7s ease-out forwards;
    z-index:20;`;
  stage.appendChild(flash);
  setTimeout(()=>flash.remove(), 750);

  // 2. 冲击波圆环×2
  [0, 120].forEach((delay, idx) => {
    const sw = document.createElement('div');
    sw.style.cssText = `
      position:absolute;
      left:${floatX - 20}px; top:${surfTop - 10}px;
      width:40px; height:20px;
      border:3px solid ${idx===0 ? 'rgba(255,220,60,0.9)' : 'rgba(100,220,255,0.7)'};
      border-radius:50%;
      pointer-events:none;
      animation:fs-shockwave 0.65s ${delay}ms ease-out forwards;
      z-index:18;`;
    stage.appendChild(sw);
    setTimeout(()=>sw.remove(), 800 + delay);
  });

  // 3. 水花大爆炸（10粒）
  const bigChars = ['💦','✨','🌊','⊙','○','·','★','◇','▲','~'];
  const angles   = [0,36,72,108,144,180,216,252,288,324];
  bigChars.forEach((ch, i) => {
    const p = document.createElement('div');
    const angle = (angles[i] * Math.PI) / 180;
    const dist  = 30 + Math.random() * 50;
    const dx    = Math.cos(angle) * dist;
    const dy    = Math.sin(angle) * dist - 20;
    p.textContent = ch;
    p.style.cssText = `
      position:absolute;
      left:${floatX + (Math.random()-0.5)*10}px;
      top:${surfTop - 5}px;
      font-size:${12+Math.floor(Math.random()*8)}px;
      pointer-events:none;
      --fy:${dy}px; --fr:${Math.random()>0.5?360:-360}deg;
      animation:fs-confetti ${0.55+Math.random()*0.35}s ${i*30}ms ease-out forwards;
      z-index:16;
      color:${['#ffe000','#ff6600','#00eeff','#aaffaa','#ff99ff'][i%5]};`;
    stage.appendChild(p);
    setTimeout(()=>p.remove(), 1000);
  });

  // 4. 鱼飞字符
  const fishArt = _fsGetCurrentFishArt();
  if(fishArt){
    const fly = document.createElement('div');
    const c   = fc || _fs._currentFishColor || '#40ffaa';
    fly.innerHTML = `<pre style="margin:0;font-family:'Courier New',monospace;font-size:13px;
      color:${c};filter:drop-shadow(0 0 10px ${c});white-space:nowrap;">${_fsEscHtml(fishArt.approach)}</pre>`;
    fly.style.cssText = `
      position:absolute;
      left:${floatX}px; top:${surfTop + 10}px;
      pointer-events:none;
      animation:fs-fish-fly 0.8s ease-out forwards;
      z-index:17;`;
    stage.appendChild(fly);
    setTimeout(()=>fly.remove(), 900);
  }

  // 5. 水圈×2
  [0,200].forEach(delay => {
    setTimeout(() => _fsSpawnWaterRings(), delay);
  });

  // 6. 大水花×2批次
  _fsSpawnSplashBig(floatX, surfTop, stage);
  setTimeout(()=>_fsSpawnSplashBig(floatX, surfTop, stage), 180);
}

function _fsSpawnSplashBig(floatX, surfTop, stage){
  const chars  = ['💦','✨','〰','⊙','★'];
  for(let i=0;i<chars.length;i++){
    const p = document.createElement('div');
    p.textContent = chars[i];
    const offX = (Math.random()-0.5)*60;
    const offY = (Math.random()-0.5)*14;
    p.style.cssText = `
      position:absolute;
      left:${floatX + offX}px; top:${surfTop - 8 + offY}px;
      font-size:${13+Math.floor(Math.random()*6)}px;
      pointer-events:none;
      --fy:${-30-Math.random()*40}px; --fr:${(Math.random()-0.5)*720}deg;
      animation:fs-splash-big ${0.5+Math.random()*0.3}s ${i*50}ms ease-out forwards;
      z-index:15;
      color:${'#aaddff #88ffee #ffeeaa #ffffff #ffcc66'.split(' ')[i]};`;
    stage.appendChild(p);
    setTimeout(()=>p.remove(), 900);
  }
}

// ═══════════════════════════════════════════════
// 11. 起竿响应
// ═══════════════════════════════════════════════


function _fsCastRod(){
  if(!_fs) return;
  // 防抖：动画进行中不允许重复起竿
  if(_fs._reeling) return;
  _fs._reeling = true;

  if(_fs.canCast){
    // 起竿有鱼：先播放起竿动画，再触发爆炸+结算
    clearInterval(_fs._biteRingTimer);
    if(typeof SoundFX!=='undefined') SoundFX.play('fish_reel');
    const elapsed  = Date.now() - _fs.biteStart;
    const ratio    = elapsed / _fs.biteWindow;
    const bonusRare = ratio < 0.25 ? 25 : (ratio < 0.65 ? 10 : 0);

    _fsPlayReelAnimation(()=>{
      _fsBoomEffect(_fs._currentFishColor);
      _fsClearAll();
      _fs.canCast   = false;
      _fs.castPhase = 'done';
      _fsUpdateBtn(false);
      setTimeout(() => { if(_fs) _fsLandFish(bonusRare); }, 500);
    });

  } else {
    // 空竿：先播放起竿动画，再显示空竿结果
    if(typeof SoundFX!=='undefined') SoundFX.play('fish_reel');
    _fsPlayReelAnimation(()=>{
      _fsClearAll();
      _fs.canCast   = false;
      _fs.castPhase = 'done';
      _fsUpdateBtn(false);
      setTimeout(() => { if(_fs) _fsMiss('empty'); }, 300);
    });
  }
}

// ═══════════════════════════════════════════════
// 12. 钓到鱼 / 空竿
// ═══════════════════════════════════════════════

function _fsLandFish(bonusRare){
  if(!_fs) return;
  const lv = _fsPlayerLevel();
  const sp = _fs.spot;

  // ═══════════════════════════════════════════════
  // 钓鱼"将将胡"系统
  // ═══════════════════════════════════════════════
  const luckRoll = Math.random();
  let specialEvent = null;
  
  // 3%概率：鱼王出现（当前鱼种的最大体重+50%）
  if(luckRoll < 0.03){
    specialEvent = 'fish_king';
  }
  // 5%概率：鱼群爆发（额外获得1-3条同种鱼）
  else if(luckRoll < 0.08){
    specialEvent = 'fish_school';
  }
  // 2%概率：断线危机（需要快速点击，成功则双倍奖励，失败则鱼跑）
  else if(luckRoll < 0.10 && bonusRare > 0){
    specialEvent = 'line_break';
  }

  const rareRoll = Math.random() * 100 < (5 + (sp.rareExtra||0) + bonusRare);
  const pool     = sp.fish.map(id => FISH_DB.find(f=>f.id===id)).filter(f=>f&&f.minLevel<=lv);
  const rarePool = pool.filter(f=>['rare','epic','legendary'].includes(f.rarity));
  const normPool = pool.filter(f=>['common','uncommon','junk'].includes(f.rarity));

  let fish;
  if(rareRoll && rarePool.length > 0){
    fish = rarePool[Math.floor(Math.random()*rarePool.length)];
  } else if(normPool.length > 0){
    fish = normPool[Math.floor(Math.random()*normPool.length)];
  } else {
    fish = pool[Math.floor(Math.random()*pool.length)];
  }

  if(!fish){ _fsMiss('no_fish'); return; }

  const [wMin, wMax] = fish.weight;
  let weight  = parseFloat((wMin + Math.random()*(wMax-wMin)).toFixed(2));
  const isJunk  = fish.rarity === 'junk';
  
  // 鱼王：体重+50%
  if(specialEvent === 'fish_king'){
    weight = parseFloat((weight * 1.5).toFixed(2));
    weight = Math.min(weight, wMax * 1.5);
  }

  // 钓到鱼的音效
  if(typeof SoundFX!=='undefined'){
    if(!isJunk && ['rare','epic','legendary'].includes(fish.rarity)){
      SoundFX.play('fish_rare');
    } else if(!isJunk){
      SoundFX.play('fish_catch');
    } else {
      SoundFX.play('fish_miss');
    }
  }
  const coins   = isJunk ? 0 : Math.round(fish.value * (0.8+weight*0.2) * (1+bonusRare*0.01));

  if(!isJunk){
    // 鱼群爆发：额外获得1-3条同种鱼
    let qty = 1;
    if(specialEvent === 'fish_school'){
      qty = 1 + Math.floor(Math.random() * 3);
      showToast(`🐟 鱼群爆发！额外钓上 ${qty-1} 条${fish.name}！`, 'rare');
    }
    _fsAddToInventory(fish, qty);
    if(typeof edS !== 'undefined' && coins > 0){
      edS.coins = (edS.coins||0) + coins;
      if(typeof editorSave === 'function') editorSave();
      else if(typeof saveGameState === 'function') saveGameState();
    }
  }

  const saved = _fs.saved;
  saved.totalCatch = (saved.totalCatch||0) + (isJunk?0:1);
  if(!saved.records) saved.records = {};
  const key = fish.id;
  if(!saved.records[key]){
    saved.records[key] = { spot:sp.id, weight, coins, time:Date.now() };
  } else if(weight > saved.records[key].weight){
    saved.records[key].weight = weight;
  }
  _fsSave(saved);

  // ── 任务钩子：钓到一条鱼，检查钓鱼类任务进度 ──
  if(!isJunk && typeof onFishingQuestCheck === 'function'){
    onFishingQuestCheck(fish.id, 1);
  }

  // ── 情境任务触发：钓鱼行为（系统自动判断首次） ──
  if(!isJunk && typeof triggerContextualAction === 'function'){
    try{ triggerContextualAction('fishing'); }catch(e){}
  }

  // 钓到稀有鱼时的华丽特效（传奇>史诗>稀有）
  if(!isJunk && ['rare','epic','legendary'].includes(fish.rarity)){
    const stage = document.getElementById('fs-stage');
    if(stage){
      // 屏幕震动
      stage.style.animation = 'fs-shake-screen 0.6s ease-out';
      setTimeout(()=>{ if(stage) stage.style.animation = ''; }, 600);

      // 金色粒子爆炸（仅限传奇鱼）
      if(fish.rarity === 'legendary'){
        _fsSpawnGoldParticles(stage);
      }

      // 光环扩散
      _fsSpawnHalo(stage, fish.rarity);
    }
  }
  
  // 鱼王特效
  if(specialEvent === 'fish_king' && !isJunk){
    const stage = document.getElementById('fs-stage');
    if(stage){
      showToast('👑 鱼王出现了！这是传说中的巨物！', 'legendary');
      _fsSpawnGoldParticles(stage);
      _fsSpawnHalo(stage, 'legendary');
    }
  }

  // 直接在钓鱼舞台上叠加结果，不离开界面
  _fsShowResultOverlay({ fish, weight, coins, isJunk, bonusRare, specialEvent });
}

function _fsMiss(reason){
  if(!_fs) return;
  if(typeof SoundFX!=='undefined') SoundFX.play('fish_miss');
  _fsShowResultOverlay({ fish:null, reason });
}

// ═══════════════════════════════════════════════
// 13. 按钮状态
// ═══════════════════════════════════════════════

function _fsUpdateBtn(isBiting){
  const btn = document.getElementById('fs-cast-btn');
  if(!btn) return;
  if(isBiting){
    btn.style.background  = 'linear-gradient(135deg,#7a2800,#ff7700,#ffcc00)';
    btn.style.color       = '#fff';
    btn.style.borderColor = '#ffcc00';
    btn.style.fontSize    = '18px';
    btn.style.animation   = 'fs-btn-shake 0.15s infinite, fs-btn-glow 0.6s infinite';
    btn.textContent       = '⬆ 起竿！！！';
  } else {
    btn.style.background  = 'linear-gradient(135deg,#0d2a40,#152e4a)';
    btn.style.color       = '#4a8aaa';
    btn.style.borderColor = '#1a3a5a';
    btn.style.fontSize    = '16px';
    btn.style.animation   = '';
    btn.style.transform   = '';
    btn.style.boxShadow   = 'none';
    btn.textContent       = '⬆ 起竿';
  }
}

// ═══════════════════════════════════════════════
// 14. 清理
// ═══════════════════════════════════════════════

function _fsClearAll(){
  if(!_fs) return;
  ['_t1','_t2','_t3','_t4','_t5'].forEach(k => {
    if(_fs[k]){ clearTimeout(_fs[k]); _fs[k]=null; }
  });
  if(_fs._raf){ cancelAnimationFrame(_fs._raf); _fs._raf=null; }
  if(_fs._bubbleTimer){ clearInterval(_fs._bubbleTimer); _fs._bubbleTimer=null; }
  _fsStopAmbient();
  _fs._reeling = false; // 解锁防抖
  
  // 清除鱼线SVG（避免idle鱼线与飞行鱼线重叠）
  const svg = document.getElementById('fs-line-svg');
  if(svg) svg.innerHTML = '';
}

function _fsClearTimers(){ _fsClearAll(); } // 向后兼容

function _fsAddToInventory(fishDef, qty){
  // 鱼获进入消耗品背包（元数据完整，可在背包里直接显示）
  try{
    const bag = JSON.parse(localStorage.getItem('wuxia_consumables')||'[]');
    // 根据稀有度和重量算效果
    const isJunk = fishDef.rarity === 'junk';
    let effect = {};
    if(!isJunk){
      const w = (fishDef.weight ? (fishDef.weight[0] + fishDef.weight[1]) / 2 : 1);
      const baseFood = Math.max(3, Math.round(w * 4));
      const rMult = { common:1, uncommon:1.5, rare:2.2, epic:3.2, legendary:4.5 };
      const m = rMult[fishDef.rarity] || 1;
      effect.food = Math.round(baseFood * m);          // 饱食度
      effect.hp   = Math.round(baseFood * m * 0.6);    // 气血
      if(fishDef.rarity === 'rare')     effect.mp = Math.round(m * 8);
      if(fishDef.rarity === 'epic')     effect.mp = Math.round(m * 15);
      if(fishDef.rarity === 'legendary')effect.mp = Math.round(m * 25) + Math.round(m * 10 * Math.random());
    }
    const idx = bag.findIndex(i=>i.id===fishDef.id);
    if(idx>=0){
      bag[idx].qty = (bag[idx].qty||1)+qty;
    } else {
      bag.push({
        id:    fishDef.id,
        name:  fishDef.name,
        icon:  fishDef.icon,
        desc:  `钓获 · ${isJunk ? '垃圾' : '可食用'} · ${fishDef.weight ? fishDef.weight[0]+'-'+fishDef.weight[1]+'斤' : ''}`,
        rarity: fishDef.rarity,
        effect: effect,
        qty
      });
    }
    localStorage.setItem('wuxia_consumables', JSON.stringify(bag));
    // 同步通知背包 UI 刷新
    if(typeof window.refreshTownBag === 'function') window.refreshTownBag();
  } catch(e){ console.error('[fishing] addToInventory error:', e); }
}

// ═══════════════════════════════════════════════
// 14.5 稀有鱼特效（屏幕震动、粒子、光环）
// ═══════════════════════════════════════════════

function _fsSpawnGoldParticles(stage){
  if(!stage) return;
  const colors = ['#ffdd00','#ffaa00','#ffffff','#ffee88','#ff8800'];
  for(let i=0;i<25;i++){
    const p = document.createElement('div');
    p.textContent = '✦';
    const angle = (i/25)*Math.PI*2;
    const dist = 60 + Math.random()*80;
    const px = Math.cos(angle)*dist;
    const py = Math.sin(angle)*dist - 30;
    p.style.cssText = `
      position:absolute;
      left:50%; top:50%;
      font-size:${12+Math.random()*8}px;
      color:${colors[i%colors.length]};
      pointer-events:none;
      z-index:50;
      --px:${px}px; --py:${py}px;
      animation:fs-particle-burst 1s ease-out forwards;`;
    stage.appendChild(p);
    setTimeout(()=>p.remove(), 1000);
  }
}

function _fsSpawnHalo(stage, rarity){
  if(!stage) return;
  const halo = document.createElement('div');
  const color = rarity==='legendary' ? '#ffdd00' : rarity==='epic' ? '#dd88ff' : '#88ddff';
  halo.style.cssText = `
    position:absolute;
    left:50%; top:50%;
    width:60px; height:60px;
    border:3px solid ${color};
    border-radius:50%;
    pointer-events:none;
    z-index:40;
    transform:translate(-50%,-50%);
    animation:fs-halo-expand 1.2s ease-out forwards;`;
  stage.appendChild(halo);
  setTimeout(()=>halo.remove(), 1200);
}

// ═══════════════════════════════════════════════
// 15. 结算浮层（原地显示，不离开钓鱼舞台）
// ═══════════════════════════════════════════════

function _fsShowResultOverlay(r){
  const stage = document.getElementById('fs-stage');
  if(!stage) return;
  _fs.result = r;

  // ── 成就系统触发 ──
  if(r.fish && typeof achOnFish === 'function'){
    achOnFish(r.fish.rarity || 'common');
  }

  // 移除旧浮层
  const old = document.getElementById('fs-result-overlay');
  if(old) old.remove();

  const el = document.createElement('div');
  el.id = 'fs-result-overlay';

  if(!r.fish){
    // 空竿
    el.style.cssText = `
      position:absolute; left:8px; right:8px; bottom:8px;
      border-radius:14px; padding:12px 14px 10px; z-index:30;
      pointer-events:auto;
      background:rgba(4,10,20,0.92);
      border:1.5px solid #1a3a5a;
      backdrop-filter:blur(4px);
      animation:fs-miss-overlay 0.5s ease-out, fs-overlay-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards;`;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:24px;">😔</span>
        <div>
          <div style="font-size:15px;font-weight:bold;color:#5a7a9a;letter-spacing:2px;">空竿了…</div>
          <div style="font-size:11px;color:#3a5a6a;margin-top:2px;">鱼儿溜走了，再试试吧</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="fs-btn" onclick="_fsRetry()"
          style="flex:1;background:#0a1e10;color:#4aba66;border:1.5px solid #1a4a28;padding:8px;">
          🎣 再钓一竿
        </button>
        <button class="fs-btn" onclick="_fsBackSelect()"
          style="flex:1;background:#0a1220;color:#4a90c0;border:1.5px solid #1a3050;padding:8px;">
          🗺️ 换场
        </button>
      </div>`;
  } else {
    // 钓到鱼
    const fish = r.fish;
    const rc   = RARITY_COLOR[fish.rarity];
    const isJunk = fish.rarity === 'junk';
    const isBig  = r.weight > (fish.weight[1] * 0.85);
    const isKing = r.specialEvent === 'fish_king';
    const isSchool = r.specialEvent === 'fish_school';
    
    let titleText = fish.rarity==='legendary' ? '🌟 绝世神鱼！'
                    : fish.rarity==='epic'       ? '💎 史诗之鱼！'
                    : fish.rarity==='rare'        ? '✨ 稀世珍鱼！'
                    : fish.rarity==='uncommon'    ? '💫 难得一见！'
                    : isJunk                      ? '😅 不是鱼…'
                    : '🎣 钓到了！';
    
    // 特殊事件标题覆盖
    if(isKing) titleText = '👑 鱼王降世！';
    if(isSchool) titleText = '🐟 鱼群爆发！';

    const titleSize = isKing ? 22
                    : fish.rarity==='legendary' ? 20
                    : fish.rarity==='rare'||fish.rarity==='epic' ? 17 : 15;

    // 稀有鱼的卡片添加旋转光效
    const isSpecial = ['rare','epic','legendary'].includes(fish.rarity);
    el.style.cssText = `
      position:absolute; left:8px; right:8px; bottom:8px;
      border-radius:14px; padding:12px 14px 10px; z-index:30;
      pointer-events:auto;
      background:${rc.bg};
      border:2px solid ${rc.color};
      box-shadow:0 0 24px ${rc.glow}, 0 4px 20px rgba(0,0,0,0.7);
      backdrop-filter:blur(4px);
      animation:fs-overlay-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
      ${isSpecial ? `position:relative; overflow:hidden;` : ''}`;

    // 稀有度越高，添加旋转光效边框
    if(isSpecial){
      const shimmer = document.createElement('div');
      shimmer.style.cssText = `
        position:absolute; top:-2px; left:-2px; right:-2px; bottom:-2px;
        background:linear-gradient(45deg, transparent, ${rc.glow}, transparent, ${rc.glow}, transparent);
        background-size:200% 200%;
        border-radius:16px;
        z-index:-1;
        animation:fs-card-shimmer 3s linear infinite;`;
      el.appendChild(shimmer);
    }

    el.innerHTML = `
      <div style="text-align:center;margin-bottom:8px;">
        <div style="
          font-size:${titleSize}px;font-weight:bold;color:${rc.color};letter-spacing:3px;
          animation:fs-catch-pop 0.5s ease-out, fs-catch-pulse 1.5s 0.5s ease-in-out infinite;
          text-shadow:0 0 12px ${rc.color}, 0 0 24px ${rc.glow};">
          ${titleText}
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        <div style="
          font-family:'Courier New',monospace;font-size:13px;
          color:${rc.color};line-height:1.5;white-space:pre;
          filter:drop-shadow(0 0 8px ${rc.glow});
          flex-shrink:0;">
${_fsEscHtml(FISH_ART[fish.id]?.bite || FISH_ART[fish.id]?.approach || fish.icon+' '+fish.name)}</div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span style="font-size:22px;">${fish.icon}</span>
            <span style="font-size:16px;font-weight:bold;color:${rc.color};">${fish.name}</span>
            <span style="font-size:10px;color:${rc.color};border:1px solid ${rc.color};
              padding:1px 5px;border-radius:3px;">${rc.label}</span>
          </div>
          <div style="font-size:12px;color:#8aacb8;margin-top:5px;line-height:1.6;">
            ⚖️ <b style="color:#cde;">${r.weight}</b> 斤
            ${isBig ? '<span style="color:#fa0;margin-left:5px;">★ 大鱼！</span>' : ''}
            ${isKing ? '<span style="color:#ff6;margin-left:5px;">👑 鱼王！</span>' : ''}
            ${isSchool ? '<span style="color:#6f6;margin-left:5px;">×3 鱼群！</span>' : ''}
            ${!isJunk ? `<span style="color:#fa0;margin-left:8px;">💰 +${r.coins} 两</span>` : ''}
          </div>
          ${!isJunk ? `<div style="font-size:10px;color:#5a8a6a;margin-top:2px;">已入背包</div>` : ''}
        </div>
      </div>

      <div style="display:flex;gap:8px;">
        <button class="fs-btn" onclick="_fsRetry()"
          style="flex:1;background:#0a1e10;color:#4aba66;border:1.5px solid #1a4a28;padding:8px;">
          🎣 继续垂钓
        </button>
        <button class="fs-btn" onclick="_fsBackSelect()"
          style="flex:1;background:#0a1220;color:#4a90c0;border:1.5px solid #1a3050;padding:8px;">
          🗺️ 换场
        </button>
      </div>`;
  }

  stage.appendChild(el);
}

function _fsHtmlResult(){
  const r  = _fs.result;
  const sp = _fs.spot;

  if(!r.fish){
    return `
      <div style="
        border:2px solid #2a3a4a;border-radius:12px;
        background:#060e18;padding:14px;
        font-family:'Courier New',monospace;white-space:pre;
        font-size:12px;line-height:1.7;color:#445566;
        text-align:left;margin-bottom:12px;
        animation:fs-miss 0.6s ease-out;
      ">${_fsEmptyArt(sp)}</div>
      <div style="display:flex;gap:10px;">
        <button class="fs-btn" onclick="_fsRetry()"
          style="flex:1;background:#0a1e10;color:#4aba66;border:1.5px solid #1a4a28;">
          🎣 再钓
        </button>
        <button class="fs-btn" onclick="_fsBackSelect()"
          style="flex:1;background:#0a1220;color:#4a90c0;border:1.5px solid #1a3050;">
          🗺️ 换场
        </button>
      </div>`;
  }

  const fish  = r.fish;
  const rc    = RARITY_COLOR[fish.rarity];
  const fishArt = _fsBuildFishArt(fish, r.weight);
  const isJunk  = fish.rarity === 'junk';

  return `
    <div style="
      background:${rc.bg};border:2px solid ${rc.color};border-radius:12px;
      padding:14px;margin-bottom:12px;
      font-family:'Courier New',monospace;white-space:pre;font-size:12px;
      line-height:1.7;color:${rc.color};
      animation:fs-success 0.45s ease-out;
      box-shadow:0 0 28px ${rc.glow};
    ">${fishArt}</div>

    <div style="text-align:center;margin-bottom:6px;
      animation:fs-catch-pop 0.5s ease-out;font-size:${fish.rarity==='legendary'?22:fish.rarity==='rare'?19:16}px;
      font-weight:bold;color:${rc.color};letter-spacing:3px;
      animation:fs-catch-pop 0.5s ease-out, fs-catch-pulse 1.5s 0.5s ease-in-out infinite;
      text-shadow:0 0 16px ${rc.color}, 0 0 32px ${rc.glow};">
      ${fish.rarity==='legendary'?'🌟 绝世神鱼！':fish.rarity==='rare'?'✨ 稀世珍鱼！':fish.rarity==='uncommon'?'💫 难得一见！':'🎣 钓到了！'}
    </div>

    <div style="text-align:center;margin-bottom:10px;">
      <span style="font-size:20px;">${fish.icon}</span>
      <span style="font-size:16px;font-weight:bold;color:${rc.color};margin:0 7px;">${fish.name}</span>
      <span style="font-size:10px;color:${rc.color};border:1px solid ${rc.color};
        padding:1px 5px;border-radius:3px;">${rc.label}</span>
      <div style="font-size:12px;color:#8aacb8;margin-top:4px;">
        ⚖️ ${r.weight} 斤
        ${r.weight > (fish.weight[1]*0.85) ? '<span style="color:#fa0;margin-left:6px;">★ 大鱼！</span>' : ''}
        ${isJunk ? '' : `<span style="color:#fa0;margin-left:8px;">+${r.coins} 两</span>`}
      </div>
    </div>

    <div style="display:flex;gap:10px;">
      <button class="fs-btn" onclick="_fsRetry()"
        style="flex:1;background:#0a1e10;color:#4aba66;border:1.5px solid #1a4a28;">
        🎣 继续
      </button>
      <button class="fs-btn" onclick="_fsBackSelect()"
        style="flex:1;background:#0a1220;color:#4a90c0;border:1.5px solid #1a3050;">
        🗺️ 换场
      </button>
    </div>`;
}

function _fsEmptyArt(sp){
  const shore = sp ? sp.shoreLine : '▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔';
  return `               🧑‍🦱
                ║🎋\\
                ║   \\ ~~~~/
${shore}
≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░`;
}

function _fsBuildFishArt(fish, weight){
  const isLarge = weight > (fish.weight[1] * 0.8);
  const n = fish.name;
  const w = weight;

  switch(fish.rarity){
    case 'legendary':
      return `
 ╔═══════════════════════╗
 ║  ★ ★ ★ ★ ★ ★ ★ ★   ║
 ║                       ║
 ║  ✨ ${n} ✨       ║
 ║   传  说  之  鱼  现  世 ║
 ║      ⚖️ ${w} 斤     ║
 ║                       ║
 ║  ★ ★ ★ ★ ★ ★ ★ ★   ║
 ╚═══════════════════════╝`;

    case 'epic':
      return `
 ╔═══════════════════════╗
 ║  ${fish.icon}  ${fish.icon}  ${fish.icon}              ║
 ║   ── 史诗之鱼 ──       ║
 ║   ${n}              ║
 ║   ⚖️ ${w} 斤         ║
 ╚═══════════════════════╝`;

    case 'rare':
      return isLarge
        ? `
 ┌───────────────────────┐
 │  ${fish.icon}  ${fish.icon}                │
 │   ★ 大鱼！            │
 │   ${n}            │
 │   ⚖️ ${w} 斤          │
 └───────────────────────┘`
        : `
 ┌───────────────────────┐
 │  ${fish.icon}   ${n}         │
 │   ⚖️ ${w} 斤          │
 └───────────────────────┘`;

    case 'uncommon':
      return `
 ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 ╌  ${fish.icon}   ${n}         ╌
 ╌   ⚖️ ${w} 斤         ╌
 ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌`;

    case 'junk':
      return `
 ～～～～～～～～～～～～
 ～  ${fish.icon}  ${n}        ～
 ～   这是垃圾……      ～
 ～～～～～～～～～～～～`;

    default:
      return isLarge
        ? `
 ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
 ≋  ${fish.icon}  大鱼！       ≋
 ≋   ${n}          ≋
 ≋   ⚖️ ${w} 斤    ≋
 ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋`
        : `
 ≈≈≈≈≈≈≈≈≈≈≈≈≈≈
 ≈  ${fish.icon}  ${n}   ≈
 ≈  ⚖️ ${w} 斤  ≈
 ≈≈≈≈≈≈≈≈≈≈≈≈≈≈`;
  }
}

function _fsRetry(){
  if(!_fs) return;
  // 浮层滑出动画后移除，然后重新开始钓鱼
  const overlay = document.getElementById('fs-result-overlay');
  if(overlay){
    overlay.style.animation = 'fs-overlay-out 0.25s ease-in forwards';
    setTimeout(()=>{
      overlay.remove();
      _fsClearAll();
      _fsInitStage();
      // 确保浮漂可见
      const floatEl = document.getElementById('fs-float');
      if(floatEl) floatEl.style.opacity = '1';
      _fsStartCasting();
    }, 240);
  } else {
    _fsClearAll();
    _fsInitStage();
    // 确保浮漂可见
    const floatEl = document.getElementById('fs-float');
    if(floatEl) floatEl.style.opacity = '1';
    _fsStartCasting();
  }
}

function _fsBackSelect(){
  if(!_fs) return;
  _fsClearAll();
  _fs.phase = 'select';
  _fs.spot  = null;
  _fsRender();
}
