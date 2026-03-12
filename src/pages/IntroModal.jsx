import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Brain, Heart } from 'lucide-react';
import styles from './IntroModal.module.css';

const features = [
    { icon: Activity, label: 'Track Vitals', color: '#14B8A6' },
    { icon: Brain, label: 'AI Assistant', color: '#6366F1' },
    { icon: Shield, label: 'Health Vault', color: '#F59E0B' },
    { icon: Heart, label: 'Wellness', color: '#EF4444' },
];

export default function IntroModal() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* Animated gradient background */}
            <div className={styles.bgGradient} />
            <div className={styles.bgOrb1} />
            <div className={styles.bgOrb2} />
            <div className={styles.bgOrb3} />

            <div className={styles.content}>
                {/* Logo */}
                <motion.div
                    className={styles.logoWrap}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className={styles.logoIcon}>
                        <Activity size={32} color="white" strokeWidth={2.5} />
                    </div>
                </motion.div>

                {/* Hero text */}
                <motion.div
                    className={styles.hero}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <h1 className={styles.title}>
                        Your health,<br />
                        <span className={styles.titleAccent}>reimagined.</span>
                    </h1>
                    <p className={styles.subtitle}>
                        AI-powered insights, instant lab analysis, and personalized wellness — all in one place.
                    </p>
                </motion.div>

                {/* Feature pills */}
                <motion.div
                    className={styles.features}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={f.label}
                            className={styles.featurePill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                        >
                            <div className={styles.featureIcon} style={{ background: `${f.color}18`, color: f.color }}>
                                <f.icon size={18} />
                            </div>
                            <span>{f.label}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    className={styles.ctaWrap}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <button
                        className={styles.ctaButton}
                        onClick={() => navigate('/login')}
                    >
                        Get Started
                    </button>
                    <p className={styles.terms}>
                        By continuing, you agree to our Terms & Privacy Policy
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
