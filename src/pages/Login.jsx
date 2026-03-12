import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Apple, Mail } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleContinue = (e) => {
        e.preventDefault();
        if (email) {
            navigate('/'); // Redirect user into the main app automatically
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className={styles.container}>
            {/* Ambient Background Glows */}
            <div className={styles.glowTop} />
            <div className={styles.glowBottom} />

            <motion.div
                className={styles.content}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className={styles.logoWrapper}>
                    <svg viewBox="0 0 100 100" className={styles.waveformLogo}>
                        <path
                            d="M 10 50 Q 25 50, 30 30 T 45 70 T 70 50 T 90 50"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.div>

                <motion.div variants={itemVariants} className={styles.header}>
                    <h1 className={styles.title}>HealthAI</h1>
                    <p className={styles.subtitle}>Superintelligence for your health.</p>
                </motion.div>

                <form onSubmit={handleContinue} className={styles.form}>
                    <motion.div variants={itemVariants} className={styles.inputGroup}>
                        <div className={`${styles.inputWrapper} ${isFocused ? styles.inputFocused : ''}`}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                className={styles.emailInput}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className={styles.continueBtn}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>Continue with Email</span>
                            <ArrowRight size={18} />
                        </motion.button>
                    </motion.div>
                </form>

                <motion.div variants={itemVariants} className={styles.divider}>
                    <span>or continue with</span>
                </motion.div>

                <motion.div variants={itemVariants} className={styles.oauthGroup}>
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className={styles.oauthBtn}
                    >
                        <Apple size={20} className={styles.appleIcon} fill="white" />
                        Apple
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className={styles.oauthBtn}
                    >
                        <svg viewBox="0 0 24 24" className={styles.googleIcon}>
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </motion.button>
                </motion.div>

                <motion.p variants={itemVariants} className={styles.terms}>
                    By continuing, you agree to HealthAI's <br />
                    <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                </motion.p>
            </motion.div>
        </div>
    );
}
