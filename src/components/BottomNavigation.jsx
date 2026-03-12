import { Home, MessageCircle, Scan, Compass, Utensils, TrendingUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNavigation.module.css';

const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', path: '/chat' },
    { id: 'scan', icon: Scan, label: 'Scan', path: '/scan', isFab: true },
    { id: 'explore', icon: Compass, label: 'Explore', path: '/explore' },
    { id: 'nutrition', icon: Utensils, label: 'Nutrition', path: '/nutrition' },
    { id: 'progress', icon: TrendingUp, label: 'Progress', path: '/progress' },
];

export default function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className={styles.nav}>
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.path ||
                    (tab.path !== '/' && location.pathname.startsWith(tab.path));

                if (tab.isFab) {
                    return (
                        <div key={tab.id} className={styles.fabContainer}>
                            <button
                                onClick={() => navigate(tab.path)}
                                className={styles.fab}
                                aria-label={tab.label}
                            >
                                <tab.icon size={26} color="white" strokeWidth={2} />
                            </button>
                        </div>
                    );
                }

                return (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={`${styles.tab} ${isActive ? styles.active : ''}`}
                        aria-label={tab.label}
                    >
                        <div className={styles.tabContent}>
                            <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                            <span className={styles.label}>{tab.label}</span>
                        </div>
                    </button>
                );
            })}
        </nav>
    );
}
