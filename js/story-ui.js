// ════════════════════════════════════════════════════════════════
//  story-ui.js  主线剧情《血骨门之乱》UI 系统
//  ① 城市抵达触发叙事弹窗（取代 showToast）
//  ② 主线NPC专属对话弹窗（鹤隐等）
//  ③ 主线任务进度面板（showMainQuestPanel）
//  ④ 在地图城镇界面注入「主线」入口按钮
//  ⑤ 支线任务浏览面板（showSideQuestPanel）
// ════════════════════════════════════════════════════════════════

// ── 6幕标题与描述（与 MAIN_QUEST_CHAIN 的 act 1-6 对应） ─────
const ACT_META = [
  null, // index占位
  { label: '第一幕', title: '踏入江湖', color: '#80d8ff', icon: '📖',
    desc: '一封密信，一个暗号，将你卷入一场百年恩怨的漩涡。玄铁令，天下兵器之王，正在被邪魔争夺……' },
  { label: '第二幕', title: '线索追查', color: '#ffd080', icon: '🔍',
    desc: '锦囊中的残缺地图，指向嵩山与武当。两块碎片触手可及，却处处是血骨门与玄冥教的追杀……' },
  { label: '第三幕', title: '三魔联盟的核心', color: '#ff8060', icon: '☠',
    desc: '最后一块碎片藏于幽州黑市，骨冥子亲自出手。这是最后的对决——玄铁令，与中原的命运，就在此一战！' },
  { label: '第四幕', title: '联盟裂隙', color: '#c060e0', icon: '💥',
    desc: '最黑暗的时刻：正道各派接连遭袭，三魔联盟占尽先机。但三魔之间本有裂隙——以敌制敌，瓦解从内部开始。' },
  { label: '第五幕', title: '决战天下', color: '#ff4040', icon: '⚔',
    desc: '号角吹响，决战幽州！正道联盟与血骨门的最终对决。骨冥子手持玄铁令，试图解除上古封印获取毁灭之力……' },
  { label: '第六幕', title: '余波未平', color: '#ffd080', icon: '🌅',
    desc: '血骨门覆灭，武林盟成立。然而比骨冥子更古老的恐怖正在北疆苏醒，新的篇章即将开启……' },
];

// ── 主线任务节点详细叙事文本 ──────────────────────────
const QUEST_NARRATE = {
  mq_act1_start: {
    scene: '洛阳道上',
    bgChar: `
   ░░░░░░░░░░░░░░░░░░░
   ░  📜  密  信  ░░░░
   ░░░░░░░░░░░░░░░░░░░
   ░   玄铁令……      ░
   ░   问路亭·暗号   ░
   ░░░░░░░░░░░░░░░░░░░
    `,
    lines: [
      '旅途中，一封沾着血迹的密信从路边死尸怀中滑落，落在你脚边……',
      '【密信】：「玄铁令现世，速往洛阳城外问路亭，以"霜花落"为暗号，寻故人。」',
      '字迹虽模糊，却透着一股紧迫。你隐约感觉，这封信，并非偶然落入你手中。',
    ],
    tip: '前往 🏙️ 洛阳，找到城外问路亭',
  },
  mq_act1_meet: {
    scene: '洛阳城外·问路亭',
    bgChar: `
   ┌─────────────────┐
   │  🧙 蒙面老者    │
   │    「鹤隐」     │
   │                 │
   │  ……你来了……     │
   └─────────────────┘
    `,
    lines: [
      '亭中，一个蒙面老者负手而立，须发皆白，气度非凡。',
      '「霜花落……你就是那人。」老者转过身来，深邃的眼神扫过你。',
      '「玄悟大师失踪前，曾将一锦囊托付于沧州镖师钟恒。那锦囊，关乎玄铁令的下落。」',
      '「速去沧州——骨冥子的人，已经在路上了。」',
    ],
    tip: '前往 ⚓ 沧州，找到镖师钟恒',
    npcId: 'npc_heyin_mysterious',
    npcName: '鹤隐',
    npcAvatar: '🧙',
  },
  mq_act1_cangzhou: {
    scene: '沧州·镖局废墟',
    bgChar: `
   ╔════════════════╗
   ║  📦 沧州镖局   ║
   ║   满地狼藉……   ║
   ║                ║
   ║  🔩 锦囊残片   ║
   ╚════════════════╝
    `,
    lines: [
      '沧州城内，海沙帮已横行多日。你找到钟恒时，镖局已是一片狼藉。',
      '钟恒重伤倒地，见到你，艰难地从怀中掏出一个破旧锦囊：',
      '「玄……玄悟大师托我保管……快拿走……别让血骨门的人得到……」',
      '他话音未落，便昏迷过去。你从他手中接过了锦囊。',
    ],
    tip: '打开锦囊，查看其中地图碎片',
  },
  mq_act2_start: {
    scene: '某处客栈·秘密查阅',
    bgChar: `
   ┌────────────────────┐
   │  🔍 锦囊内部       │
   │                    │
   │  「令藏三处        │
   │   碎而不现         │
   │   唯合则显」       │
   └────────────────────┘
    `,
    lines: [
      '你找了一处僻静客栈，打开锦囊——里面是一张残缺的地图碎片。',
      '碎片上标注了"嵩山石窟·第三层"，旁边还有一行字迹：',
      '「令藏三处，碎而不现，唯合则显。」',
      '原来，玄铁令被分成三块！一块在嵩山，另外两块，还需追查……',
    ],
    tip: '前往 ⛰️ 嵩山，深入石窟第三层',
  },
  mq_act2_songshan: {
    scene: '嵩山石窟·深处',
    bgChar: `
   ⠀⠀⠀⛰⛰⛰⛰⛰
   ⠀⠀⠀🪨 石窟 🪨
   ⠀⠀⠀⠀第三层
   ⠀⠀⠀🔩 碎片（一）
   ⠀⠀⠀⠀⚔ 追命使
    `,
    lines: [
      '石窟最深处，你找到了嵌在石壁中的第一块玄铁令碎片，暗金色，触之微温。',
      '就在此时，身后传来脚步声。血骨门"追命使"带人赶到：',
      '「阁下倒是手脚麻利——把碎片留下，我可以让你全身而退。」',
      '刀光剑影中，你击退了追命使，夺得碎片（一）。',
    ],
    tip: '击败血骨门追命使，获得玄铁令（一）',
  },
  mq_act2_wudang: {
    scene: '武当山后山',
    bgChar: `
   ⠀⠀⠀☯ 武当山 ☯
   ⠀⠀⠀─────────
   ⠀⠀⠀🧘 清虚真人
   ⠀⠀⠀⠀⠀陷入重围
   ⠀⠀⠀🔩 碎片（二）
    `,
    lines: [
      '武当山清虚真人已三日未归山，你循踪来到后山密林。',
      '玄冥教杀手将清虚真人团团围住，刀剑出鞘，情势危急。',
      '「有人来了！」杀手回身——你奋力出手，击退玄冥教。',
      '清虚真人拱手谢礼，从袖中取出第二块碎片：「此物交予你，比留在武当安全。」',
    ],
    tip: '击退玄冥教杀手，获得玄铁令（二）',
  },
  mq_act3_start: {
    scene: '幽州城·黑市入口',
    bgChar: `
   ☠ 幽州黑市 ☠
   ─────────────
   😈 血骨门暗哨
   🕵️ 线人···
   🔩 碎片（三）就在此处
    `,
    lines: [
      '幽州，骨冥子的势力范围。黑市深处，第三块碎片就藏在血骨门亲信手中。',
      '你乔装混入，找到暗中联系你的线人——一个皮草商人模样的中年男子。',
      '「碎片在地下第三层仓库，有八名高手看守。今晚子时换岗，那是唯一的机会……」',
      '你在暗处等候，神经绷紧。今夜，成则平步青云，败则万劫不复。',
    ],
    tip: '前往 👻 幽州黑市深处，夺取最后的碎片',
  },
  mq_act3_boss: {
    scene: '幽州·决战之地',
    bgChar: `
   💀💀💀💀💀💀💀💀
   💀                💀
   💀   ☠ 骨冥子   💀
   💀   血骨门主    💀
   💀                💀
   💀💀💀💀💀💀💀💀
    `,
    lines: [
      '你手持三块碎片，刚要合拢——一道阴沉的笑声从黑暗中传来。',
      '「好……终于集齐了。省得老夫四处找寻。」',
      '骨冥子现身，身形如鬼，眼若寒星。三魔联盟的高手将你团团围住。',
      '「玄铁令……终究是要归属于天下最强者。而那个人，不是你。」',
      '此战，无退路。你握紧手中碎片，准备迎接最终的对决……',
    ],
    tip: '击败骨冥子，完成《血骨门之乱》主线！',
    isBoss: true,
  },
};

// ── 已触发但待玩家确认的主线弹窗队列 ──
let _mqPendingPopup = null;

// ══════════════════════════════════════════════════════════════════
//  ① 城市抵达：触发叙事弹窗（取代原来的 showToast）
// ══════════════════════════════════════════════════════════════════
function checkMainQuestTriggerCity(cityId){
  if(typeof MAIN_QUEST_CHAIN === 'undefined') return;
  const cur = getCurrentMainQuest();
  if(!cur) return;
  if(cur.triggerCity !== cityId) return;
  if(isMainQuestComplete(cur.id)) return;

  // 有叙事文本则弹窗，否则简单 toast
  const narr = QUEST_NARRATE[cur.id];
  if(narr){
    setTimeout(()=> _showMainQuestNarrative(cur, narr), 1000);
  } else {
    setTimeout(()=>{
      showToast(`📖 主线：${cur.name} ── ${(cur.desc||'').slice(0,28)}…`);
    }, 800);
  }
}

/** 显示主线叙事弹窗 */
function _showMainQuestNarrative(quest, narr){
  const act = ACT_META[quest.act] || ACT_META[1];
  const actColor = act.color;
  let lineIdx = 0;

  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.id = 'mq-narrative-overlay';

  const linesHtml = narr.lines.map((l,i)=>
    `<div class="mqn-line" id="mqn-line-${i}" style="opacity:0;transition:opacity .4s ${i*0.3}s">${l}</div>`
  ).join('');

  overlay.innerHTML = `
    <div class="mqn-box">
      <div class="mqn-act-badge" style="color:${actColor};border-color:${actColor}44">
        ${act.icon} ${act.label} · ${act.title}
      </div>
      <div class="mqn-scene">📍 ${narr.scene}</div>
      <pre class="mqn-bgchar">${narr.bgChar}</pre>
      <div class="mqn-lines">${linesHtml}</div>
      <div class="mqn-tip">
        <span class="mqn-tip-label">▶ 目标</span>
        <span class="mqn-tip-text">${narr.tip}</span>
      </div>
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="document.getElementById('mq-narrative-overlay').remove()">
          明白了，继续前行
        </button>
        <button class="mqn-btn mqn-btn-panel" onclick="document.getElementById('mq-narrative-overlay').remove(); showMainQuestPanel()">
          📜 查看主线进度
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 逐行淡入对话
  setTimeout(()=>{
    narr.lines.forEach((_,i)=>{
      const el = document.getElementById(`mqn-line-${i}`);
      if(el) el.style.opacity = '1';
    });
  }, 200);
}

// ══════════════════════════════════════════════════════════════════
//  ② 主线NPC专属对话触发（鹤隐等 storyOnly NPC）
// ══════════════════════════════════════════════════════════════════

/** 检查并渲染主线NPC（在渲染城镇NPC列表后调用） */
function renderStoryNpcsForCity(cityId){
  if(typeof STORY_NPCS === 'undefined') return;
  const cur = getCurrentMainQuest();
  if(!cur) return;

  Object.values(STORY_NPCS).forEach(npc=>{
    if(npc.city !== cityId) return;
    // 只在对应主线节点出现
    if(!cur.triggerNpc || cur.triggerNpc !== npc.id) return;
    if(isMainQuestComplete(cur.id)) return;

    // 注入到 NPC 列表容器
    const container = document.getElementById('cityNpcList') || document.getElementById('npcListEl');
    if(!container) return;
    const div = document.createElement('div');
    div.className = 'npc-card npc-story';
    div.id = `story-npc-${npc.id}`;
    div.innerHTML = `
      <div class="npc-avatar story-npc-glow">${npc.avatar}</div>
      <div class="npc-info">
        <div class="npc-name" style="color:#ffd080">${npc.name}
          <span style="font-size:9px;color:rgba(255,200,80,.5);margin-left:4px">主线人物</span>
        </div>
        <div class="npc-role" style="color:rgba(200,170,80,.6)">${npc.role}</div>
      </div>
      <button class="npc-talk-btn story-npc-btn" onclick="showStoryNpcDialog('${npc.id}')">对话</button>
    `;
    container.prepend(div); // 主线NPC置顶
  });
}

/** 主线NPC对话弹窗 */
function showStoryNpcDialog(npcId){
  const npc = (typeof STORY_NPCS !== 'undefined') ? STORY_NPCS[npcId] : null;
  if(!npc) return;
  const cur = getCurrentMainQuest();
  if(!cur) return;

  // 找到该NPC承载的主线节点
  const questForNpc = Object.values(MAIN_QUEST_CHAIN).find(q=> q.triggerNpc === npcId);
  const narr = questForNpc ? QUEST_NARRATE[questForNpc.id] : null;

  const greetings = npc.greetings || [];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)] || '……';

  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="mqn-box" style="max-width:420px">
      <div class="mqn-act-badge" style="color:#ffd080;border-color:rgba(255,208,128,.3)">
        📜 主线人物 · ${npc.role}
      </div>
      <div class="mqn-npc-head">
        <div class="mqn-npc-avatar">${npc.avatar}</div>
        <div>
          <div style="font-size:16px;color:#ffd080;font-weight:700">${npc.name}</div>
          <div style="font-size:11px;color:rgba(200,170,80,.5)">${npc.role}</div>
        </div>
      </div>
      <div class="mqn-dialog-bubble">
        ${greeting}
      </div>
      ${narr ? `
        <div class="mqn-lines" style="margin-top:10px">
          ${narr.lines.map(l=>`<div class="mqn-line" style="opacity:1">${l}</div>`).join('')}
        </div>
        <div class="mqn-tip" style="margin-top:10px">
          <span class="mqn-tip-label">▶ 任务</span>
          <span class="mqn-tip-text">${narr.tip}</span>
        </div>
      ` : ''}
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">告辞</button>
        <button class="mqn-btn mqn-btn-panel" onclick="this.closest('.sq-overlay').remove(); showMainQuestPanel()">📜 主线进度</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ══════════════════════════════════════════════════════════════════
//  ③ 主线任务进度面板
// ══════════════════════════════════════════════════════════════════
function showMainQuestPanel(){
  if(typeof MAIN_QUEST_CHAIN === 'undefined'){
    showToast('主线系统未加载');
    return;
  }

  const prog = getMainQuestProgress();
  const curQ  = getCurrentMainQuest();
  // 【修复】动态收集所有存在的幕次，不再硬编码只显示前3幕
  const allActNums = new Set(Object.values(MAIN_QUEST_CHAIN).map(q=>q.act).filter(Boolean));
  const acts = Array.from(allActNums).sort((a,b)=>a-b);

  // 按幕分组
  const actQuests = {};
  Object.values(MAIN_QUEST_CHAIN).forEach(q=>{
    if(!actQuests[q.act]) actQuests[q.act] = [];
    actQuests[q.act].push(q);
  });

  const actsHtml = acts.map(actNum=>{
    const meta = ACT_META[actNum];
    const qs = actQuests[actNum] || [];
    const allDone = qs.every(q=> prog[q.id] === 'completed');
    const anyActive = qs.some(q=> curQ && curQ.id === q.id);
    const actStatus = allDone ? 'done' : anyActive ? 'active' : 'pending';
    const actStatusLabels = { done:'✅ 已完成', active:'▶ 进行中', pending:'🔒 未开始' };
    const actStatusColors = { done:'#80e880', active:meta.color, pending:'rgba(160,160,160,.4)' };

    const questItems = qs.map(q=>{
      const isDone = prog[q.id] === 'completed';
      const isActive = curQ && curQ.id === q.id;
      const statusIcon = isDone ? '✅' : isActive ? '▶' : '○';
      const statusCls = isDone ? 'mq-item-done' : isActive ? 'mq-item-active' : 'mq-item-pending';
      return `
        <div class="mq-item ${statusCls}" onclick="${isActive ? `showMainQuestNarrativeById('${q.id}')` : ''}">
          <div class="mq-item-icon">${statusIcon}</div>
          <div class="mq-item-body">
            <div class="mq-item-name">${q.icon} ${q.name}</div>
            <div class="mq-item-desc">${(q.desc||'').slice(0,45)}${q.desc && q.desc.length>45?'…':''}</div>
            ${isActive ? `<div class="mq-item-tip">点击查看详情</div>` : ''}
          </div>
        </div>`;
    }).join('');

    return `
      <div class="mq-act-block ${actStatus}">
        <div class="mq-act-header" style="color:${actStatusColors[actStatus]}">
          <span>${meta.icon} ${meta.label} · ${meta.title}</span>
          <span class="mq-act-status">${actStatusLabels[actStatus]}</span>
        </div>
        <div class="mq-act-desc">${meta.desc}</div>
        <div class="mq-quest-list">${questItems}</div>
      </div>`;
  }).join('');

  // 主线完成判断（动态查找 isFinal 标记的任务）
  const finalQuest = Object.values(MAIN_QUEST_CHAIN).find(q => q.isFinal);
  const isFinalDone = finalQuest ? prog[finalQuest.id] === 'completed' : false;
  const completionBanner = isFinalDone ? `
    <div class="mq-complete-banner">
      🏅 主线完结！《血骨门之乱》已平息，玄铁令归于侠义之手，中原重归宁静。
    </div>
  ` : '';

  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.id = 'mq-panel-overlay';
  overlay.innerHTML = `
    <div class="mq-panel">
      <div class="mq-panel-header">
        <div class="mq-panel-title">📜 《血骨门之乱》主线进度</div>
        <button class="jh-close-btn" onclick="document.getElementById('mq-panel-overlay').remove()">✕</button>
      </div>

      <!-- 世界背景摘要 -->
      <div class="mq-bg-summary">
        <div class="mq-bg-title">⚡ 江湖背景</div>
        <div class="mq-bg-text">${
          typeof WORLD_STORY !== 'undefined'
          ? WORLD_STORY.mainCrisis
          : '「玄铁令」争夺战——三魔联盟与正道联盟的决战迫在眉睫'
        }</div>
      </div>

      ${completionBanner}

      <!-- 三幕内容 -->
      <div class="mq-acts-container">${actsHtml}</div>

      <!-- 支线入口 -->
      <div style="margin-top:14px;text-align:center">
        <button class="mqn-btn mqn-btn-panel" style="font-size:11px" onclick="document.getElementById('mq-panel-overlay').remove(); showSideQuestPanel()">
          📋 查看支线任务
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

/** 从面板中点击"查看详情"打开叙事弹窗 */
function showMainQuestNarrativeById(questId){
  const q = (typeof MAIN_QUEST_CHAIN !== 'undefined') ? MAIN_QUEST_CHAIN[questId] : null;
  const narr = QUEST_NARRATE[questId];
  if(!q || !narr) return;
  document.getElementById('mq-panel-overlay')?.remove();
  _showMainQuestNarrative(q, narr);
}

// ══════════════════════════════════════════════════════════════════
//  ④ 支线任务浏览面板（含状态追踪、接受、叙事详情）
// ══════════════════════════════════════════════════════════════════
function showSideQuestPanel(){
  if(typeof SIDE_QUEST_DB === 'undefined'){
    showToast('支线系统未加载');
    return;
  }
  if(document.getElementById('sq-panel-overlay')) return;

  const curCity = (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : '';
  const cityName = curCity
    ? ((typeof WORLD_NODES !== 'undefined' && WORLD_NODES[curCity]?.name) || curCity)
    : '未知之地';

  const typeLabels = {
    kill:   { icon:'⚔', label:'讨伐', color:'#ff8060' },
    escort: { icon:'🛡', label:'护送', color:'#80c8ff' },
    travel: { icon:'🗺', label:'游历', color:'#a0e080' },
    collect:{ icon:'📦', label:'收集', color:'#ffd080' },
  };
  const statusMeta = {
    available: { tag:'可接', tagClass:'sq-tag-avail', sortVal: 1 },
    active:    { tag:'进行中', tagClass:'sq-tag-active', sortVal: 0 },
    done:      { tag:'已完成', tagClass:'sq-tag-done', sortVal: 2 },
  };

  const allSqs = Object.values(SIDE_QUEST_DB);
  // 排序：进行中 > 当前城市可接 > 其他可接 > 已完成
  allSqs.sort((a, b)=>{
    const sa = getSideQuestStatus(a.id);
    const sb = getSideQuestStatus(b.id);
    const priA = sa==='active' ? 0 : sa==='done' ? 3 : (a.availCities && curCity && a.availCities.includes(curCity) ? 1 : 2);
    const priB = sb==='active' ? 0 : sb==='done' ? 3 : (b.availCities && curCity && b.availCities.includes(curCity) ? 1 : 2);
    return priA - priB;
  });

  const sqHtml = allSqs.map(sq=>{
    const tl = typeLabels[sq.type] || { icon:'📋', label:'其他', color:'#a0a0a0' };
    const status = getSideQuestStatus(sq.id);
    const sm = statusMeta[status] || statusMeta.available;
    const inCity = !curCity || !sq.availCities || sq.availCities.includes(curCity);
    const availText = sq.availCities
      ? sq.availCities.map(c=>(typeof WORLD_NODES!=='undefined' && WORLD_NODES[c]?.name)||c).join(' / ')
      : '全图可接';

    const dimClass = (status==='done') ? ' sq-done' : (!inCity && status==='available') ? ' sq-unavail' : '';

    // 进行中时显示目标城市或进度提示
    let statusRow = '';
    if(status==='active'){
      if(sq.targetCityId && typeof WORLD_NODES!=='undefined'){
        const targetCity = WORLD_NODES[sq.targetCityId]?.name || sq.targetCityId;
        statusRow = `<div class="sq-inprogress-tip">📍 目标：${sq.targetName} @ ${targetCity}</div>`;
      } else if(sq.narrative?.inProgress){
        statusRow = `<div class="sq-inprogress-tip">▶ ${sq.narrative.inProgress}</div>`;
      }
    } else {
      statusRow = `<div class="sq-item-city">📍 ${availText}</div>`;
    }

    return `
      <div class="sq-item${dimClass}" onclick="showSideQuestDetail('${sq.id}')" style="cursor:pointer">
        <div class="sq-item-icon">${sq.icon||tl.icon}</div>
        <div class="sq-item-body">
          <div class="sq-item-name">${sq.name}
            <span class="sq-type-tag" style="background:${tl.color}22;border-color:${tl.color}44;color:${tl.color}">${tl.icon} ${tl.label}</span>
            <span class="sq-status-tag ${sm.tagClass}">${sm.tag}</span>
          </div>
          <div class="sq-item-desc">${(sq.desc||'').slice(0,55)}${sq.desc && sq.desc.length>55?'…':''}</div>
          <div class="sq-item-reward">🏆 ${sq.rewardText}</div>
          ${statusRow}
        </div>
        <div class="sq-item-arrow">›</div>
      </div>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.id = 'sq-panel-overlay';
  overlay.innerHTML = `
    <div class="mq-panel">
      <div class="mq-panel-header">
        <div class="mq-panel-title">📋 江湖支线任务</div>
        <button class="jh-close-btn" onclick="document.getElementById('sq-panel-overlay').remove()">✕</button>
      </div>
      <div class="sq-panel-location">
        📍 当前：${cityName}
        <span class="sq-panel-counts">进行中 <b>${allSqs.filter(s=>getSideQuestStatus(s.id)==='active').length}</b>
        · 已完成 <b>${allSqs.filter(s=>getSideQuestStatus(s.id)==='done').length}</b>
        / ${allSqs.length}</span>
      </div>
      <div class="sq-list">${sqHtml}</div>
      <div style="margin-top:10px;text-align:center">
        <button class="mqn-btn mqn-btn-ok" onclick="document.getElementById('sq-panel-overlay').remove()">关闭</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ── 支线详情弹窗 ─────────────────────────────────
function showSideQuestDetail(sqId){
  const sq = (typeof SIDE_QUEST_DB !== 'undefined') ? SIDE_QUEST_DB[sqId] : null;
  if(!sq) return;

  const status = getSideQuestStatus(sqId);
  const nar = sq.narrative || {};
  const accept = nar.accept || {};
  const complete = nar.complete || {};
  const curCity = (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : '';
  const inCity = !curCity || !sq.availCities || sq.availCities.includes(curCity);

  const typeLabels = {
    kill:'⚔ 讨伐', escort:'🛡 护送', travel:'🗺 游历', collect:'📦 收集'
  };

  // 叙事内容区（接受 or 完成）
  let narrativeHtml = '';
  if(status === 'done' && complete.lines){
    narrativeHtml = `
      <div class="sqd-scene">✅ ${complete.scene||'任务完成'}</div>
      <div class="sqd-lines">${complete.lines.map(l=>`<div class="sqd-line">${l}</div>`).join('')}</div>`;
  } else if(accept.scene || accept.lines){
    const npcRow = (accept.npcAvatar || accept.npcName) ? `
      <div class="mqn-npc-head">
        <div class="mqn-npc-avatar">${accept.npcAvatar||'🧑'}</div>
        <div><div style="font-size:12px;color:#ffd080">${accept.npcName||''}</div>
        <div style="font-size:10px;color:rgba(200,180,140,.5)">${accept.scene||''}</div></div>
      </div>` : '';
    const bgRow = accept.bgChar ? `<div class="mqn-bgchar">${accept.bgChar}</div>` : '';
    const linesHtml = accept.lines
      ? accept.lines.map((l,i)=>`<div class="sqd-line" style="animation-delay:${i*0.08}s">${l}</div>`).join('')
      : '';
    const tipRow = accept.tip ? `<div class="mqn-tip"><span class="mqn-tip-label">目标</span><span class="mqn-tip-text">${accept.tip}</span></div>` : '';
    narrativeHtml = `${bgRow}${npcRow}<div class="sqd-lines">${linesHtml}</div>${tipRow}`;
  } else {
    narrativeHtml = `<div class="sqd-line">${sq.desc}</div>`;
  }

  // 底部按钮
  let actionBtn = '';
  if(status === 'available'){
    if(inCity){
      actionBtn = `<button class="mqn-btn mqn-btn-ok" onclick="_sqAccept('${sqId}')">接受任务</button>`;
    } else {
      const cities = sq.availCities
        ? sq.availCities.map(c=>(typeof WORLD_NODES!=='undefined'&&WORLD_NODES[c]?.name)||c).join('、')
        : '特定地点';
      actionBtn = `<button class="mqn-btn" disabled style="opacity:.4;cursor:not-allowed">需在 ${cities} 接取</button>`;
    }
  } else if(status === 'active'){
    actionBtn = `<button class="mqn-btn mqn-btn-panel" onclick="_sqMarkDone('${sqId}')">标记完成</button>`;
  } else {
    actionBtn = `<button class="mqn-btn" disabled style="opacity:.4">已完成</button>`;
  }

  const overlay2 = document.createElement('div');
  overlay2.className = 'sq-overlay';
  overlay2.id = 'sq-detail-overlay';
  overlay2.innerHTML = `
    <div class="mqn-box sqd-box">
      <div class="sqd-header">
        <span class="sqd-icon">${sq.icon||'📋'}</span>
        <div>
          <div class="sqd-title">${sq.name}</div>
          <div class="sqd-meta">${typeLabels[sq.type]||sq.type} &nbsp;·&nbsp; 🏆 ${sq.rewardText}</div>
        </div>
      </div>
      <div class="sqd-desc">${sq.desc}</div>
      <div class="sqd-narr-block">${narrativeHtml}</div>
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-panel" onclick="document.getElementById('sq-detail-overlay').remove()">返回</button>
        ${actionBtn}
      </div>
    </div>
  `;
  document.body.appendChild(overlay2);
}

function _sqAccept(sqId){
  if(typeof acceptSideQuest !== 'function'){ showToast('系统未就绪'); return; }
  const ok = acceptSideQuest(sqId);
  if(ok){
    const sq = SIDE_QUEST_DB[sqId];
    showToast(`✅ 已接受支线：${sq?.name||sqId}`);
    document.getElementById('sq-detail-overlay')?.remove();
    document.getElementById('sq-panel-overlay')?.remove();
    // 重新打开面板刷新状态
    setTimeout(showSideQuestPanel, 200);
  }
}

function _sqMarkDone(sqId){
  if(typeof completeSideQuest !== 'function'){ showToast('系统未就绪'); return; }
  const ok = completeSideQuest(sqId);
  if(ok){
    const sq = SIDE_QUEST_DB[sqId];
    document.getElementById('sq-detail-overlay')?.remove();
    document.getElementById('sq-panel-overlay')?.remove();
    // 弹出完成叙事
    setTimeout(()=>_showSqCompleteNarrative(sq), 300);
  }
}

function _showSqCompleteNarrative(sq){
  if(!sq) return;
  const comp = sq.narrative?.complete || {};
  const linesHtml = (comp.lines||[sq.desc+'……任务完成。']).map(l=>`<div class="sqd-line">${l}</div>`).join('');
  
  // 奖励详情展示
  const r = sq.reward || {};
  let rewardDetails = [];
  if(r.silver) rewardDetails.push(`<span style="color:#ffd880">💰 ${r.silver}两</span>`);
  if(r.exp) rewardDetails.push(`<span style="color:#80d8ff">⭐ ${r.exp}经验</span>`);
  if(r.fame) rewardDetails.push(`<span style="color:#ff8080">👑 声望+${r.fame}</span>`);
  if(r.rel_sect) rewardDetails.push(`<span style="color:#ff80c0">💕 ${r.rel_sect}好感+${r.rel_val||5}</span>`);
  if(r.item) rewardDetails.push(`<span style="color:#ff9040">🗡 获得物品</span>`);
  if(r.alignment_bonus || r.alignment_penalty) {
    const bonus = r.alignment_bonus ? `+${r.alignment_bonus}` : '';
    const penalty = r.alignment_penalty ? `-${r.alignment_penalty}` : '';
    rewardDetails.push(`<span style="color:#ffd080">⚖ 倾向调整</span>`);
  }
  const rewardHtml = rewardDetails.length > 0 
    ? `<div class="sqc-reward-list">${rewardDetails.join('')}</div>`
    : `<span class="mqn-tip-text">${sq.rewardText}</span>`;
  
  const overlay3 = document.createElement('div');
  overlay3.className = 'sq-overlay';
  overlay3.innerHTML = `
    <div class="mqn-box">
      <div class="mqn-act-badge" style="color:#ffd080;border-color:#ffd08044">
        📋 支线完成 · ${sq.name}
      </div>
      <div style="text-align:center;font-size:28px;margin:10px 0">🎉</div>
      ${comp.scene ? `<div class="mqn-scene">📍 ${comp.scene}</div>` : ''}
      <div class="sqd-lines">${linesHtml}</div>
      <div class="mqn-tip" style="flex-direction:column;align-items:flex-start">
        <span class="mqn-tip-label">🏆 获得奖励</span>
        ${rewardHtml}
      </div>
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">继续</button>
        <button class="mqn-btn mqn-btn-panel" onclick="this.closest('.sq-overlay').remove();showSideQuestPanel()">支线列表</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay3);
}

// ══════════════════════════════════════════════════════════════════
//  ⑤ 在城镇地图注入「主线」入口按钮
//  → 挂钩到 travelRenderLocation 执行之后
// ══════════════════════════════════════════════════════════════════
(function patchTravelRenderLocation(){
  if(typeof travelRenderLocation !== 'function') return;
  const _orig = travelRenderLocation;
  travelRenderLocation = function(cityId){
    _orig(cityId);
    // 注入主线入口按钮（若已存在则跳过）
    _injectMainQuestBtn(cityId);
    // 主线NPC注入
    if(typeof renderStoryNpcsForCity === 'function'){
      setTimeout(()=> renderStoryNpcsForCity(cityId), 300);
    }
  };
})();

function _injectMainQuestBtn(cityId){
  const TGT_ID = 'mainQuestEntryBtn';
  if(document.getElementById(TGT_ID)) return;

  // 找到服务按钮容器或城市信息区域
  const svcContainer = document.getElementById('tlServices');
  if(!svcContainer) return;

  const cur = (typeof getCurrentMainQuest === 'function') ? getCurrentMainQuest() : null;
  const finalQuestId = (typeof MAIN_QUEST_CHAIN !== 'undefined')
    ? Object.values(MAIN_QUEST_CHAIN).find(q => q.isFinal)?.id || 'mq_act3_boss'
    : 'mq_act3_boss';
  const isFinalDone = (typeof isMainQuestComplete === 'function') ? isMainQuestComplete(finalQuestId) : false;
  const btnText = isFinalDone ? '📜 主线（已完结）' : `📜 主线（${cur?.name||'进行中'}）`;

  const btn = document.createElement('button');
  btn.id = TGT_ID;
  btn.className = 'tl-service-btn mq-entry-btn';
  btn.innerHTML = `<span class="svc-icon">📜</span><span class="svc-name">${isFinalDone ? '主线完结' : '主线'}</span>`;
  btn.title = btnText;
  btn.onclick = showMainQuestPanel;

  // 插入到服务按钮区域第一位
  const svcDiv = svcContainer.querySelector('.tl-services');
  if(svcDiv) svcDiv.prepend(btn);
  else svcContainer.prepend(btn);
}

// ══════════════════════════════════════════════════════════════════
//  ⑥ 主线击杀完成后触发叙事弹窗（增强 checkMainQuestKill）
// ══════════════════════════════════════════════════════════════════
(function patchCheckMainQuestKill(){
  if(typeof checkMainQuestKill !== 'function') return;
  const _origKill = checkMainQuestKill;
  checkMainQuestKill = function(killedNpcId){
    const cur = (typeof getCurrentMainQuest === 'function') ? getCurrentMainQuest() : null;
    if(!cur || cur.type !== 'kill' || cur.targetNpcId !== killedNpcId) {
      return _origKill(killedNpcId);
    }
    if(typeof isMainQuestComplete === 'function' && isMainQuestComplete(cur.id)){
      return _origKill(killedNpcId);
    }

    // 先执行原始逻辑（发放奖励、推进进度）
    _origKill(killedNpcId);

    // 然后触发叙事弹窗
    const next = (typeof MAIN_QUEST_CHAIN !== 'undefined' && cur.nextQuest)
      ? MAIN_QUEST_CHAIN[cur.nextQuest] : null;
    setTimeout(()=>{
      _showKillResultNarrative(cur, next);
    }, 1200);
  };
})();

function _showKillResultNarrative(cur, next){
  const actMeta = ACT_META[cur.act] || ACT_META[1];
  // 【修复】isFinal 动态判断（兼容无 isFinal 标记但无下一任务的情况）
  const isReallyFinal = cur.isFinal || (!next && !cur.nextQuest);
  const nextStr = next
    ? `<div class="mqn-tip"><span class="mqn-tip-label">▶ 下一目标</span><span class="mqn-tip-text">${next.name} — ${(next.desc||'').slice(0,40)}…</span></div>`
    : (isReallyFinal ? `<div class="mqn-tip" style="color:#ffd060">🏅 主线完结！江湖已平，英名永存。</div>` : '');

  const overlay = document.createElement('div');
  overlay.className = 'sq-overlay';
  overlay.innerHTML = `
    <div class="mqn-box">
      <div class="mqn-act-badge" style="color:${actMeta.color};border-color:${actMeta.color}44">
        ${actMeta.icon} ${actMeta.label} · ${cur.name}
      </div>
      <div style="text-align:center;font-size:24px;margin:10px 0">
        ${cur.isFinal ? '🏅' : '🎉'}
      </div>
      <div class="mqn-lines">
        <div class="mqn-line" style="opacity:1;color:#ffd060;font-size:14px;font-weight:700;text-align:center">
          ${cur.isFinal ? '《血骨门之乱》终章完结！' : `「${cur.name}」完成！`}
        </div>
        <div class="mqn-line" style="opacity:1;text-align:center;color:rgba(200,180,140,.7)">
          击败 ${cur.targetName}，任务达成。
        </div>
        <div class="mqn-line" style="opacity:1;margin-top:8px">
          🏆 ${cur.rewardText}
        </div>
      </div>
      ${nextStr}
      <div class="mqn-actions">
        <button class="mqn-btn mqn-btn-ok" onclick="this.closest('.sq-overlay').remove()">继续</button>
        <button class="mqn-btn mqn-btn-panel" onclick="this.closest('.sq-overlay').remove(); showMainQuestPanel()">
          📜 主线进度
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ══════════════════════════════════════════════════════════════════
//  CSS 注入
// ══════════════════════════════════════════════════════════════════
(function injectStoryStyles(){
  const s = document.createElement('style');
  s.textContent = `
  /* ── 通用遮罩 ── */
  .sq-overlay {
    position:fixed; inset:0; z-index:9600;
    background:rgba(0,0,0,.78);
    display:flex; align-items:center; justify-content:center;
    animation:jhFadeIn .3s;
    overflow-y:auto;
    padding:16px;
  }

  /* ── 叙事弹窗主体 ── */
  .mqn-box {
    background:linear-gradient(160deg,#0a1018,#040a10);
    border:1px solid rgba(100,160,220,.3);
    border-radius:16px;
    padding:22px 24px;
    width:min(460px,96vw);
    color:#d8e8f0;
    position:relative;
  }
  .mqn-act-badge {
    display:inline-block;
    border:1px solid;
    border-radius:20px;
    padding:2px 12px;
    font-size:11px;
    letter-spacing:1px;
    margin-bottom:10px;
  }
  .mqn-scene {
    font-size:11px;
    color:rgba(160,200,220,.5);
    margin-bottom:10px;
    letter-spacing:1px;
  }
  .mqn-bgchar {
    font-family:monospace;
    font-size:11px;
    color:rgba(100,180,220,.4);
    background:rgba(255,255,255,.03);
    border-radius:8px;
    padding:8px 12px;
    margin-bottom:14px;
    white-space:pre;
    overflow:hidden;
    line-height:1.5;
  }
  .mqn-lines { display:flex; flex-direction:column; gap:8px; }
  .mqn-line {
    font-size:13px;
    line-height:1.7;
    color:rgba(220,210,190,.85);
  }
  .mqn-tip {
    margin-top:14px;
    background:rgba(100,160,100,.08);
    border-left:2px solid rgba(100,200,100,.3);
    border-radius:0 6px 6px 0;
    padding:8px 12px;
    font-size:12px;
  }
  .mqn-tip-label {
    color:#80e880;
    font-weight:700;
    margin-right:8px;
  }
  .mqn-tip-text { color:rgba(220,240,220,.8); }
  .mqn-npc-head {
    display:flex;
    align-items:center;
    gap:14px;
    margin:12px 0;
    padding:10px 12px;
    background:rgba(255,200,80,.05);
    border-radius:8px;
    border:1px solid rgba(255,200,80,.12);
  }
  .mqn-npc-avatar { font-size:32px; }
  .mqn-dialog-bubble {
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,200,80,.15);
    border-radius:10px;
    padding:12px 16px;
    font-size:14px;
    color:#ffd080;
    font-style:italic;
    line-height:1.8;
    position:relative;
    margin:10px 0;
  }
  .mqn-dialog-bubble::before {
    content:'「';
    font-size:20px;
    color:rgba(255,200,80,.4);
    margin-right:4px;
  }
  .mqn-dialog-bubble::after {
    content:'」';
    font-size:20px;
    color:rgba(255,200,80,.4);
    margin-left:4px;
  }
  .mqn-actions {
    display:flex;
    gap:10px;
    margin-top:18px;
    justify-content:flex-end;
  }
  .mqn-btn {
    border:none;
    border-radius:8px;
    padding:8px 18px;
    font-size:12px;
    cursor:pointer;
    font-family:inherit;
    transition:opacity .15s;
  }
  .mqn-btn:hover { opacity:.85; }
  .mqn-btn-ok {
    background:rgba(60,120,60,.7);
    color:#a0e0a0;
    border:1px solid rgba(80,200,80,.3);
  }
  .mqn-btn-panel {
    background:rgba(80,60,20,.7);
    color:#ffd080;
    border:1px solid rgba(220,180,60,.3);
  }

  /* ── 主线进度面板 ── */
  .mq-panel {
    background:linear-gradient(160deg,#080e14,#040810);
    border:1px solid rgba(100,160,220,.2);
    border-radius:16px;
    padding:20px;
    width:min(500px,96vw);
    max-height:85vh;
    overflow-y:auto;
    color:#c8d8e8;
    scrollbar-width:thin;
  }
  .mq-panel::-webkit-scrollbar { width:4px; }
  .mq-panel::-webkit-scrollbar-thumb { background:rgba(100,160,220,.3); border-radius:2px; }
  .mq-panel-header {
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:14px;
    padding-bottom:10px;
    border-bottom:1px solid rgba(100,160,220,.15);
  }
  .mq-panel-title {
    font-size:16px;
    font-weight:700;
    color:#80c8ff;
    letter-spacing:1px;
  }
  .mq-bg-summary {
    background:rgba(100,160,220,.07);
    border-radius:8px;
    border-left:2px solid rgba(100,160,220,.3);
    padding:8px 12px;
    margin-bottom:14px;
    font-size:12px;
  }
  .mq-bg-title {
    color:#80c8ff;
    font-size:10px;
    letter-spacing:2px;
    margin-bottom:4px;
  }
  .mq-bg-text { color:rgba(200,220,240,.7); line-height:1.6; }
  .mq-complete-banner {
    background:linear-gradient(90deg,rgba(255,200,60,.15),rgba(255,200,60,.05));
    border:1px solid rgba(255,200,60,.3);
    border-radius:8px;
    padding:10px 14px;
    font-size:13px;
    color:#ffd060;
    text-align:center;
    margin-bottom:14px;
  }
  .mq-acts-container { display:flex; flex-direction:column; gap:12px; }
  .mq-act-block {
    border-radius:10px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,.06);
  }
  .mq-act-block.done { border-color:rgba(80,200,80,.2); }
  .mq-act-block.active { border-color:rgba(100,180,255,.3); }
  .mq-act-block.pending { opacity:.7; }
  .mq-act-header {
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:10px 14px;
    background:rgba(255,255,255,.04);
    font-size:13px;
    font-weight:600;
    letter-spacing:.5px;
  }
  .mq-act-status { font-size:10px; opacity:.8; }
  .mq-act-desc {
    font-size:11px;
    color:rgba(200,210,220,.55);
    padding:6px 14px 8px;
    line-height:1.6;
  }
  .mq-quest-list { padding:0 10px 10px; display:flex; flex-direction:column; gap:6px; }
  .mq-item {
    display:flex;
    gap:10px;
    padding:8px 10px;
    border-radius:8px;
    background:rgba(255,255,255,.03);
    transition:background .15s;
  }
  .mq-item.mq-item-active {
    background:rgba(100,180,255,.08);
    border:1px solid rgba(100,180,255,.15);
    cursor:pointer;
  }
  .mq-item.mq-item-active:hover { background:rgba(100,180,255,.13); }
  .mq-item.mq-item-done { opacity:.6; }
  .mq-item-icon { font-size:14px; min-width:18px; }
  .mq-item-body { flex:1; }
  .mq-item-name { font-size:12px; font-weight:600; color:rgba(220,230,240,.9); }
  .mq-item-desc { font-size:10px; color:rgba(160,180,200,.55); margin-top:2px; line-height:1.5; }
  .mq-item-tip { font-size:10px; color:#80c8ff; margin-top:3px; }

  /* ── 支线面板 ── */
  .sq-panel-location {
    font-size:11px;
    color:rgba(160,200,160,.5);
    margin-bottom:12px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:8px 0;
    border-bottom:1px solid rgba(100,200,150,.1);
  }
  .sq-panel-counts { color:rgba(140,180,220,.5); font-weight:600; }
  .sq-panel-counts b { color:#80c8ff; font-weight:700; }
  .sq-list { display:flex; flex-direction:column; gap:8px; }
  .sq-item {
    display:flex;
    gap:10px;
    padding:10px 12px;
    background:rgba(20,20,16,.55);
    border-radius:8px;
    border:1px solid rgba(100,160,120,.15);
    transition:all .2s;
    position:relative;
    cursor:pointer;
  }
  .sq-item:hover {
    background:rgba(40,50,40,.65);
    border-color:rgba(100,180,130,.4);
    transform:translateY(-2px);
    box-shadow:0 4px 12px rgba(0,0,0,.4), 0 0 12px rgba(60,180,100,.08);
  }
  .sq-item.sq-unavail { opacity:.45; }
  .sq-item.sq-done { opacity:.55; background:rgba(100,100,100,.2); }
  .sq-item-icon { font-size:20px; min-width:24px; filter:drop-shadow(0 0 4px rgba(200,200,100,.15)); }
  .sq-item-body { flex:1; min-width:0; }
  .sq-item-arrow { font-size:18px; color:rgba(160,180,160,.4); align-self:center; transition:transform .2s; }
  .sq-item:hover .sq-item-arrow { transform:translateX(3px); color:rgba(160,200,160,.8); }
  .sq-item-name {
    font-size:13px;
    font-weight:600;
    color:rgba(220,220,200,.9);
    display:flex;
    align-items:center;
    gap:6px;
    flex-wrap:wrap;
  }
  .sq-type-tag {
    font-size:9px;
    border:1px solid;
    padding:1px 6px;
    border-radius:3px;
  }
  .sq-status-tag {
    font-size:9px;
    padding:1px 6px;
    border-radius:3px;
    font-weight:700;
    letter-spacing:.5px;
  }
  .sq-tag-avail { background:rgba(100,200,100,.15); color:#80e880; border:1px solid rgba(100,200,100,.3); }
  .sq-tag-active { background:rgba(255,200,80,.2); color:#ffd880; border:1px solid rgba(255,200,80,.4); font-weight:800; }
  .sq-tag-done { background:rgba(150,150,150,.15); color:#c0c0b0; border:1px solid rgba(150,150,150,.3); }
  .sq-item-desc { font-size:11px; color:rgba(180,200,180,.6); margin-top:2px; line-height:1.5; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sq-item-reward { font-size:10px; color:#ffd080; margin-top:4px; }
  .sq-item-city { font-size:10px; color:rgba(140,180,220,.5); margin-top:2px; }
  .sq-inprogress-tip { font-size:10px; color:#b0f080; margin-top:3px; font-weight:600; }

  /* ── 支线详情弹窗 ── */
  .sqd-box { max-width:480px; }
  .sqd-header { display:flex; gap:12px; align-items:flex-start; margin-bottom:12px; }
  .sqd-icon { font-size:28px; }
  .sqd-title { font-size:17px; font-weight:700; color:#ffd080; }
  .sqd-meta { font-size:11px; color:rgba(200,180,140,.5); margin-top:3px; }
  .sqd-desc {
    font-size:12px;
    color:rgba(200,210,200,.65);
    background:rgba(255,255,255,.03);
    border-left:2px solid rgba(200,180,100,.2);
    border-radius:0 6px 6px 0;
    padding:8px 12px;
    margin-bottom:12px;
    line-height:1.7;
  }
  .sqd-narr-block { margin-bottom:10px; }
  .sqd-scene {
    font-size:11px;
    color:rgba(160,200,220,.5);
    letter-spacing:1px;
    margin-bottom:8px;
  }
  .sqd-lines { display:flex; flex-direction:column; gap:7px; }
  .sqd-line {
    font-size:13px;
    line-height:1.75;
    color:rgba(220,210,190,.85);
    animation:sqLineFadeIn .4s both;
  }
  /* 支线完成奖励列表 */
  .sqc-reward-list {
    display:flex;
    flex-direction:column;
    gap:6px;
    margin-top:8px;
    padding:8px;
    background:rgba(100,100,80,.1);
    border-radius:4px;
    border-left:3px solid rgba(255,200,80,.4);
  }
  .sqc-reward-list span {
    font-size:12px;
    font-weight:600;
    display:inline-block;
  }
  @keyframes sqLineFadeIn {
    from { opacity:0; transform:translateY(4px); }
    to   { opacity:1; transform:none; }
  }

  /* ── 主线入口按钮 ── */
  .mq-entry-btn {
    background:rgba(80,60,20,.6) !important;
    border:1px solid rgba(220,180,60,.25) !important;
    color:#ffd080 !important;
    position:relative;
  }
  .mq-entry-btn::after {
    content:'';
    position:absolute;
    top:4px; right:4px;
    width:6px; height:6px;
    border-radius:50%;
    background:#ff6040;
    box-shadow:0 0 4px #ff6040;
    display:none;
  }
  .mq-entry-btn.has-active::after { display:block; }

  /* ── 主线NPC卡片 ── */
  .npc-card.npc-story {
    border-color:rgba(255,200,80,.3) !important;
    background:linear-gradient(135deg,rgba(30,20,5,.7),rgba(15,10,0,.6)) !important;
  }
  .story-npc-glow { filter:drop-shadow(0 0 6px rgba(255,200,80,.5)); }
  .story-npc-btn {
    background:rgba(80,60,10,.8) !important;
    border-color:rgba(220,180,50,.4) !important;
    color:#ffd060 !important;
  }

  @keyframes mqPulse {
    0%,100% { box-shadow:0 0 8px rgba(100,180,255,.3); }
    50%      { box-shadow:0 0 16px rgba(100,180,255,.6); }
  }
  `;
  document.head.appendChild(s);
})();
