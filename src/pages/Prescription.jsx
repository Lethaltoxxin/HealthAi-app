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
            // Create a dummy file for demo if no real file input
            const formData = new FormData();
            formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'prescription.jpg');

            const response = await fetch('http://localhost:8000/api/prescription/scan', {
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

                        <div className={styles.disclaimer}>
                            Please verify all details with your actual prescription before taking medication.
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
