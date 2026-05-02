/**
 * ============================================================================
 * 《血骨门之乱》配音脚本系统 - StoryVoiceScripts
 * ============================================================================
 * 为关键剧情节点提供完整的配音文本、情绪标注、音效提示
 * 支持：旁白、角色对话、战斗呐喊、环境音效
 * ============================================================================
 */

(function() {
  'use strict';

  // ==================== 配音脚本数据库 ====================
  const VOICE_SCRIPTS = {
    // ========== 第一幕：乱世起 ==========
    'act1_opening': {
      title: '序章·乱世起',
      type: 'narration',
      bgm: 'melancholic_guzheng',
      segments: [
        {
          speaker: 'narrator',
          text: '江湖，从来不缺传说。',
          emotion: 'solemn',
          duration: 3000,
          sfx: null
        },
        {
          speaker: 'narrator',
          text: '但这一次，传说染上了血色。',
          emotion: 'ominous',
          duration: 3500,
          sfx: 'wind_howling'
        },
        {
          speaker: 'narrator',
          text: '血骨门，一个本该消失在历史尘埃中的名字，正在卷土重来...',
          emotion: 'tense',
          duration: 5000,
          sfx: 'heartbeat_slow'
        }
      ]
    },

    'act1_letter_arrival': {
      title: '神秘来信',
      type: 'dialogue',
      bgm: 'mysterious_flute',
      segments: [
        {
          speaker: 'narrator',
          text: '一封没有署名的信，悄然出现在你的门前。',
          emotion: 'curious',
          duration: 4000,
          sfx: 'paper_rustle'
        },
        {
          speaker: '鹤隐',
          text: '少侠，江湖大难将至，唯有你能阻止这一切。',
          emotion: 'urgent',
          duration: 4500,
          sfx: null
        },
        {
          speaker: '鹤隐',
          text: '三日后，沧州城外的破庙，我等你。',
          emotion: 'mysterious',
          duration: 4000,
          sfx: 'wind_chimes'
        }
      ]
    },

    'act1_meet_heyin': {
      title: '初识鹤隐',
      type: 'dialogue',
      bgm: 'encounter_theme',
      segments: [
        {
          speaker: 'narrator',
          text: '破庙中，一道身影负手而立，仿佛已等待千年。',
          emotion: 'awe',
          duration: 4000,
          sfx: 'temple_bell_distant'
        },
        {
          speaker: '鹤隐',
          text: '你来了...比我想象的更有胆识。',
          emotion: 'approving',
          duration: 3500,
          sfx: null
        },
        {
          speaker: '鹤隐',
          text: '血骨门在沧州有秘密据点，我要你去查清楚。',
          emotion: 'serious',
          duration: 4500,
          sfx: null
        },
        {
          speaker: '鹤隐',
          text: '记住，活着回来。江湖需要你。',
          emotion: 'concerned',
          duration: 4000,
          sfx: 'wind_gust'
        }
      ]
    },

    // ========== 第二幕：风云变色 ==========
    'act2_fragment_power': {
      title: '碎片之力',
      type: 'dialogue',
      bgm: 'mystical_theme',
      segments: [
        {
          speaker: 'narrator',
          text: '玄铁令碎片在手中微微颤动，一股奇异的力量流入体内。',
          emotion: 'mystical',
          duration: 4500,
          sfx: 'magical_hum'
        },
        {
          speaker: '系统提示',
          text: '你感觉到内力在飞速增长，但心中也升起一丝躁动...',
          emotion: 'warning',
          duration: 4000,
          sfx: 'heartbeat_fast'
        }
      ]
    },

    'act2_nangong_rescue': {
      title: '南宫世家之劫',
      type: 'dialogue',
      bgm: 'heroic_theme',
      segments: [
        {
          speaker: '南宫烈',
          text: '多谢少侠相救！南宫世家欠你一条命！',
          emotion: 'grateful',
          duration: 3500,
          sfx: null
        },
        {
          speaker: '南宫烈',
          text: '这玄铁令碎片...本是我家传之宝，如今赠予恩公！',
          emotion: 'determined',
          duration: 4000,
          sfx: 'sword_unsheathe'
        },
        {
          speaker: 'narrator',
          text: '南宫烈将碎片郑重地放在你手中，眼中满是不舍与决然。',
          emotion: 'bittersweet',
          duration: 4500,
          sfx: null
        }
      ]
    },

    'act2_fragment_corruption': {
      title: '碎片侵蚀',
      type: 'monologue',
      bgm: 'dark_theme',
      segments: [
        {
          speaker: 'narrator',
          text: '夜深人静，碎片在月光下泛着诡异的红光。',
          emotion: 'ominous',
          duration: 3500,
          sfx: 'whispers_distant'
        },
        {
          speaker: '内心独白',
          text: '这股力量...它在呼唤我...只要我接受它...',
          emotion: 'tempted',
          duration: 4000,
          sfx: 'heartbeat_slow'
        },
        {
          speaker: '内心独白',
          text: '不！我不能被它控制！',
          emotion: 'struggle',
          duration: 3000,
          sfx: 'glass_shatter'
        }
      ]
    },

    // ========== 第三幕：三魔联盟 ==========
    'act3_league_meeting': {
      title: '正道会盟',
      type: 'dialogue',
      bgm: 'grand_theme',
      segments: [
        {
          speaker: '少林方丈',
          text: '阿弥陀佛，今日群雄汇聚，共商抗魔大计。',
          emotion: 'solemn',
          duration: 4500,
          sfx: 'monk_chant'
        },
        {
          speaker: '武当掌门',
          text: '血骨门、玄冥教、日月神教联手，江湖危在旦夕！',
          emotion: 'urgent',
          duration: 4000,
          sfx: null
        },
        {
          speaker: '峨眉掌门',
          text: '我提议，由这位少侠担任先锋，深入敌后！',
          emotion: 'determined',
          duration: 4000,
          sfx: 'crowd_murmur'
        }
      ]
    },

    'act3_leader_choice': {
      title: '盟主之争',
      type: 'dialogue',
      bgm: 'tense_theme',
      segments: [
        {
          speaker: '鹤隐',
          text: '少侠，众望所归，这盟主之位...',
          emotion: 'expectant',
          duration: 3500,
          sfx: null
        },
        {
          speaker: '选项A-接受',
          text: '承蒙各位信任，我定不负所托！',
          emotion: 'heroic',
          duration: 3500,
          sfx: 'cheer_crowd'
        },
        {
          speaker: '选项B-推辞',
          text: '晚辈资历尚浅，愿为先锋，但盟主之位还请前辈担当。',
          emotion: 'humble',
          duration: 4500,
          sfx: 'approving_murmur'
        },
        {
          speaker: '选项C-独断',
          text: '既然各位信任我，那我便当仁不让。但有言在先——一切听我号令！',
          emotion: 'dominant',
          duration: 5000,
          sfx: 'shocked_gasp'
        }
      ]
    },

    // ========== 第四幕：联盟裂隙 ==========
    'act4_undercover_start': {
      title: '潜入开始',
      type: 'narration',
      bgm: 'stealth_theme',
      segments: [
        {
          speaker: 'narrator',
          text: '血骨门总坛，戒备森严。',
          emotion: 'tense',
          duration: 3000,
          sfx: 'footsteps_echo'
        },
        {
          speaker: 'narrator',
          text: '你深吸一口气，踏入了这龙潭虎穴...',
          emotion: 'determined',
          duration: 4000,
          sfx: 'heavy_door_creak'
        }
      ]
    },

    'act4_meet_lengyue': {
      title: '月下密会',
      type: 'dialogue',
      bgm: 'romantic_tension',
      segments: [
        {
          speaker: '冷月',
          text: '你终于来了，我等你很久了。',
          emotion: 'mysterious',
          duration: 3500,
          sfx: 'wind_soft'
        },
        {
          speaker: '冷月',
          text: '骨冥子正在闭关修炼玄铁令，这是唯一的机会。',
          emotion: 'urgent_whisper',
          duration: 4000,
          sfx: null
        },
        {
          speaker: '冷月',
          text: '但你要答应我...不要杀他。',
          emotion: 'pleading',
          duration: 3500,
          sfx: 'heartbeat'
        }
      ]
    },

    'act4_moral_test': {
      title: '道德考验',
      type: 'dialogue',
      bgm: 'moral_dilemma',
      segments: [
        {
          speaker: '血骨门弟子',
          text: '大侠饶命！我...我只是被逼无奈！',
          emotion: 'terrified',
          duration: 3500,
          sfx: 'kneeling'
        },
        {
          speaker: '血骨门弟子',
          text: '我上有老下有小，求您放我一条生路！',
          emotion: 'desperate',
          duration: 4000,
          sfx: 'sobbing'
        },
        {
          speaker: 'narrator',
          text: '你看着眼前这个瑟瑟发抖的人，手中的剑微微颤抖...',
          emotion: 'conflicted',
          duration: 4500,
          sfx: 'sword_tremble'
        }
      ]
    },

    // ========== 第五幕：生死之战 ==========
    'act5_final_battle_start': {
      title: '决战前夜',
      type: 'narration',
      bgm: 'epic_preparation',
      segments: [
        {
          speaker: 'narrator',
          text: '血骨门总坛深处，玄铁令的光芒照亮了整个大殿。',
          emotion: 'epic',
          duration: 4500,
          sfx: 'magical_surge'
        },
        {
          speaker: 'narrator',
          text: '骨冥子站在祭坛之上，周身环绕着恐怖的黑气。',
          emotion: 'ominous',
          duration: 4000,
          sfx: 'dark_energy'
        },
        {
          speaker: '骨冥子',
          text: '终于来了...我等你很久了，玄铁令的容器。',
          emotion: 'mocking',
          duration: 4500,
          sfx: 'evil_laughter'
        }
      ]
    },

    'act5_gumingzi_dialogue': {
      title: '骨冥子的真相',
      type: 'dialogue',
      bgm: 'revelation_theme',
      segments: [
        {
          speaker: '骨冥子',
          text: '你以为我是反派？可笑！',
          emotion: 'bitter',
          duration: 3500,
          sfx: null
        },
        {
          speaker: '骨冥子',
          text: '三十年前，正是这些所谓的正道，灭我满门！',
          emotion: 'angry',
          duration: 4500,
          sfx: 'thunder_crack'
        },
        {
          speaker: '骨冥子',
          text: '我只是...拿回属于我的东西！',
          emotion: 'defiant',
          duration: 4000,
          sfx: 'power_surge'
        }
      ]
    },

    'act5_final_choice': {
      title: '最终抉择',
      type: 'dialogue',
      bgm: 'climax_theme',
      segments: [
        {
          speaker: '骨冥子',
          text: '来吧，做出你的选择！',
          emotion: 'challenging',
          duration: 3500,
          sfx: 'wind_howling'
        },
        {
          speaker: '选项A-拒绝',
          text: '我不会用玄铁令！我要用我自己的力量击败你！',
          emotion: 'heroic',
          duration: 4500,
          sfx: 'sword_power_up'
        },
        {
          speaker: '选项B-借用',
          text: '玄铁令，借我力量！但我会控制它，而不是被它控制！',
          emotion: 'determined',
          duration: 5000,
          sfx: 'magical_charge'
        },
        {
          speaker: '选项C-牺牲',
          text: '如果必须有人牺牲...那就让我来吧！',
          emotion: 'sacrificial',
          duration: 4500,
          sfx: 'sad_melody'
        }
      ]
    },

    'act5_battle_cry': {
      title: '决战呐喊',
      type: 'battle',
      bgm: 'intense_battle',
      segments: [
        {
          speaker: '玩家',
          text: '为了江湖！为了正义！',
          emotion: 'battle_cry',
          duration: 3000,
          sfx: 'war_cry'
        },
        {
          speaker: '骨冥子',
          text: '来吧！让我看看你有什么本事！',
          emotion: 'battle_cry',
          duration: 3500,
          sfx: 'evil_roar'
        }
      ]
    },

    // ========== 第六幕：战后余波 ==========
    'act6_victory': {
      title: '胜利时刻',
      type: 'narration',
      bgm: 'triumphant_theme',
      segments: [
        {
          speaker: 'narrator',
          text: '骨冥子倒下了，玄铁令的光芒渐渐消散。',
          emotion: 'triumphant',
          duration: 4500,
          sfx: 'magical_fade'
        },
        {
          speaker: 'narrator',
          text: '江湖，终于迎来了和平。',
          emotion: 'peaceful',
          duration: 4000,
          sfx: 'birds_chirping'
        }
      ]
    },

    'act6_sacrifice_ending': {
      title: '壮烈牺牲结局',
      type: 'narration',
      bgm: 'sad_heroic',
      segments: [
        {
          speaker: 'narrator',
          text: '你用生命封印了玄铁令，换来了江湖的安宁。',
          emotion: 'sorrowful',
          duration: 4500,
          sfx: 'wind_mournful'
        },
        {
          speaker: '鹤隐',
          text: '少侠...你做到了。江湖会记住你的。',
          emotion: 'grieving',
          duration: 4000,
          sfx: 'single_bell'
        },
        {
          speaker: 'narrator',
          text: '从此，江湖流传着一个传说——一个无名英雄，拯救了整个世界。',
          emotion: 'legendary',
          duration: 5500,
          sfx: 'epic_theme_soft'
        }
      ]
    },

    'act6_hidden_truth': {
      title: '北疆迷云',
      type: 'narration',
      bgm: 'mysterious_ending',
      segments: [
        {
          speaker: 'narrator',
          text: '然而，在北疆的冰雪之中，一双眼睛正注视着这一切...',
          emotion: 'ominous',
          duration: 4500,
          sfx: 'blizzard_wind'
        },
        {
          speaker: '神秘人',
          text: '骨冥子...不过是一枚棋子罢了。',
          emotion: 'cold',
          duration: 4000,
          sfx: 'footsteps_snow'
        },
        {
          speaker: '神秘人',
          text: '真正的游戏，现在才开始。',
          emotion: 'menacing',
          duration: 4000,
          sfx: 'evil_laughter_distant'
        }
      ]
    }
  };

  // ==================== 角色声音配置 ====================
  const VOICE_PROFILES = {
    'narrator': {
      name: '旁白',
      gender: 'neutral',
      age: 'adult',
      tone: '深沉、庄重',
      speed: 'medium',
      description: '全知视角，引导玩家进入剧情'
    },
    '鹤隐': {
      name: '鹤隐',
      gender: 'male',
      age: 'elder',
      tone: '沧桑、智慧',
      speed: 'slow',
      description: '神秘的江湖前辈，声音中带着岁月的沉淀'
    },
    '骨冥子': {
      name: '骨冥子',
      gender: 'male',
      age: 'middle',
      tone: '阴冷、疯狂',
      speed: 'variable',
      description: '血骨门门主，声音时而低沉时而尖锐'
    },
    '冷月': {
      name: '冷月',
      gender: 'female',
      age: 'young',
      tone: '清冷、神秘',
      speed: 'medium',
      description: '玄冥教圣女，声音如月光般清冷'
    },
    '南宫烈': {
      name: '南宫烈',
      gender: 'male',
      age: 'middle',
      tone: '豪爽、正直',
      speed: 'fast',
      description: '南宫世家之主，声音洪亮有力'
    },
    '少林方丈': {
      name: '少林方丈',
      gender: 'male',
      age: 'elder',
      tone: '慈悲、威严',
      speed: 'slow',
      description: '少林方丈，声音如钟磬般庄严'
    },
    '武当掌门': {
      name: '武当掌门',
      gender: 'male',
      age: 'middle',
      tone: '正直、急切',
      speed: 'medium',
      description: '武当掌门，声音中带着侠义之气'
    },
    '峨眉掌门': {
      name: '峨眉掌门',
      gender: 'female',
      age: 'middle',
      tone: '坚定、慈爱',
      speed: 'medium',
      description: '峨眉掌门，声音温柔但有力'
    },
    '玩家': {
      name: '玩家',
      gender: 'variable',
      age: 'young',
      tone: '根据选择变化',
      speed: 'medium',
      description: '主角，声音随道德值和选择变化'
    },
    '内心独白': {
      name: '内心独白',
      gender: 'variable',
      age: 'young',
      tone: '私密、真实',
      speed: 'slow',
      description: '主角内心声音，比对话更私密'
    },
    '系统提示': {
      name: '系统提示',
      gender: 'neutral',
      age: 'adult',
      tone: '机械、清晰',
      speed: 'medium',
      description: '游戏系统提示音'
    },
    '神秘人': {
      name: '神秘人',
      gender: 'unknown',
      age: 'unknown',
      tone: '冰冷、莫测',
      speed: 'slow',
      description: '北疆的神秘存在，声音仿佛来自虚空'
    }
  };

  // ==================== 音效库 ====================
  const SFX_LIBRARY = {
    // 环境音效
    'wind_howling': { name: '狂风呼啸', type: 'ambient', duration: 3000 },
    'wind_soft': { name: '微风轻拂', type: 'ambient', duration: 2000 },
    'wind_gust': { name: '阵风', type: 'ambient', duration: 1500 },
    'wind_mournful': { name: '悲风', type: 'ambient', duration: 4000 },
    'blizzard_wind': { name: '暴风雪', type: 'ambient', duration: 5000 },
    'temple_bell_distant': { name: '远处钟声', type: 'ambient', duration: 3000 },
    'single_bell': { name: '单声钟响', type: 'ambient', duration: 2000 },
    'birds_chirping': { name: '鸟鸣', type: 'ambient', duration: 2500 },
    
    // 动作音效
    'paper_rustle': { name: '纸张翻动', type: 'action', duration: 1000 },
    'sword_unsheathe': { name: '拔剑', type: 'action', duration: 800 },
    'sword_tremble': { name: '剑颤', type: 'action', duration: 1500 },
    'footsteps_echo': { name: '回声脚步', type: 'action', duration: 2000 },
    'footsteps_snow': { name: '雪地脚步', type: 'action', duration: 2000 },
    'heavy_door_creak': { name: '重门开启', type: 'action', duration: 2500 },
    'kneeling': { name: '跪地', type: 'action', duration: 800 },
    'glass_shatter': { name: '玻璃破碎', type: 'action', duration: 1000 },
    
    // 魔法音效
    'magical_hum': { name: '魔法嗡鸣', type: 'magic', duration: 3000 },
    'magical_surge': { name: '魔法涌动', type: 'magic', duration: 4000 },
    'magical_fade': { name: '魔法消散', type: 'magic', duration: 3000 },
    'magical_charge': { name: '魔法充能', type: 'magic', duration: 3500 },
    'dark_energy': { name: '黑暗能量', type: 'magic', duration: 4000 },
    'power_surge': { name: '力量爆发', type: 'magic', duration: 3000 },
    
    // 人声音效
    'evil_laughter': { name: '邪恶笑声', type: 'voice', duration: 3000 },
    'evil_laughter_distant': { name: '远处邪笑', type: 'voice', duration: 3500 },
    'evil_roar': { name: '邪恶咆哮', type: 'voice', duration: 2500 },
    'war_cry': { name: '战吼', type: 'voice', duration: 2000 },
    'cheer_crowd': { name: '人群欢呼', type: 'voice', duration: 3000 },
    'approving_murmur': { name: '赞同低语', type: 'voice', duration: 2500 },
    'shocked_gasp': { name: '震惊抽气', type: 'voice', duration: 1500 },
    'crowd_murmur': { name: '人群议论', type: 'voice', duration: 2500 },
    'sobbing': { name: '哭泣', type: 'voice', duration: 2000 },
    'monk_chant': { name: '诵经声', type: 'voice', duration: 4000 },
    'whispers_distant': { name: '远处低语', type: 'voice', duration: 3500 },
    
    // 情绪音效
    'heartbeat_slow': { name: '缓慢心跳', type: 'emotion', duration: 2000 },
    'heartbeat_fast': { name: '快速心跳', type: 'emotion', duration: 2000 },
    'heartbeat': { name: '心跳', type: 'emotion', duration: 1500 },
    'wind_chimes': { name: '风铃', type: 'emotion', duration: 2500 }
  };

  // ==================== BGM配置 ====================
  const BGM_LIBRARY = {
    'melancholic_guzheng': { name: '哀伤古筝', mood: '悲伤', intensity: 'low' },
    'mysterious_flute': { name: '神秘笛音', mood: '神秘', intensity: 'low' },
    'encounter_theme': { name: '相遇主题', mood: '期待', intensity: 'medium' },
    'mystical_theme': { name: '玄妙主题', mood: '玄幻', intensity: 'medium' },
    'heroic_theme': { name: '英雄主题', mood: '激昂', intensity: 'high' },
    'dark_theme': { name: '黑暗主题', mood: '压抑', intensity: 'medium' },
    'grand_theme': { name: '宏大主题', mood: '庄严', intensity: 'high' },
    'tense_theme': { name: '紧张主题', mood: '紧张', intensity: 'medium' },
    'stealth_theme': { name: '潜行主题', mood: '隐秘', intensity: 'low' },
    'romantic_tension': { name: '浪漫张力', mood: '暧昧', intensity: 'low' },
    'moral_dilemma': { name: '道德困境', mood: '纠结', intensity: 'medium' },
    'epic_preparation': { name: '史诗准备', mood: '期待', intensity: 'high' },
    'revelation_theme': { name: '真相揭示', mood: '震惊', intensity: 'high' },
    'climax_theme': { name: '高潮主题', mood: '决战', intensity: 'max' },
    'intense_battle': { name: '激烈战斗', mood: '战斗', intensity: 'max' },
    'triumphant_theme': { name: '胜利主题', mood: '喜悦', intensity: 'high' },
    'sad_heroic': { name: '悲壮英雄', mood: '悲伤', intensity: 'high' },
    'mysterious_ending': { name: '神秘结局', mood: '悬念', intensity: 'medium' }
  };

  // ==================== 核心API ====================
  const StoryVoiceScripts = {
    /**
     * 获取指定场景的完整配音脚本
     */
    getScript(sceneId) {
      return VOICE_SCRIPTS[sceneId] || null;
    },

    /**
     * 获取角色声音配置
     */
    getVoiceProfile(speaker) {
      return VOICE_PROFILES[speaker] || null;
    },

    /**
     * 获取音效信息
     */
    getSfx(sfxId) {
      return SFX_LIBRARY[sfxId] || null;
    },

    /**
     * 获取BGM信息
     */
    getBgm(bgmId) {
      return BGM_LIBRARY[bgmId] || null;
    },

    /**
     * 获取所有场景列表
     */
    getAllScenes() {
      return Object.keys(VOICE_SCRIPTS).map(id => ({
        id,
        ...VOICE_SCRIPTS[id]
      }));
    },

    /**
     * 按幕次获取场景
     */
    getScenesByAct(actNum) {
      const prefix = `act${actNum}_`;
      return Object.keys(VOICE_SCRIPTS)
        .filter(id => id.startsWith(prefix))
        .map(id => ({ id, ...VOICE_SCRIPTS[id] }));
    },

    /**
     * 获取角色所有台词
     */
    getLinesBySpeaker(speaker) {
      const lines = [];
      Object.entries(VOICE_SCRIPTS).forEach(([sceneId, scene]) => {
        scene.segments.forEach((seg, idx) => {
          if (seg.speaker === speaker) {
            lines.push({
              sceneId,
              sceneTitle: scene.title,
              index: idx,
              ...seg
            });
          }
        });
      });
      return lines;
    },

    /**
     * 生成配音脚本导出（用于外包配音）
     */
    generateVoicePack() {
      const pack = {
        project: '血骨门之乱',
        totalScenes: Object.keys(VOICE_SCRIPTS).length,
        totalLines: 0,
        characters: {},
        scenes: []
      };

      Object.entries(VOICE_SCRIPTS).forEach(([id, scene]) => {
        const sceneData = {
          id,
          title: scene.title,
          type: scene.type,
          bgm: scene.bgm,
          lines: scene.segments.map((seg, idx) => ({
            lineId: `${id}_${idx}`,
            speaker: seg.speaker,
            text: seg.text,
            emotion: seg.emotion,
            duration: seg.duration,
            sfx: seg.sfx,
            characterProfile: VOICE_PROFILES[seg.speaker] || null
          }))
        };
        pack.totalLines += scene.segments.length;
        pack.scenes.push(sceneData);

        // 统计角色台词数
        scene.segments.forEach(seg => {
          if (!pack.characters[seg.speaker]) {
            pack.characters[seg.speaker] = {
              profile: VOICE_PROFILES[seg.speaker],
              lineCount: 0,
              scenes: []
            };
          }
          pack.characters[seg.speaker].lineCount++;
          if (!pack.characters[seg.speaker].scenes.includes(id)) {
            pack.characters[seg.speaker].scenes.push(id);
          }
        });
      });

      return pack;
    },

    /**
     * 生成音效需求清单
     */
    generateSfxList() {
      const usedSfx = new Set();
      Object.values(VOICE_SCRIPTS).forEach(scene => {
        scene.segments.forEach(seg => {
          if (seg.sfx) usedSfx.add(seg.sfx);
        });
      });

      return Array.from(usedSfx).map(sfxId => ({
        id: sfxId,
        ...SFX_LIBRARY[sfxId]
      }));
    },

    /**
     * 生成BGM需求清单
     */
    generateBgmList() {
      const usedBgm = new Set();
      Object.values(VOICE_SCRIPTS).forEach(scene => {
        if (scene.bgm) usedBgm.add(scene.bgm);
      });

      return Array.from(usedBgm).map(bgmId => ({
        id: bgmId,
        ...BGM_LIBRARY[bgmId]
      }));
    },

    /**
     * 播放场景配音（模拟）
     */
    playScene(sceneId, options = {}) {
      const script = VOICE_SCRIPTS[sceneId];
      if (!script) {
        console.warn(`[VoiceScripts] 场景不存在: ${sceneId}`);
        return;
      }

      const { onLineStart, onLineEnd, onComplete, autoPlay = false } = options;
      let currentIndex = 0;

      const playNext = () => {
        if (currentIndex >= script.segments.length) {
          onComplete && onComplete();
          return;
        }

        const segment = script.segments[currentIndex];
        onLineStart && onLineStart(currentIndex, segment);

        // 模拟播放时间
        setTimeout(() => {
          onLineEnd && onLineEnd(currentIndex, segment);
          currentIndex++;
          playNext();
        }, segment.duration);
      };

      if (autoPlay) {
        playNext();
      }

      return {
        totalLines: script.segments.length,
        totalDuration: script.segments.reduce((sum, s) => sum + s.duration, 0),
        play: playNext,
        script
      };
    },

    /**
     * 搜索台词
     */
    searchLines(keyword) {
      const results = [];
      Object.entries(VOICE_SCRIPTS).forEach(([sceneId, scene]) => {
        scene.segments.forEach((seg, idx) => {
          if (seg.text.includes(keyword) || seg.speaker.includes(keyword)) {
            results.push({
              sceneId,
              sceneTitle: scene.title,
              lineIndex: idx,
              ...seg
            });
          }
        });
      });
      return results;
    },

    // 常量导出
    VOICE_SCRIPTS,
    VOICE_PROFILES,
    SFX_LIBRARY,
    BGM_LIBRARY
  };

  // 暴露到全局
  window.StoryVoiceScripts = StoryVoiceScripts;

  console.log('[StoryVoiceScripts] 配音脚本系统已加载');
  console.log(`- 场景数: ${Object.keys(VOICE_SCRIPTS).length}`);
  console.log(`- 角色数: ${Object.keys(VOICE_PROFILES).length}`);
  console.log(`- 音效数: ${Object.keys(SFX_LIBRARY).length}`);
  console.log(`- BGM数: ${Object.keys(BGM_LIBRARY).length}`);

})();