import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Edit2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import styles from './AnalysisResult.module.css';

export default function AnalysisResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we fetch from Firestore.
        // However, since we just pushed it in ScanScreen, we can fetch it.
        // If not found (e.g. reload on demo mode without persisting), fallback to mock.

        async function fetchResult() {
            try {
                const docRef = doc(db, "documents", id);
                const snap = await getDoc(docRef);

                if (snap.exists() && snap.data().analysis) {
                    setData(snap.data().analysis);
                } else {
                    // Fallback mock if direct nav or latency
                    setData({
                        summary: "Blood Test Report",
                        medications: [
                            { name: "Amoxicillin", dosage: "500mg", frequency: "Thrice daily" }
                        ],
                        labValues: [
                            { name: "Hemoglobin", value: "11.2", unit: "g/dL", flag: "low" },
                            { name: "RBC", value: "4.5", unit: "m/uL", flag: "normal" }
                        ],
                        confidence: 0.98
                    });
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }

        fetchResult();
    }, [id]);

    if (loading) return <div>Loading result...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate('/records')}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Result</h1>
                <button className={styles.editBtn}>
                    <Edit2 size={20} />
                </button>
            </header>

            <div className={styles.summaryCard}>
                <h2>{data.summary}</h2>
                <div className={styles.confidence}>
                    <CheckCircle size={16} color="var(--primary-green)" />
                    <span>{(data.confidence * 100).toFixed(0)}% Confidence</span>
                </div>
            </div>

            <section className={styles.section}>
                <h3>Medications</h3>
                {data.medications.map((med, i) => (
                    <div key={i} className={styles.itemCard}>
                        <div className={styles.itemMain}>
                            <h4>{med.name}</h4>
                            <span className={styles.highlight}>{med.dosage}</span>
                        </div>
                        <p className={styles.subtext}>{med.frequency}</p>
                    </div>
                ))}
            </section>

            <section className={styles.section}>
                <h3>Lab Values</h3>
                {data.labValues.map((val, i) => (
                    <div key={i} className={`${styles.itemCard} ${val.flag === 'low' || val.flag === 'high' ? styles.flagged : ''}`}>
                        <div className={styles.itemMain}>
                            <h4>{val.name}</h4>
                            <div className={styles.valueGroup}>
                                <span className={styles.value}>{val.value}</span>
                                <span className={styles.unit}>{val.unit}</span>
                            </div>
                        </div>
                        {val.flag !== 'normal' && (
                            <div className={styles.alert}>
                                <AlertTriangle size={14} />
                                <span>{val.flag.toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            <div className={styles.footer}>
                <button className={styles.verifyBtn} onClick={() => navigate('/records')}>
                    Looks Correct
                </button>
            </div>
        </div>
    );
}
