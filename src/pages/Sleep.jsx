import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, ArrowLeft, Play, Pause, Clock, Star, ChevronRight, Volume2, Wind, CloudRain, Waves, Music, Headphones, Sparkles, TrendingUp, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sleep.module.css';

/* ─── Sleep stages data ─── */
const stages = [
    { label: 'Deep', pct: 22, color: '#7c3aed' },
    { label: 'REM', pct: 18, color: '#a78bfa' },
    { label: 'Light', pct: 48, color: '#c4b5fd' },
    { label: 'Awake', pct: 12, color: '#e9d5ff' },
];

/* ─── Sleepcast data ─── */
const sleepcasts = [
    { id: 's1', title: 'Submarine Slumber', duration: '45 min', description: 'Drift through bioluminescent depths', emoji: '🌊', accent: '#06b6d4' },
    { id: 's2', title: 'Coastal Campground', duration: '40 min', description: 'Campfire crackles meet ocean waves', emoji: '🏕️', accent: '#f59e0b' },
    { id: 's3', title: 'Rainforest Dreams', duration: '50 min', description: 'Journey through a misty tropical canopy', emoji: '🌿', accent: '#10b981' },
    { id: 's4', title: 'Northern Lights', duration: '45 min', description: 'Watch the aurora from a cozy cabin', emoji: '🌌', accent: '#8b5cf6' },
    { id: 's5', title: 'Mountain Lodge', duration: '35 min', description: 'Snowfall outside, warmth within', emoji: '🏔️', accent: '#64748b' },
];

const windDowns = [
    { id: 'w1', title: 'Body Scan', duration: '10 min', icon: Brain, accent: '#a78bfa' },
    { id: 'w2', title: 'Deep Breathing', duration: '5 min', icon: Wind, accent: '#67e8f9' },
    { id: 'w3', title: 'Gratitude Practice', duration: '8 min', icon: Sparkles, accent: '#fbbf24' },
    { id: 'w4', title: 'Progressive Relaxation', duration: '12 min', icon: Moon, accent: '#c4b5fd' },
    { id: 'w5', title: 'Visualization', duration: '10 min', icon: Star, accent: '#f9a8d4' },
];

const sleepSounds = [
    { id: 'snd1', title: 'Rain on Leaves', icon: CloudRain, accent: '#67e8f9', duration: '∞', audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Rain_Sounds.ogg' },
    { id: 'snd2', title: 'Ocean Waves', icon: Waves, accent: '#06b6d4', duration: '∞', audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Waves_on_the_beach.ogg' },
    { id: 'snd3', title: 'Night Crickets', icon: Volume2, accent: '#10b981', duration: '∞', audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Crickets_at_night.ogg' },
    { id: 'snd4', title: 'Mountain Wind', icon: Wind, accent: '#a78bfa', duration: '∞', audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Wind.ogg' },
    { id: 'snd5', title: 'Fireplace', icon: Volume2, accent: '#f59e0b', duration: '∞', audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Campfire.ogg' },
    { id: 'snd6', title: 'Wind Chimes', icon: Wind, accent: '#c4b5fd', duration: '∞', audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Wind_chimes.ogg' },
];

const sleepMusic = [
    { id: 'mus1', title: 'Lunar Lullaby', duration: '30 min', accent: '#8b5cf6' },
    { id: 'mus2', title: 'Starlight Drift', duration: '25 min', accent: '#6366f1' },
    { id: 'mus3', title: 'Midnight Piano', duration: '35 min', accent: '#a78bfa' },
    { id: 'mus4', title: 'Ambient Nocturne', duration: '40 min', accent: '#7c3aed' },
];

const sleepTips = [
    { title: 'Keep your room at 65-68°F', icon: '🌡️', desc: 'Cool temperatures promote deeper sleep stages.' },
    { title: 'No screens 30 min before bed', icon: '📱', desc: 'Blue light suppresses melatonin production.' },
    { title: 'Consistent bedtime routine', icon: '🕐', desc: 'Go to bed and wake up at the same time daily.' },
    { title: 'Limit caffeine after 2 PM', icon: '☕', desc: 'Caffeine has a half-life of 5-6 hours.' },
];

export default function Sleep() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [playingSoundId, setPlayingSoundId] = useState(null);
    const audioRef = useRef(null);

    const score = 76;
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;

    const toggleSound = (soundId, url) => {
        if (!url) return;
        if (playingSoundId === soundId) {
            audioRef.current.pause();
            setPlayingSoundId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                setPlayingSoundId(soundId);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'sleepcasts', label: 'Sleepcasts' },
        { id: 'sounds', label: 'Sounds' },
        { id: 'tips', label: 'Tips' },
    ];

    return (
        <div className={styles.sleepPage}>
            <audio ref={audioRef} loop />
            {/* ─── Hero Zone ─── */}
            <div className={styles.heroZone}>
                <div className={styles.stars} />
                <div className={styles.bokeh1} />
                <div className={styles.bokeh2} />
                <div className={styles.bokeh3} />

                <div className={styles.topBar}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} color="rgba(255,255,255,0.8)" />
                    </button>
                    <h1 className={styles.pageTitle}>Sleep</h1>
                    <span className={styles.dateLabel}>Last night</span>
                </div>

                {/* Sleep Score Ring */}
                <div className={styles.heroContent}>
                    <motion.div className={styles.scoreRing} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <div className={styles.scoreGlow} />
                        <svg viewBox="0 0 120 120" width="130" height="130">
                            <circle cx="60" cy="60" r="52" className={styles.ringTrack} />
                            <motion.circle
                                cx="60" cy="60" r="52"
                                className={styles.ringFill}
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                transform="rotate(-90 60 60)"
                            />
                        </svg>
                        <div className={styles.ringCenter}>
                            <span className={styles.ringScore}>{score}</span>
                            <span className={styles.ringLabel}>Sleep Score</span>
                        </div>
                    </motion.div>

                    <div className={styles.heroStats}>
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatVal}>7h 12m</span>
                            <span className={styles.heroStatLabel}>Total Sleep</span>
                        </div>
                        <div className={styles.heroDivider} />
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatVal}>58 ms</span>
                            <span className={styles.heroStatLabel}>HRV</span>
                        </div>
                        <div className={styles.heroDivider} />
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatVal}>52 bpm</span>
                            <span className={styles.heroStatLabel}>Resting HR</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className={`${styles.tabRow} hide-scrollbar`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── Content Zone ─── */}
            <div className={styles.contentZone}>
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={styles.tabContent}>
                            {/* Sleep Stages */}
                            <section className={styles.section}>
                                <span className={styles.sectionLabel}>SLEEP STAGES</span>
                                <div className={styles.stagesCard}>
                                    <div className={styles.timeAxis}>
                                        <span>10 PM</span><span>12 AM</span><span>2 AM</span><span>4 AM</span><span>6 AM</span>
                                    </div>
                                    <div className={styles.stageBars}>
                                        {stages.map((s) => (
                                            <motion.div
                                                key={s.label}
                                                className={styles.stageBar}
                                                style={{ background: s.color }}
                                                initial={{ flex: 0 }}
                                                animate={{ flex: s.pct }}
                                                transition={{ duration: 0.8, delay: 0.2 }}
                                            />
                                        ))}
                                    </div>
                                    <div className={styles.legend}>
                                        {stages.map((s) => (
                                            <span key={s.label} className={styles.legendItem}>
                                                <span className={styles.legendDot} style={{ background: s.color }} />
                                                {s.label} {s.pct}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Featured Sleepcast */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionLabel}>TONIGHT'S PICK</span>
                                    <Sparkles size={14} className={styles.sectionIcon} />
                                </div>
                                <motion.div className={styles.featuredCast} whileTap={{ scale: 0.98 }}>
                                    <div className={styles.featuredCastBg} />
                                    <div className={styles.featuredCastContent}>
                                        <span className={styles.featuredCastEmoji}>🌊</span>
                                        <div className={styles.featuredCastBadge}>SLEEPCAST</div>
                                        <h3 className={styles.featuredCastTitle}>Submarine Slumber</h3>
                                        <p className={styles.featuredCastDesc}>Drift off aboard a quiet submarine gliding through bioluminescent ocean depths...</p>
                                        <div className={styles.featuredCastMeta}>
                                            <Clock size={12} /> 45 min
                                            <button className={styles.playBtnLg}>
                                                <Play size={14} fill="white" /> Play
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </section>

                            {/* Wind Down Series */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionLabel}>WIND DOWN</span>
                                    <button className={styles.seeAllBtn} onClick={() => setActiveTab('sleepcasts')}>See all <ChevronRight size={14} /></button>
                                </div>
                                <div className={`${styles.carouselRow} hide-scrollbar`}>
                                    {windDowns.map((item, i) => {
                                        const IconComp = item.icon;
                                        return (
                                            <motion.div
                                                key={item.id}
                                                className={styles.windDownCard}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                whileTap={{ scale: 0.96 }}
                                            >
                                                <div className={styles.windDownIcon} style={{ background: `${item.accent}20`, color: item.accent }}>
                                                    <IconComp size={20} />
                                                </div>
                                                <span className={styles.windDownTitle}>{item.title}</span>
                                                <span className={styles.windDownDuration}>{item.duration}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Sleep Sounds Preview */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionLabel}>SLEEP SOUNDS</span>
                                    <button className={styles.seeAllBtn} onClick={() => setActiveTab('sounds')}>See all <ChevronRight size={14} /></button>
                                </div>
                                <div className={styles.soundsGrid}>
                                    {sleepSounds.slice(0, 4).map((sound, i) => {
                                        const SoundIcon = sound.icon;
                                        return (
                                            <motion.div
                                                key={sound.id}
                                                className={styles.soundCard}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className={styles.soundIconWrap} style={{ background: `${sound.accent}15`, color: sound.accent }}>
                                                    <SoundIcon size={18} />
                                                </div>
                                                <span className={styles.soundTitle}>{sound.title}</span>
                                                <button
                                                    className={styles.soundPlayBtn}
                                                    style={{ background: `${sound.accent}20`, color: sound.accent }}
                                                    onClick={(e) => { e.stopPropagation(); toggleSound(sound.id, sound.audioUrl); }}
                                                >
                                                    {playingSoundId === sound.id ? <Pause size={10} fill={sound.accent} /> : <Play size={10} fill={sound.accent} />}
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Insights */}
                            <section className={styles.section}>
                                <span className={styles.sectionLabel}>INSIGHTS</span>
                                <div className={styles.insightCard}>
                                    <div className={styles.insightAccent} style={{ background: '#a78bfa' }} />
                                    <div className={styles.insightContent}>
                                        <span className={styles.insightTitle}>
                                            <TrendingUp size={14} style={{ color: '#10b981' }} /> Deep sleep improved +18%
                                        </span>
                                        <span className={styles.insightDesc}>Your consistent bedtime routine is showing results. Deep sleep increased by 22 minutes.</span>
                                    </div>
                                </div>
                                <div className={styles.insightCard}>
                                    <div className={styles.insightAccent} style={{ background: '#f59e0b' }} />
                                    <div className={styles.insightContent}>
                                        <span className={styles.insightTitle}>⚠️ Late screen time detected</span>
                                        <span className={styles.insightDesc}>Your device was active 20 minutes before sleep. Consider enabling Night mode earlier.</span>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'sleepcasts' && (
                        <motion.div key="sleepcasts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={styles.tabContent}>
                            <section className={styles.section}>
                                <span className={styles.sectionLabel}>SLEEPCASTS</span>
                                <p className={styles.sectionDesc}>Bedtime stories for adults. Fall asleep to soothing narration and ambient soundscapes.</p>
                                <div className={styles.sleepcastList}>
                                    {sleepcasts.map((cast, i) => (
                                        <motion.div
                                            key={cast.id}
                                            className={styles.sleepcastItem}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={styles.sleepcastEmoji} style={{ background: `${cast.accent}15` }}>{cast.emoji}</div>
                                            <div className={styles.sleepcastInfo}>
                                                <span className={styles.sleepcastTitle}>{cast.title}</span>
                                                <span className={styles.sleepcastDesc}>{cast.description}</span>
                                                <div className={styles.sleepcastMeta}>
                                                    <Clock size={11} /> {cast.duration}
                                                    <Headphones size={11} style={{ marginLeft: 8 }} /> Sleepcast
                                                </div>
                                            </div>
                                            <button className={styles.sleepcastPlayBtn} style={{ background: cast.accent }}>
                                                <Play size={14} fill="white" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            <section className={styles.section}>
                                <span className={styles.sectionLabel}>WIND DOWN EXERCISES</span>
                                <div className={styles.sleepcastList}>
                                    {windDowns.map((item, i) => {
                                        const IconComp = item.icon;
                                        return (
                                            <motion.div
                                                key={item.id}
                                                className={styles.sleepcastItem}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={styles.sleepcastEmoji} style={{ background: `${item.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconComp size={22} style={{ color: item.accent }} />
                                                </div>
                                                <div className={styles.sleepcastInfo}>
                                                    <span className={styles.sleepcastTitle}>{item.title}</span>
                                                    <div className={styles.sleepcastMeta}>
                                                        <Clock size={11} /> {item.duration}
                                                        <Wind size={11} style={{ marginLeft: 8 }} /> Guided
                                                    </div>
                                                </div>
                                                <button className={styles.sleepcastPlayBtn} style={{ background: item.accent }}>
                                                    <Play size={14} fill="white" />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className={styles.section}>
                                <span className={styles.sectionLabel}>SLEEP MUSIC</span>
                                <div className={`${styles.carouselRow} hide-scrollbar`}>
                                    {sleepMusic.map((track, i) => (
                                        <motion.div
                                            key={track.id}
                                            className={styles.musicCard}
                                            style={{ background: `linear-gradient(135deg, ${track.accent}30, ${track.accent}10)` }}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            whileTap={{ scale: 0.96 }}
                                        >
                                            <Music size={24} style={{ color: track.accent }} />
                                            <span className={styles.musicTitle}>{track.title}</span>
                                            <span className={styles.musicDuration}>{track.duration}</span>
                                            <button className={styles.musicPlayBtn} style={{ background: track.accent }}>
                                                <Play size={10} fill="white" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'sounds' && (
                        <motion.div key="sounds" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={styles.tabContent}>
                            <section className={styles.section}>
                                <span className={styles.sectionLabel}>ALL SLEEP SOUNDS</span>
                                <p className={styles.sectionDesc}>Natural ambient sounds to create your perfect sleep environment. Mix and match.</p>
                                <div className={styles.soundsFullGrid}>
                                    {sleepSounds.map((sound, i) => {
                                        const SoundIcon = sound.icon;
                                        return (
                                            <motion.div
                                                key={sound.id}
                                                className={styles.soundFullCard}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.06 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className={styles.soundFullIcon} style={{ background: `${sound.accent}15`, color: sound.accent }}>
                                                    <SoundIcon size={28} />
                                                </div>
                                                <span className={styles.soundFullTitle}>{sound.title}</span>
                                                <button
                                                    className={styles.soundFullPlay}
                                                    style={{ background: sound.accent }}
                                                    onClick={(e) => { e.stopPropagation(); toggleSound(sound.id, sound.audioUrl); }}
                                                >
                                                    {playingSoundId === sound.id ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'tips' && (
                        <motion.div key="tips" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className={styles.tabContent}>
                            <section className={styles.section}>
                                <span className={styles.sectionLabel}>SLEEP TIPS</span>
                                <p className={styles.sectionDesc}>Science-backed strategies to improve your sleep quality.</p>
                                <div className={styles.tipsList}>
                                    {sleepTips.map((tip, i) => (
                                        <motion.div
                                            key={i}
                                            className={styles.tipCard}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <span className={styles.tipEmoji}>{tip.icon}</span>
                                            <div className={styles.tipContent}>
                                                <span className={styles.tipTitle}>{tip.title}</span>
                                                <span className={styles.tipDesc}>{tip.desc}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
