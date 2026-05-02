const TRAVEL_STATE_KEY = 'wuxia_travel';

let travelPlayerState = {
  silver: 200,     // 银两（初始200两）
  hp: 100,         // 当前气血（百分比）
  energy: 100,     // 当前精力（0-100）
  food: 100,       // 饱食度（0-100，0=饿）
  water: 100,      // 口渴度（0-100，0=渴）
  buffs: [],       // 临时buff：[{id, name, value, turns}]
  reputation: 100, // 声誉（江湖名望）0-200，初始100=中立
                   // >150 良侠，>100 游侠，<80 恶名，<50 江湖恶徒，<20 天下公敌
  wantedBy: [],    // 通缉门派列表 [{sectId, sectName, reason, killCount, expireDay}]
};

// ════════════════════════════════════════════════════════════════
//  地点访问限制系统
//  主线剧情推进前，部分邪道门派所在地不可进入
// ════════════════════════════════════════════════════════════════

/**
 * 受限地点配置
 * - requireAct: 需要完成第几幕主线后才能进入（如 requireAct: 3 表示需要完成第二幕、进入第三幕）
 * - unlockQuest: 完成此任务ID后解锁（优先于此字段）
 */
const RESTRICTED_LOCATIONS = {
  xuegu_fort: {
    name: '血炼堡·血骨门',
    requireAct: 3,  // 需要进入第三幕后才能进入
    hint: '此地凶险异常，需先在正道会盟中证明实力，方可前往讨伐。',
    storyHint: '血骨门之乱已起，正道联盟成立，先锋可往幽州方向探查敌情。'
  },
  // 可扩展其他受限地点：
  // xuanming_base: { name: '玄冥殿', requireAct: 4, hint: '...' }
};

/**
 * 检查地点是否已解锁（基于主线进度）
 * @param {string} locationId - 地点ID
 * @returns {object} { unlocked: boolean, reason: string }
 */
function checkLocationUnlocked(locationId) {
  const restriction = RESTRICTED_LOCATIONS[locationId];
  
  // 无限制，任何时候可进入
  if (!restriction) {
    return { unlocked: true };
  }
  
  // 检查 getMainQuestProgress 是否存在
  if (typeof getMainQuestProgress !== 'function') {
    console.warn('[checkLocationUnlocked] getMainQuestProgress 未定义，假设已解锁');
    return { unlocked: true };
  }
  
  const prog = getMainQuestProgress();
  
  // 检查是否已完成解锁任务
  if (restriction.unlockQuest) {
    if (prog[restriction.unlockQuest] === 'completed') {
      return { unlocked: true };
    }
  }
  
  // 检查是否满足幕次要求
  if (restriction.requireAct) {
    // 获取当前主线任务，判断当前幕次
    const currentQuest = getCurrentMainQuest ? getCurrentMainQuest() : null;
    if (currentQuest) {
      const currentAct = currentQuest.act || 1;
      if (currentAct >= restriction.requireAct) {
        return { unlocked: true };
      }
    }
    
    // 检查是否已完成前一幕（进入指定幕次）
    // 遍历当前幕次之前的任务是否全部完成
    const actToCheck = restriction.requireAct;
    let allPrevActsComplete = true;
    
    // 获取 MAIN_QUEST_CHAIN（如果存在）
    if (typeof MAIN_QUEST_CHAIN !== 'undefined') {
      for (const [questId, quest] of Object.entries(MAIN_QUEST_CHAIN)) {
        if (quest.act && quest.act < actToCheck) {
          if (prog[questId] !== 'completed') {
            // 有一个前置任务未完成，检查是否是关键前置
            // 允许跳过一些可选任务，但关键任务必须完成
            if (quest.type !== 'collect' || !questId.includes('optional')) {
              allPrevActsComplete = false;
              break;
            }
          }
        }
      }
    }
    
    if (allPrevActsComplete || (currentQuest && currentQuest.act >= actToCheck)) {
      return { unlocked: true };
    }
    
    return {
      unlocked: false,
      reason: restriction.hint,
      storyHint: restriction.storyHint
    };
  }
  
  return { unlocked: true };
}

/**
 * 获取地点访问状态（用于UI显示）
 * @param {string} locationId - 地点ID
 * @returns {string} 'unlocked' | 'locked' | 'unrestricted'
 */
function getLocationAccessStatus(locationId) {
  const restriction = RESTRICTED_LOCATIONS[locationId];
  if (!restriction) return 'unrestricted';
  
  const result = checkLocationUnlocked(locationId);
  return result.unlocked ? 'unlocked' : 'locked';
}

// ════════════════════════════════════════════════════════════════
//  武侠日历系统 - 日期推进函数（支持农历大小月）
// ════════════════════════════════════════════════════════════════

/**
 * 获取指定年份某月的天数（农历大小月）
 * 使用年份+月份作为种子，产生确定性的伪随机结果
 * @param {number} year - 年份（1=甲子年）
 * @param {number} month - 月份（1-12）
 * @returns {number} 29（小月）或 30（大月）
 */
function getLunarMonthDays(year, month) {
  if (!year || !month) return 30;
  const seed = year * 100 + month;
  const hash = ((seed * 9301 + 49297) % 233280) / 233280;
  // 腊月（12月）和正月（1月）倾向于大月
  const isBigMonth = (month === 1 || month === 12) 
    ? (hash < 0.6)  // 正月、腊月60%概率大月
    : (hash < 0.5); // 其他月份50%概率大月
  return isBigMonth ? 30 : 29;
}

/**
 * 推进武侠日历日期（支持农历大小月）
 * @param {object} edS - 玩家存档
 * @param {number} days - 推进天数
 * @returns {object} 新的日期 {year, month, day}
 */
function advanceWuxiaDate(edS, days) {
  if (!edS) return { year: 1, month: 1, day: 1 };
  
  // 确保有初始值
  if (!edS.gameYear) edS.gameYear = 1;
  if (!edS.gameMonth) edS.gameMonth = 1;
  if (!edS.gameDay) edS.gameDay = 1;
  
  let year = edS.gameYear;
  let month = edS.gameMonth;
  let day = edS.gameDay;
  
  // 推进天数
  let remainingDays = Math.max(0, days);
  
  while (remainingDays > 0) {
    const monthDays = getLunarMonthDays(year, month);
    const daysLeftInMonth = monthDays - day + 1; // 本月剩余天数（含当天）
    
    if (remainingDays < daysLeftInMonth) {
      // 还在本月内
      day += remainingDays;
      remainingDays = 0;
    } else {
      // 进入下一个月
      remainingDays -= daysLeftInMonth;
      day = 1;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
  }
  
  edS.gameYear = year;
  edS.gameMonth = month;
  edS.gameDay = day;
  
  return { year, month, day };
}

// ── 旅行状态持久化 ──
function travelSave(){
  try{
    localStorage.setItem(TRAVEL_STATE_KEY, JSON.stringify({
      city: travelCurrentCity,
      history: travelHistory,
      eventLog: travelEventLog,
      state: travelPlayerState,
    }));
  }catch(e){}
}

// 优化版本：防抖存档（300ms延迟，避免频繁写入）
const _travelSaveDebounced = (() => {
  let timer = null;
  return function() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      travelSave();
    }, 300);
  };
})();

// 立即存档（用于页面卸载前）
function travelSaveImmediate(){
  travelSave();
}
function travelLoad(){
  try{
    const raw = localStorage.getItem(TRAVEL_STATE_KEY);
    if(!raw) return;
    const d = JSON.parse(raw);
    if(d.city && WORLD_NODES[d.city]) travelCurrentCity = d.city;
    if(Array.isArray(d.history) && d.history.length) travelHistory = d.history;
    if(Array.isArray(d.eventLog)) travelEventLog = d.eventLog;
    if(d.state && typeof d.state === 'object'){
      travelPlayerState = Object.assign(travelPlayerState, d.state);
    }
  }catch(e){}
}

// ── 旅途随机事件池 ──
const TRAVEL_EVENTS = [
  // 好事
  {id:'herb',   w:15, icon:'☘', title:'采到草药',  type:'good',
   desc:'路旁发现一株珍贵药材，随手采下，兴许日后用得上。',
   fn:()=>{
     const herb = { instId:'herb_'+Date.now(), type:'consumable', templateId:'herb_wild', identified:true, affixes:[], name:'野生草药', icon:'☘', effect:{ hp:15, mp:5 } };
     if(typeof edS !== 'undefined' && edS.bag){ edS.bag.push(herb); bagSave(); }
     const scenes = [
       '山道旁的碎石缝里，一丛碧绿的药草迎风摇曳，叶片上还带着清晨的露珠。你弯腰采下，鼻端隐约有一股清苦的香气——正是常见的草药。',
       '你眼尖，远远便看见路旁有株不寻常的植物，枝叶肥厚，颜色深绿。拨开杂草细看，正是医馆里常用的药材，忙小心地连根带土掰下一截。',
       '林间光影斑驳，你无意间低头，发现脚边就长着一丛药草。也许是今日运气不错，随手采了，揣进怀里。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + '\n「☘ 获得野生草药×1，已存入背包」';
   }},
  {id:'coin',   w:20, icon:'◎', title:'拾到碎银',  type:'good',
   desc:'荒道上捡到一个钱袋，不知是何人遗落的。',
   fn:()=>{
     const newSilver = addSilver(50);
     SilverManager.save();
     const scenes = [
       '官道旁的荒草里有什么东西反光。你拨开一看，是个鼓鼓的旧钱袋，里头装着散碎银两，不多，但够用一阵子。不知是哪位旅人失落的，四顾茫茫，也无处归还。',
       '渡口的青石板缝里，有一只掉落的碎银锭。你掂了掂，约莫值个几十两。江湖上的机缘，有时就是这般莫名其妙。',
       '你在路旁老树根下歇脚时，脚尖踢到了什么硬物——是一个布包，拆开后里头是散碎银子。左右无人，你收入怀中，继续赶路。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + `\n「◎ 拾得碎银 +50两，现有：${newSilver}两」`;
   }},
  {id:'spring', w:12, icon:'≋', title:'发现山泉',  type:'good',
   desc:'清泉从山石中涌出，水质清冽甘甜，饮后精力恢复。',
   fn:()=>{
     if(typeof travelPlayerState !== 'undefined') {
       travelPlayerState.energy = Math.min(100, travelPlayerState.energy + 30);
       travelSave();
       const scenes = [
         '山道转角处，忽听潺潺水声。顺着声音走去，是一眼山泉从岩缝间涌出，清澈见底。你掬水痛饮，沁凉的泉水顺喉而下，疲惫登时去了大半。',
         '日头正毒，你已走了许久，口干舌燥。正懊恼，前方林子里传来水声。拨开枝条，一汪山泉静静流淌，泉边苔藓嫩绿。大喝几口，暑气尽散。',
         '泉水极甜，带着山间草木的清气。你不只喝，还用手帕蘸水擦了把脸，顿觉神清气爽，脚步也轻快了许多。',
       ];
       return scenes[Math.floor(Math.random()*scenes.length)] + `\n「⚡ 精力恢复 +30，当前：${travelPlayerState.energy}%」`;
     }
     return '山泉甘冽，饮后精神大振。\n「⚡ 精力恢复 +30」';
   }},
  {id:'tome',   w:5,  icon:'📜', title:'残破秘笈',  type:'great',
   desc:'路边草丛中隐约有册子，捡起细看，竟是失传武功残页！',
   fn:()=>{
     const skKeys = Object.keys(SKILL_LIB||{});
     const randSk = skKeys[Math.floor(Math.random()*skKeys.length)];
     const skArr = SKILL_LIB[randSk]||[];
     const sk = skArr[Math.floor(Math.random()*skArr.length)];
     const scenes = [
       '草丛深处，一本被雨水浸透又晒干的残册半埋在泥里。你掸去尘土，页面虽已发黄，但墨迹清晰——是武功心法。',
       '路旁古井边有只破旧的包袱，无人认领。你打开，里面垫着布帛，中间放着一本线装薄册，翻开第一页，赫然是武学要诀。',
       '山壁上一处石缝里，插着一卷已烂去大半的旧册子。你取出细读，残留的几页却字字珠玑，隐见高深武学的皮毛。',
     ];
     const skillTxt = sk ? `「${sk.name}」的心法口诀` : '某门绝学的武功残页';
     return scenes[Math.floor(Math.random()*scenes.length)] + `\n「📜 残页记载了${skillTxt}，细细参悟，或有所得」`;
   }},
  {id:'meet',   w:18, icon:'◉', title:'遇到隐士',  type:'good',
   desc:'路旁老者持杖而立，与你攀谈片刻，赠言一语令你豁然开朗。',
   fn:()=>{
     const newSilver = addSilver(30);
     travelPlayerState.energy = Math.min(100, travelPlayerState.energy + 20);
     SilverManager.save();
     const scenes = [
       '一位须发皆白的老者坐在路旁石墩上，见你走来，抬头笑道："年轻人，脚步沉了，是累了？"言谈片刻，老者起身离去，临走时塞了几枚碎银在你手心，说是"路上用"，转眼便消失在林间。',
       '山腰茶棚里，一位布衣老人独自品茶。你坐下歇脚，两人闲聊起来，老人说了几句话，平淡无奇，却让你心中某处豁然开朗。临别他硬是将茶资钱塞给你，推辞不掉，只得收下。',
       '老者手持竹杖，蹲在路旁看蚂蚁搬家，见你路过招手相唤，讲了一个短短的故事，说是年轻时在江湖上走的弯路。故事里没有大道理，却莫名让你精神一振。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + `\n「◎ 隐士赠银 +30两，⚡ 精力 +20，现有：${newSilver}两」`;
   }},
  {id:'scenery',w:25, icon:'▲', title:'见到绝景',  type:'normal',
   desc:'日落时分，远山连绵，晚霞如火，心旷神怡，烦恼顿消。',
   fn:()=>{
     travelPlayerState.energy = Math.min(100, travelPlayerState.energy + 15);
     travelPlayerState.buffs.push({id:'scenery_mp', name:'心旷神怡', value:'+5内力上限', turns:1});
     travelSave();
     const scenes = [
       '傍晚时分，你登上一处山岗歇脚，蓦然回首，只见万里晚霞将远山染成橙红一片，云霞流动如火如荼。你呆立片刻，胸中积压的烦躁不知何时已消散一空。',
       '峡谷里，一条细瀑从百丈高壁倒悬而下，水雾弥漫，阳光穿透后折出彩虹。你愣了很久，才想起继续赶路——但脚步比来时轻快了许多。',
       '林间忽然开阔，眼前是一片无边的湖面，水色如镜，远山倒映其中。这一刻什么也不想，只是站着，让风吹过来，又吹过去。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + '\n「⚡ 精力 +15，心旷神怡·内力上限+5（下次战斗生效）」';
   }},
  {id:'rumor',  w:20, icon:'?', title:'听到消息',  type:'normal',
   desc:'路边茶摊上江湖人议论纷纷，透露出一条有用情报。',
   fn:()=>{
     const rumorData=[
       { scene:'茶摊角落里，两个看起来是江湖人的汉子压低了声音说话，你竖耳一听，隐约听见：', rumor:'嵩山近日有奇人出没，手持不明神兵，来历成谜……' },
       { scene:'马车旁的老镖师边抠脚边和同伴闲聊，说话没遮拦：', rumor:'听说武当山上近来有天外陨铁落下，已被道长秘密收走，旁人问什么都不说。' },
       { scene:'路边酒摊上一个醉汉嘴不把门，嚷嚷道：', rumor:'日月神教在暗中大肆招募高手，给的银子多得吓人，不知图什么……' },
       { scene:'一位走货的商人凑过来，神秘兮兮地压低声音：', rumor:'唐门新炼了一种奇毒，中毒者三日内必死，解药只有唐门自己有，价格高得离谱。你可要小心。' },
       { scene:'茶摊掌柜擦桌子时随口说道：', rumor:'桃花岛黄老邪出关了，听说性情大变，连岛上的人都不认识似的，也不知出了什么事。' },
       { scene:'一个游方和尚与你同桌吃茶，欲言又止，最终还是说了：', rumor:'少林寺后院最近半夜时常传出异响，但武僧们对此讳莫如深，谁也不肯说。' },
       { scene:'风尘仆仆的信使从你身旁飞驰而过，只丢下一句话：', rumor:'朝廷要在各地关口加强盘查，据说是在追缉什么人，你若有通缉在身，近期最好绕行。' },
     ];
     const r = rumorData[Math.floor(Math.random()*rumorData.length)];
     return `${r.scene}\n"${r.rumor}"\n「? 获得江湖情报一条」`;
   }},
  {id:'animal', w:10, icon:'≈', title:'遇到灵兽',  type:'good',
   desc:'一只通灵狐狸从林中跑出，盯着你片刻后转身离去，似有深意。',
   fn:()=>{
     travelPlayerState.buffs.push({id:'animal_crit', name:'祥瑞之气', value:'+5%暴击率', turns:1});
     travelSave();
     const scenes = [
       '林间忽然一静，一只雪白的狐狸从草丛间钻出，就那样站在你面前，一动不动地凝视你，眸子清亮得不像野物。你屏气对视片刻，它转身，消失在林间深处，好像留下了什么，又好像什么都没有。',
       '山道旁一株老松的树洞边，盘踞着一条通体翠绿的小蛇，头顶隐约有一点红斑。它昂起脑袋望着你，吐了吐信子，而后缓缓退回树洞。不知为何，你感到一阵轻松。',
       '暮色将至，一只金毛猿猴从高处跃下，在你跟前翻了个跟斗，又一跳窜上枝头，嬉笑而去。江湖人说这是好兆头，今日应当顺遂。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + '\n「≈ 获得"祥瑞之气"·暴击率+5%（下次战斗生效）」';
   }},
  // 坏事
  {id:'bandit', w:18, icon:'⚔', title:'路遇劫匪',  type:'bad',
   desc:'几个蒙面人从路旁窜出，拦路喊道："此路是我开，此树是我栽！"',
   fn:()=>{
     const terrain = _travelCurrentTerrain || '平原';
     const playerLv = typeof edS !== 'undefined' ? (edS.level||1) : 1;
     return _triggerWildEncounter(terrain, playerLv, 'bandit');
   }},
  {id:'rain',   w:15, icon:'≈', title:'突降大雨',  type:'bad',
   desc:'天公不作美，突降暴雨，道路泥泞，行速减缓，精力消耗加倍。',
   fn:()=>{
     travelPlayerState.energy = Math.max(0, travelPlayerState.energy - 20);
     travelSave();
     const scenes = [
       '晴空毫无预兆地暗了下来，旋即豆大的雨点劈头盖脸砸下。你在山路上无处可躲，只能低头硬冲，靴子很快灌满了泥水，每一步都走得格外费力。',
       '雨来得又急又猛，天地间一片灰白。你在檐下缩了好一会儿，雨势才略小，赶路重新出发时，已是精疲力竭。',
       '泥泞的路面滑得厉害，你踩空一脚，险些摔进旁边的沟里，扶着路旁荆棘才稳住身形。这一段路，走得狼狈极了。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + `\n「⚡ 雨路难行，精力 -20，当前：${travelPlayerState.energy}%」`;
   }},
  {id:'lost',   w:10, icon:'▦', title:'迷失路途',  type:'bad',
   desc:'浓雾弥漫，分不清方向，在山中转了半天才找对方向。',
   fn:()=>{
     travelPlayerState.energy = Math.max(0, travelPlayerState.energy - 15);
     travelSave();
     const scenes = [
       '山间浓雾骤然弥漫，三步之外便是一片白茫茫。你凭着感觉走，越走越觉得不对，绕了许久，发现竟然转回了原处。等雾散之时，日头已偏西许多。',
       '岔路口的路牌不知何时倒了，你跟着模糊的印象走了许久，才发现方向完全走偏。折返重走，腿脚又酸又沉。',
       '天黑之前本该走完这段路，但林子里的小道七转八弯，你走了好几回头路，狼狈地摸黑前行，到了驻脚处时已是全身乏力。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + `\n「⚡ 迷路耗力，精力 -15，当前：${travelPlayerState.energy}%」`;
   }},
  {id:'trap',   w:8,  icon:'✖', title:'踩中陷阱',  type:'bad',
   desc:'机关陷阱从地下弹出，若非反应迅速，后果不堪设想，受了轻伤。',
   fn:()=>{
     travelPlayerState.hp = Math.max(10, travelPlayerState.hp - 15);
     travelSave();
     const scenes = [
       '脚下一声轻响，你本能地侧身跳开——一枚铁夹从草丛中弹出，擦过小腿，留下一道血痕。幸亏反应快，否则这一下废了半条腿也说不准。究竟是谁设下这般毒机关……',
       '小径上有处异样，你稍迟了一步才察觉。绊索弹起，一排竹刺扫来，你急忙翻滚闪避，仍是被蹭了一下，胸口渗出血来。所幸只是皮外伤，撕下布帛裹住，继续上路。',
       '一块踏石微微松动，你踩上去的瞬间，地下机括启动，沙坑从脚下崩开。你手忙脚乱地攀住旁边树根才没有陷进去，爬上来时手掌划破，血迹斑斑。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + `\n「♥ 陷阱轻伤，气血 -15%，当前：${travelPlayerState.hp}%」`;
   }},
  {id:'toll',   w:12, icon:'◎', title:'遭遇盘剥',  type:'bad',
   desc:'地方恶霸设卡收路费，不交不让过，只得破财消灾。',
   fn:()=>{
     const loss = Math.min(SilverManager.get(), 20);
     SilverManager.add(-loss);
     SilverManager.save();
     const scenes = [
       '前方路口立着一根横木，旁边几个地痞懒洋洋地靠着，见你来了，为首的伸出手："过路费，规矩。"你打量了一眼这群人的数目和架势，想了想，掏钱。',
       '"官道修缮费，人人都交。"那收钱的汉子理直气壮，背后有一群闲汉支应，你与他们纠缠不值当，破财消灾，快些赶路要紧。',
       '路卡上的人收完钱，懒得多看你一眼，挥手让路。你捏着剩下的银两，心里窝着一口气，暗记此地，来日有机会再说。',
     ];
     return scenes[Math.floor(Math.random()*scenes.length)] + `\n「◎ 破财 -${loss}两，剩余：${SilverManager.get()}两」`;
   }},
  {id:'beast',  w:8,  icon:'▓', title:'野兽袭击',  type:'bad',
   desc:'山林中突然传来一声低沉的嚎叫，猛兽从草丛中一跃而出！',
   fn:()=>{
     const terrain = _travelCurrentTerrain || '山地';
     const playerLv = typeof edS !== 'undefined' ? (edS.level||1) : 1;
     return _triggerWildEncounter(terrain, playerLv, 'beast');
   }},
];

// ── 当前旅途地形（由 journeyStart 更新）──
let _travelCurrentTerrain = '平原';

// ════════════════════════════════════════════════════
//  野外遭遇战系统
//  当旅途事件触发 bandit/beast 时调用
//  弹出遭遇弹窗，玩家可选择：迎战 / 逃跑 / 贿赂（仅强盗）
// ════════════════════════════════════════════════════

/**
 * 触发野外遭遇事件
 * @param {string} terrain  当前地形
 * @param {number} playerLv 玩家等级
 * @param {string} [forceType] 强制指定敌人类型
 * @returns {string} 事件结果描述（用于事件日志）
 */
function _triggerWildEncounter(terrain, playerLv, forceType){
  if(typeof pickRandomEnemy === 'undefined' || typeof ENEMY_DB === 'undefined'){
    // 降级处理：仍用旧逻辑
    if(forceType === 'beast'){
      travelPlayerState.hp = Math.max(10, travelPlayerState.hp - 10);
      travelPlayerState.energy = Math.max(0, travelPlayerState.energy - 10);
      travelSave();
      return `搏斗受伤，气血-10%，精力-10`;
    } else {
      const loss = Math.min(SilverManager.get(), Math.floor(10 + Math.random()*30));
      SilverManager.add(-loss);
      SilverManager.save();
      return `遭劫损失${loss}两银子！`;
    }
  }

  const enemy = forceType
    ? (()=>{
        const candidates = Object.values(ENEMY_DB).filter(e =>
          e.type === forceType &&
          playerLv >= (e.minLevel||1) &&
          (!e.terrain || e.terrain.includes(terrain)) &&
          e.tier !== 'elite'
        );
        if(!candidates.length) return pickRandomEnemy(terrain, playerLv);
        return candidates[Math.floor(Math.random()*candidates.length)];
      })()
    : pickRandomEnemy(terrain, playerLv);

  if(!enemy) return '四下打量，未发现威胁，虚惊一场。';

  const scaled = (typeof scaleEnemy === 'function') ? scaleEnemy(enemy, playerLv) : enemy;
  _showWildEncounterModal(scaled, terrain);
  return `⚔ 遭遇 ${enemy.name}！（战斗弹窗已弹出）`;
}

/**
 * 显示野外遭遇弹窗
 * 选项：迎战（进入正式战斗）/ 逃跑（消耗精力概率逃）/ 贿赂（仅强盗/刺客，花银子）
 */
function _showWildEncounterModal(enemy, terrain){
  // 移除旧弹窗
  document.querySelectorAll('.wild-encounter-modal').forEach(el=>el.remove());

  const playerLv  = typeof edS !== 'undefined' ? (edS.level||1) : 1;
  const escapePct = Math.min(80, 30 + playerLv * 1.5);  // 逃跑概率
  const isBandit  = ['bandit','assassin','evil'].includes(enemy.type);
  const bribeAmt  = isBandit ? Math.min(200, Math.max(20, Math.round(enemy.silver * 2 + enemy.level * 3))) : 0;
  const canBribe  = isBandit && SilverManager.has(bribeAmt);

  const modal = document.createElement('div');
  modal.className = 'wild-encounter-modal';
  modal.innerHTML = `
    <div class="wild-enc-box">
      <div class="wild-enc-header">
        <span class="wild-enc-type-tag ${enemy.type}">${
          {beast:'猛兽',bandit:'强盗',evil:'邪道',assassin:'刺客',ghost:'邪灵',boss:'BOSS'}[enemy.type]||'敌人'
        }</span>
        <span class="wild-enc-level">Lv.${enemy.level}</span>
      </div>
      <div class="wild-enc-avatar"><pre>${enemy.stand||enemy.icon}</pre></div>
      <div class="wild-enc-name">${enemy.icon} ${enemy.name}</div>
      <div class="wild-enc-desc">${enemy.desc}</div>
      <div class="wild-enc-stats">
        ♥ ${enemy.hp} &nbsp; ⚔ ${enemy.atk} &nbsp; ▓ ${enemy.def} &nbsp; ⚡ ${enemy.spd}
      </div>
      <div class="wild-enc-btns">
        <button class="wild-btn wild-btn-fight" onclick="_wildFight('${enemy.id}')">
          ⚔ 迎战
        </button>
        <button class="wild-btn wild-btn-escape" onclick="_wildEscape(${escapePct})">
          » 逃跑 <span style="color:rgba(200,220,160,.6);font-size:10px">${escapePct}%</span>
        </button>
        ${isBandit ? `<button class="wild-btn wild-btn-bribe ${canBribe?'':'disabled'}"
          onclick="_wildBribe(${bribeAmt})" ${canBribe?'':'disabled'}
          title="${canBribe?'花银子打发他们':'银两不足'}">
          ◎ 贿赂 <span style="color:rgba(220,200,120,.6);font-size:10px">${bribeAmt}两</span>
        </button>` : ''}
      </div>
    </div>`;
  document.body.appendChild(modal);
  _curWildEnemy = enemy;
}

// 当前野外遭遇的敌人（临时存储）
let _curWildEnemy = null;

/** 迎战：把野外敌人转换成战斗场景 */
function _wildFight(enemyId){
  document.querySelectorAll('.wild-encounter-modal').forEach(el=>el.remove());
  const enemy = _curWildEnemy;
  if(!enemy) return;

  // 构造与 CHARS 格式兼容的战斗对象
  const player = typeof LH !== 'undefined' ? LH : null;
  if(!player){ showToast('战斗系统未就绪'); return; }

  // 构造敌人战斗角色
  const enemyChar = {
    id:        enemy.id,
    name:      enemy.name,
    stand:     enemy.stand || enemy.icon,
    level:     enemy.level,
    totalHp:   enemy.hp,
    totalAtk:  enemy.atk,
    totalDef:  enemy.def,
    totalSpd:  enemy.spd,
    totalMp:   enemy.mp || 0,
    totalCrit: 5,
    totalDodge:5,
    skills:    enemy.skills || [],
    _isWildEnemy: true,
    _enemyData:   enemy,
  };

  // 临时切换战斗场景
  if(typeof startWildBattle === 'function'){
    startWildBattle(player, enemyChar, _onWildBattleEnd);
  } else {
    // 降级：用旧战斗弹窗
    showToast(`与 ${enemy.name} 交战！`);
    travelPlayerState.hp = Math.max(10, travelPlayerState.hp - Math.round(enemy.atk * 0.4));
    travelSave();
  }
}

/** 逃跑 */
function _wildEscape(pct){
  document.querySelectorAll('.wild-encounter-modal').forEach(el=>el.remove());
  const success = Math.random()*100 < pct;
  if(success){
    travelPlayerState.energy = Math.max(0, travelPlayerState.energy - 15);
    travelSave();
    showToast('» 趁乱逃脱！精力-15。');
  } else {
    // 逃跑失败：被打了一下（hp 为百分比制，dmg 需转为百分比）
    const enemy = _curWildEnemy;
    // 【修复】dmg 转为百分比（约 enemy.atk 的50%换算为hp%损失，上限20%）
    const dmgPct = enemy ? Math.min(20, Math.round(enemy.atk * 0.05)) : 8;
    travelPlayerState.hp = Math.max(5, travelPlayerState.hp - dmgPct);
    travelPlayerState.energy = Math.max(0, travelPlayerState.energy - 20);
    travelSave();
    showToast(`逃跑失败！被打了一下，气血-${dmg}%，精力-20。`);
  }
  _curWildEnemy = null;
}

/** 贿赂（仅强盗类） */
function _wildBribe(amount){
  document.querySelectorAll('.wild-encounter-modal').forEach(el=>el.remove());
  if(!SilverManager.has(amount)){
    showToast('银两不足，无法贿赂！');
    return;
  }
  SilverManager.add(-amount);
  SilverManager.save();
  const lines = [
    '对方接过银子，一挥手：「爷今天高兴，走吧。」',
    '那头目掂了掂钱袋：「识相！下次路过还得交！」',
    '几个强盗数完钱，哄笑着让开了路。',
    '对方拿了银子就走，也不废话。',
  ];
  showToast(`◎ 破财消灾！花出${amount}两，平安通过。${lines[Math.floor(Math.random()*lines.length)]}`);
  _curWildEnemy = null;
}

/** 野外战斗结束回调 */
function _onWildBattleEnd(playerWon){
  const savedEnemy = _curWildEnemy;  // 先保存引用，再清空
  _curWildEnemy = null;

  if(playerWon){
    const enemy = savedEnemy;
    if(enemy){
      const exp = Math.round(enemy.level * 8 + enemy.hp * 0.1);
      const silver = Math.round(enemy.level * 3 + enemy.atk * 0.5);
      
      SilverManager.add(silver);
      if(typeof addPlayerExp === 'function'){
        addPlayerExp(exp, '江湖奇遇');
      }

      // ── 材料掉落 → 注入合成背包 ──
      const dropList = enemy.drops || [];
      let matMsgs = [];
      if(dropList.length > 0 && typeof injectDropToCraftBag === 'function'){
        dropList.forEach(drop=>{
          if(!drop.id || !drop.chance) return;
          if(Math.random() <= drop.chance){
            const qty = (drop.minQty||1) + Math.floor(Math.random()*(Math.max(1,(drop.maxQty||1)-(drop.minQty||1)+1)));
            const meta = (typeof ENEMY_DROP_ITEMS!=='undefined') ? ENEMY_DROP_ITEMS[drop.id] : null;
            injectDropToCraftBag(drop.id, qty, meta);
            matMsgs.push(`${meta?.icon||'◆'}${meta?.name||drop.id}×${qty}`);
          }
        });
      }

      const matNote = matMsgs.length > 0 ? `  ☐ ${matMsgs.join(' ')}` : '';
      showToast(`★ 战胜！获得经验${exp}，银两${silver}两${matNote}`);
      travelSave();

      // ── 战后余韵独白（延迟弹出，不遮盖战斗结算）──
      setTimeout(()=>{ _showBattleAftermath(true, enemy); }, 600);
    }
  } else {
    // 战败：损失银两和气血
    const lossSilver = Math.min(SilverManager.get(), Math.round(SilverManager.get() * 0.2));
    SilverManager.add(-lossSilver);
    travelPlayerState.hp = Math.max(10, travelPlayerState.hp - 30);
    showToast(`✖ 战败！损失银两${lossSilver}两，气血-30%`);
    if (typeof playAudio === 'function') playAudio('death');
    travelSave();

    // ── 战败余韵独白 ──
    setTimeout(()=>{ _showBattleAftermath(false, savedEnemy); }, 600);
  }
  
  // 返回旅行界面
  if(typeof showPage === 'function'){
    showPage('travel');
  }
}

// ── 野外遭遇战弹窗样式（动态注入）──
(function injectWildEncounterStyles(){
  if(document.getElementById('wild-enc-styles')) return;
  const s = document.createElement('style');
  s.id = 'wild-enc-styles';
  s.textContent = `
  .wild-encounter-modal {
    position:fixed; inset:0; z-index:9800;
    background:rgba(0,0,0,.75);
    display:flex; align-items:center; justify-content:center;
    animation: fadeIn .3s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .wild-enc-box {
    background:linear-gradient(160deg, rgba(20,15,10,.98), rgba(40,20,10,.95));
    border:1px solid rgba(200,120,40,.35);
    border-radius:12px; padding:20px 24px; width:300px; max-width:92vw;
    text-align:center; box-shadow:0 8px 32px rgba(0,0,0,.6);
  }
  .wild-enc-header { display:flex; justify-content:space-between; margin-bottom:10px; }
  .wild-enc-type-tag {
    font-size:10px; padding:2px 8px; border-radius:20px;
    background:rgba(180,60,40,.3); color:rgba(255,140,80,1);
    border:1px solid rgba(200,80,40,.3);
  }
  .wild-enc-type-tag.beast   { background:rgba(60,120,40,.3); color:rgba(120,220,80,1); border-color:rgba(80,160,40,.3); }
  .wild-enc-type-tag.bandit  { background:rgba(160,80,20,.3); color:rgba(255,160,60,1); border-color:rgba(200,100,30,.3); }
  .wild-enc-type-tag.evil    { background:rgba(100,20,120,.3); color:rgba(200,80,255,1); border-color:rgba(140,40,180,.3); }
  .wild-enc-type-tag.assassin{ background:rgba(20,20,60,.3); color:rgba(100,140,255,1); border-color:rgba(40,60,180,.3); }
  .wild-enc-level { font-size:11px; color:rgba(200,180,120,.7); }
  .wild-enc-avatar pre {
    font-size:14px; line-height:1.6; color:rgba(230,200,140,.85);
    background:rgba(0,0,0,.3); border-radius:6px; padding:8px; margin:0 0 8px 0;
    font-family:monospace; white-space:pre;
  }
  .wild-enc-name { font-size:16px; font-weight:bold; color:rgba(255,200,100,.9); margin-bottom:6px; }
  .wild-enc-desc { font-size:11px; color:rgba(180,200,160,.6); margin-bottom:10px; line-height:1.6; }
  .wild-enc-stats { font-size:11px; color:rgba(180,220,180,.5); margin-bottom:14px; }
  .wild-enc-btns  { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
  .wild-btn {
    padding:7px 14px; border-radius:6px; border:1px solid;
    cursor:pointer; font-size:12px; font-family:inherit;
    transition:opacity .15s;
  }
  .wild-btn:hover:not(.disabled) { opacity:.8; }
  .wild-btn-fight   { background:rgba(200,60,40,.2); border-color:rgba(220,80,40,.4); color:rgba(255,140,80,1); }
  .wild-btn-escape  { background:rgba(40,80,160,.2); border-color:rgba(60,120,200,.3); color:rgba(120,180,255,1); }
  .wild-btn-bribe   { background:rgba(160,120,20,.2); border-color:rgba(200,160,40,.3); color:rgba(255,220,80,1); }
  .wild-btn.disabled{ opacity:.35; cursor:not-allowed; }
  `;
  document.head.appendChild(s);
})();

// ════════════════════════════════════════════════════════
//  战后余韵独白  _showBattleAftermath(won, enemy)
//  野外战斗结束后，延迟弹出一条沉浸式独白，点击消失
// ════════════════════════════════════════════════════════
function _showBattleAftermath(won, enemy){
  const line = _pickAftermathLine(won, enemy);
  if(!line) return;
  document.querySelectorAll('.battle-aftermath-toast').forEach(el=>el.remove());
  const el = document.createElement('div');
  el.className = 'battle-aftermath-toast';
  el.innerHTML = `<span class="bat-text">${line}</span>`;
  document.body.appendChild(el);
  const dismiss = ()=>{ el.classList.add('bat-fade-out'); setTimeout(()=>el.remove(), 400); };
  el.addEventListener('click', dismiss);
  setTimeout(dismiss, 4200);
}

function _pickAftermathLine(won, enemy){
  const etype = enemy?.type || '';
  if(won){
    const byType = {
      beast: [
        '拍去衣上的血污，继续上路。在这片山林里，今日不是猎人，便是猎物。',
        '喘了几口气，看着倒下的猛兽，心里有什么东西微微松动——是杀戮，还是侥幸？',
        '伤口不重，但心跳半天还没平静下来。这就是江湖，每一刻都是真实的。',
      ],
      bandit: [
        '拍去尘土，看了眼狼狈逃窜的残兵，哼了一声，继续赶路。',
        '这帮人也算是江湖上的角色，只是遇上了你这个更难啃的硬骨头。',
        '赢了。没什么好高兴的，路还长，前头不知道还有多少这样的事。',
        '收起架势，看看四周，一片寂静。方才那番厮杀，仿佛已是很久以前的事。',
      ],
      evil: [
        '邪道中人，命也是命。但今日站着的是你，所以没什么好说的。',
        '他倒下前说了一句话，你没有听清，也不打算去想那是什么意思。',
        '扫了眼地上的人，转身离去。江湖就是这样——输的人没有机会说话。',
      ],
      assassin: [
        '背后有人。这个念头以后大概会时常萦绕——不知道这次是谁派来的。',
        '刺客训练有素，若不是你走了运……算了，活着就好。往后得更小心才行。',
        '这个人不说话，死也不说。是专业，还是已经不在乎了？',
      ],
    };
    const typeLines = byType[etype] || [
      '拍去尘土，继续上路。江湖就是这样——今天你赢，明天说不定……',
      '对手倒下，你站着。这没什么好说的，但胸口的心跳还在提醒你，这是真实的。',
      '收起姿势，深呼一口气。有些事，打过了才知道自己原来还行。',
      '一场短暂的厮杀，换来片刻的安静。继续走。',
    ];
    return typeLines[Math.floor(Math.random()*typeLines.length)];
  } else {
    const defeatLines = {
      beast: [
        '从地上爬起来，身上伤口仍在渗血。猛兽已经走了，留下一片狼藉。你庆幸自己活着，然后开始思考为什么输了。',
        '疼。真的很疼。但这就是代价——下次，要么更强，要么更聪明。',
      ],
      bandit: [
        '银两没了，脸也没了。扶着路边树喘气，暗暗咬牙：记住今天这个教训。',
        '被人劫了，这说明你还不够让人忌惮。往后要变得让人不敢动才行。',
        '输得不冤，对方人多，你分神了，也大意了。记着，再来一次。',
      ],
    };
    const lines = defeatLines[etype] || [
      '扶着路旁石墩喘息，血慢慢渗出来，染湿了衣角。你没死，这是今天唯一的好消息。',
      '输了。没什么好说的——这条路上比你强的人多的是，得承认这一点。',
      '趁对方没有赶尽杀绝，你撑起身子走开了。往后的路，要走得更稳才行。',
      '身上每一处疼痛都是在提醒你：还差得远。但差得远，才有进步的余地。',
    ];
    return lines[Math.floor(Math.random()*lines.length)];
  }
}

// 战后独白弹窗样式
(function injectAftermathStyles(){
  if(document.getElementById('aftermath-styles')) return;
  const s = document.createElement('style');
  s.id = 'aftermath-styles';
  s.textContent = `
  .battle-aftermath-toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 320px;
    width: 88vw;
    z-index: 9500;
    pointer-events: auto;
    cursor: pointer;
    animation: bat-in .4s cubic-bezier(.2,.8,.4,1) both;
  }
  @keyframes bat-in { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .bat-fade-out { animation: bat-out .35s ease forwards !important; }
  @keyframes bat-out { to{opacity:0;transform:translateX(-50%) translateY(8px)} }
  .bat-text {
    display: block;
    background: rgba(10,8,5,.88);
    border: 1px solid rgba(180,140,60,.25);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: rgba(200,185,150,.75);
    line-height: 1.75;
    font-style: italic;
    text-align: left;
    box-shadow: 0 4px 20px rgba(0,0,0,.5);
  }
  `;
  document.head.appendChild(s);
})();

// ════════════════════════════════════════════════════════════════
//  地形专属旅途事件池
//  按地形标签分类，旅行时混入通用池一起抽取
// ════════════════════════════════════════════════════════════════

const TERRAIN_EVENTS = {

  // ── 北方草原 ──
  grassland: [
    { id:'steppe_eagle', w:12, icon:'🦅', title:'草原神鹰', type:'great',
      desc:'一只巨鹰从天而降，在你面前盘旋，带来北方的气息。',
      fn:()=>{ jhAddFame(15,0); travelPlayerState.energy=Math.min(100,travelPlayerState.energy+20); travelSave(); return '草原神鹰赐福！精力+20，声名+15。'; }},
    { id:'steppe_horde', w:15, icon:'🐎', title:'骑兵劫道', type:'bad',
      desc:'一队草原骑兵拦住去路，马蹄声如雷，领头的粗声粗气地要"过路费"。',
      fn:()=>{ return _triggerWildEncounter('草原', typeof edS!=='undefined'?edS.level||1:1, 'bandit'); }},
    { id:'steppe_merchant', w:14, icon:'🐪', title:'遇到马队', type:'good',
      desc:'一支往来草原与中原的商队，卖着皮毛、骏马和西域香料。',
      fn:()=>{ SilverManager.add(30); SilverManager.save(); return '从商队以低价购入皮货，转手可得30两。'; }},
    { id:'steppe_storm', w:10, icon:'⛈️', title:'草原雷暴', type:'bad',
      desc:'大风卷起飞沙走石，电闪雷鸣。牵马躲入低谷，蜷缩一夜。',
      fn:()=>{ travelPlayerState.energy=Math.max(0,travelPlayerState.energy-25); travelSave(); return '熬过风雨，天明才敢上路。精力-25。'; }},
    { id:'steppe_wolf', w:12, icon:'🐺', title:'群狼出没', type:'bad',
      desc:'黄昏草原上，四五头饿狼悄悄逼近，眼中是绿莹莹的寒光。',
      fn:()=>{ return _triggerWildEncounter('草原', typeof edS!=='undefined'?edS.level||1:1, 'beast'); }},
    { id:'steppe_bones', w:8, icon:'💀', title:'战场遗骨', type:'normal',
      desc:'荒草中散落着一堆人骨和破碎兵器，不知是哪场战事留下的。',
      fn:()=>{ const finds=['锈剑一把（还能用）','残破的护甲片','一枚奇怪的铁牌','几枚铜钱']; return '在遗骨间找到：'+finds[Math.floor(Math.random()*finds.length)]; }},
    { id:'steppe_rendezvous', w:8, icon:'🐺', title:'铁木真烈的使者', type:'great',
      desc:'草原上一名骑士飞驰而来，带着铁木真烈部落的标记，似有要事相托。',
      fn:()=>{ if(typeof jianghuState!=='undefined'&&jianghuState.mainFlags?.steppe_alliance){ jhAddFame(20,0); return '铁木真烈使者带来礼物，声名+20（草原联盟红利）。'; } return '骑士错认了人，礼貌告别。'; }},
  ],

  // ── 西域大漠 ──
  desert: [
    { id:'desert_oasis', w:15, icon:'🌴', title:'发现绿洲', type:'great',
      desc:'连绵黄沙中，一片绿洲如梦境般出现，清泉、椰枣、凉阴——沙漠旅人的天堂。',
      fn:()=>{ travelPlayerState.energy=100; travelPlayerState.hp=Math.min(100,travelPlayerState.hp+20); travelSave(); return '绿洲中休息一夜！精力全满，气血+20%。'; }},
    { id:'desert_caravan', w:14, icon:'🐪', title:'遇见驼队', type:'good',
      desc:'一支满载丝绸、香料的驼队正在艰难前行，领队看见你，热情地邀请同行互保。',
      fn:()=>{ SilverManager.add(50); SilverManager.save(); return '与驼队同行，帮他们驱走小股劫匪，得谢礼50两。'; }},
    { id:'desert_sandstorm', w:12, icon:'🌪️', title:'沙尘暴', type:'bad',
      desc:'天色骤变，滚滚黄沙铺天盖地而来，遮天蔽日，飞沙走石割人皮肤。',
      fn:()=>{ travelPlayerState.energy=Math.max(0,travelPlayerState.energy-30); travelPlayerState.hp=Math.max(5,travelPlayerState.hp-10); travelSave(); return '沙暴中挣扎生还！精力-30，气血-10%。'; }},
    { id:'desert_mirage', w:10, icon:'✨', title:'海市蜃楼', type:'normal',
      desc:'远处出现亭台楼阁，走近却消失无踪。大漠中的幻境扰乱了你的心神，却也带来一种奇异的宁静。',
      fn:()=>{ travelPlayerState.buffs=travelPlayerState.buffs||[]; travelPlayerState.buffs.push({id:'mirage_clarity',name:'蜃楼顿悟',value:'+10内力',turns:2}); travelSave(); return '在幻境中顿悟，内力上限+10（2场战斗有效）。'; }},
    { id:'desert_bandit', w:13, icon:'⚔', title:'沙匪截道', type:'bad',
      desc:'几个蒙面沙匪从沙丘后跃出，他们熟悉大漠地形，来去如风。',
      fn:()=>{ return _triggerWildEncounter('沙漠', typeof edS!=='undefined'?edS.level||1:1, 'bandit'); }},
    { id:'desert_relic', w:8, icon:'🏺', title:'古驿遗址', type:'great',
      desc:'沙土中露出一段古城墙，这里曾是丝路繁华之地。在废墟间翻找，有意外之喜。',
      fn:()=>{ const items=['波斯钱币（收藏品）','残破陶瓶（收藏品）','一块奇怪的石刻','锈迹斑斑的短刀']; if(typeof edS!=='undefined'&&edS.bag){ edS.bag.push({instId:'relic_'+Date.now(),type:'collectible',templateId:'antique_fragment',name:items[Math.floor(Math.random()*items.length)],icon:'🏺',identified:true,affixes:[]}); if(typeof bagSave==='function') bagSave(); } return '在废墟中发现文物，已存入背包。'; }},
    { id:'desert_shahar', w:6, icon:'🏜️', title:'沙哈尔的飞刀课', type:'great',
      desc:'竟然在沙漠中遇上大漠飞刀沙哈尔！他正在练刀，见到你，朗声大笑，说要指点你一式。',
      fn:()=>{ if(typeof jhChangeRel==='function') jhChangeRel('npc_shahar',10,'沙漠奇遇'); jhAddFame(20,0); return '沙哈尔传授飞刀发力秘诀！声名+20，与沙哈尔好感+10。'; }},
  ],

  // ── 江南水乡 ──
  water: [
    { id:'water_fisherman', w:15, icon:'🎣', title:'渔家慷慨', type:'good',
      desc:'水边一户渔家见你风尘仆仆，邀你入屋，奉上鲜鱼热粥，热情难却。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+30); travelSave(); return '一顿热饭下肚，精力+30，心头暖意融融。'; }},
    { id:'water_boat', w:12, icon:'⛵', title:'顺水行舟', type:'good',
      desc:'一艘商船顺水而下，船家顺路捎你一程，省了大半路程的劳累。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+20); SilverManager.add(15); SilverManager.save(); return '搭乘商船，精力+20。帮忙拉了会儿绳，得谢钱15两。'; }},
    { id:'water_lantern', w:10, icon:'🏮', title:'江灯夜景', type:'great',
      desc:'夜行江边，江面上漂浮着无数河灯，水光粼粼，令人心旷神怡，思绪豁然。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+15); travelPlayerState.buffs=travelPlayerState.buffs||[]; travelPlayerState.buffs.push({id:'water_insight',name:'水月悟道',value:'+5%内力恢复',turns:2}); travelSave(); return '江灯倒影中顿悟，精力+15，内力恢复+5%（2场战斗）。'; }},
    { id:'water_pirates', w:14, icon:'⚓', title:'水贼出没', type:'bad',
      desc:'渡口附近的水贼惯会拦截过路客，几个汉子持刀逼上来，口中嚷着交买路钱。',
      fn:()=>{ return _triggerWildEncounter('水乡', typeof edS!=='undefined'?edS.level||1:1, 'bandit'); }},
    { id:'water_vendor', w:12, icon:'🍵', title:'茶摊见闻', type:'normal',
      desc:'水边茶摊，几个当地人喝茶闲聊，谈到最近一桩怪事——邻县有个员外家凭空少了一样东西……',
      fn:()=>{ const gossips=['那员外的镇宅宝物不见了，雇了好几个侠客来查。','听说这条水道上最近常有隐形小船，半夜无声无息经过。','茶摊老板说，他见过一个白发老人，一口气喝了十斤酒还没醉。','江南道上出现了一个蒙面人，专打土豪分钱给穷人。']; return '茶摊八卦：'+gossips[Math.floor(Math.random()*gossips.length)]; }},
    { id:'water_brotherly', w:8, icon:'🌊', title:'落水救人', type:'great',
      desc:'前方有人落水呼救！来不及多想，你纵身跳入江中，将人拉上岸。',
      fn:()=>{ travelPlayerState.energy=Math.max(0,travelPlayerState.energy-15); if(typeof jhAddFame==='function') jhAddFame(30,20); travelSave(); return '救人一命，精力-15（受凉了），侠义+20，声名+30！'; }},
    { id:'water_jiangnan_beauty', w:8, icon:'🌸', title:'江南名胜', type:'normal',
      desc:'西湖断桥、苏州园林……江南美景胜过任何人间仙境，移步换景，令人流连忘返。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+20); travelSave(); return '江南美景洗涤心灵，精力+20，旅途愉快。'; }},
  ],

  // ── 北方山地/边关 ──
  mountain: [
    { id:'mtn_hermit', w:10, icon:'🧙', title:'山中隐者', type:'great',
      desc:'云雾中一座茅屋，门口一位白发老者正在弈棋。见你路过，捻须一笑，邀你对弈一局。',
      fn:()=>{ if(typeof jhAddFame==='function') jhAddFame(25,8); travelPlayerState.energy=Math.min(100,travelPlayerState.energy+15); travelSave(); return '与隐者对弈，谈及武学与人生。声名+25，精力+15，感悟颇深。'; }},
    { id:'mtn_avalanche', w:8, icon:'⛰️', title:'山崩预兆', type:'bad',
      desc:'山上传来轰隆声响，碎石滚落，你和坐骑险些被砸中，拼命奔逃。',
      fn:()=>{ travelPlayerState.hp=Math.max(5,travelPlayerState.hp-15); travelPlayerState.energy=Math.max(0,travelPlayerState.energy-20); travelSave(); return '死里逃生！气血-15%，精力-20。心跳良久不能平静。'; }},
    { id:'mtn_rare_herb', w:12, icon:'🌿', title:'发现珍药', type:'great',
      desc:'悬崖峭壁上，一株生长了百年的灵药在风中摇曳，采摘时险些坠崖。',
      fn:()=>{ if(typeof edS!=='undefined'&&edS.bag){ edS.bag.push({instId:'rareherb_'+Date.now(),type:'consumable',templateId:'tianshan_herb',name:'天山雪莲',icon:'❄️',identified:true,affixes:[],effect:{ hp:60, mp:40 }}); if(typeof bagSave==='function') bagSave(); } return '采得天山雪莲×1！珍贵药材，可炼制疗伤圣药。'; }},
    { id:'mtn_bandit_lair', w:12, icon:'⚔', title:'山贼巢穴', type:'bad',
      desc:'山路转角处，十数名山贼持兵器而立，摆出一副不交钱不放行的架势。',
      fn:()=>{ return _triggerWildEncounter('山地', typeof edS!=='undefined'?edS.level||1:1, 'bandit'); }},
    { id:'mtn_view', w:15, icon:'🏔️', title:'绝顶望远', type:'normal',
      desc:'登上山巅，极目远眺，千里江山尽收眼底。天大地大，人不过草芥，心胸反而开阔。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+10); if(typeof jhAddFame==='function') jhAddFame(5,3); travelSave(); return '望远开怀，精力+10，侠义+3，声名微增。'; }},
    { id:'mtn_ancient_sword', w:5, icon:'⚔️', title:'石中之剑', type:'great',
      desc:'悬崖石缝中有一截剑柄，历经风雨，锈迹斑斑，却隐有某种光泽。强行拔出，竟是一把古剑。',
      fn:()=>{ if(typeof edS!=='undefined'&&edS.bag){ edS.bag.push({instId:'ancsword_'+Date.now(),type:'weapon',templateId:'ancient_sword',name:'古锋（待修复）',icon:'🗡️',identified:true,affixes:[]}); if(typeof bagSave==='function') bagSave(); } return '获得古锋！品质不明，需找铸剑师鉴定修复。'; }},
    { id:'mtn_patrol', w:10, icon:'🛡️', title:'边关守军', type:'normal',
      desc:'边关军营的巡逻队拦住了路，盘问良久，看过路引后放行，顺手塞给你几块干粮。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+10); return '被查了路引，无碍，顺带得了几块军营硬饼干，补充精力+10。'; }},
  ],

  // ── 中原平原 ──
  plain: [
    { id:'plain_market', w:15, icon:'🛒', title:'路边集市', type:'good',
      desc:'乡间集市热闹非凡，摊贩叫卖声此起彼伏，有吃的有玩的有江湖稀罕物。',
      fn:()=>{ SilverManager.add(20); SilverManager.save(); return '顺手淘了件便宜货，卖掉得了20两差价。'; }},
    { id:'plain_carriage', w:12, icon:'🚗', title:'搭乘马车', type:'good',
      desc:'路边一辆马车，车夫见你是独行侠客，害怕土匪，主动邀你同乘，以保平安。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+25); travelSave(); return '一路相谈甚欢，坐车省了大力气，精力+25。'; }},
    { id:'plain_flood', w:8, icon:'🌊', title:'洪水阻路', type:'bad',
      desc:'大雨过后，路段被洪水淹没，只能绕远路，多花半日时间，又饿又累。',
      fn:()=>{ travelPlayerState.energy=Math.max(0,travelPlayerState.energy-20); travelSave(); return '绕路费时，精力-20。'; }},
    { id:'plain_wulin_gathering', w:8, icon:'🏛️', title:'武林聚会', type:'great',
      desc:'附近正在举行小型武林比武大会，各派高手切磋，台下热闹非凡。参与其中，说不定有收获。',
      fn:()=>{ if(typeof jhAddFame==='function') jhAddFame(20,5); SilverManager.add(40); SilverManager.save(); return '参加武林聚会，赢了一场切磋，声名+20，得彩头40两。'; }},
    { id:'plain_wanted', w:10, icon:'📋', title:'通缉告示', type:'normal',
      desc:'路边告示栏贴满了通缉令，你定睛一看，其中几个面孔和江湖传闻对上了号。',
      fn:()=>{ return '记住了几张脸，日后说不定用得上（情报+1）。'; }},
    { id:'plain_farmer', w:12, icon:'🌾', title:'乡农请求', type:'good',
      desc:'一位老农拦住去路，跪下磕头，说庄子上来了一帮强盗打劫，求江湖人帮忙。',
      fn:()=>{ if(typeof jhAddFame==='function') jhAddFame(30,20); return _triggerWildEncounter('平原', typeof edS!=='undefined'?edS.level||1:1, 'bandit'); }},
  ],

  // ── 门派要地（少林/武当/峨眉等周边）──
  sect: [
    { id:'sect_disciple', w:15, icon:'⛩️', title:'门派弟子切磋', type:'good',
      desc:'路上遇到一名门派弟子，对方见你是江湖人，主动要求切磋印证功夫。',
      fn:()=>{ if(typeof jhAddFame==='function') jhAddFame(15,5); return '切磋一场，各有收获，声名+15，双方都有所领悟。'; }},
    { id:'sect_ritual', w:10, icon:'🕯️', title:'门派法事', type:'normal',
      desc:'正赶上某门派的年度法事，香烟缭绕，钟声悠远，气氛庄严肃穆，令人心静。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+20); travelSave(); return '在肃穆气氛中短暂休息，精力+20，内心平静。'; }},
    { id:'sect_spy', w:8, icon:'🕵️', title:'可疑之人', type:'bad',
      desc:'你注意到一个鬼鬼祟祟的人正在探查门派地形，像是在暗中调查……',
      fn:()=>{ return '可疑之人发现你盯着他，迅速遁走。此事可报告门派，也可不管。'; }},
    { id:'sect_elder', w:8, icon:'☸️', title:'偶遇长老', type:'great',
      desc:'一位须发皆白的门派长老独自在山道上打坐，睁眼看见你，竟然主动问起你的武学路数。',
      fn:()=>{ if(typeof jhAddFame==='function') jhAddFame(30,10); travelPlayerState.energy=Math.min(100,travelPlayerState.energy+15); travelSave(); return '长老随口指点你一个关键穴位，内力流转更顺！声名+30，精力+15。'; }},
    { id:'sect_pilgrims', w:10, icon:'🙏', title:'朝圣者同行', type:'good',
      desc:'一群去门派朝圣的香客相邀同行，一路歌谣，苦旅也变得轻快。',
      fn:()=>{ travelPlayerState.energy=Math.min(100,travelPlayerState.energy+15); travelSave(); return '与香客同行，精力+15，听了不少关于本地的奇闻。'; }},
  ],

  // ── 地下城周边（险地附近）──
  dungeon_adj: [
    { id:'dng_omen', w:12, icon:'💀', title:'险地前兆', type:'bad',
      desc:'险地附近鬼气弥漫，道旁偶见白骨，空气中飘荡着隐约的哭声。',
      fn:()=>{ travelPlayerState.energy=Math.max(0,travelPlayerState.energy-10); travelSave(); return '寒气入骨，精力-10，心生警惕。'; }},
    { id:'dng_survivor', w:10, icon:'🤕', title:'劫后余生者', type:'good',
      desc:'一名浑身是伤的武者从险地方向跌跌撞撞跑来，断断续续说着里面的情形……',
      fn:()=>{ return '听到险地内部的信息（已加入情报）：里面有强敌，但也有宝藏，准备好再进。'; }},
    { id:'dng_treasure_map', w:6, icon:'🗺️', title:'残缺藏宝图', type:'great',
      desc:'道旁枯树上钉着一张破旧纸条，上面画着简陋的地图，标注了险地深处的宝藏位置。',
      fn:()=>{ if(typeof edS!=='undefined'&&edS.bag){ edS.bag.push({instId:'tmap_'+Date.now(),type:'collectible',templateId:'treasure_map_frag',name:'残缺藏宝图',icon:'🗺️',identified:true,affixes:[]}); if(typeof bagSave==='function') bagSave(); } return '捡到残缺藏宝图！进入地下城时有概率找到额外宝藏。'; }},
  ],
};

// 获取某城市/地形对应的专属事件池
function _getTerrainEvents(cityId, terrain){
  let pool = [];
  // 根据地形标签
  const terrainMap = {
    '草原':'grassland', '大漠':'desert', '沙漠':'desert',
    '江南':'water', '水乡':'water', '湖泊':'water',
    '山地':'mountain', '雪山':'mountain', '高原':'mountain',
    '平原':'plain',
    '门派':'sect',
  };
  const key = terrainMap[terrain];
  if(key && TERRAIN_EVENTS[key]) pool = pool.concat(TERRAIN_EVENTS[key]);

  // 根据城市ID特征追加
  if(cityId){
    const cid = cityId.toLowerCase();
    if(/caoyuan|yanmen|datong|steppe/.test(cid)) pool = pool.concat(TERRAIN_EVENTS.grassland||[]);
    if(/dunhuang|guizi|xiyu|silk/.test(cid))     pool = pool.concat(TERRAIN_EVENTS.desert||[]);
    if(/hangzhou|suzhou|yangzhou|nanjing|jiangnan/.test(cid)) pool = pool.concat(TERRAIN_EVENTS.water||[]);
    if(/litang|xining|wudang|songshan|emei|kunlun|tianshan/.test(cid)) pool = pool.concat(TERRAIN_EVENTS.mountain||[]);
    if(/wudang|shaolin|emei|huashan|wudu|taohua|xiaoyao|riyue|kunlun|xuanming|tiandibang|lingxiao|guigu|kongtong/.test(cid)) pool = pool.concat(TERRAIN_EVENTS.sect||[]);
    if(/dungeon|danger|xiandi/.test(cid)) pool = pool.concat(TERRAIN_EVENTS.dungeon_adj||[]);
  }

  // 去重
  const seen = new Set();
  return pool.filter(e=>{ if(seen.has(e.id)) return false; seen.add(e.id); return true; });
}

// 加权随机抽取旅途事件（支持地形专属事件混入）
function travelPickEvent(fromCityId, toCityId){
  const terrain = _travelCurrentTerrain || '平原';
  const cityId  = toCityId || fromCityId || '';

  // 获取地形专属事件（权重×1.5加成）
  const terrainPool = _getTerrainEvents(cityId, terrain).map(e=>({...e, w:Math.round(e.w*1.5)}));

  // 60%概率从专属池抽，40%从通用池抽（确保通用事件不会消失）
  const useSpecial = terrainPool.length > 0 && Math.random() < 0.60;
  const pool = useSpecial ? terrainPool : TRAVEL_EVENTS;

  const totalW = pool.reduce((s,e)=>s+e.w, 0);
  if(totalW <= 0) return TRAVEL_EVENTS[0];
  let r = Math.random() * totalW;
  for(const e of pool){ r -= e.w; if(r <= 0) return e; }
  return pool[0];
}

// 添加事件到旅途日志
function travelAddEventLog(cityFrom, cityTo, ev, resultText){
  const fromNode = WORLD_NODES[cityFrom];
  const toNode   = WORLD_NODES[cityTo];
  // 【修复】resultText 由调用方传入，避免在此处再次调用 ev.fn() 导致双重副作用
  travelEventLog.unshift({
    from: fromNode?.name||'?', to: toNode?.name||'?',
    icon: ev.icon, title: ev.title, type: ev.type,
    desc: ev.desc, result: resultText || (ev.result||''),
    time: new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}),
  });
  if(travelEventLog.length > 8) travelEventLog.pop();
}

function renderMapPage(){
  travelLoad();  // 从 localStorage 恢复旅行状态

  // 检查是否从 town.html 出城跳转过来，有则移动到目标城市
  const pending = sessionStorage.getItem('pendingTravelTo');
  if (pending && pending !== 'null' && WORLD_NODES[pending]) {
    sessionStorage.removeItem('pendingTravelTo');
    travelCurrentCity = pending;
    travelHistory.unshift(pending);
    travelSave();
    travelRenderLocation(pending);
    setTimeout(()=> { if(typeof showToast==='function') showToast(`⚔ 踏出城门，前往 ${WORLD_NODES[pending].name}`); }, 300);
    return;
  }

  travelRenderLocation(travelCurrentCity);
}

// 玩家主动移动到目标城市（触发行路探索画面）
function travelMoveTo(destId){
  const fromId = travelCurrentCity;
  const dest   = WORLD_NODES[destId];
  if(!dest) return;

  // ① 检查地点访问权限（主线剧情限制）
  const accessCheck = checkLocationUnlocked(destId);
  if (!accessCheck.unlocked) {
    showToast(`🚫 ${dest.name}暂不可前往：${accessCheck.reason}`, 'warn');
    return;
  }

  // ② 先更新足迹（足迹先记录，弹窗关闭后渲染时就能正确反映）
  if(travelHistory[0] !== destId){
    travelHistory.unshift(destId);
    if(travelHistory.length > 10) travelHistory.pop();
  }

  // ② 计算旅途信息（距离+时间）— 已含租马判断
  const timeInfo = travelCalcTime(fromId, destId);
  // 有坐骑（永久或租马）就用 horseDays，否则 footDays
  const hasAnyMount = !!(timeInfo.rentMount || (typeof edS !== 'undefined' && edS.horseId && HORSE_BREEDS[edS.horseId]));
  const days = hasAnyMount ? timeInfo.horseDays : timeInfo.footDays;

  // ③ 精力消耗：阶梯公式，限制最大消耗
  // 近距离(<100里)：每15里1点；中距离(<200里)：额外+每15里1点；远距离：封顶70点
  // 骑马/租马减半，最低10点起
  const distLi = timeInfo.distLi || 0;
  let energyCost = hasAnyMount
    ? Math.max(10, Math.min(35, Math.round(distLi / 30)))
    : Math.max(10, Math.min(70, Math.round(distLi / 10)));
  // 窘迫惩罚：饥渴低时消耗额外精力（饿着肚子赶路）
  const foodPenalty  = (travelPlayerState.food  ?? 100) < 30 ? 5 : 0;
  const waterPenalty = (travelPlayerState.water ?? 100) < 20 ? 5 : 0;
  energyCost += foodPenalty + waterPenalty;
  travelPlayerState.energy = Math.max(0, travelPlayerState.energy - energyCost);

  // 注：饱食/口渴消耗统一在 journeyStart() 回调中按天数扣减，此处不再重复扣

  // ④ 启动行路探索画面（替换原弹窗逻辑）
  // ── 旅途开始音效 ──
  if (typeof playAudio === 'function') playAudio('travel_step');
  journeyStart(fromId, destId, ()=>{
    // ── 旅途扣减饱食度和口渴度（按旅行天数计算）──
    const travelDays = Math.max(1, Math.round(days));
    // 徒步每天-10饱食-15口渴；骑马每天-5饱食-8口渴
    const foodDrain  = hasAnyMount ? travelDays * 5  : travelDays * 10;
    const waterDrain = hasAnyMount ? travelDays * 8  : travelDays * 15;
    travelPlayerState.food  = Math.max(0, (travelPlayerState.food  ?? 100) - foodDrain);
    travelPlayerState.water = Math.max(0, (travelPlayerState.water ?? 100) - waterDrain);

    // ── 推进游戏时间（武侠日历系统：旅行消耗天数推进年月日）──
    if(typeof edS !== 'undefined'){
      const travelDays = Math.max(1, Math.round(days));
      advanceWuxiaDate(edS, travelDays);
      // 持久化到 wuxia_editor 存档
      try{ localStorage.setItem('wuxia_editor', JSON.stringify(edS)); }catch(e){}
    }
    // ── 保存旅行状态（饥渴值等）──
    travelSave();
    // ── 抵达城市音效 ──
    if (typeof playAudio === 'function') playAudio('city_change');
    // ── 抵达后：对出发城市的NPC执行好感衰减（基于 gameDay 差值）──
    if(typeof npcDecayOnTravel === 'function') npcDecayOnTravel(fromId);
    travelRenderLocation(destId);
    // ── 抵达后触发通缉检查（延迟1.5s，等地图渲染完毕）──
    setTimeout(()=> wantedCheckOnArrival(destId), 1500);
  });
}

// 旅途事件弹窗
function travelShowEventPopup(ev, destId){
  const typeCls = {good:'ev-good',great:'ev-great',bad:'ev-bad',normal:'ev-normal'}[ev.type]||'ev-normal';
  const node = WORLD_NODES[destId];
  const overlay = document.createElement('div');
  overlay.className = 'travel-ev-overlay';

  // 旅途摘要：距离+时间+坐骑
  let travelSummary = '';
  const meta = ev._travelMeta;
  if(meta){
    const timeStr = fmtDays(meta.days);
    const modeStr = meta.hasHorse
      ? `${meta.horseInfo.icon} ${meta.horseInfo.name}（${timeStr}）`
      : `🚶 步行（${timeStr}）`;
    const energyStr = meta.energyCost > 0 ? `⚡ 精力 -${meta.energyCost}` : '';
    travelSummary = `<div class="ev-travel-meta">
      📏 路程 ${meta.distLi}里 &nbsp;·&nbsp; ${modeStr}
      ${energyStr ? `&nbsp;·&nbsp; ${energyStr}` : ''}
    </div>`;
  }

  // 执行事件效果（仅在此处调用一次 fn()，结果同时写入日志和弹窗）
  const resultText = (typeof ev.fn === 'function') ? ev.fn() : (ev.result||'');

  overlay.innerHTML = `
    <div class="travel-ev-popup ${typeCls}">
      <div class="ev-icon">${ev.icon}</div>
      <div class="ev-title">${ev.title}</div>
      ${travelSummary}
      <div class="ev-desc">${ev.desc}</div>
      <div class="ev-result">⟹ ${resultText}</div>
      <div class="ev-arriving">抵达 → ${node?.icon||'📍'} ${node?.name||'未知之地'}</div>
      <button class="ev-btn" onclick="this.closest('.travel-ev-overlay').remove(); travelRenderLocation('${destId}'); setTimeout(()=>wantedCheckOnArrival('${destId}'),1500);">继续旅程</button>
    </div>`;
  document.body.appendChild(overlay);
}


// ════════════════════════════════════════════════════════════════
//  声望 & 通缉系统
//  travelPlayerState.wantedBy = [{sectId, sectName, reason, killCount, expireDay}]
//  travelPlayerState.reputation (0-200，100=中立)
// ════════════════════════════════════════════════════════════════

// ── 声望称号 ──
const REPUTATION_TIER = [
  { min:180, label:'义薄云天', color:'#80ffb0', align:'侠义',  icon:'⚔️' },
  { min:150, label:'一方名侠', color:'#60e890', align:'侠义',  icon:'🗡️' },
  { min:120, label:'江湖游侠', color:'#a0d8a0', align:'游侠',  icon:'👤' },
  { min:100, label:'过路武人', color:'#909090', align:'中立',  icon:'🧑' },
  { min:80,  label:'江湖浪客', color:'#c8a060', align:'混乱',  icon:'💀' },
  { min:50,  label:'恶名在外', color:'#e07040', align:'邪道',  icon:'☠️' },
  { min:0,   label:'天下公敌', color:'#ff4040', align:'邪道',  icon:'💀' },
];

function getReputationTier(rep){
  rep = rep ?? travelPlayerState.reputation ?? 100;
  return REPUTATION_TIER.find(t => rep >= t.min) || REPUTATION_TIER[REPUTATION_TIER.length-1];
}

/** 增减声誉 */
function changeReputation(delta){
  travelPlayerState.reputation = Math.max(0, Math.min(200, (travelPlayerState.reputation||100) + delta));
  travelSave();
}

/** 添加通缉 */
function addWanted(sectId, sectName, reason, killCount=1){
  const list = travelPlayerState.wantedBy || [];
  const existing = list.find(w => w.sectId === sectId);
  if(existing){
    existing.killCount = (existing.killCount||0) + killCount;
    existing.reason = reason;
    existing.expireDay = (_getTodayIndex()||0) + 30; // 30天自动过期
    showToast(`🚨 通缉升级！${sectName} 对你的悬赏提高了！（击杀数：${existing.killCount}）`);
  } else {
    list.push({ sectId, sectName, reason, killCount, expireDay:(_getTodayIndex()||0)+30 });
    showToast(`🚨 你被 ${sectName} 列为通缉要犯！原因：${reason}`);
  }
  travelPlayerState.wantedBy = list;
  changeReputation(-Math.min(30, killCount * 8));
  travelSave();
}

/** 获取当前有效通缉列表 */
function getActiveWanted(){
  const list = travelPlayerState.wantedBy || [];
  const today = _getTodayIndex() || 0;
  return list.filter(w => !w.expireDay || w.expireDay > today);
}

/** 消除通缉（用银两或任务完成） */
function clearWanted(sectId, method='silver'){
  const list = travelPlayerState.wantedBy || [];
  const idx = list.findIndex(w => w.sectId === sectId);
  if(idx === -1) return false;
  list.splice(idx, 1);
  travelPlayerState.wantedBy = list;
  changeReputation(20);
  travelSave();
  const sectName = (typeof SECTS!=='undefined'?SECTS.find(s=>s.id===sectId)?.name:'') || sectId;
  const methodText = { silver:'以银两平息', quest:'完成任务将功折罪', pardon:'获得赦免' }[method]||'';
  showToast(`✅ ${sectName} 的通缉已消除（${methodText}）。声誉+20。`);
  return true;
}

/** 计算消除某门派通缉的赎金 */
function calcBailAmount(sectId){
  const w = (travelPlayerState.wantedBy||[]).find(x=>x.sectId===sectId);
  if(!w) return 0;
  return Math.min(2000, Math.max(100, (w.killCount||1) * 150 + 100));
}

// ── 到达城市时触发通缉检查（阵营感知版）──
function wantedCheckOnArrival(cityId){
  const node = WORLD_NODES[cityId];
  if(!node) return;

  const active = getActiveWanted();
  const citySects = node.sects || [];

  // ① 已有通缉记录：匹配城市所属门派
  active.forEach((w, idx) => {
    if(citySects.includes(w.sectId)){
      setTimeout(()=> _showWantedInterception(w, cityId), 1500 + idx * 300);
    }
  });

  // ② 高度通缉（killCount≥3）：任何城市40%概率触发
  const highWanted = active.filter(w => (w.killCount||1) >= 3);
  if(highWanted.length > 0 && Math.random() < 0.4 && !citySects.some(s => highWanted.find(w=>w.sectId===s))){
    setTimeout(()=> _showWantedInterception(highWanted[0], cityId), 2000);
  }

  // ③ 阵营感知：即使没有通缉记录，也会有额外遭遇
  const playerAlignScore = (typeof jianghuState !== 'undefined')
    ? (jianghuState.reputation?.alignment || 0) : 0;

  // 邪道玩家（≤-30）进入正道门派据点城市
  const isPlayerEvil = playerAlignScore <= -30;
  if(isPlayerEvil && active.length === 0){
    const hasRighteousSect = citySects.some(sId => {
      if(typeof SECTS === 'undefined') return false;
      const s = SECTS.find(x => x.id === sId);
      return s && s.alignment === 'righteous';
    });
    if(hasRighteousSect && Math.random() < 0.55){
      setTimeout(()=> _showAlignmentHostility(cityId, 'evil_in_righteous'), 2200);
    }
  }

  // 正道玩家（≥30）进入邪道门派据点城市
  const isPlayerRighteous = playerAlignScore >= 30;
  if(isPlayerRighteous && active.length === 0){
    const hasEvilSect = citySects.some(sId => {
      if(typeof SECTS === 'undefined') return false;
      const s = SECTS.find(x => x.id === sId);
      return s && s.alignment === 'evil';
    });
    if(hasEvilSect && Math.random() < 0.45){
      setTimeout(()=> _showAlignmentHostility(cityId, 'righteous_in_evil'), 2200);
    }
  }
}

/** 显示阵营敌意事件（无正式通缉，但被对方针对）*/
function _showAlignmentHostility(cityId, type){
  const node = WORLD_NODES[cityId];
  const cityName = node?.name || '此地';
  const overlay = document.createElement('div');
  overlay.className = 'wanted-intercept-overlay';

  if(type === 'evil_in_righteous'){
    // 邪道玩家在正道城市被义警盘问
    const bail = 80 + Math.floor(Math.random()*60);
    const canBail = SilverManager.has(bail);
    overlay.innerHTML = `
      <div class="wanted-intercept-box" style="border-color:rgba(128,220,255,.3)">
        <div class="wanted-title" style="color:#80dfff">⚖️ 义警盘查！</div>
        <div class="wanted-body">
          <div class="wanted-sect" style="color:#80dfff">${cityName} 正道巡逻</div>
          <div class="wanted-reason">此地侠士察觉你身上有邪气，将你拦下盘问。</div>
          <div class="wanted-kill">你的行事作风已引起正道警觉。</div>
        </div>
        <div class="wanted-choices">
          <button class="wanted-btn wanted-btn-fight" onclick="wantedHostilityFight('righteous'); this.closest('.wanted-intercept-overlay').remove()">
            ⚔ 强行闯关（与义警战斗）
          </button>
          <button class="wanted-btn wanted-btn-bail ${canBail?'':'disabled'}" ${canBail?'':'disabled'}
            onclick="wantedHostilityPay(${bail}); this.closest('.wanted-intercept-overlay').remove()">
            💰 打点疏通（${bail}两）${canBail?'':' ── 银两不足'}
          </button>
          <button class="wanted-btn wanted-btn-escape" onclick="wantedEscape(); this.closest('.wanted-intercept-overlay').remove()">
            💨 找借口溜开（消耗精力）
          </button>
        </div>
      </div>`;
  } else {
    // 正道玩家在邪道城市被刁难/敲诈
    const extort = 60 + Math.floor(Math.random()*80);
    const canPay = SilverManager.has(extort);
    overlay.innerHTML = `
      <div class="wanted-intercept-box" style="border-color:rgba(255,80,80,.3)">
        <div class="wanted-title" style="color:#ff8060">☠️ 邪道刁难！</div>
        <div class="wanted-body">
          <div class="wanted-sect" style="color:#ff8060">${cityName} 邪道爪牙</div>
          <div class="wanted-reason">此地邪道势力认出你是正道之人，前来挑衅刁难。</div>
          <div class="wanted-kill">你的侠义气质让这里的人如芒在背。</div>
        </div>
        <div class="wanted-choices">
          <button class="wanted-btn wanted-btn-fight" onclick="wantedHostilityFight('evil'); this.closest('.wanted-intercept-overlay').remove()">
            ⚔ 以武会友（与邪道战斗，可获声誉）
          </button>
          <button class="wanted-btn wanted-btn-bail ${canPay?'':'disabled'}" ${canPay?'':'disabled'}
            onclick="wantedHostilityPay(${extort}); this.closest('.wanted-intercept-overlay').remove()">
            💰 破财免灾（${extort}两）${canPay?'':' ── 银两不足'}
          </button>
          <button class="wanted-btn wanted-btn-escape" onclick="wantedEscape(); this.closest('.wanted-intercept-overlay').remove()">
            💨 忍气吞声（消耗精力）
          </button>
        </div>
      </div>`;
  }
  document.body.appendChild(overlay);
}

/** 阵营敌意：战斗选项 */
function wantedHostilityFight(opponentAlign){
  const playerLv = typeof edS !== 'undefined' ? (edS.level||1) : 1;
  const enemyLv = Math.min(120, playerLv + Math.floor(Math.random()*8) + 3);
  const enemyType = opponentAlign === 'righteous' ? 'bandit' : 'evil';
  _triggerWildEncounter('平原', enemyLv, enemyType);
  // 打赢邪道：加少量声誉
  if(opponentAlign === 'evil'){
    // 战斗回调加声誉在 battle.js 中处理；这里只做提示
    showToast('⚔ 以武会友！若胜利可涨声誉。');
  } else {
    changeReputation(-8);
    showToast('⚔ 与义警交手！声誉-8');
  }
}

/** 阵营敌意：花银两打发 */
function wantedHostilityPay(amount){
  if(!SilverManager.has(amount)){ showToast('银两不足！'); return; }
  SilverManager.add(-amount);
  SilverManager.save();
  showToast(`💰 花了 ${amount} 两打点，对方放行。`);
}

/** 显示通缉拦截弹窗（区分正道/邪道通缉令样式）*/
function _showWantedInterception(w, cityId){
  const bail = calcBailAmount(w.sectId);
  const canBail = SilverManager.has(bail);
  const rep = travelPlayerState.reputation || 100;
  const playerAlignScore = (typeof jianghuState !== 'undefined')
    ? (jianghuState.reputation?.alignment || 0) : 0;

  // 高声誉正道玩家 + 正道通缉 = 可免（声望庇护）
  const wantedAlign = w.sectAlign || 'neutral';
  const immuneByRep = (rep >= 160 && wantedAlign !== 'evil')
                   || (playerAlignScore <= -50 && wantedAlign === 'evil'); // 极恶玩家被邪道反而放行

  // 外观：正道通缉=蓝色，邪道通缉=红色，混乱=橙色
  const styleMap = {
    righteous: { border:'rgba(128,200,255,.35)', titleColor:'#80c8ff', icon:'⚖️', label:'正道追杀令' },
    evil:      { border:'rgba(255,80,80,.35)',   titleColor:'#ff6060', icon:'☠️', label:'邪道悬赏令' },
    chaotic:   { border:'rgba(255,160,40,.35)',  titleColor:'#ffa828', icon:'⚡', label:'江湖追杀令' },
    neutral:   { border:'rgba(200,180,120,.25)', titleColor:'#c8b478', icon:'🚨', label:'通缉追查'   },
  };
  const sty = styleMap[wantedAlign] || styleMap.neutral;

  const overlay = document.createElement('div');
  overlay.className = 'wanted-intercept-overlay';
  overlay.innerHTML = `
    <div class="wanted-intercept-box" style="border-color:${sty.border}">
      <div class="wanted-title" style="color:${sty.titleColor}">${sty.icon} ${sty.label}</div>
      <div class="wanted-body">
        <div class="wanted-sect" style="color:${sty.titleColor}">${w.sectName}</div>
        <div class="wanted-reason">原因：${w.reason}</div>
        <div class="wanted-kill">悬赏级别：击杀/冒犯 ×${w.killCount||1}</div>
      </div>
      ${immuneByRep ? `
        <div class="wanted-immune">
          ${rep >= 160
            ? '⚔️ 你的声望（义薄云天）令对方不敢轻举妄动，追兵悻悻撤退。'
            : '☠️ 你的邪名令同道中人不愿树敌，对方放你离开。'}
        </div>
        <button class="wanted-btn wanted-btn-ok" onclick="this.closest('.wanted-intercept-overlay').remove(); showToast('全身而退。')">全身而退</button>
      ` : `
        <div class="wanted-choices">
          <button class="wanted-btn wanted-btn-fight" onclick="wantedFight('${w.sectId}'); this.closest('.wanted-intercept-overlay').remove()">
            ⚔ 强行突围（与追兵战斗）
          </button>
          <button class="wanted-btn wanted-btn-bail ${canBail?'':'disabled'}" ${canBail?'':'disabled'}
            onclick="wantedPayBail('${w.sectId}',${bail}); this.closest('.wanted-intercept-overlay').remove()">
            💰 以银两平息（${bail}两）${canBail?'':' ── 银两不足'}
          </button>
          <button class="wanted-btn wanted-btn-escape" onclick="wantedEscape(); this.closest('.wanted-intercept-overlay').remove()">
            💨 悄悄溜走（消耗精力）
          </button>
        </div>
      `}
    </div>
  `;
  document.body.appendChild(overlay);
}

/** 通缉：强行突围战斗 */
function wantedFight(sectId){
  const playerLv = typeof edS !== 'undefined' ? (edS.level||1) : 1;
  const w = (travelPlayerState.wantedBy||[]).find(x=>x.sectId===sectId);
  const killCnt = w ? (w.killCount||1) : 1;
  // 追兵等级 = 玩家等级 + 通缉等级加成
  const enemyLv = Math.min(120, playerLv + killCnt * 5 + 5);
  const wantedAlign = w?.sectAlign || 'neutral';
  const enemyType = wantedAlign === 'evil' ? 'evil' : 'assassin';
  _triggerWildEncounter('平原', enemyLv, enemyType);
  // 正道追兵：扣更多声誉；邪道追兵：打赢可加声誉（由battle回调处理）
  if(wantedAlign !== 'evil'){
    changeReputation(-5);
    showToast(`⚔ 与${w?.sectName||'追兵'}激战！声誉-5`);
  } else {
    showToast(`⚔ 与${w?.sectName||'邪道追兵'}激战！胜则声誉可增。`);
  }
}

/** 通缉：银两平息 */
function wantedPayBail(sectId, amount){
  if(!SilverManager.has(amount)){ showToast('银两不足！'); return; }
  SilverManager.add(-amount);
  SilverManager.save();
  clearWanted(sectId, 'silver');
}

/** 通缉：溜走（消耗精力，50%成功） */
function wantedEscape(){
  const success = Math.random() < 0.5;
  if(success){
    travelPlayerState.energy = Math.max(0, travelPlayerState.energy - 20);
    travelSave();
    showToast('💨 溜走成功！精力-20，追兵暂时甩开了。');
  } else {
    travelPlayerState.energy = Math.max(0, travelPlayerState.energy - 30);
    travelPlayerState.hp = Math.max(5, travelPlayerState.hp - 15);
    travelSave();
    showToast('溜走失败！被追兵打了一顿。精力-30，气血-15%。');
  }
}


/** 显示通缉状态面板（在城镇界面入口）— 阵营区分版 */
function showWantedPanel(){
  const active = getActiveWanted();
  const rep = travelPlayerState.reputation || 100;
  const tier = getReputationTier(rep);

  const overlay = document.createElement('div');
  overlay.className = 'jh-page-overlay';
  overlay.id = 'wanted-panel-overlay';

  // 通缉令阵营样式映射
  const wantedStyleMap = {
    righteous: { icon:'⚖️', label:'正道追杀令', color:'#80c8ff', bg:'rgba(64,128,200,.12)', border:'rgba(128,200,255,.2)' },
    evil:      { icon:'☠️', label:'邪道悬赏令', color:'#ff8080', bg:'rgba(180,40,40,.12)',  border:'rgba(255,80,80,.2)'   },
    chaotic:   { icon:'⚡', label:'江湖追杀令', color:'#ffc060', bg:'rgba(180,100,20,.12)', border:'rgba(255,160,40,.2)'  },
    neutral:   { icon:'🚨', label:'门派通缉令', color:'#c8b080', bg:'rgba(160,140,80,.10)', border:'rgba(200,180,100,.2)' },
  };

  const wantedHtml = active.length ? active.map(w => {
    const bail = calcBailAmount(w.sectId);
    const canBail = SilverManager.has(bail);
    const ws = wantedStyleMap[w.sectAlign||'neutral'] || wantedStyleMap.neutral;
    const isPerm = w.expireDay === -1;
    const daysLeft = isPerm ? '永久' : Math.max(0, w.expireDay - ((typeof edS!=='undefined'?edS.gameDay:0)||0)) + '天后解除';
    return `
      <div class="wanted-entry" style="background:${ws.bg};border:1px solid ${ws.border};border-radius:8px;padding:10px 12px;margin-bottom:8px">
        <div class="wanted-entry-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-weight:700;color:${ws.color}">${ws.icon} ${w.sectName}</span>
          <span style="font-size:11px;background:rgba(255,255,255,.08);padding:2px 7px;border-radius:10px;color:${ws.color}">悬赏×${w.killCount||1}</span>
        </div>
        <div style="font-size:12px;color:rgba(200,180,140,.75);margin-bottom:2px">类型：${ws.label}</div>
        <div style="font-size:12px;color:rgba(200,180,140,.8);margin-bottom:2px">原因：${w.reason}</div>
        <div style="font-size:11px;color:rgba(160,150,130,.6);margin-bottom:6px">${isPerm?'⚠️ 永久通缉，无法自然解除':'⏳ ' + daysLeft}</div>
        <div>
          <button class="wanted-clear-btn ${canBail?'':'disabled'}" ${canBail?'':'disabled'}
            style="font-size:12px;padding:4px 12px"
            onclick="wantedPayBail('${w.sectId}',${bail}); document.getElementById('wanted-panel-overlay').remove()">
            💰 花 ${bail} 两平息
          </button>
        </div>
      </div>
    `;
  }).join('') : '<div class="jh-empty">✅ 暂无通缉，行走江湖无人追杀。</div>';

  // 统计正道/邪道/混乱通缉数量
  const righteousCnt = active.filter(w=>(w.sectAlign||'neutral')==='righteous').length;
  const evilCnt      = active.filter(w=>(w.sectAlign||'neutral')==='evil').length;
  const otherCnt     = active.length - righteousCnt - evilCnt;
  const countBadges = [
    righteousCnt ? `<span style="color:#80c8ff">⚖️ 正道×${righteousCnt}</span>` : '',
    evilCnt      ? `<span style="color:#ff8080">☠️ 邪道×${evilCnt}</span>` : '',
    otherCnt     ? `<span style="color:#ffc060">⚡ 其他×${otherCnt}</span>` : '',
  ].filter(Boolean).join(' &nbsp; ');

  overlay.innerHTML = `
    <div class="jh-page" style="max-width:480px">
      <div class="jh-page-header">
        <div class="jh-page-title">⚔️ 声誉 · 通缉档案</div>
        <button class="jh-close-btn" onclick="document.getElementById('wanted-panel-overlay').remove()">✕</button>
      </div>

      <!-- 声誉状态 -->
      <div style="background:rgba(255,255,255,.06);border-radius:10px;padding:12px 16px;margin-bottom:16px;border:1px solid rgba(255,255,255,.08)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:14px;color:rgba(200,180,140,.7)">江湖声誉</span>
          <span style="font-size:15px;font-weight:700;color:${tier.color}">${tier.icon} ${tier.label}（${rep}/200）</span>
        </div>
        <div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${rep/2}%;background:${tier.color};border-radius:3px;transition:width .4s"></div>
        </div>
        <div style="margin-top:6px;font-size:11px;color:rgba(150,150,150,.7)">
          声誉越高，越多正道NPC愿意帮助你；邪道玩家在正道城市会被盘查。
        </div>
      </div>

      <!-- 通缉列表 -->
      <div class="jh-section">
        <div class="jh-section-title" style="display:flex;justify-content:space-between;align-items:center">
          <span>🚨 通缉令（${active.length}份有效）</span>
          <span style="font-size:11px;gap:6px">${countBadges}</span>
        </div>
        <div class="wanted-list">${wantedHtml}</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ── 通缉系统 CSS ──
(function injectWantedStyles(){
  const s = document.createElement('style');
  s.textContent = `
  .wanted-intercept-overlay {
    position:fixed; inset:0; z-index:9700; background:rgba(0,0,0,.75);
    display:flex; align-items:center; justify-content:center;
    animation:jhFadeIn .3s;
  }
  .wanted-intercept-box {
    background:linear-gradient(160deg,#1a0808,#200a0a);
    border:2px solid rgba(200,40,40,.5); border-radius:14px;
    padding:24px; width:min(360px,92vw); color:#e8c8c8;
  }
  .wanted-title { font-size:18px; font-weight:700; color:#ff6060; text-align:center; margin-bottom:14px; }
  .wanted-body { background:rgba(255,40,40,.07); border-radius:8px; padding:12px; margin-bottom:14px; }
  .wanted-sect { font-size:15px; font-weight:600; color:#ffaaaa; margin-bottom:4px; }
  .wanted-reason, .wanted-kill { font-size:12px; color:rgba(220,160,160,.7); margin-bottom:2px; }
  .wanted-immune { color:#80ffb0; font-size:13px; text-align:center; padding:10px; }
  .wanted-choices { display:flex; flex-direction:column; gap:8px; }
  .wanted-btn {
    padding:9px 16px; border-radius:8px; border:1px solid;
    cursor:pointer; font-size:13px; font-family:inherit; text-align:left;
    transition:opacity .2s;
  }
  .wanted-btn:hover:not(.disabled) { opacity:.8; }
  .wanted-btn.disabled { opacity:.35; cursor:not-allowed; }
  .wanted-btn-fight   { background:rgba(200,40,40,.2);   border-color:rgba(220,60,60,.4);   color:#ffaaaa; }
  .wanted-btn-bail    { background:rgba(200,160,20,.2);   border-color:rgba(220,180,40,.4);  color:#ffe080; }
  .wanted-btn-escape  { background:rgba(40,80,180,.2);    border-color:rgba(60,100,200,.4);  color:#a0c0ff; }
  .wanted-btn-ok      { background:rgba(40,160,80,.2);    border-color:rgba(60,180,100,.4);  color:#80ffb0;
                        width:100%; text-align:center; margin-top:8px; }
  .wanted-list { display:flex; flex-direction:column; gap:10px; }
  .wanted-entry {
    background:rgba(200,40,40,.08); border:1px solid rgba(200,40,40,.2);
    border-radius:8px; padding:12px;
  }
  .wanted-entry-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
  .wanted-sect-name { font-size:14px; font-weight:600; color:#ffaaaa; }
  .wanted-kill-badge {
    font-size:11px; background:rgba(200,40,40,.2); border:1px solid rgba(200,40,40,.3);
    color:#ff8080; padding:2px 8px; border-radius:20px;
  }
  .wanted-reason-text { font-size:12px; color:rgba(200,160,160,.7); margin-bottom:8px; }
  .wanted-bail-row { display:flex; gap:8px; }
  .wanted-clear-btn {
    padding:6px 12px; border-radius:6px; border:1px solid rgba(220,180,40,.4);
    background:rgba(200,160,20,.2); color:#ffe080; font-size:12px;
    cursor:pointer; font-family:inherit; transition:opacity .2s;
  }
  .wanted-clear-btn.disabled { opacity:.35; cursor:not-allowed; }
  .wanted-clear-btn:not(.disabled):hover { opacity:.8; }
  `;
  document.head.appendChild(s);
})();

// ════════════════════════════════════════════════════════════════
//  城镇 NPC 系统
// ════════════════════════════════════════════════════════════════

// ── 关系等级定义 ──
