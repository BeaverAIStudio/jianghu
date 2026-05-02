/**
 * ============================================================================
 * 《血骨门之乱》支线与主线交织事件系统 - StoryBranchEvents
 * ============================================================================
 * 让支线任务与主线剧情深度交织，形成有机整体
 * ============================================================================
 */

(function() {
  'use strict';

  // ==================== 支线-主线交织事件 ====================
  const BRANCH_EVENTS = {
    // ========== 第一幕交织事件 ==========
    'be_cangzhou_villager': {
      id: 'be_cangzhou_villager',
      name: '沧州村民的请求',
      act: 1,
      trigger: '到达沧州后',
      type: 'side_main_intersect',
      
      story: {
        setup: '沧州村民向你求助，说最近有神秘人在城外活动',
        investigation: '调查发现是血骨门弟子在招募人手',
        choice: {
          optionA: {
            text: '直接击退血骨门弟子',
            effect: { moral: 5, reputation: { faction_good: 5 } },
            consequence: '打草惊蛇，血骨门加强戒备'
          },
          optionB: {
            text: '假意加入，获取情报',
            effect: { moral: -5, intel: '获得血骨门据点位置' },
            consequence: '获得潜入据点的机会'
          }
        },
        payoff: '无论选择如何，都会引导玩家发现血骨门据点'
      },

      connection: {
        mainQuest: 'mq_act1_cangzhou',
        effect: '提前获得据点情报，或增加潜入难度'
      }
    },

    'be_old_man_heyin': {
      id: 'be_old_man_heyin',
      name: '神秘老者的过去',
      act: 1,
      trigger: '与鹤隐对话后',
      type: 'character_lore',
      
      story: {
        setup: '在洛阳遇到一位认识鹤隐的老者',
        revelation: '老者透露鹤隐三十年前是武林盟主',
        mystery: '提到鹤隐与沈家的关系，话到嘴边突然咽住',
        clue: '留下一块玉佩，说是鹤隐当年之物'
      },

      connection: {
        mainQuest: 'mq_act6_truth',
        effect: '为第六幕鹤隐的真相埋下伏笔'
      }
    },

    // ========== 第二幕交织事件 ==========
    'be_songshan_monk': {
      id: 'be_songshan_monk',
      name: '嵩山石窟的僧人',
      act: 2,
      trigger: '进入嵩山石窟前',
      type: 'side_main_intersect',
      
      story: {
        setup: '遇到一位守护石窟的老僧',
        background: '老僧讲述石窟中封印着上古邪物',
        warning: '提到最近有人试图解开封印',
        choice: {
          optionA: {
            text: '请老僧协助封印邪物',
            effect: { moral: 5, help: '老僧提供封印法器' }
          },
          optionB: {
            text: '独自进入，不连累他人',
            effect: { moral: 0, difficulty: '战斗难度增加' }
          }
        }
      },

      connection: {
        mainQuest: 'mq_act2_songshan',
        effect: '影响与上古石魔的战斗'
      }
    },

    'be_fragment_whisper': {
      id: 'be_fragment_whisper',
      name: '碎片的低语',
      act: 2,
      trigger: '获得第一块碎片后',
      type: 'supernatural',
      
      story: {
        setup: '夜晚，碎片发出微弱的光芒',
        vision: '玩家看到模糊的幻象——一个古老的战场',
        voice: '听到低语声："集齐我...释放我..."',
        choice: {
          resist: {
            text: '抵抗碎片的影响',
            effect: { moral: 5, willpower: +10 }
          },
          listen: {
            text: '倾听碎片的声音',
            effect: { moral: -5, knowledge: '获得玄铁令的线索' }
          }
        }
      },

      connection: {
        mainQuest: 'mq_act2_fragment_corruption',
        effect: '影响碎片侵蚀事件的难度'
      }
    },

    // ========== 第三幕交织事件 ==========
    'be_league_spy': {
      id: 'be_league_spy',
      name: '联盟中的眼线',
      act: 3,
      trigger: '正道会盟期间',
      type: 'investigation',
      
      story: {
        setup: '发现正道联盟中有血骨门的间谍',
        investigation: '通过一系列线索排查嫌疑人',
        suspects: ['多疑的崆峒派长老', '行踪诡异的华山弟子', '过于热情的峨眉师姐'],
        truth: '真正的间谍是...（根据玩家选择可变）',
        choice: {
          accuse_right: '指认正确，获得联盟信任',
          accuse_wrong: '指认错误，引起内部矛盾',
          expose_all: '揭露所有嫌疑人，但打草惊蛇'
        }
      },

      connection: {
        mainQuest: 'mq_act3_traitor',
        effect: '影响内鬼揭露的剧情走向'
      }
    },

    'be_rival_challenger': {
      id: 'be_rival_challenger',
      name: '宿敌的挑战',
      act: 3,
      trigger: '声望达到一定程度',
      type: 'rivalry',
      
      story: {
        setup: '一位自称"追风剑"的剑客向你挑战',
        background: '他声称你抢了他的风头',
        battle: '公平对决',
        outcome: {
          win: '追风剑认输，成为你的追随者',
          lose: '追风剑嘲讽你，但给你改进的建议',
          spare: '放过追风剑，他对你改观'
        },
        payoff: '追风剑后续会在关键时刻帮助你'
      },

      connection: {
        mainQuest: 'mq_act5_final_battle',
        effect: '追风剑会在最终决战时增援'
      }
    },

    // ========== 第四幕交织事件 ==========
    'be_undercover_dilemma': {
      id: 'be_undercover_dilemma',
      name: '潜入的道德困境',
      act: 4,
      trigger: '潜入血骨门期间',
      type: 'moral_choice',
      
      story: {
        setup: '伪装成血骨门弟子时，被要求执行残忍任务',
        task: '处决一名"叛徒"——实际上是无辜者',
        dilemma: '执行任务会暴露身份，不执行也会引起怀疑',
        options: {
          execute: {
            text: '执行任务（可以事后救下那人）',
            effect: { moral: -15, cover: '维持伪装' }
          },
          refuse: {
            text: '拒绝执行',
            effect: { moral: 10, danger: '暴露风险' }
          },
          trick: {
            text: '设计让目标"逃脱"',
            effect: { moral: 5, intel: '获得情报但引起怀疑' }
          }
        }
      },

      connection: {
        mainQuest: 'mq_act4_undercover',
        effect: '影响潜入任务的难度和结局'
      }
    },

    'be_lengyue_past': {
      id: 'be_lengyue_past',
      name: '冷月的身世之谜',
      act: 4,
      trigger: '与冷月关系达到一定程度',
      type: 'character_lore',
      
      story: {
        setup: '冷月向你透露她的身世',
        revelation: '她并非玄冥教出身，而是被收养的孤儿',
        realIdentity: '她的亲生父母可能是...正道人士？',
        conflict: '如果这是真的，她该如何面对自己的身份？',
        choice: {
          support: '支持她寻找真相',
          protect: '劝她不要深究，以免受伤',
          investigate: '暗中调查她的身世'
        }
      },

      connection: {
        mainQuest: 'mq_act4_lengyue',
        effect: '影响冷月的最终抉择'
      }
    },

    // ========== 第五幕交织事件 ==========
    'be_gumingzi_weakness': {
      id: 'be_gumingzi_weakness',
      name: '骨冥子的弱点',
      act: 5,
      trigger: '最终决战前',
      type: 'investigation',
      
      story: {
        setup: '通过之前的调查，发现骨冥子的弱点',
        weakness: '他每月十五会旧伤复发，功力大减',
        choice: {
          exploit: {
            text: '利用弱点攻击',
            effect: { battle: '战斗难度降低', moral: -10 }
          },
          fair: {
            text: '公平对决',
            effect: { battle: '正常难度', moral: 10 }
          },
          talk: {
            text: '趁他虚弱时劝说',
            effect: { chance: '可能说服他放弃', moral: 15 }
          }
        }
      },

      connection: {
        mainQuest: 'mq_act5_final_battle',
        effect: '影响最终决战的策略和结局'
      }
    },

    'be_alliance_crisis': {
      id: 'be_alliance_crisis',
      name: '联盟的危机',
      act: 5,
      trigger: '决战前夜',
      type: 'crisis_management',
      
      story: {
        setup: '正道联盟内部出现分歧',
        conflict: '有人主张撤退，有人主张强攻',
        yourRole: '作为先锋，你的态度至关重要',
        choice: {
          rally: '鼓舞士气，坚定进攻',
          compromise: '提出折中方案',
          sacrifice: '提出独自潜入，减少伤亡'
        },
        consequence: '影响决战的参战人数和士气'
      },

      connection: {
        mainQuest: 'mq_act5_preparation',
        effect: '影响最终决战的难度'
      }
    },

    // ========== 第六幕交织事件 ==========
    'be_aftermath_politics': {
      id: 'be_aftermath_politics',
      name: '战后的政治',
      act: 6,
      trigger: '击败骨冥子后',
      type: 'political',
      
      story: {
        setup: '正道联盟开始瓜分胜利果实',
        problem: '有人想趁机打压异己',
        yourChoice: '你可以选择',
        options: {
          intervene: '阻止不正之风',
          ignore: '不参与政治斗争',
          manipulate: '利用局势建立新势力'
        }
      },

      connection: {
        mainQuest: 'mq_act6_new_order',
        effect: '影响战后武林的格局'
      }
    },

    'be_heyin_confession': {
      id: 'be_heyin_confession',
      name: '鹤隐的忏悔',
      act: 6,
      trigger: '完成主线后',
      type: 'character_resolution',
      
      story: {
        setup: '鹤隐向你坦白一切',
        confession: '三十年前沈家灭门的真相',
        guilt: '他这些年的愧疚和赎罪',
        choice: {
          forgive: '原谅他',
          blame: '指责他',
          understand: '表示理解但不原谅'
        },
        payoff: '影响鹤隐的结局'
      },

      connection: {
        mainQuest: 'mq_act6_truth',
        effect: '完整的真相揭露'
      }
    }
  };

  // ==================== 动态事件系统 ====================
  const DYNAMIC_EVENTS = {
    // 根据玩家选择生成的事件
    'de_reputation_check': {
      name: '声望考验',
      trigger: '声望达到阈值',
      variants: [
        {
          condition: { reputation: { faction_good: 50 } },
          event: '正道人士向你求助',
          reward: '正道专属任务'
        },
        {
          condition: { reputation: { faction_evil: 50 } },
          event: '魔道人士接触你',
          reward: '魔道专属任务'
        },
        {
          condition: { reputation: { neutral: 50 } },
          event: '中立势力邀请你',
          reward: '中立专属任务'
        }
      ]
    },

    'de_moral_check': {
      name: '道德考验',
      trigger: '道德值达到阈值',
      variants: [
        {
          condition: { moral: { min: 80 } },
          event: '圣人之路',
          effect: '获得"圣人"称号，正道NPC态度改善'
        },
        {
          condition: { moral: { max: -80 } },
          event: '堕入魔道',
          effect: '获得"魔头"称号，邪道NPC态度改善'
        }
      ]
    },

    'de_relationship_check': {
      name: '关系事件',
      trigger: '与某NPC关系达到阈值',
      generate: (npcId, level) => {
        const events = {
          'npc_lengyue': {
            60: { event: '冷月向你倾诉心事', reward: '获得冷月的信任' },
            80: { event: '冷月暗示心意', reward: '开启情缘线' }
          },
          'npc_nangong_lie': {
            60: { event: '南宫烈邀请你做客', reward: '获得南宫家支持' },
            80: { event: '南宫烈认你为义弟', reward: '获得南宫家传武功' }
          }
        };
        return events[npcId]?.[level] || null;
      }
    }
  };

  // ==================== 核心API ====================
  const StoryBranchEvents = {
    /**
     * 获取支线事件
     */
    getBranchEvent(eventId) {
      return BRANCH_EVENTS[eventId] || null;
    },

    /**
     * 获取某幕的所有支线事件
     */
    getEventsByAct(actNum) {
      return Object.values(BRANCH_EVENTS).filter(e => e.act === actNum);
    },

    /**
     * 获取与主线任务相关的支线
     */
    getConnectedEvents(mainQuestId) {
      return Object.values(BRANCH_EVENTS).filter(e => 
        e.connection && e.connection.mainQuest === mainQuestId
      );
    },

    /**
     * 触发动态事件
     */
    triggerDynamicEvent(eventType, context) {
      const eventTemplate = DYNAMIC_EVENTS[eventType];
      if (!eventTemplate) return null;

      if (eventTemplate.variants) {
        // 找到匹配的变体
        for (const variant of eventTemplate.variants) {
          if (this._checkCondition(variant.condition, context)) {
            return variant;
          }
        }
      } else if (eventTemplate.generate) {
        // 生成事件
        return eventTemplate.generate(context.npcId, context.level);
      }

      return null;
    },

    _checkCondition(condition, context) {
      for (const [key, value] of Object.entries(condition)) {
        if (key === 'reputation' || key === 'moral') {
          const actual = context[key];
          if (value.min !== undefined && actual < value.min) return false;
          if (value.max !== undefined && actual > value.max) return false;
        }
      }
      return true;
    },

    /**
     * 获取事件选择的影响
     */
    getChoiceEffect(eventId, choiceId) {
      const event = BRANCH_EVENTS[eventId];
      if (!event || !event.story.choice) return null;

      const choice = event.story.choice[choiceId];
      return choice ? choice.effect : null;
    },

    /**
     * 生成事件链
     */
    generateEventChain(startEventId, playerChoices) {
      const chain = [];
      let currentEvent = BRANCH_EVENTS[startEventId];

      while (currentEvent) {
        chain.push({
          event: currentEvent,
          choice: playerChoices[currentEvent.id]
        });

        // 根据选择决定下一个事件
        const nextId = this._getNextEvent(currentEvent, playerChoices[currentEvent.id]);
        currentEvent = nextId ? BRANCH_EVENTS[nextId] : null;
      }

      return chain;
    },

    _getNextEvent(event, choice) {
      // 根据事件和选择决定下一个事件
      const transitions = {
        'be_cangzhou_villager': {
          optionA: 'be_songshan_monk',
          optionB: 'be_fragment_whisper'
        }
      };

      return transitions[event.id]?.[choice] || null;
    },

    // 常量导出
    BRANCH_EVENTS,
    DYNAMIC_EVENTS
  };

  // 暴露到全局
  window.StoryBranchEvents = StoryBranchEvents;

  console.log('[StoryBranchEvents] 支线交织事件系统已加载');
  console.log(`- 支线事件: ${Object.keys(BRANCH_EVENTS).length}`);
  console.log(`- 动态事件: ${Object.keys(DYNAMIC_EVENTS).length}`);

})();