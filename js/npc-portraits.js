// npc-portraits.js — NPC字符画形象库
// 每个portrait以职业/角色类型为ID，字符画根据NPC持有的weapon/armor动态组合显示
// 引用规则：NPC数据里的 portrait 字段对应此处 key

// ── 武器种类 → ASCII符号映射 ──
const WEP_SYMBOL = {
  // 剑类
  '剑': '⚔', '长剑': '⚔', '软剑': '⚔', '轻剑': '⚔', '圣器': '✝',
  // 刀类
  '单刀': '🗡', '大刀': '刀', '弯刀': '刀', '短刀': '刃', '扇形暗器': '扇',
  // 枪矛类
  '长枪': '矛', '长矛': '矛', '冰枪': '矛', '锤': '锤',
  // 棍杖类
  '棍': '棍', '禅杖': '杖', '法杖': '杖', '雷杖': '杖',
  // 暗器类
  '暗器': '针', '银针': '针',
  // 法器乐器
  '法器': '器', '乐器': '琴',
  // 拳套软鞭
  '拳套': '拳', '软鞭': '鞭',
  // 其他
  '钝器': '棒', '短刀': '刃',
  // 默认
  '_default': '剑'
};

// 武器ID → 武器type快速查找（常用NPC装备）
const WEP_TYPE_MAP = {
  wep_iron_sword:    {sym:'⚔', cat:'剑'},
  wep_silver_sword:  {sym:'⚔', cat:'剑'},
  wep_xuanming_sword:{sym:'⚔', cat:'剑'},
  wep_wind_blade:    {sym:'⚔', cat:'剑'},
  wep_heaven_sword:  {sym:'⚔', cat:'剑'},
  wep_taiji_sword:   {sym:'☯', cat:'剑'},
  wep_cold_light:    {sym:'❄', cat:'剑'},
  wep_uc_dao:        {sym:'🗡', cat:'刀'},
  wep_blood_saber:   {sym:'刀', cat:'刀'},
  wep_ghost_blade:   {sym:'刀', cat:'刀'},
  wep_dragon_saber:  {sym:'刀', cat:'刀'},
  wep_poison_fan:    {sym:'扇', cat:'刀'},
  wep_dark_knife:    {sym:'刃', cat:'刀'},
  wep_short_knife:   {sym:'刃', cat:'刀'},
  wep_wolf_fang:     {sym:'棒', cat:'棒'},
  wep_uc_spear:      {sym:'矛', cat:'枪矛'},
  wep_long_spear:    {sym:'矛', cat:'枪矛'},
  wep_dragon_lance:  {sym:'矛', cat:'枪矛'},
  wep_sun_spear:     {sym:'☀', cat:'枪矛'},
  wep_meteor_hammer: {sym:'锤', cat:'棒'},
  wep_ice_lance:     {sym:'冰', cat:'枪矛'},
  wep_uc_bamboo_staff:{sym:'棍',cat:'棍杖'},
  wep_iron_staff:    {sym:'棍', cat:'棍杖'},
  wep_nine_ring:     {sym:'杖', cat:'棍杖'},
  wep_fire_staff:    {sym:'杖', cat:'棍杖'},
  wep_peach_stick:   {sym:'棍', cat:'棍杖'},
  wep_tao_charm:     {sym:'符', cat:'法器'},
  wep_silver_needle: {sym:'针', cat:'暗器'},
  wep_dark_needle:   {sym:'针', cat:'暗器'},
  wep_poison_needle: {sym:'针', cat:'暗器'},
  wep_flying_dagger: {sym:'镖', cat:'暗器'},
  wep_stone_bullet:  {sym:'弹', cat:'暗器'},
  wep_fire_glove:    {sym:'拳', cat:'拳套'},
  wep_iron_glove:    {sym:'拳', cat:'拳套'},
  wep_xuanming_palm: {sym:'鞭', cat:'拳套'},
  wep_divine_qin:    {sym:'琴', cat:'乐器'},
  wep_thunder_drum:  {sym:'鼓', cat:'乐器'},
  wep_holy_cross:    {sym:'✝', cat:'剑'},

  // ── 传说级武器 ──
  wep_nine_ring:       {sym:'杖', cat:'棍杖'},   // 九环禅杖
  wep_taiji_sword:     {sym:'☯', cat:'剑'},      // 太极剑（已有，保留）
  wep_cold_light:      {sym:'❄', cat:'剑'},      // 寒光剑（已有，保留）
  wep_heaven_sword:    {sym:'⚔', cat:'剑'},      // 倚天剑（已有，保留）
  wep_sun_spear:       {sym:'☀', cat:'枪矛'},    // 日月神矛（已有，保留）
  wep_dragon_saber:    {sym:'刀', cat:'刀'},      // 屠龙刀（已有，保留）
  wep_ghost_blade:     {sym:'刀', cat:'刀'},      // 幽冥鬼头刀（已有，保留）

  // ── 神器级武器（mythic wep_m_*）──
  wep_m_xuanyuan:      {sym:'⚔', cat:'剑'},      // 轩辕天剑
  wep_m_chaos_saber:   {sym:'🗡', cat:'刀'},      // 混沌魔刀
  wep_m_divine_spear:  {sym:'✦', cat:'枪矛'},    // 开天神枪
  wep_m_ruyi:          {sym:'棒', cat:'棍杖'},    // 如意金箍棒
  wep_m_heaven_dart:   {sym:'镖', cat:'暗器'},    // 天外流星
  wep_m_dragon_fist:   {sym:'拳', cat:'拳套'},    // 龙爪天罡手
  wep_m_chaos_bead:    {sym:'器', cat:'法器'},    // 混元珠
  wep_m_ling_xiao_qin: {sym:'琴', cat:'乐器'},    // 凌霄九音琴
};

// ── 护甲种类 → 体型符号映射（用于字符画身体部分）──
const COS_BODY_MAP = {
  // 门派服装
  cs_shaolin:    {body:'（禅）', aura:'卍', color:'#f0c040'},
  cs_wudang:     {body:'（道）', aura:'☯',  color:'#60d8d8'},
  cs_xiaoyao:    {body:'（逍）', aura:'～',  color:'#80f0c0'},
  cs_riyue:      {body:'（教）', aura:'☀',  color:'#ff8820'},
  cs_huashan:    {body:'（华）', aura:'✦',  color:'#80d8ff'},
  cs_mingjiao:   {body:'（明）', aura:'🔥', color:'#ff6020'},
  cs_wudu:       {body:'（毒）', aura:'🐍', color:'#88ff44'},
  cs_tangmen:    {body:'（唐）', aura:'░',  color:'#a080c0'},
  cs_taohuadao:  {body:'（桃）', aura:'🌸', color:'#ffaacc'},
  cs_emei:       {body:'（眉）', aura:'⚪', color:'#e8e8ff'},
  cs_kongtong:   {body:'（崆）', aura:'█',  color:'#c08060'},
  cs_kunlun:     {body:'（昆）', aura:'❄',  color:'#aaddff'},
  cs_tiandibang: {body:'（帮）', aura:'▓',  color:'#888888'},
  cs_guigu:      {body:'（谷）', aura:'★',  color:'#8866cc'},
  cs_shengguang: {body:'（圣）', aura:'✨', color:'#ffffaa'},
  cs_tianshan:   {body:'（天）', aura:'雪',  color:'#cceeff'},
  // ── 传说级防具（legendary · 10套）──
  cs_lg_shaolin:    {body:'〔禅〕', aura:'卍', color:'#ffd060'},   // 达摩祖师袈裟
  cs_lg_wudang:     {body:'〔道〕', aura:'☯',  color:'#60d8ff'},   // 真武玄天道袍
  cs_lg_riyue:      {body:'〔日〕', aura:'☀',  color:'#ffaa40'},   // 日月乾坤袍
  cs_lg_xiaoyao:    {body:'〔逍〕', aura:'～',  color:'#80ffcc'},   // 御风逍遥仙袍
  cs_lg_xuanming:   {body:'〔冥〕', aura:'⛧',  color:'#9955ee'},   // 玄冥寒冰战甲
  cs_lg_tianzhan:   {body:'〔雷〕', aura:'⚡', color:'#88ccff'},   // 天罗雷霆战甲
  cs_lg_taohua:     {body:'〔花〕', aura:'🌸', color:'#ffbbdd'},   // 仙子桃花霓裳
  cs_lg_xuegu:      {body:'〔血〕', aura:'💀', color:'#cc3333'},   // 百骸血魔战袍
  cs_lg_shengguang: {body:'〔圣〕', aura:'✦',  color:'#ffffcc'},   // 圣光天使铠
  cs_lg_kongtong:   {body:'〔崆〕', aura:'█',  color:'#cc9966'},   // 七伤玄铁重铠

  // ── 史诗级防具（epic · 8套）──
  cs_ep_shadow:     {body:'（影）', aura:'◈',  color:'#9966cc'},   // 幽冥夜行铠
  cs_ep_iron:       {body:'〖铁〗', aura:'◆',  color:'#8899bb'},   // 玄铁龙鳞甲
  cs_ep_wind:       {body:'〔风〕', aura:'～',  color:'#88ddff'},   // 御风飞羽战袍
  cs_ep_fire:       {body:'〔炎〕', aura:'🔥', color:'#ff7733'},   // 炎龙焚天战甲
  cs_ep_buddha:     {body:'〔佛〕', aura:'卍',  color:'#ffdd88'},   // 菩提金身袈裟
  cs_ep_poison:     {body:'〔毒〕', aura:'🐍', color:'#88cc66'},   // 百毒不侵锦袍
  cs_ep_qimen:      {body:'〔奇〕', aura:'★',  color:'#cc88ff'},   // 奇门星象法袍
  cs_ep_sword:      {body:'〔剑〕', aura:'✦',  color:'#88bbff'},   // 天剑流光护甲

  // 通用服装
  cs_cloth:        {body:'（布）', aura:'─',  color:'#aaaaaa'},
  cs_soldier:      {body:'（兵）', aura:'▲',  color:'#887744'},
  cs_general:      {body:'（将）', aura:'◆',  color:'#8899aa'},
  cs_ranger:       {body:'（侠）', aura:'◇',  color:'#558855'},
  cs_assassin:     {body:'（影）', aura:'◈',  color:'#445566'},
  cs_taoist_grey:  {body:'（道）', aura:'⊙',  color:'#999988'},
  cs_monk_robe:    {body:'（僧）', aura:'卍',  color:'#bb8855'},
  cs_beggar:       {body:'（丐）', aura:'∵',  color:'#887766'},
  cs_fairy:        {body:'（仙）', aura:'✿',  color:'#ffd0ff'},
  cs_iron_vest:    {body:'（甲）', aura:'▒',  color:'#9999aa'},
  _default:        {body:'（人）', aura:'─',  color:'#aaaaaa'},
};

// ── 获取NPC武器显示符号 ──
function getNpcWepSym(weaponId){
  if(!weaponId) return '─';
  const m = WEP_TYPE_MAP[weaponId];
  if(m) return m.sym;
  // 尝试从装备库里找
  const tpl = (typeof WEAPONS !== 'undefined') && WEAPONS.find(w=>w.id===weaponId);
  if(tpl) return WEP_SYMBOL[tpl.type] || WEP_SYMBOL['_default'];
  return '剑';
}

// ── 获取NPC护甲样式数据 ──
function getNpcCosStyle(armorId){
  if(!armorId) return COS_BODY_MAP['_default'];
  return COS_BODY_MAP[armorId] || COS_BODY_MAP['_default'];
}

// ══════════════════════════════════════════════════════════════════
//  NPC_PORTRAITS — 按职业分类的字符画模板
//  每个portrait是一个函数 (wepSym, cosStyle) => string
//  wepSym: 武器符号（单字/emoji）
//  cosStyle: {body, aura, color}
// ══════════════════════════════════════════════════════════════════
const NPC_PORTRAITS = {

  // ── 掌柜/店主 ──────────────────────────────
  innkeeper: (w, c) =>
`  ╭(^‿^)╮
 ${c.aura}${c.body}${c.aura}
  ╰─┬─╯
 ─┤ ≡ ├─`,

  shopkeeper: (w, c) =>
`  ╭(•‿•)╮
 ${c.aura}${c.body}${c.aura}
  ╰─┬─╯
  算盘拨`,

  // ── 郎中/医者 ──────────────────────────────
  doctor: (w, c) =>
`  ╭(ˊ_ˋ)╮
 ${c.aura}${c.body}${c.aura}
  ╰─┬─╯
   ${w}  ${w}`,

  // ── 铁匠/工匠 ──────────────────────────────
  blacksmith: (w, c) =>
`  ╭(◣_◢)╮
 ${c.aura}${c.body}${c.aura}
  ╠═══╣
  锤─砧`,

  // ── 武将/将领 ──────────────────────────────
  general: (w, c) =>
` ◆╭(◉_◉)╮◆
 ${c.aura}${c.body}${c.aura}
  ╠═╦═╣
 ${c.aura}━━┿━━${c.aura}`,

  // ── 侠客/游侠 ──────────────────────────────
  ranger: (w, c) =>
`  ╭(◕_◕)╮
 ${c.aura}${c.body}${c.aura}${w}
  ╰──┬──╯
  ～─┿─～`,

  // ── 刺客/暗门 ──────────────────────────────
  assassin: (w, c) =>
`  ▓(▮_▮)▓
 ${c.aura}${c.body}${c.aura}
 ░╰──┬──╯░
  ${w} ${w} ${w}`,

  // ── 道士 ──────────────────────────────────
  taoist: (w, c) =>
`☯ ☯ ☯ ☯
  ╭(^_^)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ～─${w}─～`,

  // ── 和尚/僧侣 ─────────────────────────────
  monk: (w, c) =>
` 卍 南无 卍
  ╭(◎_◎)╮
 ${c.aura}${c.body}${c.aura}
  ╠══╦══╣
 ${c.aura}━━${w}━━${c.aura}`,

  // ── 女侠/女角色 ───────────────────────────
  heroine: (w, c) =>
`  ╭(◕‿◕)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯${w}
  ～～～～`,

  // ── 老者/长老 ─────────────────────────────
  elder: (w, c) =>
`  ╭(ˈ_ˈ)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
   拐─杖`,

  // ── 文士/书生 ─────────────────────────────
  scholar: (w, c) =>
`  ╭(¬‿¬)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
  书─${w}`,

  // ── 镖师/护卫 ─────────────────────────────
  guard: (w, c) =>
`  ╭(◣‿◢)╮
 ${c.aura}${c.body}${c.aura}
  ╠══╦══╣
 ${c.aura}━${w}━┿━${w}━${c.aura}`,

  // ── 丐帮 ──────────────────────────────────
  beggar: (w, c) =>
`  ╭(ˉ▽ˉ)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
  ∵─${w}─∵`,

  // ── 门派掌门/宗主 ─────────────────────────
  sect_leader: (w, c) =>
` ${c.aura}${c.aura}${c.aura}${c.aura}${c.aura}
  ╭(◈_◈)╮
 ${c.aura}${c.body}${c.aura}
  ╠══╦══╣
 ${c.aura}━━${w}━━${c.aura}`,

  // ── 江湖奇人/隐士 ─────────────────────────
  hermit: (w, c) =>
`  ╭(＠_＠)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
  ？─？─？`,

  // ── 官员/知府 ─────────────────────────────
  official: (w, c) =>
`  ╭(›_‹)╮
 ${c.aura}${c.body}${c.aura}
  ╠══╦══╣
  印─章`,

  // ── 武林盟主/大侠 ─────────────────────────
  hero: (w, c) =>
` ★ ★ ★ ★
  ╭(◈_◈)╮
 ${c.aura}${c.body}${c.aura}
  ╠═══╣
 ─${c.aura}${w}${c.aura}─`,

  // ── 密探/情报 ─────────────────────────────
  spy: (w, c) =>
`  ▓(>_<)▓
 ${c.aura}${c.body}${c.aura}
 ░╰──┬──╯░
  ？─情─？`,

  // ── 商人/富豪 ─────────────────────────────
  merchant: (w, c) =>
`  ╭(￣‿￣)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
  💰 💰`,

  // ── 猎户/渔夫 ─────────────────────────────
  hunter: (w, c) =>
`  ╭(⌐■_■)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
  弓─${w}`,

  // ── 毒医/蛊师 ─────────────────────────────
  poisoner: (w, c) =>
`🐍(⊙_⊙)🐍
 ${c.aura}${c.body}${c.aura}
  ─────
  🐍 ${w} 🐍`,

  // ── 教众/信徒 ─────────────────────────────
  cultist: (w, c) =>
` ☀(ω_ω)☀
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ─${c.aura}─${w}─${c.aura}─`,

  // ── 暗器手 ────────────────────────────────
  dagger_user: (w, c) =>
` ░(▓_▓)░
 ${c.aura}${c.body}${c.aura}
  ░─┼─░
  ${w} ${w} ${w}`,

  // ── 琴师/乐师 ─────────────────────────────
  musician: (w, c) =>
`  ╭(♪_♪)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
  ♩─${w}─♩`,

  // ── 通用兜底 ──────────────────────────────
  default: (w, c) =>
`  ╭(•_•)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
  ─${w}─`,
};

// ── 职业role关键字 → portrait ID 自动推断 ──
const ROLE_PORTRAIT_MAP = [
  ['掌柜|店主|老板|东家|客栈',         'innkeeper'],
  ['郎中|大夫|医者|神医|圣手|医仙',    'doctor'],
  ['铁匠|铸剑|工匠|铸造',              'blacksmith'],
  ['将军|将领|校尉|总兵|指挥使',       'general'],
  ['游侠|镖师|护卫|镖头|武师|侠客',    'ranger'],
  ['刺客|暗器|杀手|暗门|影卫',         'assassin'],
  ['道士|道长|真人|天师|道人',         'taoist'],
  ['和尚|僧|禅师|方丈|住持',           'monk'],
  ['尼姑|女侠|女掌门|姑娘|小姐|夫人|仙子|圣女', 'heroine'],
  ['长老|老人|老叟|宗主|前辈|太上',    'elder'],
  ['书生|文士|先生|秀才|才子',         'scholar'],
  ['商人|富商|掌事|行商|布商',         'merchant'],
  ['猎人|渔夫|捕头|弓手',              'hunter'],
  ['毒医|蛊师|毒手|苗医',              'poisoner'],
  ['教众|信徒|使者|堂主|护法|香主',   'cultist'],
  ['探子|密探|斥候|情报|线人',         'spy'],
  ['丐|乞丐',                          'beggar'],
  ['琴师|乐师|音律',                   'musician'],
  ['掌门|宗主|教主|帮主|盟主',         'sect_leader'],
  ['大侠|英雄|豪杰',                   'hero'],
  ['隐士|奇人|怪人|高人',              'hermit'],
  ['知府|县令|官员|太守|刺史|总督',   'official'],
];

// ── 根据role自动推断portrait key ──
function inferPortraitKey(role){
  if(!role) return 'default';
  for(const [pattern, key] of ROLE_PORTRAIT_MAP){
    if(new RegExp(pattern).test(role)) return key;
  }
  return 'default';
}

// ══════════════════════════════════════════════════════════════════
//  门派专属 NPC 字符画
//  key格式：sect_<sectId>  eg. sect_shaolin / sect_wudang
//  每个也是函数 (wepSym, cosStyle) => string
//  但形象固定反映门派特色，weapon/armor只作微调
// ══════════════════════════════════════════════════════════════════
const SECT_PORTRAITS = {

  // ── 少林寺 ── 达摩袈裟·金卍护身
  sect_shaolin: (w, c) =>
` ${c.aura} 南无 ${c.aura}
  ╭(◎_◎)╮
 ${c.aura}${c.body}${c.aura}
  ╠══╦══╣
 ${c.aura}━━${w}━━${c.aura}`,

  // ── 武当派 ── 真武道袍·太极飘逸
  sect_wudang: (w, c) =>
`${c.aura} ${c.aura} ${c.aura} ${c.aura}
  ╭(^_^)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ～─${w}─～`,

  // ── 华山派 ── 剑气纵横、凌云之势
  sect_huashan: (w, c) =>
` ✦  ✦  ✦
  ╭(◉_◉)╮
 ${c.aura}${c.body}${c.aura}
  ╠════╣
 ▓${w}━╋━${w}▓`,

  // ── 日月神教 ── 乾坤袍·日月双轮
  sect_riyue: (w, c) =>
`${c.aura} 日月教 ${c.aura}
  ╭(ω_ω)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ─${c.aura}${w}${c.aura}─`,

  // ── 明教 ── 烈焰战袍、圣火令
  sect_mingjiao: (w, c) =>
`🔥 圣火令 🔥
  ╭(>_<)╮
 🔥（明）🔥
  ╰──┬──╯
 ─🔥${w}🔥─`,

  // ── 逍遥派 ── 御风仙袍·来去无踪
  sect_xiaoyao: (w, c) =>
`${c.aura} ${c.aura} ${c.aura} ${c.aura}
  ╭(^‿^)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ～～${w}～～`,

  // ── 五毒教 ── 毒蛊环绕、阴险诡谲
  sect_wudu: (w, c) =>
`🐍(⊙_⊙)🐍
 🐍（毒）🐍
  ─────
 🐍─${w}─🦂`,

  // ── 唐门 ── 暗格暗器、影影绰绰
  sect_tangmen: (w, c) =>
` ░(▓_▓)░
 ░（唐）░
  ░─┼─░
 ${w}░★░${w}`,

  // ── 桃花堂 ── 霓裳飞花·灵动飘逸
  sect_taohuadao: (w, c) =>
`${c.aura}  ${c.aura}  ${c.aura}
  ╭(◕‿◕)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ${c.aura}─${w}─${c.aura}`,

  // ── 峨眉派 ── 白衣素裳、圣洁凛然
  sect_emei: (w, c) =>
`🌺  峨眉  🌺
  ╭(≧◡≦)╮
 ⚪（眉）⚪
  ╰──┬──╯
 🌸─${w}─🌸`,

  // ── 崆峒派 ── 玄铁重铠·七伤霸气
  sect_kongtong: (w, c) =>
`${c.aura} 崆峒 ${c.aura}
  ╭(ò_ó)╮
 ${c.aura}${c.body}${c.aura}
  ╠═══╣
 ─${w}═╋═${w}─`,

  // ── 昆仑派 ── 雪域寒气、金刚剑法
  sect_kunlun: (w, c) =>
`❄  昆仑  ❄
  ╭(^▽^)╮
 ❄（昆）❄
  ╰──┬──╯
 ❄─${w}─❄`,

  // ── 天地帮 ── 雷霆战甲·雷电震天
  sect_tiandibang: (w, c) =>
`${c.aura} 天地帮 ${c.aura}
  ╭(▓_▓)╮
 ${c.aura}${c.body}${c.aura}
  ╠══╦══╣
 ${c.aura}━${w}━┿━${c.aura}`,

  // ── 鬼谷门 ── 星象袍、算无遗策
  sect_guigu: (w, c) =>
`🔮 天机阁 🔮
  ╭(~_~)╮
 🔮（谷）🔮
  ╰──┬──╯
 🔮─${w}─🔮`,

  // ── 圣光教 ── 天使铠·神圣庄严
  sect_shengguang: (w, c) =>
`${c.aura} 圣光 ${c.aura}
  ╭(^‿^)╮
 ${c.aura}${c.body}${c.aura}
  ╠════╣
 ${c.aura}━${w}━┿━${c.aura}`,

  // ── 点苍派 ── 云雾缥缈、毒剑双修
  sect_diancang: (w, c) =>
`💠 点苍 💠
  ╭(·_·)╮
 💠（苍）💠
  ╰──┬──╯
 ～─${w}─～`,

  // ── 天山派 ── 冰雪晶莹、六阳掌
  sect_tianshan: (w, c) =>
`❄  天山  ❄
  ╭(~_~)╮
 雪（天）雪
  ╰──┬──╯
 ❄══${w}══❄`,

  // ── 西夏秘宗 ── 月色神秘、密宗法相
  sect_xixia: (w, c) =>
`🌙 西夏 🌙
  ╭(·▿·)╮
 🌙（夏）🌙
  ╰──┬──╯
 🌙─${w}─🌙`,

  // ── 天龙帮 ── 龙象之力、吐蕃密宗
  sect_tianlong: (w, c) =>
`🐉 天龙 🐉
  ╭(▓_▓)╮
 🐉（龙）🐉
  ╠═══╣
 ─${w}═╋═${w}─`,

  // ── 南宫世家 ── 儒雅风流、名门风范
  sect_nangong: (w, c) =>
`🏛 南宫 🏛
  ╭(^_^)╮
 ◇（宫）◇
  ╰──┬──╯
 ─◇─${w}─◇─`,

  // ── 玄冥教 ── 寒冰战甲·暗黑冰煞
  sect_xuanming: (w, c) =>
`${c.aura} 玄冥 ${c.aura}
  ╭(╬▔_▔)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ${c.aura}─${w}─${c.aura}`,

  // ── 海沙派 ── 海盗刀客、豪迈粗犷
  sect_haisha: (w, c) =>
`⚓ 海沙 ⚓
  ╭(●_●)╮
 ⚓（沙）⚓
  ╰──┬──╯
 〰─${w}─〰`,

  // ── 血骨门 ── 血魔战袍·骨甲强化
  sect_xuegu: (w, c) =>
`${c.aura} 血骨门 ${c.aura}
  ╭(×_×)╮
 ${c.aura}${c.body}${c.aura}
  ╰──┬──╯
 ─${c.aura}${w}${c.aura}─`,

  // ── 凌霄阁 ── 楼阁剑客、飘逸灵动
  sect_lingxiao: (w, c) =>
`🏯 凌霄阁 🏯
  ╭(^‿^)╮
 🏯（霄）🏯
  ╰──┬──╯
 ─🏯${w}🏯─`,

};

// ── 城池ID / NPC city字段 → 门派 sectId 映射 ──
const CITY_SECT_MAP = {
  shaolin_temple:   'shaolin',
  wudang_mountain:  'wudang',
  huashan_peak:     'huashan',
  riyue_holy:       'riyue',
  mingjiao_altar:   'mingjiao',
  xiaoyao_sect:     'xiaoyao',
  wudu_village:     'wudu',
  tangmen_hall:     'tangmen',
  taohuadao_island: 'taohuadao',
  emei_sect:        'emei',
  kongtong_sect:    'kongtong',
  kunlun_peak:      'kunlun',
  tiandibang_base:  'tiandibang',
  guigu_valley:     'guigu',
  shengguang_temple:'shengguang',
  diancang_sect:    'diancang',
  tianshan_sect:    'tianshan',
  xixia_palace:     'xixia',
  tianlong_temple:  'tianlong',
  nangong_manor:    'nangong',
  xuanming_hall:    'xuanming',
  haisha_island:    'haisha',
  xuegu_fort:       'xuegu',
  lingxiao_tower:   'lingxiao',
};

// ── 根据role关键词推断所属门派 ──
const ROLE_SECT_MAP = [
  [/少林|禅宗|金刚|罗汉/,        'shaolin'],
  [/武当|太极|道家|真武/,        'wudang'],
  [/华山|剑气|论剑/,             'huashan'],
  [/日月|圣火|教主|光明|葵花/,   'riyue'],
  [/明教|波斯|圣火使/,           'mingjiao'],
  [/逍遥|天山折梅/,              'xiaoyao'],
  [/五毒|蛊|苗疆|毒手/,         'wudu'],
  [/唐门|暗器|机关/,             'tangmen'],
  [/桃花岛|落英|黄老邪/,        'taohuadao'],
  [/峨眉|女侠|尼姑/,             'emei'],
  [/崆峒|七伤/,                  'kongtong'],
  [/昆仑|雪域金刚/,              'kunlun'],
  [/天地帮|雷霆/,                'tiandibang'],
  [/鬼谷|奇门遁甲|天机/,         'guigu'],
  [/圣光|圣骑士|圣裁/,           'shengguang'],
  [/点苍|苍山/,                  'diancang'],
  [/天山|冰封|六阳/,             'tianshan'],
  [/西夏|密宗|西域/,             'xixia'],
  [/天龙|龙象/,                  'tianlong'],
  [/南宫|世家|贵族/,             'nangong'],
  [/玄冥|寒掌|寒毒/,             'xuanming'],
  [/海沙|七杀刀|海贼/,           'haisha'],
  [/血骨|血炼|血祭/,             'xuegu'],
  [/凌霄|情报阁/,                'lingxiao'],
];

// ── 推断NPC所属门派 ──
// 优先：city字段 → CITY_SECT_MAP
// 其次：role关键词 → ROLE_SECT_MAP
function inferNpcSect(npc){
  if(!npc) return null;
  // 城池映射
  if(npc.city && CITY_SECT_MAP[npc.city]) return CITY_SECT_MAP[npc.city];
  // role/id关键词推断
  const text = (npc.role||'') + (npc.id||'');
  for(const [pat, sect] of ROLE_SECT_MAP){
    if(pat.test(text)) return sect;
  }
  return null;
}

// ── 生成NPC字符画字符串（核心调用函数）──
// npc: NPC_DB里的NPC对象
// 返回适合放在 <pre> 里的字符画字符串
function getNpcPortrait(npc){
  if(!npc) return NPC_PORTRAITS.default('剑', COS_BODY_MAP['_default']);

  // 优先：NPC数据里手动指定的 portrait 字段
  if(npc.portrait){
    // sect_ 前缀走门派形象
    if(npc.portrait.startsWith('sect_')){
      const fn = SECT_PORTRAITS[npc.portrait] || NPC_PORTRAITS.default;
      const wepSym = getNpcWepSym(npc.weapon);
      const cosStyle = getNpcCosStyle(npc.armor);
      return fn(wepSym, cosStyle);
    }
    // 否则走通用职业形象
    const fn = NPC_PORTRAITS[npc.portrait] || NPC_PORTRAITS.default;
    const wepSym = getNpcWepSym(npc.weapon);
    const cosStyle = getNpcCosStyle(npc.armor);
    return fn(wepSym, cosStyle);
  }

  const wepSym = getNpcWepSym(npc.weapon);
  const cosStyle = getNpcCosStyle(npc.armor);

  // 自动推断：先试门派形象
  const sectId = inferNpcSect(npc);
  if(sectId){
    const sectFn = SECT_PORTRAITS['sect_' + sectId];
    if(sectFn) return sectFn(wepSym, cosStyle);
  }

  // 最后走通用职业形象
  const portraitKey = inferPortraitKey(npc.role);
  const fn = NPC_PORTRAITS[portraitKey] || NPC_PORTRAITS.default;
  return fn(wepSym, cosStyle);
}

// ══════════════════════════════════════════════════════════════════
//  buildNpcPartsHtml — 用 ED_PARTS 部件规则生成 ft-animated HTML
//  与玩家捏脸使用完全相同的部件库，效果一致
//  npc: NPC_DB对象  col: 颜色字符串（可选，默认取cosStyle.color）
// ══════════════════════════════════════════════════════════════════

// ── 武器ID → arms部件索引 ──
const NPC_WEP_ARMS_MAP = {
  // 剑类 → 长剑(1)
  wep_iron_sword:1, wep_silver_sword:1, wep_xuanming_sword:1,
  wep_wind_blade:1, wep_heaven_sword:1, wep_taiji_sword:1,
  wep_cold_light:1, wep_holy_cross:1,
  wep_m_xuanyuan:1,
  // 刀类 → 双刀(2)
  wep_uc_dao:2, wep_blood_saber:2, wep_ghost_blade:2,
  wep_dragon_saber:2, wep_dark_knife:2, wep_short_knife:2,
  wep_poison_fan:5,   // 扇→折扇(5)
  wep_m_chaos_saber:2,
  // 棍杖类 → 棍棒(8)
  wep_uc_bamboo_staff:8, wep_iron_staff:8, wep_nine_ring:3,  // 九环→禅杖(3)
  wep_fire_staff:15,  // 火法杖→火焰(15)
  wep_peach_stick:8,
  wep_m_ruyi:8,
  // 枪矛类 → 长枪(12)
  wep_uc_spear:12, wep_long_spear:12, wep_dragon_lance:12,
  wep_sun_spear:12, wep_ice_lance:12,
  wep_m_divine_spear:12,
  // 暗器类 → 飞镖(9)
  wep_silver_needle:13, wep_dark_needle:13, wep_poison_needle:13,
  wep_flying_dagger:9, wep_stone_bullet:9,
  wep_m_heaven_dart:9,
  // 拳套 → 铁拳(6)
  wep_fire_glove:6, wep_iron_glove:6, wep_xuanming_palm:6,
  wep_m_dragon_fist:6,
  // 乐器 → 书卷(14)
  wep_divine_qin:14, wep_thunder_drum:14,
  wep_m_ling_xiao_qin:14,
  // 法器 → 书卷(14)
  wep_tao_charm:14,
  wep_m_chaos_bead:14,
  wep_wolf_fang:8,    // 狼牙棒→棍棒
};

// ── 护甲ID → body部件索引 ──
const NPC_ARMOR_BODY_MAP = {
  // 门派服装 → 各有特色
  cs_shaolin:3,      // 魁梧(3) 少林武僧
  cs_wudang:5,       // 弓腰(5) 太极内功
  cs_huashan:0,      // 侠客(0) 剑法轻灵
  cs_emei:10,        // 羽衣(10) 峨眉仙气
  cs_emei2:10,       // 峨眉金丝霓裳 → 羽衣
  cs_xiaoyao:10,     // 羽衣(10) 逍遥
  cs_riyue:8,        // 披风(8)  日月神教
  cs_mingjiao:7,     // 斗篷(7)  明教
  cs_wudu:4,         // 轻盈(4)  五毒轻巧
  cs_tangmen:7,      // 斗篷(7)  唐门暗器
  cs_taohuadao:10,   // 羽衣(10) 桃花岛
  cs_kongtong:9,     // 锁甲(9)  崆峒重甲
  cs_kongtong2:9,    // 崆峒玄铁战甲 → 锁甲
  cs_kunlun:8,       // 披风(8)  昆仑
  cs_tiandibang:7,   // 斗篷(7)  天地帮
  cs_tiandibang2:9,  // 天地帮精锐甲 → 锁甲
  cs_guigu:5,        // 弓腰(5)  鬼谷内功
  cs_shengguang:11,  // 仙气(11) 圣光
  cs_tianshan:10,    // 羽衣(10) 天山
  cs_tianshan2:9,    // 天山雪莲战袍 → 锁甲(战袍版)
  // 其他门派/势力
  cs_diancang:0,     // 点苍剑客袍 → 侠客(0)
  cs_diancang2:8,    // 点苍剑仙袍 → 披风(8)
  cs_lingxiao:8,     // 凌霄阁飞羽衣 → 披风
  cs_lingxiao2:8,    // 凌霄阁御风袍 → 披风
  cs_qingcheng:5,    // 青城道袍 → 弓腰(道士)
  cs_qingcheng2:4,   // 青城毒道袍 → 轻盈(毒系)
  cs_haisha:7,       // 海沙帮 → 斗篷
  cs_haisha2:9,      // 海沙精锐 → 锁甲
  cs_nangong:8,      // 南宫世家礼袍 → 披风
  cs_nangong2:9,     // 南宫世家战袍 → 锁甲
  cs_xuanming:9,     // 玄冥双煞袍 → 锁甲(重甲系)
  cs_xuegu:7,        // 血骨血衣 → 斗篷
  cs_xuegu2:9,       // 血骨煞气战甲 → 锁甲
  cs_bingpo:9,       // 冰魄玄冰战甲 → 锁甲
  cs_tianlong:12,    // 天龙龙袍 → 巨汉(12) 威严
  cs_tianzhan:12,    // 天战神铠 → 巨汉(重甲神将)
  cs_jiulong:12,     // 九龙至尊袍 → 巨汉(至尊)
  cs_fenghuang:10,   // 凤凰涅槃羽衣 → 羽衣
  cs_xuanhuang:7,    // 玄黄混沌袍 → 斗篷
  cs_xixia:8,        // 西夏密宗袍 → 披风
  // 传说级
  cs_lg_shaolin:3, cs_lg_wudang:5, cs_lg_riyue:8,
  cs_lg_xiaoyao:10, cs_lg_xuanming:9, cs_lg_tianzhan:9,
  cs_lg_taohua:10, cs_lg_xuegu:7, cs_lg_shengguang:11, cs_lg_kongtong:9,
  // 史诗级
  cs_ep_shadow:4, cs_ep_iron:9, cs_ep_wind:8,
  cs_ep_fire:7, cs_ep_buddha:3, cs_ep_poison:4,
  cs_ep_qimen:5, cs_ep_sword:0,
  // 通用
  cs_cloth:0,        // 侠客
  cs_soldier:9,      // 锁甲
  cs_general:12,     // 巨汉(12)
  cs_ranger:8,       // 披风
  cs_assassin:4,     // 轻盈
  cs_taoist_grey:5,  // 弓腰
  cs_monk_robe:3,    // 魁梧
  cs_beggar:13,      // 流浪(13)
  cs_fairy:11,       // 仙气
  cs_iron_vest:9,    // 锁甲
  // 通用平民/江湖
  cs_wulin:0,        // 武林布衣 → 侠客
  cs_xia:0,          // 江湖侠客袍 → 侠客
  cs_swordsman:0,    // 剑客青袍 → 侠客
  cs_youxia:4,       // 游侠轻甲 → 轻盈
  cs_hunter:9,       // 猎人皮甲 → 锁甲
  cs_fisherman:5,    // 渔夫蓑衣 → 弓腰
  cs_merchant:8,     // 富商锦袍 → 披风
  cs_scholar:5,      // 书生青衫 → 弓腰
  cs_hemp:5,         // 麻布练功服 → 弓腰
  cs_straw:5,        // 蓑草斗笠装 → 弓腰
  cs_strip:13,       // 江湖褴褛衫 → 流浪
  cs_torn_robe:5,    // 破旧道袍 → 弓腰
  cs_wulin:0,        // 武林布衣 → 侠客
};

// ── 护甲ID → aura部件索引 ──
const NPC_ARMOR_AURA_MAP = {
  cs_shaolin:2,      // 南无佛(2)
  cs_wudang:3,       // 道法自然(3)
  cs_huashan:5,      // 剑气纵横(5)
  cs_emei:0,         // 无(0)
  cs_emei2:0,        // 峨眉金丝霓裳
  cs_xiaoyao:0,
  cs_riyue:4,        // 杀气腾腾(4)
  cs_mingjiao:7,     // 烈焰(7)
  cs_wudu:6,         // 万毒(6)
  cs_tangmen:4,      // 杀气
  cs_taohuadao:0,
  cs_kongtong:4,     // 杀气腾腾
  cs_kongtong2:4,    // 崆峒玄铁战甲
  cs_kunlun:9,       // 冰封(9)
  cs_shengguang:10,  // 仙云(10)
  cs_tianshan:9,     // 冰封
  cs_tianshan2:9,    // 天山雪莲战袍
  cs_tiandibang:4,   // 杀气
  cs_tiandibang2:4,  // 天地帮精锐甲
  cs_diancang:5,     // 点苍剑客袍 → 剑气
  cs_diancang2:5,    // 点苍剑仙袍 → 剑气
  cs_lingxiao:0,     // 凌霄阁飞羽衣
  cs_lingxiao2:0,    // 凌霄阁御风袍
  cs_qingcheng:3,    // 青城道袍 → 道法自然
  cs_qingcheng2:6,   // 青城毒道袍 → 万毒
  cs_haisha:4,       // 海沙帮 → 杀气
  cs_haisha2:4,      // 海沙精锐 → 杀气
  cs_nangong:0,      // 南宫世家
  cs_nangong2:4,     // 南宫世家战袍 → 杀气
  cs_xuanming:11,    // 玄冥双煞袍 → 血腥(11)
  cs_xuegu:11,       // 血骨血衣 → 血腥
  cs_xuegu2:11,      // 血骨煞气战甲 → 血腥
  cs_bingpo:9,       // 冰魄玄冰战甲 → 冰封
  cs_tianlong:8,     // 天龙龙袍 → 雷霆(8)
  cs_tianzhan:8,     // 天战神铠 → 雷霆
  cs_jiulong:10,     // 九龙至尊袍 → 仙云/至尊
  cs_fenghuang:10,   // 凤凰涅槃羽衣 → 仙云
  cs_xuanhuang:14,   // 玄黄混沌袍 → 符文(14)
  cs_xixia:2,        // 西夏密宗袍 → 南无佛(密宗)
  // 传说级
  cs_lg_xuanming:11, // 血腥(11)
  cs_lg_tianzhan:8,  // 雷霆(8)
  cs_lg_xuegu:11,    // 血腥
  cs_lg_riyue:4,     // 杀气
  cs_lg_shaolin:2,   // 南无佛
  cs_lg_wudang:3,    // 道法自然
  cs_lg_xiaoyao:0,
  cs_lg_taohua:0,
  cs_lg_shengguang:10,
  cs_lg_kongtong:4,
  // 史诗级
  cs_ep_fire:7,      // 烈焰
  cs_ep_poison:6,    // 万毒
  cs_ep_qimen:14,    // 符文
  cs_ep_shadow:4,    // 杀气
  cs_ep_iron:4,      // 杀气(铁甲)
  cs_ep_buddha:2,    // 南无佛
  cs_ep_wind:0,
  cs_ep_sword:5,     // 剑气
};

// ── role关键字 → head索引 ──
const NPC_ROLE_HEAD_MAP = [
  [/掌柜|店主|老板|东家|客栈/,    9],   // 笑脸(8)→帽+胡(5)
  [/郎中|大夫|医者|神医/,         8],   // 笑脸
  [/铁匠|铸剑|工匠/,              10],  // 傲娇(10)
  [/将军|将领|校尉|总兵/,         11],  // 王者盔(11)
  [/刺客|杀手|暗门|影卫/,         7],   // 鬼脸(7)
  [/道士|道长|真人|天师/,         4],   // 道士头(4)
  [/和尚|僧|禅师|方丈|住持/,      3],   // 武僧(3)
  [/尼姑|女侠|姑娘|小姐|夫人|仙子|圣女/, 8], // 笑脸/秀气
  [/长老|老人|老叟|前辈|太上/,    5],   // 帽+胡(5)
  [/书生|文士|先生|秀才|才子/,    8],   // 笑脸
  [/掌门|宗主|教主|帮主|盟主/,    11],  // 王者盔
  [/大侠|英雄|豪杰/,              9],   // 凶相(9)→实为10傲娇更帅
  [/魔|鬼|煞|阎|冥/,              6],   // 骷髅(6)
  [/丐|乞丐/,                     5],   // 帽+胡
];

// ── role关键字 → legs索引 ──
const NPC_ROLE_LEGS_MAP = [
  [/掌门|宗主|教主|帮主|盟主/,  0],   // 马步(0) 稳重
  [/刺客|暗门|影卫|杀手/,       6],   // 飞奔(6) 快
  [/道士|道长|真人/,            3],   // 盘腿(3) 打坐
  [/和尚|僧|禅师/,              3],   // 盘腿
  [/游侠|侠客|大侠/,            4],   // 弓步(4)
  [/仙|神/,                     9],   // 踏云(9)
  [/将军|将领|校尉/,            0],   // 马步
  [/文士|书生|先生|郎中/,       1],   // 丁字步(1)
];

// ── 门派专属意境格言（显示在字符画 ft-aura 位置）──
const SECT_MOTTO_MAP = {
  shaolin:    '卍 菩提本无树 卍',
  wudang:     '☯ 道法自然 ☯',
  huashan:    '⚔ 剑走偏锋 ⚔',
  emei:       '✿ 慈悲为怀 ✿',
  kongtong:   '☰ 刚柔并济 ☰',
  kunlun:     '❄ 冰心玉壶 ❄',
  riyue:      '☀ 日月同辉 ☀',
  mingjiao:   '✡ 圣火永明 ✡',
  xiaoyao:    '∞ 无拘无束 ∞',
  wudu:       '☠ 以毒攻毒 ☠',
  tangmen:    '✦ 机关算尽 ✦',
  taohuadao:  '❀ 落英缤纷 ❀',
  tiandibang: '⚡ 替天行道 ⚡',
  guigu:      '☽ 纵横捭阖 ☽',
  shengguang: '✝ 荣耀归主 ✝',
  diancang:   '⊕ 苍山如海 ⊕',
  tianshan:   '❆ 天山雪莲 ❆',
  xixia:      '◈ 铁骑纵横 ◈',
  tianlong:   '龙 降龙十八 龙',
  nangong:    '◆ 南宫世家 ◆',
  xuanming:   '⊗ 玄冥两老 ⊗',
  haisha:     '⚓ 四海为家 ⚓',
  xuegu:      '☢ 血祭苍天 ☢',
  lingxiao:   '◉ 凌霄御风 ◉',
};

function buildNpcPartsHtml(npc, col){
  if(typeof ED_PARTS === 'undefined') return '';

  // ── 1. 颜色：优先传入，其次cosStyle，最后默认 ──
  const cosStyle = getNpcCosStyle(npc.armor);
  const color = col || cosStyle.color || '#aaaaaa';

  // ── 2. aura：有门派→意境格言；有职业→职业名；否则→护甲符文 ──
  let auraStr = '';
  if(npc.sect && SECT_MOTTO_MAP[npc.sect]){
    auraStr = SECT_MOTTO_MAP[npc.sect];
  } else if(npc.role){
    auraStr = npc.role;
  } else {
    const auraIdx = NPC_ARMOR_AURA_MAP[npc.armor] ?? 0;
    auraStr = ED_PARTS.aura[auraIdx]?.v || '';
  }

  // ── 3. head：先按role推断，找不到默认圆头(0) ──
  let headIdx = 0;
  if(npc.role){
    for(const [pat, idx] of NPC_ROLE_HEAD_MAP){
      if(pat.test(npc.role)){ headIdx = idx; break; }
    }
  }
  // 特殊覆盖：tier=elite → 凶相/王者盔更霸气
  if(npc.tier === 'elite'){
    headIdx = /掌门|宗主|教主|帮主|盟主|将军/.test(npc.role||'') ? 11 : 10;
  }
  const headStr = ED_PARTS.head[headIdx]?.v || ED_PARTS.head[0].v;

  // ── 4. body：按护甲ID映射 ──
  const bodyIdx = NPC_ARMOR_BODY_MAP[npc.armor] ?? 0;
  const bodyData = ED_PARTS.body[bodyIdx] || ED_PARTS.body[0];
  const bodyStr = bodyData.v;

  // ── 5. arms：按武器ID映射 ──
  const armsIdx = NPC_WEP_ARMS_MAP[npc.weapon] ?? 0;
  const armsData = ED_PARTS.arms[armsIdx] || ED_PARTS.arms[0];
  const armL = armsData.lv || '/';
  const armR = armsData.rv || '\\';

  // ── 6. legs：按role映射 ──
  let legsIdx = 0;
  if(npc.role){
    for(const [pat, idx] of NPC_ROLE_LEGS_MAP){
      if(pat.test(npc.role)){ legsIdx = idx; break; }
    }
  }
  const legsStr = ED_PARTS.legs[legsIdx]?.v || ED_PARTS.legs[0].v;

  // ── 7. 拼装 ft-animated HTML ──
  const auraHtml = auraStr
    ? `<div class="ft-aura" style="color:${color}">${auraStr}</div>` : '';
  return auraHtml
    + `<div class="ft-head" style="color:${color}">${headStr}</div>`
    + `<div class="ft-torso-row">`
    +   `<div class="ft-arm-l" style="color:${color}">${armL}</div>`
    +   `<div class="ft-body-wrap"><div class="ft-body" style="color:${color}">${bodyStr}</div></div>`
    +   `<div class="ft-arm-r" style="color:${color}">${armR}</div>`
    + `</div>`
    + `<div class="ft-legs" style="color:${color}">${legsStr}</div>`;
}

// ══════════════════════════════════════════════════════════════════
//  getNpcAlignAura — 根据NPC阵营/门派返回头顶气场装饰数据
//  返回 { text, color, glowColor, cls, sectName, label }
//  text: 气场符文行（ASCII装饰）
//  color: 主色
//  glowColor: 发光色（rgba）
//  cls: CSS动画类名
//  sectName: 门派名（可空）
//  label: 阵营标签文字
// ══════════════════════════════════════════════════════════════════

// 门派 → 专属气场符文（优先使用，彰显门派特色）
const SECT_AURA_SYMBOL = {
  shaolin:    { sym:'卍', label:'少林', color:'#ffd080', glow:'rgba(255,200,80,.6)'  },
  wudang:     { sym:'☯', label:'武当', color:'#80d8ff', glow:'rgba(80,200,255,.6)'  },
  huashan:    { sym:'⚔', label:'华山', color:'#c8ffb0', glow:'rgba(160,255,80,.5)'  },
  emei:       { sym:'✿', label:'峨眉', color:'#ffb0d8', glow:'rgba(255,120,180,.5)' },
  kongtong:   { sym:'☰', label:'崆峒', color:'#d0c8ff', glow:'rgba(160,140,255,.5)' },
  kunlun:     { sym:'❄', label:'昆仑', color:'#b0eeff', glow:'rgba(100,220,255,.6)' },
  riyue:      { sym:'☀', label:'日月', color:'#ff8040', glow:'rgba(255,100,40,.6)'  },
  mingjiao:   { sym:'✡', label:'明教', color:'#ff6020', glow:'rgba(255,80,20,.6)'   },
  xiaoyao:    { sym:'∞', label:'逍遥', color:'#b0ffee', glow:'rgba(80,255,200,.5)'  },
  wudu:       { sym:'☠', label:'五毒', color:'#a0ff60', glow:'rgba(120,220,40,.6)'  },
  tangmen:    { sym:'✦', label:'唐门', color:'#ff9040', glow:'rgba(240,120,40,.5)'  },
  taohuadao:  { sym:'❀', label:'桃花', color:'#ffb0c8', glow:'rgba(255,140,180,.5)' },
  tiandibang: { sym:'⚡', label:'天地', color:'#ffe060', glow:'rgba(255,200,60,.6)'  },
  guigu:      { sym:'☽', label:'鬼谷', color:'#c080ff', glow:'rgba(180,80,255,.5)'  },
  shengguang: { sym:'✝', label:'圣光', color:'#ffffc0', glow:'rgba(255,255,160,.6)' },
  diancang:   { sym:'⊕', label:'点苍', color:'#80b0ff', glow:'rgba(80,140,255,.5)'  },
  tianshan:   { sym:'❆', label:'天山', color:'#d0f0ff', glow:'rgba(160,230,255,.6)' },
  xixia:      { sym:'◈', label:'西夏', color:'#e0b060', glow:'rgba(220,160,60,.5)'  },
  tianlong:   { sym:'龙', label:'天龙', color:'#ff9060', glow:'rgba(255,120,60,.6)'  },
  nangong:    { sym:'◆', label:'南宫', color:'#ffd0a0', glow:'rgba(255,180,100,.5)' },
  xuanming:   { sym:'⊗', label:'玄冥', color:'#60d0c0', glow:'rgba(60,200,180,.6)'  },
  haisha:     { sym:'⚓', label:'海沙', color:'#60b8ff', glow:'rgba(60,160,255,.5)'  },
  xuegu:      { sym:'☢', label:'血骨', color:'#ff4040', glow:'rgba(255,40,40,.7)'   },
  lingxiao:   { sym:'◉', label:'凌霄', color:'#c8c8c8', glow:'rgba(200,200,200,.4)' },
};

// 阵营通用气场（无门派时fallback）
const ALIGN_AURA_MAP = {
  righteous: {
    sym: '✦',
    color: '#ffe080', glow: 'rgba(255,210,80,.65)',
    cls: 'aura-righteous', label: '正道'
  },
  evil: {
    sym: '⚡',
    color: '#ff5050', glow: 'rgba(255,60,60,.7)',
    cls: 'aura-evil', label: '邪道'
  },
  chaotic: {
    sym: '☽',
    color: '#c060ff', glow: 'rgba(180,60,255,.6)',
    cls: 'aura-chaotic', label: '混乱'
  },
  neutral: {
    sym: '◈',
    color: '#90c8d8', glow: 'rgba(120,190,210,.6)',
    cls: 'aura-neutral', label: '中立'
  },
};

// ── 职业role关键词 → 阵营（无门派NPC的fallback推断）──
const NPC_ROLE_ALIGN_MAP = [
  [/侠|义士|大侠|女侠|游侠|护镖|镖师|捕快|官差|典史|县令|知府|将军|提督|御史|侍卫|锦衣|皇|官员|太守/, 'righteous'],
  [/盗|匪|贼|杀手|刺客|邪|魔|煞|魁首|教主|血|骷髅|恶/, 'evil'],
  [/赌|黑市|走私|马贩|混混|流氓|山贼|江洋|喽啰/, 'chaotic'],
];

function getNpcAlignAura(npc){
  if(!npc) return null;

  // 1. 推断门派
  const sectId = npc.sect || inferNpcSect(npc);

  // 2. 推断阵营
  let alignment = 'neutral';
  if(sectId){
    // 直接查 SECTS（data-sects.js 早于本文件加载，无时序问题）
    if(typeof SECTS !== 'undefined'){
      const s = SECTS.find(x => x.id === sectId);
      if(s && s.alignment) alignment = s.alignment;
    }
    // 运行时再尝试 getSectAlignment（jianghu.js 加载后即可用）
    if(alignment === 'neutral' && typeof getSectAlignment === 'function'){
      alignment = getSectAlignment(sectId);
    }
  } else {
    // 无门派：按职业关键词推断阵营
    const roleText = (npc.role || '') + ' ' + (npc.id || '');
    for(const [pat, align] of NPC_ROLE_ALIGN_MAP){
      if(pat.test(roleText)){ alignment = align; break; }
    }
  }


  // 3. 门派专属气场
  const sectAura = sectId ? SECT_AURA_SYMBOL[sectId] : null;
  const alignAura = ALIGN_AURA_MAP[alignment] || ALIGN_AURA_MAP.neutral;

  // 4. 门派名
  let sectName = '';
  if(sectId){
    if(typeof SECTS !== 'undefined'){
      const s = SECTS.find(x => x.id === sectId);
      sectName = s ? s.name : '';
    }
    if(!sectName && sectAura) sectName = sectAura.label;
  }

  if(sectAura){
    return {
      sym:       sectAura.sym,
      color:     sectAura.color,
      glowColor: sectAura.glow,
      cls:       alignAura.cls,
      sectName:  sectName,
      label:     alignAura.label,
      alignment: alignment,
    };
  } else {
    return {
      sym:       alignAura.sym,
      color:     alignAura.color,
      glowColor: alignAura.glow,
      cls:       alignAura.cls,
      sectName:  '',
      label:     alignAura.label,
      alignment: alignment,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  ENEMY_PORTRAITS — 敌人专用角色模板（用于生成多状态战斗动画）
//  基于 NPC_PORTRAITS 扩展，支持动态生成 stand/attack/heavy/hit/down
// ══════════════════════════════════════════════════════════════════
const ENEMY_PORTRAITS = {

  // ── 山贼/强盗 ──────────────────────────────
  bandit: (w, c) => ({
    stand:
`  ╭(◕_◕)╮
${c.aura}${c.body}${c.aura}${w}
 ╰──┬──╯
  ～─┿─～`,
    attack: [
`  ╭(◕_◕)╮  砍!
${c.aura}${c.body}${c.aura}${w}
 ╰──┬──╯
  ～─┿─～`,
`  ╭(◕_◕)砍!${w}
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
  ～─┿─～`
    ],
    heavy:
`  ╭(╬_╬)╮
${c.aura}┏${c.body}┓${c.aura}
 ┃${w}┃
 ╰──┬──╯`,
    hit: [
`  ╭(>_<)╮
${c.aura}${c.body}${c.aura}${w}
 ╰──┬──╯
  ～─┿─～`,
`  ╭(<_>)╮
${c.aura}${c.body}${c.aura}${w}
 ╰──┬──╯
  ～─┿─～`
    ],
    down:
` (╭×_×╮)
  ${c.body}
 ═══════`
  }),

  // ── 弓箭手 ──────────────────────────────
  archer: (w, c) => ({
    stand:
`  ╭(^_^)╮
${c.aura}${c.body}${c.aura}
 )${w}(
 ╰──┬──╯`,
    attack: [
`  ╭(^_^)╮  射!
${c.aura}${c.body}${c.aura}
 )${w}(
 ╰──┬──╯`,
`  ╭(^_^)射!
${c.aura}${c.body}${c.aura}
 )${w}(
 ╰──┬──╯`
    ],
    heavy:
`  ╭(⊙_⊙)╮
${c.aura}┏${c.body}┓${c.aura}
︻${w}︻
 ╰──┬──╯`,
    hit: [
`  ╭(>_<)╮
${c.aura}${c.body}${c.aura}
 )${w}(
 ╰──┬──╯`,
`  ╭(<_>)╮
${c.aura}${c.body}${c.aura}
 )${w}(
 ╰──┬──╯`
    ],
    down:
` (╭×_×╮)
  ${c.body}
 ═══════`
  }),

  // ── 刺客/暗器 ──────────────────────────────
  assassin: (w, c) => ({
    stand:
` ▓(▮_▮)▓
${c.aura}${c.body}${c.aura}
░╰──┬──╯░
 ${w} ${w} ${w}`,
    attack: [
` ▓(▮_▮)▓  刺!
${c.aura}${c.body}${c.aura}
░╰──┬──╯░
 ${w} ${w} ${w}`,
` ▓(▮_▮)刺!
${c.aura}${c.body}${c.aura}
░╰──┬──╯░
 ${w} ${w} ${w}`
    ],
    heavy:
` ▓(▮益▮)▓
${c.aura}█${c.body}█${c.aura}
░╰──┬──╯░
${w}${w}${w}${w}${w}`,
    hit: [
` ▓(▮>▮)▓
${c.aura}${c.body}${c.aura}
░╰──┬──╯░
 ${w} ${w} ${w}`,
` ▓(▮<▮)▓
${c.aura}${c.body}${c.aura}
░╰──┬──╯░
 ${w} ${w} ${w}`
    ],
    down:
`(▓×_×▓)
 ${c.body}
═══════`
  }),

  // ── 猎户/胡人 ──────────────────────────────
  // 根据武器类型显示：枪矛类=持矛战士，其他=弓箭手
  hunter: (w, c) => {
    const isSpear = w === '矛' || w === '枪' || w === '戟';
    const leftHand = isSpear ? ' ' : '弓';
    const rightHand = isSpear ? w : w;
    const legPose = isSpear ? ` │ ${w} │ ` : ` ${leftHand}─${rightHand}`;
    return {
    stand:
`  ╭(⌐■_■)╮
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
${legPose}`,
    attack: isSpear ? [
`  ╭(⌐■_■)╮  刺!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
   ${w}  `,
`  ╭(⌐■_■)刺!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
   ${w}  `
    ] : [
`  ╭(⌐■_■)╮  射!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
 弓─${w}`,
`  ╭(⌐■_■)射!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
 弓─${w}`
    ],
    heavy:
`  ╭(⌐■益■)╮
${c.aura}┏━${c.body}━┓${c.aura}
 ╰──┬──╯
${isSpear ? ` ═${w}═` : ` 弓═${w}═弓`}`,
    hit: [
`  ╭(⌐■>■)╮
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
${legPose}`,
`  ╭(⌐■<■)╮
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
${legPose}`
    ],
    down:
` (╭×_×╮)
  ${c.body}
 ═══════`
  };},

  // ── 邪道/血骨门 ──────────────────────────────
  cultist: (w, c) => ({
    stand:
` ☀(ω_ω)☀
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
─${c.aura}─${w}─${c.aura}─`,
    attack: [
` ☀(ω_ω)☀  血!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
─${c.aura}─${w}─${c.aura}─`,
` ☀(ω_ω)血!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
─${c.aura}─${w}─${c.aura}─`
    ],
    heavy:
` ☀(ω益ω)☀
${c.aura}█${c.body}█${c.aura}
 ╰──┬──╯
☠${w}血${w}☠`,
    hit: [
` ☀(ω>ω)☀
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
─${c.aura}─${w}─${c.aura}─`,
` ☀(ω<ω)☀
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
─${c.aura}─${w}─${c.aura}─`
    ],
    down:
`(☀×_×☀)
 ${c.body}
═══════`
  }),

  // ── 武将/头目 ──────────────────────────────
  chief: (w, c) => ({
    stand:
` ◆╭(◉_◉)╮◆
${c.aura}${c.body}${c.aura}
 ╠═╦═╣
${c.aura}━━┿━━${c.aura}`,
    attack: [
` ◆╭(◉_◉)╮◆  杀!
${c.aura}${c.body}${c.aura}
 ╠═╦═╣
${c.aura}━━┿━━${c.aura}`,
` ◆╭(◉_◉)杀!◆
${c.aura}${c.body}${c.aura}
 ╠═╦═╣
${c.aura}━━┿━━${c.aura}`
    ],
    heavy:
` ◆╭(◉益◉)╮◆
${c.aura}█${c.body}█${c.aura}
 ╠═╬═╣
${c.aura}━━┿━━${c.aura}`,
    hit: [
` ◆╭(◉>◉)╮◆
${c.aura}${c.body}${c.aura}
 ╠═╦═╣
${c.aura}━━┿━━${c.aura}`,
` ◆╭(◉<◉)╮◆
${c.aura}${c.body}${c.aura}
 ╠═╦═╣
${c.aura}━━┿━━${c.aura}`
    ],
    down:
`(◆×_×◆)
 ${c.body}
═══════`
  }),

  // ── 通用/默认 ──────────────────────────────
  default: (w, c) => ({
    stand:
`  ╭(•_•)╮
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
 ─${w}─`,
    attack: [
`  ╭(•_•)╮  打!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
 ─${w}─`,
`  ╭(•_•)打!
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
 ─${w}─`
    ],
    heavy:
`  ╭(•益•)╮
${c.aura}┏${c.body}┓${c.aura}
 ╰──┬──╯
 ━${w}━`,
    hit: [
`  ╭(>_>)╮
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
 ─${w}─`,
`  ╭(<_<)╮
${c.aura}${c.body}${c.aura}
 ╰──┬──╯
 ─${w}─`
    ],
    down:
` (╭×_×╮)
  ${c.body}
 ═══════`
  }),
};

// ══════════════════════════════════════════════════════════════════
//  generateEnemyAvatar — 根据模板生成敌人多状态字符画
//  参数：
//    portrait: 模板ID ('bandit', 'archer', 'assassin', 'hunter', 'cultist', 'chief', 'default')
//    weapon:   武器ID (如 'wep_iron_sword', 'wep_uc_dao')
//    armor:    护甲ID (如 'cs_ranger', 'cs_assassin')
//  返回：{ stand, attack[], heavy, hit[], down }
// ══════════════════════════════════════════════════════════════════
function generateEnemyAvatar(portrait, weapon, armor) {
  const templateFn = ENEMY_PORTRAITS[portrait] || ENEMY_PORTRAITS.default;
  const wepSym = getNpcWepSym(weapon);
  const cosStyle = getNpcCosStyle(armor);
  return templateFn(wepSym, cosStyle);
}

// ══════════════════════════════════════════════════════════════════
//  buildEnemyFromTemplate — 从模板构建完整敌人数据
//  用于将旧格式敌人迁移到新格式
//  参数：
//    base: 基础敌人数据 { id, name, type, level, tier, hp, atk, ... }
//    template: { portrait, weapon, armor, icon? }
//  返回：完整的敌人数据对象（包含 stand/attack/heavy/hit/down/parts）
// ══════════════════════════════════════════════════════════════════
function buildEnemyFromTemplate(base, template) {
  const avatar = generateEnemyAvatar(template.portrait, template.weapon, template.armor);
  const cosStyle = getNpcCosStyle(template.armor);

  // 生成捏脸部件数据（供战斗场景使用）
  const parts = generateEnemyPartsFromTemplate(base, template);

  return {
    ...base,
    icon: template.icon || base.icon || '⚔',
    stand: avatar.stand,
    attack: avatar.attack,
    heavy: avatar.heavy,
    hit: avatar.hit,
    down: avatar.down,
    color: cosStyle.color,
    parts: parts,  // 捏脸部件，用于战斗场景
    // 保存模板信息供捏脸系统使用
    _templateWeapon: template.weapon,
    _templateArmor: template.armor,
    _templatePortrait: template.portrait,
  };
}

// ══════════════════════════════════════════════════════════════════
//  generateEnemyPartsFromTemplate — 根据模板生成敌人捏脸部件
// ══════════════════════════════════════════════════════════════════
function generateEnemyPartsFromTemplate(enemy, template) {
  // 基于敌人ID的哈希值，确保同一敌人总是生成相同外观
  const hash = enemy.id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  const rand = (mod) => Math.abs(hash) % mod;
  
  const type = enemy.type;
  const tier = enemy.tier;
  
  // 头部选择
  let headIdx = 0;
  if (type === 'boss') headIdx = 11 + rand(4);
  else if (type === 'evil') headIdx = 6 + rand(3);
  else if (type === 'assassin') headIdx = 9 + rand(2);
  else headIdx = rand(11);
  
  // 身体选择
  let bodyIdx = 0;
  if (tier === 'elite') bodyIdx = 9 + rand(4);
  else if (tier === 'major') bodyIdx = 4 + rand(5);
  else bodyIdx = rand(9);
  
  // 武器/手臂选择 - 根据模板武器
  let armsIdx = 0;
  const weaponMap = {
    'wep_uc_spear': 12,    // 长枪
    'wep_long_spear': 12,  // 长枪
    'wep_uc_dao': 2,       // 双刀
    'wep_iron_sword': 1,   // 长剑
    'wep_blood_saber': 1,  // 长剑
    'wep_uc_bow': 4,       // 弓箭
    'wep_poison_fan': 5,   // 折扇
  };
  if (weaponMap[template.weapon]) {
    armsIdx = weaponMap[template.weapon];
  } else {
    if (type === 'bandit') armsIdx = 2;
    else if (type === 'boss') armsIdx = 1;
    else armsIdx = rand(10);
  }
  
  // 腿部选择
  let legsIdx = rand(12);
  
  // 气场选择
  const auraMap = {
    boss: [1, 5, 8, 13],
    evil: [4, 6, 11, 15],
    assassin: [4, 11, 14],
    ghost: [6, 9, 15],
    bandit: [4, 7, 12],
    beast: [4, 7, 8, 11],
  };
  const auraPool = auraMap[type] || [0];
  const auraIdx = auraPool[rand(auraPool.length)];
  
  // 获取ED_PARTS长度（假设全局可用）
  const headLen = (typeof ED_PARTS !== 'undefined' && ED_PARTS.head) ? ED_PARTS.head.length : 16;
  const bodyLen = (typeof ED_PARTS !== 'undefined' && ED_PARTS.body) ? ED_PARTS.body.length : 14;
  const armsLen = (typeof ED_PARTS !== 'undefined' && ED_PARTS.arms) ? ED_PARTS.arms.length : 16;
  const legsLen = (typeof ED_PARTS !== 'undefined' && ED_PARTS.legs) ? ED_PARTS.legs.length : 13;
  const auraLen = (typeof ED_PARTS !== 'undefined' && ED_PARTS.aura) ? ED_PARTS.aura.length : 16;
  
  return {
    head: headIdx % headLen,
    body: bodyIdx % bodyLen,
    arms: armsIdx % armsLen,
    legs: legsIdx % legsLen,
    aura: auraIdx % auraLen,
  };
}
