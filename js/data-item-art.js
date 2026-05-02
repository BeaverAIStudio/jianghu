// ════════════════════════════════════════════════════
//  data-item-art.js  物品字符画数据
//  每个物品有一个 art 字段：3~4 行字符画，展示在炼物阁/背包详情
//  格式约定：每行最多9字符（等宽字体），用 \n 分隔
//  颜色风格参考物品类型/稀有度
// ════════════════════════════════════════════════════

const ITEM_ART = {

  // ══════════════════════════════════════════════
  //  兽材（野兽掉落）
  // ══════════════════════════════════════════════

  item_wolf_pelt: {
    art: `·≋≋≋≋≋·\n≋⌇⌇⌇⌇⌇≋\n·≋≋≋≋≋·`,
    color: '#a08060',
  },
  item_wolf_fang: {
    art: `  △△△  \n ╱╱╱╱╱ \n╱╱╱╱╱╱╱`,
    color: '#e0d0a0',
  },
  item_tiger_skin: {
    art: `▓░▓░▓░▓\n░▓≋▓≋▓░\n▓░▓░▓░▓`,
    color: '#d07020',
  },
  item_tiger_bone: {
    art: `╔══╗   \n║  ╠═══\n╚══╝   `,
    color: '#d0c090',
  },
  item_bear_hide: {
    art: `▓▓▓▓▓▓▓\n▓▓▓▓▓▓▓\n▓ ▓▓▓ ▓`,
    color: '#604030',
  },
  item_bear_paw: {
    art: `┌┐ ┌┐ ┌\n╞╪═╪═╪╡\n└╧═╧═╧┘`,
    color: '#804030',
  },
  item_snake_scale: {
    art: `◇◆◇◆◇◆◇\n◆◇◆◇◆◇◆\n◇◆◇◆◇◆◇`,
    color: '#40a060',
  },
  item_snake_gall: {
    art: `  ╭───╮  \n ╱ ◉◉ ╲ \n ╰─────╯ `,
    color: '#20c060',
  },
  item_venom_sac: {
    art: `╭──╮╭──╮\n│░░││░░│\n╰──╯╰──╯`,
    color: '#a0d020',
  },
  item_beast_core: {
    art: `  ╔═══╗  \n ║◈◈◈║ \n  ╚═══╝  `,
    color: '#60c0ff',
  },
  item_ice_crystal: {
    art: `  ✦   ✦  \n ╲ ❄❄❄ ╱ \n  ✦   ✦  `,
    color: '#80e0ff',
  },
  item_ghost_jade: {
    art: `  ╭───╮  \n ╱ ◈◈◈ ╲ \n ╰─────╯ `,
    color: '#40e080',
  },
  item_ghost_bone: {
    art: `  ╔═╗═╗  \n  ║╫╫╫║  \n  ╚═╝═╝  `,
    color: '#c0d0e0',
  },
  item_eagle_feather: {
    art: `     ╱   \n    ╱─── \n   ╱     `,
    color: '#e0c060',
  },
  item_leopard_pelt: {
    art: `░▒░▒░▒░\n▒●░▒●▒░\n░▒░▒░▒░`,
    color: '#e8e8e8',
  },
  item_lizard_scale: {
    art: `╔╗╔╗╔╗╔\n╠╬╬╬╬╬╣\n╚╝╚╝╚╝╚`,
    color: '#80c060',
  },
  item_turtle_shell: {
    art: `╭─┬─┬─╮\n├─╬─╬─┤\n╰─┴─┴─╯`,
    color: '#608040',
  },
  item_deer_antler: {
    art: `╱╲ ╱╲╱╲\n│ ╲╱  │\n│      │`,
    color: '#c0a060',
  },
  item_spirit_stone: {
    art: `  ◈◈◈◈◈  \n ◈◈◈◈◈◈◈ \n  ◈◈◈◈◈  `,
    color: '#80a0ff',
  },
  item_chaos_essence: {
    art: `▓▒░▒░▒▓\n░▒▓●▓▒░\n▓▒░▒░▒▓`,
    color: '#8040c0',
  },
  item_dragon_scale: {
    art: `╔══╦══╗\n║龍║龍║\n╚══╩══╝`,
    color: '#60d0ff',
  },

  // ══════════════════════════════════════════════
  //  任务道具
  // ══════════════════════════════════════════════

  item_bandit_token: {
    art: `┌─────┐\n│ ⚔贼 │\n└─────┘`,
    color: '#c09060',
  },
  item_iron_token: {
    art: `┌─────┐\n│ ▣令▣ │\n└─────┘`,
    color: '#a0b0c0',
  },
  item_bandit_seal: {
    art: `╔═════╗\n║ 断刀 ║\n╚═════╝`,
    color: '#e08040',
  },
  item_sect_recall: {
    art: `╔═════╗\n║ 🏮 ║\n╚═════╝`,
    color: '#ff6644',
  },
  item_haisha_token: {
    art: `╔═════╗\n║ ⚓沙 ║\n╚═════╝`,
    color: '#4080c0',
  },
  item_tiandi_token: {
    art: `╔═════╗\n║ 天地 ║\n╚═════╝`,
    color: '#c0c040',
  },
  item_xuegu_emblem: {
    art: `╔═════╗\n║ 💀骨 ║\n╚═════╝`,
    color: '#c04040',
  },
  item_xuanming_code: {
    art: `┌─────┐\n│░暗语░│\n├─────┤\n│░░░░░│`,
    color: '#4060c0',
  },
  item_riyue_token: {
    art: `╔═════╗\n║ 日月 ║\n╚═════╝`,
    color: '#c0a020',
  },
  item_wudu_insect: {
    art: `  ╭───╮  \n ╱●●●●╲ \n  ╰───╯  `,
    color: '#80c040',
  },
  item_antidote_recipe: {
    art: `╔═══╗  \n║方子║  \n╠═══╣  \n╚═══╝  `,
    color: '#40c080',
  },
  item_dark_token: {
    art: `┌─────┐\n│ ◈刺◈ │\n└─────┘`,
    color: '#606080',
  },
  item_bounty_scroll: {
    art: `╭─────╮\n│☉悬赏│\n│─────│\n╰─────╯`,
    color: '#c0a040',
  },
  item_western_silk: {
    art: `≋≋≋≋≋≋≋\n≋╭───╮≋\n≋│彩绸│≋\n≋╰───╯≋`,
    color: '#c060c0',
  },
  item_western_gift: {
    art: `  ╔═══╗  \n ╔╝礼╚╗ \n ╚═════╝ `,
    color: '#e0a040',
  },
  item_damp_cargo: {
    art: `╔═════╗\n║░货░箱║\n║~~~~~║\n╚═════╝`,
    color: '#806050',
  },
  item_xuantie_shard3: {
    art: `  ┌───┐  \n ╱ 玄 ╲ \n╱ 铁令 ╲`,
    color: '#4040c0',
  },
  item_xuanwu_missing: {
    art: `╭─────╮\n│?线索?│\n│─────│\n╰─────╯`,
    color: '#40a0c0',
  },

  // ══════════════════════════════════════════════
  //  杂项材料
  // ══════════════════════════════════════════════

  item_copper_coin: {
    art: `  ╭───╮  \n ╱ ◎钱 ╲ \n ╰─────╯ `,
    color: '#c08040',
  },
  item_crude_blade: {
    art: `      ╱ \n    ╱── \n──╱     `,
    color: '#909090',
  },
  item_poison_dart: {
    art: `──────► \n          \n──────► `,
    color: '#80c040',
  },

  // ══════════════════════════════════════════════
  //  合成草药（来自合成系统材料）
  // ══════════════════════════════════════════════

  item_herb_blood: {
    art: `  ╱╲╱╲  \n ╱ 血草╲ \n╱       ╲`,
    color: '#e04060',
  },
  item_herb_qi: {
    art: `  ╱╲╱╲  \n ╱ 参须╲ \n╱       ╲`,
    color: '#60c080',
  },
  item_herb_common: {
    art: `  ╱╲╱╲  \n ╱ 草药╲ \n╱       ╲`,
    color: '#60a040',
  },
  item_herb_rare: {
    art: `  ╱╲╱╲  \n ╱ 灵草╲ \n╱  ✦   ╲`,
    color: '#a0e060',
  },
  item_iron_ore: {
    art: `  ╔═══╗  \n ║▓铁▓║ \n  ╚═══╝  `,
    color: '#808090',
  },
  item_cloth: {
    art: `▓▓▓▓▓▓▓\n░░░░░░░\n▓▓▓▓▓▓▓`,
    color: '#c0a080',
  },
  item_gem: {
    art: `  ╱◆◆╲  \n ╱◆◆◆◆╲ \n ╲◆◆◆◆╱ `,
    color: '#60c0e0',
  },
  item_rare_gem: {
    art: `  ╱◈◈╲  \n ╱◈◈◈◈╲ \n ╲◈◈◈◈╱ `,
    color: '#c060e0',
  },
  item_mythic_gem: {
    art: `  ╱◉◉╲  \n ╱◉◉◉◉╲ \n ╲◉◉◉◉╱ `,
    color: '#e0a020',
  },
  item_elixir_low: {
    art: `  ╭───╮  \n ╱ 小丹 ╲ \n ╰─────╯ `,
    color: '#60e080',
  },
  item_elixir_mid: {
    art: `  ╭───╮  \n ╱ 中丹 ╲ \n ╰─────╯ `,
    color: '#40a0e0',
  },
  item_elixir_high: {
    art: `  ╭═══╮  \n ╱ 大丹 ╲ \n ╰═════╯ `,
    color: '#e060a0',
  },

  // ══════════════════════════════════════════════
  //  合成产出（消耗品）
  // ══════════════════════════════════════════════

  item_huoxue_pill: {
    art: `   ●●●   \n  ●●●●●  \n   ●●●   `,
    color: '#e04040',
  },
  item_peiyuan_pill: {
    art: `   ○○○   \n  ○○○○○  \n   ○○○   `,
    color: '#4080e0',
  },
  item_jiedu_pill: {
    art: `   ●●●   \n  ●●●●●  \n   ●●●   `,
    color: '#40c040',
  },
  item_qisheng_pill: {
    art: `  ✦●●✦  \n ●●●●●● \n  ✦●●✦  `,
    color: '#e0c020',
  },
  item_jingqi_pill: {
    art: `  ◈◈◈◈  \n ◈◈◈◈◈◈ \n  ◈◈◈◈  `,
    color: '#60a0e0',
  },
  item_kuixue_dan: {
    art: `  ◉◉◉◉  \n ◉◉◉◉◉◉ \n  ◉◉◉◉  `,
    color: '#e06040',
  },
  item_baoming_pill: {
    art: `╔═════╗\n║★保命★║\n╚═════╝`,
    color: '#e0e040',
  },
  item_poison_mist: {
    art: `░░░░░░░\n░●毒雾●░\n░░░░░░░`,
    color: '#80c020',
  },
  item_smoke_bomb: {
    art: `╭─────╮\n│ 烟雾 │\n╰─────╯`,
    color: '#808080',
  },
  item_blinding_sand: {
    art: `·:·:·:·\n:迷沙:::\n·:·:·:·`,
    color: '#c0b060',
  },
  item_jiuzhuan_pill: {
    art: `╔═════╗\n║✦九转✦║\n╚═════╝`,
    color: '#e040e0',
  },
  item_speed_boots_oil: {
    art: `  ╔═══╗  \n ╱疾风油╲ \n ╰─────╯ `,
    color: '#60e0c0',
  },

  // ══════════════════════════════════════════════
  //  收藏品 — common
  // ══════════════════════════════════════════════

  col_broken_compass: {
    art: `╔═════╗\n║ N↑  ║\n║ ·✕· ║\n╚═════╝`,
    color: '#a09060',
  },
  col_old_portrait: {
    art: `┌─────┐\n│ ◉ ◉ │\n│  ─  │\n│勿忘 │\n└─────┘`,
    color: '#c0a870',
  },
  col_copper_mirror: {
    art: `  ╭───╮  \n ╱ ≋≋≋ ╲ \n ╰─────╯ `,
    color: '#b08030',
  },
  col_dice_set: {
    art: `┌─┐┌─┐\n│●││●│\n└─┘└─┘`,
    color: '#d0b870',
  },
  col_worn_sandal: {
    art: `╭─────╮\n│=====│\n╰──○──╯`,
    color: '#a07040',
  },
  col_clay_figurine: {
    art: `  ╭─╮  \n  │○│  \n ╱│─│╲ \n  └─┘  `,
    color: '#c09060',
  },
  col_empty_jug: {
    art: `  ╭─╮  \n  │  │  \n ╱    ╲ \n╰──────╯`,
    color: '#a08060',
  },

  // ══════════════════════════════════════════════
  //  收藏品 — uncommon
  // ══════════════════════════════════════════════

  col_jade_pendant: {
    art: `   ○   \n  ╱◈╲  \n ╱◈◈◈╲ \n ╲─────╱`,
    color: '#40c060',
  },
  col_music_score: {
    art: `╔═════╗\n║≡断肠≡║\n║≡≡≡≡≡║\n╚═════╝`,
    color: '#c0b060',
  },
  col_chess_piece: {
    art: `  ╭───╮  \n ╱ 將 ╲ \n ╰─────╯ `,
    color: '#f0e8c0',
  },
  col_red_thread: {
    art: `  ~~~~~  \n ~红丝绳~ \n  ~~~~~  `,
    color: '#e04060',
  },
  col_bronze_bell: {
    art: `  ╭─╮  \n ╱平安╲ \n╱─────╲\n╰──○──╯`,
    color: '#c08020',
  },
  col_ink_stick: {
    art: `┌─────┐\n│▓▓▓▓▓│\n│▓ 墨 │\n└─────┘`,
    color: '#202020',
  },

  // ══════════════════════════════════════════════
  //  收藏品 — rare
  // ══════════════════════════════════════════════

  col_silver_hairpin: {
    art: `        ╲\n─────── ╲\n         ╲`,
    color: '#e0e0e0',
  },
  col_sect_tablet: {
    art: `╔═════╗\n║ 永誓 ║\n║─────║\n╚═════╝`,
    color: '#a0c0e0',
  },
  col_tiger_seal: {
    art: `╔═════╗\n║╔═╗  ║\n║║虎║  ║\n╚═════╝`,
    color: '#c07020',
  },
  col_letter_sealed: {
    art: `╭─────╮\n│     │\n│  ✦  │\n╰──●──╯`,
    color: '#e0c080',
  },
  col_jade_ring: {
    art: `  ╭───╮  \n ╱╱   ╲╲ \n ╲╲天一╱╱ \n  ╰───╯  `,
    color: '#40d080',
  },
  col_war_flag: {
    art: `│╔════╗\n│║  ◣  ║\n│╚════╝\n│      `,
    color: '#e04040',
  },

  // ══════════════════════════════════════════════
  //  收藏品 — epic
  // ══════════════════════════════════════════════

  col_jade_buddha: {
    art: `  ╭─╮  \n  │🙏│  \n ╱│─│╲ \n╱─────╲`,
    color: '#20d080',
  },
  col_scroll_painting: {
    art: `╔═════╗\n║≋山≋水║\n║≋≋≋≋≋║\n╚═════╝`,
    color: '#c0a040',
  },
  col_ancient_coin: {
    art: `  ╭───╮  \n ╱ ◉金◉ ╲ \n ╰─────╯ `,
    color: '#e0b020',
  },
  col_moonstone: {
    art: `  ╭───╮  \n ╱ ◈月◈ ╲ \n ╰─────╯ `,
    color: '#80c0ff',
  },
  col_phoenix_feather: {
    art: `     ╱   \n    ╱凤── \n   ╱  ── `,
    color: '#e06020',
  },

  // ══════════════════════════════════════════════
  //  收藏品 — legendary
  // ══════════════════════════════════════════════

  col_broken_sword: {
    art: `   ╱     \n  ╱──✕── \n ╱       `,
    color: '#c0c0e0',
  },
  col_jade_token_dragon: {
    art: `╔═════╗\n║ 龍纹 ║\n║奉天承║\n╚═════╝`,
    color: '#e0c020',
  },
  col_black_chess_board: {
    art: `╔╤╤╤╤╤╗\n╠╬╬╬╬╬╣\n╠╬棋盘╬╣\n╚╧╧╧╧╧╝`,
    color: '#202020',
  },
  col_anon_portrait: {
    art: `┌─────┐\n│ ◉ ◉ │\n│  ─  │\n│无名 │\n└─────┘`,
    color: '#e0d0a0',
  },
  col_cracked_bell: {
    art: `  ╭─╮  \n ╱  ╲  ╲\n╱──✕──╲\n╰──○──╯`,
    color: '#c07020',
  },

};

// ── 获取物品字符画 ──
function getItemArt(itemId){
  return ITEM_ART[itemId] || null;
}
