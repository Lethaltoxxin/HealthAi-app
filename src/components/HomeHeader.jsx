import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import styles from './HomeHeader.module.css';

export default function HomeHeader() {
    const { currentUser } = useAuth();

    // Use display name or default
    const firstName = currentUser?.displayName?.split(' ')[0] || 'Friend';

    return (
        <header className={styles.header}>
            <div className={styles.greeting}>
                <h1>Hey {firstName},</h1>
                <p>I’m here.</p>
            </div>
            <button className={styles.bellBtn}>
                <Bell size={24} />
            </button>
        </header>
    );
}
