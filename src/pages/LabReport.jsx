import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { mockApi } from '../utils/mockApi';
import { trackEvent } from '../utils/analytics';
import styles from './LabReport.module.css';

export default function LabReport() {
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = async (file) => {
        setUploading(true);
        trackEvent('report_upload_start');

        try {
            const result = await mockApi.parseReport(file);
            setReportData(result);
            trackEvent('report_parsed', { id: result.reportId });
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                <header className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1>Lab Reports</h1>
                </header>

                {!reportData && (
                    <div className={styles.uploadSection}>
                        <div
                            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                className={styles.fileInput}
                                onChange={handleFileSelect}
                            />
                            <label htmlFor="file-upload" className={styles.uploadLabel}>
                                {uploading ? (
                                    <div className={styles.uploadingState}>
                                        <div className={styles.spinner}></div>
                                        <p>Analyzing report...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.iconCircle}>
                                            <Upload size={24} />
                                        </div>
                                        <p className={styles.uploadText}>
                                            <strong>Click to upload</strong> or drag and drop
                                        </p>
                                        <p className={styles.uploadSubtext}>PDF, JPG, or PNG</p>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                )}

                {reportData && (
                    <div className={styles.resultsSection}>
                        <div className={styles.reportSummary}>
                            <FileText size={20} className={styles.summaryIcon} />
                            <div>
                                <h3>Blood Work Analysis</h3>
                                <p>Processed just now</p>
                            </div>
                        </div>

                        <div className={styles.resultsGrid}>
                            {reportData.parsed.map((item, idx) => (
                                <div key={idx} className={styles.resultCard}>
                                    <div className={styles.resultHeader}>
                                        <span className={styles.testName}>{item.test}</span>
                                        {item.note === 'Normal' ? (
                                            <span className={styles.badgeNormal}><CheckCircle size={12} /> Normal</span>
                                        ) : (
                                            <span className={styles.badgeWarning}><AlertCircle size={12} /> {item.note}</span>
                                        )}
                                    </div>
                                    <div className={styles.resultValue}>{item.value}</div>
                                    <div className={styles.resultRange}>Target: {item.range}</div>
                                </div>
                            ))}
                        </div>

                        <button className={styles.actionBtn}>
                            Ask AI about these results
                        </button>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
