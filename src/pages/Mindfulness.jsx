import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Moon, Sun, Wind, Zap, CloudRain, Waves, TreePine, Music, Brain, Mic2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MindfulnessPlayer from '../components/mindfulness/MindfulnessPlayer';
import styles from './Mindfulness.module.css';

const categories = [
    {
        id: 'morning',
        title: 'Morning',
        color: '#FEF3C7',
        accent: '#D97706',
        tracks: [
            { id: 'm1', title: 'Gentle Chimes', duration: '10 min', durationSec: 600, sound: 'chimes', icon: Music, category: 'Morning', color: '#FEF3C7', accent: '#D97706' },
            { id: 'm2', title: 'Sunrise Drone', duration: '15 min', durationSec: 900, sound: 'drone', icon: Sun, category: 'Morning', color: '#FEF3C7', accent: '#D97706' },
            { id: 'm3', title: 'Morning Birds', duration: '10 min', durationSec: 600, sound: 'birds', icon: TreePine, category: 'Morning', color: '#FEF3C7', accent: '#D97706' },
        ]
    },
    {
        id: 'sleep',
        title: 'Sleep',
        color: '#DBEAFE',
        accent: '#2563EB',
        tracks: [
            { id: 's1', title: 'Rain Sounds', duration: '20 min', durationSec: 1200, sound: 'rain', icon: CloudRain, category: 'Sleep', color: '#DBEAFE', accent: '#2563EB' },
            { id: 's2', title: 'Ocean Waves', duration: '30 min', durationSec: 1800, sound: 'ocean', icon: Waves, category: 'Sleep', color: '#DBEAFE', accent: '#2563EB' },
            { id: 's3', title: 'Brown Noise', duration: '20 min', durationSec: 1200, sound: 'brown_noise', icon: Moon, category: 'Sleep', color: '#DBEAFE', accent: '#2563EB' },
        ]
    },
    {
        id: 'anxiety',
        title: 'Anxiety Relief',
        color: '#E0E7FF',
        accent: '#4F46E5',
        tracks: [
            { id: 'a1', title: 'Deep Breathing', duration: '5 min', durationSec: 300, sound: 'breathing', icon: Wind, category: 'Anxiety Relief', color: '#E0E7FF', accent: '#4F46E5' },
            { id: 'a2', title: 'Calm Stream', duration: '10 min', durationSec: 600, sound: 'stream', icon: Waves, category: 'Anxiety Relief', color: '#E0E7FF', accent: '#4F46E5' },
            { id: 'a3', title: 'Tibetan Bowls', duration: '15 min', durationSec: 900, sound: 'bowls', icon: Mic2, category: 'Anxiety Relief', color: '#E0E7FF', accent: '#4F46E5' },
        ]
    },
    {
        id: 'focus',
        title: 'Focus',
        color: '#ECFDF5',
        accent: '#059669',
        tracks: [
            { id: 'f1', title: 'Lo-fi Beats', duration: '15 min', durationSec: 900, sound: 'lofi', icon: Music, category: 'Focus', color: '#ECFDF5', accent: '#059669' },
            { id: 'f2', title: 'Binaural 40Hz', duration: '10 min', durationSec: 600, sound: 'binaural_40', icon: Brain, category: 'Focus', color: '#ECFDF5', accent: '#059669' },
            { id: 'f3', title: 'White Noise', duration: '20 min', durationSec: 1200, sound: 'white_noise', icon: Zap, category: 'Focus', color: '#ECFDF5', accent: '#059669' },
        ]
    },
];

const allTracks = categories.flatMap(c => c.tracks);

export default function Mindfulness() {
    const navigate = useNavigate();
    const [activeTrack, setActiveTrack] = useState(null);

    const handlePlay = (track) => {
        setActiveTrack(track);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={24} color="#333" />
                </button>
                <h1>Mindfulness</h1>
            </header>

            {/* Featured Card */}
            <div className={styles.featured}>
                <div className={styles.featuredContent}>
                    <h2>Daily Calm</h2>
                    <p>Start your day with intention.</p>
                    <button
                        className={styles.playBtn}
                        onClick={() => handlePlay(allTracks[0])}
                    >
                        <Play size={20} fill="white" /> Play Now
                    </button>
                </div>
                <div className={styles.featuredImage}>🧘</div>
            </div>

            {/* Category Sections */}
            {categories.map((cat) => (
                <div key={cat.id} className={styles.section}>
                    <h3 className={styles.sectionTitle}>{cat.title}</h3>
                    <div className={styles.trackList}>
                        {cat.tracks.map((track, i) => (
                            <motion.div
                                key={track.id}
                                className={styles.trackCard}
                                style={{ backgroundColor: cat.color }}
                                onClick={() => handlePlay(track)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <div className={styles.trackIcon} style={{ color: cat.accent }}>
                                    <track.icon size={22} />
                                </div>
                                <div className={styles.trackInfo}>
                                    <span className={styles.trackTitle} style={{ color: cat.accent }}>
                                        {track.title}
                                    </span>
                                    <span className={styles.trackDuration} style={{ color: cat.accent, opacity: 0.7 }}>
                                        {track.duration}
                                    </span>
                                </div>
                                <div className={styles.trackPlay} style={{ background: `${cat.accent}20`, color: cat.accent }}>
                                    <Play size={16} fill={cat.accent} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Full Screen Player */}
            {activeTrack && (
                <MindfulnessPlayer
                    track={activeTrack}
                    tracks={allTracks}
                    onClose={() => setActiveTrack(null)}
                    onTrackChange={setActiveTrack}
                />
            )}
        </div>
    );
}
