import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Moon, Utensils, Sparkles, Image, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Progress.module.css';
import MetricCard from '../components/MetricCard';
import AiInsightChip from '../components/AiInsightChip';

const achievements = [
    { label: '7 Day Streak', icon: '🔥', unlocked: true },
    { label: 'Sleep Master', icon: '🌙', unlocked: true },
    { label: 'Scan Pro', icon: '📷', unlocked: false },
    { label: 'Hydro King', icon: '💧', unlocked: false },
];

const activityData = [
    { id: 1, text: 'Scanned Metformin prescription', time: '2h ago', icon: <Image size={18} /> },
    { id: 2, text: 'Logged 7.2h sleep', time: '8h ago', icon: <Moon size={18} /> },
    { id: 3, text: 'Completed Workout lesson', time: 'Yesterday', icon: <Activity size={18} /> },
];

export default function Progress() {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('week'); // 'week' | 'month'

    return (
        <div className={styles.progressPage}>
            {/* ── HEADER ── */}
            <header className={styles.topBar}>
                <h1 className={styles.pageTitle}>Progress</h1>
                <div className={styles.periodToggle}>
                    <button
                        className={`${styles.periodBtn} ${period === 'week' ? styles.activePeriod : ''}`}
                        onClick={() => setPeriod('week')}
                    >
                        This Week
                    </button>
                    <button
                        className={`${styles.periodBtn} ${period === 'month' ? styles.activePeriod : ''}`}
                        onClick={() => setPeriod('month')}
                    >
                        This Month
                    </button>
                </div>
            </header>

            {/* ── METRICS GRID ── */}
            <div className={styles.metricsGrid}>
                <div className={styles.metricWrapper}>
                    <MetricCard label="SLEEP SCORE" value="76" trend="up" trendValue="+4%" variant="dark" />
                </div>
                <div className={styles.metricWrapper}>
                    <MetricCard label="HRV" value="42ms" trend="up" trendValue="+8%" variant="dark" />
                </div>
                <div className={styles.metricWrapper}>
                    <MetricCard label="RECOVERY" value="85%" trend="down" trendValue="-2%" variant="dark" />
                </div>
                <div className={styles.metricWrapper}>
                    <MetricCard label="NUTRITION" value="72%" trend="up" trendValue="+12%" variant="dark" />
                </div>
            </div>

            {/* ── AI INSIGHTS ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionLabel}>AI INSIGHTS</span>
                    <Sparkles size={14} className={styles.sparkleIcon} />
                </div>
                <div className={styles.insightsList}>
                    <AiInsightChip icon={<Heart size={16} color="var(--score-red)" />} text="Your HRV trending up suggests improved recovery this week" />
                    <AiInsightChip icon={<Moon size={16} color="var(--indigo-600)" />} text="Sleep consistency improved — keep your bedtime within 30 min window" />
                    <AiInsightChip icon={<Utensils size={16} color="var(--score-amber)" />} text="Nutrition adherence up 12% — highest streak this month" />
                </div>
            </section>

            {/* ── ACHIEVEMENTS ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionLabel}>ACHIEVEMENTS</span>
                </div>
                <div className={`${styles.achievementsScroll} hide-scrollbar`}>
                    {achievements.map(a => (
                        <div key={a.label} className={`${styles.badge} ${a.unlocked ? styles.unlockedBadge : styles.lockedBadge}`}>
                            <span className={styles.badgeIcon}>{a.icon}</span>
                            <span className={styles.badgeLabel}>{a.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── RECENT ACTIVITY ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionLabel}>RECENT ACTIVITY</span>
                    <button className={styles.viewAllBtn} onClick={() => navigate('/records')}>View all &rarr;</button>
                </div>
                <div className={styles.activityList}>
                    {activityData.map(act => (
                        <div key={act.id} className={styles.activityRow}>
                            <div className={styles.activityIconWrapper}>{act.icon}</div>
                            <span className={styles.activityText}>{act.text}</span>
                            <span className={styles.activityTime}>{act.time}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className={styles.bottomSpacer}></div>
        </div>
    );
}
