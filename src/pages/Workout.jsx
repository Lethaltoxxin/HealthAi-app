import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Clock, Activity, Play, CheckCircle, RotateCcw, ChevronRight, Pause, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Workout.module.css';

// --- Sub-Component: Workout Player ---
const WorkoutPlayer = ({ day, onComplete, onExit }) => {
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null); // Use ref for interval

    const currentExercise = day.exercises[currentExIndex];
    const isLast = currentExIndex === day.exercises.length - 1;

    // Timer Logic
    useEffect(() => {
        if (isActive && timer > 0) {
            intervalRef.current = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            if (isResting) {
                // Rest over, next exercise
                setIsResting(false);
                nextExercise();
            }
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, timer, isResting]);

    const nextExercise = () => {
        if (isLast && !isResting) {
            onComplete();
        } else {
            setCurrentExIndex(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (isResting) {
            // Skip rest
            setTimer(0);
        } else {
            // Start rest
            setIsResting(true);
            setTimer(currentExercise.rest || 60);
            setIsActive(true);
        }
    };

    return (
        <div className={styles.playerContainer}>
            <div className={styles.playerHeader}>
                <button onClick={onExit} className={styles.iconBtn}><ArrowLeft /></button>
                <span>{day.title}</span>
                <span>{currentExIndex + 1}/{day.exercises.length}</span>
            </div>

            <AnimatePresence mode='wait'>
                {isResting ? (
                    <motion.div
                        key="rest"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.restScreen}
                    >
                        <h3>Rest & Recover</h3>
                        <div className={styles.timerLarge}>{timer}s</div>
                        <p>Up Next: {day.exercises[currentExIndex + 1]?.title || "Finish"}</p>
                        <button className={styles.skipBtn} onClick={handleNext}>Skip Rest <SkipForward /></button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="exercise"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className={styles.exerciseScreen}
                    >
                        <div className={styles.videoPlaceholder}>
                            {currentExercise.video ? (
                                <div className={styles.videoHint}>
                                    <Play size={48} />
                                    <span>Demo Video Available</span>
                                </div>
                            ) : (
                                <div className={styles.videoHint}>No Video</div>
                            )}
                        </div>

                        <div className={styles.exDetail}>
                            <h2>{currentExercise.title}</h2>
                            <div className={styles.statsRow}>
                                <div className={styles.statBadge}>
                                    <Activity size={16} />
                                    {currentExercise.reps?.toString().includes('s') ? currentExercise.reps : `${currentExercise.reps} Reps`}
                                </div>
                                <div className={styles.statBadge}>
                                    <RotateCcw size={16} /> {currentExercise.sets} Sets
                                </div>
                            </div>

                            <p className={styles.instructions}>{currentExercise.instructions}</p>

                            {/* If timed exercise */}
                            {currentExercise.reps?.toString().includes('s') && (
                                <button className={styles.timerToggle} onClick={() => {
                                    if (isActive) { setIsActive(false); }
                                    else { setTimer(parseInt(currentExercise.reps) || 45); setIsActive(true); }
                                }}>
                                    {isActive ? 'Pause Timer' : 'Start Timer'} ({timer}s)
                                </button>
                            )}

                            <button className={styles.completeSetBtn} onClick={handleNext}>
                                {isLast ? 'Finish Workout' : 'Next Exercise'} <ChevronRight />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Component ---
export default function Workout() {
    const navigate = useNavigate();
    const [view, setView] = useState('generator'); // generator, preview, player
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [activeDay, setActiveDay] = useState(null);

    const [formData, setFormData] = useState({
        goal: 'strength',
        level: 'beginner',
        equipment: [],
        days_per_week: 3
    });

    // Load from local storage on mount
    useEffect(() => {
        const savedPlan = localStorage.getItem('workoutPlan');
        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
            setView('preview');
        }
    }, []);

    const toggleEquipment = (item) => {
        setFormData(prev => {
            const current = prev.equipment;
            if (current.includes(item)) return { ...prev, equipment: current.filter(i => i !== item) };
            return { ...prev, equipment: [...current, item] };
        });
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Use relative path to leverage Vite proxy
            const response = await fetch('/api/workout/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Server error');
            }

            const data = await response.json();
            setPlan(data);
            localStorage.setItem('workoutPlan', JSON.stringify(data));
            setView('preview');
        } catch (error) {
            console.error("Error generating plan:", error);
            alert(`Could not generate plan: ${error.message}. Please check backend is running.`);
        } finally {
            setLoading(false);
        }
    };

    const startWorkout = (day) => {
        setActiveDay(day);
        setView('player');
    };

    const handleWorkoutComplete = () => {
        setActiveDay(null);
        setView('preview');
        alert("Workout Completed! Great job.");
        // Here we could log the event to backend
    };

    // View: Generator
    if (view === 'player' && activeDay) {
        return <WorkoutPlayer day={activeDay} onComplete={handleWorkoutComplete} onExit={() => setView('preview')} />;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => view === 'preview' ? setView('generator') : navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={24} color="#333" />
                </button>
                <h1>{view === 'preview' ? 'Your Plan' : 'Build Workout'}</h1>
            </header>

            {view === 'generator' && (
                <div className={styles.form}>
                    <div className={styles.section}>
                        <label>What is your main goal?</label>
                        <div className={styles.grid2}>
                            {['strength', 'weight_loss', 'endurance', 'muscle_gain'].map(g => (
                                <button
                                    key={g}
                                    className={`${styles.selectBtn} ${formData.goal === g ? styles.selected : ''}`}
                                    onClick={() => setFormData({ ...formData, goal: g })}
                                >
                                    {g.replace('_', ' ').toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label>Equipment Available</label>
                        <div className={styles.grid2}>
                            {['dumbbell', 'pullup_bar', 'resistance_band', 'bench'].map(eq => (
                                <button
                                    key={eq}
                                    className={`${styles.selectBtn} ${formData.equipment.includes(eq) ? styles.selected : ''}`}
                                    onClick={() => toggleEquipment(eq)}
                                >
                                    {isActive => isActive ? <CheckCircle size={16} /> : null} {eq.replace('_', ' ')}
                                </button>
                            ))}
                            <button className={`${styles.selectBtn} ${formData.equipment.length === 0 ? styles.selected : ''}`} onClick={() => setFormData({ ...formData, equipment: [] })}>
                                None (Bodyweight)
                            </button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label>Days per Week: {formData.days_per_week}</label>
                        <input type="range" min="2" max="6" value={formData.days_per_week} onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) })} />
                    </div>

                    <button
                        className={styles.generateBtn}
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? 'Building Plan...' : 'Generate Workout Plan'}
                    </button>
                </div>
            )}

            {view === 'preview' && plan && (
                <div className={styles.previewContainer}>
                    <div className={styles.planHeader}>
                        <h2>4-Week Transformation</h2>
                        <button className={styles.resetLink} onClick={() => setView('generator')}>Rebuild</button>
                    </div>

                    <div className={styles.scheduleGrid}>
                        {plan.schedule.map((day, i) => (
                            <motion.div
                                key={i}
                                className={styles.dayCard}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.dayNum}>Day {day.day}</span>
                                    <h3>{day.title}</h3>
                                </div>
                                <div className={styles.exList}>
                                    {day.exercises.slice(0, 3).map((ex, j) => (
                                        <div key={j} className={styles.exItem}>• {ex.title}</div>
                                    ))}
                                    {day.exercises.length > 3 && <div className={styles.more}>+ {day.exercises.length - 3} more</div>}
                                </div>
                                <button className={styles.startBtn} onClick={() => startWorkout(day)}>
                                    Start Workout <Play size={16} fill="white" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
