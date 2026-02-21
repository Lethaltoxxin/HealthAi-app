import { Home, FileText, Scan, BarChart2, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNavigation.module.css';

export default function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        // { id: 'home', icon: Home, label: 'Home', path: '/' }, // Removed per user request
        // { id: 'records', icon: FileText, label: 'Records', path: '/records' }, // Moved to SideDrawer
        { id: 'scan', icon: Scan, label: 'Scan', path: '/scan', primary: true },
        // { id: 'nutrition', icon: BarChart2, label: 'Nutrition', path: '/nutrition' }, // Moved to Drawer
        // { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }, // Moved to Drawer
    ];

    return (
        <nav className={styles.navContainer}>
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={`${styles.navItem} ${isActive ? styles.active : ''} ${tab.primary ? styles.primary : ''}`}
                    >
                        <tab.icon size={24} />
                        <span className={styles.label}>{/* {tab.label} */}</span>
                    </button>
                );
            })}
        </nav>
    );
}
