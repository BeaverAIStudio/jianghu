// travel-encounters.js — 江湖奇遇事件系统 v1.0
// 带叙事分支的深度随机事件，由 travelMoveTo 以10%额外概率触发
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  奇遇层级系统
//  tier:  common(普通) | rare(稀有) | legendary(命运)
//  每日上限：common=3, rare=1, legendary=0(靠特殊条件触发)
//  CD：同类型奇遇冷却24小时（避免重复）
// ═══════════════════════════════════════════════════════════════

const ENC_TIER = { COMMON: 'common', RARE: 'rare', LEGENDARY: 'legendary' };
const ENC_DAILY_LIMIT = { common: 3, rare: 1, legendary: 0 }; // legendary靠条件触发，不算日常
const ENC_CD_HOURS    = { common: 2,  rare: 12, legendary: 24 };

// ═══════════════════════════════════════════════════════════════
//  "将将胡"奇遇连庄系统：好运/霉运会连锁
// ═══════════════════════════════════════════════════════════════
// ── 奇遇状态（localStorage 持久化）──
const ENC_STATE_KEY = 'wuxia_encounter_state';
let _encState = {
  lastDate:      '',      // 'YYYY-MM-DD' 跨日重置
  dailyCommon:   0,       // 今日普通奇遇次数
  dailyRare:     0,       // 今日稀有奇遇次数
  lastCommon:    0,       // 上次普通奇遇时间戳
  lastRare:      0,       // 上次稀有奇遇时间戳
  lastLegendary: 0,       // 上次传说奇遇时间戳
  triggered:     [],     // 今日已触发过的奇遇ID（避免重复弹同一事件）
  // 连庄状态
  streakType:    null,    // 'good' | 'bad' | null
  streakCount:   0,       // 连庄次数
  streakBonus:   0,       // 当前连庄加成（百分比）
};

// ── 连庄配置 ──
const STREAK_CONFIG = {
  good: {
    chanceBonus: 0.05,    // 每次好连庄+5%触发概率
    maxBonus: 0.25,       // 最高+25%
    rareBonus: 0.08,      // 稀有奇遇概率+8%
  },
  bad: {
    chancePenalty: 0.03,  // 每次霉连庄-3%触发概率
    maxPenalty: 0.15,     // 最高-15%
    trapChance: 0.10,     // 10%概率遇到陷阱（变坏事）
  }
};

// ── 更新连庄状态 ──
function _updateStreak(isGood){
  const type = isGood ? 'good' : 'bad';
  if(_encState.streakType === type){
    _encState.streakCount++;
  } else {
    _encState.streakType = type;
    _encState.streakCount = 1;
  }
  
  // 计算加成
  if(type === 'good'){
    _encState.streakBonus = Math.min(
      STREAK_CONFIG.good.maxBonus,
      _encState.streakCount * STREAK_CONFIG.good.chanceBonus
    );
  } else {
    _encState.streakBonus = -Math.min(
      STREAK_CONFIG.bad.maxPenalty,
      _encState.streakCount * STREAK_CONFIG.bad.chancePenalty
    );
  }
  
  saveEncState();
  
  // 显示连庄提示
  if(_encState.streakCount >= 3){
    const msg = type === 'good' 
      ? `🔥 鸿运当头！连续${_encState.streakCount}次奇遇，触发概率+${Math.round(_encState.streakBonus*100)}%！`
      : `🌧️ 霉运连连…连续${_encState.streakCount}次不顺，奇遇概率${Math.round(_encState.streakBonus*100)}%`;
    if(typeof showToast === 'function') showToast(msg);
  }
}

function loadEncState() {
  try {
    const raw = localStorage.getItem(ENC_STATE_KEY);
    if (raw) _encState = JSON.parse(raw);
    const today = _todayStr();
    if (_encState.lastDate !== today) {
      _encState.dailyCommon = 0;
      _encState.dailyRare   = 0;
      _encState.triggered   = [];
      _encState.lastDate    = today;
      saveEncState();
    }
  } catch (e) { _resetEncState(); }
}

function saveEncState() {
  localStorage.setItem(ENC_STATE_KEY, JSON.stringify(_encState));
}

function _resetEncState() {
  _encState = { lastDate: _todayStr(), dailyCommon: 0, dailyRare: 0,
    lastCommon: 0, lastRare: 0, lastLegendary: 0, triggered: [] };
}

function _todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function _encCooldownOk(tier) {
  const now = Date.now();
  const cdHours = ENC_CD_HOURS[tier] || 24;
  if (tier === ENC_TIER.COMMON)   return now - _encState.lastCommon   > cdHours * 3600000;
  if (tier === ENC_TIER.RARE)     return now - _encState.lastRare     > cdHours * 3600000;
  if (tier === ENC_TIER.LEGENDARY) return now - _encState.lastLegendary > cdHours * 3600000;
  return true;
}

function _encDailyOk(tier) {
  if (tier === ENC_TIER.COMMON)   return _encState.dailyCommon   < ENC_DAILY_LIMIT.common;
  if (tier === ENC_TIER.RARE)     return _encState.dailyRare     < ENC_DAILY_LIMIT.rare;
  return true; // legendary 不计日常次数
}

function _encConditionOk(enc) {
  if (!enc.condition) return true;
  try { return enc.condition(); } catch (e) { return false; }
}

/** 过滤并抽取可用的奇遇（支持层级选择） */
function _pickEncounterEvent(preferTier) {
  loadEncState();
  const now = Date.now();
  const candidates = ENCOUNTER_DB.filter(e => {
    const tier = e.tier || ENC_TIER.COMMON;
    // 传说奇遇只接受条件触发（preferTier='legendary' 才放行）
    if (tier === ENC_TIER.LEGENDARY && preferTier !== ENC_TIER.LEGENDARY) return false;
    if (!_encDailyOk(tier)) return false;
    if (!_encCooldownOk(tier)) return false;
    if (_encState.triggered.includes(e.id)) return false;
    if (!_encConditionOk(e)) return false;
    return true;
  });
  if (!candidates.length) return null;
  const total = candidates.reduce((s, e) => s + (e.weight || 1), 0);
  let r = Math.random() * total;
  for (const enc of candidates) {
    r -= (enc.weight || 1);
    if (r <= 0) return enc;
  }
  return candidates[0];
}

function _markEncounterTriggered(enc) {
  const tier = enc.tier || ENC_TIER.COMMON;
  const today = _todayStr();
  if (_encState.lastDate !== today) {
    _encState.dailyCommon = 0;
    _encState.dailyRare   = 0;
    _encState.triggered   = [];
    _encState.lastDate    = today;
  }
  if (tier === ENC_TIER.COMMON) {
    _encState.dailyCommon++;
    _encState.lastCommon = Date.now();
  } else if (tier === ENC_TIER.RARE) {
    _encState.dailyRare++;
    _encState.lastRare = Date.now();
  } else {
    _encState.lastLegendary = Date.now();
  }
  if (!_encState.triggered.includes(enc.id)) _encState.triggered.push(enc.id);
  saveEncState();
}

// ═══════════════════════════════════════════════════════════════
//  旅行奇遇"将将胡"系统 - 特殊随机事件（扩展版）
// ═══════════════════════════════════════════════════════════════
const TRAVEL_JIANGHU_EVENTS = [
  // 原有事件
  {
    id: 'travel_windfall',
    chance: 0.015, // 1.5%
    icon: '💎',
    title: '天降横财',
    desc: '路边草丛中闪过一道金光...',
    effect: () => {
      const silver = 100 + Math.floor(Math.random() * 200);
      if (typeof SilverManager !== 'undefined') {
        SilverManager.add(silver);
        SilverManager.save();
      }
      return { result: `你发现了一个被遗忘的宝箱，里面有 ${silver} 两银子！\n✦ 天降横财！`, tone: 'great' };
    }
  },
  {
    id: 'travel_disaster',
    chance: 0.02, // 2%
    icon: '🌪️',
    title: '天降劫难',
    desc: '天色突变，狂风大作...',
    effect: () => {
      const dmg = 10 + Math.floor(Math.random() * 20);
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - dmg);
        if (typeof travelSave === 'function') travelSave();
      }
      return { result: `一场突如其来的暴风雨让你狼狈不堪，精力-${dmg}。\n✦ 霉运当头...`, tone: 'bad' };
    }
  },
  {
    id: 'travel_patron',
    chance: 0.01, // 1%
    icon: '🐎',
    title: '贵人相助',
    desc: '一匹快马从身后赶来，马上之人喊道："前面的朋友，要不要搭个顺风车？"',
    effect: () => {
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.energy = Math.min(100, (travelPlayerState.energy || 100) + 30);
        travelPlayerState.food = Math.min(100, (travelPlayerState.food || 100) + 20);
        travelPlayerState.water = Math.min(100, (travelPlayerState.water || 100) + 20);
        if (typeof travelSave === 'function') travelSave();
      }
      return { result: `你搭上了商队的顺风车，不仅节省了精力，还获得了食物和水！\n✦ 贵人相助！精力+30，饱食度+20，口渴度+20`, tone: 'great' };
    }
  },
  {
    id: 'travel_treasure_map',
    chance: 0.008, // 0.8%
    icon: '🗺️',
    title: '藏宝图',
    desc: '一个衣衫褴褛的老乞丐拦住你："少侠，这张图我留着没用，送给你吧..."',
    effect: () => {
      if (typeof craftBagAdd === 'function') craftBagAdd('item_treasure_map', 1);
      return { result: `你获得了一张神秘的藏宝图！\n✦ 据说指向某个地下城的隐藏宝藏...`, tone: 'rare' };
    }
  },
  // 新增事件
  {
    id: 'travel_mystic_fog',
    chance: 0.012, // 1.2%
    icon: '🌫️',
    title: '迷雾幻境',
    desc: '前方的道路突然被浓雾笼罩，雾中似乎有人影闪动...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.5) {
        // 好事
        if (typeof edS !== 'undefined') {
          edS.luk = (edS.luk || 10) + 2;
          if (typeof edSave === 'function') edSave();
        }
        return { result: `雾中走出一位仙人，在你额头一点："小子，送你一点机缘。"\n✦ 运气永久+2！`, tone: 'legendary' };
      } else {
        // 坏事
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - 25);
        }
        return { result: `你在雾中迷失了方向，走了许多冤枉路...\n✦ 精力-25`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_fallen_warrior',
    chance: 0.01, // 1%
    icon: '⚔️',
    title: '前人遗骸',
    desc: '路边草丛中发现一具骸骨，身旁散落着兵器和行囊...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.4) {
        // 获得武器
        const weapons = ['wep_iron_sword', 'wep_steel_blade', 'wep_bronze_spear'];
        const weapon = weapons[Math.floor(Math.random() * weapons.length)];
        if (typeof craftBagAdd === 'function') craftBagAdd(weapon, 1);
        return { result: `你在遗骸旁发现了一把尚可使用的兵器！\n✦ 获得武器！`, tone: 'good' };
      } else if (roll < 0.7) {
        // 获得银两
        const silver = 50 + Math.floor(Math.random() * 100);
        if (typeof SilverManager !== 'undefined') SilverManager.add(silver);
        return { result: `你搜刮了遗骸的行囊，找到了一些盘缠。\n✦ 获得 ${silver} 两银子`, tone: 'good' };
      } else {
        // 陷阱
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.hp = Math.max(0, (travelPlayerState.hp || 100) - 15);
        }
        return { result: `你翻动遗骸时触发了暗器机关！\n✦ 气血-15，下次要小心...`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_wandering_merchant',
    chance: 0.015, // 1.5%
    icon: '🧳',
    title: '行脚商人',
    desc: '一个背着大包袱的商人拦住了你："客官，要不要看看我的货？都是稀罕物！"',
    effect: () => {
      // 随机打折购买机会
      const discount = 0.5 + Math.random() * 0.4; // 5-9折
      const discountText = Math.round((1 - discount) * 100);
      return { 
        result: `行脚商人给了你特别优惠，所有商品${discountText}% off！\n✦ 限时购物机会！`, 
        tone: 'good',
        merchantDiscount: discount 
      };
    }
  },
  {
    id: 'travel_bandit_ambush',
    chance: 0.018, // 1.8%
    icon: '🏴‍☠️',
    title: '山贼埋伏',
    desc: '道路两侧的灌木丛中突然窜出几个蒙面人！',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.3) {
        // 战斗胜利（简化处理）
        const silver = 30 + Math.floor(Math.random() * 50);
        if (typeof SilverManager !== 'undefined') SilverManager.add(silver);
        return { result: `你击退了山贼，并从他们身上搜刮了一些财物！\n✦ 获得 ${silver} 两银子`, tone: 'good' };
      } else if (roll < 0.7) {
        // 破财消灾
        const loss = 20 + Math.floor(Math.random() * 30);
        if (typeof SilverManager !== 'undefined') SilverManager.spend(loss);
        return { result: `你交出 ${loss} 两银子，山贼放你过去了...\n✦ 破财消灾`, tone: 'bad' };
      } else {
        // 受伤
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.hp = Math.max(0, (travelPlayerState.hp || 100) - 20);
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - 15);
        }
        return { result: `你拼死杀出重围，但受了不轻的伤...\n✦ 气血-20，精力-15`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_meditation_spot',
    chance: 0.01, // 1%
    icon: '🧘',
    title: '灵气汇聚',
    desc: '你来到一处山清水秀之地，感觉这里的灵气格外浓郁...',
    effect: () => {
      if (typeof edS !== 'undefined') {
        const mpGain = 30 + Math.floor(Math.random() * 20);
        edS.mp = Math.min(edS.maxMp || 150, (edS.mp || 0) + mpGain);
        if (typeof edSave === 'function') edSave();
      }
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.energy = Math.min(100, (travelPlayerState.energy || 100) + 20);
      }
      return { result: `你在此地打坐冥想，内力充盈，精神焕发！\n✦ 内力+${30 + Math.floor(Math.random() * 20)}，精力+20`, tone: 'great' };
    }
  },
  {
    id: 'travel_stray_animal',
    chance: 0.014, // 1.4%
    icon: '🐕',
    title: '流浪灵兽',
    desc: '一只看起来颇有灵性的动物跟上了你...',
    effect: () => {
      const animals = [
        { name: '灵狐', buff: 'luk', val: 3, desc: '运气+3（持续到下次战斗）' },
        { name: '灵犬', buff: 'spd', val: 2, desc: '速度+2（持续到下次战斗）' },
        { name: '灵猫', buff: 'crit', val: 5, desc: '暴击率+5%（持续到下次战斗）' },
      ];
      const animal = animals[Math.floor(Math.random() * animals.length)];
      return { result: `一只${animal.name}决定跟随你一段时间！\n✦ ${animal.desc}`, tone: 'good', animalBuff: animal };
    }
  },
  // ═══════════════════════════════════════════════════════════════
  //  宠物获取事件
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'travel_pet_wolf_pup',
    chance: 0.008, // 0.8%
    icon: '🐺',
    title: '狼崽跟随',
    desc: '路边草丛中传来微弱的呜咽声，一只小狼崽正可怜巴巴地望着你...',
    effect: () => {
      if (typeof petAdd === 'function') {
        const result = petAdd('wolf');
        if (result.success) {
          return { result: `🐺 小狼崽摇着尾巴跟上了你！它看起来很忠诚。\n✦ 获得宠物【苍狼】！`, tone: 'great' };
        }
      }
      return { result: `🐺 小狼崽犹豫了一下，转身跑回了森林。\n✦ 也许缘分未到...`, tone: 'neutral' };
    }
  },
  {
    id: 'travel_pet_bunny',
    chance: 0.012, // 1.2%
    icon: '🐰',
    title: '灵兔现身',
    desc: '一只雪白的兔子突然从草丛中跳出，它额头上有一个奇怪的金色印记...',
    effect: () => {
      if (typeof petAdd === 'function') {
        const result = petAdd('bunny');
        if (result.success) {
          return { result: `🐰 灵兔温顺地蹭了蹭你的腿，决定跟随你！\n✦ 获得宠物【灵兔】！`, tone: 'great' };
        }
      }
      return { result: `🐰 灵兔看了你一眼，蹦蹦跳跳地消失在草丛中。\n✦ 它好像不太喜欢你...`, tone: 'neutral' };
    }
  },
  {
    id: 'travel_pet_squirrel',
    chance: 0.015, // 1.5%
    icon: '🐿️',
    title: '贪吃松鼠',
    desc: '一只松鼠正在偷吃你的干粮，被发现了也不跑，反而眼巴巴地看着你...',
    effect: () => {
      if (typeof petAdd === 'function') {
        const result = petAdd('squirrel');
        if (result.success) {
          return { result: `🐿️ "好吧，看你这么可爱，跟我走吧。"\n✦ 获得宠物【松鼠】！`, tone: 'good' };
        }
      }
      return { result: `🐿️ 松鼠抱着干粮跑了，只给你留下一个背影。\n✦ 下次要看紧食物！`, tone: 'bad' };
    }
  },
  {
    id: 'travel_pet_turtle',
    chance: 0.006, // 0.6%
    icon: '🐢',
    title: '千年玄龟',
    desc: '路边一块"石头"突然动了，原来是一只巨大的乌龟，它的龟壳上刻满了古老的符文...',
    effect: () => {
      if (typeof petAdd === 'function') {
        const result = petAdd('turtle');
        if (result.success) {
          return { result: `🐢 玄龟缓缓点头，似乎认可了你。它爬行的速度比你想象中快多了！\n✦ 获得宠物【玄龟】！`, tone: 'legendary' };
        }
      }
      return { result: `🐢 玄龟看了你一眼，又缩回壳中不动了。\n✦ 它好像觉得你还不够资格...`, tone: 'neutral' };
    }
  },
  {
    id: 'travel_pet_fox',
    chance: 0.007, // 0.7%
    icon: '🦊',
    title: '狐仙试炼',
    desc: '一只火红的狐狸挡在路中，眼中闪烁着智慧的光芒...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.5) {
        if (typeof petAdd === 'function') {
          const result = petAdd('fox');
          if (result.success) {
            return { result: `🦊 "有趣的人类，我跟你走一趟。"狐狸竟然开口说话了！\n✦ 获得宠物【灵狐】！`, tone: 'legendary' };
          }
        }
      }
      return { result: `🦊 狐狸打了个哈欠，优雅地消失在树林中。\n✦ 它好像对你不感兴趣...`, tone: 'neutral' };
    }
  },
  {
    id: 'travel_pet_bear_cub',
    chance: 0.005, // 0.5%
    icon: '🐻',
    title: '熊崽求助',
    desc: '一只小熊崽卡在树洞里，发出可怜的叫声...',
    effect: () => {
      if (typeof petAdd === 'function') {
        const result = petAdd('bear');
        if (result.success) {
          return { result: `🐻 你救出了熊崽，它亲昵地蹭着你。远处传来母熊满意的低吼...\n✦ 获得宠物【棕熊】！（母熊：替我照顾好它）`, tone: 'great' };
        }
      }
      return { result: `🐻 你尝试救援时，熊崽的妈妈出现了，愤怒地把你赶走...\n✦ 快跑！`, tone: 'bad' };
    }
  },
  {
    id: 'travel_pet_bird_egg',
    chance: 0.004, // 0.4%
    icon: '🥚',
    title: '神秘鸟蛋',
    desc: '你在树下发现了一颗散发着微光的蛋...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.3) {
        if (typeof petAdd === 'function') {
          const result = petAdd('phoenix');
          if (result.success) {
            return { result: `🥚 蛋突然裂开，一只金色的小鸟探出头来！\n✦ 获得宠物【雏凤】！（传说级！）`, tone: 'legendary' };
          }
        }
      } else if (roll < 0.6) {
        if (typeof petAdd === 'function') {
          const result = petAdd('eagle');
          if (result.success) {
            return { result: `🥚 蛋孵化了，是一只威武的雏鹰！\n✦ 获得宠物【猎鹰】！`, tone: 'great' };
          }
        }
      }
      return { result: `🥚 你把蛋带在身上，但什么都没有发生...\n✦ 也许需要更温暖的环境？`, tone: 'neutral' };
    }
  },
  {
    id: 'travel_old_friend',
    chance: 0.008, // 0.8%
    icon: '👥',
    title: '故友重逢',
    desc: '前方的人影看起来很眼熟...',
    effect: () => {
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.food = Math.min(100, (travelPlayerState.food || 100) + 30);
        travelPlayerState.water = Math.min(100, (travelPlayerState.water || 100) + 30);
      }
      return { result: `原来是多年未见的老友！你们把酒言欢，回忆往事。\n✦ 饱食度+30，口渴度+30，心情大好！`, tone: 'great' };
    }
  },
  {
    id: 'travel_meteor_shower',
    chance: 0.005, // 0.5%
    icon: '☄️',
    title: '流星天降',
    desc: '夜空中突然划过无数流星，场面壮观至极...',
    effect: () => {
      if (typeof edS !== 'undefined') {
        // 所有属性临时提升
        edS._meteorBlessing = { turns: 3, atk: 10, def: 10, spd: 5 };
        if (typeof edSave === 'function') edSave();
      }
      return { result: `你对着流星许愿，感觉浑身充满了力量！\n✦ 流星祝福：接下来3场战斗全属性提升！`, tone: 'legendary' };
    }
  },
  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"旅行恶搞事件
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'travel_beggar_master',
    chance: 0.01, // 1%
    icon: '🥣',
    title: '乞丐真传',
    desc: '一个邋遢的乞丐拦住你："少侠，我看你骨骼惊奇..."',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.3) {
        // 真的是高人
        if (typeof addPlayerExp === 'function') addPlayerExp(100, '奇遇');
        return { result: `🥣 乞丐突然施展绝世轻功飞走了！你恍然大悟，这是隐世高人！\n✦ 获得经验+100！`, tone: 'great' };
      } else if (roll < 0.6) {
        // 骗子
        const loss = 10 + Math.floor(Math.random() * 20);
        if (typeof SilverManager !== 'undefined') SilverManager.spend(loss);
        return { result: `🥣 你给了乞丐 ${loss} 两银子，他收下钱后嘿嘿一笑："谢谢傻子！"然后跑了...\n✦ 被骗了！`, tone: 'bad' };
      } else {
        // 普通乞丐
        return { result: `🥣 你给了乞丐几文钱，他连连道谢。虽然没什么收获，但心里暖暖的。\n✦ 心情变好（虽然没什么用）`, tone: 'neutral' };
      }
    }
  },
  {
    id: 'travel_lottery_ticket',
    chance: 0.008, // 0.8%
    icon: '🎫',
    title: '神秘彩票',
    desc: '路边有人兜售"必中彩票"，只要10两银子...',
    effect: () => {
      if (typeof SilverManager !== 'undefined') SilverManager.spend(10);
      const roll = Math.random();
      if (roll < 0.05) {
        // 大奖
        const win = 500 + Math.floor(Math.random() * 500);
        if (typeof SilverManager !== 'undefined') SilverManager.add(win);
        return { result: `🎫 你刮开彩票——头奖！！！\n✦ 获得 ${win} 两银子！（这都能中？！）`, tone: 'legendary' };
      } else if (roll < 0.3) {
        // 小奖
        const win = 20 + Math.floor(Math.random() * 30);
        if (typeof SilverManager !== 'undefined') SilverManager.add(win);
        return { result: `🎫 你刮开彩票——中了小奖！\n✦ 获得 ${win} 两银子（回本了！）`, tone: 'good' };
      } else {
        return { result: `🎫 你刮开彩票——谢谢惠顾...\n✦ 血本无归（早该想到的）`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_ugly_duckling',
    chance: 0.012, // 1.2%
    icon: '🦆',
    title: '丑小鸭',
    desc: '一只看起来很丑的鸭子跟着你...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.1) {
        // 真的是天鹅
        if (typeof SilverManager !== 'undefined') SilverManager.add(200);
        return { result: `🦢 那只"丑小鸭"突然变成了一只美丽的天鹅！它飞走时掉下一颗珍珠！\n✦ 获得 200 两银子！（童话成真！）`, tone: 'legendary' };
      } else {
        return { result: `🦆 那只丑鸭子跟了你一路，最后自己跑掉了。\n✦ 至少它不丑了（对你而言）`, tone: 'neutral' };
      }
    }
  },
  {
    id: 'travel_time_traveler',
    chance: 0.003, // 0.3%
    icon: '⏰',
    title: '时空旅人',
    desc: '一个穿着奇怪的人拦住你："请问现在是哪一年？"',
    effect: () => {
      return { result: `⏰ "2026年。"你说。\n那人恍然大悟："原来我穿越过头了！"然后凭空消失了...\n✦ 你遇到了一个来自未来的傻子？`, tone: 'legendary' };
    }
  },
  {
    id: 'travel_singing_contest',
    chance: 0.008, // 0.8%
    icon: '🎤',
    title: '路边歌会',
    desc: '一群江湖艺人正在举办歌唱比赛，邀请你参加...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.2) {
        if (typeof SilverManager !== 'undefined') SilverManager.add(50);
        return { result: `🎤 你一曲《江湖行》震惊四座！评委们纷纷亮出满分！\n✦ 获得奖金 50 两！（歌神附体！）`, tone: 'great' };
      } else if (roll < 0.5) {
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.food = Math.min(100, (travelPlayerState.food || 100) + 20);
        }
        return { result: `🎤 你唱得一般，但观众们很给面子，给了你一些食物鼓励。\n✦ 饱食度+20`, tone: 'good' };
      } else {
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - 10);
        }
        return { result: `🎤 你刚开口，观众们就扔来了烂菜叶和臭鸡蛋...\n✦ 精力-10（太丢人了，快跑！）`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_fortune_cookie',
    chance: 0.01, // 1%
    icon: '🥠',
    title: '幸运饼干',
    desc: '一个神秘小贩送你一块饼干："吃下它，你会知道你的命运。"',
    effect: () => {
      const fortunes = [
        { text: '「今日不宜出门，但你已经出来了。」', effect: 'bad', msg: '✦ 运气-5（你已经被诅咒了）' },
        { text: '「财运亨通，但不是你。」', effect: 'neutral', msg: '✦ 什么都没发生（白吃了）' },
        { text: '「你会遇到一个改变你命运的人。」', effect: 'good', msg: '✦ 运气+3（期待吧！）' },
        { text: '「小心天上掉馅饼——真的会掉。」', effect: 'good', msg: '✦ 饱食度+30（真的掉了馅饼！）' },
        { text: '「你的武功将突飞猛进——在梦里。」', effect: 'bad', msg: '✦ 精力-10（被气到了）' },
      ];
      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      if (fortune.effect === 'good' && fortune.msg.includes('饱食度') && typeof travelPlayerState !== 'undefined') {
        travelPlayerState.food = Math.min(100, (travelPlayerState.food || 100) + 30);
      } else if (fortune.effect === 'bad' && fortune.msg.includes('精力') && typeof travelPlayerState !== 'undefined') {
        travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - 10);
      }
      return { result: `🥠 你打开饼干，里面有一张纸条：\n"${fortune.text}"\n${fortune.msg}`, tone: fortune.effect };
    }
  },
  {
    id: 'travel_alien_abduction',
    chance: 0.002, // 0.2%
    icon: '🛸',
    title: '天外来客',
    desc: '天空中突然出现一个发光的圆盘...',
    effect: () => {
      const roll = Math.random();
      if (roll < 0.5) {
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy || 100) - 30);
        }
        return { result: `🛸 你被一束光吸了上去！外星人对你做了些奇怪的检查后又把你扔了下来...\n✦ 精力-30（这是什么鬼？！）`, tone: 'bad' };
      } else {
        if (typeof SilverManager !== 'undefined') SilverManager.add(100);
        return { result: `🛸 外星人给了你一块发光的石头作为"过路费"，然后飞走了。\n✦ 获得 100 两银子（石头卖了）`, tone: 'legendary' };
      }
    }
  },
  {
    id: 'travel_duck_race',
    chance: 0.01, // 1%
    icon: '🦆',
    title: '赛鸭大会',
    desc: '一群村民正在举办鸭子赛跑比赛，你可以下注...',
    effect: () => {
      const bet = 10;
      if (typeof SilverManager !== 'undefined') SilverManager.spend(bet);
      const roll = Math.random();
      if (roll < 0.25) {
        const win = bet * 4;
        if (typeof SilverManager !== 'undefined') SilverManager.add(win);
        return { result: `🦆 你选的鸭子"闪电"一骑绝尘！\n✦ 获得 ${win} 两银子！（赌神附体！）`, tone: 'great' };
      } else {
        return { result: `🦆 你选的鸭子跑到一半去追蝴蝶了...\n✦ 输掉 ${bet} 两银子（不靠谱的鸭子！）`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_noodle_rain',
    chance: 0.005, // 0.5%
    icon: '🍜',
    title: '天降面条',
    desc: '天空突然下起...面条？',
    effect: () => {
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.food = Math.min(100, (travelPlayerState.food || 100) + 50);
      }
      return { result: `🍜 天上真的在下面条！你赶紧拿出碗接了一些...\n✦ 饱食度+50（这是什么神仙天气？！）`, tone: 'legendary' };
    }
  },
  {
    id: 'travel_invisible_wall',
    chance: 0.008, // 0.8%
    icon: '🧱',
    title: '空气墙',
    desc: '你走着走着，突然撞到了什么...',
    effect: () => {
      if (typeof travelPlayerState !== 'undefined') {
        travelPlayerState.hp = Math.max(0, (travelPlayerState.hp || 100) - 5);
      }
      return { result: `🧱 你撞上了一堵"空气墙"！头上鼓起一个大包...\n✦ 气血-5（这游戏出BUG了？！）`, tone: 'bad' };
    }
  },
  // ═══════════════════════════════════════════════════════════════
  //  宠物相关恶搞事件
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'travel_pet_steal_food',
    chance: 0.01, // 1%
    icon: '🐕',
    title: '宠物偷吃',
    desc: '你的宠物趁你不注意，偷偷翻开了你的行囊...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🐕 你回头一看，一只野狗正在翻你的行囊！你赶走了它。\n✦ 幸好没丢什么东西`, tone: 'neutral' };
      }
      const roll = Math.random();
      if (roll < 0.3) {
        // 偷吃食物，饱食度增加
        if (typeof petFeed === 'function') petFeed(activePet.id, 'food_normal', 1);
        return { result: `🐕 ${activePet.name}偷吃了你背包里的干粮，一脸满足地看着你！\n✦ 宠物饱食度+20，你的食物-1`, tone: 'good' };
      } else if (roll < 0.6) {
        // 偷吃珍贵食物
        return { result: `🐕 ${activePet.name}竟然找到了你藏起来的美味！它吃得好开心...\n✦ 宠物快乐度+15，珍贵食物-1（算了，它开心就好）`, tone: 'neutral' };
      } else {
        // 什么都没吃到
        return { result: `🐕 ${activePet.name}翻了半天，只找到一些草药，嫌弃地走开了。\n✦ 宠物："这也太难吃了！"`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_pet_cute_attack',
    chance: 0.008, // 0.8%
    icon: '🥺',
    title: '卖萌攻击',
    desc: '你的宠物突然开始对你发动"卖萌攻击"...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🥺 路边一只小猫对你喵喵叫，你忍不住摸了摸它。\n✦ 心情变好了！`, tone: 'good' };
      }
      const cuteMoves = [
        { name: '歪头杀', desc: `${activePet.name}歪着头，用无辜的大眼睛看着你...`, effect: 'great' },
        { name: '翻滚撒娇', desc: `${activePet.name}在地上打滚，露出肚皮求摸摸！`, effect: 'good' },
        { name: '蹭腿攻击', desc: `${activePet.name}不停地蹭你的腿，发出撒娇的声音...`, effect: 'good' },
        { name: '装可怜', desc: `${activePet.name}耷拉着耳朵，一副委屈巴巴的样子...`, effect: 'neutral' },
      ];
      const move = cuteMoves[Math.floor(Math.random() * cuteMoves.length)];
      if (move.effect === 'great') {
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.energy = Math.min(100, (travelPlayerState.energy || 100) + 10);
        }
        return { result: `🥺 ${move.desc}\n你被萌化了，精神焕发！\n✦ 精力+10`, tone: 'great' };
      }
      return { result: `🥺 ${move.desc}\n你忍不住给了它一些零食。\n✦ 宠物快乐度+10`, tone: 'good' };
    }
  },
  {
    id: 'travel_pet_treasure_sniff',
    chance: 0.006, // 0.6%
    icon: '🐽',
    title: '寻宝嗅觉',
    desc: '你的宠物突然变得很兴奋，对着地面不停地嗅...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🐽 一只猎犬路过，对着地面嗅了嗅，然后跑开了。\n✦ 也许它发现了什么？`, tone: 'neutral' };
      }
      const roll = Math.random();
      if (roll < 0.2) {
        // 发现宝藏
        const silver = 80 + Math.floor(Math.random() * 120);
        if (typeof SilverManager !== 'undefined') SilverManager.add(silver);
        return { result: `🐽 ${activePet.name}挖出了一袋银子！它骄傲地摇着尾巴！\n✦ 获得 ${silver} 两银子！（好狗！）`, tone: 'legendary' };
      } else if (roll < 0.5) {
        // 发现物品
        if (typeof craftBagAdd === 'function') craftBagAdd('item_herb_random', 1);
        return { result: `🐽 ${activePet.name}挖出了一些草药！它好像知道这些有用！\n✦ 获得随机草药×1`, tone: 'good' };
      } else if (roll < 0.8) {
        // 发现骨头
        return { result: `🐽 ${activePet.name}兴奋地挖出了一根骨头...然后自己啃了起来。\n✦ 宠物快乐度+5（它很满意这个"宝藏"）`, tone: 'neutral' };
      } else {
        // 挖到陷阱
        if (typeof travelPlayerState !== 'undefined') {
          travelPlayerState.hp = Math.max(0, (travelPlayerState.hp || 100) - 10);
        }
        return { result: `🐽 ${activePet.name}挖得太起劲，触发了陷阱！一支暗箭射出！\n✦ 气血-10（下次要小心！）`, tone: 'bad' };
      }
    }
  },
  {
    id: 'travel_pet_make_friend',
    chance: 0.012, // 1.2%
    icon: '🐾',
    title: '宠物交友',
    desc: '你的宠物遇到了同类，两只动物似乎很投缘...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🐾 你看到两只小动物在玩耍，看起来很快乐。\n✦ 世界和平~`, tone: 'neutral' };
      }
      const friendEvents = [
        { desc: `${activePet.name}和那只${activePet.template?.name || '动物'}追逐嬉戏，玩得很开心！`, bonus: 'happy' },
        { desc: `两只动物互相蹭了蹭，似乎在交换气味。`, bonus: 'loyalty' },
        { desc: `${activePet.name}分享了食物给新朋友，看起来很慷慨！`, bonus: 'food' },
        { desc: `那只动物教会了${activePet.name}一个新技巧！`, bonus: 'exp' },
      ];
      const evt = friendEvents[Math.floor(Math.random() * friendEvents.length)];
      let bonusText = '';
      if (evt.bonus === 'happy') {
        bonusText = '宠物快乐度+20';
      } else if (evt.bonus === 'loyalty') {
        bonusText = '宠物忠诚度+10';
      } else if (evt.bonus === 'food') {
        bonusText = '饱食度+15，快乐度+10';
      } else if (evt.bonus === 'exp') {
        bonusText = '宠物经验+50';
      }
      return { result: `🐾 ${evt.desc}\n✦ ${bonusText}`, tone: 'good' };
    }
  },
  {
    id: 'travel_pet_protect_master',
    chance: 0.007, // 0.7%
    icon: '🛡️',
    title: '护主心切',
    desc: '突然有危险靠近，你的宠物立刻挡在你面前...',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🛡️ 一只野狗对着你狂吠，你捡起石头赶走了它。\n✦ 虚惊一场`, tone: 'neutral' };
      }
      const threats = [
        { name: '毒蛇', result: `${activePet.name}及时发现了一条毒蛇，大声警告你！你避开了危险。`, bonus: 'hp' },
        { name: '山贼', result: `${activePet.name}对着灌木丛狂吠，几个山贼被发现后逃走了！`, bonus: 'silver' },
        { name: '陷阱', result: `${activePet.name}咬住你的裤腿不让你走，你仔细一看，前方是个陷阱！`, bonus: 'none' },
        { name: '毒蘑菇', result: `${activePet.name}抢在你之前吃掉了毒蘑菇，然后呕吐不止...`, bonus: 'sacrifice' },
      ];
      const threat = threats[Math.floor(Math.random() * threats.length)];
      if (threat.bonus === 'hp') {
        return { result: `🛡️ ${threat.result}\n✦ 宠物忠诚度+15（它救了你！）`, tone: 'great' };
      } else if (threat.bonus === 'silver') {
        const silver = 30 + Math.floor(Math.random() * 40);
        if (typeof SilverManager !== 'undefined') SilverManager.add(silver);
        return { result: `🛡️ ${threat.result}\n✦ 获得 ${silver} 两银子（从山贼身上搜的）`, tone: 'good' };
      } else if (threat.bonus === 'sacrifice') {
        return { result: `🛡️ ${threat.result}\n✦ 宠物饱食度-20，忠诚度+20（它替你受了罪...）`, tone: 'good' };
      }
      return { result: `🛡️ ${threat.result}\n✦ 忠诚度+10（好宠物！）`, tone: 'good' };
    }
  },
  {
    id: 'travel_pet_learn_trick',
    chance: 0.009, // 0.9%
    icon: '🎪',
    title: '自学成才',
    desc: '你的宠物似乎在观察你练功，然后...它学会了？',
    effect: () => {
      const activePet = (typeof petGetActive === 'function') ? petGetActive() : null;
      if (!activePet) {
        return { result: `🎪 一只猴子模仿你的动作，学得还挺像！\n✦ 你笑了`, tone: 'neutral' };
      }
      const tricks = [
        { name: '后空翻', desc: `${activePet.name}突然做了个漂亮的后空翻！` },
        { name: '装死', desc: `${activePet.name}突然倒地装死，把你吓了一跳！` },
        { name: '握手', desc: `${activePet.name}伸出爪子，像是在要求握手！` },
        { name: '转圈', desc: `${activePet.name}开心地转起了圈！` },
        { name: '叼东西', desc: `${activePet.name}叼来一根树枝给你！` },
      ];
      const trick = tricks[Math.floor(Math.random() * tricks.length)];
      return { result: `🎪 ${trick.desc}\n✦ 宠物快乐度+15，忠诚度+5（它真聪明！）`, tone: 'good' };
    }
  },
];

// ── 奇遇事件数据库 ──────────────────────────────────────────
// 每个事件：{ id, tier, weight, icon, title, scene, narration, choices[], condition? }
// tier:    common | rare | legendary（默认 common）
// condition: ()=>boolean 函数，返回 true 才能触发（用于稀有/传说事件的条件限制）

const ENCOUNTER_DB = [

  // ══════════════════════════════════
  //  神秘老人系列
  // ══════════════════════════════════
  {
    id: 'enc_hermit_manual',
    weight: 6, icon: '🧙‍♂️',
    title: '隐世高人授艺',
    scene: '山道蜿蜒，林间忽见一白发老者盘膝于古松下，身前摆着几本古朴书册。',
    narration: [
      '老者缓缓睁眼，打量你片刻，慢悠悠道：',
      '"年轻人，你的剑意（掌意）甚为有趣……"',
      '"老夫在此等候多时，不知你可愿学一式？"',
    ],
    choices: [
      {
        label: '恭敬拜师，虚心求教',
        icon: '🙏',
        fn: () => {
          const silverCost = 0;
          // 随机赠予一个技能名号
          const gifts = [
            { name: '无为剑法·残篇', desc: '剑系·化劲入道，攻防两宜' },
            { name: '金刚护体·心诀', desc: '佛系·一念成盾，万法不侵' },
            { name: '御风轻功·口诀', desc: '风系·脚踏浮云，身轻如燕' },
            { name: '五行周天诀·碎章', desc: '道系·内力运转，五行相生' },
            { name: '摧山破岳·断页', desc: '力系·势如山崩，一击破甲' },
          ];
          const g = gifts[Math.floor(Math.random() * gifts.length)];
          // 给予声誉加成（学有所得）
          if(typeof travelPlayerState !== 'undefined'){
            travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 5);
            travelPlayerState.energy = Math.max(0, (travelPlayerState.energy||100) - 10);
            if(typeof travelSave === 'function') travelSave();
          }
          return {
            result: `老者颔首微笑，将【${g.name}】的精髓口诀传授于你。\n"${g.desc}——好好参悟。"\n精力-10，声誉+5，获得武功感悟！`,
            tone: 'great',
            extraLines: [`✦ 获得感悟：${g.name}`, `  ${g.desc}`],
          };
        },
      },
      {
        label: '婉言谢绝，不愿欠人情',
        icon: '🤚',
        fn: () => {
          return {
            result: '老者微微一笑，摇头叹道："年轻人的傲气……挺好。" 起身而去，徒留松涛阵阵。',
            tone: 'neutral',
          };
        },
      },
      {
        label: '趁机偷看书册（风险）',
        icon: '👀',
        fn: () => {
          const success = Math.random() < 0.45;
          if(success){
            travelPlayerState.reputation = Math.max(0, (travelPlayerState.reputation||100) - 10);
            if(typeof travelSave === 'function') travelSave();
            return {
              result: '书册上密密麻麻记载了内功心法，你飞速记下几行要诀——老者却似乎并未察觉。\n声誉-10，获得残缺内功要诀。',
              tone: 'good',
            };
          } else {
            travelPlayerState.reputation = Math.max(0, (travelPlayerState.reputation||100) - 20);
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 20);
            if(typeof travelSave === 'function') travelSave();
            return {
              result: '老者眼神一凌，手指轻弹，你只觉胸口一震，踉跄后退数步。\n"小贼！" 气血-20%，声誉-20。',
              tone: 'bad',
            };
          }
        },
      },
    ],
  },

  {
    id: 'enc_old_warrior',
    weight: 8, icon: '⚔️',
    title: '落魄老侠',
    scene: '驿道旁，一位白须老人倚剑而坐，破旧的江湖服上满是岁月痕迹。他抬头见你，眼神一亮。',
    narration: [
      '"小兄弟，老夫年轻时纵横江湖数十载……"',
      '"如今老骨头不中用了，手中这柄剑，不知有没有缘分传给你？"',
    ],
    choices: [
      {
        label: '恳请老侠赐剑，结下情谊',
        icon: '🗡️',
        fn: () => {
          // 银两不变，声誉增加
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 8);
          SilverManager.save();
          const swords = ['裂云剑', '青霜剑', '断魂刃', '寒光剑', '落雁剑'];
          const sw = swords[Math.floor(Math.random() * swords.length)];
          // 添加随机武器到背包
          const swordIds = ['wep_rand_lieyun', 'wep_rand_qingshuang', 'wep_rand_duanhun', 'wep_rand_hanguang', 'wep_rand_luoyan'];
          const swordId = swordIds[Math.floor(Math.random() * swordIds.length)];
          if(typeof addItemToBag === 'function'){
            addItemToBag(swordId, 1);
          } else if(typeof edS !== 'undefined' && edS.bag){
            edS.bag.push({instId:'randsw_'+Date.now(), type:'weapon', templateId:swordId, name:sw, icon:'🗡️', identified:false, affixes:[]});
            if(typeof bagSave === 'function') bagSave();
          }
          return {
            result: `老侠哈哈大笑，将"${sw}"郑重递上。\n"好孩子，老夫这辈子值了！"\n声誉+8，获得【${sw}】`,
            tone: 'great',
          };
        },
      },
      {
        label: '给他一些银两，好好养老',
        icon: '💰',
        condition: () => hasSilver(30),
        fn: () => {
          spendSilver(30);
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 12);
          SilverManager.save();
          return {
            result: '老侠愣了愣，随即老泪纵横。\n"江湖上还有好人……谢谢你，孩子。"\n银两-30，声誉+12（行善之名传扬江湖）',
            tone: 'great',
          };
        },
      },
      {
        label: '随手点个头，继续赶路',
        icon: '🚶',
        fn: () => {
          return {
            result: '你礼貌地点头离去。身后老人轻叹一声，不知是惋惜还是释然。',
            tone: 'neutral',
          };
        },
      },
    ],
  },

  // ══════════════════════════════════
  //  古墓秘境系列
  // ══════════════════════════════════
  {
    id: 'enc_ancient_tomb',
    weight: 5, icon: '🏚️',
    title: '荒野古墓',
    scene: '草丛深处，一座青苔覆盖的古墓若隐若现。墓门半开，隐约可见墓道中一线微光。',
    narration: [
      '此墓年代久远，封印处刻有"天下武林，入者慎之"字样。',
      '凭你的感知，墓内似乎有阴煞之气，但也可能有上古遗物……',
    ],
    choices: [
      {
        label: '大胆入墓探宝',
        icon: '🔦',
        fn: () => {
          const roll = Math.random();
          if(roll < 0.15){
            // 大吉
            addSilver(200);
            SilverManager.save();
            return {
              result: '墓道深处竟有一口石棺，棺前摆着一只玉匣——\n打开，竟是200两金叶子和一本泛黄秘笈残页！\n银两+200，获得古墓遗物！',
              tone: 'great',
            };
          } else if(roll < 0.5){
            // 小收获
            addSilver(80);
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 10);
            SilverManager.save();
            return {
              result: '墓中阴气甚重，你强撑着翻找，找到一些散碎金银。\n踉踉跄跄退出时，脸色已有些发白。\n银两+80，气血-10%。',
              tone: 'good',
            };
          } else {
            // 触发机关
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 25);
            travelPlayerState.energy = Math.max(0, (travelPlayerState.energy||100) - 20);
            if(typeof travelSave === 'function') travelSave();
            return {
              result: '墓道中机关密布，一枚飞针擦过脸颊，你狼狈逃出，伤痕累累。\n气血-25%，精力-20。',
              tone: 'bad',
            };
          }
        },
      },
      {
        label: '在墓外打坐调息（安全）',
        icon: '🧘',
        fn: () => {
          travelPlayerState.energy = Math.min(100, (travelPlayerState.energy||100) + 25);
          if(typeof travelSave === 'function') travelSave();
          return {
            result: '你在古墓外盘膝而坐，感受这片荒野沉积的岁月之气。\n一炷香后，内力竟隐隐有所增进。\n精力+25，感悟内力运转之道。',
            tone: 'good',
          };
        },
      },
      {
        label: '祭拜墓前，转身离去',
        icon: '🙏',
        fn: () => {
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 3);
          if(typeof travelSave === 'function') travelSave();
          return {
            result: '你对着古墓深深一揖，低声道："打扰了，逝者安息。"\n莫名的，心头一阵踏实。声誉+3。',
            tone: 'neutral',
          };
        },
      },
    ],
  },

  // ══════════════════════════════════
  //  驿站奇遇系列
  // ══════════════════════════════════
  {
    id: 'enc_inn_fight',
    weight: 10, icon: '🍶',
    title: '驿站恩怨',
    scene: '途经一处简陋驿站，门口却喧嚣声大作——几名彪形大汉正逼着一名书生模样的人交出什么东西。',
    narration: [
      '"你小子，把地图交出来，爷爷饶你不死！"',
      '书生满脸惊恐，牢牢护着怀中的包袱，嘴唇哆嗦着说不出话来。',
      '驿站众人噤若寒蝉，无一人出手相助。',
    ],
    choices: [
      {
        label: '路见不平，出手相助',
        icon: '⚔️',
        fn: () => {
          const success = Math.random() < 0.65;
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + (success ? 15 : 8));
          if(success){
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 8);
          } else {
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 25);
          }
          if(typeof travelSave === 'function') travelSave();
          if(success){
            // 添加江湖秘境地图残片到背包
            if(typeof addItemToBag === 'function'){
              addItemToBag('item_map_fragment', 1);
            } else if(typeof edS !== 'undefined' && edS.bag){
              edS.bag.push({instId:'mapfrag_'+Date.now(), type:'collectible', templateId:'item_map_fragment', name:'江湖秘境地图·残片', icon:'🗺️', identified:true, affixes:[]});
              if(typeof bagSave === 'function') bagSave();
            }
            return {
              result: '三下五除二，大汉们狼狈而逃。书生感激涕零，从包袱中取出一幅地图相赠：\n"这是我数年心血，你救了我，地图你拿去！"\n气血-8%，声誉+15，获得【江湖秘境地图·残片】',
              tone: 'great',
            };
          } else {
            // 添加金疮药到消耗品背包
            if(typeof addItemToBag === 'function'){
              addItemToBag('item_jinchuang', 1);
            } else if(typeof edS !== 'undefined' && edS.bag){
              edS.bag.push({instId:'jinchuang_'+Date.now(), type:'consumable', templateId:'item_jinchuang', name:'金疮药', icon:'🩹', identified:true, affixes:[], effect:{hp:35}});
              if(typeof bagSave === 'function') bagSave();
            }
            return {
              result: '对方人多势众，你身受重伤，勉强将书生护住。大汉们担心惹更大麻烦，骂骂咧咧离去。\n书生低声道谢，塞给你一颗金疮药。\n气血-25%，声誉+8，获得金疮药×1。',
              tone: 'good',
            };
          }
        },
      },
      {
        label: '打听情况再做决定',
        icon: '👂',
        fn: () => {
          const choice = Math.random() < 0.5;
          if(choice){
            return {
              result: '悄悄一打听，原来书生盗了大汉们的"宝图"，这是贼赃……\n你识趣地转身离去，这浑水不好趟。',
              tone: 'neutral',
            };
          } else {
            addSilver(15);
            SilverManager.save();
            return {
              result: '书生见你关注，趁乱悄声请求："壮士，你帮我吓走他们，事后我分你一些银两！"\n你假意上前斥了几声，大汉们不明就里，竟然散去了。\n书生给了你15两答谢。银两+15。',
              tone: 'good',
            };
          }
        },
      },
      {
        label: '绕路而行，不趟浑水',
        icon: '🚶',
        fn: () => {
          return {
            result: '你快步走过，假装没看见。\n…但那书生求救的眼神，好像一直追着你。',
            tone: 'neutral',
          };
        },
      },
    ],
  },

  {
    id: 'enc_disguised_master',
    weight: 7, icon: '🎭',
    title: '扮作乞丐的高手',
    scene: '驿道边，一名衣衫褴褛的乞丐正讨要钱财，却无人理睬。他见到你，眼中闪过一丝精光。',
    narration: [
      '"壮士……能否周济老夫几文？"',
      '话音未落，你注意到——他握住破碗的手，指节上满是厚茧，分明是多年习武之人。',
    ],
    choices: [
      {
        label: '慷慨解囊，给他20两',
        icon: '💰',
        condition: () => hasSilver(20),
        fn: () => {
          spendSilver(20);
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 10);
          SilverManager.save();
          const rewards = [
            '"你的眼力不错。"老人站起身来，高大挺拔，哪有半点乞丐模样。\n"老夫教你一招以柔克刚，记好了！"银两-20，声誉+10，领悟内功心法要诀。',
            '"好孩子。"他接过银子，微微一笑，"你心地善良，老夫送你一句话：遇强则强，遇弱则让——江湖之道。"\n银两-20，声誉+10，内力上限+10（本次旅途有效）。',
          ];
          return {
            result: rewards[Math.floor(Math.random() * rewards.length)],
            tone: 'great',
          };
        },
      },
      {
        label: '给他5两，尽点心意',
        icon: '🪙',
        condition: () => hasSilver(5),
        fn: () => {
          spendSilver(5);
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 4);
          SilverManager.save();
          return {
            result: '老人接过，淡淡道："谢了。"\n他的眼神里似乎有些遗憾，起身踱步而去，背影挺得笔直。\n银两-5，声誉+4。',
            tone: 'good',
          };
        },
      },
      {
        label: '直接戳穿他的身份',
        icon: '👁️',
        fn: () => {
          const roll = Math.random();
          if(roll < 0.5){
            travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 6);
            if(typeof travelSave === 'function') travelSave();
            return {
              result: '"哦？"老人微微一愣，随即放声大笑，\n"好眼力！说吧，你想学什么？"\n他传授你三招"看破"之术。声誉+6，感悟识人之道。',
              tone: 'great',
            };
          } else {
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 15);
            if(typeof travelSave === 'function') travelSave();
            return {
              result: '"你多管什么闲事！"\n老人突然站起，一掌拍在你肩上，你如遭雷击，踉跄退开。\n他拂袖而去，你揉着肩膀，若有所思。\n气血-15%。',
              tone: 'bad',
            };
          }
        },
      },
    ],
  },

  // ══════════════════════════════════
  //  江湖恩怨系列
  // ══════════════════════════════════
  {
    id: 'enc_wounded_hero',
    weight: 9, icon: '🩸',
    title: '路遇受伤侠客',
    scene: '林间小路上，一名侠客倒在血泊之中，手中长剑折断，呼吸虚弱。见到你走来，挣扎着抬起头。',
    narration: [
      '"你……帮我传一封信……"',
      '他从怀中艰难掏出一封带血的信封，上书"苏州·白鹭堂·堂主亲启"。',
      '"信里……有关一个阴谋……必须……送到……"',
    ],
    choices: [
      {
        label: '先救人，替他包扎伤口',
        icon: '💊',
        fn: () => {
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 12);
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy||100) - 10);
          if(typeof travelSave === 'function') travelSave();
          return {
            result: '你撕下衣角为他止血包扎，又拿出随身药品为他施救。\n侠客渐渐稳住气息，低声道："你是好人……苏州……记住……"\n精力-10，声誉+12，接取【送信支线】线索（可前往苏州触发）。',
            tone: 'great',
          };
        },
      },
      {
        label: '接下信，立刻继续赶路',
        icon: '📬',
        fn: () => {
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 5);
          if(typeof travelSave === 'function') travelSave();
          // 添加密信到背包
          if(typeof addItemToBag === 'function'){
            addItemToBag('item_letter_suzhou', 1);
          } else if(typeof edS !== 'undefined' && edS.bag){
            edS.bag.push({instId:'letter_'+Date.now(), type:'collectible', templateId:'item_letter_suzhou', name:'密信', icon:'📜', identified:true, affixes:[]});
            if(typeof bagSave === 'function') bagSave();
          }
          return {
            result: '你接过信封，点头承诺。\n侠客释然地合上眼睛，嘴角微微上扬。\n声誉+5，获得【密信】，送达苏州可触发特殊事件。',
            tone: 'good',
          };
        },
      },
      {
        label: '看看信的内容（好奇心作怪）',
        icon: '📖',
        fn: () => {
          const contents = [
            '信中写道：某大门派掌门已被奸人替换，门内弟子均受蒙蔽，特此告知……',
            '信中密语：玄冥教教主已暗中勾结漠北，意图搅乱中原武林……',
            '信中写道：唐门新制奇毒已流入江湖黑市，毒方来源极为可疑……',
          ];
          const c = contents[Math.floor(Math.random() * contents.length)];
          travelPlayerState.reputation = Math.max(0, (travelPlayerState.reputation||100) - 5);
          if(typeof travelSave === 'function') travelSave();
          return {
            result: `拆开一看——\n${c}\n这消息非同小可！声誉-5（私拆密信），但获得重要情报。`,
            tone: 'good',
          };
        },
      },
    ],
  },

  // ══════════════════════════════════
  //  武林大会 / 情报系列
  // ══════════════════════════════════
  {
    id: 'enc_tournament_news',
    weight: 12, icon: '🏆',
    title: '武林大会消息',
    scene: '路边茶摊，几名江湖人士正兴致勃勃地谈论着什么，满面红光，激动异常。',
    narration: [
      '"听说了没？今年的武林大会要在嵩山脚下举办！"',
      '"各大门派都去了，连桃花岛的人都下山了！"',
      '"据说有一件惊天宝物作为擂台头彩……"',
    ],
    choices: [
      {
        label: '凑上去打听详情',
        icon: '👂',
        fn: () => {
          const infos = [
            { text: '打听到：武林大会头彩是"天下第一剑谱"，据说记载了失传千年的剑法。各派高手无不虎视眈眈。', silver: 0, rep: 3 },
            { text: '打听到：此次大会暗流涌动，有传言说血骨门已派人混入，意图破坏。', silver: 0, rep: 3 },
            { text: '打听到：某位神秘高手以"无名"之名报名参赛，据说打遍擂台无敌手……', silver: 0, rep: 3 },
          ];
          const info = infos[Math.floor(Math.random() * infos.length)];
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + info.rep);
          if(typeof travelSave === 'function') travelSave();
          return { result: info.text + `\n声誉+${info.rep}（见多识广）`, tone: 'good' };
        },
      },
      {
        label: '花点银子，买最新情报',
        icon: '🪙',
        condition: () => hasSilver(10),
        fn: () => {
          spendSilver(10);
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 6);
          SilverManager.save();
          return {
            result: '你慷慨解囊，那名江湖人立刻凑到你耳边低声道：\n"告诉你个秘密——武林盟主的位子今年有人在操控……幕后之人，就是……"\n话音未落，他突然四下张望，闭上了嘴。\n银两-10，声誉+6，获得神秘情报（待后续揭晓）。',
            tone: 'great',
          };
        },
      },
      {
        label: '不感兴趣，继续赶路',
        icon: '🚶',
        fn: () => ({
          result: '江湖事，江湖了。你端起茶碗，一饮而尽，起身上路。',
          tone: 'neutral',
        }),
      },
    ],
  },

  // ══════════════════════════════════
  //  神兵奇遇系列
  // ══════════════════════════════════
  {
    id: 'enc_divine_weapon',
    weight: 4, icon: '⚡',
    title: '天外陨铁',
    scene: '大雨之后，山坡上一道深坑冒着白烟——昨夜有陨石落下。坑中，一块漆黑发亮的铁块散发着异样光泽。',
    narration: [
      '这铁块质地奇异，比寻常精铁沉重数倍，隐隐带着一丝寒意。',
      '识货的人都知道——这是打造神兵的绝佳材料。',
      '远处已有几道人影正急匆匆赶来……',
    ],
    choices: [
      {
        label: '拼命挖出来，先到先得！',
        icon: '⛏️',
        fn: () => {
          const roll = Math.random();
          travelPlayerState.energy = Math.max(0, (travelPlayerState.energy||100) - 30);
          if(typeof travelSave === 'function') travelSave();
          if(roll < 0.6){
            // 获得天外陨铁
            if(typeof addItemToBag === 'function'){
              addItemToBag('item_meteorite_iron', 1);
            } else if(typeof edS !== 'undefined' && edS.bag){
              edS.bag.push({instId:'meteor_'+Date.now(), type:'material', templateId:'item_meteorite_iron', name:'天外陨铁', icon:'☄️', identified:true, affixes:[]});
              if(typeof bagSave === 'function') bagSave();
            }
            return {
              result: '你拼了命把陨铁刨出来，正好在那些人赶到之前揣入怀中。\n精力-30，获得【天外陨铁】（稀有打造材料，价值连城）！',
              tone: 'great',
            };
          } else {
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 15);
            if(typeof travelSave === 'function') travelSave();
            // 获得陨铁碎片
            if(typeof addItemToBag === 'function'){
              addItemToBag('item_meteorite_frag', 1);
            } else if(typeof edS !== 'undefined' && edS.bag){
              edS.bag.push({instId:'metfrag_'+Date.now(), type:'material', templateId:'item_meteorite_frag', name:'陨铁碎片', icon:'🪨', identified:true, affixes:[]});
              if(typeof bagSave === 'function') bagSave();
            }
            return {
              result: '你挖出大半，对方已赶到，双方为此起了冲突。\n慌乱中你带着半块陨铁逃走，受了点伤。\n气血-15%，精力-30，获得【陨铁碎片】（普通打造材料）。',
              tone: 'good',
            };
          }
        },
      },
      {
        label: '静观其变，看是什么人来抢',
        icon: '👁️',
        fn: () => {
          const factions = ['武当道人', '少林弟子', '明教火者', '一名神秘黑衣人'];
          const f = factions[Math.floor(Math.random() * factions.length)];
          return {
            result: `来者是${f}，他们似乎认识你，双方对视片刻。\n最终他们取走陨铁，留给你一句话："此物有缘者得之——你与它无缘。"\n你若有所思，继续上路。`,
            tone: 'neutral',
          };
        },
      },
      {
        label: '不贪此物，转身离去',
        icon: '🚶',
        fn: () => {
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 5);
          if(typeof travelSave === 'function') travelSave();
          return {
            result: '"天下熙熙，皆为利来。"你淡然地背过身去，大步离开。\n声誉+5（淡泊名利之名流传）。',
            tone: 'good',
          };
        },
      },
    ],
  },

  // ══════════════════════════════════
  //  江湖情缘系列
  // ══════════════════════════════════
  {
    id: 'enc_river_beauty',
    weight: 8, icon: '🌸',
    title: '渡口偶遇',
    scene: '渡口边，一名身着青衣的女子正焦急地张望，似乎等待渡船。夕阳将她的轮廓镀上一层金边。',
    narration: [
      '女子见你走来，眼神一亮，上前行礼：',
      '"这位侠士，请问渡船何时来？我有急事要赶往对岸……"',
      '她说话柔声细气，但眼神清澈锐利——分明不是寻常女子。',
    ],
    choices: [
      {
        label: '热心相助，帮她联系渡船',
        icon: '🚤',
        fn: () => {
          spendSilver(5);
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 8);
          SilverManager.save();
          const outcomes = [
            '你花了5两银子帮她包下了一条私渡。女子感谢道："多谢侠士，我家主人定会记下这份情。"\n话间，腰间的剑穗随风飘动，那是某大门派的标志……\n银两-5，声誉+8，结识江湖神秘人脉。',
            '女子上船前回头一笑："侠士若有缘，日后或许还会相遇。"\n你不知为何，总觉得这缘分不远。\n银两-5，声誉+8，奇妙邂逅（待续）。',
          ];
          return { result: outcomes[Math.floor(Math.random() * outcomes.length)], tone: 'great' };
        },
      },
      {
        label: '与她攀谈，了解来历',
        icon: '💬',
        fn: () => {
          const talks = [
            '言谈间，你得知她是某门派内门弟子，奉师命秘密送信。她对你颇有好感，透露了一处"江湖密会"的地点。声誉+5，获得情报线索。',
            '她言辞谨慎，只说是"寻访故人"。但临别时留下一枚玉佩："若有麻烦，凭此物去苏州找云姐姐。"声誉+4，获得玉佩（特殊道具）。',
          ];
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 5);
          if(typeof travelSave === 'function') travelSave();
          return { result: talks[Math.floor(Math.random() * talks.length)], tone: 'good' };
        },
      },
      {
        label: '点头致意，不多打扰',
        icon: '🎩',
        fn: () => ({
          result: '你礼貌地点头，各自等船。渡口的夕阳美得出奇，令人心旷神怡。',
          tone: 'neutral',
        }),
      },
    ],
  },

  // ══════════════════════════════════
  //  奇异遭遇系列
  // ══════════════════════════════════
  {
    id: 'enc_dream_stone',
    weight: 5, icon: '💎',
    title: '异石异象',
    scene: '路中央，一块半人高的奇石兀立着，上面布满古篆，通体发出淡淡蓝光。方圆数丈，寂静异常。',
    narration: [
      '这块石头显然已在此处数百年，路人皆绕道而行。',
      '你靠近细看，石上文字隐约是某种失传的武学心法……',
    ],
    choices: [
      {
        label: '伸手触碰，感受其中玄机',
        icon: '🤚',
        fn: () => {
          const roll = Math.random();
          if(roll < 0.4){
            travelPlayerState.energy = Math.max(0, (travelPlayerState.energy||100) - 20);
            travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 5);
            if(typeof travelSave === 'function') travelSave();
            return {
              result: '你手触石面，一股奇热从掌心直冲脑门——\n漫天的武学心像在脑中一闪而过，等你清醒时，已过了一个时辰。\n精力-20，顿悟内功心法（内力上限+15永久提升）！',
              tone: 'great',
            };
          } else {
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 10);
            if(typeof travelSave === 'function') travelSave();
            return {
              result: '手触石面，一股寒气瞬间钻入经脉，你急忙运功抵御，勉强化解。\n整个人如遭大病初愈，虚弱不已。\n气血-10%，但感知到一丝玄妙之气。',
              tone: 'bad',
            };
          }
        },
      },
      {
        label: '拓下石上文字，带走研究',
        icon: '📝',
        fn: () => {
          if(typeof travelSave === 'function') travelSave();
          // 添加奇石拓文到背包
          if(typeof addItemToBag === 'function'){
            addItemToBag('item_stone_rubbing', 1);
          } else if(typeof edS !== 'undefined' && edS.bag){
            edS.bag.push({instId:'rubbing_'+Date.now(), type:'collectible', templateId:'item_stone_rubbing', name:'奇石拓文', icon:'📜', identified:true, affixes:[]});
            if(typeof bagSave === 'function') bagSave();
          }
          return {
            result: '你找来树叶、泥土，将石上文字仔细拓印下来。\n虽然只能看懂三成，但这份拓本价值不可估量。\n获得【奇石拓文】（可向学者或高人请教）。',
            tone: 'good',
          };
        },
      },
      {
        label: '绕路而行，此物不寻常',
        icon: '🚶',
        fn: () => ({
          result: '谨慎是江湖人的本能。你大步绕过，没有回头。',
          tone: 'neutral',
        }),
      },
    ],
  },

  // ══════════════════════════════════
  //  同行江湖人系列
  // ══════════════════════════════════
  {
    id: 'enc_fellow_traveler',
    weight: 14, icon: '🧑‍🤝‍🧑',
    title: '同行结伴',
    scene: '山道上，一位背剑的少年正坐在路边歇脚，见到你，咧嘴一笑打招呼。',
    narration: [
      '"嘿，前面的路还有多远？"',
      '这少年虽然衣着简朴，但背后的剑鞘绣工精细，腰间挂着某大门派的信物。',
    ],
    choices: [
      {
        label: '结伴同行，一路聊聊',
        icon: '🤝',
        fn: () => {
          travelPlayerState.energy = Math.min(100, (travelPlayerState.energy||100) + 15);
          travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 6);
          if(typeof travelSave === 'function') travelSave();
          const chats = [
            '一路聊下来，才知他是某门派新晋弟子，外出历练。他话多且直，你们聊了不少江湖趣事——\n精力+15，声誉+6，获得【江湖情报·门派近况】。',
            '他见你武功路数不凡，好奇地缠着你请教。你随手指点几招，他感激道："大哥，你真是我见过最厉害的！"\n精力+15，声誉+6，日行百里不觉累。',
          ];
          return { result: chats[Math.floor(Math.random() * chats.length)], tone: 'good' };
        },
      },
      {
        label: '切磋一两招，打发时间',
        icon: '🥋',
        fn: () => {
          const win = Math.random() < 0.65;
          if(win){
            travelPlayerState.reputation = Math.min(200, (travelPlayerState.reputation||100) + 8);
          } else {
            travelPlayerState.hp = Math.max(10, (travelPlayerState.hp||100) - 5);
          }
          if(typeof travelSave === 'function') travelSave();
          return {
            result: win
              ? '三招两式，你占了上风。少年眼中一片崇拜：\n"前辈高手！在下自愧不如！"\n声誉+8，武技展示名声渐起。'
              : '没想到这小子身手不错，你讨了个平手，还受了点小皮外伤。\n"不错嘛，下次再会！" 他蹦蹦跳跳地走了。\n气血-5%，涨了见识。',
            tone: win ? 'good' : 'neutral',
          };
        },
      },
      {
        label: '随口应付，独行惯了',
        icon: '🤐',
        fn: () => ({
          result: '"各走各路吧。" 你淡淡说，那少年有些失望地点头，各自上路。',
          tone: 'neutral',
        }),
      },
    ],
  },

  // ══════════════════════════════════
  //  稀有奇遇 · 需满足特定条件（tier: rare / legendary）
  // ══════════════════════════════════

  // ── 稀有1：血骨门残党复仇 ──
  {
    id: 'enc_xuegu_revenge', tier: 'rare', weight: 3, icon: '🩸',
    title: '血债血偿',
    scene: '荒郊野道，月色惨淡。一个满身血污的身影从林间踉跄而出，手中紧握一柄断刃。',
    narration: [
      '"别……别过来……" 那人喘息着猛然抬头，是张年轻的脸，',
      '却写满了不属于这个年纪的仇恨。',
      '"你是……血骨门的人？" 他盯着你，忽然惨笑，"你们……杀了师父……"',
    ],
    condition: () => (travelPlayerState?.reputation || 0) >= 30,
    choices: [
      { label: '表明身份，并非仇敌', icon: '🤝', fn: () => {
          if (typeof jianghuState !== 'undefined') jianghuState.reputation = Math.min(200, (jianghuState.reputation||100)+15);
          addSilver(50); SilverManager.save();
          // 添加血骨令牌到背包
          if(typeof addItemToBag === 'function'){
            addItemToBag('item_xuegu_token_frag', 1);
          } else if(typeof edS !== 'undefined' && edS.bag){
            edS.bag.push({instId:'xuegu_'+Date.now(), type:'collectible', templateId:'item_xuegu_token_frag', name:'血骨令牌·残', icon:'🩸', identified:true, affixes:[]});
            if(typeof bagSave === 'function') bagSave();
          }
          return { result: '你表明并非血骨门党羽，年轻人痛哭失声。\n他从怀中掏出一块血染令牌塞入你手中：\n"这是师父遗物……求你替我报仇……"\n银两+50，名声+15，获得【血骨令牌·残】', tone: 'great',
            extraLines: ['✦ 触发隐藏支线：血骨门余孽'] };
        } },
      { label: '冷眼旁观，转身离去', icon: '🚶', fn: () => {
          return { result: '你转身离去。身后传来一声闷响——他倒在地上，再也没起来。\n月色下，你的身影被拉得很长。', tone: 'neutral' };
        } },
    ],
  },

  // ── 稀有2：垂死高手传功 ──
  {
    id: 'enc_dying_master', tier: 'rare', weight: 2, icon: '💀',
    title: '回光返照',
    scene: '山崖边，一袭灰袍的老者盘坐于地，气息微弱却目光如炬。身侧一柄长剑已锈迹斑斑。',
    narration: [
      '"你来了……" 老者的声音像是从很远的地方传来。',
      '"我等了一甲子，等一个心性纯正之人……"',
      '"我的时间不多了……这剑、这功，就交给你了……"',
    ],
    condition: () => (travelPlayerState?.reputation||0) >= 40,
    choices: [
      { label: '跪地受教，郑重承诺', icon: '🙏', fn: () => {
          const gifts = [
            { name:'天璇剑意·残篇', desc:'力道兼备，攻时如星坠，防时如水绵', id:'manual_tianxuan_frag' },
            { name:'玄天真气·心法', desc:'内功修为，通体自如，内力生生不息', id:'manual_xuanzhen_xinfa' },
            { name:'踏月无痕·轻功', desc:'身法绝伦，落地无声，踏月无痕', id:'manual_tayue_qinggong' },
          ];
          const g = gifts[Math.floor(Math.random()*gifts.length)];
          if (typeof jianghuState !== 'undefined') jianghuState.reputation = Math.min(200,(jianghuState.reputation||100)+20);
          travelPlayerState.energy = Math.min(120,(travelPlayerState.energy||100)+30);
          if (typeof travelSave==='function') travelSave();
          // 添加功法秘籍到背包
          if(typeof addItemToBag === 'function'){
            addItemToBag(g.id, 1);
          } else if(typeof edS !== 'undefined' && edS.bag){
            edS.bag.push({instId:'manual_'+Date.now(), type:'collectible', templateId:g.id, name:g.name, icon:'📜', identified:true, affixes:[]});
            if(typeof bagSave === 'function') bagSave();
          }
          return { result: `老者颔首，掌心贴上你天灵盖，一股磅礴内力涌入体内。\n你感到任督二脉豁然贯通。\n✦ 获得：${g.name}（${g.desc}）\n名声+20，精力+30。`, tone:'great', extraLines:[`✦ ${g.name} 已获得`] };
        } },
      { label: '询问老者来历', icon: '❓', fn: () => {
          return { result: '老者轻叹："六十年前，我也是意气风发的少年……可惜一步踏错，满盘皆输。"\n"你若记住今日，便莫负此生。" 语毕，他含笑而逝。', tone:'neutral' };
        } },
    ],
  },

  // ── 传说1：天机令现世 ──
  {
    id: 'enc_tianji_ling', tier: 'legendary', weight: 1, icon: '🏅',
    title: '天机令现世',
    scene: '夜半，荒山之巅。一道紫光冲天而起——那是传说中的天机令！',
    narration: [
      '天机令，号令江湖之信物，百年未曾现世。',
      '各派高手闻此异象，正从四面八方赶来。',
      '此刻，你是唯一在场之人。',
    ],
    condition: () => (travelPlayerState?.reputation||0) >= 60 && (edS?.level||1) >= 30,
    choices: [
      { label: '夺令而走（高风险）', icon: '⚡', fn: () => {
          const ok = Math.random() < 0.35;
          if (ok) {
            addSilver(500); SilverManager.save();
            // 添加天机令到背包
            if(typeof addItemToBag === 'function'){
              addItemToBag('item_tianji_ling_frag', 1);
            } else if(typeof edS !== 'undefined' && edS.bag){
              edS.bag.push({instId:'tianji_'+Date.now(), type:'accessory', templateId:'item_tianji_ling_frag', name:'天机令·残', icon:'🏅', identified:true, affixes:[{key:'repBonus', value:30}]});
              if(typeof bagSave === 'function') bagSave();
            }
            return { result: '你身形一晃，将天机令抢入手中！\n令牌入手，一股磅礴意志涌入脑海，感知力陡然提升。\n✦ 获得【天机令·残】（装备后全江湖声望+30）\n银两+500，声名大振！', tone:'great', extraLines:['✦ 传说成就解锁：天机得主'] };
          } else {
            travelPlayerState.hp = Math.max(10,(travelPlayerState.hp||100)-40);
            if (typeof travelSave==='function') travelSave();
            return { result: '你冲入紫光——被一股无形之力震退！\n一道身影从旁掠过，令牌已被他人夺走。\n你被震伤内腑，气血-40%。', tone:'bad', extraLines:['✦ 天机令已被他人夺去……'] };
          }
        } },
      { label: '静观其变，不冒风险', icon: '🧘', fn: () => {
          if (typeof jianghuState !== 'undefined') jianghuState.reputation = Math.min(200,(jianghuState.reputation||100)+20);
          if (typeof travelSave==='function') travelSave();
          return { result: '各派高手陆续赶到，混乱中无人注意到你。\n你的沉稳被一位正道前辈看在眼里。\n名声+20，触发后续支线：正道高人的赏识。', tone:'good', extraLines:['✦ 正道前辈的赏识'] };
        } },
      { label: '悄然离去，不沾此物', icon: '🚪', fn: () => {
          return { result: '你悄然退出。这是天下至宝，不是你能趟的浑水。\n远处传来激战声，你的身影消失在夜色中。', tone:'neutral' };
        } },
    ],
  },

  // ── 传说2：赌神遗局 ──
  {
    id: 'enc_gambling_legend', tier: 'legendary', weight: 1, icon: '🎲',
    title: '赌神遗局',
    scene: '客栈后院，一位独臂老人正在摆弄一堆骨牌。见到你，他眼中精光一闪。',
    narration: [
      '"会下棋吗？" 老人问。',
      '"我摆的这局，江湖上没人能解。若你能赢我，我便教你几手。"',
    ],
    condition: () => (travelPlayerState?.reputation||0) >= 40,
    choices: [
      { label: '接受挑战，冥思破局', icon: '🧠', fn: () => {
          const ok = Math.random() < 0.25;
          if (ok) { addSilver(800); SilverManager.save(); return { result:'你盯着棋局，忽有所悟——三步连环妙手！\n老人大笑："妙！这局你破了！"', tone:'great', extraLines:['✦ 习得被动【赌神心法】：赌坊胜率+20%','银两+800'] }; }
          return { result:'你苦思良久，仍找不出破解之法。老人摆摆手："不急，慢慢想。"', tone:'neutral' };
        } },
      { label: '谦逊请教，不敢应战', icon: '🙇', fn: () => {
          return { result:'你摇头苦笑："棋艺未精，不敢班门弄斧。"\n老人点头："知道深浅，也是本事。下次再来。"', tone:'neutral' };
        } },
    ],
  },

  // ── 传说3：百味珍馐录 ──
  {
    id: 'enc_secret_recipe', tier: 'legendary', weight: 1, icon: '📜',
    title: '食谱秘卷',
    scene: '藏书阁深处，一卷泛黄的纸卷上写着"百味珍馐录"。',
    narration: [
      '展开一看，是一份详尽的食谱，记载着各种罕见食材的烹饪方法。',
      '据传学会此食谱，普通食材亦可化为珍馐，大幅恢复气血与内力。',
    ],
    condition: () => (travelPlayerState?.reputation||0) >= 50,
    choices: [
      { label: '认真学习此食谱', icon: '📖', fn: () => {
          addSilver(100); SilverManager.save();
          return { result:'你花了一夜时间研读，将食谱内容烂熟于心。\n此后你烹饪的每一道菜都远比常人做得好。\n✦ 习得被动技能：【烹饪精通】（烹饪恢复效果+50%）', tone:'great', extraLines:['✦ 技能已获得：烹饪精通（被动）'] };
        } },
      { label: '记下要点，日后再学', icon: '📝', fn: () => {
          return { result:'你将食谱纲要默记于心，待日后再仔细研读。', tone:'neutral' };
        } },
    ],
  },

];

// ── 奇遇事件触发函数 ────────────────────────────────────────
// 权重随机抽取一个奇遇
function pickEncounterEvent(preferTier) {
  // 兼容旧调用（无参数时走普通抽取）
  if (!preferTier) return _pickEncounterEvent(ENC_TIER.COMMON);
  return _pickEncounterEvent(preferTier);
}

// ── 奇遇弹窗 UI ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
//  "将将胡"特殊事件弹窗
// ═══════════════════════════════════════════════════════════════
function _showTravelJianghuModal(event, result) {
  document.querySelectorAll('.enc-modal').forEach(el => el.remove());

  const modal = document.createElement('div');
  modal.className = 'enc-modal';

  const toneColor = result.tone === 'great' ? '#ffd060' : result.tone === 'good' ? '#60e890' : result.tone === 'bad' ? '#ff6060' : '#c8b478';

  modal.innerHTML = `
    <div class="enc-box" style="border-color:#ffd060;">
      <div class="enc-header">
        <span style="font-size:10px;color:#ffd060;border:1px solid #ffd060;padding:2px 8px;border-radius:20px;margin-right:8px;">将将胡</span>
        <span class="enc-icon">${event.icon}</span>
        <span class="enc-title">${event.title}</span>
      </div>
      <div class="enc-scene">${event.desc}</div>
      <div class="enc-narrate" style="color:${toneColor};padding:12px;background:rgba(255,255,255,.05);border-radius:8px;margin:10px 0;">
        ${result.result.replace(/\n/g, '<br>')}
      </div>
      <button class="enc-skip-btn" onclick="this.closest('.enc-modal').remove()">继续前行</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function showEncounterModal(enc){
  // 移除旧弹窗
  document.querySelectorAll('.enc-modal').forEach(el => el.remove());

  const modal = document.createElement('div');
  modal.className = 'enc-modal';

  // 构建选项HTML
  const choicesHtml = enc.choices.map((c, i) => {
    const disabled = (c.condition && !c.condition()) ? 'disabled' : '';
    const disHint  = disabled ? ' <span class="enc-btn-hint">（条件不足）</span>' : '';
    return `<button class="enc-choice-btn ${disabled}" onclick="encChooseOption(${i})" ${disabled}>${c.icon} ${c.label}${disHint}</button>`;
  }).join('');

  // 旁白行
  const narrateHtml = (enc.narration || []).map(line =>
    `<div class="enc-narrate-line">${line}</div>`
  ).join('');

  modal.innerHTML = `
    <div class="enc-box">
      <div class="enc-header">
        <span class="enc-icon">${enc.icon}</span>
        <span class="enc-title">${enc.title}</span>
        ${enc.tier === 'rare' ? '<span style="font-size:10px;color:#88eebb;margin-left:6px">💠 稀有</span>' : enc.tier === 'legendary' ? '<span style="font-size:10px;color:#ffd060;margin-left:6px">👑 命运</span>' : ''}
      </div>
      <div class="enc-scene">${enc.scene}</div>
      <div class="enc-narrate">${narrateHtml}</div>
      <div class="enc-choices">${choicesHtml}</div>
      <button class="enc-skip-btn" onclick="encSkip()">跳过此事</button>
    </div>
  `;
  document.body.appendChild(modal);
  _curEncounter = enc;

  // 逐行淡入旁白
  requestAnimationFrame(() => {
    modal.classList.add('enc-modal-show');
    modal.querySelectorAll('.enc-narrate-line').forEach((el, i) => {
      setTimeout(() => el.classList.add('enc-line-show'), 300 + i * 280);
    });
    const choiceBox = modal.querySelector('.enc-choices');
    if(choiceBox) setTimeout(() => choiceBox.classList.add('enc-choices-show'), 300 + enc.narration.length * 280 + 200);
  });
}

let _curEncounter = null;

// 选择一个选项
function encChooseOption(idx){
  if(!_curEncounter) return;
  const choice = _curEncounter.choices[idx];
  if(!choice) return;
  if(choice.condition && !choice.condition()){
    if(typeof showToast === 'function') showToast('条件不满足');
    return;
  }

  const resultObj = choice.fn();
  const result = typeof resultObj === 'string' ? resultObj : resultObj.result;
  const tone   = typeof resultObj === 'object'  ? resultObj.tone : 'neutral';

  _showEncounterResult(result, tone, resultObj.extraLines);
}

// 跳过
function encSkip(){
  document.querySelectorAll('.enc-modal').forEach(el => el.remove());
  _curEncounter = null;
}

// 显示结果
function _showEncounterResult(text, tone, extraLines){
  const modal = document.querySelector('.enc-modal');
  if(!modal) return;

  const colorMap = { great:'#ffd060', good:'#88ee88', bad:'#ff7070', neutral:'#aaaaaa' };
  const iconMap  = { great:'✦', good:'✓', bad:'✗', neutral:'◇' };
  const col = colorMap[tone] || colorMap.neutral;
  const ico = iconMap[tone]  || iconMap.neutral;

  const extraHtml = (extraLines || []).map(l => `<div class="enc-extra-line">${l}</div>`).join('');

  modal.querySelector('.enc-box').innerHTML = `
    <div class="enc-result-icon" style="color:${col}">${ico}</div>
    <div class="enc-result-text" style="color:${col}">${text.replace(/\n/g, '<br>')}</div>
    ${extraHtml}
    <button class="enc-close-btn" onclick="encSkip()" style="border-color:${col};color:${col}">继续赶路</button>
  `;
  modal.querySelector('.enc-box').classList.add('enc-result-show');
}

// ── 对外接口：在旅行事件触发后，由 travel.js 以 ~10% 概率调用 ──
// 返回 true 表示已弹出奇遇弹窗（travel.js 可不再处理本次事件）
function tryTriggerEncounter(terrain, playerLv){
  loadEncState(); // 确保状态最新

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"特殊事件优先检查
  // ═══════════════════════════════════════════════════════════════
  for (const event of TRAVEL_JIANGHU_EVENTS) {
    if (Math.random() < event.chance) {
      const result = event.effect();
      _showTravelJianghuModal(event, result);
      return true;
    }
  }

  // 基础触发概率 12%
  let baseProb = 0.12;

  // 应用黄历修正（如果可用）
  if (typeof getAlmanacModifier === 'function' && typeof edS !== 'undefined') {
    // 奇遇属于"好事件"，用 goodMod 修正概率
    const mod = getAlmanacModifier(edS, 'good');
    baseProb *= mod;
  }

  // ═══════════════════════════════════════════════════════════════
  //  "将将胡"连庄机制：好运/霉运会连锁
  // ═══════════════════════════════════════════════════════════════
  const streakBonus = _encState.streakBonus || 0;
  baseProb += streakBonus;
  baseProb = Math.max(0.03, Math.min(0.50, baseProb)); // 限制在3%-50%

  if(Math.random() > baseProb){
    // 没触发奇遇 → 可能断连庄
    if(_encState.streakType === 'good' && _encState.streakCount > 0){
      _encState.streakCount = Math.max(0, _encState.streakCount - 1);
      if(_encState.streakCount === 0) _encState.streakType = null;
      saveEncState();
    }
    return false;
  }
  
  // 先尝试稀有（30%概率给稀有一次机会，受黄历影响）
  let rareProb = 0.30;
  if (typeof getAlmanacModifier === 'function' && typeof edS !== 'undefined') {
    rareProb *= getAlmanacModifier(edS, 'good');
  }
  // 连庄加成也影响稀有概率
  if(_encState.streakType === 'good'){
    rareProb += STREAK_CONFIG.good.rareBonus * _encState.streakCount;
  }
  
  let preferTier = ENC_TIER.COMMON;
  if (Math.random() < rareProb && _encDailyOk(ENC_TIER.RARE) && _encCooldownOk(ENC_TIER.RARE)) {
    preferTier = ENC_TIER.RARE;
  }
  
  // 霉运连庄可能触发陷阱（坏事变好事的反面）
  if(_encState.streakType === 'bad' && _encState.streakCount >= 2){
    if(Math.random() < STREAK_CONFIG.bad.trapChance){
      // 触发陷阱/坏事
      _triggerBadEncounter();
      _updateStreak(false);
      return true;
    }
  }
  
  const enc = pickEncounterEvent(preferTier);
  if(!enc) return false;
  
  // 成功触发奇遇 → 更新连庄
  _updateStreak(true);
  
  showEncounterModal(enc);
  _markEncounterTriggered(enc);
  return true;
}

// ── 触发坏事（霉运连庄）──
function _triggerBadEncounter(){
  const badEvents = [
    { title: '遭遇劫匪', icon: '🔪', desc: '一群蒙面人拦住了你的去路，抢走了你的一些银两！', loss: { silver: 20 } },
    { title: '误入陷阱', icon: '🕳️', desc: '你踩中了猎户设下的陷阱，受了些轻伤。', loss: { hp: 10 } },
    { title: '迷路', icon: '🌫️', desc: '大雾中你迷失了方向，多走了不少冤枉路。', loss: { day: 1 } },
    { title: '马匹受惊', icon: '🐴', desc: '你的坐骑突然受惊狂奔，等你找回它时已疲惫不堪。', loss: { energy: 30 } },
  ];
  const event = badEvents[Math.floor(Math.random() * badEvents.length)];
  
  // 执行损失
  if(event.loss.silver && typeof SilverManager !== 'undefined'){
    SilverManager.add(-event.loss.silver);
    SilverManager.save();
  }
  if(event.loss.hp && typeof edS !== 'undefined'){
    edS.hp = Math.max(1, (edS.hp || 100) - event.loss.hp);
  }
  
  // 显示弹窗
  const modal = document.createElement('div');
  modal.className = 'enc-modal';
  modal.innerHTML = `
    <div class="enc-box" style="border-color:#a06060">
      <div class="enc-title" style="color:#c08080">${event.icon} ${event.title}</div>
      <div class="enc-narration" style="color:#aaa">${event.desc}</div>
      <div style="margin-top:12px;color:#ff7070;font-size:13px">霉运连连…</div>
      <button class="enc-close-btn" onclick="this.closest('.enc-modal').remove()" style="border-color:#a06060;color:#c08080;margin-top:16px">继续前行</button>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('enc-modal-show'));
}

// ── 初始化（由页面 load 时调用）──
function initEncounterSystem() {
  loadEncState();
}

// ── 对外暴露 ──
window.tryTriggerEncounter     = tryTriggerEncounter;
window.showEncounterModal    = showEncounterModal;
window.pickEncounterEvent     = pickEncounterEvent;
window.getEncounterState      = () => ({ ..._encState });
window.initEncounterSystem    = initEncounterSystem;
window.loadEncState           = loadEncState;  // 允许页面主动触发加载

// ── CSS 注入 ─────────────────────────────────────────────────
(function injectEncStyles(){
  if(document.getElementById('enc-styles')) return;
  const st = document.createElement('style');
  st.id = 'enc-styles';
  st.textContent = `
/* ── 奇遇弹窗外层 ── */
.enc-modal {
  position: fixed; inset: 0; z-index: 900;
  background: rgba(0,0,0,.85);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity .3s;
  padding: 16px;
  box-sizing: border-box;
}
.enc-modal.enc-modal-show { opacity: 1; pointer-events: all; }

.enc-box {
  background: linear-gradient(160deg, rgba(20,15,5,.97), rgba(10,8,3,.99));
  border: 1px solid rgba(200,160,80,.3);
  border-radius: 12px;
  padding: 20px 18px 16px;
  max-width: 420px; width: 100%;
  box-shadow: 0 0 40px rgba(200,160,80,.15), 0 8px 32px rgba(0,0,0,.6);
  max-height: 90vh; overflow-y: auto;
}

.enc-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px;
}
.enc-icon { font-size: 26px; }
.enc-title {
  font-size: 18px; font-weight: bold;
  color: rgba(220,185,100,.9);
  letter-spacing: 3px;
  text-shadow: 0 0 12px rgba(200,160,80,.3);
}

.enc-scene {
  font-size: 12px; line-height: 1.8;
  color: rgba(180,160,120,.7);
  border-left: 2px solid rgba(200,160,80,.2);
  padding-left: 10px;
  margin-bottom: 14px;
  letter-spacing: 1px;
}

.enc-narrate { margin-bottom: 14px; }
.enc-narrate-line {
  font-size: 13px; line-height: 1.9;
  color: rgba(220,200,160,.0);
  letter-spacing: 1.5px;
  transition: color .4s, opacity .4s;
  opacity: 0;
}
.enc-narrate-line.enc-line-show {
  color: rgba(220,200,160,.9);
  opacity: 1;
}

.enc-choices {
  display: flex; flex-direction: column; gap: 8px;
  opacity: 0; transform: translateY(8px);
  transition: opacity .35s, transform .35s ease;
}
.enc-choices.enc-choices-show { opacity: 1; transform: translateY(0); }

.enc-choice-btn {
  background: rgba(30,22,8,.9);
  border: 1px solid rgba(200,160,80,.25);
  border-radius: 8px;
  color: rgba(210,185,130,.9);
  padding: 10px 14px;
  text-align: left;
  font-size: 13px; letter-spacing: 1.5px;
  cursor: pointer;
  transition: background .2s, border-color .2s;
}
.enc-choice-btn:hover:not([disabled]) {
  background: rgba(60,40,10,.9);
  border-color: rgba(220,180,80,.5);
}
.enc-choice-btn[disabled] {
  opacity: .4; cursor: not-allowed;
}
.enc-btn-hint { font-size: 10px; color: rgba(180,140,80,.5); }

.enc-skip-btn {
  margin-top: 12px; width: 100%;
  background: transparent;
  border: 1px solid rgba(160,140,100,.2);
  border-radius: 6px;
  color: rgba(160,140,100,.4);
  padding: 7px;
  font-size: 11px; letter-spacing: 2px;
  cursor: pointer;
  transition: border-color .2s, color .2s;
}
.enc-skip-btn:hover { border-color: rgba(160,140,100,.5); color: rgba(160,140,100,.7); }

/* 结果界面 */
.enc-result-show {
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
}
.enc-result-icon {
  font-size: 48px;
  animation: encResultPop .5s cubic-bezier(.175,.885,.32,1.275) forwards;
  margin-bottom: 14px;
}
@keyframes encResultPop {
  0%  { transform: scale(0) rotate(-20deg); opacity: 0; }
  60% { transform: scale(1.2) rotate(5deg); opacity: 1; }
  100%{ transform: scale(1) rotate(0); opacity: 1; }
}
.enc-result-text {
  font-size: 13px; line-height: 1.9;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  text-shadow: 0 0 8px currentColor;
}
.enc-extra-line {
  font-size: 12px; color: rgba(180,200,160,.8);
  letter-spacing: 1px; margin-bottom: 4px;
}
.enc-close-btn {
  margin-top: 10px;
  background: transparent;
  border: 1px solid;
  border-radius: 8px;
  padding: 9px 28px;
  font-size: 13px; letter-spacing: 3px;
  cursor: pointer;
  transition: background .2s;
}
.enc-close-btn:hover { background: rgba(255,255,255,.05); }
  `;
  document.head.appendChild(st);
})();
