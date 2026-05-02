// city-encounters.js — 城市内奇遇系统 v1.0
// 触发于：进城时 / 客栈留宿 / 城镇闲逛
// 触发概率：进城时 8%，客栈休息时 20%，闲逛时 10%
// ════════════════════════════════════════════════════════════════════

// ── 城市奇遇触发状态 ────────────────────────────────────────────────
const CITY_ENC_STATE_KEY = 'wuxia_city_enc_state';
let _cityEncState = {
  lastDate:      '',       // 'YYYY-MM-DD' 跨日重置
  todayInnCount:  0,       // 今日客栈留宿次数
  todayStreetCount: 0,     // 今日街头偶遇次数
  lastInnEnc:     0,       // 上次客栈奇遇时间戳
  lastStreetEnc:  0,       // 上次街头奇遇时间戳
  triggeredIds:   [],      // 今日已触发过的ID
  pityCount:      0,       // 保底计数器：连续未触发次数
};

function loadCityEncState() {
  try {
    const raw = localStorage.getItem(CITY_ENC_STATE_KEY);
    if (raw) _cityEncState = JSON.parse(raw);
    const today = _cityEncDate();
    if (_cityEncState.lastDate !== today) {
      _cityEncState.todayInnCount   = 0;
      _cityEncState.todayStreetCount = 0;
      _cityEncState.triggeredIds    = [];
      _cityEncState.lastDate        = today;
      saveCityEncState();
    }
  } catch(e) {
    _resetCityEncState();
  }
}

function saveCityEncState() {
  localStorage.setItem(CITY_ENC_STATE_KEY, JSON.stringify(_cityEncState));
}

function _resetCityEncState() {
  _cityEncState = {
    lastDate: _cityEncDate(), todayInnCount: 0, todayStreetCount: 0,
    lastInnEnc: 0, lastStreetEnc: 0, triggeredIds: [], pityCount: 0,
  };
}

function _cityEncDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ── 城市奇遇触发条件 ────────────────────────────────────────────────
const _CITY_ENC_CD = { inn: 4 * 3600000, street: 2 * 3600000 }; // 客栈4hCD，街头2hCD
const _CITY_ENC_DAILY = { inn: 2, street: 3 }; // 每日上限

// ═══════════════════════════════════════════════════════════════
//  城市奇遇"将将胡"系统 - 特殊事件触发
// ═══════════════════════════════════════════════════════════════
const CITY_ENC_JIANGHU_EVENTS = {
  // 偶遇高人：直接获得大量经验
  meet_master: {
    id: 'meet_master',
    chance: 0.02, // 2%
    icon: '🧙‍♂️',
    title: '偶遇高人',
    desc: '街头转角，一位白发老者正在下棋，见你驻足，微微一笑...',
    effect: () => {
      const exp = 50 + Math.floor(Math.random() * 100);
      if (typeof addPlayerExp === 'function') addPlayerExp(exp, '偶遇高人');
      return { result: `老者与你手谈一局，指点你武学要诀。\n✦ 获得经验 ${exp}！`, tone: 'great' };
    }
  },
  // 意外之财：随机获得银两
  windfall: {
    id: 'windfall',
    chance: 0.03, // 3%
    icon: '💰',
    title: '意外之财',
    desc: '你在墙角发现一只破旧的钱袋...',
    effect: () => {
      const silver = 30 + Math.floor(Math.random() * 120);
      if (typeof SilverManager !== 'undefined') {
        SilverManager.add(silver);
        SilverManager.save();
      }
      return { result: `钱袋里竟然有 ${silver} 两银子！\n✦ 运气真好！`, tone: 'good' };
    }
  },
  // 江湖恩怨：卷入随机冲突
  grudge: {
    id: 'grudge',
    chance: 0.02, // 2%
    icon: '⚔️',
    title: '江湖恩怨',
    desc: '两拨人马正在街头对峙，看到你走来，其中一方突然喊道："朋友，帮个忙！"',
    effect: () => {
      const luck = Math.random();
      if (luck < 0.5) {
        // 帮对人了
        const silver = 50 + Math.floor(Math.random() * 50);
        if (typeof SilverManager !== 'undefined') {
          SilverManager.add(silver);
          SilverManager.save();
        }
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation || 100) + 10);
        }
        return { result: `你出手相助，击退了恶霸。\n被救者感激不尽，赠你 ${silver} 两银子，声名+10！`, tone: 'good' };
      } else {
        // 帮错人了
        const loss = 20 + Math.floor(Math.random() * 30);
        if (typeof SilverManager !== 'undefined') {
          SilverManager.add(-loss);
          SilverManager.save();
        }
        return { result: `你出手相助，却发现帮了恶霸...\n正道人士对你怒目而视，你损失了 ${loss} 两银子作为赔偿。`, tone: 'bad' };
      }
    }
  },
  // 天降奇缘：获得随机道具
  serendipity: {
    id: 'serendipity',
    chance: 0.01, // 1%
    icon: '✨',
    title: '天降奇缘',
    desc: '一只白鸽落在你的肩头，腿上绑着一个小竹筒...',
    effect: () => {
      const items = ['item_herb_gancao', 'item_iron_ore', 'item_rare_jade', 'item_hp_potion'];
      const itemId = items[Math.floor(Math.random() * items.length)];
      if (typeof craftBagAdd === 'function') craftBagAdd(itemId, 1);
      // 获取物品显示名称
      let itemName = itemId;
      if (typeof getItemMeta === 'function') {
        const meta = getItemMeta(itemId);
        if (meta && meta.name) itemName = (meta.icon || '') + meta.name;
      } else if (typeof CRAFT_MATERIAL_NAMES !== 'undefined' && CRAFT_MATERIAL_NAMES[itemId]) {
        const m = CRAFT_MATERIAL_NAMES[itemId];
        itemName = (m.icon || '') + m.name;
      }
      return { result: `竹筒里藏着一件物品！\n✦ 获得 ${itemName}！`, tone: 'great' };
    }
  }
};

// ═══════════════════════════════════════════════════════════════
//  城市奇遇"将将胡"恶搞事件（5%总概率）
// ═══════════════════════════════════════════════════════════════
const CITY_ENC_GAG_EVENTS = {
  // 被鸟屎砸中
  bird_poop: {
    id: 'bird_poop',
    icon: '💩',
    title: '天降"鸿运"',
    desc: '一只鸟飞过，你感觉头上一凉...',
    effect: () => {
      return { result: `你被鸟屎砸中了！\n路人纷纷侧目，你尴尬得想找个地缝钻进去...\n（运气暂时-5）`, tone: 'bad' };
    }
  },
  // 遇到卖假药的
  fake_medicine: {
    id: 'fake_medicine',
    icon: '💊',
    title: '江湖骗子',
    desc: '一个道士模样的人拦住你："这位少侠，我看你骨骼清奇..."',
    effect: () => {
      const loss = 10 + Math.floor(Math.random() * 20);
      if (typeof SilverManager !== 'undefined') {
        SilverManager.add(-loss);
        SilverManager.save();
      }
      return { result: `你买了他的"仙丹"，结果发现是麦芽糖...\n损失了 ${loss} 两银子。`, tone: 'bad' };
    }
  },
  // 踩到香蕉皮
  banana_peel: {
    id: 'banana_peel',
    icon: '🍌',
    title: '脚滑了',
    desc: '你大摇大摆地走着，突然脚下一滑...',
    effect: () => {
      return { result: `你踩到香蕉皮摔了个四脚朝天！\n周围的人都笑出了声...\n（但似乎有人偷偷往你口袋里塞了东西）`, tone: 'good' };
    }
  },
  // 被当成通缉犯
  wanted_mistake: {
    id: 'wanted_mistake',
    icon: '📜',
    title: '误会一场',
    desc: '几个捕快突然冲过来把你围住！',
    effect: () => {
      return { result: `捕快们看了看画像，又看了看你："抱歉，认错人了！"\n（虚惊一场）`, tone: 'neutral' };
    }
  },
  // 捡到钱
  found_money: {
    id: 'found_money',
    icon: '🪙',
    title: '地上有钱',
    desc: '你眼角余光瞥见地上有什么东西在反光...',
    effect: () => {
      const silver = 5 + Math.floor(Math.random() * 15);
      if (typeof SilverManager !== 'undefined') {
        SilverManager.add(silver);
        SilverManager.save();
      }
      return { result: `你捡到了 ${silver} 两银子！\n虽然不多，但蚊子腿也是肉！`, tone: 'good' };
    }
  },
  // 被美女/帅哥搭讪
  flirting: {
    id: 'flirting',
    icon: '💋',
    title: '桃花劫？',
    desc: '一位陌生异性朝你走来，眼神含情脉脉...',
    effect: () => {
      const luck = Math.random();
      if (luck < 0.3) {
        return { result: `对方说："公子/姑娘，买朵花吧？"\n原来是卖花的...`, tone: 'neutral' };
      } else if (luck < 0.6) {
        return { result: `对方说："我注意你很久了..."\n然后掏出了算命摊的招牌。`, tone: 'neutral' };
      } else {
        return { result: `对方只是问个路。\n（你想多了）`, tone: 'neutral' };
      }
    }
  },
  // ═══════════════════════════════════════════════════════════════
  //  宠物相关城市事件
  // ═══════════════════════════════════════════════════════════════
  // 宠物商店
  pet_shop: {
    id: 'pet_shop',
    icon: '🐾',
    title: '灵宠阁分店',
    desc: '你发现了一家专门售卖灵宠的店铺...',
    effect: () => {
      const pets = [
        { id: 'wolf', name: '苍狼幼崽', price: 300, desc: '忠诚的战士' },
        { id: 'bunny', name: '灵兔', price: 200, desc: '可爱的辅助' },
        { id: 'squirrel', name: '松鼠', price: 150, desc: '采集小能手' },
        { id: 'fox', name: '灵狐', price: 500, desc: '神秘的伙伴' },
      ];
      const pet = pets[Math.floor(Math.random() * pets.length)];
      const hasMoney = (typeof SilverManager !== 'undefined') ? SilverManager.has(pet.price) : false;
      if (hasMoney) {
        return { 
          result: `🐾 店主推荐：【${pet.name}】——${pet.desc}\n售价：${pet.price}两银子\n（可在灵宠阁界面购买）`, 
          tone: 'good',
          petOffer: pet
        };
      }
      return { result: `🐾 你看了看店里的灵宠，最便宜也要${pet.price}两银子...\n✦ 钱不够，下次再来吧`, tone: 'neutral' };
    }
  },
  // 宠物走失
  lost_pet: {
    id: 'lost_pet',
    icon: '😿',
    title: '走失的灵宠',
    desc: '一只看起来很有灵性的动物在街头徘徊， collar上写着名字...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.3) {
        // 找到主人，获得奖励
        const silver = 30 + Math.floor(Math.random() * 40);
        if (typeof SilverManager !== 'undefined') SilverManager.add(silver);
        return { result: `😿 你帮它找到了主人，主人感激地给了你${silver}两银子！\n✦ 好人有好报！`, tone: 'good' };
      } else if (roll < 0.6) {
        // 没人要，可以收养
        return { result: `😿 你等了很久都没人来认领，它可怜巴巴地看着你...\n✦ 你可以尝试收养它（去灵宠阁界面）`, tone: 'good' };
      } else {
        // 被当成偷宠物的
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.reputation = Math.max(0, (travelPlayerState.reputation || 100) - 5);
        }
        return { result: `😿 你刚靠近，就有人大喊："抓偷狗贼！"\n你百口莫辩，只好逃走...\n✦ 声誉-5（冤枉啊！）`, tone: 'bad' };
      }
    }
  },
  // 宠物比赛
  pet_contest: {
    id: 'pet_contest',
    icon: '🏆',
    title: '灵宠大赛',
    desc: '城里正在举办灵宠才艺大赛，奖金丰厚...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🏆 你没有带灵宠，只能当观众。\n✦ 看着别人的宠物拿奖，有点羡慕...`, tone: 'neutral' };
      }
      const roll = Math.random();
      if (roll < 0.2) {
        // 冠军
        const silver = 100 + Math.floor(Math.random() * 100);
        if (typeof SilverManager !== 'undefined') SilverManager.add(silver);
        return { result: `🏆 ${activePet.name}表现出色，夺得冠军！\n✦ 获得奖金${silver}两！（它真棒！）`, tone: 'legendary' };
      } else if (roll < 0.5) {
        // 名次
        const silver = 30 + Math.floor(Math.random() * 50);
        if (typeof SilverManager !== 'undefined') SilverManager.add(silver);
        return { result: `🏆 ${activePet.name}获得了不错的名次！\n✦ 获得奖金${silver}两！`, tone: 'good' };
      } else {
        // 没名次
        return { result: `🏆 ${activePet.name}紧张得忘了动作...\n✦ 虽然没有名次，但它尽力了！`, tone: 'neutral' };
      }
    }
  },
  // ═══════════════════════════════════════════════════════════════
  //  宠物恶搞事件
  // ═══════════════════════════════════════════════════════════════
  pet_poop_in_public: {
    id: 'pet_poop_in_public',
    icon: '💩',
    title: '当众出糗',
    desc: '你的宠物突然在闹市区解决了生理需求...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `💩 你踩到了不明物体...\n✦ 今天运气真差`, tone: 'bad' };
      }
      const roll = Math.random();
      if (roll < 0.3) {
        // 被罚款
        const fine = 5 + Math.floor(Math.random() * 10);
        if (typeof SilverManager !== 'undefined') SilverManager.add(-fine);
        return { result: `💩 ${activePet.name}在大街上便便，捕快走过来罚了你${fine}两银子！\n✦ 记得清理啊！`, tone: 'bad' };
      } else if (roll < 0.6) {
        // 路人笑
        return { result: `💩 ${activePet.name}当众便便，路人纷纷侧目...\n✦ 你尴尬地清理完，赶紧溜走`, tone: 'neutral' };
      } else {
        // 意外收获（有人觉得可爱）
        const tip = 2 + Math.floor(Math.random() * 8);
        if (typeof SilverManager !== 'undefined') SilverManager.add(tip);
        return { result: `💩 ${activePet.name}便便后，一位路人觉得它很可爱，给了你${tip}两银子当"清理费"！\n✦ 还有这种好事？`, tone: 'good' };
      }
    }
  },
  pet_chase_cat: {
    id: 'pet_chase_cat',
    icon: '🐈',
    title: '追猫大战',
    desc: '你的宠物突然看到一只猫，疯狂地追了上去...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🐈 一只狗追着猫跑过你身边，差点撞到你！\n✦ 好险`, tone: 'neutral' };
      }
      const roll = Math.random();
      if (roll < 0.3) {
        // 撞翻摊位
        const fine = 20 + Math.floor(Math.random() * 30);
        if (typeof SilverManager !== 'undefined') SilverManager.add(-fine);
        return { result: `🐈 ${activePet.name}追猫时撞翻了一个水果摊！\n✦ 赔偿${fine}两银子...（管好你的宠物！）`, tone: 'bad' };
      } else if (roll < 0.6) {
        // 追丢了
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - 10);
        }
        return { result: `🐈 ${activePet.name}追猫追了三条街，最后猫上了墙它够不着...\n✦ 精力-10（你也跟着跑累了）`, tone: 'neutral' };
      } else {
        // 抓到猫，猫主人感谢（以为是救猫）
        const reward = 15 + Math.floor(Math.random() * 25);
        if (typeof SilverManager !== 'undefined') SilverManager.add(reward);
        return { result: `🐈 ${activePet.name}把那只"走失"的猫赶回了主人身边！\n猫主人以为你在帮忙找猫，给了你${reward}两银子！\n✦ 歪打正着！`, tone: 'good' };
      }
    }
  },
  pet_steal_food_vendor: {
    id: 'pet_steal_food_vendor',
    icon: '🍖',
    title: '偷吃被抓',
    desc: '你的宠物趁你不注意，偷吃了路边摊的食物...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🍖 一只流浪狗偷吃了路边摊的肉串，摊主气得直跺脚！\n✦ 你默默走开了`, tone: 'neutral' };
      }
      const roll = Math.random();
      if (roll < 0.4) {
        // 被抓，要赔钱
        const cost = 10 + Math.floor(Math.random() * 20);
        if (typeof SilverManager !== 'undefined') SilverManager.add(-cost);
        return { result: `🍖 ${activePet.name}偷吃了摊主的肉串，被当场抓住！\n✦ 赔偿${cost}两银子（它吃得还挺香）`, tone: 'bad' };
      } else if (roll < 0.7) {
        // 摊主觉得可爱，算了
        return { result: `🍖 ${activePet.name}偷吃了摊主的包子，摊主看它可爱，挥挥手说算了。\n✦ 宠物饱食度+15，快乐度+10`, tone: 'good' };
      } else {
        // 吃坏肚子
        return { result: `🍖 ${activePet.name}偷吃了变质的食物，开始拉肚子...\n✦ 宠物饱食度-10，需要治疗`, tone: 'bad' };
      }
    }
  },
  pet_famous: {
    id: 'pet_famous',
    icon: '🌟',
    title: '网红宠物',
    desc: '你的宠物太可爱了，被路人围观拍照...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🌟 你看到一只特别可爱的宠物被众人围观。\n✦ 真羡慕`, tone: 'neutral' };
      }
      const roll = Math.random();
      if (roll < 0.3) {
        // 有人想买
        return { result: `🌟 一位富商看中${activePet.name}，出价500两银子想买！\n✦ 你拒绝了（它是无价的！）`, tone: 'good' };
      } else if (roll < 0.6) {
        // 收到礼物
        if (typeof craftBagAdd === 'function') craftBagAdd('item_pet_food', 2);
        return { result: `🌟 路人们纷纷给${activePet.name}送礼物！\n✦ 获得宠物食物×2`, tone: 'good' };
      } else {
        // 被摸烦了
        return { result: `🌟 ${activePet.name}被太多人摸，不耐烦地躲到你身后。\n✦ 宠物快乐度-5（它需要安静）`, tone: 'neutral' };
      }
    }
  },
  pet_bath_escape: {
    id: 'pet_bath_escape',
    icon: '🛁',
    title: '洗澡大逃亡',
    desc: '你带宠物去洗澡，它却趁机逃跑了...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🛁 你看到一只湿淋淋的狗从澡堂冲出来，后面追着老板...\n✦ 真热闹`, tone: 'neutral' };
      }
      const roll = Math.random();
      if (roll < 0.4) {
        // 追回来
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - 15);
        }
        return { result: `🛁 ${activePet.name}逃出澡堂，你追了半座城才抓住它！\n✦ 精力-15（它跑得真快）`, tone: 'bad' };
      } else if (roll < 0.7) {
        // 自己回来
        return { result: `🛁 ${activePet.name}逃出澡堂，但过一会儿自己回来了——它发现外面在下雨。\n✦ 宠物："还是洗澡暖和..."`, tone: 'good' };
      } else {
        // 被好心人送回来
        return { result: `🛁 ${activePet.name}逃出澡堂，一位好心人帮你送回来了。\n✦ 宠物快乐度+5，忠诚度+5（它以为你去接它了）`, tone: 'good' };
      }
    }
  }
};

function _cityEncDailyOk(type) {
  if (type === 'inn')   return _cityEncState.todayInnCount   < _CITY_ENC_DAILY.inn;
  if (type === 'street') return _cityEncState.todayStreetCount < _CITY_ENC_DAILY.street;
  return true;
}

function _cityEncCooldownOk(type) {
  const now = Date.now();
  if (type === 'inn')   return now - _cityEncState.lastInnEnc   > _CITY_ENC_CD.inn;
  if (type === 'street') return now - _cityEncState.lastStreetEnc > _CITY_ENC_CD.street;
  return true;
}

function _cityEncConditionOk(enc) {
  if (!enc.condition) return true;
  try { return enc.condition(); } catch(e) { return false; }
}

// ── 城市奇遇数据库 ────────────────────────────────────────────────
// tier: common | rare | legendary（城市内罕见传说）
// trigger: 'enter'（进城）| 'inn'（客栈留宿）| 'street'（街头偶遇）
const CITY_ENCOUNTER_DB = [

  // ═══════════════════════════
  //  A. 客栈留宿奇遇（夜间为主）
  // ═══════════════════════════

  {
    id: 'city_inn_hermit',
    tier: 'rare', trigger: 'inn', weight: 4,
    icon: '🧙', title: '隔壁高人',
    scene: '客栈夜深，你正要入睡，忽闻隔壁传来轻咳声。',
    narration: [
      '"睡不着？"隔壁传来苍老的声音。',
      '"老夫云游四方，从不与人同住，没想到今夜倒有个邻居。"',
    ],
    choices: [
      {
        label: '敲门拜访，以礼相待',
        icon: '🚪', fn: () => {
          const playerLv = (typeof edS !== 'undefined') ? (edS.level||1) : 1;
          const bonus = Math.min(30, playerLv * 2);
          if (typeof addPlayerExp === 'function') addPlayerExp(bonus, '江湖奇遇');
          if (typeof travelPlayerState !== 'undefined') {
            travelPlayerState.energy = Math.min(100, (travelPlayerState.energy||80) + 20);
            travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 5);
            if (typeof travelSave === 'function') travelSave();
          }
          return {
            result: `老者见你诚心，起身与你攀谈。\n临别时轻拍你肩膀："年轻人，你的根骨不错。这里有句话，你记着——"\n"招式是死的，人是活的。"\n✦ 精力恢复+20，声名+5，获得经验${bonus}，武学感悟提升！`,
            tone: 'great',
            extraLines: [`✦ 隐居老人·好感+1`],
          };
        },
      },
      {
        label: '道声晚安，各自休息',
        icon: '😴', fn: () => {
          if (typeof travelPlayerState !== 'undefined') {
            travelPlayerState.energy = Math.min(100, (travelPlayerState.energy||80) + 10);
            if (typeof travelSave === 'function') travelSave();
          }
          return { result: '老者轻笑一声，不再多言。\n这一夜你睡得很沉，梦里依稀听到刀剑之声。\n精力+10。', tone: 'neutral' };
        },
      },
    ],
  },

  {
    id: 'city_inn_thief',
    tier: 'common', trigger: 'inn', weight: 6,
    icon: '🥷', title: '夜半梁上客',
    scene: '夜半，窗棂轻响，你猛然惊醒——',
    narration: [
      '一道黑影正从窗缝挤入，身法轻盈，落地无声。',
      '你屏息装睡，却感知到来人正朝你的包袱摸去。',
    ],
    choices: [
      {
        label: '猛然出手，擒住宵小',
        icon: '⚔', fn: () => {
          const success = Math.random() < 0.6;
          if (success) {
            const silver = Math.floor(20 + Math.random() * 80);
            SilverManager.add(silver);
            SilverManager.save();
            return {
              result: `你突然跃起，一把扣住对方手腕！\n那人见势不妙，挣扎中被你反剪在地，从怀中搜出${silver}两银子——正是你之前丢失的！\n"大爷饶命！"他连声求饶。\n✦ 夺回失银+${silver}两，声誉+3。`,
              tone: 'good',
            };
          } else {
            const loss = Math.floor(10 + Math.random() * 40);
            SilverManager.add(-loss);
            SilverManager.save();
            return {
              result: `你猛然起身，但那贼人身法极快，你一掌击空——\n等你点燃灯火，包袱已被翻开，银两少了${loss}两！\n窗外传来嘲弄的笑声。\n✦ 银两-${loss}两。`,
              tone: 'bad',
            };
          }
        },
      },
      {
        label: '继续装睡，让他拿走',
        icon: '😶', fn: () => {
          const loss = Math.floor(30 + Math.random() * 60);
          SilverManager.add(-loss);
          SilverManager.save();
          if (typeof travelPlayerState !== 'undefined') {
            travelPlayerState.reputation = Math.max(0, (travelPlayerState.reputation||100) - 3);
            if (typeof travelSave === 'function') travelSave();
          }
          return {
            result: `你继续装睡，听见那人翻动包袱的窸窣声，随后窗户再次轻响。\n等一切安静后，你睁开眼——银子少了${loss}两。\n明枪易躲，暗箭难防。\n✦ 银两-${loss}两，声誉-3。`,
            tone: 'bad',
          };
        },
      },
    ],
  },

  {
    id: 'city_inn_merchant',
    tier: 'rare', trigger: 'inn', weight: 3,
    icon: '💰', title: '深夜访客',
    scene: '客房门被轻叩三声，一个沙哑的声音从门外传来。',
    narration: [
      '"客官，有件稀罕物，不知您感不感兴趣……"',
      '门缝中递入一张泛黄的纸，上面画着一把形状奇特的长剑。',
    ],
    choices: [
      {
        label: '花500两买下这张图',
        icon: '💵', condition: () => SilverManager.has(500),
        fn: () => {
          SilverManager.add(-500);
          SilverManager.save();
          if (typeof edS !== 'undefined' && edS.bag) {
            edS.bag.push({
              instId: 'map_'+Date.now(),
              type: 'collectible', templateId: 'weapon_blueprint_rare',
              name: '稀世神兵残图', icon: '📜', identified: true, affixes: [],
            });
            if (typeof bagSave === 'function') bagSave();
          }
          return {
            result: '你付了银两，来人递入残图便消失于夜色中。\n图上铸剑工艺前所未见——若能找到铸剑师，或可打造出神兵利器！\n✦ 获得【稀世神兵残图】，已存入背包。',
            tone: 'great',
            extraLines: ['✦ 可前往铁匠铺询问「残图铸剑」'],
          };
        },
      },
      {
        label: '不感兴趣，让他离开',
        icon: '🚪', fn: () => {
          return { result: '你摇摇头，来人轻笑一声，收回纸张，脚步声很快消失在走廊尽头。', tone: 'neutral' };
        },
      },
    ],
  },

  // ═══════════════════════════
  //  B. 街头偶遇奇遇
  // ═══════════════════════════

  {
    id: 'city_street_oracle',
    tier: 'rare', trigger: 'street', weight: 4,
    icon: '🔮', title: '街头相士',
    scene: '街角一位白发老相士独坐，身前一张布旗，上书"铁口直断"。',
    narration: [
      '老相士抬头望你，目光深邃如潭。',
      '"这位少侠，容老夫为你算一卦——"',
      '"不收钱，只结缘。"',
    ],
    choices: [
      {
        label: '让他看看手相',
        icon: '🖐️', fn: () => {
          const rolls = Math.random();
          if (rolls < 0.25) {
            // 大吉
            const hpBonus = 10;
            if (typeof edS !== 'undefined') {
              edS.hpMax = (edS.hpMax||100) + hpBonus;
              if (edS.hp) edS.hp = Math.min(edS.hp + hpBonus, edS.hpMax);
              try { localStorage.setItem('wuxia_editor', JSON.stringify(edS)); } catch(e) {}
            }
            if (typeof jianghuState !== 'undefined') {
              jianghuState.reputation = Math.min(200, (jianghuState.reputation||100) + 15);
              if (typeof jhSave === 'function') jhSave();
            }
            return {
              result: '老相士盯着你的掌纹，神情微变。\n"奇了……少侠命格极贵，将来必是一方人物。"\n他用朱笔在你掌心点了一颗痣。\n"这是老夫的点睛之笔，能护你躲过一次大劫。"\n✦ 气血上限+10，江湖声誉+15！获得被动【吉人天相】：每日首次濒死时自动保留1点气血',
              tone: 'great',
              extraLines: ['✦ 被动获得：吉人天相'],
            };
          } else if (rolls < 0.6) {
            // 中吉
            SilverManager.add(50);
            SilverManager.save();
            return {
              result: '老相士点头微笑："少侠命途顺遂，近日有财。"\n他从袖中取出一枚铜钱，放到你掌心："拿好，这是老朽的赠礼。"\n铜钱入手，竟是一枚值五十两的古币。\n✦ 银两+50，江湖声誉+5。',
              tone: 'good',
            };
          } else {
            // 平淡
            return {
              result: '老相士看了你片刻，摇头一笑。\n"时运未至，不必强求。少侠继续走自己的路便是。"\n说完便闭上眼睛，不再多言。',
              tone: 'neutral',
            };
          }
        },
      },
      {
        label: '不迷信，礼貌离开',
        icon: '🚶', fn: () => {
          return { result: '你拱手道谢，转身离去。老相士在身后低声说了一句什么，你没有听清。', tone: 'neutral' };
        },
      },
    ],
  },

  {
    id: 'city_street_lost_child',
    tier: 'common', trigger: 'street', weight: 8,
    icon: '👦', title: '走失孩童',
    scene: '街头人群中，一个小孩正哇哇大哭，身旁无大人看管。',
    narration: [
      '"我要妈妈……我要回家……"',
      '小孩约莫五六岁，衣着考究，不像寻常人家出身。',
    ],
    choices: [
      {
        label: '帮孩子找家人',
        icon: '🤝', fn: () => {
          const bonus = Math.floor(10 + Math.random() * 20);
          if (typeof jianghuState !== 'undefined') {
            jianghuState.reputation = Math.min(200, (jianghuState.reputation||100) + bonus);
            if (typeof jhSave === 'function') jhSave();
          }
          if (typeof travelPlayerState !== 'undefined') {
            travelPlayerState.energy = Math.max(0, (travelPlayerState.energy||80) - 5);
            if (typeof travelSave === 'function') travelSave();
          }
          return {
            result: `你抱起孩子，轻声安抚，一路询问。\n终于在城东一处大户门前，找到了焦急万分的主人——竟是城中一位颇有名望的员外。\n员外千恩万谢，临别时赠你纹银五十两以作答谢。\n✦ 银两+50，侠义名声+${bonus}。`,
            tone: 'good',
          };
        },
      },
      {
        label: '假装没看见',
        icon: '👀', fn: () => {
          return { result: '你摇摇头，加快脚步离开。身后孩子的哭声渐渐远了。\n心中有些不是滋味，但江湖路上，顾不得这许多。', tone: 'neutral' };
        },
      },
    ],
  },

  {
    id: 'city_street_beggar_master',
    tier: 'rare', trigger: 'street', weight: 3,
    icon: '🧓', title: '乞丐中的高手',
    scene: '街角一个蓬头垢面的乞丐正懒洋洋晒太阳，身上酒气熏天。',
    narration: [
      '"小兄弟，过来。"',
      '乞丐眯着眼打量你，忽然咧嘴一笑，露出残缺的牙齿。',
      '"我看你根骨不错，要不要学点真本事？"',
    ],
    choices: [
      {
        label: '恭敬求教',
        icon: '🙏', fn: () => {
          const playerLv = (typeof edS !== 'undefined') ? (edS.level||1) : 1;
          const bonus = Math.min(40, playerLv * 3);
          if (typeof addPlayerExp === 'function') addPlayerExp(bonus, '江湖奇遇');
          if (typeof travelPlayerState !== 'undefined') {
            travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 8);
            if (typeof travelSave === 'function') travelSave();
          }
          return {
            result: `你拱手行礼，乞丐见你懂礼，点了点头。\n他从怀中掏出一只破碗，在你面前敲了三下，碗中竟有真气激荡。\n"记住：最平凡的东西，也能练出最不凡的功夫。"\n说罢翻身便走，转瞬消失在人群中。\n✦ 经验+${bonus}，声名+8，武学感悟提升！`,
            tone: 'great',
            extraLines: ['✦ 感悟：武学之道在于心，不在于器'],
          };
        },
      },
      {
        label: '觉得是骗子，不理会',
        icon: '🚶', fn: () => {
          return { result: '你摇摇头继续赶路，身后传来乞丐的大笑声。', tone: 'neutral' };
        },
      },
    ],
  },

  {
    id: 'city_street_poison_sale',
    tier: 'common', trigger: 'street', weight: 5,
    icon: '💊', title: '街边药贩',
    scene: '街角一个尖嘴猴腮的汉子正在摆摊，摊上摆满了各色药粉药丸。',
    narration: [
      '"灵丹妙药！包治百病！错过这村没这店啦！"',
      '"大哥，来一包？绝对好东西！"',
    ],
    choices: [
      {
        label: '买一包试试（30两）',
        icon: '💊', condition: () => SilverManager.has(30),
        fn: () => {
          SilverManager.add(-30);
          SilverManager.save();
          const roll = Math.random();
          if (roll < 0.35) {
            // 好药
            if (typeof edS !== 'undefined' && edS.bag) {
              edS.bag.push({
                instId: 'potion_'+Date.now(), type: 'consumable',
                templateId: 'potion_good', name: '回春丹', icon: '💊',
                identified: true, affixes: [{key:'hpRestore', value:50}],
                effect: { hp: 50 },
              });
              if (typeof bagSave === 'function') bagSave();
            }
            return { result: '你花30两买了一包药粉，回去一试，竟是上好的回春散！\n✦ 获得【回春丹】（使用后恢复气血50%）', tone: 'good' };
          } else if (roll < 0.7) {
            // 无效
            return { result: '药粉下肚，什么感觉都没有。\n✦ 30两打了水漂。', tone: 'bad' };
          } else {
            // 坏药
            if (typeof travelPlayerState !== 'undefined') {
              travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 15);
              if (typeof travelSave === 'function') travelSave();
            }
            return { result: '药粉入腹，顿觉腹痛如绞！\n那汉子早已趁乱逃走，你扶着墙缓了半天，脸色发青。\n✦ 气血-15%（中毒）', tone: 'bad' };
          }
        },
      },
      {
        label: '看出是假药，举报',
        icon: '👮', fn: () => {
          const bonus = 10;
          if (typeof jianghuState !== 'undefined') {
            jianghuState.reputation = Math.min(200, (jianghuState.reputation||100) + bonus);
            if (typeof jhSave === 'function') jhSave();
          }
          return {
            result: '你招手叫来巡逻的衙役，那汉子见势不妙，撒腿就跑。\n却被衙役一把抓住，一番审讯之下，果然是个惯骗。\n围观百姓纷纷叫好。\n✦ 侠义名声+10。',
            tone: 'good',
          };
        },
      },
    ],
  },

  {
    id: 'city_street_drunken_master',
    tier: 'rare', trigger: 'street', weight: 3,
    icon: '🍶', title: '醉剑仙',
    scene: '酒楼门口，一个醉汉正抱着一坛酒，踉踉跄跄，口中念念有词。',
    narration: [
      '"一剑……破……万法……"',
      '醉汉忽然身形一晃，手中酒坛飞出——你本能闪避，却见他已稳稳落地。',
      '"好身法。"他眯着眼瞧你，"小子，你是来抢我酒喝的？"',
    ],
    choices: [
      {
        label: '上前请教，以酒会友',
        icon: '🍶', fn: () => {
          const bonus = Math.floor(15 + Math.random() * 25);
          if (typeof addPlayerExp === 'function') addPlayerExp(bonus, '江湖奇遇');
          if (typeof travelPlayerState !== 'undefined') {
            travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 5);
            if (typeof travelSave === 'function') travelSave();
          }
          return {
            result: `你请他喝酒，他也不客气，接过便灌。\n三坛下肚，他忽然拍案大笑："你这小子，有点意思！"\n借着酒意，他随手比划了几式剑法——虽凌乱，却暗藏玄机！\n"记住：无招胜有招。"\n✦ 经验+${bonus}，声名+5，剑道感悟！`,
            tone: 'great',
            extraLines: ['✦ 感悟：剑意在于心，无招胜有招'],
          };
        },
      },
      {
        label: '不与醉汉纠缠，绕道走',
        icon: '🚶', fn: () => {
          return { result: '你摇摇头，绕开醉汉继续赶路。身后传来他的笑声："走得好！江湖再见！"', tone: 'neutral' };
        },
      },
    ],
  },

  // ═══════════════════════════
  //  C. 进城时触发奇遇
  // ═══════════════════
  {
    id: 'city_enter_tomb_discovery',
    tier: 'rare', trigger: 'enter', weight: 2,
    icon: '⚱️', title: '古城墙根的异响',
    scene: '你刚踏入城门，忽闻城墙根传来一阵异响，像是有什么东西在土里翻动。',
    narration: [
      '走近一看，是一处刚被雨水冲开的洞口，露出半截石棺。',
      '石棺缝隙中透出微光，似乎藏着什么。',
    ],
    choices: [
      {
        label: '好奇心驱使，下洞探查',
        icon: '🕳️', fn: () => {
          const success = Math.random() < 0.5;
          if (success) {
            const silver = Math.floor(80 + Math.random() * 200);
            SilverManager.add(silver);
            SilverManager.save();
            if (typeof edS !== 'undefined' && edS.bag) {
              edS.bag.push({
                instId: 'relic_'+Date.now(), type: 'accessory',
                templateId: 'antique_token', name: '古铜令牌', icon: '🏅',
                identified: true, affixes: [{key:'repBonus', value:5}],
              });
              if (typeof bagSave === 'function') bagSave();
            }
            return {
              result: `你钻进洞口，石棺中竟藏有前人陪葬的金银器物！\n你小心取出一部分，带走了${silver}两银子，并获得一枚古铜令牌。\n据说是某位前辈的遗物，持有者可增加江湖声望。\n✦ 银两+${silver}，获得【古铜令牌】（佩戴后声誉+5/日）`,
              tone: 'great',
              extraLines: ['✦ 道具已存入背包'],
            };
          } else {
            if (typeof travelPlayerState !== 'undefined') {
              travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 20);
              if (typeof travelSave === 'function') travelSave();
            }
            return {
              result: `你钻进洞口，石棺中忽然飞出一群毒蜂！\n你被打得抱头鼠窜，好不容易逃出洞口，浑身是包。\n"晦气！"你骂道。\n✦ 气血-20%（毒蜂蛰伤）`,
              tone: 'bad',
            };
          }
        },
      },
      {
        label: '觉得不祥，转身离开',
        icon: '🚪', fn: () => {
          return { result: '你摇摇头，转身离开。身后似有微风拂过，带来一阵低语——不知是风声，还是别的什么。', tone: 'neutral' };
        },
      },
    ],
  },

  {
    id: 'city_enter_escort_request',
    tier: 'common', trigger: 'enter', weight: 6,
    icon: '📦', title: '镖师求援',
    scene: '城门内侧，几名镖师正急得团团转，领头的老镖头面露难色。',
    narration: [
      '"这位壮士！"老镖头见你气度不凡，连忙迎上来。',
      '"我们镖队缺人手，不知壮士可否帮忙护送一程？"',
    ],
    choices: [
      {
        label: '接受护送请求',
        icon: '⚔',         fn: () => {
          // 关闭奇遇弹窗，直接从事件触发押镖（随机选路线，跳过镖局接单界面）
          document.querySelectorAll('.city-enc-modal').forEach(el => el.remove());
          const cityId = (typeof travelCurrentCity !== 'undefined') ? travelCurrentCity : 'kaifeng';
          if (typeof escortStartFromEvent === 'function') {
            escortStartFromEvent(cityId);
          } else if (typeof openEscortGame === 'function') {
            openEscortGame(cityId);
          } else {
            if (typeof showToast === 'function') showToast('护镖系统加载中...');
          }
          return null;
        },
      },
      {
        label: '婉言谢绝，赶路要紧',
        icon: '🚶', fn: () => {
          return { result: '你拱手告退。老镖头眼中闪过一丝失望，叹了口气，目送你离开。', tone: 'neutral' };
        },
      },
    ],
  },

];

// ── 抽取可用城市奇遇 ──────────────────────────────────────────────
function _pickCityEncounter(trigger, tier) {
  loadCityEncState();
  const candidates = CITY_ENCOUNTER_DB.filter(e => {
    if (e.trigger !== trigger && trigger !== 'any') return false;
    if (!_cityEncConditionOk(e)) return false;
    if (_cityEncState.triggeredIds.includes(e.id)) return false;
    return true;
  });
  if (!candidates.length) return null;
  const total = candidates.reduce((s, e) => s + (e.weight || 1), 0);
  let r = Math.random() * total;
  for (const enc of candidates) { r -= (enc.weight || 1); if (r <= 0) return enc; }
  return candidates[0];
}

// ── 触发城市奇遇 ────────────────────────────────────────────────
function triggerCityEncounter(trigger, probability) {
  if (!probability) probability = 0.10;

  // ═══════════════════════════════════════════════════════════════
  //  城市奇遇"将将胡"系统 - 特殊事件优先检查
  // ═══════════════════════════════════════════════════════════════
  // 先检查是否触发特殊"将将胡"事件（概率独立于普通奇遇）
  for (const [key, event] of Object.entries(CITY_ENC_JIANGHU_EVENTS)) {
    if (Math.random() < event.chance) {
      // 触发将将胡事件
      const result = event.effect();
      _showJianghuEventModal(event, result);
      _cityEncState.pityCount = 0;
      saveCityEncState();
      return true;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  保底机制：连续5次未触发 → 第6次必触发
  // ═══════════════════════════════════════════════════════════════
  const PITY_THRESHOLD = 5;
  const isPity = _cityEncState.pityCount >= PITY_THRESHOLD;

  // 应用黄历修正（吉日增加触发概率，凶日降低）
  let finalProb = probability;
  if (typeof getAlmanacModifier === 'function' && typeof edS !== 'undefined') {
    finalProb *= getAlmanacModifier(edS, 'good');
  }

  // 保底时100%触发，否则按概率
  if (!isPity && Math.random() > finalProb) {
    _cityEncState.pityCount++;
    saveCityEncState();
    return false;
  }

  if (!_cityEncDailyOk(trigger)) return false;
  if (!_cityEncCooldownOk(trigger)) return false;

  const enc = _pickCityEncounter(trigger, null);
  if (!enc) return false;

  // 记录触发
  _cityEncState.triggeredIds.push(enc.id);
  if (trigger === 'inn') { _cityEncState.todayInnCount++; _cityEncState.lastInnEnc = Date.now(); }
  if (trigger === 'street') { _cityEncState.todayStreetCount++; _cityEncState.lastStreetEnc = Date.now(); }
  _cityEncState.pityCount = 0; // 触发成功，重置保底
  saveCityEncState();

  showCityEncounterModal(enc);
  return true;
}

// ═══════════════════════════════════════════════════════════════
//  城市奇遇"将将胡"系统 - 显示特殊事件弹窗
// ═══════════════════════════════════════════════════════════════
function _showJianghuEventModal(event, result) {
  document.querySelectorAll('.city-enc-modal').forEach(el => el.remove());

  const modal = document.createElement('div');
  modal.className = 'city-enc-modal';
  modal.innerHTML = `
    <div class="city-enc-box city-enc-jianghu" style="--tier-color:#ffd060;border-color:#ffd060;">
      <div class="city-enc-header">
        <span class="city-enc-tier" style="color:#ffd060;border-color:#ffd060">将将胡</span>
        <span class="city-enc-icon">${event.icon}</span>
        <span class="city-enc-title">${event.title}</span>
      </div>
      <div class="city-enc-scene">${event.desc}</div>
      <div class="city-enc-result-text" style="color:${result.tone === 'great' ? '#ffd060' : result.tone === 'good' ? '#60e890' : result.tone === 'bad' ? '#ff6060' : '#c8b478'};margin:15px 0;padding:12px;background:rgba(255,255,255,.05);border-radius:8px;">
        ${result.result.replace(/\n/g, '<br>')}
      </div>
      <button class="city-enc-ok-btn" onclick="this.closest('.city-enc-modal').remove()">继续前行</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// ── 触发入口（供 town.html 调用）──
function cityEncOnEnter(cityId) {
  // 进城时 8% 概率触发
  triggerCityEncounter('enter', 0.08);
}

function cityEncOnInnRest() {
  // 客栈留宿时 20% 概率触发
  const triggered = triggerCityEncounter('inn', 0.20);
  // 无论是否触发，客栈留宿原有功能继续执行
}

function cityEncOnStreetWalk() {
  // ── 闲逛消耗 ──
  // ① 精力消耗：每次闲逛消耗 15 点精力
  if (typeof travelPlayerState !== 'undefined') {
    const energyCost = 15;
    if ((travelPlayerState.energy || 0) < energyCost) {
      if (typeof townToast === 'function') townToast('😮‍💨 精力不济，先歇歇吧……');
      return;
    }
    travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - energyCost);

    // ② 饱食/口渴消耗：每次闲逛扣 8 点
    travelPlayerState.food = Math.max(0, (travelPlayerState.food ?? 100) - 8);
    travelPlayerState.water = Math.max(0, (travelPlayerState.water ?? 100) - 6);

    // ③ 推进游戏时间：闲逛约半天，每 2 次算 1 天
    if (!_cityEncState._walkCount) _cityEncState._walkCount = 0;
    _cityEncState._walkCount++;
    // 使用武侠日历系统推进时间
    if (_cityEncState._walkCount % 2 === 0 && typeof edS !== 'undefined' && typeof advanceWuxiaDate === 'function') {
      advanceWuxiaDate(edS, 1);
      if (typeof saveGameState === 'function') saveGameState();
    }

    // 保存旅行状态
    if (typeof travelSave === 'function') travelSave();

    // 刷新 town 状态栏
    if (typeof townRefreshStatus === 'function') setTimeout(townRefreshStatus, 100);
  }

  // ── 奇遇判定：10% 概率触发 ──
  const triggered = triggerCityEncounter('street', 0.10);
  if (!triggered && typeof townToast === 'function') {
    // 随机给一个江湖感的"没遇到奇遇"提示
    const misses = [
      '街头人来人往，今日无缘……',
      '走了一圈，江湖平静如水。',
      '或许该去别处走走……',
      '机缘未到，暂且记下。',
      '城中热闹，却无特别偶遇。',
    ];
    townToast(misses[Math.floor(Math.random() * misses.length)]);
  }
}

// ── 城市奇遇弹窗 UI ─────────────────────────────────────────────
let _curCityEnc = null;

function showCityEncounterModal(enc) {
  document.querySelectorAll('.city-enc-modal').forEach(el => el.remove());
  _curCityEnc = enc;
  // 推入纪事滚动条
  try { if (typeof tickerAddEncounter === 'function') tickerAddEncounter(enc); } catch(e) {}

  const tierBadge = {
    common:     { label:'寻常', color:'#a0a0a0' },
    rare:       { label:'珍稀', color:'#60b8ff' },
    legendary:  { label:'命运', color:'#ffd060' },
  }[enc.tier || 'common'];

  const narrateHtml = (enc.narration || []).map(line =>
    `<div class="city-enc-narrate">${line}</div>`
  ).join('');

  const choicesHtml = enc.choices.map((c, i) => {
    const disabled = c.condition && !c.condition();
    const hint = disabled ? ' <span class="city-enc-btn-hint">（条件不足）</span>' : '';
    return `<button class="city-enc-choice ${disabled?'disabled':''}"
      onclick="_cityEncChoose(${i})" ${disabled?'disabled':''}>
      ${c.icon} ${c.label}${hint}
    </button>`;
  }).join('');

  const modal = document.createElement('div');
  modal.className = 'city-enc-modal';
  modal.innerHTML = `
    <div class="city-enc-box" style="--tier-color:${tierBadge.color}">
      <div class="city-enc-header">
        <span class="city-enc-tier" style="color:${tierBadge.color};border-color:${tierBadge.color}">${tierBadge.label}</span>
        <span class="city-enc-icon">${enc.icon}</span>
        <span class="city-enc-title">${enc.title}</span>
      </div>
      <div class="city-enc-scene">${enc.scene}</div>
      <div class="city-enc-narrate-wrap">${narrateHtml}</div>
      <div class="city-enc-choices">${choicesHtml}</div>
      <div class="city-enc-footer">🌙 江湖之大，缘分难测</div>
    </div>`;
  document.body.appendChild(modal);
}

// ── 选择结果处理 ───────────────────────────────────────────────
function _cityEncChoose(idx) {
  const enc = _curCityEnc;
  if (!enc || !enc.choices[idx]) return;
  document.querySelectorAll('.city-enc-modal').forEach(el => el.remove());

  const choice = enc.choices[idx];
  let result = {};
  try { result = choice.fn() || {}; } catch(e) { result = { result: '发生错误……', tone: 'neutral' }; }

  const toneColor = { great: '#ffd060', good: '#60e890', neutral: '#c8b478', bad: '#ff6060' }[result.tone] || '#c8b478';
  const extraLinesHtml = (result.extraLines || []).map(l =>
    `<div class="city-enc-extra">${l}</div>`
  ).join('');

  const overlay = document.createElement('div');
  overlay.className = 'city-enc-modal';
  overlay.innerHTML = `
    <div class="city-enc-box city-enc-result" style="--tier-color:${toneColor}">
      <div class="city-enc-result-text">${(result.result || '').replace(/\n/g, '<br>')}</div>
      ${extraLinesHtml}
      <button class="city-enc-ok-btn" onclick="this.closest('.city-enc-modal').remove()">继续前行</button>
    </div>`;
  document.body.appendChild(overlay);

  _curCityEnc = null;
}

// ── 注入样式 ─────────────────────────────────────────────────
(function _injectCityEncStyles() {
  if (document.getElementById('city-enc-styles')) return;
  const s = document.createElement('style');
  s.id = 'city-enc-styles';
  s.textContent = `
  .city-enc-modal {
    position:fixed; inset:0; z-index:9600; background:rgba(0,0,0,.80);
    display:flex; align-items:center; justify-content:center;
    animation: ceIn .35s cubic-bezier(.2,.8,.4,1);
  }
  @keyframes ceIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
  .city-enc-box {
    background:linear-gradient(160deg,#1c1008,#241508);
    border:1px solid rgba(200,140,60,.3);
    border-radius:14px; padding:22px 24px;
    width:min(380px,92vw); max-height:88vh; overflow-y:auto;
    box-shadow:0 12px 48px rgba(0,0,0,.7);
  }
  .city-enc-result { border-color:var(--tier-color,rgba(200,140,60,.3)); }
  .city-enc-header { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .city-enc-tier {
    font-size:10px; padding:2px 8px; border-radius:20px; border:1px solid;
    letter-spacing:1px;
  }
  .city-enc-icon { font-size:24px; }
  .city-enc-title { font-size:17px; font-weight:700; color:rgba(255,220,140,.9); }
  .city-enc-scene {
    background:rgba(255,255,255,.04); border-radius:8px;
    padding:10px 14px; font-size:13px; color:rgba(220,200,160,.85);
    margin-bottom:12px; line-height:1.7; font-style:italic;
  }
  .city-enc-narrate-wrap { margin-bottom:14px; }
  .city-enc-narrate {
    font-size:13px; color:rgba(200,185,150,.75); line-height:1.8;
    margin-bottom:6px; padding-left:10px; border-left:2px solid rgba(200,160,80,.25);
  }
  .city-enc-choices { display:flex; flex-direction:column; gap:8px; }
  .city-enc-choice {
    padding:10px 16px; border-radius:8px; border:1px solid rgba(200,140,60,.3);
    background:rgba(255,255,255,.04); color:rgba(220,200,160,.9);
    font-size:13px; font-family:inherit; text-align:left;
    cursor:pointer; transition:background .15s, border-color .15s;
  }
  .city-enc-choice:hover:not(.disabled) {
    background:rgba(200,140,60,.12); border-color:rgba(200,140,60,.5);
  }
  .city-enc-choice.disabled { opacity:.4; cursor:not-allowed; }
  .city-enc-btn-hint { color:rgba(160,160,160,.6); font-size:11px; }
  .city-enc-footer {
    text-align:center; margin-top:16px; font-size:11px;
    color:rgba(160,140,100,.35); letter-spacing:2px;
  }
  .city-enc-result-text {
    font-size:13px; color:rgba(220,200,160,.9); line-height:1.8;
    margin-bottom:14px; white-space:pre-line;
  }
  .city-enc-extra {
    font-size:12px; color:var(--tier-color,rgba(255,220,140,.7));
    padding:4px 10px; background:rgba(255,255,255,.04);
    border-radius:6px; margin-bottom:6px;
  }
  .city-enc-ok-btn {
    width:100%; padding:10px; border-radius:8px; border:1px solid rgba(200,140,60,.3);
    background:rgba(200,140,60,.15); color:rgba(255,220,140,.9);
    font-size:13px; font-family:inherit; cursor:pointer;
    margin-top:8px;
  }
  .city-enc-ok-btn:hover { background:rgba(200,140,60,.25); }
  `;
  document.head.appendChild(s);
})();

// ── 全局暴露 ─────────────────────────────────────────────────
window.cityEncOnEnter   = cityEncOnEnter;
window.cityEncOnInnRest = cityEncOnInnRest;
window.cityEncOnStreetWalk = cityEncOnStreetWalk;
