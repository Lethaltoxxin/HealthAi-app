import React, { useState } from 'react';
import { Camera, Plus, Check, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { mockApi } from '../utils/mockApi';
import { trackEvent } from '../utils/analytics';
import styles from './Prescription.module.css';

export default function Prescription() {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [meds, setMeds] = useState([]);

    const handleScan = async () => {
        setScanning(true);
        trackEvent('prescription_scan_start');

        try {
            // Fake an OCR extraction delay for realism
            await new Promise(r => setTimeout(r, 2000));
            const formData = new FormData();
            formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'prescription.jpg');

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/api/prescription/scan`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            // Map backend response to frontend format if needed
            // Backend returns: { parsed: [...] }
            // Frontend expects: { meds: [...] }
            setMeds(result.parsed.map(p => ({
                name: p.name,
                dose: p.dose,
                frequency: p.freq,
                notes: p.notes
            })));
            trackEvent('prescription_scan_complete', { count: result.parsed.length });
        } catch (error) {
            console.error(error);
            // Fallback
            setMeds([
                { name: "Metformin", dose: "500 mg", frequency: "Twice daily", notes: "Mock Fallback" }
            ]);
        } finally {
            setScanning(false);
        }
    };

    const handleAdd = (medName) => {
        trackEvent('med_add', { medName });
        // Simulate adding to tracker
        alert(`Added ${medName} to your schedule!`);
    };

    const handleDiscussAI = () => {
        const medsList = meds.map(m => `${m.name} (${m.dose}, ${m.frequency})`).join(', ');
        sessionStorage.setItem('pendingScanResult', JSON.stringify({
            analysis: `I've analyzed your prescription. It includes: ${medsList}. What would you like to know about these medications?`,
            documentType: 'prescription',
            filename: 'Scanned_Prescription.jpg',
            extractedText: `Detected meds: ${medsList}`
        }));
        navigate('/chat');
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                <header className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1>Prescriptions</h1>
                </header>

                {meds.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.cameraCircle} onClick={handleScan}>
                            {scanning ? (
                                <div className={styles.scanner} />
                            ) : (
                                <Camera size={32} />
                            )}
                        </div>
                        <h2>Scan a Prescription</h2>
                        <p>Take a photo of your prescription or medication bottle to instantly add it.</p>
                        <button
                            className={styles.scanBtn}
                            onClick={handleScan}
                            disabled={scanning}
                        >
                            {scanning ? 'Processing...' : 'Start Scan'}
                        </button>
                    </div>
                ) : (
                    <div className={styles.listSection}>
                        <div className={styles.listHeader}>
                            <h2>Detected Medications</h2>
                            <button className={styles.addManualBtn}>
                                <Plus size={16} /> Manual Add
                            </button>
                        </div>

                        <div className={styles.medGrid}>
                            {meds.map((med, idx) => (
                                <div key={idx} className={styles.medCard}>
                                    <div className={styles.medIcon}>
                                        <div className={styles.pillIcon} />
                                    </div>
                                    <div className={styles.medInfo}>
                                        <h3>{med.name}</h3>
                                        <p className={styles.medDose}>{med.dose}</p>
                                        <div className={styles.medMeta}>
                                            <span><Clock size={12} /> {med.frequency}</span>
                                        </div>
                                        {med.notes && (
                                            <div className={styles.medNote}>
                                                <AlertTriangle size={12} /> {med.notes}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() => handleAdd(med.name)}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.actionRow} style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button className={styles.addManualBtn} style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#F2EEE8', border: 'none', fontWeight: 600 }} onClick={() => setMeds([])}>
                                Scan Another
                            </button>
                            <button className={styles.scanBtn} style={{ flex: 1, margin: 0 }} onClick={handleDiscussAI}>
                                Analyze with AI
                            </button>
                        </div>

                        <div className={styles.disclaimer} style={{ marginTop: '24px', textAlign: 'center', opacity: 0.6, fontSize: '13px' }}>
                            Please verify all details with your actual prescription before taking medication.
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
