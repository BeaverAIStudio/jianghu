// ═══════════════════════════════════════════════════════════════
//  achievements.js  —  成就/长期目标 系统
//  版本: 1.0
//  依赖：无外部依赖（纯数据+检测API）
// ═══════════════════════════════════════════════════════════════

// ── 存储键名 ──
const ACH_KEY = 'wuxia_achievements';

// ── 状态对象 ──
let achState = {
  unlocked: [],       // 已解锁的成就ID列表 ['ach_xxx', ...]
  progress: {},       // 计数型进度 { 'ach_xxx': 23, ... }
  lastNotifyTime: 0,  // 上次通知时间戳（防弹窗堆叠）
  notified: {},        // 是否已弹过通知 { 'ach_xxx': true }
  totalScore: 0,      // 成就总分
  stats: {
    battles: 0, wins: 0, losses: 0,
    dungeons: 0, dungeonRooms: 0,
    quests: 0, crafts: 0, fishes: 0,
    cricketWins: 0, travels: 0,
    silverEarned: 0, silverSpent: 0,
    giftsGiven: 0,
    // 新增统计字段
    petsCaught: 0, petBattles: 0, petFeeds: 0,
    apprentices: 0, teachings: 0,
    swornBrothers: 0, swornDrinks: 0, swornBattles: 0,
    champWins: 0, champParticipations: 0,
    conquestsCompleted: 0,
    bulletinsRead: 0, eventsParticipated: 0,
  }
};

// ── 持久化 ──
function achSave(){
  try{ localStorage.setItem(ACH_KEY, JSON.stringify(achState)); }catch(e){}
}
function achLoad(){
  try{
    const raw = localStorage.getItem(ACH_KEY);
    if(raw){
      const d = JSON.parse(raw);
      achState = Object.assign(achState, d);
      if(!achState.unlocked) achState.unlocked = [];
      if(!achState.progress) achState.progress = {};
      if(!achState.notified) achState.notified = {};
      if(!achState.stats) achState.stats = {};
      // 兼容旧存档：补齐 stats 子字段
      const s = achState.stats;
      s.battles = s.battles||0; s.wins = s.wins||0; s.losses = s.losses||0;
      s.dungeons = s.dungeons||0; s.dungeonRooms = s.dungeonRooms||0;
      s.quests = s.quests||0; s.crafts = s.crafts||0;
      s.fishes = s.fishes||0; s.cricketWins = s.cricketWins||0;
      s.travels = s.travels||0; s.silverEarned = s.silverEarned||0;
      s.silverSpent = s.silverSpent||0; s.giftsGiven = s.giftsGiven||0;
      // 新增字段兼容
      s.petsCaught = s.petsCaught||0; s.petBattles = s.petBattles||0; s.petFeeds = s.petFeeds||0;
      s.apprentices = s.apprentices||0; s.teachings = s.teachings||0;
      s.swornBrothers = s.swornBrothers||0; s.swornDrinks = s.swornDrinks||0; s.swornBattles = s.swornBattles||0;
      s.champWins = s.champWins||0; s.champParticipations = s.champParticipations||0;
      s.conquestsCompleted = s.conquestsCompleted||0;
      s.bulletinsRead = s.bulletinsRead||0; s.eventsParticipated = s.eventsParticipated||0;
    } else {
      // 新游戏/无存档：所有成就默认锁定
      achState.unlocked = [];
    }
  }catch(e){}
}

// ════════════════════════════════════════════════════════════════
//  一、成就数据库
//  字段说明：
//    id           唯一标识（ach_ 前缀）
//    name         名称
//    desc         描述文案
//    icon         图标emoji
//    category     分类：battle/dungeon/quest/npc/minigame/craft/collection/special
//    rarity       稀有度：common/rare/epic/legendary/mythic
//    points       分值：common=5, rare=10, epic=20, legendary=40, mythic=80
//    hidden       是否隐藏描述（解锁前显示 ???）
//    type         检测类型：event/count/threshold
//              event=一次性事件, count=累计N次, threshold=数值达到N
//    target       目标值（count/threshold 类型需要）
//    condition    额外条件函数（可选，返回bool）
//    reward       奖励文本
// ════════════════════════════════════════════════════════════════

const ACHIEVEMENT_DB = {

  // ══════════════════════════════════════
  // ⚔️ 战斗类（14个）
  // ════════════════════════════════════════

  ach_first_win: {
    id:'ach_first_win', name:'初出茅庐', desc:'赢得第一场战斗',
    icon:'⚔️', category:'battle', rarity:'common', points:5,
    type:'event', reward:'声望+5'
  },
  ach_win_10: {
    id:'ach_win_10', name:'小试牛刀', desc:'累计赢得10场战斗',
    icon:'🗡️', category:'battle', rarity:'common', points:5,
    type:'count', target:10, reward:'银两×50'
  },
  ach_win_50: {
    id:'ach_win_50', name:'锋芒初露', desc:'累计赢得50场战斗',
    icon:'⚡', category:'battle', rarity:'rare', points:10,
    type:'count', target:50, reward:'银两×200'
  },
  ach_win_100: {
    id:'ach_win_100', name:'百战之师', desc:'累计赢得100场战斗',
    icon:'🔥', category:'battle', rarity:'epic', points:20,
    type:'count', target:100, reward:'稀有装备×1'
  },
  ach_win_500: {
    id:'ach_win_500', name:'千人斩', desc:'累计赢得500场战斗',
    icon:'💀', category:'battle', rarity:'legendary', points:40,
    type:'count', target:500, reward:'传说装备×1 + 声望+100'
  },
  ach_no_damage_win: {
    id:'ach_no_damage_win', name:'毫发无伤', desc:'在满血状态下赢得一场战斗',
    icon:'✨', category:'battle', rarity:'rare', points:10,
    type:'event', reward:'内力上限+10'
  },
  ach_first_loss: {
    id:'ach_first_loss', name:'江湖险恶', desc:'第一次战败（胜败乃兵家常事）',
    icon:'💔', category:'battle', rarity:'common', points:5,
    type:'event', reward:'经验+20'
  },
  ach_loss_10: {
    id:'ach_loss_10', name:'越挫越勇', desc:'累计战败10次',
    icon:'🔻', category:'battle', rarity:'common', points:5,
    type:'count', target:10, reward:'银两×30'
  },
  ach_battle_100: {
    id:'ach_battle_100', name:'身经百战', desc:'参与100场战斗（不论胜负）',
    icon:'🎖️', category:'battle', rarity:'rare', points:10,
    type:'count', target:100, reward:'声望+15'
  },
  ach_kill_elite: {
    id:'ach_kill_elite', name:'精英猎手', desc:'击败一名 elite 级敌人',
    icon:'👹', category:'battle', rarity:'rare', points:10,
    type:'event', reward:'银两×100'
  },
  ach_kill_boss: {
    id:'ach_kill_boss', name:'弑君者', desc:'击败一名 BOSS 级敌人',
    icon:'👑', category:'battle', rarity:'epic', points:20,
    type:'event', reward:'声望+30'
  },
  ach_combo_3: {
    id:'ach_combo_3', name:'连招新手', desc:'在一战中打出3连击（疾风三连）',
    icon:'💨', category:'battle', rarity:'common', points:5,
    type:'event', reward:'经验+15'
  },
  ach_momentum_max: {
    id:'ach_momentum_max', name:'气势如虹', desc:'气势值达到100（蓄满）',
    icon:'🌟', category:'battle', rarity:'rare', points:10,
    type:'event', reward:'下次攻击伤害+10%'
  },
  ach_win_streak_5: {
    id:'ach_win_streak_5', name:'势如破竹', desc:'连续赢得5场战斗',
    icon:'📈', category:'battle', rarity:'epic', points:20,
    type:'count', target:5, reward:'银两×300'
  },

  // ══════════════════════════════════════
  // 🏰 地下城类（8个）
  // ══════════════════════════════════════

  ach_first_dungeon: {
    id:'ach_first_dungeon', name:'探墓新人', desc:'完成第一座地下城探索',
    icon:'🏰', category:'dungeon', rarity:'common', points:5,
    type:'event', reward:'经验+30'
  },
  ach_dungeon_5: {
    id:'ach_dungeon_5', name:'地宫行者', desc:'通关5座地下城',
    icon:'🗝️', category:'dungeon', rarity:'rare', points:10,
    type:'count', target:5, reward:'银两×150'
  },
  ach_dungeon_15: {
    id:'ach_dungeon_15', name:'地穴老手', desc:'通关15座地下城',
    icon:'🕳️', category:'dungeon', rarity:'epic', points:20,
    type:'count', target:15, reward:'声望+50'
  },
  ach_dungeon_30: {
    id:'ach_dungeon_30', name:'地底之王', desc:'通关30座地下城',
    icon:'👑', category:'dungeon', rarity:'legendary', points:40,
    type:'count', target:30, reward:'传说装备×1'
  },
  ach_room_50: {
    id:'ach_room_50', name:'扫荡四方', desc:'累计清理50个地下城房间',
    icon:'🧹', category:'dungeon', rarity:'common', points:5,
    type:'count', target:50, reward:'经验+50'
  },
  ach_room_200: {
    id:'ach_room_200', name:'清道夫', desc:'累计清理200个地下城房间',
    icon:'🧹', category:'dungeon', rarity:'rare', points:10,
    type:'count', target:200, reward:'银两×100'
  },
  ach_no_death_dungeon: {
    id:'ach_no_death_dungeon', name:'完美探险', desc:'在不损失任何生机的情况下通关一座地下城',
    icon:'💎', category:'dungeon', rarity:'epic', points:20,
    type:'event', reward:'声望+40'
  },
  ach_all_t1_dungeons: {
    id:'ach_all_t1_dungeons', name:'踏遍初土', desc:'通关所有推荐等级≤10的地下城',
    icon:'🗺️', category:'dungeon', rarity:'legendary', points:40,
    type:'special', hidden:true, reward:'称号「探墓者」'
  },

  // ══════════════════════════════════════
  // 📜 任务类（6个）
  // ══════════════════════════════════════

  ach_first_quest: {
    id:'ach_first_quest', name:'初受托付', desc:'完成第一个任务',
    icon:'📜', category:'quest', rarity:'common', points:5,
    type:'event', reward:'经验+15'
  },
  ach_quest_10: {
    id:'ach_quest_10', name:'信守承诺', desc:'完成10个任务',
    icon:'📋', category:'quest', rarity:'common', points:5,
    type:'count', target:10, reward:'银两×80'
  },
  ach_quest_50: {
    id:'ach_quest_50', name:'义薄云天', desc:'完成50个任务',
    icon:'📕', category:'quest', rarity:'rare', points:10,
    type:'count', target:50, reward:'声望+30'
  },
  ach_daily_7: {
    id:'ach_daily_7', name:'日理万机', desc:'连续7天完成至少1个日常任务',
    icon:'📅', category:'quest', rarity:'rare', points:10,
    type:'special', hidden:false, reward:'银两×200'
  },
  ach_quest_chain: {
    id:'ach_quest_chain', name:'连环破局', desc:'完成一个完整的连环任务链（≥3环）',
    icon:'🔗', category:'quest', rarity:'epic', points:20,
    type:'event', reward:'声望+40'
  },

  // ══════════════════════════════════════
  // 👥 NPC/关系类（8个）
  // ══════════════════════════════════════

  ach_meet_jianghu: {
    id:'ach_meet_jianghu', name:'初入江湖', desc:'结识第一位具名NPC',
    icon:'🤝', category:'npc', rarity:'common', points:5,
    type:'event', reward:'声望+5'
  },
  ach_meet_10jh: {
    id:'ach_meet_10jh', name:'名动一方', desc:'结识10位不同的具名NPC',
    icon:'🌐', category:'npc', rarity:'rare', points:10,
    type:'count', target:10, reward:'声望+20'
  },
  ach_rel_60_one: {
    id:'ach_rel_60_one', name:'莫逆之交', desc:'与任一具名NPC关系达到60（友善）',
    icon:'🤗', category:'npc', rarity:'rare', points:10,
    type:'event', reward:'该NPC好感+10'
  },
  ach_rel_80_one: {
    id:'ach_rel_80_one', name:'肝胆相照', desc:'与任一具名NPC关系达到80（挚友）',
    icon:'❤️', category:'npc', rarity:'epic', points:20,
    type:'event', reward:'声望+30 + 称号加成'
  },
  ach_gift_10: {
    id:'ach_gift_10', name:'慷慨解囊', desc:'累计送出10份礼物给NPC',
    icon:'🎁', category:'npc', rarity:'common', points:5,
    type:'count', target:10, reward:'声望+10'
  },
  ach_gift_50: {
    id:'ach_gift_50', name:'仗义疏财', desc:'累计送出50份礼物给NPC',
    icon:'💝', category:'npc', rarity:'rare', points:10,
    type:'count', target:50, reward:'银两×150'
  },
  ach_swear_brother: {
    id:'ach_swear_brother', name:'八拜之交', desc:'与任一NPC结为义兄弟/义姐妹',
    icon:'🩸', category:'npc', rarity:'epic', points:20,
    type:'event', reward:'声望+50'
  },
  ach_take_apprentice: {
    id:'ach_take_apprentice', name:'开山立派', desc:'收第一名弟子',
    icon:'📚', category:'npc', rarity:'legendary', points:40,
    type:'event', reward:'声望+60'
  },

  // ── 情缘类 ──
  ach_rom_first_love: {
    id:'ach_rom_first_love', name:'怦然心动', desc:'与NPC成功告白，缔结第一段情缘',
    icon:'💕', category:'npc', rarity:'epic', points:30,
    type:'event', reward:'声望+80'
  },
  ach_rom_lover: {
    id:'ach_rom_lover', name:'情深意浓', desc:'情缘从倾心升级为伴侣',
    icon:'❤️', category:'npc', rarity:'legendary', points:50,
    type:'event', reward:'声望+100'
  },
  ach_rom_soulmate: {
    id:'ach_rom_soulmate', name:'白首不离', desc:'情缘达到最高阶段——白首',
    icon:'💍', category:'npc', rarity:'mythic', points:100,
    type:'event', reward:'声望+200 + 全属性+2'
  },
  ach_rom_lore_yuesha: {
    id:'ach_rom_lore_yuesha', name:'冰魄暖心', desc:'与冷月纱缔结情缘',
    icon:'❄️💕', category:'special', rarity:'legendary', points:60,
    type:'event', hidden:true,
    reward:'解锁「冷月纱的独白」文献 + 声望+80',
    lore: {
      title:'冷月纱的独白',
      text:`
  【私人手记 · 火漆封口 · 不可外传】

  我从不在人前哭。

  长大后第一次哭，是因为裴长风那一剑。
  那一剑没有刺中我，却刺中了教中一个无辜的侍女。
  我站在血泊中，看着她的眼睛慢慢闭上。
  那天我发誓要让正道付出代价。

  可后来我遇见了你。

  你和裴长风不一样——你的剑会避开蝴蝶，
  你在雨中会把伞递给路人，
  你看见受伤的小兽会蹲下来包扎。

  我不该喜欢你的。
  日月神教的圣女，怎么可以喜欢正道的侠客？

  但那天你笑着递给我一壶热酒，
  我接过来的那一瞬间，
  手指碰到了你的手指。

  我就知道完了。

  我这辈子，怕是栽在你手里了。

  ——月纱  手书于神教后山·冰湖畔`
    }
  },

  // ══════════════════════════════════════
  // 🎮 小游戏类（12个）
  // ══════════════════════════════════════

  ach_first_fish: {
    id:'ach_first_fish', name:'姜太公', desc:'钓到第一条鱼',
    icon:'🎣', category:'minigame', rarity:'common', points:5,
    type:'event', reward:'经验+10'
  },
  ach_fish_rare: {
    id:'ach_fish_rare', name:'渔翁得利', desc:'钓到一条稀有(rare以上)鱼',
    icon:'🐟', category:'minigame', rarity:'rare', points:10,
    type:'event', reward:'银两×80'
  },
  ach_fish_legendary: {
    id:'ach_fish_legendary', name:'龙吟钓叟', desc:'钓到一条传说鱼',
    icon:'🐉', category:'minigame', rarity:'legendary', points:40,
    type:'event', reward:'声望+50 + 独特鱼饵×3'
  },
  ach_fish_30: {
    id:'ach_fish_30', name:'渔霸', desc:'累计钓到30条鱼',
    icon:'🎏', category:'minigame', rarity:'rare', points:10,
    type:'count', target:30, reward:'银两×120'
  },
  ach_cricket_first_win: {
    id:'ach_cricket_first_win', name:'蛐蛐将军', desc:'赢得第一场斗蛐蛐',
    icon:'🦗', category:'minigame', rarity:'common', points:5,
    type:'event', reward:'银两×20'
  },
  ach_cricket_5streak: {
    id:'ach_cricket_5streak', name:'蝉联冠军', desc:'斗蛐蛐连胜5场',
    icon:'🏆', category:'minigame', rarity:'rare', points:10,
    type:'count', target:5, reward:'高级蛐蛐笼×1'
  },
  ach_cricket_20wins: {
    id:'ach_cricket_20wins', name:'虫王', desc:'斗蛐蛐累计赢20场',
    icon:'👑', category:'minigame', rarity:'epic', points:20,
    type:'count', target:20, reward:'传说蛐蛐碎片×5'
  },
  ach_catch_rare: {
    id:'ach_catch_rare', name:'听风辨位', desc:'捉到一只稀有(蓝)以上蛐蛐',
    icon:'👂', category:'minigame', rarity:'rare', points:10,
    type:'event', reward:'银两×60'
  },
  ach_gamble_first: {
    id:'ach_gamble_first', name:'赌徒入门', desc:'第一次参与赌坊游戏',
    icon:'🎲', category:'minigame', rarity:'common', points:5,
    type:'event', reward:'银两×15'
  },
  ach_pitchpot_10: {
    id:'ach_pitchpot_10', name:'投壶能手', desc:'单局投壶命中10次',
    icon:'🎯', category:'minigame', rarity:'common', points:5,
    type:'count', target:10, reward:'经验+25'
  },
  ach_forge_first: {
    id:'ach_forge_first', name:'铁匠学徒', desc:'首次锻造成功',
    icon:'🔨', category:'minigame', rarity:'common', points:5,
    type:'event', reward:'材料礼包×1'
  },
  ach_arena_3win: {
    id:'ach_arena_3win', name:'擂台新星', desc:'擂台连续获胜3场',
    icon:'🥇', category:'minigame', rarity:'rare', points:10,
    type:'count', target:3, reward:'声望+20'
  },
  ach_cardflip_first: {
    id:'ach_cardflip_first', name:'初入天机', desc:'第一次参与天机阁翻牌',
    icon:'🎴', category:'minigame', rarity:'common', points:5,
    type:'event', reward:'银两×20'
  },
  ach_cardflip_full: {
    id:'ach_cardflip_full', name:'九牌全翻', desc:'翻满九张牌全部成功',
    icon:'✨', category:'minigame', rarity:'epic', points:20,
    type:'event', reward:'天命丹×1'
  },
  ach_cardflip_legend: {
    id:'ach_cardflip_legend', name:'天命之人', desc:'翻牌获得神品(legendary)奖励',
    icon:'👑', category:'minigame', rarity:'legendary', points:40,
    type:'event', reward:'声望+80'
  },

  // ══════════════════════════════════════
  // ⚗️ 合成类（5个）
  // ══════════════════════════════════════

  ach_first_craft: {
    id:'ach_first_craft', name:'炼器初成', desc:'首次成功合成物品',
    icon:'⚗️', category:'craft', rarity:'common', points:5,
    type:'event', reward:'经验+15'
  },
  ach_craft_20: {
    id:'ach_craft_20', name:'能工巧匠', desc:'累计合成20次物品',
    icon:'🔨', category:'craft', rarity:'rare', points:10,
    type:'count', target:20, reward:'银两×100'
  },
  ach_craft_rare: {
    id:'ach_craft_rare', name:'妙手偶得', desc:'合成一件稀有(蓝色)以上物品',
    icon:'💠️', category:'craft', rarity:'rare', points:10,
    type:'event', reward:'声望+15'
  },
  ach_craft_epic: {
    id:'ach_craft_epic', name:'神来之笔', desc:'合成一件史诗(紫色)物品',
    icon:'💜', category:'craft', rarity:'epic', points:20,
    type:'event', reward:'声望+35'
  },
  ach_craft_100: {
    id:'ach_craft_100', name:'千锤百炼', desc:'累计合成100次物品',
    icon:'⚒️', category:'craft', rarity:'legendary', points:40,
    type:'count', target:100, reward:'传说配方残页×1'
  },

  // ══════════════════════════════════════
  // 🏆 特殊/成长类（10个）
  // ══════════════════════════════════════

  ach_level_10: {
    id:'ach_level_10', name:'初窥门径', desc:'角色达到10级',
    icon:'⭐', category:'special', rarity:'common', points:5,
    type:'threshold', target:10, reward:'银两×50'
  },
  ach_level_30: {
    id:'ach_level_30', name:'小有所成', desc:'角色达到30级',
    icon:'⭐⭐', category:'special', rarity:'rare', points:10,
    type:'threshold', target:30, reward:'银两×200'
  },
  ach_level_50: {
    id:'ach_level_50', name:'名动一方', desc:'角色达到50级',
    icon:'⭐⭐⭐', category:'special', rarity:'epic', points:20,
    type:'threshold', target:50, reward:'声望+50'
  },
  ach_level_80: {
    id:'ach_level_80', name:'宗师风范', desc:'角色达到80级',
    icon:'💫', category:'special', rarity:'legendary', points:40,
    type:'threshold', target:80, reward:'称号候选 + 声望+80'
  },
  ach_fame_100: {
    id:'ach_fame_100', name:'声名鹊起', desc:'声望值达到100',
    icon:'📢', category:'special', rarity:'rare', points:10,
    type:'threshold', target:100, reward:'银两×150'
  },
  ach_fame_500: {
    id:'ach_fame_500', name:'威震江湖', desc:'声望值达到500',
    icon:'📣', category:'special', rarity:'epic', points:20,
    type:'threshold', target:500, reward:'声望+50'
  },
  ach_fame_1000: {
    id:'ach_fame_1000', name:'一代大侠', desc:'声望值达到1000',
    icon:'🏅', category:'special', rarity:'mythic', points:80,
    type:'threshold', target:1000, reward:'特殊称号「大侠」+ 江湖地位'
  },
  ach_travel_10: {
    id:'ach_travel_10', name:'走南闯北', desc:'旅行抵达10个不同城市',
    icon:'🐪', category:'special', rarity:'common', points:5,
    type:'count', target:10, reward:'经验+30'
  },
  ach_travel_28: {
    id:'ach_travel_28', name:'足迹遍天下', desc:'旅行抵达全部28个城镇',
    icon:'🗺️', category:'special', rarity:'legendary', points:40,
    type:'count', target:28, reward:'特殊坐骑 + 声望+60'
  },
  ach_rich_10000: {
    id:'ach_rich_10000', name:'富甲一方', desc:'累计获得10000两银子',
    icon:'💰', category:'special', rarity:'epic', points:20,
    type:'count', target:10000, reward:'声望+30'
  },

  // ══════════════════════════════════════
  // 🏅 装饰解锁类（成就奖励=气场/头像框/称号牌）
  // ══════════════════════════════════════

  ach_sect_shaolin: {
    id:'ach_sect_shaolin', name:'少林弟子', desc:'加入少林派',
    icon:'🛕', category:'special', rarity:'rare', points:10,
    type:'event', reward:'解锁「佛道系气场」'
  },
  ach_sect_wudang: {
    id:'ach_sect_wudang', name:'武当弟子', desc:'加入武当派',
    icon:'☯️', category:'special', rarity:'rare', points:10,
    type:'event', reward:'解锁「道系气场」'
  },
  ach_sect_wudu: {
    id:'ach_sect_wudu', name:'五毒弟子', desc:'加入五毒教',
    icon:'🐍', category:'special', rarity:'rare', points:10,
    type:'event', reward:'解锁「蛊毒气场」'
  },
  ach_sect_mojiao: {
    id:'ach_sect_mojiao', name:'明教弟子', desc:'加入明教（波斯拜火教）',
    icon:'🔥', category:'special', rarity:'rare', points:10,
    type:'event', reward:'解锁「魔道气场」'
  },
  ach_learn_skill_10: {
    id:'ach_learn_skill_10', name:'融会贯通', desc:'累计学会10种不同武功',
    icon:'📖', category:'special', rarity:'epic', points:20,
    type:'count', target:10, reward:'解锁「剑/刀/拳意气场」'
  },
  ach_dungeon_fire: {
    id:'ach_dungeon_fire', name:'烈焰行者', desc:'通关一座火焰系地下城',
    icon:'🔥', category:'dungeon', rarity:'rare', points:10,
    type:'event', reward:'解锁「烈焰气场」'
  },
  ach_dungeon_ice: {
    id:'ach_dungeon_ice', name:'冰霜旅人', desc:'通关一座寒冰系地下城',
    icon:'❄️', category:'dungeon', rarity:'rare', points:10,
    type:'event', reward:'解锁「冰霜气场」'
  },
  ach_dungeon_wind: {
    id:'ach_dungeon_wind', name:'风之旅人', desc:'通关一座风系地下城',
    icon:'🌪️', category:'dungeon', rarity:'rare', points:10,
    type:'event', reward:'解锁「疾风气场」'
  },
  ach_dungeon_poison: {
    id:'ach_dungeon_poison', name:'毒行天下', desc:'通关一座毒系地下城',
    icon:'☠️', category:'dungeon', rarity:'rare', points:10,
    type:'event', reward:'解锁「毒雾气场」'
  },
  ach_dungeon_water: {
    id:'ach_dungeon_water', name:'碧波行者', desc:'通关一座水系地下城',
    icon:'🌊', category:'dungeon', rarity:'rare', points:10,
    type:'event', reward:'解锁「碧波气场」'
  },
  ach_dungeon_thunder: {
    id:'ach_dungeon_thunder', name:'雷霆使者', desc:'通关一座雷系地下城',
    icon:'⚡', category:'dungeon', rarity:'epic', points:15,
    type:'event', reward:'解锁「雷霆气场」'
  },
  ach_collect_item_30: {
    id:'ach_collect_item_30', name:'收藏达人', desc:'背包累计持有30种不同物品',
    icon:'🎒', category:'special', rarity:'rare', points:10,
    type:'count', target:30, reward:'解锁「五行气场」'
  },
  ach_win_streak_10: {
    id:'ach_win_streak_10', name:'连胜达人', desc:'单次战斗连击达到10次',
    icon:'💥', category:'battle', rarity:'epic', points:15,
    type:'count', target:10, reward:'解锁「狂气气场」'
  },
  ach_learn_manual_20: {
    id:'ach_learn_manual_20', name:'武学宗师', desc:'累计学会20种武学功法',
    icon:'📚', category:'special', rarity:'epic', points:20,
    type:'count', target:20, reward:'解锁「掌风/腿风气场」'
  },
  ach_travel_all: {
    id:'ach_travel_all', name:'走遍天下', desc:'游历全部28座城镇',
    icon:'🏞️', category:'special', rarity:'epic', points:20,
    type:'count', target:28, reward:'解锁「地域气场」'
  },
  ach_pvp_win_20: {
    id:'ach_pvp_win_20', name:'擂台霸主', desc:'在竞技场累计获胜20场',
    icon:'🏆', category:'minigame', rarity:'rare', points:15,
    type:'count', target:20, reward:'解锁「龙吟气场」'
  },
  ach_craft_epic: {
    id:'ach_craft_epic', name:'锻造宗师', desc:'累计打造3件史诗装备',
    icon:'⚒️', category:'minigame', rarity:'epic', points:20,
    type:'count', target:3, reward:'解锁「神工匠气场」'
  },
  ach_minigame_chess_10: {
    id:'ach_minigame_chess_10', name:'弈林高手', desc:'在棋社累计取得10场胜利',
    icon:'♟️', category:'minigame', rarity:'rare', points:10,
    type:'count', target:10, reward:'解锁「棋局气场」+ 稀有棋盘皮肤'
  },

  // ══════════════════════════════════════
  // 🐾 宠物类（10个）
  // ══════════════════════════════════════

  ach_pet_first: {
    id:'ach_pet_first', name:'灵宠相伴', desc:'获得第一只宠物',
    icon:'🐾', category:'collection', rarity:'common', points:5,
    type:'event', reward:'宠物食物×5'
  },
  ach_pet_3: {
    id:'ach_pet_3', name:'灵宠收藏家', desc:'拥有3只不同宠物',
    icon:'🐕', category:'collection', rarity:'rare', points:10,
    type:'count', target:3, reward:'高级宠物食物×3'
  },
  ach_pet_5: {
    id:'ach_pet_5', name:'灵宠大师', desc:'拥有5只不同宠物',
    icon:'🦊', category:'collection', rarity:'epic', points:20,
    type:'count', target:5, reward:'传说宠物食物×1 + 声望+30'
  },
  ach_pet_level_20: {
    id:'ach_pet_level_20', name:'悉心照料', desc:'将一只宠物培养到20级',
    icon:'💝', category:'collection', rarity:'rare', points:10,
    type:'event', reward:'宠物经验丹×3'
  },
  ach_pet_level_50: {
    id:'ach_pet_level_50', name:'灵宠宗师', desc:'将一只宠物培养到50级',
    icon:'👑', category:'collection', rarity:'epic', points:20,
    type:'event', reward:'宠物突破丹×1 + 声望+50'
  },
  ach_pet_battle_10: {
    id:'ach_pet_battle_10', name:'并肩作战', desc:'宠物参与战斗10次',
    icon:'⚔️', category:'battle', rarity:'common', points:5,
    type:'count', target:10, reward:'宠物口粮×10'
  },
  ach_pet_battle_50: {
    id:'ach_pet_battle_50', name:'最佳拍档', desc:'宠物参与战斗50次',
    icon:'🛡️', category:'battle', rarity:'rare', points:10,
    type:'count', target:50, reward:'宠物装备箱×1'
  },
  ach_pet_feed_30: {
    id:'ach_pet_feed_30', name:'爱心喂养', desc:'累计喂食宠物30次',
    icon:'🍖', category:'collection', rarity:'common', points:5,
    type:'count', target:30, reward:'宠物快乐丹×3'
  },
  ach_pet_legendary: {
    id:'ach_pet_legendary', name:'神兽降世', desc:'获得一只传说/神话品质宠物',
    icon:'🐲', category:'collection', rarity:'legendary', points:40,
    type:'event', reward:'神兽专属装备×1 + 声望+80'
  },
  ach_pet_phoenix: {
    id:'ach_pet_phoenix', name:'凤鸣九天', desc:'获得宠物【雏凤】',
    icon:'🦅', category:'collection', rarity:'epic', points:20,
    type:'event', hidden:true, reward:'凤凰羽×3 + 声望+50'
  },

  // ══════════════════════════════════════
  // 👨‍🏫 师徒类（6个）
  // ══════════════════════════════════════

  ach_master_first: {
    id:'ach_master_first', name:'拜师学艺', desc:'拜第一位师父',
    icon:'🙇', category:'npc', rarity:'common', points:5,
    type:'event', reward:'师徒信物×1'
  },
  ach_apprentice_first: {
    id:'ach_apprentice_first', name:'传道授业', desc:'收第一名弟子',
    icon:'📚', category:'npc', rarity:'rare', points:10,
    type:'event', reward:'教导经验加成+5%'
  },
  ach_master_3: {
    id:'ach_master_3', name:'桃李满天下', desc:'累计收徒3人',
    icon:'🌳', category:'npc', rarity:'rare', points:10,
    type:'count', target:3, reward:'名师称号候选'
  },
  ach_master_graduate: {
    id:'ach_master_graduate', name:'出师成名', desc:'一名弟子成功出师',
    icon:'🎓', category:'npc', rarity:'epic', points:20,
    type:'event', reward:'声望+40 + 出师礼盒×1'
  },
  ach_master_teach_20: {
    id:'ach_master_teach_20', name:'诲人不倦', desc:'累计指点弟子20次',
    icon:'✍️', category:'npc', rarity:'common', points:5,
    type:'count', target:20, reward:'师徒亲密度道具×5'
  },
  ach_master_both: {
    id:'ach_master_both', name:'亦师亦友', desc:'同时拥有师父和弟子',
    icon:'🤝', category:'npc', rarity:'rare', points:10,
    type:'event', reward:'全属性+1'
  },

  // ══════════════════════════════════════
  // 🩸 结拜类（5个）
  // ══════════════════════════════════════

  ach_sworn_1: {
    id:'ach_sworn_1', name:'义结金兰', desc:'与一名NPC结拜',
    icon:'🩸', category:'npc', rarity:'rare', points:10,
    type:'event', reward:'金兰谱×1 + 声望+20'
  },
  ach_sworn_2: {
    id:'ach_sworn_2', name:'桃园结义', desc:'拥有2名结拜兄弟',
    icon:'🍑', category:'npc', rarity:'epic', points:20,
    type:'count', target:2, reward:'结义酒×5 + 声望+40'
  },
  ach_sworn_full: {
    id:'ach_sworn_full', name:'四海之内皆兄弟', desc:'结拜人数达到上限(3人)',
    icon:'🌐', category:'npc', rarity:'legendary', points:40,
    type:'count', target:3, reward:'称号「义薄云天」+ 声望+100'
  },
  ach_sworn_battle: {
    id:'ach_sworn_battle', name:'兄弟齐心', desc:'结拜兄弟参与增援战斗5次',
    icon:'⚔️', category:'battle', rarity:'rare', points:10,
    type:'count', target:5, reward:'兄弟同心丹×3'
  },
  ach_sworn_drink: {
    id:'ach_sworn_drink', name:'把酒言欢', desc:'与结拜兄弟对饮10次',
    icon:'🍻', category:'npc', rarity:'common', points:5,
    type:'count', target:10, reward:'陈年好酒×5'
  },

  // ══════════════════════════════════════
  // ⚔️ 门派比武类（6个）
  // ══════════════════════════════════════

  ach_champ_first: {
    id:'ach_champ_first', name:'初试锋芒', desc:'首次参加门派比武',
    icon:'🎯', category:'minigame', rarity:'common', points:5,
    type:'event', reward:'比武积分+50'
  },
  ach_champ_win_5: {
    id:'ach_champ_win_5', name:'连胜将军', desc:'比武连胜5场',
    icon:'🔥', category:'minigame', rarity:'rare', points:10,
    type:'count', target:5, reward:'连胜宝箱×1'
  },
  ach_champ_rank_up: {
    id:'ach_champ_rank_up', name:'平步青云', desc:'段位提升一级',
    icon:'📈', category:'minigame', rarity:'rare', points:10,
    type:'event', reward:'段位奖励双倍券×1'
  },
  ach_champ_elite: {
    id:'ach_champ_elite', name:'一代宗师', desc:'达到精英段位',
    icon:'💎', category:'minigame', rarity:'epic', points:20,
    type:'event', reward:'精英专属称号 + 声望+50'
  },
  ach_champ_master: {
    id:'ach_champ_master', name:'武道至尊', desc:'达到大师段位',
    icon:'👑', category:'minigame', rarity:'legendary', points:40,
    type:'event', reward:'大师专属气场 + 声望+100'
  },
  ach_champ_tournament: {
    id:'ach_champ_tournament', name:'技压群雄', desc:'赢得一次武斗大会冠军',
    icon:'🏆', category:'minigame', rarity:'legendary', points:40,
    type:'event', reward:'冠军奖杯 + 传说功法残页×1'
  },

  // ══════════════════════════════════════
  // 🏙️ 城市争夺类（5个）
  // ══════════════════════════════════════

  ach_conquest_first: {
    id:'ach_conquest_first', name:'初入纷争', desc:'参与第一次城市争夺',
    icon:'⚔️', category:'quest', rarity:'common', points:5,
    type:'event', reward:'城市贡献点+20'
  },
  ach_conquest_stage2: {
    id:'ach_conquest_stage2', name:'深入虎穴', desc:'完成城市争夺第二阶段',
    icon:'🐯', category:'quest', rarity:'rare', points:10,
    type:'event', reward:'阶段宝箱×1'
  },
  ach_conquest_complete: {
    id:'ach_conquest_complete', name:'城市英雄', desc:'完成一座城市的全部争夺任务',
    icon:'🦸', category:'quest', rarity:'epic', points:20,
    type:'event', reward:'城市英雄称号 + 声望+60'
  },
  ach_conquest_2cities: {
    id:'ach_conquest_2cities', name:'双城记', desc:'完成2座城市的争夺',
    icon:'🏙️', category:'quest', rarity:'epic', points:20,
    type:'count', target:2, reward:'双城宝箱×1 + 声望+80'
  },
  ach_conquest_all: {
    id:'ach_conquest_all', name:'江湖霸主', desc:'完成所有城市争夺任务',
    icon:'👑', category:'quest', rarity:'legendary', points:40,
    type:'special', reward:'霸主称号 + 传说装备×1 + 声望+200'
  },

  // ══════════════════════════════════════
  // 📰 江湖传闻类（4个）
  // ══════════════════════════════════════

  ach_bulletin_first: {
    id:'ach_bulletin_first', name:'消息灵通', desc:'阅读第一条江湖传闻',
    icon:'📰', category:'special', rarity:'common', points:5,
    type:'event', reward:'情报值+10'
  },
  ach_bulletin_30: {
    id:'ach_bulletin_30', name:'百事通', desc:'累计阅读30条江湖传闻',
    icon:'📢', category:'special', rarity:'rare', points:10,
    type:'count', target:30, reward:'情报网扩展 + 声望+20'
  },
  ach_event_participate: {
    id:'ach_event_participate', name:'风云人物', desc:'参与一次江湖大事件',
    icon:'🌪️', category:'special', rarity:'rare', points:10,
    type:'event', reward:'事件纪念徽章×1'
  },
  ach_event_master: {
    id:'ach_event_master', name:'弄潮儿', desc:'参与10次江湖大事件',
    icon:'🌊', category:'special', rarity:'epic', points:20,
    type:'count', target:10, reward:'称号「江湖百晓生」+ 声望+50'
  },

  // ══════════════════════════════════════
  // 🌟 分类大师成就（解锁某分类全部成就）
  // ══════════════════════════════════════

  ach_master_battle: {
    id:'ach_master_battle', name:'武道宗师', desc:'解锁所有战斗类成就',
    icon:'🌟', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「无双剑客」+ 声望+100',
    lore: null
  },
  ach_master_dungeon: {
    id:'ach_master_dungeon', name:'地底霸主', desc:'解锁所有地下城类成就',
    icon:'🏆', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「探墓宗师」+ 稀有坐骑×1',
    lore: null
  },
  ach_master_quest: {
    id:'ach_master_quest', name:'侠义化身', desc:'解锁所有任务类成就',
    icon:'📜', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「信义之侠」+ 声望+80',
    lore: null
  },
  ach_master_npc: {
    id:'ach_master_npc', name:'人心所向', desc:'解锁所有人物关系成就',
    icon:'💖', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「江湖人心」+ 全NPC好感+5',
    lore: null
  },
  ach_master_minigame: {
    id:'ach_master_minigame', name:'百艺通达', desc:'解锁所有小游戏类成就',
    icon:'🎖️', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「江湖百艺」+ 银两×500',
    lore: null
  },
  ach_master_craft: {
    id:'ach_master_craft', name:'炼器真人', desc:'解锁所有合成类成就',
    icon:'⚒️', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「鬼工匠人」+ 传说材料×3',
    lore: null
  },
  ach_master_collection: {
    id:'ach_master_collection', name:'万物收藏家', desc:'解锁所有收集类成就',
    icon:'🎒', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「收藏家」+ 专属背包皮肤',
    lore: null
  },
  ach_master_pet: {
    id:'ach_master_pet', name:'灵宠天尊', desc:'解锁所有宠物类成就',
    icon:'🐾', category:'special', rarity:'legendary', points:60,
    type:'special', hidden:false,
    reward:'称号「灵宠天尊」+ 传说宠物蛋×1',
    lore: null
  },

  // ══════════════════════════════════════
  // 🔮 隐藏传说成就（含隐藏剧情文本）
  // ══════════════════════════════════════

  ach_lore_bloodgate: {
    id:'ach_lore_bloodgate', name:'血骨秘史', desc:'???',
    icon:'🩸', category:'special', rarity:'legendary', points:80,
    type:'event', hidden:true,
    reward:'解锁「血骨门秘史」文献 + 声望+60',
    lore: {
      title:'血骨门门主·裂骨子的生平',
      text:`
  【隐秘档案 · 血骨门秘史】

  裂骨子，本名陈烈，本为沧州医者世家之子，
  少时随父学医，精通骨伤正骨，为乡里所重。

  三十岁那年，一队官兵因剿匪而屠戮村庄，
  错将无辜百姓列入"从匪名册"——
  陈烈妻儿皆死于此役，父亲被焚于药铺之内。

  他逃出后流落江湖，偶得残缺邪典《破骨经》，
  以血泪磨砺十年，将医术扭曲为酷刑之术。
  所谓"血骨门"，不过是他一己之恨的投影。

  ——你终结了他，也终结了那段积了二十年的仇恨。
  但沧州城外那片荒坟，再无人祭扫。

  「江湖不记善恶，只记刀痕。」
      `
    }
  },
  ach_lore_wanderer: {
    id:'ach_lore_wanderer', name:'无根浮萍', desc:'???',
    icon:'🍂', category:'special', rarity:'legendary', points:80,
    type:'event', hidden:true,
    reward:'解锁「行者手记」残页 + 声望+60',
    lore: {
      title:'行者手记·第七页（残）',
      text:`
  【行者手记 · 残页】

  走过这么多城镇，我发现一件事：
  每座城都有人在等，等一个不会回来的人。

  开封茶馆的老板娘，每天傍晚放一双筷子；
  洛阳铁匠在锻刀时总会念一个名字；
  杭州西湖边有棵歪脖子树，树皮上刻着两个字，
  被风雨磨平了，但痕迹还在。

  江湖是什么？
  也许只是一群找不到回家路的人，
  凑在一起假装自己不孤独。

  我不知道我在寻找什么。
  但我知道，我还没找到。

  ——某个走遍二十八座城镇的浪人，留
      `
    }
  },
  ach_lore_tianshu: {
    id:'ach_lore_tianshu', name:'天机不可泄', desc:'???',
    icon:'🔮', category:'special', rarity:'mythic', points:120,
    type:'event', hidden:true,
    reward:'解锁「天机阁真相」文献 + 声望+100',
    lore: {
      title:'天机阁·阁主遗信',
      text:`
  【天机阁 · 阁主遗信 · 绝密】

  阁主大人亲启：

  自本人接掌天机阁算事房起，已整理历年卦簿逾千册。
  其中有一事，不敢隐瞒，亦不敢公开。

  三十年前，天机阁曾为某位「隐形门派」推演国运，
  所得卦象大凶——"鸡鸣三唱，江山易色"。
  彼时阁主令我封存，并销毁相关人证。

  但我发现，那批封存的竹简并未全部烧毁。
  其中一册已流入江湖，现藏于……

  ——此处墨迹涂去，无法辨认——

  若阁下正在阅读此信，
  说明您已走到了足够深处。

  天机不可泄，但人心可测。

  祝安。
      `
    }
  },
  ach_lore_sect_betrayal: {
    id:'ach_lore_sect_betrayal', name:'不忠之侠', desc:'???',
    icon:'🗡️', category:'special', rarity:'legendary', points:80,
    type:'event', hidden:true,
    reward:'解锁「叛徒的自白」文献 + 隐藏剧情线',
    lore: {
      title:'叛徒的自白',
      text:`
  【私人笔记 · 不得外传】

  我知道他们怎么看我。

  "叛徒"——这两个字轻巧，像一块石头丢进水里，
  溅起涟漪，然后所有人都假装没听见扑通声。

  我入门那年，掌门说：「进了这道门，就是一家人。」
  我信了。十年。

  但"一家人"不会让你背锅。
  "一家人"不会在你落难时集体失忆。
  "一家人"更不会……算了。

  现在我在另一处江湖站稳了脚跟，
  没人知道我从哪里来，
  也没人在乎我曾经叫什么名字。

  有时我会想，那些刻在旧门牌上的誓言，
  是真的还是从头到尾只是一句客套话？

  没有答案。但我活下来了。
  ——某不具名之人
      `
    }
  },
  ach_lore_legend: {
    id:'ach_lore_legend', name:'江湖传说', desc:'???',
    icon:'🏅', category:'special', rarity:'mythic', points:150,
    type:'event', hidden:true,
    reward:'解锁「大侠列传·无名氏传」+ 神话称号',
    lore: {
      title:'大侠列传·无名氏传（外传）',
      text:`
  【大侠列传 · 外传 · 无名氏传】

  史书不载其名，江湖只记其事。

  据传此人出身寒微，无门无派，
  走遍二十八城，与百人论剑，
  从未败北，也从未踏上名利之路。

  开封酒馆的说书人提到他时，总爱加一句：
  "那人只要两碗清酒，不要封赏。"

  他去过沧州，据说帮铁匠找回了失窃的祖传刀模；
  他去过杭州，据说在月夜里与一名哭泣的刺客交手，
  赢了，却把对方的刀还了回去；
  他去过大理，据说在苍山脚下坐了三天三夜，
  没人知道他在等什么，也没人敢去问。

  最后一次有人见到他，是在某条无名渡口，
  他上了一条不知去向的船，
  回头望了一眼陆地，没有说话。

  江湖如此，侠者如此。

  ——史官补注：此传无从考据，
    或为后人追思，或为真有其人。
    存疑。
      `
    }
  },

  // ══════════════════════════════════════
  // 🏯 城市争夺成就
  // ══════════════════════════════════════

  ach_city_conqueror: {
    id:'ach_city_conqueror', name:'江湖鼎定', desc:'完成三座城市的势力争夺任务链，改变江湖格局。',
    icon:'🏯', category:'special', rarity:'epic', points:50,
    type:'event', hidden:false,
    reward:'称号「定鼎者」+ 三城城望+30 + 声望+50',
  },

};

// ── 分类元信息 ──
const ACH_CATEGORIES = {
  battle:   { label:'⚔️ 战斗',   icon:'⚔️', color:'#ff7060' },
  dungeon:  { label:'🏰 地下城', icon:'🏰', color:'#60a8ff' },
  quest:    { label:'📜 任务',   icon:'📜', color:'#c0a0e0' },
  npc:      { label:'👥 人物',   icon:'🤝', color:'#ff9fc8' },
  minigame: { label:'🎮 小游戏', icon:'🎮', color:'#80d080' },
  craft:    { label:'⚗️ 合成',   icon:'⚗️', color:'#f0c060' },
  special:  { label:'🏆 成长',   icon:'🏆', color:'#ffe040' },
};

const ACH_RARITY = {
  common:{ stars:'★☆☆☆☆', label:'凡品', color:'#a0a0a0', bg:'rgba(160,160,160,.1)' },
  rare:  { stars:'★★★☆☆', label:'精良', color:'#40b0ff', bg:'rgba(64,176,255,.1)' },
  epic:  { stars:'★★★★☆', label:'史诗', color:'#c060ff', bg:'rgba(192,96,255,.1)' },
  legendary:{ stars:'★★★★★', label:'传说', color:'#ffd060', bg:'rgba(255,208,96,.1)' },
  mythic: { stars:'★★★★★', label:'神话', color:'#ff6040', bg:'rgba(255,96,64,.2)', glow:'0 0 20px rgba(255,96,64,.5)' },
};


// ════════════════════════════════════════════════════════════════
//  二、核心检测 API
// ════════════════════════════════════════════════════════════════

/**
 * 检查并尝试解锁一个 event 类型成就（一次性）
 * @param {string} achId - 成就ID
 * @returns {boolean} 是否刚刚解锁
 */
function achCheck(achId){
  if(!achId || !ACHIEVEMENT_DB[achId]) return false;
  if(achState.unlocked.includes(achId)) return false;

  const ach = ACHIEVEMENT_DB[achId];
  if(ach.type !== 'event') return false;

  // 额外条件检查
  if(typeof ach.condition === 'function'){
    try{ if(!ach.condition()) return false; }catch(e){ return false; }
  }

  return _unlockAchievement(achId);
}

/**
 * 累计计数型成就检测（自动 +1 并检查是否达目标）
 * @param {string} achId - 成就ID
 * @param {number} delta - 增量（默认1）
 * @returns {boolean} 是否刚解锁
 */
function achCountUp(achId, delta){
  if(!achId || !ACHIEVEMENT_DB[achId]) return false;
  if(achState.unlocked.includes(achId)) return false;

  const ach = ACHIEVEMENT_DB[achId];
  if(ach.type !== 'count') return false;

  achState.progress[achId] = (achState.progress[achId] || 0) + (delta || 1);
  achSave();

  if(achState.progress[achId] >= (ach.target || 1)){
    return _unlockAchievement(achId);
  }
  return false;
}

/**
 * 数值阈值型成就检测
 * @param {string} achId - 成就ID
 * @param {number} currentValue - 当前值
 * @returns {boolean} 是否刚解锁
 */
function achThreshold(achId, currentValue){
  if(!achId || !ACHIEVEMENT_DB[achId]) return false;
  if(achState.unlocked.includes(achId)) return false;

  const ach = ACHIEVEMENT_DB[achId];
  if(ach.type !== 'threshold') return false;

  achState.progress[achId] = Math.max(achState.progress[achId] || 0, currentValue);
  achSave();

  if(currentValue >= (ach.target || 1)){
    return _unlockAchievement(achId);
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
//  "将将胡"成就系统：解锁成就时的惊喜事件
// ═══════════════════════════════════════════════════════════════
const ACH_JIANGHU_EVENTS = {
  heavenlyLuck: {
    id: 'heavenlyLuck', chance: 0.05, icon: '🌟', title: '天降鸿运',
    desc: '解锁成就时天降鸿运，额外获得奖励',
    effect: (ach) => {
      const bonusSilver = (ach.points || 5) * 3;
      const bonusExp = (ach.points || 5) * 2;
      return { silver: bonusSilver, exp: bonusExp, msg: `🌟 天降鸿运！额外获得 ${bonusSilver}两银子和 ${bonusExp}经验！` };
    },
  },
  doubleJoy: {
    id: 'doubleJoy', chance: 0.03, icon: '🎊', title: '双喜临门',
    desc: '好事成双，额外获得一份随机奖励',
    effect: () => {
      const bonusItems = [
        { id: 'item_heal_low', name: '金疮药', icon: '🩹', qty: 2 },
        { id: 'item_food_ration', name: '干粮', icon: '🥖', qty: 3 },
        { id: 'item_drink_water', name: '清水', icon: '💧', qty: 3 },
        { id: 'item_elixir_low', name: '小还丹', icon: '💊', qty: 1 },
      ];
      const item = bonusItems[Math.floor(Math.random() * bonusItems.length)];
      return { item, msg: `🎊 双喜临门！额外获得 ${item.icon}${item.name}×${item.qty}！` };
    },
  },
  hiddenDiscovery: {
    id: 'hiddenDiscovery', chance: 0.04, icon: '🔍', title: '意外发现',
    desc: '在成就中发现隐藏的秘密',
    effect: () => {
      const secrets = [
        { type: 'intel', msg: '🔍 意外发现：获得一条江湖情报！', reward: '情报+1' },
        { type: 'reputation', msg: '🔍 意外发现：你的事迹被传颂！', reward: '声望+10' },
        { type: 'insight', msg: '🔍 意外发现：领悟了一点武学心得！', reward: '随机技能熟练度+10' },
      ];
      return secrets[Math.floor(Math.random() * secrets.length)];
    },
  },
  fameBoost: {
    id: 'fameBoost', chance: 0.06, icon: '📢', title: '名声大噪',
    desc: '成就解锁的消息传遍江湖',
    effect: (ach) => {
      const bonusRep = Math.ceil((ach.points || 5) * 0.8);
      return { reputation: bonusRep, msg: `📢 名声大噪！声望额外增加 ${bonusRep}点！` };
    },
  },
};

function _checkAchJianghuEvent(ach) {
  const roll = Math.random();
  let cumulative = 0;
  
  for (const key in ACH_JIANGHU_EVENTS) {
    const evt = ACH_JIANGHU_EVENTS[key];
    cumulative += evt.chance;
    if (roll < cumulative) {
      return { ...evt, result: evt.effect(ach) };
    }
  }
  return null;
}

function _showAchJianghuEvent(event, ach) {
  if (typeof showToast !== 'function') return;
  
  const rarityColors = {
    heavenlyLuck: '#ffd700',
    doubleJoy: '#ff6b9d',
    hiddenDiscovery: '#a78bfa',
    fameBoost: '#4ecdc4',
  };
  
  const color = rarityColors[event.id] || '#d4c4a0';
  
  // 延迟显示，让成就弹窗先显示
  setTimeout(() => {
    showToast(event.result.msg, 'success', 4000);
    
    // 额外特效弹窗（仅对高价值事件）
    if (event.id === 'heavenlyLuck' || event.id === 'doubleJoy') {
      const popup = document.createElement('div');
      popup.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(30,25,20,0.98), rgba(40,35,30,0.98));
        border: 2px solid ${color}; border-radius: 16px; padding: 20px;
        max-width: 320px; width: 90%; z-index: 10000;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${color}40;
        animation: achEventPop 0.4s ease-out;
      `;
      
      popup.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 40px; margin-bottom: 8px;">${event.icon}</div>
          <div style="font-size: 18px; font-weight: bold; color: ${color}; margin-bottom: 8px;">${event.title}</div>
          <div style="font-size: 13px; color: #d4c4a0; margin-bottom: 12px;">${event.result.msg}</div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(90deg, ${color}40, ${color}20);
            border: 1px solid ${color}; color: ${color}; padding: 8px 20px;
            border-radius: 8px; cursor: pointer; font-size: 13px;
          ">太棒了！</button>
        </div>
      `;
      
      // 添加动画样式
      if (!document.getElementById('ach-event-anim')) {
        const style = document.createElement('style');
        style.id = 'ach-event-anim';
        style.textContent = `
          @keyframes achEventPop {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.05); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 4000);
    }
  }, 800); // 延迟800ms，让成就弹窗先显示
}

function _applyAchJianghuReward(event) {
  // 应用奖励
  if (event.result.silver && typeof addSilver === 'function') {
    addSilver(event.result.silver);
  }
  if (event.result.exp && typeof addPlayerExp === 'function') {
    addPlayerExp(event.result.exp, '成就奖励');
  }
  if (event.result.item && typeof consumableBagAdd === 'function') {
    consumableBagAdd(event.result.item.id, event.result.item.qty);
  }
  if (event.result.reputation && typeof addReputation === 'function') {
    addReputation(event.result.reputation);
  }
  // 情报奖励
  if (event.result.type === 'intel' && typeof addIntel === 'function') {
    addIntel('random', 1);
  }
  // 技能熟练度奖励
  if (event.result.type === 'insight' && typeof edS !== 'undefined' && edS.skills) {
    const skillIds = Object.keys(edS.skills);
    if (skillIds.length > 0) {
      const randomSkill = skillIds[Math.floor(Math.random() * skillIds.length)];
      edS.skills[randomSkill] = (edS.skills[randomSkill] || 0) + 10;
      if (typeof edSave === 'function') edSave();
    }
  }
}

/**
 * 解析成就 reward 文本并实际发放奖励
 * 支持格式：
 *   银两×N / 银两+N → addSilver(N)
 *   声望+N / 声望×N → changeReputation(N)
 *   经验+N / 经验×N → addExp(N)
 *   内力上限+N → edS.maxMp += N
 *   称号「XXX」→ edS.title = 'XXX'
 *   稀有装备×1 / 传说装备×1 / 神器装备×1 → 背包生成对应稀有度装备
 *   全属性+N → 六维各+N
 */
function _applyAchievementReward(ach) {
  if (!ach || !ach.reward) return;
  const text = ach.reward;

  // 银两
  const silverMatch = text.match(/银两[×x+](\d+)/);
  if (silverMatch) {
    const amt = parseInt(silverMatch[1]);
    if (typeof addSilver === 'function') addSilver(amt);
  }

  // 声望/声誉
  const repMatch = text.match(/声望[×x+](\d+)/);
  if (repMatch) {
    const amt = parseInt(repMatch[1]);
    if (typeof travelPlayerState !== 'undefined') {
      travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation || 100) + amt);
      if (typeof travelSave === 'function') travelSave();
    }
    if (typeof changeReputation === 'function') changeReputation(amt);
  }

  // 经验
  const expMatch = text.match(/经验[×x+](\d+)/);
  if (expMatch) {
    const amt = parseInt(expMatch[1]);
    if (typeof addExp === 'function') addExp(amt);
  }

  // 内力上限
  const mpMatch = text.match(/内力上限[+](\d+)/);
  if (mpMatch && typeof edS !== 'undefined') {
    const amt = parseInt(mpMatch[1]);
    edS.maxMp = (edS.maxMp || 50) + amt;
    _editorSave();
  }

  // 全属性+N
  const allStatMatch = text.match(/全属性[+](\d+)/);
  if (allStatMatch && typeof edS !== 'undefined') {
    const amt = parseInt(allStatMatch[1]);
    const stats = ['con','str','agi','int','per','luc'];
    stats.forEach(s => { edS[s] = (edS[s] || 0) + amt; });
    _editorSave();
  }

  // 称号
  const titleMatch = text.match(/称号[「](.+?)[」]/);
  if (titleMatch && typeof edS !== 'undefined') {
    edS.title = titleMatch[1];
    _editorSave();
  }

  // 稀有度装备掉落
  const equipRarityMap = { '普通': 'common', '精品': 'uncommon', '精良': 'rare', '史诗': 'epic', '传说': 'legendary', '神器': 'mythic' };
  for (const [label, rarity] of Object.entries(equipRarityMap)) {
    const eqMatch = text.match(new RegExp(label + '装备[×x](\\d+)'));
    if (eqMatch) {
      const qty = parseInt(eqMatch[1]);
      _achGiveEquipByRarity(rarity, qty);
    }
  }
}

/**
 * 根据稀有度生成装备并放入背包
 */
function _achGiveEquipByRarity(rarity, qty) {
  if (typeof edS === 'undefined' || !edS.bag) return;
  if (typeof EQUIP_DB === 'undefined') return;

  const pool = Object.values(EQUIP_DB).filter(e => e.rarity === rarity);
  if (!pool.length) return;

  for (let i = 0; i < qty; i++) {
    const tpl = pool[Math.floor(Math.random() * pool.length)];
    const inst = {
      instId: 'ach_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      type: 'equip',
      templateId: tpl.id,
      name: tpl.name,
      icon: tpl.icon || '🗡️',
      identified: true,
      rarity: rarity,
      _dur: tpl.rarity === 'common' ? 60 : tpl.rarity === 'uncommon' ? 80 : tpl.rarity === 'rare' ? 100 : tpl.rarity === 'epic' ? 120 : tpl.rarity === 'legendary' ? 150 : 180,
    };
    // 复制装备属性
    if (tpl.atk) inst.atk = tpl.atk;
    if (tpl.def) inst.def = tpl.def;
    if (tpl.hp) inst.hp = tpl.hp;
    if (tpl.crit) inst.crit = tpl.crit;
    if (tpl.dodge) inst.dodge = tpl.dodge;
    if (tpl.speed) inst.speed = tpl.speed;

    edS.bag.push(inst);
  }
  _editorSave();
}

/**
 * 成就系统的编辑器存档快捷方法
 */
function _editorSave() {
  if (typeof edS !== 'undefined') {
    try { localStorage.setItem('wuxia_editor', JSON.stringify(edS)); } catch(e) {}
  }
}

/**
 * 解锁成就内部逻辑
 */
function _unlockAchievement(achId){
  if(achState.unlocked.includes(achId)) return false;

  const ach = ACHIEVEMENT_DB[achId];
  if(!ach) return false;

  achState.unlocked.push(achId);
  achState.totalScore += (ach.points || 0);
  achState.notified[achId] = false;
  achSave();

  // ═══════════════════════════════════════════════════════════════
  //  成就奖励实体化发放（解析 reward 文本 → 实际资源增加）
  // ═══════════════════════════════════════════════════════════════
  _applyAchievementReward(ach);

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"成就解锁随机事件
  // ═══════════════════════════════════════════════════════════════
  const jhEvent = _checkAchJianghuEvent(ach);
  if (jhEvent) {
    _showAchJianghuEvent(jhEvent, ach);
    _applyAchJianghuReward(jhEvent);
  }

  // 播放成就音效（legend/mythic 专属）
  if(typeof playAudio === 'function'){
    if(ach.rarity === 'mythic' || ach.rarity === 'legendary'){
      playAudio('levelup'); // 更隆重的音效
    } else {
      playAudio('achievement');
    }
  }

  // 显示通知（防堆叠：距上次通知至少2秒）
  const now = Date.now();
  if(now - achState.lastNotifyTime > 2000){
    achState.lastNotifyTime = now;
    achSave();
    // legendary/mythic 弹全屏大弹窗，其余滑入 toast
    if(ach.rarity === 'legendary' || ach.rarity === 'mythic'){
      _showLegendaryPopup(ach);
    } else {
      _showUnlockToast(ach);
    }
  }

  // 成就解锁日志（生产环境可关闭）

  // 检查是否触发分类大师成就（延迟100ms，避免递归堆栈）
  setTimeout(() => _checkCategoryMaster(ach.category), 100);

  return true;
}


// ════════════════════════════════════════════════════════════════
//  三、统计快捷入口（供各系统埋点调用）
// ════════════════════════════════════════════════════════════════

/** 战斗结束调用（胜利/失败都调这个）*/
function achOnBattleEnd(won){
  achState.stats.battles++;
  if(won){ achState.stats.wins++; } else { achState.stats.losses++; }
  achSave();

  // 通用检测
  if(won){
    achCheck('ach_first_win');
    achCountUp('ach_win_1'); // 兼容旧ID
    achCountUp('ach_win_10');
    achCountUp('ach_win_50');
    achCountUp('ach_win_100');
    achCountUp('ach_win_500');
    achCountUp('ach_win_streak_5');
    achCountUp('ach_battle_100');
  } else {
    achCheck('ach_first_loss');
    achCountUp('ach_loss_10');
  }
  achCountUp('ach_battle_100');

  // 无伤判定需由 battle.js 在 checkWin 中显式调用
}

/** 无伤胜利时由 battle.js 调用 */
function achOnNoDamageWin(){ return achCheck('ach_no_damage_win'); }

/** 击杀 elite 时调用 */
function achOnEliteKill(){ return achCheck('ach_kill_elite'); }

/** 击杀 boss 时调用 */
function achOnBossKill(){ return achCheck('ach_kill_boss'); }

/** 连击达成时调用 */
function achOnCombo(comboCount){
  if(comboCount >= 3) achCheck('ach_combo_3');
}

/** 气势满值时调用 */
function achOnMomentumMax(){ return achCheck('ach_momentum_max'); }

/** 地下城通关时调用 */
function achOnDungeonClear(noDeath){
  achState.stats.dungeons++;
  achSave();
  achCheck('ach_first_dungeon');
  achCountUp('ach_dungeon_5');
  achCountUp('ach_dungeon_15');
  achCountUp('ach_dungeon_30');
  if(noDeath) achCheck('ach_no_death_dungeon');
}

/** 房间清理时调用 */
function achOnRoomClear(){
  achState.stats.dungeonRooms++;
  achSave();
  achCountUp('ach_room_50');
  achCountUp('ach_room_200');
}

/** 任务完成时调用 */
function achOnQuestComplete(){
  achState.stats.quests++;
  achSave();
  achCheck('ach_first_quest');
  achCountUp('ach_quest_10');
  achCountUp('ach_quest_50');

  // 叛门后任务计数 → 达10个触发叛徒幸存者成就
  const edS = window.edS;
  if(edS && Array.isArray(edS.banishedSects) && edS.banishedSects.length > 0){
    edS.postBetrayalQuests = (edS.postBetrayalQuests || 0) + 1;
    if(edS.postBetrayalQuests >= 10){
      achOnBetrayalSurvivor();
    }
  }
}

/** 合成成功时调用 */
function achOnCraft(recipeId, rarity){
  achState.stats.crafts++;
  achSave();
  achCheck('ach_first_craft');
  achCountUp('ach_craft_20');
  achCountUp('ach_craft_100');
  // 稀有度检测：rare 以上触发 rare 成就，epic/legendary 额外触发 epic
  if(rarity && ['rare','epic','legendary','mythic'].includes(rarity)){
    achCheck('ach_craft_rare');
    if(rarity === 'epic' || rarity === 'legendary' || rarity === 'mythic'){
      achCheck('ach_craft_epic');
    }
  }
}

/** 钓到鱼时调用 */
function achOnFish(rarity){
  achState.stats.fishes++;
  achSave();
  achCheck('ach_first_fish');
  achCountUp('ach_fish_30');
  if(rarity === 'rare' || rarity === 'epic' || rarity === 'legendary' || rarity === 'mythic'){
    achCheck('ach_fish_rare');
    if(rarity === 'legendary' || rarity === 'mythic') achCheck('ach_fish_legendary');
  }
}

/** 斗蛐蛐相关 */
function achOnCricketWin(oddsRate){
  achState.stats.cricketWins++;
  achSave();
  achCheck('ach_cricket_first_win');
  achCountUp('ach_cricket_5streak');
  achCountUp('ach_cricket_20wins');
}
function achOnCatchRare(){ return achCheck('ach_catch_rare'); }
function achOnGamble(won, streak){ return achCheck('ach_gamble_first'); }

/** 翻牌结果：result='sha'|'complete'|'cashout', rewards=[] */
function achOnCardFlip(result, rewards){
  achCheck('ach_cardflip_first');
  if(result === 'complete') achCheck('ach_cardflip_full');
  if(rewards && rewards.some(r=>r.rarity==='legendary')){
    achCheck('ach_cardflip_legend');
    setTimeout(achOnTianjiLore, 1500); // 10%概率解锁天机传说
  }
}
function achOnPitchpotHit(){ achCountUp('ach_pitchpot_10'); }
function achOnForge(){ return achCheck('ach_forge_first'); }
function achOnArenaWin(){ achCountUp('ach_arena_3win'); }

/** 护镖完成 */
function achOnEscort(success){ /* 预留：后续可扩展护镖成就 */ }

/** 采药炼制 */
function achOnHerbCraft(rarity){
  // 复用合成检测逻辑（采药炼制品也有稀有度）
  achState.stats.crafts = achState.stats.crafts || 0;
  achSave();
  if(!rarity || rarity === 'common') return;
  if(['rare','epic','legendary'].includes(rarity)){
    achCheck('ach_craft_rare');
    if(rarity === 'epic' || rarity === 'legendary') achCheck('ach_craft_epic');
  }
}

/** 棋社获胜 */
function achOnChessWin(opponentSkill){ /* 预留：后续可扩展棋社成就 */ }

/** 隐藏传说成就触发入口 */

/**
 * 主线结局触发：血骨门之乱终章完成
 * 在 data-story.js 或 game-flow.js 的主线结局处调用
 */
function achOnMainlineEnd(storyId){
  if(storyId === 'bloodgate' || storyId === 'xugu_main'){
    _unlockAchievement('ach_lore_bloodgate');
  }
}

/**
 * 旅行到达全部城镇后触发浪人传说
 * 在 achOnTravel 达成全城时自动触发
 */
function achOnAllCitiesVisited(){
  _unlockAchievement('ach_lore_wanderer');
}

/**
 * 天机阁相关：翻出 legendary 牌后有10%概率触发天机传说
 */
function achOnTianjiLore(){
  if(Math.random() < 0.1){
    _unlockAchievement('ach_lore_tianshu');
  }
}

/**
 * 叛门后稳定立足时触发（在叛门后完成10个任务时调用）
 */
function achOnBetrayalSurvivor(){
  _unlockAchievement('ach_lore_sect_betrayal');
}

/**
 * 声望达到1000时触发江湖传说
 * 已由 achOnFameChange → achThreshold(ach_fame_1000) 触发，
 * 此处在 ach_fame_1000 解锁后自动触发
 */
function _tryUnlockJianghuLegend(){
  if(achState.unlocked.includes('ach_fame_1000')){
    setTimeout(() => _unlockAchievement('ach_lore_legend'), 2000);
  }
}

/** NPC 关系 */
function achOnMeetJianghu(){ return achCheck('ach_meet_jianghu'); }
function achOnRel60(){ return achCheck('ach_rel_60_one'); }
function achOnRel80(){ return achCheck('ach_rel_80_one'); }
function achOnGift(){
  achState.stats.giftsGiven++;
  achSave();
  achCountUp('ach_gift_10');
  achCountUp('ach_gift_50');
}
function achOnSwornBrother(){ return achCheck('ach_swear_brother'); }
function achOnTakeApprentice(){ return achCheck('ach_take_apprentice'); }

// ═════════════════════════════════════════════════════════════════
//  新增成就检测函数（宠物/师徒/结拜/比武/城市争夺/江湖传闻）
// ═════════════════════════════════════════════════════════════════

/** 宠物相关 */
function achOnPetCaught(petRarity){
  achState.stats.petsCaught++;
  achSave();
  achCheck('ach_pet_first');
  achCountUp('ach_pet_3');
  achCountUp('ach_pet_5');
  if(['legendary','mythic'].includes(petRarity)) achCheck('ach_pet_legendary');
}
function achOnPetLevelUp(petLevel){
  achThreshold('ach_pet_level_20', petLevel);
  achThreshold('ach_pet_level_50', petLevel);
}
function achOnPetBattle(){
  achState.stats.petBattles++;
  achSave();
  achCountUp('ach_pet_battle_10');
  achCountUp('ach_pet_battle_50');
}
function achOnPetFeed(){
  achState.stats.petFeeds++;
  achSave();
  achCountUp('ach_pet_feed_30');
}
function achOnPetPhoenix(){ return achCheck('ach_pet_phoenix'); }

/** 师徒相关 */
function achOnMasterFirst(){ return achCheck('ach_master_first'); }
function achOnApprenticeFirst(){
  achState.stats.apprentices++;
  achSave();
  achCheck('ach_apprentice_first');
  achCountUp('ach_master_3');
}
function achOnApprenticeGraduate(){ return achCheck('ach_master_graduate'); }
function achOnMasterTeach(){
  achState.stats.teachings++;
  achSave();
  achCountUp('ach_master_teach_20');
}
function achOnMasterBoth(){ return achCheck('ach_master_both'); }

/** 结拜相关 */
function achOnSwornJoin(){
  achState.stats.swornBrothers++;
  achSave();
  achCheck('ach_sworn_1');
  achCountUp('ach_sworn_2');
  achCountUp('ach_sworn_full');
}
function achOnSwornBattle(){
  achState.stats.swornBattles++;
  achSave();
  achCountUp('ach_sworn_battle');
}
function achOnSwornDrink(){
  achState.stats.swornDrinks++;
  achSave();
  achCountUp('ach_sworn_drink');
}

/** 门派比武相关 */
function achOnChampFirst(){
  achState.stats.champParticipations++;
  achSave();
  achCheck('ach_champ_first');
}
function achOnChampWin(){
  achState.stats.champWins++;
  achSave();
  achCountUp('ach_champ_win_5');
}
function achOnChampRankUp(){ return achCheck('ach_champ_rank_up'); }
function achOnChampRankElite(){ return achCheck('ach_champ_elite'); }
function achOnChampRankMaster(){ return achCheck('ach_champ_master'); }
function achOnChampTournamentWin(){ return achCheck('ach_champ_tournament'); }

/** 城市争夺相关 */
function achOnConquestFirst(){
  achCheck('ach_conquest_first');
}
function achOnConquestStage2(){
  achCheck('ach_conquest_stage2');
}
function achOnConquestComplete(){
  achState.stats.conquestsCompleted++;
  achSave();
  achCheck('ach_conquest_complete');
  achCountUp('ach_conquest_2cities');
  // 检查是否完成所有城市（假设有3个城市争夺）
  if(achState.stats.conquestsCompleted >= 3) achCheck('ach_conquest_all');
}

/** 江湖传闻相关 */
function achOnBulletinRead(){
  achState.stats.bulletinsRead++;
  achSave();
  achCheck('ach_bulletin_first');
  achCountUp('ach_bulletin_30');
}
function achOnEventParticipate(){
  achState.stats.eventsParticipated++;
  achSave();
  achCheck('ach_event_participate');
  achCountUp('ach_event_master');
}

/** 等级/声望/旅行/财富 — 需要外部定期或事件驱动调用 */
function achOnLevelUp(newLevel){
  achThreshold('ach_level_10', newLevel);
  achThreshold('ach_level_30', newLevel);
  achThreshold('ach_level_50', newLevel);
  achThreshold('ach_level_80', newLevel);
}
function achOnFameChange(newFame){
  achThreshold('ach_fame_100', newFame);
  achThreshold('ach_fame_500', newFame);
  const justUnlocked = achThreshold('ach_fame_1000', newFame);
  if(justUnlocked) _tryUnlockJianghuLegend();
}
function achOnTravel(cityCount){
  achThreshold('ach_travel_10', cityCount);
  const justUnlocked = achThreshold('ach_travel_28', cityCount);
  if(justUnlocked) achOnAllCitiesVisited();
}
function achOnSilverEarn(totalEarned){
  achThreshold('ach_rich_10000', totalEarned);
}


// ════════════════════════════════════════════════════════════════
//  四、成就面板 UI
// ════════════════════════════════════════════════════════════════

/**
 * 打开成就面板（全屏Overlay，复用 jh-page 样式体系）
 */
function showAchievementPage(){
  const overlay = document.createElement('div');
  overlay.className = 'jh-page-overlay';
  overlay.id = 'ach-page-overlay';

  const unlocked = achState.unlocked.length;
  const total = Object.keys(ACHIEVEMENT_DB).length;
  const pct = total > 0 ? Math.round(unlocked / total * 100) : 0;

  // 统计各稀有度
  const rarStats = {legendary:0, mythic:0};
  achState.unlocked.forEach(id => {
    const a = ACHIEVEMENT_DB[id];
    if(a && (a.rarity === 'legendary' || a.rarity === 'mythic')) rarStats[a.rarity]++;
  });

  // 按分类分组（大师成就也归入 special）
  const cats = {};
  Object.values(ACHIEVEMENT_DB).forEach(ach => {
    const c = ach.category || 'special';
    if(!cats[c]) cats[c] = [];
    cats[c].push(ach);
  });

  overlay.innerHTML = `
    <div class="jh-page" style="max-width:720px">
      <div class="jh-page-header">
        <div class="jh-page-title">🏆 成就 · 江湖录</div>
        <div class="jh-rep-badge">
          已解锁 ${unlocked}/${total} · ${pct}% · ${achState.totalScore}分
        </div>
        <button class="jh-close-btn" onclick="document.getElementById('ach-page-overlay').remove()">✕</button>
      </div>

      <!-- 总进度条 -->
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#a0b890;margin-bottom:4px">
          <span>总进度</span><span>${unlocked}/${total}</span></div>
        <div style="height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#f0c060,#e09040);border-radius:4px;transition:width .4s"></div>
        </div>
      </div>

      <!-- 稀有度徽章行 -->
      <div style="display:flex;gap:8px;margin-bottom:12px;font-size:11px">
        ${rarStats.legendary > 0 ? `<span style="padding:2px 10px;border-radius:8px;background:rgba(255,208,96,.1);border:1px solid rgba(255,208,96,.3);color:#ffd060">★★★★★ 传说 ×${rarStats.legendary}</span>` : ''}
        ${rarStats.mythic > 0 ? `<span style="padding:2px 10px;border-radius:8px;background:rgba(255,96,64,.1);border:1px solid rgba(255,96,64,.3);color:#ff6040">★★★★★ 神话 ×${rarStats.mythic}</span>` : ''}
        <span style="padding:2px 10px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:#888">总计 ${achState.totalScore} 分</span>
      </div>

      <!-- 分类Tab -->
      <div class="ach-tabs" id="achTabs">
        ${Object.entries(ACH_CATEGORIES).map(([key, cat]) => `
          <button class="ach-tab${key==='battle'?' active':''}" data-cat="${key}" onclick="achSwitchTab('${key}')"
                  style="--ac:${cat.color}">
            ${cat.icon} ${cat.label}
            <span class="ach-tab-count">${cats[key]?cats[key].filter(a=>achState.unlocked.includes(a.id)).length:0}/${cats[key]?cats[key].length:0}</span>
          </button>
        `).join('')}
      </div>

      <!-- 成就列表 -->
      <div id="achList" class="ach-list">
        ${_renderCategory('battle', cats)}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay._cats = cats;
}

function _renderCategory(catKey, cats){
  const list = cats[catKey] || [];
  if(!list.length) return '<div class="ach-empty">该分类暂无成就</div>';

  // 按稀有度排序：先展示高稀有度
  const rarOrder = {mythic:0, legendary:1, epic:2, rare:3, common:4};
  const sorted = [...list].sort((a,b) =>
    (rarOrder[a.rarity]||4) - (rarOrder[b.rarity]||4)
  );

  return sorted.map(ach => {
    const done = achState.unlocked.includes(ach.id);
    const rar = ACH_RARITY[ach.rarity] || ACH_RARITY.common;
    const prog = achState.progress[ach.id] || 0;
    const tgt = ach.target || 0;
    const catInfo = ACH_CATEGORIES[catKey] || {};

    const isLegendaryPlus = ach.rarity === 'legendary' || ach.rarity === 'mythic';
    // 未解锁的传说/神话，且标记hidden，显示???
    const showHidden = !done && ach.hidden;

    // 进度条（仅非隐藏且未完成时）
    let progHtml = '';
    if(!done && !showHidden && (ach.type === 'count' || ach.type === 'threshold')){
      const pctVal = Math.min(100, tgt > 0 ? Math.round(prog/tgt*100) : 0);
      progHtml = `<div class="ach-prog-bar"><div class="ach-prog-fill" style="width:${pctVal}%;background:${catInfo.color||'#80d080'}"></div></div>
                 <div class="ach-prog-text">${prog}/${tgt}</div>`;
    }

    // 已解锁传说成就且有lore → 查看按钮
    const loreBtn = (done && ach.lore)
      ? `<button class="ach-lore-btn" onclick="_showAchLore('${ach.id}')">📖 秘史</button>`
      : '';

    // 卡片特殊样式
    let cardStyle = '';
    let nameStyle = done ? '' : 'color:#888;';
    let iconStyle = done ? '' : 'filter:grayscale(.8);';
    if(done && isLegendaryPlus){
      cardStyle = `border-color:${rar.color}55;box-shadow:0 0 12px ${rar.color}22;
        background:${ach.rarity==='mythic'?'rgba(60,20,10,.15)':'rgba(40,32,8,.2)'};`;
      nameStyle = `color:${rar.color};text-shadow:0 0 8px ${rar.color}66;`;
    }

    return `
      <div class="ach-card ${done?'ach-done':''} ${isLegendaryPlus&&done?'ach-legendary-card':''}"
           data-id="${ach.id}" style="${cardStyle}">
        <div class="ach-card-left">
          <div class="ach-icon" style="${iconStyle}${isLegendaryPlus&&done?'font-size:32px;':''}">${showHidden ? '🔒' : ach.icon}</div>
          <div class="ach-card-info">
            <div class="ach-name" style="${nameStyle}">${showHidden ? '？？？' : ach.name}</div>
            <div class="ach-desc">${showHidden ? '此成就尚未解锁……' : ach.desc}</div>
            ${progHtml ? `<div class="ach-prog-wrap">${progHtml}</div>` : ''}
            ${loreBtn}
          </div>
        </div>
        <div class="ach-card-right">
          <span class="ach-rarity" style="color:${rar.color};border-color:${rar.color}30">${showHidden ? '???' : rar.stars}</span>
          <span class="ach-pts">${showHidden ? '???' : `${rar.label} · +${ach.points}`}</span>
          ${done ? '<span class="ach-done-badge">✓</span>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.achSwitchTab = function(catKey){
  // 更新tab样式
  document.querySelectorAll('#achTabs .ach-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === catKey);
  });
  // 更新列表
  var overlay = document.getElementById('ach-page-overlay');
  if(overlay && overlay._cats){
    document.getElementById('achList').innerHTML = _renderCategory(catKey, overlay._cats);
  }
};


// ════════════════════════════════════════════════════════════════
//  五、解锁通知 Toast & 弹窗系统
// ════════════════════════════════════════════════════════════════

/**
 * 普通成就解锁 Toast（右上角滑入，4秒后淡出）
 */
function _showUnlockToast(ach){
  // 移除旧toast（防堆叠）
  const old = document.getElementById('ach-unlock-toast');
  if(old) old.remove();

  const rar = ACH_RARITY[ach.rarity] || ACH_RARITY.common;
  const toast = document.createElement('div');
  toast.id = 'ach-unlock-toast';

  // epic及以上加发光背景
  const glowStyle = (ach.rarity === 'epic')
    ? `background:linear-gradient(135deg,rgba(30,20,50,.95),rgba(50,20,80,.95));`
    : `background:rgba(20,30,20,.92);`;

  toast.innerHTML = `
    <div class="ach-toast-inner" style="border-color:${rar.color};${glowStyle}
         box-shadow:0 0 30px ${rar.color}44,0 0 12px ${rar.color}22,0 4px 20px rgba(0,0,0,.7)">
      <div class="ach-toast-header" style="color:${rar.color}">
        🎉 成就解锁！
      </div>
      <div class="ach-toast-body">
        <div class="ach-toast-icon">${ach.icon}</div>
        <div style="font-weight:700;color:#e8f5e8;font-size:15px">${ach.name}</div>
        <div style="font-size:11px;color:#a0b890;margin-top:4px;line-height:1.4">${ach.desc}</div>
        <div class="ach-toast-rarity" style="color:${rar.color};border-color:${rar.color}55">
          ${rar.stars} ${rar.label} · +${ach.points}分
        </div>
        ${ach.reward ? `<div class="ach-toast-reward">🎁 ${ach.reward}</div>` : ''}
      </div>
    </div>
  `;
  toast.style.cssText = `
    position:fixed;top:-120px;right:16px;left:auto;transform:none;
    z-index:99999;padding:0;
    pointer-events:auto;font-family:'Courier New',monospace;
    animation:achSlideRight .5s cubic-bezier(.2,.8,.4,1) forwards;
    cursor:pointer;
  `;
  toast.onclick = () => toast.remove();
  document.body.appendChild(toast);

  const dismissDelay = ach.rarity === 'epic' ? 5000 : 4000;
  setTimeout(()=>{
    if(!toast.parentNode) return;
    toast.style.transition = 'all .5s ease';
    toast.style.right = '-320px';
    toast.style.opacity = '0';
    setTimeout(()=>{ try{toast.remove();}catch(e){} }, 600);
  }, dismissDelay);
}

/**
 * 传说/神话成就 全屏大弹窗
 * - 半透明遮罩 + 居中卡片 + 粒子光效 + 按钮可查看隐藏剧情
 */
function _showLegendaryPopup(ach){
  // 移除旧的
  const old = document.getElementById('ach-legend-overlay');
  if(old) old.remove();

  const rar = ACH_RARITY[ach.rarity] || ACH_RARITY.legendary;
  const isMythic = ach.rarity === 'mythic';

  const overlay = document.createElement('div');
  overlay.id = 'ach-legend-overlay';

  // 标题头文字
  const headerText = isMythic ? '⚡ 神话成就降临！' : '🌟 传说成就解锁！';
  const headerColor = isMythic ? '#ff6040' : '#ffd060';
  const bgGrad = isMythic
    ? 'linear-gradient(160deg,rgba(40,10,5,.97),rgba(60,15,10,.97))'
    : 'linear-gradient(160deg,rgba(20,18,8,.97),rgba(35,28,10,.97))';

  // 粒子配置
  const particleCount = isMythic ? 24 : 16;
  const particleColors = isMythic
    ? ['#ff6040','#ff9060','#ffb080','#ff4020']
    : ['#ffd060','#ffe090','#f0c030','#ffaa20'];

  // 生成粒子HTML
  let particles = '';
  for(let i=0; i<particleCount; i++){
    const color = particleColors[i % particleColors.length];
    const angle = (360 / particleCount) * i;
    const delay = (i * 0.06).toFixed(2);
    const size = 4 + Math.random() * 6;
    particles += `<div class="ach-particle" style="
      --angle:${angle}deg;--delay:${delay}s;--color:${color};
      width:${size}px;height:${size}px;background:${color};
      border-radius:50%;
    "></div>`;
  }

  overlay.innerHTML = `
    <div class="ach-legend-backdrop" onclick="_closeAchLegendPopup()"></div>
    <div class="ach-legend-card" style="border-color:${rar.color};background:${bgGrad};
         box-shadow:0 0 60px ${rar.color}66,0 0 120px ${rar.color}22">
      <!-- 粒子容器 -->
      <div class="ach-particle-ring" id="achParticleRing">
        ${particles}
      </div>
      <!-- 标题 -->
      <div class="ach-legend-header" style="color:${headerColor}">
        ${headerText}
      </div>
      <!-- 成就图标大图 -->
      <div class="ach-legend-icon-wrap" style="border-color:${rar.color}66">
        <div class="ach-legend-icon">${ach.icon}</div>
        <div class="ach-legend-shine" style="background:radial-gradient(circle,${rar.color}33 0%,transparent 70%)"></div>
      </div>
      <!-- 成就信息 -->
      <div class="ach-legend-name" style="color:${rar.color}">${ach.name}</div>
      <div class="ach-legend-rarity" style="color:${rar.color};border-color:${rar.color}44">
        ${rar.stars} ${rar.label} · +${ach.points}分
      </div>
      <div class="ach-legend-desc">${ach.desc}</div>
      ${ach.reward ? `<div class="ach-legend-reward">🎁 ${ach.reward}</div>` : ''}
      <!-- 底部按钮 -->
      <div style="display:flex;gap:10px;margin-top:18px;justify-content:center">
        ${ach.lore ? `<button class="ach-legend-btn ach-legend-btn-lore"
          onclick="_showAchLore('${ach.id}')">📖 查看隐藏记录</button>` : ''}
        <button class="ach-legend-btn" onclick="_closeAchLegendPopup()"
          style="border-color:${rar.color}66;color:${rar.color}">
          ✓ 已知晓
        </button>
      </div>
    </div>
  `;

  overlay.style.cssText = `
    position:fixed;inset:0;z-index:999998;
    display:flex;align-items:center;justify-content:center;
    animation:achFadeIn .4s ease forwards;
    font-family:'Courier New',monospace;
  `;
  document.body.appendChild(overlay);
}

window._closeAchLegendPopup = function(){
  const el = document.getElementById('ach-legend-overlay');
  if(el){
    el.style.transition = 'opacity .3s ease';
    el.style.opacity = '0';
    setTimeout(()=>{ try{el.remove();}catch(e){} }, 350);
  }
};

/**
 * 隐藏剧情文本弹窗
 */
window._showAchLore = function(achId){
  const ach = ACHIEVEMENT_DB[achId];
  if(!ach || !ach.lore) return;

  // 关闭传说弹窗
  _closeAchLegendPopup();

  const rar = ACH_RARITY[ach.rarity] || ACH_RARITY.legendary;
  const overlay = document.createElement('div');
  overlay.id = 'ach-lore-overlay';
  overlay.innerHTML = `
    <div class="ach-legend-backdrop" onclick="document.getElementById('ach-lore-overlay').remove()"></div>
    <div class="ach-lore-card" style="border-color:${rar.color}66">
      <div class="ach-lore-header" style="color:${rar.color}">
        📜 ${ach.lore.title}
      </div>
      <div class="ach-lore-body">${ach.lore.text.replace(/\n/g,'<br>')}</div>
      <div style="text-align:right;margin-top:16px">
        <button class="ach-legend-btn" onclick="document.getElementById('ach-lore-overlay').remove()"
          style="border-color:${rar.color}66;color:${rar.color}">合上</button>
      </div>
    </div>
  `;
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:999999;
    display:flex;align-items:center;justify-content:center;
    animation:achFadeIn .3s ease forwards;
    font-family:'Courier New',monospace;
  `;
  document.body.appendChild(overlay);
};

/**
 * 检查某分类是否全部解锁，若是则触发大师成就
 */
const _CAT_MASTER_MAP = {
  battle: 'ach_master_battle',
  dungeon: 'ach_master_dungeon',
  quest: 'ach_master_quest',
  npc: 'ach_master_npc',
  minigame: 'ach_master_minigame',
  craft: 'ach_master_craft',
  collection: 'ach_master_collection',
};
function _checkCategoryMaster(category){
  const masterId = _CAT_MASTER_MAP[category];
  if(!masterId) return;
  if(achState.unlocked.includes(masterId)) return;

  // 找出该分类所有常规成就（排除大师成就自身）
  const catAchs = Object.values(ACHIEVEMENT_DB).filter(a =>
    a.category === category &&
    !a.id.startsWith('ach_master_') &&
    !a.hidden
  );
  if(!catAchs.length) return;

  // 检查是否全部解锁
  const allDone = catAchs.every(a => achState.unlocked.includes(a.id));
  if(allDone){
    // 分类大师成就触发日志
    _unlockAchievement(masterId);
  }
}

/**
 * 全局快捷入口：城镇底部按钮调用
 * 如果成就面板已打开则关闭，否则打开
 */
function townOpenAchievements(){
  const existing = document.getElementById('ach-page-overlay');
  if(existing){ existing.remove(); return; }
  showAchievementPage();
}



// ════════════════════════════════════════════════════════════════
//  六、CSS 样式注入
// ════════════════════════════════════════════════════════════════

(function injectAchievementStyles(){
  const style = document.createElement('style');
  style.textContent = `

/* ── 成就Tab栏 ── */
.ach-tabs {
  display:flex; gap:4px; margin-bottom:14px; flex-wrap:wrap;
}
.ach-tab {
  display:flex;align-items:center;gap:5px;
  padding:6px 12px;border:1px solid rgba(255,255,255,.1);
  border-radius:8px;background:rgba(255,255,255,.04);
  color:#a0b890;font-size:12px;cursor:pointer;
  transition:all .2s;font-family:inherit;
}
.ach-tab:hover { background:rgba(255,255,255,.08); }
.ach-tab.active {
  background:rgba(var(--ac,80,255,.15));border-color:var(--ac, .4);
  box-shadow:0 0 12px rgba(var(--ac),.15);
}
.ach-tab-count {
  background:rgba(255,255,255,.1);border-radius:10px;
  padding:1px 7px;font-size:10px;color:#c0d0c0;
}

/* ── 成就列表 ── */
.ach-list {
  display:flex;flex-direction:column; gap:6px;
  max-height:55vh;overflow-y:auto;padding-right:4px;
  scrollbar-width:thin;scrollbar-color:rgba(240,192,96,.3) transparent;
}
.ach-empty {
  text-align:center;color:#556;padding:32px 16px;font-size:13px;
}

/* ── 单张成就卡片 ── */
.ach-card {
  display:flex;align-items:center;justify-content:space-between;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:10px;padding:10px 12px;transition:all .2s;
}
.ach-card:not(.ach-done):hover {
  background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.15);
  transform:translateY(-1px);
}
.ach-card.ach-done {
  opacity:.85;border-style:solid;border-color:rgba(128,200,128,.2);
  background:rgba(80,200,80,.04);
}
.ach-legendary-card {
  animation:achLegendShimmer 3s ease-in-out infinite;
}
@keyframes achLegendShimmer {
  0%,100% { box-shadow:0 0 10px rgba(255,208,96,.1); }
  50% { box-shadow:0 0 18px rgba(255,208,96,.25); }
}
.ach-card-left {
  display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;
}
.ach-card-right {
  display:flex;flex-direction:column;align-items:flex-end;gap:3px;text-align:right;
}
.ach-icon {
  font-size:28px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;
  border-radius:8px;background:rgba(255,255,255,.05);flex-shrink:0;
}
.ach-name {
  font-size:14px;font-weight:700;color:#e8f5e8;
}
.ach-desc {
  font-size:11px;color:#788;line-height:1.5;
}
.ach-rarity {
  font-size:10px;padding:2px 6px;border-radius:4px;border-style:solid;
  border-width:1px;white-space:nowrap;
}
.ach-pts {
  font-size:10px;color:#666;
}
.ach-done-badge {
  font-size:12px;color:#6d4;background:rgba(100,220,80,.1);
  border-radius:50%;padding:1px 4px;
}
.ach-lore-btn {
  margin-top:5px;padding:3px 8px;font-size:10px;
  background:rgba(255,208,96,.1);border:1px solid rgba(255,208,96,.3);
  color:#ffd060;border-radius:5px;cursor:pointer;font-family:inherit;
  transition:all .2s;
}
.ach-lore-btn:hover { background:rgba(255,208,96,.2); }

/* ── 进度条 ── */
.ach-prog-wrap {
  width:120px;margin-top:4px;
}
.ach-prog-bar {
  height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;
  margin-bottom:2px;
}
.ach-prog-fill {
  height:100%;border-radius:3px;transition:width .3s;
}
.ach-prog-text {
  font-size:9px;color:#689;text-align:right;
}

/* ── Toast (右侧滑入) ── */
@keyframes achSlideRight {
  from { right:-320px; opacity:0; transform:scale(.9); }
  to   { right:16px;   opacity:1; transform:scale(1); }
}
.ach-toast-inner {
  border-radius:12px;padding:14px 18px;min-width:260px;max-width:300px;
  border-width:1px;border-style:solid;
  backdrop-filter:blur(12px);
}
.ach-toast-header {
  font-size:11px;font-weight:700;letter-spacing:2px;
  text-align:center;margin-bottom:10px;
}
.ach-toast-body {
  text-align:center;
}
.ach-toast-icon {
  font-size:32px;margin-bottom:8px;
  animation:achIconBounce .4s ease;
}
@keyframes achIconBounce {
  0%,100% { transform:scale(1); }
  40% { transform:scale(1.3); }
}
.ach-toast-rarity {
  display:inline-block;margin-top:8px;font-size:11px;
  padding:3px 10px;border-radius:10px;border-width:1px;border-style:solid;
}
.ach-toast-reward {
  margin-top:6px;font-size:10px;color:#a0c890;
}

/* ── 传说/神话大弹窗 ── */
@keyframes achFadeIn {
  from { opacity:0; }
  to   { opacity:1; }
}
@keyframes achCardIn {
  from { opacity:0; transform:scale(.7) translateY(40px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}
.ach-legend-backdrop {
  position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(3px);
}
.ach-legend-card {
  position:relative;z-index:1;
  width:min(360px,90vw);
  border-radius:16px;border-width:2px;border-style:solid;
  padding:28px 24px 22px;text-align:center;
  animation:achCardIn .5s cubic-bezier(.2,.8,.3,1.1) forwards;
  overflow:hidden;
}
.ach-legend-header {
  font-size:13px;font-weight:700;letter-spacing:3px;
  margin-bottom:20px;
}
.ach-legend-icon-wrap {
  width:80px;height:80px;margin:0 auto 14px;
  border-radius:50%;border-width:2px;border-style:solid;
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  background:rgba(255,255,255,.05);
}
.ach-legend-icon {
  font-size:44px;position:relative;z-index:2;
  animation:achIconBounce .6s ease .3s both;
}
.ach-legend-shine {
  position:absolute;inset:-20px;border-radius:50%;
  animation:achShinePulse 2s ease-in-out infinite;
}
@keyframes achShinePulse {
  0%,100% { opacity:.3;transform:scale(.8); }
  50% { opacity:.7;transform:scale(1.2); }
}
.ach-legend-name {
  font-size:20px;font-weight:700;margin-bottom:8px;
}
.ach-legend-rarity {
  display:inline-block;font-size:11px;padding:3px 12px;
  border-radius:10px;border-width:1px;border-style:solid;
  margin-bottom:10px;
}
.ach-legend-desc {
  font-size:13px;color:#a0b890;line-height:1.6;margin-bottom:6px;
}
.ach-legend-reward {
  font-size:12px;color:#c8e890;margin-bottom:4px;
}
.ach-legend-btn {
  padding:8px 20px;border-radius:8px;border-width:1px;border-style:solid;
  background:rgba(255,255,255,.06);cursor:pointer;font-size:13px;
  font-family:inherit;transition:all .2s;
}
.ach-legend-btn:hover { background:rgba(255,255,255,.12); }
.ach-legend-btn-lore {
  border-color:rgba(255,208,96,.5);color:#ffd060;
  background:rgba(255,208,96,.08);
}
.ach-legend-btn-lore:hover { background:rgba(255,208,96,.16); }

/* ── 粒子环 ── */
.ach-particle-ring {
  position:absolute;top:50%;left:50%;pointer-events:none;
}
.ach-particle {
  position:absolute;
  animation:achParticleExplode 1.2s cubic-bezier(.2,.8,.3,1) var(--delay,.0s) both;
}
@keyframes achParticleExplode {
  from { transform:rotate(var(--angle,0deg)) translateY(0) scale(1); opacity:1; }
  to   { transform:rotate(var(--angle,0deg)) translateY(-140px) scale(0); opacity:0; }
}

/* ── 隐藏剧情弹窗 ── */
.ach-lore-card {
  position:relative;z-index:1;
  width:min(500px,92vw);max-height:75vh;overflow-y:auto;
  border-radius:14px;border-width:1px;border-style:solid;
  padding:22px 24px;
  background:rgba(10,12,10,.97);backdrop-filter:blur(8px);
  animation:achCardIn .35s ease forwards;
  scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.2) transparent;
}
.ach-lore-header {
  font-size:15px;font-weight:700;letter-spacing:1px;
  padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.08);
  margin-bottom:16px;
}
.ach-lore-body {
  font-size:13px;line-height:2;color:#b0c8a8;
  white-space:pre-wrap;letter-spacing:.3px;
}

  `;
  document.head.appendChild(style);
})();


// ════════════════════════════════════════════════════════════════
//  七、初始化
// ════════════════════════════════════════════════════════════════

achLoad();

// 导出 ACHIEVEMENTS 全局数组（供 town.html 等 UI 层使用，融合数据库+解锁状态）
window.ACHIEVEMENTS = Object.entries(ACHIEVEMENT_DB).map(([id, ach]) => ({
  id,
  name: ach.name || ach.title || id,
  desc: ach.desc || '',
  icon: ach.icon || '🏆',
  category: ach.category || '其他',
  unlocked: achState.unlocked.includes(id)
}));

// 成就系统加载完成

