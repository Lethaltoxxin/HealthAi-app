import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.99 },
};

const pageTransition = {
    duration: 0.35,
    ease: [0.33, 1, 0.68, 1], // Custom cubic-bezier for a snappy but smooth feel
};

export default function PageTransition({ children }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            style={{ minHeight: '100%' }}
        >
            {children}
        </motion.div>
    );
}
