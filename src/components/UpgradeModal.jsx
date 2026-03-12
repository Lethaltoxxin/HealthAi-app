import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, FileText, MessageSquare, Utensils, Moon } from 'lucide-react';
import { useState } from 'react';
import styles from './UpgradeModal.module.css';

const features = [
    { icon: MessageSquare, label: 'Unlimited AI Health Coaching' },
    { icon: FileText, label: 'Advanced Prescription & Report Analysis' },
    { icon: Zap, label: 'Full Symptom History & Tracking' },
    { icon: Utensils, label: '7-Day Nutrition Planning' },
    { icon: Moon, label: 'Priority Sleep & HRV Insights' },
];

export default function UpgradeModal({ isOpen, onClose }) {
    const [plan, setPlan] = useState('annual');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.div
                className={styles.sheet}
                initial={{ y: '100%', opacity: 0.3 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            >
                <div className={styles.handle} />

                <div className={styles.header}>
                    <span className={styles.badge}>HEALTHAI PRO</span>
                    <h2 className={styles.headline}>Unlock Everything</h2>
                    <p className={styles.subline}>Your complete health intelligence companion</p>
                </div>

                <div className={styles.featureList}>
                    {features.map((f, i) => (
                        <motion.div key={i} className={styles.featureRow} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                            <div className={styles.featureIcon}><f.icon size={18} /></div>
                            <span className={styles.featureLabel}>{f.label}</span>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.planToggle}>
                    <button className={`${styles.planBtn} ${plan === 'monthly' ? styles.planActive : ''}`} onClick={() => setPlan('monthly')}>
                        <span className={styles.planPrice}>$9.99</span>
                        <span className={styles.planPeriod}>/ month</span>
                    </button>
                    <button className={`${styles.planBtn} ${plan === 'annual' ? styles.planActive : ''}`} onClick={() => setPlan('annual')}>
                        <span className={styles.planPrice}>$79.99</span>
                        <span className={styles.planPeriod}>/ year</span>
                        <span className={styles.saveBadge}>Save 33%</span>
                    </button>
                </div>

                <motion.button className={styles.ctaBtn} whileTap={{ scale: 0.98 }}>
                    <Sparkles size={18} />
                    Start Free Trial
                </motion.button>

                <button className={styles.pilotLink}>Or contact us for Pilot Partnerships →</button>
            </motion.div>
        </AnimatePresence>
    );
}
