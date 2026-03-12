import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, FileText, Pill, ArrowRight, Check, Loader, X, AlertTriangle, Clock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromImage, extractTextFromPDF, detectFileType } from '../services/ocrService';
import { analyzeFileContent } from '../services/healthAI';
import { saveRecord, getRecentRecords, formatTime } from '../services/recordsService';
import styles from './ScanScreen.module.css';

export default function ScanScreen() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('prescription');
    const [scanning, setScanning] = useState(false);
    const [scanPhase, setScanPhase] = useState(''); // 'reading' | 'extracting' | 'analysing'
    const [scanComplete, setScanComplete] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [savedToRecords, setSavedToRecords] = useState(false);
    const [recentScans, setRecentScans] = useState([]);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Load real recent scans from localStorage
    useEffect(() => {
        loadRecentScans();
    }, []);

    const loadRecentScans = () => {
        const records = getRecentRecords(5);
        setRecentScans(records.map(r => ({
            id: r.id,
            title: r.title || r.filename || 'Untitled Scan',
            type: r.type || 'Document',
            date: formatTime(r.scannedAt),
            fullDate: r.scannedAt,
            icon: r.documentType === 'prescription' ? Pill : FileText,
            // Store the full record for viewing
            record: r,
        })));
    };

    const handleFileSelected = async (file) => {
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setScanError('Please upload a JPG, PNG, or PDF file.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setScanError('File size must be under 10MB.');
            return;
        }

        setScanning(true);
        setScanComplete(false);
        setScanResult(null);
        setScanError(null);
        setSavedToRecords(false);

        try {
            // Phase 1: Read & extract text using Gemini Vision
            setScanPhase('reading');
            let extractedText = '';

            if (file.type === 'application/pdf') {
                setScanPhase('extracting');
                extractedText = await extractTextFromPDF(file);
            } else if (file.type.startsWith('image/')) {
                setScanPhase('extracting');
                extractedText = await extractTextFromImage(file);
            } else {
                extractedText = `File "${file.name}" uploaded.`;
            }

            // Check if OCR got enough text
            if (!extractedText || extractedText.trim().length < 15) {
                setScanning(false);
                setScanError(
                    `Couldn't read enough text from "${file.name}".\n\n` +
                    'Tips for better results:\n' +
                    '• Ensure the document is well-lit and in focus\n' +
                    '• Make sure the full document is visible\n' +
                    '• Try a higher resolution image\n\n' +
                    'You can also tap "Discuss with AI Assistant" to type out the details.'
                );
                return;
            }

            // Phase 2: Detect document type & send to AI
            setScanPhase('analysing');
            const documentType = detectFileType(file.name, extractedText);
            const { text: analysisText, confidence } = await analyzeFileContent(extractedText, documentType);

            const result = {
                title: file.name,
                type: documentType === 'prescription' ? 'Prescription' : 'Medical Report',
                documentType,
                analysisText,
                confidence,
                extractedTextPreview: extractedText.slice(0, 500),
                filename: file.name,
            };

            // Phase 3: Auto-save to records
            const savedRecord = saveRecord(result);
            result.recordId = savedRecord.id;

            // Phase 4: Display result
            setScanning(false);
            setScanComplete(true);
            setScanResult(result);
            setSavedToRecords(true);

            // Refresh recent scans list
            loadRecentScans();
        } catch (error) {
            console.error('Scan error:', error);
            setScanning(false);
            setScanError(
                error?.message ||
                `Something went wrong processing "${file.name}". Please try again or upload a different file.`
            );
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleCameraClick = () => {
        cameraInputRef.current?.click();
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelected(file);
        e.target.value = '';
    };

    const clearResult = () => {
        setScanComplete(false);
        setScanResult(null);
        setScanError(null);
        setScanPhase('');
        setSavedToRecords(false);
    };

    const handleDiscussWithAI = () => {
        if (scanResult) {
            // Pass analysis to chat via sessionStorage
            sessionStorage.setItem('pendingScanResult', JSON.stringify({
                analysis: scanResult.analysisText,
                confidence: scanResult.confidence,
                documentType: scanResult.documentType,
                filename: scanResult.filename,
                extractedText: scanResult.extractedTextPreview,
            }));
        }
        navigate('/chat');
    };

    const handleViewRecord = (scan) => {
        if (scan.record) {
            // Navigate to record detail or show inline
            setScanResult({
                title: scan.record.title || scan.record.filename || 'Untitled',
                type: scan.record.type || 'Document',
                analysisText: scan.record.analysisText || 'No analysis available.',
                confidence: scan.record.confidence || 0,
                extractedTextPreview: scan.record.extractedTextPreview || '',
                filename: scan.record.filename || scan.record.title,
                documentType: scan.record.documentType || 'report',
            });
            setScanComplete(true);
            setScanError(null);
            setSavedToRecords(true);
        }
    };

    const getPhaseText = () => {
        switch (scanPhase) {
            case 'reading': return 'Reading document…';
            case 'extracting': return 'Extracting text with AI Vision…';
            case 'analysing': return 'Analysing with AI…';
            default: return 'Processing…';
        }
    };

    return (
        <div className={styles.scanPage}>
            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                style={{ display: 'none' }}
                onChange={handleInputChange}
            />
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleInputChange}
            />

            <header className={styles.topBar}>
                <h1 className={styles.pageTitle}>Scan & Analyse</h1>
            </header>

            {/* Tab Switcher */}
            <div className={styles.tabBar}>
                <button
                    className={`${styles.tab} ${activeTab === 'prescription' ? styles.tabActive : ''}`}
                    onClick={() => { setActiveTab('prescription'); clearResult(); }}
                >
                    <Pill size={16} />
                    Prescription
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'report' ? styles.tabActive : ''}`}
                    onClick={() => { setActiveTab('report'); clearResult(); }}
                >
                    <FileText size={16} />
                    Medical Report
                </button>
            </div>

            {/* Scan Result, Error, or Upload Zone */}
            <AnimatePresence mode="wait">
                {/* Error state */}
                {scanError && (
                    <motion.div
                        key="error"
                        className={styles.resultCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className={styles.resultHeader}>
                            <div className={styles.resultBadge} style={{ background: '#FEE2E2' }}>
                                <AlertTriangle size={16} style={{ color: '#DC2626' }} />
                            </div>
                            <div>
                                <span className={styles.resultTitle}>Could not process document</span>
                            </div>
                            <button className={styles.resultClose} onClick={clearResult}><X size={18} /></button>
                        </div>
                        <p className={styles.resultSummary} style={{ whiteSpace: 'pre-wrap' }}>{scanError}</p>
                        <motion.button className={styles.discussBtn} whileTap={{ scale: 0.97 }} onClick={handleDiscussWithAI}>
                            💬 Discuss with AI Assistant
                        </motion.button>
                        <button className={styles.scanAgainBtn} onClick={clearResult}>
                            Try Again
                        </button>
                    </motion.div>
                )}

                {/* Result state */}
                {scanComplete && scanResult && !scanError ? (
                    <motion.div
                        key="result"
                        className={styles.resultCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className={styles.resultHeader}>
                            <div className={styles.resultBadge}><Check size={16} /></div>
                            <div>
                                <span className={styles.resultTitle}>{scanResult.title}</span>
                                <span className={styles.resultType}>{scanResult.type}</span>
                            </div>
                            <button className={styles.resultClose} onClick={clearResult}><X size={18} /></button>
                        </div>

                        {/* Saved indicator */}
                        {savedToRecords && (
                            <div className={styles.savedBadge}>
                                <Save size={14} />
                                <span>Saved to Records</span>
                            </div>
                        )}

                        {/* Extracted text preview */}
                        {scanResult.extractedTextPreview && scanResult.extractedTextPreview.length > 10 && (
                            <div className={styles.extractedPreview}>
                                <span className={styles.extractedLabel}>TEXT EXTRACTED FROM DOCUMENT</span>
                                <p className={styles.extractedText}>
                                    {scanResult.extractedTextPreview}
                                    {scanResult.extractedTextPreview.length >= 499 && '…'}
                                </p>
                            </div>
                        )}

                        {/* AI Analysis */}
                        <div className={styles.analysisContent}>
                            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, lineHeight: 1.6, fontSize: '13px' }}>
                                {scanResult.analysisText}
                            </p>
                        </div>

                        {/* Confidence */}
                        {scanResult.confidence > 0 && (
                            <div className={styles.confidenceRow}>
                                <span>AI Confidence</span>
                                <div className={styles.confidenceBarBg}>
                                    <div
                                        className={styles.confidenceBarFill}
                                        style={{ width: `${scanResult.confidence}%` }}
                                    />
                                </div>
                                <span className={styles.confidencePct}>{scanResult.confidence}%</span>
                            </div>
                        )}

                        <motion.button className={styles.discussBtn} whileTap={{ scale: 0.97 }} onClick={handleDiscussWithAI}>
                            💬 Discuss with AI Assistant
                        </motion.button>

                        <button className={styles.scanAgainBtn} onClick={clearResult}>
                            Scan Another
                        </button>
                    </motion.div>
                ) : !scanError && (
                    <motion.div
                        key={activeTab}
                        className={styles.uploadZone}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={styles.uploadDashed}>
                            {scanning ? (
                                <motion.div className={styles.scanningState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                                        <Loader size={40} style={{ color: 'var(--accent-cobalt)' }} />
                                    </motion.div>
                                    <span className={styles.uploadTitle}>{getPhaseText()}</span>
                                    <span className={styles.uploadDesc}>
                                        AI is processing your {activeTab === 'prescription' ? 'prescription' : 'report'}
                                    </span>
                                </motion.div>
                            ) : (
                                <>
                                    <div className={styles.uploadIcon}>
                                        {activeTab === 'prescription' ? <Pill size={32} /> : <FileText size={32} />}
                                    </div>
                                    <span className={styles.uploadTitle}>
                                        {activeTab === 'prescription' ? 'Scan Prescription' : 'Upload Medical Report'}
                                    </span>
                                    <span className={styles.uploadDesc}>
                                        Take a photo or upload a file for instant AI analysis
                                    </span>
                                    <div className={styles.uploadBtns}>
                                        <motion.button className={styles.cameraBtn} whileTap={{ scale: 0.95 }} onClick={handleCameraClick}>
                                            <Camera size={18} />
                                            Camera
                                        </motion.button>
                                        <motion.button className={styles.fileBtn} whileTap={{ scale: 0.95 }} onClick={handleUploadClick}>
                                            <Upload size={18} />
                                            Upload
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recent Scans */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionLabel}>RECENT SCANS</span>
                    <button className={styles.seeAll} onClick={() => navigate('/records')}>View all →</button>
                </div>
                <div className={styles.scanList}>
                    {recentScans.length === 0 ? (
                        <div className={styles.emptyScans}>
                            <span>No scans yet. Upload a prescription or report to get started.</span>
                        </div>
                    ) : (
                        recentScans.map((scan) => (
                            <motion.button
                                key={scan.id}
                                className={styles.scanRow}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleViewRecord(scan)}
                            >
                                <div className={styles.scanIcon}>
                                    <scan.icon size={18} />
                                </div>
                                <div className={styles.scanInfo}>
                                    <span className={styles.scanTitle}>{scan.title}</span>
                                    <span className={styles.scanMeta}>
                                        {scan.type} · {scan.date}
                                    </span>
                                </div>
                                <ArrowRight size={16} className={styles.scanArrow} />
                            </motion.button>
                        ))
                    )}
                </div>
            </section>

            {/* AI Tip */}
            <div className={styles.aiTip}>
                <span className={styles.aiTipIcon}>💡</span>
                <span>Tip: For best results, take photos in well-lit conditions with the full document visible.</span>
            </div>
        </div>
    );
}
