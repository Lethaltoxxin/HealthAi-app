import { useNavigate } from 'react-router-dom';
import { User, Users, Shield, Download, LogOut, ChevronRight, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Settings.module.css';

export default function Settings() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const sections = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Profile' },
                { icon: Users, label: 'Family Access', path: '/settings/family' },
            ]
        },
        {
            title: 'Data & Privacy',
            items: [
                { icon: Shield, label: 'Privacy & Security' },
                { icon: Download, label: 'Download My Data' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: Globe, label: 'Language', value: 'English' },
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Settings</h1>

            {sections.map((section, idx) => (
                <div key={idx} className={styles.section}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <div className={styles.card}>
                        {section.items.map((item, i) => (
                            <div
                                key={i}
                                className={styles.row}
                                onClick={() => item.path && navigate(item.path)}
                            >
                                <div className={styles.rowLeft}>
                                    <div className={styles.iconBox}>
                                        <item.icon size={20} />
                                    </div>
                                    <span>{item.label}</span>
                                </div>
                                <div className={styles.rowRight}>
                                    {item.value && <span className={styles.value}>{item.value}</span>}
                                    <ChevronRight size={16} className={styles.arrow} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={20} />
                Log Out
            </button>

            <p className={styles.version}>HealthAi v1.0.0</p>
        </div>
    );
}
