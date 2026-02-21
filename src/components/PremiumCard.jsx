import { motion } from 'framer-motion';
import styles from './PremiumCard.module.css';

const variants = {
    glass: styles.glass,
    filled: styles.filled,
    outline: styles.outline,
    neobrutal: styles.neobrutal
};

const hoverEffects = {
    lift: { y: -8, boxShadow: 'var(--shadow-lg)' },
    glow: { boxShadow: 'var(--shadow-glow)', borderColor: 'var(--primary)' },
    scale: { scale: 1.02 }
};

export default function PremiumCard({
    children,
    variant = 'glass',
    hover = 'lift',
    onClick,
    className = '',
    delay = 0
}) {
    return (
        <motion.div
            className={`${styles.card} ${variants[variant]} ${className}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={hoverEffects[hover]}
            whileTap={{ scale: 0.98 }}
        >
            {children}
        </motion.div>
    );
}
