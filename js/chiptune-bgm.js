/**
 * ChiptuneBgmPlayer — 8-bit / FC 风格 BGM 引擎
 * chiptune-bgm.js
 *
 * 基于 Web Audio API 的纯合成芯片音乐引擎
 * 风格对标：马里奥/塞尔达/洛克人 等 FC 经典 BGM
 *
 * 特性：
 *   - 方波主旋律 (square wave) + 三角波低音 (triangle)
 *   - 噪声通道模拟打击乐 (noise drum/percussion)
 *   - 硬 ADSR 包络（极短 attack，8bit 标志性"咔"感）
 *   - 支持 duty cycle 变化（方波占空比）
 *   - 精确的节拍调度，支持 BPM 和拍号
 *   - 多轨独立：旋律 / 低音 / 打击乐 / 和弦
 *   - 🎮 "蹦跳式低音"模式：根-五-根-八交替，每拍一个短音符
 *   - 🎮 "持续音垫底"模式：和弦长音铺底，不抢旋律
 *
 * 用法：
 *   const player = new ChiptuneBgmPlayer();
 *   player.loadSong(CHIP_SONGS.town);
 *   player.play();
 *   player.stop();
 */

// ═══════════════════════════════════════
//  音符频率表（等律十二平均音阶）
//  索引 0 = C2 (65.41Hz), 12 = C3, 24 = C4 ...
// ═══════════════════════════════════════
const CHIP_FREQ = (() => {
    const table = [];
    const base = 65.406; // C2
    for (let i = 0; i < 48; i++) {
        table.push(base * Math.pow(2, i / 12));
    }
    // 添加休止符标记
    table[-1] = 0; // REST
    return table;
})();

// 音符名 → 索引快捷映射（可选用于作曲）
const CHIP_NOTE_MAP = {
    'C2':0,'C#2':1,'D2':2,'D#2':3,'E2':4,'F2':5,'F#2':6,'G2':7,'G#2':8,'A2':9,'A#2':10,'B2':11,
    'C3':12,'C#3':13,'D3':14,'D#3':15,'E3':16,'F3':17,'F#3':18,'G3':19,'G#3':20,'A3':21,'A#3':22,'B3':23,
    'C4':24,'C#4':25,'D4':26,'D#4':27,'E4':28,'F4':29,'F#4':30,'G4':31,'G#4':32,'A4':33,'A#4':34,'B4':35,
    'C5':36,'C#5':37,'D5':38,'D#5':39,'E5':40,'F5':41,'F#5':42,'G5':43,'G#5':44,'A5':45,'A#5':46,'B5':47,
    'R':-1,  // 休止符
};

class ChiptuneBgmPlayer {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.playing = false;
        this.song = null;

        // 调度系统
        this._nextNoteTime = 0;
        this._scheduleAheadTime = 0.15; // 提前调度 150ms
        this._timerID = null;

        // 曲目指针（每轨独立）
        this._trackPos = {};  // trackName -> noteIndex

        // 默认参数
        this.volume = 0.18;       // 主音量 0-1
        this.bpm = 120;           // 每分钟节拍数

        // 可视化
        this.analyser = null;
    }

    // ── 初始化 AudioContext ──
    _ensureCtx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        // 预生成 duty cycle 波形表
        if (!this._waveforms) {
            this._waveforms = {
                d12: this._createDutyWave(0.125),
                d25: this._createDutyWave(0.25),
                d50: 'square',  // 原生方波
            };
        }
        return this.ctx;
    }

    // ── 创建自定义占空比方波周期波形 ──
    _createDutyWave(dutyCycle) {
        const len = 2048;  // 必须是 2 的幂
        const real = new Float32Array(len);
        const imag = new Float32Array(len);
        // 方波的傅里叶级数：只有奇次谐波，幅度 = 4/(n*π) * sin(n*π*duty)
        for (let n = 1; n <= len / 2; n += 2) {
            const amp = (4 / (Math.PI * n)) * Math.sin(n * Math.PI * dutyCycle);
            real[n] = amp;
            imag[n] = -amp;  // 余弦相位
        }
        try {
            return this.ctx.createPeriodicWave(real, imag, { disableNormalization: true });
        } catch(e) { return 'square'; }
    }

    // ── 加载曲目 ──
    loadSong(song) {
        this.song = song;
        if (song.bpm) this.bpm = song.bpm;
        if (song.volume !== undefined) this.volume = song.volume;
    }

    // ── 开始播放 ──
    play() {
        if (!this.song || this.playing) return;
        this._ensureCtx();

        const ctx = this.ctx;

        // 创建主增益节点
        this.masterGain = ctx.createGain();
        this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 0.08);

        // 分析器（可视化用）
        this.analyser = ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.masterGain.connect(this.analyser);
        this.analyser.connect(ctx.destination);

        // 初始化所有轨的指针
        this._trackPos = {};
        if (this.song.melody) this._trackPos.melody = 0;
        if (this.song.bass) this._trackPos.bass = 0;
        if (this.song.drums) this._trackPos.drums = 0;
        if (this.song.harmony) this._trackPos.harmony = 0;
        if (this.song.noise) this._trackPos.noise = 0;
        if (this.song.counterMelody) this._trackPos.counter = 0;

        this._nextNoteTime = ctx.currentTime + 0.02;
        this.playing = true;

        // 启动调度循环
        this._scheduler();
    }

    // ── 停止播放（淡出）──
    stop() {
        this.playing = false;
        if (this._timerID) {
            clearTimeout(this._timerID);
            this._timerID = null;
        }
        if (this.masterGain && this.ctx) {
            const t = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(t);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
            this.masterGain.gain.linearRampToValueAtTime(0, t + 0.35);
            // 延迟断开
            setTimeout(() => {
                try { this.masterGain.disconnect(); } catch(e) {}
                this.masterGain = null;
                this.analyser = null;
            }, 400);
        }
    }

    // ── 立即停止（无淡出）──
    stopImmediate() {
        this.playing = false;
        if (this._timerID) {
            clearTimeout(this._timerID);
            this._timerID = null;
        }
        try { this.masterGain.disconnect(); } catch(e) {}
        this.masterGain = null;
        this.analyser = null;
    }

    // ── 设置音量 ──
    setVolume(v) {
        this.volume = Math.max(0, Math.min(1, v));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
    }

    // ════════════════════════════════════
    //  核心：调度器（lookahead 循环）
    // ════════════════════════════════════
    _scheduler() {
        if (!this.playing) return;

        while (this._nextNoteTime < this.ctx.currentTime + this._scheduleAheadTime) {
            this._scheduleTracks(this._nextNoteTime);
        }

        // 使用 requestAnimationFrame 或短定时器驱动
        // 使用较短的 setInterval 来保证精度
        const self = this;
        this._timerID = setTimeout(() => self._scheduler(), 20);
    }

    // ── 在指定时间调度所有轨的下一个音符 ──
    _scheduleTracks(time) {
        if (!this.song) return;
        const secPerBeat = 60 / this.bpm;

        // 旋律轨 — 类型可从曲目配置读取（melodyType），默认 square
        if (this.song.melody) {
            time = this._scheduleTrack('melody', this.song.melody, time, secPerBeat, {
                type: this.song.melodyType || 'square',
                vol: this.song.melodyVol || 0.14,
                attack: 0.003,
                decay: 0.06,
                sustain: 0.55,
                release: 0.10,
                dutyCycle: this.song.dutyCycle || 0.5,
            });
        }

        // 低音轨 — 支持"蹦跳式"(bouncy)和"持续式"(sustain)两种
        // 类型可从曲目配置读取（bassType），默认 triangle
        if (this.song.bass) {
            const isBouncy = this.song.bassStyle === 'bouncy';
            time = this._scheduleTrack('bass', this.song.bass, time, secPerBeat, {
                type: this.song.bassType || 'triangle',
                vol: this.song.bassVol || 0.12,
                attack: isBouncy ? 0.002 : 0.004,
                decay: isBouncy ? 0.04 : 0.08,
                sustain: isBouncy ? 0.20 : 0.50,
                release: isBouncy ? 0.06 : 0.12,
            });
        }

        // 和弦/垫底轨 — 支持长音铺底(pad)、琶音(arpeggio)、和弦块(chord)
        if (this.song.harmony) {
            const harmStyle = this.song.harmonyStyle || 'default';
            const isPad   = harmStyle === 'pad';
            const isChord = harmStyle === 'chord';
            time = this._scheduleTrack('harmony', this.song.harmony, time, secPerBeat, {
                type: this.song.harmonyType || 'square',
                vol: this.song.harmonyVol || 0.06,
                attack:  isPad ? 0.01 : isChord ? 0.004 : 0.002,
                decay:   isPad ? 0.05 : isChord ? 0.08  : 0.04,
                sustain: isPad ? 0.60 : isChord ? 0.55  : 0.30,  // chord模式保持音更久
                release: isPad ? 0.15 : isChord ? 0.12  : 0.08,
                dutyCycle: this.song.dutyCycle || (isPad ? 0.125 : 0.25),
            });
        }

        // 噪声打击乐轨
        if (this.song.drums) {
            time = this._scheduleDrumTrack(time, secPerBeat);
        }

        // 噪声效果轨
        if (this.song.noise) {
            time = this._scheduleTrack('noise', this.song.noise, time, secPerBeat, {
                type: 'noise',
                vol: this.song.noiseVol || 0.05,
            });
        }

        // ★副旋律/对位轨 — 比主旋律轻，增加层次感
        // 类型可从曲目配置读取（counterType），默认 square
        if (this.song.counterMelody) {
            time = this._scheduleTrack('counter', this.song.counterMelody, time, secPerBeat, {
                type: this.song.counterType || 'square',
                vol: this.song.counterVol || 0.08,
                attack: 0.003,
                decay: 0.06,
                sustain: 0.45,
                release: 0.10,
                dutyCycle: 0.30,   // 稍宽方波，比主旋律柔和
            });
        }

        // 推进时间到当前最长的音符结束位置
        this._nextNoteTime = time;
    }

    // ── 单轨音符调度 ──
    _scheduleTrack(trackName, notes, time, spb, opts) {
        const pos = this._trackPos[trackName];
        if (pos >= notes.length) {
            this._trackPos[trackName] = 0; // 循环
            return time;
        }

        const note = notes[pos]; // [noteIndex/indices, beatsDuration] 或 [noteIndex, beatsDuration, optsOverride]
        let noteIdx = note[0];
        let durBeats = note[1];

        // 支持覆盖选项
        const nOpts = note[2] ? { ...opts, ...note[2] } : opts;
        const durSec = durBeats * spb;

        // ★ 和弦支持：note[0] 为数组时同时播放所有音
        if (Array.isArray(noteIdx)) {
            // 和弦：每个音独立降低音量避免叠加过响（除以根号n）
            const chordVol = nOpts.vol / Math.sqrt(noteIdx.length);
            const chordOpts = { ...nOpts, vol: chordVol };
            noteIdx.forEach(idx => {
                const freq = CHIP_FREQ[idx];
                if (freq && freq > 0) {
                    this._playTone(freq, durSec, time, chordOpts);
                }
            });
        } else {
            const freq = CHIP_FREQ[noteIdx] || 0;
            if (freq > 0) {
                this._playTone(freq, durSec, time, nOpts);
            }
        }

        this._trackPos[trackName] = pos + 1;
        return time + durSec;
    }

    // ── 打击乐轨调度（噪声）──
    _scheduleDrumTrack(time, spb) {
        const pos = this._trackPos.drums;
        const drums = this.song.drums;
        if (pos >= drums.length) {
            this._trackPos.drums = 0;
            return time;
        }

        const drum = drums[pos]; // ['kick' | 'snare' | 'hihat' | 'rest', beatsDuration]
        const type = drum[0];
        const durBeats = drum[1];

        switch (type) {
            case 'kick':
                this._playDrumKick(time);
                break;
            case 'snare':
                this._playDrumSnare(time);
                break;
            case 'hihat':
            case 'hh':
                this._playDrumHiHat(time, drum[2]); // drum[2] 可以是 'open'/'closed'
                break;
            case 'tom':
                this._playDrumTom(time);
                break;
            case 'rest':
                break;
        }

        this._trackPos.drums = pos + 1;
        return time + durBeats * spb;
    }

    // ════════════════════════════════════
    //  合成器方法
    // ════════════════════════════════════

    /** 播放一个带硬包络的音调 */
    _playTone(freq, duration, startTime, opts) {
        try {
            const ctx = this.ctx;
            if (!ctx || !this.masterGain) return;

            const type = opts.type || 'square';
            const vol = opts.vol || 0.1;
            const attack = opts.attack !== undefined ? opts.attack : 0.003;
            const decay = opts.decay !== undefined ? opts.decay : 0.06;
            const sustain = opts.sustain !== undefined ? opts.sustain : 0.45;
            const release = opts.release !== undefined ? opts.release : 0.10;

            // 噪声类型特殊处理
            if (type === 'noise') {
                this._playNoise(duration, startTime, vol);
                return;
            }

            const osc = ctx.createOscillator();
            osc.type = type;

            // 方波 duty cycle（通过自定义周期波形实现真实占空比变化）
            if (type === 'square' && opts.dutyCycle && this._waveforms) {
                const dcKey = opts.dutyCycle <= 0.15 ? 'd12' : opts.dutyCycle <= 0.35 ? 'd25' : 'd50';
                const wf = this._waveforms[dcKey];
                if (wf && wf !== 'square') {
                    osc.setPeriodicWave(wf);
                }
            }

            osc.frequency.setValueAtTime(freq, startTime);
            // 可选：滑音
            if (opts.slideTo) {
                osc.frequency.exponentialRampToValueAtTime(
                    Math.max(opts.slideTo, 20), startTime + duration * 0.8
                );
            }

            // ADSR 包络 — 8bit 硬包络特征：attack 极短
            const env = ctx.createGain();
            env.gain.setValueAtTime(0, startTime);
            env.gain.linearRampToValueAtTime(vol, startTime + attack);           // Attack
            env.gain.linearRampToValueAtTime(vol * sustain, startTime + attack + decay);  // Decay
            // Sustain 保持
            env.gain.setValueAtTime(vol * sustain, startTime + duration - release);
            env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);     // Release

            osc.connect(env);
            env.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.01);
        } catch(e) {}
    }

    /** 噪声脉冲 */
    _playNoise(dur, start, vol) {
        try {
            const ctx = this.ctx;
            if (!ctx || !this.masterGain) return;

            const bufLen = ctx.sampleRate * Math.min(dur, 0.3);
            const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
            const data = buf.getChannelData(0);
            
            // 低通滤波噪声（模拟 FC 2A03 噪声通道）
            for (let i = 0; i < data.length; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const src = ctx.createBufferSource();
            src.buffer = buf;

            // 低通滤波让噪声更"闷"，更像老游戏
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2500, start);
            filter.Q.setValueAtTime(1, start);

            const env = ctx.createGain();
            env.gain.setValueAtTime(vol, start);
            env.gain.exponentialRampToValueAtTime(0.001, start + dur);

            src.connect(filter);
            filter.connect(env);
            env.connect(this.masterGain);

            src.start(start);
            src.stop(start + dur + 0.01);
        } catch(e) {}
    }

    // ── 打击乐合成 ──

    /** 底鼓 kick — 快速下降的正弦/三角波 */
    _playDrumKick(time) {
        try {
            const ctx = this.ctx;
            if (!ctx || !this.masterGain) return;

            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);

            const env = ctx.createGain();
            env.gain.setValueAtTime(this.song.kickVol || 0.22, time);
            env.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

            osc.connect(env);
            env.connect(this.masterGain);
            osc.start(time); osc.stop(time + 0.18);
        } catch(e) {}
    }

    /** 军鼓 snare — 噪声 + 中频方波短脉冲 */
    _playDrumSnare(time) {
        try {
            const ctx = this.ctx;
            if (!ctx || !this.masterGain) return;

            // 噪声主体
            this._playNoise(0.08, time, this.song.snareVol || 0.13);

            // 中频骨架
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(220, time);
            osc.frequency.exponentialRampToValueAtTime(160, time + 0.05);

            const env = ctx.createGain();
            env.gain.setValueAtTime(0.07, time);
            env.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

            osc.connect(env);
            env.connect(this.masterGain);
            osc.start(time); osc.stop(time + 0.08);
        } catch(e) {}
    }

    /** 踩镲 hi-hat — 高通噪声 */
    _playDrumHiHat(time, variant) {
        try {
            const ctx = this.ctx;
            if (!ctx || !this.masterGain) return;

            const dur = (variant === 'open') ? 0.25 : 0.04;
            const vol = (variant === 'open') ? 0.05 : 0.06;

            const bufLen = ctx.sampleRate * dur;
            const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

            const src = ctx.createBufferSource();
            src.buffer = buf;

            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(7000, time);

            const env = ctx.createGain();
            env.gain.setValueAtTime(vol, time);
            env.gain.exponentialRampToValueAtTime(0.001, time + dur);

            src.connect(filter);
            filter.connect(env);
            env.connect(this.masterGain);
            src.start(time); src.stop(time + dur + 0.01);
        } catch(e) {}
    }

    /** 通鼓 tom — 中频下降 */
    _playDrumTom(time) {
        try {
            const ctx = this.ctx;
            if (!ctx || !this.masterGain) return;

            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, time);
            osc.frequency.exponentialRampToValueAtTime(100, time + 0.15);

            const env = ctx.createGain();
            env.gain.setValueAtTime(0.12, time);
            env.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

            osc.connect(env);
            env.connect(this.masterGain);
            osc.start(time); osc.stop(time + 0.20);
        } catch(e) {}
    }


    // ════════════════════════════════════
    //  作曲辅助工具函数
    // ════════════════════════════════════

    /**
     * 将简化的字符串记谱转为数组格式
     * 例: "E4> E4> D4> C4>" => [[28,0.5],[28,0.5],[26,0.5],[24,0.5]]
     * 
     * 符号说明:
     *   音名+八度: C4, D#4, Ab3 等
     *   > = 八分音符 (0.5拍), >> = 四分音符 (1拍)
     *   . = 附点（时值×1.5）
     *   ~ = 连音（平滑过渡）
     *   R = 休止符
     *   | = 小节分隔（忽略）
     * 
     * @param {string} str - 字符串记谱
     * @param {number} baseDur - 基础时值（默认 0.5 = 八分音符）
     * @returns {Array} [noteIdx, beats]
     */
    static parseMelodyStr(str, baseDur = 0.5) {
        const result = [];
        // 匹配模式：(音名)(可选#或b)(八度)(时长符号)
        const tokenRe = /([A-G][#b]?)(\d)([>\.]*)/gi;
        let m;
        
        // 分割成 token
        const tokens = str.split(/\s+/).filter(t => t && t !== '|');
        
        for (const tok of tokens) {
            if (tok.toUpperCase() === 'R' || tok === '-') {
                result.push([-1, baseDur]);
                continue;
            }
            
            const match = tokenRe.exec(tok);
            if (match) {
                const noteName = match[1].toUpperCase() + match[2];
                const durSym = match[3] || '';
                let dur = baseDur;
                
                // 每个 > 加 0.5 拍
                const gtCount = (durSym.match(/>/g) || []).length;
                dur = baseDur * (gtCount || 1);
                
                // 附点 ×1.5
                if (durSym.includes('.')) dur *= 1.5;

                const idx = CHIP_NOTE_MAP[noteName];
                if (idx !== undefined) {
                    result.push([idx, dur]);
                }
            } else {
                // 尝试直接匹配
                const idx = CHIP_NOTE_MAP[tok.toUpperCase()];
                if (idx !== undefined) {
                    result.push([idx, baseDur]);
                }
            }
        }
        return result;
    }
}

// ═══════════════════════════════════════
//  🎵 曲目库 — FC/马里奥风格 BGM
//
//  作曲原则（对标马里奥/洛克人 BGM）：
//  1. 旋律动机鲜明 — 一听就记住的"hook"乐句
//  2. 低音蹦跳式 — 根-五-根-八交替，每拍一个短音符
//  3. 和弦做持续音垫底 — 不抢旋律，安静铺底
//  4. 节奏清晰 — kick正拍/snare反拍/hh填充

const CHIP_SONGS = {

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🏘️ 城镇 BGM — "江湖浩歌" 第六版
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // G大调(五声), BPM 128, ★大气磅礴·合成史诗风
    // ★HOOK: "Sol-Re-Sol-Mi" 四度跳进+温柔解决 → 高八度辉煌副歌
    // 升级点: 加厚弦乐铺底 / 双倍kick鼓 / 高音区号角 / 军鼓滚奏
    town: {
        name: '\U0001f3d8\ufe0f 城镇 · 浩气长存',
        bpm: 128,
        volume: 0.24,
        melodyVol: 0.12,      // ↓ 从0.16降到0.12，让和声能出来
        bassVol: 0.14,
        bassStyle: 'bouncy',
        harmonyVol: 0.18,     // ↑↑ 从0.12升到0.18，和声成为主角之一！
        counterVol: 0.13,     // ↑ 从0.09升到0.13，副旋律清晰可闻
        dutyCycle: 0.25,
        kickVol: 0.30,
        snareVol: 0.18,

        // ═══ 主旋律 ═══
        // G大调五声:
        // G3=19  A3=21  B3=23  D3=26  E3=28
        // G4=31  A4=33  B4=35  D4=38  E4=40
        // G5=43  A5=45  B5=47  D5=50  E5=52  F#5=53
        melody: [
            // ── Intro (2小节) — 笛声悠扬引入 ──
            [31, 1.0], [33, 0.5], [35, 0.5],             // Sol-La-Si
            [38, 1.5], [-1, 0.5],                        // Re~~~ 呼吸

            // ══ A1 (8小节) — ★温暖叙事主题 ══
            [31, 0.5], [38, 0.5], [31, 0.5], [28, 0.5],  // Sol-Re-Sol-Mi ★HOOK
            [26, 0.5], [24, 0.5], [22, 0.5], [19, 1.0],  // Do-Si-La-Sol~
            [21, 0.5], [24, 0.5], [26, 0.5], [28, 0.5],  // La-Do-Re-Mi 上行
            [31, 1.0], [28, 1.0],                         // Sol~ Re~

            [19, 0.5], [24, 0.5], [19, 0.5], [17, 0.5],  // Sol-Re-Sol-Do 低八度
            [15, 0.5], [14, 0.5], [12, 0.5], [10, 1.0],  // La-Si-Sol-Fa~
            [12, 0.5], [15, 0.5], [17, 0.5], [19, 0.5],  // Sol-La-Si-Re
            [24, 1.5], [-1, 0.5],                          // Do~~~

            // ══ A2 (8小节) — 变奏推进 ══
            [31, 0.5], [35, 0.5], [38, 0.5], [35, 0.5],  // Sol-Si-Re-Si
            [33, 0.5], [31, 0.5], [28, 0.5], [26, 1.0],  // La-Sol-Mi-Do~
            [24, 0.5], [28, 0.5], [31, 0.5], [33, 0.5],  // Do-Re-Sol-La
            [35, 1.0], [31, 1.0],                          // Si~ Sol~

            [19, 0.5], [24, 0.5], [28, 0.5], [24, 0.5],  // Re-Sol-Re 跳跃
            [22, 0.5], [19, 0.5], [17, 0.5], [15, 1.0],  // La-Re-Do-La~
            [17, 0.5], [19, 0.5], [24, 0.5], [28, 0.5],  // Do-Re-Sol-Re
            [26, 1.5], [24, 0.5],                           // Do~ Re

            // ══ B1 (8小节) ★★★高潮！高八度号角辉煌 ══
            [50, 0.5], [45, 0.5], [47, 0.5], [40, 0.5],  // Re-Si-Sol-Mi ★高!
            [38, 0.5], [50, 0.5], [52, 1.0],              // Re-Sol-La~ 冲顶!
            [50, 0.5], [45, 0.5], [38, 0.5], [35, 0.5],  // Sol-Mi-Re-Si
            [33, 1.0], [31, 1.0],                          // La~ Sol~

            [38, 0.5], [33, 0.5], [38, 0.5], [42, 0.5],  // Re-La-Re-Fi# 大跳
            [40, 0.5], [38, 0.5], [40, 0.5], [38, 0.75], // Mi-Re-Mi-Re~
            [35, 0.25], [33, 0.5], [31, 0.5],             // Si-La-Sol
            [28, 2.0],                                     // Re~~~~ 长收

            // ══ B2 (8小节) — 华彩回落 ══
            [31, 0.5], [33, 0.5], [35, 0.5], [38, 0.5],  // 上行
            [40, 0.5], [43, 0.5], [45, 0.5], [43, 0.5],  // 继续
            [40, 0.5], [38, 0.5], [35, 0.5], [33, 0.5],  // 下行
            [31, 1.0], [28, 1.0],                          // Sol~ Re~

            [24, 0.5], [26, 0.5], [28, 0.5], [31, 0.5],  // Do-Re-Mi-Sol
            [33, 0.5], [35, 0.5], [33, 0.25], [31, 0.75],// La-Si-La-Sol
            [28, 0.5], [26, 0.5], [24, 1.5],              // Re-Do~
            [22, 0.5],                                      // La 过渡

            // ── Outro (2小节) ──
            [19, 1.0], [24, 1.0],                          // Re-Sol
            [17, 2.0],                                     // Do~~ 悠远
        ],

        // ★★★ 新增：副旋律/对位线 ★★★
        // 设计原则：
        // - A段：长音呼应式（主旋律停时副旋律补）
        // - B段：快速装饰性跑动（主旋律大线条，副旋律填缝）
        // - 音量比主旋律低(counterVol=0.09)，不抢焦点但增加层次
        counterMelody: [
            // ── Intro ──
            [-1, 2.0],                                       // 静默，让笛声独白

            // ══ A1 — 长音呼应式副旋律 ══
            // 策略：主旋律每句末尾的长音处，副旋律做简短呼应
            [-1, 2.0],                                       // 第1句静默(让HOOK清晰呈现)
            [28, 1.5], [31, 0.5],                            // Mi~Sol 呼应第1句末尾的Sol~
            [-1, 1.0], [24, 1.0],                            // 静默 + Do 呼应末尾Do~~
            [26, 1.5], [24, 0.5],                            // Re~Do 呼应

            // A1第二句 — 更多参与
            [-1, 1.5], [19, 0.5],                            // Sol 低音呼应
            [15, 1.0], [17, 0.5], [19, 0.5],                 // La~Si-Re 小上行
            [-1, 2.0],                                       // 静默等Do~~~

            // ══ A2 — 更活跃的对位 ══
            [35, 0.5], [33, 0.5], [31, 0.5], [28, 0.5],    // Si-La-Sol-Mi 下行(与主旋律反方向!)
            [-1, 1.0], [33, 1.0],                            // La~ 呼应
            [24, 0.5], [28, 0.5], [31, 0.5],               // Do-Re-Sol 小上行
            [35, 1.5], [33, 0.5],                            // Si~La 呼应

            // 第二句 — 对位缠绕
            [26, 0.5], [24, 0.5], [21, 0.5], [19, 0.5],    // Re-Do-La-Sol 平稳下行
            [-1, 1.5], [17, 0.5],                            // Do 呼应
            [28, 0.5], [26, 0.5], [24, 0.5],                // Re-Do-Re
            [26, 1.5], [28, 0.5],                            // Do~Re

            // ══ B1 ★高潮 — 快速跑动装饰 ═══
            // 策略：在主旋律大跳间隙填入快速经过音，增加华丽感
            [-1, 0.5], [45, 0.25], [47, 0.25],              // 静默 + Si快速闪过
            [50, 0.25], [47, 0.25], [45, 0.25], [43, 0.25],// Re-Si-Sol 快速下行
            [40, 0.5], [38, 0.5],                             // Mi-Re
            [35, 0.5], [33, 0.5],                             // Si-La

            // 第二遍 — 音阶跑动填充
            [31, 0.25], [33, 0.25], [35, 0.25], [38, 0.25],// Sol-La-Si-Re 上行
            [40, 0.25], [38, 0.25], [35, 0.33], [33, 0.33],// Mi-Re-Si-La
            [31, 0.34],                                       // Sol 收住
            [28, 1.5], [26, 0.5],                             // Re~Do

            // ══ B2 — 华彩回落对位 ══
            [35, 0.5], [33, 0.5], [31, 0.5], [28, 0.5],    // Si-La-Sol-Mi
            [26, 0.5], [24, 0.5], [21, 0.5], [19, 0.5],    // Re-Do-La-Sol
            [17, 0.5], [19, 0.5], [24, 0.5],                // Do-Re-Sol
            [26, 1.0], [24, 1.0],                             // Re~ Do~

            // 收束
            [19, 0.5], [17, 0.5], [15, 0.5],                // Sol-Do-La
            [12, 1.5], [14, 0.5],                             // Fa~Si 游离

            // ── Outro ──
            [24, 1.5], [19, 0.5],                             // Do~Sol
            [-1, 2.0],                                       // 静默收
        ],

        bass: [
            // Intro — G
            [-5, 0.5],[-5, 0.5], [-5, 0.5],[0, 0.5],
            [-5, 0.5],[-5, 0.5], [-5, 1.0],

            // A1 — G | Em | C | D
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],
            [-8, 0.5],[-8, 0.5], [-3, 0.5],[-3, 0.5],
            [-3, 0.5],[-3, 0.5], [0, 0.5],[0, 0.5],
            [-5, 0.5],[-5, 0.5], [-5, 1.0],

            // 第二句 — G | Em | C | D
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],
            [-8, 0.5],[-8, 0.5], [-3, 0.5],[-3, 0.5],
            [-3, 0.5],[-3, 0.5], [0, 0.5],[0, 0.5],
            [-7, 0.5],[-7, 0.5], [-7, 1.0],

            // A2 — G | C | Em | D
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],
            [-3, 0.5],[-3, 0.5], [0, 0.5],[0, 0.5],
            [-8, 0.5],[-8, 0.5], [-3, 0.5],[-3, 0.5],
            [-7, 0.5],[-7, 0.5], [-7, 0.5],[-2, 0.5],

            // 第二句 — Am | C | G | D
            [-10, 0.5],[-10, 0.5], [-5, 0.5],[-5, 0.5],
            [-3, 0.5],[-3, 0.5], [0, 0.5],[0, 0.5],
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],
            [-7, 0.5],[-7, 0.5], [-7, 1.0],

            // B1 ★高潮 — G | D | Em | Bm
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],
            [-7, 0.5],[-7, 0.5], [-2, 0.5],[-2, 0.5],
            [-8, 0.5],[-8, 0.5], [-3, 0.5],[-3, 0.5],
            [-12, 0.5],[-12, 0.5], [-7, 0.5],[-7, 0.5],

            // B1第二句 — C | G | D(add9) | G
            [-3, 0.5],[-3, 0.5], [0, 0.5],[0, 0.5],
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],
            [-7, 0.5],[-7, 0.5], [-2, 0.5],[2, 0.5],
            [-5, 0.5],[-5, 0.5], [-5, 1.0],

            // B2 — C | D | Em | G
            [-3, 0.5],[-3, 0.5], [0, 0.5],[0, 0.5],
            [-7, 0.5],[-7, 0.5], [-7, 0.5],[-2, 0.5],
            [-8, 0.5],[-8, 0.5], [-3, 0.5],[-3, 0.5],
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],

            // B2收束 — Am | D | G
            [-10, 0.5],[-10, 0.5], [-5, 0.5],[-5, 0.5],
            [-7, 0.5],[-7, 0.5], [-7, 1.0],

            // Outro — G
            [-5, 0.5],[-5, 0.5], [0, 0.5],[0, 0.5],
            [-5, 2.0],
        ],

        harmony: [
            // ═══ 和声层 — ★第九版：全铺满！零空隙和弦垫 ═══
            // 核心原则：和声是"背景地毯"，必须持续不断、无缝衔接
            // 每个小节音符时值之和 ≈ 4拍，用和弦内音填满每一个空隙

            // ── Intro (2小节) ──
            [31, 0.75], [38, 0.55], [35, 0.5], [31, 0.65], [28, 0.85], [24, 0.7], // G->Em过渡 (6音=4.0)
            [19, 0.9], [23, 0.7], [27, 0.6], [23, 0.5], [20, 0.7], [15, 0.6],       // Em铺满 (6音=4.0)

            // A1 第1句 - G | Em | C | D（每小节6个音，无缝衔接）
            [31, 0.7], [38, 0.55], [35, 0.6], [31, 0.55], [28, 0.65], [24, 0.65],    // G和弦内音流
            [20, 0.7], [26, 0.55], [23, 0.6], [20, 0.55], [15, 0.65], [20, 0.6],      // Em
            [28, 0.7], [35, 0.55], [32, 0.6], [28, 0.55], [24, 0.65], [21, 0.6],       // C
            [26, 0.7], [33, 0.55], [29, 0.6], [26, 0.55], [22, 0.65], [17, 0.65],      // D

            // A1 第2句 - G | Em | C | D（高八度变奏）
            [38, 0.7], [44, 0.55], [41, 0.6], [38, 0.55], [35, 0.65], [31, 0.65],
            [24, 0.7], [30, 0.55], [27, 0.6], [24, 0.55], [19, 0.65], [24, 0.6],
            [32, 0.7], [39, 0.55], [36, 0.6], [32, 0.55], [28, 0.65], [24, 0.65],
            [30, 0.7], [37, 0.55], [33, 0.6], [30, 0.55], [26, 0.65], [21, 0.65],

            // A2 第1句 - G | C | Em | D（流动分解琶音，每小节4长音）
            [31, 0.95], [38, 0.7], [35, 0.85], [28, 1.05],         // G分解
            [24, 0.95], [31, 0.7], [28, 0.85], [35, 0.95],          // C分解
            [28, 0.95], [35, 0.7], [32, 0.85], [24, 0.95],          // Em分解
            [26, 0.95], [33, 0.7], [30, 0.85], [22, 1.05],          // D分解

            // A2 第2句 - Am | C | G | D
            [22, 0.95], [28, 0.7], [24, 0.85], [19, 1.05],           // Am分解
            [24, 0.95], [31, 0.7], [28, 0.85], [35, 0.95],           // C分解
            [31, 0.95], [38, 0.7], [35, 0.85], [28, 1.05],           // G分解
            [26, 0.95], [33, 0.7], [30, 0.85], [22, 1.05],           // D分解

            // B1 高潮 - 每小节8个快速音（每拍2音约4拍）
            [43, 0.45], [47, 0.3], [50, 0.25], [47, 0.3], [43, 0.35], [38, 0.35], [42, 0.3], [46, 0.25],
            [38, 0.45], [42, 0.3], [45, 0.25], [42, 0.3], [38, 0.35], [34, 0.35], [37, 0.3], [41, 0.25],
            [40, 0.45], [43, 0.3], [47, 0.25], [43, 0.3], [40, 0.35], [36, 0.35], [39, 0.3], [44, 0.25],
            [47, 0.45], [51, 0.3], [54, 0.25], [51, 0.3], [47, 0.35], [43, 0.35], [46, 0.3], [50, 0.25],

            [36, 0.45], [40, 0.3], [43, 0.25], [40, 0.3], [36, 0.35], [32, 0.35], [35, 0.3], [40, 0.25],
            [43, 0.45], [47, 0.3], [50, 0.25], [47, 0.3], [43, 0.35], [38, 0.35], [42, 0.3], [47, 0.25],
            [38, 0.4], [42, 0.3], [46, 0.25], [42, 0.3], [38, 0.35], [34, 0.3], [38, 0.3], [46, 0.3],
            [43, 0.55], [50, 0.35], [47, 0.4], [43, 0.35], [50, 0.3], [43, 0.35],

            // B2 保持厚度回落
            [36, 0.45], [40, 0.3], [43, 0.25], [40, 0.3], [36, 0.35], [31, 0.35], [35, 0.3], [40, 0.25],
            [38, 0.45], [42, 0.3], [45, 0.25], [42, 0.3], [38, 0.35], [33, 0.35], [37, 0.3], [41, 0.25],
            [40, 0.45], [43, 0.3], [47, 0.25], [43, 0.3], [40, 0.35], [36, 0.35], [39, 0.3], [44, 0.25],
            [43, 0.5], [47, 0.35], [50, 0.3], [47, 0.35], [43, 0.4], [38, 0.35],

            // 收束 Am | D
            [22, 0.7], [27, 0.5], [31, 0.6], [28, 0.55], [24, 0.6], [19, 0.65], [24, 0.4],
            [26, 0.8], [33, 0.6], [29, 0.7], [22, 0.65], [17, 0.6], [26, 0.65],

            // Outro 回归A1风格铺底
            [31, 0.9], [38, 0.6], [35, 0.8], [28, 0.7], [24, 1.0],
            [21, 1.5], [14, 0.5],
        ],

        drums: [
            // ── Intro (2小节) — 极简引入 ──
            ['kick', 1.5], ['hh', 0.5],                      // kick长 + hh尾
            ['kick', 0.5], ['hh', 0.5], ['snare', 0.5], ['hh', 0.5], // 完整一拍

            // ══ A1前半 (4小节) — ★轻摇滚：仅底鼓+军鼓，无hh！╚═
            ['kick', 1.0], ['rest', 1.0],                     // 第1小节：只有kick！极简留白
            ['kick', 0.75], ['snare', 0.25], ['rest', 1.0],  // kick + snare轻敲
            ['kick', 0.5], ['rest', 0.5], ['snare', 0.5], ['rest', 0.5], // 正规拍子
            ['kick', 0.5], ['snare', 0.5], ['kick', 0.5], ['snare', 0.5], // 双倍

            // ══ A1后半 (4小节) — 加入hh，开始有律动 ══
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['rest', 0.25],
            ['tom', 0.25], ['rest', 0.5],                       // tom fill结尾
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['snare', 0.5], ['rest', 0.5], ['tom', 0.5],

            // ══ A2前半 (4小节) — 稳定rock beat ══
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['snare', 0.5], ['kick', 0.5], ['snare', 0.5],

            // ══ A2后半 (4小节) — ★推进！加速感+fill ══
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],   // hh更快!
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['snare', 0.5], ['hh', 0.2],   // ★双kick驱动!
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['tom', 0.15], ['hh', 0.15], ['tom', 0.1],
            ['kick', 1.0], ['rest', 0.5], ['snare', 0.5],             // ★半拍空隙=呼吸！

            // ══ B1 ★★★ 高潮 (8小节) — 全力爆发 ══
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['snare', 0.5], ['tom', 0.3], ['tom', 0.2], ['tom', 0.25], ['hh', 0.25],
            // B1后半 — 变化！
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.12], ['hh', 0.12], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['kick', 0.5], ['snare', 0.5], ['tom', 0.2], ['tom', 0.2], ['hh', 0.2],
            ['kick', 1.5], ['rest', 0.5], ['snare', 0.5], ['rest', 0.5],   // ★★大呼吸！

            // ══ B2回落 (8小节) — 强度维持但有变化 ══
            ['kick', 0.5], ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['hh', 0.2], ['snare', 0.5], ['hh', 0.2],
            ['kick', 0.5], ['snare', 0.5], ['rest', 0.5], ['tom', 0.5],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['hh', 0.25],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['rest', 0.5],
            ['tom', 0.5],

            // ── Outro (2小节) — 回归A1感觉 ══
            ['kick', 0.5], ['snare', 0.5], ['rest', 1.0],          // 简单干净
            ['kick', 0.75], ['rest', 1.25],                       // 最后一个kick渐远
        ],
    },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━
    // 🏘️ 城镇BGM — "悠远江湖"（简洁版，类似index页面风格）
    // ━━━━━━━━━━━━━━━━━━━━━━━━
    townMellow: {
        name: '🏘️ 城镇 · 悠远江湖',
        bpm: 100,
        volume: 0.18,
        melodyVol: 0.15,
        bassVol: 0.10,
        bassStyle: 'sustain',
        melodyType: 'sine',
        bassType: 'sine',

        // 旋律：D宫调五声音阶，正弦波，悠远叙事
        // D4=26, E4=28, G4=31, A4=33, B4=35, D5=38, E5=40
        melody: [
            [38, 0.9], [28, 0.7], [31, 1.1], [28, 0.5], [38, 0.9], [35, 0.6], [33, 0.7],
            [21, 1.0], [38, 0.5], [28, 1.1], [38, 0.5], [21, 0.9], [23, 0.5], [21, 0.8],
            [26, 0.9], [28, 0.7], [31, 1.0], [28, 0.5], [26, 0.8], [33, 0.5], [31, 0.7],
            [38, 1.1], [28, 0.7], [31, 1.3], [28, 0.5], [31, 0.9], [35, 1.5],
        ],

        // 低音：D宫调五声，缓慢根音+五度交替
        bass: [
            [14, 3.2], [21, 3.2], [19, 3.2], [14, 3.2],
            [16, 3.2], [19, 3.2], [21, 3.2], [14, 3.2],
            [21, 3.2], [19, 3.2], [16, 3.2], [14, 3.2],
            [19, 3.2], [21, 3.2], [14, 3.2], [14, 3.2],
        ],
    },

    // ⚔️ 战斗 BGM — "刀光剑影"
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Am小调, BPM 155, 紧张驱动感
    // ★HOOK: "Mi-Mi-Do-La" 小三度下行 + 半音张力
    battle: {
        name: '⚔️ 战斗 · 刀光剑影',
        bpm: 155,
        volume: 0.22,
        melodyVol: 0.14,
        bassVol: 0.14,
        bassStyle: 'driving',
        harmonyVol: 0.10,      // ↑ 提高和弦音量（原0.05），三音和弦本身已降音量
        harmonyStyle: 'chord', // 和弦模式
        harmonyType: 'square',
        dutyCycle: 0.25,
        kickVol: 0.28,
        snareVol: 0.17,

        // ─── 音符索引速查（Am小调）───
        // C3=12 D3=14 E3=16 F3=17 G3=19 A3=21 B3=23
        // C4=24 D4=26 E4=28 F4=29 G4=31 A4=33 B4=35
        // C5=36 D5=38 E5=40 F5=41 G5=43 A5=45
        // 和弦定义（根音+三度+五度）：
        //   Am  = A3+C4+E4 = [21,24,28]
        //   G   = G3+B3+D4 = [19,23,26]
        //   F   = F3+A3+C4 = [17,21,24]
        //   E   = E3+G#3+B3= [16,20,23]  (E大，增加张力)
        //   Am7 = A3+C4+E4+G4 = [21,24,28,31]
        //   Dm  = D3+F3+A3= [14,17,21]
        //   C   = C3+E3+G3= [12,16,19]
        //   E7  = E3+G#3+B3+D4=[16,20,23,26]

        melody: [
            // Intro (2小节)
            [33, 0.25], [33, 0.25], [38, 0.5],
            [36, 0.125], [33, 0.125], [29, 0.5],
            [27, 0.125], [24, 0.125], [28, 0.25], [33, 0.375],

            // A1 (4小节) — 紧迫追问
            [33, 0.25], [33, 0.25], [29, 0.5],
            [27, 0.25], [24, 0.25], [27, 0.5],
            [29, 0.25], [33, 0.25], [36, 0.5],
            [34, 0.25], [31, 0.25], [29, 0.5],

            [24, 0.25], [24, 0.25], [20, 0.5],
            [19, 0.25], [15, 0.25], [19, 0.5],
            [21, 0.25], [24, 0.25], [28, 0.5],
            [29, 0.25], [27, 0.25], [24, 0.625],

            // A2 (4小节)
            [36, 0.25], [36, 0.25], [32, 0.5],
            [31, 0.25], [27, 0.25], [31, 0.5],
            [33, 0.25], [36, 0.25], [40, 0.5],
            [38, 0.25], [36, 0.25], [33, 0.625],

            // 跑动! 16分音阶级进
            [29, 0.125], [31, 0.125], [33, 0.125], [36, 0.125],
            [38, 0.125], [40, 0.125], [43, 0.125], [41, 0.125],
            [38, 0.125], [36, 0.125], [33, 0.125], [31, 0.125],
            [29, 0.25], [26, 0.5],

            // B (4小节) — 高音爆发!
            [41, 0.25], [43, 0.25], [45, 0.5],
            [43, 0.25], [40, 0.25], [38, 0.5],
            [36, 0.25], [40, 0.25], [43, 0.5],
            [45, 0.25], [43, 0.25], [41, 0.5],

            [38, 0.25], [36, 0.25], [33, 0.25], [31, 0.25],
            [29, 0.25], [33, 0.25], [36, 0.5],
            [40, 0.25], [38, 0.25], [36, 0.25], [33, 0.25],
            [31, 0.75],

            // A' (简化)
            [33, 0.25], [33, 0.25], [29, 0.5],
            [27, 0.25], [24, 0.25], [27, 0.5],
            [29, 0.25], [33, 0.25], [38, 0.5],

            // Outro
            [29, 0.25], [27, 0.25], [24, 0.375],
            [15, 1.0],
        ],

        bass: [
            [-1, 0.5], [0, 0.5],
            [0, 0.25],[0, 0.25], [0, 0.25],[0, 0.25],
            [-10, 0.25],[-10, 0.25],[-10, 0.25],[-10, 0.25],
            [-7, 0.25],[-7, 0.25],[-7, 0.25],[0, 0.25],
            // A1
            [0, 0.25],[0, 0.25],[0, 0.25],[-10, 0.25],
            [-10, 0.25],[-10, 0.25],[-10, 0.25],[-7, 0.25],
            [-7, 0.25],[-7, 0.25],[-7, 0.25],[-7, 0.25],
            [0, 0.25],[0, 0.25],[0, 0.25],[0, 0.25],
            // A1第二句
            [0, 0.25],[0, 0.25],[0, 0.25],[-8, 0.25],
            [-8, 0.25],[-8, 0.25],[-8, 0.25],[-5, 0.25],
            [-5, 0.25],[-5, 0.25],[-5, 0.25],[-5, 0.25],
            [0, 0.25],[0, 0.25],[0, 0.5],
            // A2
            [0, 0.25],[0, 0.25],[0, 0.25],[0, 0.25],
            [-10, 0.25],[-10, 0.25],[-10, 0.25],[-10, 0.25],
            [-7, 0.25],[-7, 0.25],[-7, 0.25],[-7, 0.25],
            [0, 0.25],[0, 0.25],[0, 0.25],[0, 0.25],
            // 跑动段同步
            [0, 0.125],[-3, 0.125],[-5, 0.125],[-7, 0.125],
            [-8, 0.125],[-10, 0.125],[-12, 0.125],[-10, 0.125],
            [-8, 0.125],[-7, 0.125],[-5, 0.125],[-3, 0.125],
            [0, 0.375],
            // B
            [-7, 0.25],[-7, 0.25],[-7, 0.25],[-7, 0.25],
            [-5, 0.25],[-5, 0.25],[-5, 0.25],[-5, 0.25],
            [0, 0.25],[0, 0.25],[0, 0.25],[0, 0.25],
            [12, 0.25],[12, 0.25],[12, 0.25],[12, 0.25],
            [-5, 0.25],[-5, 0.25],[-5, 0.25],[-5, 0.25],
            [0, 0.5],
            // A'
            [0, 0.25],[0, 0.25],[0, 0.25],[-10, 0.25],
            [-10, 0.25],[-10, 0.25],[-10, 0.25],[-7, 0.25],
            [-7, 0.25],[-7, 0.25],[0, 0.5],
            // Outro
            [0, 0.5], [-10, 0.5], [0, 1.0],
        ],

        // ★★★ 和弦轨 — 真正的三音和弦 ★★★
        // 进行：Am - G - F - E（经典小调强进行）
        // 每个和弦打 1 拍（0.5拍×2），带短促 attack 给8bit 冲击感
        // note格式：[[音1,音2,音3], 时值]
        harmony: [
            // Intro — 静默引入
            [[-1], 2.0],

            // A1 — Am Am G G / F F E E 循环
            // 第1句（4拍 = Am Am G G）
            [[21,24,28], 0.5], [[21,24,28], 0.5],   // Am Am
            [[19,23,26], 0.5], [[19,23,26], 0.5],   // G  G

            [[17,21,24], 0.5], [[17,21,24], 0.5],   // F  F
            [[16,20,23], 0.5], [[16,20,23], 0.5],   // E  E (大三，张力!)

            // 第2句（低八度变体 Am Dm G E）
            [[21,24,28], 0.5], [[21,24,28], 0.5],   // Am Am
            [[14,17,21], 0.5], [[14,17,21], 0.5],   // Dm Dm

            [[19,23,26], 0.5], [[19,23,26], 0.5],   // G  G
            [[16,20,23], 0.5], [[16,20,23], 0.5],   // E  E

            // A2 — 加入七和弦，更丰富
            [[21,24,28,31], 0.5], [[21,24,28,31], 0.5],  // Am7 Am7
            [[19,23,26], 0.5],    [[19,23,26], 0.5],      // G   G

            [[17,21,24], 0.5], [[17,21,24], 0.5],         // F   F
            [[16,20,23,26], 0.5], [[16,20,23,26], 0.5],  // E7  E7

            // 跑动段 — 快速和弦切换（每0.25拍一个）
            [[21,24,28], 0.25], [[19,23,26], 0.25], [[17,21,24], 0.25], [[16,20,23], 0.25],
            [[21,24,28], 0.25], [[19,23,26], 0.25], [[17,21,24], 0.25], [[16,20,23], 0.25],
            [[21,24,28], 0.25], [[19,23,26], 0.25], [[17,21,24], 0.25], [[16,20,23], 0.25],
            [[21,24,28], 0.5],

            // B — 高八度和弦，音量全开！（用高一个八度的和弦增加明亮度）
            // Am高 = A4+C5+E5 = [33,36,40]
            // G高  = G4+B4+D5 = [31,35,38]
            // F高  = F4+A4+C5 = [29,33,36]
            // E高  = E4+G#4+B4= [28,32,35]
            [[33,36,40], 0.5], [[33,36,40], 0.5],
            [[31,35,38], 0.5], [[31,35,38], 0.5],

            [[29,33,36], 0.5], [[29,33,36], 0.5],
            [[28,32,35], 0.5], [[28,32,35], 0.5],

            // B后半 — 混合八度（低+高叠加感）
            [[21,24,28,33], 0.5], [[19,23,26,31], 0.5],
            [[17,21,24,29], 0.5], [[16,20,23,28], 0.5],
            [[21,24,28], 0.5],

            // A' — 回到中间音区
            [[21,24,28], 0.5], [[21,24,28], 0.5],
            [[19,23,26], 0.5], [[19,23,26], 0.5],
            [[17,21,24], 0.5], [[16,20,23], 0.5],

            // Outro
            [[21,24,28], 0.5], [[14,17,21], 0.5], [[21,24,28], 1.0],
        ],

        drums: [
            ['kick', 1.0], ['rest', 1.0],
            ['kick', 0.5], ['hh', 0.25], ['snare', 0.5], ['tom', 0.25],
            // A1 — 密集rock beat
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['snare', 0.25], ['tom', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['tom', 0.125], ['hh', 0.125],
            ['kick', 0.25], ['snare', 0.25], ['kick', 0.25], ['snare', 0.25],
            // A2
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['snare', 0.25], ['hh', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.08], ['kick', 0.25], ['snare', 0.25], ['hh', 0.08],
            ['kick', 0.25], ['hh', 0.08], ['snare', 0.25], ['hh', 0.08],
            ['kick', 0.25], ['hh', 0.08], ['kick', 0.25], ['snare', 0.25], ['tom', 0.12], ['hh', 0.08],
            ['kick', 0.25], ['snare', 0.25], ['kick', 0.25], ['snare', 0.25],
            // B — 最密! 双倍kick
            ['kick', 0.125], ['hh', 0.06], ['kick', 0.125], ['snare', 0.125], ['hh', 0.06],
            ['kick', 0.125], ['hh', 0.06], ['snare', 0.125], ['hh', 0.06],
            ['kick', 0.125], ['hh', 0.06], ['kick', 0.125], ['snare', 0.125], ['tom', 0.08], ['hh', 0.06],
            ['kick', 0.125], ['snare', 0.125], ['kick', 0.125], ['snare', 0.125],
            ['kick', 0.125], ['hh', 0.06], ['kick', 0.125], ['snare', 0.125], ['hh', 0.06],
            ['kick', 0.125], ['hh', 0.06], ['snare', 0.125], ['hh', 0.06],
            ['kick', 0.125], ['hh', 0.06], ['kick', 0.125], ['snare', 0.125], ['hh', 0.06],
            ['kick', 0.125], ['snare', 0.125], ['tom', 0.125], ['kick', 0.125], ['snare', 0.125],
            // A'
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['hh', 0.125], ['snare', 0.25], ['hh', 0.125],
            ['kick', 0.25], ['snare', 0.25], ['kick', 0.25], ['snare', 0.25],
            // Outro
            ['kick', 0.5], ['rest', 0.5],
            ['snare', 0.5], ['rest', 0.5],
            ['kick', 0.7], ['rest', 0.9],
        ],
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🏰 地下城 BGM — "暗影深处"
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Dm/F#小调, BPM 95, 阴暗压迫
    // ★HOOK: "La-Ti-Do~" 不安上行
    dungeon: {
        name: '🏰 地下城 · 暗影深处',
        bpm: 95,
        volume: 0.18,
        melodyVol: 0.12,
        bassVol: 0.12,
        bassStyle: 'long',
        harmonyVol: 0.04,
        dutyCycle: 0.25,

        melody: [
            // Intro (2小节) — 神秘引入
            [19, 0.5],   // G3
            [-1, 0.5],
            [22, 0.5], [24, 0.5],  // Bb3 C4
            [-1, 0.5],
            [19, 0.25], [24, 0.25], [27, 0.5], // G3 C4 D4
            [24, 0.75],                        // C4

            // A1 (4小节) — 阴沉主题
            [28, 0.25], [27, 0.25], [24, 0.5],     // E4 D4 C4
            [22, 0.25], [20, 0.25], [19, 0.5],      // Bb3 Ab3 G3
            [-1, 0.25], [17, 0.25], [19, 0.25], [15, 0.5], // F3 G3 Eb3
            [17, 0.5],                                // F3

            [17, 0.25], [19, 0.25], [20, 0.5],       // F3 G3 Ab3
            [22, 0.25], [24, 0.25], [27, 0.5],       // Bb3 C4 D4
            [28, 0.25], [27, 0.25], [24, 0.5],       // E4 D4 C4
            [22, 0.5], [20, 0.75],                     // Bb3 Ab3~

            // A2 (4小节) — 变体稍高
            [31, 0.25], [29, 0.25], [27, 0.5],       // G4 F4 D4
            [24, 0.25], [22, 0.25], [20, 0.5],       // C4 Bb3 Ab3
            [-1, 0.25], [19, 0.25], [22, 0.25], [19, 0.5], // G3 Bb3 G3
            [20, 0.5],                                 // Ab3

            [20, 0.25], [24, 0.25], [27, 0.5],         // Ab3 C4 D4
            [29, 0.25], [31, 0.25], [34, 0.5],         // F4 G4 Bb4
            [32, 0.25], [29, 0.25], [27, 0.5],          // Ab4 F4 D4
            [24, 0.75],                                  // C4

            // B (4小节) — 发展：不安上行
            [27, 0.25], [29, 0.25], [31, 0.25], [29, 0.2], // D4 F4 G4 F4
            [27, 0.3], [24, 0.25], [27, 0.45],           // D4 C4 D4
            [29, 0.25], [32, 0.25], [34, 0.35], [32, 0.2], // F4 Ab4 Bb4 Ab4
            [31, 0.35], [29, 0.25], [27, 0.55],          // G4 F4 D4

            [24, 0.25], [27, 0.25], [29, 0.25], [31, 0.25], // C4 D4 F4 G4
            [34, 0.3], [36, 0.25], [38, 0.5],             // Bb4 B4 D5!
            [36, 0.25], [34, 0.25], [31, 0.3],              // B4 Bb4 G4
            [29, 0.25], [27, 0.25], [24, 0.75],             // F4 D4 C4

            // A' (缩短)
            [28, 0.25], [27, 0.25], [24, 0.5],
            [22, 0.25], [20, 0.25], [19, 0.5],
            [24, 0.5], [27, 0.5], [24, 0.65],

            // Outro
            [20, 0.5], [19, 0.5], [15, 0.75],
        ],

        bass: [
            [-1, 2.0], [-1, 2.0],
            [0, 2.0], [0, 2.0],                    // E2
            [-3, 2.0], [-3, 2.0],                   // D2
            [-5, 2.0], [-5, 2.0],                   // C2
            [-8, 2.0], [-8, 2.0],                   // Ab1

            // A2
            [-12, 2.0],[-12, 2.0],                  // E1
            [-10, 2.0],[-10, 2.0],                  // F1
            [-8, 2.0], [-8, 2.0],                   // Ab1
            [-5, 2.0], [-5, 2.0],                   // C2

            // B — 开始运动
            [-8, 1.5], [-5, 0.5],                   // Ab → C
            [-3, 1.5], [-5, 0.5],                   // D → C
            [-8, 1.5], [-3, 0.5],                   // Ab → D
            [-5, 2.0],                               // C

            [-3, 1.5], [0, 0.5],                    // D → E
            [0, 1.5], [-3, 0.5],                    // E → D
            [-5, 1.5], [-3, 1.0],                  // C → D
            [-5, 0.5],

            // A'
            [0, 2.0], [-3, 2.0], [-5, 2.0], [-8, 1.5],

            // Outro
            [-8, 2.0], [-12, 2.0],
        ],

        harmony: [
            [-1, 2.0], [-1, 2.0],
            [19, 2.0], [24, 2.0],     // G3+C4
            [19, 2.0], [24, 2.0],
            [17, 2.0], [22, 2.0],     // F3+Bb3
            [15, 2.0], [20, 2.0],     // Eb3+Ab3
            [17, 2.0], [22, 2.0],

            // A2
            [15, 2.0], [19, 2.0],     // Eb3+G3
            [17, 2.0], [20, 2.0],
            [15, 2.0], [19, 2.0],
            [19, 2.0], [24, 2.0],

            // B
            [15, 1.5],[19, 0.5],
            [20, 1.5],[17, 0.5],
            [15, 1.5],[20, 0.5],
            [19, 2.0],

            [20, 1.5],[24, 0.5],
            [24, 1.5],[20, 0.5],
            [19, 1.5],[20, 1.0],
            [19, 0.5],

            // A'
            [19, 2.0], [24, 2.0],
            [17, 2.0], [22, 2.0],
            [15, 2.0], [19, 2.0],
            [15, 0.5],

            // Outro
            [15, 2.0], [12, 2.0],
        ],

        drums: [
            ['rest', 1.5], ['hh', 0.5],
            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.4], ['rest', 0.4],

            // A1 — 心跳
            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.3], ['rest', 1.3],
            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.3], ['tom', 0.3], ['rest', 0.8],

            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.3], ['rest', 1.3],
            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.4], ['snare', 0.3], ['rest', 0.7],

            // A2
            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.3], ['rest', 1.3],
            ['kick', 0.8], ['rest', 0.8],
            ['tom', 0.4], ['hh', 0.3], ['rest', 0.9],

            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.3], ['rest', 1.3],
            ['kick', 0.8], ['snare', 0.5],
            ['rest', 1.2],

            // B — 渐密
            ['kick', 0.6], ['hh', 0.2], ['rest', 0.8],
            ['kick', 0.6], ['hh', 0.2], ['rest', 0.8],
            ['kick', 0.6], ['hh', 0.2], ['tom', 0.2], ['rest', 0.6],
            ['kick', 0.6], ['snare', 0.4], ['hh', 0.2], ['rest', 0.6],

            ['kick', 0.5], ['hh', 0.15],['rest', 0.7],
            ['kick', 0.5], ['hh', 0.15],['snare', 0.3], ['rest', 0.7],
            ['kick', 0.5], ['hh', 0.15],['tom', 0.2], ['hh', 0.15],
            ['kick', 0.5], ['snare', 0.4], ['rest', 0.6],

            // A' — 回到稀疏
            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.3], ['rest', 1.3],
            ['kick', 0.8], ['rest', 0.8],
            ['hh', 0.4], ['rest', 1.2],

            // Outro
            ['kick', 0.7], ['rest', 0.9],
            ['hh', 0.4], ['rest', 1.4],
        ],
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎰 赌坊 BGM — "运筹帷幄"
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Em调布鲁斯味, BPM 148, 轻佻切分
    // ★HOOK: "Mi-Re-Do-Sol~" 跳跃闪亮
    casino: {
        name: '🎰 赌坊 · 运筹帷幄',
        bpm: 148,
        volume: 0.18,
        melodyVol: 0.13,
        bassVol: 0.12,
        bassStyle: 'bouncy',
        harmonyVol: 0.04,
        harmonyStyle: 'stabs',
        dutyCycle: 0.125,

        melody: [
            // Intro (2小节)
            [31, 0.25], [35, 0.25], [38, 0.375],    // G4 Bb4 D5
            [40, 0.25], [38, 0.1875], [35, 0.4375], // E5 D5 Bb4
            [33, 0.25], [31, 0.25], [28, 0.5],       // G4 G4 E4
            [-1, 0.125], [27, 0.25], [31, 0.5],     // D4 G4

            // A1 (4小节) — 俏皮问答
            [35, 0.25], [35, 0.125], [38, 0.375],   // Bb4 Bb4 D5 ★跳!
            [36, 0.1875], [33, 0.25], [31, 0.375],   // C5 G4 G4
            [29, 0.1875], [31, 0.1875], [35, 0.375], // F4 G4 Bb4
            [33, 0.1875], [31, 0.1875], [28, 0.5],   // G4 G4 E4

            [24, 0.25], [28, 0.1875], [31, 0.375],   // C4 E4 G4
            [33, 0.1875], [31, 0.1875], [29, 0.375], // G4 G4 F4
            [27, 0.1875], [24, 0.25], [22, 0.5],     // D4 C4 Bb3
            [20, 0.375], [19, 0.5],                    // Ab3 G3

            // A2 (4小节) — 更高更亮
            [38, 0.25], [38, 0.125], [42, 0.375],    // D5 D5 F5
            [43, 0.1875], [40, 0.25], [38, 0.375],   // G5 E5 D5
            [36, 0.1875], [38, 0.1875], [42, 0.375],  // C5 D5 F5
            [40, 0.1875], [38, 0.1875], [35, 0.5],    // E5 D5 Bb4

            [31, 0.25], [35, 0.1875], [38, 0.375],    // G4 Bb4 D5
            [40, 0.1875], [38, 0.1875], [36, 0.375],  // E5 D5 C5
            [33, 0.1875], [31, 0.1875], [29, 0.375],  // G4 G4 F4
            [27, 0.375], [31, 0.625],                  // D4 G4~

            // B (4小节) — 切分狂欢
            [-1, 0.0625], [42, 0.3125], [43, 0.25],   // 休止起拍! F5 G5
            [45, 0.375], [43, 0.1875], [40, 0.3125],   // A5 G5 E5
            [38, 0.1875], [40, 0.1875], [43, 0.375],   // D5 E5 G5
            [42, 0.1875], [38, 0.1875], [35, 0.5],     // F5 D5 Bb4

            [33, 0.125], [35, 0.125], [38, 0.125], [40, 0.125], // 上行
            [43, 0.1875], [42, 0.125], [38, 0.25],     // G5 F5 D5
            [35, 0.125], [33, 0.125], [31, 0.125], [29, 0.125], // 下行
            [28, 0.25], [31, 0.5625],                   // E4 G4

            // A' (简化)
            [35, 0.25], [35, 0.125], [38, 0.375],
            [36, 0.1875], [33, 0.25], [31, 0.375],
            [29, 0.1875], [31, 0.1875], [35, 0.3125],
            [33, 0.1875], [31, 0.1875], [28, 0.5625],

            // Outro
            [31, 0.375], [28, 0.375], [24, 0.5],
            [19, 1.0],
        ],

        bass: [
            [-1, 1.0], [0, 1.0],

            // A1: Em - C - G - Bb (i - VI - III - VII)
            [0, 0.125],[0, 0.125], [0, 0.125],[7, 0.125],  // E E B
            [-8, 0.125],[-8, 0.125], [-8, 0.125],[-3, 0.125],// C C G
            [-5, 0.125],[-5, 0.125], [-5, 0.125],[0, 0.125],  // G G E
            [-10, 0.125],[-10, 0.125], [-10, 0.125],[-5, 0.125],// Bb Bb G

            // 第二句
            [-8, 0.125],[-8, 0.125], [-8, 0.125],[-3, 0.125],
            [-5, 0.125],[-5, 0.125], [-5, 0.125],[-10, 0.125],
            [-12, 0.125],[-12, 0.125], [-12, 0.125],[-10, 0.125],
            [-12, 1.0],

            // A2
            [0, 0.125],[0, 0.125], [0, 0.125],[7, 0.125],
            [-8, 0.125],[-8, 0.125], [-8, 0.125],[-3, 0.125],
            [-5, 0.125],[-5, 0.125], [-5, 0.125],[0, 0.125],
            [-10, 0.125],[-10, 0.125], [-10, 0.125],[0, 0.125],
            [0, 1.0],

            // B — 超密16分!
            [0, 0.0625],[7, 0.0625],[0, 0.0625],[7, 0.0625],
            [-8, 0.0625],[-3, 0.0625],[-8, 0.0625],[-3, 0.0625],
            [-5, 0.0625],[0, 0.0625],[-5, 0.0625],[0, 0.0625],
            [-10, 0.0625],[-5, 0.0625],[-10, 0.0625],[-5, 0.0625],

            [0, 0.0625],[7, 0.0625],[-8, 0.0625],[-3, 0.0625],
            [-5, 0.0625],[0, 0.0625],[-10, 0.0625],[-12, 0.0625],
            [-10, 0.0625],[-5, 0.0625],[-8, 0.0625],[-3, 0.0625],
            [0, 0.6875],

            // A'
            [0, 0.125],[0, 0.125], [0, 0.125],[7, 0.125],
            [-8, 0.125],[-8, 0.125], [-8, 0.125],[-3, 0.125],
            [-5, 0.125],[0, 0.125], [0, 1.0],

            // Outro
            [0, 0.5], [-8, 0.5],
            [-12, 1.5],
        ],

        harmony: [
            [-1, 2.0],
            [31, 0.5], [35, 0.5],     // G+Bb = Gm
            [31, 0.5], [35, 0.5],
            [28, 0.5], [35, 0.5],     // E+Bb = Cm7
            [28, 0.5], [35, 0.5],
            [27, 0.5], [31, 0.5],     // D+G = G
            [27, 0.5], [31, 0.5],
            [24, 0.5], [28, 0.5],     // C+E = C
            [24, 0.5], [28, 0.5],

            // 第二句
            [28, 0.5], [35, 0.5],
            [28, 0.25],[27, 0.5],
            [27, 0.5], [24, 0.5],
            [27, 0.25],[24, 0.5],
            [20, 0.5], [24, 0.5],     // Ab+C = Ab
            [20, 1.0],

            // A2
            [31, 0.5], [35, 0.5],
            [31, 0.5], [35, 0.5],
            [28, 0.5], [35, 0.5],
            [27, 0.5], [31, 0.5],
            [24, 0.5], [28, 0.5],
            [24, 0.5], [31, 0.5],
            [31, 1.0],

            // B
            [35, 0.125],[31, 0.125], [35, 0.125],[28, 0.125],
            [28, 0.125],[27, 0.125], [27, 0.125],[24, 0.125],
            [24, 0.125],[20, 0.125], [20, 0.125],[24, 0.125],
            [24, 0.5], [28, 0.5],

            [31, 0.0625],[35, 0.0625],[28, 0.0625],[27, 0.0625],
            [27, 0.0625],[24, 0.0625],[20, 0.0625],[24, 0.0625],
            [28, 0.5], [31, 0.5],

            // A'
            [31, 0.5], [35, 0.5],
            [31, 0.5], [35, 0.5],
            [28, 0.5], [35, 0.5],
            [27, 0.5], [31, 0.5],
            [24, 0.75], [28, 0.75],

            // Outro
            [24, 0.5], [20, 0.5],
            [20, 1.0],
        ],

        drums: [
            ['rest', 0.8], ['hh', 0.4],
            ['kick', 0.375], ['hh', 0.1875], ['snare', 0.375], ['tom', 0.1875],

            // A1
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['snare', 0.25], ['tom', 0.1875], ['hh', 0.09375],

            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['tom', 0.09375], ['hh', 0.09375],
            ['kick', 0.25], ['snare', 0.25], ['hh', 0.25],

            // A2
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['snare', 0.25], ['hh', 0.25],

            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['tom', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.5], ['rest', 0.5],

            // B — 切分狂欢!
            ['rest', 0.03125], ['kick', 0.21875], ['hh', 0.09375],['snare', 0.21875], ['hh', 0.09375],
            ['kick', 0.21875], ['hh', 0.09375],['snare', 0.21875], ['hh', 0.09375],
            ['kick', 0.21875], ['hh', 0.09375],['snare', 0.21875], ['tom', 0.09375], ['hh', 0.09375],
            ['kick', 0.21875], ['snare', 0.21875], ['hh', 0.21875],

            ['kick', 0.125], ['hh', 0.03125],['kick', 0.125], ['snare', 0.125], ['hh', 0.03125],
            ['kick', 0.125], ['hh', 0.03125],['snare', 0.125], ['tom', 0.0625],
            ['kick', 0.125], ['snare', 0.125], ['kick', 0.125], ['snare', 0.125],
            ['kick', 0.375], ['rest', 0.375], ['kick', 0.375], ['rest', 0.375],

            // A'
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['hh', 0.09375],
            ['kick', 0.25], ['hh', 0.09375],['snare', 0.25], ['tom', 0.125],
            ['kick', 0.25], ['rest', 0.25], ['kick', 0.25], ['rest', 0.25],

            // Outro
            ['kick', 0.375], ['hh', 0.1875], ['snare', 0.375],
            ['kick', 0.625], ['rest', 0.625],
        ],
    },
};

window.ChiptuneBgmPlayer = ChiptuneBgmPlayer;
window.CHIP_SONGS = CHIP_SONGS;
window.CHIP_FREQ = CHIP_FREQ;
window.CHIP_NOTE_MAP = CHIP_NOTE_MAP;

// ChiptuneBgmPlayer 8bit 引擎已加载
