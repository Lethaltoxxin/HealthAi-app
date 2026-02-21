import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Dumbbell, Calendar, Activity, Play, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workoutGenerate, logEvent } from '../api';
import styles from './WorkoutBuilder.module.css';

export default function WorkoutBuilder() {
    const navigate = useNavigate();
    const [step, setStep] = useState('input'); // input, plan, player
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [activeDay, setActiveDay] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        goal: 'general',
        level: 'beginner',
        days_per_week: 3,
        equipment: []
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await workoutGenerate(formData);
            setPlan(result);
            setStep('plan');
            logEvent('workout_generated', { profile: formData });
        } catch (e) {
            alert("Failed to generate workout. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleEquipment = (item) => {
        setFormData(prev => {
            const exists = prev.equipment.includes(item);
            return {
                ...prev,
                equipment: exists
                    ? prev.equipment.filter(e => e !== item)
                    : [...prev.equipment, item]
            };
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Workout Builder</h1>
            </header>

            <div className={styles.content}>
                {step === 'input' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.form}
                    >
                        <div className={styles.section}>
                            <label>Goal</label>
                            <div className={styles.chips}>
                                {['strength', 'hypertrophy', 'endurance'].map(g => (
                                    <button
                                        key={g}
                                        className={`${styles.chip} ${formData.goal === g ? styles.active : ''}`}
                                        onClick={() => setFormData({ ...formData, goal: g })}
                                    >
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <label>Level</label>
                            <div className={styles.chips}>
                                {['beginner', 'intermediate', 'advanced'].map(l => (
                                    <button
                                        key={l}
                                        className={`${styles.chip} ${formData.level === l ? styles.active : ''}`}
                                        onClick={() => setFormData({ ...formData, level: l })}
                                    >
                                        {l.charAt(0).toUpperCase() + l.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <label>Days Per Week ({formData.days_per_week})</label>
                            <input
                                type="range"
                                min="1" max="6"
                                value={formData.days_per_week}
                                onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) })}
                                className={styles.slider}
                            />
                        </div>

                        <div className={styles.section}>
                            <label>Equipment</label>
                            <div className={styles.chips}>
                                {['Dumbbells', 'Barbell', 'Pull-up Bar', 'Machine'].map(eq => (
                                    <button
                                        key={eq}
                                        className={`${styles.chip} ${formData.equipment.includes(eq) ? styles.active : ''}`}
                                        onClick={() => toggleEquipment(eq)}
                                    >
                                        {eq}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className={styles.generateBtn}
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? 'Generating Plan...' : 'Build My Plan'}
                        </button>
                    </motion.div>
                )}

                {step === 'plan' && plan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={styles.planView}
                    >
                        <h2>Your Weekly Schedule</h2>
                        <div className={styles.weekGrid}>
                            {Object.entries(plan.schedule).map(([day, details]) => (
                                <div key={day} className={styles.dayCard}>
                                    <div className={styles.dayHeader}>
                                        <h3>{day}</h3>
                                        <span className={styles.focusTag}>{details.focus}</span>
                                    </div>
                                    <ul className={styles.exList}>
                                        {details.exercises.map((ex, i) => (
                                            <li key={i}>
                                                <span className={styles.exName}>{ex.title}</span>
                                                <span className={styles.exMeta}>{ex.sets}x{ex.reps}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        className={styles.startBtn}
                                        onClick={() => {
                                            setActiveDay(details);
                                            setStep('player');
                                        }}
                                    >
                                        Start Workout
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'player' && activeDay && (
                    <WorkoutPlayer
                        dayData={activeDay}
                        onClose={() => setStep('plan')}
                    />
                )}
            </div>
        </div>
    );
}

function WorkoutPlayer({ dayData, onClose }) {
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [timer, setTimer] = useState(60);

    const currentEx = dayData.exercises[currentExIndex];
    const isLast = currentExIndex === dayData.exercises.length - 1;

    const handleNext = () => {
        if (isLast) {
            alert("Workout Complete!");
            onClose();
        } else {
            setCurrentExIndex(prev => prev + 1);
            setIsResting(false);
        }
    };

    return (
        <motion.div
            className={styles.playerOverlay}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
        >
            <div className={styles.playerHeader}>
                <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                <h3>{dayData.focus}</h3>
            </div>

            <div className={styles.playerContent}>
                <div className={styles.mainDisplay}>
                    <h2>{currentEx.title}</h2>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.label}>SETS</span>
                            <span className={styles.value}>{currentEx.sets}</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.label}>REPS</span>
                            <span className={styles.value}>{currentEx.reps}</span>
                        </div>
                    </div>
                    <div className={styles.meta}>
                        <span>{currentEx.primary_muscle}</span> • <span>{currentEx.equipment}</span>
                    </div>
                </div>

                <div className={styles.controls}>
                    <button className={styles.completeSetBtn} onClick={handleNext}>
                        {isLast ? 'Finish Workout' : 'Next Exercise'} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
