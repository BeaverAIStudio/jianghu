// battle-boss.js — BOSS专属战斗机制
// 功能：阶段变化 / 蓄力预警 / 狂暴阶段 / 特殊招式 / 专属台词
// 依赖: battle.js (全局变量 RH, rSt, lHp, rHp, over, log, flash, playSound, updateBars, raidTick)
// ════════════════════════════════════════════════════════════════

// ── BOSS阶段配置 ──
// 每个BOSS可以有2-3个战斗阶段，血量阈值触发相变
const BOSS_PHASE_CONFIG = {

  // ── 通用BOSS配置（所有elite NPC默认使用）──
  default: {
    phases: [
      {
        // 第一阶段：正常战斗
        hpThreshold: 1.0, // 全血量时
        label: '蓄势待发',
        atkMult: 1.0, defMult: 1.0,
        onEnter: null,
        specialMoves: [], // 无特殊招式
      },
      {
        // 第二阶段：血量50%以下，开始狂化
        hpThreshold: 0.5,
        label: '气血激涌',
        atkMult: 1.3, defMult: 0.85,
        color: '#ff8c42',
        onEnter: (bossName) => `🔥 ${bossName} 气血激涌！攻击力大幅提升，防御降低！`,
        specialMoves: ['charge', 'fury_strike', 'boss_seal_random', 'boss_seal_school'], // 解锁蓄力+狂暴+封手
      },
      {
        // 第三阶段：血量25%以下，濒死爆发
        hpThreshold: 0.25,
        label: '濒死爆发',
        atkMult: 1.6, defMult: 0.7,
        color: '#e74c3c',
        onEnter: (bossName) => `💀 ${bossName} 濒死爆发！使出了压箱底的绝学！`,
        specialMoves: ['charge', 'fury_strike', 'desperation', 'aoe_strike', 'boss_seal_random', 'boss_seal_school', 'boss_seal_discard'], // 全部特殊招式+封手
      },
    ],
    // 蓄力预警文字（出现后下回合必定是重击/特殊攻击）
    chargeWarning: (bossName) => `⚠️ ${bossName} 深吸一口气，正在积蓄力量...`,
  },

  // ── 特定BOSS专属配置（按NPC ID匹配）──

  // 武当掌门
  npc_wudang_grandmaster: {
    phases: [
      { hpThreshold: 1.0, label: '太极如水', atkMult: 1.0, defMult: 1.0,
        onEnter: null,
        specialMoves: [] },
      { hpThreshold: 0.6, label: '四两拨千斤', atkMult: 1.1, defMult: 1.2, color: '#74b9ff',
        onEnter: (n) => `🌊 ${n} 进入"四两拨千斤"境界！防御大幅提升，以守为攻！`,
        specialMoves: ['counter_master', 'soft_redirect'] }, // 反击/化解
      { hpThreshold: 0.3, label: '一剑惊仙', atkMult: 1.5, defMult: 0.9, color: '#0984e3',
        onEnter: (n) => `⚡ ${n} 拔出镇山之剑！太极剑法倾泻而出！`,
        specialMoves: ['charge', 'counter_master', 'soft_redirect', 'true_yang_sword'] },
    ],
    chargeWarning: (n) => `🌀 ${n} 双手合十，掌中真气旋转...`,
  },

  // 少林方丈
  npc_shaolin_abbot: {
    phases: [
      { hpThreshold: 1.0, label: '慈悲为怀', atkMult: 1.0, defMult: 1.0,
        onEnter: null,
        specialMoves: [] },
      { hpThreshold: 0.55, label: '金刚降魔', atkMult: 1.25, defMult: 1.15, color: '#fdcb6e',
        onEnter: (n) => `🏯 ${n} 金刚相现！体肤金光，护体神功大成！`,
        specialMoves: ['iron_shirt', 'vajra_palm'] },
      { hpThreshold: 0.25, label: '无上佛威', atkMult: 1.5, defMult: 1.3, color: '#e17055',
        onEnter: (n) => `✨ ${n} 佛光照耀！金刚不坏神功全力运转！`,
        specialMoves: ['iron_shirt', 'vajra_palm', 'charge', 'buddha_wrath'] },
    ],
    chargeWarning: (n) => `🙏 ${n} 双手合十，嘴中默念佛号...`,
  },

  // 华山掌门
  npc_huashan_grandmaster: {
    phases: [
      { hpThreshold: 1.0, label: '剑气凌云', atkMult: 1.0, defMult: 1.0,
        onEnter: null,
        specialMoves: [] },
      { hpThreshold: 0.5, label: '剑走偏锋', atkMult: 1.3, defMult: 0.8, color: '#a29bfe',
        onEnter: (n) => `🗡️ ${n} 剑走偏锋！出奇制胜，攻击变得难以预测！`,
        specialMoves: ['feint_slash', 'sword_dance'] },
      { hpThreshold: 0.2, label: '无剑胜有剑', atkMult: 1.7, defMult: 0.7, color: '#6c5ce7',
        onEnter: (n) => `💫 ${n} 弃剑！以气御剑，无形剑气横扫四方！`,
        specialMoves: ['charge', 'feint_slash', 'sword_dance', 'invisible_sword'] },
    ],
    chargeWarning: (n) => `🌀 ${n} 手握长剑，周身剑气凝聚...`,
  },
};

// ── 特殊招式定义 ──
const BOSS_SPECIAL_MOVES = {
  // 蓄力攻击（提前预警，下回合超强重击）
  charge: {
    id: 'charge', name: '蓄力一击', icon: '⚡', type: 'charge_attack',
    warningMsg: (n) => `⚠️ ${n} 手中暗藏重牌，气势骤然攀升！`,
    attackMsg: (n) => `💥 ${n} 蓄力完毕！全力一击！`,
    dmgMult: 2.8,
    canDodge: true,
    ignoreBlock: true, // 蓄力攻击无视格挡
  },

  // 狂暴重击
  fury_strike: {
    id: 'fury_strike', name: '狂暴重击', icon: '🔥',  type: 'damage',
    msg: (n) => `🔥 ${n} 狂怒！连续三击！`,
    dmgMult: 0.7, hits: 3, // 三连击，每次70%伤害
  },

  // 大范围攻击（AOE，无视一切，固定伤害）
  aoe_strike: {
    id: 'aoe_strike', name: '横扫千军', icon: '🌪️', type: 'aoe',
    msg: (n) => `🌪️ ${n} 横扫千军！没有任何躲避的余地！`,
    dmgMult: 1.5,
    ignoreAll: true, // 无视护盾、格挡、闪避
  },

  // 绝望之刃（濒死招式，超高伤害）
  desperation: {
    id: 'desperation', name: '鱼死网破', icon: '💀', type: 'desperation',
    msg: (n) => `💀 ${n} 背水一战！鱼死网破之势！`,
    dmgMult: 2.2,
    selfHpCost: 0.1, // 自损10%最大气血
    forceCrit: true,
  },

  // 反击宗师（武当专属：被攻击时概率反弹）
  counter_master: {
    id: 'counter_master', name: '以柔克刚', icon: '🌊', type: 'counter_buff',
    msg: (n) => `🌊 ${n} 内力运转，准备以柔克刚！`,
    reflectPct: 0.4, buffDur: 3,
  },

  // 软化化解（武当专属：降低玩家攻击）
  soft_redirect: {
    id: 'soft_redirect', name: '四两拨千斤', icon: '🍃', type: 'debuff',
    msg: (n) => `🍃 ${n} 巧妙化解，将你的力道引走！`,
    playerAtkDebuff: 0.25, // 降低玩家攻击25%
    debuffDur: 2,
  },

  // 金刚护体（少林专属：防御大幅提升）
  iron_shirt: {
    id: 'iron_shirt', name: '金刚护体', icon: '🏯', type: 'defense_buff',
    msg: (n) => `🏯 ${n} 金刚护体功运转，刀枪不入！`,
    defBuff: 0.5, buffDur: 2,
  },

  // 金刚掌（少林专属：高伤害固定）
  vajra_palm: {
    id: 'vajra_palm', name: '大金刚掌', icon: '✊', type: 'damage',
    msg: (n) => `✊ ${n} 金刚掌法！`,
    dmgMult: 2.0, ignoreDefense: true,
  },

  // 佛怒（少林专属：AOE + 眩晕）
  buddha_wrath: {
    id: 'buddha_wrath', name: '金刚怒目', icon: '😤', type: 'stun_damage',
    msg: (n) => `😤 ${n} 怒目金刚相！`,
    dmgMult: 1.5, stunDur: 2,
  },

  // 剑舞（华山专属：连续多段伤害）
  sword_dance: {
    id: 'sword_dance', name: '剑花三叠', icon: '🗡️', type: 'damage',
    msg: (n) => `🗡️ ${n} 剑花三叠！`,
    dmgMult: 0.6, hits: 4,
  },

  // 虚晃（华山专属：误导玩家意图判断）
  feint_slash: {
    id: 'feint_slash', name: '声东击西', icon: '🎭', type: 'feint',
    msg: (n) => `🎭 ${n} 声东击西！意图判断完全失效！`,
    disableIntent: true, // 本回合意图显示完全随机
    dmgMult: 1.3,
  },

  // 无形剑（华山最终招式）
  invisible_sword: {
    id: 'invisible_sword', name: '无形剑气', icon: '💫', type: 'aoe',
    msg: (n) => `💫 ${n} 发出无形剑气！无处可逃！`,
    dmgMult: 2.5,
    ignoreAll: true,
    forceCrit: true,
  },

  // 真阳剑（武当最终招式）
  true_yang_sword: {
    id: 'true_yang_sword', name: '真阳剑法', icon: '⚡', type: 'damage',
    msg: (n) => `⚡ ${n} 真阳剑法全力发动！`,
    dmgMult: 3.0,
    ignoreDefense: true,
  },

  // ── 将将胡：BOSS封手招式 ──

  // 随机封手：封印一张随机手牌（3回合）
  boss_seal_random: {
    id: 'boss_seal_random', name: '封脉乱经', icon: '❌', type: 'seal',
    msg: (n) => `🌀 ${n} 出手如电，封住你一道经脉！`,
    sealType: 'random', // 由CardSystem.sealCard处理
  },

  // 学派封印：封印同学派所有手牌（2回合）
  boss_seal_school: {
    id: 'boss_seal_school', name: '截气归元', icon: '🎯', type: 'seal',
    msg: (n) => `🎯 ${n} 截气归元！封印你${window._bossTargetSchool||'当前'}流派功法！`,
    sealType: 'school',
  },

  // 强制弃牌：迫使玩家弃掉最后打出的牌
  boss_seal_discard: {
    id: 'boss_seal_discard', name: '逆乱翻覆', icon: '💨', type: 'discard',
    msg: (n) => `💨 ${n} 逆乱翻覆！你的功法被强行驱散！`,
    sealType: 'discard',
  },
};

// ── BOSS战斗状态机 ──
const BossSystem = {
  active: false,       // 当前战斗是否是BOSS战
  bossId: null,        // BOSS NPC ID
  currentPhase: 0,     // 当前阶段索引
  phaseConfig: null,   // 当前使用的阶段配置
  phaseLock: false,    // 是否正在播放阶段过渡动画
  chargeActive: false, // 是否处于蓄力状态
  chargeTurns: 0,      // 蓄力已积累回合数
  specialCooldown: {}, // 特殊招式冷却 {moveId: turnsLeft}
  phaseBonus: { atk: 1.0, def: 1.0 }, // 当前阶段加成

  // ── 初始化BOSS战 ──
  init(npcId, npcTier) {
    if (npcTier !== 'elite') { this.active = false; return; }
    this.active = true;
    this.bossId = npcId;
    this.currentPhase = 0;
    this.chargeActive = false;
    this.chargeTurns = 0;
    this.specialCooldown = {};
    this.phaseBonus = { atk: 1.0, def: 1.0 };

    // 查找BOSS专属配置，否则使用通用配置
    this.phaseConfig = BOSS_PHASE_CONFIG[npcId] || BOSS_PHASE_CONFIG.default;
    console.log(`[BossSystem] BOSS战斗初始化: ${npcId}, 配置:`, this.phaseConfig.phases.length, '阶段');
  },

  // ── 每回合检查BOSS阶段变化 ──
  checkPhaseTransition() {
    if (!this.active || !this.phaseConfig || this.phaseLock) return;
    if (typeof RH === 'undefined' || typeof rHp === 'undefined') return;

    const maxHp = RH._maxHpFull || RH.maxHp || 100;
    const hpPct = rHp / maxHp;
    const phases = this.phaseConfig.phases;

    // 找到当前血量应该处于哪个阶段
    let targetPhase = 0;
    for (let i = phases.length - 1; i >= 0; i--) {
      if (hpPct <= phases[i].hpThreshold) {
        targetPhase = i;
        break;
      }
    }

    // 如果阶段提升了，触发阶段变化
    if (targetPhase > this.currentPhase) {
      this._enterPhase(targetPhase);
    }
  },

  // ── 进入新阶段 ──
  _enterPhase(phaseIdx) {
    this.phaseLock = true;
    this.currentPhase = phaseIdx;
    const phase = this.phaseConfig.phases[phaseIdx];

    // 更新阶段加成
    this.phaseBonus.atk = phase.atkMult || 1.0;
    this.phaseBonus.def = phase.defMult || 1.0;

    // 阶段变化提示
    if (phase.onEnter && typeof log === 'function') {
      const msg = phase.onEnter(RH.name);
      log(msg, 'legendary');
    }

    // 播放阶段变化特效
    if (typeof flash === 'function') flash(phaseIdx >= 2 ? 'red' : 'blue');
    if (typeof playSound === 'function') playSound('rage');

    // 显示阶段横幅
    this._showPhaseBanner(phase);

    // 短暂锁定后恢复
    setTimeout(() => {
      this.phaseLock = false;
      if (typeof log === 'function') {
        log(`⚔️ 对手进入「${phase.label}」阶段！`, 'lc');
      }
      // 在阶段变化时，给BOSS一个完全回复的护盾
      if (phaseIdx === 1 && typeof rSt !== 'undefined') {
        rSt.shieldAbs = Math.floor((RH._maxHpFull || RH.maxHp) * 0.05); // 5%气血的护盾
        if (typeof log === 'function') log(`🛡 对手爆发出护盾！`, 'ld');
      }
      // ── 将将胡：BOSS阶段变化触发封手机制 ──
      if (phaseIdx >= 1 && typeof window.triggerCardBossSeal === 'function') {
        window.triggerCardBossSeal(phaseIdx);
      }
    }, 1200);
  },

  // ── 显示阶段横幅 ──
  _showPhaseBanner(phase) {
    const existing = document.getElementById('bossPhase_banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'bossPhase_banner';
    banner.style.cssText = `
      position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
      background: rgba(0,0,0,0.88); border:2px solid ${phase.color || '#ff6b6b'};
      border-radius:12px; padding:16px 30px; z-index:9999;
      text-align:center; animation: bossPhase_in .4s ease;
      box-shadow: 0 0 30px ${phase.color || '#ff6b6b'}88;
    `;
    banner.innerHTML = `
      <div style="font-size:11px;color:${phase.color || '#ff6b6b'};letter-spacing:3px;margin-bottom:4px">⚔ 阶段变化 ⚔</div>
      <div style="font-size:18px;font-weight:bold;color:#fff;letter-spacing:2px">— ${phase.label} —</div>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 2200);
  },

  // ── BOSS回合：决定是否使用特殊招式 ──
  getBossAction() {
    if (!this.active) return null;
    const phase = this.phaseConfig.phases[this.currentPhase];
    if (!phase || !phase.specialMoves || phase.specialMoves.length === 0) return null;

    // 冷却减少
    Object.keys(this.specialCooldown).forEach(k => {
      if (this.specialCooldown[k] > 0) this.specialCooldown[k]--;
    });

    // 如果处于蓄力状态，下回合必定发动蓄力攻击
    if (this.chargeActive) {
      this.chargeTurns++;
      if (this.chargeTurns >= 1) {
        this.chargeActive = false;
        this.chargeTurns = 0;
        return 'charge_release'; // 发动蓄力攻击
      }
    }

    // 根据阶段和血量动态调整使用特殊招式的概率
    const maxHp = RH._maxHpFull || RH.maxHp || 100;
    const hpPct = rHp / maxHp;
    let specialChance = 0.2 + (this.currentPhase * 0.1) + (1 - hpPct) * 0.15;
    specialChance = Math.min(0.55, specialChance); // 最高55%

    if (Math.random() > specialChance) return null;

    // 从可用招式中随机选择（排除冷却中的）
    const available = phase.specialMoves.filter(id => {
      if (id === 'charge' && this.chargeActive) return false;
      return !this.specialCooldown[id] || this.specialCooldown[id] <= 0;
    });

    if (available.length === 0) return null;

    // 蓄力有特殊处理：设置蓄力状态
    const chosen = available[Math.floor(Math.random() * available.length)];
    if (chosen === 'charge') {
      this.chargeActive = true;
      this.chargeTurns = 0;
      this.specialCooldown['charge'] = 5; // 5回合冷却
      return 'charge_warn'; // 预警回合
    }

    // 设置冷却（不同招式不同冷却）
    const cooldowns = {
      fury_strike: 3, aoe_strike: 5, desperation: 99, // 绝招只用一次
      counter_master: 2, soft_redirect: 2, iron_shirt: 3, vajra_palm: 3,
      buddha_wrath: 5, sword_dance: 2, feint_slash: 3, invisible_sword: 99,
      true_yang_sword: 99,
      // 将将胡：封手招式冷却
      boss_seal_random: 3, boss_seal_school: 4, boss_seal_discard: 5,
    };
    this.specialCooldown[chosen] = cooldowns[chosen] || 3;
    return chosen;
  },

  // ── 执行特殊招式 ──
  executeSpecialMove(moveId) {
    if (!this.active) return false;

    if (moveId === 'charge_warn') {
      // 蓄力预警
      const warningFn = this.phaseConfig.chargeWarning || BOSS_PHASE_CONFIG.default.chargeWarning;
      if (typeof log === 'function') log(warningFn(RH.name), 'warning');
      if (typeof flash === 'function') flash('gold');
      // 在意图栏显示特殊预警
      const textEl = document.getElementById('intentText');
      if (textEl) textEl.textContent = '⚠️ 正在蓄力！';
      return true;
    }

    const move = BOSS_SPECIAL_MOVES[moveId === 'charge_release' ? 'charge' : moveId];
    if (!move) return false;

    if (typeof log === 'function') {
      const msgFn = move.msg || move.attackMsg;
      if (msgFn) log(msgFn(RH.name), 'legendary');
    }

    // 获取BOSS攻击力
    const rTotalAtk = RH._stats ? RH._stats.totalAtk : (RH.atk + (RH._wepAtk || 0));
    const rEl = document.getElementById('fR');
    const lEl = document.getElementById('fL');

    if (move.type === 'charge_attack' || move.type === 'aoe' || move.type === 'damage') {
      const hits = move.hits || 1;
      for (let i = 0; i < hits; i++) {
        setTimeout(() => {
          if (typeof over !== 'undefined' && over) return;
          const atk = rTotalAtk * (this.phaseBonus.atk || 1.0);
          const {dmg, isCrit} = calcDmg(atk, rSt, lSt, {
            mult: move.dmgMult || 1.5,
            forceCrit: move.forceCrit,
            ignoreDefense: move.ignoreDefense,
            ignoreAll: move.ignoreAll,
          });
          // 蓄力/aoe 忽略闪避和格挡
          if (move.ignoreAll || move.ignoreBlock) {
            const {finalDmg} = applyDmg('l', dmg, {ignoreShield: move.ignoreAll, ignoreAll: move.ignoreAll});
            if (lEl) { blink(lEl); knockback(lEl,'l'); floatDmg(lEl, `${move.icon}${finalDmg}`, isCrit?'dc':'dn'); }
            if (typeof flash === 'function') flash('red');
          } else {
            // 可以闪避
            if (tryDodge('l', true)) {
              if (lEl) floatDmg(lEl, '闪避！', 'dd');
            } else {
              const {finalDmg} = applyDmg('l', dmg);
              if (lEl) { blink(lEl); knockback(lEl,'l'); floatDmg(lEl, `${move.icon}${finalDmg}`, 'dn'); }
              if (typeof flash === 'function') flash('red');
            }
          }
          if (typeof updateBars === 'function') updateBars();
          if (i === hits - 1) {
            if (typeof checkWin === 'function') checkWin();
          }
        }, i * 300);
      }
    }

    if (move.type === 'stun_damage') {
      const atk = rTotalAtk * (this.phaseBonus.atk || 1.0);
      const {dmg} = calcDmg(atk, rSt, lSt, { mult: move.dmgMult || 1.5 });
      const {finalDmg} = applyDmg('l', dmg);
      if (lEl) { blink(lEl); floatDmg(lEl, `${move.icon}${finalDmg}`, 'dn'); }
      if (move.stunDur && typeof lSt !== 'undefined') {
        lSt.stun = move.stunDur;
        if (typeof log === 'function') log(`😵 你被眩晕${move.stunDur}回合！`, 'debuff');
      }
    }

    if (move.type === 'defense_buff') {
      if (typeof rSt !== 'undefined') {
        rSt.defBuff = (rSt.defBuff || 0) + move.defBuff;
        rSt.defBuffTurns = move.buffDur || 2;
      }
    }

    if (move.type === 'counter_buff') {
      if (typeof rSt !== 'undefined') {
        rSt.reflectPct = (rSt.reflectPct || 0) + move.reflectPct;
      }
    }

    if (move.type === 'debuff') {
      // 降低玩家攻击
      if (move.playerAtkDebuff && typeof lSt !== 'undefined') {
        lSt.atkBuff = (lSt.atkBuff || 0) - move.playerAtkDebuff;
        lSt.atkBuffTurns = move.debuffDur || 2;
        if (typeof log === 'function') log(`💨 你的攻击力被削减${Math.round(move.playerAtkDebuff*100)}%！`, 'debuff');
      }
    }

    if (move.type === 'feint') {
      // 虚晃：临时禁用意图提示
      window._bossFeintActive = true;
      setTimeout(() => { window._bossFeintActive = false; }, 2000);
    }

    // ── 将将胡：BOSS封手招式 ──
    if (move.type === 'seal' || move.type === 'discard') {
      if (typeof window.triggerCardBossSeal === 'function') {
        // 传递封手类型和BOSS当前派系信息
        window._bossTargetSchool = RH.school || '通用';
        window.triggerCardBossSeal({ type: move.sealType, phase: this.currentPhase, source: 'execute' });
      }
      // 设置封手招式冷却（较长，避免频繁封手）
      this.specialCooldown[moveId] = 4;
    }

    if (move.type === 'desperation') {
      // 自损效果
      if (move.selfHpCost) {
        const selfDmg = Math.floor((RH._maxHpFull || RH.maxHp) * move.selfHpCost);
        if (typeof rHp !== 'undefined') {
          window.rHp = Math.max(1, rHp - selfDmg);
          if (typeof updateBars === 'function') updateBars();
        }
      }
      // 高伤害攻击
      const atk = rTotalAtk * (this.phaseBonus.atk || 1.0);
      const {dmg, isCrit} = calcDmg(atk, rSt, lSt, {
        mult: move.dmgMult || 2.2, forceCrit: true, ignoreAll: false
      });
      const {finalDmg} = applyDmg('l', dmg);
      if (lEl) { blink(lEl); knockback(lEl,'l'); floatDmg(lEl, `💀${finalDmg}`, 'ds'); }
      if (typeof flash === 'function') flash('red');
      if (typeof screenShake === 'function') screenShake(true, 500);
    }

    return true;
  },

  // ── 获取当前阶段对BOSS属性的加成（供战斗计算使用）──
  getPhaseAtk() { return this.active ? this.phaseBonus.atk : 1.0; },
  getPhaseDef() { return this.active ? this.phaseBonus.def : 1.0; },

  // ── 重置 ──
  reset() {
    this.active = false;
    this.bossId = null;
    this.currentPhase = 0;
    this.phaseConfig = null;
    this.phaseLock = false;
    this.chargeActive = false;
    this.chargeTurns = 0;
    this.specialCooldown = {};
    this.phaseBonus = { atk: 1.0, def: 1.0 };
  },
};

// 注入阶段变化CSS动画
(function injectBossCss(){
  const s = document.createElement('style');
  s.textContent = `
    @keyframes bossPhase_in {
      from { opacity:0; transform:translate(-50%,-50%) scale(0.7); }
      to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
    }
    .boss-phase-indicator {
      position: absolute;
      top: -18px; left: 50%;
      transform: translateX(-50%);
      font-size: 9px; letter-spacing: 1.5px;
      color: #ff8c42; font-weight: bold;
      pointer-events: none; z-index: 10;
    }
    .charge-warning-pulse {
      animation: chargeWarn 0.5s infinite alternate;
    }
    @keyframes chargeWarn {
      from { box-shadow: 0 0 8px #ff6b6b44; }
      to   { box-shadow: 0 0 24px #ff6b6bcc; }
    }
  `;
  document.head.appendChild(s);
})();

// 全局暴露
window.BossSystem = BossSystem;
