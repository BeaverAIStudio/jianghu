/**
 * 小游戏音效系统 v2.0
 * minigame-sounds.js
 *
 * Web Audio API 合成音效 + 视觉特效双引擎
 * 所有音效通过 Oscillator 合成，无需外部音频文件
 */

// ==================== 音频引擎 ====================
let _sfxActx = null;
let _sfxSessionId = 0;
const _sfxScheduledTimers = new Set();

function _sfxSchedule(fn, delay = 0) {
    const sessionId = _sfxSessionId;
    const timerId = setTimeout(() => {
        _sfxScheduledTimers.delete(timerId);
        if (sessionId !== _sfxSessionId) return;
        try { fn(); } catch (e) {}
    }, delay);
    _sfxScheduledTimers.add(timerId);
    return timerId;
}

function _sfxClearScheduledTimers() {
    _sfxScheduledTimers.forEach(timerId => clearTimeout(timerId));
    _sfxScheduledTimers.clear();
}

function _sfxGetCtx() {
    if (!_sfxActx) {
        _sfxActx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_sfxActx.state === 'suspended') {
        _sfxActx.resume();
    }
    return _sfxActx;
}

function _sfxDestroyCtx() {
    _sfxSessionId++;
    _sfxClearScheduledTimers();
    try {
        if (_sfxActx && _sfxActx.state !== 'closed') {
            _sfxActx.close();
        }
    } catch (e) {}
    _sfxActx = null;
}


function _resetSoundVisuals() {
    document.querySelectorAll('.sound-particle').forEach(el => el.remove());
    document.querySelectorAll('.dialog-content, .game-container').forEach(el => {
        if (el) el.style.transform = '';
    });
}


/** 播放一个带淡入淡出的音调 */
function _sfxTone(opts) {
    try {
        const ctx = _sfxGetCtx();
        const t = ctx.currentTime + (opts.delay || 0);
        const dur = opts.dur || 0.15;
        const vol = opts.vol || 0.2;

        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);

        const o = ctx.createOscillator();
        o.type = opts.type || 'sine';
        o.frequency.setValueAtTime(opts.freq || 440, t);
        if (opts.freqEnd) {
            o.frequency.exponentialRampToValueAtTime(
                Math.max(20, opts.freqEnd), t + dur
            );
        }
        o.connect(g);
        o.start(t);
        o.stop(t + dur + 0.05);
    } catch (e) {}
}

/** 白噪声脉冲（模拟撞击、嘶嘶声） */
function _sfxNoise(dur = 0.06, vol = 0.15) {
    try {
        const ctx = _sfxGetCtx();
        const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        src.connect(g);
        g.connect(ctx.destination);
        src.start();
    } catch (e) {}
}

// ==================== 合成音效映射 ====================
// 每个音效类型对应的合成音频序列
const SFX_AUDIO_MAP = {
    // ── 战斗 ──
    'battle_start': () => {
        // 锵锵三声
        _sfxTone({ type: 'square', freq: 260, freqEnd: 180, dur: 0.12, vol: 0.25 });
        _sfxNoise(0.04, 0.2);
        _sfxTone({ type: 'square', freq: 320, freqEnd: 220, dur: 0.12, vol: 0.25, delay: 0.13 });
        _sfxNoise(0.04, 0.2);
        _sfxTone({ type: 'square', freq: 400, freqEnd: 300, dur: 0.15, vol: 0.3, delay: 0.26 });
        _sfxNoise(0.06, 0.25);
    },
    'battle_hit': () => {
        _sfxNoise(0.06, 0.3);
        _sfxTone({ type: 'sawtooth', freq: 300, freqEnd: 100, dur: 0.1, vol: 0.25 });
    },
    'battle_crit': () => {
        _sfxNoise(0.08, 0.4);
        _sfxTone({ type: 'sawtooth', freq: 500, freqEnd: 120, dur: 0.15, vol: 0.35 });
        _sfxSchedule(() => _sfxTone({ type: 'sine', freq: 1200, freqEnd: 400, dur: 0.12, vol: 0.2 }), 50);
    },
    'battle_victory': () => {
        // 胜利号角上行
        [523, 659, 784, 1047, 1318].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.18, vol: 0.25, delay: i * 0.11 });
        });
    },
    'battle_defeat': () => {
        // 低沉下行
        [440, 370, 330, 220].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.22, vol: 0.2, delay: i * 0.13 });
        });
    },

    // ── 战斗动作音效（供battle.js调用）──
    'hit': () => {
        // 普通命中：短促撞击声
        _sfxNoise(0.05, 0.25);
        _sfxTone({ type: 'sawtooth', freq: 250, freqEnd: 150, dur: 0.08, vol: 0.2 });
    },
    'crit': () => {
        // 暴击：更响亮的金属撞击
        _sfxNoise(0.08, 0.4);
        _sfxTone({ type: 'sawtooth', freq: 400, freqEnd: 200, dur: 0.12, vol: 0.35 });
        _sfxSchedule(() => _sfxTone({ type: 'sine', freq: 1000, freqEnd: 600, dur: 0.1, vol: 0.2 }), 40);
    },
    'wind': () => {
        // 闪避/风声：轻柔上扬
        _sfxTone({ type: 'sine', freq: 400, freqEnd: 800, dur: 0.15, vol: 0.12 });
        _sfxNoise(0.06, 0.08);
    },
    'shield': () => {
        // 格挡/护盾：金属共鸣
        _sfxTone({ type: 'sine', freq: 600, dur: 0.2, vol: 0.25 });
        _sfxTone({ type: 'sine', freq: 900, dur: 0.15, vol: 0.2, delay: 0.08 });
        _sfxNoise(0.04, 0.15);
    },
    'heavy': () => {
        // 重击：低沉冲击
        _sfxNoise(0.1, 0.35);
        _sfxTone({ type: 'square', freq: 180, freqEnd: 80, dur: 0.2, vol: 0.3 });
    },
    'ko': () => {
        // 击倒：沉闷撞击
        _sfxNoise(0.15, 0.4);
        _sfxTone({ type: 'sawtooth', freq: 200, freqEnd: 60, dur: 0.3, vol: 0.35 });
    },
    'skill': () => {
        // 技能释放：中频上扬+高频泛音
        _sfxTone({ type: 'sine', freq: 600, freqEnd: 200, dur: 0.18, vol: 0.35 });
        _sfxTone({ type: 'triangle', freq: 900, dur: 0.12, vol: 0.2, delay: 0.06 });
        _sfxNoise(0.04, 0.18);
    },

    // ── 跳舞音效 ──
    // 所有舞步音效都设计为0.6秒一个循环，与动画周期同步
    'dance_disco': () => {
        // 迪斯科：动次打次 - 短促有力的节拍
        const ctx = _sfxGetCtx();
        const t = ctx.currentTime;
        // 低音鼓点 "动"
        _sfxNoise(0.08, 0.25);
        _sfxTone({ type: 'sawtooth', freq: 65, dur: 0.12, vol: 0.22 });
        // 高音镲片 "次" (延迟0.3秒，半拍)
        _sfxSchedule(() => {
            _sfxTone({ type: 'triangle', freq: 1200, dur: 0.04, vol: 0.12 });
            _sfxTone({ type: 'sine', freq: 880, dur: 0.05, vol: 0.08 });
        }, 300);
    },
    'dance_hiphop': () => {
        // 街舞：鼓机风格短促节拍
        const ctx = _sfxGetCtx();
        const t = ctx.currentTime;
        // 重低音鼓
        _sfxNoise(0.06, 0.28);
        _sfxTone({ type: 'square', freq: 80, dur: 0.1, vol: 0.25 });
        // 反拍小鼓 (0.3秒)
        _sfxSchedule(() => {
            _sfxNoise(0.04, 0.18);
            _sfxTone({ type: 'sawtooth', freq: 200, dur: 0.06, vol: 0.15 });
        }, 300);
    },
    'dance_taiji': () => {
        // 太极：一个圆润的长音配合轻柔节拍
        const ctx = _sfxGetCtx();
        const t = ctx.currentTime;
        // 主音：圆润的滑音
        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(392, t);
        o.frequency.linearRampToValueAtTime(523, t + 0.25);
        o.frequency.linearRampToValueAtTime(392, t + 0.5);
        o.connect(g);
        o.start(t);
        o.stop(t + 0.55);
        // 轻柔的节拍点
        _sfxSchedule(() => {
            _sfxTone({ type: 'sine', freq: 659, dur: 0.08, vol: 0.08 });
        }, 300);
    },
    'dance_robot': () => {
        // 机械舞：顿挫的机械音效
        const ctx = _sfxGetCtx();
        const t = ctx.currentTime;
        // 机械启动音
        _sfxTone({ type: 'square', freq: 523, dur: 0.08, vol: 0.18 });
        _sfxSchedule(() => {
            _sfxTone({ type: 'square', freq: 659, dur: 0.06, vol: 0.15 });
        }, 100);
        // 机械关节声 (0.3秒)
        _sfxSchedule(() => {
            _sfxNoise(0.03, 0.12);
            _sfxTone({ type: 'sawtooth', freq: 784, dur: 0.08, vol: 0.14 });
            _sfxSchedule(() => {
                _sfxTone({ type: 'square', freq: 1047, dur: 0.05, vol: 0.12 });
            }, 100);
        }, 300);
    },
    'dance_bounce': () => {
        // 弹跳：跳跃感的短促音效
        const ctx = _sfxGetCtx();
        const t = ctx.currentTime;
        // 起跳音：上扬
        const g = ctx.createGain();
        g.connect(ctx.destination);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(440, t);
        o.frequency.exponentialRampToValueAtTime(880, t + 0.15);
        o.connect(g);
        o.start(t);
        o.stop(t + 0.25);
        // 落地音：下落 (0.3秒)
        _sfxSchedule(() => {
            _sfxNoise(0.05, 0.15);
            const g2 = ctx.createGain();
            g2.connect(ctx.destination);
            g2.gain.setValueAtTime(0.15, ctx.currentTime);
            g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            const o2 = ctx.createOscillator();
            o2.type = 'sine';
            o2.frequency.setValueAtTime(660, ctx.currentTime);
            o2.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.15);
            o2.connect(g2);
            o2.start();
            o2.stop(ctx.currentTime + 0.2);
        }, 300);
    },
    'dance_swing': () => {
        // 摇摆：摇摆爵士的短促节拍
        const ctx = _sfxGetCtx();
        const t = ctx.currentTime;
        // 摇摆第一拍
        _sfxTone({ type: 'triangle', freq: 392, dur: 0.1, vol: 0.16 });
        _sfxSchedule(() => {
            _sfxTone({ type: 'triangle', freq: 523, dur: 0.08, vol: 0.12 });
        }, 150);
        // 摇摆反拍 (0.3秒)
        _sfxSchedule(() => {
            _sfxTone({ type: 'triangle', freq: 659, dur: 0.12, vol: 0.14 });
            _sfxSchedule(() => {
                _sfxTone({ type: 'triangle', freq: 784, dur: 0.08, vol: 0.1 });
            }, 120);
        }, 300);
    },

    // ── 投壶 ──
    'throw': () => {
        // 嗖——风声上扬后下落
        _sfxTone({ type: 'sine', freq: 200, freqEnd: 800, dur: 0.15, vol: 0.15 });
        _sfxNoise(0.1, 0.1);
    },
    'hit_target': () => {
        // 箭入壶口：金属碰撞+清脆铃声
        _sfxNoise(0.04, 0.2);
        _sfxTone({ type: 'sine', freq: 1200, freqEnd: 800, dur: 0.2, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 1600, dur: 0.15, vol: 0.15, delay: 0.05 });
    },
    'perfect_hit': () => {
        // 完美投壶：华丽和弦
        [784, 988, 1175, 1568].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.25, vol: 0.22, delay: i * 0.08 });
        });
        _sfxNoise(0.04, 0.15);
    },

    // ── 五子棋 ──
    'place_stone': () => {
        // 落子：清脆"哒"
        _sfxNoise(0.03, 0.25);
        _sfxTone({ type: 'sine', freq: 800, freqEnd: 400, dur: 0.08, vol: 0.2 });
    },
    'capture': () => {
        // 提子：多声短促
        _sfxNoise(0.04, 0.3);
        _sfxTone({ type: 'square', freq: 500, freqEnd: 200, dur: 0.1, vol: 0.2 });
        _sfxSchedule(() => _sfxNoise(0.03, 0.2), 60);
    },
    'game_over': () => {
        // 对局结束：低沉收尾
        _sfxTone({ type: 'sine', freq: 523, dur: 0.2, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 392, dur: 0.25, vol: 0.18, delay: 0.18 });
        _sfxTone({ type: 'sine', freq: 330, dur: 0.3, vol: 0.15, delay: 0.38 });
    },

    // ── 采集/采药 ──
    'gather_start': () => {
        // 沙沙声
        _sfxNoise(0.15, 0.12);
        _sfxTone({ type: 'sine', freq: 300, dur: 0.1, vol: 0.08 });
    },
    'gather_success': () => {
        // 叮咚上行
        _sfxTone({ type: 'sine', freq: 660, dur: 0.12, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 880, dur: 0.15, vol: 0.22, delay: 0.1 });
    },
    'gather_fail': () => {
        // 短促低沉
        _sfxTone({ type: 'sawtooth', freq: 200, freqEnd: 120, dur: 0.12, vol: 0.15 });
    },

    // ── 炼物阁 ──
    'craft_open': () => {
        // 温暖钟磬声
        _sfxTone({ type: 'sine', freq: 392, dur: 0.25, vol: 0.15 });
        _sfxTone({ type: 'sine', freq: 523, dur: 0.25, vol: 0.15, delay: 0.1 });
        _sfxTone({ type: 'sine', freq: 659, dur: 0.35, vol: 0.18, delay: 0.22 });
    },
    'craft_tab': () => {
        _sfxNoise(0.03, 0.08);
        _sfxTone({ type: 'sine', freq: 660, dur: 0.06, vol: 0.12 });
    },
    'craft_select': () => {
        _sfxTone({ type: 'sine', freq: 440, dur: 0.08, vol: 0.14 });
        _sfxTone({ type: 'sine', freq: 554, dur: 0.08, vol: 0.16, delay: 0.06 });
    },
    'craft_start': () => {
        _sfxNoise(0.08, 0.12);
        _sfxTone({ type: 'sine', freq: 200, freqEnd: 350, dur: 0.3, vol: 0.15 });
        _sfxTone({ type: 'sine', freq: 280, freqEnd: 420, dur: 0.25, vol: 0.12, delay: 0.15 });
    },
    'craft_success': () => {
        // 叮咚上行
        _sfxTone({ type: 'sine', freq: 523, dur: 0.16, vol: 0.22 });
        _sfxTone({ type: 'sine', freq: 659, dur: 0.16, vol: 0.22, delay: 0.12 });
        _sfxTone({ type: 'sine', freq: 784, dur: 0.22, vol: 0.25, delay: 0.26 });
        _sfxNoise(0.04, 0.12);
    },
    'craft_rare': () => {
        [523, 659, 784, 1047].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.2, vol: 0.2, delay: i * 0.09 });
        });
    },
    'craft_epic': () => {
        [523, 659, 784, 1047, 1318, 1568].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.2, vol: 0.2, delay: i * 0.09 });
        });
        _sfxTone({ type: 'sine', freq: 130, freqEnd: 80, dur: 0.5, vol: 0.15 });
    },
    'craft_legendary': () => {
        [392, 523, 659, 784, 1047, 1318, 1568, 2093].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.18, vol: 0.22, delay: i * 0.07 });
        });
        _sfxTone({ type: 'sine', freq: 98, freqEnd: 65, dur: 0.6, vol: 0.18 });
        _sfxNoise(0.1, 0.22);
    },
    'craft_fail': () => {
        _sfxNoise(0.12, 0.3);
        _sfxTone({ type: 'sawtooth', freq: 300, freqEnd: 60, dur: 0.4, vol: 0.3 });
        _sfxTone({ type: 'sine', freq: 200, freqEnd: 80, dur: 0.35, vol: 0.2, delay: 0.1 });
    },
    'craft_no_mat': () => {
        _sfxTone({ type: 'square', freq: 220, freqEnd: 150, dur: 0.15, vol: 0.2 });
        _sfxTone({ type: 'square', freq: 180, freqEnd: 120, dur: 0.12, vol: 0.15, delay: 0.12 });
    },
    'craft_sell': () => {
        _sfxTone({ type: 'sine', freq: 1200, freqEnd: 1600, dur: 0.08, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 1400, freqEnd: 1000, dur: 0.1, vol: 0.18, delay: 0.08 });
        _sfxNoise(0.03, 0.1);
    },
    'craft_use': () => {
        _sfxTone({ type: 'sine', freq: 880, dur: 0.1, vol: 0.18 });
        _sfxTone({ type: 'sine', freq: 1047, dur: 0.12, vol: 0.2, delay: 0.08 });
        _sfxTone({ type: 'sine', freq: 784, dur: 0.14, vol: 0.15, delay: 0.18 });
    },

    // ── 锻造 ──
    'forge_start': () => {
        // 铁锤敲击预备
        _sfxTone({ type: 'square', freq: 120, dur: 0.3, vol: 0.2 });
        _sfxNoise(0.08, 0.15);
    },
    'forge_hit': () => {
        // 普通敲击
        _sfxNoise(0.04, 0.3);
        _sfxTone({ type: 'square', freq: 220, freqEnd: 100, dur: 0.12, vol: 0.25 });
    },
    'forge_perfect': () => {
        // 完美敲击：清脆金属声
        _sfxNoise(0.03, 0.35);
        _sfxTone({ type: 'sine', freq: 880, dur: 0.15, vol: 0.3 });
        _sfxTone({ type: 'sine', freq: 1320, dur: 0.2, vol: 0.25, delay: 0.08 });
    },
    'forge_complete': () => {
        // 神兵出世
        [523, 659, 784, 1047, 1318].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.2, vol: 0.22, delay: i * 0.1 });
        });
        _sfxNoise(0.06, 0.2);
        _sfxTone({ type: 'sine', freq: 2000, dur: 0.3, vol: 0.15, delay: 0.4 });
    },

    // ── 通用 ──
    'click': () => {
        _sfxNoise(0.02, 0.1);
        _sfxTone({ type: 'sine', freq: 600, dur: 0.04, vol: 0.1 });
    },
    'success': () => {
        _sfxTone({ type: 'sine', freq: 660, dur: 0.12, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 880, dur: 0.15, vol: 0.22, delay: 0.1 });
    },
    'fail': () => {
        _sfxTone({ type: 'sawtooth', freq: 250, freqEnd: 100, dur: 0.2, vol: 0.2 });
        _sfxNoise(0.06, 0.15);
    },
    'level_up': () => {
        [523, 784, 1047, 1047, 784, 1047, 1318].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.15, vol: 0.25, delay: i * 0.09 });
        });
    },

    // ── 钓鱼 ──
    'fish_cast': () => {
        // 抛竿：嗖——水花
        _sfxTone({ type: 'sine', freq: 200, freqEnd: 600, dur: 0.2, vol: 0.15 });
        _sfxNoise(0.08, 0.15);
    },
    'fish_bite': () => {
        // 咬钩：浮漂快速下沉的"嘟嘟"声
        _sfxTone({ type: 'square', freq: 800, dur: 0.06, vol: 0.2 });
        _sfxTone({ type: 'square', freq: 1000, dur: 0.06, vol: 0.25, delay: 0.08 });
        _sfxTone({ type: 'square', freq: 1200, dur: 0.08, vol: 0.3, delay: 0.16 });
    },
    'fish_reel': () => {
        // 收杆：中频上扬
        _sfxTone({ type: 'sawtooth', freq: 150, freqEnd: 400, dur: 0.25, vol: 0.2 });
        _sfxNoise(0.06, 0.12);
    },
    'fish_catch': () => {
        // 钓到：水花+清脆铃声
        _sfxNoise(0.1, 0.2);
        _sfxTone({ type: 'sine', freq: 880, dur: 0.15, vol: 0.22 });
        _sfxTone({ type: 'sine', freq: 1100, dur: 0.2, vol: 0.2, delay: 0.1 });
        _sfxTone({ type: 'sine', freq: 1320, dur: 0.25, vol: 0.18, delay: 0.22 });
    },
    'fish_rare': () => {
        // 稀有鱼：华丽上行琶音
        [660, 784, 880, 1047, 1318, 1568].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.2, vol: 0.22, delay: i * 0.08 });
        });
        _sfxNoise(0.08, 0.2);
    },
    'fish_miss': () => {
        // 跑鱼：低沉下行
        _sfxTone({ type: 'sawtooth', freq: 300, freqEnd: 80, dur: 0.3, vol: 0.2 });
        _sfxNoise(0.08, 0.15);
    },
    'fish_idle': () => {
        // 水面涟漪：极轻柔
        _sfxNoise(0.05, 0.05);
    },

    // ── 赌坊 ──
    'dice_roll': () => {
        // 摇骰子：连续短促敲击
        for (let i = 0; i < 6; i++) {
            _sfxNoise(0.03, 0.15 + Math.random() * 0.1);
            _sfxTone({ type: 'square', freq: 200 + Math.random() * 100, dur: 0.04, vol: 0.15, delay: i * 0.08 });
        }
    },
    'dice_land': () => {
        // 骰子落地
        _sfxNoise(0.05, 0.25);
        _sfxTone({ type: 'square', freq: 180, freqEnd: 100, dur: 0.1, vol: 0.2 });
    },
    'dice_win': () => {
        // 赢了：金币叮当
        _sfxTone({ type: 'sine', freq: 1200, dur: 0.08, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 1500, dur: 0.08, vol: 0.2, delay: 0.08 });
        _sfxTone({ type: 'sine', freq: 1800, dur: 0.12, vol: 0.22, delay: 0.16 });
        _sfxNoise(0.04, 0.15);
    },
    'dice_lose': () => {
        // 输了：沉闷
        _sfxTone({ type: 'sawtooth', freq: 200, freqEnd: 80, dur: 0.2, vol: 0.2 });
    },
    'dice_big': () => {
        // 豹子：震撼
        _sfxNoise(0.1, 0.35);
        [523, 659, 784, 1047, 1318, 1568].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.18, vol: 0.25, delay: i * 0.07 });
        });
    },
    'dice_bet': () => {
        // 下注：筹码声
        _sfxNoise(0.04, 0.12);
        _sfxTone({ type: 'sine', freq: 600, freqEnd: 400, dur: 0.06, vol: 0.12 });
    },

    // ── 护镖 ──
    'escort_start': () => {
        // 出发号角
        _sfxTone({ type: 'sine', freq: 330, dur: 0.25, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 440, dur: 0.2, vol: 0.22, delay: 0.2 });
        _sfxTone({ type: 'sine', freq: 523, dur: 0.3, vol: 0.25, delay: 0.35 });
    },
    'escort_ambush': () => {
        // 遭遇埋伏：急促
        _sfxTone({ type: 'square', freq: 200, freqEnd: 400, dur: 0.1, vol: 0.25 });
        _sfxNoise(0.08, 0.25);
        _sfxTone({ type: 'square', freq: 300, freqEnd: 150, dur: 0.15, vol: 0.2, delay: 0.12 });
    },
    'escort_fight': () => {
        // 战斗中：兵器交击
        _sfxNoise(0.05, 0.3);
        _sfxTone({ type: 'sawtooth', freq: 350, freqEnd: 120, dur: 0.12, vol: 0.25 });
    },
    'escort_win': () => {
        // 护镖成功
        [523, 659, 784, 1047].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.2, vol: 0.22, delay: i * 0.12 });
        });
    },
    'escort_fail': () => {
        // 护镖失败
        _sfxNoise(0.15, 0.3);
        _sfxTone({ type: 'sawtooth', freq: 250, freqEnd: 50, dur: 0.5, vol: 0.3 });
    },
    'escort_arrive': () => {
        // 到达目的地
        _sfxTone({ type: 'sine', freq: 660, dur: 0.15, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 880, dur: 0.2, vol: 0.22, delay: 0.12 });
        _sfxTone({ type: 'sine', freq: 1047, dur: 0.25, vol: 0.2, delay: 0.28 });
    },

    // ── 鉴定装备 ── 神秘揭示感
    'identify': () => {
        _sfxNoise(0.04, 0.15);
        _sfxTone({ type: 'triangle', freq: 660, dur: 0.08, vol: 0.18 });
        _sfxTone({ type: 'sine', freq: 880, dur: 0.1, vol: 0.2, delay: 0.06 });
        _sfxTone({ type: 'sine', freq: 1100, dur: 0.12, vol: 0.22, delay: 0.14 });
        _sfxTone({ type: 'sine', freq: 1320, dur: 0.18, vol: 0.18, delay: 0.22 });
        _sfxNoise(0.03, 0.1);
    },

    // ── 任务系统 ──
    'quest_accept': () => {
        // 接取任务：纸卷展开
        _sfxNoise(0.03, 0.1);
        _sfxTone({ type: 'sine', freq: 440, dur: 0.08, vol: 0.16 });
        _sfxTone({ type: 'sine', freq: 554, dur: 0.1, vol: 0.18, delay: 0.06 });
    },
    'quest_complete': () => {
        //完成任务：两声成功
        _sfxTone({ type: 'sine', freq: 523, dur: 0.15, vol: 0.22 });
        _sfxTone({ type: 'sine', freq: 659, dur: 0.18, vol: 0.24, delay: 0.14 });
        _sfxNoise(0.04, 0.15);
    },
    'quest_fail': () => {
        // 任务失败
        _sfxTone({ type: 'sawtooth', freq: 300, freqEnd: 150, dur: 0.2, vol: 0.18 });
    },

    // ── 商店购买 ── 金币交易
    'shop_buy': () => {
        _sfxNoise(0.03, 0.12);
        _sfxTone({ type: 'sine', freq: 1200, freqEnd: 800, dur: 0.08, vol: 0.18 });
        _sfxTone({ type: 'sine', freq: 1000, dur: 0.1, vol: 0.15, delay: 0.08 });
        _sfxTone({ type: 'sine', freq: 1400, dur: 0.12, vol: 0.18, delay: 0.16 });
    },

    // ── 背包操作 ──
    'bag_open': () => {
        // 打开背包：轻柔展开
        _sfxNoise(0.02, 0.06);
        _sfxTone({ type: 'sine', freq: 520, dur: 0.08, vol: 0.12 });
        _sfxTone({ type: 'sine', freq: 680, dur: 0.1, vol: 0.14, delay: 0.06 });
    },
    'bag_equip': () => {
        // 装备武器/防具：金属卡扣
        _sfxNoise(0.03, 0.2);
        _sfxTone({ type: 'square', freq: 280, dur: 0.08, vol: 0.22 });
        _sfxTone({ type: 'sine', freq: 880, dur: 0.1, vol: 0.18, delay: 0.05 });
    },
    'bag_unequip': () => {
        // 卸下装备：松开
        _sfxTone({ type: 'sine', freq: 880, freqEnd: 600, dur: 0.1, vol: 0.15 });
        _sfxNoise(0.02, 0.1);
    },
    'bag_drop': () => {
        // 丢弃物品：下沉消失
        _sfxTone({ type: 'sawtooth', freq: 400, freqEnd: 100, dur: 0.25, vol: 0.2 });
        _sfxNoise(0.05, 0.15);
    },

    // ── 成就解锁 ── 华丽号角
    'achievement': () => {
        [523, 659, 784, 1047, 1318, 1568].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.18, vol: 0.22, delay: i * 0.07 });
        });
        _sfxNoise(0.08, 0.2);
        _sfxTone({ type: 'sine', freq: 2093, dur: 0.3, vol: 0.15, delay: 0.45 });
    },

    // ── 地下城 ──
    'dungeon_enter': () => {
        // 进入地下城：厚重石门
        _sfxNoise(0.08, 0.25);
        _sfxTone({ type: 'square', freq: 120, dur: 0.2, vol: 0.28 });
        _sfxTone({ type: 'square', freq: 90, dur: 0.25, vol: 0.25, delay: 0.2 });
    },
    'chest_open': () => {
        // 宝箱开启：清脆+回荡
        _sfxNoise(0.04, 0.25);
        _sfxTone({ type: 'sine', freq: 1400, dur: 0.08, vol: 0.25 });
        _sfxTone({ type: 'sine', freq: 1800, dur: 0.12, vol: 0.22, delay: 0.06 });
        _sfxTone({ type: 'sine', freq: 2200, freqEnd: 1600, dur: 0.2, vol: 0.18, delay: 0.14 });
    },

    // ── 蛐蛐操作 ──
    'cricket_squad': () => {
        // 出战/撤下：轻快切换
        _sfxTone({ type: 'sine', freq: 880, dur: 0.06, vol: 0.15 });
        _sfxNoise(0.02, 0.1);
    },
    'cricket_release': () => {
        // 放生：柔和飞走
        _sfxTone({ type: 'sine', freq: 880, freqEnd: 500, dur: 0.3, vol: 0.18 });
        _sfxSchedule(() => {
            _sfxTone({ type: 'sine', freq: 1100, freqEnd: 700, dur: 0.25, vol: 0.12 });
        }, 200);
    },

    // ── 治疗（通用）── 温暖上行
    'heal': () => {
        _sfxTone({ type: 'sine', freq: 523, dur: 0.15, vol: 0.2 });
        _sfxTone({ type: 'sine', freq: 659, dur: 0.18, vol: 0.22, delay: 0.12 });
        _sfxTone({ type: 'sine', freq: 784, dur: 0.2, vol: 0.18, delay: 0.26 });
    },

    // ── 死亡（通用）── 低沉下行
    'death': () => {
        _sfxNoise(0.15, 0.35);
        _sfxTone({ type: 'sawtooth', freq: 250, freqEnd: 40, dur: 0.5, vol: 0.35 });
        _sfxTone({ type: 'sine', freq: 150, dur: 0.4, vol: 0.2, delay: 0.3 });
    },

    // ── NPC对话 ── 轻柔气泡
    'npc_talk': () => {
        _sfxTone({ type: 'sine', freq: 520, dur: 0.05, vol: 0.1 });
        _sfxTone({ type: 'sine', freq: 620, dur: 0.06, vol: 0.12, delay: 0.04 });
    },

    // ── 旅行/移动 ── 脚步声
    'travel_step': () => {
        _sfxNoise(0.02, 0.06);
        _sfxTone({ type: 'sine', freq: 300, dur: 0.04, vol: 0.08 });
    },

    // ── 城市切换 ── 场景过渡
    'city_change': () => {
        _sfxTone({ type: 'sine', freq: 392, dur: 0.15, vol: 0.15 });
        _sfxTone({ type: 'sine', freq: 523, dur: 0.18, vol: 0.18, delay: 0.12 });
        _sfxTone({ type: 'sine', freq: 659, dur: 0.22, vol: 0.15, delay: 0.26 });
    },

    // ── 功能解锁 ── 神秘揭示
    'unlock': () => {
        _sfxNoise(0.03, 0.12);
        _sfxTone({ type: 'triangle', freq: 520, dur: 0.08, vol: 0.18 });
        _sfxTone({ type: 'sine', freq: 660, dur: 0.1, vol: 0.2, delay: 0.06 });
        _sfxTone({ type: 'sine', freq: 880, dur: 0.12, vol: 0.22, delay: 0.12 });
        _sfxTone({ type: 'sine', freq: 1100, dur: 0.15, vol: 0.18, delay: 0.2 });
    },

    // ── 境界突破 ── 华丽上行+回响
    'realm_breakthrough': () => {
        [392, 523, 659, 784, 880, 1047, 1318, 1568].forEach((f, i) => {
            _sfxTone({ type: 'sine', freq: f, dur: 0.22, vol: 0.2, delay: i * 0.08 });
        });
        _sfxNoise(0.12, 0.3);
        _sfxSchedule(() => {
            _sfxTone({ type: 'sine', freq: 1568, dur: 0.6, vol: 0.18 });
            _sfxTone({ type: 'triangle', freq: 1047, dur: 0.5, vol: 0.12, delay: 0.1 });
        }, 650);
    },

    // ── BOSS登场 ── 低沉轰鸣+高音点缀（压迫感）
    'boss_intro': () => {
        _sfxTone({ type: 'sawtooth', freq: 55, endFreq: 30, dur: 2.5, vol: 0.4 });
        _sfxTone({ type: 'square', freq: 880, endFreq: 220, dur: 1.5, vol: 0.15, delay: 0.5 });
        _sfxNoise(0.3, 0.12, 0.3);
    },

    // ── 别名映射（兼容不同模块的命名习惯）──
    'levelup': () => SFX_AUDIO_MAP['level_up'](),
};

// ==================== 音效管理器 ====================
const SoundFX = {
    _muted: false,

    // 切换静音
    toggleMute: function() {
        this._muted = !this._muted;
        document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
            btn.textContent = this._muted ? '🔇' : '🔊';
            btn.title = this._muted ? '点击开启声音' : '点击静音';
        });
        return this._muted;
    },

    // 设置静音状态（从外部同步，如主菜单）
    setMuted: function(v) {
        this._muted = !!v;
        document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
            btn.textContent = this._muted ? '🔇' : '🔊';
            btn.title = this._muted ? '点击开启声音' : '点击静音';
        });
    },

    // 仅播放合成音频（无视觉特效）
    playAudio: function(type) {
        if (this._muted) return;
        const fn = SFX_AUDIO_MAP[type];
        if (fn) {
            try { fn(); } catch (e) {}
        }
    },

    // 播放音效（合成音频 + 视觉特效）
    play: function(type, options = {}) {
        if (this._muted) return;

        // 1. 播放合成音频
        this.playAudio(type);

        // 2. 播放视觉特效（保留原有的banner/震动/粒子）
        switch(type) {
            // 战斗音效
            case 'battle_start':
                this.showEffect('⚔️', '战斗开始！', '锵！锵！锵！', 'battle');
                break;
            case 'battle_hit':
                this.showEffect('💥', '命中！', '砰！', 'hit');
                break;
            case 'battle_crit':
                this.showEffect('⚡', '暴击！', '轰！', 'crit');
                break;
            case 'battle_victory':
                this.showEffect('🏆', '胜利！', '胜利的号角响起！', 'victory');
                break;
            case 'battle_defeat':
                this.showEffect('💀', '失败', '咚...', 'defeat');
                break;

            // 投掷音效
            case 'throw':
                this.showEffect('🎯', '投掷！', '嗖——', 'throw');
                break;
            case 'hit_target':
                this.showEffect('💥', '命中！', '啪！', 'hit');
                break;
            case 'perfect_hit':
                this.showEffect('✨', '完美！', '叮！', 'perfect');
                break;

            // 棋类音效
            case 'place_stone':
                this.showEffect('⚫', '落子！', '哒！', 'stone');
                break;
            case 'capture':
                this.showEffect('💥', '提子！', '啪！', 'capture');
                break;
            case 'game_over':
                this.showEffect('🏁', '对局结束！', '咚！', 'gameover');
                break;

            // 采集音效
            case 'gather_start':
                this.showEffect('🌿', '采集开始！', '沙沙...', 'gather');
                break;
            case 'gather_success':
                this.showEffect('✅', '采集成功！', '叮！', 'success');
                break;
            case 'gather_fail':
                this.showEffect('❌', '采集失败', '唉...', 'fail');
                break;
            case 'craft_start':
                this.showEffect('🔥', '炼制开始！', '咕噜咕噜...', 'craft');
                break;
            case 'craft_success':
                this.showEffect('💊', '炼制成功！', '叮叮叮！', 'craft_success');
                break;
            case 'craft_rare':
                this.showEffect('🌟', '精炼成功！', '嗡——！', 'craft_rare');
                break;
            case 'craft_epic':
                this.showEffect('💫', '极品出炉！', '轰隆隆——！', 'craft_epic');
                break;
            case 'craft_legendary':
                this.showEffect('⭐', '传说之物！', '九天雷鸣——！', 'craft_legendary');
                break;
            case 'craft_fail':
                this.showEffect('💥', '炼制失败', '噗...', 'craft_fail');
                break;
            case 'craft_no_mat':
                this.showEffect('⚠️', '材料不足', '翻找半天...', 'craft_no_mat');
                break;
            case 'craft_sell':
                this.showEffect('💰', '售出成功', '叮当～', 'craft_sell');
                break;
            case 'craft_use':
                this.showEffect('✨', '使用道具', '咕嘟～', 'craft_use');
                break;
            case 'craft_open':
                this.showEffect('⚗️', '炼物阁', '欢迎光临～', 'craft_open');
                break;
            case 'craft_tab':
                this.screenShake(0.5);
                break;
            case 'craft_select':
                this.screenShake(0.5);
                break;

            // 锻造音效
            case 'forge_start':
                this.showEffect('🔨', '锻造开始！', '叮叮叮！', 'forge');
                break;
            case 'forge_hit':
                this.showEffect('🔨', '敲击！', '当！', 'hit');
                break;
            case 'forge_perfect':
                this.showEffect('⚡', '完美敲击！', '锵！', 'perfect');
                break;
            case 'forge_complete':
                this.showEffect('🎉', '锻造完成！', '叮——！', 'complete');
                break;

            // 通用音效
            case 'click':
                this.screenShake(1);
                break;
            case 'success':
                this.showEffect('✨', '成功！', '叮！', 'success');
                break;
            case 'fail':
                this.showEffect('💔', '失败', '咚...', 'fail');
                break;
            case 'level_up':
                this.showEffect('🆙', '升级！', '铛铛铛！', 'levelup');
                break;

            // 钓鱼音效（仅音频，视觉可选）
            case 'fish_cast':
                this.screenShake(0.5);
                break;
            case 'fish_bite':
                this.screenShake(2);
                break;
            case 'fish_catch':
                this.showEffect('🐟', '钓到了！', '哗啦——！', 'success');
                break;
            case 'fish_rare':
                this.showEffect('🌟', '稀有鱼！', '闪闪发光！', 'perfect');
                this.createParticles('gold');
                break;
            case 'fish_miss':
                this.screenShake(1);
                break;
            case 'fish_idle':
                // 极轻微，不弹特效
                break;

            // 赌坊音效
            case 'dice_roll':
                this.screenShake(0.8);
                break;
            case 'dice_land':
                this.screenShake(1.2);
                break;
            case 'dice_win':
                this.showEffect('💰', '赢了！', '叮当！', 'success');
                this.createParticles('gold');
                break;
            case 'dice_lose':
                this.showEffect('💔', '输了...', '唉...', 'fail');
                break;
            case 'dice_big':
                this.showEffect('🎰', '豹子！', '天选之人！', 'perfect');
                this.createParticles('gold');
                this.createParticles('rainbow');
                break;
            case 'dice_bet':
                this.screenShake(0.5);
                break;

            // 护镖音效
            case 'escort_start':
                this.showEffect('🚚', '出发！', '镖车启程！', 'success');
                break;
            case 'escort_ambush':
                this.showEffect('⚠️', '埋伏！', '杀气！', 'battle');
                break;
            case 'escort_fight':
                this.showEffect('⚔️', '交锋！', '兵器相交！', 'hit');
                break;
            case 'escort_win':
                this.showEffect('🏆', '镖送到！', '任务完成！', 'victory');
                this.createParticles('gold');
                break;
            case 'escort_fail':
                this.showEffect('💀', '镖丢了...', '任务失败...', 'defeat');
                break;
            case 'escort_arrive':
                this.showEffect('🏘️', '到达！', '目的地到了！', 'success');
                break;

            // 鉴定音效
            case 'identify':
                this.showEffect('✦', '鉴定完成！', '光芒显现……', 'craft_rare');
                break;

            // 任务音效
            case 'quest_accept':
                this.screenShake(0.5);
                break;
            case 'quest_complete':
                this.showEffect('📜', '任务完成！', '叮！', 'success');
                this.createParticles('craft_green');
                break;
            case 'quest_fail':
                this.showEffect('❌', '任务失败', '唉...', 'fail');
                break;

            // 商店购买
            case 'shop_buy':
                this.showEffect('💰', '购买成功', '交易达成', 'success');
                break;

            // 背包操作
            case 'bag_open':
                this.screenShake(0.5);
                break;
            case 'bag_equip':
                this.showEffect('⚔', '装备！', '咔嚓！', 'equip');
                break;
            case 'bag_unequip':
                this.screenShake(0.5);
                break;
            case 'bag_drop':
                this.showEffect('💨', '已丢弃', '……', 'fail');
                break;

            // 成就解锁
            case 'achievement':
                this.showEffect('🏆', '成就解锁！', '号角响起！', 'legendary');
                this.createParticles('gold');
                this.createParticles('rainbow');
                break;

            // 地下城
            case 'dungeon_enter':
                this.showEffect('🏰', '进入地下城', '石门轰鸣……', 'battle');
                this.screenShake(2);
                break;
            case 'chest_open':
                this.showEffect('🎁', '获得宝物！', '叮——！', 'craft_legendary');
                this.createParticles('gold');
                break;

            // 蛐蛐操作
            case 'cricket_squad':
                this.screenShake(0.5);
                break;
            case 'cricket_release':
                this.showEffect('🌿', '放生成功', '回归自然……', 'success');
                break;

            // 治疗/死亡
            case 'heal':
                this.showEffect('💚', '恢复！', '暖流涌动……', 'heal');
                break;
            case 'death':
                this.showEffect('💀', '倒下了……', '视线模糊...', 'defeat');
                this.screenShake(3);
                break;

            // NPC对话
            case 'npc_talk':
                this.screenShake(0.3);
                break;

            // 旅行
            case 'travel_step':
                break;
            case 'city_change':
                this.showEffect('🏘️', '抵达城镇', '风尘仆仆', 'success');
                break;

            default:
                // 未知类型只播放音频，不弹视觉
                break;
        }
    },

    // 显示音效效果
    showEffect: function(icon, title, sound, type) {
        if (typeof showGameBanner === 'function') {
            showGameBanner(title, sound, type);
        }

        let shakeIntensity = 1;
        if (type === 'perfect' || type === 'crit' || type === 'craft_epic' || type === 'craft_legendary') {
            shakeIntensity = 4;
        } else if (type === 'craft_rare' || type === 'craft_fail') {
            shakeIntensity = 2;
        } else if (type === 'craft_no_mat') {
            shakeIntensity = 0.5;
        }
        this.screenShake(shakeIntensity);

        if (type === 'victory' || type === 'complete' || type === 'perfect') {
            this.createParticles(type === 'victory' ? 'gold' : 'rainbow');
        } else if (type === 'craft_success') {
            this.createParticles('craft_green');
        } else if (type === 'craft_rare') {
            this.createParticles('craft_blue');
        } else if (type === 'craft_epic') {
            this.createParticles('craft_purple');
        } else if (type === 'craft_legendary') {
            this.createParticles('craft_gold');
        }
    },

    // 屏幕震动效果
    screenShake: function(intensity = 1) {
        const elements = document.querySelectorAll('.dialog-content, .game-container');
        elements.forEach(el => {
            if (!el) return;

            let shakeCount = 0;
            const maxShakes = intensity * 3;

            const shake = () => {
                const offsetX = (Math.random() - 0.5) * 2 * intensity;
                const offsetY = (Math.random() - 0.5) * 2 * intensity;

                el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

                shakeCount++;
                if (shakeCount < maxShakes) {
                    setTimeout(() => shake(), 50);
                } else {
                    el.style.transform = '';
                }
            };

            shake();
        });
    },

    // 创建粒子效果
    createParticles: function(color = 'gold') {
        const container = document.querySelector('.dialog-content') || document.body;
        if (!container) return;

        const PARTICLE_CFG = {
            'gold':         { symbols:['✨','🌟','⭐'], colors:['#ffd700','#ffaa00','#fff4c0'], count:20 },
            'rainbow':      { symbols:['🌈','✨','💫'], colors:['#ff6060','#60ff60','#6060ff','#ffff60','#ff60ff'], count:20 },
            'craft_green':  { symbols:['✦','◆','★'],   colors:['#80ffcc','#40e8ff','#ffffa0'], count:10 },
            'craft_blue':   { symbols:['✦','◆','❋'],   colors:['#60c0ff','#a080ff','#ffffa0','#ff80ff'], count:14 },
            'craft_purple': { symbols:['✦','⬡','✸'],   colors:['#a060ff','#ff4080','#40e8ff','#ffd700'], count:18 },
            'craft_gold':   { symbols:['★','✦','⬟'],   colors:['#ffd700','#ff8c00','#ff4080','#a060ff','#40e8ff'], count:24 },
        };
        const cfg = PARTICLE_CFG[color] || PARTICLE_CFG['gold'];

        for (let i = 0; i < cfg.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'sound-particle';
            particle.innerHTML = cfg.symbols[i % cfg.symbols.length];

            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.color = cfg.colors[i % cfg.colors.length];
            particle.style.textShadow = `0 0 6px ${cfg.colors[i % cfg.colors.length]}`;
            particle.style.animationDelay = Math.random() * 1 + 's';
            particle.style.animationDuration = (1 + Math.random()) + 's';

            container.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    },

    // 播放音效序列
    playSequence: function(sounds, delay = 300) {
        sounds.forEach((sound, index) => {
            _sfxSchedule(() => {
                this.play(sound);
            }, index * delay);
        });
    },

    // 彻底停止当前页面音效，并清理残留视觉效果
    stopAll: function() {
        _resetSoundVisuals();
        _sfxDestroyCtx();
    }
};

window.clearGameAudio = function() {
    try {
        if (typeof BgmManager !== 'undefined' && BgmManager.destroy) BgmManager.destroy();
        if (typeof SoundFX !== 'undefined' && SoundFX.stopAll) SoundFX.stopAll();
        if (typeof cleanupCraftAudio === 'function') cleanupCraftAudio();
        if (typeof cleanupCricketAudio === 'function') cleanupCricketAudio();
        if (typeof cleanupBattleAudio === 'function') cleanupBattleAudio();
        if (typeof cleanupOriginAudio === 'function') cleanupOriginAudio();
        if (window._menuSFX && window._menuSFX.destroy) window._menuSFX.destroy();
        if (window._menuBgmStop) window._menuBgmStop(false);
    } catch (e) {}
};

window.addEventListener('pagehide', () => {
    if (typeof window.clearGameAudio === 'function') window.clearGameAudio();
});
window.addEventListener('beforeunload', () => {
    if (typeof window.clearGameAudio === 'function') window.clearGameAudio();
});

// ==================== 音效样式 ====================

const soundStyles = `
    <style>
        .sound-particle {
            position: absolute;
            font-size: 16px;
            pointer-events: none;
            animation: particleFloat 1s ease-out forwards;
            z-index: 1000;
        }

        @keyframes particleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(1.5);
            }
        }

        .screen-shake {
            animation: shake 0.3s;
        }

        @keyframes shake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-2px, 0); }
            75% { transform: translate(2px, 0); }
        }
    </style>
`;

// 注入样式
if (!document.getElementById('sound-fx-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'sound-fx-styles';
    styleElement.innerHTML = soundStyles;
    document.head.appendChild(styleElement);
}

// ==================== 全局快捷函数 ====================
function playSound(type, options) {
    return SoundFX.play(type, options);
}

function playAudio(type) {
    return SoundFX.playAudio(type);
}

// ==================== 自动播放策略处理 ====================
// 浏览器要求 AudioContext 必须在用户手势后创建/恢复
let _audioContextUnlocked = false;

function _unlockAudioContext() {
    if (_audioContextUnlocked) return;
    _audioContextUnlocked = true;
    
    if (_sfxActx && _sfxActx.state === 'suspended') {
        _sfxActx.resume().then(() => {
            console.log('[Audio] AudioContext 已激活 ✓');
        }).catch(e => {
            console.log('[Audio] AudioContext 激活失败:', e);
        });
    }
    
    // 只需要一次交互，移除监听器
    document.removeEventListener('click', _unlockAudioContext);
    document.removeEventListener('keydown', _unlockAudioContext);
    document.removeEventListener('touchstart', _unlockAudioContext);
}

// 监听用户首次交互
document.addEventListener('click', _unlockAudioContext, { once: true });
document.addEventListener('keydown', _unlockAudioContext, { once: true });
document.addEventListener('touchstart', _unlockAudioContext, { once: true });

// 音效系统已加载

// ==================== BGM 管理器 ====================
// 轻量级全局 BGM 管理：初始化 ChiptuneBgmPlayer 并跨页面切换曲目
// 使用 sessionStorage 传递 BGM 状态，避免多 AudioContext 冲突

const BgmManager = {
    _player: null,
    _currentSong: null,   // 'town' | 'battle' | 'dungeon' | 'casino'
    _muted: false,

    /** 获取或创建 ChiptuneBgmPlayer 单例 */
    _getPlayer() {
        if (!this._player) {
            try {
                if (typeof ChiptuneBgmPlayer !== 'undefined') {
                    this._player = new ChiptuneBgmPlayer();
                }
            } catch(e) {
                console.warn('[BgmManager] ChiptuneBgmPlayer 不可用:', e);
            }
        }
        return this._player;
    },

    /** 播放指定 BGM（自动切换/淡入淡出） */
    play(songName) {
        if (this._muted) return;
        if (typeof CHIP_SONGS === 'undefined') return;

        const song = CHIP_SONGS[songName];
        if (!song) return;

        // 同一首歌不重复启动
        if (this._currentSong === songName && this._player && this._player.playing) return;

        // 停止当前 BGM
        this.stop();

        const player = this._getPlayer();
        if (!player) return;

        player.loadSong(song);
        player.setVolume(0.18);
        player.play();
        this._currentSong = songName;

        console.log(`[BgmManager] 播放 BGM: ${song.name || songName}`);
    },

    /** 停止当前 BGM（淡出） */
    stop() {
        if (this._player && this._player.playing) {
            this._player.stop();
        }
        this._currentSong = null;
    },

    /** 立即停止（无淡出） */
    stopImmediate() {
        if (this._player) {
            this._player.stopImmediate();
        }
        this._currentSong = null;
    },

    /** 切换静音 */
    toggleMute() {
        this._muted = !this._muted;
        if (this._muted) {
            this.stop();
        }
        return this._muted;
    },

    /** 设置静音 */
    setMuted(v) {
        this._muted = !!v;
        if (this._muted) {
            this.stop();
        }
    },

    /** 获取当前曲目名 */
    currentSong() {
        return this._currentSong;
    },

    /** 销毁 */
    destroy() {
        this.stopImmediate();
        this._player = null;
    }
};

window.BgmManager = BgmManager;
