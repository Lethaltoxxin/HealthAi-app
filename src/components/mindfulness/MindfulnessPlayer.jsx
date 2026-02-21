import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioVisualizer from './AudioVisualizer';
import soundGenerator from '../../utils/soundGenerator';
import styles from './MindfulnessPlayer.module.css';

export default function MindfulnessPlayer({ track, tracks, onClose, onTrackChange }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const timerRef = useRef(null);
    const duration = track.durationSec;

    // Start/stop sound
    const togglePlay = useCallback(() => {
        if (isPlaying) {
            soundGenerator.stop();
            clearInterval(timerRef.current);
            setIsPlaying(false);
        } else {
            soundGenerator.play(track.sound, isMuted ? 0 : volume);
            setIsPlaying(true);
            timerRef.current = setInterval(() => {
                setElapsed(prev => {
                    if (prev >= duration) {
                        soundGenerator.stop();
                        clearInterval(timerRef.current);
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
    }, [isPlaying, track.sound, volume, isMuted, duration]);

    // Reset on track change
    useEffect(() => {
        setElapsed(0);
        setIsPlaying(false);
        soundGenerator.stop();
        clearInterval(timerRef.current);
    }, [track.id]);

    // Cleanup
    useEffect(() => {
        return () => {
            soundGenerator.stop();
            clearInterval(timerRef.current);
        };
    }, []);

    // Volume
    useEffect(() => {
        soundGenerator.setVolume(isMuted ? 0 : volume);
    }, [volume, isMuted]);

    const handleVolumeToggle = () => setIsMuted(!isMuted);

    const handleSkip = (dir) => {
        const idx = tracks.findIndex(t => t.id === track.id);
        const nextIdx = dir === 'next'
            ? (idx + 1) % tracks.length
            : (idx - 1 + tracks.length) % tracks.length;
        soundGenerator.stop();
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setElapsed(0);
        onTrackChange(tracks[nextIdx]);
    };

    // Seek
    const progressBarRef = useRef(null);
    const handleSeek = (e) => {
        const bar = progressBarRef.current;
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        setElapsed(Math.floor(ratio * duration));
    };

    const fmt = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? elapsed / duration : 0;
    const circumference = 2 * Math.PI * 120;
    const dashOffset = circumference * (1 - progress);

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Animated background gradient */}
                <div
                    className={styles.bgGradient}
                    style={{
                        background: `radial-gradient(ellipse at 50% 30%, ${track.color}40 0%, ${track.color}10 40%, #0a0a1a 100%)`
                    }}
                />

                {/* Floating particles */}
                <div className={styles.particles}>
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.particle}
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 8}s`,
                                animationDuration: `${6 + Math.random() * 8}s`,
                                opacity: 0.2 + Math.random() * 0.3,
                                width: 2 + Math.random() * 4,
                                height: 2 + Math.random() * 4,
                            }}
                        />
                    ))}
                </div>

                {/* Header */}
                <div className={styles.playerHeader}>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                    <div className={styles.headerTitle}>
                        <span className={styles.nowPlaying}>Now Playing</span>
                    </div>
                    <div style={{ width: 40 }} />
                </div>

                {/* Center: Visualizer + Progress Ring */}
                <div className={styles.center}>
                    <div className={styles.visualizerWrap}>
                        <svg className={styles.progressRing} viewBox="0 0 260 260">
                            <circle
                                cx="130" cy="130" r="120"
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="4"
                            />
                            <circle
                                cx="130" cy="130" r="120"
                                fill="none"
                                stroke={track.accent || '#14B8A6'}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                transform="rotate(-90 130 130)"
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>

                        <AudioVisualizer
                            analyser={soundGenerator.getAnalyser()}
                            color={track.accent || '#14B8A6'}
                            isPlaying={isPlaying}
                        />
                    </div>
                </div>

                {/* Track Info */}
                <div className={styles.trackInfo}>
                    <h2 className={styles.trackTitle}>{track.title}</h2>
                    <p className={styles.trackCategory}>{track.category}</p>
                </div>

                {/* Timer / Seekable Progress Bar */}
                <div className={styles.timer}>
                    <span>{fmt(elapsed)}</span>
                    <div
                        className={styles.progressBar}
                        ref={progressBarRef}
                        onClick={handleSeek}
                        style={{ cursor: 'pointer' }}
                    >
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress * 100}%`, background: track.accent || '#14B8A6' }}
                        />
                        <div
                            className={styles.seekThumb}
                            style={{ left: `${progress * 100}%`, background: track.accent || '#14B8A6' }}
                        />
                    </div>
                    <span>{fmt(duration)}</span>
                </div>

                {/* Controls */}
                <div className={styles.controls}>
                    <button onClick={handleVolumeToggle} className={styles.controlBtn}>
                        {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>

                    <button onClick={() => handleSkip('prev')} className={styles.controlBtn}>
                        <SkipBack size={24} />
                    </button>

                    <motion.button
                        className={styles.playPauseBtn}
                        onClick={togglePlay}
                        whileTap={{ scale: 0.9 }}
                        style={{ background: track.accent || '#14B8A6' }}
                    >
                        {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" style={{ marginLeft: 3 }} />}
                    </motion.button>

                    <button onClick={() => handleSkip('next')} className={styles.controlBtn}>
                        <SkipForward size={24} />
                    </button>

                    <div className={styles.volumeWrap}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                                setVolume(parseFloat(e.target.value));
                                setIsMuted(false);
                            }}
                            className={styles.volumeSlider}
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
