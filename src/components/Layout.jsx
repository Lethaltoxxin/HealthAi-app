import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import SideDrawer from './SideDrawer';
import styles from './Layout.module.css';

export default function Layout() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className={styles.container}>
            {/* Mobile Header */}
            <header className={styles.header}>
                <button onClick={() => setIsDrawerOpen(true)} className={styles.menuBtn}>
                    <Menu size={24} />
                </button>
                <span className={styles.logo}>HealthAi</span>
                <div style={{ width: 24 }} /> {/* Spacer for centering */}
            </header>

            <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

            <main className={styles.main}>
                <Outlet />
            </main>

            <BottomNavigation />
        </div>
    );
}
