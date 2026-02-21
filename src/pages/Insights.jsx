import { TrendingUp, AlertCircle, Activity } from 'lucide-react';
import styles from './Insights.module.css';

export default function Insights() {
    // Mock Data for charts
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Health Insights</h1>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <TrendingUp size={20} className={styles.icon} />
                    <h2>Trends</h2>
                </div>
                <div className={styles.chartCard}>
                    <h3>Hemoglobin Levels</h3>
                    <div className={styles.chartPlaceholder}>
                        {/* Simple CSS Bar Chart */}
                        <div className={styles.barGroup}>
                            <div className={styles.bar} style={{ height: '60%' }}></div>
                            <span>Jan</span>
                        </div>
                        <div className={styles.barGroup}>
                            <div className={styles.bar} style={{ height: '65%' }}></div>
                            <span>Feb</span>
                        </div>
                        <div className={styles.barGroup}>
                            <div className={styles.bar} style={{ height: '55%', background: 'var(--warning)' }}></div>
                            <span>Mar</span>
                        </div>
                        <div className={styles.barGroup}>
                            <div className={styles.bar} style={{ height: '70%' }}></div>
                            <span>Apr</span>
                        </div>
                    </div>
                    <p className={styles.chartNote}>Dip in March due to viral infection.</p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <AlertCircle size={20} className={styles.icon} />
                    <h2>Attention Needed</h2>
                </div>
                <div className={styles.alertCard}>
                    <div className={styles.alertIcon}>!</div>
                    <div className={styles.alertContent}>
                        <h3>Vitamin D Deficiency</h3>
                        <p>Last 2 reports show low levels.</p>
                    </div>
                    <button className={styles.actionBtn}>View Plan</button>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Activity size={20} className={styles.icon} />
                    <h2>Vitals</h2>
                </div>
                <div className={styles.grid}>
                    <div className={styles.vitalCard}>
                        <span className={styles.vitalLabel}>BP</span>
                        <span className={styles.vitalValue}>120/80</span>
                    </div>
                    <div className={styles.vitalCard}>
                        <span className={styles.vitalLabel}>Heart Rate</span>
                        <span className={styles.vitalValue}>72 <small>bpm</small></span>
                    </div>
                </div>
            </section>
        </div>
    );
}
