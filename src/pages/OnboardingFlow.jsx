import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Calendar, Users, Bell, Sparkles } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import styles from './OnboardingFlow.module.css';

const stepMeta = [
    { emoji: '👋', title: 'What should I call you?', sub: 'Let\u2019s make this personal.' },
    { emoji: '🎂', title: 'How old are you?', sub: 'We\u2019ll tailor insights to your age group.' },
    { emoji: '⚧', title: 'Biological sex', sub: 'Helps us provide accurate health ranges.' },
    { emoji: '🔔', title: 'Stay in the loop', sub: 'Get notified about abnormal results instantly.' },
];

export default function OnboardingFlow() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        name: '',
        age: '',
        sex: '',
        notifications: false
    });
    const [direction, setDirection] = useState(1);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const updateData = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = async () => {
        if (step < 3) {
            setDirection(1);
            setStep(prev => prev + 1);
        } else {
            // Store that we just completed onboarding locally to avoid race conditions with Firebase
            localStorage.setItem('hasCompletedOnboarding', 'true');
            navigate('/loading');
            try {
                const userId = currentUser?.uid || "demo_user";
                await setDoc(doc(db, "users", userId), {
                    ...data,
                    onboarded: true,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch (error) {
                console.error("Error saving profile:", error);
            }
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(prev => prev - 1);
        }
    };

    const isNextDisabled = (step === 0 && !data.name) || (step === 1 && !data.age) || (step === 2 && !data.sex);

    const variants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className={styles.stepBody}>
                        <div className={styles.inputWrap}>
                            <User size={20} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Your first name"
                                value={data.name}
                                onChange={(e) => updateData('name', e.target.value)}
                                className={styles.input}
                                autoFocus
                            />
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className={styles.stepBody}>
                        <div className={styles.inputWrap}>
                            <Calendar size={20} className={styles.inputIcon} />
                            <input
                                type="number"
                                placeholder="Enter your age"
                                value={data.age}
                                onChange={(e) => updateData('age', e.target.value)}
                                className={styles.input}
                                autoFocus
                                min="1"
                                max="120"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={styles.stepBody}>
                        <div className={styles.sexGrid}>
                            {[
                                { value: 'Male', emoji: '♂️', label: 'Male' },
                                { value: 'Female', emoji: '♀️', label: 'Female' },
                                { value: 'Other', emoji: '⚧️', label: 'Other' },
                            ].map((opt) => (
                                <motion.button
                                    key={opt.value}
                                    onClick={() => updateData('sex', opt.value)}
                                    className={`${styles.sexCard} ${data.sex === opt.value ? styles.sexSelected : ''}`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className={styles.sexEmoji}>{opt.emoji}</span>
                                    <span className={styles.sexLabel}>{opt.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.stepBody}>
                        <label className={styles.notifCard} onClick={() => updateData('notifications', !data.notifications)}>
                            <div className={styles.notifLeft}>
                                <div className={styles.notifIcon}>
                                    <Bell size={22} />
                                </div>
                                <div>
                                    <span className={styles.notifTitle}>Push Notifications</span>
                                    <span className={styles.notifDesc}>Critical health alerts & reminders</span>
                                </div>
                            </div>
                            <div className={`${styles.toggle} ${data.notifications ? styles.toggleOn : ''}`}>
                                <div className={styles.toggleThumb} />
                            </div>
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            {/* Background accent */}
            <div className={styles.bgAccent} />

            {/* Header */}
            <div className={styles.header}>
                {step > 0 ? (
                    <button onClick={handleBack} className={styles.backBtn}>
                        <ArrowLeft size={22} />
                    </button>
                ) : <div className={styles.backPlaceholder} />}

                {/* Step dots */}
                <div className={styles.dots}>
                    {stepMeta.map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.dot} ${i === step ? styles.dotActive : ''} ${i < step ? styles.dotDone : ''}`}
                        />
                    ))}
                </div>

                <div className={styles.stepCount}>
                    {step + 1}/{stepMeta.length}
                </div>
            </div>

            {/* Content */}
            <div className={styles.middle}>
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={styles.stepSlide}
                    >
                        <div className={styles.stepEmoji}>{stepMeta[step].emoji}</div>
                        <h2 className={styles.stepTitle}>{stepMeta[step].title}</h2>
                        <p className={styles.stepSub}>{stepMeta[step].sub}</p>
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className={styles.bottomBar}>
                <motion.button
                    className={`${styles.nextBtn} ${isNextDisabled ? styles.nextDisabled : ''}`}
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    whileTap={{ scale: 0.97 }}
                >
                    {step === stepMeta.length - 1 ? (
                        <>
                            <Sparkles size={20} />
                            Let's Go
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight size={20} />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
