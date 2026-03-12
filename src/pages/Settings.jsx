import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, Smartphone, Activity, Shield, Moon, Bell, MessageCircle, Trash2, LogOut, ChevronRight, Crown, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Settings.module.css';

export default function Settings() {
    const navigate = useNavigate();
    const [toggles, setToggles] = useState({
        appleHealth: true,
        googleFit: true,
        whoop: false,
        saveChatHistory: true,
        notifications: true,
        biometricLock: false,
        darkMode: false,
    });
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showSignOut, setShowSignOut] = useState(false);
    const [cleared, setCleared] = useState(false);

    const toggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleClearHistory = () => {
        setCleared(true);
        setShowClearConfirm(false);
        setTimeout(() => setCleared(false), 2500);
    };

    const ToggleSwitch = ({ active, onToggle }) => (
        <motion.button className={`${styles.toggle} ${active ? styles.toggleOn : ''}`} onClick={onToggle} whileTap={{ scale: 0.9 }}>
            <motion.div className={styles.toggleThumb} layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </motion.button>
    );

    return (
        <div className={styles.settingsPage}>
            <header className={styles.topBar}>
                <h1 className={styles.pageTitle}>Settings</h1>
            </header>

            {/* Account */}
            <section className={styles.group}>
                <span className={styles.groupLabel}>ACCOUNT</span>
                <div className={styles.groupCard}>
                    <div className={styles.profileRow}>
                        <div className={styles.profileAvatar}>A</div>
                        <div className={styles.profileInfo}>
                            <span className={styles.profileName}>Alex Rivera</span>
                            <span className={styles.profileBadge}><Crown size={10} /> Premium</span>
                        </div>
                        <ChevronRight size={16} className={styles.rowArrow} />
                    </div>
                    <motion.button className={styles.settingsRow} whileTap={{ scale: 0.98 }}>
                        <div className={styles.rowIcon} style={{ background: 'var(--accent-1-dim)', color: 'var(--accent-1)' }}><CreditCard size={16} /></div>
                        <span>Manage Subscription</span>
                        <ChevronRight size={16} className={styles.rowArrow} />
                    </motion.button>
                </div>
            </section>

            {/* Integrations */}
            <section className={styles.group}>
                <span className={styles.groupLabel}>INTEGRATIONS</span>
                <div className={styles.groupCard}>
                    <div className={styles.settingsRow}>
                        <div className={styles.rowIcon} style={{ background: '#E3F2FD', color: '#1976D2' }}><Smartphone size={16} /></div>
                        <span>Apple Health</span>
                        <ToggleSwitch active={toggles.appleHealth} onToggle={() => toggle('appleHealth')} />
                    </div>
                    <div className={styles.settingsRow}>
                        <div className={styles.rowIcon} style={{ background: '#E8F5E9', color: '#388E3C' }}><Activity size={16} /></div>
                        <span>Google Fit</span>
                        {toggles.googleFit && <span className={styles.statusBadge}>Connected</span>}
                        <ToggleSwitch active={toggles.googleFit} onToggle={() => toggle('googleFit')} />
                    </div>
                    <div className={styles.settingsRow}>
                        <div className={styles.rowIcon} style={{ background: '#FFF3E0', color: '#F57C00' }}><Activity size={16} /></div>
                        <span>Whoop</span>
                        <ToggleSwitch active={toggles.whoop} onToggle={() => toggle('whoop')} />
                    </div>
                    <motion.button className={styles.settingsRow} whileTap={{ scale: 0.98 }}>
                        <div className={styles.rowIcon} style={{ background: '#F3E5F5', color: '#7B1FA2' }}><Activity size={16} /></div>
                        <span>Manual Entry</span>
                        <span className={styles.statusBadge}>Active</span>
                        <ChevronRight size={16} className={styles.rowArrow} />
                    </motion.button>
                </div>
            </section>

            {/* AI & Chat */}
            <section className={styles.group}>
                <span className={styles.groupLabel}>AI & CHAT</span>
                <div className={styles.groupCard}>
                    <div className={styles.settingsRow}>
                        <div className={styles.rowIcon} style={{ background: 'var(--accent-1-dim)', color: 'var(--accent-1)' }}><MessageCircle size={16} /></div>
                        <span>Save Chat History</span>
                        <ToggleSwitch active={toggles.saveChatHistory} onToggle={() => toggle('saveChatHistory')} />
                    </div>
                    <motion.button className={styles.settingsRow} whileTap={{ scale: 0.98 }} onClick={() => setShowClearConfirm(true)}>
                        <div className={styles.rowIcon} style={{ background: '#FFEBEE', color: '#D32F2F' }}><Trash2 size={16} /></div>
                        <span>Clear Chat History</span>
                        <ChevronRight size={16} className={styles.rowArrow} />
                    </motion.button>
                </div>
            </section>

            {/* Preferences */}
            <section className={styles.group}>
                <span className={styles.groupLabel}>PREFERENCES</span>
                <div className={styles.groupCard}>
                    <div className={styles.settingsRow}>
                        <div className={styles.rowIcon} style={{ background: '#E8EAF6', color: '#3949AB' }}><Bell size={16} /></div>
                        <span>Notifications</span>
                        <ToggleSwitch active={toggles.notifications} onToggle={() => toggle('notifications')} />
                    </div>
                    <div className={styles.settingsRow}>
                        <div className={styles.rowIcon} style={{ background: '#E0F2F1', color: '#00897B' }}><Shield size={16} /></div>
                        <span>Biometric Lock</span>
                        <ToggleSwitch active={toggles.biometricLock} onToggle={() => toggle('biometricLock')} />
                    </div>
                    <div className={styles.settingsRow}>
                        <div className={styles.rowIcon} style={{ background: '#EDE7F6', color: '#5E35B1' }}><Moon size={16} /></div>
                        <span>Dark Mode</span>
                        <ToggleSwitch active={toggles.darkMode} onToggle={() => toggle('darkMode')} />
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className={styles.group}>
                <div className={styles.dangerCard}>
                    <motion.button className={styles.dangerBtn} whileTap={{ scale: 0.97 }} onClick={() => setShowSignOut(true)}>
                        <LogOut size={16} />
                        Sign Out
                    </motion.button>
                </div>
            </section>

            {/* Clear History Confirm */}
            <AnimatePresence>
                {showClearConfirm && (
                    <>
                        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowClearConfirm(false)} />
                        <motion.div className={styles.dialog} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <span className={styles.dialogTitle}>Clear Chat History?</span>
                            <span className={styles.dialogDesc}>This will permanently delete all your chat conversations. This action cannot be undone.</span>
                            <div className={styles.dialogActions}>
                                <button className={styles.dialogCancel} onClick={() => setShowClearConfirm(false)}>Cancel</button>
                                <motion.button className={styles.dialogConfirm} whileTap={{ scale: 0.95 }} onClick={handleClearHistory}>Delete All</motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Sign Out Confirm */}
            <AnimatePresence>
                {showSignOut && (
                    <>
                        <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSignOut(false)} />
                        <motion.div className={styles.dialog} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <span className={styles.dialogTitle}>Sign Out?</span>
                            <span className={styles.dialogDesc}>You'll need to sign in again to access your health data and AI features.</span>
                            <div className={styles.dialogActions}>
                                <button className={styles.dialogCancel} onClick={() => setShowSignOut(false)}>Cancel</button>
                                <motion.button className={styles.dialogConfirm} whileTap={{ scale: 0.95 }} onClick={() => setShowSignOut(false)}>Sign Out</motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {cleared && (
                    <motion.div className={styles.toast} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}>
                        ✅ Chat history cleared successfully
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
