// performance-utils.js — 性能优化工具集
// version: 1

// ══════════════════════════════════════════════
//  1. 防抖存档系统（Debounced Save）
// ══════════════════════════════════════════════

/**
 * 创建防抖存档函数
 * @param {Function} saveFn - 原始存档函数
 * @param {number} delay - 延迟毫秒数（默认500ms）
 * @returns {Function} 防抖后的存档函数
 */
function createDebouncedSave(saveFn, delay = 500) {
  let timer = null;
  let pending = false;
  
  return function debouncedSave(...args) {
    pending = true;
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      pending = false;
      if (typeof saveFn === 'function') {
        try {
          saveFn.apply(this, args);
        } catch (e) {
          console.error('[DebouncedSave] Error:', e);
        }
      }
    }, delay);
  };
}

/**
 * 创建节流存档函数
 * @param {Function} saveFn - 原始存档函数
 * @param {number} interval - 最小间隔毫秒数（默认1000ms）
 * @returns {Function} 节流后的存档函数
 */
function createThrottledSave(saveFn, interval = 1000) {
  let lastSave = 0;
  let timer = null;
  
  return function throttledSave(...args) {
    const now = Date.now();
    
    if (now - lastSave >= interval) {
      // 直接执行
      lastSave = now;
      if (typeof saveFn === 'function') {
        try {
          saveFn.apply(this, args);
        } catch (e) {
          console.error('[ThrottledSave] Error:', e);
        }
      }
    } else {
      // 延迟到下一个间隔
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        lastSave = Date.now();
        if (typeof saveFn === 'function') {
          try {
            saveFn.apply(this, args);
          } catch (e) {
            console.error('[ThrottledSave] Error:', e);
          }
        }
      }, interval - (now - lastSave));
    }
  };
}

// ══════════════════════════════════════════════
//  2. 批量存档管理器（Batch Save Manager）
// ══════════════════════════════════════════════

const SaveManager = {
  _queue: new Set(),
  _timer: null,
  _delay: 300,
  
  // 注册一个存档键到批量队列
  queue(key) {
    this._queue.add(key);
    this._schedule();
  },
  
  // 立即执行所有待存档
  flush() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    
    if (this._queue.size > 0) {
      // 合并所有待存档数据一次性写入
      this._batchSave();
      this._queue.clear();
    }
  },
  
  _schedule() {
    if (this._timer) return;
    
    this._timer = setTimeout(() => {
      this.flush();
    }, this._delay);
  },
  
  _batchSave() {
    // 子类可覆盖此方法实现具体的批量存档逻辑
    // 默认行为：触发各个模块的存档
    this._queue.forEach(key => {
      if (key === 'travel' && typeof travelSave === 'function') travelSave();
      if (key === 'npc' && typeof npcStateSave === 'function') npcStateSave();
      if (key === 'jianghu' && typeof jianghuSave === 'function') jianghuSave();
      if (key === 'dungeon' && typeof dungeonSave === 'function') dungeonSave();
    });
  }
};

// ══════════════════════════════════════════════
//  3. 内存缓存系统（Memory Cache）
// ══════════════════════════════════════════════

const DataCache = {
  _cache: new Map(),
  _maxSize: 100,
  
  get(key) {
    const item = this._cache.get(key);
    if (item && Date.now() - item.time < item.ttl) {
      // LRU：移到末尾表示最近使用
      this._cache.delete(key);
      this._cache.set(key, item);
      return item.data;
    }
    this._cache.delete(key);
    return null;
  },
  
  set(key, data, ttl = 60000) {
    // 清理过期项
    this._cleanup();
    
    // LRU：如果满了，删除最旧的
    if (this._cache.size >= this._maxSize) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
    
    this._cache.set(key, { data, time: Date.now(), ttl });
  },
  
  clear() {
    this._cache.clear();
  },
  
  _cleanup() {
    const now = Date.now();
    for (const [key, item] of this._cache) {
      if (now - item.time > item.ttl) {
        this._cache.delete(key);
      }
    }
  }
};

// ══════════════════════════════════════════════
//  4. 性能监控工具
// ══════════════════════════════════════════════

const PerfMonitor = {
  _marks: new Map(),
  
  start(label) {
    this._marks.set(label, performance.now());
  },
  
  end(label) {
    const start = this._marks.get(label);
    if (start) {
      const duration = performance.now() - start;
      this._marks.delete(label);
      
      // 慢操作警告（超过16ms，约一帧时间）
      if (duration > 16) {
        console.warn(`[PerfMonitor] Slow operation: ${label} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  },
  
  // 测量函数执行时间
  measure(fn, label) {
    return (...args) => {
      this.start(label);
      const result = fn.apply(this, args);
      this.end(label);
      return result;
    };
  }
};

// ══════════════════════════════════════════════
//  5. 优化后的存档函数（替换原函数）
// ══════════════════════════════════════════════

// 在页面加载完成后，替换原有的高频存档函数
function optimizeSaves() {
  // 替换 travelSave 为防抖版本
  if (typeof travelSave === 'function' && !travelSave._optimized) {
    const original = travelSave;
    travelSave = createDebouncedSave(original, 300);
    travelSave._optimized = true;
    travelSave.immediate = original; // 保留立即执行版本
  }
  
  // 替换 jianghuSave 为防抖版本
  if (typeof jianghuSave === 'function' && !jianghuSave._optimized) {
    const original = jianghuSave;
    jianghuSave = createDebouncedSave(original, 500);
    jianghuSave._optimized = true;
    jianghuSave.immediate = original;
  }
  
  // 替换 npcStateSave 为防抖版本
  if (typeof npcStateSave === 'function' && !npcStateSave._optimized) {
    const original = npcStateSave;
    npcStateSave = createDebouncedSave(original, 500);
    npcStateSave._optimized = true;
    npcStateSave.immediate = original;
  }
}

// 页面卸载前强制存档
window.addEventListener('beforeunload', () => {
  SaveManager.flush();
  
  // 调用原始存档函数确保数据保存
  if (typeof travelSave === 'function' && travelSave.immediate) {
    travelSave.immediate();
  }
  if (typeof jianghuSave === 'function' && jianghuSave.immediate) {
    jianghuSave.immediate();
  }
  if (typeof npcStateSave === 'function' && npcStateSave.immediate) {
    npcStateSave.immediate();
  }
});

// 导出
window.SaveManager = SaveManager;
window.DataCache = DataCache;
window.PerfMonitor = PerfMonitor;
window.createDebouncedSave = createDebouncedSave;
window.createThrottledSave = createThrottledSave;
window.optimizeSaves = optimizeSaves;
