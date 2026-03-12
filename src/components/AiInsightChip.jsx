import styles from './AiInsightChip.module.css';

export default function AiInsightChip({ icon, text }) {
    return (
        <div className={styles.chip}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.text}>{text}</span>
        </div>
    );
}
