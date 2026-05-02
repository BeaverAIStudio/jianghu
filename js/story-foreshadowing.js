/**
 * ============================================================================
 * 《血骨门之乱》伏笔与回收系统 - StoryForeshadowing
 * ============================================================================
 * 精心设计的伏笔系统，让剧情前后呼应，增强叙事深度
 * ============================================================================
 */

(function() {
  'use strict';

  // ==================== 伏笔数据库 ====================
  const FORESHADOWING = {
    // ========== 第一幕伏笔 ==========
    'fs_heyin_guilt': {
      id: 'fs_heyin_guilt',
      name: '鹤隐的愧疚',
      act: 1,
      type: 'character',
      
      // 埋下
      plant: {
        scenes: [
          {
            location: '破庙初遇',
            detail: '鹤隐提到骨冥子时，眼神闪烁，语气复杂',
            dialogue: '骨冥子...他是个可怜人，也是个危险的人。',
            subtle: '他用了"可怜"这个词'
          },
          {
            location: '沧州分别',
            detail: '鹤隐独自望着月亮叹息',
            dialogue: '三十年了...我欠他的，该还了。',
            subtle: '玩家不知道"他"是谁'
          }
        ],
        clues: [
          '鹤隐对骨冥子的了解过于详细',
          '鹤隐提到"正道"时语气带着讽刺',
          '鹤隐的玉佩上刻着"沈"字（如果玩家仔细观察）'
        ]
      },

      // 回收
      payoff: {
        act: 6,
        scene: '真相大白',
        revelation: '鹤隐坦白三十年前是武林盟主，参与灭沈家',
        emotionalImpact: '玩家意识到鹤隐一直在愧疚中活着',
        choice: '玩家可以选择原谅或指责鹤隐',
        resolution: '鹤隐的结局取决于玩家的选择'
      },

      // 关联
      connections: ['fs_xuantie_origin', 'fs_gumingzi_humanity']
    },

    'fs_xuantie_runes': {
      id: 'fs_xuantie_runes',
      name: '玄铁令符文',
      act: 1,
      type: 'item',
      
      plant: {
        scenes: [
          {
            location: '神秘来信',
            detail: '信纸背面有奇怪的符文印记',
            dialogue: '这些符文...似乎在哪里见过。',
            subtle: '玩家可能以为是装饰'
          }
        ],
        clues: [
          '符文与碎片上的符文相似',
          '符文似乎有微弱的魔力波动'
        ]
      },

      payoff: {
        act: 5,
        scene: '玄铁令真相',
        revelation: '符文是上古封印咒文，玄铁令是封印容器',
        twist: '骨冥子一直被利用，玄铁令的真正作用是封印北疆魔头',
        choice: '玩家可以选择销毁玄铁令或重新封印'
      },

      connections: ['fs_north_hint']
    },

    // ========== 第二幕伏笔 ==========
    'fs_fragment_visions': {
      id: 'fs_fragment_visions',
      name: '碎片幻象',
      act: 2,
      type: 'supernatural',
      
      plant: {
        scenes: [
          {
            location: '获得第一块碎片',
            detail: '碎片发出微光，玩家看到模糊画面',
            vision: '古老的战场，一个身影在施展强大的法术',
            subtle: '画面太快，看不清楚'
          },
          {
            location: '碎片侵蚀事件',
            detail: '碎片低语："集齐我...释放我..."',
            subtle: '玩家以为是碎片想要被集齐'
          }
        ],
        clues: [
          '幻象中的法术与血骨门功法不同',
          '低语的声音不是骨冥子的'
        ]
      },

      payoff: {
        act: 6,
        scene: '北疆迷云',
        revelation: '幻象中的人是北疆魔头，玄铁令封印着他的一部分力量',
        twist: '骨冥子收集碎片 inadvertently 在帮助魔头解封',
        emotionalImpact: '玩家意识到一切都被操控了'
      },

      connections: ['fs_north_hint', 'fs_gumingzi_pawn']
    },

    'fs_nangong_secret': {
      id: 'fs_nangong_secret',
      name: '南宫家的秘密',
      act: 2,
      type: 'character',
      
      plant: {
        scenes: [
          {
            location: '南宫世家',
            detail: '南宫烈提到碎片时表情复杂',
            dialogue: '这块碎片...南宫家守护了三代。',
            subtle: '他似乎在隐瞒什么'
          },
          {
            location: '南宫家密室',
            detail: '发现一本残缺的族谱',
            clue: '族谱中提到"沈家"，但被撕掉了'
          }
        ]
      },

      payoff: {
        act: 4,
        scene: '南宫烈坦白',
        revelation: '南宫家与沈家曾是世交，南宫烈的祖父参与灭沈家后愧疚而死',
        emotionalImpact: '南宫烈一直在赎罪，把碎片给玩家也是赎罪的一部分',
        effect: '加深玩家对"正道虚伪"的理解'
      },

      connections: ['fs_gumingzi_tragedy']
    },

    // ========== 第三幕伏笔 ==========
    'fs_traitor_hint': {
      id: 'fs_traitor_hint',
      name: '内鬼线索',
      act: 3,
      type: 'mystery',
      
      plant: {
        scenes: [
          {
            location: '正道会盟',
            detail: '某门派长老对玩家的提问过于详细',
            subtle: '他在打探情报'
          },
          {
            location: '联盟会议',
            detail: '每次讨论机密后，血骨门总能提前知道',
            subtle: '玩家可能以为是巧合'
          }
        ],
        clues: [
          '长老身上有淡淡的血腥味',
          '长老的武功路数与某魔道相似',
          '长老总是在关键时刻提出反对意见'
        ],
        redHerrings: [
          '华山弟子的可疑行踪',
          '峨眉师姐的过度热情'
        ]
      },

      payoff: {
        act: 3,
        scene: '内鬼揭露',
        revelation: '崆峒派长老就是内鬼',
        twist: '他三十年前也参与了灭沈家，被骨冥子要挟',
        moralComplexity: '他既是叛徒，也是受害者',
        choice: '玩家可以选择杀他、放他、或让他将功赎罪'
      },

      connections: ['fs_gumingzi_revenge']
    },

    'fs_lengyue_doubt': {
      id: 'fs_lengyue_doubt',
      name: '冷月的动摇',
      act: 3,
      type: 'character',
      
      plant: {
        scenes: [
          {
            location: '凉州相遇',
            detail: '冷月对教中命令表现出犹豫',
            dialogue: '教中的做法...真的是对的吗？',
            subtle: '她第一次质疑教规'
          }
        ],
        clues: [
          '冷月会偷偷帮助无辜的人',
          '冷月对玩家的态度逐渐软化'
        ]
      },

      payoff: {
        act: 4,
        scene: '月下密会',
        revelation: '冷月决定帮助玩家',
        emotionalMoment: '她在教规和内心之间做出了选择',
        effect: '开启冷月的个人剧情线'
      },

      connections: ['fs_lengyue_past']
    },

    // ========== 第四幕伏笔 ==========
    'fs_undercover_discoveries': {
      id: 'fs_undercover_discoveries',
      name: '潜入发现',
      act: 4,
      type: 'discovery',
      
      plant: {
        scenes: [
          {
            location: '血骨门地牢',
            detail: '发现被囚禁的玄悟大师',
            revelation: '玄悟试图劝说骨冥子放下仇恨',
            clue: '骨冥子没有杀玄悟，只是囚禁'
          },
          {
            location: '骨冥子书房',
            detail: '发现沈家的族谱和旧物',
            clue: '骨冥子一直保留着家人的遗物'
          },
          {
            location: '密室壁画',
            detail: '壁画记载着玄铁令的真正来历',
            clue: '玄铁令是封印之物，不是力量之源'
          }
        ]
      },

      payoff: {
        act: 5,
        scene: '最终真相',
        revelation: '骨冥子一直被蒙在鼓里，玄铁令的真正作用是封印',
        twist: '北疆魔头利用骨冥子的复仇计划，企图解除封印',
        emotionalImpact: '骨冥子的一生都被操控了'
      },

      connections: ['fs_xuantie_origin', 'fs_gumingzi_pawn']
    },

    'fs_gumingzi_humanity': {
      id: 'fs_gumingzi_humanity',
      name: '骨冥子的人性',
      act: 4,
      type: 'character',
      
      plant: {
        scenes: [
          {
            location: '血骨门内',
            detail: '骨冥子放过一个无辜的村民',
            dialogue: '走吧，别让我再看到你。',
            subtle: '他本可以杀那个村民灭口'
          },
          {
            location: '骨冥子房间',
            detail: '发现他在看家人的画像',
            emotional: '画像背面写着"等我报仇"'
          }
        ],
        clues: [
          '骨冥子对老弱妇孺从不伤害',
          '骨冥子会偷偷给沈家扫墓'
        ]
      },

      payoff: {
        act: 5,
        scene: '最终对决',
        revelation: '骨冥子内心深处仍保留着人性',
        choice: '玩家可以选择救赎他',
        possibleEnding: '骨冥子可以被说服，帮助玩家对抗真正的幕后黑手'
      },

      connections: ['fs_gumingzi_tragedy', 'fs_heyin_guilt']
    },

    // ========== 第五幕伏笔 ==========
    'fs_final_choice_setup': {
      id: 'fs_final_choice_setup',
      name: '最终抉择的铺垫',
      act: 5,
      type: 'mechanic',
      
      plant: {
        scenes: [
          {
            location: '决战前',
            detail: '鹤隐警告玩家玄铁令的危险',
            dialogue: '那东西会吞噬使用者的心智。'
          },
          {
            location: '碎片侵蚀事件回忆',
            detail: '玩家曾经抵抗过碎片的力量',
            foreshadowing: '玩家有抵抗玄铁令的意志'
          },
          {
            location: '与冷月的对话',
            detail: '冷月说："无论你怎么选择，我都支持你。"',
            emotional: '为最终选择做情感铺垫'
          }
        ]
      },

      payoff: {
        act: 5,
        scene: '最终抉择',
        choices: [
          { id: 'reject', text: '拒绝玄铁令', foreshadowedBy: '碎片侵蚀的抵抗' },
          { id: 'borrow', text: '借用力量', foreshadowedBy: '鹤隐的警告' },
          { id: 'sacrifice', text: '牺牲自己', foreshadowedBy: '冷月的支持' }
        ]
      },

      connections: ['fs_fragment_visions']
    },

    // ========== 第六幕/全局伏笔 ==========
    'fs_north_hint': {
      id: 'fs_north_hint',
      name: '北疆的线索',
      act: 'global',
      type: 'sequel_setup',
      
      plant: {
        scenes: [
          {
            location: '各处线索',
            detail: '血骨门弟子提到"那位大人"',
            subtle: '骨冥子不是真正的首领'
          },
          {
            location: '玄铁令幻象',
            detail: '幻象中的战场在北方',
            clue: '玄铁令与北方有关'
          },
          {
            location: '结局动画',
            detail: '北疆冰雪中，一双眼睛睁开',
            revelation: '真正的幕后黑手现身'
          }
        ]
      },

      payoff: {
        type: 'sequel',
        title: '北疆迷云',
        setup: '为二周目/续作《北疆风云》埋下伏笔',
        hint: '北疆魔头才是真正的反派，骨冥子只是棋子'
      },

      connections: ['fs_xuantie_origin', 'fs_fragment_visions', 'fs_gumingzi_pawn']
    },

    'fs_gumingzi_pawn': {
      id: 'fs_gumingzi_pawn',
      name: '骨冥子是棋子',
      act: 'global',
      type: 'twist',
      
      plant: {
        scenes: [
          {
            location: '血骨门禁地',
            detail: '发现古老的封印阵法',
            clue: '血骨门建立的目的不只是复兴魔道'
          },
          {
            location: '骨冥子的笔记',
            detail: '提到"那位大人承诺给我力量"',
            clue: '骨冥子背后有人'
          }
        ]
      },

      payoff: {
        act: 6,
        scene: '北疆迷云',
        revelation: '骨冥子被北疆魔头利用了一生',
        tragedy: '他的复仇、他的痛苦，都是别人设计的',
        emotionalImpact: '让玩家重新思考正邪的定义'
      },

      connections: ['fs_north_hint', 'fs_gumingzi_tragedy']
    }
  };

  // ==================== 回收追踪系统 ====================
  class ForeshadowingTracker {
    constructor() {
      this.planted = new Set();    // 已埋下的伏笔
      this.revealed = new Set();   // 已回收的伏笔
      this.missed = new Set();     // 玩家错过的伏笔
    }

    /**
     * 埋下伏笔
     */
    plant(foreshadowingId) {
      this.planted.add(foreshadowingId);
      console.log(`[Foreshadowing] 埋下伏笔: ${foreshadowingId}`);
    }

    /**
     * 回收伏笔
     */
    reveal(foreshadowingId, context = {}) {
      if (!this.planted.has(foreshadowingId)) {
        console.warn(`[Foreshadowing] 回收未埋下的伏笔: ${foreshadowingId}`);
        return null;
      }

      this.revealed.add(foreshadowingId);
      
      const fs = FORESHADOWING[foreshadowingId];
      if (!fs) return null;

      // 计算回收效果
      const impact = this._calculateImpact(fs, context);
      
      return {
        foreshadowing: fs,
        impact,
        missed: this._getMissedClues(foreshadowingId)
      };
    }

    /**
     * 玩家发现线索
     */
    discoverClue(foreshadowingId, clueIndex) {
      // 记录玩家发现了哪些线索
      if (!this._discoveredClues) this._discoveredClues = {};
      if (!this._discoveredClues[foreshadowingId]) {
        this._discoveredClues[foreshadowingId] = new Set();
      }
      this._discoveredClues[foreshadowingId].add(clueIndex);
    }

    /**
     * 获取错过的线索
     */
    _getMissedClues(foreshadowingId) {
      const fs = FORESHADOWING[foreshadowingId];
      if (!fs || !fs.plant || !fs.plant.clues) return [];

      const discovered = this._discoveredClues?.[foreshadowingId] || new Set();
      return fs.plant.clues.filter((_, idx) => !discovered.has(idx));
    }

    /**
     * 计算回收效果
     */
    _calculateImpact(fs, context) {
      const impact = {
        emotional: 0,
        revelation: 0,
        satisfaction: 0
      };

      // 根据发现的线索数量计算满意度
      const discovered = this._discoveredClues?.[fs.id]?.size || 0;
      const total = fs.plant?.clues?.length || 1;
      impact.satisfaction = Math.round((discovered / total) * 100);

      // 根据伏笔类型计算情感冲击
      switch (fs.type) {
        case 'character':
          impact.emotional = 80;
          break;
        case 'twist':
          impact.revelation = 90;
          break;
        case 'sequel_setup':
          impact.revelation = 70;
          break;
        default:
          impact.emotional = 50;
      }

      return impact;
    }

    /**
     * 获取伏笔状态
     */
    getStatus(foreshadowingId) {
      return {
        planted: this.planted.has(foreshadowingId),
        revealed: this.revealed.has(foreshadowingId),
        missed: this.missed.has(foreshadowingId)
      };
    }

    /**
     * 获取所有伏笔统计
     */
    getStats() {
      const total = Object.keys(FORESHADOWING).length;
      return {
        total,
        planted: this.planted.size,
        revealed: this.revealed.size,
        missed: this.missed.size,
        completion: Math.round((this.revealed.size / total) * 100)
      };
    }

    /**
     * 获取某幕的伏笔
     */
    getByAct(actNum) {
      return Object.values(FORESHADOWING).filter(fs => fs.act === actNum);
    }

    /**
     * 获取关联伏笔
     */
    getConnected(foreshadowingId) {
      const fs = FORESHADOWING[foreshadowingId];
      if (!fs || !fs.connections) return [];
      
      return fs.connections.map(id => FORESHADOWING[id]).filter(Boolean);
    }
  }

  // ==================== 核心API ====================
  const StoryForeshadowing = {
    /**
     * 获取伏笔信息
     */
    get(foreshadowingId) {
      return FORESHADOWING[foreshadowingId] || null;
    },

    /**
     * 获取所有伏笔
     */
    getAll() {
      return Object.values(FORESHADOWING);
    },

    /**
     * 按幕次获取伏笔
     */
    getByAct(actNum) {
      return Object.values(FORESHADOWING).filter(fs => fs.act === actNum);
    },

    /**
     * 创建追踪器实例
     */
    createTracker() {
      return new ForeshadowingTracker();
    },

    /**
     * 检查伏笔回收时机
     */
    checkPayoffTiming(currentAct, currentScene) {
      const ready = [];
      
      Object.values(FORESHADOWING).forEach(fs => {
        if (fs.payoff && fs.payoff.act === currentAct) {
          if (!currentScene || fs.payoff.scene === currentScene) {
            ready.push(fs);
          }
        }
      });

      return ready;
    },

    /**
     * 生成伏笔网络图数据
     */
    generateNetworkData() {
      const nodes = Object.values(FORESHADOWING).map(fs => ({
        id: fs.id,
        name: fs.name,
        act: fs.act,
        type: fs.type
      }));

      const links = [];
      Object.values(FORESHADOWING).forEach(fs => {
        if (fs.connections) {
          fs.connections.forEach(targetId => {
            links.push({
              source: fs.id,
              target: targetId
            });
          });
        }
      });

      return { nodes, links };
    },

    // 常量导出
    FORESHADOWING
  };

  // 暴露到全局
  window.StoryForeshadowing = StoryForeshadowing;
  window.ForeshadowingTracker = ForeshadowingTracker;

  console.log('[StoryForeshadowing] 伏笔系统已加载');
  console.log(`- 伏笔数: ${Object.keys(FORESHADOWING).length}`);

})();