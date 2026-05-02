/**
 * ============================================================================
 * 《血骨门之乱》NPC背景故事与人物志 - StoryNpcLore
 * ============================================================================
 * 深度刻画主线关键NPC的背景故事、人物性格、动机与命运
 * ============================================================================
 */

(function() {
  'use strict';

  // ==================== 核心NPC人物志 ====================
  const NPC_LORE = {
    // ========== 骨冥子 - 血骨门门主 ==========
    'npc_gumingzi': {
      name: '骨冥子',
      title: '血骨门门主',
      age: 52,
      gender: 'male',
      
      // 过去
      origin: {
        birthName: '沈墨',
        family: '江南书香门第沈家',
        childhood: '天资聪颖，五岁能诵诗，十岁通武艺',
        tragedy: {
          year: '三十年前',
          event: '正道联盟以"勾结魔教"为由，灭沈家满门',
          survivors: '仅沈墨一人被老仆救出',
          trauma: '亲眼目睹父母被所谓"正道"杀害'
        }
      },

      // 转变
      transformation: {
        escape: '被老仆带入血骨门，拜入上一代门主门下',
        newName: '骨冥子 - 取"骨"字纪念白骨累累，"冥"字寓意冥界复仇',
        rise: '二十年间，从普通弟子到门主',
        philosophy: '正道即伪道，唯有力量才是真理'
      },

      // 性格
      personality: {
        surface: '阴冷、残忍、野心勃勃',
        inner: '内心深处仍保留着对家人的思念',
        contradiction: '憎恨正道，却欣赏真正的侠义之人',
        weakness: '对亲情有着病态的执念'
      },

      // 动机
      motivation: {
        primary: '毁灭正道联盟，为家族复仇',
        secondary: '证明"正道"的虚伪',
        hidden: '内心深处渴望被理解、被救赎'
      },

      // 与玄铁令的关系
      xuantieLing: {
        obsession: '认为玄铁令是颠覆武林秩序的关键',
        research: '花费二十年研究玄铁令的秘密',
        discovery: '发现玄铁令可以吸取他人内力',
        fear: '也害怕玄铁令的力量会反噬'
      },

      // 关键剧情节点
      storyBeats: [
        {
          act: 5,
          scene: '最终决战',
          revelation: '向玩家倾诉自己的过去',
          choice: '玩家可以选择理解他或坚持正义',
          endings: {
            kill: '骨冥子含笑而逝，终于解脱',
            spare: '骨冥子自废武功，隐居山林',
            redeem: '骨冥子帮助玩家对抗真正的幕后黑手'
          }
        }
      ],

      // 人物关系
      relationships: {
        'npc_heyin': { type: 'complex', desc: '曾经的知己，因理念不同而决裂' },
        'npc_lengyue': { type: 'pawn', desc: '利用冷月接近玄冥教，但内心有愧疚' },
        'player': { type: 'mirror', desc: '看到玩家就像看到年轻时的自己' }
      },

      // 经典台词
      quotes: [
        '正道？呵，不过是披着仁义外衣的豺狼！',
        '你可知道，三十年前，我也曾相信过"侠义"二字？',
        '沈墨已死，站在你面前的，是骨冥子！',
        '来吧，让我看看，你的正义能不能救得了这个虚伪的江湖！'
      ]
    },

    // ========== 鹤隐 - 神秘老者 ==========
    'npc_heyin': {
      name: '鹤隐',
      title: '江湖隐士',
      age: 68,
      gender: 'male',
      
      origin: {
        birthName: '未知',
        past: '三十年前武林盟主，与沈墨之父是至交',
        guilt: '未能阻止沈家灭门，愧疚一生',
        seclusion: '自那后隐退江湖，化名鹤隐'
      },

      transformation: {
        reason: '为弥补当年的过错，暗中关注骨冥子',
        discovery: '发现骨冥子就是当年的沈墨',
        conflict: '既想阻止骨冥子，又想救赎他',
        plan: '培养新一代侠客，以正义阻止仇恨'
      },

      personality: {
        surface: '神秘、睿智、深不可测',
        inner: '被愧疚折磨，渴望赎罪',
        strength: '看透世事，不被正邪之分束缚',
        weakness: '对骨冥子始终下不了狠心'
      },

      motivation: {
        primary: '阻止骨冥子毁灭武林',
        secondary: '救赎骨冥子，弥补当年过错',
        hidden: '希望有人能打破正邪对立的循环'
      },

      storyBeats: [
        {
          act: 1,
          scene: '初识玩家',
          action: '选中玩家作为阻止骨冥子的人选',
          reason: '看到玩家身上有纯粹的侠义之心'
        },
        {
          act: 6,
          scene: '真相揭露',
          revelation: '向玩家坦白自己的过去和与骨冥子的关系',
          choice: '玩家可以选择原谅或指责鹤隐'
        }
      ],

      relationships: {
        'npc_gumingzi': { type: 'guilt', desc: '对骨冥子有深深的愧疚' },
        'player': { type: 'mentor', desc: '视玩家为打破循环的希望' }
      },

      quotes: [
        '江湖不是非黑即白，人心更是如此。',
        '三十年前，我犯了一个错，这个错让我愧疚至今。',
        '骨冥子...不，沈墨，他本不该走上这条路。',
        '孩子，记住，正义不是为了复仇，而是为了守护。'
      ]
    },

    // ========== 冷月 - 玄冥教圣女 ==========
    'npc_lengyue': {
      name: '冷月',
      title: '玄冥教圣女',
      age: 24,
      gender: 'female',
      
      origin: {
        birth: '玄冥教圣女之女，自幼被培养为下一代圣女',
        childhood: '在教中长大，不知外界',
        talent: '修炼玄冥教至高心法"玄冥神功"',
        burden: '圣女的使命是守护教中至宝'
      },

      transformation: {
        awakening: '一次外出任务中，看到普通人的生活',
        doubt: '开始质疑教中教义',
        meeting: '在凉州与玩家相遇，被玩家的侠义打动',
        choice: '在教规与内心之间挣扎'
      },

      personality: {
        surface: '清冷、疏离、不近人情',
        inner: '渴望自由，向往普通人的生活',
        strength: '武功高强，心性坚韧',
        weakness: '被教规束缚，不敢追求自己想要的生活'
      },

      motivation: {
        primary: '完成圣女使命，保护玄冥教',
        secondary: '暗中帮助玩家阻止血骨门',
        hidden: '渴望摆脱圣女身份，过上普通生活'
      },

      storyBeats: [
        {
          act: 4,
          scene: '月下密会',
          action: '向玩家透露骨冥子的情报',
          conflict: '背叛教规帮助玩家，内心挣扎'
        },
        {
          act: 5,
          scene: '最终抉择',
          choice: '玩家可以选择带她离开玄冥教或尊重她的选择',
          endings: {
            leave: '放弃圣女身份，跟随玩家游历江湖',
            stay: '继续担任圣女，但改革教中陋习',
            sacrifice: '为救玩家，挡下致命一击'
          }
        }
      ],

      relationships: {
        'npc_gumingzi': { type: 'pawn', desc: '被骨冥子利用，但逐渐看清真相' },
        'player': { type: 'love', desc: '对玩家暗生情愫' }
      },

      quotes: [
        '我生来就是圣女，从未有人问过我想不想当。',
        '你...你和他们不一样。',
        '如果我不是圣女，如果我只是普通人...',
        '去吧，做你认为对的事。我会...一直看着你的。'
      ]
    },

    // ========== 南宫烈 - 南宫世家之主 ==========
    'npc_nangong_lie': {
      name: '南宫烈',
      title: '南宫世家之主',
      age: 45,
      gender: 'male',
      
      origin: {
        family: '武林四大家族之一南宫家',
        upbringing: '自幼被教育要守护家族荣誉',
        responsibility: '二十岁继承家主之位',
        burden: '守护家族至宝——玄铁令碎片'
      },

      transformation: {
        crisis: '血骨门袭击南宫世家',
        rescue: '被玩家所救',
        realization: '意识到单凭家族力量无法对抗血骨门',
        decision: '将碎片托付给玩家，加入正道联盟'
      },

      personality: {
        surface: '豪爽、正直、重情重义',
        inner: '对家族责任感到沉重',
        strength: '武功高强，领导力强',
        weakness: '有时过于刚直，不懂变通'
      },

      motivation: {
        primary: '保护南宫世家',
        secondary: '对抗血骨门，为死去的族人报仇',
        hidden: '希望武林能恢复和平'
      },

      storyBeats: [
        {
          act: 2,
          scene: '南宫世家之劫',
          action: '将玄铁令碎片托付给玩家',
          significance: '标志着玩家正式卷入玄铁令之争'
        },
        {
          act: 3,
          scene: '正道会盟',
          action: '支持玩家担任先锋',
          reason: '相信玩家的能力和品格'
        }
      ],

      relationships: {
        'player': { type: 'ally', desc: '视玩家为生死之交' }
      },

      quotes: [
        '南宫世家世代守护此物，今日托付给少侠，望少侠不负所托！',
        '大恩不言谢，从今往后，少侠的事就是我南宫烈的事！',
        '正道？哼，我南宫烈只信一个道理——恩怨分明！'
      ]
    },

    // ========== 玄悟大师 - 失踪的少林首座 ==========
    'npc_xuanwu': {
      name: '玄悟',
      title: '少林首座',
      age: 70,
      gender: 'male',
      
      origin: {
        temple: '少林寺首座，武功深不可测',
        reputation: '被誉为"少林百年第一人"',
        secret: '三十年前参与灭沈家行动',
        guilt: '事后发现沈家是被冤枉的，愧疚难当'
      },

      transformation: {
        disappearance: '三年前突然失踪，留下一封忏悔信',
        search: '据说在寻找沈家后人，想要赎罪',
        discovery: '发现骨冥子就是沈墨',
        attempt: '试图劝说骨冥子放下仇恨，失败后被囚禁'
      },

      personality: {
        surface: '慈悲、智慧、德高望重',
        inner: '被过去的罪孽折磨',
        strength: '武功绝顶，佛法精深',
        weakness: '无法原谅自己过去的错误'
      },

      motivation: {
        primary: '赎罪，弥补当年过错',
        secondary: '阻止骨冥子继续错下去',
        hidden: '希望得到沈家后人的原谅'
      },

      storyBeats: [
        {
          act: 4,
          scene: '血骨门地牢',
          discovery: '玩家潜入时发现被囚禁的玄悟',
          revelation: '玄悟向玩家坦白三十年前的真相'
        },
        {
          act: 5,
          scene: '最终决战',
          action: '玄悟挣脱束缚，试图最后劝说骨冥子',
          outcome: '根据玩家选择，可能牺牲自己救骨冥子，或与骨冥子同归于尽'
        }
      ],

      relationships: {
        'npc_gumingzi': { type: 'guilt', desc: '对骨冥子有深深的愧疚' },
        'npc_heyin': { type: 'ally', desc: '当年一同参与灭门，一同愧疚' }
      },

      quotes: [
        '老衲罪孽深重，三十年来无一日安睡。',
        '沈施主...不，骨冥子，放下屠刀，回头是岸啊！',
        '老衲这条命，今日便还给沈家！'
      ]
    },

    // ========== 北疆神秘人 - 幕后黑手 ==========
    'npc_mystery_north': {
      name: '???',
      title: '北疆神秘人',
      age: '未知',
      gender: 'unknown',
      
      origin: {
        identity: '真·幕后黑手，一切事件的真正策划者',
        history: '百年前被正道封印的魔道巨擘',
        return: '利用骨冥子的复仇计划，暗中操控一切',
        goal: '借骨冥子之手收集玄铁令，解除自身封印'
      },

      personality: {
        surface: '神秘、莫测、深不见底',
        inner: '对正道有着刻骨的仇恨',
        strength: '智谋深远，布局百年',
        weakness: '过于自信，低估人性中的善'
      },

      motivation: {
        primary: '解除封印，重出江湖',
        secondary: '毁灭正道，建立魔道统治',
        hidden: '对当年封印自己的人的复仇'
      },

      storyBeats: [
        {
          act: 6,
          scene: '北疆迷云',
          revelation: '揭示骨冥子只是棋子，真正的反派现身',
          setup: '为二周目/续作埋下伏笔'
        }
      ],

      quotes: [
        '骨冥子？不过是一枚好用的棋子罢了。',
        '百年了...终于等到这一天。',
        '来吧，让我看看，你们这些所谓的正道，能奈我何！'
      ]
    }
  };

  // ==================== 势力背景设定 ====================
  const FACTION_LORE = {
    'xuegu_men': {
      name: '血骨门',
      origin: '百年前魔道分支，专修血系功法',
      philosophy: '以血为引，以骨为媒，追求极致力量',
      hierarchy: [
        { rank: '门主', desc: '骨冥子，最高统治者' },
        { rank: '副门主', desc: '血刃，协助门主' },
        { rank: '四大护法', desc: '鬼刀、千手、追魂、血爪' },
        { rank: '堂主', desc: '各分坛负责人' },
        { rank: '弟子', desc: '普通成员' }
      ],
      secrets: '门中禁地藏着百年前魔道巨擘的封印',
      relationship: '与玄冥教、日月神教结盟，但各怀鬼胎'
    },

    'zhengdao_lianmeng': {
      name: '正道联盟',
      origin: '三十年前为对抗魔道而成立',
      members: ['少林', '武当', '峨眉', '昆仑', '华山', '崆峒', '天山', '南宫世家', '圣光教'],
      philosophy: '维护武林正义，铲除魔道',
      darkSide: '三十年前冤杀沈家，内部并非铁板一块',
      current: '面临血骨门威胁，急需团结'
    },

    'sanmo_lianmeng': {
      name: '三魔联盟',
      origin: '血骨门牵头，联合玄冥教、日月神教',
      goal: '颠覆正道统治，建立魔道秩序',
      weakness: '各怀鬼胎，随时可能内讧',
      leader: '表面以骨冥子为首，实则各派自有算计'
    }
  };

  // ==================== 关键剧情线索 ====================
  const STORY_CLUES = {
    // 伏笔
    'clue_heyin_guilt': {
      description: '鹤隐对骨冥子的态度异常复杂',
      placement: ['第一幕：鹤隐提到骨冥子时眼神闪烁', '第三幕：鹤隐独自叹息'],
      payoff: '第六幕：鹤隐坦白与骨冥子的关系'
    },

    'clue_xuantie_origin': {
      description: '玄铁令的真正来历',
      placement: ['第二幕：碎片上的古老符文', '第四幕：幽州地牢中的壁画'],
      payoff: '隐藏地下城：玄铁令的真相'
    },

    'clue_north_hint': {
      description: '北疆的神秘力量',
      placement: ['第五幕：骨冥子提到"那位大人"', '第六幕：结局动画'],
      payoff: '二周目/续作：北疆剧情'
    },

    // 情感线索
    'clue_lengyue_feeling': {
      description: '冷月对玩家的情愫',
      placement: ['第二幕：冷月偷看玩家的眼神', '第四幕：月下密会时的关心'],
      payoff: '第五幕：冷月的抉择'
    },

    'clue_gumingzi_humanity': {
      description: '骨冥子内心深处的人性',
      placement: ['第三幕：骨冥子放过无辜村民', '第四幕：骨冥子对旧物的留恋'],
      payoff: '第五幕：骨冥子的救赎可能'
    }
  };

  // ==================== 核心API ====================
  const StoryNpcLore = {
    /**
     * 获取NPC人物志
     */
    getNpcLore(npcId) {
      return NPC_LORE[npcId] || null;
    },

    /**
     * 获取势力背景
     */
    getFactionLore(factionId) {
      return FACTION_LORE[factionId] || null;
    },

    /**
     * 获取剧情线索
     */
    getClue(clueId) {
      return STORY_CLUES[clueId] || null;
    },

    /**
     * 获取NPC在某个剧情节点的台词
     */
    getNpcQuote(npcId, context) {
      const npc = NPC_LORE[npcId];
      if (!npc || !npc.quotes) return null;
      
      // 根据上下文返回合适的台词
      if (context === 'battle') {
        return npc.quotes.filter(q => q.includes('！') || q.includes('来'));
      } else if (context === 'sad') {
        return npc.quotes.filter(q => q.includes('...') || q.includes('愧疚'));
      }
      return npc.quotes;
    },

    /**
     * 获取NPC关系网
     */
    getRelationshipNetwork() {
      const network = {};
      Object.entries(NPC_LORE).forEach(([id, npc]) => {
        if (npc.relationships) {
          network[id] = npc.relationships;
        }
      });
      return network;
    },

    /**
     * 生成人物关系图数据
     */
    generateRelationshipGraph() {
      const nodes = Object.entries(NPC_LORE).map(([id, npc]) => ({
        id,
        name: npc.name,
        title: npc.title,
        group: this._getNpcGroup(id)
      }));

      const links = [];
      Object.entries(NPC_LORE).forEach(([id, npc]) => {
        if (npc.relationships) {
          Object.entries(npc.relationships).forEach(([targetId, rel]) => {
            links.push({
              source: id,
              target: targetId,
              type: rel.type,
              desc: rel.desc
            });
          });
        }
      });

      return { nodes, links };
    },

    _getNpcGroup(npcId) {
      const groups = {
        'npc_gumingzi': 'antagonist',
        'npc_heyin': 'mentor',
        'npc_lengyue': 'ally',
        'npc_nangong_lie': 'ally',
        'npc_xuanwu': 'mentor',
        'npc_mystery_north': 'true_antagonist'
      };
      return groups[npcId] || 'neutral';
    },

    /**
     * 获取所有NPC列表
     */
    getAllNpcs() {
      return Object.entries(NPC_LORE).map(([id, npc]) => ({
        id,
        name: npc.name,
        title: npc.title,
        age: npc.age,
        gender: npc.gender
      }));
    },

    /**
     * 搜索NPC
     */
    searchNpcs(keyword) {
      return Object.entries(NPC_LORE)
        .filter(([id, npc]) => 
          npc.name.includes(keyword) || 
          npc.title.includes(keyword) ||
          (npc.origin && npc.origin.birthName && npc.origin.birthName.includes(keyword))
        )
        .map(([id, npc]) => ({ id, ...npc }));
    },

    /**
     * 获取NPC在某个幕次的关键剧情
     */
    getNpcStoryBeat(npcId, act) {
      const npc = NPC_LORE[npcId];
      if (!npc || !npc.storyBeats) return null;
      
      return npc.storyBeats.find(beat => beat.act === act);
    },

    // 常量导出
    NPC_LORE,
    FACTION_LORE,
    STORY_CLUES
  };

  // 暴露到全局
  window.StoryNpcLore = StoryNpcLore;

  console.log('[StoryNpcLore] NPC人物志系统已加载');
  console.log(`- NPC数: ${Object.keys(NPC_LORE).length}`);
  console.log(`- 势力数: ${Object.keys(FACTION_LORE).length}`);
  console.log(`- 线索数: ${Object.keys(STORY_CLUES).length}`);

})();