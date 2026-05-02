function showPage(p,btn){
  document.getElementById('pageGallery').style.display  = p==='gallery'?'block':'none';
  document.getElementById('pageFight').style.display    = p==='fight'?'block':'none';
  document.getElementById('pageEditor').style.display   = p==='editor'?'block':'none';
  document.getElementById('pageSkills').style.display   = p==='skills'?'block':'none';
  document.getElementById('pageSects').style.display    = p==='sects'?'block':'none';
  document.getElementById('pageWeapons').style.display  = p==='weapons'?'block':'none';
  document.getElementById('pageMap').style.display      = p==='map'?'block':'none';
  const dgPage = document.getElementById('pageDungeon');
  if(dgPage) dgPage.style.display = p==='dungeon'?'block':'none';
  const craftPage = document.getElementById('pageCraft');
  if(craftPage) craftPage.style.display = p==='craft'?'block':'none';
  // 旅行专属粒子背景：仅map页面显示
  const mbc=document.getElementById('mapBgCanvas');
  if(mbc) mbc.style.display = p==='map'?'block':'none';
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  if(p==='editor')  edInit();
  if(p==='skills')  renderSkillsPage();
  if(p==='sects')   renderSectsPage();
  if(p==='weapons') renderWeaponsPage();
  if(p==='map')     { renderMapPage(); }
  if(p==='craft')   { renderCraftPage(); if(typeof craftBgmStart==='function') craftBgmStart(); }
  // 离开炼物阁时停止炼物阁背景乐
  if(p!=='craft' && typeof craftBgmIsPlaying==='function' && craftBgmIsPlaying()) craftBgmStop();
  // 地下城页：若没有进行中的地下城，显示欢迎界面；若有则恢复
  if(p==='dungeon'){
    if(_dungeonState){ _renderDungeonUI(); }
    // 没有进行中的地下城时显示静态欢迎HTML（已在HTML中写好）
  }
}

// ════════════════════════════════════════════════
//  技能志渲染 · 豪华版
// ════════════════════════════════════════════════
const SK_SCHOOL_INFO = {
  sword: {label:'⚔ 剑系',  color:'#40b0ff', glow:'rgba(64,176,255,.3)'},
  buddha:{label:'☸ 佛系',  color:'#f0c040', glow:'rgba(240,192,64,.3)'},
  tao:   {label:'☯ 道系',  color:'#60e8e8', glow:'rgba(96,232,232,.25)'},
  force: {label:'⛰ 力系',  color:'#e09050', glow:'rgba(224,144,80,.3)'},
  shadow:{label:'🌑 暗系',  color:'#a080e0', glow:'rgba(160,128,224,.25)'},
  poison:{label:'🐍 毒系',  color:'#60ee30', glow:'rgba(96,238,48,.25)'},
  ice:   {label:'❄ 冰系',  color:'#80d8ff', glow:'rgba(128,216,255,.25)'},
  fire:  {label:'🔥 火系',  color:'#ff6020', glow:'rgba(255,96,32,.3)'},
  thunder:{label:'⚡ 雷系', color:'#ffe040', glow:'rgba(255,224,64,.3)'},
  wind:  {label:'🌪 风系',  color:'#80ee80', glow:'rgba(128,238,128,.25)'},
  holy:  {label:'✦ 圣系',  color:'#fff880', glow:'rgba(255,248,128,.3)'},
  common:{label:'🗡 通用',  color:'#e8d5a3', glow:'rgba(232,213,163,.2)'},
  fist:  {label:'👊 拳系',  color:'#ff7830', glow:'rgba(255,120,48,.3)'},
  qimen: {label:'🔯 奇门',  color:'#90c860', glow:'rgba(144,200,96,.28)'},
  music: {label:'🎵 琴系',  color:'#d060d0', glow:'rgba(208,96,208,.28)'},
  fate:  {label:'⚖ 命系',  color:'#d4b050', glow:'rgba(212,176,80,.3)'},
};

// 稀有度判定
function getSkillRarity(sk){
  const mul=sk.multiplier||0, cd=sk.cd||4, hits=sk.hits||1;
  const isExec=sk.type==='execute';
  const power=mul*hits+(isExec?2:0)+cd*.05;
  if(power>=5||cd>=17) return 'legendary';
  if(power>=3||cd>=13) return 'epic';
  if(power>=1.8||cd>=9) return 'rare';
  return 'common';
}
const RARITY_STARS={
  legendary:{stars:'★★★★★',label:'传 说',color:'#ffe040',icon:'👑'},
  epic:     {stars:'★★★★', label:'史 诗',color:'#c060ff',icon:'💎'},
  rare:     {stars:'★★★',  label:'精 良',color:'#40b0ff',icon:'✦'},
  common:   {stars:'★★',   label:'普 通',color:'#e8d5a3',icon:'·'},
};

const SKT_PLUS={
  damage: {label:'⚔ 伤害',color:'#ff6040',bg:'rgba(255,96,64,.1)', bd:'rgba(255,96,64,.3)'},
  heal:   {label:'💚 治疗',color:'#44ff88',bg:'rgba(68,255,136,.08)',bd:'rgba(68,255,136,.25)'},
  shield: {label:'🛡 护盾',color:'#44aaff',bg:'rgba(68,170,255,.08)',bd:'rgba(68,170,255,.25)'},
  dot:    {label:'☠ 持续',color:'#88ff44',bg:'rgba(136,255,68,.08)',bd:'rgba(136,255,68,.25)'},
  stun:   {label:'💫 眩晕',color:'#ffee44',bg:'rgba(255,238,68,.08)',bd:'rgba(255,238,68,.25)'},
  buff:   {label:'⬆ 强化',color:'#ff88ff',bg:'rgba(255,136,255,.08)',bd:'rgba(255,136,255,.25)'},
  debuff: {label:'⬇ 削弱',color:'#ff8844',bg:'rgba(255,136,68,.08)',bd:'rgba(255,136,68,.25)'},
  execute:{label:'💀 处决',color:'#ff2244',bg:'rgba(255,34,68,.12)', bd:'rgba(255,34,68,.4)'},
};

function buildSkillStats(sk){
  const s=[];
  if(sk.multiplier)  s.push({i:'⚔',l:'伤害',v:Math.round(sk.multiplier*100)+'%'});
  if(sk.hits>1)      s.push({i:'🔀',l:'连击',v:'×'+sk.hits});
  if(sk.stunDur)     s.push({i:'💫',l:'眩晕',v:sk.stunDur+'s'});
  if(sk.dotDmg)      s.push({i:'☠',l:'持续',v:Math.round(sk.dotDmg*100)+'%/s'});
  if(sk.healPct)     s.push({i:'💚',l:'治疗',v:'+'+Math.round(sk.healPct*100)+'%'});
  if(sk.healPctAbs)  s.push({i:'💚',l:'满血',v:Math.round(sk.healPctAbs*100)+'%'});
  if(sk.shieldAbs)   s.push({i:'🛡',l:'护盾',v:sk.shieldAbs});
  if(sk.atkBuff)     s.push({i:'📈',l:'攻↑',v:'+'+Math.round(sk.atkBuff*100)+'%'});
  if(sk.defBuff)     s.push({i:'🏰',l:'防↑',v:'+'+Math.round(sk.defBuff*100)+'%'});
  if(sk.atkDebuff)   s.push({i:'📉',l:'攻↓',v:'-'+Math.round(sk.atkDebuff*100)+'%'});
  if(sk.defDebuff)   s.push({i:'💔',l:'防↓',v:'-'+Math.round(sk.defDebuff*100)+'%'});
  if(sk.forceCrit)   s.push({i:'🎯',l:'必暴击',v:'100%'});
  if(sk.ignoreDefense||sk.ignoreAll) s.push({i:'🔓',l:'破防',v:'无视'});
  if(sk.selfDmgPct)  s.push({i:'🩸',l:'自损',v:Math.round(sk.selfDmgPct*100)+'%'});
  return s.slice(0,5);
}

let _skFilter = 'all';
function renderSkillsPage(){
  const allSkills = SKILL_FLAT;
  document.getElementById('skillsTotal').textContent = allSkills.length;

  // 过滤按钮
  const filterEl = document.getElementById('skillsFilter');
  filterEl.innerHTML = `<button class="sk-filter-btn ${_skFilter==='all'?'active':''}" onclick="filterSkills('all')">✦ 全部 (${allSkills.length})</button>`
    + Object.entries(SK_SCHOOL_INFO).map(([k,v])=>{
      const cnt=SKILL_LIB[k]?.length||0;
      const isAct=_skFilter===k;
      return `<button class="sk-filter-btn ${isAct?'active':''}"
        style="${isAct?`border-color:${v.color};color:${v.color};box-shadow:0 0 14px ${v.glow}`:''}"
        onclick="filterSkills('${k}')">${v.label} (${cnt})</button>`;
    }).join('');

  // 渲染技能卡片
  const grid = document.getElementById('skillsGrid');
  const list = _skFilter==='all' ? allSkills : (SKILL_LIB[_skFilter]||[]);
  grid.innerHTML = list.map(sk=>{
    const schoolKey=Object.keys(SKILL_LIB).find(k=>SKILL_LIB[k].includes(sk))||'common';
    const sc=SK_SCHOOL_INFO[schoolKey];
    const tc=SKT_PLUS[sk.type]||{label:'? 未知',color:'#888',bg:'rgba(136,136,136,.08)',bd:'rgba(136,136,136,.2)'};
    const rar=getSkillRarity(sk);
    const rs=RARITY_STARS[rar];
    const stats=buildSkillStats(sk);
    const isLeg=rar==='legendary', isEpic=rar==='epic';
    return `<div class="sk-card" data-rarity="${rar}">
      ${isLeg||isEpic?`<div class="sk-shimmer"></div>`:''}
      ${isLeg?`<div class="sk-corner tl">✦</div><div class="sk-corner br">✦</div>`:''}
      <div class="sk-card-rarity" style="color:${rs.color}" title="${rs.label}">${rs.icon}</div>
      <div class="sk-card-banner">
        <div class="sk-card-icon-wrap" style="background:radial-gradient(circle,${sc.glow} 0%,rgba(5,3,14,.85) 70%);border-color:${sc.color}55;box-shadow:0 0 16px ${sc.glow},inset 0 1px 0 rgba(255,255,255,.08)">${sk.icon}</div>
        <div class="sk-card-header">
          <div class="sk-card-name" style="color:${sc.color};text-shadow:0 0 16px ${sc.glow},0 0 4px ${sc.color}40">${sk.name}</div>
          <div class="sk-card-school-row">
            <div class="sk-card-school" style="color:${sc.color}aa">${sc.label}</div>
            <div class="sk-card-id">${sk.id}</div>
          </div>
          <div class="sk-card-type" style="color:${tc.color};background:${tc.bg};border-color:${tc.bd}">${tc.label}</div>
        </div>
      </div>
      <div class="sk-card-body">
        <div class="sk-card-desc" style="border-color:${sc.color}25">${sk.desc}</div>
        ${stats.length?`<div class="sk-card-stats">${stats.map(s=>`<span class="sk-stat"><span>${s.i}</span><span>${s.l}</span><span class="sk-stat-val" style="color:${sc.color}">${s.v}</span></span>`).join('')}</div>`:''}
      </div>
      <div class="sk-card-footer">
        <div class="sk-card-cd"><span class="sk-card-cd-icon">⏱</span>冷却 <strong style="color:${sc.color}">${sk.cd}</strong> 秒</div>
        <span class="sk-card-sfx">♪ ${sk.sfx}</span>
      </div>
    </div>`;
  }).join('');
}

function filterSkills(cat){
  _skFilter = cat;
  renderSkillsPage();
}


// ════════════════════════════════════════════════
//  图鉴渲染
// ════════════════════════════════════════════════
function renderGallery(){
  const grid=document.getElementById('galleryGrid');
  if(!grid) return;
  grid.innerHTML='';
  CHARS.forEach(c=>{
    const wrap=document.createElement('div');
    wrap.className='char-card-wrap';
    const skBack=c.skills.map(s=>`
      <div class="bsk">
        <div class="bsk-icon">${s.icon}</div>
        <div class="bsk-info">
          <div class="bsk-name">${s.name}</div>
          <div class="bsk-desc">${s.desc.length>40?s.desc.slice(0,40)+'…':s.desc}</div>
        </div>
      </div>`).join('');
    const spTags=c.skills.map(s=>`<span class="sp-tag" style="color:${SKT[s.type].color};border-color:${SKT[s.type].color}44">${s.icon}${s.name}</span>`).join('');
    wrap.innerHTML=`
      <div class="char-card">
        <div class="card-front" style="--stage-glow:${c.color}18;--stage-beam:${c.color}20;--stage-line:${c.color}55;--ring-color:${c.color}66">
          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
          <div class="card-hero-header">
            <div class="card-name" style="color:${c.color}">${c.name}</div>
            <div class="card-level-badge" style="color:${c.color};border-color:${c.color}55">Lv.99</div>
          </div>
          <div class="card-title">${c.title}</div>
          <div class="card-tag" style="color:${c.tagColor};border-color:${c.tagColor}55">${c.tag}</div>
          <div class="card-divider" style="color:${c.color}"></div>
          <div class="card-ascii-stage">
            ${c.parts
              ? `<div class="card-ascii ft-animated" style="color:${c.color}">${buildPartsHtml(c.parts,c.color)}</div>`
              : `<div class="card-ascii" style="color:${c.color}">${c.stand}</div>`
            }
            <div class="char-aura-ring" style="--ring-color:${c.color}66"></div>
            ${(()=>{
              const w=getCharWeapon(c.id);
              if(!w) return '';
              const ri=WEP_RARITY[w.rarity]||WEP_RARITY.common;
              return `<div class="wep-float ${w.rarity}" style="position:absolute;bottom:8px;right:4px;--wf-color:${w.color};--wf-glow:${w.glow};--wf-border:${w.border}">
                <div class="wep-float-icon">${getWepAsciiHtml(w.cat, w.color)}</div>
                <div class="wep-float-name">${w.name}</div>
                <div class="wep-float-rarity">${ri.label}</div>
              </div>`;
            })()}
          </div>
          <div class="card-stats">
            <span><b>${c.maxHp+(getCharWeapon(c.id)?.hpBonus||0)+(getCharCostume(c.id)?.hpBonus||0)}</b>气血</span>
            <span><b>${c.atk+(getCharWeapon(c.id)?.atkBonus||0)+(getCharCostume(c.id)?.atkBonus||0)}</b>攻击</span>
            <span><b>${c.def+(getCharWeapon(c.id)?.defBonus||0)+(getCharCostume(c.id)?.defBonus||0)}</b>防御</span>
            <span><b>${c.crit||10}%</b>暴击</span>
            <span><b>${c.dodge||8}%</b>闪避</span>
            <span style="color:#80d8ff"><b>${c.speed}</b>速度</span>
          </div>
          <div class="skill-preview">${spTags}</div>
        </div>
        <div class="card-back" style="border-color:${c.color}44">
          <div class="card-corner tl" style="border-color:${c.color}"></div>
          <div class="card-corner tr" style="border-color:${c.color}"></div>
          <div class="card-corner bl" style="border-color:${c.color}"></div>
          <div class="card-corner br" style="border-color:${c.color}"></div>
          <div class="back-title" style="color:${c.color}">${c.name} · ${c.title}</div>
          <div class="back-desc">${c.desc}</div>
          <div class="back-skills">${skBack}</div>
          <button class="back-fight-btn" style="border-color:${c.color}44;color:${c.color}" onclick="window.location.href='battle.html?hero=${c.id}'">⚔ 出战！</button>
        </div>
      </div>`;
    grid.appendChild(wrap);
  });
}

// ════════════════════════════════════════════════
//  音效（Web Audio API）— 复用 battle.js 的 _actx
// ════════════════════════════════════════════════

