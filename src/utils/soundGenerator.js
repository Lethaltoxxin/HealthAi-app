/**
 * Sound Generator — Web Audio API ambient sound engine
 * Generates calming sounds programmatically: rain, waves, binaural beats, etc.
 */

class SoundGenerator {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.nodes = [];
        this.analyser = null;
        this.isPlaying = false;
        this._fadeTime = 1.5; // seconds for fade in/out
    }

    _init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0;

            // Analyser for visualizer
            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 256;
            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    getAnalyser() {
        return this.analyser;
    }

    // ────── Core Generators ──────

    _createNoise(type = 'white') {
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;

            if (type === 'white') {
                data[i] = white * 0.5;
            } else if (type === 'pink') {
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            } else if (type === 'brown') {
                data[i] = (b0 = (b0 + (0.02 * white)) / 1.02) * 3.5;
            }
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        return source;
    }

    _createOscillator(freq, type = 'sine', detune = 0) {
        const osc = this.ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        return osc;
    }

    _createFilter(type, freq, Q = 1) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = freq;
        filter.Q.value = Q;
        return filter;
    }

    _createLFO(freq, min, max, param) {
        const osc = this.ctx.createOscillator();
        osc.frequency.value = freq;
        const gain = this.ctx.createGain();
        gain.gain.value = (max - min) / 2;
        osc.connect(gain);
        gain.connect(param);
        param.value = (max + min) / 2;
        osc.start();
        return osc;
    }

    // ────── Sound Presets ──────

    _genRain() {
        // Filtered white noise with gentle modulation = rain
        const noise = this._createNoise('white');
        const bp = this._createFilter('bandpass', 800, 0.5);
        const lp = this._createFilter('lowpass', 3000);
        const gain = this.ctx.createGain();
        gain.gain.value = 0.35;

        // Subtle volume modulation for natural rain rhythm
        this._createLFO(0.15, 0.2, 0.45, gain.gain);

        noise.connect(bp);
        bp.connect(lp);
        lp.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
        this.nodes.push(noise);
    }

    _genOcean() {
        // Brown noise with slow LFO = ocean waves
        const noise = this._createNoise('brown');
        const lp = this._createFilter('lowpass', 600);
        const gain = this.ctx.createGain();
        gain.gain.value = 0.3;

        // Slow wave-like modulation
        this._createLFO(0.08, 0.05, 0.5, gain.gain);

        // Second layer: gentle hiss for foam
        const foam = this._createNoise('white');
        const foamFilter = this._createFilter('bandpass', 2500, 0.3);
        const foamGain = this.ctx.createGain();
        foamGain.gain.value = 0.06;
        this._createLFO(0.12, 0.01, 0.12, foamGain.gain);

        noise.connect(lp);
        lp.connect(gain);
        gain.connect(this.masterGain);
        noise.start();

        foam.connect(foamFilter);
        foamFilter.connect(foamGain);
        foamGain.connect(this.masterGain);
        foam.start();

        this.nodes.push(noise, foam);
    }

    _genBrownNoise() {
        const noise = this._createNoise('brown');
        const lp = this._createFilter('lowpass', 400);
        const gain = this.ctx.createGain();
        gain.gain.value = 0.4;

        noise.connect(lp);
        lp.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
        this.nodes.push(noise);
    }

    _genChimes() {
        // Repeating gentle chime tones
        const frequencies = [523, 659, 784, 1047, 1319];
        const scheduleChime = () => {
            if (!this.isPlaying) return;
            const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
            const osc = this._createOscillator(freq, 'sine');
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 3);

            const next = 1500 + Math.random() * 3000;
            this._chimeTimer = setTimeout(scheduleChime, next);
        };
        scheduleChime();
    }

    _genDrone() {
        // Warm evolving drone — layered detuned oscillators
        const freqs = [110, 165, 220];
        freqs.forEach(f => {
            const osc1 = this._createOscillator(f, 'sine');
            const osc2 = this._createOscillator(f, 'sine', 5);
            const gain = this.ctx.createGain();
            gain.gain.value = 0.06;
            this._createLFO(0.05 + Math.random() * 0.1, 0.02, 0.09, gain.gain);
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.masterGain);
            osc1.start();
            osc2.start();
            this.nodes.push(osc1, osc2);
        });
    }

    _genBirds() {
        // Chirpy oscillators scheduled randomly
        const chirp = () => {
            if (!this.isPlaying) return;
            const freq = 2000 + Math.random() * 2500;
            const osc = this._createOscillator(freq, 'sine');
            const gain = this.ctx.createGain();
            const t = this.ctx.currentTime;

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
            osc.frequency.linearRampToValueAtTime(freq * 1.3, t + 0.05);
            osc.frequency.linearRampToValueAtTime(freq * 0.8, t + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t);
            osc.stop(t + 0.2);

            this._birdTimer = setTimeout(chirp, 800 + Math.random() * 4000);
        };
        chirp();
    }

    _genBreathing() {
        // Slow in/out noise with rhythm for guided breathing
        const noise = this._createNoise('pink');
        const lp = this._createFilter('lowpass', 500);
        const gain = this.ctx.createGain();

        // 4s in, 4s out = 0.125 Hz cycle
        this._createLFO(0.125, 0.0, 0.3, gain.gain);

        noise.connect(lp);
        lp.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
        this.nodes.push(noise);

        // Add subtle tone
        const osc = this._createOscillator(174, 'sine');
        const oscGain = this.ctx.createGain();
        this._createLFO(0.125, 0.0, 0.05, oscGain.gain);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();
        this.nodes.push(osc);
    }

    _genStream() {
        // Babbling brook: filtered noise with fast modulation
        const noise = this._createNoise('white');
        const bp = this._createFilter('bandpass', 1200, 0.8);
        const gain = this.ctx.createGain();
        gain.gain.value = 0.15;
        this._createLFO(3, 0.05, 0.25, gain.gain);

        noise.connect(bp);
        bp.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
        this.nodes.push(noise);
    }

    _genBowls() {
        // Tibetan singing bowls — rich harmonics
        const frequencies = [174, 285, 396, 528];
        const scheduleBowl = () => {
            if (!this.isPlaying) return;
            const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

            [1, 2.01, 3.03, 4.05].forEach((harmonic, i) => {
                const osc = this._createOscillator(freq * harmonic, 'sine');
                const gain = this.ctx.createGain();
                const vol = 0.08 / (i + 1);
                gain.gain.setValueAtTime(0, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 6);
                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                osc.stop(this.ctx.currentTime + 7);
            });

            this._bowlTimer = setTimeout(scheduleBowl, 4000 + Math.random() * 5000);
        };
        scheduleBowl();
    }

    _genLofi() {
        // Lo-fi beats: simple kick-hat rhythm with warm pad
        const kick = () => {
            if (!this.isPlaying) return;
            const osc = this._createOscillator(60, 'sine');
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
            osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.4);
        };

        const hat = () => {
            if (!this.isPlaying) return;
            const noise = this._createNoise('white');
            const hp = this._createFilter('highpass', 7000);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
            noise.connect(hp);
            hp.connect(gain);
            gain.connect(this.masterGain);
            noise.start();
            noise.stop(this.ctx.currentTime + 0.06);
        };

        // Warm pad layer
        const pad = this._createOscillator(220, 'sine', 3);
        const padGain = this.ctx.createGain();
        padGain.gain.value = 0.04;
        pad.connect(padGain);
        padGain.connect(this.masterGain);
        pad.start();
        this.nodes.push(pad);

        // BPM 70 = 857ms per beat
        const bpm = 70;
        const beatMs = 60000 / bpm;
        let beat = 0;

        const loop = () => {
            if (!this.isPlaying) return;
            if (beat % 4 === 0) kick();
            if (beat % 2 === 1) hat();
            beat++;
            this._lofiTimer = setTimeout(loop, beatMs);
        };
        loop();
    }

    _genBinaural(carrierFreq = 200, beatFreq = 40) {
        // Binaural beat: two slightly different frequencies, one per ear
        const merger = this.ctx.createChannelMerger(2);

        const oscL = this._createOscillator(carrierFreq, 'sine');
        const oscR = this._createOscillator(carrierFreq + beatFreq, 'sine');
        const gainL = this.ctx.createGain();
        const gainR = this.ctx.createGain();
        gainL.gain.value = 0.15;
        gainR.gain.value = 0.15;

        oscL.connect(gainL);
        oscR.connect(gainR);
        gainL.connect(merger, 0, 0);
        gainR.connect(merger, 0, 1);
        merger.connect(this.masterGain);

        oscL.start();
        oscR.start();
        this.nodes.push(oscL, oscR);
    }

    _genWhiteNoise() {
        const noise = this._createNoise('white');
        const lp = this._createFilter('lowpass', 8000);
        const gain = this.ctx.createGain();
        gain.gain.value = 0.15;

        noise.connect(lp);
        lp.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
        this.nodes.push(noise);
    }

    // ────── Public API ──────

    play(soundType, volume = 0.7) {
        this._init();
        this._stopImmediate(); // Clean previous instantly
        this.isPlaying = true;

        const generators = {
            rain: () => this._genRain(),
            ocean: () => this._genOcean(),
            brown_noise: () => this._genBrownNoise(),
            chimes: () => this._genChimes(),
            drone: () => this._genDrone(),
            birds: () => this._genBirds(),
            breathing: () => this._genBreathing(),
            stream: () => this._genStream(),
            bowls: () => this._genBowls(),
            lofi: () => this._genLofi(),
            binaural_40: () => this._genBinaural(200, 40),
            white_noise: () => this._genWhiteNoise(),
        };

        const gen = generators[soundType];
        if (gen) gen();

        // Fade in
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + this._fadeTime);
    }

    // Immediate cleanup — used by play() to kill old nodes before creating new ones
    _stopImmediate() {
        this.isPlaying = false;
        clearTimeout(this._chimeTimer);
        clearTimeout(this._birdTimer);
        clearTimeout(this._bowlTimer);
        clearTimeout(this._lofiTimer);
        clearTimeout(this._stopTimeout);

        // Stop all tracked nodes immediately
        this.nodes.forEach(n => {
            try { n.stop(); } catch (e) { /* already stopped */ }
            try { n.disconnect(); } catch (e) { /* already disconnected */ }
        });
        this.nodes = [];

        if (this.masterGain && this.ctx) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
    }

    stop() {
        this.isPlaying = false;
        clearTimeout(this._chimeTimer);
        clearTimeout(this._birdTimer);
        clearTimeout(this._bowlTimer);
        clearTimeout(this._lofiTimer);
        clearTimeout(this._stopTimeout);

        if (this.masterGain && this.ctx) {
            this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
            this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
        }

        // Snapshot nodes so new play() calls don't get killed
        const oldNodes = [...this.nodes];
        this.nodes = [];

        this._stopTimeout = setTimeout(() => {
            oldNodes.forEach(n => {
                try { n.stop(); } catch (e) { /* already stopped */ }
                try { n.disconnect(); } catch (e) { /* already disconnected */ }
            });
        }, 400);
    }

    setVolume(vol) {
        if (this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
        }
    }

    destroy() {
        this.stop();
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
    }
}

// Singleton
const soundGenerator = new SoundGenerator();
export default soundGenerator;
