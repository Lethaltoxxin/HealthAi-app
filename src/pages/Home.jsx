import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Camera, ChevronRight, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Home.module.css';

const initialActions = [
    { id: 1, label: 'Morning check-in', time: '8:00 AM', done: true },
    { id: 2, label: 'Take Vitamin D + B12', time: '9:00 AM', done: false },
    { id: 3, label: 'Log lunch nutrition', time: '12:30 PM', done: false },
    { id: 4, label: 'Evening wind-down', time: '9:30 PM', done: false },
];

export default function Home() {
    const navigate = useNavigate();
    const [actions, setActions] = useState(initialActions);

    const toggleAction = (id) => {
        setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
    };

    const doneCount = actions.filter(a => a.done).length;
    const score = 60 + Math.round((doneCount / actions.length) * 40);

    return (
        <div className={styles.page}>
            {/* ─── HEADER ZONE (Deep Indigo) ─── */}
            <div className={styles.headerZone}>
                <div className={styles.topRow}>
                    <motion.div className={styles.avatar} whileTap={{ scale: 0.9 }}>A</motion.div>
                    <span className={styles.greeting}>Good morning, Alex</span>
                    <div className={styles.streakContainer}>
                        <div className={styles.streakPill}>🔥 {doneCount + 6}</div>
                        <Bell size={22} className={styles.bellIcon} />
                    </div>
                </div>

                <div className={styles.scoreSection}>
                    <span className={styles.scoreLabel}>TODAY'S SCORE</span>
                    <div className={styles.scoreValContainer}>
                        <span className={styles.scoreNum}>{score}</span>
                        <span className={styles.scoreDenom}>/100</span>
                    </div>

                    <div className={styles.pillsRow}>
                        <div className={styles.statPill}><span className={styles.statLabel}>SLEEP</span><span className={styles.statVal}>7.2h</span></div>
                        <div className={styles.statPill}><span className={styles.statLabel}>HRV</span><span className={styles.statVal}>58ms</span></div>
                        <div className={styles.statPill}><span className={styles.statLabel}>READINESS</span><span className={styles.statVal}>78</span></div>
                    </div>
                </div>

                {/* Curved line decoration */}
                <svg viewBox="0 0 390 40" preserveAspectRatio="none" className={styles.headerCurve}>
                    <path d="M0,40 C150,0 250,0 390,40" fill="none" stroke="var(--mint-400)" strokeWidth="2" strokeOpacity="0.5" />
                </svg>
            </div>

            {/* ─── SCROLLABLE CONTENT (Off-White) ─── */}
            <div className={styles.scrollZone}>

                {/* SCAN QUICK ACTION CARD */}
                <motion.div className={styles.scanCard} whileTap={{ scale: 0.98 }} onClick={() => navigate('/scan')}>
                    <div className={styles.scanCamCircle}>
                        <Camera size={22} color="white" />
                    </div>
                    <div className={styles.scanTextCol}>
                        <span className={styles.scanTitle}>Scan a prescription or report</span>
                        <span className={styles.scanSub}>AI reads and explains it in plain English</span>
                    </div>
                    <ChevronRight size={20} className={styles.scanArrow} />
                </motion.div>

                {/* ASK AI BANNER */}
                <motion.div className={styles.aiBanner} whileTap={{ scale: 0.98 }} onClick={() => navigate('/chat')}>
                    <Sparkles size={18} className={styles.aiIcon} />
                    <span className={styles.aiText}>Ask your AI Health Assistant...</span>
                    <ChevronRight size={20} className={styles.aiArrow} />
                </motion.div>

                {/* DAILY PLAN SECTION */}
                <div className={styles.planSection}>
                    <div className={styles.planHeader}>
                        <span className={styles.planLabel}>DAILY PLAN</span>
                        <span className={styles.planCount}>{doneCount}/{actions.length}</span>
                    </div>

                    <div className={styles.planList}>
                        {actions.map(action => {
                            const isAM = action.time.includes('AM');
                            return (
                                <motion.div
                                    className={`${styles.planRow} ${action.done ? styles.rowDone : ''}`}
                                    key={action.id}
                                    onClick={() => toggleAction(action.id)}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className={`${styles.checkbox} ${action.done ? styles.checkDone : ''}`}>
                                        {action.done && <Check size={14} color="white" strokeWidth={3} />}
                                    </div>
                                    <span className={`${styles.taskName} ${action.done ? styles.taskDone : ''}`}>{action.label}</span>
                                    <div className={styles.timeChip}>{action.time}</div>
                                    <div className={`${styles.timeDot} ${isAM ? styles.dotAM : styles.dotPM}`} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.bottomSpacer}></div>
            </div>
        </div>
    );
}
