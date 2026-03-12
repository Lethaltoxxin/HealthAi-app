import { useNavigate } from 'react-router-dom';
import { X, User, Settings, PieChart, Info, LogOut, FileText, Moon, TrendingUp, Brain, Utensils, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './SideDrawer.module.css';

export default function SideDrawer({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    // User Display Name
    const userName = currentUser?.displayName || 'User';
    const userEmail = currentUser?.email || '';

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/intro');
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.drawer}>
                <header className={styles.header}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className={styles.name}>{userName}</h3>
                            <p className={styles.email}>{userEmail}</p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <nav className={styles.nav}>
                    <button onClick={() => handleNavigate('/records')} className={styles.navItem}>
                        <FileText size={20} />
                        <span>Records</span>
                    </button>

                    <button onClick={() => handleNavigate('/explore')} className={styles.navItem}>
                        <Info size={20} />
                        <span>Explore</span>
                    </button>

                    <button onClick={() => handleNavigate('/workout')} className={styles.navItem}>
                        <PieChart size={20} />
                        <span>Workout</span>
                    </button>

                    <button onClick={() => handleNavigate('/recovery')} className={styles.navItem}>
                        <TrendingUp size={20} />
                        <span>Recovery</span>
                    </button>

                    <button onClick={() => handleNavigate('/mindfulness')} className={styles.navItem}>
                        <Brain size={20} />
                        <span>Mindset</span>
                    </button>

                    <button onClick={() => handleNavigate('/sleep')} className={styles.navItem}>
                        <Moon size={20} />
                        <span>Sleep</span>
                    </button>

                    <button onClick={() => handleNavigate('/nutrition-onboarding')} className={styles.navItem}>
                        <Utensils size={20} />
                        <span>Nutrition Plan</span>
                    </button>

                    <button onClick={() => handleNavigate('/settings')} className={styles.navItem}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                </nav>

                <footer className={styles.footer}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </footer>
            </div>
        </>
    );
}
