import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../services/storageService';
import { uploadDocumentRecord, updateDocumentStatus } from '../services/dbService';
import { serverTimestamp } from 'firebase/firestore';
import styles from './ScanScreen.module.css';

export default function ScanScreen() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            // 1. Upload to Storage
            // For demo, we might skip actual storage if config is missing, but code is there.
            // const uploadResult = await uploadFile(currentUser?.uid || 'guest', file);

            // Simulate progress
            const interval = setInterval(() => {
                setProgress(p => Math.min(p + 20, 90));
            }, 200);

            const userId = currentUser?.uid || 'guest';

            // 2. Create Document Record
            const docRef = await uploadDocumentRecord(userId, {
                name: file.name,
                type: file.type,
                fileURL: 'https://via.placeholder.com/300', // Mock URL
                status: 'processing'
            });

            // 3. Simulate AI Processing Delay
            setTimeout(async () => {
                clearInterval(interval);
                setProgress(100);

                // 4. Update with Mock Analysis
                const mockAnalysis = {
                    summary: "Blood Test Report",
                    medications: [
                        { name: "Amoxicillin", dosage: "500mg", frequency: "Thrice daily" }
                    ],
                    labValues: [
                        { name: "Hemoglobin", value: "11.2", unit: "g/dL", flag: "low" },
                        { name: "RBC", value: "4.5", unit: "m/uL", flag: "normal" }
                    ],
                    confidence: 0.98
                };

                await updateDocumentStatus(docRef.id, 'complete', mockAnalysis);

                setUploading(false);
                navigate(`/records/${docRef.id}`);
            }, 1000);

        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            {uploading ? (
                <div className={styles.processing}>
                    <div className={styles.loaderRing}>
                        <div className={styles.loaderFill} style={{ height: `${progress}%` }} />
                    </div>
                    <h3>Analyzing Document...</h3>
                    <p>Extracting values and checking for abnormalities</p>
                </div>
            ) : (
                <>
                    <h1 className={styles.title}>Add Record</h1>

                    <div className={styles.actionButtons}>
                        <button
                            className={styles.cardBtn}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className={styles.iconCircle}>
                                <Upload size={32} />
                            </div>
                            <span>Upload File</span>
                        </button>

                        <button className={styles.cardBtn}>
                            <div className={styles.iconCircle}>
                                <Camera size={32} />
                            </div>
                            <span>Take Photo</span>
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className={styles.hiddenInput}
                        accept="image/*,application/pdf"
                        onChange={handleFileSelect}
                    />
                </>
            )}
        </div>
    );
}
