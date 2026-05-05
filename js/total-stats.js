/**
 * 获取玩家总属性（含出身 + 等级 + 根骨 + 装备 + 门派 + 情缘 + 宠物 + 境界 + 天赋 + 强化 + 词条）
 * ★ 修复（2026-05-05）：与 battle.js calcFinalStats 保持一致，
 *   确保 town 页面和战斗页面显示的 HP/MP 最大值相同
 * ★ 改造（2026-05-05）：返回 breakdown 对象，记录每个加成来源的数值
 * 用法：const ts = getTotalStats(); // ts.hp, ts.mp, ts.atk, ts.def, ts.crit, ts.dodge, ts.spd
 *       const bd = ts.breakdown;     // bd.base, bd.equipment, bd.affix, ...
 */
function getTotalStats() {
  const base = (typeof edStats === 'function')
    ? edStats()
    : { hp:150, mp:100, atk:15, def:10, crit:10, dodge:8, spd:8, bonusTags:'' };
  let hp = base.hp, mp = base.mp, atk = base.atk, def = base.def;
  let crit = base.crit, dodge = base.dodge, spd = base.spd;

  // ── breakdown 初始化：基础值 ──
  const breakdown = {
    base:    { hp: base.hp, mp: base.mp, atk: base.atk, def: base.def, crit: base.crit, dodge: base.dodge, spd: base.spd },
    equipment: { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    affix:    { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    enhance:  { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    pet:      { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    sect:     { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    realm:    { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    talent:   { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    romance:  { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
    sworn:    { hp:0, mp:0, atk:0, def:0, crit:0, dodge:0, spd:0 },
  };

  // ── 装备基础加成（武器/防具的 hpBonus/mpBonus 等）──
  if (typeof edS !== 'undefined') {
    const wId = edS.weaponId || null;
    if (wId && typeof WEAPONS !== 'undefined') {
      const w = WEAPONS.find(w => w.id === wId);
      if (w) {
        const wHp=w.hpBonus||0, wMp=w.mpBonus||0, wAtk=w.atkBonus||0, wDef=w.defBonus||0;
        const wCrit=w.critBonus||0, wDodge=w.dodgeBonus||0, wSpd=w.speedBonus||0;
        hp += wHp; mp += wMp; atk += wAtk; def += wDef;
        crit += wCrit; dodge += wDodge; spd += wSpd;
        breakdown.equipment.hp += wHp; breakdown.equipment.mp += wMp;
        breakdown.equipment.atk += wAtk; breakdown.equipment.def += wDef;
        breakdown.equipment.crit += wCrit; breakdown.equipment.dodge += wDodge;
        breakdown.equipment.spd += wSpd;
      }
    }
    const cId = edS.costumeId || null;
    if (cId && typeof COSTUMES !== 'undefined') {
      const c = COSTUMES.find(c => c.id === cId);
      if (c) {
        const cHp=c.hpBonus||0, cMp=c.mpBonus||0, cAtk=c.atkBonus||0, cDef=c.defBonus||0;
        const cCrit=c.critBonus||0, cDodge=c.dodgeBonus||0, cSpd=c.speedBonus||0;
        hp += cHp; mp += cMp; atk += cAtk; def += cDef;
        crit += cCrit; dodge += cDodge; spd += cSpd;
        breakdown.equipment.hp += cHp; breakdown.equipment.mp += cMp;
        breakdown.equipment.atk += cAtk; breakdown.equipment.def += cDef;
        breakdown.equipment.crit += cCrit; breakdown.equipment.dodge += cDodge;
        breakdown.equipment.spd += cSpd;
      }
    }
  }

  // ── 装备词条加成（与 battle.js calcFinalStats affHp/affMp 一致）──
  let affAtk=0, affCrit=0, affHp=0, affDef=0, affMp=0, affDodge=0, affSpd=0;
  if (typeof edS !== 'undefined' && typeof getItemAffixes === 'function') {
    ['weapon', 'costume'].forEach(type => {
      const instId = type === 'weapon' ? edS.weaponInstId : edS.costumeInstId;
      const templateId = type === 'weapon' ? (edS.weaponId || null) : (edS.costumeId || null);
      if (!templateId || !instId) return;
      const affixes = getItemAffixes(type, templateId);
      if (!affixes || !Array.isArray(affixes)) return;
      affixes.forEach(a => {
        if (a.isNegative) return; // 负面词条不加
        if (a.stat === 'atkBonus')   affAtk  += a.value;
        if (a.stat === 'critBonus')  affCrit += a.value / 100;
        if (a.stat === 'hpBonus')    affHp   += a.value;
        if (a.stat === 'defBonus')   affDef   += a.value;
        if (a.stat === 'mpBonus')    affMp   += a.value;
        if (a.stat === 'dodgeBonus') affDodge+= a.value / 100;
        if (a.stat === 'speedBonus') affSpd  += a.value;
      });
    });
  }
  hp += affHp; mp += affMp; atk += affAtk; def += affDef;
  crit += affCrit; dodge += affDodge; spd += affSpd;
  breakdown.affix.hp += affHp; breakdown.affix.mp += affMp;
  breakdown.affix.atk += affAtk; breakdown.affix.def += affDef;
  breakdown.affix.crit += affCrit; breakdown.affix.dodge += affDodge;
  breakdown.affix.spd += affSpd;

  // ── 强化加成（与 battle.js calcFinalStats enhAtk/enhDef/enhHp/enhMp 一致）──
  if (typeof edS !== 'undefined' && typeof calcEnhBonus === 'function' && Array.isArray(edS.bag)) {
    // 武器强化
    const wInstId = edS.weaponInstId;
    if (wInstId) {
      const wInst = edS.bag.find(i => i.instId === wInstId);
      if (wInst) {
        const b = calcEnhBonus(wInst);
        const eAtk=b.atk||0, eDef=b.def||0, eHp=b.hp||0, eMp=b.mp||0;
        atk += eAtk; def += eDef; hp += eHp; mp += eMp;
        breakdown.enhance.atk += eAtk; breakdown.enhance.def += eDef;
        breakdown.enhance.hp += eHp; breakdown.enhance.mp += eMp;
      }
    }
    // 防具强化
    const cInstId = edS.costumeInstId;
    if (cInstId) {
      const cInst = edS.bag.find(i => i.instId === cInstId);
      if (cInst) {
        const b = calcEnhBonus(cInst);
        const eAtk=b.atk||0, eDef=b.def||0, eHp=b.hp||0, eMp=b.mp||0;
        atk += eAtk; def += eDef; hp += eHp; mp += eMp;
        breakdown.enhance.atk += eAtk; breakdown.enhance.def += eDef;
        breakdown.enhance.hp += eHp; breakdown.enhance.mp += eMp;
      }
    }
  }

  // ── 出战宠物装备加成（与 battle.js calcFinalStats petAtk/petDef/petHp/petSpd 一致）──
  let petAtk=0, petDef=0, petHp=0, petSpd=0, petInt=0;
  if (typeof petGetActive === 'function' && typeof petGetEquipBonus === 'function') {
    const activePet = petGetActive();
    if (activePet) {
      const eb = petGetEquipBonus(activePet);
      petAtk = eb.atk || 0; petDef = eb.def || 0;
      petHp  = eb.hp  || 0; petSpd = eb.spd || 0; petInt = eb.int || 0;
    }
  }
  atk += petAtk; def += petDef; hp += petHp; spd += petSpd; mp += petInt;
  breakdown.pet.atk += petAtk; breakdown.pet.def += petDef;
  breakdown.pet.hp += petHp; breakdown.pet.spd += petSpd; breakdown.pet.mp += petInt;

  // ── 门派被动加成（与 battle.js _getSectBonusFor 一致）──
  let sbHp=0, sbAtk=0, sbDef=0, sbMp=0, sbSpd=0, sbCrit=0, sbDodge=0;
  if (typeof getSectPassiveBonus === 'function' && typeof edS !== 'undefined') {
    const sb = getSectPassiveBonus(edS.sect || null);
    sbHp = sb.hp || 0; sbAtk = sb.atk || 0; sbDef = sb.def || 0;
    sbMp = sb.mp || 0; sbSpd = sb.spd || 0;
    sbCrit = (sb.crit || 0) / 100; sbDodge = (sb.dodge || 0) / 100;
  }
  hp += sbHp; mp += sbMp; atk += sbAtk; def += sbDef; spd += sbSpd;
  crit += sbCrit; dodge += sbDodge;
  breakdown.sect.hp += sbHp; breakdown.sect.mp += sbMp;
  breakdown.sect.atk += sbAtk; breakdown.sect.def += sbDef;
  breakdown.sect.spd += sbSpd; breakdown.sect.crit += sbCrit; breakdown.sect.dodge += sbDodge;

  // ── 境界加成（与 battle.js getRealmAttrBonus 一致）──
  let realmHp=0, realmAtk=0, realmDef=0, realmMp=0, realmDodge=0, realmCrit=0, realmSpd=0;
  if (typeof getRealmAttrBonus === 'function') {
    const rb = getRealmAttrBonus();
    realmHp = rb.hp || 0; realmAtk = rb.atk || 0; realmDef = rb.def || 0;
    realmMp = rb.mp || 0; realmDodge = rb.dodge || 0; realmCrit = rb.crit || 0;
    realmSpd = rb.spd || 0;
  }
  hp += Math.round(realmHp); mp += Math.round(realmMp);
  atk += realmAtk; def += realmDef; spd += realmSpd;
  crit += realmCrit / 100; dodge += realmDodge / 100;
  breakdown.realm.hp += Math.round(realmHp); breakdown.realm.mp += Math.round(realmMp);
  breakdown.realm.atk += realmAtk; breakdown.realm.def += realmDef;
  breakdown.realm.spd += realmSpd; breakdown.realm.crit += realmCrit / 100;
  breakdown.realm.dodge += realmDodge / 100;

  // ── 天赋加成（与 battle.js stGetAllTalentEffects 一致）──
  let tHp=0, tAtk=0, tDef=0, tMp=0, tSpd=0, tCrit=0, tDodge=0;
  if (typeof stGetAllTalentEffects === 'function') {
    const te = stGetAllTalentEffects();
    const ef = te.effects || {};
    tHp = ef.hp || 0; tAtk = ef.atk || 0; tDef = ef.def || 0;
    tMp = ef.mp || 0; tSpd = ef.spd || 0;
    tCrit = (ef.crit || 0) / 100; tDodge = (ef.dodge || 0) / 100;
  }
  hp += tHp; mp += tMp; atk += tAtk; def += tDef; spd += tSpd;
  crit += tCrit; dodge += tDodge;
  breakdown.talent.hp += tHp; breakdown.talent.mp += tMp;
  breakdown.talent.atk += tAtk; breakdown.talent.def += tDef;
  breakdown.talent.spd += tSpd; breakdown.talent.crit += tCrit;
  breakdown.talent.dodge += tDodge;

  // ── 情缘加成（与 battle.js ROM.getBattleBonus 一致）──
  let romAtk=0, romDef=0, romHp=0, romCrit=0;
  if (typeof ROM !== 'undefined' && typeof ROM.getBattleBonus === 'function') {
    const rb = ROM.getBattleBonus();
    if (rb) {
      romAtk = rb.atk || 0; romDef = rb.def || 0;
      romHp = rb.hp || 0; romCrit = (rb.crit || 0) / 100;
    }
  }
  hp += romHp; atk += romAtk; def += romDef; crit += romCrit;
  breakdown.romance.hp += romHp; breakdown.romance.atk += romAtk;
  breakdown.romance.def += romDef; breakdown.romance.crit += romCrit;

  // ── 结义加成（与 battle.js SW.getBonuses 一致）──
  let swAtk=0, swDef=0, swCrit=0;
  if (typeof SW !== 'undefined' && typeof SW.getBonuses === 'function') {
    const swb = SW.getBonuses();
    swAtk = swb.atkBonus || 0; swDef = swb.defBonus || 0;
    swCrit = (swb.critBonus || 0) / 100;
  }
  atk += swAtk; def += swDef; crit += swCrit;
  breakdown.sworn.atk += swAtk; breakdown.sworn.def += swDef;
  breakdown.sworn.crit += swCrit;

  return { hp, mp, atk, def, crit, dodge, spd, bonusTags: base.bonusTags, breakdown };
}

/**
 * 统一缓存函数：属性变更时调用一次，把 getTotalStats() 的结果写入 edS
 * 所有页面/系统需要获取玩家属性时，直接读 edS.equippedXxx 缓存值
 * ★ 改造（2026-05-05）：新增 equippedAtk/Def/Crit/Dodge/Spd/equippedBreakdown
 */
function refreshEquippedStats() {
  const ts = getTotalStats();
  if (typeof edS === 'undefined') return ts;
  edS.equippedMaxHp  = ts.hp;
  edS.equippedMaxMp  = ts.mp;
  edS.equippedAtk    = ts.atk;
  edS.equippedDef    = ts.def;
  edS.equippedCrit   = ts.crit;
  edS.equippedDodge  = ts.dodge;
  edS.equippedSpd    = ts.spd;
  edS.equippedBreakdown = ts.breakdown;
  edS.maxHp = ts.hp;
  edS.maxMp = ts.mp;
  return ts;
}
