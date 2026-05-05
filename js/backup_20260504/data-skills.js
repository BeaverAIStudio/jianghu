const SKT={
  damage: {label:'伤害',  color:'#f06040'},
  heal:   {label:'治疗',  color:'#44ff88'},
  shield: {label:'护盾',  color:'#44aaff'},
  dot:    {label:'持续',  color:'#88ff44'},
  stun:   {label:'眩晕',  color:'#ffee44'},
  buff:   {label:'强化',  color:'#ff88ff'},
  debuff: {label:'削弱',  color:'#ff8844'},
  execute:{label:'处决',  color:'#ff2244'},
};

// ════════════════════════════════════════════════
//  ✦ 技能库 SKILL_LIB — 天下武学总谱 ✦
//  分类：sword剑系 / buddha佛系 / tao道系 / force力系
//        shadow暗系 / poison毒系 / ice冰系 / fire火系
//        thunder雷系 / wind风系 / holy圣系 / common通用
// ════════════════════════════════════════════════
const SKILL_LIB = {

  // ── 剑系 ──────────────────────────────────────
  sword: [
    {id:'sw_l1',name:'横斩',icon:'⚔️',school:'剑系',desc:'基础横扫一刀，造成70%伤害',cd:1,mpCost:4,type:'damage',multiplier:0.7,frames:[`─O─⚔`],bigText:'横斩！',bigColor:'#40b0ff',sfx:'hit'},
    {id:'sw_l2',name:'刺击',icon:'🗡️',school:'剑系',desc:'直刺一剑，造成80%伤害，有20%概率暴击',cd:2,mpCost:6,type:'damage',multiplier:0.8,frames:[`O→⚔`],bigText:'刺击！',bigColor:'#40b0ff',sfx:'hit'},
    {id:'sw_l3',name:'架剑格挡',icon:'🛡️',school:'剑系',desc:'以剑格挡，防御+30%，持续2秒',cd:3,mpCost:8,type:'buff',defBuff:.3,buffDur:2,frames:[`─⚔─O`],bigText:'格挡！',bigColor:'#80c8ff',sfx:'shield'},
    {id:'sw01',name:'剑气斩',icon:'⚔️',school:'剑系',desc:'剑气纵横，造成140%伤害，命中后必定暴击',cd:4,mpCost:14,type:'damage',multiplier:1.3,forceCrit:true,frames:[`  ✦O✦\n─═|⚔═─\n✦✦✦`,`  ⚡O⚡\n──|⚔⚔──\n⚡⚡⚡`],bigText:'剑气斩！',bigColor:'#40b0ff',sfx:'skill'},
    {id:'sw02',name:'无影三剑',icon:'💨',school:'剑系',desc:'三连快刺，每刺65%伤害，无视30%防御',cd:6,mpCost:18,type:'damage',hits:3,multiplier:0.6,frames:[`─O─⚔`,`─O─⚔─⚔`,`─O─⚔─⚔─⚔`],bigText:'无影三剑！',bigColor:'#80d0ff',sfx:'hit'},
    {id:'sw03',name:'独孤九剑',icon:'✨',school:'剑系',desc:'绝世剑法，造成300%伤害，必定暴击，眩晕3秒',cd:13,mpCost:50,type:'stun',multiplier:2.5,stunDur:3,forceCrit:true,frames:[`✦─O─✦\n─╲⚔╱─\n✦─✦─✦\n独孤九剑！`],bigText:'独孤九剑！',bigColor:'#f0e060',sfx:'skill'},
    {id:'sw04',name:'御剑飞花',icon:'🌸',school:'剑系',desc:'剑化飞花，连续6击各55%伤害，35%概率中毒',cd:8,mpCost:24,type:'dot',hits:6,multiplier:0.5,dotChance:.35,dotDmg:.035,dotDur:5,frames:[`🌸O🌸\n⚔↗↗⚔\n御剑飞花！`],bigText:'御剑飞花！',bigColor:'#ff88cc',sfx:'wind'},
    {id:'sw05',name:'一剑破万法',icon:'💠',school:'剑系',desc:'气贯长虹，造成260%伤害，无视全部防御与护盾',cd:11,mpCost:42,type:'execute',multiplier:2.3,ignoreAll:true,frames:[`─═══O═══─\n   ⚔\n一剑破万法！`],bigText:'一剑破万法！',bigColor:'#a0e8ff',sfx:'thunder'},
    {id:'sw06',name:'寒芒百闪',icon:'❄️',school:'剑系',desc:'寒光闪动，眩晕2秒并降低对方攻击力40%',cd:9,mpCost:28,type:'stun',multiplier:1.1,stunDur:2,atkDebuff:.4,debuffDur:5,frames:[`❄❄❄\n─O─⚔─\n寒芒百闪！`],bigText:'寒芒百闪！',bigColor:'#80d0ff',sfx:'ice'},
    {id:'sw07',name:'剑魄觉醒',icon:'🔮',school:'剑系',desc:'觉醒剑魄！攻击+70%，防御+20%，持续8秒',cd:15,mpCost:55,type:'buff',atkBuff:.7,defBuff:.2,buffDur:8,frames:[`✦✦✦\n(⚔O⚔)\n剑魄觉醒！\n✦✦✦`],bigText:'剑魄觉醒！',bigColor:'#f8f0ff',sfx:'holy'},
    {id:'sw08',name:'百步穿杨',icon:'🎯',school:'剑系',desc:'精准一击，必中要害，造成220%伤害，无视闪避',cd:8,mpCost:28,type:'damage',multiplier:2.0,alwaysHit:true,forceCrit:true,frames:[`O─⚔─⚔─⚔─★\n百步穿杨！`],bigText:'百步穿杨！',bigColor:'#60c8ff',sfx:'skill'},
    {id:'sw09',name:'剑舞乾坤',icon:'🌀',school:'剑系',desc:'剑法如舞，连续8击各60%伤害，且必定命中',cd:12,mpCost:40,type:'damage',hits:8,multiplier:0.55,alwaysHit:true,frames:[`✦⚔✦⚔✦\n─O─\n剑舞乾坤！`],bigText:'剑舞乾坤！',bigColor:'#90d8ff',sfx:'wind'},
    {id:'sw10',name:'破甲剑',icon:'⚡',school:'剑系',desc:'专破护甲，造成180%伤害，降低对方防御60%持续6秒',cd:9,mpCost:30,type:'debuff',multiplier:1.6,defDebuff:.6,debuffDur:6,frames:[`O─⚔\n破─甲！`],bigText:'破甲剑！',bigColor:'#70c0ff',sfx:'thunder'},
  ],

  // ── 佛系 ──────────────────────────────────────
  buddha: [
    {id:'bd_l1',name:'普通一掌',icon:'🤚',school:'佛系',desc:'平推一掌，造成65%伤害',cd:1,mpCost:5,type:'damage',multiplier:0.65,frames:[`O─掌`],bigText:'一掌！',bigColor:'#f0c040',sfx:'hit'},
    {id:'bd_l2',name:'小愈咒',icon:'💚',school:'佛系',desc:'简单佛咒，回复8%气血',cd:2,mpCost:8,type:'heal',healPct:.08,frames:[`✦O✦`],bigText:'小愈！',bigColor:'#44ff88',sfx:'heal'},
    {id:'bd_l3',name:'金刚小护',icon:'🛡️',school:'佛系',desc:'佛门护体，防御+20%，持续3秒',cd:3,mpCost:10,type:'buff',defBuff:.2,buffDur:3,frames:[`卍O卍`],bigText:'护体！',bigColor:'#f0c040',sfx:'shield'},
    {id:'bd01',name:'金刚护体',icon:'🛡️',school:'佛系',desc:'佛光护体，抵挡下3次攻击减伤60%，持续6秒',cd:8,mpCost:28,type:'shield',shieldHits:3,shieldDur:6,frames:[`★╭─────╮★\n★│ ◎_◎ │★\n★│卍卍卍│★\n★╰──┬──╯★`],bigText:'金刚护体！',bigColor:'#40b0ff',sfx:'shield'},
    {id:'bd02',name:'如来神掌',icon:'☸️',school:'佛系',desc:'佛门绝技！造成220%伤害，对方血量低于30%追加60%',cd:10,mpCost:36,type:'execute',multiplier:2.0,execBonus:0.6,frames:[`卍卍如来卍卍\n卍卍神掌卍卍\n如来神掌！`],bigText:'如来神掌！',bigColor:'#f0c060',sfx:'heavy'},
    {id:'bd03',name:'木鱼诵经',icon:'📿',school:'佛系',desc:'诵经回血30%，清除负面状态，防御+30%持续5秒',cd:11,mpCost:40,type:'heal',healPct:0.3,cleanse:true,frames:[`南无阿弥陀佛\n ╭(◎_◎)╮\n │ 诵经 │\n ╰─────╯`],bigText:'木鱼诵经！',bigColor:'#44ff88',sfx:'heal'},
    {id:'bd04',name:'金刚怒目',icon:'😤',school:'佛系',desc:'佛怒爆发，攻击+80%，每击附加30%眩晕概率，持续6秒',cd:9,mpCost:32,type:'buff',atkBuff:.8,defDebuff:.1,buffDur:6,frames:[`卍卍卍卍卍\n╔│◎▽◎│╗\n金刚怒目！`],bigText:'金刚怒目！',bigColor:'#ff8820',sfx:'rage'},
    {id:'bd05',name:'法相天地',icon:'🌐',school:'佛系',desc:'法相显现，连续5掌每掌100%伤害，无视防御',cd:13,mpCost:48,type:'damage',hits:5,multiplier:0.9,ignoreDefense:true,frames:[`卍卍卍卍卍卍\n(◎_◎)法相\n卍卍卍卍卍卍\n法相天地！`],bigText:'法相天地！',bigColor:'#ffd060',sfx:'holy'},
    {id:'bd06',name:'般若波罗蜜',icon:'☸️',school:'佛系',desc:'智慧之光，沉默敌方4秒，回复自身25%血量',cd:10,mpCost:36,type:'heal',healPct:.25,silenceEnemy:4,frames:[`☸☸☸\n╭(◎_◎)╮\n般若波罗蜜！\n☸☸☸`],bigText:'般若波罗蜜！',bigColor:'#ffe8a0',sfx:'holy'},
    {id:'bd07',name:'涅槃重生',icon:'🔥',school:'佛系',desc:'涅槃之火，血量恢复至60%，同时造成150%伤害',cd:18,mpCost:65,type:'heal',healPctAbs:.6,multiplier:1.3,frames:[`🔥卍🔥\n╭(◎_◎)╮\n涅槃重生！\n🔥卍🔥`],bigText:'涅槃重生！',bigColor:'#ff6020',sfx:'fire'},
    {id:'bd08',name:'佛光普照',icon:'✨',school:'佛系',desc:'圣光降临，为自身回血20%并净化所有状态，发光护盾持续5秒',cd:12,mpCost:44,type:'heal',healPct:.2,cleanse:true,shieldAbs:200,shieldDur:5,frames:[`✨✨✨✨✨\n(◎_◎)光\n✨✨✨✨✨\n佛光普照！`],bigText:'佛光普照！',bigColor:'#ffffc0',sfx:'holy'},
    {id:'bd09',name:'舍利佛光',icon:'💎',school:'佛系',desc:'舍利子显圣，对周围造成240%圣系伤害，眩晕2秒',cd:14,mpCost:52,type:'stun',multiplier:2.2,stunDur:2,frames:[`💎卍💎\n(◎_◎)\n舍利佛光！\n💎卍💎`],bigText:'舍利佛光！',bigColor:'#f8f0a0',sfx:'holy'},
    {id:'bd10',name:'大悲咒',icon:'🙏',school:'佛系',desc:'持续诵咒，每秒回血5%共5秒，同时每秒对敌方造成3%伤害',cd:15,mpCost:55,type:'dot',healPct:.05,healDur:5,dotDmg:.03,dotDur:5,frames:[`卍卍卍\n(◎_◎)\n南无大悲咒\n卍卍卍`],bigText:'大悲咒！',bigColor:'#c8e8ff',sfx:'heal'},
  ],

  // ── 道系 ──────────────────────────────────────
  tao: [
    {id:'ta_l1',name:'推掌',icon:'✋',school:'道系',desc:'以柔劲推出，造成60%伤害',cd:1,mpCost:5,type:'damage',multiplier:0.6,frames:[`─O→`],bigText:'推掌！',bigColor:'#60e8e8',sfx:'hit'},
    {id:'ta_l2',name:'吐纳运气',icon:'🌬️',school:'道系',desc:'运气调息，回复10%内力',cd:2,mpCost:8,type:'heal',healPct:.1,frames:[`○─O─○`],bigText:'吐纳！',bigColor:'#60e8e8',sfx:'heal'},
    {id:'ta_l3',name:'微步',icon:'👣',school:'道系',desc:'小幅位移，下次攻击命中率+50%，持续2秒',cd:3,mpCost:10,type:'buff',alwaysHit:true,buffDur:2,frames:[`O→`],bigText:'微步！',bigColor:'#80ffff',sfx:'wind'},
    {id:'ta01',name:'太极推手',icon:'☯️',school:'道系',desc:'以柔克刚，造成100%伤害，降低对方攻击力30%',cd:5,mpCost:16,type:'debuff',multiplier:0.9,atkDebuff:.3,debuffDur:4,frames:[`☯─O─☯\n太极推手！`],bigText:'太极推手！',bigColor:'#80d0d0',sfx:'skill'},
    {id:'ta02',name:'乾坤挪移',icon:'🌀',school:'道系',desc:'反弹对方下次攻击，并附加眩晕2秒',cd:7,mpCost:24,type:'buff',reflect:true,frames:[`☯☯☯\n─O─\n│乾坤│\n│挪移│\n☯☯☯`],bigText:'乾坤挪移！',bigColor:'#80ffff',sfx:'shield'},
    {id:'ta03',name:'凌波微步',icon:'💫',school:'道系',desc:'飘然而至，连续5击各70%伤害，必定暴击',cd:12,mpCost:44,type:'damage',hits:5,multiplier:0.65,forceCrit:true,frames:[`～～～\n─O─\n凌波微步\n～～～`],bigText:'凌波微步！',bigColor:'#60e0e0',sfx:'skill'},
    {id:'ta04',name:'飞剑诛心',icon:'⚔️',school:'道系',desc:'御剑穿心，造成200%伤害，必定暴击，无视防御',cd:10,mpCost:36,type:'damage',multiplier:1.8,forceCrit:true,ignoreDefense:true,frames:[`☯\n剑─O─剑\n诛心！`],bigText:'飞剑诛心！',bigColor:'#c0ffff',sfx:'wind'},
    {id:'ta05',name:'道法无形',icon:'👻',school:'道系',desc:'化为无形，下2次攻击必定闪避，持续4秒',cd:9,mpCost:32,type:'buff',dodgeBuff:2,buffDur:4,frames:[`～～～\n O\n～无形～\n～～～`],bigText:'道法无形！',bigColor:'#60e0e0',sfx:'wind'},
    {id:'ta06',name:'阴阳转化',icon:'☯️',school:'道系',desc:'阴阳互换，吸取对方攻击力20%加到自身，持续6秒',cd:11,mpCost:40,type:'debuff',atkDebuff:.2,atkBuff:.2,debuffDur:6,buffDur:6,frames:[`☯☯\n→O←\n阴阳转化！`],bigText:'阴阳转化！',bigColor:'#80e8e8',sfx:'skill'},
    {id:'ta07',name:'天道诛邪',icon:'⚡',school:'道系',desc:'天道雷击！造成350%伤害，眩晕3秒，降低对方防御50%',cd:16,mpCost:60,type:'stun',multiplier:3.0,stunDur:3,defDebuff:.5,debuffDur:6,frames:[`☯⚡☯\nO\n天道诛邪！！\n☯⚡☯`],bigText:'天道诛邪！！',bigColor:'#80ffff',sfx:'thunder'},
    {id:'ta08',name:'无极归一',icon:'∞',school:'道系',desc:'天地合一，清除所有状态，防御和攻击提升各40%，持续7秒',cd:14,mpCost:52,type:'buff',atkBuff:.4,defBuff:.4,cleanse:true,buffDur:7,frames:[`∞─O─∞\n无极归一！\n∞∞∞`],bigText:'无极归一！',bigColor:'#a0ffff',sfx:'holy'},
    {id:'ta09',name:'玄冥二老',icon:'🌊',school:'道系',desc:'双掌玄冥，造成260%伤害，附带冰冻2秒降低对方速度',cd:13,mpCost:48,type:'stun',multiplier:2.4,stunDur:2,frames:[`🌊─O─🌊\n玄冥二老！`],bigText:'玄冥二老！',bigColor:'#60d0ff',sfx:'ice'},
    {id:'ta10',name:'太清道韵',icon:'🌙',school:'道系',desc:'道韵流转，下一招攻击力翻倍，且附带持续伤害',cd:10,mpCost:36,type:'buff',atkBuff:1.0,buffDur:1,dotDmg:.04,dotDur:5,frames:[`🌙☯🌙\n太清道韵！\n🌙☯🌙`],bigText:'太清道韵！',bigColor:'#80d8ff',sfx:'wind'},
  ],

  // ── 力系 ──────────────────────────────────────
  force: [
    {id:'fo_l1',name:'直拳',icon:'👊',school:'力系',desc:'直接一拳，造成75%伤害',cd:1,mpCost:4,type:'damage',multiplier:0.75,frames:[`O─👊`],bigText:'直拳！',bigColor:'#e09050',sfx:'hit'},
    {id:'fo_l2',name:'推撞',icon:'💪',school:'力系',desc:'以身推撞，造成85%伤害，10%概率眩晕0.5秒',cd:2,mpCost:6,type:'stun',multiplier:0.85,stunChance:.1,stunDur:.5,frames:[`O→→`],bigText:'撞！',bigColor:'#c87040',sfx:'heavy'},
    {id:'fo_l3',name:'硬抗',icon:'🦴',school:'力系',desc:'硬扛下来，防御+40%，持续2秒',cd:3,mpCost:8,type:'buff',defBuff:.4,buffDur:2,frames:[`║O║`],bigText:'硬抗！',bigColor:'#e09050',sfx:'shield'},
    {id:'fo01',name:'山岳重拳',icon:'👊',school:'力系',desc:'重拳出击！造成180%伤害，眩晕2秒',cd:6,mpCost:18,type:'stun',multiplier:1.6,stunDur:2,frames:[`╔═╗拳╔═╗\n║▓║←→║▓║\n山岳重拳！`],bigText:'山岳重拳！',bigColor:'#c87040',sfx:'heavy'},
    {id:'fo02',name:'暴熊狂怒',icon:'🔥',school:'力系',desc:'进入狂怒，攻击力+60%，防御-20%，持续6秒',cd:9,mpCost:28,type:'buff',atkBuff:.6,defDebuff:.2,buffDur:6,frames:[`╔═╗🔥╔═╗\n║▓║  ║▓║\n暴熊狂怒！`],bigText:'暴熊狂怒！',bigColor:'#ff6020',sfx:'heavy'},
    {id:'fo03',name:'铁山靠',icon:'⛰️',school:'力系',desc:'以身为山，造成250%伤害，无视护盾和反弹',cd:14,mpCost:50,type:'execute',multiplier:2.2,ignoreShield:true,frames:[`╔═══╗\n║▓▓▓║\n╠═══╣\n铁山靠！！`],bigText:'铁山靠！！',bigColor:'#e09050',sfx:'heavy'},
    {id:'fo04',name:'地裂踏破',icon:'🌍',school:'力系',desc:'震地一踏，造成130%伤害，降低对方防御45%',cd:8,mpCost:24,type:'debuff',multiplier:1.2,defDebuff:.45,debuffDur:5,frames:[`║▓▓▓║\n╠═══╣\n地─裂─踏─破！`],bigText:'地裂踏破！',bigColor:'#c87040',sfx:'thunder'},
    {id:'fo05',name:'铁血冲锋',icon:'🏃',school:'力系',desc:'狂暴冲锋，连续4击各90%伤害，冲锋中防御+30%',cd:10,mpCost:32,type:'damage',hits:4,multiplier:0.85,defBuff:.3,buffDur:2,frames:[`╔═╗→→→\n║▓║\n铁血冲锋！`],bigText:'铁血冲锋！',bigColor:'#ff8030',sfx:'rage'},
    {id:'fo06',name:'熊罴之力',icon:'💪',school:'力系',desc:'蓄力爆发，下次攻击伤害+200%，护盾吸收200点',cd:11,mpCost:38,type:'buff',atkBuff:2.0,shieldAbs:200,shieldDur:4,buffDur:1,frames:[`╔═╗💪╔═╗\n║▓▓▓▓▓║\n熊罴之力！`],bigText:'熊罴之力！',bigColor:'#e09050',sfx:'rage'},
    {id:'fo07',name:'崩山碎岳',icon:'💥',school:'力系',desc:'终极一击！造成500%伤害，自身损失15%血量',cd:18,mpCost:65,type:'execute',multiplier:4.5,selfDmgPct:.15,ignoreAll:true,frames:[`⛰╔═══╗⛰\n║▓▓▓▓║\n崩山碎岳！！\n⛰══⛰══⛰`],bigText:'崩山碎岳！！',bigColor:'#ff9040',sfx:'heavy'},
    {id:'fo08',name:'碾压踏步',icon:'🦶',school:'力系',desc:'强力踩踏，造成160%伤害，对方陷入恐惧攻防降25%',cd:9,mpCost:28,type:'debuff',multiplier:1.4,atkDebuff:.25,defDebuff:.25,debuffDur:5,frames:[`踏─踏─踏\n║▓║\n碾压踏步！`],bigText:'碾压踏步！',bigColor:'#d07030',sfx:'heavy'},
    {id:'fo09',name:'血肉之躯',icon:'❤️',school:'力系',desc:'激活血性，自身回血25%，攻防同时提升30%，持续8秒',cd:12,mpCost:40,type:'heal',healPct:.25,atkBuff:.3,defBuff:.3,buffDur:8,frames:[`❤─O─❤\n血肉之躯！\n❤❤❤`],bigText:'血肉之躯！',bigColor:'#ff4040',sfx:'rage'},
    {id:'fo10',name:'千斤坠',icon:'⚓',school:'力系',desc:'体重猛压，造成300%伤害，强制眩晕2.5秒',cd:15,mpCost:55,type:'stun',multiplier:2.8,stunDur:2.5,ignoreShield:true,frames:[`⚓\n O\n千斤坠！！`],bigText:'千斤坠！！',bigColor:'#c06020',sfx:'heavy'},
  ],

  // ── 暗系 ──────────────────────────────────────
  shadow: [
    {id:'sh_l1',name:'飞石',icon:'🪨',school:'暗系',desc:'投出一颗小石子，造成55%伤害',cd:1,mpCost:4,type:'damage',multiplier:0.55,frames:[`O→●`],bigText:'飞石！',bigColor:'#a0a0c0',sfx:'hit'},
    {id:'sh_l2',name:'绊脚',icon:'🦵',school:'暗系',desc:'绊倒对方，眩晕0.5秒',cd:2,mpCost:6,type:'stun',stunDur:.5,frames:[`O→绊`],bigText:'绊！',bigColor:'#8080a0',sfx:'hit'},
    {id:'sh_l3',name:'小毒针',icon:'🪡',school:'暗系',desc:'射出细毒针，造成60%伤害，30%概率轻微中毒3秒',cd:3,mpCost:8,type:'dot',multiplier:0.6,dotChance:.3,dotDmg:.02,dotDur:3,frames:[`O→·`],bigText:'毒针！',bigColor:'#88ee44',sfx:'hit'},
    {id:'sh01',name:'暗器齐发',icon:'⭐',school:'暗系',desc:'飞出6枚暗器，每枚50%伤害，40%概率中毒',cd:5,mpCost:16,type:'dot',hits:6,multiplier:0.45,dotChance:.4,dotDmg:.04,dotDur:5,frames:[`★★★\n(▓_▓)\n★★★\n暗器齐发！`],bigText:'暗器齐发！',bigColor:'#a0a0c0',sfx:'skill'},
    {id:'sh02',name:'影杀',icon:'🌑',school:'暗系',desc:'瞬移到对方背后，造成220%伤害，无视防御',cd:8,mpCost:26,type:'damage',multiplier:2.0,ignoreDefense:true,frames:[`...(▓_▓)...\n影杀！`],bigText:'影 杀！',bigColor:'#8080a0',sfx:'dark'},
    {id:'sh03',name:'毒雾弥漫',icon:'☠️',school:'暗系',desc:'释放毒雾，每秒6%伤害，持续10秒',cd:15,mpCost:55,type:'dot',dotDmg:.06,dotDur:10,frames:[`☠☠☠\n(▓_▓)\n☠☠☠\n毒雾弥漫！`],bigText:'毒雾弥漫！',bigColor:'#60ff60',sfx:'poison'},
    {id:'sh04',name:'幻影残影',icon:'👻',school:'暗系',desc:'幻化三重身，60%概率完全闪避下次攻击，持续5秒',cd:7,mpCost:22,type:'buff',dodgeBuff:3,buffDur:5,frames:[`░░░░░░\n░(▓_▓)░\n幻影残影！`],bigText:'幻影残影！',bigColor:'#b0b0e0',sfx:'dark'},
    {id:'sh05',name:'黑暗吞噬',icon:'🌑',school:'暗系',desc:'黑暗爆发！造成200%伤害，眩晕2秒，沉默3秒',cd:12,mpCost:42,type:'stun',multiplier:1.8,stunDur:2,silenceEnemy:3,frames:[`░░░░░░\n(▓▓▓)\n黑暗吞噬！\n░░░░░░`],bigText:'黑暗吞噬！',bigColor:'#6060a0',sfx:'dark'},
    {id:'sh06',name:'血刃淬毒',icon:'💉',school:'暗系',desc:'以血炼毒，自损5%血量，造成180%伤害，必定中毒8秒',cd:9,mpCost:30,type:'dot',multiplier:1.6,selfDmgPct:.05,dotChance:1,dotDmg:.06,dotDur:8,frames:[`💉(▓_▓)💉\n血刃淬毒！`],bigText:'血刃淬毒！',bigColor:'#88ff44',sfx:'poison'},
    {id:'sh07',name:'影神杀灭',icon:'💀',school:'暗系',desc:'影门绝技，造成450%伤害，无视一切，自损20%血量',cd:18,mpCost:65,type:'execute',multiplier:4.0,selfDmgPct:.2,ignoreAll:true,frames:[`☠░░░░☠\n(▓▓▓)\n影神杀灭！！\n☠░░░░☠`],bigText:'影神杀灭！！',bigColor:'#8080c0',sfx:'dark'},
    {id:'sh08',name:'绝命暗箭',icon:'🏹',school:'暗系',desc:'远程必中，造成190%伤害，有50%概率追加眩晕1.5秒',cd:7,mpCost:22,type:'damage',multiplier:1.7,alwaysHit:true,stunChance:.5,stunDur:1.5,frames:[`(▓_▓)→→🏹\n绝命暗箭！`],bigText:'绝命暗箭！',bigColor:'#9090c0',sfx:'skill'},
    {id:'sh09',name:'噬灵术',icon:'🕸️',school:'暗系',desc:'吸取对方20%血量，转化为自身气血',cd:10,mpCost:34,type:'heal',drainPct:.2,frames:[`🕸─(▓_▓)─🕸\n噬灵术！`],bigText:'噬灵术！',bigColor:'#8060c0',sfx:'dark'},
    {id:'sh10',name:'千影乱',icon:'🌀',school:'暗系',desc:'分身千道，连续8击各45%伤害，每击随机切换攻击部位',cd:11,mpCost:36,type:'damage',hits:8,multiplier:0.4,alwaysHit:true,frames:[`░○░○░\n(▓_▓)\n千影乱！！`],bigText:'千影乱！！',bigColor:'#7070b0',sfx:'dark'},
  ],

  // ── 毒系 ──────────────────────────────────────
  poison: [
    {id:'po_l1',name:'毒吐沫',icon:'💦',school:'毒系',desc:'吐出少量毒液，35%概率中轻毒3秒',cd:1,mpCost:5,type:'dot',dotChance:.35,dotDmg:.02,dotDur:3,frames:[`O→·`],bigText:'毒！',bigColor:'#88ff44',sfx:'hit'},
    {id:'po_l2',name:'抓毒',icon:'🤌',school:'毒系',desc:'爪抓对方，造成65%伤害，25%概率轻微中毒',cd:2,mpCost:7,type:'dot',multiplier:0.65,dotChance:.25,dotDmg:.02,dotDur:4,frames:[`O─爪`],bigText:'抓！',bigColor:'#70ee30',sfx:'hit'},
    {id:'po_l3',name:'毒烟弹',icon:'💨',school:'毒系',desc:'投出小毒烟弹，降低对方攻击10%，持续4秒',cd:3,mpCost:10,type:'debuff',atkDebuff:.1,debuffDur:4,frames:[`O→☁`],bigText:'毒烟！',bigColor:'#a0ff60',sfx:'poison'},
    {id:'po01',name:'万毒朝宗',icon:'🐍',school:'毒系',desc:'毒法大成，中毒每秒损失6%血量，持续10秒，不可清除',cd:10,mpCost:36,type:'dot',dotDmg:.06,dotDur:10,uncleansable:true,frames:[`🐍🐍🐍\n(⊙_⊙)\n万毒朝宗！\n🐍🐍🐍`],bigText:'万毒朝宗！',bigColor:'#88ff44',sfx:'poison'},
    {id:'po02',name:'蛊虫附体',icon:'🪲',school:'毒系',desc:'蛊虫入体，攻防各降30%，每5秒20%伤害，持续15秒',cd:12,mpCost:44,type:'debuff',atkDebuff:.3,defDebuff:.3,debuffDur:15,dotDmg:.2,dotInterval:5,frames:[`🪲🪲🪲\n(⊙_⊙)\n蛊虫附体！\n🪲🪲🪲`],bigText:'蛊虫附体！',bigColor:'#60dd20',sfx:'poison'},
    {id:'po03',name:'起死回生',icon:'💀',school:'毒系',desc:'以命换命，自损30%血量，对对方造成400%伤害',cd:16,mpCost:58,type:'execute',multiplier:3.5,selfDmgPct:.3,frames:[`💀\n(⊙_⊙)\n起死回生！\n💀`],bigText:'起死回生！',bigColor:'#00ff88',sfx:'poison'},
    {id:'po04',name:'五毒轮转',icon:'🌀',school:'毒系',desc:'五毒同发，依次中毒5次，每次伤害递增',cd:11,mpCost:40,type:'dot',hits:5,multiplier:0.1,dotChance:1,dotDmg:.05,dotDur:6,frames:[`🐍🪲🦂🐸🦟\n(⊙_⊙)\n五毒轮转！`],bigText:'五毒轮转！',bigColor:'#60ff40',sfx:'poison'},
    {id:'po05',name:'蛊王降世',icon:'👑',school:'毒系',desc:'蛊王现身，攻击力+100%，使对方防御降低40%',cd:13,mpCost:48,type:'buff',atkBuff:1.0,atkDebuff:.4,debuffDur:7,buffDur:7,frames:[`👑(⊙_⊙)👑\n蛊王降世！！`],bigText:'蛊王降世！！',bigColor:'#88ff44',sfx:'dark'},
    {id:'po06',name:'阴阳蛊毒',icon:'☯️',school:'毒系',desc:'阴阳双毒，造成120%伤害，攻防各降40%持续8秒',cd:10,mpCost:36,type:'debuff',multiplier:1.1,atkDebuff:.4,defDebuff:.4,debuffDur:8,frames:[`🐍☯🐍\n(⊙_⊙)\n阴阳蛊毒！`],bigText:'阴阳蛊毒！',bigColor:'#a0ff60',sfx:'poison'},
    {id:'po07',name:'死亡诅咒',icon:'💀',school:'毒系',desc:'死亡诅咒，造成200%伤害，中毒15秒不可解，攻防降30%',cd:18,mpCost:65,type:'execute',multiplier:1.8,dotChance:1,dotDmg:.07,dotDur:15,uncleansable:true,atkDebuff:.3,defDebuff:.3,debuffDur:15,frames:[`💀☠💀\n(⊙▽⊙)\n死亡诅咒！！\n💀☠💀`],bigText:'死亡诅咒！！',bigColor:'#00ff88',sfx:'dark'},
    {id:'po08',name:'七步断肠散',icon:'☠️',school:'毒系',desc:'剧毒入体，立即造成100%伤害，之后每秒持续8%，共7秒',cd:11,mpCost:40,type:'dot',multiplier:0.9,dotChance:1,dotDmg:.08,dotDur:7,frames:[`☠──O──☠\n七步断肠散！`],bigText:'七步断肠散！',bigColor:'#88ff20',sfx:'poison'},
    {id:'po09',name:'回春解毒',icon:'🌿',school:'毒系',desc:'以毒攻毒，清除自身所有状态，回复30%血量',cd:12,mpCost:42,type:'heal',healPct:.3,cleanse:true,frames:[`🌿─O─🌿\n回春解毒！`],bigText:'回春解毒！',bigColor:'#40ff80',sfx:'heal'},
    {id:'po10',name:'百花乱心',icon:'🌺',school:'毒系',desc:'迷魂药毒，使对方攻击力降低50%并陷入混乱2秒',cd:9,mpCost:32,type:'stun',stunDur:2,atkDebuff:.5,debuffDur:6,frames:[`🌺─O─🌺\n百花乱心！\n🌺🌺🌺`],bigText:'百花乱心！',bigColor:'#c0ff60',sfx:'poison'},
  ],

  // ── 冰系 ──────────────────────────────────────
  ice: [
    {id:'ic_l1',name:'冰碎',icon:'🧊',school:'冰系',desc:'投出冰块砸人，造成65%伤害',cd:1,mpCost:5,type:'damage',multiplier:0.65,frames:[`O→🧊`],bigText:'冰碎！',bigColor:'#c0e0ff',sfx:'hit'},
    {id:'ic_l2',name:'寒气',icon:'❄️',school:'冰系',desc:'释放寒气，降低对方攻击15%，持续3秒',cd:2,mpCost:8,type:'debuff',atkDebuff:.15,debuffDur:3,frames:[`O❄❄`],bigText:'寒气！',bigColor:'#80c0ff',sfx:'ice'},
    {id:'ic_l3',name:'薄冰护',icon:'🌊',school:'冰系',desc:'薄冰护体，防御+25%，持续3秒',cd:3,mpCost:10,type:'buff',defBuff:.25,buffDur:3,frames:[`❄O❄`],bigText:'护盾！',bigColor:'#a0d8ff',sfx:'shield'},
    {id:'ic01',name:'御剑术',icon:'⚔️',school:'冰系',desc:'御剑飞行，造成150%伤害，附带冰封2秒',cd:5,mpCost:17,type:'stun',multiplier:1.4,stunDur:2,frames:[`☁☁\n剑→O→剑\n御剑术！`],bigText:'御剑术！',bigColor:'#c0e0ff',sfx:'ice'},
    {id:'ic02',name:'玉女心经',icon:'❄️',school:'冰系',desc:'心法迷惑，对方攻击-40%，自身防御+30%，持续6秒',cd:8,mpCost:28,type:'buff',atkDebuffE:.4,defBuffS:.3,buffDur:6,frames:[`❄❄❄\n～O～\n玉女心经！`],bigText:'玉女心经！',bigColor:'#80c0ff',sfx:'shield'},
    {id:'ic03',name:'天罗地网剑法',icon:'🌐',school:'冰系',desc:'剑网漫天，连续10次攻击，每次40%伤害，全部必中',cd:14,mpCost:52,type:'damage',hits:10,multiplier:0.38,alwaysHit:true,frames:[`☁剑剑剑☁\n  ─O─\n天罗地网！\n☁剑剑剑☁`],bigText:'天罗地网！',bigColor:'#a0d0ff',sfx:'ice'},
    {id:'ic04',name:'冰心诀',icon:'💎',school:'冰系',desc:'冰结精神，对方攻击力降低50%，持续7秒',cd:9,mpCost:32,type:'debuff',atkDebuff:.5,debuffDur:7,frames:[`❄💎❄\n─O─\n冰心诀！\n❄❄❄`],bigText:'冰心诀！',bigColor:'#a0e8ff',sfx:'ice'},
    {id:'ic05',name:'玉女双剑',icon:'⚔️',school:'冰系',desc:'双剑齐出，造成220%伤害，必定暴击',cd:10,mpCost:36,type:'damage',multiplier:2.0,forceCrit:true,frames:[`⚔─O─⚔\n玉女双剑！`],bigText:'玉女双剑！',bigColor:'#d0f0ff',sfx:'ice'},
    {id:'ic06',name:'千蛛万毒手',icon:'🕷️',school:'冰系',desc:'蜘蛛手法，造成180%伤害，必定中毒8秒',cd:10,mpCost:36,type:'dot',multiplier:1.6,dotChance:1,dotDmg:.055,dotDur:8,frames:[`🕷─O─🕷\n千蛛万毒手！`],bigText:'千蛛万毒手！',bigColor:'#88aaff',sfx:'poison'},
    {id:'ic07',name:'冰封千里',icon:'🏔️',school:'冰系',desc:'冰封大地，造成280%伤害，强制眩晕3秒，降低对方速度',cd:15,mpCost:55,type:'stun',multiplier:2.5,stunDur:3,frames:[`🏔❄🏔\n O \n冰封千里！！\n❄❄❄❄❄`],bigText:'冰封千里！！',bigColor:'#c0f0ff',sfx:'ice'},
    {id:'ic08',name:'寒玉掌',icon:'🌊',school:'冰系',desc:'寒意入骨，造成170%伤害，且降低对方防御35%',cd:8,mpCost:26,type:'debuff',multiplier:1.5,defDebuff:.35,debuffDur:6,frames:[`🌊─O─🌊\n寒玉掌！`],bigText:'寒玉掌！',bigColor:'#80d8ff',sfx:'ice'},
    {id:'ic09',name:'冰晶护盾',icon:'🛡️',school:'冰系',desc:'冰晶成盾，吸收350点伤害，护盾破碎时反弹冰冻',cd:11,mpCost:40,type:'shield',shieldAbs:350,shieldDur:7,frames:[`❄╭─O─╮❄\n冰晶护盾！\n❄❄❄`],bigText:'冰晶护盾！',bigColor:'#b0e8ff',sfx:'ice'},
    {id:'ic10',name:'极寒领域',icon:'❄️',school:'冰系',desc:'创造极寒领域，攻防各+30%，敌方持续受到冰冻效果',cd:16,mpCost:58,type:'buff',atkBuff:.3,defBuff:.3,buffDur:8,dotDmg:.025,dotDur:8,frames:[`❄❄❄❄❄\n─O─\n极寒领域！\n❄❄❄❄❄`],bigText:'极寒领域！',bigColor:'#d0f8ff',sfx:'ice'},
  ],

  // ── 火系 ──────────────────────────────────────
  fire: [
    {id:'fi_l1',name:'小火球',icon:'🔥',school:'火系',desc:'扔出小火球，造成70%伤害',cd:1,mpCost:4,type:'damage',multiplier:0.7,frames:[`O→🔥`],bigText:'火球！',bigColor:'#ff7030',sfx:'hit'},
    {id:'fi_l2',name:'火焰拍',icon:'🤚',school:'火系',desc:'以火掌拍击，造成80%伤害，20%概率轻微灼烧2秒',cd:2,mpCost:6,type:'dot',multiplier:0.8,dotChance:.2,dotDmg:.02,dotDur:2,frames:[`O─🔥`],bigText:'火拍！',bigColor:'#ff6020',sfx:'hit'},
    {id:'fi_l3',name:'点火',icon:'🕯️',school:'火系',desc:'给自己点燃斗志，攻击+20%，持续3秒',cd:3,mpCost:8,type:'buff',atkBuff:.2,buffDur:3,frames:[`🕯O🕯`],bigText:'点火！',bigColor:'#ff8840',sfx:'fire'},
    {id:'fi01',name:'烈火斩',icon:'🔥',school:'火系',desc:'火焰护体一刀斩出，造成190%伤害，附带灼烧3秒',cd:6,mpCost:18,type:'dot',multiplier:1.7,dotChance:1,dotDmg:.04,dotDur:3,frames:[`🔥─O─🔥\n烈火斩！`],bigText:'烈火斩！',bigColor:'#ff7030',sfx:'fire'},
    {id:'fi02',name:'火云掌',icon:'☁️',school:'火系',desc:'火云降临，造成160%伤害，使对方陷入恐惧减速',cd:7,mpCost:22,type:'debuff',multiplier:1.4,atkDebuff:.25,debuffDur:5,frames:[`☁🔥☁\n─O─\n火云掌！`],bigText:'火云掌！',bigColor:'#ff6020',sfx:'fire'},
    {id:'fi03',name:'焚天剑气',icon:'🌋',school:'火系',desc:'剑气如焰，造成250%伤害，必定暴击',cd:11,mpCost:40,type:'damage',multiplier:2.3,forceCrit:true,frames:[`🌋─O─🌋\n焚天剑气！\n🔥🔥🔥`],bigText:'焚天剑气！',bigColor:'#ff5020',sfx:'fire'},
    {id:'fi04',name:'真火三昧',icon:'🌞',school:'火系',desc:'真火觉醒，攻击力+90%，并附带灼烧概率，持续7秒',cd:13,mpCost:48,type:'buff',atkBuff:.9,buffDur:7,dotChance:.5,dotDmg:.04,dotDur:4,frames:[`🌞🔥🌞\n─O─\n真火三昧！`],bigText:'真火三昧！',bigColor:'#ff8840',sfx:'fire'},
    {id:'fi05',name:'焰魂之怒',icon:'💢',school:'火系',desc:'焰魂爆发，造成400%伤害，自损10%血量，无视防御',cd:16,mpCost:60,type:'execute',multiplier:3.5,selfDmgPct:.1,ignoreDefense:true,frames:[`💢🔥💢\n O \n焰魂之怒！！\n🔥🔥🔥🔥`],bigText:'焰魂之怒！！',bigColor:'#ff4000',sfx:'fire'},
    {id:'fi06',name:'炎爆',icon:'💥',school:'火系',desc:'炸裂一击，造成220%伤害，使周围陷入灼烧持续4秒',cd:9,mpCost:32,type:'dot',multiplier:2.0,dotChance:1,dotDmg:.045,dotDur:4,frames:[`💥O💥\n炎爆！！`],bigText:'炎 爆！！',bigColor:'#ff6030',sfx:'fire'},
    {id:'fi07',name:'凤凰涅槃',icon:'🐦',school:'火系',desc:'涅槃重生，回血至70%，下一次攻击伤害+300%',cd:20,mpCost:70,type:'heal',healPctAbs:.7,atkBuff:3.0,buffDur:1,frames:[`🐦🔥🐦\n─O─\n凤凰涅槃！\n🔥🔥🔥🔥`],bigText:'凤凰涅槃！',bigColor:'#ff9040',sfx:'fire'},
    {id:'fi08',name:'火海连天',icon:'🌊',school:'火系',desc:'炽焰如海，连续8击各55%伤害，必定附带灼烧4秒',cd:14,mpCost:50,type:'dot',hits:8,multiplier:0.5,dotChance:1,dotDmg:.045,dotDur:4,frames:[`🔥🔥🔥🔥🔥\n─O─\n火海连天！\n🔥🔥🔥🔥🔥`],bigText:'火海连天！',bigColor:'#ff5000',sfx:'fire'},
    {id:'fi09',name:'炼狱之门',icon:'🌋',school:'火系',desc:'开启炼狱之门！造成600%伤害，无视一切防御，自损25%气血',cd:22,mpCost:78,type:'execute',multiplier:5.0,selfDmgPct:.25,ignoreAll:true,forceCrit:true,frames:[`🌋🔥🌋\n门─O─门\n炼狱之门！！\n🔥🔥🔥🔥🔥🔥`],bigText:'炼狱之门！！',bigColor:'#ff2000',sfx:'fire'},
    {id:'fi10',name:'不死鸟之翎',icon:'🪶',school:'火系',desc:'凤羽护体，吸收600点伤害，护盾消散时爆发反击造成200%伤害',cd:17,mpCost:62,type:'shield',shieldAbs:600,shieldDur:6,multiplier:2.0,frames:[`🪶🔥🪶\n─O─\n不死鸟之翎！\n🔥🪶🔥`],bigText:'不死鸟之翎！',bigColor:'#ff8000',sfx:'fire'},
  ],

  // ── 雷系 ──────────────────────────────────────
  thunder: [
    {id:'th_l1',name:'小电弧',icon:'⚡',school:'雷系',desc:'放出小电弧，造成65%伤害',cd:1,mpCost:5,type:'damage',multiplier:0.65,frames:[`O→⚡`],bigText:'电弧！',bigColor:'#ffe040',sfx:'hit'},
    {id:'th_l2',name:'麻痹弹',icon:'🔋',school:'雷系',desc:'释放电力，30%概率麻痹对方0.5秒',cd:2,mpCost:7,type:'stun',stunChance:.3,stunDur:.5,frames:[`O⚡⚡`],bigText:'麻痹！',bigColor:'#ffd030',sfx:'thunder'},
    {id:'th_l3',name:'静电护',icon:'🌩️',school:'雷系',desc:'静电护体，防御+20%，受击时10%反弹电击伤害',cd:3,mpCost:10,type:'buff',defBuff:.2,buffDur:3,frames:[`⚡O⚡`],bigText:'静电！',bigColor:'#ffee50',sfx:'shield'},
    {id:'th01',name:'雷鸣掌',icon:'⚡',school:'雷系',desc:'雷鸣震天，造成170%伤害，有40%概率眩晕1.5秒',cd:6,mpCost:19,type:'stun',multiplier:1.5,stunChance:.4,stunDur:1.5,frames:[`⚡─O─⚡\n雷鸣掌！`],bigText:'雷鸣掌！',bigColor:'#ffe040',sfx:'thunder'},
    {id:'th02',name:'天雷破',icon:'🌩️',school:'雷系',desc:'天雷贯穿，造成230%伤害，无视防御',cd:10,mpCost:36,type:'damage',multiplier:2.1,ignoreDefense:true,frames:[`🌩─O─🌩\n天雷破！\n⚡⚡⚡`],bigText:'天雷破！',bigColor:'#ffd030',sfx:'thunder'},
    {id:'th03',name:'万雷轰顶',icon:'🌌',school:'雷系',desc:'万道雷光齐劈，连续6击各70%伤害',cd:12,mpCost:44,type:'damage',hits:6,multiplier:0.65,frames:[`⚡⚡⚡⚡⚡\n─O─\n万雷轰顶！\n⚡⚡⚡⚡⚡`],bigText:'万雷轰顶！',bigColor:'#ffe060',sfx:'thunder'},
    {id:'th04',name:'雷霆震怒',icon:'⛈️',school:'雷系',desc:'雷霆爆发，攻击+60%，每次攻击附带30%概率麻痹0.8秒',cd:10,mpCost:36,type:'buff',atkBuff:.6,buffDur:7,stunChance:.3,stunDur:.8,frames:[`⛈─O─⛈\n雷霆震怒！`],bigText:'雷霆震怒！',bigColor:'#ffee50',sfx:'thunder'},
    {id:'th05',name:'雷神降临',icon:'🌟',school:'雷系',desc:'雷神降临，造成380%伤害，眩晕3秒，降低对方攻防50%',cd:17,mpCost:62,type:'stun',multiplier:3.3,stunDur:3,atkDebuff:.5,defDebuff:.5,debuffDur:7,frames:[`🌟⚡🌟\n─O─\n雷神降临！！\n⚡⚡⚡⚡⚡`],bigText:'雷神降临！！',bigColor:'#ffff80',sfx:'thunder'},
    {id:'th06',name:'电光石火',icon:'💡',school:'雷系',desc:'极速一击，造成200%伤害，必定暴击，速度提升',cd:8,mpCost:26,type:'damage',multiplier:1.8,forceCrit:true,frames:[`💡─O─💡\n电光石火！`],bigText:'电光石火！',bigColor:'#fff080',sfx:'thunder'},
    {id:'th07',name:'雷狱锁链',icon:'⛓️',school:'雷系',desc:'雷链束缚，造成160%伤害，眩晕3秒，降低对方攻击40%',cd:12,mpCost:44,type:'stun',multiplier:1.4,stunDur:3,atkDebuff:.4,debuffDur:6,frames:[`⛓⚡⛓\n─O─\n雷狱锁链！\n⛓⛓⛓`],bigText:'雷狱锁链！',bigColor:'#ffee44',sfx:'thunder'},
    {id:'th08',name:'九天应元',icon:'🌟',school:'雷系',desc:'九霄雷罚降世，连续9击各60%伤害，每击有20%眩晕',cd:16,mpCost:58,type:'damage',hits:9,multiplier:0.55,stunChance:.2,stunDur:1,frames:[`⚡⚡⚡⚡⚡⚡⚡⚡⚡\n O \n九天应元！！`],bigText:'九天应元！！',bigColor:'#fffb30',sfx:'thunder'},
    {id:'th09',name:'雷火交融',icon:'🌩️',school:'雷系',desc:'雷火双属性融合，造成300%伤害，必定暴击，并灼烧5秒',cd:14,mpCost:52,type:'dot',multiplier:2.6,forceCrit:true,dotChance:1,dotDmg:.05,dotDur:5,frames:[`🌩🔥🌩\n O \n雷火交融！！\n⚡🔥⚡`],bigText:'雷火交融！！',bigColor:'#ffcc00',sfx:'thunder'},
    {id:'th10',name:'末日审判雷',icon:'☄️',school:'雷系',desc:'末日雷降，造成700%伤害，眩晕4秒，无视一切，自损30%气血',cd:25,mpCost:90,type:'stun',multiplier:6.0,stunDur:4,ignoreAll:true,selfDmgPct:.3,forceCrit:true,frames:[`☄⚡☄\n O \n末日审判雷！！\n⚡⚡⚡⚡⚡⚡⚡`],bigText:'末日审判雷！！',bigColor:'#ffff00',sfx:'thunder'},
  ],

  // ── 风系 ──────────────────────────────────────
  wind: [
    {id:'wi_l1',name:'扇风',icon:'🌬️',school:'风系',desc:'以掌扇出一道风，造成60%伤害',cd:1,mpCost:4,type:'damage',multiplier:0.6,frames:[`O─～`],bigText:'扇风！',bigColor:'#c0f0f0',sfx:'hit'},
    {id:'wi_l2',name:'踢腿',icon:'🦵',school:'风系',desc:'快速踢出，造成75%伤害',cd:2,mpCost:6,type:'damage',multiplier:0.75,frames:[`O→腿`],bigText:'踢！',bigColor:'#a0e080',sfx:'hit'},
    {id:'wi_l3',name:'闪步',icon:'💨',school:'风系',desc:'快速闪身，下次攻击必中，持续2秒',cd:3,mpCost:8,type:'buff',alwaysHit:true,buffDur:2,frames:[`O→→`],bigText:'闪步！',bigColor:'#80e080',sfx:'wind'},
    {id:'wi01',name:'踏雪无痕',icon:'🌨️',school:'风系',desc:'极速位移，下2次攻击必中必暴，持续3秒',cd:7,mpCost:22,type:'buff',alwaysHit:true,forceCrit:true,buffDur:3,buffHits:2,frames:[`～～～\n O\n踏雪无痕！`],bigText:'踏雪无痕！',bigColor:'#c0f0f0',sfx:'wind'},
    {id:'wi02',name:'飞花摘叶',icon:'🍃',school:'风系',desc:'随手飞叶，造成150%伤害，50%概率眩晕1秒',cd:6,mpCost:18,type:'stun',multiplier:1.4,stunChance:.5,stunDur:1,frames:[`🍃─O─🍃\n飞花摘叶！`],bigText:'飞花摘叶！',bigColor:'#a0e080',sfx:'wind'},
    {id:'wi03',name:'龙卷风掌',icon:'🌪️',school:'风系',desc:'龙卷席卷，造成210%伤害，使对方连续受到风系伤害3秒',cd:9,mpCost:30,type:'dot',multiplier:1.9,dotChance:1,dotDmg:.035,dotDur:3,frames:[`🌪─O─🌪\n龙卷风掌！`],bigText:'龙卷风掌！',bigColor:'#80e080',sfx:'wind'},
    {id:'wi04',name:'疾风步',icon:'💨',school:'风系',desc:'极速冲刺，连续5击各80%伤害，无法被反弹',cd:8,mpCost:26,type:'damage',hits:5,multiplier:0.75,ignoreShield:true,frames:[`→→O→→\n疾风步！`],bigText:'疾风步！',bigColor:'#90d090',sfx:'wind'},
    {id:'wi05',name:'风神腿',icon:'🦵',school:'风系',desc:'强力踢击，造成240%伤害，击飞后降低对方防御45%',cd:11,mpCost:40,type:'execute',multiplier:2.2,defDebuff:.45,debuffDur:6,frames:[`O→→⚡\n风神腿！！`],bigText:'风神腿！！',bigColor:'#c0e8c0',sfx:'wind'},
    {id:'wi06',name:'八方游龙',icon:'🐉',school:'风系',desc:'分身游龙，连续12击各38%伤害',cd:14,mpCost:50,type:'damage',hits:12,multiplier:0.35,frames:[`🐉─O─🐉\n八方游龙！\n🐉🐉🐉`],bigText:'八方游龙！',bigColor:'#80ff80',sfx:'wind'},
    {id:'wi07',name:'风刃千叠',icon:'🌿',school:'风系',desc:'无数风刃切割，造成260%伤害，同时降低对方防御50%',cd:11,mpCost:40,type:'debuff',multiplier:2.3,defDebuff:.5,debuffDur:6,frames:[`🌿～🌿～🌿\n─O─\n风刃千叠！\n～～～`],bigText:'风刃千叠！',bigColor:'#60e860',sfx:'wind'},
    {id:'wi08',name:'天风无影手',icon:'💨',school:'风系',desc:'无影无形，无法被预判，造成220%伤害，必定命中，无视闪避',cd:9,mpCost:30,type:'damage',multiplier:2.0,alwaysHit:true,ignoreDefense:true,frames:[`～─O─～\n天风无影手！\n～～～`],bigText:'天风无影手！',bigColor:'#a0ffa0',sfx:'wind'},
    {id:'wi09',name:'旋风连踢',icon:'🌀',school:'风系',desc:'旋风暴踢，连续7踢各75%伤害，最后一踢必定暴击',cd:13,mpCost:46,type:'damage',hits:7,multiplier:0.7,forceCrit:true,frames:[`🌀─O─🌀\n旋风连踢！！\n🌀🌀🌀`],bigText:'旋风连踢！！',bigColor:'#70ee70',sfx:'wind'},
    {id:'wi10',name:'天地风华',icon:'🌈',school:'风系',desc:'风系大成，攻防各+60%，免疫眩晕，持续10秒，清除所有负面',cd:20,mpCost:72,type:'buff',atkBuff:.6,defBuff:.6,buffDur:10,cleanse:true,frames:[`🌈🌿🌈\n─O─\n天地风华！！\n🌈🌈🌈`],bigText:'天地风华！！',bigColor:'#c0ffc0',sfx:'wind'},
  ],

  // ── 圣系 ──────────────────────────────────────
  holy: [
    {id:'ho_l1',name:'圣击',icon:'✦',school:'圣系',desc:'简单圣光一击，造成70%伤害',cd:1,mpCost:5,type:'damage',multiplier:0.7,frames:[`O→✦`],bigText:'圣击！',bigColor:'#fff8c0',sfx:'hit'},
    {id:'ho_l2',name:'祷告',icon:'🙏',school:'圣系',desc:'默默祷告，回复8%气血',cd:2,mpCost:8,type:'heal',healPct:.08,frames:[`🙏O🙏`],bigText:'祷告！',bigColor:'#ffffa0',sfx:'heal'},
    {id:'ho_l3',name:'圣光护',icon:'🌟',school:'圣系',desc:'圣光小护盾，吸收60点伤害，持续3秒',cd:3,mpCost:10,type:'shield',shieldAbs:60,shieldDur:3,frames:[`✦O✦`],bigText:'护光！',bigColor:'#ffffd0',sfx:'shield'},
    {id:'ho01',name:'圣光斩',icon:'✦',school:'圣系',desc:'圣光一斩，造成200%圣系伤害，对邪恶属性额外+50%',cd:7,mpCost:23,type:'damage',multiplier:1.8,frames:[`✦─O─✦\n圣光斩！\n✦✦✦`],bigText:'圣光斩！',bigColor:'#fff8c0',sfx:'holy'},
    {id:'ho02',name:'神圣护盾',icon:'🌟',school:'圣系',desc:'圣光护体，吸收500点伤害，期间自动反弹25%伤害',cd:12,mpCost:44,type:'shield',shieldAbs:500,shieldDur:8,reflectPct:.25,frames:[`🌟─O─🌟\n神圣护盾！`],bigText:'神圣护盾！',bigColor:'#ffffa0',sfx:'holy'},
    {id:'ho03',name:'圣愈术',icon:'💫',school:'圣系',desc:'圣光治愈，回复40%血量，并清除所有负面状态',cd:13,mpCost:48,type:'heal',healPct:.4,cleanse:true,frames:[`💫O💫\n圣愈术！\n💫💫💫`],bigText:'圣愈术！',bigColor:'#ffffc0',sfx:'holy'},
    {id:'ho04',name:'审判之光',icon:'⚖️',school:'圣系',desc:'终极审判，造成460%伤害，眩晕3秒，无视所有防御',cd:18,mpCost:65,type:'stun',multiplier:4.0,stunDur:3,ignoreAll:true,frames:[`⚖✦⚖\n O \n审判之光！！\n✦✦✦✦✦`],bigText:'审判之光！！',bigColor:'#ffff80',sfx:'holy'},
    {id:'ho05',name:'圣战意志',icon:'⚔️',school:'圣系',desc:'圣战觉醒，攻击+50%，防御+50%，免疫眩晕，持续8秒',cd:14,mpCost:52,type:'buff',atkBuff:.5,defBuff:.5,buffDur:8,frames:[`✦─O─✦\n圣战意志！`],bigText:'圣战意志！',bigColor:'#ffffd0',sfx:'holy'},
    {id:'ho06',name:'烈日神火',icon:'☀️',school:'圣系',desc:'圣阳之火，造成350%圣系伤害，并灼烧5秒，无视防御',cd:15,mpCost:55,type:'dot',multiplier:3.0,dotChance:1,dotDmg:.05,dotDur:5,ignoreDefense:true,frames:[`☀✦☀\n─O─\n烈日神火！！\n✦✦✦`],bigText:'烈日神火！！',bigColor:'#ffff60',sfx:'holy'},
    {id:'ho07',name:'天使庇护',icon:'😇',school:'圣系',desc:'天使降临，全面回复60%气血，清除所有状态，并获得圣盾300点',cd:18,mpCost:65,type:'heal',healPct:.6,cleanse:true,shieldAbs:300,shieldDur:6,frames:[`😇✦😇\n─O─\n天使庇护！！\n✦✦✦✦✦`],bigText:'天使庇护！！',bigColor:'#fffff0',sfx:'holy'},
    {id:'ho08',name:'圣殒落星',icon:'⭐',school:'圣系',desc:'星光轰击，连续5次圣系攻击各90%伤害，必定暴击',cd:13,mpCost:48,type:'damage',hits:5,multiplier:0.8,forceCrit:true,frames:[`⭐✦⭐\n─O─\n圣殒落星！\n⭐⭐⭐`],bigText:'圣殒落星！',bigColor:'#ffffe0',sfx:'holy'},
    {id:'ho09',name:'神罚天谴',icon:'🌩️',school:'圣系',desc:'神的惩罚，造成550%圣系伤害，眩晕4秒，目标血量越低伤害越高',cd:20,mpCost:72,type:'stun',multiplier:5.0,stunDur:4,ignoreAll:true,frames:[`🌩✦🌩\n O \n神罚天谴！！\n✦✦✦✦✦✦`],bigText:'神罚天谴！！',bigColor:'#ffffa0',sfx:'holy'},
    {id:'ho10',name:'永恒圣城',icon:'🏰',school:'圣系',desc:'永恒之城降临，攻防+70%，吸收800点伤害，持续12秒',cd:24,mpCost:85,type:'buff',atkBuff:.7,defBuff:.7,shieldAbs:800,shieldDur:12,buffDur:12,frames:[`🏰✦🏰\n─O─\n永恒圣城！！\n✦✦✦✦✦`],bigText:'永恒圣城！！',bigColor:'#ffffe8',sfx:'holy'},
  ],

  // ── 通用 ──────────────────────────────────────
  common: [
    {id:'cm_l1',name:'普通攻击',icon:'⚔️',school:'通用',desc:'最普通的一击，造成60%伤害',cd:1,mpCost:3,type:'damage',multiplier:0.6,frames:[`O─⚔`],bigText:'攻击！',bigColor:'#e8d5a3',sfx:'hit'},
    {id:'cm_l2',name:'防御',icon:'🛡️',school:'通用',desc:'摆出防御姿态，防御+35%，持续2秒',cd:2,mpCost:5,type:'buff',defBuff:.35,buffDur:2,frames:[`★O★`],bigText:'防御！',bigColor:'#e8d5a3',sfx:'shield'},
    {id:'cm_l3',name:'小憩',icon:'😮‍💨',school:'通用',desc:'喘口气，回复5%气血',cd:3,mpCost:7,type:'heal',healPct:.05,frames:[`O─ᐧ`],bigText:'休息！',bigColor:'#88ffaa',sfx:'heal'},
    {id:'cm01',name:'快攻',icon:'⚔️',school:'通用',desc:'快速一击，125%伤害，必定暴击',cd:4,mpCost:13,type:'damage',multiplier:1.2,forceCrit:true,frames:[`✦O✦\n─⚔─\n快攻！`],bigText:'快攻！',bigColor:'#e8d5a3',sfx:'hit'},
    {id:'cm02',name:'强击',icon:'💥',school:'通用',desc:'强力打击，220%伤害，击退对方',cd:7,mpCost:22,type:'damage',multiplier:2.0,frames:[`💥O💥\n─⚡─\n强击！！`],bigText:'强击！！',bigColor:'#e8d5a3',sfx:'heavy'},
    {id:'cm03',name:'自愈',icon:'💚',school:'通用',desc:'回复25%气血，清除中毒状态',cd:10,mpCost:32,type:'heal',healPct:.25,cleanse:true,frames:[`✦O✦\n💚💚💚\n自愈！`],bigText:'自愈！',bigColor:'#44ff88',sfx:'heal'},
    {id:'cm04',name:'乾坤一掌',icon:'🌀',school:'通用',desc:'160%伤害，反弹对方下次攻击',cd:9,mpCost:28,type:'buff',multiplier:1.5,reflect:true,frames:[`🌀─O─🌀\n乾坤一掌！`],bigText:'乾坤一掌！',bigColor:'#80c0ff',sfx:'skill'},
    {id:'cm05',name:'连环三击',icon:'🔥',school:'通用',desc:'连续3击各90%伤害，每击降低对方防御10%',cd:8,mpCost:24,type:'damage',hits:3,multiplier:0.85,defDebuff:.1,debuffDur:5,frames:[`─O─⚡─\n─O─⚡⚡─\n连环三击！`],bigText:'连环三击！',bigColor:'#ff8040',sfx:'rage'},
    {id:'cm06',name:'霸体',icon:'🛡️',school:'通用',desc:'霸体护盾吸收300点，防御+50%，持续5秒',cd:12,mpCost:38,type:'buff',shieldAbs:300,defBuff:.5,shieldDur:5,buffDur:5,frames:[`★─O─★\n霸体！！\n★★★`],bigText:'霸 体！！',bigColor:'#80d0ff',sfx:'shield'},
    {id:'cm07',name:'绝技',icon:'✨',school:'通用',desc:'江湖绝技！350%伤害，无视防御，眩晕3秒',cd:16,mpCost:58,type:'stun',multiplier:3.0,stunDur:3,ignoreDefense:true,forceCrit:true,frames:[`✦✦✦\n─O─\n绝技！！\n✦✦✦`],bigText:'绝 技！！',bigColor:'#e8d5a3',sfx:'thunder'},
    {id:'cm08',name:'恢复冥想',icon:'🧘',school:'通用',desc:'冥想修炼，回复35%血量，并提升防御30%持续6秒',cd:13,mpCost:44,type:'heal',healPct:.35,defBuff:.3,buffDur:6,frames:[`🧘\n─O─\n冥想恢复！`],bigText:'冥想恢复！',bigColor:'#88ffaa',sfx:'heal'},
    {id:'cm09',name:'以逸待劳',icon:'🏮',school:'通用',desc:'以逸待劳，进入防守姿态，防御+80%，持续3秒后反弹伤害',cd:10,mpCost:32,type:'buff',defBuff:.8,buffDur:3,reflectPct:.3,frames:[`🏮─O─🏮\n以逸待劳！`],bigText:'以逸待劳！',bigColor:'#ffcc60',sfx:'shield'},
    {id:'cm10',name:'虎啸龙吟',icon:'🐯',school:'通用',desc:'虎啸一声，震慑对方，降低攻防各35%，持续5秒',cd:11,mpCost:35,type:'debuff',atkDebuff:.35,defDebuff:.35,debuffDur:5,frames:[`🐯 O 🐯\n虎啸龙吟！`],bigText:'虎啸龙吟！',bigColor:'#f09040',sfx:'rage'},
  ],

  // ── 拳系 ──────────────────────────────────────
  fist: [
    {id:'fi_lf1',name:'直拳一击',icon:'👊',school:'拳系',desc:'最基本的直拳，造成70%伤害',cd:1,mpCost:4,type:'damage',multiplier:0.7,frames:[`O→👊`],bigText:'直拳！',bigColor:'#e8a040',sfx:'hit'},
    {id:'fi_lf2',name:'蹲马步',icon:'🧘',school:'拳系',desc:'摆好马步，防御+30%，攻击+10%，持续3秒',cd:2,mpCost:6,type:'buff',defBuff:.3,atkBuff:.1,buffDur:3,frames:[`║O║`],bigText:'马步！',bigColor:'#c86030',sfx:'shield'},
    {id:'fi_lf3',name:'连两拳',icon:'🥊',school:'拳系',desc:'左右两拳，各55%伤害',cd:3,mpCost:8,type:'damage',hits:2,multiplier:0.55,frames:[`O─👊─👊`],bigText:'两拳！',bigColor:'#e09050',sfx:'hit'},
    {id:'fi1a',name:'降龙十八掌',icon:'🐲',school:'拳系',desc:'天下第一掌法！连续18击各35%伤害，每三击必中必暴',cd:16,mpCost:58,type:'damage',hits:18,multiplier:0.3,alwaysHit:true,frames:[`🐲─O─🐲\n降龙！降龙！\n降龙十八掌！！`],bigText:'降龙十八掌！！',bigColor:'#f0c060',sfx:'heavy'},
    {id:'fi1b',name:'通臂金猿拳',icon:'🦧',school:'拳系',desc:'长臂劲拳，连续5击各80%伤害，每击附带10%眩晕概率',cd:9,mpCost:30,type:'damage',hits:5,multiplier:0.75,stunChance:.1,stunDur:1,frames:[`🦧─O─\n通臂金猿拳！`],bigText:'通臂金猿拳！',bigColor:'#e8a040',sfx:'heavy'},
    {id:'fi1c',name:'太祖长拳',icon:'👊',school:'拳系',desc:'刚猛霸道，造成200%伤害，降低对方防御40%，持续6秒',cd:8,mpCost:26,type:'debuff',multiplier:1.8,defDebuff:.4,debuffDur:6,frames:[`╔═╗─O\n║▓║太祖\n长拳！！`],bigText:'太祖长拳！！',bigColor:'#c86030',sfx:'heavy'},
    {id:'fi1d',name:'鹰爪擒拿手',icon:'🦅',school:'拳系',desc:'鹰爪锁喉，眩晕3秒，降低对方攻防各45%',cd:12,mpCost:42,type:'stun',stunDur:3,atkDebuff:.45,defDebuff:.45,debuffDur:7,frames:[`🦅─O─🦅\n鹰爪擒拿！\n鹰─爪─手！`],bigText:'鹰爪擒拿手！',bigColor:'#d09050',sfx:'heavy'},
    {id:'fi1e',name:'虎鹤双形拳',icon:'🐯',school:'拳系',desc:'虎形刚猛鹤形轻灵，攻击+50%防御+40%，持续8秒',cd:13,mpCost:48,type:'buff',atkBuff:.5,defBuff:.4,buffDur:8,frames:[`🐯─O─🦢\n虎鹤双形！！\n双形拳！`],bigText:'虎鹤双形拳！',bigColor:'#e0a060',sfx:'rage'},
    {id:'fi1f',name:'混元一气功',icon:'💪',school:'拳系',desc:'拳劲贯穿，造成310%伤害，无视全部防御和护盾',cd:14,mpCost:52,type:'execute',multiplier:2.8,ignoreAll:true,forceCrit:true,frames:[`💪 O 💪\n混元一气！！\n混元一气功！！`],bigText:'混元一气功！！',bigColor:'#ff9850',sfx:'heavy'},
    {id:'fi1g',name:'铁布衫',icon:'🛡️',school:'拳系',desc:'刀枪不入，吸收500点伤害，防御+80%，持续7秒',cd:15,mpCost:55,type:'shield',shieldAbs:500,defBuff:.8,shieldDur:7,buffDur:7,frames:[`━━━━━\n║ O ║\n铁布衫！！\n━━━━━`],bigText:'铁布衫！！',bigColor:'#c07030',sfx:'shield'},
    {id:'fi1h',name:'七伤拳',icon:'☠️',school:'拳系',desc:'以七分伤换取敌方双倍，造成450%伤害，自损20%气血',cd:18,mpCost:65,type:'execute',multiplier:4.0,selfDmgPct:.2,ignoreDefense:true,frames:[`☠─O─☠\n七伤！！\n七伤拳！！`],bigText:'七伤拳！！',bigColor:'#ff4040',sfx:'heavy'},
    {id:'fi1i',name:'蟾蜍功',icon:'🐸',school:'拳系',desc:'铁腹硬功，吸收600点伤害同时回复30%气血',cd:17,mpCost:60,type:'heal',healPct:.3,shieldAbs:600,shieldDur:5,frames:[`🐸─O─🐸\n蟾蜍功！！`],bigText:'蟾蜍功！！',bigColor:'#80c040',sfx:'heavy'},
    {id:'fi1j',name:'无敌金身',icon:'✨',school:'拳系',desc:'金身大成！2秒内完全免疫所有伤害，之后爆发300%反击',cd:20,mpCost:70,type:'buff',invincible:2,multiplier:2.6,frames:[`✨╔O╗✨\n║▓▓║\n无敌金身！！\n✨✨✨`],bigText:'无敌金身！！',bigColor:'#ffd060',sfx:'holy'},
  ],

  // ── 奇门系 ──────────────────────────────────────
  qimen: [
    {id:'qm_l1',name:'绊索',icon:'〰️',school:'奇门系',desc:'设下绊索，眩晕对方0.5秒',cd:1,mpCost:5,type:'stun',stunDur:.5,frames:[`─O─绊`],bigText:'绊！',bigColor:'#90c060',sfx:'hit'},
    {id:'qm_l2',name:'飞镖',icon:'🎯',school:'奇门系',desc:'投出飞镖，造成65%伤害，必定命中',cd:2,mpCost:7,type:'damage',multiplier:0.65,alwaysHit:true,frames:[`O→🎯`],bigText:'飞镖！',bigColor:'#a0b080',sfx:'hit'},
    {id:'qm_l3',name:'小烟雾',icon:'💨',school:'奇门系',desc:'释放小烟雾，降低对方攻击15%，持续3秒',cd:3,mpCost:10,type:'debuff',atkDebuff:.15,debuffDur:3,frames:[`O→💨`],bigText:'烟雾！',bigColor:'#80b060',sfx:'wind'},
    {id:'qm01',name:'奇门八阵',icon:'🔯',school:'奇门系',desc:'布置八卦阵法，困住对方3秒，每秒造成5%持续伤害',cd:12,mpCost:44,type:'stun',stunDur:3,dotDmg:.05,dotDur:3,frames:[`🔯🔯🔯\n─O─\n奇门八阵！\n🔯🔯🔯`],bigText:'奇门八阵！',bigColor:'#90c090',sfx:'skill'},
    {id:'qm02',name:'机关暗箭',icon:'🏹',school:'奇门系',desc:'连射7支机关暗箭，每支60%伤害，必定命中',cd:8,mpCost:27,type:'damage',hits:7,multiplier:0.55,alwaysHit:true,frames:[`🏹🏹🏹🏹🏹🏹🏹\n─O─\n机关暗箭！！`],bigText:'机关暗箭！！',bigColor:'#a0b080',sfx:'skill'},
    {id:'qm03',name:'五行困阵',icon:'☯️',school:'奇门系',desc:'五行相克，降低对方攻防各50%，持续8秒',cd:13,mpCost:48,type:'debuff',atkDebuff:.5,defDebuff:.5,debuffDur:8,frames:[`金水木\n─O─\n五行困阵！\n火土金`],bigText:'五行困阵！',bigColor:'#80b080',sfx:'skill'},
    {id:'qm04',name:'炼体秘术',icon:'⚗️',school:'奇门系',desc:'炼体归本，回复40%气血，攻防同时提升30%，持续7秒',cd:15,mpCost:55,type:'heal',healPct:.4,atkBuff:.3,defBuff:.3,buffDur:7,frames:[`⚗─O─⚗\n炼体秘术！\n⚗⚗⚗`],bigText:'炼体秘术！',bigColor:'#90d890',sfx:'heal'},
    {id:'qm05',name:'土遁逃脱',icon:'🌱',school:'奇门系',desc:'土遁隐身，下3次攻击必定闪避，持续6秒',cd:10,mpCost:35,type:'buff',dodgeBuff:3,buffDur:6,frames:[`🌱 O 🌱\n土遁！\n逃─脱！`],bigText:'土遁逃脱！',bigColor:'#70a870',sfx:'wind'},
    {id:'qm06',name:'连环毒弩',icon:'🎯',school:'奇门系',desc:'连环弩箭齐发，造成240%伤害，必定中毒10秒',cd:11,mpCost:40,type:'dot',multiplier:2.2,dotChance:1,dotDmg:.06,dotDur:10,frames:[`🎯🎯🎯\n─O─\n连环毒弩！\n🎯🎯🎯`],bigText:'连环毒弩！',bigColor:'#88cc44',sfx:'poison'},
    {id:'qm07',name:'神机妙算',icon:'🎲',school:'奇门系',desc:'运筹帷幄，随机触发一个超级效果：暴击+200%/全愈/眩晕3秒之一',cd:14,mpCost:50,type:'buff',atkBuff:2.0,healPct:.5,buffDur:1,frames:[`🎲─O─🎲\n神机妙算！\n🎲🎲🎲`],bigText:'神机妙算！',bigColor:'#c0c060',sfx:'skill'},
    {id:'qm08',name:'鬼谷奇阵',icon:'🕯️',school:'奇门系',desc:'鬼谷绝阵，造成280%伤害，并使对方攻防降低35%持续9秒',cd:16,mpCost:58,type:'debuff',multiplier:2.5,atkDebuff:.35,defDebuff:.35,debuffDur:9,frames:[`🕯🕯🕯\n O \n鬼谷奇阵！！\n🕯🕯🕯`],bigText:'鬼谷奇阵！！',bigColor:'#a0b060',sfx:'dark'},
    {id:'qm09',name:'七煞天罡刀',icon:'🗡️',school:'奇门系',desc:'暗藏七把飞刀，连续7击各70%伤害，每击有30%致毒',cd:15,mpCost:55,type:'dot',hits:7,multiplier:0.65,dotChance:.3,dotDmg:.05,dotDur:6,frames:[`🗡🗡🗡🗡🗡🗡🗡\n─O─\n七煞天罡！！`],bigText:'七煞天罡刀！！',bigColor:'#b0a050',sfx:'skill'},
    {id:'qm10',name:'太乙玄门阵',icon:'⚙️',school:'奇门系',desc:'太乙大阵，造成500%伤害，无视一切，眩晕4秒，降低攻防50%',cd:22,mpCost:80,type:'stun',multiplier:4.5,stunDur:4,ignoreAll:true,atkDebuff:.5,defDebuff:.5,debuffDur:10,frames:[`⚙🔯⚙\n─O─\n太乙玄门阵！！\n⚙⚙⚙`],bigText:'太乙玄门阵！！',bigColor:'#d0d080',sfx:'thunder'},
  ],

  // ── 琴系 ──────────────────────────────────────
  music: [
    {id:'mu_l1',name:'噪音',icon:'📢',school:'琴系',desc:'发出刺耳噪音，造成55%伤害',cd:1,mpCost:5,type:'damage',multiplier:0.55,frames:[`O♪♪`],bigText:'噪音！',bigColor:'#d080d0',sfx:'hit'},
    {id:'mu_l2',name:'悦音',icon:'🎶',school:'琴系',desc:'奏出悦耳音乐，回复8%气血',cd:2,mpCost:8,type:'heal',healPct:.08,frames:[`♪O♪`],bigText:'悦音！',bigColor:'#c060c0',sfx:'heal'},
    {id:'mu_l3',name:'颤音',icon:'🎵',school:'琴系',desc:'颤动之音，降低对方攻击15%，持续3秒',cd:3,mpCost:10,type:'debuff',atkDebuff:.15,debuffDur:3,frames:[`O♫♫`],bigText:'颤音！',bigColor:'#b050b0',sfx:'skill'},
    {id:'mu01',name:'广陵散',icon:'🎵',school:'琴系',desc:'千古绝音，慑人心魄，眩晕对方2.5秒，攻防降低40%',cd:10,mpCost:36,type:'stun',stunDur:2.5,atkDebuff:.4,defDebuff:.4,debuffDur:7,frames:[`♪♫♪♫♪\n─O─\n广陵散！\n♪♫♪♫♪`],bigText:'广陵散！',bigColor:'#d080d0',sfx:'skill'},
    {id:'mu02',name:'碧海潮生曲',icon:'🌊',school:'琴系',desc:'琴声如海，持续灼心，每秒5%伤害持续8秒，降低攻击35%',cd:12,mpCost:44,type:'dot',dotDmg:.05,dotDur:8,atkDebuff:.35,debuffDur:8,frames:[`🎵🌊🎵\n─O─\n碧海潮生！\n🌊🌊🌊`],bigText:'碧海潮生曲！',bigColor:'#8080ff',sfx:'wind'},
    {id:'mu03',name:'笑傲江湖曲',icon:'🎼',school:'琴系',desc:'笑傲之音响彻天地，清除自身所有状态，攻防+60%，持续9秒',cd:15,mpCost:55,type:'buff',cleanse:true,atkBuff:.6,defBuff:.6,buffDur:9,frames:[`♩♪♫♬♩\n O \n笑傲江湖！！\n♬♩♪♫♬`],bigText:'笑傲江湖曲！！',bigColor:'#c060c0',sfx:'holy'},
    {id:'mu04',name:'九幽冥曲',icon:'💀',school:'琴系',desc:'冥界之音，造成360%伤害，眩晕3秒，无视防御',cd:16,mpCost:58,type:'stun',multiplier:3.2,stunDur:3,ignoreDefense:true,frames:[`💀♪💀\n─O─\n九幽冥曲！！\n💀♪💀`],bigText:'九幽冥曲！！',bigColor:'#a040a0',sfx:'dark'},
    {id:'mu05',name:'回风落雁式',icon:'🕊️',school:'琴系',desc:'琴箫合鸣，造成220%伤害，必中必暴，有50%反弹下次攻击',cd:11,mpCost:40,type:'damage',multiplier:2.0,alwaysHit:true,forceCrit:true,reflect:true,frames:[`🕊♪🕊\n─O─\n回风落雁！！`],bigText:'回风落雁式！！',bigColor:'#c070b0',sfx:'wind'},
    {id:'mu06',name:'长相思',icon:'💕',school:'琴系',desc:'相思之音，令对方攻击力降低60%，陷入迷惑状态3秒',cd:9,mpCost:32,type:'stun',stunDur:3,atkDebuff:.6,debuffDur:8,frames:[`💕♫💕\n─O─\n长相思！\n💕💕💕`],bigText:'长相思！',bigColor:'#ff80c0',sfx:'skill'},
    {id:'mu07',name:'忘情水调',icon:'💧',school:'琴系',desc:'忘情之调，清除对方所有增益状态，并吸取其攻击力30%',cd:13,mpCost:48,type:'debuff',atkDebuff:.3,debuffDur:8,frames:[`💧♪💧\n─O─\n忘情水调！\n💧💧💧`],bigText:'忘情水调！',bigColor:'#8080d0',sfx:'skill'},
    {id:'mu08',name:'天籁之音',icon:'🌟',school:'琴系',desc:'天地之音，造成270%伤害，回复自身25%气血，降低对方防御45%',cd:14,mpCost:52,type:'heal',multiplier:2.5,healPct:.25,defDebuff:.45,debuffDur:7,frames:[`🌟♬🌟\n─O─\n天籁之音！！\n🌟🌟🌟`],bigText:'天籁之音！！',bigColor:'#d090d0',sfx:'holy'},
    {id:'mu09',name:'霹雳琴弦',icon:'⚡',school:'琴系',desc:'以琴弦为剑，连续8次雷电攻击各55%伤害，必定命中',cd:15,mpCost:55,type:'damage',hits:8,multiplier:0.5,alwaysHit:true,frames:[`⚡♫⚡\n─O─\n霹雳琴弦！！\n⚡⚡⚡`],bigText:'霹雳琴弦！！',bigColor:'#c050c0',sfx:'thunder'},
    {id:'mu10',name:'万籁俱寂',icon:'🔇',school:'琴系',desc:'万音归寂，沉默对方5秒并眩晕2秒，降低其攻防各50%，造成200%伤害',cd:20,mpCost:72,type:'stun',multiplier:1.8,stunDur:2,silenceEnemy:5,atkDebuff:.5,defDebuff:.5,debuffDur:9,frames:[`🔇♩🔇\n─O─\n万籁俱寂！！\n🔇🔇🔇`],bigText:'万籁俱寂！！',bigColor:'#a050b0',sfx:'dark'},
  ],

  // ── 命系 ──────────────────────────────────────
  fate: [
    {id:'ft_l1',name:'占卜',icon:'🔮',school:'命系',desc:'简单占卜，防御+15%，持续3秒',cd:1,mpCost:5,type:'buff',defBuff:.15,buffDur:3,frames:[`🔮O`],bigText:'占卜！',bigColor:'#c0a040',sfx:'skill'},
    {id:'ft_l2',name:'因缘',icon:'🎋',school:'命系',desc:'借天地之缘，回复8%气血',cd:2,mpCost:8,type:'heal',healPct:.08,frames:[`○─O─○`],bigText:'因缘！',bigColor:'#d4a850',sfx:'heal'},
    {id:'ft_l3',name:'顺势',icon:'🌊',school:'命系',desc:'顺势而为，下次攻击伤害+40%，持续2秒',cd:3,mpCost:10,type:'buff',atkBuff:.4,buffDur:2,frames:[`→O→`],bigText:'顺势！',bigColor:'#c0a050',sfx:'skill'},
    {id:'ft01',name:'天命难违',icon:'⚖️',school:'命系',desc:'天命所归，造成200%伤害，且此击必定命中，无论何种状态',cd:8,mpCost:26,type:'damage',multiplier:1.8,alwaysHit:true,ignoreAll:true,frames:[`⚖─O─⚖\n天命难违！\n⚖⚖⚖`],bigText:'天命难违！',bigColor:'#d4a850',sfx:'holy'},
    {id:'ft02',name:'因果轮回',icon:'♻️',school:'命系',desc:'因果报应，将对方所受到的最后一次伤害返还给对方',cd:11,mpCost:40,type:'buff',reflect:true,frames:[`♻─O─♻\n因果轮回！\n♻♻♻`],bigText:'因果轮回！',bigColor:'#c0a040',sfx:'skill'},
    {id:'ft03',name:'生死判官',icon:'👁️',school:'命系',desc:'生死裁决，造成300%伤害，对方血量越低伤害越高（最高+200%）',cd:14,mpCost:52,type:'execute',multiplier:2.6,execBonus:2.0,frames:[`👁─O─👁\n生死判官！！\n👁👁👁`],bigText:'生死判官！！',bigColor:'#a0803a',sfx:'dark'},
    {id:'ft04',name:'时来运转',icon:'🎰',school:'命系',desc:'时运大涨！随机回复20-80%气血，同时攻防随机提升50-150%',cd:12,mpCost:44,type:'heal',healPct:.5,atkBuff:1.0,defBuff:.5,buffDur:6,frames:[`🎰 O 🎰\n时来运转！！\n🎰🎰🎰`],bigText:'时来运转！！',bigColor:'#e0c060',sfx:'holy'},
    {id:'ft05',name:'天机洞悉',icon:'🔮',school:'命系',desc:'洞悉天机，降低对方攻防各50%，持续10秒，己方防御+40%',cd:13,mpCost:48,type:'debuff',atkDebuff:.5,defDebuff:.5,debuffDur:10,defBuff:.4,buffDur:10,frames:[`🔮─O─🔮\n天机洞悉！\n🔮🔮🔮`],bigText:'天机洞悉！',bigColor:'#b09040',sfx:'skill'},
    {id:'ft06',name:'宿命之刃',icon:'⚔️',school:'命系',desc:'命中注定的一击，造成450%伤害，必中必暴，无视一切防御',cd:18,mpCost:65,type:'execute',multiplier:4.0,alwaysHit:true,forceCrit:true,ignoreAll:true,frames:[`⚔─O─⚔\n宿命之刃！！\n命─中─注─定！`],bigText:'宿命之刃！！',bigColor:'#d4b060',sfx:'holy'},
    {id:'ft07',name:'鬼门关前',icon:'🚪',school:'命系',desc:'鬼门守护，从鬼门归来，本次受到的致命伤害变为恢复30%气血',cd:20,mpCost:70,type:'shield',healPct:.3,shieldAbs:9999,shieldDur:1,frames:[`🚪 O 🚪\n鬼门关！！\n鬼门关前！！`],bigText:'鬼门关前！！',bigColor:'#806020',sfx:'dark'},
    {id:'ft08',name:'逆天改命',icon:'🌠',school:'命系',desc:'逆天而行，清除所有负面状态，回血50%，并使下次攻击伤害翻3倍',cd:22,mpCost:78,type:'heal',healPct:.5,cleanse:true,atkBuff:3.0,buffDur:1,frames:[`🌠─O─🌠\n逆天改命！！\n天─命─可─改！`],bigText:'逆天改命！！',bigColor:'#e0c070',sfx:'holy'},
    {id:'ft09',name:'万化归一',icon:'🌀',school:'命系',desc:'万物归一，造成400%伤害，眩晕3秒，同时回复自身20%气血',cd:17,mpCost:62,type:'stun',multiplier:3.5,stunDur:3,healPct:.2,frames:[`🌀─O─🌀\n万化归一！！\n归─一！归─一！`],bigText:'万化归一！！',bigColor:'#c0a050',sfx:'thunder'},
    {id:'ft10',name:'天地不仁',icon:'☯️',school:'命系',desc:'天地无情之力，造成800%伤害，无视一切，自损40%气血，一招定乾坤',cd:28,mpCost:99,type:'execute',multiplier:7.0,ignoreAll:true,selfDmgPct:.4,forceCrit:true,frames:[`☯ O ☯\n天地不仁！！\n一─招─定─乾─坤！！`],bigText:'天地不仁！！',bigColor:'#d4a840',sfx:'thunder'},
  ],

};

// 展平所有技能，便于按ID查询
const SKILL_FLAT = Object.values(SKILL_LIB).flat();
function getSkill(id){ return SKILL_FLAT.find(s=>s.id===id)||null; }
function getSkills(ids){ return ids.map(id=>getSkill(id)).filter(Boolean); }

// ══════════════════════════════════════════════════════════════════
//  ✦ 技能博弈系统 — 五行相克与学派克制 ✦
// ══════════════════════════════════════════════════════════════════

// 学派五行属性映射
const SCHOOL_ELEMENT = {
  sword:   'metal',    // 剑系 - 金
  thunder: 'metal',    // 雷系 - 金
  wind:    'wood',     // 风系 - 木
  qimen:   'wood',     // 奇门系 - 木
  fire:    'fire',     // 火系 - 火
  fist:    'fire',     // 拳系 - 火
  ice:     'water',    // 冰系 - 水
  music:   'water',    // 琴系 - 水
  force:   'earth',    // 力系 - 土
  fate:    'earth',    // 命系 - 土
  buddha:  'holy',     // 佛系 - 圣
  tao:     'holy',     // 道系 - 圣
  holy:    'holy',     // 圣系 - 圣
  shadow:  'dark',     // 暗系 - 暗
  poison:  'dark',     // 毒系 - 暗
  common:  'neutral',  // 通用 - 无属性
};

// 五行相克关系: 克者 -> 被克者
const ELEMENT_COUNTER = {
  metal: 'wood',   // 金克木
  wood:  'fire',   // 木克火
  fire:  'metal',  // 火克金 (特殊: 火炼金)
  water: 'fire',   // 水克火
  earth: 'water',  // 土克水
  holy:  'dark',   // 圣克暗
  dark:  'holy',   // 暗克圣 (互相克制)
};

// 学派特殊克制关系 (覆盖五行)
const SCHOOL_SPECIAL_COUNTER = {
  // 剑系专克
  sword: { wind: 1.25, qimen: 1.25 },
  // 冰系专克
  ice: { fire: 1.3, fist: 1.2 },
  // 火系专克
  fire: { ice: 1.2, metal: 1.15 },
  // 佛系专克
  buddha: { shadow: 1.35, poison: 1.3 },
  // 暗系专克
  shadow: { buddha: 1.25, holy: 1.2 },
  // 毒系专克
  poison: { buddha: 1.2, common: 1.15 },
  // 圣系专克
  holy: { shadow: 1.4, poison: 1.35 },
  // 力系专克
  force: { sword: 1.2, thunder: 1.15 },
  // 雷系专克
  thunder: { wind: 1.3, qimen: 1.25 },
  // 风系专克
  wind: { fire: 1.25, poison: 1.2 },
  // 琴系专克
  music: { buddha: 1.2, tao: 1.2 },
  // 奇门专克
  qimen: { fist: 1.25, force: 1.2 },
  // 拳系专克
  fist: { force: 1.3, earth: 1.2 },
  // 道系专克
  tao: { buddha: 1.15, fate: 1.2 },
  // 命系专克
  fate: { tao: 1.2, common: 1.15 },
};

// 博弈结果类型
const SKILL_COUNTER_RESULT = {
  WIN: 'win',      // 克制对方
  LOSE: 'lose',    // 被对方克制
  TIE: 'tie',      // 同系/无克制
  SAME: 'same',    // 同门
};

// ══════════════════════════════════════════════════════════════════
//  技能博弈核心函数
// ══════════════════════════════════════════════════════════════════

/**
 * 检查技能博弈关系
 * @param {string} attackerSchool - 攻击方学派
 * @param {string} defenderSchool - 防守方学派
 * @returns {Object} { result: 'win'|'lose'|'tie'|'same', multiplier: 倍率, reason: 原因 }
 */
function checkSkillCounter(attackerSchool, defenderSchool) {
  // 同系判定
  if (attackerSchool === defenderSchool) {
    return {
      result: SKILL_COUNTER_RESULT.SAME,
      multiplier: 1.1,
      reason: '同门切磋',
      text: '同系+10%'
    };
  }

  // 通用系无克制
  if (attackerSchool === 'common' || defenderSchool === 'common') {
    return {
      result: SKILL_COUNTER_RESULT.TIE,
      multiplier: 1.0,
      reason: '通用无克',
      text: ''
    };
  }

  // 检查特殊克制
  const specialCounters = SCHOOL_SPECIAL_COUNTER[attackerSchool];
  if (specialCounters && specialCounters[defenderSchool]) {
    return {
      result: SKILL_COUNTER_RESULT.WIN,
      multiplier: specialCounters[defenderSchool],
      reason: '专精克制',
      text: `克制+${Math.round((specialCounters[defenderSchool] - 1) * 100)}%`
    };
  }

  // 检查被特殊克制
  const defenderCounters = SCHOOL_SPECIAL_COUNTER[defenderSchool];
  if (defenderCounters && defenderCounters[attackerSchool]) {
    return {
      result: SKILL_COUNTER_RESULT.LOSE,
      multiplier: 1 / defenderCounters[attackerSchool],
      reason: '被专精克',
      text: `被克-${Math.round((1 - 1 / defenderCounters[attackerSchool]) * 100)}%`
    };
  }

  // 五行相克判定
  const atkElement = SCHOOL_ELEMENT[attackerSchool] || 'neutral';
  const defElement = SCHOOL_ELEMENT[defenderSchool] || 'neutral';

  // 圣暗互克
  if ((atkElement === 'holy' && defElement === 'dark') ||
      (atkElement === 'dark' && defElement === 'holy')) {
    const isAtkHoly = atkElement === 'holy';
    return {
      result: isAtkHoly ? SKILL_COUNTER_RESULT.WIN : SKILL_COUNTER_RESULT.LOSE,
      multiplier: isAtkHoly ? 1.3 : 0.75,
      reason: isAtkHoly ? '圣光破暗' : '暗影噬圣',
      text: isAtkHoly ? '圣克暗+30%' : '暗克圣-25%'
    };
  }

  // 标准五行相克
  if (ELEMENT_COUNTER[atkElement] === defElement) {
    return {
      result: SKILL_COUNTER_RESULT.WIN,
      multiplier: 1.25,
      reason: '五行相克',
      text: '五行克+25%'
    };
  }

  if (ELEMENT_COUNTER[defElement] === atkElement) {
    return {
      result: SKILL_COUNTER_RESULT.LOSE,
      multiplier: 0.8,
      reason: '五行被克',
      text: '被克-20%'
    };
  }

  // 无克制关系
  return {
    result: SKILL_COUNTER_RESULT.TIE,
    multiplier: 1.0,
    reason: '无相克制',
    text: ''
  };
}

/**
 * 获取技能学派名称
 * @param {string} skillId - 技能ID
 * @returns {string} 学派key
 */
function getSkillSchool(skillId) {
  const skill = getSkill(skillId);
  if (!skill) return 'common';
  // 从SKILL_LIB中找到对应的学派
  for (const [school, skills] of Object.entries(SKILL_LIB)) {
    if (skills.some(s => s.id === skillId)) {
      return school;
    }
  }
  return 'common';
}

/**
 * 获取学派中文名
 * @param {string} schoolKey - 学派key
 * @returns {string} 中文名
 */
function getSchoolName(schoolKey) {
  const names = {
    sword: '剑系', buddha: '佛系', tao: '道系', force: '力系',
    shadow: '暗系', poison: '毒系', ice: '冰系', fire: '火系',
    thunder: '雷系', wind: '风系', holy: '圣系', common: '通用',
    fist: '拳系', qimen: '奇门系', music: '琴系', fate: '命系'
  };
  return names[schoolKey] || schoolKey;
}

/**
 * 获取元素中文名
 * @param {string} element - 元素key
 * @returns {string} 中文名
 */
function getElementName(element) {
  const names = {
    metal: '金', wood: '木', water: '水', fire: '火', earth: '土',
    holy: '圣', dark: '暗', neutral: '无'
  };
  return names[element] || element;
}

// ════════════════════════════════════════════════
//  ✦ 服装数据 COSTUMES — 江湖衣裳谱 ✦
// ════════════════════════════════════════════════
// rarity: legendary/epic/rare/common
// defBonus: 防御加成  hpBonus: 气血上限  mpBonus: 内力上限
// schoolBonus: {系别: 伤害加成倍率}  e.g. {buddha:0.12} → 佛系+12%
// parts: 穿上后覆盖角色外观（同 buildPartsHtml 格式）
// sectId: 非空时需加入对应门派才可购买
