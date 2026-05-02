/**
 * ============================================================================
 * 《血骨门之乱》情感弧线系统 - StoryEmotionalArcs
 * ============================================================================
 * 设计角色间的情感发展：友情、背叛、牺牲、成长
 * ============================================================================
 */

(function() {
  'use strict';

  // ==================== 情感弧线定义 ====================
  const EMOTIONAL_ARCS = {
    // ========== 玩家与骨冥子：镜像关系 ==========
    'arc_player_gumingzi': {
      id: 'arc_player_gumingzi',
      name: '正邪之镜',
      characters: ['player', 'npc_gumingzi'],
      type: 'mirror',
      
      stages: [
        {
          act: 1,
          stage: '对立',
          description: '玩家视骨冥子为必须击败的反派',
          playerEmotion: '正义、坚定',
          npcEmotion: '轻蔑、试探',
          keyScene: '鹤隐介绍骨冥子为江湖大患'
        },
        {
          act: 3,
          stage: '了解',
          description: '通过调查，玩家开始了解骨冥子的过去',
          playerEmotion: '困惑、动摇',
          npcEmotion: '复杂、隐藏的痛苦',
          keyScene: '发现骨冥子放过无辜者的证据'
        },
        {
          act: 4,
          stage: '共鸣',
          description: '玩家发现骨冥子与自己有相似之处',
          playerEmotion: '同情、理解',
          npcEmotion: '惊讶、被触动',
          keyScene: '潜入时发现骨冥子保留家人遗物'
        },
        {
          act: 5,
          stage: '抉择',
          description: '最终对决，玩家必须做出选择',
          playerEmotion: '纠结、沉重',
          npcEmotion: '期待解脱、复杂的希望',
          keyScene: '骨冥子倾诉过去，玩家选择杀/放/救赎',
          branches: {
            kill: '骨冥子含笑而逝，玩家背负沉重',
            spare: '骨冥子自废武功，两人成为特殊的知己',
            redeem: '骨冥子帮助玩家，共同对抗幕后黑手'
          }
        }
      ],

      themes: ['正义与复仇的界限', '仇恨如何毁灭一个人', '救赎的可能性']
    },

    // ========== 玩家与鹤隐：师徒之情 ==========
    'arc_player_heyin': {
      id: 'arc_player_heyin',
      name: '师徒传承',
      characters: ['player', 'npc_heyin'],
      type: 'mentor_student',
      
      stages: [
        {
          act: 1,
          stage: '相遇',
          description: '神秘老者选中玩家',
          playerEmotion: '好奇、信任',
          npcEmotion: '期待、隐藏愧疚',
          keyScene: '破庙初遇，鹤隐交付使命'
        },
        {
          act: 3,
          stage: '疑惑',
          description: '玩家发现鹤隐对骨冥子的态度异常',
          playerEmotion: '怀疑、困惑',
          npcEmotion: '痛苦、挣扎',
          keyScene: '鹤隐独自叹息，提到三十年前'
        },
        {
          act: 6,
          stage: '真相',
          description: '鹤隐坦白过去',
          playerEmotion: '震惊、复杂',
          npcEmotion: '解脱、恐惧被拒绝',
          keyScene: '鹤隐讲述灭沈家真相',
          branches: {
            forgive: '鹤隐得到救赎，成为真正的导师',
            blame: '鹤隐心碎，但尊重玩家的选择',
            understand: '复杂的和解，关系更加真实'
          }
        }
      ],

      themes: ['导师的缺陷', '传承与责任', '原谅与成长']
    },

    // ========== 玩家与冷月：情愫暗生 ==========
    'arc_player_lengyue': {
      id: 'arc_player_lengyue',
      name: '正邪之恋',
      characters: ['player', 'npc_lengyue'],
      type: 'romance',
      optional: true,
      
      stages: [
        {
          act: 2,
          stage: '相遇',
          description: '敌对势力的女子，却有不忍之心',
          playerEmotion: '警惕、好奇',
          npcEmotion: '冷淡、隐藏关注',
          keyScene: '凉州相遇，冷月放走玩家'
        },
        {
          act: 3,
          stage: '关注',
          description: '冷月开始关注玩家的动向',
          playerEmotion: '困惑、被吸引',
          npcEmotion: '动摇、挣扎',
          keyScene: '正道会盟时，冷月暗中观察'
        },
        {
          act: 4,
          stage: '信任',
          description: '月下密会，冷月决定帮助玩家',
          playerEmotion: '感动、心动',
          npcEmotion: '坚定、忐忑',
          keyScene: '月下密会，冷月透露情报'
        },
        {
          act: 5,
          stage: '抉择',
          description: '冷月必须在教规和爱情之间选择',
          playerEmotion: '担忧、期待',
          npcEmotion: '痛苦、勇敢',
          keyScene: '冷月做出最终选择',
          branches: {
            leave: '放弃圣女身份，跟随玩家',
            stay: '继续担任圣女，但暗中帮助玩家',
            sacrifice: '为救玩家而牺牲'
          }
        }
      ],

      themes: ['爱情跨越正邪', '个人幸福与责任', '牺牲与成全']
    },

    // ========== 骨冥子与鹤隐：旧日恩怨 ==========
    'arc_gumingzi_heyin': {
      id: 'arc_gumingzi_heyin',
      name: '恩怨难了',
      characters: ['npc_gumingzi', 'npc_heyin'],
      type: 'tragedy',
      
      stages: [
        {
          act: 'past',
          stage: '知己',
          description: '三十年前，沈墨与鹤隐是至交好友',
          emotion: '友情、信任',
          keyEvent: '两人共同游历江湖'
        },
        {
          act: 'past',
          stage: '背叛',
          description: '灭门之夜，鹤隐参与行动',
          emotion: '震惊、绝望、仇恨',
          keyEvent: '沈墨目睹鹤隐在场'
        },
        {
          act: 'present',
          stage: '对立',
          description: '骨冥子对鹤隐又恨又念',
          emotion: '复杂的仇恨',
          keyEvent: '骨冥子多次有机会杀鹤隐，却始终没有下手'
        },
        {
          act: 5,
          stage: '解脱',
          description: '最终对决，两人的恩怨有个了断',
          emotion: '释然、悲伤',
          keyEvent: '根据玩家选择，两人可能和解或同归于尽'
        }
      ],

      themes: ['友情的背叛', '仇恨的代价', '和解的可能']
    },

    // ========== 正道联盟：团结与裂痕 ==========
    'arc_alliance': {
      id: 'arc_alliance',
      name: '正道之光',
      characters: ['faction_good'],
      type: 'group',
      
      stages: [
        {
          act: 3,
          stage: '团结',
          description: '正道联盟成立，共抗魔道',
          emotion: '激昂、希望',
          keyEvent: '正道会盟'
        },
        {
          act: 3,
          stage: '裂痕',
          description: '内鬼事件暴露联盟内部问题',
          emotion: '怀疑、失望',
          keyEvent: '内鬼揭露'
        },
        {
          act: 4,
          stage: '考验',
          description: '联盟面临分裂危机',
          emotion: '焦虑、挣扎',
          keyEvent: '部分门派想要退出'
        },
        {
          act: 5,
          stage: '重生',
          description: '在玩家努力下，联盟重新团结',
          emotion: '坚定、团结',
          keyEvent: '决战前的动员'
        }
      ],

      themes: ['团结的力量', '内部的敌人', '信念的考验']
    },

    // ========== 玩家成长弧线 ==========
    'arc_player_growth': {
      id: 'arc_player_growth',
      name: '侠客之路',
      characters: ['player'],
      type: 'growth',
      
      stages: [
        {
          act: 1,
          stage: '懵懂',
          description: '初入江湖，对正邪只有简单认知',
          trait: '天真、理想化',
          keyEvent: '接受鹤隐的使命'
        },
        {
          act: 2,
          stage: '历练',
          description: '经历江湖险恶，开始明白世事复杂',
          trait: '成熟、谨慎',
          keyEvent: '碎片侵蚀事件，面对力量诱惑'
        },
        {
          act: 3,
          stage: '责任',
          description: '承担起重任，成为正道希望',
          trait: '担当、领导力',
          keyEvent: '被推举为先锋'
        },
        {
          act: 4,
          stage: '迷茫',
          description: '发现正道的黑暗面，信念动摇',
          trait: '困惑、挣扎',
          keyEvent: '潜入血骨门，了解骨冥子的过去'
        },
        {
          act: 5,
          stage: '坚定',
          description: '超越正邪之分，找到属于自己的正义',
          trait: '智慧、坚定',
          keyEvent: '最终抉择'
        },
        {
          act: 6,
          stage: '传承',
          description: '成为新一代武林领袖',
          trait: '成熟、睿智',
          keyEvent: '战后建立新秩序'
        }
      ],

      themes: ['成长的代价', '找到自己的道路', '超越二元对立']
    }
  };

  // ==================== 情感事件系统 ====================
  const EMOTIONAL_EVENTS = {
    // 牺牲事件
    'ee_sacrifice': {
      name: '牺牲',
      variants: [
        {
          id: 'sacrifice_lengyue',
          character: 'npc_lengyue',
          trigger: '玩家面临致命危险',
          scene: '冷月为玩家挡下致命一击',
          dialogue: '能遇见你...是我这辈子...最幸福的事...',
          impact: '玩家获得永久BUFF"冷月的祝福"'
        },
        {
          id: 'sacrifice_heyin',
          character: 'npc_heyin',
          trigger: '鹤隐为赎罪',
          scene: '鹤隐用毕生功力封印玄铁令',
          dialogue: '三十年前的债...今日还清...',
          impact: '玩家获得鹤隐的全部武学传承'
        },
        {
          id: 'sacrifice_gumingzi',
          character: 'npc_gumingzi',
          trigger: '骨冥子被救赎后',
          scene: '骨冥子为救玩家，与北疆魔头同归于尽',
          dialogue: '这一次...我选择做对的事...',
          impact: '骨冥子的牺牲让武林震动，正邪开始和解'
        }
      ]
    },

    // 背叛事件
    'ee_betrayal': {
      name: '背叛',
      variants: [
        {
          id: 'betrayal_traitor',
          character: '崆峒派长老',
          trigger: '正道会盟期间',
          scene: '揭露内鬼身份',
          twist: '他被骨冥子要挟，也是受害者',
          impact: '玩家对"正道"产生怀疑'
        }
      ]
    },

    // 和解事件
    'ee_reconciliation': {
      name: '和解',
      variants: [
        {
          id: 'recon_gumingzi_heyin',
          characters: ['npc_gumingzi', 'npc_heyin'],
          trigger: '最终决战前',
          scene: '骨冥子与鹤隐面对面',
          dialogue: {
            gumingzi: '三十年了...你老了。',
            heyin: '沈墨...我对不起你。',
            resolution: '骨冥子：过去的事...就让它过去吧。'
          },
          impact: '两人的和解为整个故事带来希望'
        }
      ]
    }
  };

  // ==================== 核心API ====================
  const StoryEmotionalArcs = {
    /**
     * 获取情感弧线
     */
    getArc(arcId) {
      return EMOTIONAL_ARCS[arcId] || null;
    },

    /**
     * 获取角色的所有情感弧线
     */
    getArcsByCharacter(characterId) {
      return Object.values(EMOTIONAL_ARCS).filter(arc => 
        arc.characters.includes(characterId)
      );
    },

    /**
     * 获取某幕的情感发展
     */
    getArcsByAct(actNum) {
      const result = [];
      Object.values(EMOTIONAL_ARCS).forEach(arc => {
        const stage = arc.stages.find(s => s.act === actNum);
        if (stage) {
          result.push({ arc, stage });
        }
      });
      return result;
    },

    /**
     * 获取情感事件
     */
    getEmotionalEvent(eventType, variantId) {
      const event = EMOTIONAL_EVENTS[eventType];
      if (!event) return null;
      
      if (variantId) {
        return event.variants.find(v => v.id === variantId) || null;
      }
      return event;
    },

    /**
     * 计算情感弧线完成度
     */
    calculateArcProgress(arcId, currentAct) {
      const arc = EMOTIONAL_ARCS[arcId];
      if (!arc) return 0;

      const totalStages = arc.stages.length;
      const completedStages = arc.stages.filter(s => 
        typeof s.act === 'number' && s.act <= currentAct
      ).length;

      return Math.round((completedStages / totalStages) * 100);
    },

    /**
     * 生成情感报告
     */
    generateEmotionalReport(playerChoices) {
      const report = {
        completedArcs: [],
        activeArcs: [],
        keyMoments: [],
        emotionalJourney: []
      };

      Object.values(EMOTIONAL_ARCS).forEach(arc => {
        const progress = this.calculateArcProgress(arc.id, 6);
        
        if (progress === 100) {
          report.completedArcs.push(arc);
        } else if (progress > 0) {
          report.activeArcs.push({ arc, progress });
        }

        // 收集关键情感时刻
        arc.stages.forEach(stage => {
          if (stage.keyScene) {
            report.keyMoments.push({
              arc: arc.name,
              act: stage.act,
              scene: stage.keyScene,
              emotion: stage.playerEmotion || stage.emotion || stage.trait
            });
          }
        });
      });

      return report;
    },

    // 常量导出
    EMOTIONAL_ARCS,
    EMOTIONAL_EVENTS
  };

  // 暴露到全局
  window.StoryEmotionalArcs = StoryEmotionalArcs;

  console.log('[StoryEmotionalArcs] 情感弧线系统已加载');
  console.log(`- 情感弧线: ${Object.keys(EMOTIONAL_ARCS).length}`);
  console.log(`- 情感事件: ${Object.keys(EMOTIONAL_EVENTS).length}`);

})();