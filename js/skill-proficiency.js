// skill-proficiency.js — 技能熟练度系统
// 每个学派独立熟练度值，影响该系技能的伤害倍率、CD缩减、特殊顿悟效果

// ══════════════════════════════════════════════
//  1. 熟练度档位定义
// ══════════════════════════════════════════════
const PROF_TIERS = [
  { min:0,     name:'入门',     mult:1.00, cdReduce:0,    enlightenChance:0    },
  { min:100,   name:'小成',     mult:1.10, cdReduce:0,    enlightenChance:0    },
  { min:500,   name:'大成',     mult:1.20, cdReduce:0.10, enlightenChance:0    },
  { min:1500,  name:'炉火纯青', mult:1.35, cdReduce:0.15, enlightenChance:0    },
  { min:4000,  name:'登峰造极', mult:1.50, cdReduce:0.20, enlightenChance:0.06 },
  { min:10000, name:'化境',     mult:1.70, cdReduce:0.25, enlightenChance:0.12 },
];

// 下一档所需熟练度（用于进度条）
const PROF_TIER_MAXES = PROF_TIERS.map((t, i) =>
  i + 1 < PROF_TIERS.length ? PROF_TIERS[i + 1].min : null
);

// 全部16个学派
const ALL_SCHOOLS = [
  '剑系','佛系','道系','力系','暗系','毒系',
  '冰系','火系','雷系','风系','圣系','通用',
  '拳系','奇门','琴系','命理',
];

// ══════════════════════════════════════════════
//  2. 数据读写（基于 edS，存入 localStorage）
// ══════════════════════════════════════════════
// edS.proficiency = { '剑系': 230, '佛系': 80, ... }
function _getProfData(){
  if(typeof edS === 'undefined') return {};
  if(!edS.proficiency) edS.proficiency = {};
  return edS.proficiency;
}

function getProfValue(school){
  return _getProfData()[school] || 0;
}

function setProfValue(school, val){
  if(typeof edS === 'undefined') return;
  if(!edS.proficiency) edS.proficiency = {};
  edS.proficiency[school] = Math.max(0, val);
  saveProficiency();
}

function saveProficiency(){
  try{
    const saved = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    saved.proficiency = _getProfData();
    localStorage.setItem('wuxia_player_progress', JSON.stringify(saved));
  }catch(e){}
}

function loadProficiency(){
  if(typeof edS === 'undefined') return;
  try{
    const saved = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
    if(saved.proficiency){
      edS.proficiency = saved.proficiency;
    } else {
      edS.proficiency = {};
    }
  }catch(e){
    edS.proficiency = {};
  }
}

// ══════════════════════════════════════════════
//  3. 档位查询
// ══════════════════════════════════════════════
function getProfTier(school){
  const val = getProfValue(school);
  let tier = PROF_TIERS[0];
  for(const t of PROF_TIERS){
    if(val >= t.min) tier = t;
  }
  return tier;
}

function getProfTierIndex(school){
  const val = getProfValue(school);
  let idx = 0;
  for(let i = 0; i < PROF_TIERS.length; i++){
    if(val >= PROF_TIERS[i].min) idx = i;
  }
  return idx;
}

// 获取熟练度伤害倍率（供 execSkill 调用）
function getProfMult(school){
  return getProfTier(school).mult;
}

// 获取熟练度CD缩减比（0~0.25）
function getProfCdReduce(school){
  return getProfTier(school).cdReduce;
}

// ══════════════════════════════════════════════
//  4. 技能使用时积累熟练度
// ══════════════════════════════════════════════
// cd越大、multiplier越高的技能给更多熟练度
function calcProfGain(sk, targetLevel){
  if(!sk || !sk.school) return 0;
  // 基础: 10点
  let base = 10;
  // 高CD技能额外加成
  const cd = sk.cd || 1;
  if(cd >= 12) base += 15;
  else if(cd >= 8) base += 10;
  else if(cd >= 4) base += 5;
  // 高倍率技能
  const mult = sk.multiplier || 0.7;
  if(mult >= 2.5) base += 10;
  else if(mult >= 1.5) base += 5;
  // 对强敌（目标等级>玩家+10）额外20%
  const playerLv = (typeof edS !== 'undefined' ? edS.level : null) || 1;
  const tLv = targetLevel || playerLv;
  if(tLv - playerLv >= 10) base = Math.round(base * 1.2);
  return base;
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"技能领悟系统：顿悟与走火入魔
// ═══════════════════════════════════════════════════════════════
const ENLIGHTEN_CHANCE = 0.05;   // 5%顿悟概率
const DEVIATE_CHANCE = 0.03;     // 3%走火入魔概率

// 给指定学派加熟练度，并检查是否升档
function addProficiency(school, amount, silent){
  if(!school || !amount) return { leveled: false };
  const oldVal  = getProfValue(school);
  const oldTier = getProfTierIndex(school);
  
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"随机事件检查
  // ═══════════════════════════════════════════════════════════════
  const roll = Math.random();
  let actualAmount = amount;
  let eventMsg = null;
  
  // 顿悟：熟练度暴涨（2-4倍）
  if(roll < ENLIGHTEN_CHANCE){
    const mult = 2 + Math.random() * 2; // 2-4倍
    actualAmount = Math.round(amount * mult);
    eventMsg = `⚡ 顿悟！${school}熟练度+${actualAmount}（×${mult.toFixed(1)}）！`;
    if(typeof showToast === 'function') showToast(eventMsg, 'exp');
  }
  // 走火入魔：熟练度下降
  else if(roll < ENLIGHTEN_CHANCE + DEVIATE_CHANCE){
    const loss = Math.round(amount * 0.5);
    actualAmount = -loss;
    eventMsg = `💀 走火入魔！${school}熟练度-${loss}…`;
    if(typeof showToast === 'function') showToast(eventMsg, 'warning');
  }
  
  setProfValue(school, oldVal + actualAmount);
  const newVal  = getProfValue(school);
  const newTier = getProfTierIndex(school);
  const leveled = newTier > oldTier;
  if(leveled && !silent){
    _onProfLevelUp(school, oldTier, newTier);
  }
  return { leveled, oldTier, newTier, eventMsg };
}

// ══════════════════════════════════════════════
//  5. 顿悟判断（登峰造极/化境时有概率免CD）
// ══════════════════════════════════════════════
function tryEnlighten(school){
  const chance = getProfTier(school).enlightenChance;
  if(chance <= 0) return false;
  return Math.random() < chance;
}

// ══════════════════════════════════════════════
//  6. 升档事件（通知+特效）
// ══════════════════════════════════════════════
function _onProfLevelUp(school, oldTierIdx, newTierIdx){
  const tier = PROF_TIERS[newTierIdx];
  // Toast通知
  if(typeof showToast === 'function'){
    showToast(`✨ ${school} 熟练度提升至【${tier.name}】！伤害 ×${tier.mult.toFixed(2)}`, 'exp');
  }
  // 小弹窗特效（仅炉火纯青以上）
  if(newTierIdx >= 3){
    _showProfUpEffect(school, tier.name);
  }
}

function _showProfUpEffect(school, tierName){
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);
    color:#ffd060;font-size:16px;font-weight:bold;letter-spacing:3px;
    text-shadow:0 0 16px #ffa030, 0 0 32px #ff6000;
    pointer-events:none;z-index:99999;
    animation:lvupMsg 1.8s ease-out forwards;
    white-space:nowrap;
  `;
  el.textContent = `✦ ${school} · ${tierName} ✦`;
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 1900);
}

// ══════════════════════════════════════════════
//  7. 顿悟特效（免CD触发时）
// ══════════════════════════════════════════════
function showEnlightenEffect(skillName, school){
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:35%;left:50%;transform:translate(-50%,-50%);
    color:#a0f8ff;font-size:14px;font-weight:bold;letter-spacing:2px;
    text-shadow:0 0 12px #40d0ff, 0 0 24px #0090ff;
    pointer-events:none;z-index:99999;
    animation:lvupMsg 1.4s ease-out forwards;
    white-space:nowrap;
  `;
  el.textContent = `⚡ 招式顿悟！【${skillName}】免CD释放！`;
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 1500);
  if(typeof showToast === 'function'){
    showToast(`⚡ 顿悟！【${skillName}】免CD！`, 'exp');
  }
}

// ══════════════════════════════════════════════
//  8. 熟练度进度条 UI 数据（供渲染用）
// ══════════════════════════════════════════════
// 返回供UI展示的熟练度信息
function getProfDisplay(school){
  const val      = getProfValue(school);
  const tierIdx  = getProfTierIndex(school);
  const tier     = PROF_TIERS[tierIdx];
  const nextTier = PROF_TIERS[tierIdx + 1];
  const pct      = nextTier
    ? Math.min(100, ((val - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;
  const stars    = '★'.repeat(tierIdx) + '☆'.repeat(Math.max(0, PROF_TIERS.length - 1 - tierIdx));
  return {
    val, tierIdx, tierName: tier.name,
    mult: tier.mult, cdReduce: tier.cdReduce,
    pct: pct.toFixed(1),
    nextMin: nextTier ? nextTier.min : null,
    stars,
    isMax: !nextTier,
    enlightenChance: tier.enlightenChance,
  };
}

// ══════════════════════════════════════════════
//  9. 熟练度总览弹窗
// ══════════════════════════════════════════════
function showProficiencyPanel(){
  const existing = document.getElementById('proficiencyPanel');
  if(existing){ existing.remove(); return; }

  let rows = '';
  for(const school of ALL_SCHOOLS){
    const d = getProfDisplay(school);
    if(d.val === 0 && d.tierIdx === 0) continue; // 未使用的学派不显示
    const multColor = d.mult >= 1.5 ? '#ffd060' : d.mult >= 1.3 ? '#c8a840' : d.mult >= 1.1 ? '#a0c880' : '#808080';
    rows += `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:11px">
        <div style="width:42px;text-align:right;color:rgba(200,180,100,.7)">${school}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;margin-bottom:2px">
            <span style="color:${multColor}">${d.tierName}</span>
            <span style="color:rgba(160,140,80,.5)">${d.val.toLocaleString()}${d.nextMin ? ' / '+d.nextMin.toLocaleString() : ' · 化境'}</span>
          </div>
          <div style="height:4px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden">
            <div style="width:${d.pct}%;height:100%;background:linear-gradient(90deg,#8060c0,#c080ff);border-radius:2px;transition:width .4s"></div>
          </div>
        </div>
        <div style="width:36px;text-align:center;color:${multColor};font-size:10px">×${d.mult.toFixed(2)}</div>
        ${d.cdReduce > 0 ? `<div style="width:32px;text-align:center;color:#80d0ff;font-size:9px">CD-${Math.round(d.cdReduce*100)}%</div>` : '<div style="width:32px"></div>'}
      </div>`;
  }
  if(!rows) rows = `<div style="color:rgba(180,160,80,.4);font-size:11px;text-align:center;padding:16px 0">尚未使用任何技能</div>`;

  const overlay = document.createElement('div');
  overlay.id = 'proficiencyPanel';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  overlay.onclick = e => { if(e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div style="background:linear-gradient(160deg,#0d0818,#080510);border:1px solid rgba(160,100,255,.25);border-radius:12px;padding:20px 24px;min-width:300px;max-width:400px;max-height:80vh;overflow-y:auto">
      <div style="font-size:15px;color:#c080ff;margin-bottom:4px">📖 武学熟练度</div>
      <div style="font-size:10px;color:rgba(160,130,200,.4);margin-bottom:16px">使用技能积累熟练，提升伤害与特效</div>
      ${rows}
      <div style="font-size:9px;color:rgba(140,100,200,.3);margin-top:12px;line-height:1.6">
        入门×1.00 → 小成×1.10 → 大成×1.20(CD-10%) → 炉火纯青×1.35(CD-15%)<br>
        → 登峰造极×1.50(CD-20%, 顿悟6%) → 化境×1.70(CD-25%, 顿悟12%)
      </div>
      <div style="text-align:right;margin-top:14px">
        <button onclick="this.closest('#proficiencyPanel').remove()" style="background:rgba(80,40,120,.6);border:1px solid rgba(160,100,255,.3);color:#c080ff;padding:5px 16px;border-radius:5px;cursor:pointer;font-size:11px">关闭</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}
