import { MessageSquare } from 'lucide-react';
import styles from './ChatComponents.module.css';

export function TypingIndicator() {
    return (
        <div className={styles.typingContainer}>
            <div className={styles.avatar}>
                <MessageSquare size={16} color="white" />
            </div>
            <div className={styles.typingBubble}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
            </div>
        </div>
    );
}
