import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import styles from './HomeHeader.module.css';

export default function HomeHeader() {
    const { currentUser } = useAuth();
    const firstName = currentUser?.displayName?.split(' ')[0] || 'Friend';

    return (
        <header className={styles.header}>
            <div className={styles.logoAndGreeting}>
                <div className={styles.logoRow}>
                    <span className={styles.logoMain}>Health</span>
                    <span className={styles.logoAccent}>AI</span>
                </div>
                <h1 className={styles.title}>
                    Daily <span className={styles.titleAccent}>Grading</span> System.
                </h1>
            </div>
            <button className={styles.bellBtn}>
                <Bell size={24} />
            </button>
        </header>
    );
}
