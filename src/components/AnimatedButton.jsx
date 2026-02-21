import { motion } from 'framer-motion';

const buttonStyles = {
    base: {
        padding: '12px 24px',
        borderRadius: '12px', // var(--radius-md)
        fontSize: '16px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden'
    },
    primary: {
        background: 'var(--primary)',
        color: '#ffffff', // Always white on primary
        boxShadow: '0 4px 14px 0 rgba(13, 148, 136, 0.39)' // Colored shadow
    },
    secondary: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--text-main)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    ghost: {
        background: 'transparent',
        color: 'var(--primary-light)',
        padding: '8px 16px'
    }
};

export default function AnimatedButton({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    ...props
}) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            style={{ ...buttonStyles.base, ...buttonStyles[variant] }}
            className={className}
            whileHover={!disabled ? {
                scale: 1.05,
                filter: 'brightness(1.1)'
            } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
