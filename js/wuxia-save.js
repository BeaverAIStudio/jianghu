/**
 * wuxia-save.js — 江湖将将胡 统一存档管理模块 v5
 * --------------------------------------------------
 *  所有页面（town/dungeon/battle/sect）统一通过此模块读写玩家数据，
 *  确保 wuxia_player_profile / wuxia_editor / wuxia_save /
 *  wuxia_travel 四份存档同时一致。
 *
 *  ★ 规范：
 *    1. wuxia_player_profile 为唯一权威源（Single Source of Truth）
 *    2. 所有页面均使用本模块的 API，不直接读写 localStorage
 *    3. read/write/hp/silver/bag 各操作均有专门 API
 *
 *  API 清单：
 *    loadProfile()       — 加载玩家档案（返回 profile 格式）
 *    loadEdS()           — 加载并返回完整 edS（用于 dungeon/battle 页面）
 *    saveProfile(profile)— 保存全部四份存档
 *    syncHp(hp,mh,mp,mm) — 同步气血内力（自动保留其他字段）
 *    syncSilver(v)       — 同步银两
 *    syncBag(bag)        — 同步背包
 *    initPage(edS)       — 页面初始化：从权威源填充 edS（替代各页面 townInit 逻辑）
 *    verifySync()        — 调试用
 */
(function () {
  'use strict';

  const KEY_PROFILE  = 'wuxia_player_profile';
  const KEY_EDITOR   = 'wuxia_editor';
  const KEY_SAVE     = 'wuxia_save';
  const KEY_TRAVEL   = 'wuxia_travel';
  const KEY_BAG      = 'wuxia_bag';
  const KEY_PROGRESS = 'wuxia_player_progress';

  /* ------------------------------------------------------------------
   *  工具
   * ----------------------------------------------------------------*/
  function safeParse(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[WuxiaSave] 解析失败:', key, e);
      return null;
    }
  }

  function safeStringify(val) {
    try { return JSON.stringify(val); } catch(e) { return '{}'; }
  }

  /* ------------------------------------------------------------------
   *  1) loadProfile —— 返回玩家档案（基础属性集）
   *     优先 wuxia_player_profile，fallback 其他键
   * ----------------------------------------------------------------*/
  function loadProfile() {
    let profile = safeParse(KEY_PROFILE);
    if (!profile) {
      // fallback
      let src = safeParse(KEY_SAVE) || safeParse(KEY_EDITOR) || safeParse(KEY_TRAVEL);
      if (!src) return null;

      // wuxia_travel 格式：数据在 state 里
      if (src && src.state) {
        const s = src.state;
        return {
          name:     s.name     || '无名侠客',
          level:    s.level    || 1,
          totalExp: s.totalExp || 0,
          hp:       s.hp > 0 && s.hp <= 100
                     ? Math.round(s.hp / 100 * (s.maxHp || 100))
                     : (s.hp   || 100),
          maxHp:    s.maxHp    || 100,
          mp:       s.mp       || 50,
          maxMp:    s.maxMp    || 100,
          silver:   s.silver   || 0,
          bag:      s.bag      || [],
          skills:   s.skills   || [],
        };
      }

      return deepClone(src);
    }

    // 补充 learnedSkills/equippedSkills（权威存储在 wuxia_player_progress）
    const _progress = safeParse(KEY_PROGRESS);
    if (!profile.learnedSkills && _progress?.learnedSkills) {
      profile.learnedSkills = _progress.learnedSkills;
    }
    if (!profile.equippedSkills && _progress?.equippedSkills) {
      profile.equippedSkills = _progress.equippedSkills;
    }

    return deepClone(profile);
  }

  /* ------------------------------------------------------------------
   *  2) loadEdS —— 返回完整 edS（用于 dungeon/battle 页面）
   *     合并 profile + progress + travel 数据
   * ----------------------------------------------------------------*/
  function loadEdS() {
    const profile   = safeParse(KEY_PROFILE);
    const editor    = safeParse(KEY_EDITOR);
    const save      = safeParse(KEY_SAVE);
    const travel    = safeParse(KEY_TRAVEL);
    const progress  = safeParse(KEY_PROGRESS);
    const bagData   = safeParse(KEY_BAG);
    const base      = {};  // ★ 修复（2026-05-05）：初始化 base 对象

    // 用 profile 的绝对 HP/MP/level/exp 覆盖（profile 是权威源）
    if (profile) {
      // ★ 修复（2026-05-05）：name 必须从 profile 读取，否则 loadEdS() 返回 undefined 导致变无名侠客
      if (profile.name && profile.name !== '') base.name = profile.name;
      // ★ 修复（2026-05-04）：直接用 profile 中的值，不调用 edStats()
      // edStats() 在不同页面返回值不一致（随机成长依赖 level-system.js 加载时机）
      // ★ 修复（2026-05-05）：防止时间戳等脏值（>9999）被误用为 HP/MP 上限
      const _MAX_STAT = 9999;
      if (profile.equippedMaxHp > 0 && profile.equippedMaxHp <= _MAX_STAT) {
        base.maxHp = profile.equippedMaxHp;
      } else if (profile.maxHp != null && profile.maxHp > 0 && profile.maxHp <= _MAX_STAT) {
        base.maxHp = profile.maxHp;
      }
      if (profile.equippedMaxMp > 0 && profile.equippedMaxMp <= _MAX_STAT) {
        base.maxMp = profile.equippedMaxMp;
      } else if (profile.maxMp != null && profile.maxMp > 0 && profile.maxMp <= _MAX_STAT) {
        base.maxMp = profile.maxMp;
      }
      // 当前 hp/mp 同样防脏值
      if (profile.hp != null && profile.hp >= 0 && profile.hp <= _MAX_STAT) base.hp = profile.hp;
      if (profile.mp != null && profile.mp >= 0 && profile.mp <= _MAX_STAT) base.mp = profile.mp;
      // ★ 修复（2026-05-05）：检测到脏值时立即清理 localStorage，防止脏值扩散
      if (profile.hp != null && (typeof profile.hp !== 'number' || profile.hp < 0 || profile.hp > _MAX_STAT)) {
        console.warn('[loadEdS] profile.hp 脏值已清理:', profile.hp);
        try {
          const _cp = JSON.parse(localStorage.getItem('wuxia_player_profile') || '{}');
          if (_cp) { _cp.hp = 1; localStorage.setItem('wuxia_player_profile', JSON.stringify(_cp)); }
          const _ce = JSON.parse(localStorage.getItem('wuxia_editor') || '{}');
          if (_ce) { _ce.hp = 1; localStorage.setItem('wuxia_editor', JSON.stringify(_ce)); }
          const _cs = JSON.parse(localStorage.getItem('wuxia_save') || '{}');
          if (_cs) { _cs.hp = 1; localStorage.setItem('wuxia_save', JSON.stringify(_cs)); }
        } catch(_){}
      }
      if (profile.mp != null && (typeof profile.mp !== 'number' || profile.mp < 0 || profile.mp > _MAX_STAT)) {
        console.warn('[loadEdS] profile.mp 脏值已清理:', profile.mp);
        try {
          const _cp = JSON.parse(localStorage.getItem('wuxia_player_profile') || '{}');
          if (_cp) { _cp.mp = 0; localStorage.setItem('wuxia_player_profile', JSON.stringify(_cp)); }
          const _ce = JSON.parse(localStorage.getItem('wuxia_editor') || '{}');
          if (_ce) { _ce.mp = 0; localStorage.setItem('wuxia_editor', JSON.stringify(_ce)); }
          const _cs = JSON.parse(localStorage.getItem('wuxia_save') || '{}');
          if (_cs) { _cs.mp = 0; localStorage.setItem('wuxia_save', JSON.stringify(_cs)); }
        } catch(_){}
      }
      if (profile.level != null)    base.level    = profile.level;
      if (profile.totalExp != null) base.totalExp = profile.totalExp;
      if (profile.skills != null)   base.skills   = profile.skills;
      // ★ 修复（2026-05-05）：装备选中状态也必须从 profile/editor 恢复到 base
      // 否则 initPage() 无法把这些字段写回页面 edS，导致刷新后装备丢失
      // ★ 修复（2026-05-05）：name 也加入 fallback 列表，确保 editor/save 里的名字不丢失
      // ★ 修复（2026-05-05）：sect 为主字段，同时兼容旧存档的 sectId
      ['name','weaponInstId','costumeInstId','accessoryInstId','horseId','sect','sectRank','sectContrib','sectLeaveCooldown','sectId',
       'origin','karma','reputation',
       'parts','custom','useCustom','equips','equippedFrame','equippedTitlePlate',
       'realm','silver','learnedSkills'].forEach(k => {
        if (profile && profile[k] != null) base[k] = profile[k];
        else if (editor && editor[k] != null) base[k] = editor[k];
        else if (save && save[k] != null) base[k] = save[k];
      });
      // ★ 修复（2026-05-06）：learnedSkills 权威存储在 wuxia_player_progress
      //   如果 profile/editor/save 中都没有，从 wuxia_player_progress 读取
      if (!base.learnedSkills && typeof localStorage !== 'undefined') {
        try {
          const progress = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
          if (progress.learnedSkills) base.learnedSkills = progress.learnedSkills;
        } catch(e) {}
      }
      // ★ 修复（2026-05-06）：equippedSkills 权威存储在 wuxia_player_progress
      if (!base.equippedSkills && typeof localStorage !== 'undefined') {
        try {
          const progress = JSON.parse(localStorage.getItem('wuxia_player_progress') || '{}');
          if (progress.equippedSkills) base.equippedSkills = progress.equippedSkills;
        } catch(e) {}
      }
      // ★ 修复（2026-05-05）：name fallback —— 防止 profile.name 是空字符串导致变无名侠客
      if ((!base.name || base.name === '') && editor && editor.name && editor.name !== '') base.name = editor.name;
      if ((!base.name || base.name === '') && save   && save.name   && save.name   !== '') base.name = save.name;
    }

    // 用 travel 百分比修正（如果有更好的值）
    if (travel && travel.state) {
      const pct = travel.state.hp;
      const mh  = base.maxHp || 100;
      if (pct != null && pct > 0 && pct <= 100) {
        const absHp = Math.round(mh * pct / 100);
        if (absHp > 0) base.hp = absHp;
      }
      // ★ 修复（2026-05-05）：travel.state.mp 必须是百分比（0-100），
      // 旧 bug 可能存入绝对值（>100），必须丢弃并清理
      if (travel.state.mp != null && travel.state.mp > 0 && travel.state.mp <= 100) {
        base.mp = Math.round((base.maxMp || 100) * travel.state.mp / 100);
      } else if (travel.state.mp != null && travel.state.mp > 100) {
        console.warn('[loadEdS] travel.state.mp 脏值(绝对值)已丢弃:', travel.state.mp);
        try {
          const _ct = JSON.parse(localStorage.getItem('wuxia_travel') || '{}');
          if (_ct && _ct.state) {
            _ct.state.mp = 100; // 重置为满百分比
            localStorage.setItem('wuxia_travel', JSON.stringify(_ct));
          }
        } catch(_){}
      }
    }

    // 用 progress 覆盖经验/等级（战斗系统最实时）
    if (progress) {
      if (progress.level    != null) base.level    = progress.level;
      if (progress.totalExp != null) base.totalExp = progress.totalExp;
      if (progress.primaryPts != null) base.primaryPts = progress.primaryPts;
      if (progress.freePoints != null) base.freePoints = progress.freePoints;
      if (progress.fate      != null) base.fate      = progress.fate;
      if (progress.originPts  != null) base.originPts  = progress.originPts;
    }

    // 背包：优先 bagData（最实时），其次 base.bag
    if (bagData && Array.isArray(bagData) && bagData.length > 0) {
      base.bag = bagData;
    }

    // 防止空值
    base.name     = base.name     || '无名侠客';
    base.level    = base.level    || 1;
    base.totalExp = base.totalExp || 0;
    base.hp       = base.hp       || base.maxHp || 150;
    base.maxHp    = base.maxHp    || 150;
    base.mp       = base.mp       || base.maxMp || 50;
    base.maxMp    = base.maxMp    || 100;
    base.silver   = base.silver   || 0;
    base.bag      = base.bag      || [];

    // ★ 兼容旧存档：如果 sect 字段为空但 sectId 有值（历史遗留），回填 sect
    if (!base.sect && base.sectId) {
      base.sect = base.sectId;
      console.log('[loadEdS] 兼容回填: sectId → sect =', base.sect);
    }

    // ★ 兼容旧存档：确保 parts/custom/useCustom 所有字段都有默认值
    //   旧存档的 wuxia_editor 可能缺少 aura 等新增字段，导致打开背包装饰页显示"无"
    if (!base.parts || typeof base.parts !== 'object') base.parts = {head:0, body:0, arms:0, legs:0, aura:0};
    else {
      if (typeof base.parts.head === 'undefined') base.parts.head = 0;
      if (typeof base.parts.body === 'undefined') base.parts.body = 0;
      if (typeof base.parts.arms === 'undefined') base.parts.arms = 0;
      if (typeof base.parts.legs === 'undefined') base.parts.legs = 0;
      if (typeof base.parts.aura === 'undefined') base.parts.aura = 0;
    }
    if (!base.custom || typeof base.custom !== 'object') base.custom = {head:'', body:'', arms:'', legs:'', aura:''};
    else {
      if (typeof base.custom.head === 'undefined') base.custom.head = '';
      if (typeof base.custom.body === 'undefined') base.custom.body = '';
      if (typeof base.custom.arms === 'undefined') base.custom.arms = '';
      if (typeof base.custom.legs === 'undefined') base.custom.legs = '';
      if (typeof base.custom.aura === 'undefined') base.custom.aura = '';
    }
    if (!base.useCustom || typeof base.useCustom !== 'object') base.useCustom = {head:false, body:false, arms:false, legs:false, aura:false};
    else {
      if (typeof base.useCustom.head === 'undefined') base.useCustom.head = false;
      if (typeof base.useCustom.body === 'undefined') base.useCustom.body = false;
      if (typeof base.useCustom.arms === 'undefined') base.useCustom.arms = false;
      if (typeof base.useCustom.legs === 'undefined') base.useCustom.legs = false;
      if (typeof base.useCustom.aura === 'undefined') base.useCustom.aura = false;
    }

    return base;
  }

  /* ------------------------------------------------------------------
   *  3) initPage —— 页面初始化：把存档填充到页面 edS 对象
   *     替代各页面零散的 localStorage.getItem 逻辑
   *     调用方式：initPage(edS); // edS 已在页面中定义
   * ----------------------------------------------------------------*/
  function initPage(edS) {
    if (!edS || typeof edS !== 'object') {
      console.warn('[WuxiaSave.initPage] edS 无效');
      return;
    }
    const loaded = loadEdS();

    // 逐字段写入 edS（避免覆盖 edS 中未定义的字段）
    const fields = [
      'name','level','totalExp','hp','maxHp','mp','maxMp',
      'equippedMaxHp','equippedMaxMp',
      'equippedAtk','equippedDef','equippedCrit','equippedDodge','equippedSpd',
      'equippedBreakdown',
      'silver','bag','skills',
      'primaryPts','freePoints','fate','originPts',
      'weaponInstId','costumeInstId','accessoryInstId',
      'parts','custom','useCustom','horseId','sect','sectRank','sectContrib','sectLeaveCooldown',
      'origin','originPts','karma','reputation',
      'realm','equips','custom','useCustom','equippedFrame','equippedTitlePlate',
    ];
    fields.forEach(k => {
      if (loaded[k] !== undefined) {
        try { edS[k] = loaded[k]; } catch(e) {}
      }
    });

    // ★ 修复（2026-05-04）：直接用存档中的 equippedMaxHp，不用 edStats()/getTotalStats()
    const _totalHp = (edS.equippedMaxHp > 0)
      ? edS.equippedMaxHp
      : ((loaded.equippedMaxHp > 0) ? loaded.equippedMaxHp : (loaded.maxHp || 150));
    const _displayStr = `${_totalHp}`;
    console.log('[WuxiaSave.initPage] 完成:', edS.name, 'Lv.'+edS.level, 'HP:'+edS.hp+'/'+_displayStr, '背包:'+(edS.bag||[]).length+'件');
  }

  /* ------------------------------------------------------------------
   *  3.5) getPlayerStats —— 统一只读玩家数值快照
   *     所有页面/系统在需要玩家当前数值时，统一调用此函数
   *     返回最新快照（来自权威源 wuxia_player_profile）
   * --------------------------------------------------------------*/
  function getPlayerStats() {
    const loaded = loadEdS();
    return {
      name:     loaded.name     || '无名侠客',
      level:    loaded.level    || 1,
      totalExp: loaded.totalExp || 0,
      hp:       loaded.hp       || loaded.maxHp || 100,
      maxHp:    loaded.maxHp    || 100,
      equippedMaxHp: loaded.equippedMaxHp || loaded.maxHp || 100,
      mp:       loaded.mp       || loaded.maxMp || 50,
      maxMp:    loaded.maxMp    || 100,
      equippedMaxMp: loaded.equippedMaxMp || loaded.maxMp || 100,
      silver:   loaded.silver   || 0,
      bag:      loaded.bag      || [],
      skills:   loaded.skills   || [],
      realm:    loaded.realm    || null,
    };
  }

  /* ------------------------------------------------------------------
   *  4) saveProfile —— 写到所有四个键（格式各自正确）
   *     唯一写存档入口
   * ----------------------------------------------------------------*/
  function saveProfile(profile) {
    if (!profile || typeof profile !== 'object') {
      console.warn('[WuxiaSave] saveProfile: profile 无效', profile);
      return;
    }

    // ★ 修复（2026-05-04）：用装备后总值（edS.maxHp/edS.maxMp 已由调用方在装备变化时设置为 equipped total）
    // 不再用 edStats() 重算——不同页面算出来的基础值不一致（成长历史/依赖文件差异）
    // ★ 修复（2026-05-05）：防止脏值写入存档（hp/mp 当前值也要检查）
    const _MAX_STAT = 9999;
    const hp     = (profile.hp != null && profile.hp >= 0 && profile.hp <= _MAX_STAT) ? Math.max(1, Math.round(profile.hp)) : 1;
    const mp     = (profile.mp != null && profile.mp >= 0 && profile.mp <= _MAX_STAT) ? Math.max(0, Math.round(profile.mp)) : 0;
    const silver   = profile.silver  != null ? profile.silver : 0;
    const bag      = Array.isArray(profile.bag) ? profile.bag : [];
    let equippedMaxHp = (profile.equippedMaxHp > 0 && profile.equippedMaxHp <= _MAX_STAT) ? profile.equippedMaxHp : undefined;
    let equippedMaxMp = (profile.equippedMaxMp > 0 && profile.equippedMaxMp <= _MAX_STAT) ? profile.equippedMaxMp : undefined;
    if (!equippedMaxHp && typeof edS !== 'undefined' && edS.equippedMaxHp > 0 && edS.equippedMaxHp <= _MAX_STAT) equippedMaxHp = edS.equippedMaxHp;
    if (!equippedMaxMp && typeof edS !== 'undefined' && edS.equippedMaxMp > 0 && edS.equippedMaxMp <= _MAX_STAT) equippedMaxMp = edS.equippedMaxMp;
    // 兼容旧存档（没有 equipped 字段）：用 profile.maxHp 作为 fallback，同样防脏值
    const rawMaxHp = (profile.maxHp != null && profile.maxHp > 0 && profile.maxHp <= _MAX_STAT) ? profile.maxHp : 100;
    const rawMaxMp = (profile.maxMp != null && profile.maxMp > 0 && profile.maxMp <= _MAX_STAT) ? profile.maxMp : 100;
    const maxHp = equippedMaxHp || Math.max(1, Math.round(rawMaxHp));
    const maxMp = equippedMaxMp || Math.max(1, Math.round(rawMaxMp));

    // —— 读取现有存档中的不可丢失字段（兜底）——
    const _ep = safeParse(KEY_PROFILE);
    const _ee = safeParse(KEY_EDITOR);
    const _es = safeParse(KEY_SAVE);

    const level    = (profile.level    != null) ? profile.level    : (_ep?.level    ?? _ee?.level    ?? 1);
    const totalExp = (profile.totalExp != null) ? profile.totalExp : (_ep?.totalExp ?? _ee?.totalExp ?? 0);
    const name     = profile.name || _ep?.name || _ee?.name || _es?.name || '无名侠客';

    // 境界
    let realm = profile.realm;
    if (!realm || typeof realm.realm !== 'number') {
      realm = _ep?.realm || _ee?.realm || _es?.realm || null;
    }

    // 装备引用
    const weaponInstId  = profile.weaponInstId  != null ? profile.weaponInstId  : (_ee?.weaponInstId  ?? null);
    const costumeInstId = profile.costumeInstId != null ? profile.costumeInstId : (_ee?.costumeInstId ?? null);
    const accessoryInstId = profile.accessoryInstId != null ? profile.accessoryInstId : (_ee?.accessoryInstId ?? null);

    // 技能
    const skills = profile.skills || _ep?.skills || _ee?.skills || [];

    // ★ 修复（2026-05-06）：同步 learnedSkills 和 equippedSkills
    //   这两个字段权威存储在 wuxia_player_progress，但也要同步到其他存档键
    const _progress = safeParse(KEY_PROGRESS);
    const learnedSkills = profile.learnedSkills || _progress?.learnedSkills || _ee?.learnedSkills || _ep?.learnedSkills || [];
    const equippedSkills = profile.equippedSkills || _progress?.equippedSkills || _ee?.equippedSkills || _ep?.equippedSkills || [];

    try {
      // —— 1. wuxia_player_profile（权威格式）——
      let p = deepClone(_ep) || {};
      Object.assign(p, {
        name, level, totalExp,
        hp, maxHp, mp, maxMp,
        equippedMaxHp, equippedMaxMp,
        equippedAtk: profile.equippedAtk ?? edS?.equippedAtk ?? undefined,
        equippedDef: profile.equippedDef ?? edS?.equippedDef ?? undefined,
        equippedCrit: profile.equippedCrit ?? edS?.equippedCrit ?? undefined,
        equippedDodge: profile.equippedDodge ?? edS?.equippedDodge ?? undefined,
        equippedSpd: profile.equippedSpd ?? edS?.equippedSpd ?? undefined,
        equippedBreakdown: profile.equippedBreakdown ?? edS?.equippedBreakdown ?? undefined,
        silver, bag, skills,
        learnedSkills, equippedSkills,
        weaponInstId, costumeInstId, accessoryInstId,
      });
      // ★ 修复（2026-05-05）：sectId → sect，与游戏逻辑一致；补充 sectRank/sectLeaveCooldown
      ['parts','custom','useCustom','horseId','sect','sectRank','sectContrib','sectLeaveCooldown',
       'origin','karma','reputation','equips','equippedFrame','equippedTitlePlate'].forEach(k => {
        if (profile && profile[k] != null) p[k] = profile[k];
        else if (typeof edS !== 'undefined' && edS[k] != null) p[k] = edS[k];
      });
      if (realm) p.realm = realm;
      localStorage.setItem(KEY_PROFILE, safeStringify(p));

      // —— 2. wuxia_save（与 edS 相同结构）——
      let s = deepClone(_es) || {};
      Object.assign(s, {
        name, level, totalExp,
        hp, maxHp, mp, maxMp,
        equippedMaxHp, equippedMaxMp,
        equippedAtk: profile.equippedAtk ?? edS?.equippedAtk ?? undefined,
        equippedDef: profile.equippedDef ?? edS?.equippedDef ?? undefined,
        equippedCrit: profile.equippedCrit ?? edS?.equippedCrit ?? undefined,
        equippedDodge: profile.equippedDodge ?? edS?.equippedDodge ?? undefined,
        equippedSpd: profile.equippedSpd ?? edS?.equippedSpd ?? undefined,
        equippedBreakdown: profile.equippedBreakdown ?? edS?.equippedBreakdown ?? undefined,
        silver, bag,
        weaponInstId, costumeInstId, accessoryInstId,
      });
      // ★ 修复（2026-05-05）：sectId → sect
      ['parts','custom','useCustom','horseId','sect','sectRank','sectContrib','sectLeaveCooldown',
       'origin','karma','reputation','equips','equippedFrame','equippedTitlePlate'].forEach(k => {
        if (profile && profile[k] != null) s[k] = profile[k];
        else if (typeof edS !== 'undefined' && edS[k] != null) s[k] = edS[k];
      });
      if (realm) s.realm = realm;
      localStorage.setItem(KEY_SAVE, safeStringify(s));

      // —— 3. wuxia_travel（HP/MP 存百分比）——
      let t = deepClone(safeParse(KEY_TRAVEL)) || { state: {} };
      if (!t.state) t.state = {};
      Object.assign(t.state, {
        hp:     maxHp > 0 ? Math.round((hp / maxHp) * 100) : 100,
        mp:     maxMp > 0 ? Math.round((mp / maxMp) * 100) : 100,
        maxHp, maxMp,
        silver, level, name,
        bag: bag,
      });
      localStorage.setItem(KEY_TRAVEL, safeStringify(t));

      // —— 4. wuxia_editor（edS 格式）——
      let e = deepClone(_ee) || {};
      Object.assign(e, {
        name, level, totalExp,
        hp, maxHp, mp, maxMp,
        silver, bag,
        weaponInstId, costumeInstId, accessoryInstId,
        skills,
        learnedSkills, equippedSkills,
      });
      // ★ 修复（2026-05-05）：sectId → sect
      ['parts','custom','useCustom','horseId','sect','sectRank','sectContrib','sectLeaveCooldown',
       'origin','karma','reputation','equips','equippedFrame','equippedTitlePlate'].forEach(k => {
        if (profile && profile[k] != null) e[k] = profile[k];
        else if (typeof edS !== 'undefined' && edS[k] != null) e[k] = edS[k];
      });
      if (realm) e.realm = realm;
      localStorage.setItem(KEY_EDITOR, safeStringify(e));

      // —— 5. wuxia_bag（独立背包）——
      localStorage.setItem(KEY_BAG, safeStringify(bag));

      // —— 6. wuxia_player_progress（技能权威存储）——
      // ★ 修复（2026-05-06）：同步 learnedSkills 和 equippedSkills 到 wuxia_player_progress
      let prog = deepClone(_progress) || {};
      prog.learnedSkills = learnedSkills;
      prog.equippedSkills = equippedSkills;
      // 同步等级和经验（战斗系统可能更新）
      if (level != null) prog.level = level;
      if (totalExp != null) prog.totalExp = totalExp;
      localStorage.setItem(KEY_PROGRESS, safeStringify(prog));

      console.log('[WuxiaSave] saveProfile 完成，HP:', hp, '/', maxHp, '已学技能:', learnedSkills.length, '件');
    } catch (e) {
      console.error('[WuxiaSave] saveProfile 失败:', e);
    }
  }

  /* ------------------------------------------------------------------
   *  5) syncHp —— 只同步气血/内力（战斗后快速写入）
   * ----------------------------------------------------------------*/
  function syncHp(hp, maxHp, mp, maxMp) {
    // ★ 修复（2026-05-05）：防止时间戳等脏值（>9999）被写入
    const _MAX_STAT = 9999;
    // 过滤 hp/mp 参数中的脏值（当前值允许范围更大一些，但也要防止极端值）
    const h  = (typeof hp === 'number' && hp > 0 && hp <= _MAX_STAT * 10) ? Math.round(hp) : 1;
    const m  = (typeof mp === 'number' && mp >= 0 && mp <= _MAX_STAT * 10) ? Math.round(mp) : 0;
    // maxHp/maxMp 参数中的脏值直接丢弃，优先用存档中的 equippedMaxHp/Mp
    const mH_arg = (typeof maxHp === 'number' && maxHp > 0 && maxHp <= _MAX_STAT) ? maxHp : null;
    const mM_arg = (typeof maxMp === 'number' && maxMp > 0 && maxMp <= _MAX_STAT) ? maxMp : null;

    const _ep = safeParse(KEY_PROFILE);
    const _ee = safeParse(KEY_EDITOR);
    const _es = safeParse(KEY_SAVE);

    // 保留其他字段
    const silver    = _ep?.silver ?? _ee?.silver ?? _es?.silver ?? 0;
    const name      = _ep?.name   ?? _ee?.name   ?? _es?.name   ?? '无名侠客';
    const level     = _ep?.level  ?? _ee?.level  ?? _es?.level  ?? 1;
    const totalExp  = _ep?.totalExp ?? _ee?.totalExp ?? _es?.totalExp ?? 0;
    const bag       = _ee?.bag     ?? _es?.bag     ?? _ep?.bag ?? [];
    const realm     = _ep?.realm  ?? _ee?.realm  ?? _es?.realm ?? null;
    const weaponInstId  = _ee?.weaponInstId  ?? null;
    const costumeInstId = _ee?.costumeInstId ?? null;
    const accessoryInstId = _ee?.accessoryInstId ?? null;

    // ★ 修复（2026-05-04）：直接用 equippedMaxHp，不用 edStats() 重算
    // 同时：优先用过滤后的参数值（参数本身已通过脏值检测），其次用 equippedMaxHp，最后 fallback
    const _edEquippedHp = (typeof edS !== 'undefined' && edS.equippedMaxHp > 0 && edS.equippedMaxHp <= _MAX_STAT)
      ? edS.equippedMaxHp : null;
    const _edEquippedMp = (typeof edS !== 'undefined' && edS.equippedMaxMp > 0 && edS.equippedMaxMp <= _MAX_STAT)
      ? edS.equippedMaxMp : null;
    const finalMaxHp = mH_arg || _edEquippedHp || (_ee?.equippedMaxHp > 0 && _ee.equippedMaxHp <= _MAX_STAT ? _ee.equippedMaxHp : 150);
    const finalMaxMp = mM_arg || _edEquippedMp || (_ee?.equippedMaxMp > 0 && _ee.equippedMaxMp <= _MAX_STAT ? _ee.equippedMaxMp : 100);
    const equippedMaxHp = finalMaxHp;
    const equippedMaxMp = finalMaxMp;

    saveProfile({
      hp: h, maxHp: finalMaxHp,
      mp: m, maxMp: finalMaxMp,
      equippedMaxHp, equippedMaxMp,
      silver, bag, name, level, totalExp,
      realm,
      weaponInstId, costumeInstId, accessoryInstId,
    });
  }

  /* ------------------------------------------------------------------
   *  6) syncSilver —— 同步银两
   * ----------------------------------------------------------------*/
  function syncSilver(silver) {
    const v = Math.max(0, Math.floor(silver || 0));
    [KEY_PROFILE, KEY_SAVE, KEY_EDITOR].forEach(key => {
      const d = safeParse(key);
      if (d) { d.silver = v; localStorage.setItem(key, safeStringify(d)); }
    });
    const t = safeParse(KEY_TRAVEL);
    if (t) { if (!t.state) t.state = {}; t.state.silver = v; localStorage.setItem(KEY_TRAVEL, safeStringify(t)); }
    console.log('[WuxiaSave] syncSilver:', v);
  }

  /* ------------------------------------------------------------------
   *  7) syncBag —— 同步背包（可选：合并 vs 替换）
   * ----------------------------------------------------------------*/
  function syncBag(bag, merge) {
    if (!Array.isArray(bag)) return;
    const v = bag;
    [KEY_PROFILE, KEY_SAVE, KEY_EDITOR].forEach(key => {
      const d = safeParse(key);
      if (d) { d.bag = v; localStorage.setItem(key, safeStringify(d)); }
    });
    localStorage.setItem(KEY_BAG, safeStringify(v));
    const t = safeParse(KEY_TRAVEL);
    if (t) { if (!t.state) t.state = {}; t.state.bag = v; localStorage.setItem(KEY_TRAVEL, safeStringify(t)); }
    console.log('[WuxiaSave] syncBag:', v.length, '件');
  }

  /* ------------------------------------------------------------------
   *  8) verifySync —— 调试用
   * ----------------------------------------------------------------*/
  function verifySync() {
    const p = safeParse(KEY_PROFILE);
    const e = safeParse(KEY_EDITOR);
    const s = safeParse(KEY_SAVE);
    const t = safeParse(KEY_TRAVEL);
    const b = safeParse(KEY_BAG);
    const result = {
      profile: p ? { hp: p.hp, maxHp: p.maxHp, silver: p.silver, level: p.level } : null,
      editor:  e ? { hp: e.hp, maxHp: e.maxHp, silver: e.silver, level: e.level } : null,
      save:    s ? { hp: s.hp, maxHp: s.maxHp, silver: s.silver, level: s.level } : null,
      travel:  t?.state ? { hp: t.state.hp, silver: t.state.silver } : null,
      bag:     b ? b.length + '件' : null,
    };
    console.table(result);
    return result;
  }

  /* ------------------------------------------------------------------
   *  工具：深拷贝
   * ----------------------------------------------------------------*/
  function deepClone(obj) {
    if (obj == null) return null;
    try { return JSON.parse(JSON.stringify(obj)); } catch(e) { return null; }
  }

  /* ==================================================================
   *  暴露公共 API
   * ================================================================*/
  window.WuxiaSave = {
    loadProfile,
    loadEdS,
    initPage,
    saveProfile,
    syncHp,
    syncSilver,
    syncBag,
    verifySync,
    // 常量
    KEY_PROFILE,
    KEY_EDITOR,
    KEY_SAVE,
    KEY_TRAVEL,
    KEY_BAG,
    KEY_PROGRESS,
  };

  console.log('[WuxiaSave] 统一存档模块 v5 已加载');
})();
