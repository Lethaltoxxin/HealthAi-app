import styles from './ChatComponents.module.css';

export function QuickReplies({ prompts, onSelect }) {
    if (!prompts || prompts.length === 0) return null;

    return (
        <div className={styles.quickContainer}>
            {prompts.map((p, idx) => (
                <button
                    key={idx}
                    className={styles.quickChip}
                    onClick={() => onSelect(p)}
                >
                    {p}
                </button>
            ))}
        </div>
    );
}
