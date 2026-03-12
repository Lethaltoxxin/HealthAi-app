import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, FileText, Pill, ChevronRight, Trash2, ArrowLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecordsGroupedByDate, deleteRecord, formatTime, formatDateTime, getRecords } from '../services/recordsService';
import styles from './RecordsList.module.css';

export default function RecordsList() {
    const navigate = useNavigate();
    const [groupedRecords, setGroupedRecords] = useState({});
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = () => {
        const groups = getRecordsGroupedByDate();
        setGroupedRecords(groups);
        setTotalCount(getRecords().length);
    };

    const handleDelete = (e, recordId) => {
        e.stopPropagation();
        deleteRecord(recordId);
        loadRecords();
        if (selectedRecord?.id === recordId) {
            setSelectedRecord(null);
        }
    };

    const handleRecordClick = (record) => {
        setSelectedRecord(record);
    };

    const getDocIcon = (documentType) => {
        return documentType === 'prescription' ? Pill : FileText;
    };

    // Detail view for a selected record
    if (selectedRecord) {
        return (
            <div className={styles.detailContainer}>
                <header className={styles.detailHeader}>
                    <button onClick={() => setSelectedRecord(null)} className={styles.backBtn}>
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className={styles.detailTitle}>Scan Result</h1>
                </header>

                <div className={styles.detailCard}>
                    <div className={styles.detailTop}>
                        <div className={styles.detailIcon}>
                            {selectedRecord.documentType === 'prescription'
                                ? <Pill size={24} />
                                : <FileText size={24} />
                            }
                        </div>
                        <div className={styles.detailInfo}>
                            <h2>{selectedRecord.title || selectedRecord.filename || 'Untitled'}</h2>
                            <div className={styles.detailMeta}>
                                <span className={`${styles.typeBadge} ${selectedRecord.documentType === 'prescription' ? styles.typePrescription : styles.typeReport}`}>
                                    {selectedRecord.type || 'Document'}
                                </span>
                                <span className={styles.detailTime}>
                                    <Clock size={12} />
                                    {formatDateTime(selectedRecord.scannedAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Confidence */}
                    {selectedRecord.confidence > 0 && (
                        <div className={styles.confidenceRow}>
                            <span>AI Confidence</span>
                            <div className={styles.confidenceBarBg}>
                                <div
                                    className={styles.confidenceBarFill}
                                    style={{ width: `${selectedRecord.confidence}%` }}
                                />
                            </div>
                            <span className={styles.confidencePct}>{selectedRecord.confidence}%</span>
                        </div>
                    )}

                    {/* Extracted text */}
                    {selectedRecord.extractedTextPreview && selectedRecord.extractedTextPreview.length > 10 && (
                        <div className={styles.extractedSection}>
                            <span className={styles.sectionLabel}>EXTRACTED TEXT</span>
                            <p className={styles.extractedText}>{selectedRecord.extractedTextPreview}</p>
                        </div>
                    )}

                    {/* AI Analysis */}
                    {selectedRecord.analysisText && (
                        <div className={styles.analysisSection}>
                            <span className={styles.sectionLabel}>AI ANALYSIS</span>
                            <p className={styles.analysisText}>{selectedRecord.analysisText}</p>
                        </div>
                    )}
                </div>

                <div className={styles.detailActions}>
                    <motion.button
                        className={styles.discussBtn}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            sessionStorage.setItem('pendingScanResult', JSON.stringify({
                                analysis: selectedRecord.analysisText,
                                confidence: selectedRecord.confidence,
                                documentType: selectedRecord.documentType,
                                filename: selectedRecord.filename,
                                extractedText: selectedRecord.extractedTextPreview,
                            }));
                            navigate('/chat');
                        }}
                    >
                        💬 Discuss with AI Assistant
                    </motion.button>
                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => handleDelete(e, selectedRecord.id)}
                    >
                        <Trash2 size={16} />
                        Delete Record
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (totalCount === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.iconWrapper}>
                    <FolderOpen size={48} color="#D0E6F5" fill="#E6F3F0" />
                </div>
                <h2 className={styles.emptyTitle}>No records yet</h2>
                <p className={styles.emptyText}>Scan prescriptions or medical reports to build your health vault.</p>
                <button
                    className={styles.uploadBtn}
                    onClick={() => navigate('/scan')}
                >
                    Scan a Document
                </button>
                <p className={styles.secureNote}>
                    <span className={styles.lockIcon}>🔒</span> Your health data is Secure & Private
                </p>
            </div>
        );
    }

    // Records list grouped by date
    return (
        <div className={styles.listContainer}>
            <header className={styles.listHeader}>
                <h1 className={styles.pageTitle}>Records</h1>
                <span className={styles.recordCount}>{totalCount} scan{totalCount !== 1 ? 's' : ''}</span>
            </header>

            <div className={styles.groupList}>
                {Object.entries(groupedRecords).map(([dateLabel, records]) => (
                    <div key={dateLabel} className={styles.dateGroup}>
                        <div className={styles.dateHeader}>
                            <span className={styles.dateLabel}>{dateLabel}</span>
                            <span className={styles.dateCount}>{records.length}</span>
                        </div>
                        <div className={styles.list}>
                            <AnimatePresence>
                                {records.map((record) => {
                                    const DocIcon = getDocIcon(record.documentType);
                                    return (
                                        <motion.div
                                            key={record.id}
                                            className={styles.card}
                                            onClick={() => handleRecordClick(record)}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className={`${styles.cardIcon} ${record.documentType === 'prescription' ? styles.cardIconRx : ''}`}>
                                                <DocIcon size={20} />
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h3>{record.title || record.filename || 'Untitled Scan'}</h3>
                                                <div className={styles.cardMeta}>
                                                    <span className={`${styles.typeBadge} ${record.documentType === 'prescription' ? styles.typePrescription : styles.typeReport}`}>
                                                        {record.type || 'Document'}
                                                    </span>
                                                    <span className={styles.timeText}>
                                                        <Clock size={11} />
                                                        {formatTime(record.scannedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.cardActions}>
                                                <button
                                                    className={styles.deleteSmallBtn}
                                                    onClick={(e) => handleDelete(e, record.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                                <ChevronRight size={18} className={styles.arrow} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>

            <motion.button
                className={styles.fab}
                onClick={() => navigate('/scan')}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
            >
                +
            </motion.button>
        </div>
    );
}
