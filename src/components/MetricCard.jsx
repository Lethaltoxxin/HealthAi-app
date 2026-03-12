import styles from './MetricCard.module.css';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({
    label,
    value,
    trend, // 'up' or 'down' or null
    trendValue,
    variant = 'light' // 'light' or 'dark'
}) {
    return (
        <div className={`${styles.card} ${styles[variant]}`}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>

            {trend && trendValue && (
                <div className={`${styles.trend} ${trend === 'up' ? styles.trendUp : styles.trendDown}`}>
                    {trend === 'up' ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
                    <span className={styles.trendValue}>{trendValue}</span>
                </div>
            )}
        </div>
    );
}
