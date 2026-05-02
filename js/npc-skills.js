// npc-skills.js — NPC 技能系统
// 为 NPC 配置技能组，战斗时 AI 会主动使用技能
// 依赖: data-skills.js, npc-combat.js

// ── 门派/职业 → 技能组映射 ──
// 每组最多 4 个技能 ID（从 SKILL_LIB 中选取）
// 格式：[技能ID, ...]，AI按权重随机选用
const NPC_SKILL_SETS = {
  // ─ 少林系 ─
  shaolin:    ['fst_l1','fst_l2','fst_l3','bud_l1','bud_l2'],
  shaolin_master: ['fst_03','fst_06','bud_04','bud_07'],
  shaolin_boss:   ['fst_09','fst_12','bud_09','bud_12','fst_06'],

  // ─ 武当系 ─
  wudang:     ['tao_l1','tao_l2','swrd_l1','swrd_l2'],
  wudang_master: ['tao_04','tao_07','swrd_04','swrd_07'],
  wudang_boss:   ['tao_09','tao_12','swrd_09','swrd_12'],

  // ─ 华山系 ─
  huashan:    ['swrd_l1','swrd_l2','swrd_l3'],
  huashan_master: ['swrd_04','swrd_07','swrd_05'],
  huashan_boss:   ['swrd_09','swrd_12','swrd_10'],

  // ─ 逍遥系 ─
  xiaoyao:    ['tao_l1','ice_l1','mus_l1','tao_l2'],
  xiaoyao_master: ['tao_04','ice_04','mus_04','tao_07'],
  xiaoyao_boss:   ['tao_09','ice_09','mus_09','tao_12'],

  // ─ 日月神教 ─
  riyue:      ['fir_l1','fir_l2','swrd_l1','dmg_l1'],
  riyue_master: ['fir_04','fir_07','swrd_04','dmg_04'],
  riyue_boss:   ['fir_09','fir_12','swrd_09','dmg_09'],

  // ─ 明教 ─
  mingjiao:   ['fir_l1','fir_l2','fir_l3','dmg_l1'],
  mingjiao_master: ['fir_04','fir_07','dmg_04','dmg_07'],
  mingjiao_boss:   ['fir_09','fir_12','dmg_09','dmg_12'],

  // ─ 五毒/青城 ─
  wudu:       ['poi_l1','poi_l2','poi_l3','dmg_l1'],
  wudu_master: ['poi_04','poi_07','dmg_04','poi_05'],
  wudu_boss:   ['poi_09','poi_12','dmg_09','poi_10'],

  qingcheng:  ['poi_l1','poi_l2','tao_l1'],
  qingcheng_master: ['poi_04','poi_07','tao_04'],
  qingcheng_boss:   ['poi_09','poi_12','tao_09'],

  // ─ 唐门 ─
  tangmen:    ['drk_l1','drk_l2','drk_l3','dmg_l1'],
  tangmen_master: ['drk_04','drk_07','dmg_04','drk_05'],
  tangmen_boss:   ['drk_09','drk_12','dmg_09','drk_10'],

  // ─ 峨眉 ─
  emei:       ['bud_l1','bud_l2','swrd_l1','tao_l1'],
  emei_master: ['bud_04','bud_07','swrd_04','tao_04'],
  emei_boss:   ['bud_09','bud_12','swrd_09','tao_09'],

  // ─ 崆峒 ─
  kongtong:   ['pwr_l1','pwr_l2','pwr_l3','fst_l1'],
  kongtong_master: ['pwr_04','pwr_07','fst_04','pwr_05'],
  kongtong_boss:   ['pwr_09','pwr_12','fst_09','pwr_10'],

  // ─ 昆仑 ─
  kunlun:     ['ice_l1','ice_l2','swrd_l1','tao_l1'],
  kunlun_master: ['ice_04','ice_07','swrd_04','ice_05'],
  kunlun_boss:   ['ice_09','ice_12','swrd_09','ice_10'],

  // ─ 天山/逍遥分支 ─
  tianshan:   ['ice_l1','ice_l2','tao_l1','tao_l2'],
  tianshan_master: ['ice_04','ice_07','tao_04','ice_05'],
  tianshan_boss:   ['ice_09','ice_12','tao_09','ice_10'],

  // ─ 玄冥/天地帮 ─
  xuanming:   ['poi_l1','ice_l1','drk_l1','pwr_l1'],
  xuanming_master: ['poi_04','ice_04','drk_04','pwr_04'],
  xuanming_boss:   ['poi_09','ice_09','drk_09','pwr_09'],

  tiandibang: ['pwr_l1','pwr_l2','dmg_l1','swrd_l1'],
  tiandibang_master: ['pwr_04','pwr_07','dmg_04','swrd_04'],
  tiandibang_boss:   ['pwr_09','pwr_12','dmg_09','swrd_09'],

  // ─ 海沙/凌霄 ─
  haisha:     ['pwr_l1','swrd_l1','dmg_l1'],
  haisha_master: ['pwr_04','swrd_04','dmg_04'],
  haisha_boss:   ['pwr_09','swrd_09','dmg_09'],

  lingxiao:   ['drk_l1','swrd_l1','dmg_l1','drk_l2'],
  lingxiao_master: ['drk_04','swrd_04','dmg_04','drk_07'],
  lingxiao_boss:   ['drk_09','swrd_09','dmg_09','drk_12'],

  // ─ 特殊系 ─
  guigu:      ['cmd_l1','cmd_l2','tao_l1','mus_l1'],
  guigu_master: ['cmd_04','cmd_07','tao_04','mus_04'],
  guigu_boss:   ['cmd_09','cmd_12','tao_09','mus_09'],

  // ─ 通用/普通 ─
  common:     ['com_l1','com_l2','com_l3'],
  fighter:    ['pwr_l1','pwr_l2','fst_l1'],
  swordsman:  ['swrd_l1','swrd_l2','com_l1'],
  assassin:   ['drk_l1','drk_l2','com_l1'],
};

// ── NPC role 关键词 → 技能组推断 ──
const NPC_ROLE_SKILL_MAP = [
  { re:/少林|禅|佛|和尚|僧/i,        set:'shaolin',  masterSet:'shaolin_master',  bossSet:'shaolin_boss'  },
  { re:/武当|太极|道士|道长|张/i,     set:'wudang',   masterSet:'wudang_master',   bossSet:'wudang_boss'   },
  { re:/华山|剑宗|气宗/i,             set:'huashan',  masterSet:'huashan_master',  bossSet:'huashan_boss'  },
  { re:/逍遥|天山/i,                  set:'xiaoyao',  masterSet:'xiaoyao_master',  bossSet:'xiaoyao_boss'  },
  { re:/日月/i,                       set:'riyue',    masterSet:'riyue_master',    bossSet:'riyue_boss'    },
  { re:/明教|圣火|光明/i,             set:'mingjiao', masterSet:'mingjiao_master', bossSet:'mingjiao_boss' },
  { re:/五毒|蛊|毒/i,                 set:'wudu',     masterSet:'wudu_master',     bossSet:'wudu_boss'     },
  { re:/青城/i,                       set:'qingcheng',masterSet:'qingcheng_master',bossSet:'qingcheng_boss'},
  { re:/唐门|暗器/i,                  set:'tangmen',  masterSet:'tangmen_master',  bossSet:'tangmen_boss'  },
  { re:/峨眉/i,                       set:'emei',     masterSet:'emei_master',     bossSet:'emei_boss'     },
  { re:/崆峒/i,                       set:'kongtong', masterSet:'kongtong_master', bossSet:'kongtong_boss' },
  { re:/昆仑/i,                       set:'kunlun',   masterSet:'kunlun_master',   bossSet:'kunlun_boss'   },
  { re:/玄冥/i,                       set:'xuanming', masterSet:'xuanming_master', bossSet:'xuanming_boss' },
  { re:/天地帮/i,                     set:'tiandibang',masterSet:'tiandibang_master',bossSet:'tiandibang_boss'},
  { re:/海沙/i,                       set:'haisha',   masterSet:'haisha_master',   bossSet:'haisha_boss'   },
  { re:/凌霄/i,                       set:'lingxiao', masterSet:'lingxiao_master', bossSet:'lingxiao_boss' },
  { re:/鬼谷/i,                       set:'guigu',    masterSet:'guigu_master',    bossSet:'guigu_boss'    },
  { re:/刺客|杀手|夜行/i,             set:'assassin', masterSet:'assassin',        bossSet:'assassin'      },
  { re:/侠客|剑客|剑士/i,             set:'swordsman',masterSet:'swordsman',       bossSet:'swordsman'     },
  { re:/武者|拳师|力士|铁匠|铁布/i,  set:'fighter',  masterSet:'fighter',         bossSet:'fighter'       },
];

// ── 根据 NPC 数据推断技能组 ──
// 返回技能ID数组（已过滤不存在的技能）
function getNpcSkillSet(npc, tier){
  if(!npc) return [];

  // 1. NPC 自身显式配置了 skills 字段
  if(npc.skills && Array.isArray(npc.skills) && npc.skills.length > 0){
    return npc.skills;
  }

  const isBoss   = tier === 'elite' || (npc.tier === 'elite');
  const isMajor  = tier === 'major' || (npc.tier === 'major');

  // 2. 从 city 推断门派
  const cityId = npc.city || '';
  const cityToSect = {
    shaolin_temple:'shaolin', wudang_peak:'wudang', huashan_sect:'huashan',
    emei_sect:'emei', kongtong_peak:'kongtong', diancang_peak:'swordsman',
    qingcheng_peak:'qingcheng', tianshan_sect:'tianshan', xiaoyao_grotto:'xiaoyao',
    tangmen_hall:'tangmen', wutai_temple:'shaolin',
    riyue_sect:'riyue', wudutang_hall:'wudu', xuanming_hall:'xuanming',
    taohua_hall:'swordsman', tianlei_fort:'fighter', xuegu_fort:'fighter',
    lingxiao_tower:'lingxiao', nangong_estate:'swordsman',
    guigu_cave:'guigu', haishadao:'haisha', shengguang_temple:'common',
    longxiang_temple:'shaolin', xixia_palace:'common', tiandibang_fort:'tiandibang',
  };
  const bySect = cityToSect[cityId];
  if(bySect){
    if(isBoss)   return NPC_SKILL_SETS[bySect + '_boss']   || NPC_SKILL_SETS[bySect] || NPC_SKILL_SETS.common;
    if(isMajor)  return NPC_SKILL_SETS[bySect + '_master'] || NPC_SKILL_SETS[bySect] || NPC_SKILL_SETS.common;
    return NPC_SKILL_SETS[bySect] || NPC_SKILL_SETS.common;
  }

  // 3. 从 role 关键词推断
  const role = npc.role || '';
  for(const entry of NPC_ROLE_SKILL_MAP){
    if(entry.re.test(role)){
      if(isBoss)   return NPC_SKILL_SETS[entry.bossSet]   || NPC_SKILL_SETS[entry.set] || NPC_SKILL_SETS.common;
      if(isMajor)  return NPC_SKILL_SETS[entry.masterSet] || NPC_SKILL_SETS[entry.set] || NPC_SKILL_SETS.common;
      return NPC_SKILL_SETS[entry.set] || NPC_SKILL_SETS.common;
    }
  }

  // 4. 兜底
  if(isBoss || isMajor) return NPC_SKILL_SETS.swordsman;
  return NPC_SKILL_SETS.common;
}

// ── 获取 NPC 的有效技能对象列表（过滤不存在ID）──
function resolveNpcSkills(npc, tier){
  if(typeof SKILL_LIB === 'undefined') return [];
  const ids = getNpcSkillSet(npc, tier);
  // SKILL_LIB 是对象 {school: [技能数组]}，需遍历 values
  return ids.map(id=>{
    for(const school of Object.values(SKILL_LIB)){
      const sk = Array.isArray(school) ? school.find(s=> s.id === id) : null;
      if(sk) return sk;
    }
    return null;
  }).filter(Boolean);
}

// ── NPC 战斗 AI：选择本回合使用的技能 ──
// 返回技能对象或 null（null = 普通攻击）
function npcChooseSkill(npc, tier, hp, maxHp, round){
  const skills = resolveNpcSkills(npc, tier);
  if(!skills.length) return null;

  // 在技能冷却字典上下文（npc-specific）中管理CD
  if(!npcState.npcSkillCds) npcState.npcSkillCds = {};
  const npcInstId = npc.id; // 简单用npcId标识（同城不同实例共享CD不影响体验）
  if(!npcState.npcSkillCds[npcInstId]) npcState.npcSkillCds[npcInstId] = {};
  const cds = npcState.npcSkillCds[npcInstId];

  // 减CD
  Object.keys(cds).forEach(id=> { if(cds[id] > 0) cds[id]--; });

  // 可用技能（不在CD中）
  const available = skills.filter(sk=> !(cds[sk.id] > 0));
  if(!available.length) return null;

  // 策略选择：
  // - 低血量（<35%）优先选heal类
  // - 否则按tier决定AI激进程度
  const hpPct = maxHp > 0 ? hp / maxHp : 1;
  const isBoss = tier === 'elite';
  const isMajor = tier === 'major';

  let chosen = null;

  if(hpPct < 0.35){
    const healSkill = available.find(sk=> sk.type === 'heal' || sk.healPct);
    if(healSkill) chosen = healSkill;
  }

  if(!chosen){
    // 普通轮：BOSS 60%概率用技能，major 40%，func 20%
    const useChance = isBoss ? 0.6 : isMajor ? 0.4 : 0.2;
    if(Math.random() < useChance){
      // 优先高倍率技能
      const sorted = [...available].sort((a,b)=> (b.multiplier||1) - (a.multiplier||1));
      chosen = sorted[0];
    }
  }

  if(chosen){
    // 设置CD
    cds[chosen.id] = chosen.cd || 3;
  }
  return chosen;
}

// ── NPC 使用技能的伤害/效果计算 ──
// 返回 { dmg, healAmt, log, type }
function calcNpcSkillEffect(skill, npcAtk, targetMaxHp){
  if(!skill) return null;

  const mult = skill.multiplier || 1.0;
  const base = npcAtk * mult;

  if(skill.type === 'heal' || (skill.healPct && skill.type !== 'damage')){
    const healAmt = Math.round(targetMaxHp * (skill.healPct || 0.2));
    return { type:'heal', healAmt, dmg:0,
      log:`✨ 施展【${skill.name}】，恢复 ${healAmt} 气血` };
  }

  if(skill.type === 'damage' || skill.type === 'stun' || skill.type === 'execute'){
    const hits = skill.hits || 1;
    let total = 0;
    for(let i=0; i<hits; i++){
      const variance = 0.9 + Math.random() * 0.2;
      total += Math.round(base * variance);
    }
    let log = `⚡ 施展【${skill.name}】`;
    if(hits > 1) log += `（${hits}连击）`;
    if(skill.type === 'stun') log += '，眩晕！';
    return { type:'damage', dmg:total, healAmt:0, log,
      stun: skill.type === 'stun', execute: skill.type === 'execute' };
  }

  // buff 类
  return { type:'buff', dmg:0, healAmt:0,
    log:`✨ 【${skill.name}】增益` };
}

// ── 在 NPC 战斗面板中展示技能列表 ──
function renderNpcSkillList(npc, tier){
  const skills = resolveNpcSkills(npc, tier);
  if(!skills.length) return '<span style="color:rgba(160,180,160,.4);font-size:11px">无习得技能</span>';

  return skills.map(sk=>{
    const SKT = (typeof window.SKT !== 'undefined') ? window.SKT : {};
    const st  = SKT[sk.type] || { color:'#80c8a0', label:'攻击' };
    return `<span class="npc-skill-tag" style="border-color:${st.color}33;color:${st.color};background:${st.color}11"
      title="${sk.desc||sk.name} | CD:${sk.cd}回合">${sk.icon||'⚡'} ${sk.name}</span>`;
  }).join('');
}
