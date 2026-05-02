const CHARS=[
  // ══ 超级门派 ══
  {
    id:'shaolin_d',name:'少林弟子',title:'禅武俗家',tag:'佛法无边',tagColor:'#f0c040',
    color:'#f0c040',maxHp:140,atk:16,def:18,speed:'慢',maxMp:180,crit:8,dodge:5,speedN:5,
    desc:'少林寺俗家弟子，修习金刚护体与基础拳法，以厚实的防御著称，佛心坚韧不拔',
    stand:` 卍 南无 卍
  ╭(◎_◎)╮
  卍（寺）卍
  ╠══╦══╣
 卍━━┿━━卍`,
    attack:[` ╭(◎_◎)╮\n 卍（寺）卍─拳\n ╠══╦══╣`,` ╭(◎_◎)╮\n 卍（寺）卍\n ╠══╦══╣─拳拳`],
    heavy:[` 卍╭(◎_◎)╮卍\n 卍（寺）卍\n ╠═══╦═══╣\n 卍━━┿━━卍`],
    hit:[` ╭(◎_◉)╮\n>卍（寺）卍\n ╠══╦══╣`,` ╭(◉_◎)╮\n 卍（寺）卍<\n ╠══╦══╣`],
    down:` (◎─◎)\n 卍（寺）卍\n ══════`,
    parts:{head:3,body:'（禅）',arms:3,legs:0,aura:2},
    skillIds:['bd_l1','bd02','bd05','fo_l1','fi_lf1','fi1g','cm01'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'wudang_d',name:'武当弟子',title:'道法修士',tag:'太极无极',tagColor:'#60e8e8',
    color:'#60e8e8',maxHp:95,atk:20,def:10,speed:'快',maxMp:200,crit:12,dodge:18,speedN:12,
    desc:'武当入门弟子，习得太极基础心法，以柔克刚之理初窥门径，道袍飘逸如仙',
    stand:`☯ ☯ ☯ ☯
 ╭(^_^)╮
 ☯（当）☯
 ╰──┬──╯
 ～─┿─～`,
    attack:[` ╭(^_^)╮\n─☯（当）☯太\n ╰──┬──╯`,` ╭(^_^)╮\n 极（当）☯\n ╰──┬──╯─`],
    heavy:[` ☯☯☯\n╭(^_^)╮\n│（当）│\n╰─┬─╯\n～~┿~～`],
    hit:[` ╭(>_<)╮\n>☯（当）☯\n ╰──┬──╯`,` ╭(<_<)╮\n ☯（当）☯<\n ╰──┬──╯`],
    down:` (^_─)\n ☯（当）☯\n ══════`,
    parts:{head:4,body:'（道）',arms:7,legs:1,aura:3},
    skillIds:['ta_l1','ta01','ta02','ta03','sw_l1','wi_l3','cm02'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'xiaoyao_d',name:'逍遥弟子',title:'天地游侠',tag:'生死自在',tagColor:'#c0f0c0',
    color:'#c0f0c0',maxHp:88,atk:19,def:9,speed:'快',maxMp:220,crit:15,dodge:22,speedN:12,
    desc:'逍遥派门下散修，学得几式逍遥步法，来去如风，随心所欲，笑傲江湖间',
    stand:`～ ～ ～ ～
 ╭(^‿^)╮
 ～（遥）～
 ╰──┬──╯
～～～～～～`,
    attack:[` ╭(^‿^)╮\n─～（遥）～风\n ╰──┬──╯`,` ╭(^‿^)╮\n ～（遥）～\n ╰──┬──╯─`],
    heavy:[` ～～～\n╭(^‿^)╮\n│（遥）│\n╰─┬─╯\n～～┿～～`],
    hit:[` ╭(^_^)╮\n>～（遥）～\n ╰──┬──╯`,` ╭(^_^)╮\n ～（遥）～<\n ╰──┬──╯`],
    down:` (^─^)\n ～（遥）～\n ══════`,
    parts:{head:8,body:'（逍）',arms:14,legs:9,aura:10},
    skillIds:['wi_l3','wi01','wi06','ft_l1','ft06','ic_l1','cm03'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'riyue_d',name:'日月弟子',title:'圣火信徒',tag:'葵花宝典',tagColor:'#ff8800',
    color:'#ff8800',maxHp:105,atk:22,def:11,speed:'快',maxMp:160,crit:18,dodge:12,speedN:12,
    desc:'日月神教普通教众，修习日月两仪功，攻势如火如冰，教主之威令人胆寒',
    stand:`☀ 日月神教 ☀
 ╭(ω_ω)╮
 ☀（教）☀
 ╰──┬──╯
──────────`,
    attack:[` ╭(ω_ω)╮\n─☀（教）☀日\n ╰──┬──╯`,` ╭(ω_ω)╮\n 月（教）☀\n ╰──┬──╯─`],
    heavy:[` ☀☀☀\n╭(ω_ω)╮\n│（教）│\n╰─┬─╯\n☀━━┿━━☀`],
    hit:[` ╭(o_o)╮\n>☀（教）☀\n ╰──┬──╯`,` ╭(o_o)╮\n ☀（教）☀<\n ╰──┬──╯`],
    down:` (ω─ω)\n ☀（教）☀\n ══════`,
    parts:{head:9,body:'（圣）',arms:15,legs:4,aura:7},
    skillIds:['fi_l1','fi04','fi07','ic_l1','ic05','ft06','cm04'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },

  // ══ 大型门派 ══
  {
    id:'huashan_d',name:'华山弟子',title:'剑气游侠',tag:'剑道无双',tagColor:'#80d8ff',
    color:'#80d8ff',maxHp:92,atk:21,def:8,speed:'极快',maxMp:150,crit:22,dodge:20,speedN:16,
    desc:'华山派入门剑客，剑气凌云，虽未大成却也锋芒毕露，一剑在手胆气豪壮',
    stand:` ✦  ✦  ✦
  ╭(◉_◉)╮
  ⚔（华）⚔
  ╠════╣
  ▓▓╋════╋▓▓`,
    attack:[`  ╭(◉_◉)╮\n ─⚔（华）─⚔\n  ╠════╣`,`  ╭(◉_◉)╮\n  ⚔（华）⚔\n  ╠════╣─⚔`],
    heavy:[` ✦╭(◉_◉)╮✦\n  ⚔（华）⚔\n  ╠════╣\n  ▓╋══╋▓`],
    hit:[`  ╭(◉_◉)╮\n >⚔（华）⚔\n  ╠════╣`,`  ╭(◉_◉)╮\n  ⚔（华）⚔<\n  ╠════╣`],
    down:`  (◉─◉)\n  ⚔（华）⚔\n  ══════`,
    parts:{head:2,body:'（华）',arms:1,legs:4,aura:5},
    skillIds:['sw_l2','sw01','sw03','ho_l1','ho01','ic_l1','cm05'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'mingjiao_d',name:'明教弟子',title:'圣火使者',tag:'圣火令',tagColor:'#ff6020',
    color:'#ff6020',maxHp:110,atk:24,def:9,speed:'快',maxMp:140,crit:20,dodge:10,speedN:12,
    desc:'明教普通弟子，信奉光明之神，习得基础火焰功，浑身散发炽热战意',
    stand:`🔥 圣火令 🔥
 ╭(>_<)╮
 🔥（明）🔥
 ╰──┬──╯
──────────`,
    attack:[` ╭(>_<)╮\n─🔥（明）🔥火\n ╰──┬──╯`,` ╭(>_<)╮\n 🔥（明）🔥\n ╰──┬──╯─`],
    heavy:[` 🔥🔥🔥\n╭(>_<)╮\n│（明）│\n╰─┬─╯\n🔥━━┿━━🔥`],
    hit:[` ╭(;_<)╮\n>🔥（明）🔥\n ╰──┬──╯`,` ╭(>_;)╮\n 🔥（明）🔥<\n ╰──┬──╯`],
    down:` (>─<)\n 🔥（明）🔥\n ══════`,
    parts:{head:9,body:'（明）',arms:15,legs:6,aura:7},
    skillIds:['fi_l1','fi01','fi03','fi05','fi_lf1','fo_l1','cm06'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'wudu_d',name:'五毒弟子',title:'苗疆毒手',tag:'苗疆秘法',tagColor:'#88ff44',
    color:'#88ff44',maxHp:85,atk:19,def:7,speed:'快',maxMp:160,crit:15,dodge:22,speedN:12,
    desc:'五毒教外门弟子，习得基础毒法，身藏蛊虫与毒药，令人不敢轻易接近',
    stand:`🐍🦂🪲🐸🦟
 (⊙_⊙)
 🐍（毒）🐍
 ─────
 🐍  🐍`,
    attack:[` (⊙_⊙)\n─🐍（毒）毒\n  ─────`,` (⊙_⊙)\n 🐍（毒）🐍\n  ─────毒毒`],
    heavy:[` ⌒⌒⌒\n(⊙_⊙)\n│（毒）│\n╰─╯\n🐍🐍🐍`],
    hit:[` (⊙_◉)\n>🐍（毒）🐍\n  ─────`,` (◉_⊙)\n 🐍（毒）🐍<\n  ─────`],
    down:` (o─o)\n 🐍（毒）🐍\n ══════`,
    parts:{head:7,body:'（毒）',arms:13,legs:13,aura:6},
    skillIds:['po_l1','po01','po02','po07','sh_l3','qm_l1','cm07'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'tangmen_d',name:'唐门弟子',title:'暗器游侠',tag:'暗器无双',tagColor:'#a080e0',
    color:'#a080e0',maxHp:80,atk:26,def:5,speed:'极快',maxMp:130,crit:28,dodge:24,speedN:16,
    desc:'唐门外门弟子，藏十数件暗器于身，出手快准狠，未见人影已见暗器',
    stand:`★ ░░░░░ ★
 ░(▓_▓)░
 ░（唐）░
 ░│   │░
★░─┼─░★`,
    attack:[` ░(▓_▓)░★\n ░（唐）░\n  ░─┼─░`,` ░(▓_▓)░★★\n ░（唐）░\n  ░─┼─░`],
    heavy:[` ░(▓_▓)░\n ░（唐）░\n░═┿═░\n★★★`],
    hit:[` ░(▓_▓)░\n>(░（唐）░)`,` (░(▓_▓)░)<\n ░（唐）░`],
    down:` ░(▓─▓)░\n ░（唐）░\n ──────`,
    parts:{head:5,body:'（唐）',arms:9,legs:6,aura:4},
    skillIds:['sh_l1','sh01','sh02','sh07','qm_l2','qm02','cm01'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'taohuadao_d',name:'桃花弟子',title:'落英游侠',tag:'落英神剑',tagColor:'#ff88cc',
    color:'#ff88cc',maxHp:86,atk:18,def:9,speed:'快',maxMp:180,crit:15,dodge:20,speedN:12,
    desc:'桃花岛外门弟子，于满岛桃花中修习落英剑法，招式轻盈如花瓣纷飞',
    stand:`🌸  🌸  🌸
 ╭(◕‿◕)╮
 🌸（桃）🌸
 ╰──┬──╯
🌸─┤棒├─🌸`,
    attack:[` ╭(◕‿◕)╮\n─棒─（桃）棒\n ╰──┬──╯`,` ╭(◕‿◕)╮\n （桃）棒棒─\n ╰──┬──╯`],
    heavy:[` 🌸╭(◕‿◕)╮🌸\n  │（桃）│\n  ╰─┬─╯\n 棒棒棒`],
    hit:[` ╭(◕_◕)╮\n>🌸（桃）🌸\n ╰──┬──╯`,` ╭(◕_◕)╮\n 🌸（桃）🌸<\n ╰──┬──╯`],
    down:` ╭(o─o)╮\n ─（桃）─\n ══════`,
    parts:{head:14,body:'（桃）',arms:8,legs:8,aura:10},
    skillIds:['ic_l2','ic02','ic07','mu_l2','mu01','mu03','cm02'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'emei_d',name:'峨眉弟子',title:'清修女侠',tag:'峨眉九阳',tagColor:'#ffaad4',
    color:'#ffaad4',maxHp:90,atk:17,def:12,speed:'快',maxMp:200,crit:10,dodge:15,speedN:12,
    desc:'峨眉派女弟子，心性纯净，修得基础九阳真气，招式灵动如仙鹤舞空',
    stand:`🌺 峨 眉 🌺
 ╭(≧◡≦)╮
 🌸（眉）🌸
 ╰──┬──╯
🌸─────🌸`,
    attack:[` ╭(≧◡≦)╮\n─🌸（眉）招\n ╰──┬──╯`,` ╭(≧◡≦)╮\n 🌸（眉）🌸\n ╰──┬──╯─`],
    heavy:[` 🌺🌺🌺\n╭(≧◡≦)╮\n│（眉）│\n╰─┬─╯\n🌸─┿─🌸`],
    hit:[` ╭(≧_≦)╮\n>🌸（眉）🌸\n ╰──┬──╯`,` ╭(≧_≦)╮\n 🌸（眉）🌸<\n ╰──┬──╯`],
    down:` (≧─≦)\n 🌸（眉）🌸\n ══════`,
    parts:{head:15,body:'（眉）',arms:7,legs:9,aura:10},
    skillIds:['ho_l2','ho03','ic_l3','ic05','ta_l2','ta03','cm03'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'kongtong_d',name:'崆峒弟子',title:'七伤修士',tag:'七伤拳法',tagColor:'#e06040',
    color:'#e06040',maxHp:120,atk:23,def:12,speed:'普通',maxMp:120,crit:18,dodge:8,speedN:8,
    desc:'崆峒派弟子，修习七伤拳入门功法，以伤换伤的血性打法令人胆寒',
    stand:`⛰ 崆 峒 ⛰
╔══════╗
║(ò_ó)║
║（峒）║
╚══════╝`,
    attack:[`╔══════╗\n║(ò_ó)║─拳\n║（峒）║`,`╔══════╗\n║(ò_ó)║\n║（峒）║─拳拳`],
    heavy:[`╔══════╗\n║(ò_ó)║\n║（峒）║\n╚══════╝\n拳拳拳`],
    hit:[`╔══════╗\n>║(ò_ó)║\n ║（峒）║`,`╔══════╗\n ║(ò_ó)║<\n ║（峒）║`],
    down:`╔══════╗\n─║(o─o)║─\n╚══════╝\n══════`,
    parts:{head:9,body:'（崆）',arms:6,legs:0,aura:4},
    skillIds:['fi_lf1','fi1h','fo01','fo03','th_l1','th02','cm04'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'kunlun_d',name:'昆仑弟子',title:'雪域剑客',tag:'昆仑绝顶',tagColor:'#90d0ff',
    color:'#90d0ff',maxHp:100,atk:20,def:13,speed:'普通',maxMp:170,crit:12,dodge:12,speedN:8,
    desc:'昆仑派入门弟子，以厚重剑法配合冰系内功，如高山压顶难以抵挡',
    stand:`🏔 昆 仑 🏔
 ╭─(^▽^)─╮
 ❄（仑）❄
 ╰────────╯
❄─────────❄`,
    attack:[` ╭(^▽^)╮\n─❄（仑）❄剑\n ╰────────╯`,` ╭(^▽^)╮\n ❄（仑）❄\n ╰────────╯─`],
    heavy:[` 🏔🏔🏔\n╭(^▽^)╮\n│（仑）│\n╰─┬─╯\n❄━━┿━━❄`],
    hit:[` ╭(^_^)╮\n>❄（仑）❄\n ╰────────╯`,` ╭(^_^)╮\n ❄（仑）❄<\n ╰────────╯`],
    down:` (^─^)\n ❄（仑）❄\n ══════`,
    parts:{head:2,body:'（昆）',arms:1,legs:4,aura:9},
    skillIds:['sw_l1','sw03','sw05','ic_l1','ic03','fo_l3','cm05'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },

  // ══ 新兴势力 ══
  {
    id:'tiandibang_d',name:'天地帮弟子',title:'雷霆帮众',tag:'雷鸣四野',tagColor:'#ffe040',
    color:'#ffe040',maxHp:115,atk:22,def:11,speed:'普通',maxMp:150,crit:15,dodge:8,speedN:8,
    desc:'天地帮普通帮众，身形壮实，雷系基础功法练得有板有眼，战吼震天',
    stand:`⚡ 天 地 帮 ⚡
╔═══════╗
║ ▓_▓  ║
║（帮） ║
⚡━━━━━━━⚡`,
    attack:[`╔═══════╗\n║ ▓_▓  ║─拳\n║（帮） ║`,`╔═══════╗\n║ ▓_▓  ║\n║（帮） ║─拳拳`],
    heavy:[`⚡╔═══════╗⚡\n ║ ▓_▓  ║\n ║（帮） ║\n ⚡━━━┿━━━⚡`],
    hit:[`╔═══════╗\n>║ ▓_▓  ║\n ║（帮） ║`,`╔═══════╗\n ║ ▓_▓  ║<\n ║（帮） ║`],
    down:`╔═══════╗\n─║ ▓─▓  ║─\n╚═══════╝\n══════`,
    parts:{head:9,body:'（帮）',arms:6,legs:0,aura:8},
    skillIds:['th_l1','th01','th02','th05','fo01','fi_lf3','cm06'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'guigu_d',name:'鬼谷弟子',title:'谋算新秀',tag:'天机不可泄',tagColor:'#d4b050',
    color:'#d4b050',maxHp:82,atk:17,def:8,speed:'快',maxMp:190,crit:15,dodge:18,speedN:12,
    desc:'鬼谷门入门弟子，初学奇门遁甲，行事神秘莫测，以奇谋制敌乃其所长',
    stand:`🔮 天机阁 🔮
 ╭(~_~)╮
 🔮（谷）🔮
 ╰──┬──╯
🔮─────🔮`,
    attack:[` ╭(~_~)╮\n─🔮（谷）奇\n ╰──┬──╯`,` ╭(~_~)╮\n 🔮（谷）🔮\n ╰──┬──╯─`],
    heavy:[` 🔮🔮🔮\n╭(~_~)╮\n│（谷）│\n╰─┬─╯\n🔮─┿─🔮`],
    hit:[` ╭(~_~)╮\n>🔮（谷）🔮\n ╰──┬──╯`,` ╭(~_~)╮\n 🔮（谷）🔮<\n ╰──┬──╯`],
    down:` (~─~)\n 🔮（谷）🔮\n ══════`,
    parts:{head:5,body:'（谷）',arms:14,legs:9,aura:14},
    skillIds:['qm_l3','qm01','qm08','qm10','ft_l1','ft05','cm07'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'shengguang_d',name:'圣光弟子',title:'圣光骑士',tag:'圣光庇佑',tagColor:'#ffffa0',
    color:'#ffffa0',maxHp:95,atk:16,def:14,speed:'普通',maxMp:210,crit:8,dodge:10,speedN:8,
    desc:'圣光教骑士学员，修习圣光基础功，以治愈与正义为信仰，光芒护体',
    stand:`✦ 圣 光 ✦
╔═══════╗
║ (^‿^) ║
║（光） ║
╚═══════╝`,
    attack:[`╔═══════╗\n║ (^‿^) ║─光\n║（光） ║`,`╔═══════╗\n║ (^‿^) ║\n║（光） ║─光光`],
    heavy:[`✦╔═══════╗✦\n ║ (^‿^) ║\n ║（光） ║\n ╚═══════╝`],
    hit:[`╔═══════╗\n>║ (^‿^) ║\n ║（光） ║`,`╔═══════╗\n ║ (^‿^) ║<\n ║（光） ║`],
    down:`╔═══════╗\n─║ (^─^) ║─\n╚═══════╝\n══════`,
    parts:{head:8,body:'（光）',arms:12,legs:0,aura:1},
    skillIds:['ho_l1','ho01','ho03','ho04','mu_l2','bd_l2','cm01'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'diancang_d',name:'点苍弟子',title:'苍山剑手',tag:'苍山如海',tagColor:'#70c8b0',
    color:'#70c8b0',maxHp:88,atk:19,def:9,speed:'快',maxMp:150,crit:20,dodge:20,speedN:12,
    desc:'点苍派弟子，毒剑双修入门者，步法轻灵，剑上淬有微毒，令人防不胜防',
    stand:`💠 点 苍 💠
 ╭(·_·)╮
 💠（苍）💠
 ╰──┬──╯
～──────～`,
    attack:[` ╭(·_·)╮\n─💠（苍）剑\n ╰──┬──╯`,` ╭(·_·)╮\n 💠（苍）💠\n ╰──┬──╯─`],
    heavy:[` 💠💠💠\n╭(·_·)╮\n│（苍）│\n╰─┬─╯\n～─┿─～`],
    hit:[` ╭(·_·)╮\n>💠（苍）💠\n ╰──┬──╯`,` ╭(·_·)╮\n 💠（苍）💠<\n ╰──┬──╯`],
    down:` (·─·)\n 💠（苍）💠\n ══════`,
    parts:{head:2,body:'（苍）',arms:1,legs:1,aura:13},
    skillIds:['sw_l2','sw02','po_l2','po04','wi_l1','wi02','cm02'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'tianshan_d',name:'天山弟子',title:'冰封修士',tag:'天山六阳掌',tagColor:'#d0f0ff',
    color:'#d0f0ff',maxHp:90,atk:17,def:12,speed:'普通',maxMp:180,crit:10,dodge:15,speedN:8,
    desc:'天山派弟子，于极寒之地锤炼筋骨，修习六阳掌入门功，寒气逼人',
    stand:`❄ 天 山 ❄
 ╭(~_~)╮
 ❄（山）❄
 ╰──┬──╯
❄══════❄`,
    attack:[` ╭(~_~)╮\n─❄（山）❄寒\n ╰──┬──╯`,` ╭(~_~)╮\n ❄（山）❄\n ╰──┬──╯─`],
    heavy:[` ❄❄❄\n╭(~_~)╮\n│（山）│\n╰─┬─╯\n❄══┿══❄`],
    hit:[` ╭(~_~)╮\n>❄（山）❄\n ╰──┬──╯`,` ╭(~_~)╮\n ❄（山）❄<\n ╰──┬──╯`],
    down:` (~─~)\n ❄（山）❄\n ══════`,
    parts:{head:1,body:'（山）',arms:0,legs:0,aura:9},
    skillIds:['ic_l1','ic02','ic04','ic07','ta_l2','ho_l2','cm03'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'xixia_d',name:'西夏弟子',title:'密宗术士',tag:'西域秘法',tagColor:'#c0a0e0',
    color:'#c0a0e0',maxHp:84,atk:18,def:8,speed:'快',maxMp:185,crit:15,dodge:18,speedN:12,
    desc:'西夏秘宗弟子，修习西域密法，以奇门阵法和命理推算迷惑对手',
    stand:`🌙 西 夏 🌙
 ╭(·▿·)╮
 🌙（夏）🌙
 ╰──┬──╯
🌙─────🌙`,
    attack:[` ╭(·▿·)╮\n─🌙（夏）法\n ╰──┬──╯`,` ╭(·▿·)╮\n 🌙（夏）🌙\n ╰──┬──╯─`],
    heavy:[` 🌙🌙🌙\n╭(·▿·)╮\n│（夏）│\n╰─┬─╯\n🌙─┿─🌙`],
    hit:[` ╭(·▿·)╮\n>🌙（夏）🌙\n ╰──┬──╯`,` ╭(·▿·)╮\n 🌙（夏）🌙<\n ╰──┬──╯`],
    down:` (·─·)\n 🌙（夏）🌙\n ══════`,
    parts:{head:5,body:'（夏）',arms:14,legs:9,aura:14},
    skillIds:['ft_l1','ft03','ft05','qm_l3','qm05','sh_l1','cm04'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'tianlong_d',name:'天龙弟子',title:'龙象修士',tag:'龙象般若功',tagColor:'#e8a000',
    color:'#e8a000',maxHp:130,atk:21,def:14,speed:'普通',maxMp:160,crit:15,dodge:8,speedN:8,
    desc:'天龙帮弟子，修习龙象般若入门功法，力量惊人，行事刚猛直接',
    stand:`🐉 天 龙 🐉
╔═══════╗
║(▓_▓) ║
║（龙） ║
╚═══════╝`,
    attack:[`╔═══════╗\n║(▓_▓) ║─力\n║（龙） ║`,`╔═══════╗\n║(▓_▓) ║\n║（龙） ║─力力`],
    heavy:[`🐉╔═══════╗🐉\n ║(▓_▓) ║\n ║（龙） ║\n ╚═══════╝`],
    hit:[`╔═══════╗\n>║(▓_▓) ║\n ║（龙） ║`,`╔═══════╗\n ║(▓_▓) ║<\n ║（龙） ║`],
    down:`╔═══════╗\n─║(▓─▓) ║─\n╚═══════╝\n══════`,
    parts:{head:11,body:'（龙）',arms:6,legs:7,aura:15},
    skillIds:['fo_l1','fo02','fo03','fi_lf2','fi1a','bd_l1','cm05'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'nangong_d',name:'南宫弟子',title:'世家剑手',tag:'南宫剑典',tagColor:'#b8d890',
    color:'#b8d890',maxHp:95,atk:20,def:11,speed:'快',maxMp:165,crit:20,dodge:18,speedN:12,
    desc:'南宫世家弟子，出身高贵，举止儒雅，剑法攻守兼备，以礼击人',
    stand:`🏛 南 宫 🏛
 ╭(^_^)╮
 🏛（宫）🏛
 剑典天下
╰───────╯`,
    attack:[` ╭(^_^)╮\n─🏛（宫）剑\n╰───────╯`,` ╭(^_^)╮\n 🏛（宫）🏛\n╰───────╯─`],
    heavy:[` 🏛🏛🏛\n╭(^_^)╮\n│（宫）│\n╰─┬─╯\n─────────`],
    hit:[` ╭(^_^)╮\n>🏛（宫）🏛\n╰───────╯`,` ╭(^_^)╮\n 🏛（宫）🏛<\n╰───────╯`],
    down:` (^─^)\n 🏛（宫）🏛\n ══════`,
    parts:{head:5,body:'（宫）',arms:1,legs:1,aura:5},
    skillIds:['sw_l1','sw01','sw04','ho_l1','ho02','mu_l2','cm06'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'xuanming_d',name:'玄冥弟子',title:'寒毒修士',tag:'玄冥神掌',tagColor:'#7090c0',
    color:'#7090c0',maxHp:88,atk:19,def:9,speed:'普通',maxMp:170,crit:18,dodge:15,speedN:8,
    desc:'玄冥教弟子，修习玄冥寒掌入门功，寒毒入体，令对手举步维艰',
    stand:`⛧ 玄 冥 ⛧
╔═══════╗
║(╬▔_▔)║
║（冥） ║
╚═══════╝`,
    attack:[`╔═══════╗\n║(╬▔_▔)║─寒\n║（冥） ║`,`╔═══════╗\n║(╬▔_▔)║\n║（冥） ║─寒寒`],
    heavy:[`⛧╔═══════╗⛧\n ║(╬▔_▔)║\n ║（冥） ║\n ╚═══════╝`],
    hit:[`╔═══════╗\n>║(╬▔_▔)║\n ║（冥） ║`,`╔═══════╗\n ║(╬▔_▔)║<\n ║（冥） ║`],
    down:`╔═══════╗\n─║(╬─╬) ║─\n╚═══════╝\n══════`,
    parts:{head:6,body:'（冥）',arms:10,legs:0,aura:9},
    skillIds:['ic_l2','ic03','ic06','po_l1','po02','sh_l2','cm07'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'haisha_d',name:'海沙弟子',title:'东海刀客',tag:'海沙七杀刀',tagColor:'#4090d0',
    color:'#4090d0',maxHp:105,atk:22,def:10,speed:'快',maxMp:130,crit:22,dodge:22,speedN:16,
    desc:'海沙派海贼弟子，出没于风浪之间，七杀刀法刚猛激烈，如海浪滔天',
    stand:`⚓ 海 沙 ⚓
 ╭(●_●)╮
 ⚓（沙）⚓
 ╰──┬──╯
〰──────〰`,
    attack:[` ╭(●_●)╮\n─⚓（沙）刀\n ╰──┬──╯`,` ╭(●_●)╮\n ⚓（沙）⚓\n ╰──┬──╯─`],
    heavy:[` ⚓⚓⚓\n╭(●_●)╮\n│（沙）│\n╰─┬─╯\n〰─┿─〰`],
    hit:[` ╭(●_●)╮\n>⚓（沙）⚓\n ╰──┬──╯`,` ╭(●_●)╮\n ⚓（沙）⚓<\n ╰──┬──╯`],
    down:` (●─●)\n ⚓（沙）⚓\n ══════`,
    parts:{head:1,body:'（沙）',arms:2,legs:6,aura:4},
    skillIds:['sh_l1','sh02','sh06','fo_l2','fo04','th_l2','cm01'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'xuegu_d',name:'血骨弟子',title:'血炼武士',tag:'血炼大法',tagColor:'#cc2020',
    color:'#cc2020',maxHp:118,atk:24,def:12,speed:'普通',maxMp:120,crit:25,dodge:15,speedN:12,
    desc:'血骨门弟子，以血为引修炼体魄，皮肉坚韧，杀伐决断毫不留情',
    stand:`💀 血 骨 门 💀
╔══════════╗
║ (×_×)  ║
║（骨）    ║
╚══════════╝`,
    attack:[`╔══════════╗\n║ (×_×)  ║─血\n║（骨）    ║`,`╔══════════╗\n║ (×_×)  ║\n║（骨）    ║─血血`],
    heavy:[`💀╔══════════╗💀\n  ║ (×_×)  ║\n  ║（骨）    ║\n  ╚══════════╝`],
    hit:[`╔══════════╗\n>║ (×_×)  ║\n ║（骨）    ║`,`╔══════════╗\n ║ (×_×)  ║<\n ║（骨）    ║`],
    down:`╔══════════╗\n─║ (×─×)  ║─\n╚══════════╝\n══════`,
    parts:{head:6,body:'（骨）',arms:11,legs:0,aura:11},
    skillIds:['fi_lf1','fi1h','fi1j','fo_l2','fo05','sh_l1','cm02'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'lingxiao_d',name:'凌霄弟子',title:'天下情报员',tag:'凌霄九式',tagColor:'#d0a060',
    color:'#d0a060',maxHp:86,atk:20,def:8,speed:'极快',maxMp:160,crit:20,dodge:18,speedN:8,
    desc:'凌霄阁弟子，情报收集与武功兼修，剑法灵活多变，随机应变乃其最大优势',
    stand:`🏯 凌 霄 阁 🏯
 ╭(^‿^)─╮
 🏯（霄）🏯
 ╰───────╯
─────────────`,
    attack:[` ╭(^‿^)╮\n─🏯（霄）剑\n ╰───────╯`,` ╭(^‿^)╮\n 🏯（霄）🏯\n ╰───────╯─`],
    heavy:[` 🏯🏯🏯\n╭(^‿^)╮\n│（霄）│\n╰─┬─╯\n─────────`],
    hit:[` ╭(^‿^)╮\n>🏯（霄）🏯\n ╰───────╯`,` ╭(^‿^)╮\n 🏯（霄）🏯<\n ╰───────╯`],
    down:` (^─^)\n 🏯（霄）🏯\n ══════`,
    parts:{head:2,body:'（霄）',arms:1,legs:6,aura:13},
    skillIds:['sw_l2','sw04','wi_l1','wi03','qm_l2','qm06','cm03'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
  {
    id:'qingcheng_d',name:'青城弟子',title:'幽谷剑客',tag:'青城十九剑',tagColor:'#60b060',
    color:'#60b060',maxHp:87,atk:19,def:9,speed:'快',maxMp:160,crit:15,dodge:18,speedN:12,
    desc:'青城派弟子，行事低调阴沉，毒剑并修，剑上常淬奇毒，令对手闻风丧胆',
    stand:`🌿 青 城 🌿
 ╭(·_·)╮
 🌿（城）🌿
 ╰──┬──╯
🌿─────🌿`,
    attack:[` ╭(·_·)╮\n─🌿（城）剑\n ╰──┬──╯`,` ╭(·_·)╮\n 🌿（城）🌿\n ╰──┬──╯─`],
    heavy:[` 🌿🌿🌿\n╭(·_·)╮\n│（城）│\n╰─┬─╯\n🌿─┿─🌿`],
    hit:[` ╭(·_·)╮\n>🌿（城）🌿\n ╰──┬──╯`,` ╭(·_·)╮\n 🌿（城）🌿<\n ╰──┬──╯`],
    down:` (·─·)\n 🌿（城）🌿\n ══════`,
    parts:{head:2,body:'（青）',arms:1,legs:1,aura:6},
    skillIds:['sw_l3','sw02','po_l2','po03','sh_l3','sh04','cm04'],
    get skills(){ return getSkills(this.skillIds).map((s,i)=>({...s,key:String(i+1)})); }
  },
];

// ════════════════════════════════════════════════
//  页面切换
// ════════════════════════════════════════════════
