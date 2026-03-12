import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Moon, Heart, Brain, Zap, Play, ChevronRight, Sparkles, Volume2, Wind, Sun, CloudRain, Dumbbell, Apple, Flame, Target, BookOpen, Clock, Star, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Explore.module.css';

/* ─── Featured content for each category ─── */
const featuredContent = {
    sleep: {
        title: 'Sleep',
        subtitle: 'Wind down & rest deeply',
        gradient: 'linear-gradient(135deg, #1A0A3C 0%, #2D1B69 100%)',
        accentColor: '#a78bfa',
        icon: Moon,
        featured: {
            title: 'Submarine Slumber',
            type: 'SLEEPCAST',
            duration: '45 min',
            description: 'Drift off aboard a quiet submarine gliding through bioluminescent depths.',
        },
        quickLinks: [
            { label: 'Sleepcasts', icon: Headphones, count: '40+' },
            { label: 'Wind Down', icon: Wind, count: '15' },
            { label: 'Sleep Sounds', icon: Volume2, count: '30+' },
            { label: 'Sleep Music', icon: Play, count: '20+' },
        ],
        stats: { label: 'Sleep Score', value: '76', unit: '/100' },
        path: '/sleep',
    },
    workout: {
        title: 'Workout',
        subtitle: 'Build strength & endurance',
        gradient: 'linear-gradient(135deg, #FF7E67 0%, #E63946 100%)',
        accentColor: '#FFE4E1',
        icon: Dumbbell,
        featured: {
            title: '30-Day Fighter Program',
            type: 'PROGRAM',
            duration: '30 Days',
            description: 'Combat-inspired bodyweight routines designed for explosive power and agility.',
        },
        quickLinks: [
            { label: 'HIIT Routines', icon: Zap, count: '15' },
            { label: 'Strength', icon: Target, count: '24' },
            { label: 'No Equipment', icon: Flame, count: '40+' },
            { label: 'Challenges', icon: Trophy, count: '10' },
        ],
        stats: { label: 'Active Min', value: '45', unit: 'today' },
        path: '/workout',
    },
    recovery: {
        title: 'Recovery',
        subtitle: 'Restore & rebuild',
        gradient: 'linear-gradient(135deg, #00E5C0 0%, #00B396 100%)',
        accentColor: '#1A0A3C',
        icon: Zap,
        featured: {
            title: 'Active Recovery Flow',
            type: 'PROGRAM',
            duration: '15 min',
            description: 'Light movement sequence designed to accelerate muscle recovery and reduce soreness.',
        },
        quickLinks: [
            { label: 'Stretching', icon: Dumbbell, count: '20+' },
            { label: 'Foam Roll', icon: Zap, count: '12' },
            { label: 'Mobility', icon: Wind, count: '18' },
            { label: 'Breathing', icon: CloudRain, count: '10' },
        ],
        stats: { label: 'HRV', value: '58', unit: 'ms' },
        path: '/progress',
    },
    mindset: {
        title: 'Mindset',
        subtitle: 'Strengthen your mind',
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
        accentColor: '#c4b5fd',
        icon: Brain,
        featured: {
            title: 'Daily Calm',
            type: 'MEDITATION',
            duration: '10 min',
            description: 'Start your day with intention through a guided mindfulness meditation.',
        },
        quickLinks: [
            { label: 'Meditate', icon: Sun, count: '30+' },
            { label: 'Focus', icon: Target, count: '15' },
            { label: 'Breathwork', icon: Wind, count: '12' },
            { label: 'Stress', icon: Brain, count: '10' },
        ],
        stats: { label: 'Mindful Min', value: '142', unit: 'this week' },
        path: '/mindfulness',
    },
};

const challenges = [
    { id: 1, title: '7-Day Sleep Challenge', progress: 57, participants: '2.4k', color: '#8B5CF6', emoji: '🌙' },
    { id: 2, title: 'Hydration Streak', progress: 80, participants: '1.8k', color: '#06B6D4', emoji: '💧' },
    { id: 3, title: 'Mindfulness Sprint', progress: 32, participants: '960', color: '#10B981', emoji: '🧘' },
    { id: 4, title: '10K Steps Daily', progress: 65, participants: '3.1k', color: '#F59E0B', emoji: '🏃' },
];

const trendingTopics = [
    { label: 'Sleep Hygiene', icon: Moon, color: '#8B5CF6' },
    { label: 'HIIT Recovery', icon: Zap, color: '#06B6D4' },
    { label: 'Stress Relief', icon: Brain, color: '#7C3AED' },
    { label: 'Core Strength', icon: Dumbbell, color: '#DC2626' },
    { label: 'Breathwork', icon: Wind, color: '#D97706' },
];

export default function Explore() {
    const navigate = useNavigate();
    const [activeChallenge, setActiveChallenge] = useState(0);
    const [joinedChallenges, setJoinedChallenges] = useState([1]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveChallenge(prev => (prev + 1) % challenges.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const card = container.children[activeChallenge];
            if (card) {
                const centerScroll = card.offsetLeft - container.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2);
                container.scrollTo({ left: centerScroll, behavior: 'smooth' });
            }
        }
    }, [activeChallenge]);

    const toggleJoin = (id) => {
        setJoinedChallenges(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const categories = Object.entries(featuredContent);

    return (
        <div className={styles.explorePage}>
            {/* ─── Header ─── */}
            <header className={styles.topBar}>
                <h1 className={styles.pageTitle}>Explore</h1>
                <p className={styles.pageSubtitle}>Discover features powered by science</p>
            </header>

            {/* ─── Trending Topics Strip ─── */}
            <div className={`${styles.trendingRow} hide-scrollbar`}>
                {trendingTopics.map((topic, i) => (
                    <motion.button
                        key={topic.label}
                        className={styles.trendingPill}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <topic.icon size={14} style={{ color: topic.color }} />
                        <span>{topic.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* ─── Feature Category Cards ─── */}
            <div className={styles.featureCards}>
                {categories.map(([key, cat], i) => {
                    const IconComp = cat.icon;
                    return (
                        <motion.div
                            key={key}
                            className={styles.featureCard}
                            style={{ background: cat.gradient }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(cat.path)}
                        >
                            {/* Ambient glow */}
                            <div className={styles.featureGlow} style={{ background: cat.accentColor }} />

                            {/* Top row: icon + stats badge */}
                            <div className={styles.featureTop}>
                                <div className={styles.featureIconWrap} style={{ background: `${cat.accentColor}25` }}>
                                    <IconComp size={20} style={{ color: cat.accentColor }} />
                                </div>
                                <div className={styles.featureStatBadge}>
                                    <span className={styles.featureStatVal}>{cat.stats.value}</span>
                                    <span className={styles.featureStatUnit}>{cat.stats.unit}</span>
                                </div>
                            </div>

                            {/* Title area */}
                            <div className={styles.featureTitleArea}>
                                <h2 className={styles.featureTitle}>{cat.title}</h2>
                                <span className={styles.featureSubtitle}>{cat.subtitle}</span>
                            </div>

                            {/* Featured content preview */}
                            <div className={styles.featuredPreview}>
                                <div className={styles.featuredBadge} style={{ background: `${cat.accentColor}30`, color: cat.accentColor }}>
                                    {cat.featured.type}
                                </div>
                                <h3 className={styles.featuredTitle}>{cat.featured.title}</h3>
                                <p className={styles.featuredDesc}>{cat.featured.description}</p>
                                <div className={styles.featuredMeta}>
                                    <Clock size={12} />
                                    <span>{cat.featured.duration}</span>
                                    <button className={styles.featuredPlayBtn} style={{ background: cat.accentColor }} onClick={(e) => { e.stopPropagation(); navigate(cat.path); }}>
                                        <Play size={12} fill="white" /> Start
                                    </button>
                                </div>
                            </div>

                            {/* Quick links row */}
                            <div className={`${styles.quickLinksRow} hide-scrollbar`}>
                                {cat.quickLinks.map((link) => {
                                    const LinkIcon = link.icon;
                                    return (
                                        <div key={link.label} className={styles.quickLink}>
                                            <LinkIcon size={13} style={{ color: cat.accentColor }} />
                                            <span className={styles.quickLinkLabel}>{link.label}</span>
                                            <span className={styles.quickLinkCount}>{link.count}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Explore arrow */}
                            <div className={styles.featureArrow}>
                                <span>Explore {cat.title}</span>
                                <ChevronRight size={16} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ─── Challenges Carousel ─── */}
            <section className={styles.challengesSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionLabel}>ACTIVE CHALLENGES</span>
                    <span className={styles.sectionBadge}>{challenges.length} running</span>
                </div>
                <div ref={scrollRef} className={`${styles.challengeScroll} hide-scrollbar`}>
                    {challenges.map((ch, i) => (
                        <motion.div
                            key={ch.id}
                            className={`${styles.challengeCard} ${activeChallenge === i ? styles.challengeActive : ''}`}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveChallenge(i)}
                        >
                            <div className={styles.challengeGradient} style={{ background: `linear-gradient(135deg, ${ch.color}15, ${ch.color}30)` }} />
                            <div className={styles.challengeContent}>
                                <div className={styles.challengeEmoji}>{ch.emoji}</div>
                                <div className={styles.challengeInfo}>
                                    <span className={styles.challengeTitle}>{ch.title}</span>
                                    <div className={styles.challengeStats}>
                                        <span>{ch.participants} joined</span>
                                        <span>•</span>
                                        <span>{ch.progress}% done</span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <motion.div
                                            className={styles.progressFill}
                                            style={{ background: ch.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${ch.progress}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className={`${styles.joinBtn} ${joinedChallenges.includes(ch.id) ? styles.joinedBtn : ''}`}
                                    style={joinedChallenges.includes(ch.id) ? { background: ch.color, borderColor: ch.color } : {}}
                                    onClick={(e) => { e.stopPropagation(); toggleJoin(ch.id); }}
                                >
                                    {joinedChallenges.includes(ch.id) ? '✓' : 'Join'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className={styles.dots}>
                    {challenges.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${activeChallenge === i ? styles.dotActive : ''}`}
                            onClick={() => setActiveChallenge(i)}
                        />
                    ))}
                </div>
            </section>

            {/* ─── Daily Picks ─── */}
            <motion.div className={styles.dailyPick} whileTap={{ scale: 0.98 }} onClick={() => navigate('/sleep')}>
                <Sparkles size={18} style={{ color: '#8B5CF6' }} />
                <div className={styles.dailyPickText}>
                    <span className={styles.dailyPickTitle}>Tonight's Pick: Rainforest Dreams</span>
                    <span className={styles.dailyPickDesc}>A 45-min sleepcast chosen based on your sleep patterns</span>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
            </motion.div>
        </div>
    );
}
