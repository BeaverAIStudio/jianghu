// ════════════════════════════════════════════════════
//  data-materials.js  建筑升级材料数据
//  为 sect-building.js 提供材料的中文名和图标
// ════════════════════════════════════════════════════

const SECT_MATERIALS = {
  // ── 矿石类 ──
  item_iron_ore: {
    id: 'item_iron_ore',
    name: '铁矿石',
    icon: '🔩',
    desc: '普通铁矿石，可用于锻造兵器',
    color: '#a0a0a0',
  },
  item_copper_core: {
    id: 'item_copper_core',
    name: '铜芯矿',
    icon: '🔶',
    desc: '稀有铜芯矿，可提升装备品质',
    color: '#e8a040',
  },
  item_spirit_stone: {
    id: 'item_spirit_stone',
    name: '灵石',
    icon: '🔮',
    desc: '蕴含灵气的石头，建筑升级的重要材料',
    color: '#60c0ff',
  },
  // ── 草药类 ──
  item_herb_green: {
    id: 'item_herb_green',
    name: '青灵草',
    icon: '🌿',
    desc: '普通草药，用于炼丹的基础材料',
    color: '#60d060',
  },
  item_herb_blue: {
    id: 'item_herb_blue',
    name: '蓝玉芝',
    icon: '💧',
    desc: '稀有草药，炼丹的高级材料',
    color: '#60a0e0',
  },
  // ── 通用材料 ──
  item_beast_bone: {
    id: 'item_beast_bone',
    name: '兽骨',
    icon: '🦴',
    desc: '野兽骨骼，可用于炼器和建筑',
    color: '#d0c090',
  },
  item_jade_piece: {
    id: 'item_jade_piece',
    name: '玉碎片',
    icon: '💎',
    desc: '破碎的玉石，建筑精加工材料',
    color: '#80e0c0',
  },
};

/** 获取材料的中文名（兼容ID和已有name字段） */
function sbGetMatName(matId) {
  var mat = SECT_MATERIALS[matId];
  if (mat) return mat.name;
  // 兼容：如果已经是中文名，直接返回
  return matId;
}

/** 获取材料的图标 */
function sbGetMatIcon(matId) {
  var mat = SECT_MATERIALS[matId];
  return mat ? mat.icon : '📦';
}

/** 渲染材料行的HTML（中文名 + 图标 + 数量） */
function sbRenderMatRow(matId, need, have) {
  var name = sbGetMatName(matId);
  var icon = sbGetMatIcon(matId);
  var enough = have >= need;
  return icon + ' ' + name + ' <span style="color:' + (enough ? '#80e880' : '#ff6060') + '">' + have + '/' + need + '</span>';
}

window.SECT_MATERIALS = SECT_MATERIALS;
window.sbGetMatName = sbGetMatName;
window.sbGetMatIcon = sbGetMatIcon;
window.sbRenderMatRow = sbRenderMatRow;
