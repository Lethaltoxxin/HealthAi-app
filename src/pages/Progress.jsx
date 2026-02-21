import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar, Plus } from 'lucide-react';
import styles from './Progress.module.css';

export default function Progress() {
    const navigate = useNavigate();
    const [weight, setWeight] = useState('');

    // Mock data for the chart
    const data = [
        { day: 'Mon', value: 78, label: '78kg' },
        { day: 'Tue', value: 77.5, label: '77.5kg' },
        { day: 'Wed', value: 77.2, label: '77.2kg' },
        { day: 'Thu', value: 76.8, label: '76.8kg' },
        { day: 'Fri', value: 76.5, label: '76.5kg' },
        { day: 'Sat', value: 76.0, label: '76.0kg' },
        { day: 'Sun', value: 75.8, label: '75.8kg' },
    ];

    const maxVal = Math.max(...data.map(d => d.value)) + 2;
    const minVal = Math.min(...data.map(d => d.value)) - 2;

    const getHeight = (val) => {
        return ((val - minVal) / (maxVal - minVal)) * 100;
    };

    const handleLog = async () => {
        if (!weight) return;
        try {
            await fetch('http://localhost:8000/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_name: 'progress_log',
                    payload: { weight: parseFloat(weight), date: new Date().toISOString() }
                })
            });
            alert("Logged successfully!");
            setWeight('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={24} color="#333" />
                </button>
                <h1>Your Progress</h1>
            </header>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <h2>Weight Trend</h2>
                        <p className={styles.subtitle}>Last 7 Days</p>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>-2.2</span>
                        <span className={styles.statUnit}>kg</span>
                    </div>
                </div>

                <div className={styles.chartContainer}>
                    <div className={styles.chart}>
                        {data.map((d, i) => (
                            <div key={i} className={styles.barGroup}>
                                <div
                                    className={styles.bar}
                                    style={{ height: `${getHeight(d.value)}%` }}
                                >
                                    <div className={styles.tooltip}>{d.label}</div>
                                </div>
                                <span className={styles.axisLabel}>{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.logSection}>
                <h3>Log Today</h3>
                <div className={styles.inputRow}>
                    <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={styles.input}
                    />
                    <button className={styles.addBtn} onClick={handleLog}>
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <TrendingUp size={24} color="#14B8A6" />
                    <h4>Adherence</h4>
                    <p>85%</p>
                </div>
                <div className={styles.statCard}>
                    <Calendar size={24} color="#F59E0B" />
                    <h4>Streak</h4>
                    <p>12 Days</p>
                </div>
            </div>
        </div>
    );
}
