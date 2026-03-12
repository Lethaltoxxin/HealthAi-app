import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Info, Flame, Target, Trophy, Dumbbell, Activity, Shield, Zap, CircleDashed, ChevronRight, RotateCcw, SkipForward, CheckCircle2 } from 'lucide-react';
import styles from './Workout.module.css';

// --- Static Workout Data (Darebee Inspired) ---
const workoutData = {
    hero: {
        id: 'sentinel',
        title: 'The Sentinel',
        duration: '30 min',
        intensity: 'Extreme',
        type: 'Full Body',
        exercises: [
            { title: 'Jumping Jacks', reps: '60s', sets: 1, rest: 20 },
            { title: 'Push-Ups', reps: '20', sets: 3, rest: 30 },
            { title: 'Plank', reps: '60s', sets: 3, rest: 30 },
            { title: 'Squat Jumps', reps: '15', sets: 3, rest: 45 },
            { title: 'Burpees', reps: '10', sets: 3, rest: 45 },
            { title: 'High Knees', reps: '45s', sets: 2, rest: 30 }
        ]
    },
    combat: {
        title: "Combat & Agility",
        items: [
            {
                id: 1, title: 'Fighter Pull', duration: '15 min', intensity: 'High', type: 'Bodyweight', icon: Shield,
                color: '#ffffff',
                bgImage: '/workouts/bg_combat.png',
                exercises: [
                    { title: 'Shadow Boxing', reps: '60s', sets: 3, rest: 20 },
                    { title: 'Reverse Lunges', reps: '20', sets: 3, rest: 30 },
                    { title: 'Spiderman Push-Ups', reps: '12', sets: 3, rest: 45 },
                    { title: 'Russian Twists', reps: '40', sets: 2, rest: 30 }
                ]
            },
            {
                id: 2, title: 'Shadow Boxer', duration: '20 min', intensity: 'High', type: 'Cardio', icon: Activity,
                color: '#ffffff',
                bgImage: '/workouts/bg_combat.png',
                exercises: [
                    { title: 'Boxer Shuffle', reps: '120s', sets: 1, rest: 20 },
                    { title: 'Jab-Cross-Hook', reps: '30s per side', sets: 3, rest: 20 },
                    { title: 'Duck & Weave', reps: '60s', sets: 2, rest: 20 },
                    { title: 'Speed Bag Punches', reps: '60s', sets: 3, rest: 30 }
                ]
            },
            {
                id: 3, title: 'Ninja Flow', duration: '10 min', intensity: 'Medium', type: 'Agility', icon: Zap,
                color: '#ffffff',
                bgImage: '/workouts/bg_combat.png',
                exercises: [
                    { title: 'Side-to-Side Hops', reps: '45s', sets: 2, rest: 20 },
                    { title: 'Bear Crawl', reps: '30s', sets: 3, rest: 30 },
                    { title: 'Plank Jacks', reps: '30', sets: 2, rest: 20 },
                    { title: 'Frog Jumps', reps: '15', sets: 2, rest: 30 }
                ]
            },
            {
                id: 4, title: 'Combat Core', duration: '12 min', intensity: 'High', type: 'Core', icon: Target,
                color: '#ffffff',
                bgImage: '/workouts/bg_combat.png',
                exercises: [
                    { title: 'V-Ups', reps: '15', sets: 3, rest: 30 },
                    { title: 'Bicycle Crunches', reps: '40', sets: 3, rest: 20 },
                    { title: 'Hollow Hold', reps: '45s', sets: 3, rest: 20 },
                    { title: 'Mountain Climbers', reps: '60s', sets: 2, rest: 30 }
                ]
            }
        ]
    },
    strength: {
        title: "Strength & Core",
        items: [
            {
                id: 5, title: 'Spartan Trials', duration: '30 min', intensity: 'Extreme', type: 'Full Body', icon: Dumbbell,
                color: '#ffffff',
                bgImage: '/workouts/bg_strength.png',
                exercises: [
                    { title: 'Diamond Pushups', reps: '15', sets: 4, rest: 45 },
                    { title: 'Pistol Squats', reps: '8 per leg', sets: 3, rest: 60 },
                    { title: 'Pull-Up Hold', reps: 'Max Time', sets: 3, rest: 60 },
                    { title: 'Broad Jumps', reps: '12', sets: 3, rest: 45 }
                ]
            },
            {
                id: 6, title: 'Iron Clad', duration: '25 min', intensity: 'High', type: 'Upper Body', icon: Dumbbell,
                color: '#ffffff',
                bgImage: '/workouts/bg_strength.png',
                exercises: [
                    { title: 'Pike Pushups', reps: '12', sets: 4, rest: 45 },
                    { title: 'Commando Plank', reps: '20', sets: 3, rest: 45 },
                    { title: 'Triceps Dips', reps: '20', sets: 3, rest: 45 },
                    { title: 'Superman Pulls', reps: '15', sets: 3, rest: 30 }
                ]
            },
            {
                id: 7, title: 'Gladiator Core', duration: '15 min', intensity: 'Medium', type: 'Core', icon: Target,
                color: '#ffffff',
                bgImage: '/workouts/bg_strength.png',
                exercises: [
                    { title: 'Leg Raises', reps: '20', sets: 3, rest: 30 },
                    { title: 'Flutter Kicks', reps: '60s', sets: 3, rest: 30 },
                    { title: 'Side Plank', reps: '45s per side', sets: 2, rest: 30 },
                    { title: 'Dead Bugs', reps: '20', sets: 3, rest: 30 }
                ]
            },
            {
                id: 8, title: 'Leg Day Hero', duration: '20 min', intensity: 'High', type: 'Lower Body', icon: Trophy,
                color: '#ffffff',
                bgImage: '/workouts/bg_strength.png',
                exercises: [
                    { title: 'Jump Squats', reps: '20', sets: 4, rest: 45 },
                    { title: 'Walking Lunges', reps: '30', sets: 3, rest: 45 },
                    { title: 'Calf Raises', reps: '40', sets: 3, rest: 30 },
                    { title: 'Wall Sit', reps: '60s', sets: 3, rest: 60 }
                ]
            }
        ]
    }
};

// --- Sub-Component: Human Exercise Illustration ---
const ExerciseAnimation = ({ exerciseTitle }) => {
    const title = exerciseTitle.toLowerCase();
    const isJumping = title.includes('jump') || title.includes('burpee') || title.includes('high knees') || title.includes('hop') || title.includes('jack');
    const isCore = title.includes('plank') || title.includes('crunch') || title.includes('twist') || title.includes('hollow') || title.includes('bug');
    const isLower = title.includes('squat') || title.includes('lunge') || title.includes('calf');
    const isUpper = title.includes('push') || title.includes('pull') || title.includes('dip') || title.includes('box');

    let imagePath = '/workouts/exercise_jump.png'; // default fallback
    if (isJumping) imagePath = '/workouts/exercise_jump.png';
    else if (isCore) imagePath = '/workouts/exercise_core.png';
    else if (isLower) imagePath = '/workouts/exercise_squat.png';
    else if (isUpper) imagePath = '/workouts/exercise_push.png';

    return (
        <div className={styles.animationWrapper}>
            <motion.img 
                src={imagePath} 
                alt={exerciseTitle}
                className={styles.humanIllustration}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            />
            <div className={styles.animationFloor} />
        </div>
    );
};

// --- Sub-Component: Workout Player ---
const WorkoutPlayer = ({ workout, onExit }) => {
    const [currentExIndex, setCurrentExIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Instead of raw sets, we'll simplify Darebee-style by executing the list linearly for this demo player
    const currentList = workout.exercises;
    const currentExercise = currentList[currentExIndex];
    const isLast = currentExIndex === currentList.length - 1;

    // Timer Effect
    useEffect(() => {
        let interval = null;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
        } else if (timer === 0 && isActive) {
            setIsActive(false);
            if (isResting) {
                handleNextExercise();
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timer, isResting]);

    const startRest = (duration) => {
        setIsResting(true);
        setTimer(duration);
        setIsActive(true);
    };

    const handleNextExercise = () => {
        setIsResting(false);
        setIsActive(false);
        if (isLast) {
            setIsFinished(true);
        } else {
            setCurrentExIndex(prev => prev + 1);
        }
    };

    const handleAction = () => {
        if (isResting) {
            // Skip rest
            handleNextExercise();
        } else {
            // Start rest period
            startRest(currentExercise.rest || 30);
        }
    };

    const toggleTimer = () => {
        if (!isActive && timer === 0) {
            // Initialize timer from exercise duration
            setTimer(parseInt(currentExercise.reps) || 60);
        }
        setIsActive(!isActive);
    };

    if (isFinished) {
        return (
            <div className={styles.playerContainer}>
                <div className={styles.finishedScreen}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={styles.celebrationCircle}
                    >
                        <CheckCircle2 size={80} color="#10b981" />
                    </motion.div>
                    <h2>Workout Complete!</h2>
                    <p>Excellent work crushing the <strong>{workout.title}</strong> routine.</p>
                    <button className={styles.finishBtn} onClick={onExit}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isTimedExercise = currentExercise.reps.toString().includes('s');

    return (
        <div className={styles.playerContainer}>
            <header className={styles.playerHeader}>
                <button onClick={onExit} className={styles.iconBtn}><ArrowLeft size={24} /></button>
                <div className={styles.playerProgress}>
                    <span>{workout.title}</span>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${((currentExIndex) / currentList.length) * 100}%` }}
                        />
                    </div>
                </div>
                <span className={styles.counter}>{currentExIndex + 1}/{currentList.length}</span>
            </header>

            <AnimatePresence mode='wait'>
                {isResting ? (
                    <motion.div
                        key="rest"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.restScreen}
                    >
                        <h3>Rest & Recover</h3>
                        <div className={styles.timerLarge}>{timer}</div>
                        <p className={styles.upNext}>Up Next: <strong>{currentList[currentExIndex + 1]?.title}</strong></p>
                        <button className={styles.skipBtn} onClick={handleAction}>
                            Skip Rest <SkipForward size={20} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="exercise"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.exerciseScreen}
                    >
                        <div className={styles.instructionArea}>
                            <h2>{currentExercise.title}</h2>
                            <div className={styles.statsRow}>
                                <div className={styles.statBadge}>
                                    <Activity size={16} />
                                    {isTimedExercise ? currentExercise.reps : `${currentExercise.reps} Reps`}
                                </div>
                                <div className={styles.statBadge}>
                                    <RotateCcw size={16} /> {currentExercise.sets} Sets
                                </div>
                            </div>
                        </div>

                        <ExerciseAnimation exerciseTitle={currentExercise.title} />

                        <div className={styles.actionArea}>
                            {isTimedExercise ? (
                                <div className={styles.timerControls}>
                                    <div className={styles.activeTimerDisplay}>
                                        {timer > 0 ? timer : parseInt(currentExercise.reps)}
                                    </div>
                                    <button className={styles.timerToggleBtn} onClick={toggleTimer}>
                                        {isActive ? 'Pause Timer' : 'Start Timer'}
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.repsDisplay}>
                                    Complete {currentExercise.reps} Reps
                                </div>
                            )}

                            <button className={styles.completeSetBtn} onClick={handleAction}>
                                Complete Exercise <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- Main Page Component ---
export default function Workout() {
    const navigate = useNavigate();
    const [activeWorkout, setActiveWorkout] = useState(null); // null = browse, object = player

    const scrollRefs = {
        combat: useRef(null),
        strength: useRef(null),
    };

    if (activeWorkout) {
        return <WorkoutPlayer workout={activeWorkout} onExit={() => setActiveWorkout(null)} />;
    }

    return (
        <div className={styles.workoutPage}>
            {/* ─── HEADER ─── */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <button className={styles.backBtn} onClick={() => navigate('/explore')}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1>Workout</h1>
                </div>
            </header>

            {/* ─── HERO FEATURED WORKOUT ─── */}
            <section className={styles.heroSection}>
                <motion.div
                    className={styles.featuredCard}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className={styles.featuredContent}>
                        <div className={styles.tag}>ROUTINE OF THE DAY</div>
                        <h2 className={styles.featuredTitle}>{workoutData.hero.title}</h2>
                        <p className={styles.featuredDesc}>
                            A grueling 30-day bodyweight program focusing on endurance, core strength, and relentless stamina. No equipment needed.
                        </p>

                        <div className={styles.featuredMeta}>
                            <div className={styles.metaItem}>
                                <Flame size={16} color="#fbbf24" /> Level 4 (Hard)
                            </div>
                            <div className={styles.metaItem}>
                                <CircleDashed size={16} /> 30 Days
                            </div>
                        </div>

                        <div className={styles.featuredActions}>
                            <button className={styles.btnPrimary} onClick={() => setActiveWorkout(workoutData.hero)}>
                                <Play size={16} fill="#1e1b4b" /> Start Today
                            </button>
                            <button className={styles.btnSecondary} aria-label="More Info">
                                <Info size={16} />
                            </button>
                        </div>
                    </div>
                    {/* Abstract visual representation of the sentinel/workout */}
                    <div className={styles.featuredVisual}>
                        <div className={styles.visualOrb1} />
                        <div className={styles.visualOrb2} />
                        <Shield size={120} className={styles.visualIcon} strokeWidth={1} />
                    </div>
                </motion.div>
            </section>

            {/* ─── CATEGORIES ─── */}
            <div className={styles.categoriesWrapper}>
                {['combat', 'strength'].map((key, index) => {
                    const category = workoutData[key];
                    return (
                        <section key={key} className={styles.carouselSection}>
                            <motion.div
                                className={styles.sectionHeader}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                            >
                                <h2>{category.title}</h2>
                                <button className={styles.seeAllBtn}>See all</button>
                            </motion.div>

                            <motion.div
                                className={`${styles.carousel} hide-scrollbar`}
                                ref={scrollRefs[key]}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                            >
                                {category.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.id}
                                            className={styles.routineCard}
                                            onClick={() => setActiveWorkout(item)}
                                        >
                                            <div 
                                                className={styles.routineArtwork} 
                                                style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${item.bgImage})` }}
                                            >
                                                <Icon size={44} color={item.color} className={styles.routineIcon} strokeWidth={1.2} />
                                            </div>
                                            <div className={styles.routineInfo}>
                                                <h3 className={styles.routineTitle}>{item.title}</h3>
                                                <span className={styles.routineType}>{item.type}</span>
                                                <div className={styles.routineDetails}>
                                                    <span>{item.duration}</span>
                                                    <span className={styles.dot}>•</span>
                                                    <span style={{ color: item.color }}>{item.intensity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </section>
                    );
                })}
            </div>

            {/* Bottom padding for navigation bar */}
            <div style={{ height: '100px' }} />
        </div>
    );
}
